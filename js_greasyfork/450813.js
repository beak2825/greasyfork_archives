// ==UserScript==
// @name        Mouse can click.
// @namespace   Mouse can click.
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAO2SURBVHic7dwxTkNBDEDBfMR96Lh/TZcTLXfASNbqzfRJNs2TG/t5vV7ndbFzrn4+rPrYfgCwRwAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAg7HP6Bdv7+M/zjD6//X7YZAKAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAsPE9gG3TfX73BCgzAUCYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAEDYc4YL7fV9+u3/v/373M0EAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGGf0y+o77Nv/3+YMAFAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABA2PgewNT2Pr17ApSZACBMACBMACBMACBMACBMACBMACBMACBMACBMACBMACBMACBMACBMACBMACBs/R7A1PY+/fY9AZgwAUCYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAEDY9fcApvv8t/8+TJgAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIOz6ewDnnO0ntH19zz7//vmfd/zV7e8fMgFAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABA2HMs1LdN9+GZWb4nYAKAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMPcAbmefv214T8AEAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGHPOedsP4JFX9/bL2h7/6z+vAkAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwtwDYKZ+T2B5n3/KBABhAgBhAgBhAgBhAgBhAgBhAgBhAgBhAgBhAgBhAgBhAgBhAgBhAgBhAgBh7gGwa/uewOX7/FMmAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAhzDwDCTAAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQ9gvziV/bWLPjLAAAAABJRU5ErkJggg==
// @grant       none
// @run-at      document-start
// @version     1.14.202307251942
// @author      dms
// @description 让链接可以点击。
// @match       *://*/*
// @supportURL  https://meta.appinn.net/t/35958
// @homepageURL https://meta.appinn.net/t/35958
// @downloadURL https://update.greasyfork.org/scripts/450813/Mouse%20can%20click.user.js
// @updateURL https://update.greasyfork.org/scripts/450813/Mouse%20can%20click.meta.js
// ==/UserScript==

(function() {
  'use strict';
  (function() {
    'use strict';
    const excludeTags = [
      'a',
      'style',
      'script',
      'code',
      'pre',
      'area',
      'audio',
      'video',
      'img',
      'track',
      'picture',
      'canvas',
      'svg',
      'embed',
      'iframe',
      'object',
      'source',
      'math',
      'textarea',
      'form',
    ].map(e=>e.toUpperCase())
    const urlRegBase = /https?:\/\/(?:[a-z0-9-]+\.)+(?:[a-z]+|[0-9]+)(?::\d+)?(?:\/[\w;,/?:@&=+$-.!~*'()#%]*)/gi
    const urlRegStr = "https?:\\/\\/(?:[\\w-]+\\.)+(?:[a-z]+|[0-9]+)(?::\\d+)?(?:\\/[\\w;,\\/?:@&=+$-.!~*'()#%]*)?"
    const urlTestReg = new RegExp(urlRegStr, 'i')
    const urlReplReg = new RegExp(urlRegStr, 'gi')
    const checkElement = el=>{
      if(el.tagName && excludeTags.indexOf(el.tagName)===-1){
        return urlTestReg.test(el.innerText)
      }
      return false
    }
    const text2Link = node=>{
      const content = ''+node.textContent
      if(urlTestReg.test(content)){
        const links = []
        let nowMark = 0
        let tempStr = node.textContent
        tempStr.replace(urlReplReg, (m, offset)=>{
          let endOffset = 0
          m.replace(/^[^(]+(\)+)$/, (m, s)=> endOffset = s.length)
          links.push({
            u: m,
            start: offset-nowMark-endOffset
          })
          nowMark = offset-nowMark-endOffset+m.length
        })
        let tempNode = node
        links.forEach(l=>{
          const lastNode = tempNode.splitText(l.start)
          const link = document.createElement('a')
          link.href = l.u
          link.innerText = l.u
          link.target = '_blank'
          link.classList.add('Mouse-can-click')
          node.parentElement.insertBefore(link, lastNode)
          tempNode = lastNode.splitText(l.u.length)
          lastNode.remove()
          console.log(
            '%cMouse can click:%c "%c'+l.u+'%c" is enabled.',
            'color: white; background-color: #55555C; border-radius: 0 2px 2px 0; padding: 0 5px;',
            'color: #666668;',
            'color: #000000;',
            'color: #666668;',
            )
        })
      }
    }
    const canClickElement = (el=document.body) =>{
      if(el.nodeType===3){
        return text2Link(el)
      }
      if(el.nodeType===1 && checkElement(el)){
        el.childNodes.forEach(e=>canClickElement(e))
      }
    }
    window.addEventListener('load', ()=>{
      canClickElement()
      const targetNode = document.body
      const config = {
        attributes: false,
        childList: true,
        subtree: true
      };
      let totalTimes= 0
      const callback = function(mutationsList, observer) {
        if(totalTimes++ >= 1e4){
          observer.disconnect()
        }
        for (let mutation of mutationsList) {
          canClickElement(mutation.target)
        }
      };
      const observer = new MutationObserver(callback);
      observer.observe(targetNode, config);
    })
  })()
})()
