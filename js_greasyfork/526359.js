// ==UserScript==
// @name         atcoder-difficulty-display-cn
// @namespace    https://github.com/sky390
// @version      2.0.4
// @description  显示 AtCoder 问题的难度。
// @author       Sky390
// @license      MIT
// @supportURL   https://github.com/hotaru-n/atcoder-difficulty-display/issues
// @match        https://atcoder.jp/contests/*
// @exclude      https://atcoder.jp/contests/
// @match        https://atcoder.jp/settings
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://greasyfork.org/scripts/437862-atcoder-problems-api/code/atcoder-problems-api.js?version=1004589
// @downloadURL https://update.greasyfork.org/scripts/526359/atcoder-difficulty-display-cn.user.js
// @updateURL https://update.greasyfork.org/scripts/526359/atcoder-difficulty-display-cn.meta.js
// ==/UserScript==
const nonPenaltyJudge = ["AC", "CE", "IE", "WJ", "WR"];
/** 设置 防止剧透的 ID 和 Key */
const hideDifficultyID = "hide-difficulty-atcoder-difficulty-display";
/**
 * 向后兼容处理
 */
const backwardCompatibleProcessing = () => {
    const oldLocalStorageKeys = [
        "atcoderDifficultyDisplayUserSubmissions",
        "atcoderDifficultyDisplayUserSubmissionslastFetchedAt",
        "atcoderDifficultyDisplayEstimatedDifficulties",
        "atcoderDifficultyDisplayEstimatedDifficultieslastFetchedAt",
    ];
    /** 删除旧版本的 localStorage 数据 */
    oldLocalStorageKeys.forEach((key) => {
        localStorage.removeItem(key);
    });
};
const getTypical90Difficulty = (title) => {
    if (title.includes("★1"))
        return 149;
    if (title.includes("★2"))
        return 399;
    if (title.includes("★3"))
        return 799;
    if (title.includes("★4"))
        return 1199;
    if (title.includes("★5"))
        return 1599;
    if (title.includes("★6"))
        return 1999;
    if (title.includes("★7"))
        return 2399;
    return NaN;
};
const getTypical90Description = (title) => {
    if (title.includes("★1"))
        return "200 点问题级别";
    if (title.includes("★2"))
        return "300 点问题级别";
    if (title.includes("★3"))
        return "";
    if (title.includes("★4"))
        return "400 点问题级别";
    if (title.includes("★5"))
        return "500 点问题级别";
    if (title.includes("★6"))
        return "如果能稳定解决这个，就是高级者";
    if (title.includes("★7"))
        return "挑战问题";
    return "错误: 读取竞赛典型 90 问的难度失败";
};
const addTypical90Difficulty = (problemModels, problems) => {
    const models = problemModels;
    const problemsT90 = problems.filter((element) => element.contest_id === "typical90");
    problemsT90.forEach((element) => {
        const difficulty = getTypical90Difficulty(element.title);
        const model = {
            slope: NaN,
            intercept: NaN,
            variance: NaN,
            difficulty,
            discrimination: NaN,
            irt_loglikelihood: NaN,
            irt_users: NaN,
            is_experimental: false,
            extra_difficulty: `${getTypical90Description(element.title)}`,
        };
        models[element.id] = model;
    });
    return models;
};

// 引用下列代码
// [AtCoderProblems/theme\.ts at master · kenkoooo/AtCoderProblems](https://github.com/kenkoooo/AtCoderProblems/blob/master/atcoder-problems-frontend/src/style/theme.ts)
// 8b1b86c740e627e59abf056a11c00582e12b30ff
const ThemeLight = {
    difficultyBlackColor: "#404040",
    difficultyGreyColor: "#808080",
    difficultyBrownColor: "#804000",
    difficultyGreenColor: "#008000",
    difficultyCyanColor: "#00C0C0",
    difficultyBlueColor: "#0000FF",
    difficultyYellowColor: "#C0C000",
    difficultyOrangeColor: "#FF8000",
    difficultyRedColor: "#FF0000",
};
({
    ...ThemeLight,
    difficultyBlackColor: "#FFFFFF",
    difficultyGreyColor: "#C0C0C0",
    difficultyBrownColor: "#B08C56",
    difficultyGreenColor: "#3FAF3F",
    difficultyCyanColor: "#42E0E0",
    difficultyBlueColor: "#8888FF",
    difficultyYellowColor: "#FFFF56",
    difficultyOrangeColor: "#FFB836",
    difficultyRedColor: "#FF6767",
});

