// ==UserScript==
// @name         Opacidad img/video - Voxed
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Opacidad a las imágenes/videos con un click.
// @author       Hhaz
// @match        voxed.net/vox/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25033/Opacidad%20imgvideo%20-%20Voxed.user.js
// @updateURL https://update.greasyfork.org/scripts/25033/Opacidad%20imgvideo%20-%20Voxed.meta.js
// ==/UserScript==

$(document).ready(function(){
    $(".role").click(function(){
        $(".attach_image").css("opacity", "0.03");
        $(".attach_video").css("opacity", "0.03");
        $(".vox-view .image").css("opacity", "0.03");
        $(".attach_image").css("transition", "all .15s");
    }); 
});

$(document).ready(function(){
    $(".role").dblclick(function(){
        $(".attach_image").css("opacity", "1.0");
        $(".attach_video").css("opacity", "1.0");
        $(".vox-view .image").css("opacity", "1.0");
        $(".attach_image").css("transition", "all .15s");
    }); 
});