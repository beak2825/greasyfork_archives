// ==UserScript==
// @name         稿定图片去水印,保存原图
// @namespace    http://tampermonkey.gaodingtupian.net/
// @require      https://cdn.bootcdn.net/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @require      https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://cdn.jsdelivr.net/npm/dom-to-image@2.6.0/dist/dom-to-image.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @require      https://fastly.jsdelivr.net/npm/sweetalert2@11
// @version      1.1
// @description  稿定图片去水印,保存原图，前端操作导出。可通过放大缩小模板来控制导出图片清晰度，模板越大，导出图片质量越好。
// @author       zouys
// @match        https://www.gaoding.com/editor/design*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/498344/%E7%A8%BF%E5%AE%9A%E5%9B%BE%E7%89%87%E5%8E%BB%E6%B0%B4%E5%8D%B0%2C%E4%BF%9D%E5%AD%98%E5%8E%9F%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/498344/%E7%A8%BF%E5%AE%9A%E5%9B%BE%E7%89%87%E5%8E%BB%E6%B0%B4%E5%8D%B0%2C%E4%BF%9D%E5%AD%98%E5%8E%9F%E5%9B%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //模拟浏览器
    const mobileUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';
    Object.defineProperty(navigator, 'userAgent', {
        get: function() {
            return mobileUserAgent;
        },
        configurable: true
    });
    function addXMLRequestCallback() {

        // oldSend 旧函数 i 循环
        const oldSend = XMLHttpRequest.prototype.send;
        const oldOpen = XMLHttpRequest.prototype.open;


        XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
            this._url = url; // 将 URL 存储在 XMLHttpRequest 实例的 _url 属性中
            oldOpen.apply(this, arguments);
        };
        XMLHttpRequest.prototype.send = function (data) {
            var self = this;
            //拦截返回请求
            this.addEventListener('load', function() {
                if (self.responseURL.includes('https://gdesign-dam.dancf.com')) {
                    let responseObject = JSON.parse(self.responseText);

                    console.log("捕获请求：", responseObject);
                    // 修改响应数据
                    let modifiedResponse = JSON.stringify(responseObject);

                    // 将修改后的响应发送给浏览器
                    Object.defineProperty(self, 'response', { writable: true });
                    Object.defineProperty(self, 'responseText', { writable: true });
                    self.response = modifiedResponse;
                    self.responseText = modifiedResponse;
                }
            });

            oldSend.call(this, data);
        };

    }
    addXMLRequestCallback()
    window.onload = function () {

        document.getElementById('water-mark') && document.getElementById('water-mark').remove();
        document.getElementById('water-mark') && document.getElementById('water-mark').remove();

        async function downloadImg() {
            try {
                if(Swal){
                    Swal.fire({
                        position: 'top-end', //定位 左上角
                        type: 'success',
                        title: '↑↑↑下载中，请留意浏览器右上角↑↑↑弹窗~',
                        showConfirmButton: false,
                        timer: 5000
                    })
                }
                traverseAndRemove()
                document.getElementById('water-mark') && document.getElementById('water-mark').remove();
                let imgDom = document.getElementsByClassName('editor-canvas')[0]
                //imgDom=imgDom.cloneNode(true);
                //await traverseAndRemove(imgDom);
                if (imgDom) {
                    // 解决转换出来的图片的清晰度问题
                    // 手动创建一个 canvas 标签
                    var root = document.documentElement
                    root.style.overflow = 'auto'
                    const canvas = document.createElement('canvas')
                    // 获取父级的宽高
                    const width = parseInt(window.getComputedStyle(imgDom).width)
                    const height = parseInt(window.getComputedStyle(imgDom).height)
                    // 定义放大倍数，可支持小数
                    let scale = 5
                    canvas.width = width * scale
                    canvas.height = height * scale
                    canvas.style.width = width + 'px'
                    canvas.style.height = height + 'px'
                    /* Array.from(document.querySelectorAll('.editor-layout-current div'))
                         .filter((el) => el.classList.length===0 && el.childNodes.length===0)
                         .forEach((el) => {
                             el.setAttribute('data-html2canvas-ignore', '')
                         })*/
                    // 拿到目标dom调用一下html2canvas方法就能生成canvas对象了
                    // 获取要转换的元素
                    html2canvas(imgDom, {
                        canvas: canvas,
                        scale: scale,
                        useCORS: true,// 开启跨域设置，需要后台设置cors
                        ignoreElements:(element)=>{
                            // console.log(element)
                            if(element.tagName==='DIV' &&element.getAttribute('style')&& element.getAttribute('style').includes('background-image: url("blob:https://www.gaoding.com/')){
                                return true;
                            }
                        }
                    }).then((canvas) => {
                        let dataURL = canvas.toDataURL('image/png')
                        const el = document.createElement('a')
                        el.download = '图片.png'
                        el.href = dataURL
                        document.body.append(el)
                        el.click()
                        el.remove()
                    })
                }
            } catch (err) {
                console.log(err)
            }
        }

        function traverseAndRemove() {
            // 遍历当前元素的所有子节点
            /*element.childNodes.forEach(child => {
                // 只处理元素节点
                if (child.nodeType === Node.ELEMENT_NODE) {
                    // 检查当前元素的 style 属性是否包含特定背景图片的 URL
                    const style = child.getAttribute('style');
                    if (style && style.includes('background-image: url("blob:https://www.gaoding.com/')) {
                        // 如果符合条件，则删除这个元素
                        child.parentNode.removeChild(child);
                        console.log("删除水印")
                    } else {
                        // 递归调用，继续遍历这个子元素的子节点
                        traverseAndRemove(child);
                    }
                }
            });*/
            if (document.getElementsByClassName('editor-element-mask')[0]) {
                let cloneDom = document.getElementsByClassName('editor-element-mask')[0].cloneNode(true);
                document.getElementsByClassName('editor-element-mask')[0].remove();
                cloneDom.childNodes.forEach(child => {
                    if (child.nodeType === Node.ELEMENT_NODE && child.tagName === 'SPAN') {
                        child.remove();
                    }
                })
                let layout = document.getElementsByClassName('editor-layout')[0]
                layout.insertBefore(cloneDom, layout.children[1]);
            } else {
                /*console.log("Dom:",document.getElementsByClassName('editor-canvas')[0])
                let Dom = document.getElementsByClassName('editor-canvas')[0].cloneNode(true);
                console.log("cloned Dom:",Dom)
                document.getElementsByClassName('editor-canvas')[0].remove()
                let children = Dom.children;
                for (let i = 0; i < children.length; i++) {
                    let grandChildren = children[i].children;
                    for(let j = 0; j < grandChildren.length; j++) {
                        let styleAttr = grandChildren[i].getAttribute('style');
                        if (styleAttr && styleAttr.includes('background-image: url("blob:https://www.gaoding.com/')) {
                            grandChildren[i].remove();
                        }
                    }

                }
                console.log("Resolve Dom:",Dom)
                let shell = document.getElementsByClassName('editor-shell')[0]
                shell.insertBefore(Dom, shell.children[0]);*/
            }

            console.log('去水印成功！')
        }
        let css = `.mydiv1{
            position: absolute;
            z-index: 9999999999;
            left: 100px;
            top: 300px;
            display: none;
        }
        .mybtn1 {
            z-index: 9999999999;
            position: relative;
            left: 20px;
            margin-left: 20px;
            font-size: inherit;
            font-family: inherit;
            color: white;
            padding: 0.5em 1em;
            outline: none;
            border: none;
            background-color: hsl(236, 32%, 26%);
            overflow: hidden;
            transition: color 0.4s ease-in-out;
        }
        .mybtn2 {
            z-index: 9999999999;
            position: absolute;
            top: 700px;
            left: 10px;;
            font-size: inherit;
            font-family: inherit;
            color: white;
            padding: 0.5em 1em;
            outline: none;
            border: none;
            background-color: hsl(236, 32%, 26%);
            overflow: hidden;
            transition: color 0.4s ease-in-out;
        }

        .mybtn2::before,.mybtn1::before {
            content: '';
            z-index: -1;
            position: absolute;
            top: 100%;
            right: 100%;
            width: 1em;
            height: 1em;
            border-radius: 50%;
            background-color: #3cefff;
            transform-origin: center;
            transform: translate3d(50%, -50%, 0) scale3d(0, 0, 0);
            transition: transform 0.45s ease-in-out;
        }

        .mybtn2:hover,.mybtn1:hover {
            cursor: pointer;
            color: #161616;
        }

        .mybtn2:hover::before,.mybtn1:hover::before {
            transform: translate3d(50%, -50%, 0) scale3d(15, 15, 15);
        }`;
        GM_addStyle(css);
        function addTool() {
            const button = document.createElement('button')
            button.classList.add('mybtn2')
            button.innerText = '去水印下载'
            document.body.append(button)
            button.onclick = downloadImg
        }
        setTimeout(()=>{
            addTool()
        },5000)
    }
    // Your code here...
})();