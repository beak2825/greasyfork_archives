// ==UserScript==
// @name         淦！Albert！
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Albert答题辅助｜答案查找｜答案标记｜完整的快捷键操作
// @author       ZG X
// @icon	 https://www.albert.io/favicon.ico
// @license      GPL-3.0
// @include      *://*.albert.io/*
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
// @downloadURL https://update.greasyfork.org/scripts/489384/%E6%B7%A6%EF%BC%81Albert%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/489384/%E6%B7%A6%EF%BC%81Albert%EF%BC%81.meta.js
// ==/UserScript==


(function () {
    "use strict";


    var csvData = GM_getValue("csvDataStored") || "";


    document.addEventListener("keydown", function (event) {
        if (event.shiftKey) indicateValidResponse();                          // Shift
        if (event.key === "1" && !event.altKey) uploadData();                 // 1 
        if (event.altKey && event.keyCode == 49) uploadDataToStorage();       // Alt + 1
        if (event.key === "2" && !event.altKey) showCurrentData();            // 2
        if (event.altKey && event.keyCode == 50) showSavedData();             // Alt + 2
        if (event.altKey && event.keyCode == 83) saveCurrentData();           // Alt + S
        if (event.altKey && event.keyCode == 88) clearData();                 // Alt + X
        if (event.altKey && event.keyCode == 68) downloadData();              // Alt + D
    });


    GM_registerMenuCommand("查询当前题目（Shift）", () => indicateValidResponse());
    GM_registerMenuCommand("上传临时数据（1）", () => uploadData());
    GM_registerMenuCommand("上传数据并保存（Alt + 1）", () => uploadDataToStorage());
    GM_registerMenuCommand("显示当前数据（2）", () => showCurrentData());
    GM_registerMenuCommand("显示已保存数据（Alt + 2）", () => showSavedData());
    GM_registerMenuCommand("保存当前数据（Alt + S）", () => saveCurrentData());
    GM_registerMenuCommand("清空已保存数据（Alt + X）", () => clearData());
    GM_registerMenuCommand("下载已保存数据（Alt + D）", () => downloadData());


    function indicateValidResponse() {
        const { id, title, prompt, options } = getActiveQuestionProps();
        const validResponseIds = getValidResponseId(id, title, prompt, options).split(',');
        validResponseIds.forEach(addCorrectnessIndicator);
    }


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


    function getActiveQuestionProps() {
        var element = document.querySelector("div.practice-view__main-wrapper.u-display_flex.u-justify-content_center.u-flex-grow_1.u-overflow_hidden.u-bgc_slate-100 > div > div.practice-view__question-area.u-flex-grow_1.u-overflow_auto > div > form");
        var reactEventHandlers = null;
        for (const key of Object.keys(element)) { if (key.startsWith('__reactEventHandlers')) { reactEventHandlers = element[key]; break; } }
        var activeQuestion = reactEventHandlers.children[1].props.children.props.children[1].props.activeQuestion;
        var activeQuestionOptions = activeQuestion.options._tail.array.map(option => ({ id: option.id, value: option.value }));
        console.log("当前题目标题：\n" + activeQuestion.title)
        return {
            id: activeQuestion.id,
            title: activeQuestion.title,
            prompt: activeQuestion.prompt,
            options: activeQuestionOptions
        }
    }


    function getValidResponseId(id, title, prompt, options) {
        const validAnswerData = csvData.find(item => item.id === id && item.title === title && item.prompt === prompt);
        if (!validAnswerData) return console.log("未找到匹配题目"), null;
        if (validAnswerData.validResponseId.includes(',')) {
            var ids = validAnswerData.validResponseId.toString().replace(/,/g, ",\n");
            alert("当前题目或为多选，不会判断选项内容是否匹配");
            console.log("当前题目或为多选，不会进行选项内容判断：\n" + ids);
            return validAnswerData.validResponseId;
        }
        const validOption = options.find(option => option.value === validAnswerData.validResponseValue.trim() && option.id === validAnswerData.validResponseId);
        console.log(validAnswerData);
        if (validOption) {
            console.log("找到正确选项：\n" + validAnswerData.validResponseId + "\n" + validAnswerData.validResponseValue);
            return validAnswerData.validResponseId;
        }
        return (console.log("未找到正确选项"), null);
    }


    function addCorrectnessIndicator(validResponseId) {
        const parentElement = document.querySelector("#app");
        const labels = parentElement.querySelectorAll(`label[for="input-${validResponseId}"]`);
        labels.forEach(label => {
            const indicatorElement = document.createElement("div");
            indicatorElement.className = "correctness-indicator-wrapper__indicator fa fa-check correctness-indicator-wrapper__indicator--correct";
            indicatorElement.style.cssText = "height: 28px; width: 28px; font-size: 16.8px; right: 20px;";
            label.appendChild(indicatorElement);
        });
    }


})();