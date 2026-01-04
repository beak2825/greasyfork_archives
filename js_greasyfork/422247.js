// ==UserScript==
// @name:zh-CN   Skillshare 字幕下载
// @name         Skillshare Subtitle Downloader
// @namespace    https://greasyfork.org/users/5711
// @version      12
// @description:zh-CN  支持下载 Skillshare 的字幕 (.srt 文件) 以及 下载视频 (.mp4)
// @description  Download Skillshare Subtitle as .srt file
// @author       Zheng Cheng
// @match        https://www.skillshare.com/*/classes/*
// @run-at       document-start
// @grant        unsafeWindow
// @license      MIT
// @supportURL   guokrfans@gmail.com
// @require      https://cdn.jsdelivr.net/npm/vue@2.7.14/dist/vue.js
// @downloadURL https://update.greasyfork.org/scripts/422247/Skillshare%20Subtitle%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/422247/Skillshare%20Subtitle%20Downloader.meta.js
// ==/UserScript==

/*
最初写于 2020-2-24

[工作原理]
1. 下载一门课程全部字幕（多个 .srt 文件）原理是利用 transcriptCuesArray，字幕数据都在里面，进行格式转换+保存即可
2. 下载当前视频的字幕（一个 .srt 文件）原理是用 videojs 里 textTracks 的 cue，进行格式转换+保存即可

[更新日志]
* v12 (2022-12-23): download all available language for current video.
* v11 (2022-12-23): Fix: 1. "download button" now showing. 2. Changed all button text from Chinese to English.
* v9（2021-3-11）: 改进了批量下载视频时，文件名的构造方法
* v8（2021-3-11）: 整理代码
* v7（2021-3-11）: 可以下载视频，包括当前视频，以及从当前视频开始一直到最后一个视频。

[注意]
必须 @run-at document-start，因为批量下载视频的部分需要尽早拦截 XMLHttpRequest.prototype.setRequestHeader

[测试]
这个视频有5种语言（测试5种语言的全部下载）
https://www.skillshare.com/en/classes/Mobile-Development-Mastery-Class-Android-App-development-2020-Part-1/711355350/projects?via=member-home-SavedClassesSection
*/

