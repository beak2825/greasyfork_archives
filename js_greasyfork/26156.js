// ==UserScript==
// @name         Gazelle progress to next Class
// @version      0.6
// @description  Shows the progress to the next user classes
// @author       arch
// @match        http*://*apollo.rip/user.php?id=*
// @match        http*://*passtheheadphones.me/user.php?id=*
// @grant        none
// @namespace https://greasyfork.org/users/90188
// @downloadURL https://update.greasyfork.org/scripts/26156/Gazelle%20progress%20to%20next%20Class.user.js
// @updateURL https://update.greasyfork.org/scripts/26156/Gazelle%20progress%20to%20next%20Class.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var ourId=document.getElementById('nav_userinfo').getElementsByTagName('a')[0].href.split('?id=')[1];
  var r=new RegExp(ourId+'$');
  if(window.location.href.match(r) === null)
    return;

  var div=document.createElement('div');
  div.setAttribute('class', 'box box_info box_userinfo_nextclass');
  var before=document.getElementsByClassName('box_userinfo_percentile')[0];
  before.parentNode.insertBefore(div, before);

  renderStats();
})();

function renderStats(index)
{

  var requirements=[
    {title:'User', time: 0, upload: 0, ratio:0, torrents:0, perfectFLACs: 0, uniqueGroups: 0},
    {title:'Member', time: 604800, upload: 10737418240, torrents:0, ratio:0.65, perfectFLACs: 0, uniqueGroups: 0},
    {title:'Power User', time: 1209600, upload: 26843545600, torrents:10, ratio:1.05, perfectFLACs: 0, uniqueGroups: 0},
    {title:'Elite', time: 2419200, upload: 107374182400, ratio:1.05, torrents:50, perfectFLACs: 0, uniqueGroups: 0},
    {title:'Torrent Master', time: 4838400, upload: 536870912000, ratio:1.05, torrents:500, perfectFLACs: 0, uniqueGroups: 0},
    {title:'Power TM', time: 4838400, upload: 536870912000, ratio:1.05, torrents:500, perfectFLACs: 0, uniqueGroups: 500},
    {title:'Elite TM', time: 4838400, upload: 536870912000, ratio:1.05, torrents:500, perfectFLACs: 500, uniqueGroups: 500},
  ];

  var div=document.getElementsByClassName('box_userinfo_nextclass')[0];
  div.innerHTML = '';

  var header=document.createElement('div');
  header.setAttribute('class', 'head colhead_dark');
  header.innerHTML = 'Class Progress (';
  div.appendChild(header);
  
  var hideCompleted=window.localStorage.classProgressShowComplete != "false";
  
  var a=document.createElement('a');
  header.appendChild(a);
  a.innerHTML = (hideCompleted ? 'Show':'Hide')+' completed';
  a.href='javascript:void(0);';
  
  header.appendChild(document.createTextNode(')'));

  var time=document.getElementsByClassName('time')[0];
  if(!time.title)
  {
    div.innerHTML += 'Styled tooltips must be turned off for this to work. (This can be found in your profile settings)';
    return;
  }

  var s = getCurrentStats();
  if(isNaN(index))
    index=findNextClass(s, requirements);
  if(index >= requirements.length)
    index=0;
  a.addEventListener('click', toggleCompleted.bind(undefined, index, hideCompleted), false);

  var r=requirements[index];

  var stats=document.createElement('ul');
  stats.setAttribute('class', 'stats nobullet');
  div.appendChild(stats);

  var li=document.createElement('li');
  stats.appendChild(li);
  li.appendChild(document.createTextNode('Class: '));
  var a=document.createElement('a');
  li.appendChild(a);
  a.href='javascript:void(0);';
  a.innerHTML = r.title;
  a.addEventListener('click', renderStats.bind(undefined, index+1), false);

  var li=document.createElement('li');
  stats.appendChild(li);
  var percent=Math.round((s.ratio/r.ratio)*100);
  var span=document.createElement('span');
  if(percent >= 100 || s.ratio == 'Infinite')
  {
    span.style.color='green';
    if(hideCompleted)
      li.setAttribute('style', 'display:none;');
  }
  if(s.ratio == "Infinite")
    percent='∞';
  else
    percent=percent.toLocaleString();
  li.innerHTML = 'Ratio: ';
  span.innerHTML=(s.ratio == "Infinite" ? '∞':(Math.floor(s.ratio*100))/100)+' / '+r.ratio+' ('+percent+'%)';
  li.appendChild(span);

  var li=document.createElement('li');
  stats.appendChild(li);
  if(r.time === 0)
    percent='∞';
  else
    percent=Math.round((s.time/r.time)*100);
  var span=document.createElement('span');
  if(r.time === 0 || percent >= 100)
  {
    span.style.color='green';
    if(hideCompleted)
      li.setAttribute('style', 'display:none;');
  }
  if(r.time !== 0)
    percent=percent.toLocaleString();
  li.innerHTML = 'Time: ';
  span.innerHTML=prettyTime(s.time)+' / '+prettyTime(r.time)+' ('+percent+'%)';
  li.appendChild(span);

  var li=document.createElement('li');
  stats.appendChild(li);
  if(r.upload === 0)
    percent='∞';
  else
    percent=Math.round((s.upload/r.upload)*100);
  var span=document.createElement('span');
  if(r.upload === 0 || percent >= 100)
  {
    span.style.color='green';
    if(hideCompleted)
      li.setAttribute('style', 'display:none;');
  }
  if(r.upload !== 0)
    percent=percent.toLocaleString();
  li.innerHTML = 'Upload: ';
  span.innerHTML=prettySize(s.upload)+' / '+prettySize(r.upload)+' ('+percent+'%)';
  li.appendChild(span);

  var li=document.createElement('li');
  stats.appendChild(li);
  if(r.torrents === 0)
    percent='∞';
  else
    percent=Math.round((s.torrents/r.torrents)*100);
  var span=document.createElement('span');
  if(r.torrents === 0 || percent >= 100)
  {
    span.style.color='green';
    if(hideCompleted)
      li.setAttribute('style', 'display:none;');
  }
  if(r.upload !== 0)
    percent=percent.toLocaleString();
  li.innerHTML = 'Torrents: ';
  span.innerHTML=s.torrents.toLocaleString()+' / '+r.torrents+' ('+percent+'%)';
  li.appendChild(span);

  var li=document.createElement('li');
  stats.appendChild(li);
  if(r.uniqueGroups === 0)
    percent='∞';
  else
    percent=Math.round((s.uniqueGroups/r.uniqueGroups)*100);
  var span=document.createElement('span');
  if(r.uniqueGroups === 0 || percent >= 100)
  {
    span.style.color='green';
    if(hideCompleted)
      li.setAttribute('style', 'display:none;');
  }
  if(r.uniqueGroups !== 0)
    percent=percent.toLocaleString();
  li.innerHTML = 'Unique Groups: ';
  span.innerHTML=s.uniqueGroups.toLocaleString()+' / '+r.uniqueGroups+' ('+percent+'%)';
  li.appendChild(span);

  var li=document.createElement('li');
  stats.appendChild(li);
  if(r.perfectFLACs === 0)
    percent='∞';
  else
    percent=Math.round((s.perfectFLACs/r.perfectFLACs)*100);
  var span=document.createElement('span');
  if(r.perfectFLACs === 0 || percent >= 100)
  {
    span.style.color='green';
    if(hideCompleted)
      li.setAttribute('style', 'display:none;');
  }
  if(r.perfectFLACs !== 0)
    percent=percent.toLocaleString();
  li.innerHTML = 'Perfect FLACs: ';
  span.innerHTML=s.perfectFLACs.toLocaleString()+' / '+r.perfectFLACs+' ('+percent+'%)';
  li.appendChild(span);
}

