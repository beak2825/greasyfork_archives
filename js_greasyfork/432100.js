// ==UserScript==
// @name         osu-web tools
// @version      1.0.1
// @author       Magnus Cosmos
// @match        https://osu.ppy.sh/*
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js
// @namespace osu
// @description tools for osu-web
// @downloadURL https://update.greasyfork.org/scripts/432100/osu-web%20tools.user.js
// @updateURL https://update.greasyfork.org/scripts/432100/osu-web%20tools.meta.js
// ==/UserScript==```

'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const commarize = (n) => {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
const wait = (delay) => {
    return new Promise((resolve) => setTimeout(resolve, delay));
};

var _a;
class Web {
}
_a = Web;
Web.getCookie = (name) => {
    var _b;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length == 2) {
        return (_b = parts.pop()) === null || _b === void 0 ? void 0 : _b.split(";").shift();
    }
};
Web.loggedIn = () => {
    const utma = _a.getCookie("__utma");
    if (utma == null) {
        return false;
    }
    return true;
};
Web.webRequest = (path, method, auth = false, data, tries = 0, maxTries = 5) => __awaiter(void 0, void 0, void 0, function* () {
    let headers, credentials;
    if (auth) {
        if (!_a.loggedIn()) {
            throw new Error("Not logged in, cannot make authorized web request");
        }
        const xsrf = _a.getCookie("XSRF-TOKEN");
        if (xsrf == null) {
            throw new Error("XSRF Token not found, cannot make authorized web request");
        }
        credentials = "include";
        headers = {
            "x-requested-with": "XMLHttpRequest",
            "x-csrf-token": xsrf,
        };
    }
    const response = yield fetch(`https://osu.ppy.sh/${path}`, {
        method: method,
        credentials: credentials,
        headers: headers,
        body: data,
    });
    if (!response.ok) {
        tries++;
        if (tries > maxTries) {
            throw new Error(`Web request to https://osu.ppy.sh/${path} failed with ${response.status} after ${tries} tries`);
        }
        return wait(500).then(() => _a.webRequest(path, method, auth, data, tries));
    }
    let r;
    try {
        r = yield response.json();
        if (Object.keys(r).length == 1 && Object.keys(r).includes("error")) {
            tries++;
            if (tries > maxTries) {
                throw new Error(`Web request to https://osu.ppy.sh/${path} failed with error (${r["error"]}) after ${tries} tries`);
            }
            return wait(500).then(() => _a.webRequest(path, method, auth, data, tries));
        }
    }
    catch (e) {
        r = yield response.text();
        if (r.length == 0) {
            console.warn("Web request returned empty response");
        }
    }
    return r;
});
Web.getScores = (userId, type, offset, limit, mode, include_fails = false) => __awaiter(void 0, void 0, void 0, function* () {
    const params = `${Web.encodeParam("mode", mode)}&${Web.encodeParam("offset", offset)}&${Web.encodeParam("limit", limit)}&${Web.encodeParam("include_fails", include_fails)}`;
    const response = yield Web.webRequest(`users/${userId}/scores/${type}?${params}`, "GET");
    return response;
});
Web.encodeParams = (params) => {
    const paramList = [];
    for (const key in params) {
        if (params[key] !== undefined) {
            paramList.push(`${key}=${params[key]}`);
        }
    }
    return paramList.join("&");
};
Web.encodeParam = (key, value) => {
    if (value !== undefined) {
        return `${key}=${value}`;
    }
};

const htmlToElement = (html) => {
    const temp = document.createElement("template");
    temp.innerHTML = html;
    return temp.content.firstElementChild;
};
const addIndex = (list) => {
    for (let i = 0; i < list.length; i++) {
        const relRank = list[i].lastElementChild;
        if (relRank === null || relRank === void 0 ? void 0 : relRank.classList.contains("relative-rank")) {
            relRank.innerText = `${i + 1}`;
        }
        list[i].insertAdjacentHTML("beforeend", `<div class="relative-rank">${i + 1}</div>`);
    }
};

