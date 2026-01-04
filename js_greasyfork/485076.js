// ==UserScript==
// @name         山东住院医师规范化培训手册填写助手
// @namespace    http://tampermonkey.net/
// @version      2024-07-13
// @description  山东规培（住培）手册填写助手
// @author       青年桥东
// @match        http://124.133.43.209/*
// @icon         http://124.133.43.203:9005/favicon.ico
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.mini.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/Faker/3.1.0/locales/zh_CN/faker.zh_CN.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485076/%E5%B1%B1%E4%B8%9C%E4%BD%8F%E9%99%A2%E5%8C%BB%E5%B8%88%E8%A7%84%E8%8C%83%E5%8C%96%E5%9F%B9%E8%AE%AD%E6%89%8B%E5%86%8C%E5%A1%AB%E5%86%99%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/485076/%E5%B1%B1%E4%B8%9C%E4%BD%8F%E9%99%A2%E5%8C%BB%E5%B8%88%E8%A7%84%E8%8C%83%E5%8C%96%E5%9F%B9%E8%AE%AD%E6%89%8B%E5%86%8C%E5%A1%AB%E5%86%99%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log(readme);
    // ==以下部分请按需修改==
    // 患者病历号（住院号）生成函数（以下示例为YY+MM+4位随机数）
    function generatePatientId() {
        var date = new Date(); // 获取当前时间
        var year = date.getFullYear().toString().substr(2,2); // 获取当前年份的后两位
        var month = date.getMonth() + 1; // 获取当前月份
        month = month < 10 ? "0" + month.toString() : month.toString(); // 月份小于10的前面补0
        var randomNum = Math.floor(Math.random() * 10000); // 生成0到9999之间的随机数
        randomNum = randomNum < 10 ? "000" + randomNum.toString() : (randomNum < 100 ? "00" + randomNum.toString() : (randomNum < 1000 ? "0" + randomNum.toString() : randomNum.toString())); // 随机数小于10的前面补3个0，小于100的前面补2个0，小于1000的前面补1个0
        return year + month + randomNum; // 返回病历号
    }
    // ==以上部分请按需修改==
    var leftButtonCssText = "width: calc(100% - 20px);margin-left: 10px;margin-right: 10px;margin-top: 10px;appearance: none;background-color: #0b714c;border: 1px solid rgba(27, 31, 35, .15);border-radius: 6px;box-shadow: rgba(27, 31, 35, .1) 0 1px 0;box-sizing: border-box;color: #fff;cursor: pointer;display: inline-block;font-family: -apple-system,system-ui,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\";font-size: 14px;font-weight: 600;line-height: 20px;padding: 6px 16px;position: relative;text-align: center;text-decoration: none;user-select: none;-webkit-user-select: none;touch-action: manipulation;vertical-align: middle;white-space: nowrap";
    var buttonCssText = "margin-right: 5px;margin-bottom: 5px;appearance: none;background-color: #0b714c;border: 1px solid rgba(27, 31, 35, .15);border-radius: 6px;box-shadow: rgba(27, 31, 35, .1) 0 1px 0;box-sizing: border-box;color: #fff;cursor: pointer;display: inline-block;font-family: -apple-system,system-ui,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\";font-size: 14px;font-weight: 600;line-height: 20px;padding: 6px 16px;position: relative;text-align: center;text-decoration: none;user-select: none;-webkit-user-select: none;touch-action: manipulation;vertical-align: middle;white-space: nowrap"
    var readmeDivCssText = "width: 100%; padding: 10px; border: 1px solid #0b714c; border-radius: 6px; background-color: #f0f8ff; color: #0b714c; font-size: 14px; line-height: 20px; text-align: left; white-space: pre-wrap;"
    var resultDivCssText = "width: 100%; padding: 10px; border: 1px solid #0b714c; border-radius: 6px; background-color: #f0f8ff; color: black; font-size: 13px; line-height: 20px; text-align: left; white-space: pre-wrap; margin-top: 5px;"
    // 获取当前页面的URL
    var currentUrl = window.location.href;
    // 截取域名及端口号
    var urlRoot = currentUrl.match(/^(https?:\/\/[^\/]+)/i)[1];
    // 在localStorage中创建bingliArray和outlinIdArray空白json文件
    if (!localStorage.getItem("bingliArray")) {
        localStorage.setItem("bingliArray", JSON.stringify([])); // 创建空白json文件：bingliArray
    }
    if (!localStorage.getItem("outlinIdArray")) {
        localStorage.setItem("outlinIdArray", JSON.stringify([])); // 创建空白json文件：outlinIdArray
    }
    // 第一部分 住培数字平台首页：判断当前页面的URL是否包含"/admin/index"或者"/admin/index#"（住培数字平台首页）
    if (currentUrl.includes("/admin/index")) {
        console.log("欢迎使用山东住院医师规范化培训手册填写助手，脚本已加载");
        // 获取元素：左边菜单栏
        var toolBar = document.querySelector('#tree-wrap');
        // 生成按钮：补录历史轮转手册，置于录入当前科室手册下方
        var buttonToHistory = document.createElement("button");
        buttonToHistory.textContent = '补录历史轮转手册';
        buttonToHistory.id = "buttonToHistory";
        toolBar.insertBefore(buttonToHistory, toolBar.firstChild);
        // 生成按钮：录入当前科室手册，置于左边菜单栏最上方
        var buttonToManual = document.createElement("button");
        buttonToManual.textContent = '录入当前科室手册';
        buttonToManual.id = "buttonToManual";
        toolBar.insertBefore(buttonToManual, toolBar.firstChild);
        // 设置按钮样式
        buttonToManual.style.cssText = leftButtonCssText;
        buttonToHistory.style.cssText = leftButtonCssText;
        // 添加按钮点击事件：跳转到手册录入页面
        buttonToManual.addEventListener("click", function() {
            window.location.href = urlRoot + "/ManualOutlineController/viewxy"
        });
        // 添加按钮点击事件：跳转到历史手册页面
        buttonToHistory.addEventListener("click", function() {
            window.location.href = urlRoot + "/ManualOutlineController/viewxylishi"
        });

        // 第二部分 当前/历史手册首页：判断当前页面的URL是否包含"/ManualOutlineController/viewxy"（当前/历史手册首页）
    } else if (currentUrl.includes("/ManualOutlineController/viewxy")) {
        // 定义函数：删除id为alarmDiv、buttonDiv(1)、readmeDiv、resultDiv的div元素，如果没有则忽略
        function removeElements() {
            var elementsToRemove = ["alarmDiv", "buttonDiv", "buttonDiv1", "readmeDiv", "resultDiv"];
            elementsToRemove.forEach(function(id) {
                var element = document.querySelector("#" + id);
                if (element) {
                    element.remove();
                }
            });
        }
        // 获取表格
        var dataTable = document.querySelector("#dataTable");
        // 当表格内容发生变化时，执行回调函数
        var observer = new MutationObserver(function(mutationsList) {
            // 在回调函数中处理表格内容的变化
            for(let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    // 表格内容发生变化
                    // 检测表格是否有第一行的录入按钮
                    var luruButton = document.querySelector("#dataTable > tbody > tr > td:nth-child(7) > a.btn.btn-success.btn-xs");
                    if (luruButton) { // 表格内有录入按钮
                        var onclickValue = luruButton.getAttribute('onclick');
                        // 以-为分隔符，将录入按钮的onclick属性值分割成数组
                        var onclickValueArray = onclickValue.split("-");
                        // 获取onclick属性值的第二个元素，例如luru('2211-2-1')，则获取到的是2（代表“病种”）
                        var luruAttribute = onclickValueArray[1];
                        // 如果luruAttribute为2，则代表当前表格为病种列表
                        if (luruAttribute == 2) {
                            var exampleOutlinId = onclickValue.split("'")[1]; // 获取onclick属性值中的outlinId
                            // ==========以下代码用于生成页面控件==========
                            // 删除控件（否则会显示好几套控件）
                            removeElements();
                            // 判断表格是否显示完整（如不完整，提示修改每页显示条目数量）
                            var paginationInfo = document.querySelector('#Blank_Page_Content > div.bootstrap-table > div.fixed-table-container > div.fixed-table-pagination > div.pull-left.pagination-detail > span.pagination-info').textContent; // 获取分页信息
                            var paginationInfoArray = paginationInfo.split(" "); // 将分页信息按空格分割成数组
                            var totalNum = paginationInfoArray[5]; // 总例数
                            var currentNum = paginationInfoArray[3]; // 当前显示例数
                            if (totalNum !== currentNum) { // 如果总例数不等于当前显示例数
                                // 生成div元素（id为alarmDiv），用于显示说明文本，置于表格下方
                                var alarmDiv = document.createElement("div");
                                alarmDiv.id = "alarmDiv";
                                document.querySelector('#Blank_Page_Content').appendChild(alarmDiv);
                                alarmDiv.style.cssText = "margin-bottom: 5px;width: 100%; padding: 10px; border: 1px solid red; border-radius: 6px; background-color: lightpink; color: red; font-size: 14px; line-height: 20px; text-align: left; white-space: pre-wrap;";
                                // 在div元素中添加文本
                                var alarmInfo = "警告：检测到表格尚未显示完整，请点击上方按钮修改每页显示记录数，否则将只能录入当前页的病种记录！";
                                var alarmInfoText = document.createTextNode(alarmInfo);
                                alarmDiv.appendChild(alarmInfoText);
                            }
                            // 生成div元素（id为buttonDiv1），用于存放按钮（模板导入模式）
                            var buttonDiv1 = document.createElement("div");
                            buttonDiv1.id = "buttonDiv1";
                            document.querySelector('#Blank_Page_Content').appendChild(buttonDiv1);
                            // 生成并添加文本节点：模板导入模式
                            var buttonDiv1Text = document.createTextNode("模板导入模式：");
                            buttonDiv1.appendChild(buttonDiv1Text);
                            // 生成div元素（id为buttonDiv），用于存放按钮（隐私保护模式）
                            var buttonDiv = document.createElement("div");
                            buttonDiv.id = "buttonDiv";
                            document.querySelector('#Blank_Page_Content').appendChild(buttonDiv);
                            // 生成并添加文本节点：隐私保护模式
                            var buttonDivText = document.createTextNode("隐私保护模式：");
                            buttonDiv.appendChild(buttonDivText);
                            // 生成按钮（id为buttonEditTable、buttonReadTable、buttonExportData、buttonReadFromTemp）：置于buttonDiv和buttonDiv1中
                            var buttonEditTable = document.createElement("button");
                            buttonEditTable.id = "buttonEditTable";
                            buttonEditTable.textContent = '修改项目名称及例数';
                            buttonDiv.appendChild(buttonEditTable);
                            var buttonReadTable = document.createElement("button");
                            buttonReadTable.id = "buttonReadTable";
                            buttonReadTable.textContent = '脱敏病种预览';
                            buttonDiv.appendChild(buttonReadTable);
                            var buttonExportTemp = document.createElement("button");
                            buttonExportTemp.id = "buttonExportTemp";
                            buttonExportTemp.textContent = "导出模板";
                            buttonDiv1.appendChild(buttonExportTemp);
                            var buttonExportData = document.createElement("button");
                            buttonExportData.id = "buttonExportData";
                            buttonExportData.textContent = '导出已录入的病种记录';
                            buttonDiv1.appendChild(buttonExportData);
                            var buttonReadFromTemp = document.createElement("button");
                            buttonReadFromTemp.id = "buttonReadFromTemp";
                            buttonReadFromTemp.textContent = '从模板导入';
                            buttonDiv1.appendChild(buttonReadFromTemp);
                            // 生成div元素（id为readmeDiv），用于显示说明文本，置于按钮下方
                            var readmeDiv = document.createElement("div");
                            readmeDiv.id = "readmeDiv";
                            document.querySelector('#Blank_Page_Content').appendChild(readmeDiv);
                            readmeDiv.style.cssText = "width: 100%; padding: 10px; border: 1px solid #0b714c; border-radius: 6px; background-color: #f0f8ff; color: #0b714c; font-size: 14px; line-height: 20px; text-align: left; white-space: pre-wrap;";
                            // 在div元素中添加文本
                            var readme = "说明："
                            + "\n本工具有“模板导入模式”和“隐私保护模式”两种录入方式。"
                            + "\n一、模板导入模式："
                            + "\n1.1 点击“导出模板”按钮，工具将读取当前页项目列表，并导出病种录入模板（.xlsx文件）。"
                            + "\n1.2 填写模板：模板每一行代表一条病种记录，您可根据需要增减行数。outlinId与您的培训专业、轮转科室、病种项目严格对应，请勿修改，否则将导致录入失败或发生未知错误。模板填写时请勿留空，否则该条记录无法被录入。"
                            + "\n1.3 点击“从模板导入”按钮，在弹出窗口中选择填好的病种录入模板，结果输出区域将显示读取到可录入的病种记录，请确认核对。"
                            + "\n1.4 核对无误后，点击“补录/录入导入的病种记录”按钮。然后在打开的页面内点击“一键录入”，工具将开始逐条录入并显示在结果输出区域。录入完成后，请回到手册病种项目页面并刷新查看录入结果。"
                            + "\n1.5 点击“导出已录入的病种记录”按钮，工具将读取当前页项目列表，然后在打开的页面内点击“导出病种记录”，工具将导出病种记录（.xlsx文件）。"
                            + "\n二、隐私保护模式"
                            + "\n如您希望规避内网病历信息流入外网导致患者隐私泄露的潜在风险，您可以使用隐私保护模式完成手册录入。"
                            + "\n2.1 修改项目名称及例数"
                            + "\n点击“修改项目名称及例数”按钮后，表格将变为可编辑状态。"
                            + "\n2.1.1 修改项目名称："
                            + "\n项目名称应修改为对应的病种名称，多个疾病名称间以英文（半角）“,”分隔。例如：假设表格中的项目名称为“胸部:胸部恶性肿瘤(肺癌、食管癌、纵隔肿瘤等) ”，您可将其修改为“肺癌,食管癌,纵隔肿瘤”，工具将随机抽取其中的疾病名称生成脱敏病种记录。"
                            + "\n若病种需指定患者性别（例如：前列腺癌、子宫肌瘤等），请在病种名称前标注“M”（男）或“F”（女），例如：“M前列腺癌”、“F子宫肌瘤”，工具将按照指定性别生成脱敏病种记录。"
                            + "\n2.1.2 修改例数："
                            + "\n工具默认按照表格中的“基本要求（例数）”生成病种记录，若“基本要求（例数）”为空，则按照“较高要求”生成脱敏病种记录。您可以根据需要修改录入病种的例数。"
                            + "\n2.1.3 修改完成后，点击“完成修改”按钮，表格将恢复为不可编辑状态。"
                            + "\n2.2 点击“脱敏病种预览”按钮，工具将生成脱敏病种记录并将生成的脱敏病种记录显示在结果输出区域，请确认核对。"
                            + "\n2.3 核对无误后，点击“补录/录入脱敏的病种记录”按钮。然后在打开的页面内点击“一键录入”，工具将开始逐条录入并显示在结果输出区域。录入完成后，请回到手册病种项目页面并刷新查看录入结果。";

                            var readmeText = document.createTextNode(readme);
                            readmeDiv.appendChild(readmeText);
                            // 设置按钮样式
                            buttonEditTable.style.cssText = buttonCssText;
                            buttonReadTable.style.cssText = buttonCssText;
                            buttonExportData.style.cssText = buttonCssText;
                            buttonReadFromTemp.style.cssText = buttonCssText;
                            buttonExportTemp.style.cssText = buttonCssText;
                            // 生成结果输出区域（id为resultDiv），置于readmeDiv下方
                            var resultDiv = document.createElement("div");
                            resultDiv.id = "resultDiv";
                            document.querySelector('#Blank_Page_Content').appendChild(resultDiv);
                            resultDiv.style.cssText = "width: 100%; padding: 10px; border: 1px solid #0b714c; border-radius: 6px; background-color: #f0f8ff; color: black; font-size: 13px; line-height: 20px; text-align: left; white-space: pre-wrap; margin-top: 5px;";
                            // 在resultDiv元素中添加文本
                            var resultHeader = "结果输出区域：";
                            var resultHeaderText = document.createTextNode(resultHeader);
                            resultDiv.appendChild(resultHeaderText);
                            // 添加按钮点击事件：编辑表格
                            buttonEditTable.onclick = function toggleButtonText() {
                                if (buttonEditTable.textContent === '修改项目名称及例数') {
                                    buttonEditTable.textContent = '完成修改'; // 点击'修改项目名称及例数'后，按钮文本变为'完成修改'
                                    // 允许编辑表格文本内容
                                    dataTable.contentEditable = true;
                                } else {
                                    buttonEditTable.textContent = '修改项目名称及例数'; // 点击'完成修改'后，按钮文本变为'修改项目名称及例数'
                                    // 禁止编辑元素的文本内容
                                    dataTable.contentEditable = false;
                                }
                            }
                            // ==========以上代码用于生成页面控件==========

                            // 定义函数：计算第i行的例数
                            function calculateSubLiShu(jsonRawData,i) {
                                var subLiShu = 0;
                                // 如果基本要求（例数）不为空，且为整数，则将其赋值给subLiShu
                                if (jsonRawData[i]["基本要求(例数)"] && Number.isInteger(jsonRawData[i]["基本要求(例数)"])) {
                                    subLiShu = jsonRawData[i]["基本要求(例数)"];
                                } else if (jsonRawData[i]["较高要求"] && Number.isInteger(jsonRawData[i]["较高要求"])) {
                                    subLiShu = jsonRawData[i]["较高要求"];
                                } else {
                                    subLiShu = 0;
                                }
                                return subLiShu;
                            }

                            // ==========以下代码用于脱敏病种预览==========
                            // 添加按钮点击事件：脱敏病种预览
                            buttonReadTable.addEventListener("click", function() {
                                // 清空resultDiv中的元素
                                resultDiv.innerHTML = "";
                                // 删除buttonToSubmit1元素
                                var buttonToSubmit1 = document.querySelector("#buttonToSubmit1");
                                if (buttonToSubmit1) {
                                    buttonToSubmit1.remove();
                                }
                                // 获取表格
                                var dataTable = document.querySelector("#dataTable");
                                // 获取表格的行数（不包括标题行）
                                var rowCount = dataTable.rows.length-1;
                                // 获取表格中的数据
                                var rawData = XLSX.utils.table_to_book(dataTable).Sheets.Sheet1;
                                // 将数据转换为JSON格式
                                var jsonRawData = XLSX.utils.sheet_to_json(rawData);
                                // 读取例数的总和
                                var totalLiShu = 0;
                                for (var i = 0; i < rowCount; i++) {
                                    totalLiShu += calculateSubLiShu(jsonRawData,i);
                                }
                                // 创建一个空白JSON数据：病例预填表
                                var bingliList = [];
                                // 处理表格每一行
                                for (var i = 0; i < rowCount; i++) {
                                    // 获取当前行的项目名称字符串，并判断是否包含逗号，如果包含逗号，则将项目名称字符串分割为数组，否则将项目名称字符串作为单元素数组
                                    var projectNameArray = jsonRawData[i]["项目名称"].includes(",") ? jsonRawData[i]["项目名称"].split(",") : [jsonRawData[i]["项目名称"]];
                                    projectNameArray = projectNameArray.filter(function(projectName) {
                                        return projectName.trim() !== ""; // 去除空值和空格
                                    });
                                    // 获取当前行的项目名称数组的长度
                                    var projectNameArrayLength = projectNameArray.length;
                                    // 获取当前行的基本要求(例数)
                                    var subLiShu = calculateSubLiShu(jsonRawData,i);
                                    // 获取当前行的outlinId（POST请求时用）
                                    var tr = dataTable.querySelector('tr[data-index="' + i + '"]'); // 获取data-index为i的tr元素
                                    var td = tr.querySelector('td:nth-child(7)'); // 获取tr元素下的第7个td元素
                                    var a = td.querySelector('a:nth-child(1)');  // 获取td元素下的第1个a元素
                                    var outlinId = a.getAttribute("onclick").split("'")[1]; // 获取a元素的onclick属性值，并从中提取提交ID（例如2211-2-1：2211指核医学科，-2指病种，-1指表格的第一行）
                                    // 为每个基本要求（例数）随机分配病种名称
                                    for (var j = 0; j < subLiShu; j++) {
                                        // 生成随机数，范围为0到病种名称数组的长度-1
                                        var randomNum = Math.floor(Math.random() * projectNameArrayLength);
                                        // 将随机数对应的病种名称以及outlinId（提交ID）添加到病种汇总中
                                        bingliList.push({"bzname": projectNameArray[randomNum], "outlinId": outlinId});
                                    }
                                }
                                // 为每个病例随机分配姓名、性别和病历号
                                // 定义函数：生成姓名性别
                                faker.locale = 'zh_CN';
                                const uniqueNamesSet = new Set(); // 用于存放已经生成的姓名
                                function generateUniqueNameAndGender() {
                                    let firstName, lastName, name, gender;
                                    do {
                                        firstName = faker.name.firstName().trim(); // 使用 Faker.js 生成随机姓氏, trim()用于删除姓名两端的空格
                                        lastName = faker.name.lastName().trim(); // 使用 Faker.js 生成随机名字, trim()用于删除姓名两端的空格
                                        if (lastName.split(' ').length > 1) {
                                            continue; // 如果姓氏不为单字，重新生成
                                        }
                                        name = `${firstName}${lastName}`.trim(); // 姓+名, trim()用于删除姓+名两端的空格
                                        gender = faker.random.arrayElement(['男', '女']); // 使用 Faker.js 生成随机性别
                                    } while (uniqueNamesSet.has(name)); // 检查是否已经生成过这个姓名
                                    uniqueNamesSet.add(name); // 将姓名添加到集合，确保不会再次生成相同的姓名
                                    return { name, gender };
                                }; // 定义生成姓名性别函数结束
                                for (var i = 0; i < totalLiShu; i++) {
                                    // 生成姓名性别并添加到病例预填表中
                                    const { name, gender } = generateUniqueNameAndGender();
                                    // 如果病种名称前面标注了F或者M，则将性别设置为对应的值
                                    if (bingliList[i]["bzname"].startsWith("F")) {
                                        bingliList[i]["bzname"] = bingliList[i]["bzname"].replace("F", "").trim();
                                        bingliList[i]["hzname"] = name;
                                        bingliList[i]["hzsex"] = "女";
                                    } else if (bingliList[i]["bzname"].startsWith("M")) {
                                        bingliList[i]["bzname"] = bingliList[i]["bzname"].replace("M", "").trim();
                                        bingliList[i]["hzname"] = name;
                                        bingliList[i]["hzsex"] = "男";
                                    } else {
                                        bingliList[i]["hzname"] = name;
                                        bingliList[i]["hzsex"] = gender;
                                    }
                                    // 生成随机假病历号
                                    var patientIDArray = []; // 用于存放已经生成的假病历号
                                    var patientID = generatePatientId();
                                    // 判断随机假病历号是否已经存在于patientIDArray中
                                    while (patientIDArray.includes(patientID)) {  // 如果随机假病历号已经存在于patientIDArray中，则重新生成假病历号
                                        // 生成随机假病历号
                                        var patientID = generatePatientId();
                                    }
                                    // 将随机假病历号添加到patientIDArray中
                                    bingliList[i]["hzbinglihao"] = patientID;
                                }
                                // 定义列顺序
                                var columnOrder = ["hzname", "hzsex", "hzbinglihao", "bzname", "outlinId"];

                                // Create a new array with the columns in the desired order
                                var bingliList = bingliList.map(function (row) {
                                    var orderedRow = {};
                                    columnOrder.forEach(function (column) {
                                        orderedRow[column] = row[column];
                                    });
                                    return orderedRow;
                                });

                                // Convert orderedBingli to HTML table with space between columns
                                var result = XLSX.utils.sheet_to_html(XLSX.utils.json_to_sheet(bingliList));

                                // Modify the table header names
                                var customHeaders = {
                                    "hzname": "姓名",
                                    "hzsex": "性别",
                                    "hzbinglihao": "病历号",
                                    "bzname": "病种",
                                    "outlinId": "outlinId"
                                };

                                // Display the table
                                resultDiv.innerHTML = result;

                                var table = resultDiv.querySelector('table');
                                var headerRow = table.querySelector('tbody > tr:nth-child(1)');
                                headerRow.style.fontWeight = 'bold'; // Make the header row bold

                                // 在列之间添加空隙
                                Object.keys(customHeaders).forEach(function (originalHeader, index) {
                                    var cell = headerRow.cells[index];
                                    cell.textContent = customHeaders[originalHeader];
                                    cell.style.paddingRight = '10px'; // Add padding to each cell to increase space
                                });

                                // Apply the same style to all rows
                                var dataRows = table.querySelectorAll('tbody > tr');
                                dataRows.forEach(function(row) {
                                    Array.from(row.cells).forEach(function(cell) {
                                        cell.style.paddingRight = '10px'; // Add padding to each cell in data rows
                                    });
                                });
                                // 将bingliList存储到localStorage中的bingliArray
                                localStorage.setItem("bingliArray", JSON.stringify(bingliList));

                                // 获取binglilist中的第一个outlinId
                                var validOutlinId = bingliList[0]["outlinId"];

                                // 生成按钮：录入/补录脱敏的病种记录，先删除后生成
                                var buttonToSubmit = document.querySelector("#buttonToSubmit");
                                if (buttonToSubmit) {
                                    buttonToSubmit.remove();
                                }
                                var buttonToSubmit = document.createElement("button");
                                buttonToSubmit.id = "buttonToSubmit";
                                buttonToSubmit.style.cssText = buttonCssText;
                                // 获取当前页面的URL
                                var currentUrl = window.location.href;
                                // 如果当前页面URL包含"ManualOutlineController/viewxylishi"（历史手册页），则打开"ManualFormController/viewbulu/"，否则打开"ManualFormController/view/"
                                if (currentUrl.includes("/ManualOutlineController/viewxylishi")) {
                                    buttonToSubmit.textContent = '补录脱敏的病种记录';
                                    buttonDiv.appendChild(buttonToSubmit);
                                    // 添加按钮点击事件：跳转到补录数据页
                                    buttonToSubmit.addEventListener("click", function() {
                                        window.open(urlRoot + "/ManualFormController/lurubulu/" + validOutlinId);
                                    });
                                } else {
                                    buttonToSubmit.textContent = '录入脱敏的病种记录';
                                    buttonDiv.appendChild(buttonToSubmit);
                                    // 添加按钮点击事件：跳转到录入数据页
                                    buttonToSubmit.addEventListener("click", function() {
                                        window.open(urlRoot + "/ManualFormController/luru/" + validOutlinId);
                                    });
                                }
                                // ==========以上代码用于脱敏病种预览==========
                            }); // ==========脱敏病种预览按钮事件结束==========
                            // ==========以下代码用于导出模板==========
                            // 添加按钮点击事件：导出模板
                            buttonExportTemp.addEventListener("click", function() {
                                // 获取表格
                                var dataTable = document.querySelector("#dataTable");
                                // 获取表格的行数（不包括标题行）
                                var rowCount = dataTable.rows.length-1;
                                // 获取表格中的数据
                                var rawData = XLSX.utils.table_to_book(dataTable).Sheets.Sheet1;
                                // 将数据转换为JSON格式
                                var jsonRawData = XLSX.utils.sheet_to_json(rawData);
                                // 创建一个空白JSON数据：病例模板
                                var bingliTemp = [];
                                // 处理表格每一行
                                for (var i = 0; i < rowCount; i++) {
                                    // 获取当前行的项目名称字符串
                                    var projectNameArray = jsonRawData[i]["项目名称"];
                                    // 获取当前行的例数要求
                                    var subLiShu = calculateSubLiShu(jsonRawData,i);
                                    // 获取当前行的outlinId（提交ID）
                                    var tr = dataTable.querySelector('tr[data-index="' + i + '"]'); // 获取data-index为i的tr元素
                                    var td = tr.querySelector('td:nth-child(7)'); // 获取tr元素下的第7个td元素
                                    var a = td.querySelector('a:nth-child(1)');  // 获取td元素下的第1个a元素
                                    var outlinId = a.getAttribute("onclick").split("'")[1]; // 获取a元素的onclick属性值，并从中提取提交ID（例如2211-2-1：2211指核医学科，-2指病种，-1指表格的第一行）
                                    for (var j = 0; j < subLiShu; j++) {
                                        bingliTemp.push({"项目名称": projectNameArray, "姓名": "", "性别": "", "病历号": "", "病种": "", "outlinId": outlinId});
                                    };
                                };
                                // 将病例模板导出为xlsx文件
                                var ws = XLSX.utils.json_to_sheet(bingliTemp);
                                var wb = XLSX.utils.book_new();
                                XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
                                XLSX.writeFile(wb, "病种录入模板.xlsx");
                                // 在resultDiv元素中添加文本
                                var exportInfo = "\n已将病种录入模板导出为Excel(.xlsx)文件，请在浏览器“下载内容”中查看！";
                                var exportInfoText = document.createTextNode(exportInfo);
                                resultDiv.appendChild(exportInfoText);
                            }); // ==========导出模板按钮事件结束==========
                            // ==========以下代码用于导出已录入的病种记录==========
                            // 添加按钮点击事件：导出已录入的病种记录
                            buttonExportData.addEventListener("click", function() {
                                // 获取表格
                                var dataTable = document.querySelector("#dataTable");
                                // 获取表格的行数（不包括标题行）
                                var rowCount = dataTable.rows.length-1;
                                // 获取表格中的数据
                                var rawData = XLSX.utils.table_to_book(dataTable).Sheets.Sheet1;
                                // 将数据转换为JSON格式
                                var jsonRawData = XLSX.utils.sheet_to_json(rawData);
                                // 创建一个数组：outlinId数组
                                var outlinIdList = [];
                                // 处理病种表格每一行，获得outlinId
                                for (var i = 0; i < rowCount; i++) {
                                    // 获取当前行的outlinId（POST请求时用）
                                    var tr = dataTable.querySelector('tr[data-index="' + i + '"]'); // 获取data-index为i的tr元素
                                    var td = tr.querySelector('td:nth-child(7)'); // 获取tr元素下的第7个td元素
                                    var a = td.querySelector('a:nth-child(1)');  // 获取td元素下的第1个a元素
                                    var outlinId = a.getAttribute("onclick").split("'")[1]; // 获取a元素的onclick属性值，并从中提取提交ID（例如2211-2-1：2211指核医学科，-2指病种，-1指表格的第一行）
                                    // 将outlinId添加到outlinId数组中
                                    outlinIdList.push(outlinId);
                                } // 遍历病种表格中的数据结束
                                // 将outlinIdList存储到localStorage中的outlinIdArray
                                localStorage.setItem("outlinIdArray", JSON.stringify(outlinIdList));
                                // 新标签页打开单病种病例列表页
                                // 获取当前页面的URL
                                var currentUrl = window.location.href;
                                // 如果当前页面URL包含"ManualOutlineController/viewxylishi"（历史手册页），则打开"ManualFormController/viewbulu/"，否则打开"ManualFormController/view/"
                                if (currentUrl.includes("/ManualOutlineController/viewxylishi")) {
                                    window.open(urlRoot + "/ManualFormController/viewbulu/" + exampleOutlinId);
                                } else {
                                    window.open(urlRoot + "/ManualFormController/view/" + exampleOutlinId);
                                }
                            }); // ==========导出已录入的病种记录按钮事件结束==========
                            // ==========以下代码用于从模板导入==========
                            // 添加按钮点击事件：从模板导入
                            buttonReadFromTemp.addEventListener("click", function() {
                                // 清空resultDiv中的元素
                                resultDiv.innerHTML = "";
                                // 删除buttonToSubmit按钮
                                var buttonToSubmit = document.querySelector("#buttonToSubmit");
                                if (buttonToSubmit) {
                                    buttonToSubmit.remove();
                                }
                                // 创建一个空白JSON数据：outlinId数组
                                var outlinIdArrayForVerify = [];
                                // 获取表格
                                var dataTable = document.querySelector("#dataTable");
                                // 获取表格的行数（不包括标题行）
                                var rowCount = dataTable.rows.length-1;
                                // 获取表格中的数据
                                var rawData = XLSX.utils.table_to_book(dataTable).Sheets.Sheet1;
                                // 将数据转换为JSON格式
                                var jsonRawData = XLSX.utils.sheet_to_json(rawData);
                                // 处理病种表格每一行，获得outlinId
                                for (var i = 0; i < rowCount; i++) {
                                    // 获取当前行的outlinId
                                    var tr = dataTable.querySelector('tr[data-index="' + i + '"]'); // 获取data-index为i的tr元素
                                    var td = tr.querySelector('td:nth-child(7)'); // 获取tr元素下的第7个td元素
                                    var a = td.querySelector('a:nth-child(1)');  // 获取td元素下的第1个a元素
                                    var outlinId = a.getAttribute("onclick").split("'")[1]; // 获取a元素的onclick属性值，并从中提取提交ID（例如2211-2-1：2211指核医学科，-2指病种，-1指表格的第一行）
                                    // 将outlinId添加到outlinIdArrayForVerify中
                                    outlinIdArrayForVerify.push(outlinId);
                                }; // 遍历病种表格中的数据结束
                                // 在弹出窗口中选择excel文件
                                var input = document.createElement('input');
                                input.type = 'file';
                                input.accept = '.xlsx';
                                // 点击input元素，弹出文件选择窗口
                                input.click();
                                input.onchange = function() {
                                    var file = input.files[0];
                                    var reader = new FileReader();
                                    reader.onload = function(e) { // 当文件读取完成后执行
                                        var data = new Uint8Array(e.target.result); // 读取文件内容
                                        var workbook = XLSX.read(data, {type: 'array'}); // 以二进制流方式读取得到整份excel表格对象
                                        var sheetName = workbook.SheetNames[0]; // 获取excel中的第一个表格
                                        var sheet = workbook.Sheets[sheetName]; // 获取excel中的第一个表格
                                        var bingliList = XLSX.utils.sheet_to_json(sheet); // 生成json数据
                                        // 把姓名、性别、病历号、病种、outlinId的键名统一为hzname、hzsex、hzbinglihao、bzname、outlinId
                                        bingliList = bingliList.map(function(item) {
                                            return {
                                                "hzname": item["姓名"],
                                                "hzsex": item["性别"],
                                                "hzbinglihao": item["病历号"],
                                                "bzname": item["病种"],
                                                "outlinId": item["outlinId"]
                                            };
                                        });

                                        // 过滤掉没有 hzname 或 hzsex 或 hzbinglihao 或 bzname 或 outlinId 的元素
                                        bingliList = bingliList.filter(function(item) {
                                            return item.hzname && item.hzsex && item.hzbinglihao && item.bzname && item.outlinId;
                                        });

                                        // 过滤掉没有 outlinId 或 outlinId 不在 outlinIdArrayForVerify 中的元素
                                        bingliList = bingliList.filter(function(item) {
                                            return item.outlinId && outlinIdArrayForVerify.includes(item.outlinId);
                                        });

                                        // 定义列顺序
                                        var columnOrder = ["hzname", "hzsex", "hzbinglihao", "bzname", "outlinId"];

                                        // Create a new array with the columns in the desired order
                                        var bingliList = bingliList.map(function (row) {
                                            var orderedRow = {};
                                            columnOrder.forEach(function (column) {
                                                orderedRow[column] = row[column];
                                            });
                                            return orderedRow;
                                        });

                                        // Convert orderedBingli to HTML table with space between columns
                                        var result = XLSX.utils.sheet_to_html(XLSX.utils.json_to_sheet(bingliList));

                                        // Modify the table header names
                                        var customHeaders = {
                                            "hzname": "姓名",
                                            "hzsex": "性别",
                                            "hzbinglihao": "病历号",
                                            "bzname": "病种",
                                            "outlinId": "outlinId"
                                        };

                                        // Display the table
                                        resultDiv.innerHTML = result;

                                        var table = resultDiv.querySelector('table');
                                        var headerRow = table.querySelector('tbody > tr:nth-child(1)');
                                        headerRow.style.fontWeight = 'bold'; // Make the header row bold

                                        // 在列之间添加空隙
                                        Object.keys(customHeaders).forEach(function (originalHeader, index) {
                                            var cell = headerRow.cells[index];
                                            cell.textContent = customHeaders[originalHeader];
                                            cell.style.paddingRight = '10px'; // Add padding to each cell to increase space
                                        });

                                        // Apply the same style to all rows
                                        var dataRows = table.querySelectorAll('tbody > tr');
                                        dataRows.forEach(function(row) {
                                            Array.from(row.cells).forEach(function(cell) {
                                                cell.style.paddingRight = '10px'; // Add padding to each cell in data rows
                                            });
                                        });

                                        // 将bingliList存储到localStorage中的bingliArray
                                        localStorage.setItem("bingliArray", JSON.stringify(bingliList));

                                        // 获取binglilist中的第一个outlinId
                                        var validOutlinId = bingliList[0]["outlinId"];

                                        // 生成按钮：录入/补录导入的病种记录，先删除后生成
                                        var buttonToSubmit1 = document.querySelector("#buttonToSubmit1");
                                        if (buttonToSubmit1) {
                                            buttonToSubmit1.remove();
                                        }
                                        var buttonToSubmit1 = document.createElement("button");
                                        buttonToSubmit1.id = "buttonToSubmit1";
                                        buttonToSubmit1.style.cssText = buttonCssText;
                                        // 获取当前页面的URL
                                        var currentUrl = window.location.href;
                                        // 如果当前页面URL包含"ManualOutlineController/viewxylishi"（历史手册页），则打开"ManualFormController/viewbulu/"，否则打开"ManualFormController/view/"
                                        if (currentUrl.includes("/ManualOutlineController/viewxylishi")) {
                                            buttonToSubmit1.textContent = '补录导入的病种记录';
                                            buttonDiv1.appendChild(buttonToSubmit1);
                                            // 添加按钮点击事件：跳转到补录数据页
                                            buttonToSubmit1.addEventListener("click", function() {
                                                window.open(urlRoot + "/ManualFormController/lurubulu/" + validOutlinId);
                                            });
                                        } else {
                                            buttonToSubmit1.textContent = '录入导入的病种记录';
                                            buttonDiv1.appendChild(buttonToSubmit1);
                                            // 添加按钮点击事件：跳转到录入数据页
                                            buttonToSubmit1.addEventListener("click", function() {
                                                window.open(urlRoot + "/ManualFormController/luru/" + validOutlinId);
                                            });
                                        }
                                    }

                                    reader.readAsArrayBuffer(file);
                                }; // ==========从模板导入按钮事件结束==========
                            }); // ==========从模板导入按钮事件结束==========
                        } else {
                            // 有录入按钮，但不是病种表格
                            removeElements();
                        }
                    } else {
                        // 表格内没有录入按钮
                        removeElements();
                    }
                }
            }
        });
        // 配置观察选项
        var config = { childList: true, subtree: true };
        observer.observe(dataTable, config);

        // 第三部分 当前/历史手册单病种单病例录入页：判断当前页面的URL是否包含"ManualFormController/luru"（当前/历史手册单病种单病例录入页）
    } else if (currentUrl.includes("ManualFormController/luru")) {
        // 手册录入页面（本月手册为/ManualFormController/luru/outlinid，历史手册为/ManualFormController/lurubulu/outlinid）
        // 定义函数：Post请求提交病种记录
        function postBingzhong(url, bingliList, resultDiv) {
            // 用于记录所有 fetch 请求的 Promise
            var fetchPromises = [];
            // 遍历bingliList中的数据
            var totalLiShu = bingliList.length;
            for (let i = 0; i < totalLiShu; i++) {
                (function (index) {  // Create a closure to capture the current value of 'i'
                    // 获取当前行的outlinId
                    let outlinId = bingliList[i]["outlinId"];
                    // 获取当前行的患者姓名，转为URL Encoding
                    let hzname = encodeURIComponent(bingliList[i]["hzname"]);
                    // 获取当前行的患者性别，转为URL Encoding
                    let hzsex = encodeURIComponent(bingliList[i]["hzsex"]);
                    // 获取当前行的患者病历号，转为URL Encoding
                    let hzbinglihao = encodeURIComponent(bingliList[i]["hzbinglihao"]);
                    // 获取当前行的病种名称，转为URL Encoding
                    let bzname = encodeURIComponent(bingliList[i]["bzname"]);
                    // 获取当前行的jhid，转为URL Encoding
                    let jhid = encodeURIComponent(bingliList[i]["jhid"]);
                    // load参数：判断录入当前手册还是补录历史手册，补录历史手册load需增加jhid参数，否则报500错误
                    if (url.includes("ManualFormController/addbulu")) {  // 历史手册
                        var load = "outlinId=" + outlinId + "&projectId=2&hzname=" + hzname + "&hzsex=" + hzsex + "&hzcsdate=&hzbinglihao=" + hzbinglihao + "&hzrydate=&hzlaiyuan=&jzzhuangtai=&bzname=" + bzname + "&zyzhenduan=&qtzhenduan=&iszhuguan=&sjyishi=&brjieguo=&jhid=" + jhid;
                    } else {
                        var load = "outlinId=" + outlinId + "&projectId=2&hzname=" + hzname + "&hzsex=" + hzsex + "&hzcsdate=&hzbinglihao=" + hzbinglihao + "&hzrydate=&hzlaiyuan=&jzzhuangtai=&bzname=" + bzname + "&zyzhenduan=&qtzhenduan=&iszhuguan=&sjyishi=&brjieguo=";
                    }
                    // 发送POST请求，返回成功或失败
                    // 添加 fetch 请求的 Promise 到数组
                    fetchPromises.push(
                        fetch(url, {
                            method: 'POST',
                            headers: {
                                'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8"
                            },
                            body: load
                        })
                        .then(response => response.json())
                        .then(data => {
                            // 处理接口返回的数据
                            var patientInfo = bingliList[i]["hzname"] + "，" + bingliList[i]["hzsex"] + "，病历号：" + bingliList[i]["hzbinglihao"] + "，病种：" + bingliList[i]["bzname"] + "，outlinID：" + bingliList[i]["outlinId"];
                            var resultText = document.createTextNode("\n" + patientInfo + " " + data.msg);

                            // 在resultDiv元素中添加文本
                            resultDiv.appendChild(resultText);
                        })
                        .catch(error => {
                            // 处理错误
                            var patientInfo = bingliList[i]["hzname"] + "，" + bingliList[i]["hzsex"] + "，病历号：" + bingliList[i]["hzbinglihao"] + "，病种：" + bingliList[i]["bzname"] + "，outlinID：" + bingliList[i]["outlinId"];
                            var resultText = document.createTextNode("\n" + patientInfo + " " + error);

                            // 在resultDiv元素中添加文本
                            resultDiv.appendChild(resultText);
                        })
                    );
                })(i);  // 将当前的'i'值传递给闭包函数
            } // 遍历bingliList中的数据结束
            // 等待所有请求完成后，处理结果
            Promise.all(fetchPromises)
                .then(() => {
                // 这里可以添加在所有请求完成后的处理逻辑
                var allDone = document.createTextNode("\n所有病种记录已提交，请回到病种项目页面并刷新查看录入结果！");
                // 在resultDiv元素中添加文本
                resultDiv.appendChild(allDone);
            });
        }; // 定义函数结束：Post请求提交病种记录
        // 获取当前页面URL中的outlinId
        var currentOutlinId = currentUrl.split("/")[5];
        // 获取localStorage中的bingliArray中的bingliList
        var readBingliList = JSON.parse(localStorage.getItem("bingliArray"));
        // 从readBingliList提取所有的outlinId
        var readBingliOutlinIdArray = readBingliList.map(function (item) {
            return item.outlinId;
        });
        if (currentUrl.includes("/ManualFormController/lurubulu")) {
            var url = urlRoot + "/ManualFormController/addbulu";
            // 获取当前页面的jhid
            var jhid = document.querySelector('#form-add > div:nth-child(16) > div > select > option').value;
        } else {
            var url = urlRoot + "/ManualFormController/add";
        }
        // 判断readBingliOutlinIdArray是否包含当前页面的outlinId，如果包含，则添加按钮及按钮点击事件
        if (readBingliOutlinIdArray.includes(currentOutlinId)) {
            // 根据selector选择器获取页面div元素
            var pageDiv = document.querySelector('#element > div');
            // 生成div元素（id为buttonDiv），用于存放按钮，置于div最上方
            var buttonDiv = document.createElement("div");
            buttonDiv.id = "buttonDiv";
            pageDiv.insertBefore(buttonDiv, pageDiv.firstChild);
            // 生成按钮（id为buttonSubmit）：置于buttonDiv中
            var buttonExportData = document.createElement("button");
            buttonExportData.id = "buttonSubmit";
            buttonExportData.textContent = '一键录入';
            buttonDiv.appendChild(buttonExportData);
            // 设置按钮样式
            buttonExportData.style.cssText = buttonCssText;
            // 生成readmeDiv元素（id为readmeDiv），用于显示说明文本，置于第二位
            var readmeDiv = document.createElement("div");
            readmeDiv.id = "readmeDiv";
            pageDiv.insertBefore(readmeDiv, pageDiv.childNodes[1]);
            readmeDiv.style.cssText = readmeDivCssText;
            // 在div元素中添加文本
            var readmeSubmit = "说明：\n"
            + "点击“一键录入”按钮后，工具将开始逐条录入并显示在结果输出区域。录入完成后，请回到手册病种项目页面并刷新查看录入结果。";
            var readmeSubmitText = document.createTextNode(readmeSubmit);
            readmeDiv.appendChild(readmeSubmitText);
            // 生成结果输出区域（id为resultDiv），置于readmeDiv下方，样式与readmeDiv相同，但文字颜色为黑色，字号为13px，上方与readmeDiv相距5px
            var resultDiv = document.createElement("div");
            resultDiv.id = "resultDiv";
            pageDiv.insertBefore(resultDiv, pageDiv.childNodes[2]);
            resultDiv.style.cssText = resultDivCssText;
            // 在resultDiv元素中添加文本
            var resultHeader = "结果输出区域：";
            var resultHeaderText = document.createTextNode(resultHeader);
            resultDiv.appendChild(resultHeaderText);

            // 添加按钮点击事件：一键录入
            buttonSubmit.addEventListener("click", function() {
                var resultText = document.createTextNode("\n开始录入病种记录，请稍候...");
                resultDiv.appendChild(resultText);
                // 为readBingliList中的每个元素添加jhid属性
                for (var i = 0; i < readBingliList.length; i++) {
                    readBingliList[i]["jhid"] = jhid;
                }
                // 调用函数：Post请求提交病种记录
                console.log(url);
                console.log(readBingliList);
                console.log(resultDiv);
                console.log(jhid);
                postBingzhong(url, readBingliList, resultDiv);
                // 点击一次后禁用按钮
                buttonSubmit.disabled = true;
                // 清空localStorage中的bingliArray
                localStorage.removeItem("bingliArray");
            }); // ==========提交表格按钮事件结束==========
        }
        // 第四部分 当前/历史手册单病种病例列表页：判断当前页面的URL是否包含"ManualFormController/view/"（当前/历史手册单病种病例列表页）
    } else if (currentUrl.includes("/ManualFormController/view/") || currentUrl.includes("/ManualFormController/viewbulu/")) {
        // 获取当前页面URL中的outlinId
        var currentOutlinId = currentUrl.split("/")[5];
        // 获取localStorage中的outlinIdArray中的outlinIdList
        var readOutlinIdList = JSON.parse(localStorage.getItem("outlinIdArray"));
        if (currentUrl.includes("/ManualOutlineController/viewxylishi")) {
            var url = urlRoot + "/ManualFormController/addbulu";
        } else {
            var url = urlRoot + "/ManualFormController/add";
        };
        // 判断readOutlinIdArray是否包含当前页面的outlinId，如果包含，则添加按钮及按钮点击事件
        if (readOutlinIdList.includes(currentOutlinId)) {
            // 生成div元素（id为buttonDiv）
            var buttonDiv = document.createElement("div");
            buttonDiv.id = "buttonDiv";
            document.querySelector('#Blank_Page_Content').appendChild(buttonDiv);
            // 生成按钮（id为buttonExportData）：置于buttonDiv中
            var buttonExportData = document.createElement("button");
            buttonExportData.id = "buttonExportData";
            buttonExportData.textContent = '导出病种记录';
            buttonDiv.appendChild(buttonExportData);
            buttonExportData.style.cssText = buttonCssText;
            // 生成readmeDiv元素（id为readmeDiv），用于显示说明文本，置于按钮下方
            var readmeDiv = document.createElement("div");
            readmeDiv.id = "readmeDiv";
            document.querySelector('#Blank_Page_Content').appendChild(readmeDiv);
            readmeDiv.style.cssText = readmeDivCssText;
            // 在div元素中添加文本
            var readme = "说明："
            + "\n点击“导出病种记录”按钮后，工具将导出当前科室全部病种记录为Excel(.xlsx)文件。";
            var readmeText = document.createTextNode(readme);
            readmeDiv.appendChild(readmeText);
            // 生成结果输出区域（id为resultDiv），置于readmeDiv下方，样式与readmeDiv相同，但文字颜色为黑色，字号为13px，上方与readmeDiv相距5px
            var resultDiv = document.createElement("div");
            resultDiv.id = "resultDiv";
            document.querySelector('#Blank_Page_Content').appendChild(resultDiv);
            resultDiv.style.cssText = resultDivCssText;
            // 在resultDiv元素中添加文本
            var resultHeader = "结果输出区域：";
            var resultHeaderText = document.createTextNode(resultHeader);
            resultDiv.appendChild(resultHeaderText);
            // 判断当前页面的URL是否包含"ManualFormController/view/"（本月手册表单页）
            if (currentUrl.includes("/ManualFormController/view/")) {
                var urlprefix = urlRoot + "/ManualFormController/list/"
                };
            // 判断当前页面的URL是否包含"ManualFormController/viewbulu/"（历史手册表单页）
            if (currentUrl.includes("/ManualFormController/viewbulu/")) {
                var urlprefix = urlRoot + "/ManualFormController/listluru/"
                };
            // 添加按钮点击事件：导出病种记录
            buttonExportData.addEventListener("click", function () {
                var totalData = [];
                var completedRequests = 0;
                function sendRequest(outlinId) {
                    var load = "pageSize=100&pageNum=1&isAsc=asc";
                    var url = urlprefix + outlinId;
                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", url, true);
                    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    xhr.setRequestHeader("Accept", "application/json, text/javascript, */*; q=0.01");
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == 4) {
                            if (xhr.status == 200) { // 请求成功
                                console.log("请求成功");
                                var jsonRawData = JSON.parse(xhr.responseText);
                                var rawData = jsonRawData.rows;
                                for (var j = 0; j < rawData.length; j++) {
                                    // 删除属性
                                    delete rawData[j]["sjkeshi"];
                                    delete rawData[j]["qtzhenduan"];
                                    delete rawData[j]["sjyishi"];
                                    delete rawData[j]["hzlaiyuan"];
                                    delete rawData[j]["laoshi"];
                                    delete rawData[j]["zyzhenduan"];
                                    delete rawData[j]["iszhuguan"];
                                    delete rawData[j]["hzrydate"];
                                    delete rawData[j]["hzcsdate"];
                                    delete rawData[j]["shjieguo"];
                                    delete rawData[j]["brjieguo"];
                                    delete rawData[j]["id"];
                                    delete rawData[j]["jzzhuangtai"];
                                    rawData[j]["outlinId"] = outlinId;
                                    totalData.push(rawData[j]);
                                }
                                completedRequests++;
                                // 判断是否是最后一个请求
                                if (completedRequests === readOutlinIdList.length) {
                                    handleTotalData();
                                }
                            } else { // 请求失败
                                console.log("请求失败");
                                completedRequests++;
                                // 判断是否是最后一个请求
                                if (completedRequests === readOutlinIdList.length) {
                                    handleTotalData();
                                }
                            }
                        }
                    };
                    xhr.send(load);
                }
                // 遍历 outlinIdArray，发送请求
                for (var i = 0; i < readOutlinIdList.length; i++) {
                    sendRequest(readOutlinIdList[i]);
                }
                // 处理 totalData
                function handleTotalData() {
                    var totalDataString = JSON.stringify(totalData);
                    // 将resultDiv中的病种记录导出为Excel文件
                    var wb = XLSX.utils.book_new();
                    var ws = XLSX.utils.json_to_sheet(totalData);
                    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
                    XLSX.writeFile(wb, "病种记录导出.xlsx");
                    // 在resultDiv元素中添加文本，显示已经将几个病种记录导出为excel文件
                    var resultText = document.createTextNode("\n已将" + totalData.length + "条病种记录导出为Excel(.xlsx)文件，请在浏览器“下载内容”内查看！");
                    resultDiv.appendChild(resultText);
                };
            }); // ==========导出病种记录按钮事件结束==========
        };
    } else {
        // 在其他网页上执行的代码
        console.log("欢迎使用山东住院医师规范化培训手册填写助手，当前非目标页面");
    }
})();