// 引用并编辑下列代码
// [AtCoderProblems/index\.ts at master · kenkoooo/AtCoderProblems](https://github.com/kenkoooo/AtCoderProblems/blob/master/atcoder-problems-frontend/src/utils/index.ts)
// 5835f5dcacfa0cbdcc8ab1116939833d5ab71ed4
const clipDifficulty = (difficulty) => Math.round(difficulty >= 400 ? difficulty : 400 / Math.exp(1.0 - difficulty / 400));
const RatingColors = [
    "Black",
    "Grey",
    "Brown",
    "Green",
    "Cyan",
    "Blue",
    "Yellow",
    "Orange",
    "Red",
];
const getRatingColor = (rating) => {
    const index = Math.min(Math.floor(rating / 400), RatingColors.length - 2);
    return RatingColors[index + 1] ?? "Black";
};
const getRatingColorClass = (rating) => {
    const ratingColor = getRatingColor(rating);
    switch (ratingColor) {
        case "Black":
            return "difficulty-black";
        case "Grey":
            return "difficulty-grey";
        case "Brown":
            return "difficulty-brown";
        case "Green":
            return "difficulty-green";
        case "Cyan":
            return "difficulty-cyan";
        case "Blue":
            return "difficulty-blue";
        case "Yellow":
            return "difficulty-yellow";
        case "Orange":
            return "difficulty-orange";
        case "Red":
            return "difficulty-red";
        default:
            return "difficulty-black";
    }
};
const getRatingColorCode = (ratingColor, theme = ThemeLight) => {
    switch (ratingColor) {
        case "Black":
            return theme.difficultyBlackColor;
        case "Grey":
            return theme.difficultyGreyColor;
        case "Brown":
            return theme.difficultyBrownColor;
        case "Green":
            return theme.difficultyGreenColor;
        case "Cyan":
            return theme.difficultyCyanColor;
        case "Blue":
            return theme.difficultyBlueColor;
        case "Yellow":
            return theme.difficultyYellowColor;
        case "Orange":
            return theme.difficultyOrangeColor;
        case "Red":
            return theme.difficultyRedColor;
        default:
            return theme.difficultyBlackColor;
    }
};

// 引用并编辑下列代码
// [AtCoderProblems/TopcoderLikeCircle\.tsx at master · kenkoooo/AtCoderProblems](https://github.com/kenkoooo/AtCoderProblems/blob/master/atcoder-problems-frontend/src/components/TopcoderLikeCircle.tsx)
// 02d7ed77d8d8a9fa8d32cb9981f18dfe53f2c5f0
// FIXME: 支持黑暗主题
const useTheme = () => ThemeLight;
const getRatingMetalColorCode = (metalColor) => {
    switch (metalColor) {
        case "Bronze":
            return { base: "#965C2C", highlight: "#FFDABD" };
        case "Silver":
            return { base: "#808080", highlight: "white" };
        case "Gold":
            return { base: "#FFD700", highlight: "white" };
        default:
            return { base: "#FFD700", highlight: "white" };
    }
};
const getStyleOptions = (color, fillRatio, theme) => {
    if (color === "Bronze" || color === "Silver" || color === "Gold") {
        const metalColor = getRatingMetalColorCode(color);
        return {
            borderColor: metalColor.base,
            background: `linear-gradient(to right, \
        ${metalColor.base}, ${metalColor.highlight}, ${metalColor.base})`,
        };
    }
    const colorCode = getRatingColorCode(color, theme);
    return {
        borderColor: colorCode,
        background: `border-box linear-gradient(to top, \
        ${colorCode} ${fillRatio * 100}%, \
        rgba(0,0,0,0) ${fillRatio * 100}%)`,
    };
};
const topcoderLikeCircle = (color, rating, big = true, extraDescription = "") => {
    const fillRatio = rating >= 3200 ? 1.0 : (rating % 400) / 400;
    const className = `topcoder-like-circle
  ${big ? "topcoder-like-circle-big" : ""} rating-circle`;
    const theme = useTheme();
    const styleOptions = getStyleOptions(color, fillRatio, theme);
    const styleOptionsString = `border-color: ${styleOptions.borderColor}; background: ${styleOptions.background};`;
    const content = extraDescription
        ? `Difficulty: ${extraDescription}`
        : `Difficulty: ${rating}`;
    // FIXME: Tooltip中添加解决问题和解决时间
    return `<span
            class="${className}" style="${styleOptionsString}"
            data-toggle="tooltip" title="${content}" data-placement="bottom"
          />`;
};

