// ==UserScript==
// @name         best Telegram Spam app
// @version      4243
// @description  Spamming!
// @author       Chai Yu Jack
// @match       https://web.whatsapp.com/*
// @match       https://web.telegram.org/k/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/943182
// @downloadURL https://update.greasyfork.org/scripts/448967/best%20Telegram%20Spam%20app.user.js
// @updateURL https://update.greasyfork.org/scripts/448967/best%20Telegram%20Spam%20app.meta.js
// ==/UserScript==
(function() {
    'use strict';


    const v7snMenu = document.body.innerHTML += `
	<div class="v7sn-style">
		<p class="title">ㅤㅤSpam App  ㅤㅤㅤㅤmade by ㅤㅤchai yu jack</p>
		<input id="spam-number" placeholder="number of messages">
		<input id="type-message" placeholder="message">
	</div>
`

    const v7snContainer = document.querySelector(".v7sn-style");

    v7snContainer.addEventListener("mousedown", mousedown);

    function mousedown(e) {
        v7snContainer.addEventListener("mousemove", mousemove);
        v7snContainer.addEventListener("mouseup", mouseup);

        function mousemove(e) {
            var x = `${e.clientX - 100}px`;
            var y = `${e.clientY - 100}px`;
            this.style.left = x;
            this.style.top = y;
        }

        function mouseup(e) {
            v7snContainer.removeEventListener("mousemove", mousemove);
        }

    }


    document.getElementById('type-message').onkeyup = function(e) {
        const textBox = document.querySelector('.input-message-input');
        const spamNumber = document.getElementById('spam-number');
        const keyEvent = new KeyboardEvent('keydown', { key: "Enter"});

        if (e.keyCode === 13) {
            for (var i = 0; i < spamNumber.value; i++) {
                textBox.textContent += this.value;
                textBox.dispatchEvent(keyEvent);
                this.value = "";
            }
        }
    }

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle(`
	.v7sn-style {
		width: 200px;
		height: 200px;
		padding: 5px;
		background: #00957785;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		color: white;
		font-size: 20px;
		text-align: center;
		border-radius: 5px;
		position: fixed;
		top: 10px;
		left: 85%;
		z-index: 1;
        cursor: move;
	}

	.v7sn-style input {
		width: 90%;
		padding: 5px;
        color: #009578;
        background: white;
		font-size: 15px;
		text-align: center;
		align-self: center;
		border-radius: 5px;
		border: none;
		outline: none;
	}
    `);






















})();