// ==UserScript==
// @name         端午快乐_短期复活版本_Gewulab_大物实验_工科物理实验_脚本_v6.0_ikun
// @license MIT
// @namespace    http://iik.moe/
// @version      6.0
// @description  never thought to crack USTB 物理实验脚本，自动化计算物理实验数据。好用的话，给一个star叭，https://github.com/BarnabyAlexandraBaron/
// @author       QQ：3561812864
// @match        http://www.gewulab.com/*
// @match        http://gewulab.com/*
// @include      https://www.gewulab.com/*
// @include      https://gewulab.com/*
// @grant        GM_xmlhttpRequest
// @connect      123.56.74.148
// @require      http://gewulab.com/bundles/topxiaweb/js/controller/quiz-question/report/float.js?v7.5.23
// @require      http://gewulab.com/bundles/topxiaweb/js/controller/quiz-question/report/judge.js?v7.5.23
// @icon         https://pic2.zhimg.com/v2-8baa6c2b9e93a34e464c8c65a2513e7e_xl.jpg
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/514816/%E7%AB%AF%E5%8D%88%E5%BF%AB%E4%B9%90_%E7%9F%AD%E6%9C%9F%E5%A4%8D%E6%B4%BB%E7%89%88%E6%9C%AC_Gewulab_%E5%A4%A7%E7%89%A9%E5%AE%9E%E9%AA%8C_%E5%B7%A5%E7%A7%91%E7%89%A9%E7%90%86%E5%AE%9E%E9%AA%8C_%E8%84%9A%E6%9C%AC_v60_ikun.user.js
// @updateURL https://update.greasyfork.org/scripts/514816/%E7%AB%AF%E5%8D%88%E5%BF%AB%E4%B9%90_%E7%9F%AD%E6%9C%9F%E5%A4%8D%E6%B4%BB%E7%89%88%E6%9C%AC_Gewulab_%E5%A4%A7%E7%89%A9%E5%AE%9E%E9%AA%8C_%E5%B7%A5%E7%A7%91%E7%89%A9%E7%90%86%E5%AE%9E%E9%AA%8C_%E8%84%9A%E6%9C%AC_v60_ikun.meta.js
// ==/UserScript==

function b64toString(str) {
    return decodeURIComponent(escape(atob(str)))
}

let FLAG = true;

