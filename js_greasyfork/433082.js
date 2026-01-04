// ==UserScript==
// @name         JIRA测试用例输入提示
// @namespace    POM-3413
// @version      1.0
// @description  增加提示文字&首次输入自动填充
// @author       Armstrong@fanruan.com
// @match        https://work.fineres.com/projects/TT?*
// @match        https://work.fineres.com/projects/MTT?*
// @match        https://work.fineres.com/projects/QA?*
// @icon         http://fine-knowledge.oss-cn-shanghai.aliyuncs.com/daniel/pageId%3A272932649attachmentId%3A272933863.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433082/JIRA%E6%B5%8B%E8%AF%95%E7%94%A8%E4%BE%8B%E8%BE%93%E5%85%A5%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/433082/JIRA%E6%B5%8B%E8%AF%95%E7%94%A8%E4%BE%8B%E8%BE%93%E5%85%A5%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
      window.waitForAddedNode = function(params) {
    const observer = new MutationObserver(mutations => {
      const matched = [];
      for (const { addedNodes }
           of mutations) {
        for (const n of addedNodes) {
          if (!n.tagName) continue;
          if (n.matches(params.selector)) {
            matched.push(n);
          } else if (n.firstElementChild) {
            matched.push(...n.querySelectorAll(params.selector));
          }
        }
      }
      const smatched = [...new Set(matched)]
      if (smatched && params.once) this.disconnect();
      for (const el of smatched) {
        params.done(el);
      }
    });
    observer.observe(document.querySelector(params.parent) || document.body, {
      subtree: !!params.recursive || !params.parent,
      childList: true,
    });
  }

window.addInfo=function(){
         $('.field-group').has('[for="cycle_description"]').children('textarea').attr("placeholder","请填写用例失败率标准")
        $('.field-group').has('[for="cycle_description"]').children('textarea').click(function(){
        if($(this).val().length==0)
        {$(this).val("用例失败率标准:0%")
        }
    })
}
    window.waitForAddedNode({
    selector: '#create-cycle-dialog',
    recursive: false,
    done: window.addInfo
  })
})();