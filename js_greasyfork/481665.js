// ==UserScript==
// @name         Fuck bb
// @namespace    http://tampermonkey.net/
// @version      0.5.3
// @description  Optimizes your grading experience using bb.ustc.edu.cn, mainly for TAs.
// @description:zh-CN 优化您在 bb.ustc.edu.cn 的评分体验（主要为了助教开发）
// @author       PRO
// @match        https://www.bb.ustc.edu.cn/webapps/assignment/*
// @icon         http://ustc.edu.cn/favicon.ico
// @run-at       document-start
// @license      gpl-3.0
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        unsafeWindow
// @require      https://update.greasyfork.org/scripts/470224/1303666/Tampermonkey%20Config.js
// @downloadURL https://update.greasyfork.org/scripts/481665/Fuck%20bb.user.js
// @updateURL https://update.greasyfork.org/scripts/481665/Fuck%20bb.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const config_desc = {
        "$default": {
            value: true,
            input: "current",
            processor: "not",
            formatter: "boolean",
            autoClose: false
        },
        "alternate-count": { name: "Alternate count", title: "Replace original count with a better one. Required for 'Group count' to work" },
        "group-cnt": {
            name: "Group count",
            value: 500,
            input: "prompt",
            processor: "int_range-1-",
            formatter: "normal",
            title: "Number of students in your group. Viewing grades of greater number of students will trigger an alert."
        },
        "focus-grade": { name: "Focus grade", title: "Automatically focuses on grade input" },
        "full-grade": { name: "Full grade", title: "Automatically fills in full grade" },
        "ignore-ungraded": { name: "Ignore un-graded", title: "Skips un-graded attemps" },
        "submit-draft": { name: "Submit draft", title: "Automatically submits drafts", value: false },
        "native-pdf": { name: "*Native PDF", title: "View students' pdf files with browser's solution and auto scrolls to the viewer" }
    };
    const config = GM_config(config_desc);
    const window = unsafeWindow;
    const $ = document.querySelector.bind(document);
    document.head.appendChild(document.createElement("style")).textContent = "html { scroll-behavior: smooth; }";
    if (config["native-pdf"]) {
        if (typeof window.gradeAssignment === "undefined") {
            Object.defineProperty(window, "gradeAssignment", {
                set: function (value) {
                    console.log("[Fuck bb] Hooked gradeAssignment");
                    value._handleInlineViewResponse = value.handleInlineViewResponse;
                    value.handleInlineViewResponse = function (responseJSON) {
                        const PDF = responseJSON.downloadUrl;
                        if (PDF.endsWith(".pdf")) {
                            fetch(PDF).then(res => res.blob()).then(blob => {
                                const url = URL.createObjectURL(blob);
                                responseJSON.viewUrl = url;
                                value._handleInlineViewResponse(responseJSON);
                                $("#inlineGrader")?.scrollIntoView();
                            });
                        } else {
                            value._handleInlineViewResponse(responseJSON);
                            $("#inlineGrader")?.scrollIntoView();
                        }
                    };
                    window._gradeAssignment = value;
                },
                get: function () {
                    return window._gradeAssignment;
                }
            });
        } else {
            window.gradeAssignment._handleInlineViewResponse = window.gradeAssignment.handleInlineViewResponse;
            window.gradeAssignment.handleInlineViewResponse = function (responseJSON) {
                const PDF = responseJSON.downloadUrl;
                if (PDF.endsWith(".pdf")) {
                    fetch(PDF).then(res => res.blob()).then(blob => {
                        const url = URL.createObjectURL(blob);
                        responseJSON.viewUrl = url;
                        window.gradeAssignment._handleInlineViewResponse(responseJSON);
                        $("#inlineGrader")?.scrollIntoView();
                    });
                } else {
                    window.gradeAssignment._handleInlineViewResponse(responseJSON);
                    $("#inlineGrader")?.scrollIntoView();
                }
            };
            console.log("[Fuck bb] Unable to hook, fallback");
        }
    }
    document.addEventListener("DOMContentLoaded", e => {
        const isSelf = config["alternate-count"] ? alternateCount() : true;
        const timer = window.setInterval(
            () => {
                if (typeof theAttemptNavController !== "undefined") {
                    window.clearInterval(timer);
                    waitForCtrl(isSelf);
                }
            }, 500
        );
    });
    // Alternate count
    function alternateCount() {
        const span = $("span.count");
        if (!span) return true;
        span.style.fontWeight = "bold";
        span.style.color = "red";
        const m = span.textContent.match(/正在查看 (\d+) 个可评分项目，共 (\d+) 个可评分项目/);
        if (!m) return true;
        const alternate = m[1] + " / " + m[2];
        span.textContent = alternate;
        if (parseInt(m[2]) > config["group-cnt"]) {
            alert("Viewing all students!");
            return false;
        }
        return true;
    }
    // Focus grade input
    function focusGrade() {
        $("#inlineGrader")?.scrollIntoView();
        $("#currentAttempt_grade")?.focus();
    }
    // Full grade
    function fullGrade() {
        const grade = $("#currentAttempt_grade");
        const max = $("#currentAttempt_pointsPossible");
        if (grade.value === "") {
            grade.value = max.textContent.slice(1);
        }
    }
    // Ignore un-graded attempts
    function ignoreUngraded() {
        if ($("#panelbutton2 div.students-pager img[alt='不计入用户的成绩']")) {
            console.log("Skip un-graded");
            theAttemptNavController.viewNext();
        }
    }
    // Auto submit drafts
    function submitDraft() {
        const grade = $("#currentAttempt_grade");
        const submit = $("#currentAttempt_submitButton");
        if (grade.value !== "" && submit) {
            submit.click();
        }
    }
    // Function to be called after the controller is loaded
    function waitForCtrl(isSelf) {
        if (config["focus-grade"]) focusGrade();
        if (!isSelf) return;
        if (config["ignore-ungraded"]) ignoreUngraded();
        if (config["submit-draft"]) submitDraft();
        if (config["full-grade"]) fullGrade();
    }
    // Shortcuts
    document.addEventListener("keydown", e => {
        if (e.key === "Escape")
            document.activeElement.blur();
        if (document.activeElement.nodeName != "INPUT") {
            switch (e.key) {
                case "ArrowLeft":
                    theAttemptNavController.viewPrevious();
                    break;
                case "ArrowRight":
                    theAttemptNavController.viewNext();
                    break;
                case "Enter": {
                    const save = $(e.ctrlKey ? "#currentAttempt_submitButton" : "#currentAttempt_saveButton");
                    if (save) save.click();
                    break;
                }
                default:
                    break;
            }
        }
    });
    // Listen to config changes
    const callbacks = {
        "alternate-count": alternateCount,
        "focus-grade": focusGrade,
        "full-grade": fullGrade,
        "ignore-ungraded": ignoreUngraded,
        "submit-draft": submitDraft,
    };
    window.addEventListener(GM_config_event, e => {
        if (e.detail.type === "set" && e.detail.after) {
            const callback = callbacks[e.detail.prop];
            if (callback) callback();
        }
    });
})();
