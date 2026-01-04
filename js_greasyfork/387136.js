// ==UserScript==
// @name         Outs
// @version      0.1
// @namespace    http://tampermonkey.net/
// @description  try to take over the world!
// @author       You
// @include      /https://outs\w+.kr/\w+/
// @grant        GM_xmlhttpRequest
// @connect      outsbusiness.ap-northeast-2.elasticbeanstalk.com
// @connect      localhost
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/387136/Outs.user.js
// @updateURL https://update.greasyfork.org/scripts/387136/Outs.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    var popupNode = null;
    function encodeParams (params){
        return Object.keys(params).map(function (key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
        }).join('&');
    }

    function selectText() {
        if(popupNode) {
            popupNode.remove();
            popupNode = null;
        }
        var selectionText = document.getSelection() + "";
        if (selectionText.length == 0) {
            return;
        }
        var select = document.getSelection();
        if(select.type != 'Range'){
            return;
        }
        const focus = $(select.focusNode);
        const css = [
            "position:absolute",
            "padding:5px",
            "background-color:#777",
            "color:white",
            "border-radius:5px",
            "z-index:99",
            "margin-left:-70px",
        ];
        const oRange = select.getRangeAt(0); //get the text range
        const oRect = oRange.getBoundingClientRect();
        const url = document.URL;
        if(!url.match(/\.kr\/[^\/]+\/?$/)){
            return;
        }
        popupNode = $('<button style="' + css.join(';') + '">제보하기</button>');
        popupNode.css('top', oRect.top + $(document).scrollTop());
        popupNode.css('left', oRect.left + $(document).scrollLeft());
        popupNode.appendTo('body');
        popupNode.mousedown(function(){
            const userText = prompt('아래 내용을 확인하시고 제보의 상세한 내용을 입력해주세요.\n\n[URL]\n'+ document.URL + '\n\n[제보 내용]\n'+ selectionText.trim()+"\n\n");
            if(userText === null) {
                return;
            }
            const user = $('span.display-name:first').text();
            const data = encodeParams({url:url, text:selectionText.trim(), reason:userText, user:user});
            GM_xmlhttpRequest ( {
                method:     'POST',
                url:        'http://outsbusiness.ap-northeast-2.elasticbeanstalk.com/article/opinion',
                data:data,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                onload:     function (responseDetails) {
                    console.log({responseDetails});
                    if(responseDetails.responseText == 'ok'){
                        alert('제보 성공 했습니다');
                    }
                    else{
                        alert('제보 실패 했습니다 : ' + responseDetails.responseText);
                    }
                },
                onerror:     function (responseDetails) {
                    console.log({responseDetails});
                    if(responseDetails.responseText == 'ok'){
                        alert('제보 성공 했습니다');
                    }
                    else{
                        alert('제보 실패 했습니다 : ' + responseDetails.responseText);
                    }
                }
            } );
        });
    }

    document.onmouseup = function() {
        selectText();
    }
})(jQuery);