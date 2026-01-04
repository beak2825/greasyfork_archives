// ==UserScript==
// @name        BlueCat Address Manager Fixed Header
// @namespace   *
// @description Add a "Go to Top" button and fix Header (Still experimental for certain tables) in BlueCat Address Manager
// @include     */app*
// @require     http://code.jquery.com/jquery-latest.js
// @version     7
// @author      Marius Galm
// @copyright   2018, Marius Galm
// @license     MIT
// @grant       none
// @icon        https://www.bluecatnetworks.com/wp-content/uploads/2018/03/cropped-bluecat-favicon-32x32.png
// @downloadURL https://update.greasyfork.org/scripts/38697/BlueCat%20Address%20Manager%20Fixed%20Header.user.js
// @updateURL https://update.greasyfork.org/scripts/38697/BlueCat%20Address%20Manager%20Fixed%20Header.meta.js
// ==/UserScript==
if (document.readyState === "interactive" ) {
    addTopButton();
    var pageElements = document.childNodes;
    if (pageElements !== null) {
        var pageElement = pageElements[2];
        if (pageElement !== null) {
            var text = pageElement.nodeValue;
            if (text !== null) {
                switch(text) {
                    case " Page: IP4BlockPage ":
                        fixHeader();
                        //createComboButton( 'pageMenu-combo', 'pageMenu-title', 'pageMenu-menu', 'pageMenu-button', false, false );
                        break;
                    case " Page: IP4NetworkPage ":
                        fixHeader();
                        //createComboButton( 'pageMenu-combo', 'pageMenu-title', 'pageMenu-menu', 'pageMenu-button', false, false );
                        break;
                    case " Page: ZoneDetails ":
                        fixHeader();
                        //createComboButton( 'pageMenu-combo', 'pageMenu-title', 'pageMenu-menu', 'pageMenu-button', false, false );
                        break;
                    default:
                        console.log("Unsupport page type for header fixation --> " + text);
                }
            }
        }
    }
}

function fixHeader() {
    console.log("create sticky css stylings");
    var css = '.banner-sticky { top:0px; position:sticky; position: -webkit-sticky; } \
        .navigation-sticky { top:59px; position:sticky; position: -webkit-sticky; } \
        .location-sticky { top:84px; position:sticky; position: -webkit-sticky; } \
        .TabbedEntityPagePanel-sticky { top:102px; position:sticky; position: -webkit-sticky; } \
        .context-sticky { top:164px; position:sticky; position: -webkit-sticky; } \
        .dialog-sticky { top:191px; position:sticky; position: -webkit-sticky; }';
        //.list-header-sticky { position: relative; position:sticky; position: -webkit-sticky; } \
        //.topToolBar-sticky { position: sticky; position: element(#informal); } ',
//     var css = '.banner-sticky { top:0px; position:sticky; position: -webkit-sticky; } \
//                .navigation-sticky { top:59px; position:sticky; position: -webkit-sticky; } \
//                .location-sticky { top:84px; position:sticky; position: -webkit-sticky; } \
//                .TabbedEntityPagePanel-sticky { top:102px; position:sticky; position: -webkit-sticky; }  \
//                .context-sticky { top:164px; position:sticky; position: -webkit-sticky; } \
//                .dialog-sticky { top:191px; position:sticky; position: -webkit-sticky; } \
//                .topToolBar-sticky { position:sticky; top(253px); } \
//                .list-header-sticky { position:fixed; transform: translateY(261px); }',
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet){
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    console.log("add new css stylings to head element")
    head.appendChild(style);
    //console.log("add sticky classes to elements")
    // now add the classes that are styled to the elements
    $("#banner").addClass("banner-sticky");
    $(".navigation-bar").addClass("navigation-sticky");
    $(".location-bar").addClass("location-sticky");
    $("#labelContainer").addClass("TabbedEntityPagePanel-sticky");
    $(".ContextPaneSwitcher").addClass("context-sticky");
    $(".dialog-hd").addClass("dialog-sticky");
    //$(".value-table-topToolBar").addClass("topToolBar-sticky");
    //$(".list-header").addClass("list-header-sticky");
};


function addTopButton() {
    var button = document.createElement("button");
    button.innerHTML="Top";
    button.id="topBtn";
    button.title="Go to top";
    var body = document.getElementsByTagName("body")[0];
    body.appendChild(button);
    button.addEventListener ("click", function() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    });
    var btncss = '#topBtn {display: none; position: fixed; width: 60px; bottom: 20px; right: 30px; z-index: 99; border: none; outline: none; background-color: #8CB7D1; color: white; cursor: pointer; padding: 15px; border-radius: 10px; font-size: 18px; } #topBtn:hover { background-color: #555; }';
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet){
        style.styleSheet.cssText = btncss;
    } else {
        style.appendChild(document.createTextNode(btncss));
    }
    console.log("add new btncss stylings to head element")
    head.appendChild(style);
    // When the user scrolls down 20px from the top of the document, show the button
    window.onscroll = function() {scrollFunction()};
}

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("topBtn").style.display = "block";
    } else {
        document.getElementById("topBtn").style.display = "none";
    }
}

