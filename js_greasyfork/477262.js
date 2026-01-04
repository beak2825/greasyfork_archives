// ==UserScript==
// @name         YATA
// @namespace    yata.yt
// @version      0.22.0
// @description  Displays various informations from YATA's API
// @author       Kivou [2000607]
// @match        https://www.torn.com/factions.php*
// @match        https://www.torn.com/preferences.php*
// @match        https://www.torn.com/profiles.php*
// @match        https://www.torn.com/page.php?sid=UserList*
// @icon         https://yata.yt/media/yata-small.png
// @require      https://update.greasyfork.org/scripts/477604/1287854/kiv-lib.js
// @require      https://update.greasyfork.org/scripts/479408/1277647/kib-key.js
// @grant        GM.xmlHttpRequest
// @run-at       document-end
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/477262/YATA.user.js
// @updateURL https://update.greasyfork.org/scripts/477262/YATA.meta.js
// ==/UserScript==

// Copyright © 2024 Kivou [2000607] <n25c4ejn@duck.com>
// This work is free. You can redistribute it and/or modify it under the
// terms of the Do What The Fuck You Want To Public License, Version 2,
// as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.

console.log("YATA script loaded");

// ------------- //
// SETUP API KEY //
// ------------- //
storeKey("yata", "YATA")

// -------------- //
// OC: NNB + rank //
// -------------- //
const display_nnb = (members, player) => {
    const urlParams = new URLSearchParams(player.children[0].children[0].href.split("?")[1]);
    const lvl = player.children[1].innerText.trim();
    if (members.members && members.members.hasOwnProperty(urlParams.get("XID"))) {
        const m = members.members[urlParams.get("XID")];
        if (m.nnb_share > 0) {
            player.children[1].innerHTML = `<span>#<b>${m.crimes_rank}</b> / <b>${m.nnb}</b> / ${lvl}</span>`;
        } else if (m.nnb_share < 0) {
            player.children[1].innerHTML = `<span title="Not on YATA">#<b>${m.crimes_rank}</b> / <b>!</b> / ${lvl}</span>`;
        } else {
            player.children[1].innerHTML = `<span title="Not sharing NNB">#<b>${m.crimes_rank}</b> / <b>?</b> / ${lvl}</span>`;
        }
    } else {
        player.children[1].innerHTML = `<span title="Not found">#<b>?</b> / <b>err</b> / ${lvl}</span>`;
    }
};

waitFor(document, "div#faction-crimes").then(div => {

    const key = localStorage.getItem('yata-key');

    if (!key) { return; }

    const profile_url = new URLSearchParams(window.location.search);
    const target_id = profile_url.get("XID");

    gmGet(`https://yata.yt/api/v1/faction/members/?key=${key}`, 'nnb').then(members => {

        // triggered if directly landing on crimes
        div.querySelectorAll("ul.details-list, ul.plans-list").forEach(ul => {
            ul.querySelectorAll("ul.item").forEach(player => {
                display_nnb(members, player);
            });
        });
        div.querySelectorAll("ul.title li.level").forEach(t => {
            t.innerHTML = 'Rank / NNB / Level';
        });

        // triggered by clicking on crimes tab
        const callback = (mutations, observer) => {
            [...mutations].forEach(mutation => {
                [...mutation.addedNodes].filter(n => n.className && n.className.includes("faction-crimes-wrap")).forEach(node => {
                    node.querySelectorAll("ul.details-list, ul.plans-list").forEach(ul => {
                        const ocs = ul.querySelectorAll("ul.item");
                        console.log(`[yata] displaying NNB for OC: ${ocs.length}`);
                        ocs.forEach(player => {
                            display_nnb(members, player);
                        });
                    });
                    node.querySelectorAll("ul.title li.level").forEach(t => {
                        t.innerHTML = 'Rank / NNB / Level';
                    });
                });
            });
        };
        const observer = new MutationObserver(callback);
        observer.observe(div, { childList: true });


    }).catch(error => {
        console.warn(`[yata] ${error.message}`);
        if (error.message == "Incorrect key") {
            localStorage.removeItem('key');
        }
    });
});


