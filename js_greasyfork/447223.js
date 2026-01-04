// ==UserScript==
// @name         Jupyter Background 添加背景
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  try to change jupyter background
// @author       风无
// @license      MIT
// @match        http://localhost:*/notebooks/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.8.0.js
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/447223/Jupyter%20Background%20%E6%B7%BB%E5%8A%A0%E8%83%8C%E6%99%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/447223/Jupyter%20Background%20%E6%B7%BB%E5%8A%A0%E8%83%8C%E6%99%AF.meta.js
// ==/UserScript==

/*
图片添加方法：
进入本代码的编辑器，在存储页面中修改"img_url"项，添加所需的图片url。点击保存按钮，如果格式正确会提示保存成功。
编写时注意添加在方括号内，使用英文标点，双引号括住url，url之间用逗号隔开。

How to add image:
Enter Editor of this code, select Storage page, add your url in "img_url". Press Save to save url.
Pay attention to code format.

*/

/* 如果因存储问题无法工作，可以复制以下内容到存储区

{
    "auto_bg": 0,
    "img_url": [
        "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi0.hdslb.com%2Fbfs%2Farticle%2F256e83d824604d724fad13061406173a4674b2b1.jpg&refer=http%3A%2F%2Fi0.hdslb.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1659079668&t=868e4347e7049a25b941c4e23445c4ab",
        "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi0.hdslb.com%2Fbfs%2Farticle%2F737a606ec33ad93de70e434db353d2e051f75366.jpg&refer=http%3A%2F%2Fi0.hdslb.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1659079570&t=1e90ff91e1f862ac158574dd52e14c52",
        "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2F2019-04-15%2F5cb43701cb8c3.jpg&refer=http%3A%2F%2Fpic1.win4000.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1659079591&t=bd5543ca5b971b5cd7ec92b571dc6e33",
        "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1113%2F060320112631%2F200603112631-10-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1659083668&t=3005a1cb1fb9292f46e8ef86b7b7e095",
        "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi0.hdslb.com%2Fbfs%2Farticle%2F01e1bad0bbe7c581b13435717f7475d0b30ffcd1.jpg&refer=http%3A%2F%2Fi0.hdslb.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1659083764&t=e5719d35d787eb854d33095de07d0782"
    ],
    "index": 0
}

*/



