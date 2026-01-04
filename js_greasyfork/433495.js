// ==UserScript==
// @name         Shopee conversations UI Hider For YYT
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  This scripts is used for hide the some UI of shopee conversations.
// @author       Ryan Tsai
// @match        https://seller.shopee.tw/webchat/conversations
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdn.staticfile.org/jquery/3.5.0/jquery.min.js
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=19641
// @resource     IMPORTED_CSS https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css
/* globals jQuery, $, waitForKeyElements, GM_addElement*/
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/433495/Shopee%20conversations%20UI%20Hider%20For%20YYT.user.js
// @updateURL https://update.greasyfork.org/scripts/433495/Shopee%20conversations%20UI%20Hider%20For%20YYT.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

function setFavicon(url){
    let a = document.querySelectorAll("link[rel *= 'icon']");

    if(a.length == 0){
        let link = document.createElement('link');
        // link.type = 'image/x-icon';
        link.type = 'Shortcut Icon';
        link.rel = 'icon';
        document.head.appendChild(link);
        a = [link];
    }

    for(let i of a) i.href = url;
}

function hideNode(jNode){
    jNode.hide();
}

function showNode(jNode){
    jNode.show();
}

function addHeart(){
    GM_addStyle('.fa-heart-o {color: red;cursor: pointer;}');
    GM_addStyle('.fa-heart {color: red;cursor: pointer;}');
    // var r= $('<p id = heart><i class="fa fa-heart-o _1ow6un1kau" aria-hidden="true" ></i> </p>');
    var r = $('<div class="_1ow6un1kau"><div class=""><div><div class=""><i id="heart" class="fa _3kEAcT1Mk5 _2fZnE0Wo7k _1hvX2a4rqP show" aria-hidden="true">❤</i></div></div></div></div>');
    $("._2TWyGEYV4e").append(r) //icon bar
}



function ButtonClickAction (zEvent) {
    $('#heart').click(function () {
        if($( "#heart" ).hasClass( "show" )){
            $("._2-_tepCr6o").hide(); //top
            $("._1u4BqXFvSK").hide(); //star
            $(".Lum6r-GcMG").hide(); // item
            $("._126ygf5yom").hide(); //left
            $("._3A0yanY73h").hide(); //right
            $( "#heart" ).removeClass("show");
            $( "#heart" ).addClass("hide");
        }else{
            $("._2-_tepCr6o").show();
            $("._1u4BqXFvSK").show();
            $(".Lum6r-GcMG").show();
            $("._126ygf5yom").show();
            $("._3A0yanY73h").show();
            $( "#heart" ).removeClass("hide");
            $( "#heart" ).addClass("show");
        }
    });
}

(function() {
    'use strict';

    // Your code here...
    const my_css = GM_getResourceText("IMPORTED_CSS");
    GM_addStyle(my_css);

    waitForKeyElements(
        "._2TWyGEYV4e", //icon bar
        addHeart
    );
    waitForKeyElements(
        "#heart",
        ButtonClickAction
    );
    setFavicon("https://www.google.com/favicon.ico");
    window.addEventListener("load", function(){ document.title = "Goog1e";})
    var target = document.querySelector('head > title');
    var observer = new window.WebKitMutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if(mutation.target.textContent.includes("訊息")){
                console.log('new title:', mutation.target.textContent);
                document.title = '❤';
            }else if(mutation.target.textContent.includes("聊聊")){
                console.log('new title:', mutation.target.textContent);
                document.title = 'Goog1e';
            }
        });
    });
    observer.observe(target, { subtree: true, characterData: true, childList: true });
})();