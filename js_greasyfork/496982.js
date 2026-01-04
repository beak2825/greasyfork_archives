// ==UserScript==
// @name         很遗憾已失效 暂停更新|刷课|重庆高等教育智慧教育平台|重庆智慧教育平台 cqooc.com www.cqooc.com
// @namespace    https://github.com/qinikat
// @version      0.4.3
// @description  重庆高教平台自动刷网课，不包含答题
// @author       ikat易卡
// @match        https://www.cqooc.com/*
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/496982/%E5%BE%88%E9%81%97%E6%86%BE%E5%B7%B2%E5%A4%B1%E6%95%88%20%E6%9A%82%E5%81%9C%E6%9B%B4%E6%96%B0%7C%E5%88%B7%E8%AF%BE%7C%E9%87%8D%E5%BA%86%E9%AB%98%E7%AD%89%E6%95%99%E8%82%B2%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%7C%E9%87%8D%E5%BA%86%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%20cqooccom%20wwwcqooccom.user.js
// @updateURL https://update.greasyfork.org/scripts/496982/%E5%BE%88%E9%81%97%E6%86%BE%E5%B7%B2%E5%A4%B1%E6%95%88%20%E6%9A%82%E5%81%9C%E6%9B%B4%E6%96%B0%7C%E5%88%B7%E8%AF%BE%7C%E9%87%8D%E5%BA%86%E9%AB%98%E7%AD%89%E6%95%99%E8%82%B2%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%7C%E9%87%8D%E5%BA%86%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%20cqooccom%20wwwcqooccom.meta.js
// ==/UserScript==

