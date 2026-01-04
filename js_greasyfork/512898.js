// ==UserScript==
// @name Santae Semi-Dark Theme
// @namespace github.com/openstyles/stylus
// @version 1.0.3
// @description A slightly more minimalist, darker / higher contrast theme for Santae. Approved by staff!
// @author Zelda #3447
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @include /^(?:https?://www.santae.net(?!(/profile/)).*)$/
// @downloadURL https://update.greasyfork.org/scripts/512898/Santae%20Semi-Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/512898/Santae%20Semi-Dark%20Theme.meta.js
// ==/UserScript==

(function() {
let css = `
    .headerSection 
    {
        padding: 0px;
    }
    
    .logosec
    {
        visibility: hidden;
    }
    
    .headerForeground
    {
        background: none;
    }
   
    footer
    {
        background: #2c2c2c !IMPORTANT;
        
    }
    
    .forumPage
    {
        background: repeating-linear-gradient(
          to right,
          #222,
          #222 50px,
          #333 50px,
          #333 100px);
         color: #000;
    }
    
    .text-muted, .text-success
    {
        color: #000 !IMPORTANT;
    }
    
    .btn, .nw_layout_menubar, .top-heading, .top-wrapping, .remove-icon, .remove-icon:hover, .badge, .active > .page-link, .harvesting_timer
    {
        background: #222 !IMPORTANT;
        border-color: #222 !IMPORTANT;
    }
    
    .alert-success, .alert-danger, .alert-info
    {
        background: #555 !IMPORTANT;
        border-color: #555 !IMPORTANT;
        color: #FFF !IMPORTANT;
    }
    
    .disabled > .page-link
    {
        visibility: hidden;
    }
    
    .page-link
    {
        color: #000 !IMPORTANT;
    }
    
    .currency_link, .alsotry, .maragreen, #servertime, .time, .webFooter a, .btn, .remove-icon, .fa.text-success, .active > .page-link, .harvesting_timer
    {
        color: #fff !IMPORTANT;
    }
    
    .fa
    {
        background: none !IMPORTANT;
    }
    
    .inventory-tile
    {
        background: linear-gradient(rgb(230, 247, 255) 0%, rgb(230, 247, 255) 40%, rgb(179, 179, 179) 100%) !IMPORTANT;
    }
    
    
    .btn > .rounded-pill 
    {
        color: #000;
        background: #fab000 !IMPORTANT;
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
