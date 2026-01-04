// ==UserScript==
// @name         Fanfou Clear Style
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  饭否干净脚本，仅留下发布框及一些按钮
// @author       LyiHsin
// @match        https://www.fanfou.com/home
// @match        https://fanfou.com/home
// @match        https://fanfou.com/
// @match        http://fanfou.com/home
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/418315/Fanfou%20Clear%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/418315/Fanfou%20Clear%20Style.meta.js
// ==/UserScript==
(function() {

    'use strict';

    var content = document.getElementById('content');
    content.parentNode.removeChild(content);

    var friends = document.getElementById('friends');
    friends.parentNode.removeChild(friends);

    var reminder = document.getElementById('reminder');
    reminder.parentNode.removeChild(reminder);

    var user_stats = document.getElementById('user_stats');
    user_stats.parentNode.removeChild(user_stats);

    var goodapp = document.getElementById('goodapp');
    goodapp.parentNode.removeChild(goodapp);

    var navtabs_home = document.getElementById('navtabs');
    navtabs_home.parentNode.removeChild(navtabs_home);

    var tmp = document.getElementsByClassName('global-header-anchor')[0];
    if (tmp){
        tmp.parentNode.removeChild(tmp);
    }

    tmp = document.getElementById('footer');
    if (tmp){
        tmp.parentNode.removeChild(tmp);
    }

    var sect = document.getElementsByClassName('sect')[0];

    if (sect) {
        sect.parentNode.removeChild(sect);
    }

    var textarea = document.getElementsByTagName('textarea')[1];
	if (!textarea) { return; }

    //textarea.style.height = '5em';
    textarea.click();


	//style.innerHTML = 'hveight: 4.6em; border-color: rgb(125, 198, 221);';

})();