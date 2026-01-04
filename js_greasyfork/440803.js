// ==UserScript==
// @icon              http://passport.ouchn.cn/assets/images/logo.png
// @name            gkschoolhelp
// @namespace    [url=mailto:1152673513@qq.com]1152673513@qq.com[/url]
// @author          Shenhua
// @description   gkschoolhelp55555555
// @match           http://xk.scrtvu.net:8080/*
// @require          http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @require          http://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.min.js
// @version        1.1.2
// @grant            GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/440803/gkschoolhelp.user.js
// @updateURL https://update.greasyfork.org/scripts/440803/gkschoolhelp.meta.js
// ==/UserScript==
(function () {
    'use strict';

    //与元数据块中的@grant值相对应，功能是生成一个style样式
    GM_addStyle('#daan_show_btn{color:#fa7d3c;}');
    GM_addStyle('#Data{color:#fa7d3c;}');

    //注入本科输入专业的标签
    var html = "<tbody style='float:right;'><tr><td><input type='text'   style='height:30px;width:300px;margin-right: 0px;float:right;display:none;color:red;'  name='SuBpro' value='请输入本科专业名称'  id='SuBpro'></td></tr></tbody>";

    var btns = $("#ButtonSure");
    var bt1 = $("#Button1");
    var bt2 = $("#Button2");
    var lgin = $("#Login");

    var btbegin = $("#ButtonBegin");
    var div = $("#PaperCommand");
    var pddl = $("#DropDownListZYMC");

    //本科时才显示科目输入框
    if(lgin&&lgin!=undefined){
        lgin.append(html);
    }

    //本科和专科情况
    if(pddl&&pddl.val()!=null&&$("#DropDownListZYCC").val()==4){
        var dl = setInterval(function(){//专科科目不为空时
            if(pddl&&pddl.val()!=null){
                $("#ButtonLogin").click();
            }
        },1000);

    }else if(pddl&&pddl.val()!=null&&$("#DropDownListZYCC").val()==3){//本科科目不为空时
        $("#SuBpro").show();//显示科目输入框
        $("#SuBpro").bind("propertychange input",function(){//绑定本科科目改变
            var sub = $("#SuBpro").val();
            $("#DropDownListZYMC").children().each(function (i) {//根据输入的科目自动选择
                if ($(this).text().indexOf(sub)!=-1) {
                    $(this).attr("selected", true);
                    var dl = setInterval(function(){//专科科目不为空时
                        if(pddl&&pddl.val()!=null){
                            $("#ButtonLogin").click();
                        }
                    },1000);
                }else{
                   $(this).attr("selected", false);
                }
          });

      })
  }

    if(btns&&btns.val()=="确定"){
             btns.click();
    }

    if(btbegin&&btbegin.val()=="开始考试"){
             btbegin.click();
    }

    var ds = $("#DropDownListXXMC").children().eq(1).attr('selected',true);

   if($("#DropDownListJXDMC").val()!="5100012"&&$("#DropDownListJXDMC")){//设置院校：5100012
     setTimeout('__doPostBack(\'DropDownListXXMC\',\'\')',0);
   }

   $("#DropDownListJXDMC").val("5100012");//设置院校：5100012
    //答案显示按钮的html代码
    var daan_btn_html = '<div id="Show" class="Show"><input type="button" name="daan_show_btn" value="已显示答案" onclick="Show()" id="daan_show_btn" style="font-size:Medium;font-weight:bold;height:35px;width:120px;"/></div>';
    //将以上拼接的html代码插入到网页里的ul标签中
    var div_tag = $("#PaperHead");
    if (div_tag) {
        div_tag.append(daan_btn_html);
    }
//定义操作选项位置
  	var a = $("#DataListDX input[type='hidden']");
    var ck = $("input[type='radio']");

    var e = 1;
    var d = 0;
    var res=0;
    var des=0;
//循环判断选择题目答案
    for(var c = 1; c<=100;c+=3){

    	 res = a.eq(c).val();
         des = a.eq(c+1).val();
//在每题结尾插入正确答案方便对比
   		 $("#DataListDX span").eq(e).append("<input type='button' name='Data' id='Data' style='font-size:Medium;font-weight:bold;height:25px;width:70px;' value="+res+">");
//判断每题选项数量
     if(des == 4){
         //根据答案选择正确选项
                if(ck.eq(d).val()==res){
                    ck.eq(d).attr("checked",true);
                }else if(ck.eq(d+1).val()==res){
                    ck.eq(d+1).attr("checked",true);
                }else if(ck.eq(d+2).val()==res){
                    ck.eq(d+2).attr("checked",true);
                }else if(ck.eq(d+3).val()==res){
                    ck.eq(d+3).attr("checked",true);
               }
       }else if(des == 3){
           if(ck.eq(d).val()==res){
                    ck.eq(d).attr("checked",true);
                }else if(ck.eq(d+1).val()==res){
                    ck.eq(d+1).attr("checked",true);
                }else if(ck.eq(d+2).val()==res){
                    ck.eq(d+2).attr("checked",true);
                }
       }
           e = e+=2;
           if(des == 4){
               d = d +=4;
           }else if(des == 3){
               d = d+=3;
        }
 }

    var myDate = new Date();//获取当前系统时间对象1
         var tm = myDate.getSeconds();//获取当前系统时间1
         var ms = myDate.getTime();//获取当前时间(从1970.1.1开始的毫秒数)

         var year= myDate.getYear();//获取当前年份(2位)
         year = myDate.getFullYear();//获取完整的年份(4位,1970-????)
         var month =myDate.getMonth();//获取月份
         var day = myDate.getDate();//获取天
         var hour = myDate.getHours();//获取当前小时数(0-23)
         var min = myDate.getMinutes();//获取当前分钟数(0-59)
         var s = myDate.getSeconds();//获取当前秒数(0-59)
    if(bt2&&bt2.val()=="入学水平测试"){
        var cookie = $.cookie('isFirst');
        console.log('cookie:'+cookie);
        if(cookie&&cookie!=null&&cookie=='no'){
                $.cookie('isFirst', 'yes', { expires: 7 });
                bt2.click();
            //$.removeCookie('cs',{ path: '/'});
        }else if(cookie==null||cookie=='yes'){
            $.cookie('isFirst', 'no', { expires: 7 });
            bt1.click();
                //$.cookie('cs','1', {domain:'*',path:'/'});
        }
    }
     var waitTime = setInterval(function(){
             myDate = new Date();
             year = myDate.getFullYear();//获取完整的年份(4位,1970-????)
             month =myDate.getMonth();//获取月份
             day = myDate.getDate();//获取天
             hour = myDate.getHours();//获取当前小时数(0-23)
             min = myDate.getMinutes();//获取当前分钟数(0-59)
             s = myDate.getSeconds();//获取当前秒数(0-59)

            var fulltime = year +"-"+month+"-"+day+"-"+hour+"-"+min+"-"+s;

                myDate = new Date();//获取当前系统时间毫秒级
                var wait = parseInt((myDate.getTime() - ms)/1000);//获取经过时长：秒
                $(".fulltime").text("8s后提交测试:"+wait+"s");

                console.log(wait);
                if(wait&&wait==4){//计时器
                    console.log("准备停止计时！");
                    var tj = $("#ButtonSubmit");
                    if(tj&&tj.val()=="交卷"){
                        tj.click();
                    }
                    clearInterval(waitTime);
                }
         },1000);

   $("#ButtonSubmit").attr("onclick","javascript:return true");

})();

