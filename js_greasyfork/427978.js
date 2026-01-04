// ==UserScript==
// @name         Copy Pinyin Button
// @namespace    https://ciffelia.com/
// @version      1.0.1
// @description  Copy pinyin input
// @author       Ciffelia <mc.prince.0203@gmail.com> (https://ciffelia.com/)
// @include      https://dokochina.com/pinyin.htm
// @downloadURL https://update.greasyfork.org/scripts/427978/Copy%20Pinyin%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/427978/Copy%20Pinyin%20Button.meta.js
// ==/UserScript==

(() => {
  const pinyinInput = document.getElementById('text1')

  const copyButton = document.createElement('input')
  copyButton.type = 'button'
  copyButton.value = 'コピー'
  copyButton.addEventListener('click', () => {
    pinyinInput.select()
    document.execCommand('copy')
  })

  const convButton = document.querySelector('input[value="ピンインフォントに変換"]')
  convButton.parentElement.insertBefore(copyButton, convButton.nextSibling)
})()
