// ==UserScript==
// @name         Tăng tốc nhận EXP cho tutientruyen
// @namespace    https://gist.github.com/renzynx/23af8aadf885e26ed4b072fc3eb68e2f
// @version      0.0.1
// @description  Bỏ qua 30s chờ để +1 EXP trên tutientruyen, thay vào đó là mỗi 3s bạn sẽ được +1 EXP
// @author       renynx
// @match        https://tutientruyen.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tutientruyen.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485946/T%C4%83ng%20t%E1%BB%91c%20nh%E1%BA%ADn%20EXP%20cho%20tutientruyen.user.js
// @updateURL https://update.greasyfork.org/scripts/485946/T%C4%83ng%20t%E1%BB%91c%20nh%E1%BA%ADn%20EXP%20cho%20tutientruyen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var script = document.createElement('script');
    script.type = "text/javascript";
    script.innerHTML =`
    if (!chapterId) return;

    timeleft = 1

    setInterval(async () => {
	    timeleft = 1;
	    document.cookie = "chapter_lv_${chapterId}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

	    await fetch(window.location.href)
		    .then(() => updatePoint(${chapterId}))

    }, 2000);

    `
    document.getElementsByTagName('head')[0].appendChild(script);
})();