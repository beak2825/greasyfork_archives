// ==UserScript==
// @name        Input Replacer
// @namespace   Input Replacer
// @match       *://*/*
// @icon        https://i.v2ex.co/8t6RUhEhs.png
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @grant       GM_openInTab
// @inject-into 
// @noframes
// @version     2.1.1
// @author      稻米鼠
// @created     2020/9/19 下午1:12:20
// @update      2022-02-15 15:58:59
// @description 批量替换输入框中文字。可实时预览替换效果，在预览中可以选择某些项不进行替换。
// @downloadURL https://update.greasyfork.org/scripts/411561/Input%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/411561/Input%20Replacer.meta.js
// ==/UserScript==

// 注入面板样式
GM_addStyle(`
#input-replacer-userscript-panel {
  position: fixed;
  top: -10px;
  left: -10px;
  box-sizing: border-box;
  width: calc(100vw + 20px);
  height: calc(100vh + 20px);
  padding: 30px 0;
  font-size: 18px;
  overflow-y: scroll;
}
#input-replacer-userscript-panel * {
  box-sizing: border-box;
  font-size: 18px;
  line-height: 1.6em;
}
#input-replacer-userscript-panel.input-replacer-mask {
  background: rgba(0, 0, 0, .6);
}
#input-replacer-userscript-panel.input-replacer-show {
  display: block;
}
#input-replacer-userscript-panel.input-replacer-hide {
  display: none;
}
#input-replacer-userscript-panel > .input-replacer-panel {
  position: relative;
  width: 92%;
  max-width: 800px;
  padding: 30px;
  margin: 0 auto;
  border-radius: 6px;
  box-shadow: 0 12px 36px rgba(0, 0, 0, .6);
  background: #FFF;
}
#input-replacer-userscript-panel > .input-replacer-panel > .input-replacer-panel-close {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #666;
  text-align: right;
  cursor: pointer;
}
#input-replacer-userscript-panel > .input-replacer-panel > .input-replacer-panel-header {

}
#input-replacer-userscript-panel > .input-replacer-panel > .input-replacer-panel-header > h2 {
  text-align: center;
  font-size: 36px;
  color: black;
}
#input-replacer-userscript-panel > .input-replacer-panel > .input-replacer-panel-header > p {
  text-align: center;
  color: #666;
}
#input-replacer-userscript-panel > .input-replacer-panel > .input-replacer-input-group > label,
#input-replacer-userscript-panel > .input-replacer-panel > .input-replacer-input-group > input {
  display: block;
}
#input-replacer-userscript-panel > .input-replacer-panel > .input-replacer-input-group > input {
  color: #666;
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
}
#input-replacer-userscript-panel > .input-replacer-panel > div > button {
  display: block;
  width: 100%;
  color: white;
  background: #04ABFF;
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  text-align: center;
  border: none;
  border-raduis: 3px;
}
#input-replacer-userscript-panel > .input-replacer-panel #input-replacer-preview-header {
  text-align: center;
  font-size: 24px;
  color: black;
}
#input-replacer-userscript-panel > .input-replacer-panel .input-replacer-preview-table-row {
  width: 100%;
  float: left;
}
#input-replacer-userscript-panel > .input-replacer-panel .input-replacer-preview-table-row.input-replacer-lock {
  background: rgba(255, 0, 0, .1);
}
#input-replacer-userscript-panel > .input-replacer-panel #input-replacer-preview::after {
  content: ' ';
  display: block;
  clear: both;
}
#input-replacer-userscript-panel > .input-replacer-panel .input-replacer-preview-table-row {
  border-top: 2px solid #CCC;
}
#input-replacer-userscript-panel > .input-replacer-panel .input-replacer-preview-table-row > .input-replacer-preview-table-td {
  float: left;
  width: 45%;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  word-break: break-all;
  padding: 5px;
}
#input-replacer-userscript-panel > .input-replacer-panel .input-replacer-preview-table-row > .input-replacer-preview-table-td:first-child {
  width: 10%;
  cursor: pointer;
}
#input-replacer-userscript-panel > .input-replacer-panel .input-replacer-preview-table-row > .input-replacer-preview-table-td > .input-replacer-highlight {
  display: inline;
  background: rgba(255, 255, 0, .6)
}
`)
let panelObj  // 面板对象
const inputSelectors = 'input[type=text], input[type=email], input[type=number], input[type=url], textarea' // 文本框选择器
let lockAll = false  // 当前是否处于全选状态（不会很准确，简单实现批量选择）
let replacer  // 替换函数
const getInputs = ()=>{
  const allInputs = Array.from(document.body.querySelectorAll(inputSelectors))
  // 如果使用下面这种写法则暴力的尝试所有非隐藏表单项
  // const allInputs = Array.from(document.body.querySelectorAll('input, textarea')).filter(e=>e.type!=='hidden')
  return allInputs
}
let inputs = getInputs() // 文本框合集（每一次使用前会重新统计。虽然资源开销大点，但可以尽可能保证不出问题）
/**
 * 获取页面中最大的 z-index，并加 1
 *
 * @return {*} 最大 z-index
 */
