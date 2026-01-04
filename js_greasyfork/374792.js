// ==UserScript==
// @name         Namulive_TempStore
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  나무라이브 글 임시저장
// @include      https://namu.live*
// @author       Suneungsiheom
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/374792/Namulive_TempStore.user.js
// @updateURL https://update.greasyfork.org/scripts/374792/Namulive_TempStore.meta.js
// ==/UserScript==

//tinymce.init({
//  selector: 'textarea',
//  content_css: ['//www.tinymce.com/css/codepen.min.css']
//});

(function() {
    'use strict';
    let area = document.createElement("div");
    let areaTitle = document.createElement("p");
    let areaMsg = document.createElement("p");
    var tempsaver;
    // 임시저장
    function tempsave() {
        let title = document.getElementById('inputTitle').value;
        let content = tinymce.get('content').getContent();
        let eachline = content.split('\n');
        var content2 = "";
        for(var i = 0; i < eachline.length; i++) {
            content2 += (eachline[i].replace("<p>", "").replace("</p>", "") + "\r\n");
        }
        var file = document.createElement('a');
        file.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(title + "\r\n\r\n" + content2));
        file.setAttribute("download", "namla_temp_" + Math.floor(Math.random() * 1000000) + ".txt");
        if(document.createEvent) {
            var event = document.createEvent("MouseEvents");
            event.initEvent("click", true, true);
            file.dispatchEvent(event);
        } else {
            file.click();
        }
    }
    // 랜덤으로 tempsave를 실행할지 결정
    function random_tempsave() {
        if (Math.floor(Math.random() * 10) == 0) tempsave();
    }
    if (document.querySelector('div.article-write') !== null) {
        // 임시저장 타이틀
        area.classList.add("sidebar-item");
        let textarea = document.querySelector('.article-write');
        textarea.appendChild( area );
        areaTitle.textContent = "나무라이브 게시물 임시저장은 행운의 여신이 알아서 해 줍니다. '지금 임시저장' 버튼은 되도록 누르지 마세요.";
        area.appendChild( areaTitle );
        areaMsg.textContent = "임시저장은 파일 다운로드 방식으로 진행됩니다. 다운로드 권한이 차단되어 있으면 실행되지 않으니 주의해 주세요.";
        area.appendChild( areaMsg );
        // 임시저장 버튼
        let btn = document.createElement("button");
        btn.textContent = "지금 임시저장";
        area.appendChild( btn );
        btn.addEventListener('click', function() {
            // 테스트 통과(1/10 확률)
            if (Math.floor(Math.random() * 10) == 0) {
                areaTitle.textContent = "행운의 여신이 이번에는 그냥 넘어갔습니다. 게시물이 임시저장되었습니다.";
                tempsave();
            // 테스트 실패(30분 정지)
            } else {
                let time = new Date();
                let time0 = new Date(Date.parse(time) + 1800000)
                let text = (time0.getHours() < 10 ? "0" : "") + time0.getHours() + ":" + (time0.getMinutes() < 10 ? "0" : "") + time0.getMinutes() + ":" + (time0.getSeconds() < 10 ? "0" : "") + time0.getSeconds();
                areaTitle.textContent = "행운의 여신에 의해 저장 요청이 거부되었습니다. '지금 임시저장' 버튼을 " + text + "까지 클릭할 수 없습니다.";
                btn.disabled = true;
                setTimeout(function(){
                    btn.disabled = false;
                    areaTitle.textContent = "나무라이브 게시물 임시저장은 행운의 여신이 알아서 해 줍니다.";
                }, 1800000);
            }
        });
        tempsaver = setInterval(random_tempsave, 30000);
    }
})();