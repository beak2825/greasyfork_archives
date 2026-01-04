// ==UserScript==
// @name Just.game Naked Curvy
// @namespace https://greasyfork.org/users/517035
// @version 0.0.3
// @description This is the Naked Curvy NCoV19 edition for Just.game ( Curvy.One )
// @author zirs3d
// @license CC0-1.0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.just.game/*
// @downloadURL https://update.greasyfork.org/scripts/404742/Justgame%20Naked%20Curvy.user.js
// @updateURL https://update.greasyfork.org/scripts/404742/Justgame%20Naked%20Curvy.meta.js
// ==/UserScript==

(function() {
let css = `
    /* Logo Header */
    .header {
        background-color: #c8c5c5 !important;
    }
    
    /* Root */
    html {
        color: #282a36 !important;
        background-color: #dcdcdc !important;
    }
    
    #preloader {
        color: #282a36 !important;
        background-color: #dcdcdc !important;
    }
    
    #preloader h4 {
        color: #ff004e !important;
        background-color: #dcdcdc !important;
    }
    
    /* Disable */
    body.loaded,
    header,
    .flip span,
    .block li::before,
    .block span::after,
    .tab-content li .item,
    .tab-content li div:before,
    .header .my-account,
    .card-box,
    .card-box .inner,
    .block,
    .block-subtitle,
    .grand-total,
    .bottom,
    .middle-tabs .tabs .tab-title,
    .sidebar-main .tabs .tab-title,
    .sidebar-main .tab-content,
    .item-info:before,
    .card :before,
    .board .details .card.balance:before,
    .your-key:before,
    .panel li,
    .panel li:before {
        background: transparent !important;
        background-color: transparent;
    }
    
    /* Text */
    p,
    span,
    figcaption,
    li,
    div,
    a,
    input,
    .input-group input:hover,
    span.wp2.svelte-1mv0e4h,
    .grand-total div.number,
    .plus div.number,
    div.block-subtitle p,
    .info b,
    div.sidebar-main p,
    .h-chart .highcharts-xaxis-labels text:first-child,
    .h-chart .highcharts-xaxis-labels text tspan:not(:first-child),
    .top-bar div.number,
    .modal-content .content h5,
    .upgrade b {
        fill: #4b4b4b !important;
        color: #4b4b4b !important;
    }
    
    .content h4,
    .content h5,
    .hexagon span,
    .suffix,
    .link,
    .block .number,
    .block p,
    .rate,
    .expiration,
    .left-sidebar .total,
    .item-details span,
    .item-details div,
    .item-details div.number,
    .sidebar-main h4,
    .sidebar-main .timer,
    .sidebar-main .inner .title,
    .your-key span,
    .middle-tabs .actions .title,
    .middle-tabs .actions .number,
    .explanation.type span.value.highlighted,
    .open .item-title,
    .success {
        color: #f8f8f2 !important;
    }
    
    .middle-tabs .total .title,
    .sub-title {
        font-weight: bold !important;
    }
    
    .middle-tabs .title,
    .sub-title,
    .actions .number {
        opacity: 1 !important;
    }
    
    .middle-tabs .details {
        font-weight: bold !important;
        background-color: #ffffffe0;
    }
    
    .middle-tabs .content p {
        background-color: #dbdbdb9e;
        opacity: 1 !important;
    }
    
    .flip span {
        text-shadow: 0 0 11px #f81a44 !important;
    }
    
    .yellow-skin .number.with-diamond {
        color: #ff004e !important;
    }
    
    /* Button */
    span.copy-message {
        color: #c8c5c5 !important;
        font-weight: 600;
    }
      
    .text-copy .icon-copy {
        opacity: 0.6 !important;
    }

    .middle-tabs .tab-title:hover,
    .middle-tabs .active,
    .sidebar-main .tab-title:hover,
    .sidebar-main .active {
        color: #ff004e !important;
    }
    
    .sidebar-main .tab-title:hover:after,
    .sidebar-main .tab-title.active:after {
        background: #830028 !important;
    }
    
    .header #loginLink {
        background-color: #ff004e !important;
    }
    
    .right-area .btn {
        color: #4b4b4b !important;
    }
    
    .right-area .btn:hover {
        color: #f8f8f2 !important;
    }
    
    .btn span {
        color: #f8f8f2 !important;
    }
    
    .btn-logout span {
        color: #f8f8f2 !important;
    }
    
    .btn-logout :before {
        background: #e63030 !important;
    }
    
    /* tabled */
    table,
    .user-tab .data,
    .user-tab .number {
        color: #4b4b4b !important;
        background-color: #c8c5c5 !important;
    }
    
    .user-tab .id {
        font-weight: bold;
        opacity: 0.8 !important;
    }
    
    .table .number {
        color: #4b4b4b !important;
    }
    
    th,
    .user-tab tr:hover,
    .user-tab tr:hover .number {
        color: #4b4b4b !important;
        background-color: #e5e5e5 !important;
    }
    
    .user-tab th.id {
        opacity: 1 !important;
    }
    
    .actions {
        background: #ef6767cf !important;
    }
    
    /* Popup */
    .tooltip {
        background-color: #000;
        padding: 2px;
        opacity: 1 !important;
    }
    
    .icon-question {
        opacity: 1 !important;
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
