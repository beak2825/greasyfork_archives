// ==UserScript==
// @name Moodle-Ultimate-Toolbox
// @description  Suite d'outils pour faciliter l'administration de Moodle
// @author       obooklage - Education Nationale / Académie de Créteil - FRANCE
// @version	 7
// @licence      MIT License (MIT)
// @namespace    Violentmonkey Scripts
// @icon         https://tracker.moodle.org/secure/attachment/56206/Moodle-Icon-1024-corners.png
// @match *://moodle*/*
// @downloadURL https://update.greasyfork.org/scripts/387923/Moodle-Ultimate-Toolbox.user.js
// @updateURL https://update.greasyfork.org/scripts/387923/Moodle-Ultimate-Toolbox.meta.js
// ==/UserScript==

function ConsolePrint(message)
{
  var startTime = new Date();
  console.log('[Moodle-Ultimate-Toolbox] '+ startTime.toLocaleTimeString() + ' ' + message) ;
}

function insertTextAtCursor(text) {
    var sel, range, html;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();
            range.insertNode( document.createTextNode(text) );
        }
    } else if (document.selection && document.selection.createRange) {
        document.selection.createRange().text = text;
    }
}

/* Intercept CTRL+E for "\( MATHS \)" and CTRL+K for Python, insertion in caret/cursor position of contenteditable div */
function keyDownHandler(zEvent) {
    if (zEvent.ctrlKey  &&  zEvent.code === "KeyE") {
      ConsolePrint('CONTROL-E KEY DETECTED');
      /* question editor present ? */
      if( document.getElementsByClassName('editor_atto_content') )
      {
        ConsolePrint("EDITOR(S) DETECTED");
        insertTextAtCursor("\\( MATHS \\) ");
      }
    }
    else if (zEvent.ctrlKey  &&  zEvent.code === "KeyK") {
      ConsolePrint('CONTROL-K KEY DETECTED');
      /* question editor present ? */
      if( document.getElementsByClassName('editor_atto_content') )
      {
        ConsolePrint("EDITOR(S) DETECTED");
        insertTextAtCursor("<span syntax=\"python\">code</span>");
      }
    }
}

/* Course set next page */
/* Remplir le selecteur 'Aller' et remplir le champ de description  */
function FunctionChanged()
{
  ConsolePrint("Changed");
  var selector = document.getElementById("id_jumpto_0");
  var text = selector.options[selector.selectedIndex].text;
  if( text == "Fin de la leçon")
    text = "Valider et terminer la leçon"
  document.getElementById('id_answer_editor_0').value = text;
}

var selector = document.getElementById("id_jumpto_0");
if(selector)
{
  ConsolePrint("Select item id_jumpto_0 found");
  selector.addEventListener("change", FunctionChanged);
  textfield = document.getElementById('id_answer_editor_0');
  if(textfield)
  {
    text = document.getElementById("id_answer_editor_0").value;
    ConsolePrint("Texte existant = ["+text+"]");
    if(text=="")
    {
      FunctionChanged();
    }
  }
}

/* Application */
if (self == top) { /* run only in the top frame. we do our own frame parsing */
  ConsolePrint('STARTED');
  /* Keyboard */
   document.addEventListener("keydown", keyDownHandler, false);
}
