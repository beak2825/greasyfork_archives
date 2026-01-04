// ==UserScript==
// @name         atcoder-difficulty-display
// @namespace    https://github.com/hotarunw
// @version      2.0.1
// @description  AtCoder Problemsの難易度を表示します。
// @author       hotaru-n
// @license      MIT
// @supportURL   https://github.com/hotarunw/atcoder-difficulty-display/issues
// @match        https://atcoder.jp/contests/*
// @exclude      https://atcoder.jp/contests/
// @match        https://atcoder.jp/settings
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://greasyfork.org/scripts/437862-atcoder-problems-api/code/atcoder-problems-api.js?version=1004589
// @downloadURL https://update.greasyfork.org/scripts/397185/atcoder-difficulty-display.user.js
// @updateURL https://update.greasyfork.org/scripts/397185/atcoder-difficulty-display.meta.js
// ==/UserScript==
const nonPenaltyJudge = ["AC", "CE", "IE", "WJ", "WR"];
/** 設定 ネタバレ防止のID, Key */
const hideDifficultyID = "hide-difficulty-atcoder-difficulty-display";
/**
 * 後方互換処理
 */
const backwardCompatibleProcessing = () => {
    const oldLocalStorageKeys = [
        "atcoderDifficultyDisplayUserSubmissions",
        "atcoderDifficultyDisplayUserSubmissionslastFetchedAt",
        "atcoderDifficultyDisplayEstimatedDifficulties",
        "atcoderDifficultyDisplayEstimatedDifficultieslastFetchedAt",
    ];
    /** 過去バージョンのlocalStorageデータを削除する */
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
        return "200 点問題レベル";
    if (title.includes("★2"))
        return "300 点問題レベル";
    if (title.includes("★3"))
        return "";
    if (title.includes("★4"))
        return "400 点問題レベル";
    if (title.includes("★5"))
        return "500 点問題レベル";
    if (title.includes("★6"))
        return "これが安定して解ければ上級者です";
    if (title.includes("★7"))
        return "チャレンジ問題枠です";
    return "エラー: 競プロ典型 90 問の難易度読み取りに失敗しました";
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

// 次のコードを引用
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

// 次のコードを引用・編集
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

// 次のコードを引用・編集
// [AtCoderProblems/TopcoderLikeCircle\.tsx at master · kenkoooo/AtCoderProblems](https://github.com/kenkoooo/AtCoderProblems/blob/master/atcoder-problems-frontend/src/components/TopcoderLikeCircle.tsx)
// 02d7ed77d8d8a9fa8d32cb9981f18dfe53f2c5f0
// FIXME: ダークテーマ対応
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
    // FIXME: TooltipにSolve Prob, Solve Timeを追加
    return `<span
            class="${className}" style="${styleOptionsString}"
            data-toggle="tooltip" title="${content}" data-placement="bottom"
          />`;
};

// 次のコードを引用・編集
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
        // Unavailableの難易度円はProblemsとは異なりGlyphiconの「?」を使用
        const className = `glyphicon glyphicon-question-sign aria-hidden='true'
    difficulty-unavailable
    ${big ? "difficulty-unavailable-icon-big" : "difficulty-unavailable-icon"}`;
        const content = "Difficulty is unavailable.";
        return `<span
              class="${className}"
              data-toggle="tooltip" title="${content}" data-placement="bottom"
            />`;
    }
    const color = getColor(difficulty);
    return topcoderLikeCircle(color, difficulty, big, extraDescription);
};

var html = "<h2>atcoder-difficulty-display</h2>\n<hr>\n<a href=\"https://github.com/hotaru-n/atcoder-difficulty-display\">GitHub</a>\n<div class=\"form-horizontal\">\n  <div class=\"form-group\">\n    <label class=\"control-label col-sm-3\">ネタバレ防止</label>\n    <div class=\"col-sm-5\">\n      <div class=\"checkbox\">\n        <label>\n          <input type=\"checkbox\" id=\"hide-difficulty-atcoder-difficulty-display\">\n          画面上のボタンを押した後に難易度が表示されるようにする\n        </label>\n      </div>\n    </div>\n  </div>\n</div>\n";

