// ==UserScript==
// @name         1688主图、款式图、详情图一键下载
// @namespace    https://detail.1688.com/
// @version      0.1
// @description  1688主图、款式图、详情图一键下载!
// @author       Cucumber
// @match        https://detail.1688.com/*
// @icon         data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNDQgNDQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZGF0YS1uYW1lPSLlm77lsYIgMiI+PGcgZGF0YS1uYW1lPSLlm77lsYIgMSI+PHBhdGggZD0iTTMwLjg3IDI4LjQyYS44NS44NSAwIDAgMC0uODEtLjcxaC0zLjUzYTEuNTQgMS41NCAwIDAgMS0uNTguMWgtMS4yM2EuODIuODIgMCAwIDAtLjQ0LjczdjQuOTNhLjg0Ljg0IDAgMCAwIC43OC44NWg1YS44NC44NCAwIDAgMCAuODMtLjg1di01ek0yOCAzMi4yNmwtMS42OCAxLS4xLTEuODR6IiBmaWxsPSIjN2RlYWU3Ii8+PHBhdGggZD0iTTI3LjYyIDkuMTJIMTMuMDdhMy43OSAzLjc5IDAgMCAwLTMuNzkgMy43OXYxNS4zN2E2LjU5IDYuNTkgMCAwIDAgNi42IDYuNmg1Ljg2YTkuODYgOS44NiAwIDAgMCAzLjMyLS41OCA5Ljc3IDkuNzcgMCAwIDAgNS43OC01Ljg4IDkuNjcgOS42NyAwIDAgMCAuNTQtMy4xOVYxMi45MWEzLjc5IDMuNzkgMCAwIDAtMy43Ni0zLjc5em0tMTUuMTUgNWgxNS42NWEuOS45IDAgMSAxIDAgMS43OUgxMi40N2EuOS45IDAgMCAxIDAtMS43OXptMCA1LjEzaDkuMTlhLjg5Ljg5IDAgMSAxIDAgMS43OGgtOS4xOWEuODkuODkgMCAxIDEgMC0xLjc4em0uOSA4LjVhMS43OCAxLjc4IDAgMCAxLTEuMjYtLjUyIDEuNzYgMS43NiAwIDAgMS0uNTMtMS4yMyAxLjc5IDEuNzkgMCAwIDEgMS43OS0xLjc5SDI2QTEuNzggMS43OCAwIDAgMSAyNy43NCAyNmExLjc2IDEuNzYgMCAwIDEtMS4yMSAxLjY5IDEuNTQgMS41NCAwIDAgMS0uNTguMXptMTMgNS41MS0uMS0xLjg0IDEuNzguOHoiIGZpbGw9IiM2ZWNlY2MiLz48cGF0aCBkPSJNMjkgMTUuMDVhLjkuOSAwIDAgMS0uOS45SDEyLjQ3YS45LjkgMCAwIDEgMC0xLjc5aDE1LjY1YS45LjkgMCAwIDEgLjg4Ljg5ek0yMi41NSAyMC4xOGEuODkuODkgMCAwIDEtLjg5Ljg5aC05LjE5YS44OS44OSAwIDEgMSAwLTEuNzhoOS4xOWEuODkuODkgMCAwIDEgLjg5Ljg5ek0yNy43NCAyNmExLjc2IDEuNzYgMCAwIDEtMS4yMSAxLjY5IDEuNTQgMS41NCAwIDAgMS0uNTguMUgxMy4zN2ExLjc4IDEuNzggMCAwIDEtMS4yNi0uNTIgMS43NiAxLjc2IDAgMCAxLS41My0xLjI3IDEuNzkgMS43OSAwIDAgMSAxLjc5LTEuNzlIMjZBMS43OCAxLjc4IDAgMCAxIDI3Ljc0IDI2eiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Im0zNC42NSAxNy40Ny0zLjI0IDcuMjItMS4zNSAzLTIgNC41Ny0xLjc4LS44IDEuNjktMy43NyAzLjQ5LTcuNzYgMS40Ni0zLjI1YTEgMSAwIDEgMSAxLjc4Ljc5eiIgZmlsbD0iIzcwZTBkYiIvPjxwYXRoIGZpbGw9Im5vbmUiIGQ9Im0yOC4wMSAzMi4yNi0xLjY4IDEuMDQtLjEtMS44NCAxLjc4Ljh6Ii8+PGNpcmNsZSByPSIyMiIgY3k9IjIyIiBjeD0iMjIiIGZpbGw9Im5vbmUiLz48L2c+PC9nPjwvc3ZnPg==
// @grant        GM_download
// @grant        GM_addStyle
// @license      none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/435721/1688%E4%B8%BB%E5%9B%BE%E3%80%81%E6%AC%BE%E5%BC%8F%E5%9B%BE%E3%80%81%E8%AF%A6%E6%83%85%E5%9B%BE%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/435721/1688%E4%B8%BB%E5%9B%BE%E3%80%81%E6%AC%BE%E5%BC%8F%E5%9B%BE%E3%80%81%E8%AF%A6%E6%83%85%E5%9B%BE%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
//目前常用grant（授予）GM_addStyle设置样式  GM_download（url,文件名）下载文件
(function() {
    'use strict';
    $(()=>{
        //设置制作按钮
        $('body').append("<ul id='downBt'><li  class='bt xqt'>下载详情图</li><li  class='bt zt'>下载主图</li><li  class='bt kst'>下载款式图</li></ul>")
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
        console.log('赋予样式成功')
        alert('提示：如需下载图片，则需下滑页面确保您需要的图片都加载完毕后点击左边下载按钮进行下载！')

        //详情页
        $('.xqt').click(function(){
            //图片下载正则
            var reg=/https:.*jpg|png/i;
            //点击执行
            console.log('下载详情页')
            var xqyImages=document.querySelectorAll("p img")
            xqyImages.forEach(function(item,index){
                GM_download(item.src,`详情页${index}`)
            })
        })
        //主图
        $('.zt').click(function(){
            //点击执行
            console.log('下载主图')
            var ztImages=document.querySelectorAll(".detail-gallery-img")
            ztImages.forEach(function(item,index){
                    GM_download(item.src,`主图${index}`)
                    });
            //第二种情况
            var ztImages2=document.querySelectorAll(".tab-trigger")
             ztImages2.forEach(function(item,index){
                     GM_download(reg.exec(item.attributes[1].nodeValue)[0],`主图${index}`)
                     });

        })
        //款式图
        $('.kst').click(function(){
            //正则
            var reg1=/.\d{2}[x]\d{2}/i;
            //第二三种情况下的图片下载正则
            var reg23=/https:\/\/.*jpg/i;
            //点击执行
            console.log('下载款式图')
           var kstImages1=document.querySelectorAll('.obj-content .box-img img')

            //第二种情况
            var kstImages2=document.querySelectorAll(".sku-item-image")

            //第三种情况
            var kstImages3=document.querySelectorAll('.prop-img')

            if(kstImages1.length){
                  kstImages1.forEach(function(item,index){
                GM_download(item.src.replace(reg1,''),item.alt)
            })
            }else if(kstImages2.length){
                            kstImages2.forEach(function(item,index){
                           console.log(index)
                GM_download(reg23.exec(item.style.backgroundImage)[0],item.nextElementSibling.children[0].innerText)
            })
            }else{
             kstImages3.forEach(function(item,index){
                console.log(item)
                GM_download(reg23.exec(item.style.backgroundImage)[0],item.nextElementSibling.innerText)
            })
            }

        })

      })

})();