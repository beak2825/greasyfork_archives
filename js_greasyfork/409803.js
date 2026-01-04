// ==UserScript==
// @name         FTP+
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  FromThePavilion Plus
// @author       Ishu
// @match        https://www.fromthepavilion.org/*
// @grant        unsafeWindow
// @require      https://cdn.jsdelivr.net/npm/moment@2.27.0/min/moment-with-locales.min.js
// @require      https://cdn.jsdelivr.net/npm/moment-timezone@0.5.31/builds/moment-timezone-with-data.min.js
// @require      https://cdn.jsdelivr.net/npm/countdown@2.6.0/countdown.min.js
// @require      https://cdn.jsdelivr.net/npm/moment-countdown@0.0.3/dist/moment-countdown.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/409803/FTP%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/409803/FTP%2B.meta.js
// ==/UserScript==


(function() {
    'use strict';
    window.SKILL_MAP = {
        "atrocious": 0.5,
        "atroc": 0.5,
        "dreadful": 1,
        "dread": 1,
        "poor": 2,
        "ordinary": 3,
        "ordin": 3,
        "average": 4,
        "avg": 4,
        "reasonable": 5,
        "reas": 5,
        "capable": 6,
        "capab": 6,
        "reliable": 7,
        "reli": 7,
        "accomplished": 8,
        "accom": 8,
        "expert": 9,
        "exprt": 9,
        "outstanding": 10,
        "outs": 10,
        "spectacular": 11,
        "spect": 11,
        "exceptional": 12,
        "excep": 12,
        "world class": 13,
        "world": 13,
        "elite": 14,
        "legendary": 15,
        "legen": 15
    }

    const title = document.title.replace(/From the Pavilion - /g, "")
    document.title = title

    if(document.URL.indexOf('https://www.fromthepavilion.org/player.htm?playerId=') !== -1)
        playerPagePlus()
    if(document.URL.indexOf('.htm?squadViewId=2') !== -1)
        squadGridPlus()
    // https://www.fromthepavilion.org/commentary.htm?gameId=*
    if(document.URL.indexOf('https://www.fromthepavilion.org/commentary.htm?gameId=') !== -1)
        commentaryPlus()
    if(document.URL.indexOf('https://www.fromthepavilion.org/transfer.htm') !== -1)
        addTimeToTransfer()
    if(document.URL.indexOf('https://www.fromthepavilion.org/leagueoverview.htm') !== -1)
        addMatchRatings()
})();

function addMatchRatings() {
    $("#middle > table:nth-child(4) > thead > tr > th:nth-child(2)").after("<th>Rating</th>")
    $("#middle > table:nth-child(4) > tbody > tr > td:nth-child(2)").each(function(){
        $(this).after("<td class='matchRatings'>Loading...</td>")
    })

    $("#middle > table:nth-child(4) > thead > tr > th:nth-child(10)").remove()
    $("#middle > table:nth-child(4) > thead > tr > th:nth-child(10)").remove()
    $("#middle > table:nth-child(4) > tbody > tr > td:nth-child(10)").remove()
    $("#middle > table:nth-child(4) > tbody > tr > td:nth-child(10)").remove()

    window.ratings = {}
    $("#middle > div.left.marg-top > table > tbody > tr > td:nth-child(1) > a").each(function(){
        getMatchRatings($(this).attr("href").split("=")[1])
    })
}

function getMatchRatings(gameId) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://www.fromthepavilion.org/ratings.htm?gameId=' + gameId,
        onload: function(resp){
            const text = resp.responseText.split("Match Ratings</h2>")[1].split("</div>")[0]
            const team1 = text.split("teamId=")[1].split("\"")[0]
            const team2 = text.split("teamId=")[2].split("\"")[0]
            const mR1 = parseInt(text.split("Overall")[1].split(">")[2].split("<")[0].replace(/,/g, ""))
            const mR2 = parseInt(text.split("Overall")[1].split(">")[4].split("<")[0].replace(/,/g, ""))
            window.ratings[team1] = numberWithCommas(mR1)
            window.ratings[team2] = numberWithCommas(mR2)
            $("#middle > table:nth-child(4) > tbody > tr").each(function(){
                const team = $($(this).children("td")[1]).children("a").attr("href").split("=")[1]
                $(this).children("td")[2].innerHTML = ratings[team] || "Loading"
            })
        }
    });
}

