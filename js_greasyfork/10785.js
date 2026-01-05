// ==UserScript==
// @name         Cancel inline tag editor with [esc]
// @version      1.0
// @description  Adds an ability to cancel the inline tag editor with [esc]
// @author       nicael
// @include        *://*.stackexchange.com/questions/*
// @include        *://*stackoverflow.com/questions/*
// @include        *://*serverfault.com/questions/*
// @include        *://*superuser.com/questions/*
// @include        *://*askubuntu.com/questions/*
// @include        *://*stackapps.com/questions/*
// @include        *://*mathoverflow.net/questions/*
// @grant        none
// @namespace    https://greasyfork.org/users/9713
// @downloadURL https://update.greasyfork.org/scripts/10785/Cancel%20inline%20tag%20editor%20with%20%5Besc%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/10785/Cancel%20inline%20tag%20editor%20with%20%5Besc%5D.meta.js
// ==/UserScript==

$("body").on("keydown",".tag-editor input", function(e){
    if (e.keyCode == 27){
        $(".cancel-edit").click();
    }
});