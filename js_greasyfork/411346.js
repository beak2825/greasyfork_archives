// ==UserScript==
// @name Codeforces Optimal Theme
// @version 8.5
// @description Easy to read and saves your eyes. Most colors and styles of elements are choosed using Golden Ratio Technique.
// @author Roman Lukyanchikov
// @match http://codeforces.com/*
// @match https://codeforces.com/*
// @match http://m1.codeforces.com/*
// @match https://m1.codeforces.com/*
// @match http://m2.codeforces.com/*
// @match https://m2.codeforces.com/*
// @match http://m3.codeforces.com/*
// @match https://m3.codeforces.com/*
// @grant GM_addStyle
// @grant GM.listValues
// @grant GM.setValue
// @grant GM.getValue
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_listValues
// @run-at document-start
// @namespace https://greasyfork.org/users/687494
// @downloadURL https://update.greasyfork.org/scripts/411346/Codeforces%20Optimal%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/411346/Codeforces%20Optimal%20Theme.meta.js
// ==/UserScript==
window.onload = function() {
    document.getElementsByTagName("head")[0].innerHTML += '<link rel="preconnect" href="https://fonts.googleapis.com"> <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin> <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">';
}
GM_addStyle("body {background-color: hsl(0, 0%, 62%) !important; color: black; font-family: 'IBM Plex Sans', sans-serif !important; background-image: none !important}");
GM_addStyle(".roundbox.menu-box {border: 1px solid gray !important; background-color: hsl(0, 0%, 69%) !important}");
GM_addStyle(".roundbox pre {background-color: white !important}");
GM_addStyle("div.source-copier {color: white !important; border-color: gray !important; background-color: hsl(0, 0%, 19%) !important; border-radius: 6px !important}");
GM_addStyle("div.source-copier:hover {color: black !important; border-color: hsl(0, 0%, 62%) !important; background-color: white !important; border-radius: 6px !important}");
GM_addStyle("div.roundbox.highlight-blue.sidebox.smaller {background-color: #CFE7FF !important}");
GM_addStyle("div.ttypography h1, h2, h3, h4, h5, h6 {font-family: 'IBM Plex Sans' !important}");
GM_addStyle(".ttypography {color: black !important; font-family: 'IBM Plex Sans', sans-serif !important}");
GM_addStyle(".ttypography .problem-statement .header {color: black !important; font-family: 'IBM Plex Sans', sans-serif !important}");
GM_addStyle(".ttypography .problem-statement .header .title {color: black !important; font-family: 'IBM Plex Sans', sans-serif !important}");
GM_addStyle(".ttypography a:hover {background-color: hsl(0, 0%, 69%) !important}");
GM_addStyle(".ttypography a:focus {background-color: hsl(0, 0%, 69%) !important}");
GM_addStyle(".datatable td .notice.small {color: hsl(0, 0%, 38%) !important}");
GM_addStyle(".datatable thead {background-color: hsl(0, 0%, 69%) !important}");
GM_addStyle("span.notice {color: hsl(0, 0%, 38%) !important}");
GM_addStyle("div.notice {color: hsl(0, 0%, 38%) !important}");
GM_addStyle(".custom-links-pagination a {color: hsl(0, 0%, 38%) !important}");
GM_addStyle(".custom-links-pagination .active {color: black !important}");
GM_addStyle(".roundbox .roundbox-lt {background: none !important}");
GM_addStyle(".roundbox .roundbox-rt {background: none !important}");
GM_addStyle(".roundbox .roundbox-lb {background: none !important}");
GM_addStyle(".roundbox .roundbox-rb {background: none !important}");
GM_addStyle(".roundbox {border: 1px solid gray !important; background-color: hsl(0, 0%, 69%) !important; border-radius: 6px !important; box-shadow: 0px 0px 8px hsl(0deg 0% 38%) !important}");
GM_addStyle(".topic .notice {color: hsl(0, 0%, 38%) !important}");
GM_addStyle(".topic .title p {color: black !important; font-family: 'IBM Plex Sans', sans-serif !important; font-size: 1em !important}");
GM_addStyle(".menu-box .search {color: hsl(0, 0%, 62%) !important; border: 2px solid hsl(0, 0%, 38%); border-radius: 5px; background: hsl(0, 0%, 62%) url(https://codeforces.com/images/search-16x16.png) 2px 2px no-repeat}");
GM_addStyle(".contest-state-phase {color: #0067CF !important}");
GM_addStyle(".roundbox .caption {color: #0067CF !important}");
GM_addStyle(".roundbox.meta {border: 1px solid gray !important; background-color: hsl(0, 0%, 69%) !important}");
GM_addStyle(".left-meta span {color: #006100}");
GM_addStyle(".ttypography p {line-height: 1.62em !important; font-family: 'IBM Plex Sans', sans-serif !important}");
GM_addStyle(".topic .content {border-left: 6px solid gray !important; !important; font-size: 1em !important; line-height: 1.62em !important}");
GM_addStyle(".countdown {color: hsl(0, 0%, 38%) !important}");
GM_addStyle(".propertyLinks span {color: hsl(0, 0%, 38%) !important}");
GM_addStyle(".roundbox .titled {border-bottom: 1px solid gray !important}");
GM_addStyle(".roundbox .dark {background-color: hsl(0, 0%, 62%) !important}");
GM_addStyle(".roundbox .bottom-links {background-color: hsl(0, 0%, 69%) !important; border: none !important; border-radius: 6px !important}");
GM_addStyle(".handleForm input {background-color: hsl(0, 0%, 19%) !important; color: hsl(0, 0%, 62%) !important; border: 2px solid hsl(0, 0%, 38%) !important; !important; border-radius: 5px !important}");
GM_addStyle(".pagination span.active {background-color: hsl(0, 0%, 69%) !important; border: none !important}");
GM_addStyle(".lang-chooser div {background-color: hsl(0, 0%, 62%) !important}");
GM_addStyle(".highlights {color: hsl(0, 0%, 38%) !important}");
GM_addStyle(".search-help code {background: hsl(0, 0%, 62%) !important; border: none !important; }");
GM_addStyle(".search-large {background: hsl(0, 0%, 62%) url(https://codeforces.com/images/search-24x24.png) 2px 2px no-repeat !important; color: hsl(0, 0%, 38%) !important; border: none !important}");
GM_addStyle(".ac_over {background-color: hsl(0, 0%, 19%) !important; color: white !important}");
GM_addStyle(".ac_odd {background-color: hsl(0, 0%, 62%)}");
GM_addStyle(".ac_even {background-color: hsl(0, 0%, 69%)}");
GM_addStyle(".button-up {color: hsl(0, 0%, 38%) !important}");
GM_addStyle(".menu-list li.current {border-bottom: 3px solid hsl(0, 0%, 19%) !important}");
GM_addStyle(".menu-list li a, .menu-list li a:visited {color: black !important}");
GM_addStyle(".contest-name a, .contest-name a:visited {color: hsl(0, 0%, 19%) !important}");
GM_addStyle(".title-photo div {border: none !important}");
GM_addStyle(".main-info div {color: hsl(0, 0%, 38%) !important}");
GM_addStyle(".roundbox .rtable td {border: none !important}");
GM_addStyle(".roundbox .rtable th {border: none !important; border-top: none !important}");
GM_addStyle(".datatable {background-color: hsl(0, 0%, 69%) !important; border: 1px solid gray !important; border-radius: 6px !important; box-shadow: 0px 0px 8px hsl(0deg 0% 38%) !important}");
GM_addStyle(".datatable tbody {background-color: hsl(0, 0%, 69%) !important}");
GM_addStyle(".datatable tbody .dark {background-color: hsl(0, 0%, 62%)}");
GM_addStyle(".lt {background: none !important}");
GM_addStyle(".rt {background: none !important}");
GM_addStyle(".lb {background: none !important}");
GM_addStyle(".rb {background: none !important}");
GM_addStyle(".ilt {background: none !important}");
GM_addStyle(".irt {background: none !important}");
GM_addStyle(".ilb {background: none !important}");
GM_addStyle(".irb {background: none !important}");
GM_addStyle(".contests-table {background: hsl(0, 0%, 62%)}");
GM_addStyle(".comment-table .reply a {color: hsl(0, 0%, 38%) !important}");
GM_addStyle(".vote-for-comment img {opacity: 0.62 !important}");
GM_addStyle(".comment-table {border-color: hsl(0, 0%, 62%) !important}");
GM_addStyle(".problem-statement .sample-tests pre {background-color: hsl(0, 0%, 19%) !important; color: white !important}");
GM_addStyle(".input-output-copier {border-color: gray !important}");
GM_addStyle(".problem-statement .sample-tests .title .input-output-copier {color: white !important; border-color: gray !important; background-color: hsl(0, 0%, 19%) !important; border-radius: 6px !important}");
GM_addStyle(".problem-statement .sample-tests .title {color: black !important; border-color: gray !important; background-color: hsl(0, 0%, 69%) !important}");
GM_addStyle(".problem-statement .sample-tests .title .input-output-copier:hover {color: black !important; border-color: hsl(0, 0%, 62%) !important; background-color: white !important; border-radius: 6px !important}");
GM_addStyle(".problem-statement .sample-tests .input, .problem-statement .sample-tests .output {border-color: gray !important}");
GM_addStyle(".title {border-color: gray !important}");
GM_addStyle(".verdict-accepted {color: #006100 !important}");
GM_addStyle(".verdict-rejected {color: #0058B0 !important}");
GM_addStyle(".verdict-waiting {color: hsl(0, 0%, 38%) !important}");
GM_addStyle(".verdict-accepted-challange {color: #006100 !important}");
GM_addStyle(".verdict-successful-challenge {color: #006100 !important}");
GM_addStyle("span.verdict-unsuccessful-challenge {color: #0058B0 !important}");
GM_addStyle(".accepted-problem {color: hsl(0, 0%, 38%) !important}");
GM_addStyle(".datatable td {border-color: gray !important}");
GM_addStyle(".datatable td[background-color^='none'], .datatable th[background-color^='none'] {background: hsl(0, 0%, 62%) !important; background-color: hsl(0, 0%, 62%) !important}");
GM_addStyle(".datatable th {border-color: gray !important}");
GM_addStyle(".datatable td.state[style^='back'] .notice {color: hsl(0, 0%, 38%) !important}");
GM_addStyle(".contest-state-regular.countdown {color: hsl(0, 0%, 38%) !important}");
GM_addStyle(".roundbox .rtable td .contest-state-regular {color: hsl(0, 0%, 38%) !important}");
GM_addStyle("a:link.notice {color: hsl(0, 0%, 38%) !important}");
GM_addStyle(".problems tr.accepted-problem td.act {background-color: #3C9E3C !important}");
GM_addStyle(".problems tr.accepted-problem td.id {border-left-color: #3C9E3C !important}");
GM_addStyle(".problems tr.rejected-problem td.act {background-color: #CF4E4E !important}");
GM_addStyle(".problems tr.rejected-problem td.id {border-left-color: #CF4E4E !important}");
GM_addStyle(".datatable td.state[style^='background-color: rgb(221, 238, 255);'] {background-color: #CFE7FF !important}");
GM_addStyle(".datatable td.state[style^='background-color: rgb(212, 237, 201);'] {background-color: #3C9E3C !important}");
GM_addStyle(".setting-name {color: #0067CF !important}");
GM_addStyle(".ProblemRating {color: black !important}");
GM_addStyle(".standings .cell-accepted {color: #006100}");
GM_addStyle(".standings .cell-accepted-locked {color: #004F00 !important}");
GM_addStyle(".standings .cell-passed-system-test {color: #006100}");
GM_addStyle("span.cell-rejected {color: hsl(0, 0%, 38%) !important}");
GM_addStyle(".standings .cell-challenged {color: red !important}");
GM_addStyle(".cell-time {color: hsl(0, 0%, 38%) !important}");
GM_addStyle(".unsuccessfulChallengeCount {color: hsl(0, 0%, 38%) !important}");
GM_addStyle(".sidebar-menu ul li {border: none !important}");
GM_addStyle(".sidebar-menu ul li:hover {border: 1px solid gray !important; background-color: hsl(0, 0%, 62%) !important; color: black !important}");
GM_addStyle(".comment-table.highlight-blue, .comment-table.highlight, .standings tr.highlighted-row td, table tr.highlighted-row td, .highlight-blue, .lang-chooser div[style^='background-color: #EAF4FF;'] {background-color: #CFE7FF !important}");
GM_addStyle("select {background-color: hsl(0, 0%, 62%) !important; color: black !important}");
GM_addStyle("input {background-color: hsl(0, 0%, 62%) !important; color: black !important}");
GM_addStyle("textarea {background-color: hsl(0, 0%, 62%) !important; color: black !important}");
GM_addStyle(".topic div[style^='font-size: 1.1rem;line-height: 1.1rem;padding-bottom: 0.5em;'] img {filter: invert(0.69) !important}");
GM_addStyle("img[title^='Attach this blog to some contest as a resource'] {filter: invert(0.69) !important}");
GM_addStyle("img[title^='Прикрепить данный блог к какому-либо соревнованию'] {filter: invert(0.69) !important}");
GM_addStyle("div[style^='width:35em;margin-left:auto;'] {color: hsl(0, 0%, 38%) !important}");
GM_addStyle("#facebox .content, .talk-content div[id^='history-text-content'] {background: hsl(0, 0%, 62%) !important; background-color: hsl(0, 0%, 62%) !important}");
GM_addStyle("a:not([href]):not(.rated-user), a:link:not(.rated-user) {color: #0058B0}");
GM_addStyle("a:visited:not(.rated-user) {color: #3737B0 !important}");
GM_addStyle("div.ttypography {font-family: 'IBM Plex Sans', sans-serif !important}");
GM_addStyle("div.ttypography li {font-family: 'IBM Plex Sans', sans-serif !important}");
GM_addStyle("div.ttypography .bordertable tbody td {border: 1px solid gray !important}");
GM_addStyle("div.ttypography .bordertable tbody th {border: 1px solid gray !important}");
GM_addStyle("div.ttypography .bordertable tbody tr:hover td {background-color: hsl(0, 0%, 69%) !important}");
GM_addStyle("div.ttypography .bordertable tbody tr:hover th {background-color: hsl(0, 0%, 69%) !important}");
GM_addStyle(".datatable td[style^='background-color: rgb(212, 237, 201);'] {background-color: #B0FFB0 !important}");
GM_addStyle(".datatable td[style^='background-color: rgb(255, 227, 227);'] {background-color: #FFB0B0 !important}");
GM_addStyle(".left-meta span[style^='font-size:larger;position:relative;bottom:1px;font-weight:bold;color:gray'] {color: hsl(0, 0%, 38%) !important}");
GM_addStyle(".contestParticipantCountLinkMargin img {filter: invert(0) !important}");
GM_addStyle("li span[style^='color:#006100;font-weight:bold;'] {color: #006100 !important}");
GM_addStyle("span[style^='color:gray;font-weight:bold;'] {color: hsl(0, 0%, 38%) !important}");
GM_addStyle("span[style^='color:green;font-weight:bold;'] {color: #006100 !important}");
GM_addStyle("a:visited[style^='text-decoration: none;font-size: 18.0px;background-color: rgb(1,87,155);color: white;font-weight: bold;padding: 0.5em 1.0em;'] {color: white !important}");
GM_addStyle("a:link.red-link, a:link.red-link:visited, .red-link, a.red-link:visited {background-color: hsl(0, 0%, 19%) !important; color: yellow !important}");
GM_addStyle(".rated-user.user-black {font-family: 'IBM Plex Sans', sans-serif !important; font-weight: 400 !important}");
GM_addStyle(".rated-user {font-family: 'IBM Plex Sans', sans-serif !important; font-weight: 700 !important}");
GM_addStyle("tr.user-orange td, span.user-orange, a.user-orange {color: #CF5300 !important}");
GM_addStyle("tr.user-violet td, span.user-violet, a.user-violet {color: darkviolet !important}");
GM_addStyle("tr.user-cyan td, span.user-cyan, a.user-cyan {color: #006161 !important}");
GM_addStyle("tr.user-gray td, span.user-gray, a.user-gray {color: hsl(0, 0%, 38%) !important}");
GM_addStyle("tr.user-green td, span.user-green, a.user-green {color: #006100 !important}");
GM_addStyle("tr.user-blue td, span.user-blue, a.user-blue {color: #00009E !important}");
GM_addStyle("tr.user-red td, span.user-red, a.user-red {color: #CF2727 !important}");
GM_addStyle("tr.user-legendary td, span.user-legendary, a.user-legendary {color: #CF2727 !important}");
GM_addStyle(".sidebar-menu ul li.active {background-color: gray !important; border: 1px solid hsl(0, 0%, 38%) !important}");
GM_addStyle(".highlight-blue.roundbox {background-color: #FFFFCF !important}");
GM_addStyle("div[style^='font-size:2em;color:#3B5998;float:right;'] {color: #0067CF !important}");
GM_addStyle("div .topic .title a, div .topic .title a:hover {color: #0067CF !important}");
GM_addStyle("div .topic .title a:visited {color: #3737B0 !important}");
GM_addStyle("div[style^='text-align:right;color:#888;font-size:1.1rem;margin-bottom:0.25em;'] {color: hsl(0, 0%, 38%) !important}");
GM_addStyle("span[style^='color: darkorange; font-weight: bold;'] {color: olive !important}");
GM_addStyle(".contest-name {color: black !important}");
GM_addStyle(".contest-name a {font-size: 1em !important; color: black !important; font-family: 'IBM Plex Sans', sans-serif !important}");
GM_addStyle(".contest-name a:visited {font-size: 1em !important; color: black !important; font-family: 'IBM Plex Sans', sans-serif !important}");
GM_addStyle("._StreamsSidebarFrame_countdown._StreamsSidebarFrame_timeMark {color: hsl(0, 0%, 38%) !important}");
GM_addStyle("._StreamsSidebarFrame_active._StreamsSidebarFrame_timeMark {color: hsl(0, 0%, 38%) !important}");
GM_addStyle("._StreamsSidebarFrame_stream {border-bottom: 1px solid gray !important}");
GM_addStyle("ins[style^='background:#3C9E3C;overflow-wrap:break-word;'] {background: #B0FFB0 !important}");
GM_addStyle("del[style^='background:#CF4E4E;overflow-wrap:break-word;'] {background: #FFB0B0 !important}");
GM_addStyle("input[class^='submit'] {background: hsl(0, 0%, 38%) !important; border: none !important; border-radius: 6px !important; color: white !important}");
GM_addStyle("input[class^='submit']:hover {background: hsl(0, 0%, 19%) !important; border: 2px solid hsl(0, 0%, 38%) !important; border-radius: 6px !important; color: white !important}");
GM_addStyle(".header-bell__img {filter: brightness(0.62)}");
GM_addStyle(".fieldset, img[alt='Codeforces'] {filter: brightness(0.62)}");
GM_addStyle("img[alt='Necropost'] {filter: brightness(0.69)}");
GM_addStyle("img[alt='Некропост'] {filter: brightness(0.69)}");
GM_addStyle("img[src='//assets.codeforces.com/images/hsu.png'] {filter: brightness(0.62)}");
GM_addStyle("img[src='//assets.codeforces.com/images/technocup-logo.png'] {filter: brightness(0.62)}");
GM_addStyle(".header-bell .bell-details__no-new {color: hsl(0, 0%, 38%) !important}");
GM_addStyle("div.spoiler-content {background-color: lightgoldenrodyellow !important}");
GM_addStyle("._MashupContestEditFrame_frame p {color: hsl(0, 0%, 38%) !important}");
GM_addStyle("._MashupContestEditFrame_frame div._MashupContestEditFrame_title {color: #0067CF !important}");
GM_addStyle("._UserActivityFrame_frame .userActivityRoundBox ._UserActivityFrame_header {color: hsl(0, 0%, 38%) !important}");
GM_addStyle("._UserActivityFrame_frame .userActivityRoundBox ._UserActivityFrame_footer ._UserActivityFrame_counterDescription {color: hsl(0, 0%, 38%) !important}");
GM_addStyle("._UserActivityFrame_frame .userActivityRoundBox #userActivityGraph svg text {fill: hsl(0, 0%, 38%) !important}");
GM_addStyle("._UserActivityFrame_caption {color: hsl(0, 0%, 38%) !important}");
GM_addStyle("input {background-color: hsl(0, 0%, 19%) !important; color: hsl(0, 0%, 62%) !important; border: 2px solid hsl(0, 0%, 38%) !important; border-radius: 5px !important}");
GM_addStyle("select {background-color: hsl(0, 0%, 19%) !important; color: hsl(0, 0%, 62%) !important; border: 2px solid hsl(0, 0%, 38%) !important; border-radius: 5px !important}");
GM_addStyle("img.delete-resource-link {filter: invert(0.19)}");
GM_addStyle("#vote-list-filterDifficultyLowerBorder {filter: brightness(0.69)");
GM_addStyle("#vote-list-filterDifficultyUpperBorder {filter: brightness(0.69)");
GM_addStyle("div[style='margin-top: 0.85em;padding-top:0.85em;border-top: 1px solid rgb(185, 185, 185);position: relative;'] {border-top: 1px solid gray !important}");
GM_addStyle("div[style='text-align:center;border-bottom: 1px solid rgb(185, 185, 185);margin:0 -0.5em 0.5em -0.5em;padding: 0 1em 0.5em 1em;'] {border-bottom: 1px solid gray !important}");
GM_addStyle("span.small {color: hsl(0, 0%, 38%) !important}");
GM_addStyle("header nav {background-color: hsl(0, 0%, 69%) !important; color: #303030 !important; border: 1px solid gray !important}");
GM_addStyle("._IndexPage_notice {background-color: hsl(60, 100%, 84%) !important}");
GM_addStyle(".datatable .caption {background-color: hsl(0, 0%, 69%) !important}");
GM_addStyle(".datatable._IndexPage_contests tbody tr:nth-child(2n-1) {background-color: hsl(0, 0%, 62%) !important}");
GM_addStyle(".datatable._ProblemsPage_problems tbody tr:nth-child(2n-1) {background-color: hsl(0, 0%, 62%) !important}");
GM_addStyle(".datatable._SubmissionsPage_submissions tbody tr:nth-child(2n-1) {background-color: hsl(0, 0%, 62%) !important");
GM_addStyle(".form-box {border: 1px solid gray !important; background-color: hsl(0, 0%, 69%) !important}");
GM_addStyle(".form-box .header {border-bottom: 1px solid gray !important; color: hsl(0, 0%, 38%) !important}");
GM_addStyle("footer {border-top: 1px solid hsl(0, 0%, 69%) !important}");
GM_addStyle("#footer {border-top: 1px solid hsl(0, 0%, 69%) !important}");
GM_addStyle(".comments .comment .comment-table .right .info {color: #4F4F4F !important}");
GM_addStyle(".comments .comment .comment-table .right .info a[class^='comment-'] {color: #4F4F4F !important}");
GM_addStyle(".comments .comment .comment-table .right .info a[name^='comment-'] {color: #4F4F4F !important}");
GM_addStyle(".comments .comment .comment-table .right .info a.leftRevision {color: #4F4F4F !important}");
GM_addStyle(".comment-table .info {color: #4F4F4F !important}");
GM_addStyle(".comments .comment .comment-table .right .info .editCommentLink {color: #4F4F4F !important}");
GM_addStyle(".comments .comment .comment-table .right .info .deleteCommentLink {color: #4F4F4F !important}");
GM_addStyle(".comments .comment .comment-table .right .info a[href^='#comment-'] {color: #4F4F4F !important}");
GM_addStyle(".cell-failed-system-test {color: #B00000 !important}");
GM_addStyle(".verdict-challenged {color: #B00000 !important}");
GM_addStyle("div[style='margin:1em 0; color: #777;'] {color: hsl(0, 0%, 38%) !important}");
GM_addStyle("div[style='margin-top: 1em; text-align: left; font-size: 1.2rem;'] {background-color: #FFFFCF !important;}");
GM_addStyle("a.close {filter: invert(0.38) !important}");
GM_addStyle("span#program-source-text-copy {color: #0058B0 !important}");
GM_addStyle(".error {color: #CF0000 !important}");
GM_addStyle("span[style='color:red;'] {color: #CF0000 !important}");
GM_addStyle("hr {color: hsl(0, 0%, 38%) !important; border-style: dashed !important;}");
GM_addStyle(".group-form .input-description {color: hsl(0, 0%, 38%) !important}");
GM_addStyle("code.tt {color: #00284F !important; background-color: #CFE7FF !important; border-color: #B0D7FF !important}");
GM_addStyle("._name small {color: hsl(0, 0%, 38%) !important}");
GM_addStyle("._name {color: #0058B0 !important}");
GM_addStyle("._name i[class^='icon-'] {color: hsl(0, 0%, 38%) !important}");
GM_addStyle(".caption {color: #0058B0 !important}");
GM_addStyle(".problem-statement .section-title {font-family: 'IBM Plex Sans', sans-serif !important");

