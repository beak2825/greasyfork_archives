// ==UserScript==
// @name         Fancy Script!
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fncy Script is a script for Agma.io that is adding some amazing features to the game itself. Enjoy!
// @author       Venem
// @match        https://agma.io/*
// @connect      shell-crystal-nebula.glitch.me
// @connect      agreeable-grizzly-glade.glitch.me
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/483031/Fancy%20Script%21.user.js
// @updateURL https://update.greasyfork.org/scripts/483031/Fancy%20Script%21.meta.js
// ==/UserScript==





//   _____       __                           _   _
//  |_   _|     / _|                         | | (_)
//    | | _ __ | |_ ___  _ __ _ __ ___   __ _| |_ _  ___  _ __
//    | || '_ \|  _/ _ \| '__| '_ ` _ \ / _` | __| |/ _ \| '_ \
//   _| || | | | || (_) | |  | | | | | | (_| | |_| | (_) | | | |
//   \___/_| |_|_| \___/|_|  |_| |_| |_|\__,_|\__|_|\___/|_| |_|
// ---------------------------------------------------------------------
// Made by Venem
// Discord: venem.
// My community server: https://discord.gg/GWDXdr9RVw
//
// Its important for me, to provide a safe userscript that got helpful features.
// If you have any questions about the script, issues installing it, or you need help with anything else, feel free to always reach out to me on Discord.
//
// Have suggestions on what to add to the script? Let me know!

class Writer{constructor(t){this.buffer=new DataView(new ArrayBuffer(t)),this.position=0,this.littleEndian=!0}setString(t){for(let i=0;i<t.length;i++)this.setUint16(t.charCodeAt(i));return this}setInt8(t){return this.buffer.setInt8(this.position++,t),this}setUint8(t){return this.buffer.setUint8(this.position++,t),this}setInt16(t){return this.buffer.setInt16((this.position+=2)-2,t,this.littleEndian),this}setUint16(t){return this.buffer.setUint16((this.position+=2)-2,t,this.littleEndian),this}setInt32(t){return this.buffer.setInt32((this.position+=4)-4,t,this.littleEndian),this}setUint32(t){return t%1!=0&&88==t.toString().slice(-2)&&(t+=2),this.buffer.setUint32((this.position+=4)-4,t,this.littleEndian),this}setFloat32(t){return this.buffer.setFloat32((this.position+=4)-4,t,this.littleEndian),this}setFloat64(t){return this.buffer.setFloat64((this.position+=8)-8,t,this.littleEndian),this}send(t){return _0x5633b5||t?_0x8f04cb.call(_0x27cb81,this.buffer):void 0}}

let send;

const osend = WebSocket.prototype.send
WebSocket.prototype.send = function () {
    send = (...args) => osend.call(this, ...args)
    return osend.apply(this, arguments)
};

unsafeWindow.login = (id, pass) => {

    var buff = new Writer(5 + 2 * id.length + 2 * pass.length)

    buff.setUint8(2)

    buff.setString(id)

    buff.setUint16(0)

    buff.setString(pass)

    buff.setUint16(0)

    send(buff.buffer);

    console.log(id, pass);
}


