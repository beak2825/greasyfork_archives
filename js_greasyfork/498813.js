// ==UserScript==
// @name         Torn: Show Timers, Xade Edit
// @namespace    N/A
// @version      0.2
// @description  Just show Cooldown, Education, Hospital, Bank timers, big and clear
// @author       VQT [2599861] Edited by Xade [3217170]
// @match        https://www.torn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498813/Torn%3A%20Show%20Timers%2C%20Xade%20Edit.user.js
// @updateURL https://update.greasyfork.org/scripts/498813/Torn%3A%20Show%20Timers%2C%20Xade%20Edit.meta.js
// ==/UserScript==

var tornAPI = ""
var cooldown_timer_drug = 0
var cooldown_timer_medical = 0
var cooldown_timer_booster = 0
var hospital_timer = 0
var education_timer = 0
var bank_timer = 0
var refresh_counter = 0

function getAPI() {
    tornAPI = GM_getValue("tornApiKey");
    if(tornAPI == null || tornAPI == "") {
        var apiPrompt = prompt("Show Timers | First Time Setup | Please enter your API Key (located on the preferences page under API Key.)");
        GM_setValue("tornApiKey", apiPrompt); //Saves API Key
    }
}

function sec2str(t){
    var d = Math.floor(t/86400),
        h = ('0'+Math.floor(t/3600) % 24).slice(-2),
        m = ('0'+Math.floor(t/60)%60).slice(-2),
        s = ('0' + t % 60).slice(-2);
    return (d>0?d+'d ':'')+(h>0?h+':':'')+(m>0?m+':':'')+(t>60?s:s+'s');
}

function addUI() {
    var status_bar = $("#sidebarroot").find("div[class^='content']").find("ul[class^='status-icons']").parent()
    status_bar.append(`
    <div class="line-h24" style="font-weight: 400; font-size: .8rem;">
        <p id="cooldown-timer-drug" style="display: none">
            <b style="width: 60px; padding-right: 5px">Drug:</b>
            <span id="cooldown-timer-drug-value" style="color: red"></span>
        </p>
        <p id="cooldown-timer-medical" style="display: none">
          <b style="width: 60px; padding-right: 5px">Medical:</b>
          <span id="cooldown-timer-medical-value" style="color: red"></span>
        </p>
        <p id="cooldown-timer-booster" style="display: none">
           <b style="width: 60px; padding-right: 5px">Booster:</b>
           <span id="cooldown-timer-booster-value" style="color: red"></span>
        </p>
        <p id="education-timer" style="display: none">
           <b style="width: 60px; padding-right: 5px">Education:</b>
           <span id="education-timer-value" style="color: blue"></span>
        </p>
        <p id="hospital-timer" style="display: none">
           <b style="width: 60px; padding-right: 5px">Hospital:</b>
           <span id="hospital-timer-value" style="color: blueviolet"></span>
        </p>
        <p id="bank-timer" style="display: none">
           <b style="width: 60px; padding-right: 5px">Bank:</b>
           <span id="bank-timer-value" style="color: green"></span>
        </p>
        <hr style="height: 0; border: none; border-top: 1px solid #ccc; border-bottom: 1px solid #fff; margin-bottom: 5px;"/>
    </div>
    `)
}

function getData() {
    var dataURL = `https://api.torn.com/user/?selections=cooldowns,profile,education,money&key=` + tornAPI

    $.getJSON(dataURL, function(data){
        cooldown_timer_drug = parseInt(data.cooldowns.drug)
        cooldown_timer_medical = parseInt(data.cooldowns.medical)
        cooldown_timer_booster = parseInt(data.cooldowns.booster)

        try {
            hospital_timer = parseInt(data.status.duration)
        } catch (err) {
        }

        try {
            education_timer = parseInt(data.education_timeleft)
        } catch (err) {
        }

        try {
            bank_timer = parseInt(data.city_bank.time_left)
        } catch (err) {
        }
    })
}

function renderData() {
    // get data from server every minute
    if(refresh_counter == 0) {
        getData()
    }

    // keep track seconds in a minute
    refresh_counter++
    if(refresh_counter == 60) {
        refresh_counter = 0
    }

    // count down
    if(cooldown_timer_drug > 0) {
        cooldown_timer_drug--
        $("#cooldown-timer-drug")[0].style.display = "block"
        $("#cooldown-timer-drug-value")[0].innerText = sec2str(cooldown_timer_drug)
    } else {
        $("#cooldown-timer-drug")[0].style.display = "none"
    }

    if(cooldown_timer_medical > 0) {
        cooldown_timer_medical--
        $("#cooldown-timer-medical")[0].style.display = "block"
        $("#cooldown-timer-medical-value")[0].innerText = sec2str(cooldown_timer_medical)
    } else {
        $("#cooldown-timer-medical")[0].style.display = "none"
    }

    if(cooldown_timer_booster > 0) {
        cooldown_timer_booster--
        $("#cooldown-timer-booster")[0].style.display = "block"
        $("#cooldown-timer-booster-value")[0].innerText = sec2str(cooldown_timer_booster)
    } else {
        $("#cooldown-timer-booster")[0].style.display = "none"
    }

    if(education_timer > 0) {
        education_timer--
        $("#education-timer")[0].style.display = "block"
        $("#education-timer-value")[0].innerText = sec2str(education_timer)
    } else {
        $("#education-timer")[0].style.display = "none"
    }

    if(hospital_timer > 0) {
        hospital_timer--
        $("#hospital-timer")[0].style.display = "block"
        $("#hospital-timer-value")[0].innerText = sec2str(hospital_timer)
    } else {
        $("#hospital-timer")[0].style.display = "none"
    }

    if(bank_timer > 0) {
        bank_timer--
        $("#bank-timer")[0].style.display = "block"
        $("#bank-timer-value")[0].innerText = sec2str(bank_timer)
    } else {
        $("#bank-timer")[0].style.display = "none"
    }
}

$(window).load(function() {
    // wait for all elements loaded
    setTimeout(function(){
        getAPI()
        addUI()
        setInterval(renderData, 1000)
    }, 1000)
});