;(function () {
  ;('use strict')

  //加载开始按钮
  showStartBtn()

  function isCqooc() {
    //判断当前域名是否为https://www.cqooc.com/
    if (
      window.location.host == 'www.cqooc.com'
      //window.location.pathname == '/learn/mooc/structure'
    ) {
      //是则控制台输出成功信息
      console.log('cqooc自动刷课脚本加载成功')
      //返回true
      return true
    }
    //如果不是输出错误信息
    else {
      console.log('请在https://www.cqooc.com/下使用此脚本,并进入相应的课程')
      //弹出提示框
      alert('请在https://www.cqooc.com/下使用此脚本,并进入相应的课程')
      //跳转到https://www.cqooc.com/learn/mooc/structure
      //window.location.href = 'https://www.cqooc.com/my/learn'
      //返回false
      return false
    }
  }

  //刷课函数
  function AutoStudy() {
    //获取章节列表chapters-list
    let chaptersList = document.querySelector('ul.cont_list#chapters-list')
    //获取章节列表下的子元素，头部列表,使其展开
    if (chaptersList) {
      let chapterShead = chaptersList.querySelectorAll('li.item.one.close')
      chapterShead.forEach((item) => {
        item.click()
      })
    } else {
      return null
    }

    //获取章节列表的子元素，小节，并存入待学习列表
    //let regex = /item\s+ref_\d+\s+item\d+\s+two\s+(?!s8)\w+/
    let regex = /item\s+ref_\d+\s+item\d+\s+two\s+s(0|1|2|3|4|5)/
    let sections = document.querySelectorAll('li')
    let studyList = []

    sections.forEach((item) => {
      if (regex.test(item.className)) {
        studyList.push(item)
      }
    })

    //打印带学习小节总数
    console.log(studyList.length)

    // 循环学习操作
    async function study() {
      for (let i = 0; i < studyList.length; i++) {
        // 获取当前学习列表的索引
        let currentSection = studyList[i]
        console.log('Current section:', currentSection)
        currentSection.querySelector('a').click()
        // 等待页面加载完成
        await AwaitElementLoaded()
        await delay(2000)
        let slide_list = document.querySelector('ul.list')
        if (!slide_list) {
          console.log('slide_list not found')
          //抛出错误
          throw new Error('slide_list not found')
        }
        console.log(slide_list)
        //获取其全部的子元素li，并存入slides列表
        let slides = slide_list.querySelectorAll('li')
        if (!slides) {
          console.log('slides not found')
          //抛出错误
          throw new Error('slides not found')
        }
        console.log(slides)
        //用for遍历slides列表
        for (let j = 0; j < slides.length; j++) {
          let CurrentSlide = slides[j]
          console.log(CurrentSlide)
          //点击每个slide
          CurrentSlide.click()
          // 等待页面加载完成
          await AwaitElementLoaded()
          await delay(2000)
          if (CurrentSlide.className.includes('v2')) {
            //若包含v2，则为视频
            //获取计数器文本
            let countText = document.querySelector('#countText')
            if (!countText) {
              console.log('countText not found')
              //抛出错误
              throw new Error('countText not found')
            }
            //判断其下的是否有span元素，如果有则为已完成
            if (countText.querySelector('span')) {
              //视频已完成
              console.log('视频已完成')
              //进行下一次循环
              continue
            } else {
              //视频未完成
              console.log('视频未完成')
              //播放视频
              PlayVideo()
              //等待35秒，放映视频
              await delay(35000)
            }
          } else if (CurrentSlide.className.includes('v1')) {
            //若包含v1，则为课件
            //获取计数器文本
            let countText = document.querySelector('#countText')
            if (!countText) {
              console.log('countText not found')
              //抛出错误
              throw new Error('countText not found')
            }
            //判断其下的span元素是否为已完成
            if (countText.querySelector('span').innerText == '已完成') {
              //课件已完成
              console.log('课件已完成')
              //进行下一次循环
              continue
            } else {
              //课件未完成
              console.log('课件未完成')
              //等待35秒，放映课件
              await delay(35000)
            }
          } else {
            console.log('未知类型')
            await delay(3000)
            continue
          }
        }
      }
    }

    // 开始学习，从第一个小节开始
    study()

    function delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    }

    function PlayVideo() {
      // 获取播放按钮
      let playIconDiv = document.querySelector('div.xgplayer-icon-play')

      if (playIconDiv) {
        // 获取 div 元素下的第一个 svg 子元素
        let svgElement = playIconDiv.querySelector('svg')

        // 添加点击事件监听器
        svgElement.addEventListener('click', function () {
          console.log('SVG element clicked!')
        })

        function simulateClick(target) {
          // 创建一个鼠标点击事件
          let event = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
          })
          // 派发事件
          target.dispatchEvent(event)
        }

        // 模拟点击 SVG 元素
        simulateClick(svgElement)
      } else {
        console.error('Element with class xgplayer-icon-play not found!')
      }
    }

    //判断资源是否加载完成函数
    function AwaitElementLoaded(timeout = 60000, interval = 1000) {
      return new Promise((resolve, reject) => {
        let elapsedTime = 0

        const checkElementLoaded = async () => {
          //获取视频或者课件
          let video = document.querySelector('#videoPlayer')
          let courseware = document.querySelector('div.MPreview-box')

          //判断两者存在一个
          if (video || courseware) {
            resolve(true)
          } else {
            elapsedTime += interval

            if (elapsedTime >= timeout) {
              reject(new Error('Resource loading timed out'))
            } else {
              await delay(interval)
              checkElementLoaded()
            }
          }
        }

        checkElementLoaded()
      })
    }
  }

  //显示标本启动按钮
  function showStartBtn() {
    let startBtn = document.createElement('button')
    startBtn.style.position = 'fixed'
    startBtn.style.top = '420px'
    startBtn.style.left = '50px'
    startBtn.style.zIndex = '9999'
    startBtn.style.width = '200px' // 调整按钮宽度以适应背景图片
    startBtn.style.height = '100px' // 调整按钮高度以适应背景图片
    startBtn.style.backgroundImage =
      'url(https://avatars.githubusercontent.com/u/132556483?v=4)'
    startBtn.style.backgroundSize = 'cover' // 确保背景图片覆盖整个按钮
    startBtn.style.backgroundPosition = 'center' // 居中背景图片
    startBtn.style.color = 'white'
    startBtn.style.border = 'none'
    startBtn.style.borderRadius = '5px'
    startBtn.style.fontSize = '16px'
    startBtn.style.cursor = 'pointer'
    startBtn.style.outline = 'none'
    startBtn.style.padding = '10px' // 添加内边距以使文本不紧贴边缘
    startBtn.style.textShadow = '1px 1px 2px black' // 添加文本阴影以增强对比度
    startBtn.style.display = 'flex' // 使用 flex 布局
    startBtn.style.flexDirection = 'column' // 垂直排列
    startBtn.style.justifyContent = 'center' // 垂直居中
    startBtn.style.alignItems = 'center' // 水平居中

    // 添加主按钮文本
    let mainText = document.createElement('div')
    mainText.innerText = '由于网站系统更新，脚本已失效'
    mainText.style.marginTop = '20px' // 调整主按钮文本的 margin
    startBtn.appendChild(mainText)

    // 添加作者信息
    let authorText = document.createElement('span')
    authorText.innerText = 'by.ikat易卡'
    authorText.style.fontSize = '12px' // 设置小字体
    authorText.style.marginTop = '12px' // 调整作者信息的 margin
    startBtn.appendChild(authorText)

    startBtn.addEventListener('click', () => {
      //判断网站地址是否正确
      if (!isCqooc()) {
        return
      }
      // 开始学习
      AutoStudy()
    })

    document.body.appendChild(startBtn)
  }
})()
