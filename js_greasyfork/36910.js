// ==UserScript==
// @name         Aliexpress feedback image original size
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adds button under user posted images in Feedback tab to view the original size images in new window.
// @author       rightdroid
// @include      https://feedback.aliexpress.com/*
// @include      http://feedback.aliexpress.com/*
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/36910/Aliexpress%20feedback%20image%20original%20size.user.js
// @updateURL https://update.greasyfork.org/scripts/36910/Aliexpress%20feedback%20image%20original%20size.meta.js
// ==/UserScript==

/*jshint multistr: true */
$(document).ready(function(){
(function() {
    var $img = $('.pic-view-item img');
    var $img_wrapper = $('.pic-view-item');
    var zoom_btn = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="15px" height="15px" viewBox="0 0 485.213 485.213" style="enable-background:new 0 0 485.213 485.213;" xml:space="preserve"><path d="M363.909,181.955C363.909,81.473,282.44,0,181.956,0C81.474,0,0.001,81.473,0.001,181.955s81.473,181.951,181.955,181.951    C282.44,363.906,363.909,282.437,363.909,181.955z M181.956,318.416c-75.252,0-136.465-61.208-136.465-136.46    c0-75.252,61.213-136.465,136.465-136.465c75.25,0,136.468,61.213,136.468,136.465    C318.424,257.208,257.206,318.416,181.956,318.416z" fill="#006DF0"/><path d="M471.882,407.567L360.567,296.243c-16.586,25.795-38.536,47.734-64.331,64.321l111.324,111.324    c17.772,17.768,46.587,17.768,64.321,0C489.654,454.149,489.654,425.334,471.882,407.567z" fill="#006DF0"/></svg>';
    var style_div = "<style>.tmonkey_aliplugin-btn {display: inline-block;width: 100%;height: 100%; border-radius:5px;} .tmonkey_aliplugin-btn:hover{box-shadow: 1px 1px 3px #026df0;}</style>";

    $('body').append(style_div);
    $.each($img_wrapper, function(){
        var $parent_list = $(this).parent();
        $parent_list.css('height', '72px');
        var $link = $(this).children('img');
        var link = $link.attr('src');
        var button = '<div style="cursor:pointer;color:#000;font-family:Helvetica, Arial;font-weight:bold;margin-top: -55px;padding-top: 63px;"><a class="tmonkey_aliplugin-btn" href="'+link+'" target="_blank">'+zoom_btn+'</a></div>';
        $(this).append(button);
    });
})();




});

