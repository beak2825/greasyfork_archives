// ==UserScript==
// @name         MX In Priority Queue
// @namespace    http://tampermonkey.net/
// @version      2024-08-06
// @description  Remember to give MX money
// @author       ___Furina___
// @match        *://mna.wang/*
// @icon         https://cdn.luogu.com.cn/upload/image_hosting/83nysg06.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502927/MX%20In%20Priority%20Queue.user.js
// @updateURL https://update.greasyfork.org/scripts/502927/MX%20In%20Priority%20Queue.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*let refreshInterval = 10000; // 每1秒刷新一次页面，可修改！！！
    function refreshPage() {
       window.location.reload();
    }
    setInterval(refreshPage, refreshInterval);*/
    let acceptStatus = document.getElementsByClassName("accepted");
    for(let i = 0; i < acceptStatus.length; i++) acceptStatus[i].innerHTML = '<i class="icon checkmark"></i> \n      Pop Successfully\n    ';/*ps=accept*/

    let wronganswerStatus = document.getElementsByClassName("wrong_answer");
    for(let i = 0; i < wronganswerStatus.length; i++) wronganswerStatus[i].innerHTML = '<i class="icon remove"></i> \n      Pop Failed\n    ';/*pf=wrong answer*/

    let reStatus = document.getElementsByClassName("runtime_error");
    for(let i = 0; i < reStatus.length; i++) reStatus[i].innerHTML = '<i class="icon bomb"></i> \n      Overflowed\n    ';/*o=runtime error*/

    let tleStatus = document.getElementsByClassName("time_limit_exceeded");
    for(let i = 0; i < tleStatus.length; i++) tleStatus[i].innerHTML = '<i class="icon clock"></i> \n      Use Too Much Time\n    ';/*utmt=TLE*/

    let mleStatus = document.getElementsByClassName("memory_limit_exceeded");
    for(let i = 0; i < mleStatus.length; i++) mleStatus[i].innerHTML = '<i class="icon microchip"></i> \n      Use Too Much Space\n    ';/*utms=mLE*/

    let oleStatus = document.getElementsByClassName("output_limit_exceeded");
    for(let i = 0; i < oleStatus.length; i++) oleStatus[i].innerHTML = '<i class="icon print"></i> \n      Pop Too Much\n    ';/*ptm=OLE*/

    let feStatus = document.getElementsByClassName("file_error");
    for(let i = 0; i < feStatus.length; i++) feStatus[i].innerHTML = '<i class="icon file outline"></i> \n      Out Of Priority Queue\n    ';/*oopq=FE*/

    let ceStatus = document.getElementsByClassName("compile_error");
    for(let i = 0; i < ceStatus.length; i++) ceStatus[i].innerHTML = '<i class="icon code"></i> \n      Joker\n    ';/*j=ce*/

    let waitingStatus = document.getElementsByClassName("waiting");
    for(let i = 0; i < waitingStatus.length; i++) waitingStatus[i].innerHTML = '<i class="icon hourglass half"></i> \n      In Priority Queue\n    ';/*In pq=waiting*/

    let pendingStatus = document.getElementsByClassName("pending");
    for(let i = 0; i < pendingStatus.length; i++) pendingStatus[i].innerHTML = '<i class="icon hourglass half"></i> \n      In Priority Queue\n    ';/*In pq=waiting*/

    let runningStatus = document.getElementsByClassName("running");
    for(let i = 0; i < runningStatus.length; i++) runningStatus[i].innerHTML = '<i class="icon spinner"></i> \n      Start Pop\n    ';/*sp=running*/

    let cpStatus = document.getElementsByClassName("compiling");
    for(let i = 0; i < cpStatus.length; i++) cpStatus[i].innerHTML = '<i class="icon spinner"></i> \n      Before Pop\n    ';/*bp=compiling*/

    let juStatus = document.getElementsByClassName("judging");
    for(let i = 0; i < juStatus.length; i++) juStatus[i].innerHTML = '<i class="icon spinner"></i> \n      Poping\n    ';/*p=judging*/

    let smStatus = document.getElementsByClassName("submitted");
    for(let i = 0; i < smStatus.length; i++) smStatus[i].innerHTML = '<i class="icon checkmark"></i> \n      Push Successfully\n    ';/*ps=Submitted*/

    let seStatus = document.getElementsByClassName("system_error");
    for(let i = 0; i < seStatus.length; i++) seStatus[i].innerHTML = '<i class="icon server"></i> \n      Priority Queue Not Find\n    ';/*pqnf=system error*/

    let pcStatus = document.getElementsByClassName("partially_correct");
    for(let i = 0; i < pcStatus.length; i++) pcStatus[i].innerHTML = '<i class="icon minus"></i> \n      Pop Partially\n    ';/*pp=Partially Correct*/

    let ukeStatus = document.getElementsByClassName("unknown");
    for(let i = 0; i < ukeStatus.length; i++) ukeStatus[i].innerHTML = '<i class="icon question circle"></i> \n      Priority Queue Cleared\n    ';/*Unknown*/

    let iiStatus = document.getElementsByClassName("invalid_interaction");
    for(let i = 0; i < iiStatus.length; i++) iiStatus[i].innerHTML = '<i class="icon ban"></i> \n      MX Kicked You\n    ';/*ban*/

    let ntStatus = document.getElementsByClassName("no_testdata");
    for(let i = 0; i < ntStatus.length; i++) ntStatus[i].innerHTML = '<i class="icon folder open outline"></i> \n      Even No Queue Here\n    ';/*no data*/

    let jfStatus = document.getElementsByClassName("judgement_failed");
    for(let i = 0; i < jfStatus.length; i++) jfStatus[i].innerHTML = '<i class="icon server"></i> \n      Priority Queue Boom~~~\n    ';/*ban*/
})();