var css = ".difficulty-red {\n  color: #ff0000;\n}\n\n.difficulty-orange {\n  color: #ff8000;\n}\n\n.difficulty-yellow {\n  color: #c0c000;\n}\n\n.difficulty-blue {\n  color: #0000ff;\n}\n\n.difficulty-cyan {\n  color: #00c0c0;\n}\n\n.difficulty-green {\n  color: #008000;\n}\n\n.difficulty-brown {\n  color: #804000;\n}\n\n.difficulty-grey {\n  color: #808080;\n}\n\n.topcoder-like-circle {\n  display: block;\n  border-radius: 50%;\n  border-style: solid;\n  border-width: 1px;\n  width: 12px;\n  height: 12px;\n}\n\n.topcoder-like-circle-big {\n  border-width: 3px;\n  width: 36px;\n  height: 36px;\n}\n\n.rating-circle {\n  margin-right: 5px;\n  display: inline-block;\n}\n\n.difficulty-unavailable {\n  color: #17a2b8;\n}\n\n.difficulty-unavailable-icon {\n  margin-right: 0.3px;\n}\n\n.difficulty-unavailable-icon-big {\n  font-size: 36px;\n  margin-right: 5px;\n}\n\n.label-status-a {\n  color: white;\n}\n\n.label-success-after-contest {\n  background-color: #9ad59e;\n}\n\n.label-warning-after-contest {\n  background-color: #ffdd99;\n}";

// AtCoderの問題ページをパースする
/**
 * URLをパースする パラメータを消す \
 * 例: in:  https://atcoder.jp/contests/abc210?lang=en \
 * 例: out: (5)['https:', '', 'atcoder.jp', 'contests', 'abc210']
 */
