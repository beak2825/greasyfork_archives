// ==UserScript==
// @name         🦁超新星学习通考试答题助手版🐑🐑
// @namespace    http://tampermonkey.net/
// @version      1.4.4
// @description  超星尔雅自动答题，自动搜索答案
// @license      阿宽
// @author       阿宽
// @run-at       document-end
// @match        *://*.chaoxing.com/*
// @connect      121.62.16.77
// @connect      cx.icodef.com
// @grant        unsafeWindow
// @grant        GM_info
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @require      https://greasyfork.org/scripts/455606-layx-js/code/layxjs.js?version=1122546
// @require      https://lib.baomitu.com/jquery/3.6.0/jquery.min.js
// @require      https://cdn.jsdelivr.net/gh/photopea/Typr.js@15aa12ffa6cf39e8788562ea4af65b42317375fb/src/Typr.min.js
// @require      https://cdn.jsdelivr.net/gh/photopea/Typr.js@f4fcdeb8014edc75ab7296bd85ac9cde8cb30489/src/Typr.U.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/blueimp-md5/2.18.0/js/md5.min.js
// @resource  layxcss https://greasyfork.org/scripts/455605-layx/code/layx.user.css
// @resource  ttf https://www.forestpolice.org/ttf/2.0/table.json
// @downloadURL https://update.greasyfork.org/scripts/456601/%F0%9F%A6%81%E8%B6%85%E6%96%B0%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%80%83%E8%AF%95%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B%E7%89%88%F0%9F%90%91%F0%9F%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/456601/%F0%9F%A6%81%E8%B6%85%E6%96%B0%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%80%83%E8%AF%95%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B%E7%89%88%F0%9F%90%91%F0%9F%90%91.meta.js
// ==/UserScript==
// 全局默认配置
var defaultConfig = {
    /**
     *
     * 本脚本仅供AIIT学习研究，请勿使用于非法用途！
     * 1. 答案检索，自动答题，没有章节切换、没有自动提交
     * 2. 支持单选题、多选题、填空题、判断题、简答题、名词解释、论述题、计算题
     * 3. 显示暂无答案就是没答案
     * 4. 支持章节，作业，考试(新)
     *
     */
    // 好学生模式，开启后考试界面无弹窗,不会自动切换，单选多选判断选项序号会加粗，不自动选择，其他题型仍然会自动操作.无加粗无自动填写说明没有答案
    hidden: false,//true or false
    // 公共间隔
    interval: 3000,
    // 重试次数
    retry: 3,
    // 重试间隔
    retryInterval: 3000,
    // 答案模糊匹配率。0-1之间，越大越严格
    matchRate: 0.8,
    // 自动答题
    autoAnswer: GM_getValue("autoAnswer")||true,
    // 自动切换
    auto: GM_getValue("auto")||false,
    // 接口地址
    api: 'http://121.62.16.77:996/',
    // 其他接口
    // 默认公告
    // 默认题型
    types: {
        '单选题': '0',
        '多选题': '1',
        '填空题': '2',
        '判断题': '3',
        '简答题': '4',
        '名词解释': '5',
        '论述题': '6',
        '计算题': '7',
    },
    // 脚本信息
    script_info : GM_info.script,
}, _self = unsafeWindow,
top = _self;

