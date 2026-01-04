// ==UserScript==
// @name         EducationMinistryFucker
// @version      0.1
// @description  real score getter
// @author       luanmenglei
// @namespace clesip
// @match   https://www.dongni100.com/v2/exam/report/detail?*
// @downloadURL https://update.greasyfork.org/scripts/444370/EducationMinistryFucker.user.js
// @updateURL https://update.greasyfork.org/scripts/444370/EducationMinistryFucker.meta.js
// ==/UserScript==


function addXMLRequestCallback(callback){
    var oldSend, i;
    if( XMLHttpRequest.callbacks ) {
        // we've already overridden send() so just add the callback
        XMLHttpRequest.callbacks.push( callback );
    } else {
        // create a callback queue
        XMLHttpRequest.callbacks = [callback];
        // store the native send()
        oldSend = XMLHttpRequest.prototype.send;
        // override the native send()
        XMLHttpRequest.prototype.send = function(){
            // process the callback queue
            // the xhr instance is passed into each callback but seems pretty useless
            // you can't tell what its destination is or call abort() without an error
            // so only really good for logging that a request has happened
            // I could be wrong, I hope so...
            // EDIT: I suppose you could override the onreadystatechange handler though
            for( i = 0; i < XMLHttpRequest.callbacks.length; i++ ) {
                XMLHttpRequest.callbacks[i]( this );
            }
            // call the native send()
            oldSend.apply(this, arguments);
        }
    }
}

var totalScores = [];
var questionData = [];
var addScores = false;

// e.g.
addXMLRequestCallback( function( xhr ) {
        xhr.addEventListener("load", function(){
        if ( xhr.readyState == 4 && xhr.status == 200 ) {
           // console.log( xhr.responseURL );
            if (xhr.responseURL.indexOf('scoreSection') != -1) {
              var jsonObj = JSON.parse(xhr.response)['data'];
              totalScores = [];
              addScores = false;
              for (var i = 0; ; i ++) {
                if (jsonObj[i] == undefined) {
                  console.log('Data section end!');
                  break;
                }
             //   console.log('totalScore_' + i + ' = ' + jsonObj[i]['totalScore']);
                totalScores.push(jsonObj[i]['totalScore']);
              }
              console.log(totalScores);
              addScore();
              
            }
            if (xhr.responseURL.indexOf('analysis/data/monitor/exam/item/student/question?') != -1) {
              console.log('监听到小题分包');
              var obj = JSON.parse(xhr.response);
              questionData = obj['data'];
              console.log(questionData);
              
            }
        }
    });

});

console.log("你进入了成绩页面");

function addScore() {
  var header = document.getElementsByClassName('header-container')[0];
  if (addScores || totalScores.length == 0 || header == undefined) return;
  addScores = true;
  console.log(header);
  var score = document.createElement("span");
  score.style.background="#757575";
  score.style.color="#fff";
  score.innerText = "";
  totalScores.forEach(function(v, i) {
    console.log(i + " " + v);
    score.innerText = score.innerText + ' 第' + (i + 1) + '科成绩为' + v +  '       ';
    //score.innerText += v + '    ';
 
  });
  console.log(score);
  header.append(score);
}

function checkQuestionDetail() {
  console.log("点击");
  var active = document.getElementsByClassName('active')[0];
  console.log(active);
  if (active != undefined) {
    questionData.forEach(function(v) {
      if (v.structureNumber.trim() == active.innerText.trim()) {
        console.log(v);
        console.log('find it');
        // finallyScore
        var box = document.getElementsByClassName('text-right')[0];
        while (document.getElementsByClassName('education_fucker').length > 0) {
 
            box.removeChild(document.getElementsByClassName('education_fucker')[0]);
  
          
        }
       
        var score = document.createElement("p");
        score.style.background="#757575";
        score.style.color="#fff";
        score.innerText = "本题小题分: " + v['finallyScore'];
       //score.class = 'education_fucker';
        score.setAttribute('class', 'education_fucker');
        
        box.append(score);
        console.log(score);
        console.log(box);
      }
    });
  }
}

(function() {
  addScore();
  
  document.getElementById("app").addEventListener("click", function(){
      checkQuestionDetail();
  });
})();