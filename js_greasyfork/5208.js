// ==UserScript==
// @name        bdwmBlacklist
// @namespace   bdwmBlacklist
// @description blacklist the links from certain boards in the main page.
// @include     *bdwm.net/bbs/main0.php
// @version     0.2a
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/5208/bdwmBlacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/5208/bdwmBlacklist.meta.js
// ==/UserScript==

function boardNameFromLink(link) {
  var idx = link.indexOf('board=');
  if (idx==-1) {
    return null;
  } else {
    return link.substring(idx+6).match(/\w+/)[0];
  }
}

function nodeWithClass(node, classKey) {
  // find an ancestor of a node
  // whose class name contains classKey
  myNode = node;
  if (node==null) {
    console.log('null node');
    return null;
  }
  // find the ancestor with certain class
  while (node.className!=null && node.className.indexOf(classKey)<0) {
    node = node.parentNode;
  }
  
  if (node.className==null) {
    console.log('error finding class, return the node instead');
    return myNode;
  } else {
    console.log('Class ' + node.className + ' found.');
    return node;
  }
}

function blacklistBoard(boardlist) {
  console.log('Going to block '+boardlist.length+' boards.');
  var blackList = {};
  for (var i in boardlist) {
    blackList[boardlist[i]] = true;
  }
  var links = document.getElementsByTagName('a');
  var nodesToRemove = [];
  console.log(links.length+' links detected.');

  for (var i in links) {
    console.log('Link: ' + links[i].href);
    if (links[i].href == null) continue;
    var bName = boardNameFromLink(links[i].href);
    //    console.log('Find board: ' + bName);
    if (bName != null && blackList[bName]) {
      var spanNode = nodeWithClass(links[i], 'Rank');
      if (spanNode != null && nodesToRemove.indexOf(spanNode)<0) {
        // not exist, add it
        console.log('Going to remove class: ' + spanNode.className);
        nodesToRemove.push(spanNode);
      }
    }
  }

  console.log('Removing...');
  for (var i in nodesToRemove) {
    console.log('Removing class: ' + nodesToRemove[i].className);
    nodesToRemove[i].parentNode.removeChild(nodesToRemove[i]);
  }
}

blacklistBoard(['Boy', 'SecretGarden', 'PieBridge', 'Triangle', "Joke"]);