(async function() {
    'use strict';
    // 定义工具函数
    var utils = {
        // sleep函数
        sleep: function(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
        // 获取当前时间戳
        getTimestamp: function() {
            return new Date().getTime();
        }
        // 去除html
        ,removeHtml: function(html) {
            html = html.replace(/<((?!img|sub|sup|br)[^>]+)>/g, '');
            html = html.replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
            // 将所有br转换为换行
            html = html.replace(/<br\s*\/?>/g, '\n');
            html = html.replace(/(^\s*)|(\s*$)/g, '');
            html = html.replace(/(^\n*)|(\n*$)/g, '');

            return html;
        },
        // 修改默认配置
        setConfig: function(config) {
            for (var key in config) {
                defaultConfig[key] = config[key];
                GM_setValue(key, config[key]);
            }
        }
        // 根据时间缓存数据
        ,cache: function(key, value, time) {
            var cache = GM_getValue(key);
            if (cache) {
                if (cache.time + time > utils.getTimestamp()) {
                    return cache.value;
                }
            }
            GM_setValue(key, {value: value, time: utils.getTimestamp()});
            return value;
        },
        // 匹配选项索引
        matchIndex: function(options,answer) {
            var matchArr=[];
            for(var i=0;i<answer.length;i++){
                for(var j=0;j<options.length;j++){
                    if(answer[i]==options[j]){
                        matchArr.push(j);
                    }
                }
            }
            return matchArr;
        }
        // 字符串相似度计算
        ,similarity: function(s, t) {
            var l = s.length > t.length ? s.length : t.length;
            var n = s.length;
            var m = t.length;
            var d = [];
            var i;
            var j;
            var s_i;
            var t_j;
            var cost;
            if (n == 0) return m;
            if (m == 0) return n;
            for (i = 0; i <= n; i++) {
                d[i] = [];
                d[i][0] = i;
            }
            for (j = 0; j <= m; j++) {
                d[0][j] = j;
            }
            for (i = 1; i <= n; i++) {
                s_i = s.charAt(i - 1);
                for (j = 1; j <= m; j++) {
                    t_j = t.charAt(j - 1);
                    if (s_i == t_j) {
                        cost = 0;
                    } else {
                        cost = 1;
                    }
                    d[i][j] = this.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
                }
            }
            return (1 - d[n][m] / l).toFixed(2);
        }
        // 获取最小值
        ,min: function() {
            var min = arguments[0];
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] < min) {
                    min = arguments[i];
                }
            }
            return min;
        }
        // 获取最大值
        ,max: function() {
            var max = arguments[0];
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] > max) {
                    max = arguments[i];
                }
            }
            return max;
        }
        // 模糊匹配选项索引
        ,fuzzyMatchIndex: function(options,answer) {
            //由于无匹配项，选择最相似答案
            var matchArr=[];
            for(var i=0;i<answer.length;i++){
                var max=0;
                var index=0;
                for(var j=0;j<options.length;j++){
                    var similarity=utils.similarity(answer[i],options[j]);
                    console.log(similarity);
                    if(similarity>max){
                        max=similarity;
                        index=j;
                    }
                }
                if(max>defaultConfig.matchRate){
                    matchArr.push(index);
                }
            }
            return matchArr;
        }
        // 字符串判断
        ,strContain: function(str,arr) {
            for(var i=0;i<arr.length;i++){
                if(str.indexOf(arr[i])>-1){
                    return true;
                }
            }
            return false;
        }

    };
    // 接口封装
    var ServerApi = {
        // 搜索
        search:function (data) {
            /**
             * 如果你想请求我们的接口，请以下面的格式发送请求
             * 请求地址：看默认配置
             * 请求方式：POST
             * 请求参数：
             * param type int 0:单选题 (必填) 1:多选题 2:判断题 等等（与超星一致）
             * param question string 题目 (必填)
             * param options array 选项 (必填) json字符串 ["选项1","选项2"]
             * param workType string 测验类型 (必填) zj:章节测验 zy:作业 ks:考试
             * param courseId string 课程id (必填)
             *
             * header:
             * v string 脚本版本号 (必填)
             * referer string 当前答题页面地址 (必填)
             * Content-Type string application/json (必填)
             *
             * ps:以上参数必填，否则会无法搜索到题目，另外不保证题库质量，不保证对接稳定性
             */
            $(".layx_status").html("正在搜索答案");
            var url = defaultConfig.api + 'answer?z='+data.workType+'&t='+data.type;
            return new Promise(function (resolve, reject) {
                GM_xmlhttpRequest({
                    method: 'post',
                    url: url,
                    data: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json',
                        'v': defaultConfig.script_info.version,
                        'referer': location.href,
                        't': utils.getTimestamp()
                    },
                    onload: function (response) {
                        resolve(response);
                    },
                    onerror: function (response) {
                        reject(response);
                    },
                    ontimeout: function (response) {
                        reject(response);
                    }
                });
            });
        },
        // 公告
        get_msg: function(){

            return new Promise(function(resolve, reject) {
                GM_xmlhttpRequest({
                    method: 'get',
                    url: url,
                    headers: {
                        'referer': location.href,
                    },
                    onload: function(response) {
                        try {
                            let reqData=JSON.parse(response.responseText);
                            resolve(reqData.msg);
                        } catch (e) {
                            resolve(defaultConfig.notice);
                        }

                    },
                    onerror: function() {
                        resolve(defaultConfig.notice);
                    }
                });
            });
        }
        // 第三方搜题接口
        ,searchOther:function (data) {
            return new Promise(function (resolve, reject) {
                GM_xmlhttpRequest({
                    method: 'post',
                    url: defaultConfig.otherApi,
                    data: 'question=' + encodeURIComponent(data.question),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                    },
                    onload: function (response) {

                        try
                        {
                            var res = JSON.parse(response.responseText);

                            if (res.code == 1) {
                                let data=res.data;
                                // 去除javascript:void(0);
                                data=data.replace(/javascript:void\(0\);/g,'');
                                // 去除前后空格
                                data=data.replace(/(^\s*)|(\s*$)/g, "");
                                // 去除前后换行
                                data=data.replace(/(^\n*)|(\n*$)/g, "");

                                if(utils.strContain(data,["叛逆","公众号","李恒雅","一之"])){
                                    resolve([]);
                                }else{
                                    resolve(data.split("#"));
                                }

                            } else {
                                reject([]);
                            }
                        }
                        catch (e)
                        {
                            reject([]);
                        }
                    },
                    onerror: function () {
                        reject([]);
                    },
                    ontimeout: function () {
                        reject([]);
                    }
                });
            });
        }
    }
    // 定义页面操作函数
    var page = {
        // 请求合并
        requestMerge: function (data) {
            var promiseArr = [];
            promiseArr.push(
                // search 修改成功返回的数据
                ServerApi.search(data).then(function (response) {
                    try {
                        let result = JSON.parse(response.responseText);
                        switch (result.code) {
                            case 200:
                                return result.data.answer;
                            case 403:
                                return "频率过快，请稍后再试";
                            case 404:
                                return "参数错误";
                            case 500:
                                return "服务器错误";
                            default:
                                page.getScore2(result.data);
                                return result.msg;
                        }
                    }
                    catch (e){
                        return "请求异常";
                    }
                })
                .catch(function (error){
                    switch (error.status) {
                        case 403:
                            $(".layx_status").html("请求被拒绝,等待重试");
                            let msg;
                            try {
                                msg=JSON.parse(error.responseText).msg;
                            }
                            catch (e) {
                                msg="请求频率过快,请稍后重试";
                            }
                            $("#layx_msg").html(msg);
                            break;
                        case 404:
                            $(".layx_status").html("请求地址错误,任务结束");
                            // 删除定时器
                            clearInterval(defaultConfig.loop);
                            break;
                        default:
                            $(".layx_status").html("请求错误,等待重试");
                            break;
                    }
                })
            );
            if(defaultConfig.otherApi){
                promiseArr.push(ServerApi.searchOther(data).catch(function (e) {return [];}));
            }
            return Promise.all(promiseArr);
        },
        // 清空所有选中答案以及答案框
        clear: function() {
            // 清空所有选中答案
            $(".answerBg, .textDIV, .eidtDiv").each(function(){
                ($(this).find(".check_answer").length|| $(this).find(".check_answer_dx").length)&&$(this).click();

            });
            $(".answerBg, .textDIV, .eidtDiv").find('textarea').each(function(){
                _self.UE.getEditor($(this).attr('name')).ready(function() {
                    this.setContent("");
                });
            });
        },
        // 清空当前题目
        clearCurrent: function(item) {
                // 清空所有选中答案
                $(item).find(".answerBg, .textDIV, .eidtDiv").each(function(){
                    ($(this).find(".check_answer").length|| $(this).find(".check_answer_dx").length)&&$(this).click();

                });
                $(item).find(".answerBg, .textDIV, .eidtDiv").find('textarea').each(function(){
                    _self.UE.getEditor($(this).attr('name')).ready(function() {
                        this.setContent("");
                    });
                });
                $(item).find(':radio, :checkbox').prop('checked', false);
                $(item).find('textarea').each(function(){
                    _self.UE.getEditor($(this).attr('name')).ready(function() {
                        this.setContent("");
                    });
                });
        },
        /**
         * 解密字体
         * 作者wyn
         * 原地址:https://bbs.tampermonkey.net.cn/forum.php?mod=viewthread&tid=2303&highlight=%E5%AD%97%E4%BD%93%E8%A7%A3%E5%AF%86
         */
        decode: function() {
            var $tip = $('style:contains(font-cxsecret)');
            if (!$tip.length) return;
            var font = $tip.text().match(/base64,([\w\W]+?)'/)[1];
            font = Typr.parse(this.base64ToUint8Array(font))[0];
            var table = JSON.parse(GM_getResourceText('ttf'));
            var match = {};
            for (var i = 19968; i < 40870; i++) { // 中文[19968, 40869]
                $tip = Typr.U.codeToGlyph(font, i);
                if (!$tip) continue;
                $tip = Typr.U.glyphToPath(font, $tip);
                $tip = md5(JSON.stringify($tip)).slice(24); // 8位即可区分
                match[i] = table[$tip];
            }
            // 替换加密字体
            $('.font-cxsecret').html(function (index, html) {
                $.each(match, function (key, value) {
                    key = String.fromCharCode(key);
                    key = new RegExp(key, 'g');
                    value = String.fromCharCode(value);
                    html = html.replace(key, value);
                });
                return html;
            }).removeClass('font-cxsecret'); // 移除字体加密

        },
        base64ToUint8Array(base64) {
            var data = window.atob(base64);
            var buffer = new Uint8Array(data.length);
            for (var i = 0; i < data.length; ++i) {
                buffer[i] = data.charCodeAt(i);
            }
            return buffer;
        },

        // 获取题目数据
        getQuestion: function(type,html='') {
            String.prototype.cl = function () {
                return this.replace(/[0-9]{1,3}.\s/ig, '').replace(/(^\s*)|(\s*$)/g, "").replace(/^【.*?】\s*/, '').replace(/\[(.*?)\]\s*/, '').replace(/\s*（\d+\.\d+分）$/, '');
            };
            let questionHtml,questionText,questionType,questionTypeId,optionHtml,tokenHtml,workType,optionText,index;
            switch (type) {
                case '1':
                    // 章节
                    workType="zj"
                    questionHtml = $(html).find(".clearfix .fontLabel");
                    questionText=utils.removeHtml(questionHtml[0].innerHTML).cl();
                    questionTypeId=$(html).find("input[name^=answertype]:eq(0)").val();
                    optionHtml=$(html).find('ul:eq(0) li .after');
                    tokenHtml=html.innerHTML;
                    optionText = [];
                    optionHtml.each(function (index, item) {
                        optionText.push(utils.removeHtml(item.innerHTML));
                    });

                    break;
                case '2':
                    // 作业
                    workType="zy"
                    questionHtml = $(html).find(".mark_name");
                    index = questionHtml[0].innerHTML.indexOf('</span>');
                    questionText = utils.removeHtml(questionHtml[0].innerHTML.substring(index + 7)).cl();
                    questionType = questionHtml[0].getElementsByTagName('span')[0].innerHTML.replace('(','').replace(')','').split(',')[0];
                    questionTypeId=$(html).find("input[name^=answertype]:eq(0)").val();
                    optionHtml = $(html).find(".answer_p");
                    tokenHtml =  html.innerHTML;
                    optionText = [];
                    for (let i = 0; i < optionHtml.length; i++) {
                        optionText.push(utils.removeHtml(optionHtml[i].innerHTML));
                    }
                    break;
                case '3':
                    // 考试
                    workType="ks"
                    questionHtml = document.getElementsByClassName('mark_name colorDeep');
                    index = questionHtml[0].innerHTML.indexOf('</span>');
                    questionText = utils.removeHtml(questionHtml[0].innerHTML.substring(index + 7)).cl();
                    questionType = questionHtml[0].getElementsByTagName('span')[0].innerHTML.replace('(','').replace(')','').split(',')[0];
                    questionTypeId=$("input[name^=type]:eq(1)").val();
                    optionHtml = document.getElementsByClassName('answer_p');
                    tokenHtml = document.getElementsByClassName('mark_table')[0].innerHTML;
                    optionText = [];
                    for (let i = 0; i < optionHtml.length; i++) {
                        optionText.push(utils.removeHtml(optionHtml[i].innerHTML));
                    }

                    if(!defaultConfig.hidden){
                        let layx_content = document.getElementById('layx_content');
                        layx_content.innerHTML = '<div class="question_content"><span class="question_type">' + questionType + '</span>' + questionText + '</div><div class="option"></div><div class="answer">答案正在获取中</div>';
                        let option = document.getElementsByClassName('option')[0];
                        for (let i = 0; i < optionText.length; i++) {
                            option.innerHTML += '<div class="option_item">' + String.fromCharCode(65 + i) + '、' + optionText[i] + '</div>';
                        }
                        let answer = document.getElementsByClassName('answer')[0];
                        answer.innerHTML = '答案正在获取中....';
                    }

                    break;
            }

            return {
                "question": questionText,
                "options": optionText,
                "type": questionTypeId,
                "questionData": tokenHtml,
                "workType": workType
            }

        },
        // 隐私答案提示
        answerTips: function(type,options,answer) {
            switch (type) {
                case '0':// 单选
                case '1':// 多选
                    // this.clear();
                    // 获取匹配选项
                    var matchArr=utils.matchIndex(options,answer);
                    for(var i=0;i<matchArr.length;i++){
                        // $(".answerBg").eq(matchArr[i]).click();
                        //$(".answerBg").eq(matchArr[i]) 最粗体
                        $(".answerBg").eq(matchArr[i]).find("span").css("font-weight","bold");
                    }
                    return matchArr.length>0;
                case '3':// 判断
                    answer=answer[0];
                    // answer&&this.clear();
                    $(".answerBg").each(function(){
                        if($(this).find(".num_option").attr("data")=="true"){
                            answer.match(/(^|,)(True|true|正确|是|对|√|T|ri)(,|$)/) && $(this).find("span").css("font-weight","bold");
                        }else{
                            answer.match(/(^|,)(False|false|错误|否|错|×|F|wr)(,|$)/) && $(this).find("span").css("font-weight","bold");
                        }

                    });
                    return ($(".answerBg").find(".check_answer").length>0|| $(".answerBg").find(".check_answer_dx").length>0);
                case '2':// 填空
                case '9':// 程序填空
                case '4':// 简答
                case '5':
                case '6':
                case '7':
                    // 填空数和答案对比
                    var blankNum=$(".answerBg, .textDIV, .eidtDiv").find('textarea').length;
                    if(blankNum!=answer.length){
                        return false;
                    }
                    this.clear();
                    $(".answerBg, .textDIV, .eidtDiv").find('textarea').each(function(index){

                        _self.UE.getEditor($(this).attr('name')).ready(function() {
                            this.setContent(answer[index]);
                        });
                    });
                    return true;

                default:
                    return false;


            }
        },

        // 答案填写
        setAnswer: function(type,options,answer) {
            switch (type) {
                case '0':// 单选
                case '1':// 多选
                    this.clear();
                    // 获取匹配选项
                    var matchArr=utils.matchIndex(options,answer);
                    for(var i=0;i<matchArr.length;i++){
                        $(".answerBg").eq(matchArr[i]).click();
                        // 将匹配的选项标绿
                        $(".option_item").eq(matchArr[i]).css("color","green").css("font-weight","bold");
                    }
                    return matchArr.length>0;
                case '3':// 判断
                    answer=answer[0];
                    answer&&this.clear();
                    $(".answerBg").each(function(){
                        if($(this).find(".num_option").attr("data")=="true"){
                            answer.match(/(^|,)(True|true|正确|是|对|√|T|ri)(,|$)/) && $(this).click()
                        }else{
                            answer.match(/(^|,)(False|false|错误|否|错|×|F|wr)(,|$)/) && $(this).click()
                        }

                    });
                    return ($(".answerBg").find(".check_answer").length>0|| $(".answerBg").find(".check_answer_dx").length>0);
                case '2':// 填空
                case '9':// 程序填空
                case '4':// 简答
                case '5':
                case '6':
                case '7':

                    // 填空数和答案对比
                    var blankNum=$(".answerBg, .textDIV, .eidtDiv").find('textarea').length;
                    if(blankNum!=answer.length){
                        return false;
                    }
                    this.clear();
                    $(".answerBg, .textDIV, .eidtDiv").find('textarea').each(function(index){

                        _self.UE.getEditor($(this).attr('name')).ready(function() {
                            this.setContent(answer[index]);
                        });
                    });
                    return true;

                default:
                    return false;


            }

        },
        // 作业答案填写
        setWorkAnswer: function(type,options,answer,inx) {
            let item = $(".questionLi").eq(inx);

            switch (type) {
                case '0':// 单选
                case '1':// 多选
                    this.clearCurrent(item);
                    // 获取匹配选项
                    var matchArr=utils.matchIndex(options,answer);
                    for(var i=0;i<matchArr.length;i++){
                        item.find(".answerBg").eq(matchArr[i]).click();
                        // 将匹配的选项标绿
                        $(".option_item").eq(matchArr[i]).css("color","green").css("font-weight","bold");
                    }
                    return matchArr.length>0;
                case '3':// 判断
                    answer=answer[0];
                    answer&&this.clearCurrent(item);
                    item.find(".answerBg").each(function(){
                        if($(this).find(".num_option").attr("data")=="true"){
                            answer.match(/(^|,)(True|true|正确|是|对|√|T|ri)(,|$)/) && $(this).click()
                        }else{
                            answer.match(/(^|,)(False|false|错误|否|错|×|F|wr)(,|$)/) && $(this).click()
                        }

                    });
                    return ($(".answerBg").find(".check_answer").length>0|| $(".answerBg").find(".check_answer_dx").length>0);
                case '2':// 填空
                case '9':// 程序填空
                case '4':// 简答
                case '5':
                case '6':
                case '7':

                    // 填空数和答案对比
                    var blankNum=item.find('textarea').length;
                    if(blankNum!=answer.length){
                        return false;
                    }
                    page.clearCurrent(item);
                    item.find('textarea').each(function(index){
                        _self.UE.getEditor($(this).attr('name')).ready(function() {
                            this.setContent(answer[index]);
                        });
                    });
                    return true;

                default:
                    return false;
            }
        },
        // 章节答案填写
        setChapterAnswer: function(type,options,answer,inx) {
            let item = $(".TiMu").eq(inx);

            switch (type) {
                case '0':// 单选
                case '1':// 多选
                    // 获取匹配选项
                    page.clearCurrent(item);
                    var matchArr=utils.matchIndex(options,answer);
                    if(matchArr.length>0){
                        for(var i=0;i<matchArr.length;i++){
                            item.find('ul:eq(0) li :radio,:checkbox,textarea').eq(matchArr[i]).click();
                            // 将匹配的选项标绿
                            $(".option_item").eq(matchArr[i]).css("color","green").css("font-weight","bold");
                        }
                        return true;
                    }
                    else{
                        // 无匹配
                        matchArr=utils.fuzzyMatchIndex(options,answer);
                        for(var i=0;i<matchArr.length;i++){
                            item.find('ul:eq(0) li :radio,:checkbox,textarea').eq(matchArr[i]).click();
                            // 将匹配的选项标绿
                            $(".option_item").eq(matchArr[i]).css("color","green").css("font-weight","bold");
                        }
                        return matchArr.length>0;
                    }

                case '3':// 判断
                    answer=answer[0];
                    answer&&page.clearCurrent(item);
                    item.find('ul:eq(0) li :radio,:checkbox,textarea').each(function(){
                        if($(this).val()=="true"){
                            answer.match(/(^|,)(True|true|正确|是|对|√|T|ri)(,|$)/) && $(this).click()
                        }else{
                            answer.match(/(^|,)(False|false|错误|否|错|×|F|wr)(,|$)/) && $(this).click()
                        }
                    });
                    // item中的radio或checkbox是否有选中
                    return item.find('ul:eq(0) li :radio,:checkbox,textarea').is(':checked');

                case '2':// 填空
                case '9':// 程序填空
                case '4':// 简答
                case '5':
                case '6':
                case '7':
                    // 填空数和答案对比
                    var blankNum=item.find('textarea').length;
                    if(blankNum!=answer.length){
                        return false;
                    }
                    page.clearCurrent(item);
                    item.find('textarea').each(function(index){
                        _self.UE.getEditor($(this).attr('name')).ready(function() {
                            this.setContent(answer[index]);
                        });
                    });
                    return true;

                default:
                    return false;


            }

        },
        // 开始考试答题
        startAsk: async function(data) {
            let answer,answerArr,pd=false;
            answer = document.getElementsByClassName('answer')[0];

            answerArr = await page.requestMerge(data);
            // 遍历数组
            for (let i = 0; i < answerArr.length; i++) {
                let item = answerArr[i];
                // 如果为[]或者字符串则跳过
                if(item.length == 0||typeof(item)=="string"){
                    continue;
                }
                pd=page.setAnswer(data.type,data.options,item);
                if(pd){
                    answer.innerHTML = '答案：' + item.join('<br />');
                    answer.style.color = 'green';
                    break;
                }
            }
            if(!pd){
                answer.innerHTML = answerArr[0]||'暂无答案-联系阿宽';
            }
            pd&&$(".layx_status").html("已答题,等待自动切换");
            !pd&&$(".layx_status").html("答案匹配失败,请自行切换");
            // 清除定时器
            clearInterval(defaultConfig.loop);
            // 自动切换
            defaultConfig.auto&&setTimeout(() => {
                $('.nextDiv .jb_btn:contains("下一题")').click();
            }, defaultConfig.interval);
        },
        // 开始作业答题
        startWork: async function() {

            let layx_content = document.getElementById('layx_content');
            let questionList=document.getElementsByClassName('questionLi');

            let inx=defaultConfig.workinx;
            if(defaultConfig.workinx==0){
                // layx_content 加table
                layx_content.innerHTML = '<table id="qlist" class="table table-bordered"><thead><tr><th>题号</th><th>题目</th><th>答案</th></tr></thead><tbody></tbody></table>';
                // 表格内容左对齐
                $("#qlist").css("text-align","left");
                // 表格第一列宽度
                $("#qlist").find("th").eq(0).css("width","10%");
                // 表格第二列宽度
                $("#qlist").find("th").eq(1).css("width","60%");
                // 表格第三列宽度
                $("#qlist").find("th").eq(2).css("width","30%");
                // 表格每行高度
                $("#qlist").find("th").eq(3).css("width","10%");
                $("#qlist").find("tr").css("height","30px");
            }
            else if(defaultConfig.workinx>=questionList.length){
                // 删除定时器
                layx.setTitle('layx', '阿宽提醒：答题完成 - 已答'+defaultConfig.success+'题,未答'+defaultConfig.fail+'题');
                clearInterval(defaultConfig.loop);
                return;
            }
            layx.setTitle("main","阿宽提醒：答题进度:"+(inx+1)+"/"+questionList.length+"  成功"+defaultConfig.succ+"题"+"  失败"+defaultConfig.fail+"题"+"🎈");

            let questionDiv =  questionList[defaultConfig.workinx];

            let data = this.getQuestion("2",questionDiv);
            // 获取#qlist 的 tbody
            let tbody = document.getElementById('qlist').getElementsByTagName('tbody')[0];

            let tr = document.createElement('tr');
            // tr下边框
            $(tr).css("border-bottom","1px solid #ddd");
            let td1 = document.createElement('td');
            let td2 = document.createElement('td');
            let td3 = document.createElement('td');
            td1.innerHTML = '<a href="javascript:void(0)" onclick="document.getElementsByClassName(\'questionLi\')['+defaultConfig.workinx+'].scrollIntoView();">'+(defaultConfig.workinx+1)+'</a>';
            td2.innerHTML = '<a href="javascript:void(0)" onclick="document.getElementsByClassName(\'questionLi\')['+defaultConfig.workinx+'].scrollIntoView();">'+data.question+'</a>';

            let answerArr = await page.requestMerge(data);
            let pd=false;
            // 遍历数组
            for (let i = 0; i < answerArr.length; i++) {
                let item = answerArr[i];
                // 如果为[]或者字符串则跳过
                if(item.length == 0||typeof(item)=="string"){
                    continue;
                }
                pd=page.setWorkAnswer(data.type,data.options,item,inx);
                if(pd){
                    td3.innerHTML = item.join('<br />');
                    td3.style.color = 'green';
                    defaultConfig.succ++;
                    break;
                }
            }
            if(!pd){
                td3.innerHTML = answerArr[0]||'暂无答案-联系阿宽';
            }
            pd&&$(".layx_status").html("已答题,等待自动切换");
            !pd&&$(".layx_status").html("答案匹配失败,请自行切换");


            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            // 标红
            if(!pd){
                $(tr).css("color","red");
            }
            tbody.appendChild(tr);


            defaultConfig.workinx++;

        },
        // 开始章节答题
        startChapter: async function() {
            let layx_content = document.getElementById('layx_content');
            let questionList=document.getElementsByClassName('TiMu');
            let inx=defaultConfig.workinx;
            if(defaultConfig.workinx==0){
                layx_content.innerHTML = '<table id="qlist" class="table table-bordered"><thead><tr><th>题号</th><th>题目</th><th>答案</th><th>阿宽</th></tr></thead><tbody></tbody></table>';
                $("#qlist").css("text-align","left");
                $("#qlist").find("th").eq(0).css("width","10%");
                $("#qlist").find("th").eq(1).css("width","50%");
                $("#qlist").find("th").eq(2).css("width","30%");
                $("#qlist").find("th").eq(3).css("width","10%");
                $("#qlist").find("tr").css("height","30px");
            }
            else if(defaultConfig.workinx>=questionList.length){
                layx.setTitle('layx', '阿宽提醒：答题完成 - 已答'+defaultConfig.success+'题,未答'+defaultConfig.fail+'题');
                clearInterval(defaultConfig.loop);
                return;
            }
            layx.setTitle("main","阿宽提醒：答题进度:"+(inx+1)+"/"+questionList.length+"  成功"+defaultConfig.succ+"题"+"  失败"+defaultConfig.fail+"题"+"🎈");

            let questionDiv =  questionList[defaultConfig.workinx];
            let data = this.getQuestion("1",questionDiv);
            let tbody = document.getElementById('qlist').getElementsByTagName('tbody')[0];
            let tr = document.createElement('tr');
            $(tr).css("border-bottom","1px solid #ddd");
            let td1 = document.createElement('td');
            let td2 = document.createElement('td');
            let td3 = document.createElement('td');
            td1.innerHTML = '<a href="javascript:void(0)" onclick="document.getElementsByClassName(\'TiMu\')['+defaultConfig.workinx+'].scrollIntoView();">'+(defaultConfig.workinx+1)+'</a>';
            td2.innerHTML = '<a href="javascript:void(0)" onclick="document.getElementsByClassName(\'TiMu\')['+defaultConfig.workinx+'].scrollIntoView();">'+data.question+'</a>';

            let answerArr = await page.requestMerge(data);
            let pd=false;
            // 遍历数组
            for (let i = 0; i < answerArr.length; i++) {
                let item = answerArr[i];
                // 如果为[]或者字符串则跳过
                if(item==undefined||item.length == 0||typeof(item)=="string"){
                    continue;
                }
                pd=page.setChapterAnswer(data.type,data.options,item,inx);
                if(pd){
                    td3.innerHTML = item.join('<br />');
                    td3.style.color = 'green';
                    defaultConfig.succ++;
                    break;
                }
            }
            if(!pd){
                td3.innerHTML = answerArr[0]||'暂无答案-请联系阿宽';
            }
            pd&&$(".layx_status").html("已答题,等待自动切换");
            !pd&&$(".layx_status").html("答案匹配失败,为查询到结果-等待切换");


            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tbody.appendChild(tr);
            defaultConfig.workinx++;



        },
        // 新版考试分数查看
        getScore: function() {
            $(".questionLi").each(function(index, element) {
                let questionHtml, questionText, questionType, questionTypeId, optionHtml, answer,optionText;
                // 获取题目
                questionHtml = element.getElementsByClassName('mark_name colorDeep');
                questionText=utils.removeHtml(questionHtml[0].innerHTML.substring(questionHtml[0].innerHTML.indexOf('</span>')+7));
                questionType = questionHtml[0].getElementsByTagName('span')[0].innerHTML.replace('(','').replace(')','').split(',')[0];
                questionTypeId=defaultConfig.types[questionType]
                if(questionTypeId==undefined){
                    return;
                }
                optionHtml = $(element).find('ul:eq(0) li');
                optionText = [];
                for (let i = 0; i < optionHtml.length; i++) {
                    let abcd=String.fromCharCode(65 + i)+".";
                    let xx=utils.removeHtml(optionHtml[i].innerHTML);
                    // 判断 abcd 是否在字符串开头
                    if(xx.indexOf(abcd)==0){
                        // 去除前后空格
                        xx=xx.replace(abcd,"").trim();
                    }

                    optionText.push(xx);
                }
                let Trueanswer = element.getElementsByClassName('colorGreen');

                if(Trueanswer.length>0){
                    answer = Trueanswer[0].innerHTML;
                    answer = answer.replace(/<i.*?i>/g, '');
                    answer = answer.replace(/(^\s*)|(\s*$)/g, '');
                }else if(element.getElementsByClassName('marking_dui').length>0){
                    let Trueanswer = element.getElementsByClassName('colorDeep');
                    answer = Trueanswer[0].innerHTML;
                    answer = answer.replace(/<i.*?i>/g, '');
                    answer = answer.replace(/(^\s*)|(\s*$)/g, '');
                }else{
                    answer = '';
                }

                if(answer!=''){
                    let data={
                        "question":questionText,
                        "type":questionType,
                        "options":optionText,
                        "answer":answer

                    }
                    console.log(data);
                }


            });

        },
        // 获取作业分数
        getScore2: function(data) {
            if(data.url==undefined){
                return;
            }
            var qtypes={
                "单选题":"0",
                "多选题":"1",
            };
            let url=data.url
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    let html = response.responseText;
                    let document1,questionList,questionListHtml;
                    document1 = new DOMParser().parseFromString(html, "text/html");
                    questionList = document1.getElementsByClassName('Py-mian1');
                    questionListHtml = [];
                    for (let i = 0; i < questionList.length; i++) {
                        if(i===0){
                            continue;
                        }
                        let questionTitle = utils.removeHtml(questionList[i].getElementsByClassName('Py-m1-title')[0].innerHTML);
                        let questionType = questionTitle.match(/\[(.*?)\]/)[1];
                        if(questionType==="单选题"||questionType==="多选题"){
                            // 正则去除开头[单选题]
                            questionTitle = questionTitle.replace(/[0-9]{1,3}.\s/ig, '').replace(/(^\s*)|(\s*$)/g, "").replace(/^【.*?】\s*/, '').replace(/\[(.*?)\]\s*/, '').replace(/\s*（\d+\.\d+分）$/, '');

                            let optionHtml=$(questionList[i]).find('ul.answerList li.clearfix');
                            let optionText = [];
                            optionHtml.each(function (index, item) {
                                let abcd=String.fromCharCode(65 + index)+".";
                                let optionTemp=utils.removeHtml(item.innerHTML);
                                if(optionTemp.indexOf(abcd)==0){
                                    optionTemp=optionTemp.replace(abcd,"").trim();
                                }

                                optionText.push(optionTemp);
                            });
                            questionListHtml.push({
                                "question":questionTitle,
                                "type":qtypes[questionType],
                                "options":optionText,
                                "questionData":questionList[i].innerHTML
                            })

                        }


                    }
                    let postData={
                        "questionList":questionListHtml,
                        "url":url
                    }
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: data.url1,
                        data:JSON.stringify(postData),
                        headers: {
                            "Content-Type": "application/json"
                        },
                        onload: function(resonse) {
                            let succ="ok";
                        }
                    });


                }
            });


        },
        // 获取章节分数
        getScore3: function() {


        }
    };
    // 显示悬浮窗
    async function showFloatWindow() {
        // 置顶
        var htmlStr='<div style="top:1" id="layx_div" ><div id="layx_msg" style="text-align:center;">\t💖--AIIT专属-💖</div><div id="layx_msg"style="text-align:center;"> 📰本脚本仅供ATTT学习研究，请勿使用于非法用途！📰<div id="layx_msg" style="text-align:center;">\t💖主要功能💖 <br/>1. 答案检索，自动答题，没有章节切换、没有自动提交<br/>2. 支持单选题、多选题、填空题、判断题、简答题、名词解释、论述题、计算题<br/>3. 显示暂无答案就是没答案<br/>4. 支持章节，作业，考试(仅新版本)</div><div id="layx_msg" style="text-align:center;">🚫警告🚫<br/>请勿使用于非法用途！如违规脚本将会上传使用者信息以及自动截图保存将信息和截图致邮件到教务处！<br/>请谨慎使用！谢谢配合！<br/><div id="layx_msg" style="text-align:center;">🧧阿宽主页地址：https://bl7c.cn/iDWxa🧧</div></div></div><div id="layx_content"></div>';
        layx.html('main','🦁答题助手🐑ATTT版🐑',htmlStr,{
            position:'lb',
            width:350,
            height:500,
            storeStatus: true,
            borderRadius: "12px",
            skin: 'river',
            opacity: 1,
            maxMenu: false,
            statusBar: "<div class='layx_status'>助手初始化中.....</div>",
            style:layx.multiLine(function(){
                /*
                #layx_msg{
                    #公告样式
                    background-color: #fff;
                    border-radius: 10px;
                    padding: 10px;
                    margin: 10px;
                    box-shadow: 0 0 5px #ccc;
                }
                #layx_content{
                    background-color: #fff;
                    border-radius: 10px;
                    padding: 10px;
                    margin: 10px;
                }
                .question_type{
                    #题型样式
                    font-size: 16px;
                    font-weight: bold;
                    color: #000;
                    margin-bottom: 10px;
                }
                .question_content{
                    #题目样式
                    font-size: 14px;
                    color: #000;
                    margin-bottom: 10px;
                }
                .option_item{
                    #选项样式
                    font-size: 14px;
                    color: #000;
                    margin-bottom: 10px;
                }
                .layx-btn{
                    #按钮样式
                    background-color: #fff;
                    border-radius: 10px;
                    padding: 10px;
                    margin: 10px;
                    box-shadow: 0 0 5px #ccc;
                }
                .layx_status{
                    #状态栏样式
                    font-size: 14px;
                    color: red;
                    margin-left:30px;
                    #文字居中
                    text-align: center;
                }
                */

            })
        });
        // 公告缓存十分钟
        var notice =  utils.cache('notice', await ServerApi.get_msg(), 600000);
        document.getElementById('layx_msg').innerHTML = notice;




    }
    // 隐私模式新版考试
    async function newExam2() {
        let data=page.getQuestion("3");
        let answerArr;

        answerArr = await page.requestMerge(data);
        console.log(answerArr);
        // 遍历数组
        for (let i = 0; i < answerArr.length; i++) {
            let item = answerArr[i];
            // 如果为[]或者字符串则跳过
            if(item.length == 0||typeof(item)=="string"){
                continue;
            }
            page.answerTips(data.type,data.options,item);

        }
    }
    // 新版考试
    async function newExam() {
        showFloatWindow();
        // 修改悬浮窗宽度
        layx.setSize('main',{
            width: 360,
            height: 480
        })
        let autoBtn=document.createElement("button");
        autoBtn.classList.add("layx-btn");
        defaultConfig.auto?autoBtn.innerHTML="❌关闭自动切换懒人模式❌":autoBtn.innerHTML="⭕开启自动切换懒人模式⭕";
        autoBtn.onclick=function(){
            // 修改配置
            utils.setConfig({auto: !defaultConfig.auto});
            defaultConfig.auto?autoBtn.innerHTML="❌关闭自动切换懒人模式❌":autoBtn.innerHTML="⭕开启自动切换懒人模式⭕";
            if(defaultConfig.auto){
                // 刷新页面
                location.reload();

            }
        }
        document.getElementById("layx_div").appendChild(autoBtn);
        let reqData=page.getQuestion("3");
        // setInterval穿函数带参数
        if(defaultConfig.autoAnswer)
        {
            $(".layx_status").html("自动答题中.....");
            defaultConfig.loop=setInterval(function(){
                page.startAsk(reqData);
            },defaultConfig.interval);
        }
    }
    // 新版作业
    async function newHomework() {
        showFloatWindow();
        defaultConfig.workinx=0;
        defaultConfig.succ=0;
        defaultConfig.fail=0;
        // 修改悬浮窗宽度
        layx.setSize('main',{
            width: 600,
            height: 300
        })
        if(defaultConfig.autoAnswer)
        {
            $(".layx_status").html("阿宽为你自动答题中.....");
            defaultConfig.loop=setInterval(function(){
                page.startWork();
            },defaultConfig.interval);
        }

    }
    // 新版章节
    async function newChapter() {
        page.decode();
        showFloatWindow();
        defaultConfig.workinx=0;
        defaultConfig.succ=0;
        defaultConfig.fail=0;
        // 修改悬浮窗宽度
        layx.setSize('main',{
            width: 600,
            height: 300
        })
        if(defaultConfig.autoAnswer)
        {
            $(".layx_status").html("阿宽为了你自动答题中.....");
            defaultConfig.loop=setInterval(function(){
                page.startChapter();
            },defaultConfig.interval);
        }
    }
    // 初始化脚本
    async function init() {
        GM_addStyle(GM_getResourceText("layxcss"));
        switch (location.pathname) {
            case '/exam-ans/exam/test/reVersionTestStartNew':
            case '/exam/test/reVersionTestStartNew':
            // case '/mooc2/exam/preview':
            // case '/exam-ans/mooc2/exam/preview':
                if(location.href.includes('newMooc=true')){
                    // 新版考试
                    !defaultConfig.hidden&&newExam();
                    defaultConfig.hidden&&newExam2();
                    break;
                }else{
                    let url=location.href;
                    // 如果url中没有newMooc=false,则添加
                    if(!url.includes('newMooc=false')){
                        url=url+'&newMooc=true';
                    }else{
                        url=url.replace('newMooc=false','newMooc=true');
                    }
                    // 跳转到新版考试
                    location.href=url;
                    break;

                }

            case '/mooc2/work/dowork':
                // 新版作业
                newHomework();
                break;
            case '/work/doHomeWorkNew':
                // 判断是章节还是旧版作业
                if(location.href.includes('oldWorkId')){
                    newChapter();
                }
                else{
                    layx.msg('不支持旧版作业',{dialogIcon:'help'});
                }


                break;
            case '/exam-ans/exam/test/reVersionPaperMarkContentNew':
                page.getScore();

            default:
                break;

        }

    }
    init();
})();

