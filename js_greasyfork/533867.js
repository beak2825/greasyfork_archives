// ==UserScript==
// @name         eRepublik #SPRINGBREAK Mission Tracker v3.25 (v57)
// @namespace    http://tampermonkey.net/
// @version      3.25
// @description  Track eRepublik #SPRINGBREAK missions in real time with a clean, draggable, collapsible panel. Fully local, privacy-first, bot-free, and player-friendly. Tracks missions, not players. Made by a gamer, for gamers.
// @author       Janko Fran
// @match        https://www.erepublik.com/*
// @icon         https://cdnt.erepublik.net/1tHGTBSIWR-V1fs1khcaIcLSWRE=/55x55/smart/avatars/Newspapers/2009/11/09/99a620b97aed575f5811ccd4807a7cb1.jpg
// @grant        none
// @license      Custom License - Personal, Non-Commercial Use Only
// @run-at       document-idle
// @homepageURL  https://greasyfork.org/en/users/1461808-janko-fran
// @supportURL   https://www.erepublik.com/en/main/messages-compose/2103304
// @downloadURL https://update.greasyfork.org/scripts/533867/eRepublik%20SPRINGBREAK%20Mission%20Tracker%20v325%20%28v57%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533867/eRepublik%20SPRINGBREAK%20Mission%20Tracker%20v325%20%28v57%29.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

/**
 * eRepublik #SPRINGBREAK Mission Tracker v3.25 (v57)
 * Tracks mission progress for the #SPRINGBREAK event in a clean, draggable, collapsible panel.
 * Runs locally, respecting user privacy, with no automation or external data storage.
 * Built for eRepublik players by Janko Fran.
 *
 * Changelog (v57):
 * - Add support for Touch events
 * - Fixed tooltip positioning to align with each `.info-icon`’s position within the panel.
 * - Updated `.mission-box .tooltip` and `.mt-summary .tooltip` CSS for precise centering (`left: 0`, `transform: translateX(-50%)` relative to icon).
 * - Increased `top: 16px` for better spacing below icons.
 * - Added dynamic `left` positioning in hover event listeners using `getBoundingClientRect()` for accurate placement.
 * - Added `width: max-content` to tooltips to prevent excessive width.
 * - Enhanced debug logs for tooltip positioning.
 *
 * License:
 * This script is provided free of charge for personal, non-commercial use only.
 * You are granted a perpetual, royalty-free license to use this script on your own eRepublik account.
 * No part of this script may be modified, redistributed, or used for commercial purposes without
 * the express written permission of the author, Janko Fran.
 * Donations are welcome to support future improvements:
 * - eRepublik Donations: https://www.erepublik.com/en/economy/donate-money/2103304
 * - Satoshi Donations: janko7ea63e4e@zbd.gg
 * For custom scripts or inquiries, contact: https://www.erepublik.com/en/main/messages-compose/2103304
 *
 * Localization:
 * Strings are centralized in CONFIG.STRINGS and CONFIG.LOCALES.
 * To add a new locale, extend CONFIG.LOCALES with translated strings.
 * Use getLocalizedString() to retrieve locale-specific content.
 * Images are centralized in CONFIG.IMAGES without localization.
 */

