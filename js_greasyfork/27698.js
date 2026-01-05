// ==UserScript==
// @name         仓库 HTTPS 图片
// @namespace    moe.jixun.galacg-https-image
// @version      0.1.3
// @description  把部分白名单域名内的图片更换为 https。
// @author       Jixun <https://jixun.moe/>
// @include      https://galacg.me/*
// @include      https://cangku.in/*
// @include      https://cangku.moe/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/27698/%E4%BB%93%E5%BA%93%20HTTPS%20%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/27698/%E4%BB%93%E5%BA%93%20HTTPS%20%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function(_xhr_send) {
    function filter (src) {
        return src.replace(/(http)(:(\/\/|\\\/\\\/)(ww\d\.sinaimg\.cn|imgsrc\.baidu\.com|(?:\w+\.)?galacg\.me|\w+\.loli\.io|[\w\.]+.127.net|(?:\w+\.)?cangku\.(in|moe))[\\\/])/g, '$1s$2');
    }

    XMLHttpRequest.prototype.send = function () {
        var _onload = this.onload;
        var self = this;
        var ret = _xhr_send.apply(this, arguments);
        this.onload = function () {
            let resp = self.response;
            let respText = self.responseText;

            Object.defineProperty(self, 'response', { value: filter(resp) });
            Object.defineProperty(self, 'responseText', { value: filter(respText) });

            if (_onload)
                return _onload.apply(this, arguments);

            var event = new Event('xhrRequestEvent');
            window.dispatchEvent(event);
        };
        return ret;
    };
})(XMLHttpRequest.prototype.send);