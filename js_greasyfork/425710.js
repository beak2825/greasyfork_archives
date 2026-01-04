/*jshint esversion: 8, multistr: true */
/* globals waitForKeyElements, OLCore, OLSettings, unsafeWindow, OLi18n, olAnchorNavigation */

// ==UserScript==
// @name           OnlineligaBaseHelper
// @namespace      https://greasyfork.org/de/users/577453
// @version        0.4.3
// @license        LGPLv3
// @description    Allgemeine Zusatzfunktionen für www.onlineliga.de (OFA)
// @author         Tai Kahar/ KnutEdelbert
// @match          https://www.onlineliga.de
// @require        https://greasyfork.org/scripts/424896-olcore/code/OLCore.user.js
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/425710/OnlineligaBaseHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/425710/OnlineligaBaseHelper.meta.js
// ==/UserScript==

/*********************************************
 * 0.1.0 29.04.2021 Release
 * 0.1.1 02.05.2021 Bugfix: Geburtstag wurde nicht angezeigt
 * 0.1.2 12.05.2021 display youtube inline
 * 0.1.3 13.05.2021 Number of teams
 * 0.1.4  19.05.2021 highlight Matchdaytable special ranks
 * 0.1.5 19.05.2021 highlight Matchdaytable special ranks for every league Level
 * 0.1.6 14.07.2021 fix finance display on top bar for ch/at
 * 0.1.7 12.11.2021 + darkmode
 * 0.1.8 13.01.2022 podcast support
 * 0.2.0 24.01.2022 i18n support
 * 0.2.1 03.02.2022 Bugfix table color
 * 0.2.2 25.06.2022 show assists in player view
 * 0.2.3 02.07.2022 adjustments for table highlight
 * 0.2.4 01.08.2022 Middle Click for subnav items
 * 0.2.5 29.10.2022 Middle Click for mainnav items
 * 0.2.6 17.01.2023 fix for middle click
 * 0.3.0 16.08.2023 + quicklinks
                    + link to lineup after Training
 * 0.3.1 04.09.2023 + Quicklink Spieltag
 * 0.4.0 20.11.2024 OL 2.0
 * 0.4.1 23.11.2024 adjust mobile settings button
 * 0.4.2 26.11.2024 OL 2.0 finance data/league table highlight
 * 0.4.3 28.12.2024 Show Season/Week on top
 *                  OL 2.0 Fix: Subnav Item Middelclick
 *                  adjust Quicklinks Layout
 *********************************************/
