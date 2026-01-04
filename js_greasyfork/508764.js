// ==UserScript==
// @name         Inject HTML into PenguinMod Editor
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Inject custom HTML into the PenguinMod editor page
// @author       You
// @match        https://studio.penguinmod.com/editor.html
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/508764/Inject%20HTML%20into%20PenguinMod%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/508764/Inject%20HTML%20into%20PenguinMod%20Editor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a new div element
    const newDiv = document.createElement('div');
    newDiv.id = 'custom-html-container';
    newDiv.style.position = 'fixed';
    newDiv.style.top = '0';
    newDiv.style.left = '0';
    newDiv.style.width = '100%';
    newDiv.style.height = '100%';
    newDiv.style.backgroundColor = '#fff'; // Set a background color if needed
    newDiv.style.zIndex = '9999'; // Make sure it's on top of other elements

    // HTML content to be injected
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width"/>
        <meta name="next-head-count" content="2"/>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        <link rel="manifest" href="/site.webmanifest"/>
        <title>Gandi - The collaborative in-browser IDE for game creation</title>
        <meta name="keywords" content="Scratch, turbowarp, gandi, Minecraft, online game, among us, itch.io, roblox"/>
        <meta name="description" content="Gandi IDE is a Scratch mod, it's a simple but powerful online game engine. An editor, interpreter, compiler, assets market, and MMO server are built inside. Realtime code, create and learn together right in your browser. "/>
        <meta name="twitter:title" content="Gandi - The collaborative in-browser IDE for game creation"/>
        <meta name="twitter:description" content="Gandi IDE is a Scratch mod, it's a simple but powerful online game engine. An editor, interpreter, compiler, assets market, and MMO server are built inside. Realtime code, create and learn together right in your browser. "/>
        <meta name="twitter:site" content="@cocrea"/>
        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:image"/>
        <meta name="twitter:image:src"/>
        <meta name="theme-color" content="#62B5DE"/>
        <meta property="og:url" content="https://cocrea.world//gandi"/>
        <meta property="og:type" content="website"/>
        <meta property="og:site_name" content="Gandi IDE"/>
        <meta property="og:title" content="Gandi - The collaborative in-browser IDE for game creation"/>
        <meta property="og:description" content="Gandi IDE is a Scratch mod, it's a simple but powerful online game engine. An editor, interpreter, compiler, assets market, and MMO server are built inside. Realtime code, create and learn together right in your browser. "/>
        <meta property="og:image"/>
        <link rel="preload" href="/_next/static/css/47b7a0011e26ad62.css" as="style"/>
        <link rel="stylesheet" href="/_next/static/css/47b7a0011e26ad62.css" data-n-g=""/>
        <link rel="preload" href="/_next/static/css/edd0ee245ac8806d.css" as="style"/>
        <link rel="stylesheet" href="/_next/static/css/edd0ee245ac8806d.css" data-n-p=""/>
        <noscript data-n-css=""></noscript>
        <script defer="" nomodule="" src="/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js"></script>
        <script src="/_next/static/chunks/webpack-72b99510082e1411.js" defer=""></script>
        <script src="/_next/static/chunks/framework-9cf46cf0fe8d1146.js" defer=""></script>
        <script src="/_next/static/chunks/main-421e2a345d25ad70.js" defer=""></script>
        <script src="/_next/static/chunks/pages/_app-258bb0eb1c3dd98f.js" defer=""></script>
        <script src="/_next/static/chunks/pages/gandi-a3301fbc07fd27d7.js" defer=""></script>
        <script src="/_next/static/cocrea/_buildManifest.js" defer=""></script>
        <script src="/_next/static/cocrea/_ssgManifest.js" defer=""></script>
    </head>
    <body>
        <div id="__next"></div>
        <script id="__NEXT_DATA__" type="application/json">{"props":{"pageProps":{"locale":"en","_sentryTraceData":"cb9830b54c64475890a96a9e18a74218-be6b52ca21e83390-1","_sentryBaggage":"sentry-environment=production,sentry-release=cocrea,sentry-transaction=%2Fgandi,sentry-public_key=87063421a33d4b3dba8c5956d38c3642,sentry-trace_id=cb9830b54c64475890a96a9e18a74218,sentry-sample_rate=1","hideNav":true,"shouldIndentWhenShowNav":false,"noNavAnimation":true,"seoConfig":{"title":"Gandi - The collaborative in-browser IDE for game creation","description":"Gandi IDE is a Scratch mod, it's a simple but powerful online game engine. An editor, interpreter, compiler, assets market, and MMO server are built inside. Realtime code, create and learn together right in your browser. ","keywords":"Scratch, turbowarp, gandi, Minecraft, online game, among us, itch.io, roblox","path":"/gandi"},"_nextI18Next":{"initialI18nStore":{"en":{"nav":{"about":"About Us","classroom":"Classroom","createButton":"Create","discord":"Join the Discord","docs":"Learn \u0026 Docs","educators":"For Educators","explore":"Explore","facebook":"Join Facebook Group","home":"Dashboard","homepage":"Homepage","menu":{"account":"Account Settings","signout":"Sign out"},"projects":"Projects","refer":"Naquagems","search":{"placeholder":"Search for projects or creators","resultTitle":"Search Results","popularSearches":"Popular Searches","seeMore":"See more","tab":{"all":"All","creators":"Creators","projects":"Projects"}},"notification":{"comment":"commented on","creationCreated":"has released a new project","creationUpdated":"has updated the project","follow":"subscribed to you","joinClass":"joined the class","like":"liked your project","likeButtonText":"Like","loadMore":"Load More","publishAssignment":"New assignment!","reply":"replied to your comment on","submitWork":"submitted the classwork","subscribedUserLike":"liked the project","title":"Messages","remix_creation":"remixed your project"}},"common":{"comment":{"add":"Leave a comment","commentButton":"Post","delete":{"label":"Delete"},"hide":"Hide {{count}} replies","pin":{"content":"pinned comment","title":"Pin"},"reply":"Reply","report":{"desc":"Reports will be reviewed by the Mod team. If approved, reported comments will be deleted.","label":"Report","reason":{"label":"Reason","optional1":"Advertising or Spam","optional2":"Offensive","optional3":"Harassment or Threats","optional4":"Privacy Violation","optional5":"Other","title":"Reason"},"title":"Report comment"},"seeMore":"View {{count}} replies","totalNum":"{{count}} Comments","unpin":{"title":"unpin"}},"common":{"back":"Back","bio":"Bio","cancel":"Cancel","change":"Change","charactersLimit":"characters","commingSoon":"Coming soon","confirm":"Confirm","copied":"COPIED!","copy":"COPY","days":"days ago","delete":"Delete","description":"Description","done":"Done","edit":"Edit","email":"Email","GotIt":"Got it","hours":"hours ago","Import":"Import","Imported":"Imported","learnMore":"Learn more","Likes":"Likes","loginTitle":"Welcome to Cocrea! ","minutes":"minutes ago","months":"months ago","next":"Next","nickname":"Nickname","ok":"OK","password":"Password","preview":"Preview","previous":"Previous","projectsNum":"Projects","publish":"Publish","reset":"Reset","save":"Save","send":"SEND","sent":"SENT!","seconds":"seconds ago","submit":"Submit","title":"Title","update":"Update","upload":"Upload","weeks":"weeks ago","years":"years ago"}},"_nextI18Next":{"initialI18nStore":{"en":{"common":{"comment":{"add":"Leave a comment","commentButton":"Post","delete":{"label":"Delete"},"hide":"Hide {{count}} replies","pin":{"content":"pinned comment","title":"Pin"},"reply":"Reply","report":{"desc":"Reports will be reviewed by the Mod team. If approved, reported comments will be deleted.","label":"Report","reason":{"label":"Reason","optional1":"Advertising or Spam","optional2":"Offensive","optional3":"Harassment or Threats","optional4":"Privacy Violation","optional5":"Other","title":"Reason"},"title":"Report comment"},"seeMore":"View {{count}} replies","totalNum":"{{count}} Comments","unpin":{"title":"unpin"}},"common":{"back":"Back","bio":"Bio","cancel":"Cancel","change":"Change","charactersLimit":"characters","commingSoon":"Coming soon","confirm":"Confirm","copied":"COPIED!","copy":"COPY","days":"days ago","delete":"Delete","description":"Description","done":"Done","edit":"Edit","email":"Email","GotIt":"Got it","hours":"hours ago","Import":"Import","Imported":"Imported","learnMore":"Learn more","Likes":"Likes","loginTitle":"Welcome to Cocrea! ","minutes":"minutes ago","months":"months ago","next":"Next","nickname":"Nickname","ok":"OK","password":"Password","preview":"Preview","previous":"Previous","projectsNum":"Projects","publish":"Publish","reset":"Reset","save":"Save","send":"SEND","sent":"SENT!","seconds":"seconds ago","submit":"Submit","title":"Title","update":"Update","upload":"Upload","weeks":"weeks ago","years":"years ago"}},"page":"/gandi"},"serverRendered":true,"hydratable":true}}</script>
    <script src="/_next/static/chunks/837-8324894a27223979.js" defer=""></script>
    </body>
    </html>`;

    // Insert the HTML content into the new div
    newDiv.innerHTML = htmlContent;

    // Append the new div to the body
    document.body.appendChild(newDiv);
})();