function addTimeToTransfer() {
    const timeDOM = $("#transfers > tbody > tr > td:nth-child(3)").each(function(){
        const times = $(this)[0].innerHTML.split("<br>");
        const date = times[0];
        const time = times[1];
        const momDate = moment.utc(date, "DD MMM YYYY");
        momDate.set({"hour": time.split(":")[0], "minute": time.split(":")[1]});
        $(this)[0].innerHTML += "<br>";
        $(this)[0].innerHTML += momDate.tz("Asia/Kolkata").format("hh:mm A");
        $(this)[0].innerHTML += "<br>";
        $(this)[0].innerHTML += momDate.fromNow()
    })
}

function commentaryPlus() {
    window.commentary = []
    $("#commentary").children().each(function() {
        commentary.push($(this)[0].outerHTML)
    });
    $("#commentary")[0].innerHTML = "";

    var showAll = $('<input type="button" value="Show All" />');
    $("#commentary").after(showAll)

    showAll.on('click',function(){
        while(commentary.length > 0) {
            addToCommentary(commentary.shift())
            window.scrollTo(0,0);
        }
    })

    var addSix = $('<input type="button" value="Add Six" />');
    $("#commentary").after(addSix)

    addSix.on('click',function(){
        addToCommentary(commentary.shift())
        addToCommentary(commentary.shift())
        addToCommentary(commentary.shift())
        addToCommentary(commentary.shift())
        addToCommentary(commentary.shift())
        addToCommentary(commentary.shift())
        window.scrollTo(0,document.body.scrollHeight)
    })

    playCommentary()
}

async function playCommentary() {
    while(commentary.length > 0) {
        addToCommentary(commentary.shift())
        window.scrollTo(0,document.body.scrollHeight);
        await timeout(2000)
    }
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function addToCommentary(newInput) {
    $("#commentary")[0].innerHTML += newInput;
}

function squadGridPlus() {
    playersFromGrid().each(function(){
        $(this).children(".skills").each(function(){
            const skill = skillNumFromStr($(this)[0].innerText);
            if($(this).children("span").length) {
                if($(this).children("span").hasClass("skillup")) {
                    $(this).css('background-color', 'lightgreen')
                }
                if($(this).children("span").hasClass("skilldown")) {
                    $(this).css('background-color', 'lightred')
                }
            }
            $(this)[0].innerText = Math.floor(skill) ;
        })
    })
}

function skillNumFromStr(skill) {
    return SKILL_MAP[skill] || -1;
}

function playerPagePlus() {
    const skills = $("#middle > div.panel > table > tbody > tr > td.skills > img.skilllevel");
    let totalSkills = 0;
    skills.each(function() {
        const skill = getSkillFromSrc($(this)[0].src);
        totalSkills += skill
        $(this).after(`<span>${Math.floor(skill)} - </span>`);
    })

    let output = "<th>Total Skills</th>"
    output += "<td>" + totalSkills + "</td>"
    output += "<th>Spare Ratings</th>"
    output += "<td>" + numberWithCommas(spareRating()) + ` (${Math.floor(spareRating() / 70)}%)` + "</td>"

    $("#middle > div.panel > table > tbody > tr > td.skills").parent().parent().after(output)



    const times = $("#obj > div > p:nth-child(1)")[0].innerText.split(" ")
    const date = `${times[1]} ${times[2]} ${times[3]}`;
    const time = times[4];
    const momDate = moment.utc(date, "DD MMM YYYY");
    momDate.set({"hour": time.split(":")[0], "minute": time.split(":")[1]});
    $($("#obj > div > p:nth-child(1)")[0]).after(`<p>IST Deadline: ${momDate.tz("Asia/Kolkata").format("hh:mm A")} ${momDate.fromNow()}</p>`)
}

function playersFromGrid() {
    return $("#squad > tbody > tr")
}

function getSkillFromSrc(src) {
    const skill = parseInt(src.split("bar")[1])
    return skill == 0 ? 0.5 : skill;
}

function spareRating() {
    return rating() - totalRating();
}

function totalRating() {
    const skills = $("#middle > div.panel > table > tbody > tr > td.skills > img.skilllevel");
    let totalSkills = 0;
    skills.each(function() {
        const skill = getSkillFromSrc($(this)[0].src);
        totalSkills += skill
    })

    return totalSkills * 1000;
}

function rating() {
    return parseInt($("#middle > div.left > div > div > p:nth-child(1)")[0].innerText.split("|")[1].trim().replace(/,/g, ""))
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}