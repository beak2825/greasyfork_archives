// ==UserScript==
// @name        继续教育自动答题
// @namespace   Violentmonkey Scripts
// @match       *://pcourse.gzteacher.com/video/*
// @match       *://pcourse.gzteacher.com/booklcms/index/student/doMain.do
// @match       *://study.gzteacher.com/study/study
// @grant       none
// @version     1.8
// @author      -
// @description 2023/5/31 
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/429110/%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/429110/%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==


if(window.location.href.indexOf("study.gzteacher.com/study/study0000000")>0){
  console.log('load next...')
  // 如果视频播放完成了，则跳转到下一个:
  var sii = setInterval(function(){
    var testLayers = document.getElementsByClassName("test_layer");
    if(testLayers.length>0){
        if(testLayers[0].style.display=="block"){
            if (checkActStu(nextKonwId)) {
                var mc = document.getElementById("makeComment");
                var finish = true;
                if(mc){
                   // 需发表回复和评论
                   var fi = document.getElementById("myForumInfo");
                   var fr = document.getElementById("myForumReply");
                   if(fi.innerText == '0' || fr.innerText == '0'){
                       console.log('未完成')
                       //window.clearInterval(sii);  
                       finish = false;
                       return;
                   }
               }
              if(finish){
                  console.log('next show...')
                  $(".left_side").animate({top:"-999px"},1000);
                  if($(".left_side").css("top")!="-999px"){ 
                    childActIds = "";
                    setTimeout("nextLeftside()",1000);
                  }
               }   
			      } 
        }
    }
  }, 3000)
}else{ 
    console.log('check autoAnswer...')
     setInterval(function () { 
          nextVideo();
    }, 3000);
    
}

function nextVideo(){
  //var modal = $(".ant-modal-content")
  var modal = document.getElementsByClassName("ant-modal")
    if(modal && modal.length>0){ 
        if(modal[modal.length-1].style.display =='none'){
           return;
        }
        // 有弹窗
       modalButton = modal[modal.length-1].getElementsByTagName("button");
       if(modalButton){
           // 弹窗上有按钮
           if(modalButton.length == 3){
               console.log('next video...')
              // 有3个按钮： 重新学习，下一活动，关闭
              // 点击下一活动
                 modalButton[1].click()
             }else{
                continueStudy();
            }
       }
    }
}

function continueStudy(){
  var antModal = document.getElementsByClassName("ant-modal")
   if(!antModal || antModal[0].style.display=='none'){
         return;
    }
    //var continueBtn = $(".ant-modal-content button")
    var continueBtn = document.getElementsByClassName("ant-modal-content")[0].getElementsByTagName("button")[0]
    if(continueBtn){ 
        console.log('continue play...')
        // 点击问答弹窗上的“继续学习”按钮
        continueBtn.click() 
    }
}

function autoAnswer(qaid){
  	console.log('autoAnswer start...qaid: ' + qaid); 
  	console.log('选择正确回答项');
		var api = frameElement.api, W = api.opener;

		W.qaMap.userResult = W.qaMap.ans;
		console.log('提交回答');
		if("undefined" == typeof showAns){ 
  			api.content.showAns();
		}else{
 				showAns();
		}
		console.log('继续学习');
		videoplayer.updateActivity(qaid,W.qaMap["status"], false); 
		console.log('关闭答题窗口');
		W.qaDialog.close();
		videoplayer.play()
}

function getQueryVariable(variable){
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}
