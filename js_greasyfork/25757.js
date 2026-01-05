// ==UserScript==
// @name         PTH Remove required ratio if it's 0.00
// @version      0.33
// @description  Remove required ratio either when it's 0.00 or always
// @author       Chameleon
// @include      http*://redacted.ch/*
// @grant        none
// @namespace https://greasyfork.org/users/87476
// @downloadURL https://update.greasyfork.org/scripts/25757/PTH%20Remove%20required%20ratio%20if%20it%27s%20000.user.js
// @updateURL https://update.greasyfork.org/scripts/25757/PTH%20Remove%20required%20ratio%20if%20it%27s%20000.meta.js
// ==/UserScript==

(function() {
  'use strict';

  debug('start debug');
  debug('threadid: '+(window.location.href.indexOf('threadid=2646') != -1));
  debug('user.php?id=: '+(window.location.href.indexOf('user.php?id=') != -1));
  try
  {
    var settings=getSettings();
    var headerRatio = document.getElementById('stats_required');
    if(headerRatio.textContent.replace(/[\t,\n]/g, "") == "Required:0.00" || settings.hideAlways)
      headerRatio.style.display = 'none';
    if(window.location.href.indexOf("user.php?id=") != -1)
    {
      var stats=document.getElementsByClassName('stats')[0].getElementsByTagName('li')[5];
      if(stats.textContent == "Required Ratio: 0.00" || settings.hideAlways)
        stats.style.display = 'none';
    }
    if(window.location.href.indexOf('threadid=2646') != -1)
      showSettings();
  }
  catch(error)
  {
    debug("Error: "+error.message);
  }
})();

function showSettings()
{
  debug('in settings');
  var div=document.getElementById('chameleonSettings');
  debug('div exists: '+(!(!div)));
  if(!div)
  {
    var before = document.getElementsByClassName('forum_post')[0];
    div = document.createElement('div');
    div.setAttribute('id', 'chameleonSettings');
    before.parentNode.insertBefore(div, before);
    div.setAttribute('style', 'width: 100%; text-align: center; padding-bottom: 10px;');
    div.setAttribute('class', 'box');
  }
  div.innerHTML = '<h2>Remove Required Ratio Settings</h2><br />';
  var settings = getSettings();

  var a=document.createElement('a');
  a.href='javascript:void(0);';
  a.innerHTML = 'Always hide: '+(settings.hideAlways ? 'On':'Off');
  a.addEventListener('click', changeSettings.bind(undefined, a, div), false);
  div.appendChild(a);
  div.appendChild(document.createElement('br'));

  var a=document.createElement('a');
  a.href='javascript:void(0);';
  a.innerHTML = 'Debug: '+(settings.debug ? 'On':'Off');
  a.addEventListener('click', changeSettings.bind(undefined, a, div), false);
  div.appendChild(a);
  div.appendChild(document.createElement('br'));
}

function changeSettings(a, div)
{
  var settings=getSettings();
  var as=div.getElementsByTagName('a');
  if(a == as[0])
  {
    if(as[0].innerHTML.indexOf('Off') != -1) 
    {
      settings.hideAlways = true;
    }
    else
      settings.hideAlways = false;
  }
  if(a == as[1])
  {
    if(as[1].innerHTML.indexOf('Off') != -1) 
    {
      settings.debug = true;
    }
    else
      settings.debug = false;
  }

  window.localStorage.removeRequiredRatioSettings = JSON.stringify(settings);
  showSettings();
}

function debug(text)
{
  var settings=getSettings();
  if(!settings.debug)
    return;

  var debugDiv=document.getElementById('ChameleonDebug');
  if(!debugDiv)
  {
    debugDiv=document.createElement('div');
    document.body.appendChild(debugDiv);
    debugDiv.setAttribute('id', 'ChameleonDebug');
    debugDiv.setAttribute('style', 'position: absolute; top: 50px; left: 50px; width: '+(document.body.clientWidth-100)+'px; background: rgba(0,0,0,0.7); text-align: center; font-size: 2em;');
  }
  var d=document.createElement('div');
  d.innerHTML=text;
  debugDiv.appendChild(d);
}

function getSettings()
{
  var settings = window.localStorage.removeRequiredRatioSettings;
  if(!settings)
  {
    settings = {hideAlways:false, debug:false};
  }
  else
    settings = JSON.parse(settings);
  return settings;
}
