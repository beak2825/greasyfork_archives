// ==UserScript==
// @name         [蓝墨云] 复习时高亮显示正确的选项
// @namespace    ckylin-script-mosoteach-showsinglecurrectanswer
// @version      0.4
// @description  显示正确的选项方便复习
// @author       CKylinMC
// @match        https://www.mosoteach.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437726/%5B%E8%93%9D%E5%A2%A8%E4%BA%91%5D%20%E5%A4%8D%E4%B9%A0%E6%97%B6%E9%AB%98%E4%BA%AE%E6%98%BE%E7%A4%BA%E6%AD%A3%E7%A1%AE%E7%9A%84%E9%80%89%E9%A1%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/437726/%5B%E8%93%9D%E5%A2%A8%E4%BA%91%5D%20%E5%A4%8D%E4%B9%A0%E6%97%B6%E9%AB%98%E4%BA%AE%E6%98%BE%E7%A4%BA%E6%AD%A3%E7%A1%AE%E7%9A%84%E9%80%89%E9%A1%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let highlighted = false;
    function highlightCurrectAnswers(){
        if(highlighted) return; else highlighted = true;
        const get = (q,p=document.body) => p.querySelector(q);
        const getAll = (q,p=document.body) => p.querySelectorAll(q);
        const list = get(".main-box .topic-list");
        const items = getAll(".topic-item",list);
        const ansMap = ['A','B','C','D','E','F','G','H','I','J','K'];
        for(let it of items){
            try{
                const choices = [...getAll(".t-option.t-item>.opt",it)];
                const currect = get(".t-answer.t-item>.answer-l>.light",it);
                const answers = currect.innerHTML.trim().split('');
                const indexes = [];
                for(let ans of answers){
                    let ind = ansMap.indexOf(ans.toUpperCase());
                    if(ind>=0 && !indexes.includes(ind)) indexes.push(ind);
                }
                choices.forEach((el,ind)=>{
                    if(!indexes.includes(ind)){
                        el.style.opacity = ".1";
                        el.style.fontSize = "smaller";
                    }else{
                        el.style.fontSize = "larger";
                    }
                })
            }catch(Exception){}
        }
    }

    function customcss(yes=true){
        const old = document.querySelector("#notbottomcss");
        old&&old.remove();
        if(yes){
            const css = document.createElement("style");
            css.appendChild(document.createTextNode(`
            .t-con>.t-info.t-item{
              display:none !important;
            }
            .t-con>.t-subject{
              font-weight:bold !important;
              font-size:large !important;
            }
            .t-bottom{
              display:none !important;
            }
            .t-top{
              padding-bottom: 20px !important;
            }
            `));
            css.id = "notbottomcss";
            document.body.appendChild(css);
        }
    }

    function isContentReady(){
        return document.querySelector(".topic-list")!==null;
    }

    let timer = null;
    function loader(){
        if(!isContentReady()){
            if(timer===null){
                timer = setInterval(loader,200);
            }else{
                console.log("Waiting...");
            }
        }else{
            clearInterval(timer);
            customcss();
            highlightCurrectAnswers();
        }
    }
    if(document.title.indexOf("查看个人解析")>=0)loader();
})();