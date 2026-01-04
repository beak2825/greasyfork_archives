// ==UserScript==
// @name         shin-mamotor-fa
// @namespace    http://shinwoow.net/
// @version      0.1
// @description  shin-特殊用途script
// @author       You
// @match        https://mamotor.mamobility.com/guide-robot/**
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/479302/shin-mamotor-fa.user.js
// @updateURL https://update.greasyfork.org/scripts/479302/shin-mamotor-fa.meta.js
// ==/UserScript==

const FONT_SIZE_DEFAULT = localStorage.getItem("mamo-html-font-size") || 68

/** 修改默认样式 */
function resetDefaultStyle ()　{
  const str = `
  html {
    font-size: ${FONT_SIZE_DEFAULT}px;
  }
  .bottom-dh-char {
    display: flex;
    padding: 0 20px;
    width: 100vw;
    box-sizing: border-box;
  }
  .bottom-dh-char > input {
    flex: 1;
    padding: 0 20px;
  }
  .bottom-dh-char > div {
    width: auto;
    padding: 0 20px;
    margin-left: 20px;
  }
  .shin-select {
    padding: 8px 20px;
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 4px;
  }
  `

  const styleEl = document.createElement('style')

  styleEl.innerHTML = str

  document.body.appendChild(styleEl)

}

/** 字体样式选择 */
function switchFontSize() {
    const initNum = 16
    const wrapper = document.createElement('select')
    wrapper.classList.add('shin-select')

    for(let i = 0; i < 30; i++) {
        const size = (initNum + i * 4).toString()
        const optionEl = document.createElement('option')
        optionEl.setAttribute('value', size)
        optionEl.innerHTML = size
        wrapper.appendChild(optionEl)
    }

    const header = document.querySelector('.head-title')
    header.appendChild(wrapper)

    // 设置默认值
    wrapper.value = FONT_SIZE_DEFAULT.toString()
    wrapper.onchange = () => {
        // 替换全局样式
        const str = `
        html {
          font-size: ${wrapper.value}px;
        }`

        let el = document.querySelector('.shin-font-change')

        if(!el) {

            el = document.createElement('style')
            document.body.appendChild(el)
        }
        el.innerHTML = str

        localStorage.setItem("mamo-html-font-size", wrapper.value)
    }
}

(function() {
    'use strict';
    // 修改默认样式
    resetDefaultStyle()
    switchFontSize()

    // Your code here...
})();