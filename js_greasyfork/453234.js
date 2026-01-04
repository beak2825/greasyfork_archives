// ==UserScript==
// @name         	YouTube Magic Actions
// @namespace    	https://greasyfork.org/users/928242
// @version      	1.0
// @description  	Centers the Menu to the Bottom of window as sticky and decrease the size
// @author       	Kamikaze (https://github.com/Kamiikaze)
// @supportURL      https://github.com/Kamiikaze/Tampermonkey/issues
// @match        	https://www.youtube.com/watch?v=*
// @icon         	https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        	none
// @license      	MIT
// @downloadURL https://update.greasyfork.org/scripts/453234/YouTube%20Magic%20Actions.user.js
// @updateURL https://update.greasyfork.org/scripts/453234/YouTube%20Magic%20Actions.meta.js
// ==/UserScript==

function GM_addStyle(css) {
	var head, style;
	head = document.getElementsByTagName('head')[0];
	if (!head) { return; }
	style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css.replace(/;/g, ' !important;');
	head.appendChild(style);
}

GM_addStyle(`
#watch7-content {
    height: 40px;
    width: 700px;
    max-width: 50%;
    margin: 0 auto;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9999;
}

#watch7-content span {
    position: sticky;
    bottom: 0;
}

`);