// ==UserScript==
// @name Liquidity.Vision Blues (Dark) Edition
// @namespace https://greasyfork.org/users/517035
// @version 0.0.4
// @description This is the Liquidity Blues (Dark) edition for Liquidity.Vision
// @author zirs3d
// @license CC0-1.0
// @grant GM_addStyle
// @run-at document-start
// @match https://liquidity.vision/
// @downloadURL https://update.greasyfork.org/scripts/411871/LiquidityVision%20Blues%20%28Dark%29%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/411871/LiquidityVision%20Blues%20%28Dark%29%20Edition.meta.js
// ==/UserScript==

(function() {
let css = `
    @media (prefers-color-scheme: dark) {
        /* Disable */
        div:not(.bp),
        html {
            background: transparent !important;
            background-color: transparent;
        }
   
        /* Additional */
        .page-main-header {
			z-index: 20 !important;	
        }
        
        .table.results-table thead th {
            color: #38dada !important;
        } 

        .tml {
            color: #ca4aff !important;
        }

        .iconsidebar-menu span,
		.iconsidebar-menu i {
            color: #b5b5b5 !important;
		}
         
        .results-table th a.anchor-link {
        background-color: black !important;
            color: #b5b5b5 !important;
        }

       .page-main-header {
           max-width: 100% !important;
       }
   
       .page-body-wrapper {
           width: 102% !important;
       }
        
        .card-absolute > .card-body {
            padding: 50px 15px 0 15px !important
        }
        
        .portfolio-entry li {
            padding: 0 5px !important;
        }
        
       /** td.f-w-700 {
            min-width: 290px !important;
        }
        **/
   
        div.page-main-header,
        a.nav-link,
        a.anchor-link {
            background: #3f7a7a !important;
        }
   
        a.center-block.nav-link:hover {
            background-color: #496d58 !important;
        }
   
        a.nav-link,
        .center-block .nav-link {
            padding: 5px 50px 8px 5px !important;
        }
   
        a.center-block.nav-link {
            margin-top: 5px !important;
        }
   
   
        li.nav-item .nav-link {
            padding: 10px 0 10px 0 !important;
            background-color: #2f2f2f !important;
        }
   
        li.nav-item .nav-link.active {
            background-color: #3f7a7a !important;
        }
   
   
        .tooltip .arrow::before {
            border-top-color: #3f7a7a !important;
        }
   
        .tooltip .tooltip-inner {
            background-color: #4c6966 !important;
        }
   
        /* Text */
        div.u-textColorNormal,
        h1.u-textColorDark,
        p,
        td,
        div,
        figcaption,
        li,
        a,
        h1,
        h2,
        h3,
        h4 {
            color: #f8f8f2 !important;
            background-color: transparent;
        }
   
        a {
            text-decoration: underline !important;
            background: #292929 !important;
        }
   
   
   
        /* Root */
        .u-backgroundWhite,
        section,
        body,
        footer,
        .iconMenu-bar {
            background-color: #282a36 !important;
            color: #f8f8f2 !important;
        }
   
   
        /* code, pre */
        pre {
            background-color: #1e2029!important;
        }
   
   
        /* Popup */
        div.modal-body,
        div.web3modal-modal-card {
            background: #202020 !important;
            margin: 197px -2px -2px -2px !important;
        }
   
        .welcome-popup .modal-header {
            display: none !important;
        }
   
        .modal-dialog.welcome-popup.modal-dialog-centered.modal-md {
            background: black !important;
        }
   
   
   
        /* Logo */
       .recent-images {
           min-width: 64px !important;
       } 
        
        /* Buttons */
        button {
            color: #f8f8f2 !important;
            background-color: #282a36 !important;
            border-color: #f8f8f2 !important;
        }
   
        /* Navigation */
        nav {
            background-color: #6a737d33 !important;
            padding-bottom: 5px;
        }
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
