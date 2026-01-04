// ==UserScript==
// @name        css-replace
// @namespace   css
// @match       https://codesign.qq.com/app/design/*
// @version     1.1
// @author      Gorvey
// @description 2024/12/29 14:44:23
// @run-at      document-idle
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529386/css-replace.user.js
// @updateURL https://update.greasyfork.org/scripts/529386/css-replace.meta.js
// ==/UserScript==
//--------------------设置------------------- S//

//#region
GM_addStyle(
  `
  .base-node{
    display: none;
  }
  .node-item[data-label="字体"],
  .node-item[data-label="段落对齐"],
  .node-item[data-label="垂直对齐"],
  .node-item[data-label="字号"],
  .node-item[data-label="字重"],
  .node-item[data-label="行高"],
  .node-item[data-label="颜色"],
  .node-item[data-label="宽度"]
  {
    display: none !important;
  }
  // .node-box{
  //   display: none !important;
  // }
  .node-box:last-child{
    display: block !important;
  }
  .node-item {
    margin-bottom: 2px !important;
  }
  .node-box {
    margin-bottom: 0px !important;
  }
  `
);
GM_addStyle(
  `
  .tailwind-line-wrapper{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  `
)
//#endregion

document.addEventListener('click', (e) => {
  if(e.target.classList.contains('icon-v2-copy')){
    return
  }
  const wrapper = document.querySelector(".css-node__codes");
  if (!wrapper) return;
  onCssChange()
})
const copyToClipboard = (text) => {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
};

const processCssVariables = (value) => {
  const cssVarMap = GM_getValue('css-variable-map', '')
  if (!cssVarMap) return value
  


  // 格式化 CSS 变量映射字符串
  const formatVarMap = cssVarMap
    .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '')
    .replace(/(:root|:root\[.*?\])\s*{/g, '')
    .replace(/}/g, '')
    .split(';')
    .filter(line => line.trim())
    .map(line => {
      const [key, val] = line.split(':').map(s => s.trim())
     
      return [key, val]
    })
    .filter(([key, val]) => key && val)


  // 查找匹配的变量
  const matchedVar = formatVarMap.find(([_, val]) => {
    const cleanVal = val.replace(/\s*!important\s*$/, '').trim()
    return cleanVal.toLowerCase() === value
  })

  return matchedVar ? `var(${matchedVar[0]})` : value
}

