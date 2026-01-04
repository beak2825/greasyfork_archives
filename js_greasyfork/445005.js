// ==UserScript==
// @name         Discord SEQTA
// @namespace    http://doctormod.sytes.net/
// @version      1.2.0
// @description  Seqta for gamers
// @author       DoctorMod
// @match        https://learn.corpus.wa.edu.au/*
// @match        https://coneqt-s.carmel.wa.edu.au/*
// @match        https://coneqt-s.scotch.wa.edu.au/*
// @match        https://student.goodshepherd.nt.edu.au/*
// @match        https://learn.plc.wa.edu.au/*
// @match        https://coneqt.carey.wa.edu.au/*
// @match        https://student.nazareth.catholic.edu.au/*
// @match        https://learn.lawley.wa.edu.au/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445005/Discord%20SEQTA.user.js
// @updateURL https://update.greasyfork.org/scripts/445005/Discord%20SEQTA.meta.js
// ==/UserScript==

var style = document.createElement('style');
                style.innerHTML = `
#userActions > .feedbackButton {
background-image:url('https://api.iconify.design/simple-icons:discord.svg?height=24&color=%23ffffff');
background-size: 20px;
background-repeat: no-repeat;
background-position: center;
}
#userActions > .feedbackButton > svg {display:none;}
`;
                document.getElementsByTagName("head")[0].appendChild(style);

var css = `
.defaultWelcomeWrapper, .LegacyModuleBody__LegacyModule___20YE2, #main, .notifications__items___2hCdv, #main > .dashboard, #toolbar, ul.singleSelect, ul.buttonChecklist, ul.buttonMenu, ul.colourButtonOptions, ul.uiSplitButtonList, .contactFormPanel, #main > .reports, .Thermoscore__Thermoscore___2tWMi, .TabSet__TabSet___Vo-SZ > .TabSet__tabContainer___3iIRe, .OverallResult__overall___3IikW, .uiSlidePane > .pane{
background-color:#2C2F33;
border: none;
color: #fff !important;
}
#main .course * {
color: white !important;
}
.dashlet-summary-homework > .summary > .subject > .item > .todo {
color: #5865F2 !important;
}
* {
font-family: 'roboto',sans-serif;
}
.notifications__list___rp2L2, .legacy-root button:not([disabled]):focus {
border-color: #5865F2 !important;
}
.defaultWelcome > header {
background-color: #5865F2 !important;
background-image: none !important;
}
.defaultWelcome > section, .defaultWelcome, #main > .reports > .item > .report > .term{
background-color: #23272A !important;
color: #fff;
}
.defaultWelcome > section.dashboard, .legacy-root a, button, textarea, input, textarea::placeholder, input::placeholder, option, #main > .goals > .student > .items > table, .BasicPanel__BasicPanel___1GP6s > ol > li, .SelectedAssessment__due___gaPre{
background-color: #202225 !important;
color: #fff !important;
}
#title, .notifications__notifications___3mmLY > button, .formattedText > .footer, .notifications__actions___1UX7r, .dashlet-notes > ul, .Collapsible__Collapsible___3O8P3.Collapsible__collapsed___xneJv, .Collapsible__Collapsible___3O8P3 > .Collapsible__header___-Afvq{
background-color: #36393f !important;
}
#menu, #menu li > .sub, #menu .nav > .back, .programmeNavigator, .uiSlidePane > .pane.tall > .content, .anyoneSelect.filterBox {
background-color: #36393f !important;
color: #8e9297 !important;
border: none;
}
.selected, #menu li.active, .AssessmentList__AssessmentList___1GdCl > .AssessmentList__searchFilter___3N70o input::placeholder, .AssessmentList__AssessmentList___1GdCl > .AssessmentList__searchFilter___3N70o input, .search, .search::placeholder{
background-color: rgba(79,84,92,0.32) !important;
color: #fff !important;
}
#userActions > .feedbackButton > svg {display:none;}
.notifications__notifications___3mmLY > button > svg path {
d: path('M18 9V14C18 15.657 19.344 17 21 17V18H3V17C4.656 17 6 15.657 6 14V9C6 5.686 8.686 3 12 3C15.314 3 18 5.686 18 9ZM11.9999 21C10.5239 21 9.24793 20.19 8.55493 19H15.4449C14.7519 20.19 13.4759 21 11.9999 21Z') !important;
}
.student #menu > ul::before {
background-image: url("https://i.ibb.co/2gHvLm7/a9720d295f2a8925d6e5bbcb0c80d9a4.png");
}
#toolbar button.toggled, #toolbar button.depressed, .legacy-root button.depressed, .legacy-root button.toggled {
background-color: #5865F2 !important;
}
#main > .dashboard > .dashlet > .header > .title {
color: #fff !important;
}
.formattedText > .wrapper > .cke > .cke_inner > .cke_contents > iframe, .dashlet-notes > ul > li, .Rubric__Rubric___2AAKS > .Rubric__line___JCC3Y > .Rubric__descriptor___2zo2S, #main > .dashboard > .dashlet, .Rubric__Rubric___2AAKS > .Rubric__line___JCC3Y > .Rubric__meta___3il5f, .BasicPanel__BasicPanel___1GP6s > ol, .legacy-root .uiFileHandler, .legacy-root .uiFileHandler>.note {
background-color: #36393f !important;
color: #fff !important;
}
.dashlet-summary-homework > .summary .title, #main > .documents > .list > tbody td {
color: #ddd !important;
}
.dashlet-summary-homework > .summary .item {
color: #fff !important;
}
#main > .documents > .list > tbody > tr:hover {
background-color: #36393f !important;
}
.cke_toolbox, .tabset .item.selected {
color: white !important;
background-color: #36393f !important;
border-bottom: 1px solid var(--theme-offset-bg);
}
#main > .documents > .list > tbody td, .cke_contents, #main > .documents > .list > thead > tr > th, .dashlet-summary-pastoral > .summary > table.header > thead > tr > td, .dashlet-summary-pastoral > .summary > table.footer > tfoot > tr > td, #menu .nav {
border: none !important;
}
#main > .notices > .notice, #main>.notices>.notice>.contents, #main>.notices>.notice>.contents>iframe {
background:none !important;
}
`;

