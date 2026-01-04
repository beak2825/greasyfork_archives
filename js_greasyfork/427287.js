// ==UserScript==
// @name         PTP Checker Quick Navigation Tilde Version
// @version      1.5.01
// @description  Allow quick moving between unchecked torrents on PTP
// @author       Chameleon
// @include      http*://*passthepopcorn.me/*
// @grant        none
// @namespace https://greasyfork.org/users/778136
// @downloadURL https://update.greasyfork.org/scripts/427287/PTP%20Checker%20Quick%20Navigation%20Tilde%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/427287/PTP%20Checker%20Quick%20Navigation%20Tilde%20Version.meta.js
// ==/UserScript==

var bg="0,0,0";
(function() {
  'use strict';
  var color=window.getComputedStyle(document.getElementsByClassName('user-info-bar__link')[0]).color.split('(')[1].split(', ');
  var avg=(parseInt(color[0])+parseInt(color[1])+parseInt(color[2]))/3;
  if(avg<85)
  {
    bg="255,255,255";
  }

  if(window.location.href.indexOf('unchecked.php')!==-1)
  {
    fillFromNonGP(document);
    var links=window.localStorage.quickLinks?JSON.parse(window.localStorage.quickLinks):[];
    var p=document.getElementsByClassName('search-form__footer__buttons')[0].parentNode;
    var d=document.createElement('div');
    p.appendChild(d);
    var found=false;
    for(var i=0; i<links.length; i++)
    {
      if(links[i].link==window.location.href)
        found=true;
      var d1=document.createElement('div');
      d.appendChild(d1);
      var input=document.createElement('input');
      d1.appendChild(input);
      input.value=links[i].link;
      input.addEventListener('keyup', saveLinks.bind(undefined, d));
      input.setAttribute('style', 'width:440px;');
      var input=document.createElement('input');
      d1.appendChild(input);
      input.value=links[i].name;
      input.addEventListener('keyup', saveLinks.bind(undefined, d));
    }
    if(!found)
    {
      var d1=document.createElement('div');
      d.appendChild(d1);
      var input=document.createElement('input');
      d1.appendChild(input);
      input.value=window.location.href;
      input.addEventListener('keyup', saveLinks.bind(undefined, d));
      input.setAttribute('style', 'width:440px;');
      var input=document.createElement('input');
      d1.appendChild(input);
      d1.placeholder='Name of quicklink';
      input.value='';
      input.addEventListener('keyup', saveLinks.bind(undefined, d));
    }
  }
  if(window.location.href.indexOf('gp_review')!==-1)
  {
    var a=document.createElement('a');
    a.href='javascript:void(0);';
    a.innerHTML='[Fill Queue]';
    var linkbox=document.getElementsByClassName('linkbox')[0];
    linkbox.appendChild(document.createTextNode(' '));
    linkbox.appendChild(a);
    a.addEventListener('click', fillgp);
  }

  var a=document.createElement('a');
  a.innerHTML='Checker Navigation';
  a.href='javascript:void(0);';
  var before=document.getElementById('userinfo_username');
  before.parentNode.insertBefore(a, before);
  a.addEventListener('click', function(){
    if(window.localStorage.showCheckerNavigation=='false')
    {
      window.localStorage.showCheckerNavigation='true';
    }
    else
    {
      window.localStorage.showCheckerNavigation='false';
    }
    showCheckerNavigation();
  });

  showCheckerNavigation();

  document.onkeydown=function(e)
  {
    e = e || window.event;
    if(e.keyCode === 192)
      {
        goToNext();
      }
  }
})();

function saveLinks(div)
{
  var inputs=div.getElementsByTagName('input');
  var links=[];
  for(var i=0; i<inputs.length; i=i+2)
  {
    if(inputs[i].value=="" || inputs[i+1].value=="")
      continue;
    links.push({link:inputs[i].value, name:inputs[i+1].value});
  }
  window.localStorage.quickLinks=JSON.stringify(links);
  showCheckerNavigation();
}