var ProfileSections;
(function (ProfileSections) {
    ProfileSections["ME"] = "me";
    ProfileSections["RECENT_ACTIVITY"] = "recent_activity";
    ProfileSections["TOP_RANKS"] = "top_ranks";
    ProfileSections["MEDALS"] = "medals";
    ProfileSections["HISTORICAL"] = "historical";
    ProfileSections["BEATMAPS"] = "beatmaps";
    ProfileSections["KUDOSU"] = "kudosu";
})(ProfileSections || (ProfileSections = {}));
var ScoreType;
(function (ScoreType) {
    ScoreType["BEST"] = "best";
    ScoreType["FIRSTS"] = "firsts";
    ScoreType["RECENT"] = "recent";
})(ScoreType || (ScoreType = {}));
var PlayModes;
(function (PlayModes) {
    PlayModes["OSU"] = "osu";
    PlayModes["TAIKO"] = "taiko";
    PlayModes["FRUITS"] = "fruits";
    PlayModes["MANIA"] = "mania";
})(PlayModes || (PlayModes = {}));
var Mods;
(function (Mods) {
    Mods[Mods["4K"] = "4K"] = "4K";
    Mods[Mods["5K"] = "5K"] = "5K";
    Mods[Mods["6K"] = "6K"] = "6K";
    Mods[Mods["7K"] = "7K"] = "7K";
    Mods[Mods["8K"] = "8K"] = "8K";
    Mods[Mods["9K"] = "9K"] = "9K";
    Mods[Mods["AP"] = "Auto Pilot"] = "AP";
    Mods[Mods["DT"] = "Double Time"] = "DT";
    Mods[Mods["EZ"] = "Easy Mode"] = "EZ";
    Mods[Mods["FI"] = "Fade In"] = "FI";
    Mods[Mods["FL"] = "Flashlight"] = "FL";
    Mods[Mods["HD"] = "Hidden"] = "HD";
    Mods[Mods["HR"] = "Hard Rock"] = "HR";
    Mods[Mods["HT"] = "Half Time"] = "HT";
    Mods[Mods["MR"] = "Mirror"] = "MR";
    Mods[Mods["NC"] = "Nightcore"] = "NC";
    Mods[Mods["NF"] = "No Fail"] = "NF";
    Mods[Mods["NM"] = "No mods"] = "NM";
    Mods[Mods["PF"] = "Perfect"] = "PF";
    Mods[Mods["RX"] = "Relax"] = "RX";
    Mods[Mods["SD"] = "Sudden Death"] = "SD";
    Mods[Mods["SO"] = "Spun Out"] = "SO";
    Mods[Mods["TD"] = "Touch Device"] = "TD";
    Mods[Mods["V2"] = "Score V2"] = "V2";
})(Mods || (Mods = {}));

const loadingIcon = `<div class="la-ball-clip-rotate"></div>`;
const subscriberIcon = `<i class="fas fa-bell"></i>`;
const addUserIcon = `<i class="fas fa-user-plus"></i>`;
const mutualIcon = (`<span class="user-action-button__icon user-action-button__icon--hover-visible">
        <i class="fas fa-user-times"></i>
    </span>
    <span class="user-action-button__icon user-action-button__icon--hover-hidden">
        <i class="fas fa-user-friends"></i>
    </span>`);
