// ==UserScript==
// fork from https://greasyfork.org/zh-CN/scripts/10807-知乎-隐藏你屏蔽的人
// @name        知乎·隐藏你屏蔽的人补完
// @namespace   ZhihuHideBlockedUserExtended
// @description 彻底屏蔽被你隐藏的人的任何踪迹
// @include     http://www.zhihu.com/
// @include     http://www.zhihu.com/*
// @include     https://www.zhihu.com/
// @include     https://www.zhihu.com/*
// @version     2
// @require     https://greasyfork.org/scripts/23268-waitforkeyelements/code/waitForKeyElements.js?version=147835
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/23197/%E7%9F%A5%E4%B9%8E%C2%B7%E9%9A%90%E8%97%8F%E4%BD%A0%E5%B1%8F%E8%94%BD%E7%9A%84%E4%BA%BA%E8%A1%A5%E5%AE%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/23197/%E7%9F%A5%E4%B9%8E%C2%B7%E9%9A%90%E8%97%8F%E4%BD%A0%E5%B1%8F%E8%94%BD%E7%9A%84%E4%BA%BA%E8%A1%A5%E5%AE%8C.meta.js
// ==/UserScript==
var sitePrefix = "https://www.zhihu.com/";
var userlist = {}
localStorage.UserList.split(',').forEach(function (e) {
    userlist[e] = true;
});
function BlockPeople()
{
  var $userlist = $('.blocked-users .item-card a.avatar-link');
  var username = new Array($userlist.length);
  for (i = 0; i < $userlist.length; i++)
  {
    username[i] = $userlist.eq(i).attr('href').replace('/people/', '');
  }
  localStorage.UserList = username;
}
$(function () {
  if (window.location.href == 'https://www.zhihu.com/settings/filter')
  {
    BlockPeople();
  }
  if (localStorage.UserList == undefined)
  {
    if (window.location.href != 'https://www.zhihu.com/settings/filter')
    {
      if (confirm('将要跳转到 https://www.zhihu.com/settings/filter 获取屏蔽列表'))
      {
        window.location.href = 'https://www.zhihu.com/settings/filter';
      }
    }
  }
});

function replaceContentWithText(node, text) {
    node.children().hide();
    var spanNode = document.createElement('span');
    spanNode.append( document.createTextNode(text) );
    spanNode.style.color = "#999";
    node.append(spanNode);
}

function queryWithXPath(path,node){
    resultNode=null
    try{
        queryResult = document.evaluate(path,node);
        resultNode = queryResult.iterateNext();
    }
    catch(e){
        console.log("tell me! why here has fucking problem?"+e)
    }
    return resultNode;
}

function checkAndBlock(username,blockMsg,jNode) {
    if( userlist[username] ) 
        replaceContentWithText(jNode,blockMsg);
}

//屏蔽评论
function processComment (jNode) {
    iNode=jNode[0];
    aNode = queryWithXPath(".//a[contains(@class,'_CommentItem_avatarLink')]",iNode);
    if(aNode)
        checkAndBlock(aNode.href.split('/').pop(),'这里有一条已被block的评论',jNode);
}
waitForKeyElements ("div._CommentItem_root_PQNS", processComment);
//屏蔽信息
function processNotify (jNode) {
    iNode=jNode[0];
    aNode = queryWithXPath(".//a[contains(@class,'author-link')]",iNode);
    if(aNode)
        checkAndBlock(aNode.href.split('/').pop(),'这里有一条已被block的信息',jNode);
}
waitForKeyElements ("div.zm-noti7-content-item", processNotify);
//屏蔽回答
function processAnswer (jNode) {
    iNode=jNode[0];
    aNode = queryWithXPath(".//a[contains(@class,'author-link')]",iNode);
    if(aNode)
        checkAndBlock(aNode.href.split('/').pop(),'这里有一条已被block的回答',jNode);
}
waitForKeyElements ("div.zm-item-answer", processAnswer);
//屏蔽时间线
function processFeed (jNode) {
    iNode=jNode[0];
    aNode = queryWithXPath(".//a[contains(@class,'author-link')]",iNode); //答主
    if(aNode == null)
        aNode = queryWithXPath(".//a[contains(@class,'zm-item-link-avatar')]",iNode); //赞同
    if(aNode)
        checkAndBlock(aNode.href.split('/').pop(),'这里有一条已被block的推送',jNode);
}
waitForKeyElements ("div.feed-item", processFeed);
