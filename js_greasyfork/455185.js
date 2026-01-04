// ==UserScript==
// @name         codesign 颜色色板生成 element-css-vars
// @namespace    https://codesign.qq.com/
// @version      0.2
// @description  哈哈哈哈哈
// @author       你
// @match        https://codesign.qq.com/app/dsm/*
// @require      http://code.jquery.com/jquery-2.1.1.min.js
// @require      http://code.jquery.com/ui/1.11.0/jquery-ui.min.js
// @resource      https://code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455185/codesign%20%E9%A2%9C%E8%89%B2%E8%89%B2%E6%9D%BF%E7%94%9F%E6%88%90%20element-css-vars.user.js
// @updateURL https://update.greasyfork.org/scripts/455185/codesign%20%E9%A2%9C%E8%89%B2%E8%89%B2%E6%9D%BF%E7%94%9F%E6%88%90%20element-css-vars.meta.js
// ==/UserScript==

(function() {
  'use strict';
  console.log('注入成功')
  let script = document.createElement('link');
  script.setAttribute('rel', 'stylesheet');
  script.setAttribute('type', 'text/css');
  script.href = "https://code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css";
  document.documentElement.appendChild(script);

  const store = {
    project: {}, iterationId: '', iteration: {}, personHoursMap: {}
  }

  const intervalId = setInterval(() => {
    main();

  }, 2000)
  const main = async () => {
      let result = 'html.dark {';
      const doms = document.querySelectorAll('.colors-item');
      if(doms.length){
          clearInterval(intervalId)
      }
      Array.prototype.forEach.apply(doms, [(item) => {
          let clazz = item.querySelectorAll('p')[0].innerText;
          if(!clazz.startsWith('ss')){
              clazz = `el-${clazz}`
          }
          clazz = `--${clazz}`;
          const HEX_list = item.querySelectorAll('p')[1].innerText.split(' ');
          const opacity = Number(HEX_list[1].replace('%', '')) / 100;
          result += `\n  ${clazz}: ${hexToRgba(HEX_list[0], opacity)};`
          // console.log(clazz, hexToRgba(HEX_list[0], opacity), opacity)
      }]);
      result += '\n}';
      // document.querySelector('.library-module__panel.library-colors__panel').innerHTML = result
      document.querySelector("div.library-section__title > p").innerHTML += `<a href="javascript:void(0)">复制代码</a>`;
      document.querySelector("div.library-section__title > p > a").addEventListener('click', () => copy(result))
      console.log(result)
  }
  function copy(content){
	// content为要复制的内容
	// 创建元素用于复制
	const ele = document.createElement('input')
	// 设置元素内容
	ele.setAttribute('value', content)
	// 将元素插入页面进行调用
	document.body.appendChild(ele)
	// 复制内容
	ele.select()
	// 将内容复制到剪贴板
	document.execCommand('copy')
	// 删除创建元素
	document.body.removeChild(ele)
	alert('复制成功');
  }


  function hexToRgba (hex, opacity) { var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i; hex = hex.replace(shorthandRegex, function (m, r, g, b) { return r + r + g + g + b + b; }); var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex); opacity = opacity >= 0 && opacity <= 1 ? Number(opacity) : 1; return result ? 'rgba(' + [ parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16), opacity ].join(',') + ')' : hex;} // Output: rgb(204,0,255,1)console.log(hexToRgba('#CC00FF', 0.3)); // Output: rgb(204,0,255,0.3)

  window.addEventListener('locationchange', main)

  window.onload = main
  // chrome.runtime.sendMessage({
  //   TYPE: 'main'
  // }, (response) => {
  //   console.log(response)
  // })
  // Your code here...
})();
