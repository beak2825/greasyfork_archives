// ==UserScript==
// @name         comfortable-yukicoder
// @namespace    iilj
// @version      1.2.0
// @description  yukicoder にいくつかの機能を追加します．主に動線を増やします．
// @author       iilj
// @license      MIT
// @supportURL   https://github.com/iilj/comfortable-yukicoder/issues
// @match        https://yukicoder.me/contests/*
// @match        https://yukicoder.me/contests/*/*
// @match        https://yukicoder.me/problems/no/*
// @match        https://yukicoder.me/problems/*
// @match        https://yukicoder.me/submissions/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/431129/comfortable-yukicoder.user.js
// @updateURL https://update.greasyfork.org/scripts/431129/comfortable-yukicoder.meta.js
// ==/UserScript==
var css = "#toplinks > div#cy-tabs-container > a {\n  position: relative;\n  background: linear-gradient(to bottom, white 0%, #fff2f3 100%);\n}\n#toplinks > div#cy-tabs-container > a ul.js-cy-contest-problems-ul {\n  margin: 0;\n  padding: 0;\n  list-style-type: none;\n  overflow: hidden;\n  position: absolute;\n  left: 0;\n  top: 33px;\n  width: max-content;\n  min-height: 0;\n  height: 0;\n  z-index: 3;\n  transition: min-height 0.4s;\n}\n#toplinks > div#cy-tabs-container > a ul.js-cy-contest-problems-ul > li > a {\n  width: 100%;\n  height: 100%;\n  display: block;\n  margin: 0;\n  padding: 0.3rem;\n  padding-left: 0.6rem;\n  padding-right: 0.6rem;\n  font-size: 16px;\n  color: #fff;\n  line-height: 1.75;\n  background-color: #428bca;\n}\n#toplinks > div#cy-tabs-container > a ul.js-cy-contest-problems-ul > li > a:hover {\n  background-color: #3071a9;\n}\n#toplinks > div#cy-tabs-container > a:hover {\n  opacity: 1;\n}\n#toplinks > div#cy-tabs-container > a:hover ul.js-cy-contest-problems-ul {\n  height: auto;\n}";

const header = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
];
const getHeaderFromNum = (num) => {
    const idx = num - 1;
    if (idx < header.length) {
        return header[idx];
    }
    else {
        const r = idx % header.length;
        return getHeaderFromNum(Math.floor(idx / header.length)) + header[r];
    }
};
const getHeader = (idx) => getHeaderFromNum(idx + 1);

