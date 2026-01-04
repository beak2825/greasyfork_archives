// ==UserScript==
// @name         storyset网站插画矢量图提取svg提取
// @namespace    https://storyset.com/
// @version      0.1
// @description  storyset.com网站插画矢量图提取svg提取直接使用
// @author       Cucumber
// @match        https://storyset.com/*
// @icon         data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNDQgNDQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZGF0YS1uYW1lPSLlm77lsYIgMiI+PGcgZGF0YS1uYW1lPSLlm77lsYIgMSI+PHBhdGggZD0iTTMwLjg3IDI4LjQyYS44NS44NSAwIDAgMC0uODEtLjcxaC0zLjUzYTEuNTQgMS41NCAwIDAgMS0uNTguMWgtMS4yM2EuODIuODIgMCAwIDAtLjQ0LjczdjQuOTNhLjg0Ljg0IDAgMCAwIC43OC44NWg1YS44NC44NCAwIDAgMCAuODMtLjg1di01ek0yOCAzMi4yNmwtMS42OCAxLS4xLTEuODR6IiBmaWxsPSIjN2RlYWU3Ii8+PHBhdGggZD0iTTI3LjYyIDkuMTJIMTMuMDdhMy43OSAzLjc5IDAgMCAwLTMuNzkgMy43OXYxNS4zN2E2LjU5IDYuNTkgMCAwIDAgNi42IDYuNmg1Ljg2YTkuODYgOS44NiAwIDAgMCAzLjMyLS41OCA5Ljc3IDkuNzcgMCAwIDAgNS43OC01Ljg4IDkuNjcgOS42NyAwIDAgMCAuNTQtMy4xOVYxMi45MWEzLjc5IDMuNzkgMCAwIDAtMy43Ni0zLjc5em0tMTUuMTUgNWgxNS42NWEuOS45IDAgMSAxIDAgMS43OUgxMi40N2EuOS45IDAgMCAxIDAtMS43OXptMCA1LjEzaDkuMTlhLjg5Ljg5IDAgMSAxIDAgMS43OGgtOS4xOWEuODkuODkgMCAxIDEgMC0xLjc4em0uOSA4LjVhMS43OCAxLjc4IDAgMCAxLTEuMjYtLjUyIDEuNzYgMS43NiAwIDAgMS0uNTMtMS4yMyAxLjc5IDEuNzkgMCAwIDEgMS43OS0xLjc5SDI2QTEuNzggMS43OCAwIDAgMSAyNy43NCAyNmExLjc2IDEuNzYgMCAwIDEtMS4yMSAxLjY5IDEuNTQgMS41NCAwIDAgMS0uNTguMXptMTMgNS41MS0uMS0xLjg0IDEuNzguOHoiIGZpbGw9IiM2ZWNlY2MiLz48cGF0aCBkPSJNMjkgMTUuMDVhLjkuOSAwIDAgMS0uOS45SDEyLjQ3YS45LjkgMCAwIDEgMC0xLjc5aDE1LjY1YS45LjkgMCAwIDEgLjg4Ljg5ek0yMi41NSAyMC4xOGEuODkuODkgMCAwIDEtLjg5Ljg5aC05LjE5YS44OS44OSAwIDEgMSAwLTEuNzhoOS4xOWEuODkuODkgMCAwIDEgLjg5Ljg5ek0yNy43NCAyNmExLjc2IDEuNzYgMCAwIDEtMS4yMSAxLjY5IDEuNTQgMS41NCAwIDAgMS0uNTguMUgxMy4zN2ExLjc4IDEuNzggMCAwIDEtMS4yNi0uNTIgMS43NiAxLjc2IDAgMCAxLS41My0xLjI3IDEuNzkgMS43OSAwIDAgMSAxLjc5LTEuNzlIMjZBMS43OCAxLjc4IDAgMCAxIDI3Ljc0IDI2eiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Im0zNC42NSAxNy40Ny0zLjI0IDcuMjItMS4zNSAzLTIgNC41Ny0xLjc4LS44IDEuNjktMy43NyAzLjQ5LTcuNzYgMS40Ni0zLjI1YTEgMSAwIDEgMSAxLjc4Ljc5eiIgZmlsbD0iIzcwZTBkYiIvPjxwYXRoIGZpbGw9Im5vbmUiIGQ9Im0yOC4wMSAzMi4yNi0xLjY4IDEuMDQtLjEtMS44NCAxLjc4Ljh6Ii8+PGNpcmNsZSByPSIyMiIgY3k9IjIyIiBjeD0iMjIiIGZpbGw9Im5vbmUiLz48L2c+PC9nPjwvc3ZnPg==
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @license      none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/435793/storyset%E7%BD%91%E7%AB%99%E6%8F%92%E7%94%BB%E7%9F%A2%E9%87%8F%E5%9B%BE%E6%8F%90%E5%8F%96svg%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/435793/storyset%E7%BD%91%E7%AB%99%E6%8F%92%E7%94%BB%E7%9F%A2%E9%87%8F%E5%9B%BE%E6%8F%90%E5%8F%96svg%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==
//目前常用grant（授予）GM_addStyle设置样式  GM_download（url,文件名）下载文件 GM_setClipborad(data, info)复制信息
(function() {
            'use strict';
    alert('当没有出现copy按钮时，请点击左方刷新更新按钮')
            $('body').append("<ul id='downBt'><li  class='bt gx'>刷新更新</li></ul>")
        let css=`#downBt{
				position:fixed;
				top:100px;
				left:25px;
                z-index: 999;
                cursor: pointer;
			}
			.bt{
				width: 100px;
				border-radius: 10px;
				background-color: #4E6EF2;
				color: white;
				font-size: 10px;
				text-align: center;
				line-height: 20px;
				box-shadow: #00007f 2px 2px 3px;
				margin-bottom: 10px;
			}`
        GM_addStyle(css)
                        function listenitem(){
                     var svgboxs=document.querySelectorAll('.svg-container')
                    if(svgboxs.length>0){
                        svgboxs.forEach(function(item,index){
                                var btn=document.createElement('button')
                                btn.setAttribute('class','btnclass')
                                btn.style.cssText='width:50px;height:50px;border-radius: 100%;background-color: blue;color: white'
                                btn.innerText='copy'
                            item.append(btn)
                            item.lastChild.addEventListener('click',(e)=>{
                                e.preventDefault()
                                e.stopPropagation()
                                GM_setClipboard(item.firstChild.innerHTML)
                            })
                        })
                    }
            }
    $('.gx').click(()=>{
        document.querySelectorAll(".btnclass").forEach(function(item,index){item.remove()})
        listenitem()


    })






    // Your code here...
})();