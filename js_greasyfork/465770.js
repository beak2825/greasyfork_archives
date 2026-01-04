// ==UserScript==
// @name         Back to the top
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  In any web page shows a button back to the top
// @author       槐序十六
// @match        ://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465770/Back%20to%20the%20top.user.js
// @updateURL https://update.greasyfork.org/scripts/465770/Back%20to%20the%20top.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var topdiv = document.createElement("div");

    //为div创建class属性
    var divattr = document.createAttribute("id");
    divattr.value = "suspension-panel-huaixu";
    //把属性添加到div
    topdiv.setAttributeNode(divattr);

    document.getElementsByTagName('body')[0].appendChild(topdiv);
    document.getElementById("suspension-panel-huaixu").style = `
        display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		position: fixed;
		right: 2rem;
		bottom: 2rem;
		z-index: 1000;
    `

    var css_totopxu = `
	    display: none;
		margin: 1rem 0 0;
		padding: 0;
		width: 39.95px;
		height: 39.95px;
		line-height: 1;
		color: #909090;
		background-color: #fff;
		border: 1px solid #f1f1f1;
		border-radius: 50%;
		box-shadow: 0 2px 8px rgba(50,50,50,.04);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
    `
    document.getElementById("suspension-panel-huaixu").innerHTML = `<button title="回到顶部" id="totopxu" style="${css_totopxu}">
    	<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    		<path fill-rule="evenodd" clip-rule="evenodd" d="M2.75 1C2.33579 1 2 1.33579 2 1.75C2 2.16421 2.33579 2.5 2.75 2.5H13.25C13.6642 2.5 14 2.16421 14 1.75C14 1.33579 13.6642 1 13.25 1H2.75ZM7.24407 3.87287C7.64284 3.41241 8.35716 3.41241 8.75593 3.87287L13.0622 8.84535C13.6231 9.49299 13.163 10.5 12.3063 10.5H10V14C10 14.5523 9.55228 15 9 15H7C6.44772 15 6 14.5523 6 14V10.5H3.69371C2.83696 10.5 2.37691 9.49299 2.93778 8.84535L7.24407 3.87287Z" fill="#8A919F"></path>
    	</svg>
    </button>`

    var totopxu = document.getElementById("totopxu")
    totopxu.style.display = "none"

    window.onscroll = function() {
        var top = document.documentElement.scrollTop || document.body.scrollTop;
        if( top >= 300 ) {
            totopxu.style.display = "flex"
        } else {
            totopxu.style.display = "none"
        }
    }

    var intervalTimer = null;
    topdiv.onclick = function() {
        intervalTimer = setInterval(function() {
            var top = document.documentElement.scrollTop || document.body.scrollTop;
            top -= 1000;
            if (top > 0) {
                window.scrollTo(0, top);
            } else {
                window.scrollTo(0, 0);
                clearInterval(intervalTimer);
            }
        } , 1);
    }
})();