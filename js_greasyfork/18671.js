// ==UserScript==
// @name         Inject2Download
// @namespace    http://lkubuntu.wordpress.com/
// @version      0.4.8
// @description  Simple media download script
// @author       Anonymous Meerkat
// @include      *
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        none
// @license      MIT License
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/18671/Inject2Download.user.js
// @updateURL https://update.greasyfork.org/scripts/18671/Inject2Download.meta.js
// ==/UserScript==

// NOTE: This script now requires GM_setValue/getValue for storing preferences

(function() {
    "use strict";

    var injected_set = {};
    var did_prefs = false;

    function get_window() {
        var win = window;
        if (typeof unsafeWindow !== "undefined")
            win = unsafeWindow;
        return win;
    }

    var win = get_window();

    // Most of these are disabled by default in order to avoid modifying the user experience in unexpected ways
    var config_template = {
        simpleplayers: {
            name: "Replace with native players if possible",
            options: {
                "yes": "Yes",
                "flash": "Only if Flash is used",
                "no": "No"
            },
            default: "no"
        },
        noads: {
            name: "Block ads if possible (using a proper adblocker is highly recommended)",
            default: false
        },
        // TODO: Implement
        /*download: {
            name: "Enable downloading via the player itself if possible",
            default: false
        },*/
        blacklist: {
            name: "Blacklisted domains (one per line)",
            type: "textarea",
            default: [
                "translate.google.com", // Spams audio files
                "live.com"              // Conflicts with $f
            ].join("\n")
        }
    };

    var config = {};

    for (var key in config_template) {
        config[key] = config_template[key].default;
        /*(function(key) {
            GM.getValue(key).then(
                function (data) {
                    if (data !== undefined)
                        config[key] = data;
                },
                function () {}
            );
            })(key);*/


        // Having both work as callbacks is possible, but introduces delay
        // in cases where it's not necessary
        if (typeof GM_getValue !== "undefined") {
            var data = GM_getValue(key);
            if (data !== undefined)
                config[key] = data;
        } else if (typeof GM !== "undefined" && GM.getValue) {
            GM.getValue(key).then(function (data) {
                if (data !== undefined) {
                    config[key] = data;
                }
            }, function() {});
        }
    }

    function check_host(host) {
        var ourhost = window.location.hostname.toLowerCase();
        host = host.replace(/^ */, "").replace(/ *$/, "");
        if (ourhost === host.toLowerCase() ||
            (ourhost.indexOf("." + host) >= 0 &&
             ourhost.indexOf("." + host) === (ourhost.length - host.length - 1))) {
            return true;
        }

        return false;
    }

    function normalize_url(url) {
        if (!url)
            return url;

        return url.replace(/^[a-z]+:\/\//, "//");
    }

    function check_similar_url(url1, url2) {
        return normalize_url(url1) === normalize_url(url2);
    }

    var blacklisted = false;
    var verified_blacklisted = false;
    function check_blacklisted() {
        var blacklist = config.blacklist.split("\n");
        blacklisted = false;
        var host = window.location.hostname.toLowerCase();
        for (var i = 0; i < blacklist.length; i++) {
            var normalized = blacklist[i].replace(/^ */, "").replace(/ *$/, "");
            if (host === normalized.toLowerCase() ||
                (host.indexOf("." + normalized) >= 0 &&
                 host.indexOf("." + normalized) === (host.length - normalized.length - 1))) {
                console.log("[i2d] Blacklisted: " + normalized);
                blacklisted = true;
                break;
            }
        }
        return blacklisted;
    }

    // Preferences
    if (window.location.hostname.toLowerCase() == "anonymousmeerkat.github.io" &&
        window.location.href.indexOf("anonymousmeerkat.github.io/inject2download/prefs.html") >= 0 &&
        !did_prefs) {
        run_on_load(function() {
            var text = [
                "<html><head><title>Inject2Download Preferences</title></head><body style='margin:0;padding:1em'>",
                "<div style='width:100%'><h2>Inject2Download</h2></div>",
                "<div id='prefs'></div>",
                "<div id='save'><button id='savebtn'>Save</button><br /><span id='savetxt'></span></div>",
                "</body></html>"
            ].join("");
            document.documentElement.innerHTML = text;

            var prefs = document.getElementById("prefs");
            prefs.appendChild(document.createElement("hr"));
            for (var key in config_template) {
                var template = config_template[key];

                var prefdiv = document.createElement("div");
                prefdiv.id = "pref-" + key;
                prefdiv.style.paddingBottom = "1em";
                var title = document.createElement("div");
                title.style.paddingBottom = ".5em";
                title.innerHTML = template.name;
                prefdiv.appendChild(title);

                if (typeof template.default === "boolean" ||
                    "options" in template) {
                    var options = template.options;
                    if (typeof template.default === "boolean") {
                        options = {
                            "true": "Yes",
                            "false": "No"
                        };
                    }

                    for (var option in options) {
                        var input = document.createElement("input");
                        input.name = key;
                        input.value = option;
                        input.type = "radio";
                        input.id = key + "-" + option;

                        if (config[key].toString() === option)
                            input.setAttribute("checked", true);

                        var label = document.createElement("label");
                        label.setAttribute("for", input.id);
                        label.innerHTML = options[option];

                        prefdiv.appendChild(input);
                        prefdiv.appendChild(label);
                        prefdiv.appendChild(document.createElement("br"));
                    }
                } else if (template.type === "textarea") {
                    var input = document.createElement("textarea");
                    input.name = key;
                    input.style.width = "30em";
                    input.style.height = "10em";
                    input.innerHTML = config[key];

                    prefdiv.appendChild(input);
                } else {
                    var input = document.createElement("input");
                    input.name = key;
                    input.value = config[key];
                    input.style.width = "50em";

                    prefdiv.appendChild(input);
                }

                prefs.appendChild(prefdiv);
                prefs.appendChild(document.createElement("hr"));
            }

            document.getElementById("savebtn").onclick = function() {
                for (var key in config_template) {
                    var els = document.getElementsByName(key);
                    var value = undefined;
                    if (els.length > 1) {
                        // radio
                        for (var i = 0; i < els.length; i++) {
                            if (els[i].checked) {
                                value = els[i].value;
                                if (value === "true")
                                    value = true;
                                if (value === "false")
                                    value = false;
                                break;
                            }
                        }
                    } else {
                        if (els[0].tagName === "INPUT") {
                            value = els[0].value;
                        } else if (els[0].tagName === "TEXTAREA") {
                            value = els[0].value;
                        }
                    }
                    console.log("[i2d] " + key + " = " + value);

                    if (typeof GM_setValue !== "undefined")
                        GM_setValue(key, value);
                    else if (typeof GM !== "undefined" && GM.setValue)
                        GM.setValue(key, value);
                }
                document.getElementById("savetxt").innerHTML = "Saved!";
                setTimeout(function() {
                    document.getElementById("savetxt").innerHTML = "";
                }, 3000);
            };

            console.log("[i2d] Finished rendering preferences page");
        });
        did_prefs = true;
    }

    check_blacklisted();

    // Helper functions
    function run_on_load(f) {
        if (document.readyState === "complete" ||
            document.readyState === "interactive") {
            f();
        } else {
            var listener = function() {
                if (document.readyState === "complete" ||
                    document.readyState === "interactive") {
                    f();

                    document.removeEventListener("readystatechange", listener);
                }
            };

            document.addEventListener("readystatechange", listener);
            //document.addEventListener('DOMContentLoaded', f, false);
            //window.addEventListener('load', f, false);
        }
    }

    var i2d_url_list = [];
    function i2d_show_url(namespace, url, description) {
        if (!blacklisted && !verified_blacklisted) {
            if (check_blacklisted()) {
                verified_blacklisted = true;
            }
        }

        if (blacklisted)
            return;

        function get_absolute_url(url) {
            var a = document.createElement('a');
            a.href = url;
            return a.href;
        }

        function run_on_load(f) {
            if (document.readyState === "complete" ||
                document.readyState === "interactive") {
                f();
            } else {
                var listener = function() {
                    if (document.readyState === "complete" ||
                        document.readyState === "interactive") {
                        f();

                        document.removeEventListener("readystatechange", listener);
                    }
                };

                document.addEventListener("readystatechange", listener);
                //document.addEventListener('DOMContentLoaded', f, false);
                //window.addEventListener('load', f, false);
            }
        }

        if (!description)
            description = "";

        if (typeof url !== "string" || url.replace("\s", "").length === 0)
            return;

        if (url.match(/^mediasource:/) || url.match(/^blob:/) || url.match(/^data:/))
            return;

        url = get_absolute_url(url);

        for (var i = 0; i < i2d_url_list.length; i++) {
            if (i2d_url_list[i][0] === namespace &&
                i2d_url_list[i][1] === url &&
                i2d_url_list[i][2] === description)
                    return;
        }


        i2d_url_list.push([namespace, url, description]);

        var newurl = decodeURIComponent(url);

        var text = "[" + namespace + "] " + description + ": ";

        console.log("[i2d] " + text + newurl);

        run_on_load(function() {
            var el = document.getElementById("i2d-popup");
            var elspan = document.getElementById("i2d-popup-x");
            var elspan1 = document.getElementById("i2d-popup-close");
            var elspan2 = document.getElementById("i2d-popup-prefs");
            var eldiv = document.getElementById("i2d-popup-div");
            var eldivhold = document.getElementById("i2d-popup-div-holder");
            if (!el) {
                el = document.createElement("div");
                el.style.all = "initial";
                //el.style.position = "absolute";
                el.style.width = "max(60%, 100em)";
                el.style.height = "max(60%, 100em)";
                el.style.maxWidth = "100%";
                el.style.maxHeight = "100%";
                el.style.height = "auto";
                el.style.width = "auto";
                el.style.background = "white";
                el.style.top = "0px";
                el.style.left = "0px";
                el.style.zIndex = Number.MAX_SAFE_INTEGER - 1;
                el.style.color = "black";
                el.style.fontFamily = "sans-serif";
                el.style.fontSize = "16px";
                el.style.lineHeight = "normal";
                el.style.textAlign = "left";
                el.style.overflow = "scroll";
                el.style.position = "absolute";

                /*el.ondblclick = function() {
                  el.parentElement.removeChild(el);
                  };*/
                eldivhold = document.createElement("div");
                eldivhold.id = "i2d-popup-span-holder";
                eldivhold.style.all = "initial";
                eldivhold.style.width = "100%";
                eldivhold.style.display = "block";
                eldivhold.style.overflow = "auto";
                eldivhold.style.paddingBottom = ".5em";

                elspan = document.createElement("span");
                elspan.style.all = "initial";
                elspan.style.fontSize = "130%";
                elspan.style.cursor = "pointer";
                elspan.style.color = "#900";
                elspan.style.padding = ".1em";
                elspan.style.float = "left";
                elspan.style.display = "inline";
                elspan.id = "i2d-popup-x";
                elspan.innerHTML = '[hide]';
                elspan.style.textDecoration = "underline";
                eldivhold.appendChild(elspan);

                elspan1 = document.createElement("span");
                elspan1.style.all = "initial";
                elspan1.style.fontSize = "130%";
                elspan1.style.cursor = "pointer";
                elspan1.style.color = "#900";
                elspan1.style.padding = ".1em";
                elspan1.style.float = "right";
                //elspan1.style.display = "none";
                elspan1.style.display = "inline";
                elspan1.id = "i2d-popup-close";
                elspan1.innerHTML = '[close]';
                elspan1.style.textDecoration = "underline";
                eldivhold.appendChild(elspan1);

                elspan2 = document.createElement("a");
                elspan2.style.all = "initial";
                elspan2.style.fontSize = "130%";
                elspan2.style.cursor = "pointer";
                elspan2.style.color = "#900";
                elspan2.style.padding = ".1em";
                elspan2.style.float = "left";
                //elspan1.style.display = "none";
                elspan2.style.display = "inline";
                elspan2.id = "i2d-popup-prefs";
                elspan2.innerHTML = '[options]';
                elspan2.href = "https://anonymousmeerkat.github.io/inject2download/prefs.html";
                elspan2.setAttribute("target", "_blank");
                elspan2.style.textDecoration = "underline";
                eldivhold.appendChild(elspan2);

                //el.innerHTML = "<br style='line-height:150%' />";
                el.id = "i2d-popup";
                eldiv = document.createElement("div");
                eldiv.style.all = "initial";
                eldiv.id = "i2d-popup-div";
                //eldiv.style.display = "none";
                eldiv.style.display = "block";
                el.appendChild(eldiv);
                el.insertBefore(eldivhold, el.firstChild);
                document.documentElement.appendChild(el);

                elspan.onclick = function() {
                    /*var el = document.getElementById("i2d-popup");
                      el.parentElement.removeChild(el);*/
                    var eldiv = document.getElementById("i2d-popup-div");
                    var elspan = document.getElementById("i2d-popup-x");
                    if (eldiv.style.display === "none") {
                        elspan.innerHTML = '[hide]';
                        eldiv.style.display = "block";
                        elspan1.style.display = "inline";
                    } else {
                        elspan.innerHTML = '[show]';
                        eldiv.style.display = "none";
                        elspan1.style.display = "none";
                    }
                };

                elspan1.onclick = function() {
                    var el = document.getElementById("i2d-popup");
                    el.parentElement.removeChild(el);
                };
            }
            var shorturl = newurl;
            if (shorturl.length > 100) {
                shorturl = shorturl.substring(0, 99) + "&hellip;";
            }
            var el_divspan = document.createElement("span");
            el_divspan.style.all = "initial";
            el_divspan.innerHTML = text;
            eldiv.appendChild(el_divspan);
            var el_a = document.createElement("a");
            el_a.href = newurl;
            el_a.style.all = "initial";
            el_a.style.color = "blue";
            el_a.style.textDecoration = "underline";
            el_a.style.cursor = "pointer";
            el_a.title = newurl;
            el_a.innerHTML = shorturl;
            eldiv.appendChild(el_a);
            var el_br = document.createElement("br");
            el_br.style.all = "initial";
            eldiv.appendChild(el_br);
            //eldiv.innerHTML += text + "<a href='" + newurl + "' style='color:blue' title='" + newurl + "'>" + shorturl + "</a><br />";

            // XXX: why is this needed? test: http://playbb.me/embed.php?w=718&h=438&vid=at/nw/flying_witch_-_01.mp4, animeplus.tv
            /*document.body.removeChild(el);
            el.style.position = "absolute";
            document.body.appendChild(el);*/

            /*if (document.getElementById("i2d-popup-x"))
                document.getElementById("i2d-popup-x").parentElement.removeChild(document.getElementById("i2d-popup-x"));*/

            /*el.insertBefore(elspan, el.firstChild);
            el.insertBefore(elspan1, el.firstChild);*/
            //el.insertBefore(eldivhold, el.firstChild);
        });
    }

    function i2d_add_player(options) {
        var playlist = [];
        var elements = [];
        var ret = {};

        /*var videoel = document.createElement("video");
        videoel.setAttribute("controls", "");
        options.element.appendChild(videoel);*/

        if (!(options.elements instanceof Array) && !(options.elements instanceof NodeList)) {
            if (typeof options.elements === "string") {
                options.elements = document.querySelectorAll(options.elements);
            } else {
                options.elements = [options.elements];
            }
        }
        for (var i = 0; i < options.elements.length; i++) {
            (function(x) {
                if (!x)
                    return;
                var videoel = document.createElement("video");
                videoel.setAttribute("controls", "");
                videoel.style.maxWidth = "100%";
                videoel.style.maxHeight = "100%";
                videoel.addEventListener("ended", function() {
                    ret.next_playlist_item();
                });
                videoel.addEventListener("error", function() {
                    ret.next_playlist_item();
                });
                /*var stylestr = "";
                for (var key in options.css) {
                    stylestr += key + ":" + options.css[key] + ";"
                }*/
                for (var key in options.css) {
                    videoel.style[key] = options.css[key];
                }
                //videoel.setAttribute("style", stylestr);
                if (options.replaceChildren) {
                    x.innerHTML = "";
                }
                if (options.replace) {
                    x.parentElement.replaceChild(videoel, x);
                } else {
                    x.appendChild(videoel);
                }
                elements.push(videoel);
            })(options.elements[i]);
        }
        ret.add_urls = function(urls) {
            if (urls instanceof Array) {
                for (var i = 0; i < urls.length; i++) {
                    ret.add_urls(urls[i]);
                }
                return;
            }

            playlist.push(urls);
            if (playlist.length === 1) {
                ret.set_url(playlist[0]);
            }
        };
        ret.replace_urls = function(urls) {
            playlist = [];
            return ret.add_urls(urls);
        };
        var getext = function(url) {
            if (!url)
                return url;

            return url.replace(/.*\.([^/.?]*)(?:\?.*)?$/, "$1").toLowerCase();
        };
        var loadscript = function(variable, url, cb) {
            if (!(variable in window)) {
                var script = document.createElement("script");
                script.src = url;
                script.onload = cb;
                document.head.insertBefore(script, document.head.lastChild);
            } else {
                cb();
            }
        };
        ret.set_url = function(url) {
            if (!url || typeof url !== "string")
                return;
            switch(getext(url)) {
                case "flv":
                    loadscript("flvjs", "https://cdn.jsdelivr.net/npm/flv.js@latest", function() {
                        var flvPlayer = flvjs.createPlayer({
                            type: 'flv',
                            url: url
                        });
                        for (var i = 0; i < elements.length; i++) {
                            flvPlayer.attachMediaElement(elements[i]);
                        }
                        flvPlayer.load();
                    });
                    break;
                case "m3u8":
                    loadscript("Hls", "https://cdn.jsdelivr.net/npm/hls.js@latest", function() {
                        var hls = new Hls();
                        hls.loadSource(url);
                        for (var i = 0; i < elements.length; i++) {
                            hls.attachMedia(elements[i]);
                        }
                    });
                    break;
                default:
                    for (var i = 0; i < elements.length; i++) {
                        elements[i].src = url;
                    }
                    break;
            }
        };
        ret.next_playlist_item = function() {
            playlist = playlist.slice(1);
            if (playlist[0])
                ret.set_url(playlist[0]);
        };
        ret.setPlaying = function(playing) {
            for (var i = 0; i < elements.length; i++) {
                if (playing)
                    elements[i].play();
                else
                    elements[i].pause();
            }
        };

        if (options.urls)
            ret.add_urls(options.urls);

        return ret;
    }


    // Injecting functions
    var get_script_str = function(f) {
        return f.toString().replace(/^function.*{|}$/g, '');
    };

    function add_script(s, el) {
        var script_body = "(function() {\n" + s + "\n})();";
        var myscript = document.createElement('script');
        myscript.className = "i2d";
        myscript.innerHTML = script_body;
        if (el) {
            el.appendChild(myscript);
        } else {
            document.head.appendChild(myscript);
        }
    }

    function inject(variable, newvalue, aliases) {
        if (variable instanceof Array) {
            for (var i = 0; i < variable.length; i++) {
                inject(variable[i], newvalue, aliases);
            }
            return;
        }

        console.log("[i2d] injecting " + variable);
        if (!aliases)
            aliases = [];

        var initobjects = "";
        var subvariable = variable;
        var subindex = 0;
        while (true) {
            var index = subvariable.indexOf(".");
            var breakme = false;
            if (index < 0) {
                index = subvariable.length;
                breakme = true;
            }
            subvariable = subvariable.substr(index + 1);
            subindex += index + 1;
            var subname = variable.substr(0, subindex - 1);
            initobjects += "if (!" + subname + ") {" + subname + " = {};}\n";
            if (breakme)
                break;
        }

        add_script("var config = " + JSON.stringify(config) + ";\n" +
                   i2d_show_url.toString() + "\n" + i2d_add_player.toString() + "\n" +
                   initobjects + "\n" +
                   "if ((window." + variable + " !== undefined) && !(window." + variable + ".INJECTED)) {\n" +
                   "var oldvariable = window." + variable + ";\n" +
                   "var oldvariable_keys = Object.keys(oldvariable);\n" +
                   "window." + variable + " = " + newvalue.toString() + ";\n" +
                   "for (var i = 0; i < oldvariable_keys.length; i++) {\n" +
                   "    window." + variable + "[oldvariable_keys[i]] = oldvariable[oldvariable_keys[i]];\n" +
                   "}\n" +
                   "window." + variable + ".INJECTED = true;\n" +
                   "var aliases = " + JSON.stringify(aliases) + ";\n" +
                   "for (var i = 0; i < aliases.length; i++) {\n" +
                   "    if (aliases[i] in window && window[aliases[i]] == oldvariable)" +
                   "        window[aliases[i]] = window." + variable + "\n" +
                   "}\n" +
                   "}");
    }

    function jquery_plugin_exists(name) {
        if (!("jQuery" in window) ||
            typeof window.jQuery !== "function" ||
            !("fn" in window.jQuery) ||
            !(name in window.jQuery.fn))
            return false;


        return true;
    }

    function inject_jquery_plugin(name, value) {
        if (!jquery_plugin_exists(name) ||
            window.jQuery.fn[name].INJECTED)
            return;

        inject("jQuery.fn." + name, value);
    }

    var injected_urls = [];

    (function(open) {
        window.XMLHttpRequest.prototype.open = function() {
            if (arguments[1]) {
                var src = arguments[1];

                var url = null;
                for (var i = 0; i < injected_urls.length; i++) {
                    if (injected_urls[i].url &&
                        check_similar_url(injected_urls[i].url, src)) {
                        url = injected_urls[i];
                        break;
                    }

                    if (injected_urls[i].pattern &&
                        src.match(injected_urls[i].pattern)) {
                        url = injected_urls[i];
                        break;
                    }
                }

                if (url) {
                    this.addEventListener("readystatechange", function() {
                        if (this.readyState === 4) {
                            url.func.bind(this)(src);
                        }
                    });
                }
            }

            open.apply(this, arguments);
        };
    })(window.XMLHttpRequest.prototype.open);

    function inject_url(pattern, func) {
        var obj = {func: func};

        if (pattern instanceof RegExp) {
            obj.pattern = pattern;
        } else {
            obj.url = pattern;
        }

        for (var i = 0; i < injected_urls.length; i++) {
            if (injected_urls[i].url === obj.url ||
                injected_urls[i].pattern === obj.pattern)
                return;
        }

        injected_urls.push(obj);
    }

    function can_inject(name) {
        if (name in window && (typeof window[name] === "object" || typeof window[name] === "function") && !window[name].INJECTED)
            return true;
        return false;
    }

    function i2d_onload(f) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", f);
        } else {
            f();
        }
    }


    if (blacklisted)
        return;

    var injected = [];
    var defineProp = Object.defineProperty;
    win.Object.defineProperty = function() {
        if (arguments[0] === win &&
            injected.indexOf(arguments[1]) >= 0) {
            console.log("[i2d] Intercepted Object.defineProperty for " + arguments[1]);

            if (arguments[2] && arguments[2].value)
                win[arguments[1]] = arguments[2].value;

            return;
        }

        return defineProp.apply(this, arguments);
    };

    var defineProps = Object.defineProperties;
    win.Object.defineProperties = function() {
        if (arguments[0] === win) {
            var keys = Object.keys(arguments[1]);

            var newargs = [];
            newargs[0] = arguments[0];
            newargs[1] = {};

            for (var i = 0; i < keys.length; i++) {
                if (injected.indexOf(keys[i]) >= 0) {
                    console.log("[i2d] Intercepted Object.defineProperties for " + keys[i]);
                    if (arguments[1][keys[i]] && arguments[1][keys[i]].value) {
                        win[keys[i]] = arguments[1][keys[i]].value;
                    }
                } else {
                    newargs[1][keys[i]] = arguments[1][keys[i]];
                }
            }

            return defineProps.apply(this, newargs);
        }

        return defineProps.apply(this, arguments);
    };

    var injections = [
        // soundManager
        {
            variables: {
                window: "soundManager.createSound"
            },
            replace: function(context, args) {
                var arg1 = args[0];
                var arg2 = args[1];

                if (typeof arg1 === "string")
                    i2d_show_url("soundManager", arg2);
                else
                    i2d_show_url("soundManager", arg1.url);

                return context.oldvariable.apply(this, args);
            }
        },
        // jwplayer
        {
            variables: {
                window: "jwplayer"
            },
            replace: function(context, args) {
                var result = context.oldvariable.apply(this, args);

                var check_sources = function(x, options) {
                    if (!options)
                        options = {};

                    if (typeof x === "object") {
                        if (x instanceof Array) {
                            for (var i = 0; i < x.length; i++) {
                                check_sources(x[i]);
                            }
                            return;
                        }

                        var label = "";

                        if ("title" in x)
                            label += "[" + x.title + "]";

                        if ("label" in x)
                            label += "[" + x.label + "]";

                        if ("kind" in x)
                            label += "(" + x.kind + ")";

                        if ("streamer" in x) {
                            i2d_show_url("jwplayer", x.streamer, "[stream]" + label);
                        }

                        if ("file" in x) {
                            i2d_show_url("jwplayer", x.file, label);
                        }

                        if ("sources" in x) {
                            check_sources(x.sources);
                        }

                        if ("playlist" in x) {
                            check_sources(x.playlist, {playlist: true});
                        }

                        if ("tracks" in x) {
                            check_sources(x.tracks, {playlist: true});
                        }
                    } else if (typeof x === "string") {
                        i2d_show_url("jwplayer", x);

                        if (options.playlist) {
                            inject_url(x, function() {
                                check_sources(JSON.parse(this.responseText), {playlist: true});
                            });
                        }
                    }
                };

                if ("setup" in result) {
                    var old_jwplayer_setup = result.setup;
                    result.setup = function() {
                        if (typeof arguments[0] === "object") {
                            var x = arguments[0];

                            if ("modes" in x) {
                                for (var i = 0; i < x.modes.length; i++) {
                                    // TODO: support more?
                                    if ("type" in x.modes[i] && x.modes[i].type === "html5") {
                                        if ("config" in x.modes[i] && "file" in x.modes[i].config) {
                                            check_sources(x.modes[i].config);
                                        }
                                    }
                                }
                            }

                            check_sources(x);
                        }

                        if (config.noads && "advertising" in arguments[0])
                            delete arguments[0].advertising;

                        return old_jwplayer_setup.apply(this, arguments);
                    };
                }

                if ("load" in result) {
                    var old_jwplayer_load = result.load;
                    result.load = function() {
                        check_sources(arguments[0]);
                        return old_jwplayer_load.apply(this, arguments);
                    };
                }

                if ("on" in result) {
                    result.on('playlistItem', function(item) {
                        check_sources(item.item);
                    });

                    var old_jwplayer_on = result.on;
                    result.on = function() {
                        if (arguments[0] === "adBlock")
                            return;

                        return old_jwplayer_on.apply(this, arguments);
                    };
                }

                return result;
            }
        },
        // flowplayer
        {
            variables: {
                window: ["flowplayer"],
                window_alias: ["$f"]
            },
            check: function(variable) {
                if (!variable || !variable.version)
                    return false;
                return true;
            },
            replace: function(context, args) {
                var obj_baseurl = null;
                var els = [];

                var urls = [];
                var url_pairs = {};
                var players = {};
                var add_url = function() {
                    if (Object.keys(players).length === 0) {
                        urls.push(arguments[1]);
                    } else {
                        for (var key in players) {
                            players[key].add_urls(arguments[1]);
                        }
                    }

                    return i2d_show_url.apply(this, args);
                };
                var add_url_pair = function(el) {
                    var newargs = Array.prototype.slice.call(arguments, 1);
                    if (!(el in players)) {
                        if (!url_pairs[el])
                            url_pairs[el] = [];
                        url_pairs[el].push(newargs[1]);
                    } else {
                        players[el].add_urls(newargs[1]);
                    }

                    return i2d_show_url.apply(this, newargs);
                };

                function get_url(x) {
                    x = decodeURIComponent(x);

                    if (obj_baseurl) {
                        if (x.match(/^[a-z]*:\/\//)) {
                            return x;
                        } else {
                            return obj_baseurl + "/" + x;
                        }
                    } else {
                        return x;
                    }
                }

                function check_sources(x, els, label) {
                    if (typeof x === "string") {
                        if (!x.match(/\.xml$/))
                            add_url("flowplayer", get_url(x), label);

                        return;
                    }

                    if (x instanceof Array) {
                        for (var i = 0; i < x.length; i++) {
                            check_sources(x[i], els, label);
                        }
                        return;
                    }

                    if (typeof x !== "object")
                        return;

                    // test: https://flowplayer.com/docs/player/standalone/vast/overlay.html
                    if (config.noads && "ima" in x)
                        delete x.ima;

                    label = "";

                    if ("title" in x)
                        label += "[" + x.title + "]";

                    if ("clip" in x) {
                        if ("baseUrl" in x.clip) {
                            obj_baseurl = x.clip.baseUrl;

                            for (var i = 0; i < els.length; i++) {
                                els[i].i2d_baseurl = obj_baseurl;
                            }
                        }

                        check_sources(x.clip, els, label);
                    }

                    if ("sources" in x) {
                        check_sources(x.sources, els, label);
                    }

                    if ("playlist" in x) {
                        check_sources(x.playlist, els, label);
                    }

                    if ("url" in x) {
                        check_sources(x.url, els, label);
                    }

                    if ("src" in x) {
                        check_sources(x.src, els. label);
                    }

                    if ("bitrates" in x) {
                        for (var j = 0; j < x.bitrates.length; j++) {
                            if ("url" in x.bitrates[j]) {
                                var description = "";
                                if (x.bitrates[j].isDefault)
                                    description += "default:";
                                if (x.bitrates[j].sd)
                                    description += "sd:";
                                if (x.bitrates[j].hd)
                                    description += "hd:";
                                if (x.bitrates[j].bitrate)
                                    description += x.bitrates[j].bitrate;

                                add_url("flowplayer", get_url(x.bitrates[j].url), description);
                            }
                        }
                    }
                }

                if (args.length >= 1) {
                    els = [null];

                    if (typeof args[0] === "string") {
                        try {
                            els[0] = document.getElementById(args[0]);
                        } catch(e) {
                        }

                        try {
                            if (!els[0])
                                els = document.querySelectorAll(args[0]);
                        } catch(e) {
                            els = [];
                        }
                    } else if (args[0] instanceof HTMLElement) {
                        els = [args[0]];
                    }
                }

                for (var i = 0; i < els.length; i++) {
                    if (!els[i] || !(els[i] instanceof HTMLElement))
                        continue;

                    if ("i2d_baseurl" in els[i])
                        obj_baseurl = els[i].i2d_baseurl;
                }

                var options = {};

                if (args.length >= 3 && typeof args[2] === "object") {
                    check_sources(args[2], els);
                    options = args[2];
                } else if (args.length >= 3 && typeof args[2] === "string") {
                    add_url("flowplayer", get_url(args[2]));
                } else if (args.length === 2 && typeof args[1] === "object") {
                    check_sources(args[1], els);
                    options = args[1];
                } else if (args.length === 2 && typeof args[1] === "string") {
                    add_url("flowplayer", get_url(args[1]));
                }

                var isflash = false;
                if (args.length >= 2 && typeof args[1] === "string" && args[1].toLowerCase().match(/\.swf$/)) {
                    isflash = true;
                }

                for (var i = 0; i < els.length; i++) {
                    if (!els[i] || !(els[i] instanceof HTMLElement))
                        continue;

                    var href = els[i].getAttribute("href");
                    if (href) {
                        add_url_pair(els[i], "flowplayer", get_url(href), "href");
                    }
                }

                var oldvariable = context.oldvariable;
                if (config.simpleplayers === "yes" ||
                    (config.simpleplayers === "flash" && isflash)) {
                    oldvariable = function() {
                        var css = {width: "100%", height: "100%"};
                        for (var key in options.screen) {
                            var val = options.screen[key];
                            switch(key) {
                            case "height":
                            case "width":
                            case "bottom":
                            case "top":
                            case "left":
                            case "right":
                                if (typeof val === "number") {
                                    css[key] = val + "px";
                                } else {
                                    css[key] = val;
                                }
                                break;
                            default:
                                css[key] = val;
                                break;
                            }
                        }
                        for (var i = 0; i < els.length; i++) {
                            var player_urls = url_pairs[els[i]] || [];
                            for (var x = 0; x < urls.length; x++) {
                                player_urls.push(urls[x]);
                            }
                            players[els[i]] = i2d_add_player({
                                elements: els[i],
                                replaceChildren: true,
                                urls: player_urls,
                                css: css
                            });
                        }

                        var allp = function(name) {
                            for (var key in players) {
                                players[key][name].apply(this, Array.prototype.slice.apply(args, 1));
                            }
                        };

                        var res = {};
                        var fns = [
                            "addClip",
                            "setPlaylist",
                            "load",
                            "playlist",
                            "play",
                            "ipad"
                        ];
                        for (var i = 0; i < fns.length; i++) {
                            res[fns[i]] = function(){};
                        }

                        return res;
                    };
                }

                var result = oldvariable.apply(this, args);

                if (!result || typeof result !== "object")
                    return result;

                if ("addClip" in result) {
                    var old_fplayer_addclip = result.addClip;
                    result.addClip = function() {
                        if (arguments.length > 0)
                            check_sources(arguments[0], els);

                        return old_fplayer_addclip.apply(this, arguments);
                    };
                }

                if ("setPlaylist" in result) {
                    var old_fplayer_setplaylist = result.setPlaylist;
                    result.setPlaylist = function() {
                        if (arguments.length > 0)
                            check_sources(arguments[0], els);

                        return old_fplayer_setplaylist.apply(this, arguments);
                    };
                }

                if ("load" in result) {
                    var old_fplayer_load = result.load;
                    result.load = function() {
                        if (arguments.length > 0)
                            check_sources(arguments[0], els);

                        return old_fplayer_load.apply(this, arguments);
                    };
                }

                if ("play" in result) {
                    var old_fplayer_play = result.play;
                    result.play = function() {
                        if (arguments.length > 0)
                            check_sources(arguments[0], els);

                        return old_fplayer_play.apply(this, arguments);
                    };
                }

                /*if ("on" in result) {
                  result.on("load", function(e, api, video) {
                  console.log(e);
                  check_sources(video || api.video, els);
                  });
                  }*/

                return result;
            },
            after_inject: function(context) {
                context.win.flowplayer(function(api, root) {
                    api.on("load", function(e, api, video) {
                        context.win.flowplayer().load(video || api.video);
                    });
                });
            }
        },
        // flowplayer (jQuery)
        {
            variables: {
                jquery: "flowplayer"
            },
            replace: function(context, args) {
                var newargs = Array.from(args);
                newargs.unshift(jQuery(this)[0]);
                return context.win.flowplayer.apply(this, newargs);
            }
        },
        // video.js
        {
            variables: {
                window: "videojs"
            },
            replace: function(context, args) {
                if (args.length > 0 && typeof args[0] === "string") {
                    var my_el = document.getElementById(args[0]);
                    if (!my_el)
                        my_el = document.querySelector(args[0]);

                    if (my_el) {
                        if (my_el.src) {
                           i2d_show_url("videojs", my_el.src);
                        }

                        for (var i = 0; i < my_el.children.length; i++) {
                            if (my_el.children[i].tagName.toLowerCase() === "source") {
                                if (my_el.children[i].src) {
                                    i2d_show_url("videojs", my_el.children[i].src, my_el.children[i].getAttribute("label"));
                                }
                            }
                        }
                    }
                }

                var parse_obj = function(obj) {
                    if (obj instanceof Array) {
                        for (var i = 0; i < obj.length; i++) {
                            parse_obj(obj[i]);
                        }
                    } else if (typeof obj === "string") {
                        // TODO
                    } else if (typeof obj === "object") {
                        if ("src" in obj) {
                            var type;
                            if ("type" in obj) {
                                type = obj.type;
                            }

                            i2d_show_url("videojs", obj.src, type);
                        }

                        if ("sources" in obj) {
                            parse_obj(obj.sources);
                        }
                    }
                };

                var result = context.oldvariable.apply(this, args);

                var old_videojs_src = result.src;
                result.src = function() {
                    if (arguments.length > 0 && typeof arguments[0] === "object") {
                        /*if ("src" in arguments[0]) {
                            i2d_show_url("videojs", arguments[0].src);
                            }*/
                        parse_obj(arguments[0]);
                    }

                    return old_videojs_src.apply(this, arguments);
                };

                var old_videojs_playlist = result.playlist;
                result.playlist = function() {
                    if (arguments.length > 0) {
                        parse_obj(arguments[0]);
                    }

                    return old_videojs_playlist.apply(this, arguments);
                }

                return result;
            }
        },
        // amp
        {
            variables: {
                window: "amp"
            },
            replace: function(context, args) {
                function show_amp_source(sourceobj) {
                    if ("protectionInfo" in sourceobj) {
                        console.log("[amp] Cannot decode protection info");
                    }
                    if ("src" in sourceobj)
                       i2d_show_url("amp", sourceobj.src);
                }

                if (args.length >= 2 && typeof args[1] === "object") {
                    if ("sourceList" in args[1]) {
                        for (var i = 0; i < args[1].sourceList.length; i++) {
                            show_amp_source(args[1].sourceList[i]);
                        }
                    }
                }

                var result = context.oldvariable.apply(this, args);

                if (!result)
                    return result;

                var old_amp_src = result.src;
                result.src = function() {
                    for (var i = 0; i < args[0].length; i++) {
                        show_amp_source(args[0][i]);
                    }

                    return old_amp_src.apply(this, args);
                };

                return result;
            }
        },
        // DJPlayer
        {
            variables: {
                window: "DJPlayer"
            },
            proto: {
                setMedia: function(context, args) {
                    if (args.length > 0 && typeof args[0] === 'string') {
                        i2d_show_url('DJPlayer', args[0]);
                    }

                    return context.oldvariable.apply(this, args);
                }
            }
        },
        // Bitmovin
        {
            variables: {
                window: ["bitmovin.player", "bitdash", "bitmovinPlayer"]
            },
            replace: function(context, args) {
                var result = context.oldvariable.apply(this, args);

                var check_progressive = function(progressive) {
                    if (typeof progressive === "string") {
                        i2d_show_url("bitmovin", progressive, "progressive");
                    } else if (progressive instanceof Array) {
                        for (var i = 0; i < progressive.length; i++) {
                            check_progressive(progressive[i]);
                        }
                    } else if (typeof progressive === "object") {
                        var str = "";
                        if (progressive.label)
                            str += "[" + progressive.label + "] ";
                        if (progressive.bitrate)
                            str += progressive.bitrate;

                        i2d_show_url("bitmovin", progressive.url, str);
                    }
                };

                var check_sources = function(x) {
                    if (typeof x === "object") {
                        if ("source" in x) {
                            var sourceobj = x.source;

                            if (sourceobj.progressive) {
                                check_progressive(sourceobj.progressive);
                            }

                            if (sourceobj.dash) {
                                i2d_show_url("bitmovin", sourceobj.dash, "dash");
                            }

                            if (sourceobj.hls) {
                                i2d_show_url("bitmovin", sourceobj.hls, "hls");
                            }
                        }
                    }
                };

                if ("setup" in result) {
                    var old_bitmovin_setup = result.setup;
                    result.setup = function() {
                        check_sources(arguments[0]);

                        return old_bitmovin_setup.apply(this, arguments);
                    };
                }

                if ("load" in result) {
                    var old_bitmovin_load = result.load;
                    result.load = function() {
                        check_sources({source: arguments[0]});

                        return old_bitmovin_load.apply(this, arguments);
                    };
                }

                return result;
            }
        },
        // createjs.Sound
        {
            variables: {
                window: "createjs.Sound.registerSound"
            },
            replace: function(context, args) {
                var url = null;
                var name = null;
                if (typeof args[0] === "string")
                    url = args[0];
                else {
                    url = args[0].src;
                    if (args[0].id)
                        name = args[0].id;
                }

                if (args[1] && typeof args[1] === "string")
                    name = args[1];

                i2d_show_url("createjs", url, name);

                return context.oldvariable.apply(this, args);
            }
        },
        // createjs.Sound (via queue)
        {
            variables: {
                window: "createjs.LoadQueue"
            },
            common: {
                checkArgs: function(args) {
                    var url = null;
                    var name = null;
                    var type = null;

                    if (typeof args[0] === "string")
                        url = args[0];
                    else {
                        url = args[0].src;
                        if (args[0].id)
                            name = args[0].id;
                        type = args[0].type;
                    }

                    if (args[1] && typeof args[1] === "string")
                        name = args[1];

                    if (!type) {
                        var ext = url.replace(/.*\.([a-z0-9]+)(?:[?#&].*)?$/, "$1");
                        if (!ext ||
                            // https://github.com/CreateJS/PreloadJS/blob/fd0f5790a4940892fa19972d6214be36f58eec85/src/preloadjs/utils/RequestUtils.js#L100
                            (ext !== "ogg" &&
                             ext !== "mp3" &&
                             ext !== "webm")) {
                            type = null;
                        } else {
                            type = "sound";
                        }
                    }

                    if (type === "sound")
                        i2d_show_url("createjs", url, name);
                }
            },
            proto: {
                loadFile: function(context, args) {
                    context.common.checkArgs(args);
                    return context.oldvariable.apply(this, args);
                },
                loadManifest: function(context, args) {
                    if (args[0] instanceof Array) {
                        for (var i = 0; i < args[0].length; i++) {
                            context.common.checkArgs([args[0][i]]);
                        }
                    } else {
                        context.common.checkArgs(args);
                    }

                    return context.oldvariable.apply(this, args);
                }
            }
        },
        // DASH.js
        {
            variables: {
                window: "dashjs.MediaPlayer"
            },
            replace: function(context, args) {
                var outer_result = context.oldvariable.apply(this, args);

                var oldcreate = outer_result.create;
                outer_result.create = function() {
                    var result = oldcreate.apply(this, arguments);

                    var old_attachsource = result.attachSource;
                    result.attachSource = function(url) {
                        i2d_show_url("dash.js", url);
                        return old_attachsource.apply(this, arguments);
                    };

                    return result;
                };

                return outer_result;
            }
        },
        // hls.js
        {
            variables: {
                window: "Hls"
            },
            proto: {
                loadSource: function(context, args) {
                    var url = args[0];
                    i2d_show_url("hls.js", url);
                    return context.oldvariable.apply(this, args);
                }
            }
        },
        // flv.js
        {
            variables: {
                window: "flvjs.createPlayer"
            },
            replace: function(context, args) {
                var options = args[0];
                if (options) {
                    if ("url" in options) {
                        i2d_show_url("flv.js", options.url);
                    }
                }
                return context.oldvariable.apply(this, args);
            }
        },
        // Kollus
        {
            variables: {
                window: "KollusMediaContainer.createInstance"
            },
            replace: function(context, args) {
                var options = args[0];

                if (options) {
                    if ("mediaurl" in options) {
                        var types = [];
                        if (options.isencrypted)
                            types.push("encrypted");
                        if (options.isaudiofiles)
                            types.push("audio");
                        else
                            types.push("video");
                        i2d_show_url("kollus", options.mediaurl, types.join(":"));
                    }
                }

                // Replace flash with HTML5, but it doesn't work for HLS
                if (config.simpleplayers === "yes" ||
                    config.simpleplayers === "flash") {
                    var value = (new KollusMediaContainer(options));
                    var old_launchFlashPlayer = value.launchFlashPlayer;
                    value.launchFlashPlayer = function() {
                        if (options.isencrypted) {
                            return old_launchflashplayer.apply(this, arguments);
                        } else if (options.isaudiofile) {
                            return value.launchHTML5AudioPlayer();
                        } else {
                            return value.launchHTML5Player();
                        }
                    };
                    value.isURLHasM3U8 = function(){return false;};
                    value = value.initialize();

                    return value;
                } else {
                    return context.oldvariable.apply(this, args);
                }
            }
        },
        // Soundcloud
        {
            run_when: [{
                host: "soundcloud.com"
            }],
            urls: [
                {
                    regex: /api\.soundcloud\.com\/.*?\/tracks\/[0-9]*\/streams/,
                    callback: function(url) {
                        var track = url.match(/\/tracks\/([0-9]*)\//);
                        var parsed = JSON.parse(this.responseText);
                        for (var item in parsed) {
                            i2d_show_url("soundcloud", parsed[item], "[" + item + "] " + track[1]);
                        }
                    }
                }
            ]
        },
        // Mixcloud
        {
            run_when: [{
                host: "mixcloud.com"
            }],
            urls: [
                {
                    regex: /^(?:https?:\/\/www\.mixcloud\.com)?\/graphql(?:\?.*)?$/,
                    callback: function(url) {
                        var mixcloud_key = atob("SUZZT1VXQU5UVEhFQVJUSVNUU1RPR0VUUEFJRERPTk9URE9XTkxPQURGUk9NTUlYQ0xPVUQ=");
                        var key_length = mixcloud_key.length;

                        try {
                            var parsed = this.response;
                            var viewer = parsed.data.viewer;
                            if (!viewer)
                                viewer = parsed.data.changePlayerQueue.viewer;
                            var queue = viewer.playerQueue;

                            var cloudcast;
                            if (queue.queue) {
                                var currentIndex = 0;
                                if (queue.currentIndex)
                                    currentIndex = queue.currentIndex;
                                cloudcast = queue.queue[currentIndex].cloudcast;
                            }

                            var info = cloudcast.streamInfo;
                            for (var key in info) {
                                var value = atob(info[key]);
                                var newval = [];
                                for (var i = 0; i < value.length; i++) {
                                    newval[i] = value.charCodeAt(i) ^ mixcloud_key.charCodeAt(i % mixcloud_key.length);
                                }
                                var newvalue = String.fromCharCode.apply(String, newval);
                                if (newvalue.match(/^https?:\/\//)) {
                                    i2d_show_url("mixcloud", newvalue, "[" + key + "] " + cloudcast.slug);
                                }
                            }
                        } catch (e) {
                        }
                    }
                }
            ]
        },
        // Forvo
        {
            run_when: [{
                host: "forvo.com"
            }],
            variables: {
                window: "createAudioObject"
            },
            replace: function(context, args) {
                var id = args[0];
                var mp3 = args[1];
                var ogg = args[2];

                i2d_show_url("forvo", mp3, "mp3");
                i2d_show_url("forvo", ogg, "ogg");

                return context.oldvariable.apply(this, args);
            }
        },
        // Twitter
        {
            run_when: [{
                host: "twitter.com",
                url_regex: /:\/\/[^/]*\/i\/videos/
            }],
            onload: function() {
                var pc = document.getElementById('playerContainer');
                if (!pc) {
                    return;
                }

                var config = pc.getAttribute('data-config');
                if (!config) {
                    return;
                }

                var config_parsed = JSON.parse(config);

                if ("video_url" in config_parsed) {
                    i2d_show_url('twitter', config_parsed.video_url);
                }
            }
        },
        // TODO: Reimplement vine

        // jPlayer
        {
            variables: {
                jquery: "jPlayer"
            },
            replace: function(context, args) {
                if (args.length > 0 && args[0] === "setMedia") {
                    if (args.length > 1) {
                        if (typeof args[1] === "object") {
                            for (var i in args[1]) {
                                if (i === "title" ||
                                    i === "duration" ||
                                    i === "track" /* for now */ ||
                                    i === "artist" ||
                                    i === "free")
                                    continue;

                                i2d_show_url("jPlayer", args[1][i], i);
                            }
                        } else if (typeof args[1] === "string") {
                            i2d_show_url("jPlayer", args[1]);
                        }
                    }
                }

                return context.oldvariable.apply(this, args);
            }
        },
        // amazingaudioplayer
        {
            variables: {
                jquery: "amazingaudioplayer"
            },
            replace: function(context, args) {
                var result = context.oldvariable.apply(this, args);

                function add_source_obj(x) {
                    type = "";
                    if ("type" in x) {
                        type = x.type;
                    }

                    i2d_show_url("amazingaudioplayer", x.src, type);
                }

                function add_source(x) {
                    if (x instanceof Array) {
                        for (var i = 0; i < x.length; i++) {
                            add_source_obj(x[i]);
                        }
                    } else {
                        add_source_obj(x);
                    }
                }

                var audioplayer = jQuery(this).data("object").audioPlayer;
                if (audioplayer.audioItem) {
                    add_source(audioplayer.audioItem.source);
                }

                var oldload = audioplayer.load;
                audioplayer.load = function(item) {
                    if ("source" in item) {
                        add_source(item.source);
                    }

                    return oldload.apply(this, arguments);
                };

                return result;
            }
        },
        // jPlayer{Audio,Video}
        {
            variables: {
                jquery: ["jPlayerAudio", "jPlayerVideo"]
            },
            proto: {
                setMedia: function(context, args) {
                    var e = args[0];
                    var label = "cleanaudioplayer";
                    if (oldvariablename === "jPlayerVideo")
                        label = "cleanvideoplayer";

                    var absolute = this._absoluteMediaUrls(e);
                    jQuery.each(this.formats, function(a, o) {
                        i2d_show_url(label, absolute[o]);
                    });
                    return context.oldvariable.apply(this, args);
                }
            }
        }
    ];

    var props = {};

    function defineprop(lastobj_win, lastobj_props, oursplit) {
        // TODO: Implement window_alias
        if (!lastobj_win || !lastobj_props) {
            console.log("lastobj_win === null || lastobj_props === null");
            return;
        }

        if (!(oursplit in lastobj_props)) {
            console.log(oursplit + " not in lastobj_props");
            return;
        }

        var our_obj = lastobj_win[oursplit] || undefined;
        var our_prop = lastobj_props[oursplit];

        var recurse = function() {
            for (var key in our_prop) {
                if (!key.match(/^\$\$[A-Z]+$/)) {
                    defineprop(our_obj, our_prop, key);
                }
            }
        };

        if (!our_prop.$$INJECTED) {
            if (our_obj !== undefined) {
                if (our_prop.$$CHECK) {
                    if (!our_prop.$$CHECK(our_obj)) {
                        return;
                    }
                }

                if (our_prop.$$PROCESS) {
                    lastobj_win[oursplit] = our_prop.$$PROCESS(our_obj);
                    our_obj = lastobj_win[oursplit];
                }

                recurse();
            }

            try {
                defineProp(lastobj_win, oursplit, {
                    get: function() {
                        return our_obj;
                    },
                    set: function(n) {
                        if (n === our_obj)
                            return;

                        //console.log(oursplit + " = ", n);

                        if (our_prop.$$PROCESS)
                            our_obj = our_prop.$$PROCESS(n);
                        else
                            our_obj = n;

                        recurse();
                    }
                });
                our_prop.$$INJECTED = true;
            } catch (e) {
                console.error(e);
            }
        }
    }

    function check_injection(injection, variable, variablename) {
        if ("check" in injection) {
            if (!injection.check(variable)) {
                console.log("[i2d] Not injecting " + variablename);
                return false;
            }
        }

        return true;
    }

    function apply_injection(injection, variable, variablename, win) {
        if (!check_injection(injection, variable, variablename))
            return variable;

        console.log("[i2d] Injecting " + variablename);

        if ("replace" in injection) {
            var context = {
                oldvariable: variable,
                oldvariablename: variablename,
                win: win,
                common: injection.common
            };

            var result = function() {
                return injection.replace.bind(this)(context, arguments);
            };

            for (var key in variable) {
                result[key] = variable[key];
            }

            return result;
        } else if ("proto" in injection) {
            for (var proto in injection.proto) {
                (function(proto) {
                    var context = {
                        oldvariable: variable.prototype[proto],
                        oldvariablename: proto,
                        win: win,
                        common: injection.common
                    };

                    variable.prototype[proto] = function() {
                        return injection.proto[proto].bind(this)(context, arguments);
                    };
                })(proto);
            }
        }

        return variable;
    }

    function do_injection(injection) {
        if ("run_when" in injection) {
            var run_when = injection.run_when;
            if (!(run_when instanceof Array)) {
                run_when = [run_when];
            }

            for (var i = 0; i < run_when.length; i++) {
                if ("host" in run_when[i]) {
                    if (!check_host(run_when[i].host))
                        return false;
                }

                if ("url_regex" in run_when[i]) {
                    if (!window.location.href.match(run_when[i].url_regex))
                        return false;
                }
            }
        }

        var win = get_window();

        function do_window_injection(winvar) {
            if (!(winvar instanceof Array))
                winvar = [winvar];

            for (var i = 0; i < winvar.length; i++) {
                (function() {
                    var varname = winvar[i];
                    var dotsplit = varname.split(".");
                    var lastobj = win;

                    injected.push(dotsplit[0]);

                    var process = function(v) {
                        return apply_injection(injection, v, dotsplit[dotsplit.length - 1], win);
                    };

                    var check = function(v) {
                        return check_injection(injection, v, dotsplit[dotsplit.length - 1]);
                    };

                    var lastprop = props;
                    for (var x = 0; x < dotsplit.length; x++) {
                        var oursplit = dotsplit[x];
                        if (!lastprop[oursplit])
                            lastprop[oursplit] = {};

                        lastprop[oursplit].$$INJECTED = false;

                        if (x === dotsplit.length - 1) {
                            lastprop[oursplit].$$PROCESS = process;
                            lastprop[oursplit].$$CHECK = check;
                        }

                        lastprop = lastprop[oursplit];
                    }

                    /*defineprop(lastobj, dotsplit, 0, function(v) {
                      return apply_injection(injection, v, dotsplit[dotsplit.length - 1], win);
                      });*/
                })();
            }
        }

        if ("variables" in injection) {
            if ("window" in injection.variables) {
                var winvar = injection.variables.window;

                do_window_injection(winvar);

                /*if (!(winvar instanceof Array))
                    winvar = [winvar];

                for (var i = 0; i < winvar.length; i++) {
                    var varname = winvar[i];
                    var dotsplit = varname.split(".");
                    var lastobj = win;

                    defineprop(lastobj, dotsplit, 0, function(v) {
                        return apply_injection(injection, v, dotsplit[dotsplit.length - 1], win);
                    });
                }*/
            }

            if ("jquery" in injection.variables) {
                var jqvar = injection.variables.jquery;
                if (!(jqvar instanceof Array))
                    jqvar = [jqvar];

                var winvar = [];
                for (var i = 0; i < jqvar.length; i++) {
                    winvar.push("jQuery.fn." + jqvar[i]);
                }

                do_window_injection(winvar);
            }
        }

        if ("onload" in injection) {
            i2d_onload(injection.onload);
        }

        if ("urls" in injection) {
            for (var i = 0; i < injection.urls.length; i++) {
                inject_url(injection.urls[i].regex, injection.urls[i].callback);
            }
        }
    }

    function do_all_injections() {
        for (var i = 0; i < injections.length; i++) {
            do_injection(injections[i]);
        }

        var win = get_window();
        for (var key in props) {
            defineprop(win, props, key);
        }
    }
    do_all_injections();


    /*window.addEventListener("afterscriptexecute", function(e) {
        i2d_main(e.target);
    });*/

    var process_raw_tag = function(el) {
        var basename = "raw ";

        if (el.tagName.toLowerCase() === "video") {
            basename += "video";
        } else {
            basename += "audio";
        }

        if (el.id)
            basename += ": #" + el.id;

        var show_updates = function() {
            if (el.src)
                i2d_show_url(basename, el.src);

            for (var x = 0; x < el.children.length; x++) {
                if (el.children[x].tagName.toLowerCase() !== "source" &&
                    el.children[x].tagName.toLowerCase() !== "track") {
                    continue;
                }

                var type = "";
                if (el.children[x].type)
                    type += "[" + el.children[x].type + "]";

                if (el.children[x].label)
                    type += "[" + el.children[x].label + "]";

                if (el.children[x].srclang)
                    type += "[" + el.children[x].srclang + "]";

                if (el.children[x].kind)
                    type += "(" + el.children[x].kind + ")";

                if (el.children[x].src)
                    i2d_show_url(basename, el.children[x].src, type);
            }
        };

        var observer = new MutationObserver(show_updates);
        observer.observe(el, { attributes: true, childList: true });

        show_updates();
    };

    var process_el = function(el) {
        if (el.nodeName === "SCRIPT") {
            //i2d_main(el);
        } else if (el.nodeName === "VIDEO" ||
                   el.nodeName === "AUDIO") {
            process_raw_tag(el);
        }

        if (el.children) {
            for (var i = 0; i < el.children.length; i++) {
                process_el(el.children[i]);
            }
        }
    };

    var script_observer_cb = function(mutations, observer) {
        for (var i = 0; i < mutations.length; i++) {
            if (mutations[i].addedNodes) {
                for (var x = 0; x < mutations[i].addedNodes.length; x++) {
                    var addednode = mutations[i].addedNodes[x];
                    process_el(addednode);
                }
            }
            if (mutations[i].removedNodes) {
                for (var x = 0; x < mutations[i].removedNodes.length; x++) {
                    if (mutations[i].removedNodes[x].nodeName === "SCRIPT") {
                        //i2d_main(mutations[i].removedNodes[x]);
                    }
                }
            }
        }
    };

    var script_observer = new MutationObserver(script_observer_cb);

    script_observer.observe(document, {childList: true, subtree: true});

    i2d_onload(function() {
        var get_raws = function() {
            var audios = [].slice.call(document.getElementsByTagName("audio"));
            var videos = [].slice.call(document.getElementsByTagName("video"));
            var els = Array.prototype.concat(audios, videos);

            for (var i = 0; i < els.length; i++) {
                var basename = "raw ";
                var el = els[i];

                if (el.tagName.toLowerCase() === "video") {
                    basename += "video";
                } else {
                    basename += "audio";
                }

                if (el.id)
                    basename += ": #" + el.id;

                var show_updates = function() {
                    if (el.src)
                        i2d_show_url(basename, el.src);

                    for (var x = 0; x < el.children.length; x++) {
                        if (els[i].children[x].tagName.toLowerCase() !== "source" &&
                            els[i].children[x].tagName.toLowerCase() !== "track") {
                            continue;
                        }

                        var type = "";
                        if (el.children[x].type)
                            type += "[" + el.children[x].type + "]";

                        if (el.children[x].label)
                            type += "[" + el.children[x].label + "]";

                        if (el.children[x].srclang)
                            type += "[" + el.children[x].srclang + "]";

                        if (el.children[x].kind)
                            type += "(" + el.children[x].kind + ")";

                        if (el.children[x].src)
                            i2d_show_url(basename, el.children[x].src, type);
                    }
                };

                var observer = new MutationObserver(show_updates);
                observer.observe(el, { attributes: true, childList: true });

                show_updates();
            }
        };

        //get_raws();

        //i2d_main();
    });
})();