// 引用并编辑下列代码
// [AtCoderProblems/DifficultyCircle\.tsx at master · kenkoooo/AtCoderProblems](https://github.com/kenkoooo/AtCoderProblems/blob/master/atcoder-problems-frontend/src/components/DifficultyCircle.tsx)
// 0469e07274fda2282c9351c2308ed73880728e95
const getColor = (difficulty) => {
    if (difficulty < 3200)
        return getRatingColor(difficulty);
    if (difficulty < 3600)
        return "Bronze";
    if (difficulty < 4000)
        return "Silver";
    return "Gold";
};
const difficultyCircle = (difficulty, big = true, extraDescription = "") => {
    if (Number.isNaN(difficulty)) {
        // 不可用的难度圆与问题不同，使用 Glyphicon 的「?」
        const className = `glyphicon glyphicon-question-sign aria-hidden='true'
    difficulty-unavailable
    ${big ? "difficulty-unavailable-icon-big" : "difficulty-unavailable-icon"}`;
        const content = "难度不可用。";
        return `<span
              class="${className}"
              data-toggle="tooltip" title="${content}" data-placement="bottom"
            />`;
    }
    const color = getColor(difficulty);
    return topcoderLikeCircle(color, difficulty, big, extraDescription);
};

var html = "<h2>atcoder-difficulty-display</h2>\n<hr>\n<a href=\"https://github.com/hotaru-n/atcoder-difficulty-display\">GitHub</a>\n<div class=\"form-horizontal\">\n  <div class=\"form-group\">\n    <label class=\"control-label col-sm-3\">防止剧透</label>\n    <div class=\"col-sm-5\">\n      <div class=\"checkbox\">\n        <label>\n          <input type=\"checkbox\" id=\"hide-difficulty-atcoder-difficulty-display\">\n          按下屏幕上的按钮后显示难度\n        </label>\n      </div>\n    </div>\n  </div>\n</div>\n";

var css = ".difficulty-red {\n  color: #ff0000;\n}\n\n.difficulty-orange {\n  color: #ff8000;\n}\n\n.difficulty-yellow {\n  color: #c0c000;\n}\n\n.difficulty-blue {\n  color: #0000ff;\n}\n\n.difficulty-cyan {\n  color: #00c0c0;\n}\n\n.difficulty-green {\n  color: #008000;\n}\n\n.difficulty-brown {\n  color: #804000;\n}\n\n.difficulty-grey {\n  color: #808080;\n}\n\n.topcoder-like-circle {\n  display: block;\n  border-radius: 50%;\n  border-style: solid;\n  border-width: 1px;\n  width: 12px;\n  height: 12px;\n}\n\n.topcoder-like-circle-big {\n  border-width: 3px;\n  width: 25px;\n  height: 25px;\n}\n\n.rating-circle {\n  margin-right: 5px;\n  display: inline-block;\n}\n\n.difficulty-unavailable {\n  color: #17a2b8;\n}\n\n.difficulty-unavailable-icon {\n  margin-right: 0.3px;\n}\n\n.difficulty-unavailable-icon-big {\n  font-size: 36px;\n  margin-right: 5px;\n}\n\n.label-status-a {\n  color: white;\n}\n\n.label-success-after-contest {\n  background-color: #9ad59e;\n}\n\n.label-warning-after-contest {\n  background-color: #ffdd99;\n}";

// 解析 AtCoder 的问题页面
/**
 * 解析 URL，去除参数 \
 * 例: in:  https://atcoder.jp/contests/abc210?lang=en \
 * 例: out: (5)['https:', '', 'atcoder.jp', 'contests', 'abc210']
 */
const parseURL = (url) => {
    // 按分隔符`/`分割
    // 删除`?`后面的字符串以去除参数
    return url.split("/").map((x) => x.replace(/\?.*/i, ""));
};
const URL = parseURL(window.location.href);
/**
 * 从表格单元元素中查找前一个元素的文本与参数匹配的元素
 * 假设用于单独提交页面
 * 例: searchSubmissionInfo(["问题", "Task"])
 */
