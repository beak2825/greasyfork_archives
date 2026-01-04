// ==UserScript==
// @name         Faster
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Zoupers
// @match        *://*.bilibili.com/video/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT2.0
// @downloadURL https://update.greasyfork.org/scripts/395304/Faster.user.js
// @updateURL https://update.greasyfork.org/scripts/395304/Faster.meta.js
// ==/UserScript==

(function() {
    var body = document.getElementsByTagName("body")[0]
    var div = document.createElement("div")
    div.className = "just-for-faster"
    body.appendChild(div)
    var text = document.createElement("div")
    text.className = "just-for-faster-text"
    div.appendChild(text)
    var show = document.createElement("show")
    show.className = "just-for-faster-show"
    div.appendChild(show)
    var justVideo
    function f(){
        justVideo = document.getElementsByTagName("video")[0];
        var rate = this.getAttribute("value")
        $('video')[0].playbackRate = rate;
        // justVideo.setAttribute("playbackRate", rate)
        console.log("change Rate to ", rate)
    }
    var tmp
    for(let i = 1;i < 6; i++){
        tmp = document.createElement("div")
        text.appendChild(tmp)
        tmp.className = "just-for-faster-switch"
        tmp.setAttribute("value", i.toString())
        tmp.innerText = i
        tmp.onclick = f;
    }
    let style = document.createElement("style")
    body.appendChild(style)
    style.appendChild(document.createTextNode(`
.just-for-faster{
background-color: cadetblue;
position: absolute;
display: block;
top: 200px;
left: -80px;
width: 100px;
height: 50px;
}

.just-for-faster:hover{
left: 0;
}

.just-for-faster-show{
background: red;
height: 50px;
width: 20px;
float: right;
}

.just-for-faster-text{
float: left;
width: 79px;
height: 50px;
}

.just-for-faster-switch{
font-size: 15px;
width: 15px;
display: inline-block;
cursor: pointer;
text-decoration: none;
}`))
})();