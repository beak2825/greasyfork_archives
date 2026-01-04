// ==UserScript==
// @name         好大学在线 助手 新版
// @namespace    https://github.com/ShenHongFei/cnmooc-assistant
// @homepage     https://github.com/ShenHongFei/cnmooc-assistant
// @author       沈鸿飞 Laurence-042
// @description  根据issue修改过的版本，适用现在的cnmooc版本。
// @version      1.0.2
// @match        https://*.cnmooc.org/study/initplay/*.mooc
// @match        https://*.cnmooc.org/study/unit/*.mooc
// @match        https://*.cnmooc.org/examTest/stuExamList/*.mooc
// @match        https://cnmooc.org/study/initplay/*.mooc
// @match        https://cnmooc.org/study/unit/*.mooc
// @match        https://cnmooc.org/examTest/stuExamList/*.mooc
// @run-at       document-idle
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/403731/%E5%A5%BD%E5%A4%A7%E5%AD%A6%E5%9C%A8%E7%BA%BF%20%E5%8A%A9%E6%89%8B%20%E6%96%B0%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/403731/%E5%A5%BD%E5%A4%A7%E5%AD%A6%E5%9C%A8%E7%BA%BF%20%E5%8A%A9%E6%89%8B%20%E6%96%B0%E7%89%88.meta.js
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
    return updateStudyOver();
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

// async
// get_quiz_answers = async function () {
//     var current_round_option_ids, i, j, l, len, len1, len2, m, n, o, oi, option_id_flags, perfect_answer, qi, question, ref, result, test_result;
//     // 初始化页面问题
//     questions = (function () {
//         var j, len, ref, results;
//         ref = $('#exam_paper').quiz().getPractice();
//         results = [];
//         for (j = 0, len = ref.length; j < len; j++) {
//             question = ref[j];
//             results.push(JSON.parse(question));
//         }
//         return results;
//     })();

//     // 枚举、测试、更新答案
//     options = $('[option_id]').map(function (i, e) {
//         return e.getAttribute('option_id');
//     });
//     answers = {};
//     ref = [1, 2, 4, 8, 3, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15];
//     for (j = 0, len = ref.length; j < len; j++) {
//         oi = ref[j];
//         option_id_flags = [];
//         for (i = l = 0; l <= 3; i = ++l) {
//             option_id_flags.push((oi << i & 0b1000) === 0b1000);
//         }
//         // 检测已有正确答案，对每一题生成答案，设置userAnswer
//         for (qi = m = 0, len1 = questions.length; m < len1; qi = ++m) {
//             question = questions[qi];
//             perfect_answer = answers[question.quizId];
//             if (perfect_answer) {
//                 question.userAnswer = perfect_answer.join(',');
//             } else {
//                 current_round_option_ids = [];
//                 // option_id 并非连续
//                 for (i = n = 0; n <= 3; i = ++n) {
//                     if (option_id_flags[i]) {
//                         current_round_option_ids.push(options[qi * 4 + i]);
//                     }
//                 }
//                 question.userAnswer = current_round_option_ids.join(',');
//             }
//         }
//         console.log(questions);
//         // 枚举的答案准备完成，开始测试
//         test_result = (await test_answer(questions));
//         for (o = 0, len2 = test_result.length; o < len2; o++) {
//             result = test_result[o];
//             result = JSON.parse(result);
//             if (result.markResult) {
//                 // perfect_options=(parseInt option for option in result.userAnswer.split(','))
//                 answers[result.quizId] = result.userAnswer.split(',');
//             }
//         }
//     }
//     console.log(answers);
//     return answers;
// };
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
    '查看习题答案': print_answers
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

//router=
//    10:video_helper_init
//#    20:pdf_helper # pdf页面
//#    50:quiz_helper # 选择题