const searchSubmissionInfo = (key) => {
    const tdTags = document.getElementsByTagName("td");
    const tdTagsArray = Array.prototype.slice.call(tdTags);
    return tdTagsArray.filter((elem) => {
        const prevElem = elem.previousElementSibling;
        const text = prevElem?.textContent;
        if (typeof text === "string")
            return key.includes(text);
        return false;
    })[0];
};
/** 比赛标题 例: AtCoder Beginner Contest 210 */
document.getElementsByClassName("contest-title")[0]?.textContent ?? "";
/** 比赛 ID 例: abc210 */
const contestID = URL[4] ?? "";
/**
 * 页面类型 \
 * 基本上是比赛 ID 后的路径
 * ### 例外
 * 单独问题: task
 * 单独提交: submission
 * 按下解说按钮后转到的单独问题的解说列表页面: task_editorial
 */
const pageType = (() => {
    if (URL.length < 6)
        return "";
    if (URL.length >= 7 && URL[5] === "submissions" && URL[6] !== "me")
        return "submission";
    if (URL.length >= 8 && URL[5] === "tasks" && URL[7] === "editorial")
        return "task_editorial";
    if (URL.length >= 7 && URL[5] === "tasks")
        return "task";
    return URL[5] ?? "";
})();
/** 问题 ID 例: abc210_a */
const taskID = (() => {
    if (pageType === "task") {
        // 在问题页面，从 URL 中提取问题 ID
        return URL[6] ?? "";
    }
    if (pageType === "submission") {
        // 在单独提交页面，从问题链接的 URL 中提取问题 ID
        // 获取提交信息中的问题的 URL
        const taskCell = searchSubmissionInfo(["问题", "Task"]);
        if (!taskCell)
            return "";
        const taskLink = taskCell.getElementsByTagName("a")[0];
        if (!taskLink)
            return "";
        const taskUrl = parseURL(taskLink.href);
        const taskIDParsed = taskUrl[6] ?? "";
        return taskIDParsed;
    }
    return "";
})();
/** 问题名 例: A - Cabbages */
(() => {
    if (pageType === "task") {
        // 在问题页面，从 h2 中提取问题名
        return (document
            .getElementsByClassName("h2")[0]
            ?.textContent?.trim()
            .replace(/\n.*/i, "") ?? "");
    }
    if (pageType === "submission") {
        // 在单独提交页面，从问题链接的文本中提取问题名
        // 获取提交信息中的问题的文本
        const taskCell = searchSubmissionInfo(["问题", "Task"]);
        if (!taskCell)
            return "";
        const taskLink = taskCell.getElementsByTagName("a")[0];
        if (!taskLink)
            return "";
        return taskLink.textContent ?? "";
    }
    return "";
})();
/** 提交用户 例: machikane */
(() => {
    if (pageType !== "submission")
        return "";
    // 当处于单独提交页面时
    const userCell = searchSubmissionInfo(["用户", "User"]);
    if (!userCell)
        return "";
    return userCell?.textContent?.trim() ?? "";
})();
/** 提交结果 例: AC */
(() => {
    if (pageType !== "submission")
        return "";
    // 当处于单独提交页面时
    const statusCell = searchSubmissionInfo(["结果", "Status"]);
    if (!statusCell)
        return "";
    return statusCell?.textContent?.trim() ?? "";
})();
/** 得分 例: 100 */
(() => {
    if (pageType !== "submission")
        return 0;
    // 当处于单独提交页面时
    const scoreCell = searchSubmissionInfo(["得分", "Score"]);
    if (!scoreCell)
        return 0;
    return parseInt(scoreCell?.textContent?.trim() ?? "0", 10);
})();

/**
 * 返回得分最高的提交
 */
const parseMaxScore = (submissionsArg) => {
    if (submissionsArg.length === 0) {
        return undefined;
    }
    const maxScore = submissionsArg.reduce((left, right) => left.point > right.point ? left : right);
    return maxScore;
};
/**
 * 计算罚分数量
 */
