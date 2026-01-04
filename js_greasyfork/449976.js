// ==UserScript==
// @name         Fusion Kousu Sum
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  工数一覧画面で、ワークごとに合計工数を表示する
// @author       mikada
// @match        https://exahrsrv.exa-corp.co.jp/fusionxp-webs/exa/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449976/Fusion%20Kousu%20Sum.user.js
// @updateURL https://update.greasyfork.org/scripts/449976/Fusion%20Kousu%20Sum.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // URLのルールが微妙なのでタイトル文言で判断する
    let subtitle = document.getElementsByClassName("subtitle")[0].innerHTML;
    //console.log(subtitle);
    if(subtitle != "工数照会・確定画面") {
        //console.log("return");
        return;
    }


    let projCount = 0;
    let projElems = document.getElementsByClassName("rl_detail");
    for(let i = 0; i < projElems.length; i++) {
        if(projElems[i].innerHTML.startsWith("コード選択")) {
            projCount++;
        }
    }

    let kousuList = new Array(projCount);
    for(let i = 0; i < kousuList.length; i++) {
        kousuList[i] = 0;
    }
    const pattern = /([0-9]{1,})/gi;
    let kousuElems = document.getElementsByName("kousu");
    for(let i = 0; i < kousuElems.length; i++) {
        let elm = kousuElems[i];
        if(elm.value != "") {
            let kousu = elm.value.match(pattern);
            kousuList[i%projCount] += Number(kousu[0])*60 + Number(kousu[1]);
        }
    }
    //console.log(kousuList);

    let c = 0;
    for(let i = 0; i < projElems.length; i++) {
        if(projElems[i].innerHTML.startsWith("コード選択")) {
            let dHour = parseInt(kousuList[c]/60);
            let dMin = parseInt(kousuList[c]%60);
            projElems[i].innerHTML = "コード選択<br/>"+dHour+":"+(dMin < 10 ? "0"+dMin : dMin);
            c++;
        }
    }


})();

