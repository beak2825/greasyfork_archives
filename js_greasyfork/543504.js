// ==UserScript==
// @name              全网VIP视频解析(UI增强版)
// @namespace         https://greasyfork.org/users/583039
// @version           6.6.8
// @description       全网VIP视频解析UI增强版
// @icon              data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZUAAAGQCAYAAABmlv2IAAAACXBIWXMAAC4jAAAuIwF4pT92AAAHvmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTA1LTE5VDE2OjUyOjA3KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0xMi0wMVQyMjoyMzowNSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0xMi0wMVQyMjoyMzowNSswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4NDlhZWM5Zi0yZTljLWZkNDMtOGEwMS05NzAxYTM1ZjIxNWIiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo2ZGM4ODUyNy1mOTQ4LWUwNDEtYmM3Mi1lZGQzYWU2YTEzMzYiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDozYjM1YmFiMy01Yjc5LWU0NGItODg5Ny0yNjcwMzgxZTIyNjQiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDozYjM1YmFiMy01Yjc5LWU0NGItODg5Ny0yNjcwMzgxZTIyNjQiIHN0RXZ0OndoZW49IjIwMjAtMTItMDFUMjI6MjM6MDUrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iZGVyaXZlZCIgc3RFdnQ6cGFyYW1ldGVycz0iY29udmVydGVkIGZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjg0OWFlYzlmLTJlOWMtZmQ0My04YTAxLTk3MDFhMzVmMjE1YiIgc3RFdnQ6d2hlbj0iMjAyMC0xMi0wMVQyMjoyMzowNSswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9Inht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
// @author            https://pro.gleeze.com/article/46
// @include           *://v.qq.com/x/page/*
// @include           *://v.qq.com/x/cover/*
// @include           *://v.qq.com/tv/*
// @include           *://*.iqiyi.com/v_*
// @include           *://*.iqiyi.com/a_*
// @include           *://*.iqiyi.com/w_*
// @include           *://*.iq.com/play/*
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
// @grant             unsafeWindow
// @grant             GM_addStyle
// @grant             GM_openInTab
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_xmlhttpRequest
// @charset		      UTF-8
// @license           GPL License
// @downloadURL https://update.greasyfork.org/scripts/543504/%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%28UI%E5%A2%9E%E5%BC%BA%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543504/%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%28UI%E5%A2%9E%E5%BC%BA%E7%89%88%29.meta.js
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
                    reject();
                }
            }, 500);
        });
    }

    function urlChangeReload() {
        const oldHref = window.location.href;
        let interval = setInterval(() => {
            let newHref = window.location.href;
            if (oldHref !== newHref) {
                clearInterval(interval);
                window.location.reload();
            }
        }, 500);
    }

    function reomveVideo() {
        setInterval(() => {
            for (let video of document.getElementsByTagName("video")) {
                if (video.src) {
                    video.removeAttribute("src");
                    video.muted = true;
                    video.load();
                    video.pause();
                }
            }
        }, 500);
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

    return {
        req: (option) => syncRequest(option),
        findTargetEle: (targetEle) => findTargetElement(targetEle),
        urlChangeReload: () => urlChangeReload(),
        reomveVideo: () => reomveVideo()
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
    {"name": "UTR", "type": "1,3", "url": "https://jx.nnsvip.cn/?url="},
    {"name": "七哥1", "type": "1,3","url":"https://jx.mmkv.cn/tv.php?url="},
    {"name": "七哥2", "type": "1,3", "url": "https://jx.nnxv.cn/tv.php?url="},
    {"name": "咸鱼", "type": "1,3", "url": "https://jx.77flv.cc/?url="},
    {"name": "虾米", "type": "1,3", "url": "https://jx.xmflv.com/?url="},
    {"name": "M3U8TV", "type": "1,3", "url": "https://jx.m3u8.tv/jiexi/?url="},
    {"name": "螃蟹", "type": "1,3", "url": "https://jx.pxjx.cc/?url="},
    {"name": "极速", "type": "1,3", "url": "https://jx.2s0.cn/player/?url="},
	{"name": "TV1","type": "1,3","url":"https://video.isyour.love/player/getplayer?url="},
    {"name": "Player-JY", "type": "1,3", "url": "https://jx.playerjy.com/?url="},
    {"name": "剖云", "type": "1,3", "url": "https://www.pouyun.com/?url="},
    {"name": "CK", "type": "1,3", "url": "https://www.ckplayer.vip/jiexi/?url="},
    {"name": "qianqi", "type": "1,3", "url": "https://api.qianqi.net/vip/?url="},
	{"name": "8090","type": "1,3","url":"https://www.8090g.cn/?url="},
    {"name": "盘古", "type": "1,3", "url": "https://www.pangujiexi.com/jiexi/?url="},
    {"name": "PM", "type": "1,3", "url": "https://www.playm3u8.cn/jiexi.php?url="},
    {"name": "冰豆", "type": "1,3", "url": "https://bd.jx.cn/?url="},
    {"name": "789", "type": "1,3", "url": "https://jiexi.789jiexi.com/?url="},

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
            {host: "www.iqiyi.com", container: "#outlayer, .iqp-player-videolayer", name: "Default", displayNodes: ["#playerPopup", "#vipCoversBox" ,"div.iqp-player-vipmask", "div.iqp-player-paymask","div.iqp-player-loginmask", "div[class^=qy-header-login-pop]",".covers_cloudCover__ILy8R","#videoContent > div.loading_loading__vzq4j",".iqp-player-guide"]},
            {
                host: "m.iqiyi.com",
                container: ".m-video-player-wrap, .iqp-player-videolayer",
                name: "Default",
                displayNodes: ["div.m-iqyGuide-layer", "a[down-app-android-url]", "div.iqp-player-vipmask", ".loading_loading__vzq4j","[name=m-extendBar]", "[class*=ChannelHomeBanner]", "section.m-hotWords-bottom"]
            },
            {host: "www.iq.com", container: ".intl-video-wrap", name: "Default", displayNodes: []},
            {host: "v.youku.com", container: "#playerMouseWheel", name: "Default", displayNodes: ["#iframaWrapper"]},
            {host: "m.youku.com", container: "#playerMouseWheel,.h5-detail-player", name: "Default", displayNodes: []},
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
                    .then((container) => this.postHandle(container));
            }
        }

        preHandle(container) {
            _CONFIG_.currentPlayerNode.displayNodes.forEach((item, index) => {
                util.findTargetEle(item)
                    .then((obj) => obj.style.display = 'none')
                    .catch(e => console.warn("不存在元素", e));
            });
            return new Promise((resolve, reject) => resolve(container));
        }

        generateElement(container) {
            GM_addStyle(`
                        #${_CONFIG_.vipBoxId} {cursor:pointer; position:fixed; top:120px; left:0px; z-index:9999999; text-align:left;}
                        #${_CONFIG_.vipBoxId} .img_box{width:32px; height:32px;line-height:32px;text-align:center;background-color:#1c1d30;margin:5px 0px;}
                        #${_CONFIG_.vipBoxId} .vip_list {display:none; position:absolute; border-radius:20px; left:34px; top:0; text-align:center; background-color: #1c1d30; border:2px solid #86d4de;padding:10px 20px; min-width:288px; max-height:666px; overflow-y:auto;}
                        #${_CONFIG_.vipBoxId} .vip_list li{border-radius:6px; font-size:13px; color:#86d4de; text-align:center; width:68px; line-height:21px; float:left; border:1px solid gray; padding:0 4px; margin:5px 5px;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;-o-text-overflow:ellipsis;}
                        #${_CONFIG_.vipBoxId} .vip_list li:hover{color:#FF4500;background:#ffffff}
                        #${_CONFIG_.vipBoxId} .vip_list ul{padding-left: 10px;}
                        #${_CONFIG_.vipBoxId} .vip_list::-webkit-scrollbar{width:5px; height:1px;}
                        #${_CONFIG_.vipBoxId} .vip_list::-webkit-scrollbar-thumb{box-shadow:inset 0 0 5px rgba(0, 0, 0, 0.2); background:#A8A8A8;}
                        #${_CONFIG_.vipBoxId} .vip_list::-webkit-scrollbar-track{box-shadow:inset 0 0 5px rgba(0, 0, 0, 0.2); background:#F1F1F1;}
                        #${_CONFIG_.vipBoxId} li.selected{color:#1c84c6; border:1px solid #1c84c6;}
						`);

            let type_1_str = "";
            let type_2_str = "";
            let type_3_str = "";
            _CONFIG_.videoParseList.forEach((item, index) => {
                if (item.type.includes("1")) {
                    type_1_str += `<li class="nq-li" title="${item.name}1" data-index="${index}">${item.name}</li>`;
                }
                if (item.type.includes("2")) {
                    type_2_str += `<li class="tc-li" title="${item.name}" data-index="${index}">${item.name}</li>`;
                }
                if (item.type.includes("3")) {
                    type_3_str += `<li class="tc-li" title="${item.name}" data-index="${index}">${item.name}</li>`;
                }
            });

            $(container).append(`
                <div id="${_CONFIG_.vipBoxId}">
                    <div class="vip_icon">
                        <div class="img_box" title="YaHee, Studio.　全网视频解析　—　QQ:814032057~" style="color:white;font-size:16px;font-weight:bold;border-radius:5px;"><span style="color:#86d4de;">VIP</div>
                        <div class="vip_list">
                            <div>
                                <h3 style="font-size:18px; text-align:center; color:#adf; padding:5px 0px;"><b>全网视频解析【内嵌播放】</b></h3>
                                <ul>
                                    ${type_1_str}
                                    <div style="clear:both;"></div>
                                </ul>
                            </div>
                            <div>
                                <h3 style="font-size:18px; text-align:center; color:#adf; padding:5px 0px;"><b>全网视频解析【弹窗播放】</b></h3>
                                <ul>
                                    ${type_3_str}
                                    <div style="clear:both;"></div>
                                </ul>
                            </div>
                            <div style="font-size:13px; text-align:center; color:#adf; padding:5px 0px;"><b>YaHee, Studio.　QQ:814032057~</b></div>
							<div><span style='font-size:12px; color:white'>未到不惑已入味 , 是否沧桑早侵身.</span>
                        </div>
                </div>`);
            return new Promise((resolve, reject) => resolve(container));
        }

        bindEvent(container) {
            const vipBox = $(`#${_CONFIG_.vipBoxId}`);
            if (_CONFIG_.isMobile) {
                vipBox.find(".vip_icon").on("click", () => vipBox.find(".vip_list").toggle());
            } else {
                vipBox.find(".vip_icon").on("mouseover", () => vipBox.find(".vip_list").show());
                vipBox.find(".vip_icon").on("mouseout", () => vipBox.find(".vip_list").hide());
            }

            let _this = this;
            vipBox.find(".vip_list .nq-li").each((liIndex, item) => {
                item.addEventListener("click", () => {
                    const index = parseInt($(item).attr("data-index"));
                    GM_setValue(_CONFIG_.autoPlayerVal, index);
                    GM_setValue(_CONFIG_.flag, "true");
                    _this.showPlayerWindow(_CONFIG_.videoParseList[index]);
                    vipBox.find(".vip_list li").removeClass("selected");
                    $(item).addClass("selected");
                });
            });
            vipBox.find(".vip_list .tc-li").each((liIndex, item) => {
                item.addEventListener("click", () => {
                    const index = parseInt($(item).attr("data-index"));
                    const videoObj = _CONFIG_.videoParseList[index];
                    let url = videoObj.url + window.location.href;
                    GM_openInTab(url, {active: true, insert: true, setParent: true});
                });
            });

            //右键移动位置
            vipBox.mousedown(function (e) {
                if (e.which !== 3) {
                    return;
                }
                e.preventDefault()
                vipBox.css("cursor", "move");
                const positionDiv = $(this).offset();
                let distenceX = e.pageX - positionDiv.left;
                let distenceY = e.pageY - positionDiv.top;

                $(document).mousemove(function (e) {
                    let x = e.pageX - distenceX;
                    let y = e.pageY - distenceY;
                    const windowWidth = $(window).width();
                    const windowHeight = $(window).height();

                    if (x < 0) {
                        x = 0;
                    } else if (x > windowWidth - vipBox.outerWidth(true) - 100) {
                        x = windowWidth - vipBox.outerWidth(true) - 100;
                    }

                    if (y < 0) {
                        y = 0;
                    } else if (y > windowHeight - vipBox.outerHeight(true)) {
                        y = windowHeight - vipBox.outerHeight(true);
                    }
                    vipBox.css("left", x);
                    vipBox.css("top", y);
                });
                $(document).mouseup(function () {
                    $(document).off('mousemove');
                    vipBox.css("cursor", "pointer");
                });
                $(document).contextmenu(function (e) {
                    e.preventDefault();
                })
            });
            return new Promise((resolve, reject) => resolve(container));
        }

        autoPlay(container) {
            const vipBox = $(`#${_CONFIG_.vipBoxId}`);
            vipBox.find("#vip_auto").on("click", function () {
                if (!!GM_getValue(_CONFIG_.autoPlayerKey, null)) {
                    GM_setValue(_CONFIG_.autoPlayerKey, null);
                    $(this).html("关");
                    $(this).attr("title", "是否打开自动解析。若自动解析失败，请手动选择其它接口尝试！！");
                } else {
                    GM_setValue(_CONFIG_.autoPlayerKey, "true");
                    $(this).html("开");
                }
                setTimeout(function () {
                    window.location.reload();
                }, 200);
            });

            if (!!GM_getValue(_CONFIG_.autoPlayerKey, null)) {
                this.selectPlayer();
            }
            return new Promise((resolve, reject) => resolve(container));
        }

        selectPlayer() {
            let index = GM_getValue(_CONFIG_.autoPlayerVal, 2);
            let autoObj = _CONFIG_.videoParseList[index];
            let _th = this;
            if (autoObj.type.includes("1")) {
                setTimeout(function () {
                    _th.showPlayerWindow(autoObj);
                    const vipBox = $(`#${_CONFIG_.vipBoxId}`);
                    vipBox.find(`.vip_list [title="${autoObj.name}1"]`).addClass("selected");
                    $(container).find("#vip_auto").attr("title", `自动解析源：${autoObj.name}`);
                }, 1500);
            }
        }

        showPlayerWindow(videoObj) {
            util.findTargetEle(_CONFIG_.currentPlayerNode.container)
                .then((container) => {
                    const type = videoObj.type;
                    let url = videoObj.url + window.location.href;
                    if (type.includes("1")) {
                        $(container).empty();
                        util.reomveVideo();
                        let iframeDivCss = "width:100%;height:100%;z-index:999999;";
                        if (_CONFIG_.isMobile) {
                            iframeDivCss = "width:100%;height:450px;z-index:999999;";
                        }
                        if (_CONFIG_.isMobile && window.location.href.indexOf("iqiyi.com") !== -1) {
                            iframeDivCss = "width:100%;height:450px;z-index:999999;margin-top:-56.25%;";
                        }
                        $(container).append(`<div style="${iframeDivCss}"><iframe id="iframe-player-4a5b6c" src="${url}" style="border:none;" allowfullscreen="true" width="100%" height="100%"></iframe></div>`);
                    }
                });
        }

        postHandle(container) {
            if (!!GM_getValue(_CONFIG_.autoPlayerKey, null)) {
                util.urlChangeReload();
            } else {
                let oldHref = window.location.href;
                let interval = setInterval(() => {
                    let newHref = window.location.href;
                    if (oldHref !== newHref) {
                        oldHref = newHref;
                        if (!!GM_getValue(_CONFIG_.flag, null)){
                            clearInterval(interval);
                            window.location.reload();
                        }
                    }
                }, 1000);
            }
        }

    }

    class DefaultConsumer extends BaseConsumer {
    }

    return {
        start: () => {
            GM_setValue(_CONFIG_.flag, null);
            let mallCase = 'Default';
            let playerNode = _CONFIG_.playerContainers.filter(value => value.host === window.location.host);
            if (playerNode === null || playerNode.length <= 0) {
                console.warn(window.location.host + "该网站暂不支持,请呼叫网管ლ(╹◡╹ლ)");
                return;
            }
            _CONFIG_.currentPlayerNode = playerNode[0];
            mallCase = _CONFIG_.currentPlayerNode.name;
            const targetConsumer = eval(`new ${mallCase}Consumer`);
            targetConsumer.parse();
        }
    }

})();

(function () {
    superVip.start();
})();