const deleteButton = (text) => {
    return (`<label class="btn-osu-big btn-osu-big--account-edit btn-osu-big--danger">
        <div class="btn-osu-big__content">
            <div class="btn-osu-big__left">
                ${text}
            </div>
            <div class="btn-osu-big__icon">
                <i class="fas fa-trash"></i>
            </div>
        </div>
    </label>`);
};
const scoreHit = (amount, title) => {
    return `<span title="${title}">${amount}</span>`;
};
const scoreHits = (score) => {
    switch (score.mode) {
        case "osu":
            return `${scoreHit(score.statistics.count_300, "300")} / ${scoreHit(score.statistics.count_100, "100")} / ${scoreHit(score.statistics.count_50, "50")} / ${scoreHit(score.statistics.count_miss, "MISS")}`;
        case "taiko":
            return `${scoreHit(score.statistics.count_300, "GREAT")} / ${scoreHit(score.statistics.count_100, "GOOD")} / ${scoreHit(score.statistics.count_miss, "MISS")}`;
        case "fruits":
            return `${scoreHit(score.statistics.count_300, "FRUITS")} / ${scoreHit(score.statistics.count_100, "TICKS")} / ${scoreHit(score.statistics.count_katu, "DRP MISS")} / ${scoreHit(score.statistics.count_miss, "MISS")}`;
        case "mania":
            return `${scoreHit(score.statistics.count_geki, "MAX")} / ${scoreHit(score.statistics.count_300, "300")} / ${scoreHit(score.statistics.count_katu, "200")} / ${scoreHit(score.statistics.count_100, "100")} / ${scoreHit(score.statistics.count_50, "50")} / ${scoreHit(score.statistics.count_miss, "MISS")}`;
    }
};
const playDetailExtra = (score) => {
    return (`<div class="play-detail__extra">
            <span title="Score">${commarize(score.score)}</span> / 
            <span ${score.perfect ? `style="color: rgb(183,177,229);" ` : ``}title="Combo">${score.max_combo}x </span>
            { ${scoreHits(score)} }
        </div>`);
};
const modsHtml = (score) => {
    let modsList = [];
    for (const mod of score.mods) {
        modsList.push(`<div class="mod mod--${mod}" title="${Mods[mod]}"></div>`);
    }
    return modsList.join("\n");
};
const failedPlay = (score) => (`<div class="play-detail play-detail--failed play-detail--highlightable play-detail--compact">
        <div class="play-detail__group play-detail__group--top">
            <div class="play-detail__icon play-detail__icon--main">
                <div class="score-rank score-rank--full score-rank--${score.rank}"></div>
            </div>
            <div class="play-detail__detail">
                <a href="https://osu.ppy.sh/beatmaps/${score.beatmap.id}?mode=${score.mode}" class="play-detail__title u-ellipsis-overflow">
                    ${score.beatmapset.title} <small class="play-detail__artist">by ${score.beatmapset.artist}</small>
                </a>
                <div class="play-detail__beatmap-and-time">
                    <span class="play-detail__beatmap">${score.beatmap.version}</span>
                    <span class="play-detail__time">
                        <time class="js-timeago" datetime="${score.created_at}" data-orig-title="${score.created_at}" data-hasqtip="0" aria-describedby="qtip-0">
                            ${
// @ts-ignore: Moment.js imported later
moment(score.created_at).fromNow()}
                        </time>
                    </span>
                </div>
            </div>
            <button class="play-detail__compact-toggle">
                <span class="fas fa-chevron-down"></span>
            </button>
        </div>
        <div class="play-detail__group play-detail__group--bottom">
            <div class="play-detail__score-detail play-detail__score-detail--score">
                <div class="play-detail__icon play-detail__icon--extra">
                    <div class="score-rank score-rank--full score-rank--${score.rank}"></div>
                </div>
                <div class="play-detail__score-detail-top-right">
                    <div class="play-detail__accuracy-and-weighted-pp">
                        <span class="play-detail__accuracy">${(score.accuracy * 100).toFixed(2)}%</span>
                    </div>
                </div>
            </div>
            <div class="play-detail__score-detail play-detail__score-detail--mods">
                ${modsHtml(score)}
            </div>
            <div class="play-detail__pp">
                <span title="Failed plays don't award pp">-</span>
            </div>
            <div class="play-detail__more"></div>
        </div>
    </div>`);

class Account {
    constructor() {
        this.removeAvatarEvent = () => {
            const prompt = confirm("Are you sure you want to remove your avatar?");
            if (prompt !== true) {
                return;
            }
            try {
                Web.webRequest("home/account/avatar", "POST", true).then(() => {
                    const avatarNodes = document.querySelectorAll(".js-current-user-avatar");
                    avatarNodes.forEach(node => {
                        const avatar = node;
                        avatar.style.backgroundImage = `url("https://osu.ppy.sh/images/layout/avatar-guest.png")`;
                    });
                });
            }
            catch (e) {
                console.error(e);
            }
        };
        this.removeAvatar = () => {
            const avatarEntry = document.querySelector(".account-edit-entry--avatar");
            if (avatarEntry == null) {
                console.error("Could not find avatar entry");
                return;
            }
            const removeButton = htmlToElement(deleteButton("remove avatar"));
            if (removeButton == null) {
                console.error("Could not create remove button");
                return;
            }
            removeButton.style.marginLeft = "5px";
            removeButton.addEventListener("click", this.removeAvatarEvent, false);
            avatarEntry.insertBefore(removeButton, avatarEntry.children[2]);
        };
        this.removeAvatar();
    }
}

