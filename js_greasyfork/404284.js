// ==UserScript==
// @name         Lone's Travel Script
// @namespace    http://lonerider543.pythonanywhere.com/
// @version      1.3
// @description  Display information while travelling.
// @author       lonerider543, TinyGodzilla
// @match        https://www.torn.com/index.php*
// @match        https://www.torn.com/preferences.php*
// @resource     ts_css_file http://lonerider543.pythonanywhere.com/style/ts-torn.css
// @connect      lonerider543.pythonanywhere.com
// @connect      api.torn.com
// @connect      yata.alwaysdata.net
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/404284/Lone%27s%20Travel%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/404284/Lone%27s%20Travel%20Script.meta.js
// ==/UserScript==

var api_key = localStorage.getItem('ts-apikey');
const targetNode = document.getElementById('mainContainer');
const config = {attributes: true, childList: true, subtree: true};

const numbers = {
    '1': 'one',
    '2': 'two',
    '3': 'three',
    '4': 'four',
    '5': 'five',
    '6': 'six',
    '7': 'seven',
    '8': 'eight',
    '9': 'nine',
    '10': 'ten',
    '11': 'eleven',
    '12': 'twelve',
    '13': 'thirteen',
    '14': 'fourteen',
    '15': 'fifteen',
    '16': 'sixteen',
    '17': 'seventeen',
    '18': 'eighteen',
    '19': 'nineteen',
    '20': 'twenty',
    '21': 'twenty-one',
    '22': 'twenty-two',
    '23': 'twenty-tree',
    '24': 'twenty-four',
    '25': 'twenty-five',
    '26': 'twenty-six',
    '27': 'twenty-seven',
    '28': 'twenty-eight',
    '29': 'twenty-nine',
    '30': 'thirty',
    '31': 'thirty-one',
    '32': 'thirty-two',
    '33': 'thirty-three',
    '34': 'thirty-four',
    '35': 'thirty-five',
    '36': 'thirty-six',
    '37': 'thirty-seven',
    '38': 'thirty-eight',
    '39': 'thirty-nine',
    '40': 'fourty',
    '41': 'fourty-one',
    '42': 'fourty-two',
    '43': 'fourty-three',
    '44': 'fourty-four',
    '45': 'fourty-five',
    '46': 'fourty-six',
    '47': 'fourty-seven',
    '48': 'fourty-eight',
    '49': 'fourty-nine',
    '50': 'fifty',
    '51': 'fifty-one',
    '52': 'fifty-two',
    '53': 'fifty-three',
    '54': 'fifty-four',
    '55': 'fifty-five',
    '56': 'fifty-six',
    '57': 'fifty-seven',
    '58': 'fifty-eight',
    '59': 'fifty-nine',
    '60': 'sixty',
    '61': 'sixty-one',
    '62': 'sixty-two',
    '63': 'sixty-three',
    '64': 'sixty-four',
    '65': 'sixty-five',
    '66': 'sixty-six',
    '67': 'sixty-seven',
    '68': 'sixty-eight',
    '69': 'sixty-nine',
    '70': 'seventy',
    '71': 'seventy-one',
    '72': 'seventy-two',
    '73': 'seventy-three',
    '74': 'seventy-four',
    '75': 'seventy-five',
    '76': 'seventy-six',
    '77': 'seventy-seven',
    '78': 'seventy-eight',
    '79': 'seventy-nine',
    '80': 'eighty'
}

const ranks = [
    'Absolute beginner',
    'Beginner',
    'Inexperienced',
    'Rookie',
    'Novice',
    'Below Average',
    'Average',
    'Reasonable',
    'Above Average',
    'Competent',
    'Highly competent',
    'Veteran',
    'Distinguished',
    'Highly distinguished',
    'Professional',
    'Star',
    'Master',
    'Outstanding',
    'Celebrity',
    'Supreme',
    'Idolised',
    'Champion',
    'Heroic',
    'Legendary',
    'Elite',
    'Invincible'
]

const bars = [
    'life',
    'happy',
    'nerve',
    'energy'
]

