// ==UserScript==
// @name compact google classroom
// @namespace https://greasyfork.org/en/users/759797-lego-savant
// @version 1.0.0
// @description google classroom but its actually usable on 720p screens
// @author legosavant
// @grant GM_addStyle
// @run-at document-start
// @match *://*.classroom.google.com/*
// @downloadURL https://update.greasyfork.org/scripts/433529/compact%20google%20classroom.user.js
// @updateURL https://update.greasyfork.org/scripts/433529/compact%20google%20classroom.meta.js
// ==/UserScript==

(function() {
let css = `
    /*home*/
    .gHz6xd, .v9TZ3c {
        margin:0;
        border-radius:0
    }
    .gHz6xd.rZXyy:not(.kKn9Nc):not(.u0dx8e):hover {
        border:1px solid transparent;
        margin:0;
    }
    .SZ0kZe, .SZ0kZe .Y5FYJe>.TpQm9d {
        height:30px;
        padding:0
    }
    .Y5FYJe:hover {
        background:none
    }
    .TQYOZc {
        padding:4px 10px
    }
    .gHz6xd {
        max-height:260px
    }
    .JwPp0e {
        padding:0;
    }
    .XIpEib, .R2tE8e, .joJglb, .Mtd4hb, .mhCMAe, .xHPsid .hN1OOc { /*nav*/
        height:35px
    }
    .bg6sud {
        padding-top:0
    }
    /*sidebar*/
    .Xi8cpb, .Xi8cpb.vG1fDb {
        height:40px;
        padding:0 8px
    }
    .pkktJb {
        height:20px;
    }
    .LlcfK {
        border-radius:0;
        margin:0
    }
    /*stream*/
    .d4Fe0d {
        border-radius:0
    }
    .VKARh {
        top:100px
    }
    .PFLqgc, .v9TZ3c, .qyN25 {
        height:150px
    }
    .v9TZ3c.GWZ7yf {
        height:200px
    }
    .IzVHde {
        padding:6px 24px
    }
    
    .U2zcIf {
        display:none
    }
    .zOtZye {
        min-height:32px;
        border-radius:0;
        margin-bottom:4px
    }
    .zTrXGf {
        height:32px;
        padding-left:6px
    }
    .Aopndd {
        margin:0;
        border-radius:0;
    }
    .Aopndd[jsmodel="PTCFbe"]  {
        border-bottom:0
    }
    .n4xnA {
        padding:0
    }
    .JZicYb {
        height:44px
    }
    .oh9CFb {
        position:absolute;
        background:#fff;
        width:360px;
        z-index:999;
        box-sizing:border-box;
        padding:2px;
        visibility:hidden;
        margin-left:24px;
        box-shadow: 0 1px 2px rgb(0 0 0 / 10%);
    }
    .Aopndd:hover .oh9CFb {
        visibility:visible
    }

    /*classwork*/
    .u73Apc, .OlXwxf.OlXwxf:not(:first-child):hover .u73Apc, .OlXwxf:hover+.OlXwxf .u73Apc, .OlXwxf:not(:first-child).kKn9Nc .u73Apc, .OlXwxf+.lXuxY .u73Apc, .lXuxY+.OlXwxf .u73Apc {
        height:40px;
        padding:0
    }
    .tUJKGd:not(:first-child), .OlXwxf.OlXwxf:hover, .OlXwxf:hover+.OlXwxf, .OlXwxf {
        border-top:1px solid #e0e0e0
    }
    .xUYklb, .JBMs6 {
        padding-top:0;
        padding-bottom:0
    }
    .uO32ac {
        height:35px
    }
    .xUYklb, .XjYjO {
        font-size:26px
    }
    .KmLLod:hover .uO32ac {
        border-bottom:1px solid
    }
    /*people*/
    .ycbm1d, .d6CWTd {
        height:20px;
    }
    .gQZxn {
        padding:3px 8px
    }
    /*todo*/
    .MHxtic {
        padding:2px 0
    }
    /*dropdown*/
    .ncFHed .MocG8c, .ncFHed .MocG8c.KKjvXb, .HZ3kWc, .ry3kXd .MocG8c.KKjvXb {
        padding:0 0 0 6px;
        border:none
    }
    .ybOdnf .eU809d {
        top:16px
    }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
