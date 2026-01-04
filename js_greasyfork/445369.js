// ==UserScript==
// @name        美团开店宝-夜间根据关键字匹配对应话术自动回复插件-医美版-dianping.com
// @namespace   1933987037@qq.com
// @include     https://g.dianping.com/app/gfe-common-pc-im-merchant/index.html
// @license MIT
// @grant       no
// @version     1.5
// @run-at      document-end
// @description 这是一个自动回复插件的工具
// @require    http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/445369/%E7%BE%8E%E5%9B%A2%E5%BC%80%E5%BA%97%E5%AE%9D-%E5%A4%9C%E9%97%B4%E6%A0%B9%E6%8D%AE%E5%85%B3%E9%94%AE%E5%AD%97%E5%8C%B9%E9%85%8D%E5%AF%B9%E5%BA%94%E8%AF%9D%E6%9C%AF%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D%E6%8F%92%E4%BB%B6-%E5%8C%BB%E7%BE%8E%E7%89%88-dianpingcom.user.js
// @updateURL https://update.greasyfork.org/scripts/445369/%E7%BE%8E%E5%9B%A2%E5%BC%80%E5%BA%97%E5%AE%9D-%E5%A4%9C%E9%97%B4%E6%A0%B9%E6%8D%AE%E5%85%B3%E9%94%AE%E5%AD%97%E5%8C%B9%E9%85%8D%E5%AF%B9%E5%BA%94%E8%AF%9D%E6%9C%AF%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D%E6%8F%92%E4%BB%B6-%E5%8C%BB%E7%BE%8E%E7%89%88-dianpingcom.meta.js
// ==/UserScript==

(function() {


    //var user_accept=$('.message-text:last').html();//接收用户发送内容
   var pipei_keyWord=['洗牙','补牙','价格','拔牙'];//匹配关键字------------关键字个数要跟自定义回复个数匹配，可以自行增加

   var reply_keyWord=[];//回复内容-----------------------------------------关键字个数要跟自定义回复个数匹配，可以自行增加
   reply_keyWord[0]='洗牙很干净';//自定义回复
   reply_keyWord[1]='补牙效果很好';//自定义回复
   reply_keyWord[2]='价格仅需1280';//自定义回复
   reply_keyWord[3]='拔牙特别棒';//自定义回复

   reply_keyWord[999]='很抱歉未能识别到您的意思，请提供您的号码，客服收到留言后将及时联系您';//其他回复


   xh(pipei_keyWord)
   function xh(pipei_keyWord){
		setTimeout(function(){//延迟器
            var myDate = new Date();
            if(myDate.getHours()<8){//执行时间
                if(($(".now>div>div").children("div").last().attr("class")!="right")&&($(".now>div>div").children("div").last().attr("class")!="time-content")){//当已读状态下，如果未回同样执行自增

                    fuzzyQuery(pipei_keyWord, $('.message-text:last').html());//执行
                }else{
                    if(document.getElementsByClassName("cue-number")[0]){//判断是否有未读
                        var aa=$('.cue-number').parent().index();
                        document.getElementsByClassName("item-content")[aa].click();
                    }
                }
            }
                xh(pipei_keyWord);//递归循环
		},5000)
    }


  function fuzzyQuery(pipei_keyWord,user_accept) {

    for (var i = 0; i < pipei_keyWord.length; i++) {
      if (user_accept.indexOf(pipei_keyWord[i]) >= 0) {
           $("#iconInput").html(reply_keyWord[i]);//输入框改变
           document.getElementsByClassName("send-button")[0].click(); //提交回复
		   //alert(reply_keyWord[i])//匹配到关键字进行回复
      }else{
          $("#iconInput").html(reply_keyWord[999]);//输入框改变
          document.getElementsByClassName("send-button")[0].click(); //提交回复
		  //alert()//未匹配到关键字，其他回复
	  }
    }
    return arr;
  }

})();