// ==UserScript==
// @name       Remove anime in TF2r
// @version    1.0
// @description One of the best scripts I've ever made. Replaces everyone's avatars with tf2 default avatars, and you can use it as a framework for other "replace everyone's avatars" scripts
// @namespace  http://niceme.me/
// @include    http://tf2r.com/chat.html
// @include    http://tf2r.com/user/*
// @include    http://tf2r.com/k*
// @copyright  2014+, Gus and wiki.teamfortress for the pictures
// @downloadURL https://update.greasyfork.org/scripts/10429/Remove%20anime%20in%20TF2r.user.js
// @updateURL https://update.greasyfork.org/scripts/10429/Remove%20anime%20in%20TF2r.meta.js
// ==/UserScript==

    avatars = ["6/67/Scoutava.jpg", "f/f2/Soldierava.jpg", "4/4a/Pyroava.jpg",
               "4/4b/Demomanava.jpg", "5/5e/Heavyava.jpg", "e/e6/Engineerava.jpg",
               "7/7f/Medicava.jpg", "4/44/Sniperava.jpg", "3/37/Spyava.jpg",
               
               "3/3f/Buffed_blu_scout.jpg", "5/57/Buffed_blu_soldier.jpg", "f/f0/Buffed_blu_pyro.jpg",
               "0/0a/Buffed_blu_demoman.jpg", "5/5e/Buffed_blu_heavy.jpg", "a/a5/Buffed_blu_engineer.jpg",
               "a/a9/Buffed_blu_medic.jpg", "3/38/Buffed_blu_sniper.jpg", "d/db/Buffed_blu_spy.jpg",
               
               "e/e3/Buffed_red_scout.jpg", "6/66/Buffed_red_soldier.jpg", "b/ba/Buffed_red_pyro.jpg",
               "4/4a/Buffed_red_demoman.jpg", "d/da/Buffed_red_heavy.jpg", "7/76/Buffed_red_engineer.jpg",
               "c/c6/Buffed_red_medic.jpg", "f/f6/Buffed_red_sniper.jpg", "e/eb/Buffed_red_spy.jpg"];

window.setInterval(function() {
    $(".ufavatar").each(function(){
        avatarNum = parseInt($(this).find('a').attr('href').replace(/[^\d]/g, "")) % 27;
        replaceUrl = 'http://wiki.teamfortress.com/w/images/' + avatars[avatarNum];
        replaceText = "<img src=\'" + replaceUrl + "\' width=\'32\' height=\'32\'>";
        avatarUrl = $(this).find('img').attr('src');
        if (avatarUrl != replaceUrl) {
            $(this).find('img').replaceWith(replaceText);
        } else {
            return false;
        };
    });
}, 1000); // Increase this if your performance drops
