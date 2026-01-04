// ==UserScript==
// @name              视频v4-自动解析-自用
// @namespace         http://tampermonkey.net/
// @version          2.0.2
// @description       视频v4-自动解析-自用 如果侵权，请联系作者，作者将会第一时间处理（注意：请记得提供有问题的网址）
// @icon              data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAkACQAAD//gAUU29mdHdhcmU6IFNuaXBhc3Rl/9sAQwADAgIDAgIDAwMDBAMDBAUIBQUEBAUKBwcGCAwKDAwLCgsLDQ4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgSFBUU/9sAQwEDBAQFBAUJBQUJFA0LDRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8AAEQgAGgAeAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A8/stTivZLhFV0eBtrhwB+PXpXc/Bj4bXXxy1ObTdE1XTrDUE3GO31PzkMyqMsytHE64Gf4iD6A15TrUx0fUriVQcXcBUY/vjivpb9hGz+w/GLTocYK6dcbvqQCa/Q6ec46dWth21zUFNzdt3zfuvS8btng5rwnkuCy3DZrSi3DGyoqiuZ6JQf1m/flq2hG+yMPTf2e9X1nVPEFlZa9olx/YTmO9nDXKxo4LB1G6AMxUockDB7E1i+Jvg/rnhzw/peuRSWut6RqP+pu9MMjgHBIDK6KwOAe3bBwa+g/hQEPiP41CVmSM6ndbmRdxA3zZIGRn8xXkniP42Wdr4C0Dwp4XhvPI0/wDeTX2oIsbyvhshUR2AGWJ5Y9h71+cUuKuK8ZxVisry6KqUqFSkpJxSiqc6DnKUp7qXPyqKV7pv3WtV8NWyzLKGAhXrNxlNTtZ3fNGdkku3Le/5njU1tDcbfNiSXacrvUHB9q3/AA/438R+Eo5o9D1/VNGSYhpV0+8kgDkdCwRhn8axaK/od0abbbitd9N7bXPh/rNflhDndo3sruyvvbtfrbc6Kf4j+LLq4uJ5vFGszT3CCOaSTUJmaVBnCsS2SBk8H1Nc7RRUU8NRoylOlBRcrXaSTdtFfvZbGU6tSpbnk3buz//Z
// @author            reid
// @match        *
// @include      *
// @require           https://cdn.bootcdn.net/ajax/libs/jquery/3.2.1/jquery.min.js
// @connect           api.bilibili.com
// @grant             unsafeWindow
// @grant             GM_addStyle
// @grant             GM_openInTab
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_xmlhttpRequest
// @charset		      UTF-8
// @license           GPL License
// @downloadURL https://update.greasyfork.org/scripts/440442/%E8%A7%86%E9%A2%91v4-%E8%87%AA%E5%8A%A8%E8%A7%A3%E6%9E%90-%E8%87%AA%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/440442/%E8%A7%86%E9%A2%91v4-%E8%87%AA%E5%8A%A8%E8%A7%A3%E6%9E%90-%E8%87%AA%E7%94%A8.meta.js
// ==/UserScript==

const util = (function () {

    function findTargetElement(targetContainer) {
        const body = window.document;
        let tabContainer;
        let tryTime = 0;
        const maxTryTime = 60;
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
        }, 1000);
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
        urlChangeReload: () => urlChangeReload()
    }
})();