class TopLinksManager {
    constructor() {
        GM_addStyle(css);
        const toplinks = document.querySelector('div#toplinks');
        if (toplinks === null) {
            throw Error('div#toplinks が見つかりません');
        }
        this.tabContainer = document.createElement('div');
        this.tabContainer.classList.add('left');
        this.tabContainer.id = TopLinksManager.TAB_CONTAINER_ID;
        toplinks.insertAdjacentElement('beforeend', this.tabContainer);
        this.id2element = new Map();
    }
    initLink(txt, id, href = '#') {
        const newtab = document.createElement('a');
        newtab.innerText = txt;
        newtab.id = id;
        newtab.setAttribute('href', href);
        this.tabContainer.appendChild(newtab);
        this.id2element.set(id, newtab);
        return newtab;
    }
    confirmLink(id, href) {
        const tab = this.id2element.get(id);
        if (tab === undefined) {
            throw new Error(`不明な id: ${id}`);
        }
        tab.href = href;
    }
    initContestSubmissions() {
        this.initLink('自分の提出', TopLinksManager.ID_CONTEST_SUBMISSION);
    }
    confirmContestSubmissions(contestId) {
        this.confirmLink(TopLinksManager.ID_CONTEST_SUBMISSION, `/contests/${contestId}/submissions?my_submission=enabled`);
    }
    initContestProblems() {
        this.initLink('ｺﾝﾃｽﾄ問題一覧', TopLinksManager.ID_CONTEST);
    }
    confirmContestProblems(contestId, contestProblems) {
        this.confirmLink(TopLinksManager.ID_CONTEST, `/contests/${contestId}`);
        this.addContestProblems(contestProblems);
    }
    initContestLinks() {
        this.initContestProblems();
        this.initLink('ｺﾝﾃｽﾄ順位表', TopLinksManager.ID_CONTEST_TABLE);
        this.initContestSubmissions();
    }
    confirmContestLinks(contestId, contestProblems) {
        this.confirmLink(TopLinksManager.ID_CONTEST_TABLE, `/contests/${contestId}/table`);
        this.confirmContestSubmissions(contestId);
        this.confirmContestProblems(contestId, contestProblems);
    }
    addContestProblems(contestProblems) {
        const tab = this.id2element.get(TopLinksManager.ID_CONTEST);
        if (tab === undefined) {
            throw new Error(`id=${TopLinksManager.ID_CONTEST} の要素が追加される前に更新が要求されました`);
        }
        const ul = document.createElement('ul');
        ul.classList.add('js-cy-contest-problems-ul');
        console.log(contestProblems);
        contestProblems.forEach((problem, index) => {
            console.log(problem);
            const li = document.createElement('li');
            const link = document.createElement('a');
            const header = getHeader(index);
            link.textContent = `${header} - ${problem.Title}`;
            if (problem.No !== null) {
                link.href = `/problems/no/${problem.No}`;
            }
            else {
                link.href = `/problems/${problem.ProblemId}`;
            }
            li.appendChild(link);
            ul.appendChild(li);
        });
        // add caret
        const caret = document.createElement('span');
        caret.classList.add('caret');
        tab.appendChild(caret);
        tab.insertAdjacentElement('beforeend', ul);
    }
    confirmWithoutContest(problem) {
        [TopLinksManager.ID_CONTEST, TopLinksManager.ID_CONTEST_TABLE].forEach((id) => {
            const tab = this.id2element.get(id);
            if (tab !== undefined)
                tab.remove();
        });
        // https://yukicoder.me/problems/no/5000/submissions?my_submission=enabled
        if (problem.No !== null) {
            this.confirmLink(TopLinksManager.ID_CONTEST_SUBMISSION, `/problems/no/${problem.No}/submissions?my_submission=enabled`);
        }
        else {
            this.confirmLink(TopLinksManager.ID_CONTEST_SUBMISSION, `/problems/${problem.ProblemId}/submissions?my_submission=enabled`);
        }
    }
}
TopLinksManager.TAB_CONTAINER_ID = 'cy-tabs-container';
TopLinksManager.ID_CONTEST = 'js-cy-contest';
TopLinksManager.ID_CONTEST_TABLE = 'js-cy-contest-table';
TopLinksManager.ID_CONTEST_SUBMISSION = 'js-cy-contest-submissions';

const onContestPage = (contestId) => {
    const toplinksManager = new TopLinksManager();
    toplinksManager.initContestSubmissions();
    toplinksManager.confirmContestSubmissions(contestId);
};

const getContestProblems = (contest, problems) => {
    const pid2problem = new Map();
    problems.forEach((problem) => {
        pid2problem.set(problem.ProblemId, problem);
    });
    const contestProblems = contest.ProblemIdList.map((problemId) => {
        const problem = pid2problem.get(problemId);
        if (problem !== undefined)
            return problem;
        return {
            No: null,
            ProblemId: problemId,
            Title: '',
            AuthorId: -1,
            TesterId: -1,
            TesterIds: '',
            Level: 0,
            ProblemType: 0,
            Tags: '',
            Date: null,
            Statistics: {
            //
            },
        };
    });
    return contestProblems;
};
const anchorToUserID = (anchor) => {
    const userLnkMatchArray = /^https:\/\/yukicoder\.me\/users\/(\d+)/.exec(anchor.href);
    if (userLnkMatchArray === null)
        return -1;
    const userId = Number(userLnkMatchArray[1]);
    return userId;
};
const getYourUserId = () => {
    const yourIdLnk = document.querySelector('#header #usermenu-btn');
    if (yourIdLnk === null)
        return -1; // ログインしていない場合
    return anchorToUserID(yourIdLnk);
};

const onLeaderboardPage = async (contestId, APIClient) => {
    const myRankTableRow = document.querySelector('table.table tbody tr.my_rank');
    if (myRankTableRow !== null) {
        const myRankTableRowCloned = myRankTableRow.cloneNode(true);
        const tbody = document.querySelector('table.table tbody');
        if (tbody === null) {
            throw new Error('順位表テーブルが見つかりません');
        }
        tbody.insertAdjacentElement('afterbegin', myRankTableRowCloned);
        myRankTableRowCloned.style.borderBottom = '2px solid #ddd';
    }
    const toplinksManager = new TopLinksManager();
    toplinksManager.initContestProblems();
    toplinksManager.initContestSubmissions();
    toplinksManager.confirmContestSubmissions(contestId);
    const [problems, contest] = await Promise.all([APIClient.fetchProblems(), APIClient.fetchContestById(contestId)]);
    const contestProblems = getContestProblems(contest, problems);
    toplinksManager.confirmContestProblems(contest.Id, contestProblems);
};

