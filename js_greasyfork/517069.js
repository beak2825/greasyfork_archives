// ==UserScript==
// @name         Bablo
// @namespace    http://tampermonkey.net/
// @version      2024-11-08
// @license      MIT
// @description  Knopka bablo
// @author       ChotkiiYT
// @match        https://zelenka.guru/*
// @match        https://lolz.live/*
// @match        https://lolz.guru/*
// @match        https://lolz.market/*
// @match        https://lzt.market/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517069/Bablo.user.js
// @updateURL https://update.greasyfork.org/scripts/517069/Bablo.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let modalId = 0;
    let per_sec = 10

    class LolzModal{
        constructor(name, html){
            modalId+=1;
            this.id = modalId;
            this.html = `<div class="fade in lztModal${this.id}" style="display: none; z-index: 10002; outline: none; background-color: rgb(0, 0, 0, 0.5);" data-z-index="0" tabindex="-1"><div class="xenOverlay __XenForoActivator lzt-fe-editorDialog" style="top: 10%;"><a class="close OverlayCloser lztModalClose${this.id}"></a><div><h2 class="heading h1">${name}</h2>
<form class="xenForm">
${html}
</form></div></div></div>`
            document.body.insertAdjacentHTML('beforeend', this.html);
            document.querySelector(`.lztModalClose${this.id}`).addEventListener("click", ()=>{
                console.log("[LolzOverlay] Close")
                this.close();
            })
        }
        open(){
            document.querySelector(`.lztModal${this.id}`).style.display = "flex";
            document.querySelector(`.lztModal${this.id}`).classList.add("modal")
        }
        close(){
            document.querySelector(`.lztModal${this.id}`).style.display = "none";
            document.querySelector(`.lztModal${this.id}`).classList.remove("modal")
        }

    }

    let old_el = document.querySelector("#AccountMenu > ul:nth-child(1) > li:nth-child(4)")
    let new_element = old_el.cloneNode(true);
    new_element.classList.add("bablo")
    new_element.querySelector("a").innerText = "Бабло"
    new_element.querySelector("a").removeAttribute("href")
    old_el.before(new_element)


    let modal = new LolzModal("Кнопка бабло by <a href='/web3'>ChotkiiYT</a>", `<dl class="ctrlUnit submitUnit">
    <dt>Введите количество бабла в секунду</dt>
		<dd>
			<input class="textCtrl" id="gondon">
		</dd>
	</dl>
	<dl class="ctrlUnit">
		<dt></dt>
		<dd>
			<button class="button primary" id="sex">
				Подтвердить
			</button>
		</dd>
	</dl>`);


    document.querySelector(".bablo").addEventListener("click", ()=>{
        let b = parseInt(document.querySelectorAll(".balanceValue")[document.querySelectorAll(".balanceValue").length-1].innerText)
        document.querySelectorAll(".balanceValue").forEach(
            (el)=>{
                setInterval(()=>{
                    el.innerText = `${b}`
                    b+=per_sec
                }, 100)

            }
        );
    });

    document.querySelector("#sex").addEventListener("click", (event) => {
        event.preventDefault();
        let inputValue = parseInt(document.querySelector("#gondon").value);
        if (!isNaN(inputValue)) {
            per_sec = parseInt(inputValue / 10);
            console.log(`New per_sec: ${per_sec}`);
            modal.close();
        } else {
            console.error("Invalid input value");
        }
    });

    document.querySelector(".bablo").addEventListener("contextmenu", (e)=>{
        e.preventDefault();
        modal.open()
    })
})();