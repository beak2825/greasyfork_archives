// ==UserScript==
// @name        MidiShow 免积分直接下载 3-in-1
// @name:en     MidiShow credit-free direct download 3-in-1
// @namespace   saltfish.moe
// @description 从 MidiShow 网站的清单、搜索、MIDI文件页面免积分直接下载
// @description:en Download MIDI files from MidiShow credit-free on several types of pages.
// @include     http://www.midishow.com/search/*
// @include     http://www.midishow.com/midi/*
// @include     https://www.midishow.com/search/*
// @include     https://www.midishow.com/midi/*
// @version     2.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/375159/MidiShow%20%E5%85%8D%E7%A7%AF%E5%88%86%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD%203-in-1.user.js
// @updateURL https://update.greasyfork.org/scripts/375159/MidiShow%20%E5%85%8D%E7%A7%AF%E5%88%86%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD%203-in-1.meta.js
// ==/UserScript==
function getElementsByClass(searchClass) {
  if (document.getElementsByClassName)
  return document.getElementsByClassName(searchClass);
   else if (document.all) {
    var classElements = new Array();
    var allElements = document.all;
    for (i = 0, j = 0; i < allElements.length; i++) {
      if (allElements[i].className == searchClass) {
        classElements[j] = allElements[i];
        j++;
      }
    }
  } else if (document.getElementsByTagName) {
    var classElements = new Array();
    var allElements = document.getElementsByTagName('*');
    for (i = 0, j = 0; i < allElements.length; i++) {
      if (allElements[i].className == searchClass) {
        classElements[j] = allElements[i];
        j++;
      }
    }
  } else {
    return;
  }
  return classElements;
}
if (window.location.pathname.endsWith('.html')) { //midi file page
  var target = document.getElementById('options').childNodes[1].childNodes[0];
  var fileadd = window.location.href.replace('i/', 'i/file/').replace('.html', '.mid');
  target.removeAttribute('class');
  target.setAttribute('href', fileadd);
  target.innerHTML = '免积分下载';
  return 0;
} 
else if (window.location.pathname.startsWith('/midi/browse')) { // list page
  var items = getElementsByClass('hover_bg');
  var addlink = function (current) {
    var dlNode = document.createElement('A');
    var parent = current.childNodes[3];
    var downadd = parent.childNodes[0].getAttribute('href').replace('i/', 'i/file/').replace('.html', '.mid');
    dlNode.setAttribute('href', downadd);
    dlNode.innerHTML = '';
    dlNode.setAttribute('style', 'width: 12px; height: 12px; margin: 10px 4px 6px -2px; float: left; background-image: url(/images/icons.png); background-repeat: no-repeat;');
    parent.insertBefore(dlNode, parent.childNodes[0]);
  };
  for (var i = 0; i < items.length; i++) addlink(items.item(i));
  getElementsByClass('pager') [0].removeAttribute('class');
  return 0;
} 
else if (window.location.pathname == '/search/midi') { // search page
  var items = document.getElementsByTagName('OL') [0].getElementsByTagName('LI');
  var addlink = function (current) {
    var dlNode = document.createElement('A');
    var parent = current.childNodes[1];
    var downadd = parent.childNodes[3].getAttribute('href').replace('i/', 'i/file/').replace('.html', '.mid');
    dlNode.setAttribute('href', downadd);
    dlNode.innerHTML = '';
    dlNode.setAttribute('style', 'width: 12px; height: 12px; margin: 10px 0px -2px 8px; display: inline-block; background-image: url(/images/icons.png); background-repeat: no-repeat;');
    parent.appendChild(dlNode, parent.childNodes[3]);
  };
  for (var i = 0; i < items.length; i++) addlink(items.item(i));
  getElementsByClass('pager') [0].removeAttribute('class');
  return 0;
}