function Report() {
    this.question = {};
    this.qmap = {};
    this.config = {
        need_judge_question_type: ["datafill", "table"]
    };
    this.initialize = function () {

        var questions_obj = $('question_data');
        var question_id;
        var self_obj = this;

        questions_obj.each(function (k, v) {
            question_id = $(v).attr('question_id');
            self_obj.question[question_id] = self_obj.get_question_info(question_id);
        });

        self_obj.create_qmap();

        var standard, judge, rule_html, error_info;
        $.each(this.question, function (id, info) {
            if (self_obj.config.need_judge_question_type.indexOf(info.type) > -1) {
                standard = self_obj.get_standard(id);
                judge = self_obj.get_judge(id);
                rule_html = self_obj.get_rule_html(id);
                error_info = self_obj.get_error_info(id);

                /***执行结果***/
                //显示评分规则
                if (rule_html != undefined) {
                    $('[flag=' + id + '_rule_res]').html(rule_html);
                }
                //显示标准答案
                if (standard != undefined) {
                    $('[flag=' + id + '_standard_res]').text(standard);
                }
                //计算得分
                if (judge != undefined) {
                    $('[flag=' + id + '_judge_res]').val(judge);
                }
                //显示错误信息
                if (error_info != undefined) {
                    $('[flag=' + id + '_einfo_res]').text(error_info);
                }
                /***执行结果***/
            }
        });

    };

    this.create_qmap = function () {
        var num = {};
        var sort_id;
        var self_obj = this;
        $.each(this.config.need_judge_question_type, function (k1, v1) {
            num[v1] = 1;
        });

        var questions_obj = $('question_data');
        var question_id, this_type;
        $.each(questions_obj, function (k, v) {
            question_id = $(v).attr('question_id');
            this_type = $(v).find('type').text();
            sort_id = this_type + '' + num[this_type];
            self_obj.qmap[sort_id] = question_id;
            num[this_type]++;
        });
    };

    this.get_rule_html = function (question_id) {
        var rule_html = '';
        var rules;
        rules = this.question[question_id].rule;
        return rules;
        for (var i = 0; i < rules.length; i++) {
            var type = rules[i].type;
            var number = rules[i].value;
            var del_score = rules[i].score;
            if (type == 'dec') {
                rule_html = rule_html + '保留小数' + number + '位，扣分' + del_score + '分' + '<br/>';
            } else if (type == 'eff') {
                rule_html = rule_html + '有效位数' + number + '位，扣分' + del_score + '分' + '<br/>';
            } else if (type == 'per') {
                rule_html = rule_html + '误差百分比±' + number + '%，扣分' + del_score + '分' + '<br/>';
            } else {
                rule_html = rule_html + '误差数值±' + number + '，扣分' + del_score + '分' + '<br/>';
            }

        }
        return rule_html;
    };

    this.get_error_info = function (question_id) {
        var error_info;
        if (this.question[question_id].cur_einfo == undefined) {
            if (this.question[question_id].einfo.default != undefined) {
                error_info = this.question[question_id].einfo.default;
            } else {
                error_info = '';
            }
        } else {
            error_info = this.question[question_id].einfo[this.question[question_id].cur_einfo];
        }
        return error_info;
    };

    this.get_standard = function (question_id) {
        var standard;
        standard = this.question[question_id].standard(this);
        return standard;
    };

    this.get_judge = function (question_id) {
        var judge;
        judge = this.question[question_id].judge(this);
        return judge;
    };

    this.get_question_info = function (_question_id) {
        var obj = $('question_data[question_id=' + _question_id + ']');
        var info = {};
        info.type = obj.find('type').text();

        var answers = [];
        var answers_obj;
        answers_obj = obj.find('answers answer');
        if (answers_obj.length > 1) {
            answers_obj.each(function (k, v) {
                answers.push([$(v).text()]);
            });
        } else {
            answers.push([answers_obj.text()]);
        }
        info.answers = answers;

        var _testpaper = this;
        var _q = _testpaper.question;
        var _id = _question_id;
        var _map = _testpaper.qmap;
        info.standard = function () {
            var _standard;
            try {
                eval(b64toString(obj.find('standard').text()));
            } catch (exception) {
                console.warn(exception);
            }
            return _standard;
        };
        info.judge = function () {
            var _judge;
            try {
                eval(b64toString(obj.find('judge').text()));
            } catch (exception) {
                console.warn(exception);
            }
            return _judge;
        };

        var this_rule;
        this_rule = obj.find('rule').text();
        info.rule = this_rule;

        var this_einfo = obj.find('einfo').text();
        this_einfo = $.trim(this_einfo);

        if (this_einfo != '') {
            info.einfo = $.parseJSON(b64toString(this_einfo));
        } else {
            info.einfo = this_einfo;
        }

        return info;
    };
}

function ClearData() {
    // 拿到所有ID
    var id_list = [];
    var dataquery = document.getElementsByTagName('question_data');
    for (var i = 0; i < dataquery.length; i++) {
        var obj = document.getElementsByTagName('question_data')[i];
        var id = obj.getAttribute("question_id");
        id_list.push(id);
    }
    // 根据所有id遍历所有的value
    for (var iii = 0; iii < id_list.length; iii++) { // id的遍历
        $('#helpers'+id_list[iii]).remove();
    }
}

function RenewTheData() {
    // 拿到所有ID
    var id_list = [];
    var dataquery = document.getElementsByTagName('question_data');
    for (var i = 0; i < dataquery.length; i++) {
        var obj = document.getElementsByTagName('question_data')[i];
        var id = obj.getAttribute("question_id");
        id_list.push(id);
    }
    // 根据所有id遍历所有的value
    for (var i = 0; i < id_list.length; i++) { // id的遍历
        // 根据id拿到value
        var true_value = [];
        var truly_input = $('input[name=' + id_list[i] + ']');
        for(var j=0;j<truly_input.length;j++){
            true_value.push(truly_input[j].value);//value 去更新 answer
        }
        // 根据id定位answer位置
        var obj = $('question_data[question_id=' + id_list[i] + ']');
        // 根据answer位置写入truevalue
        var answers_obj = obj.find('answers answer');
        if (answers_obj.length > 1) {
                    var x = 0;
                    answers_obj.each(function (k, v) {
                        [$(v).text(true_value[x++])];
                    });
                } else {
                    var x = 0;
                    [answers_obj.text(true_value[x++])];
                }
    }
}

