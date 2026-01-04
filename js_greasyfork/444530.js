// ==UserScript==
// @name        知乎话题内容抓取
// @namespace    rock
// @version      1.0.3
// @description  可以抓取知乎话题下面的所有回答和评论
// @license MPL
// @author       rock
// @match        https://www.zhihu.com/question/**
// @match        https://www.zhihu.com/people/**
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @require https://cdn.bootcss.com/blueimp-md5/2.12.0/js/md5.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/444530/%E7%9F%A5%E4%B9%8E%E8%AF%9D%E9%A2%98%E5%86%85%E5%AE%B9%E6%8A%93%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/444530/%E7%9F%A5%E4%B9%8E%E8%AF%9D%E9%A2%98%E5%86%85%E5%AE%B9%E6%8A%93%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    var button = document.createElement("button"); //创建一个input对象（提示框按钮）
    button.id = "id001";
    button.textContent = "开始抓取";
    button.style.width = "96px";
    button.style.height = "32px";
    button.style.align = "center";
    button.style.backgroundColor = "#005ce6";
    button.style.color = "#fff";
    button.style.borderRadius = "3px";
    button.style.zIndex=9999;
    button.style.position='absolute';
    button.style.right='20px';
    button.style.top='10px';


    //绑定按键点击功能
    button.onclick = function (){
        crawlData();
        return;
    };
    //在浏览器控制台可以查看所有函数，ctrl+shift+I 调出控制台，在Console窗口进行实验测试
    //box.parentNode.appendChild(button)
document.body.appendChild(button);


function saveShareContent(content, fileName) {
    let downLink = document.createElement('a')
    downLink.download = fileName
    //字符内容转换为blod地址
    let blob = new Blob([content])
    downLink.href = URL.createObjectURL(blob)
    // 链接插入到页面
    document.body.appendChild(downLink)
    downLink.click()
    // 移除下载链接
    document.body.removeChild(downLink)
}

var clientHeight = document.body.clientHeight
var textArra = [];
var t=0;
var rickName ="知乎数据爬虫";
var h1 = "未知"

function getByClass(oParent,sClass){
    var aEle = oParent.getElementsByTagName('*');//获取父级元素下的所有元素
    var aResult = new Array();
    for(var i =0; i<aEle.length; i++){
         if(aEle[i].className == sClass){
               aResult.push(aEle[i]);
         }
    }
    return aResult;
}

function comment(response,test){

    var commentStr = '';

     for (let index = 0; index < response.data.length; index++) {
          commentStr +=(response.data[index].name+"："+response.data[index].value + '\n')
      }


    var inputs = getByClass(test,'public-DraftStyleDefault-block public-DraftStyleDefault-ltr')
    inputs[0].innerText = commentStr
    var oks = getByClass(test,'Button CommentEditorV2-singleButton Button--primary Button--blue')
    oks[0].click()

}

function buildData(topic){
   var test=document.getElementsByTagName('html')[0]
   var textList = test.getElementsByClassName('List-item');


   for (let index = 0; index < textList.length; index++) {
      var textstr = textList[index].innerText;
      var bottons = getByClass(textList[index],'Button ContentItem-action Button--plain Button--withIcon Button--withLabel')


      var items = getByClass(textList[index],'Button ContentItem-more Button--plain')

      for(let i = 0;i< items.length;i++){
            if( items[i].innerText.indexOf('阅读全文')!=-1 ){
                  items[i].click()
                   break;
            }
      }
      var commentsNum = 0

      for(let i = 0;i< bottons.length;i++){
            if( bottons[i].innerText.indexOf('条评论')!=-1 ){
                  commentsNum = bottons[i].innerText.indexOf('条评论')
                   bottons[i].click();
                   break;
            }
      }

      if(is_exsit(textstr)){
         console.log('重复');
         continue;
      }


      rickName = getByClass(textList[index],'UserLink-link')[1].innerText
      var praiseNum = getByClass(textList[index],'Button VoteButton VoteButton--up')[0].innerText
      var text = new Object();
      text.content=replaceAll(textstr);
      text.topic = topic
      text.topicMd5 = md5(topic)
      text.baseURI = textList[index].baseURI;
      text.nick = rickName;
      text.commentsNum = commentsNum;
      text.praiseNum = praiseNum;
      text.md5 = md5(textstr);
      var nestComments = getByClass(textList[0],'NestComment')
      if(nestComments!=null || nestComments.length==0){
          nestComments = getByClass(test,'NestComment');
      }
      text.comments=getCommentList(nestComments);
      textArra.push(text);


       GM_xmlhttpRequest({
           method: "POST",
           url: "http://116.205.177.46:8088/zhihu/save",
           headers: {
               "Content-Type": "application/json"
           },
           data:JSON.stringify(text),
           onload: function(response){
                 comment(JSON.parse(response.response),textList[index])
           },
           onerror: function(response){
               console.log("请求失败");
           }
       });
   }
   window.scroll({ top: t, left: 0, behavior: 'smooth' });t+=clientHeight;
}

function replaceAll(str){
      str = str.replace(/[ ]|[\r\n]/g,"");
      str = str.replace(/[回复踩举报]|[赞回复踩举报]/g,"");
      return str
}


function getCommentList(commentList){
    var comments = [];
    for (let index = 0; index < commentList.length; index++) {
         comments.push(replaceAll(commentList[index].innerText))
    }
    return comments;
}

function is_exsit(str){
     for (let index = 0; index < textArra.length; index++) {
         if(textArra[index].md5 == md5(str)){
            return true;
         }
      }

      return false;
}

function crawlData(){
    var repeat = prompt("请输入你要抓取的条数:","100");

    var test=document.getElementsByTagName('html')[0];
    h1 = getByClass(test,'QuestionHeader-title')[0];
    if(h1 == null){
        h1 = getByClass(test,'ProfileHeader-name')[0];
    }
    var allAnswer = getByClass(test,'QuestionMainAction ViewAll-QuestionMainAction')
    if(allAnswer.length>0){
        allAnswer[0].click();
    }

    var timer = setInterval(function() {
        if (repeat <= textArra.length) {
            saveShareContent(JSON.stringify(textArra),h1.innerText + ".json");
            clearInterval(timer);
        } else {
            //保存数据

            buildData(h1.innerText);
        }
    }, 2000);
}


})();