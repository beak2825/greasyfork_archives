// ==UserScript==
// @name         e-hentai favorite alias
// @name-zh         e-hentai 收藏夹别名
// @namespace   e-hentai favorite alias_script
// @version      0.1
// @author       neysummer2000
// @match        https://e-hentai.org/gallerypopups.php?gid=*&t=*&act=addfav
// @match        https://e-hentai.org/favorites.php*
// @grant        none
// @description qwq
// @downloadURL https://update.greasyfork.org/scripts/418873/e-hentai%20favorite%20alias.user.js
// @updateURL https://update.greasyfork.org/scripts/418873/e-hentai%20favorite%20alias.meta.js
// ==/UserScript==

(function() {
    var g_a_names = [
        '画师集',  // 1
        '学习资料', // 2
        '口工', // 3
        '', // 4
        '', // 5
        '', // 6
        '', // 7
        '', // 8
        '', // 9
        '', // 10
    ];
    var i = 0, e;
    var fav = document.querySelectorAll('.nosel');
    var favs = fav[fav.length-1].children;
    for(var name of g_a_names){
        if(name != ''){
            //e = document.createElement('span');
            //e.innerText =  ' (' + name + ')';
            //favs[i].children[2].appendChild(e);
            favs[i].children[2].innerText = name;
        }
        i++;
    };
})();