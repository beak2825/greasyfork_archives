

// ==UserScript==
// @name         青年大学习自动报名
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  青年大学习自动报名,目前仅支持西北民族大学数学与计算机科学学院,我们学院只要报名成功即使不学习也不会被通报,基于这个规则,这个脚本只会报名,而不会去模拟学习视频
// @author       pytdong
// @match        *://*.bing.com/*
// @match        *://cn.bing.com/*
// @match        *://baidu.com/*
// @match        *://www.baidu.com/*
// @icon         https://gitee.com/pyccer/picture-bed/raw/master/pytdong-icon.jpg
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @connect      gsgqt.gov.cn
// @connect      gsgqt.gov.cn:8553
// @connect      gsgqt.gov.cn:*
// @connect      gsgqt.gov.cn:8553/qndxx-service/app/ysd/daxuexi/huodong/baoming
// @connect      www.gsgqt.gov.cn/gsgqt-admin/app/ysd/gsgqt/article/api?column=13&thumb=true&length=56
// @downloadURL https://update.greasyfork.org/scripts/492829/%E9%9D%92%E5%B9%B4%E5%A4%A7%E5%AD%A6%E4%B9%A0%E8%87%AA%E5%8A%A8%E6%8A%A5%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/492829/%E9%9D%92%E5%B9%B4%E5%A4%A7%E5%AD%A6%E4%B9%A0%E8%87%AA%E5%8A%A8%E6%8A%A5%E5%90%8D.meta.js
// ==/UserScript==




