// ==UserScript==
// @name        Adultddl Sweet Captcha Solver
// @namespace   drdre
// @description Automatically solve the sweetcaptcha on adultddl.ws on a single post page
// @version     1
// @include     http://adultddl.ws/*
// @include     http://secure.adultddl.ws/captcha.php
// @include     http://secure.adultddl.ws/?decrypt=*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/15340/Adultddl%20Sweet%20Captcha%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/15340/Adultddl%20Sweet%20Captcha%20Solver.meta.js
// ==/UserScript==

var map =  {
   1 :   1,
   2 :   2,
   4 :   4,
   5 :   5,
   6 :   6,
   7 :   7,
   8 :   8,
   9 :   9,
  10 :  40,
  11 :  41,
  12 :  42,
  13 :  43,
  14 :  44,
  16 :  45,
  17 :  46,
  18 :  47,
  19 :  48,
  20 :  49,
  21 :  77,
  22 :  81,
  23 :  85,
  24 :  89,
  25 :  93,
  26 :  97,
  27 : 101,
  28 : 115,
  29 : 109,
  30 : 113,
  31 : 117,
  32 : 121,
  33 : 125,
  34 : 129,
  35 : 133,
  36 : 137,
  37 : 141,
  38 : 145,
  39 : 149,
  40 : 153,
  41 : 157,
  42 : 161,
  43 : 165,
  44 : 168,
  45 : 172,
  46 : 176,
  47 : 180,
  48 : 184,
  49 : 188,
  50 : 192,
  51 : 201,
  52 : 206,
  53 : 211,
  54 : 216,
  55 : 221,
  56 : 226,
  57 : 231,
  58 : 236,
  59 : 241,
  60 : 246,
  61 : 251,
  62 : 256,
  63 : 261,
  64 : 266,
  65 : 271,
  66 : 276,
  67 : 281,
  68 : 286,
  69 : 291,
  70 : 296,
  71 : 310,
  72 : 316,
  73 : 320,
  74 : 324,
  75 : 328,
  76 : 330,
  77 : 333,
  78 : 344,
  79 : 340,
  80 : 348,
  81 : 351,
  82 : 355,
  83 : 359,
  84 : 362,
  85 : 367,
  86 : 371,
  87 : 375,
  88 : 379,
  89 : 383,
  90 : 387
};


function gotoCaptcha() {
  if(document.getElementById("submit"))
    document.getElementById("submit").click();
}

function solveCaptcha() {
  var li = document.querySelectorAll("li");

  var question = parseInt(document.querySelector(".holder").style.backgroundImage.match(/question_(\d+)/)[1], 10);
  if(question in map) {
    
    for(var i = 0; i < li.length; i++) {
      var current = parseInt(li[i].getElementsByTagName("img")[0].src.match(/answer_(\d+)/)[1], 10);
      if(current == map[question]) {
        sendForm(li[i].dataset.hash);
        return;
      }
    }
  } else {
    alert("Unkown captcha\n\nPlease click correct answer and add it into script source code");
    for(var i = 0; i < li.length; i++) {
      li[i].addEventListener("click",function() {
        alert(question + " : " + parseInt(this.getElementsByTagName("img")[0].src.match(/answer_(\d+)/)[1], 10) + ",");
      });
    }
  }
}

function sendForm(hash) {
  var scvalue = hash.substr(5,10);

  var makeInput = function(name, value) {
    var inp = document.createElement("input");
    inp.type = "hidden";
    inp.name = name
    inp.value = value;
    return inp;
  }
  
  var form = document.createElement("form");
  form.method = "post";
  form.appendChild(makeInput("fuckbots", document.getElementsByName("fuckbots")[0].value));
  form.appendChild(makeInput("sckey", document.getElementsByName("sckey")[0].value));
  form.appendChild(makeInput("scvalue", scvalue));
  form.appendChild(makeInput("scvalue2", "0"));
  document.body.appendChild(form);
  form.submit();

}

(function() {
  if(document.location.host == "secure.adultddl.ws") {
    if(document.location.href.match(/decrypt=/)) {
      // Solve captcha
      window.setTimeout(gotoCaptcha,1000);
    } else {
      // Open captcha page
      window.setTimeout(solveCaptcha,3000);
    }
  } else {
    // Open iframe
    if(document.body.className.indexOf("single-post") != -1) {  
      document.querySelectorAll(".entry-content a[id^=ddet]")[0].click();
    }
  }
})();