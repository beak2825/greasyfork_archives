// ==UserScript==
// @name        中国大学MOOC，一键互评
// @match       https://www.icourse163.org/learn/*
// @match       https://www.icourse163.org/spoc/learn/*
// @namespace   zhufn.fun
// @grant       none
// @version     1.4.1
// @author      cover @zhuufn
// @description 2022/3/27 21:09:54
// @license gpl-3.0
// @downloadURL https://update.greasyfork.org/scripts/442198/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6MOOC%EF%BC%8C%E4%B8%80%E9%94%AE%E4%BA%92%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/442198/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6MOOC%EF%BC%8C%E4%B8%80%E9%94%AE%E4%BA%92%E8%AF%84.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.pingfen = function() {
        let praise = ['好', '完美', 'good', 'beautiful', '满分', '你字写的也太好看了吧！']
        var a = document.getElementsByClassName('s')
        for (let i = 0; i < a.length; ++i)
        {
            a[i].children[a[i].children.length-1].children[0].checked = true
        }
        var b = document.getElementsByTagName("textarea")
        for (let i = 0; i < b.length; ++i) {
            b[i].value = praise[Math.floor(Math.random()*(praise.length))]
        }
    }

    function scroll () {
        window.scrollTo(0, document.getElementById('courseLearn-inner-box').offsetHeight)
    }

    function fuck() {
        let save_btn = document.getElementsByClassName('j-submitbtn')[0]
        let a_tag = document.createElement('a')
        a_tag.innerText='👻互评'
        a_tag.className="u-btn u-btn-default f-fl"
        a_tag.onclick=window.pingfen
        save_btn.parentElement.insertBefore(a_tag, save_btn)
        scroll()
        let observer = new MutationObserver(scroll)
        observer.observe(document.getElementsByClassName('m-homeworkQuestionList')[0], {childList: true})
    }

    function runWhenReady(readySelector, callback) {
      var numAttempts = 0;
      var tryNow = function() {
          var elem = document.querySelector(readySelector);
          if (elem) {
              callback(elem);
          } else {
              numAttempts++;
              if (numAttempts >= 34) {
                  console.warn('Giving up after 34 attempts. Could not find: ' + readySelector);
              } else {
                  setTimeout(tryNow, 250 * Math.pow(1.1, numAttempts));
              }
          }
      };
      tryNow();
    }

    runWhenReady(".j-evaluate", fuck)
    // Your code here...
})();