(async function() {
    'use strict';

    /**
     * ──────────────────────────────────────────────────────────────────────────────
     * SECTION: CONFIGURATION
     * Defines constants, settings, images, strings, and localization data.
     * Centralized for maintainability and localization support.
     * ──────────────────────────────────────────────────────────────────────────────
     */
    const CONFIG = {
        VERSION: '3.25', // Script version
        DEBUG: false, // Enable debug logging (set to true for testing)
        EVENT_LENGTH: 14, // Event duration in days
        TOTAL_MISSIONS: 10, // Total missions
        STORAGE_KEY: 'missionTrackerPosition', // LocalStorage for panel position
        STATE_KEY: 'missionTrackerState', // LocalStorage for collapsed state
        POLL_INTERVAL_MS: 200, // Polling interval (ms)
        MAX_WAIT_TIME_MS: 15000, // Max wait time for data (ms)
        FETCH_DELAY_MS: 150, // Delay between fetches (ms)
        DEFAULT_LOCALE: 'en', // Default language
        IMAGES: {
            title: 'https://www.erepublik.net/images/icons_svg/sidebar/events_icon.svg', // Panel title icon
            info: 'https://www.erepublik.net/images/modules/sidebar/info_icon.png', // Info button icon
            infoSmall: 'https://www.erepublik.net/images/modules/sidebar/info_icon.png', // Small info icon for mission tips
            donate: 'https://www.erepublik.net/images/modules/_icons/gold_icon.png', // Donate button icon
            reset: 'https://www.erepublik.net/images/modules/battle/garage/reset_icon.png', // Reset button icon
            reward: 'https://www.erepublik.net/images/modules/popups/dyeHard/currency.png', // Reward icon
            blueprint: 'https://www.erepublik.net/images/modules/battle/garage/blueprints/vehicle_blueprint_large.png', // Blueprint icon
            currency: 'https://www.erepublik.net/images/modules/sidebar/currency.png?1698060179', // Currency icon
            satoshi: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAArlBMVEUIIvUIIvYIIOcII/kAEa0AHfxFTXwAGvMAAP+vuTcMH80AIPkAAOrt+wB5g4IAEP9kbo37/xjf7AAAHvoAANvk8gDw/yf1/ySdp1AEH/bO2hqTnVkAAPIAFv0AHusRI83U4Q1ueI96g3uSnWoqNrW6xTM6RKi/yywAANKdp1tFc8I2XdKapGRKVK0lRuCP4jiJ2kkePOY/SaQQK+9+yWGb9AB3vnAAFcRwtIFkopY0Lz+5AAAAtklEQVR4AbzRQwLEQBAAwO7YtpO1rf8/LLjFx51rTRv+8nDOiBklKXIaaYbFSeR4QZwylGRFnUJV0w0Jx820bMf1uBFFX7UC13H0MIrJviepYtdWa5anCXanp4pMb8xx5cWytwskY1WTG1tZqjgsi+padtxNNDEpV+jydsxoEwAje8eNWLw/xADq8UQPzTxfrjcTzLuAA/Mfz9frDUh+xg7qc98fh4DJkBq9PfxquJOJJFBuMAAAWPsMsDR/OjAAAAAASUVORK5CYII=' // Satoshi donation icon
        },
        URLS: {
            donate: 'https://www.erepublik.com/en/economy/donate-money/2103304',
            profile: 'https://www.erepublik.com/en/citizen/profile/2103304',
            contact: 'https://www.erepublik.com/en/main/messages-compose/2103304',
            satoshi: 'mailto:janko7ea63e4e@zbd.gg'
        },
        FONTS: {
            title: '13px',
            base: '12px',
            small: '11px',
            tiny: '10px'
        },
        COLORS: {
            OK: '#0f0',
            WARN: '#ffa500',
            SERIOUS_WARN: '#f00',
            TEXT: '#6cf',
            MUTED: '#ccc',
            SURFACE: '#eee',
            DIVIDER: '#333',
            BLACK: '#000'
        },
        BORDERS: {
            DIVIDER: '0.25px solid #333'
        },
        POSITIONS: {
            reset: { top: '60px', left: '20px' }
        },
        MISSION_OBJECTIVES: {
            LiberateRegions: { title: "Help liberate 20 regions", total: 20 },
            WinHeroMedals: { title: "Win 20 hero medals", total: 20 },
            GainProtectorLevels: { title: "Gain 20 Protector levels", total: 20 },
            WorkSalary1500: { title: "Work 50 times for your employer", total: 50 },
            ActivateHouse: { title: "Activate 50 houses", total: 50 },
            SpendFuel: { title: "Use 100 Fuel", total: 100 },
            EnergyDeployments: { title: "Do 200 500+ Energy deployments in battles", total: 200 },
            AssignEmployees: { title: "Assign 500 your company employees", total: 500 },
            PrestigePoints: { title: "Reach 40,000 Prestige Points", total: 40000 },
            TravelDistance: { title: "Travel 2 million km", total: 2000000 }
        },
        MISSION_TIPS: {
            MissionBriefing: "#SPRINGBREAK MISSION BRIEFING<br>" +
                             "<i>These are more than routine missions - they forge heroes.<br>" +
                             "The battlefield is vast, and victory belongs to those who prepare wisely, plan strategically, focus sharply, and strike boldly.<br>" +
                             "Your missions are your map, your strategy the blade that carves your destiny.<br>" +
                             "Hone your skills. Sharpen your discipline. Harden your will into unbreakable steel.<br>" +
                             "Carve your mark into history - and let the legend bear your name.</i>",
            LiberateRegions: "<b>MISSION: Vive la resistance!</b><br>" +
                             "<i>Help others break free and reclaim their homeland. Front line heroes needed!</i><br><br>" +
                             "<b>Goal: Help liberate 20 regions.</b><br><br>" +
                             "<b>Tips:</b><br><br>" +
                             "1. Coordinate with your military unit to maximize liberation efforts.<br>" +
                             "2. Use the Resistance War filter to find good opportunities.<br>" +
                             "3. Prioritize Resistance battles in occupied regions where your side Resistance is close to victory or nearly tied. Focus your energy where it makes the biggest impact to secure fast liberations.<br>" +
                             "4. Make sure you fight for the Resistance side.<br>" +
                             "5. If you are low on energy, remember: even a small contribution counts, not just winning medals.<br><br>" +
                             "<b>Combo Tips:</b><br><br>" +
                             "1. Combine with <i>Gas Guzzler</i> and <i>Protector of Nations</i> missions.<br>" +
                             "2. Make 500+ energy deployments for the <i>Make It Count</i> mission.<br>" +
                             "3. If you win a medal on the winning Resistance side, it also counts toward the <i>The world needs heroes</i> mission.<br><br>" +
                             "<i>Stand strong. Fight smart. Liberate together!<br>Every liberation battle lights the flame of freedom, echoing through space and time - one that no enemy can ever extinguish.</i>",
            WinHeroMedals: "<b>MISSION: The world needs heroes</b><br>" +
                           "<i>Celebrated by brothers in arms, envied by rookies, and hunted by enemies, their deeds are forever set in gold.</i><br><br>" +
                           "<b>Goal: Win 20 Hero medals</b><br>(Battle Hero, Sky Hero, or Campaign Hero)<br><br>" +
                           "<b>Tips:</b><br><br>" +
                           "1. Check active campaigns regularly to find less contested battles and fresh medal opportunities.<br>" +
                           "2. Play during low-activity hours, usually late at night or early in the morning.<br>" +
                           "3. Hunt for empty or low-resistance battles near the start of a round.<br>" +
                           "4. Focus on Sky Hero medals (air battles) if ground battles are too competitive, and vice versa.<br>" +
                           "5. Use damage boosters (+50% Air Damage, Shadow Fighter) when needed. Boosters increase your damage output, making it easier to secure medals.<br>" +
                           "6. Fight in the same battle across multiple rounds to collect more Battle Hero medals and secure a Campaign Hero medal efficiently.<br>" +
                           "7. Use Fuel wisely early in the week to maximize your chances of winning medals later, when competition is lower.<br><br>" +
                           "<b>Combo Tips:</b><br><br>" +
                           "1. Travel between battles to make progress in the <i>Travel</i> mission.<br>" +
                           "2. If you win a medal on the resistance side of a winning resistance battle, it also counts for the <i>Vive la resistance!</i> mission.<br>" +
                           "3. If you are not positioned to win a medal on the resistance side and the resistance is overwhelmingly winning, participate first to support the mission, then consider switching to the defending side within the same division to fight for a medal at no extra Fuel cost, but only if it does not risk the Resistance victory.<br><br>" +
                           "<i>Stand tall. Fight smart. Become a true hero!</i>",
            GainProtectorLevels: "<b>MISSION: Protector of Nations</b><br>" +
                                 "<i>Stand guard over your country and its allies. Smart deployments build true strength.</i><br><br>" +
                                 "<b>Goal: Gain 20 Protector levels.</b><br><br>" +
                                 "<b>Tips:</b><br><br>" +
                                 "1. Prioritize countries where you have 0 or few Protector points, or are close to reaching the next level (check your Armory). Countries with a low Protector level require less damage to advance, making them faster to level up.<br>" +
                                 "2. Assign your ground or air vehicle to the country you want to level up. Fighting with an enrolled vehicle converts 10% of your damage for your citizenship country, 4% for an ally, and 2% for others. Without an enrolled vehicle, only 1% is converted. Reassignment is possible but costly, requiring a Vehicle Discharge Document from your Storage or the VIP Shop. Focus your efforts where you gain Protector points most efficiently.<br>" +
                                 "3. Match your vehicle to the correct division and mission goals to maximize efficiency and avoid wasting damage.<br>" +
                                 "4. Use Rank Boosters, Damage Boosters, and Damage Accelerators to accelerate your progress toward new Protector levels, especially when close to leveling up or fighting for key countries.<br><br>" +
                                 "<b>Combo Tips:</b><br><br>" +
                                 "1. Combine with <i>Vive la resistance!</i> missions by fighting for countries where you need Protector points. Fight with an enrolled vehicle to complete both missions efficiently.<br><br>" +
                                 "<i>Protect, fight, rise and lead as a true guardian of nations!</i>",
            WorkSalary1500: "<b>MISSION: Show me the money</b><br>" +
                            "<i>Hard work and planning pave the way to success.</i><br><br>" +
                            "<b>Goal: Work 50 times for an employer paying at least 1500 currency.</b><br><br>" +
                            "<b>Tips:</b><br><br>" +
                            "1. Stock up on Overtime Points ahead of the event to accelerate your progress.<br>" +
                            "2. Activate Q1–Q3 Houses early to unlock extra daily work shifts and stay on track.<br>" +
                            "3. Choose employers offering salaries over 1500 CC to ensure every work shift counts toward your goal. Aim for salaries over 8000 CC to maximize progress and profit, but check daily work limits before applying.<br>" +
                            "4. If you have many Overtime Points, set an alarm every hour to work as soon as possible and speed up mission completion.<br>" +
                            "5. If you have few Overtime Points and active Houses (Q1–Q3), work every 8 hours to make the most of your available work shifts.<br><br>" +
                            "6. At day change (00:00 eRepublik time), you can work once without consuming Overtime Points. If you have at least 24 Overtime Points, you can immediately work again, registering two work actions in quick succession.<br><br>" +
                            "<b>Combo Tips:</b><br><br>" +
                            "1. Activating Houses also advances the <i>Home Sweet Homes</i> mission by enabling multiple daily work opportunities.<br>" +
                            "2. Earning higher salaries can indirectly support <i>Home Sweet Homes</i> and <i>Ramp Up Production</i> by providing more currency to activate Houses or hire workers.<br>" +
                            "3. Solid work earnings during the event build your economic foundation for future success.<br><br>" +
                            "<i>Work smart, plan ahead, and claim your rewards!</i>",
            ActivateHouse: "<b>MISSION: Home Sweet Homes</b><br>" +
                           "<i>Plan ahead and build your foundation for success.</i><br><br>" +
                           "<b>Goal: Activate 50 houses.</b><br><br>" +
                           "<b>Tips:</b><br><br>" +
                           "1. Stock up on Q1 Houses ahead of the event to ensure smooth and stress-free activation.<br>" +
                           "2. Use any previously saved Q1–Q3 Houses to accelerate your progress if needed.<br>" +
                           "3. Activate Houses steadily throughout the event to stay on track and avoid last-minute rush or inflated prices.<br><br>" +
                           "<b>Combo Tips:</b><br><br>" +
                           "1. Activating Houses also unlocks extra daily work shifts, helping you progress faster in the <i>Show me the money</i> mission.<br><br>" +
                           "<i>May you plan ahead and build many houses as strong as fortresses. But remember: there is only one true home, and one homeland, in your heart. Always return to it after battle, either with your shield or on it!</i>",
            SpendFuel: "<b>MISSION: Gas Guzzler</b><br>" +
                       "<i>Use Fuel to fight in battles</i><br><br>" +
                       "<b>Goal: Use 100 Fuel units.</b><br><br>" +
                       "<b>Tips:</b><br><br>" +
                       "1. Fuel Management: You receive 70 Fuel units weekly, plus up to 7 more from Daily Missions. Plan to use 10-11 Fuel units per day to stay on track and make the most of your available Fuel.<br>" +
                       "2. Save Fuel for Critical Battles: Don’t deplete all your Fuel early in the week - save some for critical battles later.<br>" +
                       "3. Gold Store: When everything else fails, you can buy extra Fuel from the Gold Store, but it gets more expensive with each unit — use Gold wisely!<br><br>" +
                       "<b>Combo Tips:</b><br><br>" +
                       "1. Prioritize Strategic Fights: Focus on epic battles, liberation efforts and medal opportunities to make the most of your Fuel.<br>" +
                       "2. Fuel Distribution: Balance your Fuel usage between ground and air battles to optimize progress in medals, </i>Protector of Nations</i> mission points, and </i>Vive la resistance!</i> mission.<br>" +
                       "3. Fuel - Critical for Many Missions: Except for the Gas Guzzler mission, you need Fuel to advance missions like <i>Vive la resistance!</i>, <i>Protector of Nations</i>, and <i>The World Needs Heroes</i>. No Fuel, no progress.<br><br>" +
                       "<i>Fight brave, fight with heart, burn bright, but fight smart. Manage your fuel supplies wisely and don't burn out. Keep the fire alive! Tanks and airplanes win battles, logistics wins wars.</i>",
            EnergyDeployments: "<b>MISSION: Make It Count</b><br>" +
                               "<i>You may have to fight a battle more than once to win it - Margaret Thatcher</i><br><br>" +
                               "<b>Goal: Do 200 deployments using at least 500 energy each.</b><br><br>" +
                               "<b>Tips:</b><br><br>" +
                               "1. <b>Start Early:</b> Avoid the stress of last-minute rushing. Completing smaller deployments steadily will keep you on track without the need for a major push at the end.<br><br>" +
                               "2. <b>Deploy with Measure:</b> Always deploy at least 500 energy. Set your slider to 550 energy to be on the safe side and maximize your chances of completing the mission efficiently.<br><br>" +
                               "3. <b>Efficient Energy Use:</b> Smaller, 500 energy deployments help you complete the mission faster while ensuring that every deployment counts.<br><br>" +
                               "<b>Combo Tips:</b><br><br>" +
                               "1. <b>Multiple Benefits:</b> Every deployment contributes to other missions, such as advancing Protector Levels, earning Prestige Points, and securing Hero Medals. You’re making progress on multiple fronts with each deployment.<br><br>" +
                               "<i>Power through with energy — make every deployment count! Manage your energy wisely and keep pushing forward!</i>",
            AssignEmployees: "<b>MISSION: Ramp Up Production</b><br>" +
                             "<i>Stockpile wisely or flood the market. Will you make the right call?</i><br><br>" +
                             "<b>Goal: Assign 500 employees in your companies.</b><br><br>" +
                             "<b>Tips:</b><br><br>" +
                             "1. Prepare Resources Early: Hire workers and stockpile raw materials before the event begins. Scarcity drives up costs during peak times.<br>" +
                             "2. Start Strong: Assign employees as soon as the event begins to secure an early lead and avoid delays in production.<br>" +
                             "3. Assign Efficiently: Deploy workers in bulk to save time and maintain momentum.<br>" +
                             "4. Monitor and Adapt: Track material prices, watch for salary spikes, and production bonus drops. Adjust your assignments quickly to protect production and profits.<br><br>" +
                             "<b>Combo Tips:</b><br><br>" +
                             "1. Fully staffed companies complete the mission faster and help you stockpile valuable Houses and products for the future use.<br>" +
                             "2. Producing and activating Houses (Q1–Q3) supports the <i>Home Sweet Homes</i> mission by unlocking extra work shifts and energy storage bonuses.<br>" +
                             "3. Selling surplus products, like Aircraft Weapons, provides Gold for Fuel and currency for boosters and weapons, helping your combat missions like <i>Vive la resistance!</i> and <i>The world needs heroes</i>.<br>" +
                             "4. A strong economy built during the event gives you more financial freedom and resources for future events.<br><br>" +
                             "<i>Wars are not won by soldiers alone, but by the workers who forge the steel behind the frontlines. Behind every brigade of soldiers stand 10,000 workers who supply and support them. Support their effort. Assign wisely. Build fiercely. Victory follows industry. Power your nation to victory!</i>",
            PrestigePoints: "MISSION: Strive for Prestige<br>" +
                            "<i>Every battle you fight, every drop of energy you spend, forges your legacy.</i><br><br>" +
                            "Goal: Reach 40,000 Prestige Points.<br><br>" +
                            "<b>Tips:</b><br><br>" +
                            "<b>1. Dominate Tuesday Epics:</b> Focus your main efforts on Tuesday Epic battles where Prestige Points are doubled. It is the fastest and most efficient path to your goal.<br>" +
                            "<b>2. Amplify with Boosters:</b> Activate Prestige Point boosters during Epics to multiply your gains and surge ahead.<br>" +
                            "<b>3. Forge Early, Forge Steady:</b> Start building Prestige from Day 1 with small, steady deployments to avoid last-minute panic and maintain momentum.<br>" +
                            "<b>4. Master Your Energy:</b> Spend energy bars mainly during Epic battles and while boosters are active. Always prioritize deployments over 500 energy for maximum impact.<br>" +
                            "<b>5. Seize Springcoin Rewards:</b> Use Springcoins on the 100 Springcoin reward pool for a chance to win 400 Carrots of energy. Fuel your deployments during Epics and supercharge your Prestige climb.<br><br>" +
                            "<b>Combo Tips:</b><br><br>" +
                            "1. Every <b>500+ energy deployment</b> pushes both the <i>Make It Count</i> and Prestige missions forward.<br>" +
                            "2. Winning <b>Hero Medals</b> adds extra Prestige Points and helps complete <i>The world needs heroes</i>.<br>" +
                            "3. Gaining <b>Protector Levels</b> during battles boosts your Prestige and advances the <i>Protector of Nations</i> mission.<br>" +
                            "4. Smart <b>Fuel management</b> supports <i>Gas Guzzler</i>, <i>Vive la resistance</i>, and Prestige gains at the same time.<br><br>" +
                            "<i>Prestige is not given. It is forged - one deployment, one battle, one victory at a time. Forge your path. Build your legacy. Carve your name into history!</i>",
            TravelDistance: "<b>MISSION: Travel the World</b><br>" +
                            "<i>Cross the oceans, span continents, and leave your mark across the world.</i><br><br>" +
                            "<b>Goal: Travel 2 million kilometers.</b><br><br>" +
                            "<b>Tips:</b><br><br>" +
                            "<b>1. Choose The Tickets Wisely:</b> Use Q5 Travel Tickets to maximize distance and minimize travel costs per move.<br>" +
                            "<b>2. Route Efficiency:</b> The top travel route is Spain (Castilla y León) to New Zealand (Wellington), 19,953 km long. You need 404 Q5 Travel Tickets to complete the mission if you use this route exclusively.<br>" +
                            "<b>3. Combine Travel and Action:</b> Travel to battles along your route to stack travel distance and battle participation efficiently.<br>" +
                            "<b>4. Manage Costs:</b> Spread your travel steadily across the event to avoid draining your resources all at once.<br>" +
                            "<b>5. Team Up:</b> Coordinate with friends and comrades to share travel plans, save tickets, and optimize your expenses. Traveling together is also more fun.<br><br>" +
                            "<b>Combo Tips:</b><br><br>" +
                            "<b>1. Travel smart</b> to hunt Liberation battles (<i>Vive la resistance</i>) and Hero Medals (<i>The world needs heroes</i>) along the way.<br>" +
                            "<b>2. Fighting</b> in traveled regions directly contributes to <i>Gas Guzzler</i> and <i>Protector of Nations</i> missions if done together.<br><br>" +
                            "<i>Distance is no barrier for those who seek greatness. Step by step, kilometer by kilometer, carve your path across the world and etch your legacy into history!</i>",
            overall: "<b>#SPRINGBREAK MISSION BRIEFING: Strategic Mastery</b><br>" +
                     "<i>These are more than routine missions - they forge heroes.<br>" +
                     "The battlefield is vast, and victory belongs to those who prepare wisely, plan strategically, focus sharply, and strike boldly.<br>" +
                     "Your missions are your map, your strategy the blade that carves your destiny.<br>" +
                     "Hone your skills. Sharpen your discipline. Harden your will into unbreakable steel.<br>" +
                     "Carve your mark into history - and let the legend bear your name.</i><br><br>" +
                     "<b>Overall Strategy Tips:</b><br><br>" +
                     "<b>Early Priorities (Day 1–3):</b><br>" +
                     "1. Work multiple times daily and activate Houses early to unlock extra shifts and bonuses.<br>" +
                     "2. Assign employees swiftly to factories to secure a production head start.<br>" +
                     "3. Join Resistance battles and start liberating regions immediately.<br>" +
                     "4. Hunt early Hero and Sky Hero medals when competition is low.<br>" +
                     "5. Allocate Fuel carefully — conserve enough for key battles later.<br><br>" +
                     "<b>Mid-Game Focus (Day 4–10):</b><br>" +
                     "1. Target easy Protector Level gains in smaller or weaker countries.<br>" +
                     "2. Plan your strongest fighting days around Tuesday epics to double Prestige Points.<br>" +
                     "3. Keep energy usage steady. Consistent regular deployments build unstoppable momentum.<br>" +
                     "4. Stockpile Carrots, boosters, and energy bars for a powerful final push.<br>" +
                     "5. Stay disciplined: keep working and activating Houses daily.<br><br>" +
                     "<b>Final Push (Day 11–14):</b><br>" +
                     "1. Finish Energy Deployment and Fuel usage missions if not completed.<br>" +
                     "2. Complete Travel Distance goals by combining travel with final battles.<br>" +
                     "3. Unleash stored energy bars and Carrots to maximize last-minute gains.<br>" +
                     "4. Review all mission progress carefully — no mission left behind!<br><br>" +
                     "<b>Global Combo Tips:</b><br><br>" +
                     "1. Every 500 energy deploy advances <i>Make It Count</i>, <i>Prestige</i>, and Hero missions.<br>" +
                     "2. Smart Fuel management supports <i>Gas Guzzler</i>, <i>Vive la resistance</i>, and medal hunts.<br>" +
                     "3. Travel between battles smartly — it fuels <i>Travel</i> and uncovers medal opportunities.<br>" +
                     "4. Early House activations boost work earnings and progress in <i>Home Sweet Homes</i> and <i>Show Me the Money</i>.<br>" +
                     "5. Consistent work and deployment avoid panic and chaos at the end.<br>" +
                     "6. Save Carrots, boosters, and energy for crucial battles and final rush days.<br>" +
                     "7. Stay flexible. Shift focus to the missions closest to completion if stuck.<br><br>" +
                     "<i>Victory is not claimed in a single strike, but earned through weeks of relentless effort, smart choices, and powerful finish. Plan boldly. Adapt swiftly. Finish strong!</i>",
        },
        STRINGS: {
            modal: {
                title: '#SPRINGBREAK Mission Tracker',
                aboutTitle: 'About This Script – {title}',
                motivationTitle: 'Personal Motivation',
                motivationText: 'Since official development of eRepublik has slowed, I created this tool to enhance the player experience. Initially a personal project, I’m sharing it to benefit active players, contributing to a fun, efficient, and rewarding game.',
                featuresTitle: 'What the Script Does',
                featuresText: 'Displays live mission progress, elapsed time, and overall average for the #SPRINGBREAK event. Runs locally in your browser with no external data storage.',
                benefitsTitle: 'Who Will Benefit',
                benefitsText: 'Players managing all 10 daily missions will save time with a real-time, draggable, collapsible panel.',
                noteTitle: '{warning} Important Note',
                noteText: 'This script does <em>not</em> automate gameplay. You must manually click “Work,” “Fight,” or travel. It only provides a clear, live progress overview.',
                transparencyTitle: 'Free, Transparent, Player-Driven',
                transparencyText: 'Free, transparent, and built for players. No trackers, ads, or hidden behavior. Created with passion for fair, efficient, and enjoyable gameplay.',
                licenseTitle: 'License',
                licenseText: 'For personal, non-commercial use only. Redistribution or commercial use requires the author’s written consent.',
                supportTitle: 'Support Future Development',
                supportText: 'If this script saves time or improves gameplay, consider donating to support enhancements. Donations cover development, testing, and are greatly appreciated.',
                techStackTitle: 'Tech Stack',
                techStackItems: [
                    { name: 'Tampermonkey', desc: 'Browser extension for safe custom scripts, respecting eRepublik’s rules.' },
                    { name: 'JavaScript (ES5)', desc: 'Ensures legacy browser and eRepublik frontend compatibility.' },
                    { name: 'HTML & CSS', desc: 'Native DOM UI for seamless integration.' },
                    { name: 'ChatGPT Plus', desc: 'Aided rapid prototyping and testing.' }
                ],
                footerAuthor: 'Janko Fran',
                footerFeedback: 'For feedback, bugs, suggestions, or custom scripts, <a href="{contact}" target="_blank"><strong>send me a message</strong></a>.',
                footerSincerely: 'Sincerely Yours',
                closeButton: 'Close',
                versionFootnote: 'Script version: v{version}',
                donateERepublik: 'Donate via eRepublik',
                donateSatoshi: 'Donate via Satoshi (ZBD)'
            },
            buttons: {
                reset: 'Reset',
                info: 'Info',
                donate: 'Donate',
                collapse: 'Collapse',
                expand: 'Expand'
            },
            summary: {
                overallProgress: 'Overall Progress:',
                calculating: 'calculating…',
                timeProgress: 'Time progress:'
            },
            mission: {
                seriesGoal: 'Series Goal (7/7):'
            },
            fallback: {
                noMissions: 'No active missions available.',
                noMissionsDetail: 'The #SPRINGBREAK event may have ended or data is not yet loaded.'
            },
            icons: {
                reset: '⟲',
                progress: '📌',
                warning: '⚠️',
                flag: '🏁'
            }
        },
        LOCALES: {
            en: {
                strings: {} // Default to CONFIG.STRINGS (English)
            }
            // Example for French locale:
            // fr: {
            //     strings: {
            //         modal: {
            //             title: 'Traqueur de Missions #SPRINGBREAK',
            //             aboutTitle: 'À propos de ce script – {title}',
            //             motivationTitle: 'Motivation Personnelle',
            //             motivationText: 'Depuis que le développement officiel d’eRepublik a ralenti...',
            //             closeButton: 'Fermer',
            //             donateERepublik: 'Faire un don via eRepublik',
            //             donateSatoshi: 'Faire un don via Satoshi (ZBD)'
            //         },
            //         buttons: {
            //             reset: 'Réinitialiser',
            //             info: 'Info',
            //             donate: 'Donner',
            //             collapse: 'Réduire',
            //             expand: 'Agrandir'
            //         }
            //     }
            // }
        }
    };

    /**
     * ──────────────────────────────────────────────────────────────────────────────
     * SECTION: LOCALIZATION - LOCALIZATION HELPERS
     * Provides functions to retrieve localized strings.
     * ──────────────────────────────────────────────────────────────────────────────
     */
    /**
     * Gets the current locale based on eRepublik settings or default.
     * @returns {string} Locale code (e.g., 'en')
     */
    function getCurrentLocale() {
        const culture = window.erepublik?.settings?.culture || CONFIG.DEFAULT_LOCALE;
        // Map eRepublik culture to supported locales (e.g., 'en-US' -> 'en')
        return CONFIG.LOCALES[culture] ? culture : CONFIG.DEFAULT_LOCALE;
    }

    /**
     * Retrieves a localized string by key.
     * @param {string} key - Dot-separated key (e.g., 'modal.closeButton')
     * @param {Object} [replacements] - Key-value pairs for dynamic replacements
     * @returns {string} Localized string
     */
    function getLocalizedString(key, replacements = {}) {
        const locale = getCurrentLocale();
        const keys = key.split('.');
        let value = CONFIG.LOCALES[locale].strings;

        // Fall back to default strings if locale-specific not found
        if (!value || Object.keys(value).length === 0) value = CONFIG.STRINGS;

        // Navigate nested keys
        for (const k of keys) {
            value = value[k];
            if (!value) {
                console.warn(`Localization key not found: ${key}`);
                return key; // Return key as fallback
            }
        }

        // Handle arrays (e.g., techStackItems)
        if (Array.isArray(value)) return value;

        // Apply replacements
        let result = value;
        for (const [k, v] of Object.entries(replacements)) {
            result = result.replace(`{${k}}`, v);
        }
        return result;
    }

    /**
     * ──────────────────────────────────────────────────────────────────────────────
     * SECTION: HTML TEMPLATES
     * Defines reusable HTML templates for rendering the UI, using localized strings.
     * ──────────────────────────────────────────────────────────────────────────────
     */
    const Templates = {
        /**
         * Renders a section with a title and content for the info modal.
         * @param {Object} param0 - Section data
         * @param {string} param0.title - Section title
         * @param {string} param0.content - Section content
         * @returns {string} HTML string
         */
        section: ({ title, content }) => `
            <h4>${title}</h4>
            <p>${content}</p>
            <hr class="mt-divider">
        `,
        /**
         * Renders a tech stack item for the info modal.
         * @param {Object} param0 - Tech item data
         * @param {string} param0.name - Technology name
         * @param {string} param0.desc - Description
         * @returns {string} HTML string
         */
        techItem: ({ name, desc }) => `<b>${name}</b>: <i>${desc}></i>`,
        /**
         * Renders a mission header with icon, title, progress percentage, and info button.
         * @param {Object} param0 - Header data
         * @param {string} param0.icon - Icon URL
         * @param {string} param0.title - Mission title
         * @param {number} param0.percent - Progress percentage
         * @param {string} param0.requirement - Mission requirement for tooltip
         * @returns {string} HTML string
         */
        missionHeader: ({ icon, title, percent, requirement }) => {
            const tip = CONFIG.MISSION_TIPS[requirement] || 'No tips available for this mission.';
            const escapedTip = tip.replace(/"/g, '"').replace(/\n/g, ' ');
            const tooltipId = `tooltip-${requirement}-${Math.random().toString(36).slice(2, 10)}`;
            if (CONFIG.DEBUG) {
                console.log(`Mission Header - Requirement: ${requirement}, Tip: ${tip}, Escaped: ${escapedTip}`);
            }
            return `
                <div class="mission-header">
                    <img src="${icon}" class="mission-icon">
                    <strong>${title}</strong>
                    <span class="mission-percent">(${percent.toFixed(1)}%)</span>
                    <img src="${CONFIG.IMAGES.infoSmall}" class="info-icon" data-tooltip="${escapedTip}" data-tooltip-id="${tooltipId}">
                    <span class="tooltip" id="${tooltipId}">
                        ${escapedTip}
                        <button class="tooltip-close">${getLocalizedString('buttons.closeTooltip')}</button>
                    </span>
                </div>
            `;
        },
        /**
         * Renders a mission description.
         * @param {string} desc - Description text
         * @returns {string} HTML string
         */
        missionDescription: (desc) => `<div class="mission-desc">${desc}</div>`,
        /**
         * Renders a mission requirement with daily and series progress.
         * @param {Object} param0 - Requirement data
         * @param {number} param0.done - Current progress
         * @param {string} param0.requirement - Requirement name
         * @param {number} param0.total - Total required
         * @param {number} param0.seriesDone - Series goal progress
         * @param {number} param0.seriesTotal - Series goal total
         * @param {string} param0.seriesObjective - Series goal description
         * @param {number} param0.seriesPercent - Series goal percentage
         * @param {string} param0.stepColour - Color for daily progress
         * @param {string} param0.seriesColour - Color for series progress
         * @returns {string} HTML string
         */
        missionRequirement: ({ done, requirement, total, seriesDone, seriesTotal, seriesObjective, seriesPercent, stepColour, seriesColour }) => `
            <div class="mission-req">
                ${getLocalizedString('icons.progress')} ${requirement}
                <span style="color:${stepColour};font-weight:bold">${done}/${total} (${Math.floor(done / total * 100)}%)</span>
                <br>
                <span class="mission-series">${getLocalizedString('icons.flag')} ${getLocalizedString('mission.seriesGoal')} ${seriesDone}/${seriesTotal} ${seriesObjective}</span>
                <span style="color:${seriesColour};font-weight:bold">(${seriesPercent.toFixed(1)}%)</span>
            </div>
        `,
        /**
         * Renders mission rewards with icons.
         * @param {Array} rewards - Array of reward objects
         * @returns {string} HTML string
         */
        missionReward: (rewards) => `
            <div class="mission-reward">
                <img src="${CONFIG.IMAGES.reward}" class="reward-icon">
                ${rewards.map(r => {
                    const text = `+${r.displayValue} ${mapReward(r.category)}`;
                    return r.category === 'vehicle_blueprint' ?
                        `<img src="${CONFIG.IMAGES.blueprint}" class="reward-icon" title="Blueprint">${text}` : text;
                }).join(', ')}
            </div>
        `,
        /**
         * Renders the info modal with all sections and donation links.
         * @returns {string} HTML string
         */
        infoModal: () => `
            <div class="mt-modal-content">
                <h3>${getLocalizedString('modal.aboutTitle', { title: getLocalizedString('modal.title') })} <span class="version">${getLocalizedString('modal.versionFootnote', { version: CONFIG.VERSION })}</span></h3>
                ${Object.entries(CONFIG.STRINGS.modal)
                    .filter(([k, v]) => k.includes('Title') && !['supportTitle', 'techStackTitle', 'aboutTitle'].includes(k))
                    .map(([k, title]) => Templates.section({
                        title: getLocalizedString(`modal.${k}`, { warning: getLocalizedString('icons.warning') }),
                        content: getLocalizedString(`modal.${k.replace('Title', 'Text')}`)
                    }))
                    .join('')}
                ${Templates.section({
                    title: getLocalizedString('modal.techStackTitle'),
                    content: getLocalizedString('modal.techStackItems').map(Templates.techItem).join('<br>')
                })}
                ${Templates.section({
                    title: getLocalizedString('modal.supportTitle'),
                    content: getLocalizedString('modal.supportText')
                })}
                <ul>
                    <li><img src="${CONFIG.IMAGES.currency}" class="inline-icon"> <a href="${CONFIG.URLS.donate}" target="_blank"><strong>${getLocalizedString('modal.donateERepublik')}</strong></a></li>
                    <li><img src="${CONFIG.IMAGES.satoshi}" class="inline-icon"> <a href="${CONFIG.URLS.satoshi}"><strong>${getLocalizedString('modal.donateSatoshi')}</strong></a></li>
                </ul>
                <p>${getLocalizedString('modal.footerFeedback', { contact: CONFIG.URLS.contact })}</p>
                <hr>
                <p>${getLocalizedString('modal.footerSincerely')},<br><strong><a href="${CONFIG.URLS.profile}" target="_blank">${getLocalizedString('modal.footerAuthor')}</a></strong></p>
                <button id="mt-close-info">${getLocalizedString('modal.closeButton')}</button>
            </div>
        `,
        /**
         * Renders the panel header with title and control buttons.
         * @returns {string} HTML string
         */
        header: () => `
            <div class="mt-title-container">
                <img src="${CONFIG.IMAGES.title}" class="mt-title-icon">
                <span class="mt-title-text">${getLocalizedString('modal.title')}</span>
            </div>
            <div class="mt-button-container">
                <button id="mt-reset" class="mt-button" data-tooltip="${getLocalizedString('buttons.reset')}"><img src="${CONFIG.IMAGES.reset}" class="mt-button-icon"></button>
                <button id="mt-info" class="mt-button" data-tooltip="${getLocalizedString('buttons.info')}"><img src="${CONFIG.IMAGES.info}" class="mt-button-icon"></button>
                <button id="mt-donate" class="mt-button" data-tooltip="${getLocalizedString('buttons.donate')}"><img src="${CONFIG.IMAGES.donate}" class="mt-button-icon"></button>
                <button id="mt-toggle" class="mt-toggle-button" data-tooltip="${getLocalizedString('buttons.collapse')}">–</button>
            </div>
        `,
        /**
         * Renders the summary section with event time progress and overall progress tooltip.
         * @param {Object} param0 - Summary data
         * @param {number} param0.dayIndex - Current event day
         * @param {number} param0.totalDays - Total event days
         * @param {string} param0.timeText - Time of day text
         * @param {string} param0.dayPct - Time progress percentage
         * @param {string} param0.color - Progress color
         * @param {string} param0.fontSize - Font size
         * @returns {string} HTML string
         */
        summary: ({ dayIndex, totalDays, timeText, dayPct, color, fontSize }) => {
            const overallTip = (CONFIG.MISSION_TIPS.overall || 'No tips available.').replace(/"/g, '"').replace(/\n/g, ' ');
            const tooltipId = `tooltip-overall-${Math.random().toString(36).slice(2, 10)}`;
            return `
                <div id="mt-overall">
                    <strong>${getLocalizedString('summary.overallProgress')}</strong> ${getLocalizedString('summary.calculating')}
                    <img src="${CONFIG.IMAGES.infoSmall}" class="info-icon" data-tooltip="${overallTip}" data-tooltip-id="${tooltipId}">
                    <span class="tooltip" id="${tooltipId}">
                        ${overallTip}
                        <button class="tooltip-close">${getLocalizedString('buttons.closeTooltip')}</button>
                    </span>
                </div>
                <div style="font-size:${fontSize}; color:${color}">
                    <strong>${getLocalizedString('summary.timeProgress')}</strong> Day ${dayIndex}/${totalDays}${timeText} (${dayPct}%)
                </div>
            `;
        },
        /**
         * Renders a fallback message when no missions are available.
         * @returns {string} HTML string
         */
        noMissions: () => `
            <div class="mt-no-missions" style="padding: 8px; color: ${CONFIG.COLORS.WARN}; font-size: ${CONFIG.FONTS.base};">
                <strong>${getLocalizedString('fallback.noMissions')}</strong> ${getLocalizedString('fallback.noMissionsDetail')}
            </div>
        `
    };

    /**
     * ──────────────────────────────────────────────────────────────────────────────
     * SECTION: STYLES
     * Defines CSS styles for the panel, header, modal, mission boxes, and tooltips.
     * Managed by StyleManager to prevent duplicate injections.
     * ──────────────────────────────────────────────────────────────────────────────
     */
    const STYLES = {
        panel: `
            #mission-tracker-panel {
                position: fixed;
                top: ${CONFIG.POSITIONS.reset.top};
                left: ${CONFIG.POSITIONS.reset.left};
                width: 400px;
                max-height: 100vh;
                background: rgba(30,30,30,0.85);
                color: ${CONFIG.COLORS.SURFACE};
                font-size: ${CONFIG.FONTS.base};
                z-index: 99999;
                border: 1px solid #444;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0,0,0,0.8);
            }
        `,
        header: `
            #mt-header {
                background: rgba(51,51,51,0.9);
                padding: 6px 10px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
                user-select: none;
                touch-action: none;
            }

            .mt-title-container { display: flex; align-items: center; font-size: ${CONFIG.FONTS.title}; }
            .mt-title-icon { width: 20px; height: 20px; margin-right: 6px; }
            .mt-title-text { font-weight: bold; }
            .mt-button-container { display: flex; align-items: center; position: relative; }
            .mt-button { background: none; border: none; margin-right: 6px; cursor: pointer; padding: 0; position: relative; }
            .mt-button-icon { width: 16px; height: 16px; vertical-align: middle; }
            .mt-toggle-button { background: none; border: none; color: ${CONFIG.COLORS.SURFACE}; font-size: 16px; cursor: pointer; padding: 0; position: relative; }
            [data-tooltip] { position: relative; }
            .mt-button:hover:after, .mt-toggle-button:hover:after {
                content: attr(data-tooltip);
                position: absolute;
                top: 30px;
                left: 50%;
                transform: translateX(-50%);
                background: ${CONFIG.COLORS.SURFACE};
                color: ${CONFIG.COLORS.DIVIDER};
                padding: 5px 10px;
                border-radius: 4px;
                font-size: ${CONFIG.FONTS.tiny};
                white-space: nowrap;
                z-index: 100000;
                text-align: center;
            }
        `,
        infoModal: `
            #mt-info-modal {
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                background: rgba(255, 255, 255, 0.95); border: 1px solid ${CONFIG.COLORS.MUTED};
                border-radius: 8px; padding: 15px; max-width: 500px; z-index: 11000;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); font-family: Arial, sans-serif;
                font-size: ${CONFIG.FONTS.base}; color: ${CONFIG.COLORS.DIVIDER}; line-height: 1.25em;
                overflow-y: auto; max-height: 80vh;
            }
            .mt-modal-content h3 { margin: 0 0 0.1em; font-size: 1em; overflow: hidden; }
            .mt-modal-content .version { font-size: ${CONFIG.FONTS.tiny}; color: ${CONFIG.COLORS.DIVIDER}; float: right; margin-right: 5px; }
            .mt-modal-content h4 { margin: 0.5em 0 0; font-size: ${CONFIG.FONTS.small}; }
            .mt-modal-content hr { margin: 3px 0; border: none; border-top: 1px solid ${CONFIG.COLORS.MUTED}; }
            .mt-modal-content p { margin: 0.25em 0; }
            .mt-modal-content ul { padding-left: 20px; margin: 0.5em 0; }
            .mt-modal-content li { margin-bottom: 0.25em; }
            .mt-modal-content button {
                margin-top: 10px; padding: 5px 10px; border: none; cursor: pointer;
                background: ${CONFIG.COLORS.DIVIDER}; color: ${CONFIG.COLORS.SURFACE}; border-radius: 4px;
                font-size: ${CONFIG.FONTS.base};
            }
            .inline-icon { height: 10px; vertical-align: text-bottom; }
            .mt-modal-content .info-icon { width: 12px; height: 12px; margin-left: 6px; vertical-align: middle; cursor: help; position: relative; }
            .mt-modal-content [data-tooltip]:hover:after {
                content: attr(data-tooltip);
                position: absolute;
                top: 16px;
                left: 50%;
                transform: translateX(-50%);
                background: ${CONFIG.COLORS.SURFACE};
                color: ${CONFIG.COLORS.DIVIDER};
                padding: 5px 10px;
                border-radius: 4px;
                font-size: ${CONFIG.FONTS.tiny};
                white-space: normal;
                max-width: 300px;
                z-index: 100000;
                text-align: center;
                display: block !important;
                visibility: visible !important;
            }
        `,
        missions: `
            .mission-header { display: flex; align-items: center; padding-left: 8px; font-size: ${CONFIG.FONTS.base}; }
            .mission-icon { width: 20px; height: 20px; margin-right: 6px; vertical-align: middle; }
            .mission-percent { color: ${CONFIG.COLORS.TEXT}; font-size: ${CONFIG.FONTS.small}; margin-left: 4px; }
            .mission-desc { padding-left: 16px; font-size: ${CONFIG.FONTS.small}; font-style: italic; color: ${CONFIG.COLORS.MUTED}; margin: 4px 0; }
            .mission-req { padding-left: 16px; font-size: ${CONFIG.FONTS.base}; }
            .mission-series { font-size: ${CONFIG.FONTS.small}; color: ${CONFIG.COLORS.MUTED}; }
            .mission-reward { padding-left: 16px; font-size: ${CONFIG.FONTS.base}; margin-top: 6px; }
            .reward-icon { width: 16px; height: 16px; vertical-align: middle; margin-right: 4px; }
            .mission-box .mission-header .info-icon {
                width: 16px; height: 16px; margin-left: 6px; vertical-align: middle; cursor: pointer; position: relative; pointer-events: all; display: inline-block; padding: 8px;
            }

            .mission-box .tooltip {
                display: none; position: absolute; top: 16px; left: 0; transform: none;
                background: ${CONFIG.COLORS.SURFACE}; color: ${CONFIG.COLORS.DIVIDER};
                padding: 5px 10px; border-radius: 4px; font-size: ${CONFIG.FONTS.tiny};
                white-space: normal; max-width: 300px; width: max-content; z-index: 999999; text-align: left;
                pointer-events: none; box-shadow: 0 2px 4px rgba(0,0,0,0.2); transition: opacity 0.1s ease;
            }

            .mission-box .tooltip-close {
                position: absolute; top: 5px; right: 5px; background: ${CONFIG.COLORS.DIVIDER}; color: ${CONFIG.COLORS.SURFACE};
                border: none; border-radius: 50%; width: 20px; height: 20px; line-height: 20px; text-align: center; cursor: pointer;
                font-size: ${CONFIG.FONTS.tiny}; padding: 0;
            }
            .mission-box .info-icon:hover + .tooltip, .mission-box .info-icon.active + .tooltip {
                display: block; opacity: 1; pointer-events: auto;
            }
        `,
         misc: `
             .mt-divider { border: none; border-top: ${CONFIG.BORDERS.DIVIDER}; margin: 2px 0; }
             .mt-summary {
                 padding: 8px; margin-bottom: 12px; background: rgba(43, 43, 43, 0.9); border-radius: 4px;
                 font-size: ${CONFIG.FONTS.base}; line-height: 1.2em;
             }
             .mt-summary .info-icon {
                 width: 12px; height: 12px; margin-left: 6px; vertical-align: -2px; cursor: pointer;
                 position: relative; display: inline-block; pointer-events: all; padding: 8px;
             }
             .mt-summary .tooltip {
                 position: absolute; top: 16px; left: 50px; transform: none;
                 background: ${CONFIG.COLORS.SURFACE}; color: ${CONFIG.COLORS.DIVIDER};
                 padding: 5px 10px; border-radius: 4px; font-size: ${CONFIG.FONTS.tiny};
                 white-space: normal; max-width: 320px; width: max-content; z-index: 999999; text-align: left;
                 box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                 visibility: hidden; opacity: 0; will-change: opacity, visibility;
                 transition: opacity 0.1s ease 0.05s, visibility 0.1s ease 0.05s;
                 pointer-events: none;
             }
             .mt-summary .tooltip-close {
                 position: absolute; top: 5px; right: 5px; background: ${CONFIG.COLORS.DIVIDER}; color: ${CONFIG.COLORS.SURFACE};
                 border: none; border-radius: 50%; width: 20px; height: 20px; line-height: 20px; text-align: center; cursor: pointer;
                 font-size: ${CONFIG.FONTS.tiny}; padding: 0;
             }
             .mt-summary .info-icon:hover + .tooltip {
                 visibility: visible; opacity: 1; pointer-events: auto;
             }
             .mt-summary .info-icon.active + .tooltip {
                 visibility: visible; opacity: 1; pointer-events: auto;
             }
         `
    };

    /**
     * ──────────────────────────────────────────────────────────────────────────────
     * SECTION: STYLE MANAGER
     * Manages CSS injection to prevent duplicates and ensure consistent styling.
     * ──────────────────────────────────────────────────────────────────────────────
     */
    const StyleManager = {
        injected: new Set(),
        /**
         * Injects a named CSS block into the page.
         * @param {string} name - Unique identifier for the style
         * @param {string} cssText - CSS content
         */
        inject(name, cssText) {
            if (this.injected.has(name)) return;
            const style = document.createElement('style');
            style.textContent = cssText;
            style.setAttribute('data-style-name', name);
            document.head.appendChild(style);
            this.injected.add(name);
        },
        /**
         * Injects all styles from an object.
         * @param {Object} styles - Object with style names and CSS content
         */
        injectAll(styles) {
            Object.entries(styles).forEach(([name, cssText]) => this.inject(name, cssText));
        }
    };

    StyleManager.injectAll(STYLES);

    /**
     * ──────────────────────────────────────────────────────────────────────────────
     * SECTION: UTILITY FUNCTIONS
     * Provides helper functions for DOM manipulation, timing, and data processing.
     * ──────────────────────────────────────────────────────────────────────────────
     */
    /**
     * Converts an HTML string to a div element.
     * @param {string} html - HTML content
     * @returns {HTMLDivElement} Div element with the HTML content
     */
    function htmlToDiv(html) {
        const div = document.createElement('div');
        div.innerHTML = html.trim();
        return div;
    }

    /**
     * Waits for a condition to be true, polling at intervals.
     * @param {Function} conditionFn - Function returning a truthy value when ready
     * @param {number} [interval=CONFIG.POLL_INTERVAL_MS] - Polling interval (ms)
     * @param {number} [timeout=CONFIG.MAX_WAIT_TIME_MS] - Timeout (ms)
     * @returns {Promise} Resolves with the condition result or rejects on timeout/error
     */
    function waitFor(conditionFn, interval = CONFIG.POLL_INTERVAL_MS, timeout = CONFIG.MAX_WAIT_TIME_MS) {
        return new Promise((resolve, reject) => {
            const intervalId = setInterval(() => {
                try {
                    const result = conditionFn();
                    if (result) {
                        clearInterval(intervalId);
                        clearTimeout(timeoutHandle);
                        resolve(result);
                    }
                } catch (e) {
                    clearInterval(intervalId);
                    clearTimeout(timeoutHandle);
                    reject(e);
                }
            }, interval);
            const timeoutHandle = setTimeout(() => {
                clearInterval(intervalId);
                reject(new Error('Timeout waiting for condition'));
            }, timeout);
        });
    }

    /**
     * Extracts server time from script tags containing SERVER_DATA.
     * @returns {Object|null} Server time object or null if not found
     */
    function getServerTimeFromScriptTag() {
        const scripts = document.querySelectorAll('script');
        for (let script of scripts) {
            if (script.textContent.includes('SERVER_DATA') && script.textContent.includes('serverTime')) {
                const match = script.textContent.match(/SERVER_DATA\s*=\s*({.*?})\s*[,;]\s*ErpkShop/s);
                if (match && match[1]) {
                    try {
                        return JSON.parse(match[1]).serverTime || null;
                    } catch (e) {
                        console.error("SERVER_DATA JSON parsing failed", e);
                    }
                }
            }
        }
        return null;
    }

    /**
     * Calculates event progress based on server time and event duration.
     * @param {number} startDay - Event start day
     * @param {number} currentDay - Current day
     * @param {Object} serverTimeObj - Server time object
     * @param {number} totalDays - Total event days
     * @returns {Object} Progress data with fractional progress, hours, and minutes
     */
    function getEventProgressFromServer(startDay, currentDay, serverTimeObj, totalDays) {
        const minutesInDay = 24 * 60;
        const hours = serverTimeObj.hour;
        const minutes = new Date(serverTimeObj.dateTime).getMinutes();
        const timeFraction = (hours * 60 + minutes) / minutesInDay;
        const daysPassed = currentDay - startDay;
        const totalProgress = daysPassed + timeFraction;
        const fractionalProgress = Math.min(1, totalProgress / totalDays);
        return { fractionalProgress, hours, minutes };
    }

    /**
     * Parses step progress from mission title (e.g., "1/2").
     * @param {string} title - Mission title
     * @returns {Object} Current and total steps
     */
    function parseStepsFromTitle(title) {
        const stepMatch = (title || '').match(/(\d+)\s*\/\s*(\d+)/);
        return stepMatch ? {
            currentStep: parseInt(stepMatch[1], 10),
            totalSteps: parseInt(stepMatch[2], 10)
        } : { currentStep: 1, totalSteps: 1 };
    }

    /**
     * Maps reward categories to display names.
     * @param {string} category - Reward category
     * @returns {string} Display name
     */
    function mapReward(category) {
        return {
            springBreakTokens: 'Springcoins',
            spring_break_tokens: 'Springcoins',
            gold: 'Gold',
            currency: 'Currency',
            vehicle_blueprint: 'Blueprint'
        }[category] || category;
    }

    /**
     * ──────────────────────────────────────────────────────────────────────────────
     * SECTION: UTILITY FUNCTIONS
     * ──────────────────────────────────────────────────────────────────────────────
     */

    /**
     * Position a tooltip just outside the mission-tracker panel.
     * By default 1px to the right of the panel; if not enough space, 1px to the left.
     * Assumes tooltip is absolutely positioned relative to #mission-tracker-panel.
     */

    function positionTooltipOutsidePanel(tooltip, panel = document.getElementById('mission-tracker-panel')) {
        const panelRect = panel.getBoundingClientRect();
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const tooltipRect = tooltip.getBoundingClientRect();

        // Try positioning to the right
        let left = panelRect.width + 10;
        if (panelRect.right + tooltipRect.width + 10 > screenWidth) {
            // Flip to the left if not enough space
            left = -tooltipRect.width - 10;
        }

        // Ensure tooltip stays within vertical bounds
        let top = 20;
        if (panelRect.top + top + tooltipRect.height > screenHeight) {
            top = screenHeight - panelRect.top - tooltipRect.height - 10;
        } else if (panelRect.top + top < 0) {
            top = -panelRect.top + 10;
        }

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
    }

   /**
    * ──────────────────────────────────────────────────────────────────────────────
    * SECTION: TOOLTIP MANAGER
    * ──────────────────────────────────────────────────────────────────────────────
    */
    const TooltipManager = {
        activeTooltip: null,
        eventListeners: new Map(),
        init(icon, tooltip) {
            // Remove existing listeners by cloning the icon
            const newIcon = icon.cloneNode(true);
            icon.replaceWith(newIcon);

            const tooltipId = newIcon.getAttribute('data-tooltip-id');
            const showTooltip = (e) => {
                e.stopPropagation();
                if (this.activeTooltip && this.activeTooltip !== tooltip) {
                    this.activeTooltip.classList.remove('active');
                    this.activeTooltip.style.visibility = 'hidden';
                    this.activeTooltip.style.opacity = '0';
                }
                positionTooltipOutsidePanel(tooltip);
                tooltip.style.visibility = 'visible';
                tooltip.style.opacity = '1';
                tooltip.classList.add('active');
                newIcon.classList.add('active');
                this.activeTooltip = tooltip;
            };

            const hideTooltip = (e) => {
                if (e) e.stopPropagation();
                tooltip.style.visibility = 'hidden';
                tooltip.style.opacity = '0';
                tooltip.classList.remove('active');
                newIcon.classList.remove('active');
                if (this.activeTooltip === tooltip) this.activeTooltip = null;
            };

            // Mouse events
            const onMouseEnter = () => showTooltip(new Event('mouseenter'));
            const onMouseLeave = () => hideTooltip();
            newIcon.addEventListener('mouseenter', onMouseEnter);
            newIcon.addEventListener('mouseleave', onMouseLeave);

            // Touch/click events
            const onClick = (e) => {
                e.preventDefault();
                if (tooltip.classList.contains('active')) {
                    hideTooltip(e);
                } else {
                    showTooltip(e);
                }
            };
            newIcon.addEventListener('click', onClick);

            // Close button
            const closeButton = tooltip.querySelector('.tooltip-close');
            if (closeButton) {
                const onCloseClick = (e) => {
                    e.preventDefault();
                    hideTooltip(e);
                };
                closeButton.addEventListener('click', onCloseClick);
                this.eventListeners.set(closeButton, [{ event: 'click', handler: onCloseClick }]);
            }

            // Click outside to close
            const onOutsideClick = (e) => {
                if (!tooltip.contains(e.target) && !newIcon.contains(e.target) && tooltip.classList.contains('active')) {
                    hideTooltip(e);
                }
            };
            document.addEventListener('click', onOutsideClick);

            // Store listeners for cleanup
            this.eventListeners.set(newIcon, [
                { event: 'mouseenter', handler: onMouseEnter },
                { event: 'mouseleave', handler: onMouseLeave },
                { event: 'click', handler: onClick }
            ]);
            this.eventListeners.set(document, [
                ...(this.eventListeners.get(document) || []),
                { event: 'click', handler: onOutsideClick }
            ]);

            return { icon: newIcon, tooltip };
        },
        cleanup() {
            this.eventListeners.forEach((listeners, element) => {
                listeners.forEach(({ event, handler }) => {
                    element.removeEventListener(event, handler);
                });
            });
            this.eventListeners.clear();
            this.activeTooltip = null;
            document.querySelectorAll('.tooltip').forEach(tooltip => {
                tooltip.style.visibility = 'hidden';
                tooltip.style.opacity = '0';
                tooltip.classList.remove('active');
            });
        }
    };

    /**
     * ──────────────────────────────────────────────────────────────────────────────
     * SECTION: DRAGGABLE FUNCTIONALITY
     * Enables dragging the panel and saves its position to localStorage.
     * ──────────────────────────────────────────────────────────────────────────────
     */
    /**
     * Makes a panel draggable using a handle element.
     * @param {HTMLElement} panel - Panel element
     * @param {HTMLElement} handle - Handle element for dragging
     */
    function makeDraggable(panel, handle) {
        handle.style.cursor = 'move';
        let sx, sy, px, py;
        let isDragging = false;

        // Validate and apply saved position only if not recently reset
        const savedPosition = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (savedPosition && !panel.dataset.resetTriggered) {
            try {
                const { top, left } = JSON.parse(savedPosition);
                // Ensure values are valid numbers with 'px' units
                const topValue = parseFloat(top);
                const leftValue = parseFloat(left);
                if (!isNaN(topValue) && !isNaN(leftValue)) {
                    // Boundary check: ensure panel is within viewport
                    const boundedTop = Math.max(0, Math.min(topValue, window.innerHeight - 46)); // 46px = header height
                    const boundedLeft = Math.max(0, Math.min(leftValue, window.innerWidth - 400)); // 400px = panel width
                    panel.style.top = `${boundedTop}px`;
                    panel.style.left = `${boundedLeft}px`;
                    if (CONFIG.DEBUG) {
                        console.log(`[MissionTracker] Applied saved position: top=${panel.style.top}, left=${panel.style.left}`);
                    }
                } else {
                    throw new Error('Invalid position values');
                }
            } catch (e) {
                console.warn('[MissionTracker] Invalid saved position, using defaults', e);
                panel.style.top = CONFIG.POSITIONS.reset.top;
                panel.style.left = CONFIG.POSITIONS.reset.left;
            }
        } else {
            panel.style.top = CONFIG.POSITIONS.reset.top;
            panel.style.left = CONFIG.POSITIONS.reset.left;
            if (CONFIG.DEBUG) {
                console.log(`[MissionTracker] Set default position: top=${panel.style.top}, left=${panel.style.left}`);
            }
        }

        // Clear reset flag after applying position
        panel.dataset.resetTriggered = '';

        function startDrag(e) {
            // Prevent dragging if clicking buttons
            if (e.target.closest('.mt-button, .mt-toggle-button')) return;
            e.preventDefault();
            isDragging = true;
            sx = e.clientX || (e.touches && e.touches[0].clientX);
            sy = e.clientY || (e.touches && e.touches[0].clientY);
            px = panel.offsetLeft;
            py = panel.offsetTop;

            // Prevent touch scrolling
            if (e.type === 'touchstart') {
                document.body.style.overflow = 'hidden';
            }
        }

        function onMove(e) {
            if (!isDragging) return;
            e.preventDefault();
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);
            let newLeft = px + (clientX - sx);
            let newTop = py + (clientY - sy);

            newTop = Math.max(0, Math.min(newTop, window.innerHeight - 46));
            newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - 400));

            panel.style.left = `${newLeft}px`;
            panel.style.top = `${newTop}px`;

            if (CONFIG.DEBUG) {
                console.log(`[MissionTracker] Dragging: top=${panel.style.top}, left=${panel.style.left}`);
            }
        }

        function onEnd(e) {
            if (!isDragging) return;
            e.preventDefault();
            isDragging = false;
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({
                top: panel.style.top,
                left: panel.style.left
            }));
            if (CONFIG.DEBUG) {
                console.log(`[MissionTracker] Saved position: top=${panel.style.top}, left=${panel.style.left}`);
            }
            // Re-enable scrolling
            document.body.style.overflow = '';
        }

        // Mouse events
        handle.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onEnd, { once: false });

        // Touch events
        handle.addEventListener('touchstart', startDrag, { passive: false });
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('touchend', onEnd, { passive: false });

        // Store cleanup function
        panel.dataset.dragCleanup = JSON.stringify({
            mouse: [
                { element: handle, event: 'mousedown', handler: startDrag },
                { element: document, event: 'mousemove', handler: onMove },
                { element: document, event: 'mouseup', handler: onEnd }
            ],
            touch: [
                { element: handle, event: 'touchstart', handler: startDrag },
                { element: document, event: 'touchmove', handler: onMove },
                { element: document, event: 'touchend', handler: onEnd }
            ]
        });
    }

    /**
     * ──────────────────────────────────────────────────────────────────────────────
     * SECTION: DATA FETCHING
     * Handles fetching mission data from eRepublik’s API with error handling.
     * ──────────────────────────────────────────────────────────────────────────────
     */
    /**
     * Waits for mission data to be available in window.missionsJSON.
     * @returns {Promise<Array>} Array of mission objects
     */
    function waitForMissionsData() {
        return waitFor(() => Array.isArray(window.missionsJSON) && window.missionsJSON.length ? window.missionsJSON.slice() : null);
    }

    /**
     * Fetches detailed mission data for a single mission.
     * @param {Object} mission - Mission object
     * @param {string} culture - User’s culture setting
     * @param {string} token - CSRF token
     * @param {string} host - eRepublik hostname
     * @returns {Promise<Object>} Updated mission object
     */
    async function fetchMission(mission, culture, token, host) {
        try {
            const url = `${location.protocol}//${host}/${culture}/main/mission-check?missionId=${mission.id}&_token=${token}`;
            const res = await fetch(url, { credentials: 'same-origin' });
            const json = await res.json();
            if (Array.isArray(json.conditions)) mission.liveConditions = json.conditions;
            if (Array.isArray(json.rewards)) mission.rewards = json.rewards;
        } catch (e) {
            console.error(`fetchMission (ID: ${mission.id})`, e);
        }
        return mission;
    }

    /**
     * Fetches detailed data for all missions with delays to avoid rate limiting.
     * @param {string} culture - User’s culture setting
     * @param {string} token - CSRF token
     * @param {string} host - eRepublik hostname
     * @returns {Promise<Array>} Array of detailed mission objects
     */
    async function fetchDetailedMissions(culture, token, host) {
        try {
            const missions = await waitForMissionsData();
            const detailedMissions = [];
            for (let mission of missions) {
                detailedMissions.push(await fetchMission(mission, culture, token, host));
                await new Promise(resolve => setTimeout(resolve, CONFIG.FETCH_DELAY_MS));
            }
            return detailedMissions;
        } catch (e) {
            console.error('fetchDetailedMissions', e);
            return [];
        }
    }

    /**
     * ──────────────────────────────────────────────────────────────────────────────
     * SECTION: GUI RENDERERS
     * Renders the panel, mission boxes, and info modal with event listeners.
     * ──────────────────────────────────────────────────────────────────────────────
     */
    /**
     * Displays the info modal with script details and donation links.
     */
    function showInfoModal() {
        let modal = document.getElementById('mt-info-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'mt-info-modal';
            modal.innerHTML = Templates.infoModal();
            document.body.appendChild(modal);
            modal.querySelector('#mt-close-info').onclick = () => modal.remove();
        }
    }

    /**
     * Renders a single mission box with progress and rewards.
     * @param {Object} mission - Mission object
     * @param {number} eventTimeProgress - Event progress percentage
     * @returns {Object} Mission display element and progress percentage
     */
    function renderMissionBox(mission, eventTimeProgress) {
        const { currentStep, totalSteps } = parseStepsFromTitle(mission.title);
        const liveConditionData = (mission.liveConditions || [])[0] || {};
        const [currentStepCount, totalStepsFromCondition] = Array.isArray(liveConditionData.partial) ? liveConditionData.partial : [0, 1];
        const stepFraction = totalStepsFromCondition > 0 ? currentStepCount / totalStepsFromCondition : 0;
        const stepFractionPercent = ((currentStep - 1) + stepFraction) / totalSteps * 100;
        const missionIcon = mission.img.startsWith('//') ? 'https:' + mission.img : mission.img;

        let seriesDone = currentStepCount;
        let seriesTotal = totalStepsFromCondition;
        let seriesObjective = 'unknown objective';
        let seriesPercent = 0;
        const requirement = liveConditionData.requirement || '';
        if (CONFIG.MISSION_OBJECTIVES[requirement]) {
            const objective = CONFIG.MISSION_OBJECTIVES[requirement];
            seriesObjective = objective.title.split(',')[0];
            seriesTotal = objective.total;
            seriesPercent = seriesTotal > 0 ? (seriesDone / seriesTotal * 100) : 0;
        }
        if (!CONFIG.MISSION_OBJECTIVES[requirement] && CONFIG.DEBUG) {
            console.warn(`No mission objective found for requirement: ${requirement}`);
        }

        if (CONFIG.DEBUG) {
            console.log(`Mission ${mission.title} (ID: ${mission.id}) rewards:`, mission.rewards.map(r => ({
                category: r.category,
                displayValue: r.displayValue
            })));
        }

        const safeRewards = Array.isArray(mission.rewards) ? mission.rewards : [];

        const missionDisplayElement = document.createElement('div');
        missionDisplayElement.className = 'mission-box';
        missionDisplayElement.innerHTML =
            Templates.missionHeader({ icon: missionIcon, title: mission.title, percent: stepFractionPercent, requirement }) +
            Templates.missionDescription(mission.description) +
            Templates.missionRequirement({
                done: currentStepCount,
                requirement: liveConditionData.requirement,
                total: totalStepsFromCondition,
                seriesDone, seriesTotal, seriesObjective, seriesPercent,
                stepColour: currentStepCount >= totalStepsFromCondition ? CONFIG.COLORS.OK : CONFIG.COLORS.WARN,
                seriesColour: seriesPercent < eventTimeProgress ? CONFIG.COLORS.SERIOUS_WARN : CONFIG.COLORS.OK
            }) +
            Templates.missionReward(safeRewards) +
            '<hr class="mt-divider">';

        // Add event listeners for tooltips
        const infoIcons = missionDisplayElement.querySelectorAll('.info-icon');
        infoIcons.forEach(icon => {
            const tooltip = icon.nextElementSibling;
            if (tooltip && tooltip.classList.contains('tooltip')) {
                TooltipManager.init(icon, tooltip);
            }
        });

        return { missionDisplayElement, stepFractionPercent };
    }

    /**
     * Resets the mission tracker panel to its default position and state.
     * @param {HTMLElement} panel - The panel element
     * @param {HTMLElement} content - The content element
     * @param {HTMLElement} toggleButton - The toggle button element
     */
    function resetPanel(panel, content, toggleButton) {
        // Clear conflicting inline styles
        panel.style.removeProperty('top');
        panel.style.removeProperty('left');
        panel.style.position = 'fixed';

        // Apply reset animation
        panel.classList.add('resetting');
        setTimeout(() => panel.classList.remove('resetting'), 300);

        // Force reset position
        panel.style.top = CONFIG.POSITIONS.reset.top; // '60px'
        panel.style.left = CONFIG.POSITIONS.reset.left; // '20px'

        // Reset content and state
        content.style.display = 'block';
        panel.style.height = 'auto';
        toggleButton.textContent = '–';
        toggleButton.setAttribute('data-tooltip', getLocalizedString('buttons.collapse'));

        // Clear localStorage and set state
        localStorage.removeItem(CONFIG.STORAGE_KEY);
        localStorage.setItem(CONFIG.STATE_KEY, 'open');

        // Cleanup event listeners
        try {
            const cleanupData = panel.dataset.dragCleanup ? JSON.parse(panel.dataset.dragCleanup) : {};
            ['mouse', 'touch'].forEach(type => {
                if (cleanupData[type]) {
                    cleanupData[type].forEach(({ element, event, handler }) => {
                        element.removeEventListener(event, handler);
                    });
                }
            });
        } catch (e) {
            console.warn('[MissionTracker] Error cleaning up drag listeners', e);
        }
        TooltipManager.cleanup();

        // Set reset flag to prevent makeDraggable override
        panel.dataset.resetTriggered = 'true';

        if (CONFIG.DEBUG) {
            console.log('[MissionTracker] Panel reset triggered');
            console.log(`[MissionTracker] Applied position: top=${panel.style.top}, left=${panel.style.left}`);
            console.log(`[MissionTracker] Computed style: top=${window.getComputedStyle(panel).top}, left=${window.getComputedStyle(panel).left}`);
            console.log(`[MissionTracker] LocalStorage: ${CONFIG.STORAGE_KEY}=${localStorage.getItem(CONFIG.STORAGE_KEY)}, ${CONFIG.STATE_KEY}=${localStorage.getItem(CONFIG.STATE_KEY)}`);
        }
    }

    /**
     * Creates or retrieves the mission tracker panel with controls.
     * @returns {HTMLElement} Panel element
     */
    function getPanel() {
        let panel = document.getElementById('mission-tracker-panel');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'mission-tracker-panel';

            const header = document.createElement('div');
            header.id = 'mt-header';
            header.innerHTML = Templates.header();
            panel.appendChild(header);

            const content = document.createElement('div');
            content.id = 'mt-content';
            content.style.maxHeight = 'calc(100vh - 46px)';
            content.style.overflowY = 'auto';
            panel.appendChild(content);

            document.body.appendChild(panel);

            const savedState = localStorage.getItem(CONFIG.STATE_KEY);
            const isCollapsed = savedState === 'collapsed';
            content.style.display = isCollapsed ? 'none' : 'block';
            panel.style.height = isCollapsed ? '46px' : 'auto';
            const toggleButton = header.querySelector('#mt-toggle');
            toggleButton.textContent = isCollapsed ? '+' : '–';
            toggleButton.setAttribute('data-tooltip', getLocalizedString(isCollapsed ? 'buttons.expand' : 'buttons.collapse'));

            // Initialize dragging (position set in makeDraggable)
            makeDraggable(panel, header);

            // Toggle button handler
            header.querySelector('#mt-toggle').addEventListener('click', () => {
                content.style.display = content.style.display === 'none' ? 'block' : 'none';
                panel.style.height = content.style.display === 'none' ? '46px' : 'auto';
                toggleButton.textContent = content.style.display === 'none' ? '+' : '–';
                toggleButton.setAttribute('data-tooltip', getLocalizedString(content.style.display === 'none' ? 'buttons.expand' : 'buttons.collapse'));
                localStorage.setItem(CONFIG.STATE_KEY, content.style.display === 'none' ? 'collapsed' : 'open');
                if (CONFIG.DEBUG) {
                    console.log(`[MissionTracker] Toggle state: ${content.style.display === 'none' ? 'collapsed' : 'open'}`);
                }
            });

            // Reset button handler
            header.querySelector('#mt-reset').addEventListener('click', () => {
                resetPanel(panel, content, toggleButton);
                if (CONFIG.DEBUG) {
                    console.log('[MissionTracker] Panel reset via button');
                }
            });

            // Keyboard shortcut for reset (Ctrl+Shift+R)
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === 'R') {
                    e.preventDefault();
                    resetPanel(panel, content, toggleButton);
                    if (CONFIG.DEBUG) {
                        console.log('[MissionTracker] Panel reset via Ctrl+Shift+R');
                    }
                }
            });

            // Double-click on header to reset panel
            header.addEventListener('dblclick', (e) => {
                e.preventDefault();
                resetPanel(panel, content, toggleButton);
                if (CONFIG.DEBUG) {
                    console.log('[MissionTracker] Panel reset via double-click on header');
                }
            });

            header.querySelector('#mt-info').addEventListener('click', showInfoModal);
            header.querySelector('#mt-donate').addEventListener('click', () => window.open(CONFIG.URLS.donate, '_blank'));
        }
        panel.querySelector('#mt-content').innerHTML = '';
        return panel;
    }

    /**
     * Renders the entire mission panel with summary and mission boxes.
     * @param {Array} missions - Array of mission objects
     */
    function renderMissionPanel(missions) {
        const panel = getPanel();
        const content = panel.querySelector('#mt-content');
        let EVENT_TIME_PROGRESS = 0;

        const staticConds = window.missionsJSON ? window.missionsJSON.flatMap(m => m.conditions) : [];
        const days = staticConds.map(txt => {
            const m = txt.match(/Day\s*([\d,]+)/);
            return m ? parseInt(m[1].replace(/,/g,''), 10) : NaN;
        }).filter(d => !isNaN(d));
        const endDay = days.length ? Math.max(...days) : 0;
        const startDay = endDay - CONFIG.EVENT_LENGTH + 1;

        const eDay = window.erepublik?.settings?.eDay || 0;
        const serverTime = getServerTimeFromScriptTag();
        const daysPassed = eDay - startDay + 1;
        const dayIndex = Math.min(CONFIG.EVENT_LENGTH, Math.max(1, daysPassed));

        let dayPct = 'N/A', timeText = '', color = CONFIG.COLORS.MUTED;
        if (serverTime) {
            const { fractionalProgress, hours, minutes } = getEventProgressFromServer(startDay, eDay, serverTime, CONFIG.EVENT_LENGTH);
            EVENT_TIME_PROGRESS = fractionalProgress * 100;
            dayPct = (fractionalProgress * 100).toFixed(2);
            timeText = `, Time ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            color = fractionalProgress > 0.5 ? CONFIG.COLORS.OK : fractionalProgress > 0.25 ? CONFIG.COLORS.WARN : CONFIG.COLORS.MUTED;
        }

        const summary = document.createElement('div');
        summary.className = 'mt-summary';
        summary.innerHTML = Templates.summary({
            dayIndex,
            totalDays: CONFIG.EVENT_LENGTH,
            timeText,
            dayPct,
            color,
            fontSize: CONFIG.FONTS.small
        });
        content.appendChild(summary);

        if (!missions || missions.length === 0) {
            content.innerHTML = Templates.noMissions();
            summary.querySelector('#mt-overall').innerHTML = `<strong>${getLocalizedString('summary.overallProgress')}</strong> N/A`;
            return;
        }

        let sumPct = 0;
        missions.forEach(m => {
            const { missionDisplayElement, stepFractionPercent } = renderMissionBox(m, EVENT_TIME_PROGRESS);
            content.appendChild(missionDisplayElement);
            sumPct += stepFractionPercent;
        });

        if (CONFIG.DEBUG) {
            const mockMission = {
                id: 'mock_1',
                title: 'Test Mission 1/2',
                description: 'Test mission for blueprint rewards.',
                img: CONFIG.IMAGES.title,
                liveConditions: [{ requirement: 'Complete test tasks', partial: [1, 2] }],
                rewards: [
                    { category: 'spring_break_tokens', displayValue: '110' },
                    { category: 'vehicle_blueprint', displayValue: '1' }
                ]
            };
            const { missionDisplayElement: missionDisplayElement, stepFractionPercent: stepFractionPercent } = renderMissionBox(mockMission, EVENT_TIME_PROGRESS);
            content.appendChild(missionDisplayElement);
            sumPct += stepFractionPercent;

            const mockEnergyDeploy = {
                id: 'debug_energy',
                title: 'Make It Count 7/7',
                description: 'You may have to fight a battle more than once to win it - Margaret Thatcher (debug preview)',
                img: CONFIG.IMAGES.title,
                liveConditions: [
                    {
                        requirement: 'EnergyDeployments',
                        partial: [200, 200]
                    }
                ],
                rewards: []
            };
            const { missionDisplayElement: missionDisplayElement2, stepFractionPercent: stepFractionPercent2 } = renderMissionBox(mockEnergyDeploy, EVENT_TIME_PROGRESS);
            content.appendChild(missionDisplayElement2);
            sumPct += stepFractionPercent2;

            const mockTravelDistance = {
                id: 'debug_travel',
                title: 'Travel 7/7',
                description: 'Cross the oceans, span continents, and leave your mark across the world. (debug preview)',
                img: CONFIG.IMAGES.title,
                liveConditions: [
                    {
                        requirement: 'TravelDistance',
                        partial: [2000000, 2000000]
                    }
                ],
                rewards: []
            };
            const { missionDisplayElement: missionDisplayElement3, stepFractionPercent: stepFractionPercent3 } = renderMissionBox(mockTravelDistance, EVENT_TIME_PROGRESS);
            content.appendChild(missionDisplayElement3);
            sumPct += stepFractionPercent3;

            const mockPrestigePoints = {
                id: 'debug_prestigePoints',
                title: 'Strive for Prestige 7/7',
                description: 'It\'s a good week to have a good weekly challenge (debug preview).',
                img: CONFIG.IMAGES.title,
                liveConditions: [
                    {
                        requirement: 'PrestigePoints',
                        partial: [40000, 40000]
                    }
                ],
                rewards: []
            };
            const { missionDisplayElement: missionDisplayElement4, stepFractionPercent: stepFractionPercent4 } = renderMissionBox(mockPrestigePoints, EVENT_TIME_PROGRESS);
            content.appendChild(missionDisplayElement4);
            sumPct += stepFractionPercent4;
        }

        const completedCount = CONFIG.TOTAL_MISSIONS - missions.length;
        const totalPct = sumPct + completedCount * 100;
        const overallTip = (CONFIG.MISSION_TIPS.overall || 'No tips available.').replace(/"/g, '"').replace(/\n/g, ' ');
        const overallTooltipId = 'tooltip-overall';
        const overallHtml = `<strong>${getLocalizedString('summary.overallProgress')}</strong> ${(totalPct / CONFIG.TOTAL_MISSIONS).toFixed(1)}% <img src="${CONFIG.IMAGES.infoSmall}" class="info-icon" data-tooltip="${overallTip}" data-tooltip-id="${overallTooltipId}"><span class="tooltip" id="${overallTooltipId}">${overallTip}</span>`;
        summary.querySelector('#mt-overall').innerHTML = overallHtml;

        // Re-attach event listeners for dynamically updated overall tooltip
        const reattachedIcon = summary.querySelector('#mt-overall .info-icon');
        if (reattachedIcon) {
            let isTooltipVisible = false;
            const tooltip = reattachedIcon.nextElementSibling;

            function showTooltip() {
                if (!isTooltipVisible) {
                    positionTooltipOutsidePanel(tooltip);
                    tooltip.style.visibility = 'visible';
                    tooltip.style.opacity = '1';
                    isTooltipVisible = true;
                }
            }

            function hideTooltip() {
                if (isTooltipVisible && !reattachedIcon.classList.contains('active')) {
                    tooltip.style.visibility = 'hidden';
                    tooltip.style.opacity = '0';
                    isTooltipVisible = false;
                }
            }

            reattachedIcon.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();
                const nowActive = reattachedIcon.classList.toggle('active');
                if (nowActive) showTooltip();
                else hideTooltip();
            });

            tooltip.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();
                reattachedIcon.classList.remove('active');
                hideTooltip();
            });

            reattachedIcon.addEventListener('mouseenter', () => {
                positionTooltipOutsidePanel(tooltip);
                tooltip.style.visibility = 'visible';
                tooltip.style.opacity = '1';
            });
            reattachedIcon.addEventListener('mouseleave', () => {
                if (!reattachedIcon.classList.contains('active')) {
                    tooltip.style.visibility = 'hidden';
                    tooltip.style.opacity = '0';
                }
            });
        }
    }

    /**
     * ──────────────────────────────────────────────────────────────────────────────
     * SECTION: MAIN ENTRYPOINT
     * Initializes the script, fetches mission data, and renders the panel.
     * ──────────────────────────────────────────────────────────────────────────────
     */
    /**
     * Main entry point for the script.
     * Checks prerequisites, fetches mission data, and renders the panel.
     */
    async function main() {
        if (!window.erepublik?.settings || !window.csrfToken) {
            console.warn('[MissionTracker] Missing erepublik settings or CSRF token.');
            return;
        }

        try {
            const culture = window.erepublik.settings.culture;
            const token = window.csrfToken;
            const host = window.erepublik.settings.hostname;
            const detailedMissions = await fetchDetailedMissions(culture, token, host);
            renderMissionPanel(detailedMissions);
            console.log('%c[MissionTracker] Ready', 'color:#6cf;font-weight:bold');
        } catch (err) {
            console.error('[MissionTracker] Error', err);
            renderMissionPanel([]);
        }

        // Expose reset function to console for emergency access
        window.resetMissionTrackerPanel = () => {
            const panel = document.getElementById('mission-tracker-panel');
            if (panel) {
                const content = panel.querySelector('#mt-content');
                const toggleButton = panel.querySelector('#mt-toggle');
                resetPanel(panel, content, toggleButton);
                console.log('[MissionTracker] Panel reset via console command');
            } else {
                console.warn('[MissionTracker] Panel not found');
            }
        };
    }

    main();
})();