// ==UserScript==
// @name           油猴助手
// @description    帮助坚持访问的网站是否有油猴插件
// @author         018(lyb018@gmail.com)
// @contributor    Rhilip
// @connect        *
// @grant          GM_xmlhttpRequest
// @grant          GM_setClipboard
// @grant          GM_addStyle
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_listValues
// @grant          GM_deleteValue
// @grant          GM_registerMenuCommand
// @require        https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @include        *
// @version        0.1.2
// @icon           https://greasyfork.org/packs/media/images/blacklogo16-5421a97c75656cecbe2befcec0778a96.png
// @run-at         document-end
// @namespace      http://018.ai
// @downloadURL https://update.greasyfork.org/scripts/420045/%E6%B2%B9%E7%8C%B4%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/420045/%E6%B2%B9%E7%8C%B4%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

// This Userscirpt can't run under Greasemonkey 4.x platform
if (typeof GM_xmlhttpRequest === 'undefined') {
    alert('不支持Greasemonkey 4.x，请换用暴力猴或Tampermonkey')
    return
}

;(function () {
    'use strict';

    $(document).ready(function () {
        sniffer(location.host)
    })

    function sniffer(host) {
        var url = 'https://greasyfork.org/zh-CN/scripts/by-site/' + host + '?filter_locale=0'
        loadDoc(url, {url: url}, function(doc, responseDetail, meta) {
            var list = doc.querySelector('#browse-script-list');
            if (list) {
                $('body').after('<style type="text/css" nonce="A3C4C117-4422-47B2-A80D-795EAAB84A46">/*! normalize.css v3.0.1 | MIT License | git.io/normalize */\
                .greasyfork-alert {\
                  cursor: pointer;\
                  left: 0;\
                  top: 0;\
                  position: fixed !important;\
                  z-index: 2147483647 !important;\
                  width: 40px !important;\
                  height: 40px !important;\
                  zoom: 1 !important;\
                  display: inline-block !important;\
                  margin: 0 !important;\
                  border: 0 !important;\
                  padding: 0 !important;\
                  will-change: transform;\
                  opacity: 1;\
                  touch-action: none;\
                  -ms-touch-action: none;\
                  min-height: auto !important;\
                  max-height: auto !important;\
                  min-width: auto !important;\
                  max-width: auto !important;\
                  background-size: 28px!important;\
                  background-position: center center!important;\
                  background-repeat: no-repeat !important;\
                  background-color: #fff !important;\
                  border: none !important;\
                  box-shadow: 0 0 10px 3px rgba(162, 161, 161, 0.3) !important;\
                  border-radius: 100% !important;\
                  transition: background-color 0.3s ease;\
                }\
                .greasyfork-alert.sg_hide_element {\
                  display: none!important;\
                }\
                .greasyfork-alert.logo-small {\
                  width: 24px !important;\
                  height: 24px !important;\
                  background-position: 50% 6px!important;\
                  background-size: 14px!important;\
                }\
                .greasyfork-alert:hover {\
                  background-color: #ccf0d4 !important;\
                }\
                @media print {\
                  .greasyfork-alert {\
                    display: none!important;\
                  }\
                }\
                .greasyfork-assistant-button-main-logo {\
                  background-image: url(https://greasyfork.org/vite/assets/blacklogo96-e0c2c761.png) !important;\
                }\
                .greasyfork-assistant-button-bottom {\
                  top: auto;\
                  bottom: 0;\
                }\
                .greasyfork-assistant-button-bottom.greasyfork-assistant-button-left {\
                  left: 0;\
                  right: auto;\
                  transform: translate3d(10px, -10px, 0);\
                }\
                .greasyfork-assistant-button-bottom.greasyfork-assistant-button-right {\
                  left: auto;\
                  right: 0;\
                  transform: translate3d(-10px, -10px, 0);\
                }\
                .greasyfork-assistant-button-right {\
                  left: auto;\
                  right: 0;\
                }\
                </style>\
                <a class="greasyfork-alert greasyfork-assistant-button-main-logo greasyfork-assistant-button-bottom greasyfork-assistant-button-right" href="' + meta.url +
                     '" title="找到油猴插件" onclick="this.style.visibility = \'hidden\'" target="_blank"></a>');
            } else if(host.indexOf('.') > -1) {
                sniffer(host.replace(/^[a-zA-z0-9\-_]*\./, ''))
            }
        }, function(responseDetail, meta) {
            console.error(responseDetail)
        });
    }

    // 对使用GM_xmlhttpRequest返回的html文本进行处理并返回DOM树
    function page_parser(responseText) {
        // 替换一些信息防止图片和页面脚本的加载，同时可能加快页面解析速度
        responseText = responseText.replace(/s+src=/ig, ' data-src='); // 图片，部分外源脚本
        responseText = responseText.replace(/<script[^>]*?>[\S\s]*?<\/script>/ig, ''); //页面脚本
        return (new DOMParser()).parseFromString(responseText, 'text/html');
    }

    // 加载网页
    function loadDoc (url, meta, callback, fail) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function (responseDetail) {
                if (responseDetail.status === 200) {
                    let doc = page_parser(responseDetail.responseText)
                    callback(doc, responseDetail, meta)
                } else if (fail){
                    fail(responseDetail, meta);
                }
            },
            onerror: function(err) {
                if (fail) {
                    fail(err, meta);
                }
            }
        })
    }

    // get请求
    function doGet (url, meta, callback, fail) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function (responseDetail) {
                if (responseDetail.status === 200) {
                    callback(JSON.parse(responseDetail.responseText), responseDetail, meta)
                } else if (fail){
                    fail(responseDetail, meta);
                }
            },
            onerror: function(err) {
                if (fail) {
                    fail(err, meta);
                }
            }
        })
    }

    // post请求
    function doPost (url, headers, data, meta, callback, fail) {
        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            data: data,
            headers: headers,
            onload: function(responseDetail){
                if (responseDetail.status === 200) {
                    callback(JSON.parse(responseDetail.responseText), responseDetail, meta)
                } else if (fail){
                    fail(responseDetail, meta);
                }
            },
            onerror: function(err) {
                if (fail) {
                    fail(err, meta);
                }
            }
        })
    }
})()