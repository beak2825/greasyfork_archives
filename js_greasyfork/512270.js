// ==UserScript==
// @name        4chan-minimap
// @namespace   Violentmonkey Scripts
// @match       *://boards.4chan.org/*
// @grant       none
// @version     0.0.45
// @author      doomkek
// @description Minimap view of the thread
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512270/4chan-minimap.user.js
// @updateURL https://update.greasyfork.org/scripts/512270/4chan-minimap.meta.js
// ==/UserScript==
(function () {


    THREAD_MINIMAP = {
        addons: [],
        registerAddon: function (addon) {
            this.addons.push(addon);
        }
    };
    const utils = {
        appendStyle: function (style) {
            var s = document.createElement("style");
            s.appendChild(document.createTextNode(style));
            document.body.appendChild(s);
        }
    };

    const debug = false;
    const settings = {
        get width() { return 80; },// / window.devicePixelRatio; },
        get is4ChanX() { return document.documentElement && document.documentElement.classList.contains('fourchan-x'); },
        get threadNumber() { return (location.href.match(/\/thread\/(\d+)/) || [])[1]; },
        thumbHeight: "dynamic",   // dynamic, static
    };

    const style = {
        get postBackgroundColor() { return window.getComputedStyle(thread.firstPost.element.querySelector(".post.reply"))["background-color"]; },
        get postBorderColor() { return window.getComputedStyle(thread.firstPost.element.querySelector(".post.reply"))["border-right-color"]; },
        get postTextColor() { return window.getComputedStyle(thread.firstPost.element.querySelector(".post.reply"))["color"]; },
        get nameTextColor() { return window.getComputedStyle(thread.firstPost.element.querySelector(".postInfo.desktop .name"))["color"]; },
        opacity: 0.8,
        mapBackgroundColor: "",
        mapPostBorderColor: "#b7c5d9",
        mapPostBackgroundColor: "#d6daf0",
        applyTheme: function() {
            document.getElementById("minimap-scrollbar").style.borderLeftColor = style.postBorderColor;
        },
        get isLightTheme() { return style.getContrastColor(style.rgbToHex(style.postBackgroundColor)) == "#000000"; },
        convertRgbToRgba: function(rgbValue, alpha) {
            const match = rgbValue.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (!match) {
                throw new Error('Invalid RGB format');
            }

            const [_, r, g, b] = match;
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        },
        rgbToHex: function(rgbValue) {
            const match = rgbValue.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d*\.?\d+))?\)/);
            if (!match) {
                throw new Error('Invalid RGB(A) format');
            }

            const [_, r, g, b, a] = match;

            const toHex = (value) => parseInt(value).toString(16).padStart(2, '0');
            const hexR = toHex(r);
            const hexG = toHex(g);
            const hexB = toHex(b);

            let hexA = '';
            if (a !== undefined) {
                hexA = toHex(Math.round(parseFloat(a) * 255));
            }

            return `#${hexR}${hexG}${hexB}${hexA}`;
        },
        getContrastColor: function(hexColor) {
            if (!/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(hexColor)) {
                throw new Error('Invalid HEX color format');
            }

            if (hexColor.length === 4) {
                hexColor = `#${hexColor[1]}${hexColor[1]}${hexColor[2]}${hexColor[2]}${hexColor[3]}${hexColor[3]}`;
            }

            const r = parseInt(hexColor.slice(1, 3), 16);
            const g = parseInt(hexColor.slice(3, 5), 16);
            const b = parseInt(hexColor.slice(5, 7), 16);
            const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            return luminance > 128 ? '#000000' : '#ffffff';
        },
    };

    const css = `
        html, body {
            scrollbar-width: none;
            overflow: scroll;
        }
        body {
            margin-right: ${settings.width}px;
        }
        body::-webkit-scrollbar {
            display: none;
        }
        :root.mini-sidebar:root.right-sidebar .boardTitle {
            right: ${settings.width + 32}px;
        }
        #minimap-scrollbar {
            /*box-shadow: inset 0 0 10px gray;*/
            border-left: 1px solid #d9bFb7;
        }
        #navlinks, #header-bar {
            margin-right: ${settings.width}px;
        }
        #navlinks {
            top: 30px;
        }
        .post-marker {
            width: 15px;
            height: 15px;
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
            position: absolute;
            cursor: pointer;
            font-size: 10px;
            //color: #800000;
            display: flex;
            justify-content: center;
            align-items: center;
            text-shadow: "black 0.5px 0.5px";
            border-top: 1px solid;
            z-index: 0;
        }
        /*.post-marker:hover {
            transform: scale(1.5);
            margin-left: 4px;
            z-index: 1000;
        }*/
        .filtered-post-marker {
            height: 1px;
            background-color: black;
            width: 10px;
            position: absolute;
            margin-left: ${settings.width - 11}px;
        }
        .you-post-marker {
            width: 10px;
            height: 2px;
            background-color: red;
            position: absolute;
            cursor: pointer;
            margin-left: ${settings.width - 21}px;
        }`;

    const gs = {
        get shrinkMult() { return settings.width / window.innerWidth }
    }

    const thread = {
        posts: {},
        getPostByNo: (no) => thread.posts[no],
        get postsArr() { return Object.values(thread.posts); },
        get firstPost() { return thread.postsArr.find(p => !p.hidden); },
        get lastPost() { return thread.postsArr.reverse().find(p => !p.hidden); },
        get postsCount() { return thread.postsArr.length; },
        get scrollableArea() { return document.documentElement.scrollHeight - window.innerHeight; },
        init: function () {
            this.buildVirtualThread();
        },
        buildVirtualThread: function () {
            var pElements = document.querySelectorAll(".postContainer.replyContainer");

            pElements.forEach((p, i) => {
                if (p.parentElement.classList.contains("inline") || p.id.indexOf("_") >= 0)
                    return;

                var dt = new Date(Number(p.querySelector("span.dateTime").getAttribute("data-utc")) * 1000);
                var post = {
                    no: p.id.substring(2),
                    element: p,
                    ts: dt.getTime() / 1000,
                    date: dt,
                    dateString: `${dt.getDay().toString().padStart(2, "0")}/${dt.getMonth().toString().padStart(2, "0")}/${dt.getDay().toString().padStart(2, "0")}`,
                    timeString: `${dt.getHours().toString().padStart(2, "0")}:${dt.getMinutes().toString().padStart(2, "0")}:${dt.getSeconds().toString().padStart(2, "0")}`,
                    get positionAbsolute() {
                        return {
                            top: p.getBoundingClientRect().top + window.pageYOffset,
                            left: p.getBoundingClientRect().left + window.pageXOffset
                        }
                    },
                    get positionRelative() {
                        return {
                            top: p.getBoundingClientRect().top,
                            left: p.getBoundingClientRect().left
                        }
                    },
                    get size() {
                        return {
                            height: p.getBoundingClientRect().height,
                            width: p.getBoundingClientRect().width
                        }
                    },
                    get isYou() { return p.classList.contains("quotesYou"); }, // need to add non-X version
                    get hidden() { return p.hasAttribute("hidden") || p.querySelector(".stub") || p.classList.contains("post-hidden"); },
                    get deleted() { return p.classList.contains("deleted-post"); },
                    get replies() {
                        var repl = [];
                        //var nodes = settings.is4ChanX ? p.querySelectorAll() : p.querySelectorAll(`#bl_${post.no} span`);
                        var nodes = []

                        try {
                            nodes = nodes.length == 0 ? p.querySelector(".container").querySelectorAll(".backlink") : nodes;
                        } catch { }
                        try {
                            nodes = nodes.length == 0 ? p.querySelectorAll(`#bl_${post.no} span`) : nodes;
                        } catch { }
                        try {
                            nodes = nodes.length == 0 ? p.querySelectorAll(`span .backlink`) : nodes;
                        } catch { }

                        nodes.forEach(e => repl.push(e.innerText.substring(2).trim()));
                        var ret = repl.reduce((acc, key) => {
                            if (thread.posts.hasOwnProperty(key))
                                acc[key] = thread.posts[key];

                            return acc;
                        }, {});

                        ret["length"] = repl.length;
                        return ret;
                    },
                    scrollIntoView: function () { p.scrollIntoView({/* behavior: "smooth", */block: "center", inline: "start" }); }
                };

                this.posts[post.no] = post;
            });
        },
        onThreadUpdate: function () {
            // we have access to new posts
            // instead of rebuilding whole thing we need to process only changes
            this.buildVirtualThread();
        }
    }

    const menu = {
        menuNode: undefined,
        attachedPost: null,
        createMenu: function () {
            var m = this.menuNode = document.createElement('div');
            m.style.width = "80px";
            m.style.position = "absolute";
            m.style.boxShadow = "0 1px 2px rgba(0, 0, 0, .15)";
            m.style.background = "#b7c5d9";
            m.style.color = "#000";
            m.style.border = "1px solid #b7c5d9";
            m.style.display = "none";
            m.getPostId = function () { return m.id.split('_')[1]; }
            m.getUserId = function () { return m.id.split('_')[2]; }

            menu.insertMenuItem("Highlight", function () {
                var posts = document.getElementsByClassName(m.getUserId());
                for (var i = 0; i < posts.length; i++) {
                    var parentId = posts[i].id.split('_')[1];
                    var parent = document.getElementById('p' + parentId);
                    parent.classList.toggle("highlight");
                }
            });

            menu.insertMenuItem("↑ Prev", function () {
                var id = m.getPostId();
                var posts = thread.getPostsByUserId(m.getUserId());
                for (var i = posts.length - 1; i >= 0; i--) {
                    if (i == 0) {
                        var nextPost = posts.findLast(p => !p.isHidden());
                        if (nextPost) {
                            nextPost.showMenu();
                            nextPost.scrollIntoView();
                        }
                    }

                    if (posts[i].isHidden()) {
                        continue;
                    }

                    if (posts[i].postId < id) {
                        posts[i].showMenu();
                        posts[i].scrollIntoView();
                        break;
                    }
                }
            });

            menu.insertMenuItem("↓ Next", function () {
                var postId = m.getPostId();
                var posts = thread.getPostsByUserId(m.getUserId());
                for (var i = 0; i < posts.length; i++) {
                    if (i + 1 == posts.length) {
                        var nextPost = posts.find(p => !p.isHidden());
                        if (nextPost) {
                            nextPost.showMenu();
                            nextPost.scrollIntoView();
                        }
                    }

                    if (posts[i].isHidden()) {
                        continue;
                    }

                    if (posts[i].postId > postId) {
                        posts[i].showMenu();
                        posts[i].scrollIntoView();
                        break;
                    }
                }
            });

            var toggleHide = function (hide) {
                var userId = m.getUserId();
                var posts = thread.getPostsByUserId(userId);

                if (hide) {
                    filters.addFilter(userId);
                } else {
                    filters.removeFilter(userId);
                }

                for (var i = 0; i < posts.length; i++) {
                    filters.changePostHideState(posts[i].postId, hide);
                }
            }

            menu.insertMenuItem("Hide ID", () => { toggleHide(true); m.style.display = "none"; });
            menu.insertMenuItem("Unhide ID", () => { toggleHide(false); m.style.display = "none"; });

            menu.insertMenuItem("Mute", (menuItem) => {
                filters.toggleMute();
                menu.scrollIntoVeiw();
                menuItem.innerText = filters.isMuted ? "Unmute" : "Mute";
            });
        },
        handleMenuClick: function (e) {
            if (!e.target.id.startsWith('shitpost_') && !e.target.id.startsWith('menu_item_') && menuNode.style.display == "block" && e.target != menuNode) {
                menuNode.style.display = "none";
                document.removeEventListener('click', menu.handleMenuClick);
            }
        },
        insertMenuItem: function (name, handler) {
            var menuItem = document.createElement('div');
            menuItem.innerText = name;
            menuItem.id = "menu_item_" + name.replace(' ', '');
            menuItem.style.height = IS_4CHANX ? "21px" : "18px";
            menuItem.style.cursor = "pointer";
            menuItem.style.paddingLeft = "4px";
            menuItem.style.color = IS_4CHANX ? "var(--fcsp-text)" : "#000";
            menuItem.style.background = IS_4CHANX ? "var(--fcsp-background)" : "#d6daf0";
            menuItem.style.userSelect = "none";

            menuItem.addEventListener('mouseover', function () { menuItem.style.background = IS_4CHANX ? "var(--fcsp-border)" : "#eef2ff"; });
            menuItem.addEventListener('mouseout', function () { menuItem.style.background = IS_4CHANX ? "var(--fcsp-background)" : "#d6daf0"; });
            menuItem.addEventListener('click', e => handler(menuItem));

            menuNode.appendChild(menuItem);
        },
        scrollIntoVeiw: function () {
            if (!this.attachedPost)
                return;

            this.attachedPost.idElement.scrollIntoView({ behavior: 'instant', block: 'center' });
        }
    };

    const scrollbar = {
        element: undefined,
        thumb: undefined,
        slots: [],
        size: {
            get height() { return window.innerHeight; },
            get width() { return scrollbar.element.getBoundingClientRect().width; }
        },

        init: function () {
            this.element = document.createElement("div");
            this.element.id = "minimap-scrollbar";
            this.element.style.height = `${window.innerHeight}px`;
            this.element.style.position = "fixed";
            this.element.style.left = `${window.innerWidth - settings.width}px`;
            this.element.style.top = "0px";

            this.thumb = {
                element: undefined,
                scrollOffset: 0,
                get height() { return settings.thumbHeight === "static" ? 60 : window.innerHeight * gs.shrinkMult <= 20 ? 20 : window.innerHeight * gs.shrinkMult },
                drag: false,

                init: function () {
                    var t = this.element = document.createElement("div");
                    t.id = "minimap-thumb";

                    t.style.width = `${settings.width}px`;
                    t.style.height = `${this.height}px`;
                    var hexBg = style.rgbToHex(style.postBackgroundColor);
                    var bgColor = style.getContrastColor(hexBg) == "#000000" ? "rgb(0,0,0)" : "rgb(255,255,255)";
                    //var transparency = style.getContrastColor(hexBg) == "#000000" ? 0.3 : 0.6;
                    //t.style.background = style.convertRgbToRgba(bgColor, 0.3);
                    t.style.background = style.convertRgbToRgba(style.postBackgroundColor, 0.6);
                    t.style.position = "absolute";

                    // add to drag handle
                    //t.addEventListener("mouseover", (e) => t.style.background = "#00000035");
                    //t.addEventListener("mouseleave", (e) => t.style.background = "#00000025");
                    //t.addEventListener("mousedown", (e) => t.style.background = "#00000045");
                    //t.addEventListener("mouseup", (e) => t.style.background = "#00000035");
                    //t.style.zIndex = 999;

                    this.drag = false;
                    var moveOffset = 0, mouseDownY = 0, lastOffset = -1;
                    var moveThumb = scrollbar.thumb.moveThumb = (clientY) => {
                        var r1 = t.getBoundingClientRect();
                        if (r1.top <= 0) {
                            lastOffset = lastOffset >= 0 ? lastOffset : clientY;

                            if (lastOffset != -1 && clientY > lastOffset) {
                                moveOffset = 1;
                                mouseDownY = clientY;
                            } else {
                                moveOffset = this.scrollOffset = 0;
                            }

                            // console.log("@", clientY, moveOffset, lastOffset);
                        } else if (r1.top + r1.height >= window.innerHeight) {
                            lastOffset = lastOffset >= 0 ? lastOffset : clientY;

                            if (lastOffset != -1 && clientY >= lastOffset) {
                                moveOffset = window.innerHeight - r1.height + 1;
                                mouseDownY = clientY;
                            } else {
                                moveOffset = this.scrollOffset = window.innerHeight - r1.height - 1;
                            }
                            // console.log("!", clientY, moveOffset, lastOffset);
                        } else {
                            lastOffset = -1;
                            moveOffset = clientY - mouseDownY + this.scrollOffset;
                            // console.log("#", clientY, mouseDownY, this.scrollOffset);
                        }

                        t.style.transform = `translateY(${moveOffset}px)`;
                        //console.log(r1.top, t.getBoundingClientRect().top, moveOffset, lastOffset);

                        var precentageScrolled = moveOffset / (window.innerHeight - this.height) * 100;
                        var percentageToPx = precentageScrolled / 100 * thread.scrollableArea;
                        // this.scrollOffset = percentageToPx;
                        // console.log("1111", moveOffset, precentageScrolled, percentageToPx);
                        window.scrollTo(0, percentageToPx);
                    }

                    var mouseMoveHandler = (e) => {
                        if (!this.drag)
                            return;

                        if (e.type === "touchmove") {
                            moveThumb(e.changedTouches[0].clientY);
                        } else {
                            e.preventDefault();
                            moveThumb(e.clientY);
                        }
                    };

                    var mouseDown = (e) => {
                        this.drag = true;

                        mouseDownY = e.type === "touchstart" ? e.changedTouches[0].clientY : e.clientY;

                        document.addEventListener("mousemove", mouseMoveHandler);
                        document.addEventListener("touchmove", mouseMoveHandler);
                    };

                    var mouseUp = (e) => {
                        document.removeEventListener("mousemove", mouseMoveHandler);
                        document.removeEventListener("touchmove", mouseMoveHandler);

                        if (this.drag) {
                            this.scrollOffset = this.scrollOffset - mouseDownY + (e.type === "touchend" ? e.changedTouches[0].clientY : e.clientY);
                        }

                        this.drag = false;
                    };

                    var rClickHandle = (e) => {
                        e.preventDefault();
                        menu.showMenu();
                    }

                    t.addEventListener("click", rClickHandle);
                    t.addEventListener("mousedown", mouseDown);
                    t.addEventListener("touchstart", mouseDown);
                    document.addEventListener("mouseup", mouseUp);
                    document.addEventListener("touchend", mouseUp);
                },
                moveThumb: undefined //detele
            };

            this.thumb.init();
            this.element.appendChild(this.thumb.element);

            this.element.addEventListener("click", (e) => {
                return;
                var thumbHeightHalf = scrollbar.thumb.height / 2;
                var moveOffset = e.clientY - thumbHeightHalf;
                scrollbar.thumb.element.style.transform = `translateY(${moveOffset}px)`;

                var precentageScrolled = moveOffset / (window.innerHeight - scrollbar.thumb.height) * 100;
                var percentageToPx = precentageScrolled / 100 * thread.scrollableArea;
                window.scrollTo(0, percentageToPx);
            });

            document.body.appendChild(this.element);
        },
        resize: function () {
            this.element.style.left = `${window.innerWidth - settings.width}px`; // (20/window.devicePixelRatio)
            this.element.style.top = `0px`;
            this.element.style.height = `${window.innerHeight}px`;
            scrollbar.scroll(window.scrollY);
        },
        scroll: function (offset) {
            var precentageScrolled = Math.min(Math.max((offset / thread.scrollableArea) * 100, 0), 100);
            var percentageToPx = precentageScrolled / 100 * (this.element.getBoundingClientRect().height - this.thumb.height);
            //console.log(precentageScrolled, percentageToPx, offset);
            this.thumb.scrollOffset = percentageToPx;
            this.thumb.element.style.transform = `translateY(${percentageToPx}px)`;
        },
    };

    const minimap = {
        canvas: undefined,
        ctx: undefined,
        buffCanvas: undefined,
        buffCtx: undefined,
        mapInView: false,
        height: 0,

        init: function (context) {
            var c = this.canvas = document.createElement("canvas");
            c.id = "minimap-canvas";
            if (debug)
                c.style.border = "1px solid red";
            c.setAttribute("height", `${this.height = window.innerHeight}px`);
            c.setAttribute("width", `${settings.width}px`);
            c.style.position = "fixed";
            c.style.left = "0px";
            c.style.zIndex = "-1000";

            this.ctx = c.getContext("2d");

            var bc = this.buffCanvas = document.createElement("canvas");
            bc.height = thread.scrollableArea * gs.shrinkMult;
            bc.width = c.width;

            this.buffCtx = bc.getContext("2d");

            this.buildMinimap();
            context.scrollbar.element.appendChild(c);
        },
        scroll: function (offset) {
            this.canvas.style.left = `${window.innerWidth - settings.width}px`;
            this.canvas.style.top = `0px`;

            var c = this.canvas;
            this.ctx.clearRect(0, 0, c.width, c.height);
            this.ctx.drawImage(this.buffCanvas, 0, offset * gs.shrinkMult, c.width, c.height, 0, 0, c.width, c.height);
        },
        buildMinimap: function () {
            var cumulativeHeight = 0;
            var bctx = this.buffCtx;

            thread.postsArr.forEach(post => {
                bctx.lineWidth = 0.5;
                bctx.strokeStyle = style.mapPostBorderColor;

                var sh = (post.size.height + 6) * gs.shrinkMult; //4px is the gap between posts, maybe its not 4px
                var sw = post.size.width * gs.shrinkMult;

                bctx.beginPath();
                bctx.rect(0, cumulativeHeight, sw, sh);
                bctx.fillStyle = style.mapPostBackgroundColor;
                bctx.fillRect(0, cumulativeHeight, sw, sh);
                cumulativeHeight += sh;
                bctx.stroke();
            });

            var c = this.canvas;
            this.ctx.clearRect(0, 0, c.width, c.height);
            this.ctx.drawImage(this.buffCanvas, 0, 0, c.width, c.height, 0, 0, c.width, c.height);
        },
        resize: function () { // deboune this shit, it takes too much resources to rebuild on each resize event
            this.canvas.setAttribute("height", `${this.height = window.innerHeight}px`);
            this.buffCanvas.setAttribute("height", `${window.innerHeight}px`);
            this.canvas.setAttribute("width", `${settings.width}px`);
            this.buffCanvas.setAttribute("width", `${settings.width}px`);
            this.buildMinimap();
        },
        refresh: function () { },
        partialRefresh: function () { },
    }

    const usageChart = {
        ctx: undefined,
        canvas: undefined,
        thumbInfo: undefined,
        data: [],
        init: function (context) {
            var c = this.canvas = document.createElement("canvas");
            c.setAttribute("width", settings.width);
            c.setAttribute("height", window.innerHeight);
            c.style.position = "fixed";
            c.style.top = "0px";
            c.style.zIndex = "-999";
            this.ctx = c.getContext("2d");

            var tooltip = document.createElement("tooltip");
            tooltip.style.position = "fixed";
            tooltip.style.padding = "5px";
            tooltip.style.display = "none";
            tooltip.style.fontSize = "12px";
            tooltip.style.zIndex = 9999;
            tooltip.style.backgroundColor = style.postBackgroundColor;
            tooltip.style.border = `1px solid ${style.postBorderColor}`;
            tooltip.style.borderRadius = "5px";
            document.body.appendChild(tooltip);

            var thumbInfo = usageChart.thumbInfo = document.createElement("div");
            thumbInfo.style.fontSize = "8px";
            thumbInfo.style.color = style.postTextColor;
            thumbInfo.style.userSelect = "none";
            scrollbar.thumb.element.appendChild(thumbInfo);

            usageChart.drawGraph(context);
            usageChart.scroll(0);

            scrollbar.element.addEventListener("mousemove", (event) => {
                var rect = this.canvas.getBoundingClientRect();
                var mouseX = event.clientX - rect.left;
                var mouseY = event.clientY - rect.top;

                var closestIndex = -1;
                var minDistance = Infinity;
                var chartWidth = this.canvas.width;
                var chartHeight = this.canvas.height;
                var maxValue = Math.max(...this.data) * 1.2; // to make right padding
                var minValue = Math.min(...this.data);
                minValue = minValue - minValue / 4
                var ySpacing = (chartHeight - 2) / (this.data.length - 1);

                this.data.forEach((value, index) => {
                    var x = ((value - minValue) / (maxValue - minValue)) * (chartWidth - 5);
                    var y = index * ySpacing;
                    var distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);

                    if (distance < minDistance && distance < 30) { // threshold for hover detection
                        minDistance = distance;
                        closestIndex = index;
                    }
                });

                if (closestIndex !== -1) {
                    tooltip.style.left = `${event.clientX - 50}px`;
                    tooltip.style.top = `${event.clientY - 10}px`;
                    tooltip.style.display = "block";
                    tooltip.innerHTML = `${this.data[closestIndex]}`;
                } else {
                    tooltip.style.display = "none";
                }
            });

            scrollbar.element.addEventListener("mouseleave", () => {
                tooltip.style.display = "none";
            });

            context.attachAddon(c);
        },
        drawGraph: function (context) {
            var posts = [];
            context.thread.postsArr.forEach(post => { posts.push(post.ts); });

            var data = this.data = calcAvgPostsPermInute(posts);
            //console.log(data);
            var chartWidth = this.canvas.width;
            var chartHeight = this.canvas.height;
            var lineColor = style.nameTextColor;
            var maxValue = Math.max(...data) * 1.2; // to make right padding
            var minValue = Math.min(...data);
            minValue = minValue - minValue / 4; // to make left padding
            //console.log(maxValue, minValue);
            this.ctx.clearRect(0, 0, chartWidth, chartHeight);

            this.ctx.beginPath();
            this.ctx.strokeStyle = lineColor;
            this.ctx.lineWidth = 1 * window.devicePixelRatio;
            // add array with virtual coordinates for each datapoin so later I can use it to display mousover or thumb position without calculating position
            var ySpacing = (chartHeight - 2) / (data.length - 1);
            var paddingTop = context.thread.firstPost.positionAbsolute.top * gs.shrinkMult;
            //this.ctx.moveTo(0, paddingTop);
            data.forEach((value, index) => {
                var x = ((value - minValue) / (maxValue - minValue)) * (chartWidth - 5);
                var y = index * ySpacing;
                this.ctx.lineTo(x, y); // +1 because othervise it will be out of bounds of the canvas when x is 0
            });

            this.ctx.stroke();

            function calcAvgPostsPermInute(posts) {
                var tailLength = 25;
                var tl = posts.length >= tailLength ? tailLength : posts.length; //need to make it dynamic depending on the thread length
                var buff = [];
                for (let i = tl <= tailLength ? 1 : tailLength; i < posts.length; i++) {
                    var currentTimeSpanMin = (posts[i] - posts[i <= tl ? 0 : i - tl]) / 60;
                    currentTimeSpanMin = currentTimeSpanMin < 1 ? 1 : currentTimeSpanMin;
                    var avg = (i <= tl ? i : tl) / currentTimeSpanMin;
                    buff.push(Math.floor(avg * 100) / 100);
                }

                var smoothed = [];
                var windowSize = posts.length >= 10 ? 10 : posts.length; //10;
                for (let i = 0; i < buff.length - windowSize + 1; i++) {
                    var window = buff.slice(i, i + windowSize);
                    var avg = window.reduce((sum, val) => sum + val, 0) / windowSize;
                    smoothed.push(Math.floor(avg * 100) / 100);
                }
                //console.log(posts, buff);
                smoothed = smoothed.length == 0 ? buff : smoothed;
                return smoothed;
            }
            function calculatePostsPerInterval(posts) {
                if (!posts || posts.length === 0)
                    return [];

                posts.sort((a, b) => a - b);

                var int = Math.max(Math.ceil((posts[posts.length - 1] - posts[0]) / 150), 60); //150 max data points / 60 min interval
                console.log("int", int);

                var intervals = [];
                var currentInt = posts[0];
                var postCountInt = 0;

                posts.forEach(post => {
                    while (post >= currentInt + int) {
                        intervals.push(postCountInt);

                        currentInt += int;
                        postCountInt = 0;
                    }

                    postCountInt++;
                });

                intervals.push(postCountInt);
                console.log("intervals", intervals);
                return intervals;
            }
        },
        update: function (context) { usageChart.drawGraph(context); },
        scroll: function (scrollY) {
            var closestIndex = -1;
            var posts = thread.postsArr;

            for (let i = 0; i < posts.length; i++) {
                var post = posts[i];
                if (post.positionAbsolute.top - (window.innerWidth / 2) > scrollY) {
                    usageChart.thumbInfo.style.display = "block";
                    usageChart.thumbInfo.innerText = `Avg: ${this.data[i >= this.data.length ? this.data.length - 1 : i]}
Time: ${post.timeString}`;
                    //console.log(post.time);
                    break;
                }
            };
        },
        resize: function (context) {
            this.canvas.setAttribute("height", window.innerHeight);
            usageChart.drawGraph(context);
        }
    }

    const replyCountMarkers = {
        init: function (context) {
            var replyBaseline = 5;
            var prevPost = context.thread.postsArr[0];

            context.thread.postsArr.forEach(post => {
                var replyCount = post.replies.length;

                if (replyCount >= replyBaseline)
                    drawMarker(prevPost, post, replyCount);

                if (!post.hidden)
                    prevPost = post;
            });

            function drawMarker(prevPost, post, replyCount) {
                var marker = document.createElement("div");
                marker.classList.add("post-marker");
                marker.id = `m${post.element.id}`;
                marker.innerText = replyCount;

                marker.style.backgroundColor = style.isLightTheme ? style.postBackgroundColor : style.nameTextColor;
                if (post.hidden)
                    marker.style.filter = `brightness(${style.isLightTheme ? "60%" : "40%"})`;

                marker.style.borderTopColor = style.postBorderColor;
                marker.style.color = style.postTextColor;
                marker.style.top = `${(post.hidden ? prevPost.positionAbsolute.top : post.positionAbsolute.top) * ((window.innerHeight - context.scrollbar.thumb.height) / context.thread.scrollableArea)}px`;

                if (!post.hidden) {
                    marker.addEventListener("click", e => {
                        post.scrollIntoView();
                        post.element.querySelector(`#p${post.no}`).classList.add("highlight");
                        setTimeout(() => { post.element.querySelector(`#p${post.no}`).classList.remove("highlight"); }, 1000);
                    });
                }

                context.scrollbar.element.appendChild(marker);
            }
        },
        scroll: function (context) { },
        resize: function (context) {
            Array.from(document.getElementsByClassName("post-marker")).forEach(elem => elem.remove());
            replyCountMarkers.init(context);
        },
        update: function (context) {
            Array.from(document.getElementsByClassName("post-marker")).forEach(elem => elem.remove());
            replyCountMarkers.init(context);
        }
    }

    const filteredPostsMarkers = {
        init: function (context) {
            var prevPost = context.thread.postsArr[0];

            context.thread.postsArr.forEach(post => {
                if (post.hidden)
                    drawMarker(prevPost, post);

                prevPost = post;
            });

            function drawMarker(prevPost, post) {
                var marker = document.createElement("div");
                marker.classList.add("filtered-post-marker");
                marker.id = `m${post.element.id}`;
                marker.style.top = `${prevPost.positionAbsolute.top * (window.innerHeight / context.thread.scrollableArea)}px`;
                marker.style.backgroundColor = style.getContrastColor(style.rgbToHex(style.postBackgroundColor));

                context.scrollbar.element.appendChild(marker);
            }
        },
        scroll: function (context) { },
        resize: function (context) {
            Array.from(document.getElementsByClassName("filtered-post-marker")).forEach(elem => elem.remove());
            filteredPostsMarkers.init(context);
        },
        update: function (context) {
            Array.from(document.getElementsByClassName("filtered-post-marker")).forEach(elem => elem.remove());
            filteredPostsMarkers.init(context);
        }
    }

    const youPostsMarkers = {
        init: function (context) {
            var prevPost = context.thread.postsArr[0];

            context.thread.postsArr.forEach(post => {
                if (post.isYou)
                    drawMarker(prevPost, post);

                prevPost = post;
            });

            function drawMarker(prevPost, post) {
                var marker = document.createElement("div");
                marker.classList.add("you-post-marker");
                marker.id = `m${post.element.id}`;                                       // need to replace with dynamic % of the current scroll pos of thumb height
                marker.style.top = `${prevPost.positionAbsolute.top * ((window.innerHeight - context.scrollbar.thumb.height) / context.thread.scrollableArea)}px`;

                if (!post.hidden) {
                    marker.addEventListener("click", e => {
                        post.scrollIntoView();
                        post.element.querySelector(`#p${post.no}`).classList.add("highlight");
                        setTimeout(() => { post.element.querySelector(`#p${post.no}`).classList.remove("highlight"); }, 1000);
                    });
                }

                context.scrollbar.element.appendChild(marker);
            }
        },
        scroll: function (context) { },
        resize: function (context) {
            Array.from(document.getElementsByClassName("you-post-marker")).forEach(elem => elem.remove());
            youPostsMarkers.init(context);
        },
        update: function (context) {
            Array.from(document.getElementsByClassName("you-post-marker")).forEach(elem => elem.remove());
            youPostsMarkers.init(context);
        }
    }

    var initDone = false;

    var threadInit = () => {
        // init user userscript detection
        // header-bar fixed position

        if (initDone)
            return;

        initDone = true;

        utils.appendStyle(css);

        thread.init();
        scrollbar.init();
        style.applyTheme();
        scrollbar.scroll(window.scrollY)

        var context = { scrollbar, thread, settings, gs, attachAddon: function (element) { this.scrollbar.element.appendChild(element); } };
        HUI = context;

        var threadUpdateHandler = (e) => {
            console.log("ThreadUpdate");
            thread.buildVirtualThread();
            scrollbar.scroll(window.scrollY);
            style.applyTheme();
            THREAD_MINIMAP.addons.forEach(addon => { addon.update(context); });
        };

        document.addEventListener("4chanThreadUpdated", threadUpdateHandler);
        document.addEventListener("ThreadUpdate", threadUpdateHandler);

        //THREAD_MINIMAP.registerAddon(minimap);
        THREAD_MINIMAP.registerAddon(usageChart);
        THREAD_MINIMAP.registerAddon(replyCountMarkers);
        THREAD_MINIMAP.registerAddon(filteredPostsMarkers);
        THREAD_MINIMAP.registerAddon(youPostsMarkers);

        THREAD_MINIMAP.addons.forEach(addon => {
            addon.init(context);
        });

        document.addEventListener("scroll", () => {
            // console.log("scroll event");

            if (!scrollbar.thumb.drag)
                scrollbar.scroll(window.scrollY);

            THREAD_MINIMAP.addons.forEach(addon => addon.scroll(window.scrollY));
        });

        window.addEventListener("resize", () => {
            console.log("resize event");

            scrollbar.resize();
            THREAD_MINIMAP.addons.forEach(addon => addon.resize(context));
        });

    };


    setTimeout(function () {
        if (settings.threadNumber)
            threadInit();
        /*
        if (!settings.is4ChanX) {
            if (document.readyState !== 'loading') {
                threadInit();
            } else {
                document.addEventListener('DOMContentLoaded', threadInit);
            }
        } else {
            document.addEventListener("4chanMainInit", threadInit);
            document.addEventListener("4chanParsingDone", threadInit);
            document.addEventListener("4chanXInitFinished", threadInit);
        }*/
    }, 1000);


})();
