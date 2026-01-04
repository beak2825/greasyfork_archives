// ==UserScript==
// @name         Youtube/Holodex, Hololive streaming schedule
// @name:ja      Youtube/Holodex, ホロライブ配信スケジュール
// @namespace    http://tampermonkey.net/
// @version      1.0.15
// @description  You can check schedule of recently hololive stream on youtube
// @description:ja ホロライブの直近のスケジュールをYoutubeで確認できます
// @author       You
// @icon         https://www.google.com/s2/favicons?sz=64&domain=holodex.net
// @match        https://www.youtube.com/*
// @grant        GM.xmlHttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @run-at       document-end
// @noframes
// @require      https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.1.6/purify.min.js
// @downloadURL https://update.greasyfork.org/scripts/417564/YoutubeHolodex%2C%20Hololive%20streaming%20schedule.user.js
// @updateURL https://update.greasyfork.org/scripts/417564/YoutubeHolodex%2C%20Hololive%20streaming%20schedule.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const VERSION = "1.0.14", APPNAME = "DHLSOY";
    const REFRESH_INTERVAL = 3 * 60 * 1000; // 5 mins
    const ERROR_TIMEOUT = 3000; // 3 secs
    const MAX_STREAM_LENGTH = 12 * 60 * 60 * 1000; // 12 hours

    const storage = {
        schedule: {
            get options() { return catchParseError(() => JSON.parse(localStorage.ht_s_options), null); },
            set options(value) { localStorage.ht_s_options = JSON.stringify(value); },
        },
        archive: {
            get options() { return catchParseError(() => JSON.parse(localStorage.ht_a_options), null); },
            set options(value) { localStorage.ht_a_options = JSON.stringify(value); },
        },
        favorite: {
            get useFilter() { return catchParseError(() => JSON.parse(localStorage.ht_f_useFilter), false); },
            set useFilter(value) { localStorage.ht_f_useFilter = JSON.stringify(value); },
            get channels() {
                var fav = catchParseError(() => JSON.parse(localStorage.ht_f_channels), null);
                return Array.isArray(fav) ? fav : [];
            },
            set channels(value) { localStorage.ht_f_channels = JSON.stringify(value); },
        }
    }

    const holodex = new Holodex(),
        quickBar = new QuickBar(),
        customView = new CustomViewer();
    var customFilters, favorites = [], myPolicy;

 //   unsafeWindow.holodex = holodex;
    initilize();
    return;

    function initilize() {
        if (!window.DOMPurify || !window.trustedTypes || !window.trustedTypes.createPolicy) {
            setTimeout(initilize, 100);
            return;
        }

        if (document.enabledHololiveSchedule) return;
        document.enabledHololiveSchedule = true;

        myPolicy = window.trustedTypes.createPolicy('DHLSOY', {
            createHTML: (to_escape) => window.DOMPurify.sanitize(to_escape, {
                RETURN_TRUSTED_TYPE: false,
                CUSTOM_ELEMENT_HANDLING: {
                    tagNameCheck: (tagName) => true,
                    attributeNameCheck: (attr) => true,
                    allowCustomizedBuiltInElements: true,
                },
                ADD_ATTR: ["on"],
            }),
            createScriptURL: u => u
        });

        try {
            customFilters = initilizeFilters();
            quickBar.render();
            customView.render();
        } catch(ex) {
            console.log(ex);
        }
    }

    function catchParseError(func, defaultValue) {
        try {
            return func();
        } catch {
            return defaultValue;
        }
    }

    function toggleFavorite(channel, enable) {
        if (!channel) return false;

        if (enable) {
            if (favorites.indexOf(channel) < 0) {
                favorites.push(channel);
            }
        } else {
            favorites = favorites.filter(f => f != channel);
        }
        storage.favorite.channels = favorites;
    }

    function QuickBar() {
        const self = this;
        const localize = {
            ja: {
                archive: "終了した放送を見る",
                powered: "参照元: Holodex",
            },
            en: {
                archive: "View archives",
                powered: "Source: Holotools",
            }
        }
        const t = localize[window.navigator.language] || localize.en;
        this.categoryFilter;
        this.useFavoriteFilter = false;
        this.whitelistFilters = [];

        this.$preview = null;
        this.$previewThumbnail = null;
        this.$previewTitle = null;

        // ui
        this.render = async function () {
            self.categoryFilter = customFilters.all;
            self.whitelistFilters = [self.filterByCategory, self.filterByFavorite];
            self.useFavoriteFilter = storage.favorite.useFilter;
            this.$style = document.createElement("style");
            this.$style.id = "hololive-schedule-style";
            this.$style.innerText = `
#hololive-schedule {
    --color: #212121;
    --background-color: #ffffff;
    --hover-background-color: #ececec;
    --icon-hover-background-color: #d9d9d9;
    --icon-fill: #212121;
    --background-youtube: #ff0000;
    --background-twitch: #a970ff;
    --background-agqr: #e50065;
    --background-abema: #000000;
    --background-x: #000000;
}

[dark] #hololive-schedule {
    --color: #ffffff;
    --background-color: #212121;
    --hover-background-color: #404040;
    --icon-hover-background-color: #4c4c4c;
    --icon-fill: #ffffff;
}

#hololive-schedule {
    position: fixed;
    bottom: 0;
    left: 0;
    min-width: 100%;
    min-height: 97px;
    opacity: 0;
    scrollbar-width: none;
    box-sizing: border-box;
    background-color: var(--background-color);
    z-index: 2031; /* drwaer is 2030 */
    transition: opacity .1s linear, height .3s linear;
    pointer-events: none;
}
#hololive-schedule:hover {
    opacity: 1;
    scrollbar-width: none;
}
#hololive-schedule.visible {
    pointer-events: unset;
}
#hololive-schedule #schedule {
    position: relative;
    bottom: 0;
    left: 0;
    min-width: 100%;
    padding: 8px;
    white-space: nowrap;
    scrollbar-width: none;
    box-sizing: border-box;
    overflow-y: hidden;
    overflow-x: scroll;
    background-color: var(--background-color);
    transition: left .2s ease, max-height .5s linear;
}
#hololive-schedule:hover #schedule  {
    scrollbar-width: none;
}
#hololive-schedule #schedule::-webkit-scrollbar {
    display: none;
}
#hololive-schedule #schedule:empty:after {
    display: block;
    content: "Loading ...";
    vertical-align: middle;
}
#hololive-schedule .hololive-stream {
    display: inline-block;
    position: relative;
    border: solid 3px;
    border-radius: 3px;
    font-size: 10px;
    margin: 0 0 0 8px;
}
#hololive-schedule .hololive-stream.hidden {
    display: none;
}
#hololive-schedule .hololive-stream .thumbnail {
    vertical-align: middle;
    width: 128px;
    height: 72px;
    border-radius: 2px;
    background-size: cover;
    background-repeat: 1;
    background-position: center center;
    opacity: 1;
    transition: opacity 0.1s ease;
}
#hololive-schedule .hololive-stream .thumbnail {
}
#hololive-schedule .hololive-stream .title-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    color: #202020;
    background: #fffa;
    z-index: 1;
}
#hololive-schedule .hololive-stream:hover .title {
    /*animation: textAnimation 4s linear infinite;*/
}
#hololive-schedule .hololive-stream .date {
    position: absolute;
    padding: 1px 3px;
    color: #202020;
    background: #fffd;
    font-weight: bold;
    z-index: 1;
}
#hololive-schedule .hololive-stream .photo {
    position: absolute;
    right: -8px;
    top: -8px;
    width: 32px;
    height: 32px;
    border: solid 2px #fff;
    border-radius: 18px;
    z-index: 1;
    background-color: var(--background-color);
    background-size: cover;
    transition: opacity 0.1s ease;
    overflow: hidden;
}
#hololive-schedule {
    a:link, a:visited, a:hover, a:active { color: white; }
}
#hololive-schedule .hololive-stream .photo:after {
    content: "★";
    background: #8888;
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    font-size: 24px;
    text-align: center;
    opacity: 0;
    line-height: 32px;
}
#hololive-schedule .hololive-stream.favorite .photo:after {
    background: #ff08;
}
#hololive-schedule .hololive-stream:hover .photo:after {
    opacity: 1;
}

#hololive-schedule .hololive-stream[stream-status="live"],
#hololive-schedule .hololive-stream[stream-status="live"] .photo {
    border-color: crimson;
}
#hololive-schedule .hololive-stream[stream-status="upcoming"],
#hololive-schedule .hololive-stream[stream-status="upcoming"] .photo {
    border-color: deepskyblue;
}
#hololive-schedule .hololive-stream[stream-status="ended"],
#hololive-schedule .hololive-stream[stream-status="ended"] .photo {
    border-color: gray;
}


#hololive-schedule .tools {
    display: block;
    position: absolute;
    height: fit-content;
    top: 0;
    transform: translateY(-100%);
    background-color: var(--background-color);
    color: var(--icon-fill);
    vertical-align: middle;

    transition: opacity .2s linear, width .1s linear;
}
#hololive-schedule .tools.left {
    left: 0;
    padding-left: 8px;
    border-radius: 0 5px 0 0;
}
#hololive-schedule .tools a {
    display: inline-block;
    padding: 6px 8px;
    cursor: pointer;
    vertical-align: middle;
    color: var(--icon-fill);
    text-decoration: none;
    text-align: center;
    transition: background .1s linear, padding .1s linear;
}
#hololive-schedule .tools a:last-child {
    border-radius: 0 5px 0 0;
}
#hololive-schedule .tools a:hover {
    background: var(--hover-background-color);
}
#hololive-schedule .tools a svg {
    display: inlnie-block;
    height: 14px;
}
#hololive-schedule .tools a svg .shape {
    fill: var(--icon-fill);
    transition: fill .1s linear;
}
#hololive-schedule .tools a.favorite[on] {
    color: yellow;
}
#hololive-schedule #contents .contents.hidden {
    display: none;
    width: 0;
}
#hololive-schedule #preview {
    position: fixed;
    bottom: 100px;
    left: 0;
    right: 0;
    text-align: center;
    z-index: 2031;
    pointer-events: none;
    transition: opacity 0.1s ease;
}
#hololive-schedule #preview.hidden {
    opacity: 0;
}
#hololive-schedule #thumbnail-preview {
    display: block;
    position: relative;
    margin: 0 auto;
    width: 512px;
    height: 288px;
    background-size: 100%;
    background-position: center;
    border-radius: 4px;
    z-index: 2031;
    pointer-events: none;
    box-shadow: #000 0px 0px 12px;
    border: solid 5px;
}
#thumbnail-preview[platform]::before {
    display: block;
    position: absolute;
    content: attr(platform);
    color: #fff;
    font-weight: bold;
    padding: 3px 5px;
    border-radius: 1px;
    left: 5px;
    top: 5px;
    z-idnex: 1111111;
    text-transform: capitalize;
}
#thumbnail-preview[platform="youtube"]::before {
    background: var(--background-youtube);
}
#thumbnail-preview[platform="twitch"]::before {
    background: var(--background-twitch);
}
#thumbnail-preview[platform="x"]::before {
    background: var(--background-x);
}
#thumbnail-preview[platform="abema"]::before {
    background: var(--background-abema);
}
#thumbnail-preview[platform="agqr"]::before {
    background: var(--background-agqr);
}
#hololive-schedule #thumbnail-preview iframe {
    width: 512px;
    height: 288px;
}
#hololive-schedule #title-preview {
    display: inline-block;
    font-size: 20px;
    padding: 6px 12px;
    border-radius: 4px;
    color: #303030;
    background: #efefef;
    white-space: nowrap;
    margin-top: 8px;
}
#hololive-schedule #thumbnail-preview[stream-status="live"] {
    border-color: crimson;
}
#hololive-schedule #thumbnail-preview[stream-status="upcoming"] {
    border-color: deepskyblue;
}
#hololive-schedule #thumbnail-preview[stream-status="ended"] {
    border-color: gray;
}
`;
            document.body.appendChild(this.$style);

            this.$container = document.createElement("div");
            this.$container.id = "hololive-schedule";
            this.$container.classList.add("visible");
            this.$container.innerHTML = myPolicy.createHTML(`
<div class="tools left">
    <a class="filter favorite" ${self.useFavoriteFilter ? "on" : ""}><span>★</span></a>
    <a class="filter" filter="all"><span>All</span></a>
    <a class="filter" filter="jp"><span>JP</span></a>
    <a class="filter" filter="en"><span>EN</span></a>
    <a class="filter" filter="id"><span>ID</span></a>
    <a class="filter" filter="devis"><span>DEV_IS</span></a>
    <a class="filter" filter="stars_all">STARS</a>
    <a id="archive" title="${t.archive}">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="28px" height="28px" viewBox="0 0 512 512">
            <path class="shape" d="M464,56v40h-40V56H88v40H48V56H0v400h48v-40h40v40h336v-40h40v40h48V56H464z M88,354.672H48v-64h40V354.672z
		 M88,221.328H48v-64h40V221.328z M308.094,266.047l-101.734,60.734c-0.75,0.438-1.656,0.469-2.406,0.031
		c-0.734-0.422-1.203-1.219-1.203-2.094V264v-60.719c0-0.859,0.469-1.656,1.203-2.094c0.75-0.406,1.656-0.391,2.406,0.031
		l101.734,60.75c0.719,0.406,1.156,1.203,1.156,2.031C309.25,264.844,308.813,265.625,308.094,266.047z M464,354.672h-40v-64h40
		V354.672z M464,221.328h-40v-64h40V221.328z"></path>
        </svg>
    </a>
    <a id="powered" href="https://holodex.net/" target="_blank">${t.powered}</a>
</div>
<div id="schedule" style="left: 0px;">
</div>
<div id="preview" class="hidden">
    <div id="thumbnail-preview"></div>
    <div id="title-preview"></div>
</div>
`);
            document.body.appendChild(this.$container);

            this.$tools = this.$container.querySelector(".tools");
            this.$schedule = this.$container.querySelector("#schedule");
            this.$preview = this.$container.querySelector("#preview");
            this.$previewTitle = this.$preview.querySelector("#title-preview");
            this.$previewThumbnail = this.$preview.querySelector("#thumbnail-preview");

            // events

            window.addEventListener("wheel", this.updateVisibility);
            this.$container.addEventListener("wheel", this.onScrollContainer, true);

            this.$container.addEventListener("mouseenter", async (ev) => {
                // console.log("mouseenter", ev.target.classList.toString());

                this.updateVisibility();
                if (await this.updateSchedule()) {
                    this.drawSchedule();
                }
            }, false);

            this.$tools.addEventListener("mouseenter", self.$preview.classList.add("hidden"), false);
            this.$container.addEventListener("mouseleave", this.close, false);

            this.updateVisibility();

            this.$container.addEventListener("click", ev => {
                var photo = ev.target.closest(".photo");
                if (!photo) return;

                ev.preventDefault();

                var stream = photo.closest(".hololive-stream");
                var channel = stream.data?.channel?.id;
                if (!channel) return;

                var isFavorite = !stream.classList.contains("favorite");
                toggleFavorite(channel, isFavorite);

                self.$container.querySelectorAll(".hololive-stream").forEach(s => {
                    if (s.data.channel.id == channel) {
                        s.classList.toggle("favorite", isFavorite);
                    }
                });

                self.filter();
            });

            this.$container.querySelectorAll(".filter").forEach($f => {
                $f.addEventListener("click", () => {
                    var cf = customFilters[$f.getAttribute("filter")];
                    if (cf) {
                        self.categoryFilter = cf;
                        self.filter();
                        self.resetScheduleScrollPosition();
                    }
                });
            });

            var fav = this.$container.querySelector(".filter.favorite");
            fav.addEventListener("click", () => {
                self.useFavoriteFilter = fav.toggleAttribute("on");
                self.filter();
                storage.favorite.useFilter = self.useFavoriteFilter;
                self.resetScheduleScrollPosition();
            });

            this.$container.querySelector("#archive").addEventListener("click", this.onOpenCustomView);
        }

        this.drawSchedule = function () {
            // console.log(this.schedule);
            var streams = this.schedule;

            this.$schedule.innerText = "";
            this.$schedule.style.left = "0px";

            // console.log(streams);

            streams
               // .filter(data => !(data.status == "upcoming" && new Date().getTime() - new Date(data.available_at).getTime() > 0)) // fix to status bug in holodex
                .filter(data => !(data.status == "live" && new Date().getTime() - new Date(data.available_at).getTime() > MAX_STREAM_LENGTH)) // older
                .forEach(streamData => {
                var stream = this.createStream(streamData);
                this.$schedule.appendChild(stream);
            });

            this.filter();
        }

        // 枠をつくる
        this.createStream = function (data) {
            // console.log(details);
            var $stream = document.createElement("a");
            $stream.data = data;
            $stream.classList.add("hololive-stream");
            $stream.setAttribute("stream-status", data.status);

            var start = new Date(data.start_actual || data.start_scheduled);
            var href, platform = "youtube";
            if (data.type == "placeholder") {
                // twitch
                if (data.link && data.link.indexOf("https://twitch.tv/") == 0) {
                    data.thumbnail = data.thumbnail.replace("1920x1080", "426x240");
                    platform = "twitch";
                }
                // twitter
                if (data.thumbnail && data.thumbnail.indexOf("https://pbs.twimg.com/") == 0) {
                    data.thumbnail = data.thumbnail.replace("name=large", "name=small");
                    platform = "x";
                }
                // agqr
                if (data.link && data.link.indexOf("agqr") >= 0) {
                    platform = "radio";
                }
                // abema
                if (data.link && data.link.indexOf("//abema.tv/") > 0) {
                    platform = "abema";
                }

                data.platform = platform;
                href = data.link;
                $stream.target = "_blank";
            } else if (data.type == "stream") {
                data.thumbnail = `https://i.ytimg.com/vi/${data.id}/mqdefault.jpg?${start.getTime()}`;
                href = "/watch/" + data.id;
            }

            var time = this.toLiveDate(data.start_actual, data.start_scheduled, data.ended, data.published_at);
            var icon = data.channel.photo.replace("=s800", "=s144");

            data.platform = platform;

            $stream.setAttribute("platform", data.platform);
            $stream.href = href;
            $stream.classList.toggle("favorite", favorites.indexOf(data.channel?.id) >= 0);
            $stream.innerHTML = myPolicy.createHTML(`
<div class="date">${time}</div>
<div class="thumbnail" style="background-image: url('${data.thumbnail}'), url('${data.channel.photo}')"></div>
<div class="title-wrapper"><div class="title">${data.title}</div></div>
<div class="photo" style="background-image: url('${icon}');" />
`);
            $stream.addEventListener("mouseenter", this.previewStream, false);

            return $stream;
        }

        this.initilizeTwitchAPI = function () {
            var script = document.createElement("script");
            script.src = myPolicy.createScriptURL("https://player.twitch.tv/js/embed/v1.js");
            return new Promise((resolve) => {
                script.addEventListener("load", () => setTimeout(resolve, 50));
                document.querySelector("head").appendChild(script);
            });
        }

        this.initilizeYoutubeAPI = function () {
            var script = document.createElement("script");
            script.src = myPolicy.createScriptURL("https://www.youtube.com/player_api");
            return new Promise((resolve) => {
                script.addEventListener("load", () => setTimeout(resolve, 50));
                document.querySelector("head").appendChild(script);
            });
        }

        this.previewTwitch = function (channel) {
            var player = new Twitch.Player("thumbnail-preview", {
                channel: channel,
                parent: ["www.youtube.com"]
            });
            player.addEventListener(Twitch.Player.READY, () => {
                setTimeout(() => {
                    player.setMuted(false);
                }, 200);
            });
            return player;
        }

        this.previewYoutube = function (videoId) {
            var player = new YT.Player("thumbnail-preview-placeholder", {
                videoId: videoId,
                playerVars: {
                    autoplay: 1,
                    enablejsapi: 1,
                    origin: "www.youtube.com",
                    controls: 1, // 0: ユーザー設定の音量が維持されない
                    fs: 0,
                    modestbranding: 0,
                }
            });
            return player;
        }

        this.previewStream = async function (ev) {
            self.$previewThumbnail.innerText = "";
            var data = ev.target.data;
            if (data) {
                self.$previewTitle.innerText = data.title;
                self.$previewThumbnail.style.backgroundImage = `url('${data.thumbnail}'), url('${data.channel.photo}')`;
                self.$previewThumbnail.setAttribute("stream-status", data.status);
                self.$previewThumbnail.setAttribute("platform", data.platform);

                var mainVideo = document.querySelector("video");
                if (data.topic_id == "membersonly") {
                    // do noting
                }
                // youtube
                else if (data.type == "stream" && data.status == "live") {
                    if (mainVideo && mainVideo.played && mainVideo.played.length > 0) {
                        if (typeof YT == "undefined") {
                            await self.initilizeYoutubeAPI();
                        }
                        self.$previewThumbnail.innerHTML = myPolicy.createHTML(`<div id="thumbnail-preview-placeholder"></div>`);
                        self.previewYoutube(data.id);
                    }
                }
                // twitch
                else if (data.status == "live" && data.link && data.link.indexOf("https://twitch.tv/") == 0) {
                    var channel = data.link.split("/").slice(-1)[0];
                    if (typeof Twitch == "undefined") {
                        await self.initilizeTwitchAPI();
                    }
                    self.previewTwitch(channel);
                }
            }

            self.$preview.classList.toggle("hidden", !data);
        }


        // フルスクリーンのときは表示しない
        this.updateVisibility = function () {
            var html = document.querySelector("html");
            var app = document.querySelector("ytd-app");
            var isScrolled = ((app && app.scrollTop) || html.scrollTop || html.scrollY || window.scrollY || window.scrollTop || document.body.scrollY || document.body.scrollTop) > 100;

            self.$container.classList.toggle("visible", isScrolled);
        }

        this.filter = function () {
             this.$container.querySelectorAll(".hololive-stream").forEach(e => {
                 var isDisplay = true;
                 for (var i = 0; i < self.whitelistFilters.length; i++) {
                     isDisplay &= self.whitelistFilters[i](e.data);
                 }
                 e.classList.toggle("hidden", !isDisplay);
             });
        }

        this.resetScheduleScrollPosition = function () {
            this.$schedule.style.left = 0;
        }

        this.filterByCategory = function(data) {
            if (!self.categoryFilter) return false;
            return self.categoryFilter.match(data);
        }

        this.filterByFavorite = function (data) {
            if (!self.useFavoriteFilter) return true;
            return customFilters.favorite.match(data);
        }

        // data
        this.isRefresing = false;
        this.schedule = [];
        this.lastUpdated = 0;

        this.updateSchedule = async function (force) {
            // console.log(`refreshList(${force})`);

            try {
                if (this.isRefreshing) return false;
                this.isRefreshing = true;

                // 十分に新しい、HoloDexから更新の必要はない
                if (!force && Date.now() - this.lastUpdated < REFRESH_INTERVAL) {
                    return false;
                }

                var response = await holodex.getLive().catch(ex => {
                    console.log("cache", ex);
                });

                if (!response) return false;

                if (Array.isArray(response)) {
                    this.lastUpdated = Date.now();
                    this.schedule = response;

                    return response;
                }

                return false;
            } catch (ex) {
                console.log(ex);
            } finally {
                this.setTimeoutToRefresh();
            }
        }

        this.setTimeoutToRefresh = function () {
            setTimeout(() => {
                this.isRefreshing = false;
            }, ERROR_TIMEOUT);
        }

        // utils
        this.toLiveDate = function(schedule, start, end, publish) {
            // console.log(schedule, start, end, publish);

            if (end) {
                const diff = new Date(end).getTime() - new Date(start).getTime();
                const dm = Math.floor(diff / 1000 / 60 % 60);
                const dh = Math.floor(diff / 1000 / 60 / 60);

                var span = "";
                if (dh > 0) {
                    span += dh + "h ";
                }
                span += dm + "m";

                return span;
            }

            start = new Date(start || schedule || publish);
            const h = ("0" + start.getHours()).slice(-2);
            const m = ("0" + start.getMinutes()).slice(-2);
            if (start.getDate() != new Date().getDate()) {
                return `${start.getDate()}-${h}:${m}`;
            } else {
                return `${h}:${m}`;
            }
        }

        // handler

        this.onScrollContainer = function (ev) {
            // console.log(ev);

            ev.preventDefault();
            ev.stopPropagation();
            ev.stopImmediatePropagation();

            // console.log("on wheel", ev, document.querySelector("#hololive-schedule").clientWidth, document.documentElement.clientWidth, container.style.left);

            const lp = parseFloat(self.$schedule.style.left) || 0,
                  dw = document.documentElement.clientWidth,
                  cw = self.$schedule.clientWidth;

            // console.log (contents, lp, dw, cw);

            if (ev.deltaY > 0) {
                self.$schedule.style.left = Math.max(lp - dw / 5, - cw + dw) + "px";
            } else if (ev.deltaY < 0) {
                self.$schedule.style.left = Math.min(lp + dw / 5, 0) + "px";
            } else {
                self.$schedule.style.left = - cw + dw;
            }

            return false;
        }

        this.onOpenCustomView = function (ev) {
            customView.open();
        }

        this.close = function() {
            self.$preview.classList.add("hidden");
            self.$previewThumbnail.innerText = ""; // stop iframe preview
        }
    }

    function CustomViewer() {
        const localize = {
            ja: {
                next: "NEXT",
                filter: {
                    favorite: "お気に入り",
                    lives: "配信中を含める",
                    all: "ALL",
                    jp: "ホロライブ",
                    en: "ホロライブ EN",
                    id: "ホロライブ ID",
                    devis: "DEV_IS",
                    stars: "ホロスターズ",
                    stars_en: "ホロスターズ EN",
                    outside: "外部コラボ",
                    video: "動画",
                    singing: "歌枠",
                    talk: "雑談",
                    recommend: "注目",
                    pvp: "対戦ゲーム",
                    rpg: "RPG",
                    coop: "ローカル対戦/協力",
                    horror: "ホラー",
                    hololive: "Hololive Indie",
                    membersonly: "メンバー限定",
                },
                topic: {
                    membersonly: "メン限",
                    totsu: "凸待ち",
                    talk: "雑談",
                    original_song: "オリジナルソング",
                    music_cover: "歌ってみた",
                    dancing: "踊ってみた",
                    drawing: "お絵かき",
                    morning: "朝活",
                    singing: "歌枠",
                    celebration: "記念枠",
                    marshmallow: "マシュマロ",
                    shorts: "ショート動画",
                    superchat_reading: "スパチャ読み",
                    anniversary: "周年記念",
                    endurance: "耐久",
                    announce: "お知らせ",
                    watchalong: "同時視聴",
                    clubhouse51: "アソビ大全51",
                    outfit_reveal: "新衣装",
                    debut_stream: "初配信",
                    animation: "アニメ",
                    camera_stream: "カメラ配信",
                }
            },
            en: {
                next: "NEXT",
                filter: {
                    favorite: "Favorite",
                    lives: "Include lives",
                    all: "ALL",
                    jp: "Hololive JP",
                    en: "Hololive EN",
                    id: "Hololive ID",
                    devis: "DEV_IS",
                    stars: "Holostars",
                    stars_en: "Holostars EN",
                    outside: "Collabo with outside",
                    video: "Video",
                    singing: "Singing",
                    talk: "Talk",
                    recommend: "Recommend",
                    pvp: "PvP",
                    rpg: "RPG",
                    coop: "Co-op",
                    hololive: "Hololive Indie",
                    membersonly: "Members Only"
                },
                topic: {}
            },
        };

        const t = localize[window.navigator.language] || localize.en;
        var self = this;

        // ui

        this.render = function () {
            this.config = Object.assign({
                lives: false,
                favorite: false,
            }, storage.archive.options);

            this.$style = document.createElement("style");
            this.$style.id = "hololive-custom-style";
            this.$style.innerText = `
#hololive-custom-viewer {
    --custom-viewer-background: #fff;

    --custom-viewer-items-background: #fff;
    --custom-viewer-items-caption-color: #212121;
    --custom-viewer-items-caption-hover-text-shadow: #464ea7a8;

    --custom-viewer-items-info-color: #202020;
    --custom-viewer-items-info-background: #fffd;

    --custom-viewer-filter-color: #202020;
    --custom-viewer-filter-hover-background: #bfbfbf;
    --custom-viewer-filter-enabled-fill: gold;

    --custom-viewer-slim-filter-background: #cfcfcf;
    --custom-viewer-slim-filter-hover-background: #bfbfbf;

    --custom-viewer-filter-recommend-color: #000;
    --custom-viewer-filter-recommend-background: gold;

    --custom-viewer-next-color: #202020;
    --custom-viewer-next-background: #cfcfcf;
    --custom-viewer-next-hover-background: #bfbfbf;
}
[dark] #hololive-custom-viewer {
    --custom-viewer-background: #000;

    --custom-viewer-items-background: #000;
    --custom-viewer-items-caption-color: #ececec;
    --custom-viewer-items-caption-hover-text-shadow: #fff;

    --custom-viewer-items-info-color: #fff;
    --custom-viewer-items-info-background: #202020dd;

    --custom-viewer-filter-color: #ececec;
    --custom-viewer-filter-hover-background: #404040;
    --custom-viewer-filter-enabled-fill: gold;

    --custom-viewer-slim-filter-background: #202020;
    --custom-viewer-slim-filter-hover-background: #404040;

    --custom-viewer-filter-recommend-color: #000;
    --custom-viewer-filter-recommend-background: gold;

    --custom-viewer-next-color: #ececec;
    --custom-viewer-next-background: #202020;
    --custom-viewer-next-hover-background: #404040;
}
#hololive-custom-viewer {
    display: flex;
    position: fixed;
    justify-content: center;
    bottom: 0;
    right: 0;
    left: 0;
    top: 0;
    background: var(--custom-viewer-items-background);
    z-index: 3000;
    padding: 30px;
    transitioin: opacity 0.1s linear;
}
#hololive-custom-viewer.hidden {
    opacity: 0;
    display: none;
}
#hololive-custom-viewer #sub {
    width: 200px;
    overflow-y: scroll;
    scrollbar-width: none;
    box-sizing: border-box;
}
#hololive-custom-viewer #main {
    overflow-y: scroll;
    scrollbar-width: none;
    margin: 10px 0;
    padding: 20px;
    width: calc(min(100%,1280px));
    text-align: left;
    box-sizing: border-box;
}
#hololive-custom-viewer #sub::-webkit-scrollbar,
#hololive-custom-viewer #sub::-webkit-scrollbar-thumb,
#hololive-custom-viewer #main::-webkit-scrollbar,
#hololive-custom-viewer #main::-webkit-scrollbar-thumb {
    display: none;
}
#hololive-custom-viewer .hololive-stream {
    display: inline-block;
    position: relative;
    font-size: 10px;
    border-radius: 5px;
    margin: 0 0 16px 8px;
    width: 192px;
    vertical-align: top;
    text-decoration: none;
    color: #acacac;
    overflow: hidden;
}
#hololive-custom-viewer .hololive-stream.hidden {
    display: none;
}
#hololive-custom-viewer .hololive-stream .thumbnail {
    position: relative;
    vertical-align: middle;
    width: 192px;
    height: 108px;
    box-sizing: border-box;
    border-radius: 3px;
    background-size: 100%;
    background-repeat: 1;
    background-position: center center;
    transition: background-size 0.15s ease-in-out;
}
#hololive-custom-viewer .hololive-stream:hover .thumbnail {
    background-size: 108%;
}
#hololive-custom-viewer .hololive-stream .title-wrapper {
    color: var(--custom-viewer-items-caption-color);
    margin: 0.5rem;
    font-size: 1.5rem;
    line-height: 1.75rem;
    height: 5.25rem;
    word-break: break-all;
    overflow: hidden;
    transition: text-shadow 0.15s ease-in-out;
}
#hololive-custom-viewer .hololive-stream:hover .title-wrapper {
    text-shadow: 0px 0px 2px var(--custom-viewer-items-caption-hover-text-shadow);
}

#hololive-custom-viewer .hololive-stream .date,
#hololive-custom-viewer .hololive-stream .topic {
    position: absolute;
    padding: 1px 5px;
    left: 3px;
    border-radius: 2px;
    color: var(--custom-viewer-items-info-color);
    background: var(--custom-viewer-items-info-background);
    z-index: 1;
    letter-spacing: .025em;
    white-space: nowrap;
    overflow: hidden;
    transition: opacity 0.1s linear;
}

#hololive-custom-viewer .hololive-stream:hover .date,
#hololive-custom-viewer .hololive-stream:hover .topic {
    opacity: 0;
}
#hololive-custom-viewer .hololive-stream .date {
    top: 2px;
    font-size: 10px;
}
#hololive-custom-viewer .hololive-stream[stream-status=live] .date {
    background: #f00c;
}
#hololive-custom-viewer .hololive-stream .topic {
    font-size: 12px;
    bottom: 2px;
    text-transform: capitalize;
}
#hololive-custom-viewer .hololive-stream .title {
    display: inline;
}
#hololive-custom-viewer .hololive-stream .name {
    display: inline;
    vertical-align: middle;
    margin-left: 6px;
    font-size: 9px;
    opacity: 0.7;
}
#hololive-custom-viewer .hololive-stream .photo {
    position: absolute;
    right: -12px;
    top: -12px;
    width: 48px;
    height: 48px;
    border-radius: 24px;
    background-size: cover;
    transition: transform 0.15s ease-in-out, opacity 0.15s ease-in-out;
}
#hololive-custom-viewer .hololive-stream:hover .photo {
    transform: scale(0) translate(10px, -10px);
    opacity: 0;
}
#hololive-custom-viewer .hololive-stream .site {
    position: absolute;
    right: 3px;
    bottom: 3px;
    width: 24px;
    height: 24px;
    background-size: 100%;
    transition: opacity 0.1s ease-in-out;
}
#hololive-custom-viewer .hololive-stream .site.twitch {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAETSURBVHgB7ZU7DoJAEIb/JV7MBq/hCVROIJ7AqI2t0d5WsTF2dhzBI1hbsLIYwyPADgzrFvI1PJbk+5lZBoEaNq6cR4APA0wDIdTRgQV5lgGI8skZnbAe5a8ditwkjk15LoANeS5AW7nqabGvdfcrA9iiD9AHsB5gACZVI5o6uv+rBbct7AW4H4Dw+DmPp+7ipwGU/L5P5V4g/O8aexM2kkusvEsqVxitQOHNd7F8VnyGXIHiny37mWVFZSTyQIzL1tgV0MljQrwwq1pkBaDIoxeG3lU80XUAgvyhk/MC6OSOXs4KoJWfxIPysACRlSslV1YGpwIhV65oOwlDygYzEqBuqLShUQuSWd6hvBFLV/owwBuAI3t8NBey8QAAAABJRU5ErkJggg==');
}
#hololive-custom-viewer .hololive-stream .site.x {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJkSURBVHgB7VZBbtpQEH3zIW0WVYuXVaH4Bs0NSk4AOUFhEarskhMknIDsqkKlcIT0BNAT1D1B3ZJK3dmVuirwp/MhVmzAxiagKBJv9+ePZ97M/JkxsMMODwzChlD84FWQp3MxeCDHAhiumB+MJrr1+8Ryw3p/9+H4DctfIPCq49Xlw8Kv99YlMuB19885gy/i7llziwGfFFWJyR02XzSCuwiBUse7BlFVaz5LS8KQVkRXaXRJsqImfDjKSZBNyzEyFWFKVJ4KFbWLElUao6KbSk8i9TXgTPaorxTskPwOxa7/9baGt4zg8oQbNyfWYJlRU0/KUx9ZwNwYNq1ecFRzl18QpW0bB0Ks//KjV1uwlbuLJA3GxEdh5wb5yGEPl3qMd2xecYQHKnlFlVLX95kxYCFKGg5IlU2a0uLpCM68LEJA+sJ/Dm6Jy3aMjQIRakRUm+UuvfOp/X34iQSejeFo0Hdx4optG5uFH/R+GHNvANcm3VtwLs+Lvy2TRwhIOnrYHhysIuDKcCDwGbYAjglOzQt+HssElF6dvoNNOZeuCSbfSgIGMjILMo4/ExZf7TqghNLmlwm1gpSC2tmaLAZMvWGz0Iu7XpqBm2NrQNN5cD+Y5ZOTdZyok3RZMusZOJUN+QZrQFb0oQkG6xIIYHe8A03Unx/Ryd6jS2ctAsbxmFRVynGKlM5na5ePVkUe0p+h9MmraS2zXqYgmSWjOPtElHbLTVB3Q79gqQlMScxqXpeav0UWiGMmXKSNOpZAAPvKs/U/1MRoxRxl+5WD+psUy2D5IdmRVoWjnqDnLlkyO+zwaPAf1zXwZL751PUAAAAASUVORK5CYII=');
}
#hololive-custom-viewer .hololive-stream:hover .site {
    opacity: 0;
}
#hololive-custom-viewer .button {
    display: block;
    font-size: 14px;
    width: 100%;
    padding: 8px 16px;
    cursor: pointer;
    maring: 0;
    color: var(--custom-viewer-filter-color);
    background: var(--custom-viewer-background);
    border-radius: 3px;
    box-sizing: border-box;
    transition: background 0.1s linear, padding 0.1s ease-in-out;
}
#hololive-custom-viewer .button svg {
    fill: var(--custom-viewer-filter-color);
    vertical-align: middle;
}
#hololive-custom-viewer .button.enabled svg {
    fill: var(--custom-viewer-filter-enabled-fill);
}
#hololive-custom-viewer .button span {
    padding-left: 8px;
}
#hololive-custom-viewer .button:hover {
    background: var(--custom-viewer-filter-hover-background);
    padding-left: 24px;
}
#hololive-custom-viewer .button.filter[filter=recommend],
#hololive-custom-viewer .button.reload {
    color: var(--custom-viewer-filter-recommend-color);
    background: var(--custom-viewer-filter-recommend-background);
}
#hololive-custom-viewer .button.reload svg {
    fill: var(--custom-viewer-filter-recommend-color);
}
#hololive-custom-viewer .button.filter[filter=recommend]:hover,
#hololive-custom-viewer .button.reload:hover {
    background: var(--custom-viewer-filter-recommend-background);
}
#hololive-custom-viewer .button.filter[count]::after {
    display: inline-block;
    content: attr(count);
    font-weight: bold;
    margin-left: 12px;
}
#hololive-custom-viewer .button.hidden {
    display: none;
}
#hololive-custom-viewer .child {
    padding-left: 8px;
}
#hololive-custom-viewer #next {
    display: block;
    font-size: 16px;
    color: #efefef;
    text-align: center;
    margin-top: 20px;
    padding: 16px;
    cursor: pointer;
    color: var(--custom-viewer-next-color);
    background: var(--custom-viewer-next-background);
    padding: 16px;
    border-radius: 3px;
    transition: background 0.1s linear;
}
#hololive-custom-viewer #next.hidden {
    opacity: 0;
}
#hololive-custom-viewer #next:hover {
    background: var(--custom-viewer-next-hover-background);
}
/* slim style */
@media screen and (max-width: 1600px) {
    #hololive-custom-viewer {
        flex-direction: column;
        justify-content: start;
    }
    #hololive-custom-viewer #sub {
        width: calc(min(100%,1280px));
        overflow-y: unset;
        margin: 0 auto;
    }
    #hololive-custom-viewer #main {
        max-width: calc(min(100%,1280px));
        text-align: center;
        margin: 10px auto;
    }
    #hololive-custom-viewer .child {
        padding-left: 0;
        display: inline;
    }
    #hololive-custom-viewer .button {
        display: inline-block;
        padding: 6px 16px;
        width: unset;
        margin: 0 6px 6px 0;
        line-height: 1.5;
        border-radius: 20px;
        background: var(--custom-viewer-slim-filter-background);
    }
    #hololive-custom-viewer .button:hover {
        background: var(--custom-viewer-slim-filter-hover-background);
        padding-left: 16px;
    }
}

            `;
            document.body.appendChild(this.$style);

            this.$container = document.createElement("div");
            this.$container.id = "hololive-custom-viewer";
            this.$container.classList.add("hidden");
            this.$container.innerHTML = myPolicy.createHTML(`
<div id="sub">
<!--
<a class="button filter no-count ${this.config.favorite ? "enabled" : ""}" filter="favorite">
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="14px" height="14px" viewBox="0 0 512 512">
        <path class="shape" d="M473.984,74.248c-50.688-50.703-132.875-50.703-183.563,0c-17.563,17.547-29.031,38.891-34.438,61.391
        c-5.375-22.5-16.844-43.844-34.406-61.391c-50.688-50.703-132.875-50.703-183.563,0c-50.688,50.688-50.688,132.875,0,183.547
		l217.969,217.984l218-217.984C524.672,207.123,524.672,124.936,473.984,74.248z" ></path>
    </svg>
    <span>${t.filter.favorite}</span>
</a>
-->
<a class="button filter no-count ${this.config.lives ? "enabled" : ""}" filter="lives">
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="14px" height="14px" viewBox="0 0 512 512">
        <g><polygon points="352.188,0 131.781,290.125 224.172,290.125 148.313,512 380.219,223.438 284.328,223.438"></polygon></g>
    </svg>
    <span>${t.filter.lives}</span>
</a>
<a class="button filter" filter="all">${t.filter.all}</a>
<a class="button filter" filter="recommend">${t.filter.recommend}</a>
<a class="button filter" filter="jp">${t.filter.jp}</a>
<a class="button filter" filter="en">${t.filter.en}</a>
<a class="button filter" filter="id">${t.filter.id}</a>
<a class="button filter" filter="devis">${t.filter.devis}</a>
<a class="button filter" filter="stars">${t.filter.stars}</a>
<a class="button filter" filter="stars_en">${t.filter.stars_en}</a>
<a class="button filter" filter="outside">${t.filter.outside}</a>
<a class="button filter" filter="talk">${t.filter.talk}</a>
<a class="button filter" filter="singing">${t.filter.singing}</a>
<a class="button filter" filter="rpg">${t.filter.rpg}</a>
<a class="button filter" filter="horror">${t.filter.horror}</a>
<a class="button filter" filter="pvp">${t.filter.pvp}</a>
<a class="button filter" filter="coop">${t.filter.coop}</a>
<a class="button filter" filter="hololive">${t.filter.hololive}</a>
<a class="button filter" filter="video">${t.filter.video}</a>
<a class="button filter" filter="membersonly">${t.filter.membersonly}</a>
<a class="button reload hidden">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" height="14px" width="14px" viewBox="0 0 512 512">
<g>
	<path d="M446.025,92.206c-40.762-42.394-97.487-69.642-160.383-72.182c-15.791-0.638-29.114,11.648-29.752,27.433
		c-0.638,15.791,11.648,29.114,27.426,29.76c47.715,1.943,90.45,22.481,121.479,54.681c30.987,32.235,49.956,75.765,49.971,124.011
		c-0.015,49.481-19.977,94.011-52.383,126.474c-32.462,32.413-76.999,52.368-126.472,52.382
		c-49.474-0.015-94.025-19.97-126.474-52.382c-32.405-32.463-52.368-76.992-52.382-126.474c0-3.483,0.106-6.938,0.302-10.364
		l34.091,16.827c3.702,1.824,8.002,1.852,11.35,0.086c3.362-1.788,5.349-5.137,5.264-8.896l-3.362-149.834
		c-0.114-4.285-2.88-8.357-7.094-10.464c-4.242-2.071-9.166-1.809-12.613,0.738L4.008,182.45c-3.05,2.221-4.498,5.831-3.86,9.577
		c0.61,3.759,3.249,7.143,6.966,8.974l35.722,17.629c-1.937,12.166-3.018,24.602-3.018,37.279
		c-0.014,65.102,26.475,124.31,69.153,166.944C151.607,465.525,210.8,492.013,275.91,492
		c65.095,0.014,124.302-26.475,166.937-69.146c42.678-42.635,69.167-101.842,69.154-166.944
		C512.014,192.446,486.844,134.565,446.025,92.206z"></path>
</g>
</a>
</div>
<div id="main">
<div id="contents"></div>
<a id="next">${t.next}</a>
</a>
</div>
`);
            document.body.appendChild(this.$container);

            this.$sub = this.$container.querySelector("#sub");
            this.$contents = this.$container.querySelector("#contents");
            this.$next = this.$container.querySelector("#next");
            this.$reload = this.$container.querySelector(".reload");

            // events

            this.$container.addEventListener("click", ev => {
                if (ev.target == this.$container || !ev.target.tagName == "A") {
                    this.close();
                    return;
                }
            });

            this.$sub.querySelectorAll(".filter:not(.no-count)").forEach($filter =>{
                var filter = customFilters[$filter.getAttribute("filter")];
                if (filter) {
                    $filter.filter = filter;
                    $filter.addEventListener("click", ev => this.filterByCategory(filter));
                }
            });

            /*
            this.$sub.querySelector("[filter=favorite]").addEventListener("click", async ev => {
                var enabled = this.config.favorite = !this.config.favorite;
                storage.archive.options = this.config;

                ev.target.classList.toggle("enabled", enabled);
                var streams = await this.updateStreams({}, true);
                if (streams) {
                    this.drawStreams(streams);
                }
            });*/

            this.$livesFilter = this.$container.querySelector("#sub [filter=lives]");
            this.$livesFilter.addEventListener("click", async ev =>{
                var enabled = this.config.lives = !this.config.lives;
                storage.archive.options = this.config;

                this.$livesFilter.classList.toggle("enabled", enabled);
                var streams = await this.updateStreams({}, true);
                if (streams) {
                    this.drawStreams(streams);
                }
            });

            this.$next.addEventListener("click", async ev => {
                try{
                    this.$next.classList.add("hidden");
                    await this.continue();
                } finally {
                    this.$next.classList.remove("hidden");
                }
            });

            this.$reload.addEventListener("click", async ev => {
                try {
                    var streams = await this.updateStreams({}, true);
                    if (streams) {
                        this.drawStreams(streams);
                    }
                } finally {
                    this.$reload.classList.add("hidden");
                }
            });
        }

        this.createStream = function (data) {
            // console.log(data);

            try {
                var $stream = document.createElement("a");
                $stream.data = data;
                $stream.classList.add("hololive-stream");
                $stream.setAttribute("stream-status", data.status);
                $stream.setAttribute("topic", data.topic_id);

                var site = "";
                // サムネサイズダウン、Youtube以外のサムネURL取得
                var thumbnail = data.thumbnail, href;
                if (data.type == "placeholder") {
                    // twitch
                    if (data.link.indexOf("https://twitch.tv/") == 0) {
                        thumbnail = thumbnail.replace("1920x1080", "426x240");
                        site = "twitch";
                    }
                    // twitter
                    if (thumbnail.indexOf("https://pbs.twimg.com/") == 0) {
                        thumbnail = thumbnail.replace("name=large", "name=small");
                        site = "x";
                    }

                    href = data.link;
                    $stream.target = "_blank";
                } else if (data.type == "stream") {
                    thumbnail = `https://i.ytimg.com/vi/${data.id}/mqdefault.jpg?${new Date(data.published_at).getTime()}`;
                    href = "/watch/" + data.id;
                }
                data.thumbnail = thumbnail;

                // トピック
                var topic = "";
                var title = data.title;
                if (data.topic_id) {
                    topic = t.topic[data.topic_id.toLowerCase()] || data.topic_id.replace(/_/g, " ");
                } else {
                    var m = data.title.match(/^【([^】]*?)】/) || data.title.match(/^≪([^≫]*?)≫/) || data.title.match(/(#.*?)\s/);
                    if (m) {
                        topic = m[1].trim();
                    }
                }
                title = title.replace(/【[^】]*?】/g, "");
                title = title.replace(/≪[^≫]*?≫/g, "");
                title = title.replace(/(※.*?|※?\s?)(ネタバレ(あり)?|spoiler alert)/gi, "");
                title = title.trim();

                var name = data.channel.name;

                // 配信時間
                var hours, mins, secs, duration = data.duration;
                //  var time = this.toLiveDate(data.start_actual, data.start_scheduled, data.ended, data.published_at);
                if (data.status == "live") {
                    duration = Math.floor((new Date().getTime() - new Date(data.available_at).getTime()) / 1000);
                }

                hours = Math.floor(duration / 60 / 60);
                mins = ("00" + Math.floor(duration / 60 % 60)).slice(-2);
                secs = ("00" + Math.floor(duration % 60)).slice(-2);

                var icon = data.channel.photo.replace("=s800", "=s144");
                $stream.href = href;
                $stream.innerHTML = myPolicy.createHTML(`
<div class="thumbnail" style="background-image: url('${data.thumbnail}'), url('${data.channel.photo}');">
    <div class="date">${hours}:${mins}:${secs}</div>
    <div class="topic">${topic}</div>
    <div class="site" class="${site}"></div>
</div>
<div class="title-wrapper"><div class="title">${title}</div><div class="name">${name}</div></div>
<div class="photo" style="background-image: url('${icon}');" />
`);
                $stream.addEventListener("mouseenter", this.previewStream, false);
            } catch(ex) {
                console.log(ex);
            }
            return $stream;
        }

        this.updateLiveDate = function () {
            if (!this.$contents) return;

            this.$contents.querySelectorAll(".hololive-stream[stream-status=live]").forEach(e => {
                var duration = Math.floor((new Date().getTime() - new Date(e.data.available_at).getTime()) / 1000);
                var hours = Math.floor(duration / 60 / 60);
                var mins = ("00" + Math.floor(duration / 60 % 60)).slice(-2);
                var secs = ("00" + Math.floor(duration % 60)).slice(-2);
                e.querySelector(".date").innerText = `${hours}:${mins}:${secs}`;
            });
        }

        this.drawStreams = function (newStreams, isAppend) {
            this.archive = isAppend ? this.archive.concat(newStreams) : newStreams;

            if (!isAppend) {
                this.$contents.innerText = "";
            }
            newStreams
                // .filter(data => !(data.status == "upcoming" && new Date().getTime() - new Date(data.available_at).getTime() > 0)) // fix to status bug in holodex
                .forEach(data => self.$contents.appendChild(self.createStream(data)));

            this.countCategory();
            this.filterByCategory();

            if (!isAppend) {
                this.$reload.classList.add("hidden");
                this.shouldReloadTimer = clearTimeout(this.shouldReloadTimer);
                this.shouldReloadTimer = setTimeout(() => this.$reload.classList.remove("hidden"), 180 * 1000);
            }
        }

        this.open = async function () {
            this.config = Object.assign({
                lives: false,
                favorite: false,
            }, storage.archive.options);

            this.$container.classList.remove("hidden");
            this.$reload.classList.add("hidden");
            this.updateLiveDateTimer = setInterval(() => this.updateLiveDate(), 1000);

            var streams = await this.updateStreams({}, false).catch(ev => console.log(ev));
            if (streams) {
                this.drawStreams(streams, false);
            }
        }

        this.filterByCategory = function (newFilter) {
            if (newFilter) {
                this.filter = newFilter;
            }

            this.$contents.querySelectorAll(".hololive-stream").forEach($s => {
                $s.classList.toggle("hidden", !$s.hasAttribute(`category-${this.filter.name}`));
            });
        }

        this.countCategory = function () {
            // フィルタ結果を属性にキャッシュ
            var $streams = this.$contents.querySelectorAll(".hololive-stream:not(.counted)");
            $streams.forEach($s => {
                for (var key in customFilters) {
                    var filter = customFilters[key];
                    if (filter.match($s.data)) {
                        $s.setAttribute(`category-${filter.name}`, true);
                    }
                }
                $s.classList.add("counted");
            });

            this.$sub.querySelectorAll(".filter:not(.no-count)").forEach($f => {
                var filterName = $f.getAttribute("filter");
                $f.setAttribute("count", this.$contents.querySelectorAll(`[category-${filterName}=true]`).length);
            });
        }

        this.continue = async function () {
            var newStreams = await this.updateStreams({
                offset: this.archive.length,
            }, true);

            if (newStreams) {
                this.drawStreams(newStreams, true);
            }
        }

        this.close = function () {
            this.$container.classList.add("hidden");
            this.updateLiveDateTimer = clearInterval(this.updateLiveDateTimer);
            this.shouldReloadTimer = clearTimeout(this.shouldReloadTimer);
        }

        //

        this.updateStreams = async function (options, isForce = false) {
            try {
                if (this.isRefreshing) return false;
                this.isRefreshing = true;

                // 十分に新しい、HoloDexから更新の必要はない
                if (!isForce && Date.now() - this.lastUpdated < REFRESH_INTERVAL) {
                    return false;
                }

                if (this.config.lives) {
                    options.status = "past,missing,live,placeholder";
                }

                var response = await holodex.getVideos(options, this.config.favorite).catch(ex => {
                    console.log("cache", ex);
                });

                if (response && Array.isArray(response.items)) {
                    this.lastUpdated = Date.now();

                    return response.items;
                }

                // console.log(response);

                return false;
            } catch (ex) {
                console.log(ex);

                return false;
            } finally {
                this.isRefreshing = false;
            }
        }

        // utils

    }

    function GenFilter(name, channels) {
        this.name = name;
        this.channels = channels || [];
        this.match = stream => this.channels.indexOf(stream.channel.id) >= 0;
    }

    function CategoryFilter(name, category, freewords) {
        this.name = name;
        this.category = Array.isArray(category) ? category : [ category ];
        this.category = this.category.map(c => c.toLowerCase());
        this.freewords = Array.isArray(freewords) ? freewords : [ freewords ];

        this.match = (stream => {
            if (this.category && this.category.indexOf(String(stream.topic_id).toLowerCase()) >= 0) {
                return true;
            }
            if (this.freewords && this.freewords.find(w => stream.title.match(w))) {
                return true;
            }
            return false;
        });
    }

    function Filter(name, func) {
        this.name = name;
        this.func = func;
        this.match = stream => func(stream);
    }

    function initilizeFilters() {
        var filters = {};

        favorites = storage.favorite.channels;
        filters.all = new Filter("all", () => true);
        filters.favorite = new Filter("favorite", (data) => {
            if (!favorites) return true;
            return favorites.indexOf(data.channel.id) >= 0;
        });

        filters.jp = new GenFilter("jp", [
            // hololive official
            "UCJFZiqLMntJufDCHc6bQixg", // @hololive
            "UCozx5csNhCx1wsVq3SZVkBQ", // @holoANroom
            "UCfpWrWvbA34LmrZ9h4Lbwag", // @holoearthofficial
            "UCt4-iv7EP0UU_w733D_r_jA", // @holoindiech
            // jp0
            "UC0TXe_LYZ4scaW2XMyi5_kw",
            "UC5CwaMl1eIgY8h02uZw7u8A",
            "UCDqI2jOz0weumE8s7paEk6g",
            "UC-hM6YJuNYVAmUWxeIr9FeA",
            "UCp6993wxpyDPHUpavwDFqgg",
            // jp1
            "UC1CfXB_kRs3C-zaeTG3oGyg",
            "UCdn5BQ06XqgXoAxIhbqw5Rg",
            "UCFTLzh12_nrtzqBPsTCqenA",
            "UCHj_mh57PVMXhAUDphUQDFA",
            "UCLbtM3JZfRTg8v2KGag-RMw",
            "UCQ0UDLQCjY0rmuxCDE38FGg",
            // jp2
            "UC1suqwovbL1kzsoaZgFZLKg",
            "UC7fk0CB07ly8oSl0aqKkqFg",
            "UCp3tgHXw_HI0QMk1K8qh3gQ",
            "UCvzGlP9oQwU--Y0r9id_jnA",
            // gamers
            "UCdn5BQ06XqgXoAxIhbqw5Rg",
            "UChAnqc_AY5_I3Px5dig3X1Q",
            "UCp-5t9SrOQwXMU7iIjQfARg",
            "UCvaTdHTWBGv3MKj3KVqJVCw",
            // jp3
            "UC1DCedRgGHBdm81E1llLhOQ",
            "UCCzUftO8KOVkV4wQG1vkUvg",
            "UCdyqAaZDKHXg4Ahi7VENThQ",
            "UCvInZx9h3jC2JzsIzoOebWg",
            // jp4
            "UC1uv2Oq6kNxgATlCiez59hw",
            "UCa9Y57gfeY0Zro_noHRVrnw",
            "UCqm3BQLlJfvkTsX_hvm0UmA",
            "UCZlDXzGoo7d44bwdNObFacg",
            // jp5
            "UCAWSyEs_Io8MtpY3m-zqILA",
            "UCFKOVgVbGmX65RxO3EtH3iw",
            "UCK9V2B22uJYu3N7eR_BT9QA",
            "UCUKD-uaobj9jiqB-VXt71mA",
            // holox
            "UC6eWCld0KwmyHFbAqK3V-Rw",
            "UCENwRMx5Yh42zWpzURebzTw",
            "UCs9_O1tRPMQTHQ-N_L6FU2g",
            "UC_vMYWcDjmfdpH6r4TTn1MQ",
        ]);

        filters.en = new GenFilter("en", [
            // en offical
            "UCotXwY6s8pWmuWd_snKYjhg",
            "UCNoxM_Kxoa-_gOtoyjbux7Q", // shorts
            // English -Myth-
            "UCHsx4Hqa-1ORjQTh9TYDhww",
            "UCL_qhgtOy0dy1Agp8vkySQg",
            "UCMwGHR0BTZuLsmjY_NT5Pwg",
            "UCq4ky2drohLT7W0DmDEw1dQ", // @TakanashiKiara_de
            // English -Promise-
            "UC8rcEBzJSleTkf_-agPM20g",
            "UCgmPnx-EEeOrZSg5Tiw7ZRQ",
            "UCmbs8T6MWqUHP1tIQvSgKrg",
            // English -Advant-
            "UCt9H_RpQzhxzlyBxFqrdHqA", // @FUWAMOCOch
            "UCgnfPPb9JI3e9A4cXHnWbyg", // @ShioriNovella
            "UC9p_lqQ0FEDz327Vgf5JwqA", // @KosekiBijou
            "UC_sFNM0z0MWm9A6WlKPuMMg", // @NerissaRavencroft
            // English -Justice-
            "UCDHABijvPBnJm7F-KlNME3w", // @holoen_gigimurin
            "UCl69AEx4MdqMZH7Jtsm7Tig", // @holoen_raorapanthera
            "UCvN5h1ShZtc7nly3pezRayg", // @holoen_ceciliaimmergreen
            "UCW5uhrG1eCBYditmhL0Ykjw", // @holoen_erbloodflame
        ]);

        filters.id = new GenFilter("id", [
            // id1
            "UCAoy6rzhSf4ydcYjJw3WoVg",
            "UCfrWoRGlawPQDQxxeIDRP0Q",
            "UCOyYb1c43VlX9rc_lT6NKQw",
            "UCP0BspO_AMEe3aQqqpo89Dg",
            // id2
            "UC727SQYUvx5pDDGQpTICNWg",
            "UChgTyjG-pdNvxxhdsXfHQ5Q",
            "UCYz_5n-uDuChHtLo7My1HnQ",
            // id3
            "UCjLEmnpCNeisMxy134KPwWw",
            "UCTvHWSfBZgtxE4sILOaurIQ",
            "UCZLZ8Jjx_RN2CXloOmgTHVg"
        ]);

        filters.devis = new GenFilter("devis", [
            // official
            "UC10wVt6hoQiwySRhz7RdOUA", // @hololiveDEV_IS
            "UCu2n3qHuOuQIygREMnWeQWg", // @DEV_IS_FLOWGLOW
            // regloss
            "UCMGfV7TVTmHhEErVJg1oHBQ", // "@HiodoshiAo",
            "UCWQtYtq9EOB4-I5P-3fh8lA", // "@OtonoseKanade",
            "UCtyWhCj3AqKh2dXctLkDtng", // "@IchijouRirika",
            "UCdXAk5MpyLD8594lm_OvtGQ", // "@JuufuuteiRaden",
            "UC1iA6_NT4mtAcIII6ygrvCw", // "@TodorokiHajime",
            // glowflow
            "UC9LSiN9hXI55svYEBrrK-tw", // @IsakiRiona
            "UCGzTVXqMQHa4AgJVJIVvtDQ", // @KikiraraVivi
            "UCjk2nKmHzgH5Xy-C5qYRd5A", // @MizumiyaSu
            "UCKMWFR6lAstLa7Vbf5dH7ig", // @RindoChihaya
            "UCuI_opAVX6qbxZY-a-AxFuQ", // @KoganeiNiko
        ]);

        filters.stars = new GenFilter("stars", [
            // official stars
            "UCWsfcksUUpoEvhia0_ut0bA",
            // stars1
            "UC6t3-_N8A6ME1JShZHHqOMw",
            "UC9mf_ZVpouoILRY9NUIaK-w",
            "UCKeAhJvy8zgXWbh9duVjIaQ",
            "UCZgOv3YDEs-ZnZWDYVwJdmA",
            // stars2
            "UCANDOlYTJT7N5jlRC3zfzVA",
            "UCGNI4MENvnsymYjKiZwv9eg",
            "UCNVEsYbiZjH5QLmGeSgTSzg",
            // stars3
            "UChSvpZYRPh0FvG4SJGSga3g",
            "UCwL7dgTxKo8Y4RFIKWaf8gA",
            // HOLOSTARS UPROAR!!
            "UCc88OV45ICgHbn3ZqLLb52w",
            "UCdfMHxjcCc2HSd9qFvfJgjg",
            "UCgRqGV1gBf2Esxh0Tz1vxzw",
        ]);

        filters.stars_en = new GenFilter("stars_en", [
            // stars en official
            "UCJxZpzx4wHzEYD-eCiZPikg",
            // tempus
            "UCyxtGMdWlURZ30WSnEjDOQw",
            "UC2hx0xVkMoHGWijwr_lA01w",
            // tempus 2
            "UCHP4f7G2dWD4qib7BMatGAw",
            "UC060r4zABV18vcahAWR1n7w",
            "UC7gxU6NXjKF1LrgOddPzgTw",
            "UCMqGG8BRAiI1lJfKOpETM_w",
            // armis
            "UCajbFh6e_R8QZdHAMbbi4rQ",
            "UCJv02SHZgav7Mv3V0kBOR8Q",
            "UCLk1hcmxg8rJ3Nm1_GvxTRA",
            "UCTVSOgYuSWmNAt-lnJPkEEw",
        ]);

        filters.stars_all = new GenFilter("stars_all", [].concat(filters.stars.channels, filters.stars_en.channels));

        filters.outside = new Filter("outside", (() => {
            var allChannels = [].concat(filters.jp.channels, filters.en.channels, filters.id.channels, filters.devis.channels, filters.stars.channels, filters.stars_en.channels);
            return s => allChannels.indexOf(s.channel.id) == -1;
        })());

        filters.singing = new CategoryFilter("singing", ["singing"]);

        filters.talk = new CategoryFilter("talk", [
            "asmr","camera_stream","chatbot","cooking_stream","drawing","drawing_personality_test","duolingo","eat","english_lesson","english_only",
            "japanese_lesson","japanese_only","mashmallow","morning","review","roleplay","talk","totus","trpg","unboxing","vlog","vrchat","watchalong"
        ]);

        filters.recommend = new CategoryFilter("recommend", [
            "announce", "celebration", "3d_stream", "debut_stream", "birthday", "anniversary", "totsu", "outfit_reveal", "teaser"]);

        filters.membersonly = new CategoryFilter("membersonly", "membersonly", ["メン限", "メンバー限定"]);

        filters.rpg = new CategoryFilter("rpg", [
            "13_sentinels:_aegis_rim","ace_attorney","armored_core","assassings_creed","bioshock","bloodborne","black_myth:wukong","bleach","clair_obscur","cyberpunk_2077",
            "dark_souls","dead_space","death_stranding","demon's_soul","detroit:_become_human","devil_may_cry","dragon_ball_z_:_kakarot","dragon's_dogma","dragon_quest","dying_light",
            "earthbound","elden_ring","elder_scrolls",
            "fate/samurai_remnant","fallout","final_fantasy","final_fantasy_online","fire_emblem","fire_emblem","frostpunk",
            "ghostwire: tokyo","gta","gta5",
            "hogwarts_legacy","judgment","live_a_live",
            "mafia","metal_gear","metal_gear","nier","no_man's_sky",
            "omori","one_piece_odyssey","persona","persona","pokemon","read_dead","romancing_saga","sekiro","starfield",
            "red_dead","tales_of","undertale","undertale","yakuza","yokai_watch","witcher3","zelda",
        ]);

        filters.pvp = new CategoryFilter("pvp", [
            "apex","arena_of_valor","call_of_duty","counter-strike",
            "darker_and_darker","dbd","deltarune","dota","fallguys","fortnite","fatal_fury","guilty_gear",
            "hearthstone","league_of_legends","mariokart","mahjong","marvel_rivals",
            "overwatch","pupg","rainbow_six",
            "slither.io","smash","soulcalibur","splatoon","street_fighter","tarkov","tarkov","teamfight_tactics","tetris",
            "valorant","yu-gi-oh!"
        ]);

        filters.coop = new CategoryFilter("coop", [
            "7_days_to_die","a_way_out","among_us","animal_crossing","ark","buckshot_roulette","back4blood","bokura","content_warning","core_keeper","craftopia",
            "dinkum","devour","fifa","gartic_phone","ghost_exorism_inc.","gta",
            "hacktag","heave_ho","hide_and_shriek","human_fall_flat","it_takes_two","keep_talking_nobody_explode",
            "l4d2","lethal_company","liar's_bar","mario_party","minecraft","monhan","monopoly","mahjong",
            "operation_tango","overcooked","panicore","party_animals","phasmophobia","pico_park","plateup","project_winter","pummel_party","raft","r.e.p.o.","rust",
            "school_labyrinth","split_friction","super_bunny_man","terraria","the_forest","the_headliners","ultimate_chicken_horse","uno","unrailed","unravel_two",
            "valheim","vrchat","words_on_stream","we_were_here"
        ]);

        filters.horror = new CategoryFilter("horror", [
            "ao_oni","brokenlore","convenience_store","devour","don't_scream",
            "fatal_frame","friday_night_funkin'","ghost_room",
            "ib","imi_ga_wakaru_to_kowai_manga","inunaki_tunnel","jumpscare_scare_jump","kinki_spiritual_affairs_bureau","kusodeka_bayashi",
            "little_nightmares","luigi's_mansion","night_deliverry","night_security", "naribikimura",
            "outlast","poppy_playtime","parasocial","phasmophobia","residentevil","poppy_playtime",
            "school_labyrinth","silent_hill","shadow_corridor","shinkansen_0","soma",
            "the_bathhouse","the_closing_shift","the_karaoke","the_working_dead","tsugunohi","visage","yomawari",
        ]);

        filters.hololive = new CategoryFilter("hololive", [
            "holocure","holoearth","hololiveerror","hololive_treasure_mountain","holoparade","holo_x_break",
            "idle_showdown","miko_in_maguma","wowowow_korone_box",
        ], ["Miko In Maguma","WOWOWOW KORONE"]);

        filters.video = new Filter("video", (() => {
            var category = ["shorts", "music_covor", "original_song", "dancing", "animation"];
            return stream => {
                if (category.indexOf(String(stream.topic_id).toLowerCase()) >= 0) {
                    return true;
                }
                if (stream.start_actual && stream.start_scheduled && stream.available_at &&
                    stream.available_at == stream.start_actual == stream.start_scheduled) {
                    return true;
                }
                if (0 < stream.duration && stream.duration < 60 * 6) {
                    return true;
                }
                return false;
            }
        })());

        return filters;
    }

    // Using Holodex/HoloAPI V2 (2.0)
    // @see https://docs.holodex.net/#section/LICENSE
    function Holodex() {
        this.APIKEY = atob('NjYxZjdmOGYtZTM1My00ZDMzLTk2ZjgtMTg3ZTU3NGQ2MmQw');
        this.UA = `${APPNAME}/${VERSION}`;
        this.createXHRData = function (options) {
            var data = "";
            for (var key in options) {
                var value = options[key];
                if (Array.isArray(value)) {
                    value += value.join(",");
                }
                data += `${encodeURIComponent(key)}=${encodeURIComponent(value)}&`;
            }
            return data;
        }

        this.XHR = function (api, data) {
            // console.log(api, data);
            return new Promise((resolve, reject) => {
                var options = {
                    method: "GET",
                    url: api,
                    headers: {
                        "X-APIKEY": this.APIKEY,
                        "user-agent": this.UA,
                    },
                    onload: (context) => {
                        try {
                            resolve(JSON.parse(context.responseText));
                        } catch (ex) {
                            reject(context);
                        }
                    },
                    onerror: reject,
                    onabort: reject,
                    ontimeout: reject,
                };

                if (data) {
                    options.method = "POST";
                    options.data = data.replace("&20", "+");
                    options.headers.application = "x-www-form-urlencoded";
                }

                GM.xmlHttpRequest(options);
            });
        }

        this.getLive = function(options = {}, isUser = false) {
            options = Object.assign({
                type: "placeholder,stream",
                org: "Hololive",
                lang: window.navigator.language == "ja" ? "ja" : "en",
            }, options);

            isUser = false;
            // https://holodex.net/api/v2/live?type=placeholder%2Cstream&org=Hololive
            return this.XHR(`https://holodex.net/api/v2/${isUser ? "users/" : ""}live?${this.createXHRData(options)}`);
        }

        this.getTopics = function () {
            return this.XHR(`https://holodex.net/api/v2/topics`);
        }

        this.getVideos = function(options = {}, isUser = false) {
            options = Object.assign({
                //
                // past, missing, live, placeholder
                status: "past,missing",
                // stream, clip
                type: "stream",
                paginated: false,
                to: new Date().toISOString(),
                org: "Hololive",
                // asc,desc
                // order: "desc",
                // <=50
                limit: 50,
                offset: 0,
                // clips,refers,sources,simulcasts,mentions,description,live_info,channel_stats,songs
                // includes: "live_info,refers",
                // en,ja
                // lang: "all",
                lang: window.navigator.language == "ja" ? "ja" : "en",
            }, options);

            // users api dont allow
            isUser = false;

            return this.XHR(`https://holodex.net/api/v2/${isUser ? "users/" : ""}videos?${this.createXHRData(options)}`);
        }

        this.getChannels = function () {
            var options = {
                org: "Hololive",
                limit: 50,
                offset: 0,
            };
            return this.XHR(`https://holodex.net/api/v2/channels?${this.createXHRData(options)}`);
        }

        this.getFavorite = function (isUser = true) {
            return this.XHR(`https://holodex.net/api/v2/users/${isUser ? "users/" : ""}favorites`);
        }
    }
})();