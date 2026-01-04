// ==UserScript==
// @name         Attack Helpers
// @namespace    http://tampermonkey.net/
// @license      NOLICENSE
// @version      1.7.2
// @description  Makes attacking easier
// @author       Miz
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/470087/Attack%20Helpers.user.js
// @updateURL https://update.greasyfork.org/scripts/470087/Attack%20Helpers.meta.js
// ==/UserScript==

let API_KEY = localStorage["miz.api-key"];

const waitForElement = (selector) => {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
};

const getRequestAsync = (url) => {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "GET",
      url: url,
      onload: function(response) {
        resolve(response.responseText);
      },
      onerror: function(error) {
        reject(error);
      }
    });
  });
}

const waitForElements = (selector, action, container, timeControl) => {
    let targetNodes = (container ?? document).querySelectorAll(selector);

    if (targetNodes && targetNodes.length > 0) {
        targetNodes.forEach(function (node) {
            let alreadyFound = node.getAttribute('data-found') || false;

            if (!alreadyFound) {
                if (!action(node)) {
                    node.setAttribute('data-found', true);
                }
            }
        });
    }
    
    if (!timeControl) {
        timeControl = setInterval(() => {
            waitForElements(selector, action, container, timeControl);
        }, 300);
    }
};

const JSONparse = (str) => {
	try {
		return JSON.parse(str);
	} catch (e) {}
	return null;
}

const format_time = (seconds) => {
    let numhours = Math.floor(seconds / 3600);
    let numminutes = Math.floor((seconds % 3600) / 60);
    let numseconds = Math.round((((seconds % 31536000) % 86400) % 3600) % 60);
    return numseconds < 0 ? null : `${(numhours > 0 ? numhours + ' hr' : '')} ${(numminutes > 0 ? numminutes + ' min' : '')} ${(isNaN(numseconds) ? "&infin;" : numseconds + " sec")}`;
};

const inject_initial_html = () => {

    const cssTxt = `
    :root .dark-mode [class*=modal__] {
        background: none !important;
    }

    span#wall-status {
       margin: 0px 5px;
    }

    span#hosp-status {
       display: block;
       cursor: pointer;
    }

@media screen and (max-width: 1000px) {
	.members-cont .bs {
		display: none;
	}
}

.members-cont .level {
	width: 27px !important;
}

.members-cont .id {
	padding-left: 5px !important;
	width: 28px !important;
}

.members-cont .points {
	width: 42px !important;
}

.finally-bs-stat {
	font-family: monospace;
}

.finally-bs-stat > span {
	display: inline-block;
	width: 55px;
	text-align: right;
}

.faction-names {
	position: relative;
}

.finally-bs-api {
	position: absolute;
	background: var(--main-bg);
	text-align: center;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
}

.finally-bs-api > * {
	margin: 0 5px;
	padding: 5px;
}

.finally-bs-swap {
	position: absolute;
	top: 10px;
	left: 0;
	right: 0;
	margin-left: auto;
	margin-right: auto;
	width: 100px;
	cursor: pointer;
}

.finally-bs-activeIcon {
	display: block !important;
}

.finally-bs-asc {
	border-bottom: 6px solid var(--sort-arrow-border-color);
	border-left: 6px solid transparent;
	border-right: 6px solid transparent;
	border-top: 0 solid transparent;
	height: 0;
	top: -4px;
	width: 0;
}

.finally-bs-desc {
	border-bottom: 0 solid transparent;
	border-left: 6px solid transparent;
	border-right: 6px solid transparent;
	border-top: 6px solid var(--sort-arrow-color);
	height: 0;
	top: 1=]px;
	width: 0;
}

.finally-bs-col {
	text-overflow: clip !important;
}

.raid-members-list .level:not(.bs) {
	width: 16px !important;
}

body:not(.tt-mobile) .members-list.tt-modified .table-header .member {
    width: calc(34% + 85px) !important;
}

.chain-attacks-list .miz-recent-attacks {
    width: 20px !important;
}

.miz-bs-miniprofile {
    float: right;
    color: black;
}

.miz-max-z {
    z-index: 999999 !important;
}

.miz-name {
    text-decoration: none;
}
.miz-attack {
    text-decoration: none;
}
.miz-attack > div {
    display: inline;]
}
  #quickItems .inner-content .item { max-width: 75px; }
  #quickItems .inner-content .item .text { max-height: 12px; overflow: hidden; }
    `;

    GM_addStyle (cssTxt);

    waitForElement(".header-menu .menu-items .menu-item-link a[href='/discord']").then((menuItem) => {
        menuItem.innerText = "Miz";
        menuItem.onclick = () => {
            let input = prompt("Please enter your the same API key you use for TornStats:")
            if (input) {
                localStorage["miz.api-key"] = input;
                API_KEY = input;
                init();
            }
            return false;
        };
    });
};