const createCard = () => {
    const newdiv = document.createElement('div');
    // styling newdiv
    newdiv.style.display = 'inline-block';
    newdiv.style.borderRadius = '2px';
    newdiv.style.padding = '10px';
    newdiv.style.margin = '10px 0px';
    newdiv.style.border = '1px solid rgb(59, 173, 214)';
    newdiv.style.backgroundColor = 'rgba(120, 197, 231, 0.1)';
    const newdivWrapper = document.createElement('div');
    newdivWrapper.appendChild(newdiv);
    return [newdiv, newdivWrapper];
};

const pad = (num, length = 2) => `00${num}`.slice(-length);
const days = ['日', '月', '火', '水', '木', '金', '土'];
const formatDate = (date, format = '%Y-%m-%d (%a) %H:%M:%S.%f %z') => {
    const offset = date.getTimezoneOffset();
    const offsetSign = offset < 0 ? '+' : '-';
    const offsetHours = Math.floor(Math.abs(offset) / 60);
    const offsetMinutes = Math.abs(offset) % 60;
    let ret = format.replace(/%Y/g, String(date.getFullYear()));
    ret = ret.replace(/%m/g, pad(date.getMonth() + 1));
    ret = ret.replace(/%d/g, pad(date.getDate()));
    ret = ret.replace(/%a/g, days[date.getDay()]);
    ret = ret.replace(/%H/g, pad(date.getHours()));
    ret = ret.replace(/%M/g, pad(date.getMinutes()));
    ret = ret.replace(/%S/g, pad(date.getSeconds()));
    ret = ret.replace(/%f/g, pad(date.getMilliseconds(), 3));
    ret = ret.replace(/%z/g, `${offsetSign}${pad(offsetHours)}:${pad(offsetMinutes)}`);
    return ret;
};

