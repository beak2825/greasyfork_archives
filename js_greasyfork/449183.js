// ==UserScript==
// @name         J去广告，增加复制
// @description  javbus去广告
// @include      *://www.javbus.com/*
// @include      *://www.seedmm.fun/*
// @include      *://www.javbus.red/*
// @version      0.3.4
// @run-at       document-end
// @grant 	     GM_setClipboard
// @namespace https://greasyfork.org/users/461433
// @downloadURL https://update.greasyfork.org/scripts/449183/J%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%8C%E5%A2%9E%E5%8A%A0%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/449183/J%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%8C%E5%A2%9E%E5%8A%A0%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==
(function(){
'use strict';
const adclasses=["alert","ad-table","ad-list","footer","ptb30","ptb10", "ad-box"];
for(let adclass of adclasses){
let elements=document.getElementsByClassName(adclass);
for(let element of elements){
element.style.display='none'
}
}
    
    //上面是去广告
    let img = document.querySelectorAll('.visible-xs-inline')
    for (let element of img )
    {
        element.src = ''
        element.alt = ''
    }
    
    let img1 = document.querySelector('.hidden-xs')
    img1.src = ''

        console.log('=====')

   let tab = document.getElementById('magnet-table')
      console.log('=='+tab.rows.length)
   let tabtr = tab.rows[0]
    console.log('=====')
   var btn = document.createElement('button')
   btn.style.width = '90px'
   btn.style.height = '40px'
   btn.innerText = '获取数据'

    tabtr.after(btn)
    btn.addEventListener('click', (e)=>{
        e.preventDefault()
        btn.style.backgroundColor='pink'
        addCopy()
    })
    
    
    console.log('=====')
    
function addCopy(){
    let tab = document.getElementById('magnet-table')
      console.log('==tab rows'+tab.rows.length)
    for (let i = 1; i < tab.rows.length;i++)
    {
        var tr = tab.rows[i]
        var cellsCount = tr.cells.length
        var td = tr.cells[1]
        //拿到标签td 的 a 数据
        var a = td.innerHTML
     //    从a 数据拿到链接
        console.log('a='+a)
        var start = 'href='
        var end = '>'
        var s = a.indexOf(start)+6
        var e = a.indexOf(end)-1
        var url = a.substring(s,e)
        
        var btn = document.createElement('button')
        btn.innerText = url
        btn.style.fontSize='8px'
        btn.style.width = '99px'
//    btn.style.height = '40px'
        tr.appendChild(btn)
//     td.before(btn)
        btn.onclick = function(){
            GM_setClipboard(url)
            copyContent(url)
            this.style.backgroundColor='pink'
        }
        
        
        console.log('url='+url)

    }
}
    
    /**
 * 复制内容
 * @param {String} value 需要复制的内容
 * @param {String} type 元素类型 input, textarea
 */
 function copyContent(value, type = 'input') {
  const input = document.createElement(type);
  input.setAttribute('readonly', 'readonly'); // 设置为只读, 防止在 ios 下拉起键盘
  // input.setAttribute('value', value); // textarea 不能用此方式赋值, 否则无法复制内容
  input.value = value;
  document.body.appendChild(input);
  input.setSelectionRange(0, 9999); // 防止 ios 下没有全选内容而无法复制
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
}
    
})();