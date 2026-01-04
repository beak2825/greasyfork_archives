/*jshint esversion: 8, multistr: true */
/* globals toggleButtonTopPlayerTotalChanged, OLCore, OLSettings, unsafeWindow, OLi18n, GM_setClipboard */

// ==UserScript==
// @name           OnlineligaMatchdayHelper
// @namespace      https://greasyfork.org/de/users/577453
// @version        0.4.3
// @license        LGPLv3
// @description    Zusatzinfos für Spieltag/Tabelle bei Onlineliga.de
// @author         KnutEdelbert
// @match          https://www.onlineliga.de
// @require        https://greasyfork.org/scripts/424896-olcore/code/OLCore.user.js
// @grant          GM_listValues
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_deleteValue
// @grant          GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/427987/OnlineligaMatchdayHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/427987/OnlineligaMatchdayHelper.meta.js
// ==/UserScript==

/*********************************************
 * 0.1.0 20.06.2021 Release
 * 0.1.1 08.07.2021 + match export
 * 0.1.2 bugfix: init function
 * 0.1.3 07.09.2021 separate chances from shots
 * 0.1.4 13.10.2021 OLSettings integration
 * 0.1.5 14.10.2021 mark missed Penaly as attempt
 * 0.1.6 25.10.2021 more failChances
 * 0.1.7 23.11.2021 Bugfix friendly export
 * 0.1.8 01.12.2021 Bugfix scoring chances
 * 0.1.9 09.01.2022 + league schedule
 * 0.2.0 24.01.2022 i18n support
 * 0.2.1 27.05.2022 Bugfix fail chances
 * 0.3.0 27.06.2022 + Avg Team values for match preview
 *                  + colored background for statistic bars
 * 0.3.1 02.07.2022 combine chances with shots in one bar
 * 0.3.2 04.07.2022 Bugfix show chances
 * 0.3.3 05.07.2022 Bugfix team strength on match preview
 * 0.3.4 13.07.2022 + Export Match statistics
 *                  + ahow ranks of previous week on match result table
 * 0.3.5 27.07.2022 Bugfix: show correct matchday on page reload (remove ranks from stats export)
 * 0.4.0 22.11.2024 OL 2.0
 * 0.4.1 25.11.2024 Bugfix: show chances
 * 0.4.2 26.11.2024 Bugfix: chances
 * 0.4.3 15.12.2024 Bugfix: Penalty Miss Chance
 *********************************************/