const properties = {
    'Shack': 'shack',
    'Trailer': 'trailer',
    'Apartment': 'apartment',
    'Semi-Detached House': 'semi_detached',
    'Detached House': 'detached',
    'Beach House': 'beach_house',
    'Chalet': 'chalet',
    'Villa': 'villa',
    'Penthouse': 'penthouse',
    'Mansion': 'mansion',
    'Ranch': 'ranch',
    'Palace': 'palace',
    'Castle': 'castle',
    'Private Island': 'private_island',
    'Queen Eleanor': 'queeneleanor',
    'Drakkar Sea Fort': 'drakkar',
    'Eagle Island': 'eagleisland',
    'Royal Penthouse': 'royalpenthouse',
    'Cerium Temple': 'cerium',
    'Trekant Tower': 'trekkant',
    'St. Pauls Abbey': 'stpaulsabbey',
    'Iron Fist Hill': 'ironfisthill',
    'Presidential Bunker': 'nuclearbunker',
    'Maidengrave': 'maidengrave',
    'USS Bloodbath': 'bloodbath',
    'Silo X17': 'silox17'
}

const home_sections_column1 = {
    'general': 'General Information',
    'battlestats': 'Battle Stats',
    'property': 'Property Information'
}

const home_sections_column2 = {
    'perks': 'Personal Perks',
    'faction': 'Faction Information',
    'workstats': 'Working Stats',
    'job': 'Job Information',
    'crimes': 'Criminal Record'
}

var panels = {
    'home': null,
    'items': null,
    'gym': null,
    'properties': null
}

for (var i in panels) {
	panels[i] = $(`div.ts-main-panel.${i}`).detach();
}

var execute = true;

var ts_css = GM_getResourceText('ts_css_file');
GM_addStyle(ts_css)

Number.prototype.format_thousand_seperator = function(n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};

const replaceAll = (string, search, replace) => {
  return string.split(search).join(replace);
}

const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

