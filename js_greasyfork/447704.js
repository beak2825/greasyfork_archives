// ==UserScript==
// @name         好大学在线 助手 新版（修改版）
// @namespace    https://github.com/1357310795/cnmooc-assistant
// @homepage     https://github.com/1357310795/cnmooc-assistant
// @author       沈鸿飞 Laurence-042 Teruteru
// @description  修复了“好大学在线 助手 新版”的一个BUG，添加下载视频和下载课件
// @version      1.1.1
// @match        https://*.cnmooc.org/study/initplay/*.mooc
// @match        https://*.cnmooc.org/study/unit/*.mooc
// @match        https://*.cnmooc.org/examTest/stuExamList/*.mooc
// @match        https://cnmooc.org/study/initplay/*.mooc
// @match        https://cnmooc.org/study/unit/*.mooc
// @match        https://cnmooc.org/examTest/stuExamList/*.mooc
// @run-at       document-idle
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/447704/%E5%A5%BD%E5%A4%A7%E5%AD%A6%E5%9C%A8%E7%BA%BF%20%E5%8A%A9%E6%89%8B%20%E6%96%B0%E7%89%88%EF%BC%88%E4%BF%AE%E6%94%B9%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/447704/%E5%A5%BD%E5%A4%A7%E5%AD%A6%E5%9C%A8%E7%BA%BF%20%E5%8A%A9%E6%89%8B%20%E6%96%B0%E7%89%88%EF%BC%88%E4%BF%AE%E6%94%B9%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

// 满分批阅当前 mark()
// 使用方法：在console中调用assistant.mark()
var add_button, answers, assistant_api, assistant_div, auto_fill, complete_item, fold_unit_nav, fun, get_quiz_answers, mark, name, options, pause_quiz_timer, print_answers, questions, test_answer, unblock_video_progress,
    indexOf = [].indexOf;

mark = async function () {
    var sleep;
    sleep = function (ms) {
        return new Promise(function (resolve) {
            return setTimeout(resolve, ms);
        });
    };
    $('input[id^=quiz_]').each(function (i, e) {
        var max_point;
        max_point = e.className.match(/max\[(\d+)\]/)[1];
        return e.setAttribute('value', max_point);
    });
    if ($('#reviewSubmitDiv').css('display') !== 'none') {
        $('#submitReviewBtn').click();
    } else {
        $('#gotoReviewSubmitBtn').click();
    }
    await sleep(1000);
    $("input[value='提交互评']").click();
    await sleep(2000);
    console.log('完成一次批阅');
    return $("input[value='确定']").click();
};

// 修改doSubExam逻辑可以在跳转是插入自己逻辑

// 完成该项
complete_item = function () {
    var itemId = $('#itemId').val();
    var res = $.ajax({
	    type : "POST",
	    url : CONTEXTPATH+"/study/updateDurationVideo.mooc",
	    dataType:"json",
	    data : {
	        itemId : itemId,
	        isOver : 1,
	        duration : 99999999999,
	        currentPosition : 99999999999
	    },
	    success : function(response) {
	    },
	    error : function() {

	    }
	});
    return res;
};

// 解锁视频进度
unblock_video_progress = function () {
    $('#isOver').val(2);
    return eval($(".video-show script").html());
};

// 暂停计时
pause_quiz_timer = function () {
    var useTimeFlag;
    if (typeof unsafeWindow !== "undefined" && unsafeWindow !== null) {
        return unsafeWindow.useTimeFlag = false;
    } else {
        return useTimeFlag = false;
    }
};

// answers={question.quizId:[options(string)]}
answers = null;

questions = null;

options = null;

// async 修改自 doSubmitExam_ajax
test_answer = async function (questions) {
    var allRightFlag, gradeId, i, question, reSubmit, ret_data, score, totalScore, userQuiz2, user_Quiz, user_quizs;
    //处理每道题计时
    _quizUseTimeRecord[_quizIdRecord] = _quizUseTimeRecord[_quizIdRecord] || 0;
    _quizUseTimeRecord[_quizIdRecord] = parseInt(_quizUseTimeRecord[_quizIdRecord]) + _quizUseTime;
    user_quizs = (function () {
        var j, len, results;
        results = [];
        for (j = 0, len = questions.length; j < len; j++) {
            question = questions[j];
            results.push(JSON.stringify(question));
        }
        return results;
    })();
    reSubmit = $('#reSubmit').val();
    gradeId = $('#gradeId').val();
    userQuiz2 = [];
    totalScore = 0;
    allRightFlag = true;
    i = 0;
    while (i < user_quizs.length) {
        user_Quiz = JSON.parse(user_quizs[i]);
        user_Quiz['useTime'] = _quizUseTimeRecord[user_Quiz['quizId']];
        _quizUseTimeRecord[user_Quiz['quizId']] = 0;
        userQuiz2.push(JSON.stringify(user_Quiz));
        score = parseInt(user_Quiz['markQuizScore']);
        totalScore += score;
        if (score === 0) {
            allRightFlag = false;
        }
        i++;
    }
    if (allRightFlag) {
        totalScore = 10000;
    }
    user_quizs = userQuiz2;
    console.log(user_quizs);
    ret_data = (await $.when($.ajax({
        url: CONTEXTPATH + '/examSubmit/7681/saveExam/1/' + examPaperId + '/' + examSubmitId + '.mooc?testPaperId=' + examTestPaperId,
        type: 'post',
        data: {
            gradeId: gradeId,
            reSubmit: reSubmit,
            submitquizs: user_quizs,
            submitFlag: 0,
            useTime: 1,
            totalScore: totalScore,
            testPaperId: examTestPaperId
        },
        dataType: 'json',
        success: function (data) {
            if (!data.successFlag) {
                throw Error(data.successFlag = false);
            }
        },
        error: function () {
            return console.log('test_answer error');
        }
    })));
    return JSON.parse(ret_data.examSubmit.submitContent);
};

