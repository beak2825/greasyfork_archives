//
// ==UserScript==
// @name           youtube_captions_links
// @author         Pahan https://greasyfork.org/uk/users/18377-pahan
// @namespace      hwm_pahan
// @description    Добавление ссылок с временем в субтитры 
// @homepage       https://greasyfork.org/uk/users/18377-pahan
// @icon           http://dcdn.heroeswm.ru/avatars/30/nc-5/30547.gif
// @version        1.00
// @encoding 	   utf-8
// @include        *.youtube.com/watch*
// @grant          GM_deleteValue
// @grant          GM_getValue
// @grant          GM_listValues
// @grant          GM_setValue
// @grant          GM_addStyle
// @grant          GM_log
// @grant          GM_openInTab
// @grant          GM_xmlhttpRequest
// @grant          GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/16208/youtube_captions_links.user.js
// @updateURL https://update.greasyfork.org/scripts/16208/youtube_captions_links.meta.js
// ==/UserScript==

function URLAttrValueGet(attr_name, aurl)
{
 attr_name = attr_name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
 var regexS = "[\\?&]" + attr_name + "=([^&#]*)";
 var regex = new RegExp( regexS );
 var results = regex.exec( aurl );
 if( results == null )
  return "";
 else
  return results[1];
}

function addEvent(elem, evType, fn)
{
  //    elem["on" + evType] = fn;
  if (elem.addEventListener) {
    elem.addEventListener(evType, fn, false);
  }
  else if (elem.attachEvent) {
    elem.attachEvent("on" + evType, fn);
  }
  else {
    elem["on" + evType] = fn;
  }
}

function GetHref(ATime)
{
  var LTimeArr = ATime.split(':');
  var LResult = '/watch?v=' + URLAttrValueGet('v', location.href);
  if (LTimeArr && (LTimeArr.length == 2))
  {
    var LSec = parseInt(LTimeArr[0]) * 60 + parseInt(LTimeArr[1]);
    LResult += '&t=' + LSec;
  }
  return LResult;
}

function AddLinksMain()
{                              
  var LElem;
  var LTime;
  var LHref;
  var LNextSibling;
  var LElems = document.querySelectorAll('div[class="caption-line-time"]');
  if (LElems)
  {
    for(var i = LElems.length - 1; i >= 0; i--)
    {      
      LElem = LElems[i];
      LTime = LElem.innerHTML;             
      LHref = GetHref(LTime);
      LNextSibling = LElem.nextSibling;
      LNextSibling.innerHTML = '<a href="' + LHref + '">' + LTime + '</a> ' + LNextSibling.innerHTML;
      
      LElem.parentNode.removeChild(LElem);
    }  
  }
}

function GetButton()
{
  var LElems = document.querySelectorAll('button[data-trigger-for="action-panel-transcript"]');
  if (LElems && (LElems.length == 1))
  {
    return LElems[0];
  }
}

function Main()
{
  var LButton = GetButton();
  if (LButton)
  {
    addEvent(LButton, 'click', function(){ setTimeout(function(){ AddLinksMain(); }, 3000) });
  }
}

Main();