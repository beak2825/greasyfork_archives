// ==UserScript==
// @name         swagger 的页面生成相关的接口
// @namespace    http://tampermonkey.net/
// @version      0.9.2
// @description  try to take over the world!
// @match        http://localhost:8092/swagger-ui.html
// @author       kkopite
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.20/lodash.min.js
// @downloadURL https://update.greasyfork.org/scripts/418741/swagger%20%E7%9A%84%E9%A1%B5%E9%9D%A2%E7%94%9F%E6%88%90%E7%9B%B8%E5%85%B3%E7%9A%84%E6%8E%A5%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/418741/swagger%20%E7%9A%84%E9%A1%B5%E9%9D%A2%E7%94%9F%E6%88%90%E7%9B%B8%E5%85%B3%E7%9A%84%E6%8E%A5%E5%8F%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';
      function copy(copyTxt) {
    // input不会保留换行符
    var createInput = document.createElement("textarea");
    createInput.value = copyTxt;
    document.body.appendChild(createInput);
    createInput.select(); //选择对象
    document.execCommand("Copy"); //执行浏览器复制命令
    createInput.className = "createInput";
    createInput.style.display = "none";
    //alert("复制成功，可以粘贴了！");
    console.log(copyTxt);
  }
    
    const select = document.createElement('select')
     select.style.position = "fixed";
    select.style.top = "120px";
    select.style.right = 0;
    document.body.append(select);
    
    const options = [
        { value: 'axios', text: '正常' },
        { value: 'wx', text: '小程序' }
    ]
    
    options.forEach(({ value, text }) => {
       const option = document.createElement('option')
       option.value = value
       option.innerText = text
       select.appendChild(option)
    })
    
    select.value = localStorage.getItem('type') || 'axios'

    select.addEventListener('change', e => {
        localStorage.setItem('type', select.value)
    })
    
    
    // Your code here...
    const foo = () => {
            const all = document.querySelectorAll('.operations .heading')
    for (let i = 0; i < all.length; i++) {
       const ele = all[i]
       const method = ele.querySelector('.http_method').innerText.replace(/\s/g, '')
       const path = ele.querySelector('.path').innerText.replace(/\s/g, '')
       const arr = path.split('/')
       let name = arr[arr.length - 1]
       name = name.slice(0, name.indexOf('.'))
       name = _.camelCase(name)
       let params = 'params'
       if (method.toUpperCase() === 'POST') {
           params = 'data'
       }
       let code = `export const ${name} = (${params} = {}) => {
  return request.request({
    method: '${method}',
    url: '${path}',
    ${params}
  })
}
`
       if (select.value === 'wx') {
       code = `export const ${name} = (data = {}) => {
  return wx.request({
    method: '${method.toUpperCase()}',
    url: URL + '${path}',
    data
  })
}`
       }
       
       const btn = document.createElement('button')
       btn.innerText = '生成代码到粘贴板'
       btn.onclick = () => {
           copy(code)
       }
       ele.appendChild(btn)
    }
    }
    
        const btn = document.createElement('button')
    btn.innerText = '生成'
    btn.onclick = foo
    btn.style.position = "fixed";
    btn.style.top = "64px";
    btn.style.right = 0;
    btn.style.padding = "10px";
    document.body.append(btn);
})();