(function() {
    'use strict';
    const $ = unsafeWindow.jQuery;
    const api = OLCore.Api;
    const t = OLi18n.text;
    const tt = OLi18n.tbtext;

    const TopPlayer = {};
    const Match = {};
    let colorStatTimeout;

    TopPlayer.values = {};

    TopPlayer.resetValues = function(){
        TopPlayer.values = {
            lastRating : 0,
            standing : 1,
            lastMatchday : 0,
            lastLeague : 0,
            lastSeason : 0,
            lastTeam : 0,
            lastPosition : 0,
            filterActive : OLSettings.get("TopplayerFilter") || false
        };
    };

    TopPlayer.resetValues();

    TopPlayer.createFilterButton = function(elem){

        if ($("input#filter-topplayerFilter").length){
            return;
        }

        if ($("button#topPlayerSeasonButton.ol-tab-button.active").length === 0){
            TopPlayer.resetValues();
            return;
        }

        function filterToggle(evt){
            if ($("button#topPlayerSeasonButton.ol-tab-button.active").length === 0){
                return;
            }
            const isChecked = evt.currentTarget.checked;
            TopPlayer.values.filterActive = isChecked;
            OLSettings.set("TopplayerFilter", isChecked);
            TopPlayer.values.lastRating = 0;
            TopPlayer.values.standing = 1;
            toggleButtonTopPlayerTotalChanged(1);
        }

        TopPlayer.resetValues();

        $(` \
<div class="col-md-3 col-xs-12"><div style="margin-top: 23px;"><div id="navToggle"> \
    <div class="row"> \
        <div class="col-xs-12"> \
        <div id="buttonToggle-topplayerFilter" class="ol-checkbox-slider ol-checkbox slider" style="display: flex;"> \
            <label for="filter-topplayerFilter"> \
                <span class="ol-font-standard"> \
                    <span id="filter-topplayerFilter-1" class="filter-active" style="display: ${TopPlayer.values.filterActive ? 'inline' : 'none'};">Filter (50%)</span> \
        <span id="filter-topplayerFilter-2" class="filter-not-active" style="display: ${TopPlayer.values.filterActive ? 'none' : 'inline'};">Filter (50%)</span> \
        </span> \
        <input id="filter-topplayerFilter" data-value="1" type="checkbox" value="${TopPlayer.values.filterActive ? '1' : '2'}" name="optradio" onchange="$(\'#filter-topplayerFilter-1, #filter-topplayerFilter-2\').toggle(); $(this).val(($(this).val() % 2) + 1);"  ${TopPlayer.values.filterActive?'checked=""':''} /> \
            <i style="display: inline-block;"/> \
                </label> \
        </div> \
        </div> \
    </div> \
</div>`).appendTo("div#leagueNavContent-matchdayTable.ol-league-nav-content > div.container-fluid > div.row.row-no-space:nth-child(3)");
        $("input#filter-topplayerFilter").on("click", filterToggle);
    };

    TopPlayer.filterRow = function(elem){
        if (!TopPlayer.values.filterActive || $("button#topPlayerSeasonButton.ol-tab-button.active").length === 0){
            return;
        }
        const matchday = parseInt($("div#dropdown-matchday-table-matchday-matchdayTable").attr("data-value"),10);
        const league = $('div#dropdown-matchday-table-1-matchdayTable[data-default="Liga wählen"]').is(":visible") ?
              parseInt($("div#dropdown-matchday-table-1-matchdayTable").attr("data-value"),10) :
        $('div#dropdown-matchday-table-2-matchdayTable[data-default="Liga wählen"]').is(":visible") ?
              parseInt($("div#dropdown-matchday-table-2-matchdayTable").attr("data-value"),10) :
        $('div#dropdown-matchday-table-3-matchdayTable[data-default="Liga wählen"]').is(":visible") ?
              parseInt($("div#dropdown-matchday-table-3-matchdayTable").attr("data-value"),10) : 0;
        const season = parseInt($("div#dropdown-matchday-table-season-matchdayTable").attr("data-value"),10);
        const team = parseInt($("div#topPlayerTeamDropdown").attr("data-value"),10);
        const position = parseInt($("div#topPlayerPositionDropdown").attr("data-value"),10);


        if (matchday !== TopPlayer.values.lastMatchday ||
            league !== TopPlayer.values.lastLeague ||
            season !== TopPlayer.values.lastSeason ||
            team !== TopPlayer.values.lastTeam ||
            position !== TopPlayer.values.lastPosition){
            TopPlayer.values.lastRating = 0;
            TopPlayer.values.standing = 1;
            TopPlayer.values.lastMatchday = matchday;
            TopPlayer.values.lastLeague = league;
            TopPlayer.values.lastSeason = season;
            TopPlayer.values.lastTeam = team;
            TopPlayer.values.lastPosition = position;
        }
        const matches = parseInt(elem.find("div:nth-child(2) > div:nth-child(1) > div:nth-child(2)").text(),10);
        const rating = OLCore.getNum(elem.find("div:nth-child(2) > div:nth-child(1) > div:nth-child(3)").text());
        const standingDiv = elem.find("div > div > div").eq(0);
        const standingDivMobile = elem.children("div").eq(2).children("div").eq(0);
        if (matchday && matches){
            if (matchday/2 > matches){
                elem.hide();
            } else {
                const fiteredRating = rating > TopPlayer.values.lastRating ? TopPlayer.values.standing.toString() : '...';
                standingDiv.text(fiteredRating);
                standingDivMobile.text(fiteredRating);
                TopPlayer.values.standing++;
                TopPlayer.values.lastRating = rating;
            }
        }
    };

    Match.exportData = async function(evt){

        const matchSeason = $(evt.currentTarget).attr("data-season");
        const matchDayWeek = $(evt.currentTarget).attr("data-matchDayWeek");
        const isFriendly = $(evt.currentTarget).attr("data-isFriendly") === "1";
        const searchParams = window.location.href.match(/season=(\d+)&matchId=(\d+)/);
        const matchDay = isFriendly ? OLCore.week2matchDay(matchDayWeek) : matchDayWeek;
        const week = isFriendly ? matchDayWeek : OLCore.matchDay2week(matchDayWeek);
        const matchType = isFriendly ? 'F' : 'L';
        if (!searchParams){
            return;
        }
        const rows = [];
        if (evt.shiftKey){
            rows.push(`${tt("Saison")}\t${tt("Spieltag")}\t${tt("Woche")}\t${tt("Typ")}\t${tt("Spieler-ID")}\t${tt("Name")}\t${tt("Note")}\t${tt("Formation")}\t${tt("Position")}\t${tt("Einsatzzeit")}\t${tt("Einwechslung")}\t${tt("Auswechslung")}\t${tt("Tore")}\t${tt("Vorlagen")}\t${tt("Gelb")}\t${tt("Gelb-Rot")}\t${tt("Rot")}`);
        }
        const season = parseInt(searchParams[1]);
        const matchId = parseInt(searchParams[2]);
        const stats = await api.getMatchStatistics(season, matchId, OLCore.Base.userId);
        const lineup = await api.getMatchLineup(season, matchId, OLCore.Base.userId);
        const squad = await api.getSquad(OLCore.Base.userId);
        let cols;
        for (const l of stats.own.lineup){
            const playerId = l.playerId;
            const playerData = stats.own.players[playerId];
            const lineupData = lineup.players[playerId];
            const formation = OLCore.Base.Formations[lineup.formation];
            const timeEnd = playerData.red || playerData.yellowred || playerData.out || stats.final;
            const timeStart = playerData.in || 0;
            const time = timeEnd - timeStart;
            cols = [];
            cols.push(matchSeason);
            cols.push(matchDay || '');
            cols.push(week);
            cols.push(matchType);
            cols.push(l.playerId);
            cols.push(l.playerName);
            cols.push(l.rating ? OLi18n.tbNum(l.rating) : '');
            cols.push(formation.short);
            cols.push(formation.positions[lineupData.position.id-1].short);
            //cols.push(squad.playerObj[playerId].positions);
            //cols.push(lineupData.position.wrong ? 1 : 0);
            cols.push(time + "'");
            cols.push('');
            cols.push(playerData.out ? playerData.out + "'" : '');
            cols.push(playerData.goals ? playerData.goals : '');
            cols.push(playerData.assists ? playerData.assists : '');
            cols.push(playerData.yellow ? playerData.yellow + "'" : '');
            cols.push(playerData.yellowred ? playerData.yellowred + "'" : '');
            cols.push(playerData.red ? playerData.red + "'" : '');
            rows.push(cols.join("\t"));
        }
        for (const s of stats.own.substitutions){
            const playerId = s.in.id;
            const playerData = stats.own.players[playerId];
            const lineupData = lineup.players[playerId];
            const formation = OLCore.Base.Formations[lineup.formation];
            const timeEnd = playerData.red || playerData.yellowred || playerData.out || stats.final;
            const timeStart = playerData.in || 0;
            const time = timeEnd - timeStart;
            cols = [];
            cols.push(matchSeason);
            cols.push(matchDay || '');
            cols.push(week);
            cols.push(matchType);
            cols.push(playerId);
            cols.push(s.in.name);
            cols.push(s.in.rating ? OLi18n.tbNum(s.in.rating) : '');
            cols.push(formation.short);
            cols.push(formation.positions[lineupData.position.id-1].short);
            //cols.push(squad.playerObj[playerId].positions);
            //cols.push(0);
            cols.push(time + "'");
            cols.push(playerData.in ? playerData.in + "'" : '');
            cols.push(playerData.out ? playerData.out + "'" : '');
            cols.push(playerData.goals ? playerData.goals : '');
            cols.push(playerData.assists ? playerData.assists : '');
            cols.push(playerData.yellow ? playerData.yellow + "'" : '');
            cols.push(playerData.yellowred ? playerData.yellowred + "'" : '');
            cols.push(playerData.red ? playerData.red + "'" : '');
            rows.push(cols.join("\t"));
        }
        GM_setClipboard(rows.join("\r\n"));
        OLCore.info(tt("Daten in die Zwischenablage kopiert"));
    };

    Match.createExport = function() {
        const matchSpan = $("div#matchdayresult div.ol-league-name > span[onclick]");
        const matchNums = OLCore.getNum(matchSpan.text().trim(), -1);
        const isFriendly = $("div.ol-league-name").text().includes(t("Freundschaftsspiel"));
        let gameMatchDayWeek = 0;
        let gameSeason = 0;
        if (matchNums) {
            gameSeason = matchNums[0];
            gameMatchDayWeek = matchNums[1];
        }
        // Check, if match isn't played yet
        if ($("div.matchScore").text().trim() === ":"){
            return;
        }
        const copyBtn = $(`<button style="display:inline; float:right;"
                                   class="ol-button ol-button-copy"
                                   id="btnExportMatch"
                                   data-isFriendly="${isFriendly?1:0}"
                                   data-season="${gameSeason}"
                                   data-matchDayWeek="${gameMatchDayWeek}"
                                   title="${tt("Spielerdaten in Zwischenablage kopieren (Shift halten für Überschriften)")}"><i class="fa fa-users"></i></button>`);
        $("section.ol-tab-button-section").append(copyBtn);
        copyBtn.on("click", Match.exportData);
    };

    Match.showRanks = async function(){
        const isFriendly = $("div.ol-league-name").text().includes(t("Freundschaftsspiel"));
        const linkData = OLCore.getNum($("div.ol-league-name").children().eq(0).attr("onclick"),-1);
        const season = linkData[0];
        let matchDay = linkData[1];
        let leagueId = linkData[2];
        let leagueRanks = {};
        if (isFriendly) {
            if (season < OLCore.Base.season){
                return;
            }
            matchDay = Math.min(OLCore.week2matchDay(OLCore.getNum($("div.ol-league-name").text().trim(), 1), true),35);
            if (OLCore.Base.rawMatchDay < ((season * 100) + matchDay)) {
                matchDay = OLCore.Base.matchDay;
            }
            if (matchDay === 1){
                for (const ui of Match.userIds){
                    leagueRanks[ui] = 1;
                }
            } else {
                const userInfo0 = await OLCore.Api.getTeamInfo(Match.userIds[0]);
                leagueId = userInfo0.leagueId;
                leagueRanks[Match.userIds[0]] = await OLCore.XApi.getRank(season, leagueId, matchDay-1, Match.userIds[0]);
                const userInfo1 = await OLCore.Api.getTeamInfo(Match.userIds[1]);
                leagueId = userInfo1.leagueId;
                leagueRanks[Match.userIds[1]] = await OLCore.XApi.getRank(season, leagueId, matchDay-1, Match.userIds[1]);
            }
        } else {
            if (OLCore.Base.rawMatchDay < ((season * 100) + matchDay)) {
                matchDay = OLCore.Base.matchDay;
            }
            if (matchDay === 1){
                for (const ui of Match.userIds){
                    leagueRanks[ui] = 1;
                }
            } else {
                leagueRanks = await OLCore.XApi.getRanks(season, leagueId, matchDay-1, Match.userIds);
            }
        }
        $("div.row.ol-matchday-result-teams").children("div").eq(0).children("div").eq(1).children("span").first().after(`<span> (${leagueRanks[Match.userIds[0]]}.)</span>`);
        $("div.row.ol-matchday-result-teams").children("div").eq(2).children("div").eq(1).children("span").first().after(`<span> (${leagueRanks[Match.userIds[1]]}.)</span>`);
        Match.ranks = [leagueRanks[Match.userIds[0]], leagueRanks[Match.userIds[1]]];
    }

    Match.failChancesAll = {
        'de' : ["Abschluss war zum Vergessen", "fliegt fast zehn Meter am", "Was war das denn?", "nimmt den \"Rückpass\" ohne Probleme auf", "Aber dann kommt da sowas heraus", "geht in Richtung Tribüne", "muss man diesen Abschluss auch halten", "trudelt eher aufs Tor", "verdient das Prädikat \"verkorkst\"","am Ende fehlt aber doch ein ganzes Stück", "bei diesem Abschluss fehlte das letzte Quäntchen Präzision und Glück","bringt nichts ein","da muss er mehr draus machen","damit stellt man einen Keeper nicht vor Probleme","denn ein gefährlicher Abschluss sieht anders aus","der natürlich kein Problem hat, den Schuss zu entschärfen","der war nicht gut,","deutlich am Tor vorbei","deutlich ins Toraus","fliegt deutlich am Kasten","fliegt deutlich über den Kasten","fliegt gut zehn Meter über den Kasten","fliegt gute zwei Meter neben dem Pfosten ins Toraus","fliegt weit über das Tor","fliegt weit über den Kasten","fliegt zehn Meter am Tor","gar keine Probleme und kann ihn locker festhalten","geht deutlich über den Kasten","geht meterweit übers Tor","geht weit am Kasten vorbei","geht weit am Tor vorbei","gehört in die Kategorie \"völlig misslungen\"","hat er nicht richtig getroffen","ist ein dankbarer Abschluss für Keeper","ist komplett verkorkst","ist ungefährlich","ist viel zu unplatziert","ist völlig misslungen","ist völlig ungefährlich","ist völlig verkorkst","ist völlig verzogen","ist zu unpräzise","kann das auch nichts werden","kann das einfach nichts werden","kann das gar nichts werden","kann das nichts werden","kann den Ball ohne große Mühe festhalten","kann er aber besser","kann er besser","kann er definitiv besser","kann er deutlich besser","kann es nicht funktionieren","Kein guter Abschluss","Kein guter Versuch, viel zu unplatziert","Kein wirklich gefährlicher Abschluss","Keine allzu große Gefahr","Keine Gefahr","keine Gefahr","keine große Mühe die Kugel zu entschärfen","kommt als halbhoher Ball mitten auf den Keeper","kommt aus der Kategorie \"dankbar für den Torwart\"","kommt nicht wirklich gefährlich auf das Tor","kommt viel zu langsam aufs Tor","letztlich total misslungen","misslingt ihm völlig","mit so einem Abschluss kann es nichts werden mit dem Tor","Muss er aber auch, denn ein gefährlicher Abschluss sieht anders aus","Mühelos kann der Keeper","nach dem Abschluss schüttelt der Schütze","nicht richtig getroffen","rauscht meilenweit am Ziel vorbei","Richtig gefährlich war dieser Abschluss aber auch nicht","sah eher nach Eckfahnenzielschießen aus:","Schwacher Abschluss","segelt fast zehn Meter am Tor vorbei","segelt weit über die Latte","So geht es nicht","stellt sich als ungefährlich heraus","Torgefahr sieht anders aus","trifft den Ball nicht gut","trifft die Kugel völlig falsch","Uli Hoeneß Gedächtnis-Abschluss","Und dann so etwas, beim Schuss scheitert er kläglich","unmittelbar nach dem Abschluss geht ein enttäuschtes Raunen durch die Zuschauer","verkorkster Abschluss","verzieht er","völlig falsch getroffen","war aber mal gar nichts","war dann doch eher kläglich","war gar nichts","war ja mal überhaupt nichts","war kein guter Abschluss","war nichts","war überhaupt nichts","was war das denn?","Was war denn da los?","wenn wir ehrlich sind, muss er diesen Schuss auch halten","wird das nichts"],
        'en' : ["\"little shot\"","a dangerous finish looks different","a thankful finish for keeper","apologises vehemently to his teammates","ashamed of this miserable attempt","ball comes in at low speed centrally on the","ball comes much too slowly on","ball crosses the baseline even outside","ball flies almost ten meters past","ball flies at low speed towards","ball flies past the","ball flies very far past","ball flies well over the","ball flies wide of","ball goes far past","ball goes just wide of the","ball goes well past","ball goes wide of","ball is closer to the corner flag than to","ball is very slow and almost starves to death","ball is way too un-placed","ball rather trundles towards","ball rolls towards","ball sails far over the crossbar","ball tumbles more towards the","because the ball goes past","block this shot without much problems","buries his face in his","but that was nothing","But that was nothing","but there is no danger for the","But there is no danger for the","can catch it easily","can catch it without effort","can catch the leather at his leisure","can do better than that","can do much better","can easily hold the ball","completely harmless","dangerous finish looks different","didn't hit it right at all","didn't hit the ball right","didn't really hit it","doesn't hit the ball properly","doesn't need to make much of an effort to hold on to this finish","doesn't seem to have concentrated at all","far past the box","far past the goal","finish doesn't come to anything","finish fails","finish flies miles past","finish flies ten metres past","finish is a complete failure","finish is completely messed up","finish is completely out of place","finish is completely screwed up","finish is far too weak","finish is too imprecise","finish lacked the last bit of precision and luck","finish poses no danger","finish results in a dolly ball","finish was to forget","Goal threat looks different","goes a good five yards past","goes far past the box","goes far past the goal","goes well over the box of keeper","harmless finish","has no great trouble to defuse the ball","has no trouble at all to defuse","has no trouble defusing it","has no trouble picking it up","has to make more of it","hat was nothing","hits the ball completely wrong","hold on to the leather without any trouble","if the goal was twice as high","is a good 3-4 meters missing","is able to hold on to the leather without any trouble","is able to pick up the ball confidently","is already shaking his head","is not really dangerous","is visibly disappointed","it can't be anything like that","it can't come off like that","just rolls into the box","lands near the corner flag","looks as if he's almost a little ashamed","looks as if he's almost a little ashamed","miserable attempt","misses it completely","misses the actual target accordingly clearly","more like corner flag target shooting","near the corner flag","no challenge for the keeper","No danger for the box of","no danger for the box of","No danger for the goal of","no danger for the goal of","No danger to the box","no danger to the box","No danger to the goal","no danger to the goal","Not a good finish","not a stellar performance from him","only has to pick it up","only hits the ball lightly","picks up without any problems","poses absolutely no danger to","pulls his jersey over his face","pulls his shirt over his face","raises both hands apologetically","raises his hands apologetically","raises his hands apologetically","sails far over the crossbar","shakes his head","shaking his head","signals early on that the ball will go well past","strange trajectory","takes the \"back pass\" without any problems","takes the ball without problems","that was not a stellar performance from him","That was nothing","that was nothing","that was rather woeful","That's not going to work","That's not the way to do it","that's not the way to do it","the hell was going on","then something like this comes out","there is no goal threat from this finish","they can't go on like this if they want to achieve anything","this finish is completely screwed up","this finish was to forget","this one ends up hitting the corner flag","Weak finish","weak finish","What was that?","with a finish like that, it can't be anything"]
    };

    Match.processTicker = function(){

        // gets the text of a ticker line
        function getTickerText(tr, trim){
            let text;
            const contentDiv = $(tr).find('div.ol-match-report-text');
            if (contentDiv && contentDiv[0] && contentDiv[0].innerText){
                const tickerTextSpan = $(contentDiv).find('span.ol-match-report-text');
                if (tickerTextSpan && tickerTextSpan[0] && tickerTextSpan[0].innerHTML){
                    text = tickerTextSpan[0].innerHTML;
                }
                text = contentDiv[0].innerText;
                if (trim) { return $.trim(text); }
                return text;
            }
            return null;
        }

        if(! $('section.ol-tab-button-section > button:nth-child(1).active').length){
            return;
        }
        $("div.icon-icon_scoring_chance").each(function(i,el){
            const tr = $(el).parent().parent()[0];
            const trText = getTickerText(tr, true);
            if (!trText) {
                return;
            }
            const failChances = Match.failChancesAll[OLi18n.lang.substr(0,2)] || [];
            if (failChances.some(fc => trText.includes(fc))){
                $(el).css("transform", "scale(0.5)");
                $(el).css("transform-origin", "0 0");
                if ($(tr).find(".ol-match-report-text-statistic").length) {
                    const rgx = new RegExp(`^${t("Gute Torchance")}`,"i");
                    const newText = $(tr).find(".ol-match-report-text-statistic").text().trim().replace(rgx, t("Torchance"));
                    $(tr).find(".ol-match-report-text-statistic").eq(0).text(newText);
                }
            }
        });
    };

    Match.addStats = async function(){
        if ($(".TB_Chances").length) return;
        const matchURL = new URL(window.location.href);
        const searchParams = matchURL.hash && matchURL.hash.startsWith("#url=/") ? new URLSearchParams(matchURL.hash.substring(matchURL.hash.indexOf("?"))) : matchURL.searchParams;
        const season = searchParams.get("season");
        const matchId = searchParams.get("matchId");
        const ticker = await OLCore.get(`/match/ticker?season=${season}&matchId=${matchId}`);
        const chances = [0,0];
        const minuteChances = {};
        const team0 = $("div.matchreport-teambadge").eq(0).parent().find(".ol-font-4").children().eq(0).text().trim().toLowerCase();
        const team1 = $("div.matchreport-teambadge").eq(1).parent().find(".ol-font-4").children().eq(0).text().trim().toLowerCase();
        const teamMapping = {};
        teamMapping[team0] = 0;
        teamMapping[team1] = 1;

        // gets the text of a ticker line
        function getTickerText(tr, trim){
            let text;
            const contentDiv = $(tr).find('div.ol-match-report-text');
            if (contentDiv && contentDiv[0] && contentDiv[0].innerText){
                const tickerTextSpan = $(contentDiv).find('span.ol-match-report-text');
                if (tickerTextSpan && tickerTextSpan[0] && tickerTextSpan[0].innerHTML){
                    text = tickerTextSpan[0].innerHTML;
                }
                text = contentDiv[0].innerText;
                if (trim) { return $.trim(text); }
                return text;
            }
            return null;
        }

        // gets the headline of a ticker line
        function getTickerHeadline(tr, trim){
            let headline = $(tr).find(".ol-match-report-text-statistic");
            if (headline.length === 0){
                headline = $(tr).find(".ol-match-report-text-statistic-goal");
            }
            if (headline && headline[0] && headline[0].innerText){
                const text = headline[0].innerText;
                if (trim) { return $.trim(text); }
                return text;
            }
            return null;
        }

        function getTrIconText(tr, minute){
            const iconDiv = $(tr).find("td:nth-child(4) > div[class*='icon-icon_']");
            let iconType = "DEFAULT";
            if (iconDiv.length > 0){
                const classAttr = iconDiv.attr("class");
                const m = classAttr.match(/\bicon-icon_([^\s]*)\b/);
                if (m.length > 1){
                    iconType = m[1].toUpperCase();
                }
            }
            const descrSpan = $(tr).find("td:nth-child(1) > span.ol-match-report-minute:nth-child(1)");
            if (descrSpan.length > 0){
                const descr = descrSpan.text().trim().toUpperCase();
                if (descr === t("FAZIT")){
                    iconType = "FAZIT";
                }
            }
            return iconType;
        }

        function getTickerMinute(tr){
            let minute;
            let overTime;

            const minuteSpan = $(tr).find('td.matchresult-time > span.ol-match-report-minute');
            const overtimeTd = $(tr).find('td.matchresult-overtime');
            if (minuteSpan.length > 0){
                minute = parseInt(minuteSpan[0].innerText, 10);
            }
            if (overtimeTd.length > 0 && $.trim(overtimeTd[0].innerText).length > 0){
                overTime = parseInt($.trim(overtimeTd[0].innerText), 10);
            }
            return minute + (overTime > 0 ? overTime : 0);
        }



        $(ticker).find("div.ol-match-report-line tbody > tr").each(function(i,tr){
            const trType = getTrIconText(tr);
            if (trType === "SCORING_CHANCE"){
                const minute = getTickerMinute(tr);
                const trText = getTickerText(tr, true);
                const failChances = Match.failChancesAll[OLi18n.lang.substr(0,2)] || [];
                    const headline = getTickerHeadline(tr, true);
                    if (headline){
                    const rgx = new RegExp(`^${t("Gute Torchance")} ${t("für")} (.*)$`,"i");
                        const chanceTeam = headline.match(rgx);
                        if (chanceTeam){
                        if (!failChances.some(fc => trText.includes(fc))){
                            minuteChances[minute] = minuteChances[minute] || [{minor:0, major: 0},{minor:0, major: 0}];
                            minuteChances[minute][teamMapping[chanceTeam[1].toLowerCase()]].major++;
                            chances[teamMapping[chanceTeam[1].toLowerCase()]]++;
                        } else {
                            minuteChances[minute] = minuteChances[minute] || [{minor:0, major: 0},{minor:0, major: 0}];
                            minuteChances[minute][teamMapping[chanceTeam[1].toLowerCase()]].minor++;
                        }
                    }
                }
            } else if (trType.includes("GOAL")){
                const headline = getTickerHeadline(tr, true);
                if (headline){
                    const rgx = new RegExp(t("^To+r für ([^,]*),"),"i");
                    const chanceTeam = headline.match(rgx);
                    if (chanceTeam){
                        const minute = getTickerMinute(tr);
                        minuteChances[minute] = minuteChances[minute] || [{minor:0, major: 0},{minor:0, major: 0}];
                        minuteChances[minute][teamMapping[chanceTeam[1].toLowerCase()]].major++;
                        chances[teamMapping[chanceTeam[1].toLowerCase()]]++;
                    }
                }
            } else if (trType.startsWith("PENALTY_MISS")){
                const headline = getTickerHeadline(tr, true);
                if (headline){
                    //const rgx = new RegExp(t("für ([^,]+?)$"),"i");
                    const rgx = new RegExp(`${t("für")} (${team0}|${team1})`, "i");
                    const chanceTeam = headline.match(rgx);
                    if (chanceTeam){
                        const minute = getTickerMinute(tr);
                        minuteChances[minute] = minuteChances[minute] || [{minor:0, major: 0},{minor:0, major: 0}];
                        minuteChances[minute][teamMapping[chanceTeam[1].toLowerCase()]].major++;
                        chances[teamMapping[chanceTeam[1].toLowerCase()]]++;
                    }
                }
            }

        });

        const chanceWrapper = $(`div.ol-match-report-headline:contains('${t("TORCHANCEN")}')`).parent();
        chanceWrapper.addClass("TB_Chances");
        chanceWrapper.children("div").eq(0).text(`${t("TORSCHÜSSE")} (${t("TORCHANCEN")})`);
        const ch0 = chanceWrapper.next().find("span.ol-headline-standard").eq(0);
        ch0.addClass("TB_Chances");
        chanceWrapper.next().find("span.ol-headline-standard").eq(0).text(`${ch0.text()} (${chances[0]})`);
        const ch1 = chanceWrapper.next().find("span.ol-headline-standard").eq(1);
        ch1.addClass("TB_Chances");
        chanceWrapper.next().find("span.ol-headline-standard").eq(1).text(`${ch1.text()} (${chances[1]})`);

        //const chancesDetails = $('<div id="showChancesDetails" class="ol-matchreport-matchday-btn icon-ol-scrollup-button"></div>').appendTo("div.ol-match-report-headline-wrapper.TB_Chances");
        



        /*
        chanceWrapper.before(`<div class="ol-match-report-headline-wrapper"><div class="ol-match-report-headline">${t("TORCHANCEN")}</div></div>`);

        chanceWrapper.before(`<table class="table table-striped">
    <thead>
        <tr>
            <th style="width:50%"></th>
            <th style="width:50%"></th>
        </tr>
    </thead>
    <tbody>
        <tr class="ol-match-statistic-value-big">
            <td>
                <span class="ol-headline-standard">${chances[0]}</span>
            </td>
            <td>
                <span class="ol-headline-standard">${chances[1]}</span>
            </td>
        </tr>
    </tbody>
</table>`);
*/

    };

    Match.showPreviewStats = function(){
        const sw = OLCore.getNum($("div.ol-league-name").text().trim(),-1);
        const rsw = (sw[0]*100)+sw[1];
        if ((rsw - OLCore.Base.rawMatchDay) < 0){
            return;
        }
        const pitches = $("div#matchContent div.statistics-lineup-wrapper");
        const pitch0 = pitches[0];
        const pitch1 = pitches[1];
        OLCore.Lib.avgStatsPitch(pitch0);
        OLCore.Lib.avgStatsPitch(pitch1);
    };

    Match.exportMatchStats = async function(evt){
        const withHeadlines = evt.shiftKey;
        const sw = OLCore.getNum($("div.ol-league-name").text().trim(),-1);
        const isFriendly = $("div.ol-league-name").text().includes(t("Freundschaftsspiel"));
        const league = $("div.ol-league-name").text().trim().split(' - ')[1].trim().replace(/\s+/g," ");
        const season = sw[0];
        const week = isFriendly ? sw[1] : OLCore.matchDay2week(sw[1]);
        const matchDay = isFriendly ? null : sw[1];
        const matchStats = await api.getMatchStatistics(null, null, OLCore.Base.userId);
        const matchLineup = await api.getMatchLineup();
        const ownId = matchStats.own.userId;
        const oppId = matchStats.opp.userId;
        const homeAway = ownId === matchStats.home.userId ? 'H' : 'A';
        const stats = [];
        if (withHeadlines){
            stats.push([
                tt("Saison"),
                tt("Spieltag"),
                tt("Woche"),
                tt("Spieltyp"),
                tt("Gegner"),
                tt("Ort"),
                tt("Liga"),
                //tt("Platz"),
                tt("System"),
                tt("Tore"),
                tt("Ballbesitz"),
                tt("Zweikampf"),
                tt("Torschüsse"),
                tt("Torchancen"),
                tt("Eckbälle"),
                tt("Liga (Gegner)"),
                //tt("Platz (Gegner)"),
                tt("System (Gegner)"),
                tt("Tore (Gegner)"),
                tt("Ballbesitz (Gegner)"),
                tt("Zweikampf (Gegner)"),
                tt("Torschüsse (Gegner)"),
                tt("Torchancen (Gegner)"),
                tt("Eckbälle (Gegner)")
            ].join("\t"));
        }
        stats.push([
            season,
            matchDay,
            week,
            isFriendly ? 'F' : 'L',
            matchStats.opp.teamName,
            homeAway,
            isFriendly ? $("span.ol-league-name").eq(0).children().eq(0).text() : league,
            //Match.ranks ? Match.ranks[0] : '',
            tt(matchLineup[ownId].formation),
            matchStats.own.goals.length,
            matchStats.own.stats.possession,
            matchStats.own.stats.duels,
            matchStats.own.stats.shots,
            matchStats.own.stats.chances,
            matchStats.own.stats.corners,
            isFriendly ? $("span.ol-league-name").eq(1).children().eq(0).text() : league,
            //Match.ranks ? Match.ranks[1] : '',
            tt(matchLineup[oppId].formation),
            matchStats.opp.goals.length,
            matchStats.opp.stats.possession,
            matchStats.opp.stats.duels,
            matchStats.opp.stats.shots,
            matchStats.opp.stats.chances,
            matchStats.opp.stats.corners
        ].join("\t"));
        GM_setClipboard(stats.join("\r\n"));
        OLCore.info(tt("Daten in die Zwischenablage kopiert"));
    };

    Match.createStatsExport = async function(){
        if ($("#btnExportMatchStats").length){
            $("#btnExportMatchStats").show();
        } else {
        const statsBtn = $(`<button style="display:inline; float:right;"
                                   class="ol-button ol-button-copy"
                                   id="btnExportMatchStats"
                                   title="${tt("Spielstatistik in Zwischenablage kopieren (Shift halten für Überschriften)")}"><span class="fa fa-clipboard" /></button>`);
        $("section.ol-tab-button-section").append(statsBtn);
        statsBtn.on("click", Match.exportMatchStats);
        }
    };

    Match.showColorStats = async function(){

        if ($(".matchScore").text().trim() === ":"){
            return;
        }

        function doColorStats () {
            $("tr.ol-match-statistic-value-big:not(.ol-match-statistic-value-balance):not(.ol-match-statistic-value-season-balance)").each(function(i, tr){
                const leftSpan = $(tr).children().eq(0).children().eq(0);
                const rightSpan = $(tr).children().eq(1).children().eq(0);
                const leftNum = parseInt(leftSpan.text(),10) || 0;
                const rightNum = parseInt(rightSpan.text(),10) || 0;
                const allNum = leftNum + rightNum;
                const percentLeft = (leftNum/allNum) * 100;
                const percentRight = (rightNum/allNum) * 100;
                if (leftSpan.hasClass("TB_Chances")){
                    const leftNum2 = OLCore.getNum(leftSpan.text(),1);
                    const percentLeft2 = OLCore.round((leftNum2/leftNum)*percentLeft, 1);
                    leftSpan.css("background",`linear-gradient(to left, ${OLCore.Base.teamColor.replace(")",", 0.4)")} ${percentLeft}%, transparent 0%), linear-gradient(to left, ${OLCore.Base.teamColor.replace(")",", 0.5)")} ${percentLeft2}%, transparent 0%)`);
                } else {
                    leftSpan.css("background",`linear-gradient(to left, ${OLCore.Base.teamColor.replace(")",", 0.5)")} ${percentLeft}%, transparent 0%)`);
                }
                if (rightSpan.hasClass("TB_Chances")){
                    const rightNum2 = OLCore.getNum(rightSpan.text(),1);
                    const percentRight2 = OLCore.round((rightNum2/rightNum)*percentRight,1);
                    rightSpan.css("background",`linear-gradient(to right, ${OLCore.Base.teamColor.replace(")",", 0.4)")} ${percentRight}%, transparent 0%), linear-gradient(to right, ${OLCore.Base.teamColor.replace(")",", 0.5)")} ${percentRight2}%, transparent 0%)`);
                } else {
                    rightSpan.css("background",`linear-gradient(to right, ${OLCore.Base.teamColor.replace(")",", 0.5)")} ${percentRight}%, transparent 0%)`);
                }
            });
        }

        if (OLSettings.get("RealAttempts")) {
            await Match.addStats();
        }
        doColorStats();
        if (Match.userIds.includes(OLCore.Base.userId)){
            Match.createStatsExport();
        }
    };

    Match.showTableRanks = async function(){
        const tableSeason = $("div#dropdown-matchday-table-season-matchdayTable").attr("data-value");
        let matchDay = $("div#dropdown-matchday-table-matchday-matchdayTable").attr("data-value");
        const leagueLevel = $("div#dropdown-matchday-table-league-level-matchdayTable").attr("data-value");
        const leagueId = $(`#leagueNavContent-matchdayTable div.ol-dropdown.dropdown[data-default='${t("Liga wählen")}']`).eq(0).attr("data-value");
        if (matchDay > 1) {
            const rawTableMatchDay = ((Number(tableSeason) * 100) + Number(matchDay));
            if (OLCore.Base.rawMatchDay < rawTableMatchDay) {
                matchDay = OLCore.Base.matchDay;
            }
            if (matchDay > 35) {
                matchDay = 35;
            }
            const matchDayData = await OLCore.Api.getMatchDay(tableSeason, leagueId, matchDay-1);
            OLCore.Api.getMatchDay(tableSeason, leagueId, matchDay);
            $(".TB_TableRank").remove();
                $("div.ol-matchdaytable-team-col span.ol-team-name").each(function(i, team){
                    const teamId = OLCore.getNum($(team).attr("onclick"));
                    const rank = matchDayData.table.find(m => m.teamId === teamId).rank;
                    if ($(team).children().length) {
                        $(team).children().eq(0).before(`<span class="TB_TableRank" style="font-size:smaller;margin-left:3px;margin-right:3px;padding-top:2px;">(${rank})</span>`);
                    } else {
                        $(team).append(`<span class="TB_TableRank" style="font-size:smaller;margin-left:3px;margin-right:3px;padding-top:2px;">(${rank})</span>`);
                    }
                    $(team).css("display","flex");
                });
        }
    };

    function getLeagueSchedule(){
        const schedule = OLCore.getSeasonValueId("LeagueSchedule", OLCore.Base.userId);
        if (schedule && schedule.length){
            try {
              const sched = JSON.parse(schedule);
              if (sched.length === 34){
                return;
              }
            } catch {}
        }
        OLCore.XApi.getLeagueSchedule();
    }

    function init(){

        getLeagueSchedule();

        function wfke_showTableRanks(){
            Match.showTableRanks();
        }

        OLCore.waitForKeyElements(
            "#leagueFound",
            wfke_showTableRanks,
            true
        );
        /*
        function wfke_MatchAddStats(){
            Match.addStats();
        }
        */
        OLCore.waitForKeyElements (
            "button#topPlayerSeasonButton",
            TopPlayer.createFilterButton
        );

        //wait for the ticker page and start the ticker
        OLCore.waitForKeyElements (
            "div#topplayerTableContent > div.row.matchday-statistics-table",
            TopPlayer.filterRow
        );

        function wfke_createExports(){
            Match.userIds = [OLCore.getNum($("div#matchdayresult span.pointer[onclick*='/team/overview']").eq(0).attr("onclick")), OLCore.getNum($("div#matchdayresult span.pointer[onclick*='/team/overview']").eq(1).attr("onclick"))];
            //Match.showRanks();
            if (Match.userIds.includes(OLCore.Base.userId)){
                Match.createExport();
            }
        }

        OLCore.waitForKeyElements (
            "div#matchdayresult",
            wfke_createExports
        );

        OLCore.waitForKeyElements (
            "div#matchContent > div > div.ol-match-report-line > table",
            Match.processTicker
        );

        OLCore.waitForKeyElements (
            "div#matchContent > div.row",
            Match.showPreviewStats
        );

        function wfke_MatchShowColorStats(){
            if (colorStatTimeout) window.clearTimeout(colorStatTimeout);
            colorStatTimeout = window.setTimeout(()=>{
            Match.showColorStats();
            }, 1000);
        }
        OLCore.waitForKeyElements (
            //".ol-tab-button.active[onclick*='/match/statistic']",
            "div#matchReportStats",
            wfke_MatchShowColorStats,
            true
        );

        function destroyStatsExport(){
            Match.addStatsAdded = false;
            $("#btnExportMatchStats").hide();
        }

        OLCore.waitForKeyElements(
            "button.ol-button-toggle.active:not([onclick*='/match/statistic'])",
            destroyStatsExport
        );

    }

    init();

})();