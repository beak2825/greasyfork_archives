// ==UserScript==
// @name         HUST华中科技大学军理线上作业简易自动填充助手
// @namespace    https://github.com/gongchen618
// @version      0.1
// @description  hust junli answer auto fulfill
// @author       gongchen618
// @match        http://dzdq.hustp.com/index.php?m=Exercises&a=exercises_detail&id=*
// @grant        none
// @require      https://lib.baomitu.com/jquery/3.6.0/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445342/HUST%E5%8D%8E%E4%B8%AD%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E5%86%9B%E7%90%86%E7%BA%BF%E4%B8%8A%E4%BD%9C%E4%B8%9A%E7%AE%80%E6%98%93%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/445342/HUST%E5%8D%8E%E4%B8%AD%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E5%86%9B%E7%90%86%E7%BA%BF%E4%B8%8A%E4%BD%9C%E4%B8%9A%E7%AE%80%E6%98%93%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

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

function init() {
    init_answer();
    show();
}


var answer = new Array();
function init_answer() {
    answer[1528] = "B,D,D,C,A,A,B,B,C,C,B,C,A,B,A,A,D,B,D,B,C,C,A,A,A,B,A,B,B,B,ABCDE,ABCD,ACD,BD,ABCD,ABCE,ABCE,AD,ABC,AC,ABC,ABCD,ACD,ABD,AD,BC,ABD,ABCD,ABCD,ABC,ABC,AB,ABCD,ABCD,ABCD,ABCD,ABC,ABC,ABC,ABCD"
    answer[1529] = "C,B,C,A,B,D,A,D,C,A,B,C,D,B,C,ABCDE,ABCD,BCDE,ABDE,ACD,ABCDE,ABDE,ACD,ABCDE,ABCDE,ABCDE,ABCE,ABE,ABDE,ACD"
    answer[1530] = "A,C,D,A,B,A,D,C,B,A,A,C,A,D,C,ABC,ABCD,ABC,ABCD,ABC,ABC,ABCD,ABC,ABCD,ABD,ABC,ABD,ABC,ABC,BCD"
    answer[1531] = "C,D,B,D,B,A,A,A,B,D,A,D,D,B,A,B,C,C,A,B,C,D,B,A,C,B,A,C,D,A,C,ABCE,ABCD,ABCD,ACD,ABCD,ABD,BCD,ABCDE,ABCD,ABCD,AB,ABCD,ABCDE,ABC,ABCD,ABCD,ABCD,ABCD,ABCD,BC,AB,ABCE,BCD,BC,ABC,ABC,BCD,ABCD,ABC"
    answer[1536] = "C,C,D,C,B,A,A,A,A,A,B,A,C,A,A,B,C,D,D,A,B,B,A,A,B,A,B,C,B,B,ABCD,ABC,ABC,ABCDEF,ABC,ABC,ABCD,ABCDE,ABCDE,ABCDEF,ABCDE,ABCDE,ABCD,ABCD,BCD,ACD,ABCD,ABCD,ABC,ABCDE,ABC,ABCDEF,ABCDEF,ABCD,ABCD,ABCD,ABCD,ABCD,ABCDE,ABCD"
    answer[1690] = "C,C,B,A,B,C,B,B,D,C,B,A,A,B,C,D,C,B,A,B,ABC,ABCD,ABC,ABCDE,ABC,ABCDE,ABCD,ABCDE,BCD,ABCD,ABCD,ABCD,ABD,ABCD,ABCDE,ABCD,ABC,ABCD,AB,ABCDE,ABCD,AB,ABCDE,ABC,ABCDEF,ABCD,ABC,ABCDEF,ABC,ABC"
}

var conf = {
    title: "HUST军理助手",
    datalist:{},
    time:1
};

function show() {
    layer.open({
        type: 1,
        area: ['200px', '150px'],
        offset: 'rb',
        id: 'msgt',
        closeBtn: 0,
        title: conf.title,
        shade: 0,
        maxmin: true,
        anim: 2,
        content: '<div id="msg"><blockquote class="layui-elem-quote layui-quote-nm"><button type="button" class="layui-btn layui-btn-normal start">点我自动填充答案<button></blockquote></div>'
    });
    $(".start").click(function() {
        start();
    })
}

function start(question_index_l, question_index_r){
    var item_page_id = document.getElementsByName("exercises_id");
    var item_problem_count = document.getElementById("allcount");
    var item_problem_id = document.getElementsByName("op_id");
    var item_problem_type = document.getElementsByName("op_type");

    if (item_problem_count == null || item_page_id.length == 0 || item_problem_id.length == 0 || item_problem_type.length == 0) { alert("页面错误"); return; }
    if (answer[item_page_id[0].value] == null) { alert("未收录该作业答案"); return; }

    var problem_count = item_problem_count.value;
    var problem_answer = answer[item_page_id[0].value].split(",");
    var problem_id = item_problem_id[0].value.split(",");
    var problem_type = item_problem_type[0].value.split(",");

    if (problem_answer.length != problem_count) { alert("答案与题数不符，请检查"); return; }

    for (var i = 0; i < Math.min(problem_answer.length, problem_count); i++) {
        if (problem_type[i] == '1') {
            ajax_answer(i,problem_answer[i]);
        } else {
            var box = document.getElementsByClassName("multibox"+problem_id[i])
            for (var c = 0, it = 0; c < box.length; ++c){
                if(problem_answer[i][it] == box[c].value) {
                    ++it;
                    box[c].checked = true;
                }
            }
            ajax_multi_answer(i,problem_answer[i]);
        }
    }
}