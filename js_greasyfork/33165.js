// ==UserScript==
// @name         MediaKlikk - lejátszó
// @namespace    
// @version      0.1
// @description  Margók
// @author       vacsati
// @match        https://player.mediaklikk.hu/playernew/player.php?video=*
// @grant        none
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/33165/MediaKlikk%20-%20lej%C3%A1tsz%C3%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/33165/MediaKlikk%20-%20lej%C3%A1tsz%C3%B3.meta.js
// ==/UserScript==

console.log('MediaKlikk - lejátszó');
$('body').css({'padding' : '0', 'margin' : '0', 'overflow': 'hidden'});