//router[$('#itemType').val()]()

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFBLFVBQUEsRUFBQSxPQUFBLEVBQUEsYUFBQSxFQUFBLGFBQUEsRUFBQSxTQUFBLEVBQUEsYUFBQSxFQUFBLGFBQUEsRUFBQSxHQUFBLEVBQUEsZ0JBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLE9BQUEsRUFBQSxnQkFBQSxFQUFBLGFBQUEsRUFBQSxTQUFBLEVBQUEsV0FBQSxFQUFBLHNCQUFBO0VBQUE7O0FBZ0JBLElBQUEsR0FBSyxNQUFBLFFBQUEsQ0FBQSxDQUFBO0FBQ0QsTUFBQTtFQUFBLEtBQUEsR0FBTSxRQUFBLENBQUMsRUFBRCxDQUFBO1dBQ0YsSUFBSSxPQUFKLENBQVksUUFBQSxDQUFDLE9BQUQsQ0FBQTthQUFXLFVBQUEsQ0FBVyxPQUFYLEVBQW1CLEVBQW5CO0lBQVgsQ0FBWjtFQURFO0VBR04sQ0FBQSxDQUFFLGtCQUFGLENBQXFCLENBQUMsSUFBdEIsQ0FBMkIsUUFBQSxDQUFDLENBQUQsRUFBRyxDQUFILENBQUE7QUFDdkIsUUFBQTtJQUFBLFNBQUEsR0FBVSxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQVosQ0FBa0IsY0FBbEIsQ0FBa0MsQ0FBQSxDQUFBO1dBQzVDLENBQUMsQ0FBQyxZQUFGLENBQWUsT0FBZixFQUF1QixTQUF2QjtFQUZ1QixDQUEzQjtFQUdBLElBQUcsQ0FBQSxDQUFFLGtCQUFGLENBQXFCLENBQUMsR0FBdEIsQ0FBMEIsU0FBMUIsQ0FBQSxLQUFzQyxNQUF6QztJQUNJLENBQUEsQ0FBRSxrQkFBRixDQUFxQixDQUFDLEtBQXRCLENBQUEsRUFESjtHQUFBLE1BQUE7SUFHSSxDQUFBLENBQUUsc0JBQUYsQ0FBeUIsQ0FBQyxLQUExQixDQUFBLEVBSEo7O0VBSUEsTUFBTSxLQUFBLENBQU0sSUFBTjtFQUNOLENBQUEsQ0FBRSxxQkFB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QUFKLEdBQVksSUFGWjs7SUFJQSxHQUFHLENBQUMsS0FBSixHQUFVO1dBQ1YsYUFBYSxDQUFDLFdBQWQsQ0FBMEIsR0FBMUI7RUFOTztFQVFYLEtBQUEscUJBQUE7O0lBQ0ksVUFBQSxDQUFXLElBQVgsRUFBZ0IsR0FBaEI7RUFESixDQXpCQTs7O0VBNkJBLENBQUEsQ0FBRSxZQUFGLENBQWUsQ0FBQyxFQUFoQixDQUFtQixPQUFuQixFQUEyQixRQUFBLENBQUEsQ0FBQSxFQUFBOztXQUV2QixPQUFPLENBQUMsR0FBUixDQUFZLElBQVo7RUFGdUIsQ0FBM0I7RUFJQSxhQUFBLENBQUE7RUFFQSxZQUFZLENBQUMsU0FBYixHQUF1QixVQXJDM0I7OztBQXhLQSIsInNvdXJjZXNDb250ZW50IjpbIiMgPT1Vc2VyU2NyaXB0PT1cbiMgQG5hbWUgICAgICAgICDlpb3lpKflrablnKjnur8g5Yqp5omLXG4jIEBuYW1lc3BhY2UgICAgaHR0cHM6Ly9naXRodWIuY29tL1NoZW5Ib25nRmVpL2NubW9vYy1hc3Npc3RhbnRcbiMgQGhvbWVwYWdlICAgICBodHRwczovL2dpdGh1Yi5jb20vU2hlbkhvbmdGZWkvY25tb29jLWFzc2lzdGFudFxuIyBAYXV0aG9yICAgICAgIOayiOm4v+mjnlxuIyBAZGVzY3JpcHRpb24gIC5cbiMgQHZlcnNpb24gICAgICAyMDE3LjEyLjA5XG4jIEBtYXRjaCAgICAgICAgaHR0cDovL3d3dy5jbm1vb2Mub3JnL3N0dWR5L2luaXRwbGF5LyoubW9vY1xuIyBAbWF0Y2ggICAgICAgIGh0dHA6Ly93d3cuY25tb29jLm9yZy9zdHVkeS91bml0LyoubW9vY1xuIyBAbWF0Y2ggICAgICAgIGh0dHA6Ly93d3cuY25tb29jLm9yZy9leGFtVGVzdC9zdHVFeGFtTGlzdC8qLm1vb2NcbiMgQHJ1bi1hdCAgICAgICBkb2N1bWVudC1pZGxlXG4jIEBsaWNlbnNlICAgICAgTUlUIExpY2Vuc2VcbiMgPT0vVXNlclNjcmlwdD09XG5cbiMg5ruh5YiG5om56ZiF5b2T5YmNIG1hcmsoKVxuIyDkvb/nlKjmlrnms5XvvJrlnKhjb25zb2xl5Lit6LCD55SoYXNzaXN0YW50Lm1hcmsoKVxubWFyaz0tPlxuICAgIHNsZWVwPShtcyktPlxuICAgICAgICBuZXcgUHJvbWlzZSAocmVzb2x2ZSktPnNldFRpbWVvdXQocmVzb2x2ZSxtcylcbiAgICAgICAgXG4gICAgJCgnaW5wdXRbaWRePXF1aXpfXScpLmVhY2ggKGksZSktPlxuICAgICAgICBtYXhfcG9pbnQ9ZS5jbGFzc05hbWUubWF0Y2goL21heFxcWyhcXGQrKVxcXS8pWzFdXG4gICAgICAgIGUuc2V0QXR0cmlidXRlKCd2YWx1ZScsbWF4X3BvaW50KVxuICAgIGlmICQoJyNyZXZpZXdTdWJtaXREaXYnKS5jc3MoJ2Rpc3BsYXknKSE9J25vbmUnXG4gICAgICAgICQoJyNzdWJtaXRSZXZpZXdCdG4nKS5jbGljaygpXG4gICAgZWxzZVxuICAgICAgICAkKCcjZ290b1Jldmlld1N1Ym1pdEJ0bicpLmNsaWNrKClcbiAgICBhd2FpdCBzbGVlcCgxMDAwKVxuICAgICQoXCJpbnB1dFt2YWx1ZT0n5o+Q5Lqk5LqS6K+EJ11cIikuY2xpY2soKVxuICAgIGF3YWl0IHNsZWVwKDIwMDApXG4gICAgY29uc29sZS5sb2cgJ+WujOaIkOS4gOasoeaJuemYhSdcbiAgICAkKFwiaW5wdXRbdmFsdWU9J+ehruWumiddXCIpLmNsaWNrKClcblxuIyDkv67mlLlkb1N1YkV4YW3pgLvovpHlj6/ku6XlnKjot7PovazmmK/mj5LlhaXoh6rlt7HpgLvovpFcbiAgICBcbiMg5a6M5oiQ6K+l6aG5XG5jb21wbGV0ZV9pdGVtPS0+XG4gICAgdXBkYXRlU3R1ZHlPdmVyKClcblxuIyDop6PplIHop4bpopHov5vluqZcbnVuYmxvY2tfdmlkZW9fcHJvZ3Jlc3M9LT5cbiAgICAkKCcjaXNPdmVyJykudmFsKDIpXG4gICAgZXZhbCgkKFwiLnZpZGVvLXNob3cgc2NyaXB0XCIpLmh0bWwoKSlcblxuIyDmmoLlgZzorqHml7ZcbnBhdXNlX3F1aXpfdGltZXI9LT5cbiAgICBpZiB1bnNhZmVXaW5kb3c/XG4gICAgICAgIHVuc2FmZVdpbmRvdy51c2VUaW1lRmxhZz1mYWxzZVxuICAgIGVsc2UgdXNlVGltZUZsYWc9ZmFsc2VcblxuIyBhbnN3ZXJzPXtxdWVzdGlvbi5xdWl6SWQ6W29wdGlvbnMoc3RyaW5nKV19XG5hbnN3ZXJzPW51bGxcbnF1ZXN0aW9ucz1udWxsXG5vcHRpb25zPW51bGxcblxuIyBhc3luYyDkv67mlLnoh6ogZG9TdWJtaXRFeGFtX2FqYXhcbnRlc3RfYW5zd2VyPShxdWVzdGlvbnMpLT5cbiAgICAj5aSE55CG5q+P6YGT6aKY6K6h5pe2XG4gICAgX3F1aXpVc2VUaW1lUmVjb3JkW19xdWl6SWRSZWNvcmRdPV9xdWl6VXNlVGltZVJlY29yZFtfcXVpeklkUmVjb3JkXSBvciAwXG4gICAgX3F1aXpVc2VUaW1lUmVjb3JkW19xdWl6SWRSZWNvcmRdPXBhcnNlSW50KF9xdWl6VXNlVGltZVJlY29yZFtfcXVpeklkUmVjb3JkXSkrX3F1aXpVc2VUaW1lXG4gICAgdXNlcl9xdWl6cz0oSlNPTi5zdHJpbmdpZnkgcXVlc3Rpb24gZm9yIHF1ZXN0aW9uIGluIHF1ZXN0aW9ucylcbiAgICByZVN1Ym1pdD0kKCcjcmVTdWJtaXQnKS52YWwoKVxuICAgIGdyYWRlSWQ9JCgnI2dyYWRlSWQnKS52YWwoKVxuICAgIHVzZXJRdWl6Mj1bXVxuICAgIHRvdGFsU2NvcmU9MFxuICAgIGFsbFJpZ2h0RmxhZz10cnVlXG4gICAgaT0wXG4gICAgd2hpbGUgaTx1c2VyX3F1aXpzLmxlbmd0aFxuICAgICAgICB1c2VyX1F1aXo9SlNPTi5wYXJzZSh1c2VyX3F1aXpzW2ldKVxuICAgICAgICB1c2VyX1F1aXpbJ3VzZVRpbWUnXT1fcXVpelVzZVRpbWVSZWNvcmRbdXNlcl9RdWl6WydxdWl6SWQnXV1cbiAgICAgICAgX3F1aXpVc2VUaW1lUmVjb3JkW3VzZXJfUXVpelsncXVpeklkJ11dPTBcbiAgICAgICAgXG4gICAgICAgIHVzZXJRdWl6Mi5wdXNoIEpTT04uc3RyaW5naWZ5KHVzZXJfUXVpeilcbiAgICAgICAgc2NvcmU9cGFyc2VJbnQodXNlcl9RdWl6WydtYXJrUXVpelNjb3JlJ10pXG4gICAgICAgIHRvdGFsU2NvcmUrPXNjb3JlXG4gICAgICAgIGlmIHNjb3JlPT0wXG4gICAgICAgICAgICBhbGxSaWdodEZsYWc9ZmFsc2VcbiAgICAgICAgaSsrXG4gICAgaWYgYWxsUmlnaHRGbGFnXG4gICAgICAgIHRvdGFsU2NvcmU9MTAwMDBcbiAgICAgICAgXG4gICAgdXNlcl9xdWl6cz11c2VyUXVpejJcbiAgICBjb25zb2xlLmxvZyh1c2VyX3F1aXpzKVxuICAgIHJldF9kYXRhPWF3YWl0ICQud2hlbiAkLmFqYXhcbiAgICAgICAgdXJsOkNPTlRFWFRQQVRIKycvZXhhbVN1Ym1pdC83NjgxL3NhdmVFeGFtLzEvJytleGFtUGFwZXJJZCsnLycrZXhhbVN1Ym1pdElkKycubW9vYz90ZXN0UGFwZXJJZD0nK2V4YW1UZXN0UGFwZXJJZFxuICAgICAgICB0eXBlOidwb3N0J1xuICAgICAgICBkYXRhOlxuICAgICAgICAgICAgZ3JhZGVJZDpncmFkZUlkXG4gICAgICAgICAgICByZVN1Ym1pdDpyZVN1Ym1pdFxuICAgICAgICAgICAgc3VibWl0cXVpenM6dXNlcl9xdWl6c1xuICAgICAgICAgICAgc3VibWl0RmxhZzowXG4gICAgICAgICAgICB1c2VUaW1lOjFcbiAgICAgICAgICAgIHRvdGFsU2NvcmU6dG90YWxTY29yZVxuICAgICAgICAgICAgdGVzdFBhcGVySWQ6ZXhhbVRlc3RQYXBlcklkXG4gICAgICAgIGRhdGFUeXBlOidqc29uJ1xuICAgICAgICBzdWNjZXNzOihkYXRhKSAtPiBpZiAhZGF0YS5zdWNjZXNzRmxhZyB0aGVuIHRocm93IEVycm9yKGRhdGEuc3VjY2Vzc0ZsYWc9ZmFsc2UpXG4gICAgICAgIGVycm9yOi0+IGNvbnNvbGUubG9nKCd0ZXN0X2Fuc3dlciBlcnJvcicpXG4gICAgSlNPTi5wYXJzZSByZXRfZGF0YS5leGFtU3VibWl0LnN1Ym1pdENvbnRlbnRcblxuIyBhc3luY1xuZ2V0X3F1aXpfYW5zd2Vycz0tPlxuICAgICMg5Yid5aeL5YyW6aG16Z2i6Zeu6aKYXG4gICAgcXVlc3Rpb25zPShKU09OLnBhcnNlIHF1ZXN0aW9uIGZvciBxdWVzdGlvbiBpbiAkKCcjZXhhbV9wYXBlcicpLnF1aXooKS5nZXRQcmFjdGljZSgpKVxuICAgIFxuICAgICMg5p6a5Li+44CB5rWL6K+V44CB5pu05paw562U5qGIXG4gICAgb3B0aW9ucz0kKCdbb3B0aW9uX2lkXScpLm1hcCAoaSxlKS0+IGUuZ2V0QXR0cmlidXRlKCdvcHRpb25faWQnKVxuICAgIGFuc3dlcnM9e31cbiAgICBmb3Igb2kgaW4gWzEsMiw0LDgsMyw1LDYsNyw5LDEwLDExLDEyLDEzLDE0LDE1XVxuICAgICAgICBvcHRpb25faWRfZmxhZ3M9W11cbiAgICAgICAgZm9yIGkgaW4gWzAuLjNdXG4gICAgICAgICAgICBvcHRpb25faWRfZmxhZ3MucHVzaCAob2k8PGkmMGIxMDAwKT09MGIxMDAwXG4gICAgICAgICMg5qOA5rWL5bey5pyJ5q2j56Gu562U5qGI77yM5a+55q+P5LiA6aKY55Sf5oiQ562U5qGI77yM6K6+572udXNlckFuc3dlclxuICAgICAgICBmb3IgcXVlc3Rpb24scWkgaW4gcXVlc3Rpb25zXG4gICAgICAgICAgICBwZXJmZWN0X2Fuc3dlcj1hbnN3ZXJzW3F1ZXN0aW9uLnF1aXpJZF1cbiAgICAgICAgICAgIGlmIHBlcmZlY3RfYW5zd2VyXG4gICAgICAgICAgICAgICAgcXVlc3Rpb24udXNlckFuc3dlcj1wZXJmZWN0X2Fuc3dlci5qb2luKCcsJylcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBjdXJyZW50X3JvdW5kX29wdGlvbl9pZHM9W11cbiAgICAgICAgICAgICAgICAjIG9wdGlvbl9pZCDlubbpnZ7ov57nu61cbiAgICAgICAgICAgICAgICBmb3IgaSBpbiBbMC4uM11cbiAgICAgICAgICAgICAgICAgICAgY3VycmVudF9yb3VuZF9vcHRpb25faWRzLnB1c2ggb3B0aW9uc1txaSo0K2ldIGlmIG9wdGlvbl9pZF9mbGFnc1tpXVxuICAgICAgICAgICAgICAgIHF1ZXN0aW9uLnVzZXJBbnN3ZXI9Y3VycmVudF9yb3VuZF9vcHRpb25faWRzLmpvaW4oJywnKVxuICAgICAgICBjb25zb2xlLmxvZyBxdWVzdGlvbnNcbiAgICAgICAgIyDmnprkuL7nmoTnrZTmoYjlh4blpIflrozmiJDvvIzlvIDlp4vmtYvor5VcbiAgICAgICAgdGVzdF9yZXN1bHQ9YXdhaXQgdGVzdF9hbnN3ZXIocXVlc3Rpb25zKVxuICAgICAgICBmb3IgcmVzdWx0IGluIHRlc3RfcmVzdWx0XG4gICAgICAgICAgICByZXN1bHQ9SlNPTi5wYXJzZShyZXN1bHQpXG4gICAgICAgICAgICBpZiByZXN1bHQubWFya1Jlc3VsdFxuICAgICAgICAgICAgICAgICMgcGVyZmVjdF9vcHRpb25zPShwYXJzZUludCBvcHRpb24gZm9yIG9wdGlvbiBpbiByZXN1bHQudXNlckFuc3dlci5zcGxpdCgnLCcpKVxuICAgICAgICAgICAgICAgIGFuc3dlcnNbcmVzdWx0LnF1aXpJZF09cmVzdWx0LnVzZXJBbnN3ZXIuc3BsaXQoJywnKVxuICAgIGNvbnNvbGUubG9nIGFuc3dlcnNcbiAgICBhbnN3ZXJzXG5cbiMgYXN5bmMg5p+l55yL5Lmg6aKY562U5qGIXG5wcmludF9hbnN3ZXJzPS0+XG4gICAgYXdhaXQgZ2V0X3F1aXpfYW5zd2VycygpIGlmICFhbnN3ZXJzXG4gICAgcHJldHR5X29wdGlvbnM9JydcbiAgICBmb3IgcXVlc3Rpb24scWkgaW4gcXVlc3Rpb25zXG4gICAgICAgIG9wdGlvbl9pZF9mcm9tPW9wdGlvbnNbcWkqNF1cbiAgICAgICAgeD0oU3RyaW5nLmZyb21DaGFyQ29kZSgnQScuY2hhckNvZGVBdCgwKStwYXJzZUludChvcHRpb24pLW9wdGlvbl9pZF9mcm9tKSBmb3Igb3B0aW9uIGluIGFuc3dlcnNbcXVlc3Rpb24ucXVpeklkXSlcbiAgICAgICAgcHJldHR5X29wdGlvbnMrPVwi56ysI3txaSsxfemimO+8miN7eC5qb2luKCcsJyl9XFxuXCJcbiAgICBjb25zb2xlLmxvZyhwcmV0dHlfb3B0aW9ucylcbiAgICBhbGVydChwcmV0dHlfb3B0aW9ucylcbiAgICByZXR1cm5cblxuIyDoh6rliqjlrozmiJDkuaDpophcbmF1dG9fZmlsbD0tPlxuICAgIGF3YWl0IGdldF9xdWl6X2Fuc3dlcnMoKSBpZiAhYW5zd2Vyc1xuICAgIGFuc3dlcl9pZHM9W11cbiAgICBmb3Igayx2IG9mIGFuc3dlcnNcbiAgICAgICAgYW5zd2VyX2lkcz1hbnN3ZXJfaWRzLmNvbmNhdCB2XG4gICAgIyB0b2RvOuWkmumAiemimOWGjeasoeeCueWHu+S8muWPlua2iOmAieaLqVxuICAgICQoXCJbb3B0aW9uX2lkXVwiKS5maWx0ZXIgKGksZSktPmUuZ2V0QXR0cmlidXRlKCdvcHRpb25faWQnKSBpbiBhbnN3ZXJfaWRzXG4gICAgICAgIC5maW5kKCdbY2xhc3N8PVwiaW5wdXRcIl0nKVxuICAgICAgICAuY2xpY2soKVxuICAgIHJldHVyblxuXG5hc3Npc3RhbnRfYXBpPVxuICAgICfop6PplIHop4bpopHov5vluqYnOnVuYmxvY2tfdmlkZW9fcHJvZ3Jlc3NcbiAgICAn5a6M5oiQ6K+l6aG5JyAgICA6Y29tcGxldGVfaXRlbVxuICAgICfmmoLlgZznrZTpopjorqHml7YnOnBhdXNlX3F1aXpfdGltZXJcbiAgICAn6Ieq5Yqo5a6M5oiQ5Lmg6aKYJzphdXRvX2ZpbGxcbiAgICAn5p+l55yL5Lmg6aKY562U5qGIJzpwcmludF9hbnN3ZXJzXG5cbmZvbGRfdW5pdF9uYXY9LT5cbiAgICAkKCcudHItY2hhcHRlcicpLmNsaWNrKClcbiAgICBcbiMgdXNlcnNjcmlwdCDnjq/looNcbmlmIHVuc2FmZVdpbmRvdz9cbiAgICAjIOaatOmcsmFzc2lzdGFudOaOpeWPo1xuICAgIHVuc2FmZVdpbmRvdy5hc3Npc3RhbnQ9e31cbiAgICBmb3IgbmFtZSxmdW4gb2YgYXNzaXN0YW50X2FwaVxuICAgICAgICB1bnNhZmVXaW5kb3cuYXNzaXN0YW50W2Z1bi5uYW1lXT1mdW5cbiAgICB1bnNhZmVXaW5kb3cuYXNzaXN0YW50Lm1hcms9bWFya1xuICAgIFxuICAgICMg6L+U5Zue6K++56iL5Li76aG15pS55Li66L+U5Zue5a+86IiqXG4gICAgJCgnI2JhY2tDb3Vyc2UnKS5jb250ZW50cygpLmxhc3QoKS5yZXBsYWNlV2l0aCgn6L+U5Zue5a+86IiqJylcbiAgICAkKCcjYmFja0NvdXJzZScpLm9mZignY2xpY2snKVxuICAgICQoXCIjYmFja0NvdXJzZVwiKS5vbiAnY2xpY2snLCAtPlxuICAgICAgICBsb2NhdGlvbi5ocmVmID0gQ09OVEVYVFBBVEggKyBcIi9wb3J0YWwvc2Vzc2lvbi91bml0TmF2aWdhdGlvbi9cIiArICQoXCIjY291cnNlT3BlbklkXCIpLnZhbCgpICsgXCIubW9vY1wiXG4gICAgXG4gICAgIyDliqnmiYvnlYzpnaLmmL7npLpcbiAgICBhc3Npc3RhbnRfZGl2PWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgYXNzaXN0YW50X2Rpdi5pZD0nYXNzaXN0YW50J1xuICAgICQoJy5tYWluLXNjcm9sbCcpLnByZXBlbmQoYXNzaXN0YW50X2RpdilcbiAgICBcbiAgICAjIOWKqeaJi+eVjOmdoua3u+WKoOaMiemSrlxuICAgIGFkZF9idXR0b249KHRleHQsZnVuKS0+XG4gICAgICAgIGJ0bj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKVxuICAgICAgICBidG4udGV4dENvbnRlbnQ9dGV4dFxuICAgICAgICBidG4ub25jbGljaz1mdW5cbiAgICAgICAgIyB0b2RvOuS8mOmbheeahOagt+W8j+iuvue9rlxuICAgICAgICBidG4uc3R5bGU9J21hcmdpbjo1cHg7cGFkZGluZzo1cHgnXG4gICAgICAgIGFzc2lzdGFudF9kaXYuYXBwZW5kQ2hpbGQoYnRuKVxuICAgICAgICBcbiAgICBmb3IgbmFtZSxmdW4gb2YgYXNzaXN0YW50X2FwaVxuICAgICAgICBhZGRfYnV0dG9uKG5hbWUsZnVuKVxuICAgICAgICBcbiAgICAjIHRhYuWIh+aNolxuICAgICQoJy50YWItaW5uZXInKS5vbiAnY2xpY2snLC0+XG4gICAgICAgICMgdG9kbzrmmbrog73liKTmlq3lj6/nlKjlip/og71cbiAgICAgICAgY29uc29sZS5sb2cgdGhpc1xuICAgICAgICBcbiAgICBmb2xkX3VuaXRfbmF2KClcbiAgICBcbiAgICB1bnNhZmVXaW5kb3cuZG9TdWJFeGFtPWRvU3ViRXhhbVxuICAgICAgICBcbiNyb3V0ZXI9XG4jICAgIDEwOnZpZGVvX2hlbHBlcl9pbml0XG4jIyAgICAyMDpwZGZfaGVscGVyICMgcGRm6aG16Z2iXG4jIyAgICA1MDpxdWl6X2hlbHBlciAjIOmAieaLqemimFxuIyAgICBcbiNyb3V0ZXJbJCgnI2l0ZW1UeXBlJykudmFsKCldKClcblxuIl19
//# sourceURL=E:\SDK\cnmooc-assistant\index.coffee