function fillFromNonGP(doc)
{
    var torrents=[];
    var trs=doc.getElementsByTagName('tr');
    for(var i=0; i<trs.length; i++)
    {
      try
      {
        var tds=trs[i].getElementsByTagName('td');
        var torrent={};
        torrent.a=tds[0].innerHTML;
        torrent.codecContainer=tds[1].innerHTML;
        torrent.uploaded=tds[2].innerHTML;
        torrent.uploader=tds[3].innerHTML;
        torrent.seederCount=tds[4].innerHTML;
        torrent.leecherCount=tds[5].innerHTML;
        torrent.note=tds[6].innerHTML;
        torrents.push(torrent);
      } catch(e){}
    }
    window.localStorage.checkerTorrents=JSON.stringify({updated:(new Date()).getTime(), torrents:torrents, type:'nongp', location:window.location.href});
  showCheckerNavigation();
}

function fillgp()
{
  document.getElementById('content').style.overflow='initial';
  var trs=document.getElementsByTagName('tr');
  trs[0].setAttribute('finished', 'false');
  startFill(0, trs);
}
function startFill(i, trs)
{
  var tr=trs[i];
  var skip=false;
  if(tr.innerHTML.indexOf('torrents.php')==-1)
    skip=true;
  if(tr.getAttribute('class')=='navigation')
    skip=true;
  if(!skip)
  {
    var a=document.createElement('a');
    a.innerHTML='Start >';
    a.href='javascript:void(0);';
    var td=tr.firstElementChild;
    td.style.position='relative';
    td.appendChild(a);
    a.setAttribute('style', 'position:absolute; left:-10px; border-radius:4px; background:rgba('+bg+',0.7);');
    var width=a.clientWidth+6;
    a.style.left='-'+width+'px';
    a.addEventListener('click', pickedStartLocationGP.bind(undefined, i, trs));
    a.setAttribute('class', 'pickLocation');
  }
  if(i<trs.length && trs[0].getAttribute('finished')!=='true')
  {
    window.setTimeout(startFill.bind(undefined, i+1, trs), 0);
  }
}

function pickedStartLocationGP(index, trs)
{
  trs[0].setAttribute('finished', 'true');
  var as=document.querySelectorAll('.pickLocation');
  for(var i=0; i<as.length; i++)
  {
    as[i].parentNode.removeChild(as[i]);
  }
  var torrents=[];
  for(var i=index; i<trs.length && i<index+100; i++)
  {
    torrents.push(trs[i].outerHTML);
  }
  window.localStorage.checkerTorrents=JSON.stringify({updated:(new Date()).getTime(), torrents:torrents, type:'gp'});
  showCheckerNavigation();
}

function showCheckerNavigation()
{
  var div=document.getElementById('checkerNavigation');
  if(window.localStorage.showCheckerNavigation=='false')
  {
    if(div)
      div.parentNode.removeChild(div);
    return;
  }

  if(!div)
  {
    div=document.createElement('div');
    div.id='checkerNavigation';
    document.body.appendChild(div);
    div.setAttribute('style', 'position:fixed; top:40px; width:100%; background:rgba('+bg+',0.7); padding:10px; left:0; text-align:center;');
  }

  var links=window.localStorage.quickLinks?JSON.parse(window.localStorage.quickLinks):[];
  var r=window.localStorage.checkerTorrents ? JSON.parse(window.localStorage.checkerTorrents):{torrents:[]};
  if(r.torrents.length==0)
  {
    div.innerHTML="No torrents in buffer, visit <a href='/unchecked.php'>unchecked.php</a> to refill.<br />";
    for(var i=0; i<links.length; i++)
    {
      div.innerHTML+='<a href="'+links[i].link+'">'+links[i].name+'</a> ';
    }
    return;
  }

  div.innerHTML=r.torrents.length+' torrents in buffer, which was updated '+time(r.updated)+' ago<br />';
  if(r.type=='nongp')
  {
    nongp(div, r);
  }
  else if(r.type=='gp')
  {
    gp(div, r);
  }
}

