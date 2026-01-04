// ==UserScript==
// @name         Supply360_AutoRun
// @namespace    http://tampermonkey.net/
// @version      2025-02-03
// @description  Supply360 自動上課啦，啟動後重新整理就會自動完成我的課程內容！
// @author       SinYiLiou
// @match        https://supply.tsmc.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAA5FBMVEVHcEwBGhk9Mi9fV1VpY2JzbWt4cnFDOTZORUOTkI+1srG9vLu4trV8eHfJx8aGgX9QSUZqY2GVkI6Mh4WYlZSQjIqAenoPAwCxr65PS0qnpaSfmpmwraytqaijoJ8TDQxBPDtwaWjXLDHmKS/fLTLiKC7eLTLlJCqPVFSdg4KzZ2ijeXmnmZedoqCukI+oiIimravhLTLeLDGyTk/Qb3HiOz+bZWXoLTPBV1nUVljnGyKSp6XQjY7fLTLhLDHfS0+9n5/fLTLpKzHVP0KNk5HAKCtYUU9qYmAJKiIWIx/fLTLpKzD76IqSAAAATHRSTlMABnC2+vz5o0rJ/Pz7+vz5WX36+/z6i1j4+Pf7//n5QPjGCWcjm/1Auvv9/fn8/Pv4Ea38/v/1//7+//37hO7//sDx/vrh+tIrM+PfLoM1aAAAAZ1JREFUeAFioA5gZAQhrICJmQVAJlEoNgpDczvKrugOwkZjddwhpe7+/x809+hzbzRE4fbmN/9fU5IVVdVkRdLvfvD+66JumKoKDcuw9PtvvAdot3SEiUQRY5iR2y+8tgSR0hEZtSlCjQ6VyMNnlF1sWoagmsaTVUsVLMjE16h6fdCmMpLsJy1FVmxqIyrL8ovqYOi4HvSDMIr9ME7SOE5DSDPsuTkAheMMy4qPnCqo+dipJ5UznczmTlk4CzBwliBb8cSeI76SFYfTaOWsp/OsV2yemNs/MOHTnW/Vk/2e7/bW6slCBJ8jemICez0b7WqfT+KY72K44sF0PgOgD/KlMxztqmRSh/WK2DW30WpKJtPdcLMAwB32vbAsyzR8umk59tOnnwWHoftWIKLEGaIoJoqSMRbbkiJ/lugvMzDqiJAKR2pgoSOh02dtz5YB9aOgM1Fghnk8Eqv9tZtYa6GOrmmaLOstTb4BX9ddwxQE/anwhmWa4nceAJemoL60jKHmBfxal/Pb+jpD+fVxYOCNAGC+oyEkRrEDShI5AFbLQKu6n5zzAAAAAElFTkSuQmCC
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525839/Supply360_AutoRun.user.js
// @updateURL https://update.greasyfork.org/scripts/525839/Supply360_AutoRun.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 通用函數：等待特定元素出現
    function waitForElement(selector, root, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const element = root.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver(() => {
                const element = root.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });

            observer.observe(root, { childList: true, subtree: true });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Timeout: Element with selector "${selector}" not found within ${timeout}ms`));
            }, timeout);
        });
    }

    // 通用函數：發送 POST 請求
    function postRequest(url, body) {
        return fetch(url, {
            headers: {
                "accept": "application/json, text/plain, */*",
                "content-type": "application/json; charset=UTF-8"
            },
            method: "POST",
            body: JSON.stringify(body),
            credentials: "include",
            mode: "cors"
        }).then(response => response.json());
    }

    // 獲取課程資料
    function fetchCoursesByYear(year) {
        const body = {
            CATALOG: "",
            SUBCATALOG: "",
            TITLE: "",
            STATUS: "",
            UPDATE_DATE_S: "",
            UPDATE_DATE_E: "",
            Year: year
        };
        return postRequest("https://supply.tsmc.com/academy-srv/apiAcademy/getMyCourses", body);
    }

    // 更新課程資料
    function updateMyCourse(courseIds) {
        if (!courseIds || courseIds.length === 0) return;
        const body = { profileValues: courseIds };
        postRequest("https://supply.tsmc.com/academy-srv/apiAcademy/updateMyCourse", body)
            .then(json => {
                if (json.apiResultCode === 200) {
                    console.log("Supply360", "已更新我的課程");
                }
            })
            .catch(error => console.error("Supply360", `更新我的課程發生錯誤: ${error}`));
    }

    // 檢查課程狀態
    function checkMyCourses() {
        const currentYear = new Date().getFullYear();
        const startYear = 2023;
        const courseStatusMap = {};
        const fetchPromises = [];

        for (let year = currentYear; year >= startYear; year--) {
            fetchPromises.push(
                fetchCoursesByYear(year).then(json => {
                    json.forEach(list => {
                        const { ID, Valid, TITLE, NO } = list.course;
                        if (!courseStatusMap[ID]) courseStatusMap[ID] = {};
                        courseStatusMap[ID][year] = Valid;
                        courseStatusMap[ID].info = `課程名稱: ${TITLE}、課程代號: ${NO} 課程ID ${ID}`;
                    });
                })
            );
        }

        return Promise.all(fetchPromises).then(() => {
            const invalidCourseIds = [];
            for (const [courseId, statusByYear] of Object.entries(courseStatusMap)) {
                const isCurrentYearValid = statusByYear[currentYear] === true;
                const isPreviousYearValid = statusByYear[currentYear - 1] === true;

                if (!isCurrentYearValid && !isPreviousYearValid && statusByYear[currentYear - 1] === false) {
                    console.log(`Supply360: 加入過期課程 ${statusByYear.info} 到清單中。`);
                    invalidCourseIds.push(Number(courseId));
                }
            }

            if (invalidCourseIds.length > 0) {
                console.log("Supply360", `需要更新的課程清單: ${invalidCourseIds.join(", ")}`);
                updateMyCourse(invalidCourseIds);
            }

            return invalidCourseIds;
        });
    }

    // 自動處理 iframe 的內容
    function handleIframeContent(element) {
        switch (element.location.pathname) {
            case "/academyui/dist/AcademyMyCourseList":
                viewNotCompleted(element);
                startCourse(element);
                break;
            case "/academyui/dist/AcademyCourseContent":
                startCourse(element);
                break;
            case "/academyui/dist/AcademyQuizContent":
                autoQuiz(element);
                break;
            default:
                setMyCourse(element);
                break;
        }
    }

    // 切換到未完成的課程
    function viewNotCompleted(root) {
        waitForElement('.form_select.is-warn', root).then(element => {
            element.value = "Not Completed";
            element.dispatchEvent(new Event('change', { bubbles: true }));
        });
    }

    // 開始課程
    function startCourse(root) {
        waitForElement('.course_card_readmore, .academy-course_quiz', root)
            .then(element => element.click())
            .catch(() => handleExpiredCourses(root));
    }

    // 處理過期課程
    function handleExpiredCourses(root) {
        console.log("Supply360", "未找到需上課課程，檢測是否有過期課程");
        checkMyCourses().then(invalidCourses => {
            if (invalidCourses.length > 0) {
                location.href = `https://supply.tsmc.com/supply360/dist/Goto?d=I&t=F&l=link_AcademyCourseContent&a=&q=%253FID%253D${invalidCourses[0]}`;
            } else {
                Swal.fire({
                    icon: 'success',
                    title: '沒有過期課程',
                    text: '一切正常！',
                    timer: 3000,
                    showConfirmButton: false
                });
                console.log("Supply360", "沒有過期課程，一切正常！");
            }
        });
    }

    // 自動答題
    function autoQuiz(root) {
        waitForElement('.academy-quiz_submit .btn', root).then(button => {
            button.removeAttribute("disabled");
            button.click();

            setTimeout(() => {
                const correctAnswers = Array.from(root.querySelectorAll(".is-good_answer"))
                    .map(answer => answer.previousElementSibling?.id)
                    .filter(Boolean);

                correctAnswers.forEach(id => root.getElementById(id)?.click());

                button.click();
                console.log("Supply360", "交卷!!通過~~");

                setTimeout(() => setMyCourse(root), 1000);
            }, 1000);
        });
    }

    // 設置為我的課程頁面
    function setMyCourse(root) {
        if (root.location.pathname !== "/academyui/dist/AcademyMyCourseList") {
            root.location.href = "https://supply.tsmc.com/academyui/dist/AcademyMyCourseList";
        }
    }

    // 主程序入口
    waitForElement('.iframeEmbed_internal, #iFrameResizer0', document).then(iframe => {
        iframe.onload = () => handleIframeContent(iframe.contentDocument || iframe.contentWindow.document);
    });

})();