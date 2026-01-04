// ==UserScript==
// @name         研修网2.0学习脚本，多页面学习全自动切换！
// @namespace    https://greasyfork.org/
// @version      0.5
// @description  适用于教师研修网2.0学习，暂停时自动继续播放，多页面自动切换！完成时自动切换下一视频，2021.08.01亲测有效
// @author       You
// @match        https://ipx.yanxiu.com/train/*
// @match        https://ipx.yanxiu.com/grain/course/*
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @require      https://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430193/%E7%A0%94%E4%BF%AE%E7%BD%9120%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC%EF%BC%8C%E5%A4%9A%E9%A1%B5%E9%9D%A2%E5%AD%A6%E4%B9%A0%E5%85%A8%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/430193/%E7%A0%94%E4%BF%AE%E7%BD%9120%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC%EF%BC%8C%E5%A4%9A%E9%A1%B5%E9%9D%A2%E5%AD%A6%E4%B9%A0%E5%85%A8%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%EF%BC%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var playButton = document.getElementsByClassName('alarmClock-wrapper');//获取点击播放弹窗
    var pj=document.getElementsByClassName('scoring-wrapper');//获取评价弹窗
    var pj_up=document.getElementsByClassName('ivu-btn ivu-btn-primary');//获取评价提交按钮
    var over=document.getElementsByClassName('ended-mask');//获取完成学习弹窗
    var over_bt=document.getElementsByClassName('next');//获取下一个播放内容xmt-main

     var main_url=document.getElementsByClassName('app-header');

     var main_div='<div id="main_div" style="height: auto; background-color:#069;color:#FFF;"><br/>'+
         '<div align="center" style="font-size:24px;">学习页面列表</div><br/><hr/>'+
         '<div style="font-size:16px;">'+
         '<table id="liebiao" border="1" width="100%" style="font-size:14px;">'+
         '<tr><td >地址</td><td width="60">删除</td><td width="60">开始</td></tr>'+
         '</table>'+
         '</div>'+
         '<br/>'+
         '<div style=" background-color:#000;color:#FFF;font-size:18px;padding:10px" >使用说明：<br/><br/>请选择并进入你要学习的页面，并在弹出对话框中输入你要学习此页面的时长（单位为分钟），你输入的时间最好小于此页面要求的时间2分钟！<br/>'+
         '<br/>添加好地址后，回到此页面，点击第一个地址后面的star按钮，开始学习！请不要关闭此页面！</div>'+
         '<br/>'+
         '</div>';
       var i=0;