class PlayDetail {
    constructor(score, container) {
        this.score = score;
        this.container = container;
        this.addDetails = () => {
            var _a, _b;
            (_a = this.container.querySelector(".play-detail__title")) === null || _a === void 0 ? void 0 : _a.insertAdjacentHTML("afterend", playDetailExtra(this.score));
            if (this.score.replay) {
                const more = this.container.querySelector(".fas.fa-ellipsis-v");
                if (more != null) {
                    more.style.color = "#ffcc20";
                }
            }
            const diffName = this.container.querySelector(".play-detail__beatmap");
            diffName.title = `${this.score.beatmap.difficulty_rating}★`;
            const weightedPP = this.container.querySelector(".play-detail__weighted-pp");
            if (weightedPP != null) {
                weightedPP.title = `${(_b = this.score.weight) === null || _b === void 0 ? void 0 : _b.pp.toFixed(3)}`;
            }
        };
        this.addDetails();
    }
}
class PlayDetailList {
    constructor(container, count, type, name, userId, mode) {
        this.container = container;
        this.count = count;
        this.type = type;
        this.name = name;
        this.userId = userId;
        this.mode = mode;
        this.plays = [];
        this.failedPlays = [];
        this.index = 0;
        this.amount = 0;
        this.init = () => __awaiter(this, void 0, void 0, function* () {
            if (this.type == ScoreType.RECENT) {
                yield this.failedScores();
            }
            this.initScores();
            this.observer = new MutationObserver(this.updateScores);
            this.observer.observe(this.container, { childList: true });
        });
        this.initScores = () => {
            const jsonExtras = document.querySelector("#json-extras");
            if ((jsonExtras === null || jsonExtras === void 0 ? void 0 : jsonExtras.textContent) == null) {
                return;
            }
            const parsedJson = JSON.parse(jsonExtras.textContent)[this.name];
            const playsList = this.container.children;
            for (let i = 0; i < playsList.length && i < parsedJson.length; i++) {
                const playDetail = new PlayDetail(parsedJson[i], playsList[i]);
                this.plays.push(playDetail);
                this.index++;
            }
            this.pushFailed();
            addIndex(this.container.children);
        };
        this.updateScores = (mutations) => __awaiter(this, void 0, void 0, function* () {
            if (mutations.some(mutation => {
                if (mutation.addedNodes.length != 1) {
                    return false;
                }
                const node = mutation.addedNodes[0];
                if (node.classList.contains("play-detail--failed")) {
                    return true;
                }
                else {
                    return false;
                }
            })) {
                return;
            }
            console.log(mutations);
            const scores = yield Web.getScores(this.userId, this.type, this.index, mutations.length, this.mode);
            for (let i = 0; i < mutations.length && i < scores.length; i++) {
                if (mutations[i].addedNodes.length == 0) {
                    continue;
                }
                const container = mutations[i].addedNodes[0];
                const playDetail = new PlayDetail(scores[i], container);
                this.plays.push(playDetail);
                this.index++;
            }
            this.pushFailed();
            addIndex(this.container.children);
        });
        this.failedScores = () => __awaiter(this, void 0, void 0, function* () {
            const scores = yield Web.getScores(this.userId, this.type, 0, 100, this.mode, true);
            for (const score of scores) {
                if (!score.passed) {
                    const container = htmlToElement(failedPlay(score));
                    if (container == null) {
                        this.initScores();
                        continue;
                    }
                    const playDetail = new PlayDetail(score, container);
                    this.failedPlays.push(playDetail);
                }
            }
            this.amount = parseInt(this.count.innerText.replace(/,/g, ""));
            this.amount += this.failedPlays.length;
            this.count.innerText = commarize(this.amount);
        });
        this.pushFailed = () => {
            if (this.failedPlays.length == 0) {
                return;
            }
            for (const failedPlay of this.failedPlays) {
                for (const play of this.plays) {
                    if (failedPlay.score.id > play.score.id) {
                        play.container.insertAdjacentElement("beforebegin", failedPlay.container);
                        break;
                    }
                }
            }
            const more = this.container.nextElementSibling;
            if ((more === null || more === void 0 ? void 0 : more.tagName) != "BUTTON") {
                let lastId = Number.MAX_SAFE_INTEGER;
                if (this.plays.length > 0) {
                    lastId = this.plays[this.plays.length - 1].score.id;
                }
                for (const failedPlay of this.failedPlays) {
                    if (failedPlay.score.id < lastId) {
                        this.container.insertAdjacentElement("beforeend", failedPlay.container);
                    }
                }
            }
        };
        this.init();
    }
}
class ButtonToggler {
    constructor(btn, disabledIcon, enabledIcon, className) {
        this.btn = btn;
        this.disabledIcon = disabledIcon;
        this.enabledIcon = enabledIcon;
        this.className = className;
        this.isEnabled = () => {
            return this.btn.classList.contains(this.className);
        };
        this.toggle = () => {
            if (this.isEnabled()) {
                this.btnIcon.innerHTML = this.disabledIcon;
                this.btnText.innerText = commarize(--this.value);
                this.btn.classList.remove(this.className);
            }
            else {
                this.btnIcon.innerHTML = this.enabledIcon;
                this.btnText.innerText = commarize(++this.value);
                this.btn.classList.add(this.className);
            }
        };
        this.btnIcon = btn.firstChild;
        this.btnText = btn.children[1];
        this.value = parseInt(this.btnText.innerText.replace(/,/g, ""));
        this.btn.disabled = false;
        if (this.isEnabled()) {
            this.btnIcon.innerHTML = this.enabledIcon;
        }
    }
}
class FriendToggler extends ButtonToggler {
    constructor(btn, userId) {
        super(btn, addUserIcon, mutualIcon, "user-action-button--mutual");
        this.toggleEvent = () => {
            this.btn.disabled = true;
            const prevHTML = this.btnIcon.innerHTML;
            this.btnIcon.innerHTML = loadingIcon;
            let path, method;
            if (this.isEnabled()) {
                path = `home/friends/${this.userId}`;
                method = "DELETE";
            }
            else {
                path = `home/friends?target=${this.userId}`;
                method = "POST";
            }
            Web.webRequest(path, method, true).then(() => {
                this.toggle();
            }).catch((e) => {
                this.btnIcon.innerHTML = prevHTML;
                console.error(e);
            }).finally(() => {
                this.btn.disabled = false;
            });
        };
        this.destroy = () => {
            this.btn.removeEventListener("click", this.toggleEvent, false);
        };
        this.userId = userId;
        this.btn.addEventListener("click", this.toggleEvent, false);
    }
}
class SubscriberToggler extends ButtonToggler {
    constructor(btn, userId) {
        super(btn, subscriberIcon, subscriberIcon, "user-action-button--friend");
        this.toggleEvent = () => {
            this.btn.disabled = true;
            const prevHTML = this.btnIcon.innerHTML;
            this.btnIcon.innerHTML = loadingIcon;
            let method;
            if (this.isEnabled()) {
                method = "DELETE";
            }
            else {
                method = "POST";
            }
            const data = new FormData();
            data.append("follow[notifiable_id]", this.userId.toString());
            data.append("follow[notifiable_type]", "user");
            data.append("follow[subtype]", "mapping");
            Web.webRequest("home/follows", method, true, data).then(() => {
                this.toggle();
            }).catch((e) => {
                this.btnIcon.innerHTML = prevHTML;
                console.error(e);
            }).finally(() => {
                this.btn.disabled = false;
            });
        };
        this.destroy = () => {
            this.btn.removeEventListener("click", this.toggleEvent, false);
        };
        this.userId = userId;
        this.btn.addEventListener("click", this.toggleEvent, false);
    }
}
class Users {
    constructor() {
        this.btnTogglers = [];
        this.buttons = [
            {
                title: "followers",
                toggler: FriendToggler,
            },
            {
                title: "mapping subscribers",
                toggler: SubscriberToggler,
            },
        ];
        this.scoreTypes = [
            {
                type: ScoreType.BEST,
                title: "Best Performance",
                name: "scoresBest",
            },
            {
                type: ScoreType.FIRSTS,
                title: "First Place Ranks",
                name: "scoresFirsts",
            },
            {
                type: ScoreType.RECENT,
                title: "Recent Plays (24h)",
                name: "scoresRecent",
            },
        ];
        this.getUser = () => {
            const jsonUser = document.querySelector("#json-user");
            if ((jsonUser === null || jsonUser === void 0 ? void 0 : jsonUser.textContent) != null) {
                return JSON.parse(jsonUser.textContent);
            }
            else {
                console.error("User not found");
            }
        };
        this.getMode = () => {
            var _a;
            const regex = /\/users\/\d+\/([a-z]+)/g;
            const result = regex.exec(window.location.pathname);
            if (result == null) {
                return (_a = this.user) === null || _a === void 0 ? void 0 : _a.playmode;
            }
            return result[1];
        };
        this.enableButtons = () => {
            if (!Web.loggedIn() || this.user == null) {
                return;
            }
            for (const button of this.buttons) {
                const followerDiv = document.querySelector(`div[title="${button.title}"]`);
                if (followerDiv == null) {
                    console.error(`Could not find ${button.title} button`);
                    continue;
                }
                const btn = followerDiv.firstChild;
                this.btnTogglers.push(new button.toggler(btn, this.user.id));
            }
        };
        this.setUpScores = () => {
            document.querySelectorAll("h3.title.title--page-extra-small").forEach(rank => {
                var _a, _b;
                const title = (_a = rank.firstChild) === null || _a === void 0 ? void 0 : _a.textContent;
                if (title == null || this.user == undefined) {
                    return;
                }
                for (const type of this.scoreTypes) {
                    if (type.title == title) {
                        const container = (_b = rank.parentElement) === null || _b === void 0 ? void 0 : _b.querySelector(".play-detail-list");
                        const count = rank.querySelector(".title__count");
                        if (container == null || this.mode == null || count == null) {
                            return;
                        }
                        new PlayDetailList(container, count, type.type, type.name, this.user.id, this.mode);
                        return;
                    }
                }
            });
        };
        this.disableDragDrop = () => {
            const dragDrops = document.querySelectorAll(".page-extra-dragdrop");
            dragDrops.forEach(dragDrop => {
                dragDrop.style.display = "none";
            });
        };
        this.destroy = () => {
            for (const toggler of this.btnTogglers) {
                toggler.destroy();
            }
        };
        this.user = this.getUser();
        if (this.user == null) {
            return;
        }
        this.mode = this.getMode();
        this.enableButtons();
        this.disableDragDrop();
        this.setUpScores();
    }
}

