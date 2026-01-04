// ==UserScript==
// @name         CSDN 轻优化
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  CSDN 移除搜索关键词、git仓库关键词链接、代码块自动展开，免关注阅读
// @author       上官永石
// @match        *.csdn.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537060/CSDN%20%E8%BD%BB%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/537060/CSDN%20%E8%BD%BB%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
  // ref: https://greasyfork.org/zh-CN/scripts/405259-csdn%E5%85%8D%E7%99%BB%E5%BD%95
  // 设置部分元素不显示
  /*
  const style=document.createElement('style');
  document.documentElement.append(style);
  function genstyle(){
      const style=[
      `
      #recommend,.feed-Sign-weixin,#csdn-toolbar-write,.csdn-side-toolbar>:not(.option-box),.passport-login-tip-container,[class*=advert],.hide-preCode-box,.recommend-nps-box,.readall_box,.comment_read_more_box,.btn_open_app_prompt_div,.feed-Sign-span,.search-tag-box,.aside-header-fixed,.wap-shadowbox,.article-search-tip,#csdn-redpack,.csdn-reapck-select,.redpack-select-back,.toolbar-advert-default,.passport-login-container,[class^='banner-ad'],[id^='kp_box'],.post_feed_box,.signin,.more-toolbox,.right_box,div.container>nav,div.login-box,div.enterprise_blog,div.recommend-box,div.hide-article-box,aside,div#rightAside,div.write-guide,div.login-mark{display: none !important;}
      div.comment-list-box{max-height: unset !important;}
      div.article_content{height: auto !important;overflow:auto !important;}
      pre{height: auto !important;}
      main{margin: 0 auto !important;float: none !important;}
      main *,#main *{ max-height: unset !important;}
      #main{margin-top:0 !important;}
      body{min-width: 100% !important;}
      @media screen and (max-width: 1200px){
          .csdn-toolbar,.bottom-pub-footer  {
              display: none !important;
          }
      }
      #operate{height:auto !important;}
      #comment{max-height:none !important;}
      code,code *{user-select:text  !important;}
      `];
      return style.join('\n');
  }
  function update(){style.innerHTML=genstyle();}
  update();
  */


  // 解除复制的限制
  document.addEventListener('copy',e=>e.stopImmediatePropagation(),true);

  // 移除搜索词
  const querySelectorAllAndSelf = (target, selector) => {
      const matchesSelf = target.nodeType === 1 && typeof target.matches === 'function' && target.matches(selector) ? [target] : [];
      return [...matchesSelf, ...target.querySelectorAll(selector)];
  };
  const replaceRepoSpans = target => {
      querySelectorAllAndSelf(target,'span.words-blog, span.hl-git-1').forEach(span=>{
          const textNode=document.createTextNode(span.textContent);
          span.replaceWith(textNode);
      });
  };

  const handleMutations = target => {
      querySelectorAllAndSelf(target,'a[href*="so.csdn.net"]').forEach(link=>link.replaceWith(link.textContent));
      replaceRepoSpans(target);
  };

  handleMutations(document);

  new MutationObserver((mutations,observer)=>mutations.forEach(record=>record.addedNodes.forEach(target=>{
      if(target.nodeType==1){
          handleMutations(target);
      }
  }))).observe(document.documentElement,{subtree:true,childList:true});

  // 代码块自动展开，ref: https://greasyfork.org/zh-CN/scripts/452917-csdn%E4%BB%A3%E7%A0%81%E6%A1%86%E5%B1%95%E5%BC%80-%E5%85%8D%E5%85%B3%E6%B3%A8%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87
  const code_expand_buttons = document.querySelectorAll(".look-more-preCode");
  code_expand_buttons.forEach(
      function(button) {
          button.click();
      }
  )

  // 免关注阅读全文，ref: https://greasyfork.org/zh-CN/scripts/449561-csdn%E5%85%8D%E5%85%B3%E6%B3%A8%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87
  console.log(document.querySelector('.hide-article-box'));
  // 检查 .hide-article-box 元素是否存在
  const hideArticleBox = document.querySelector('.hide-article-box');
  if (hideArticleBox) {
      hideArticleBox.style.display = 'none';
  }
  document.querySelector('#article_content').style.height = 'auto'

})();