// ==UserScript==
// @name         디시 반고닉 유동 사진글 숨기기
// @namespace    dcpic
// @version      1
// @description  dc
// @author       You
// @match        https://gall.dcinside.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dcinside.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/504534/%EB%94%94%EC%8B%9C%20%EB%B0%98%EA%B3%A0%EB%8B%89%20%EC%9C%A0%EB%8F%99%20%EC%82%AC%EC%A7%84%EA%B8%80%20%EC%88%A8%EA%B8%B0%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/504534/%EB%94%94%EC%8B%9C%20%EB%B0%98%EA%B3%A0%EB%8B%89%20%EC%9C%A0%EB%8F%99%20%EC%82%AC%EC%A7%84%EA%B8%80%20%EC%88%A8%EA%B8%B0%EA%B8%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let hide = GM_getValue("hide",1);

    GM_registerMenuCommand(`유동,반고닉 사진글 숨기기 ${hide ? "ON → OFF" : "OFF → ON"}`, function () {
        // followCutoff 값 변경
        hide = hide ? 0 : 1;
        // 변경된 값 저장
        GM_setValue("hide", hide);
        alert("설정이 변경되었습니다. 새로고침 시 적용됩니다.");
    });

    function loadList(){
        var list = $('.ub-content.us-post').toArray();
        for(var i = 0; i < list.length; i++){
            let src = $(list[i]).find('.gall_writer.ub-writer').find('.writer_nikcon').find('img').attr('src');
            if(src == undefined || src == 'https://nstatic.dcinside.com/dc/w/images/nik.gif'){
                let ico = $(list[i]).find('.icon_img');
                if(ico.attr("class") == "icon_img icon_pic"){
                    if(hide == 1){
                        $(list[i]).remove();
                    } else {
                        ico.parent().css('color', 'firebrick');
                    }
                    console.log(ico.parent().text()+" 삭제됨");
                }
            }
        }
    }
    
    loadList();
    
})();