const FRank = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIzLjAuMywgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAzMiAxNiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzIgMTY7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojQjlCOUI5O30KCS5zdDF7ZmlsbDojRkY1QTVBO2ZpbHRlcjp1cmwoI0Fkb2JlX09wYWNpdHlNYXNrRmlsdGVyKTt9Cgkuc3Qye21hc2s6dXJsKCNtYXNrMF8xXyk7fQoJLnN0M3tmaWxsOiNDNEM0QzQ7fQoJLnN0NHtmaWxsOiNBRkFGQUY7fQoJLnN0NXtmaWxsOiNBNEE0QTQ7fQoJLnN0NntmaWxsOiMzMzMzMzM7fQo8L3N0eWxlPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNOCwwaDE2YzQuNCwwLDgsMy42LDgsOGwwLDBjMCw0LjQtMy42LDgtOCw4SDhjLTQuNCwwLTgtMy42LTgtOGwwLDBDMCwzLjYsMy42LDAsOCwweiIvPgo8ZGVmcz4KCTxmaWx0ZXIgaWQ9IkFkb2JlX09wYWNpdHlNYXNrRmlsdGVyIiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiIHg9Ii0xLjMiIHk9Ii05IiB3aWR0aD0iMzUuMyIgaGVpZ2h0PSIzMCI+CgkJPGZlQ29sb3JNYXRyaXggIHR5cGU9Im1hdHJpeCIgdmFsdWVzPSIxIDAgMCAwIDAgIDAgMSAwIDAgMCAgMCAwIDEgMCAwICAwIDAgMCAxIDAiLz4KCTwvZmlsdGVyPgo8L2RlZnM+CjxtYXNrIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHg9Ii0xLjMiIHk9Ii05IiB3aWR0aD0iMzUuMyIgaGVpZ2h0PSIzMCIgaWQ9Im1hc2swXzFfIj4KCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik04LDBoMTZjNC40LDAsOCwzLjYsOCw4bDAsMGMwLDQuNC0zLjYsOC04LDhIOGMtNC40LDAtOC0zLjYtOC04bDAsMEMwLDMuNiwzLjYsMCw4LDB6Ii8+CjwvbWFzaz4KPGcgY2xhc3M9InN0MiI+Cgk8cGF0aCBjbGFzcz0ic3QzIiBkPSJNMTYtOWwxNy4zLDMwSC0xLjNMMTYtOXoiLz4KCTxwYXRoIGNsYXNzPSJzdDQiIGQ9Ik0yNy41LDNMMzQsMTQuMkgyMUwyNy41LDN6Ii8+Cgk8cGF0aCBjbGFzcz0ic3Q1IiBkPSJNNy41LTJsMy45LDYuOEgzLjZMNy41LTJ6Ii8+Cgk8cGF0aCBjbGFzcz0ic3Q1IiBkPSJNOS41LDEzbDMuOSw2LjhINS42TDkuNSwxM3oiLz4KPC9nPgo8Zz4KCTxwb2x5Z29uIGNsYXNzPSJzdDYiIHBvaW50cz0iMTEsMy45IDIxLjMsMy45IDIxLjMsNS4yIDEyLjUsNS4yIDEyLjUsNy41IDIwLjgsNy41IDIwLjgsOC44IDEyLjUsOC44IDEyLjUsMTIuMyAxMSwxMi4zIAkiLz4KPC9nPgo8L3N2Zz4K";
GM_addStyle(`
.play-detail {
    position: relative;
}
.relative-rank {
    position: absolute;
    height: 100%;
    width: 50px;
    margin-left: -50px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    opacity: 0;
}
.play-detail:hover .relative-rank {
    opacity: 1;
}
.play-detail__extra {
    font-weight: 700;
}
.score-rank--F {
    background-image: url("${FRank}");
}
.play-detail__weighted-pp {
    min-width: auto !important;
    margin-right: 10px;
}
.tooltip-default, .qtip--achievement, .line-chart__hover-info-box, .qtip--user-card {
    filter: drop-shadow(0px 0px 5px rgba(0,0,0,0.2));
    -webkit-filter: drop-shadow(0px 0px 5px rgba(0,0,0,0.2));
}
`);

