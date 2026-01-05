// ==UserScript==
// @name         PTH Ignore thread
// @version      0.4
// @description  Hide threads in subforum view
// @author       Chameleon
// @include      http*://redacted.ch/forums.php?*action=viewforum*
// @include      http*://redacted.ch/forums.php
// @grant        none
// @namespace https://greasyfork.org/users/87476
// @downloadURL https://update.greasyfork.org/scripts/26198/PTH%20Ignore%20thread.user.js
// @updateURL https://update.greasyfork.org/scripts/26198/PTH%20Ignore%20thread.meta.js
// ==/UserScript==

(function() {
  'use strict';


  if(window.location.href.indexOf('viewforum') !== -1)
  {
    var showHidden=document.createElement('a');
    showHidden.href='javascript:void(0);';
    showHidden.setAttribute('class', 'brackets');
    document.getElementsByClassName('linkbox')[0].appendChild(showHidden);
    showHidden.setAttribute('id', 'ignoreToggle');
    showHidden.addEventListener('click', toggleHidden.bind(undefined, showHidden), false);

    hide();
  }
  else
    hideForum();
})();

function hideForum()
{
  var ignored=getIgnored();

  var trs=document.getElementsByTagName('tr');
  for(var i=0; i<trs.length; i++)
  {
    var tr=trs[i];
    var sp=tr.innerHTML.split('viewthread&amp;threadid=');
    if(sp.length == 1)
      continue;
    var threadId=parseInt(sp[1]);

    for(var j=0; j<ignored.length; j++)
    {
      if(threadId === ignored[j])
      {
        tr.getElementsByTagName('td')[2].innerHTML='';
      }
    }
  }
}

function toggleHidden(a)
{
  if(a.innerHTML.indexOf('Show') != -1)
  {
    a.innerHTML = a.innerHTML.replace(/Show/, "Hide");
    var trs=document.getElementsByClassName('forum_index')[0].getElementsByTagName('tr');
    for(var i=1; i<trs.length; i++)
    {
      trs[i].style.display='';
    }
  }
  else
  {
    a.innerHTML = a.innerHTML.replace(/Hide/, "Show");
    hide();
  }
}

function hide()
{
  var ignored=getIgnored();

  var count=0;

  var trs=document.getElementsByClassName('forum_index')[0].getElementsByTagName('tr');
  for(var i=1; i<trs.length; i++)
  {
    var tr=trs[i];
    var threadId=tr.getElementsByTagName('strong')[0].getElementsByTagName('a')[0].href.split("threadid=");
    if(threadId.length == 1)
      continue;
    threadId=parseInt(threadId[1]);

    var ig=false;
    for(var j=0; j<ignored.length; j++)
    {
      if(threadId === ignored[j])
      {
        count++;
        tr.style.display='none';
        ig=true;
        break;
      }
    }

    var hideLink=tr.getElementsByClassName('ignoreThread');
    if(hideLink.length === 0)
    {
      hideLink=document.createElement('a');
      hideLink.href='javascript:void(0);';
      hideLink.setAttribute('class', 'brackets ignoreThread');
      tr.getElementsByClassName('last_poster')[0].appendChild(hideLink);
      hideLink.addEventListener('click', hideToggle.bind(undefined, hideLink, threadId), false);
    }
    hideLink.innerHTML='-';
    if(ig)
      hideLink.innerHTML = '+';
  }

  var a=document.getElementById('ignoreToggle');
  if(count > 0)
  {
    a.style.display='';
    a.innerHTML = 'Show '+count+' hidden threads';
  }
  else
    a.style.display = 'none';
}

function hideToggle(a, threadId)
{
  var ignored=getIgnored();
  if(a.innerHTML.indexOf('-') != -1)
  {
    a.innerHTML='+';
    ignored.push(threadId);
    window.localStorage.ignoredThreads=JSON.stringify(ignored);
    hide();
  }
  else
  {
    a.innerHTML='-';
    var i=ignored.indexOf(threadId);
    if(i > -1)
    {
      ignored.splice(i, 1);
    }
    var as=document.getElementsByClassName('ignoreThread');
    var count=0;
    for(var i=0; i<as.length; i++)
    {
      if(as[i].innerHTML === '+')
        count++;
    }
    var a=document.getElementById('ignoreToggle');
    a.innerHTML = 'Hide '+count+' hidden threads';
    if(count === 0)
      a.style.display='none';
    window.localStorage.ignoredThreads=JSON.stringify(ignored);
  }
}

function getIgnored()
{
  var ignored=window.localStorage.ignoredThreads;
  if(!ignored)
    ignored=[];
  else
    ignored=JSON.parse(ignored);

  return ignored;
}