window.addEventListener("load", (event) => {
(function () {
    'use strict';


    var fancySettingsTab = document.createElement('div');
    fancySettingsTab.id = 'settingPage5';
    fancySettingsTab.className = 'setting-tabcontent';
    fancySettingsTab.style.display = 'none';

    var fancySettingsContent = document.createElement('div');
    fancySettingsContent.innerHTML = `
        <h2 id="fancySettingsHeader" class="animated-text">Fancy Settings</h2>

        <div class="row" style="padding: 1px 0; font-size: 14px; white-space: nowrap;">
            <div class="col-md-6" style="width: 50%; padding: 17px; margin: 0; overflow: hidden;">
                <h4>Profile Settings</h4>
                <label><input id="goldMemberCheckbox" type="checkbox"> <span class="checkbox-label gold-member" style="font-size: 12px; color: grey;">Goldmember</span></label><br>
                <label><input id="redDonoCheckbox" type="checkbox"> <span class="checkbox-label red-dono" style="font-size: 12px; color: grey;">Red Dono</span></label><br>
                <label><input id="blueDonoCheckbox" type="checkbox"> <span class="checkbox-label blue-dono" style="font-size: 12px; color: grey;">Blue Dono</span></label><br>
                <label><input id="greenDonoCheckbox" type="checkbox"> <span class="checkbox-label green-dono" style="font-size: 12px; color: grey;">Green Dono</span></label><br>
                <label><input id="youtubeCheckbox" type="checkbox"> <span class="checkbox-label youtube" style="font-size: 12px; color: grey;">YouTube</span></label><br>
                <label><input id="newCheckbox1" type="checkbox"> <span class="checkbox-label new-checkbox-1" style="font-size: 12px; color: grey;">Challenge Level</span></label><br>
                <label><input id="newCheckbox2" type="checkbox"> <span class="checkbox-label new-checkbox-2" style="font-size: 12px; color: grey;">Auto Continue (soon)</span></label><br>
                <h4>Fast-T-Split</h4>
                <label><input id="fastSpitCheckbox" type="checkbox"> <span class="checkbox-label fastSplit" style="font-size: 12px; color: grey;">Fast-T-Split</span></label><br>
            </div>
            <div class="col-md-6" style="width: 50%; padding: 17px; margin: 0; overflow: visible;">
                <h4>Skin/Wearable</h4>
                <label><input id="animatedSkinCheckbox" type="checkbox"> <span class="checkbox-label animated-skin" style="font-size: 12px; color: grey;">Animated Skin</span></label><br>
                <label>
                    <input id="showHiddenWearablesCheckbox" type="checkbox">
                    <span class="checkbox-label show-hidden-wearables" style="font-size: 12px; color: grey;">Show All Wearables</span>
                    <i class="fa fa-question-circle" aria-hidden="true" style="font-size: 15px; cursor: pointer; margin-left: 5px;" onclick="swal('Hidden Wearables!', 'This option lets you see all wearables in the wearables tab, also the ones that are normally hidden. IMPORTANT: Make sure to open the wearable tab once before turning on the option to see it.');"></i>
                </label>
                <br>
                <h4>XP Goal Settings</h4>
                <label>
                    <input id="control1Checkbox" type="checkbox">
                    <span class="checkbox-label control-1" style="font-size: 12px; color: grey;">XP Goal Setup</span>
                    <i class="fa fa-question-circle" aria-hidden="true" style="font-size: 15px; cursor: pointer; margin-left: 5px;" onclick="swal('XP Goals', 'Here you can set up a xp goal and can display how much more you need to reach that goal. And mind that the script is including in its calculations, that you need more xp the higher your level is. This feature is not fully done yet and will become better in the following updates.');"></i>
                </label>
                <br>
                <label><input id="control2Checkbox" type="checkbox"> <span class="checkbox-label control-2" style="font-size: 12px; color: grey;">Show Progress Bar</span></label><br>
                <h4>Extras</h4>
                <label>
                    <input id="md5login" type="checkbox">
                    <span class="checkbox-label md5login" style="font-size: 12px; color: grey;">MD5 Login</span>
                    <i class="fa fa-question-circle" aria-hidden="true" style="font-size: 15px; cursor: pointer; margin-left: 5px;" onclick="swal('MD5 Login', 'MD5 login lets you log into an account using its username and MD5.');"></i>
                </label>
                <br>
                <label><input id="publicAccounts" type="checkbox"> <span class="checkbox-label publicAccounts" style="font-size: 12px; color: grey;">Public Account Login</span></label><br>
                <h4>Developer (Soon)</h4>
                <label><input id="coordinateOverlay" type="checkbox"> <span class="checkbox-label coordinates" style="font-size: 12px; color: grey;">Coordinate Overlay</span></label><br>
                <label><input id="mapWidthOverlay" type="checkbox"> <span class="checkbox-label width" style="font-size: 12px; color: grey;">Map Width Overlay</span></label><br>
            </div>
        </div>

        <div class="row" style="padding: 5px 0; white-space: nowrap;">
            <button type="button" id="greenButton" style="color: #fff; background-color: #4CAF50; border-color: #175c1a; margin-right: 20px;" class="btn btn-success pull-right">Support/Contact</button>
        </div>
    `;

    var fancySettingsHeader = fancySettingsContent.querySelector('#fancySettingsHeader');
    fancySettingsHeader.style.marginTop = '70px';
    fancySettingsHeader.style.fontWeight = 'bold';
    fancySettingsHeader.style.color = 'purple';
    fancySettingsHeader.style.textAlign = 'center';
    fancySettingsHeader.style.fontSize = '24px';
    fancySettingsHeader.style.animation = 'colorChange 3s infinite, glow 3s infinite, shadow-pulse 3s infinite';
    fancySettingsHeader.style.textShadow = '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px #ff00e4, 0 0 70px #ff00e4, 0 0 80px #ff00e4, 0 0 100px #ff00e4';

    fancySettingsTab.appendChild(fancySettingsContent);

    var existingTabsContainer = document.querySelector('.setting-tabs');
    var newTabButton = document.createElement('button');
    newTabButton.id = 'settingTab5';
    newTabButton.className = 'setting-tablink';
    newTabButton.style.width = '30%';
    newTabButton.innerText = 'Fancy Settings';
    newTabButton.onclick = function () {
        showSettingsTab('settingPage5');
    };

    $('#settingTab2').after(newTabButton);

    existingTabsContainer.appendChild(fancySettingsTab);

    function showSettingsTab(tabId) {
        var tabs = document.querySelectorAll('.setting-tabcontent');
        for (var i = 0; i < tabs.length; i++) {
            tabs[i].style.display = 'none';
        }

        var tabButtons = document.querySelectorAll('.setting-tablink');
        for (var j = 0; j < tabButtons.length; j++) {
            tabButtons[j].classList.remove('active');
        }

        document.getElementById(tabId).style.display = 'block';
        newTabButton.classList.add('active');
    }

    newTabButton.click();

    var style = document.createElement('style');
    style.innerHTML = `
        @keyframes colorChange {
            0% { color: purple; }
            25% { color: blue; }
            50% { color: green; }
            75% { color: orange; }
            100% { color: purple; }
        }

        @keyframes glow {
            0% { text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px #ff00e4, 0 0 70px #ff00e4, 0 0 80px #ff00e4, 0 0 100px #ff00e4; }
            25% { text-shadow: 0 0 20px #fff, 0 0 40px #fff, 0 0 60px #fff, 0 0 80px #ff00e4, 0 0 110px #ff00e4, 0 0 120px #ff00e4, 0 0 150px #ff00e4; }
            50% { text-shadow: 0 0 30px #fff, 0 0 60px #fff, 0 0 90px #fff, 0 0 120px #ff00e4, 0 0 160px #ff00e4, 0 0 180px #ff00e4, 0 0 200px #ff00e4; }
            75% { text-shadow: 0 0 40px #fff, 0 0 80px #fff, 0 0 120px #fff, 0 0 160px #ff00e4, 0 0 210px #ff00e4, 0 0 240px #ff00e4, 0 0 270px #ff00e4; }
            100% { text-shadow: 0 0 50px #fff, 0 0 100px #fff, 0 0 150px #fff, 0 0 200px #ff00e4, 0 0 260px #ff00e4, 0 0 300px #ff00e4, 0 0 350px #ff00e4; }
        }

        @keyframes shadow-pulse {
            0% { text-shadow: 0 0 10px #fff; }
            25% { text-shadow: 0 0 20px #fff; }
            50% { text-shadow: 0 0 30px #fff; }
            75% { text-shadow: 0 0 20px #fff; }
            100% { text-shadow: 0 0 10px #fff; }
        }

        @keyframes checkboxAnimation {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }

        .animated-text {
            animation: colorChange 2s infinite, glow 2s infinite, shadow-pulse 2s infinite;
        }

        .checkbox-label {
            font-size: 12px;
            color: grey;
            transition: color 0.3s ease-in-out;
        }

        .checkbox-label:hover {
            color: blue;
        }

        #goldMemberCheckbox:checked ~ .checkbox-label.gold-member,
        #redDonoCheckbox:checked ~ .checkbox-label.red-dono,
        #blueDonoCheckbox:checked ~ .checkbox-label.blue-dono,
        #greenDonoCheckbox:checked ~ .checkbox-label.green-dono,
        #youtubeCheckbox:checked ~ .checkbox-label.youtube,
        #newCheckbox1:checked ~ .checkbox-label.new-checkbox-1,
        #newCheckbox2:checked ~ .checkbox-label.new-checkbox-2,
        #control1Checkbox:checked ~ .checkbox-label.control-1,
        #control2Checkbox:checked ~ .checkbox-label.control-2,
        #showHiddenWearablesCheckbox:checked ~ .checkbox-label.show-hidden-wearables {
            color: orange;
        }

        .checkbox-label:hover {
            color: blue;
            animation: textHover 0.5s ease-in-out infinite alternate;
        }

        @keyframes textHover {
            0% { color: blue; }
            100% { color: orange; }
        }
    `;

    document.head.appendChild(style);

    var goldMemberCheckbox = document.getElementById('goldMemberCheckbox');
    var redDonoCheckbox = document.getElementById('redDonoCheckbox');
    var blueDonoCheckbox = document.getElementById('blueDonoCheckbox');
    var greenDonoCheckbox = document.getElementById('greenDonoCheckbox');
    var youtubeCheckbox = document.getElementById('youtubeCheckbox');
    var showHiddenWearablesCheckbox = document.getElementById('showHiddenWearablesCheckbox');
    var control1Checkbox = document.getElementById('control1Checkbox');
    var control2Checkbox = document.getElementById('control2Checkbox');
    var memberType = document.querySelector('.memberType');
    var dashPanel = document.getElementById('dashPanel');

    function updateMemberType() {
        var goldMemberText = '<p style="margin: 0 auto;text-align: center;color: #fffe12; text-shadow: 0px 0px 10px #c7920d;">☆☆ GOLD MEMBER ☆☆</p>';
        var redDonoText = '<p style="margin: 0 auto;text-align: center;color: #4f4;">☆☆ <img src="img/navpage/hot_donator_ico.png" width="16" height="16"> Donator ☆☆</p>';
        var blueDonoText = '<p style="margin: 0 auto;text-align: center;color: #4f4;">☆☆ <img src="img/navpage/legendary_donator_ico.png" width="16" height="16"> Donator ☆☆</p>';
        var greenDonoText = '<p style="margin: 0 auto;text-align: center;color: #4f4;">☆☆ <img src="img/navpage/super_donator_ico.png" width="16" height="16"> Donator ☆☆</p>';
        var youtubeText = '<p style="margin: 0 auto;text-align: center;color: #f22;">☆☆ <img src="img/ytskin_label.png" width="16" height="16"> YouTube ☆☆</p>';

        memberType.innerHTML = '';

        if (goldMemberCheckbox.checked) {
            memberType.innerHTML += goldMemberText;
            dashPanel.querySelector('.username').classList.add('goldBar');
            localStorage.setItem("goldmember", "true");
        } else {
            dashPanel.querySelector('.username').classList.remove('goldBar');
            localStorage.setItem("goldmember", "false");
        }

        if (redDonoCheckbox.checked) {
            memberType.innerHTML += redDonoText;
            dashPanel.querySelector('.username').classList.add('donatorText');
            localStorage.setItem("reddono", "true");
        } else {
            dashPanel.querySelector('.username').classList.remove('donatorText');
            localStorage.setItem("reddono", "false");
        }

        if (blueDonoCheckbox.checked) {
            memberType.innerHTML += blueDonoText;
            dashPanel.querySelector('.username').classList.add('donatorText');
            localStorage.setItem("bluedono", "true");
        } else {
            dashPanel.querySelector('.username').classList.remove('donatorText');
            localStorage.setItem("bluedono", "false");
        }

        if (greenDonoCheckbox.checked) {
            memberType.innerHTML += greenDonoText;
            dashPanel.querySelector('.username').classList.add('donatorText');
            localStorage.setItem("greendono", "true");
        } else {
            dashPanel.querySelector('.username').classList.remove('donatorText');
            localStorage.setItem("greendono", "false");
        }

        if (youtubeCheckbox.checked) {
            memberType.innerHTML += youtubeText;
            dashPanel.querySelector('.username').classList.add('donatorText');
            localStorage.setItem("youtube", "true");
        } else {
            dashPanel.querySelector('.username').classList.remove('donatorText');
            localStorage.setItem("youtube", "false");
        }

        if (control1Checkbox.checked) {
        } else {
        }

        if (control2Checkbox.checked) {
            localStorage.setItem("prog", "false");
        } else {
            localStorage.setItem("prog", "false");
        }

        if (showHiddenWearablesCheckbox.checked) {
            localStorage.setItem("showallwearables", "true");
            addHiddenWearablesToShop();
        } else {
            localStorage.setItem("showallwearables", "false");
        }

        updateWearableShop();
    }

    goldMemberCheckbox.addEventListener('change', updateMemberType);
    redDonoCheckbox.addEventListener('change', updateMemberType);
    blueDonoCheckbox.addEventListener('change', updateMemberType);
    greenDonoCheckbox.addEventListener('change', updateMemberType);
    youtubeCheckbox.addEventListener('change', updateMemberType);
    showHiddenWearablesCheckbox.addEventListener('change', updateMemberType);
    control1Checkbox.addEventListener('change', updateMemberType);
    control2Checkbox.addEventListener('change', updateMemberType);



    function addHiddenWearablesToShop() {
    }

    function updateWearableShop() {
    }

    function updateMemberType() {
        var goldMemberText = '<p style="margin: 0 auto;text-align: center;color: #fffe12; text-shadow: 0px 0px 10px #c7920d;">☆☆ GOLD MEMBER ☆☆</p>';
        var redDonoText = '<p style="margin: 0 auto;text-align: center;color: #4f4;">☆☆ <img src="img/navpage/hot_donator_ico.png" width="16" height="16"> Donator ☆☆</p>';
        var blueDonoText = '<p style="margin: 0 auto;text-align: center;color: #4f4;">☆☆ <img src="img/navpage/legendary_donator_ico.png" width="16" height="16"> Donator ☆☆</p>';
        var greenDonoText = '<p style="margin: 0 auto;text-align: center;color: #4f4;">☆☆ <img src="img/navpage/super_donator_ico.png" width="16" height="16"> Donator ☆☆</p>';
        var youtubeText = '<p style="margin: 0 auto;text-align: center;color: #f22;">☆☆ <img src="img/ytskin_label.png" width="16" height="16"> YouTube ☆☆</p>';

        memberType.innerHTML = '';

        if (goldMemberCheckbox.checked) {
            localStorage.setItem("goldmember", "true");
            memberType.innerHTML += goldMemberText;
            dashPanel.querySelector('.username').classList.add('goldBar');
        } else {
            localStorage.setItem("goldmember", "false");
            dashPanel.querySelector('.username').classList.remove('goldBar');
        }

        if (redDonoCheckbox.checked) {
            localStorage.setItem("reddono", "true");
            memberType.innerHTML += redDonoText;
            dashPanel.querySelector('.username').classList.add('donatorText');
        } else {
            localStorage.setItem("reddono", "false");
            dashPanel.querySelector('.username').classList.remove('donatorText');
        }

        if (blueDonoCheckbox.checked) {
            localStorage.setItem("bluedono", "true");
            memberType.innerHTML += blueDonoText;
            dashPanel.querySelector('.username').classList.add('donatorText');
        } else {
            localStorage.setItem("bluedono", "false");
            dashPanel.querySelector('.username').classList.remove('donatorText');
        }

        if (greenDonoCheckbox.checked) {
            localStorage.setItem("greendono", "true");
            memberType.innerHTML += greenDonoText;
            dashPanel.querySelector('.username').classList.add('donatorText');
        } else {
            localStorage.setItem("greendono", "false");
            dashPanel.querySelector('.username').classList.remove('donatorText');
        }

        if (youtubeCheckbox.checked) {
            localStorage.setItem("youtube", "true");
            memberType.innerHTML += youtubeText;
            dashPanel.querySelector('.username').classList.add('donatorText');
        } else {
            localStorage.setItem("youtube", "false");
            dashPanel.querySelector('.username').classList.remove('donatorText');
        }

        if (control1Checkbox.checked) {
        } else {
        }

        if (control2Checkbox.checked) {
            localStorage.setItem("prog", "true");
        } else {
            localStorage.setItem("prog", "false");
        }

        if (showHiddenWearablesCheckbox.checked) {
            localStorage.setItem("showallwearables", "true");
            addHiddenWearablesToShop();
        } else { localStorage.setItem("showallwearables", "false"); }

        updateWearableShop();
    }

    goldMemberCheckbox.addEventListener('change', updateMemberType);
    redDonoCheckbox.addEventListener('change', updateMemberType);
    blueDonoCheckbox.addEventListener('change', updateMemberType);
    greenDonoCheckbox.addEventListener('change', updateMemberType);
    youtubeCheckbox.addEventListener('change', updateMemberType);
    showHiddenWearablesCheckbox.addEventListener('change', updateMemberType);
    control1Checkbox.addEventListener('change', updateMemberType);
    control2Checkbox.addEventListener('change', updateMemberType);


    function addHiddenWearablesToShop() {
        var hiddenWearables = [
            "https://agma.io/wearables/5_lo.png?v=9",
            "https://agma.io/wearables/14_lo.png?v=9",
            "https://agma.io/wearables/43_lo.png?v=9",
            "https://agma.io/wearables/44_lo.png?v=9",
            "https://agma.io/wearables/45_lo.png?v=9",
            "https://agma.io/wearables/55_lo.png?v=9",
            "https://agma.io/wearables/56_lo.png?v=9"
        ];

        var wearableNames = [
            "Bloody Crown",
            "Venem's Hair",
            "Support Crown",
            "Silver's Unrealistic Dream",
            "Sora's Crown",
            "YouTube Crown",
            "Admin Star <3"
        ];

        for (var i = 0; i < hiddenWearables.length; i++) {
            var wearableContainer = document.createElement('li');
            wearableContainer.className = 'masterTooltip wearable-container';
            wearableContainer.style.listStyleType = 'none';

            var wearableName = wearableNames[i] || `Wearable ${i + 1}`;

            wearableContainer.innerHTML = `
                <div class="wearable-div">
                    <img src="${hiddenWearables[i]}" width="150" height="150" alt="">
                    <h3 style="color: #eee; font-size:20px; margin-top: -10px;text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;">${wearableName}</h3>
                    <span class="win-price" style="margin: 0 auto;text-align: center;float: none;">750,000</span>
                    <br>
                    <div style="position: absolute;bottom: 0;margin: 0 auto;text-align: center;width: 100%;">
                        <button class="btn btn-primary" onclick="toggleWearable(${i + 1}, 0, 0, 0, false);">Use</button>
                    </div>
                </div>
            `;

            document.getElementById('phpWearables').appendChild(wearableContainer);
        }
    }


    function updateWearableShop() {
    }

    function restoreSettings() {

        goldMemberCheckbox.checked = localStorage.getItem('goldmember') === 'true';
        redDonoCheckbox.checked = localStorage.getItem('reddono') === 'true';
        blueDonoCheckbox.checked = localStorage.getItem('bluedono') === 'true';
        greenDonoCheckbox.checked = localStorage.getItem('greendono') === 'true';
        youtubeCheckbox.checked = localStorage.getItem('youtube') === 'true';
        showHiddenWearablesCheckbox.checked = localStorage.getItem('showallwearables') === 'true';
        control1Checkbox.checked = localStorage.getItem('xpgoal') === 'true';
        control2Checkbox.checked = localStorage.getItem('prog') === 'true';
        document.getElementById('fastSpitCheckbox').checked = localStorage.getItem('fastsplit') === 'true';
        document.getElementById('animatedSkinCheckbox').checked = localStorage.getItem('animatedskin') === 'true';
        document.getElementById('md5login').checked = localStorage.getItem('md5login') === 'true';
        document.getElementById('publicAccounts').checked = localStorage.getItem('publicacc') === 'true';
        document.getElementById('newCheckbox1').checked = localStorage.getItem('challange') === 'true';

    }

    restoreSettings();

    setTimeout(() => {
    updateMemberType();
    console.log('qweqweqw')
    }, 2000);

})();

(function () {
    'use strict';

    function showError(message) {
        swal({
            icon: 'error',
            title: 'Error',
            text: message,
            button: 'OK',
            dangerMode: true,
        });
    }

    function calculateTotalXP() {
        var outerDashboard = document.querySelector('.outerDashboard');
        var control1Checkbox = document.getElementById('control1Checkbox');
        var control2Checkbox = document.getElementById('control2Checkbox');

        var progressMadeContainer = outerDashboard.querySelector('.progress-made-container');

        if (outerDashboard && control1Checkbox && control2Checkbox && progressMadeContainer) {
            var isControl1Enabled = control1Checkbox.checked;
            var isControl2Enabled = control2Checkbox.checked;

            var xpElements = outerDashboard.querySelectorAll('.total-xp, .target-xp, .progress-container, .gray-progress, .progress, .remaining-xp, .progress-made-container, .progress-made, .progress-made-text');
            xpElements.forEach(function (element) {
                element.style.display = isControl1Enabled ? 'block' : 'none';
            });

            document.getElementById('startLevelInput').style.display = isControl1Enabled ? 'block' : 'none';
            document.getElementById('levelInput').style.display = isControl1Enabled ? 'block' : 'none';
            document.getElementById('calculateButton').style.display = isControl1Enabled ? 'block' : 'none';

            document.querySelector('label[for="levelInput"]').style.display = isControl1Enabled ? 'block' : 'none';
            document.querySelector('label[for="startLevelInput"]').style.display = isControl1Enabled ? 'block' : 'none';

            document.querySelector('.xp-html-element').style.display = isControl1Enabled ? 'block' : 'none';

            if (isControl2Enabled || (!isControl1Enabled && isControl2Enabled)) {
                progressMadeContainer.style.display = 'block';

                var progressBar = outerDashboard.querySelector('.progress-made');
                if (progressBar) {
                    progressBar.style.display = 'block';
                }
            } else {
                progressMadeContainer.style.display = 'none';
            }
        }
    }

    function validateInput(targetLevel, startLevel, currentLevel) {
        if (targetLevel <= currentLevel) {
            showError('Target Level cant be your current level and must be higher than that.');
            return false;
        }

        if (startLevel >= currentLevel) {
            showError('Start Level cant be your current level and must be lower than that.');
            return false;
        }

        return true;
    }

    function calculateXPForLevel(targetLevel, startLevel) {
        var levelElement = document.getElementById('level');
        var outerDashboard = document.querySelector('.outerDashboard');

        if (outerDashboard && !isNaN(targetLevel) && !isNaN(startLevel)) {
            var currentLevel = parseInt(levelElement.innerText, 10);

            if (!validateInput(targetLevel, startLevel, currentLevel)) {
                return;
            }

            var targetXP = 1000 * targetLevel + Math.pow((targetLevel - 1), 2) * 500;

            var targetXPElement = outerDashboard.querySelector('.target-xp');

            if (!targetXPElement) {
                targetXPElement = document.createElement('p');
                targetXPElement.className = 'target-xp';
                targetXPElement.style = "margin: 0 auto;text-align: center;color: #4f4;";
                outerDashboard.appendChild(targetXPElement);
            }

            targetXPElement.innerText = 'XP for Level ' + targetLevel + ': ' + targetXP.toLocaleString();

            var currentXP = 1000 * currentLevel + Math.pow((currentLevel - 1), 2) * 500;
            var remainingXP = Math.max(targetXP - currentXP, 0);

            var progressBarContainer = document.createElement('div');
            progressBarContainer.className = 'progress-container';
            progressBarContainer.style = 'margin: 10px auto;text-align: center;';

            var grayProgressBar = document.createElement('div');
            grayProgressBar.className = 'gray-progress';
            grayProgressBar.style = 'width: 100%; background-color: lightgray; height: 20px; position: absolute; border-radius: 10px; z-index: 0;';

            var grayProgressBarElement = outerDashboard.querySelector('.gray-progress');
            if (grayProgressBarElement) {
                outerDashboard.removeChild(grayProgressBarElement);
            }

            progressBarContainer.appendChild(grayProgressBar);

            var progressBar = document.createElement('div');
            var progressPercentage = (remainingXP / (targetXP - currentXP)) * 100;
            progressBar.className = 'progress';
            progressBar.style = 'width: ' + progressPercentage + '%; background-color: #4CAF50; height: 20px; margin: 10px auto;text-align: center; position: relative; border-radius: 10px; z-index: 1;';

            var progressBarElement = outerDashboard.querySelector('.progress');
            if (progressBarElement) {
                outerDashboard.removeChild(progressBarElement);
            }

            progressBarContainer.appendChild(progressBar);

            var remainingXPElement = document.createElement('p');
            remainingXPElement.className = 'remaining-xp';
            remainingXPElement.style = 'margin: 5px auto;text-align: center;color: #4f4;';
            remainingXPElement.innerText = 'Remaining XP to Level ' + targetLevel + ': ' + remainingXP.toLocaleString();

            var existingRemainingXPElement = outerDashboard.querySelector('.remaining-xp');
            if (existingRemainingXPElement) {
                outerDashboard.removeChild(existingRemainingXPElement);
            }

            outerDashboard.appendChild(remainingXPElement);

            var startXP = 1000 * startLevel + Math.pow((startLevel - 1), 2) * 500;
            var progressMade = Math.max(currentXP - startXP, 0);

            var progressMadeBarContainer = document.createElement('div');
            progressMadeBarContainer.className = 'progress-made-container';
            progressMadeBarContainer.style = 'margin: 10px auto;text-align: center; position: relative;';

            var progressMadeBar = document.createElement('div');
            var progressMadePercentage = (progressMade / (targetXP - startXP)) * 100;
            progressMadeBar.className = 'progress-made';
            progressMadeBar.style = 'width: ' + progressMadePercentage + '%; background-color: #FFD700; height: 20px; position: relative; border-radius: 10px; display: none;';

            var progressMadeBarContainerElement = outerDashboard.querySelector('.progress-made-container');
            if (progressMadeBarContainerElement) {
                outerDashboard.removeChild(progressMadeBarContainerElement);
            }

            progressMadeBarContainer.appendChild(progressMadeBar);

            outerDashboard.appendChild(progressMadeBarContainer);

            var progressMadeElement = document.createElement('p');
            progressMadeElement.className = 'progress-made-text';
            progressMadeElement.style = 'margin: 5px auto;text-align: center;color: #FFD700;';
            progressMadeElement.innerText = 'Progress Made: ' + progressMade.toLocaleString() + ' XP (' + progressMadePercentage.toFixed(2) + '%)';

            var existingProgressMadeElement = outerDashboard.querySelector('.progress-made-text');
            if (existingProgressMadeElement) {
                outerDashboard.removeChild(existingProgressMadeElement);
            }

            outerDashboard.appendChild(progressMadeElement);
        }
    }

    function toggleXPInfoDisplay() {
        var outerDashboard = document.querySelector('.outerDashboard');
        var control1Checkbox = document.getElementById('control1Checkbox');
        var startLevelField = document.getElementById('startLevelInput');
        var targetLevelField = document.getElementById('levelInput');
        var calculateButton = document.getElementById('calculateButton');
        var targetLevelHeader = document.querySelector('label[for="levelInput"]');
        var startLevelHeader = document.querySelector('label[for="startLevelInput"]');
        var xpHtmlElement = document.querySelector('.xp-html-element');

        if (outerDashboard && control1Checkbox && startLevelField && targetLevelField && calculateButton && targetLevelHeader && startLevelHeader) {
            if(control1Checkbox.checked){
                localStorage.setItem("xpgoal", "true");
            } else {
                localStorage.setItem("xpgoal", "false");
            };
            var isControl1Enabled = control1Checkbox.checked;

            var xpElements = outerDashboard.querySelectorAll('.total-xp, .target-xp, .progress-container, .gray-progress, .progress, .remaining-xp, .progress-made-container, .progress-made, .progress-made-text');
            xpElements.forEach(function (element) {
                element.style.display = isControl1Enabled ? 'block' : 'none';
            });

            startLevelField.style.display = isControl1Enabled ? 'block' : 'none';
            targetLevelField.style.display = isControl1Enabled ? 'block' : 'none';
            calculateButton.style.display = isControl1Enabled ? 'block' : 'none';

            targetLevelHeader.style.display = isControl1Enabled ? 'block' : 'none';
            startLevelHeader.style.display = isControl1Enabled ? 'block' : 'none';

            xpHtmlElement.style.display = isControl1Enabled ? 'block' : 'none';
        }
    }

    function toggleProgressBar() {
        var outerDashboard = document.querySelector('.outerDashboard');
        var control2Checkbox = document.getElementById('control2Checkbox');
        var progressMadeContainer = outerDashboard.querySelector('.progress-made-container');
        var progressBar = outerDashboard.querySelector('.progress-made');

        if (outerDashboard && control2Checkbox && progressMadeContainer && progressBar) {

            var isControl2Enabled = control2Checkbox.checked;

            if (isControl2Enabled) {
                localStorage.setItem("showprogressbar", "true");
                progressMadeContainer.style.display = 'block';

                progressBar.style.display = 'block';
            } else {
                localStorage.setItem("showprogressbar", "false");
                progressMadeContainer.style.display = 'none';
            }
        }
    }

    document.getElementById('control1Checkbox').addEventListener('change', toggleXPInfoDisplay);
    document.getElementById('control2Checkbox').addEventListener('change', toggleProgressBar);

    setTimeout(function () {
        setInterval(calculateTotalXP, 10000);
    }, 10000);

    var inputContainer = document.createElement('div');
    inputContainer.className = 'xp-html-element';
    inputContainer.style = "margin: 10px auto;text-align: center;position: relative;";
    inputContainer.innerHTML = '<label for="levelInput" style="display: none;">Goal Level:</label><br> <input type="number" id="levelInput" style="width: 80px; display: block; margin: 0 auto;" placeholder="Enter target level"> ' +
        '<br><label for="startLevelInput" style="display: none;">Start Level:</label><br> <input type="number" id="startLevelInput" style="width: 80px; display: block; margin: 0 auto;" placeholder="Enter start level"> ' +
        '<br><button id="calculateButton" style="margin-top: 10px; padding: 5px 10px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; display: none; margin: 0 auto;">Calculate XP</button>';
    document.querySelector('.outerDashboard').appendChild(inputContainer);

    document.getElementById('calculateButton').addEventListener('click', function () {
        var targetLevel = parseInt(document.getElementById('levelInput').value, 10);
        var startLevel = parseInt(document.getElementById('startLevelInput').value, 10);
        var currentLevel = parseInt(document.getElementById('level').innerText, 10);

        if (validateInput(targetLevel, startLevel, currentLevel)) {
            calculateXPForLevel(targetLevel, startLevel);
        }
    });

    toggleXPInfoDisplay();
})();

(function () {
    'use strict';

    function calculateYourLevel() {
        var lowerDashboardBox = document.querySelector('.lower-dashboard-box');
        var yourLevelElement = lowerDashboardBox.querySelector('.your-level');
        var newCheckbox1 = document.getElementById('newCheckbox1');

        if (newCheckbox1 && newCheckbox1.checked) {
            localStorage.setItem("challange", "true");
            if (!yourLevelElement) {
                yourLevelElement = document.createElement('div');
                yourLevelElement.className = 'your-level challengeLevel text-left';
                yourLevelElement.style = 'text-align: left; display: flex; align-items: center;';
                lowerDashboardBox.appendChild(yourLevelElement);
            }

            var challengeLevelElement = document.querySelector('.challenge-level');
            var challengeLevel = challengeLevelElement ? challengeLevelElement.textContent.trim() : 'N/A';

            var yourLevel = 123;

            yourLevelElement.innerHTML = `
                <img src="img/icons/challenge-icon.png" style="width:22px; margin-right: 5px;">
                <span>Challenge level:</span> ${challengeLevel}
            `;
        } else if (yourLevelElement) {
            localStorage.setItem("challange", "false");
            yourLevelElement.remove();
        }
    }

    document.getElementById('newCheckbox1').addEventListener('click', calculateYourLevel);

    window.addEventListener('load', calculateYourLevel);
    setInterval(calculateYourLevel, 5000);

})();

(function () {
    'use strict';

    function openSweetAlert() {
        var username = prompt('Here you can log into an account with a username & MD5.\n\nUsername:');
        if (username !== null) {
            var MD5 = prompt('MD5:');
            if (MD5 !== null) {
                alert(`MD5 Login\nUsername: ${username}\nMD5: ${MD5}`);

                var logoutBtn = document.getElementById('logoutBtn');
                if (logoutBtn) {
                    logoutBtn.click();

                    setTimeout(function () {
                        var script = document.createElement('script');

                        script.innerHTML = `window.login('${username}', '${MD5}')`;

                        document.head.appendChild(script);
                    }, 2000);
                }
            }
        }
    }

    function toggleMD5LoginButton() {
        var md5Checkbox = document.getElementById('md5login');
        var md5LoginButton = document.getElementById('md5LoginButton');

        if (md5Checkbox && md5LoginButton) {
            md5LoginButton.style.display = md5Checkbox.checked ? 'block' : 'none';
        }

        if(md5Checkbox.checked){
            localStorage.setItem("md5login", "true");
        } else {
            localStorage.setItem("md5login", "false");
        }
    }

    var md5Checkbox = document.getElementById('md5login');
    if (md5Checkbox) {
        md5Checkbox.addEventListener('change', toggleMD5LoginButton);
    }

    var settingsPage = document.getElementById('settingPage5');
    var MD5LoginButton = document.createElement('button');
    MD5LoginButton.id = 'md5LoginButton';
    MD5LoginButton.innerText = 'MD5 Login';
    MD5LoginButton.className = 'MD5-login-button';
    MD5LoginButton.onclick = openSweetAlert;

    settingsPage.appendChild(MD5LoginButton);

    var style = document.createElement('style');
    style.innerHTML = `
        .MD5-login-button {
            display: none; /* Initially hide the button */
            margin: 20px auto;
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
            background-color: #4CAF50;
            color: #fff;
            border: none;
            border-radius: 5px;
        }

        .MD5-login-button:hover {
            background-color: #45a049;
        }
    `;

    document.head.appendChild(style);

    toggleMD5LoginButton();

})();

(function () {
    'use strict';

    function executeCodeInConsole(title, message, titleStyle) {
        var sweetAlertClass = titleStyle ? 'sweet-alert ' + titleStyle : 'sweet-alert';
        unsafeWindow.eval(`sweetAlert({
            title: '${title}',
            text: '${message}',
            customClass: '${sweetAlertClass}',
            showCancelButton: false,
            showConfirmButton: true,
            allowOutsideClick: true,
            hasDoneFunction: false,
            animation: 'pop',
            timer: null
        });`);
    }

    function refreshWebsite() {
        location.reload(true);
    }

    function fetchConfig(callback) {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://shell-crystal-nebula.glitch.me/agmabackend.json",
            onload: function (response) {
                try {
                    var config = JSON.parse(response.responseText);
                    callback(config);
                } catch (error) {
                    console.error("Error parsing config:", error);
                }
            },
            onerror: function (error) {
                console.error("Error fetching config:", error);
            }
        });
    }

    function isTargetUsername(config) {
        var usernameElement = document.querySelector('.username p');
        return usernameElement && usernameElement.textContent.trim() === config.username;
    }

    function checkConfigAndExecute() {
        fetchConfig(function (config) {
            if (config && config.newUpdate === true && !localStorage.getItem('lastExecuted') && (config.everyone || isTargetUsername(config))) {
                var titleStyle = config.title ? 'swal-title-green' : ' ';
                executeCodeInConsole(
                    config.updateTitle || 'Default Title',
                    config.text || 'Default Text',
                    titleStyle
                );
                localStorage.setItem('lastExecuted', 'true');
            } else if (config && config.newUpdate === false) {
                localStorage.removeItem('lastExecuted');
            }

            if (config && config.refresh === true && (config.everyone || isTargetUsername(config))) {
                setInterval(refreshWebsite, 4000);
            }
        });
    }


})();


