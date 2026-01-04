// ==UserScript==
// @name         自用（mobile）
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  for personal use
// @author       You
// @match        *://*.google.*/search*
// @match        *://*.qidian.com/chapter/*
// @license      GPL-3.0
// @icon         https://digicommercegroup.com/insights/wp-content/uploads/2022/09/customize-vs-personalize-web--1024x660.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520546/%E8%87%AA%E7%94%A8%EF%BC%88mobile%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/520546/%E8%87%AA%E7%94%A8%EF%BC%88mobile%EF%BC%89.meta.js
// ==/UserScript==

(function() {

  'use strict';
  var url = document.URL;

  if (url.indexOf('google.com/search?') != -1) {
    //alert('js match');

    // block result box
      // 转自 https://greasyfork.org/en/scripts/446434-google-block-people-also-search-for-people-also-ask
      //          removed += removeXpath("//*[text() = 'Cast']/../../../../../../../../../node()");
      //   每个/.. 清除上一级
      'use strict';
      const DEBUG = false;

      function removeElements() {
          let removed = 0;
          removed += removeXpath("//*[text() = 'People also search for']/../../../../../node()");
          removed += removeXpath("//*[text() = 'People also ask']/../../../../../../node()");
          removed += removeXpath("//*[text() = 'Discussions and forums']/../../../node()");
          removed += removeXpath("//span[text() = 'Images']/../../../../../../../node()");
          removed += removeXpath("//span[text() = 'Listen']/../../../../../../../node()");
          removed += removeXpath("//span[text() = 'Short videos']/../../../../../node()");
        
          removed += removeXpath("//span[text() = 'Top stories']/../../../../../../../node()");
          removed += removeXpath("//span[text() = 'Perspectives']/../../../../../../../node()");


          //removed += removeXpath("//*[text() = 'More places']/../../../../../../node()");
          //removed += removeXpath("//span[text() = 'Show more']/../../../../../../node()");
          //removed += removeXpath("//*[text() = 'Cast']/../../../../../../../../../node()");
          //removed += removeXpath("//*[text() = 'Based on the book']/../../../../../../../node()");
          //removed += removeXpath("//*[text() = 'Reviews']/../../../../../../../node()");


          if (DEBUG) {
              console.log(`Removed ${removed} "...also..." elems`);
          }
      }

      function removeXpath(path) {
          let xpath = document.evaluate(path, document, null, XPathResult.ANY_TYPE, null);
          if (!xpath) { return 0; }

          let elems = [];
          for (let elem = xpath.iterateNext(); elem; elem = xpath.iterateNext()) {
              elems.push(elem);
          }

          for (let elem of elems) {
              elem.remove();
          }
          return elems.length;
      }

      // run immediately on page paint, after DOM loaded, and after every
      // DOM update
      new MutationObserver(() => {
          removeElements();
      }).observe(document, { subtree: true, childList: true });
      document.addEventListener('DOMContentLoaded', removeElements, false);
      removeElements();

  } else if (url.indexOf('qidian.com') != -1) {
      // 选择目标节点
    const targetNode = document.getElementById('reader');

    // 观察器的配置（需观察的变化类型）
    const config = {
        childList: true, // 观察子节点的变化
        subtree: true   // 观察后代节点
    };

    // 当观察到变化时执行的回调函数
    const callback = function(mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (targetNode.querySelector('[title="关闭"]')) {
                let elementsWithTitleClose = targetNode.querySelector('[title="关闭"]');
                elementsWithTitleClose.click();
                observer.disconnect();
            }
        }
    };

    // 创建一个MutationObserver实例并传入回调函数
    const observer = new MutationObserver(callback);

    // 使用配置对象启动观察器
    observer.observe(targetNode, config);

    // 稍后，你可以停止观察
    setTimeout(function() {
        observer.disconnect();

        clearReview();
    }, 3000);


    var clearReview = () => {
        let url = document.URL;
        let parts = url.split('/'); // 按照 '/' 分割字符串
        let result = parts[parts.length - 2]; // 获取倒数第二部分
        console.log(result); // 输出: 768358774
        let novel = document.querySelector('#c-'+result);

        let reviewContents = novel.querySelectorAll('.review-content');

        // 遍历这些元素并逐个移除
        reviewContents.forEach(function(element) {
            element.parentNode.removeChild(element);
        });

        let reviews = novel.querySelectorAll('* .review');

        // 遍历这些元素并逐个移除
        reviews.forEach(function(element) {
            element.parentNode.removeChild(element);
        });
    }
  }



})();

