// ==UserScript==
// @name         Descriptive Mission Titles
// @namespace    https://github.com/sulsay/torn
// @version      1.4
// @description  Renames (Duke) missions to reflect their main objective
// @author       Sulsay [2173590]
// @match        https://www.torn.com/loader.php?sid=missions
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/384701/Descriptive%20Mission%20Titles.user.js
// @updateURL https://update.greasyfork.org/scripts/384701/Descriptive%20Mission%20Titles.meta.js
// ==/UserScript==

GM_addStyle(`
#missionsMainContainer .giver-tabs a {
    position: relative;
}
#missionsMainContainer .giver-tabs a i.right:not(.mission-timeout-icon) {
    position: absolute;
    left: 0;
    top: .4rem;
}`);

const missionTitles = new Map([
    ['Introduction: Duke', 'Complete 10 Duke contracts'],
    ['Show Some Muscle', 'Attack {name}'],
    ['Battering Ram', 'Attack {name} 3 times'],
    ['New Kid on the Block', 'Defeat any 5 players'],
    ['Against the Odds', 'Defeat 2 {name}'],
    ['A Good Day To Get Hard', 'Achieve a killstreak of 10'],
    ['A Kimpossible Task', 'Defeat {name} using only melee and temp weapons'],
    ['An Honorary Degree', 'Defeat {name} without using any guns'],
    ['A Problem at the Tracks', 'Defeat 3 {name} without using guns'],
    ['Army of One', 'Attack {name} 3 times as normal, with mask, with different mask'],
    ['A Thor Loser', 'Use Duke\'s hammer and hit 15 different body parts'],
    ['Bakeout Breakout', 'Buy a fruitcake, use cake frosting & lock-picking kits from inventory given by Duke, then send special fruitcake to any player in jail. Player does not actually receive the item.'],
    ['Bare Knuckle', 'Defeat {name} with no weapons or armour equipped'],
    ['Batshit Crazy', 'Inflict aprox 17k, 45K damage using Duke\'s Bat'],
    ['Big Tub of Muscle', 'Defeat {name} despite their gargantuan strength'],
    ['Birthday Surprise', 'Obtain afro comb/edvd/laptop, place in empty box, giftwrap, send to Duke'],
    ['Bonnie and Clyde', 'Defeat {name} and their spouse {name}'],
    ['Bountiful', 'Claim 2,3, or 5 bounties'],
    ['Bounty on the Mutiny', 'Bounty {name} and wait for bounty to be fulfilled'],
    ['Candy From Babies', 'Collect $150k or $250k in bounties'],
    ['Charity Work', 'Mug 2 {name}'],
    ['Cracking Up', 'Defeat & Interrogate {name} to find the code for Duke\'s safe'],
    ['Critical Education', 'Achieve 8 critical hits'],
    ['Cut Them Down to Size', 'Defeat someone your level or higher'],
    ['Defeat Duke', 'Defeat Duke within 7 days of activating this mission.'],
    ['Dirty Little Secret', 'Put a bounty on {name}, wait for it to be claimed, attack the person who claimed the bounty'],
    ['Double Jeopardy', 'Put a bounty on someone, then defeat them.'],
    ['Drug Problem', 'Defeat 4-7 {name}'],
    ['Emotional Debt', 'Hit {name} with tear gas or pepper spray'],
    ['Estranged', 'Injure one of {name} legs'],
    ['Family Ties', 'Hospitalize {name} 3 times'],
    ['Field Trip', 'Win $1k, $10k, $100k or 10M on 3 named Casino Games'],
    ['Fireworks', 'Expend 500, 1000, 1500, 2500 rounds of ammo'],
    ['Forgotten Bills', 'Defeat {name}'],
    ['Frenzy', 'Defeat any 5, 7, 11, 11, or 15 players'],
    ['Get Things Jumping', 'Cause 2k, 8k, 30k dmg, receive 1k, 4k, 15k'],
    ['Graffiti', 'Hit {name} with pepper spray'],
    ['Guardian', 'Defeat {name}'],
    ['Hammer Time', 'Defeat {name} using only a hammer'],
    ['Hands Off', 'Defeat 3-5 {name}'],
    ['Hare, Meet Tortoise', 'Defeat {name} despite their lightening fast speed'],
    ['Hide and Seek', 'Defeat correct {name} of 4 players, clues given'],
    ['Hiding in Plain View', 'Travel to (country) and defeat {name}'],
    ['High Fliers', 'Defeat 3 {name} in 3 foreign (country)'],
    ['Hobgoblin', 'Defeat a player of your choice 5 times'],
    ['Immovable Object', 'Defeat {name} despite their impenetrable defense'],
    ['Inside Job', 'Attack someone and secrete the Taser into or onto them'],
    ['Keeping Up Appearances', 'Successfully mug {name} then give everything you mugged back to them.'],
    ['Kiss of Death', 'Defeat {name} and use only the kiss option'],
    ['Lack of Awareness', 'Defeat {name}'],
    ['Lost and Found', 'Put {name} in hospital for 12 hours'],
    ['Loud and Clear', 'Use 5,11 explosive grenades'],
    ['Loyal Customer', 'Defeat {name}'],
    ['Make it Slow', 'Defeat {name} in no fewer than 13 turns in a single attack'],
    ['Marriage Counselling', 'Defeat the spouse of {name}'],
    ['Massacrist', 'Defeat {name}'],
    ['Meeting the Challenge', 'Mug people for a listed total amount.'],
    ['Motivator', 'Lose or stalemate to {name}'],
    ['No Man is an Island', 'Mug at least 2 of 3 {name}'],
    ['No Second Chances', 'Defeat {name} on first attempt'],
    ['Out of the Frying Pan', 'Use Felovax while in jail, Zylkene while in hospital'],
    ['Painleth Dentitht', 'Defeat {name} with a baseball bat'],
    ['Party Tricks', 'Defeat {name} despite their nimble dexterity'],
    ['Pass the Word', 'Send {name} a mail message with keyword included'],
    ['Peak Experience', 'Defeat {name} despite their high level'],
    ['Proof of the Pudding', 'Acquire a named gun, shoot {name} with it, send it to {name}'],
    ['Rabbit Response', 'Defeat 3 {name} within 30 minutes, 20, 20, 15, and 10'],
    ['Reconstruction', 'Equip kitchen knife/leather gloves, defeat {name} then dump both items.'],
    ['Red Faced', 'Defeat {name} using a trout as finishing hit'],
    ['Rising Costs', 'Hit {name} with a brick'],
    ['Rolling in it', 'Mug {name}'],
    ['Safari', 'Travel to South Africa and defeat {name} with a rifle'],
    ['Scammer', 'Defeat {name}'],
    ['Sellout Slayer', 'Buy a gun from item market or bazaar, use gun on any 3, 6 players, sell gun in item market or bazaar'],
    ['Sending a Message', 'Defeat {name}'],
    ['Sleep Aid', 'Defeat {name}'],
    ['Some People', 'Send any item as a parcel to {name}'],
    ['Standard Routine', 'Defeat {name} with a clubbed weapon or fists'],
    ['Stomach Upset', 'Injure {name} stomach'],
    ['Swan Step Too Far', 'Search the dump for any previously owned item and defeat the previous owner'],
    ['The Executive Game', 'Defeat {name} using only fists or kick'],
    ['The Tattoo Artist', 'Defeat {name} using only a slashing weapon'],
    ['Three-Peat', 'Defeat any 3 players by leave 1, mug 1, hosp 1'],
    ['Training Day', 'Spend 250e, 500e, 750e, 1000e, 1250e gym training'],
    ['Tree Huggers', 'Defeat up to 8: {name}, {name}, {name}, {name}, {name}, {name}, {name} and {name}'],
    ['Undercutters', 'Defeat 3: {name}, {name} and {name}'],
    ['Unwanted Attention', 'Hospitalize 4: {name}, {name}, {name} and {name}'],
    ['Withdrawal', 'Injure {name}\'s both arms'],
    ['Wrath of Duke', 'Defeat 3: {name}, {name} and {name}'],
]);
const originalMissionNames = Array.from(missionTitles.keys());

