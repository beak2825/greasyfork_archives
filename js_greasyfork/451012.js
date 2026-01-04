// ==UserScript==
// @name        Mouse text better.
// @namespace   Mouse text better.
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAQfSURBVHic7d2hTitBFIDh2xscuhaJw5PU8CQ8HE+CIcHjkFh09dx3uKfJZPN/n5/2dLf5M2ZnT2ut9QdI+rt7AGAfAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYCwu90DTN2fX0brr7/vN5mDY6r/f+wAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIOzw5wF8fryN1tefBz+66f2b/n+Ozg4AwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwk5rrbV7iJ2+vn9G658eH240Cf/D/ZuxA4AwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYCwu+kHTN/Pzsz1933r97v/e03vvx0AhAkAhAkAhAkAhAkAhAkAhAkAhAkAhAkAhAkAhAkAhAkAhAkAhAkAhAkAhI3PA/j8eLvFHIf1fHkdra9fv/rvn/5/puwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIGx8HsDT48No/fT98tPnyafzs5f7N2MHAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGGntdbaPcTE/fll6/d/fryN1h/9/fa7r/9u19/30frp9Zt+vx0AhAkAhAkAhAkAhAkAhAkAhAkAhAkAhAkAhAkAhAkAhAkAhAkAhAkAhAkAhN3tHmC3+vP8u02vPzN2ABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABCWPw/g+fI6Wj99PzszzmOYsQOAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAsO3nAdyfX0brp++Xnz5PPp3feQLsZAcAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYePzAI7+PP/UdP76eQLPl9fdI6TZAUCYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAEDYaa21Jh/w9f0zGmD38/y7Hf36TednZnr/7QAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgbHweAHBcdgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQ9g+QM2V6yVxQIgAAAABJRU5ErkJggg==
// @grant       none
// @run-at      document-start
// @version     1.22.202210020655
// @author      dms
// @description 给文字加阴影，让文字更清晰。
// @match       *://*/*
// @supportURL  https://meta.appinn.net/t/35958
// @homepageURL https://meta.appinn.net/t/35958
// @downloadURL https://update.greasyfork.org/scripts/451012/Mouse%20text%20better.user.js
// @updateURL https://update.greasyfork.org/scripts/451012/Mouse%20text%20better.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const excludeTags = [
    'style',
    'script',
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
  ].map(e=>e.toUpperCase())
  const textShadow = el=>{
    if(el.nodeType === 1 && excludeTags.indexOf(el.tagName)===-1){
      if(el.innerText && el.innerText.length){
        const shadowBase = window.getComputedStyle(el).color
                        .replace(/^rgba?\((\d+,\s*\d+,\s*\d+).*$/, '$1')
        const sizeBase = window.getComputedStyle(el).fontSize.replace(/px$/, '')
        if(/^\d+,\s*\d+,\s*\d+$/.test(shadowBase) && /^[\d.]+$/.test(sizeBase)){
          const sizeArr = [
            Math.max(sizeBase/16, .5),
            Math.max(sizeBase/8, 1),
            Math.max(sizeBase/4, 2),
          ]
          el.style.textShadow = '0 0 .5px rgba('+shadowBase+', .5),'
                              + '0 0 '+sizeArr[0]+'px rgba('+shadowBase+', .1),'
                              + '0 0 '+sizeArr[1]+'px rgba('+shadowBase+', .05),'
                              + '0 0 '+sizeArr[2]+'px rgba('+shadowBase+', .02)'
        }
      }
      el.childNodes.forEach(e=>textShadow(e))
    }
  }
  const marks = []
  let restartTimes = 0
  window.addEventListener('load', ()=>{
    textShadow(document.body)
    const config = {
      attributes: true,
      childList: true,
      subtree: true
    };
    let totalTimes= 0
    const callback = function(mutationsList, observer) {
      const now = Date.now()
      marks.push(now)
      if(marks.length >= 10 && now-marks.shift()<=1e3){
        obsEnd()
        window.setTimeout(()=>{
          if(restartTimes++>=10) config.attributes = false
          obsStart()
          textShadow(document.body)
        }, 1e4)
        return
      }
      for (let mutation of mutationsList) {
        textShadow(mutation.target)
      }
    };
    const observer = new MutationObserver(callback);
    const obsStart = ()=>observer.observe(document.body, config);
    const obsEnd = ()=>observer.disconnect()
    obsStart()
  })
})()