const parsePenalties = (submissionsArg) => {
    let penalties = 0;
    let hasAccepted = false;
    submissionsArg.forEach((element) => {
        hasAccepted = element.result === "AC" || hasAccepted;
        if (!hasAccepted && !nonPenaltyJudge.includes(element.result)) {
            penalties += 1;
        }
    });
    return penalties;
};
/**
 * 返回第一次 AC 的提交
 */
const parseFirstAcceptedTime = (submissionsArg) => {
    const ac = submissionsArg.filter((element) => element.result === "AC");
    return ac[0];
};
/**
 * 返回代表性提交
 * 1. 最后一次 AC 的提交
 * 2. 最后一次提交
 * 3. undefined
 */
const parseRepresentativeSubmission = (submissionsArg) => {
    const ac = submissionsArg.filter((element) => element.result === "AC");
    const nonAC = submissionsArg.filter((element) => element.result !== "AC");
    if (ac.length > 0)
        return ac.slice(-1)[0];
    if (nonAC.length > 0)
        return nonAC.slice(-1)[0];
    return undefined;
};
/**
 * 解析提交并返回信息
 * 目标: 比赛前、中、后提交 其他比赛的相同问题的提交
 * 返回信息: 得分最高的提交 第一次 AC 的提交 代表性提交 罚分数量
 */
const analyzeSubmissions = (submissionsArg) => {
    const submissions = submissionsArg.filter((element) => element.problem_id === taskID);
    const beforeContest = submissions.filter((element) => element.contest_id === contestID &&
        element.epoch_second < startTime.unix());
    const duringContest = submissions.filter((element) => element.contest_id === contestID &&
        element.epoch_second >= startTime.unix() &&
        element.epoch_second < endTime.unix());
    const afterContest = submissions.filter((element) => element.contest_id === contestID && element.epoch_second >= endTime.unix());
    const anotherContest = submissions.filter((element) => element.contest_id !== contestID);
    return {
        before: {
            maxScore: parseMaxScore(beforeContest),
            firstAc: parseFirstAcceptedTime(beforeContest),
            representative: parseRepresentativeSubmission(beforeContest),
        },
        during: {
            maxScore: parseMaxScore(duringContest),
            firstAc: parseFirstAcceptedTime(duringContest),
            representative: parseRepresentativeSubmission(duringContest),
            penalties: parsePenalties(duringContest),
        },
        after: {
            maxScore: parseMaxScore(afterContest),
            firstAc: parseFirstAcceptedTime(afterContest),
            representative: parseRepresentativeSubmission(afterContest),
        },
        another: {
            maxScore: parseMaxScore(anotherContest),
            firstAc: parseFirstAcceptedTime(anotherContest),
            representative: parseRepresentativeSubmission(anotherContest),
        },
    };
};
/**
 * 生成提交状态标签
 */
const generateStatusLabel = (submission, type) => {
    if (submission === undefined) {
        return "";
    }
    const isAC = submission.result === "AC";
    let className = "";
    switch (type) {
        case "before":
            className = "label-primary";
            break;
        case "during":
            className = isAC ? "label-success" : "label-warning";
            break;
        case "after":
            className = isAC
                ? "label-success-after-contest"
                : "label-warning-after-contest";
            break;
        case "another":
            className = "label-default";
            break;
    }
    let content = "";
    switch (type) {
        case "before":
            content = "比赛前的提交";
            break;
        case "during":
            content = "比赛中的提交";
            break;
        case "after":
            content = "比赛后的提交";
            break;
        case "another":
            content = "其他比赛的相同问题的提交";
            break;
    }
    const href = `https://atcoder.jp/contests/${submission.contest_id}/submissions/${submission.id}`;
    return `<span class="label ${className}"
      data-toggle="tooltip" data-placement="bottom" title="${content}">
      <a class="label-status-a" href=${href}>${submission.result}</a>
    </span> `;
};
/**
 * 显示罚分数量
 */
const generatePenaltiesCount = (penalties) => {
    if (penalties <= 0) {
        return "";
    }
    const content = "比赛中的罚分数量";
    return `<span data-toggle="tooltip" data-placement="bottom" title="${content}" class="difficulty-red" style='font-weight: bold; font-size: x-small;'>
            (${penalties.toString()})
          </span>`;
};
/**
 * 显示第一次 AC 的时间
 */
