// ==UserScript==
// @name         CME课程批量完成工具
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动批量完成CME课程和考试，支持AI智能答题和错误学习
// @author       Your name
// @license      All Rights Reserved
// @match        https://www.cmechina.net/cme/study2.jsp*
// @match        http://www.cmechina.net/cme/study2.jsp*
// @match        https://www.cmechina.net/qypx/bj/study2.jsp*
// @match        http://www.cmechina.net/qypx/bj/study2.jsp*
// @match        https://www.cmechina.net/cme/exam.jsp*
// @match        http://www.cmechina.net/cme/exam.jsp*
// @match        https://www.cmechina.net/qypx/bj/exam.jsp*
// @match        http://www.cmechina.net/qypx/bj/exam.jsp*
// @match        https://www.cmechina.net/cme/examQuizFail.jsp*
// @match        http://www.cmechina.net/cme/examQuizFail.jsp*
// @match        https://www.cmechina.net/qypx/bj/examQuizFail.jsp*
// @match        http://www.cmechina.net/qypx/bj/examQuizFail.jsp*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/536493/CME%E8%AF%BE%E7%A8%8B%E6%89%B9%E9%87%8F%E5%AE%8C%E6%88%90%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/536493/CME%E8%AF%BE%E7%A8%8B%E6%89%B9%E9%87%8F%E5%AE%8C%E6%88%90%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

/**
 * Copyright (c) 2025 start light. All Rights Reserved.
 *
 * 未经作者明确书面许可，不得复制、修改、分发或使用本软件的任何部分。
 * 本软件仅供个人学习和研究使用，禁止用于任何商业用途。
 *
 * 作者保留所有权利。
 */

