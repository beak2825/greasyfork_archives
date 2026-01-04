// ==UserScript==
// @name         Geoguessr challenge results for all friends
// @version      0.3
// @description  This fixes the default logic to only show the results of the first 26 friends you befriended. Still can't click to show their guesses though.
// @author       victheturtle#5159
// @match        https://www.geoguessr.com/*
// @license      MIT
// @grant        none
// @icon         https://www.svgrepo.com/show/27133/list.svg
// @namespace    https://greasyfork.org/users/967692-victheturtle
// @downloadURL https://update.greasyfork.org/scripts/452747/Geoguessr%20challenge%20results%20for%20all%20friends.user.js
// @updateURL https://update.greasyfork.org/scripts/452747/Geoguessr%20challenge%20results%20for%20all%20friends.meta.js
// ==/UserScript==

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const HOW_MANY_FRIENDS_UPPER_BOUND = 100;
// Upper bound means you can give a number that's higher than actual count, so that you don't have to change that value everytime you make a new friend
// Just don't set a too high value otherwise this will slow the script down and maybe even prompt geoguessr to ask if you're a robot :)

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let user_id = "";
let distance_unit = 0;
let saved_data = [];
let done = false;

async function get_preferences() {
    //if (user_id != "") return;
    let out = await fetch("https://www.geoguessr.com/api/v3/profiles")
    .then(data => data.json())
    .then(data => {
        user_id = data.user.id;
        distance_unit = data.distanceUnit;
    });
    return out;
}

function test_url() {
    if (!window.location.pathname.startsWith("/results/")) return false;
    let switch_ = document.getElementsByClassName("switch_background__C1jmR switch_show__OGOFd")[0];
    if (switch_ == null || switch_.length < 3) return false;
    return switch_.parentElement.innerText.toLowerCase() == "friends";
}

function api_url(start) {
    let token = window.location.pathname.replace("/results/", "");
    return `https://www.geoguessr.com/api/v3/results/scores/${token}/${start}/50/?friends`;
}

async function fetch_page(page) {
    return await fetch(api_url(page*50))
        .then(data => data.json())
        .then(data => {
        if (page != 0) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].userId == user_id) {
                    data.splice(i,1);
                }
            }
        }
        saved_data = saved_data.concat(data);
        return 0;
    });
}

async function fetch_all_pages() {
    saved_data = [];
    for (let i = 0; i < Math.floor((HOW_MANY_FRIENDS_UPPER_BOUND-1)/50)+1; i++) {
        let res = await fetch_page(i).then(res => {});
    }
    saved_data.sort((elt1, elt2) => (elt2.totalScore - elt1.totalScore));
    console.log("Found "+saved_data.length+" friends for this challenge");
    return saved_data;
}

function add_result_lines(data) {
    let table = document.getElementsByClassName("results_table__FHKQm")[0];
    for (let i = 0; i < data.length; i++) {
        if (2*i+2 < table.childNodes.length && get_line_id(i) == data[i].userId) {
            //console.log(i+": just setting placement");
            table.childNodes[2*i+2].firstChild.firstChild.innerHTML = `${i+1}.`
            continue;
        }
        let person = document.createElement("div");
        person.classList.add("results_row__2iTV4");
        person.innerHTML = get_result_line(i, data[i]);
        let divider = document.createElement("div");
        divider.classList.add("results_rowDivider__py9ZY");
        if (2*i+2 < table.childNodes.length) {
            //console.log(i+": insert before");
            table.insertBefore(person, table.childNodes[2*i+2]);
            table.insertBefore(divider, table.childNodes[2*i+3]);
            continue;
        }
        //console.log(i+": append");
        table.appendChild(person);
        table.appendChild(divider);
    }
    while(table.childNodes.length > 2*data.length+2) {
        table.removeChild(table.childNodes[2*data.length+2]);
    }
}

function score_string(score) {
    score = 1*score
    return `${score.toLocaleString("en-US")} ${score <= 1 ? "pt" : "pts"}`;
}

function distance_string(distance_data) {
    let distance = distance_unit == 0 ? distance_data.meters : distance_data.miles;
    return `${Math.round(distance.amount)} ${distance.unit}`;
}

function time_string(s) {
    let min = Math.floor(s/60);
    let sec = s%60;
    if (min == 0) return `${sec} sec`;
    if (sec == 0) return `${min} min`;
    return `${min} min, ${sec} sec`;
}

