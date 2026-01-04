
// ==UserScript==
// @name         ANTI-LAG MIX
// @namespace    http://nead.pro.br/
// @version      0.1
// @description  try to take over the world!
// @author       irineu, voce nao sabe nem eu
// @match	 *://nead.pro.br/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40209/ANTI-LAG%20MIX.user.js
// @updateURL https://update.greasyfork.org/scripts/40209/ANTI-LAG%20MIX.meta.js
// ==/UserScript==
var correct = `<div class="correctness  incorrect">Errado</div>`;
//document.body.style.backgroundImage = "url('http://eskipaper.com/images/blue-background-2.jpg')";


function clickelementbyname(elementname){
  document.getElementsByName(elementname)[0].click();
  }
/*
function clickelementbyclassname(elementclassname){
  document.getElementsByClassName(elementclassname)[0].click();
  }
*/

if(window.location.href.indexOf("nead.pro.br/mod/quiz/attempt.php?") > -1){
  console.log("Questionary page detected.");
  //var id = document.getElementsByName('questionids')[0].value;
  var s1 = document.getElementsByClassName('submit btn')[0].getAttribute('onclick').split(`'`)[1];
  var id = s1.split('q')[1];
  var questionID = document.getElementsByName('questionids')[0].value;
  var questioncode = document.getElementById(`q${id}`).innerHTML;
  var correctness = document.getElementsByClassName("correctness  correct")[0];
  console.log("Checking question grading.");
  if(correctness !== undefined){
    console.log("Question is right, saving data.");
    localStorage.setItem('que'+ id, questioncode);
    if(document.getElementsByClassName("next")[0] !== undefined){
      console.log("Going to next page.");
      document.getElementsByClassName("next")[0].click();
    }
    if(document.getElementsByClassName("next")[0] === undefined){
      console.log("Questionary is finished.");
      alert("Questionary is finished.");
    }
  }
  if(correctness === undefined){
    console.log("Question isn't right, looking for question data");
    if(localStorage.getItem('que' + id) === null){
      alert("No data found, you must answer this question");
      console.log("No data found, human must answer");
    }
    if(localStorage.getItem('que' + id) !== null){
      document.getElementById(`q${id}`).innerHTML = localStorage.getItem('que' + id);
      setTimeout(clickelementbyname, 250, 'resp' + id + '_submit');
      console.log("Data found, changing page.");
    }
  }
}