const show_battlestats = (id, node) => {
    if (!node) return;

    let stats = ["N/A", "N/A", "N/A", "N/A", "N/A"];
    let time = "";
    let bsCache = battlestat_cache.get(id);
    if (bsCache) {
        stats[0] = bsCache.total > 0 ? bsCache.total : -(bsCache.strength + bsCache.defense + bsCache.speed + bsCache.dexterity);
        stats[1] = bsCache.strength;
        stats[2] = bsCache.defense;
        stats[3] = bsCache.speed;
        stats[4] = bsCache.dexterity;

        let difference = (new Date().getTime()/1000) - bsCache.timestamp;
        if (difference > (365*24*60*60)) time = Math.floor(difference / (365*24*60*60)) + " years ago";
        else if (difference > (30*24*60*60)) time = Math.floor(difference / (30*24*60*60)) + " months ago";
        else if (difference > (24*60*60)) time = Math.floor(difference / (24*60*60)) + " days ago";
        else if (difference > (60*60)) time = Math.floor(difference / (60*60)) + " hours ago";
        else if (difference > (60)) time = Math.floor(difference / (60)) + " minutes ago";
        else time = Math.floor(difference) + " seconds ago";
    } else {
        setTimeout(()=> {
            show_battlestats(id, node);
        }, 5000);
    }

    let units = ["K", "M", "B", "T", "Q"]
    for(let i = 0; i < stats.length; i++) {
        let stat = Number.parseInt(stats[i]);
        let unk = false
        if (stat < 0) {
            unk = true;
            stat = -stat;
        }
        if (Number.isNaN(stat) || stat == 0) continue;

        for (let j = 0; j < units.length; j++) {
            stat = stat / 1000;
            if (stat > 1000) continue;

            stat = stat.toFixed(i == 0 ? (stat >= 100 ? 0 : 1) : 2);
            stats[i] = `${stat}${units[j]}`;
            if (unk) {
                stats[i] = stats[i] + "+";
            }
            break;
        }
    }

    node.innerHTML = stats[0];
    node.title = `
	<div class="finally-bs-stat">
		<b>STR</b> <span class="finally-bs-stat">${stats[1]}</span><br/>
		<b>DEF</b> <span class="finally-bs-stat">${stats[2]}</span><br/>
		<b>SPD</b> <span class="finally-bs-stat">${stats[3]}</span><br/>
		<b>DEX</b> <span class="finally-bs-stat">${stats[4]}</span><br/>
        <hr/>
        <b>TOT</b> <span class="finally-bs-stat total">${stats[0]}</span><br/>
		${time}
	</div>`;
}

const enable_attack = () => {

    waitForElements(`.profile-button-attack`, (elm) => {
        elm.classList.remove("disabled");
        elm.setAttribute("href", elm.getAttribute("href").replace("loader2.php?sid=getInAttack&user2ID=", "loader.php?sid=attack&user2ID="));
        elm.onclick = () => { window.location = elm.getAttribute("href"); }

        let miniProfile = elm.closest(".profile-mini-root");
        if (miniProfile) {
            let id = elm.getAttribute("href").replace(/.*?user2ID=(\d+)/i, "$1");
            let target = miniProfile.querySelector(".main-desc");
            let bsNode = document.createElement("span");
            bsNode.className = "miz-bs-miniprofile";
            target.appendChild(bsNode);
            show_battlestats(id, bsNode);
            if (typeof jQuery !== "undefined") {
                jQuery(bsNode).tooltip({ // eslint-disable-line no-undef
                    tooltipClass: "white-tooltip miz-max-z",
                    position: {
                        my: "center bottom-20",
                        at: "center top",
                        using: function(position, feedback) {
                            jQuery(this).css(position); // eslint-disable-line no-undef
                            jQuery("<div>") // eslint-disable-line no-undef
                                .addClass("tooltip-arrow left")
                                .addClass(feedback.vertical)
                                .addClass(feedback.horizontal)
                                .appendTo(jQuery(this).children(":first")); // eslint-disable-line no-undef
                        }
                    }
                });
            }
        }
    });
}

