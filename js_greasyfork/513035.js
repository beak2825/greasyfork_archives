// ==UserScript==
// @name         MazyarConstants
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Mazyar Constants
// @copyright    z7z from managerzone.com
// @author       z7z from managerzone.com
// @license      MIT
// @match        https://www.managerzone.com/*
// @match        https://test.managerzone.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=managerzone.com
// @supportURL   https://github.com/mz-ir/mazyar
// ==/UserScript==

const MAZYAR_CHANGELOG = {
    "3.3": [
        "<b>[fix]</b> Fixtures: make it compatible with <b>ylOppTactsPreview (MODIFIED)</b> script.",
    ],
    "3.2": [
        "<b>[fix]</b> bump version to overwrite the latest version in greasyfork",
    ],
    "3.1": [
        "<b>[fix]</b> required wrong version of scripts.",
    ],
    "3.0": [
        "<b>[fix]</b> Fixtures: truncate full names if they are very long.",
        "<b>[new]</b> make displaying full names in fixture page optional. It is disabled by default. To enable it check 'Display team's full name in fixture' in MZY Settings.",
        "<b>[Refactor]</b> restructured the project to multiple files.",
    ],
    "2.54": [
        "<b>[new]</b> Fixtures: add full name of the teams."
    ],
    "2.53": [
        "<b>[new]</b> show transfer fee in tactic page.",
        "<b>[fix]</b> Squad Summary: top players table in mobile view.",
    ],
    "2.52": [
        "<b>[new]</b> show residency days and transfer fee in shortlist."
    ],
    "2.51": [
        "<b>[new]</b> show transfer fee in more places."
    ],
    "2.50": [
        "<b>[new]</b> Players Profile: add transfer fee."
    ],
    "2.49": [
        "<b>[fix]</b> Transfer Market: wrong camp status in test domain"
    ],
    "2.48": [
        "<b>[fix]</b> download and update urls for userscript were missing."
    ],
    "2.47": [
        "<b>[fix]</b> some features were not compatible with test version of the site (test.managerzone.com)."
    ],
    "2.46": [
        "<b>[new]</b> if 'deadline alert' is enabled from MZY Settings, it adds a section to Transfer Monitor to display players you added to monitor their deadline.</b>.",
        "<b>[fix]</b> clean install was broken."
    ],
    "2.45": [
        "<b>[new]</b> Market: add optional feature to show training camp status of players. It is disabled by default. To enable it, please select 'Check if player is sent to camp' option from <b>MZY Settings</b>."
    ],
    "2.44": [
        "<b>[fix]</b> Tables: fix not adding top players to friendly league tables."
    ],
    "2.43": [
        "<b>[new]</b> Manager Ranking: add value and average top players for each team. You can sort them by this two columns too."
    ],
    "2.42": [
        "<b>[improve]</b> Squad Summary: add share and market icon for your own players too."
    ],
    "2.41": [
        "<b>[new]</b> Notebook: add a note icon to MZY Toolbar to open/hide a notebook. It stores your note and you can stick it to a corner to be always be available and visible."
    ],
    "2.40": [
        "<b>[fix]</b> Transfer: change Fee font color to blue."
    ],
    "2.39": [
        "<b>[new]</b> Transfer: for non one-club players, the price that current club paid for the player is added next to 'Days at this club'."
    ],
    "2.38": [
        "<b>[fix]</b> Transfer Filters: delete icon was missing in 'MZY Transfer Filters' modal."
    ],
    "2.37": [
        "<b>[new]</b> support Managerzone Test Site (test.managerzone.com). It is not fully tested. Please report any issues you encounter in Test site too."
    ],
    "2.36": [
        "<b>[new]</b> Deadline Alert: add 'Timeout' option in <b>MZY Settings</b> to set deadline timeout. Its value must be between 1 and 360 minutes.",
        "<b>[new]</b> Deadline Alert: add 'Sound Notification' option to play a bell sound when deadline of at least one of monitored players is less than timeout.",
        "<b>[fix]</b> Deadline Alert: trash icon was missing in 'MZY Transfer Deadlines' modal when 'van.mz.playerAdvanced' script is enabled.",
        "<b>[fix]</b> MZY Settings: 'Mark maxed skills' option was missing."
    ],
    "2.35": [
        "<b>[new]</b> Days at this club: add to player profiles in training report. It is optional and disabled by default. You can enable it from MZY Settings."
    ],
    "2.34": [
        "<b>[new]</b> <b>(Experimental)</b> Transfer: add deadline alert."
    ],
    "2.33": [
        "<b>[fix]</b> Federation Front Page: add top players when current federation is changed."
    ],
    "2.32": [
        "<b>[improve]</b> Federation: first team member sort"
    ],
    "2.31": [
        "<b>[new]</b> Clash: add average age of top players and teams senior league for each team. this feature is not supported in mobile view."
    ],
    "2.30": [
        "<b>[fix]</b> Transfer Filters: reset selected H & L checkboxes when Transfer filter is not enabled."
    ],
    "2.29": [
        "<b>[fix]</b> Hide Players: fixed an issue about hide icon when transfer scout filters are used."
    ],
    "2.28": [
        "<b>[fix]</b> Days at this club: after v2.27, it was broken in players page."
    ],
    "2.27": [
        "<b>[new]</b> Transfer Market: it adds a trash icon next to player ID in search result. click on the icon to <b>hide the player. To remove players from hide list, use 'MZY Hide' button."
    ],
    "2.26": [
        "<b>[improve]</b> Days at this club: it is optional. It is disabled by default. You can enable it from MZY Settings.",
        "<b>[improve]</b> Player Profile: it stores player profiles in local database to reduce number of requests.",
        "<b>[improve]</b> Local Database: it deletes outdated local data to reduce the size of database.",
        "<b>[improve]</b> Transfer: it uses less ajax requests now.",
    ],
    "2.25": [
        "<b>[new]</b> Training Report: click on player's camp package icon to open its camp report."
    ],
    "2.24": [
        "<b>[fix]</b> Player Profile: fix Days at this club for injured or suspended players."
    ],
    "2.23": [
        "<b>[new]</b> Squad Profile: add 'days at this club' to each player profile.",
        "<b>[fix]</b> Player Comment: show comment icon for players when selected tab changes.",
        "<b>[fix]</b> Player Comment: change color of comment icon to lightskyblue when player has no comment. (previous color was the same as loyal players background)",
    ],
    "2.22": [
        "<b>[new]</b> Hire Coaches: adds salary range of each coach. Thanks to <a href=\"https://www.managerzone.com/?p=profile&uid=8577497\">@douglaskampl</a> for suggesting the idea and sharing his implementation."
    ],
    "2.21": [
        "<b>[new]</b> Club Page: adds total trophy count."
    ],
    "2.20": [
        "<b>[new]</b> Player Profile: add 'Days at this club' counter."
    ],
    "2.19": [
        "<b>[new]</b> Squad Summary: it marks players whose skills are shared. click on share icon to see the player in place.",
        "<b>[new]</b> Squad Summary: it marks players that are in transfer market. click on transfer icon to see the player in market."
    ],
    "2.18": [
        "<b>[new]</b> show changelog after script update.",
        "<b>[improve]</b> change icon style of player's comment."
    ],
    "2.17": [
        "<b>[fix]</b> fixed total skill balls"
    ],
}


