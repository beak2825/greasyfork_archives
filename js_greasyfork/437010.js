// ==UserScript==
// @name        麦能网刷课脚本
// @namespace   com.kk.icu
// @match       http://edu.jobingedu.com/lms/web/course/*
// @grant       none
// @version     1.6.4
// @author      KK(kk996icu@qq.com)
// @description 2021/12/13 下午8:37:23
// @downloadURL https://update.greasyfork.org/scripts/437010/%E9%BA%A6%E8%83%BD%E7%BD%91%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/437010/%E9%BA%A6%E8%83%BD%E7%BD%91%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
(function() {
    'use strict';
    class Node {  //创建课程类
      constructor(key, count, name, schedule) {
        this.key = key
        this.count = count
        this.name = name
        this.schedule = schedule
      }
    }
    //获取当前页面
    const a = $('<a>', { href: window.location.search })[0].baseURI
    const b = a.substr(a.lastIndexOf('/')+1, 5);
    let flag = false
    if(b != 'index') {
        autoVideo()
    }else {
        autoCourse()
    }
  //自动刷视频
function autoVideo() {
    setTimeout(function() {
        let name = localStorage.getItem('name')
        console.log(name)
        let video_list = document.querySelector("#mulu_1")
        let atPresent = document.querySelector(".view_c_title")
        let last = video_list.children[video_list.children.length -1].querySelector('a').title
        let video = document.querySelector("video");
        flag = Boolean(localStorage.getItem("flag"))
        debugger
        autoVideod(video)
        asyncPrint(atPresent.textContent, last,video_list,60*1000)
            
    }, 5000)
  }
  //刷取视频
  function autoVideod(video) {
     selectVideo(video)
  }
  //同步代码
  async function asyncPrint(text1,text2,video_list,ms) {
    let isCount =  anewButton()
    if(isCount){
      await timeout(ms)
    }
    if(isEndVideo(text1, text2) && flag) {
        indexEnd(video_list)
        return
    }
    if(isEndVideo(text1, text2)) {
        endVideo()
    }else {
      nextButton()
    }
  }
  function timeout(ms) {
  		return new Promise((resolve) => {
        let anewButton = document.querySelector('#job_replay_btn')
        anewButton.click()
        setTimeout(function(){
            let video = document.querySelector("video");
            selectVideo(video)
        }, ms)
    		setTimeout(resolve, ms);
  		});
	}
  //刷取视频
  function selectVideo(video) {
    if(video != null) {
      if(video.currentTime < video.duration) {
            video.currentTime = video.duration
        }
    }
  }
  //如果刷取5次还没刷好 重新播放等一分钟就好了
  function anewButton() {
    let count = localStorage.getItem("countV")
    return count >5;
  }
  //从首页点进来的最后一个视频
  function indexEnd(video_list) {
    let first = video_list.children[0].children[1].children[0].href
    localStorage.setItem("flag", "")
    window.location.href = first
    return
  }
  //最后一个视频 返回首页
  function endVideo() {
    localStorage.setItem("flag", "")
    window.location.href = "http://edu.jobingedu.com/lms/web/course/index"
    return
  }
  function nextButton() {
     setTimeout(function() {
      let nextvideo = document.querySelector("#job_nextvideo_btn");
      nextvideo.click()
     }, 5000)
  }
  //判断是不是最后一个视频
  function isEndVideo(text1, text2) {
    return text1 == text2;
  }
  //自动选课
  function autoCourse() {
    setTimeout(function() {
        userCount()
        const courselist = document.querySelector('#course_list')
        //获取未完成的课程
        let arr = selectCoruseList(courselist)  
        if(arr.length == 0) { // arr.length == 0 说明刷完了 提示用户就好了
          alert("你的视频已经刷完了!")
          return;
        }
        arr.sort(function(a,b){
          if(a.count == 0) {  //count 等于0 代表还没刷过 根据count  排序
            return a.count - b.count;
          }else {  // 否则根据完成度多少排序 优先刷
            return a.schedule - b.schedule;  
          }
        })
        console.log(arr)
        //localStorage.setItem('set', JSON.stringify(Array.from(set)))
        //set = JSON.parse(localStorage.getItem('set'))
        brushCoruseList(arr)
      }, 10000)
  }
  //刷取未完成的课程
  function brushCoruseList(arr) {
    for (let i = 0; i < arr.length; i++){
          localStorage.setItem("flag", true)
          arr[i].count += 1
          localStorage.setItem('name', arr[i].name)
          localStorage.setItem(arr[i].name, arr[i].count)
          localStorage.setItem('countV', arr[i].count)
          window.location.href = arr[i].key
          return
    }
  }
  //记录用户进来了多少次
  function userCount() {
    let count = localStorage.getItem('count')
    if(count == null) {   
      count = 0
    }else {
      count = parseInt(count) + 1;
    }
    localStorage.setItem('count', count)
  }
  //获取所有未完成的课程
  function selectCoruseList(courselist) {
    let arr = new Array()
    for (let i = 0; i < courselist.children.length -1; i++) {
          const course = courselist.children[i]
          const course_name = course.querySelector('.coursename')
          const temp = course_name.children[0].textContent
          const key = course.querySelector('a').href
          let schedule = course.querySelector('font').textContent
          const name = course_name.childNodes[0].textContent.trim()
          if(schedule != "100%" && temp == "已开课") {
            let nodeCount = localStorage.getItem(name);
            schedule = parseInt(schedule.substr(0, schedule.length -1))
            let value = new Node(key, nodeCount == null ? 0 : parseInt(nodeCount), name, schedule)
            arr.push(value);
            // localStorage.setItem("flag", true)
            // window.location.href = key
          }
    }
    return arr
  }
})();