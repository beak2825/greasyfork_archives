// ==UserScript==
// @name        SEDAR Captcha Solver
// @description Automatically solves the Captcha when you want to open a document
// @namespace   sedar
// @include     http://sedar.com/GetFile.do*
// @include     http://sedar.com/CheckCode.do*
// @grant       none
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/26998/SEDAR%20Captcha%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/26998/SEDAR%20Captcha%20Solver.meta.js
// ==/UserScript==

(function() {


var image_timeout = 2000;

var solver = {
  "-1118695147" : "X",
  "-1156514050" : "K",
  "-1247154381" : "p",
  "-1316012178" : "B",
  "-1331678675" : "V",
  "-1483385094" : "U",
  "-154654324"  : "S",
  "-1562298880" : "j",
  "-1562803413" : "Y",
  "-158457411"  : "R",
  "-1638235653" : "P",
  "-170924901"  : "D",
  "-1777523844" : "T",
  "-1917443890" : "u",
  "-1920195139" : "f",
  "-2003596324" : "c",
  "-2009400673" : "F",
  "-2067662048" : "J",
  "-2135061970" : "e",
  "-243244218"  : "E",
  "-295515571"  : "Z",
  "-29733915"   : "Q",
  "-32272650"   : "m",
  "-562668947"  : "i",
  "-688611654"  : "w",
  "-775762530"  : "a",
  "-849441892"  : "4",
  "-908128173"  : "W",
  "-95295977"   : "3",
  "-997779436"  : "6",
  "1037015718"  : "H",
  "1118165053"  : "n",
  "1191042624"  : "t",
  "1193354277"  : "2",
  "12565210"    : "C",
  "1274053572"  : "r",
  "1479626033"  : "8",
  "1586340532"  : "g",
  "1607319639"  : "9",
  "1607376555"  : "x",
  "1628919237"  : "5",
  "1715436632"  : "z",
  "1785588234"  : "s",
  "1836207174"  : "k",
  "289883241"   : "L",
  "38744379"    : "h",
  "394797401"   : "A",
  "517211170"   : "G",
  "5186883"     : "b",
  "562912450"   : "M",
  "624234679"   : "y",
  "73967475"    : "7",
  "856644020"   : "N",
  "956352863"   : "v",
  "98577720"    : "d",
  "993706722"   : "q"
};

String.prototype.replaceAt=function(index, character) {
  return this.substr(0, index) + character + this.substr(index+character.length);
}

function hashCode(arr){
  var hash = 0;
  if (arr.length == 0) return hash;
  for (var i = 0; i < arr.length; i++) {
    hash = ((hash<<5)-hash)+arr[i];
    hash = hash & hash;
  }
  return hash;
}

function hashData(data) {
  return ""+hashCode(data.data);
}


function solveSingleChar(img, index) {
  var loaded = false;
  var onload = function() {
    if(loaded) return;
    loaded = true;
    var c = document.createElement("canvas");
    c.setAttribute("width", 300);
    c.setAttribute("height", 60);
    c.setAttribute("style", "position:absolute;top:40px;left:15px");
    
    var ctx = c.getContext("2d");
    ctx.drawImage(img,0,0);
    
    var data = ctx.getImageData(0,0,30,30);
    
    var hash = hashData(data);
    
    if(hash in solver) {
      var v = document.querySelector("input[type=text]").value;
      v = v.replaceAt(index, solver[hash]);
      document.querySelector("input[type=text]").value = v;
      if(v.indexOf("-") == -1) {
        document.querySelector("input[type=submit]").click();
      }
    }
  };
    
  img.addEventListener("load",onload);
  window.setTimeout(function() {
    if(!loaded) {
      onload();
    }
  }, image_timeout);  
}

function solve() {
  
  var solution = document.querySelector("input[type=text]").value = "-----";

  var imgs = document.querySelectorAll("form img");
  
  solveSingleChar(imgs[0], 0);
  solveSingleChar(imgs[1], 1);
  solveSingleChar(imgs[2], 2);
  solveSingleChar(imgs[3], 3);
  solveSingleChar(imgs[4], 4);
}


solve();


})();