class ContestInfoCard {
    constructor(isProblemPage = true) {
        this.isProblemPage = isProblemPage;
        const [card, cardWrapper] = createCard();
        this.card = card;
        {
            // create newdiv
            this.contestDiv = document.createElement('div');
            // add contest info
            this.contestLnk = document.createElement('a');
            this.contestLnk.innerText = '(fetching contest info...)';
            this.contestLnk.href = '#';
            this.contestDiv.appendChild(this.contestLnk);
            this.contestSuffix = document.createTextNode(` (id=---)`);
            this.contestDiv.appendChild(this.contestSuffix);
            // add problem info
            if (isProblemPage) {
                const space = document.createTextNode(` `);
                this.contestDiv.appendChild(space);
                this.problemLnk = document.createElement('a');
                this.problemLnk.innerText = '#?';
                this.problemLnk.href = '#';
                this.contestDiv.appendChild(this.problemLnk);
                this.problemSuffix = document.createTextNode(' (No.---)');
                this.contestDiv.appendChild(this.problemSuffix);
            }
            this.dateDiv = document.createElement('div');
            this.dateDiv.textContent = 'xxxx-xx-xx xx:xx:xx 〜 xxxx-xx-xx xx:xx:xx';
            // newdiv.innerText = `${contest.Name} (id=${contest.Id}) #${label} (No.${problem.No})`;
            card.appendChild(this.contestDiv);
            card.appendChild(this.dateDiv);
            if (isProblemPage) {
                this.prevNextProblemLinks = document.createElement('div');
                this.prevNextProblemLinks.textContent = '(情報取得中)';
                card.appendChild(this.prevNextProblemLinks);
            }
        }
        const content = document.querySelector('div#content');
        if (content === null) {
            throw new Error('div#content が見つかりませんでした');
        }
        content.insertAdjacentElement('afterbegin', cardWrapper);
    }
    confirmContest(contest) {
        this.contestLnk.innerText = `${contest.Name}`;
        this.contestLnk.href = `/contests/${contest.Id}`;
        this.contestSuffix.textContent = ` (id=${contest.Id})`;
        const format = '%Y-%m-%d (%a) %H:%M:%S';
        const start = formatDate(new Date(contest.Date), format);
        const end = formatDate(new Date(contest.EndDate), format);
        this.dateDiv.textContent = `${start} 〜 ${end}`;
    }
    confirmContestAndProblem(contest, problem, suffix = '') {
        this.confirmContest(contest);
        if (this.isProblemPage) {
            if (this.prevNextProblemLinks === undefined) {
                throw new ErrorEvent('prevNextProblemLinks が undefined です');
            }
            if (this.problemLnk === undefined) {
                throw new ErrorEvent('problemLnk が undefined です');
            }
            if (this.problemSuffix === undefined) {
                throw new ErrorEvent('problemSuffix が undefined です');
            }
            const idx = contest.ProblemIdList.findIndex((problemId) => problemId === problem.ProblemId);
            const label = getHeader(idx);
            this.problemLnk.innerText = `#${label}`;
            if (problem.No !== null) {
                this.problemLnk.href = `/problems/no/${problem.No}`;
                this.problemSuffix.textContent = ` (No.${problem.No})`;
            }
            else {
                this.problemLnk.href = `/problems/${problem.ProblemId}`;
            }
            this.prevNextProblemLinks.textContent = ' / ';
            if (idx > 0) {
                // prev
                const lnk = document.createElement('a');
                lnk.innerText = `←前の問題 (#${getHeader(idx - 1)})`;
                lnk.href = `/problems/${contest.ProblemIdList[idx - 1]}${suffix}`;
                this.prevNextProblemLinks.insertAdjacentElement('afterbegin', lnk);
            }
            if (idx + 1 < contest.ProblemIdList.length) {
                // next
                const lnk = document.createElement('a');
                lnk.innerText = `次の問題 (#${getHeader(idx + 1)})→`;
                lnk.href = `/problems/${contest.ProblemIdList[idx + 1]}${suffix}`;
                this.prevNextProblemLinks.insertAdjacentElement('beforeend', lnk);
            }
        }
    }
    confirmContestIsNotFound() {
        var _a, _b;
        this.contestLnk.remove();
        this.contestSuffix.remove();
        (_a = this.problemLnk) === null || _a === void 0 ? void 0 : _a.remove();
        (_b = this.problemSuffix) === null || _b === void 0 ? void 0 : _b.remove();
        this.dateDiv.remove();
        if (this.prevNextProblemLinks !== undefined) {
            this.prevNextProblemLinks.textContent = '(どのコンテストにも属さない問題です)';
        }
    }
    onProblemFetchFailed() {
        this.contestLnk.innerText = '???';
        if (this.prevNextProblemLinks !== undefined) {
            this.prevNextProblemLinks.textContent = '(情報が取得できませんでした)';
        }
    }
}

const onProblemPage = async (fetchProblem, suffix, APIClient) => {
    const toplinksManager = new TopLinksManager();
    toplinksManager.initContestLinks();
    const contestInfoCard = new ContestInfoCard();
    try {
        const [problem, problems, currentContest, pastContest, futureContests] = await Promise.all([
            fetchProblem(),
            APIClient.fetchProblems(),
            APIClient.fetchCurrentContests(),
            APIClient.fetchPastContests(),
            APIClient.fetchFutureContests(),
        ]);
        const contests = currentContest.concat(pastContest);
        let contest = contests.find((contest) => contest.ProblemIdList.includes(problem.ProblemId));
        if (contest === undefined) {
            // 未来のコンテストから探してみる
            if (problem.ProblemId !== undefined) {
                const futureContest = futureContests.find((contest) => contest.ProblemIdList.includes(problem.ProblemId));
                if (futureContest !== undefined) {
                    contest = futureContest;
                }
                else {
                    contestInfoCard.confirmContestIsNotFound();
                    toplinksManager.confirmWithoutContest(problem);
                    return null;
                }
            }
            else {
                contestInfoCard.confirmContestIsNotFound();
                toplinksManager.confirmWithoutContest(problem);
                return null;
            }
        }
        const contestProblems = getContestProblems(contest, problems);
        // print contest info
        contestInfoCard.confirmContestAndProblem(contest, problem, suffix);
        // add tabs
        toplinksManager.confirmContestLinks(contest.Id, contestProblems);
        return problem;
    }
    catch (error) {
        contestInfoCard.onProblemFetchFailed();
        return null;
    }
};
const onProblemPageByNo = async (problemNo, suffix, APIClient) => {
    return onProblemPage(() => APIClient.fetchProblemByNo(problemNo), suffix, APIClient);
};
const onProblemPageById = async (problemId, suffix, APIClient) => {
    return onProblemPage(() => APIClient.fetchProblemById(problemId), suffix, APIClient);
};
const colorScoreRow = (row, authorId, testerIds, yourId) => {
    const userLnk = row.querySelector('td.table_username a');
    if (userLnk === null) {
        throw new Error('テーブル行内にユーザへのリンクが見つかりませんでした');
    }
    const userId = anchorToUserID(userLnk);
    if (userId === -1)
        return;
    if (userId === authorId) {
        row.style.backgroundColor = 'honeydew';
        const label = document.createElement('div');
        label.textContent = '[作問者]';
        userLnk.insertAdjacentElement('afterend', label);
    }
    else if (testerIds.includes(userId)) {
        row.style.backgroundColor = 'honeydew';
        const label = document.createElement('div');
        label.textContent = '[テスター]';
        userLnk.insertAdjacentElement('afterend', label);
    }
    if (userId === yourId) {
        row.style.backgroundColor = 'aliceblue';
        const label = document.createElement('div');
        label.textContent = '[あなた]';
        userLnk.insertAdjacentElement('afterend', label);
    }
};
const onProblemScorePage = (problem) => {
    const yourId = getYourUserId();
    const testerIds = problem.TesterIds.split(',').map((testerIdString) => Number(testerIdString));
    const rows = document.querySelectorAll('table.table tbody tr');
    rows.forEach((row) => {
        colorScoreRow(row, problem.AuthorId, testerIds, yourId);
    });
};

