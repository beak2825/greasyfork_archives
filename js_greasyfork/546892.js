// ==UserScript==
// @name         천봉 한글화 
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  천봉 사이트 한글화
// @author       1
// @match        https://tenhou.net/3/*
// @match        https://tenhou.net/0/wg/*
// @match        https://tenhou.net/*make_lobby*
// @icon         https://yt3.googleusercontent.com/J7QbevqvDkLbkI77_6EXxacKeq3SEvAfQ8pnlpyQ5RBzVjDHyMmNQ9UIOYc43nIQ6i5DKDCnCw=s160-c-k-c0x00ffffff-no-rj
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/546892/%EC%B2%9C%EB%B4%89%20%ED%95%9C%EA%B8%80%ED%99%94.user.js
// @updateURL https://update.greasyfork.org/scripts/546892/%EC%B2%9C%EB%B4%89%20%ED%95%9C%EA%B8%80%ED%99%94.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lobbyNumber;
    let el = [];
    let pageURL = location.href;



    const firstTransData = {

        "四般東喰赤速": "4일반 동풍탕적속",
        "四般東喰赤光": "4일반 동풍탕적광",
        "四般東喰赤": "4일반 동풍탕적",
        "四般東喰": "4일반 동풍탕",
        "四般東": "4일반 동풍전",
        "四般南喰赤速": "4일반 남풍탕적속",
        "四般南喰赤光": "4일반 남풍탕적광",
        "四般南喰赤": "4일반 남풍탕적",
        "四般南喰": "4일반 남풍탕",
        "四般南": "4일반 남풍전",
        "三般東喰赤速": "3일반 동풍탕적속",
        "三般東喰赤光": "3일반 동풍탕적광",
        "三般東喰赤": "3일반 동풍탕적",
        "三般東喰": "3일반 동풍탕",
        "三般東": "3일반 동풍전",
        "三般南喰赤速": "3일반 남풍탕적속",
        "三般南喰赤光": "3일반 동풍탕적광",
        "三般南喰赤": "3일반 남풍탕적",
        "三般南喰": "3일반 남풍탕",
        "三般南": "3일반 남풍전",
        "四上東喰赤速": "4상탁 동풍탕적속",
        "四上東喰赤光": "4상탁 동풍탕적광",
        "四上東喰赤": "4상탁 동풍탕적",
        "四上東喰": "4상탁 동풍탕",
        "四上東": "4상탁 동풍전",
        "四上南喰赤速": "4상탁 남풍탕적속",
        "四上南喰赤光": "4상탁 남풍탕적광",
        "四上南喰赤": "4상탁 남풍탕적",
        "四上南喰": "4상탁 남풍탕",
        "四上南": "4상탁 남풍전",
        "三上東喰赤速": "3상탁 동풍탕적속",
        "三上東喰赤光": "3상탁 동풍탕적광",
        "三上東喰赤": "3상탁 동풍탕적",
        "三上東喰": "3상탁 동풍탕",
        "三上東": "3상탁 동풍전",
        "三上南喰赤速": "3상탁 남풍탕적속",
        "三上南喰赤光": "3상탁 남풍탕적광",
        "三上南喰赤": "3상탁 남풍탕적",
        "三上南喰": "3상탁 남풍탕",
        "三上南": "3상탁 남풍전",
        "四特東喰赤速": "4특상 동풍탕적속",
        "四特東喰赤光": "4특상 동풍탕적광",
        "四特東喰赤": "4특상 동풍탕적",
        "四特東喰": "4특상 동풍탕",
        "四特東": "4특상 동풍전",
        "四特南喰赤速": "4특상 남풍탕적속",
        "四特南喰赤光": "4특상 남풍탕적광",
        "四特南喰赤": "4특상 남풍탕적",
        "四特南喰": "4특상 남풍탕",
        "四特南": "4특상 남풍전",
        "三特東喰赤速": "3특상 동풍탕적속",
        "三特東喰赤光": "3특상 동풍탕적광",
        "三特東喰赤": "3특상 동풍탕적",
        "三特東喰": "3특상 동풍탕",
        "三特東": "3특상 동풍전",
        "三特南喰赤速": "3특상 남풍탕적속",
        "三特南喰赤光": "3특상 남풍탕적광",
        "三特南喰赤": "3특상 남풍탕적",
        "三特南喰": "3특상 남풍탕",
        "三特南": "3특상 남풍전",
        "四鳳東喰赤速": "4봉황 동풍탕적속",
        "四鳳東喰赤光": "4봉황 동풍탕적광",
        "四鳳東喰赤": "4봉황 동풍탕적",
        "四鳳東喰": "4봉황 동풍탕",
        "四鳳東": "4봉황 동풍전",
        "四鳳南喰赤速": "4봉황 남풍탕적속",
        "四鳳南喰赤光": "4봉황 남풍탕적광",
        "四鳳南喰赤": "4봉황 남풍탕적",
        "四鳳南喰": "4봉황 남풍탕",
        "四鳳南": "4봉황 남풍전",
        "三鳳東喰赤速": "3봉황 동풍탕적속",
        "三鳳東喰赤": "3봉황 동풍탕적",
        "三鳳東喰": "3봉황 동풍탕",
        "三鳳東": "3봉황 동풍전",
        "三鳳南喰赤速": "3봉황 남풍탕적속",
        "三鳳南喰赤": "3봉황 남풍탕적",
        "三鳳南喰": "3봉황 남풍탕",
        "三鳳南": "3봉황 남풍전",
        "四麻雀荘戦": "4마 작장전",
        "三麻雀荘戦": "3마 작장전",
        "三麻":"3마 ",
        "四麻":"4마 ",
        "観戦":"관전",
        "段位戦":"랭킹전",

        "新人": "신인",
        "１級": "1급",
        "1級": "1급",
        "２級": "2급",
        "３級": "3급",
        "４級": "4급",
        "５級": "5급",
        "６級": "6급",
        "７級": "7급",
        "８級": "8급",
        "９級": "9급",
        "１０級": "10급",

        "初段": "초단",
        "一段": "1단",
        "二段": "2단",
        "三段": "3단",
        "四段": "4단",
        "五段": "5단",
        "六段": "6단",
        "七段": "7단",
        "八段": "8단",
        "九段": "9단",
        "十段": "10단",

        "鳳凰卓": "봉황탁",
        "特上卓": "특상탁",
        "上級卓": "상급탁",
        "対戦": "대전",

    };

    // 텍스트 교체
    function replaceText(root=document.body){
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
        let nodes = [];
        while(walker.nextNode()) nodes.push(walker.currentNode);

        for(let node of nodes){
            if(node.parentElement.nodeName === "A"){
                node.parentElement.href = node.parentElement.href.replace("tenhou.net/0/", "tenhou.net/3/");
            }
            for(let key in firstTransData){
                node.nodeValue = node.nodeValue.replace(new RegExp(key,"g"), firstTransData[key]);
            }
        }
    }

    // MutationObserver 설정
    const observer = new MutationObserver((mutations)=>{
        for(let m of mutations){
            if(m.type === "childList" || m.type === "characterData"){
                replaceText(m.target);
            }
        }
    });

    function startObserver(){
        observer.observe(document.body, {childList:true, subtree:true, characterData:true});
    }

    // 로비 페이지 UI
    function E(idx,id,cls,tag,type,parent){
        el[idx] = document.createElement(tag);
        if(id) el[idx].id = id;
        if(cls) el[idx].className = cls;
        if(type) el[idx].type = type;
        parent.appendChild(el[idx]);
    }

    function makePage(){
        let match = document.body.innerText.match(/【天鳳 個室L(\d+)】/);
        if(!match) return;
        lobbyNumber = match[1];
        document.title = "천봉 L"+lobbyNumber;
        document.body.style = "background-color:#A6A6A6;text-align:center;padding-top:40px;";
        document.body.innerHTML = '';

        E(0,'startbtn','btn','button','button',document.body); el[0].innerText = `【생성된 천봉 로비 L${lobbyNumber}】`; document.body.innerHTML+='<br>';
        E(1,'sharebtn','btn','button','button',document.body); el[1].innerText = "【로비 접속 링크 공유】";
        E(3,'copybox','','div','',document.body); el[3].style.display='none'; el[3].innerHTML="클립보드로 복사되었습니다.<br>";
        E(4,'copytext','','textarea','',el[3]); el[4].value='https://tenhou.net/3/?L'+lobbyNumber;
        E(5,'wgbtn','btn','button','button',document.body); el[5].innerText="【관전 링크 공유】";

        window.addEventListener("click",(e)=>{
            if(e.target.id===el[1].id){
                el[4].value='https://tenhou.net/3/?L'+lobbyNumber; el[3].style.display='block'; el[4].select(); document.execCommand("copy");
            }else if(e.target.id===el[0].id){
                location.href='https://tenhou.net/3/?L'+lobbyNumber;
            }else if(e.target.id===el[5].id){
                el[4].value='https://tenhou.net/0/wg/?L'+lobbyNumber; el[3].style.display='block'; el[4].select(); document.execCommand("copy");
            }else{ el[3].style.display='none'; }
        });
    }

    // 관전 페이지
    function wgPage(){
        let ws = document.getElementsByClassName('w');
        for(let w of ws) w.remove();
        document.title="천봉 / 관전";
    }

    // 시작
    function startUp(){
        if(pageURL.includes('make_lobby')) makePage();
        else if(pageURL.includes('/wg/')) wgPage();
        replaceText();
        startObserver();
    }

    // 페이지 로딩 후 실행
    if(document.readyState==="loading"){
        window.addEventListener('DOMContentLoaded', startUp);
    }else{
        startUp();
    }

})();