(function () {
    'use strict';
    const imgurl = ''
    const bg_color = '#fff'
    const color_a = 'rgba(255,255,255,0.15)'
    const color_b = 'rgba(255,255,255,0.3)'
    const color_t = 'rgba(255,255,255,0)'
    // auto_bg 为0时自动开启背景
    const AUTOBG = 'auto_bg'
    let bg = GM_getValue(AUTOBG)


    // style modify
    let sheet = document.styleSheets
    let sta = sheet.length-1
    sheet[sta].insertRule('#notebook-container{background-color: '+color_t+'}')
    sheet[sta].insertRule('#notebook-container{box-shadow: 4px 4px 10px 5px #00000060}')
    sheet[sta].insertRule('#notebook-container{border-radius: 10px}')
    //sheet[sta].insertRule('#header{background-color: '+color_a+'}',0)
    document.getElementById('header').style.backgroundColor=color_t
    document.getElementsByClassName('header-bar')[0].style.backgroundColor=color_a
    sheet[sta].insertRule('#menus{background-color: '+color_a+'}')
    sheet[sta].insertRule('#menus{border-color: '+color_t+'}')
    sheet[sta].insertRule('.btn-group{background-color: '+color_t+'}')
    sheet[sta].insertRule('.btn{background-color: '+color_t+'}')
    sheet[sta].insertRule('#cell_type{background-color: '+color_t+'}')
    sheet[sta].insertRule('#cell_type{color: #000}')
    sheet[sta].insertRule('.btn-default{color: #000}')
    sheet[sta].insertRule('div.input_area{background-color: '+color_t+'}')
    sheet[sta].insertRule('.rendered_html pre{background-color: '+color_a+'}')
    sheet[sta].insertRule('.rendered_html pre code{background-color: '+color_t+'}')

    sheet[sta].insertRule('.input_area{background-color: '+color_b+'}')
    sheet[sta].insertRule('code{background-color: '+color_t+'}')
    sheet[sta].insertRule('pre{background-color: '+color_t+'}')
    sheet[sta].insertRule('div.input_prompt{text-shadow: 1px 1px #f5f5f5}')
    // 字体
    /*
    sheet[sta].insertRule('pre{font-size: 16px}')
    sheet[sta].insertRule('pre{font-family: Consolas}')
    sheet[sta].insertRule('pre{max-height: 30em}')
    sheet[sta].insertRule('span{max-height: 30em}')
    */


    // #匹配id .匹配class
    function setBackground(){
        // 显示背景
        let index = GM_getValue('index', 0)
        let url_array = GM_getValue('img_url')
        $('body').css({'background': '#FFFFFF url(\''+ url_array[index] +'\') center bottom'});
        //$('body').css({'background-position': 'center bottom'});
    }
    function changeBackground(){
        // 改变背景索引，并显示
        let index = GM_getValue('index',0)
        let url_array = GM_getValue('img_url')
        index += 1
        if (index >= url_array.length){index=0}
        GM_setValue('index',index)
        setBackground()
    }
    function changeBackground_r(){
        // 改变背景索引，并显示
        let index = GM_getValue('index',0)
        let url_array = GM_getValue('img_url')
        index -= 1
        if (index < 0){index=url_array.length-1}
        GM_setValue('index',index)
        setBackground()
    }
    function turnoffBackground(){
        // 关闭背景
        $('body').css({'background': bg_color});
    }
    function add_url(){
        // 添加链接
        let index = GM_getValue('index',0)
        let url_array = GM_getValue('img_url')
        let url=prompt("请输入图片链接\nInput picture url");
        if (url!=null){
            url_array.splice(index+1, 0, url)
            GM_setValue('img_url',url_array)
            //GM_getValue('index',index)
            //setBackground()
            changeBackground()
        }
    }
    function delete_url(){
        // 删除链接
        let index = GM_getValue('index',0)
        let url_array = GM_getValue('img_url')
        var r=confirm("确认删除该背景？\nConfirm delete background\n"+url_array[index]);
        if (r==true){
            url_array.splice(index, 1)
            GM_setValue('img_url',url_array)
            setBackground()
        }
    }
    // 添加按钮
    let sp = document.createElement('span')
    let changebg_button = document.createElement('button')
    let changebg_button_r = document.createElement('button')
    let switchbg_button = document.createElement('button')
    const autobg_button = document.createElement('button')
    let add_button = document.createElement('button')
    let delete_button = document.createElement('button')
    let head = document.getElementById('header-container')
    var arr = [changebg_button, changebg_button_r, switchbg_button, autobg_button, add_button, delete_button];
    changebg_button.textContent = '▶'
    changebg_button.title = '下一张图片'
    changebg_button_r.textContent = '◀'
    changebg_button_r.title = '上一张图片'
    switchbg_button.textContent = 'Switch bg'
    switchbg_button.title = '切换显示'
    autobg_button.textContent = ''
    autobg_button.title = '开启自动显示'
    add_button.textContent = '+'
    add_button.title = '添加图片'
    delete_button.textContent = '🗑'
    delete_button.title = '删除该图片'
    // 功能函数
    function autobg_state(){
        // 更新按钮文本
        if (GM_getValue(AUTOBG)==0){
            autobg_button.textContent = 'Auto bg: on'
        }
        else{
            autobg_button.textContent = 'Auto bg: off'
        }
    }
    function autobg_switch(){
        // 切换自动模式并更新文本
        if (GM_getValue(AUTOBG)==0){
            GM_setValue(AUTOBG, 1)
        }
        else{
            GM_setValue(AUTOBG, 0)
            alert('Jupyter will auto turn background on when open it.')
        }
        autobg_state()
    }
    function switchBackground(){
        // 切换背景
        if (bg==1)
        {
            turnoffBackground();
            bg=0
            switchbg_button.textContent = 'Switch bg: off'
        }
        else
        {
            setBackground();
            bg=1
            switchbg_button.textContent = 'Switch bg: on'
        }
    }
    autobg_state()
    arr.forEach(function (butn){
        butn.classList=['btn']
        butn.style.backgroundColor = color_b
        butn.style.borderColor = color_b
        butn.style.borderRadius = '2px'
        butn.style.border = '1px solid'
    })
    head.insertBefore(sp, head.children[2])
    sp.appendChild(autobg_button)
    sp.appendChild(switchbg_button)
    sp.appendChild(changebg_button_r)
    sp.appendChild(changebg_button)
    sp.appendChild(add_button)
    sp.appendChild(delete_button)
    // 添加响应
    changebg_button.addEventListener('click',() => {changeBackground();});
    changebg_button_r.addEventListener('click',() => {changeBackground_r();});
    switchbg_button.addEventListener('click',() =>{switchBackground();});
    switchbg_button.click();
    autobg_button.addEventListener('click',() =>{autobg_switch();});
    add_button.addEventListener('click',() =>{add_url();});
    delete_button.addEventListener('click',() =>{delete_url();});
})();