// ==UserScript==
// @name         Daring Wider-ball
// @version      0.1
// @description  Make's Mr.Gruber's lovely blog and 80-column emulator of a site a bit wider.
// @author       Quentin Baker
// @match        https://daringfireball.net/*
// @grant        GM_addStyle
// @run-at document-start
// @namespace https://greasyfork.org/users/563976
// @downloadURL https://update.greasyfork.org/scripts/403495/Daring%20Wider-ball.user.js
// @updateURL https://update.greasyfork.org/scripts/403495/Daring%20Wider-ball.meta.js
// ==/UserScript==

GM_addStyle ( `
    #Box {
	width: 1280px !important;
	}
    #Main {
	width: 1280px !important;
	}

` );