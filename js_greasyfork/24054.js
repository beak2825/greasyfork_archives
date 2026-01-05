// ==UserScript==
// @name        nmbb
// @namespace   fishcan
// @description nimingban threads block
// @include     https://h.nimingban.com/*
// @version     1.2
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/24054/nmbb.user.js
// @updateURL https://update.greasyfork.org/scripts/24054/nmbb.meta.js
// ==/UserScript==

var blist = [];
blist = GM_getValue('blist',[]);

/************************
*截断超过长度的屏蔽列表
*************************/ 
if(blist.length>100){
  blist=blist.slice(0,100);
}
var allThreads = document.getElementsByClassName("h-threads-item");

for(var i = 0; i < allThreads.length; i++){
  var thisId = allThreads[i].getAttribute("data-threads-id");
  var thisNode = allThreads[i];
  var node = document.createElement("span");
  node.setAttribute("class","h-threads-info-report-btn");
  node.innerHTML = "[<a>屏蔽串</a>]";
  node.firstElementChild.setAttribute("id",thisId);
  var now = thisNode.firstElementChild.firstElementChild
  while(now != null){
    if(now.className == "h-threads-info"){
      now.appendChild(node);
      break;
    }else{now = now.nextElementSibling;}
  }
  document.getElementById(thisId).addEventListener('click', addBlock, true);
}

function removeThreads(){
  for(var i = 0; i < allThreads.length; i++){
    var thisId = allThreads[i].getAttribute("data-threads-id");
    var thisNode = allThreads[i];
    var thisIndex = blist.indexOf(thisId)
    if(thisIndex>-1){
      // 移除串内容改为替换为撤销按钮
      while(thisNode.hasChildNodes()){
        thisNode.removeChild(thisNode.lastChild)
      }
      var node = document.createElement("span");
      node.setAttribute("class","h-threads-info-reply-btn");
      node.innerHTML = "[<a>撤销屏蔽</a>]";
      node.firstElementChild.setAttribute("id",thisId);
      
      thisNode.appendChild(node)
      document.getElementById(thisId).addEventListener('click', cancelBlock, true)
      // 将被使用到的规则移到前面
      blist.splice(thisIndex,1);
      blist.unshift(thisId);
    }
  }
  GM_setValue('blist',blist)
}

function  addBlock(e){
  e.stopPropagation();
  var thisId=this.getAttribute("id");
  blist.push(thisId);
  GM_setValue('blist',blist)
  removeThreads();
}

function cancelBlock(e){
  e.stopPropagation();
  var thisId = this.getAttribute("id");
  var thisIndex = blist.indexOf(thisId);
  if(thisIndex>-1){
    blist.splice(thisIndex,1)
    GM_setValue('blist',blist)
  }
  location.reload(); 
}

removeThreads()