const check_wall_and_hosp = () => {

    let hosp_time = 0;
    let in_hosp = false;
    let on_wall = false;
    let urlParams = new URLSearchParams(window.location.search);
    let userID = urlParams.get('user2ID');

    const update_hosp_time = () => {
        const hospStatusSpan = document.getElementById("hosp-status");
        if (hospStatusSpan && in_hosp) {
            let time = format_time(hosp_time - (new Date().getTime() / 1000));
            if (time == null) {
                hospStatusSpan.innerHTML = "OUT OF HOSPITAL";
                document.title = 'OUT';
                hospStatusSpan.parentElement.parentElement.className = hospStatusSpan.parentElement.parentElement.className.replace(" red", " green");
                hospStatusSpan.parentElement.parentElement.classList.add("miz-refresh");
            } else {
                hospStatusSpan.innerHTML = time;
            }
        }
    };

    const check_status = () => {
        const wallStatusSpan = document.getElementById("wall-status");
        const url = `https://api.torn.com/user/${userID}?selections=basic,icons&key=${API_KEY}`;

        GM.xmlHttpRequest({
            method: 'POST',
            url: url,
            onload: function (response) {
                if (response.status == '200') {
                    const data = JSON.parse(response.responseText)
                    const on_wall_now = data.icons.icon75 ?? data.icons.icon76;

                    if (on_wall_now || on_wall) {
                        let wall_name = on_wall_now.substring(on_wall_now.length - 3);
                        on_wall = true;
                        wallStatusSpan.style.color = "red";
                        wallStatusSpan.innerHTML = `ON WALL - <a style="text-decoration: none; color: red;" href="/city.php#terrName=${wall_name}">${wall_name}</a>`;
                    } else if (on_wall) {
                        wallStatusSpan.style.color = "red";
                        wallStatusSpan.innerHTML = `ON WALL`;
                    } else if (on_wall == false) {
                        wallStatusSpan.style.color = "green";
                        wallStatusSpan.innerHTML = "OFF WALL";
                    }

                    if (data.status.state == "Hospital") {
                        hosp_time = data.status.until;
                        in_hosp = true;
                    } else if (in_hosp) {
                        hosp_time = 0;
                    }
                }
            }
        });
    };

    waitForElement(`#defender`).then((elm) => {
        document.querySelector("h4[class^=title___]").insertAdjacentHTML('afterend', '<span id="wall-status"></span>');
        document.querySelector("div[class^=title___]").insertAdjacentHTML('beforeend', '<span id="hosp-status"></span>');
        document.getElementById("hosp-status").onclick = () => { window.location.reload(); }

        check_status();

        setInterval(function() {
            update_hosp_time();
        }, 500);

        setInterval(function() {
            check_status();
        }, 6000);
    });
};

const check_execute = () => {
    waitForElement(`#attacker .bonus-attachment-execute`).then((elm) => {
        let target_health_percent = parseFloat("0." + elm.getAttribute("title").replace(/.*\s([0-9]*)%.*/gi, "$1"));
        setInterval(function() {
            let health_arr = document.querySelectorAll('[id^=player-health-value]')[1].innerText.split("/").map(function(x) { return x.replace(/,/g,'') });
            if (health_arr[0] / health_arr[1] <= target_health_percent) {
                document.getElementById('weapon_second').style.background = 'red';
            }
        }, 500);
    });
};

const fast_attack = () => {
    let loading = false;
    waitForElement(`#defender`).then((elm) => {
        let buttonDiv = elm.querySelector("div[class^=dialogButtons_]");
        document.querySelectorAll("#weapon_main, #weapon_second, #weapon_melee, #weapon_temp, #weapon_fists, #weapon_boot").forEach((btn) => {
            btn.addEventListener("click", (evt) => {
                console.log("click");
                let attack = buttonDiv.querySelector(".torn-btn");
                if (loading == false && attack && evt.target.className.includes("ammo") == false &&
                   (attack.innerText.toLowerCase().startsWith("start fight") || attack.innerText.toLowerCase().startsWith("join"))) {
                    loading = true;
                    attack.click();
                } else if (loading == false && (elm.querySelector("[class^=dialog_] [class*=' red__']") || elm.querySelector("[class^=dialog_] .miz-refresh"))) {
                    loading = true;
                    window.location.reload();
                }
            });
        });
    });
};

const name_link = () => {

    let urlParams = new URLSearchParams(window.location.search);
    let userID = urlParams.get('user2ID');

    waitForElement(`#defender [class^='userName___']`).then((elm) => {
        let name = elm.innerText;
        elm.innerHTML = `<a style="color: var(--attack-header-text-color); text-decoration: none;" href="/profiles.php?XID=${userID}">${name}</a>&nbsp;<span class="miz-stats"></span>`;
        let bsNode = elm.querySelector(".miz-stats");
        show_battlestats(userID, bsNode);
        bsNode.onclick = () => {
            document.querySelectorAll("div[class*='chat-box_'] p.body3").forEach(node => {
                if (node.innerText == 'Faction') {
                    let facChat = node.parentNode.parentNode.parentNode.querySelector("textarea");
                    if (facChat) {
                        let total = bsNode.innerText;
                        let time = document.getElementById("hosp-status").innerText;
                        facChat.value = `https://www.torn.com/loader.php?sid=attack&user2ID=${userID} - ${total}: ${time}`;
                        facChat.focus();
                    }
                }
            });

        };
    });
};

