// ==UserScript==
// @name         LiaoXueFeng
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.liaoxuefeng.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389284/LiaoXueFeng.user.js
// @updateURL https://update.greasyfork.org/scripts/389284/LiaoXueFeng.meta.js
// ==/UserScript==

//(function(){
    let flag = 0
    let aNode = document.querySelector('.uk-nav-side');
    let toggle = document.createElement('button')
    toggle.innerHTML = "Toggle";
    toggle.style.background = "black";
    toggle.style.color = "white";
    toggle.style.display = "inline-block";
    toggle.style.width = "100px";
    toggle.style.textAlign = "center";
    toggle.style.transform = "translateY(-50%)";
    aNode.append(toggle);
	var navNode = document.getElementById('header');
	navNode.style.display = "none";
    var sonsorDiv = document.getElementById("sponsor-b");
	sonsorDiv.style.display = "none";
    var sonsoraDiv = document.getElementById("sponsor-a");
	sonsoraDiv.style.display = "none";
    toggle.onclick = ()=>{
        if(!flag){
            navNode.style.display = "block"
            flag = 1
        }else{
            navNode.style.display = "none"
            flag = 0
        }
    }
//})()