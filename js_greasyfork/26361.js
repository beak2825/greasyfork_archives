// ==UserScript==
// @name         PTH Hide quote trains
// @version      0.5
// @description  Hide nested quotes with a link to show them
// @author       Chameleon
// @include      http*://redacted.ch/*
// @grant        none
// @namespace https://greasyfork.org/users/87476
// @downloadURL https://update.greasyfork.org/scripts/26361/PTH%20Hide%20quote%20trains.user.js
// @updateURL https://update.greasyfork.org/scripts/26361/PTH%20Hide%20quote%20trains.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var settings=getSettings();

  if(window.location.href.indexOf("threadid=7721") != -1)
  {
    showSettings();
  }

  var quotes=document.getElementsByTagName('blockquote');
  var reQuotes=[];
  for(var i=0; i<quotes.length; i++)
  {
    var q=quotes[i];
    var e=q.firstElementChild;
    var depth=getDepth(q);
    if(depth >= settings.depth)
    {
      while(e)
      {
        if(e.tagName=="BLOCKQUOTE")
        {
          var a=document.createElement('a');
          a.href='javascript:void(0);';
          a.setAttribute('style', 'margin-right: 5px;'); 
          a.setAttribute('class', 'showQuotes');
          a.innerHTML='Show Quote';
          a.addEventListener('click', toggleQuote.bind(undefined, a, e), false);
          e.parentNode.insertBefore(a, e);
          e.parentNode.insertBefore(document.createElement('br'), e);
          e.style.display='none';
        }

        e=e.nextElementSibling;
      }
    }
    if(depth===0)
    {
      reQuotes.push(q);
    }
  }
  for(var i=0; i<reQuotes.length; i++)
  {
    var q=reQuotes[i];
    var hidden=q.getElementsByClassName('showQuotes');
    if(hidden.length > 0)
    {
      var a=document.createElement('a');
      a.innerHTML='Toggle quotes';
      a.href='javascript:void(0);';
      //a.setAttribute('style', 'margin-left: 5px;'); 
      q.parentNode.insertBefore(a, q);
      a.addEventListener('click', toggleQuotes.bind(undefined, q), false);
    }
  }
})();

function showSettings()
{
  var div=document.getElementById('ChameleonSettings');
  if(!div)
  {
    var before = document.getElementsByClassName('forum_post')[0];
    div = document.createElement('div');
    div.setAttribute('id', 'ChameleonSettings');
    before.parentNode.insertBefore(div, before);
    div.setAttribute('style', 'width: 100%; text-align: center; padding-bottom: 10px;');
    div.setAttribute('class', 'box');
  }
  div.innerHTML = '<h2>Hide quote trains Settings</h2><br />';
  var settings = getSettings();

  var input=document.createElement('input');
  input.placeholder = 'Quote depth';
  input.value=settings.depth ? settings.depth:'';
  input.addEventListener('change', changeSettings.bind(undefined, undefined, div), false);
  div.appendChild(input);
  div.appendChild(document.createElement('br'));

  var a=document.createElement('a');
  div.appendChild(a);
  a.href='javascript:void(0);';
  a.innerHTML = 'Save';
}

function changeSettings(a, div)
{
  var settings=getSettings();
  /*var as=div.getElementsByTagName('a');

  if(a == as[0])
  {
    if(as[0].innerHTML.indexOf('Off') != -1) 
    {
      settings.masterPlayer = true;
    }
    else
      settings.masterPlayer = false;
  }*/

  var inputs=div.getElementsByTagName('input');
  settings.depth=inputs[0].value;

  window.localStorage.hideQuoteTrains = JSON.stringify(settings);
  showSettings();
}

function getSettings()
{
  var settings = window.localStorage.hideQuoteTrains;
  if(!settings)
  {
    settings = {depth:''};
  }
  else
    settings = JSON.parse(settings);
  return settings;
}

function toggleQuotes(q)
{
  var as=q.getElementsByClassName('showQuotes');
  var open=0;
  for(var i=0; i<as.length; i++)
  {
    if(as[i].innerHTML.indexOf('Hide') != -1)
      open++;
  }
  var html='Show Quote';
  if(open == as.length)
  {
    html='Hide Quote';
  }
  for(var i=0; i<as.length; i++)
  {
    as[i].innerHTML = html;
    as[i].click();
  }
}

function getDepth(q)
{
  var count=0;
  var parent=q.parentNode;
  while(parent)
  {
    if(parent.tagName=="BLOCKQUOTE")
      count++;
    parent=parent.parentNode;
  }
  return count;
}

function toggleQuote(a, q)
{
  if(a.innerHTML.indexOf('Show') != -1)
  {
    a.innerHTML='Hide Quote';
    q.style.display='';
  }
  else
  {
    a.innerHTML = 'Show Quote';
    q.style.display='none';
  }
}
