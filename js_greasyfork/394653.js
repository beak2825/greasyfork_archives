// ==UserScript==
// @name         懒人必备
// @namespace    https://www.bmt.pub/
// @version      1.3
// @description  懒得回帖之人必备
// @author       。。。。
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @require      https://cdn.bootcss.com/sweetalert/2.1.2/sweetalert.min.js
// @require      https://code.jquery.com/jquery-latest.js
// @match        http://yaohuo.me/*
// @match        https://yaohuo.me/*
// @include      https://yaohw.com/*
// @include      http://yaohw.com/*
// @run-at       document-start
// @grant           GM_getValue
// @grant           GM.getValue
// @grant           GM_setValue
// @grant           GM.setValue
// @grant			GM_addStyle
// @grant           GM_xmlhttpRequest
// @grant           GM_getResourceText
// @grant           GM_registerMenuCommand
// @grant           unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/394653/%E6%87%92%E4%BA%BA%E5%BF%85%E5%A4%87.user.js
// @updateURL https://update.greasyfork.org/scripts/394653/%E6%87%92%E4%BA%BA%E5%BF%85%E5%A4%87.meta.js
// ==/UserScript==



//当前时间
var nowdate= function() {
    //获取当前时间
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    var nowDate = year + "-" + month + "-" + day;
    return nowDate;
}


//正文
$(document).ready(function(){
    //楼主ID
    var userid;
    //一个帖子内吃肉次数
    var count=0;
    //当天时间信息
    var time;
    //吃肉时回复内容
    var context=new Array("吃","吃肉","吃了","再吃","感谢肉肉～","感谢","吃完再说","真香","我是来吃肉的","ok，吃完");
    //匹配所有妖火成员回复的url和参数
    var action,siteid,lpage,classid,sid,id;
    //得到楼主ID方法
    var f1=function(){
        //获取楼主空间地址操作，得到ID
        var request = $.ajax({
            //请求方式
            type:'GET',
            async: false,
            //发送请求的地址以及传输的数据
            url:"https://yaohuo.me",
            success:function(data){
                //请求成功函数内容
                //匹配首页空间a标签
                //匹配a标签
                var aReg=/<a[^>]*href=['"]([^"]*)['"][^>]*>([\u7A7A\u95F4]{2})<\/a>/g;
                //获取楼主ID
                var arrA = data.match(aReg);
                var indexof1=arrA[0].indexOf('id=');
                var indexof2=arrA[0].indexOf('\">空间');
                //获取到id
                userid =arrA[0].substring(indexof1+3,indexof2);

            },
            error:function(jqXHR){
                //请求失败函数内容
            }
        });
        //终止请求动作.
        request.abort();
        return userid;
    }

    //统计楼主存在的吃肉回复次数方法
    var f2=function(){
        f1();
        //这里要匹配帖子是否有回帖记录，若有再匹配楼主ID，是否吃过肉同时在子字节a标签中可以找到getTotal参数
        var moreDiv=document.getElementsByClassName('more');
        if(moreDiv.length==0){
            count=0;
            return count;
        }

        //匹配所有妖火成员回复的url和参数
        action=$("input[name='action']").val();
        siteid=$("input[name='siteid']").val();
        lpage=$("input[name='lpage']").val();
        sid=$("input[name='sid']").val();
        classid=$("input[name='classid']").val();
        id=$("input[name='id']").val();

        //因没有getTotal参数，所以另需寻找
        var getTotalElement=moreDiv[0].firstElementChild.href;//div子标签a标签中有
        var getTotalElementindexof1=getTotalElement.indexOf('getTotal=');
        var getTotalElementindexof2=getTotalElement.indexOf('&id=');
        var getTotal =getTotalElement.substring(getTotalElementindexof1+9,getTotalElementindexof2);

        for(var i=1;i<=getTotal/15+1;i++){
            var hrefUrl='https://yaohuo.me/bbs/book_re.aspx?action='+ action +'&siteid='+siteid+'&classid='+classid+'&id='+id+'&lpage='+lpage+'&getTotal='+getTotal+'&ot=&mainuserid=&page='+i;
            var request1= $.ajax({
                //请求方式
                type:'GET',
                //发送请求的地址以及传输的数据
                url:hrefUrl,
                async:false,
                success: function(data){
                    //匹配所有用户回复链接,如<a href="/bbs/Book_re.aspx?siteid=1000&amp;classid=177&amp;lpage=1&amp;page=1&amp;reply=76&amp;id=776920&amp;touserid=7021&amp;ot=">回</a>
                    var aReg=/<a[^>]*href=['"]([^"]*)['"][^>]*>([\u56DE])<\/a>/g;
                    var tempArr= data.match(aReg);
                    for(var k=0;k<tempArr.length;k++){
                        var touserIdIndexOf1=tempArr[k].indexOf('touserid=');
                        var touserIdIndexOf2=tempArr[k].indexOf('\&amp;ot=\">回');
                        //获取到id
                        var tempid =tempArr[k].substring(touserIdIndexOf1+9,touserIdIndexOf2);
                        if(userid==tempid){
                            count++;
                            console.log("您回复帖子次数：第"+count+"次");
                        }
                    }
                },
                error:function(jqXHR){
                    //请求失败函数内容
                    console.log('错误原因：'+jqXHR);
                },
                failure:function (result) {
                    console.log('失败原因：'+result);
                },
            });
            //终止请求动作.
            request1.abort();
        }
        return count;
    }

    //回复贴子方法
    var f3=function(){
        console.log("发言次数："+count);
        if(count<=0){
            //执行发言
            $("textarea[name='content']").val(context[Math.floor(Math.random()*(11 - 1) + 1)]);
            $("input[name='g']").click();
            //存储时间文本和吃肉信息
            localStorage.setItem("会员："+id,nowdate());
            return;
        }
    }

    //判断肉是否吃完，以及调用f3()吃肉方法
    var f4= function(){
        //匹配肉是否吃完，查看"余0"和“礼金”
        var lijinReg=/\u793C\u91D1/g;//礼金
        var remainderReg=/\(\u4F59[0]\)/g;//(余0)
        var data=$(".dashed").parent()[0].innerText;
        var lijin= data.match(lijinReg);
        var remainder= data.match(remainderReg);
        if(data==undefined){
            return;
        }
        //匹配是否为肉贴
        if(lijin!=null)
            if(lijin[0]=='礼金')
                //若肉的余数为零则不吃不回复
                if(remainder==null){
                    f3();
                }
                else if(remainder[0]=='(余0)'){
                    return;
                }else{
                    return;
                }
    }



    //比较当天时间信息
    id=$("input[name='id']").val();
    time=localStorage.getItem("会员："+id);
    console.log("当前帖子ID"+id+"的存储时间为："+time);
    //比较当天时间信息，if存在当天时间信息就比较时间
    if(time!=null) {
        //比较今天和之前时间
        if(time==nowdate()){
            //未吃过肉
            count=f2();
            if(count==0){
                f4();
            }
            //吃过肉了
            else{
                return;
            }

        }
        //比较时间不等时,即新一天
        else{
            //更新吃肉记录为未吃状态
            count=0;
            f4();
        }
    }
    //不存在时间记录时，创建记录
    else{
        localStorage.setItem("会员："+id,nowdate());
        count=f2();
        //未吃过肉
        if(count==0){
            f4();
        }
        //吃过肉了
        else{
            return;
        }

    }
});