;(function () {
  'use strict'

  // ==== 这一段的目的，是为了把一个请求头存起来，之后我们自己发请求时用得上 ====
  // 有的 http 请求，比如获得视频信息的那个 https://edge.api.brightcove.com/playback/v1/accounts/3695997568001/videos/6173466475001
  // 需要一个请求头，Accept: application/json;pk=BCpkADawqM2OOcM6njnM7hf9EaK6lIFlqiXB0iWjqGWUQjU7R8965xUvIQNqdQbnDTLz0IAO7E6Ir2rIbXJtFdzrGtitoee0n1XXRliD-RH9A-svuvNW9qgo3Bh34HEZjXjG4Nml4iyz3KqF
  // pk 是 policy key 的缩写（因为响应头里面明确写了 Policy-Key-Raw )
  // 由于这个 Accept: application/json;pk= 完全无法在页面中获取到（应该是用代码生成的）我们只能使用这样的截取方式

  var request_header_accept = null
  XMLHttpRequest.prototype.real_setRequestHeader =
    XMLHttpRequest.prototype.setRequestHeader
  XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
    if (header == 'Accept' && value.startsWith('application/json;pk=')) {
      request_header_accept = value // 如果两个条件都对，就存起来
      // console.log(`找到了!`);
      // console.log(request_header_accept);
      // 还好找到了这样的方式，不然我就去写 Chrome Extension 了（麻烦多了，安装也麻烦，开发也麻烦）
    }
    this.real_setRequestHeader(header, value)
  }
  // ==== 这一段的目的，是为了把一个请求头存起来，之后我们自己发请求时用得上 ====

  // 初始化变量
  var sessions = null // 存一个 sessions 数组 (Skillshare 提供的)
  var transcriptCuesArray = null // 用途同上
  var div = document.createElement('div')
  var root_div_for_vue = document.createElement('div') // 让 Vue.js 挂载的根元素。
  var vue_js_root_id = 'skillshare_subtitle_downloader_root_div_for_vuejs' // 根元素的 ID。
  var button = document.createElement('button') // 下载全部字幕的按钮
  var button2 = document.createElement('button') // 下载当前视频字幕的按钮
  var button3 = document.createElement('button') // 下载当前视频的按钮
  var button4 = document.createElement('button') // 下载全部视频的按钮
  var title_element = document.querySelector('div.class-details-header-title') // 标题元素，我们的所有要加的东西都放在它后面。

  function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling)
  }

  // 注入
  async function inject_our_script() {
    transcriptCuesArray = await get_transcriptCuesArray()
    var subtitle_ids = Object.keys(transcriptCuesArray) // ['3150718', '3150719', '3150720', ...]
    var subtitle_count = subtitle_ids.length

    // 此按钮点击后：下载这门课的所有字幕 (得到多个文件)
    var button_text = `Download All Subtitle (${subtitle_count} .srt)`
    button.textContent = button_text
    button.addEventListener('click', download_subtitles)

    // 此按钮点击后：下载当前视频的一个字幕 (得到一个文件)
    button2.textContent = get_download_current_episode_button_text()
    button2.addEventListener('click', download_current_episode_subtitles)

    // 此按钮点击后：下载当前视频
    button3.textContent = get_download_current_video_button_text()
    button3.addEventListener('click', download_current_episode_video)

    var button_css = `
      font-size: 16px;
      padding: 4px 18px;
    `

    var button2_css = `
      font-size: 16px;
      padding: 4px 18px;
      margin-left: 10px;
    `

    var div_css = `
      margin-bottom: 10px;
    `

    button.setAttribute('style', button_css)
    button2.setAttribute('style', button2_css)
    button3.setAttribute('style', button2_css)
    div.setAttribute('style', div_css)

    div.appendChild(button)
    div.appendChild(button2)
    div.appendChild(button3)

    // 按钮4
    button4.textContent =
      'Starting from current video, download all video til the very last one'
    button4.addEventListener('click', download_all_video)
    button4.setAttribute('style', button2_css)
    div.appendChild(button4)

    insertAfter(div, title_element)
  }

  // 下载当前这集视频
  function download_current_episode_video() {
    var vjs = videojs(document.querySelector('video'))
    var video_link = find_video_link(vjs.mediainfo.sources)
    if (video_link != null) {
      var filename = `${get_filename()}.mp4`
      fetch(video_link)
        .then((res) => res.blob())
        .then((blob) => {
          downloadString(blob, 'video/mp4', filename)
        })
    }
  }

  // 下载单个视频, 用法参照其他地方
  function download_video(video_link, filetype, filename) {
    return new Promise((resolve, reject) => {
      fetch(video_link)
        .then((res) => res.blob())
        .then((blob) => {
          downloadString(blob, filetype, filename)
          resolve(true)
        })
        .catch((err) => reject(err))
    })
  }

  // 输入: sources 数组, 来自于网络请求的返回
  // 输出: (字符串) 一个视频链接
  function find_video_link(sources) {
    var video_link = null

    // 在数组里找到 *.mp4 的链接
    var array = sources
    for (var i = 0; i < array.length; i++) {
      var s = array[i]
      if (s.container && s.container == 'MP4' && s.height >= 720) {
        video_link = s.src
        break
      }
    }

    return video_link
  }

  // 把 cue 遍历一下，得到一个特定格式的对象数组
  function get_current_episode_content_array() {
    var vjs = videojs(document.querySelector('video'))
    var cues = vjs.textTracks()[0].cues
    var array = []
    for (var i = 0; i < cues.length; i++) {
      var cue = cues[i]
      var obj = {
        start: cue.startTime,
        end: cue.endTime,
        text: cue.text,
      }
      array.push(obj)
    }
    return array
  }

  // 下载当前集字幕
  async function download_current_episode_subtitles() {
    var array = get_current_episode_content_array()
    var srt = parse_content_array_to_SRT(array)
    var filename = `${get_filename()}.srt`
    downloadString(srt, 'text/plain', filename)
  }

  // CSRF
  function csrf() {
    return SS.serverBootstrap.parentClassData.formData.csrfTokenValue
  }

  // 拿到当前课程的 URL (不带任何参数或者 section，不带 /projects 或 /transcripts 在 URL 最后)
  function course_url() {
    var url1 = SS.serverBootstrap.loginPopupRedirectTo
    var url2 = window.location.origin + window.location.pathname
    if (url1) {
      return url1
    } else {
      return url2
    }
    // return document.querySelector('meta[property="og:url"]').content // 这个不可靠
    // 比如:
    // https://www.skillshare.com/classes/Logo-Design-Mastery-The-Full-Course/1793713747
  }

  // 返回一个 URL
  function json_url() {
    return `${course_url()}/transcripts?format=json`
    // https://www.skillshare.com/classes/Logo-Design-Mastery-The-Full-Course/1793713747/transcripts?format=json
  }

  // 发 http 请求，拿到 transcriptCuesArray
  // 调用例子：var result = await get_transcriptCuesArray();
  async function get_transcriptCuesArray() {
    return new Promise(function (resolve, reject) {
      var url = json_url()
      fetch(url, {
        headers: {
          'x-csrftoken': csrf(),
          accept: 'application/json, text/javascript, */*; q=0.01',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          resolve(data.transcriptCuesArray)
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  // 输入: id
  // 输出: sessions 数组里的一个对象
  function id_to_obj(id) {
    var array = sessions
    for (var i = 0; i < array.length; i++) {
      var one = array[i]
      if (one.id == id) {
        return one
      }
    }
    return null
  }

  // 输入: video_id
  // 输出: session 里那条纪录
  function video_id_to_obj(video_id) {
    var string = `bc:${video_id}` // videoId: "bc:6053324155001"
    var array = sessions
    for (var i = 0; i < array.length; i++) {
      var one = array[i]
      if (one.videoId == string) {
        return one
      }
    }
    return null
  }

  // 输入: video_id
  // 输出: 合适的视频文件名 (但是没后缀，后缀自己加)
  function get_filename_by_video_id(video_id) {
    var obj = video_id_to_obj(video_id)
    var rank = obj.displayRank
    var filename = `${rank}. ${safe_filename(obj.title)}`
    return filename
  }

  // 输入: id
  // 输出: 文件名 (xxx.srt)
  function get_filename_by_id(id) {
    var obj = id_to_obj(id)
    var rank = obj.displayRank
    var title = obj.title
    var filename = `${rank}. ${safe_filename(title)}.srt`
    return filename
  }

  // 下载所有集的字幕
  async function download_subtitles() {
    for (let key in transcriptCuesArray) {
      var value = transcriptCuesArray[key]
      var srt = parse_content_array_to_SRT(value.content)
      var filename = get_filename_by_id(key)
      downloadString(srt, 'text/plain', filename)

      await sleep(1000)
      // 如果不 sleep，下载大概11个文件就会停下来（不会报错，但就是停下来了）
      // sleep 可以把全部42个文件下载下来
    }
  }

  // 从当前视频开始下载
  async function download_all_video() {
    // 当前 session
    var startingSession =
      unsafeWindow.SS.serverBootstrap.pageData.videoPlayerData.startingSession

    // 全部 session
    var sessions =
      unsafeWindow.SS.serverBootstrap.pageData.videoPlayerData.units[0].sessions

    for (var i = 0; i < sessions.length; i++) {
      var session = sessions[i]
      var displayRank = session.displayRank
      if (displayRank >= startingSession.displayRank) {
        // 从当前视频开始下载（包括当前视频）一直下载到最后一个
        var video_id = session.videoId.split(':')[1] // 视频 ID
        var response = await get_single_video_data(video_id) // 拿到 JSON 返回

        var video_link = find_video_link(response.sources) // 视频链接
        var filename = `${get_filename_by_video_id(response.id)}.mp4` // 文件名

        if (video_link.startsWith('http://')) {
          video_link = video_link.replace('http://', 'https://')
        }

        // console.log(video_link);
        // console.log(filename);
        // console.log(response);
        // console.log('--------------');
        await download_video(video_link, 'video/mp4', filename) // 下载
      }
    }
  }

  // 返回账户 ID
  // 举例: 3695997568001
  function get_account_id() {
    return unsafeWindow.SS.serverBootstrap.pageData.videoPlayerData
      .brightcoveAccountId
  }

  // 输入: id
  // 输出: JSON (视频数据)
  function get_single_video_data(video_id) {
    // https://edge.api.brightcove.com/playback/v1/accounts/3695997568001/videos/6234379709001
    var account_id = get_account_id()
    var url = `https://edge.api.brightcove.com/playback/v1/accounts/${account_id}/videos/${video_id}`
    return new Promise(function (resolve, reject) {
      fetch(url, {
        headers: {
          Accept: request_header_accept,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          resolve(data)
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  // 把指定格式的数组
  // 转成 SRT
  // 返回字符串
  // var content_array_example = [
  //   {
  //     start: 0,
  //     end: 8.3,
  //     text: "hi"
  //   },
  //   // ...
  // ];
  function parse_content_array_to_SRT(content_array) {
    if (content_array === '') {
      return false
    }

    var result = ''
    var BOM = '\uFEFF'
    result = BOM + result // store final SRT result

    for (var i = 0; i < content_array.length; i++) {
      var one = content_array[i]
      var index = i + 1
      var content = one.text
      var start = one.start
      var end = one.end

      // we want SRT format:
      /*
          1
          00:00:01,939 --> 00:00:04,350
          everybody Craig Adams here I'm a
          2
          00:00:04,350 --> 00:00:06,720
          filmmaker on YouTube who's digging
      */
      var new_line = '\n'
      result = result + index + new_line
      // 1

      var start_time = process_time(parseFloat(start))
      var end_time = process_time(parseFloat(end))
      result = result + start_time
      result = result + ' --> '
      result = result + end_time + new_line
      // 00:00:01,939 --> 00:00:04,350

      result = result + content + new_line + new_line
    }
    return result
  }

  // 处理时间. 比如 start="671.33"  start="37.64"  start="12" start="23.029"
  // 处理成 srt 时间, 比如 00:00:00,090    00:00:08,460    00:10:29,350
  function process_time(s) {
    s = s.toFixed(3)
    // 超棒的函数, 不论是整数还是小数都给弄成3位小数形式
    // 举个柚子:
    // 671.33 -> 671.330
    // 671 -> 671.000
    // 注意函数会四舍五入. 具体读文档

    var array = s.split('.')
    // 把开始时间根据句号分割
    // 671.330 会分割成数组: [671, 330]

    var Hour = 0
    var Minute = 0
    var Second = array[0] // 671
    var MilliSecond = array[1] // 330
    // 先声明下变量, 待会把这几个拼好就行了

    // 我们来处理秒数.  把"分钟"和"小时"除出来
    if (Second >= 60) {
      Minute = Math.floor(Second / 60)
      Second = Second - Minute * 60
      // 把 秒 拆成 分钟和秒, 比如121秒, 拆成2分钟1秒

      Hour = Math.floor(Minute / 60)
      Minute = Minute - Hour * 60
      // 把 分钟 拆成 小时和分钟, 比如700分钟, 拆成11小时40分钟
    }
    // 分钟，如果位数不够两位就变成两位，下面两个if语句的作用也是一样。
    if (Minute < 10) {
      Minute = '0' + Minute
    }
    // 小时
    if (Hour < 10) {
      Hour = '0' + Hour
    }
    // 秒
    if (Second < 10) {
      Second = '0' + Second
    }
    return Hour + ':' + Minute + ':' + Second + ',' + MilliSecond
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  // copy from: https://gist.github.com/danallison/3ec9d5314788b337b682
  // Example downloadString(srt, "text/plain", filename);
  function downloadString(text, fileType, fileName) {
    var blob = new Blob([text], {
      type: fileType,
    })
    var a = document.createElement('a')
    a.download = fileName
    a.href = URL.createObjectURL(blob)
    a.dataset.downloadurl = [fileType, a.download, a.href].join(':')
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(function () {
      URL.revokeObjectURL(a.href)
    }, 11500)
  }

  // 切换了视频会触发这个事件
  // 实测好像点其他地方也会触发这个事件，
  document.addEventListener('selectionchange', function () {
    button2.textContent = get_download_current_episode_button_text()
  })

  function get_download_current_episode_button_text() {
    return `Download Subtitle (.srt) for this episode`
    // return `下载当前字幕 (${get_filename()}.srt)`
  }

  function get_download_current_video_button_text() {
    return `Download Video (.mp4) for this episode`
  }

  // 返回当前正在播放的视频标题
  function get_current_title() {
    var li = document.querySelector('li.session-item.active')
    var title = li.querySelector('.session-item-title')
    return title.innerText
  }

  // 转换成安全的文件名
  function safe_filename(string) {
    return string.replace(':', '-')
  }

  // 当前视频的安全文件名
  function get_filename() {
    return safe_filename(get_current_title())
  }

  // 获取可以下载的字幕语言
  // 返回: track 对象
  function get_available_tracks() {
    // 德语
    // https://www.skillshare.com/transcripts/4081323b-d64e-4823-a63f-559b632e8a84/text.vtt?ts=20210817140251
    // 英语
    // https://www.skillshare.com/transcripts/c3a30034-6db8-4363-9f32-1c5179b50e83/text.vtt?ts=20210817140251
    // 结论：每个字幕的 id 不同。
    var vjs = videojs(document.querySelector('video'))
    let tracks = vjs.textTracks_.tracks_
    let subtitle_tracks = tracks.filter((track) => track.kind == 'subtitles')
    return subtitle_tracks
  }

  function get_available_languages() {
    let tracks = get_available_tracks()
    let languages_name = tracks.map((track) => track.label)
    return languages_name
  }

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  // 等待一个元素存在
  // https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
  function waitForElm(selector) {
    return new Promise((resolve) => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector))
      }

      const observer = new MutationObserver((mutations) => {
        if (document.querySelector(selector)) {
          resolve(document.querySelector(selector))
          observer.disconnect()
        }
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      })
    })
  }

  function vue() {
    // 用于 Vue.js
    root_div_for_vue.setAttribute('id', vue_js_root_id)
    insertAfter(root_div_for_vue, title_element)

    Vue.component('languages-select', {
      data: function () {
        return {
          selected: '',
          languages: get_available_languages(),
        }
      },
      template: `
      <select v-model="selected" style='opacity:1; padding: 6px 8px;' @change="onChange($event)">
        <option disabled value="">Please select subtitle langauge for download</option>
        <option v-for="option in languages" :value="option">
          {{ option }}
        </option>
      </select>
      `,
      methods: {
        // 下载该语言的字幕
        onChange(event) {
          let language_name = event.target.value
          let tracks = get_available_tracks()
          let track = tracks.find((e) => e.label == language_name)
          let src = track.src

          let webvtt = fetch(src)
            .then((res) => res.text())
            .then((text) => {
              var filename = `[${language_name}] ${get_filename()}.vtt`
              downloadString(text, 'text/plain', filename)
            })

          this.selected = ''
        },
      },
    })

    const app = new Vue({
      el: `#${vue_js_root_id}`,
      template: `
      <div>
        <languages-select></languages-select>
      </div>
      `,
    })
    unsafeWindow.skill_share_downloader_vue = app
  }

  // 程序入口
  async function main() {
    // 等待 <video> 的出现
    await waitForElm('video')

    // 再等一会儿，等数据加载
    await wait(3000)

    // 如果有标题才执行
    title_element = document.querySelector('div.class-details-header-title')
    if (title_element) {
      inject_our_script()
      sessions =
        unsafeWindow.SS.serverBootstrap.pageData.unitsData.units[0].sessions
    }

    // 注入 vue
    vue()
  }

  setTimeout(main, 2000)
})()