const superVip = (function () {

    const _CONFIG_ = {
        isMobile: navigator.userAgent.match(/(Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini)/i),
        vipBoxId: 'vip_jx_box' + Math.ceil(Math.random() * 100000000),
        autoPlayerKey: "auto_player_key" + window.location.host,
        autoPlayerVal: "auto_player_value_" + window.location.host,
        videoParseList: [
            {"name": "综合", "type": "1,3", "url": "https://jx.jsonplayer.com/player/?url="},
            {"name": "Playerjy", "type": "1,2", "url": "https://jx.playerjy.com/?url="},
            {"name": "虾米", "type": "1,2", "url": "https://jx.xmflv.com/?url="},
            {"name": "NNXV", "type": "1,3", "url": "https://jx.nnxv.cn/tv.php?url="},
            {"name": "夜幕", "type": "1,3", "url": "https://www.yemu.xyz/?url="},
            {"name": "aidouer", "type": "1,3", "url": "https://jx.aidouer.net/?url="},
            {"name": "OK", "type": "1,3", "url": "https://okjx.cc/?url="},
            //{"name": "诺讯", "type": "1,3", "url": "https://jiexi.nxflv.com/?uid=6445337&key=abehlmnopBIJLOPS79&url="},
            {"name": "OK2", "type": "1,3", "url": "https://api.okjx.cc:3389/jx.php?url="},
            {"name": "BL", "type": "1,3", "url": "https://vip.bljiex.cc/?v="},
            {"name": "铭人云", "type": "1,3", "url": "https://parse.123mingren.com/?url="},
            {"name": "MAO", "type": "1,3", "url": "https://www.mtosz.com/m3u8.php?url="},
            {"name": "江湖云", "type": "1,3", "url": "https://api.jhdyw.vip/?url="},
            {"name": "4kdv", "type": "1,3", "url": "https://jx.4kdv.com/?url="},
            {"name": "M3U8", "type": "1,3", "url": "https://jiexi.janan.net/jiexi/?url="},

            {"name": "OK解析", "type": "1,3", "url": "https://okjx.cc/?url="},
            {"name": "1717", "type": "1,3", "url": "https://ckmov.ccyjjd.com/ckmov/?url="},
            {"name": "8090", "type": "1,3", "url": "https://www.8090g.cn/?url="},
            {"name": "奇米", "type": "1,3", "url": "https://qimihe.com/?url="},
            {"name": "虾米", "type": "1,3", "url": "https://jx.xmflv.com/?url="},
            {"name": "七哥", "type": "1,3", "url": "https://jx.mmkv.cn/tv.php?url="},
            {"name": "qianqi", "type": "1,3", "url": "https://api.qianqi.net/vip/?url="},
            {"name": "laobandq", "type": "1,3", "url": "https://vip.laobandq.com/jiexi.php?url="},
            {"name": "小蒋", "type": "1,3", "url": "https://www.kpezp.cn/jlexi.php?url="},
            {"name": "playm3u8", "type": "1,3", "url": "https://www.playm3u8.cn/jiexi.php?url="},
            {"name": "听乐", "type": "1,3", "url": "https://jx.dj6u.com/?url="},
            {"name": "17kyun", "type": "1,3", "url": "https://17kyun.com/api.php?url="},
            {"name": "爱解析", "type": "1,3", "url": "https://jiexi.t7g.cn/?url="},
            {"name": "无名小站", "type": "1,3", "url": "https://www.administratorw.com/video.php?url="},
            {"name": "CK", "type": "1,3", "url": "https://www.ckplayer.vip/jiexi/?url="},
            {"name": "盖世", "type": "1,3", "url": "https://www.gai4.com/?url="},
            {"name": "yh0523", "type": "1,3", "url": "https://go.yh0523.cn/y.cy?url="},
            {"name": "Blbo", "type": "1,3", "url": "https://jx.blbo.cc:4433/?url="},

            {"name": "xixicai", "type": "3", "url": "https://www.xixicai.top/mov/s/?sv=3&url="}
        ],
        playerContainers: [
            {host: "v.qq.com", container: "#mod_player", name: "QQ"},
            {host: "m.v.qq.com", container: ".mod_player", name: "Default"},
            {host: "w.mgtv.com", container: "#mgtv-player-wrap", name: "Default"},
            {host: "www.mgtv.com", container: "#mgtv-player-wrap", name: "Default"},
            {host: "m.mgtv.com", container: ".video-area", name: "Default"},
            {host: "www.bilibili.com", container: "#player_module", name: "Default"},
            {host: "www.iqiyi.com", container: "#flashbox", name: "IQY"},
            {host: "m.iqiyi.com", container: ".m-vipPlayer-tip", name: "Default"},
            {host: "v.youku.com", container: "#player", name: "Default"},
            {host: "tv.sohu.com", container: "#player", name: "Default"},
            {host: "film.sohu.com", container: "#playerWrap", name: "Default"},
            {host: "www.le.com", container: "#le_playbox", name: "Default"},
            {host: "video.tudou.com", container: ".td-playbox", name: "Default"},
            {host: "v.pptv.com", container: "#pptv_playpage_box", name: "Default"},
            {host: "vip.pptv.com", container: ".w-video", name: "Default"},
            {host: "www.wasu.cn", container: "#flashContent", name: "Default"},
            {host: "www.acfun.cn", container: "#player", name: "Default"}
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
            return new Promise((resolve, reject) => resolve(container));
        }

        generateElement(container) {
            GM_addStyle(`
                        #${_CONFIG_.vipBoxId} {cursor:pointer; position:fixed; top:120px; left:0px; z-index:9999999; text-align:left;}
                        #${_CONFIG_.vipBoxId} .img_box{width:32px; height:32px;line-height:32px;text-align:center;background-color:#1c84c6;margin:5px 0px;}
                        #${_CONFIG_.vipBoxId} .vip_list {display:none; position:absolute; border-radius:5px; left:32px; top:0; text-align:center; background-color: #3f4149; border:1px solid white;padding:10px 0px; width:380px; max-height:400px; overflow-y:auto;}
                        #${_CONFIG_.vipBoxId} .vip_list li{border-radius:2px; font-size:12px; color:#DCDCDC; text-align:center; width:calc(25% - 14px); line-height:21px; float:left; border:1px solid gray; padding:0 4px; margin:4px 2px;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;-o-text-overflow:ellipsis;}
                        #${_CONFIG_.vipBoxId} .vip_list li:hover{color:#1c84c6; border:1px solid #1c84c6;}
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

            let autoPlay = !!GM_getValue(_CONFIG_.autoPlayerKey, null) ? "开" : "关";

            $(container).append(`
                <div id="${_CONFIG_.vipBoxId}">
                    <div class="vip_icon">
                        <div class="img_box" title="选择解析源" style="color:white;font-size:16px;font-weight:bold;border-radius:5px;"><span style="color: red;">V</span>I<span style="color: yellow;">P</span></div>
                        <div class="vip_list">
                            <div>
                                <h3 style="color:#1c84c6; font-weight: bold; font-size: 16px; padding:5px 0px;">[内嵌播放]</h3>
                                <ul>
                                    ${type_1_str}
                                    <div style="clear:both;"></div>
                                </ul>
                            </div>
                            <div>
                                <h3 style="color:#1c84c6; font-weight: bold; font-size: 16px; padding:5px 0px;">[弹窗播放带选集]</h3>
                                <ul>
                                    ${type_2_str}
                                    <div style="clear:both;"></div>
                                </ul>
                            </div>
                            <div>
                                <h3 style="color:#1c84c6; font-weight: bold; font-size: 16px; padding:5px 0px;">[弹窗播放不带选集]</h3>
                                <ul>
                                    ${type_3_str}
                                    <div style="clear:both;"></div>
                                </ul>
                            </div>
                            <div style="text-align:left;color:#FFF;font-size:10px;padding:0px 10px;margin-top:10px;">
                                <b>自动解析功能说明：</b>
                                <br>&nbsp;&nbsp;1、自动解析功能默认关闭（自动解析只支持内嵌播放源）
                                <br>&nbsp;&nbsp;2、开启自动解析，网页打开后脚本将根据当前选中的解析源自动解析视频。如解析失败，请手动选择不同的解析源尝试
                                <br>&nbsp;&nbsp;3、没有选中解析源将随机选取一个
                                <br>&nbsp;&nbsp;4、如某些网站有会员可以关闭自动解析功能
                            </div>
                        </div>
                    </div>
                    <div class="img_box" id="vip_auto" style="color:white;font-size:16px;font-weight:bold;border-radius:5px;" title="是否打开自动解析。若自动解析失败，请手动选择其它接口尝试！！">${autoPlay}</div>
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
                    setTimeout(function () {
                        window.location.reload();
                    }, 500);
                }
            });

            if (!!GM_getValue(_CONFIG_.autoPlayerKey, null)) {
                let index = GM_getValue(_CONFIG_.autoPlayerVal, 2);
                let autoObj = _CONFIG_.videoParseList[index];
                if (autoObj.type.includes("1")) {
                    let _th = this;
                    setTimeout(function () {
                        _th.showPlayerWindow(autoObj);
                        vipBox.find(`.vip_list [title="${autoObj.name}1"]`).addClass("selected");
                        $(container).find("#vip_auto").attr("title", `自动解析源：${autoObj.name}`);
                    }, 1000);
                }
            }
            return new Promise((resolve, reject) => resolve(container));
        }

        showPlayerWindow(videoObj) {
            let playerNode = _CONFIG_.playerContainers.filter(value => value.host === window.location.host);
            if (playerNode === null || playerNode.length <= 0) {
                return;
            }
            util.findTargetEle(playerNode[0].container)
                .then((container) => {
                    const type = videoObj.type;
                    let url = videoObj.url + window.location.href;
                    if (type.includes("1")) {
                        $(container).empty();
                        $(container).append(`<div style="width:100%;height:100%;z-index:999999;"><iframe id="iframe-player-4a5b6c" src="${url}" frameborder="0" allowfullscreen="true" width="100%" height="100%"></iframe></div>`);
                    }
                });
        }

        postHandle(container) {
            util.urlChangeReload();
        }

    }

    class DefaultConsumer extends BaseConsumer {
    }

    class QQConsumer extends BaseConsumer {

        showPlayerWindow(videoObj) {
            super.showPlayerWindow(videoObj);
            util.findTargetEle('#tenvideo_player')
                .then((obj) => $(obj).remove())
                .catch(e => console.warn("不存在元素", e));
        }

        preHandle(container) {
            util.findTargetEle('#mask_layer')
                .then((obj) => obj.style.display = 'none')
                .catch(e => console.warn("不存在元素", e));
            util.findTargetEle('.mod_vip_popup')
                .then((obj) => obj.style.display = 'none')
                .catch(e => console.warn("不存在元素", e));
            return new Promise((resolve, reject) => resolve(container));
        }

    }

    class IQYConsumer extends BaseConsumer {

        showPlayerWindow(videoObj) {
            super.showPlayerWindow(videoObj);
            util.findTargetEle('.iqp-player')
                .then((obj) => $(obj).remove())
                .catch(e => console.warn("不存在元素", e));
        }

        postHandle(container) {
            $(container).on("mouseover", ".select-item a", function (e) {
                let $playerItem = $(this), href = $playerItem.attr("href") || $playerItem.data("href");
                $playerItem.off("click.chrome");
                $playerItem.on("click.chrome", function () {
                    window.location.href = href
                }).attr("data-href", href).css({
                    cursor: 'pointer'
                }).removeAttr("href");
            });

            util.findTargetEle('#playerPopup')
                .then((obj) => obj.style.display = 'none')
                .catch(e => console.warn("不存在元素", e));

            super.postHandle(container);
        }

    }

    return {
        start: () => {
            let mallCase = 'Default';
            let playerNode = _CONFIG_.playerContainers.filter(value => value.host === window.location.host);
            if (playerNode === null || playerNode.length <= 0) {
                console.warn(window.location.host + "该网站暂不支持，请联系作者，作者将会第一时间处理（注意：请记得提供有问题的网址）");
                return;
            }
            mallCase = playerNode[0].name;
            const targetConsumer = eval(`new ${mallCase}Consumer`);
            targetConsumer.parse();
        }
    }

})();

(function () {
    superVip.start();
})();