//     var a=new Array();
//     var t=-1;
//     var v_n=0;
    //加载完成判断页面地址是否在学习url列表中，如果不在则直接进入第一个学习页面
    window.onload=function(){
       if((window.location.href).substring(0,38)==='https://ipx.yanxiu.com/train/workspace')
        {
            if($("#main_div").html()===undefined){
             $(".app-header").append(main_div);
            }
            var have_url=false;
            var url= ($.cookie('url_list'));
            var url_list= new Array(); //定义一数组
            url_list=url.split(";"); //字符分割
            if(url_list.length>0){
                for (i=0;i<url_list.length-1;i++ )
                {
                    if(url_list[i]!==""&&url_list[i]!==null&&url_list[i]!=='null')
                    {
                        var u=url_list[i];
                      $("#liebiao").append( '<tr id="l_'+i+'"><td class="list_url" id="s_'+i+'">'+u+'</td>'+
                                         '<td><button type="button" onclick="javascript:$(\'#l_'+i+'\').remove();$.cookie(\'url\',\'null\');" type="button">删除</button></td>'+
                                         '<td><button type="button" onclick="javascript:window.open(\''+u+'\');" type="button">Star</button></td></tr>');
                    }
                }
            }
            var list = document.getElementsByClassName("list_url");
            if(list.length<=0)
            {
                $.removeCookie('url_list',{path:'/',domain:'yanxiu.com'});
                alert("请选择并进入你要学习的页面，并在弹出对话框中输入你要学习此页面的时长（单位为分钟），你输入的时间最好小于此页面要求的时间2分钟！");
            }
        }
       if((window.location.href).substring(0,36)==='https://ipx.yanxiu.com/grain/course/')
        {
            if($("#main_div").html()===undefined){
             $(".app-header").append(main_div);
            }
            $.removeCookie('url',{path:'/',domain:'yanxiu.com'});
            var test_have_url=false;
            //检查url是否带有时间参数
            if(get_url(window.location.href)===""){
                test_have_url=false;
            }else{
                test_have_url=true;//带有参数则已经为添加的页面
            }
            if(test_have_url===false)
            {
                var time = prompt("如果你要学习此页面请输入时间单位为：分钟", ""); //将输入的内容赋给变量 name ，
                  //这里需要注意的是，prompt有两个参数，前面是提示的话，后面是当对话框出来后，在对话框里的默认值
                 if (time)//如果返回的有内容
                 {
                      $.cookie('get_url',window.location.href+'&t='+time,{path:'/',domain:'yanxiu.com'});
                      alert("已加入学习列表，此页面学习时长为："+time);
                      //alert( $.cookie('get_url'));
                      window.opener=null;window.close();//关闭页面
                  }
            }

        }
　　}
setInterval(function() {
        if((window.location.href).substring(0,38)==='https://ipx.yanxiu.com/train/workspace')
        {
            var url=($.cookie('get_url'));
            var have_list=false;
            var url_list = document.getElementsByClassName("list_url");
            if(url_list.length>0)
            {
                if($.cookie('get_url')!==undefined && $.cookie('get_url')!=='null' && $.cookie('get_url')!==null)
                {
                    for(i=0;i<url_list.length;i++)
                    {
                        if(get_url(url_list[i].innerText)===get_url($.cookie('get_url')))
                        {
                           have_list=true;
                           break;
                         }
                    }
                }
             }
              if(have_list===false&&$.cookie('get_url')!==undefined && $.cookie('get_url')!=='null' && $.cookie('get_url')!==null)
              {
                var i=url_list.length;
                  var u=$.cookie('get_url');
                     $("#liebiao").append( '<tr id="l_'+i+'"><td class="list_url" id="s_'+i+'">'+u+'</td>'+
                                        '<td><button type="button" onclick="javascript:$(\'#l_'+i+'\').remove();$.cookie(\'get_url\',\'null\');" type="button">删除</button></td>'+
                                        '<td><button type="button" onclick="javascript:window.open(\''+u+'\');" type="button">Star</button></td></tr>');
               }
            if(url_list.length>0){
                var s="";
                for(i=0;i<url_list.length;i++)
                {
                    s=s+url_list[i].innerText+";";
                }
                $.cookie('url_list',s,{path:'/',domain:'yanxiu.com'});
            }else{
                $.removeCookie('url_list',{path:'/',domain:'yanxiu.com'});
            }
       }
     }, 1000);
    setInterval(function() {
        if((window.location.href).substring(0,36)==='https://ipx.yanxiu.com/grain/course/')
        {
            var have_time=document.getElementsByClassName('action-timer')[0].innerText;
            var reg=/<[^<>]+>/g;
            have_time=have_time.replace(reg,'');
            have_time=parseInt(have_time.replace(/[^0-9]/ig,""));
            var t=getQueryString("t");
            if(t!=null&&have_time>=t)
            {
                run_next();
            }
            if (playButton[0].style.display !== 'none')//自动继续播放
            {
                playButton[0].click();
            }
            if (pj[0].style.display=== '')//关闭评价
            {
                pj_up[0].disabled='';
                pj_up[0].click();
            }
            if (over[0].style.display=== '')//下一个内容
            {
                over_bt[0].click();
            }
        }
      }, 15000);
    //去除HTML标签
    function clear_html(html){
        return html.toString().replace(/<[^>]+>/g,"").innerText;//去掉所有的html标记
    }
    //获取url地址去除&t=XXX
    function get_url(url) {
        if(url===undefined)
        {
            return "";
        }else{
            var n=url.indexOf("&t=");
            var s=url.substring(0,n)
            return s;
        }
    }
    //run_next
    function run_next()
    {
            var index=0;
            var url_list = window.opener.document.getElementsByClassName("list_url");
                    for(i=0;i<url_list.length;i++)
                    {
                        if(get_url(url_list[i].innerText)===get_url(window.location.href))
                        {
                           index=i;
                         }
                    }

            if(url_list.length>index+1)
            {
                window.location.href=url_list[index+1].innerText;
            }
        if(url_list.length===index+1)
        {
            alert('已学完列表中的地址！！！');
            window.opener=null;window.close();//关闭页面
        }
    }
    //获取参数t（要播放的时间单位为分钟）
    function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
    }

})();
