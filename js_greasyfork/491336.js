// ==UserScript==
// @name         淦！Albert！ - 作业提交
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  全自动作业提交
// @author       ZG X
// @license      GPL-3.0
// @include      *://*.albert.io/*
// @grant        GM_cookie
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_getResourceText
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @connect      *
// @require      https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.0/papaparse.min.js
// @downloadURL https://update.greasyfork.org/scripts/491336/%E6%B7%A6%EF%BC%81Albert%EF%BC%81%20-%20%E4%BD%9C%E4%B8%9A%E6%8F%90%E4%BA%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/491336/%E6%B7%A6%EF%BC%81Albert%EF%BC%81%20-%20%E4%BD%9C%E4%B8%9A%E6%8F%90%E4%BA%A4.meta.js
// ==/UserScript==


(function () {
    'use strict';

    var csvData = GM_getValue("csvDataStored") || (GM_setValue("csvDataStored", "") && "");
    let userId;


    if (GM_getValue("hasNotified") != true) {
        alert("脚本安装成功，确认后将不再弹出：\n1. 由于浏览器限制，文件上传相关操作建议使用页面右键菜单完成。\n（脚本调用上传借口需要用户激活行为）");
        GM_setValue("hasNotified", true);
    }


    GM_registerMenuCommand("提交全部", () => main());
    GM_registerMenuCommand("上传临时数据", () => uploadData());
    GM_registerMenuCommand("上传数据并保存", () => uploadDataToStorage());
    GM_registerMenuCommand("显示当前数据", () => showCurrentData());
    GM_registerMenuCommand("显示已保存数据", () => showSavedData());
    GM_registerMenuCommand("保存当前数据", () => saveCurrentData());
    GM_registerMenuCommand("清空已保存数据", () => clearData());
    GM_registerMenuCommand("下载已保存数据", () => downloadData());


    function uploadData(storageOption = false) {
        var fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".csv";
        fileInput.addEventListener("change", function (event) {
            var file = event.target.files[0];
            var reader = new FileReader();
            reader.onload = function () {
                parseCSV(reader.result).then(data => {
                    csvData = data;
                    console.log("CSV 文件已上传");
                    console.log(csvData);
                    if (storageOption) {
                        var tempData = GM_getValue("csvDataStored");
                        var result = confirm("确认覆盖已保存数据：\n" + JSON.stringify(tempData));
                        if (!result) return;
                        GM_setValue("csvDataStored", csvData);
                        console.log("数据已保存");
                    }
                });
            };
            reader.readAsText(file);
        });
        fileInput.click();
    }


    function uploadDataToStorage() {
        uploadData(true);
    }


    async function parseCSV(csvText) {
        return new Promise((resolve, reject) => {
            Papa.parse(csvText, {
                header: true,
                dynamicTyping: false,
                complete: function (results) {
                    resolve(results.data);
                },
                error: function (error) {
                    reject(error);
                }
            });
        });
    }


    function showCurrentData() {
        if (csvData.length > 0) {
            alert(JSON.stringify(csvData));
            console.log("当前数据：");
            console.log(csvData);
        } else {
            alert("当前数据为空");
        }
    }


    function showSavedData() {
        var tempData = GM_getValue("csvDataStored");
        if (tempData.length > 0) {
            alert(JSON.stringify(tempData));
            console.log("已保存数据：");
            console.log(csvData);
        } else {
            alert("已保存数据为空");
        }
    }


    function saveCurrentData() {
        var tempData = GM_getValue("csvDataStored");
        var result = confirm("确认覆盖已保存数据：\n" + JSON.stringify(tempData));
        if (!result) return;
        GM_setValue("csvDataStored", "");
        GM_setValue("csvDataStored", csvData);
    }


    function clearData() {
        var tempData = GM_getValue("csvDataStored");
        if (confirm("确认清空已保存数据：\n" + JSON.stringify(tempData))) {
            GM_setValue("csvDataStored", "");
            if (confirm("数据已清空，" + "刷新页面以生效")) {
                window.location.reload();
            }
        }
    }


    function downloadData() {
        var csvData = GM_getValue("csvDataStored");
        if (csvData) {
            var csvContent = Papa.unparse(csvData);
            var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            var link = document.createElement("a");
            if (link.download !== undefined) {
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", "data.csv");
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } else {
            alert("已保存数据为空");
        }
    }


    async function getSessionAuth() {
        let headers = await constructRequestHeaders();
        let url = "https://api.albert.io/auth/session";

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: headers,

                onload: function (response) {
                    try {
                        const jsonResponse = JSON.parse(response.responseText);
                        resolve(jsonResponse);
                    } catch (error) {
                        console.error("解析JSON响应出错：", error);
                        reject(error);
                    }
                },

                onerror: function (error) {
                    console.error("错误:\n", error);
                    reject(error);
                }
            });
        });
    }


    function getAssignmentId() {
        if (window.location.href.startsWith("https://www.albert.io/assignment")) {
            let match = window.location.href.match(/\/assignment\/([a-f0-9-]+)$/i);
            if (match && match[1]) {
                console.log("作业id：\n", match[1]);
                return match[1];
            } else {
                console.log("URL中未找到作业id");
                return;
            }
        } else {
            console.log("作业id获取失败");
            return;
        }
    }


    function constructRequestHeaders() {
        let cookiesString, userAgent, headers;

        return new Promise((resolve, reject) => {
            GM_cookie.list({ url: document.URL, name: null }, function (cookies) {
                cookiesString = cookies.map(cookie => cookie.name + '=' + cookie.value).join('; ');
                userAgent = navigator.userAgent;
                headers = {
                    "Host": "api.albert.io",
                    "Cookie": cookiesString,
                    "Content-Type": "application/vnd.api+json",
                    "Accept": "*/*",
                    "Origin": "https://www.albert.io",
                    "Referer": "https://www.albert.io/",
                    "User-Agent": userAgent,
                };
                resolve(headers);
            });
        });
    }


    function constructQuestionSetRequestUrl() {
        let studentId = userId;
        let assignmentId = getAssignmentId();

        if (!assignmentId) {
            alert("请确保当前页为作业页面");
            return;
        }

        let filters = {
            included_students_id: studentId,
            included_guesses_question_id_null: false,
            included_guesses_student_id: studentId
        };
        let baseURL = 'https://api.albert.io/assignments_v3';
        let includeParams = 'students_v2,teacher_v1,student_classrooms_v1,question_sets_v1,guesses_v1.question_v3';
        let withMeta = 'assignment_v3';
        let context = {
            student_id: studentId,
            user_id: studentId
        };
        let url =
            `${baseURL}/${assignmentId}?filter[included][students_v2][id]=${filters.included_students_id}&` +
            `filter[included][guesses_v1][question_v3][id][null]=${filters.included_guesses_question_id_null}&` +
            `filter[included][guesses_v1][student_v2][id]=${filters.included_guesses_student_id}&` +
            `include=${includeParams}&` +
            `with_meta=${withMeta}&` +
            `meta[context][student][id]=${context.student_id}&` +
            `meta[context][user][id]=${context.user_id}`;

        return url;
    }


    async function getQuestionSet() {
        let headers = await constructRequestHeaders();
        let url = constructQuestionSetRequestUrl();

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: headers,

                onload: function (response) {
                    try {
                        const jsonResponse = JSON.parse(response.responseText);
                        resolve(jsonResponse);
                    } catch (error) {
                        console.error("解析JSON响应出错：", error);
                        reject(error);
                    }
                },

                onerror: function (error) {
                    console.error("错误:\n", error);
                    reject(error);
                }
            });
        });
    }


    async function submitQuestion(timeElapsed, optionId, questionId) {
        let studentId = userId;
        let assignmentId = getAssignmentId();
        let headers = await constructRequestHeaders();
        let url = 'https://api.albert.io' + "/guesses_v1?include=question_v3.question_set_v1.subject_v2,question_v3.standards_v1,question_v3.standards_v1.standard_set_v1,question_v3.question_set_v1.tags_v1&with_meta=question_v3,standard_v1&meta[context][user][id]=" + userId + "&meta[context][user][personalization_settings]=true";
        let uuids = optionId.split(',');
        let content = {};
        uuids.forEach(uuid => {
            content[uuid] = true;
        });

        let payload = {
            "data": {
                "type": "guess_v1",
                "attributes": {
                    "eliminated_options": {},
                    "time_elapsed": timeElapsed,
                    "content": content
                },
                "relationships": {
                    "question_v3": { "data": { "id": questionId, "type": "question_v3" } },
                    "student_v1": { "data": { "id": studentId, "type": "student_v1" } },
                    "assignment_v3": { "data": { "id": assignmentId, "type": "assignment_v3" } }
                }
            }
        };

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: url,
                headers: headers,
                data: JSON.stringify(payload),

                onload: function (response) {
                    try {
                        const jsonResponse = JSON.parse(response.responseText);
                        resolve(jsonResponse);
                    } catch (error) {
                        console.error("解析JSON响应出错：", error);
                        reject(error);
                    }
                },

                onerror: function (error) {
                    console.error("提交出错:\n", error);
                    reject(error);
                }
            });
        });
    }


    async function main() {
        let assignmentName, totalQuestions, submittedQuestions, questionSetV1, questionSetV1Id;
        let submitQuestionPayloadData = [];

        if (!csvData.length > 0) {
            alert("请确保数据已上传后运行")
            return;
        }

        if (GM_getValue("isFirstRun") !== false) {
            const continueExecution = confirm("检测到首次运行，确认后将不再弹出：\n1. 本脚本仅支持油猴测试版\n2. 为避免误操作，仅提供油猴插件弹窗菜单及页面右键菜单的操作方式\n3. 自动提交功能有风险，请知悉");
            if (continueExecution) {
                GM_setValue("isFirstRun", false);
            } else {
                return;
            }
        }

        getSessionAuth()
            .then(jsonResponse => {
                if (jsonResponse && jsonResponse.user && jsonResponse.user.id) {
                    userId = jsonResponse.user.id;
                    console.log("当前用户ID：", userId);
                } else {
                    console.error("未能在JSON响应中找到用户id信息。");
                }
            })
            .catch(error => {
                console.error("用户id获取失败：", error);
            })
            .then(() => {
                getQuestionSet()
                    .then(async res => {

                        assignmentName = res.data.attributes.name;
                        totalQuestions = res.data.meta.count_of_questions;
                        submittedQuestions = res.data.meta.student_count_of_guesses;

                        console.log("当前作业名称:\n", assignmentName);
                        questionSetV1 = res.data.relationships.question_sets_v1.data;
                        questionSetV1.sort((a, b) => {
                            const positionA = a.meta.position;
                            const positionB = b.meta.position;
                            if (positionA < positionB) return -1;
                            if (positionA > positionB) return 1;
                            return 0;
                        });

                        questionSetV1Id = questionSetV1.map(questionSet => questionSet.id);
                        csvData.forEach(item => {
                            const questionSetV1Id = item["question_set_v1-id"];
                            const foundItem = questionSetV1.find(qs => qs.id === questionSetV1Id);
                            if (foundItem) {
                                const temp = { ...item };
                                delete temp["question_set_v1-id"];
                                submitQuestionPayloadData.push(temp);
                            }
                        });

                        if (submitQuestionPayloadData.length !== totalQuestions) {
                            const continueExecution = confirm("错误：\n当前题目" + totalQuestions + "题，共" + submitQuestionPayloadData.length + "题找到匹配。" + "\n继续运行仅提交找到匹配题目，确认以继续。");
                            if (!continueExecution) {
                                console.log("用户终止！");
                                return;
                            }
                        }

                        if (submittedQuestions != 0) {
                            console.log("当前作业总题数:\n", totalQuestions);
                            console.log("当前作业已提交题数:\n", submittedQuestions);
                            const continueExecution = confirm("当前作业「" + assignmentName + "」共" + totalQuestions + "题，" + "已提交" + submittedQuestions + "题。\n继续运行可能会导致部分题目重复提交，确认以继续。");
                            if (!continueExecution) {
                                console.log("用户终止！");
                                return;
                            } else {
                                const continueExecution = confirm("确认提交作业「" + assignmentName + "」找到匹配的" + submitQuestionPayloadData.length + "道题？");
                                if (!continueExecution) {
                                    alert("用户终止！");
                                    return;
                                }
                            }
                        } else {
                            const continueExecution = confirm("确认提交作业「" + assignmentName + "」的" + submitQuestionPayloadData.length + "道题？");
                            if (!continueExecution) {
                                alert("用户终止！");
                                return;
                            }
                        }

                        await Promise.all(submitQuestionPayloadData.map(async item => {
                            const questionId = item["question_v3-id"];
                            const optionId = item["validResponse-id"];
                            try {
                                const response = await submitQuestion(0, optionId, questionId);
                                console.log("题目响应：", questionId, ":", response);
                            } catch (error) {
                                console.error("提交时出现错误：", questionId, ":", error);
                            }
                        }));

                        if (confirm("完成！确认以立即刷新页面")) {
                            window.location.reload();
                        }

                    })

                    .catch(error => {
                        console.error(error);
                    });
            });


    }


})();