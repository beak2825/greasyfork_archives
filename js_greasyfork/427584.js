// ==UserScript==
// @name         AtCoder Editorial for Typical90
// @namespace    https://github.com/KATO-Hiro
// @version      0.6.0
// @description  AtCoder「競プロ典型 90 問」に解説タブを追加し、E869120さんがGitHubで公開されている問題の解説・想定ソースコードなどのリンクを表示します。
// @match        https://atcoder.jp/contests/typical90*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.10.5/dayjs.min.js
// @author       hiro_hiro
// @license      CC0
// @downloadURL
// @updateURL
// @homepage     https://github.com/KATO-Hiro/AtCoder-Editorial-for-Typical90
// @supportURL   https://github.com/KATO-Hiro/AtCoder-Editorial-for-Typical90/issues
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/427584/AtCoder%20Editorial%20for%20Typical90.user.js
// @updateURL https://update.greasyfork.org/scripts/427584/AtCoder%20Editorial%20for%20Typical90.meta.js
// ==/UserScript==

(async function () {
    "use strict";

    addTabs();

    const tasks = await fetchTasks(); // TODO: Use cache to reduce access to AtCoder.
    addEditorialPage(tasks);

    $(".nav-tabs a").click(function () {
        changeTab($(this));
        hideContentsOfPreviousPage();

        return false;
    });

    // TODO: 「解説」ボタンをクリックしたら、該当する問題のリンクを表示できるようにする
})();

function addTabs() {
    addTabContentStyles();
    addTabContents();
    addEditorialTab();
}

function addTabContentStyles() {
    const tabContentStyles = `
        .tab-content {
            display: none;
        }
        .tab-content.active {
            display: block;
        }
    `;

    GM_addStyle(tabContentStyles);
}

function addTabContents() {
    const contestNavTabsId = document.getElementById("contest-nav-tabs");

    // See:
    // https://stackoverflow.com/questions/268490/jquery-document-createelement-equivalent
    // https://blog.toshimaru.net/jqueryhidden-inputjquery/
    const idNames = [
        "editorial-created-by-userscript"
    ];

    for (const idName of idNames) {
        $("<div>", {
            class: "tab-content",
            id: idName,
        }).appendTo(contestNavTabsId);
    }
}

// FIXME: Hard coding is not good.
function addEditorialTab() {
    // See:
    // https://api.jquery.com/before/
    $("li.pull-right").before("<li><a href='#editorial-created-by-userscript'><span class='glyphicon glyphicon-book' style='margin-right:4px;' aria-hidden='true'></span>解説</a></li>");
}

function padZero(taskId) {
    // See:
    // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
    return String(taskId).padStart(3, '0');
}

// TODO: キャッシュを利用して、本家へのアクセスを少なくなるようにする
async function fetchTasks() {
    const tbodies = await fetchTaskPage();
    const tasks = new Object();
    let taskCount = 1;

    for (const [index, aTag] of Object.entries($(tbodies).find("a"))) {
        // Ignore a-tags including task-id and "Submit".
        // See:
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes
        if (index % 3 == 1 && aTag.text.includes("★")) {
            const taskId = String(taskCount).padStart(3, "0");
            tasks[taskId] = [aTag.text, aTag.href];
            taskCount += 1;
        }
    }

    return tasks;
}

async function fetchTaskPage() {
    // See:
    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    // https://developer.mozilla.org/en-US/docs/Web/API/Body/text
    // https://developer.mozilla.org/ja/docs/Web/API/DOMParser
    // https://api.jquery.com/each/
    // http://dyn-web.com/tutorials/object-literal/properties.php#:~:text=Add%20a%20Property%20to%20an%20Existing%20Object%20Literal&text=myObject.,if%20it%20is%20a%20string).
    const tbodies = await fetch("https://atcoder.jp/contests/typical90/tasks", {
        method: "GET"
    })
    .then(response => {
        return response.text()
    })
    .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const messages = doc.querySelector("#main-container > div.row > div:nth-child(2) > div > table > tbody");

        return messages;
    })
    .catch(error => {
        console.warn('Something went wrong.', error);
    });

    return tbodies;
}

