// ==UserScript==
// @name         PPS - Jira Stuff
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      2022.11.03.001
// @description  bubacar has left the building, danyboss is here now.
// @author       bubacar
// @match        https://papersoft-dms.atlassian.net/*
// @match        https://bitbucket.papersoft-dms.com/*
// @exclude      https://bitbucket.papersoft-dms.com/plugins/servlet/samlsso*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454198/PPS%20-%20Jira%20Stuff.user.js
// @updateURL https://update.greasyfork.org/scripts/454198/PPS%20-%20Jira%20Stuff.meta.js
// ==/UserScript==

/* jshint esversion: 9 */

(function () {
    'use esversion:9';

    ////////////////
    ///// LIBS /////
    ////////////////
    // js.cookie
    !function (e) { var n; if ("function" == typeof define && define.amd && (define(e), n = !0), "object" == typeof exports && (module.exports = e(), n = !0), !n) { var t = window.Cookies, o = window.Cookies = e(); o.noConflict = function () { return window.Cookies = t, o } } }(function () { function f() { for (var e = 0, n = {}; e < arguments.length; e++) { var t = arguments[e]; for (var o in t) n[o] = t[o] } return n } function a(e) { return e.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent) } return function e(u) { function c() { } function t(e, n, t) { if ("undefined" != typeof document) { "number" == typeof (t = f({ path: "/" }, c.defaults, t)).expires && (t.expires = new Date(1 * new Date + 864e5 * t.expires)), t.expires = t.expires ? t.expires.toUTCString() : ""; try { var o = JSON.stringify(n); /^[\{\[]/.test(o) && (n = o) } catch (e) { } n = u.write ? u.write(n, e) : encodeURIComponent(String(n)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent), e = encodeURIComponent(String(e)).replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent).replace(/[\(\)]/g, escape); var r = ""; for (var i in t) t[i] && (r += "; " + i, !0 !== t[i] && (r += "=" + t[i].split(";")[0])); return document.cookie = e + "=" + n + r } } function n(e, n) { if ("undefined" != typeof document) { for (var t = {}, o = document.cookie ? document.cookie.split("; ") : [], r = 0; r < o.length; r++) { var i = o[r].split("="), c = i.slice(1).join("="); n || '"' !== c.charAt(0) || (c = c.slice(1, -1)); try { var f = a(i[0]); if (c = (u.read || u)(c, f) || a(c), n) try { c = JSON.parse(c) } catch (e) { } if (t[f] = c, e === f) break } catch (e) { } } return e ? t[e] : t } } return c.set = t, c.get = function (e) { return n(e, !1) }, c.getJSON = function (e) { return n(e, !0) }, c.remove = function (e, n) { t(e, "", f(n, { expires: -1 })) }, c.defaults = {}, c.withConverter = e, c }(function () { }) });
    const _cookiesLib = Cookies;

    ////////////////
    ////////////////
    ///// HTML /////

    try {
        const _jiraStuffVersion = '2022.11.03.001';
        console.log('🦥 CATS: ALL YOUR BASE ARE BELONG TO US. 🦥 - v' + _jiraStuffVersion);

        // HTML
        const _jiraStuffHTML = {
            configBtnJira: '<style>.mainFeature{font-weight:700;cursor:pointer;text-decoration:none!important;color:#6b778c!important;background-color:#dcdcdc!important}[data-collapsed]::after{margin-left:6px}[data-collapsed="0"]::after{display:inline-block;content:"▼"}[data-collapsed="0"]+ul{display:block}[data-collapsed]>span{margin-left:6px}[data-collapsed="0"]>span:nth-child(1){display:none}[data-collapsed="0"]>span:nth-child(2){display:inline}[data-collapsed="1"]::after{display:inline-block;content:"▲"}[data-collapsed="1"]+ul{display:none}[data-collapsed="1"]>span:nth-child(1){display:inline}[data-collapsed="1"]>span:nth-child(2){display:none}.ghx-wrap-issue{background-color:#fff!important}</style><div role="presentation"><button id="jsf_toggle" aria-expanded="false" aria-haspopup="false" class="css-squd0k" type="button">🌻</button><div id="jsf_Container" style="background-color:#dcdcdc;padding:8px;position:absolute;top:5em;right:0;font-size:11px;margin-right:1em" hidden="true"><div><h4 style="display:inline">features</h4><span id="jsf_Save" style="float:right;margin:0 1em;cursor:pointer" title="save">💾</span><span id="jsf_Reset" style="float:right;transform:scale(.7);cursor:pointer" title="reset values">🔥</span><span id="jsf_Update" style="float:right;margin-right:2em;cursor:pointer" title="update"><a href="[UPDATE_URL]" target="_blank" style="text-decoration:none;padding:0">💡</a></span><span id="jsf_version" style="float:right;margin:0 .2em 0 1em;font-size:10px;font-style:italic">[VERSION]</span></div><ul style="overflow:auto;max-height:80vh;user-select:none"><li><a class="mainFeature" data-collapsed="1" onclick="this.dataset.collapsed=0===Number(this.dataset.collapsed)?1:0">Kanban board</a><ul><li><div title="show remaining time"><input id="jiraStuff_board_timeByTeam_enable" type="checkbox"><label for="jiraStuff_board_timeByTeam_enable">⌛ remaining time</label></div><ul><li title="merge components \'web\', \'api\', \'desktop\' into team Web"><input id="jiraStuff_board_timeByTeam_mergeWebTeam" type="checkbox"><label for="jiraStuff_board_timeByTeam_mergeWebTeam">merge web team 🌐=🌐+⚙️+🖥️</label></li><li title="show remaing time for web"><input id="jiraStuff_board_timeByTeam_componentWeb" type="checkbox"><label for="jiraStuff_board_timeByTeam_componentWeb">show web 🌐</label></li><li title="show remaing time for api"><input id="jiraStuff_board_timeByTeam_componentApi" type="checkbox"><label for="jiraStuff_board_timeByTeam_componentApi">show api ⚙️</label></li><li title="show remaing time for desktop"><input id="jiraStuff_board_timeByTeam_componentDesktop" type="checkbox"><label for="jiraStuff_board_timeByTeam_componentDesktop">show desktop 🖥️</label></li><li title="show remaing time for mobile"><input id="jiraStuff_board_timeByTeam_componentMobile" type="checkbox"><label for="jiraStuff_board_timeByTeam_componentMobile">show mobile 📱</label></li><li title="show remaing time for IT"><input id="jiraStuff_board_timeByTeam_componentIT" type="checkbox"><label for="jiraStuff_board_timeByTeam_componentIT">show IT 🕹️</label></li><li title="show remaing time for testing"><input id="jiraStuff_board_timeByTeam_componentTesting" type="checkbox"><label for="jiraStuff_board_timeByTeam_componentTesting">show testing 🔍</label></li><li title="show remaing time for automation"><input id="jiraStuff_board_timeByTeam_componentAutomation" type="checkbox"><label for="jiraStuff_board_timeByTeam_componentAutomation">show automation 🤖</label></li><li title="show number of open issues inside the story"><input id="jiraStuff_board_timeByTeam_openIssuesInStories" type="checkbox"><label for="jiraStuff_board_timeByTeam_openIssuesInStories">show open issues 🐞</label></li><li title="show number of open clarifications inside the story"><input id="jiraStuff_board_timeByTeam_openClarificationsInStories" type="checkbox"><label for="jiraStuff_board_timeByTeam_openClarificationsInStories">show open clarifications 🦗</label></li><li title="show number of open clarifications inside the story"><input id="jiraStuff_board_timeByTeam_showUsersWorkingSubtasks" type="checkbox"><label for="jiraStuff_board_timeByTeam_showUsersWorkingSubtasks">show users working in substasks</label></li><li style="list-style-type:none">--- ui ---</li><li title="split time in days"><input id="jiraStuff_board_timeByTeam_splitTimeInDays" type="checkbox"><label for="jiraStuff_board_timeByTeam_splitTimeInDays">split time in days</label></li><li title="show \'⌛ remaining\' label"><input id="jiraStuff_board_timeByTeam_showRemainingLabel" type="checkbox"><label for="jiraStuff_board_timeByTeam_showRemainingLabel">show remaining label</label></li><li title="show emojis"><input id="jiraStuff_board_timeByTeam_showComponentEmojis" type="checkbox"><label for="jiraStuff_board_timeByTeam_showComponentEmojis">show emojis</label></li><li title="show labels"><input id="jiraStuff_board_timeByTeam_showComponentLabels" type="checkbox"><label for="jiraStuff_board_timeByTeam_showComponentLabels">show labels</label></li><li class="faggySettings" hidden="true"><input id="jiraStuff_board_timeByTeam_emojiWeb" maxlength="10" style="width:2em;text-align:center" type="text"><label for="jiraStuff_board_timeByTeam_emojiWeb">&nbsp;&nbsp;emoji web</label></li><li class="faggySettings" hidden="true"><input id="jiraStuff_board_timeByTeam_emojiApi" maxlength="10" style="width:2em;text-align:center" type="text"><label for="jiraStuff_board_timeByTeam_emojiApi">&nbsp;&nbsp;emoji api</label></li><li class="faggySettings" hidden="true"><input id="jiraStuff_board_timeByTeam_emojiDesktop" maxlength="10" style="width:2em;text-align:center" type="text"><label for="jiraStuff_board_timeByTeam_emojiDesktop">&nbsp;&nbsp;emoji desktop</label></li><li class="faggySettings" hidden="true"><input id="jiraStuff_board_timeByTeam_emojiMobile" maxlength="10" style="width:2em;text-align:center" type="text"><label for="jiraStuff_board_timeByTeam_emojiMobile">&nbsp;&nbsp;emoji mobile</label></li></ul></li><li><input id="jiraStuff_board_leadTime_enable" type="checkbox"><label for="jiraStuff_board_leadTime_enable">lead time ⌚</label><ul><li><input id="jiraStuff_board_leadTime_maxDays" type="number" style="width:40px;font-size:11px"><label for="jiraStuff_board_leadTime_maxDays">&nbsp;&nbsp;max days</label></li></ul></li><li title="issues with \'time spent\' > \'time estimated\' will have a funky background"><input id="jiraStuff_board_deadEnds_enable" type="checkbox"><label for="jiraStuff_board_deadEnds_enable">dead ends</label></li><li title="remove \'in progress/done\' from the headers"><input id="jiraStuff_board_reduceColumnHeaders_enable" type="checkbox"><label for="jiraStuff_board_reduceColumnHeaders_enable">reduce column headers</label></li><li title="issues in planning without hours will have a funky background color"><input id="jiraStuff_board_missingHoursInPlanning_enable" type="checkbox"><label for="jiraStuff_board_missingHoursInPlanning_enable"><span style="background-color:plum">mark</span>&nbsp;&nbsp;planning without hours</label></li><li title="pull request status in review"><input id="jiraStuff_board_PRs_enable" type="checkbox"><label for="jiraStuff_board_PRs_enable">pull request status</label></li><li style="text-decoration:line-through;display:none"><input id="jiraStuff_board_forceIssuesOldView_enable" type="checkbox"><label for="jiraStuff_board_forceIssuesOldView_enable">force issues old view</label></li></ul></li><li><a class="mainFeature" data-collapsed="1" onclick="this.dataset.collapsed=0===Number(this.dataset.collapsed)?1:0">Issues</a><ul><li><input id="jiraStuff_issues_timeBySubtask_timeBySubtaskNew" type="checkbox"><label for="jiraStuff_issues_timeBySubtask_timeBySubtaskNew">time by subtask</label><ul><li><input id="jiraStuff_issues_timeBySubtask_timeBySubtaskNew_copyIssueId" type="checkbox"><label for="jiraStuff_issues_timeBySubtask_timeBySubtaskNew_copyIssueId">copy issue id ©</label></li><li><input id="jiraStuff_issues_timeBySubtask_timeBySubtaskNew_hideDefaultGraph" type="checkbox"><label for="jiraStuff_issues_timeBySubtask_timeBySubtaskNew_hideDefaultGraph">hide default graph</label></li><li><input id="jiraStuff_issues_timeBySubtask_timeBySubtaskNew_hidePriority" type="checkbox"><label for="jiraStuff_issues_timeBySubtask_timeBySubtaskNew_hidePriority">hide priority</label></li><li><input id="jiraStuff_issues_timeBySubtask_timeBySubtaskNew_costCode" type="checkbox"><label for="jiraStuff_issues_timeBySubtask_timeBySubtaskNew_costCode">missing cost code 💸</label></li><li><span>log time ⏱<ul><li><input id="jiraStuff_issues_logtime_task" type="checkbox"><label for="jiraStuff_issues_logtime_task">task</label></li><li><input id="jiraStuff_issues_logtime_subtasks" type="checkbox"><label for="jiraStuff_issues_logtime_subtasks">sub tasks</label></li></ul></li></ul></li><li title="wish a task, genie makes it!"><input id="jiraStuff_issues_taskGenie_enabled" type="checkbox"><label for="jiraStuff_issues_taskGenie_enabled">task genie 🧞</label></li><li><span>styles<ul><li><input id="jiraStuff_issues_styles_changeTaskStatusFixedSize" type="checkbox"><label for="jiraStuff_issues_styles_changeTaskStatusFixedSize">change task status fixed size</label></li></ul></li><li hidden><input id="jiraStuff_issues_timeBySubtask_timeBySubtaskOld" type="checkbox"><label for="jiraStuff_issues_timeBySubtask_timeBySubtaskOld">time by subtask (old view)</label></li></ul></li><li><a class="mainFeature" data-collapsed="1" onclick="this.dataset.collapsed=0===Number(this.dataset.collapsed)?1:0">Releases</a><ul><li hidden><input id="jiraStuff_releases_bugTimesByRelease_enabled" type="checkbox"><label for="jiraStuff_releases_bugTimesByRelease_enabled">bug times by release</label></li><li><input id="jiraStuff_releases_documentationTasks_enabled" type="checkbox"><label for="jiraStuff_releases_documentationTasks_enabled">🚀 documentation tasks</label></li><li><input id="jiraStuff_releases_missingFixedVersion_enabled" type="checkbox"><label for="jiraStuff_releases_missingFixedVersion_enabled">🧟‍♂️ missing fixed version</label></li><li hidden><input id="jiraStuff_releases_showBranchs_enabled" type="checkbox"><label for="jiraStuff_releases_showBranchs_enabled">💎 branchs</label></li></ul></li><li><a class="mainFeature" data-collapsed="1" onclick="this.dataset.collapsed=0===Number(this.dataset.collapsed)?1:0">Logs</a><ul><li><input id="jiraStuff_log_showDebug" type="checkbox"><label for="jiraStuff_log_showDebug">show debug</label></li><li><input id="jiraStuff_log_showTimers" type="checkbox"><label for="jiraStuff_log_showTimers">show timers</label></li><li><input id="jiraStuff_log_showEngine" type="checkbox"><label for="jiraStuff_log_showEngine">show engine</label></li></ul></li></ul></div></div>',
            configBtnBitbucket: '<style>.mainFeature{font-weight:700;cursor:pointer;text-decoration:none!important;color:#6b778c!important;background-color:#dcdcdc!important}.mainFeature+ul{margin-top:0}[data-collapsed]::after{margin-left:6px}[data-collapsed="0"]::after{display:inline-block;content:"▼"}[data-collapsed="0"]+ul{display:block}[data-collapsed]>span{margin-left:6px}[data-collapsed="0"]>span:nth-child(1){display:none}[data-collapsed="0"]>span:nth-child(2){display:inline}[data-collapsed="1"]::after{display:inline-block;content:"▲"}[data-collapsed="1"]+ul{display:none}[data-collapsed="1"]>span:nth-child(1){display:inline}[data-collapsed="1"]>span:nth-child(2){display:none}.my_foot_was_a_ballon{border-radius:50%;border:2px solid;color:#fff;text-align:center;font:11px Arial,sans-serif;padding:1px;margin-left:4px}.my_foot_was_a_ballon.redBallon{background:#ff5630;border-color:#ff5630}.my_foot_was_a_ballon.greenBallon{background:#36b37e;border-color:#36b37e}.my_foot_was_a_ballon.greyBallon{background:#5243aa;border-color:#5243aa}</style><a id="jsf_toggle" aria-expanded="false" aria-haspopup="false" class="css-squd0k" href="javascript:void(0);">🌻</a><div id="jsf_Container" style="background-color:#dcdcdc;padding:8px;position:absolute;top:4em;right:0;font-size:11px;margin-right:1em;color:#6b778c;z-index:100;display:none" hidden="true"><div><h4 style="display:inline">features</h4><span id="jsf_Save" style="float:right;margin:0 1em;cursor:pointer" title="save">💾</span><span id="jsf_Reset" style="float:right;transform:scale(.7);cursor:pointer" title="reset values">🔥</span><span id="jsf_Update" style="float:right;margin-right:2em;cursor:pointer" title="update"><a href="[UPDATE_URL]" target="_blank" style="text-decoration:none;padding:0">💡</a></span><span id="jsf_version" style="float:right;margin:0 .2em 0 1em;font-size:10px;font-style:italic">[VERSION]</span></div><ul style="overflow:auto;max-height:80vh;user-select:none"><li><span style="font-weight:700">Bitbucket</span><ul><li><input id="jiraStuff_bitbucket_dashboard_filter" type="checkbox"><label for="jiraStuff_bitbucket_dashboard_filter">filter PRs 🧙</label></li><li><input id="jiraStuff_bitbucket_dashboard_sonarLinks" type="checkbox"><label for="jiraStuff_bitbucket_dashboard_sonarLinks">sonar links 📡</label></li><li><input id="jiraStuff_bitbucket_dashboard_jenkinsLinks" type="checkbox"><label for="jiraStuff_bitbucket_dashboard_jenkinsLinks">jenkin links 🎩</label></li><li><input id="jiraStuff_bitbucket_createPullRequest_prefixes_enable" type="checkbox"><label for="jiraStuff_bitbucket_createPullRequest_prefixes_enable">PR prefixes</label></li></ul></li><li><a class="mainFeature" data-collapsed="1" onclick="this.dataset.collapsed=0===Number(this.dataset.collapsed)?1:0">Logs</a><ul><li><input id="jiraStuff_log_showDebug" type="checkbox"><label for="jiraStuff_log_showDebug">show debug</label></li><li><input id="jiraStuff_log_showTimers" type="checkbox"><label for="jiraStuff_log_showTimers">show timers</label></li><li><input id="jiraStuff_log_showEngine" type="checkbox"><label for="jiraStuff_log_showEngine">show engine</label></li></ul></li></ul></div>',
            timeBySubtask: '<div class="timeBySubTaskContainer" style="width: 100px; color: black;font-size: 10px;"><div class="estimated" style="display:inline-block; text-align: center; text-overflow: clip;overflow: hidden;white-space: nowrap; background-color: forestgreen"></div><div class="estimatedTotal" style="display:inline-block; width: 100%"><span class="reported" style="display:inline-block; text-align: center; text-overflow: clip;overflow: hidden;white-space: nowrap; background-color: #B2D4FF"></span><span class="remaining" style="display:inline-block; text-align: center; text-overflow: clip;overflow: hidden;white-space: nowrap; background-color: khaki"></span></div></div>',
            taskGenie: '🧞<div id="jsf_taskGenieContainer" style="background-color: #dcdcdc; padding: 8px; position: absolute; top: 4em; right: 0; font-size: 13px; margin-right: 1em; color: #6b778c; border: 1px solid black; border-radius: 5px; z-index: 100; display: none;" hidden="true"> <div> <span id="jiraStuff_issues_taskGenie_btnWeb" title="web" style="cursor: pointer; border: solid; border-color: #9370db; padding: 2px; margin: 4px 4px; border-radius: 6px; font-weight: bolder; display: inline-block;"> WEB PORTAL 🌐 </span> <hr style="margin-top: 6px;"/> <span id="jiraStuff_issues_taskGenie_btnApiAuth" title="authentication api" style="cursor: pointer; border: solid; border-color: #9370db; padding: 2px; margin: 4px 4px; border-radius: 6px; font-weight: bolder; display: inline-block;"> AUTH API ⚙️ </span> <span id="jiraStuff_issues_taskGenie_btnApiBusiness" title="business api" style="cursor: pointer; border: solid; border-color: #9370db; padding: 2px; margin: 4px 4px; border-radius: 6px; font-weight: bolder; display: inline-block;"> BUSINESS API ⚙️ </span> <span id="jiraStuff_issues_taskGenie_btnApiSubmission" title="submission api" style="cursor: pointer; border: solid; border-color: #9370db; padding: 2px; margin: 4px 4px; border-radius: 6px; font-weight: bolder; display: inline-block;"> SUBMISSION API ⚙️ </span> <span id="jiraStuff_issues_taskGenie_btnApiDocumental" title="documental api" style="cursor: pointer; border: solid; border-color: #9370db; padding: 2px; margin: 4px 4px; border-radius: 6px; font-weight: bolder; display: inline-block;"> DOCUMENTAL API ⚙️ </span> <span id="jiraStuff_issues_taskGenie_btnApiNotification" title="notification api" style="cursor: pointer; border: solid; border-color: #9370db; padding: 2px; margin: 4px 4px; border-radius: 6px; font-weight: bolder; display: inline-block;"> NOTIFICATION API ⚙️ </span> <span id="jiraStuff_issues_taskGenie_btnApiDataValidatorClient" title="dataValidator (client) api" style="cursor: pointer; border: solid; border-color: #9370db; padding: 2px; margin: 4px 4px; border-radius: 6px; font-weight: bolder; display: inline-block;"> DATAVALIDATOR (CLIENT) ⚙️ </span> <span id="jiraStuff_issues_taskGenie_btnApiDataValidatorWaynbo" title="dataValidator (waynbo) api" style="cursor: pointer; border: solid; border-color: #9370db; padding: 2px; margin: 4px 4px; border-radius: 6px; font-weight: bolder; display: inline-block;"> DATAVALIDATOR (WAYNBO) ⚙️ </span> <hr style="margin-top: 6px;"/> <span id="jiraStuff_issues_taskGenie_btnWinService" title="win service" style="cursor: pointer; border: solid; border-color: #9370db; padding: 2px; margin: 4px 4px; border-radius: 6px; font-weight: bolder; display: inline-block;"> WINDOWS SERVICE 🖥️ </span> <span id="jiraStuff_issues_taskGenie_btnDesktop" title="desktop" style="cursor: pointer; border: solid; border-color: #9370db; padding: 2px; margin: 4px 4px; border-radius: 6px; font-weight: bolder; display: inline-block;"> DESKTOP 🖥️ </span> <hr style="margin-top: 6px;"/> <span id="jiraStuff_issues_taskGenie_btnMobile" title="mobile" style="cursor: pointer; border: solid; border-color: #9370db; padding: 2px; margin: 4px 4px; border-radius: 6px; font-weight: bolder; display: inline-block;"> MOBILE 📱 </span> <hr style="margin-top: 6px;"/> <span id="jiraStuff_issues_taskGenie_btnIT" title="it" style="cursor: pointer; border: solid; border-color: #9370db; padding: 2px; margin: 4px 4px; border-radius: 6px; font-weight: bolder; display: inline-block;"> IT 🕹️ </span> <hr style="margin-top: 6px;"/> <span id="jiraStuff_issues_taskGenie_btnTestingWeb" title="testing web" style="cursor: pointer; border: solid; border-color: #9370db; padding: 2px; margin: 4px 4px; border-radius: 6px; font-weight: bolder; display: inline-block;"> TESTING WEB 🔎🌐 </span> <span id="jiraStuff_issues_taskGenie_btnTestingMobile" title="testing mobile" style="cursor: pointer; border: solid; border-color: #9370db; padding: 2px; margin: 4px 4px; border-radius: 6px; font-weight: bolder; display: inline-block;"> TESTING MOBILE 🔎📱 </span> <hr style="margin-top: 6px;"/> <span id="jiraStuff_issues_taskGenie_btnBugApi" title="bugApi" style="cursor: pointer; border: solid; border-color: #9370db; padding: 2px; margin: 4px 4px; border-radius: 6px; font-weight: bolder; display: inline-block;"> BUG API 🐞⚙️ </span> <span id="jiraStuff_issues_taskGenie_btnBugWeb" title="bugWeb" style="cursor: pointer; border: solid; border-color: #9370db; padding: 2px; margin: 4px 4px; border-radius: 6px; font-weight: bolder; display: inline-block;"> BUG WEB 🐞🌐 </span> <span id="jiraStuff_issues_taskGenie_btnBugMobile" title="bugMobile" style="cursor: pointer; border: solid; border-color: #9370db; padding: 2px; margin: 4px 4px; border-radius: 6px; font-weight: bolder; display: inline-block;"> BUG MOBILE 🐞📱 </span> <hr style="margin-top: 6px;"/> <span id="jiraStuff_issues_taskGenie_btnCodeReview" title="code review" style="cursor: pointer; border: solid; border-color: #9370db; padding: 2px; margin: 4px 4px; border-radius: 6px; font-weight: bolder; display: inline-block;"> CODE REVIEW 👀 </span> <span id="jiraStuff_issues_taskGenie_btnClarifications" title="clarifications" style="cursor: pointer; border: solid; border-color: #9370db; padding: 2px; margin: 4px 4px; border-radius: 6px; font-weight: bolder; display: inline-block;"> CLARIFICATIONS ❓ </span> <span id="jiraStuff_issues_taskGenie_btnMeetings" title="meetings" style="cursor: pointer; border: solid; border-color: #9370db; padding: 2px; margin: 4px 4px; border-radius: 6px; font-weight: bolder; display: inline-block;"> MEETINGS 🤝 </span> <span id="jiraStuff_issues_taskGenie_btnReleaseNotes" title="release notes" style="cursor: pointer; border: solid; border-color: #9370db; padding: 2px; margin: 4px 4px; border-radius: 6px; font-weight: bolder; display: inline-block;"> RELEASE NOTES 🚀 </span> </div><hr style="margin-top: 6px;"/> <div id="jiraStuff_issues_taskGenie_loading" class="rotate" title="loading" style="font-size: 200px; position: absolute; top: 0; left: 26%;" hidden>🍥</div><h4 id="jiraStuff_issues_taskGenie_selectedButton" style="margin: 8px;"></h4> <div id="jiraStuff_issues_taskGenie_inputs" hidden> <div style="display: table; width: 100%;"> <span style="display: table-cell; vertical-align: middle;">TITLE</span> <input id="jiraStuff_issues_taskGenie_summary" name="jiraStuff_issues_taskGenie_summary" maxlength="100" type="text" style="width: 100%; float:right; height: 2em; border: 1px solid black; border-radius:4px; margin-bottom: 6px;"/> </div><div style="display: table; width: 100%;"> <span style="display: table-cell; vertical-align: middle;">DESC</span> <input id="jiraStuff_issues_taskGenie_description" maxlength="200" type="text" style="width: 100%; float:right; height: 2em; border: 1px solid black; border-radius:4px; margin-bottom: 6px;"/> </div><div style="display: table; width: 100%;"> <span style="display: table-cell; vertical-align: middle;">HOURS</span> <input id="jiraStuff_issues_taskGenie_estimatedHours" type="number" min="0" style="width: 100%; float:right; height: 2em; border: 1px solid black; border-radius:4px; margin: 0 0 6px 12px;"/> </div><div hidden> <input id="jiraStuff_issues_taskGenie_issueType" type="hidden"/> <input id="jiraStuff_issues_taskGenie_componentId" type="hidden"/> <input id="jiraStuff_issues_taskGenie_componentName" type="hidden"/> <input id="jiraStuff_issues_taskGenie_costCode" type="hidden"/> <input id="jiraStuff_issues_taskGenie_client" type="hidden"/> </div><div> <span id="jiraStuff_issues_taskGenie_save" title="create task" style="cursor: pointer; border: solid; border-color: #9370db; background-color: #9370db; color: #fff; padding: 2px; border-radius: 6px; font-weight: bolder; margin: 6px; display: inline-block;"> CREATE </span> <span id="jiraStuff_issues_taskGenie_saveOk" title="success" hidden> ✔️ <span id="jiraStuff_issues_taskGenie_saveOk_message" style="margin-left: 2px;"/> </span> <span id="jiraStuff_issues_taskGenie_saveNotOk" title="error" hidden> ❌ <span id="jiraStuff_issues_taskGenie_saveNotOk_message" style="margin-left: 2px;"/> </span> </div><div style="width: 80%; display: inline-block;"> <div> <b>new tasks:</b> <ul id="jiraStuff_issues_taskGenie_news" style="margin-top: 0;"></ul> </div></div></div></div><style>.rotate{animation: rotation 2s infinite linear;}@keyframes rotation{from{transform: rotate(0);}to{transform: rotate(359deg);}}</style>',
        };
        // add version
        _jiraStuffHTML.configBtnJira = _jiraStuffHTML.configBtnJira.replace('[VERSION]', 'v' + _jiraStuffVersion);
        _jiraStuffHTML.configBtnBitbucket = _jiraStuffHTML.configBtnBitbucket.replace('[VERSION]', 'v' + _jiraStuffVersion);

        // CSS
        const _jiraCSS = {
            issues: {
                changeTaskStatusFixedSize: '[data-testid="issue.issue-view.views.common.child-issues-panel.issues-container"] [data-test-id^="issue.fields.status.common.ui.status-lozenge"] > span { min-width: 96px; } [data-testid="issue.issue-view.views.common.child-issues-panel.issues-container"] [data-test-id^="issue.fields.status.common.ui.status-lozenge"] > span span[role="presentation"] { margin-left: auto; }'
            }
        };

        ////////////////
        ///// JSON /////
        ////////////////
        const _jiraStuffPayloads = {
            createTask: '{"update":{},"fields":{"project":{"id":10003},"priority":{"id":"10008"},"resolution":{"id":"10007"},"assignee":-1,"parent":{"key":"[[parentKey]]"},"issuetype":{"name":"[[issueType]]"},"summary":"[[summary]]","description":{"version":1,"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"[[description]]"}]}]},"customfield_10091":{"value":"[[costCode]]"},"customfield_10083":{"value":"[[client]]"},"timetracking":{"remainingEstimate":"[[estimateMinutes]]","originalEstimate":"[[estimateMinutes]]"}}}',
            getBranchsPrsFull: '{"operationName":"summaryQuery","variables":{"issueId":"ari:cloud:jira:aece042e-71f6-4685-a7b8-6ae72d82107e:issue/[issueId]"},"query":"query summaryQuery( $issueId: ID! ) { jira { devOps { devOpsIssuePanel(issueId: $issueId) { panelState devOpsIssuePanelBanner devSummaryResult { devSummary { branch { overall { count lastUpdated } summaryByProvider { providerId name count } } commit { overall { count lastUpdated } summaryByProvider { providerId name count } } pullrequest { overall { count lastUpdated state stateCount open } summaryByProvider { providerId name count } } build { overall { count lastUpdated failedBuildCount successfulBuildCount unknownBuildCount } summaryByProvider { providerId name count } } review { overall { count lastUpdated state stateCount } summaryByProvider { providerId name count } } deploymentEnvironments { overall { count topEnvironments { title } } summaryByProvider { providerId name count } } } errors { message instance { name type baseUrl } } configErrors { message instance { name type baseUrl } } } } } } } "}',
            getBranchsPrs: '{"operationName":"summaryQuery","variables":{"issueId":"ari:cloud:jira:aece042e-71f6-4685-a7b8-6ae72d82107e:issue/[issueId]"},"query":"query summaryQuery( $issueId: ID! ) { jira { devOps { devOpsIssuePanel(issueId: $issueId) { devSummaryResult { devSummary { branch { overall { count lastUpdated } } pullrequest { overall { count lastUpdated state stateCount open } } review { overall { count lastUpdated state stateCount } } } } } } } } "}',
            getBranchsPrsFull2: '{"operationName":"DevDetailsDialog","variables":{"issueId":"[issueId]"},"query":"query DevDetailsDialog ($issueId: ID!) { developmentInformation(issueId: $issueId){ details { instanceTypes { id name type typeName isSingleInstance baseUrl devStatusErrorMessages repository { name avatarUrl description url parent { name url } branches { name url createReviewUrl createPullRequestUrl lastCommit { url displayId timestamp } pullRequests { name url status lastUpdate } reviews { state url id } } commits{ id displayId url createReviewUrl timestamp isMerge message author { name avatarUrl } files{ linesAdded linesRemoved changeType url path } reviews{ id url state } } pullRequests { id url name branchName branchUrl lastUpdate status author { name avatarUrl } reviewers{ name avatarUrl isApproved } } } danglingPullRequests { id url name branchName branchUrl lastUpdate status author { name avatarUrl } reviewers{ name avatarUrl isApproved } } buildProviders { id name url description avatarUrl builds { id buildNumber name description url state testSummary { totalNumber numberPassed numberFailed numberSkipped } lastUpdated references { name uri } } } } deploymentProviders { id name homeUrl logoUrl deployments { displayName url state lastUpdated pipelineId pipelineDisplayName pipelineUrl environment { id type displayName } } } featureFlagProviders { id createFlagTemplateUrl linkFlagTemplateUrl featureFlags { id key displayName providerId details{ url lastUpdated environment{ name type } status{ enabled defaultValue rollout{ percentage text rules } } } } } remoteLinksByType { providers { id name homeUrl logoUrl documentationUrl actions { id label { value } templateUrl } } types { type remoteLinks { id providerId displayName url type description status { appearance label } actionIds attributeMap { key value } } } } embeddedMarketplace { shouldDisplayForBuilds, shouldDisplayForDeployments, shouldDisplayForFeatureFlags } } } }"}',
            getBranchsPrs2: '{"operationName":"DevDetailsDialog","variables":{"issueId":"[issueId]"},"query":"query DevDetailsDialog ($issueId: ID!) { developmentInformation(issueId: $issueId){ details { instanceTypes { id name type typeName isSingleInstance baseUrl devStatusErrorMessages repository { name avatarUrl description url parent { name url } branches { name url createReviewUrl createPullRequestUrl lastCommit { url displayId timestamp } pullRequests { name url status lastUpdate } reviews { state url id } } commits{ id displayId url createReviewUrl timestamp isMerge message author { name avatarUrl } files{ linesAdded linesRemoved changeType url path } reviews{ id url state } } pullRequests { id url name branchName branchUrl lastUpdate status author { name avatarUrl } reviewers{ name avatarUrl isApproved } } } danglingPullRequests { id url name branchName branchUrl lastUpdate status author { name avatarUrl } reviewers{ name avatarUrl isApproved } } buildProviders { id name url description avatarUrl builds { id buildNumber name description url state testSummary { totalNumber numberPassed numberFailed numberSkipped } lastUpdated references { name uri } } } } } } }"}'
        };

        /////////////////
        //// CONFIGS ////
        /////////////////
        const _configInternal = {
            checkUpdates: {
                updateUrl: 'https://greasyfork.org/scripts/454198-jirastuff/code/JiraStuff.user.js',
                updateAvailable: false
            },
            _1337: localStorage.__storejs_cache_prefix___scope_key__ === '"5fe087d9208dbf01070db5ba"',
            downloadUrl: {
                counter: 'https://greasyfork.org/scripts/454198-jirastuff/code/JiraStuff.user.js',
                noCounter: 'https://greasyfork.org/scripts/454198-jirastuff/code/JiraStuff.user.js'
            },
            issues: {
                statusTransitions: {
                    dev: {
                        flowDone: []
                    }
                }
            }
        };

        function _configDefault() {
            return {
                checkUpdates: {
                    enabled: false
                },
                board: {
                    timer: {
                        intervalSeconds: 2000,
                        alwaysRunning: true
                    },
                    timeByTeam: {
                        enabled: true,
                        mergeWebTeam: false,
                        componentWeb: true,
                        componentApi: true,
                        componentDesktop: true,
                        componentMobile: true,
                        componentIT: true,
                        componentTesting: true,
                        componentAutomation: true,
                        openIssuesInStories: true,
                        openClarificationsInStories: true,
                        splitTimeInDays: true,
                        showUsersWorkingSubtasks: true,
                        //--ui--
                        showRemainingLabel: false,
                        showComponentLabels: false,
                        showComponentEmojis: true,
                        labelWeb: 'Web',
                        labelApi: 'Api',
                        labelDesktop: 'Desktop',
                        labelMobile: 'Mobile',
                        labelTesting: 'Testing',
                        labelAutomation: 'Automation',
                        labelIT: 'IT',
                        labelBug: 'Bug',
                        labelClarification: 'Clarification',
                        emojiWeb: '🌐',
                        emojiApi: '⚙️',
                        emojiDesktop: '🖥️',
                        emojiMobile: '📱',
                        emojiIT: '🕹️',
                        emojiTesting: '🔍',
                        emojiAutomation: '🤖',
                        emojiBug: '🐞',
                        emojiClarification: '🦗'
                    },
                    deadEnds: {
                        enabled: false,
                        color1: '0,0,0', // black
                        //color1 : '75,2,111', // purple

                        color2: '255,0,0' // red
                        //color2 : '255,255,0' // yhellow
                        //color2 : '128,0,128' // light purple
                    },
                    leadTime: {
                        enabled: true,
                        maxDays: 60,
                        colorMoreThenMax: '#FA8072', //salmon
                        //colorMoreThenMax : 'red',
                        colorMoreThenHalf: '#FFD700', //gold
                        //colorMoreThenHalf : 'yellow',
                        colorLessThenHalf: '#98FB98' //palegreen
                        //colorLessThenHalf : 'lime'
                    },
                    forceIssuesOldView: {
                        enabled: true
                    },
                    reduceColumnHeaders: {
                        enabled: true
                    },
                    missingHoursInPlanning: {
                        enabled: true
                    },
                    PRs: {
                        enabled: false
                    }
                },
                issues: {
                    timer: {
                        intervalSeconds: 2000,
                        alwaysRunning: true
                    },
                    timeBySubtaskNew: {
                        enabled: true,
                        maxHistorySize: 5,
                        hideDefaultGraph: true,
                        hidePriority: true,
                        showCompletionPercentage: true,
                        costCode: true,
                        copyIssueId: false
                    },
                    timeBySubtaskOld: {
                        enabled: true
                    },
                    taskGenie: {
                        enabled: true
                    },
                    logTime: {
                        task: true,
                        subtasks: true,
                    },
                    styles: {
                        changeTaskStatusFixedSize: true
                    }
                },
                releases: {
                    timer: {
                        intervalSeconds: 2000,
                        alwaysRunning: true
                    },
                    //bugTimesByRelease : {
                    //    enabled : true
                    //},
                    documentationTasks: {
                        enabled: true
                    },
                    missingFixedVersion: {
                        enabled: true
                    },
                    //showBranchs : {
                    //    enabled : true
                    //}
                },
                bitbucket: {
                    enabled: true,
                    dashboard: {
                        filter: true,
                        sonarLinks: true,
                        jenkinsLinks: true
                    },
                    createPullRequest: {
                        prefixes: {
                            enabled: true,
                            feature: 'FEATURE ⭐ - ',
                            release: 'RELEASE 💎 - ',
                            bugfix: 'BUGFIX 🐛 - ',
                            hotfix: 'HOTFIX 💣 - '
                        }
                    }
                },
                faggyUsers: ['5fe087d9208dbf01070db5ba-disabled', '5af0624e12b7982a5756da60-disabled', '6007327ebb4eb500788cf371-disabled'],
                clarificationUsers: ['557058:07ea134d-b2d0-465b-b79a-bc62c9a2ae0b', '5a8b003a21870439aa915f9d'], //eurico, iago
                log: {
                    showDebug: false,
                    showTimers: false,
                    showEngine: false
                }
            };
        }

        //clone default config
        let _configUser = { ..._configDefault() };

        // load config
        if (_cookiesLib) {
            _logDebug('🍪🍪🍪 _cookiesLib 🍪🍪🍪');
            let tempConfig = _cookiesLib.get('jiraStuff');
            if (!tempConfig) {
                //set default config in cookie
                _cookiesLib.set('jiraStuff', _configUser, { expires: 3650 });
            }
            else {
                // load _config from cookie
                let storedConfig = JSON.parse(tempConfig);
                // merge user custom config with default config
                mergeObject(_configUser, storedConfig);
            }
        }

        // detect location

        var _pathname = document.location.pathname.toLowerCase();
        var _search = document.location.search.toLowerCase();
        var _hostname = document.location.hostname.toLowerCase();
        var _page = {};

        function getLocation() {
            _pathname = document.location.pathname.toLowerCase();
            _search = document.location.search.toLowerCase();
            _hostname = document.location.hostname.toLowerCase();

            _page = {
                // jira
                isJira: _hostname === 'papersoft-dms.atlassian.net',
                isBoard: _pathname.indexOf('/jira/software/c/projects/atlantis/boards') === 0, //_pathname === '/secure/rapidboard.jspa',
                isIssues: _pathname.indexOf('/browse/') === 0,
                isRelease: _pathname.indexOf('/projects/atlantis/versions/') === 0,
                isReleases: _search.indexOf('selecteditem=com.atlassian.jira.jira-projects-plugin') >= 0,
                isOldIssueView: _search.indexOf('oldissueview=true') >= 0,
                issueKey: _pathname.substr(_pathname.lastIndexOf('/') + 1),
                getCurrentIssueKey: function () {
                    return document.location.pathname.toLowerCase().substr(_pathname.lastIndexOf('/') + 1);
                },
                // bitbucket
                isBitbucket: _hostname === 'bitbucket.papersoft-dms.com',
                isDashboard: _pathname === '/dashboard' || _pathname === '/dashboard',
                isPullRequests: _pathname.indexOf('/pull-requests') >= 0 && _search === '',
                isCreatePullRequest: _pathname.indexOf('/pull-requests') >= 0 && _search
            };
            _logDebug('href:' + window.location.href + ' - ' + Date());
        }

        //download url fix
        if (_configInternal._1337) {
            _jiraStuffHTML.configBtnJira = _jiraStuffHTML.configBtnJira.replace('[UPDATE_URL]', _configInternal.downloadUrl.noCounter);
            _jiraStuffHTML.configBtnBitbucket = _jiraStuffHTML.configBtnBitbucket.replace('[UPDATE_URL]', _configInternal.downloadUrl.noCounter);
        }
        else {
            _jiraStuffHTML.configBtnJira = _jiraStuffHTML.configBtnJira.replace('[UPDATE_URL]', _configInternal.downloadUrl.counter);
            _jiraStuffHTML.configBtnBitbucket = _jiraStuffHTML.configBtnBitbucket.replace('[UPDATE_URL]', _configInternal.downloadUrl.counter);
        }

        // bind config button
        const timerConfigurationBtn = window.setInterval(bindConfigButton, 200);
        _logTimer('⏱ - timer for "configuration button" started. total:' + (++_timerCount));
        _logDebug('bindConfigButton:' + Date());

        /*
        // detect history change
        (function(history) {
            var pushState = history.pushState;
            history.pushState = function(state) {
                if (typeof history.onpushstate == "function") 
                {
                    history.onpushstate({
                        state: state
                    });
                }
                return pushState.apply(history, arguments);
            }
        })(window.history);
        window.onpopstate = history.onpushstate = function(e) 
        {
            console.log('History has been modified!')
            console.log(e)
            
            //main();
        };
        */

        // detect document.location change
        var oldHref = document.location.href;
        window.onload = function () {
            var bodyList = document.querySelector("body")

            var observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    if (oldHref != document.location.href) {
                        oldHref = document.location.href;

                        console.log('document.location has been modified!')
                        main();
                    }
                });
            });

            var config = {
                childList: true,
                subtree: true
            };

            observer.observe(bodyList, config);
        };

        //// windows events
        window.addEventListener('deviceorientation', e => {
            _logDebug('window deviceorientation:' + Date());
            main();
        });
        //window.addEventListener('focus', e => { _logDebug('window focus:' + Date() );});
        //window.addEventListener('blur', e => { _logDebug('window blur:' + Date() );});
        /*window.addEventListener('popstate', e => {
            _logDebug('window popstate:' + Date() );
        });
        window.addEventListener('pushstate', e => {
            _logDebug('window pushstate:' + Date() );
        });
        window.addEventListener('replacestate', e => {
            _logDebug('window replacestate:' + Date() );
        });
        window.addEventListener('locationchange', e => {
            _logDebug('window locationchange:' + Date() );
        });
        window.addEventListener('DOMContentLoaded', e => {
            _logDebug('window DOMContentLoaded:' + Date() );
        });
        window.addEventListener('newcontentadded', e => {
            _logDebug('window newContentAdded:' + Date() );
        });
        window.addEventListener('ajaxcomplete', e => {
            _logDebug('window ajaxComplete:' + Date() );
        });
        window.addEventListener('focus', e => {
            _logDebug('window focus:' + Date() );
        });
        window.addEventListener('click', e => {
            _logDebug('window click:' + Date() );

        monitorEvents(window);
        unmonitorEvents(window, "mouseout");
        unmonitorEvents(window, "mousemove");
        unmonitorEvents(window, "mouseover");
        unmonitorEvents(window, "mouseup");
        unmonitorEvents(window, "mousedown");
        unmonitorEvents(window, "mouseleave");

        unmonitorEvents(window, "pointerout");
        unmonitorEvents(window, "pointermove");
        unmonitorEvents(window, "pointerover");
        unmonitorEvents(window, "pointerup");
        unmonitorEvents(window, "pointerdown");
        unmonitorEvents(window, "pointerleave");

        unmonitorEvents(window, "mousewheel");

        unmonitorEvents(window, "scroll");
        });*/

        //jQuery legacyvar $ = window.jQuery;

        // global objects
        var _tempoWeb = [];
        var _tempoApi = [];
        var _tempoDesktop = [];
        var _tempoMobile = [];
        var _tempoIT = [];
        var _tempoTesting = [];
        var _tempoAutomation = [];
        var _tempoIssues = [];
        var _tempoBugsInsideStories = [];
        var _tempoIssue = [];
        var _tempoRelease = [];
        var _usersInSubtasks = [];
        var _branchsInRelease = [];
        var _branchsMerged = [];

        var _timerCount = 0;

        //// Check updates
        if (_configUser.checkUpdates.enabled) {
            /*fetch(_configInternal.checkUpdates.updateUrl)
            .then(response => {
                return response.text()
            })
            .then(text => {
                let serverVersion = new RegExp( /(\d[^-\s]*)/gi ).exec(text)[0];
                let newerVersion = serverVersion > _jiraStuffVersion;
                _configInternal.checkUpdates.updateAvailable = true;
                _logDebug('serverVersion:' + serverVersion + ' canUpdate:' +  newerVersion);
            });*/

            var script = document.createElement('script');
            script.src = 'https://openuserjs.org/meta/pedronunespapersoft/JiraStuff.meta.js?callback=foo'
            document.head.appendChild(script);
        }

        // timers
        var _timerBoard = -1;
        var _timerIssuePopup = -1;
        var _timerHeaderActions = -1;
        var _timerIssues = -1;
        var _timerReleases = -1;
        var _timerCreateJenkinsLinks = -1;
        var _timerUpdatePRsState = -1;

        ////////////////////////
        //// MAIN execution ////
        ////////////////////////

        function clearTimers() {
            if (_timerBoard >= 0) {
                _logDebug('clearing timerBoard:' + _timerBoard);
                clearInterval(_timerBoard);
            }
            if (_timerIssuePopup >= 0) {
                _logDebug('clearing _timerIssuePopup:' + _timerIssuePopup);
                clearInterval(_timerIssuePopup);
            }
            if (_timerHeaderActions >= 0) {
                _logDebug('clearing _timerHeaderActions:' + _timerHeaderActions);
                clearInterval(_timerHeaderActions);
            }
            if (_timerIssues >= 0) {
                _logDebug('clearing _timerIssues:' + _timerIssues);
                clearInterval(_timerIssues);
            }
            if (_timerReleases >= 0) {
                _logDebug('clearing _timerReleases:' + _timerReleases);
                clearInterval(_timerReleases);
            }
            if (_timerCreateJenkinsLinks >= 0) {
                _logDebug('clearing _timerCreateJenkinsLinks:' + _timerCreateJenkinsLinks);
                clearInterval(_timerCreateJenkinsLinks);
            }
            if (_timerUpdatePRsState >= 0) {
                _logDebug('clearing _timerUpdatePRsState:' + _timerUpdatePRsState);
                clearInterval(_timerUpdatePRsState);
            }
        }

        function main() {

            clearTimers();

            // update page location
            getLocation();

            _tempoWeb = [];
            _tempoApi = [];
            _tempoDesktop = [];
            _tempoMobile = [];
            _tempoIT = [];
            _tempoTesting = [];
            _tempoAutomation = [];
            _tempoIssues = [];
            _tempoBugsInsideStories = [];
            _tempoIssue = [];
            _tempoRelease = [];
            _usersInSubtasks = [];
            _branchsInRelease = [];
            _branchsMerged = [];

            //// BOARD page
            if (_page.isBoard) {
                _logDebug('isBoard');
                if (_configUser.board.timeByTeam.enabled || _configUser.board.deadEnds.enabled || _configUser.board.leadTime.enabled || _configUser.board.openIssuesInStories.enabled) {

                    // load tempo
                    if (_configUser.board.timeByTeam.enabled) {
                        _logDebug('timeByTeam');

                        //merge Web Team
                        if (_configUser.board.timeByTeam.mergeWebTeam) {
                            if (_configUser.board.timeByTeam.componentWeb) {
                                //type = 'Development+Web'
                                //issuetype = 'Development+Web'
                                getTimesByType(_tempoWeb, 'Development+Web');
                            }
                            if (_configUser.board.timeByTeam.componentApi) {
                                //type = 'Development+API'
                                //issuetype = 'Development+API'
                                getTimesByType(_tempoWeb, 'Development+API');
                            }
                            if (_configUser.board.timeByTeam.componentDesktop) {
                                //type = 'Development+Desktop'
                                //issuetype = 'Development+Desktop'
                                getTimesByType(_tempoWeb, 'Development+Desktop');
                            }
                        }
                        else {
                            if (_configUser.board.timeByTeam.componentWeb) {
                                //type = 'Development+Web'
                                //issuetype = 'Development+Web'
                                getTimesByType(_tempoWeb, 'Development+Web');
                            }
                            if (_configUser.board.timeByTeam.componentApi) {
                                //type = 'Development+API'
                                //issuetype = 'Development+API'
                                getTimesByType(_tempoApi, 'Development+API');
                            }
                            if (_configUser.board.timeByTeam.componentDesktop) {
                                //type = 'Development+Desktop'
                                //issuetype = 'Development+Desktop'
                                getTimesByType(_tempoDesktop, 'Development+Desktop');
                            }
                        }
                        // mobile
                        if (_configUser.board.timeByTeam.componentMobile) {
                            //type = 'Development+Mobile'
                            //issuetype = 'Development+Mobile'
                            getTimesByType(_tempoMobile, 'Development+Mobile');
                        }
                        // IT
                        if (_configUser.board.timeByTeam.componentIT) {
                            //issuetype = 'IT+'
                            getTimesByType(_tempoIT, 'IT+');
                        }
                        // testing
                        if (_configUser.board.timeByTeam.componentTesting) {
                            //type = 'Testing++'
                            //issuetype = 'Testing++'
                            getTimesByType(_tempoTesting, 'Testing++');
                        }
                        // automation
                        if (_configUser.board.timeByTeam.componentAutomation) {
                            //type = 'Automation+Testing'
                            //issuetype = 'Automation+Testing'
                            getTimesByType(_tempoAutomation, 'Automation+Testing');
                        }

                        if (_configUser.board.timeByTeam.openIssuesInStories || _configUser.board.timeByTeam.openClarificationsInStories) {
                            getBugsInsideStory();
                            getTimesByType(_tempoIssues, 'Issue');
                        }
                    }

                    // detect board load if issues are found (nasty)
                    let loadBoard = function () {
                        _logTimer('👀 - looking for [board] double rainbow : ' + _timerBoard);

                        // get all issues not marked
                        let issueElems = document.querySelectorAll('.ghx-issue:not([data-jira-stuff-board])');
                        if (issueElems.length > 0) {
                            _logDebug('🌈🌈 - Board with double rainbow ALL THE WAY!');

                            // reduce column headers
                            if (_configUser.board.reduceColumnHeaders.enabled) {
                                reduceColumnHeaders();
                            }

                            // loop issues
                            issueElems.forEach((issueElem, i) => {

                                try {
                                    // mark issue
                                    issueElem.dataset.jiraStuffBoard = Date();

                                    //lead time
                                    if (_configUser.board.leadTime.enabled) {
                                        setLeadTime(issueElem);
                                    }
                                    //dead ends
                                    if (_configUser.board.deadEnds.enabled) {
                                        setDeadEnds(issueElem);
                                    }
                                    // remaing time
                                    if (_configUser.board.timeByTeam.enabled) {
                                        setTimeByIssue(issueElem);
                                    }
                                    // missing hours in planning
                                    if (_configUser.board.missingHoursInPlanning.enabled) {
                                        document.querySelectorAll('[data-column-id="30"] [data-tooltip="Σ Original Estimate: None"], [data-column-id="31"] [data-tooltip="Σ Original Estimate: None"]').forEach(x => {
                                            let issueElem = x.closest('.ghx-issue');
                                            // issues not assigned to eurico || iago silva
                                            if (!issueElem.querySelector('[data-tooltip="Assignee: Eurico Batista"],[data-tooltip="Assignee: Iago Silva"]')) {
                                                issueElem.style.backgroundColor = 'plum';
                                            }
                                        });
                                        //setMissingHoursInPlanning(issueElem);
                                    }
                                    if (_configUser.board.timeByTeam.showUsersWorkingSubtasks) {
                                        setUsersWorkingSubtasks(issueElem);
                                    }
                                }
                                catch (e) {
                                    _logError('loadBoard: ', e);
                                }
                            });

                            // remaing times in columns
                            if (_configUser.board.timeByTeam.enabled) {
                                setTimeByColumn();
                            }

                            // show PR info
                            if (_configUser.board.PRs.enabled) {
                                // get all issues in 'Review' column (data-column-id="41")
                                let reviewElems = document.querySelectorAll('[data-column-id="41"] .ghx-issue:not([data-jira-stuff-pr])');
                                reviewElems.forEach((issueElem, i) => {
                                    j_setPrInfo(issueElem);
                                });
                            }

                            // clear timer
                            clearTimeout(_timerBoard);
                            _logTimer('⏱ - timer (' + _timerBoard + ') for [board] ended. total:' + _timerCount);
                        }
                    };

                    // hook load detection
                    _timerBoard = window.setInterval(loadBoard, _configUser.board.timer.intervalSeconds);
                    _logTimer('⏱ - timer for [board] started. total:' + (++_timerCount));

                    /*
                    // detect issue popup
                    let loadIssuePopup = function() {
                        _logTimer('👀 - looking for [issue popup] double rainbow : ' + _timerIssuePopup);
    
                        let issuePopupElem = document.querySelector('#jira-issue-header');
                        if(issuePopupElem) {
                            // extrat 'ATLANTIS-6675' from '/browse/ATLANTIS-6675'
                            var popupIssueKey = document.querySelector('#jira-issue-header a').href.split('/').pop();
                            handleIssuesPage(popupIssueKey);
                        }
                    }
                    // hook load detection
                    _timerIssuePopup = window.setInterval(loadIssuePopup, _configUser.board.timer.intervalSeconds);
                    _logTimer('⏱ - timer for [issue popup] started. total:' + (++_timerCount));
                    */
                }
            }

            //// ISSUES page
            if (_page.isIssues) {
                _logDebug('isIssues');

                // show the time for each subtask in issues old view page
                handleIssuesPage();
            }

            //// RELEASES page
            if (_page.isReleases) {
                _logDebug('isReleases');

                // missing fixed version
                if (_configUser.releases.missingFixedVersion.enabled) {
                    setMissingFixVersionLink();
                }

            }

            //// RELEASE page
            if (_page.isRelease) {
                _logDebug('isRelease');

                let loadReleases = function () {
                    _logTimer('👀 - looking for [release] double rainbow : ' + _timerReleases);

                    // get all issues not marked
                    let issueElems = document.querySelectorAll('[data-testid="software-releases-version-detail.common.ui.issue-table"] img+a:not([data-jira-stuff-releases])');
                    if (issueElems.length > 0) {
                        _logDebug('🌈🌈 - [release] with double rainbow ALL THE WAY!');

                        let issueKeys = getIssueKeys(issueElems);
                        //let issueIds = getIssueIds();
                        // get issueIds from keys

                        if (_configUser.releases.documentationTasks.enabled) {
                            setDocumentationLinkByRelease(issueKeys);
                        }

                        //let issueElems = getIssueElems();

                        //(OBSOLETE - releases.bugTimesByRelease)
                        // show the time for each subtask in issues old view page
                        //if(_configUser.releases.bugTimesByRelease.enabled) {
                        //
                        //    getBugTimesByRelease(issueKeys)
                        //    .then( x => {
                        //        setBugTimesByRelease();
                        //    });
                        //
                        //    //// hook load detection
                        //    //const timerReleases = window.setInterval(loadIssues, _config.releases.timer.intervalSeconds);
                        //
                        //    //setBugTimesByRelease(subtaskElem);
                        //}
                        //(OBSOLETE - releases.bugTimesByRelease)

                        //(OBSOLETE - releases.showBranchs)
                        //if(_configUser.releases.showBranchs.enabled) {
                        //    setBranchsInReleaseContainer();
                        //    issueElems.forEach((issueElem, i) => {
                        //
                        //        let issueKey = issueElem.querySelector("a").href.split("/").pop();
                        //        getBranchsInRelease(issueKey);
                        //
                        //    });
                        //}
                        //(OBSOLETE - releases.showBranchs)

                        // clear timer
                        clearTimeout(_timerReleases);
                        _logTimer('⏱ - timer (' + _timerReleases + ') for [issue header actions] ended. total:' + _timerCount);
                    }
                }

                // hook load detection
                _timerReleases = window.setInterval(loadReleases, _configUser.releases.timer.intervalSeconds);
                _logTimer('⏱ - timer for [releases] started. total:' + (++_timerCount));
            }

        }
        main();

        /////////////////////
        ///// FUNCTIONS /////
        /////////////////////

        //// * ISSUES * ////

        //// --- ISSUES handleIssuesPage * ////
        function handleIssuesPage(issueKey) {
            if (!issueKey) {
                issueKey = _page.issueKey;
            }

            if (_configUser.issues.timeBySubtaskOld.enabled && _page.isOldIssueView) {
                setTimesBySubtaskOld();
            }

            // show the time for each subtask in issues
            if (_configUser.issues.timeBySubtaskNew.enabled && !_page.isOldIssueView) {
                _logDebug('isIssues - new view');
                // load tempo
                getSubtasksTime(issueKey);

                // detect board load if issues are found (nasty)
                let loadIssues = function () {
                    _logTimer('🔎 - looking for [issue] double rainbow : ' + _timerIssues);

                    // get all issues not marked
                    //let subtaskElems = document.querySelectorAll('[data-testid="issue.issue-view.views.common.child-issues-panel.issues-container"] > ul > div [data-rbd-draggable-id]:not([data-jira-stuff-issues]');
                    let subtaskElems = document.querySelectorAll(
                        '[data-testid="issue.issue-view.views.common.child-issues-panel.issues-container"] > ul > div [data-test-id="issue.issue-view.views.common.issue-line-card.issue-line-card-view.key"]:not([data-jira-stuff-issues]');
                    if (subtaskElems.length > 0) {
                        _logDebug('💪 [issues] found');
                        // loop issues
                        subtaskElems.forEach((subtaskElem) => {

                            // mark issue
                            subtaskElem.dataset.jiraStuffIssues = Date();

                            // timeBySubtaskNew
                            if (_configUser.issues.timeBySubtaskNew.enabled) {
                                setTimesBySubtaskNew(subtaskElem, issueKey.toLowerCase());
                            }

                        });

                        // clear timer
                        clearTimeout(_timerIssues);
                        _logTimer('⏱ - timer (' + _timerIssues + ') for [issues] ended. total:' + _timerCount);
                    }
                };

                // task genie && log time
                if ((_configUser.issues.taskGenie.enabled || _configUser.issues.logTime.task) && !_page.isOldIssueView) {

                    let loadIssueHeaderActions = function () {
                        _logTimer('🔎 - looking for [issue header actions] double rainbow : ' + _timerHeaderActions);

                        // get header actions
                        const headerActions = document.querySelectorAll('#jira-issue-header-actions > div > div div');
                        const taskGenieElem = document.querySelector('#taskGenieBtn');
                        const logTimeElem = document.querySelector('#logTimeBtn');
                        if (headerActions.length > 0 && !taskGenieElem && !logTimeElem) {
                            _logDebug('💪 [issue header actions] found');

                            // task genie
                            if (_configUser.issues.taskGenie.enabled) {
                                setTaskGenie();
                            }

                            // log time
                            if (_configUser.issues.logTime.task) {
                                setLogTime();
                            }

                            // clear timer
                            clearTimeout(_timerHeaderActions);
                            _logTimer('⏱ - timer (' + _timerHeaderActions + ') for [issue header actions] ended. total:' + _timerCount);
                        }
                    };

                    // hook load detection
                    _timerHeaderActions = window.setInterval(loadIssueHeaderActions, _configUser.issues.timer.intervalSeconds);
                    _logTimer('⏱ - timer for [issue header actions] started. total:' + (++_timerCount));
                }

                // styles
                if (!_page.isOldIssueView) {

                    // change
                    if (_configUser.issues.styles.changeTaskStatusFixedSize) {
                        let styleElem = document.createElement('style');
                        styleElem.className = 'jiraStuff changeTaskStatusFixedSize';
                        styleElem.innerHTML = _jiraCSS.issues.changeTaskStatusFixedSize;

                        document.body.appendChild(styleElem);
                    }

                }

                // hook load detection
                _timerIssues = window.setInterval(loadIssues, _configUser.issues.timer.intervalSeconds);
                _logTimer('⏱ - timer for [issues] started. total:' + (++_timerCount));
            }
        }
        ////  * ISSUES handleIssuesPage --- ////

        //// --- ISSUES taskGenie * ////
        function setTaskGenie() {
            _logDebug('setTaskGenie');

            //// create button
            const btnElem = document.createElement('div');
            btnElem.id = 'taskGenieBtn';
            btnElem.className = 'jiraStuff taskGenie';
            btnElem.style.paddingTop = '7px';
            btnElem.style.marginRight = '14px';
            btnElem.style.cursor = 'pointer';
            btnElem.innerHTML = _jiraStuffHTML.taskGenie;
            btnElem.title = 'task genie - wish a task, genie makes it!';

            // bind toggle visibility
            btnElem.addEventListener('click', e => {

                if (e.target.id === 'taskGenieBtn') {
                    _logDebug('setTaskGenie open click');

                    let container = btnElem.querySelector('#jsf_taskGenieContainer');
                    let containerIsVisible = container.style.display !== 'none';
                    container.style.display = containerIsVisible ? 'none' : 'block';

                    //clear values
                    btnElem.querySelector('#jiraStuff_issues_taskGenie_summary').value = '';
                    btnElem.querySelector('#jiraStuff_issues_taskGenie_description').value = '';
                    btnElem.querySelector('#jiraStuff_issues_taskGenie_estimatedHours').value = 0;
                    btnElem.querySelector('#jiraStuff_issues_taskGenie_selectedButton').hidden = true;
                }
            });

            //insert elem
            const insertContainer = document.querySelector('#jira-issue-header-actions > div > div');
            insertContainer.appendChild(btnElem);

            // set cost code
            let costCodeBtn = document.querySelector('[data-test-id="issue.views.field.select.common.select-inline-edit.customfield_10091"] button');
            document.querySelector('#jiraStuff_issues_taskGenie_costCode').value = costCodeBtn ? costCodeBtn.parentElement.textContent : 'N/A';

            // set client
            let clientBtn = document.querySelector('[data-test-id="issue.views.field.select.common.select-inline-edit.customfield_10083"] button');
            document.querySelector('#jiraStuff_issues_taskGenie_client').value = clientBtn ? clientBtn.parentElement.textContent : 'PAPERSOFT';

            let genieClick = function (label, summary, estimatedHours, issueType, componentName) {
                _logDebug('genieClick label:' + label);
                //hide messages
                document.querySelector('#jiraStuff_issues_taskGenie_saveOk').hidden = true;
                document.querySelector('#jiraStuff_issues_taskGenie_saveNotOk').hidden = true;

                // SetSelectedButtonLabel
                let labelElem = btnElem.querySelector('#jiraStuff_issues_taskGenie_selectedButton');
                labelElem.textContent = label;
                labelElem.hidden = false;

                let inputContainerElem = btnElem.querySelector('#jiraStuff_issues_taskGenie_inputs');
                inputContainerElem.hidden = false;

                // summary
                btnElem.querySelector('#jiraStuff_issues_taskGenie_summary').value = summary;
                btnElem.querySelector('#jiraStuff_issues_taskGenie_description').value = '';
                if (estimatedHours || estimatedHours === 0) {
                    btnElem.querySelector('#jiraStuff_issues_taskGenie_estimatedHours').value = estimatedHours;
                }

                // hidden inputs
                btnElem.querySelector('#jiraStuff_issues_taskGenie_issueType').value = issueType;
                //btnElem.querySelector('#jiraStuff_issues_taskGenie_componentId').value = componentId;
                btnElem.querySelector('#jiraStuff_issues_taskGenie_componentName').value = componentName;

                // focus on summary
                btnElem.querySelector('#jiraStuff_issues_taskGenie_summary').focus();
            };

            // attach button events
            let issueKey = _page.issueKey.toUpperCase();
            btnElem.querySelector('#jiraStuff_issues_taskGenie_btnWeb').addEventListener('click', e => {
                genieClick('WEB 🌐', '[WEB] ', null, 'Development Web', 'Web Portal');
            });
            btnElem.querySelector('#jiraStuff_issues_taskGenie_btnApiAuth').addEventListener('click', e => {
                genieClick('AUTH API ⚙️', '[AUTH API] ', null, 'Development API', 'Authentication API');
            });
            btnElem.querySelector('#jiraStuff_issues_taskGenie_btnApiBusiness').addEventListener('click', e => {
                genieClick('BUSINESS API ⚙️', '[BUSINESS API] ', null, 'Development API', 'Business API');
            });
            btnElem.querySelector('#jiraStuff_issues_taskGenie_btnApiSubmission').addEventListener('click', e => {
                genieClick('SUBMISSION API ⚙️', '[SUBMISSION API] ', null, 'Development API', 'Submission API ');
            });
            btnElem.querySelector('#jiraStuff_issues_taskGenie_btnApiDocumental').addEventListener('click', e => {
                genieClick('DOCUMENTAL API ⚙️', '[DOCUMENTAL API] ', null, 'Development API', 'Documental API');
            });
            btnElem.querySelector('#jiraStuff_issues_taskGenie_btnApiDataValidatorClient').addEventListener('click', e => {
                genieClick('DV (CLIENT) api ⚙️', '[DATAVALIDATOR (CLIENT) API] ', null, 'Development API', 'DataValidator API (Client)');
            });
            btnElem.querySelector('#jiraStuff_issues_taskGenie_btnApiDataValidatorWaynbo').addEventListener('click', e => {
                genieClick('DV (WAYNBO)  ⚙️', '[DATAVALIDATOR (WAYNBO) API] ', null, 'Development API', 'DataValidator API (Waynbo)');
            });
            btnElem.querySelector('#jiraStuff_issues_taskGenie_btnApiNotification').addEventListener('click', e => {
                genieClick('NOTIFICATION API ⚙️', '[NOTIFICATION API] ', null, 'Development API', 'Notification API');
            });
            btnElem.querySelector('#jiraStuff_issues_taskGenie_btnWinService').addEventListener('click', e => {
                genieClick('WIN SERVICE 🖥️', '[WINDOWS SERVICE] ', null, 'Development Desktop', 'Service Windows');
            });
            btnElem.querySelector('#jiraStuff_issues_taskGenie_btnDesktop').addEventListener('click', e => {
                genieClick('DESKTOP 🖥️', '[DESKTOP] ', null, 'Development Desktop', 'Desktop App');
            });
            btnElem.querySelector('#jiraStuff_issues_taskGenie_btnMobile').addEventListener('click', e => {
                genieClick('MOBILE 📱', '[MOBILE] ', null, 'Development Mobile', 'Mobile App');
            });
            btnElem.querySelector('#jiraStuff_issues_taskGenie_btnIT').addEventListener('click', e => {
                genieClick('IT 🕹️', '[IT] ', null, 'IT ', null);
            });

            //testing
            btnElem.querySelector('#jiraStuff_issues_taskGenie_btnTestingWeb').addEventListener('click', e => {
                genieClick('TESTING WEB 🔎', '[QA WEB] ', null, 'Testing  ', 'Web Portal');
            });
            btnElem.querySelector('#jiraStuff_issues_taskGenie_btnTestingMobile').addEventListener('click', e => {
                genieClick('TESTING MOBILE 🔎', '[QA MOBILE] ', null, 'Testing  ', 'Mobile App');
            });

            // bugs
            btnElem.querySelector('#jiraStuff_issues_taskGenie_btnBugApi').addEventListener('click', e => {
                genieClick('BUG API 🐞⚙️', '[ISSUE API] ', null, 'Issue', 'API');
            });
            btnElem.querySelector('#jiraStuff_issues_taskGenie_btnBugWeb').addEventListener('click', e => {
                genieClick('BUG WEB 🐞🌐', '[ISSUE WEB] ', null, 'Issue', 'Web Portal');
            });
            btnElem.querySelector('#jiraStuff_issues_taskGenie_btnBugMobile').addEventListener('click', e => {
                genieClick('BUG MOBILE 🐞📱', '[ISSUE MOBILE] ', null, 'Issue', 'Mobile App');
            });

            // Meta
            btnElem.querySelector('#jiraStuff_issues_taskGenie_btnCodeReview').addEventListener('click', e => {
                genieClick('CODE REVIEW 👀', 'Code Review', 2, 'Code Review', null);
            });
            btnElem.querySelector('#jiraStuff_issues_taskGenie_btnClarifications').addEventListener('click', e => {
                genieClick('CLARIFICATIONS ❓', 'Clarifications', 0, 'Clarification Meeting', null);
            });
            btnElem.querySelector('#jiraStuff_issues_taskGenie_btnMeetings').addEventListener('click', e => {
                genieClick('MEETINGS 🤝', 'Meetings', 0, 'Clarification Meeting', null);
            });
            btnElem.querySelector('#jiraStuff_issues_taskGenie_btnReleaseNotes').addEventListener('click', e => {
                genieClick('RELEASE NOTES 🚀', 'Release Notes', 1, ' Documentation', null);
            });

            // attach save event
            document.querySelector('#jiraStuff_issues_taskGenie_save').addEventListener('click', e => {
                let issueLabel = document.querySelector('#jiraStuff_issues_taskGenie_selectedButton').textContent;
                j_createSubTask(issueLabel);
            });

        }

        //// * ISSUES taskGenie --- ////

        //// --- ISSUES TimeBySubtask New * ////
        function setTimesBySubtaskNew(subtaskKeyElem, currentIssueKey) {
            //let currentIssueKey = _page.getCurrentIssueKey();
            let issueTempo = _tempoIssue.filter(x => x.parentKey === currentIssueKey)[0];
            let issueKey = subtaskKeyElem.textContent;
            let subtaskElem = subtaskKeyElem.parentElement.parentElement;

            //_logDebug('setTimesBySubtaskNew - parentKey:' + currentIssueKey + ' id:' + subtaskElem.dataset.rbdDraggableId);
            _logDebug('setTimesBySubtaskNew - parentKey:' + currentIssueKey + ' key:' + issueKey);

            // get Subtask times for new issue, then execute this function
            if (!issueTempo) {
                getSubtasksTime(currentIssueKey, () => { setTimesBySubtaskNew(subtaskKeyElem, currentIssueKey); });
            }
            else {
                // logTime
                if (_configUser.issues.logTime.subtasks) {
                    setLogTimeSubtask(subtaskKeyElem);
                }

                let subtaskTempo = issueTempo.subtasks.filter(x => x.key === issueKey)[0];
                if (subtaskTempo) {
                    // create html elem
                    let apendiceGraph = subtaskElem.parentElement.parentElement.querySelector('[data-testid="issue.views.common.issue-line-card.issue-line-card.mini-time-log-graph"]');
                    if (apendiceGraph) {
                        // hide default graph
                        if (_configUser.issues.timeBySubtaskNew.hideDefaultGraph) {
                            apendiceGraph.parentElement.hidden = true;
                        }
                    }

                    // find priority elem
                    subtaskElem.querySelectorAll('img').forEach(imgElem => {
                        if (imgElem.src.indexOf('/icons/priorities/') >= 0 && imgElem.parentElement && imgElem.parentElement.parentElement) {

                            // new time elem
                            let newGraphElem = document.createElement('div');
                            newGraphElem.className = 'jiraStuff timeBySubtask';
                            newGraphElem.style = 'margin-right: 0 8px';
                            newGraphElem.innerHTML = _jiraStuffHTML.timeBySubtask;
                            let estimatedTotal = subtaskTempo.remainingEstimateHours + subtaskTempo.timeSpentHours;
                            let max = Math.max(subtaskTempo.originalEstimateHours, estimatedTotal);

                            // estimated
                            if (subtaskTempo.originalEstimateHours > 0) {
                                let estimatedElem = newGraphElem.querySelector('.estimated');
                                estimatedElem.textContent = subtaskTempo.originalEstimate;
                                estimatedElem.title = 'estimated: ' + subtaskTempo.originalEstimate;
                                let estimatedElemWith = subtaskTempo.originalEstimateHours / max * 100;
                                estimatedElem.style.width = estimatedElemWith + '%';
                            }

                            // estimatedTotal
                            if (estimatedTotal > 0) {
                                let estimatedTotalElem = newGraphElem.querySelector('.estimatedTotal');
                                let estimatedTotalElemWith = estimatedTotal / max * 100;
                                estimatedTotalElem.style.width = estimatedTotalElemWith + '%';
                            }

                            // reported
                            if (subtaskTempo.timeSpentHours > 0) {
                                let reportedElem = newGraphElem.querySelector('.reported');
                                reportedElem.textContent = subtaskTempo.timeSpent;
                                reportedElem.title = 'reported: ' + subtaskTempo.timeSpent;
                                let reportedElemWith = subtaskTempo.timeSpentHours / estimatedTotal * 100;
                                reportedElem.style.width = reportedElemWith + '%';
                            }

                            // remaining
                            if (subtaskTempo.remainingEstimateHours > 0) {
                                let remainingElem = newGraphElem.querySelector('.remaining');
                                remainingElem.textContent = subtaskTempo.remainingEstimate;
                                remainingElem.title = 'remaining: ' + subtaskTempo.remainingEstimate;
                                let remainingElemWith = subtaskTempo.remainingEstimateHours / estimatedTotal * 100;
                                remainingElem.style.width = remainingElemWith + '%';
                            }
                            imgElem.parentElement.parentElement.after(newGraphElem);

                            // hide priority
                            if (_configUser.issues.timeBySubtaskNew.hidePriority) {
                                imgElem.parentElement.parentElement.hidden = true;
                            }

                            // cost code
                            if (_configUser.issues.timeBySubtaskNew.costCode) {
                                if (subtaskTempo.costCode === '-1' || subtaskTempo.costCode === '10147') { //10147 - 'N/A'
                                    let costCodeElem = document.createElement('div');
                                    costCodeElem.className = 'jiraStuff costcode';
                                    costCodeElem.style.marginRight = '1em';
                                    costCodeElem.textContent = '💸';
                                    costCodeElem.title = 'missing cost code';
                                    imgElem.parentElement.parentElement.after(costCodeElem);// new cost code elem
                                }
                            }

                            // copyIssueId
                            if (_configUser.issues.timeBySubtaskNew.copyIssueId) {
                                let copyIssueIdElem = document.createElement('a');
                                copyIssueIdElem.className = 'jiraStuff copyIssueId';
                                copyIssueIdElem.style.marginLeft = '0.4em';
                                copyIssueIdElem.style.cursor = 'copy';
                                copyIssueIdElem.style.textDecoration = 'none';

                                // on click
                                copyIssueIdElem.onclick = (event) => {

                                    // copy to clipboard
                                    navigator.clipboard.writeText(issueKey.toUpperCase());

                                    // change cursor to default
                                    event.target.style.cursor = 'default';

                                    // restore cursor to copy, after 10s
                                    setTimeout(() => {
                                        event.target.style.cursor = 'copy';
                                    }, 10000);

                                    return false;
                                };

                                copyIssueIdElem.textContent = '©';
                                copyIssueIdElem.title = 'copy issue id';
                                let keyElem = subtaskElem.parentElement.parentElement.querySelector('[data-test-id="issue.issue-view.views.common.issue-line-card.issue-line-card-view.key"]');
                                keyElem.parentElement.after(copyIssueIdElem); // copyIssueId
                            }

                        }
                    });
                }
            }
        }

        function getSubtasksTime(parentKey, callback) {
            let hasCallback = callback ? true : false;
            _logDebug('getSubtasksTime - parentKey:' + parentKey + (hasCallback ? ' with callback' : ''));

            //get all tasks for with parentKey
            let url = 'https://papersoft-dms.atlassian.net/rest/api/3/search?jql='
                + 'project+%3D+ATLANTIS+AND+parent+%3D+'
                + parentKey
                + '&fields=summary,timetracking,customfield_10091&maxResults=200';
            //customfield_10091 - costcode
            _logDebug('getSubtasksTime - 🎃 fetch:' + url);

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    let issueTempo = {
                        parentKey: parentKey,
                        subtasks: []
                    };
                    data.issues.forEach((issue) => {
                        let subtask = {
                            id: issue.id,
                            key: issue.key,
                            originalEstimate: issue.fields.timetracking.originalEstimate ? issue.fields.timetracking.originalEstimate : '',
                            remainingEstimate: issue.fields.timetracking.remainingEstimate ? issue.fields.timetracking.remainingEstimate : '',
                            timeSpent: issue.fields.timetracking.timeSpent ? issue.fields.timetracking.timeSpent : '',
                            originalEstimateHours: (issue.fields.timetracking.originalEstimateSeconds ? issue.fields.timetracking.originalEstimateSeconds : 0) / 3600,
                            remainingEstimateHours: (issue.fields.timetracking.remainingEstimateSeconds ? issue.fields.timetracking.remainingEstimateSeconds : 0) / 3600,
                            timeSpentHours: (issue.fields.timetracking.timeSpentSeconds ? issue.fields.timetracking.timeSpentSeconds : 0) / 3600,
                            costCode: issue.fields.customfield_10091 ? issue.fields.customfield_10091.id : '-1'
                        };

                        issueTempo.subtasks.push(subtask);
                    });

                    _tempoIssue.push(issueTempo);
                    //if bigger then max size remove oldest
                    if (_tempoIssue.length > _configUser.issues.timeBySubtaskNew.maxHistorySize) {
                        _tempoIssue.shift();
                    }

                    if (callback) {
                        _logDebug('getSubtasksTime: callback');
                        callback();
                    }

                });
        }

        //// * ISSUES TimeBySubtask New --- ////

        //// --- ISSUES LogTime * ////

        function setLogTimeSubtask(subtaskKeyElem) {
            let currentIssueKey = _page.getCurrentIssueKey();
            let issueKey = subtaskKeyElem.textContent;
            let issueTempo = _tempoIssue.filter(x => x.parentKey === currentIssueKey)[0];
            let issueId = issueTempo?.subtasks?.filter(x => x.key === issueKey)[0]?.id;
            if (issueId) {
                let subtaskElem = subtaskKeyElem.parentElement.parentElement;

                ///plugins/servlet/ac/is.origo.jira.tempo-plugin/is.origo.jira.tempo-plugin__tempo-log-work-issue-action?project.key=ATLANTIS&amp;project.id=10003&amp;issue.id=15320&amp;issue.key=ATLANTIS-5190&amp;issuetype.id=10020
                let logTimeHref = 'https://papersoft-dms.atlassian.net/plugins/servlet/ac/is.origo.jira.tempo-plugin/is.origo.jira.tempo-plugin__tempo-log-work-issue-action'
                    + '?project.key=ATLANTIS'
                    + '&project.id=10003'
                    + '&issue.id=' + issueId
                    + '&issue.key=' + issueKey;

                _logDebug('setLogTimeSubtask - ⛄ href:' + logTimeHref);

                // logTime container
                let logTimeContainerElem = document.createElement('div');
                logTimeContainerElem.className = 'jiraStuff logTitme';

                // logTime elem
                let logTimeElem = document.createElement('a');
                logTimeElem.className = 'ap-dialog ap-plugin-key-is.origo.jira.tempo-plugin ap-module-key-tempo-log-work-issue-action ap-link-webitem';
                logTimeElem.style.textDecoration = 'none';
                logTimeElem.title = 'log time - subtask : ' + issueKey;
                logTimeElem.href = logTimeHref;
                logTimeElem.textContent = '⏱️';

                // append elems
                logTimeContainerElem.appendChild(logTimeElem);
                subtaskElem.appendChild(logTimeContainerElem);
            }
            else {
                _logDebug('getSubtasksTime - 🏴‍☠️ task not found');
            }
        }

        function setLogTime() {
            _logDebug('setLogTime');
            let currentIssueKey = _page.getCurrentIssueKey();

            //// create button
            const btnLogTimeElem = document.createElement('div');
            btnLogTimeElem.id = 'logTimeBtn';
            btnLogTimeElem.className = 'jiraStuff logtime';
            btnLogTimeElem.style.paddingTop = '7px';
            btnLogTimeElem.style.marginRight = '14px';

            // logTime elem
            let logTimeHref = 'https://papersoft-dms.atlassian.net/plugins/servlet/ac/is.origo.jira.tempo-plugin/is.origo.jira.tempo-plugin__tempo-log-work-issue-action'
                + '?project.key=ATLANTIS'
                + '&project.id=10003'
                + '&issue.key=' + currentIssueKey;
            let logTimeElem = document.createElement('a');
            logTimeElem.className = 'ap-dialog ap-plugin-key-is.origo.jira.tempo-plugin ap-module-key-tempo-log-work-issue-action ap-link-webitem';
            logTimeElem.style.textDecoration = 'none';
            logTimeElem.style.outline = 'none';
            logTimeElem.style.boxShadow = 'none';
            logTimeElem.title = 'log time : ' + currentIssueKey;
            logTimeElem.href = logTimeHref;
            logTimeElem.textContent = '⏱️';

            // append elems
            btnLogTimeElem.appendChild(logTimeElem);
            const insertContainer = document.querySelector('#jira-issue-header-actions > div > div');
            insertContainer.appendChild(btnLogTimeElem);
        }

        //// * ISSUES LogTime --- ////


        //// * ISSUES TimeBySubtask Old --- ////
        function setTimesBySubtaskOld() {
            _logDebug('setTimesBySubtaskOld');
            var timeEstimateLbl = 'Original estimate -';
            createHoursElem(timeEstimateLbl);
            var timeSpentLbl = 'Time Spent - ';
            createHoursElem(timeSpentLbl);
            var timeNotRequiredLbl = 'Original Not Required - ';
            createHoursElem(timeNotRequiredLbl);
            var timeRemainingEstimateLbl = 'Remaining Estimate - ';
            createHoursElem(timeRemainingEstimateLbl);
        }

        function createHoursElem(label) {
            var $elems = $(".issue-main-column [title^='" + label + "']");
            $.each($elems, function (i, elem) {
                var $elem = $(elem);
                try {
                    $elem.after("<span style='font-size: 10px;display: block;text-align: center;'>" + $elem.attr('title')
                        .replace(label, '')
                        .replace(' hours', 'h').replace(' hour', 'h')
                        .replace(' days', 'd').replace(' day', 'd')
                        .replace(' minutes', 'm').replace(' minute', 'm')
                        .replace(', ', '').replace(', ', '').replace(', ', '') + '</span>');
                }
                catch (e) {
                    _logError('createHoursElem: ', e);
                }
            });
        }
        //// --- ISSUES TimeBySubtask Old * ////

        //// * BOARD * ////
        //// * BOARD reduceColumnHeaders --- ////
        function reduceColumnHeaders() {
            _logDebug('reduceColumnHeaders');
            let columnHeaderElems = document.querySelectorAll('.ghx-column-header-flex-1 > h2');
            columnHeaderElems.forEach(e => {
                e.textContent = e.textContent.replace(' In Progress/Done', '');
            });
        }

        //// --- BOARD reduceColumnHeaders * ////

        //// * BOARD LeadTime --- ////
        function setLeadTime(issueElem) {
            _logDebug('setLeadTime');

            let timeElem = issueElem.querySelector('time');

            if (timeElem && timeElem.dateTime) {
                let date1 = new Date();
                let date2 = new Date(timeElem.dateTime);
                let diffTime = Math.round(date1 - date2);
                let diffDays = Math.ceil(diffTime / 86400000); //86400000 = 1000 * 60 * 60 * 24

                let leadColor = diffDays > _configUser.board.leadTime.maxDays ? _configUser.board.leadTime.colorMoreThenMax
                    : (diffDays > (_configUser.board.leadTime.maxDays / 2) ? _configUser.board.leadTime.colorMoreThenHalf
                        : _configUser.board.leadTime.colorLessThenHalf);

                let spanElem = document.createElement('span');
                spanElem.className = 'jiraStuff insertedLead';
                spanElem.style = 'margin-left: 2px; padding: 0 4px; background-color: ' + leadColor;
                spanElem.textContent = '⌚ ' + diffDays;
                spanElem.title = 'lead time: ' + diffDays + 'd';

                timeElem.after(spanElem);
            }
        }
        //// --- BOARD LeadTime * ////

        //// * BOARD DeadEnds --- ////
        function setDeadEnds(issueElem) {
            _logDebug('setDeadEnds');
            let $issue = $(issueElem);
            let $extraFields = $issue.find('.ghx-extra-fields .ghx-extra-field-content');
            let estimatedRaw = $extraFields.eq(0).text();
            let actualRaw = $extraFields.eq(2).text();

            let estimated = getTotalMinutes(estimatedRaw);
            let actual = getTotalMinutes(actualRaw);
            if (actual > estimated) {
                let opacity = ((actual - estimated) / estimated) / 2;
                $issue.css('background', 'repeating-radial-gradient(circle, rgba(' + _configUser.board.deadEnds.color1 + ', ' + opacity
                    + '), rgba(' + _configUser.board.deadEnds.color1 + ', ' + opacity
                    + ') 10px, rgba(' + _configUser.board.deadEnds.color2 + ', ' + opacity
                    + ') 10px, rgba(' + _configUser.board.deadEnds.color2 + ', ' + opacity + ') 20px)');

                $issue.attr('data-colhao', opacity);
            }
        }

        function getTotalMinutes(rawTime) {
            let weeks = Number((new RegExp(/(\d+) week/gi).exec(rawTime) ?? '00')[1]);
            let days = Number((new RegExp(/(\d+) day/gi).exec(rawTime) ?? '00')[1]);
            let hours = Number((new RegExp(/(\d+) hour/gi).exec(rawTime) ?? '00')[1]);
            let minutes = Number((new RegExp(/(\d+) minute/gi).exec(rawTime) ?? '00')[1]);

            return (weeks * 5 * 8 * 60) + (days * 8 * 60) + (hours * 60) + minutes;
        }
        //// --- BOARD DeadEnds * ////


        //// * ShowTimeByTeam --- ////

        // gets issues (bugs) in story and store it in a global object 'tempo'
        function getBugsInsideStory() {

            _logDebug('getBugsInsideStory');

            //get all tasks by component, not in the statuses ('Finished', 'Trash' or 'Done')
            let url = 'https://papersoft-dms.atlassian.net/rest/api/3/search?jql='
                + 'project+%3D+ATLANTIS+AND+type+%3D+Issue+AND+status+not+in+(Finished,+Trash,+Done)'
                + '&fields=summary,parent,timetracking,assignee&maxResults=300';
            _logDebug('getBugsInsideStory - 🎃 fetch:' + url);

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    data.issues.forEach((issue) => {
                        let parentKey = issue.fields.parent.key;
                        let issueTempo = _tempoBugsInsideStories.filter(x => x.parentKey === parentKey)[0];
                        if (!issueTempo || issueTempo.length == 0) {
                            issueTempo = {
                                parentKey: parentKey,
                                numBugs: 0,
                                numClarifications: 0
                            };
                        }
                        // is clarication
                        let isClarification = issue.fields.assignee && issue.fields.assignee.accountId && _configUser.clarificationUsers.includes(issue.fields.assignee.accountId);
                        if (isClarification) {
                            if (_configUser.board.timeByTeam.openClarificationsInStories) {
                                issueTempo.numClarifications++;
                            }
                        }
                        // is bug
                        else {
                            if (_configUser.board.timeByTeam.openIssuesInStories) {
                                issueTempo.numBugs++;
                            }
                        }

                        _tempoBugsInsideStories.push(issueTempo);
                    });
                });
        }

        // gets times from issues by component and stores it in a global object 'tempo'
        function getTimesByType(tempo, type) {

            _logDebug('getTimesByType: ' + type);

            //get all tasks by component, not in the statuses ('Finished', 'Trash' or 'Done')
            let url = 'https://papersoft-dms.atlassian.net/rest/api/3/search?jql='
                //+ 'project+%3D+ATLANTIS+AND+status+not+in+(Finished,+Trash,+Done)+AND+remainingEstimate+%3E+0+AND+type+%3D+%22' //type
                + 'project+%3D+ATLANTIS+AND+status+not+in+(Finished,+Trash,+Done)+AND+remainingEstimate+%3E+0+AND+issuetype+%3D+%22' //issuetype
                + type
                + '%22'
                + '&fields=summary,parent,timetracking,status,assignee&maxResults=300';
            _logDebug('getTimesByType - 🎃 fetch:' + url);

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    data.issues.forEach((issue) => {
                        let parentKey = issue.fields.parent.key;
                        let issueTempo = tempo.filter(x => x.parentKey === parentKey)[0];
                        if (!issueTempo || issueTempo.length == 0) {
                            issueTempo = {
                                parentKey: parentKey,
                                remainingHours: 0
                            };
                            tempo.push(issueTempo);
                        }
                        // remainingHours - convert minutes to hours
                        issueTempo.remainingHours += issue.fields.timetracking.remainingEstimateSeconds / 3600;

                        // users working subtasks
                        if (_configUser.board.timeByTeam.showUsersWorkingSubtasks) {
                            //// status
                            //3 - In Progress
                            if (issue.fields.status.id === '3' || issue.fields.status.id === '3') {
                                if (issue.fields.assignee !== null) {

                                    let usersInSubtasksItem = _usersInSubtasks.filter(x => x.issueKey === parentKey)[0];
                                    if (!usersInSubtasksItem || issueTempo.length == 0) {
                                        usersInSubtasksItem = {
                                            issueKey: parentKey,
                                            users: []
                                        };
                                        _usersInSubtasks.push(usersInSubtasksItem);
                                    }

                                    let userInfo = usersInSubtasksItem.users.filter(x => x.accountId === issue.fields.assignee.accountId)[0];
                                    if (!userInfo) {
                                        userInfo = {
                                            accountId: issue.fields.assignee.accountId,
                                            avatar: issue.fields.assignee.avatarUrls['16x16']
                                        };
                                        usersInSubtasksItem.users.push(userInfo);
                                    }
                                }
                            }
                        }
                    });
                });
        }

        function setTimeByIssue(issueElem) {
            // insert button after stats
            let section = document.createElement('section');
            section.className = 'jiraStuff';
            if (_configUser.board.timeByTeam.showRemainingLabel) {
                let remainingLabelElem = document.createElement('div');
                remainingLabelElem.textContent = '⌛ Remaining';
                section.appendChild(remainingLabelElem);
            }

            // web
            let issueTempoWeb = _tempoWeb.filter(x => x.parentKey === issueElem.dataset.issueKey)[0];
            let tag = 'Web';
            setTimeByIssueTeam(section, issueElem, issueTempoWeb, tag, beautifyLabel(tag));

            let issueTempoApi = _tempoApi.filter(x => x.parentKey === issueElem.dataset.issueKey)[0];
            tag = 'Api';
            setTimeByIssueTeam(section, issueElem, issueTempoApi, tag, beautifyLabel(tag));

            let issueTempoDesktop = _tempoDesktop.filter(x => x.parentKey === issueElem.dataset.issueKey)[0];
            tag = 'Desktop';
            setTimeByIssueTeam(section, issueElem, issueTempoDesktop, tag, beautifyLabel(tag));

            // mobile
            let issueTempoMobile = _tempoMobile.filter(x => x.parentKey === issueElem.dataset.issueKey)[0];
            tag = 'Mobile';
            setTimeByIssueTeam(section, issueElem, issueTempoMobile, tag, beautifyLabel(tag));

            // IT
            let issueTempoIT = _tempoIT.filter(x => x.parentKey === issueElem.dataset.issueKey)[0];
            tag = 'IT';
            setTimeByIssueTeam(section, issueElem, issueTempoIT, tag, beautifyLabel(tag));

            // Testing
            let issueTempoTesting = _tempoTesting.filter(x => x.parentKey === issueElem.dataset.issueKey)[0];
            tag = 'Testing';
            setTimeByIssueTeam(section, issueElem, issueTempoTesting, tag, beautifyLabel(tag));

            // automation
            let issueTempoAutomation = _tempoAutomation.filter(x => x.parentKey === issueElem.dataset.issueKey)[0];
            tag = 'Automation';
            setTimeByIssueTeam(section, issueElem, issueTempoAutomation, tag, beautifyLabel(tag));

            // number open issues in stories
            let issueTempoIssues;
            if (_configUser.board.timeByTeam.openIssuesInStories || _configUser.board.timeByTeam.openClarificationsInStories) {
                issueTempoIssues = _tempoBugsInsideStories.filter(x => x.parentKey === issueElem.dataset.issueKey)[0];

                if (issueTempoIssues) {
                    // bugs
                    if (_configUser.board.timeByTeam.openIssuesInStories) {
                        setBugsInsideStory(section, issueElem, issueTempoIssues.numBugs, 'Bug');
                    }

                    // clarifications
                    if (_configUser.board.timeByTeam.openClarificationsInStories) {
                        setBugsInsideStory(section, issueElem, issueTempoIssues.numClarifications, 'Clarification');
                    }
                }
            }

            if (issueTempoWeb || issueTempoApi || issueTempoDesktop || issueTempoMobile || issueTempoIT || issueTempoIssues || issueTempoAutomation) {
                issueElem.querySelector('.ghx-stat-fields').after(section);
            }
        }

        function setTimeByIssueTeam(section, issueElem, issueTempo, team, teamLabel) {
            if (issueTempo) {
                let newElem = document.createElement('span');
                newElem.className = 'jiraStuff';
                newElem.style = 'margin-left: 6px';
                newElem.title = team;

                // split time in days
                let fixedDays = 0;
                let fixedHours = issueTempo.remainingHours;
                if (_configUser.board.timeByTeam.splitTimeInDays) {
                    fixedDays = Math.floor(issueTempo.remainingHours / 8);
                    fixedHours = Math.floor(issueTempo.remainingHours % 8);
                }

                newElem.textContent = teamLabel;
                if (fixedDays > 0) {
                    newElem.textContent += fixedDays + 'd ';
                }
                if (fixedHours > 0) {
                    newElem.textContent += fixedHours.toFixed(2).replace('.00', '') + 'h';
                }
                section.appendChild(newElem);

                // store data in column (SUM all)
                let columnId = issueElem.closest('[data-column-id]').dataset.columnId;
                let column = document.querySelector("[data-id='" + columnId + "']");
                let remainingHoursSum = column.getAttribute('data-remaining-' + team);
                if (!remainingHoursSum) {
                    remainingHoursSum = 0;
                }
                column.setAttribute('data-remaining-' + team, issueTempo.remainingHours + Number(remainingHoursSum));
            }
        }

        // type can be ('Bug', 'Clarification')
        function setBugsInsideStory(section, issueElem, numIssues, type) {
            if (numIssues && numIssues > 0) {
                let newElem = document.createElement('span');
                newElem.className = 'jiraStuff';
                newElem.style = 'margin-left: 6px';
                newElem.title = type;

                newElem.textContent = beautifyLabel(type) + numIssues;
                section.appendChild(newElem);

                // store data in column (SUM all)
                let columnId = issueElem.closest('[data-column-id]').dataset.columnId;
                let column = document.querySelector("[data-id='" + columnId + "']");
                let sum = column.getAttribute('data-remaining-' + type);
                if (!sum) {
                    sum = 0;
                }
                column.setAttribute('data-remaining-' + type, numIssues + Number(sum));
            }
        }

        function setTimeByColumn() {

            let columns = document.querySelectorAll('[data-id]');
            columns.forEach((column) => {
                let div = document.createElement('h2');
                div.className = 'jiraStuff ghx-column-header-flex';
                div.style = 'margin-right: 0px';
                if (_configUser.board.timeByTeam.showRemainingLabel) {
                    let remainingLabelElem = document.createElement('div');
                    remainingLabelElem.style = 'width: 100%';
                    remainingLabelElem.textContent = '⌛ Σ Remaining';
                    div.appendChild(remainingLabelElem);
                }

                //Web
                setTimeByColumnTeam(column.dataset.remainingWeb, 'Web', div);
                //Api
                setTimeByColumnTeam(column.dataset.remainingApi, 'Api', div);
                //Desktop
                setTimeByColumnTeam(column.dataset.remainingDesktop, 'Desktop', div);
                //Mobile
                setTimeByColumnTeam(column.dataset.remainingMobile, 'Mobile', div);
                //IT
                setTimeByColumnTeam(column.dataset.remainingIt, 'IT', div);
                //Testing
                setTimeByColumnTeam(column.dataset.remainingTesting, 'Testing', div);
                //Automation
                setTimeByColumnTeam(column.dataset.remainingAutomation, 'Automation', div);
                // bugs inside story
                setBugsInsideStoryByColumn(column.dataset.remainingBug, div, 'Bug');
                // clarifications inside story
                setBugsInsideStoryByColumn(column.dataset.remainingClarification, div, 'Clarification');

                if (column.dataset.remainingWeb || column.dataset.remainingApi || column.dataset.remainingDesktop || column.dataset.remainingMobile || column.dataset.remainingIt
                    || column.dataset.remainingTesting || column.dataset.remainingAutomation || column.dataset.remainingBug || column.dataset.remainingClarification) {
                    column.querySelector('div').after(div);
                }
            });
        }

        function setTimeByColumnTeam(remainingHours, type, divContainer) {
            if (remainingHours) {
                let label = beautifyLabel(type);

                let newElem = document.createElement('span');
                newElem.className = 'jiraStuff';
                newElem.style = 'margin-left: 6px';
                newElem.title = type;

                // split time in days
                let fixedDays = 0;
                let fixedHours = Number(remainingHours);
                if (_configUser.board.timeByTeam.splitTimeInDays) {
                    fixedDays = Math.floor(remainingHours / 8);
                    fixedHours = Math.floor(remainingHours % 8);
                }

                newElem.textContent = label;
                if (fixedDays > 0) {
                    newElem.textContent += fixedDays + 'd ';
                }
                if (fixedHours > 0) {
                    newElem.textContent += fixedHours.toFixed(2).replace('.00', '') + 'h';
                }
                divContainer.appendChild(newElem);
            }
        }

        function setBugsInsideStoryByColumn(numIssues, divContainer, type) {
            if (numIssues && numIssues > 0) {
                let newElem = document.createElement('span');
                newElem.className = 'jiraStuff';
                newElem.style = 'margin-left: 6px';
                newElem.title = type;

                newElem.textContent = beautifyLabel(type) + numIssues;

                divContainer.appendChild(newElem);
            }
        }

        function setUsersWorkingSubtasks(issueElem) {

            let _usesInSubTaskItem = _usersInSubtasks.filter(x => x.issueKey === issueElem.dataset.issueKey)[0];

            if (_usesInSubTaskItem && _usesInSubTaskItem.users.length > 0) {

                let issueLinkElem = issueElem.querySelector('.ghx-row.ghx-stat-2 .ghx-key');

                let imgContainer = document.createElement('span');
                imgContainer.className = 'jiraStuff ghx-field';

                // preffix elem '('
                let preffixElem = document.createElement('span');
                preffixElem.textContent = '(';
                preffixElem.style.fontSize = '22px';
                preffixElem.style.lineHeight = '0.6';
                imgContainer.appendChild(preffixElem);

                // insert
                issueLinkElem.before(imgContainer);

                _usesInSubTaskItem.users.forEach(user => {
                    // create avatar
                    let imgElem = document.createElement('img');
                    imgElem.src = user.avatar;
                    imgElem.width = '16';
                    imgElem.height = '16';
                    imgElem.style.marginTop = '4px';
                    imgContainer.appendChild(imgElem);
                });

                // suffix elem ')'
                let suffixElem = document.createElement('span');
                suffixElem.textContent = ')';
                suffixElem.style.fontSize = '22px';
                suffixElem.style.lineHeight = '0.6';
                imgContainer.appendChild(suffixElem);

            }
        }

        // create beautifull label with label and\or emojis
        function beautifyLabel(suffix) {
            let label = _configUser.board.timeByTeam['label' + suffix];
            let emoji = _configUser.board.timeByTeam['emoji' + suffix];
            var result = '';

            //emoji
            result += _configUser.board.timeByTeam.showComponentEmojis ? (emoji + ' ') : '';
            //label
            result += _configUser.board.timeByTeam.showComponentLabels ? (label + ': ') : '';

            return result;
        }

        //// --- ShowTimeByTeam * ////

        //// * RELEASES * ////

        function getIssueKeys(issueElems) {
            _logDebug('getIssueKeys');
            const result = [];
            issueElems.forEach((elem) => {
                result.push(elem.innerHTML);
            });
            return result;
        }

        function getIssueIds(issueElems) {
            _logDebug('getIssueIds');
            const result = [];
            issueElems.forEach((elem) => {
                let issueId = elem.href.split("/").pop();
                result.push(issueId);
            });
            return result;
        }

        function getIssueElems() {
            // old html
            //return document.querySelectorAll('[data-issue-id]');
            return document.querySelectorAll('[data-testid="software-releases-version-detail.common.ui.issue-table"] table tbody tr');
        }

        function setMissingFixVersionLink() {

            _logDebug('setMissingFixVersionLink');
            let query = 'project%20%3D%20ATLANTIS%20AND%20status%20in%20("Planning%20Automation")%20AND%20fixVersion%20is%20EMPTY%20ORDER%20BY%20updatedDate%20DESC';

            //get all tasks in planning automation with missing fixed version
            let url = 'https://papersoft-dms.atlassian.net/rest/api/3/search?jql=' + query;
            _logDebug('setMissingFixVersionLink - 🎃 fetch:' + url);
            fetch(url)
                .then(response => response.json())
                .then(data => {

                    //check if button is already created
                    let btnId = 'jiraStuff_missingFixVersion';
                    let btnElem = document.querySelector('#' + btnId);
                    if (!btnElem) {
                        let linkContainerElem = document.createElement('div');
                        linkContainerElem.style.backgroundColor = 'coral';
                        linkContainerElem.style.padding = '3px';
                        linkContainerElem.style.marginLeft = '1em';
                        let linkElem = document.createElement('a');

                        linkContainerElem.appendChild(linkElem);
                        linkElem.href = 'https://papersoft-dms.atlassian.net/issues/?jql=' + query;
                        linkElem.target = '_blank';
                        linkElem.className = 'jiraStuff';
                        linkElem.id = btnId;
                        linkElem.style.verticalAlign = 'sub';
                        linkElem.textContent = '🧟‍♂️ Missing fixed version (' + data.issues.length + ')';
                        // insert
                        let insertionElem = document.querySelector('[data-test-id="project-directories.versions.main.filter.versions-filter-container"]').parentNode;
                        insertionElem.appendChild(linkContainerElem);
                    }
                });

        }

        function setDocumentationLinkByRelease(parentKeys) {

            _logDebug('setDocumentationLinkByRelease');

            let query = 'project+%3D+ATLANTIS+AND+issuetype+%3D+"+Documentation"+AND+parent+in+'
                + '(' + parentKeys.join(',+') + ')';

            //get all tasks of type 'documentation'
            let url = 'https://papersoft-dms.atlassian.net/rest/api/3/search?jql=' + query;
            _logDebug('setDocumentationLinkByRelease - 🎃 fetch:' + url);
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    //check if button is already created
                    let btnId = 'jiraStuff_DocumentationLink';
                    let btnElem = document.querySelector('#' + btnId);
                    if (!btnElem) {
                        let linkContainerElem = document.createElement('div');
                        linkContainerElem.style.backgroundColor = 'bisque';
                        linkContainerElem.style.padding = '3px';
                        linkContainerElem.style.marginLeft = '1em';
                        let linkElem = document.createElement('a');

                        linkContainerElem.appendChild(linkElem);
                        linkElem.href = 'https://papersoft-dms.atlassian.net/issues/?jql=' + query;
                        linkElem.target = '_blank';
                        linkElem.className = 'jiraStuff';
                        linkElem.id = btnId;
                        linkElem.style.verticalAlign = 'sub';
                        linkElem.textContent = '🚀 Documentation (' + data.issues.length + ')';
                        // insert
                        let insertionElem = document.querySelector('[aria-label="Feedback"]').closest("button").parentNode.parentNode;
                        insertionElem.appendChild(linkContainerElem);
                    }
                });
        }

        function getIssueIdsFromKeys(keys) {

            _logDebug('getIssueIdsFromKeys');

            let query = 'project+%3D+ATLANTIS+AND+issuetype+%3D+"+Documentation"+AND+parent+in+'
                + '(' + keys.join(',+') + ')';

            //get all tasks of type 'documentation'
            let url = 'https://papersoft-dms.atlassian.net/rest/api/3/search?jql=' + query;
            _logDebug('getIssueIdsFromKeys - 🎃 fetch:' + url);
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    let linkContainerElem = document.createElement('li');
                    linkContainerElem.style.listStyle = 'none';
                    linkContainerElem.style.display = 'inline-block';
                    linkContainerElem.style.float = 'right';
                    linkContainerElem.style.backgroundColor = 'bisque';
                    let linkElem = document.createElement('a');

                    linkContainerElem.appendChild(linkElem);
                    linkElem.href = 'https://papersoft-dms.atlassian.net/issues/?jql=' + query;
                    linkElem.target = '_blank';
                    linkElem.className = 'jiraStuff';
                    linkElem.textContent = '🚀 Documentation (' + data.issues.length + ')';
                    // insert
                    let insertionElem = document.querySelector('.release-report-tab-header ul');
                    insertionElem.appendChild(linkContainerElem);
                });
        }

        function getBugTimesByRelease(parentKeys) {
            _logDebug('getBugTimesByRelease');

            //get all tasks of type 'issue'
            let url = 'https://papersoft-dms.atlassian.net/rest/api/3/search?jql='
                + 'project+%3D+ATLANTIS+AND+issuetype+%3D+issue+AND+status+not+in+(Trash)+AND+parent+in+'
                + '(' + parentKeys.join(',+') + ')'
                + '&fields=parent,timespent,components&maxResults=200';
            _logDebug('getBugTimesByRelease - 🎃 fetch:' + url);

            return fetch(url)
                .then(response => response.json())
                .then(data => {
                    data.issues.forEach((issue) => {
                        let parentKey = issue.fields.parent.key.toLowerCase();
                        let issueTempo = _tempoRelease.filter(x => x.parentKey === parentKey)[0];
                        if (!issueTempo || issueTempo.length == 0) {
                            issueTempo = {
                                parentKey: parentKey.toLocaleLowerCase(),
                                components: {
                                    web: {
                                        count: 0,
                                        remainingHours: 0
                                    },
                                    mobile: {
                                        count: 0,
                                        remainingHours: 0
                                    },
                                    others: {
                                        count: 0,
                                        remainingHours: 0
                                    }
                                }
                            };
                            _tempoRelease.push(issueTempo);
                        }
                        const component = issue.fields.components && issue.fields.components.length > 0 ? issue.fields.components[0].name.toLowerCase() : '';
                        switch (component) {
                            case 'web portal':
                            case 'api':
                                issueTempo.components.web.count++;
                                issueTempo.components.web.remainingHours += (issue.fields.timespent ? issue.fields.timespent : 0) / 3600;
                                break;
                            case 'mobile app':
                                issueTempo.components.mobile.count++;
                                issueTempo.components.mobile.remainingHours += (issue.fields.timespent ? issue.fields.timespent : 0) / 3600;
                                break;
                            default:
                                issueTempo.components.others.count++;
                                issueTempo.components.others.remainingHours += (issue.fields.timespent ? issue.fields.timespent : 0) / 3600;
                                break;
                        }
                    });
                });
        }

        function setBugTimesByRelease() {
            _logDebug('setBugTimesByRelease');

            // new column
            const summaryColumn = document.querySelectorAll('[data-id="com.atlassian.jira.plugins.jira-development-integration-plugin:release-report-all-issues"] th.summary');
            let newColumnId = 'jiraStuff_bugByRelease';
            let newColumn = document.createElement('th');
            newColumn.id = newColumnId;
            newColumn.textContent = '🐞';

            if (summaryColumn) {
                summaryColumn[0].after(newColumn);
            }

            let totalWeb = 0;
            let totalMobile = 0;
            let totalOthers = 0;
            let copyTable = [];

            // create copy table header
            let headerRow = [];
            copyTable.push(headerRow);
            headerRow.push('release');
            headerRow.push('type');
            headerRow.push('url');
            headerRow.push('title');
            headerRow.push('#bugs total');
            headerRow.push('timeBugs total');
            headerRow.push('#bugs web');
            headerRow.push('timeBugs web');
            headerRow.push('#bugs mobile');
            headerRow.push('timeBugs mobile');

            let cellRelease = document.querySelector('.aui-page-header-main > h2').textContent;
            document.querySelectorAll('.issue-key').forEach(issueLink => {

                let newCell = document.createElement('td');
                newCell.style.whiteSpace = 'nowrap';
                let issueKey = issueLink.innerHTML.toLocaleLowerCase();
                let issueTempo = _tempoRelease.filter(x => x.parentKey === issueKey)[0];
                if (issueTempo) {
                    // web
                    totalWeb += issueTempo.components.web.remainingHours;
                    newCell.textContent += issueTempo.components.web.remainingHours > 0 ?
                        (beautifyLabel('Web') + ' ' + issueTempo.components.web.remainingHours.toFixed(2).replace('.00', '') + 'h ') : '';
                    // mobile
                    totalMobile += issueTempo.components.mobile.remainingHours;
                    newCell.textContent += issueTempo.components.mobile.remainingHours > 0 ?
                        (beautifyLabel('Mobile') + ' ' + issueTempo.components.mobile.remainingHours.toFixed(2).replace('.00', '') + 'h ') : '';
                    // others
                    totalOthers += issueTempo.components.others.remainingHours;
                    newCell.textContent += issueTempo.components.others.remainingHours > 0 ?
                        ('👹 others: ' + issueTempo.components.others.remainingHours.toFixed(2).replace('.00', '') + 'h ') : '';
                }
                else {
                    newCell.textContent = '-';
                }

                let currentRow = issueLink.closest('tr');

                //populate copyTable
                let copyRow = [];
                copyTable.push(copyRow);
                //cell 1 - release
                copyRow.push(cellRelease);
                //cell 2 - type
                let cellType = currentRow.querySelector('td.type img').title;
                copyRow.push(cellType);
                //cell 3 - url
                let cellUrl = issueLink.href;
                copyRow.push(cellUrl);
                //cell 4 - title
                let cellTitle = currentRow.querySelector('.issue-summary').textContent;
                copyRow.push(cellTitle);
                //cell 5 - #bugs total
                let cellBugsTotal = issueTempo ? (issueTempo.components.web.count + issueTempo.components.mobile.count) : 0;
                copyRow.push(cellBugsTotal);
                //cell 5 - timeBugs total
                let cellTimeBugsTotal = issueTempo ? ((issueTempo.components.web.remainingHours + issueTempo.components.mobile.remainingHours) * 60).toFixed(2).replace('.00', '') : '';
                copyRow.push(cellTimeBugsTotal);
                //cell 5 - #bugs web
                let cellBugsWeb = issueTempo ? issueTempo.components.web.count : 0;
                copyRow.push(cellBugsWeb);
                //cell 5 - timeBugs web
                let cellTimeBugsWeb = issueTempo ? (issueTempo.components.web.remainingHours * 60).toFixed(2).replace('.00', '') : '';
                copyRow.push(cellTimeBugsWeb);
                //cell 5 - #bugs mobile
                let cellBugsMobile = issueTempo ? issueTempo.components.mobile.count : 0;
                copyRow.push(cellBugsMobile);
                //cell 5 - timeBugs mobile
                let cellTimeBugsMobile = issueTempo ? (issueTempo.components.mobile.remainingHours * 60).toFixed(2).replace('.00', '') : '';
                copyRow.push(cellTimeBugsMobile);

                issueLink.parentElement.nextElementSibling.after(newCell);
            });

            // total
            if (totalWeb > 0 || totalMobile > 0 || totalOthers > 0) {
                newColumn.textContent += ' Σ( ';
                if (totalWeb > 0) {
                    newColumn.textContent += (beautifyLabel('Web') + ' ' + totalWeb.toFixed(2).replace('.00', '') + 'h');
                }
                if (totalMobile > 0) {
                    newColumn.textContent += (beautifyLabel('Mobile') + ' ' + totalMobile.toFixed(2).replace('.00', '') + 'h');
                }
                if (totalOthers > 0) {
                    newColumn.textContent += ('👹 ' + totalOthers.toFixed(2).replace('.00', '') + 'h');
                }
                newColumn.textContent += ' )';
            }

            // copy&paste
            const copyElem = document.createElement('span');
            copyElem.textContent = '📋';
            copyElem.title = 'copy data';
            copyElem.style.cursor = 'pointer';
            copyElem.style.marginLeft = '1em';
            newColumn.appendChild(copyElem);

            let inputCopy = document.createElement('div');
            let inputCopyId = 'jiraStuff_copyInput';
            inputCopy.id = inputCopyId;
            inputCopy.hidden = true;
            inputCopy.type = 'text';
            inputCopy.style = 'background-color: darksalmon; position: fixed; right: 0; left: 0; margin-right: auto; margin-left: auto; width: 60%; top: 12em; padding: 20px; user-select: all';
            document.body.appendChild(inputCopy);

            // close button
            let closeButton = document.createElement('div');
            closeButton.textContent = 'X';
            closeButton.style.cursor = 'pointer';
            closeButton.style.textAlign = 'right';
            // event close button
            closeButton.addEventListener('click', () => {
                _logDebug('setBugTimesByRelease close click');

                // remove copy table
                document.querySelector('#copyTable').remove();
                inputCopy.hidden = true;
            });
            inputCopy.appendChild(closeButton);

            // event open copy table
            copyElem.addEventListener('click', () => {
                _logDebug('setBugTimesByRelease open click');

                inputCopy.hidden = false;
                let tableElem = createTable(copyTable);
                tableElem.id = 'copyTable';
                tableElem.style = 'background-color: white;';
                inputCopy.appendChild(tableElem);
            });
        }

        function setBranchsInReleaseContainer() {

            // open Branchs
            let openBranchsElem = document.createElement('ul');
            let openBranchsContainerElem = document.createElement('li');
            openBranchsContainerElem.style.listStyle = 'none';
            openBranchsContainerElem.style.display = 'inline-block';
            openBranchsContainerElem.style.float = 'right';
            openBranchsContainerElem.style.backgroundColor = 'lavender';
            openBranchsContainerElem.style.margin = '4px 8px';
            openBranchsContainerElem.style.paddingRight = '8px';
            openBranchsContainerElem.appendChild(openBranchsElem);
            openBranchsElem.className = 'jiraStuff openBranchsList';
            openBranchsElem.textContent = '🛠️ Open Branchs';

            // merged Branchs
            let mergedBranchsElem = document.createElement('ul');
            let mergedBranchsContainerElem = document.createElement('li');
            mergedBranchsContainerElem.style.listStyle = 'none';
            mergedBranchsContainerElem.style.display = 'inline-block';
            mergedBranchsContainerElem.style.float = 'right';
            mergedBranchsContainerElem.style.backgroundColor = 'darkseagreen';
            mergedBranchsContainerElem.style.margin = '4px 8px';
            mergedBranchsContainerElem.style.paddingRight = '8px';
            mergedBranchsContainerElem.appendChild(mergedBranchsElem);
            mergedBranchsElem.className = 'jiraStuff mergedBranchsList';
            mergedBranchsElem.textContent = '💎 Merged';

            //insert
            //let insertionElem = document.querySelector('.release-report-tab-header ul');
            let insertionElem = document.querySelector('[data-testid="software-releases-version-detail.ui.header.title"]');
            insertionElem.appendChild(mergedBranchsContainerElem);
            insertionElem.appendChild(openBranchsContainerElem);

        }

        async function getBranchsInRelease(issueId) {

            var response = await fetch('https://papersoft-dms.atlassian.net/rest/dev-status/1.0/issue/detail?applicationType=stash&dataType=pullrequest&issueId=' + issueId, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            var json = await response.json();
            var jsonData = json.detail[0];

            if (jsonData.branches) {
                jsonData.branches.forEach(branchData => {
                    let dupBranch = _branchsInRelease.filter(x => x.name === branchData.repository.name).length > 0;
                    if (!dupBranch) {
                        let branchInfo = {
                            name: branchData.repository.name,
                            url: branchData.repository.url,
                            pr: false
                        };
                        _branchsInRelease.push(branchInfo);
                        setBranchsInRelease(branchInfo, '.jiraStuff.openBranchsList');
                    }
                });
            }
            if (jsonData.pullRequests) {
                jsonData.pullRequests.forEach(prData => {
                    let dupBranch = _branchsInRelease.filter(x => x.name === prData.source.repository.name).length > 0;
                    let dupBranchMerged = _branchsMerged.filter(x => x.name === prData.source.repository.name).length > 0;
                    if (!dupBranch && !dupBranchMerged) {
                        let branchInfo = {
                            name: prData.source.repository.name,
                            url: prData.url,
                            pr: true
                        };
                        // MERGED
                        if (prData.status === 'MERGED' && !dupBranchMerged) {
                            _branchsMerged.push(branchInfo);
                            setBranchsInRelease(branchInfo, '.jiraStuff.mergedBranchsList');
                        }
                        else if (prData.status !== 'MERGED' && !dupBranch) {
                            _branchsInRelease.push(branchInfo);
                            setBranchsInRelease(branchInfo, '.jiraStuff.openBranchsList');
                        }
                    }
                });
            }
        }

        function setBranchsInRelease(branchInfo, elemSelector) {
            let insertionElem = document.querySelector(elemSelector);
            let branchElem = document.createElement('li');
            branchElem.textContent = branchInfo.name;
            insertionElem.appendChild(branchElem);

            let ulElem = insertionElem.parentNode.closest('ul');
            ulElem.style.minHeight = insertionElem.clientHeight + 'px';
            ulElem.style.paddingBottom = '10px';
        }

        //// --- JIRA POSTS * ////

        function j_createSubTask(issueLabel) {
            _logDebug('j_createSubTask');

            // hide save button
            document.querySelector('#jiraStuff_issues_taskGenie_save').style.visibility = 'hidden';

            // show loading
            document.querySelector('#jiraStuff_issues_taskGenie_loading').hidden = false;
            document.querySelector('#jiraStuff_issues_taskGenie_saveOk').hidden = true;
            document.querySelector('#jiraStuff_issues_taskGenie_saveNotOk').hidden = true;

            j_createSubTaskAux(
                issueLabel,
                _page.issueKey,
                document.querySelector('#jiraStuff_issues_taskGenie_issueType').value,
                document.querySelector('#jiraStuff_issues_taskGenie_componentId').value,
                document.querySelector('#jiraStuff_issues_taskGenie_componentName').value,
                document.querySelector('#jiraStuff_issues_taskGenie_summary').value,
                document.querySelector('#jiraStuff_issues_taskGenie_description').value,
                document.querySelector('#jiraStuff_issues_taskGenie_costCode').value,
                document.querySelector('#jiraStuff_issues_taskGenie_client').value,
                document.querySelector('#jiraStuff_issues_taskGenie_estimatedHours').value
            );
        }

        function j_createSubTaskAux(issueLabel, parentKey, issueType, componentId, componentName, summary, description, costCode, client, estimateHours) {

            _logDebug('j_createSubTaskAux');

            let estimateMinutes = (estimateHours * 60).toString();

            // sanitize sumary and description
            description = (description ? description : summary)
                // escape \
                .replaceAll('\\', '\\\\')
                // escape "
                .replaceAll('"', '\\"');
            summary = summary
                // escape \
                .replaceAll('\\', '\\\\')
                // escape "
                .replaceAll('"', '\\"');

            // create request object
            let request = _jiraStuffPayloads.createTask
                // parentId
                .replaceAll('[[parentKey]]', parentKey.toUpperCase())
                // issueType
                .replaceAll('[[issueType]]', issueType)
                // summary
                .replaceAll('[[summary]]', summary)
                // summary
                .replaceAll('[[description]]', description ? description : summary)
                // costCode
                .replaceAll('[[costCode]]', costCode)
                // client
                .replaceAll('[[client]]', client)
                // estimateHours
                .replaceAll('[[estimateMinutes]]', estimateMinutes);

            // add component to request
            let requestOk = false;
            let requestErrorMsg = '';
            let tempObj;

            try {
                // parse request
                tempObj = JSON.parse(request);
                requestOk = true;
            }
            catch (ex) {
                requestOk = false;
                requestErrorMsg = 'parsing ex:(' + ex.message + ')';
            }
            if (componentName) {
                if (requestOk) {
                    // add component name
                    tempObj.fields.components = [
                        {
                            //id : componentId,
                            name: componentName,
                            //fromCache : true
                        }
                    ];
                }
            }

            try {
                // stringify request
                request = JSON.stringify(tempObj);
            }
            catch (ex) {
                requestOk = false;
                requestErrorMsg = 'stringifying ex:(' + ex.message + ')';
            }

            if (!requestOk) {
                _logError('j_createSubTaskAux: ' + requestErrorMsg);
                // show success message
                document.querySelector('#jiraStuff_issues_taskGenie_saveNotOk').hidden = false;
                document.querySelector('#jiraStuff_issues_taskGenie_saveNotOk_message').textContent = 'error: ' + requestErrorMsg;
                // hide loading
                document.querySelector('#jiraStuff_issues_taskGenie_loading').hidden = true;
                // show save button
                document.querySelector('#jiraStuff_issues_taskGenie_save').style.visibility = 'visible';
            }
            else {
                fetch('https://papersoft-dms.atlassian.net/rest/api/3/issue', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: request
                })
                    .then(response => {
                        if (response.status !== 200 && response.status !== 201) {
                            _logError('j_createSubTaskAux: returned:' + response.status);
                        }
                        return response.json();
                    })
                    .then(data => {

                        // success
                        if (data.key) {
                            _logDebug('created:' + data.key);

                            // show success message
                            document.querySelector('#jiraStuff_issues_taskGenie_saveOk').hidden = false;
                            //document.querySelector('#jiraStuff_issues_taskGenie_saveOk_message').textContent = 'created subtask ' + data.key;
                            var newTaskLinkHtml = '<a title="open task: ' + data.key + '" target="_blank" href="https://papersoft-dms.atlassian.net/browse/' + data.key + '">' + data.key + ' - ' + issueLabel + '</a>';
                            document.querySelector('#jiraStuff_issues_taskGenie_saveOk_message').innerHTML = 'created subtask ' + newTaskLinkHtml;

                            // append to news                        
                            let newNewsElem = document.createElement('li');
                            newNewsElem.innerHTML = newTaskLinkHtml;
                            document.querySelector('#jiraStuff_issues_taskGenie_news').appendChild(newNewsElem);
                        }
                        // error
                        if (data.errors) {
                            let errorsJson = JSON.stringify(data);
                            throw new Error(errorsJson);
                        }
                    })
                    .catch(err => {
                        _logError('j_createSubTaskAux: ', err);

                        // show success message
                        document.querySelector('#jiraStuff_issues_taskGenie_saveNotOk').hidden = false;
                        document.querySelector('#jiraStuff_issues_taskGenie_saveNotOk_message').textContent = 'error: ' + err.toString();
                    })
                    .finally(e => {
                        // hide loading
                        document.querySelector('#jiraStuff_issues_taskGenie_loading').hidden = true;
                        // show save button
                        document.querySelector('#jiraStuff_issues_taskGenie_save').style.visibility = 'visible';
                    });
            }
        }

        async function j_setPrInfo(issueElem) {
            var issueId = issueElem.dataset.issueId;
            var issueKey = issueElem.dataset.issueKey.toLowerCase();

            // create request object
            let request = _jiraStuffPayloads.getBranchsPrs2
                .replaceAll('[issueId]', issueId);

            var response = await fetch('https://papersoft-dms.atlassian.net/jsw/graphql?operation=DevDetailsDialog&issueId=' + issueId, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-ExperimentalApi': 'boardCardMove,deleteCard,JiraJqlBuilder,SoftwareCardTypeTransitions,jira-releases-v0,JiraDevOps,createCustomFilter,updateCustomFilter,deleteCustomFilter,customFilters,PermissionScheme,JiraIssue,startSprintPrototype'
                },
                body: request
            });
            var json = await response.json();

            let data = json.data?.developmentInformation?.details?.instanceTypes[0];
            let missingStuff = [];

            let section = document.createElement('section');
            section.style.fontWeight = 'bold';
            section.style.border = 'solid cornflowerblue 2px';
            section.textContent = "PULL REQUESTS";
            let repoMissingStuff = false;
            if (data?.repository) {
                data.repository.forEach(repo => {

                    // ignore excluded repos
                    let ignoredRepo = repo.name.indexOf('.Automation.') > 0;
                    if (!ignoredRepo) {

                        // create elems
                        let repoElem = document.createElement('a');
                        repoElem.target = '_blank';
                        repoElem.style.fontSize = 'smaller';
                        repoElem.style.display = 'block';
                        let repoStatusElem = document.createElement('span');
                        let repoNameElem = document.createElement('span');
                        let repoNameSplit = repo.name.split('.');
                        repoNameElem.textContent = repoNameSplit.pop();
                        let repoMsgElem = document.createElement('span');
                        repoMsgElem.style.fontWeight = 'normal';
                        repoElem.appendChild(repoStatusElem);
                        repoElem.appendChild(repoNameElem);
                        repoElem.appendChild(repoMsgElem);
                        section.appendChild(repoElem);

                        // missing PR
                        if (repo.pullRequests.length === 0) {
                            repoMissingStuff = true;
                            repoStatusElem.textContent = '⚠️';
                            repoMsgElem.textContent = ': missing PR';
                        }
                        else {
                            repo.pullRequests.forEach(pr => {

                                let ignoredPr = pr.branchName.toLowerCase().indexOf(issueKey) < 0;
                                //ignore PRs from
                                if (!ignoredPr) {
                                    // PR url
                                    repoElem.href = pr.url;

                                    // missing team
                                    if (pr.reviewers.length === 0) {
                                        repoMissingStuff = true;
                                        repoStatusElem.textContent = '⚠️';
                                        repoMsgElem.textContent = ': add approvers 🐵';
                                    }
                                    else {
                                        let teamNotApproved = pr.reviewers.filter(reviewer => !reviewer.isApproved && reviewer.name !== 'Eurico Batista');
                                        if (teamNotApproved.length > 0) {
                                            // missing team approve
                                            repoMissingStuff = true;
                                            let missingNames = teamNotApproved.map(x => x.name);
                                            repoStatusElem.textContent = '⚠️';
                                            repoMsgElem.textContent = ': missing approval 🐵: ' + missingNames.join(';');
                                        }
                                        else {
                                            let bigBoss = pr.reviewers.filter(reviewer => reviewer.name === 'Eurico Batista');
                                            if (bigBoss.length === 0) {
                                                // missing big boss
                                                repoMissingStuff = true;
                                                repoStatusElem.textContent = '⚠️';
                                                repoMsgElem.textContent = ': add eurico 👨‍✈️';
                                            }
                                            else if (!bigBoss[0].isApproved) {
                                                // missing big boss approve
                                                repoMissingStuff = true;
                                                repoStatusElem.textContent = '❌';
                                                repoMsgElem.textContent = ': eurico approval 👨‍✈️';
                                            }
                                            else {
                                                // noice!
                                                repoStatusElem.textContent = '✔️';
                                            }
                                        }
                                    }
                                }
                            });
                        }
                    }
                });
            }
            else {
                // no branchs
            }

            // border color
            if (!repoMissingStuff) {
                // no PRs
                if (!(data?.repository) || data.repository.length === 0) {
                    let repoElem = document.createElement('div');
                    repoElem.style.fontSize = 'smaller';
                    let repoStatusElem = document.createElement('span');
                    let repoMsgElem = document.createElement('span');
                    repoMsgElem.style.fontWeight = 'normal';
                    repoStatusElem.textContent = '❔';
                    repoMsgElem.textContent = data?.repository ? 'no PRs' : 'no branchs';
                    repoElem.appendChild(repoStatusElem);
                    repoElem.appendChild(repoMsgElem);
                    section.appendChild(repoElem);

                    section.style.borderColor = 'sandybrown';
                    section.style.backgroundColor = 'cornsilk';
                }
                else {
                    section.style.borderColor = 'green';
                    section.style.backgroundColor = 'darkseagreen';
                }
            }
            else {
                section.style.borderColor = 'crimson';
                section.style.backgroundColor = 'darksalmon';
            }

            //add PR info if stuff is missing
            issueElem.querySelector('.ghx-stat-fields').after(section);
        }

        async function xxx(issueElem) {

            var issueId = issueElem.dataset.issueId;

            // create request object
            let request = _jiraStuffPayloads.getBranchsPrs
                .replaceAll('[issueId]', issueId);

            var response = await fetch('https://papersoft-dms.atlassian.net/gateway/api/graphql?issueId=' + issueId, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-ExperimentalApi': 'boardCardMove,deleteCard,JiraJqlBuilder,SoftwareCardTypeTransitions,jira-releases-v0,JiraDevOps,createCustomFilter,updateCustomFilter,deleteCustomFilter,customFilters,PermissionScheme,JiraIssue,startSprintPrototype'
                },
                body: request
            });
            var json = await response.json();

            // success
            let summary = json.data?.jira?.devOps?.devOpsIssuePanel?.devSummaryResult?.devSummary;
            if (summary) {

                let section = document.createElement('section');

                // branch count
                let branchCountElem = document.createElement('span');
                branchCountElem.style = 'margin-left: 6px';
                branchCountElem.textContent = "branchs:" + summary.branch.overall.count;
                section.appendChild(branchCountElem);
                // pr count
                let prCountElem = document.createElement('span');
                prCountElem.style = 'margin-left: 6px';
                prCountElem.textContent = "PRs:" + summary.pullrequest.overall.count;
                section.appendChild(prCountElem);
                // pr state
                let prStateElem = document.createElement('span');
                prStateElem.style = 'margin-left: 6px';
                prStateElem.textContent = "state:" + summary.pullrequest.overall.state;
                section.appendChild(prStateElem);

                issueElem.querySelector('.ghx-stat-fields').after(section);
            }
        }

        //// * JIRA POSTS --- ////

        //// --- UTILS *  ////

        function bindConfigButton() {

            // bitbucket
            if (_page.isBitbucket) {

                let configBtnBitbucket = document.querySelector('#bitStuff_config');
                if (!configBtnBitbucket) {

                    // create button
                    let userDropElem = document.querySelector('li.user-dropdown');
                    if (userDropElem) {
                        configBtnBitbucket = document.createElement('li');
                        configBtnBitbucket.id = 'bitStuff_config';
                        configBtnBitbucket.className = 'jiraStuff';
                        configBtnBitbucket.innerHTML = _jiraStuffHTML.configBtnBitbucket;
                        // insert
                        userDropElem.after(configBtnBitbucket);

                        // bind toggle visibility
                        configBtnBitbucket.addEventListener('click', e => {
                            if (e.target.id === 'jsf_toggle') {
                                _logDebug('configButton open click');

                                let container = configBtnBitbucket.querySelector('#jsf_Container');
                                let containerIsVisible = container.style.display !== 'none';
                                container.style.display = containerIsVisible ? 'none' : 'block';

                                //loadConfigValues
                                configBtnBitbucket.querySelector('#jiraStuff_bitbucket_dashboard_filter').checked = _configUser.bitbucket.dashboard.filter;
                                configBtnBitbucket.querySelector('#jiraStuff_bitbucket_dashboard_sonarLinks').checked = _configUser.bitbucket.dashboard.sonarLinks;
                                configBtnBitbucket.querySelector('#jiraStuff_bitbucket_dashboard_jenkinsLinks').checked = _configUser.bitbucket.dashboard.jenkinsLinks;
                                configBtnBitbucket.querySelector('#jiraStuff_bitbucket_createPullRequest_prefixes_enable').checked = _configUser.bitbucket.createPullRequest.prefixes.enabled;
                                //logs
                                configBtnBitbucket.querySelector('#jiraStuff_log_showDebug').checked = _configUser.log.showDebug;
                                configBtnBitbucket.querySelector('#jiraStuff_log_showTimers').checked = _configUser.log.showTimers;
                                configBtnBitbucket.querySelector('#jiraStuff_log_showEngine').checked = _configUser.log.showEngine;

                            }
                        });

                        // bind save
                        configBtnBitbucket.querySelector('#jsf_Save').addEventListener('click', e => {
                            _logDebug('configButton save click');
                            _configUser.bitbucket.dashboard.filter = configBtnBitbucket.querySelector('#jiraStuff_bitbucket_dashboard_filter').checked;
                            _configUser.bitbucket.dashboard.sonarLinks = configBtnBitbucket.querySelector('#jiraStuff_bitbucket_dashboard_sonarLinks').checked;
                            _configUser.bitbucket.dashboard.jenkinsLinks = configBtnBitbucket.querySelector('#jiraStuff_bitbucket_dashboard_jenkinsLinks').checked;
                            _configUser.bitbucket.createPullRequest.prefixes.enabled = configBtnBitbucket.querySelector('#jiraStuff_bitbucket_createPullRequest_prefixes_enable').checked;
                            //logs
                            _configUser.log.showDebug = configBtnBitbucket.querySelector('#jiraStuff_log_showDebug').checked;
                            _configUser.log.showTimers = configBtnBitbucket.querySelector('#jiraStuff_log_showTimers').checked;
                            _configUser.log.showEngine = configBtnBitbucket.querySelector('#jiraStuff_log_showEngine').checked;

                            // save to cookie
                            _cookiesLib.set('jiraStuff', _configUser, { expires: 3650 });

                            document.location = document.location;
                        });

                        // bind reset values
                        configBtnBitbucket.querySelector('#jsf_Reset').addEventListener('click', e => {
                            _logDebug('reset click');
                            // save to cookie
                            _cookiesLib.set('jiraStuff', _configDefault(), { expires: 3650 });

                            document.location = document.location;
                        });

                        // dashboard page
                        if (_page.isDashboard) {

                            // filter
                            if (_configUser.bitbucket.dashboard.filter) {
                                bb_createFilter();
                                bb_updatePRsState(true);

                                // set timer
                                _timerUpdatePRsState = window.setInterval(bb_updatePRsState, 2000);
                                _logTimer('⏱ - timer for [prs state] started. total:' + (++_timerCount));
                            }
                        }

                        // dashboard page or pull request page
                        if (_page.isDashboard || _page.isPullRequests) {
                            // sonar links
                            if (_configUser.bitbucket.dashboard.sonarLinks) {
                                bb_createSonarLinks();
                            }

                            // jenkins links
                            if (_configUser.bitbucket.dashboard.jenkinsLinks) {
                                // set timout to delay running, very lazy and hacky
                                _timerCreateJenkinsLinks = window.setInterval(bb_createJenkinsLinks, 2000);
                                _logTimer('⏱ - timer for [jenkins links] started. total:' + (++_timerCount));
                            }
                        }

                        // createPullRequest page
                        if (_page.isCreatePullRequest) {

                            // labels
                            if (_configUser.bitbucket.createPullRequest.prefixes.enabled) {
                                bb_createPullRequestStuff();
                            }
                        }
                    }
                }

            }

            // jira
            if (_page.isJira) {
                let configBtnJira = document.querySelector('#jiraStuff_config');

                if (!configBtnJira) {
                    let jiraBtnElems = document.querySelectorAll('header > div > span');
                    configBtnJira = document.createElement('span');
                    configBtnJira.id = 'jiraStuff_config';
                    configBtnJira.className = 'jiraStuff';
                    configBtnJira.innerHTML = _jiraStuffHTML.configBtnJira;
                    // insert before last btn
                    jiraBtnElems[jiraBtnElems.length - 1].after(configBtnJira);

                    // detect faggy user
                    //let userId = document.querySelector('header > div > span [data-test-id="ak-spotlight-target-profile-spotlight"] > div > span > span').style.backgroundImage;
                    let userId = localStorage.__storejs_cache_prefix___scope_key__;
                    if (_configUser.faggyUsers) {
                        _configUser.faggyUsers.forEach(x => {
                            if (userId.indexOf(x) >= 0) {
                                _logDebug('🏳️‍🌈');
                                configBtnJira.querySelectorAll('.faggySettings').forEach(elem => {
                                    elem.hidden = false;
                                });
                                return;
                            }
                        });
                    }

                    // bind toggle visibility
                    configBtnJira.addEventListener('click', e => {
                        if (e.target.id === 'jsf_toggle') {
                            _logDebug('configButton toggle click');

                            let container = configBtnJira.querySelector('#jsf_Container');
                            container.hidden = !container.hidden;

                            //loadConfigValues
                            configBtnJira.querySelector('#jiraStuff_board_timeByTeam_enable').checked = _configUser.board.timeByTeam.enabled;
                            configBtnJira.querySelector('#jiraStuff_board_timeByTeam_mergeWebTeam').checked = _configUser.board.timeByTeam.mergeWebTeam;
                            configBtnJira.querySelector('#jiraStuff_board_timeByTeam_componentWeb').checked = _configUser.board.timeByTeam.componentWeb;
                            configBtnJira.querySelector('#jiraStuff_board_timeByTeam_componentApi').checked = _configUser.board.timeByTeam.componentApi;
                            configBtnJira.querySelector('#jiraStuff_board_timeByTeam_componentDesktop').checked = _configUser.board.timeByTeam.componentDesktop;
                            configBtnJira.querySelector('#jiraStuff_board_timeByTeam_componentMobile').checked = _configUser.board.timeByTeam.componentMobile;
                            configBtnJira.querySelector('#jiraStuff_board_timeByTeam_componentIT').checked = _configUser.board.timeByTeam.componentIT;
                            configBtnJira.querySelector('#jiraStuff_board_timeByTeam_componentTesting').checked = _configUser.board.timeByTeam.componentTesting;
                            configBtnJira.querySelector('#jiraStuff_board_timeByTeam_componentAutomation').checked = _configUser.board.timeByTeam.componentAutomation;
                            configBtnJira.querySelector('#jiraStuff_board_timeByTeam_openIssuesInStories').checked = _configUser.board.timeByTeam.openIssuesInStories;
                            configBtnJira.querySelector('#jiraStuff_board_timeByTeam_openClarificationsInStories').checked = _configUser.board.timeByTeam.openClarificationsInStories;
                            configBtnJira.querySelector('#jiraStuff_board_timeByTeam_showUsersWorkingSubtasks').checked = _configUser.board.timeByTeam.showUsersWorkingSubtasks;
                            configBtnJira.querySelector('#jiraStuff_board_timeByTeam_splitTimeInDays').checked = _configUser.board.timeByTeam.splitTimeInDays;
                            configBtnJira.querySelector('#jiraStuff_board_timeByTeam_showRemainingLabel').checked = _configUser.board.timeByTeam.showRemainingLabel;
                            configBtnJira.querySelector('#jiraStuff_board_timeByTeam_showComponentEmojis').checked = _configUser.board.timeByTeam.showComponentEmojis;
                            configBtnJira.querySelector('#jiraStuff_board_timeByTeam_showComponentLabels').checked = _configUser.board.timeByTeam.showComponentLabels;
                            configBtnJira.querySelector('#jiraStuff_board_leadTime_enable').checked = _configUser.board.leadTime.enabled;
                            configBtnJira.querySelector('#jiraStuff_board_leadTime_maxDays').value = _configUser.board.leadTime.maxDays;
                            configBtnJira.querySelector('#jiraStuff_board_deadEnds_enable').checked = _configUser.board.deadEnds.enabled;
                            configBtnJira.querySelector('#jiraStuff_board_reduceColumnHeaders_enable').checked = _configUser.board.reduceColumnHeaders.enabled;
                            configBtnJira.querySelector('#jiraStuff_board_missingHoursInPlanning_enable').checked = _configUser.board.missingHoursInPlanning.enabled;
                            configBtnJira.querySelector('#jiraStuff_board_PRs_enable').checked = _configUser.board.PRs.enabled;
                            configBtnJira.querySelector('#jiraStuff_board_forceIssuesOldView_enable').checked = _configUser.board.forceIssuesOldView.enabled;

                            // issues
                            configBtnJira.querySelector('#jiraStuff_issues_timeBySubtask_timeBySubtaskNew').checked = _configUser.issues.timeBySubtaskNew.enabled;
                            configBtnJira.querySelector('#jiraStuff_issues_timeBySubtask_timeBySubtaskNew_copyIssueId').checked = _configUser.issues.timeBySubtaskNew.copyIssueId;
                            configBtnJira.querySelector('#jiraStuff_issues_timeBySubtask_timeBySubtaskNew_hideDefaultGraph').checked = _configUser.issues.timeBySubtaskNew.hideDefaultGraph;
                            configBtnJira.querySelector('#jiraStuff_issues_timeBySubtask_timeBySubtaskNew_hidePriority').checked = _configUser.issues.timeBySubtaskNew.hidePriority;
                            configBtnJira.querySelector('#jiraStuff_issues_timeBySubtask_timeBySubtaskNew_costCode').checked = _configUser.issues.timeBySubtaskNew.costCode;
                            configBtnJira.querySelector('#jiraStuff_issues_timeBySubtask_timeBySubtaskOld').checked = _configUser.issues.timeBySubtaskOld.enabled;
                            configBtnJira.querySelector('#jiraStuff_issues_taskGenie_enabled').checked = _configUser.issues.taskGenie.enabled;
                            configBtnJira.querySelector('#jiraStuff_issues_logtime_task').checked = _configUser.issues.logTime.task;
                            configBtnJira.querySelector('#jiraStuff_issues_logtime_subtasks').checked = _configUser.issues.logTime.subtasks;
                            configBtnJira.querySelector('#jiraStuff_issues_styles_changeTaskStatusFixedSize').checked = _configUser.issues.styles.changeTaskStatusFixedSize;

                            // releases
                            configBtnJira.querySelector('#jiraStuff_releases_documentationTasks_enabled').checked = _configUser.releases.documentationTasks.enabled;
                            configBtnJira.querySelector('#jiraStuff_releases_missingFixedVersion_enabled').checked = _configUser.releases.missingFixedVersion.enabled;
                            //configBtnJira.querySelector('#jiraStuff_releases_bugTimesByRelease_enabled').checked = _configUser.releases.bugTimesByRelease.enabled;
                            //configBtnJira.querySelector('#jiraStuff_releases_showBranchs_enabled').checked = _configUser.releases.showBranchs.enabled;

                            //logs
                            configBtnJira.querySelector('#jiraStuff_log_showDebug').checked = _configUser.log.showDebug;
                            configBtnJira.querySelector('#jiraStuff_log_showTimers').checked = _configUser.log.showTimers;
                            configBtnJira.querySelector('#jiraStuff_log_showEngine').checked = _configUser.log.showEngine;
                        }
                    });

                    // bind save
                    configBtnJira.querySelector('#jsf_Save').addEventListener('click', e => {
                        _logDebug('configButton save click');
                        _configUser.board.timeByTeam.enabled = configBtnJira.querySelector('#jiraStuff_board_timeByTeam_enable').checked;
                        _configUser.board.timeByTeam.mergeWebTeam = configBtnJira.querySelector('#jiraStuff_board_timeByTeam_mergeWebTeam').checked;
                        _configUser.board.timeByTeam.componentWeb = configBtnJira.querySelector('#jiraStuff_board_timeByTeam_componentWeb').checked;
                        _configUser.board.timeByTeam.componentApi = configBtnJira.querySelector('#jiraStuff_board_timeByTeam_componentApi').checked;
                        _configUser.board.timeByTeam.componentDesktop = configBtnJira.querySelector('#jiraStuff_board_timeByTeam_componentDesktop').checked;
                        _configUser.board.timeByTeam.componentMobile = configBtnJira.querySelector('#jiraStuff_board_timeByTeam_componentMobile').checked;
                        _configUser.board.timeByTeam.componentIT = configBtnJira.querySelector('#jiraStuff_board_timeByTeam_componentIT').checked;
                        _configUser.board.timeByTeam.componentTesting = configBtnJira.querySelector('#jiraStuff_board_timeByTeam_componentTesting').checked;
                        _configUser.board.timeByTeam.componentAutomation = configBtnJira.querySelector('#jiraStuff_board_timeByTeam_componentAutomation').checked;
                        _configUser.board.timeByTeam.openIssuesInStories = configBtnJira.querySelector('#jiraStuff_board_timeByTeam_openIssuesInStories').checked;
                        _configUser.board.timeByTeam.openClarificationsInStories = configBtnJira.querySelector('#jiraStuff_board_timeByTeam_openClarificationsInStories').checked;
                        _configUser.board.timeByTeam.showUsersWorkingSubtasks = configBtnJira.querySelector('#jiraStuff_board_timeByTeam_showUsersWorkingSubtasks').checked;
                        _configUser.board.timeByTeam.splitTimeInDays = configBtnJira.querySelector('#jiraStuff_board_timeByTeam_splitTimeInDays').checked;
                        _configUser.board.timeByTeam.showRemainingLabel = configBtnJira.querySelector('#jiraStuff_board_timeByTeam_showRemainingLabel').checked;
                        _configUser.board.timeByTeam.showComponentEmojis = configBtnJira.querySelector('#jiraStuff_board_timeByTeam_showComponentEmojis').checked;
                        _configUser.board.timeByTeam.showComponentLabels = configBtnJira.querySelector('#jiraStuff_board_timeByTeam_showComponentLabels').checked;
                        _configUser.board.leadTime.enabled = configBtnJira.querySelector('#jiraStuff_board_leadTime_enable').checked;
                        _configUser.board.leadTime.maxDays = configBtnJira.querySelector('#jiraStuff_board_leadTime_maxDays').value;
                        _configUser.board.deadEnds.enabled = configBtnJira.querySelector('#jiraStuff_board_deadEnds_enable').checked;
                        _configUser.board.reduceColumnHeaders.enabled = configBtnJira.querySelector('#jiraStuff_board_reduceColumnHeaders_enable').checked;
                        _configUser.board.missingHoursInPlanning.enabled = configBtnJira.querySelector('#jiraStuff_board_missingHoursInPlanning_enable').checked;
                        _configUser.board.PRs.enabled = configBtnJira.querySelector('#jiraStuff_board_PRs_enable').checked;
                        _configUser.board.forceIssuesOldView.enabled = configBtnJira.querySelector('#jiraStuff_board_forceIssuesOldView_enable').checked;

                        // issues
                        _configUser.issues.timeBySubtaskNew.enabled = configBtnJira.querySelector('#jiraStuff_issues_timeBySubtask_timeBySubtaskNew').checked;
                        _configUser.issues.timeBySubtaskNew.copyIssueId = configBtnJira.querySelector('#jiraStuff_issues_timeBySubtask_timeBySubtaskNew_copyIssueId').checked;
                        _configUser.issues.timeBySubtaskNew.hideDefaultGraph = configBtnJira.querySelector('#jiraStuff_issues_timeBySubtask_timeBySubtaskNew_hideDefaultGraph').checked;
                        _configUser.issues.timeBySubtaskNew.hidePriority = configBtnJira.querySelector('#jiraStuff_issues_timeBySubtask_timeBySubtaskNew_hidePriority').checked;
                        _configUser.issues.timeBySubtaskNew.costCode = configBtnJira.querySelector('#jiraStuff_issues_timeBySubtask_timeBySubtaskNew_costCode').checked;
                        _configUser.issues.timeBySubtaskOld.enabled = configBtnJira.querySelector('#jiraStuff_issues_timeBySubtask_timeBySubtaskOld').checked;
                        _configUser.issues.taskGenie.enabled = configBtnJira.querySelector('#jiraStuff_issues_taskGenie_enabled').checked;
                        _configUser.issues.logTime.task = configBtnJira.querySelector('#jiraStuff_issues_logtime_task').checked;
                        _configUser.issues.logTime.subtasks = configBtnJira.querySelector('#jiraStuff_issues_logtime_subtasks').checked;
                        _configUser.issues.styles.changeTaskStatusFixedSize = configBtnJira.querySelector('#jiraStuff_issues_styles_changeTaskStatusFixedSize').checked;

                        // releases
                        _configUser.releases.documentationTasks.enabled = configBtnJira.querySelector('#jiraStuff_releases_documentationTasks_enabled').checked;
                        _configUser.releases.missingFixedVersion.enabled = configBtnJira.querySelector('#jiraStuff_releases_missingFixedVersion_enabled').checked;
                        //_configUser.releases.bugTimesByRelease.enabled = configBtnJira.querySelector('#jiraStuff_releases_bugTimesByRelease_enabled').checked;
                        //_configUser.releases.showBranchs.enabled = configBtnJira.querySelector('#jiraStuff_releases_showBranchs_enabled').checked;

                        //logs
                        _configUser.log.showDebug = configBtnJira.querySelector('#jiraStuff_log_showDebug').checked;
                        _configUser.log.showTimers = configBtnJira.querySelector('#jiraStuff_log_showTimers').checked;
                        _configUser.log.showEngine = configBtnJira.querySelector('#jiraStuff_log_showEngine').checked;

                        // save to cookie
                        _cookiesLib.set('jiraStuff', _configUser, { expires: 3650 });

                        document.location = document.location;
                    });

                    // bind reset values
                    configBtnJira.querySelector('#jsf_Reset').addEventListener('click', e => {
                        _logDebug('configButton reset click');
                        // save to cookie
                        _cookiesLib.set('jiraStuff', _configDefault(), { expires: 3650 });

                        document.location = document.location;
                    });
                }
            }
        }

        function createTable(tableData) {
            _logDebug('createTable');
            var table = document.createElement('table');
            table.style.border = 'solid';
            var tableBody = document.createElement('tbody');

            tableData.forEach(function (rowData) {
                var row = document.createElement('tr');

                rowData.forEach(function (cellData) {
                    var cell = document.createElement('td');
                    cell.style.border = 'solid';
                    cell.style.paddingLeft = '6px';
                    cell.appendChild(document.createTextNode(cellData));
                    row.appendChild(cell);
                });

                tableBody.appendChild(row);
            });

            table.appendChild(tableBody);
            return table;
        }

        function mergeObject(destinationObj, sourceObj) {
            let logPreffix = 'mergeObject - ';
            // loop all propperties
            if (sourceObj) {
                for (const propKey in sourceObj) {
                    if (sourceObj.hasOwnProperty(propKey)) {
                        _logEngine(logPreffix + 'propKey:' + propKey);
                        // node
                        if (typeof (sourceObj[propKey]) === 'object') {
                            _logEngine(logPreffix + '"' + propKey + '"' + ' is node');
                            if (!destinationObj[propKey]) {
                                _logEngine(logPreffix + 'copied node:' + propKey);
                                destinationObj[propKey] = sourceObj[propKey];
                            }
                            mergeObject(destinationObj[propKey], sourceObj[propKey]);
                        }
                        //leaf
                        else {
                            _logEngine(logPreffix + 'copied leaf:' + propKey);
                            destinationObj[propKey] = sourceObj[propKey];
                        }
                    }
                }
            }
        }

        //// --- LOGS * ////

        function _logEngine(msg) {
            if (_configUser.log.showEngine) {
                console.log('🌻jiraStuff🌻 - 🌋 - ' + msg);
            }
        }

        function _logTimer(msg) {
            if (_configUser.log.showTimers) {
                console.log('🌻jiraStuff🌻 - 🔄 - ' + msg);
            }
        }

        function _logDebug(msg) {
            if (_configUser.log.showDebug) {
                console.log('🌻jiraStuff🌻 - ' + msg);
            }
        }

        function _logError(message, exception) {
            let errorMsg = '☠️jiraStuff☠️ - ' + message;
            if (exception) {
                errorMsg += '\r\n EXCEPTION \r\n MESSAGE:' + exception.message + ' \r\n STACK:' + exception.stack;
            }
            console.error(errorMsg);
        }

        //// * LOGS --- ////

        //////// --- UTILS * ////////

        //////// --- BITBUCKET * ////////

        function bb_createPullRequestStuff() {
            _logDebug('bb_createPullRequestStuff');

            let titleContainerElem = document.querySelector('.field-group.pull-request-title');

            if (titleContainerElem) {
                let buttonsContainer = document.createElement('div');
                buttonsContainer.id = 'bitStuff_pullRequestButtons';
                buttonsContainer.style.paddingLeft = '3em';
                buttonsContainer.style.display = 'inline-block';
                titleContainerElem.appendChild(buttonsContainer);

                let createButton = function (label, btnLabel, getReleaseVersion) {
                    let buttonElem = document.createElement('a');
                    buttonElem.textContent = btnLabel;
                    buttonElem.href = 'javascript:void(0);';
                    buttonElem.style.cursor = 'pointer';
                    buttonElem.style.border = 'solid';
                    buttonElem.style.borderColor = 'mediumpurple';
                    buttonElem.style.margin = '0 4px';
                    buttonElem.style.borderRadius = '6px';
                    buttonElem.style.padding = '2px';
                    buttonElem.style.textDecoration = 'none';

                    //onclick append label to title
                    buttonElem.addEventListener('click', () => {
                        _logDebug('bb_createPullRequestStuff button click');

                        let titleInput = document.querySelector('.field-group.pull-request-title input');
                        //clean
                        let tmpValue = titleInput.value
                            .replace(_configUser.bitbucket.createPullRequest.prefixes.feature, '')
                            .replace(_configUser.bitbucket.createPullRequest.prefixes.release, '')
                            .replace(_configUser.bitbucket.createPullRequest.prefixes.bugfix, '')
                            .replace(_configUser.bitbucket.createPullRequest.prefixes.hotfix, '')
                            .replace(/release\/atlantis/gi, 'ATLANTIS')
                            .replace(/feature\/atlantis/gi, 'ATLANTIS')
                            .replace(/hotfix\/atlantis/gi, 'ATLANTIS')
                            .replace(/bugfix\/atlantis/gi, 'ATLANTIS');

                        if (getReleaseVersion) {
                            try {
                                // extract release version
                                let releaseNumber = document.querySelectorAll('.ref.branch .name')[1].textContent.split('/v')[1];
                                if (releaseNumber) {
                                    tmpValue = 'v' + releaseNumber;
                                }
                            } catch {
                                //lazy ignore
                            }
                        }

                        titleInput.value = label + tmpValue;
                    });

                    // append to container
                    buttonsContainer.appendChild(buttonElem);
                };

                createButton(_configUser.bitbucket.createPullRequest.prefixes.feature, _configUser.bitbucket.createPullRequest.prefixes.feature, false);
                createButton(_configUser.bitbucket.createPullRequest.prefixes.release, _configUser.bitbucket.createPullRequest.prefixes.release, true);
                createButton(_configUser.bitbucket.createPullRequest.prefixes.bugfix, _configUser.bitbucket.createPullRequest.prefixes.bugfix, false);
                createButton(_configUser.bitbucket.createPullRequest.prefixes.hotfix, _configUser.bitbucket.createPullRequest.prefixes.hotfix, false);
                createButton('', 'X');
            }
        }

        function bb_createFilter() {
            _logDebug('bb_createFilter');

            //click on all 'Load more pull requests' buttons
            document.querySelectorAll('.aui-button.aui-button-link').forEach(elem => {
                if (elem.textContent === 'Load more pull requests') {
                    elem.click();
                }
            });

            // create filter container elem
            let containerElem = document.querySelector('.dashboard-your-work > h3');
            let filterContainer = document.createElement('span');
            filterContainer.id = 'bitStuff_filterContainer';
            filterContainer.textContent = '🧙 filter:';
            //filterContainer.style.paddingLeft = '3em';
            filterContainer.style.float = 'right';
            containerElem.appendChild(filterContainer);

            // create text filter elem
            let textFilterElem = document.createElement('input');
            textFilterElem.id = 'bitStuff_textFilter';
            textFilterElem.type = 'text';
            textFilterElem.style.marginLeft = '1em';
            filterContainer.appendChild(textFilterElem);

            textFilterElem.addEventListener('keyup', e => {
                _logDebug('keyUp - bb_filterPRs');
                bb_filterPRs();
            });

            // create project filter elem
            //find all projects
            const uniqueProjs = [];
            document.querySelectorAll('.dashboard-pull-requests-table tr .project-and-repository .name').forEach(projElem => {
                let projName = projElem.textContent;
                // check if proj is unique
                if (uniqueProjs.filter(x => x === projName).length === 0) {
                    uniqueProjs.push(projName);
                }
            });
            //sort
            uniqueProjs.sort();

            //create proj filter
            let projFilterContainer = document.createElement('div');
            let projFilterLabel = document.createElement('h3');
            projFilterLabel.textContent = '🧙 projects:';
            projFilterContainer.appendChild(projFilterLabel);
            let checksContainer = document.createElement('ul');
            checksContainer.id = 'bitStuff_projSelectContainer';
            checksContainer.className = 'small';
            checksContainer.style.userSelect = 'none';
            checksContainer.style.listStyle = 'none';



            // all check
            // check
            let allItem = document.createElement('li');
            let allCheck = document.createElement('input');
            allCheck.id = 'projSelectAll';
            allCheck.type = 'checkbox';
            allCheck.checked = 'true';
            // label
            let allLabel = document.createElement('label');
            allLabel.textContent = 'all projects';
            allLabel.htmlFor = allCheck.id;
            //ballons
            let greenBallon = document.createElement('span');
            greenBallon.className = 'my_foot_was_a_ballon greenBallon';
            greenBallon.style.display = 'none';
            greenBallon.title = 'open PRs - OK';
            let greyBallon = document.createElement('span');
            greyBallon.className = 'my_foot_was_a_ballon greyBallon';
            greyBallon.style.display = 'none';
            greyBallon.title = 'open PRs - OK';
            let redBallon = document.createElement('span');
            redBallon.className = 'my_foot_was_a_ballon redBallon';
            redBallon.style.display = 'none';
            redBallon.title = 'open PRs - not building';

            // append all item
            allItem.appendChild(allCheck);
            allItem.appendChild(allLabel);
            allItem.appendChild(greenBallon);
            allItem.appendChild(greyBallon);
            allItem.appendChild(redBallon);
            checksContainer.appendChild(allItem);

            // project selector container
            uniqueProjs.forEach(projName => {
                // check
                let projItem = document.createElement('li');
                let projCheck = document.createElement('input');
                projCheck.id = projName;
                projCheck.type = 'checkbox';
                projCheck.checked = false;
                projCheck.value = projName;
                // label
                let projLabel = document.createElement('label');
                projLabel.textContent = projName;
                projLabel.htmlFor = projName;
                //ballons
                let greenBallon = document.createElement('span');
                greenBallon.className = 'my_foot_was_a_ballon greenBallon';
                greenBallon.style.display = 'none';
                greenBallon.title = 'open PRs - OK';
                let greyBallon = document.createElement('span');
                greyBallon.className = 'my_foot_was_a_ballon greyBallon';
                greyBallon.style.display = 'none';
                greyBallon.title = 'open PRs - in progress';
                let redBallon = document.createElement('span');
                redBallon.className = 'my_foot_was_a_ballon redBallon';
                redBallon.style.display = 'none';
                redBallon.title = 'open PRs - not ok';

                //append project selector
                projItem.appendChild(projCheck);
                projItem.appendChild(projLabel);
                projItem.appendChild(greenBallon);
                projItem.appendChild(greyBallon);
                projItem.appendChild(redBallon);
                checksContainer.appendChild(projItem);

                // project check change event
                projCheck.addEventListener('change', e => {
                    _logDebug('change - projCheck');
                    // deselect 'all' only if atleast one is selected
                    let selectedCount = document.querySelectorAll('#bitStuff_projSelectContainer input:not(#projSelectAll):checked').length;
                    document.getElementById('projSelectAll').checked = !(selectedCount > 0);

                    bb_filterPRs();
                });
            });

            // all check change event
            allCheck.addEventListener('change', e => {
                _logDebug('change - projSelectAll');

                // on all checked, deselect others
                if (e.target.checked) {
                    document.querySelectorAll('#bitStuff_projSelectContainer input:not(#projSelectAll)').forEach(projSelectElem => {
                        projSelectElem.checked = false;
                    });
                    bb_filterPRs();
                }
            });

            // append elems main container
            projFilterContainer.appendChild(checksContainer);
            projFilterContainer.append(document.createElement('hr'));
            document.querySelector('#dashboard-repositories').prepend(projFilterContainer);

        }

        function bb_filterPRs() {
            _logDebug('bb_filterPRs');

            let searchTextFixed = document.getElementById('bitStuff_textFilter').value.trim().toLowerCase();
            let allSelected = document.getElementById('projSelectAll').checked;
            let selectedProjs = [];
            document.querySelectorAll('#bitStuff_projSelectContainer input:checked').forEach(selectedProj => selectedProjs.push(selectedProj.value));

            document.querySelectorAll('.dashboard-pull-requests-table tr .title').forEach(titleElem => {
                let rowElem = titleElem.closest('tr');
                let projectElem = rowElem.querySelector('.project-and-repository');
                let projectName = projectElem.querySelector('.name').textContent;
                //let row = rowElem.closest('tr');
                let matchText = !searchTextFixed || titleElem.textContent.toLowerCase().indexOf(searchTextFixed) >= 0;
                let matchSelectedProjects = allSelected || selectedProjs.filter(x => x === projectName).length > 0;
                if (matchText && matchSelectedProjects) {
                    rowElem.style.display = 'table-row';
                }
                else {
                    rowElem.style.display = 'none';
                }
            });
            bb_updatePRsState(true);
        }

        function bb_updatePRsState(notTimer) {
            if (notTimer) {
                _logDebug('bb_updatePRsState');
            }
            else {
                _logTimer('bb_updatePRsState');
            }
            // clear previous data
            let projSelectElems = document.querySelectorAll('#bitStuff_projSelectContainer input');
            projSelectElems.forEach(elem => {
                elem.dataset.openOk = 0;
                elem.dataset.openNotOk = 0;
                elem.dataset.openInProgess = 0;
            });

            let allSelectElem = document.getElementById('projSelectAll');

            document.querySelectorAll('.dashboard-pull-requests-table-reviewing tr .title, .dashboard-pull-requests-table-created tr .title').forEach(titleElem => {
                let rowElem = titleElem.closest('tr');
                let projectElem = rowElem.querySelector('.project-and-repository');
                let projectName = projectElem.querySelector('.name').textContent;
                let buildStatus = rowElem.querySelector('[data-build-status]')?.dataset.buildStatus;

                let projSelectElem = document.getElementById(projectName);
                switch (buildStatus) {
                    case "FAILED":
                        allSelectElem.dataset.openNotOk = Number(allSelectElem.dataset.openNotOk) + 1;
                        projSelectElem.dataset.openNotOk = Number(projSelectElem.dataset.openNotOk) + 1;
                        break;
                    case "INPROGRESS":
                        allSelectElem.dataset.openInProgess = Number(allSelectElem.dataset.openInProgess) + 1;
                        projSelectElem.dataset.openInProgess = Number(projSelectElem.dataset.openInProgess) + 1;
                        break;
                    default:
                        allSelectElem.dataset.openOk = Number(allSelectElem.dataset.openOk) + 1;
                        projSelectElem.dataset.openOk = Number(projSelectElem.dataset.openOk) + 1;
                        break;
                }

                // draw states
                projSelectElems.forEach(elem => {
                    let green = elem.parentElement.querySelector('.greenBallon');
                    let grey = elem.parentElement.querySelector('.greyBallon');
                    let red = elem.parentElement.querySelector('.redBallon');
                    green.style.display = 'none';
                    green.textContent = '';
                    grey.style.display = 'none';
                    grey.textContent = '';
                    red.style.display = 'none';
                    red.textContent = '';
                    if (elem.dataset.openOk > 0) {
                        green.style.display = '';
                        green.textContent = elem.dataset.openOk;
                    }
                    if (elem.dataset.openInProgess > 0) {
                        grey.style.display = '';
                        grey.textContent = elem.dataset.openInProgess;
                    }
                    if (elem.dataset.openNotOk > 0) {
                        red.style.display = '';
                        red.textContent = elem.dataset.openNotOk;
                    }
                });
            });
        }

        function bb_createSonarLinks() {
            _logDebug('bb_createSonarLinks');

            // all PRs with build
            //document.querySelectorAll('.dashboard-pull-requests-table tr .build-status-dashboard-pr-list-col-value')
            //document.querySelectorAll('.dashboard-pull-requests-table-reviewing tr [data-pull-request-id], .dashboard-pull-requests-table-created tr [data-pull-request-id]')
            document.querySelectorAll('tr [data-pull-request-id]')
                .forEach(prElem => {
                    let rowElem = prElem.closest('tr');

                    let projectName;
                    if (_page.isDashboard) {
                        let projectElem = rowElem.querySelector('.project-and-repository');
                        projectName = projectElem.querySelector('.name').textContent;
                    }
                    else if (_page.isPullRequests) {
                        projectName = document.querySelector('.aui-page-header-main .aui-nav-selected').textContent;
                    }

                    let pullRequestId = prElem.dataset.pullRequestId;
                    let projectElemSplit = projectName.split('.');
                    let projSonarLabel = projectElemSplit.pop();

                    switch (projSonarLabel) {
                        case 'Portal':
                        case 'Authentication':
                        case 'Business':
                        case 'Mobile':
                        case 'Notification':
                        case 'SCIM':
                            break;
                        default:
                            projSonarLabel = '';
                    }

                    if (projSonarLabel) {
                        let sonarContainerCell = document.createElement('td');
                        sonarContainerCell.className = 'jiraStuff sonar';
                        sonarContainerCell.style.width = '1em';
                        let sonarLinkElem = document.createElement('a');
                        sonarLinkElem.textContent = '📡';
                        sonarLinkElem.target = '_blank';
                        sonarLinkElem.style.textDecoration = 'none';
                        let projSonarId = projSonarLabel + '_PR-' + pullRequestId;
                        sonarLinkElem.title = 'open Sonarqube ' + projSonarId;
                        sonarLinkElem.href = 'http://deploymentapp:9000/dashboard?id=' + projSonarId;

                        sonarContainerCell.appendChild(sonarLinkElem);
                        rowElem.appendChild(sonarContainerCell);
                    }
                });

        }

        function bb_createJenkinsLinks() {
            _logDebug('bb_createJenkinsLinks');

            let buildIcons = document.querySelectorAll('.build-icon');
            if (buildIcons.length > 0) {

                //destroy timer
                clearInterval(_timerCreateJenkinsLinks);

                // all PRs with build
                //document.querySelectorAll('.dashboard-pull-requests-table tr .build-status-dashboard-pr-list-col-value')
                //document.querySelectorAll('.dashboard-pull-requests-table-reviewing tr [data-pull-request-id], .dashboard-pull-requests-table-created tr [data-pull-request-id]')
                document.querySelectorAll('tr [data-pull-request-id]')
                    .forEach(prElem => {
                        let rowElem = prElem.closest('tr');

                        let projectName;
                        if (_page.isDashboard) {
                            let projectElem = rowElem.querySelector('.project-and-repository');
                            projectName = projectElem.querySelector('.name').textContent;
                        }
                        else if (_page.isPullRequests) {
                            projectName = document.querySelector('.aui-page-header-main .aui-nav-selected').textContent;
                        }

                        let pullRequestId = prElem.dataset.pullRequestId;
                        let projectElemSplit = projectName.split('.');
                        let projSonarLabel = projectElemSplit.pop();
                        let projJenkings = '';
                        let buildStatusElem = rowElem.querySelector('[data-build-status]');

                        // show only if not success
                        if (buildStatusElem && buildStatusElem.dataset.buildStatus !== 'SUCCESS') {

                            switch (projSonarLabel) {
                                case 'Authentication':
                                    projJenkings = 'dev.waynbo.api.authentication';
                                    break;
                                case 'Business':
                                    projJenkings = 'dev.waynbo.api.business';
                                    break;
                                case 'Mobile':
                                    projJenkings = 'dev.hyena.app';
                                    break;
                                case 'Portal':
                                    projJenkings = 'dev.waynbo.portal';
                                    break;
                                default:
                                    projSonarLabel = '';
                            }

                            if (projSonarLabel) {
                                let jenkinsContainerCell = document.createElement('td');
                                jenkinsContainerCell.className = 'jiraStuff jenkins';
                                jenkinsContainerCell.style.width = '1em';
                                let jenkinsLinkElem = document.createElement('a');
                                jenkinsLinkElem.textContent = '🎩';
                                jenkinsLinkElem.target = '_blank';
                                jenkinsLinkElem.style.textDecoration = 'none';
                                let projJenkinsId = 'PR-' + pullRequestId;
                                jenkinsLinkElem.title = 'open Jenkins ' + projJenkinsId;
                                jenkinsLinkElem.href = 'http://deploymentapp:8080/view/Development/job/' + projJenkings + '/view/change-requests/job/' + projJenkinsId;

                                jenkinsContainerCell.appendChild(jenkinsLinkElem);
                                rowElem.appendChild(jenkinsContainerCell);
                            }

                        }
                    });
            }
        }

        //// * BITBUCKET --- ////

    }
    catch (exception) {
        console.error('☠️jiraStuff☠️ - EXCEPTION \r\n MESSAGE:' + exception.message + ' \r\n STACK:' + exception.stack);
    }
})();
