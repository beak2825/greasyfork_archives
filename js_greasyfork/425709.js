/*jshint esversion: 8, multistr: true */
/* globals OLCore, OLSettings, OLi18n, unsafeWindow, GM_addStyle, GM_setClipboard */

// ==UserScript==
// @name           OnlineligaNLZHelper
// @namespace      https://greasyfork.org/de/users/577453
// @version        0.3.0
// @license        LGPLv3
// @description    Zusatzinfos für NLZ für www.onlineliga.de (OFA)
// @author         Tai Kahar/ KnutEdelbert
// @match          https://www.onlineliga.de
// @require        https://greasyfork.org/scripts/424896-olcore/code/OLCore.user.js
// @require        https://greasyfork.org/scripts/424896-olcore/code/OLSettings.user.js
// @grant          GM_setClipboard
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/425709/OnlineligaNLZHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/425709/OnlineligaNLZHelper.meta.js
// ==/UserScript==

/*********************************************
 * 0.1.0 29.04.2021 Release
 * 0.1.1 10.05.2021 hide NLZ Youth Player
 * 0.1.2 12.05.2021 show accumulated progress
                    Excel Export for Torny's list
 * 0.1.3 22.06.2021 Fix Excel Export Format
 * 0.1.4 05.07.2021 Bugfix for non existing Invests
 * 0.1.5 05.08.2021 Add country to Excel Export
                    Support different currency formats
 * 0.1.6 05.08.2021 Bugfix staff value
 * 0.1.7 13.20.2021 OLSettings integration
 * 0.1.8 06.12.2021 new unboxing
 * 0.2.0 24.01.2022 i18n support
 * 0.2.1 08.06.2022 Fix: position "reveal next youth player"-Button
 * 0.2.2 19.10.2022 Hotfix for youth player unboxing
 * 0.2.3 28.11.2022 Bugfix flag title hiding
 * 0.3.0 15.12.2024 Fix: hide youth Player and export youth player for OL 2.0
 *********************************************/
