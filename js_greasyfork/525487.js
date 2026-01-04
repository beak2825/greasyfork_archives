// ==UserScript==
// @name         Cascade-Scripts
// @namespace    http://tampermonkey.net/
// @version      0.0.2
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
            return genericSlice('={1:{id:1,actions:{1:{id:1,skill_id:1,skill_level:1,name:{de:"Kupferader",en:"Copper Vein"}', 1);
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
        tiers: [1, 15, 30, 55, 65, 75, 85, 100],
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
        help: () => this.help,
        db: () => this.db,
        me: () => this.me,
        me_ready: () => this.me_ready
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

    function get_calcs(data){
        let current_skill = data.current_skill
        let current_level = data.current_level
        let current_xp = data.current_xp

        let next_level_level = data.next_level_level
        let next_tier_level = data.next_tier_level

        let next_level_xp = data.next_level_xp
        let next_tier_xp = data.next_tier_xp
        let current_action = data.current_action
        let actual_action_duration = data.actual_action_duration

        let calculations = []
        let aph = 3600 / actual_action_duration
        let xph = aph * current_action.experience

        let next_level_time = (next_level_xp - current_xp) / xph * 3600
        let next_tier_time = (next_tier_xp - current_xp) / xph * 3600

        calculations.push([["/images/items/" + current_action.image, "actions/hr"], help.round(aph, 0.1)])

        calculations.push([["/images/ui/skills/" + current_skill.image, "xp/hr"], help.round(xph)])

        calculations.push([`Lv. ${next_level_level}`, `${help.format_time(next_level_time)}`])
        calculations.push([`Lv. ${next_tier_level}`, `${help.format_time(next_tier_time)}`])


        calculations.push(["item", "per hr", "quantity", "rate"])

        let quality_bonus = 1 + (me.stats[current_skill.name.toLowerCase() + '_quality'] ?? 0) / 100
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
    function update(){
        $('#cascade_container').remove();

        let current_skill_name = $('header.sticky').find('span.text-foreground').find('span.inline-flex.items-center').text().trim()
        let current_action_name = $('div.text-card-foreground').find('div.text-sm:contains("Lv.")').parent().find('div.text-2xl').text().trim()
        let current_skill = dbf.skill('name', current_skill_name)
        if(!current_skill || !current_action_name || !current_skill_name) return;

        let current_level = Number($('div.flex.justify-between.p-2.pl-6.pr-6.text-sm').find('span:contains("Lv.")').text().replace("Lv.", "").trim())
        let current_xp_progress_to_next = Number($('div.flex.justify-between.p-2.pl-6.pr-6.text-sm').find('span:contains("XP")').text().replace(",", "").replace("XP", "").trim().split('/')[0])
        let current_xp = help.level_to_xp(current_level) + current_xp_progress_to_next
        let next_level_xp = help.level_to_xp(current_level + 1)
        let next_tier_level = help.first_greater_than(help.tiers, current_level)
        let next_tier_xp = help.level_to_xp(next_tier_level)

        let current_action = dbf.action_skill('name.en', current_action_name, current_skill.id)
        let actual_action_duration = $('div.text-2xl.font-semibold').filter(function() {return $(this).text().trim() === "Actions";}).parent().parent().find('table').find('td:contains("' + current_action_name + '")').closest('tr').find('td:eq(2)').text().replace('s', '').trim();

        let calcs = get_calcs({current_skill, current_level, current_xp, next_level_level: current_level + 1, next_tier_level, next_level_xp, next_tier_xp, current_action, actual_action_duration})

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

    // calling update
    
    setInterval(checkURLChange, 100);
    setTimeout(update, 300);

    let interval_id
    let currentWindowURL
    
    // Checks for URI changes and reloads the update pane 
    function checkURLChange() {
        if (currentWindowURL == null || currentWindowURL == "") {
            currentWindowURL = window.location.href;
        } else {
            // User change the page, refresh the update pane
            if (currentWindowURL != window.location.href) {
                update()
                
                if (interval_id != null) {
                    clearInterval(interval_id)
                } 
                interval_id = setInterval(update, 2000)

                currentWindowURL = window.location.href
            }
        }
    }
})();