function get_line_id(i) {
    let link = document.getElementsByClassName("results_table__FHKQm")[0].childNodes[2*i+2].childNodes[0].childNodes[1].childNodes[0].getAttribute("href");
    if (link.startsWith("/user/")) return link.substr(6);
    else return user_id;
}

function get_result_line(i, data) {
    console.log("Adding "+data.playerName);
    let guesses = data.game.player.guesses;
    return `
  <div class="results_column__BTeok results_player__F8U_T">
    <span class="results_position__KWMOY">${i+1}.</span>
    <div class="results_userLink__V6cBI">
    <a target="_blank" href="/user/${data.userId}">
      <div class="user-nick_root__DUfvc">
        <div class="user-nick_avatar__lW3e2">
          <div class="styles_rectangle___6gqv" style="padding-top: 100%;">
            <div class="styles_circle__QFYEk styles_variantFloating__Srm_N styles_colorWhite__Y640w styles_borderSizeFactorOne__8iP_3">
              <div class="styles_rectangle___6gqv" style="padding-top: 100%;">
                <div class="styles_innerCircle__Y_L_e">
                  <div class="styles_content__otIVG">
                    <img src="/images/auto/48/48/ce/0/plain/${data.pinUrl}" class="styles_image__8M_kp" alt="${data.playerName}" loading="auto">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="user-nick_nickWrapper__8Tnk4">
          <div class="user-nick_nick__y4VIt">${data.playerName}&nbsp;</div>
        </div>
      </div>
    </a>
    </div>
  </div>
  <div class="results_column__BTeok results_hideOnSmallScreen__hrv5O">
    <div class="results_score__jUqyZ">${score_string(guesses[0].roundScoreInPoints)}</div>
    <div class="results_scoreDetails__rvWSm">${distance_string(guesses[0].distance)} - ${time_string(guesses[0].time)}</div>
  </div>
  <div class="results_column__BTeok results_hideOnSmallScreen__hrv5O">
    <div class="results_score__jUqyZ">${score_string(guesses[1].roundScoreInPoints)}</div>
    <div class="results_scoreDetails__rvWSm">${distance_string(guesses[1].distance)} - ${time_string(guesses[1].time)}</div>
  </div>
  <div class="results_column__BTeok results_hideOnSmallScreen__hrv5O">
    <div class="results_score__jUqyZ">${score_string(guesses[2].roundScoreInPoints)}</div>
    <div class="results_scoreDetails__rvWSm">${distance_string(guesses[2].distance)} - ${time_string(guesses[2].time)}</div>
  </div>
  <div class="results_column__BTeok results_hideOnSmallScreen__hrv5O">
    <div class="results_score__jUqyZ">${score_string(guesses[3].roundScoreInPoints)}</div>
    <div class="results_scoreDetails__rvWSm">${distance_string(guesses[3].distance)} - ${time_string(guesses[3].time)}</div>
  </div>
  <div class="results_column__BTeok results_hideOnSmallScreen__hrv5O">
    <div class="results_score__jUqyZ">${score_string(guesses[4].roundScoreInPoints)}</div>
    <div class="results_scoreDetails__rvWSm">${distance_string(guesses[4].distance)} - ${time_string(guesses[4].time)}</div>
  </div>
  <div class="results_column__BTeok">
    <div class="results_score__jUqyZ">${score_string(data.game.player.totalScore.amount)}</div>
    <div class="results_scoreDetails__rvWSm">${distance_string(data.game.player.totalDistance)} - ${time_string(data.game.player.totalTime)}</div>
  </div>`.replaceAll("  ","").replaceAll("\n","");
}

function try_add_result_lines(data) {
    if (done || !test_url()) return;
    if (document.getElementsByClassName("results_table__FHKQm")[0] != null) {
        done = true;
        try {add_result_lines(data);}
        catch (err) {console.log(err)};
    }
}

async function do_it() {
    done = false;
    if (!test_url()) {
        saved_data = [];
        return;
    }
    if (saved_data.length > 0) {
        try_add_result_lines(saved_data);
        return;
    }
    get_preferences()
    .then(out => fetch_all_pages())
    .then(data => {
        for (let timeout of [0,100,200,400,800,2000]) {
            setTimeout(() => {try_add_result_lines(data)}, timeout);
        }
    });


}

document.addEventListener("load", do_it(), false);
document.addEventListener("click", do_it, false);