// ---------------------- //
// PROFILE                //
// ---------------------- //

waitFor(document, "a.profile-button-report").then(a => {

    const div = document.getElementById("profileroot");
    const key = localStorage.getItem('yata-key');
    const profile_url = new URLSearchParams(a.href.split("#")[0].split("?")[1]);
    const target_id = profile_url.get("userID");

    if(div == null) { return; } // ignore miniprofile
    if (!target_id) { return; }
    if (!key) { return; }

    gmGet(`https://yata.yt/api/v1/bs/${target_id}/?key=${key}`, `bs-${target_id}`).then(bs => {

        let innerHTML = "";
        innerHTML += `<hr class="page-head-delimiter m-top10 m-bottom10">`;
        innerHTML += `<div>`;
        innerHTML += `<b>[YATA]</b> <b>Battle stats</b> ${floatFormat(bs[target_id].total, 3)}`;
        innerHTML += ` | <b>Build</b> ${bs[target_id].type} (${bs[target_id].skewness}%)`;
        innerHTML += `</div>`;
        innerHTML += `<hr class="page-head-delimiter m-top10 m-bottom10">`;
        innerHTML += `<div class="clear"></div>`;
        const bs_node = document.createElement("div");
        bs_node.innerHTML = innerHTML;
        div.querySelector("div.profile-wrapper").insertAdjacentElement('afterend', bs_node);
        console.log(`[yata] battle stats estimate on profile page: ${target_id}`);

    }).catch(error => {
        console.warn(`[yata] ${error.message}`);
        if (error.message == "Incorrect key") {
            localStorage.removeItem('key');
        }
    });

});

// -------------------------- //
// FACTIONS: Helper functions //
// -------------------------- //
const bse_html = (id, bs) => {

    if (bs == "loading") {
        return `<a style="text-decoration: none; display: inline-block;" href="/loader.php?sid=attack&user2ID=${id}" target="_blank"><span title='Loading' style="color: var(--default-red-color);">...</span></a>`;
    }

    if (!bs.hasOwnProperty("type")) {
        return `<a style="text-decoration: none; display: inline-block;" href="/loader.php?sid=attack&user2ID=${id}" target="_blank"><span title='${bs["message"]}' style="color: var(--default-red-color);">err</span></a>`;
    }

    let color = "var(--default-blue-color)";
    if (bs.type == "Offensive" && bs.skewness > 20) {
        color = "var(--default-red-color)";
    } else if (bs.type == "Defensive" && bs.skewness > 20) {
        color = "var(--default-green-color)";
    }
    const title = `Total stats: ${bs.total.toLocaleString("en-GB")} Score: ${bs.score.toLocaleString("en-GB")} Build: ${bs.type} (${bs.skewness}%) Version: ${bs.version}`;
    return `<a style="text-decoration: none; display: inline-block;" href="/loader.php?sid=attack&user2ID=${id}" target="_blank"><span title="${title}" style="color: ${color};">${floatFormat(bs.total, 3)}</span></a>`;
};

// ---------------------- //
// FACTIONS: Members list //
// ---------------------- //
const members_list_filter = (div) => {
    if (div.tagName != "DIV") { return false; }
    if (div.classList.contains("faction-info-wrap")) { return true; }
    return Boolean(div.querySelector("div.faction-info-wrap"));
};

const members_list_display = (members, key) => {
    console.log(`[yata] battle stats estimate for members list: ${members.length}`);
    [...members].forEach(member => {
        const member_id = getPlayerId(member, "honor");

        gmGet(`https://yata.yt/api/v1/bs/${member_id}/?key=${key}`, `bs-${member_id}`).then(bs => {
            const node = document.createElement("span");
            node.innerHTML = bse_html(member_id, bs[member_id]);
            node.style.width = "4em";
            // member.querySelector("div.member-icons").insertAdjacentElement('afterbegin', node);
            member.querySelector("div.position").insertAdjacentElement('afterbegin', node);
        }).catch((error) => {
            const node = document.createElement("span");
            node.innerHTML = bse_html(member_id, error);
            node.style.width = "4em";
            // member.querySelector("div.member-icons").insertAdjacentElement('afterbegin', node);
            member.querySelector("div.position").insertAdjacentElement('afterbegin', node);
        });
    });
};