//code editor
GM_addStyle("li[class^='L'] span.com {color: #777777 !important; font-style: italic !important}");
GM_addStyle("li[class^='L'] span.str {color: #a55f03 !important}");
GM_addStyle("li[class^='L'] span.kwd {color: #0000FF !important; font-style: italic !important}");
GM_addStyle("li[class^='L'] span.pun {color: black !important}");
GM_addStyle("li[class^='L'] span.typ {color: #3333fc !important}");
GM_addStyle("li[class^='L'] span.lit {color: #0066ff !important;}");
GM_addStyle("pre[style='background-color: #eff0f1;'] {background-color: #CFCFCF !important}");
GM_addStyle(".roundbox pre {background-color: #CFCFCF !important}");

//text editor
GM_addStyle("div.wysiwyg {background: hsl(0, 0%, 69%) !important");
GM_addStyle("div.wysiwyg ul.toolbar {border-bottom: 1px solid hsl(0, 0%, 69%) !important}");
GM_addStyle("div.wysiwyg ul.toolbar li {border: none !important; filter: brightness(0.62)}");
GM_addStyle("div.wysiwyg iframe {border: 1px solid hsl(0, 0%, 38%) !important; box-shadow: inset 0 0 10px rgb(0 0 0 / 38%) !important; background-color: hsl(0, 0%, 81%) !important}");
GM_addStyle("img[alt='Logo'] {filter: brightness(0.62) !important}");

//scroll bar
GM_addStyle("::-webkit-scrollbar {background-color: hsl(0, 0%, 19%) !important;}");
GM_addStyle("::-webkit-scrollbar-thumb {background-color: hsl(0, 0%, 69%) !important; border-radius: 10px !important;}");
GM_addStyle("::-webkit-scrollbar-thumb:hover {background-color: hsl(0, 0%, 81%) !important}");
GM_addStyle(".problem-statement .test-example-line-even {background-color: #e0e0e0; color: #222;}");
GM_addStyle(".problem-statement .test-example-line-odd:hover {background-color: #e0e0e0; color: #222;}");