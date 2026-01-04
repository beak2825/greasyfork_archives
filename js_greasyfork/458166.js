// ==UserScript==
// @name         Jenkins分支选择助手
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  Jenkins构建时分支选择优化
// @license      Apache-2.0
// @author       liubiao
// @include      *://*/job/*/build*
// @icon         http://jenkins-staging.kzmall.cc/static/64581efe/images/jenkins-header-logo-v2.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458166/Jenkins%E5%88%86%E6%94%AF%E9%80%89%E6%8B%A9%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/458166/Jenkins%E5%88%86%E6%94%AF%E9%80%89%E6%8B%A9%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let tryNum = 10;
    let dom = document.getElementById("gitParameterSelect");
    let submitBtn = document.getElementById("yui-gen1-button");

    function handle(){
        dom.style.height = (dom.scrollHeight+10) + 'px';

        let options = document.getElementsBySelector("#gitParameterSelect option");
        let branchs = [];
        let topBranchs = {
            "origin/master": [],
            "origin/develop": [],
            "origin/gray": [],
            "origin/debug": [],
            "origin/staging": [],
            "origin/test": [],
            "origin/dev": [],
            "origin/release": [],
        };
        let prefix;
        for(let option of options){
            prefix = option.value.split('-')[0];
            if(topBranchs[prefix] === undefined){
                branchs.push(option.value);
            }else{
                topBranchs[prefix].push(option.value);
            }
        }
        branchs.sort();
        branchs.reverse();

        let html = '';
        for(let bArr of Object.values(topBranchs)){
            bArr.sort();
            bArr.reverse();
            for(let b of bArr){
                html = html + "<option value='"+b+"'>" + b + "</option>"
            }
        }
        for(let b of branchs){
            html = html + "<option value='"+b+"'>" + b + "</option>"
        }

        dom.innerHTML = html;
    }

    function ready(){
        setTimeout(function(){
            let options = document.getElementsBySelector("#gitParameterSelect option");
            if(options.length === 1 && options[0].value === ''){
                if(tryNum > 0){
                    ready();
                    tryNum--;
                }
            }else{
                handle();
            }
        }, 500);
    }

    ready();

    dom.onchange = function(v){
        if(dom.selectedIndex >= 0){
            document.getElementById("yui-gen1-button").innerHTML = '开始构建 <strong style="padding-left:10px;">' + document.getElementsBySelector("#gitParameterSelect option")[dom.selectedIndex].value + '</strong>';
        }
    };

    document.getElementsBySelector("#main-panel form .parameters")[0].style.display = 'flex';

    let trs = document.getElementsBySelector("#main-panel form .parameters div.tr");
    trs[trs.length - 1].style.marginTop = '35px';
})();