var interval;

(function() {
    'use strict';
    interval = setInterval(checkFrames,300);
    setCSS();
    setTimeout(runAfterLoad,100);
    setTimeout(function(){document.getElementsByClassName("code")[0].innerHTML = '<a href="https://gist.github.com/DoctorMod/" style="background: none;border: 0;padding: 0;">SEE MORE FROM DOCTORMOD</a>'},300); //SEE MORE button
})();

function runAfterLoad() {
    try {
        document.querySelector(".connectedNotificationsWrapper>div>button").onclick = function() {setTimeout(updateMSG,100)};
        document.querySelector('#userActions > .feedbackButton').addEventListener("click", function() {
            if (document.getElementById("customCSS") == null) {
                setCSS();
                interval = setInterval(checkFrames,300);
            } else {
                document.getElementById("customCSS").remove();
                clearInterval(interval);
            }
            audio.disable();
            document.querySelector('.uiSlidePane > .pane > .header > .beta > .uiButton').click()
            setTimeout(function() {audio.enable()},100);
        });
    } catch (e) {
        setTimeout(runAfterLoad,100);
    }
}

function setCSS() {
    var style = document.createElement('style');
    style.id = "customCSS";
    style.innerHTML = css;
    document.getElementsByTagName("head")[0].appendChild(style);
}

function checkFrames() {
    for (var i = 0; i < document.getElementsByTagName("iframe").length; i++) {
        var iframe = document.createElement('style');

        iframe.innerHTML = `
* {color: #fff !important;}
p {background-color: #00000000 !important;}
html {background-color: #2C2F33;}
a:not(.resource) {color: #7289DA !important;}
`;
        try {
        document.getElementsByTagName("iframe")[i].contentDocument.body.firstChild.className = "";
        } catch(e) {}
        document.getElementsByTagName("iframe")[i].contentDocument.head.appendChild(iframe);
    };
}