// ==UserScript==
// @name         Final Earth Notifier
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  Notify when various Final Earth Timers are over and for troop movements.
// @author       Natty_Boh
// @include      https://www.finalearth.com/*
// @include      https://finalearth.com/*
// @grant        GM_notification
// @grant        GM.xmlHttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @connect      finalearth.com
// @downloadURL https://update.greasyfork.org/scripts/419411/Final%20Earth%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/419411/Final%20Earth%20Notifier.meta.js
// ==/UserScript==

'use strict';
setTimeout(getApi, 600);
setTimeout(addButton, 500)

//check for and insert script settings link on HQ page menu bar
function addButton() {
    if (!document.getElementById('script-settings-button') && document.querySelector(".hq_new")) {
        let elem = document.querySelector ( '.hq_new > #banner > .menu_cont' )
        let button = `<span class="hover-span" id="script-settings-button">Script Settings</span>`
        if(elem) {
            elem.insertAdjacentHTML('afterbegin', button);
            const settingsButton = document.getElementById('script-settings-button');
            settingsButton.addEventListener('click', function () {
                showScriptSettings()
            });
        }
    }
    setTimeout(addButton, 500)
}

//insert script settings form over existing content
function showScriptSettings() {
    let elem = document.querySelector ( '.hq_new' )
    elem.innerHTML = "";
    elem.insertAdjacentHTML('beforebegin', html);

    populateExistingSettings()

    const settingsButton = document.getElementById('saveSettingsButton');
        settingsButton.addEventListener('click', function () {
            setSettings()
        });
}

//save settings and redirect to HQ page so normal content will show again
async function setSettings() {
    await GM.setValue("apiKey", document.getElementById('settingKey').value)
    await GM.setValue("warTimerNotif", document.getElementById('warCheckbox').checked)
    await GM.setValue("queueNotif", document.getElementById('trainCheckbox').checked)
    await GM.setValue("reimbNotif", document.getElementById('reimbCheckbox').checked)
    await GM.setValue("eventNotif", document.getElementById('eventCheckbox').checked)
    await GM.setValue("mailNotif", document.getElementById('mailCheckbox').checked)
    await GM.setValue("countryNotif", buildCountryNotifSettings())
    await GM.setValue("userTeam", userTeam);
    await GM.setValue("currLocationNotif", document.getElementById('myLocation').checked)
    await GM.setValue("currLocationCD", document.getElementById('locationCD').value)
    window.location.href = '/HQ';
}

//prefill form with the existing settings
async function populateExistingSettings() {
    document.getElementById('settingKey').value = await GM.getValue("apiKey", "");
    document.getElementById('warCheckbox').checked = await GM.getValue("warTimerNotif", false);
    document.getElementById('trainCheckbox').checked = await GM.getValue("queueNotif", false);
    document.getElementById('reimbCheckbox').checked = await GM.getValue("reimbNotif", false);
    document.getElementById('eventCheckbox').checked = await GM.getValue("eventNotif", false);
    document.getElementById('mailCheckbox').checked = await GM.getValue("mailNotif", false);
    document.getElementById('myLocation').checked = await GM.getValue("currLocationNotif", false);
    document.getElementById('locationCD').value = await GM.getValue("currLocationCD", 5);
    populateCountryNotifSettings()

}

function buildCountryNotifSettings() {
    var setting = {
        countryId: document.getElementById('countrySelector').value,
        axis: document.getElementById('axisCheck').checked,
        allies: document.getElementById('alliesCheck').checked,
        cooldown: document.getElementById('notifCD').value
    };
    return setting;
}

async function populateCountryNotifSettings() {
    var countryNotif = await GM.getValue("countryNotif", {
        countryId: 0,
        axis: false,
        allies: false,
        cooldown: 5
    });
    document.getElementById('countrySelector').value = countryNotif.countryId
    document.getElementById('axisCheck').checked = countryNotif.axis
    document.getElementById('alliesCheck').checked = countryNotif.allies
    document.getElementById('notifCD').value = countryNotif.cooldown
}


