// ==UserScript==
// @name        Note.ms Skin for GetNote
// @namespace   ect.fyi
// @match       *://getnote.top/*
// @grant       none
// @run-at      document-idle
// @version     1.0.1
// @author      Ect07
// @license     MIT
// @description Bring your familiar feeling to getnote.top.
// @downloadURL https://update.greasyfork.org/scripts/489070/Notems%20Skin%20for%20GetNote.user.js
// @updateURL https://update.greasyfork.org/scripts/489070/Notems%20Skin%20for%20GetNote.meta.js
// ==/UserScript==
const text = document.getElementById("content").value;
const page = decodeURIComponent(window.location.pathname.substring(1));

const notems_page = `<head>
<meta charset="utf-8" />
<meta name="theme-color" content="#ebeef2" />
<title>${page}</title>
<meta name="HandheldFriendly" content="True">
<meta name="MobileOptimized" content="320">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui, viewport-fit=cover">
<meta name="format-detection" content="telephone=no" />
<style>
body {
    background: #ebeef2;
    font-family: Helvetica, Tahoma, Arial, STXihei, 华文细黑, microsoft yahei, 微软雅黑, SimSun, 宋体, Heiti, 黑体, sans-serif;
    font-size: 15px
}

textarea {
    font-family: Helvetica,Tahoma,Arial,STXihei,华文细黑,microsoft yahei,微软雅黑,SimSun,宋体,Heiti,黑体,sans-serif;
    font-size: 15px;
    line-height: 1.15;
    margin: 0
}

.stack {
    position: fixed;
    left: 1em;
    top: 1em;
    right: 1em;
    bottom: 1.8em
}

.layer {
    position: absolute;
    left: -3px;
    right: -3px;
    top: -3px;
    bottom: 1px;
    background-color: #fff;
    border-radius: 3.456789px;
    border: 1px solid #ddd;
    box-shadow: 0 0 5px 0 #e4e4e4
}

.flag {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 1em;
    height: .8em;
    text-align: center;
    color: #aaa;
    font-size: 14px
}

a:link,
a:visited,
a:active {
    color: #aaa;
    text-decoration: none;
    word-break: break-all;
    -webkit-tap-highlight-color: transparent
}

*:focus {
    outline: none
}

#content {
    width: 100%;
    height: 100%;
    min-height: 100%;
    resize: none;
    overflow-y: auto;
    border-radius: 3px;
    box-sizing: border-box;
    border: none;
    padding: .7em .8em;
    color: #333;
    font-size: 1.1em
}

#printable {
    display: none
}

@media print {

    .container,
    .stack,
    .layer,
    .flag {
        display: none
    }

    #printable {
        display: block
    }

}
</style>
</head>
<body>
<div class="stack">
<div class="layer">
<div class="layer">
<div class="layer">
<textarea id="content">${text}</textarea>
</div>
</div>
</div>
<div class="flag">
<a href="https://getnote.top/">GetNote</a>/${page} </div>
</div>
<pre id="printable"></pre>
</body>`;

// https://getnote.top/script.js
function uploadContent() {

    if (content !== textarea.value) {

        var temp = textarea.value;
        var request = new XMLHttpRequest();
        request.open('POST', window.location.href, true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

        request.onload = function() {

            if (request.readyState === 4) {

                content = temp;
                setTimeout(uploadContent, 1000);
            }
        }

        request.onerror = function() {

            setTimeout(uploadContent, 1000);
        }

        request.send('t=' + encodeURIComponent(temp));

        printable.removeChild(printable.firstChild);
        printable.appendChild(document.createTextNode(temp));
    }
    else {

        setTimeout(uploadContent, 1000);
    }
}

document.querySelector("html").innerHTML = notems_page;

var textarea = document.getElementById('content');
var printable = document.getElementById('printable');
var content = textarea.value;

printable.appendChild(document.createTextNode(content));

textarea.onkeydown = function(e) {
    if (e.keyCode === 9 || e.which === 9) {
        e.preventDefault();
        var s = this.selectionStart;
        this.value = this.value.substring(0, this.selectionStart) + '\t' + this.value.substring(this.selectionEnd);
        this.selectionEnd = s + 1;
    }
}

textarea.focus();

uploadContent();