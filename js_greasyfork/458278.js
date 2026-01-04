// ==UserScript==
// @name         EnchanceHangoutCSS
// @namespace    https://hangouts.google.com/
// @version      0.3
// @description  Google Hangout chatbox css enhance
// @author       RONI
// @match        https://hangouts.google.com/call/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458278/EnchanceHangoutCSS.user.js
// @updateURL https://update.greasyfork.org/scripts/458278/EnchanceHangoutCSS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...


    function realadd() {
        AddBut();
        AddBut2();
        AddBut3();

        function AddBut(){
            var addb = document.createElement('div');
            addb.id='fuckyou';
            addb.textContent='窄版';
            addb.setAttribute('style','position: fixed; top: 0; left: 35px; z-index: 999; width: 30px; height: 30px; background-color: #212121; display: flex; justify-content: center; align-items: flex-end; color: white;');
            addb.addEventListener('click',combine);
            document.body.appendChild(addb);
        }

        function AddBut2(){
            var addb = document.createElement('div');
            addb.id='fuckyou2';
            addb.textContent='原版';
            addb.setAttribute('style','position: fixed; top: 0; left: 5px; z-index: 999; width: 30px; height: 30px; background-color: #212121; display: flex; justify-content: center; align-items: flex-end; color: white;');
            addb.addEventListener('click',origincss);
            document.body.appendChild(addb);
        }

        function AddBut3(){
            var addb = document.createElement('div');
            addb.id='fuckyou3';
            addb.textContent='超窄';
            addb.setAttribute('style','position: fixed; top: 0; left: 65px; z-index: 999; width: 30px; height: 30px; background-color: #212121; display: flex; justify-content: center; align-items: flex-end; color: white;');
            addb.addEventListener('click',combine_ex);
            document.body.appendChild(addb);
        }

        //combine();
    };

    var starter = setInterval(() => {

        if(document.getElementsByClassName(/*'wfAao'*/'vCsV6b').length>0){
            console.log("have");
            combine();
            realadd();
            clearInterval(starter);
        }
    }, 200);

    function origincss (){
        ChangeCss('C9gDHb','display: inline-block; margin: 7px 0 7px 53px; -webkit-user-select: text; width: 333px} .C9gDHb:hover { ');
        ChangeCss('HzbZlf','color: rgba(255, 255, 255, .70); font-size: 14px; white-space: pre-wrap; word-wrap: break-word');
        ChangeCss('HUCXgd','color: rgba(255, 255, 255, .26); display: inline-block; float: right; font-size: 12px');
        ChangeCss('BZxZL','display: inline-block; width: 260px');
        ChangeCssSingle('jcaQle','width','406px;');
        ChangeCss('vCsV6b','border-style: solid; border-color: rgba(255, 255, 255, .12); border-width: 1px 0 1px 0; box-sizing: border-box; height: calc(100% - 144px); margin: -1px 0 -1px 0; overflow-y: auto; padding-top: 15px; padding-bottom: 9px; -webkit-user-select: auto; width: 406px; scrollbar-base-color: #757575; scrollbar-track-color: #212121; scrollbar-arrow-color: #757575')
        ChangeCss('d8SqGb','color: #fff; font-size: 16px; height: 20px; line-height: 20px;width: 318px;');
        ChangeCss('.ZUePQ.c3Bk4c .WOi1Wb','width: calc(100vw - 406px);');
        //
    }

    function combine(){
        //ChangeCss('C9gDHb','margin: 7px 0 -2px 12px; width: 330px; background-color: #2e2e2e; border-radius: 3px; display: flex; flex-direction: column; flex-wrap: nowrap; padding: 5px 20px; border-style: solid; border-width: 1px; border-color: #46464600; transition-duration: 1s; user-select: text;} .C9gDHb:hover { background-color: #3a3a3a; border-color: aliceblue; transition-duration: 0s; ');
        ChangeCss('C9gDHb','margin: 7px 0 -2px 12px; width: 200px; background-color: #2e2e2e; border-radius: 3px; display: flex; flex-direction: column; flex-wrap: nowrap; padding: 5px 20px; border-style: solid; border-width: 1px; border-color: #46464600; transition-duration: 1s; user-select: text;position: relative;} .C9gDHb:hover { background-color: #3a3a3a; border-color: aliceblue; transition-duration: 0s; ');
        ChangeCss('HzbZlf','color: #ffffffb3; font-size: 14px; white-space: pre-wrap; overflow-wrap: anywhere;');
        ChangeCss('HUCXgd','color: rgba(255,255,255,.26); display: inline-block; font-size: 12px; text-align: end; top: 7px; right: 20px; height: 0; position: absolute;');
        //ChangeCss('BZxZL','display: flex; width: 325px; flex-wrap: wrap; flex-direction: column; gap: 5px;');
        ChangeCss('BZxZL','display: flex; width: 202px; flex-wrap: wrap; flex-direction: column; gap: 5px;');
        ChangeCssSingle('jcaQle','width','274px;');
        ChangeCss('vCsV6b','border-style: solid; border-color: rgba(255,255,255,.12); border-width: 1px 0 1px 0; box-sizing: border-box; height: calc(100% - 144px); margin: -1px 0 -1px 0; overflow-y: auto; padding-top: 15px; padding-bottom: 9px; -webkit-user-select: auto; width: 270px;scrollbar-base-color: #757575; scrollbar-track-color: #212121; scrollbar-arrow-color: #757575;display: flex;flex-direction: column;}.vCsV6b> :first-child { margin-top: auto; }.vCsV6b> :last-child{ animation: nf 0.6s;}@keyframes nf { 0% {background-color: #9c9c9c;transform: translateX(-400px); scaleY(0)} 50% {background-color: #fcfcfc;}  100% {background-color: #3d3d3d;} ')
        ChangeCss('d8SqGb','display: inline-block; font-size: 16px; height: 40px; line-height: 40px; margin: 6px 6px 0 6px; width: 170px; vertical-align: middle;');
        ChangeCss('.ZUePQ.c3Bk4c .WOi1Wb','width: calc(100vw - 296px);');

    }

    function combine_ex(){
        //ChangeCss('C9gDHb','margin: 7px 0 -2px 12px; width: 330px; background-color: #2e2e2e; border-radius: 3px; display: flex; flex-direction: column; flex-wrap: nowrap; padding: 5px 20px; border-style: solid; border-width: 1px; border-color: #46464600; transition-duration: 1s; user-select: text;} .C9gDHb:hover { background-color: #3a3a3a; border-color: aliceblue; transition-duration: 0s; ');
        ChangeCss('C9gDHb','margin: 7px 0 -2px 12px; width: 120px; background-color: #2e2e2e; border-radius: 3px; display: flex; flex-direction: column; flex-wrap: nowrap; padding: 5px 20px; border-style: solid; border-width: 1px; border-color: #46464600; transition-duration: 1s; user-select: text;position: relative;} .C9gDHb:hover { background-color: #3a3a3a; border-color: aliceblue; transition-duration: 0s; ');
        ChangeCss('HzbZlf','color: #ffffffb3; font-size: 14px; white-space: pre-wrap; overflow-wrap: anywhere;');
        ChangeCss('HUCXgd','color: rgba(255,255,255,.26); display: inline-block; font-size: 12px; text-align: end; top: 7px; right: 20px; height: 0; position: absolute;');
        //ChangeCss('BZxZL','display: flex; width: 325px; flex-wrap: wrap; flex-direction: column; gap: 5px;');
        ChangeCss('BZxZL','display: flex; width: 122px; flex-wrap: wrap; flex-direction: column; gap: 5px;');
        ChangeCssSingle('jcaQle','width','204px;');
        ChangeCss('vCsV6b','border-style: solid; border-color: rgba(255,255,255,.12); border-width: 1px 0 1px 0; box-sizing: border-box; height: calc(100% - 144px); margin: -1px 0 -1px 0; overflow-y: auto; padding-top: 15px; padding-bottom: 9px; -webkit-user-select: auto; width: 200px;scrollbar-base-color: #757575; scrollbar-track-color: #212121; scrollbar-arrow-color: #757575;display: flex;flex-direction: column;}.vCsV6b> :first-child { margin-top: auto; }.vCsV6b> :last-child{ animation: nf 0.6s;}@keyframes nf { 0% {background-color: #9c9c9c;transform: translateX(-400px); scaleY(0)} 50% {background-color: #fcfcfc;}  100% {background-color: #3d3d3d;} ')
        ChangeCss('d8SqGb','display: inline-block; font-size: 16px; height: 40px; line-height: 40px; margin: 6px 6px 0 6px; width: 95px; vertical-align: middle;');
        ChangeCss('.ZUePQ.c3Bk4c .WOi1Wb','width: calc(100vw - 296px);');

    }

    function ChangeCss(classs,css){
        var allstylesheet = document.getElementsByTagName('style');
        //console.log(allstylesheet);
        for (let i = 0; i < allstylesheet.length; i++) {
            //console.log(allstylesheet[i].innerHTML.split('C9gDHb').length);
            if (allstylesheet[i].innerHTML.split(classs).length >= 2) {
                //console.log('Running1')
                //console.log(allstylesheet[i].innerHTML);
                //console.log(allstylesheet[i].innerHTML.split(classs+'{')[1].split('}')[0]);
                allstylesheet[i].innerHTML=allstylesheet[i].innerHTML.replace(allstylesheet[i].innerHTML.split(classs+'{')[1].split('}')[0],css);
                //console.log('Running2_end')
            }

        }
    }

    function ChangeCssSingle(classs,css,value){
        var allstylesheet = document.getElementsByTagName('style');
        //console.log(allstylesheet);
        for (let i = 0; i < allstylesheet.length; i++) {
            //console.log(allstylesheet[i].innerHTML.split('C9gDHb').length);
            if (allstylesheet[i].innerHTML.split(classs).length >= 2) {
                //console.log(allstylesheet[i].innerHTML.split(classs)[1].split('{')[1].split('}')[0].split(css)[1]);
                //console.log(allstylesheet[i].innerHTML.split(classs)[1].split('{')[1].split('}')[0].split(css)[1].split(':')[1]);
                //console.log(allstylesheet[i].innerHTML.split(classs)[1].split('{')[1].split('}')[0].split(css)[1].split(':')[1].split(';')[0]);
                allstylesheet[i].innerHTML=allstylesheet[i].innerHTML.replace(allstylesheet[i].innerHTML.split(classs)[1].split('{')[1].split('}')[0].split(css)[1].split(':')[1].split(';')[0],value);

            }else{
                console.log('class "'+classs+'"not found in this style sheet')
            }

        }
    }






})();