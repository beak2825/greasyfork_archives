// ==UserScript==
// @name         TamperTube 📺
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Simple youtube downloader with a selfmade API ! 📺
// @author       vodkarm
// @run-at       document-end
// @match        *://*.youtube.com/watch?v=*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459671/TamperTube%20%F0%9F%93%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/459671/TamperTube%20%F0%9F%93%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // don't skid
    // author is vodkarm
    // github.com/vodkarm
    const el = document.createElement( 'div' );

    el.innerHTML = `<style>
@import url('https://fonts.googleapis.com/css2?family=Itim&display=swap');

h1 {
    font-size: 30px;
}

* {
    font-size: 15px;
}

.dialog {
    font-family: 'Itim', cursive;
	position: absolute;
	left: 50%;
	top: 50%;
	padding: 20px;
	background: rgba(0, 0, 0, 0.8);
	border: 6px solid rgba(0, 0, 0, 0.2);
	color: #fff;
	transform: translate(-50%, -50%);
	text-align: center;
	z-index: 999999;
	min-width: 400px;
	max-width: 700px;
}

.dialog * {
	color: #fff;
}

.close {
	position: absolute;
	right: 5px;
	top: 5px;
	width: 20px;
	height: 20px;
	opacity: 0.5;
	cursor: pointer;
}

.close:before, .close:after {
	content: ' ';
	position: absolute;
	left: 50%;
	top: 50%;
	width: 100%;
	height: 20%;
	transform: translate(-50%, -50%) rotate(-45deg);
	background: #fff;
}

.close:after {
	transform: translate(-50%, -50%) rotate(45deg);
}

.close:hover {
	opacity: 1;
}

.btn {
	cursor: pointer;
	padding: 1em;
	background: red;
	border: 3px solid rgba(0, 0, 0, 0.2);
	font-size: 1.2em;
	min-width: 150px;
}

.btn:active {
	transform: scale(0.8);
}

.msg {
	position: absolute;
	left: 10px;
	bottom: 10px;
	color: #fff;
	background: rgba(0, 0, 0, 0.6);
	font-weight: bolder;
	padding: 15px;
	animation: msg 0.5s forwards, msg 0.5s reverse forwards 3s;
	z-index: 999999;
	pointer-events: none;
}

</style>
<div class="msg" style="display: none;"></div>
<div class="dialog">
    <div class="close" onclick="this.parentNode.style.display='none';"></div>
	<h1>TamperTube 📺</h1>
    <br><br>
    #1 Free Youtube Downloader without ads ! 💪
    <br><br>
	<div style="display: grid; grid-template-columns: 1fr 1fr; grid-gap: 5px;">
		<div class="btn" onclick="alert('Loading of the page may be long if you are trying to download a long video, please be patient :)'); window.open('https://tampertube.vodkarm06.repl.co/mp4?url=${window.location.href}', '_blank');">📺 Download in MP4</div>
		<div class="btn" onclick="alert('Loading of the page may be long if you are trying to download a long video, please be patient :)'); window.open('https://tampertube.vodkarm06.repl.co/mp3?url=${window.location.href}', '_blank');">🔊 Download in MP3</div>
        <div class="btn" onclick="window.open('https://github.com/vodkarm', '_blank')">💻 Github</div>
        <div class="btn" onclick="window.open('https://t.me/vodkarm', '_blank')">💬 Contact</div>
	</div>
</div>`;
    const msgEl = el.querySelector( '.msg' );
    const dialogEl = el.querySelector( '.dialog' );

    while ( el.children.length > 0 ) {

        document.body.appendChild( el.children[ 0 ] );

    }
})();