const colorSubmissionRow = (row, authorId, testerIds, yourId) => {
    const userLnk = row.querySelector('td.table_username a');
    if (userLnk === null) {
        throw new Error('テーブル行内にユーザへのリンクが見つかりませんでした');
    }
    const userId = anchorToUserID(userLnk);
    if (userId === -1)
        return;
    if (userId === authorId) {
        row.style.backgroundColor = 'honeydew';
        const label = document.createElement('div');
        label.textContent = '[作問者]';
        userLnk.insertAdjacentElement('afterend', label);
    }
    else if (testerIds.includes(userId)) {
        row.style.backgroundColor = 'honeydew';
        const label = document.createElement('div');
        label.textContent = '[テスター]';
        userLnk.insertAdjacentElement('afterend', label);
    }
    if (userId === yourId) {
        row.style.backgroundColor = 'aliceblue';
        const label = document.createElement('div');
        label.textContent = '[あなた]';
        userLnk.insertAdjacentElement('afterend', label);
    }
};
const onProblemSubmissionsPage = (problem) => {
    const yourId = getYourUserId();
    const testerIds = problem.TesterIds.split(',').map((testerIdString) => Number(testerIdString));
    const rows = document.querySelectorAll('table.table tbody tr');
    rows.forEach((row) => {
        colorSubmissionRow(row, problem.AuthorId, testerIds, yourId);
    });
};
const onContestSubmissionsPage = async (contestId, APIClient) => {
    const toplinksManager = new TopLinksManager();
    toplinksManager.initContestProblems();
    toplinksManager.initContestSubmissions();
    const contestInfoCard = new ContestInfoCard(false);
    const yourId = getYourUserId();
    const [contest, problems] = await Promise.all([APIClient.fetchContestById(contestId), APIClient.fetchProblems()]);
    // print contest info
    contestInfoCard.confirmContest(contest);
    // add tabs
    const contestProblems = getContestProblems(contest, problems);
    toplinksManager.confirmContestProblems(contest.Id, contestProblems);
    toplinksManager.confirmContestSubmissions(contest.Id);
    const problemId2Label = contest.ProblemIdList.reduce((curMap, problemId, idx) => curMap.set(problemId, getHeader(idx)), new Map());
    const problemNo2ProblemMap = problems.reduce((curMap, problem) => {
        if (problem.No !== null)
            curMap.set(problem.No, problem);
        return curMap;
    }, new Map());
    // collect problemNos
    const rows = document.querySelectorAll('table.table tbody tr');
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        // add label to each problem link
        const lnk = row.querySelector('td a[href^="/problems/no/"]');
        if (lnk === null) {
            throw new Error('テーブル行内に問題へのリンクが見つかりませんでした');
        }
        const contestSubmissionsPageProblemLnkMatchArray = /^https:\/\/yukicoder\.me\/problems\/no\/(\d+)/.exec(lnk.href);
        if (contestSubmissionsPageProblemLnkMatchArray === null) {
            throw new Error('テーブル行内に含まれる問題リンク先が不正です');
        }
        const problemNo = Number(contestSubmissionsPageProblemLnkMatchArray[1]);
        if (!problemNo2ProblemMap.has(problemNo)) {
            try {
                const problem = await APIClient.fetchProblemByNo(problemNo);
                problemNo2ProblemMap.set(problemNo, problem);
            }
            catch (error) {
                problemNo2ProblemMap.set(problemNo, null);
            }
        }
        const problem = problemNo2ProblemMap.get(problemNo);
        if (problem === null || problem === undefined)
            return;
        const label = problemId2Label.get(problem.ProblemId);
        if (label !== undefined)
            lnk.insertAdjacentText('afterbegin', `#${label} `);
        // color authors and testers
        const testerIds = problem.TesterIds.split(',').map((testerIdString) => Number(testerIdString));
        colorSubmissionRow(row, problem.AuthorId, testerIds, yourId);
    }
};

