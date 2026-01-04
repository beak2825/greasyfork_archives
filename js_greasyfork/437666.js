// ==UserScript==
// @name         Omegle simple bot
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A bot in the smallest form
// @author       Moodyzoo
// @match        https://www.omegle.com/
// @icon         https://www.google.com/s2/favicons?domain=omegle.com
// @license GNU
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437666/Omegle%20simple%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/437666/Omegle%20simple%20bot.meta.js
// ==/UserScript==

//Change this to your message

document.message = "hi";

//you can change this if u want

document.startCmd = "go";


//code starts here... not much more than that

function go()
{
    let btn = document.querySelector('.disconnectbtn')
  let messageBox = document.querySelector('.chatmsg')
  let sendBtn = document.querySelector('.sendbtn')
  messageBox.value = document.message
  sendBtn.click()
  setTimeout(() => {
      btn.click()
      btn.click()
      setTimeout(() => {
          go()
      },1500)
  },500)
}

var goI = setInterval(() => {
    let btn = document.querySelector('.disconnectbtn')
  let messageBox = document.querySelector('.chatmsg')
  let sendBtn = document.querySelector('.sendbtn')
    if(messageBox.value == document.startCmd){
     go()
        clearInterval(goI)
    }
},100)