const apiFetch = (area, selections) => {
    return new Promise( (resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.torn.com/${area}/?selections=${selections}&key=${api_key}`,

            onload: (response) => {
                let api_req = response.responseText;
                let api_obj = JSON.parse(api_req);
                resolve(api_obj);
            },

            onerror: (error) => {
                console.log(error);
                reject('XHR error.');
            }
        });
    });
};

const calculate_merits = (medals, honors, bought, merits) => {
    let total = medals.length + honors.length + bought;
    let current = 0;

    for (var merit in merits) {
        let level = merits[merit];
        let add = (level * (level + 1)) / 2;
        current += add;
    }

    let outstanding = total - current;
    return outstanding;
}

const switch_tab = async (old_tab, new_tab) => {
    if (old_tab) {
        $(`div.ts-main-panel.${old_tab}`).attr('style', 'visibility: hidden; opacity: 0;');
        panels[old_tab] = $(`div.ts-main-panel.${old_tab}`).detach();
    }

  $('div.ts-main-window').append(panels[new_tab]);

  await sleep(10);
  $(`div.ts-main-panel.${new_tab}`).attr('style', 'visibility: visible; opacity: 1;');
}

const render = async (result) => {
    // Get Faction Data
    var faction_result = await apiFetch('faction', '');

    // Get Company Data
    var company_result = await apiFetch('company', '');

    // Get Torn Data
    var torn_result = await apiFetch('torn', 'companies');

    // Build Main Containers
    $('.travel-agency-travelling').after(
        '<div class="travel-script-container"></div>'
        );

    $('.travel-script-container').append(
        `<div class="ts-user-information">
        <h2 class="ts-header">Information</h2>
        <div class="ts-ui-content">
        <ul class="ts-icons"></ul>
        <hr class="ts-delimiter">
        <p class="ts-ui-details"></p>
        <hr class="ts-delimiter">
        </div></div>
        <div class="ts-nav-bar">
        <h2 class="ts-header main">Navigation</h2>
        <ul class="ts-main-tabs"></ul></div>
        <div class="ts-main-window"></div>`
        );


    // Build Icons
    let icons = result.icons;

    for (var icon in icons) {
        let icon_id = icon.substring(4, icon.length);
        let icon_id_name = numbers[icon_id]
        let icon_text = icons[icon]

        $('.ts-icons').append(
            `<li class="ts-icon ${icon_id_name}">
            <div class="ts-tooltip-box">
            <span class="ts-tooltip-arrow"></span>
            <span class="ts-tooltip-arrow-shadow"></span>
            <div class="ts-tooltip-text" id=${icon_id}>
            </div></div></li>`
        );

        let text_list = icon_text.split('-');

        for (var text_index in text_list) {
            let text_item = text_list[text_index];
            if (text_index == 0) {
                $(`.ts-tooltip-text#${icon_id}`).append(
                    `<b>${text_item}</b>`
                )
            } else {
                $(`.ts-tooltip-text#${icon_id}`).append(
                    `<p>${text_item}</p>`
                )
            }
        }

        $("<style>")
        .text(`.ts-icon.${icon_id_name}{background-position: -${(icon_id-1)*18}px 0 !important; display: inline-block}`)
        .appendTo($("body"));
    }

    // Build User Information
    var user_name = result.name;
    var user_level = result.level;
    var user_id = result.player_id;
    var profile_link = `https://www.torn.com/profiles.php?XID=${user_id}`

    var user_money = result.money_onhand;
    var user_points = result.points;

    let honors = result.honors_awarded;
    let medals = result.medals_awarded;
    let bought = result.personalstats.meritsbought;
    let assigned_merits = result.merits;

    let outstanding_merits = calculate_merits(medals, honors, bought, assigned_merits);

    $('.ts-ui-details').after(
        `<span class="ts-ui-details-header">Name:</span><a href="${profile_link}" class="ts-ui-link">${user_name}</a><br>
        <span class="ts-ui-details-header">Money:</span>$${user_money.format_thousand_seperator()}<br>
        <span class="ts-ui-details-header">Level:</span>${user_level}<br>
        <span class="ts-ui-details-header">Points:</span>${user_points.format_thousand_seperator()}<br>
        <span class="ts-ui-details-header">Merits:</span>${outstanding_merits.format_thousand_seperator()}`
    );

    // Build Bars
    for (var bar_index in bars) {
        let bar_item = bars[bar_index];
        let bar_name = capitalize(bar_item);
        let bar_current = result[bar_item].current;
        let bar_max = result[bar_item].maximum;
        let bar_percentage = bar_current / bar_max * 100.0

        $('.ts-delimiter').eq(1).after(
            `<div class="ts-bar"><p class="ts-bar-name">${bar_name}:</p>
            <p class="ts-bar-value">${bar_current}/${bar_max}</p>
            </div>
            <div class="ts-progress">
            <div class="ts-progress bar ${bar_item}" style="width: ${bar_percentage}%">
            </div></div>`
        );
    }

    // Build Navigation
    for (var panel_name in panels) {
        let panel_name_capital = capitalize(panel_name);
        if (panel_name == 'home') {
            $('.ts-main-tabs').append(
                `<li class="ts-tab active" id="${panel_name}"><i class="ts-tab-icon ${panel_name}"></i>${panel_name_capital}</li>`
                );
        } else {
            $('.ts-main-tabs').append(
                `<li class="ts-tab" id="${panel_name}"><i class="ts-tab-icon ${panel_name}"></i>${panel_name_capital}</li>`
                );
        }

        // Build Panels
        $('.ts-main-window').append(
            `<div class="ts-main-panel ${panel_name}"></div>`
            );

        // Build Home
        if (panel_name == 'home') {
            $(`.ts-main-panel.${panel_name}`).append(
                `<div class="ts-home-column">
                <ul class="ts-home-sections">
                </ul></div>
                <div class="ts-home-column">
                <ul class="ts-home-sections">
                </ul></div>`
            );

            let user_name = result.name;

            // Build Column 1
            for (let section in home_sections_column1) {
                let section_name = home_sections_column1[section]
                $('.ts-home-sections').eq(0).append(
                    `<li class="ts-section">
                    <h2 class="ts-header main">${section_name}</h2>
                    <div class="ts-section-content">
                    <ul class="ts-info ${section}">
                    </ul></div></li>`
                )

                // Build General Section
                if (section == 'general') {
                    let user_rank = result.rank;
                    for (var rank in ranks) {
                        if (String(user_rank).startsWith(ranks[rank])) {
                            var rank_only = ranks[rank];
                            break;
                        }
                    }
                    let rank_number = ranks.indexOf(rank_only) + 1;
                    user_rank = `#${rank_number} ${user_rank}`;

                    let life_current = result.life.current;
                    let life_max = result.life.maximum;

                    let user_age = result.age;
                    let marital_status = 'WIP';
                    let user_networth = result.networth.total;

                    var general_items = {
                        'Name': `<a href="${profile_link}" class="ts-ui-link">${user_name} [${user_id}]</a>`,
                        'Money': `$${user_money.format_thousand_seperator()}`,
                        'Points': user_points.format_thousand_seperator(),
                        'Level': user_level,
                        'Rank': user_rank,
                        'Life': `${life_current} / ${life_max}`,
                        'Age': user_age.format_thousand_seperator(),
                        'Marital Status': marital_status,
                        'Networth': `$${user_networth.format_thousand_seperator()}`
                    }

                    for (var general_item in general_items) {
                        let general_item_value = general_items[general_item];
                        $('.ts-info.general').append(
                            `<li class="ts-general-item">
                            <span class="ts-general-key">${general_item}</span>
                            <span class="ts-general-value">${general_item_value}</span>
                            </li>`
                        )
                    }

                // Build Battle Stats Section
                } else if (section == 'battlestats') {
                    let stat_strength = Math.round(result.strength);
                    let stat_defense = Math.round(result.defense);
                    let stat_speed = Math.round(result.speed);
                    let stat_dexterity = Math.round(result.dexterity);
                    let stat_total = Math.round(result.total);

                    let strength_modifier = result.strength_modifier;
                    let defense_modifier = result.defense_modifier;
                    let speed_modifier = result.speed_modifier;
                    let dexterity_modifier = result.dexterity_modifier;

                    var battle_stats = {
                        'Strength': stat_strength.format_thousand_seperator(),
                        'Defense': stat_defense.format_thousand_seperator(),
                        'Speed': stat_speed.format_thousand_seperator(),
                        'Dexterity': stat_dexterity.format_thousand_seperator(),
                        'Total': stat_total.format_thousand_seperator()
                    }

                    var battle_stats_modifiers = {
                        'Strength': `${strength_modifier}%`,
                        'Defense': `${defense_modifier}%`,
                        'Speed': `${speed_modifier}%`,
                        'Dexterity': `${dexterity_modifier}%`,
                        'Total': ''
                    }

                    for (var battle_stat in battle_stats) {
                        let stat_value = battle_stats[battle_stat];
                        let stat_modifier = battle_stats_modifiers[battle_stat];
                        if (!stat_modifier.startsWith('-')) {
                            if (stat_modifier != '') {
                                stat_modifier = `+${stat_modifier}`
                            }
                        }
                        $('.ts-info.battlestats').append(
                            `<li class="ts-general-item">
                            <span class="ts-general-key">${battle_stat}</span>
                            <span class="ts-general-value">${stat_value}</span>
                            <span class="ts-general-value2">${stat_modifier}</span>
                            </li>`
                        )
                    }

                // Build Property Section
                } else if (section == 'property') {
                    let property_id = result.property_id;
                    let property_name = result.properties[property_id].property;

                    let property_value = result.properties[property_id].marketprice;
                    let property_upkeep = result.properties[property_id].upkeep + result.properties[property_id].staff_cost;
                    let property_fees = result.networth.unpaidfees;

                    if (String(property_fees).startsWith('-')) {
                        property_fees = String(property_fees).slice(1)
                    }

                    property_fees = parseInt(property_fees);

                    let property_img_link = `https://www.torn.com/images/v2/properties/350x230/350x230_default_${properties[property_name]}.png`

                    var property_details = {
                        'Property': property_name,
                        'Cost': `$${property_value.format_thousand_seperator()}`,
                        'Fees': `$${property_fees.format_thousand_seperator()} (+ $${property_upkeep.format_thousand_seperator()} per day)`
                    }

                    for (var property_detail in property_details) {
                        let detail_value = property_details[property_detail];
                        $('.ts-info.property').append(
                            `<li class="ts-general-item">
                            <span class="ts-general-key">${property_detail}</span>
                            <span class="ts-general-value">${detail_value}</span>
                            </li>`
                        )
                    }

                    $('.ts-info.property').append(
                        `<li class="ts-property-image" style="background-image: url(${property_img_link})"></li>`
                    )
                }
            }

            // Build Column 2
            for (let section in home_sections_column2) {
                let section_name = home_sections_column2[section]
                $('.ts-home-sections').eq(1).append(
                    `<li class="ts-section">
                    <h2 class="ts-header main">${section_name}</h2>
                    <div class="ts-section-content">
                    <ul class="ts-info ${section}">
                    </ul></div></li>`
                )

                // Build Perks Section
                if (section == 'perks') {
                    const perk_categories = [
                        'faction',
                        'company',
                        'job',
                        'property',
                        'stock',
                        'merit',
                        'education',
                        'enhancer',
                        'book'
                    ]

                    var perk_count = 0;

                    for (var perk_cat in perk_categories) {
                        let perk_cat_name = perk_categories[perk_cat];
                        let perk_cat_name_cap = capitalize(perk_cat_name);

                        let current_perks = result[`${perk_cat_name}_perks`];

                        for (var perk in current_perks) {
                            $('.ts-info.perks').append(
                                `<li class="ts-perk-row">
                                <span class="ts-perk ${perk_cat_name}">${perk_cat_name_cap} :</span>
                                <span class="ts-perk-description">${current_perks[perk]}</span>
                                </li>`
                            )

                            perk_count += 1;
                        }
                    }

                    $('.ts-info.perks').append(
                        `<li class="ts-perk-row"><span class="ts-perk-description">Total personal perks: ${perk_count}</span></li>`
                    )


                // Build Faction Section
                } else if (section == 'faction') {
                    let faction_name = result.faction.faction_name;
                    let faction_days = result.faction.days_in_faction;
                    let faction_respect = faction_result.respect;
                    let faction_members = Object.keys(faction_result.members).length;

                    var faction_details = {
                        'Faction': faction_name,
                        'Days in Faction': faction_days.format_thousand_seperator(),
                        'Respect': faction_respect.format_thousand_seperator(),
                        'Members': faction_members
                    }

                    for (var faction_detail in faction_details) {
                        let detail_key = faction_detail;
                        let detail_value = faction_details[faction_detail];

                        $('.ts-info.faction').append(
                            `<li class="ts-general-item">
                            <span class="ts-general-key">${detail_key}</span>
                            <span class="ts-general-value">${detail_value}</span>
                            </li>`
                        )
                    }

                // Build Work Stats Section
                } else if (section == 'workstats') {
                    let stat_manual = result.manual_labor;
                    let stat_intelligence = result.intelligence;
                    let stat_endurance = result.endurance;

                    var work_details = {
                        'Manual labor': stat_manual.format_thousand_seperator(),
                        'Intelligence': stat_intelligence.format_thousand_seperator(),
                        'Endurance': stat_endurance.format_thousand_seperator()
                    }

                    for (var work_detail in work_details) {
                        let detail_key = work_detail;
                        let detail_value = work_details[work_detail];

                        $('.ts-info.workstats').append(
                            `<li class="ts-general-item">
                            <span class="ts-general-key">${detail_key}</span>
                            <span class="ts-general-value">${detail_value}</span>
                            </li>`
                        )
                    }

                // Build Job Section
                } else if (section == 'job') {
                    let company_id = result.job.company_id;
                    if (company_id == 0) {
                        let job = result.job.position;
                        $('.ts-info.job').append(
                            `<li class="ts-general-item">
                            <span class="ts-general-key">Job</span>
                            <span class="ts-general-value">${job}</span>
                            </li>`
                        )
                        if (job != 'None') {
                            let job_points = result.jobpoints.jobs[String(job).toLowerCase()]
                            $('.ts-info.job').append(
                                `<li class="ts-general-item">
                                <span class="ts-general-key">Job points</span>
                                <span class="ts-general-value">${job_points}</span>
                                </li>`
                            )
                        }
                    } else {
                        let user_id = result.player_id;
                        let job = result.job.position;
                        let company_name = result.job.company_name;
                        let company_days = company_result.company.employees[user_id].days_in_company;
                        let company_type_id = company_result.company.company_type;
                        let company_type = torn_result.companies[company_type_id.toString()].name;
                        let company_position = company_result.company.employees[user_id].position;
                        let company_points = result.jobpoints.companies[company_type_id.toString()].jobpoints;
                        let company_rating = company_result.company.rating;

                        var company_details = {
                            'Job': job,
                            'Company': company_name,
                            'Days in Company': company_days.format_thousand_seperator(),
                            'Type': company_type,
                            'Position': company_position,
                            'Job points': company_points.format_thousand_seperator(),
                            'Rating': '<ul class="ts-company-rating"></ul>'
                        }

                        for (var company_detail in company_details) {
                            let detail_key = company_detail;
                            let detail_value = company_details[company_detail];

                            $('.ts-info.job').append(
                                `<li class="ts-general-item">
                                <span class="ts-general-key">${detail_key}</span>
                                <span class="ts-general-value">${detail_value}</span>
                                </li>`
                            )
                        }

                        for (var i = 0; i < 10; i++) {
                            if (i < company_rating) {
                                $('.ts-company-rating').append(
                                    `<li class="ts-rating-star active"></li>`
                                )
                            } else {
                                $('.ts-company-rating').append(
                                    `<li class="ts-rating-star inactive"></li>`
                                )
                            }
                        }
                    }

                // Build Crime Section
                } else if (section == 'crimes') {
                    let crime_illegal_products = result.criminalrecord.selling_illegal_products;
                    let crime_theft = result.criminalrecord.theft;
                    let crime_auto_theft = result.criminalrecord.auto_theft;
                    let crime_drug_deals = result.criminalrecord.drug_deals;
                    let crime_computer_crimes = result.criminalrecord.computer_crimes;
                    let crime_murder = result.criminalrecord.murder;
                    let crime_fraud_crimes = result.criminalrecord.fraud_crimes;
                    let crime_other = result.criminalrecord.other;
                    let crime_total = result.criminalrecord.total;

                    var crime_details = {
                        'Illegal products': crime_illegal_products.format_thousand_seperator(),
                        'Theft': crime_theft.format_thousand_seperator(),
                        'Auto theft': crime_auto_theft.format_thousand_seperator(),
                        'Drug deals': crime_drug_deals.format_thousand_seperator(),
                        'Computer crimes': crime_computer_crimes.format_thousand_seperator(),
                        'Murder': crime_murder.format_thousand_seperator(),
                        'Fraud crimes': crime_fraud_crimes.format_thousand_seperator(),
                        'Other': crime_other.format_thousand_seperator(),
                        'Total': crime_total.format_thousand_seperator()
                    }

                    for (var crime_detail in crime_details) {
                        let detail_key = crime_detail;
                        let detail_value = crime_details[crime_detail];

                        $('.ts-info.crimes').append(
                            `<li class="ts-general-item">
                            <span class="ts-general-key">${detail_key}</span>
                            <span class="ts-general-value">${detail_value}</span>
                            </li>`
                        )
                    }
                }
            }
        }
    }

    $('div.ts-main-window').append(panels.home);
    await sleep(1000);
	await switch_tab(null, 'home');
};

