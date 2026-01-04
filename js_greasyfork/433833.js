// ==UserScript==
// @name         中国大学MOOC(辅助答题)
// @namespace    huakaihk@qq.com
// @version      1.8
// @description  MOOC辅助答题，100%答案匹配
// @author       huan
// @match        *://*.icourse163.org/*
// @run-at       document-end
// @connect      huan.fm210.cn
// @grant        none
// @require      https://lib.baomitu.com/jquery/3.6.0/jquery.min.js
// @antifeature  ads
// @antifeature  membership
// @downloadURL https://update.greasyfork.org/scripts/433833/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6MOOC%28%E8%BE%85%E5%8A%A9%E7%AD%94%E9%A2%98%29.user.js
// @updateURL https://update.greasyfork.org/scripts/433833/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6MOOC%28%E8%BE%85%E5%8A%A9%E7%AD%94%E9%A2%98%29.meta.js
// ==/UserScript==

var conf = {
    title: "MOOC助手",
    datalist:{},
    time:1
};
//cdn库  https://www.bootcdn.cn/layui/
$('head').append('<link href="https://lib.baomitu.com/layui/2.6.8/css/layui.css" rel="stylesheet" type="text/css" />');
$.getScript("https://lib.baomitu.com/layui/2.6.8/layui.js", function(data, status, jqxhr) {
    layui.use('element', function(){
        var element = layui.element;
    });
    layer.closeAll();
    init();
    window.onhashchange = function() {
        layer.closeAll();
        init();
    };
});

function answer1() {
    if (conf.num >= conf.inx) {
        var item = $(".u-questionItem").eq(conf.inx - 1);
        var tm = cl_text(item.find(".j-title").find(".f-richEditorText").html());
        tm = cl_text(tm);
        // layer.msg(tm);
        var tminx = item.find(".position").text();
        var tmtype = item.find(".qaCate>span").text();
        conf.pd = 0;

        var da = answer_p(tm, item);
        var el="";
        if (da != null) {

            if (conf.pd == 0) {
                conf.bad = conf.bad + 1;
                el = $('<tr class="layui-bg-red"><td>' + tminx + '</td><td>' + tm + '</td><td>' + da +
                       '</td></tr>');
                $("#content>table>tbody").append(el);
            } else {
                el = $('<tr><td>' + tminx + '</td><td>' + tm + '</td><td>' + da + '</td></tr>');
                $("#content>table>tbody").append(el);
            }

        } else {
            conf.bad = conf.bad + 1;
            el = $('<tr class="layui-bg-red"><td>' + tminx + '</td><td>' + tm + '</td><td>暂无答案</td></tr>');
            $("#content>table>tbody").append(el);
        }
        document.querySelector("#msg > blockquote").innerHTML = '共获取<span class="layui-bg-blue">&nbsp;' + conf.num +
            '&nbsp;<\/span>道题目,正在完成第<span class="layui-bg-blue">&nbsp;' + conf.inx + '&nbsp;<\/span>道题目';
    } else {
        clearInterval(conf.f);
        document.querySelector("#msg > blockquote").innerHTML = '共获取<span class="layui-bg-blue">&nbsp;' + conf.num +
            '&nbsp;<\/span>道题目,共<span class="layui-bg-red">&nbsp;' + conf.bad + '&nbsp;<\/span>待完成。';

    }
    conf.inx = conf.inx + 1;
    if (conf.num < conf.inx) {
        clearInterval(conf.f);
        document.querySelector("#msg > blockquote").innerHTML = '共获取<span class="layui-bg-blue">&nbsp;' + conf.num +
            '&nbsp;<\/span>道题目,共<span class="layui-bg-red">&nbsp;' + conf.bad + '&nbsp;<\/span>待完成。';

    }
}

function answer_p(tm, item) {
    var da="";
    tm = tm.replace(/&amp;/g, "").replace(/http.*\/(.+)\./g,"$1").replace(/[^\u4e00-\u9fa5^\w]/g, "");
    for (var i = 0; i < conf.paperdata.length; i++) {
        var ytm=conf.paperdata[i]['tm'].replace(/http.*\/(.+)\./g,"$1").replace(/[^\u4e00-\u9fa5^\w]/g, "");
        if (tm == ytm) {
            var type = $.trim(item.find(".qaCate>span").text()); //题目类型
            switch (conf.paperdata[i]['status']) {
                case -1:
                    da = null;
                    break;
                case 1:
                    da = conf.paperdata[i]['das'];
                    if (type == "判断"||(type==""&&conf.paperdata[i]['type']==4)) {
                        var tstr = ["正确", "对", "√", "true"];
                        conf.pd = conf.pd + 1;
                        if (tstr.indexOf(da[0]) > -1) {
                            item.find(".choices>li").find(".u-icon-correct").parent().parent().css("border",
                                                                                                   "1px solid red");
                        } else {
                            item.find(".choices>li").find(".u-icon-wrong").parent().parent().css("border",
                                                                                                 "1px solid red");
                        }

                    } else {

                        for (var j = 0; j < item.find(".choices>li").length; j++) {
                            var xxtemp = cl_text(item.find(".choices>li").eq(j).find(".f-richEditorText").html());
                            xxtemp = xxtemp.replace(/&amp;/g, "").replace(/http.*\/(.+)\./g,"$1").replace(/[^\u4e00-\u9fa5^\w]/g, "");
                            for (var z = 0; z < da.length; z++) {
                                if (xxtemp == da[z].replace(/http.*\/(.+)\./g,"$1").replace(/[^\u4e00-\u9fa5^\w]/g, "")) {
                                    item.find(".choices>li").eq(j).css("border", "1px solid red");
                                }
                            }

                            conf.pd = conf.pd + 1;
                        }
                    }




                    break;
                case 2:
                    conf.pd = conf.pd + 1;
                    da = conf.paperdata[i]['da'];
                    if (type == "填空"||(type==""&&conf.paperdata[i]['type']==3)) {

                        var el = $('<div><h3>答案:<span style="color:green">' + da + '</span></h3><div>');

                        item.find(".j-title").find(".f-richEditorText").append(el);
                    }
                    break;
            }

            return da;
        }
    }
    return null;
}
function get_url_p(name)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == name){return pair[1];}
    }
    return(false);
}
function get_answers(aid) {
    var code = 0;
    var da = "";
    var courseid= window.location.href.split("?")[0].split("-")[1];
    var tid=get_url_p("tid");
    $.ajax({
        url: "https://huan.fm210.cn/mooc/index",
        data: {
            "id": aid,
            "courseid":courseid,
            "tid":tid
        },
        dataType: "json",
        async: false,
        type: "get",
        success: function(data) {
            code = data.code;
            if (data.code == 1) {
                da = data.data
            } else {
                clearInterval(conf.f);
                layer.msg(data.msg);
            }
        }

    })
    if (code == 1) {

        return da;
    } else {
        return null;
    }

}