class OsuWebTools {
    constructor() {
        var _a;
        this.routes = [
            {
                paths: ["home", "account", "edit"],
                type: "static",
                activate: () => new Account(),
            },
            {
                paths: ["users"],
                type: "dynamic",
                activate: () => new Users(),
            },
        ];
        this.currentPage = () => {
            for (const route of this.routes) {
                const paths = location.pathname.split("/");
                const match = route.paths.every(val => paths.indexOf(val) >= 0);
                if (match) {
                    return route;
                }
            }
        };
        this.detectPageChange = (mutations) => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        var _a;
                        if (node.nodeName == "BODY") {
                            (_a = this.currentPage()) === null || _a === void 0 ? void 0 : _a.activate();
                            return;
                        }
                    });
                }
            }
        };
        this.destroy = () => {
            this.pageObserver.disconnect();
        };
        const currPage = this.currentPage();
        if ((currPage === null || currPage === void 0 ? void 0 : currPage.type) === "static") {
            currPage.activate();
        }
        else {
            const firstLoad = new MutationObserver(() => {
                var _a;
                (_a = this.currentPage()) === null || _a === void 0 ? void 0 : _a.activate();
                firstLoad.disconnect();
            });
            const layout = (_a = document.querySelector(".osu-layout__section")) === null || _a === void 0 ? void 0 : _a.firstElementChild;
            if (layout != null) {
                firstLoad.observe(layout, { childList: true });
            }
        }
        this.pageObserver = new MutationObserver(this.detectPageChange);
        this.pageObserver.observe(document.documentElement, { childList: true });
    }
}
new OsuWebTools();