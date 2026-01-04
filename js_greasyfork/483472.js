// ==UserScript==
// @name        MouseHunt Hide Sidebar
// @author      Elie
// @version    	1.02
// @description Hide right sidebar
// @icon        https://raw.githubusercontent.com/nobodyrandom/mhAutobot/master/resource/mice.png
// @require     https://code.jquery.com/jquery-2.2.2.min.js
// @require     https://greasyfork.org/scripts/7601-parse-db-min/code/Parse%20DB%20min.js?version=132819
// @require     https://greasyfork.org/scripts/16046-ocrad/code/OCRAD.js?version=100053
// @require     https://greasyfork.org/scripts/16036-mh-auto-kr-solver/code/MH%20Auto%20KR%20Solver.js?version=102270
// @namespace   https://greasyfork.org/en/users/440271
// @license 	GPL-3.0+; http://www.gnu.org/copyleft/gpl.html
// @match	    http://mousehuntgame.com/*
// @match		https://mousehuntgame.com/*
// @match		http://www.mousehuntgame.com/*
// @match		https://www.mousehuntgame.com/*
// @match       http://www.mousehuntgame.com/camp.php*
// @match       https://www.mousehuntgame.com/camp.php*
// @match		http://apps.facebook.com/mousehunt/*
// @match		https://apps.facebook.com/mousehunt/*
// @grant		unsafeWindow
// @grant		GM_info
// @run-at		document-end
// @downloadURL https://update.greasyfork.org/scripts/483472/MouseHunt%20Hide%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/483472/MouseHunt%20Hide%20Sidebar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setTimeout(function() {
        console.log(document.getElementsByClassName('pageSidebarView'));
        document.getElementsByClassName('pageSidebarView')[0].style.display='none';
        scrollTo(0,190);
    }, 5000);

})();