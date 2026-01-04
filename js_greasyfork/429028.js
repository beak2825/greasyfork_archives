// ==UserScript==
// @name        多彩贵州党史答题
// @namespace   Violentmonkey Scripts
// @match       https://exam.gog.cn/*
// @grant       none
// @version     1.3
// @require     https://cdn.staticfile.org/jquery/1.9.1/jquery.min.js
// @author      -Lightr
// @description 2021/7/7下午7:20:32
// @downloadURL https://update.greasyfork.org/scripts/429028/%E5%A4%9A%E5%BD%A9%E8%B4%B5%E5%B7%9E%E5%85%9A%E5%8F%B2%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/429028/%E5%A4%9A%E5%BD%A9%E8%B4%B5%E5%B7%9E%E5%85%9A%E5%8F%B2%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==
$('#exam_body').append('<div id = "anniu"><button class="btn-s" type="button" id="anniu-sub">显示答案</button><button class="btn-s" type="button" id="zhijiewancheng">直接完成</button></div>')
$('#exam_body').append('<div id = "daan"></div>')
$('.exam_toanswer').append('<div id="sub_auto" style="margin:20px 0 0 0;"></div><div style="margin:20px;font-size:17px;color:#3498db">'+
'由于马上提交不计分，所以需要等待10秒<br>完成刷分后自动刷新分数</div>')
$('#panai-style').append('.btn-s{color:#fff;background: #32b643;padding: 0.4rem 1rem;border: .05rem solid #32b643;opacity: 0.5;} .btn-s:hover{opacity: 0.8;}')
var list_aw =[],sub_time;

function getanswer_sk(){
  if ($('.item_current').data('answer')){
    $('#daan').html('<b><p style="color: red;font-size: 20px;">本题答案为：'+ $('.item_current').attr('data-answer')+'</p></b>')
  }
};
$('#anniu-sub').click(function () {
  getanswer_sk();
});
$('.next-subject').click(function () {
  $('#daan').html('')
  setTimeout(function(){getanswer_sk();},1500);
});
var zjwc = function() {
    sub_time = $('.examtimer').text();
    var time_m = parseInt(sub_time.substring(0,1))*60;
    var time_s = parseInt(sub_time.substring(2,4));
    if(time_m+time_s < 590){
        $('.item').attr('data-subjectid');
        for(var i=1;i<=10;i++){
            var anaw = {};
            anaw["subjectId"] = $(".item_" + i).attr('data-subjectid');
            anaw["subjectTypeId"] = parseInt($(".item_" + i).attr('data-typeid'));
            anaw["optionAnswer"] = $(".item_" + i).attr('data-answer');;
            if (anaw["subjectTypeId"]== 1){
                anaw["wrongStatus"] = 0
            }
            list_aw.push(anaw);
        }
        $.ajax({
            type: 'post',
            cache: false,
            url: '/ExamDSJS/Main/Submit',
            timeout: 15000,
            data: {
                paper: JSON.stringify(list_aw)
            },
            success: function (data) {
                location.href = data.url;
            },
            error: function () {
                layer.msg('提交超时，可能是服务器拥堵，请等待片刻再试');
                layer.close(loading);
            }
        });
    }else{
        alert("请在开始答题10秒钟后提交答案");
    }
}

$('#zhijiewancheng').click(zjwc);
var cishu = 0,f = 1 ,isSub = [],flag=0;
$('#sub_auto').html('刷入<input type="text" name="cishu" id="cishu" size="4" >次 x100分 <button class="btn-s" id=cishu_sub>开始</button> <div id="cishu_show"><b>0</b></div> ')

var Getpagesize = function(){
    if(flag==0){
        cishu = $('#cishu').val();
        flag=1;
    }
    $('#cishu_show').html("<b style='color:#fc5531;'>正在执行第"+f+"次</b>")
    var htmlstring = "",rep = null;
    $.get("https://exam.gog.cn/ExamDSJS/main/exam",function(data){
        htmlstring = data;
        re = /class="item.*"/g;
        rep = htmlstring.match(re);
        for (let index = 0; index <rep.length; index++) {
            var resub ={},data;
            data = rep[index].match(/".*?"/g);
            resub["subjectId"] = data[3].replace(/"/g,"");
            resub["subjectTypeId"] = parseInt(data[2].replace(/"/g,""));
            resub["optionAnswer"] = data[4].replace(/"/g,"");
            if (resub["subjectTypeId"]== 1){
                resub["wrongStatus"] = 0
            }
            // console.log(resub);
            isSub.push(resub); 
        }
    });
    setTimeout(function(){
        $.ajax({
            type: 'post',
            cache: false,
            url: '/ExamDSJS/Main/Submit',
            timeout: 15000,
            data: {
                paper: JSON.stringify(isSub)
            },
            success: function (data) {
                // location.href = data.url;
                if(f<cishu){
                    f++;
                    Getpagesize();
                }else{
                    alert("已完成");
                    location.href ="https://exam.gog.cn/ExamDSJS/main";
                }

                
            },
            error: function () {
                layer.msg('提交超时，可能是服务器拥堵，请等待片刻再试');
                layer.close(loading);
            }
        });
    },11000);
}
$('#cishu_sub').click(Getpagesize);