// ==UserScript==
// @name         디씨 댓글 사진
// @namespace    
// @version      0.1
// @description  댓글에 사진 ㅆㄱㄴ 나중에 크롬 확장으로 만듦 ㅅㄱ
// @author       babytaikoer
// @match        http*://*.dcinside.com/*
// @include      http*://*.dcinside.com/*
// @icon
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456065/%EB%94%94%EC%94%A8%20%EB%8C%93%EA%B8%80%20%EC%82%AC%EC%A7%84.user.js
// @updateURL https://update.greasyfork.org/scripts/456065/%EB%94%94%EC%94%A8%20%EB%8C%93%EA%B8%80%20%EC%82%AC%EC%A7%84.meta.js
// ==/UserScript==

(function() {



    function putImage(ele){
        var src = ele.innerText;
        console.log(src);
        if( src.includes('[img src=') && src.includes(']')){
            var imgSrc = src.replace(/.*\[img src=/, '').replace(/\].*/, '');
            console.log(imgSrc);
            ele.querySelectorAll('*').forEach( e => (e.remove()));
            ele.innerHTML = "<img src='"+imgSrc+"' style='max-width:300px;max-height:300px;object-fit:contain'>"
        }
                }

    document.querySelectorAll('.cmt_txtbox').forEach( e => (putImage(e)));
    // Your code here...
                })();