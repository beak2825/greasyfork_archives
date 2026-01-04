// ==UserScript==
// @name Early 2012 roblox blog
// @namespace whocares.net
// @version 1.0.0
// @description makes roblox blog pretty
// @author legosavant
// @license mit
// @grant GM_addStyle
// @run-at document-start
// @match *://*.blog.roblox.com/*
// @downloadURL https://update.greasyfork.org/scripts/457989/Early%202012%20roblox%20blog.user.js
// @updateURL https://update.greasyfork.org/scripts/457989/Early%202012%20roblox%20blog.meta.js
// ==/UserScript==

(function() {
let css = `
    * {
        letter-spacing:0
    }
    a {
        color: #1177DD;
    }
    body, input, textarea {
        color: #373737;
        font: 300 15px/1.625 Arial,sans-serif;
    }
    #header .branding {
        display:none
    }
    #header nav a {
        color: #B2B2B2;
        display: block;
        font-size: 10px;
        font-weight: normal;
        height: 22px;
        line-height: 16px;
        margin-left: 0px;
        padding: 0 7px;
        letter-spacing:0;
        transition:none;
        font-family:arial
    }
    #header nav li {
        float:right;
        margin:0
    }
    #header nav {
        padding:0;
        float:right;
        line-height:1;
        margin:0
    }
    #header nav .inner {
        height:22px
    }
    #header {
        background:#383838;
        height:auto
    }
    #header > div {
        max-width:868px;
        margin:auto;
    }
    #header .language-switcher.desktop {
        color: #B2B2B2;
        font-size: 10px;
        font-weight: normal;
        height: 22px;
        line-height: 16px;
        margin-left: 0px;
        padding: 0 7px;
        letter-spacing:0;
        transition:none;
        font-family:arial;
        left:65px;
        right:auto
    }
    #header nav a:hover, #header .language-switcher.desktop:hover {
        background-color: #333;
        background-image: url(http://web.archive.org/web/20120205205918im_/http://blog.roblox.com/wp-content/themes/roblox/images/bg_utilities.png);
        color:#fff
    }
    .no-touch #header .language-switcher:hover .wpml-ls {
        left:65px;
        background:#363636;
        padding:0
    }
    #header .language-switcher.desktop > span {
        display:none
    }
    #header .language-switcher.desktop:before {
        content:attr(aria-label);
    }
    /*page*/
    .page-contents {
        max-width:900px;
        margin:0 auto;
        padding-top:23px
    }
    .hero-block .centered-copy {
        display:none
    }
    body {
        background-image: url(https://web.archive.org/web/20120206121136im_/http://community.roblox.com/wp-content/uploads/2011/12/bkg.jpg);
        background-repeat: repeat;
        background-position: top left;
        background-attachment: scroll;
        background-color:#B72F19
    }
    .single .page-contents::after, .page-template-page-career .page-contents::after, .page-template-page-parents .page-contents::after, .page-template-page-faq .page-contents::after {
        content:none
    }
    body:not(.single) .hero-block {
        background-image:url("https://web.archive.org/web/20120206121136im_/http://community.roblox.com/wp-content/uploads/2011/12/header_04.png");
        background-size:auto;
        height:108px;
        min-height:0;
        background-color:transparent
    }
    .single.roblox-blog .hero-block {
        background-size:contain;
        height:408px;
        min-height:0;
        background-color:transparent;
        background-color:#000
    }
    .news-list.blog li a .blurb h2, .news-detail .detail-heading h1 {
        font-size: 44px;
        line-height: 1em;
        padding-bottom: 0.1em;
        color:#DD0000;
        margin:0;
        min-width:600px;
        word-break:keep-all;
        font-weight:600
    }
    .news-list.blog li a .blurb:hover h2 {
        text-decoration:underline
    }
    .news-list.blog li a .blurb span, .news-detail .detail-heading .info, .news-detail .detail-heading .info p {
        color:#666;
        font-size:12px;
        line-height:18px
    }
    .news-detail .detail-heading .info p {
        font-weight:700
    }
    .news-detail {
        padding:0 30px
    }
    .news-detail .page-details .content {
        width:840px
    }
    .news-list.blog li a .blurb span.author {
        max-width:500px;
        display:inline-block;
        text-overflow:ellipsis;
        overflow:hidden;
        white-space:nowrap;
        height:16px;
        line-height:20px;
        position:relative;
        margin-bottom:-2px
    }
    .news-detail .detail-heading {
        margin:0 0 24px 0;
        border:0;
        padding:0
    }
    .wysiwyg p, .wysiwyg p span,
    .news-detail .detail-heading ~ div p span, .news-detail .detail-heading ~ div p {
        color: rgb(55, 55, 55);
        font: 300 15px / 1.625 Arial, sans-serif
    }
    .wysiwyg h2, .wysiwyg h2 b,
    .news-detail .detail-heading ~ div h2, .news-detail .detail-heading ~ div h2 b {
        font: 300 15px / 1.625 Arial, sans-serif;
        color: #000;
        font-weight: bold;
        margin: 0 0 0.8125em;
    }
    .news-list ul {
        display:block;
        padding:0 30px
    }
    .news-list.blog li {
        width:100%;
        border-bottom: 1px solid #ddd;
        margin: 0 0 1.625em;
        padding: 0 0 1.625em!important;
    }
    .news-list.blog li a {
        display:flex;
        flex-direction:column-reverse;
        min-height:200px;
        justify-content:start;
        height:100%;
    }
    .news-list.blog li a .img-holder {
        margin:0;
        width:300px;
        border: 1px solid #ddd;
        padding: 6px;
        vertical-align:bottom;
        position:absolute;
        right:0;
        bottom:58px
    }
    .news-list.blog li a .img-holder .img-wrap {
        transform:none!important
    }
    .news-list.blog li a .blurb p {
        color: #373737;
        font: 300 15px/1.625 Arial,sans-serif;
        margin-bottom: 1.625em;
        min-height:168px
    }
    .archive .control+.news-list, .blog .control+.news-list {
        margin-top:16px
    }
    .news-list.blog li a .blurb > *:not(h2) {
        max-width:310px
    }
    .news-list li:nth-child(1) .blurb p, .news-list li:nth-child(2) .blurb p {
        display:block
    }
    .news-list #nav-below.navigation {
        margin:0!important
    }
    .btn-w-border {
        background:none!important;
        border:0;
        color:#1177DD;
        font:700 12px arial;
        text-transform:none;
        letter-spacing:0
    }
    .btn-w-border:hover {
        text-decoration:underline
    }
    .has-limit {
        background:#fff;
        display:flex;
        flex-direction:row-reverse
    }
    .control {
        background:#333;
        padding:12px;
        width:175px
    }
    .roblox-blog .control .filters {
        display:block;
        height:auto;
        margin:0
    }
    .roblox-blog .control .filters fieldset {
        position:static;
        margin:10px 0!important;
        outline:none!important
    }
    .control .filter .dropdown__menu {
        display:block;
        position:static;
        max-height:none;
        overflow:hidden;
    }
    .control .dropdown button {
        color: #fff!important;
        font-size: 10px;
        font-weight: 500;
        letter-spacing: 0.1em;
        line-height: 2.6em;
        text-transform: uppercase;
        padding:0;
        background:none!important
    }
    .dropdown__menu {
        border:0
    }
    .dropdown__menu-link {
        font: 700 13px/1.625 Arial,sans-serif;
        letter-spacing:0;
        text-transform:none;
        width:auto;
        padding:0;
        background:none!important;
        color:#fff!important
    }
    .dropdown__menu-item {
        min-height:0
    }
    .dropdown button, .dropdown__menu-link {
        min-height:0;
        background:none;
        border:0
    }
    .control form input[type="text"] {
        border-radius: 0;
        background-image: url(http://web.archive.org/web/20120205205918im_/http://blog.roblox.com/wp-content/themes/roblox/images/search.png);
        background-position:4px center;
        border: 1px solid #BBB;
        color: #fff;
        background-color:transparent;
        transform:none!important;
        text-transform:none;
        min-height:0;
        height:22px;
        line-height: 1.2em;
        padding: 4px 10px 4px 28px;
        width:134px;
        text-indent:0;
        transition:none!important;
        outline:none!important
    }
    .control form {
        width:174px
    }
    .control .filters fieldset.form-holder .clear {
        height:30px;
        width:30px;
        background:none
    }
    .control .filters fieldset.form-holder .clear .icon {
        top:-6px;
        bottom:0;
        height:30px;
        width:30px;
    }
    .control form input[type="text"]::placeholder {
        text-transform:none;
        font-family:arial;
        letter-spacing:0;
        color:#888;
        font-weight:300;
        font-size:14px
    }
    footer {
        width:900px;
        margin:0 auto;
        background:white;
        box-sizing:border-box;
        height:auto;
        min-height:0
    }
    .footer-contents {
        padding:0!important
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
