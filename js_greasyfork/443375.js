// ==UserScript==
// @name         太翼 自动播放 学习视频
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动学习(看过了,等于我会了)
// @author       You
// @match        https://*.coolcollege.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443375/%E5%A4%AA%E7%BF%BC%20%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%20%E5%AD%A6%E4%B9%A0%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/443375/%E5%A4%AA%E7%BF%BC%20%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%20%E5%AD%A6%E4%B9%A0%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

/**
 * 全自动自动播放
 * 自动跳过暂停
 * 自动下一集播放
 * 自动倍速 7 倍(max:7)
 * 自动静音播放
 */
let Doclist = []
// 请求list
const getList = () => {
  const token = localStorage.getItem("token")
  const url =
    `https://grcoolapi.coolcollege.cn/enterprise-api/course/queryCourseByPage_fast?pageNumber=2&pageSize=400&timestamp=1649987397000&classifyId=&queryType=&title=&statusType=all&liveStatus=all&sortType=all&classifyType=all&order=desc&image_text=all&userIds=&liveCourseStatus=true&access_token=${token}`
  const filt = (item) => {
    const { show_score, id, award_score } = item
    if (award_score !== 0) {
      Doclist.push({
        id,
      })
    }
  }

  fetch(url)
    .then((response) => response.json())
    .then((json) => {
      json.list.map((v) => filt(v))
      console.log(Doclist)
      setTimeout(play, 100)
    })
    .catch((err) => console.log("Request Failed", err))
}
let ppt = 1000
let FunT = 1000
let length = 1
const play = () => {
  Fun()
  const v = document.querySelector("video")
  v.removeEventListener("ended", play)
  v.removeEventListener("timeupausepdate", Fun)
  v.muted = true
  v.playbackRate = 7
  v.addEventListener("pause", Fun)
  v.addEventListener("ended", ended)
}
const Fun = () => {
  let bu = document.querySelector(".ant-modal-footer button")
  if (bu) {
    bu.click()
    FunT = 1000
    setTimeout(play, 2000)
    setTimeout(() => {
      const v = document.querySelector("video")
      v.muted = true
      v.playbackRate = 7
    }, 3000)
  } else {
    FunT += 1000
    setTimeout(Fun, FunT)
  }
}
const ended = () => {
  const list = document.querySelectorAll(
    ".new-watch-course-page__right__catalog .new-watch-course-page__right__catalog__item "
  )

  let a = +localStorage.getItem("length") || 1
  console.log(Doclist[a].id)
  if (list.length == 1) {
    // 跳转路由
    go(Doclist[a].id)
    return
  }
  list.forEach((element, i) => {
    if (element.className.includes("active")) {
        let  idx = ++i
        if (list[idx]) {
          list[idx].click()
          setTimeout(Fun(), 1000)
        } else {
          go(Doclist[a].id, a)
        }
    }
  })
}

// 跳转路由
function go(id, index) {
  //https://pro.coolcollege.cn/?eid=1442034752822579263#/course/enterpriseCourse?courseId=1833859677096644608&taskId=
  const url = `https://pro.coolcollege.cn/?eid=1442034752822579263#/course/enterpriseCourse?courseId=${id}&taskId=`
  window.location.href = url
  setTimeout(() => {
    document
      .querySelector(
        ".course-ware-list__item__info .course-ware-list__item__title-box"
      )
      .click()
    setTimeout(play, 500)
    localStorage.setItem("length", ++index)
    localStorage.setItem("url", true)
  }, 1000)
}

const init = () => {
  getList()
}
init()
