// ==UserScript==
// @name         Search with google image fix
// @namespace    http://tampermonkey.net/
// @version      1.1.4
// @description  Search with google image again cause fuck google lens
// @author       You
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @match        http://*/*
// @match        https://*/*
// @exclude      https://www.instant-gaming.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442371/Search%20with%20google%20image%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/442371/Search%20with%20google%20image%20fix.meta.js
// ==/UserScript==

var invert = true;

function GM_addStyle(css) {
    const style = document.getElementById("GM_addStyle") || (function() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = "GM_addStyle";
        document.head.appendChild(style);
        return style;
    })();
    const sheet = style.sheet;
    sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
}

(function() {

    GM_addStyle(`
.container__menu {
                /* Absolute position */
                position: absolute;

                /* Reset */
                list-style: none;
                margin: 0;
                padding: 0;
                display: none;

                /* Misc */
                border: 1px solid #cbd5e0;
                border-radius: 0.25rem;
                background-color: #f7fafc;
            }
`);


    GM_addStyle(`
    .open {
    display: block;
    z-index: 9999;
}
`);

    GM_addStyle(`
.container__item {
                padding: 0.5rem 1rem;
                white-space: nowrap;
                cursor: pointer;
    color: black;
            }
`);

    GM_addStyle(`
 .container__item:hover {
                background-color: #bee3f8;
            }
`);

    GM_addStyle(`
.container__divider {
                border-bottom: 1px solid #cbd5e0;
                height: 1px;
            }
`);


    $("body").append(`
    <ul id="fucklens" class="container__menu">
                    <li class="container__item">Search with google image</li>
                </ul>
                `);

    var cntxtMn = $("#fucklens");
    var mouseX;
    var mouseY;
    var currentTarget = null;

    $(document).mousemove(function(e) {
        mouseX = e.pageX;
        mouseY = e.pageY;
    });
    $("img").on('contextmenu', displayContextMenu);


    const observer = new MutationObserver(function(mutations_list) {
        mutations_list.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(added_node) {
                var img = $(added_node).find("img");
                if (img){
                    img.on('contextmenu', displayContextMenu);
                }
            });
        });
    });

    observer.observe(document, { subtree: true, childList: true });

    //thank you for this guy https://jsfiddle.net/JCJDesigns/6zsvmt10/
    function displayContextMenu(e) {
        (cntxtMn.hasClass("open")) ? cntxtMn.removeClass("open") : false;
        /*
         If inverte is true then ctrl key = special menu
         if invert is false then ctrl key = skip

        */
        if (invert == false && e.ctrlKey)
            return;

        else if (e.ctrlKey && invert)
        {
            cntxtMn.css({'top':mouseY,'left':mouseX}).addClass("open");
            e.preventDefault();
            currentTarget = e.target;
            return;
        }
        else if (invert == false){
            cntxtMn.css({'top':mouseY,'left':mouseX}).addClass("open");
            e.preventDefault();
            currentTarget = e.target;
        }

    }
    cntxtMn.click(function(e) {
        e.stopPropagation();
    });

    $(document).click(function() {
        (cntxtMn.hasClass("open")) ? cntxtMn.removeClass("open") : false;
    });

    $(".container__item").click(function(){
        var src = "https://lens.google.com/uploadbyurl?url=" + $(currentTarget).prop("src");
        console.log($(currentTarget).prop("src"));
        (cntxtMn.hasClass("open")) ? cntxtMn.removeClass("open") : false;
        window.open(src);
    });


})();