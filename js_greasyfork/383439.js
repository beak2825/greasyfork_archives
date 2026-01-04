// ==UserScript==
// @name         批量关注
// @namespace    https://weibo.com/u/6877974979
// @version      0.4
// @description  用于批量关注用户
// @author       永远鲜红幼月
// @include      http://www.weibo.com/*
// @include      http://weibo.com/*
// @include      https://www.weibo.com/*
// @include      https://weibo.com/*
// @grant        none
// @run-at       document-end
// @require      http://code.jquery.com/jquery-3.4.1.slim.js
// @downloadURL https://update.greasyfork.org/scripts/383439/%E6%89%B9%E9%87%8F%E5%85%B3%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/383439/%E6%89%B9%E9%87%8F%E5%85%B3%E6%B3%A8.meta.js
// ==/UserScript==
/*
   使用说明：
   1.在启用此脚本前，请先登录微博，然后进入到‘我的消息箱-at我的’页面，或者直接复制此地址https://weibo.com/at/weibo
   2.然后将需要关注的列表按照指定格式（见下面的范例）粘贴入脚本，然后启用脚本
   3.刷新刚才打开的网页，使脚本生效
   4.浏览器此时会自动打开列表中用户的首页，并点击关注，关注后会自动关闭标签页
   5.待关注完成后，重新打开脚本编辑，将另一批需要关注的列表粘贴进来，然后不断重复步骤3 4 5

   特别注意：
   1.微博偶尔会卡住，页面加载不出来，此时需要手动刷新
   2.如果某个标签页迟迟没有自动关闭，也需要手动进去看看
   3.微博目前一天关注上限为大约为200人，此限制无法绕开，需要等待24小时以上重试
   4.偶尔微博会出现要求输入验证码的情况，触发条件未知，不常见，影响不大，过几小时再试一般就没了
*/
(function() {
    'use strict';
    var arrUrl = new Array(
        /*
            ----要关注的url列表----
            格式示例：
            "https://weibo.com/u/6877974979",
            "https://weibo.com/u/6877974979",
            "https://weibo.com/u/6877974979",
            "https://weibo.com/u/6877974979",
            注意前后需要加上英文的双引号和逗号，这一步建议在excel中完成会更加方便
            为了防止电脑过卡，建议一次粘贴20行，高配电脑随意
        */

        //粘贴 从这里开始
            "https://weibo.com/u/6609486423",
            "https://weibo.com/u/2824164263",
        //从这里结束
    );

    var pageURL = document.URL;//当前页面地址
    var isUserPage = false;//用于判断当前页面是否是用户主页
    var timmer = 0;//用于计时
    if(pageURL.indexOf("weibo.com/u/")!=-1||pageURL.split("\/").length==4){//判断当前页面是否是用户主页，否则是-1
        //这是一个用户主页
        isUserPage = true;
    }else{
        if(arrUrl.length>0){//如果没有列表就报错
            //遍历打开url
            //alert("遍历打开url");
            for(var i=0;i<arrUrl.length;i++){
                window.open(arrUrl[i]);
            }
        }else{
            alert("错误：请先粘贴关注列表");
        }
    }
    if(isUserPage){
		var checkPageLoad = setInterval(function(){ //计时器，每隔1秒检查一下按钮是否已经加载完成
			if(document.getElementsByClassName("W_btn_d btn_34px").length==0){
				//按钮加载未完成
				if(timmer<10){
					timmer++;
				}else{
					//超时，停止计时器
					clearInterval(checkPageLoad);
					alert("页面超时，请手动处理当前页面");
				}
			}else{
				//按钮加载已完成
				if(document.getElementsByClassName("W_btn_d btn_34px").length>2){
					//这是一个已关注用户，关闭窗口
					window.opener = null;
					window.close();
				}else{
                    //这是一个未关注用户，点击关注
                    //点击按钮后会在下一次计时器触发时检查是否关注成功，如果变成已关注，则关闭页面
					var followBtn = document.getElementsByClassName("W_btn_c btn_34px");//获得关注按钮元素
					followBtn[0].click();
				}
			}
		}, 1000);
    }



    //辣鸡微博，JS整天出错，导致页面无法读完，无法触发onload↓
    /*window.onload=function(){
        if(isUserPage){
            if(document.getElementsByClassName("W_btn_d btn_34px").length>2){
                //这是一个已关注用户
                alert("这是一个已关注用户,关闭窗口");
                window.opener = null;//关闭窗口
                window.close();
            }else{
                var followBtn = document.getElementsByClassName("W_btn_c btn_34px");//获得关注按钮元素
                alert("点击关注按钮");
                alert("关闭窗口");
                //followBtn[0].click();//点击关注按钮
                //window.opener = null;//关注完成后关闭窗口
                //window.close();
            }
        }
    } ;*/
})();
