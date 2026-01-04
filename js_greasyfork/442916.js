// ==UserScript==
// @name         💡智慧树复读机-优化版
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  半自动回答习惯分问题，基于原作者@ch3cknull修改
// @author       Erick
// @require      https://unpkg.com/axios/dist/axios.min.js
// @match        https://qah5.zhihuishu.com/qa.html
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442916/%F0%9F%92%A1%E6%99%BA%E6%85%A7%E6%A0%91%E5%A4%8D%E8%AF%BB%E6%9C%BA-%E4%BC%98%E5%8C%96%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/442916/%F0%9F%92%A1%E6%99%BA%E6%85%A7%E6%A0%91%E5%A4%8D%E8%AF%BB%E6%9C%BA-%E4%BC%98%E5%8C%96%E7%89%88.meta.js
// ==/UserScript==
(function() {
  const e = document.createEvent("MouseEvents");
  e.initEvent("click", true, true);
  const input = document.createEvent("HTMLEvents");
  input.initEvent("input", true, false);
  const state = (document.URL.includes('home'))?'home':'detail'
  const MY_ANSWER_API = "https://creditqa.zhihuishu.com/creditqa/web/qa/myAnswerList"
  const HOT_QUESTION = "https://creditqa.zhihuishu.com/creditqa/web/qa/getHotQuestionList"
  const NEW_QUESTION = "https://creditqa.zhihuishu.com/creditqa/web/qa/getRecommendList"
  const config = {
    offset: 0,
    currURL: HOT_QUESTION
  }
  const CASLOGC = document.cookie.split(';')
    .filter(item => item.includes('CASLOGC'))
    .toString().trim()
    .replace(/\"/g, "'").split('=')[1]
  const uuid = JSON.parse(decodeURIComponent(CASLOGC)).uuid
  let reqCount = 0
  let params = {
    uuid: uuid, dateFormate: new Date() * 1,
    pageIndex: 0, pageSize: 50
  }
  params.recruitId = document.URL.split('?')[1].split('&')
    .filter( item => item.includes('recruitId'))[0].split('=')[1]
  params.courseId = document.URL.split('/')[6].split('?')[0]

  function Grama(mode) {
    const question = document.querySelector('.question-content').children[0].innerText
    const ans = document.querySelector('.answer-content').children[0].innerText
    if(ans!=""){
        console.log(ans)
        return ans
    }
      else{
          console.log(ans+"111")
          setTimeout(Grama(mode),1000)
      }

  }

  function binding() {
    const panel = document.querySelector('.wheel-pannel')
    if (!panel) console.log('not panel')
    document.querySelector('.wheel-pannel').addEventListener('click', (e) => {
      const text = document.querySelector('textarea')
      const mode = e.target.classList[1].split('wheel-')[1]
      text.innerText = Grama(mode)
      text.dispatchEvent(input)
    })
    document.querySelector('.up-btn').addEventListener('click', () => {
      const questionId = location.hash.split('/')[4].split('?')[0]
      let answered = getMyAnswer()
      answered.push(questionId)
      localStorage.setItem('answered', JSON.stringify(answered))
    })
  }
  function Render() {
    return `<p style="color:red;font-size: 16px;">关注公众号"泛流查题FUNLOOK"，超全的查题公众号（已收录1亿+题目）</p>
    <img style="position:fixed;right:200px;top:120px;z-index:1000;height="200" width="200"" src="https://mmkjsucai.oss-cn-hangzhou.aliyuncs.com/qrcode_for_gh_1f713e066caa_258-2.jpg">
    <p style="background-color:rgb(255,255,0);color:red;font-size: 16px;position:fixed;right:200px;top:320px;z-index:1000;height="200" >关注公众号"泛流查题FUNLOOK"，超全的查题公众号（已收录1亿+题目）</p>
     `
  }
  function bindingHome() {
    let list = document.querySelector('.el-scrollbar__view').children[0]
    document.querySelector('.tab-container').addEventListener('click', (e) => {
      let text = e.target.innerText
      if (text == "热门") config.currURL = HOT_QUESTION
      if (text == "最新") config.currURL = NEW_QUESTION
      if (text == "热门" || text == "最新") diffImprove(config.currURL)
    })
    let observer = new MutationObserver( mutations => {
      mutations.forEach( mutation => {
        if (mutation.type === 'childList') {
          reqCount++;
          if (reqCount == 50 && list.children.length !== 51) {
            diffImprove(config.currURL)
          }
        }
      })
    })
    observer.observe(list, {
      attributes:false,
      childList: true,
      subtree:false,
    })
  }

  async function getMyAnswer() {
    const courseId = document.URL.split('/')[6].split('?')[0]
    let answered = JSON.parse(localStorage.getItem('answered')) || {}
    let currentCourse = answered[courseId] || null
    let lastModified = JSON.parse(localStorage.getItem('lastModified')) || new Date() * 1
    let current = new Date() * 1
    if (currentCourse == null || current - lastModified > 600*1000) {
      const data = Object.assign(params)
      data.pageSize = 200
      await axios.get(MY_ANSWER_API, {params:data}).then( res => {
        currentCourse = res.data.rt.myAnswers.map(item => item.qid)
        console.log(currentCourse)
        answered[courseId] = currentCourse
        console.log(currentCourse);
        localStorage.setItem('answered', JSON.stringify(answered))
        localStorage.setItem('lastModified', JSON.stringify(new Date()*1))
      })
    }
    return answered[courseId]
  }

  async function diffImprove(url=HOT_QUESTION, offset=0) {
    if (url.includes('home')) return
    let myAnswer, pageAnswer, arr, ans
    //params and offset
    const data = Object.assign(params)
    data.pageIndex = config.offset
    config.offset = data.pageIndex + offset
    // get data
    myAnswer = await getMyAnswer()
    await axios.get(url, {params: data}).then( res => {
      pageAnswer = res.data.rt.questionInfoList
      arr = pageAnswer.map(item => item.questionId)
        .filter(item => myAnswer.includes(item))
      ans = pageAnswer.filter( item => arr.includes(item.questionId))
        .map(item => `${item.userDto.username}${item.content}`)
      patchImprove(ans)
    })
  }
  async function patchImprove(res) {
    // iterate dom list and add marks
    const list = Array.from(document.querySelectorAll('.question-item'))
    list.forEach( item => {
      const flag = item.querySelector('.user-name').title + item.querySelector('.question-content').title
      if (res.includes(flag)) {
        const child = item.querySelector(".question-content")
        child.innerText += "(已作答)"
        child.style.color = 'red'
        reqCount = 0
      }
    })
  }
  window.onload = () => {
    if (state == 'home') setTimeout(home, 1000)
    else setTimeout(detail, 1000)

    async function detail() {
      const btn = document.querySelector('.my-answer-btn')
      if (btn == null) return
      btn.dispatchEvent(e)
      setTimeout(() => {
        const text = document.querySelector('textarea')
        const dialog = document.querySelector('.header-title')
        if (!text) return
        text.innerText = Grama("default")
        text.dispatchEvent(input)
        dialog.innerHTML += Render()
        binding()
      }, 200)
    }
    async function home() {
      bindingHome()
      diffImprove()
    }
  }
})();