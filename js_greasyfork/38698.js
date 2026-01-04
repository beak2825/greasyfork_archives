// ==UserScript==
// @name        BlueCat Address Manager Resizable Columns
// @namespace   *
// @description Dynamic Column Resizing in BlueCat Address Manager
// @include     */app*
// @version     10
// @grant       none
// @author      Marius Galm
// @copyright   2018, Marius Galm
// @license		MIT
// @icon        https://www.bluecatnetworks.com/wp-content/uploads/2018/03/cropped-bluecat-favicon-32x32.png
// @require     http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/38698/BlueCat%20Address%20Manager%20Resizable%20Columns.user.js
// @updateURL https://update.greasyfork.org/scripts/38698/BlueCat%20Address%20Manager%20Resizable%20Columns.meta.js
// ==/UserScript==

//jQuery fix - is now broken or not necessary any more
//this.$ = this.jQuery = jQuery.noConflict(true);

// declare used function
function reSize() {
    $(function() {
        var pressed = false;
        var start = undefined;
        var startX, startWidth;

        $("table th").mousedown(function(e) {
            start = $(this);
            pressed = true;
            startX = e.pageX;
            startWidth = $(this).width();
            $(start).addClass("resizing");
        });

        $(document).mousemove(function(e) {
            if(pressed) {
                if(startWidth+(e.pageX-startX) > 9 ) {
                    $(start).width(startWidth+(e.pageX-startX));
                }
            }
        });

        $(document).mouseup(function() {
            if(pressed) {
                $(start).removeClass("resizing");
                pressed = false;
                $(start).style.cursor;
            }
        });
    });
}

// do something on specific pages
if (document.readyState === "interactive" ) {
    var page = document.childNodes[2].nodeValue;
    if (/Page: AddEdit/.test(page)) {
        page = "AddEditDummy";
    } else if (/Page: Edit/.test(page)) {
        page = "AddEditDummy";
    }
    switch(page) {
        case " Page: SystemInformation ":
            break;
        case " Page: UpdateSystem ":
            break;
        case "AddEditDummy":
            break;
        case " Page: AllocateIP4Address ":
            break;
        default:
            reSize();
    }
    // var links = document.getElementsByTagName("link");
    // var linksList = Array.prototype.slice.call(links);
    // linksList.forEach(function(link) {
        // if (link.href.includes("/cached-style/proteus-silver.css")) {
            // var sheet = link.sheet;
            // var rule = "table.value-table { table-layout: auto; }";
            // sheet.insertRule(rule,0);
        // }
    // });
}

// general styling function
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

// add resize cursor to table header
addGlobalStyle("*[id^='header'] { cursor: col-resize; }");