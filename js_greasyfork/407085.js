// ==UserScript==
// @name         github界面优化
// @description  github
// @namespace    gt_hb
// @version      1.0.3
// @author       vizo
// @require      https://cdn.jsdelivr.net/npm/jquery@3.3.1/dist/jquery.min.js
// @include      https://github.com/*
// @include      https://github.com.cnpmjs.org/*
// @include      https://hub.fastgit.org/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @noframes

// @downloadURL https://update.greasyfork.org/scripts/407085/github%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/407085/github%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==


GM_addStyle(`
  #backtop_act_hgr5 {
    width: 30px;
    height: 30px;
    background: rgba(0,0,0,.2);
    cursor: pointer;
    border-radius: 55%;
    position: fixed;
    right: 40px;
    bottom: 80px;
    z-index: 9998;
  }
  .t-center .container-xl,
  .t-center .js-repo-nav,
  .t-center .pagehead,
  .t-center .Header-item--full,
  .t-center main > .hide-full-screen > .d-flex {
    max-width: 1200px !important;
    margin-left: auto !important;
    margin-right: auto !important;
  }
  .js-repo-nav {
    position: relative;
  }
  .qh_bj,
  .tgethub {
    min-width: 68px;
    cursor: pointer;
    padding: 5px 6px;
  }
  .tgethub:hover {
    outline: 1px solid #888;
    color: #fff;
  }
  .cde1s {
    padding: 0 !important;
    font-size: 16px !important;
    border: 1px solid #87afde;
    display: block;
  }
  .cde1s pre {
    margin-bottom: 0;
  }
  .cde1s pre:hover {
    background-color: #f1f3f9;
  }
  
  .tget-git-btn {
    padding: 5px 6px;
    margin-left: 10px;
    cursor: pointer;
  }
  .tget-git-btn:hover {
    color: #fff;
    outline: 1px solid #e1e1e1;
  }
  html.s-fastgit header.Header-old {
    background-color: #4a7;
  }
  html.s-fastgit .js-site-search-form label.form-control {
    background-color: #185;
  }
`)

$(function() {
  const backTopSlow = () => {
    const sTop = document.documentElement.scrollTop
    const innerFunc = () => {
      if (document.documentElement.scrollTop > 0) {
        document.documentElement.scrollTop -= sTop / 20
        requestAnimationFrame(innerFunc)
      }
    }
    innerFunc()
  }
  
  function initFunc() {
    let isFastHub = location.host.includes('fastgit')
    $('html').addClass(isFastHub ? 's-fastgit' : 's-github')
    $('pre').wrap('<code class="cde1s"></code>')
    if (isFastHub) {
      $('.p-responsive .HeaderMenu > .flex-items-center').append(`
        <div class="tget-git-btn">转到git<div>
      `)
    } else {
      $('.tgethub').text('转到fast')
    }
    
    $('body').on('click', '.tgethub, .tget-git-btn', function() {
      let fastUrl = 'https://hub.fastgit.org' + location.pathname
      let gitUrl = 'https://github.com' + location.pathname
      location.href = isFastHub ? gitUrl : fastUrl
    })
  }
  
  $('body').append('<div id="backtop_act_hgr5"></div>')
  $('body').addClass('t-center')
  
  $('.Header-item--full.width-full').after(`
    <div class="Header-item tgethub">转到fast</div>
    <div class="Header-item qh_bj">切换布局</div>
  `)
  
  $('body').on('click', '#backtop_act_hgr5', function() {
    backTopSlow()
  })
  
  $('body').on('click', '.qh_bj', function() {
    $('body').toggleClass('t-center')
  })
  
  initFunc()
})
