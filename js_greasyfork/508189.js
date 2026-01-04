// ==UserScript==
// @name         Wordle Solver
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Gives You the Wordle Answer
// @author       Nick
// @match        https://www.nytimes.com/games/wordle/*
// @icon         https://www.nytimes.com/games-assets/v2/assets/wordle/page-icons/wordle-icon.svg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508189/Wordle%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/508189/Wordle%20Solver.meta.js
// ==/UserScript==

let date = new Date()
let day = (date.getMonth()+1)
if(day.toString().length < 2) {
    day = "0"+day
}
let date_wordle = date.getYear()+1900+"-"+day+"-"+date.getDate()
fetch("https://www.nytimes.com/svc/wordle/v2/"+date_wordle+".json").then((data)=>{
    data.json().then((json)=>{
        alert("The Wordle Answer is: '"+json.solution+"'")
    })
})