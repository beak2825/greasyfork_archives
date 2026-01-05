

// ==UserScript==
// @name       NEw Dark theme (amoled screen)
// @namespace     http://userstyles.org
// @description	  A dark theme that is pleasing to the eye,suited for amoled screen
// @author        ale
// @include      *
// @exclude https://openload.co/*
// @exclude https://duckduckgo.com/*
// @exclude https://www.amazon.it/gp/*
// @exclude http://www.inoreader.com/*
// @exclude https://m.planetromeo.com/*
// @run-at        document-start
// @version      1
// @downloadURL https://update.greasyfork.org/scripts/29277/NEw%20Dark%20theme%20%28amoled%20screen%29.user.js
// @updateURL https://update.greasyfork.org/scripts/29277/NEw%20Dark%20theme%20%28amoled%20screen%29.meta.js
// ==/UserScript==
(function() {var css = [
"*{",
" border-color: gray !important;",
" outline-color: red !important;",
" color: white;",
" text-shadow: none !important;",
" -moz-border-radius: 0 !important;",
" -webkit-border-radius: 0 !important;",
" -ms-border-radius: 0 !important;",
" border-radius: 0 !important;",
" -moz-box-shadow: none !important;",
" -webkit-box-shadow: none !important;",
" -ms-box-shadow: none !important;",
" box-shadow: none !important;",
" }",
" ",
" html,div,nav,li,dt,dd,ul,ui-menu-item,ui-menu,ui-selectmenu-menu,body,span, select>option:hover, td, #classes-nav, #packages-nav, #side-nav, #devdoc-nav, .ui-resizable-handle, div.sidebox-wrapper, div.sidebox {",
" background-image: none !important;",
" background-color:#000000 !important;",
" }",
" ",
" h1{",
" color: white !important;",
" }",
"",
    " h2{",
" color: white !important;",
" }",
"",
" a, h2, h3, h4{",
" color:violet !important;",
" }",
"",
" h5{",
" color: white !important;",
" }",
" ",
" input {",
" background-color: gray !important;",
" }",
"",
    " input:focus {",

" background-color: red !important;",
" }",
"",
" ::selection {",
" background: orange !important;",
" color: #000000 !important;",
" }",
"",
" ::-moz-selection {",
" background: #fdf6e3 !important;",
" color: #839496 !important;",
" }",
" ::-webkit-selection {",
" background: #fdf6e3 !important;",
" color: #839496 !important;",
" }",
" :link {",
" color: yellow!important;",
" }",
" :visited {",
" color: #23cbff!important;",
" }",
"",
" .morehover>.top {",
" background-color: none;",
" }",
" .morehover>.mid {",
" background-color: black;",
" background-image: url(\"http://www.colorhexa.com/333333.png\");",
" }",
"",
" .logo>a {",
" background: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHsAAAAZCAMAAAAmJaEcAAACB1BMVEUAAAAjHyCAgIBVVVUjHyCAgIBmZmYjHyCAgIBtbZKAgIBxjo6AgIB0i4uAgIB2iYmAkJCSuD54h4eAjo55hpSAjIx5kpJ6kJCAipWAk5N7jY2AkZF7jJSAkJB8k5OSuD6Aj498kpJ8kZGAk5OCjpSCk5OAkJCCk5OSuD6CkpKAj5SCkZGCkJWAkpKCkpKSuD6Ak5OBkZWAkpWBk5ODkZSDk5OSuD6BkZSDkpWBlJSDkpWBk5OCkZSCkZSAj5KCk5OCk5Z/j5J/jpGSuD6Bk5WCkZSBk5WClJSBkpWCk5WCkpWCkpSDk5WDk5WSuD6DkpWCk5aDkpSCk5WDkpSCk5WCkpSCkpSDk5WClJaClJaSuD6Bk5WBk5WCk5WBkpSCk5WCkpaSuD6Bk5WClJaBk5WDk5SCk5WDkpaClJaClJWDk5aSuD6DlJWDlJWCk5aDk5WClJWDk5WCk5aSuD6ClJWCk5aClJWCk5aCk5WCk5WClJWCk5aCk5aClJWClJWDk5aSuD6ClJWDk5WDlJWCk5WDk5WClJWDk5WSuD6Ck5aCk5WDk5aClJWCk5aClJWCk5WCk5aDk5aClJWDk5WSuD6Dk5WCk5aDlJWDlJaCk5WCk5WDk5aClJWDk5WDk5WCk5aDlJWCk5WSuD6DlJaCk5WClJaClJaClJaCk5WCk5WDlJaSuD6DlJbSCzVJAAAAq3RSTlMAAQECAgMEBAUGBwgJCgsMDxAQERITFBYXGRwdHh8gICEiJCcqLC0uMDAxMjQ1PkBBQkVISU9QUFFSU1RVV1hZW11eYGJjZGVmaWttbnBwcnN0dXZ3eXt8fX+Ag4WGh4qOj4+QkZOUlZyen5+jpaanqKmtr6+wsbK0tba3ubu9vr+/wMLFxsnMz8/R1NXW19jZ29zd39/g4ePk5ufo6evs7e7v7/D09vj6/P0zycH8AAAClElEQVR4XsXVaVMTaRSA0ScEoghCAgoOKoqCBBxIdDCKihtuqIgLKhNxQRSbZQY0KoqIqChxCYoCgnQgIBql/ZGapt7KW+1SjQXx+Xjrdp3qrre70cPZjJ7DT+zzlZd7vV6Pz0XMc/i0mY4S65yTml+nB7RmYpxf8zsidLdH07zENI8mNUlM82pyTqLFWzDZmXpm3yonq1xyDlyI9oRVVR1uyZ0f26VpXq8m5/JrfgHsvgmkHFA3zYv9ze022BFftqEotHqubNtsbS5dAVh7OzTetgyOtAHQWyJGwia/Ixi8WwCguCv6xnqL5ctQdh7u7wAOBUbf1CabtYtfADnDu2xJ5x5D5lQKsEa1iZGw84JlVuv2YD6gPDyRyJaJHKQdpacqAajoySKzvdGsnT0BXK8GeLoBbu/UNXmk2/dOARy/DyhNABcb5B3lFgCdpUBGwKyd9QESw8sBGiqhrB14/rc00m37dBpAyud0UCoBil5Hd8SM+tZFAKbv+z2s+DIV6WMtJI+lk9cnj3R7nYre2wLhZITjojvCTm0aadyc/FPbabCLA7ByChGN+zl7WhoZ7ELhpE4vjO4IG+zbWgbd+m/EY7B9WjfGc94ASZ+WInJ38SpbGolnbjc889wRsSNskXvcCoDBBgz2+lAOcOckorjBfx4hjcRZqwaoegAoFwD+bRU7UdvanwYkhO1m7MV7R0sBct+VWsm/kQlwPnBQHol3TN1utW6deceG9tnYGMqP7gib/6/9Rerlrh/9xxyyrX/P/8tDb12HGnxSho6G06OjHcjfls5CAOVYTf/YsxL5MmEn1bwcHbq6BFHkfvVzxy+zWCwY+36CcExkwjbfn7ctv2H7mJviF2C6Oq0OnAMDTmLXVyfLf3CYhGrPAAAAAElFTkSuQmCC\") !important;",
" }",
" .logo>a>img {",
" opacity: 0;",
" -ms-opacity: 0;",
" }",
"",
" .jspVerticalBar, .jspHorizontalBar, pre {",
" background: transparent !important;",
" }",
"",
" #devdoc-nav>.jspContainer>.jspPane {",
" right: 0 !important;",
" }",
"",
" li a.selected {",
" padding:2px 4px 2px 4px;",
" border-radius:2px;",
" color:red !important;",
" }",
"",
" th, div#jd-header, .jd-details-title {",
" background-color:black !important;",
" padding:4px !important;",
" border-radius:2px !important;",
" }",
"",
" span.sympad{",
" color: violet;",
" }",
" ",
" div.jspContainer {",
" border:0px !important;",
" }",
"",
" div#nav-swap {",
" border-top:1px solid #181818 !important;",
" }",
"",
" b {",
" color:yellow !important;",
" }",
" ",
" strong{",
" font-weight:bold;",
" color: black;",
" }",
"",
" span.new, span.new-child {",
" color:#ffff00 !important;",
" }",
"",
" code {",
" color:red !important;",
" }",
"",
" pre {",
" background-color: black !important;",
" }",
"",
" .locales select, .sites select {",
"   background: black right center no-repeat;",
" }",
"",
" #packages-nav li.selected a, #packages-nav li.selected a:active, #packages-nav li.selected",
" a:visited,",
" #classes-nav li li.selected a, #classes-nav li li.selected a:active, #classes-nav li li.selected",
" a:visited,",
" #nav-tree li div.selected {",
" font-weight: 500;",
" color: black;",
" background-color:black;",
" }"
].join("\n");
if (typeof GM_addStyle != "undefined") {
GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
addStyle(css);
} else {
var node = document.createElement("style");
node.type = "text/css";
node.appendChild(document.createTextNode(css));
var heads = document.getElementsByTagName("head");
if (heads.length > 0) {
heads[0].appendChild(node); 
} else {
// no head yet, stick it whereever
document.documentElement.appendChild(node);
}
}
})();
