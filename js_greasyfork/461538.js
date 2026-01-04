// ==UserScript==
// @name        Gandalf
// @namespace   Violentmonkey Scripts
// @match       https://gandalf.epitech.eu/*
// @grant       none
// @version     1.0
// @author      Quentin Quéro
// @description 16/02/2023 10:53:21
// @license MIT
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js
// @downloadURL https://update.greasyfork.org/scripts/461538/Gandalf.user.js
// @updateURL https://update.greasyfork.org/scripts/461538/Gandalf.meta.js
// ==/UserScript==

let dates  = document.querySelectorAll("table > tbody > tr > td")
let table  = document.querySelector("table")
let passedColor = "#999"
let soonColor = "#e04957"
let futurColor = "#0272bc"

table.style["border-spacing"] = "10px"
table.style["border-collapse"] = "separate"

dates.forEach(date => {

  let formatDate = "ll"

  let cleanDate = date.innerHTML.split("&nbsp;")[1];

  if(cleanDate){

    if(cleanDate.includes("<span")){
      cleanDate = cleanDate.replace('<span>', '').replace('<span>', '').replace('<span>', '').replace('<span>', '').replace('<span>', '').replace('<span>', '').replace('<span style="">', '')
      cleanDate = cleanDate.replace('</span>', '').replace('</span>', '').replace('</span>', '').replace('</span>', '').replace('</span>', '').replace('</span>', '')

    }
    if(cleanDate.includes("-")){
     cleanDate = cleanDate.replace(' - ', ' ').replace('h', ':')
      formatDate = 'lll'
    }

    if(cleanDate.includes("<strong>"))
      cleanDate = cleanDate.split("<strong>")[0];
  }

  if(!cleanDate)
    cleanDate = date.innerHTML.split(" ")[1];

  if(!cleanDate){
    cleanDate = date.innerHTML
  }

  if(cleanDate && cleanDate !== "-"){
    cleanDate = cleanDate.replace('<br>', '')
    cleanDate = cleanDate.replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '')
    let dateMoment = moment(cleanDate)
    if(dateMoment.isValid()) {
      date.style["text-align"] = "left"
      date.style["border-radius"] = "10px"
      date.style.padding = "5px 10px"
      date.style["border"] = "1px solid";

      if(dateMoment.isBefore(moment())){
        date.innerHTML = dateMoment.format(formatDate);
        date.style.color = passedColor;
      } else if(dateMoment.add("7", "d").isBefore(moment())) {
        date.style.color = soonColor;
        date.style["border"] = "3px solid";
        date.innerHTML = dateMoment.format(formatDate) + ' | <strong>' + dateMoment.fromNow() + "</strong>"

      } else {
        date.style.color = futurColor;
        date.style["border"] = "3px solid";
        date.innerHTML = dateMoment.format(formatDate) + ' | ' + dateMoment.fromNow()

      }
    }
  }
})
