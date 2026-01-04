// ==UserScript==
// @name         微博自动挖土豆机
// @version      0.05
// @description  二号机逻辑：评论超话前25条，休息30分钟，刷新，再继续评论前25条。
// @match        https://weibo.com/p/.../*完全二琪
// @require      http://code.jquery.com/jquery-latest.js
// @icon         https://weibo.com/favicon.ico
// @exclude  该URL地址不进行执行
// @include  该URL地址执行脚本
// @namespace https://greasyfork.org/users/220272
// @downloadURL https://update.greasyfork.org/scripts/373413/%E5%BE%AE%E5%8D%9A%E8%87%AA%E5%8A%A8%E6%8C%96%E5%9C%9F%E8%B1%86%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/373413/%E5%BE%AE%E5%8D%9A%E8%87%AA%E5%8A%A8%E6%8C%96%E5%9C%9F%E8%B1%86%E6%9C%BA.meta.js
// ==/UserScript==

$(document).ready(function() {//dom结构加载完毕再执行js
    console.log("jquery ready");
    var refreshTime=1000*60*30;//页面刷新时间
    var commentTime=1000*2;//评论间隔
    var numLimit=25//单页面评论个数限制
    var send_text="加油加油 \n";//评论文字。\n换行
    //以上可修改
    var cookieCountTAG="commentCount";

    var sendText=function(){
        return send_text
    }

    var mySubmission = function(index){
        var btn3 = $('[node-type="btnText"]')[index];//获取提交评论按钮
        if (!btn3) {
            return;
        }
        btn3.click();
        return true;
    }

    var myComment = function(index){
        var text = $('[class="W_input"]')[Number(index) + Number(2)];//获取输入框
        console.log(text);
        if (!text) {
            return;
        }
        text.value = sendText()
        text.dispatchEvent(new Event('focus'));

        setTimeout(function(){
            if(mySubmission(index)){
                var commentCount=parseInt(getCookie(cookieCountTAG));
                if(isNaN(commentCount)){
                    setCookie(cookieCountTAG,0)
                    console.log('-----isNaN');
                }else{
                    setCookie(cookieCountTAG,++commentCount)
                    console.log('-----isNum:'+commentCount);
                }
            }
        }, 1000*index);//每条评论延时
    }

    var send = function(index){
        var btn1 = $('[action-type="fl_comment"]')[index];//获取评论按钮
        if (!btn1) {
            return;
        }
        btn1.click();
        setTimeout(function(){
            if(commentNumValid(index)&&repeatValid(index)){
                console.log('-----条件通过可评论------')
                myComment(index)
            }

            else{
                if(numLimit==1){
                    location.reload(true)
                }
            }

        },5000);//时间不能太短，输入框没有加载出来，遂无法输入
    }

    var getUserName=function(){
        var currentUserName= $('[class="S_txt1 W_f14"]').text()
        console.log('------当前用户名：'+currentUserName)
        return currentUserName
    }

    var repeatValid=function(index){//查重
        console.log('----开始查重------')
        var userNameListText=$('[node-type="feed_list_commentList"]').eq(index).children("div").find("a").text()
        if(isContains(userNameListText,getUserName())){
            console.log('----no comment error:repeat-----')
            return false
        }else{
            return true
        }

    }

    function isContains(parentStr, substr) {
        return parentStr.indexOf(substr) >= 0;
    }

    var commentNumValid=function(index){//判断20
        console.log('----开始判断20------')
        var commentView=$('[action-type="fl_comment"]').eq(index).find('em').eq(1);
        var commentNum=parseInt(commentView.text())
        if(isNaN(commentNum)){//页面评论为0时,解析过程得到的是NaN（not a number）,这里true 即评论数为0
            return true;
        }
        if(commentNum<20){
            return true
        }else{
            console.log('----no comment error:over 20 comments-----')
            return false;
        }
    }

    var myLoop = function(){
        for(var num = 0; num < numLimit;num++){
            send(num)
        }
    }

    var setCookie=function(name,value){
        var days = 30; //有效期为30天
        //取出当前日期，加上30天，得出有效截止日期
        var exp = new Date();
        exp.setTime(exp.getTime()+days*24*60*60*1000)
        document.cookie=name +"="+escape(value) +";expries     ="+exp.toGMTString()
    }

    var getCookie=function(name){
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    }

    //setTimeout(function(){alert("已挖土豆："+getCookie(cookieCountTAG)+"条")})

    setTimeout(function(){ myLoop()},2000)
    setTimeout(function(){location.reload(true)}, refreshTime);//刷新页面

});