function toggleCompleted(index, state)
{
  if(state)
  {
    window.localStorage.classProgressShowComplete = "false";
  }
  else
  {
    window.localStorage.classProgressShowComplete = "true";
  }
  
  renderStats(index);
}

function prettyTime(time)
{
  var weeks=Math.floor(time/604800);
  var days=Math.floor((time%604800)/86400);
  var res=weeks+'w'+(days !== 0 ?', '+days+'d':'');
  return res;
}

function findNextClass(s, requirements)
{
  var i=requirements.length-1;
  for(; i>-1; i--)
  {
    var r=requirements[i];
    if(s.time >= r.time && s.upload >= r.upload && (s.ratio == "Infinite" || s.ratio >= r.ratio) && s.torrents >= r.torrents && s.perfectFLACs >= r.perfectFLACs && s.uniqueGroups >= r.uniqueGroups)
      break;
  }
  i++;
  if(i>=requirements.length)
    i=requirements.length-1;
  return i;
}

function getCurrentStats()
{
  var time=((new Date())-(new Date(document.getElementsByClassName('time')[0].title+' UTC')))/1000;
  var upload=unPretty(document.getElementsByClassName('box_userinfo_stats')[0].getElementsByTagName('li')[2].title);
  var torrents=parseInt(document.getElementsByClassName('box_userinfo_percentile')[0].getElementsByTagName('li')[2].title.replace(',', ''));
  var ratio=document.getElementsByClassName('box_userinfo_stats')[0].getElementsByTagName('li')[4].getElementsByTagName('span')[0].title.replace(',', '');
  var perfectFLACs=parseInt(document.getElementById('comm_perfectflac').textContent.split(': ')[1].replace(',', ''));
  var uniqueGroups=parseInt(document.getElementById('comm_uniquegroup').textContent.split(': ')[1].replace(',', ''));

  if(ratio != "Infinite")
    ratio = parseFloat(ratio);

  return {time:time, upload:upload, torrents:torrents, ratio:ratio, perfectFLACs:perfectFLACs, uniqueGroups:uniqueGroups};
}

function unPretty(size)
{
  var s=parseFloat(size);
  if(size.indexOf('KB') != -1)
    s = s*Math.pow(2, 10);
  else if(size.indexOf('MB') != -1)
    s = s*Math.pow(2, 20);
  else if(size.indexOf('GB') != -1)
    s = s*Math.pow(2, 30);
  else if(size.indexOf('TB') != -1)
    s = s*Math.pow(2, 40);
  else if(size.indexOf('PB') != -1)
    s = s*Math.pow(2, 50);

  return Math.round(s);
}

function prettySize(size)
{
  var newSize=size;
  var i=0;
  while(newSize > 1)
  {
    i++;
    newSize = size/Math.pow(2, i*10);
  }
  i--;
  if(i<0)
    i=0;
  newSize=size/Math.pow(2, (i)*10);

  var suffixes=["B", "KB", "MB", "GB", "TB", "PB"];

  newSize = Math.round(newSize*100)/100;
  newSize = newSize+' '+suffixes[i];
  return newSize;
}