// ==UserScript==
// @name        La Copiada
// @namespace   https://moodle.upm.es
// @description Copiadas
// @include     https://moodle.upm.es/*
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/25320/La%20Copiada.user.js
// @updateURL https://update.greasyfork.org/scripts/25320/La%20Copiada.meta.js
// ==/UserScript==


if (window.location.href.indexOf("https://moodle.upm.es/titulaciones/oficiales/mod/quiz/review.php") != -1)
{  
  var shareIt = [];

  for (var i = 1; i <= 10; i++) {
    try {
       
    var question = document.getElementById("q" + i);
    var text = question.getElementsByClassName("qtext")[0].textContent;
    var answer = question.getElementsByClassName("correct");
    
    if (answer.length === 0) {
      answer = question.getElementsByClassName("incorrect")[0].classList[0];
      
      if (answer == 'r0') {
        answer = 'r1';        
      } else {
        answer = 'r0';
      }
    }
    

    var o = {};
    o.text = text;
    o.answer = answer;

    shareIt.push(o);
    }
    catch (ex)
    {
      console.log(ex);
      
      //var debug = document.getElementById("q" + i).getElementsByClassName("correct");
      //alert(ex + ' -> ' + i + ' == ' + debug.length + ' <> ' + debug[0]);
    }
  }  
  
  
  var div = document.createElement("div");
  div.setAttribute("style", ";margin-top: 50px;");
  div.innerHTML = "Copia y pega:<br/><br/>";
  div.innerHTML += "<textarea autofocus style='width:80%;height=100%;'>" + btoa(JSON.stringify(shareIt)) + "</textarea>";
  document.body.insertBefore(div,document.body.firstChild);
  
}
else if (window.location.href.indexOf("https://moodle.upm.es/titulaciones/oficiales/mod/quiz/attempt.php") != -1)
{
  var div = document.createElement("div");
  div.setAttribute("style", ";margin-top: 50px;padding-left:10px;");
  div.innerHTML = "Pegar aqui:<br/><br/>";
  div.innerHTML += "<textarea id='copypasta-tastes-good' style='width:80%;height=100%;'></textarea><br/>";
  
  var button = document.createElement("input");
  button.type = "button";
  button.value = "Evaluar";
  button.onclick = addSolution;
  
  div.appendChild(button);
  
  document.body.insertBefore(div,document.body.firstChild);
}

function recheckSolutions(solutions)
{
    var counter = 0;
    for (var i = 0; i < solutions.length; i++) {
      counter += applySolution(solutions[i].text, solutions[i].answer);
    }
  
  alert('Aplicando ' + counter + ' respuestas!');
  counter = 0;
}

function applySolution(text, solution)
{
  for (var i = 1; i <= 10; i++) {
    var question = document.getElementById("q" + i);
    var txt = question.getElementsByClassName("qtext")[0].textContent;

    if (txt != text) continue;
    
    var node = question.getElementsByClassName(solution);
    
    if (node.length > 0) {
      node[0].firstChild.setAttribute("checked", "true");
      return 1;
    }
    return 0;    
  }
  
  return 0;
}


function addSolution()
{
  var area = document.getElementById("copypasta-tastes-good");
  var list = JSON.parse(atob(area.value)); 
  
  recheckSolutions(list);
  
  area.value = "";
}