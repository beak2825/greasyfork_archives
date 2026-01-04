// ==UserScript==
// @name         妖火自动挂机吃肉
// @namespace    https://ziyuand.cn
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
// @grant           unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/450631/%E5%A6%96%E7%81%AB%E8%87%AA%E5%8A%A8%E6%8C%82%E6%9C%BA%E5%90%83%E8%82%89.user.js
// @updateURL https://update.greasyfork.org/scripts/450631/%E5%A6%96%E7%81%AB%E8%87%AA%E5%8A%A8%E6%8C%82%E6%9C%BA%E5%90%83%E8%82%89.meta.js
// ==/UserScript==


var href =window.location.href;
var host='https://yaohuo.me';
var nowdate= nowdates();
//console.log(nowdate);
function nowdates() {
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
    //var nowDate = year + "-" + month + "-" + day;
    var nowDate = month + "-" + day;
    return nowDate;
}

setInterval(function(){

    document.location.reload();

}, 20000);


//正文
$(document).ready(function(){
    //当前时间


    //获取ck
    var yaohuo_Cookie = document.cookie.split(';');
    if(yaohuo_Cookie==""){
        alert("未登录");
        exit;
    }
    //获取sid，回复时用
    var sidyaohuo=yaohuo_Cookie[2].split('=')[1];
    console.log(sidyaohuo)
    //楼主ID
    var userid;
    //一个帖子内吃肉次数
    var count=0;
    //当天时间信息
    var time;
    //吃肉时回复内容
    var context=new Array("吃吃吃～","吃","吃肉","吃了","再吃","感谢肉肉～","感谢","吃完再说","真香","我是来吃肉的","ok，吃完","肉肉到手","嗝～～","肉肉到手～");
    var userids=get_myid();
    function get_myid(){
        var url='https://yaohuo.me'
        //<div class="content">我的ID: 25931<img src="/bbs/medal/t8.gif" alt="."></div>
        //var reg_id=/我的ID: .*?</g;
        var reg_myid=/<a[^>]*href=['"]([^"]*)['"][^>]*>([\u7A7A\u95F4]{2})<\/a>/g;
        //获取楼主ID
        var data=get_url(url);
        var myid=data.match(reg_myid);
        var indexof1=myid[0].indexOf('id=');
        var indexof2=myid[0].indexOf('\">空间');
        //获取到id
        myid =myid[0].substring(indexof1+3,indexof2);
        console.log(myid)
        return myid;
    }
    //get方法，并根据所传正则返回内容
    function get_url(url){
        var datas;
        $.ajax({
            //请求方式
            type:'GET',
            //发送请求的地址以及传输的数据
            url:url,
            async:false,
            success: function(data){
                //匹配所有用户回复链接,如<a href="/bbs/Book_re.aspx?siteid=1000&amp;classid=177&amp;lpage=1&amp;page=1&amp;reply=76&amp;id=776920&amp;touserid=7021&amp;ot=">回</a>
                //<img src="/NetImages/li.gif" alt="礼"><a href="/bbs-1099876.html?lpage=2" one-link-mark="yes">
                //console.log(data);
                //console.log(ResArr);
                datas=data;

            },
            error:function(jqXHR){
                //请求失败函数内容
                datas='错误原因：'+jqXHR;
                console.log('错误原因：'+jqXHR);
            },
            failure:function (result) {
                console.log('失败原因：'+result);
                datas='失败原因：'+result;
            },
        });
        return datas;
        //终止请求动作.
        // request_get_meat.abort();
    }
    if(href.indexOf("action=new") != -1){
        run();
        function run(){
            for (var i = 1 ;i <6; i++ ){
                var hrefUrl='https://yaohuo.me/bbs/book_list.aspx?action=new&siteid=1000&classid=0&getTotal='+new Date().getFullYear()+'&pagesize=200&page='+i;
                var aReg=/<img src="\/NetImages\/li.gif" alt="礼"\/><a href="\/bbs-(.*?)<\/a><br\/>/g;
                var data=get_url(hrefUrl);
                var res=data.match(aReg);
                console.log("第"+i+'页匹配结果：')
                //console.log(res)
/*                  for(var a in res){
                     console.log(res[a]);
                     var ress=res[a].split('<a href="');
                     ress=ress[1].split('">')
                     console.log(ress);
                 } */
                if(res != null){
                    //console.log(res)
                    get_last_meat(res)
                }
                //for(var s in titleArr)
                //判断是否有腾讯或者爱奇艺礼包
                //if(title.indexOf('爱奇艺红包')!==-1 || title.indexOf('视频红包')!==-1 || title.indexOf('视频天数')!==-1){
                    //get_vip_redpack_detail(url)

                //get_last_meat(tempArr)

            }
        }

        function get_last_meat(res){
            for(var i in res){
                //console.log(res[i]);
                var ress=res[i].split('<a href="');
                var url=ress[1].split('">')[0];
                //console.log(url);
                var title=ress[1].split('">')[1].replace('</a><br/>','');
                //console.log(title);
                var source_url=url.substring(0, url.lastIndexOf('html'))+"html";
                //console.log("source_url:"+source_url);
                url=host +url;
                //console.log(url);
                var reg=/已派:.*(余.*)<br\/>每人/g;
                var data=get_url(url);
                var get_last_meat = data.match(reg);

                //console.log(get_last_meat)

                if(get_last_meat[0].indexOf("余0")!==-1){
                    console.log("帖子："+title+" url:"+url+' 没肉了，渣渣都没剩！')
                    //has_eat(source_url,url);
                }else{
                    console.log("帖子："+title+" url:"+url+' 有肉哦，看看吃过了吗')
                    has_eat(source_url,url,title);

                }
            }
        }
        //has_eat(source_url);
        //判断是否吃过肉
        function has_eat(source_url,urls,title){
            var ressArr=[];
            var timeArr=[];
            var url='https://yaohuo.me/bbs/book_re_my.aspx?action=class&siteid=1000&classid=0&touserid='+userids+'&lpage=&getTotal=&ot=&page=1';
            var reg=/ <a href="\/bbs-(.*?)查看<\/a>/g;
            var data=get_url(url);
            var res=data.match(reg);
            var ate_time_reg=/<br\/> (.*?) <a href=/g;
            var ate_time=data.match(ate_time_reg);


            for (var i in res){
                var ress=res[i].split('"')[1];
                ressArr.push(ress)
                var ate_times=ate_time[i].split(" ")[1];
                timeArr.push(ate_times)
            }
            //console.log(nowdate)
            //console.log(timeArr)
            //console.log(ressArr.indexOf(source_url)!==-1)
            if(ressArr.indexOf(source_url)!==-1){

                //判断是否过12点
                if(timeArr[ressArr.indexOf(source_url)]!==nowdate){
                    console.log('帖子：'+ title +" url:"+source_url+' 不是同一天，可以再吃一次，爽歪歪')
                    get_detail(urls);
                }else{
                    console.log('帖子：'+ title +" url:" +source_url+' 已经吃过啦，吃肉时间：'+timeArr[ressArr.indexOf(source_url)]);
                }
                //return true;
            }else{
                console.log('帖子：'+ title +" url:" +source_url+'没吃过,执行吃肉')
                get_detail(urls);
            }
            //console.log(ressArr)

        }
        //获取id


    }
    //获取帖子详情
    function get_detail(urls){
        var info=get_url(urls)
        var data_reg=/<a href="\/bbs\/Book_View_admin.aspx(.*?)管理/g;
        var data_id=info.match(data_reg);
        data_id=data_id[0].split('"');
        //console.log(data_id);
        // console.log(data_id[1].split('='));
        var classid=data_id[1].split('=')[2];
        classid=classid.split('&amp;')[0]
        var pg_id=data_id[1].split('=')[3];
        pg_id=pg_id.split('&amp;')[0]
        //console.log(classid);
        //console.log(pg_id);
        var con=context[Math.floor(Math.random()*(11 - 1) + 1)];
        //console.log(con)
        var post_url='https://yaohuo.me/bbs/book_re.aspx'
        var post_datas={"face":"",
                        "sendmsg":"0",
                        "content":con,
                        "action":"add",
                        "id":pg_id,
                        "siteid":"1000",
                        "lpage":"1",
                        "classid":classid,
                        "sid":sidyaohuo,
                        "g":"快速回复"
                       };

        var resu=post_data(post_url,post_datas);
        //console.log(resu);
        var resu_reg=/<div class=\"tip\"><b>回复成功！(.*?)<br\/>/g;
        var resu_data=resu.match(resu_reg);
        //resu_data=resu_data[0].split('</b> ')[1];
       // resu_data=resu_data.replace('<br/>','')
        console.log('回复成功！'+resu_data)

    }

    //执行发帖
    function post_data(url,data){
        var datas;
        $.ajax({
            //请求方式
            type:'post',
            //发送请求的地址以及传输的数据
            url:url,
            data:data,
            async:false,
            success: function(data){
                datas=data;
            },
            error:function(jqXHR){
                //请求失败函数内容
                datas='错误原因：'+jqXHR;
                console.log('错误原因：'+jqXHR);
            },
            failure:function (result) {
                console.log('失败原因：'+result);
                datas='失败原因：'+result;
            },
        });
        return datas;
    }
//获取腾讯视频||爱奇艺红包链接
    function get_vip_redpack_detail(url){
    var redpack_reg=/<!--listS-->(.*?)<!--listE-->/g;
    var data=get_url(url);
    var redpack_url=data.match(redpack_reg)
    console.log(redpack_url)

    }
});
