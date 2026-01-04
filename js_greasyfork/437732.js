// ==UserScript==
// @name         [蓝墨云] 重做单选和多选
// @namespace    ckylin-script-mosoteach-redochoices
// @version      0.4
// @description  显示正确的选项方便复习
// @author       CKylinMC
// @match        https://www.mosoteach.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437732/%5B%E8%93%9D%E5%A2%A8%E4%BA%91%5D%20%E9%87%8D%E5%81%9A%E5%8D%95%E9%80%89%E5%92%8C%E5%A4%9A%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/437732/%5B%E8%93%9D%E5%A2%A8%E4%BA%91%5D%20%E9%87%8D%E5%81%9A%E5%8D%95%E9%80%89%E5%92%8C%E5%A4%9A%E9%80%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let highlighted = false;
	const get = (q,p=document.body) => p.querySelector(q);
	const getAll = (q,p=document.body) => p.querySelectorAll(q);
    function highlightCurrectAnswers(){
        if(highlighted) return; else highlighted = true;
        const list = get(".main-box .topic-list");
        const items = getAll(".topic-item",list);
        const ansMap = ['A','B','C','D','E','F','G','H','I','J','K'];
        for(let it of items){
            try{
				const flag = get(".t-flag",it);
				if(flag){
					flag.className = "t-flag";
				}
				const choicesContainer = get(".t-option.t-item",it);
                const choices = [...getAll(".t-option.t-item>.opt",it)];
                const currect = get(".t-answer.t-item>.answer-l>.light",it);
                const answers = currect.innerHTML.trim().split('');
                const indexes = [];
                for(let ans of answers){
                    let ind = ansMap.indexOf(ans.toUpperCase());
                    if(ind>=0 && !indexes.includes(ind)) indexes.push(ind);
                }
                choicesContainer.setAttribute("data-answer-info",JSON.stringify({
					"answers": indexes,
					"answered": [],
					"wronged": false,
					"lock": false
                }))
                choices.forEach((el,ind)=>{
					el.setAttribute("data-answer-index",ind);
					el.style.fontSize = "larger";
					el.style.cursor = "pointer"
					el.classList.add("hl-hover");
                    if(!indexes.includes(ind)){
                        //el.style.opacity = ".1";
                        //el.style.fontSize = "smaller";
                        el.setAttribute("data-answer-currect","no")
                    }else{
                        //el.style.fontSize = "larger";
                        el.setAttribute("data-answer-currect","yes")
                    }
                    el.onclick = optionClickCallback;
                })
            }catch(Exception){}
        }
    }

    function optionClickCallback(e){
		let current = e.target;
		if(current.classList.contains("opt-content")) current = current.parentNode;
		const parent = current.parentNode;
		const container = parent.parentNode.parentNode.parentNode;
        const answerEl = get(".t-answer.t-item",container);
		const flag = get(".t-flag",container);
		const ind = parseInt(current.getAttribute("data-answer-index"));
		const info = JSON.parse(parent.getAttribute("data-answer-info"));
		if(info.lock) return;
		if(current.getAttribute("data-answer-currect")=="yes"){
			current.classList.add("hl-true");
			if(!info.answered.includes(ind)){
				info.answered.push(ind);
			}
		}else{
			current.classList.add("hl-false");
			info.wronged = true;
            answerEl.style.display = "block";
		}
		if(info.wronged) {
			parent.previousElementSibling.style.color = "red";
			flag.classList.add("t-flag-wrong");
                let ico = get(".flag-icon",flag);
                ico.className = "flag-icon el-icon-close";
		}
		if(info.answered.length==info.answers.length) {
			if(!info.wronged){
				parent.previousElementSibling.style.color = "darkgreen";
				flag.classList.add("t-flag-right");
                let ico = get(".flag-icon",flag);
                ico.className = "flag-icon el-icon-check";
			}
			info.lock = true;
		}
		parent.setAttribute("data-answer-info",JSON.stringify(info));
    }

    function customcss(yes=true){
        const old = document.querySelector("#rdcustomcss");
        old&&old.remove();
        if(yes){
            const css = document.createElement("style");
            css.appendChild(document.createTextNode(`
            .hl-hover:hover{
				background: antiquewhite;
            }
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
            .t-answer.t-item,.answer-r{
              display:none;
            }
            .hl-true{
				color: blue!important;
            }
            .hl-false{
				color: red!important;
            }
            `));
            css.id = "rdcustomcss";
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