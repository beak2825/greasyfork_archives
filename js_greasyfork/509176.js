// ==UserScript==
// @name         Kaili
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  下载数据
// @author       Hashan
// @match        https://lwlk.xjygj.gov.cn
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/509176/Kaili.user.js
// @updateURL https://update.greasyfork.org/scripts/509176/Kaili.meta.js
// ==/UserScript==

(function () {
    'use strict';
    window.onload = function () {
        let status = false  //状态
        let tableData = [];  // 初始化为数组


        //控制面板打开按钮
        function openControl() {
            var button = document.createElement("button"); //创建一个按钮
            var body = document.querySelector('body');
            button.textContent = "控制面板"; //按钮内容
            button.style.width = "90px"; //按钮宽度
            button.style.height = "28px"; //按钮高度
            button.style.align = "center"; //文本居中
            button.style.color = "white"; //按钮文字颜色
            button.style.background = "#e33e33"; //按钮底色
            button.style.border = "1px solid #e33e33"; //边框属性
            button.style.borderRadius = "4px"; //按钮四个角弧度

            button.style.position = "absolute";
            button.style.right = "10%";
            button.style.top = "10%";
            button.style.zIndex = "9999";

            body.appendChild(button)
            //监听按钮点击事件
            button.addEventListener("click", () => {
                const card = document.querySelector('#controllCard')
                card.style.display = card.style.display == 'none' ? 'block' : 'none'
            })

        }
        openControl()

        //创建item
        function crateItem(index) {
            const item = document.createElement('div')
            item.id = 'kl-item'
            item.style.width = '30px'
            item.style.height = '30px'
            item.style.background = '#1f5ac5'
            item.style.borderRadius = '8px'
            item.style.margin = '10px'
            item.style.lineHeight = '30px'
            item.style.color = '#fff'
            item.style.fontSize = '24px'
            item.textContent = index
            item.style.textAlign = 'center'

            const card = document.querySelector('#pageNum')
            card.appendChild(item)
        }
        //控制面板
        function crateControoller() {
            const body = document.querySelector('body')

            // 创建控制面板
            const controllCard = document.createElement('div')
            controllCard.id = 'controllCard'
            controllCard.style.display = 'none'
            controllCard.style.width = '400px'
            controllCard.style.height = '500px'
            controllCard.style.padding = '16px'
            controllCard.style.backgroundColor = 'white'
            controllCard.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)'
            controllCard.style.position = 'absolute'
            controllCard.style.top = '50%'
            controllCard.style.left = '50%'
            controllCard.style.transform = 'translate(-50%, -50%)'
            controllCard.style.borderRadius = '16px'
            controllCard.style.zIndex = '9999'

            //关闭按钮
            const close = document.createElement('button')
            close.innerText = 'X'
            close.style.width = '50px'
            close.style.height = '50px'
            close.style.marginTop = '10px'
            close.style.backgroundColor = 'red'
            close.style.color = '#fff'
            close.style.borderRadius = '8px'
            close.style.fontSize = '24px'

            close.addEventListener('click', () => {
                controllCard.style.display = 'none'
                status = false
                clearData()
            })

            //获取数据页面数量

            const controllCardPageNum = document.createElement('div')
            controllCardPageNum.style.width = '100%'



            const controllCardPageNumText = document.createElement('div')
            controllCardPageNumText.innerText = '已获取页面:'
            controllCardPageNumText.style.marginTop = '16px'
            controllCardPageNum.appendChild(controllCardPageNumText)

            const controllCardPageNumContant = document.createElement('div')
            controllCardPageNumContant.id = 'pageNum'
            controllCardPageNumContant.style.width = '100%'
            controllCardPageNumContant.style.height = '200px'
            controllCardPageNumContant.style.overflowY = 'scroll'
            controllCardPageNumContant.style.display = 'flex'
            controllCardPageNumContant.style.alignContent = 'flex-start'
            controllCardPageNumContant.style.flexWrap = 'wrap'
            controllCardPageNumContant.style.border = '1px solid #ccc'
            controllCardPageNum.appendChild(controllCardPageNumContant)

            // 停止 开始
            const start = document.createElement('button')
            start.id = 'start'
            start.innerText = '开始获取'
            start.style.width = '100%'
            start.style.height = '50px'
            start.style.marginTop = '40px'
            start.style.backgroundColor = 'green'
            start.style.color = '#fff'
            start.style.borderRadius = '8px'
            start.style.fontSize = '24px'
            start.style.cursor = 'pointer'

            start.onmouseover = function () {
                start.style.backgroundColor = 'red'
            }

            start.onmouseout = function () {
                start.style.backgroundColor = 'green'
            }


            //下载数据
            const download = document.createElement('button')
            download.id = 'download'
            download.innerText = '下载数据'
            download.style.width = '100%'
            download.style.height = '50px'
            download.style.marginTop = '40px'
            download.style.backgroundColor = 'green'
            download.style.color = '#fff'
            download.style.borderRadius = '8px'
            download.style.fontSize = '24px'
            download.style.cursor = 'pointer'
            download.onmouseover = function () {
                download.style.backgroundColor = 'red'
            }
            download.onmouseout = function () {
                download.style.backgroundColor = 'blue'
            }

            controllCard.appendChild(close)
            controllCard.appendChild(controllCardPageNum)
            controllCard.appendChild(start)
            controllCard.appendChild(download)

            body.appendChild(controllCard)
        }
        crateControoller()

        //获取数据
        function getData() {
            const table = document.querySelectorAll('table')[3].outerHTML;
            tableData.push(table);
        }

        //导出
        function exportData(table) {

            var blob = new Blob([table], { type: "text/plain;charset=utf-8" });     	//解决中文乱码问题
            blob = new Blob([String.fromCharCode(0xFEFF), blob], { type: blob.type });
            //设置链接
            var link = window.URL.createObjectURL(blob);
            var a = document.createElement("a");    //创建a标签
            a.download = "凯力巡检数据.xls";  //设置被下载的超链接目标（文件名）
            a.href = link;                            //设置a标签的链接
            document.body.appendChild(a);            //a标签添加到页面
            a.click();                                //设置a标签触发单击事件
            document.body.removeChild(a);
            clearData()

        }

        //清空数据
        function clearData() {
            const card = document.querySelector('#pageNum')
            card.innerHTML = ''
            tableData = []
        }

        //检查是否加载完成
        const check = (num) => {
            const ul = document.querySelectorAll('.el-pager')[0].children
            for (let index = 0; index < ul.length; index++) {
                const item = ul[index].innerText
                if (item == num) {
                    return ul[index]

                }
            }
        }

        //加载等待
        function calcLoad(index) {
            return new Promise((resolve, reject) => {
                const timer = setInterval(() => {
                    const item = check(index)
                    if (item.classList.contains('active')) {
                        clearTimeout(timer);
                        resolve(true)
                    } else {
                        item.click()
                    }
                }, 3000)
            })
        }


        //每页获取
        async function getTotalPage() {
            if (!status) {
                return
            }
            // 使用数组拼接
            const page = document.querySelectorAll('.el-pager')[0]
            const total = parseInt(page.children[page.children.length - 1].innerText)
            for (let index = 0; index < total; index++) {
                if (!status) {
                    break;
                }
                const isOk = await calcLoad(index + 1);
                console.log('等待是否选中', isOk);
                if (isOk) {
                    getData()
                    crateItem(index + 1)
                    console.log('脚本输出', status);
                    document.querySelector('.btn-next').click()
                }
            }
            if (status) {
                exportData(tableData.join(''))
                const startBtn = document.querySelector('#start')
                startBtn.click()
            } else {
                alert('数据获取完毕')
                return
            }


        }


        // 开始事件
        function start() {
            const startBtn = document.querySelector('#start')
            startBtn.onclick = function () {
                status = !status
                if (status) {
                    clearData()
                    startBtn.innerText = '停止获取'
                    getTotalPage()
                } else {
                    startBtn.innerText = '开始获取'
                }

            }

        }
        // 下载事件
        function download() {
            const downloadBtn = document.querySelector('#download')
            downloadBtn.onclick = function () {
                exportData(tableData.join(''))
            }
        }
        start()
        download()






    }
    // Your code here...
})();