(async function () {
    const missionsContainer = document.getElementById('missionsMainContainer');
    new MutationObserver(() => missionsContainerUpdated()).observe(missionsContainer, {childList: true});
    missionsContainerUpdated();
})();

function missionsContainerUpdated() {
    const missionsList = document.getElementById('giver-tabs');
    const missionListItems = Array.from(missionsList.children);

    for (let missionListItem of missionListItems) {
        const missionDetailsPane = document.getElementById(missionListItem.getAttribute('aria-controls'));
        const targetNames = getMissionTargetNames(missionDetailsPane);

        renameMissionListItem(missionListItem, targetNames);
        renameMissionDetailsTitle(missionDetailsPane, targetNames);
    }
}

function getMissionTargetNames(missionDetailsPane) {
    const profileLinks = missionDetailsPane.querySelectorAll('a[href^="profiles.php?XID="]');
    return Array.from(profileLinks).map(profileLink => profileLink.innerText.trim());
}

function renameMissionListItem(missionListItem, targetNames) {
    const anchor = missionListItem.querySelector('a');
    const originalMissionTitleNode = getOriginalMissionTitleTextNode(anchor);
    replaceMissionTitle(anchor, originalMissionTitleNode, targetNames);
}

function renameMissionDetailsTitle(missionDetailsPane, targetNames) {
    const titleDiv = missionDetailsPane.querySelector('.title-black');
    const originalMissionTitleNode = getOriginalMissionTitleTextNode(titleDiv);
    replaceMissionTitle(titleDiv, originalMissionTitleNode, targetNames);
}

function getOriginalMissionTitleTextNode(context) {
    return Array.from(context.childNodes).find(childNode => {
        if (childNode.nodeType !== Node.TEXT_NODE) {
            return false;
        }
        const textContent = childNode.textContent.trim();
        return textContent.length > 0 && originalMissionNames.includes(textContent);
    }) || null;
}

function replaceMissionTitle(context, originalTitleNode, targetNames) {
    if (originalTitleNode === null) {
        return;
    }

    let replacementTitle = missionTitles.get(originalTitleNode.textContent.trim());
    for (let targetName of targetNames) {
       replacementTitle = replacementTitle.replace('{name}', targetName);
    }

    context.replaceChild(document.createTextNode(replacementTitle), originalTitleNode);
}