// -------------- //
// FACTIONS: Wars //
// -------------- //
const _is_attack_link = (node) => {
    return node.tagName == "A" && node.classList.contains("t-blue") || node.tagName == "SPAN" && node.classList.contains("t-gray-9")
}

const wars_list_filter = (node) => {
    if(_is_attack_link(node)) { return true; }
    if (node.tagName != "DIV") { return false; }
    return node.tagName == "DIV" && node.classList.contains("faction-war");
};

const wars_list_display = (members, type, key) => {
    console.log(`[yata] battle stats estimate for ${type}: ${members.length}`);

    [...members].forEach(member => {
        // STEP 1: get target ID

        let member_id = undefined;

        if (type == "wall") {
            member_id = getPlayerId(member, "username");
        } else {
            member_id = getPlayerId(member, "honor");
        }

        // STEP 2: make call
        gmGet(`https://yata.yt/api/v1/bs/${member_id}/?key=${key}`, `bs-${member_id}`).then(bs => {
            const node = document.createElement("span");
            node.innerHTML = bse_html(member_id, bs[member_id]);

            if (type == "wall") {
                const step = new URLSearchParams(window.location.search).get('step');
                if (step == "your") {
                    // own faction wall: replace attack link
                    node.style.paddingRight = "0.5em";
                    member.children[4].innerHTML = node.outerHTML;
                } else {
                    // waching another faction wall: replace ID
                    member.children[1].innerHTML = node.outerHTML;
                }
            } else if (type == "rank-right") {
                // prepend to level
                node.style.paddingRight = "1em";
                member.children[1].insertAdjacentElement('afterbegin', node);
            } else if (type == "rank-left") {
                // replace link
                member.children[4].children[0].style.display = "None"
                node.style.paddingRight = "0.5";
                member.children[4].insertAdjacentElement('afterbegin', node);
$            } else {
                // replace attack link
                node.style.paddingRight = "0.5em";
                member.children[5].innerHTML = node.outerHTML;
            }
        }).catch((error) => {
            const node = document.createElement("span");
            node.innerHTML = bse_html(member_id, error);

            if (type == "wall") {
                // replace attack link
                node.style.paddingRight = "0.5em";
                member.children[4].innerHTML = node.outerHTML;
            } else if (type == "rank-right") {
                // prepend to level
                node.style.paddingRight = "1em";
                member.children[1].insertAdjacentElement('afterbegin', node);
            } else if (type == "rank-left") {
                // replace link
                node.style.paddingRight = "0.5";
                member.children[4].innerHTML = node.outerHTML;
            } else {
                // replace attack link
                node.style.paddingRight = "0.5em";
                member.children[5].innerHTML = node.outerHTML;
            }
        });
    });
};

const chain_list_filter = (node) => {
    if (node.tagName != "UL") { return false; }
    return node.tagName == "UL" && node.classList.contains("chain-attacks-list");
};

const chain_list_display = (attacks, key) => {
    console.log(`[yata] battle stats estimate for chain: ${attacks.length}`);

    const _f = (e) => { return Boolean(e.querySelector("div.right-player div[class^=userInfoBox]")); };
    [...attacks].filter(_f).forEach(attack => {

        const target = attack.querySelector("div.right-player");
        const target_id = getPlayerId(target, 'icon')
        const respect = attack.querySelector("div.respect");

        gmGet(`https://yata.yt/api/v1/bs/${target_id}/?key=${key}`, `bs-${target_id}`).then(bs => {
            const node = document.createElement("span");
            node.innerHTML = bse_html(target_id, bs[target_id]);
            node.style.float = 'right';
            respect.insertAdjacentElement('beforeend', node);
        }).catch((error) => {
            const node = document.createElement("span");
            node.innerHTML = bse_html(target_id, error);
            node.style.float = 'right';
            respect.insertAdjacentElement('beforeend', node);
        });

    });
};

