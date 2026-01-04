// ==UserScript==
// @name         成都市专业技术人员继续教育基地（市政）-自动看课
// @namespace    代刷VX：shuake345
// @version      0.2
// @description  自动看课,解放双手vx:shuake345.接代刷代写程序业务
// @author       vx:shuake345.接代刷代写程序业务
// @match        https://www.cdzjjj.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cdzjjj.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481100/%E6%88%90%E9%83%BD%E5%B8%82%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%9F%BA%E5%9C%B0%EF%BC%88%E5%B8%82%E6%94%BF%EF%BC%89-%E8%87%AA%E5%8A%A8%E7%9C%8B%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/481100/%E6%88%90%E9%83%BD%E5%B8%82%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%9F%BA%E5%9C%B0%EF%BC%88%E5%B8%82%E6%94%BF%EF%BC%89-%E8%87%AA%E5%8A%A8%E7%9C%8B%E8%AF%BE.meta.js
// ==/UserScript==

// ==UserScript==


(function() {
    'use strict';

    // Your code here...
    function Reg_Get(HTML, reg) {
      let RegE = new RegExp(reg);
      try {
        return RegE.exec(HTML)[1];
      } catch (e) {
        return "";
      }
    }

    function ACSetValue(key, value) {
      GM_setValue(key, value);
      if(key === 'Config'){
        if (value) localStorage.ACConfig = value;
      }
    }

    function getElementByXpath(e, t, r) {
      r = r || document, t = t || r;
      try {
        return r.evaluate(e, t, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      } catch (t) {
        return void console.error("无效的xpath");
      }
    }

    function getAllElementsByXpath(xpath, contextNode) {
      var doc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document;
      contextNode = contextNode || doc;
      var result = [];

      try {
        var query = doc.evaluate(xpath, contextNode, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        for (var i = 0; i < query.snapshotLength; i++) {
          var node = query.snapshotItem(i); //if node is an element node

          if (node.nodeType === 1) result.push(node);
        }
      } catch (err) {
        throw new Error(`Invalid xpath: ${xpath}`);
      } //@ts-ignore
      return result;
    }

function getAllElements(selector) {
      var contextNode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      var doc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document;
      var win = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : window;

      var _cplink = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;

      if (!selector) return []; //@ts-ignore

      contextNode = contextNode || doc;

      if (typeof selector === 'string') {
        if (selector.search(/^css;/i) === 0) {
          return getAllElementsByCSS(selector.slice(4), contextNode);
        } else {
          return getAllElementsByXpath(selector, contextNode, doc);
        }
      } else {
        var query = selector(doc, win, _cplink);

        if (!Array.isArray(query)) {
          throw new Error('Wrong type is returned by getAllElements');
        } else {
          return query;
        }
      }
    }
    window.onload=function(){
    document.getElementsByClassName('course-detail-heading')[0].innerText="刷课VX:shuake345"

    }
function bfy(){
    if(document.URL.search('show')>1){
        if(document.getElementsByClassName('btn btn-gray text-sm js-learn-prompt open').length==0){
   document.getElementsByClassName('back-link')[0].click()
        }
    }
}
    setInterval(bfy,6000)

    function zy(){
        if(document.URL.search('learning')>1){//zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz
    var bigs=$('.my-course-item.cd-mb40.clearfix')
    var i=0
    while(i<=bigs.length){
    if(bigs[i].children[1].children[2].children[1].innerText!=="100%"){
        bigs[i].children[2].children[0].click()
        break;
    }else{
        if(i<bigs.length){
        i++
        }
    }
    }

    }
    }
    setInterval(zy,3000)


    function ciye(){
        if(document.URL.search('my/course')>1){
            window.scrollTo( 0, 4200 );
            setTimeout(function (){
                if(document.getElementsByClassName('es-icon left-menu es-icon-lock').length>0){
                if($('.es-icon.left-menu.es-icon-doing.color-primary').length>0){
                $('.es-icon.left-menu.es-icon-doing.color-primary')[0].nextElementSibling.click()
                }else if($('.es-icon.left-menu.es-icon-undone-check.color-gray').length>0){
                $('.es-icon.left-menu.es-icon-undone-check.color-gray')[0].nextElementSibling.click()}
            }else{document.getElementsByClassName('btn cd-btn user-manage-toggle')[0].click()}
            },2000)
            
        }
    }
    setInterval(ciye,5000)



})();