const maxZIndex = ()=>{
  let zIndex = 0
  document.body.querySelectorAll('*').forEach(el=>{
    if(!isNaN(window.getComputedStyle(el).zIndex)){
      const newZ = +window.getComputedStyle(el).zIndex
      zIndex = zIndex > newZ ? zIndex : newZ
    }
  })
  return zIndex+1
}
/**
 * 创建一个新元素
 *
 * @param {string} tag 新元素的标签
 * @param {element} parentNode 新元素的父节点
 * @param {object} options 新元素的属性
 * @param {array} classNames 新元素的 class 
 * @param {object} events 元素绑定的事件
 * @return {*} 新元素
 */
const createElement = (tag, parentNode, options, classNames, events)=>{
  const el = document.createElement(tag)
  for(const property in options){
    el[property] = options[property]
  }
  if(classNames){
    for(const cla of classNames){
      el.classList.add(cla)
    }
  }
  if(events){
    for(const eventName in events){
      el.addEventListener(eventName, events[eventName])
    }
  }
  parentNode.appendChild(el)
  return el
}
/**
 * 生成预览区的行（无参数则为表头）
 *
 * @param {*} refreshPreview 预览区域刷新函数
 * @param {*} index 文本框合集中的索引
 * @param {*} replacer 文本替换函数
 */
const preRow = (refreshPreview, index, replacer)=>{
  const isHead = isNaN(index)
  const input = inputs[index]
  if(!isHead && input.value.length === 0) return
  const isLock = isHead ? lockAll : input.classList.contains('input-replacer-lock')
  const rowClass = ['input-replacer-preview-table-row']
  if(isLock) rowClass.push('input-replacer-lock')
  const row = createElement(
    'div',
    panelObj.previwArea,
    {},
    rowClass
  );
  createElement(
    'div',
    row,
    { innerText: isLock ? '❌' : '⭕'},
    ['input-replacer-preview-table-td'],
    { click: ()=>{
      if(isHead){
        inputs.forEach(el=>{
          if(el.value.length){
            if(lockAll){
              el.classList.remove('input-replacer-lock')
            }else{
              el.classList.add('input-replacer-lock')
            }
          }
        })
        lockAll = !lockAll
      }else{
        if(isLock){
          input.classList.remove('input-replacer-lock')
        }else{
          input.classList.add('input-replacer-lock')
        }
      }
      refreshPreview()
    } }
  );
  createElement(
    'div',
    row,
    { innerHTML: isHead ? '当前内容' : replacer( inputs[index].value, 'now' )},
    ['input-replacer-preview-table-td']
  );
  createElement(
    'div',
    row,
    { innerHTML: isHead ? '替换结果' : ( isLock ? inputs[index].value : replacer( inputs[index].value, 'preview') )},
    ['input-replacer-preview-table-td']
  );
}
/**
 * 文本替换函数的生成器
 *
 * @param {*} in0 第一个输入框的内容（要搜索的内容）
 * @param {*} in1 第二个输入框的内容（要替换为的内容）
 * @return {*} 文本替换函数
 */