(function() {
    'use strict';
    const $ = unsafeWindow.jQuery;
    const t = OLi18n.text;
    const tt = OLi18n.tbtext;

    function correctYouthEfficiency()
    {

        function whichTransitionAnimationEvent(){
            const el = document.createElement('fakeelement');
            const transitions = {
                'WebkitTransition' :'webkitTransitionEnd',
                'MozTransition'    :'transitionend',
                'MSTransition'     :'msTransitionEnd',
                'OTransition'      :'oTransitionEnd',
                'transition'       :'transitionEnd',
                'animation'        :'animationEnd',
                'WebkitAnimation'  :'webkitAnimationEnd',
                'oAnimation'       :'oAnimationEnd',
                'MSAnimation'      :'MSAnimationEnd',
            };

            for(const t in transitions){
                if( el.style[t] !== undefined ){
                    return transitions[t];
                }
            }
        }

        $("#progressBar").one(whichTransitionAnimationEvent(), function(){
            const academyPercent = Math.floor(parseFloat(OLCore.convertNumber($("#progressBarYouthAcademy").attr("style"))) * 100) / 100;
            const staffPercent = Math.floor(parseFloat(OLCore.convertNumber($("#progressBarStaff").attr("style"))) * 100) / 100;
            const scoutingPercent = Math.floor(parseFloat(OLCore.convertNumber($("#progressBarScouting").attr("style"))) * 100) / 100;

            setTimeout(function(){
                $("#progressBarValue span:first-child").html(Math.floor(parseFloat($(".ol-progressbar-large").attr("data-value")) * 100) / 100 + "%");
            }, 250);
            $("#progressBarYouthAcademy").attr("title",academyPercent + "%");
            $("#progressBarYouthAcademy").append("<span style='top: 4px;'>" + academyPercent + "% </span>");
            $("#progressBarStaff").attr("title",staffPercent + "%");
            $("#progressBarStaff").append("<span style='top: 4px;'>" + staffPercent + "% </span>");
            $("#progressBarScouting").attr("title",scoutingPercent + "%");
            $("#progressBarScouting").append("<span style='top: 4px;'>" + scoutingPercent + "% </span>");
        });
    }

    function hideYouthPlayer(){

        const hideRows = [];

        $("div#youthPlayerHeader").text("Nachwuchsspieler");

        GM_addStyle(`.sprite-IDXXX{
          background: url(https://onlineliga-assets.s3.eu-central-1.amazonaws.com/country_flags/icons/country_flag_sprite_v3.png) no-repeat -287px -475px;
          width: 40px;
          height: 24px;
        }
        .nlzTextHide{
          color:transparent !important;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          border:1px solid black;
        }
        .nlzTextHide:before{
            visibility:hidden !important;
        }
        .nlzTextHide:after{
            visibility:hidden !important;
        }
				.nlzNoBreak{
					white-space: nowrap;
				}
        .nlzVisibility {
            visibility: hidden
        }
				`);

        function doHidePie(el){
            el = $(el);
            el.each(function(i,e){
                //$(e).children().css("visibility","hidden");
                //$(e).on("click",function(){$(e).children().css("visibility","");});
                $(e).children().addClass("nlzVisibility");
                $(e).on("click",function(){$(e).children().removeClass("nlzVisibility");});
            });
            el.addClass("nlzTextHide");
            el.on("click", function(){el.removeClass("nlzTextHide");});
        }
        
        function doHide(el){
            el = $(el);
            el.each(function(i,e){
                $(e).children().css("visibility","hidden");
                $(e).on("click",function(){$(e).children().css("visibility","");});
            });
            el.addClass("nlzTextHide");
            el.on("click", function(){el.removeClass("nlzTextHide");});
        }

        function doHideText(el){
            el = $(el);
            if (el && el.css){
                el.addClass("nlzTextHide");
                el.on("click", function(){el.removeClass("nlzTextHide");});
            }
        }


        $(".squad-player-category-section").each(function(i,r){
            r = $(r);
            r.removeAttr("onclick");
            r.hide();
            hideRows.push(r);
            const statDataDiv = r.find("div.squad-player-stat-data");
            const valueDataDivs = r.find("div.squad-player-value-data > div > section > div.ol-value-pie.animate");
            const statDataTextDivs = statDataDiv.find("div.squad-player-stat-data-matchdata > div > div:nth-child(2)");
            // Name
            doHideText(statDataDiv.children("div").eq(0).children("span").eq(0));
            
            // Flagge
            const flag = r.find("span.ol-teamoverview-squad-flag");
            const flagTitle = flag.parent().attr("data-content");
            flag.parent().attr("data-content","<b>???</b>");
            const flagSprite = [...r.find(".ol-teamoverview-squad-flag")[0].classList].find(c => c !== "ol-teamoverview-squad-flag" && c !== "pull-right" && c !== "sprite");
            flag.removeClass(flagSprite);
            flag.addClass("sprite-IDXXX");
            flag.on("click",function(evt){$(evt.target).removeClass("sprite-IDXXX");$(evt.target).addClass(flagSprite);flag.parent().attr("data-content",flagTitle);});
            // Alter
            doHideText(statDataTextDivs.eq(1));
            // Fuß
            doHideText(statDataTextDivs.eq(2));
            // Position
            doHideText(statDataTextDivs.eq(0));
            // Marktwert
            doHideText(statDataTextDivs.eq(3));
            // Talent
            doHidePie(valueDataDivs.eq(0));
            // Gesamt
            doHidePie(valueDataDivs.eq(1));
        });

        const btn = $(`<button class="ol-button-state ol-button-state ol-state-primary-color-${OLCore.Base.teamColorNumber}" style="margin-left:50px" type="button">${tt("Nächsten Spieler aufdecken")}</button>`).appendTo("div#youthPlayerHeader");

        $(".youth-player-new-player-table > div > div > div").addClass("nlzNoBreak");

        btn.on("click", function(evt){
            const r = hideRows.find(h => h.is(":hidden"));
            if (r){r.show();} else {$(evt.target).remove();}
        });

    }

    function showRealProgress(){
        const pbStaff = $("div#moduleStaff div.ol-tile-progress-bar");
        const staffProgress = pbStaff.attr("style") ? OLCore.round(parseFloat(pbStaff.attr("style").replace(/width\s*:\s*/,'')),2) : 0;
        pbStaff.parent().before(`<div class="ol-tile-sub" style="margin-top:20px;">${tt("Kumulierte Einarbeitung")}: ${staffProgress}%</div>`);
        pbStaff.parent().css("margin-top","5px");

        const pbScouting = $("div#moduleScouting div.ol-tile-progress-bar");
        const scoutingProgress = pbScouting.attr("style") ? OLCore.round(parseFloat(pbScouting.attr("style").replace(/width\s*:\s*/,'')),2) : 0;
        pbScouting.parent().before(`<div class="ol-tile-sub" style="margin-top:20px;">${tt("Kumulierte Einarbeitung")}: ${scoutingProgress}%</div>`);
        pbScouting.parent().css("margin-top","5px");

        const pbAcademy = $("div#moduleAcademy div.ol-tile-progress-bar");
        const academyProgress = pbAcademy.attr("style") ? OLCore.round(parseFloat(pbAcademy.attr("style").replace(/width\s*:\s*/,'')),2) : 0;
        pbAcademy.parent().before(`<div class="ol-tile-sub" style="margin-top:5px;">${tt("Effizienz")}: ${academyProgress}%</div>`);
        pbAcademy.parent().css("margin-top","5px");
    }

    function createExport(){

        async function exportNLZ(){

            const progressIndicator = OLCore.UI.progressIndicator();

            const exportData = [];
            const tld2country = {at: 'AT', ch: 'CH', de:'D', 'co.uk': 'UK'};

            const academyData = await OLCore.Api.NLZ.getAcademy();
            const pbAcademy = $("div#moduleAcademy div.ol-tile-progress-bar");
            const pbStaff = $("div#moduleStaff div.ol-tile-progress-bar");
            const pbScouting = $("div#moduleScouting div.ol-tile-progress-bar");

            const manager = OLCore.Base.userName;
            const team = OLCore.Base.teamName;
            const country = tld2country[OLi18n.topLevelDomain];
            const season = OLCore.Base.week > 37 ? OLCore.Base.season+1 : OLCore.Base.season;
            const leagueLevel = OLCore.Base.leagueLevel;
            const efficiency = parseFloat($("div#progressBarValue").children("span").eq(0).text());
            const lastEfficiency = "";
            const LZFinish = academyData.acadamy.value || 0;
            const LZEfficiency = academyData.acadamy.effinciency || 0;
            const LZExtension = academyData.extension ? academyData.extension.value : "";
            const LZExtensionProgress = academyData.extension ? academyData.extension.progress : "";
            const staffCont = $("section#moduleStaff div.ol-tile-expenditure");
            const staff = staffCont.length ? OLCore.getNum($("div#moduleStaff div.ol-tile-expenditure").children("div.ol-tile-header").text()) : 0;
            const staffProgress = (pbStaff.length ? OLCore.round(parseFloat(pbStaff.attr("style").replace(/width\s*:\s*/,'')),0) : 0) + '%';
            const scoutingCont = $("div#moduleScouting div.ol-tile-expenditure");
            const scouting = scoutingCont.length ? OLCore.getNum($("div#moduleScouting div.ol-tile-expenditure").children("div.ol-tile-header").text()) : 0;
            const scoutingProgress = (pbScouting.length ? OLCore.round(parseFloat(pbScouting.attr("style").replace(/width\s*:\s*/,'')),0) : 0) + '%';
            const count = $(".squad-player-category-section").length;

            for (const row of $(".squad-player-category-section")) {

                const r = $(row);

                const statDataDiv = r.find("div.squad-player-stat-data");
                const valueDataDivs = r.find("div.squad-player-value-data > div > section > div.ol-value-pie.animate");
                const statDataTextDivs = statDataDiv.find("div.squad-player-stat-data-matchdata > div > div:nth-child(2)");

                const talentDiv = valueDataDivs.eq(0);
                const positionDiv = statDataTextDivs.eq(0);
                const ageDiv = statDataTextDivs.eq(1);
                const youthPlayerId = r.find("button.youth-player-make-contract").attr("onclick").match(/{\s*youthPlayerId'?\s*:\s*(\d+)\s*}/)[1];
                const playerData = youthPlayerId > 0 ? await OLCore.Api.NLZ.getYouthPlayer(youthPlayerId) : null;

                const playerName = r.find("span.ol-full-name").text();
                const positions = positionDiv.text().split(",");
                const pos1 = positions.length ? positions[0].trim(): "";
                const pos2 = positions.length > 1 ? positions[1].trim(): "";
                const pos3 = positions.length > 2 ? positions[2].trim(): "";
                const age = OLCore.getNum(ageDiv.text());
                const marketvalue = OLCore.getNum(r.find("div.youth-player-marketvalue").text().replace(/\./g,''));
                const overall = OLCore.getNum(valueDataDivs.eq(1).text());
                const talent = OLCore.getNum(talentDiv.find("span.ol-value-bar-small-label-value").text());
                const salary = playerData.salary;
                const playerType = pos1 === t("TW") ? "TW" : "FS";

                exportData.push(
                    `${manager}\t${team}\t${country}\t${season}\t${leagueLevel}\t${efficiency}\t\t${LZFinish}\t${LZEfficiency}\t${LZExtension}\t${LZExtensionProgress}\t${staff}\t${staffProgress}\t${scouting}\t${scoutingProgress}\t${playerName}\t${pos1}\t${pos2}\t${pos3}\t${age}\t${overall}\t${talent}\t\t\t${salary}\t\t\t${count}\t${playerType}\t${marketvalue}`
                );

            }
            GM_setClipboard(exportData.join("\r\n"));
            const msg = count === 0? "Keine Spielerdaten gefunden" : "Spielerdaten in die Zwischenablage kopiert";
            if (progressIndicator){
                progressIndicator.end();
            }
            OLCore.info(tt(msg));
        }

        $("div#youthPlayerHeader").append(`<button class="ol-button-state ol-button-state ol-state-primary-color-${OLCore.Base.teamColorNumber}" style="margin-left:50px" type="button" id="NLZ_XLS_Export">Excel-Export</button>`);
        $("button#NLZ_XLS_Export").on("click", exportNLZ);
    }

    function run(){
        const hideYP = OLSettings.get("YouthplayerUnboxing");
        if (hideYP) { hideYouthPlayer(); }
        correctYouthEfficiency();
        showRealProgress();
        createExport();
    }

    function init(){

        GM_addStyle(".ui-dialog { z-index: 1000 !important ;}");
        GM_addStyle(".NLZ_Export_popup {width:auto; height: auto; opacity: 0.9; font-weight: bold; font-size: 20pt; color: white; background-color:grey; border: 1px solid grey; border-radius: 20px; vertical-align: middle; text-align:center; padding:20px;}");

        OLCore.waitForKeyElements (
            "div#youthPlayerHeader",
            run
        );

    }

    init();

})();