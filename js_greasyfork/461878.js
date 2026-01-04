// ==UserScript==
// @name         问卷调查 by 99
// @namespace    http://tampermonkey.net/
// @version      0.31
// @description  try to take over the world!
// @author       jiujiu
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/jquery@2.2.3/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/461878/%E9%97%AE%E5%8D%B7%E8%B0%83%E6%9F%A5%20by%2099.user.js
// @updateURL https://update.greasyfork.org/scripts/461878/%E9%97%AE%E5%8D%B7%E8%B0%83%E6%9F%A5%20by%2099.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var area = '';                                // 刷哪个城市的问卷，留空则不限制
    var index_url='http://dw.aicvs.cn/';    // 第一次调用时在浏览器中输入此地址
    var match_domain = 'dw.aicvs.cn';
    var wenjuan_url='';
    var match_wenjuan_domain = '47.94.134.229';
    if(window.location.host.indexOf(match_domain)==-1 && window.location.host.indexOf(match_wenjuan_domain)==-1) {
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
        console.log("VERSION:0.31 地区：" + area);
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
        let done_msg = $.trim($("div.el-message__group>p").text());
        if (window.location.href.indexOf("d=or5F3vw&id=")!==-1 && done_msg=='您已经答过该问卷了!') {
            console.log("页面提示已经答过该问卷了，需要重新去获取一个链接");
            setTimeout(finishAnswer, 1000);
        } else {

            let title = $.trim($("div.text-left.fwb.quesTitle>span.ql-editor").text());
            let q_no = $.trim($("div.text-left.fwb.quesTitle>span.txid20").text());
            if (title && title != current_question_title){
                current_question_title = title;
                current_question_no = q_no;
                retry_nums=0;
                answerIt(q_no, title)
            } else {
                retry_nums ++;
                console.log('第' + retry_nums +'次，继续等待');
                if (retry_nums>5) {
                    console.log('等待重试时间过长，重新强制刷新');
                    location.reload(true);
                    return;
                }
                // 判断是否已经答完最后一道题
                if ( $("div.endWords").css("display")!=='none') {
                    if (window.location.href.indexOf("d=or5F3vw&id=")!==-1) {
                        console.log("页面出现“回答完毕”提示，整个问卷回答完毕");
                        setTimeout(finishAnswer, 1000);
                    } else {
                        console.log("虽然页面出现“回答完毕”提示，但不是最后一个链接，继续等待");
                        setTimeout(startAnswer, 500)
                    }
                } else {
                    setTimeout(startAnswer, 2000)
                }
            }
        }
    }

    // 对该题目进行作答
    function answerIt(q_no, questionTitle) {
        debug("作答题目：" + q_no);

        // 第一页会有"开始答题"按钮
        if ($("button.el-button.startBtn.el-button--primary")) {
            $("button.el-button.startBtn.el-button--primary").click();
        }

        let option_type = getQuestionOptionType(questionTitle);
        debug("题目类型：" + option_type);

        // 获取这道题以及应该选择的答案
        let answer_tpl = getAnswerTplFromBank(q_no);
        let answer = [];

        if (answer_tpl==null) {
            answer = getAnswerByRandom(option_type);
            debug("问题：" + questionTitle + "在预设题库中没有找到,随机生成的答案为：");
            debug(answer);
        } else {
            answer = getAnswerByTpl(option_type, answer_tpl);
            debug('根据预设获取到的答案如下：');
            debug(answer);
        }

        answer = array_unique(answer);

        // 在页面上执行选中操作
        switch(option_type) {
            case 'radio':
            case 'checkbox':
                setRadioAndCheckboxClickInPage(answer);
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
        setTimeout(submitAnswer, 3000);
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

    function setRadioAndCheckboxClickInPage(answer) {
        for (let i in answer) {
            $("div.text-left.quessBox.quessBox-bot-line > ul > li.codeCss.xiaoshou input.radioclass").eq(answer[i]).attr('checked', true);
            $("div.text-left.quessBox.quessBox-bot-line > ul > li.codeCss.xiaoshou input.radioclass").eq(answer[i]).click();
        }
    }
    function submitAnswer() {
        $("div.text-left.fwb.quesTitle:first").trigger("click");
        $('button.el-button.nextBtn.el-button--primary.nextBtnPC')[0].click();

        // 点击了提交按钮后，需要等待服务器的返回
        //let dom = document.querySelector("button.el-button.nextBtn.el-button--primary.nextBtnPC");
        //dom.focus();
        //let evt = new Event('click',{
        //    'bubbles':true,
        //    'cancelable':true
        //});
        //dom.dispatchEvent(evt);
        //$("button.el-button.nextBtn.el-button--primary.nextBtnPC").click();

        setTimeout(startAnswer, 500)
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
        let len = $("div.text-left.quessBox.quessBox-bot-line > ul > li.codeCss.xiaoshou input.radioclass").length;
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
            if ( $("div.text-left.quessBox.quessBox-bot-line > ul > li.codeCss.xiaoshou").length > 10) {
                answer = answer.slice(0, 8);
                debug("进行总量控制截取");
            }
        }

        return answer;
    }

    function genRadioAnswerByRandom() {
        let len = $("div.text-left.quessBox.quessBox-bot-line > ul > li.codeCss.xiaoshou input.radioclass").length;
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
        for(let i=0; i<options.length; i++){
            // 选项是否被设置为A:0了，如果被设置了，则A不允许被选到
            if (options[i][1]<1) {
                exclude_list.push(options[i][0]);
                continue;
            }

            if(options[i][0].toUpperCase()!='RAND') {
                sub_option_rate.push(options[i][1]);
            }
        }

        do {
            loops ++;
            for(let i=0; i<sub_option_rate.length; i++) {
                let option_rand = genRandInt(1,100);
                if (option_rand<=sub_option_rate[i]) {
                    answer_title.push(options[i][0]);
                }
            }
        } while(answer_title.length==0 && loops<1);

        // 如果多次重试后按照设定的几率都没有得到符合的答案,则根据页面上的选项来随机生成答案
        if (answer_title.length==0) {
            let page_option = [];
            $("div.text-left.quessBox.quessBox-bot-line > ul > li.codeCss.xiaoshou").each(function(j,n){
                if (exclude_list.includes($.trim($(n).find("label>span.code-name.ql-editor").text())) != true) {
                    page_option.push($.trim($(n).find("label>span.code-name.ql-editor").text()));
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
        let last_option=options.slice(-1);
        // 是否设置了rand限制
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
            $("div.text-left.quessBox.quessBox-bot-line > ul > li.codeCss.xiaoshou").each(function(j,n) {
                if (answer_title[i] == $.trim($(n).find("label>span.code-name.ql-editor").text())) {
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
            if ( $("div.text-left.quessBox.quessBox-bot-line > ul > li.codeCss.xiaoshou").length > 10) {
                answer = answer.slice(0, 8);
                debug("进行总量控制截取");
            }
        }
        return answer;
    }

    function genRadioAnswerByTpl(options) {

        // 数据格式为：[['男','55'],['女',35]]
        // 计算出所有选项比例的总和，然后生成1到总和之间的一个随机数，然后从每个选项从前往后看该随机数落在哪个选项区间，即可认为是答案
        let option_sum = 0;
        let sub_option_rate=[];
        let sub_option=[];
        let exclude_list = []; // 如果设置了A:0， 则A选项不应该被选中;此数组中存储格式为：[A]

        for(let i=0; i<options.length; i++) {
            if (options[i][1]<1) {
                exclude_list.push(options[i][0]);
                continue;
            }
            option_sum += options[i][1];
            sub_option_rate.push(options[i][1]);
            sub_option.push(options[i]);
        }

        let rand = genRandInt(1,option_sum);
        let answer_index = -1;

        // 如果搭配配置中是单选，且只提供一个选项并且格式为：男性，则意味着必须选中男性这个选项
        if (options.length==1 && options[0].length==1) {
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
            debug("需要选择的答案为:" + answer_title);
            $("div.text-left.quessBox.quessBox-bot-line > ul > li.codeCss.xiaoshou").each(function(i,n) {
                if (answer_title == $.trim($(n).text()) || answer_title + '性' == $.trim($(n).text())) {
                    answer.push(i);
                    return false;
                }
            });
        } else {
            sub_option_rate=[];
            // 从选项中选中一个没有被设置为0的选项
            $("div.text-left.quessBox.quessBox-bot-line > ul > li.codeCss.xiaoshou").each(function(i,n) {
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
    function getQuestionOptionType(questionTitle) {
        let dom = $("div.text-left.quessBox.quessBox-bot-line > ul > li.codeCss.xiaoshou").find("input.radioclass");
        if(dom.length < 1) {
            dom = $("div.text-left.quessBox.quessBox-bot-line > ul > li.codeCss.xiaoshou").find("input.el-input__inner").eq(0);
        }
        var option_type = dom.attr('type');
        if(option_type==undefined) {
            if (questionTitle.indexOf("（行单选）") != -1) {
                option_type='row_radio';
            } else if (questionTitle.indexOf("（填空题）") != -1) {
                option_type='text';
            }
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
                document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString();//清除当前域名下的,例如：m.kevis.com
                document.cookie = keys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString();//清除当前域名下的，例如 .m.kevis.com
                document.cookie = keys[i] + '=0;path=/;domain=kevis.com;expires=' + new Date(0).toUTCString();//清除一级域名下的或指定的，例如 .kevis.com
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