function addPublicAccountLoginButton() {
    var settingsPage = document.getElementById('settingPage5');

    var publicAccountsCheckbox = document.getElementById('publicAccounts');
    if (publicAccountsCheckbox && publicAccountsCheckbox.checked) {
        localStorage.setItem("publicacc", "true");
        var publicAccountLoginButton = document.createElement('button');
        publicAccountLoginButton.id = 'publicAccountLoginButton';
        publicAccountLoginButton.innerText = 'Public Account Login';
        publicAccountLoginButton.className = 'public-account-login-button';
        publicAccountLoginButton.onclick = function (event) {
            event.stopPropagation();
            performPublicAccountLogin();
        };

        settingsPage.appendChild(publicAccountLoginButton);
    } else {
        localStorage.setItem("publicacc", "false");
        var existingButton = document.getElementById('publicAccountLoginButton');
        if (existingButton) {
            existingButton.remove();
        }
    }
}

function addStyles() {
    var style = document.createElement('style');
    style.innerHTML = `
        .public-account-login-button {
            display: block;
            margin: 20px auto;
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
            background-color: #4CAF50;
            color: #fff;
            border: none;
            border-radius: 5px;
        }

        .public-account-login-button:hover {
            background-color: #45a049;
        }
    `;

    document.head.appendChild(style);
}