//make api call every 30 seconds and call functions to check timer statuses
async function getApi(){
    var api = await GM.getValue("apiKey", "")
    if(api != "") {
        let url = 'http://www.finalearth.com/api/notifications?key=' + api
        GM.xmlHttpRequest({
            method: 'GET',
            url: url,
            onload: function (response) {
                if (response.status == '200') {
                    var json = JSON.parse(response.responseText)
                    if (json.reason === "invalid-api-key") {
                        console.log("Invalid api key, please add correct api key to script")
                    } else {
                        checkSettingsAndCallChecks(json)
                    }
                } else {
                    console.log("Something went wrong")
                }
            },
            onerror: function (error) {
                console.log('Something went wrong, please let Natty_Boh know')
            }
        })
        setTimeout(getApi, 30000);
    } else {
        console.log("No api key provided, please add correct api key to script")
    }
}

//check setting flags and call the relevant checks
async function checkSettingsAndCallChecks(json) {
    if (await GM.getValue("warTimerNotif", false)) {
        await warCheck(json.data.timers.war)
    }
    if (await GM.getValue("queueNotif", false)) {
        await trainingCheck(json.data.timers.statistics, json.data.training.queued.length)
    }
    if (await GM.getValue("reimbNotif", false)) {
       await reimbCheck(json.data.timers.reimbursement)
    }
    if (await GM.getValue("eventNotif", false)) {
        await checkEvent(json.data.unreadEvents)
    }
    if (await GM.getValue("mailNotif", false)) {
        await checkMail(json.data.unreadMails)
    }
    var countryObj = await GM.getValue("countryNotif", {countryId: 0,axis: false,allies: false,cooldown: 5 });
    var monitorLocation = await GM.getValue("currLocationNotif", false)
    if(monitorLocation) {
        getCountry(currentCountry => getWorldAndCheckTroops(countryObj, currentCountry));
    } else if (countryObj) {
        getWorldAndCheckTroops(countryObj, undefined);
    }
  }


async function warCheck(war) {
    var warTimer = await GM.getValue("warTimer", 0);
    if (timerEndedRecently(war, Date.now()/1000) && warTimer != war) {
        GM_notification ( {title: 'War timer up!', text: 'Your Final Earth war timer is over.'} );
        console.log("Notifcation Sent!")
        await GM.setValue("warTimer", war);
    }
}

async function trainingCheck(trainEndTime, trainQueue) {
    var trainingTimer = await GM.getValue("trainingTimer", 0);
    if (timerEndedRecently(trainEndTime, Date.now()/1000) && trainingTimer != trainEndTime && trainQueue == 0) {
        GM_notification ( {title: 'Training queue empty!', text: 'Your Final Earth stat training queue is empty.'} );
        console.log("Notifcation Sent!")
        await GM.setValue("trainingTimer", trainEndTime);
    }
}

async function reimbCheck(reimb) {
    var reimbTimer = await GM.getValue("reimbTimer", 0);
    if (timerEndedRecently(reimb, Date.now()/1000) && reimbTimer != reimb) {
        GM_notification ( {title: 'Reimbursement ready!', text: 'Your Final Earth reimbursement is ready.'} );
        console.log("Notifcation Sent!")
        await GM.setValue("reimbTimer", reimb);
    }
}

async function checkEvent(unread) {
    var getNotified = await GM.getValue("eventNotified", false)
    if (unread != 0 && getNotified == false) {
        GM_notification ( {title: 'New event!', text: 'You have a new event in Final Earth'} );
        console.log("Notifcation Sent!")
        await GM.setValue("eventNotified", true);
    } else if (unread == 0) {
        await GM.setValue("eventNotified", false);
    }
}

