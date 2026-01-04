// ==UserScript==
// @name         Osu!猜歌
// @namespace    https://github.com/Exsper/
// @supportURL   https://github.com/Exsper/osuweb-tools/issues
// @version      0.0.6
// @description  osu猜歌，需要先登录osu账号，在玩家页使用
// @author       Exsper
// @match        https://osu.ppy.sh/users/*
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @license      MIT License
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/499287/Osu%21%E7%8C%9C%E6%AD%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/499287/Osu%21%E7%8C%9C%E6%AD%8C.meta.js
// ==/UserScript==

let GMX;
if (typeof GM == "undefined") {
    GMX = {
        xmlHttpRequest: GM_xmlhttpRequest,
    };
} else {
    GMX = GM;
}

function getAPI(url, method = "GET") {
    return new Promise(function (resolve, reject) {
        GMX.xmlHttpRequest({
            method: method,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            url: url,
            timeout: 10000,
            responseType: "json",
            onload: function (data) {
                if ((data.status >= 200 && data.status < 300) || data.status == 304) {
                    resolve(data.response);
                } else {
                    reject({
                        status: data.status,
                        statusText: data.statusText
                    });
                }
            },
            onerror: function (data) {
                reject({
                    status: data.status,
                    statusText: data.statusText
                });
            }
        });
    });
}

class BeatmapSetInfo {
    constructor() {
        this.id = -1;
        this.artist = "";
        this.artist_unicode = "";
        this.cover = "";
        this.title = "";
        this.title_unicode = "";
        this.creator = "";
        this.preview_url = "";
    }

    convertFromBP(bpdata) {
        this.id = bpdata.beatmapset.id;
        this.artist = bpdata.beatmapset.artist;
        this.artist_unicode = bpdata.beatmapset.artist_unicode;
        this.cover = bpdata.beatmapset.covers.cover;
        this.title = bpdata.beatmapset.title;
        this.title_unicode = bpdata.beatmapset.title_unicode;
        this.creator = bpdata.beatmapset.creator;
        this.preview_url = "https:" + bpdata.beatmapset.preview_url;
        return this;
    }

    convertFromMostPlayed(mpdata) {
        this.id = mpdata.beatmapset.id;
        this.artist = mpdata.beatmapset.artist;
        this.artist_unicode = mpdata.beatmapset.artist_unicode;
        this.cover = mpdata.beatmapset.covers.cover;
        this.title = mpdata.beatmapset.title;
        this.title_unicode = mpdata.beatmapset.title_unicode;
        this.creator = mpdata.beatmapset.creator;
        this.preview_url = "https:" + mpdata.beatmapset.preview_url;
        return this;
    }

    convertFromRankingMostPlayed(rdata) {
        this.id = rdata.id;
        this.artist = rdata.artist;
        this.artist_unicode = rdata.artist_unicode;
        this.cover = rdata.covers.cover;
        this.title = rdata.title;
        this.title_unicode = rdata.title_unicode;
        this.creator = rdata.creator;
        this.preview_url = "https:" + rdata.preview_url;
        return this;
    }
}

class GuessData {
    /**
     * @param {Array<BeatmapSetInfo>} bsis 
     */
    constructor(bsis) {
        this.bsis = bsis;
        this.filter();
        this.guessed = [];
    }

    filter() {
        let ids = [];
        let bsis = [];
        this.bsis.map((bsi) => {
            if (ids.includes(bsi.id)) {
                console.log("[Guess] " + bsi.id + " 相同谱面集ID，丢弃");
                return;
            }
            if (bsi.preview_url.length <= 8) {
                console.log("[Guess] " + bsi.id + " 无预览音频，丢弃");
                return;
            }
            if (bsi.cover.length <= 8) {
                console.log("[Guess] " + bsi.id + " 无背景图，丢弃");
                return;
            }
            ids.push(bsi.id);
            bsis.push(bsi);
        });
        this.bsis = bsis;
    }

    getQuestion() {
        if (this.bsis.length <= 0) return null;
        let index = Math.floor(Math.random() * this.bsis.length);
        let bsi = this.bsis[index];
        this.guessed.push(bsi);
        this.bsis.splice(index, 1);
        return bsi;
    }

    getLeftQuestionCount() {
        return this.bsis.length;
    }
}