const clickable_assists = () => {

    const oldFetch = window.fetch;
    let urlParams = new URLSearchParams(window.location.search);
    let userID = urlParams.get('user2ID');
    let attackers = {};

    unsafeWindow.fetch = function (url) {
        if (!/sid=attackData&mode=json&step=poll/.test(url)) {
            return oldFetch.call(oldFetch, ...arguments);
        }

        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            try {
                const response = await oldFetch.call(oldFetch, ...arguments);
                resolve(response.clone());
                const body = await response.json();

                if (body.DB.currentFightStatistics) {
                    attackers = Object.fromEntries(
                        Object.entries(body.DB.currentFightStatistics).map(
                            ([id, value]) => [value.playername, parseInt(id)]
                        )
                    );
                }
            } catch (e) {
                reject(e);
            }
        });
    };

    const add_links = (elm) => {
        let startText = elm.innerText;
        for (const [key, value] of Object.entries(attackers)) {
            if (value != userID) {
                let bsNode = document.createElement("div");
                show_battlestats(value, bsNode);
                let newText = elm.innerText.replace(key, `<a class="miz-name" href="/profiles.php?XID=${value}">${key}</a>&nbsp;<a href="/loader.php?sid=attack&user2ID=${value}" class="miz-attack">${bsNode.outerHTML}</a>`);
                if (newText != startText) {
                    elm.innerHTML = newText;
                    //elm.querySelector("a").after(bsNode);
                    return true;
                }
            }
        }
    };

    waitForElements("#react-root ul[class^='participants'] > li, #react-root ul[aria-describedby='log-header'] > li", (elm) => {
        let name = elm.querySelector(`[class^="playername"]`);
        if (!name) {
            name = elm.querySelector(`span[class^="message"] > span`);
        }

        if (name) {
            return !add_links(name);
        }
    });
};

const add_log_icon_titles = () => {
    waitForElements(`[class^='attacking-events-']`, (elm) => {
        elm.setAttribute("title", elm.getAttribute("class").replace("attacking-events-", ""));
    });
};

const wall_timers = () => {

    const update_timer = (elm) => {
        let _ourCount = elm.querySelector('div.member-count.your-count > div.count').innerText;
        let _defending = elm.querySelector('div.member-count.your-count > div.count > i').classList.contains("shield-icon");
        let _theirCount = elm.querySelector('div.member-count.enemy-count > div.count').innerText;
        let timerArray = elm.querySelector('.timer').innerText.split(':'); // split it at the colons
        let timeLeft = (+timerArray[0]) * 24 * 60 * 60 + (+timerArray[1]) * 60 * 60 + (+timerArray[2]) * 60 + (+timerArray[3]);
        let _score = elm.querySelector('.score').innerText.replace(/,/g, '');
        let _match = _score.match(/(\d+) ?\/ ?(\d+)/);
        let scoreCurrent = _match[2] - _match[1];
        let slotsMax = _match[2] * 2 / 100000;
        let successCurrent = 0;
        let diffCount = Math.abs(_ourCount - _theirCount);
        let durationMin = Math.ceil(scoreCurrent / slotsMax);
        successCurrent = '<span style="font-size: 1.5em;">&infin;</span>';
        if (diffCount != 0) {
            successCurrent = Math.ceil(scoreCurrent / diffCount);
        }
        let textCurrent = "";
        if (_defending) {
            if (durationMin > timeLeft) {
                textCurrent = "WON";
            } else {
                textCurrent = (parseInt(_ourCount) >= parseInt(_theirCount) ? `WIN ${format_time(timeLeft - durationMin)}` : `LOSE ${format_time(successCurrent)}`);
            }
        } else {
            if (durationMin > timeLeft) {
                textCurrent = "LOST";
            } else {
                textCurrent = (parseInt(_ourCount) > parseInt(_theirCount) ? `WIN ${format_time(successCurrent)}` : `LOSE ${format_time(timeLeft - durationMin)}`);
            }
        }
        let textSuccess = "";
        if (durationMin < 0) {
            textSuccess = "<b>FAILED:</b> " + format_time(durationMin);
        } else if (durationMin >= 0) {
            textSuccess = "<b>MIN:</b> " + format_time(durationMin);
        }

        elm.querySelector(".miz-wall-timer").innerHTML = textCurrent;
        elm.querySelector(".miz-wall-timer").setAttribute("title", textSuccess);
    }

    waitForElements(`[class^='status-wrap territoryBox']`, (elm) => {
        elm.querySelector(".timer").insertAdjacentHTML('afterend', '<div class="miz-wall-timer">MWT</div>');
        update_timer(elm);
        setInterval(function() {
            update_timer(elm);
        }, 1000);
    });
}