function cl_text(text) {
    text = text.replace(/<(?!\/?img.+?>)[^<>]*>/g, "");
    text = text.replace(/(<img(?=\s).*?)\s+style=".*?"(.*?\/?>)/g, "$1$2");
    text = text.replace(/http:\/\//g, "https:\/\/");
    text = text.replace(/&#[^;]{2,};/g, "");
    text = text.replace(/\t/g, "");
    text = text.replace(/\n/g, "");
    text = text.replace(/\r/g, "");
    text = text.replace(/&.*?;/g, "");
    return $.trim(text);

}

function init() {
    var url = location.pathname;
    var urls = window.location.href.split("#")[1].split("?")[0];
    console.log(urls);
    // var name = document.querySelector("#courseLearn-inner-box > div > div.u-learn-moduletitle.f-cb > h2");
    layer.closeAll();
    switch (urls) {
        case "/home/course":
            //个人课程主页
            break;
        case "/learn/announce":
            //学习页面
            break;
        case "/learn/testlist":
            //作业页面
            var ids = $("a[id^='auto-id']").id;
            break;
        case "/learn/examlist":
            //考试页面
            break;
        case "/learn/examObject"://旧版考试
            show();
			conf.id = window.location.href.split("#")[1].split("&id=")[1];
            break;
        case "/learn/quiz"://测验
            show();
            conf.id = window.location.href.split("#")[1].split("?id=")[1];
            break;
        case "/learn/content"://课件测验
            var tid=get_url_p("tid");
            var cid = window.location.href.split("cid=")[1];
            $.ajax({
                url: "/web/j/courseBean.getLastLearnedMocTermDto.rpc?csrfKey=797f430aebe845248c82344f783ca21f",
                data: {
                    "termId":tid
                },
                dataType: "json",
                async: false,
                type: "post",
                success: function(data) {
                    conf.data=data['result']['mocTermDto']['chapters'];
                    conf.data.forEach((item,index,array)=>{
                        item['lessons'].forEach((item1,index1,array1)=>{
                            item1['units'].forEach((item2,index2,array2)=>{

                                item2['contentType']==5?conf.datalist[item2['id']]=item2['contentId']:"";
                            })
                        })
                    });
                    console.log(conf.datalist);
                }

            })
            conf.id = conf.datalist[cid];
            console.log(cid);
            cid&&(cid in conf.datalist)&&show();

            break;
        case "/learn/ojhw"://作业
        case "/learn/hw": //主观题
            layer.msg("别看了不支持这玩意", {
                icon: 5
            });
            break;

        default:
            console.log(123);

    };

}

function show() {
    layer.closeAll();
    layer.open({
        type: 1,
        area: ['500px', '300px'],
        offset: 'rb',
        id: 'msgt',
        closeBtn: 0,
        title: conf.title,
        success: function(layero, index){
            conf.layerdom=layero[0];
            conf.layerindex=index;
                $.ajax({
                    url: "https://huan.fm210.cn/mooc/msg",
                    dataType: "json",
                    async: false,
                    type: "get",
                    success: function(data) {
                        data.msg?$(conf.layerdom).find(".layui-colla-content").html(data.msg):$(conf.layerdom).find(".layui-colla-content").html("本脚本仅供学习参考，请勿在非法用途使用<br>未收录？不要着急等几分钟再试试。");

                    }

                })
        },
        shade: 0,
        maxmin: true,
        anim: 2,
        content: '<div id="msg" ><blockquote class="layui-elem-quote layui-quote-nm"><button type="button"  class="layui-btn layui-btn-normal start">点我获取题库-请确保在试卷页面点击<button></blockquote>'+
        '<div class="layui-collapse"><div class="layui-colla-item"><h2 class="layui-colla-title">公告</h2><div class="layui-colla-content layui-show"></div></div>'
        +'<div id="content"><ul></ul>		<table class="layui-table"> <colgroup> <col width="50"> <col> <col> </colgroup> <thead> <tr> <th>序号</th> <th>题目</th> <th>答案</th> </tr> </thead> <tbody>  </tbody> </table></div></div></div>'
    });
    $(".start").click(function() {
        start();
    })
}

function start() {
    conf.num = $(".u-questionItem").length;
    if (conf.num=="") {
        layer.msg("没题目是怎么回事呢，页面对了吗", {
            icon: 5
        });
        return 0;
    }
    conf.inx = 1;
    conf.bad = 0;
    conf.paperdata = get_answers(conf.id);
    conf.paperdata?(conf.f = setInterval(answer1, conf.time)):"";

}