const SUBMISSION_STATUSES = ['AC', 'WA', 'TLE', '--', 'MLE', 'OLE', 'QLE', 'RE', 'CE', 'IE', 'NoOut'];
const stringToStatus = (resultText) => {
    for (let i = 0; i < SUBMISSION_STATUSES.length; ++i) {
        if (SUBMISSION_STATUSES[i] == resultText)
            return SUBMISSION_STATUSES[i];
    }
    throw new Error(`未知のジャッジステータスです: ${resultText}`);
};
const onSubmissionResultPage = async (APIClient) => {
    const toplinksManager = new TopLinksManager();
    const contestInfoCard = new ContestInfoCard();
    const [resultCard, resultCardWrapper] = createCard();
    {
        // count
        const resultCountMap = SUBMISSION_STATUSES.reduce((prevMap, label) => prevMap.set(label, 0), new Map());
        // ジャッジ中（提出直後）は，このテーブルは存在しない
        const testTable = document.getElementById('test_table');
        if (testTable !== null) {
            const results = testTable.querySelectorAll('tbody tr td span.label');
            results.forEach((span) => {
                var _a;
                const resultText = span.textContent;
                if (resultText === null) {
                    throw new Error('ジャッジ結果テキストが空です');
                }
                const resultLabel = stringToStatus(resultText.trim());
                const cnt = (_a = resultCountMap.get(resultLabel)) !== null && _a !== void 0 ? _a : 0;
                resultCountMap.set(resultLabel, cnt + 1);
            });
        }
        const content = document.querySelector('div#testcase_table h4');
        // 提出直後，ジャッジ中は null
        if (content !== null) {
            content.insertAdjacentElement('afterend', resultCardWrapper);
            // print result
            const addResultRow = (cnt, label) => {
                const resultEntry = document.createElement('div');
                const labelSpan = document.createElement('span');
                labelSpan.textContent = label;
                labelSpan.classList.add('label');
                labelSpan.classList.add(label === 'AC' ? 'label-success' : label === 'IE' ? 'label-danger' : 'label-warning');
                resultEntry.appendChild(labelSpan);
                const countSpan = document.createTextNode(` × ${cnt}`);
                resultEntry.appendChild(countSpan);
                resultCard.appendChild(resultEntry);
            };
            resultCountMap.forEach((cnt, label) => {
                if (cnt > 0)
                    addResultRow(cnt, label);
            });
        }
    }
    const lnk = document.querySelector('div#content a[href^="/problems/no/"]');
    if (lnk === null) {
        throw new Error('結果ページ中に問題ページへのリンクが見つかりませんでした');
    }
    toplinksManager.initLink('問題', 'js-cy-problem', lnk.href);
    toplinksManager.initContestLinks();
    const submissionPageProblemLnkMatchArray = /^https:\/\/yukicoder\.me\/problems\/no\/(\d+)/.exec(lnk.href);
    if (submissionPageProblemLnkMatchArray === null) {
        throw new Error('結果ページに含まれる問題ページへのリンク先が不正です');
    }
    // get problems/contests info
    const problemNo = Number(submissionPageProblemLnkMatchArray[1]);
    const [problem, problems, currentContest, pastContest] = await Promise.all([
        APIClient.fetchProblemByNo(problemNo),
        APIClient.fetchProblems(),
        APIClient.fetchCurrentContests(),
        APIClient.fetchPastContests(),
    ]);
    const contests = currentContest.concat(pastContest);
    const contest = contests.find((contest) => contest.ProblemIdList.includes(problem.ProblemId));
    // add tabs
    if (contest !== undefined) {
        const contestProblems = getContestProblems(contest, problems);
        toplinksManager.confirmContestLinks(contest.Id, contestProblems);
        // print contest info
        contestInfoCard.confirmContestAndProblem(contest, problem);
    }
};

