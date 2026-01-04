// ==UserScript==
// @name         基础教育教师培训网，全自动学习！
// @namespace    https://greasyfork.org/
// @version      0.5
// @description  https://jx19qy.gpa.enetedu.com/
// @author       You
// @match        https://jx19qy.gpa.enetedu.com/mycourse/MyCourse/MyEventList*
// @match        https://jx19qy.gpa.enetedu.com/Event/MyjoinEvent*
// @match        https://jx19qy.gpa.enetedu.com/Event/CourseWare*
// @match        https://jx19qy.gpa.enetedu.com/MyCourse/Process*
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/448446/%E5%9F%BA%E7%A1%80%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD%E7%BD%91%EF%BC%8C%E5%85%A8%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/448446/%E5%9F%BA%E7%A1%80%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD%E7%BD%91%EF%BC%8C%E5%85%A8%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%EF%BC%81.meta.js
// ==/UserScript==

(function() {

    window.onload=function(){
        if((window.location.href).substring(0,78)==='https://jx19qy.gpa.enetedu.com/mycourse/MyCourse/MyEventList?studentproject_id')
        {
            var main_1=[];
            $(".item li").each(function(){//获取主目录未完成学习任务
                var url=$(this).find("a").attr("href");
                var url_ok=$(this).find("i").html();
                if(url_ok==="[未完成]"){
                    var s={"url":url};
                    main_1.push(s);
                }
            });
            GM_setValue("list",[]);//储存学习链接上级按键命令
            GM_setValue("list_url",[]);//储存学习页面url
            if(main_1.length>0){
                if (confirm("你还有："+main_1.length+"个任务未完成！下面将自动获取未完成学习的每一个子项，请不要操作电脑！完成扫描后将自动开始学习！！")) { //if语句内部判断确认框
                    saomiao(main_1);//扫描未完成学习按键
                } else {

                }
            }else{
                alert("你已完成全部学习任务！");
            }
        }
    }
    function saomiao(main_1){
        var xuexi_list_1=main_1;
        var winURL=null;
        var main_n=0;
        if(main_n<xuexi_list_1.length){//ss=1用于此程序扫描判断，用户自行进入页面则不监测
            winURL= window.open(xuexi_list_1[main_n].url+"&ss=1", '_blank');
            const loop = setInterval(() => {
                if (winURL && winURL .closed) {
                    main_n++;
                    if(main_n<xuexi_list_1.length){
                        winURL= window.open(xuexi_list_1[main_n].url+"&ss=1", '_blank');
                    }else{
                        clearInterval(loop);
                        get_s_url(xuexi_list_1);//获取学习页面url
                    }
                }
            }, 500);
        }
    }
    function get_s_url(xuexi_list_1){
        var tt=GM_getValue("list");
        var winURL=null;
        var main_n=0;
        if(main_n<tt.length){
            var tt_s=tt[main_n].split(",");
            winURL= window.open(tt_s[2]+"&tt="+main_n, '_blank');
            const loop = setInterval(() => {
                if (winURL && winURL .closed) {
                    console.log(GM_getValue("list_url").length);
                    main_n++;
                    if(main_n<tt.length){
                        var tt_s=tt[main_n].split(",");
                        winURL= window.open(tt_s[2]+"&tt="+main_n, '_blank');
                    }else{
                        clearInterval(loop);
                        study_s();
                    }
                }
            }, 500);
        }
    }
    function study_s(){//自动学习页面
        var tt=GM_getValue("list_url");
        var winURL=null;
        var main_n=0;
        if(main_n<tt.length){
            winURL= window.open(tt[main_n], '_blank');
            const loop = setInterval(() => {
                if (winURL && winURL .closed) {
                    main_n++;
                    if(main_n<tt.length){
                        winURL= window.open(tt[main_n], '_blank');
                    }else{
                        clearInterval(loop);
                    }
                }
            }, 500);
        }
    }

    setInterval(function() {
        if((window.location.href).substring(0,48)==="https://jx19qy.gpa.enetedu.com/Event/MyjoinEvent")
        {
            if(getQueryString("ss")!==null){
                var url1=window.location.href;
                var list=[];
                var url=url1.replace("https://jx19qy.gpa.enetedu.com","").replace("&ss=1","");
                $("table tbody tr td a").each(function(){
                    var s=($(this).attr("href"));
                    s=s.replace("javascript:ShowCourseware","");
                    s=s.replace("(","");
                    s=s.replace(")","");
                    s=s.replace("''",url);
                    if(s!==""&&s!=undefined){
                        var ss=s.split(",");
                        if(ss[1]!=null){
                            list.push(s);
                        }
                    }
                });
                set_v(list);
            }
            if(getQueryString("tt")!==null){
                var n=getQueryString("tt");
                var ss1=GM_getValue("list");
                var dd=ss1[n].split(",");
                ShowCourseware(dd[0],dd[1],'')
            }
        }
        if((window.location.href).substring(0,47)==="https://jx19qy.gpa.enetedu.com/Event/CourseWare"){
                var sss=[];
                $("table tbody tr").each(function(){
                    var url=$(this).find("a").attr("href");
                    var url_ok=$(this).find("span").html();
                    var time=$(this).find("span").parent().prev().html();
                    if(url_ok!== undefined && url!==undefined &&  (url_ok.indexOf("未学完") !== -1||url_ok.indexOf("未开始") !== -1)){
                        var t= ClearBr(time);
                        var f=(Number(t.split("分")[0])+1)*60;
                        var ut=url+"&t="+f;
                        sss.push(ut);
                    }
                });
                set_url(sss);
        }
        if((window.location.href).substring(0,47)==="https://jx19qy.gpa.enetedu.com/MyCourse/Process"){
            if(getQueryString("t")!==null){
                var a = document.querySelector("iframe")
                var b = a.contentWindow.document;
                var c=b.getElementsByClassName("qplayer-pause")[0];
               var play_L=$(b.getElementsByClassName("qplayer-bar")).css("width");
                var play_t=$(b.getElementsByClassName("qplayer-barcurr")).css("width");
                if(c.className==="qplayer-pause"){
                    var bt= b.getElementsByClassName("qplayer-center-btn");
                    var jq_bt=$(bt);
                    jq_bt.click();
                }
                if((parseInt(play_t))>=parseInt(play_L)-1){
                    window.close();
                }
                var t=Number(getQueryString("t"));
                st_time++;
                if(st_time>=t){
                    window.close();
                }
            }
        }
    }, 1000);
    var st_time=0;
    function set_url(u){
        var a=GM_getValue("list_url");
        var b=u;
        var c=b.concat(a);
        var d=repeat(c)
        GM_setValue("list_url",[]);
        GM_setValue("list_url",d);
        console.log(GM_getValue("list_url").length);
        window.close();
    }
    function set_v(u){
        var a=GM_getValue("list");
        var b=u;
        var c=b.concat(a);
        var d=repeat(c)
        GM_setValue("list",[]);
        GM_setValue("list",d);
        window.close();
    }
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
    //获取参数t（要播放的时间单位为分钟）
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
    function ClearBr(key) {
        key = key.replace(/<\/?.+?>/g,"");
        key = key.replace(/[\r\n]/g, "");
        key = key.replace(/\s+/g, "");
        return key;
    }
    //去除重复数组
    function repeat(arr) {

        for (var i = 0; i < arr.length; i++) {
            for (var j = i + 1; j < arr.length; j++) {//第一次是拿第一个数据和剩余的n-1个数据判断是否相等、第二次是拿第二个数据和剩余的n-1个数据相比
                if (arr[i] == arr[j]) {

                    var del = j;

                    arr.splice(del, 1);//找到了该数据的下标就删除了
                }
            }
        }
        return arr;
    }
})();