async function checkMail(unread) {
    var getMailNotified = await GM.getValue("mailNotified", false)
    if (unread != 0 && getMailNotified == false) {
        GM_notification ( {title: 'New message!', text: 'You have a new message in Final Earth'} );
        console.log("Notifcation Sent!")
        await GM.setValue("mailNotified", true);
    } else if (unread == 0) {
        await GM.setValue("mailNotified", false);
    }
}


//only notify if the timer has ended in the last 60 seconds
function timerEndedRecently(timer, now) {
    if (timer < now && now - timer <= 60) {
        return true
    }
    return false
}

//make world api call and call function to check troops
async function getWorldAndCheckTroops(countrySettings, currentCountry) {
    var api = await GM.getValue("apiKey", "")
    if(countrySettings.countryId != 0) {
        let url = 'http://www.finalearth.com/api/world?key=' + api
        GM.xmlHttpRequest({
            method: 'GET',
            url: url,
            onload:  function (response) {
                if (response.status == '200') {
                    var json = JSON.parse(response.responseText)
                    getCountriesToCheck(json, countrySettings, currentCountry)
                }
            },
            onerror: function (error) {
                console.log('Something went wrong')
            }
        })
    } else {
         getCountriesToCheck(undefined, countrySettings, currentCountry)
    }

}

//check all countries
async function getCountriesToCheck(json, countrySettings, currentCountry) {
    if (json) {
        json.data.forEach(country => processCountry(country, currentCountry ? currentCountry.data.id : -1, countrySettings));
    } else {
        processCountry(currentCountry.data, currentCountry.data.id, countrySettings)
    }
}

//special handling for current country and monitored country
async function processCountry(country, currentCountry, countrySettings) {
    var countryId = countrySettings.countryId
    var cooldown = await GM.getValue("currLocationCD", 5)
    if (countryId != 0 && country.id == countryId) {
        checkTroops(country, countryId, countrySettings.axis, countrySettings.allies, countrySettings.cooldown * 60);
    }
    else if (country.id == currentCountry) {
        if (await GM.getValue("userTeam") == "Allies") {
            checkTroops(country, currentCountry, true, false, cooldown * 60 );
        } else {
          checkTroops(country, currentCountry, false, true, cooldown * 60 );
        }
    } else {
        checkTroops(country, country.id, false, false, countrySettings.cooldown ? countrySettings.cooldown *60 : cooldown * 60);
    }
}

//get old troops and save new value + notify (yes I know this is gross soz I'll fix eventually)
async function checkTroops(data, countryId, axisFlag, alliesFlag, cooldown) {
    var country = JSON.parse(await GM.getValue("country" + countryId, JSON.stringify(countryConstructor(0, 0, 0, 0))))
    var axisCount = data.units.axis;
    var alliesCount = data.units.allies;
    var now = Date.now()/1000

    if(axisFlag && axisCount != country.axisCount && parseInt(now) - country.notifiedTs >= cooldown) {
        var change = data.units.axis - country.axisCount;
        var countryName = data.name
        GM_notification ( {title: 'Unit change detected!', text: 'Axis troops in ' + countryName + ' have changed by ' + change + ' units'} );
        var newCountry = countryConstructor(countryId, axisCount, alliesCount, now)
        await GM.setValue("country" + countryId, JSON.stringify(newCountry))
    }
    if(alliesFlag && alliesCount != country.alliesCount && now - country.notifiedTs >= cooldown) {
        var change2 = data.units.allies - country.alliesCount;
        var countryName2 = data.name
        GM_notification ( {title: 'Unit change detected!', text: 'Allies troops in ' + countryName2 + ' have changed by ' + change2 + ' units'} );
        var newCountry2 = countryConstructor(countryId, axisCount, alliesCount, now)
        await GM.setValue("country" + countryId, JSON.stringify(newCountry2))
    }
    if (!alliesFlag && !axisFlag) {
        var newCountry3 = countryConstructor(countryId, axisCount, alliesCount, now-cooldown)
        await GM.setValue("country" + countryId, JSON.stringify(newCountry3))
    }
}