function addEditorialPage(tasks) {
    const editorialId = "#editorial-created-by-userscript";

    showHeader("editorial-header", "解説", editorialId);
    addHorizontalRule(editorialId);
    showDifficultyVotingAndUserCodes(editorialId);

    let taskEditorialsDiv = addDiv("task-editorials", editorialId);
    taskEditorialsDiv = "." + taskEditorialsDiv;
    addEditorials(tasks, taskEditorialsDiv);
}

function showHeader(className, text, tag) {
    addHeader(
        "<h2>", // heading_tag
        className, // className
        text, // text
        tag // parent_tag
    );
}

function addHeader(heading_tag, className, text, parent_tag) {
    $(heading_tag, {
        class: className,
        text: text,
    }).appendTo(parent_tag);
}

function addHorizontalRule(tag) {
    // See:
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/hr
    $("<hr>", {
        class: "",
    }).appendTo(tag);
}

function showDifficultyVotingAndUserCodes(tag) {
    addHeader(
        "<h3>", // heading_tag
        "difficulty-voting-and-user-codes", // className
        "問題の難易度を投票する・ソースコードを共有する", // text
        tag // parent_tag
    );

    $("<ul>", {
        class: "spread-sheets-ul",
        text: ""
    }).appendTo(tag);

    const spreadSheetUrl = "https://docs.google.com/spreadsheets/d/1GG4Higis4n4GJBViVltjcbuNfyr31PzUY_ZY1zh2GuI/edit#gid=";

    const homeID = "0";
    addSpreadSheetHomeURL(spreadSheetUrl + homeID);

    const difficultyVotingID = "1593175261";
    addDifficultyVotingURL(spreadSheetUrl + difficultyVotingID);

    const taskGroups = [
        ["001", "023", spreadSheetUrl + "105162261"], // task start, task end, spread sheet id.
        ["024", "047", spreadSheetUrl + "1671161250"],
        ["048", "071", spreadSheetUrl + "671876031"],
        ["072", "090", spreadSheetUrl + "428850451"]
    ];

    // See:
    // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
    taskGroups.forEach(
        taskGroup => {
            const taskStart = taskGroup[0];
            const taskEnd = taskGroup[1];
            const url = taskGroup[2];

            addUserCodesURL(
                taskStart,
                taskEnd,
                url
            );
        }
    );
}

function addSpreadSheetHomeURL(url) {
    $("<li>", {
        class: "spread-sheet-home-li",
        text: ""
    }).appendTo(".spread-sheets-ul");

    $("<a>", {
        class: "spread-sheet-home-url",
        href: url,
        text: "目的",
        target: "_blank",
        rel: "noopener",
    }).appendTo(".spread-sheet-home-li");
}

function addDifficultyVotingURL(url) {
    $("<li>", {
        class: "difficulty-voting-li",
        text: ""
    }).appendTo(".spread-sheets-ul");

    $("<a>", {
        class: "difficulty-voting-url",
        href: url,
        text: "問題の難易度を投票する",
        target: "_blank",
        rel: "noopener",
    }).appendTo(".difficulty-voting-li");
}

function addUserCodesURL(taskStart, taskEnd, url) {
    // See:
    // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Template_literals
    $("<li>", {
        class: `user-codes-${taskStart}-${taskEnd}-li`,
        text: ""
    }).appendTo(".spread-sheets-ul");

    $("<a>", {
        class: `user-codes-${taskStart}-${taskEnd}-url`,
        href: url,
        text: `ソースコード(${taskStart}〜${taskEnd})を見る・共有する`,
        target: "_blank",
        rel: "noopener",
    }).appendTo(`.user-codes-${taskStart}-${taskEnd}-li`);
}

function addDiv(tagName, parentTag) {
    $("<div>", {
        class: tagName,
    }).appendTo(parentTag);

    return tagName;
}

