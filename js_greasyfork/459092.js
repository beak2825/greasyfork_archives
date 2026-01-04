// ==UserScript==
// @name            VHAddon
// @version         1.2.0
// @description     Blocks ViewHub popups and adds some extra spice.
// @license         GPL
// @match           https://viewhub.show/*
// @grant           none
// @run-at          document-start
// @namespace       https://greasyfork.org/users/1018597
// @require         https://greasyfork.org/scripts/28536-gm-config/code/GM_config.js?version=184529
// @downloadURL https://update.greasyfork.org/scripts/459092/VHAddon.user.js
// @updateURL https://update.greasyfork.org/scripts/459092/VHAddon.meta.js
// ==/UserScript==

(() => {
    "use strict";

    GM_config.init({
        id: "VHAddonConfig",
        title: "VHAddon Configuration (refresh after save)",
        fields: {
            "block_popups": {
                "label": "Hide popups on streamer page",
                "type": "checkbox",
                "default": true,
            },
            "quality_menu": {
                "label": "Enable video quality menu",
                "type": "checkbox",
                "default": true,
            },
            "lowest_start_quality": {
                "label": "Start videos with lowest quality if the quality menu feature is active",
                "type": "checkbox",
                "default": false,
            },
            "video_preview_type": {
                "label": "Show video preview in front page",
                "type": "radio",
                "options": ["never", "mouseover", "always"],
                "default": "always",
            },
            "blocked_users": {
                "label": "Comma separated list of users to hide from the front page",
                "type": "text",
                "size": 100,
            }
        }
    });

    let addon;

    class Importer {
        #load_cache = {};
        #require;

        constructor(require) {
            this.#require = require;
        }

        find_module_id(regex, name) {
            for (const chunk of window.webpackJsonp) {
                if (name && !chunk[0].includes(name)) {
                    continue;
                }
                const modules = chunk[1];
                for (const module_id in modules) {
                    const code = modules[module_id].toString();
                    if (code.match(regex)) {
                        return module_id;
                    }
                }
            }
        }

        must_find_module_id(regex, name) {
            const result = this.find_module_id(regex, name);
            if (!result) {
                throw new Error(`Could not find module matching ${regex}` + (name ? ` in chunk "${name}"` : ""));
            }
            return result;
        }

        module(id) {
            return this.#require(id).a;
        }

        module_es6(id) {
            return this.#require.n(this.#require(id));
        }

        async chunk(name) {
            if (this.#load_cache[name] === true) {
                return;
            }
            if (this.#load_cache[name] === undefined) {
                const self = this;
                this.#load_cache[name] = (async function () {
                    await self.#require.e(name);
                    self.#load_cache[name] = true;
                })();
            }
            await this.#load_cache[name];
        }
    }

    class HLSPlayer {
        static #hls_module = null;
        #internal = null;

        constructor(stream_key, target, level, handler) {
            if (!HLSPlayer.#hls_module) {
                throw new Error("Must call HLSPlayer.init and await on it before constructing an HLSPlayer");
            }
            this.#internal = new HLSPlayer.#hls_module.a({
                xhrSetup: function (xhr, url) {
                    xhr.open("GET", url + "?token=" + Date.now())
                }
            });
            const self = this;
            this.#internal.on("hlsManifestParsed", () => {
                if (!self.#internal) {
                    return; // we were destroyed before arriving here
                }
                if (handler && handler.levels) {
                    handler.levels.call(self.#internal, self.#internal.levels);
                }
                target.muted = "muted";
                target.play();
            });
            if (handler && handler.levelChanged) {
                this.#internal.on("hlsLevelSwitched", function (_, data) {
                    handler.levelChanged.call(self.#internal, data.level);
                });
            }
            if (level !== undefined) {
                this.#internal.startLevel = 0;
                this.#internal.currentLevel = 0;
            }
            this.#internal.attachMedia(target);
            this.#internal.loadSource(`https://c1565z2457.r-cdn.com/LiveApp/streams/${stream_key}_adaptive.m3u8`);
        }

        destroy() {
            if (this.#internal) {
                this.#internal.destroy();
                this.#internal = null;
            }
        }

        static async init() {
            if (HLSPlayer.#hls_module) {
                return; // already initialized
            }
            const importer = addon.importer;
            await importer.chunk("stream");
            const hls_module_id = importer.must_find_module_id(
                /\.\/src\/hls\.ts \*/,
                "stream",
            );
            HLSPlayer.#hls_module = importer.module_es6(hls_module_id);
            if (!HLSPlayer.#hls_module) {
                throw new Error("Failed to load hls module");
            }
        }
    }

    const hlspreview = {
        props: ["poster"],
        data: function () {
            return {};
        },
        beforeUnmount: function () {
            this.stop_preview();
            this.stop_observe();
            this.anchor = null;
        },
        mounted: function () {
            this.anchor = this.get_anchor();
            this.start_observer();
            if (GM_config.get("video_preview_type") === "always") {
                this.start_preview();
            }
        },
        methods: {
            is_mounted() {
                return !!this.anchor;
            },
            get_anchor() {
                const parent = this.$el.parentElement;
                if (parent && parent.tagName == "A") {
                    return parent;
                }
                throw new Error("parent element is not an anchor");
            },
            get_user() {
                const href = this.anchor.getAttribute("href");
                const match = href.match(/\/stream\/([0-9a-zA-Z_]+)/);
                if (match) {
                    return match[1];
                }
            },
            start_observer() {
                if (!this.is_mounted()) {
                    return;
                }
                const self = this;
                this.observer = new MutationObserver((mutations) => {
                    for (const mutation of mutations) {
                        if (mutation.type === "attributes" && mutation.attributeName === "href") {
                            self.restart_preview();
                        }
                    }
                });
                this.observer.observe(this.anchor, {
                    attributes: true
                });
            },
            stop_observer() {
                if (this.observer) {
                    this.observer.disconnect();
                    this.observer = null;
                }
            },
            restart_preview() {
                if (this.hls_player) {
                    this.stop_preview();
                    this.start_preview();
                }
            },
            async start_preview() {
                if (!this.is_mounted()) {
                    return;
                }
                const user = this.get_user();
                if (!user || VHAddon.is_blocked_user(user)) {
                    return;
                }
                const stream_key = await addon.get_stream_key(user);
                if (!stream_key || !this.is_mounted()) {
                    return;
                }
                await HLSPlayer.init();
                if (this.is_mounted() && !this.hls_player) {
                    this.hls_player = new HLSPlayer(stream_key, this.$el.querySelector("video"), 0);
                }
            },
            stop_preview() {
                if (this.hls_player) {
                    this.hls_player.destroy();
                    this.hls_player = null;
                }
            },
            on_hover(b) {
                if (GM_config.get("video_preview_type") !== "mouseover") {
                    return;
                }
                if (b) {
                    if (this.hls_player) {
                        return;
                    }
                    this.start_preview();
                } else {
                    if (!this.hls_player) {
                        return;
                    }
                    this.stop_preview();
                }
            },
        },
        render: function (createElement) {
            const self = this;
            return createElement(
                "div", {
                staticClass: "v-responsive",
                style: {
                    width: 320,
                },
                on: {
                    mouseenter: function () { self.on_hover(true); },
                    mouseleave: function () { self.on_hover(false); },
                }
            },
                [
                    createElement("div", {
                        staticClass: "v-responsive__sizer",
                        style: {
                            "padding-bottom": "56.25%",
                        }
                    }),

                    createElement("video", {
                        attrs: {
                            poster: self.poster,
                        },
                        style: {
                            position: "absolute",
                            top: 0,
                            left: 0,
                            "z-index": 0,
                            width: "100%",
                            height: "100%",
                            display: "block",
                        }
                    }),

                    createElement("div", {
                        staticClass: "v-responsive__content",
                        style: {
                            "z-index": 1,
                        },
                    }, this.$slots.default)
                ]);
        }
    };

    class Component {
        static get_name(component) {
            if (!component || !component.$vnode || typeof component.$vnode.tag !== "string") {
                return;
            }
            const match = component.$vnode.tag.match(/vue\-component\-\d+\-(.+)/);
            if (match) {
                return match[1];
            }
        }

        static hook_renderer(component, hook_cb) {
            function patch(renderer) {
                return function (tag, data, children, normalizationType) {
                    const result = hook_cb(component, renderer, tag, data, children, normalizationType);
                    if (result) {
                        tag = result.tag || tag;
                        data = result.data || data;
                        children = result.children || children;
                        normalizationType = result.normalizationType || normalizationType;
                    }
                    return renderer(tag, data, children, normalizationType);
                }
            }
            if (component._self._c) {
                component._self._c = patch(component._self._c);
            } else if (component.$createElement) {
                component.$createElement = patch(component.$createElement);
            } else {
                throw new Error("hook_renderer: no renderer to hook");
            }
        }

        static is_spacer(tag, data) {
            return tag == "div" && data && data.staticClass && typeof data.staticClass === "string"
                && data.staticClass.includes("spacer");
        }

        static add_config_button(component) {
            Component.hook_renderer(component, function (component, createElement, tag, _data, children) {
                if (tag != "v-footer") {
                    return;
                }
                const config_button = createElement("v-btn", {
                    staticClass: "flexcol mx-auto catalog_footer_btn",
                    attrs: {
                        text: "",
                        height: "54",
                    },
                    on: {
                        click: function () {
                            GM_config.open();
                        },
                    }
                }, [
                    createElement("v-icon", {
                        attrs: {
                            size: "32",
                            left: component.$vuetify.breakpoint.smAndUp
                        }
                    }, ["⚙"]),
                    createElement("span", {
                        staticClass: "footer_button_text",
                    }, [component._v(" VHAddon ")])
                ]);
                for (const i in children) {
                    const child = children[i];
                    if (Component.is_spacer(child.tag, child.data)) {
                        children.splice(i, 0, config_button);
                        return;
                    }
                }
                children.push(config_button);
            });
        }
    }

    class CatalogHub {
        #vue;

        constructor(vue) {
            this.#vue = vue;
            this.#remove_blocked_users_from_catalog();
            this.#make_video_preview();
            Component.add_config_button(vue);
        }

        static #is_preview_image(tag, data) {
            return tag == "v-img" && data && data.attrs && typeof data.attrs.src === "string"
                && data.attrs.src.startsWith("/storage/preview");
        }

        #make_video_preview() {
            if (GM_config.get("video_preview_type") !== "never") {
                Component.hook_renderer(this.#vue, function (_component, _createElement, tag, data, children) {
                    if (CatalogHub.#is_preview_image(tag, data)) {
                        return {
                            tag: "vhaddon_hlspreview",
                            data: {
                                props: {
                                    poster: data.attrs.src,
                                },
                            },
                            children: children,
                        };
                    }
                });
            }
        }

        #remove_blocked_users_from_catalog() {
            const vue = this.#vue;
            vue.$watch("streams", function () {
                this.$nextTick(function () {
                    const blocked_users = VHAddon.get_blocked_users();
                    if (blocked_users.length == 0) {
                        return;
                    }
                    for (const i in vue.streams) {
                        const stream = vue.streams[i];
                        if (blocked_users.includes(stream.username)) {
                            vue.streams.splice(i, 1);
                        }
                    }
                });
            }, { immediate: true, deep: true });
        }

    }

    class VideoQuality {
        #id;
        #data;

        constructor(id, data) {
            this.#id = id;
            this.#data = data;
        }

        get id() { return this.#id; }

        static format(data) {
            return data.width + "x" + data.height + " @ " + data.bitrate.toLocaleString();
        }

        toString() {
            if ("string" === typeof this.#data) {
                return this.#data;
            }
            return VideoQuality.format(this.#data);
        }
    }

    class StreamHub {
        #vue;

        constructor(vue) {
            this.#vue = vue;
            this.#disable_popups();
            this.#enable_video_quality_menu();
            Component.add_config_button(vue);
        }

        #disable_popups() {
            if (GM_config.get("block_popups")) {
                this.#vue.checker_welcome_condition = function () { };
                this.#vue.checker_task_condition = function () { };
            }
        }

        #enable_video_quality_menu() {
            if (!GM_config.get("quality_menu")) {
                return;
            }

            const vue = this.#vue;

            function create_hls_adapter(stream_id, level) {
                HLSPlayer.init().then(() => {
                    const video = document.getElementById(vue.hls_video_id);
                    vue.hls_adapter = new HLSPlayer(stream_id, video, level, {
                        "levels": function (levels) {
                            let items = [new VideoQuality(-1, "AUTO")];
                            for (const level_id in levels) {
                                const level = levels[level_id];
                                items.push(new VideoQuality(level_id, level));
                            }
                            vue.stream_resolutions = items;
                        },
                        "levelChanged": function (id) {
                            const prefix = this.autoLevelEnabled ? "AUTO" : "MANUAL";
                            vue.now_resolution = prefix + " - " + VideoQuality.format(this.levels[id]);
                        },
                    });
                });
            }

            vue.create_hls_adapter = function (stream_id) {
                vue.stream_hls_id = stream_id;
                create_hls_adapter(stream_id, GM_config.get("lowest_start_quality") ? 0 : undefined);
            };

            vue.select_resolution = function (selection) {
                if (!vue.hls_adapter) {
                    return;
                }
                const level = selection.id != -1 ? selection.id : undefined;
                vue.hls_adapter.destroy();
                create_hls_adapter(vue.stream_hls_id, level);
            };
        }
    }

    class VHAddon {
        #importer;
        #vue;

        constructor(importer) {
            this.#importer = importer;
            this.#vue = importer.module(importer.must_find_module_id(
                /\/\*\!\s*\*\sVue\.js v\d+\.\d+\.\d+/m,
                "chunk-vendors",
            ));

            const self = this;
            this.#vue.mixin({
                created: function () { self.#on_component_created(this); },
            });

            if (GM_config.get("video_preview_type") !== "never") {
                this.#vue.component("vhaddon_hlspreview", hlspreview);
            }
        }

        get importer() { return this.#importer };
        get vue() { return this.#vue; }

        async get_stream_key(user) {
            const response = await window.fetch(`https://viewhub.show/api/profile/${user}`);
            const profile = await response.json();
            if (profile.status == "ok" && profile.data.online && profile.data.stream_key) {
                return profile.data.stream_key;
            }
        }

        #on_component_created(component) {
            switch (Component.get_name(component)) {
                case "StreamHub":
                    new StreamHub(component);
                    break;
                case "CatalogHub":
                    new CatalogHub(component);
                    break;
            }
        }

        static get_blocked_users() {
            return GM_config.get("blocked_users").split(",");
        }

        static is_blocked_user(name) {
            return VHAddon.get_blocked_users().includes(name);
        }
    }

    (window.webpackJsonp = window.webpackJsonp || []).push([
        ["vhaddon"],
        {
            "vhaddon": (_, __, require) => {
                addon = new VHAddon(new Importer(require));
            },
        },
        [
            ["vhaddon", "chunk-vendors"]
        ]
    ]);
})();