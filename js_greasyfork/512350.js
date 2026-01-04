// ==UserScript==
// @name              全网VIP免费观看
// @name:zh-CN        全网VIP免费观看
// @namespace         http://tampermonkey.net/
// @version           1.0.21
// @description       全网VIP视频免费观看。支持：腾讯、爱奇艺、优酷、芒果、pptv、乐视等其它网站
// @description:zh-CN 全网VIP视频免费观看。支持：腾讯、爱奇艺、优酷、芒果、pptv、乐视等其它网站
// @icon              data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzAiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcihfMV8yKSIvPgo8cGF0aCBkPSJNMjEuNDk2MSA0My4yODkxTDQwLjU2NDUgMzIuMjU3OEM0MS4zMDA1IDMxLjgwNjEgNDEuMzAwNSAzMC42NTQyIDQwLjU2NDUgMzAuMjAyNUwyMS40OTYxIDE5LjE3MTIiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXIoXzFfMikiIHgxPSIzMiIgeTE9IjIiIHgyPSIzMiIgeTI9IjYyIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiMyQTc5RkYiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMTA1OUI5Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==
// @author            https://pro.gleeze.com/article/46
// @include           *://v.qq.com/x/page/*
// @include           *://v.qq.com/x/cover/*
// @include           *://v.qq.com/tv/*
// @include           *://*.iqiyi.com/v_*
// @include           *://*.iqiyi.com/a_*
// @include           *://*.iqiyi.com/w_*
// @include           *://*.iq.com/play/*
// @include           *://v.youku.com/v_*
// @include           *://*.youku.com/v_*
// @include           *://*.youku.com/video*
// @include           *://*.youku.com/*?vid=*
// @include           *://*.mgtv.com/b/*
// @include           *://*.tudou.com/listplay/*
// @include           *://*.tudou.com/programs/view/*
// @include           *://*.tudou.com/albumplay/*
// @include           *://film.sohu.com/album/*
// @include           *://tv.sohu.com/v/*
// @include           *://*.bilibili.com/video/*
// @include           *://*.bilibili.com/bangumi/play/*
// @include           *://v.pptv.com/show/*
// @include           *://vip.pptv.com/show/*
// @include           *://www.wasu.cn/Play/show/*
// @include           *://*.le.com/ptv/vplay/*
// @include           *://*.acfun.cn/v/*
// @include           *://*.acfun.cn/bangumi/*
// @include           *://*.1905.com/play/*
// @include           *://m.v.qq.com/x/page/*
// @include           *://m.v.qq.com/x/cover/*
// @include           *://m.v.qq.com/*
// @include           *://m.iqiyi.com/*
// @include           *://m.iqiyi.com/kszt/*
// @include           *://m.youku.com/video/*
// @include           *://m.mgtv.com/b/*
// @include           *://m.tv.sohu.com/v/*
// @include           *://m.film.sohu.com/album/*
// @include           *://m.pptv.com/show/*
// @include           *://m.bilibili.com/anime/*
// @include           *://m.bilibili.com/video/*
// @include           *://m.bilibili.com/bangumi/play/*
// @require           https://update.greasyfork.org/scripts/494892/1376206/jquery-351.js
// @connect           api.bilibili.com
// @grant             GM_addStyle
// @grant             GM_openInTab
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_xmlhttpRequest
// @charset		      UTF-8
// @license           GPL License
// @downloadURL https://update.greasyfork.org/scripts/512350/%E5%85%A8%E7%BD%91VIP%E5%85%8D%E8%B4%B9%E8%A7%82%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/512350/%E5%85%A8%E7%BD%91VIP%E5%85%8D%E8%B4%B9%E8%A7%82%E7%9C%8B.meta.js
// ==/UserScript==