function addEditorials(tasks, parentTag) {
    const githubRepoUrl = getGitHubRepoUrl();
    const editorialsUrl = githubRepoUrl + "editorial/";
    const codesUrl = githubRepoUrl + "sol/";

    // See:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
    const latestTaskId = Object.keys(tasks).slice(-1)[0];

    // HACK: 公開当日分の問題についてはリンク切れを回避するため、解説・ソースコードの一覧を示すことで応急的に対処
    // HACK: 問題によっては、複数の解説とソースコードが公開される日もある
    // getMultipleEditorialUrlsIfNeeds()とgetMultipleCodeUrls()で、アドホック的に対処している
    for (const [taskId, [taskName, taskUrl]] of Object.entries(tasks)) {
        let taskEditorialDiv = addDiv(`task-${taskId}-editorial`, parentTag);
        taskEditorialDiv = "." + taskEditorialDiv;

        // See:
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
        // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/split
        showTaskName(taskId, `${taskId} - ${taskName}`, taskUrl, taskEditorialDiv);

        const additionalUrls = getMultipleEditorialUrlsIfNeeds(taskId);

        // TODO: AtCoderの解説ページで図を表示できるようにする
        for (const [index, additionalUrl] of Object.entries(additionalUrls)) {
            const editorialUrl = editorialsUrl + taskId + additionalUrl + ".jpg";
            showEditorial(taskId + additionalUrl, editorialUrl, additionalUrl, taskEditorialDiv);
        }

        const codeUrls = getMultipleCodeUrls(taskId);

        // TODO: ソースコードをフォーマットされた状態で表示する
        for (const [index, codeUrl] of Object.entries(codeUrls)) {
            const editorialCodelUrl = codesUrl + taskId + codeUrl;
            const [additionalUrl, language] = codeUrl.split(".");
            showCode(taskId + additionalUrl, editorialCodelUrl, codeUrl, taskEditorialDiv);
        }
    }
}

function getGitHubRepoUrl() {
    const url = "https://github.com/E869120/kyopro_educational_90/blob/main/";

    return url;
}

function showTaskName(taskId, taskName, taskUrl, tag) {
    const taskIdClass = `task-${taskId}`;

    addHeader(
        "<h3>", // heading_tag
        taskIdClass, // className
        taskName, // text
        tag // parent_tag
    );

    $("<a>", {
        class: `${`task-${taskId}-url`} small glyphicon glyphicon-new-window`,
        href: taskUrl,
        target: "_blank",
    }).appendTo(`.${taskIdClass}`);
}

// TODO: 複数の解説資料がアップロードされた日があれば更新する
function getMultipleEditorialUrlsIfNeeds(taskId) {
    // See:
    // https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Working_with_Objects
    // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Property_Accessors
    // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/in

    // タスク名: 解説ファイルの番号
    // 0xx-yyy.jpgの0xxをキーに、-yyyを値としている
    const multipleEditorialUrls = {
        "005": ["-01", "-02", "-03"],
        "011": ["-01", "-02"],
        "017": ["-01", "-02", "-03"],
        "023": ["-01", "-02", "-03", "-04"],
        "029": ["-01", "-02"],
        "035": ["-01", "-02", "-03"],
        "041": ["-01", "-02", "-03"],
        "047": ["-01", "-02"],
        "053": ["-01", "-02", "-03", "-04"],
        "059": ["-01", "-02", "-03"],
        "065": ["-01", "-02", "-03"],
        "071": ["-01", "-02", "-03"],
        "077": ["-01", "-02", "-03"],
        "083": ["-01", "-02", "-03", "-04"],
        "084": ["-01", "-02"],
        "085": ["-01", "-02"],
        "086": ["-01", "-02"],
        "087": ["-01", "-02"],
        "088": ["-01", "-02"],
        "089": ["-01", "-02", "-03", "-04"],
        "090": ["-01", "-02", "-03", "-04", "-05", "-06"],
    };

    if (taskId in multipleEditorialUrls) {
        return multipleEditorialUrls[taskId];
    } else {
        return [""]; // dummy
    }
}

