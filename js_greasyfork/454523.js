// ==UserScript==
// @name         一个小工具
// @namespace    http://tampermonkey.net/
// @version      1.2.10
// @description  Tapd视图增加跳转禅道的按钮链接，减少重复输入；禅道附件增加预览按钮，实现附件在线预览
// @author       Jianglin
// @match        https://www.tapd.cn/tapd_fe/worktable/search*
// @match        http://pm.gtmap.cn/zentao/*view*
// @require      https://lib.baomitu.com/jquery/2.0.0/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tapd.cn
// @grant        none
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/454523/%E4%B8%80%E4%B8%AA%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/454523/%E4%B8%80%E4%B8%AA%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var configurl = window.location.href;
    var configmain = document.domain;
    var bugUrl = 'http://pm.gtmap.cn/zentao/bug-view-num.html';
    var storyUrl = 'http://pm.gtmap.cn/zentao/story-view-num.html';
    let myinter //声明一个变量的去装setInterval()
    let newSearch = true;

    //释放 $ 的控制权，禅道扩展了$的方法
    var JQ = jQuery.noConflict();


    // ============   TAPD  Start   =======
    if (configmain.indexOf("tapd.cn") > -1) {
        var oldXHR = window.XMLHttpRequest;
        window.XMLHttpRequest = newXHR;//重定义默认的XMLHttpRequest方法，增加了监听
        window.addEventListener('ajaxLoad', function (e) {
            if (e.detail.responseURL.indexOf("search_filter/search") != -1) {
                if (newSearch && !myinter) {
                    myinter = setInterval(function () {
                        init()
                    }, 100);
                    newSearch = false;
                }
            }
        });
    }

    function init() {
        //查询列，找到name 和status
        var nameIndex = '', statusIndex = '', groupIndex = '';
        JQ('.tapd-table__head th').each(function (index) {
            if (JQ(this).attr('field') == 'name') {
                nameIndex = index;
            }
            if (JQ(this).attr('field') == 'status') {
                statusIndex = index;
            }
            if (JQ(this).attr('field') == 'custom_field_多组协作') {
                groupIndex = index;
            }
        });
        if (nameIndex) {
            clearInterval(myinter);//停止定时器
            myinter = null
            newSearch = true;
        } else {
            return false;
        }

        //渲染按钮
        JQ('.tapd-table-content tr').each(function () {
            var targetUrl = '';
            var type = JQ(this).find('td').eq(nameIndex).find('.workitem-icon').text().trim();
            var title = JQ(this).find('td').eq(nameIndex).text();
            if (!title.match(/[0-9]+/ig)) {
                return true;
            }

            var num = title.match(/[0-9]+/ig)[0]; //取正则匹配的第一个
            switch (type) {
                case 'BUG':
                    targetUrl = bugUrl.replace('num', num);
                    break;
                case 'STORY':
                    targetUrl = storyUrl.replace('num', num);
                    break;
            }

            if (JQ(this).find('div .chandaohref')) {
                JQ(this).find('div .chandaohref').remove();
            }
            if (statusIndex) {
                var cornDiv = JQ(this).find('td').eq(statusIndex).find('.row-cell');
                cornDiv.append('<button onclick="window.open(\'' + targetUrl + '\',\'_blank\')" class="el-button  capsule chandaohref " style="/*position: absolute;left: 50%;margin-top: 6px;*/" title="点击跳转禅道任务页面"><span>禅道</span></button>');

            }
            if (groupIndex) {
                var JQxiezuoSpan = JQ(this).find('td').eq(groupIndex).find('span:eq(0)');
                JQxiezuoSpan.removeAttr("style");
                if (JQxiezuoSpan.text().trim() == "是") {
                    JQxiezuoSpan.css({
                        "color": "red",
                        "font-weight": "bold"
                    });
                }
            }

        });
    }


    //   ============  禅道  Start   =======
    if (configmain.indexOf("pm.gtmap.cn") > -1) {
        JQ(function () {
            var downHost = "http://pm.gtmap.cn";
            var viewHost1 = "https://vw.usdoc.cn/?src=";
            var viewHost2 = "https://ow365.cn/?i=30313&furl=";
            var viewHost3 = "https://view.officeapps.live.com/op/view.aspx?src=";
            var viewHost4 = "http://127.0.0.1:8012/onlinePreview?url=";
            JQ('span.right-icon').each(function () {
                var downUrl = JQ(this).prev().attr("href");
                var filename = JQ(this).prev().text();
                filename = filename.trim().split(" (")[0].replace('"', '');
                filename = filename.replace('\'', '');
                filename = filename.replace('“', '');
                filename = filename.replace('”', '');
                filename = filename.replace('&', '');

                //文件名中不含有文件类型后缀
                if (filename.indexOf(".") == -1) {
                    var fileType = JQ(this).prev().attr('onclick').split("'")[1];
                    filename = filename + '.' + fileType;
                }

                var viewUrl = viewHost1 + downHost + downUrl;
                var viewUr2 = viewHost2 + downHost + downUrl;
                var viewUr3 = viewHost3 + encodeURIComponent(downHost + downUrl);
                var viewUr4 = viewHost4 + encodeURIComponent(b64EncodeUnicode(downHost + downUrl + "&fullfilename=" + filename));

                //JQ(this).append('<a href="'+ viewUrl +'"  target="_blank" class="text-primary" title="预览"> 查看1 </a>');
                //JQ(this).append('<a href="'+ viewUr2 +'"  target="_blank" class="text-primary" title="预览"> 查看 </a>');
                JQ(this).append('<a href="' + viewUr4 + '"  target="_blank" class="text-primary" title="预览">本地预览</a>');
            });
        });
    }


    //  ==================      工具类、方法等           ====================
    function ajaxEventTrigger(name) {
        var ajaxEvent = new CustomEvent(name, {detail: this});//创建一个事件
        window.dispatchEvent(ajaxEvent);//触发/派发这个事件
    }

    function newXHR() {
        var realXHR = new oldXHR();
        realXHR.addEventListener('abort', function () {
            ajaxEventTrigger.call(this, 'ajaxAbort');
        }, false);//中止请求时触发
        realXHR.addEventListener('error', function () {
            ajaxEventTrigger.call(this, 'ajaxError');
        }, false);//请求错误时触发
        realXHR.addEventListener('load', function () {
            ajaxEventTrigger.call(this, 'ajaxLoad');
        }, false);//请求成功时触发
        realXHR.addEventListener('loadstart', function () {
            ajaxEventTrigger.call(this, 'ajaxLoadStart');
        }, false);//客户端开始发出请求
        realXHR.addEventListener('progress', function () {
            ajaxEventTrigger.call(this, 'ajaxProgress');
        }, false);//服务器已经响应，处理请求中触发
        realXHR.addEventListener('timeout', function () {
            ajaxEventTrigger.call(this, 'ajaxTimeout');
        }, false);//超时触发
        realXHR.addEventListener('loadend', function () {
            ajaxEventTrigger.call(this, 'ajaxLoadEnd');
        }, false);//请求不管成功失败中止都将最后触发
        realXHR.addEventListener('readystatechange', function () {
            ajaxEventTrigger.call(this, 'ajaxReadyStateChange');
        }, false);//readyState 改变时触发
        return realXHR;
    }

    function bs64DeCode(str) {
        _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        function _utf8_decode(e) {
            var t = "";
            var n = 0;
            var r = c1 = c2 = 0;
            while (n < e.length) {
                r = e.charCodeAt(n);
                if (r < 128) {
                    t += String.fromCharCode(r);
                    n++
                } else if (r > 191 && r < 224) {
                    c2 = e.charCodeAt(n + 1);
                    t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                    n += 2
                } else {
                    c2 = e.charCodeAt(n + 1);
                    c3 = e.charCodeAt(n + 2);
                    t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                    n += 3
                }
            }
            return t
        }

        function decode(input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            while (i < input.length) {
                enc1 = _keyStr.indexOf(input.charAt(i++));
                enc2 = _keyStr.indexOf(input.charAt(i++));
                enc3 = _keyStr.indexOf(input.charAt(i++));
                enc4 = _keyStr.indexOf(input.charAt(i++));
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
                output = output + String.fromCharCode(chr1);
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
            }
            output = _utf8_decode(output);
            return output;
        }

        return decode(str);
    }

    // 字符串转base64
    function b64EncodeUnicode(str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
            return String.fromCharCode('0x' + p1);
        }));
    }

})();