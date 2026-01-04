// ==UserScript==
// @name         UOOC assistant beta modified
// @name         UOOC 优课联盟助手 (内测版)
// @namespace    https://greasyfork.org/zh-CN/users/220174-linepro
// @version      1.0.7
// @description  【使用前先看介绍/有问题可反馈】UOOC 优课联盟助手 (内测版) (UOOC assistant beta)：可选是否倍速 (若取消勾选则一倍速播放)，可选是否静音 (若取消勾选则恢复原音量)，可选是否播放 (若取消勾选则暂停播放)，可选是否连播 (若取消勾选则循环播放)，离开页面保持视频状态，自动回答视频中途弹出问题，可复制已提交测验题目及答案；键盘左右方向键可以控制视频快进/快退，上下方向键可以控制音量增大/减小，空格键可以控制播放/暂停；如果视频标题下面出现 `倍速/静音/播放/连播` 选项说明脚本正常启动运行。
// @author       cc (modified by linepro)
// @include      http://www.uooc.net.cn/home/learn/index*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/441071/UOOC%20assistant%20beta%20modified.user.js
// @updateURL https://update.greasyfork.org/scripts/441071/UOOC%20assistant%20beta%20modified.meta.js
// ==/UserScript==

function ckeckTestIgnorable () {
  var cid = location.href.match(/index#\/(\d+)\//)[1]
  $.ajax({
    url: 'http://www.uooc.net.cn/home/learn/getCourseLearn',
    type: 'GET',
    data: { cid: cid }
  }).then(res => {
    window.canIgnoreTest = Boolean(res.data.course_learn_mode === '20')
  })
}
function bindChapterChange () {
  function bindSubChapterChange () {
    var sourceView = document.querySelector('[source-view]')
    var sObserver = new MutationObserver(function (mutations) {
      if (document.querySelector('[source-view] [uooc-video] video')) setTimeout(start, 250)
    })
    sObserver.observe(sourceView, { childList: true })
  }
  var mainLeft = document.querySelector('.learn-main-left')
  var mObserver = new MutationObserver(function (mutations) {
    bindSubChapterChange()
  })
  mObserver.observe(mainLeft, { childList: true })
  bindSubChapterChange()
}
function autoQuiz () {
  function autoQuizAnswer () {
    let quizLayer = document.getElementById('quizLayer')
    let source = JSON.parse(document.querySelector('div[uooc-video]').getAttribute('source'))
    let quizQuestion = document.querySelector('.smallTest-view .ti-q-c').innerHTML
    let quizAnswer = source.quiz.find(q => q.question === quizQuestion).answer
    let quizOptions = quizLayer.querySelector('div.ti-alist')
    for (let ans of eval(quizAnswer)) quizOptions.children[ans.charCodeAt() - 'A'.charCodeAt()].click()
    quizLayer.querySelector('button').click()
  }
  var learnView = document.querySelector('.lean_view')
  var observer = new MutationObserver(function (mutations) {
    for (let mutation of mutations) {
      let node = mutation.addedNodes[0]
      if (node && node.id && node.id.includes('layui-layer')) {
        autoQuizAnswer()
        break
      }
    }
  })
  observer.observe(learnView, { childList: true })
}
function bindVideoEvents () {
  var video = document.querySelector('#player_html5_api')
  video.onpause = function () { if (document.querySelector('#play').checked) this.play() }
  video.onended = findNextVideo
}
function start () {
  bindKeyboardEvents()
  bindVideoEvents()
  autoQuiz()
  var video = document.getElementById('player_html5_api')
  var volume = document.getElementById('volume')
  var play = document.getElementById('play')
  var rate = document.getElementById('rate')
  if (volume.checked) video.muted = true
  if (play.checked && video.paused) video.play()
  if (rate.checked) video.playbackRate = 2.0
}
function placeComponents () {
  function copyToClipboard (content) {
    var t = document.createElement('textarea')
    t.value = content
    document.body.appendChild(t)
    t.select()
    document.execCommand('copy')
    document.body.removeChild(t)
  }
  function getCheckbox (name, text) {
    var p = document.createElement('p')
    p.style = 'color: #ccc; padding-left: 10px;'
    var checkbox = document.createElement('input')
    checkbox.id = checkbox.name = checkbox.value = name
    checkbox.type = 'checkbox'
    checkbox.checked = true
    checkbox.style = 'margin-left: 15px; width: 12px; height: 12px;'
    p.append(checkbox)
    var label = document.createElement('label')
    label.for = name
    label.innerText = text
    label.style = 'margin-left: 13px; font-size: 12px;'
    p.append(label)
    return p
  }
  function getContainer (_id) {
    var container = document.createElement('div')
    container.id = _id
    container.style = 'display: flex; flex-direction: row; align-items: center;'
    return container
  }
  function getCopyButton () {
    var copyButton = document.createElement('p')
    copyButton.style = 'color: #ccc; padding-left: 10px;'
    var btn = document.createElement('button')
    btn.innerText = '复制题目答案'
    btn.style = 'margin-left: 13px; padding: 0 5px 0; font-size: 12px; cursor: pointer;'
    btn.onclick = function () {
      var testPaperTop = frames[0] ? frames[0].document.querySelector('.testPaper-Top') : document.querySelector('.testPaper-Top');
      if (!testPaperTop) {
        alert('该页面不是测验页面，无法复制内容')
      } else {
        let index = 1;
        if (testPaperTop.querySelector('.fl_right')) {
          var queItems = frames[0] ? Array.from(frames[0].document.querySelectorAll('.queItems')) : Array.from(document.querySelectorAll('.queItems'));
          var content = queItems.map(queType => {
            var res = ''
            var questions = queType.querySelectorAll('.queContainer')
            res += Array.from(questions).map((question) => {
              var que = question.querySelector('.queBox').innerText.replace(/\n{2,}/g, '\n').replace(/(\w\.)\n/g, '$1 ')
              var ans = question.querySelectorAll('.answerBox .ng-scope')[2].innerText.replace(/\n/g, '')
              // var right = question.querySelector('.scores').innerText.match(/\d+\.?\d+/g).map(score => eval(score))
              // right = right[0] === right[1]
              return `${index++}. ${que}\n${ans}\n`
            }).join('\n')
            return res
          }).join('\n')
          console.log(content)
          GM_setClipboard(content)
          alert('题目及答案已复制到剪切板')
        } else {
          alert('该测验可能还没提交，无法复制')
        }
      }
    }
    copyButton.appendChild(btn)
    return copyButton
  }
  function setCheckboxes (container) {
    var rateCheckbox = getCheckbox('rate', '倍速')
    var volumeCheckbox = getCheckbox('volume', '静音')
    var playCheckbox = getCheckbox('play', '播放')
    var continueCheckbox = getCheckbox('continue', '连播')
    var copyButton = getCopyButton()
    var video = document.getElementById('player_html5_api')
    rateCheckbox.firstElementChild.checked
    rateCheckbox.firstElementChild.onchange = function (event) {
      if (event.target.checked) video.playbackRate = 2
    }
    volumeCheckbox.firstElementChild.onchange = function (event) {
      if (event.target.checked) video.muted = true
      else video.muted = false
    }
    playCheckbox.firstElementChild.onchange = function (event) {
      if (event.target.checked) video.play()
      else video.pause()
    }
    container.appendChild(rateCheckbox)
    container.appendChild(volumeCheckbox)
    container.appendChild(playCheckbox)
    container.appendChild(continueCheckbox)
    container.appendChild(copyButton)
  }
  function setPrompt (container) {
    var div = document.createElement('div')
    div.innerHTML = `提示：<u>该版本为内测版，使用时请先关闭正式版</u>，<u><a href="https://greasyfork.org/zh-CN/scripts/425837-uooc-assistant-beta/feedback" target="_blank" style="color: yellow;">若出现 BUG 点此反馈</a></u>，键盘的 \u2190 和 \u2192 可以控制快进/快退，\u2191 和 \u2193 可以控制音量增大/减小，空格键可以控制播放/暂停`
    div.style = 'color: #cccccc; height: min-height; margin: 0 20px 0; padding: 0 5px; border-radius: 5px; font-size: 12px;'
    container.appendChild(div)
  }
  function setAppreciationCode (container) {
    var a = document.createElement('a')
    a.href = 'https://s1.ax1x.com/2020/11/08/BTeRqe.png'
    a.target = '_blank'
    a.innerHTML = '<u>本脚本使用完全免费，您的打赏是作者维护下去的最大动力！点此打赏作者😊</u>'
    a.style = 'color: #cccccc; font-weight: bold; height: min-height; margin: 0 20px 0; padding: 0 5px; border-radius: 5px; font-size: 11px;'
    container.appendChild(a)
  }
  var head = document.querySelector('.learn-head')
  var checkboxContainer = getContainer('checkbox-container')
  setCheckboxes(checkboxContainer)
  var promptContainer = getContainer('prompt-container')
  setPrompt(promptContainer)
  var appreciationCodeContainer = getContainer('appreciation-code-container')
  setAppreciationCode(appreciationCodeContainer)
  head.appendChild(checkboxContainer)
  head.appendChild(promptContainer)
  head.appendChild(appreciationCodeContainer)
  head.style.height = `${head.offsetHeight + 30}px`
}
function bindKeyboardEvents () {
  document.onkeydown = function (event) {
    var complete = false
    var basicActiveDiv = document.querySelector('div.basic.active')
    var video = document.getElementById('player_html5_api')
    if (basicActiveDiv && basicActiveDiv.classList.contains('complete')) complete = true
    switch (event.key) {
      case 'ArrowLeft': {
        video.currentTime -= 10
        break
      }
      case 'ArrowRight': {
        if (complete) video.currentTime += 10
        break
      }
      case 'ArrowUp': {
        if (video.volume + 0.1 <= 1.0) video.volume += 0.1
        else video.volume = 1.0
        break
      }
      case 'ArrowDown': {
        if (video.volume - 0.1 >= 0.0) video.volume -= 0.1
        else video.volume = 0.0
        break
      }
      case ' ': {
        let continueCheckbox = document.getElementById('play')
        continueCheckbox.click()
        break
      }
    }
  }
}
function findNextVideo () {
  var video = document.getElementById('player_html5_api')
  if (video) {
    if (!document.getElementById('continue').checked) {
      video.currentTime = 0
    } else {
      let current_video = document.querySelector('.basic.active')
      let next_part = current_video.parentNode
      let next_video = current_video
      let isVideo = (node) => { return Boolean(node.querySelector('span.icon-video')) }
      let canBack = () => { return Boolean(next_part.parentNode.parentNode.tagName === 'LI') }
      let toNextVideo = () => {
        next_video = next_video.nextElementSibling
        while (next_video && !isVideo(next_video)) next_video = next_video.nextElementSibling
      }
      let isExistsVideo = () => {
        let _video = next_part.firstElementChild
        while (_video && !isVideo(_video)) _video = _video.nextElementSibling
        return Boolean(_video && isVideo(_video))
      }
      let isExistsNextVideo = () => {
        let _video = current_video.nextElementSibling
        while (_video && !isVideo(_video)) _video = _video.nextElementSibling
        return Boolean(_video && isVideo(_video))
      }
      let isExistsNextListAfterFile = () => {
        let part = next_part.nextElementSibling
        return Boolean(part && part.childElementCount > 0)
      }
      let toNextListAfterFile = () => { next_part = next_part.nextElementSibling }
      let toOuterList = () => { next_part = next_part.parentNode.parentNode }
      let toOuterItem = () => { next_part = next_part.parentNode }
      let isExistsNextListAfterList = () => { return Boolean(next_part.nextElementSibling) }
      let toNextListAfterList = () => { next_part = next_part.nextElementSibling }
      let expandList = () => { next_part.firstElementChild.click() }
      let toExpandListFirstElement = () => {
        next_part = next_part.firstElementChild.nextElementSibling
        if (next_part.classList.contains('unfoldInfo')) next_part = next_part.nextElementSibling
      }
      let isList = () => { return Boolean(next_part.tagName === 'UL') }
      let toInnerList = () => { next_part = next_part.firstElementChild }
      let toFirstVideo = () => {
        next_video = next_part.firstElementChild
        while (next_video && !isVideo(next_video)) next_video = next_video.nextElementSibling
      }
      let mode = {
        FIRST_VIDEO: 'FIRST_VIDEO',
        NEXT_VIDEO: 'NEXT_VIDEO',
        LAST_LIST: 'LAST_LIST',
        NEXT_LIST: 'NEXT_LIST',
        INNER_LIST: 'INNER_LIST',
        OUTER_LIST: 'OUTER_LIST',
        OUTER_ITEM: 'OUTER_ITEM',
      }
      let search = (_mode) => {
        switch (_mode) {
          case mode.FIRST_VIDEO:
            if (isExistsVideo()) {
              toFirstVideo()
              next_video.click()
              start()
            } else if (isExistsNextListAfterFile()) {
              search(mode.LAST_LIST)
            } else if (window.canIgnoreTest) {
              next_part = next_part.lastElementChild
              search(mode.OUTER_LIST)
            }
            break
          case mode.NEXT_VIDEO:
            if (isExistsNextVideo()) {
              toNextVideo()
              next_video.click()
              start()
            } else if (isExistsNextListAfterFile()) {
              search(mode.LAST_LIST)
            } else {
              search(mode.OUTER_ITEM)
            }
            break
          case mode.LAST_LIST:
            toNextListAfterFile()
            toInnerList()
            search(mode.INNER_LIST)
            break
          case mode.NEXT_LIST:
            toNextListAfterList()
            search(mode.INNER_LIST)
            break
          case mode.INNER_LIST:
            expandList()
            function waitForExpand () {
              if (next_part.firstElementChild.nextElementSibling) {
                if (next_part.firstElementChild.nextElementSibling.childElementCount === 0) {
                  search(mode.OUTER_LIST)
                } else {
                  toExpandListFirstElement()
                  if (isList()) {
                    toInnerList()
                    search(mode.INNER_LIST)
                  } else {
                    search(mode.FIRST_VIDEO)
                  }
                }
              } else {
                setTimeout(waitForExpand, 250)
              }
            }
            waitForExpand()
            break
          case mode.OUTER_LIST:
            toOuterList()
            if (isExistsNextListAfterList()) {
              search(mode.NEXT_LIST)
            } else if (canBack()) {
              search(mode.OUTER_LIST)
            } else {
              // perhaps there is no next list
            }
            break
          case mode.OUTER_ITEM:
            toOuterItem()
            if (isExistsNextListAfterList()) {
              toNextListAfterList()
              search(mode.INNER_LIST)
            } else if (canBack()){
              search(mode.OUTER_LIST)
            } else {
              // perhaps there is no list
            }
            break
          default:
            break
        }
      }
      try {
        search(mode.NEXT_VIDEO)
      } catch (err) {
        console.error(err)
      }
    }
  }
}
window.onload = function () {
  ckeckTestIgnorable()
  function waitHead () {
    if (document.querySelector('.learn-head')) {
      placeComponents()
      bindChapterChange()
      function ready () {
        start()
        console.log('UOOC assistant beta has initialized.')
      }
      if (document.getElementById('player_html5_api')) {
        ready()
      } else {
        var iconVideo = document.querySelector('.icon-video')
        if (iconVideo) {
          iconVideo.click()
          setTimeout(ready, 250)
        }
      }
    } else {
      setTimeout(waitHead, 250)
    }
  }
  waitHead()
}