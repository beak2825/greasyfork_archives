// ==UserScript==
// @name                 2024青骄
// @namespace            http://tampermonkey.net/
// @version              0.3.3
// @description          跳过视频自动完成所有课程每日领取学分  课程自动填充答案
// @author               FoliageOwO
// @match                *://www.2-class.com/*
// @match                *://2-class.com/*
// @grant                GM_addStyle
// @grant                GM_getResourceText
// @grant                GM_registerMenuCommand
// @grant                GM_getValue
// @grant                GM_setValue
// @license              GPL-3.0
// @supportURL           https://github.com/FoliageOwO/QingJiaoHelper
// @require              https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.js
// @require              https://greasyfork.org/scripts/453791-lib2class/code/lib2class.js?version=1452705
// @require              https://cdn.jsdelivr.net/npm/axios@1.3.6/dist/axios.min.js
// @resource toastifycss https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.css
// @resource spectrecss  https://cdn.jsdelivr.net/gh/FoliageOwO/QingJiaoHelper/spectre.css
// @downloadURL https://update.greasyfork.org/scripts/510061/2024%E9%9D%92%E9%AA%84.user.js
// @updateURL https://update.greasyfork.org/scripts/510061/2024%E9%9D%92%E9%AA%84.meta.js
// ==/UserScript==
const apiGetGradeLevels = {
    method: "GET",
    api: "/course/getHomepageGrade",
};
const apiGetCoursesByGradeLevel = {
    method: "GET",
    api: "/course/getHomepageCourseList?grade=${grade}&pageSize=50&pageNo=1",
};
const apiGetSelfCoursesByGradeLevel = {
    method: "GET",
    api: "/course/getHomepageCourseList?grade=自学&pageNo=1&pageSize=500&sort=&type=${grade}",
};
const apiGetTestPaperList = {
    method: "GET",
    api: "/exam/getTestPaperList?courseId=${courseId}",
};
const apiCommitExam = {
    method: "POST",
    api: "/exam/commit",
};
const apiAddMedal = {
    method: "GET",
    api: "/medal/addMedal",
};
const apiGetBeforeResourcesByCategoryName = {
    method: "POST",
    api: "/resource/getBeforeResourcesByCategoryName",
};
const apiAddPCPlayPV = {
    method: "POST",
    api: "/resource/addPCPlayPV",
};
const apiLikePC = {
    method: "POST",
    api: "/resource/likePC",
};
async function requestAPI(api, params, data) {
const method = api.method;
const origin = "https://www.2-class.com";
let url = `${origin}/api${api.api}`;

// Replace URL placeholders with actual values
for (const key in params) {
url = url.replaceAll("${" + key + "}", params[key]);
}

// Retrieve browser cookies
const cookies = document.cookie;

if (method === "GET") {
return await axios({
method: "GET",
url,
withCredentials: true, // Include cookies in the request
headers: {
Cookie: cookies, // Pass the cookies in the headers
},
}).then((response) => {
const rdata = response.data;
console.debug(`[${method}] ${url}`, data, rdata);

if (rdata.success === false || rdata.data === null) {
const errorMessage = rdata.errorMsg;
const errorCode = rdata.errorCode;
console.error(`API 返回错误 [${errorCode}]：${errorMessage}，请刷新页面重试！`);
return null;
} else {
return rdata;
}
}).catch((reason) => {
showMessage(`请求 API 失败（${reason.code}）：${reason.message}\n请将控制台中的具体报错提交！`, "red");
console.error(`请求失败（${reason.status}/${reason.code}）→${reason.message}→`, reason.toJSON(), reason.response, reason.stack);
});
} else {
return await axios({
method: "POST",
url,
withCredentials: true, // Include cookies in the request
headers: {
"Content-Type": "application/json;charset=UTF-8",
Cookie: cookies, // Pass the cookies in the headers
},
data,
}).then((response) => {
const rdata = response.data;
console.debug(`[${method}] ${url}`, data, rdata);

if (rdata.success === false || rdata.data === null) {
const errorMessage = rdata.errorMsg;
const errorCode = rdata.errorCode;
console.error(`API 返回错误 [${errorCode}]：${errorMessage}，请刷新页面重试！`);
return null;
} else {
return rdata;
}
});
}
}
async function getAvailableGradeLevels() {
    return await requestAPI(apiGetGradeLevels).then((data) => {
        return data ? data.data.map((it) => it.value) : null;
    });
}
async function getCoursesByGradeLevel(gradeLevel) {
    return await requestAPI(apiGetCoursesByGradeLevel, {
        grade: gradeLevel,
    }).then((data) => {
        return data ? data.data.list : null;
    });
}
async function getSelfCoursesByGradeLevel(gradeLevel) {
    return await requestAPI(apiGetSelfCoursesByGradeLevel, {
        grade: gradeLevel,
    }).then((data) => {
        return data ? data.data.list : null;
    });
}
async function getTestPaperList(courseId) {
    return await requestAPI(apiGetTestPaperList, { courseId }).then((data) => {
        return data ? data.data.testPaperList : null;
    });
}
async function getCourseAnswers(courseId) {
    return await getTestPaperList(courseId).then((testPaperList) => {
        if (!isNone(testPaperList)) {
            const answers = testPaperList.map((column) => column.answer);
            console.debug(`成功获取课程 [${courseId}] 的答案`, answers);
            return answers.map((it) => it.split("").join(","));
        }
        else {
            console.error(`无法获取课程 [${courseId}] 答案！`);
            return null;
        }
    });
}
async function commitExam(data) {
    return await requestAPI(apiCommitExam, {}, data);
}
async function addMedal() {
    return await requestAPI(apiAddMedal).then((data) => {
        if (isNone(data)) {
            return null;
        }
        else {
            const flag = data.flag;
            const num = data.medalNum;
            if (flag) {
                return num;
            }
            else {
                return undefined;
            }
        }
    });
}
async function getBeforeResourcesByCategoryName(data) {
    return await requestAPI(apiGetBeforeResourcesByCategoryName, {}, data).then((data) => data
        ? data.data.list.map((it) => {
            return {
                title: it.briefTitle,
                resourceId: it.resourceId,
            };
        })
        : null);
}
async function addPCPlayPV(data) {
    return await requestAPI(apiAddPCPlayPV, {}, data).then((data) => {
        return data ? data.data.result : null;
    });
}
async function likePC(data) {
    return await requestAPI(apiLikePC, {}, data).then((data) => {
        if (isNone(data)) {
            return null;
        }
        else {
            const rdata = data.data;
            return !Number.isNaN(Number(rdata)) || rdata.errorCode === "ALREADY_like";
        }
    });
}
const scriptName = "QingJiaoHelper";
const scriptVersion = "v0.3.3";
const toastifyDuration = 3 * 1000;
const toastifyGravity = "top";
const toastifyPosition = "left";
const __DATA__ = () => window["__DATA__"];
const reqtoken = () => __DATA__().reqtoken;
const userInfo = () => __DATA__().userInfo;
const isLogined = () => JSON.stringify(userInfo()) !== "{}";
const accountGradeLevel = () => isLogined() ? userInfo().department.gradeName : "未登录";
const coursesGradeLevels = async () => await getAvailableGradeLevels();
const selfCoursesGradeLevels = async () => [
    "小学",
    "初中",
    "高中",
    "中职",
    "通用",
];
("use strict");
const isTaskCoursesEnabled = () => getGMValue("qjh_isTaskCoursesEnabled", false);
const isTaskSelfCourseEnabled = () => getGMValue("qjh_isTaskSelfCourseEnabled", false);
const isTaskGetCreditEnabled = () => getGMValue("qjh_isTaskGetCreditEnabled", false);
const isTaskSingleCourseEnabled = () => getGMValue("qjh_isTaskSingleCourseEnabled", true);
const isTaskSkipEnabled = () => getGMValue("qjh_isTaskSkipEnabled", true);
const isTaskFinalExaminationEnabled = () => getGMValue("qjh_isTaskFinalExaminationEnabled", false);
const isFullAutomaticEmulationEnabled = () => getGMValue("qjh_isFullAutomaticEmulationEnabled", false);
let autoComplete = () => featureNotAvailable("自动完成");
let autoCompleteCreditsDone = () => getGMValue("qjh_autoCompleteCreditsDone", false);
const features = [
    {
        key: "courses",
        title: "自动完成所有课程（不包括考试）",
        matcher: ["/courses", "/drugControlClassroom/courses"],
        task: () => taskCourses(false),
        enabled: isTaskCoursesEnabled,
    },
    {
        key: "selfCourse",
        title: "自动完成所有自学课程（不包括考试）",
        matcher: ["/selfCourse", "/drugControlClassroom/selfCourse"],
        task: () => taskCourses(true),
        enabled: isTaskSelfCourseEnabled,
    },
    {
        key: "credit",
        title: "自动获取每日学分（会花费一段时间，请耐心等待）",
        matcher: ["/admin/creditCenter"],
        task: taskGetCredit,
        enabled: isTaskGetCreditEnabled,
    },
    {
        key: "singleCourse",
        title: "单个课程自动完成",
        matcher: /\/courses\/exams\/(\d+)/,
        task: taskSingleCourse,
        enabled: isTaskSingleCourseEnabled,
    },
    {
        key: "finalExamination",
        title: "期末考试",
        matcher: ["/courses/exams/finalExam"],
        task: taskFinalExamination,
        enabled: isTaskFinalExaminationEnabled,
    },
    {
        key: "skip",
        title: "显示课程视频跳过按钮",
        matcher: /\/courses\/(\d+)/,
        task: taskSkip,
        enabled: isTaskSkipEnabled,
    },
];
function triggerFeatures() {
    if (location.pathname === "/") {
        showMessage(`${scriptName}\n版本：${scriptVersion}`, "green");
    }
    features.forEach((feature) => {
        let matcher = feature.matcher;
        let isMatched = matcher instanceof RegExp
            ? location.pathname.match(matcher)
            : matcher.indexOf(location.pathname) !== -1;
        if (isMatched && feature.enabled()) {
            showMessage(`激活功能：${feature.title}`, "green");
            feature.task();
        }
    });
}
(function () {
    for (let script of document.getElementsByTagName("script")) {
        if (script.innerText.indexOf("window.__DATA__") !== -1) {
            eval(script.innerText);
        }
    }
    GM_addStyle(GM_getResourceText("toastifycss"));
    GM_addStyle(GM_getResourceText("spectrecss"));
    GM_registerMenuCommand("菜单", showMenu);
    prepareMenu();
    let pathname = location.pathname;
    setInterval(() => {
        const newPathName = location.pathname;
        if (newPathName !== pathname) {
            console.debug(`地址改变`, pathname, newPathName);
            pathname = newPathName;
            triggerFeatures();
        }
    });
    triggerFeatures();
})();
const customGradeLevels = () => getGMValue("qjh_customGradeLevels", []);
const customSelfGradeLevels = () => getGMValue("qjh_customSelfGradeLevels", []);
async function prepareMenu() {
    const menuElement = await waitForElementLoaded("#qjh-menu");
    const coursesGradeLevelsList = await coursesGradeLevels();
    const selfCoursesGradeLevelsList = await selfCoursesGradeLevels();
    if (coursesGradeLevels === null || selfCoursesGradeLevelsList === null) {
        showMessage(`课程年级列表或自学课程年级列表获取失败！`, "red");
    }
    const titleElement = await waitForElementLoaded("#qjh-menu-title");
    titleElement.append(scriptVersion);
    for (const { selector, gradeLevels, customGradeLevelsList, customGradeLevelsListChangeHandler, } of [
        {
            selector: "#qjh-menu-feat-courses",
            gradeLevels: coursesGradeLevelsList,
            customGradeLevelsList: customGradeLevels,
            customGradeLevelsListChangeHandler: (value) => GM_setValue("qjh_customGradeLevels", value),
        },
        {
            selector: "#qjh-menu-feat-self-courses",
            gradeLevels: selfCoursesGradeLevelsList,
            customGradeLevelsList: customSelfGradeLevels,
            customGradeLevelsListChangeHandler: (value) => GM_setValue("qjh_customSelfGradeLevels", value),
        },
    ]) {
        const element = await waitForElementLoaded(selector);
        if (gradeLevels === null) {
            continue;
        }
        for (const gradeLevel of gradeLevels) {
            const label = document.createElement("label");
            label.className = "form-checkbox form-inline";
            const input = document.createElement("input");
            input.type = "checkbox";
            input.checked =
                customGradeLevelsList().indexOf(gradeLevel) !== -1;
            input.onchange = () => {
                if (input.checked) {
                    customGradeLevelsListChangeHandler(Array.of(...customGradeLevelsList(), gradeLevel));
                }
                else {
                    customGradeLevelsListChangeHandler(customGradeLevelsList().filter((it) => it !== gradeLevel));
                }
            };
            const i = document.createElement("i");
            i.className = "form-icon";
            label.appendChild(input);
            label.appendChild(i);
            label.append(gradeLevel);
            element.appendChild(label);
        }
    }
    const closeButton = await waitForElementLoaded("#qjh-menu-close-button");
    closeButton.onclick = () => {
        menuElement.style.display = "none";
    };
    const toggleInputs = nodeListToArray(document.querySelectorAll("input")).filter((element) => element.getAttribute("qjh-type") === "toggle");
    for (const toggleInput of toggleInputs) {
        const key = toggleInput.getAttribute("qjh-key");
        toggleInput.checked = GM_getValue(key);
        toggleInput.onchange = () => {
            GM_setValue(key, toggleInput.checked);
        };
    }
    const featButtons = nodeListToArray(document.querySelectorAll("button")).filter((element) => element.getAttribute("qjh-feat-key") !== null);
    for (const featButton of featButtons) {
        const key = featButton.getAttribute("qjh-feat-key");
        const feature = features.find((feature) => feature.key === key);
        featButton.onclick = () => {
            if (feature.enabled()) {
                showMessage(`手动激活功能：${feature.title}`, "green");
                feature.task();
            }
            else {
                showMessage(`功能 ${feature.title} 未被启用！`, "red");
            }
        };
    }
}
async function startCourse(courseId) {
    const answers = await getCourseAnswers(courseId);
    if (answers === null) {
        showMessage(`[${courseId}] 无法获取当前课程的答案！`, "red");
        return false;
    }
    else {
        location.href = `https://www.2-class.com/courses/exams/${courseId}`;
    }
}
async function taskCourses(isSelfCourses) {
    if (!isLogined()) {
        showMessage("你还没有登录！", "red");
        return;
    }
    let gradeLevels = await (isSelfCourses
        ? selfCoursesGradeLevels
        : coursesGradeLevels)();
    if (gradeLevels === null) {
        showMessage(`获取年级名列表失败，功能已中止！`, "red");
        return;
    }
    console.debug("获取总年级名列表", gradeLevels);
    gradeLevels = isSelfCourses ? customSelfGradeLevels() : customGradeLevels();
    console.debug("已选择的年级列表", gradeLevels);
    for (const gradeLevel of gradeLevels) {
        const coursesList = isSelfCourses
            ? await getSelfCoursesByGradeLevel(gradeLevel)
            : await getCoursesByGradeLevel(gradeLevel);
        if (coursesList === null) {
            showMessage(`[${gradeLevel}] 获取当前年级的课程列表失败，已跳过当前年级！`, "red");
        }
        const courseIds = coursesList
            .filter((it) => !it.isFinish && it.title !== "期末考试")
            .map((it) => it.courseId);
        if (courseIds.length === 0) {
            console.debug(`[${gradeLevel}] 所有${isSelfCourses ? "自学" : ""}课程都是完成状态，已跳过！`);
            return;
        }
        console.debug(`[${gradeLevel}] 未完成的${isSelfCourses ? "自学" : ""}课程`, courseIds);
        let committed = 0;
        for (const courseId of courseIds) {
            if (courseId === "finalExam") {
                return;
            }
            if (!isNone(courseId)) {
                const result = await startCourse(courseId);
                if (result) {
                    committed++;
                }
                else {
                    console.error(`[${courseId}] 无法提交当前课程，已跳过！`);
                }
            }
            else {
                console.error(`[${gradeLevel}] 无法找到 courseId，已跳过！`);
            }
        }
        showMessage(`成功完成了 ${committed} 个${isSelfCourses ? "自学" : ""}课程！`, "green");
    }
}
async function taskSingleCourse() {
    if (!isLogined()) {
        showMessage("你还没有登录！", "red");
        return;
    }
    const courseId = location.pathname.match(/(\d+)/g)[0];
    const answers = await getCourseAnswers(courseId);
    await emulateExamination(answers, "#app > div > div.home-container > div > div > div > div > div > button", "#app > div > div.home-container > div > div > div > div > div > div.exam-content-btnbox > button", "#app > div > div.home-container > div > div > div > div > div > div.exam-content-btnbox > div > button.ant-btn-primary", (answers, _) => {
        const firstAnswer = answers.shift().toString();
        return {
            answer: firstAnswer,
            matchedQuestion: null,
        };
    }, `答题 [${courseId}]`, answers.length);
    const passText = await waitForElementLoaded("#app > div > div.home-container > div > div > div > div.exam-box > div > div > p.exam-pass-title");
    if (passText) {
        const courses = [];
        const courseLevels = customGradeLevels();
        for (const courseLevel of courseLevels) {
            const result = await getCoursesByGradeLevel(courseLevel);
            for (const course of result) {
                courses.push(course);
            }
        }
        const courseIds = courses
            .filter((it) => !it.isFinish && it.title !== "期末考试")
            .map((it) => it.courseId);
        if (courseIds.length === 0) {
            showMessage("所有的课程已全部自动完成！", "green");
            location.href = "https://www.2-class.com/courses/";
        }
        else {
            location.href = `https://www.2-class.com/courses/exams/${courseIds[0]}`;
        }
    }
}
async function emulateExamination(answers, startButtonSelector, primaryNextButtonSelector, secondaryNextButtonSelector, answerHandler, examinationName, size = 100) {
    let isExaminationStarted = false;
    let count = 0;
    const next = async (nextAnswers, nextButton = null) => {
        const questionElement = await waitForElementLoaded(".exam-content-question");
        const questionText = removeSpaces(questionElement.innerText.split("\n")[0] // 获取第一行（题目都是在第一行）
        );
        if (!isExaminationStarted) {
            const _firstNextButton = await waitForElementLoaded(primaryNextButtonSelector);
            isExaminationStarted = true;
            await next(nextAnswers, _firstNextButton);
        }
        else {
            if (count > 0) {
                nextButton = document.querySelector(secondaryNextButtonSelector);
            }
            if (!isNone(size) && count < size) {
                nextButton.onclick = () => {
                    setTimeout(() => next(nextAnswers, nextButton), 200);
                    return;
                };
                let { answer, matchedQuestion } = answerHandler(answers, questionText);
                const selections = document.getElementsByClassName("exam-single-content-box");
                console.debug("选择", answer, selections);
                const displayAnswer = toDisplayAnswer(answer);
                const finalQuestion = matchedQuestion || questionText;
                if (!isFullAutomaticEmulationEnabled()) {
                    showMessage(`${finalQuestion ? finalQuestion + "\n" : ""}第 ${count + 1} 题答案：${displayAnswer}`, "green");
                }
                for (const answerIndex of answer.split(",").map((it) => Number(it))) {
                    const selectionElement = selections[answerIndex];
                    selectionElement.click();
                }
                if (isFullAutomaticEmulationEnabled()) {
                    nextButton.click();
                }
                count++;
            }
        }
    };
    const startButton = await waitForElementLoaded(startButtonSelector);
    if (isFullAutomaticEmulationEnabled()) {
        showMessage(`自动开始 ${examinationName}！`, "blue");
        startButton.click();
        next(answers, null);
    }
    else {
        startButton.onclick = () => {
            showMessage(`开始 ${examinationName}！`, "blue");
            next(answers, null);
        };
    }
}
async function taskSkip() {
    if (!isLogined()) {
        showMessage("你还没有登录！", "red");
        return;
    }
    const courseId = location.pathname.match(/(\d+)/g)[0];
    const span = await waitForElementLoaded("#app > div > div.home-container > div > div > div.course-title-box > div > a > span");
    span.style.display = "inline-flex";
    const skipButton = document.createElement("button");
    skipButton.type = "button";
    skipButton.className = "ant-btn ant-btn-danger ant-btn-lg";
    const skipSpan = document.createElement("span");
    skipSpan.innerText = "跳过";
    skipButton.appendChild(skipSpan);
    skipButton.onclick = () => {
        location.href = `/courses/exams/${courseId}`;
    };
    span.appendChild(skipButton);
}
async function taskGetCredit() {
    if (!isLogined()) {
        showMessage("你还没有登录！", "red");
        return;
    }
    const num = await addMedal();
    if (num !== undefined) {
        showMessage(`成功领取禁毒徽章 [${num}]!`, "green");
    }
    else if (num === null) {
        showMessage("领取徽章失败！", "red");
    }
    else {
        console.warn("无法领取徽章（可能已领取过），已跳过！");
    }
    const categories = [
        { name: "public_good", tag: "read" },
        { name: "ma_yun_recommend", tag: "labour" }, // the `ma_yun_recommend` has lots of sub-categorys
        { name: "ma_yun_recommend", tag: "movie" },
        { name: "ma_yun_recommend", tag: "music" },
        { name: "ma_yun_recommend", tag: "physicalEducation" },
        { name: "ma_yun_recommend", tag: "arts" },
        { name: "ma_yun_recommend", tag: "natural" },
        { name: "ma_yun_recommend", tag: "publicWelfareFoundation" },
        { name: "school_safe", tag: "safeVolunteer" },
    ];
    let done = 0;
    let failed = 0;
    let liked = 0;
    for (const category of categories) {
        const data = {
            categoryName: category.name,
            pageNo: 1,
            pageSize: 100,
            reqtoken: reqtoken(),
            tag: category.tag,
        };
        const resources = await getBeforeResourcesByCategoryName(data);
        if (resources === null) {
            console.error(`无法获取分类 ${category.name} 的资源，已跳过！`);
            continue;
        }
        console.debug(`获取分类 ${category.name} 的资源`, resources);
        for (const resource of resources) {
            const resourceId = resource.resourceId;
            const resourceData = { resourceId, reqtoken: reqtoken() };
            const result = await addPCPlayPV(resourceData);
            if (result) {
                console.debug(`成功完成资源 [${resourceId}]：${resource.title}`);
                done++;
            }
            else {
                console.error(`无法完成资源 ${resourceId}，已跳过！`);
                failed++;
            }
            const likeResult = await likePC(resourceData);
            if (likeResult) {
                console.debug(`成功点赞资源 [${resourceId}]！`);
                liked++;
            }
            else {
                console.error(`资源点赞失败 [${resourceId}]，已跳过！`);
            }
        }
    }
    let beforeDone = done;
    const checkSuccess = setInterval(() => {
        if (done !== 0) {
            if (done === beforeDone) {
                showMessage(`成功完成 ${done}/${failed} 个资源，点赞 ${liked} 个！`, "green");
                clearInterval(checkSuccess);
            }
            else {
                beforeDone = done;
            }
        }
    }, 500);
}
async function taskFinalExamination() {
    const supportedFinal = libs.supportedFinal;
    const gradeLevel = accountGradeLevel();
    if (supportedFinal.hasOwnProperty(gradeLevel)) {
        const paperName = supportedFinal[gradeLevel];
        let papers = libs[paperName];
        papers = papers.map((it) => {
            return { question: it.question, answer: toAnswer(it.answer) };
        });
        await emulateExamination(papers.map((it) => it.answer), "#app > div > div.home-container > div > div > div > div > div > button", "#app > div > div.home-container > div > div > div > div > div > div.exam-content-btnbox > button", "#app > div > div.home-container > div > div > div > div > div > div.exam-content-btnbox > div > button.ant-btn.ant-btn-primary", (_, question) => {
            const { answer, realQuestion } = accurateFind(papers, question) || fuzzyFind(papers, question);
            return {
                answer,
                matchedQuestion: realQuestion,
            };
        }, "期末考试", 10 // TODO 这个 10 是干什么的我还没搞清楚，之后再说
        );
    }
    else {
        showMessage(`你的年级 [${gradeLevel}] 暂未支持期末考试！`, "red");
        return;
    }
}
async function taskMultiComplete() {
}
function showMessage(text, color) {
    Toastify({
        text,
        duration: toastifyDuration,
        newWindow: true,
        gravity: toastifyGravity,
        position: toastifyPosition,
        stopOnFocus: true,
        style: { background: color },
    }).showToast();
}
function featureNotAvailable(name = "(未知)") {
    showMessage(`${name} 功能当前不可用，请尝试刷新页面。如果问题依旧请上报这个 bug！`, "red");
}
function isNone(obj) {
    return obj == undefined || obj == null;
}
function getGMValue(name, defaultValue) {
    let value = GM_getValue(name);
    if (isNone(value)) {
        value = defaultValue;
        GM_setValue(name, defaultValue);
    }
    return value;
}
async function waitForElementLoaded(querySelector) {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const tryFind = () => {
            const element = document.querySelector(querySelector);
            if (element) {
                resolve(element);
            }
            else {
                attempts++;
                if (attempts >= 30) {
                    console.error(`无法找到元素 [${querySelector}]，已放弃！`);
                    reject();
                }
                else {
                    setTimeout(tryFind, 250 * Math.pow(1.1, attempts));
                }
            }
        };
        tryFind();
    });
}
function removeSpaces(string) {
    return string.replace(/\s*/g, "");
}
function toDisplayAnswer(answer) {
    const alphas = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    let result = "";
    for (const singleAnswer of answer.split(",")) {
        const index = Number(singleAnswer);
        result = result + alphas[index];
    }
    return result;
}
function toAnswer(answers) {
    const alphas = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    let result = "";
    for (const answer of answers) {
        result = result + alphas.indexOf(answer);
    }
    return result;
}
function nodeListToArray(nodeList) {
    return Array.prototype.slice.call(nodeList);
}
function converToGenericGradeLevel(gradeLevel) {
    const mapping = {
        七年级: "初一",
        八年级: "初二",
        九年级: "初三",
    };
    return mapping[gradeLevel];
}
function arrayDiff(array1, array2) {
    return array1.concat(array2).filter((v, _, array) => {
        return array.indexOf(v) === array.lastIndexOf(v);
    });
}
function accurateFind(papers, question) {
    const result = papers.find((it) => removeSpaces(it.question) === question);
    if (!isNone(result)) {
        console.debug(`精确匹配问题：${question} → ${result.question}`);
        return { answer: result.answer, realQuestion: question };
    }
    else {
        return null;
    }
}
function fuzzyFind(papers, question) {
    const chars = question.split("");
    const length = chars.length;
    const percentages = [];
    for (const paper of papers) {
        const questionChars = paper.question.split("");
        const diff = arrayDiff(chars, questionChars);
        const diffLength = diff.length;
        const percentage = diffLength / length;
        percentages.push({
            question: paper.question,
            answer: paper.answer,
            unconfidence: percentage,
        });
    }
    const theMostConfident = percentages.sort((a, b) => a.unconfidence - b.unconfidence)[0];
    const theMostConfidentQuestion = theMostConfident.question;
    const confidence = 1 - theMostConfident.unconfidence;
    console.debug(`模糊匹配问题（${confidence}）：${question} → ${theMostConfidentQuestion}`);
    return {
        answer: theMostConfident.answer,
        realQuestion: theMostConfidentQuestion,
    };
}
async function insertValue(input, value) {
    input.value = value;
    const event = new Event("input", {
        bubbles: true,
    });
    const tracker = input._valueTracker;
    event.simulated = true;
    if (tracker) {
        tracker.setValue(value);
    }
    input.dispatchEvent(event);
}
async function login(account, password) {
    const loginButton = await waitForElementLoaded("#app > div > div.home-container > div > div > main > div.white-bg-panel > div.login_home > div > div.padding-panel.btn-panel > div > button");
    loginButton.click();
    const accountInput = (await waitForElementLoaded("#account"));
    const passwordInput = (await waitForElementLoaded("#password"));
    passwordInput.type = "text";
    const submitButton = await waitForElementLoaded("body > div:nth-child(14) > div > div.ant-modal-wrap > div > div.ant-modal-content > div > form > div > div > div > button");
    await new Promise((resolve) => setTimeout(resolve, 500));
    await insertValue(accountInput, account);
    await insertValue(passwordInput, password);
    submitButton.click();
    waitForElementLoaded("#login_nc")
        .then(async () => {
        showMessage("正在进行模拟滑块验证，请稍等...", "green");
        await mockVerify();
        waitForElementLoaded("div > div > div > div.ant-notification-notice-description").then(() => {
            showMessage("检测到滑块验证登入失败，请重新刷新网页并确保开发者工具处于开启状态！", "red");
        });
    })
        .catch(() => {
        console.log("无滑块验证出现，已直接登入");
    });
}
async function mockVerify() {
    const mockDistance = 394; // 滑块验证的长度
    const mockInterval = 20; // 滑动间隔
    const mockButtonId = "nc_1_n1z"; // 滑块验证的可交互按钮 ID
    const verifyButton = document.getElementById(mockButtonId);
    const clientRect = verifyButton.getBoundingClientRect();
    const x = clientRect.x;
    const y = clientRect.y;
    const mousedown = new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y,
    });
    verifyButton.dispatchEvent(mousedown);
    let dx = 0;
    let dy = 0;
    const timer = setInterval(function () {
        const _x = x + dx;
        const _y = y + dy;
        const mousemoveEvent = new MouseEvent("mousemove", {
            bubbles: true,
            cancelable: true,
            clientX: _x,
            clientY: _y,
        });
        verifyButton.dispatchEvent(mousemoveEvent);
        if (_x - x >= mockDistance) {
            clearInterval(timer);
            const mouseupEvent = new MouseEvent("mouseup", {
                bubbles: true,
                cancelable: true,
                clientX: _x,
                clientY: _y,
            });
            verifyButton.dispatchEvent(mouseupEvent);
        }
        else {
            dx += Math.ceil(Math.random() * 50);
        }
    }, mockInterval);
}
const container = document.createElement("div");
container.setAttribute("id", "qjh-menu");
container.innerHTML = `<style>
  .qjh-menu {
    height: max-content;
    box-shadow: 1px 1px 10px #909090;
    padding: 1em;
    position: fixed;
    z-index: 999;
    right: 1%;
    top: 3%;
    width: 25%;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
  }

  .form-inline {
    display: inline-block;
  }
</style>

<div class="card container qjh-menu">
  <div class="card-header">
    <div class="card-title text-bold h5" id="qjh-menu-title">
      QingJiaoHelper
      <button
        class="btn btn-link float-right"
        type="button"
        id="qjh-menu-close-button"
      >
        ❌
      </button>
    </div>
  </div>

  <div class="card-body">
    <div class="toast toast-warning">
      ⚠注意：勾选的功能会在下一次刷新页面时<mark><b>自动激活</b></mark
      >，未勾选的功能只能手动启用！点击<b>一键完成</b>按钮可以在这个菜单中直接完成，而不用手动跳转到对应页面。
    </div>

    <div class="divider text-center" data-content="功能"></div>

    <div>
      <div class="form-group" id="qjh-menu-feat-courses">
        <label class="form-switch">
          <b>完成所选年级的课程</b>
          <input
            type="checkbox"
            qjh-type="toggle"
            qjh-key="qjh_isTaskCoursesEnabled"
          />
          <i class="form-icon"></i>
          <button class="btn btn-sm mx-2" type="button" qjh-feat-key="courses">
            一键完成👉
          </button>
        </label>
      </div>

      <div class="form-group" id="qjh-menu-feat-self-courses">
        <label class="form-switch">
          <b>完成所选年级的自学课程</b>
          <input
            type="checkbox"
            qjh-type="toggle"
            qjh-key="qjh_isTaskSelfCourseEnabled"
          />
          <i class="form-icon"></i>
          <button
            class="btn btn-sm mx-2"
            type="button"
            qjh-feat-key="selfCourse"
          >
            一键完成👉
          </button>
        </label>
      </div>

      <div class="form-group">
        <label class="form-switch">
          <b>获取每日学分</b>
          <input
            type="checkbox"
            qjh-type="toggle"
            qjh-key="qjh_isTaskGetCreditEnabled"
          />
          <i class="form-icon"></i>
          <button
            class="btn btn-sm mx-2"
            type="button"
            onclick="taskGetCredit"
            qjh-feat-key="credit"
          >
            一键完成👉
          </button>
        </label>
      </div>

      <div class="form-group">
        <label class="form-switch">
          <b>期末考试（推荐和<mark>自动下一题并提交</mark>功能一起使用）</b>
          <input
            type="checkbox"
            qjh-type="toggle"
            qjh-key="qjh_isTaskFinalExaminationEnabled"
          />
          <i class="form-icon"></i>
        </label>
      </div>

      <div class="form-group">
        <label class="form-switch">
          <b>课程自动填充答案</b>
          <input
            type="checkbox"
            qjh-type="toggle"
            qjh-key="qjh_isTaskSingleCourseEnabled"
          />
          <i class="form-icon"></i>
        </label>
      </div>

      <div class="form-group">
        <label class="form-switch">
          <b>自动下一题并提交（可以和<mark>课程自动填充答案</mark>配合使用）</b>
          <input
            type="checkbox"
            qjh-type="toggle"
            qjh-key="qjh_isFullAutomaticEmulationEnabled"
          />
          <i class="form-icon"></i>
        </label>
      </div>

      <div class="form-group">
        <label class="form-switch">
          <b>显示课程视频跳过按钮</b>
          <input
            type="checkbox"
            qjh-type="toggle"
            qjh-key="qjh_isTaskSkipEnabled"
          />
          <i class="form-icon"></i>
        </label>
      </div>

      <div class="divider"></div>
    </div>
  </div>
  <div class="card-footer text-gray">
    本脚本由 WindLeaf233 以
    <b><a href="https://www.gnu.org/licenses/gpl-3.0.en.html">GPL-3.0</a></b>
    开源许可在 GitHub 开源，脚本地址：<a
      href="https://github.com/WindLeaf233/QingJiaoHelper"
      target="_blank"
      >GitHub</a
    >、<a
      href="https://greasyfork.org/zh-CN/scripts/452984-qingjiaohelper"
      target="_blank"
      >GreasyFork</a
    >。
  </div>
</div>
`;
container.style.display = "none";
document.body.appendChild(container);
function showMenu() {
    container.style.display = "unset";
}
