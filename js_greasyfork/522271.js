// ==UserScript==
// @name        辅导员自动评价 jlu.edu.cn
// @namespace   https://github.com/rikacelery
// @match       https://zhxg.jlu.edu.cn/xg/fdykhStdApply/toAdd*
// @grant       GM_addStyle
// @license     MIT
// @compatible  chrome
// @version     0.0.1
// @author      RikaCelery
// @supportURL  https://github.com/RikaCelery/UserScriptSupport/issues
// @description 12/30/2024, 11:32:43 AM
// @downloadURL https://update.greasyfork.org/scripts/522271/%E8%BE%85%E5%AF%BC%E5%91%98%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BB%B7%20jlueducn.user.js
// @updateURL https://update.greasyfork.org/scripts/522271/%E8%BE%85%E5%AF%BC%E5%91%98%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BB%B7%20jlueducn.meta.js
// ==/UserScript==
// usage example
function addEventListenerAll(target, listener, ...otherArguments) {

    // install listeners for all natively triggered events
    for (const key in target) {
        if (/^on/.test(key)) {
            const eventType = key.substr(2);
            target.addEventListener(eventType, listener, ...otherArguments);
        }
    }

    // dynamically install listeners for all manually triggered events, just-in-time before they're dispatched ;D
    const dispatchEvent_original = EventTarget.prototype.dispatchEvent;
    function dispatchEvent(event) {
        target.addEventListener(event.type, listener, ...otherArguments);  // multiple identical listeners are automatically discarded
        dispatchEvent_original.apply(this, arguments);
    }
    EventTarget.prototype.dispatchEvent = dispatchEvent;
    if (EventTarget.prototype.dispatchEvent !== dispatchEvent) throw new Error(`Browser is smarter than you think!`);

}


// usage example
addEventListenerAll(window, (evt) => {
    if(evt.type=="message") return
    if(evt.type=="pageshow") {
    }
    console.log(evt.type,evt);
});

var reqeat = setInterval(()=>{
const questions = document.querySelectorAll(".question")
if(questions.length==0)return
console.log(questions)
questions.forEach(q=>{
  const options =[...q.querySelectorAll("label")]
  let bestOption = options.filter(v=>Math.random()>0.5?v.textContent.replace(/[ABCDE]\./,"")=="满意":v.textContent.replace(/[ABCDE]\./,"")=="非常满意")[0]
  if(bestOption==null)
    bestOption = options.filter(v=>v.textContent.replace(/[ABCDE]\./,"")=="基本满意")[0]
  if(bestOption==null)
    bestOption = options.filter(v=>v.textContent.replace(/[ABCDE]\./,"")=="非常满意")[0]
  if(bestOption==null)
    bestOption = options[0]

  console.log(options,bestOption)
  bestOption.click()
})
  document.querySelector(".submit_div button").click()
  clearInterval(reqeat)
},1000)

