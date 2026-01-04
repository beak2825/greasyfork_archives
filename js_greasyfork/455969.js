// ==UserScript==
// @name         b站动态页面使用体验增强
// @namespace    http://tampermonkey.net/
// @version      0.44
// @description  快速收起B站评论、屏蔽充电动态、带货动态、添加屏蔽up主
// @author       XBss
// @match        https://t.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455969/b%E7%AB%99%E5%8A%A8%E6%80%81%E9%A1%B5%E9%9D%A2%E4%BD%BF%E7%94%A8%E4%BD%93%E9%AA%8C%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/455969/b%E7%AB%99%E5%8A%A8%E6%80%81%E9%A1%B5%E9%9D%A2%E4%BD%BF%E7%94%A8%E4%BD%93%E9%AA%8C%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==
let key1
let ban_storage = localStorage.getItem("ban")
// console.log(ban_storage)
if(ban_storage==null){
    localStorage.setItem("ban","")
    ban_storage = ""
}
let ban=ban_storage.split("|")
let ban_update = false
function mouse_down(event){
    const x = event.clientX, y = event.clientY;
    const element = document.elementFromPoint(x, y);
    // console.log(element.className)
    if (element.className.includes("comment")){
        key1 = element
    }
    if (!element) {
        console.log("error: no element")
    }
}

// 获取页面滚动的元素，通常是 window
const scrollingElement = window;
let scroll_num = 201;
// 添加滚动事件监听器
scrollingElement.addEventListener('scroll', function() {
    scroll_num++
    if (scroll_num>200||ban_update===true){
        const elements = document.querySelectorAll('.bili-dyn-item__main');
        // 遍历所有匹配的元素
        elements.forEach(function(element) {
            // 获取元素中的文本内容,该文本是每个up的名字
            const textContent = element.querySelector('.bili-dyn-title__text').textContent;
            ban.forEach(function (content, index) {
                // if (content===""){
                //     console.log("空的")
                // }
                if (content!==""&&textContent.includes(content)){
                    element.style.display = 'none';
                }
            })
            // 使用 querySelector 来查找内部的子元素
            //目前充电动态可以识别因为有充电字样，但是充电视频只在封面图片有充电字样无法检索，所以将不能评论的都判定为充电视频
            const commentElement = element.querySelector("div[data-type='comment']");
            if (!commentElement) {

                // 没有找到评论元素,判定为充电专属
                // console.log(textContent);
                // console.log("不包含评论元素");
                element.style.display = 'none';
            }
            const goodsElement = element.querySelector(".dyn-goods");
            if (goodsElement){
                // 找到商品元素,判定为带货广告
                element.style.display = 'none';
            }
        });
        scroll_num = 0
        ban_update = false
    }
});


let Container = document.createElement('div');
Container.id = "sp-ac-container";
Container.style.position="fixed"
Container.style.left="1400px"
Container.style.top="700px"
Container.style['z-index']="999999" //设置为网页顶层
Container.innerHTML =`<button id="myCustomize" style="position:absolute; left:30px; top:20px;background-color: yellow;cursor: pointer;">
  关闭评论
</button>
`
Container.addEventListener('click',function (e) {
    key1.scrollIntoView(true)
    window.scrollBy(0,-350)
    key1.click()
})
let x
let y
let move = function (e){
    Container.style.left = e.pageX- x+'px'
    Container.style.top = e.pageY-y+"px"
};
Container.addEventListener('mousedown',function (e) {
    x = e.pageX - this.offsetLeft
    y = e.pageY - this.offsetTop
    document.addEventListener('mousemove',move)
    // Container.addEventListener('mousemove',move)
    document.addEventListener('mouseup',function (){
        document.removeEventListener('mousemove',move)
    })
})

/**
 * 如果在小组件上加这个，移动过快会触发不了这个事件，所以还是直接在document上加就行
 */
// Container.addEventListener('mouseup',function (){
//     // document.removeEventListener('mousemove',move)
//     Container.removeEventListener('mousemove',move)
// })
document.body.appendChild(Container);
document.onmousedown = mouse_down

// 创建一个包含按钮和文本框的容器 div
let container = document.createElement('div');
container.id = 'myContainer';
container.style.position = 'fixed';
container.style.left = '1300px';
container.style.top = '900px';
container.style['z-index'] = '999999';

// 创建一个按钮
let button = document.createElement('button');
button.id = 'myCustomize';
button.style.position = 'absolute';
button.style.left = '30px';
button.style.top = '20px';
button.style.backgroundColor = 'yellow';
button.style.cursor = 'pointer';
button.textContent = '屏蔽';

// 创建一个文本框
let textBox = document.createElement('input');
textBox.type = 'text';
textBox.value = ban_storage
textBox.style.display = 'none';

// 将按钮和文本框添加到容器中
container.appendChild(button);
container.appendChild(textBox);

// 将容器添加到文档的 body 中
document.body.appendChild(container);
// 添加按钮点击事件监听器
button.addEventListener('click', function() {
    // 在按钮点击时执行操作，例如显示/隐藏文本框
    if (textBox.style.display === 'none' || textBox.style.display === '') {
        textBox.style.display = 'block';
    } else {
        textBox.style.display = 'none';
    }
});
// 添加文本框内容变化事件监听器
textBox.addEventListener('input', function() {
    // 更新存储文本框内容的变量
    ban = textBox.value.split('|');
    localStorage.setItem("ban",textBox.value)
    ban.update = true;
});