const parseURL = (url) => {
    // 区切り文字`/`で分割する
    // ?以降の文字列を削除してパラメータを削除する
    return url.split("/").map((x) => x.replace(/\?.*/i, ""));
};
const URL = parseURL(window.location.href);
/**
 * 表セル要素から、前の要素のテキストが引数と一致する要素を探す
 * 個別の提出ページで使うことを想定
 * 例: searchSubmissionInfo(["問題", "Task"])
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
/** コンテストタイトル 例: AtCoder Beginner Contest 210 */
document.getElementsByClassName("contest-title")[0]?.textContent ?? "";
/** コンテストID 例: abc210 */
const contestID = URL[4] ?? "";
/**
 * ページ種類 \
 * 基本的にコンテストIDの次のパス
 * ### 例外
 * 個別の問題: task
 * 個別の提出: submission
 * 個別の問題ページで解説ボタンを押すと遷移する個別の問題の解説一覧ページ: task_editorial
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
/** 問題ID 例: abc210_a */
const taskID = (() => {
    if (pageType === "task") {
        // 問題ページでは、URLから問題IDを取り出す
        return URL[6] ?? "";
    }
    if (pageType === "submission") {
        // 個別の提出ページでは、問題リンクのURLから問題IDを取り出す
        // 提出情報の問題のURLを取得する
        const taskCell = searchSubmissionInfo(["問題", "Task"]);
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
/** 問題名 例: A - Cabbages */
(() => {
    if (pageType === "task") {
        // 問題ページでは、h2から問題名を取り出す
        return (document
            .getElementsByClassName("h2")[0]
            ?.textContent?.trim()
            .replace(/\n.*/i, "") ?? "");
    }
    if (pageType === "submission") {
        // 個別の提出ページでは、問題リンクのテキストから問題名を取り出す
        // 提出情報の問題のテキストを取得する
        const taskCell = searchSubmissionInfo(["問題", "Task"]);
        if (!taskCell)
            return "";
        const taskLink = taskCell.getElementsByTagName("a")[0];
        if (!taskLink)
            return "";
        return taskLink.textContent ?? "";
    }
    return "";
})();
/** 提出ユーザー 例: machikane */
(() => {
    if (pageType !== "submission")
        return "";
    // 個別の提出ページのとき
    const userCell = searchSubmissionInfo(["ユーザ", "User"]);
    if (!userCell)
        return "";
    return userCell?.textContent?.trim() ?? "";
})();
/** 提出結果 例: AC */
(() => {
    if (pageType !== "submission")
        return "";
    // 個別の提出ページのとき
    const statusCell = searchSubmissionInfo(["結果", "Status"]);
    if (!statusCell)
        return "";
    return statusCell?.textContent?.trim() ?? "";
})();
/** 得点 例: 100 */
(() => {
    if (pageType !== "submission")
        return 0;
    // 個別の提出ページのとき
    const scoreCell = searchSubmissionInfo(["得点", "Score"]);
    if (!scoreCell)
        return 0;
    return parseInt(scoreCell?.textContent?.trim() ?? "0", 10);
})();

/**
 * 得点が最大の提出を返す
 */
const parseMaxScore = (submissionsArg) => {
    if (submissionsArg.length === 0) {
        return undefined;
    }
    const maxScore = submissionsArg.reduce((left, right) => left.point > right.point ? left : right);
    return maxScore;
};
/**
 * ペナルティ数を数える
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
 * 最初にACした提出を返す
 */
const parseFirstAcceptedTime = (submissionsArg) => {
    const ac = submissionsArg.filter((element) => element.result === "AC");
    return ac[0];
};
/**
 * 代表的な提出を返す
 * 1. 最後にACした提出
 * 2. 最後の提出
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
 * 提出をパースして情報を返す
 * 対象: コンテスト前,中,後の提出 別コンテストの同じ問題への提出
 * 返す情報: 得点が最大の提出 最初のACの提出 代表的な提出 ペナルティ数
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
 * 提出状況を表すラベルを生成
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
            content = "コンテスト前の提出";
            break;
        case "during":
            content = "コンテスト中の提出";
            break;
        case "after":
            content = "コンテスト後の提出";
            break;
        case "another":
            content = "別コンテストの同じ問題への提出";
            break;
    }
    const href = `https://atcoder.jp/contests/${submission.contest_id}/submissions/${submission.id}`;
    return `<span class="label ${className}"
      data-toggle="tooltip" data-placement="bottom" title="${content}">
      <a class="label-status-a" href=${href}>${submission.result}</a>
    </span> `;
};
/**
 * ペナルティ数を表示
 */
const generatePenaltiesCount = (penalties) => {
    if (penalties <= 0) {
        return "";
    }
    const content = "コンテスト中のペナルティ数";
    return `<span data-toggle="tooltip" data-placement="bottom" title="${content}"class="difficulty-red" style='font-weight: bold; font-size: x-small;'>
            (${penalties.toString()})
          </span>`;
};
/**
 * 最初のACの時間を表示
 */
const generateFirstAcTime = (submission) => {
    if (submission === undefined) {
        return "";
    }
    const content = "提出時間";
    const href = `https://atcoder.jp/contests/${submission.contest_id}/submissions/${submission.id}`;
    const elapsed = submission.epoch_second - startTime.unix();
    const elapsedSeconds = elapsed % 60;
    const elapsedMinutes = Math.trunc(elapsed / 60);
    return `<span data-toggle="tooltip" data-placement="bottom" title="${content}">
          <a class="difficulty-orange" style='font-weight: bold; font-size: x-small;' href=${href}>
            ${elapsedMinutes}:${elapsedSeconds}
          </a>
        </span>`;
};
/**
 * マラソン用に得点を表示するスパンを生成
 */
const generateScoreSpan = (submission, type) => {
    if (submission === undefined) {
        return "";
    }
    // マラソン用を考えているのでとりあえず1万点未満は表示しない
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
            content = "コンテスト前の提出";
            break;
        case "during":
            content = "コンテスト中の提出";
            break;
        case "after":
            content = "コンテスト後の提出";
            break;
        case "another":
            content = "別コンテストの同じ問題への提出";
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
 * 色付け対象の要素の配列を取得する
 * * 個別の問題ページのタイトル
 * * 問題へのリンク
 * * 解説ページのH3の問題名
 */
const getElementsColorizable = () => {
    const elementsColorizable = [];
    // 問題ページのタイトル
    if (pageType === "task") {
        const element = document.getElementsByClassName("h2")[0];
        if (element) {
            elementsColorizable.push({ element, taskID, big: true });
        }
    }
    // aタグ要素 問題ページ、提出ページ等のリンクを想定
    const aTagsRaw = document.getElementsByTagName("a");
    let aTagsArray = Array.prototype.slice.call(aTagsRaw);
    // 問題ページの一番左の要素は除く 見た目の問題です
    aTagsArray = aTagsArray.filter((element) => !((pageType === "tasks" || pageType === "score") &&
        !element.parentElement?.previousElementSibling));
    // 左上の日本語/英語切り替えリンクは除く
    aTagsArray = aTagsArray.filter((element) => !element.href.includes("?lang="));
    // 解説ページの問題名の右のリンクは除く
    aTagsArray = aTagsArray.filter((element) => !(pageType === "editorial" &&
        element.children[0]?.classList.contains("glyphicon-new-window")));
    const aTagsConverted = aTagsArray.map((element) => {
        const url = parseURL(element.href);
        const taskIDFromURL = (url[url.length - 2] ?? "") === "tasks" ? url[url.length - 1] ?? "" : "";
        // 個別の解説ページではbig
        const big = element.parentElement?.tagName.includes("H2") ?? false;
        // Comfortable AtCoderのドロップダウンではafterbegin
        const afterbegin = element.parentElement?.parentElement?.classList.contains("dropdown-menu") ?? false;
        return { element, taskID: taskIDFromURL, big, afterbegin };
    });
    elementsColorizable.push(...aTagsConverted);
    // h3タグ要素 解説ページの問題名を想定
    const h3TagsRaw = document.getElementsByTagName("h3");
    const h3TagsArray = Array.prototype.slice.call(h3TagsRaw);
    const h3TagsConverted = h3TagsArray.map((element) => {
        const url = parseURL(element.getElementsByTagName("a")[0]?.href ?? "");
        const taskIDFromURL = (url[url.length - 2] ?? "") === "tasks" ? url[url.length - 1] ?? "" : "";
        return { element, taskID: taskIDFromURL, big: true, afterbegin: true };
    });
    // FIXME: 別ユーザースクリプトが指定した要素を色付けする機能
    // 指定したクラスがあれば対象とすることを考えている
    // ユーザースクリプトの実行順はユーザースクリプトマネージャーの設定で変更可能
    elementsColorizable.push(...h3TagsConverted);
    return elementsColorizable;
};
/**
 * 問題ステータス（実行時間制限とメモリ制限が書かれた部分）のHTMLオブジェクトを取得
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
        return (p.textContent?.includes("メモリ制限") ||
            p.textContent?.includes("Memory Limit"));
    });
    return problemStatuses[0];
};

/** 常設コンテストID一覧 */
const permanentContestIDs = [
    "practice",
    "APG4b",
    "abs",
    "practice2",
    "typical90",
    "math-and-algorithm",
    "tessoku-book",
];
// FIXME: FIXME: Problemsでデータ取れなかったらコンテストが終了していない判定で良さそう
/**
 * 開いているページのコンテストが終了していればtrue \
 * 例外処理として以下の場合もtrueを返す
 * * コンテストが常設コンテスト
 * * コンテストのページ以外にいる <https://atcoder.jp/contests/*>
 */
var isContestOver = () => {
    if (!(URL[3] === "contests" && URL.length >= 5))
        return true;
    if (permanentContestIDs.includes(contestID))
        return true;
    return Date.now() > endTime.valueOf();
};

/**
 * コンテストページ <https://atcoder.jp/contests/*> の処理 \
 * メインの処理
 */
const contestPageProcess = async () => {
    // コンテスト終了前は不要なので無効化する
    if (!isContestOver())
        return;
    // FIXME: ダークテーマ対応
    GM_addStyle(css);
    /** 問題一覧取得 */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const problems = await getProblems();
    /** 難易度取得 */
    const problemModels = addTypical90Difficulty(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await getEstimatedDifficulties(), problems);
    // FIXME: PAST対応
    // FIXME: JOI非公式難易度表対応
    /** 提出状況取得 */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const submissions = await getSubmissions(userScreenName);
    // 色付け対象の要素の配列を取得する
    // 難易度が無いものを除く
    const elementsColorizable = getElementsColorizable().filter((element) => element.taskID in problemModels);
    // 問題ステータス（個別の問題ページの実行時間制限とメモリ制限が書かれた部分）を取得する
    const elementProblemStatus = getElementOfProblemStatus();
    /**
     * 色付け処理を実行する
     */
    const colorizeElement = () => {
        // 問題見出し、問題リンクを色付け
        elementsColorizable.forEach((element) => {
            const model = problemModels[element.taskID];
            // 難易度がUnavailableならばdifficultyプロパティが無い
            // difficultyの値をNaNとする
            const difficulty = clipDifficulty(model?.difficulty ?? NaN);
            // 色付け
            if (!Number.isNaN(difficulty)) {
                const color = getRatingColorClass(difficulty);
                // eslint-disable-next-line no-param-reassign
                element.element.classList.add(color);
            }
            else {
                element.element.classList.add("difficulty-unavailable");
            }
            // 🧪追加
            if (model?.is_experimental) {
                element.element.insertAdjacentText("afterbegin", "🧪");
            }
            // ◒難易度円追加
            element.element.insertAdjacentHTML(element.afterbegin ? "afterbegin" : "beforebegin", difficultyCircle(difficulty, element.big, model?.extra_difficulty));
        });
        // 個別の問題ページのところに難易度等情報を追加
        if (elementProblemStatus) {
            // 難易度の値を表示する
            // 難易度推定の対象外なら、この値はundefined
            const model = problemModels[taskID];
            // 難易度がUnavailableのときはdifficultyの値をNaNとする
            // 難易度がUnavailableならばdifficultyプロパティが無い
            const difficulty = clipDifficulty(model?.difficulty ?? NaN);
            // 色付け
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
            // Difficultyの値設定
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
            // 🧪追加
            const experimentalText = model?.is_experimental ? "🧪" : "";
            const content = `${experimentalText}${value}`;
            elementProblemStatus.insertAdjacentHTML("beforeend", ` / Difficulty:
        <span style='font-weight: bold;' class="${className}">${content}</span>`);
            /** この問題への提出 提出時間ソート済みと想定 */
            const thisTaskSubmissions = submissions.filter((element) => element.problem_id === taskID);
            const analyze = analyzeSubmissions(thisTaskSubmissions);
            // コンテスト前中後外の提出状況 コンテスト中の解答時間とペナルティ数を表示する
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
            // コンテスト前中後外の1万点以上の最大得点を表示する
            // NOTE: マラソン用のため、1万点以上とした
            let scoresHTML = "";
            scoresHTML += generateScoreSpan(analyze.before.maxScore, "before");
            scoresHTML += generateScoreSpan(analyze.during.maxScore, "during");
            scoresHTML += generateScoreSpan(analyze.after.maxScore, "after");
            scoresHTML += generateScoreSpan(analyze.another.maxScore, "another");
            if (scoresHTML.length > 0) {
                elementProblemStatus.insertAdjacentHTML("beforeend", ` / Scores: ${scoresHTML}`);
            }
        }
        // bootstrap3のtooltipを有効化 難易度円の値を表示するtooltip
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, no-undef
        $('[data-toggle="tooltip"]').tooltip();
    };
    // 色付け処理実行
    if (!GM_getValue(hideDifficultyID, false)) {
        // 設定 ネタバレ防止がOFFなら何もせず実行
        colorizeElement();
    }
    else {
        // 設定 ネタバレ防止がONなら
        // ページ上部にボタンを追加 押すと色付け処理が実行される
        const place = document.getElementsByTagName("h2")[0] ??
            document.getElementsByClassName("h2")[0] ??
            undefined;
        if (place) {
            place.insertAdjacentHTML("beforebegin", `<input type="button" id="${hideDifficultyID}" class="btn btn-info"
        value="Show Difficulty" />`);
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
 * 設定ページ <https://atcoder.jp/settings> の処理 \
 * 設定ボタンを追加する
 */
const settingPageProcess = () => {
    const insertion = document.getElementsByClassName("form-horizontal")[0];
    if (insertion === undefined)
        return;
    insertion.insertAdjacentHTML("afterend", html);
    // 設定 ネタバレ防止のチェックボックスの読み込み 切り替え 保存処理を追加
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
 * 最初に実行される部分 \
 * 共通の処理を実行した後ページごとの処理を実行する
 */
(async () => {
    // 共通の処理
    backwardCompatibleProcessing();
    // ページ別の処理
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
