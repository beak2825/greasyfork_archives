// ==UserScript==
// @name       TF2R Spookoween
// @version    2014
// @description Changes everyone's avatars to skemeletons (or pumpkins if you're a dork) and more!
// @namespace  http://niceme.me/
// @include    http://tf2r.com/chat.html
// @include    http://tf2r.com/user/*
// @include    http://tf2r.com/k*
// @copyright  2014+, Gus and the skeleton living inside Gus
// @downloadURL https://update.greasyfork.org/scripts/10427/TF2R%20Spookoween.user.js
// @updateURL https://update.greasyfork.org/scripts/10427/TF2R%20Spookoween.meta.js
// ==/UserScript==
    changeRankColorsToo = false; // set this to false if you're a fag

    avatars = ["qLZagZM","At2czog","mlVvyJP","MZ1qjci","G5yTJjj",
               "qIJ2w3x","Yhv7LH0","Z4s6SSh","AVM1gdk","sqTcqwF",
               "1z33hg7","kLRxDTp","ssaFeTY","snlG2DE","fQwKlfh",
               "dUyMONf","lTWHFTZ","Cb6JcnL","RmSat2s","CrpgU1B",
               "Khk0BAB","QwU8fdG","4v2jbct","fGibHIO","WABMcoU",
               "DgSSPOs","kpueZ7L","ppiYwEI","vqgVRqZ","mxXZ7MU",
               "ZxllDNK","QPdic56","TQfKPs3","n62RL3r","X4lo3XZ",
               "EEHi1e4","36bRrF7"];

    rankColors = ["FF6600", "7519FF"];

    $("#header_left img").attr("src", "http://i.imgur.com/izt4yr5.png").attr("title", "boo");

window.setInterval(function() {
    $(".ufavatar").each(function(){
        avatarNum = parseInt($(this).find('a').attr('href').replace(/[^\d]/g, "").substr(4)) % 37;
        rankNum = (parseInt($(this).find('a').attr('href').replace(/[^\d]/g, "").substr(4)) % 2);
        replaceUrl = 'http://i.imgur.com/' + avatars[avatarNum] + '.jpg';
        replaceText = "<img src=\'" + replaceUrl + "\' width=\'32\' height=\'32\'>";
        avatarUrl = $(this).find('img').attr('src');
        if (avatarUrl != replaceUrl) {
            $(this).find('img').replaceWith(replaceText);
            if (changeRankColorsToo == true) { 
              $(this).siblings().find('a').css("color","#" + rankColors[rankNum]);
            };
        } else {
            return false;
        };
    });
}, 1000); // Increase this number if your performance drops