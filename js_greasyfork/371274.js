// ==UserScript==
// @name        Google Keep Dark Night Mode Theme (now native by google)
// @namespace   english
// @description Google Keep Dark Night Mode Theme - currently undergoing build
// @include     http*://*keep.google.com*
// @version     2.1
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/371274/Google%20Keep%20Dark%20Night%20Mode%20Theme%20%28now%20native%20by%20google%29.user.js
// @updateURL https://update.greasyfork.org/scripts/371274/Google%20Keep%20Dark%20Night%20Mode%20Theme%20%28now%20native%20by%20google%29.meta.js
// ==/UserScript==



var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '                                                 body {/*\n*/    background-color: #3b3b3b;/*\n*/   /*\n*/}.gb_uc, .gb_vc {/*\n*/   /*\n*/    color: rgba(195, 195, 195, 0.9);/*\n*/}.gb_rc    svg, .gb_rc     svg {/*\n*/    color: white  !important  ;/*\n*/ }.gb_lc {/*\n*/    color: #e9e9e9;/*\n*/ }.Q0hgme-fmcmS-LgbsSe {/*\n*/    /*\n*/    color: rgba(228, 228, 228, 0.9);/*\n*/   /*\n*/}.Q0hgme-fmcmS-LgbsSe:not(.VIpgJd-LgbsSe-OWB6Me):not(.JbbQac-AHmuwe-i5vt6e):not(.fmcmS-LgbsSe-di8rgd-i5vt6e):focus, .Q0hgme-fmcmS-LgbsSe:not(.VIpgJd-LgbsSe-OWB6Me):not(.fmcmS-LgbsSe-di8rgd-i5vt6e):hover {/*\n*/    background-color: rgba(255, 255, 255, 0.1);/*\n*/}.Q0hgme-fmcmS-LgbsSe:not(.VIpgJd-LgbsSe-OWB6Me):focus, .Q0hgme-fmcmS-LgbsSe:not(.VIpgJd-LgbsSe-OWB6Me):hover {/*\n*/    color: #dadada;/*\n*/}.hSRGPd-haAclf .hSRGPd:hover {/*\n*/    color: rgba(186, 186, 186, 0.9);/*\n*/}.hSRGPd-haAclf .hSRGPd {/*\n*/    color: rgba(233, 233, 233, 0.5);/*\n*/    /*\n*/}.neVct-LS81yb-tJHJj {/*\n*//*\n*/    color: rgba(225, 225, 225, 0.5);/*\n*/   /*\n*//*\n*/} .VIpgJd-TUo6Hb-xJ5Hnf.XKSfm-L9AdLc-AHe6Kc {    background-color: #3e3e3e;}  header.gb_Ta { filter:invert(100%)hue-rotate(184deg)saturate(120%)brightness(120%)  !important ;/*\n*/}.gb_9a,.gb_Bb{filter: invert(100%)hue-rotate(180deg);/*\n*/ }/*\n*//*\n*//*\n*//*\n*/body ,html, html body {/*\n*/  /*\n*/    background: #544f4f !important ;background-color: #544f4f !important ;/*\n*/}/*\n*//*\n*//*\n*/.gb_qc .gb_Ta svg, .gb_qc .gb_lc svg {/*\n*/    /*\n*/   /*\n*/        /*\n*/    opacity: 0.6;/*\n*/}/*\n*/ .gb_Ta a, .gb_lc a {    color: #212121;}  body .gb_rc svg, body .gb_rc svg {    color: black !important;}  .neVct-LS81yb-tJHJj {/*\n*/    color: rgba(255, 255, 255, 0.54) !important ;/*\n*/ /*\n*/} /* width *//*\n*/::-webkit-scrollbar {/*\n*/    min-width: 5px;/*\n*/}/*\n*//*\n*//* Track *//*\n*/::-webkit-scrollbar-track {/*\n*/    box-shadow: inset 0 0 5px grey; /*\n*/    border-radius: 3px;/*\n*/    background:#999/*\n*/}/*\n*/ /*\n*//* Handle *//*\n*/::-webkit-scrollbar-thumb {/*\n*/    background: #666;  /*\n*/}/*\n*//*\n*//* Handle on hover *//*\n*/::-webkit-scrollbar-thumb:hover {/*\n*/    background: #444; /*\n*/}.VIpgJd-TUo6Hb-xJ5Hnf.XKSfm-L9AdLc-AHe6Kc {    background-color: #252525  !important ; }             ';
document.getElementsByTagName('head')[0].appendChild(style);

