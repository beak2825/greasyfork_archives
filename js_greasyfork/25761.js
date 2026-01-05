// ==UserScript==
// @name         PTH stats since last
// @version      1.4
// @description  Displays the changes in stats on PTH and PTP
// @author       Chameleon
// @include      http*://*redacted.ch/*
// @include      http*://*passthepopcorn.me/*
// @grant        GM_getValue
// @grant        GM_setValue
// @namespace https://greasyfork.org/users/87476
// @downloadURL https://update.greasyfork.org/scripts/25761/PTH%20stats%20since%20last.user.js
// @updateURL https://update.greasyfork.org/scripts/25761/PTH%20stats%20since%20last.meta.js
// ==/UserScript==

(function() {
  'use strict';

  if((window.location.href.indexOf("threadid=1781") != -1 && window.location.host.indexOf('redacted') != -1) || (window.location.href.indexOf("threadid=30532") != -1 && window.location.host.indexOf('popcorn') != -1))
    showSettings();

  var currentStats = {};
  var statspans = document.getElementById('userinfo_stats').querySelectorAll('span');
  currentStats.up = parseStats(statspans[0].textContent);
  currentStats.down = parseStats(statspans[1].textContent);
  currentStats.ratio = parseFloat(statspans[2].textContent);
  if(window.location.href.indexOf("redacted.ch") !== -1 && !isNaN(parseFloat(statspans[0].title)))
  {
    currentStats.up = parseStats(statspans[0].title);
    currentStats.down = parseStats(statspans[1].title);
    currentStats.ratio = parseFloat(statspans[2].title);
  }
  if(isNaN(currentStats.ratio))
    currentStats.ratio = 0;
  currentStats.time=(new Date())*1;

  var oldStats = window.localStorage.lastStats;

  if(!oldStats)
    oldStats = {up:currentStats.up, down:currentStats.down, ratio:currentStats.ratio};
  else
    oldStats = JSON.parse(oldStats);


  var settings = getSettings();

  if(settings.persistTime && oldStats.time)
  {
    var difTime = (new Date())-oldStats.time;
    if(difTime > settings.persistTime*60000)
      window.localStorage.lastStats = JSON.stringify(currentStats);
  }
  else
    window.localStorage.lastStats = JSON.stringify(currentStats);

  var difTime=false;
  if(oldStats.time)
  {
    difTime = (new Date())-oldStats.time;
  }

  var li=false;
  if(settings.showBuffer)
  {
    li=document.createElement('li');
    if(window.location.host.indexOf('popcorn') != -1)
      li.setAttribute('class', 'user-info-bar__item');
    var before=document.getElementById('stats_ratio');
    before.parentNode.insertBefore(li, before);
    var buffer=renderStats((currentStats.up/1.05)-currentStats.down);
    if(window.location.host.indexOf('redacted') != -1)
      buffer=renderStats((currentStats.up/0.6)-currentStats.down);
    li.innerHTML='Buffer: <span class="stat">'+buffer+'</span>';
    li.setAttribute('id', 'stats_buffer');
  }

  var change = {up:currentStats.up-oldStats.up, down:currentStats.down-oldStats.down, ratio:Math.round((currentStats.ratio-oldStats.ratio)*100)/100};
  if(settings.profileOnly && window.location.href.indexOf(document.getElementById('nav_userinfo').getElementsByTagName('a')[0].href) == -1)
    return;
  if(change.up != 0 || settings.noChange)
  {
    statspans[0].innerHTML += ' <span class="stats_last up">('+renderStats(change.up)+')</span>';
    if(difTime)
      statspans[0].title = (prettyTime(difTime))+' ago';
  }
  if(change.down != 0 || settings.noChange)
  {
    statspans[1].innerHTML += ' <span class="stats_last down">('+renderStats(change.down)+')</span>';
    if(difTime)
      statspans[1].title = (prettyTime(difTime))+' ago';
  }
  if((change.up != 0 || change.down != 0 || settings.noChange) && settings.showBuffer)
  {
    var span=li.getElementsByTagName('span')[0];
    var buffer=renderStats((change.up/1.05)-change.down);
    if(window.location.host.indexOf('redacted') != -1)
      buffer=renderStats((change.up/0.6)-change.down);
    span.innerHTML += ' <span class="stats_last buffer">('+buffer+')</span>';
    if(difTime)
      span.title = (prettyTime(difTime))+' ago';
  }
  if(change.ratio != 0 || settings.noChange)
  {
    statspans[2].innerHTML += ' <span class="stats_last ratio">('+change.ratio+')</span>';
    if(difTime)
      statspans[2].title = (prettyTime(difTime))+' ago';
  }

  if(settings.alert && (change.up != 0 || change.down != 0 || change.ratio != 0))
    alert('Up: '+renderStats(change.up)+', Down: '+renderStats(change.down)+', Buffer: '+renderStats((change.up/1.05)-change.down)+', Ratio: '+change.ratio);
})();

