// ==UserScript==
// @name     kissanime Anime Captcha Solver
// @version  2018.05.02
// @namespace  https://greasyfork.org/en/users/188118-ankit16-19
// @author ankit16-19
// @description This script ask user for help for first time and save the response and use that to solve future captcha.
// @grant    none
// @include  http://kissanime.ru/Special/AreYouHuman2*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/368595/kissanime%20Anime%20Captcha%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/368595/kissanime%20Anime%20Captcha%20Solver.meta.js
// ==/UserScript==
//custom html
$("#formVerify").append("<br>")
var input=document.createElement("input");
input.id = "image1"
input.type="button";
input.value="Image1";
input.onclick = function(){
  if(!localStorage.getItem("helpword")){
  	localStorage.setItem(localStorage.getItem("helpWord"),ProcessImages()[0])
    localStorage.removeItem("helpword");
  }
  if(unknownwords[1] !== undefined && count < 1){
    askForHelp(unknownwords[1]);
    count++;
  }
  $("[indexValue=0]").click();
}
input.setAttribute("style", "font-size:18px;");
document.getElementById("formVerify").appendChild(input);
var input=document.createElement("input");
input.id = "image2"
input.type="button";
input.value="Image2";
input.onclick = function(){
  if(!localStorage.getItem("helpword")){
  	localStorage.setItem(localStorage.getItem("helpWord"),ProcessImages()[1])
    localStorage.removeItem("helpword");
  }  
  if(unknownwords[1] !== undefined && count < 1){
    askForHelp(unknownwords[1]);
    count++;
  }  
  $("[indexValue=1]").click();
}
input.setAttribute("style", "font-size:18px;");
document.getElementById("formVerify").appendChild(input); 
var input=document.createElement("input");
input.id = "image3"
input.type="button";
input.value="Image3";
input.onclick = function(){
  if(!localStorage.getItem("helpword")){
  	localStorage.setItem(localStorage.getItem("helpWord"),ProcessImages()[2])
    localStorage.removeItem("helpword");
  } 
  if(unknownwords[1] !== undefined && count < 1){
    askForHelp(unknownwords[1]);
    count++;
  }  
  $("[indexValue=2]").click();
}
input.setAttribute("style", "font-size:18px;");
document.getElementById("formVerify").appendChild(input); 
var input=document.createElement("input");
input.id = "image4"
input.type="button";
input.value="Image4";
input.onclick = function(){
  if(!localStorage.getItem("helpword")){
  	localStorage.setItem(localStorage.getItem("helpWord"),ProcessImages()[3])
    localStorage.removeItem("helpword");
  }
  if(unknownwords[1] !== undefined && count < 1){
    askForHelp(unknownwords[1]);
    count++;
  }  
  $("[indexValue=3]").click();
}
input.setAttribute("style", "font-size:18px;");
document.getElementById("formVerify").appendChild(input); 


//global variables
var words = [];
var undefinedWords = [];
var imageSrc = [];
var clickImage = [];
var count = 0;

//Avoid conflicts
this.$ = this.jQuery = jQuery.noConflict(true);
$(document).ready(function()
{
 	unknownwords = UnknownWords();
  knownwords = KnownWords();
  console.log("Unknown words " + unknownwords);
  console.log("Known words " + knownwords);
  // ask user for help with first word
  if(unknownwords[0] !== undefined){
  	askForHelp(unknownwords[0]);
  }
  knownwords.forEach(function(word){
    matchfound = 0;
    console.log("processing known word:" + word)
    // get value from storage and click the corresponsding image;
    ProcessImages().forEach(function(image,counter){
      console.log("counter: " + counter);
      if(localStorage.getItem(word) == image){
        console.log("found match for word " + word);
        matchfound = 1;
        $("[indexValue='"+counter+"']").click();
      }else if(counter === 3 && matchfound === 0){
        location.reload();
      }
    })
    
  })  

});

function askForHelp(word){
  alert("We need help for the word:" + word);
  localStorage.setItem("helpWord",word);
}

function UnknownWords(){
  var unknownwords = [];
  Words().forEach(function(word){
     if(!localStorage.getItem(word)){
       	unknownwords.push(word);
     }
  });
  return unknownwords;
}
function KnownWords(){
  var Knownwords = [];
  Words().forEach(function(word){
     if(localStorage.getItem(word)){
       	Knownwords.push(word);
     }
  });
  return Knownwords;
}

function SaveWord(word, dataurl){
  if(!localStorage.getItem(word)){
   		localStorage.removeItem(word);
    	localStorage.setItem(word, dataurl);
  }else {
   		localStorage.setItem(word,dataurl);
  }
}

function Words(){
    var words = $("#formVerify").find("span").toArray();
    var First = words[0].innerText;
    var Second = words[1].innerText;
    return [First, Second];
}

function Images(){
  return $("[indexValue]").toArray();
}

function ConvertToDataUrl(img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  var dataURL = canvas.toDataURL("image/png");
  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function MinimiseDataUrl(dataUrl,jump)
{
    var a = "";
    for(var i = 0; i < dataUrl.length; i=i+jump)
        a += dataUrl.charAt(i);
    return a;
}

function ProcessImages()
{
  var imagedata = [];
  Images().forEach(function(image, counter)
  {
    dataurl = ConvertToDataUrl(image)
    imagedata.push(MinimiseDataUrl(MinimiseDataUrl(MinimiseDataUrl(dataurl, 5), 4),3));
  })
  return imagedata
}

