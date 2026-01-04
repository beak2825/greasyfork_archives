// ==UserScript==
// @name        英才邦自动下一节课
// @namespace   英才邦自动下一节课
// @match       *://www.yingcaibang.cn/user-web/centerVideo*
// @grant       none
// @version     1.4
// @author      fbz
// @license     MIT
// @description 2023/3/9 16:08:12
// @downloadURL https://update.greasyfork.org/scripts/461512/%E8%8B%B1%E6%89%8D%E9%82%A6%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E8%8A%82%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/461512/%E8%8B%B1%E6%89%8D%E9%82%A6%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E8%8A%82%E8%AF%BE.meta.js
// ==/UserScript==
;(function(){
  const timeout = 1000 * 5 // 5秒点一次

  const css = `
    #auto_course_btn {
      position: fixed;
      left: 0;
      bottom: 64px;
      background: #1d1e20;
      border-radius: 50%;
      height: 32px;
      width: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: 14px;
      border: 2px solid white;
      z-index: 2000;
      color: white;
      cursor: pointer;
    }
    .el-loading-mask{
      display: none !important;
    }
  `
  /*添加样式*/
  function addStyle(css) {
    if (!css) return
    var head = document.querySelector('head')
    var style = document.createElement('style')
    style.type = 'text/css'
    style.innerHTML = css
    head.appendChild(style)
  }

  /*生成开关按钮*/
  function createBtn() {
    var btn = document.createElement('div')
    btn.title = '开'
    var span = document.createElement('span')
    span.innerText = '开'
    btn.appendChild(span)
    btn.id = 'auto_course_btn'
    document.body.appendChild(btn)

    /*初始化事件*/
    // 点击按钮启动定时器
    btn.addEventListener('click', function () {
      toggleBtnStatus()
      toggleBtnText()
    })
  }

  function clickButton(){
    // 点击开关按钮
    document.querySelector('#auto_course_btn').click()
  }

  // 切换文字
  function toggleBtnText(val = '') {
    const node = document.querySelector('#auto_course_btn')
    const text = node.innerText
    node.innerText = val ? val : text === '开' ? '关' : '开'
  }

  let buildingInterval = null

  // 开启定时器
  function handleAutoUpdateStart() {
    buildingInterval = setInterval(switchNextCourse, timeout)
  }
  // 清除定时器
  function handleAutoUpdateClear() {
    buildingInterval = clearInterval(buildingInterval)
  }
  // 切换定时器状态
  function toggleBtnStatus() {
    if (buildingInterval) {
      console.log('~~~~关闭定时器~~~~')
      handleAutoUpdateClear()
    } else {
      console.log('~~~~开启定时器~~~~')
      handleAutoUpdateStart()
    }
  }

  let topics = document.querySelectorAll('.topic')

  const switchNextCourse = () => {
    topics = document.querySelectorAll('.topic')
    if(topics.length === 0){
      console.log('~~没找到右侧课程列表~~')
      clickButton()
      return
    }
    for(const [i,topic] of topics.entries()){
      if(topic.querySelector('.onplay') && topic.querySelector('.finished')){
        console.log(`《${topic.querySelector('.courseName').innerText}》已学完~`)
        const nextCourse = topics[i + 1]
        nextCourse && nextCourse.click() // 继续学习下一节
        !nextCourse && nextCourse() // 已学习到最后一节
        break
      }
    }
  }

  addStyle(css)
  createBtn()
})()