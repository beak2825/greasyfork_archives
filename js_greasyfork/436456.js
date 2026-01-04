// ==UserScript==
// @name         9dm免输入验证
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  9dm免输入验证，避免了登录时手动输入验证信息
// @author       ayano
// @match        http://www.9damaogame.com/
// @icon         https://www.google.com/s2/favicons?domain=9damaogame.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436456/9dm%E5%85%8D%E8%BE%93%E5%85%A5%E9%AA%8C%E8%AF%81.user.js
// @updateURL https://update.greasyfork.org/scripts/436456/9dm%E5%85%8D%E8%BE%93%E5%85%A5%E9%AA%8C%E8%AF%81.meta.js
// ==/UserScript==

(function () {
    'use strict';
    setTimeout(() => {
        const dom = document.querySelector('body > form > table td')
        if(dom){
          let text = dom.querySelector("b")
          const input = dom.querySelector("input[type='text']")
          const submit = dom.querySelector("input[type='submit']")

          text = text.innerText.replace(/\=\s+\?\s?/, "")

          const value = eval(text)
          input.value = value+""
          submit.click()

        }

    }, 1000)
})();