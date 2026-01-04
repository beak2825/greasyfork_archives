// ==UserScript==
// @name         Mug hunter
// @namespace    https://greasyfork.org/en/scripts/402785-mug-hunter
// @version      0.2
// @description  try to take over the world!
// @author       Pushee
// @match        *.torn.com/page.php?sid=UserList*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/402785/Mug%20hunter.user.js
// @updateURL https://update.greasyfork.org/scripts/402785/Mug%20hunter.meta.js
// ==/UserScript==

const API_KEY = 'YOUR_API_KEY_HERE';
const FILTERED_JOBS = ['surgeon', 'principal', 'federal'];
let opts = {};

let createPlayer = function(playerElement) {

    let job = $(playerElement).find(".user-icons #iconTray li.iconShow[title*='Job']");

    if (job.length >= 1) {
        job = job.prop("title").replace(/(<\/?b>)/g, "").replace(/(<\/?br>)/g, "").replace(/job/g, "").toLowerCase();
    } else {
        job = null
    }

    return {
        element: $(playerElement),
        ID: $(playerElement).attr('class').replace('user', ''),
        activity: $(playerElement).find("#iconTray li.iconShow").prop("title").replace(/(<\/?b>)/g, "").toLowerCase(),
        job: job,
        level: parseInt($(playerElement).find("span.level").text().match(/\d+/g)[0])
    }

}


let enrichPlayer = function(target) {
    $.ajax('https://api.torn.com/user/' + target.ID + '?selections=profile,personalstats&key=' + opts.apiKey).done(function(data) {

        target.personalstats = data.personalstats;
        target.last_action = data.last_action;
        target.status = data.status;
        target.life = data.life;
        target.name = data.name;

        let d=new Date();  // Gets the current time
        let nowTs = Math.floor(d.getTime()/1000); // getTime() returns milliseconds, and we need seconds, hence the Math.floor and division by 1000
        target.last_action.daysAgo = (nowTs-target.last_action.timestamp) /60/60/24 ;

        if (target.personalstats.defendslost > opts.maxLosses) {
            console.log(`${target.name}#${target.ID} hidden, too many losses - ${target.personalstats.defendslost} > ${opts.maxLosses}`);
            target.element.hide();
            return false;
        }

        if (target.last_action.daysAgo < opts.minLastOnline) {
            console.log(`${target.name}#${target.ID} hidden, too active - ${target.last_action.relative} < ${opts.minLastOnline}`);
            target.element.hide();
            return false;
        }

        if (target.status.state != 'Okay') {
            console.log(`${target.name}#${target.ID} hidden, status is not Okay - ${target.status.state} != 'Okay'`);
            target.element.hide();
            return false;
        }

        let exData = $('<li class="mh-data" />');
        exData.html(`Losses: <strong>${target.personalstats.defendslost}</strong><br/>
                     lastOnline: <strong>${target.last_action.relative}</strong><br/>
                     Networth: <strong>${formatCurrency(target.personalstats.networth)}</strong><br/>`);
        exData.insertAfter(target.element);
    });


    return target;
};

let filterPlayers = function() {

    // clear old data
    $('.mh-data').remove();

    // loop through user items
    $(".user-info-list-wrap").children().each(function() {

        // show them if we are resetting
        $(this).show();

        if ($(this).hasClass('last')) {
            console.log('no players yet.');
            return false;
        }

        // get pojo of player
        let player = createPlayer(this);

        // flag
        let filterCurrent = true;

        // filter based on job
        if (opts.filterJobs) {

            // filter by job
            $(FILTERED_JOBS).each(function(job) {

                if (player.job == null) {
                    filterCurrent = true;
                    return false;
                }

                if (player.job.indexOf(FILTERED_JOBS[job]) >= 0) {
                    filterCurrent = false;
                    return false;
                }

            })

        }

        // filter based on travel status
        if (filterCurrent) {
            player.element.hide();
        } else {
            player = enrichPlayer(player)
        }

    });
};

