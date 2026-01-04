// ==UserScript==
// @name         Video Controller
// @namespace    https://github.com/maidouofgithub
// @version      0.0.2
// @description  切换上下剧集(switch controoler)
// @author       landwind
// @match        https://*.pmys6.com/*
// @match        https://*.abcys.org/*
// @match        https://*.spzcr.cn/*
// @icon         https://v.qq.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/397468/Video%20Controller.user.js
// @updateURL https://update.greasyfork.org/scripts/397468/Video%20Controller.meta.js
// ==/UserScript==

(function() {
    
    'use strict';

      Init();

    function  Init()
    {
        AppendButton();
    }

    function AppendButton()
    {
        //debugger
        //https://www.pmys6.com/play/320650-1-9.html
        let url = location.href;
        let params =  url.match(/\d*-\d*-\d*/)[0].split('-');
        let pre =  url.match(/\d*-\d*-/);
        let page =Number( params[params.length-1]);
        let preBtn = document.createElement('a');
        preBtn.style.cssText =  'background-color:#66CC00;text-align:center;opacity:0.7;color:white;cursor:pointer;position:fixed;bottom:70%;width:45px;height:25px;right:10px;z-index:9999';
        preBtn.innerHTML ='Pre';
        preBtn.addEventListener('click', function(){
            let newParmas = pre+(page-1<=0?'1':page-1);
            window.location.replace(url.replace(params.join('-'),newParmas));
        }, false );
        document.body.appendChild(preBtn);

        let nextBtn = document.createElement('a');
        nextBtn.style.cssText =  'background-color:#66CC99;text-align:center;opacity:0.7;color:white;cursor:pointer;position:fixed;bottom:60%;width:45px;height:25px;right:10px;z-index:9999';
        nextBtn.innerHTML ='Next';
        nextBtn.addEventListener('click', function(){
            let newParmas = pre+(page+1);
            window.location.replace(url.replace(params.join('-'),newParmas));
        }, false );
        document.body.appendChild(nextBtn);

    }

})();