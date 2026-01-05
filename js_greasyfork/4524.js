// ==UserScript==
// @name Show Image Popup Library
// @namespace PSVScripts
// @description Библиотека функций PopupImage
// @version 0.0.0.5
// ==/UserScript==

/*
  handler =  function(SourceObject, CallBack, ImageUrl)
  { 
    ~CallBack(SourceObject, ImageUrl);
    if CanHandle
      return true;
    else
      return false
  }
*/

var win = unsafewindow;

if (!win.PSVScript_IPHandlers)
  win.PSVScript_IPHandlers = new Array();

var handlers = win.PSVScript_IPHandlers;

if (!win.PSVScript_IPHandler)
  win.PSVScript_IPHandler = PSVScript_IPHandler;

function PSVScript_IPHandler(SourceObject, CB, ImageUrl)
{
  for (var i=0; i< handlers.length; i++)
  if (handlers[i](SourceObject, CB, ImageUrl))
    break;
}
