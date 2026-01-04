// ==UserScript==
// @name         jiuyan
// @namespace    http://tampermonkey.net/
// @version      v6
// @description  jiuyan1
// @author       dave
// @match        https://www.jiuyangongshe.com/action
// @match        https://www.jiuyangongshe.com/action/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jiuyangongshe.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524709/jiuyan.user.js
// @updateURL https://update.greasyfork.org/scripts/524709/jiuyan.meta.js
// ==/UserScript==

(function() {
    'use strict';
     let toggle = document.createElement('myButton')
     toggle.innerHTML = "Toggle"
     toggle.className = "Button"
     toggle.style.position = "fixed"
     toggle.style.display = "inline-block";
     toggle.style.padding = '10px 26px';
     toggle.style.zIndex = '100';
     toggle.style.right = '20px';
     toggle.style.top = '50%';
     toggle.style.opacity = '0.33';
     toggle.style.transform = 'translateY(-50%)';
     toggle.style.userSelect = 'none'
    document.body.append(toggle)

    toggle.addEventListener('mouseover', (event)=>{
        event.target.style.opacity = '1';
        event.target.style.background = 'black';
        event.target.style.color = 'white';
    })

    toggle.addEventListener('mouseout', (event)=>{
        event.target.style.opacity = '0.33';
        event.target.style.background = 'white';
        event.target.style.color = 'black';
    })

    toggle.onclick = () => {
        run()
    }

    function run(){

		const ulElem = document.querySelector('.module-box.jc0');
		const ali = document.querySelectorAll("li.module");
		let ct = '';

		ali.forEach((moduleItem) => {
			const sortBoxes = moduleItem.querySelectorAll(".sort-box");
			sortBoxes.forEach((sortBox) => {
                // 板块
				ct += "<br><strong style='font-size:12px; color: #0070C0'>" + sortBox.innerText.replaceAll('\n', '-') + "</strong><br>";
				const rows = moduleItem.querySelectorAll(".row.drvi.straight-line");
				rows.forEach((row) => {
					const name = row.querySelector(".shrink.fs15-bold")?.innerText || "未知名称";
					const text = row.querySelector(".hsh-flex-many-center.td > .sort")?.innerText;
                    const ban = text ? `<span style="color:red">${text}</span>` : '<span style="color:gray">无</span>'; // 或其他颜色
					ct += "<span style='font-size:9.2px'>>" + name + "--" + ban + "</span></br>";
				});
			});
		});
		let b = document.querySelector('.asideStyle.mb14')
        b.innerHTML = ct
        ulElem.addEventListener("click", run)
    }


})();