// ==UserScript==
// @name         Hide MV User
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  La tranquilidad es lo que mas se valora
// @author       KarlosWins
// @match        https://www.mediavida.com/foro/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407118/Hide%20MV%20User.user.js
// @updateURL https://update.greasyfork.org/scripts/407118/Hide%20MV%20User.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var x = document.getElementsByClassName("cf post");
    const users = ['Gerardos','Pobre_Chico'];
    for (var i = 0; i < x.length; i++) {
        if (users.includes(x[i].dataset.autor)) {
            let postNumber = x[i].dataset.num;
            var hiddenGroup = document.createElement("div");
            hiddenGroup.classList.add("moderated-group");
            var a = $('<a name="'+i+1+'" class="name-pad"></a>');
            var hiddenPostCard = $('<div class="post info"><div class="post-meta"><a href="#'+postNumber+'" class="qn">#'+postNumber+'</a><div class="post-body"><div class="locked-msg"><a class="post-btn hiddenmsg" href="#post-'+postNumber+'"><i class="fa fa-flag"></i> Has ocultado este post de <b>'+x[i].dataset.autor+'</b>. Pulsa para mostrar el post</a></div></div></div></div>');
           x[i].classList.add('locked');
           $(hiddenGroup).append(a);
           $(hiddenGroup).append(hiddenPostCard);
           $(hiddenGroup).insertBefore(x[i]);
       }
    }
})();