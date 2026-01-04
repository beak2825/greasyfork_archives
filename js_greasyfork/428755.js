// ==UserScript==
// @name        Copy an Elephant
// @namespace   Frank Scripts
// @match       https://itsm.services.sap/*
// @match       https://sap.service-now.com*
// @grant       none
// @version     1.7.7
// @author      I544317
// @description 6/3/2021
// @run-at      document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/428755/Copy%20an%20Elephant.user.js
// @updateURL https://update.greasyfork.org/scripts/428755/Copy%20an%20Elephant.meta.js
// ==/UserScript==


/******/(() => { // webpackBootstrap
/******/ 	"use strict";
  let originalurl = ''
  let currenturl = ''
  const base = 'https://itsm.services.sap/now/workspace/agent/record'
  const home = 'https://itsm.services.sap/now/workspace/agent/home'
  let condition = ''
  let middle = ''
  let maindata = {}
  let firsttimer = 0
  let secondtimer = 0
  let notification = 0

  function removepopup (id) {
    document.body.removeChild(document.getElementById('msgbox'+id))
  }


  function shareUrl (sla, time, shift) {
                        let {url:share, compName:comname, levelEle:levelname, idNum:id, headertitle:title, assignment, processor} = maindata
                        let tag = document.createElement("textarea");
                        tag.setAttribute("id", "share_url"); 
                        let content = `Title: ${title}
SAP Case Number: ${id}
Assignment Group: ${assignment}
State: ${levelname.slice(4)}
Component: ${comname}
Processor: ${(processor == '' ? 'None' : processor).padEnd(15, ' ')}
Link: ${share}`
                        if (shift) {
                          tag.value = content
                        } else if (levelname.slice(4) === 'Very High' && sla == 'ORT') {
                          tag.value = `Hi ${processor}
The ORT(VH) on ${comname} remains ${time} left
-------------------------------------------------
` + content
                        } else if (levelname.slice(4) === 'Very High' && sla == 'IRT') {
                          tag.value = `The IRT(VH) on ${comname} remains ${time} left
-------------------------------------------------
` + content
                        } else if (levelname.slice(4) === 'Very High' && sla == 'APT') {
                          tag.value = `This APT(VH) on ${comname} remains ${time} left
-------------------------------------------------
` + content
                        } else if (levelname.slice(4) === 'Very High') {
                          tag.value = `This is an unassigned VH on ${comname}
-------------------------------------------------
` + content
                        } else if (sla) {
                          tag.value = `The ${sla} of ${comname} remains ${time} left
-------------------------------------------------
` + content
                        } else {
                          tag.value = content
                        }
                        document.getElementsByTagName("body")[0].appendChild(tag);
                        document.getElementById("share_url").select();
                        document.execCommand("copy");
                        document.getElementById("share_url").remove();
                      }

function onlyShare (sla, time, shift) {
                        console.log('this is for onlyshare')
                        let {url:share, compName:comname, levelEle:levelname, idNum:id, headertitle:title} = maindata
                        let tag = document.createElement("textarea");
                        tag.setAttribute("id", "share_url"); 
                        let content = `Title: ${title}
SAP Case Number: ${id}
State: ${levelname.slice(4)}
Component: ${comname}
Link: ${share}`
                        tag.value = content
                        document.getElementsByTagName("body")[0].appendChild(tag);
                        document.getElementById("share_url").select();
                        document.execCommand("copy");
                        document.getElementById("share_url").remove();
                      }


  function foremail (sla, time, handler) {
                        let {url:share, compName:comname, levelEle:levelname, idNum:id, headertitle:title, assignment, processor} = maindata
                        let tag = document.createElement("textarea");
                        tag.setAttribute("id", "share_url"); 

                        comname = comname.trim()
                        levelname = levelname.trim()
                        processor = processor.trim()
                        assignment = assignment.trim()
                        time = handler.includes('MPT')? 'None' : time 
                        let content = `Remaining time: ${time.padEnd(10, '  ')}| Component: ${comname.padEnd(15, '  ')} | Processor: ${(processor == '' ? 'None' : processor).padEnd(15, ' ')} | Assignment Group: ${assignment}     | SAP Case Number: ${id.padEnd()}
Link: ${share}`                       
                        tag.value = content
                        document.getElementsByTagName("body")[0].appendChild(tag);
                        document.getElementById("share_url").select();
                        document.execCommand("copy");
                        document.getElementById("share_url").remove();
                      }

  function createnode (id,content, color, hide) {
                      let box = document.createElement('p')
                      box.setAttribute('id', 'msgbox'+id)
                      box.style.width = '300px'
                      box.style.height = '57px'
                      box.style.top = '78px'
                      box.style.left = '50%'
                      box.style.borderRadius = '6px'
                      box.style.backgroundColor = color
                      box.style.position = 'absolute'
                      box.innerText = content
                      box.style.marginLeft = '-150px'
                      box.style.fontSize = '16px'
                      box.style.lineHeight = '57px'
                      box.style.textAlign = 'center'
                      box.style.fontWeight = 'bold'
                      box.style.opacity='0.6'
                      box.style.color = '#fff'
                      box.style.zIndex = ''+ id
                      box.style.opacity = 1
                      document.body.appendChild(box)
                      if (hide) {
                        setTimeout(()=>{removepopup(id)}, 2000)
                      } else {
                        return box
                      }
  }


  function scanstatus () {
    let className = document.querySelector("#inbox").shadowRoot.querySelector("button > div") == null ? 'available' : document.querySelector("#inbox").shadowRoot.querySelector("button > div").className
    if (className.includes('inactive') && secondtimer > 0) {
    } else if (className.includes('inactive') && notification === 0) {
                      let box = createnode('login','Remember to set your status available', 'red')
                      notification = 1
                      box.addEventListener('click', ()=>{
                        notification = 0
                        secondtimer = 1
                        removepopup('login')})
    } else if (className.includes('busy') || className.includes('available')) {
        if (notification == 1) {
          notification = 0
          removepopup('login')
        } else if (secondtimer > 0) {
          secondtimer = 0
        }
    }
  }


  function pollSLA(url, name, level , idnum , subtitle, org) {
    if(document.querySelector("body > sn-workspace-layout > sn-workspace-main > sn-workspace-content").shadowRoot.querySelector(condition).shadowRoot.querySelector("div > sn-form-internal-workspace-form-layout").shadowRoot.querySelector("form > sn-form-internal-header-layout")){
      let i = 1
      while (i>0) {
        middle = "#tid_"+i+"_tid_formlayout_header_layout_ribbon_container > sn-component-ribbon-container"
        if (document.querySelector("body > sn-workspace-layout > sn-workspace-main > sn-workspace-content").shadowRoot.querySelector(condition).shadowRoot.querySelector("div > sn-form-internal-workspace-form-layout").shadowRoot.querySelector("form > sn-form-internal-header-layout").shadowRoot.querySelector(middle)) {
          break
        } else {
          i++
        }
      }                                                                                                                                                                                                                                                                                                                                                                                        // .shadowRoot.querySelector("div > now-uxf-page-container > div > div > div.sn-ribbon-column.-col-2 > sn-component-workspace-sla")
      if (document.querySelector("body > sn-workspace-layout > sn-workspace-main > sn-workspace-content").shadowRoot.querySelector(condition).shadowRoot.querySelector("div > sn-form-internal-workspace-form-layout").shadowRoot.querySelector("form > sn-form-internal-header-layout").shadowRoot.querySelector(middle).shadowRoot) {
        if(document.querySelector("body > sn-workspace-layout > sn-workspace-main > sn-workspace-content").shadowRoot.querySelector(condition).shadowRoot.querySelector("div > sn-form-internal-workspace-form-layout").shadowRoot.querySelector("form > sn-form-internal-header-layout").shadowRoot.querySelector(middle).shadowRoot.querySelector("div > now-uxf-page-container > div > div > div.sn-ribbon-column.-col-2 > sn-component-workspace-sla")) {
          if (document.querySelector("body > sn-workspace-layout > sn-workspace-main > sn-workspace-content").shadowRoot.querySelector(condition).shadowRoot.querySelector("div > sn-form-internal-workspace-form-layout").shadowRoot.querySelector("form > sn-form-internal-header-layout").shadowRoot.querySelector(middle).shadowRoot.querySelector("div > now-uxf-page-container > div > div > div.sn-ribbon-column.-col-2 > sn-component-workspace-sla").shadowRoot.querySelector("div > div.sn-widget-header > div") && document.querySelector("body > sn-workspace-layout > sn-workspace-main > sn-workspace-content").shadowRoot.querySelector(condition).shadowRoot.querySelector("div > sn-form-internal-workspace-form-layout").shadowRoot.querySelector("form > sn-form-internal-header-layout").shadowRoot.querySelector(middle).shadowRoot.querySelector("div > now-uxf-page-container > div > div > div.sn-ribbon-column.-col-2 > sn-component-workspace-sla").shadowRoot.querySelector("div > div.sn-widget-header > div").innerText) {
            if (document.querySelector("body > sn-workspace-layout > sn-workspace-main > sn-workspace-content").shadowRoot.querySelector(condition).shadowRoot.querySelector("div > sn-form-internal-workspace-form-layout").shadowRoot.querySelector("form > sn-form-internal-header-layout").shadowRoot.querySelector(middle).shadowRoot.querySelector("div > now-uxf-page-container > div > div > div.sn-ribbon-column.-col-2 > sn-component-workspace-sla").shadowRoot.querySelector("div > div.sn-widget-body.snu-p-0 > div > div > div > div:nth-child(2) > span.sn-sla-time")) {
              
            let sla = document.querySelector("body > sn-workspace-layout > sn-workspace-main > sn-workspace-content").shadowRoot.querySelector(condition).shadowRoot.querySelector("div > sn-form-internal-workspace-form-layout").shadowRoot.querySelector("form > sn-form-internal-header-layout").shadowRoot.querySelector(middle).shadowRoot.querySelector("div > now-uxf-page-container > div > div > div.sn-ribbon-column.-col-2 > sn-component-workspace-sla").shadowRoot.querySelector("div > div.sn-widget-body.snu-p-0 > div > div > div > div:nth-child(2) > span.sn-sla-time").innerText
            let header = document.querySelector("body > sn-workspace-layout > sn-workspace-main > sn-workspace-content").shadowRoot.querySelector(condition).shadowRoot.querySelector("div > sn-form-internal-workspace-form-layout").shadowRoot.querySelector("form > sn-form-internal-header-layout").shadowRoot.querySelector(middle).shadowRoot.querySelector("div > now-uxf-page-container > div > div > div.sn-ribbon-column.-col-2 > sn-component-workspace-sla").shadowRoot.querySelector("div > div.sn-widget-header > div")
          let headerstring = header.innerText
          let notistring
          if (headerstring.includes('IRT')) {
            notistring = 'IRT'
          } else if (headerstring.includes('ORT')) {
            notistring = 'ORT'
          } else if (headerstring.includes('APT')) {
            notistring = 'APT'
          }
          let ele =   document.querySelector("body > sn-workspace-layout > sn-workspace-main > sn-workspace-content").shadowRoot.querySelector(condition).shadowRoot.querySelector("div > sn-form-internal-workspace-form-layout").shadowRoot.querySelector("form > sn-form-internal-header-layout").shadowRoot.querySelector("header > div.sn-header-layout-row > div:nth-child(1) > now-record-common-header").shadowRoot.querySelector("div > div > div > div:nth-child(1) > h1")
          header.addEventListener('dblclick', ()=>{
            shareUrl(notistring, sla)

            let box = createnode(firsttimer, 'SLA has been copied', '#3fc770', true)
          })
            ele.addEventListener('click', ()=>{
            foremail(notistring, sla, headerstring)

            let box = createnode(firsttimer, 'Short message is copied', '#e6a23c', true)
          })

            } else {
              setTimeout(pollSLA, 300)
            }
          } else {
            setTimeout(pollSLA, 300)
          }
        } else {
          setTimeout(pollSLA, 300)
        }
      } else {
        setTimeout(pollSLA, 300)
      }
    } else {
      setTimeout(pollSLA, 1000)
    }
  }


  function pollDOM() {
    let url = currenturl
    let id = url.slice(-32)
    condition = "#chrome-tab-panel-record_" + id + " > now-record-form-connected"
    let flag = 0
    let flag0 = 0
    let closedFlag = false
    let midEle1;
    let midEle2;
    if(document.querySelector("body > sn-workspace-layout > sn-workspace-main > sn-workspace-content") != null){
      if(document.querySelector("body > sn-workspace-layout > sn-workspace-main > sn-workspace-content").shadowRoot.querySelector(condition) != null){
        if(document.querySelector("body > sn-workspace-layout > sn-workspace-main > sn-workspace-content").shadowRoot.querySelector(condition).shadowRoot.querySelector("div > sn-form-internal-workspace-form-layout") != null){
          if(document.querySelector("body > sn-workspace-layout > sn-workspace-main > sn-workspace-content").shadowRoot.querySelector(condition).shadowRoot.querySelector("div > sn-form-internal-workspace-form-layout").shadowRoot.querySelector("form > sn-form-internal-header-layout") != null){
            if(document.querySelector("body > sn-workspace-layout > sn-workspace-main > sn-workspace-content").shadowRoot.querySelector(condition).shadowRoot.querySelector("div > sn-form-internal-workspace-form-layout").shadowRoot.querySelector("form > sn-form-internal-header-layout").shadowRoot.querySelector("header > div.sn-header-layout-row > div:nth-child(1) > now-record-common-header") != null){
              if(document.querySelector("body > sn-workspace-layout > sn-workspace-main > sn-workspace-content").shadowRoot.querySelector(condition).shadowRoot.querySelector("div > sn-form-internal-workspace-form-layout").shadowRoot.querySelector("form > sn-form-internal-header-layout").shadowRoot.querySelector("header > div.sn-header-layout-row > div:nth-child(1) > now-record-common-header").shadowRoot.querySelector("div > div > div > div:nth-child(2) > sn-form-internal-header-label-value-set") != null){
                let middlePart = document.querySelector("body > sn-workspace-layout > sn-workspace-main > sn-workspace-content").shadowRoot.querySelector(condition).shadowRoot.querySelector("div > sn-form-internal-workspace-form-layout").shadowRoot.querySelector("form > sn-form-internal-header-layout").shadowRoot.querySelector("header > div.sn-header-layout-row > div:nth-child(1) > now-record-common-header").shadowRoot.querySelector("div > div > div > div:nth-child(2) > sn-form-internal-header-label-value-set")
                if(middlePart.shadowRoot.querySelector("dl > sn-form-internal-header-label-value:nth-child(5)") != null || middlePart.shadowRoot.querySelector("dl > sn-form-internal-header-label-value:nth-child(6)") != null || middlePart.shadowRoot.querySelector("dl > sn-form-internal-header-label-value:nth-child(7)") != null){
                  if (middlePart.shadowRoot.querySelector("dl > sn-form-internal-header-label-value:nth-child(5)") != null) {
                    flag = 1
                  } else if (middlePart.shadowRoot.querySelector("dl > sn-form-internal-header-label-value:nth-child(6)") != null) {
                    flag = 2
                  } else {
                    flag = 3
                    closedFlag = true
                  }
                  flag0 = (document.querySelector("body > sn-workspace-layout > sn-workspace-main > sn-workspace-content").shadowRoot.querySelector(condition).shadowRoot.querySelector("div > sn-form-internal-workspace-form-layout").shadowRoot.querySelector("form > sn-form-internal-header-layout").shadowRoot.querySelector("header > div.sn-header-layout-row > div:nth-child(1) > now-record-common-header").shadowRoot.querySelector("div > div > div > div:nth-child(2) > sn-form-internal-header-label-value-set").shadowRoot.querySelector("dl > sn-form-internal-header-label-reference-value:nth-child(5)")) ? 3: 4
                  switch(flag){
                    case 1: midEle1 = middlePart.shadowRoot.querySelector("dl > sn-form-internal-header-label-value:nth-child(5)"); break;
                    case 2: midEle1 = middlePart.shadowRoot.querySelector("dl > sn-form-internal-header-label-value:nth-child(6)"); break;
                    case 3: midEle1 = middlePart.shadowRoot.querySelector("dl > sn-form-internal-header-label-value:nth-child(7)"); break;
                  }
                  switch(flag0){
                    case 3: midEle2 = document.querySelector("body > sn-workspace-layout > sn-workspace-main > sn-workspace-content").shadowRoot.querySelector(condition).shadowRoot.querySelector("div > sn-form-internal-workspace-form-layout").shadowRoot.querySelector("form > sn-form-internal-header-layout").shadowRoot.querySelector("header > div.sn-header-layout-row > div:nth-child(1) > now-record-common-header").shadowRoot.querySelector("div > div > div > div:nth-child(2) > sn-form-internal-header-label-value-set").shadowRoot.querySelector("dl > sn-form-internal-header-label-reference-value:nth-child(5)"); break;
                    case 4: midEle2 = document.querySelector("body > sn-workspace-layout > sn-workspace-main > sn-workspace-content").shadowRoot.querySelector(condition).shadowRoot.querySelector("div > sn-form-internal-workspace-form-layout").shadowRoot.querySelector("form > sn-form-internal-header-layout").shadowRoot.querySelector("header > div.sn-header-layout-row > div:nth-child(1) > now-record-common-header").shadowRoot.querySelector("div > div > div > div:nth-child(2) > sn-form-internal-header-label-value-set").shadowRoot.querySelector("dl > sn-form-internal-header-label-reference-value:nth-child(4)"); break;
                  }
                  if(midEle1.shadowRoot.querySelector("div > dd") != null && midEle2.shadowRoot.querySelector("div > dd > now-text-link") != null){
                    if(midEle2.shadowRoot.querySelector("div > dd > now-text-link").shadowRoot.querySelector("a")){
                      
                      let processor = ''
                      if (document.querySelector("body > sn-workspace-layout > sn-workspace-main > sn-workspace-content").shadowRoot.querySelector(condition).shadowRoot.querySelector("div > sn-form-internal-workspace-form-layout").shadowRoot.querySelector("form > sn-form-internal-header-layout").shadowRoot.querySelector("header > div.sn-header-layout-row > div:nth-child(1) > now-record-common-header").shadowRoot.querySelector("div > div > div > div:nth-child(2) > sn-form-internal-header-label-value-set").shadowRoot.querySelector("dl > sn-form-internal-header-label-reference-value:nth-child(5)")){
                        
                        if (document.querySelector("body > sn-workspace-layout > sn-workspace-main > sn-workspace-content").shadowRoot.querySelector(condition).shadowRoot.querySelector("div > sn-form-internal-workspace-form-layout").shadowRoot.querySelector("form > sn-form-internal-header-layout").shadowRoot.querySelector("header > div.sn-header-layout-row > div:nth-child(1) > now-record-common-header").shadowRoot.querySelector("div > div > div > div:nth-child(2) > sn-form-internal-header-label-value-set").shadowRoot.querySelector("dl > sn-form-internal-header-label-reference-value:nth-child(4)")){
                          let node = document.querySelector("body > sn-workspace-layout > sn-workspace-main > sn-workspace-content").shadowRoot.querySelector(condition).shadowRoot.querySelector("div > sn-form-internal-workspace-form-layout").shadowRoot.querySelector("form > sn-form-internal-header-layout").shadowRoot.querySelector("header > div.sn-header-layout-row > div:nth-child(1) > now-record-common-header").shadowRoot.querySelector("div > div > div > div:nth-child(2) > sn-form-internal-header-label-value-set").shadowRoot.querySelector("dl > sn-form-internal-header-label-reference-value:nth-child(4)").shadowRoot.querySelector("div > dd > now-text-link").shadowRoot.querySelector("a")
                          processor = node.innerText.slice(0, -10)
                        } else {
                          setTimeout(pollDOM, 300);
                        }
                      }

                      let ele =   document.querySelector("body > sn-workspace-layout > sn-workspace-main > sn-workspace-content").shadowRoot.querySelector(condition).shadowRoot.querySelector("div > sn-form-internal-workspace-form-layout").shadowRoot.querySelector("form > sn-form-internal-header-layout").shadowRoot.querySelector("header > div.sn-header-layout-row > div:nth-child(1) > now-record-common-header").shadowRoot.querySelector("div > div > div > div:nth-child(1) > h1")
                      let compEle = document.querySelector("body > sn-workspace-layout > sn-workspace-main > sn-workspace-content").shadowRoot.querySelector(condition).shadowRoot.querySelector("div > sn-form-internal-workspace-form-layout").shadowRoot.querySelector("form > sn-form-internal-header-layout").shadowRoot.querySelector("header > div.sn-header-layout-row > div:nth-child(1) > now-record-common-header").shadowRoot.querySelector("div > div > div > div:nth-child(2) > sn-form-internal-header-label-value-set")
                      
                      let compName = compEle.shadowRoot.querySelector("dl > sn-form-internal-header-label-reference-value:nth-child(3)") ? compEle.shadowRoot.querySelector("dl > sn-form-internal-header-label-reference-value:nth-child(3)").shadowRoot.querySelector("div > dd > now-text-link").shadowRoot.querySelector("a").innerText : compEle.shadowRoot.querySelector("dl > sn-form-internal-header-label-reference-value:nth-child(4)").shadowRoot.querySelector("div > dd > now-text-link").shadowRoot.querySelector("a").innerText
                      let levelEle = document.querySelector("body > sn-workspace-layout > sn-workspace-main > sn-workspace-content").shadowRoot.querySelector(condition).shadowRoot.querySelector("div > sn-form-internal-workspace-form-layout").shadowRoot.querySelector("form > sn-form-internal-header-layout").shadowRoot.querySelector("header > div.sn-header-layout-row > div:nth-child(1) > now-record-common-header").shadowRoot.querySelector("div > div > div > div:nth-child(2) > sn-form-internal-header-label-value-set").shadowRoot.querySelector("dl > sn-form-internal-header-label-highlighted-value").shadowRoot.querySelector("div > dd > now-highlighted-value").shadowRoot.querySelector("span > span > span").innerText
                      let idNum = midEle1.shadowRoot.querySelector("div > dd").innerText
                      let assignment = (flag0 == 4) ?  document.querySelector("body > sn-workspace-layout > sn-workspace-main > sn-workspace-content").shadowRoot.querySelector(condition).shadowRoot.querySelector("div > sn-form-internal-workspace-form-layout").shadowRoot.querySelector("form > sn-form-internal-header-layout").shadowRoot.querySelector("header > div.sn-header-layout-row > div:nth-child(1) > now-record-common-header").shadowRoot.querySelector("div > div > div > div:nth-child(2) > sn-form-internal-header-label-value-set").shadowRoot.querySelector("dl > sn-form-internal-header-label-reference-value:nth-child(4)").shadowRoot.querySelector("div > dd > now-text-link").shadowRoot.querySelector("a").innerText : document.querySelector("body > sn-workspace-layout > sn-workspace-main > sn-workspace-content").shadowRoot.querySelector(condition).shadowRoot.querySelector("div > sn-form-internal-workspace-form-layout").shadowRoot.querySelector("form > sn-form-internal-header-layout").shadowRoot.querySelector("header > div.sn-header-layout-row > div:nth-child(1) > now-record-common-header").shadowRoot.querySelector("div > div > div > div:nth-child(2) > sn-form-internal-header-label-value-set").shadowRoot.querySelector("dl > sn-form-internal-header-label-reference-value:nth-child(5)").shadowRoot.querySelector("div > dd > now-text-link").shadowRoot.querySelector("a").innerText
                      let headertitle = ele.innerText
                      maindata = {url, compName, levelEle, idNum, headertitle, assignment, processor}
                      ele.title = headertitle
                      ele.addEventListener('dblclick', function(){
                        if (closedFlag) {
                          onlyShare('','',1)
                        } else {
                          shareUrl('','',1)
                        }
                        createnode(firsttimer, 'Copied to clipboard', '#0081AB', true)
                      })
                      pollSLA()
                    } else {
                      setTimeout(pollDOM, 300);
                    }
             
      } else {
    setTimeout(pollDOM, 300);
  }              
     } else {
    setTimeout(pollDOM, 300);
  }
                } else {
    setTimeout(pollDOM, 300);
  }
              } else {
    setTimeout(pollDOM, 300);
  }
            } else {
    setTimeout(pollDOM, 300);
  }
          } else {
    setTimeout(pollDOM, 300);
  }
        } else {
    setTimeout(pollDOM, 300);
  }
    } else {
    setTimeout(pollDOM, 300);
  }
}
  

  setInterval(()=>{
		currenturl = location.href
		if(originalurl != currenturl && currenturl.startsWith(base)) {
			originalurl = currenturl
			pollDOM()
		}
    if (firsttimer % 3 === 0) {
      scanstatus()
    } else if (firsttimer > 10000) {
      firsttimer = 1
    }

    if (secondtimer > 0 && secondtimer < 3600) {
      secondtimer++
    } else {
      secondtimer = 0
    }
    firsttimer++
  }, 1000)
  
  /******/ })()