const generateFirstAcTime = (submission) => {
    if (submission === undefined) {
        return "";
    }
    const content = "提交时间";
    const href = `https://atcoder.jp/contests/${submission.contest_id}/submissions/${submission.id}`;
    const elapsed = submission.epoch_second - startTime.unix();
    const elapsedSeconds = elapsed % 60;
    const elapsedMinutes = Math.trunc(elapsed / 60);
    return `<span data-toggle="tooltip" data-placement="bottom" style="padding-left: 8px;" title="${content}">
          <a class="difficulty-orange" style='font-weight: bold; font-size: x-small;' href=${href}>
            提交时间 ${elapsedMinutes}:${elapsedSeconds}
          </a>
        </span>`;
};
/**
 * 为马拉松生成得分显示的 span
 */
const generateScoreSpan = (submission, type) => {
    if (submission === undefined) {
        return "";
    }
    // 考虑到马拉松，因此暂时不显示 10000 分以下
    if (submission.point < 10000) {
        return "";
    }
    let className = "";
    switch (type) {
        case "before":
            className = "difficulty-blue";
            break;
        case "during":
            className = "difficulty-green";
            break;
        case "after":
            className = "difficulty-yellow";
            break;
        case "another":
            className = "difficulty-grey";
            break;
    }
    let content = "";
    switch (type) {
        case "before":
            content = "比赛前的提交";
            break;
        case "during":
            content = "比赛中的提交";
            break;
        case "after":
            content = "比赛后的提交";
            break;
        case "another":
            content = "其他比赛的相同问题的提交";
            break;
    }
    const href = `https://atcoder.jp/contests/${submission.contest_id}/submissions/${submission.id}`;
    return `<span
      data-toggle="tooltip" data-placement="bottom" title="${content}">
        <a class="${className}" style='font-weight: bold;' href=${href}>
          ${submission.point}
        </a>
    </span> `;
};

/**
 * 获取可着色元素的数组
 * * 单独问题页面的标题
 * * 问题的链接
 * * 解说页面的 H3 的问题名
 */
const getElementsColorizable = () => {
    const elementsColorizable = [];
    // 问题页面的标题
    if (pageType === "task") {
        const element = document.getElementsByClassName("h2")[0];
        if (element) {
            elementsColorizable.push({ element, taskID, big: true });
        }
    }
    // a 标签元素 假设是问题页面、提交页面等的链接
    const aTagsRaw = document.getElementsByTagName("a");
    let aTagsArray = Array.prototype.slice.call(aTagsRaw);
    // 问题页面最左侧的元素除外 以避免视觉问题
    aTagsArray = aTagsArray.filter((element) => !((pageType === "tasks" || pageType === "score") &&
        !element.parentElement?.previousElementSibling));
    // 左上角的日语/英语切换链接除外
    aTagsArray = aTagsArray.filter((element) => !element.href.includes("?lang="));
    // 解说页面问题名右侧的链接除外
    aTagsArray = aTagsArray.filter((element) => !(pageType === "editorial" &&
        element.children[0]?.classList.contains("glyphicon-new-window")));
    const aTagsConverted = aTagsArray.map((element) => {
        const url = parseURL(element.href);
        const taskIDFromURL = (url[url.length - 2] ?? "") === "tasks" ? url[url.length - 1] ?? "" : "";
        // 在单独解说页面时为 big
        const big = element.parentElement?.tagName.includes("H2") ?? false;
        // Comfortable AtCoder 的下拉菜单为 afterbegin
        const afterbegin = element.parentElement?.parentElement?.classList.contains("dropdown-menu") ?? false;
        return { element, taskID: taskIDFromURL, big, afterbegin };
    });
    elementsColorizable.push(...aTagsConverted);
    // h3 标签元素 假设是解说页面的问题名
    const h3TagsRaw = document.getElementsByTagName("h3");
    const h3TagsArray = Array.prototype.slice.call(h3TagsRaw);
    const h3TagsConverted = h3TagsArray.map((element) => {
        const url = parseURL(element.getElementsByTagName("a")[0]?.href ?? "");
        const taskIDFromURL = (url[url.length - 2] ?? "") === "tasks" ? url[url.length - 1] ?? "" : "";
        return { element, taskID: taskIDFromURL, big: true, afterbegin: true };
    });
    // FIXME: 其他用户脚本指定的元素着色功能
    // 考虑到如果有指定的类则作为目标
    // 用户脚本的执行顺序可以在用户脚本管理器的设置中更改
    elementsColorizable.push(...h3TagsConverted);
    return elementsColorizable;
};
/**
 * 获取问题状态（包含运行时间限制和内存限制的部分）的 HTML 对象
 */