function getUrlWithParams(url, params) {
    if (params) {
        var paramarray = [];
        for (var k in params) {
            paramarray.push(k + "=" + encodeURIComponent(params[k]));
        }
        return url + "?" + paramarray.join("&");
    } else {
        return url;
    }
}

class BPInfo {
    static async getBPInfo(href, mode) {
        try {
            let params = { mode, limit: 100, offset: 0 };
            let url = getUrlWithParams(href + "/scores/best", params);
            let mi = await getAPI(url, "GET").then((data) => {
                if (!data || !Array.isArray(data)) return null;
                return data;
            });
            return mi;
        }
        catch (ex) {
            console.log(ex);
            return null;
        }
    }

    static getMode() {
        let selectMode = $(".game-mode-link.game-mode-link--active").attr("data-mode");
        let mode = "osu";
        if (selectMode.indexOf("taiko") >= 0) mode = "taiko";
        if (selectMode.indexOf("fruits") >= 0) mode = "fruits";
        if (selectMode.indexOf("mania") >= 0) mode = "mania";
        return mode;
    }

    static getUrl() {
        let urlex = /users\/\d+/.exec(location.href);
        if (urlex) {
            return location.origin + "/" + urlex[0];
        }
        else throw "网址错误";
    }

    static convert2GuessData(data) {
        let bsis = data.map((b) => {
            return new BeatmapSetInfo().convertFromBP(b);
        });
        return new GuessData(bsis);
    }

    static async getGuessData() {
        let data = await this.getBPInfo(this.getUrl(), this.getMode());
        if (data) {
            return this.convert2GuessData(data);
        }
        else {
            throw "无法获取BP信息";
        }
    }
}

class MostPlayedInfo {
    static async getMostPlayedInfo(href) {
        try {
            let params = { limit: 100, offset: 0 };
            let url = getUrlWithParams(href + "/beatmapsets/most_played", params);
            let mi = await getAPI(url, "GET").then((data) => {
                if (!data || !Array.isArray(data)) return null;
                return data;
            });
            return mi;
        }
        catch (ex) {
            console.log(ex);
            return null;
        }
    }

    static getUrl() {
        let urlex = /users\/\d+/.exec(location.href);
        if (urlex) {
            return location.origin + "/" + urlex[0];
        }
        else throw "网址错误";
    }

    static convert2GuessData(data) {
        let bsis = data.map((b) => {
            return new BeatmapSetInfo().convertFromMostPlayed(b);
        });
        return new GuessData(bsis);
    }

    static async getGuessData() {
        let data = await this.getMostPlayedInfo(this.getUrl());
        if (data) {
            return this.convert2GuessData(data);
        }
        else {
            throw "无法获取最多游玩信息";
        }
    }
}

class FavouriteInfo {
    static async getFavouriteInfo(href) {
        try {
            let params = { limit: 100, offset: 0 };
            let url = getUrlWithParams(href + "/beatmapsets/favourite", params);
            let mi = await getAPI(url, "GET").then((data) => {
                if (!data || !Array.isArray(data)) return null;
                return data;
            });
            return mi;
        }
        catch (ex) {
            console.log(ex);
            return null;
        }
    }

    static getUrl() {
        let urlex = /users\/\d+/.exec(location.href);
        if (urlex) {
            return location.origin + "/" + urlex[0];
        }
        else throw "网址错误";
    }

    static convert2GuessData(data) {
        let bsis = data.map((b) => {
            // 格式与ranking一致
            return new BeatmapSetInfo().convertFromRankingMostPlayed(b);
        });
        return new GuessData(bsis);
    }

    static async getGuessData() {
        let data = await this.getFavouriteInfo(this.getUrl());
        if (data) {
            return this.convert2GuessData(data);
        }
        else {
            throw "无法获取个人收藏信息";
        }
    }
}

class BeatmapRankingInfo {
    static async getRankingMostPlayedInfo(mode, sort) {
        try {
            let mi = await getAPI(`https://osu.ppy.sh/beatmapsets/search?e=&c=&g=&l=&m=${mode}&nsfw=&played=&q=&r=&sort=${sort}&s=`, "GET").then((data) => {
                if (!data || !Array.isArray(data.beatmapsets)) return null;
                return data;
            });
            return mi;
        }
        catch (ex) {
            console.log(ex);
            return null;
        }
    }