get_quiz_answers = async function() {
    var current_round_option_ids, i, j, l, len, len1, len2, m, n, o, oi, option_id_flags, perfect_answer, qi, question, ref, result, test_result;

    // 初始化页面问题
    console.log("try to get questions");
    questions = (function() {
        var j, len, ref, results;
        ref = $('#exam_paper').quiz().getPractice();
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
            question = ref[j];
            results.push(JSON.parse(question));
        }
        return results;
    })();
    console.log(questions);

    // 枚举、测试、更新答案
    console.log("try to get options");
    options = $('[option_id]').map(function(i, e) {
        return e.getAttribute('option_id');
    });
    console.log(options);

    // 获取问题分段
    var option_section = [];
    var base = 0;
    var all_test_options = $('.test-options');
    for (i=0;i<all_test_options.length;i++) {
        var count = all_test_options[i].childElementCount;
        option_section.push({count:count,base:base});
        base = base + count;
    }
    console.log(option_section)


    answers = {};
    ref = [1, 2, 4, 8, 3, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15];
    for (j = 0, len = ref.length; j < len; j++) {
        oi = ref[j];
        console.log("oi:"+oi);
        option_id_flags = [];
        for (i = l = 0; l <= 3; i = ++l) {
            option_id_flags.push((oi << i & 0b1000) === 0b1000);
        }
        console.log("option_id_flags:");
        console.log(option_id_flags);
        // 检测已有正确答案，对每一题生成答案，设置userAnswer
        for (qi = m = 0, len1 = questions.length; m < len1; qi = ++m) {
            question = questions[qi];
            perfect_answer = answers[question.quizId];
            if (perfect_answer) {
                question.userAnswer = perfect_answer.join(',');
            } else {
                current_round_option_ids = [];
                // option_id 并非连续
                var section = option_section[qi];
                for (i = n = 0; n <= 3 && n<=section.count; i = ++n) {
                    if (option_id_flags[i]) {
                        current_round_option_ids.push(options[section.base + i]);
                    }
                }
                question.userAnswer = current_round_option_ids.join(',');
            }
        }
        console.log(questions);
        // 枚举的答案准备完成，开始测试
        test_result = (await test_answer(questions));
        for (o = 0, len2 = test_result.length; o < len2; o++) {
            result = test_result[o];
            result = JSON.parse(result);
            console.log(result);
            if (result.markResult) {

                // perfect_options=(parseInt option for option in result.userAnswer.split(','))
                answers[result.quizId] = result.userAnswer.split(',');
            }
        }
    }
    console.log(answers);
    return answers;
};
// async 查看习题答案
print_answers = async function () {
    var j, len, option, option_id_from, pretty_options, qi, question, x;
    if (!answers) {
        await get_quiz_answers();
    }
    pretty_options = '';
    for (qi = j = 0, len = questions.length; j < len; qi = ++j) {
        question = questions[qi];
        option_id_from = options[qi * 4];
        x = (function () {
            var l, len1, ref, results;
            ref = answers[question.quizId];
            results = [];
            for (l = 0, len1 = ref.length; l < len1; l++) {
                option = ref[l];
                results.push(String.fromCharCode('A'.charCodeAt(0) + parseInt(option) - option_id_from));
            }
            return results;
        })();
        pretty_options += `第${qi + 1}题：${x.join(',')}\n`;
    }
    console.log(pretty_options);
    alert(pretty_options);
};

// 自动完成习题
auto_fill = async function () {
    var answer_ids, k, v;
    if (!answers) {
        await get_quiz_answers();
    }
    answer_ids = [];
    for (k in answers) {
        v = answers[k];
        answer_ids = answer_ids.concat(v);
    }
    // todo:多选题再次点击会取消选择
    $("[option_id]").filter(function (i, e) {
        var ref;
        return ref = e.getAttribute('option_id'), indexOf.call(answer_ids, ref) >= 0;
    }).find('[class|="input"]').click();
};