const battlestat_cache = {

    cache_lifetime: 86400000,
    faction_stamps: {},
    battle_stats: {},

    load_faction: async (id) => {
        if (battlestat_cache.faction_stamps[id] && battlestat_cache.faction_stamps[id] + battlestat_cache.cache_lifetime > Date.now()) {
            return;
        }

        console.log(`Faction ${id} not cached`);

        let response = await getRequestAsync(`https://www.tornstats.com/api/v2/${API_KEY}/spy/faction/${id}`);
        let data = JSONparse(response);
        if (!data || !data.faction) {
            return;
        }

        battlestat_cache.faction_stamps[id] = Date.now();
        Object.keys(data.faction.members).forEach((user_id) => {
            battlestat_cache.battle_stats[user_id] = data.faction.members[user_id].spy
        });

        battlestat_cache.save();
    },

    get: (id) => {
        return battlestat_cache.battle_stats[id];
    },

    init: () => {

        waitForElements("a[href^='/factions.php?step=profile&ID=']", async (facLink) => {
            let factionID = facLink.getAttribute("href").replace(/.*?ID=(\d+).*$/, "$1");
            await battlestat_cache.load_faction(factionID);
        });

        battlestat_cache.battle_stats = JSONparse(localStorage["miz.cache.bs"]) || {};
        battlestat_cache.faction_stamps = JSONparse(localStorage["miz.cache.ts"]) || {};

        if (get_page() == "faction") {
            waitForElement("#top-page-links-list").then((elm) => {
                let clearCacheButton = document.createElement("a");
                clearCacheButton.setAttribute("href", "#");
                clearCacheButton.className = "right t-clear h c-pointer line-h24";
                elm.append(clearCacheButton);
                clearCacheButton.innerHTML = `<span class="icon-wrap svg-icon-wrap"><span class="link-icon-svg"></span></span><span>Clear BS Cache</span>`;
                clearCacheButton.onclick = () => {
                    let facID = window.location.href.replace(/.*?ID=(\d+).*$/, "$1");
                    battlestat_cache.faction_stamps[facID] = null;
                    localStorage["miz.cache.ts"] = JSON.stringify(battlestat_cache.faction_stamps);
                    window.location.reload();
                };
            });
        }
    },

    save: () => {
        localStorage["miz.cache.bs"] = JSON.stringify(battlestat_cache.battle_stats);
        localStorage["miz.cache.ts"] = JSON.stringify(battlestat_cache.faction_stamps);
    }
};

