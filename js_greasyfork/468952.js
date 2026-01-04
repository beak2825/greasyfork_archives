// ==UserScript==
// @name     snahp.eu Forum Sort Topics by Filesize
// @grant    none
// @match    *://fora.snahp.eu/*
// @description Adds a button to sort search results according to their filesize
// @license MIT
// @version 0.0.1.20230618222101
// @namespace https://greasyfork.org/users/941655
// @downloadURL https://update.greasyfork.org/scripts/468952/snahpeu%20Forum%20Sort%20Topics%20by%20Filesize.user.js
// @updateURL https://update.greasyfork.org/scripts/468952/snahpeu%20Forum%20Sort%20Topics%20by%20Filesize.meta.js
// ==/UserScript==

function sortAllLists(){
  Array.from(document.getElementsByClassName('topics')).forEach(sortByFileSize);
  return;
}

function sortByFileSize(list){
  Array.from(list.getElementsByClassName('row')).sort(compareSize).forEach(li => list.appendChild(li));
  return;
}

function compareSize(a,b){
  var regex = /\d+(\.\d+)? *(kb|mb|gb|tb)/i;
  if (regex.exec(a.getElementsByClassName('topictitle')[0].innerHTML) !== null){
    var sizeA = regex.exec(a.getElementsByClassName('topictitle')[0].innerHTML)[0];
    sizeA = sizeA.replace(/ *kb/i, ' * 1000');
    sizeA = sizeA.replace(/ *mb/i, ' * 1000000');
    sizeA = sizeA.replace(/ *gb/i, ' * 1000000000');
    sizeA = sizeA.replace(/ *tb/i, ' * 1000000000000');
    sizeA = eval(sizeA);
  } else
    sizeA = Number.MAX_SAFE_INTEGER;
  if (regex.exec(b.getElementsByClassName('topictitle')[0].innerHTML) !== null){
    var sizeB = regex.exec(b.getElementsByClassName('topictitle')[0].innerHTML)[0];
    sizeB = sizeB.replace(/ *kb/i, ' * 1000');
    sizeB = sizeB.replace(/ *mb/i, ' * 1000000');
    sizeB = sizeB.replace(/ *gb/i, ' * 1000000000');
    sizeB = sizeB.replace(/ *tb/i, ' * 1000000000000');
    sizeB = eval(sizeB);
  } else
    sizeB = Number.MAX_SAFE_INTEGER;
  return sizeA - sizeB;
}

if (document.getElementsByClassName('topics').length > 0){
  var element = document.getElementsByClassName("bar-top");
  for (var i = 0; i < element.length; i++) {
    element[i].insertAdjacentHTML("beforeend", "<button class='button' id='SortAllTopics" + i + "'>Filesize Sort</button>");
    document.getElementById("SortAllTopics" + i).onclick = sortAllLists;
  }
}