const replacerMaker = (in0, in1)=>{
  if(/^\/.*\/[a-z]*$/.test(in0)){ // 判断是否正则
    const regContent = in0.replace(/^\//, '').replace(/\/[a-z]*/, '').replace(/\\/g, '\\')
    const regFlag = in0.replace(/^\/.*\/([a-z]*)$/, '$1')
    const reg = new RegExp(regContent, regFlag)
    return (text, type)=>{
      const newStr = type ? (m)=>'<span class="input-replacer-highlight">'+(type==='now' ? m : in1)+'</span>' : in1
      return text.replace(reg, newStr)
    }
  }else{
    return (text, type)=>{
      const newStr = type ? (m)=>'<span class="input-replacer-highlight">'+(type==='now' ? m : in1)+'</span>' : in1
      return text.replaceAll(in0, newStr)
    }
  }
}
/**
 * 刷新预览区域
 *
 */
const refreshPreview = ()=>{
  panelObj.previwArea.innerHTML = ''
  const input0 = panelObj.inputGroup[0].value
  const input1 = panelObj.inputGroup[1].value
  inputs = getInputs()
  replacer = replacerMaker(input0, input1)
  if(inputs.length && panelObj){
    createElement(
      'div',
      panelObj.previwArea,
      { innerText: '效果预览', id: 'input-replacer-preview-header' }
    );
    // 插入表头
    preRow(refreshPreview)
    for(let i=0; i<inputs.length; i++){ preRow(refreshPreview, i ,replacer) }
  }
}
const replaceAllInput = e=>{
  const changeEvent = new CustomEvent('change', {})
  inputs.forEach(el=>{
    if(!el.classList.contains('input-replacer-lock')){
      const resultVal = replacer( el.value )
      el.value = resultVal
      try {
        // 触发 change 事件
        el.dispatchEvent(changeEvent)
        // 对 CKeditor 的支持
        if(unsafeWindow.CKEDITOR && el.tagName === 'TEXTAREA'){
          unsafeWindow.CKEDITOR.instances[el.id].setData(resultVal)
        }
      } catch (error) {
          
      }
    }
  })
  panelObj.container.classList.add('input-replacer-hide')
}
const addPanel = ()=> {
  // 创建容器
  const container = createElement(
    'div',
    document.body,
    {
      id: 'input-replacer-userscript-panel',
      style: 'z-index: ' + maxZIndex() + ';'
    },
    ['input-replacer-mask']
  );
  // 添加面板
  const panel = createElement(
    'div',
    container,
    {},
    ['input-replacer-panel']
  );
  // 注入关闭按钮
  const closeButton = createElement(
    'div',
    panel,
    { innerText: 'Close' },
    ['input-replacer-panel-close'],
    {
      click: ()=>{
        if(confirm('确认关闭？')){
          container.classList.add('input-replacer-hide')
        }
      }
    }
  );
  // 注入标题和描述
  const panelHeader = createElement(
    'div',
    panel,
    {
      innerHTML: `
        <h2>输入框查找替换</h2>
        <p>对页面中所有输入框和文本域的内容进行批量替换。</p>
        `
    },
    ['input-replacer-panel-header']
  );
  // 设置输入框组
  const inputNameGroup = ['要查找的内容（支持正则表达式）', '要替换为的内容（支持 $1、$2……替代分组）']
  const inputGroup = []
  for(const name of inputNameGroup){
    const inputArea = createElement(
      'div',
      panel,
      {},
      ['input-replacer-input-group']
    );
    const label = createElement(
      'label',
      inputArea,
      { for: "input-replacer-input-group-"+ inputNameGroup.indexOf(name), innerText: name },
      []
    );
    const input = createElement(
      'input',
      inputArea,
      { id: "input-replacer-input-group-"+ inputNameGroup.indexOf(name), type: 'search' },
      [],
      { keyup: refreshPreview }
    );
    inputGroup.push(input)
  }
  // 注入替换按钮
  const buttonArea = createElement(
    'div',
    panel,
    {},
    ['input-replacer-button-area']
  );
  const mainButton = createElement(
    'button',
    buttonArea,
    { innerText: '替换全部' },
    ['input-replacer-button-area'],
    { click: replaceAllInput }
  );
  // 注入预览区
  const previwArea = createElement(
    'div',
    panel,
    { id: 'input-replacer-preview' },
    []
  );

  return {
    container,
    panel,
    closeButton,
    panelHeader,
    inputGroup,
    buttonArea,
    mainButton,
    previwArea
  }
}
GM_registerMenuCommand('1、输入框批量替换', ()=>{
  if(panelObj){
    panelObj.container.classList.remove('input-replacer-hide')
  }else{
    panelObj = addPanel()
  }
})
GM_registerMenuCommand('2、更多脚本', ()=>{
  GM_openInTab('https://script.izyx.xyz/?from=input-replacer')
})
