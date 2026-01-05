// ==UserScript==
// @name        nmbhs
// @namespace   fishcan
// @description hide sage threads
// @include     https://h.nimingban.com/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/24096/nmbhs.user.js
// @updateURL https://update.greasyfork.org/scripts/24096/nmbhs.meta.js
// ==/UserScript==


var sageThreads = [];
var sageIndex = [];

var sageIcon = document.getElementsByClassName("uk-icon-thumbs-down");
// 由于js的动态性，如果dom中节点消失了，那么其对应的集合也会消失；
//（其实这是我瞎编的，但是一下代码的效果上来说就是这样）
while(sageIcon.length > 0){
  var thisNode = sageIcon[0].parentNode.parentNode;
  var thisId = thisNode.getAttribute("data-threads-id");
  if(thisId == null){
    // 针对红名的标了sage的置顶串，其实其内部的结构和一般的sage并不一样
    sageIcon[0].setAttribute("class","uk-icon-plus-square");
    continue;
  }
  var cNode = document.createElement("div");
  cNode.setAttribute("class","h-threads-item uk-clearfix");
  var node = document.createElement("span");
  var blank = document.createElement("span");
  node.setAttribute("class","h-threads-info-reply-btn uk-text-danger uk-text-bold");
  node.innerHTML = "[<a style='color:#d85030'>==sage==</a>]";
  node.firstElementChild.setAttribute("id",thisId);
  cNode.appendChild(node);
  sageThreads.push(thisNode.cloneNode(true));
  sageIndex.push(thisId);
  thisNode.parentNode.replaceChild(cNode,thisNode);
  document.getElementById(thisId).addEventListener('click', toggleHideSage, true);
}

function toggleHideSage(e){
  var thisThreads = this.parentNode.parentNode
  e.stopPropagation();
  var index = sageIndex.indexOf(this.getAttribute("id"));
  if(thisThreads.firstElementChild.nextElementSibling == null){
    thisThreads.appendChild(sageThreads[index]);
  }else{
    thisThreads.removeChild(thisThreads.firstElementChild.nextElementSibling);
  }
}
