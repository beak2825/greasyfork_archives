// ==UserScript==
// @name			Disable Weibo Article FollowMask
// @name:zh-CN			取消微博文章关注阅读全文
// @description                 用来解除部分微博文章要求关注作者才能阅读全文的限制
// @version	 		1.03
// @author			参考 GensouSakuya
// @include			*weibo.com/ttarticle/*
// @namespace https://greasyfork.org/users/928131
// @downloadURL https://update.greasyfork.org/scripts/446850/Disable%20Weibo%20Article%20FollowMask.user.js
// @updateURL https://update.greasyfork.org/scripts/446850/Disable%20Weibo%20Article%20FollowMask.meta.js
// ==/UserScript==
(function () {
// 若要开启实验性功能，请将下方 experimentalFunction = false 改成 experimentalFunction = true
  const experimentalFunction = false
  "use strict";
  function bodyObservation(mutations,observer){
    for (let mutation of mutations) {
        try {
            document.querySelectorAll('div[class^="WB_editor_iframe"]')[0].style.height='auto';
        } catch (error) {
            ;
        }
    }
  }
  const bodyObserverConfig = {childList:true,subtree:true}
  const bodyObserver = new MutationObserver(bodyObservation)
  bodyObserver.observe(document.body,bodyObserverConfig)
})();