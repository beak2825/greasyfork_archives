// ==UserScript==
// @name         Neopets: Personal assistant
// @author       Tombaugh Regio
// @version      1.0
// @description  Keeps track of timed tasks so that you don't have to
// @namespace    https://greasyfork.org/users/780470
// @match        *://www.neopets.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM.openInTab
// @downloadURL https://update.greasyfork.org/scripts/431654/Neopets%3A%20Personal%20assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/431654/Neopets%3A%20Personal%20assistant.meta.js
// ==/UserScript==

//====================================

//Include links for tasks you want to keep track of
const LINKS = [
  {
    task: "healingSpring",
    confirm: "visit the Healing Springs",
    link: "http://www.neopets.com/faerieland/springs.phtml"
  },
  {
    task: "buriedTeasure",
    confirm: "search for buried treasure",
    link: "http://www.neopets.com/pirates/buriedtreasure/index.phtml"
  },
  {
    task: "strengthTest",
    confirm: "test your strength",
    link: "http://www.neopets.com/halloween/strtest/process_strtest.phtml"
  },
  {
    task: "meteorCrash",
    confirm: "visit the meteor crash site",
    link: "http://www.neopets.com/moon/meteor.phtml"
  },
  {
    task: "wheelExcitement",
    confirm: "spin the Wheel of Excitement",
    link: "http://www.neopets.com/faerieland/wheel.phtml"
  },
  {
    task: "wheelMediocrity",
    confirm: "spin the Wheel of Mediocrity",
    link: "http://www.neopets.com/prehistoric/mediocrity.phtml"
  },
  {
    task: "wheelMisfortune",
    confirm: "spin the Wheel of Misfortune",
    link: "http://www.neopets.com/halloween/wheel/index.phtml"
  },
  {
    task: "wheelMisfortune",
    confirm: "spin the Wheel of Misfortune",
    link: "http://www.neopets.com/halloween/wheel/index.phtml"
  },
  {
    task: "scratchcard",
    confirm: "buy Deserted Fairground Scratchcards",
    link: "http://www.neopets.com/halloween/scratch.phtml"
  },
  {
    task: "graveDanger",
    confirm: "visit the Catacombs",
    link: "http://www.neopets.com/halloween/gravedanger/index.phtml"
  },
  {
    task: "snowager",
    confirm: "sneak into the Snowager's lair",
    link: "http://www.neopets.com/winter/snowager.phtml"
  }
]

//====================================

//Get time in your timezone
const now = new Date()

//Get time in NST
let nstHour
if (document.querySelector("#nst")) {
  const [
    hourText, 
    minuteText, 
    secondText, 
    amPM
  ] = document.querySelector("#nst").textContent.match(/\d{1,2}|[ap]m/g)

  nstHour = parseInt(hourText) 
  nstHour += (amPM == "pm") ? 12 : 0
  
  GM_setValue("nstHour", nstHour)
}

//Time constants
const TIME_IN = {
  seconds: 1000,
  minutes: 60000,
  hours: 3600000
}


//Get deadline tasks and times
const DEADLINES = []
if (GM_getValue("DEADLINES")) {
  DEADLINES.push(...JSON.parse(GM_getValue("DEADLINES")))
}

const URL = document.URL

function setNewTime(addTime) {
  return new Date(now.getTime() + addTime)
}

function setSnowagerTime() {
  const nstHour = GM_getValue("nstHour")
  const nextSnowagerHour = Math.floor(nstHour / 8) * 8 + 6 + (now.getHours() - nstHour)
  const nextSnowagerDay = new Date(now.setDate(now.getDate() + Math.floor((now.getHours() + nstHour)/24)))

  return new Date(
    nextSnowagerDay.getFullYear(), 
    nextSnowagerDay.getMonth(), 
    nextSnowagerDay.getDate(), 
    nextSnowagerHour % 24,
    0
  )
}

function setDeadline(task, time) {
  let isNew = true
  
  //If task exists, update the time
  for (const deadline of DEADLINES) {
    if (deadline.task == task) {
      deadline.time = time
      isNew = false
    }
  }
  
  //If not, push a new deadline entry
  if (isNew) {
    DEADLINES.push({task: task, time: time})
  }
  
  //Set GM values
  GM_setValue("DEADLINES", JSON.stringify(DEADLINES))
}

function checkDeadlines() { 
  const snowagerHour = setSnowagerTime()
  
  for (const deadline of DEADLINES) {
    const deadlineTime = new Date(deadline.time)
    const isSnowagerOrTurmaculus = (deadline.task == "snowager" || deadline.task == "turmaculus")

    //If the Snowager deadline has passed, update to the next one
    if (deadline.task == "snowager"
        && deadlineTime > snowagerHour
       ) {
      setDeadline("snowager", snowagerHour)
    }
    
    //If now is later than the deadline, prompt the user
    if (!isSnowagerOrTurmaculus && now > deadlineTime
        
        //Or, if the task is Snowager, or Turmaculus, within an hour past the deadline
        || isSnowagerOrTurmaculus
        && now > deadlineTime 
        && now < new Date(deadlineTime.getTime() + TIME_IN.hours)
        && !URL.includes("winter/snowager.phtml")
       ) {
      for (const goTo of LINKS) {
        if (goTo.task == deadline.task) {
          //Add some time to stop repeated pop-ups
          if (!isSnowagerOrTurmaculus) setDeadline(deadline.task, setNewTime(10 * TIME_IN.minutes))
          if (deadline.task == "snowager") setDeadline(deadline.task, setNewTime(TIME_IN.hours))
          if (deadline.task == "turmaculus") setDeadline(deadline.task, setNewTime(12 * TIME_IN.hours))

          //If yes, go to link
          if (confirm(`Do you want to ${goTo.confirm}?`)) {
            GM.openInTab(goTo.link)
          }
        }
      }
    }
  }
}