function prettyTime(time)
{
  var t=time;
  if(t/60000 < 1)
    return Math.round(time/1000)+'s';
  if(t/(60000*60) < 1)
    return Math.round(time/60000)+'m';
  if(t/(60000*60*24) < 1)
    return Math.round(time/(60000*60))+'h';
  return Math.round(time/(60000*60*24))+'d '+(Math.round((time%(60000*60*24))/(60000*60)))+'h';
}

function showSettings()
{
  var before = document.getElementsByClassName('forum_post')[0];
  var div = document.createElement('div');
  before.parentNode.insertBefore(div, before);
  div.setAttribute('style', 'width: 100%; text-align: center; padding-bottom: 10px;');
  div.setAttribute('class', 'box');
  div.innerHTML = '<h2>PTH stats since last Settings</h2><br />';
  var settings = getSettings();

  var a=document.createElement('a');
  a.href='javascript:void(0);';
  a.innerHTML = 'Show on no change: '+(settings.noChange ? 'On' : 'Off');
  a.addEventListener('click', changeSetting.bind(undefined, a), false);
  div.appendChild(a);
  div.appendChild(document.createElement('br'));

  var a=document.createElement('a');
  a.href='javascript:void(0);';
  a.innerHTML = 'Show on profile only: '+(settings.profileOnly ? 'On' : 'Off');
  a.addEventListener('click', changeSetting.bind(undefined, a), false);
  div.appendChild(a);
  div.appendChild(document.createElement('br'));

  var a=document.createElement('a');
  a.href='javascript:void(0);';
  a.innerHTML = 'Show buffer: '+(settings.showBuffer ? 'On' : 'Off');
  a.addEventListener('click', changeSetting.bind(undefined, a), false);
  div.appendChild(a);
  div.appendChild(document.createElement('br'));

  var a=document.createElement('a');
  a.href='javascript:void(0);';
  a.innerHTML = 'Alert on change: '+(settings.alert ? 'On' : 'Off');
  a.addEventListener('click', changeSetting.bind(undefined, a), false);
  div.appendChild(a);
  div.appendChild(document.createElement('br'));

  var input=document.createElement('input');
  input.setAttribute('placeholder', 'Persist Time');
  input.type='number';
  input.value = settings.persistTime ? settings.persistTime:'';
  div.appendChild(input);
  input.addEventListener('change', changeInput.bind(undefined, input), false);
  div.appendChild(document.createElement('br'));

  var a=document.createElement('a');
  a.href='javascript:void(0);';
  a.innerHTML = 'Save';
  div.appendChild(a);
  div.appendChild(document.createElement('br'));
}

function changeInput(input)
{
  var settings = getSettings();
  settings.persistTime=input.value;
  GM_setValue('lastStatsSettings', JSON.stringify(settings));
}

function changeSetting(a)
{
  var on=false;
  if(a.innerHTML.indexOf('On') == -1)
  {
    on=true;
    a.innerHTML = a.innerHTML.replace('Off', 'On');
  }
  else
  {
    a.innerHTML = a.innerHTML.replace('On', 'Off');
  }

  var settings = getSettings();
  if(a.innerHTML.indexOf('no change') != -1)
  {
    settings.noChange = on;
  }
  else if(a.innerHTML.indexOf('profile only') != -1)
  {
    settings.profileOnly = on;
  }
  else if(a.innerHTML.indexOf('Alert') != -1)
  {
    settings.alert = on;
  }
  else if(a.innerHTML.indexOf('Show buffer') != -1)
  {
    settings.showBuffer = on;
  }
  GM_setValue('lastStatsSettings', JSON.stringify(settings));
}

function getSettings()
{
  var settings = GM_getValue('lastStatsSettings', false);
  if(!settings)
  {
    settings = {noChange: false, profileOnly: false, alert: false, showBuffer: false, persistTime: ''};
  }
  else
    settings = JSON.parse(settings);
  return settings;
}

function renderStats(number)
{
  var amount = number;
  var pow = 0;
  for(var i=10; i<=50; i=i+10)
  {
    if(Math.abs(amount)/Math.pow(2, i) > 1)
      pow=i/10;
  }
  var suffixes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  if(window.location.host.indexOf('popcorn') != -1)
    suffixes = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'];
  return (Math.round(amount/Math.pow(2, pow*10)*100))/100+' '+suffixes[pow];
}

function parseStats(string)
{
  string=string.replace(/,/g, '');
  var suffixes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  if(window.location.host.indexOf('popcorn') != -1)
    suffixes = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'];
  var amount = parseFloat(string);
  if(string.indexOf(suffixes[1]) != -1)
    amount = amount*Math.pow(2, 10);
  else if(string.indexOf(suffixes[2]) != -1)
    amount = amount*Math.pow(2, 20);
  else if(string.indexOf(suffixes[3]) != -1)
    amount = amount*Math.pow(2, 30);
  else if(string.indexOf(suffixes[4]) != -1)
    amount = amount*Math.pow(2, 40);
  else if(string.indexOf(suffixes[5]) != -1)
    amount = amount*Math.pow(2, 50);
  return Math.round(amount);
}