const BASE_URL = 'https://yukicoder.me';
const STATIC_API_BASE_URL = `${BASE_URL}/api/v1`;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const assertResultIsValid = (obj) => {
    if ('Message' in obj)
        throw new Error(obj.Message);
};
const fetchJson = async (url) => {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(res.statusText);
    }
    const obj = (await res.json());
    assertResultIsValid(obj);
    return obj;
};
// TODO pid/no->contest, の変換も受け持つほうが良い？（html 解析絡みをこのクラスに隠蔽できる）
// 「現在のコンテスト」
class CachedAPIClient {
    constructor() {
        this.pastContestsMap = new Map();
        this.currentContestsMap = new Map();
        this.futureContestsMap = new Map();
        this.problemsMapById = new Map();
        this.problemsMapByNo = new Map();
    }
    async fetchPastContests() {
        if (this.pastContests === undefined) {
            this.pastContests = await fetchJson(`${STATIC_API_BASE_URL}/contest/past`);
            this.pastContests.forEach((contest) => {
                if (!this.pastContestsMap.has(contest.Id))
                    this.pastContestsMap.set(contest.Id, contest);
            });
        }
        return this.pastContests;
    }
    async fetchCurrentContests() {
        if (this.currentContests === undefined) {
            this.currentContests = await fetchJson(`${STATIC_API_BASE_URL}/contest/current`);
            this.currentContests.forEach((contest) => {
                if (!this.currentContestsMap.has(contest.Id))
                    this.currentContestsMap.set(contest.Id, contest);
            });
        }
        return this.currentContests;
    }
    async fetchFutureContests() {
        if (this.futureContests === undefined) {
            this.futureContests = await fetchJson(`${STATIC_API_BASE_URL}/contest/future`);
            this.futureContests.forEach((contest) => {
                if (!this.futureContestsMap.has(contest.Id))
                    this.futureContestsMap.set(contest.Id, contest);
            });
        }
        return this.futureContests;
    }
    async fetchContestById(contestId) {
        if (this.pastContestsMap.has(contestId)) {
            return this.pastContestsMap.get(contestId);
        }
        if (this.currentContestsMap.has(contestId)) {
            return this.currentContestsMap.get(contestId);
        }
        if (this.futureContestsMap.has(contestId)) {
            return this.futureContestsMap.get(contestId);
        }
        const contest = await fetchJson(`${STATIC_API_BASE_URL}/contest/id/${contestId}`);
        const currentDate = new Date();
        const startDate = new Date(contest.Date);
        const endDate = new Date(contest.EndDate);
        if (currentDate > endDate) {
            this.pastContestsMap.set(contestId, contest);
        }
        else if (currentDate > startDate) {
            this.currentContestsMap.set(contestId, contest);
        }
        return contest;
    }
    async fetchProblems() {
        if (this.problems === undefined) {
            this.problems = await fetchJson(`${STATIC_API_BASE_URL}/problems`);
            this.problems.forEach((problem) => {
                if (!this.problemsMapById.has(problem.ProblemId))
                    this.problemsMapById.set(problem.ProblemId, problem);
                if (problem.No !== null && !this.problemsMapByNo.has(problem.No))
                    this.problemsMapByNo.set(problem.No, problem);
            });
        }
        return this.problems;
    }
    async fetchProblemById(problemId) {
        if (this.problemsMapById.has(problemId)) {
            return this.problemsMapById.get(problemId);
        }
        try {
            const problem = await fetchJson(`${STATIC_API_BASE_URL}/problems/${problemId}`);
            this.problemsMapById.set(problem.ProblemId, problem);
            if (problem.No !== null)
                this.problemsMapByNo.set(problem.No, problem);
            return problem;
        }
        catch (_a) {
            await this.fetchProblems();
            if (this.problemsMapById.has(problemId)) {
                return this.problemsMapById.get(problemId);
            }
            // 問題一覧には載っていない -> 未来のコンテストの問題
            // ProblemId なので，未来のコンテスト一覧に載っている pid リストから，
            // コンテストは特定可能．
            return { ProblemId: problemId, No: null };
        }
    }
    async fetchProblemByNo(problemNo) {
        if (this.problemsMapByNo.has(problemNo)) {
            return this.problemsMapByNo.get(problemNo);
        }
        try {
            const problem = await fetchJson(`${STATIC_API_BASE_URL}/problems/no/${problemNo}`);
            this.problemsMapById.set(problem.ProblemId, problem);
            if (problem.No !== null)
                this.problemsMapByNo.set(problem.No, problem);
            return problem;
        }
        catch (_a) {
            await this.fetchProblems();
            if (this.problemsMapByNo.has(problemNo)) {
                return this.problemsMapByNo.get(problemNo);
            }
            // 問題一覧には載っていない -> 未来のコンテストの問題
            return { No: problemNo };
        }
    }
}

