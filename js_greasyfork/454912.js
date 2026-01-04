// ==UserScript==
// @name         Quizlet Question Bypass
// @namespace    http://tampermonkey.net/
// @version      0.31
// @description  Gives you the images of the solutions on the bottom. Works best with auto-login quizlet.
// @author       DevT02
// @license MIT
// @match        http*://www.quizlet.com/explanations/questions/*
// @match        http*://quizlet.com/explanations/questions/*
// @match        http*://www.quizlet.com/explanations/textbook-solutions/*
// @match        http*://quizlet.com/explanations/textbook-solutions/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/454912/Quizlet%20Question%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/454912/Quizlet%20Question%20Bypass.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

window.addEventListener('load', function() {
  'use strict';
  const NEW_METHOD = localStorage.getItem("newMethod")==='true' // when slider is clicked, local storage will get result (keep scrolling for if-else on NEW_METHOD)
  let LOGGED_IN = false // assume we are not logged in

  if ($("div[class^='SiteAvatar'],div[class*=' SiteAvatar']").length > 0){
      LOGGED_IN = true // if we find an avatar, we're logged in
  }


  var paywall = document.getElementById('__NEXT_DATA__'); // get paywall
  var data = paywall.outerHTML == null ? location.reload() : paywall.outerHTML; // outer json html (RELOAD IF NO HTML IS AVAILABLE, THIS IS FOR FIREFOX)
  console.log('Pre-checks completed! QuizletQuestionBypass by DevT02')
  console.log('Check out my other projects at https://github.com/DevT02/') // START PROGRAM

  // add new method for unblur (requires to not be logged in) this adds the LABEL and the SLIDER.
  var headers = document.getElementsByTagName('header');
  headers[0].insertAdjacentHTML('beforeend', '<div id=antiLogindiv> <h2 id=method>Use NoLogin?</h2> <label class="switch"> <input type="checkbox"> <div class="slider round"></div> </label> </div>');
  headers[0].insertAdjacentHTML('beforeend', '<style type="text/css" id=centerDiv>#method{position:relative,top:15px;padding-bottom: 40px;margin:auto;white-space: nowrap; font-size: 22px;color: orange;}</style>')
  headers[0].insertAdjacentHTML('beforeend', '<style type="text/css" id=toggleSwitchStyle>.switch {position:absolute;top:37px;display: inline-block;width: 60px;height: 34px;}.switch input {display:none;}.slider {position: absolute;cursor: pointer;top: 0;left: 0;right: 0;bottom: 0;background-color: #ccc;-webkit-transition: .4s;transition: .4s;}.slider:before {position: absolute;content: "";height: 26px;width: 26px;left: 4px;bottom: 4px;background-color: white;-webkit-transition: .4s;transition: .4s;}input:checked + .slider {background-color: #2196F3;}input:focus + .slider {box-shadow: 0 0 1px #2196F3;}input:checked + .slider:before {-webkit-transform: translateX(26px);-ms-transform: translateX(26px);transform: translateX(26px);}.slider.round {border-radius: 34px;}.slider.round:before {border-radius: 50%;}</style>')

  // if ALREADY was clicked, ensure it is in the correct spot!
  if (NEW_METHOD){
     $('input[type="checkbox"]').attr('checked', '')
  }
  else{
     $('input[type="checkbox"]').removeAttr('checked')
  }

  // IF we CLICK the slider, store what position it is in (incase we move to next page!!!)
  $('.slider.round').click(function() {
   var checkbox = $('input[type="checkbox"]');
   if (!$(checkbox).prop('checked')) {
      localStorage.setItem("newMethod", true);
   } else {
      localStorage.setItem("newMethod", false);
   }
  });

  // DO THE NEW METHOD
  if (NEW_METHOD && !LOGGED_IN){
      var selectElementContainer = $("div[class^='ExplanationSolutionsContainer'],div[class*=' ExplanationSolutionsContainer']")
      $(selectElementContainer).eq(0).css("max-height","10000rem") // best for when not logged in
       $(selectElementContainer).eq(0).css("overflow", "visible")
      selectElementContainer.each(function (index, element){
          $(selectElementContainer).eq(0).children().removeAttr('hidden') // show hidden divs (again best when not logged in)
      });
  }

  // OLD KATEX UNBLUR METHOD

  // split urls into an array named "data"
  data = data.split("https://").map(val => { return "https://"+val }).slice(1);
  function dataIncludes(a1, i){
    return data[i].includes(a1)
  }

  var selectEachElement = $("div[class^='ExplanationsSolutionCard'],div[class*=' ExplanationsSolutionCard']")
  // Actually unblur KATEX
  selectEachElement.each(function (index, element){
       $(selectEachElement).eq(index).children().eq(1).children().first().children().first().removeAttr('style').css("filter","blur(0)")

  });

  var data2 = [];
  for(let i = 0; i < data.length; i++){
    data[i] = data[i].substring(0, data[i].indexOf("\""))
    if (dataIncludes("lateximg.png", i) || dataIncludes("assets", i) || dataIncludes("textbook_covers", i) || dataIncludes("cache", i)){
      data.splice(i, 1)
      i--
    }
    else if (dataIncludes("textbook-solutions", i)){
        data2.push(data[i])
    }
  }


  // add bottom buttons

  var buttonCont = document.createElement("div");
  buttonCont.setAttribute('id', 'buttonContainer');
  buttonCont.style.backgroundColor = "white";
  document.body.appendChild(buttonCont);

  var buttonContainer = document.getElementById('buttonContainer');
  var buttonFrag = document.createDocumentFragment();

  // skip question buttons if logged in (WIP)
  data2.forEach(function(url, index, originalArray) {
    var btn = document.createElement('button');
    btn.style.textAlign = 'center';
    btn.style.transitionDuration = '0.4s'; // if i decide to add a hover event (unfortunately requires a css file)
    btn.style.display = 'inline-block';
    btn.style.margin= '6px 8px';
    switch (true){
        case (index == 0):
           btn.innerText = "Next Problem";
           break;
        case (index == 1):
           btn.innerText = "Skip 2 Problems";
           break;
        case (index == 2):
           btn.innerText = "Previous Problem";
           break;
        case (index == 3):
           btn.innerText = "Reload";
           break;
        case (index == originalArray.length - 1):
           btn.innerText = "Back to Textbook";
           break;
        default:
           return;
    }
    btn.style.padding = '20px 40px';
    btn.style.background = 'white'; // setting the background color to white
    btn.style.color = 'black'; // setting the color to black
    btn.style.border = '2px solid #f44336'
    btn.style.fontSize = '20px'; // setting the font size to 20px
    btn.onclick = function() {
       if (index != 3)
           location.href = url;
       else
           location.reload()
    }
    buttonContainer.appendChild(btn);
  });
  buttonContainer.appendChild(buttonFrag);
  document.getElementById("buttonContainer").style.display = "flex";
  document.getElementById("buttonContainer").style.alignItems = "center";
  document.getElementById("buttonContainer").style.justifyContent = "center";




  // remove popups
  var paywallremover = [ document.getElementsByClassName("hideBelow--s"), document.getElementsByClassName("hideBelow--s"), document.getElementsByClassName("hideBelow--m")]
  try{
      paywallremover.forEach(element => element[0].remove())
  }
  catch (err){
      console.log(err)
  }




  // add new container for images
  var imgCont = document.createElement("div");
  imgCont.setAttribute('id', 'imageContainer')
  imgCont.style.backgroundColor = "white";
  document.body.appendChild(imgCont);

  var container = document.getElementById('imageContainer');
  var docFrag = document.createDocumentFragment();

  data.forEach(function(url, index, originalArray) {
    var img = document.createElement('img');
    img.src = url;
    docFrag.appendChild(img);
  });
  container.appendChild(docFrag);


  // to work in tandem with quizlet bypass
  let div = document.createElement('div');
  div.classList.add('hideBelow--s');
  document.body.appendChild(div)
  let div2 = document.createElement('div');
  div2.classList.add('hideAbove--s');
  document.body.appendChild(div2)
}, false);