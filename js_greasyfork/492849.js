// ==UserScript==
// @name         Show/Hide ACed problems
// @namespace    http://tampermonkey.net/
// @version      v1.2.0
// @description  Show or hide accepted problem in the luogu training session
// @author       limesarine
// @match        https://luogu.com/training/*
// @match        https://luogu.com.cn/training/*
// @match        https://*.luogu.com/training/*
// @match        https://*.luogu.com.cn/training/*
// @license      © 2024 Limesarine. All rights reserved.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=luogu.com.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492849/ShowHide%20ACed%20problems.user.js
// @updateURL https://update.greasyfork.org/scripts/492849/ShowHide%20ACed%20problems.meta.js
// ==/UserScript==

function getVal()
{
    let e=document.getElementById('min-score');
    e=e.value;
    if(e=='')
    {
        return 101;
    }
    if(e>=0 && e<=100)
    {
        return e;
    }
    return 101;
}

function displayAC(display)
{
    let x=document.getElementsByClassName('border table')[0];
    let val=getVal();
    if(x){}
    else{return;}
    x=x.childNodes[2].childNodes;
    for(let i=1;i<x.length;i++)
    {
        if(x[i].childNodes[2].childNodes[0].childNodes[0].classList[2]=='fa-check' || +x[i].childNodes[2].childNodes[0].childNodes[0].innerHTML>=val)
        {
            x[i].style.display=display;
        }
    }
}

function showAC()
{
    let x=document.getElementsByClassName('border table')[0];
    let val=getVal();
    if(x){}
    else{return;}
    x=x.childNodes[2].childNodes;
    for(let i=1;i<x.length;i++)
    {
        x[i].style.display='';
    }
}

(function() {
    'use strict';

    const observer=new MutationObserver(function(mutationsList,observer){
        if(document.getElementsByClassName('bottom-inner')[0].childNodes[0].innerText=="多选")
        {
            let e=document.createElement('a');
            e.setAttribute("href","javascript:void 0");
            e.setAttribute("colorscheme","default");
            e.setAttribute("class","color-default");
            function temp(){
                if(e.innerHTML=="隐藏已AC题目")
                {
                    e.innerHTML="显示已AC题目";
                    displayAC("none");
                }
                else
                {
                    e.innerHTML="隐藏已AC题目";
                    showAC();
                }
            }
            e.onclick=temp;
            e.innerHTML="隐藏已AC题目";
//            displayAC('none');
            let input=document.createElement('input');
            input.setAttribute('placeholder','隐藏下限');
            input.setAttribute('type','number');
            input.setAttribute('max','101');
            input.setAttribute('min','0');
            input.setAttribute('step','1');
            input.setAttribute('style','font-size: 15px;');
            input.style.width="75px";
            input.style.margin="5px";
            input.setAttribute('id','min-score');
            input.value=90;
            document.getElementsByClassName('bottom-inner')[0].childNodes[0].appendChild(e);
            document.getElementsByClassName('bottom-inner')[0].childNodes[0].appendChild(input);
            temp();
        }
    });
    observer.observe(document,{childList:true,subtree:true});
})();