// ==UserScript==
// @name         HTML5 on CCTV
// @namespace    https://github.com/sffxzzp
// @version      0.19
// @description  Replace Flash Player with HTML5 Player on tv.cctv.com
// @author       sffxzzp
// @include      /^https?://tv.cctv.com/\d*/\d*/\d*/VIDE.*.shtml*/
// @require      https://unpkg.com/dplayer/dist/DPlayer.min.js
// @require      https://unpkg.com/hls.js/dist/hls.js
// @icon         https://tv.cctv.com/favicon.ico
// @connect      vdn.apps.cntv.cn
// @connect      hls.cntv.myhwcdn.cn
// @connect      newcntv.qcloudcdn.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/397901/HTML5%20on%20CCTV.user.js
// @updateURL https://update.greasyfork.org/scripts/397901/HTML5%20on%20CCTV.meta.js
// ==/UserScript==

(function() {
    var util = (function () {
        function util() {}
        util.xhr = function (xhrData) {
            return new Promise(function(resolve, reject) {
                if (!xhrData.xhr) {
                    GM_xmlhttpRequest({
                        method: xhrData.method || "get",
                        url: xhrData.url,
                        data: xhrData.data,
                        headers: xhrData.headers || {},
                        responseType: xhrData.type || "",
                        timeout: 3e4,
                        onload: function onload(res) {
                            return resolve({ response: res, body: res.response });
                        },
                        onerror: reject,
                        ontimeout: reject
                    });
                } else {
                    var xhr = new XMLHttpRequest();
                    xhr.open(xhrData.method || "get", xhrData.url, true);
                    if (xhrData.method === "post") {xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded; charset=utf-8");}
                    if (xhrData.cookie) {xhr.withCredentials = true;}
                    xhr.responseType = xhrData.responseType || "";
                    xhr.timeout = 3e4;
                    if (xhrData.headers) {for (var k in xhrData.headers) {xhr.setRequestHeader(k, xhrData.headers[k]);}}
                    xhr.onload = function(ev) {
                        var evt = ev.target;
                        resolve({ response: evt, body: evt.response });
                    };
                    xhr.onerror = reject;
                    xhr.ontimeout = reject;
                    xhr.send(xhrData.data);
                }
            });
        };
        util.createElement = function (data) {
            var node;
            if (data.node) {
                node = document.createElement(data.node);
                if (data.content) {this.setElement({node: node, content: data.content});}
                if (data.html) {node.innerHTML = data.html;}
            }
            return node;
        };
        util.setElement = function (data) {
            if (data.node) {
                for (let name in data.content) {data.node.setAttribute(name, data.content[name]);}
                if (data.html!=undefined) {data.node.innerHTML = data.html;}
            }
        };
        return util;
    })();
    var h5onCCTV = (function () {
        function h5onCCTV() {};
        h5onCCTV.prototype.addPlayer = function (m3u8) {
            var h5css = util.createElement({node: 'link', content: {rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/dplayer/dist/DPlayer.min.css'}});
            document.head.appendChild(h5css);
            var container = document.querySelector('.video_left');
            GM_addStyle('.gwA151201_ind01, .retrieve, .buttonVal, #page_body > .column_wrapper, .video, .video .right_but, .cnt_share, [class^=jscroll] {z-index: auto !important;} .nav2 > div > div {z-index: 1 !important;}');
            util.setElement({node: container, content: {style: 'height: 100%'}, html: '<div id="dplayer" style="width: 100%; height: 100%;"></div>'});
            var pip = document.pictureInPictureEnabled ? [{text: '画中画模式', click: function () {document.querySelector('.dplayer-video').requestPictureInPicture().catch(console.log);}}] : [];
            var dp = new DPlayer({
                container: container.children[0],
                video: {
                    quality: m3u8,
                    defaultQuality: m3u8.length-1
                },
                preload: 'none',
                contextmenu: pip
            });
            unsafeWindow.dp = dp;
            var curTime = localStorage.getItem(unsafeWindow.guid);
            if (curTime) {
                dp.seek(curTime);
                var showTime = '';
                if (curTime > 3600) {showTime += ' '+parseInt(curTime/3600)+' 时'; curTime = curTime%3600;}
                if (curTime > 60) {showTime += ' '+parseInt(curTime/60)+' 分'; curTime = curTime%60;}
                showTime += ' '+parseInt(curTime)+' 秒';
                dp.notice('已跳转到上次观看进度'+showTime, 2000);
            }
            dp.on('timeupdate', function () {
                if ((dp.video.duration-dp.video.currentTime > 30) && dp.video.currentTime > 30) {
                    localStorage.setItem(unsafeWindow.guid, dp.video.currentTime);
                }
                else {
                    localStorage.removeItem(unsafeWindow.guid);
                }
            });
        }
        h5onCCTV.prototype.run = function () {
            var _this = this;
            util.xhr({
                url: `https://vdn.apps.cntv.cn/api/getHttpVideoInfo.do?pid=${unsafeWindow.guid}`,
                type: 'json'
            }).then(function (res) {
                var url = res.body.hls_url.replace('://', '/').split('/');
                url = `${url[0]}://newcntv.qcloudcdn.com/${url.slice(2).join('/')}`;
                util.xhr({
                    url: url
                }).then(function (res) {
                    var vlist = res.body.split('\n');
                    var m3u8 = [];
                    vlist.forEach(function (v) {
                        if (v.indexOf('/200.m3u8')>-1) {m3u8.push({name: '流畅', url: 'https://newcntv.qcloudcdn.com'+v, type: 'hls'});}
                        else if (v.indexOf('/450.m3u8')>-1) {m3u8.push({name: '低清', url: 'https://newcntv.qcloudcdn.com'+v, type: 'hls'});}
                        else if (v.indexOf('/850.m3u8')>-1) {m3u8.push({name: '标清', url: 'https://newcntv.qcloudcdn.com'+v, type: 'hls'});}
                        else if (v.indexOf('/1200.m3u8')>-1) {m3u8.push({name: '高清', url: 'https://newcntv.qcloudcdn.com'+v, type: 'hls'});}
                        else if (v.indexOf('/2000.m3u8')>-1) {m3u8.push({name: '超清', url: 'https://newcntv.qcloudcdn.com'+v, type: 'hls'});}
                    });
                    _this.addPlayer(m3u8);
                });
            });
        };
        return h5onCCTV;
    })();
    var program = new h5onCCTV();
    program.run();
})();
