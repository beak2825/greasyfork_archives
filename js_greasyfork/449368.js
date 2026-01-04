// ==UserScript==
// @name         dy
// @namespace    http://tampermonkey.net/
// @version      0.2.8
// @description  抖音网页视频链接下载!
// @author       jk小帅
// @match        https://www.douyin.com/*
// @grant        none
// @license GPL
// @downloadURL https://update.greasyfork.org/scripts/449368/dy.user.js
// @updateURL https://update.greasyfork.org/scripts/449368/dy.meta.js
// ==/UserScript==

// 如果失败可以先点赞在点赞页面下载
/*
已测试支持的界面
+ 关注
+ 推荐
+ 搜索
+ 喜欢
+ 视频主个人主页
*/

// 抖音视频下载
(function () {
  "use strict";

  const button1 = document.createElement('button')
  button1.setAttribute('id', 'dy0')
  button1.setAttribute('style', 'cursor: pointer;padding:0.3rem 0.5rem;background-color:#161722;color:#ffff;outline:none;position: fixed;left:2rem;bottom:9.5rem;z-index:99999')
  button1.innerText = '视频下载'

  const button2 = document.createElement('button')
  button2.setAttribute('id', 'dy1')
  button2.setAttribute('style', 'cursor: pointer;padding:0.3rem 0.5rem;background-color:#161722;color:#ffff;outline:none;position: fixed;left:2rem;bottom:6rem;z-index:99999')
  button2.innerText = '图片下载\n(需开启弹出式权限)'

  window.onload = () => {

    const body = document.querySelector('body')
    body.appendChild(button1)
    body.appendChild(button2)

    const dy0 = document.querySelector("#dy0")
    const dy1 = document.querySelector('#dy1')

    dy0.addEventListener('click', function () {
      const videos = document.querySelectorAll('video')
      const len = videos.length
      let video;
      switch (len) {
        case 1: {
          video = videos[0];
          break;
        }
        case 2: {
          video = videos[0];
          break;
        }
        case 3: {
          video = videos[1];
          break;
        }
        case 4: {
          video = videos[3]
          break;
        }
      }
      let src = video.firstChild.src;
      if (!src) {
        alert('获取url地址失败')
      } else {
        video.pause();
        const date = new Date()
        let filename = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}`
        fetch(src)
          .then(res => res.blob())
          .then(blob => {
            const a = document.createElement("a");
            const objectUrl = window.URL.createObjectURL(blob);
            a.download = filename;
            a.href = objectUrl;
            a.click();
            window.URL.revokeObjectURL(objectUrl);
            a.remove();
          })
      }
    })


    dy1.addEventListener('click', function () {
      const videos = document.querySelectorAll('video')
      const len = videos.length
      let video;
      let index = 1
      switch (len) {
        case 1: {
          video = videos[0];
          index = 0
          break;
        }
        case 2: {
          video = videos[0];
          index = 0
          break;
        }
        case 3: {
          video = videos[1];
          index = 1
          break;
        }
        case 4: {
          video = videos[3]
          index = 3
          break;
        }
      }
      video.pause()
      let imgs;
      if (location.href.indexOf("user") !== -1) {
        imgs = document.querySelectorAll('.dySwiperSlide img')
      } else {
        try {
          imgs = document.querySelectorAll(".playerContainer .focusPanel")
          switch (imgs.length) {
            case 1: {
              imgs = imgs[0].getElementsByTagName('img')
              break;
            }
            case 2: {
              imgs = imgs[1].getElementsByTagName('img')
              break;
            }
            default:
              imgs = imgs = video.parentElement.parentElement.getElementsByTagName('img')
              break;
          }
        } catch {
          alert('没有图片')
          return;
        }
      }
      let set = new Set()
      imgs = Array.from(imgs)
      imgs.forEach((item) => {
        set.add(item.src)
      })
      // console.log(set);
      if (set.size === 0) {
        alert("获取图片失败")
        return;
      } else {
        set.forEach((img) => {
          window.open(img)
        })
      }
    })
  }
})()