let formatCurrency = function(num){
    var str = num.toString().replace("$", ""), parts = false, output = [], i = 1, formatted = null;
    if(str.indexOf(".") > 0) {
        parts = str.split(".");
        str = parts[0];
    }
    str = str.split("").reverse();
    for(var j = 0, len = str.length; j < len; j++) {
        if(str[j] != ",") {
            output.push(str[j]);
            if(i%3 == 0 && j < (len - 1)) {
                output.push(",");
            }
            i++;
        }
    }
    formatted = output.reverse().join("");
    return("$" + formatted + ((parts) ? "." + parts[1].substr(0, 2) : ""));
};

let saveOpts = function() {
    console.log('Saving opts');
    opts = {
            apiKey: API_KEY,
            filterJobs: $('#mh-filterJob').attr('checked') == 'checked',
            maxLosses: $('#mh-filterLosses').val(),
            minLastOnline: $('#mh-filterLastOnline').val()
        };

    GM_setValue('storedOpts', opts)

    filterPlayers();
}

let injectFilterBar = function() {

    let bar = $(`
    <div class=" title-black top-round m-top10 mh-filterbar">
        <span class="mh-border-right">MugHunter</span>
        <span><label for="mh-filterJob">filter on jobs: </label><input type="checkbox" id="mh-filterJob" name="mh-filterJob" value="filterJob" ${opts.filterJobs == true ? "checked" : ""}></span>
        <span>max losses <input type="textbox" id="mh-filterLosses" value="${opts.maxLosses}"></span>
        <span>min last online <input type="textbox" id="mh-filterLastOnline" value="${opts.minLastOnline}"></span>
    </div>`)

    bar.insertBefore('.users-list-title');

    $(bar).find('input').change(saveOpts);

};

let populateOpts = function() {
    let loadedOpts = GM_getValue('storedOpts', {});
    console.log('loaded opts');
    if (loadedOpts.hasOwnProperty('apiKey')) {
        console.log('opts are good, using loaded opts');
        return loadedOpts;
    } else {
        console.log('opts are not good, using defaults');
        return {
            apiKey: API_KEY,
            filterJobs: true,
            maxLosses: 100,
            minLastOnline: 1000
        };
    }
}

let addStyles = function() {
    GM_addStyle(`

li.mh-data {
    position: relative;
    color: black;
    font-size: 1em!important;
    margin-right: 6px;
    height: 100%;
    padding-left: 276px;
    line-height: 1.5em;
}
.mh-filterbar {
    border-radius: 5px!important;
    height: auto!important;
}

.mh-filterbar span {
    padding: 0px 6px;
}
.mh-border-right {
    border-right:  2px solid #ccc;
}
.mh-filterbar input[type=checkbox] {

}
.mh-filterbar input[type=textbox] {
    height: 60%;
    padding-left: 6px;
    width: 50px;
    border-radius: 2px;
}

.pagination-wrap {
    // visibility: hidden;
}


@media only screen and (max-width: 1000px) {

.mh-filterbar {
padding: 4px;
}

li.mh-data {
    padding-left: 6px;
}

.mh-filterbar span {
    padding: 2px;
    display: block;
    width: 90%;
    line-height: 1.8em!important;
}

.mh-border-right {
    border-right: 0px solid #ccc;
    border-bottom: 2px solid #ccc;
    margin-bottom: 3px;
}

}

    `);
};


let init = function() {
    console.log("Init muggotron");

    // inject styles
    addStyles();

    // get opts
    opts = populateOpts();

    // inject filter bar
    injectFilterBar();

    // save opts
    saveOpts();

    // piggyback off ajax completion events, check that it is for this page
    $( document ).ajaxComplete(function(event, resp, params) {
        if (params.url.indexOf('https://www.torn.com/page.php') == 0) {
            filterPlayers();
        }
    });
};


// inject styles
// attach event listener to document ready
$(document).ready(function () {
    'use strict';
    init();
})