    static getMode() {
        let selectMode = $(".game-mode-link.game-mode-link--active").attr("data-mode");
        let mode = "";
        if (selectMode.indexOf("taiko") >= 0) mode = "1";
        if (selectMode.indexOf("fruits") >= 0) mode = "2";
        if (selectMode.indexOf("mania") >= 0) mode = "3";
        return mode;
    }

    static convert2GuessData(data) {
        let bsis = data.map((b) => {
            return new BeatmapSetInfo().convertFromRankingMostPlayed(b);
        });
        return new GuessData(bsis);
    }

    /**
     * @param {"plays_desc"|"favourites_desc"} key 
     * @returns {GuessData}
     */
    static async getGuessData(key) {
        let data = await this.getRankingMostPlayedInfo(this.getMode(), key);
        if (data && data.beatmapsets) {
            return this.convert2GuessData(data.beatmapsets);
        }
        else {
            throw "无法获取谱面排行页信息";
        }
    }
}

class GuessStat {
    /**
     * @param {"song"|"bg"} questionType 
     * @param {GuessData} gd 
     * @param {number} questionCount
     */
    constructor(questionType, gd, questionCount) {
        this.questionType = questionType;
        this.guessdata = gd;
        this.questionCount = questionCount;
        if (this.questionCount >= this.guessdata.getLeftQuestionCount()) this.questionCount = this.guessdata.getLeftQuestionCount();
        this.guessedCount = 0;
        this.correctCount = 0;
        this.currentIndex = 0;
        this.currentScore = 0;
        this.totalScore = 0;
        this.isGuessing = false;

        /** @type {BeatmapSetInfo|null} */
        this.nowQuestion = null;

        this.tipLeft = 3;
        this.songShown = false;
        this.bgShown = false;
        this.artistShown = false;
        this.creatorShown = false;

        this.answerTimer = null;
    }

    startGuess() {
        this.isGuessing = true;
        this.tipLeft = 3;
        this.songShown = false;
        this.bgShown = false;
        this.artistShown = false;
        this.creatorShown = false;

        this.nowQuestion = this.guessdata.getQuestion();

        if (!this.nowQuestion) return;

        if (!this.nowQuestion.artist_unicode && !this.nowQuestion.artist) {
            // 某些谱面没有artist
            this.tipLeft -= 1;
            this.artistShown = true;
        }

        this.currentIndex += 1;

        // 原始得分1000，每2秒-10分，每个提示-100分，减到500停止
        this.currentScore = 1000;

        this.answerTimer = setInterval(() => {
            this.currentScore -= 10;
            if (this.currentScore <= 500) {
                this.currentScore = 500;
                clearInterval(this.answerTimer);
                this.answerTimer = null;
            }
        }, 2000);
    }

    showTip() {
        if (this.tipLeft <= 0) return null;
        this.tipLeft -= 1;

        let pool = [];
        if (!this.songShown && this.questionType === "bg") pool.push(1);
        if (!this.bgShown && this.questionType === "song") pool.push(2);
        if (!this.artistShown) pool.push(3);
        if (!this.creatorShown) pool.push(4);

        this.currentScore -= 100;
        if (this.currentScore <= 500) {
            this.currentScore = 500;
        }

        let index = Math.floor(Math.random() * pool.length);
        switch (pool[index]) {
            case 1: {
                this.songShown = true;
                return { type: "song", content: this.nowQuestion.preview_url };
            }
            case 2: {
                this.bgShown = true;
                return { type: "bg", content: this.nowQuestion.cover };
            }
            case 3: {
                this.artistShown = true;
                let tipText = (this.nowQuestion.artist_unicode && this.nowQuestion.artist_unicode !== this.nowQuestion.artist) ? this.nowQuestion.artist_unicode + " (" + this.nowQuestion.artist + ")" : this.nowQuestion.artist;
                return { type: "text", content: "曲师为：" + tipText };
            }
            case 4: {
                this.creatorShown = true;
                return { type: "text", content: "谱师为：" + this.nowQuestion.creator };
            }
        }
    }

