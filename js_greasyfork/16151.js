// ==UserScript==
// @name        Specter Syntax Highlighting
// @namespace   ngusyntax
// @description Implements syntax highlighting for [CODE] bb tags.
// @include     https://www.nextgenupdate.com/forums/*
// @include     http://www.nextgenupdate.com/forums/*
// @version     1.02
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/16151/Specter%20Syntax%20Highlighting.user.js
// @updateURL https://update.greasyfork.org/scripts/16151/Specter%20Syntax%20Highlighting.meta.js
// ==/UserScript==

/* Test if the thread contains a [CODE] tag */
if(/<pre class="bbcode_code"/i.test(document.body.innerHTML))
{
  alert("This thread uses bbcode [CODE] tags. We have attempted to highlight the syntax for you!");
  
  /* Keep comments grayed out */
  document.body.innerHTML= document.body.innerHTML.replace(/\n\/\/.+/g, function(m){
    return '<span style="color:#C2C2C2">'+m+'</span>'
  });
  
  document.body.innerHTML= document.body.innerHTML.replace(/\n\/\*[^]*?\*\//g, function(m){
    return '<span style="color:#C2C2C2">'+m+'</span>'
  });
  
  /* Highlight all #include pre-processor directives and "import" for python to a green colour */
  document.body.innerHTML= document.body.innerHTML.replace(/#include/g, function(m){
    return '<span style="color:#30B300">'+m+'</span>'
  });
  
  document.body.innerHTML= document.body.innerHTML.replace(/import /g, function(m){
    return '<span style="color:#30B300">'+m+'</span>'
  });
  
  /* Highlight all strings to a green colour */
  document.body.innerHTML= document.body.innerHTML.replace(/\ \".+?\"\\;/g, function(m){
    return '<span style="color:#30B300">'+m+'</span>'
  });
  
  document.body.innerHTML= document.body.innerHTML.replace(/\ \".+?\"\)/g, function(m){
    return '<span style="color:#30B300">'+m+'</span>'
  });
  
  document.body.innerHTML= document.body.innerHTML.replace(/\(\".+?\"/g, function(m){
    return '<span style="color:#30B300">'+m+'</span>'
  });
  
  /* Highlight all function names to a purple colour */
  document.body.innerHTML= document.body.innerHTML.replace(/\ (?!rgb)[a-zA-Z]+(?=\()/g, function(m){
    return '<span style="color:#cc0099">'+m+'</span>'
  });
  
  document.body.innerHTML= document.body.innerHTML.replace(/\t(?!rgb)[a-zA-Z]+(?=\()/g, function(m){
    return '<span style="color:#cc0099">'+m+'</span>'
  });
  
  /* Highlight all data-types to a yellow colour */
  document.body.innerHTML= document.body.innerHTML.replace(/unsigned int /g, function(m){
    return '<span style="color:#ff9933">'+m+'</span>'
  });
  
  document.body.innerHTML= document.body.innerHTML.replace(/int /g, function(m){
    return '<span style="color:#ff9933">'+m+'</span>'
  });
  
  document.body.innerHTML= document.body.innerHTML.replace(/unsigned char /g, function(m){
    return '<span style="color:#ff9933">'+m+'</span>'
  });
  
  document.body.innerHTML= document.body.innerHTML.replace(/char /g, function(m){
    return '<span style="color:#ff9933">'+m+'</span>'
  });
  
  document.body.innerHTML= document.body.innerHTML.replace(/string /g, function(m){
    return '<span style="color:#ff9933">'+m+'</span>'
  });
  
  document.body.innerHTML= document.body.innerHTML.replace(/short /g, function(m){
    return '<span style="color:#ff9933">'+m+'</span>'
  });
  
  document.body.innerHTML= document.body.innerHTML.replace(/float /g, function(m){
    return '<span style="color:#ff9933">'+m+'</span>'
  });
  
  document.body.innerHTML= document.body.innerHTML.replace(/double /g, function(m){
    return '<span style="color:#ff9933">'+m+'</span>'
  });
  
  document.body.innerHTML= document.body.innerHTML.replace(/void/g, function(m){
    return '<span style="color:#ff9933">'+m+'</span>'
  });
  
  document.body.innerHTML= document.body.innerHTML.replace(/struct /g, function(m){
    return '<span style="color:#ff9933">'+m+'</span>'
  });
  
  document.body.innerHTML= document.body.innerHTML.replace(/enum /g, function(m){
    return '<span style="color:#ff9933">'+m+'</span>'
  });
  
  document.body.innerHTML= document.body.innerHTML.replace(/ return/g, function(m){
    return '<span style="color:#ff9933">'+m+'</span>'
  });
  
  document.body.innerHTML= document.body.innerHTML.replace(/\treturn/g, function(m){
    return '<span style="color:#ff9933">'+m+'</span>'
  });
  
  /* Highlight all if conditions to a yellow colour */
  document.body.innerHTML= document.body.innerHTML.replace(/if(?=\()/g, function(m){
    return '<span style="color:#ff9933">'+m+'</span>'
  });
  
  document.body.innerHTML= document.body.innerHTML.replace(/else if(?=\()/g, function(m){
    return '<span style="color:#ff9933">'+m+'</span>'
  });
  
  document.body.innerHTML= document.body.innerHTML.replace(/switch/g, function(m){
    return '<span style="color:#ff9933">'+m+'</span>'
  });
}