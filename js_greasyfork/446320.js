// ==UserScript==
// @name        中国石化集团财金业务知识竞赛
// @namespace   Violentmonkey Scripts
// @match       https://sia.sinopec.com/*
// @grant       none
// @version     1.0
// @author      icepie
// @description 2022/6/10 23:10:19
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446320/%E4%B8%AD%E5%9B%BD%E7%9F%B3%E5%8C%96%E9%9B%86%E5%9B%A2%E8%B4%A2%E9%87%91%E4%B8%9A%E5%8A%A1%E7%9F%A5%E8%AF%86%E7%AB%9E%E8%B5%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/446320/%E4%B8%AD%E5%9B%BD%E7%9F%B3%E5%8C%96%E9%9B%86%E5%9B%A2%E8%B4%A2%E9%87%91%E4%B8%9A%E5%8A%A1%E7%9F%A5%E8%AF%86%E7%AB%9E%E8%B5%9B.meta.js
// ==/UserScript==
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant unsafeWindow
// @grant GM_setClipboard
// @grant window.close
// @grant window.focus
// @grant GM_openInTab

// 正确率


const $userParam = 70;

(function () {
    "use strict";

    // 开始考试

    setTimeout(function () {
        startExam();
    }, 3000);

    setTimeout(function () {
        // 分数标题
        var allScoresTip = document.getElementById("allScores");

        // 创建按钮
        var button = document.createElement("button");

        button.id = "mybut001";
        button.textContent = "点我开启魔法!";

        // 放置按钮
        allScoresTip.appendChild(button).addEventListener("click", function () {
            console.log("开启魔法成功!");
            alert("开启魔法成功! 除非重新进入考试, 不然魔法会持续生效!");

            button.textContent = "魔法已开启!";

            $UserExam.examPaper.getUserAnswers = function (
                isSaveAll,
                userAnswersBefore
            ) {
                $.ajax({
                    url: "../../examController/startExam.do",
                    type: "POST",
                    data: {
                        aeurId: $UserExam.baseInfo.aeurId,
                        nounExtendLogo: params["nounExtendLogo"],
                        verificationCode: "",
                    },
                    dataType: "json",
                    success: function (result) {
                        // console.log("用户答题信息")

                        const correctAnswers = JSON.parse(
                            result.responseData.correctAnswers
                        );

                        var ranList = [];

                        const partitionsLength =
                            $UserExam.examPaperInfo.partitions[0].partQuestions.length;

                        // 随机错题
                        for (
                            let i = 0;
                            i <
                            partitionsLength -
                            parseInt((partitionsLength * $userParam) / 100);
                            i++
                        ) {
                            ranList.push(Math.floor(Math.random() * partitionsLength));
                        }

                        for (let partition of $UserExam.examPaperInfo.partitions[0]
                            .partQuestions) {
                            // console.log(correctAnswers[key])
                            // 设置正确答案
                            $UserExam.userAnswerInfo.userAnswers[String(partition.queNum)] = {
                                score: correctAnswers[String(partition.queNum)].score,
                                check: "N",
                                userAnswer:
                                    correctAnswers[String(partition.queNum)].correctAnswer,
                            };
                        }

                        for (let ran of ranList) {
                            if (correctAnswers[String(ran)].baseTypeCode == "JQ") {
                                $UserExam.userAnswerInfo.userAnswers[String(ran)].userAnswer =
                                    new Date().getTime() % 20 == 0
                                        ? $UserExam.userAnswerInfo.userAnswers[String(ran)]
                                            .userAnswer
                                        : "N";
                            }

                            if (correctAnswers[String(ran)].baseTypeCode == "SC") {
                                $UserExam.userAnswerInfo.userAnswers[String(ran)].userAnswer =
                                    new Date().getTime() % 20 == 0
                                        ? $UserExam.userAnswerInfo.userAnswers[String(ran)]
                                            .userAnswer
                                        : "0";
                            }

                            if (correctAnswers[String(ran)].baseTypeCode == "MC") {
                                $UserExam.userAnswerInfo.userAnswers[String(ran)].userAnswer =
                                    new Date().getTime() % 20 == 0
                                        ? $UserExam.userAnswerInfo.userAnswers[String(ran)]
                                            .userAnswer
                                        : "1";
                            }
                        }
                    },
                });

                return $UserExam.userAnswerInfo.userAnswers;
            };
        });
    }, 5000);
})();
