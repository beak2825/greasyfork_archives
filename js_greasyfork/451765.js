// ==UserScript==
// @name                划线获取答案
// @description         划线获取答案小工具
// @author              find_diff
// @include             *
// @version             1.1
// @grant 		        GM.xmlHttpRequest
// @grant 		        GM_addStyle
// @grant               GM_getValue
// @grant               GM_setValue
// @require             https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @run-at              document-start
// @match             *://*/*
// @namespace https://greasyfork.org/users/173111
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451765/%E5%88%92%E7%BA%BF%E8%8E%B7%E5%8F%96%E7%AD%94%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/451765/%E5%88%92%E7%BA%BF%E8%8E%B7%E5%8F%96%E7%AD%94%E6%A1%88.meta.js
// ==/UserScript==

(function() {

    'use strict';
    var gv = {};

    function init() {
        console.log("start init()");

        function mouseStart(e) {
            if ($('#catTranslateBox').length == 0) {
                createBox();
                // $('#catTranslateBox li').on('click', setLanguage);
            }
            if ($('#catTranslateBox').css('display') == 'block' && !checkClick(e)) {
                clearTranslate()
            }
            // if (e.target.className == 'catPlaySound') {
            //     $('.catPlaySound').addClass('catPlaySoundClick');
            //     getRequest(gv.soundUrl);
            // } else if (e.target.className == 'catSet') {
            //     $('.catdropdown').css('display', 'block');
            // }
        }

        function mouseEnd(e) {
            console.log("mouseEnd");

            if (window.getSelection().toString()) {
                e.preventDefault()
                e.stopPropagation();
                showBox(e.clientX, e.clientY+20);
                gv.selectText = window.getSelection().toString();
                gv.encodeText = encodeURIComponent(gv.selectText.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2'));
                getAnswer(gv.encodeText);
            }
            if ($('.catPlaySoundClick').length > 0) {
                $('.catPlaySound').removeClass('catPlaySoundClick');
            }
        }

		window.document.body.addEventListener('mousedown', mouseStart, true);
        window.document.body.addEventListener('mouseup', mouseEnd, true);
    }

    function createBox() {
        var styles = [
            '#catTranslateBox * {margin:0;padding:0;box-sizing:border-box;}',
            '#catTranslateBox {min-height:24px;min-width:100px;max-width:360px;font:normal 12px/24px Helvetica, Tahoma, Arial, sans-serif;text-align: left;position: absolute;z-index: 2147483647;top: 22px;left: -35px;background: #fff;border: 1px solid #dcdcdc;-webkit-transition: opacity .218s;transition: opacity .218s;box-shadow: 0 1px 4px rgba(0,0,0,.2);padding: 5px 0;display: none;font-size: 12px;line-height: 20px;border-radius:3px;}',
            '#catTranslateBox .catContentBox {margin:0 8px;color:#333;}',
            '#catTranslateBox .catContentBox .catTextBox{line-height:16px;border-bottom: 1px solid #ccc;padding: 2px 18px 9px 0;height: 25px;}',
            '#catTranslateBox .catContentBox .catTextBox div{vertical-align: middle;margin-right: 4px;color:#333;font-weight: normal;font-size:12px;}',
            '#catTranslateBox .catContentBox .catTextBox .catText{display: inline-block;font-size:14px;font-weight: bold;color:#333;}',
            '#catTranslateBox .catContentBox .catTextBox .catPlaySound {margin-left: 1px;cursor:pointer;display: inline-block;vertical-align: middle;width: 14px;height: 11px;overflow: hidden;background: url("data:image/gif;base64,R0lGODlhDgAZAIAAABy3/f///yH5BAAAAAAALAAAAAAOABkAAAI1jA+nC7ncXmg0RlTvndnt7jlcxkmjqWzotLbui4qxqBpUmoDl2Nk5GOKRSsCfDyer7ZYMSQEAOw==") no-repeat;text-decoration: none;}',
            '#catTranslateBox .catContentBox .catTextBox .catPlaySound.catPlaySoundClick {background-position:0 -14px;}',
            '#catTranslateBox .catContentBox .catExplain{padding: 2px 0 0 0;font-weight: normal;font-size:12px;}',
            '#catTranslateBox .catTipArrow {width: 0;height: 0;font-size: 0;line-height: 0;display: block;position: absolute;top: -16px;left: 10px;}',
            '#catTranslateBox .catTipArrow em, #catTranslateBox .catTipArrow ins {width: 0;height: 0;font-size: 0;line-height: 0;display: block;position: absolute;border: 8px solid transparent;border-style: dashed dashed solid;}',
            '#catTranslateBox .catTipArrow em {border-bottom-color: #d8d8d8;font-style: normal;color: #c00;}',
            '#catTranslateBox .catTipArrow ins {border-bottom-color: #fff;top: 2px;text-decoration: underline;background:none !important}',
            '#catTranslateBox .catSet {position:absolute;top:9px;right:10px;cursor: pointer;width: 14px;height: 14px;background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAdVBMVEUAAAAwi/+Zxv9urv9oq/9pq/9Elv81jf89kv8wiv8+kv8wiv8xi/8wi/9/t/9+t/9co/9Zof9Hl/9Gl/9ClP9Bk/85j//k8f/Z6v+Fu//x+P/e7f/b6//G3/+/2/+w0/+q0P+52P+42P+Lvv+IvP9wr/9vr/864/KKAAAAF3RSTlMAR/7s7OK7l5VuTyMTC/z7y8ihnYSAQ/Vmp/0AAAB9SURBVAjXVY9HDsQwDAPpVKf32E7v/3/iGtJhk7kNIIgkLH0QA3EgQHTX7AnhzWdLKo9hMWYZdkmaFFpZdJ6QRo7afH9TTmSlqcy4hmkarqMpazxq0m4GZK6e1I37rQ/q8n9cNZ9XHJRzUMFBcucaB9doTy55dSAET+gB/ABPjgqB+Q/YPgAAAABJRU5ErkJggg==") no-repeat;text-decoration: none;}',
            '#catTranslateBox .catSet .catdropdown {margin:0;padding:0;display:none;top:13px;right:-60px;position: absolute;background-color: #ffffff;width: 59px;overflow: auto;z-index: 1;border: 1px solid rgba(0,0,0,.2);box-shadow: 0 2px 4px rgba(0,0,0,.2);}',
            '#catTranslateBox .catSet .catdropdown li {list-style-type:none; color: black;padding: 6px 8px;margin:0px;text-decoration: none;display: block;text-align:center;}',
            '#catTranslateBox .catSet .catdropdown li:hover { background-color: #f1f1f1;}'
        ].join('\n');

        function addNewStyle(newStyle) {
            var styleElement = document.getElementById('styles_js');

            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.type = 'text/css';
                styleElement.id = 'styles_js';
                document.getElementsByTagName('head')[0].appendChild(styleElement);
            }
            
            styleElement.appendChild(document.createTextNode(newStyle));
        }

        addNewStyle(styles);

        $(document).unbind("contextmenu");
        $(document).unbind("selectstart");
        $(document).unbind("copy");
        $(document).unbind("keydown");
        $(document).unbind("paste");

        $(
            '<div id="catTranslateBox">' +
            '<div class="catContentBox">' +
            '<div class="catTextBox">' +
            '<div class="catText"></div>' +
            '<div class="catPlaySound"></div>' +
            '</div>' +
            '<div class="catExplainBox">' +
            '<div class="catExplain"></div>' +
            '<div class="catPlaySound"></div>' +
            '</div>' +
            '</div>' +
            '<div class="catTipArrow"><em></em><ins></ins></div>' +
            '<div class="catSet">' +
            '<ul class="catdropdown">' +
            '<li name="zh-CHS">中文</li>' +
            '<li name="ja">日本語</li>' +
            '<li name="en">English</li>' +
            '</ul>' +
            '</div>' +
            '</div>'
        ).appendTo($(document.body));
    }

    function showBox(mouseX, mouseY) {
        var catBox = document.getElementById('catTranslateBox');
        var selectedRect = window.getSelection().getRangeAt(0).getBoundingClientRect();
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        if (selectedRect.width) {
            if (getComputedStyle(document.body).position != 'static') {
                catBox.style.top = selectedRect.bottom - document.body.getBoundingClientRect().top + 8 + 'px';
            } else {
                catBox.style.top = selectedRect.bottom + scrollTop + 8 + 'px';
            }
            catBox.style.left = selectedRect.left + selectedRect.width / 2 - 18 + 'px';
        } else {
            catBox.style.top = mouseY - document.body.getBoundingClientRect().y + selectedRect.height + 8 + 'px';
            catBox.style.left = mouseX + selectedRect.width / 2 - 18 + 'px';
        }

        catBox.style.display = 'block';
    }

    function getAnswer(encodeText) {
        var url = `http://localhost:12580/api/getAnswer`;
        var postData = `{"topic": "${encodeText}"}`;
        postRequest(url, postData, 'tdetect');
    }

    function parseRes(jsonRes) {

        var explains = '';
        var obj = JSON.parse(jsonRes);
        console.log(jsonRes,obj);
        if(obj.answer.length > 0){
            var showtext = ""
            for(var index = 0;index < obj.answer.length;index++){
                showtext += "<p>答案："+obj.answer[index].answer+"</p>"
                showtext += "<p>"+obj.answer[index].content+"</p>"
            }
            $('.catExplain').html(showtext);
        }

    }

    function checkClick(e) {
        var path = e.path || e.composedPath();
        if (path.indexOf($('#catTranslateBox').get(0)) > -1) {
            return true;
        } else {
            return false;
        }
    }

    function clearTranslate() {
        $('#catTranslateBox').css('display', '');
        $('.catdropdown').css('display', '');
        $('.catText').empty();
        $('.catExplain').empty();
        try {
            gv.catSource.stop();
        } catch (e) {};
    }

    function playSound(arraybuffer) {
        if (!gv.audioCtx) {
            gv.audioCtx = new AudioContext();
        }
        gv.audioCtx.decodeAudioData(arraybuffer).then(function(buffer) {
            gv.catSource = gv.audioCtx.createBufferSource();
            gv.catSource.buffer = buffer;
            gv.catSource.connect(gv.audioCtx.destination);
            gv.catSource.start();
        });
    }

    function postRequest(url, data) {
        console.log("postRequest data:",url,data);
        GM.xmlHttpRequest({
            method: 'POST',
            url: url,
            data: data,
            headers: {
                "Content-Type": "application/json"
            },
            onload: function(res) {
                if (res.status == '200' && res.responseText != '') {
                  console.log("获取成功："+res.responseText)
                        parseRes(res.responseText);
                } else {
                    console.log('发生错误');
                }

            },
        });
    }

    function getRequest(url) {
        GM.xmlHttpRequest({
            method: 'GET',
            url: url,
            headers: {
                'Referer': `https://${gv.apiHost}/translator/`,
                'Range': 'bytes=0-'
            },
            responseType: 'arraybuffer',
            onload: function(res) {
                playSound(res.response);
            },
        });
    }

    function getUrlHost(url) {
        return url.split('//')[1].split('/')[0];
    }

    function isJSON(str) {
        if (typeof str == 'string') {
            try {
                var obj = JSON.parse(str);
                if (typeof obj == 'object' && obj) {
                    return true;
                } else {
                    return false;
                }
            } catch (e) {
                return false;
            }
        }
    }

    window.addEventListener('DOMContentLoaded', init);

})();