const faction_battlestats = async () => {

    let previousSort = parseInt(localStorage.getItem("miz.faction.sort")) || undefined;

    const sort_stats = (node, sort) => {
        if (!node) return;

        let sortIcon = node.parentNode.querySelector(".bs > [class*='sortIcon']");

        if (sort) node.finallySort = sort;
        else if (node.finallySort == undefined) node.finallySort = 2;
        else if (++node.finallySort > 2) node.finallySort = sortIcon ? 1 : 0;

        if (sortIcon) {
            if (node.finallySort > 0) {
                let active = node.parentNode.querySelector("[class*='activeIcon']:not([class*='finally-bs-activeIcon'])");
                if (active) {
                    let activeClass = active.className.match(/(?:\s|^)(activeIcon(?:[^\s|$]+))(?:\s|$)/)[1];
                    active.classList.remove(activeClass);
                }

                sortIcon.classList.add("finally-bs-activeIcon");
                if (node.finallySort == 1) {
                    sortIcon.classList.remove("finally-bs-desc");
                    sortIcon.classList.add("finally-bs-asc");
                } else {
                    sortIcon.classList.remove("finally-bs-asc");
                    sortIcon.classList.add("finally-bs-desc");
                }
            }
            else {
                sortIcon.classList.remove("finally-bs-activeIcon");
            }
        }

        let nodes = Array.from(node.querySelectorAll(".table-body > .table-row, .your:not(.row-animation-new), .enemy:not(.row-animation-new)"));
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].finallyPos == undefined) {
                nodes[i].finallyPos = i;
            }
        }

        nodes = nodes.sort((a,b) => {
            let posA = a.finallyPos;
            let idA = a.querySelector('a[href*="XID"]').href.replace(/.*?XID=(\d+)/i, "$1");
            let totalA = (battlestat_cache.get(idA) && typeof battlestat_cache.get(idA).total == 'number' && battlestat_cache.get(idA).total) || posA;
            let posB = b.finallyPos;
            let idB = b.querySelector('a[href*="XID"]').href.replace(/.*?XID=(\d+)/i, "$1");
            let totalB = (battlestat_cache.get(idB) && typeof battlestat_cache.get(idB).total == 'number' && battlestat_cache.get(idB).total) || posB;

            let type = node.finallySort;
            switch(node.finallySort) {
                case 1:
                    if (totalA <= 100) return 1;
                    else if (totalB <= 100) return -1;
                    return totalA > totalB ? 1 : -1;
                case 2:
                    return totalB > totalA ? 1 : -1;
                default:
                    return posA > posB ? 1 : -1;
            }
        });

        for (let i = 0; i < nodes.length; i++) {
            nodes[i].parentNode.appendChild(nodes[i]);
        }
    }

    const add_header = (elm) => {
        let titleNode = elm.querySelector(".table-header");

        if (!titleNode || titleNode.querySelector(".bs")) {
            let titleNode = elm.parentNode.querySelector(".title, .c-pointer");
            if (!titleNode) return;
            let lvNode = titleNode.querySelector(".level");
            lvNode.childNodes[0].nodeValue = "Lv";

            if (!titleNode.querySelector(".bs")) {
                let bsNode = lvNode.cloneNode(true);
                bsNode.classList.add("bs");
                bsNode.childNodes[0].nodeValue = "BS";
                titleNode.insertBefore(bsNode, titleNode.querySelector(".user-icons, .points"));
                if (bsNode.childNodes.length > 1) {
                    let orderClass = bsNode.childNodes[1].className.match(/(?:\s|^)((?:asc|desc)(?:[^\s|$]+))(?:\s|$)/)[1];
                    bsNode.childNodes[1].classList.remove(orderClass);
                    for (let i = 0; i < titleNode.children.length; i++) {
                        titleNode.children[i].addEventListener("click", (e) => {
                            setTimeout(() => {
                                let sort = i+1;
                                let sortIcon = e.target.querySelector("[class*='sortIcon']");
                                let desc = sortIcon ? sortIcon.className.indexOf("desc") === -1 : false;
                                sort = desc ? sort : -sort;
                                localStorage.setItem("miz.faction.sort", sort);

                                if (Math.abs(sort) != 3) document.querySelectorAll("[class*='finally-bs-activeIcon']").forEach((e) => e.classList.remove("finally-bs-activeIcon"));
                            }, 100);
                        });
                    }
                    bsNode.addEventListener("click", () => {
                        sort_stats(elm);
                    });

                    let title = titleNode.children[Math.abs(previousSort)-1];
                    let sortIcon = title.querySelector("[class*='sortIcon']");
                    let desc = sortIcon ? sortIcon.className.indexOf("desc") !== -1 : false;
                    let active = sortIcon ? sortIcon.className.indexOf("activeIcon") !== -1 : false;

                    let x = 0;
                    if (Math.abs(previousSort) == 3 && elm.querySelector(".enemy")) x = 0; //funny edge case, dont ask :)
                    else if (!active && previousSort < 0) x = 1;
                    else if (!active) x = 2;
                    else if (previousSort < 0 && !desc) x = 1;
                    else if (previousSort > 0 && desc) x = 1;

                    for(;x>0;x--){
                        title.click();
                    }
                }
            }

        } else {
            let bsNode = document.createElement("li");
            bsNode.className = "table-cell bs torn-divider divider-vertical";
            bsNode.innerHTML = "BS";
            let sortClone = elm.querySelector("[class*='sortIcon']").cloneNode(true);
            sortClone.classList.forEach((n) => {
                if (n.includes("desc") || n.includes("asc")) {
                    sortClone.classList.remove(n);
                }
            });
            bsNode.appendChild(sortClone);
            titleNode.insertBefore(bsNode, titleNode.querySelector(".member-icons"));
            for (let i = 0; i < titleNode.children.length; i++) {
                titleNode.children[i].addEventListener("click", (e) => {
                    let sort = i+1;
                    sort = e.target.querySelector("[class*='asc']") ? -sort : sort;
                    localStorage.setItem("miz.faction.sort", sort);
                });
            }
            bsNode.addEventListener("click", (n) => {
                sort_stats(elm);
            });

            if (previousSort >= 0) { titleNode.children[previousSort-1].click(); titleNode.children[previousSort-1].click(); }
            else if (previousSort < 0) titleNode.children[(-previousSort)-1].click();
        }
    };

    const show_stats = (elm) => {
        if (!elm) return;


        let idElms = elm.querySelectorAll('a[href*="XID"]');
        if (!idElms || idElms.length == 0) return;
        let id =idElms[idElms.length -1].href.replace(/.*?XID=(\d+)/i, "$1");

        let bsNode = elm.querySelector(".bs") || document.createElement("div");
        let statusNode = elm.querySelector(".status");

        show_battlestats(id, bsNode);

        if (bsNode.classList.contains("bs")) {
            return;
        }

        bsNode.className = "table-cell bs level lvl left iconShow finally-bs-col";
        let iconsNode = elm.querySelector(".user-icons, .member-icons, .points, .respect");
        if (iconsNode) {
            iconsNode.parentNode.insertBefore(bsNode, iconsNode);
            bsNode.classList.add("miz-recent-attacks");
        }
        bsNode.addEventListener("click", () => {
            window.open(`loader.php?sid=attack&user2ID=${id}`, "_blank");
        });
        bsNode.addEventListener("dblclick", () => {
            window.open(`loader.php?sid=attack&user2ID=${id}`, "_blank");
        });

        let onlineStatusNodes = elm.querySelectorAll("div[class^='userStatusWrap'], div[class*=' userStatusWrap'], .member.icons li.iconShow");
        if (onlineStatusNodes && onlineStatusNodes.length > 0) {
            onlineStatusNodes[onlineStatusNodes.length - 1].addEventListener("click", () => {
                document.querySelectorAll("div[class*='chat-box_'] p.body3").forEach(node => {
                    if (node.innerText == 'Faction') {
                        let facChat = node.parentNode.parentNode.parentNode.querySelector("textarea");
                        if (facChat) {
                            let total = bsNode.innerText;
                            facChat.value = `https://www.torn.com/loader.php?sid=attack&user2ID=${id} - ${total}`;
                            facChat.focus();
                        }
                    }
                });
            });
        }
    }

    waitForElements(`.members-list, ul.chain-attacks-list.recent-attacks, ul.chain-attacks-list.current-attacks`, (elm) => {
        add_header(elm);
        waitForElements(`.your, .enemy, .table-body > .table-row, :scope > li[class='']`, (e) => { show_stats(e); }, elm);
    });
};


