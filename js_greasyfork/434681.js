// ==UserScript==
// @name         autoplayvideo
// @namespace    tany2021
// @version      1.0
// @description  autoplay video
// @author       tany2021
// @match        https://cejlu.yuketang.cn/*
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/d3-queue@3.0.7/build/d3-queue.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.js
// @require      https://cdn.bootcdn.net/ajax/libs/js-cookie/latest/js.cookie.js
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant window.close
// @grant window.focus
// @license GPL
// @downloadURL https://update.greasyfork.org/scripts/434681/autoplayvideo.user.js
// @updateURL https://update.greasyfork.org/scripts/434681/autoplayvideo.meta.js
// ==/UserScript==
//

;(function () {
  // https://cdn.jsdelivr.net/npm/p-queue@6.6.2/dist/index.min.js
  'use strict'
  $(document).ready(() => {
    let targetReslove
    let count = 0
    const concurrent = 6
    const MAX_COUNT = 20
    const MAX_COURSE_TIME = 1000 * 60 * 60
    const DONE_KEY = 'done'
    const urlWinMap = new Map()
    const promiseTaskMap = new Map()
    const COURSE_DATA = {
      count: 5,
      is_agreement: true,
      product_list: [
        {
          status: 0,
          sku_id: 4096834,
          course_name: '马克思主义基本原理概论',
          short_name: null,
          created: '2021-09-28 10:16:55',
          class_end: 1647270000000,
          course_cover: '',
          class_start: 1633651200000,
          course_sign: 'KC000344',
          classroom_name: '2021秋-KC000344',
          classroom_id: 9832636,
          course_id: 2258621,
          classroom_term: 202101
        },
        {
          status: 0,
          sku_id: 4096835,
          course_name: '中国近代史纲要',
          short_name: null,
          created: '2021-09-28 10:16:55',
          class_end: 1647270000000,
          course_cover: '',
          class_start: 1633651200000,
          course_sign: 'KC000444',
          classroom_name: '2021秋-KC000444',
          classroom_id: 9832637,
          course_id: 2258622,
          classroom_term: 202101
        },
        {
          status: 0,
          sku_id: 4096832,
          course_name: '形势与政策',
          short_name: null,
          created: '2021-09-28 10:16:51',
          class_end: 1643558400000,
          course_cover: '',
          class_start: 1630425600000,
          course_sign: '420008',
          classroom_name: '2021秋-420008',
          classroom_id: 9832634,
          course_id: 2258623,
          classroom_term: 202101
        },
        {
          status: 0,
          sku_id: 4096830,
          course_name: '毛泽东思想和中国特色社会主义理论体系概论',
          short_name: null,
          created: '2021-09-28 10:16:50',
          class_end: 1647270000000,
          course_cover: '',
          class_start: 1633651200000,
          course_sign: '420002',
          classroom_name: '2021秋-420002',
          classroom_id: 9832632,
          course_id: 1808614,
          classroom_term: 202101
        },
        {
          status: 0,
          sku_id: 4096822,
          course_name: '生活英语听说',
          short_name: null,
          created: '2021-09-28 10:16:49',
          class_end: 1647270000000,
          course_cover: '',
          class_start: 1633651200000,
          course_sign: '30640014X',
          classroom_name: '2021秋-30640014X',
          classroom_id: 9832624,
          course_id: 1776058,
          classroom_term: 202101
        }
      ]
    }
    // 获取对应课程
    async function getCourseList(courseInfo) {
      const id = courseInfo.classroom_id
      const course_sign = courseInfo.course_sign
      const uv_id = Cookies.get('university_id')
      const url = `/mooc-api/v1/lms/learn/course/chapter?cid=${id}&sign=${course_sign}&term=latest&uv_id=${uv_id}`
      const params = {
        csrftoken: Cookies.get('csrftoken'),
        platform_id: Cookies.get('platform_id'),
        sessionid: Cookies.get('sessionid'),
        university_id: Cookies.get('university_id')
      }
      const header = {
        Referer: `https://cejlu.yuketang.cn/pro/lms/${course_sign}/${id}/studycontent`,
        'university-id': Cookies.get('university_id'),
        xtbz: 'cloud',
        TE: 'trailers',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:93.0) Gecko/20100101 Firefox/93.0'
      }
      const axiosData = await axios.get(url, {
        params,
        headers: header
      })
      console.log(axiosData)
      return axiosData.data
    }

    function start() {
      if (isPlatform()) {
        console.log('====begin')
        begin()
      } else if (isChildPage()) {
        console.log('====isChildPage')
        startRead()
      } else {
        console.log('====startMainProcess')
        startMainProcess()
      }
    }

    // 开始一门课程吧
    async function begin() {
      listeningMessageByTop()
      const productList = COURSE_DATA.product_list
      for (let index = 0; index < productList.length; index++) {
        const current = productList[index]
        localStorage.setItem('current', JSON.stringify(current))
        await startCourse(current)
      }
    }

    async function startCourse(current) {
      const { value, resolve } = generatePromise()
      targetReslove = resolve
      // 超时后切换到下一课
      setTimeout(() => {
        resolve()
      }, MAX_COURSE_TIME)
      openCourse(current)
      return value
    }
    // 开启一门课程的网页
    function openCourse({ course_sign, classroom_id }) {
      const url = `https://cejlu.yuketang.cn/pro/lms/${course_sign}/${classroom_id}/studycontent`
      window.open(url)
    }

    // 课程主页
    async function startMainProcess() {
      listeningMessage()
      const currentItem = JSON.parse(localStorage.getItem('current'))
      const data = await getCourseList(currentItem)
      const doneList = await getDoneClass(currentItem)
      const chapterList = data.data.course_chapter
      console.log(doneList, 'is doneList id ')
      const allTask = chapterList
        .map((chapter) => {
          chapter.section_leaf_list = chapter.section_leaf_list.map((leaf) => {
            leaf.leaf_list = leaf.leaf_list || []
            leaf.leaf_list = leaf.leaf_list.filter((d) => {
              return !doneList.includes('' + d.id)
            })
            return [...leaf.leaf_list]
          })
          return [...chapter.section_leaf_list]
        })
        .flat(3)
      console.log(allTask, 'is allTask ======')
      const queue = d3.queue(concurrent)
      queue.defer(delayedHello)
      for (let i = 0; i < allTask.length; i++) {
        const item = allTask[i]
        const task = async (callback) => {
          await run(item, currentItem)
          callback()
        }
        queue.defer(task)
      }
      await queue.awaitAll(() => {
        console.log('queue.awaitAll======== 切换到下一门大大课程')
        allchapterDone()
      })

      function run(course, bigCourse) {
        const { classroom_id, course_sign } = bigCourse
        const { id, leaf_type } = course
        let url
        if (leaf_type === 0) {
          url = `https://cejlu.yuketang.cn/pro/lms/${course_sign}/${classroom_id}/video/${id}`
        } else if (leaf_type === 3) {
          url = `https://cejlu.yuketang.cn/pro/lms/${course_sign}/${classroom_id}/graph/${id}`
        }
        if (!url) {
          return Promise.resolve()
        } else {
          const { value, resolve, reject } = generatePromise()
          openWin(url, resolve)
          return value
        }
      }
    }

    function allchapterDone() {
      window.opener.postMessage('done')
    }

    // 消费课程
    function startRead() {
      if (isHtmlPage()) {
        htmlPage()
      } else {
        videoPageAutoPlay()
      }
    }
    // 打开对应课程
    function openWin(url, resolve) {
      const win = window.open(url)
      urlWinMap.set(url, win)
      promiseTaskMap.set(url, resolve)
    }
    // 自动播放视频，播放完后关闭
    function videoPageAutoPlay() {
      $(document).ready(core)
      function core() {
        console.log('onload video')
        const video = $('.xt_video_player')
        if (video.length == 0) {
          setTimeout(() => {
            if (count > MAX_COUNT) {
              console.log('超时！！！')
              emitMessage()
            }
            console.log('递归')
            core()
            count++
          }, 2000)
        } else {
          console.log('havha====', video)
          video.on('ended', () => {
            console.log('endplay')
            emitMessage()
          })
          window.focus()
          setTimeout(() => {
            video[0].muted = true
            video[0].loop = false
            console.log('video 播放吧')
            video[0].play()
          }, 3000)
          // setTimeout(() => {
          //   console.log($('xt_video_player_big_play_layer'))
          //   console.log('video 播放吧 =====,暂时只是自动播放的')
          //   $('.xt_video_player_big_play_layer')[0].click()
          // }, 100)
        }
      }
    }

    // 阅读page
    function htmlPage() {
      $(document).ready(() => {
        setTimeout(() => {
          console.log('htmlPage ok')
          emitMessage()
        }, 10000)
      })
    }

    // 切换到下一门课程
    function listeningMessageByTop() {
      window.addEventListener(
        'message',
        (event) => {
          const data = event.data
          if (data === DONE_KEY) {
            targetReslove()
          } else {
            console.error('接受到不明message msg:', data)
          }
        },
        false
      )
    }

    // 监听到read消息后更新数据
    function listeningMessage() {
      window.addEventListener(
        'message',
        (event) => {
          const url = event.data
          console.log(url, '已经完成了，关闭窗口')
          if (typeof url != 'string') return
          const win = urlWinMap.get(url)
          const resolve = promiseTaskMap.get(url)
          resolve && resolve()
          win && win.close()
        },
        false
      )
    }

    // 发送消息
    function emitMessage() {
      window.opener.postMessage(window.location.href)
    }

    function isHtmlPage() {
      return location.pathname.indexOf('graph') > -1
    }

    function isChildPage() {
      const pathName = location.pathname.split('/').pop()
      return !!window.opener && pathName !== 'studycontent'
    }

    function isPlatform() {
      const pathName = location.pathname.split('/').pop()
      return Number.isNaN(+pathName) && pathName !== 'studycontent'
    }

    function generatePromise() {
      let _resolve
      let _reject
      let readyPromise = new Promise((resolve, reject) => {
        _resolve = resolve
        _reject = reject
      })
      return {
        value: readyPromise,
        resolve: _resolve,
        reject: _reject
      }
    }

    function delayedHello(callback) {
      setTimeout(function () {
        console.log('Hello! 并发任务正常运作')
        callback(null)
      }, 250)
    }
    // 获取已经完成的课程
    async function getDoneClass({ classroom_id, course_sign }) {
      const uv_id = Cookies.get('university_id')
      const url = `https://cejlu.yuketang.cn/mooc-api/v1/lms/learn/course/schedule?cid=${classroom_id}&sign=${course_sign}&term=latest&uv_id=${uv_id}`
      const header = {
        Referer: `https://cejlu.yuketang.cn/pro/lms/${course_sign}/${classroom_id}/studycontent`,
        'university-id': Cookies.get('university_id'),
        xtbz: 'cloud',
        TE: 'trailers',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:93.0) Gecko/20100101 Firefox/93.0'
      }
      const data = await axios.get(url, { headers: header })
      const doneObject = data.data.data.leaf_schedules || {}
      console.log('done data:===', data, doneObject)
      const keys = Object.keys(doneObject).filter((k) => doneObject[k] == 1)
      return keys
    }
    start()
  })
})()
