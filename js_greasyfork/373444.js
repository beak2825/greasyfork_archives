// ==UserScript==
// fork from https://greasyfork.org/zh-CN/scripts/23197-知乎-隐藏你屏蔽的人补完
// @name         zhihuBlockUsers
// @namespace    https://greasyfork.org/en/scripts/373444
// @version      0.191
// @description  block user in zhihu.
// @author       neo_max24
// @match        https://www.zhihu.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @require      https://greasyfork.org/scripts/23268-waitforkeyelements/code/waitForKeyElements.js?version=147835

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373444/zhihuBlockUsers.user.js
// @updateURL https://update.greasyfork.org/scripts/373444/zhihuBlockUsers.meta.js
// ==/UserScript==
var numberOfUserPerBlockPage=6

var blockUserList={};
if(localStorage.blockUserList != undefined)
{
    localStorage.blockUserList.split(',').forEach(function (e) {
        blockUserList[e] = true;
    });
}
function PickingBlockUser(hNode)
{

  //console.log('auto expand block edited botton');
  //console.log(hNode);
  var editedBottons=hNode.getElementsByClassName("Button Button--link Button--withLabel");
  //console.log(editedBottons);
  for (var i=0; i< editedBottons.length; i++)
  {
      if (editedBottons[i].innerText=="编辑")
      {
          //console.log(editedBottons[i]);
          editedBottons[i].click();
      }
  }

  // block user
  var blockUserPage=document.getElementsByClassName("UserPage")[0];
  var blockUserPageFooter=blockUserPage.getElementsByTagName('footer')[0];
  // for debug
  //console.log(blockUserPageFooter);

  var numberOfBlockUserStr=blockUserPageFooter.innerText;
  var numberOfBlockUser=parseInt(numberOfBlockUserStr.replace(/[^0-9]/ig,""));
  //console.log('numberOfBlockUser is '+numberOfBlockUser);
  var numberOfBlockUserPage=Math.ceil(numberOfBlockUser/numberOfUserPerBlockPage);
  //console.log('numberOfBlockUserPage is '+numberOfBlockUserPage);



  var allBlockUserList=new Array(numberOfBlockUser);
  var userPageI=0
  var timer=null
  timer = setInterval(function(){
          //console.log(userPageI,numberOfBlockUserPage);
          if (userPageI>numberOfBlockUserPage-1)
          {
              localStorage.blockUserList=allBlockUserList;
              // debug
              // console.log(allBlockUserList);
              // console.log(localStorage.blockUserList);
                for (var i=0; i< editedBottons.length; i++)
                {
                    editedBottons[i].click();
                }
              confirm('读取完成');
              clearInterval(timer);
          }
      else {
          var $userList = $('a.UserPageItem-link');
          for (var j=0;j<$userList.length;j++)
          {
              //console.log($userList[j]);
              allBlockUserList[(userPageI)*numberOfUserPerBlockPage+j]=$userList[j].getAttribute('href').replace('/people/', '');
          }
          var $nextPageBotton=$('.UserPage-pagerRight');
          $nextPageBotton.click();
      }
                userPageI++;
  },1000);
}

$(function() {
    //console.log('### start of my user script ###');
    if (window.location.href == 'https://www.zhihu.com/settings/filter'&&localStorage.blockUserList == undefined) {
       var hElement=document.getElementsByClassName("SettingsMain")[0].getElementsByTagName("h3");
       var hNode=$(hElement);
       //console.log('first setup');
       for (var i=0;i<hElement.length;i++)
       {
           if(hElement[i].innerText="用户黑名单")
           {
               hNode=hElement[i].parentElement.parentElement.parentElement;
               break;
           }
       }
		PickingBlockUser(hNode);
	}
	if (localStorage.blockUserList == undefined) {
		if (window.location.href != 'https://www.zhihu.com/settings/filter') {
			if (confirm('将要跳转到 https://www.zhihu.com/settings/filter 获取屏蔽列表')){
				window.location.href = 'https://www.zhihu.com/settings/filter';
			}
		}
	} else {
    //    console.log(localStorage.blockUserList);
    }
});

