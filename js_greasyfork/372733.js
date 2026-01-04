// ==UserScript==
// @name TeXify-Plickers
// @namespace https://github.com/obook/TeXify-Plickers
// @version	17
// @description	GreaseMonkey script for add LaTeX code in Plickers website. Use delimiters [; and ;]
// @author obooklage - Education Nationale / Académie de Créteil - FRANCE
// @licence MIT License (MIT)
// @grant none
// @include https://plickers.com/*
// @include https://*.plickers.com/*
// @include https://www.plickers.com/*
// @homepageURL https://github.com/obook/TeXify-Plickers/
// @icon https://github.com/obook/TeXify-Plickers/raw/master/icon.png
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/372733/TeXify-Plickers.user.js
// @updateURL https://update.greasyfork.org/scripts/372733/TeXify-Plickers.meta.js
// ==/UserScript==

/* AS FONT SIZE +/- WAS REMOVED : NEW SETTING PLICKERS SEPTEMBER 2018 HERE */
var QUESTION_TEXT_SIZE = "32px";
var CHOICES_TEXT_SIZE = "24px";

/* OTHER SETTINGS */
var mathjaxloaded = false;
var debugtexify = false;
var movequestionimage = false;

function ConsolePrint(message)
{
  var startTime = new Date();
  console.log('[TeXify-Plickers] '+ startTime.toLocaleTimeString() + ' ' + message) ;
}

function SetClassFontSize(ClassStr,SizeStr) {
  var class_obj_array = document.getElementsByClassName(ClassStr);
  if(class_obj_array)
  {
    for (var i = 0; i < class_obj_array.length; i++)
    {
      var element = class_obj_array[i];
      if( element.innerText )
      {
        element.style["font-size"] = SizeStr;
      }
    }
  } 
}

function OnLoadMathJax()
{
    
    MathJax.Hub.Config({
    showProcessingMessages : false,
    tex2jax: {
      inlineMath: [ ['[;',';]'] ],
      processEscapes: true
    }
    });
    
    mathjaxloaded = true;

    ConsolePrint('MATHJAX SET & READY');
}

function TeXifyPlickers() {

    if( mathjaxloaded !== true)
    {
        ConsolePrint('MATHJAX NOT LOADED YET ');
        return;
    }

    if( debugtexify === true )
        ConsolePrint('MATHJAX SCAN & FONT RESIZE');
  
    /* Question Size */
    SetClassFontSize("slide-body", QUESTION_TEXT_SIZE);
  
    /* Choices Size */
    SetClassFontSize("slide-choices slide-choices--complete", CHOICES_TEXT_SIZE);  
  
    /* MathJax rescan */
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
}

/* Intercept CTRL+E for "[; XX ;]" insertion (Futur use)*/

function keyDownHandler(zEvent) {
    if (zEvent.ctrlKey  &&  zEvent.code === "KeyE") {
      ConsolePrint('CONTROL-E KEY DETECTED');
      /* question editor present ? */
      var editor_div_array = document.getElementsByClassName('table-question heading-small ng-binding ng-hide');
      if( editor_div_array.length > 0 )
      {
        ConsolePrint(editor_div_array.length + ' EDITOR(S) DETECTED ');
        
        // Insert "[; XX ;]"
        // 
      }
    }
}

/* Application */
if (self == top) { /* run only in the top frame. we do our own frame parsing */
  ConsolePrint('STARTED');
  var script = document.createElement('script');
  script.type = 'text/javascript';
  /* end 30/04/2017 : script.src = "https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML"; */
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-MML-AM_CHTML";
  script.onload = OnLoadMathJax;
  document.head.appendChild(script);
  /* Keyboard */
  /* not ready : 
   * document.addEventListener("keydown", keyDownHandler, false);
   * */
  setInterval(TeXifyPlickers, 3000);
}
