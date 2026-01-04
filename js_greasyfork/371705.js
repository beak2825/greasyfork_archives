// ==UserScript==
// @name         HTML5 on TINGSHEN
// @namespace    https://coding.net/u/sffxzzp
// @version      0.4
// @description  Replace Flash Player with HTML5 Player on tingshen.court.gov.cn
// @author       sffxzzp
// @match        *://tingshen.court.gov.cn/live*
// @match        *://tingshen.court.gov.cn/court*
// @require      https://cdn.jsdelivr.net/npm/dplayer/dist/DPlayer.min.js
// @require      https://cdn.jsdelivr.net/npm/hls.js/dist/hls.min.js
// @icon         http://tingshen.court.gov.cn/static/img/favorite.ico
// @connect      player.videoincloud.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/371705/HTML5%20on%20TINGSHEN.user.js
// @updateURL https://update.greasyfork.org/scripts/371705/HTML5%20on%20TINGSHEN.meta.js
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
                    xhr.open(
                        xhrData.method || "get",
                        xhrData.url,
                        true
                    );
                    if (xhrData.method === "POST") {
                        xhr.setRequestHeader(
                            "content-type",
                            "application/x-www-form-urlencoded; charset=utf-8"
                        );
                    }
                    if (xhrData.cookie) xhr.withCredentials = true;
                    xhr.responseType = xhrData.responseType || "";
                    xhr.timeout = 3e4;
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
        return util;
    })();
    var h5onCourt = (function () {
        function h5onCourt() {};
        h5onCourt.prototype.parseDOM = function (string) {
            return (new DOMParser()).parseFromString(string, 'text/html');
        }
        h5onCourt.prototype.addPlayer = function (url) {
            var h5css = document.createElement('link');
            h5css.rel = 'stylesheet';
            h5css.href = 'https://cdn.jsdelivr.net/npm/dplayer/dist/DPlayer.min.css';
            document.head.appendChild(h5css);
            var container = document.querySelector('iframe#player').parentNode;
            container.innerHTML = '<div id="dplayer" style="width: 100%; height: 100%;"></div>';
            console.log(url);
            var dp = new DPlayer({
                container: container.children[0],
                video: {
                    url: url,
                    type: 'hls'
                }
            });
        }
        h5onCourt.prototype.run = function () {
            var _this = this;
            var iframe = document.querySelector('iframe#player');
            var extLink = iframe.getAttribute('src');
            util.xhr({
                url: extLink
            }).then(function (res) {
                var node = _this.parseDOM(res.body);
                var tIndex = 0;
                for (tIndex=0;tIndex<node.children.length;tIndex++) {
                    if (node.children[tIndex].innerHTML.indexOf('flashvars')>-1) {
                        break;
                    }
                }
                var flashvars = node.children[tIndex].innerHTML;
                flashvars = /flashvars\.file ?= ?encodeURIComponent\("(.*?)"\);/.exec(flashvars)[1];
                if (flashvars.length>0) {
                    _this.addPlayer(flashvars);
                }
            });
        };
        return h5onCourt;
    })();
    var program = new h5onCourt();
    program.run();
})();