// ==UserScript==
// @name         趣味盒图片加载优化
// @namespace    http://tampermonkey.net/
// @version      2025-08-28
// @description  趣味盒图片按顺序加载，加载完一张再加载下一站，避免同时加载导致带宽不够会让很多照片超时失败
// @author       fenglbl
// @match        https://www.nicept.net/fun.php?action=view
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nicept.net
// @grant        none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/546734/%E8%B6%A3%E5%91%B3%E7%9B%92%E5%9B%BE%E7%89%87%E5%8A%A0%E8%BD%BD%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/546734/%E8%B6%A3%E5%91%B3%E7%9B%92%E5%9B%BE%E7%89%87%E5%8A%A0%E8%BD%BD%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let pageWidth = window.innerWidth
    // 图片的宽度，默认页面宽度-40像素
    let imgWidth = (pageWidth - 40);

    //
    let imgList = []
    let imgNodes = document.querySelectorAll('.shoutrow .faqlink img')
    if(!imgNodes.length){
      imgNodes = document.querySelectorAll('.shoutrow img')
    }
    imgNodes.forEach(item=>{
        if(!item.className.includes("nexus-username-medal")){
            imgList.push(item.src)
        }
    })
    // 图片按顺序加载
    let div = document.createElement('div')
    let imgIndex = 0
    let errorNum = 0
    let numtextbox = document.createElement('div')
    numtextbox.style = `
  position: fixed;
  top: 20px;
  left: 46%;
  background-color: rgba(255, 255, 255, 0.4);
  padding: 8px;
  border-radius: 12px;
  font-size: 16px;
`
    div.appendChild(numtextbox)

    function setTotal(all,i,load,err){
        numtextbox.innerHTML = `总共${all}张，正在加载第${i}张，已加载${load}张，失败${err}张`
    }


    setTotal(imgList.length,imgIndex+1,imgIndex,errorNum)

    function loadImg(imgs,img){
        let imgNode = document.createElement('img')
        imgNode.onload = function(){
            if(imgIndex < imgs.length - 1){
                imgIndex++
                setTotal(imgList.length,imgIndex+1,imgIndex,errorNum)
                loadImg(imgs,imgs[imgIndex])
            }
        }
        imgNode.onerror = function(){
            console.log('图片加载失败');
            // imgNode.src = null
            // imgNode.src = img
            if(imgIndex < imgs.length - 1){
                imgIndex++
                errorNum++
                setTotal(imgList.length,imgIndex+1,imgIndex,errorNum)
                loadImg(imgs,imgs[imgIndex])
            }
        }
        imgNode.style.width = imgWidth + 'px'
        imgNode.id = 'img_' + imgIndex
        imgNode.src = img
        div.appendChild(imgNode)
    }
    document.body.innerHTML = ''
    document.body.appendChild(div)

    loadImg(imgList,imgList[imgIndex])

})();