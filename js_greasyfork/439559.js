// ==UserScript==
// @name                [RMFM addons]代码高亮
// @namespace           RMFM_code_highlight
// @version             0.0.2
// @description         【这是 Reading mode for mobile 的功能插件，无法单独工作】对代码块进行高亮
// @author              稻米鼠
// @icon                https://i.v2ex.co/UuYzTkNus.png
// @supportURL          https://meta.appinn.net/t/23292
// @contributionURL     https://afdian.net/@daomishu
// @contributionAmount  8.88
// @antifeature         payment 主脚本（Reading mode for mobile）为付费脚本
// @match               *://*/*
// @require             https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.4.0/highlight.min.js
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/439559/%5BRMFM%20addons%5D%E4%BB%A3%E7%A0%81%E9%AB%98%E4%BA%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/439559/%5BRMFM%20addons%5D%E4%BB%A3%E7%A0%81%E9%AB%98%E4%BA%AE.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const codeStyle = `pre code.hljs{display:block;overflow-x:auto;padding:1em}code.hljs{padding:3px 5px}.hljs{color:#abb2bf;background:#282c34}.hljs-comment,.hljs-quote{color:#5c6370;font-style:italic}.hljs-doctag,.hljs-formula,.hljs-keyword{color:#c678dd}.hljs-deletion,.hljs-name,.hljs-section,.hljs-selector-tag,.hljs-subst{color:#e06c75}.hljs-literal{color:#56b6c2}.hljs-addition,.hljs-attribute,.hljs-meta .hljs-string,.hljs-regexp,.hljs-string{color:#98c379}.hljs-attr,.hljs-number,.hljs-selector-attr,.hljs-selector-class,.hljs-selector-pseudo,.hljs-template-variable,.hljs-type,.hljs-variable{color:#d19a66}.hljs-bullet,.hljs-link,.hljs-meta,.hljs-selector-id,.hljs-symbol,.hljs-title{color:#61aeee}.hljs-built_in,.hljs-class .hljs-title,.hljs-title.class_{color:#e6c07b}.hljs-emphasis{font-style:italic}.hljs-strong{font-weight:700}.hljs-link{text-decoration:underline}
  pre > div.code-copy-button {
    position: absolute;
    top: 4px;
    right: 18px;
    width: 18px;
    height: 18px;
    background-color: rgba(255, 255, 255, .3);
    border: 1px solid rgba(255, 255, 255, .4);
    border-radius: 2px;
  }
  pre > div.code-copy-button:hover {
    background-color: rgba(255, 255, 255, .6);
    border: 1px solid rgba(255, 255, 255, .7);
  }
  pre > div.code-copy-button::before,
  pre > div.code-copy-button::after {
    content: ' ';
    box-sizing: border-box;
    position: absolute;
    width: 9px;
    height: 12px;
    border: 2px solid rgba(0, 0, 0, .5);
    border-radius: 2px;
  }
  pre > div.code-copy-button::before {
    left: 3px;
    top: 2px;
  }
  pre > div.code-copy-button::after {
    right: 3px;
    bottom: 2px;
  }`
  /**
   * 为代码块生成行号图片
   *
   * @param {string|number} num 行号的数字
   * @param {string} style 相关的样式，字号、行高和字体
   * @return {string} 返回 base64 格式的图片地址
   */
  const generateLineNumber = (num, style)=>{
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const context = {
      font: style.fontSize + ' ' +  (style.fontFamily ? style.fontFamily : window.getComputedStyle(document.body).fontFamily),
      textAlign: "right",
      fillStyle: "#999999",
    }
    for(const s in context){ ctx[s] = context[s] }

    style.width = ctx.measureText(num).width
    style.height = Number(style.lineHeight.replace('px', ''))

    canvas.width = style.width
    canvas.height = style.height

    for(const s in context){ ctx[s] = context[s] }

    const textY = style.height/2+Number(style.fontSize.replace('px', ''))/2
    ctx.fillText(num, style.width, textY)
    return canvas.toDataURL("image/png")
  }
  /**
   * 为代码块设置行号
   *
   * @param {HTMLElement} codeEl
   */
  const setLineNumber = (codeEl)=>{
    const codeEls = codeEl ? [codeEl] : []
    codeEls.forEach(cEl=>{
      const cElStyle = window.getComputedStyle(cEl)
      const style = {
        fontSize: cElStyle.fontSize,
        fontFamily: cElStyle.fontFamily,
        lineHeight: cElStyle.lineHeight,
        // lineHeight: cElStyle.fontSize.replace('px', '')*1.2+'px',
      }
      cEl.innerHTML = cEl.innerHTML
                        .split(/\n|<br[^>]?>/gi)
                        .map((lineCode, index)=>{
                          const lineNum = index+1
                          const lineBG = generateLineNumber(lineNum, style)
                          return '<div class="rmfm-code-line"><div class="rmfm-code-line-num" date-line-num="'+lineNum+'" style="background-image: url('+lineBG+')"></div>'+lineCode+'</div>'
                        })
                        .join('')
    })
  }
  const copyParentText = function(){
    const textArea = document.createElement('textarea')
    textArea.setAttribute('readonly', 'readonly')
    textArea.value = this.parentElement.innerText
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    alert('Code is copied.')
  }

  const opt = window.RMFM ? window.RMFM : window.RMFM={}
  const addons = (opt.addons && opt.addons instanceof Array) ? opt.addons : opt.addons=[]
  const eventRemver = []
  addons.push({
    name: 'Code block highlight',
    contentStyle: codeStyle,
    contentFilter: (glo, contentEl)=>{
      contentEl.querySelectorAll('pre').forEach(pre=>{
        const codeEl = pre.querySelector('code')
        const copyButton = document.createElement('div')
        copyButton.className = 'code-copy-button'
        pre.appendChild(copyButton)
        copyButton.addEventListener('click', copyParentText)
        eventRemver.push(()=>{
          copyButton.removeEventListener('click', copyParentText)
        })
        if(typeof(hljs) === "undefined") return
        hljs.highlightBlock(codeEl)
        setLineNumber(codeEl)
      })
    },
    onMainHide: ()=>{
      while(eventRemver.length){
        (eventRemver.shift())()
      }
    }
  })
})()