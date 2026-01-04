// ==UserScript==
// @name         RED de-colourise Next Userclass
// @version      0.1
// @description  Remove the red/green of the Next Userclass and also add a Hide/Show completed link
// @author       Chameleon
// @include      http*://*redacted.ch/user.php?id=*
// @grant        none
// @namespace https://greasyfork.org/users/87476
// @downloadURL https://update.greasyfork.org/scripts/374510/RED%20de-colourise%20Next%20Userclass.user.js
// @updateURL https://update.greasyfork.org/scripts/374510/RED%20de-colourise%20Next%20Userclass.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var progressDiv=document.getElementsByClassName('box_userinfo_progress');
  if(progressDiv.length==0)
    return;

  progressDiv=progressDiv[0];
  var hideCompleted=window.localStorage.classProgressShowComplete != "false";
  var lis=progressDiv.getElementsByTagName('li');
  hideShow(lis, hideCompleted);
  for(var i=0; i<lis.length; i++)
  {
    var sp=lis[i].getElementsByTagName('span')[0];
    if(!sp)
      continue;
    var c=sp.getAttribute('class');
    sp.setAttribute('class', c+' nocolor');
  }

  var a=document.createElement('a');
  progressDiv.firstElementChild.appendChild(document.createTextNode(' ('));
  progressDiv.firstElementChild.appendChild(a);
  progressDiv.firstElementChild.appendChild(document.createTextNode(')'));
  a.innerHTML = (hideCompleted ? 'Show':'Hide')+' completed';
  a.href='javascript:void(0);';
  a.addEventListener('click', toggleCompleted.bind(undefined, a, lis), false);

  var style=document.createElement('style');
  document.head.appendChild(style);
  style.innerHTML='.nocolor { color:'+getComputedStyle(document.body).color+' !important;}';
})();

function toggleCompleted(a, lis)
{
  var hideCompleted=window.localStorage.classProgressShowComplete != "false";
  if(hideCompleted)
  {
    window.localStorage.classProgressShowComplete = "false";
    a.innerHTML='Hide completed';
  }
  else
  {
    window.localStorage.classProgressShowComplete = "true";
    a.innerHTML='Show completed';
  }
  hideShow(lis, !hideCompleted);
}

function hideShow(lis, hideCompleted)
{
  for(var i=0; i<lis.length; i++)
  {
    var li=lis[i];
    if(hideCompleted && li.innerHTML.indexOf('class="r99')!=-1)
    {
      li.style.display='none';
    }
    else
    {
      li.style.display='';
    }
  }
}