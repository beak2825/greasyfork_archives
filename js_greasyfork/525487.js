// ==UserScript==
// @name         Cascade-Scripts
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  a mod for idle.vidski.dev
// @author       Cascade
// @match        https://idle.vidski.dev/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vidski.dev
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.4.min.js
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525487/Cascade-Scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/525487/Cascade-Scripts.meta.js
// ==/UserScript==

(async function() {
    let db = {

    }

    function extractGameData(jsFile) {
        function genericSlice(search, add = 1){
            const startIndex = jsFile.indexOf(search);
            if (startIndex === -1) return null;

            let endIndex = startIndex + add;
            // add enough here and in the for loop and in the return to hit the first { from the = (example: "={1:{id:1,nam..." would add one, since the { is one after the =)
            let bracketCount = 0;
            let inObject = false;

            for (let i = startIndex + add; i < jsFile.length; i++) {
                const char = jsFile[i];
                if (char === '{') bracketCount++;
                if (char === '}') {
                    bracketCount--;
                    if (bracketCount === 0 && inObject) {
                        endIndex = i + add;
                        break;
                    }
                }
                if (char === '{' && !inObject) inObject = true;
            }

            return jsFile.slice(startIndex + 1, endIndex);
        }
        // Extract HD (items) - it starts with "HD={" and goes until we hit the next const/let/var declaration
        function extractHD() {
            return genericSlice('={1:{id:1,name:{de:"Kupfererz",en:"Copper Ore"}', 1);
        }

        // Extract YD (actions) - it starts with "const YD={" and goes until we hit the next const/let/var declaration
        function extractYD() {
            return genericSlice('={1:{id:1,actions:{1:{id:1,skill_id:1,skill_level:1,action_type:"GATHERING",category:null,combat:null,name:{de:"Kupferader",en:"Copper Vein"}', 1);
        }

        // Extract Ti (skills)
        function extractTi() {
            return genericSlice('={1:{id:1,name:"Mining"', 1);
        }

        try {
            // Extract the objects
            const itemsStr = extractHD();
            const actionsStr = extractYD();
            const skillsStr = extractTi();

            if (!itemsStr || !actionsStr || !skillsStr) {
                throw new Error('Failed to extract one or both objects');
            }

            // Parse the objects
            const db = {
                items: Function(`
                "use strict";
                return (${itemsStr});
            `)(),
                actions: Function(`
                "use strict";
                return (${actionsStr});
            `)(),
                skills: Function(`
                "use strict";
                return (${skillsStr});
            `)()
            };

            return db;
        } catch (e) {
            console.error('Extraction/evaluation error:', e);
            return { items: {}, actions: {} };
        }
    }

    fetch('https://idle.vidski.dev', {
        method: 'GET'
    })
        .then(response => response.text())
        .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const appVersion = doc.querySelector('meta[name="app-version"]').getAttribute('content');
        const scriptSrc = doc.querySelector('script[type="module"]').getAttribute('src');
        console.log('App Version:', appVersion);
        console.log('Scriptsrc:', scriptSrc);
        return fetch(`https://idle.vidski.dev/${scriptSrc}`, { method: 'GET' });
    })
        .then(response => response.text())
        .then(jsFile => {
        db = extractGameData(jsFile);
        console.log('game data:', db);
    })
        .catch(error => console.error('Error:', error));

    // database functions
    function getNestedProperty(obj, path) {
        return path.split('.').reduce((o, i) => (o ? o[i] : undefined), obj);
    }
    let dbf = {
        item: function(property1, value) {
            const propertyMap = Object.values(db.items).reduce((map, item) => {
                map[item[property1]] = item;
                return map;
            }, {});
            return propertyMap[value];
        },
        skill: function(property1, value) {
            const propertyMap = Object.values(db.skills).reduce((map, skill) => {
                map[skill[property1]] = skill;
                return map;
            }, {});
            return propertyMap[value];
        },
        action: function(property1, value) {
            for (let skillKey in db.actions) {
                let val = dbf.action_skill(property1, value, skillKey)
                if(val) return val
            }

            return null;  // Return null if no match is found
        },
        action_skill: function(property1, value, skillId) {
            const skill = db.actions[skillId].actions;

            for (let actionKey in skill) {
                const action = skill[actionKey];

                const property1Value = getNestedProperty(action, property1);

                if (property1Value === value) {
                    return action;
                }
            }
        },
    }

    const euler_mascheroni = 0.57721566490153286060651209008240243104215933593992;

    let help = {
        tiers: [1, 10, 25, 40, 55, 70, 85, 100, 115],
        first_greater_than: (arr, num) => arr.find(x => x > num),
        format_time: (seconds) => {
            let h = Math.floor(seconds / 3600);
            let m = Math.floor((seconds % 3600) / 60);
            return (h > 0 ? `${h}h ` : '') + (m > 0 ? `${m}m` : h === 0 ? '0m' : '');
        },
        level_to_xp: (L) => {
            // https://oldschool.runescape.wiki/w/Experience
            // (L^2/8)−9/40L+75((2^(L/7)−2^(1/7))/(2^(1/7)−1))−γ

            return ((L**2 /8) - (9/40*L) + 75*((2**(L/7)-2**(1/7))/(2**(1/7)-1)) - euler_mascheroni);
        },
        round: (v, n=1) => {
            const digits = -Math.floor(Math.log10(n));
            const result = Math.round(v / n) * n;
            const formattedResult = result.toFixed(digits);

            return parseFloat(formattedResult);
        },
        get_quality: (quality_id) => {
            switch (quality_id){
                case 0: return "poor"
                case 1: return "common"
                case 2: return "uncommon"
                case 3: return "rare"
                case 4: return "epic"
                case 5: return "legendary"
                case 6: return "special"
                default: return "unknown"
            }
        }
    }


    let me = {}, me_ready = false

    async function on_get_me(response){
        try {
            const data = await response.json();
            console.log('your data:', data);
            me = data;
            me_ready = true

        } catch (error) {console.error('Error parsing JSON:', error)};
    }

    async function wait_for_me() {
        let response = await fetch('https://api-eu.vidski.dev/api/me/', {
            headers: {
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem('auth-storage')).state.token}`,
            },
        })
        if(response.ok)
            on_get_me(response)
        else
            console.error(response)
    }


    window.cascade = {
        get help() { return help; },
        get db() { return db; },
        get me() { return me; },
        get me_ready() { return me_ready; },
    }

    // actual script below
    await wait_for_me()

    function create_table({ id, items, state = "open", duration = "0s", width = "482.5px", height = "211px" }) {
        const tableEl = $("<table>", { class: "w-full caption-bottom text-sm" })
        .append($("<tbody>", { class: "[&_tr:last-child]:border-0" }));

        items.forEach(item => {
            const tr = $("<tr>", { class: "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted cursor-pointer" });

            item.forEach(prop => {
                const td = $("<td>", { class: "p-4 align-middle [&:has([role=checkbox])]:pr-0" });

                if (Array.isArray(prop)) {
                    td.addClass("flex items-center gap-1")
                        .append($("<img>", { src: prop[0], class: `w-6 ${prop[2] ? `border border-${prop[2]}` : ""}` }))
                        .append(prop[1]);
                } else {
                    td.text(prop);
                }

                tr.append(td);
            });

            tableEl.find("tbody").append(tr);
        });

        return tableEl;
    }

    function create_tab_menu(tabs, callback = undefined) {
        let container = $('<div>', { class: 'flex flex-col mt-4' });
        let buttonContainer = $('<div>', { class: 'flex flex-row space-x-1.5 p-2 justify-evenly' });
        let contentContainer = $('<div>', { class: 'p-4', id: 'main-content' });

        let tabContents = {};
        let tabButtons = {};

        tabs.forEach((tab, index) => {
            let button = $('<button>', {
                class: 'w-full items-center gap-2 p-2 text-center hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-3xl',
                text: tab
            });

            tabButtons[tab] = button

            let contentDiv = $('<div>', {
                id: `tab-${tab}`,
                class: 'hidden',
                text: `Content for ${tab}`
            });

            tabContents[tab] = contentDiv;

            if (index === 0) {
                button.addClass('bg-sidebar-accent text-sidebar-accent-foreground');
                contentContainer.append(contentDiv);
                contentDiv.removeClass('hidden');
            }

            button.on('click', function () {
                $('#main-content').empty().append(tabContents[tab]);
                $('.tab-button').removeClass('bg-sidebar-accent text-sidebar-accent-foreground');
                button.addClass('bg-sidebar-accent text-sidebar-accent-foreground');

                if (callback) callback(tab);
            });

            button.addClass('tab-button');

            buttonContainer.append(button);
        });

        container.append(buttonContainer, contentContainer);

        return { container: container, tab_contents: tabContents, tab_buttons: tabButtons};
    }

    function recalculate_stats(){
        const i = me.equipment
        let bx = {
            health: 50,
            armor: 0,
            block_chance: 0,
            damage: 0,
            attack_speed: 0,
            mining_speed: 0,
            mining_quality: 0,
            fishing_speed: 0,
            fishing_quality: 0,
            smithing_speed: 0,
            smithing_quality: 0,
            smelting_speed: 0,
            smelting_quality: 0,
            woodcutting_speed: 0,
            woodcutting_quality: 0,
            cooking_speed: 0
        }
        , n = {
            ...bx
        };
        if (i) {
            for (const [,r] of Object.entries(i)) {
                if (!r)
                    continue;
                const l = db.items[r];
                if (!(!l || !l.stats))
                    for (const u in n){
                        //Object.prototype.hasOwnProperty.call(l.stats, u) && console.log("stat", u, l.stats[u])
                        Object.prototype.hasOwnProperty.call(l.stats, u) && (n[u] += l.stats[u])
                    }
            }
            n.damage === 0 && (n.damage = 2);
            n.attack_speed === 0 && (n.attack_speed = 2e3);

            //console.log("calculated stats: ", n)
            return n
        }
    }

    function get_current_action_name(){
        let action_titles = $('div.text-card-foreground').find('div.text-sm:contains("Lv.")').parent().find('div.text-2xl')

        let current_action_name = "unknown";
        if(action_titles.length == 2){
        //combat, first one is your name.
            current_action_name = action_titles.eq(1).text().trim()

        } else {
            //normal skill
            current_action_name = action_titles.text().trim()
        }
        return current_action_name
    }
    function get_calcs(data){
        let current_skill = data.current_skill
        let current_level = data.current_level
        let current_xp = data.current_xp

        let next_level_level = data.next_level_level
        let next_tier_level = data.next_tier_level

        let next_level_xp = data.next_level_xp
        let next_tier_xp = data.next_tier_xp
        let current_action = data.current_action
        let actual_action_duration_seconds = data.actual_action_duration_seconds
        let calculated_stats = data.calculated_stats

        let calculations = []
        let aph = 3600.0 / actual_action_duration_seconds
        //console.log("aph ", aph)
        let xph = aph * current_action.experience

        let next_level_time = (next_level_xp - current_xp) / xph * 3600
        let next_tier_time = (next_tier_xp - current_xp) / xph * 3600

        let action_img = "images/items/" + current_action.image

        if(current_action.action_type == "COMBAT"){
            action_img = "/images/ui/combat/" + current_action.image
        }

        calculations.push([[action_img, "actions/hr"], help.round(aph, 0.1)])

        calculations.push([["/images/ui/skills/" + current_skill.image, "xp/hr"], help.round(xph)])

        calculations.push([`Lv. ${next_level_level}`, `${help.format_time(next_level_time)}`])
        calculations.push([`Lv. ${next_tier_level}`, `${help.format_time(next_tier_time)}`])


        calculations.push(["item", "per hr", "quantity", "rate"])

        let quality_bonus = 1 + (calculated_stats[current_skill.name.toLowerCase() + '_quality'] ?? 0) / 100
        for (let i = 0; i < current_action.rewards.length; i++){
            current_action.rewards[i].drop_rate_with_bonus = current_action.rewards[i].drop_rate * quality_bonus
        }

        // assuming rates flow towards start of array if over 1. (take away rates starting at the end of array until it becomes 1)
        let cum_drop_rate = 0
        for (let i = 0; i < current_action.rewards.length; i++){
            cum_drop_rate += current_action.rewards[i].drop_rate_with_bonus
        }
        //lower drop rates starting at last reward backwards until normal
        if(cum_drop_rate > 1){
            for (let i = current_action.rewards.length - 1; i >= 0; i--){
                let reward = current_action.rewards[i]

                let extra_drop_rate = cum_drop_rate - 1;
                let amount_to_negate = Math.min(extra_drop_rate, 1)

                reward.enrichment_normalized_drop_rate = reward.drop_rate_with_bonus - amount_to_negate
                cum_drop_rate -= amount_to_negate
            }
        }

        for (let i = 0; i < current_action.rewards.length; i++){
            let reward = current_action.rewards[i]

            let item = dbf.item('id', reward.item_id)
            let item_quality = help.get_quality(item.quality)

            let drop_rate = reward.enrichment_normalized_drop_rate ?? reward.drop_rate_with_bonus
            let avg_drop = (reward.quantity + reward.max_quantity) / 2 * drop_rate

            calculations.push([["/images/items/" + item.image, item.name.en, item_quality],
                               help.round(aph * avg_drop, 0.01) + "",
                               reward.quantity === reward.max_quantity ? `${reward.quantity}` : `${reward.quantity} to ${reward.max_quantity}`,
                               drop_rate < 0.01 ? `1 in ${help.round(1 / drop_rate, 1)}` : `${help.round(drop_rate * 100, 0.1)}%`])
        }

        return calculations
    }

    let current_tab = "Calculations"
    const clear_panel = () => $('#cascade_container').remove();
    function update(){

        clear_panel()

        let current_skill_name = $('header.sticky').find('span.text-foreground').find('span.inline-flex.items-center').text().trim()

        let current_action_name = get_current_action_name()
        let current_skill = dbf.skill('name', current_skill_name)
        if(!current_skill || !current_action_name || !current_skill_name) return;

        let current_level = Number($('div.flex.justify-between.p-2.pl-6.pr-6.text-sm').find('span:contains("Lv.")').text().replace("Lv.", "").trim())
        let current_xp_progress_to_next = Number($('div.flex.justify-between.p-2.pl-6.pr-6.text-sm').find('span:contains("XP")').text().replace(",", "").replace("XP", "").trim().split('/')[0])
        let current_xp = help.level_to_xp(current_level) + current_xp_progress_to_next
        let next_level_xp = help.level_to_xp(current_level + 1)
        let next_tier_level = help.first_greater_than(help.tiers, current_level)
        let next_tier_xp = help.level_to_xp(next_tier_level)

        let current_action = dbf.action_skill('name.en', current_action_name, current_skill.id)
        console.log("Update", current_action)

        let action_duration_original_ms
        let actual_action_duration_seconds

        let calculated_stats = recalculate_stats()

        if(current_action.action_type == "COMBAT"){
            console.log("Combat not supported")
            action_duration_original_ms = 3600000
            actual_action_duration_seconds = 3600
        } else {
            action_duration_original_ms = current_action.duration

            // due to how speed works, 50% "speed" results in 2x more actions, and 99% "speed" results in 100x more actions.
            let speed_or_more_accurately_duration_reduction_factor = (1 - ((calculated_stats[current_skill.name.toLowerCase() + '_speed']??0)) / 100.0)
            actual_action_duration_seconds = action_duration_original_ms / 1000 * (speed_or_more_accurately_duration_reduction_factor)
        }

        let calcs = get_calcs({current_skill, current_level, current_xp, next_level_level: current_level + 1, next_tier_level, next_level_xp, next_tier_xp, current_action, actual_action_duration_seconds, calculated_stats})

        let calcs_table = create_table({
            items: calcs,
        });


        let tab_menu = create_tab_menu(["Calculations"], (tab_name) => {
            current_tab = tab_name
        })
        let container = tab_menu.container
        container.attr('id', 'cascade_container');
        tab_menu.tab_contents["Calculations"] = calcs_table

        $('div.col-span-1.order-0.lg\\:order-2').append(container)

        tab_menu.tab_buttons[current_tab].click()


        return current_action
    }

    // check for when action title changes
    let last_action_title
    setInterval(check_action, 100)

    function check_action(){
        const value = get_current_action_name()

        if(value != last_action_title){
            // update when action is changed
            clear_panel()
            setTimeout(update, 55)
        }
        last_action_title = value

    }

    // also update when 5s passes
    setInterval(update, 5000)

})();
