// ==UserScript==
// @name         空中校园
// @namespace    oco-kit
// @description  用于腾讯空中课堂网课平台的小助手，支持提前进入课堂并自动进入课堂，目前处于测试阶段。
// @version      0.2
// @description  try to take over the world!
// @author       Kitkim
// @match        *://pre-lite.qcloudtrtc.com/?gr=*
// @match        *://pre-lite.qcloudtrtc.com/?stype=*
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/404330/%E7%A9%BA%E4%B8%AD%E6%A0%A1%E5%9B%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/404330/%E7%A9%BA%E4%B8%AD%E6%A0%A1%E5%9B%AD.meta.js
// ==/UserScript==

(function() {
    var goalyear=2020
    var goalmonth=5
    var goalday=29
    var goalhour=7
    var goalmin=0
    var goaltime=""
    var studentid=0
    var goaltime_s=0
    var floatingwindow=" <div id='floating_window' style=' position: fixed; top: 10px; right: 10px; font-size: 15px; z-index: 6666; background: white; display: flex; margin: auto; box-shadow: 0 0 10px #888888; border-radius: 10px;'>  <div class='msg' id='running' style=' margin:auto; padding: 20px;'>小助手运行中</div>  <div class='msg' style=' background: #0a818c; border-bottom-right-radius: 10px; border-top-right-radius: 10px; color: white; box-shadow: -5px 0 10px #888888; margin:auto; padding: 20px;' id='timer'>当前时间为：11111</div> </div>"
    'use strict';
    console.log("ok")
    $(function(){
        init();
    });
    function init(){
        studentid =getstuid()
        console.log(studentid)
        console.log(location.href.indexOf("classlist"))
        console.log(location.href.indexOf("student"))
        if(location.href.indexOf("student")>-1){
            console.log("1")
            iteminit()
        }else if(location.href.indexOf("stype")>-1&&location.href.indexOf("classlist")>-1){
            console.log("2")
            listinit()
        }else {
            console.log("3")
            changesearch()
            //add change
        }
    };
    function getstuid(){
        var org=location.href
        var id=org.match(gr=/\d[0-9]*/)[0]
        return id
    };
    function changesearch(){
        var init_timer =setTimeout(function(){
            var url='https://pre-lite.qcloudtrtc.com/?stype=university&gr='+studentid+'#/classlist/uni-ynu2'
            var onclick="location.href='"+url+"'"
            var pre_button='<button onclick="'+onclick+'"><span>切换学号搜索</span></button>'
            console.log($('.el-input--small').parent().html())
            $('.el-input--small').parent().append(pre_button)
        },5000);

    };
    function listinit(){
        var init_timer =setTimeout(function(){
            var classlist=$('tbody').find('.el-table__row')
            console.log(classlist)
            classlist.each(function(i,item){
                var status=$(item).find('.el-table_1_column_6').find(".cell").find('span').html().replace(/(^\s*)|(\s*$)/g, '')
                console.log("s"+status)
                if(status=="未开课"){
                    var classid=$(item).find('.cell').first().html()
                    $(item).find('.cell').last().find('div').append(makenewbutton(studentid,classid))
                    console.log($(item).find('.cell').first().html())
                }
            })
            //console.log(classid)
            //console.log($('.el-table__row').last().find('.cell').last().children().html())
            //var s='https://pre-lite.qcloudtrtc.com/?gr='+studentid+'#/class/uni-ynu2/student/'+classid+'/trtc' onclick="location.href='链接写这里'"
        },5000);
    };
    function makenewbutton(id,classid){
        var url='https://pre-lite.qcloudtrtc.com/?gr='+id+'#/class/uni-ynu2/student/'+classid+'/trtc'
        var onclick="location.href='"+url+"'"
        var pre_button='<button type="button" class="el-button el-button--default el-button--mini" onclick="'+onclick+'"><!----><!----><span>提前去课堂</span></button>'
        return pre_button
    };
    function iteminit(){
        var init_timer =setTimeout(function(){
            var s=$(".detectenter-left").find('.content-container').find('.text').last().html().replace(/(^\s*)|(\s*$)/g, '')
            console.log(s)
            if(s=="待开课"){
                $(".detect-enter").append(floatingwindow)
                console.log("待开课")
                var list=$(".detectenter-left").find(".content-container").find(".ivu-row")
                list.each(function(index,e){
                    if($(e).find(".lable").html()=="开始时间："){
                        //console.log($(e).find(".text").html())
                        //console.log($(e).find(".text").html().replace(/(^\s*)|(\s*$)/g, ''))
                        goaltime_s=Date.parse($(e).find(".text").html().replace(/(^\s*)|(\s*$)/g, ''))
                        goaltime=new Date(goaltime_s)
                        goalyear=goaltime.getFullYear()
                        goalmonth=goaltime.getMonth()
                        goalday=goaltime.getDate()
                        goalhour=goaltime.getHours()
                        goalmin=goaltime.getMinutes()
                        //console.log(Date.parse($(e).find(".text").html().replace(/(^\s*)|(\s*$)/g, '')))
                        console.log("上课时间为："+goaltime)
                        clearTimeout(init_timer)
                    }
                })
                timer();

            }
            else if(s=="进行中"){
                if($('.detectenter-right').find('.ivu-row-flex').find('.tic-btn').html()=="进入课堂，并授权老师开启我的音视频设备"){
                    $('.detectenter-right').find('.ivu-row-flex').find('.tic-btn').click()
                }
            }
        },1000);
    };
    function timer(){
        console.log("当前时间为："+new Date())
        var ss ="距离自动进入课堂还有"
        var temptt=caltime(new Date(),goaltime_s)
        var uu=temptt.days+"天"+temptt.hours+"时"+temptt.minutes+"分"
        $("#timer").text(ss+uu)
        var t=setInterval(
            function(){
                var ct=new Date();
                var s ="距离预定刷新还有"
                var tempt=caltime(ct,goaltime_s)
                var u=tempt.days+"天"+tempt.hours+"时"+tempt.minutes+"分"
                $("#timer").text(s+u)
                console.log("计时中")
                console.log("当前时间为："+ct)
                if(ct.getFullYear()==goalyear&&ct.getMonth()==goalmonth&&ct.getDate()==goalday&&ct.getHours()>=goalhour&&ct.getMinutes()>=goalmin){
                    location.reload(true)
                    clearInterval(t)
                }
            },60000
        )
        };
    function caltime(date1,date2){
        var date3=date2-date1; //时间差的毫秒数


        //计算出相差天数
        var days=Math.floor(date3/(24*3600*1000))

        //计算出小时数

        var leave1=date3%(24*3600*1000)    //计算天数后剩余的毫秒数
        var hours=Math.floor(leave1/(3600*1000))
        //计算相差分钟数
        var leave2=leave1%(3600*1000)        //计算小时数后剩余的毫秒数
        var minutes=Math.floor(leave2/(60*1000))


        //计算相差秒数
        var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
        var seconds=Math.round(leave3/1000)
        return {"days":days,"hours":hours,"minutes":minutes}
    };
    // Your code here...
})();