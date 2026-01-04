// ==UserScript==
// @name        Gates of Survival - Active Players scraper
// @namespace   https://www.gatesofsurvival.com
// @version     0.11
// @author      dang
// @homepage    https://github.com/dang-nabbit/gos-active-players-scraper
// @description Shows active player data in table format. Based on Opal's Action Scraper: https://greasyfork.org/en/scripts/31091-action-scraper
// @match       https://www.gatesofsurvival.com/game/online.php
// @icon        https://www.google.com/s2/favicons?domain=https://www.gatesofsurvival.com/
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/34689/Gates%20of%20Survival%20-%20Active%20Players%20scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/34689/Gates%20of%20Survival%20-%20Active%20Players%20scraper.meta.js
// ==/UserScript==

// Settings
var summaryShortSkillNames = true; // Turn off if you want full skill names on summary header
var ldLNOnTop = true; // Turn off if you don't want LD/LN to be first clans listed
var italicSkills = ['Agility']; // Make listed skills italic in player list
var boldSkills = ['Not skilling']; // Make listed skills bold in player list
var underlineSkills = ['Fishing']; // Make listed skills underlined in player list
// Settings end

var profileURL = 'https://www.gatesofsurvival.com/game/user2.php?user=';

var errors = [];
var clans = [];
var noClan = {
    initials: 'None',
    players: [],
    skills: []
};
var hardcore = {
    initials: 'HC',
    players: [],
    skills: []
};
var ironman = {
    initials: 'IM',
    players: [],
    skills: []
};
var totals = {
    initials: 'Total',
    players: [],
    skills: []
};
var ld;
var ln;

var playerTypes = [
    'Hardcore Ironman',
    'Ironman'
];
var numPlayerTypes = playerTypes.length;

var skills = [
    {
        name: 'Agility',
        short: 'Agil'
    }, {
        name: 'Arcane',
        short: 'Arcn'
    }, {
        name: 'Archery',
        short: 'Arch'
    }, {
        name: 'Baking',
        short: 'Bakn'
    }, {
        name: 'Botany',
        short: 'Bota'
    }, {
        name: 'Cooking',
        short: 'Cook'
    }, {
        name: 'Crafting',
        short: 'Crft'
    }, {
        name: 'Divination',
        short: 'Divn'
    }, {
        name: 'Exploration',
        short: 'Expl'
    }, {
        name: 'Fighting',
        short: 'Fght'
    }, {
        name: 'Firemaking',
        short: 'Fire'
    }, {
        name: 'Fishing',
        short: 'Fish'
    }, {
        name: 'Fletching',
        short: 'Flet'
    }, {
        name: 'Forestry',
        short: 'Frst'
    }, {
        name: 'Forging',
        short: 'Forg'
    }, {
        name: 'Gathering',
        short: 'Gthr'
    }, {
        name: 'Hunting',
        short: 'Hunt'
    }, {
        name: 'Jewelcrafting',
        short: 'Jwel'
    }, {
        name: 'Looting',
        short: 'Loot'
    }, {
        name: 'Mining',
        short: 'Mini'
    }, {
        name: 'Prayer',
        short: 'Pray'
    }, {
        name: 'Runebinding',
        short: 'Rnbd'
    }, {
        name: 'Skinning',
        short: 'Skin'
    }, {
        name: 'Slaying',
        short: 'Slay'
    }, {
        name: 'Smelting',
        short: 'Smlt'
    }, {
        name: 'Spellcraft',
        short: 'Spll'
    }, {
        name: 'Summoning',
        short: 'Smmn'
    }, {
        name: 'Thieving',
        short: 'Thvn'
    }, {
        name: 'Transmutation',
        short: 'Tran'
    }, {
        name: 'Woodworking',
        short: 'Wood'
    }, {
        name: 'Not skilling',
        short: 'None'
    }
];
var numSkills = skills.length;

