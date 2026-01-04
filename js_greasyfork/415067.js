// ==UserScript==
// @name        adnmb
// @namespace   fishcan
// @description nimingban threads block
// @include     https://adnmb3.com/f/*
// @include     https://adnmb2.com/f/*
// @version     0.3
// @downloadURL https://update.greasyfork.org/scripts/415067/adnmb.user.js
// @updateURL https://update.greasyfork.org/scripts/415067/adnmb.meta.js
// ==/UserScript==



var blist = [];
var raw_blist = localStorage.getItem('blist') || "[]";
blist = JSON.parse(raw_blist);

// localStorage.my_script_value = JSON.stringify([1,2,3,4]);

// var my_parsed_value = JSON.parse(localStorage.my_script_value);
// console.log(my_parsed_value);

console.log(blist);

/************************
*截断超过长度的屏蔽列表
h-threads-item:
  h-threads-item-main
      h-threads-info
          h-threads-info-id
*************************/ 
if(blist.length>100){
  blist=blist.slice(0,100);
}
var allThreads = document.getElementsByClassName("h-threads-item-main");
var allThreads = document.getElementsByClassName("h-threads-item");


for(var i = 0; i < allThreads.length; i++){
    var thisNode = allThreads[i];
    var thisNodeMain = thisNode.getElementsByClassName("h-threads-item-main")[0];
    var thisInfoNode = thisNodeMain.getElementsByClassName("h-threads-info")[0];
    var thisId = thisInfoNode.getElementsByClassName("h-threads-info-id")[0].innerText;

    var node = document.createElement("span");
    node.setAttribute("class","h-threads-info-report-btn");
    node.innerHTML = "[<a>屏蔽串</a>]";
    node.firstElementChild.setAttribute("id",thisId);
    thisInfoNode.appendChild(node);
    
    document.getElementById(thisId).addEventListener('click', addBlock, true);
}

function removeThreads(){
  for(var i = 0; i < allThreads.length; i++){
    var thisNode = allThreads[i];
    var thisNodeMain = thisNode.getElementsByClassName("h-threads-item-main")[0];
    var thisInfoNode = thisNodeMain.getElementsByClassName("h-threads-info")[0];
    var thisId = thisInfoNode.getElementsByClassName("h-threads-info-id")[0].innerText;

    var thisIndex = blist.indexOf(thisId)
    console.log(thisIndex);
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
  localStorage.blist = JSON.stringify(blist);
}

function  addBlock(e){
  e.stopPropagation();
  var thisId=this.getAttribute("id");
  blist.push(thisId);
  localStorage.blist = JSON.stringify(blist);
  removeThreads();
}

function cancelBlock(e){
  e.stopPropagation();
  var thisId = this.getAttribute("id");
  var thisIndex = blist.indexOf(thisId);
  if(thisIndex>-1){
    blist.splice(thisIndex,1)
    localStorage.blist = JSON.stringify(blist);
  }
  location.reload(); 
}

removeThreads()
