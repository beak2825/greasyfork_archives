// ==UserScript==
// @name        [pc版评教]jlu新教务评教
// @namespace   Celery Scripts
// @match https://vpn.jlu.edu.cn/https/44696469646131313237446964696461a37dea690fddaa03c915ed60c22b90f65b77cc30/index.html*#/my-task/answer/zkd/UnFinished*
// @match https://ievaluate.jlu.edu.cn/index.html*
// @grant       none
// @license     MIT
// @version     0.1.4
// @author      C了瑞
// @description 全自动评教（好评），自动下一门课
// @downloadURL https://update.greasyfork.org/scripts/491943/%5Bpc%E7%89%88%E8%AF%84%E6%95%99%5Djlu%E6%96%B0%E6%95%99%E5%8A%A1%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/491943/%5Bpc%E7%89%88%E8%AF%84%E6%95%99%5Djlu%E6%96%B0%E6%95%99%E5%8A%A1%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==


function main() {

  var taskName = document.querySelector('.TaskDetails_name-3pKay')?.textContent
  if(taskName&&(taskName.length==0||/自评|互评/.test(taskName))){
    alert('监测到关键词或评价名称为空，已终止自动评教')
    return
  }

  var submit = document.querySelector('button.ant-btn.index_submit-2EYSG.ant-btn-primary')
  var next = document.querySelector('.AnswerFinalEvaluateZGKXJSDXCustomization_task_desc_wrap-3_pCj button')
  var quizEls = [...document.querySelectorAll('.index_subject-P6UbM')]
  var titleEls = quizEls.map(e => { return (e.querySelector('.index_title-E5R_I')) })
  var answers = quizEls.map(e => e.querySelectorAll('.ant-radio-group > div'))
  console.log(quizEls)
  var quizs = quizEls.map(e => {
    let nn = e.querySelector('.index_title-E5R_I').textContent.replaceAll(/\s|\n/g, '')
    let answersMapper=(answer,type)=>{
      switch (type) {
        case "单选题":
          return {
            el:answer,
            text:answer.textContent.replaceAll(/[^\d]/g,'')
          }
          break;

        default:
          return
          return {
            el:answer,
            text:""
          }
          break;
      }
    }
    let type = (/\((\S+)\)$/.exec(nn)) ? (/\((\S+)\)$/.exec(nn))[1] : ""
    return {
      el: e,
      name: nn,
      isMust: /^\*/.test(nn),
      type: type,
      answers: [...e.querySelectorAll('.ant-radio-group > div > label')].map(v=>answersMapper(v,type))
    }
  })

  quizs.forEach(q => {
    if(q.isMust){
      q.answers.sort((a,b)=>{
        return a.text > b.text
      })
      let select = q.answers[Math.round(Math.random()*2)].el
      select.click()
      console.log(select,select.textContent)
    }
    console.log(q.name, q.isMust, q.type, q.answers.map(a => a.text))
  })

  submit.click()
  // next.click()

}


// 监听目标元素
const targetElement = document.body;

// 监听器配置
const observerConfig = { attributes: true, childList: true, subtree: true };

// 创建 MutationObserver 实例
const observer = new MutationObserver((mutationsList, observer) => {
  for (const mutation of mutationsList) {
    console.log(mutation.type,mutation.target,mutation.addedNodes[0],mutation)
    if (mutation.type === 'childList') {
      if (mutation.target.classList.contains('evaluate')
          ||mutation.addedNodes[0]?.classList?.contains("index_submitContext-2sWC_")) {
        console.log('body appeared!');
        // 在这里执行你的操作
        setTimeout(main, 200)
      }
    }
    const nextel = document.querySelector('body > div:nth-child(22) > div > div.ant-modal-wrap > div > div.ant-modal-content > div > div > div > button.ant-btn.ant-btn-primary')
    if(nextel&&nextel.textContent=='下一门课程')
      nextel.click()
  }
});

// 开始监视目标元素
observer.observe(targetElement, observerConfig);