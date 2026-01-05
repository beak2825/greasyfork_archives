// ==UserScript==
// @name         osc动弹图片预览
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  再也不用打开新页面看图片啦
// @author       Hjj
// @match        https://www.oschina.net/tweets*
// @match        http://www.oschina.net/tweets*
// @require      http://cdn.staticfile.org/jquery/1.8.2/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24653/osc%E5%8A%A8%E5%BC%B9%E5%9B%BE%E7%89%87%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/24653/osc%E5%8A%A8%E5%BC%B9%E5%9B%BE%E7%89%87%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var _scale = 1;
    var previewBox = $('<div></div>');
    previewBox.css({
        'position': 'fixed',
        'top': '15px',
        'left': '15px',
        'display': 'none',
        'transform-origin':'0 0',
        'z-index': 99
    }).on('mousewheel',scale);
    $('body').append(previewBox);
    $('#mainScreen').on('click','.tweet-item img[data-small-img]',function(e){
        e.preventDefault();
        previewBox.css('transform','scale(1)');
        var bigSrc = $(e.target).attr('data-big-img');
        previewBox.empty().append(
            $('<img>').attr('src',bigSrc)
            .css({
                'max-width': '100%',
                'max-height': '100%'
            }).on('click',deleteSelf)
        ).show();
        return false;
    });
    
    function deleteSelf(e){
        $(e.target).parent().hide().end().remove();
        _scale = 1;
    }
    function scale(e){
        e.preventDefault();
        var delta = e.originalEvent.wheelDelta / 120;
        _scale += -delta/10;
        previewBox.css('transform','scale('+_scale+')');
    }
})();