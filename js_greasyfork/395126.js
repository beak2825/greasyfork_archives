// ==UserScript==
// @name         Generate markdown files' table of contents or anchor links menu automatically
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Generate markdown files' table of contents or anchor links menu automatically, make markdown files easy to read
// @author       ladyrank
// @include      https://github.com/*
// @include      https://*.muc*.cn/*
// @include      https://*.zuim*.com/*
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/395126/Generate%20markdown%20files%27%20table%20of%20contents%20or%20anchor%20links%20menu%20automatically.user.js
// @updateURL https://update.greasyfork.org/scripts/395126/Generate%20markdown%20files%27%20table%20of%20contents%20or%20anchor%20links%20menu%20automatically.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var detect = function (){
        var links = $('a.anchor');
        var html = '';
        var $wrap = '';
        var winH = window.screen.availHeight || window.screen.height;
    
        if (!links || !links.length) {
            return false;
        }
    
        html = '<div id="wx-mkd-toc" style="z-index: 9999; position: fixed; bottom: 50px; right: 20px; background: #f2f2f2; padding: 10px; border: 1px solid #f2f2f2;"><h1 style="margin: 0; font-size: 16px;"><a href="javascript:;"><span>+</span>目录预览</a></h1><div class="wx-mkd-con" style="display: none; overflow: hidden; overflow-y: scroll; padding: 20px; max-height: '+ (winH*.5)+'px;"><ul style="margin: 0; padding: 0;">';
        $wrap = $('body');
    
        $.each(links, function (idx, item) {
            var $this = $(item);
            var $p = $this.parent();
            var tag = (($p[0] && $p[0].tagName) || '').toLowerCase();
            var tagNum = (tag || '').replace(/h/gi, '');
            var mLeft = tagNum * 10;
    
            html += '<li style="margin-left: ' + mLeft + 'px;" class="c_toc_' + tag + '"><a href="' + $this.attr('href') + '">' + $p.text() + '</a></li>'
        });
    
        html += '</ul></div></div>';
    
        $wrap.prepend(html);

        $wrap.on('click', '#wx-mkd-toc h1', function(){
            var $this = $(this);
            var $thisSpan = $this.find('span');
            var thisSpanTxt = $thisSpan.text();
            var $thisCon = $this.parent().find('.wx-mkd-con');
    
            if(thisSpanTxt.match(/\+/gi)){
                $thisCon.show();
                $thisSpan.text('-');
            } else {
                $thisCon.hide();
                $thisSpan.text('+');
            }
        });
    };

    setTimeout(function(){
        detect();
    }, 2000);

})();