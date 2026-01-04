// ==UserScript==
// @name         Memoarca
// @name:ko      메모아카
// @name:es      Memoarca
// @name:gn      Memoarca
// @version      2024-06-20.1
// @description  Memo certain nicknames for arca.live
// @description:ko  아카라이브 브라우저에서 메모하기
// @description:es  Memoriza ciertos apodos para arca.live
// @description:gn  Memo ciertos apodos para arca.live
// @author       noise1617@gmail.com
// @license      MIT License
// @match        https://arca.live/*
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace https://greasyfork.org/users/1320818
// @downloadURL https://update.greasyfork.org/scripts/498398/Memoarca.user.js
// @updateURL https://update.greasyfork.org/scripts/498398/Memoarca.meta.js
// ==/UserScript==

/* 고정닉: '닉' 그대로 입력
   반고닉: '닉#(번호)' 입력
   유동: 'IP.두자리' 입력 ex) '255.255'
*/

(function() {
    'use strict';

    // 설정: 메모의 배경색, 글자색
    const memoBackgroundColor = 'yellow';
    const memoColor = 'black';

    const mapToObject = map => Object.fromEntries(map.entries());
    const objectToMap = obj => new Map(Object.entries(obj));
    const setMemoMap = memoMap => GM_setValue("memoMap", mapToObject(memoMap));
    const getMemoMap = function() { return objectToMap(GM_getValue("memoMap", null)); };

    // Map 닉 -> 메모
    var initMemoMap = function() {
        var memoMap = GM_getValue("memoMap", null);
        if (memoMap == null) {
            let memoMap = new Map();
            memoMap.set('*ㅎㅎ','전 관리자'); // default 메모
            setMemoMap(memoMap);
        };
    };
    initMemoMap();

    var sanitizedId = function(text) {
        return text.replace(/^[^,]*(?:, )|\s+$/,'');
    };

    var writeMemo = function() {
        var defaultNickname = "";
        if (window.location.href.match(/https:\/\/arca\.live\/u\/@.*/)) { // 이미 누군가의 챈로그에 있다면
            defaultNickname = window.location.href.replace(/https:\/\/arca\.live\/u\/@/, "");
            defaultNickname = sanitizedId(decodeURIComponent(defaultNickname.replace("/","#")));
        } else {
            var head = document.querySelector(".article-head")
            if (head) {
                defaultNickname = getIds(head, defaultNickname);
            };
        };
        var id = prompt("닉네임:", defaultNickname);
        if (id == null) { return; };
        if (id == "") {
            alert("No Nickname");
        };
        id = sanitizedId(id);

        var memoMap = getMemoMap();
        var memo = prompt("메모: " + id, memoMap.get(id));
        if (!memo) {
            if (confirm(id + "에 대한 메모를 지우시겠습니까?")){
                memoMap.delete(id);
            };
        } else {
            memoMap.set(id, memo);
        };
        setMemoMap(memoMap);
        setTimeout(run, 3000);
    };

    var exportMemo = function() {
        var memoMap = GM_getValue("memoMap", null);
        alert(JSON.stringify(memoMap));
    };

    var importMemo = function() {
        var memoMap = prompt("Import Memos: ");
        if (memoMap == null) { return; };
        try {
            memoMap = JSON.parse(memoMap);
        } catch(e) {
            alert("입력을 이해하지 못했습니다");
            console.log(e);
            return;
        }
        if (!memoMap) {
            if (confirm("모든 메모를 지우시겠습니까?")){
                setMemoMap(new Map());
            };
        } else {
            GM_setValue("memoMap", memoMap);
        }
        setTimeout(run, 3000);
    }

    const menu_command_writeMemo = GM_registerMenuCommand("Write Memo", writeMemo);
    const menu_command_exportMemo = GM_registerMenuCommand("Export", exportMemo);
    const menu_command_importMemo = GM_registerMenuCommand("Import", importMemo);

    var getNicknames = function() {
        var nicknames = document.querySelectorAll(".user-info");
        return nicknames;
    };

    var getIds = function(nickname, noname = null) {
        var idObj = nickname.querySelector("a[data-filter],span[data-filter]");
        if (idObj) {
            var id = idObj.getAttribute('data-filter');
            return sanitizedId(id);
        };
        return noname;
    };

    var addMemoObj = function(nickname, memoMap) {
        var id = getIds(nickname);
        if (id == null) {return null;};
        var memoText = memoMap[id]; // Map as Object
        if(memoText){
            let memoObj = nickname.querySelector("#memo_by_memoarca");
            if (memoObj) { // A memo already exists, we are overwriting
                memoObj.innerHTML = memoText;
            } else { // New memo
                let memoObj = document.createElement('span');
                memoObj.style.backgroundColor = memoBackgroundColor;
                memoObj.style.color = memoColor;
                memoObj.id = "memo_by_memoarca"
                memoObj.innerHTML = memoText;
                nickname.insertBefore(memoObj, nickname.querySelector(".zero-at-one-space"));
            };
        } else {
            // Delete memo > delete memoObj
            var memoObj = nickname.querySelector("#memo_by_memoarca");
            if (memoObj) { memoObj.remove(); };
        };
    };

    var run = function() {
        var nicknames = getNicknames();
        var memoMap = GM_getValue("memoMap", null); // as Object
        for (var i=0; i<nicknames.length; i++) {
            var nickname = nicknames[i];
            addMemoObj(nickname, memoMap);
        };
    };

    setTimeout(run, 3000);
})();