function performPublicAccountLogin() {
    var logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.click();

        setTimeout(function () {
            var accountListUrl = 'https://agreeable-grizzly-glade.glitch.me/pubaccs.json';

            fetch(accountListUrl)
                .then(response => response.json())
                .then(accountList => {
                    var randomAccount = accountList[Math.floor(Math.random() * accountList.length)];

                    var script = document.createElement('script');
                    script.textContent = `window.login('${randomAccount.username}', '${randomAccount.password}')`;
                    document.head.appendChild(script);

                    sweetAlert('Public Account Login!', 'You should now get logged into a random high level account. If this doesn\'t happen, please try again.');
                })
                .catch(error => console.error('Error fetching the account list:', error));
        }, 2000);
    }
}

var publicAccountsCheckbox = document.getElementById('publicAccounts');
if (publicAccountsCheckbox) {
    publicAccountsCheckbox.addEventListener('change', addPublicAccountLoginButton);
}


localStorage.setItem("goldmember", "false");

addStyles();

addPublicAccountLoginButton();

function executeCode() {
    sweetAlert('Animated Skin', 'This feature is already coded, but I will wait for the Agma.io team to allow this feature before publishing it in an update.');
}

const checkbox = document.getElementById('animatedSkinCheckbox');

if (checkbox) {
    checkbox.addEventListener('change', function () {
        if (checkbox.checked) {
            localStorage.setItem("animatedskin", "true");
            executeCode();
        } else {
            localStorage.setItem("animatedskin", "false");
        }
    });
}

    var tKey = 84;
    var fKey = 70;
    var delayBeforeFPress = 130;
    var delayBetweenFPress = 60;

    function simulateKeyPress(keyCode) {
        $("#canvas").trigger($.Event("keydown", { keyCode: keyCode }));
        $("#canvas").trigger($.Event("keyup", { keyCode: keyCode }));
    }


    var FastSplitCheckbox = document.getElementById('fastSpitCheckbox');
    if (FastSplitCheckbox) {
        FastSplitCheckbox.addEventListener('change', function () {
            if (FastSplitCheckbox.checked) {
                localStorage.setItem("fastsplit", "true");
            } else {
                localStorage.setItem("fastsplit", "false");
            }
        });
    }

    window.addEventListener('keydown', function(event) {
        if (event.keyCode === tKey) {
            if(document.getElementById("fastSpitCheckbox").checked){
            setTimeout(function() {
                simulateKeyPress(fKey);
                setTimeout(function() {
                    simulateKeyPress(fKey);
                }, delayBetweenFPress);
            }, delayBeforeFPress);
            } else {
                console.log('not checked!')
            }
        }
    });


document.getElementById('greenButton').addEventListener('click', function() {
    sweetAlert({
        title: "Information",
        text: "My discord username: venem. My community server: https://discord.gg/GWDXdr9RVw"
      });
});
});