const util = (function () {

    function findTargetElement(targetContainer) {
        const body = window.document;
        let tabContainer;
        let tryTime = 0;
        const maxTryTime = 120;
        return new Promise((resolve, reject) => {
            let interval = setInterval(() => {
                tabContainer = body.querySelector(targetContainer);
                if (tabContainer) {
                    clearInterval(interval);
                    resolve(tabContainer);
                }
                if ((++tryTime) === maxTryTime) {
                    clearInterval(interval);
                    reject(new Error(`Element "${targetContainer}" not found after ${maxTryTime / 2} seconds.`));
                }
            }, 500);
        });
    }

    function urlChangeReload() {
        let oldHref = window.location.href;
        const checkUrlChange = () => {
            const newHref = window.location.href;
            if (oldHref !== newHref) {
                window.location.reload();
            } else {
                requestAnimationFrame(checkUrlChange);  // 使用RAF代替setInterval，提高性能
            }
        };
        checkUrlChange();
    }

    function removeVideo() {
        const observer = new MutationObserver(() => {
            for (let video of document.getElementsByTagName("video")) {
                if (video.src) {
                    video.removeAttribute("src");
                    video.muted = true;
                    video.load();
                    video.pause();
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function syncRequest(option) {
        return new Promise((resolve, reject) => {
            option.onload = (res) => {
                resolve(res);
            };
            option.onerror = (err) => {
                reject(err);
            };
            GM_xmlhttpRequest(option);
        });
    }

    // Debounce function remains available in util, though not used for clicks anymore.
    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    return {
        req: (option) => syncRequest(option),
        findTargetEle: (targetEle) => findTargetElement(targetEle),
        urlChangeReload: () => urlChangeReload(),
        removeVideo: () => removeVideo(),
        debounce: debounce
    }
})();


const superVip = (function () {

    const _CONFIG_ = {
        isMobile: navigator.userAgent.match(/(Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini)/i),
        currentPlayerNode: null,
        vipBoxId: 'vip_jx_box' + Math.ceil(Math.random() * 100000000),
        flag: "flag_vip",
        autoPlayerKey: "auto_player_key" + window.location.host,
        autoPlayerVal: "auto_player_value_" + window.location.host,
        videoParseList: [
            {"name": "1频道", "type": "1,3", "url": "https://jx.xmflv.cc/?url="},
            {"name": "2频道", "type": "1,3", "url": "https://www.yemu.xyz/?url="},
            {"name": "3频道", "type": "1,3", "url": "https://jx.hls.one/?url="},
            {"name": "4频道", "type": "1,2", "url": "https://www.pouyun.com/?url="},
            {"name": "5频道", "type": "1,2", "url": "https://im1907.top/?jx="},
            {"name": "6频道-PC", "type": "1", "url": "https://www.ckplayer.vip/jiexi/?url="},
            {"name": "7频道-PC", "type": "1", "url": "https://www.pangujiexi.com/jiexi/?url="},
            {"name": "8频道-PC", "type": "1", "url": "https://pl.aszzys.com/player/ec.php?code=ikm3u8&if=1&url="},
            {"name": "9频道-PC", "type": "1", "url": "https://jx.2s0.cn/player/?url="},
            {"name": "10频道-PC", "type": "1", "url": "https://jiexi.789jiexi.com/?url="},
            {"name": "11频道-PC", "type": "1", "url": "https://jx.xymp4.cc/?url="},
            {"name": "12频道-PC", "type": "1", "url": "https://jx.aidouer.net/?url="},
            {"name": "13频道-PC", "type": "1", "url": "https://jx.77flv.cc/?url="},
            {"name": "14频道-PC", "type": "1", "url": "https://www.playm3u8.cn/jiexi.php?url="},
            {"name": "15频道-PC", "type": "1", "url": "https://jx.m3u8.tv/jiexi/?url="},
            {"name": "16频道-PC", "type": "1", "url": "https://bd.jx.cn/?url="},
            {"name": "17频道-PC", "type": "1", "url": "https://api.qianqi.net/vip/?url="},
            {"name": "18频道-PC", "type": "1", "url": "https://www.8090g.cn/?url="},
            {"name": "19频道-PC", "type": "1", "url": "https://jx.playerjy.com/?ads=0&url="},
            {"name": "20频道-PC", "type": "1", "url": "https://jx.playerjy.com/?url="},
            {"name": "21频道", "type": "1", "url": "https://jiexi.site/?url="},
            {"name": "22频道-PC", "type": "1", "url": "https://video.isyour.love/player/getplayer?url="},
        ],
        playerContainers: [
            {
                host: "v.qq.com",
                container: "#mod_player,#player-container,.container-player",
                name: "Default",
                displayNodes: ["#mask_layer", ".mod_vip_popup", "#mask_layer", ".panel-tip-pay"]
            },
            {
                host: "m.v.qq.com",
                container: ".mod_player,#player",
                name: "Default",
                displayNodes: [".mod_vip_popup", "[class^=app_],[class^=app-],[class*=_app_],[class*=-app-],[class$=_app],[class$=-app]", "div[dt-eid=open_app_bottom]", "div.video_function.video_function_new", "a[open-app]", "section.mod_source", "section.mod_box.mod_sideslip_h.mod_multi_figures_h,section.mod_sideslip_privileges,section.mod_game_rec"]
            },

            {host: "w.mgtv.com", container: "#mgtv-player-wrap", name: "Default", displayNodes: []},
            {host: "www.mgtv.com", container: "#mgtv-player-wrap", name: "Default", displayNodes: []},
            {
                host: "m.mgtv.com",
                container: ".video-area",
                name: "Default",
                displayNodes: ["div.adFixedContain,div.ad-banner,div.m-list-graphicxcy.fstp-mark", "div[class^=mg-app],div#comment-id.video-comment div.ft,div.bd.clearfix,div.v-follower-info", "div.ht.mgui-btn.mgui-btn-nowelt", "div.personal", "div[data-v-41c9a64e]"]
            },
            {host: "www.bilibili.com", container: "#player_module,#bilibiliPlayer,#bilibili-player", name: "Default", displayNodes: []},
            {host: "m.bilibili.com", container: ".player-wrapper,.player-container,.mplayer", name: "Default", displayNodes: []},
            {host: "www.iqiyi.com", container: "#video", name: "Default", displayNodes: ["#playerPopup", "#vipCoversBox" ,"#video > div.covers_cloudCover__ILy8R.covers_pcw__jFO8q","div[class^=qy-header-login-pop]"]},
            {
                host: "m.iqiyi.com",
                container: ".m-video-player-wrap,iqpdiv.iqp-player",
                name: "Default",
                displayNodes: ["div.m-iqyGuide-layer", "a[down-app-android-url]", "[name=m-extendBar]", "[class*=ChannelHomeBanner]", "section.m-hotWords-bottom"]
            },
            {host: "www.iq.com", container: ".intl-video-wrap", name: "Default", displayNodes: []},
            {host: "v.youku.com", container: "#playerMouseWheel", name: "Default", displayNodes: ["#iframaWrapper"]},
            {host: "m.youku.com", container: "#player,.h5-detail-player", name: "Default", displayNodes: []},
            {host: "tv.sohu.com", container: "#player", name: "Default", displayNodes: []},
            {host: "film.sohu.com", container: "#playerWrap", name: "Default", displayNodes: []},
            {host: "www.le.com", container: "#le_playbox", name: "Default", displayNodes: []},
            {host: "video.tudou.com", container: ".td-playbox", name: "Default", displayNodes: []},
            {host: "v.pptv.com", container: "#pptv_playpage_box", name: "Default", displayNodes: []},
            {host: "vip.pptv.com", container: ".w-video", name: "Default", displayNodes: []},
            {host: "www.wasu.cn", container: "#flashContent", name: "Default", displayNodes: []},
            {host: "www.acfun.cn", container: "#player", name: "Default", displayNodes: []},
            {host: "vip.1905.com", container: "#player,#vodPlayer", name: "Default", displayNodes: []},
            {host: "www.1905.com", container: "#player,#vodPlayer", name: "Default", displayNodes: []},
        ]
    };

    class BaseConsumer {
        constructor() {
            this.parse = () => {
                util.findTargetEle('body')
                    .then((container) => this.preHandle(container))
                    .then((container) => this.generateElement(container))
                    .then((container) => this.bindEvent(container))
                    .then((container) => this.autoPlay(container))
                    .then((container) => this.postHandle(container))
                    .catch(error => {
                        console.error("SuperVip script initialization failed:", error);
                    });
            }
        }

        preHandle(container) {
            _CONFIG_.currentPlayerNode.displayNodes.forEach((item) => {
                util.findTargetEle(item)
                    .then((obj) => obj.style.display = 'none')
                    .catch(() => {});  // 静默处理，减少警告
            });
            return Promise.resolve(container);
        }

        generateElement(container) {
            GM_addStyle(`
                #${_CONFIG_.vipBoxId} {
                    cursor:pointer;
                    position:fixed;
                    top:120px;
                    left:0px;
                    z-index:99999999 !important;
                    text-align:left;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                    background-color: rgba(33, 33, 33, 0.9);
                    border-radius: 12px;
                    padding: 3px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                }
                #${_CONFIG_.vipBoxId} .control-button {
                    width: 38px; height: 38px;
                    background: linear-gradient(145deg, #2e3138, #26292e);
                    box-shadow: 4px 4px 8px #202226, -4px -4px 8px #343840;
                    border-radius: 10px;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease-in-out;
                }
                 #${_CONFIG_.vipBoxId} #vip_auto {
                    margin-top: 4px;
                 }
                #${_CONFIG_.vipBoxId} .control-button:hover {
                    transform: scale(1.05);
                    box-shadow: 6px 6px 12px #202226, -6px -6px 12px #343840;
                }
                #${_CONFIG_.vipBoxId} .control-button .vip-text {
                    font-weight: bold;
                    font-size: 16px;
                    color: #8c9099;
                }
                #${_CONFIG_.vipBoxId} .control-button .vip-text-v { color: #f44336; }
                #${_CONFIG_.vipBoxId} .control-button .vip-text-p { color: #ffeb3b; }

                #${_CONFIG_.vipBoxId} .auto-icon { fill: #8c9099; width: 16px; height: 16px; transition: fill 0.2s ease-in-out, transform 0.3s ease; margin-right: 4px; }
                #${_CONFIG_.vipBoxId} .auto-icon.on { fill: #4CAF50; transform: rotate(360deg); }

                #${_CONFIG_.vipBoxId} .auto-text { color: #8c9099; font-size: 14px; font-weight: bold; transition: color 0.2s ease-in-out; }
                #${_CONFIG_.vipBoxId} .auto-text.on { color: #4CAF50; }

                #${_CONFIG_.vipBoxId} .vip_list {
                    display:none; position:absolute; border-radius:10px; left:54px; top:0;
                    background-color: #2a2d33;
                    border: 1px solid #3c414a;
                    padding: 10px;
                    width:380px; max-height:400px; overflow-y:auto;
                    box-shadow: 10px 10px 20px #202226, -10px -10px 20px #343840;
                    opacity: 0;
                    transform: translateX(-10px);
                    transition: opacity 0.2s ease-out, transform 0.2s ease-out;
                }
                #${_CONFIG_.vipBoxId} .vip_icon.active .vip_list {
                   display: block;
                   opacity: 1;
                   transform: translateX(0);
                }

                #${_CONFIG_.vipBoxId} .vip_list li{
                    font-size:12px; color:#DCDCDC; text-align:center;
                    width:calc(25% - 14px); line-height:24px; float:left;
                    border:1px solid #4a4f59; padding:0 4px; margin:4px 2px;
                    border-radius:5px;
                    overflow:hidden; white-space: nowrap; text-overflow: ellipsis;
                    transition: all 0.2s ease-in-out;
                    background: #2a2d33;
                    pointer-events: all;
                }
                #${_CONFIG_.vipBoxId} .vip_list li:hover{color:#fff; border-color:#00aaff; background: #3c414a;}
                #${_CONFIG_.vipBoxId} .vip_list ul{padding-left: 10px; margin-block: 0.5em;}
                #${_CONFIG_.vipBoxId} .vip_list::-webkit-scrollbar{width:5px; height:1px;}
                #${_CONFIG_.vipBoxId} .vip_list::-webkit-scrollbar-thumb{background:#4a4f59; border-radius:5px;}
                #${_CONFIG_.vipBoxId} .vip_list::-webkit-scrollbar-track{background:transparent;}
                #${_CONFIG_.vipBoxId} li.selected{color:#fff; border-color:#00aaff; background: #007acc;}
                #${_CONFIG_.vipBoxId} .auto-fallback { display: none; color: #8c9099; font-size: 14px; font-weight: bold; }
            `);

            let type_1_str = "";
            let type_3_str = "";
            _CONFIG_.videoParseList.forEach((item, index) => {
                if (item.type.includes("1")) {
                    type_1_str += `<li class="nq-li" data-index="${index}">${item.name}</li>`;
                }
                if (item.type.includes("3")) {
                    type_3_str += `<li class="tc-li" data-index="${index}">${item.name}</li>`;
                }
            });

            const autoIconSvg = `
                <svg class="auto-icon" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-8 3.58-8 8s3.58 8 8 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                </svg>`;

            $(container).append(`
                <div id="${_CONFIG_.vipBoxId}">
                    <div class="vip_icon">
                        <div class="control-button" title="选择解析源">
                            <span class="vip-text"><span class="vip-text-v">V</span>I<span class="vip-text-p">P</span></span>
                        </div>
                        <div class="vip_list">
                            <div>
                                <h3 style="color:#00aaff; font-weight: bold; font-size: 16px; padding:5px 0px; margin:0;">[内嵌播放]</h3>
                                <ul>
                                    ${type_1_str}
                                    <div style="clear:both;"></div>
                                </ul>
                            </div>
                            <div>
                                <h3 style="color:#00aaff; font-weight: bold; font-size: 16px; padding:5px 0px; margin:0;">[弹窗播放]</h3>
                                <ul>
                                    ${type_3_str}
                                    <div style="clear:both;"></div>
                                </ul>
                            </div>
                             <div style="text-align:left;color:#999;font-size:10px;padding:0px 10px;margin-top:10px;">
                                <b>提示：</b>右键点击悬浮窗可拖动位置。
                            </div>
                        </div>
                    </div>
                    <div class="control-button" id="vip_auto" title="开启/关闭自动解析">
                        ${autoIconSvg}
                    </div>
                </div>`);

            if (!!GM_getValue(_CONFIG_.autoPlayerKey, null)) {
                $(`#${_CONFIG_.vipBoxId} #vip_auto .auto-icon`).addClass('on');
                $(`#${_CONFIG_.vipBoxId} #vip_auto .auto-text`).addClass('on');
            }

            setTimeout(() => {
                const svgElement = document.querySelector(`#${_CONFIG_.vipBoxId} #vip_auto .auto-icon`);
                if (!svgElement || svgElement.getBoundingClientRect().height === 0) {
                    console.warn("自动图标SVG渲染失败，回退到纯文本显示。");
                    $(`#${_CONFIG_.vipBoxId} #vip_auto .auto-icon`).hide();
                    $(`#${_CONFIG_.vipBoxId} #vip_auto .auto-text`).hide();
                    $(`#${_CONFIG_.vipBoxId} #vip_auto .auto-fallback`).show();
                }
            }, 500);

            return Promise.resolve(container);
        }

        bindEvent(container) {
            const vipBox = $(`#${_CONFIG_.vipBoxId}`);
            const vipIcon = vipBox.find(".vip_icon");

            let hideTimeout;
            if (_CONFIG_.isMobile) {
                vipIcon.on("click", (e) => {
                    e.preventDefault();
                    vipIcon.toggleClass('active');
                });
            } else {
                vipIcon.on("mouseenter", () => {
                    clearTimeout(hideTimeout);
                    vipIcon.addClass('active');
                });
                vipIcon.on("mouseleave", () => {
                    hideTimeout = setTimeout(() => {
                        vipIcon.removeClass('active');
                    }, 300);
                });
            }

            const self = this;

            // [OPTIMIZED] Removed debounce for instant click response.
            vipBox.find(".vip_list .nq-li").on('click', function() {
                const index = parseInt($(this).attr("data-index"));
                const selectedApi = _CONFIG_.videoParseList[index];

                // [FIXED] Prevent action if the API URL is empty.
                if (!selectedApi || !selectedApi.url) {
                    return;
                }

                GM_setValue(_CONFIG_.autoPlayerVal, index);
                GM_setValue(_CONFIG_.flag, "true");
                self.showPlayerWindow(selectedApi);
                vipBox.find(".vip_list li").removeClass("selected");
                $(this).addClass("selected");
            });

            // [OPTIMIZED] Removed debounce for instant click response.
            vipBox.find(".vip_list .tc-li").on('click', function() {
                const index = parseInt($(this).attr("data-index"));
                const videoObj = _CONFIG_.videoParseList[index];

                // [FIXED] Prevent opening a new tab if the API URL is empty.
                if (!videoObj || !videoObj.url) {
                    return;
                }

                let url = videoObj.url + window.location.href;
                GM_openInTab(url, {active: true, insert: true, setParent: true});
            });

            vipBox.on('contextmenu', e => e.preventDefault());
            vipBox.on('mousedown', function (e) {
                if (e.which !== 3) return;
                vipBox.css("cursor", "move");
                const positionDiv = $(this).offset();
                let distenceX = e.pageX - positionDiv.left;
                let distenceY = e.pageY - positionDiv.top;
                let isDragging = true;

                const moveHandler = (evt) => {
                    if (!isDragging) return;
                    requestAnimationFrame(() => {
                        let x = evt.pageX - distenceX;
                        let y = evt.pageY - distenceY;
                        const windowWidth = $(window).width();
                        const windowHeight = $(window).height();

                        x = Math.max(0, Math.min(x, windowWidth - vipBox.outerWidth(true)));
                        y = Math.max(0, Math.min(y, windowHeight - vipBox.outerHeight(true)));

                        vipBox.css({ left: x, top: y });
                    });
                };

                $(document).on('mousemove', moveHandler);
                $(document).on('mouseup', () => {
                    isDragging = false;
                    $(document).off('mousemove', moveHandler);
                    vipBox.css("cursor", "pointer");
                });
            });
            return Promise.resolve(container);
        }

        autoPlay(container) {
            $(`#${_CONFIG_.vipBoxId}`).find("#vip_auto").on("click", function () {
                const icon = $(this).find('.auto-icon');
                const text = $(this).find('.auto-text');
                if (!!GM_getValue(_CONFIG_.autoPlayerKey, null)) {
                    GM_setValue(_CONFIG_.autoPlayerKey, null);
                    icon.removeClass('on');
                    text.removeClass('on');
                } else {
                    GM_setValue(_CONFIG_.autoPlayerKey, "true");
                    icon.addClass('on');
                    text.addClass('on');
                }
                setTimeout(() => window.location.reload(), 200);
            });

            if (!!GM_getValue(_CONFIG_.autoPlayerKey, null)) {
                this.selectPlayer(container);
            }
            return Promise.resolve(container);
        }

        selectPlayer(container) {
            let index = GM_getValue(_CONFIG_.autoPlayerVal, 0);
            let autoObj = _CONFIG_.videoParseList[index];
            if (!autoObj || !autoObj.type.includes("1") || !autoObj.url) { // 增加对url是否为空的判断
                const firstEmbeddable = _CONFIG_.videoParseList.find(p => p.type.includes("1") && p.url);
                if (!firstEmbeddable) {
                    console.error("No embeddable (type 1) video source found for autoplay.");
                    return;
                }
                autoObj = firstEmbeddable;
                index = _CONFIG_.videoParseList.indexOf(firstEmbeddable);
                GM_setValue(_CONFIG_.autoPlayerVal, index);
            }

            const self = this;
            setTimeout(function () {
                self.showPlayerWindow(autoObj);
                $(`#${_CONFIG_.vipBoxId}`).find(`.vip_list .nq-li[data-index=${index}]`).addClass("selected");
            }, 1500);
        }

        showPlayerWindow(videoObj, retryCount = 0) {
            // 如果传入的解析对象URL为空，则不执行任何操作
            if (!videoObj || !videoObj.url) {
                console.warn("无效的解析接口，URL为空。");
                return;
            }

            const maxRetries = 3;
            util.findTargetEle(_CONFIG_.currentPlayerNode.container)
                .then((container) => {
                    let url = videoObj.url + window.location.href;
                    $(container).empty();
                    util.removeVideo();
                    let iframeDivCss = "width:100%;height:100%;z-index:9999999;";
                    if (_CONFIG_.isMobile) {
                        iframeDivCss = "width:100%;height:450px;z-index:9999999;";
                    }
                    if (_CONFIG_.isMobile && window.location.href.indexOf("iqiyi.com") !== -1) {
                        iframeDivCss = "width:100%;height:450px;z-index:9999999;margin-top:-56.25%;";
                    }
                    $(container).append(`<div style="${iframeDivCss}"><iframe id="iframe-player-4a5b6c" src="${url}" style="border:none;" allowfullscreen="true" width="100%" height="100%"></iframe></div>`);
                })
                .catch(error => {
                    if (retryCount < maxRetries) {
                        console.warn(`容器未找到，重试中... (${retryCount + 1}/${maxRetries})`);
                        setTimeout(() => this.showPlayerWindow(videoObj, retryCount + 1), 500);
                    } else {
                        alert(`播放器容器 "${_CONFIG_.currentPlayerNode.container}" 未找到，已重试${maxRetries}次。请刷新页面或关闭广告拦截插件。`);
                        console.error(error);
                    }
                });
        }

        postHandle(container) {
            if (!!GM_getValue(_CONFIG_.autoPlayerKey, null)) {
                util.urlChangeReload();
            } else {
                let oldHref = window.location.href;
                const checkUrl = () => {
                    const newHref = window.location.href;
                    if (oldHref !== newHref) {
                        oldHref = newHref;
                        if (!!GM_getValue(_CONFIG_.flag, null)) {
                            window.location.reload();
                        }
                    } else {
                        requestAnimationFrame(checkUrl);
                    }
                };
                checkUrl();
            }
        }
    }

    class DefaultConsumer extends BaseConsumer {}

    // 使用安全的映射代替 eval
    const consumerMap = {
        'Default': DefaultConsumer,
    };

    return {
        start: () => {
            GM_setValue(_CONFIG_.flag, null);
            let playerNode = _CONFIG_.playerContainers.find(value => value.host === window.location.host);
            if (!playerNode) {
                console.warn(window.location.host + "该网站暂不支持。");
                return;
            }
            _CONFIG_.currentPlayerNode = playerNode;
            const consumerName = _CONFIG_.currentPlayerNode.name;
            const ConsumerClass = consumerMap[consumerName];

            if (ConsumerClass) {
                const targetConsumer = new ConsumerClass();
                targetConsumer.parse();
            } else {
                console.error(`Consumer class "${consumerName}" not found.`);
            }
        }
    }

})();

(function () {
    'use strict';
    $(document).ready(function() {
        setTimeout(superVip.start, 1000);
    });
})();
