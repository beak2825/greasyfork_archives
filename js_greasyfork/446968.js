// ==UserScript==
// @name         91huayi
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        http://cme23.91huayi.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=91huayi.com
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446968/91huayi.user.js
// @updateURL https://update.greasyfork.org/scripts/446968/91huayi.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const isWatching = window.location.pathname === "/course_ware/course_ware_polyv.aspx";
  const isTesting = window.location.pathname === "/pages/exam.aspx"
  const isResult = window.location.pathname === '/pages/exam_result.aspx'

  const allCourse = ['http://cme23.91huayi.com/course_ware/course_ware.aspx?cwid=9be362b6-2fde-4b75-9770-ae8e010d9ebc', 'http://cme23.91huayi.com/course_ware/course_ware.aspx?cwid=5e2264e6-748f-428f-934d-ae8d0156fff9', 'http://cme23.91huayi.com/course_ware/course_ware.aspx?cwid=2f1f5ef1-8966-4c2e-acda-ae8d0156fff9', 'http://cme23.91huayi.com/course_ware/course_ware.aspx?cwid=48e195b0-1280-43f4-baa3-ae8d0156fff9', 'http://cme23.91huayi.com/course_ware/course_ware.aspx?cwid=4a67b92f-2df2-4eb4-bc7c-ae8d0156fff9', 'http://cme23.91huayi.com/course_ware/course_ware.aspx?cwid=89bafb6b-339d-4f3f-8d6a-ae8d01574de3', 'http://cme23.91huayi.com/course_ware/course_ware.aspx?cwid=c393d570-f550-46da-813f-ae8d01574de3', 'http://cme23.91huayi.com/course_ware/course_ware.aspx?cwid=cfe8a18f-8140-4f60-ade6-ae8d01574de3', 'http://cme23.91huayi.com/course_ware/course_ware.aspx?cwid=07c0ebb0-6335-4670-af51-ae8e00d10831', 'http://cme23.91huayi.com/course_ware/course_ware.aspx?cwid=e5fc1168-b4bc-4c3c-acb8-ae8e00d11c0c', 'http://cme23.91huayi.com/course_ware/course_ware.aspx?cwid=733b3ee6-4523-4133-a587-ae8e00d12da6', 'http://cme23.91huayi.com/course_ware/course_ware.aspx?cwid=4bd3ae92-2019-4171-893f-ae8e00d14c7e', 'http://cme23.91huayi.com/course_ware/course_ware.aspx?cwid=a0fbfba8-21a5-4b69-aa2d-ae8e00d15bc3', 'http://cme23.91huayi.com/course_ware/course_ware.aspx?cwid=cb933f91-5e9c-43dc-a5af-ae8e00d16cf7', 'http://cme23.91huayi.com/course_ware/course_ware.aspx?cwid=aa9c36a6-a354-4100-a7fe-ae8e00d17d6f', 'http://cme23.91huayi.com/course_ware/course_ware.aspx?cwid=bfaf6a4c-65f3-4976-96d2-ae8e00d18b9d', 'http://cme23.91huayi.com/course_ware/course_ware.aspx?cwid=959e45fd-38f7-45a9-9580-ae8e00d19a04', 'http://cme23.91huayi.com/course_ware/course_ware.aspx?cwid=8635cd07-ea7d-401a-938d-ae8e00d1b454', 'http://cme23.91huayi.com/course_ware/course_ware.aspx?cwid=9ac29ca4-e638-4a3d-bd31-ae8e00dd3ac2', 'http://cme23.91huayi.com/course_ware/course_ware.aspx?cwid=0847dd0f-7c05-4a54-ab37-ae8e00dd5743', 'http://cme23.91huayi.com/course_ware/course_ware.aspx?cwid=147e4ae3-a220-42ce-a0dc-ae8e00dd5743', 'http://cme23.91huayi.com/course_ware/course_ware.aspx?cwid=d7417530-b67b-4670-a6a2-ae8e00dd45f4', 'http://cme23.91huayi.com/course_ware/course_ware.aspx?cwid=b5b50fdb-20c4-4656-a044-ae8e00dd3ac2', 'http://cme23.91huayi.com/course_ware/course_ware.aspx?cwid=4cdd1cf3-e5e3-408b-b492-ae8e00dd5743', 'http://cme23.91huayi.com/course_ware/course_ware.aspx?cwid=1aab8e2a-2b9d-4eb2-830f-ae8e00dd2f09', 'http://cme23.91huayi.com/course_ware/course_ware.aspx?cwid=21049461-3e9a-4141-a7b1-ae8e00dd3ac2', 'http://cme23.91huayi.com/course_ware/course_ware.aspx?cwid=65d84ace-92db-4271-89a7-ae8e00dd5743', 'http://cme23.91huayi.com/course_ware/course_ware.aspx?cwid=0d7f78aa-2691-4517-a7ce-ae8e00dd2f09', 'http://cme23.91huayi.com/course_ware/course_ware.aspx?cwid=b0bd1279-17d6-488a-a41a-ae8e00dd2f09', 'http://cme23.91huayi.com/course_ware/course_ware.aspx?cwid=a096a404-7859-4d39-bae7-ae8e00dd3ac2', 'http://cme23.91huayi.com/course_ware/course_ware.aspx?cwid=95f435ab-6e14-4082-8cb2-ae8e00dd2f09', 'http://cme23.91huayi.com/course_ware/course_ware.aspx?cwid=8fcf83c5-78c2-4a9b-bee0-ae8e00dd2f09']

  const sleep = (time = 1000) => new Promise(resolve => setTimeout(resolve, time))
  const isNil = target => target === undefined || target === null
  const request = async (url) => {
    const response = await fetch(url, {mode: 'cors', credential: 'include'})
    const resData = await response.json()
    return resData.body
  }
  let answer
  const getAnswer = async () => {
      answer = await request(`http://cme23.91huayi.com/ashx/get_course_ware_process.ashx?relation_id=${cwrid}&video_type=polyv`);
      console.log('answeer', answer)
  }



  const goToNext = async () => {
    const curIndex = allCourse.findIndex(i => i.includes(window.location.search))
    if (curIndex < 0) {
      return
    }
    window.open(allCourse[curIndex + 1])
    await sleep()
    window.close()
  }

  const doTest = async () => {
    console.log('beep --', )
    const completed = document.getElementsByClassName('pv-progress-current-bg')[0].style.width == '100%'
    if (completed) {
      localStorage.setItem('answer', window.JSON.stringify(answer))
      document.getElementById('jrks').click()
      return
    }
    const popupContainer = document.getElementsByClassName('pv-ask-modal')[0]
    if (!popupContainer) {
      return
    }
    const innerText = popupContainer.innerText
    const answerItem = answer.find(i => innerText.includes(i?.question) )
    console.log('answerItem',answerItem)
    const rightIndex = answerItem?.choices.findIndex(i => i?.right_answer == 1)
    console.log('rightIndex',rightIndex)
    popupContainer.getElementsByClassName('pv-ask-form')[rightIndex].getElementsByTagName('input')[0].click()
    await sleep()
    popupContainer.getElementsByClassName('pv-ask-submit')[0].click()
    await sleep()
    document.querySelectorAll('.pv-ask-foot .pv-ask-default')[0].click()
    
  }

  if (isWatching) {
    localStorage.setItem('answerList', '[]')
    getAnswer()
    setInterval(doTest, 5000)
  }

  const isOdd = num => num % 2 === 1
  const getNext = (lastTry, choice) => {
    const lastTryList = lastTry.split('')
    const [first, ...rest] = lastTryList
    if (Number(first) == choice[0] && lastTryList.length == 1) {
      console.log('last', [choice.slice(-1) - 1])
      return [choice.slice(-1) - 1]
    }
    if (Number(first) == choice[0] - 1) {
      console.log('first but will add', [choice.slice(-1) - 1])
      return [0, ...getNext(rest.join(''), choice.slice(1))]
    } else {
      console.log('first not  add', [first - 0 + 1, ...rest.map(i => i - 0)])
      return [first - 0 + 1, ...rest.map(i => i - 0)]
    }
  }
  const doExam = async() => {
    const answerList =  window.JSON.parse(localStorage.getItem('answerList') || '[]')
    // const choice = answerList.choice || {}

    
    const questionTable = Array.from(document.getElementById('gvQuestion').getElementsByTagName('table'))

    // const lastTry = answerList.lastTry || '0'.repeat(questionTable.length / 2)

    questionTable.forEach((table, index) => {
      if (isOdd(index)) {
        return
      }
      if (answerList.length !== questionTable.length / 2) {
        answerList.push({
          name: table.innerText.slice(2),
          length: questionTable[index + 1].getElementsByTagName('input').length
        })
      }
    })
    console.log('answerList',answerList)
    
    // console.log('lastlist', lastlist, 'lastChoice', lastChoice, 'thisTry', thisTry)
    answerList.forEach((e, i) => {
      let newtry = isNil(e.rightAnswer) ? (isNil(e.lastTry) ? 0 : parseInt(e.lastTry) + 1) : parseInt(e.rightAnswer)
      console.log('newtry', newtry)
      e.lastTry = newtry
    })

    questionTable.forEach((table, index) => {
      if (isOdd(index)) {
        const question = questionTable[index - 1].innerText.slice(2)
        const tryAnswer = answerList.find(e => e?.name === question)
        table.getElementsByTagName('input')[tryAnswer.lastTry - 0].click()
      }

    })

    localStorage.setItem('answerList', window.JSON.stringify(answerList))
    await sleep(10000)
    document.getElementById('btn_submit').click()

    // goToNext()
  }

  const reTry = async () => {
    await sleep(3000)
    if (document.getElementsByClassName('case4')[0].innerText.includes('没过')) {
      const wrongList = Array.from(document.querySelectorAll('dd')).map(i => i.innerText.slice(2, 15))
      const answerList =  window.JSON.parse(localStorage.getItem('answerList') || '[]')
      answerList.forEach(item => {
        if (wrongList.every(worng => !item.name.includes(worng))) {
          item.rightAnswer = item.lastTry
          console.log(item.name, ' right')
        }
      })
      localStorage.setItem('answerList', window.JSON.stringify(answerList))
      await sleep()
      document.getElementsByClassName('bule')[0].click()
    }
  }
  if (isTesting ) {
    doExam()
  }
  if (isResult) {
    reTry()
  }

})();