// TODO: 複数の想定コードがアップロードされた日があれば更新する
function getMultipleCodeUrls(taskId) {
    // タスク名: ソースコードの番号と拡張子
    // 0xx-yyy.langの0xxをキーに、-yyy.langを値としている
    const multipleCodeUrls = {
        "005": ["-01.cpp", "-02.cpp", "-03.cpp"],
        "011": ["-01.cpp", "-02.cpp", "-03.cpp"],
        "017": ["-01.cpp", "-02.cpp", "-03.cpp"],
        "023": ["-01.cpp", "-02.cpp", "-03.cpp", "-04a.cpp", "-04b.cpp"],
        "029": ["-01.cpp", "-02.cpp", "-03.cpp"],
        "035": ["-01.cpp", "-02.cpp", "-03.cpp", "-04.cpp"],
        "041": ["-01a.cpp", "-01b.cpp", "-02.cpp", "-03.cpp"],
        "047": ["-01.cpp", "-02.cpp"],
        "053": ["-01.cpp", "-02.cpp", "-03.cpp", "-04.cpp"],
        "055": [".cpp", "-02.py", "-03.py"],
        "059": ["-01.cpp", "-02.cpp"],
        "061": ["-01.cpp", "-02.cpp"],
        "065": ["-01.cpp", "-02.cpp", "-03.cpp"],
        "066": ["a.cpp", "b.cpp"],
        "068": ["a.cpp", "b.cpp"],
        "071": ["-02.cpp", "-03.cpp"],
        "077": ["-01.cpp", "-02.cpp", "-03.cpp", "-04a.cpp", "-04b.cpp"],
        "080": ["a.cpp", "b.cpp"],
        "082": ["a.cpp", "b.cpp"],
        "083": ["-01.cpp", "-02a.cpp", "-02b.cpp"],
        "084": ["-01.cpp", "-02.cpp"],
        "089": ["-01.cpp", "-02.cpp", "-03.cpp", "-04.cpp", "-05.cpp"],
        "090": ["-01.cpp", "-02.cpp", "-03.cpp", "-04.cpp", "-05.cpp", "-06a.cpp", "-06b.cpp", "-07a.cpp", "-07b.cpp"],
    };

    if (taskId in multipleCodeUrls) {
        return multipleCodeUrls[taskId];
    } else {
        return [".cpp"];
    }
}

function addNote(className, message, parent_tag) {
    $("<p>", {
        class: className,
        text: message,
    }).appendTo(parent_tag);
}

function showEditorial(taskId, url, additionalUrl, tag) {
    const ulClass = `editorial-${taskId}-ul`;
    const liClass = `editorial-${taskId}-li`;

    $("<ul>", {
        class: ulClass,
        text: ""
    }).appendTo(tag);

    $("<li>", {
        class: liClass,
        text: ""
    }).appendTo(`.${ulClass}`);

    $("<a>", {
        class: `editorial-${taskId}-url`,
        href: url,
        text: `公式解説${additionalUrl}`,
        target: "_blank",
        rel: "noopener",
    }).appendTo(`.${liClass}`);
}

function showCode(taskId, url, additionalUrl, tag) {
    const ulClass = `editorial-${taskId}-code-ul`;
    const liClass = `editorial-${taskId}-code-li`;

    $("<ul>", {
        class: ulClass,
        text: ""
    }).appendTo(tag);

    $("<li>", {
        class: liClass,
        text: ""
    }).appendTo(`.${ulClass}`);

    $("<a>", {
        class: `editorial-${taskId}-code-url`,
        href: url,
        text: `想定ソースコード${additionalUrl}`,
        target: "_blank",
        rel: "noopener",
    }).appendTo(`.${liClass}`);
}

function addEditorialButtonToTaskPage() {
    // See:
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
    const editorialButton = document.createElement("a");
    editorialButton.classList.add("btn", "btn-default", "btn-sm");
    editorialButton.textContent = "解説";

    const taskTitle = document.querySelector(".row > div > .h2");

    if (taskTitle) {
        taskTitle.appendChild(editorialButton);
        return editorialButton;
    } else {
        return;
    }
}

function changeTab(this_object) {
    // See:
    // https://api.jquery.com/parent/
    // https://api.jquery.com/addClass/#addClass-className
    // https://api.jquery.com/siblings/#siblings-selector
    // https://api.jquery.com/removeClass/#removeClass-className
    // https://www.design-memo.com/coding/jquery-tab-change
    this_object.parent().addClass("active").siblings(".active").removeClass("active");
    const tabContentsUrl = this_object.attr("href");
    $(tabContentsUrl).addClass("active").siblings(".active").removeClass("active");
}

function hideContentsOfPreviousPage() {
    // See:
    // https://api.jquery.com/length/
    // https://api.jquery.com/hide/
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for
    // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String
    const tagCount = $(".col-sm-12").length;

    for (let index = 0; index < tagCount; index++) {
        if (index != 0) {
            $("#main-container > div.row > div:nth-child(" + String(index + 1) + ")").hide();
        }
    }
}
