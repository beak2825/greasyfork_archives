// ==UserScript==
// @name         menu-enhence
// @namespace    menu-enhence
// @version      0.0.4
// @description  phabricator wiki menu enhence
// @author       Bmvpdxl
// @include      *://phabricator.*
// @downloadURL https://update.greasyfork.org/scripts/391247/menu-enhence.user.js
// @updateURL https://update.greasyfork.org/scripts/391247/menu-enhence.meta.js
// ==/UserScript==

(function() {
    if (typeof jQuery != "undefined") {
        makeMenuFixed();
    } else {
        alert("This Script need jQuery");
        // var ele = document.createElement("script");
        // ele.src = "https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js";
        // ele.onload = makeMenuFixed();
        // document.head.appendChild(ele);
    }

    function getElementLeft(element) {
        var actualLeft = element.offsetLeft;
        var current = element.offsetParent;

        while (current !== null) {
            actualLeft += current.offsetLeft;
            current = current.offsetParent;
        }

        return actualLeft;
    }

    function getElementTop(element) {
        var actualTop = element.offsetTop;
        var current = element.offsetParent;

        while (current !== null) {
            actualTop += current.offsetTop;
            current = current.offsetParent;
        }

        return actualTop;
    }

    function makeMenuFixed() {
        var menuBtn = $("a.button.has-icon.phui-button-simple.phui-document-toc");
        var menuBtnLeft = getElementLeft(menuBtn[0]);
        var menuBtnTop = getElementTop(menuBtn[0]);

        var menuPane = $(".phui-list-sidenav.phui-document-toc-list");

        menuBtn
            .css("position", "fixed")
            .css("top", menuBtnTop + "px")
            .css("left", menuBtnLeft) + "px";

        menuPane &&
            menuPane
            .css("position", "fixed")
            .css("height", "70vh")
            .css("overflow-y", "scroll")
            .css("width", "400px")
            .css("top", menuBtnTop + 40 + "px")
            .css("left", menuBtnLeft + "px");
    }


    var btn = $('.phui-document-toc');
    var wrap = $('.phui-document-toc-container');
    if(!btn.length) {
        console.warn('not support this page');
    }

    // 移除页面原有的时间监听，避免出现一些bug
    btn.attr('data-sigil', '');

    btn.on('click', function(e) {
        e.stopPropagation();  // 阻止事件传播，防止body上的handler同时执行
        wrap.toggleClass('phui-document-toc-open');
    });

    $('body').on('click', function(e){
        var target = e.target;
        var $target = $(target);

        if(isOrInsideElement($target, '.phui-document-toc-list')) {
            return;
        }else{
            $('.phui-document-toc-container').removeClass('phui-document-toc-open')
        }
    })

    /**
 *
 * @param selectorChild <string|node|jquery node>
 * @param selectorParent <string>
 * @returns {jQuery|boolean}
 */
    function isOrInsideElement(selectorChild, selectorParent) {
        return $(selectorChild).is($(selectorParent)) || !!($(selectorChild).parents(selectorParent).length);
    }

})();
