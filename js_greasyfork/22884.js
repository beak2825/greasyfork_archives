// ==UserScript==
// @name        Smiley personnalisé
// @description Un script pour rajouter des smileys personnalisé sur le forum, ainsi que dans les conversations !
// @include     http://realitygaming.fr/threads/*
// @include     https://realitygaming.fr/threads/*
// @include     http://www.realitygaming.fr/threads/*
// @include     https://www.realitygaming.fr/threads/*
// @include     http://realitygaming.fr/conversations/*
// @include     https://realitygaming.fr/conversations/*
// @include     http://www.realitygaming.fr/conversations/*
// @include     https://www.realitygaming.fr/conversations/*
// @include     http://realitygaming.fr/forums/*
// @include     https://realitygaming.fr/forums/*
// @include     http://www.realitygaming.fr/forums/*
// @include     https://www.realitygaming.fr/forums/*
// @version     1.0
// @grant       none
// @namespace https://greasyfork.org/users/47201
// @downloadURL https://update.greasyfork.org/scripts/22884/Smiley%20personnalis%C3%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/22884/Smiley%20personnalis%C3%A9.meta.js
// ==/UserScript==

/* Script by Wayz on realitygaming.fr
RGPC <3
Why you're reading the comments ? Why i'm writing in English ?
lol */
var stop = false; // Smiley non actif

$(".redactor_btn_smilies").on("click", function() {
    if (stop === false) {
    setTimeout(load, 1000);
    stop = true;
    }
});

function load() {
$(".smilieCategory").children().append('<li class="Smilie" data-text=""><img src="http://image.noelshack.com/fichiers/2016/35/1472919345-kappa.png" data-smilie="yes"></li>');
}