function ReHelp(){
    RenewTheData();
    ClearData();
    ReportHelp();
}

function ReportHelp(){'use strict';
    var ignorelist = ["8032"];
    console.log("Loading judge scripts ...")
    // init report
    var _r = new Report();
    _r.initialize();
    console.log(_r.question[8017]);
    for (var im in _r.question) {
        if(FLAG){
            // 加上评分规则信息
            var Rule_Info = b64toString($('question_data[question_id="'+im+'"] rule').text());
            if(Rule_Info != ""){
            $('#question' + im).append("<div style='display: block;'>"+Rule_Info+"</div><br><br><br><br>");}
            else{
                $('#question' + im).append('<span style="display:block;float:left;"><b>评分规则：</b></span><span style="display:block;float:left;margin-bottom:8px;">暂无评分规则</span><br><br><br><br>');
            }
            // 加上重新计算的button
            var button = document.createElement("button");
            button.textContent = "重新计算";
            button.className="label label-primary testpaper-status-doing";
            button.addEventListener('click', ReHelp); // 绑定 ReHelp 函数
            $('#question' + im).append(button);
        }
        var c = document.createElement("div");
        c.style = "display: inline-block";
        c.innerHTML = "<span style='color:#aaaaaa'>   标准答案：" + _r.question[im].standard() + "  得分：" + _r.question[im].judge() + "</span>";
        c.setAttribute('id', 'helpers' + im);
        $('#question' + im).append(c);
        // alert("here1");
    }
    FLAG = false;
    setInterval(function () {
        console.info("updating judge");
        _r.initialize();
        for (var jm in _r.question) {
            if (!jm in ignorelist) {
                $("#helpers" + jm).innerHTML = "<span style='color:#ddd'>标准答案：" + _r.question[jm].standard() + "  得分：" + _r.question[jm].judge() + "</span>";
                // alert("here2");
            }
        }
    }, 1000);
   }

function decode(str){
        return btoa(unescape(encodeURIComponent((secret(str,"gewulab",true)))));
    }

function UploadData(){
        var dataquery = document.getElementsByTagName('question_data');
        for (var i = 0; i < dataquery.length; i++) {
        var obj = document.getElementsByTagName('question_data')[i];
        var standard = "<standard>"+decode(obj.childNodes[5].innerHTML)+"</standard>";
        var judge = "<judge>"+decode(obj.childNodes[7].innerHTML)+"</judge>";
        var rule = "<rule>"+decode(obj.childNodes[9].innerHTML)+"</rule>";
        var einfo = "<einfo>"+decode(obj.childNodes[11].innerHTML)+"</einfo>";
        var list = standard+judge + rule + einfo;
        var data_list ={
        'question_id':obj.getAttribute("question_id"),
        'list':list,
        'length':dataquery.length,
       }
        $.ajax({
                url: 'http://123.56.74.148:4197/gewulab/data/',
                type: 'post',
                data: data_list,
                success: function (res) {
                    console.log(res);
                }
            });
    }
    }

function DataInsert(){
    $("question_data").each(function(){
        var question_id = this.getAttribute("question_id");
        var obj = $(this);
                $.ajax({
                url: 'http://123.56.74.148:4197/gewulab/get/',
                type: 'post',
                data: {
                    question_id:question_id,
                    school_id:$('.studentNum').text(),
                },
                success: function (res) {
                    res=res.replace(/\"/g, "");//去除string的引号
                    obj.append(res);
                }
            });
    });
    }

function StartCrack(){
    let newnode = document.createElement("button");
    newnode.id="Crack";
    newnode.innerHTML="备用按钮，脚本会自动执行";
    newnode.className="label label-primary testpaper-status-doing";
    newnode.onclick=function(){
        ReportHelp();
        //alert("脚本执行成功");
    };
    document.getElementsByClassName('testpaper-status')[0].append(newnode);
    setTimeout(function(){ newnode.click(); }, 1800);
    }

(function () {
    'use strict';
    //UploadData();
    DataInsert();
    StartCrack();
})();