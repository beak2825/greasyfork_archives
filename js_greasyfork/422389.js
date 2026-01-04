// ==UserScript==
// @name         NTHU Course Selecting Helper
// @namespace    mailto:a91082900@gmail.com
// @version      1.1
// @description  some extra features for NTHU course selection
// @author       a91082900
// @match        https://www.ccxp.nthu.edu.tw/ccxp/COURSE/JH/7/7.2/7.2.7/JH727002.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422389/NTHU%20Course%20Selecting%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/422389/NTHU%20Course%20Selecting%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var tbody = document.querySelectorAll("table")[1].children[1];
    var arr = Array.from(tbody.children);

    var win = document.createElement("div");
    win.style.position = "absolute";
    win.style.width = "150px";
    win.style.height = "70px";
    win.style.lineHeight = "70px";
    win.style.textAlign = "center";
    win.style.border = "solid";
    win.style.borderColor = "cyan";
    win.style.background = "white";
    win.style.display = "none";
    document.body.appendChild(win);

    arr.forEach(function(tr) {

        var l = tr.childElementCount;
        var p = 0;
        var totalQuota = tr.children[l-4].innerText.split('/');
        var remain = parseInt(tr.children[l-2].innerText);
        var waiting = parseInt(tr.children[l-1].innerText);
        if(totalQuota.length > 1) { // freshmen only
            remain -= parseInt(totalQuota[1]);
            tr.children[l-2].innerHTML = `<div align="center">` + tr.children[l-2].innerText + "/" + remain.toString() + `</div>`;
        }
        if(remain > 0) {
            tr.bgColor = "yellow";
            if(remain - waiting > 0) {
                tr.children[l-1].bgColor = "orange";
                p = 100;
            }
            else {
                p = Math.round((remain / waiting) * 10000) / 100;
            }
        }

        tr.onmouseenter = function() {
            win.style.display = "";
            win.style.left = event.pageX;
            win.style.top = event.pageY;
            win.innerText = "中選率：" + p + "%";
            //console.log("enter");
        };
        tr.onmouseleave = function() {
            win.style.display = "none";
            //console.log("leave");
        };
        /*tr.onmousemove = function(event) {
            win.style.left = event.pageX;
            win.style.top = event.pageY;
            //console.log("move");
        };*/
    });

	var inputText = document.createElement("input");
	var inputButton = document.createElement("input");
	inputButton.type = "button";
	inputButton.value = "篩選時段";
	inputButton.onclick = function() {
		arr.forEach(function(tr) {
			var l = tr.childElementCount;
			var isValid = true;
			var courseTime = tr.children[l-5].innerText;

			for(var i = 0; i < courseTime.length-1; i+=2) {
				if(!inputText.value.includes(courseTime.substr(i, 2))) {
					isValid = false;
					break;
				}
			}
			if(inputText.value && !isValid) {
				tr.style.display = "none";
				//console.log(tr.children[1].innerText);
			}
			else {
				tr.style.display = "";
			}
		});
	};
	var form = document.querySelector("form");
	form.insertBefore(inputButton, tbody.parentElement);
	form.insertBefore(inputText, inputButton);
})();