const send_travel_data = async () => {
    let yata_url = 'https://yata.alwaysdata.net/bazaar/abroad/import/'

    let country = $('h4#skip-to-content').text().substring(1, 4).toLowerCase();
    let version = GM_info.script.version;
    let items = [];

    $('.travel-agency-market > ul > li').each(function() {
        let item_id = $(this).find('span.amount').eq(0).children('input').attr('id');
        item_id = parseInt(item_id.substring(5, item_id.length));
        let stock = $(this).find('span.stck-amount').text();
        let cost = $(this).find('span.c-price').text().replace('$', '');
        cost = parseInt(replaceAll(cost, ',', ''));
        stock = parseInt(replaceAll(stock, ',', ''));

        items.push({
            'id': item_id,
            'quantity': stock,
            'cost': cost
        })
    })

    let data = {
        'client': "Lone's Travel Script",
        'version': version,
        'author_name': 'lonerider543',
        'author_id': '2173471',
        'country': country,
        'items': items
    }

    GM_xmlhttpRequest({
        method: "POST",
        url: yata_url,
        headers: {
            'content-type': 'application/json'
        },
        data: JSON.stringify(data),
        onload: (response) => {
            console.log(response);
        }
    });
}

const main = async () => {
    if (!execute) return;
    execute = false;

    let travel = $('.travel-agency-travelling').text();
    if (travel) {
        await apiFetch('user', 'basic,bars,icons,money,medals,honors,merits,profile,battlestats,properties,networth,perks,workstats,jobpoints,crimes,personalstats').then((result) => render(result));
    } else {
        let travel_market = $('.travel-agency-market');
        if (travel_market.length > 0) {
            send_travel_data();
        } else if ($('.content-title > h4').text().includes('Preferences')) {
            if (!api_key) {
                $('.content-title').after('<a href="#" class="ts-api-button">Save API Key</a>');
                $('.ts-api-button').click(function() {
                    api_key = $('div#api > div.inner-block > form > input').val();
                    apiFetch('user', 'basic').then((result) => {
                        let error = result.error;
                        if (error) {
                            console.log(error);
                            api_key = '';
                        } else {
                            let name = result.name;
                            let user_id = result.player_id;
                            let out_text = `Saved API Key for ${name} [${user_id}]`;

                            $('.ts-api-button').before(`<h4>${out_text}</h4>`);
                            $('.ts-api-button').remove();
                        }
                    });
                    localStorage.setItem('ts-apikey', api_key);
                });
            }
        }
    }

    $('li.ts-tab').click(function() {
        if ($(this).attr('class') != 'ts-tab active') {
            let new_tab = $(this).attr('id');
            let current_tab = $('li.ts-tab.active').attr('id');

            $('li.ts-tab').attr('class', 'ts-tab');
            $(this).attr('class', 'ts-tab active');

            switch_tab(current_tab, new_tab);
        }
    });
};

const observer = new MutationObserver(main);
observer.observe(targetNode, config);
