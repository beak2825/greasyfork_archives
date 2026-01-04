// ==UserScript==
// @name         Auto Click
// @namespace    https://brucekong.com/
// @version      0.1
// @description  auto click to continue learn
// @author       BK
// @match        https://edu.inspur.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/444810/Auto%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/444810/Auto%20Click.meta.js
// ==/UserScript==

(function() {
    'use strict';
	let autoClick = function(id) {
		let inter = setInterval(e => {
			if (document.getElementById(id)) {
                window.myMousedown = !0
                setTimeout(function(e) {
                    typeof window.removeWarningHtml === 'function' && window.removeWarningHtml()
                }, 500)

                if ("VideoKnowledge" == window.knowledgeType && void 0 !== window.myPlayer && "playing" == window.myPlayer.getState()) {
                    window.myPlayer.pause()
                }else {
                    clearInterval(window.timer)
                }
			}
		}, 1000 * 2)
	}

	autoClick('reStartStudy')
})();