const getElementOfProblemStatus = () => {
    if (pageType !== "task")
        return undefined;
    const psRaw = document
        ?.getElementById("main-container")
        ?.getElementsByTagName("p");
    const ps = Array.prototype.slice.call(psRaw);
    if (!psRaw)
        return undefined;
    const problemStatuses = ps.filter((p) => {
        return (p.textContent?.includes("内存限制") ||
            p.textContent?.includes("Memory Limit"));
    });
    return problemStatuses[0];
};

/** 常设比赛 ID 列表 */
const permanentContestIDs = [
    "practice",
    "APG4b",
    "abs",
    "practice2",
    "typical90",
    "math-and-algorithm",
    "tessoku-book",
];
// FIXME: FIXME: 如果在 Problems 中无法获取数据，则可以判断比赛尚未结束
/**
 * 如果当前页面的比赛已经结束则返回 true \
 * 作为例外处理，以下情况也返回 true
 * * 比赛是常设比赛
 * * 不在比赛页面 <https://atcoder.jp/contests/*>
 */
var isContestOver = () => {
    if (!(URL[3] === "contests" && URL.length >= 5))
        return true;
    if (permanentContestIDs.includes(contestID))
        return true;
    return Date.now() > endTime.valueOf();
};

/**
 * 比赛页面 <https://atcoder.jp/contests/*> 的处理 \
 * 主要处理
 */