//build country notification object
function countryConstructor(id, axis ,allies, ts) {
    var country = {
        countryId: id,
        axisCount: axis,
        alliesCount: allies,
        notifiedTs: ts
    }
    return country;
}

//make country api call and return country id
async function getCountry(callback) {
    var api = await GM.getValue("apiKey", "")
    let url = 'http://www.finalearth.com/api/country?key=' + api
        GM.xmlHttpRequest({
            method: 'GET',
            url: url,
            onload: function (response) {
                if (response.status == '200') {
                    var json = JSON.parse(response.responseText)
                    callback(json)
                }
            },
            onerror: function (error) {
                console.log('Something went wrong')
            }
        })
}

let html = `<div class="bigdiv" style="height:100%; overflow-y:auto;"><form id="frm1" style="padding-top: 25px">
      API key: <input type="text" id="settingKey"><br><br>
     <h2>Timer Notification Settings</h2>
      <input type="checkbox" id="warCheckbox"> War timer notifications <br>
      <input type="checkbox" id="trainCheckbox"> Empty training queue notifications <br>
      <input type="checkbox" id="mailCheckbox"> New Mail notifications <br>
      <input type="checkbox" id="eventCheckbox"> New Event notifications <br>
      <input type="checkbox" id="reimbCheckbox"> Reimbursement ready notifications <br>
 <br><br>
      </form>

<h2 style="  text-align: center">Current Location Monitoring</h2> <br>

      <input type="checkbox" id="myLocation"> Notify for enemy unit changes in my current location<br>
<br>  Max Notification Frequency &nbsp;<input type="text" id="locationCD">  &nbsp; Minutes<br>
<p>*Note: You will get notification immediately after a unit count change, this is a 'cooldown' to prevent notification spam if lots of changes occur quickly. </p><br>

<h2 style="  text-align: center">Unit Change Monitoring</h2> <br>

                            Specific country to monitor <select id="countrySelector" name="country">
                            <option value="0">No country monitoring</option>
                            <option value="1">Afghanistan</option>
                            <option value="2">Albania</option>
                            <option value="3">Algeria</option>
                            <option value="209">Andorra</option>
                            <option value="5">Angola</option>
                            <option value="6">Anguilla</option>
                            <option value="7">Argentina</option>
                            <option value="8">Armenia</option>
                            <option value="9">Aruba</option>
                            <option value="10">Australia</option>
                            <option value="11">Austria</option>
                            <option value="12">Azerbaijan</option>
                            <option value="13">Bahamas</option>
                            <option value="14">Bahrain</option>
                            <option value="15">Bangladesh</option>
                            <option value="16">Barbados</option>
                            <option value="17">Belarus</option>
                            <option value="18">Belgium</option>
                            <option value="19">Belize</option>
                            <option value="20">Benin</option>
                            <option value="21">Bermuda</option>
                            <option value="22">Bhutan</option>
                            <option value="23">Bolivia</option>
                            <option value="203">Bosnia</option>
                            <option value="24">Botswana</option>
                            <option value="25">Bouvet Island</option>
                            <option value="26">Brazil</option>
                            <option value="27">Brunei</option>
                            <option value="28">Bulgaria</option>
                            <option value="29">Burkina Faso</option>
                            <option value="30">Burundi</option>
                            <option value="31">Cambodia</option>
                            <option value="32">Cameroon</option>
                            <option value="33">Canada</option>
                            <option value="34">Cape Verde</option>
                            <option value="35">Cayman Islands</option>
                            <option value="204">Central African Republic</option>
                            <option value="36">Chad</option>
                            <option value="37">Chile</option>
                            <option value="38">China</option>
                            <option value="39">Colombia</option>
                            <option value="40">Comoros</option>
                            <option value="41">Costa Rica</option>
                            <option value="42">Croatia</option>
                            <option value="43">Cuba</option>
                            <option value="44">Cyprus</option>
                            <option value="45">Czech Republic</option>
                            <option value="205">Democratic Rep. of Congo</option>
                            <option value="46">Denmark</option>
                            <option value="47">Djibouti</option>
                            <option value="48">Dominica</option>
                            <option value="206">Dominican Republic</option>
                            <option value="207">East Timor</option>
                            <option value="49">Ecuador</option>
                            <option value="50">Egypt</option>
                            <option value="51">El Salvador</option>
                            <option value="52">Equatorial Guinea</option>
                            <option value="53">Eritrea</option>
                            <option value="54">Estonia</option>
                            <option value="55">Ethiopia</option>
                            <option value="56">Falkland Islands</option>
                            <option value="57">Faroe Islands</option>
                            <option value="58">Fiji</option>
                            <option value="59">Finland</option>
                            <option value="60">France</option>
                            <option value="61">Gabon</option>
                            <option value="62">Gambia</option>
                            <option value="63">Georgia</option>
                            <option value="64">Germany</option>
                            <option value="65">Ghana</option>
                            <option value="66">Gibraltar</option>
                            <option value="67">Greece</option>
                            <option value="68">Greenland</option>
                            <option value="69">Grenada</option>
                            <option value="70">Guam</option>
                            <option value="71">Guatemala</option>
                            <option value="72">Guinea</option>
                            <option value="73">Guinea Bissau</option>
                            <option value="74">Guyana</option>
                            <option value="75">Haiti</option>
                            <option value="76">Holy See</option>
                            <option value="77">Honduras</option>
                            <option value="78">Hong Kong</option>
                            <option value="79">Hungary</option>
                            <option value="80">Iceland</option>
                            <option value="81">India</option>
                            <option value="82">Indonesia</option>
                            <option value="83">Iran</option>
                            <option value="84">Iraq</option>
                            <option value="85">Ireland</option>
                            <option value="86">Israel</option>
                            <option value="87">Italy</option>
                            <option value="210">Ivory Coast</option>
                            <option value="88">Jamaica</option>
                            <option value="89">Japan</option>
                            <option value="90">Jordan</option>
                            <option value="221">Karabakh</option>
                            <option value="91">Kazakhstan</option>
                            <option value="92">Kenya</option>
                            <option value="93">Kiribati</option>
                            <option value="222">Kosovo </option>
                            <option value="94">Kuwait</option>
                            <option value="95">Kyrgyzstan</option>
                            <option value="96">Laos</option>
                            <option value="97">Latvia</option>
                            <option value="98">Lebanon</option>
                            <option value="99">Lesotho</option>
                            <option value="100">Liberia</option>
                            <option value="101">Libya</option>
                            <option value="102">Liechtenstein</option>
                            <option value="103">Lithuania</option>
                            <option value="104">Luxembourg</option>
                            <option value="105">Macau</option>
                            <option value="106">Macedonia</option>
                            <option value="107">Madagascar</option>
                            <option value="108">Malawi</option>
                            <option value="109">Malaysia</option>
                            <option value="110">Maldives</option>
                            <option value="111">Mali</option>
                            <option value="112">Malta</option>
                            <option value="113">Marshall Islands</option>
                            <option value="114">Mauritania</option>
                            <option value="115">Mauritius</option>
                            <option value="116">Mayotte</option>
                            <option value="117">Mexico</option>
                            <option value="118">Micronesia</option>
                            <option value="119">Moldova</option>
                            <option value="120">Monaco</option>
                            <option value="121">Mongolia</option>
                            <option value="208">Montenegro</option>
                            <option value="122">Montserrat</option>
                            <option value="123">Morocco</option>
                            <option value="124">Mozambique</option>
                            <option value="125">Myanmar</option>
                            <option value="126">Namibia</option>
                            <option value="127">Nauru</option>
                            <option value="128">Nepal</option>
                            <option value="129">Netherlands</option>
                            <option value="218">New Caledonia</option>
                            <option value="130">New Zealand</option>
                            <option value="131">Nicaragua</option>
                            <option value="132">Niger</option>
                            <option value="133">Nigeria</option>
                            <option value="134">Niue</option>
                            <option value="135">Norfolk Island</option>
                            <option value="136">North Korea</option>
                            <option value="225">Northern Cyprus</option>
                            <option value="137">Norway</option>
                            <option value="138">Oman</option>
                            <option value="139">Pakistan</option>
                            <option value="140">Palau</option>
                            <option value="220">Palestine</option>
                            <option value="141">Panama</option>
                            <option value="142">Papua New Guinea</option>
                            <option value="143">Paraguay</option>
                            <option value="144">Peru</option>
                            <option value="145">Philippines</option>
                            <option value="146">Pitcairn Island</option>
                            <option value="147">Poland</option>
                            <option value="148">Portugal</option>
                            <option value="149">Puerto Rico</option>
                            <option value="150">Qatar</option>
                            <option value="214">Rep. of Congo</option>
                            <option value="151">Reunion</option>
                            <option value="152">Romania</option>
                            <option value="153">Russia</option>
                            <option value="154">Rwanda</option>
                            <option value="155">Saint Helena</option>
                            <option value="156">Saint Lucia</option>
                            <option value="157">Samoa</option>
                            <option value="158">San Marino</option>
                            <option value="159">Saudi Arabia</option>
                            <option value="160">Senegal</option>
                            <option value="200">Serbia</option>
                            <option value="161">Seychelles</option>
                            <option value="162">Sierra Leone</option>
                            <option value="163">Singapore</option>
                            <option value="164">Slovakia</option>
                            <option value="165">Slovenia</option>
                            <option value="217">Solomon Islands</option>
                            <option value="166">Somalia</option>
                            <option value="224">Somaliland</option>
                            <option value="202">South Africa</option>
                            <option value="167">South Korea</option>
                            <option value="219">South Sudan</option>
                            <option value="168">Spain</option>
                            <option value="169">Sri Lanka</option>
                            <option value="170">Sudan</option>
                            <option value="171">Suriname</option>
                            <option value="172">Swaziland</option>
                            <option value="173">Sweden</option>
                            <option value="174">Switzerland</option>
                            <option value="175">Syria</option>
                            <option value="176">Taiwan</option>
                            <option value="177">Tajikistan</option>
                            <option value="178">Tanzania</option>
                            <option value="179">Thailand</option>
                            <option value="180">Togo</option>
                            <option value="181">Tokelau</option>
                            <option value="182">Tonga</option>
                            <option value="216">Trinidad and Tobago</option>
                            <option value="183">Tunisia</option>
                            <option value="184">Turkey</option>
                            <option value="185">Turkmenistan</option>
                            <option value="186">Tuvalu</option>
                            <option value="187">Uganda</option>
                            <option value="188">Ukraine</option>
                            <option value="201">United Arab Emirates</option>
                            <option value="189">United Kingdom</option>
                            <option value="190">United States</option>
                            <option value="191">Uruguay</option>
                            <option value="192">Uzbekistan</option>
                            <option value="193">Vanuatu</option>
                            <option value="194">Venezuela</option>
                            <option value="195">Vietnam</option>
                            <option value="196">Virgin Islands</option>
                            <option value="223">Western Sahara</option>
                            <option value="197">Yemen</option>
                            <option value="198">Zambia</option>
                            <option value="199">Zimbabwe</option>
                    </select><br><br>
      Team(s) unit changes to monitor <input type="checkbox" id="axisCheck">Axis &nbsp;&nbsp;&nbsp;
      <input type="checkbox" id="alliesCheck">Allies<br><br>
      Max Notification Frequency &nbsp;<input type="text" id="notifCD">  &nbsp; Minutes<br>
<p>*Note: You will get notification immediately after a unit count change, this is a 'cooldown' to prevent notification spam if lots of changes occur quickly. </p>

<br><a><button id="saveSettingsButton" class="btn_stl">Save and Close</button></a><br><br>
</div>
`