(function(){

  let qishu = 0; // 期数
  let isNull = JSON.parse(localStorage.getItem('isNull'))
  let prevQishu = localStorage.getItem('qishu') //上一次的期数
  prevQishu = prevQishu === null ? 0 : prevQishu
  
  const nowTimestamp = new Date() // 当前日期
  let prevTimestamp = localStorage.getItem('date')
  let xvehao = localStorage.getItem('xvehao');
  let isShow = false;
  
  let residue = getResidue()  // 下一次报名的时间
  
  function getResidue(){
    let residue =  86400000 - (new Date(nowTimestamp) - new Date(prevTimestamp))
    return (residue / (1000*3600)).toFixed(2)
  }
  
  
  const toEXE = document.createElement('button')
  const prevTime = document.createElement('span')
  const nextTime = document.createElement('span')
  const qishuEl = document.createElement('span')
  const controlEL = document.createElement("div")
  
  function createPage() {
    let style = document.createElement('style')
    let css = `.qingnian{
      position: absolute;
      z-index:9999;
      top: 10px;
      right: 10px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      text-align: center;
      line-height: 20px;
      cursor: pointer;
      border: 1px solid green;
      color: black;
    }
    .qingnian-control {
      position: absolute;
      z-index:9999;
      top: 50%;
      margin: 0 auto;
      left: 0;
      right: 0;
      display: none;
      flex-wrap: wrap;
      justify-content: center;
      width: 350px;
      padding: 10px 2px;
      border-radius: 10px;
      transform: translateY(-50%);
      background-color: rgb(203, 240, 182);
    }
    .channelEl{
      display: flex;
      flex-wrap: wrap;
      height: 100px;
      width: 100%;;
    }
    .channelEl .item {
      flex-grow: 1;
      width: 100%;
    }
    .xvehaodivEl {
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin-bottom: 10px;
    }
    .resetDiv {
      display: flex;
      justify-content: center;
      width: 100%;
      margin-top: 20px;
    }
    `
  
    style.textContent = css
    document.head.appendChild(style)
  
    const qishuDiv = document.createElement("div")
    const qndxxEl = document.createElement("div")
  
    const xvehaoDiv = document.createElement('div')
    const xvehaoSpan = document.createElement('span')
    const xvehaoText = document.createElement('span')
    const xvehaoDivEl = document.createElement('div')
    const tipEl = document.createElement('label')
    const qnInputEl = document.createElement("input")
    const xvehaoBtnEl = document.createElement('button')
  
    const channelEl = document.createElement('div')
    const prevDiv = document.createElement('div')
    const prevLearnSpan = document.createElement('span')
  
    const nextTimeDiv = document.createElement('div')
    const nextTimeSpan = document.createElement('span')
  
    const resetDiv = document.createElement('div')
    const resetEl = document.createElement('button')
  
  
  
      qishuEl.textContent = '上一次报名的期数:' + prevQishu
      qishuDiv.append(qishuEl)
      qishuDiv.classList.add('item')
      channelEl.append(qishuDiv)
  
      channelEl.classList.add('channelEl')
      prevLearnSpan.textContent = '上一次报名时间:'
      prevDiv.append(prevLearnSpan)
      prevDiv.append(prevTime)
      prevTime.textContent =prevTimestamp
      prevDiv.classList.add('item')
      channelEl.append(prevDiv)
  
      nextTimeDiv.append(nextTimeSpan)
      nextTimeSpan.textContent = "距离下一次自动报名还剩:"
      nextTimeDiv.append(nextTime)
      nextTime.textContent = residue + 'h' 
      channelEl.append(nextTimeDiv)
  
      xvehaoSpan.textContent = "当前学号："
      xvehaoDiv.append(xvehaoSpan)
      xvehaoDiv.classList.add('item')
      xvehaoDiv.append(xvehaoText)
      xvehaoText.textContent = xvehao
      channelEl.append(xvehaoDiv)
  
  
  
  
      qndxxEl.classList.add('qingnian')
      qndxxEl.textContent = "X"
  
      controlEL.classList.add('qingnian-control')
      controlEL.append(qndxxEl)
  
      qnInputEl.setAttribute('id','qnInput')
  
      tipEl.textContent = '更改学号：'
      tipEl.setAttribute('for','qnInput')
  
      xvehaoBtnEl.textContent = '确认更改'
  
      toEXE.textContent = '立即执行一次报名'
  
  
      resetEl.textContent = '重置报名时间和期数(关闭浏览器生效)'
      resetDiv.append(resetEl)
      resetDiv.classList.add('resetDiv')
  
  
      
      
  
  
  
  
  
      qndxxEl.addEventListener('click',function(){
        if(isShow===false){
          isShow = !isShow
          controlEL.style.display = 'flex'
        }else{
          isShow = !isShow
          controlEL.style.display = 'none'
        }
      })
  
      xvehaoBtnEl.addEventListener('click',function(event){
        let v = qnInputEl.value.trim()
        if(v.length>0){
          xvehao = v;
          xvehaoText.textContent = xvehao
          localStorage.setItem('xvehao',xvehao)
        }
      })
  
      toEXE.addEventListener('click',function(){
        toLearn()
      })
  
      resetEl.addEventListener('click',function(){
        localStorage.removeItem('date')
        localStorage.removeItem('qishu')
        prevQishu = 0
        prevTimestamp = null
        residue = getResidue()
        prevTime.textContent = ""
        nextTime.textContent = residue + 'h'
        qishuEl.textContent = '上一次报名的期数:' + prevQishu
      })
  
  
  
  
      document.body.append(controlEL)
  
      tipEl.append(qnInputEl)
      xvehaoDivEl.append(tipEl)
      xvehaoDivEl.append(xvehaoBtnEl)
      xvehaoDivEl.classList.add('xvehaodivEl')
      
  
      controlEL.append(channelEl)
      controlEL.append(xvehaoDivEl)
      controlEL.append(toEXE)
      controlEL.append(resetDiv)
  }
  
  
  async function fetchData(qs) {
    const res = await fetch(`https://gsgqt.gov.cn:8553/qndxx-service/app/ysd/daxuexi/huodong/baoming?nianfen=${nowTimestamp.getFullYear()}&qishu=${qs}&type=1`,{
      method: 'post',
      body: JSON.stringify({"qingniandaxuexi":{"xingming":xvehao,"cengjiId":"4974"}}),
      headers: {
        'Content-Type': 'application/json',
      },
      referrerPolicy: 'no-referrer',
      referrer: "",
      mode: 'cors',
    })
    return res
  }

  async function toLearn(auto) {
    toEXE.disabled = true
    console.log(nowTimestamp.getFullYear())
    await getQishu() // 获得期数
    const res = await fetchData(qishu)
    const rawData = await res.json()
    console.log(rawData)

    if(rawData.status === 500) { // 当前期数不存在
      localStorage.setItem('isNull',true)
      isNull = true
    }else if(rawData.status === 200) {
      localStorage.setItem('isNull',false)
      isNull = false
    }
  
    toEXE.disabled = false
  
  
    if(rawData.data.jieguo === '已经报名过了!') {
      if(auto != 'auto'){
        alert(`尝试通过${xvehao}报名第${qishu}期,但是已经报名过了`)
      }
      localStorage.setItem('qishu',qishu)
      localStorage.setItem('date',nowTimestamp.toLocaleString())
      return
    } else if( rawData.data.jieguo === '报名成功!'){
      localStorage.setItem('date',nowTimestamp.toLocaleString())
      localStorage.setItem('qishu', qishu)
      console.log('存储成功')
      alert(`${xvehao}报名第${qishu}期成功!`)
      prevTime.textContent = nowTimestamp.toLocaleString()
      prevTimestamp = nowTimestamp.toLocaleString()
      prevQishu = qishu
      residue = getResidue()
      nextTime.textContent = residue + 'h' 
      qishuEl.textContent = '上一次报名的期数:' + prevQishu
      return
    }
  
    alert('报名程序似乎除了点问题...')
    return
  }
  
  
  async function getQishu() {
    qishu = 0; //期数重置
    // 获得网络期数
    const res = await fetch("https://www.gsgqt.gov.cn/gsgqt-admin/app/ysd/gsgqt/article/api?column=13&thumb=true&length=56")
    const rawData = await res.json()
    const data = rawData.data.data
    for(let i=0;i<data.length;i++){
    const releaseDate = new Date(data[i]['releaseDate'])
    if(releaseDate.getFullYear()>=nowTimestamp.getFullYear()) {
      qishu += 1
      console.log(qishu)
    } else {
      console.log('isNull',isNull)
      if(!isNull) {
        qishu += 1
        console.log('+1',qishu)
      }
      break
    }
    }
    localStorage.setItem('qishu',qishu)
    return qishu
  }
  
  
  async function judge() {
    //判断是不是到了该报名的时候了
    await getQishu()
    if(qishu > prevQishu || residue <= 0) {
      if(residue <=0) {
        localStorage.setItem('isNull',false)
        isNull = false
      }
      await toLearn('auto')
    }
  }
  
  
  
  createPage()
  judge()
  
  
  
  
  let id=GM_registerMenuCommand ("管理青年大学习学习脚本", function(){
    controlEL.style.display = 'flex'
  }, "h");
  // 第三个参数 accessKey 为快捷键，输入h即可触发。本脚本在点击一次之后会将菜单删除。
  
  })()
  
  