const cssToTailwind = (css) => {


  const cssMap = css.map(item => {
    const [name, value] = item.split(':').map(s => s.trim())
    const processedValue = processCssVariables(value)
    return [name, processedValue]
  })

  const rules = [
    // ['width', 'w-[#]'],
    // ['height', 'h-[#]'],
    ['font-size', 'text-[#]'],
    // ['font-style', '#'],
    ['font-weight', (value) =>{
      const maps={
        '300': 'font-light',
        '400': 'font-normal',
        '500': 'font-medium',
        '600': 'font-semibold',
        '700': 'font-bold',
        '800': 'font-extrabold',
      }
      return maps[value]
    }],
    ['color', 'text-[#]'],
    ['line-height', 'leading-[#]'],
    ['border-radius', 'rounded-[#]'],
    ['border', (value) => {
      const [width, style, color] = value.split(' ')
      return `border-[${width}] border-${style} border-[${color}]`
    }],
    ['letter-spacing', 'tracking-[#]'],
    ['opacity', (value) => `opacity-${Math.round(parseFloat(value) * 100)}`],
    // ['text-decoration', '#'],
    // ['text-align', 'text-#'],
    ['background', 'bg-[#]'],
    // ['padding', 'p-[#]'],
    // ['margin', 'm-[#]'],
    // ['display', '#'],
    // ['position', '#'],
    // ['top', 'top-[#]'],
    // ['left', 'left-[#]'],
    // ['right', 'right-[#]'],
    // ['bottom', 'bottom-[#]'],
  ]

  // 转换 CSS 属性到 Tailwind
  const result = cssMap.map(([prop, value]) => {
    const rule = rules.find(([cssName]) => cssName === prop)
    if(value === '') return null
    if (!rule) return null

    const [, template] = rule
    if (typeof template === 'function') {
      return template(value)
    }
    
    return template.replace('#', value)
  }).filter(item => {
    if(!item) return false
    // 清理默认值
    let defaultValues = ['font-normal', 'text-[14px]', 'tracking-[0]']
    if(defaultValues.includes(item)) return false
    return true
  })
  
  return result.join(' ')
}
const genCopyButton = (css) => {
  const button = document.createElement('div')
  button.innerHTML='<i style="font-size: 24px;" class="com-icon iconfont-v2 icon-v2-copy"></i>'
  button.classList.add('tailwind-copy-button')
  button.style.cursor = 'pointer'
  button.style.color = '#000'
  button.style.marginLeft = '8px'
  button.addEventListener('click', () => {
    copyToClipboard(css)
    // 获取对应的代码块元素
    const codeBlock = button.previousElementSibling
    // 添加复制成功的边框样式
    codeBlock.style.borderColor = '#22c55e'
    // 3秒后恢复原样
    setTimeout(() => {
      codeBlock.style.borderColor = 'var(--td-brand-color)'
    }, 3000)
  })
  return button
}
const textToHtmlCodeElement = (text) => {
  const node = document.createElement('div')
  node.classList.add('tailwind-code-block')
  node.innerText = text
  node.style.width = '100%'
  node.style.marginTop = '8px'
  node.style.padding = '8px 12px'
  node.style.whiteSpace = 'pre-wrap'
  node.style.wordBreak = 'break-all'
  node.style.minHeight = '32px'
  node.style.maxHeight = '190px'
  node.style.overflow = 'auto'
  node.style.borderRadius = '4px'
  node.style.cursor = 'text'
  node.style.backgroundColor = 'rgba(0, 0, 0, .04)'
  node.style.position = 'relative'
  node.style.border = '3px solid var(--td-brand-color)'
  return node
}
const onCssChange = async () => {
  await new Promise((resolve) => setTimeout(resolve, 20));
  try {
    const wrapper = document.querySelector(".css-node__codes");
    if (!wrapper) return;
    const cssNode = wrapper.querySelectorAll(".css-node__code--item")[0];
    const content = cssNode.innerText;
    const hasMultipleClasses = content.includes('{');
    let tailwind = [];
    
    if (hasMultipleClasses) {
      // 处理多个类声明
      const classBlocks = content.split('}').filter(block => block.trim());
      const results = classBlocks.map(block => {
        const styles = block
          .replace(/.*{/, '') // 移除类名和{
          .split(';\n')
          .filter(item => item.trim())
          .map(item => item.trim().replace(';', ''));
        return cssToTailwind(styles);
      });
      tailwind = results;
    } else {
      // 处理单个声明
      const styles = content
        .split(';\n')
        .filter(item => item.trim())
        .map(item => item.trim().replace(';', ''));
      tailwind =[cssToTailwind(styles)]
    }
    let prevNodes = document.querySelectorAll('.tailwind-line-wrapper')
    prevNodes.forEach(node => {
      node.remove()
    })
  
    tailwind.map(item =>{
     const node= textToHtmlCodeElement(item)
     const copyButton = genCopyButton(item)
     const lineWrapper = document.createElement('div')
     lineWrapper.classList.add('tailwind-line-wrapper')
     lineWrapper.appendChild(node)
     lineWrapper.appendChild(copyButton)
     wrapper.insertBefore(lineWrapper,cssNode)
    })

  } catch (error) {
    console.error(error);
  }
};

GM_registerMenuCommand('添加css变量映射', () => {
 const css = prompt('请输入css变量映射')
 if(!css) return
GM_setValue('css-variable-map', css)
alert('添加成功')
})
GM_registerMenuCommand('清除css变量映射', () => {
  GM_deleteValue('css-variable-map')
  alert('清除成功')
})
