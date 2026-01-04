// ==UserScript==
// @name         Grab Lecture in SZU
// @name:cn      深圳大学抢领航讲座脚本
// @namespace    http://tampermonkey.net/
// @version      0.7.4
// @description  【使用前先看介绍/有问题可反馈】深圳大学抢领航讲座脚本 (Grab Lecture in SZU)：可用于在深圳大学抢领航讲座。
// @author       cc
// @match        http://lecture.szu.edu.cn/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.js
// @require      https://greasyfork.org/scripts/422854-bubble-message.js
// @noframes
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/417400/Grab%20Lecture%20in%20SZU.user.js
// @updateURL https://update.greasyfork.org/scripts/417400/Grab%20Lecture%20in%20SZU.meta.js
// ==/UserScript==

(function() {
  'use strict'
  let config = null
  let bm = new BubbleMessage()
  bm.config.cmap.info = '#009688'
  bm.config.width = 300
  function getStartTime () {
    let now = new Date()
    let year = now.getFullYear()
    let month = now.getMonth() + 1
    let day = now.getDate()
    let startTime = new Date(`${year}-${month}-${day} 12:30:00`)
    return startTime.getTime()
  }
  function rushLecture () {
    $.ajax({
      url: 'http://lecture.szu.edu.cn/tLectureSignUp/list?page=1&limit=10',
      type: 'GET',
    }).then(res => {
      if (res.code === 0) {
        let availableLectures = res.data.filter(lecture => Date.now() < new Date(lecture.lectureEndTime))
        Promise.all(availableLectures.map(lecture => {
          return $.ajax({
            url: `http://lecture.szu.edu.cn/lectureClassroomSignUp/list?page=1&limit=20&lectureId=${lecture.id}`,
            type: 'GET',
          }).then(res => {
            return res.code === 0 ? res.data.filter(room => room.remainSeats > 0) : []
          })
        })).then(res => {
          let availableRooms = []
          res.forEach(rooms => availableRooms = availableRooms.concat(rooms))
          availableRooms = availableRooms.filter(room => config.campus.indexOf(room.campus) >= 0)
          if (availableRooms.length === 0) {
            bm.message({
              type: 'warning',
              message: '无可抢讲座',
              duration: 1500,
            })
          } else {
            Promise.all(availableRooms.map(room => {
              return $.ajax({
                url: `http://lecture.szu.edu.cn/tSelectLecture/addItem?lectureClassroomId=${room.id}&lectureId=${room.lectureId}&classroomId=${room.classroomId}`,
                type: 'POST',
              }).then(res => {
                return res
              })
            })).then(res => {
              bm.message({
                type: 'info',
                message: '抢领航讲座已完成，请刷新页面查看结果',
                duration: 3000,
              })
              console.info(res)
            })
          }
        })
      } else {
        bm.message({
          type: 'error',
          message: '请求失败',
          duration: 3000,
        })
      }
    })
  }
  function setSelect () {
    let div = document.createElement('div')
    div.style = 'display: inline-flex; height: 100%; align-items: center; margin-left: 10px;'
    let select = document.createElement('select')
    select.name = 'campus'
    let optionYHCH = document.createElement('option')
    optionYHCH.value = '粤海校区/沧海校区'
    optionYHCH.innerHTML = optionYHCH.value
    let optionLH = document.createElement('option')
    optionLH.value = '丽湖校区'
    optionLH.innerHTML = optionLH.value
    select.appendChild(optionYHCH)
    select.appendChild(optionLH)
    select.addEventListener('change', function (event) {
      config.campusIndex = event.target.selectedIndex
      config.campus = event.target.value.split('/')
      GM_setValue('config', config)
    })
    div.appendChild(select)
    let nextItem = document.querySelector('.layui-nav.layui-layout-right')
    nextItem.parentNode.insertBefore(div, nextItem)
  }
  function loadConfig () {
    let select = document.querySelector('select[name=campus]')
    config = GM_getValue('config')
    if (!config) {
      config = {
        campus: select.options[select.selectedIndex].value.split('/'),
        campusIndex: select.selectedIndex,
      }
      GM_setValue('config', config)
    } else {
      select.selectedIndex = config.campusIndex
    }
  }
  window.onload = function () {
    setSelect()
    loadConfig()
    let currentTime = Date.now()
    let startTime = getStartTime()
    if (currentTime < startTime) {
      let deltaTime = startTime - currentTime
      bm.message({
        type: 'info',
        message: `准备于 ${parseInt(deltaTime / 1000)} 秒后开抢`,
        duration: 3000,
      })
      setTimeout(rushLecture, deltaTime)
    } else {
      bm.message({
        type: 'info',
        message: `已经过了抢课时间`,
        duration: 3000,
      })
    }
  }
})()
