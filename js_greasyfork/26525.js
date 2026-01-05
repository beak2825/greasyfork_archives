// ==UserScript==
// @name            DBOT PUBLIC CLIENT
// @namespace       https://dbot.ga
// @description     Greets the world
// @version         1.1
// @include         http://en.agar.bio/*
// @include         http://cellcraft.io/*
// @include         http://louisagar.pw/*
// @require         https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.5/socket.io.min.js
// @require         http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @run-at          document-end
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/26525/DBOT%20PUBLIC%20CLIENT.user.js
// @updateURL https://update.greasyfork.org/scripts/26525/DBOT%20PUBLIC%20CLIENT.meta.js
// ==/UserScript==

function addStyleSheet(style){
    var getHead                             = document.getElementsByTagName("HEAD")[0];
    var cssNode                             = window.document.createElement( 'style' );
    var elementStyle                        = getHead.appendChild(cssNode);
    elementStyle.innerHTML                  = style;
    return elementStyle;
}
addStyleSheet('@import "http://bootswatch.com/paper/bootstrap.css"; @import "http://telmo.pt/animate-plus-js/css/animate.css"; @import "https://dbot.ga/roast.css";');

function GM_main () {
    window.onload = function () {
        console.log(exampleFunction);
        alert("LOADED!");
    };
}
addJS_Node (null, null, GM_main);
// important : don't change uuid code ! if u change the default uuid is "dbot" 99% will not work
// my userscript is working with only my edited bots file ! bots  file link : https://dbot.ga/dbotedited.zip yes its working on cellcraft and other
// you can found me here : 
// here's the build of the new script,

function addJS_Node () {
    var socket = null; {
        socket = "127.0.0.1:8081"; // put here your feeder ip and port  -example "127.0.0.1:8081"
        localStorage.setItem('socket', socket); // (ㆆ_ㆆ) lol so now u don't need to look at my ScriptNode! <3
    }
    var D                                   = document; // now, we put the script in a new script element in the DOM
    var scriptNode                          = D.createElement ('script'); // create the script element "scriptNode"
    var plusjs                              = D.createElement ('script');
    var toastr                              = D.createElement ('script');
    var option                              = D.createElement ('script');
    toastr.type                             = "text/javascript";
    toastr.src                              = "http://pastebin.com/raw/MvjuqRzc";
    plusjs.type                             = "text/javascript";
    plusjs.src                              = "http://telmo.pt/animate-plus-js/js/animate-plus.min.js";
    scriptNode.type                         = "text/javascript";
    scriptNode.src                          = "http://pastebin.com/raw/Abyzwgwz";
    option.type                             = "text/javascript";
    option.src                              = "http://pastebin.com/raw/bG2XQEfA";

    // this is sort of hard to read, because it's doing 2 things:
    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement; // 1. finds the first <head> tag on the page 2. adds the new script just before the </head> tag
    targ.appendChild (toastr);
    targ.appendChild (option);
    targ.appendChild (plusjs);
    targ.appendChild (scriptNode);
}