// ------------------- //
// FACTIONS: observers //
// ------------------- //
const callback_factions = (key) => {
    return (mutations, observer) => {

        const tab = window.location.hash.replace("#/tab=", "");
        if (["territory", "rank", "upgrades", "armoury", "controls"].includes(tab)) { return; }

        [...mutations].forEach(mutation => {

            [...mutation.addedNodes].forEach(node => {

                // members list
                if (members_list_filter(node)) {
                    const members = node.querySelectorAll("li.table-row");
                    if (members.length) { members_list_display(members, key); }
                }

                // chains
                if (chain_list_filter(node)) {
                    chain_list_display(node.childNodes, key);

                    // observe new attacks
                    const callback_chain = (key) => {
                        return (mutations, observer) => {
                            [...mutations].forEach(mutation => {
                                const attacks = [...mutation.addedNodes];
                                chain_list_display(attacks, key);
                            });
                        };
                    };
                    const walls_observer = new MutationObserver(callback_chain(key));
                    walls_observer.observe(node, { childList: true });
                }

                // wars
                if (wars_list_filter(node)) {
                    // force display none for links
                    if(_is_attack_link(node)) { node.style.display = "None"; return true; }

                    // 2 lists for RW, 1 for walls and 1 for raids
                    [...node.querySelectorAll("div.members-cont > ul.members-list")].forEach(faction => {
                        const members = faction.querySelectorAll("li.your, li.enemy");

                        if (tab.includes("rank")) { // RW
                            if (Boolean(members[0].querySelector("div.attack").offsetParent)) {
                                wars_list_display(members, "rank-left", key);
                            } else {
                                wars_list_display(members, "rank-right", key);
                            }
                        } else if (tab.includes("raid")) {  // Raids
                            wars_list_display(members, "raid", key);
                        } else {  // walls
                            wars_list_display(members, "wall", key);

                            // observe wall jumps
                            const callback_walls = (key) => {
                                return (mutations, observer) => {
                                    const _f = (e) => { return e.className.includes("your") || e.className.includes("enemy"); };
                                    [...mutations].forEach(mutation => {
                                        const members = [...mutation.addedNodes].filter(_f);
                                        wars_list_display(members, "wall", key);
                                    });
                                };
                            };
                            const walls_observer = new MutationObserver(callback_walls(key));
                            walls_observer.observe(faction, { childList: true });
                        }
                    });
                }

            });
        });
    };
};

waitFor(document, "div#factions").then(factions => {

    const key = localStorage.getItem('yata-key');
    if (!key) { return; }

    const obs = new MutationObserver(callback_factions(key));
    obs.observe(factions, { childList: true, subtree: true });

});


// ------ //
// SEARCH //
// ------ //

const search_list_display = (players, key) => {
    console.log(`[yata] battle stats estimate for search list: ${players.length}`);

    const _f = (e) => {
        return e.tagName == "LI" &&
            !e.classList.contains("last") &&
            !e.querySelector("[id^=icon15]") &&
            !e.querySelector("[id^=icon70]") &&
            !e.querySelector("[id^=icon77]") &&
            !e.querySelector("[id^=icon71]");
    };
    [...players].filter(_f).forEach(player => {

        const target_id = getPlayerId(player, "username")
        const level = player.querySelector("span.level");
        const node = document.createElement("span");
        node.innerHTML = bse_html(target_id, "loading");
        node.style.float = 'left';
        level.insertAdjacentElement('afterbegin', node);

        gmGet(`https://yata.yt/api/v1/bs/${target_id}/?key=${key}`, `bs-${target_id}`).then(bs => {
            node.innerHTML = bse_html(target_id, bs[target_id]);
        }).catch((error) => {
            node.innerHTML = bse_html(target_id, error);
        });

    });
};

const callback_search = (key) => {
    return (mutations, observer) =>{
        [...mutations].filter(m => m.addedNodes.length).forEach(players => {
            search_list_display(players.addedNodes, key);
        })
    }
}

waitFor(document, "div.userlist-wrapper").then(list => {

    const key = localStorage.getItem('yata-key');
    if (!key) { return; }

    const ul = list.querySelector("ul.user-info-list-wrap");
    if (!ul) { return; }


    const obs = new MutationObserver(callback_search(key));
    obs.observe(ul, { childList: true });

})