(function() {
    'use strict';
    const $ = unsafeWindow.jQuery;
    const t = OLi18n.text;
    const tt = OLi18n.tbtext;

    let budgetLoaded = false;

    function budgetOverview()
    {
        if(!budgetLoaded){
            $.get("/office/finance",function(data){
                const financeData = $(data).find(".finance-account-overview-box .row div div:nth-child(1)");
                const bankBalance = OLCore.num2Cur(OLCore.round(OLCore.getNum(financeData.eq(0).text())));
                const dispo = OLCore.num2Cur(OLCore.getNum(financeData.eq(1).text()));
                const allBalance = OLCore.num2Cur(OLCore.getNum($(".ol-nav-liquid-funds.liquidFunds").text()));

                const liquidFundsElement = $(".ol-nav-liquid-funds").first();
                liquidFundsElement.parent().css("text-align", "right");
                $(".ol-navigation-mobile-balance").css("height","100%");
                $(".ol-navigation-mobile-balance").css("justify-content","center");
                $("#navLeagueInfo > .ol-player-budget").css("margin-top","0px");
                $("#navLeagueInfo > .ol-player-budget").css("padding-top","8px");
                if(liquidFundsElement.text() != "XXX.XXX"){
                    //$(".ol-navigation-mobile-balance .ol-nav-liquid-funds").parent().prepend(`<div style='font-size: 9pt;color:grey;'><span class="fa fa-credit-card" style="color:#955" /> ${dispo}</div>`);
                    //$(".ol-navigation-mobile-balance .ol-nav-liquid-funds").parent().prepend(`<div style='font-size: 9pt;color:grey;'><span class="fa fa-money" style="color:#595"/> ${bankBalance}`);
                    $(".ol-nav-liquid-funds").eq(0).parent().prepend(`<div style='font-size: 10pt;color:grey;'><span class="fa fa-credit-card" style="color:#955" /> ${dispo}</div>`);
                }

                OLCore.addStyle(`
                    .ol-nav-funds-wrapper > .ol-navigation-player-budget {
                        text-align: right;
                        font-family: system-ui;
                    }
                `)
            });
            budgetLoaded = true;
        }
    }

    function correctBirthDate()
    {
        $(".playeroverviewtablestriped div:nth-child(5) div:nth-child(2) div:nth-child(2)").first().css("display","none");
        var oldBirthdate = parseInt(OLCore.convertNumber($(".playeroverviewtablestriped div:nth-child(5) div:nth-child(2) div:nth-child(2)").first().text()),10);

        $(".playeroverviewtablestriped div:nth-child(5) div:nth-child(2) div:nth-child(2)").first().html(`${tt("Woche")} ${(oldBirthdate - 1 || 44)} ${tt("vorher")}: ${oldBirthdate}`)
        $(".playeroverviewtablestriped div:nth-child(5) div:nth-child(2) div:nth-child(2)").first().css("display","block");
    }

    function teamInfoLinks(){
        $('.infotext p:contains("youtube")').detach().prependTo('.infotext');
        $('.infotext p:contains("youtube")').html(function(i, html) {
            return html.replace(/(?:https:\/\/|http:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g,'<iframe width="100%" height="400px" src="https://www.youtube.com/embed/$1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');
        });
        const juju = $('.infotext p:contains("https://anchor.fm/verruecktewelt")');
        if (juju.length){
            juju.html(juju.html().replace('https://anchor.fm/verruecktewelt','https://anchor.fm/verruecktewelt <br/><iframe src="https://open.spotify.com/embed/show/2wVuyvJ5hcKcaNRc2o299b?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>'));
        }
    }

    function teamNumber(){

        if($('div.menu-button-wrapper button:nth-child(2).active').length)
        {
            const sumTeams = sumNumbers($('.ol-statistics-ranking-teams').not('.hidden-lg '));
            const sumPoints = sumNumbers($('.col-lg-5.ol-statistics-ranking-points').not('.hidden-lg '));

            $('#ol-ranking-content').prepend('<div class="sumPointsTeams"/>');
            $('.sumPointsTeams').html(`${tt("Anzahl Teams")}: ${OLCore.numVal(sumTeams)} <br /> ${tt("Summe Punkte")}: ${OLCore.numVal(OLCore.round(sumPoints,2))}`);
        }

        function sumNumbers(items)
        {
            var sum = 0;
            items.each(function() {
                var points = OLCore.getNum($(this).html());
                if(points)
                {
                    sum += points;
                }
            });
            return sum;
        }

    }

    function highlightMatchdayTable(){

        $("style#ToolboxMatchdayTableHighlight").remove();

        if ($('button.ol-tab-button:first-child.active').length){
            const leagueLevel = parseInt($("div#dropdown-matchday-table-league-level-matchdayTable").attr("data-value"), 10);

            const secondCSS = [];
            secondCSS[0] = "";
            secondCSS[1] = "table.table > tbody > tr#ol-td:nth-child(2) {background-color:rgba(189, 237, 131, 0.1);  border-bottom: 1px solid black;}";
            secondCSS[2] = secondCSS[1];
            secondCSS[3] = secondCSS[1];
            //secondCSS[3] = "";
            secondCSS[4] = "table.table > tbody > tr#ol-td:nth-child(2), table.table > tbody > tr#ol-td:nth-child(3) {background-color:rgba(189, 237, 131, 0.1);}" +
                "\r\ntable.table > tbody > tr#ol-td:nth-child(3) { border-bottom: 1px solid black;}";
            secondCSS[5] = secondCSS[4];

            const disclaimer = [];
            disclaimer[0] = tt("Die erste Linie markiert den Meister und die zweite Linie die Abstiegsplätze.");
            disclaimer[1] = tt("Die erste Linie markiert den Meister, die zweite Linie einen weiteren <b>eventuellen</b> Aufstiegsplatz und die dritte Linie die Abstiegsplätze.<br/>Die tatsächliche Anzahl der Aufstiegssplätze kann abweichen.");
            disclaimer[2] = tt("Die erste Linie markiert den Meister, die zweite Linie einen weiteren <b>eventuellen</b> Aufstiegsplatz und die dritte Linie die Abstiegsplätze.<br/>Die tatsächliche Anzahl der Aufstiegssplätze kann abweichen.");
            //disclaimer[2] = tt("Die erste Linie markiert den Meister, die zweite Linie einen weiteren <b>eventuellen</b> Aufstiegsplatz und die dritte Linie die Abstiegsplätze.<br/>Die tatsächliche Anzahl der Aufstiegssplätze kann abweichen.");
            disclaimer[3] = tt("Die erste Linie markiert den Meister, die zweite Linie einen weiteren <b>eventuellen</b> Aufstiegsplatz und die dritte Linie die Abstiegsplätze.<br/>Die tatsächliche Anzahl der Aufstiegssplätze kann abweichen.");
            //disclaimer[3] = tt("Die erste Linie markiert den Meister und die zweite Linie die Abstiegsplätze.");
            disclaimer[4] = tt("Die erste Linie markiert den Meister, die zweite Linie weitere <b>eventuelle</b> Aufstiegs-/Qualifikationsplätze und die dritte Linie die Abstiegsplätze.<br/>Die tatsächliche Anzahl der Aufstiegs-/Qualifikationsplätze kann abweichen.");
            disclaimer[5] = tt("Die erste Linie markiert den Meister und die zweite Linie weitere <b>eventuelle</b> Aufstiegs-/Qualifikationsplätze.<br/>Die tatsächliche Anzahl der Aufstiegs-/Qualifikationsplätze kann abweichen.");

            const lastCSS = leagueLevel === 6 ? "" : `table.table > tbody > tr#ol-td:nth-child(15) {border-top: 1px solid black}
  table.table > tbody > tr#ol-td:nth-child(15),
  table.table > tbody > tr#ol-td:nth-child(16),
  table.table > tbody > tr#ol-td:nth-child(17),
  table.table > tbody > tr#ol-td:nth-child(18) {background-color:rgba(255, 0, 0, 0.1);}`;

            OLCore.addStyle(`
  table.table > tbody > tr#ol-td:first-child {background-color:rgba(46, 171, 0, 0.1); border-bottom: 1px solid black;}
  ${secondCSS[leagueLevel-1]}
  ${lastCSS}`, "ToolboxMatchdayTableHighlight");

            $("div#leagueNavWrapper-matchdayTable").next().children("div#ol-table-content").children().eq(0).children().eq(2).before(`<div>${disclaimer[leagueLevel-1]}</div>`);
        }
    }

    let defaultFilter;
    let invertFilter;
    function addDarkMode(){
        function toggleDarkMode(isOn){
            if(isOn){
                /*,
                .ol-state-bg-color-${OLCore.Base.teamColorNumber}
                 */
                OLCore.addStyle(`
                body {background-color: black}
                .ol-banner-background,
                #ol-root,
                img,
                div.states-bar-info > span.states-bar-state-badge,
                .ol-news-trans-bg,
                .ol-training-weektable-block,
                .training-intensity-block,
                .ol-value-bar-small,
                .ol-training-playerdetails-times,
                #overlayWindow,
                .country-flag,
                .transfer-player-status-column,
                .ol-time-counter.time-counter-unit-minutes,
                .transfer-scarce-time > div,
                .ol-state-primary-color-${OLCore.Base.teamColorNumber},
                .ol-state-primary-border-color-${OLCore.Base.teamColorNumber}
                {filter: invert(1)}
                `,"Toolbox_DarkMode");
                const tmpFilter = $("div.ol-scroll-overlay-content.states-bar-choose > span.states-bar-state-badge").css("filter");
                if (tmpFilter && tmpFilter.length && !tmpFilter.includes("invert")){
                    $("div.ol-scroll-overlay-content.states-bar-choose > span.states-bar-state-badge").css("filter", invertFilter);
                }
            } else {
                $("#Toolbox_DarkMode").remove();
                $("div.ol-scroll-overlay-content.states-bar-choose > span.states-bar-state-badge").css("filter", defaultFilter);
            }

            function setFilter(el){
                defaultFilter = defaultFilter || $("div.ol-scroll-overlay-content.states-bar-choose > span.states-bar-state-badge").css("filter");
                invertFilter = invertFilter || defaultFilter + " invert(1)";
                if (isOn){
                    const tmpFilter = $(el).css("filter");
                    if (tmpFilter && tmpFilter.length && !tmpFilter.includes("invert")){
                        $(el).css("filter", invertFilter);
                    }
                } else {
                    $(el).css("filter", defaultFilter);
                }
            }

            OLCore.waitForKeyElements(
                "div.ol-scroll-overlay-content.states-bar-choose > span.states-bar-state-badge",
                setFilter
            );

            function setNeutralTrainingColor(el){
                if ($(el).css("color") === 'rgb(0, 0, 0)'){
                    $(el).css("color","rgb(128, 128, 128)");
                }
            }

            OLCore.waitForKeyElements(
                "div.ol-training-playerdetails-block > span", setNeutralTrainingColor
            );

        }
        /*
        OLSettings.add({name: "Darkmode (experimentell)", short: "DarkMode", descr: "Darkmode", default: false, type: "toggle", settingsId: 'main', callback: toggleDarkMode});
        if (OLSettings.get("DarkMode")) {

            function setFilter(){
            }

            toggleDarkMode(true);

        }
        */
    }

    async function showExtPlayerInfo(ov, opt){
        opt = opt || {};
        opt.targetDiv = opt.targetDiv || "div.player-goals";
        const playerId = OLCore.getNum($(ov).find("button[onclick*='/player/overview']").attr("onclick"));
        const userId = $(ov).find("span.ol-team-name[onclick]").length ? OLCore.getNum($(ov).find("span.ol-team-name[onclick]").attr("onclick")) : OLCore.Base.userId;
        const playerInfo = await OLCore.Api.getPerformanceData(playerId, OLCore.Base.season, userId);
        const assists = playerInfo.filter(p => p.type === "L").map(i => i.assists).reduce((pv, cv) => pv + cv, 0);
        $(ov).find(`${opt.targetDiv} > div:first-child`).text($(ov).find(`${opt.targetDiv} > div:first-child`).text() + ' / ' + assists);
        $(ov).find(`${opt.targetDiv} > div:last-child`).text($(ov).find(`${opt.targetDiv} > div:last-child`).text() + `/${t("Vorl.")}`);
    }

    function subnavMiddleClick(el){
        OLCore.UI.preventMiddleClick(el);
        const onClick = $(el).attr("onclick");
        if (!onClick){
            return;
        }
        const urlMatch = onClick.match(/\.load\(['"]([^'"]+)['"]/);
        if (!urlMatch || !urlMatch.length){
            return;
        }
        let url = urlMatch[1];
        if ($(el).attr("id") === "nav_sub_friendlies_results"){
            url = '/#url=friendlies/results';
        }
        function openLinkInNewWindow(e){
            if (e.which !== 2) return;
            window.open(url,"_blank");
        }
        $(el).on('mouseup', openLinkInNewWindow);
    }

    function navMiddleClick(div){
        const a = $(div).find("a[onclick]");
        if (a.length === 0){
            return;
        }
        const el = a[0];
        let url = '';
        if (a.hasClass("nav_matchday_table")){
            url = '/matchdaytable/matchdaytable';
        } else if (a.hasClass("nav_map")){
            url = '/#url=map/inline';
        } else if (a.hasClass("nav_news")){
            url = '/news';
        } else if (a.hasClass("nav_statistics")){
            url = '/statistics/ranking';
        } else if (a.hasClass("nav_overview")){
            url = '/dashboard';
        } else if (a.hasClass("nav_team")){
            url = '/team/squad';
        } else if (a.hasClass("nav_friendlies")){
            url = '/friendlies/offers';
        } else if (a.hasClass("nav_transfer_market")){
            url = '/transferlist/gettransferlistview';
        } else if (a.hasClass("nav_stadium")){
            url = '/mystadium';
        } else if (a.hasClass("nav_office")){
            url = '/office/finance';
        }
        OLCore.UI.preventMiddleClick(el);
        function openLinkInNewWindow(e){
            if (e.which !== 2) return;
            window.open(url,"_blank");
        }
        $(el).on('mouseup', openLinkInNewWindow);
    }

    const QuickLinkDefaults = ["TRAINING", "LINEUP", "TEAMSETTINGS", "STADIUM"];

    const QuickLinkConfig = [
        {short: 'TRAINING', name: tt('Training'), icon: 'bullhorn', url: '/team/training'},
        {short: 'LINEUP', name: tt('Aufstellung'), icon: 'users', url: '/team/lineup'},
        {short: 'TEAMSETTINGS', name: tt('Mannschaftseinstellungen'), icon: 'cog', url: '/team/tactic'},
        {short: 'STADIUM', name: tt('Stadion Einstellungen'), icon: 'fort-awesome', url: '/stadium/settings'},
        {short: 'FRIENDLY', name: tt('Friendly Angebote'), icon: 'handshake-o', url: '/friendlies/requests'},
        {short: 'WATCHLIST', name: tt('Beobachtungsliste'), icon: 'eye', url: '/transferlist/getwatchlist'},
        {short: 'OFFERS', name: tt('Angebote'), icon: 'tag', url: '/transferlist/getoffersoverview'},
        {short: 'OFFERSENDED', name: tt('Beendete Angebote'), icon: ['tag',{fa:'ban',classes: ['2x']}], url: '/transferlist/getoffersoverview?subPage=/transferlist/getoffersendedoverview'},
        {short: 'BIDS', name: tt('Gebote'), icon: 'gavel', url: '/transferlist/getbidsoverview'},
        {short: 'CONTRACTS', name: tt('Verträge'), icon: 'pencil-square-o', url: '/office/contracts'},
        {short: 'ACADEMY', name: tt('Nachwuchs'), icon: 'child', url: '/office/youthplayer'},
        {short: 'SPONSORING', name: tt('Sponsoring'), icon: 'money', url: '/sponsor/select'},
        {short: 'SPONSORINGRENEW', name: tt('Sponsor erneuern'), icon: ['money',{fa:'refresh',classes: ['lg']}], url: '/#url=sponsor/details?mode=renew'},
        {short: 'MATCHDAY', name: tt('Spieltag'), icon: 'list-ol', url: '/matchdaytable/matchdaytable'}
    ];

    function showQuickLinks(el){

        const qlSettings = OLSettings.get("QuickLinks");
        if (!qlSettings) return;
        const qlList = OLCore.JSON.tryParse(qlSettings);
        if (!qlList || qlList.length === 0) return;

        function adjustLogoBack(el){
            $(el).removeClass("tb_small_logo");
        }

        function adjustLogo(mutRecs){
            if (!mutRecs?.length) return;
            const mutRec = mutRecs[0];
            const oldValue = mutRec.oldValue;
            const tgt = $(mutRec.target);
            if (tgt.hasClass("ol-logo-animate-out") && oldValue.includes("ol-logo-animate-in")){
                tgt.removeClass("ol-logo-animate-out");
            }
        }

        const mutationObserver = new MutationObserver(adjustLogo);
        mutationObserver.observe($("span#ol-banner-logo")[0], { attributes: true, attributeOldValue: true, attributeFilter: ["class"] });

        OLCore.addStyle(`
            #ol-banner-logo-text {
              background: transparent;
              display: flex;
              align-items: center;
              padding: 0;
              z-index: 2;
              line-height: 0px;
              width:225px;
              height:60px;
              overflow: clip;
            }
            .ol-lg #ol-banner-logo-text, .ol-md #ol-banner-logo-text {
              flex-flow: column wrap;
              align-content:flex-start;
            }
            #ol-banner-logo-text > a > span {
              font-size: 16px;
            }
            #ol-banner-logo-text > a {
              margin-top: -2px;
            }
            .ol-xs #ol-banner-logo-text, .ol-sm #ol-banner-logo-text{
              left: 45px !important;
              margin-top: 5px;
              z-index: 2;
              flex-wrap: nowrap;
              overflow-x: auto;
              width:225px;
              scrollbar-width:thin;
              height: 40px;
            }
            .ol-sm #ol-banner-logo-text{
              margin-top: 5px;
              left: 45px !important;
              flex-wrap: nowrap;
            }
            .ol-nav-slim .ol-banner-logo{
              width: 30px;
              height: 30px;
              top: 3px;
            }
            .ol-nav-slim span#ol-banner-logo-text {
              left: 45px;
              margin-top: 2px;
              flex-wrap: nowrap;
            }
        `);

        $(el).parent().removeAttr("href");

        $("#ol-banner-logo").css("display","block");

        function generateQlIcon(q){
            let qName, classes = [];
            if (typeof q === 'string'){
                qName = q;
            } else {
                qName = q.fa;
                classes = q.classes;
            }
            const faClasses = classes.map(c => ` fa-${c}`).join('')
            return `<span class="fa fa-stack-1x fa-inverse fa-${qName}${faClasses}" />`;
        }

        for (const ql of qlList){
            const qlObj = QuickLinkConfig.find(q => q.short === ql);
            let iconSpan;
            if (Array.isArray(qlObj.icon)){
              if (qlObj.icon.length > 1){
                const stackedIcons = qlObj.icon.map(q => generateQlIcon(q)).join('');
                iconSpan = stackedIcons;
              } else {
                iconSpan = generateQlIcon(qlObj.icon[0]);
              }
            } else {
               iconSpan = generateQlIcon(qlObj.icon);
            }
            const allIcons = `<span class="fa-stack"><span class="fa fa-square fa-stack-2x" />${iconSpan}</span>`;
            if (qlObj) {
                $(el).append(`<a href="${qlObj.url}" title="${qlObj.name}">${allIcons}</a>`);
            }
        }
    }

    function adjustQuickLinkWidth(){
        if (!$("body").hasClass("ol-xs") && !$("body").hasClass("ol-sm")) return;
        const lLeft = $('#ol-banner-logo-text').offset().left;
        const cLeft = $('.matchday-date-container').offset().left;
        $("#ol-banner-logo-text").width(cLeft-lLeft);
    }

    function removeClassForQuickLinks(el){
        const qlSettings = OLSettings.get("QuickLinks");
        if (!qlSettings) return;
        const qlList = OLCore.JSON.tryParse(qlSettings);
        if (!qlList || qlList.length === 0) return;
        $(el).removeClass("ol-logo-animate-out");
    }

    function quickLineup(el){
        if ($("#quickLineup").length > 0){
            return;
        }
        const parent = $(el).parent();
        parent.prepend(`<button class="ol-training-done-button ol-state-primary-color-${OLCore.Base.teamColorNumber} bold ol-state-color-button" title="${tt("Aufstellung")}" id="quickLineup" style="margin-bottom:5px; min-width:0;">
            <span class="fa fa-users"></span>
        </button>`);
        $("#quickLineup").on("click",function(){olAnchorNavigation.load("/team/lineup");});
    }

    function getScrollBarWidth () {
        var $outer = $('<div>').css({visibility: 'hidden', width: 100, overflow: 'scroll'}).appendTo('body'),
            widthWithScroll = $('<div>').css({width: '100%'}).appendTo($outer).outerWidth();
        $outer.remove();
        return 100 - widthWithScroll;
    };

    function applyCSS(){
        OLCore.addStyle(`
        body.ol-xs div.matchday-date-container, body.ol-xs div.matchday-flip-head-display {
            width: 150px;
        }
        body.ol-xs div.ol-navigation-matchday-display {
            top: revert;
            right: 55px;
        }
        body.ol-sm div.ol-navigation-matchday-display {
            padding: 0px 30px 0;
            right: 55px;
        }
        body.ol-xs div.matchday-date-flip, body.ol-sm div.matchday-date-flip {
            margin-top: -3px;
        }
        .ol-xs div.TB_SeasonWeek, .ol-sm div.TB_SeasonWeek {
            width: 100%;
            height: 15px;
            position: relative;
        }
        .ol-lg div.TB_SeasonWeek, .ol-md div.TB_SeasonWeek {
            margin-top: -30px;
            width: 100%;
            height: 30px;
            position: relative;
        }
        .ol-lg div.TB_SeasonWeek > span, .ol-md div.TB_SeasonWeek > span {
            font-family: Exo\ 2,sans-serif;
            font-size: 10.5pt;
            font-weight: 700;
            color: var(--ol-font-default-color);
            text-transform: uppercase;
            position: absolute;
            transition: all .4s ease-in-out;
            -moz-transition: all .4s ease-in-out;
            -webkit-transition: all .4s ease-in-out;
            -o-transition: all .4s ease-in-out;
            transform: translateZ(0);
            bottom: 0;
            right: 10px;
            white-space: nowrap;
        }
        .ol-xs div.TB_SeasonWeek > span, .ol-sm div.TB_SeasonWeek > span {
            font-family: Exo\ 2,sans-serif;
            font-size: 9pt;
            font-weight: 700;
            color: var(--ol-font-default-color);
            text-transform: uppercase;
            position: absolute;
            transition: all .4s ease-in-out;
            -moz-transition: all .4s ease-in-out;
            -webkit-transition: all .4s ease-in-out;
            -o-transition: all .4s ease-in-out;
            transform: translateZ(0);
            bottom: 0;
            right: 0;
            white-space: nowrap;
        }
        body.ol-md div.ol-navigation-matchday-display {
            width: 44.66%;
            right: 55%;
        }
        body.ol-md div.ol-navigation-wrapper-right-side {
            left: 44.66%;
            width: 55%;
        }
        body.ol-md span.ol-banner-line.hidden-xs.hidden-sm {
            left: 44.66%;
        }
        `);
    }

    function showSeasonWeek(){
        //const ssw = $("div.matchday-date-container").prepend(`<div class="TB_SeasonWeek"><span>${tt("Saison")} ${OLCore.Base.season} ${tt("Woche")} ${OLCore.Base.week}</span></div>`);
        const liquids = OLCore.getNum($("span.ol-nav-liquid-funds.liquidFunds").text());
        $("div.matchday-date-container").prepend(`<div class="TB_SeasonWeek hidden-xs hidden-sm"><span>S ${OLCore.Base.season} W ${OLCore.Base.week}</span></div>`);
        $("div.matchday-date-container").prepend(`<div class="TB_SeasonWeek hidden-lg hidden-md"><span>S ${OLCore.Base.season} W ${OLCore.Base.week} | ${OLCore.num2Cur(liquids)}</span></div>`);
    }

    function init(){
        $(window).on("resize", adjustQuickLinkWidth);

        addDarkMode();

        showSeasonWeek();

        OLSettings.add({name: "Quicklinks", short: "QuickLinks", descr: tt("Untermenü Direktlinks"), type: "multiselect", default: JSON.stringify(QuickLinkDefaults), settingsId: 'main', options: QuickLinkConfig});

        OLCore.waitForKeyElements(
            ".playeroverviewtablestriped",
            correctBirthDate
        );

        OLCore.waitForKeyElements(
            ".ol-player-budget",
            budgetOverview
        );

        OLCore.waitForKeyElements(
            "div.team-overview-info",
            teamInfoLinks
        );

        OLCore.waitForKeyElements(
            "div#ol-ranking-content > div.row",
            teamNumber,
            true
        );

        OLCore.waitForKeyElements(
            "div#ol-table-content tr#ol-td",
            highlightMatchdayTable,
            true
        );

        function wfke_showExtPlayerInfo(ov){
            showExtPlayerInfo(ov);
        }
        function wfke_showExtPlayerInfo2(pd){
            showExtPlayerInfo(pd, {targetDiv: "div.ol-team-settings-line-up-playerinfo > div:nth-child(5)"});
        }
        OLCore.waitForKeyElements(
            "div.player-quick-overview-wrapper",
            wfke_showExtPlayerInfo
        );

        OLCore.waitForKeyElements(
            "div.ol-player-details",
            wfke_showExtPlayerInfo2
        );

        OLCore.waitForKeyElements(
            ".ol-subnav-item",
            subnavMiddleClick
        );

        OLCore.waitForKeyElements(
            "li.ol-nav-item-li",
            navMiddleClick
        );

        OLCore.waitForKeyElements(
            "#ol-banner-logo-text",
            showQuickLinks
        );

        OLCore.waitForKeyElements(
            "span#ol-banner-logo.ol-logo-animate-out",
            removeClassForQuickLinks,
            true
        );

        OLCore.waitForKeyElements(
            "button.ol-training-done-button",
            quickLineup
        );

        applyCSS();

        window.setTimeout( adjustQuickLinkWidth, 2000);

    }

    init();

})();