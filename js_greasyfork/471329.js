// ==UserScript==
// @name         飞鱼
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  刷题
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/zhangsan-layui@1.0.3/layui.js
// @author       You
// @match        */*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=2.7
// @grant        GM_xmlhttpRequest
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/471329/%E9%A3%9E%E9%B1%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/471329/%E9%A3%9E%E9%B1%BC.meta.js
// ==/UserScript==

(function() {
    var subjects=[];
    var answers=[];
    var flag_answers_show=false;
    var currentIndex=0;
    var rid=0;
    var flag_close=false;
    var style_height=0;
    var style_width=250;
    var current_complete_code=-2;
    var win_font_color,win_bg_color;
    var duetime;
    var url_filter;
    var sele_year='',sele_province='';
    'use strict';
    var targ='<div id="div_sele" class="left_side">'+
        '<div style="float:right;"><i onclick="myclose()" title="显示/隐藏" class="layui-icon layui-icon-screen-full"></i><br><i class="layui-icon layui-icon-username" title="账号/设置" onclick="showSet()"></i><br><i class="l-icon layui-icon layui-icon-return" title="返回"></i><br><i class="l-icon layui-icon layui-icon-date" title="答题卡" onclick="showAnswers()"></i><br><i class="l-icon layui-icon layui-icon-prev" title="上一题" onclick="showIndex(-1)"></i><br><i class="l-icon layui-icon layui-icon-next" title="下一题" onclick="showIndex(1)"></i><br><i class="l-icon layui-icon layui-icon-ok-circle" title="交卷" onclick="cli_ok()"></i></div>'+
        '<div id="d_mycontent"><div id="d_papers" class="collectDiv"><div id="d_comp"></div><table id="t_papers" class="layui-table" lay-skin="nob"></table></div><div id="d_subjects" class="collectDiv"></div><div id="d_answers" class="collectDiv"></div><div id="d_login" class="collectDiv"><div id="l_form">账号：<input type="text" id="i_un"/><br>密码：<input type="password" id="i_psw"/><br><button onclick="cli_l()">登录</button></div><img style="width:100px;height:100px;" src="http://10.161.192.177:5002/static/wechat_code/wechat_code.png"/><div id="d_msg"></div></div></div></div>';
    $('body').append(targ);
    //样式
    $(document.body).append(`
<style>
.left_side{left: 10px;} .right_side{right: 10px;}  #div_sele{top: 300px;overflow: hidden;z-index: 9999;position: fixed;padding:5px;text-align:left;width: 255px;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;}
#t_pap{cursor:pointer;} #d_subjects{height:200px;overflow: auto;} #d_answers{height:200px;overflow-y: auto;} #d_papers{height:200px;overflow: auto;} #t_papers tr{cursor:pointer;}
.collectDiv{height:200px;display:none;} *{  scrollbar-color: #eee #fff;  scrollbar-width: thin;}::-webkit-scrollbar {  width: 8px;  } #l_form input{border:1px solid;} .layui-icon{cursor:pointer;} .s_sele{border:1px solid;} .s_unsele{} .s_btn{margin:5px;cursor:pointer;} body #div_sele label{color:none;} body .sele_op{margin:0px 2px;padding:0px;height:20px;}
</style>
  `)
    //样式
    $(document.body).append(`<link rel="stylesheet" href="https://unpkg.com/layui@2.6.8/dist/css/layui.css">`);
    unsafeWindow.getset = function(){
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'http://10.161.192.177:5002/hb_exampaper_getset',
            onload: response => {
                console.log(response.response.length);
                if(response.response.length>2000){
                    $('.collectDiv').hide();
                    $("#d_login").show();
                    myclose();
                    showMyIcon(1);
                }else{
                    var res=JSON.parse(response.response);
                    var style=res.style;
                    duetime=res.hb_set_membership_duetime;
                    console.log('left',style.left);
                    console.log('top',style.top);
                    $('#div_sele').css('background-color',style.bg_color).css('background-color',style.bg_color).css('color',style.font_color).css('bottom','none')
                        .css('font-size',style.font_size).css('height',style.height).css('left',style.left+'px')
                        .css('top',style.top+'px').css('width',style.width);
                    $('.collectDiv').css('height',style.height);
                    style_height=style.height;
                    style_width=style.width;
                    $('#t_papers').css('background-color',style.bg_color).css('color',style.font_color);
                    win_font_color=style.font_color;
                    win_bg_color=style.bg_color;
                    url_filter=style.url;

                    myclose();

                    var url=window.location.href;
                    console.log('url:'+ url);
                    console.log('url_filter:'+url_filter);
                    var flag_show=false;
                    if(url_filter!='所有'){
                        var urls=url_filter.split('#');
                        for(var i=0;i<urls.length;i++){
                            var flag=url.indexOf(urls[i])!=-1;
                            flag_show=false||flag;
                        }
                    }else{
                        flag_show=true;

                    }
                    if(flag_show){
                        getpaper(-1);
                        showMyIcon(2);
                    }else{
                        $('#div_sele').hide();
                        console.log('匹配网址不成功');
                    }

                }
            }
        });
    }

    unsafeWindow.getpaper = function(c_code){
        //0 未完成；1 完成；-1 未开始；
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'http://10.161.192.177:5002/hb_exampaper_getpaper?c_code='+c_code,
            onload: response => {
                var res=JSON.parse(response.response);
                var papers=res.data;
                $("#d_comp").html('');
                var dic_code={'未开始':-1,'未完成':0,'已完成':1};
                var dic_icon={'未开始':'<i class="layui-icon layui-icon-rate"></i>','未完成':'<i class="layui-icon layui-icon-rate-half"></i>','已完成':'<i class="layui-icon layui-icon-rate-solid"></i>'};
                for(var key in dic_code){
                    var v=dic_code[key];
                    $("#d_comp").append('<span title="'+key+'" class="'+(c_code==v?'s_sele s_btn':'s_unsele s_btn')+'" onclick="getpaper('+v+')">'+dic_icon[key]+'</span>');
                }
                current_complete_code=c_code;
                $("#d_comp").append('<select onchange="change_year(this)" class="sele_op" id="sele_year" ><option value="">年份</option></select>');
                $("#d_comp").append('<select onchange="change_province(this)" class="sele_op" id="sele_province"><option value="">省份</option></select>');
                var current_year=new Date().getFullYear();
                for(i=0;i<10;i++){
                    var y=current_year-i;
                    $("#sele_year").append('<option value="'+y+'">'+y+'</option>');
                }
                var arr_province='国家|选调|模拟|广东|吉林|江苏|江西|辽宁|内蒙古|深圳|广州|安徽|宁夏|北京|青海|福建|山东|甘肃|山西|陕西|广西|上海|贵州|四川|海南|天津|河北|西藏|河南|新疆|黑龙江|云南|湖北|湖南|浙江|重庆'.split('|');
                for(i=0;i<arr_province.length;i++){
                    var p=arr_province[i];
                    $("#sele_province").append('<option value="'+p+'">'+p+'</option>');
                }
                $('.sele_op').css('color',win_font_color).css('background',win_bg_color);
                $("#t_papers").empty();
                if(papers.length==0){
                    $("#t_papers").append("<tr class='t_pap'><td>无数据</td><tr>");
                }
                for(var i=0;i<papers.length;i++){
                    $("#t_papers").append("<tr class='t_pap' onclick='window.c_pap("+papers[i].hb_exampaper_id+")'><td class='paper_t'>"+papers[i].hb_exampaper_title+"</td>"+((c_code==1)?"<td>"+papers[i].hb_answer_record_score+"/<br>"+papers[i].hb_exampaper_titlenumber+"</td>":"")+"<tr>");
                }
                //alert(papers[i].hb_exampaper_title);
                $('.collectDiv').hide();
                $("#d_papers").show();
                $("#d_comp").show();
                showMyIcon(3);
            }
        });
    }
    unsafeWindow.c_pap = function(id){
        GM_xmlhttpRequest({
        method: 'GET',
        url: 'http://10.161.192.177:5002/hb_exampaper_getsubject?pid='+id,
        onload: response => {
            var res=JSON.parse(response.response);
            subjects=res.data;
            answers=res.details;//获取已答的答案
            rid=res.rid;
            $("#d_papers").hide()
            $("#d_answers").hide()
            $('#d_subjects').show();
            showSubject(0);
            showMyIcon(2);
        }
        });
    }
    unsafeWindow.showIndex = function(offset){
        showSubject(currentIndex+offset);
    }
    unsafeWindow.showSubject = function(index){
        if(index<subjects.length){
            var subject=subjects[index];
            console.log(subject);
            var a_record_id=rid;
            var is_correct='';
            var jiexi=''
            if(current_complete_code==1){//已完成
                jiexi+=('<div>正确答案：'+subject.hb_subject_correctanswer+'</div>');
                jiexi+=('<div>解析：'+subject.hb_subject_parsing+'</div>');

                var arr_zimu=['A','B','C','D',];
                var selectOption=answers[index];
                //hb_subject_correctanswer C
                is_correct=(arr_zimu[selectOption]==subject.hb_subject_correctanswer)?'（<i class="layui-icon layui-icon-ok"></i>）':'（<i class="layui-icon layui-icon-close"></i>）';
            }
            var ques='<p>第'+(parseInt(subject.hb_subject_serial_number)+1)+'题：'+is_correct+subject.hb_subject_question+'</p>';
            var option=formatOption(a_record_id,subject.hb_subject_id,subject.hb_subject_options,index);
            var html_subject='<div style="height:'+style_height+'px;overflow: auto;">'+ques+option+jiexi+'</div>';
            $('#d_subjects').html(html_subject);
            console.log($('#d_subjects').find('img').attr('data-src'));
            $('#d_subjects').find('img').each(function(){
                if($(this).attr('data-src')!=undefined){
                    $(this).attr('src',$(this).attr('data-src'));
                }
            });
            currentIndex=index;
            $('#d_papers').hide();
            $('#d_subjects').show();
            $('#d_answers').hide();
        }
    }
    unsafeWindow.formatOption = function(a_record_id,a_subject_id,str_options,index){
        var res='';
        var arr_zimu=['A','B','C','D',];
        var arrOptions=str_options.split('||');
        var selectOption=answers[index];
        for(var i=0;i<arrOptions.length;i++){
            var answer_parm=a_record_id+','+a_subject_id+','+i+','+index;
            var checked=(selectOption==i)?'checked="checked"':'';
            res+='<p><input style="cursor:pointer;" type="radio" id="'+answer_parm+'" '+checked+' onchange="window.answer('+answer_parm+')" name="'+a_subject_id+'" value="'+i+'"><label style="color:'+win_font_color+';display:inline;margin-left:5px;cursor:pointer;" for="'+answer_parm+'">'+arr_zimu[i]+'、'+arrOptions[i]+'</label></p>';
        }
        return res;
    }
    unsafeWindow.answer = function(a_record_id,a_subject_id,answer_number,index){

        if(current_complete_code!=1){//非已完成
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'http://10.161.192.177:5002/hb_exampaper_answer?a_record_id='+a_record_id+'&a_subject_id='+a_subject_id+'&answer_number='+answer_number,
                onload: response => {
                    var res=JSON.parse(response.response);
                    if(res.code==1){
                        if(subjects.length>index+1){
                            answers[index]=answer_number;
                            showSubject(index+1);
                        }
                    }
                }
            });
        }
    }
    unsafeWindow.showAnswers = function(){
        if(flag_answers_show){
            $('#d_papers').hide();
            $('#d_subjects').show();
            $('#d_answers').hide();
        }else{
            $('#d_answers').html('');
            for(var i=0;i<subjects.length;i++){
                var className='layui-bg-blue';
                if(answers[i]==-1){
                    className= 'layui-bg-gray';
                }
                var htm='<span style="cursor:pointer;" onclick="showSubject('+i+')" class="layui-badge-rim '+className+'">'+(i+1)+'</span>';
                $('#d_answers').append(htm);
            }
            $('#d_papers').hide();
            $('#d_subjects').hide();
            $('#d_answers').show();
        }
        flag_answers_show=!flag_answers_show;
    }
    unsafeWindow.myclose = function(){
        if(flag_close){
            $('#d_mycontent').show();
            $('#div_sele').css('width',style_width);
        }else{
            $('#d_mycontent').hide();
            $('#div_sele').css('width','20px');
        }
        flag_close=!flag_close;
    }
    unsafeWindow.showSet = function(){
        window.open("http://10.161.192.177:5002/hb_exampaper_showset");
    }
    unsafeWindow.showMyDiv = function(divId){
        $('.collectDiv').hide();
        $('#'+divId).show();
    }
    unsafeWindow.showMyIcon = function(code){
        //1未登录；2、答题；3、非答题状态
        $('.l-icon').hide();
        $('.layui-icon-screen-full').show();
        switch (code) {
            case 1 :
                break;
            case 2 :
                $('.layui-icon-username').show();
                $('.layui-icon-date').show();
                $('.layui-icon-return').show();
                $('.layui-icon-prev').show();
                $('.layui-icon-next').show();
                $('.layui-icon-ok-circle').show();
                break;
            case 3 :
                $('.layui-icon-username').show();
                break;
        }
    }
    unsafeWindow.cli_l = function(){
        console.log($('#i_un').val().length);
        if($('#i_un').val().length==0 ||$('#i_psw').val().length==0 ){
            $('#d_msg').html('提示：账号密码不能为空');
        }else{
            var parm=("username="+$('#i_un').val()+"&password="+$('#i_psw').val());
            console.log(parm);
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'http://10.161.192.177:5002/q_login?'+parm,
                onload: response => {
                    var res=JSON.parse(response.response);
                    if(res.code==1){
                        getset();
                    }else{
                        $('#d_msg').html('提示：账号密码有误');
                    }
                }
            });
        }
    }
    unsafeWindow.cli_ok = function(){
        var noanswer=(answers.join('')).split('-1').length-1;
        var str_tip=(noanswer>0)?("还有"+(noanswer)+"题未答，确认提交？"):"确认提交？";
        if (confirm(str_tip) == true) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'http://10.161.192.177:5002/hb_exampaper_submitpaper?rid='+rid,
                onload: response => {
                    var res=JSON.parse(response.response);
                    if(res.code==1){
                        getpaper(1);
                    }else{
                        alert('出错了，请刷新重试。');
                    }
                }
            });
        }
    }
    $('#div_sele .layui-icon-return').click(function(){
        getpaper(current_complete_code<0?0:current_complete_code);
    });
    unsafeWindow.change_year = function(t){
        sele_year=($(t).val());
        sele_year_province();
    }
    unsafeWindow.change_province = function(t){
        sele_province=($(t).val());
        sele_year_province();
    }
    unsafeWindow.sele_year_province = function(){
        $('#t_papers .paper_t').each(function(){
            var title=$(this).html();
            if(title.indexOf(sele_year)!=-1 && title.indexOf(sele_province)!=-1){
                $(this).parent().show();
            }else{
                $(this).parent().hide();
            }
        });
    }

    getset();

})();