const remove_fac_desc = () => {
    waitForElement(`.faction-title`).then((elm) => {
        elm.previousSibling.remove();
        elm.nextSibling.remove();
        elm.remove();
    });
};

const live_member_filter = () => {

    const filter_rows = () => {
        document.querySelectorAll(".members-list > ul.table-body > li.table-row").forEach(node => {
            filter_row(node);
        });
        document.querySelector("#miz-fac-online").innerText = document.querySelectorAll(".members-list > ul.table-body > li.table-row [class*=userStatusWrap__][id*=online]").length;
        document.querySelector("#miz-fac-idle").innerText = document.querySelectorAll(".members-list > ul.table-body > li.table-row [class*=userStatusWrap__][id*=idle]").length;
    };

    const filter_row = (row) => {

        let states = [];
        if (document.querySelector("#miz-online:checked")) states.push("online");
        if (document.querySelector("#miz-offline:checked")) states.push("offline");
        if (document.querySelector("#miz-idle:checked")) states.push("idle");
        let stateCell = row.querySelector("[class*=userStatusWrap__]");
        let state = (() => {
            if (stateCell.children[0].getAttribute("fill").includes("online")) return "online";
            if (stateCell.children[0].getAttribute("fill").includes("offline")) return "offline";
            if (stateCell.children[0].getAttribute("fill").includes("idle")) return "idle";
            else return null;
        })();

        let wallStates = [];
        if (document.querySelector("#miz-walloff:checked")) wallStates.push("walloff");
        if (document.querySelector("#miz-walldef:checked")) wallStates.push("walldef");
        if (document.querySelector("#miz-wallass:checked")) wallStates.push("wallass");
        let iconCell = row.querySelector(".table-cell.member-icons.icons");
        let wallState = (() => {
            if (!(iconCell.querySelector("[id^=icon75], [id^=icon76]"))) return "walloff";
            if (iconCell.querySelector("[id^=icon75]")) return "walldef";
            if (iconCell.querySelector("[id^=icon76]")) return "wallass";
            else return null;
        })();

        let statuses = [];
        if (document.querySelector("#miz-okay:checked")) statuses.push("okay");
        if (document.querySelector("#miz-hospital:checked")) statuses.push("hospital");
        if (document.querySelector("#miz-jail:checked")) statuses.push("jail");
        if (document.querySelector("#miz-abroad:checked")) statuses.push("abroad");
        if (document.querySelector("#miz-traveling:checked")) statuses.push("traveling");
        let statusCell = row.querySelector(".table-cell.status span");
        let status = (() => {
            if (statusCell.classList.contains("okay")) return "okay";
            if (statusCell.classList.contains("hospital")) return "hospital";
            if (statusCell.classList.contains("jail")) return "jail";
            if (statusCell.classList.contains("abroad")) return "abroad";
            if (statusCell.classList.contains("traveling")) return "traveling";
            else return null;
        })();

        if ((states.length == 0 || states.includes(state)) && (wallStates.length == 0 || wallStates.includes(wallState)) && (statuses.length == 0 || statuses.includes(status))) {
            row.style.display = "flex";
        } else {
            row.style.display = "none";
        }

        if (wallState != "walloff") {
            row.style.backgroundColor = "rgba(229, 76, 25, 0.1)";
        } else if (status == "hospital") {
            row.style.backgroundColor = null;
        }
    };

    const observer = new MutationObserver((m, obs) => {
        let t = m[0].target;
        if (t.classList.contains("table-row") == false) {
            t = t.closest(".table-row");
        }
        filter_row(t);
    });

    const isChecked = (id) => {
        if (localStorage[`filter-${id}`] && localStorage[`filter-${id}`] == "true") return ` checked="checked"`;
        else return "";
    };

    waitForElement(".faction-info-wrap .members-list").then(elm => {
        let filterDiv = document.createElement("div");
        filterDiv.className = "tt-container collapsible rounding compact mt10 tt-filter tt-theme-background";
        filterDiv.innerHTML = `
        <main class="background"><div class="title"><div class="text">Miz Live Filter</div><div class="options"><span id="miz-fac-idle">?</span><span>IDLE: </span><span id="miz-fac-online">?</span><span>ONLINE: </span></div></div>
        <div class="content" style="display: none">
        <div class="activity__section-class"><strong>Activity</strong><div class="tt-checkbox-list-wrapper tt-checkbox-list-column">
             <div class="tt-checkbox-wrapper"><input id="miz-online" type="checkbox"${isChecked("miz-online")}><label for="miz-online">Online</label></div>
            <div class="tt-checkbox-wrapper"><input id="miz-idle" type="checkbox"${isChecked("miz-idle")}><label for="miz-idle">Idle</label></div>
            <div class="tt-checkbox-wrapper"><input id="miz-offline" type="checkbox"${isChecked("miz-offline")}><label for="miz-offline">Offline</label></div>
        </div></div>
        <div class="activity__section-class"><strong>Wall Status</strong><div class="tt-checkbox-list-wrapper tt-checkbox-list-column">
            <div class="tt-checkbox-wrapper"><input id="miz-walloff" type="checkbox"${isChecked("miz-walloff")}><label for="miz-walloff">Off Wall</label></div>
            <div class="tt-checkbox-wrapper"><input id="miz-walldef" type="checkbox"${isChecked("miz-walldef")}><label for="miz-walldef">Defending</label></div>
            <div class="tt-checkbox-wrapper"><input id="miz-wallass" type="checkbox"${isChecked("miz-wallass")}><label for="miz-wallass">Assaulting</label></div>
        </div></div>
        <div class="status__section-class"><strong>Status</strong><div class="tt-checkbox-list-wrapper tt-checkbox-list-column">
            <div class="tt-checkbox-wrapper"><input id="miz-okay" type="checkbox"${isChecked("miz-okay")}><label for="miz-okay">Okay</label></div>
            <div class="tt-checkbox-wrapper"><input id="miz-hospital" type="checkbox"${isChecked("miz-hospital")}><label for="miz-hospital">Hospital</label></div>
            <div class="tt-checkbox-wrapper"><input id="miz-jail" type="checkbox"${isChecked("miz-jail")}><label for="miz-jail">Jail</label></div>
            <div class="tt-checkbox-wrapper"><input id="miz-abroad" type="checkbox"${isChecked("miz-abroad")}><label for="miz-abroad">Abroad</label></div>
            <div class="tt-checkbox-wrapper"><input id="miz-traveling" type="checkbox"${isChecked("miz-traveling")}><label for="miz-traveling">Traveling</label></div></div></div>
        </div>`;
        elm.before(filterDiv);
        elm.querySelectorAll(".table-row").forEach(node => {
            observer.observe(node, { attributes: true, childList: true, subtree: true });
        });
        filterDiv.querySelectorAll("input[type=checkbox]").forEach(node => {
            node.addEventListener("change", (evt) => {
                console.log(evt);
                localStorage[`filter-${evt.target.id}`] = evt.target.checked;
                filter_rows();
            });
        });
        filterDiv.querySelector(".title").onclick = () => {
            if (typeof jQuery !== "undefined") {
                jQuery(filterDiv.querySelector(".content")).toggle(); // eslint-disable-line no-undef
            }
        };
        filter_rows();
    });

};

const get_page = () => {
    if (/https?:\/\/www\.torn\.com\/profiles\.php.*/gi.test(window.location)) {
        return "profile";
    }
    if (/https?:\/\/www\.torn\.com\/loader\.php\?sid=attack&.*/gi.test(window.location)) {
        return "loader";
    }
    if (/https?:\/\/www\.torn\.com\/loader\.php\?sid=attackLog&ID=.*/gi.test(window.location)) {
        return "attack-log";
    }
    if (/https?:\/\/www\.torn\.com\/factions\.php.*/gi.test(window.location)) {
        return "faction";
    }
}

const init = () => {

    battlestat_cache.init();
    enable_attack();

    switch (get_page()) {
        case "profile":
            break;
        case "loader":
            check_wall_and_hosp();
            check_execute();
            name_link();
            clickable_assists();
            fast_attack();
            break;
        case "attack-log":
            add_log_icon_titles();
            break;
        case "faction":
            wall_timers();
            faction_battlestats();
            live_member_filter();
            remove_fac_desc();
            break;
    }
};

(function() {
    'use strict';
    inject_initial_html();
    if (API_KEY) {
        init();
    }
})();