function gp(div, r)
{
  var t=r.torrents[0];
  var temp=document.createElement('div');
  temp.innerHTML=t;
  var table=document.createElement('table');
  table.setAttribute('style', 'width:1080px; margin:auto; text-align:left;');
  table.setAttribute('class', 'table table--panel-like table--bordered table--striped dataTable');
  div.appendChild(table);
  table.innerHTML='<thead><tr role="row"><th style="width:60px;">Location</th>'
    +'<th rowspan="1" colspan="1" style="width: 539px;">Torrent</th>'
    +'<th rowspan="1" colspan="1" style="width: 97px;">Uploader</th>'
    +'<th rowspan="1" colspan="1" style="width: 64px;">Added by</th>'
    +'<th rowspan="1" colspan="1" style="width: 56px;">Add date</th>'
    +'<th rowspan="1" colspan="1" style="width: 45px;">Thread</th>'
    +'<th rowspan="1" colspan="1" style="width: 50px;">My vote</th>'
    +'<th rowspan="1" colspan="1" style="width: 100px;">Other votes</th></tr><thead><tbody></tbody>';

  if(compareLinks(window.location.href, temp.getElementsByTagName('a')[0].href))
  {
    table.tBodies[0].innerHTML=t;
    var tr=table.tBodies[0].getElementsByTagName('tr')[0];
    tr.setAttribute('class', 'navigation');
    var td=document.createElement('td');
    tr.insertBefore(td, tr.firstElementChild);
    td.innerHTML='Current';
    t=r.torrents[1];
  }
  table.tBodies[0].innerHTML+=t;
  var tr=table.tBodies[0].getElementsByTagName('tr');
  tr=tr[tr.length-1];
  tr.setAttribute('class', 'navigation');
  var td=document.createElement('td');
  tr.insertBefore(td, tr.firstElementChild);
  var a=document.createElement('a');
  td.appendChild(a);
  a.innerHTML='Next&nbsp;(~)';
  a.addEventListener('click', goToNext);
  var d=document.createElement('div');
  div.appendChild(d);
  var links=window.localStorage.quickLinks?JSON.parse(window.localStorage.quickLinks):[];
  for(var i=0; i<links.length; i++)
  {
    d.innerHTML+='<a href="'+links[i].link+'">'+links[i].name+'</a> ';
  }
}

function nongp(div, r)
{
  var t=r.torrents[0];
  var temp=document.createElement('div');
  temp.innerHTML=t.a;
  //if(window.location.href==temp.firstElementChild.href.split('&unchecked')[0])
  if(compareLinks(window.location.href, temp.getElementsByTagName('a')[0].href))
  {
    div.innerHTML+='Current torrent: '+t.a+', '+t.codecContainer+', '+t.uploaded+', '+t.uploader+', '+t.seederCount+'↑, '+t.leecherCount+'↓, '+t.note+'<br />';
    t=r.torrents[1];
  }
  div.innerHTML+='Next torrent: '+t.a+', '+t.codecContainer+', '+t.uploaded+', '+t.uploader+', '+t.seederCount+'↑, '+t.leecherCount+'↓, '+t.note+' - ';
  var a=document.createElement('a');
  a.innerHTML='Go to next (~)';
  a.href='javascript:void(0);';
  div.appendChild(a);
  a.addEventListener('click', goToNext);
  if(window.location.href.indexOf('unchecked.php')!==-1)
  {
    div.appendChild(document.createElement('br'));
    var a=document.createElement('a');
    div.appendChild(a);
    a.innerHTML='Pick start location';
    a.href='javascript:void(0);';
    a.addEventListener('click', pickStartLocation);
    a.setAttribute('class', 'pickLocation');
  }
  var d=document.createElement('div');
  div.appendChild(d);
  var links=window.localStorage.quickLinks?JSON.parse(window.localStorage.quickLinks):[];
  for(var i=0; i<links.length; i++)
  {
    var a=document.createElement('a');
    if(i>0)
      div.appendChild(document.createTextNode(', '));
    div.appendChild(a);
    //a.setAttribute('style', 'display:block;');
    a.innerHTML=links[i].name;
    a.href='javascript:void(0);';
    a.addEventListener('click', refill.bind(undefined, links[i].link));
    //d.innerHTML+='<a href="'+links[i].link+'">'+links[i].name+'</a> ';
  }

  if(r.location)
  {
    var a=document.createElement('a');
    if(links.length==0)
      a.setAttribute('style', 'display:block;');
    else
      div.appendChild(document.createTextNode(', '));
    div.appendChild(a);
    a.innerHTML='Refill from last';
    a.href='javascript:void(0);';
    a.addEventListener('click', refill.bind(undefined, r.location));
  }
}

function refill(location)
{
  var xhr = new XMLHttpRequest();
  xhr.open('GET', location);
  xhr.onreadystatechange = function()
  {
    if(xhr.readyState == 4 && xhr.status==200)
    {
      var newDoc=document.implementation.createHTMLDocument();
      newDoc.body.innerHTML=xhr.responseText;
      fillFromNonGP(newDoc);
    }
  }
  xhr.send();
}