const contestPageProcess = async () => {
    // 比赛结束前不需要，因此禁用
    if (!isContestOver())
        return;
    // FIXME: 支持黑暗主题
    GM_addStyle(css);
    /** 获取问题列表 */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const problems = await getProblems();
    /** 获取难度 */
    const problemModels = addTypical90Difficulty(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await getEstimatedDifficulties(), problems);
    // FIXME: 支持 PAST
    // FIXME: 支持 JOI 非官方难度表
    /** 获取提交状态 */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const submissions = await getSubmissions(userScreenName);
    // 获取可着色元素的数组
    // 排除没有难度的元素
    const elementsColorizable = getElementsColorizable().filter((element) => element.taskID in problemModels);
    // 获取问题状态（单独问题页面的运行时间限制和内存限制部分）
    const elementProblemStatus = getElementOfProblemStatus();
    /**
     * 执行着色处理
     */
    const colorizeElement = () => {
        // 给问题标题、问题链接着色
        elementsColorizable.forEach((element) => {
            const model = problemModels[element.taskID];
            // 如果难度为 Unavailable，则 difficulty 属性不存在
            // 将 difficulty 的值设为 NaN
            const difficulty = clipDifficulty(model?.difficulty ?? NaN);
            // 着色
            if (!Number.isNaN(difficulty)) {
                const color = getRatingColorClass(difficulty);
                // eslint-disable-next-line no-param-reassign
                element.element.classList.add(color);
            }
            else {
                element.element.classList.add("difficulty-unavailable");
            }
            // 🧪 添加
            if (model?.is_experimental) {
                element.element.insertAdjacentText("afterbegin", "🧪");
            }
            // ◒ 添加难度圆
            element.element.insertAdjacentHTML(element.afterbegin ? "afterbegin" : "beforebegin", difficultyCircle(difficulty, element.big, model?.extra_difficulty));
        });
        // 在单独问题页面添加难度等信息
        if (elementProblemStatus) {
            // 显示难度值
            // 如果不在难度估算的对象中，则该值为 undefined
            const model = problemModels[taskID];
            // 当难度为 Unavailable 时将 difficulty 的值设为 NaN
            // 如果难度为 Unavailable，则 difficulty 属性不存在
            const difficulty = clipDifficulty(model?.difficulty ?? NaN);
            // 着色
            let className = "";
            if (difficulty) {
                className = getRatingColorClass(difficulty);
            }
            else if (model) {
                className = "difficulty-unavailable";
            }
            else {
                className = "";
            }
            // 设置 Difficulty 的值
            let value = "";
            if (difficulty) {
                value = difficulty.toString();
            }
            else if (model) {
                value = "Unavailable";
            }
            else {
                value = "None";
            }
            // 🧪 添加
            const experimentalText = model?.is_experimental ? "🧪" : "";
            const content = `${experimentalText}${value}`;
            elementProblemStatus.insertAdjacentHTML("beforeend", ` / Difficulty:
        <span style='font-weight: bold;' class="${className}">${content}</span>`);
            /** 此问题的提交 假设已按提交时间排序 */
            const thisTaskSubmissions = submissions.filter((element) => element.problem_id === taskID);
            const analyze = analyzeSubmissions(thisTaskSubmissions);
            // 比赛前中后外的提交情况 显示比赛中回答时间和罚分数量
            let statuesHTML = "";
            statuesHTML += generateStatusLabel(analyze.before.representative, "before");
            statuesHTML += generateStatusLabel(analyze.during.representative, "during");
            statuesHTML += generateStatusLabel(analyze.after.representative, "after");
            statuesHTML += generateStatusLabel(analyze.another.representative, "another");
            statuesHTML += generatePenaltiesCount(analyze.during.penalties);
            statuesHTML += generateFirstAcTime(analyze.during.firstAc);
            if (statuesHTML.length > 0) {
                elementProblemStatus.insertAdjacentHTML("beforeend", ` / Status: ${statuesHTML}`);
            }
            // 显示比赛前中后外的 10000 分以上的最大得分
            // NOTE: 为马拉松考虑，因此设定为 10000 分以上
            let scoresHTML = "";
            scoresHTML += generateScoreSpan(analyze.before.maxScore, "before");
            scoresHTML += generateScoreSpan(analyze.during.maxScore, "during");
            scoresHTML += generateScoreSpan(analyze.after.maxScore, "after");
            scoresHTML += generateScoreSpan(analyze.another.maxScore, "another");
            if (scoresHTML.length > 0) {
                elementProblemStatus.insertAdjacentHTML("beforeend", ` / 得分: ${scoresHTML}`);
            }
        }
        // 启用 bootstrap3 的 tooltip 显示难度圆的值
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, no-undef
        $('[data-toggle="tooltip"]').tooltip();
    };
    // 执行着色处理
    if (!GM_getValue(hideDifficultyID, false)) {
        // 设置 防止剧透为 OFF 时不执行
        colorizeElement();
    }
    else {
        // 设置 防止剧透为 ON 时
        // 在页面顶部添加按钮 按下后执行着色处理
        const place = document.getElementsByTagName("h2")[0] ??
            document.getElementsByClassName("h2")[0] ??
            undefined;
        if (place) {
            place.insertAdjacentHTML("beforebegin", `<input type="button" id="${hideDifficultyID}" class="btn btn-info"
        value="显示难度" />`);
            const button = document.getElementById(hideDifficultyID);
            if (button) {
                button.addEventListener("click", () => {
                    button.style.display = "none";
                    colorizeElement();
                });
            }
        }
    }
};
/**
 * 设置页面 <https://atcoder.jp/settings> 的处理 \
 * 添加设置按钮
 */
const settingPageProcess = () => {
    const insertion = document.getElementsByClassName("form-horizontal")[0];
    if (insertion === undefined)
        return;
    insertion.insertAdjacentHTML("afterend", html);
    // 设置 防止剧透的复选框读取 切换 保存处理
    const hideDifficultyChechbox = document.getElementById(hideDifficultyID);
    if (hideDifficultyChechbox &&
        hideDifficultyChechbox instanceof HTMLInputElement) {
        hideDifficultyChechbox.checked = GM_getValue(hideDifficultyID, false);
        hideDifficultyChechbox.addEventListener("change", () => {
            GM_setValue(hideDifficultyID, hideDifficultyChechbox.checked);
        });
    }
};
/**
 * 最初执行的部分 \
 * 在执行公共处理后执行页面特定的处理
 */
(async () => {
    // 公共处理
    backwardCompatibleProcessing();
    // 页面特定的处理
    if (URL[3] === "contests" && URL.length >= 5) {
        await contestPageProcess();
    }
    if (URL[3] === "settings" && URL.length === 4) {
        settingPageProcess();
    }
})().catch((error) => {
    // eslint-disable-next-line no-console
    console.error("[atcoder-difficulty-display]", error);
});