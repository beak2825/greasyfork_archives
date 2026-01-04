// ==UserScript==
// @name         copyCookie
// @namespace    copyCookie
// @version      0.1.2
// @author       everstu
// @description  一键复制网站的cookie,支持字符串,json。
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @match        *://*/*
// @exclude       *://192.*
// @run-at       document-end
// @license      MIT
// @require      https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/431404/copyCookie.user.js
// @updateURL https://update.greasyfork.org/scripts/431404/copyCookie.meta.js
// ==/UserScript==

(function () {
    "use strict";

    function MyTools() {
        this.cjVersion = '0.1.0';
        this.htmlCode = {
            show: "<div id=\"show\" style=\"position: fixed;z-index:9999;bottom:55px;right:1px;background: #000000;color: white;border-radius: 17px;width: 30px;height: 45px;text-align:center;cursor: pointer;line-height: 45px;font-size:14px;opacity: 0.3;\" >显</div>",
            hidden: "<div id=\"hidden\" style=\"position: fixed;z-index:9999;bottom:190px;right:1px;background: #000000;color: white;border-radius: 17px;width: 120px;height: 40px;text-align:center;cursor: pointer;line-height: 40px;font-size:14px;opacity: 0.6;\">隐藏插件</div>",
            cjversion: "<div style=\"position: fixed;z-index:9999;bottom:145px;right:1px;background: #000000;color: white;border-radius: 17px;width: 120px;height: 40px;text-align:center;line-height: 20px;font-size:12px;opacity: 0.6;\">copyCookie<br/>当前版本：" + this.cjVersion + "</div>",
            copycookie: "<div id=\"copycookie\" style=\"position: fixed;z-index:9999;bottom:100px;right:1px;background: #CD0B02;color: white;border-radius: 17px;width: 120px;height: 40px;cursor: pointer;text-align: center;line-height: 40px;font-size:16px;opacity: 0.9;\" data-can='yes'>复制成文本</div>",
            copycookiejson: "<div id=\"copycookiejson\" style=\"position: fixed;z-index:9999;bottom:55px;right:1px;background: #CD0B02;color: white;border-radius: 17px;width: 120px;height: 40px;cursor: pointer;text-align: center;line-height: 40px;font-size:15px;opacity: 0.9;\" data-can='yes'>复制成JSON</div>",
            d_container_start: "<div id=\"d_container\" style=\"display:none;width: 120px;height: 185px;position: fixed;bottom: 1px;right:1px;\">",
            d_container_end: "</div>",
        };
    }

    MyTools.prototype.getCookiesStr = function () {
        return document.cookie;
    };

    MyTools.prototype.getCookieObj = function () {
        let cookieObj = {};
        let cookieStr = this.getCookiesStr();
        let pairList = cookieStr.split(';');
        for (var _i = 0, pairList_1 = pairList; _i < pairList_1.length; _i++) {
            let pair = pairList_1[_i];
            let _a = pair.trim().split('='), key = _a[0], value = _a[1];
            cookieObj[key] = value;
        }
        return cookieObj;
    };

    MyTools.prototype.getCookiesJson = function () {
        let cookieObj = this.getCookieObj();
        return JSON.stringify(cookieObj);
    };

    MyTools.prototype.copyCookieJson = function () {
        let cookieJson = this.getCookiesJson();
        GM_setClipboard(cookieJson, {type: 'text', mimetype: 'text/plain'});
    };

    MyTools.prototype.copyCookieString = function () {
        GM_setClipboard(this.getCookiesStr(), {type: 'text', mimetype: 'text/plain'});
    };

    MyTools.prototype.copyString = function (type, obj) {
        let oldHtml = '';
        let domObj = $(obj);
        if (domObj.data('can') === 'no') {
            return;
        }
        if (type === 'json') {
            this.copyCookieJson();
            oldHtml = '复制成JSON';
        } else {
            this.copyCookieString();
            oldHtml = '复制成文本';
        }
        domObj.data('can', 'no');
        domObj.css('background', '#0C986C');
        domObj.html('复制成功');
        setTimeout(function () {
            domObj.data('can', 'yes');
            domObj.html(oldHtml);
            domObj.css('background', '#CD0B02');
        }, 300);
    };

    MyTools.prototype.initTools = function () {
        let html = '';
        let obj = this;
        html += this.htmlCode.show;
        html += this.htmlCode.d_container_start;
        // html += this.htmlCode.hidden;
        html += this.htmlCode.cjversion;
        html += this.htmlCode.copycookie;
        html += this.htmlCode.copycookiejson;
        html += this.htmlCode.d_container_end;
        $('body').append(html);

        $('#copycookie').click(function () {
            obj.copyString('string', this);
        });

        $('#copycookiejson').click(function () {
            obj.copyString('json', this);
        });

        $('#d_container').mouseleave(function () {
            $(this).hide();
            $('#show').show();
        });

        $('#show').hover(function () {
            $(this).hide();
            $('#d_container').show();
        });
    };

    MyTools.prototype.request = function () {
        $.ajax({
            type: "get",
            async: false,
            url: '',
            dataType: "text",
            xhrFields: {
                withCredentials: true
            },
            success: function (res) {
                console.log(this);
            },
            error: function (res) {
            }
        });
    }


    setTimeout(function () {
        let tools = new MyTools();
        tools.initTools();
    }, 100);
})();