(function() {
    'use strict';

    // 添加按钮到页面
    function addButtons() {
        try {
            // 批量完成按钮
            const completeButton = document.createElement('button');
            completeButton.textContent = '批量完成课程';
            completeButton.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 999999;
                padding: 10px 20px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            `;
            completeButton.addEventListener('click', batchCompleteCMECourses);
            document.body.appendChild(completeButton);

            // 打开待考试按钮
            const examButton = document.createElement('button');
            examButton.textContent = '打开待考试';
            examButton.style.cssText = `
                position: fixed;
                top: 20px;
                right: 150px;
                z-index: 999999;
                padding: 10px 20px;
                background-color: #2196F3;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            `;
            examButton.addEventListener('click', scanForPendingExamsAndDisplay);
            document.body.appendChild(examButton);

            // 自动答题按钮（在考试页面或失败页面显示）
            if (window.location.pathname.includes('exam.jsp') || window.location.pathname.includes('examQuizFail.jsp')) {
                const autoAnswerButton = document.createElement('button');
                autoAnswerButton.textContent = '自动答题';
                autoAnswerButton.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 280px;
                    z-index: 999999;
                    padding: 10px 20px;
                    background-color: #FF9800;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                `;
                autoAnswerButton.addEventListener('click', () => {
                    // Simplified: always call automateExamWithDeepSeekSingleCall.
                    // The function itself will determine behavior based on page and pending feedback.
                    automateExamWithDeepSeekSingleCall(true); // autoSubmit = true
                });
                document.body.appendChild(autoAnswerButton);
            }

        } catch (error) {
            const errorDiv = document.createElement('div');
            errorDiv.textContent = '脚本加载出错，请刷新页面重试';
            errorDiv.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background-color: #f44336;
                color: white;
                padding: 10px;
                text-align: center;
                z-index: 999999;
            `;
            document.body.appendChild(errorDiv);
        }
    }

    async function batchCompleteCMECourses() {
        console.log("[批量完成脚本] 开始运行...");
        alert("即将开始批量完成课程。请保持此页面打开，并留意控制台输出。过程可能需要一些时间。");

        const courseListElement = document.getElementById('s_r_ml');
        if (!courseListElement) {
            console.error("[批量完成脚本] 错误: 未找到课程目录元素 (#s_r_ml)。");
            alert("[批量完成脚本] 错误: 未找到课程目录。");
            return;
        }

        const coursewareItems = [];
        courseListElement.querySelectorAll('li a').forEach(a => {
            const onclickAttr = a.getAttribute('onclick');
            if (onclickAttr && onclickAttr.includes('kjJumpTo')) {
                const matches = onclickAttr.match(/study2\.jsp\?course_id=([^&]+)&courseware_id=([^']+)['"]\s*,\s*['"]([^']+)['"]/);
                if (matches && matches.length === 4) {
                    coursewareItems.push({
                        course_id: matches[1],
                        courseware_id: matches[2],
                        name: matches[3] || a.textContent.trim().replace(/第..节/, '').trim(),
                        status_element: a.parentElement.querySelector('i')
                    });
                }
            }
        });

        if (coursewareItems.length === 0) {
            console.warn("[批量完成脚本] 未在目录中找到符合格式的课件链接。");
            alert("[批量完成脚本] 目录中未找到课件。");
            return;
        }
        console.log(`[批量完成脚本] 发现 ${coursewareItems.length} 个课件:`, coursewareItems.map(c => c.name));

        const user_id_on_page = typeof window.user_id === 'string' ? window.user_id : (typeof window.user_id2 === 'string' ? window.user_id2 : null);
        const see_key_on_page = typeof window.see === 'string' ? window.see : null;

        if (!user_id_on_page) {
            console.error("[批量完成脚本] 错误: 未能从当前页面获取 user_id。无法继续。");
            alert("[批量完成脚本] 错误: 无法获取用户信息。");
            return;
        }
        console.log(`[批量完成脚本] 使用当前页面的 User ID: ${user_id_on_page}`);
        if (see_key_on_page) {
            console.log(`[批量完成脚本] 使用当前页面的 localStorage 键 (see): ${see_key_on_page}`);
        } else {
            console.warn("[批量完成脚本] 警告: 未能从当前页面获取 'see' (localStorage 键)。本地完成状态可能不会被完全模拟。");
        }

        let completedCount = 0;
        for (const item of coursewareItems) {
            console.log(`[批量完成脚本] 正在处理: ${item.name} (Course ID: ${item.course_id}, Ware ID: ${item.courseware_id})`);

            if (item.status_element && (item.status_element.textContent.includes('已学习') || item.status_element.textContent.includes('已完成'))) {
                console.log(`[批量完成脚本]   ${item.name} 状态已为"已学习"，跳过。`);
                completedCount++;
                continue;
            }

            const studyPageUrl = `study2.jsp?course_id=${item.course_id}&courseware_id=${item.courseware_id}`;

            try {
                const response = await fetch(studyPageUrl);
                if (!response.ok) {
                    console.error(`[批量完成脚本]   获取课件页面失败: ${item.name} (状态: ${response.status})`);
                    item.status_element ? (item.status_element.textContent = '获取失败', item.status_element.style.color = 'red') : null;
                    continue;
                }
                const pageHtml = await response.text();

                let timeStamp, sign;
                const timeStampMatch = pageHtml.match(/var\s+timeStamp\s*=\s*['"]([^'"]+)['"];/);
                const signMatch = pageHtml.match(/var\s+sign\s*=\s*['"]([^'"]+)['"];/);
                const userIdInFetchedPageMatch = pageHtml.match(/var\s+user_id\s*=\s*['"]([^'"]+)['"];/) || pageHtml.match(/var\s+user_id2\s*=\s*['"]([^'"]+)['"];/);
                const effective_user_id = (userIdInFetchedPageMatch && userIdInFetchedPageMatch[1]) ? userIdInFetchedPageMatch[1] : user_id_on_page;

                if (timeStampMatch && timeStampMatch[1] && signMatch && signMatch[1]) {
                    timeStamp = timeStampMatch[1];
                    sign = signMatch[1];
                    console.log(`[批量完成脚本]   成功提取参数: timeStamp=${timeStamp}, sign=${sign}`);

                    const saveUrl = `http://www.cmechina.net:80/qypx/bj/saveStudy3.jsp?course_id=${item.course_id}&cware_id=${item.courseware_id}&userid=${effective_user_id}&timeStamp=${timeStamp}&sign=${sign}&t=${new Date().getTime()}`;

                    console.log(`[批量完成脚本]   正在调用完成接口: ${saveUrl}`);
                    item.status_element ? (item.status_element.textContent = '处理中...', item.status_element.style.color = 'orange') : null;

                    try {
                        const saveResponse = await fetch(saveUrl);
                        const saveData = await saveResponse.json();

                        if (saveResponse.ok && saveData && saveData.state == 1) {
                            console.log(`[批量完成脚本]   成功: ${item.name} 已标记为完成。服务器响应:`, saveData);
                            completedCount++;
                            if (see_key_on_page && typeof localStorage !== 'undefined') {
                                localStorage.setItem(see_key_on_page, '1');
                            }
                            if (item.status_element) {
                                item.status_element.textContent = '已完成';
                                item.status_element.style.color = 'green';
                            }
                        } else {
                            console.error(`[批量完成脚本]   失败: ${item.name} 标记完成时出错。服务器响应:`, saveData);
                            item.status_element ? (item.status_element.textContent = '标记失败', item.status_element.style.color = 'red') : null;
                        }
                    } catch (e_save) {
                        console.error(`[批量完成脚本]   调用完成接口时发生网络错误 (${item.name}):`, e_save);
                        item.status_element ? (item.status_element.textContent = '网络错误', item.status_element.style.color = 'red') : null;
                    }
                } else {
                    console.error(`[批量完成脚本]   错误: 未能从 ${item.name} 的页面内容中提取 timeStamp 或 sign。`);
                    if (!timeStampMatch) console.error("[批量完成脚本]     缺少 timeStamp。");
                    if (!signMatch) console.error("[批量完成脚本]     缺少 sign。");
                    item.status_element ? (item.status_element.textContent = '参数提取失败', item.status_element.style.color = 'red') : null;
                }
            } catch (error) {
                console.error(`[批量完成脚本]   处理课件 ${item.name} 时发生异常:`, error);
                item.status_element ? (item.status_element.textContent = '异常', item.status_element.style.color = 'red') : null;
            }

            await new Promise(resolve => setTimeout(resolve, 1500));
        }

        console.log(`[批量完成脚本] 处理完成。总共 ${coursewareItems.length} 个课件，成功标记 ${completedCount} 个。`);
        alert(`批量处理完成！成功标记 ${completedCount} / ${coursewareItems.length} 个课件。\n请刷新页面查看最终状态或检查控制台获取详细日志。`);
    }

    function scanForPendingExamsAndDisplay() {
        console.log("[Manual Exam Navigator] Scanning for pending exams...");

        if (!window.location.pathname.includes('study2.jsp')) {
            alert("错误：此脚本应在 study2.jsp (课程列表/视频播放) 页面运行。");
            console.error("[Manual Exam Navigator] Not on study2.jsp page. Aborting.");
            return;
        }

        const courseListElement = document.getElementById('s_r_ml');
        if (!courseListElement) {
            alert("错误: 未找到课程目录元素 (#s_r_ml)。");
            console.error("[Manual Exam Navigator] Course list element #s_r_ml not found.");
            return;
        }

        const pendingStatusKeywords = ["未学习", "待考试", "未完成", "去学习"];

        let templateProductId = null;
        let templateType = "7";
        const mainCourseId = new URLSearchParams(window.location.search).get('course_id');

        if (typeof gotoExam === 'function') {
            const gotoExamStr = gotoExam.toString();
            const productIdMatch = gotoExamStr.match(/product_id=([^&"'"]+)/);
            const typeMatch = gotoExamStr.match(/type=([^&"'"]+)/);
            if (productIdMatch && productIdMatch[1]) templateProductId = productIdMatch[1];
            if (typeMatch && typeMatch[1]) templateType = typeMatch[1];
            console.log(`[Manual Exam Navigator] From gotoExam(): templateProductId=${templateProductId}, templateType=${templateType}`);
        } else if (mainCourseId) {
            templateProductId = mainCourseId;
        }

        if (!templateProductId || !mainCourseId) {
            alert("错误：无法确定必要参数（course_id/product_id），请确认已正确加载 study2.jsp 页面。");
            return;
        }

        const pendingExams = [];
        const courseItems = courseListElement.querySelectorAll('li');
        console.log(`[Manual Exam Navigator] Found ${courseItems.length} course items.`);

        courseItems.forEach((item, index) => {
            const linkElement = item.querySelector('a[onclick*="kjJumpTo"]');
            const statusElement = item.querySelector('i');

            if (linkElement && statusElement) {
                const statusText = statusElement.textContent.trim();
                const isPending = pendingStatusKeywords.some(keyword => statusText.includes(keyword));

                if (isPending) {
                    const onclickAttr = linkElement.getAttribute('onclick');
                    const studyLinkMatches = onclickAttr.match(/kjJumpTo\s*\(\s*['"]study2\.jsp\?course_id=([^&]+)&courseware_id=([^'\s"]+)['"]\s*,\s*['"]([^'\s"]+)['"]/);
                    if (studyLinkMatches && studyLinkMatches.length >= 4) {
                        const courseware_id_val = studyLinkMatches[2];
                        const coursewareName = studyLinkMatches[3] || linkElement.textContent.replace(/第..节/, '').trim();
                        const examUrl = `exam.jsp?course_id=${mainCourseId}&paper_id=${courseware_id_val}&type=${templateType}&product_id=${templateProductId}`;
                        pendingExams.push({
                            name: coursewareName,
                            url: examUrl,
                            originalStatus: statusText
                        });
                        console.log(`[Manual Exam Navigator] Pending: "${coursewareName}" - ${examUrl}`);
                    }
                }
            }
        });

        // 创建显示区域
        let displayDiv = document.getElementById('manualExamNavigatorDiv');
        if (displayDiv) displayDiv.remove();

        displayDiv = document.createElement('div');
        displayDiv.id = 'manualExamNavigatorDiv';
        displayDiv.style.cssText = `
            position: fixed; top: 10px; left: 10px; right: 10px; max-width: 700px; margin: auto;
            background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 15px 20px;
            z-index: 10000; box-shadow: 0 5px 15px rgba(0,0,0,0.15); font-family: sans-serif;
        `;

        let htmlContent = `<h3 style="margin-top:0; margin-bottom:15px; color:#007bff;">📖 待处理考试列表 (${pendingExams.length})</h3>`;

        if (pendingExams.length > 0) {
            htmlContent += `<ul style="list-style-type:none; padding:0; max-height: 300px; overflow-y:auto;">`;
            pendingExams.forEach((exam, i) => {
                htmlContent += `
                    <li style="padding: 8px 0; border-bottom: 1px dotted #e9ecef; display:flex; justify-content:space-between; align-items:center;">
                        <span style="color:#343a40;">${i + 1}. ${exam.name} <small>(${exam.originalStatus})</small></span>
                        <button onclick="window.open('${exam.url}', '_blank')" style="padding: 5px 12px; background-color:#28a745; color:white; border:none; border-radius:4px; cursor:pointer; font-size:13px;">
                            开始此考试
                        </button>
                    </li>`;
            });
            htmlContent += `</ul>`;
        } else {
            htmlContent += `<p style="color:#6c757d;">未检测到任何待考试内容。</p>`;
        }

        htmlContent += `
            <button onclick="document.getElementById('manualExamNavigatorDiv').remove();"
                style="position:absolute; top:10px; right:10px; background:transparent; border:none; font-size:20px; cursor:pointer; color:#6c757d;">
                &times;
            </button>`;

        displayDiv.innerHTML = htmlContent;
        document.body.insertBefore(displayDiv, document.body.firstChild);

        // 自动打开所有考试页面（限10个）
        const maxAutoOpen = 10;
        if (pendingExams.length > 0) {
            const openCount = Math.min(pendingExams.length, maxAutoOpen);
            for (let i = 0; i < openCount; i++) {
                setTimeout(() => {
                    try {
                        window.open(pendingExams[i].url, '_blank');
                        console.log(`[Auto Open] Opened: ${pendingExams[i].name}`);
                    } catch (err) {
                        console.warn(`[Auto Open] 浏览器拦截了弹窗：${pendingExams[i].url}`);
                    }
                }, i * 500); // 每隔0.5秒打开一个，减少被拦截概率
            }
            alert(`发现 ${pendingExams.length} 个待考试项目，已自动打开前 ${openCount} 个考试页面。\n如有剩余，请手动点击页面上按钮打开。`);
        } else {
            alert("扫描完毕，未发现待考试的条目。");
        }
    }

    // 考试答题脚本实现
async function automateExamWithDeepSeekSingleCall(autoSubmit = false) {
        const KNOWLEDGE_BASE_KEY = 'examKnowledgeBase_v2';
        const PENDING_FEEDBACK_KEY = 'examPendingFeedback_v2';

    // -------------------------------------------------------------------------
    // 用户配置区域 - 【【【【请务必在此处填入您的DeepSeek API密钥】】】】
    // -------------------------------------------------------------------------
    const DEEPSEEK_API_KEY = "sk-95f1b6a3ce324bf78c27a818f7817b82"; // 示例密钥，请替换
    // -------------------------------------------------------------------------
        // 用户配置区域 - 【【【【自动反馈和重试的CSS选择器 - 根据 examQuizFa-xxx.jsp 推断】】】】
        // !! 以下选择器基于您提供的 examQuizFa-xxx.jsp 文件。如果其他结果页结构不同，可能需要调整 !!
    // -------------------------------------------------------------------------
    const AUTO_FEEDBACK_CONFIG = {
            // 1. 详细结果页面指示器:
            RESULTS_PAGE_INDICATOR: "div.show_page_tit", // 包含 "考试结果" 标题的容器

            // 2. 题目结果条目选择器 (在详细结果页上):
            QUESTION_ITEM_SELECTOR: "li.answer_list",

            // 3. 题目文本选择器 (在详细结果页的题目条目内):
            QUESTION_TEXT_SELECTOR_ON_RESULT: "h3", // 将提取 h3 的主要文本，需处理掉"您的答案"

            // 4. 正确指示器 (在详细结果页的题目条目内):
            CORRECT_INDICATOR_SELECTOR: "h3.dui",

            // 5. 错误指示器 (在详细结果页的题目条目内):
            INCORRECT_INDICATOR_SELECTOR: "h3.cuo",

            // 6. "重新答题"按钮选择器 (在详细结果页上):
            RETRY_BUTTON_SELECTOR: "a#cxdt" // ID 为 cxdt 的重新答题链接
        };

    function loadData(key) {
        const stored = localStorage.getItem(key);
        try {
            return stored ? JSON.parse(stored) : null;
        } catch (e) {
            console.error(`从localStorage解析 ${key} 时出错:`, e);
            return null;
        }
    }

    function saveData(key, data) {
         try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error(`保存 ${key} 到localStorage时出错:`, e);
        }
    }

    function clearData(key) { localStorage.removeItem(key); }

    let knowledgeBase = loadData(KNOWLEDGE_BASE_KEY) || {};

    function createStatusDisplay() {
        let statusDiv = document.getElementById('autoExamStatusDiv');
        if (!statusDiv) {
            statusDiv = document.createElement('div');
            statusDiv.id = 'autoExamStatusDiv';
            statusDiv.style.position = 'fixed'; statusDiv.style.top = '150px'; statusDiv.style.left = '10px';
            statusDiv.style.padding = '10px'; statusDiv.style.background = 'rgba(255, 255, 224, 0.9)';
            statusDiv.style.border = '1px solid #F0AD4E'; statusDiv.style.borderRadius = '5px';
            statusDiv.style.zIndex = '10001'; statusDiv.style.fontFamily = 'Arial, sans-serif';
            statusDiv.style.fontSize = '13px'; statusDiv.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
                statusDiv.innerHTML = `<h5 style="margin-top:0; margin-bottom:8px; border-bottom:1px solid #ddd; padding-bottom:5px;">自动化考试状态 (v2.5 - 自动结果解析)</h5>
                                   <div id="overallStatus" style="font-weight:bold; margin-bottom:5px;">等待开始...</div>
                                   <ul id="questionStatusList" style="list-style-type: none; padding-left: 0; margin-bottom:0; max-height: 250px; overflow-y: auto; font-size:12px;"></ul>
                                   <button id="clearKnowledgeBaseBtn" style="font-size:10px; padding: 2px 5px; margin-top:5px;">清除全部记忆</button>`;
                const formElement = document.querySelector('form[name="form1"]');
            const targetParent = formElement ? formElement.parentElement : (document.body.firstChild ? document.body.firstChild.parentElement : document.body);
                 if (targetParent.firstChild) targetParent.insertBefore(statusDiv, targetParent.firstChild);
                 else targetParent.appendChild(statusDiv);

            document.getElementById('clearKnowledgeBaseBtn').addEventListener('click', () => {
                if (confirm("确定要清除此考试的所有已存答案、错误尝试和待反馈记录吗？")) {
                    clearData(KNOWLEDGE_BASE_KEY); clearData(PENDING_FEEDBACK_KEY);
                    knowledgeBase = {};
                    updateOverallStatus("所有记忆已清除。请重新运行脚本以开始新的尝试。");
                }
            });
        }
        return statusDiv;
    }

    function updateOverallStatus(message, isError = false) {
        createStatusDisplay();
        const overallStatusElem = document.getElementById('overallStatus');
        if (overallStatusElem) overallStatusElem.textContent = message;
        if(isError) console.error(`[总体状态] ${message}`); else console.log(`[总体状态] ${message}`);
    }

    function updateQuestionStatus(questionNumberOrId, message, isError = false, source = "") {
        createStatusDisplay();
        const list = document.getElementById('questionStatusList');
        if (!list) return;
            const statusId = `qStatus-${questionNumberOrId}`;
        let item = document.getElementById(statusId);
        if (!item) {
            item = document.createElement('li'); item.id = statusId;
            item.style.padding = '2px 0'; item.style.borderBottom = '1px dotted #eee';
            list.insertBefore(item, list.firstChild);
        }
        item.textContent = `${source ? '['+source+'] ' : ''}${message}`; item.style.color = isError ? 'red' : (source === 'KB' ? 'blue' : (source === 'AI' ? 'green' : (source === 'User' || source === 'AutoResult' ? 'purple' : 'inherit')));
        const consoleMsg = typeof questionNumberOrId === 'number' ? `[题目 ${questionNumberOrId} 状态]` : `[问题 ${questionNumberOrId} 状态]`;
        if(isError) console.error(`${consoleMsg} ${message}`); else console.log(`${consoleMsg} ${message}`);
    }

    function extractExamQuestions() {
            updateOverallStatus("正在从页面提取考题...");
        const examData = [];
            if (typeof form1 === 'undefined' || typeof form1.ques_list === 'undefined') {
                updateOverallStatus("提示: 未找到考试表单 (form1)，可能不是答题页或页面结构已改变。", false); return null;
            }
            const examListItems = document.querySelectorAll('form[name="form1"] ul.exam_list li');
            if (!examListItems || examListItems.length === 0) {
                updateOverallStatus("警告: 在答题页未找到任何题目列表项。", true); return [];
            }
            examListItems.forEach((li, index) => {
                const questionElement = li.querySelector('h3.name');
                if (!questionElement) return;

                const isMultipleChoice = questionElement.querySelector('span[style*="color:red"]') !== null || questionElement.textContent.includes("【多选】");
                const questionType = isMultipleChoice ? 'multiple' : 'single';

                let questionText = questionElement.textContent.trim().replace(/^【.*?】\d+\.\s*/, '').trim();
            const questionData = {
                qNumDisplay: index + 1,
                questionText: questionText,
                options: [],
                    questionIdFromInputName: null,
                    questionType: questionType
                };

                const optionParagraphs = li.querySelectorAll('p');
                optionParagraphs.forEach(p => {
                    const inputElement = p.querySelector('input[type="radio"], input[type="checkbox"]');
                    if (inputElement) {
                        const optionValue = inputElement.value.toUpperCase();
                        const optionTextContent = p.textContent.trim().replace(/^[A-Z]:\s*/, '').trim();
                        questionData.options.push({ value: optionValue, text: optionTextContent });
                        if (!questionData.questionIdFromInputName) {
                            const nameAttr = inputElement.getAttribute('name');
                            if (nameAttr && nameAttr.startsWith('ques_')) questionData.questionIdFromInputName = nameAttr.substring(5);
                    }
                }
            });

                if (questionData.options.length > 0 && questionData.questionIdFromInputName) {
                examData.push(questionData);
                    updateQuestionStatus(index + 1, `第 ${index + 1} 题 (${questionType}): ${questionText.substring(0,30)}... 已提取`);
            } else {
                    updateQuestionStatus(index + 1, `第 ${index + 1} 题: 提取选项或ID失败。`, true);
                }
            });
            if (examData.length > 0) updateOverallStatus(`成功提取 ${examData.length} 道题目。`);
            else updateOverallStatus("未能成功提取任何题目数据。", true);
        return examData;
    }

    function fillExamAnswers(answersArray) {
            updateOverallStatus("正在将答案填入考卷...");
        if (!Array.isArray(answersArray) || answersArray.length === 0) {
            updateOverallStatus("错误: 答案数组无效或为空，无法填写。", true); return false;
        }
        let allSuccessfullyFilled = true;
        answersArray.forEach((ans, index) => {
            const qNum = ans.qNumDisplay || (index + 1);
            if (!ans.questionIdFromInputName || !ans.chosenAnswer) {
                    updateQuestionStatus(qNum, `第 ${qNum} 题的答案数据不完整或未提供答案，跳过填写。`, true, ans.source);
                 allSuccessfullyFilled = false; return;
            }

                const inputGroupName = "ques_" + ans.questionIdFromInputName;
                const inputs = document.getElementsByName(inputGroupName); // Radio or Checkbox
                let foundAndFilledCount = 0;

                if (inputs && inputs.length > 0) {
                    if (ans.questionType === 'multiple') {
                        // Ensure chosenAnswer is an array for multiple choice
                        const chosenAnswersArray = Array.isArray(ans.chosenAnswer) ? ans.chosenAnswer : [ans.chosenAnswer];
                        for (let i = 0; i < inputs.length; i++) {
                            if (inputs[i].type === 'checkbox') {
                                if (chosenAnswersArray.includes(inputs[i].value.toUpperCase())) {
                                    inputs[i].checked = true;
                                    foundAndFilledCount++;
                                } else {
                                    inputs[i].checked = false; // Uncheck if not in chosen answers
                                }
                            }
                        }
                        if (foundAndFilledCount === chosenAnswersArray.length) {
                            updateQuestionStatus(qNum, `第 ${qNum} 题 (多选): 已选 [${chosenAnswersArray.join(',')}]`, false, ans.source);
                        } else {
                             updateQuestionStatus(qNum, `第 ${qNum} 题 (多选): 尝试选择 [${chosenAnswersArray.join(',')}]，实际勾选 ${foundAndFilledCount} 个。可能选项不匹配。`, true, ans.source);
                             allSuccessfullyFilled = false;
                        }

                    } else { // Single choice (radio)
                        let foundAndChecked = false;
                        for (let i = 0; i < inputs.length; i++) {
                            if (inputs[i].type === 'radio' && inputs[i].value.toUpperCase() === ans.chosenAnswer.toUpperCase()) {
                                inputs[i].checked = true;
                                updateQuestionStatus(qNum, `第 ${qNum} 题 (单选): 已选 ${ans.chosenAnswer}`, false, ans.source);
                                foundAndChecked = true;
                                foundAndFilledCount++;
                                break;
                            }
                        }
                if (!foundAndChecked) {
                            updateQuestionStatus(qNum, `第 ${qNum} 题 (单选): 未找到选项 '${ans.chosenAnswer}' 来填写。`, true, ans.source);
                    allSuccessfullyFilled = false;
                        }
                }
            } else {
                    updateQuestionStatus(qNum, `第 ${qNum} 题: 未找到选项组 (Name: ${inputGroupName})。`, true, ans.source);
                allSuccessfullyFilled = false;
            }
        });
            if(allSuccessfullyFilled) updateOverallStatus("所有决策的答案已尝试填入。");
            else updateOverallStatus("部分答案填写时遇到问题，请检查状态列表。", true);
        return allSuccessfullyFilled;
    }

        const SYSTEM_PROMPT_FOR_BATCH_ANSWERS = `你是一个专门解答单项选择题和多项选择题的助手。接下来会提供一个包含多个问题的列表，每个问题都有其选项。
请仔细阅读每个问题和选项。
你的任务是为每个问题选择最正确的答案。
请按照以下JSON格式返回所有答案，确保是一个包含对象的有效JSON数组。每个对象代表一道题的答案，包含：
- 'questionNumber': (与输入问题列表中的显示题号 qNumDisplay 一致)
- 'answerLetter': 对于单选题，这是单个大写字母 (A, B, C, D, 或 E)。对于多选题，这是一个包含所选大写字母的数组 (例如: ["A", "C"])。

例如，如果输入有3道题 (第1题单选，第2题多选，第3题单选)，你的输出应该是这样的格式：
[
  {"questionNumber": 1, "answerLetter": "A"},
  {"questionNumber": 2, "answerLetter": ["B", "D"]},
  {"questionNumber": 3, "answerLetter": "C"}
]
确保只返回这个JSON数组，不要包含任何其他解释、介绍或总结性文字。如果对某道题不确定，请也尽力选择一个最可能的答案。对于多选题，如果需要选择多个选项，请确保 'answerLetter' 是一个数组。`;

    async function getBatchAnswersFromDeepSeek(questionsForAI, apiKey) {
         if (!questionsForAI || questionsForAI.length === 0) {
            updateOverallStatus("没有需要从 DeepSeek 获取答案的题目。");
            return [];
        }
        updateOverallStatus(`正在为 ${questionsForAI.length} 道新题/待重试题构建请求...`);
            let userBatchPrompt = "请为以下所有问题提供答案，严格按照JSON数组格式返回，包含 'questionNumber' 和 'answerLetter' (单选为字符串，多选为字符串数组)：\n\n";
        questionsForAI.forEach((qData) => {
                userBatchPrompt += `问题 ${qData.qNumDisplay} (${qData.questionType === 'multiple' ? '多选题' : '单选题'}): ${qData.questionText}\n`;
                const qInfo = knowledgeBase[qData.questionText];
                const attemptedIncorrect = qInfo?.incorrectAttempts || [];
                if (attemptedIncorrect.length > 0) {
                    let incorrectAttemptsStr = "";
                    if (qData.questionType === 'multiple') {
                        incorrectAttemptsStr = attemptedIncorrect.map(arr => `[${arr.join(',')}]`).join('; ');
                        // Log for multi-choice question if there are known incorrect attempts
                        console.log(`[AI Prompt Debug - Q#${qData.qNumDisplay} Multi-Choice] Known incorrect combinations sent to AI: ${incorrectAttemptsStr}`);
                    } else {
                        incorrectAttemptsStr = attemptedIncorrect.join(', ');
                    }
                    userBatchPrompt += `(重要提示: 对于此题，以下答案组合已被证实是错误的，请务必选择其他组合: ${incorrectAttemptsStr})\n`;
                }
                qData.options.forEach(opt => {
                    userBatchPrompt += `${opt.value}: ${opt.text}\n`;
                });
                userBatchPrompt += "\n";
            });

            // Log the full user prompt before sending if needed for comprehensive debugging
            // console.log("[AI Prompt Debug - Full User Prompt To DeepSeek]:\n", userBatchPrompt);

            const messages = [
            { "role": "system", "content": SYSTEM_PROMPT_FOR_BATCH_ANSWERS },
            { "role": "user", "content": userBatchPrompt }
        ];

        updateOverallStatus(`正在向 DeepSeek 发送包含 ${questionsForAI.length} 道题的请求...`);
        try {
            const response = await fetch("https://api.deepseek.com/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
                    body: JSON.stringify({ model: "deepseek-chat", messages: messages, stream: false, temperature: 0.1 })
            });

            if (!response.ok) {
                const errorBody = await response.text();
                updateOverallStatus(`DeepSeek API错误 ${response.status}. ${errorBody.substring(0,150)}`, true);
                throw new Error(`Batch API request failed with status ${response.status}: ${errorBody}`);
            }

            const data = await response.json();
            if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
                const llmResponseContent = data.choices[0].message.content.trim();
                updateOverallStatus("已收到DeepSeek的批量回复，尝试解析...");
                console.log("[DeepSeek 原始批量回复]:", llmResponseContent);
                try {
                    const jsonMatch = llmResponseContent.match(/(\[[\s\S]*\])/);
                    let parsedAnswersByLLM;
                    if (jsonMatch && jsonMatch[1]) {
                        parsedAnswersByLLM = JSON.parse(jsonMatch[1]);
                    } else {
                        parsedAnswersByLLM = JSON.parse(llmResponseContent);
                    }

                        // Enhanced validation for answerLetter
                        const isValidLLMResponse = Array.isArray(parsedAnswersByLLM) && parsedAnswersByLLM.every(ans =>
                            typeof ans.questionNumber === 'number' &&
                            (
                                (typeof ans.answerLetter === 'string' && /^[A-Z]$/.test(ans.answerLetter.toUpperCase())) || // Single choice
                                (Array.isArray(ans.answerLetter) && ans.answerLetter.length > 0 && ans.answerLetter.every(l => typeof l === 'string' && /^[A-Z]$/.test(l.toUpperCase()))) // Multiple choice
                            )
                        );

                        if (isValidLLMResponse) {
                        updateOverallStatus(`成功解析 ${parsedAnswersByLLM.length} 个来自LLM的答案。`);
                        const processedAIAnswers = [];
                        parsedAnswersByLLM.forEach(llmAns => {
                            const originalQuestion = questionsForAI.find(q => q.qNumDisplay === llmAns.questionNumber);
                            if (originalQuestion) {
                                    let finalChoice = originalQuestion.questionType === 'multiple'
                                        ? llmAns.answerLetter.map(l => l.toUpperCase()).sort()
                                        : llmAns.answerLetter.toUpperCase();

                                const qInfo = knowledgeBase[originalQuestion.questionText];
                                    const attemptedIncorrect = qInfo?.incorrectAttempts || []; // Array of strings for single, array of arrays of strings for multiple

                                    let currentChoiceIsKnownIncorrect = false;
                                    if (originalQuestion.questionType === 'multiple') {
                                        // For multiple choice, check if the sorted combination is in incorrectAttempts
                                        currentChoiceIsKnownIncorrect = attemptedIncorrect.some(incorrectArr =>
                                            JSON.stringify(incorrectArr.sort()) === JSON.stringify(finalChoice)
                                        );
                                    } else {
                                        // For single choice
                                        currentChoiceIsKnownIncorrect = attemptedIncorrect.includes(finalChoice);
                                    }

                                    if (currentChoiceIsKnownIncorrect) {
                                        updateQuestionStatus(originalQuestion.qNumDisplay, `第 ${originalQuestion.qNumDisplay} 题: AI建议 (${originalQuestion.questionType === 'multiple' ? `[${finalChoice.join(',')}]` : finalChoice}) 已知错误。尝试选择其他选项...`, true, "AI/KB");

                                        if (originalQuestion.questionType === 'single') {
                                            const availableOptions = originalQuestion.options
                                                .map(opt => opt.value.toUpperCase())
                                                .filter(optVal => !attemptedIncorrect.includes(optVal));

                                    if (availableOptions.length > 0) {
                                                finalChoice = availableOptions[Math.floor(Math.random() * availableOptions.length)];
                                                updateQuestionStatus(originalQuestion.qNumDisplay, `第 ${originalQuestion.qNumDisplay} 题: 更换为未尝试过的选项 ${finalChoice}。`, false, "KB Logic");
                                    } else {
                                                updateQuestionStatus(originalQuestion.qNumDisplay, `第 ${originalQuestion.qNumDisplay} 题: 所有选项都已尝试过，仍使用AI建议。`, true, "AI/KB");
                                            }
                                        } else { // Multiple choice fallback
                                            const k = finalChoice.length;
                                            const allOptionValues = originalQuestion.options.map(opt => opt.value.toUpperCase());
                                            let foundNewCombination = false;
                                            const maxFallbackAttempts = 10; // <--- 在这里修改，比如从 5 改为 10

                                            if (allOptionValues.length >= k) { // Ensure there are enough options to pick from
                                                for (let attempt = 0; attempt < maxFallbackAttempts; attempt++) {
                                                    // Generate random combination
                                                    const shuffledOptions = [...allOptionValues].sort(() => 0.5 - Math.random());
                                                    const newTempCombination = shuffledOptions.slice(0, k).sort();

                                                    // Check if this new combination is also known to be incorrect
                                                    const isNewCombinationBad = attemptedIncorrect.some(incorrectArr =>
                                                        JSON.stringify(incorrectArr.sort()) === JSON.stringify(newTempCombination)
                                                    );

                                                    if (!isNewCombinationBad) {
                                                        finalChoice = newTempCombination; // Found a new, hopefully better, choice
                                                        foundNewCombination = true;
                                                        updateQuestionStatus(originalQuestion.qNumDisplay, `第 ${originalQuestion.qNumDisplay} 题 (多选): AI原建议已知错误。更换为随机组合 [${finalChoice.join(',')}]。`, false, "KB Logic");
                                                        break;
                                                    }
                                                }
                                            }

                                            if (!foundNewCombination) {
                                                updateQuestionStatus(originalQuestion.qNumDisplay, `第 ${originalQuestion.qNumDisplay} 题 (多选): AI建议组合已知错误，且未能找到新的有效随机组合。仍使用AI原建议 [${finalChoice.join(',')}]。`, true, "AI/KB");
                                            }
                                    }
                                }

                                processedAIAnswers.push({
                                        ...originalQuestion, // Includes questionType
                                        chosenAnswer: finalChoice, // string for single, array for multiple
                                    source: "AI"
                                });
                                    updateQuestionStatus(originalQuestion.qNumDisplay, `第 ${originalQuestion.qNumDisplay} 题: AI 处理后选定 ${originalQuestion.questionType === 'multiple' ? `[${finalChoice.join(',')}]` : finalChoice}`, false, "AI");
                            } else {
                                updateQuestionStatus(llmAns.questionNumber, `第 ${llmAns.questionNumber} 题: LLM提供了答案，但未在原始提取问题中找到对应题号。`, true, "AI");
                            }
                        });
                        return processedAIAnswers;
                    } else {
                            updateOverallStatus("DeepSeek 返回的JSON格式不正确或内容不符合预期 (多选答案应为数组)。", true);
                        console.error("Parsed LLM response is not a valid answer array:", parsedAnswersByLLM);
                        return [];
                    }
                } catch (e) {
                    updateOverallStatus("解析DeepSeek返回的JSON时出错。请检查控制台中的原始回复。", true);
                    console.error("Error parsing LLM JSON response:", e);
                    console.error("LLM Original Content that failed parsing:", llmResponseContent);
                    return [];
                }
            } else {
                updateOverallStatus("DeepSeek 返回数据结构异常 (choices或message缺失)。", true);
                console.error("DeepSeek API batch response structure error:", data);
                return [];
            }
        } catch (error) {
            updateOverallStatus("调用 DeepSeek API (批量) 时发生网络或未知错误。", true);
            console.error("Error calling DeepSeek API (batch):", error);
                throw error; // Rethrow to be caught by mainExecution
        }
    }

    async function tryAutoParseResultsPage(pendingData) {
            updateOverallStatus("尝试自动解析考试结果页面...");
        const config = AUTO_FEEDBACK_CONFIG;
            const { answersFilledInLastAttempt } = pendingData; // This now contains questionType

            if (window.location.pathname.includes('examQuizFail.jsp')) {
                updateOverallStatus("检测到考试失败页面，尝试从URL参数解析错误答案...");
                const urlParams = new URLSearchParams(window.location.search);
                const errorQuesParam = urlParams.get('error_ques');
                const errorOrderParam = urlParams.get('error_order');
                const errorQuesIds = errorQuesParam ? errorQuesParam.split(',').filter(id => id.trim() !== '') : [];
                const errorOrderNumbers = errorOrderParam ? errorOrderParam.split(',').filter(num => num.trim() !== '') : [];

                if (answersFilledInLastAttempt && answersFilledInLastAttempt.length > 0) {
                    let updatesMadeByUrlParams = 0;
                    let explicitlyMarkedCorrectByUrl = 0;
                    let explicitlyMarkedIncorrectByUrl = 0;

                    answersFilledInLastAttempt.forEach((ans, index) => {
                        const qTextForKB = ans.questionText;
                        // chosenAnswer is string for single, array for multiple (already sorted if from AI)
                        const chosenAnswer = ans.questionType === 'multiple' && Array.isArray(ans.chosenAnswer)
                                            ? ans.chosenAnswer.sort()
                                            : ans.chosenAnswer;
                        const questionId = ans.questionIdFromInputName;

                        if (!knowledgeBase[qTextForKB]) {
                            knowledgeBase[qTextForKB] = { incorrectAttempts: [] };
                        }
                        if (!knowledgeBase[qTextForKB].incorrectAttempts) knowledgeBase[qTextForKB].incorrectAttempts = [];


                        let isErrorBasedOnUrl = false;
                        if (questionId && errorQuesIds.length > 0 && errorQuesIds.includes(questionId)) {
                            isErrorBasedOnUrl = true;
                        } else if (errorOrderNumbers.length > 0 && errorOrderNumbers.includes((ans.qNumDisplay).toString())) { // Use qNumDisplay from pending data
                            isErrorBasedOnUrl = true;
                        }

                        const displayChosenAns = ans.questionType === 'multiple' ? `[${chosenAnswer.join(',')}]` : chosenAnswer;

                        if (errorQuesIds.length > 0 || errorOrderNumbers.length > 0) {
                            if (isErrorBasedOnUrl) {
                                if (ans.questionType === 'multiple') {
                                    // Add array of answers if not already present
                                    if (!knowledgeBase[qTextForKB].incorrectAttempts.some(arr => JSON.stringify(arr.sort()) === JSON.stringify(chosenAnswer))) {
                                        knowledgeBase[qTextForKB].incorrectAttempts.push(chosenAnswer);
                                    }
                                } else { // Single choice
                                    if (!knowledgeBase[qTextForKB].incorrectAttempts.includes(chosenAnswer)) {
                                        knowledgeBase[qTextForKB].incorrectAttempts.push(chosenAnswer);
                                    }
                                }
                                knowledgeBase[qTextForKB].knownCorrectAnswer = null; // Clear any known correct
                                updateQuestionStatus(ans.qNumDisplay, `"${qTextForKB.substring(0,15)}..." (选${displayChosenAns}) 据URL标记为错误。`, true, "AutoResult-URL");
                                updatesMadeByUrlParams++;
                                explicitlyMarkedIncorrectByUrl++;
                            } else {
                                // If error params are present, and this question is NOT in the error list, it's correct.
                                knowledgeBase[qTextForKB].knownCorrectAnswer = chosenAnswer; // Store string or array
                                if (ans.questionType === 'multiple') {
                                    knowledgeBase[qTextForKB].incorrectAttempts = knowledgeBase[qTextForKB].incorrectAttempts.filter(
                                        arr => JSON.stringify(arr.sort()) !== JSON.stringify(chosenAnswer)
                                    );
                                } else {
                                    knowledgeBase[qTextForKB].incorrectAttempts = knowledgeBase[qTextForKB].incorrectAttempts.filter(ia => ia !== chosenAnswer);
                                }
                                updateQuestionStatus(ans.qNumDisplay, `"${qTextForKB.substring(0,15)}..." (选${displayChosenAns}) 据URL标记为正确。`, false, "AutoResult-URL");
                                updatesMadeByUrlParams++;
                                explicitlyMarkedCorrectByUrl++;
                            }
                        }
                    });

                    if (updatesMadeByUrlParams > 0) {
                        saveData(KNOWLEDGE_BASE_KEY, knowledgeBase);
                        updateOverallStatus(`已从失败页面URL参数更新 ${updatesMadeByUrlParams} 条题目记忆。`);
                        const allCorrectAfterUrlParse = explicitlyMarkedIncorrectByUrl === 0 && (explicitlyMarkedCorrectByUrl > 0 || answersFilledInLastAttempt.length === explicitlyMarkedCorrectByUrl);
                        return { success: true, allCorrect: allCorrectAfterUrlParse, updatesMade: true, reason: "已处理失败页面URL参数。" };
                    } else if (errorQuesParam !== null || errorOrderParam !== null) {
                         updateOverallStatus("失败页面URL参数存在但未匹配任何已作答题目。尝试通用页面解析。");
                    } else {
                        updateOverallStatus("失败页面URL未包含错误参数。尝试通用页面解析。");
                    }
                } else {
                     updateOverallStatus("失败页面URL解析：无上次作答记录。尝试通用页面解析。");
                }
            }

            const is100PercentPassPage = document.querySelector('div.show_exam div.box img[src="images/jiangbei.jpg"]') ||
                                      (window.location.pathname.endsWith("examQuizPass.jsp") && window.location.search.includes("rightRate=100"));

            if (is100PercentPassPage) {
                updateOverallStatus("检测到: 考试已100%通过的祝贺页面。");
                if (!answersFilledInLastAttempt || answersFilledInLastAttempt.length === 0) {
                    return { success: true, allCorrect: true, updatesMade: false, reason: "100% pass page, 但无待反馈答案。" };
                }
                let updatesMade = 0;
                 for (const ans of answersFilledInLastAttempt) {
                    const qTextForKB = ans.questionText;
                    const chosenAnswer = ans.questionType === 'multiple' && Array.isArray(ans.chosenAnswer)
                                        ? ans.chosenAnswer.sort()
                                        : ans.chosenAnswer; // string or sorted array
                    const displayChosenAns = ans.questionType === 'multiple' ? `[${chosenAnswer.join(',')}]` : chosenAnswer;

                    if (!knowledgeBase[qTextForKB]) knowledgeBase[qTextForKB] = { incorrectAttempts: [] };

                    knowledgeBase[qTextForKB].knownCorrectAnswer = chosenAnswer;
                    if (ans.questionType === 'multiple') {
                        knowledgeBase[qTextForKB].incorrectAttempts = (knowledgeBase[qTextForKB].incorrectAttempts || []).filter(
                            arr => JSON.stringify(arr.sort()) !== JSON.stringify(chosenAnswer)
                        );
                    } else {
                        knowledgeBase[qTextForKB].incorrectAttempts = (knowledgeBase[qTextForKB].incorrectAttempts || []).filter(ia => ia !== chosenAnswer);
                    }
                    updateQuestionStatus(ans.qNumDisplay, `"${qTextForKB.substring(0,15)}..." (选${displayChosenAns}) 确认为正确 (100%通过)。`, false, "AutoResult");
                        updatesMade++;
                    }
                if (updatesMade > 0) saveData(KNOWLEDGE_BASE_KEY, knowledgeBase);

                return { success: true, allCorrect: true, updatesMade: updatesMade > 0, reason: "已处理100%通过页面。" };
            }

            updateOverallStatus("非100%通过页。尝试按详细结果页配置进行解析...");
            // ... (rest of the detailed page parsing logic - needs careful review for multi-choice if structure differs)
            // This part is complex and highly dependent on the exact HTML of the detailed results page (examQuizFa-xxx.jsp)
            // For now, we assume the CORRECT_INDICATOR_SELECTOR and INCORRECT_INDICATOR_SELECTOR apply to the question as a whole.
            // And the `chosenAnswer` from `answersFilledInLastAttempt` (which can be an array) is what we record.

            if (!config.RESULTS_PAGE_INDICATOR || !document.querySelector(config.RESULTS_PAGE_INDICATOR)) {
                updateOverallStatus('未配置"详细结果页指示器"或当前非预期的详细结果页。跳过。', false);
                return { success: false, reason: "详细结果页指示器未找到或未配置。" };
            }
            // ... (the existing detailed parsing logic from here)
            // Key change needed: when storing to knowledgeBase, ensure `chosenAnswer` (which might be an array) is stored correctly.
            // And `incorrectAttempts` for multi-choice should store arrays.

            const resultItems = document.querySelectorAll(config.QUESTION_ITEM_SELECTOR);
            if (resultItems.length === 0) {
                 updateOverallStatus(`详细结果页使用 "${config.QUESTION_ITEM_SELECTOR}" 未找到题目条目。`, true);
                return { success: false, reason: "详细结果页未找到题目条目。" };
            }
             updateOverallStatus(`在详细结果页找到 ${resultItems.length} 个题目条目，开始解析...`);

            let detailedUpdatesMade = 0;
            let detailedAllCorrect = true;

            for (const item of resultItems) {
                const questionTextElement = item.querySelector(config.QUESTION_TEXT_SELECTOR_ON_RESULT);
                // ... (existing text extraction logic)
                let rawQuestionText = "";
                if (questionTextElement.firstChild && questionTextElement.firstChild.nodeType === Node.TEXT_NODE) {
                    rawQuestionText = questionTextElement.firstChild.textContent;
                } else {
                    questionTextElement.childNodes.forEach(node => {
                        if (node.nodeType === Node.TEXT_NODE) rawQuestionText += node.textContent + " ";
                    });
                }
                let questionTextOnResult = rawQuestionText.replace(/^\d+、\s*/, '').trim();
                const answerMarkerIndex = questionTextOnResult.indexOf("您的答案：");
                if (answerMarkerIndex !== -1) {
                    questionTextOnResult = questionTextOnResult.substring(0, answerMarkerIndex).trim();
                }
                questionTextOnResult = questionTextOnResult.replace(/<br\s*\/?>/gi, '').trim();

                if (!questionTextOnResult) continue;

                    const correspondingAnswerFromLastAttempt = answersFilledInLastAttempt.find(
                        ans => ans.questionText.trim() === questionTextOnResult
                    );

                if (!correspondingAnswerFromLastAttempt) {
                    console.warn(`详细结果页题目 "${questionTextOnResult}" 未在上次提交记录中找到.`);
                    continue;
                }

                        const qTextForKB = correspondingAnswerFromLastAttempt.questionText;
                // chosenAnswer is string for single, array for multiple (already sorted if from AI/KB)
                const chosenAnswer = correspondingAnswerFromLastAttempt.questionType === 'multiple' && Array.isArray(correspondingAnswerFromLastAttempt.chosenAnswer)
                                    ? correspondingAnswerFromLastAttempt.chosenAnswer.sort()
                                    : correspondingAnswerFromLastAttempt.chosenAnswer;
                        const qNumDisplay = correspondingAnswerFromLastAttempt.qNumDisplay;
                const qType = correspondingAnswerFromLastAttempt.questionType;
                const displayChosenAns = qType === 'multiple' ? `[${chosenAnswer.join(',')}]` : chosenAnswer;


                                if (!knowledgeBase[qTextForKB]) knowledgeBase[qTextForKB] = { incorrectAttempts: [] };
                                if (!knowledgeBase[qTextForKB].incorrectAttempts) knowledgeBase[qTextForKB].incorrectAttempts = [];

                const isCorrect = item.querySelector(config.CORRECT_INDICATOR_SELECTOR);
                const isIncorrect = item.querySelector(config.INCORRECT_INDICATOR_SELECTOR);

                if (isCorrect) {
                    knowledgeBase[qTextForKB].knownCorrectAnswer = chosenAnswer; // Store string or array
                    if (qType === 'multiple') {
                        knowledgeBase[qTextForKB].incorrectAttempts = knowledgeBase[qTextForKB].incorrectAttempts.filter(
                            arr => JSON.stringify(arr.sort()) !== JSON.stringify(chosenAnswer)
                        );
                            } else {
                        knowledgeBase[qTextForKB].incorrectAttempts = knowledgeBase[qTextForKB].incorrectAttempts.filter(ia => ia !== chosenAnswer);
                    }
                    updateQuestionStatus(qNumDisplay, `详细结果: "${qTextForKB.substring(0,15)}..." (选${displayChosenAns}) 正确。`, false, "AutoResult");
                    detailedUpdatesMade++;
                } else if (isIncorrect) {
                    detailedAllCorrect = false;
                    if (qType === 'multiple') {
                        if (!knowledgeBase[qTextForKB].incorrectAttempts.some(arr => JSON.stringify(arr.sort()) === JSON.stringify(chosenAnswer))) {
                            knowledgeBase[qTextForKB].incorrectAttempts.push(chosenAnswer);
                        }
                    } else {
                        if (!knowledgeBase[qTextForKB].incorrectAttempts.includes(chosenAnswer)) {
                            knowledgeBase[qTextForKB].incorrectAttempts.push(chosenAnswer);
                        }
                    }
                    knowledgeBase[qTextForKB].knownCorrectAnswer = null;
                    updateQuestionStatus(qNumDisplay, `详细结果: "${qTextForKB.substring(0,15)}..." (选${displayChosenAns}) 错误。`, true, "AutoResult");
                    detailedUpdatesMade++;
                } else {
                    updateQuestionStatus(qNumDisplay, `详细结果: "${qTextForKB.substring(0,15)}..." (选${displayChosenAns}) 无法明确对错。`, true, "AutoResult");
                    detailedAllCorrect = false; // Assume incorrect if ambiguous
                }
            }

            if (detailedUpdatesMade > 0) {
                saveData(KNOWLEDGE_BASE_KEY, knowledgeBase);
                updateOverallStatus(`详细结果页自动解析完成，更新了 ${detailedUpdatesMade} 条题目记忆。`);
                return { success: true, allCorrect: detailedAllCorrect, updatesMade: detailedUpdatesMade > 0, reason: "已处理详细结果页。" };
            } else {
                updateOverallStatus("详细结果页自动解析未找到可匹配或更新的题目结果。", false);
                return { success: false, reason: "详细结果页未找到可更新的题目。" };
            }
    }

    async function attemptAutoRetry() {
        if (AUTO_FEEDBACK_CONFIG.RETRY_BUTTON_SELECTOR) {
            const retryButton = document.querySelector(AUTO_FEEDBACK_CONFIG.RETRY_BUTTON_SELECTOR);
            if (retryButton) {
                    updateOverallStatus('检测到错误或非答题页，尝试自动点击重试按钮...', false);
                    console.log('脚本将尝试自动点击"重新答题"按钮。请等待页面跳转后再次运行脚本。');
                retryButton.click();
                    return true; // 表示已尝试点击
            } else {
                    updateOverallStatus(`未通过/非答题页，且未找到"重新答题"按钮 (选择器: ${AUTO_FEEDBACK_CONFIG.RETRY_BUTTON_SELECTOR})。请手动操作。`, true);
                    alert('考试未完全通过/当前非答题页，且脚本未能自动点击"重新答题"按钮。请您手动操作返回考试页面，然后再次运行脚本。');
            }
        } else {
                updateOverallStatus('未通过/非答题页，且"重新答题"按钮选择器未配置。请手动操作。', true);
                alert('考试未完全通过/当前非答题页，"重新答题"按钮选择器未配置。请您手动操作返回考试页面，然后再次运行脚本。');
        }
            return false; // 表示未尝试点击
    }

    async function manualProcessPendingFeedback(pendingData) {
            updateOverallStatus("自动解析失败/未配置。准备手动反馈...");
            const { answersFilledInLastAttempt } = pendingData; // Contains questionType
        let anyMarkedIncorrect = false;

        if (!answersFilledInLastAttempt || answersFilledInLastAttempt.length === 0) {
                updateOverallStatus("待反馈数据为空。", false); clearData(PENDING_FEEDBACK_KEY); return { success: true, allCorrect: true };
            }

            // performManualReview = confirm(...) // Existing confirm logic can remain if desired, or be removed for full auto.
            // For now, let's assume it defaults to marking as per user's interaction or a default.
            // The example below simplifies to default-correct if not explicitly told otherwise.
            // A real manual review would need to properly ask about multi-choice arrays.

            updateOverallStatus("开始手动确认上次答案 (或默认处理)..."); // Simplified
        for (const ans of answersFilledInLastAttempt) {
            const qText = ans.questionText;
                // chosenAnswer is string for single, array for multiple (already sorted if from AI/KB)
                const choice = ans.questionType === 'multiple' && Array.isArray(ans.chosenAnswer)
                                ? ans.chosenAnswer.sort()
                                : ans.chosenAnswer;
            const qNumDisplay = ans.qNumDisplay;
                const qType = ans.questionType;
                const displayChoice = qType === 'multiple' ? `[${choice.join(',')}]` : choice;

                // Simplified: This would be replaced by actual confirm() calls if manual review is enabled
                const isWrong = false; // Placeholder: assume correct unless a more complex manual process is re-added

            if (!knowledgeBase[qText]) knowledgeBase[qText] = { incorrectAttempts: [] };
                if (!knowledgeBase[qText].incorrectAttempts) knowledgeBase[qText].incorrectAttempts = [];

                if (isWrong) { // This block would execute if confirm() returned true for "is wrong?"
                    anyMarkedIncorrect = true;
                    if (qType === 'multiple') {
                        if (!knowledgeBase[qText].incorrectAttempts.some(arr => JSON.stringify(arr.sort()) === JSON.stringify(choice))) {
                            knowledgeBase[qText].incorrectAttempts.push(choice);
                        }
                    } else {
                        if (!knowledgeBase[qText].incorrectAttempts.includes(choice)) {
                            knowledgeBase[qText].incorrectAttempts.push(choice);
                        }
                    }
                    knowledgeBase[qText].knownCorrectAnswer = null;
                    updateQuestionStatus(qNumDisplay, `上次答案 ${displayChoice} for "${qText.substring(0,15)}..." 标记为错误。`, true, "User");
                } else { // Defaulting to correct or if confirm() returned false for "is wrong?"
                    knowledgeBase[qText].knownCorrectAnswer = choice; // Store string or array
                    if (qType === 'multiple') {
                        knowledgeBase[qText].incorrectAttempts = knowledgeBase[qText].incorrectAttempts.filter(
                            arr => JSON.stringify(arr.sort()) !== JSON.stringify(choice)
                        );
                    } else {
                        knowledgeBase[qText].incorrectAttempts = knowledgeBase[qText].incorrectAttempts.filter(ia => ia !== choice);
                    }
                    updateQuestionStatus(qNumDisplay, `上次答案 ${displayChoice} for "${qText.substring(0,15)}..." 标记/默认为正确。`, false, "User");
                }
            }

        saveData(KNOWLEDGE_BASE_KEY, knowledgeBase);
        clearData(PENDING_FEEDBACK_KEY);

            if (anyMarkedIncorrect) {
                updateOverallStatus('手动反馈已处理 (有错误)。知识库更新。若需重试，请手动操作并重跑。');
                // alert('知识库已根据您的手动反馈更新。\n如果需要重新答题，请您手动点击"重新答题"按钮，然后在新的考试页面上再次运行此脚本。');
            } else {
                updateOverallStatus("手动反馈流程已完成 (无错误或默认全对)。知识库更新。");
            }
        return { success: true, allCorrect: !anyMarkedIncorrect };
    }

    async function mainExecution() {
            if ( DEEPSEEK_API_KEY === "") { // Adjusted placeholder check
            alert("错误：请在脚本顶部的 DEEPSEEK_API_KEY 变量中填入您的真实DeepSeek API密钥！");
                updateOverallStatus("错误: API密钥未配置。", true); return;
        }
            updateOverallStatus("自动化脚本启动 (v2.7 - 多选支持)。"); // Version updated

        knowledgeBase = loadData(KNOWLEDGE_BASE_KEY) || {};
        const pendingFeedback = loadData(PENDING_FEEDBACK_KEY);
            let autoRetryAttemptedDueToFeedback = false;

            // Section 1: Process pending feedback if on a known results page
            const isFailPage = window.location.pathname.includes('examQuizFail.jsp');
            const isPassPage = window.location.pathname.includes('examQuizPass.jsp');

            if (pendingFeedback && (isFailPage || isPassPage)) {
                updateOverallStatus(`在${isFailPage ? '失败' : '通过'}结果页检测到待反馈数据，开始处理...`);
                const autoResult = await tryAutoParseResultsPage(pendingFeedback); // This function will also need multi-choice awareness
                let allCorrectAfterFeedback = autoResult.success && autoResult.allCorrect;

            if (autoResult.success) {
                clearData(PENDING_FEEDBACK_KEY);
                    updateOverallStatus(`自动反馈解析完成。知识库已更新。All Correct: ${autoResult.allCorrect}`);
                } else {
                    updateOverallStatus(`自动反馈解析失败: ${autoResult.reason || '未知原因'}. 进行手动反馈...`);
                    const manualFeedbackResult = await manualProcessPendingFeedback(pendingFeedback); // Also needs multi-choice awareness
                    allCorrectAfterFeedback = manualFeedbackResult.allCorrect;
                    updateOverallStatus(`手动反馈完成。All Correct: ${allCorrectAfterFeedback}`);
                }

                if (!allCorrectAfterFeedback && isFailPage) {
                    updateOverallStatus("反馈显示考试未完全通过，尝试自动重试...");
                     if (await attemptAutoRetry()) {
                        autoRetryAttemptedDueToFeedback = true;
                } else {
                        updateOverallStatus("自动重试失败（未找到按钮或未配置）。");
                }
                } else if (allCorrectAfterFeedback) {
                    updateOverallStatus("反馈处理完毕，所有题目均正确。");
                } else if (!isFailPage && !allCorrectAfterFeedback){
                     updateOverallStatus("反馈处理完毕但非失败页面且有错，不自动重试。");
            }

                if (autoRetryAttemptedDueToFeedback) {
                    updateOverallStatus("已尝试自动重试，请等待页面加载。脚本结束。");
                    return;
        }

                 if (isFailPage || isPassPage) {
                     updateOverallStatus("结果页面反馈处理完毕。脚本在此结束。");
            return;
                 }
        }

        const allQuestionsOnPage = extractExamQuestions();

        if (!allQuestionsOnPage || allQuestionsOnPage.length === 0) {
                if (!autoRetryAttemptedDueToFeedback) {
                    updateOverallStatus("当前页面非考试答题页或未提取到题目。尝试自动点击 '重新答题'...");
                    if (await attemptAutoRetry()) {
                         updateOverallStatus("已尝试点击'重新答题'，等待页面跳转。脚本结束。");
            } else {
                        updateOverallStatus("尝试点击'重新答题'失败或按钮未找到。脚本结束。");
                    }
                } else {
                    updateOverallStatus("先前已因反馈尝试重试，但当前页面仍无法提取题目。脚本结束。");
            }
            return;
        }

            updateOverallStatus(`页面成功提取 ${allQuestionsOnPage.length} 道题目，开始处理...`);

            const questionsToAnswerForAI = [];
        const answersFromKB = [];

        allQuestionsOnPage.forEach(q => {
                const qTextForKB = q.questionText;
                const qInfo = knowledgeBase[qTextForKB];
                let handledByKB = false;

                if (qInfo) {
                    const knownCorrect = qInfo.knownCorrectAnswer; // String for single, Array for multiple
                    const incorrectAttempts = qInfo.incorrectAttempts || []; // Array of strings for single, Array of Arrays for multiple

                    // Priority 1: Use known correct answer
                    if (knownCorrect !== undefined && knownCorrect !== null) {
                        let isValidKnownCorrect = false;
                        if (q.questionType === 'multiple') {
                            isValidKnownCorrect = Array.isArray(knownCorrect) && knownCorrect.length > 0 &&
                                                  knownCorrect.every(val => q.options.some(opt => opt.value.toUpperCase() === val.toUpperCase()));
                } else {
                            isValidKnownCorrect = typeof knownCorrect === 'string' && q.options.some(opt => opt.value.toUpperCase() === knownCorrect.toUpperCase());
                        }

                        if (isValidKnownCorrect) {
                            answersFromKB.push({ ...q, chosenAnswer: knownCorrect, source: "KB" });
                            const displayAnswer = q.questionType === 'multiple' ? `[${knownCorrect.join(',')}]` : knownCorrect;
                            updateQuestionStatus(q.qNumDisplay, `第 ${q.qNumDisplay} 题: 从知识库加载正确答案 ${displayAnswer}`, false, "KB");
                            handledByKB = true;
            } else {
                             // Known correct answer is invalid (e.g. option changed), clear it and let AI handle
                             if(qInfo.knownCorrectAnswer !== null) updateQuestionStatus(q.qNumDisplay, `第 ${q.qNumDisplay} 题: 知识库中已存正确答案 "${knownCorrect}" 无效或与当前选项不符，将重新咨询AI。`, true, "KB-Invalid");
                             qInfo.knownCorrectAnswer = null; // Invalidate it
                             // Falls through to AI if not handled by incorrect attempts logic
                        }
                    }

                    // Priority 2 (if not handled by known correct): Use knowledge of incorrect attempts
                    if (!handledByKB && incorrectAttempts.length > 0) {
                        if (q.questionType === 'single') {
                            const validOptions = q.options.filter(opt => !incorrectAttempts.includes(opt.value.toUpperCase()));
                            if (validOptions.length > 0) {
                                const randomChoice = validOptions[Math.floor(Math.random() * validOptions.length)].value.toUpperCase();
                                answersFromKB.push({ ...q, chosenAnswer: randomChoice, source: "KB-Random" });
                                updateQuestionStatus(q.qNumDisplay, `第 ${q.qNumDisplay} 题: 已知错误尝试 ${incorrectAttempts.join(', ')}. 随机选择 ${randomChoice}`, false, "KB-Random");
                                handledByKB = true;
                            } else {
                                updateQuestionStatus(q.qNumDisplay, `第 ${q.qNumDisplay} 题: 所有单选选项均已尝试且错误。将提交AI。`, true, "KB");
                            }
                        } else { // Multiple choice - logic for picking from non-incorrect combinations is complex
                            // For now, if there are incorrect attempts for multi-choice, we still send to AI,
                            // but AI will be informed of these bad combinations in its prompt.
                            updateQuestionStatus(q.qNumDisplay, `第 ${q.qNumDisplay} 题 (多选): 知识库有 ${incorrectAttempts.length} 条错误记录。将交由AI决策。`, false, "KB-Info");
                            // handledByKB remains false, so it goes to AI
                        }
                    }
                }

                if (!handledByKB) {
                    questionsToAnswerForAI.push(q);
                     if (!qInfo || (qInfo.knownCorrectAnswer === undefined && (!qInfo.incorrectAttempts || qInfo.incorrectAttempts.length === 0))) {
                        updateQuestionStatus(q.qNumDisplay, `第 ${q.qNumDisplay} 题: 知识库无答案或无明确历史，将提交AI。`, false, "New/AI");
                    }
            }
        });

        let aiAnswers = [];
            if (questionsToAnswerForAI.length > 0) {
                try {
                    aiAnswers = await getBatchAnswersFromDeepSeek(questionsToAnswerForAI, DEEPSEEK_API_KEY); //This function now returns objects with questionType
                    if (aiAnswers.length === 0 && questionsToAnswerForAI.length > 0) { // Check if AI was expected to answer but didn't
                        updateOverallStatus("从 DeepSeek 获取答案失败或返回为空，但有题目需要AI解答。", true);
                        alert("部分题目无法从 DeepSeek 获取答案，脚本停止。请检查API密钥和网络连接。");
                return;
            }
                } catch (error) {
                    updateOverallStatus("获取 DeepSeek 答案时发生错误。", true);
                    console.error("Error getting AI answers:", error);
                    alert("获取 DeepSeek 答案时发生错误，脚本停止。请检查控制台。");
                return;
            }
        } else {
                updateOverallStatus("所有题目均已在知识库中找到答案或通过逻辑处理。");
        }

        const allAnswersToFill = answersFromKB.concat(aiAnswers);

        if (allAnswersToFill.length > 0) {
                fillExamAnswers(allAnswersToFill); // This function now expects questionType

                saveData(PENDING_FEEDBACK_KEY, {
                    answersFilledInLastAttempt: allAnswersToFill.map(ans => ({
                        qNumDisplay: ans.qNumDisplay,
                        questionText: ans.questionText,
                        chosenAnswer: ans.chosenAnswer, // string or array
                        source: ans.source,
                        questionIdFromInputName: ans.questionIdFromInputName,
                        questionType: ans.questionType // Make sure to save this
                    }))
                });
                updateOverallStatus(`已保存本次 (${allAnswersToFill.length} 道题) 的答案用于后续反馈。`);

                if (autoSubmit) {
                    updateOverallStatus("正在自动提交考卷...", false);
                    const submitButton = document.querySelector('#tjkj');
                    if (submitButton) {
                            submitButton.click();
                    } else {
                        updateOverallStatus('未找到提交按钮 (ID #tjkj)，请手动提交。', true);
                        alert('自动填充完毕，但未找到提交按钮。请您手动点击页面上的"提交"或"交卷"按钮。');
                    }
                } else {
                    updateOverallStatus('自动填充完毕，请手动检查和提交。');
                    alert('自动填充完毕，请您手动检查页面上的答案，然后点击"提交"或"交卷"按钮。');
                }
            } else {
                 if (allQuestionsOnPage.length > 0) { // If there were questions but no answers to fill
                    updateOverallStatus("页面上有题目，但未能从知识库或AI获取任何答案。脚本结束。", true);
                     alert("页面上有题目，但未能从知识库或AI获取任何答案。请检查脚本逻辑或AI服务。");
                 } else { // No questions on page initially
                     updateOverallStatus("页面上未提取到题目，且无待处理反馈。脚本结束。");
                 }
            }
        }

        // 初始化状态显示
    createStatusDisplay();
    updateOverallStatus("初始化完成，等待执行...");

        // 运行主逻辑
        mainExecution();
    }

    // 确保在页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addButtons);
    } else {
        addButtons();
    }
})();