function addGlobalStyle(css, head) {
    var style;
    head = head || document.getElementsByTagName('head')[0];
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

function formatPercentage(number) {
    return (number * 100).toFixed(1) + '%';
}

function addClanSkillCount(clan) {
    var skill;

    for (var i = 0; i < numSkills; i++) {
        skill = skills[i];

        clan.skills.push({
            name: skill.name,
            count: 0
        });
    }
}

function scrapePlayer(tdInnerHTML) {
    var mainRegEx = /<img src="images\/crowns\/(.+?)\.png".*?>.*?<input value="(\d+)".*?><input.*?>(.+?)<\/.*?<\/form>.*?\(Last Active: (.+?)\)/;
    var activityRegEx = /<b>Currently<\/b>: (.+?)<br>/;
    var clanRegex = /<b>Clan<\/b>: \[(.+?)\]/;

    var result = mainRegEx.exec(tdInnerHTML);

    var player = {};
    var crown;
    var activityResult;
    var activity;
    var skill;
    var type;
    var clanResult;
    var i;

    if (result === null) {
        return {
            error: 'Player data not recognized',
            content: tdInnerHTML
        };
    } else {
        player = {
            id: result[2],
            name: result[3],
            lastActive: result[4]
        };

        crown = result[1];
        if (crown.indexOf('crown_') > -1) {
            player.rank =  crown.replace('crown_', '');
        } else if (crown === 'sponsor') {
            player.rank = 'Sponsor';
        } else {
            player.rank = 'Unidentified';
        }

        activityResult = activityRegEx.exec(tdInnerHTML);

        if (activityResult !== null) {
            activity = activityResult[1];

            for (i = 0; i < numSkills; i++) {
                skillName = skills[i].name;
                if (activity.indexOf(skillName) > -1) {
                    player.skill = skillName;

                    if (skillName === 'Fighting') {
                        player.mob = activity.replace('Fighting a ', '');
                    }

                    break;
                }
            }
        }
        if (!player.skill) {
            player.skill = 'Not skilling';
            player.activity = activity || 'None';
        }


        for (i = 0; i < numPlayerTypes; i++) {
            type = playerTypes[i];
            if (tdInnerHTML.indexOf(type) > -1) {
                player.type = type;
                break;
            }
        }

        clanResult = clanRegex.exec(tdInnerHTML);
        if (clanResult !== null) {
            player.clan = clanResult[1];
        }
    }

    return player;
}

function addPlayerToList(td) {
    var player = scrapePlayer(td.innerHTML);
    var playerClan = player.clan;
    var playerType = player.type;
    var clan = {};
    var skill;
    var skillObj;

    if (player.error) {
        errors.push(player);
    } else if (playerClan) {
        clan = clans.find(function(clan) {return clan.initials === playerClan;});
        if (!clan) {
            clan = {
                initials: playerClan,
                players: [],
                skills: []
            };

            addClanSkillCount(clan);

            if (['LD', 'LN'].indexOf(playerClan) > -1) {
                if (playerClan === 'LD') {
                    ld = clan;
                } else if (playerClan === 'LN') {
                    ln = clan;
                }

                if (ldLNOnTop) {
                    clans.splice(0, 0, clan);
                }
            } else {
                clans.push(clan);
            }
        }
    } else if (playerType === 'Hardcore Ironman') {
        clan = hardcore;
    } else if (playerType === 'Ironman') {
        clan = ironman;
    } else {
        clan = noClan;
    }

    skillObj = clan.skills.find(function(skill) {return skill.name === player.skill;});
    skillObj.count++;
    skillObj = totals.skills.find(function(skill) {return skill.name === player.skill;});
    skillObj.count++;

    clan.players.push(player);
    totals.players.push(player);
}

function scrapeAll() {
    document.querySelectorAll('#third-container5 td').forEach(addPlayerToList);
}

function getErrorsTable() {
    var numErrors = errors.length;
    var div = document.createElement('div');

    if (numErrors > 0) {
        var title = document.createElement('b');
        title.appendChild(document.createTextNode('Errors'));
        div.appendChild(title);

        var table = document.createElement('table');
        div.appendChild(table);

        div.appendChild(document.createElement('hr'));

        var row = table.insertRow();
        var errorCell = row.insertCell();
        errorCell.outerHTML = '<th>Error</th>';
        var errorContentCell = row.insertCell();
        errorContentCell.outerHTML = '<th>Content</th>';

        var error;
        for (var i = 0; i < numErrors; i++) {
            error = errors[i];

            row = table.insertRow();

            errorCell = row.insertCell();
            errorCell.appendChild(document.createTextNode(error.error || ''));

            errorContentCell = row.insertCell();
            errorContentCell.appendChild(document.createTextNode(error.content || ''));
        }
    }

    return div;
}

function getPlayerTable(clan) {
    var players = clan.players;
    var numPlayers = players.length;
    var div = document.createElement('div');

    if (numPlayers > 0) {
        var title = document.createElement('b');
        title.appendChild(document.createTextNode(clan.initials));
        div.appendChild(title);

        var table = document.createElement('table');
        div.appendChild(table);

        div.appendChild(document.createElement('hr'));

        var row = table.insertRow();
        var nameCell = row.insertCell();
        nameCell.outerHTML = '<th>Name</th>';
        var idCell = row.insertCell();
        idCell.outerHTML = '<th>ID</th>';

        var lastActiveCell = row.insertCell();
        lastActiveCell.outerHTML = '<th>Last active</th>';
        var rankCell = row.insertCell();
        rankCell.outerHTML = '<th>Rank</th>';
        var skillCell = row.insertCell();
        skillCell.outerHTML = '<th>Skill</th>';
        var mobCell = row.insertCell();
        mobCell.outerHTML = '<th>Enemy</th>';
        var activityCell = row.insertCell();
        activityCell.outerHTML = '<th>Activity</th>';

        var player;
        var playerAnchor;
        var playerSkill;
        for (var i = 0; i < numPlayers; i++) {
            player = players[i];

            row = table.insertRow();

            nameCell = row.insertCell();
            playerAnchor = document.createElement('a');
            playerAnchor.href = profileURL + (player.name || '');
            playerAnchor.target = '_blank';
            playerAnchor.appendChild(document.createTextNode(player.name || ''));
            nameCell.appendChild(playerAnchor);

            idCell = row.insertCell();
            idCell.classList.add('number-cell');
            idCell.appendChild(document.createTextNode(player.id || ''));

            lastActiveCell = row.insertCell();
            lastActiveCell.appendChild(document.createTextNode(player.lastActive || ''));

            rankCell = row.insertCell();
            rankCell.classList.add('number-cell');
            rankCell.appendChild(document.createTextNode(player.rank || ''));

            playerSkill = player.skill;
            skillCell = row.insertCell();
            skillCell.appendChild(document.createTextNode(playerSkill || ''));
            if (italicSkills.indexOf(playerSkill) > -1) {
                skillCell.classList.add('italic');
            }
            if (boldSkills.indexOf(playerSkill) > -1) {
                skillCell.classList.add('bold');
            }
            if (underlineSkills.indexOf(playerSkill) > -1) {
                skillCell.classList.add('underline');
            }

            mobCell = row.insertCell();
            mobCell.appendChild(document.createTextNode(player.mob || ''));

            activityCell = row.insertCell();
            activityCell.appendChild(document.createTextNode(player.activity || ''));
        }
    }

    return div;
}

function getSummary() {
    // In summary, show clans and add other categories at end
    var summaryClans = clans.concat([noClan, ironman, hardcore, totals]);
    var numSummaryClans = summaryClans.length;
    var i;
    var j;

    var div = document.createElement('div');

    // Title
    var title = document.createElement('b');
    title.appendChild(document.createTextNode('Summary'));
    div.appendChild(title);

    var table = document.createElement('table');
    div.appendChild(table);

    // Header row
    var row = table.insertRow();

    // Clan name header
    var clanCell = row.insertCell();
    clanCell.outerHTML = '<th>Clan</th>';

    // Skill headers
    var skillCell;
    var skillHeader = (summaryShortSkillNames) ? 'short' : 'name'
    for (i = 0; i < numSkills; i++) {
        skillCell = row.insertCell();
        skillCell.outerHTML = '<th>' + skills[i][skillHeader] + '</th>';
    }

    // Total column header
    var clanTotalCell = row.insertCell();
    clanTotalCell.outerHTML = '<th>Total</th>';

    // Total % column header
    var clanTotalPercCell = row.insertCell();
    clanTotalPercCell.outerHTML = '<th>%</th>';

    // Lucky % row
    row = table.insertRow();

    // Lucky % "clan name"
    clanCell = row.insertCell();
    clanCell.appendChild(document.createTextNode('L%'));

    // Lucky % skill numbers
    var totalPlayers = ld.players.length + ln.players.length;
    for (i = 0; i < numSkills; i++) {
        skillCell = row.insertCell();
        skillCell.classList.add('number-cell');
        skillCell.appendChild(document.createTextNode(formatPercentage((ld.skills[i].count + ln.skills[i].count)/totalPlayers)));
    }

    // Empty total and total % cells for Lucky %
    clanTotalCell = row.insertCell();
    clanTotalCell.classList.add('number-cell');

    clanTotalPercCell = row.insertCell();
    clanTotalPercCell.classList.add('number-cell');

    var clan;
    totalPlayers = totals.players.length;
    for (i = 0; i < numSummaryClans; i++) {
        clan = summaryClans[i];

        // Clan row
        row = table.insertRow();

        // Clan name cell
        clanCell = row.insertCell();
        clanCell.appendChild(document.createTextNode(clan.initials));

        // Clan skill numbers
        for (j = 0; j < numSkills; j++) {
            skillCell = row.insertCell();
            skillCell.classList.add('number-cell');
            skillCell.appendChild(document.createTextNode(clan.skills[j].count));
        }

        // Clan total count
        clanTotalCell = row.insertCell();
        clanTotalCell.classList.add('number-cell');
        clanTotalCell.appendChild(document.createTextNode(clan.players.length));

        // Clan total %
        clanTotalPercCell = row.insertCell();
        clanTotalPercCell.classList.add('number-cell');
        clanTotalPercCell.appendChild(document.createTextNode(formatPercentage(clan.players.length/totalPlayers)));
    }

    // % row
    row = table.insertRow();

    // % name cell
    clanCell = row.insertCell();
    clanCell.appendChild(document.createTextNode('%'));

    // % skill numbers
    for (j = 0; j < numSkills; j++) {
        skillCell = row.insertCell();
        skillCell.classList.add('number-cell');
        skillCell.appendChild(document.createTextNode(formatPercentage(totals.skills[j].count/totalPlayers)));
    }

    // Empty total and total % cells for Lucky %
    clanTotalCell = row.insertCell();
    clanTotalCell.classList.add('number-cell');

    clanTotalPercCell = row.insertCell();
    clanTotalPercCell.classList.add('number-cell');

    return div;
}

function addReportStyles(doc) {
    var css = '.italic {\n' +
        '    font-style: italic;\n' +
        '}\n\n' +
        '.bold {\n' +
        '    font-weight: bold;\n' +
        '}\n\n' +
        '.underline {\n' +
        '    text-decoration: underline;\n' +
        '}\n\n' +
        '.number-cell {\n' +
        '    text-align: right;\n' +
        '    padding-right: 3px;\n' +
        '}';
    addGlobalStyle(css, doc.head);
}

function printDataTables() {
    addClanSkillCount(noClan);
    addClanSkillCount(ironman);
    addClanSkillCount(hardcore);
    addClanSkillCount(totals);
    scrapeAll();

    var reportDoc = window.open().document;
    addReportStyles(reportDoc);

    var reportBody = reportDoc.body;
    reportBody.appendChild(getErrorsTable());

    var numClans = clans.length;
    for (var i = 0; i < numClans; i++) {
        reportBody.appendChild(getPlayerTable(clans[i]));
    }

    reportBody.appendChild(getPlayerTable(noClan));
    reportBody.appendChild(getPlayerTable(ironman));
    reportBody.appendChild(getPlayerTable(hardcore));

    reportBody.appendChild(getSummary());
}

printDataTables();