void (async () => {
    const href = location.href;
    const hrefMatchArray = /^https:\/\/yukicoder\.me(.+)/.exec(href);
    if (hrefMatchArray === null)
        return;
    const path = hrefMatchArray[1];
    const APIClient = new CachedAPIClient();
    // on problem page (ProblemNo)
    // e.g. https://yukicoder.me/problems/no/1313
    const problemPageMatchArray = /^\/problems\/no\/(\d+)(.*)/.exec(path);
    if (problemPageMatchArray !== null) {
        // get contest info
        const problemNo = Number(problemPageMatchArray[1]);
        const suffix = problemPageMatchArray[2];
        const problem = await onProblemPageByNo(problemNo, suffix, APIClient);
        if (problem === null)
            return;
        const problemSubmissionsPageMatchArray = /^\/problems\/no\/(\d+)\/submissions/.exec(path);
        if (problemSubmissionsPageMatchArray !== null) {
            onProblemSubmissionsPage(problem);
        }
        // on problem score page (ProblemNo)
        // e.g. https://yukicoder.me/problems/no/5004/score
        const problemScorePageMatchArray = /^\/problems\/no\/(\d+)\/score(.*)/.exec(path);
        if (problemScorePageMatchArray !== null) {
            onProblemScorePage(problem);
        }
        return;
    }
    // on problem page (ProblemId)
    // e.g. https://yukicoder.me/problems/5191
    const problemPageByIdMatchArray = /^\/problems\/(\d+)(.*)/.exec(path);
    if (problemPageByIdMatchArray !== null) {
        // get contest info
        const problemId = Number(problemPageByIdMatchArray[1]);
        const suffix = problemPageByIdMatchArray[2];
        const problem = await onProblemPageById(problemId, suffix, APIClient);
        if (problem === null)
            return;
        const problemSubmissionsPageMatchArray = /^\/problems\/(\d+)\/submissions/.exec(path);
        if (problemSubmissionsPageMatchArray !== null) {
            onProblemSubmissionsPage(problem);
        }
        return;
    }
    // on contest submissions page / statistics page
    // e.g. https://yukicoder.me/contests/300/submissions, https://yukicoder.me/contests/300/statistics
    const contestSubmissionsPageMatchArray = /^\/contests\/(\d+)\/(submissions|statistics)/.exec(path);
    if (contestSubmissionsPageMatchArray !== null) {
        const contestId = Number(contestSubmissionsPageMatchArray[1]);
        await onContestSubmissionsPage(contestId, APIClient);
        return;
    }
    // on submission result page
    // e.g. https://yukicoder.me/submissions/591424
    const submissionPageMatchArray = /^\/submissions\/\d+/.exec(path);
    if (submissionPageMatchArray !== null) {
        await onSubmissionResultPage(APIClient);
        return;
    }
    // on contest leaderboard page
    // e.g. https://yukicoder.me/contests/300/table
    const leaderboardPageMatchArray = /^\/contests\/(\d+)\/(table|all)/.exec(path);
    if (leaderboardPageMatchArray !== null) {
        const contestId = Number(leaderboardPageMatchArray[1]);
        await onLeaderboardPage(contestId, APIClient);
        return;
    }
    // on contest problem list page
    // e.g. https://yukicoder.me/contests/300
    const contestPageMatchArray = /^\/contests\/(\d+)$/.exec(path);
    if (contestPageMatchArray !== null) {
        const contestId = Number(contestPageMatchArray[1]);
        onContestPage(contestId);
        return;
    }
})();