    checkAnswer(answer) {
        const minDistancePercent = 0.5;

        function edit_distance(a, b) {
            let lena = a.length;
            let lenb = b.length;
            let d = new Array(lena + 1).fill(0).map(e => new Array(lenb + 1).fill(0));;
            let i, j;

            for (i = 0; i <= lena; i++) {
                d[i][0] = i;
            }
            for (j = 0; j <= lenb; j++) {
                d[0][j] = j;
            }

            for (i = 1; i <= lena; i++) {
                for (j = 1; j <= lenb; j++) {
                    if (a[i - 1] == b[j - 1]) {
                        d[i][j] = d[i - 1][j - 1];
                    } else {
                        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + 1);
                    }
                }
            }

            return d[lena][lenb];
        }

        if (this.nowQuestion.title_unicode) {
            let _title = this.nowQuestion.title_unicode.replace(/[\/:*?"<>| ]/g, "").toLocaleLowerCase();
            if (_title.length <= 0) _title = this.nowQuestion.title_unicode.toLocaleLowerCase();
            let _answer = answer.replace(/[\/:*?"<>| ]/g, "").toLocaleLowerCase();
            if (_answer.length <= 0) _answer = answer.toLocaleLowerCase();
            let dp = edit_distance(_title, _answer) / Math.pow(_title.length, 1.1);
            if (dp <= minDistancePercent) return true;
        }
        let _title = this.nowQuestion.title.replace(/[\/:*?"<>| ]/g, "").replace(/[^a-zA-Z0-9]/g, "").toLocaleLowerCase();
        let _answer = answer.replace(/[\/:*?"<>| ]/g, "").replace(/[^a-zA-Z0-9]/g, "").toLocaleLowerCase();
        if (_title.length <= 0) return false;
        let dp = edit_distance(_title, _answer) / Math.pow(_title.length, 1.1);
        if (dp <= minDistancePercent) return true;
        return false;
    }

    passGuessOne() {
        this.isGuessing = false;
        clearInterval(this.answerTimer);
        this.answerTimer = null;
        this.guessedCount += 1;
        this.correctCount += 1;
        this.totalScore += this.currentScore;
    }

    abortGuessOne() {
        this.isGuessing = false;
        clearInterval(this.answerTimer);
        this.answerTimer = null;
        this.guessedCount += 1;
    }

    getLeftQuestionCount() {
        let bsisLeft = this.guessdata.getLeftQuestionCount();
        let thisRoundLeft = this.questionCount - this.guessedCount;
        return Math.min(bsisLeft, thisRoundLeft);
    }
}

function addCss() {
    if (!$(".song-guess-style").length) {
        $(document.head).append($("<style class='song-guess-style'></style>").html(
            `
            .guesslabel {font-size: 18px; margin-right: 10px;}
            .guessButton {margin: 0 10px; font-size: 24px; background-color: #5864ff; border: none; color: white;}
            .guessButton:hover {background-color: #7781ff;}
            .guessButton:disabled {background-color: #b7b7b7;}
            .guessCloseBtnDiv {position: absolute; right: 15px; top: 15px;}
            .guessPanel {height: 80%; overflow-y: auto; color: #000; width: 80%; max-width: 800px; position: fixed; display: none;z-index: 10000;padding: 15px 20px 10px;-webkit-border-radius: 10px;-moz-border-radius: 10px;border-radius: 10px;background: #fff; left: 50%; top:50%; transform: translate(-50%, -50%);}
            .guessOverlay {position: fixed;top: 0;left: 0;bottom:0;right:0;width: 100%;height: 100%;z-index: 9999;background: #000;display: none;-ms-filter: 'alpha(Opacity=50)';-moz-opacity: .5;-khtml-opacity: .5;opacity: .5;}
            `
        ));
    }
}

function openRankPanel(guessStat) {
    let guessContent = $("#guessContent");
    guessContent.empty();
    $("#guessOverlay").fadeIn(200);
    $("#guessPanel").fadeIn(200);

    let score = guessStat.totalScore;
    let max_score = guessStat.guessedCount * 1000;
    let percent = score / max_score;
    let rank = "";
    if (percent >= 0.9) rank = "举世无双";
    else if (percent >= 0.8) rank = "登峰造极";
    else if (percent >= 0.7) rank = "技冠群雄";
    else if (percent >= 0.6) rank = "炉火纯青";
    else if (percent >= 0.5) rank = "出类拔萃";
    else if (percent >= 0.4) rank = "略有小成";
    else if (percent >= 0.3) rank = "渐入佳境";
    else if (percent >= 0.2) rank = "略知一二";
    else if (percent >= 0.1) rank = "初窥门径";
    else rank = "未曾涉猎";

    let stars = new Array(Math.ceil(percent * 10)).fill("★").join("");

    guessContent.append(
        `
        <span style="display: grid;font-size: 32px;">猜歌结束</span>
        <br>
        <br>

        <span style="font-size: 24px;">您猜了</span>
        <span style="font-size: 36px;">${guessStat.guessedCount}</span>
        <span style="font-size: 24px;">首歌</span>
  
        <br>

        <span style="font-size: 24px;">共答对了</span>
        <span style="font-size: 48px;">${guessStat.correctCount}</span>
        <span style="font-size: 24px;">首</span>

        <br>

        <span style="font-size: 24px;">您的评价是...</span>
        <br>
        <br>
        <span style="font-size: 128px;">${rank}</span>
        <br>
        <span style="font-size: 32px;">${stars}</span>
        <br>
        <br>
        <br>

        <button id="guess-restart" class="guessButton" style="width: 60%; height: 80px">重新猜歌</button>
        </div>
        `
    );

    $("#guess-restart").click(() => {
        openSettingPanel();
    });
}

function openGuessPanel(guessStat) {
    let guessContent = $("#guessContent");
    guessContent.empty();
    $("#guessOverlay").fadeIn(200);
    $("#guessPanel").fadeIn(200);

    guessContent.append(
        `
        <div style="margin-top: 30px;display: flex;flex-wrap: wrap;justify-content: space-evenly;">
        <span id="guess-question-index">#</span>
        <span id="guess-question-score">得分：</span>
        <span id="guess-correct-count">答对题目：</span>
        <span id="guess-total-score">总得分：</span>
        </div>
        <br>
        <br>

        <span id="guess-stat-text" style="display: grid;font-size: 32px;">请输入歌曲名称</span>
        <br>
        <br>

        <div id="guess-question-main" style="display: flex;justify-content: center;flex-wrap: wrap;">
        </div>
        <br>
        <br>

        <div id="guess-question-tips" style="display: flex;justify-content: center;flex-wrap: wrap;">
        </div>
        <br>
        <br>

        <div style="display: flex;justify-content: space-evenly;bottom: 100px;position: absolute;width: 95%;font-size: 32px;">
        <input type="text" id="guess-question-answer" style="text-align: center; width: 100%;" autocomplete="off" autofocus></input>
        </div>
        <br>
        <br>

        <div style="display: flex;justify-content: space-evenly;bottom: 20px;position: absolute;width: 95%;">
        <button id="guess-abort" class="guessButton" style="width: 30%; height: 60px">放弃</button>
        <button id="guess-enter" class="guessButton" style="width: 40%; height: 60px">确定</button>
        <button id="guess-tip" class="guessButton" style="width: 30%; height: 60px">提示</button>
        </div>
        `
    );

    let dataUpdateTimer = setInterval(() => {
        $("#guess-question-index").text("#" + guessStat.currentIndex + "/" + guessStat.questionCount);
        $("#guess-question-score").text("得分：" + guessStat.currentScore);
        $("#guess-correct-count").text("答对题目：" + guessStat.correctCount + "/" + guessStat.guessedCount);
        $("#guess-total-score").text("总得分：" + guessStat.totalScore);
        if (!$("#guessPanel").is(":visible")) {
            clearInterval(dataUpdateTimer);
            dataUpdateTimer = null;
        }
    }, 1000);

    function showQuestion() {
        $("#guess-question-main").empty();
        $("#guess-question-tips").empty();
        $("#guess-question-answer").val("");
        $("#guess-question-answer").focus();

        guessStat.startGuess();
        if (!guessStat.nowQuestion) {
            $("#guess-enter").text("出错了！");
            return;
        }
        $("#guess-stat-text").text("请输入歌曲名称");

        $("#guess-abort").attr("disabled", false);
        $("#guess-enter").attr("disabled", false);
        $("#guess-enter").text("确定");
        $("#guess-tip").attr("disabled", false);
        $("#guess-tip").text("提示");

        if (guessStat.questionType === "song") {
            $("#guess-question-main").append(
                `
            <audio controls>
            <source src="${guessStat.nowQuestion.preview_url}" type="audio/mpeg">
            Your browser does not support the audio element.
            </audio>
            `
            );
        }
        else if (guessStat.questionType === "bg") {
            $("#guess-question-main").append(
                `
            <img src="${guessStat.nowQuestion.cover}" height="100px">
            `
            );
        }
    }

    function showTip() {
        let tip = guessStat.showTip();
        if (tip) {
            if (tip.type === "song") {
                $("#guess-question-tips").append(
                    `
                <audio controls>
                <source src="${tip.content}" type="audio/mpeg">
                Your browser does not support the audio element.
                </audio>
                `
                );
            }
            else if (tip.type === "bg") {
                $("#guess-question-tips").append(
                    `
                <img src="${tip.content}" height="100px">
                `
                );
            }
            else if (tip.type === "text") {
                $("#guess-question-tips").append(
                    `
                <span style="width: 100%;">${tip.content}</span>
                `
                );
            }
        }
        if (guessStat.tipLeft <= 0) {
            $("#guess-tip").attr("disabled", true);
            $("#guess-tip").text("没了");
        }
    }

    function showCorrectAnswer() {
        if (guessStat.nowQuestion.title_unicode) $("#guess-question-answer").val(guessStat.nowQuestion.title_unicode);
        else $("#guess-question-answer").val(guessStat.nowQuestion.title);
    }

    function waitForNext() {
        $("#guess-abort").attr("disabled", true);
        $("#guess-tip").attr("disabled", true);
        $("#guess-enter").attr("disabled", false);
        $("#guess-enter").text("下一首");
    }

    function finishGame() {
        clearInterval(dataUpdateTimer);
        dataUpdateTimer = null;
        $("#guess-abort").attr("disabled", true);
        $("#guess-tip").attr("disabled", true);
        $("#guess-enter").attr("disabled", true);
        $("#guess-enter").text("游戏结束");
        openRankPanel(guessStat);
    }

    $("#guess-abort").click(() => {
        $("#guess-stat-text").text("跳过该曲目");
        guessStat.abortGuessOne();
        showCorrectAnswer();
        if (guessStat.getLeftQuestionCount() > 0) waitForNext();
        else finishGame();
    });

    $("#guess-tip").click(() => {
        showTip();
    });

    $("#guess-question-answer").keydown((event) => {
        if (event.keyCode === 13) {
            $("#guess-enter").click();
        }
    });

    $("#guess-enter").click(() => {
        if (guessStat.isGuessing) {
            if (guessStat.checkAnswer($("#guess-question-answer").val())) {
                $("#guess-stat-text").text("恭喜您，答对了！");
                showCorrectAnswer();
                guessStat.passGuessOne();
                if (guessStat.getLeftQuestionCount() > 0) waitForNext();
                else finishGame();
            }
            else {
                $("#guess-enter").text("答案不对！");
            }
        }
        else {
            showQuestion();
        }
    });

    showQuestion();
}

function openSettingPanel() {
    let guessContent = $("#guessContent");
    guessContent.empty();
    $("#guessOverlay").fadeIn(200);
    $("#guessPanel").fadeIn(200);

    guessContent.append(
        `
        <span style="display: grid;font-size: 32px;">欢迎来到osu!猜歌</span>
        <br>
        <br>

        <span style="font-size: 24px;">选择题库来源：</span>
        <br>
        <input type="radio" id="guess-source-bp" name="guess-source" value="bp" checked>
        <label for="guess-source-bp" class="guesslabel">个人BP列表</label>
  
        <input type="radio" id="guess-source-mp" name="guess-source" value="mp">
        <label for="guess-source-mp" class="guesslabel">个人最多游玩</label>

        <input type="radio" id="guess-source-fav" name="guess-source" value="fav">
        <label for="guess-source-fav" class="guesslabel">个人收藏</label>

        <br>

        <input type="radio" id="guess-source-rmp" name="guess-source" value="rmp">
        <label for="guess-source-rmp" class="guesslabel">最多游玩谱面TOP50</label>

        <input type="radio" id="guess-source-rmf" name="guess-source" value="rmf">
        <label for="guess-source-rmf" class="guesslabel">最多收藏谱面TOP50</label>
        <br>
        <span>将按当前网页的玩家和模式获取谱面数据</span>
        <br>
        <br>

        <span style="font-size: 24px;">选择题库数量：</span>
        <br>
        <input type="radio" id="guess-count-10" name="guess-count" value="10" checked>
        <label for="guess-count-10" class="guesslabel">10</label>

        <input type="radio" id="guess-count-15" name="guess-count" value="15">
        <label for="guess-count-15" class="guesslabel">15</label>

        <input type="radio" id="guess-count-20" name="guess-count" value="20">
        <label for="guess-count-20" class="guesslabel">20</label>

        <input type="radio" id="guess-count-100" name="guess-count" value="100">
        <label for="guess-count-100" class="guesslabel">最大</label>

        <br>

        <input type="radio" id="guess-count-custom" name="guess-count" value="-1">
        <label for="guess-count-custom" class="guesslabel">自定义：</label>
        <input type="number" id="guess-count-custom-num" min="1" max="100" step="1" value="50">
        <br>
        <br>

        <span style="font-size: 24px;">选择猜歌方式：</span>
        <br>
        <input type="radio" id="guess-type-song" name="guess-type" value="song" checked>
        <label for="guess-type-song" class="guesslabel">音频猜歌</label>
  
        <input type="radio" id="guess-type-bg" name="guess-type" value="bg">
        <label for="guess-type-bg" class="guesslabel">图片猜歌</label>
        <br>
        <br>

        <div style="display: flex;justify-content: center;">
        <button id="guess-start" class="guessButton" style="width: 60%; height: 80px">开始猜歌</button>
        </div>
        `
    );

    $("#guess-count-custom-num").on("input", () => {
        $("#guess-count-custom").prop("checked", true);
    });

    $("#guess-start").click(async () => {
        let guessSource = $("input[name=guess-source]:checked").val();
        let questionCount = parseInt($("input[name=guess-count]:checked").val());
        if (questionCount <= 0) {
            questionCount = parseInt($("#guess-count-custom-num").val());
            if (questionCount <= 0) questionCount = 10;
            else if (questionCount > 100) questionCount = 100;
        }
        let guessType = $("input[name=guess-type]:checked").val();
        $("#guess-start").attr("disabled", true);
        $("#guess-start").text("正在获取题库...");
        let guessdata;
        try {
            if (guessSource === "bp") {
                guessdata = await BPInfo.getGuessData();
            }
            else if (guessSource === "mp") {
                guessdata = await MostPlayedInfo.getGuessData();
            }
            else if (guessSource === "fav") {
                guessdata = await FavouriteInfo.getGuessData();
            }
            else if (guessSource === "rmp") {
                guessdata = await BeatmapRankingInfo.getGuessData("plays_desc");
            }
            else if (guessSource === "rmf") {
                guessdata = await BeatmapRankingInfo.getGuessData("favourites_desc");
            }
        }
        catch (ex) {
            $("#guess-start").attr("disabled", false);
            $("#guess-start").text(ex);
            return;
        }
        let guessStat = new GuessStat(guessType, guessdata, questionCount);

        openGuessPanel(guessStat);
    });
}

function closeGuessPanel() {
    $("#guessOverlay").fadeOut(200);
    $("#guessPanel").fadeOut(200);
}

function startScrpit() {
    addCss();
    $("body").append("<div class='guessOverlay' id='guessOverlay' style='display:none;''></div>");
    $("body").append("<div class='guessPanel' id='guessPanel' style='display:none;'></div>");
    let guessContent = $("<div id='guessContent' style='text-align: center;'>");
    $("#guessPanel").append(
        "<div class='guessCloseBtnDiv' style='display: block;''><button class='guessCloseBtn'>x</button></div>",
        guessContent
    );
    $("#guessOverlay, .guessCloseBtn").click(function () {
        closeGuessPanel();
    });

    let openPanel = $("<div style='position: absolute;right: 40px;padding: 0 10px;cursor: pointer;'>开始猜歌</div>").appendTo($(".profile-info__details"));
    openPanel.click(function () {
        openSettingPanel();
    });
}

// 确保网页加载完成
function check() {
    let $script = $("#guessOverlay");
    let $modegroup = $(".game-mode-link");
    if ($script.length <= 0) {
        if ($modegroup.length > 0) {
            startScrpit();
            // 局部刷新重新加载
            let interval = setInterval(() => {
                // console.log("检查脚本框架");
                if ($("#guessOverlay").length <= 0) {
                    // console.log("检查到页面局部刷新");
                    clearInterval(interval);
                    check();
                }
            }, 5000);
        }
        else setTimeout(function () { check(); }, 2000);
    }

}

$(document).ready(() => {
    check();
});
