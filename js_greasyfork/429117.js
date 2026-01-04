// ==UserScript==
// @name         Get label from Fernsehserien.de
// @version      0.7.5
// @description  Offers Fernsehserien.de labels based on the episode number or title as Wikidata label
// @author       CennoxX
// @namespace    https://greasyfork.org/users/21515
// @homepage     https://github.com/CennoxX/userscripts
// @supportURL   https://github.com/CennoxX/userscripts/issues/new?title=[Get%20label%20from%20Fernsehserien.de]%20
// @match        https://www.wikidata.org/wiki/*
// @connect      www.fernsehserien.de
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.wikidata.org
// @grant        GM.xmlHttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/429117/Get%20label%20from%20Fernsehseriende.user.js
// @updateURL https://update.greasyfork.org/scripts/429117/Get%20label%20from%20Fernsehseriende.meta.js
// ==/UserScript==
/* jshint esversion: 10 */
/* eslint quotes: ["warn", "double", {"avoidEscape": true}] */
/* eslint curly: "off" */
/* globals jQuery, $, mw */

(function(){
    "use strict";
    var wait = setInterval(()=>{
        if (typeof(mw) == "undefined"){
            return;
        }else{
            clearInterval(wait);
        }
        var correct = false;
        var fsid = "";
        var seriesId = "";
        var fsidNotSet = false;
        var itemId = mw.config.get("wbEntityId");
        if (!itemId){
            return;
        }
        function compareString(title){
            return title.trim().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/^(.*?)(?=[^\d]{2}.) ?[,:\-–]? \(?(?:(?:part|teil) )?(\d+)\)? *$/i,"$1$2").replace(/&/i, "and").replace(/^the |^a |[\u200B-\u200D\uFEFF]| |\.|'|’|\(|\)|:|,|‚|\?|!|„|“|"|‘|…|\.|—|–|-/gi,"");
        }
        async function checkTitle(ep, oldTitle, tryByNumber){
            var titles = [...ep.querySelectorAll("div:nth-child(7)>span")].map(i => i.innerText);
            var german = titles[0].replace(/^(.*?)(?=[^\d]{2}.) ?[,:\-–]? \(?(?:Teil )?(\d+)\)? *$/i,"$1 – Teil $2");
            var english = titles[1].replace(/^(.*?)(?=[^\d]{2}.) ?[,:\-–]? \(?(?:part )?(\d+)\)? *$/i,"$1, part $2");
            var deLabel = null;

            var insertElem = '<span class="wikibase-entitytermsview-aliases-alias"> ' +
                '<a class="wb-item-delabel" href="" title="Approve this label for German"></a> <span title="de" style="color:#72777d"></span></span>';
            var deLabelsDiv = $("div.wikibase-entitytermsview-labels");
            deLabelsDiv.append(insertElem);
            deLabelsDiv.find(".wb-item-delabel").click(submitDeLabel);
            return await new Promise(resolve => {
                var stopInterval = setInterval(()=>{
                    if (deLabel != null){
                        if ([...document.querySelectorAll(".wb-item-delabel")].filter(i => i.innerText==german).length==0){
                            var descr = deLabel.nextElementSibling;
                            descr.innerText = `(${english})`;
                            var titleA = compareString(oldTitle);
                            var titleB = compareString(english);
                            correct = titleA == titleB && german != "–";
                            if (!correct && !tryByNumber && german != "–" && (titleA==titleB.replace(/\d/g,"") || titleB==titleA.replace(/\d/g,""))){
                                german = german.split(" – Teil ")[0];
                                correct = true;
                            }
                            deLabel.innerText = german;
                            var color = "";
                            if (tryByNumber && correct)
                                color = "lightgreen";
                            else if (!tryByNumber && correct)
                                color = "lightyellow";
                            else
                                color = "lightpink";
                            descr.style.backgroundColor = color;
                        }
                        clearInterval(stopInterval);
                        resolve(correct);
                    }
                    var deLabels = document.querySelectorAll(".wb-item-delabel");
                    deLabel = deLabels[deLabels.length-1];
                },500);
            });
        }
        function getByTitle(ep, oldTitle, html, tryByTitle){
            var originalTitle = [...html.querySelectorAll(".episodenliste-schmal")].filter(i => {
                var titleA = compareString(i.innerText);
                var titleB = compareString(oldTitle);
                if (tryByTitle)
                    return titleA == titleB;
                else
                    return titleA.replace(/\d/g,"") == titleB.replace(/\d/g,"");
            });
            if (originalTitle.length>0)
                ep = originalTitle[0].closest("a");
            return ep;
        }
        function getByLevenshteinDistance(ep, oldTitle, html){
            var distMap = [...html.querySelectorAll(".episodenliste-schmal")].map(i => {
                var titleA = compareString(i.innerText);
                var titleB = compareString(oldTitle);
                var dist = levenshteinDistance(titleA,titleB);
                return({ep:i,dist});
            });
            var minDist = distMap.reduce(function(prev, curr){
                return prev.dist < curr.dist ? prev : curr;
            });
            console.log("levenshtein distance:",minDist.dist);
            return minDist.ep.closest("a");
        }
        function levenshteinDistance(str1, str2){
            var track = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
            for (let i = 0; i <= str1.length; i += 1){
                track[0][i] = i;
            }
            for (let j = 0; j <= str2.length; j += 1){
                track[j][0] = j;
            }
            for (let j = 1; j <= str2.length; j += 1){
                for (let i = 1; i <= str1.length; i += 1){
                    var indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
                    track[j][i] = Math.min(
                        track[j][i - 1] + 1,
                        track[j - 1][i] + 1,
                        track[j - 1][i - 1] + indicator,
                    );
                }
            }
            return track[str2.length][str1.length];
        }
        var mainLoop = setInterval(async()=>{
            if (typeof $ != "undefined"){
                if (document.querySelector(".wikibase-entitytermsforlanguageview-de .wb-empty.wikibase-labelview")){
                    var oldTitle = document.querySelector(".wikibase-title-label span")?.innerText;
                    if (oldTitle == null){
                        if (document.querySelector(".wb-empty .wikibase-title-label") == null){
                            oldTitle = document.querySelector(".wikibase-title-label")?.innerText;
                        } else {
                            oldTitle = document.querySelector('[data-property-id="P1476"] .wikibase-snakview-value span')?.innerText ?? "";
                        }
                    }
                    if (oldTitle != null){
                        clearInterval(mainLoop);
                        var season = document.querySelector('[data-property-id="P4908"] .wikibase-snakview-value')?.innerText.split("/Staffel ").pop();
                        var episode = document.querySelector('[data-property-id="P4908"] [href="/wiki/Property:P1545"]')?.closest(".wikibase-snakview").querySelector(".wikibase-snakview-value").innerText;
                        var episodeNumber = "";
                        if (episode != null)
                            episodeNumber = season+"x"+(episode[1]?"":"0")+episode;
                        var series = document.querySelector('[data-property-id="P179"] .wikibase-snakview-value a');
                        seriesId = series.href.split("/")[4];
                        var response = await fetch(`https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=claims&ids=${seriesId}`);
                        var data = await response.json();
                        fsid = data.entities[seriesId].claims.P5327?.[0].mainsnak.datavalue.value;
                        fsidNotSet = fsid == null;
                        if (fsidNotSet){
                            fsid = series.innerText.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/&/g,"and").replace(/[^a-z_\d ]/g,"").replace(/ +/g,"-");
                        }
                        var epGuide = `https://www.fernsehserien.de/${fsid}/episodenguide`;
                        var result = await GM.xmlHttpRequest({
                            method: "GET",
                            url: epGuide,
                            onload: function(response){
                                return response;
                            }
                        });
                        var html = document.createElement("div");
                        html.innerHTML = result.responseText;
                        fsid = html.querySelector('meta[property="og:url"]').content.split("/")[3];
                        var ep = null;
                        if (html.querySelector(".fs-fehlermeldung")?.innerText.includes("Fehler 404")){
                            epGuide = "https://www.fernsehserien.de/suche/" + series.innerText;
                        }
                        var deLabelsParent = $("#wb-item-" + itemId + " div.wikibase-entitytermsview-heading");
                        var deLabelsDOM = $('<div class="wikibase-entitytermsview-heading-labels">Bezeichnungen von <a id="fsLink" href="'+epGuide+'">Fernsehserien.de</a>:</div>');
                        var deLabelsDiv = $('<div class="wikibase-entitytermsview-labels"></div>');
                        deLabelsDOM.append(deLabelsDiv);
                        deLabelsParent.prepend(deLabelsDOM);
                        if (episode){
                            console.log("try by episode number");
                            ep = html.querySelector(`a[href^='/${fsid}/folgen/${episodeNumber}']`);
                            if (ep)
                            {
                                correct = await checkTitle(ep, oldTitle, true);
                            }
                        }
                        if (!correct){
                            console.log("try by title, with matching numbers");
                            ep = getByTitle(ep, oldTitle, html, true);
                            if (ep)
                            {
                                correct = await checkTitle(ep, oldTitle, false);
                            }
                        }
                        if (!correct){
                            console.log("try by title, without matching numbers");
                            ep = getByTitle(ep, oldTitle, html, false);
                            if (ep){
                                correct = await checkTitle(ep, oldTitle, false);
                            }
                        }
                        if (!correct){
                            console.log("get episode by levenshtein distance of title");
                            ep = getByLevenshteinDistance(ep, oldTitle, html);
                            if (ep){
                                correct = await checkTitle(ep, oldTitle, false);
                            }
                        }
                    }
                }
            }
        },100);

        function submitDeLabel(ev){
            ev.preventDefault();
            var selectedLabel = $(ev.target).text();
            console.log("selected de label: " + selectedLabel);

            var labels = {};
            labels.de = {
                "language": "de",
                "value": selectedLabel
            };
            setItem(itemId, JSON.stringify({
                "labels": labels,
            }), "set de label from Fernsehserien.de: " + selectedLabel );

            if (fsidNotSet){
                (async ()=>{
                    var response = await fetch(`https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=claims&ids=${seriesId}`);
                    var data = await response.json();
                    var fsidCheck = data.entities[seriesId].claims.P5327?.[0].mainsnak.datavalue.value;
                    if (fsidCheck == null){
                        setItem(seriesId, JSON.stringify({"claims":[{"mainsnak":{"snaktype":"value","property":"P5327","datavalue":{"value":fsid,"type":"string"}},"type":"statement","rank":"normal"}]}), "set ID from Fernsehserien.de: " + fsid);
                    }
                })();
            }
        }

        function setItem(itemId, data, summary){
            $.ajax({
                type: "POST",
                url: mw.util.wikiScript("api"),
                data: {
                    format: "json",
                    action: "wbeditentity",
                    id: itemId,
                    type: "item",
                    token: mw.user.tokens.get("csrfToken"),
                    data: data,
                    summary: summary,
                    exclude: "pageid|ns|title|lastrevid|touched|sitelinks"
                }
            })
                .done(function (data){
                if (data.hasOwnProperty("error")){
                    mw.notify("API Error" + JSON.stringify(data), {title: "Bezeichnung hinzufügen", tag: "fs"});
                    $("#green-box").empty();
                    $("#red-box").empty();
                    $("#red-box").append(data.error.info.replace(/\n/g, " "));
                } else {
                    $("#green-box").empty();
                    $("#green-box").append(summary);
                    mw.notify("Änderung speichern …", {title: "Bezeichnung hinzufügen", tag: "fs"});
                    window.location.reload(true);
                }
            })
                .fail(function (){
                mw.notify("API Error", {title: "Bezeichnung hinzufügen", tag: "fs"});
                $("#green-box").empty();
                $("#red-box").empty();
                $("#red-box").append("API Error");
            });
        }
    },500);
})();
