// ==UserScript==
// @name         Death Screen Faker (Hide with J)
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  very userfriendly script to fake your final score
// @author       r!PsAw
// @match        https://diep.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512271/Death%20Screen%20Faker%20%28Hide%20with%20J%29.user.js
// @updateURL https://update.greasyfork.org/scripts/512271/Death%20Screen%20Faker%20%28Hide%20with%20J%29.meta.js
// ==/UserScript==
window.faker = true;
var legit_mode = false;
var buttons_hidden = false;

document.onkeydown = function (e) {
    if(e.key === "J" || e.key === "j"){
        buttons_hidden = !buttons_hidden;
        hide_or_show_btns();
    }
}
const pointsNeeded = [
  0, 4, 13, 28, 50, 78, 113, 157, 211, 275,
  350, 437, 538, 655, 787, 938, 1109, 1301,
  1516, 1757, 2026, 2325, 2658, 3026, 3433,
  3883, 4379, 4925, 5525, 6184, 6907, 7698,
  8537, 9426, 10368, 11367, 12426, 13549,
  14739, 16000, 17337, 18754, 20256, 21849,
  23536, Infinity //this one is not lvl 46, just a value to make my code work
];
const tier = [undefined, 0, 15, 30, 45];

let original = {score: null, selected_tank: null, level: null, time: null, killer_name: null};
let fake = {score: null, selected_tank: null, level: null, time: null, killer_name: null};

function main(){
    if(document.querySelector("#game-over-screen").classList.contains("active")){
        window.__common__.tanks.sort((a, b) => a.id - b.id);
        if(original.score === null && original.selected_tank === null && original.level === null && original.time === null && original.killer_name === null){
            save_original_values();
        }
        if(target_cont && !document.getElementById(my_buttons[0][1])){
            create_my_buttons();
        }
        legitimate_fake_values();
        apply_values();
    }else{
        forget_fake_values();
    }
}

setInterval(main, 500);

let target_cont = document.querySelector("#game-over-footer")
let my_buttons = [["score", "score-change"], ["killed by", "killer-name"], ["Level", "lvl-change"], ["Time", "final-time"], ["Tank", "tank-change"], ["Legit?", "fake2legit"]];
function create_my_buttons(){
    let player_color = window.getComputedStyle(document.querySelector("#game-over-continue")).backgroundColor
    for(let i = 0; i<my_buttons.length; i++){
        create_btn(my_buttons[i][0], player_color, my_buttons[i][1]);
    }
}

function forget_fake_values(){
    fake = {score: null, selected_tank: null, level: null, time: null, killer_name: null};
}

function create_btn(text, color, id){
 let new_btn = document.createElement("div");
 new_btn.id = id;
 new_btn.innerHTML = text;
 new_btn.style.width = "50px";
 new_btn.style.backgroundColor = color;
 new_btn.classList.add("action-button");
 target_cont.appendChild(new_btn);
 new_btn.onclick = () => {
     if(id === "fake2legit"){
       legit_mode = !legit_mode;
     }else{
       handle_ids(id);
     }
 };
}

function handle_ids(id){
    const isNumeric = (string) => /^[+-]?\d+(\.\d+)?$/.test(string);
    switch (id){
        case my_buttons[0][1]:{
            // score
            let click_response = prompt("Enter the score");
            isNumeric(click_response) ? fake.score = parseFloat(click_response) : alert("please enter a number");
        }
            break;
        case my_buttons[1][1]:{
            // killer name
            let click_response = prompt("Enter the killer name");
            fake.killer_name = click_response;
    }
            break;
        case my_buttons[2][1]:{
            // level
            let click_response = prompt("Enter the new value");
            isNumeric(click_response) ? fake.level = parseFloat(click_response) : alert("please enter a number");
        }
            break;
        case my_buttons[3][1]:{
              // time
              let hours = prompt("Enter Hours");
              let mins = prompt("Enter Minutes");
              let secs = prompt("Enter Seconds");
              let click_response = convert_time(hours, mins, secs);
              isNumeric(click_response) ? fake.time = parseFloat(click_response) : alert("please enter a number");
            }
            break;
        case my_buttons[4][1]:{
            let new_tank_str = prompt("Enter Tank name");
            let click_response = name2id(new_tank_str);
            // tank
            isNumeric(click_response) ? fake.selected_tank = parseFloat(click_response) : alert("please enter a valid tank name");
        }
            break;
    }
    console.log(fake);
}


function save_original_values(){
    original.score = window.__common__.death_score;
    original.selected_tank = window.__common__.death_tank ;
    original.level = window.__common__.death_level;
    original.time = window.__common__.death_life_time;
    original.killer_name = window.__common__.killer_name;
}

