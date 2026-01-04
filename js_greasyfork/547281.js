// ==UserScript==
// @name         CSS 样式注入
// @namespace    https://diaoqi.gitee.io/blog/
// @version      0.5.01
// @description  插入自定义 CSS 样式到任意网址
// @author       掉漆
// @license      MIT
// @match        *
// @include      *
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @icon         https://cdn.jsdelivr.net/gh/google/material-design-icons@master/symbols/web/css/materialsymbolsoutlined/css_48px.svg
// @downloadURL https://update.greasyfork.org/scripts/547281/CSS%20%E6%A0%B7%E5%BC%8F%E6%B3%A8%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/547281/CSS%20%E6%A0%B7%E5%BC%8F%E6%B3%A8%E5%85%A5.meta.js
// ==/UserScript==
(function () {
  'use strict';
  // 代码来源于Youth霖，原地址：https://gist.github.com/youthlin/c4c08ffe4273ca7ebbf759289cef9964
  // 本代码简化源代码部分功能、优化部分展示逻辑、以及添加部分功能。
  const SETTING_KEY = 'cssMap'
  const RAND = (Math.random() * 100000).toFixed(0)

  // 实现类似jQuery中的on方法
  const on = function (eventName, selector, handler) {
    // http://youmightnotneedjquery.com/
    document.addEventListener(eventName, function (e) {
      for (let target = e.target; target && target !== this; target = target.parentNode) {
        if (target.matches !== undefined && target.matches(selector)) {
          handler.call(target, e);
          break;
        }
        if (target.tagName === 'HTML') {
          break;
        }
      }
    }, false);
  }

  function start() {
    const cssMap = cssValue()
    const html = document.getElementsByTagName('html')[0]
    const inject = `<div id="inject-watermark-${RAND}" class="inject-watermark"></div><style>
    #inject-watermark-${RAND} {position: fixed;left: 0;top: 0;right: 0;bottom: 0;z-index: 1;pointer-events: none;}
    #inject-css-${RAND} {display: none;position: fixed;left: 0;top: 0;right: 0;bottom: 0;z-index: 999;background-color: rgba(0,0,0,.8);justify-content: center;align-items: center;font-size: 16px;}
    #inject-css-setting {max-height: 90%;overflow: auto;color: #000;}
    #inject-css-setting button {border: 1px solid #ccc;background-color: #fff;cursor: pointer;padding: 4px;}
    #inject-css-setting table {border-collapse: collapse;background-color: #fff;}
    #inject-css-setting th, #inject-css-setting td {border: 1px solid #ccc;padding: .5em;max-width: 50vw;overflow: auto;}
    #inject-css-setting tr.active {font-weight: bold;}
    #inject-css-setting td.active:after {content: ' (匹配成功)⭐️';}
    #inject-css-setting tr:nth-child(even) {background-color: #f2f2f2;}
    #inject-css-setting tr:hover {background-color: #ddd;}
    </style><div id="inject-css-${RAND}"></div>`

    html.insertAdjacentHTML('beforeend', inject)
    const wrapper = document.getElementById(`inject-css-${RAND}`)

    // 点击设置按钮事件
    GM_registerMenuCommand('设置CSS规则', function (e) {
      wrapper.style.display = 'flex'
    }, 's')

    // 渲染当前规则
    render(cssMap, wrapper)

    // 编辑规则详情
    on('click', '.inject-css-edit', function (e) {
      // GM.setClipboard(e.target.dataset.key, "text");
      document.querySelector('#inject-css-url').value = e.target.dataset.key
      document.querySelector('#inject-css-value').value = e.target.dataset.value
    })
    // 删除规则
    on('click', '.inject-css-delete', function (e) {
      const res = confirm(`确认删除${e.target.dataset.key}吗？`);
      if (res === true) {
        const deleteKey = e.target.dataset.key
        cssMap.delete(deleteKey)
        save(cssMap)
        render(cssMap, wrapper)
      }
    })
    // 添加规则
    on('click', '.inject-css-add', function (e) {
      e.preventDefault()
      const k = document.querySelector('#inject-css-url').value.trim()
      const v = document.querySelector('#inject-css-value').value.trim()
      if (k !== '' && v !== '') {
        try {
          new RegExp(k)
        } catch (e) {
          alert('`' + k + '`: 不是有效的正则表达式. error=' + e)
          return
        }
        cssMap.set(k, v)
        save(cssMap)
        render(cssMap, wrapper)
      }
    })
    // 关闭按钮
    on('click', '.inject-css-hide', function () {
      wrapper.style.display = 'none'
    })
    // 键盘退出按钮
    on('keyup', 'html', function (e) {
      if (e.code === 'Escape') {
        wrapper.style.display = 'none'
      }
    })
    // 默认隐藏界面
    document.querySelector('.inject-css-hide').click()
  }

  // 获取保存的规则信息
  function cssValue() {
    const settingValue = GM_getValue(SETTING_KEY, '{}');
    let cssMap = JSON.parse(settingValue) // url regex -> css value
    cssMap = new Map(Object.entries(cssMap)) // to Map
    return cssMap
  }

  // 保存规则
  function save(cssMap) {
    const s = JSON.stringify(Object.fromEntries(cssMap));// Map 需要先转为 Object 才能序列化为 JSON
    GM_setValue(SETTING_KEY, s)
  }

  // 渲染当前CSS规则 渲染配置的表格
  function render(cssMap, wrapper) {
    const url = window.location.href
    let injectCss = ``
    let tableBody = ''
    // 遍历所有规则，渲染整个表格。若找到当前页规则，保存在injectCss中，最后统一渲染。
    for (const entry of cssMap) {
      try {
        let active = ''
        if (new RegExp(entry[0]).test(url)) {
          injectCss += entry[1] + "\n"
          active = 'active'
        }
        tableBody += `<tr class="${active}">
          <td class="${active}"><code>${entry[0]}</code></td>
          <td><pre style="margin-bottom:0;overflow: auto;height:70px;border:1px solid #aaa;font-size:12px">${entry[1]}</pre></td>
          <td>
            <button data-key="${entry[0]}" class="inject-css-edit">编辑</button>
            <button data-key="${entry[0]}" class="inject-css-delete">删除</button>
          </td></tr>`
      } catch (e) {
        cssMap.delete(entry[0])
      }
    }
    wrapper.innerHTML = `<style>${injectCss}</style><div id="inject-css-setting"><button class="inject-css-hide">关闭(Esc)</button>
      <table><tbody><tr><th>URL 正则</th><th>注入 CSS</th><th>操作</th></tr>
      ${tableBody}
      <tr><td><label><input type="text" id="inject-css-url" placeholder="点号斜线记得转义"></label></td>
      <td><textarea id="inject-css-value" cols="50" rows="5" placeholder="html { background-color: #ccc; }&#10;匹配某值1:a[title~=&quot;屏蔽词加遮罩&quot;] {filter: blur(10px);}&#10;匹配某值2:img[type*=&quot;屏蔽词&quot;]&#10;匹配前缀:img[type^=&quot;low&quot;]&#10;匹配后缀:img[type$=&quot;ball&quot;]"></textarea></td>
      <td><button class="inject-css-add">添加</button></td></tr>
      </tbody></table></div>`
  }

  // 延时执行当前脚本
  setTimeout(start, 2000)

})();