function compareLinks(a, b)
{
  try
  {
    var aGroupId=parseInt(a.split('id=')[1]);
    var bGroupId=parseInt(b.split('id=')[1]);
    //var aTorrentId=parseInt(a.split('torrentid=')[1]);
    //var bTorrentId=parseInt(b.split('torrentid=')[1]);
    if(aGroupId==bGroupId)// && aTorrentId==bTorrentId)
      return true;
    return false;
  } catch(e) { return false; }
}

function pickStartLocation()
{
  document.getElementById('content').style.overflow='initial';
  var trs=document.getElementsByTagName('tr');
  var count=0;
  for(var i=0; i<trs.length; i++)
  {
    var tr=trs[i];
    if(tr.innerHTML.indexOf('torrents.php')==-1)
      continue;
    count++;
    var a=document.createElement('a');
    a.innerHTML='Start >';
    a.href='javascript:void(0);';
    var td=tr.firstElementChild;
    td.style.position='relative';
    td.appendChild(a);
    a.setAttribute('style', 'position:absolute; left:-10px; border-radius:4px; background:rgba('+bg+',0.7);');
    var width=a.clientWidth+6;
    a.style.left='-'+width+'px';
    a.addEventListener('click', pickedStartLocation.bind(undefined, count));
    a.setAttribute('class', 'pickLocation');
  }
}

function pickedStartLocation(index)
{
  var r=window.localStorage.checkerTorrents ? JSON.parse(window.localStorage.checkerTorrents):{torrents:[]};
  r.torrents.splice(0,index-1);
  window.localStorage.checkerTorrents=JSON.stringify(r);
  showCheckerNavigation();
  var as=document.querySelectorAll('.pickLocation');
  for(var i=0; i<as.length; i++)
  {
    as[i].parentNode.removeChild(as[i]);
  }
}

function goToNext()
{
  var r=window.localStorage.checkerTorrents ? JSON.parse(window.localStorage.checkerTorrents):{torrents:[]};
  if(r.torrents.length==0)
  {
    showCheckerNavigation();
    return;
  }

  var temp=document.createElement('div');
  if(r.type=='gp')
  {
    temp.innerHTML=r.torrents[0];
    if(compareLinks(window.location.href, temp.getElementsByTagName('a')[0].href))
    {
      r.torrents.splice(0,1);
      window.localStorage.checkerTorrents=JSON.stringify(r);
    }
    if(r.torrents.length==0)
    {
      showCheckerNavigation();
      return;
    }
    var div=document.createElement('div');
    div.innerHTML=r.torrents[0];
    document.body.appendChild(div);
    var a=div.getElementsByTagName('a')[0];
    a.click();
    return;
  }
  temp.innerHTML=r.torrents[0].a;
  //if(window.location.href==temp.firstElementChild.href.split('&unchecked')[0])
  if(compareLinks(window.location.href, temp.getElementsByTagName('a')[0].href))
  {
    r.torrents.splice(0,1);
    window.localStorage.checkerTorrents=JSON.stringify(r);
  }
  if(r.torrents.length==0)
  {
    showCheckerNavigation();
    return;
  }
  var div=document.createElement('div');
  div.innerHTML=r.torrents[0].a;
  document.body.appendChild(div);
  var a=div.getElementsByTagName('a')[0];
  a.href=a.href.split('&unchecked')[0];
  a.click();
}
/*
      torrent.a=tds[0].innerHTML;
      torrent.codecContainer=tds[1].innerHTML;
      torrent.uploaded=tds[2].innerHTML;
      torrent.uploader=tds[3].innerHTML;
      torrent.seederCount=tds[4].innerHTML;
      torrent.leecherCount=tds[5].innerHTML;
      torrent.note=tds[6].innerHTML;
      */

function time(t)
{
  var now=(new Date()).getTime();
  var elapsed=(now-t)/1000;
  if(elapsed/60<1)
    return Math.round(elapsed)+' seconds';
  else if(elapsed/(60*60)<1)
    return Math.round(elapsed/60)+' minutes';
  else if(elapsed/(60*60*24)<1)
    return Math.round(elapsed/(60*60))+' hours';
  else
    return Math.round(elapsed/(60*60*24))+' days';
}