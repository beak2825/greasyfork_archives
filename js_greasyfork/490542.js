// ==UserScript==
// @name         无图模式
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      0.9
// @icon         https://qwn3213.com/icon/tupian.png
// @description  点击脚本菜单关闭/开启页面图片
// @author       Q伟N
// @match        *://*/*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/490542/%E6%97%A0%E5%9B%BE%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/490542/%E6%97%A0%E5%9B%BE%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var host = window.location.hostname;
    var imgShow = GM_getValue(host);
    console.log("imgShow="+imgShow);
    if (imgShow === false) {
        setTimeout(function() {
            hide_img();
            GM_registerMenuCommand('暂时显示', function () {$('img').show();$('.hidden-image-notice').remove();}, 't');
        }, 380);
    } else {
        imgShow = true;
    }

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes) {
                mutation.addedNodes.forEach(function(node) {
                     var nextElement = node.nextElementSibling;
                    if ((node.nodeType === 1 && (node.nodeName === 'IMG' || node.getElementsByTagName('img').length > 0)) && imgShow === false && nextElement && nextElement.classList.contains('hidden-image-notice')){
                        hide_img();
                    }
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true, 
        subtree: true
    });

    function menu_change() {
        imgShow = !imgShow;
        if (imgShow) {
            $('img').show();
            $('.hidden-image-notice').remove();
        } else {
           hide_img();
        }
        GM_setValue(host, imgShow);
        GM_unregisterMenuCommand(menuId);
        menuId = GM_registerMenuCommand((imgShow ? '✅': '❌') + '图', menu_change, 'h');
    }


    function hide_img() {
        if (imgShow) {
           return;
        }
        $('img').each(function() {
            var $this = $(this);
            var imgSrc = $this.attr('src');
            var displayedWidth = $this.width();
            var displayedHeight = $this.height();
            console.log("displayedWidth:"+displayedWidth+",displayedHeight:"+displayedHeight+"------imgSrc="+imgSrc);
            if(displayedWidth>100 || displayedHeight>100){
                $this.hide();
                if (!$this.next().is('.hidden-image-notice')) {
                    $this.after('<div class="hidden-image-notice"><a href="' + imgSrc + '" target="_blank">『图』</a></div>');
                }
            }
        });
    }
    var menuId = GM_registerMenuCommand((imgShow ? '✅': '❌') + '图', menu_change, 'h');
})();