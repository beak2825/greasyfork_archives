// ==UserScript==
// @name        Mouse to where(Open in blank).
// @namespace   Mouse to where(Open in blank).
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAO2SURBVHic7dwxTkNBDEDBfMR96Lh/TZcTLXfASNbqzfRJNs2TG/t5vV7ndbFzrn4+rPrYfgCwRwAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAg7HP6Bdv7+M/zjD6//X7YZAKAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAsPE9gG3TfX73BCgzAUCYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAEDYc4YL7fV9+u3/v/373M0EAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGGf0y+o77Nv/3+YMAFAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABA2PgewNT2Pr17ApSZACBMACBMACBMACBMACBMACBMACBMACBMACBMACBMACBMACBMACBMACBMACBs/R7A1PY+/fY9AZgwAUCYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAEDY9fcApvv8t/8+TJgAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIOz6ewDnnO0ntH19zz7//vmfd/zV7e8fMgFAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABA2HMs1LdN9+GZWb4nYAKAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMPcAbmefv214T8AEAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGHPOedsP4JFX9/bL2h7/6z+vAkAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwtwDYKZ+T2B5n3/KBABhAgBhAgBhAgBhAgBhAgBhAgBhAgBhAgBhAgBhAgBhAgBhAgBhAgBhAgBh7gGwa/uewOX7/FMmAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAhzDwDCTAAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQ9gvziV/bWLPjLAAAAABJRU5ErkJggg==
// @grant       none
// @run-at      document-start
// @version     1.27.202209191821
// @author      dms
// @description 对链接的去向进行标注。
// @match       *://*/*
// @supportURL  https://meta.appinn.net/t/35958
// @homepageURL https://meta.appinn.net/t/35958
// @downloadURL https://update.greasyfork.org/scripts/450876/Mouse%20to%20where%28Open%20in%20blank%29.user.js
// @updateURL https://update.greasyfork.org/scripts/450876/Mouse%20to%20where%28Open%20in%20blank%29.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const openInSelf = false
  const addStyle = ()=>{
    const style = document.createElement('style')
    style.id = 'Mouse-to-where'
    style.innerHTML = `
    a.Mouse-to-where > span.Mouse-link-mark {
      position: relative;
      padding: 0;
      margin: 0;
      width: 0;
      height: 0;
    }
    a.Mouse-to-where > span.Mouse-link-mark::before {
      content: ' ';
      position: absolute;
      border-radius: 12px;
      box-sizing: border-box;
    }
    a.Mouse-to-where > span.Mouse-link-mark::before {
      top: 0;
      right: 0;
      width: 4px;
      height: 4px;
      background: rgba(66, 66, 233, 1);
      opacity: .3;
    }
    a.Mouse-to-where > span.Mouse-link-mark.Mouse-link-outer::before {
      background: rgba(233, 66 ,66, 1);
    }
    a.Mouse-to-where:hover > span.Mouse-link-mark::before {
      opacity: .8;
    }
    `
    document.body.appendChild(style)
  }
  const siteReg = new RegExp('^https?:\\/\\/'+window.location.host.replace(/\./g, '\\.'), 'i')
  const mark2Where = ()=>{
    document.body.querySelectorAll('a').forEach(a=>{
      if(a.classList.contains('Mouse-to-where')) return
      if(!a.href) return
      let isOuterLink = true
      if(!/^\w+:\/\//.test(a.href)) isOuterLink = false
      if(siteReg.test(a.href)) isOuterLink = false
      a.classList.add('Mouse-to-where')
      if(!/^_(parent|top)/i.test(a.target)){
        a.target = openInSelf ? '_self' : '_blank'
      }
      const linkMark = document.createElement('span')
      linkMark.classList.add('Mouse-link-mark')
      if(isOuterLink) linkMark.classList.add('Mouse-link-outer')
      linkMark.addEventListener('contextmenu', ()=>{
        window.open('https://api.pwmqr.com/qrcode/create/?url='+encodeURIComponent(a.href), '_blank')
      })
      a.appendChild(linkMark)
    })
  }
  window.addEventListener('load', ()=>{
    addStyle()
    mark2Where()
    const targetNode = document.body
    const config = {
      attributes: true,
      childList: true,
      subtree: true
    };
    let totalTimes= 0
    const callback = function(mutationsList, observer) {
      if(totalTimes++ >= 1e4){
        observer.disconnect()
      }
      mark2Where()
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
  })
})()