function whenWindowHasFocus(yourFunction) {
  function checkFocus() {
   return document.hasFocus()
  }

  window.onfocus = checkFocus
  window.onblur = checkFocus  
  
  if (checkFocus()) yourFunction()
  setTimeout(() => whenWindowHasFocus(yourFunction), 5 * TIME_IN.minutes)
}

//Healing Springs
if (URL.includes("springs.phtml") 
    && document
    .querySelector(".button-default__2020.button-yellow__2020.btn-single__2020")
    .textContent == "Leave the Healing Springs"
    && !document.querySelector("#container__2020").textContent.includes("Sorry!")
   ) {
  setDeadline("healingSpring", setNewTime(30 * TIME_IN.minutes))
}

//Treasure of the Black Pawkeet 
if (URL.includes("buriedtreasure/buriedtreasure.phtml")) {
  //If time is not up yet
  if (document.querySelector(".content").textContent.includes("Sorry")) {
    const minutes = parseInt(document.querySelector(".content center").textContent.match(/\d+/)[0])    
    setDeadline("buriedTeasure", setNewTime(minutes * TIME_IN.minutes))
    
  } else if (document.querySelector(".content").textContent.includes("pulls out a ticket")) {
    //After successfully playing
    setDeadline("buriedTeasure", setNewTime(3 * TIME_IN.hours))
  }
}

//Strength Test
if (URL.includes("strtest") 
    && !document.body.textContent.includes("Oops")
   ) {  
  setDeadline("strengthTest", setNewTime(6 * TIME_IN.hours))
}

//Meteor Crash Site 725-XZ
if (URL.includes("meteor.phtml")) {
  if (document.textContent.includes("The meteor has cracked open and a small object falls out")) {
    const tomorrow = new Date(now.setDate(now.getDate() + 1))
    setDeadline("meteorCrash", newDate(
      tomorrow.getFullYear(), 
      tomorrow.getMonth(), 
      tomorrow.getDate(), 
      0,
      0
    ))
  } else {
    //FIX (Add onclick to button)
    setDeadline("meteorCrash", setNewTime(TIME_IN.hours))
  }
}

//Wheel of Excitement
if (URL.includes("faerieland/wheel.phtml") 
    && !document.body.textContent.includes("return again later")
   ) {  
  setDeadline("wheelExcitement", setNewTime(2 * TIME_IN.hours))
}

//Wheel of Mediocrity
if (URL.includes("mediocrity.phtml") 
    && !document.body.textContent.includes("you can't spin right now")
   ) {  
  setDeadline("wheelMediocrity", setNewTime(40 * TIME_IN.minutes))
}

//Wheel of Misfortune
if (URL.includes("halloween/wheel") 
    && !document.body.textContent.includes("Come back later")
   ) {  
  setDeadline("wheelMisfortune", setNewTime(2 * TIME_IN.hours))
}

//Deserted Fairground Scratchcards
if (URL.includes("halloween/scratch.phtml?bought=")) {  
  setDeadline("scratchcard", setNewTime(2 * TIME_IN.hours))
}

//Happy Valley Scratchcard Kiosk
if (URL.includes("winter/process_kiosk.phtml") 
    && !document.body.textContent.includes("give everybody else a chance")
   ) {  
  setDeadline("scratchcard", setNewTime(6 * TIME_IN.hours))
}

//Grave Danger
if (URL.includes("gravedanger")) {
  
  function getGDTime() {
    if (document.querySelector("#gdRemaining").textContent != "...") {
      //Get remaining adventuring time
      const [hoursText, minutesText] = document
        .querySelector("#gdRemaining")
        .textContent
        .match(/\d+/g)

      //Set the new deadline time      
      const deadlineMinute = now.getMinutes()
        + parseInt(minutesText)
      
      const deadlineHour = now.getHours() 
        + parseInt(hoursText) 
        + Math.floor(deadlineMinute / 60)

      const deadlineDay = new Date(
        now.setDate(now.getDate() 
          + Math.floor(deadlineHour / 24))
      )
      
      const gdTime = new Date(
        deadlineDay.getFullYear(), 
        deadlineDay.getMonth(), 
        deadlineDay.getDate(), 
        deadlineHour % 24, 
        deadlineMinute % 60
      )

      setDeadline("graveDanger", gdTime)

      //Refresh if the time doesn't appear
    } else window.setTimeout(getGDTime, 100)
  }  
  
  getGDTime() 
}

//Turmaculus tracking page
if (URL.includes("~Brownhownd")) {
  const duTexts = document
    .querySelector('a[name="DU"]')
    .parentNode
    .parentNode
    .querySelectorAll("font.title")[1]
    .childNodes
  
  for (const raw of duTexts) {
    const [rawDay, rawTimes] = raw.textContent.match(/\d{1,2}(?=st|nd|rd|th)|\d{1,2}[ap]m/g)
    
    if (parseInt(rawDay) == now.getDate() 
        && !raw.textContent.toLowerCase().includes("awake")
       ) {
      let deadlineHour = parseInt(rawTimes)
      deadlineHour += (GM_getValue("nstHour") - now.getHours())
      
      const deadlineDay = new Date(
        now.setDate(now.getDate() 
          + Math.floor(deadlineHour / 24))
      )
      
      const turmTime = new Date(
        deadlineDay.getFullYear(), 
        deadlineDay.getMonth(), 
        deadlineDay.getDate(), 
        deadlineHour % 24, 
        0
      )
      
      setDeadline("turmaculus", turmTime)
    }
    
  }
}

whenWindowHasFocus(checkDeadlines)