const MAZYAR_TRANSFER_INTERVALS = {
    always: {
        value: "0",
        label: "always",
    },
    onceMinute: {
        value: "1",
        label: "once a minute",
    },
    onceHour: {
        value: "2",
        label: "once an hour",
    },
    onceDay: {
        value: "3",
        label: "once a day",
    },
    never: {
        value: "4",
        label: "never",
    },
};

const MAZYAR_DEADLINE_ALERT_SOUND =
    "data:audio/mpeg;base64,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"
    + "qaqXgBiiMGYIoeJguglEKFN1K/GZSLyOvDAAnAQUEoFQToRQ0Of///oMpBkNi+bm+sjD//84Mgaf/dhYAbnil3e//NUxPQZ+qqeX"
    + "0OYAIu5vYnYhYa3/hgUkTQAAbuDis9Wrqkaa0nWrVZfTbyuBdVBAYa4thFy0MsiUiSFmg3QYjY+i1I0L1B6pRLBsYECGuXSDEWJ8"
    + "mVlhFjInjcZkbw7gxidcxJJAmtaisRtFFSY5A7kbpKDEY+k//NkxPciswbDHZiYALnQacNMNyVK5FzE1dFSJiYjicnnyRMhBUiJ4"
    + "umubGJkmXVHUCmVRzjL/qXW31LQe51ILsHK//qFv//zMFgbqpiAgAAAi2g8gAGDweFyK1e1f//izCfb6m7f9TPq3WWTZ1Kb6/+iT"
    + "IfqARgypBTX/t//9ZgNd2/rUr////1E0MsDdxEc//OExO8qiwbjH5iIBLXgADug8APN6h3CZv///0evsmeZbt//1JkwBR5JJ/q1f"
    + "//zhKf/////+s4NcEEyfUoADa8GwAfCYHif/r9+6PW93Z0BsoHGa739f1oEPADIiCv+p///zIa7f9v////RSNSBAIgQM1UADUYDb"
    + "8OQAEwxD8wNP1CnjSf9Jbf9TKSOo2QSSL5QJl1s3qfo/uaA8hPo/60av//pkx//////7JmAmZk6/G//E3AF6vW/xXAiV21P//M0x"
    + "PcRGqa3H8WQATzz36up5+nn0lSILaN16NRv5kAD88l/6///yse///6000EKqy+9mXb2UakuJCoAD4ULfcH8AGIQif4h//M0xO0L2"
    + "qap/BAmGAvjGjs/WtkUdlooUlIsnZ9svkk6ls7qd2R/6hugVhw8//b/+ikkk5iPD//r3U/UlMS6zJLWpJKroF8X//M0xPgNSqagf"
    + "gKk4CBsw8PVHAtgA+DeGjf///+hglki///0x0Adjk2/1UF///5gO7//////qWZD5CRy6pUQwH/AHzxCf/////M0xP0PKqaiXgBmb"
    + "P6mLX///SBHjD/mMp1//+UFn/////+k04lAOAoDqgwHA9wA+JQd////+gUC6h///ogjgm2+1f///UZf//M0xPsPEp6sfgKavP///"
    + "+3+mOgWUaUCBwBoAPkoPP////qW5SHf///0gFWXH////+o9//////+gvB1VABkBgPsAPjgAKd3///M0xPkTCqaqXgBibP//1NF3/"
    + "//KwLhNv1N///1mX//////2L5MdEOBLSB8Ihf////+oHjZ///6zAIG/9////O///////j5K//M0xOcK0qakHgKm8MeVIOAMyB8aD"
    + "P////6KEn///WAzlf////qMv//////zo7Ug4HoQHyYz////+g8GW///zAD1O/7f//9S//MkxPYJ2qK0PgRU+P//////+VOqCQcCw"
    + "ID5dHr///9/Uw1C7///0gGSMP9v///J//MkxPEJqqKsXgHk5P//////x2oAQDgCBAfEIFv///1N8qobf///QA4mf////9f///Mkx"
    + "O0JIqKwXgRU+P/////MagFwOBvIB8zGA/////Wohf//84FOh/p///1J//////MkxOsJcqK4ngHa8P//oCoDBwLQwPhQsf////xXO"
    + "///6gEF93/p///6ajDAD5MG//MkxOgIkqKsPgHg8H////6GCz///nASdX/////9dRwH8uDah////7IJic///8vg//MkxOgH8p6wP"
    + "gHa8MBn7/////9SAD0AoVepE/8XwqrChgzJftMv/NjGih/1PRZI//MkxOsICqK0PgHa8MieM/YCokdCCEqCkwFm4UeF46akNIKKG"
    + "HJb/b/IqYF0EhE3//MkxO0IYqKoXgSE+P//pkxBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//MkxO4IUp6sfgHa8Kqqq"
    + "qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//MkxO8IIp64fgNE+Kqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq"
    + "qqqqqqq//MkxPEGUW60XgCU4Kqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//MUxPoFmW6oOAHa8Kqqqqqqqqqqq"
    + "qqq//MkxO4GKW6gGUBoAKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//M0xPgQMcqoeYCgAKqqqqqqqqqqqqqqq"
    + "qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//MUxPIAAAP8AYAAAKqqqqqqqqqqqqqq";
