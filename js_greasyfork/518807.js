// ==UserScript==
// @name         Better DeadlockTracker.gg
// @namespace    http://tampermonkey.net/
// @version      3
// @description  display player builds on DeadlockTracker.gg
// @author       erxson
// @match        https://deadlocktracker.gg/players*
// @match        https://deadlocktracker.gg/player/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deadlocktracker.gg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518807/Better%20DeadlockTrackergg.user.js
// @updateURL https://update.greasyfork.org/scripts/518807/Better%20DeadlockTrackergg.meta.js
// ==/UserScript==

(async function() {
    var builds = [];

    if (window.location.pathname.startsWith("/player/")) {
        const nicknameDiv = document.querySelector(
            "body > div > div > div:nth-child(3) > div:nth-child(1) > div"
        );
        const playerLink = nicknameDiv.querySelector("a");
        if (playerLink) {
            const steamId = playerLink.getAttribute("href").replace("/player/", "");
            if (!window.location.pathname.includes(`/player/${steamId}/`)) {
                builds = await getBuilds(steamId);
                let buildsHTML = await formatPlayerBuilds();

                const button = document.createElement("a");
                button.textContent = "BUILDS";
                button.href = "#";
                button.style =
                "float:left;font-weight:bold;width:70px;padding:0 10px;text-align:center;";
                button.onclick = async () => {
                    const output_element = document.querySelector("body > div > div > div:nth-child(3) > div.profile_left");
                    output_element.innerHTML = buildsHTML;
                };
                if (builds) {
                    document.querySelector("body > div > div > div:nth-child(3) > div:nth-child(3)").appendChild(button);
                }
            }
        }
    }
    async function getBuilds(steam_id) {
        const builds_url = `https://api.deadlock-api.com/v1/builds?author_id=${steam_id}&limit=100&only_latest=true&sort_by=updated_at&sort_direction=desc`;
        try {
            const response = await fetch(builds_url);
            if (!response.ok) {
                console.error(`Blyat! Status: ${response.status}`);
                return null;
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Blyat:", error.message);
            return null;
        }
    }

    async function getItemDetails(itemId) {
        const item_details_url = "https://assets.deadlock-api.com/v2/items/";
        const cacheKey = `item_details_${itemId}`;

        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
            return JSON.parse(cachedData);
        }

        try {
            const response = await fetch(`${item_details_url}${itemId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            localStorage.setItem(cacheKey, JSON.stringify(data));
            setTimeout(() => localStorage.removeItem(cacheKey), 3600000*48);

            return data;
        } catch (error) {
            console.error(`Ошибка при получении информации о предмете с ID ${itemId}:`, error.message);
            return `Unknown Item (${itemId})`;
        }
    }

    async function getHeroDetails(heroId) {
        const item_details_url = "https://assets.deadlock-api.com/v2/heroes/";
        const cacheKey = `hero_details_${heroId}`;

        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
            return JSON.parse(cachedData);
        }

        try {
            const response = await fetch(`${item_details_url}${heroId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            localStorage.setItem(cacheKey, JSON.stringify(data));
            setTimeout(() => localStorage.removeItem(cacheKey), 3600000*48);

            return data;
        } catch (error) {
            console.error(`Ошибка при получении информации о герое с ID ${heroId}:`, error.message);
            return `Unknown Item (${heroId})`;
        }
    }

    function timeAgo(timestamp) {
        const now = new Date();
        const diffInHours = Math.floor((now - new Date(timestamp * 1000)) / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInDays > 0) {
            return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        } else if (diffInHours > 0) {
            return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        } else {
            return "just now";
        }
    }

    async function formatPlayerBuilds() {
        let buildHTML = '';

        build_for: for (const build of builds) {
            const buildName = build.hero_build.name;
            const buildDescription = build.hero_build.description;
            const hero = await getHeroDetails(build.hero_build.hero_id);
            const categories = build.hero_build.details?.mod_categories || [];

            buildHTML += `
                <div style="margin:5 0px;overflow:auto;2width:870px;border-radius:5px;2background:#23231e;padding:0 5px;width:calc(100% - 12px);padding-bottom:2px;margin-bottom:7px;" class="holder">
                    <a style="float:left;">
                        <img src="/images/heroes/${ build.hero_build.hero_id }.png" style="height:35px;float:left;margin:7 0 5 3px;background:#ffffff11;border-radius:2px;">
                    </a>
                    <div style="float:left;">
                        <div style="overflow:auto;">
                            <a style="float:left;">
                                <h1 style="    color: #ffefd7;margin:0 5px;overflow:auto;font-size: 13px; font-weight: bold; font-weight: bold; text-transform: uppercase; margin: 0px; padding: 0px; margin: 8 5 0 0px !important; padding: 0 5px;float:left;">${ buildName }</h1>
                            </a>
                            <div style="color:#ffde00;overflow:auto;float:left;font-weight:bold;font-size:11px;background: #ffd7004f; border-radius: 5px; padding: 1 4px;margin-left:5px;    margin: 8px 0 0 0px;">
                                <img src="/images/star.png" style="width:10px;margin:2px;float:left;">${ build.num_favorites }
                            </div>
                            <div style="font-size:11px;margin-left:5px;color: #a0afc1;float:left;text-transform: uppercase;font-weight: bold;padding-top:9px;">${ timeAgo(build.hero_build.last_updated_timestamp) }</div>
                        </div>
                        <a style="text-transform:uppercase;margin:0 5px;color:#a0afc1;">Build ID: ${ build.hero_build.hero_build_id }</a>
                    </div>
            `;

            buildHTML += `
                    <div style="margin-bottom:5px;border:1px solid #ffffff22;margin:5 2.5px;padding:5px;width:calc(100% - 17px);" class="inner">
            `;
            for (const category of categories) {
                buildHTML += `
                        <div style="padding:3 0px;">
                            <div style="color: #a0afc1;margin-left:0px;line-height:18px;">
                                <h2 style="font-weight:bold;text-transform:uppercase;font-size:11px;margin-left:5px;font-weight:bold;color: #d7e9ff;font-weight:bold;text-transform:uppercase;font-size:11px;margin-left:5px;font-weight:bold;color: #d7e9ff;margin: 0px !important;">${category.name}</h2>

                                ${ category.description ? `
                                <div style="color:#aaa;margin-left:5px;text-indent: 0px">
                                    <div style="float:left;width:5px;height:5px;margin:6 5px;background:#ffefd7;"></div>` +
                                    (category.description.split(". ").filter(item => item !== "").length > 1
                                        ? category.description.split(". ").join('<br><div style="float:left;width:5px;height:5px;margin:5px;background:#ffefd7;"></div>')
                                        : category.description) +
                                '</div>' : '' }
                            </div>
                            <div style="overflow:auto;margin-left:10px;">
                `;
                const mods = category.mods || [];
                for (const mod of mods) {
                    const item = await getItemDetails(mod.ability_id);
                    let item_color = "";
                    switch (item.item_slot_type) {
                        case "weapon":
                            item_color = "#dc8e21";
                            break;
                        case "vitality":
                            item_color = "#c7ee8e";
                            break;
                        case "spirit":
                            item_color = "#c288f0";
                            break;
                        default:
                            item_color = "#fff";
                    }
                    buildHTML += `
                                <a href="/items/${ item.name.toLowerCase().replace(" ", "-") }" title="${ item.name }">
                                    <div style="display:inline-block;border-radius:5px;border-radius:5 5 0 0px;background:#00000033;background:${ item_color };2width:180px;text-align:center;float:left;margin:4px;position:relative;2height:40px;" class="tooltip-container">
                                        <img src="${ item.image }" style="width:30px;margin:0 4 0 15px;2margin:auto;filter: invert(1);float:left;">
                                        <div style="position:absolute;top:-2px;left:3px;width:100%;text-align:left;color:#fff;font-size:15px;font-weight:bold;" class="shad">I</div>
                                        <div style="position:absolute;bottom:0px;left:3px;width:100%;text-align:left;color:#fff;font-size:8px;color:gold;font-weight:bold;line-height:10px;" class="shad">${ item.cost }</div>
                                    </div>
                                </a>
                `;
                }
                buildHTML += `
                            </div>
                        </div>
                `;
            }
            buildHTML += `
                    </div>
            `;

            // Да, может быть чучут говнокод, НО
            // я писал это всё без света и интернета,
            // руководствуясь учебником по информатике 7 класс
            // Вопросы?
            const abilityOrder = build.hero_build.details?.ability_order?.currency_changes || [];
            if (abilityOrder.length == 16) {
                let table_sig_map = {};
                table_sig_map[hero.items.signature1] = [];
                table_sig_map[hero.items.signature2] = [];
                table_sig_map[hero.items.signature3] = [];
                table_sig_map[hero.items.signature4] = [];

                buildHTML += `
                    <h2>${hero.name} Skill build</h2>
                    <div style="margin-bottom:5px;border:1px solid #ffffff22;margin:5 2.5px;padding:5px;width:calc(100% - 17px);" class="inner">
                        <div style="width:850px;">`;

                for (let i = 0; i < abilityOrder.length; i++) {
                    const change = abilityOrder[i];
                    const change_ability_details = await getItemDetails(change.ability_id);
                    const { class_name } = change_ability_details;
                    if (!table_sig_map[class_name]) {
                        console.log("Че-то взорвалось из-за нового героя?");
                        console.log(build);
                        buildHTML += `</div></div>`;
                        continue build_for;
                    }
                    table_sig_map[class_name][0] = { image: change_ability_details.image };

                    for (const sig of Object.keys(table_sig_map)) {
                        if (class_name == sig) {
                            change_ability_details.currency_type = change.currency_type;
                            change_ability_details.delta = change.delta;
                            table_sig_map[class_name][i + 1] = change_ability_details;
                        }
                    }
                }

                for (const key of Object.keys(table_sig_map)) {
                    const sig_changes = table_sig_map[key];

                    buildHTML += `
                            <div style="height:50px;overflow:auto;">
                                <div style="background: #c6c2c7; margin: 3px; overflow: auto; float: left; border-radius: 5px; margin: 5px;width:40px;">
                                    <img src="${ sig_changes[0].image }" style="filter: invert(1);width:40px;">
                                </div>
                    `;
                    for (let i = 1; i < 17; i++) {
                        if (!sig_changes[i]) {
                            buildHTML += `
                                <div style="float:left;width:46px;background:#ffffff22;margin:4 2px;border-radius:5px;height:40px;text-align:center;"></div>
                            `;
                            continue;
                        }
                        if (sig_changes[i].currency_type == 2) {
                            buildHTML += `
                                <div style="float:left;width:46px;background:#ffffff22;margin:4 2px;border-radius:5px;height:40px;text-align:center;">
                                    <img src="/images/learn.png" style="margin:10 5px;">
                                </div>
                            `;
                            continue;
                        }
                        buildHTML += `
                                <div style="float:left;width:46px;background:#ffffff22;margin:4 2px;border-radius:5px;height:40px;text-align:center;">
                                    <div style="font-weight:bold;font-size:15px;margin:10 5px;line-height:20px;">
                                        <img src="/images/learn.png" style="filter: grayscale(1);    float: left;">${-sig_changes[i].delta}
                                    </div>
                                </div>
                        `;
                    }
                    buildHTML += `
                            </div>
                    `;
                }
                buildHTML += `
                        </div>
                    </div>
                `;
            }

            if (buildDescription) {
                buildHTML += `
                        <h2>Build Description</h2>
                        <div style="margin-bottom:5px;border:1px solid #ffffff22;margin:5 2.5px;padding:5px;width:calc(100% - 17px);" class="inner">
                            ${buildDescription}
                        </div>
                `;
            }

            buildHTML += `
                    </div>
                </div>
            `;
        }

        return buildHTML;
    }
})();