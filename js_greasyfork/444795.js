// ==UserScript==
// @name        神百目录优化
// @namespace   Violentmonkey Scripts
// @match       https://wiki.52poke.com/*
// @grant       GM_addStyle
// @version     0.0.2
// @author      LinHQ
// @description 神奇宝贝百科样式优化
// @license GPLv2
// @downloadURL https://update.greasyfork.org/scripts/444795/%E7%A5%9E%E7%99%BE%E7%9B%AE%E5%BD%95%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/444795/%E7%A5%9E%E7%99%BE%E7%9B%AE%E5%BD%95%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==



(()=>{
  const ijstyle = `
  thead {
    position: sticky;
    top: 0;
    margin: -1px;
    background: rgba(255 255 255 / .6);
    backdrop-filter: blur(4px);
  }

  div#content {
    position: relative;
    z-index: 10;
  }
  div#toc {
    position: fixed;
    top: 0;
    left: 0;
    background: rgb(255 255 255 / 48%);
    box-shadow: #777777 2px 1px 6px 0px;
    width: 13em;
    backdrop-filter: blur(4px);
  }
  div#toc>ul {
    max-height: calc(100vh - 35px);
    overflow: auto;
  }
  div#toc .toclevel-4:nth-of-type(2n) a{
    color: #99bbff!important;
  }
  div#toc>ul::-webkit-scrollbar {
    display: none;
  }
  `  
  GM_addStyle(ijstyle)
})()