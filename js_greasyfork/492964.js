// ==UserScript==
// @name         AtCoder Editorial Voting
// @namespace    https://atcoder.jp/
// @version      2025-03-30
// @description  AtCoderの解説に投票します。
// @license      MIT
// @author       magurofly
// @match        https://atcoder.jp/contests/*/editorial
// @match        https://atcoder.jp/contests/*/editorial?*
// @match        https://atcoder.jp/contests/*/tasks/*/editorial
// @match        https://atcoder.jp/contests/*/tasks/*/editorial?*
// @match        https://atcoder.jp/contests/*/editorial/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atcoder.jp
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/492964/AtCoder%20Editorial%20Voting.user.js
// @updateURL https://update.greasyfork.org/scripts/492964/AtCoder%20Editorial%20Voting.meta.js
// ==/UserScript==

// AtCoder で定義されている以下の変数を使用します
// - contestScreenName
// - userScreenName
// 以下のサイトにアクセスします
// - https://atcoder.jp/*
// - https://editorial-voting-vercel-serverless-function.vercel.app/*
(function() {
    "use strict";

    // このスクリプトの機能
    // - 解説リンクに投票スコアと投票ボタンを表示する
    // - バックエンドにログインする（ため、一時的に所属欄を書き換える）
    // - 投票する

    let token = GM_getValue("token", null);

    function canonicalizeEditorialLink(url) {
        const prefix = "https://atcoder.jp/jump?url=";
        if (url.startsWith(prefix)) {
            return decodeURIComponent(url.slice(prefix.length));
        }
        return url;
    }

    function encodeFormData(data) {
        return Object.keys(data).map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]) ).join("&");
    }

    async function callApi(name, body) {
        const result = await fetch("https://editorial-voting-vercel-serverless-function.vercel.app/api/" + name, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        }).then(res => res.json());
        if (result.status == "error") {
            if (result.reason == "invalid token") {
                token = null;
            }
            throw "Error: " + result.reason;
        }
        return result;
    }

    async function login() {
        // 所属トークンを得る
        const affiliationTokenData = await callApi("create_affiliation_token", { atcoder_id: unsafeWindow.userScreenName });
        const affiliation_token = affiliationTokenData.affiliation_token;

        // 設定を得る
        const profileSettings = new DOMParser().parseFromString(await fetch("https://atcoder.jp/settings").then(res => res.text()), "text/html");
        const data = {};
        for (const input of profileSettings.querySelector("#main-container form").elements) {
            data[input.name] = input.value;
        }
        const oldAffiliation = data["ui.Affiliation"];

        // 所属に所属トークンを設定する
        data["ui.Affiliation"] = affiliation_token;
        await fetch("https://atcoder.jp/settings", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: encodeFormData(data),
        });

        // 認証する
        const tokenData = await callApi("create_token", { atcoder_id: unsafeWindow.userScreenName, affiliation_token });

        // 所属を元に戻す
        data["ui.Affiliation"] = oldAffiliation;
        await fetch("https://atcoder.jp/settings", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: encodeFormData(data),
        });

        // トークンを保存する
        token = tokenData.token;
        GM_setValue("token", token);
    }

    // 投票する
    async function sendVote(editorial, vote) {
        if (token == null) {
            await login();
        }

        await callApi("vote", {
            token,
            contest: unsafeWindow.contestScreenName,
            editorial,
            vote,
        });
    }

    // レート分布を表示するやつ
    class HistogramComponent {
        constructor() {
            this.element = document.createElement("canvas");
            this.element.width = 320;
            this.element.height = 160;
            this.ctx = this.element.getContext("2d");
            this.dist = [0, 0, 0, 0, 0, 0, 0, 0];
            this.draw();
        }

        setRatingDistribution(dist) {
            if (dist) this.dist = dist;
            this.draw();
        }

        draw() {
            const colors = ["#808080", "#804000", "#008000", "#00C0C0", "#0000FF", "#C0C000", "#FF8000", "#FF0000"];
            const vHalf = this.element.height / 2;
            const vUnit = (vHalf - 16) / Math.max(4, ...this.dist.map(y => Math.abs(y)));
            const hUnit = this.element.width / 8;
            this.ctx.clearRect(0, 0, this.element.width, this.element.height);
            this.ctx.fillStyle = "#333";
            this.ctx.fillRect(0, this.element.height / 2 - 1, hUnit * 8, 2);
            this.ctx.font = "12px serif";
            this.ctx.textAlign = "center";
            for (let i = 0; i < 8; i++) {
                const x = hUnit * i;
                const value = this.dist[i];
                this.ctx.fillStyle = colors[i];
                if (value > 0) {
                    this.ctx.fillRect(x, vHalf - 1 - vUnit * value, hUnit, vUnit * value - 1);
                    this.ctx.fillStyle = "#333";
                    this.ctx.fillText(value.toString(), x + hUnit / 2, vHalf - 4 - vUnit * value);
                } else if (value < 0) {
                    this.ctx.fillRect(x, vHalf + 1 + vUnit * -value, hUnit, vUnit * value - 1);
                    this.ctx.fillStyle = "#333";
                    this.ctx.fillText(value.toString(), x + hUnit / 2, vHalf + 16 + vUnit * -value);
                }
            }
        }
    }

    // 解説リンクにスコアと投票ボタンを表示する
    // ここのデザインは burioden 様に助けていただきました
    class VoteComponent {
        constructor(editorial) {
            this.editorial = canonicalizeEditorialLink(editorial);

            this.score = 0;
            this.vote = 0;
            this.dist = [0, 0, 0, 0, 0, 0, 0, 0];
            this.scoreView = document.createElement("span");
            Object.assign(this.scoreView.style, {
                verticalAlign: "middle",
                display: "inline-block",
                boxSizing: "border-box",
                height: "100%",
                padding: "1px 5px",
                lineHeight: "1.5",
                borderTop: "1px solid #aaa",
                borderBottom: "1px solid #aaa",
                background: "transparent",
                color: "#333",
            });
            this.scoreView.textContent = "0";
    
            this.btnUpVote = document.createElement("button");
            this.btnUpVote.className = "btn btn-xs btn-warning";
            Object.assign(this.btnUpVote.style, {
                border: "1px solid #aaa",
                borderRadius: "0 5px 5px 0",
                height: "100%",
                fontSize: "inherit",
            });
            this.btnUpVote.type = "button";
            this.btnUpVote.textContent = "+";
            this.btnUpVote.onclick = this.setVote.bind(this, 1);
    
            this.btnDownVote = document.createElement("button");
            this.btnDownVote.className = "btn btn-xs btn-info";
            Object.assign(this.btnDownVote.style, {
                border: "1px solid #aaa",
                borderRadius: "5px 0 0 5px",
                height: "100%",
                fontSize: "inherit",
            });
            this.btnDownVote.type = "button";
            this.btnDownVote.textContent = "-";
            this.btnDownVote.onclick = this.setVote.bind(this, -1);

            // キャンバスをつくる
            this.histogram = new HistogramComponent();
            Object.assign(this.histogram.element.style, {
                position: "fixed",
                zIndex: 9999,
                display: "none",
                border: "1px solid #aaa",
                background: "#fff",
                boxShadow: "10px 5px 5px #333",
            });
            this.scoreView.addEventListener("mouseover", () => {
                const bounds = this.scoreView.getBoundingClientRect();
                this.histogram.element.style.left = `${bounds.x + bounds.width * 0.5}px`;
                this.histogram.element.style.top = `${bounds.y + bounds.height}px`;
                this.histogram.element.style.display = "block";
            });
            this.scoreView.addEventListener("mouseout", () => {
                this.histogram.element.style.display = "none";
            });

            // 子供を追加
            this.component = document.createElement("span");
            this.component.appendChild(this.btnDownVote);
            this.component.appendChild(this.scoreView);
            this.component.appendChild(this.btnUpVote);
            this.component.appendChild(this.histogram.element);
            this.component.style.display = "none";

            // ローダーを表示
            this.loader = document.createElement("span");
            this.loader.className = "glyphicon glyphicon-refresh glyphicon-refresh-animate";

            this.element = document.createElement("span");
            this.element.appendChild(this.component);
            this.element.appendChild(this.loader);
            this.element.className = "editorial-voting-root-component";
            Object.assign(this.element.style, {
                position: "relative",
                overflow: "visible",
                display: "inline-block",
                height: "1.5em",
                minWidth: "52px",
                margin: "0 8px",
                fontSize: "12px",
            });
        }

        setLoading(isLoading) {
            if (isLoading) {
                this.component.style.display = "none";
                this.loader.style.display = "inline-block";
            } else {
                this.loader.style.display = "none";
                this.component.style.display = "inline-block";
            }
        }

        setCurrentVote(score, vote, dist) {
            this.vote = vote;
            this.score = score;
            this.dist = dist;
            this.scoreView.textContent = score;
            this.histogram.setRatingDistribution(dist);
            if (vote == 1) {
                this.btnUpVote.classList.add("active");
                this.btnUpVote.onclick = this.setVote.bind(this, 0);
                this.btnDownVote.classList.remove("active");
                this.btnDownVote.onclick = this.setVote.bind(this, -1);
            } else if (vote == -1) {
                this.btnUpVote.classList.remove("active");
                this.btnUpVote.onclick = this.setVote.bind(this, 1);
                this.btnDownVote.classList.add("active");
                this.btnDownVote.onclick = this.setVote.bind(this, 0);
            } else {
                this.btnUpVote.classList.remove("active");
                this.btnUpVote.onclick = this.setVote.bind(this, 1);
                this.btnDownVote.classList.remove("active");
                this.btnDownVote.onclick = this.setVote.bind(this, -1);
            }
        }

        async refreshVote() {
            this.setLoading(true);
            const { score, scores_by_rating, current_vote } = await callApi("status", { token, editorial: this.editorial });
            const vote = current_vote == "up" ? 1 : current_vote == "down" ? -1 : 0;
            const dist = [0, 0, 0, 0, 0, 0, 0, 0];
            for (const [key, value] of Object.entries(scores_by_rating)) {
                const rating = parseInt(key.split("-")[0]);
                if (rating < 2800) {
                    dist[Math.trunc(rating / 400)] += value;
                } else {
                    dist[7] += value;
                }
            }
            this.setCurrentVote(score, vote, dist);
            this.setLoading(false);
        }

        async setVote(vote) {
            this.score += vote - this.vote;
            if (vote == 1) {
                await sendVote(this.editorial, "up");
            } else if (vote == -1) {
                await sendVote(this.editorial, "down");
            } else {
                await sendVote(this.editorial, "none");
            }
            await this.refreshVote();
        }
    }

    // ローディングアニメーションを追加
    const css = new CSSStyleSheet();
    css.insertRule(`
        .glyphicon-refresh-animate {
            animation: glyphicon-refresh-animate-spin 1s infinite linear;
        }
    `);
    css.insertRule(`
        @keyframes glyphicon-refresh-animate-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `);
    css.insertRule(`
        .editorial-voting-root-component .btn.active {
            filter: grayscale(0.5) brightness(0.8);
        }
    `);
    document.adoptedStyleSheets.push(css);

    const votes = [];
    if (/\/editorial$/.test(location.pathname)) {
        for (const link of unsafeWindow.document.querySelectorAll("#main-container a[rel=noopener]")) {
            const vote = new VoteComponent(link.href);
            link.parentElement.insertBefore(vote.element, link);
            votes.push(vote);
        }
    }
    if (/\/editorial\/\d+$/.test(location.pathname)) {
        const vote = new VoteComponent(location.href);
        document.querySelector("#main-container > div.row > div:nth-child(2) > h2").appendChild(vote.element);
        votes.push(vote);
    }

    callApi("statuses", { token, editorials: votes.map(v => v.editorial) }).then(res => {
        for (let i = 0; i < res.results.length; i++) {
            const { score, scores_by_rating, current_vote } = res.results[i];
            const vote = current_vote == "up" ? 1 : current_vote == "down" ? -1 : 0;
            const dist = [0, 0, 0, 0, 0, 0, 0, 0];
            for (const [key, value] of Object.entries(scores_by_rating)) {
                const rating = parseInt(key.split("-")[0]);
                if (rating < 2800) {
                    dist[Math.trunc(rating / 400)] += value;
                } else {
                    dist[7] += value;
                }
            }
            votes[i].setCurrentVote(score, vote, dist);
            votes[i].setLoading(false);
        }
    });
})();