assistant_api = {
    '解锁视频进度': unblock_video_progress,
    '完成该项': complete_item,
    '暂停答题计时': pause_quiz_timer,
    '自动完成习题': auto_fill,
    '查看习题答案': print_answers,
    '下载课件': downloadcourseware,
    '下载视频': downloadvideo
};

fold_unit_nav = function () {
    return $('.tr-chapter').click();
};


// userscript 环境
if (typeof unsafeWindow !== "undefined" && unsafeWindow !== null) {
    // 暴露assistant接口
    unsafeWindow.assistant = {};
    for (name in assistant_api) {
        fun = assistant_api[name];
        unsafeWindow.assistant[fun.name] = fun;
    }
    unsafeWindow.assistant.mark = mark;

    // 返回课程主页改为返回导航
    $('#backCourse').contents().last().replaceWith('返回导航');
    $('#backCourse').off('click');
    $("#backCourse").on('click', function () {
        return location.href = CONTEXTPATH + "/portal/session/unitNavigation/" + $("#courseOpenId").val() + ".mooc";
    });
    //干掉错误显示的
    $('.header-nav nav-center ').hide();


    // 助手界面显示
    assistant_div = document.createElement('div');
    assistant_div.id = 'assistant';
    $('.main-scroll').prepend(assistant_div);

    // 助手界面添加按钮
    add_button = function (text, fun) {
        var btn;
        btn = document.createElement('button');
        btn.textContent = text;
        btn.onclick = fun;
        // todo:优雅的样式设置
        btn.style = 'margin:5px;padding:5px';
        return assistant_div.appendChild(btn);
    };
    for (name in assistant_api) {
        fun = assistant_api[name];
        add_button(name, fun);
    }

    // tab切换
    $('.tab-inner').on('click', function () {
        // todo:智能判断可用功能
        return console.log(this);
    });
    fold_unit_nav();
    unsafeWindow.doSubExam = doSubExam;
}
get_quiz_answers = async function () {
    var current_round_option_ids, i, j, l, len, len1, len2, m, n, o, oi, option_id_flags, perfect_answer, qi, question, ref, result, test_result;

    // 初始化页面问题
    console.log("try to get questions");
    questions = (function () {
        var j, len, ref, results;
        ref = $('#exam_paper').quiz().getPractice();
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
            question = ref[j];
            results.push(JSON.parse(question));
        }
        return results;
    })();
    console.log(questions);

    // 枚举、测试、更新答案
    console.log("try to get options");
    options = $('[option_id]').map(function (i, e) {
        return e.getAttribute('option_id');
    });
    console.log(options);

    // 获取问题分段
    var option_section = [];
    var base = 0;
    var all_test_options = $('.test-options');
    for (i = 0; i < all_test_options.length; i++) {
        var count = all_test_options[i].childElementCount;
        option_section.push({ count: count, base: base });
        base = base + count;
    }
    console.log(option_section)


    answers = {};
    ref = [1, 2, 4, 8, 3, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15];
    for (j = 0, len = ref.length; j < len; j++) {
        oi = ref[j];
        console.log("oi:" + oi);
        option_id_flags = [];
        for (i = l = 0; l <= 3; i = ++l) {
            option_id_flags.push((oi << i & 0b1000) === 0b1000);
        }
        console.log("option_id_flags:");
        console.log(option_id_flags);
        // 检测已有正确答案，对每一题生成答案，设置userAnswer
        for (qi = m = 0, len1 = questions.length; m < len1; qi = ++m) {
            question = questions[qi];
            perfect_answer = answers[question.quizId];
            if (perfect_answer) {
                question.userAnswer = perfect_answer.join(',');
            } else {
                current_round_option_ids = [];
                // option_id 并非连续
                var section = option_section[qi];
                for (i = n = 0; n <= 3 && n <= section.count; i = ++n) {
                    if (option_id_flags[i]) {
                        current_round_option_ids.push(options[section.base + i]);
                    }
                }
                question.userAnswer = current_round_option_ids.join(',');
            }
        }
        console.log(questions);
        // 枚举的答案准备完成，开始测试
        test_result = (await test_answer(questions));
        for (o = 0, len2 = test_result.length; o < len2; o++) {
            result = test_result[o];
            result = JSON.parse(result);
            console.log(result);
            if (result.markResult) {

                // perfect_options=(parseInt option for option in result.userAnswer.split(','))
                answers[result.quizId] = result.userAnswer.split(',');
            }
        }
    }
    console.log(answers);
    return answers;
};

function downloadcourseware()
{
    openNewWindow("/download/nodes/" + $("#courseOpenId").val() + "/"+ $("#nodeId").val() +".mooc");
}
function downloadvideo()
{
    openNewWindow($(".jwvideo")[0].children[0].src);
}

function openNewWindow(url) {
	let a = document.createElement("a");
	document.body.appendChild(a);
	a.style = "display: none";
	a.target = "_blank";
	a.href = url;
	a.click();
	document.body.removeChild(a);
}

//router=
//    10:video_helper_init
//#    20:pdf_helper # pdf页面
//#    50:quiz_helper # 选择题

//router[$('#itemType').val()]()
