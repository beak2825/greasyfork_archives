// ==UserScript==
// @name         跨境买家中心最大值
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  跨境买家中心最大值计算
// @author       glk
// @include      https://csp.aliexpress.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/487423/%E8%B7%A8%E5%A2%83%E4%B9%B0%E5%AE%B6%E4%B8%AD%E5%BF%83%E6%9C%80%E5%A4%A7%E5%80%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/487423/%E8%B7%A8%E5%A2%83%E4%B9%B0%E5%AE%B6%E4%B8%AD%E5%BF%83%E6%9C%80%E5%A4%A7%E5%80%BC.meta.js
// ==/UserScript==

(function () {
  function copyText (txt) {
    // 创建一个临时的textarea元素，将文本内容放入其中
    var $tempTextarea = $('<textarea>').val(txt).appendTo('body').select();

    // 执行复制操作
    document.execCommand('copy');

    // 移除临时textarea元素
    $tempTextarea.remove();
    console.log(`复制了`, txt);
    showTip("复制成功")
  }

  // 小提示
  const showTip = (message, duration = 0.8, pos) => {
    let show_tip = document.getElementById('show_tip')
    if (show_tip) {
      document.body.removeChild(show_tip)
    }
    let tipDom = document.createElement('div')
    tipDom.id = 'show_tip'
    Object.assign(tipDom.style, {
      position: 'fixed',
      maxWidth: '80vw',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      lineHeight: '20px',
      zIndex: 9999,
      color: '#fff',
      backgroundColor: '#303133',
      borderRadius: ' 4px',
      padding: '10px',
      textAlign: 'center',
      opacity: 0.9,
      fontSize: '0.75rem',
      animation: `tipanimation ${duration}s 1`
    })
    if (pos) {
      const { left, top, offsetX = 0, offsetY = 0 } = pos
      Object.assign(tipDom.style, {
        top: (top + offsetY) + 'px',
        left: (left + offsetX) + 'px',
        transform: 'none'
      })
    }
    tipDom.innerText = message
    document.body.appendChild(tipDom)

    setTimeout(() => {
      let show_tip = document.getElementById('show_tip')
      if (show_tip) {
        document.body.removeChild(show_tip)
      }
    }, duration * 1000 - 100)
  }

  let curMaxNum = 0, appenEd = false;

  const copyBtn = document.createElement("button")
  copyBtn.innerText = "复制最大值"
  Object.assign(copyBtn.style, {
    position: "absolute",
    right: "10px",
    top: "10px",
    zIndex: 999,
  }) 
  copyBtn.onclick = () => {
    copyText(curMaxNum)
  }

  setInterval(() => {
    const priceS = $(".next-overlay-wrapper.v2 tbody td.next-table-cell.last")
    
    if (priceS.length) {
      if (!appenEd) {
        $(".next-overlay-wrapper.v2")
        .children(":first")
        .eq(0)
        .prepend(copyBtn);
        appenEd = true
        curMaxNum = Math.max(... Array.from(priceS).map(i => i.innerText.replace("USD ", "")))
      }
    } else {
      appenEd = false
    }
  }, 1000)
})();
