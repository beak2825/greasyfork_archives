// ==UserScript==
// @name         微博内容抓取
// @namespace    wwww
// @license MPL
// @version      1.3
// @description  可以抓取个人主页的微博内容
// @match        https://www.weibo.com/u/*
// @match        https://weibo.com/u/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @require https://cdn.bootcss.com/blueimp-md5/2.12.0/js/md5.min.js
// @downloadURL https://update.greasyfork.org/scripts/444529/%E5%BE%AE%E5%8D%9A%E5%86%85%E5%AE%B9%E6%8A%93%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/444529/%E5%BE%AE%E5%8D%9A%E5%86%85%E5%AE%B9%E6%8A%93%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';


	var button = document.createElement("button"); //创建一个input对象（提示框按钮）
	button.id = "id001";
	button.textContent = "开始抓取";
	button.style.width = "90px";
	button.style.height = "30px";
	button.style.align = "center";
    button.style.backgroundColor = "#ea8011";

	//绑定按键点击功能
	button.onclick = function (){
		crawlData();
		return;
	};

    var box = document.getElementById('cniil_wza');
    //在浏览器控制台可以查看所有函数，ctrl+shift+I 调出控制台，在Console窗口进行实验测试
    box.parentNode.insertBefore(button, box)



function saveShareContent (content, fileName) {
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
var rickName ="微博数据爬虫";

function getByClass(oParent,sClass){
                     var aEle = oParent.getElementsByTagName('*');      //获取父级元素下的所有元素
                     var aResult = new Array();
                     for(var i =0; i<aEle.length; i++){
                           if(aEle[i].className == sClass){
                               aResult.push(aEle[i]);
                           }
                     }
                     return aResult;
}


function buildData(){
   var test=document.getElementsByTagName('html')[0]
   var textList = test.getElementsByClassName('vue-recycle-scroller__item-view');

   for (let index = 0; index < textList.length; index++) {
      var content = getByClass(textList[index],'wbpro-feed-content');
      var textstr = content[0].innerText;

      if(is_exsit(textstr)){
         console.log(textstr);
         continue;
      }
      var rickAll = getByClass(textList[index],'woo-box-flex')[0].innerText.split('\n')
      rickName = ''
      if(rickAll.length>0){rickName = rickAll[0];}
      var pushTime = '';
      if(rickAll.length>1){pushTime = rickAll[1];}


      var forwardNumAndcommentsNum = getByClass(textList[index],'toolbar_num_JXZul');
      var forwardNum = "0"
      var commentsNum = "0"
      if(forwardNumAndcommentsNum.length>0){
          forwardNum = forwardNumAndcommentsNum[0].innerText
      }
      if(forwardNumAndcommentsNum.length>1){
           commentsNum = forwardNumAndcommentsNum[1].innerText
      }



      var praiseNum = getByClass(textList[index],'woo-like-count')[0].innerText
      var imgs = getByClass(textList[index],'woo-picture-img');


      var text = new Object();
      text.baseURI = textList[index].baseURI;
      text.uid=textList[index].baseURI.replace(/[^0-9]/ig,"");
      text.content=textstr;
      text.nick = rickName;
      text.pushTime = pushTime;
      text.forwardNum = forwardNum;
      text.commentsNum = commentsNum;
      text.praiseNum = praiseNum;
      text.md5 = md5(textstr);
      text.imgsSrc = getImgsSrc(imgs);
      textArra.push(text);



       GM_xmlhttpRequest({
           method: "POST",
           url: "http://116.205.177.46:8088/weibo/save",
           headers: {
               "Content-Type": "application/json"
           },
           data:JSON.stringify(text),
           onload: function(response){

           },
           onerror: function(response){
               console.log("请求失败");
           }
       });

   }
   window.scroll({ top: t, left: 0, behavior: 'smooth' });t+=clientHeight;
}

function getImgsSrc(imgs){
    var imgsSrc = [];
    for (let index = 0; index < imgs.length; index++) {
         imgsSrc.push(imgs[index].src)
    }
    return imgsSrc;
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
    var repeat = prompt("请输入你要抓取的条数:","10");

    var timer = setInterval(function() {
        if (repeat <= textArra.length) {
            saveShareContent(JSON.stringify(textArra),rickName + ".json");
            clearInterval(timer);
        } else {
            //保存数据
            console.log(repeat);
            buildData();
        }
    }, 1500);
}




})();
