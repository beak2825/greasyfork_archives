// ==UserScript==
// @name         乐调查 by 99
// @namespace    http://tampermonkey.net/
// @version      0.04
// @description  lediaocha
// @author       jiujiu
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/jquery@2.2.3/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/473169/%E4%B9%90%E8%B0%83%E6%9F%A5%20by%2099.user.js
// @updateURL https://update.greasyfork.org/scripts/473169/%E4%B9%90%E8%B0%83%E6%9F%A5%20by%2099.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var area = '';                                // 刷哪个城市的问卷，留空则不限制
    var index_url='http://dw.aicvs.cn/';    // 第一次调用时在浏览器中输入此地址
    var match_domain = 'dw.aicvs.cn';
    var wenjuan_url='';
    var match_wenjuan_domain = 'www.lediaocha.com';
    if(window.location.host.indexOf(match_domain)==-1 && window.location.host.indexOf(match_wenjuan_domain)==-1) {
        console.log('return');
        return;
    }
    var current_question_title = '';  // 当前题目的标题
    var current_question_no = '';     // 当前题目的题目编号
    var answer_bank=[];
    var be_limit_answer_text = ['最经常', '最满意'];
    var retry_nums = 0;               // 已重试次数

    // 1.先从配置服务器获取一张问卷地址，然后跳转到问卷地址进行作答
    window.onload = setTimeout(getWenjuanUrl,200);
    function getWenjuanUrl() {
        if (window.location.href!=index_url) {
            // 如果输入地址不是获取问卷地址的url，则在问卷url地址处获取问卷配置
            console.log("开始获取问卷配置");
            getWenjuanTpl();
        } else {
            console.log("开始获取问卷url");
            // 获取要答题的url
            GM_xmlhttpRequest({
                url:index_url+"api/wenjuan/getNo/"+area,
                method :"GET",
                headers: {
                    "Content-type": "application/x-www-form-urlencoded"
                },
                onload:function(xhr) {
                    var data = $.parseJSON(xhr.responseText);
                    if (data.code==0) {
                        wenjuan_url = data.url;
                        console.log("获取到问卷url:" + wenjuan_url);
                        window.location.href=wenjuan_url;
                    } else if (data.code==1) {
                        console.log("没有返回任何问卷地址:" + xhr.responseText);
                    } else if (data.code==2) {
                        console.log("当前时间不能答题");
                        setTimeout(getWenjuanUrl,600*1000);
                    }
                }
            });
        }
    }

    // 从服务器获取问卷回答配置
    function getWenjuanTpl() {
        console.log("VERSION:0.04 地区：" + area);
        GM_xmlhttpRequest({
            url:index_url+"api/wenjuan/getTpl",
            method :"POST",
            data: 'url='+encodeURIComponent(window.location.href),
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            timeout:10000,
            ontimeout:function() {
                location.reload(true);
            },
            onload:function(xhr) {
                var data = $.parseJSON(xhr.responseText);
                if (data.answer) {
                    answer_bank = data.answer;
                    console.log("共获取到 " + Object.keys(answer_bank).length + " 条答案配置");
                    setTimeout(startAnswer,200);
                } else {
                    console.log("没有返回任何该问卷的答案配置:" + xhr.responseText);
                }
            }
        });
    }

    // 获取页面上的问题
    function startAnswer() {
        if ($("div.end-wrapper.flex-aic-jcc-column").length>0) {
            console.log("页面提示已经答过该问卷了，需要重新去获取一个链接");
            setTimeout(finishAnswer, 1000);
        } else {
            let title='';
            let q_no = '';
            let whole_title = $("div.title.node_title>div.text>div").html();

            if (whole_title != undefined) {
                let whole_title_arr = whole_title.split('<span style="white-space:pre">	</span>');
                q_no = $.trim(whole_title_arr[0]).toUpperCase();
                title = $.trim(whole_title_arr[1]);
            }

            if (title && title != current_question_title){
                current_question_title = title;
                current_question_no = q_no;
                retry_nums=0;
                answerIt(q_no, title)
            } else {
                retry_nums ++;
                console.log('第 ' + retry_nums +' 次重试解析页面，继续等待');
                if (retry_nums>5) {
                    console.log('等待重试时间过长，重新强制刷新');
                    location.reload(true);
                    return;
                }
                // 判断是否已经答完最后一道题
                if ($("div.end-wrapper.flex-aic-jcc-column").length>0) {
                    debug("页面出现“回答完毕”提示，整个问卷回答完毕");
                    setTimeout(finishAnswer, 1000);
                } else {
                    setTimeout(startAnswer, 1000)
                }
            }
        }
    }

    // 对该题目进行作答
    function answerIt(q_no, questionTitle) {
        debug("作答题目：" + q_no + questionTitle);

        // 第一页会有"开始答题"按钮
        if ($("button.el-button.startBtn.el-button--primary")) {
            $("button.el-button.startBtn.el-button--primary").click();
        }

        let option_type = getQuestionOptionType(questionTitle);

        // 获取这道题以及应该选择的答案
        let answer_tpl = getAnswerTplFromBank(q_no);
        let answer = [];
        if (answer_tpl==null) {
            answer = getAnswerByRandom(option_type);
            debug("问题：" + questionTitle + "在预设题库中没有找到,随机生成的答案为：");
            debug(answer);
        } else {
            let last_option = answer_tpl[1].slice(-1);
            let rand_exists = 0;
            let need_skip = false;
            let used_answer_tpl=[];

            // 如果是 SKIP:60，则按60%的几率跳过，如果设置为 SKIP， 则意味着必须直接跳过
            if (Array.isArray(last_option) && last_option[0][0].toUpperCase()=="SKIP") {
                if (last_option[0][1] == undefined) {
                    debug("强制必须跳过");
                    need_skip = true;
                } else {
                    let rand = genRandInt(1,100);
                    if (rand<=last_option[0][1]) {
                        debug("经计算需要跳过");
                        need_skip = true;
                    }
                }

                if (need_skip!=true) {
                    debug("配置有跳过，但经计算不能跳过");
                }

                used_answer_tpl[0] = answer_tpl[0];
                used_answer_tpl[1] = answer_tpl[1].slice(0, answer_tpl[1].length - 1);
            } else {
                used_answer_tpl = answer_tpl;
            }
            answer_tpl = null;

            // 如果不能跳过，则按原有算法进行计算
            if (need_skip!=true) {
                answer = getAnswerByTpl(option_type, used_answer_tpl);
                debug('根据预设并在页面上存在的答案如下：');
                debug(answer);
            }
        }

        answer = array_unique(answer);

        // 在页面上执行选中操作
        switch(option_type) {
            case 'radio':
                setRadioClickInPage(answer);
            case 'checkbox':
                setCheckboxClickInPage(answer);
                break;
            case 'row_radio': // 行单选
                setRowRadioClickInPage(answer);
                break;
            case 'text': // 填空题
                setInputValueInPage(answer);
                break;
            default:
                debug(option_type + "作答方式还没有实现");
                return;
        }

        debug("将提交答案");
        return;
        setTimeout(submitAnswer, 100);
    }
    function setInputValueInPage(answer) {
        for (let i in answer) {
            // 获取input元素，并模拟键盘输入，因为基于VUE开发，所以需要进行事件模拟
            let num_input = document.getElementsByClassName('el-input__inner')[0]
            num_input.value = answer[i];
            var event = document.createEvent('HTMLEvents');
            event.initEvent("input", true, true);
            event.eventType = 'message';
            num_input.dispatchEvent(event);

            event = document.createEvent('Events');
            event.initEvent("blur", true, true);
            event.eventType = 'message';
            num_input.dispatchEvent(event);
        }
    }
    function setRowRadioClickInPage(answer_list) {
        for (var j=0; j<answer_list.length; j++) {
            var answer = answer_list[j];
            for (var i in answer) {
                $("div.text-left.quessBox.quessBox-bot-line > table > tbody > tr").eq(j+1).find("input.radioclass").eq(answer[i]).attr('checked', true).click();
            }
        }
    }

    function setRadioClickInPage(answer) {
        for (let i in answer) {
            $("div.node>div.answers>div.node-single>div.el-row>div.el-col.el-col-24  input.ui-radio__original").eq(answer[i]).attr('checked', true);
            $("div.node>div.answers>div.node-single>div.el-row>div.el-col.el-col-24  input.ui-radio__original").eq(answer[i]).click();
        }
    }

    function setCheckboxClickInPage(answer) {
        for (let i in answer) {
            $("div.node>div.answers>div.node-multiple>div.el-row>div.el-col.el-col-24  input.ui-checkbox__original").eq(answer[i]).attr('checked', true);
            $("div.node>div.answers>div.node-multiple>div.el-row>div.el-col.el-col-24  input.ui-checkbox__original").eq(answer[i]).click();
        }
    }
    function submitAnswer() {

        $("div.node>div.title.node_title>div.code:first").trigger("click");
        $('div.page_block>button.el-button.el-button--primary')[0].click();
        setTimeout(startAnswer, 200)
    }

    // 通过题目类型来随机生成答案
    function getAnswerByRandom(option_type) {
        if(option_type=='radio') {
            // 单选
            return genRadioAnswerByRandom();
        } else if(option_type=='checkbox') {
            // 多选
            return genCheckBoxAnswerByRandom();
        } else if(option_type=='row_radio') {
            // 行单选
            return genRowRadioAnswerByRandom();
        } else if(option_type==4) {
            // 填空题
            return genInputAnswerByRandom();
        }
        return [];
    }
    function genCheckBoxAnswerByRandom() {
        let len = $("div.node>div.answers>div.node-multiple>div.el-row>div.el-col.el-col-24").length;
        let answer = [];
        let answer_num = genRandInt(1, len); // 随机决定选几次答案
        for(let i=0; i<answer_num; i++) {
            answer.push(genRandInt(0, len-1));
        }

        answer = array_unique(answer);
        let be_limit_answer_text_exists = 0;
        for (let i=0; i<be_limit_answer_text.length; i++) {
            if (current_question_title.indexOf(be_limit_answer_text[i])!==-1) {
                be_limit_answer_text_exists = 1;
                answer = answer.slice(0, 3);
                break;
            }
        }

        if(be_limit_answer_text_exists==0) {
            // 如果没有包含“最”之类的词语，则总共超过10个选项时，要控制最多只返回8个答案
            if ( $("div.node>div.answers>div.node-multiple>div.el-row>div.el-col.el-col-24").length > 10) {
                answer = answer.slice(0, 8);
                debug("进行总量控制截取");
            }
        }

        return answer;
    }

    function genRadioAnswerByRandom() {
        let len = $("div.node>div.answers>div.node-single>div.el-row>div.el-col.el-col-24").length;
        let answer = [];
        answer.push(genRandInt(0, len-1));
        return answer;
    }

    // 获取行单选的答案
    function genRowRadioAnswerByRandom() {
        let answer=[];
        let rows = $("div.text-left.quessBox.quessBox-bot-line > table > tbody > tr").length;
        // 第一行是表头，没有选择项
        for(let i=1; i<rows; i++) {
            let sub_answer = [];
            sub_answer.push(genRandInt(0, $("div.text-left.quessBox.quessBox-bot-line > table > tbody > tr").eq(i+1).find("td").length-2));
            answer.push(sub_answer);
        }
        return answer;
    }

    // 解析某个题库中的题目预设规则，并返回答案
    function getAnswerByTpl(option_type, answer_tpl) {
        let options = answer_tpl[1];
        if(option_type=='radio') {
            // 单选
            return genRadioAnswerByTpl(options);
        } else if(option_type=='checkbox') {
            // 多选
            return genCheckBoxAnswerByTpl(options);
        } else if(option_type=='row_radio') {
            // 行单选
            return genRowRadioAnswerByTpl(options);
        } else if(option_type=='text') {
            // 填空题
            return genInputAnswerByTpl(options);
        }
        return [];
    }
    function genInputAnswerByTpl(options) {
        var answer=[];
        let option_sum = 0;
        let sub_option_rate=[];
        for(let i=0; i<options.length; i++){
            option_sum += options[i][1];
            sub_option_rate.push(options[i][1]);
        }
        let option_rand = genRandInt(1,option_sum);
        let answer_index = 0;

        for(let i=0; i<sub_option_rate.length; i++) {
            let sub_option_sum = array_sum(sub_option_rate.slice(0,i+1));
            if (sub_option_sum >= option_rand) {
                answer_index = i;// 符合预设比例值的答案在数组中的索引值
                break;
            }
        }
        // 所以所需要选中的选项的text为options[answer_index][0]
        answer.push(options[answer_index][0]);
        return answer;
    }

    // 获取行单选的答案
    function genRowRadioAnswerByTpl(options) {
        var answer=[];
        for(var i=0; i<options.length; i++) {
            var sub_options = options[i];
            var option_sum = array_sum(sub_options);
            var option_rand = genRandInt(1,option_sum);
            var sub_answer = [];
            for(var j=0; j<sub_options.length; j++) {
                var sub_sum = array_sum(sub_options.slice(0,j+1));
                if (sub_sum>=option_rand) {
                    sub_answer.push(j);
                    break;
                }
            }
            answer.push(sub_answer);
        }
        return answer;

    }
    function genCheckBoxAnswerByTpl(options) {

        let answer_title = [];
        let answer=[];
        let loops = 0;
        let sub_option_rate=[];
        let exclude_list = [];
        let page_exist_option = [];  // 页面上存在的选项
        let real_used_option = [];  // 真正使用到的选项（即把后台设置的但在页面上不存在的选项去除掉）
        $("div.node-multiple > div.el-row > div.el-col.el-col-24 > div.checkbox-container").each(function(i,n) {
            page_exist_option.push($.trim($(n).find("div.ui-checkbox__label > span.node_option").text()));
        });

        for(let i=0; i<options.length; i++) {
            if(page_exist_option.includes(options[i][0])) {
                real_used_option.push(options[i]);
            }
        }

        for(let i=0; i<real_used_option.length; i++){
            // 选项是否被设置为A:0了，如果被设置了，则A不允许被选到
            if (real_used_option[i][1]<1) {
                exclude_list.push(real_used_option[i][0]);
                continue;
            }

            if(real_used_option[i][0].toUpperCase()!='RAND') {
                sub_option_rate.push(real_used_option[i]);
            }
        }

        do {
            loops ++;
            for(let i=0; i<sub_option_rate.length; i++) {
                let option_rand = genRandInt(1,100);
                if (option_rand<=sub_option_rate[i][1]) {
                    answer_title.push(sub_option_rate[i][0]);
                }
            }
        } while(answer_title.length==0 && loops<1);

        // 如果多次重试后按照设定的几率都没有得到符合的答案,则根据页面上的选项来随机生成答案
        if (answer_title.length==0) {

            let page_option = [];
            $("div.node-multiple > div.el-row > div.el-col.el-col-24 > div.checkbox-container").each(function(j,n){
                if (exclude_list.includes($.trim($(n).find("div.ui-checkbox__label > span.node_option").text())) != true) {
                    page_option.push($.trim($(n).find("div.ui-checkbox__label > span.node_option").text()));
                }
            });
            let total = page_option.length;

            // 决定随机生成几个答案
            let rand=genRandInt(1, page_option.length);
            for(let i=0; i<rand; i++) {
                answer_title.push( page_option[genRandInt(0, total-1)]);
            }
        }
        answer_title = array_unique(answer_title);

        // 如果预设中最后一项配置含有RAND字样，则只保留RAND个答案
        let last_option = options.slice(-1);
        let rand_exists = 0;
        if (Array.isArray(last_option) && last_option[0][0].toUpperCase()=="RAND") {
            rand_exists = 1;
            if (isNaN(last_option[0][1])==false) {
                if(answer_title.length>last_option[0][1]) {
                    answer_title = answer_title.slice(0, last_option[0][1]);
                }
            }
        }

        for (let i=0; i<answer_title.length; i++) {
            $("div.node-multiple > div.el-row > div.el-col.el-col-24 > div.checkbox-container").each(function(j,n) {
                if (answer_title[i] == $.trim($(n).find("div.ui-checkbox__label > span.node_option").text())) {
                    answer.push(j);
                    return false;
                }
            });
        };

        // 如果题目题干中包含“最**”，则最多只保留3个答案
        let be_limit_answer_text_exists = 0;
        for (let i=0; i<be_limit_answer_text.length; i++) {
            if (current_question_title.indexOf(be_limit_answer_text[i])!==-1) {
                be_limit_answer_text_exists = 1;
                answer = answer.slice(0, 3);
                break;
            }
        }

        if(rand_exists==0 && be_limit_answer_text_exists==0) {
            // 如果既没有rand，又没有包含“最”之类的词语，则总共超过10个选项时，要控制最多只返回8个答案
            if ( $("div.node-multiple > div.el-row > div.el-col.el-col-24 > div.checkbox-container").length > 10) {
                answer = answer.slice(0, 8);
                debug("进行总量控制截取");
            }
        }
        return answer;
    }

    function genRadioAnswerByTpl(options) {
        // 计算出所有选项比例的总和，然后生成1到总和之间的一个随机数，然后从每个选项从前往后看该随机数落在哪个选项区间，即可认为是答案
        let option_sum = 0;
        let sub_option_rate=[];
        let sub_option=[];
        let exclude_list = []; // 如果设置了A:0， 则A选项不应该被选中;此数组中存储格式为：[A]

        let page_exist_option = [];  // 页面上存在的选项
        let real_used_option = [];  // 真正使用到的选项（即把后台设置的但在页面上不存在的选项去除掉）
        $("div.node-single > div.el-row > div.el-col.el-col-24 > div.radio-container span.node_option").each(function(i,n) {
            page_exist_option.push($.trim($(n).text()));
        });

        for(let i=0; i<options.length; i++) {
            if(page_exist_option.includes(options[i][0])) {
                real_used_option.push(options[i]);
            }
        }
        for(let i=0; i<real_used_option.length; i++) {
            if (real_used_option[i][1]<1) {
                exclude_list.push(real_used_option[i][0]);
                continue;
            }
            option_sum += real_used_option[i][1];
            sub_option_rate.push(real_used_option[i][1]);
            sub_option.push(real_used_option[i]);
        }

        let rand = genRandInt(1,option_sum);
        let answer_index = -1;


        // 如果搭配配置中是单选，且只提供一个选项并且格式为：男性，则意味着必须选中男性这个选项
        if (real_used_option.length==1 && real_used_option[0].length==1) {
            answer_index=0;
        } else {
            for(let i=0; i<sub_option_rate.length; i++) {
                let sub_option_sum = array_sum(sub_option_rate.slice(0,i+1));
                if (sub_option_sum >= rand) {
                    answer_index = i;// 符合预设比例值的答案在数组中的索引值
                    break;
                }
            }
        }

        let answer = [];
        if (answer_index!=-1 ) {
            // 所以所需要选中的选项的text为sub_option[answer_index][0]
            let answer_title = sub_option[answer_index][0];

            $("div.node-single > div.el-row > div.el-col.el-col-24 > div.radio-container span.node_option").each(function(i,n) {
                if (answer_title == $.trim($(n).text()) || answer_title + '性' == $.trim($(n).text())) {
                    answer.push(i);
                    return false;
                }
            });
        } else {

            sub_option_rate=[];
            // 从选项中选中一个没有被设置为0的选项
            $("div.node-single > div.el-row > div.el-col.el-col-24 > div.radio-container span.node_option").each(function(i,n) {
                if (exclude_list.includes($.trim($(n).text()))!=true) {
                    sub_option_rate.push(i);
                }
            });

            // 有可能一个都需要选
            if (sub_option_rate.length>0) {
                rand = genRandInt(0, sub_option_rate.length-1);
                if(sub_option_rate[rand]) {
                    answer.push(sub_option_rate[rand]);
                }
            }
        }
        return answer;
    }

    // 解析页面html内容获取题目类型
    function getQuestionOptionType() {
        let dom = $("div.node>div.answers").children("div");
        if(dom.length < 1) {
            dom = $("div.text-left.quessBox.quessBox-bot-line > ul > li.codeCss.xiaoshou").find("input.el-input__inner").eq(0);
        }
        var option_type = dom.attr('class');
        if(option_type=='node-multiple') {
            option_type='checkbox';
        } else if(option_type=='node-single') {
            option_type='radio';
        } else if(option_type == undefined) {
            // 未获取到的暂时都按是填空题进行处理
            option_type='text';
        }
        return option_type;
    }

    // 根据问题标题从预设的题库中获取题目答案设定
    function getAnswerTplFromBank(q_no) {
        return answer_bank[q_no];
    }

    function warning(content) {
        alert("出错了:" + content);
    }

    // 整个问卷完成填写
    function finishAnswer() {
        GM_xmlhttpRequest({
            url:index_url+"api/wenjuan/done/"+area,
            method :"POST",
            data:"url="+encodeURIComponent(window.location.href),
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            onload:function(xhr) {
                var data = $.parseJSON(xhr.responseText);
                if (data.success) {
                    debug("问卷填写完毕, 刷新获取新的问卷地址");
                    window.location.href=index_url;
                } else {
                    debug("设置完成调查完毕,没有获取到新的url，返回内容为：" + xhr.responseText);
                    return;
                }
            }
        });
    }
    function genRandInt(min, max) {
        return Math.floor(Math.random() * (max-min+1)) + min;
    }
    function array_unique(arr) {
        return Array.from(new Set(arr));
    }

    function array_sum(arr) {
        var sum = 0;
        for (var i=0; i<arr.length; i++) {
            sum += arr[i];
        }
        return sum;
    }

    //清楚cookie
    function clearCookie() {
        var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
        if (keys) {
            for (var i = keys.length; i--;) {
                document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString();
                document.cookie = keys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString();
                document.cookie = keys[i] + '=0;path=/;domain=lediaocha.com;expires=' + new Date(0).toUTCString();
            }
        }
    }
    function debug(text) {
        //return;
        console.log(text);
    }

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        console.log(ca);
        for(var i=0; i<ca.length; i++)
        {
            var c = ca[i].trim();
            if (c.indexOf(name)==0) return c.substring(name.length,c.length);
        }
        return "";
    }
})();