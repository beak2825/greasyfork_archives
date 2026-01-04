// ==UserScript==
// @name         FXP - Buddylist Fix
// @namespace    http://www.pnx.co.il/
// @version      0.1
// @description  display color n' avatar
// @author       pnx <pa0neix@gmail.com>
// @match        https://www.fxp.co.il/profile.php?do=buddylist*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406827/FXP%20-%20Buddylist%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/406827/FXP%20-%20Buddylist%20Fix.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    var x = document.createElement('style');
    x.innerHTML = 'ul.userlist_showavatars img { width: 30% }';
    document.head.append(x);

    document.querySelectorAll('.userlist>li').forEach(function(e) {
        var id = e.id.replace(/\D/g,'');
        console.log(id);
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://www.fxp.co.il/member.php?u='+id, true);
        xhr.responseType = 'document';
        xhr.onreadystatechange = function() {
            if(xhr.readyState != 4 || xhr.status != 200) return;
            e.querySelector('img').src = xhr.responseXML.querySelector('.avatarcontainer>img').src;
            e.querySelector('.buddylist_details>a').classList = xhr.responseXML.querySelector('.member_username>span').classList;
        }
        xhr.send();
    });
});