CanvasRenderingContext2D.prototype.fillText = new Proxy(CanvasRenderingContext2D.prototype.fillText, {
    apply(fillRect, ctx, [text, x, y, ...blah]) {
        if(window.__common__.killer_name != original.killer_name && fake.killer_name != null){
            if(text === original.killer_name){
                text = fake.killer_name;
            }
        }
        fillRect.call(ctx, text, x, y, ...blah);
    }
});

CanvasRenderingContext2D.prototype.strokeText = new Proxy(CanvasRenderingContext2D.prototype.strokeText, {
    apply(strokeRect, ctx, [text, x, y, ...blah]) {
        if(window.__common__.killer_name != original.killer_name && fake.killer_name != null){
            if(text === original.killer_name){
                text = fake.killer_name;
            }
        }
        strokeRect.call(ctx, text, x, y, ...blah);
    }
});

function hide_or_show_btns(){
    if(buttons_hidden){
     for(let i = 0; i<my_buttons.length; i++){
         document.getElementById(my_buttons[i][1]).style.display = "none";
     }
    }else{
     for(let i = 0; i<my_buttons.length; i++){
        document.getElementById(my_buttons[i][1]).style.display = "";
     }
    }
}

function legitimate_fake_values(){
    if(legit_mode){
        fake.score = Math.floor(fake.score);
        fake.level = Math.floor(fake.level);
        fake.time = Math.floor(fake.time);

        //keep level between 1 and 45
        if(fake.level != null && fake.score != null){
            if(fake.level > 45){
                fake.level = 45
            }else if(fake.level < 1){
                fake.level = 1;
            }

        //relations between score and level
            if(fake.score > pointsNeeded[fake.level]){
                fake.score = pointsNeeded[fake.level] - 1;
            }else if(fake.score < pointsNeeded[fake.level] && pointsNeeded[fake.level] != Infinity){
                fake.score = pointsNeeded[fake.level] + 1;
            }else if(fake.level === 45 && fake.score < pointsNeeded[44]){
                fake.score = pointsNeeded[44];
            }
        }

        //keep name shorter than 15 characters
        if(fake.killer_name != null){
            if(fake.killer_name.length > 15){
                fake.killer_name.substring(0, 15);
            }
        }

        //tank id should be between 0 and last tank id
        if(fake.selected_tank != null){
            if(fake.selected_tank < 0){
                fake.selected_tank = 0;
            }else if(fake.selected_tank > window.__common__.tanks.length){
                fake.selected_tank = window.__common__.tanks.length;
            }
        }

        //tank id should correspond to it's level
        if(fake.level != null && fake.selected_tank != null){
            if(fake.level < tier[window.__common__.tanks[fake.selected_tank].tier]){
                fake.level = tier[window.__common__.tanks[fake.selected_tank].tier];
                if(pointsNeeded[fake.level] != Infinity){
                  fake.score = pointsNeeded[fake.level]+1;
                }else{
                  fake.score = pointsNeeded[44];
                }
            }
        }

        //time should not be negative
        if(fake.time != null){
            // realistic ratio + randomised
            let max = fake.score > 270 ? 270 : fake.score;
            let min = 1;
            let random_ratio = Math.random() * (max - min) + min;
            fake.time = fake.score / random_ratio;
        }

        //reward value correction
        if(fake.level != null){
          let n;
          let e = fake.level;
          let reward_level = Math.floor((n = .2 * e) < 2 ? 2 : n > 45 ? 45 : n);
          document.querySelector("#game-over-video-ad-reward").innerHTML = reward_level;
        }
    }
}

function name2id(name){
    let found_id;
    for(let i = 0; i < window.__common__.tanks.length; i++){
        if(name === window.__common__.tanks[i].name){
            found_id = window.__common__.tanks[i].id;
        }
    }
    return found_id;
}

function convert_time(hours, minutes, seconds){
    hours = Number(hours);
    minutes = Number(minutes);
    seconds = Number(seconds);
    if(hours > 60 || minutes > 60 || seconds > 60){
        return alert("please use a number below 60");
    }
    if(hours < 0 || minutes < 0 || seconds < 0){
        return alert("please don't use negative numbers");
    }
    let final_time = (hours*3600)+(minutes*60)+seconds;
    return final_time;
}

function apply_values(){
    if (fake.score != null) window.__common__.death_score = fake.score;
    if (fake.selected_tank != null) window.__common__.death_tank = fake.selected_tank;
    if (fake.level != null) window.__common__.death_level = fake.level;
    if (fake.time != null) window.__common__.death_life_time = fake.time;
    if (fake.killer_name != null) window.__common__.killer_name = fake.killer_name;
}