function addBlockedUserRefreshButton(jNode)
{
    if (window.location.href == 'https://www.zhihu.com/settings/filter')
    {
       var hElement=document.getElementsByClassName("SettingsMain")[0].getElementsByTagName("h3");
       var hNode=$(hElement);
       for (var i=0;i<hElement.length;i++)
       {
           if(hElement[i].innerText="用户黑名单")
           {
               hNode=hElement[i].parentElement.parentElement.parentElement;
               break;
           }
       }
       //console.log($(hNode));
       var buttonNode=document.createElement('button');
       var divNode=document.createElement('div');
       buttonNode.append(document.createTextNode('获取屏蔽列表'));
       buttonNode.type="button";
       buttonNode.id='blockedUserRefreshButton';
       //buttonNode.setAttribute("onclick","PickingBlockUser()");
       $(buttonNode).bind("click",function(){PickingBlockUser(hNode)});
       //buttonNode.onclick='PickingBlockUser()';
       divNode.append(buttonNode);
       divNode.style.display="inline-block";
       divNode.style.position='relative';
       divNode.style.right='-80%';
       divNode.style.fontStyle='normal';
       divNode.style.fontWeight='normal';
       divNode.style.color='#0084ff';
       divNode.style.fontSize='15px';
       hNode.append(divNode);

       //$('#blockedUserRefreshButton').on('click',PickingBlockUser());
       //console.log($(buttonNode));
    }
}

waitForKeyElements('div.SettingsMain',addBlockedUserRefreshButton);


function replaceContentWithText(node, text) {
    //console.log(node);

    node.children().hide();
    //newChildren.hide();
    var spanNode = document.createElement('span');
    var pNode=document.createElement('p');
    pNode.append(document.createTextNode(text));
    pNode.style.color="#999";
    spanNode.append(pNode);
    spanNode.className="RichText";
    spanNode.style.display="block";
    spanNode.style.lineHeight='4.0';
    spanNode.style.textAlign='center';
    //console.log(typeof(spanNode));
    //spanNode.style.color = "#999";
    node.append(spanNode);
}

function queryWithXPath(path,node){
    resultNode=null
    try{
        queryResult = document.evaluate(path,node);
        resultNode = queryResult.iterateNext();
    }
    catch(e){
        //console.log("tell me! why here has fucking problem?"+e)
    }
    return resultNode;
}

function checkAndBlock(username,blockMsg,jNode) {
    if(blockUserList[username] )
        replaceContentWithText(jNode,blockMsg);
}

//屏蔽评论
function processComment (jNode) {
    iNode=jNode[0];
    aNode = queryWithXPath(".//a[contains(@class,'UserLink-link')]",iNode);
    if(aNode)
        checkAndBlock(aNode.href.split('/').pop(),'这里有一条已被屏蔽的评论',jNode);
}
waitForKeyElements ("div.CommentItem", processComment);


//屏蔽回答和文章/
function processAnswer (jNode) {
    iNode=jNode[0];
    aNode = queryWithXPath(".//a[contains(@class,'UserLink-link')]",iNode);
    if(aNode)
    {
        //console.log(iNode);
        var temp=iNode.getElementsByClassName("ArticleItem")[0];
        if(temp)
        {
        var authorData=JSON.parse(temp.getAttribute('data-zop'));
        var authorName=authorData.authorName;
        checkAndBlock(aNode.href.split('/').pop(),'这里有一条已被屏蔽的 '+authorName+' 的文章',jNode);
        }
        else
        {
            temp=iNode.getElementsByClassName("AnswerItem")[0];
            if(temp)
            {
                //console.log(temp);
                authorData=JSON.parse(temp.getAttribute('data-zop'));
                authorName=authorData.authorName;
                checkAndBlock(aNode.href.split('/').pop(),'这里有一条已被屏蔽的 '+authorName+' 的回答',jNode);
            }
        }
    }
}
waitForKeyElements ("div.AnswerCard", processAnswer);
waitForKeyElements ("div.List-item", processAnswer);

//屏蔽时间线 new? no test 无法进入新版知乎发现
function processFeed (jNode) {
    iNode=jNode[0];
    aNode = queryWithXPath(".//a[contains(@class,'UserLink-link')]",iNode); //答主
    if(aNode == null)
        aNode = queryWithXPath(".//a[contains(@class,'zm-item-link-avatar')]",iNode); //赞同
    if(aNode)
        checkAndBlock(aNode.href.split('/').pop(),'这里有一条已被屏蔽的推送',jNode);
}
waitForKeyElements ("div.feed", processFeed);

//屏蔽时间线 old
function processFeed (jNode) {
    iNode=jNode[0];
    aNode = queryWithXPath(".//a[contains(@class,'author-link')]",iNode); //答主
    if(aNode == null)
        aNode = queryWithXPath(".//a[contains(@class,'zm-item-link-avatar')]",iNode); //赞同
    if(aNode)
    {
        var authorDiv=(iNode.getElementsByClassName('zm-item-rich-text')[0]);
        if (authorDiv)
        {
            var authorName=authorDiv.getAttribute('data-author-name');
            checkAndBlock(aNode.href.split('/').pop(),'这里有一条已被屏蔽的 '+authorName+' 的推送',jNode);
        } else
        {
            checkAndBlock(aNode.href.split('/').pop(),'这里有一条已被屏蔽的推送',jNode);
        }
    }
}
waitForKeyElements ("div.feed-item", processFeed);
