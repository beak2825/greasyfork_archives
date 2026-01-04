// ==UserScript==
// @name         DHM Desktop Notifications
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Desktop Notifications for DHM
// @author       level
// @match        https://dhm.idle-pixel.com/
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478236/DHM%20Desktop%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/478236/DHM%20Desktop%20Notifications.meta.js
// ==/UserScript==
var VERSION_NUMBER = "1.1";

window.addEventListener("load", function() {
    console.log('Loading DHM Helper...');
    var loaded = false;
    loading();
    var Hinterval = setInterval(loading, 100);

    function loading() {
        if (loaded === false) {
            console.log("Loaded DHM Helper");
            loaded = true;
            addStyles();
            createNav();
            createMenu();
            init();
        }
    }
    
    function addStyles() {
        let style = document.createElement('style');
        style.innerHTML = `
            #dhm-helper-menu {
                position: absolute;
                background: white;
                width: 700px;
                height: 777px;
                max-width: 100%;
                max-height: 100%;
                z-index: 10000;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                box-shadow: black 0 0 15px 1px;
				overflow-y: auto;
            }
            #dhm-helper-menu h1, #dhm-helper-menu span, #dhm-helper-menu p {
                color: black;
                text-align: center;
            }
            #dhm-helper-menu h1 img {
                margin: 0 10px 0 10px;
            }
            #dhm-helper-menu h1 img:nth-child(1) {
                transform: scaleX(-1);
            }
            .dhm-helper-headerContainer {
                text-align: center;
            }
            #dhm-helper-menu hr {
                background-color: #e0e0e0;
                width: 100%;
            }
            .dhm-helper-inputContainer {
                max-width: 400px;
                margin: 0 auto;
                height: 40px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .dhm-helper-inputContainer input[type="checkbox"] {
                width: 20px;
                height: 20px;
            }
            .dhm-helper-inputContainer-sub input[type="checkbox"] {
                margin-left: 25px;
            }
            .dhm-helper-inputContainer-sub-sub input[type="checkbox"] {
                margin-left: 50px;
            }
            .dhm-helper-inputContainer label {
                color: black;
                font-size: 20px;
            }
            #dhm-helper-menu span {
                color: #5a5a5a;
                padding: 5px;
            }
			.dialogue-button {
				border:1px solid silver;
				background-color:#e6e6e6;
				border-radius:3pt;
				color:black;
				font-size:14pt;
				text-align:center;
				cursor:pointer;
				padding:10px;
			}`;
        document.head.appendChild(style);
    }

    function createNav() {
		let navItem = document.createElement('div');
		let miscTab = document.querySelectorAll("#tab-misc > .main-button");
		navItem.innerHTML = `<div onclick="window.toggleMenu2()" class="main-button" style="cursor: pointer;">
		<table>
			<tbody><tr>
			<td><img src="images/bronzeStarLamp.png" class="img-small"></td>
			<td style="text-align:right;padding-right:20px;font-size:12pt;">DESKTOP NOTFICATIONS</td>
			</tr>
		</tbody></table>
		</div>`;
		miscTab[2].parentNode.insertBefore(navItem,miscTab[3]);
    }

    function createMenu() {
        let menu = document.createElement('div');
        menu.setAttribute('id', 'dhm-helper-menu');
        menu.style.display = 'none';
        
        let closeButton = document.createElement('div');
        closeButton.setAttribute('class', 'dialogue-button');
        closeButton.innerText = "Close";
        closeButton.addEventListener('click', toggleMenu)
        menu.appendChild(closeButton);

        let headerContainer = document.createElement('div');
        headerContainer.setAttribute('class', 'dhm-helper-headerContainer');

        let header = document.createElement('h1');
        let headerImage = document.createElement('img');
        headerImage.setAttribute('src', 'images/bronzeStarLamp.png');
        headerImage.setAttribute('class', 'img-medium');
        let headerImage2 = headerImage.cloneNode(true);
        header.innerText = "DHM Helper";
        header.insertBefore(headerImage, header.firstChild);
        header.appendChild(headerImage2);
        headerContainer.appendChild(header);

        let version = document.createElement('span');
        version.innerText = "Version: " + VERSION_NUMBER;
        headerContainer.appendChild(version);
        
        menu.appendChild(headerContainer);
        
        let hr = document.createElement('hr');
        menu.appendChild(hr);
    
        // Global Notifications Checkbox
        let notificationsInputContainer = document.createElement('div');
        notificationsInputContainer.setAttribute('class', 'dhm-helper-inputContainer');
        let notificationsInput = document.createElement('input');
        notificationsInput.setAttribute('type', 'checkbox');
        notificationsInput.setAttribute('name', 'dhm-notificationsInput');
        notificationsInput.setAttribute('data-storage', 'hNotifications');
        
        if (localStorage.hNotifications === "true") {
            notificationsInput.setAttribute('checked', 'checked');
        }
        notificationsInput.addEventListener("change", grantNotifications);
        
        let notificationsLabel = document.createElement('label');
        notificationsLabel.setAttribute('for', 'checkbox');
        notificationsLabel.innerText = "Desktop Notifications";

        notificationsInputContainer.append(notificationsInput);
        notificationsInputContainer.append(notificationsLabel);

        menu.appendChild(notificationsInputContainer);

        // Daily Mission Notifications Checkbox
        let dailyInputContainer = document.createElement('div');
        dailyInputContainer.setAttribute('class', 'dhm-helper-inputContainer dhm-helper-inputContainer-sub');
        let dailyInput = document.createElement('input');
        dailyInput.setAttribute('type', 'checkbox');
        dailyInput.setAttribute('name', 'dhm-notificationsInput');
        dailyInput.setAttribute('data-storage', 'hDaily');
        
        if (localStorage.hDaily === "true") {
            dailyInput.setAttribute('checked', 'checked');
        }
        dailyInput.addEventListener("change", toggleStorage);
        
        let dailyLabel = document.createElement('label');
        dailyLabel.setAttribute('for', 'checkbox');
        dailyLabel.innerText = "Daily Mission Notifications";

        dailyInputContainer.append(dailyInput);
        dailyInputContainer.append(dailyLabel);

        menu.appendChild(dailyInputContainer);

        // Treasure Map Notifications Checkbox
        let mapInputContainer = document.createElement('div');
        mapInputContainer.setAttribute('class', 'dhm-helper-inputContainer dhm-helper-inputContainer-sub');
        let mapInput = document.createElement('input');
        mapInput.setAttribute('type', 'checkbox');
        mapInput.setAttribute('name', 'dhm-notificationsInput');
        mapInput.setAttribute('data-storage', 'hMap');
        
        if (localStorage.hMap === "true") {
            mapInput.setAttribute('checked', 'checked');
        }
        mapInput.addEventListener("change", toggleStorage);
        
        let mapLabel = document.createElement('label');
        mapLabel.setAttribute('for', 'checkbox');
        mapLabel.innerText = "Treasure Map Notifications";

        mapInputContainer.append(mapInput);
        mapInputContainer.append(mapLabel);

        menu.appendChild(mapInputContainer);

        // Event Notifications Checkbox
        let eventInputContainer = document.createElement('div');
        eventInputContainer.setAttribute('class', 'dhm-helper-inputContainer dhm-helper-inputContainer-sub');
        let eventInput = document.createElement('input');
        eventInput.setAttribute('type', 'checkbox');
        eventInput.setAttribute('name', 'dhm-notificationsInput');
        eventInput.setAttribute('data-storage', 'hEvent');
        
        if (localStorage.hEvent === "true") {
            eventInput.setAttribute('checked', 'checked');
        }
        eventInput.addEventListener("change", toggleStorage);
        
        let eventLabel = document.createElement('label');
        eventLabel.setAttribute('for', 'checkbox');
        eventLabel.innerText = "Event Notifications";

        eventInputContainer.append(eventInput);
        eventInputContainer.append(eventLabel);

        menu.appendChild(eventInputContainer);

        // Research Notifications Checkbox
        let researchInputContainer = document.createElement('div');
        researchInputContainer.setAttribute('class', 'dhm-helper-inputContainer dhm-helper-inputContainer-sub');
        let researchInput = document.createElement('input');
        researchInput.setAttribute('type', 'checkbox');
        researchInput.setAttribute('name', 'dhm-notificationsInput');
        researchInput.setAttribute('data-storage', 'hResearch');
        
        if (localStorage.hResearch === "true") {
            researchInput.setAttribute('checked', 'checked');
        }
        researchInput.addEventListener("change", toggleStorage);
        
        let researchLabel = document.createElement('label');
        researchLabel.setAttribute('for', 'checkbox');
        researchLabel.innerText = "Research Notifications";

        researchInputContainer.append(researchInput);
        researchInputContainer.append(researchLabel);

        menu.appendChild(researchInputContainer);

        // Train Notifications Checkbox
        let trainInputContainer = document.createElement('div');
        trainInputContainer.setAttribute('class', 'dhm-helper-inputContainer dhm-helper-inputContainer-sub');
        let trainInput = document.createElement('input');
        trainInput.setAttribute('type', 'checkbox');
        trainInput.setAttribute('name', 'dhm-notificationsInput');
        trainInput.setAttribute('data-storage', 'hTrain');
        
        if (localStorage.hTrain === "true") {
            trainInput.setAttribute('checked', 'checked');
        }
        trainInput.addEventListener("change", toggleStorage);
        
        let trainLabel = document.createElement('label');
        trainLabel.setAttribute('for', 'checkbox');
        trainLabel.innerText = "Train Notifications";

        trainInputContainer.append(trainInput);
        trainInputContainer.append(trainLabel);

        menu.appendChild(trainInputContainer);

        // Rocket Notifications Checkbox
        let rocketInputContainer = document.createElement('div');
        rocketInputContainer.setAttribute('class', 'dhm-helper-inputContainer dhm-helper-inputContainer-sub');
        let rocketInput = document.createElement('input');
        rocketInput.setAttribute('type', 'checkbox');
        rocketInput.setAttribute('name', 'dhm-notificationsInput');
        rocketInput.setAttribute('data-storage', 'hRocket');
        
        if (localStorage.hRocket === "true") {
            rocketInput.setAttribute('checked', 'checked');
        }
        rocketInput.addEventListener("change", toggleStorage);
        
        let rocketLabel = document.createElement('label');
        rocketLabel.setAttribute('for', 'checkbox');
        rocketLabel.innerText = "Rocket Notifications";

        rocketInputContainer.append(rocketInput);
        rocketInputContainer.append(rocketLabel);

        menu.appendChild(rocketInputContainer);

        // Furnace Notifications Checkbox
        let furnaceInputContainer = document.createElement('div');
        furnaceInputContainer.setAttribute('class', 'dhm-helper-inputContainer dhm-helper-inputContainer-sub');
        let furnaceInput = document.createElement('input');
        furnaceInput.setAttribute('type', 'checkbox');
        furnaceInput.setAttribute('name', 'dhm-notificationsInput');
        furnaceInput.setAttribute('data-storage', 'hFurnace');
        
        if (localStorage.hFurnace === "true") {
            furnaceInput.setAttribute('checked', 'checked');
        }
        furnaceInput.addEventListener("change", toggleStorage);
        
        let furnaceLabel = document.createElement('label');
        furnaceLabel.setAttribute('for', 'checkbox');
        furnaceLabel.innerText = "Furnace Notifications";

        furnaceInputContainer.append(furnaceInput);
        furnaceInputContainer.append(furnaceLabel);

        menu.appendChild(furnaceInputContainer);

        // Foundry Notifications Checkbox
        let foundryInputContainer = document.createElement('div');
        foundryInputContainer.setAttribute('class', 'dhm-helper-inputContainer dhm-helper-inputContainer-sub');
        let foundryInput = document.createElement('input');
        foundryInput.setAttribute('type', 'checkbox');
        foundryInput.setAttribute('name', 'dhm-notificationsInput');
        foundryInput.setAttribute('data-storage', 'hFoundry');
        
        if (localStorage.hFoundry === "true") {
            foundryInput.setAttribute('checked', 'checked');
        }
        foundryInput.addEventListener("change", toggleStorage);
        
        let foundryLabel = document.createElement('label');
        foundryLabel.setAttribute('for', 'checkbox');
        foundryLabel.innerText = "Foundry Notifications";

        foundryInputContainer.append(foundryInput);
        foundryInputContainer.append(foundryLabel);

        menu.appendChild(foundryInputContainer);

        // Refinary Notifications Checkbox
        let refinaryInputContainer = document.createElement('div');
        refinaryInputContainer.setAttribute('class', 'dhm-helper-inputContainer dhm-helper-inputContainer-sub');
        let refinaryInput = document.createElement('input');
        refinaryInput.setAttribute('type', 'checkbox');
        refinaryInput.setAttribute('name', 'dhm-notificationsInput');
        refinaryInput.setAttribute('data-storage', 'hRefinary');
        
        if (localStorage.hRefinary === "true") {
            refinaryInput.setAttribute('checked', 'checked');
        }
        refinaryInput.addEventListener("change", toggleStorage);
        
        let refinaryLabel = document.createElement('label');
        refinaryLabel.setAttribute('for', 'checkbox');
        refinaryLabel.innerText = "Refinary Notifications";

        refinaryInputContainer.append(refinaryInput);
        refinaryInputContainer.append(refinaryLabel);

        menu.appendChild(refinaryInputContainer);

        // Tree Notifications Checkbox
        let treeInputContainer = document.createElement('div');
        treeInputContainer.setAttribute('class', 'dhm-helper-inputContainer dhm-helper-inputContainer-sub');
        let treeInput = document.createElement('input');
        treeInput.setAttribute('type', 'checkbox');
        treeInput.setAttribute('name', 'dhm-notificationsInput');
        treeInput.setAttribute('data-storage', 'hTree');
        
        if (localStorage.hTree === "true") {
            treeInput.setAttribute('checked', 'checked');
        }
        treeInput.addEventListener("change", toggleStorage);
        
        let treeLabel = document.createElement('label');
        treeLabel.setAttribute('for', 'checkbox');
        treeLabel.innerText = "Tree Notifications";

        treeInputContainer.append(treeInput);
        treeInputContainer.append(treeLabel);

        menu.appendChild(treeInputContainer);

        // Shiny Tree Notifications Checkbox
        let shinyTreeInputContainer = document.createElement('div');
        shinyTreeInputContainer.setAttribute('class', 'dhm-helper-inputContainer dhm-helper-inputContainer-sub');
        let shinyTreeInput = document.createElement('input');
        shinyTreeInput.setAttribute('type', 'checkbox');
        shinyTreeInput.setAttribute('name', 'dhm-notificationsInput');
        shinyTreeInput.setAttribute('data-storage', 'hShinyTree');
        
        if (localStorage.hShinyTree === "true") {
            shinyTreeInput.setAttribute('checked', 'checked');
        }
        shinyTreeInput.addEventListener("change", toggleStorage);
        
        let shinyTreeLabel = document.createElement('label');
        shinyTreeLabel.setAttribute('for', 'checkbox');
        shinyTreeLabel.innerText = "Shiny Tree Notifications";

        shinyTreeInputContainer.append(shinyTreeInput);
        shinyTreeInputContainer.append(shinyTreeLabel);

        menu.appendChild(shinyTreeInputContainer);

        // Planter Notifications Checkbox
        let planterInputContainer = document.createElement('div');
        planterInputContainer.setAttribute('class', 'dhm-helper-inputContainer dhm-helper-inputContainer-sub');
        let planterInput = document.createElement('input');
        planterInput.setAttribute('type', 'checkbox');
        planterInput.setAttribute('name', 'dhm-notificationsInput');
        planterInput.setAttribute('data-storage', 'hPlanter');
        
        if (localStorage.hPlanter === "true") {
            planterInput.setAttribute('checked', 'checked');
        }
        planterInput.addEventListener("change", toggleStorage);
        
        let planterLabel = document.createElement('label');
        planterLabel.setAttribute('for', 'checkbox');
        planterLabel.innerText = "Planter Notifications";

        planterInputContainer.append(planterInput);
        planterInputContainer.append(planterLabel);

        menu.appendChild(planterInputContainer);

        // Explorer Notifications Checkbox
        let explorerInputContainer = document.createElement('div');
        explorerInputContainer.setAttribute('class', 'dhm-helper-inputContainer dhm-helper-inputContainer-sub');
        let explorerInput = document.createElement('input');
        explorerInput.setAttribute('type', 'checkbox');
        explorerInput.setAttribute('name', 'dhm-notificationsInput');
        explorerInput.setAttribute('data-storage', 'hExplorer');
        
        if (localStorage.hExplorer === "true") {
            explorerInput.setAttribute('checked', 'checked');
        }
        explorerInput.addEventListener("change", toggleStorage);
        
        let explorerLabel = document.createElement('label');
        explorerLabel.setAttribute('for', 'checkbox');
        explorerLabel.innerText = "Explorer Notifications";

        explorerInputContainer.append(explorerInput);
        explorerInputContainer.append(explorerLabel);

        menu.appendChild(explorerInputContainer);

        // Teleport Notifications Checkbox
        let teleportInputContainer = document.createElement('div');
        teleportInputContainer.setAttribute('class', 'dhm-helper-inputContainer dhm-helper-inputContainer-sub');
        let teleportInput = document.createElement('input');
        teleportInput.setAttribute('type', 'checkbox');
        teleportInput.setAttribute('name', 'dhm-notificationsInput');
        teleportInput.setAttribute('data-storage', 'hTeleport');
        
        if (localStorage.hTeleport === "true") {
            teleportInput.setAttribute('checked', 'checked');
        }
        teleportInput.addEventListener("change", toggleStorage);
        
        let teleportLabel = document.createElement('label');
        teleportLabel.setAttribute('for', 'checkbox');
        teleportLabel.innerText = "Teleport Notifications";

        teleportInputContainer.append(teleportInput);
        teleportInputContainer.append(teleportLabel);

        menu.appendChild(teleportInputContainer);

        // Shiny Monster Notifications Checkbox
        let shinyInputContainer = document.createElement('div');
        shinyInputContainer.setAttribute('class', 'dhm-helper-inputContainer dhm-helper-inputContainer-sub');
        let shinyInput = document.createElement('input');
        shinyInput.setAttribute('type', 'checkbox');
        shinyInput.setAttribute('name', 'dhm-notificationsInput');
        shinyInput.setAttribute('data-storage', 'hShiny');
        
        if (localStorage.hShiny === "true") {
            shinyInput.setAttribute('checked', 'checked');
        }
        shinyInput.addEventListener("change", toggleStorage);
        
        let shinyLabel = document.createElement('label');
        shinyLabel.setAttribute('for', 'checkbox');
        shinyLabel.innerText = "Shiny Monster Notifications";

        shinyInputContainer.append(shinyInput);
        shinyInputContainer.append(shinyLabel);

        menu.appendChild(shinyInputContainer);

        // Cousin Notifications Checkbox
        let cousinInputContainer = document.createElement('div');
        cousinInputContainer.setAttribute('class', 'dhm-helper-inputContainer dhm-helper-inputContainer-sub');
        let cousinInput = document.createElement('input');
        cousinInput.setAttribute('type', 'checkbox');
        cousinInput.setAttribute('name', 'dhm-notificationsInput');
        cousinInput.setAttribute('data-storage', 'hCousin');
        
        if (localStorage.hCousin === "true") {
            cousinInput.setAttribute('checked', 'checked');
        }
        cousinInput.addEventListener("change", toggleStorage);
        
        let cousinLabel = document.createElement('label');
        cousinLabel.setAttribute('for', 'checkbox');
        cousinLabel.innerText = "Cousin Notifications";

        cousinInputContainer.append(cousinInput);
        cousinInputContainer.append(cousinLabel);

        menu.appendChild(cousinInputContainer);

        // Boat Notifications Checkbox
        let boatInputContainer = document.createElement('div');
        boatInputContainer.setAttribute('class', 'dhm-helper-inputContainer dhm-helper-inputContainer-sub');
        let boatInput = document.createElement('input');
        boatInput.setAttribute('type', 'checkbox');
        boatInput.setAttribute('name', 'dhm-notificationsInput');
        boatInput.setAttribute('data-storage', 'hBoat');
        
        if (localStorage.hBoat === "true") {
            boatInput.setAttribute('checked', 'checked');
        }
        boatInput.addEventListener("change", toggleStorage);
        
        let boatLabel = document.createElement('label');
        boatLabel.setAttribute('for', 'checkbox');
        boatLabel.innerText = "Boat Notifications";

        boatInputContainer.append(boatInput);
        boatInputContainer.append(boatLabel);

        menu.appendChild(boatInputContainer);

        // Chef Notifications Checkbox
        let chefInputContainer = document.createElement('div');
        chefInputContainer.setAttribute('class', 'dhm-helper-inputContainer dhm-helper-inputContainer-sub');
        let chefInput = document.createElement('input');
        chefInput.setAttribute('type', 'checkbox');
        chefInput.setAttribute('name', 'dhm-notificationsInput');
        chefInput.setAttribute('data-storage', 'hChef');
        
        if (localStorage.hChef === "true") {
            chefInput.setAttribute('checked', 'checked');
        }
        chefInput.addEventListener("change", toggleStorage);
        
        let chefLabel = document.createElement('label');
        chefLabel.setAttribute('for', 'checkbox');
        chefLabel.innerText = "Chef Notifications";

        chefInputContainer.append(chefInput);
        chefInputContainer.append(chefLabel);

        menu.appendChild(chefInputContainer);

        // Goblin Shop Notifications Checkbox
        let goblinShopInputContainer = document.createElement('div');
        goblinShopInputContainer.setAttribute('class', 'dhm-helper-inputContainer dhm-helper-inputContainer-sub');
        let goblinShopInput = document.createElement('input');
        goblinShopInput.setAttribute('type', 'checkbox');
        goblinShopInput.setAttribute('name', 'dhm-notificationsInput');
        goblinShopInput.setAttribute('data-storage', 'hGoblinShop');
        
        if (localStorage.hGoblinShop === "true") {
            goblinShopInput.setAttribute('checked', 'checked');
        }
        goblinShopInput.addEventListener("change", toggleStorage);
        
        let goblinShopLabel = document.createElement('label');
        goblinShopLabel.setAttribute('for', 'checkbox');
        goblinShopLabel.innerText = "Goblin Shop Notifications";

        goblinShopInputContainer.append(goblinShopInput);
        goblinShopInputContainer.append(goblinShopLabel);

        menu.appendChild(goblinShopInputContainer);

        document.body.appendChild(menu);
    }

    function grantNotifications() {
        if (localStorage["hNotifications"] && localStorage["hNotifications"] == "true") {
            localStorage["hNotifications"] = "false";
        } else {
            if (Notification.permission !== "granted") {
                Notification.requestPermission(function(permission) {
                    if (permission === "granted") {
                        localStorage["hNotifications"] = "true";
                    } else {
                        alert("You will need to need desktop notifcations for DHM alerts to work.")
                    }
                  });
            } else {
                localStorage["hNotifications"] = "true";
            }
        }
    }

    function toggleStorage() {
        let name = this.getAttribute('data-storage');
        if (localStorage[name] && localStorage[name] == "true") {
            localStorage[name] = "false";
        } else {
            localStorage[name] = "true";
        }
    }

    function toggleMenu() {
        let menu = document.getElementById('dhm-helper-menu');
        menu.style.display = menu.style.display === 'none' ? '' : 'none';
    }

window.toggleMenu2 = toggleMenu 

	function init() {
		// Daily Mission
		var dailyObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-dailyMissionNotification").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hDaily === "true")) {
                        var notification = new Notification("Daily Mission Available",{ icon: 'images/dailyMissions.png' });
                    }
                }
            });    
        });
		
		var dailyTarget = document.getElementById('notification-dailyMissionNotification');
        dailyObserver.observe(dailyTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Treasure Map
		var mapObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-treasureMapNotification").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hMap === "true")) {
                        var notification = new Notification("Treasure Map Found",{ icon: 'images/treasureMap.png' });
                    }
                }
            });    
        });
		
		var mapTarget = document.getElementById('notification-treasureMapNotification');
        mapObserver.observe(mapTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Green Treasure Map
		var greenMapObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-greenTreasureMapNotification").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hMap === "true")) {
                        var notification = new Notification("Green Treasure Map Found",{ icon: 'images/greenTreasureMap.png' });
                    }
                }
            });    
        });
		
		var greenMapTarget = document.getElementById('notification-greenTreasureMapNotification');
        greenMapObserver.observe(greenMapTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Event
		var eventObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("main-button-event").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hEvent === "true")) {
                        var notification = new Notification("Event Coming",{ icon: 'images/meteorEvent.png' });
                    }
                }
            });    
        });
		
		var eventTarget = document.getElementById('main-button-event');
        eventObserver.observe(eventTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Event Glowing
		var glowingObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-eventFullyActiveNotification").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hEvent === "true")) {
                        var notification = new Notification("Event Glowing",{ icon: 'images/meteorActionEvent.png' });
                    }
                }
            });    
        });
		
		var glowingTarget = document.getElementById('notification-eventFullyActiveNotification');
        glowingObserver.observe(glowingTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Researcher
		var researchObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-researcherNotification").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hResearch === "true")) {
                        var notification = new Notification("Research Ready",{ icon: 'images/researcher.png' });
                    }
                }
            });    
        });
		
		var researchTarget = document.getElementById('notification-researcherNotification');
        researchObserver.observe(researchTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Train Ready
		var trainObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-profileNotificationsOffTrain").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hTrain === "true")) {
                        var notification = new Notification("Train Ready",{ icon: 'images/train.png' });
                    }
                }
            });    
        });
		
		var trainTarget = document.getElementById('notification-profileNotificationsOffTrain');
        trainObserver.observe(trainTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Train at Destination
		var trainDestinationObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-trainNotification").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hTrain === "true")) {
                        var notification = new Notification("Train Ready To Collect",{ icon: 'images/train.png' });
                    }
                }
            });    
        });
		
		var trainDestinationTarget = document.getElementById('notification-trainNotification');
        trainDestinationObserver.observe(trainDestinationTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Rocket Ready
		var rocketObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-profileNotificationsOffRocket").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hRocket === "true")) {
                        var notification = new Notification("Rocket Ready",{ icon: 'images/rocket.png' });
                    }
                }
            });    
        });
		
		var rocketTarget = document.getElementById('notification-profileNotificationsOffRocket');
        rocketObserver.observe(rocketTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Rocket at Destination
		var rocketDestinationObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-rocketNotification").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hRocket === "true")) {
                        var notification = new Notification("Rocket Ready To Collect",{ icon: 'images/rocket.png' });
                    }
                }
            });    
        });
		
		var rocketDestinationTarget = document.getElementById('notification-rocketNotification');
        rocketDestinationObserver.observe(rocketDestinationTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Furnace Idle
		var furnaceObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-profileNotificationsOffFurnace").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hFurnace === "true")) {
                        var notification = new Notification("Furnace Empty",{ icon: 'images/goldFurnace.png' });
                    }
                }
            });    
        });
		
		var furnaceTarget = document.getElementById('notification-profileNotificationsOffFurnace');
        furnaceObserver.observe(furnaceTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Foundry Idle
		var foundryObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-charcoalFoundryPercentage").style.display == "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hFoundry === "true")) {
                        var notification = new Notification("Foundry Empty",{ icon: 'images/charcoalFoundry.png' });
                    }
                }
            });    
        });
		
		var foundryTarget = document.getElementById('notification-charcoalFoundryPercentage');
        foundryObserver.observe(foundryTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Refinary Idle
		var refinaryObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-goldBarRefineryNotification").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hRefinary === "true")) {
                        var notification = new Notification("Refinary Ready",{ icon: 'images/goldRefinary.png' });
                    }
                }
            });    
        });
		
		var refinaryTarget = document.getElementById('notification-goldBarRefineryNotification');
        refinaryObserver.observe(refinaryTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Tree Ready
		var treeObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-treeNotification").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hTree === "true")) {
                        var notification = new Notification("Tree Ready",{ icon: 'images/tree.png' });
                    }
                }
            });    
        });
		
		var treeTarget = document.getElementById('notification-treeNotification');
        treeObserver.observe(treeTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Shiny Tree
		var shinyTree1Observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("tree-thumbnail-img-1").style.backgroundImage == 'url("images/shiny.gif")') {
                    if ((localStorage.hNotifications === "true") && (localStorage.hShinyTree === "true")) {
                        var notification = new Notification("Shiny Tree Growing",{ icon: 'images/shiny.gif' });
                    }
                }
            });    
        });
		
		var shinyTree1Target = document.getElementById('tree-thumbnail-img-1');
        shinyTree1Observer.observe(shinyTree1Target, { attributes : true, attributeFilter : ['style'] });
		//2
		var shinyTree2Observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("tree-thumbnail-img-2").style.backgroundImage == 'url("images/shiny.gif")') {
                    if ((localStorage.hNotifications === "true") && (localStorage.hShinyTree === "true")) {
                        var notification = new Notification("Shiny Tree Growing",{ icon: 'images/shiny.gif' });
                    }
                }
            });    
        });
		
		var shinyTree2Target = document.getElementById('tree-thumbnail-img-2');
        shinyTree2Observer.observe(shinyTree2Target, { attributes : true, attributeFilter : ['style'] });
		//3
		var shinyTree3Observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("tree-thumbnail-img-3").style.backgroundImage == 'url("images/shiny.gif")') {
                    if ((localStorage.hNotifications === "true") && (localStorage.hShinyTree === "true")) {
                        var notification = new Notification("Shiny Tree Growing",{ icon: 'images/shiny.gif' });
                    }
                }
            });    
        });
		
		var shinyTree3Target = document.getElementById('tree-thumbnail-img-3');
        shinyTree3Observer.observe(shinyTree3Target, { attributes : true, attributeFilter : ['style'] });
		//4
		var shinyTree4Observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("tree-thumbnail-img-4").style.backgroundImage == 'url("images/shiny.gif")') {
                    if ((localStorage.hNotifications === "true") && (localStorage.hShinyTree === "true")) {
                        var notification = new Notification("Shiny Tree Growing",{ icon: 'images/shiny.gif' });
                    }
                }
            });    
        });
		
		var shinyTree4Target = document.getElementById('tree-thumbnail-img-4');
        shinyTree4Observer.observe(shinyTree4Target, { attributes : true, attributeFilter : ['style'] });
		//5
		var shinyTree5Observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("tree-thumbnail-img-5").style.backgroundImage == 'url("images/shiny.gif")') {
                    if ((localStorage.hNotifications === "true") && (localStorage.hShinyTree === "true")) {
                        var notification = new Notification("Shiny Tree Growing",{ icon: 'images/shiny.gif' });
                    }
                }
            });    
        });
		
		var shinyTree5Target = document.getElementById('tree-thumbnail-img-5');
        shinyTree5Observer.observe(shinyTree5Target, { attributes : true, attributeFilter : ['style'] });
		//6
		var shinyTree6Observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("tree-thumbnail-img-6").style.backgroundImage == 'url("images/shiny.gif")') {
                    if ((localStorage.hNotifications === "true") && (localStorage.hShinyTree === "true")) {
                        var notification = new Notification("Shiny Tree Growing",{ icon: 'images/shiny.gif' });
                    }
                }
            });    
        });
		
		var shinyTree6Target = document.getElementById('tree-thumbnail-img-6');
        shinyTree6Observer.observe(shinyTree6Target, { attributes : true, attributeFilter : ['style'] });
		
		// Planter Empty
		var planterObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-profileNotificationsOffPlanter").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hPlanter === "true")) {
                        var notification = new Notification("Planter Idle",{ icon: 'images/planter.png' });
                    }
                }
            });    
        });
		
		var planterTarget = document.getElementById('notification-profileNotificationsOffPlanter');
        planterObserver.observe(planterTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Explorer Idle
		var explorerObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-exploringNotification").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hExplorer === "true")) {
                        var notification = new Notification("Explorer Idle",{ icon: 'images/explorer.png' });
                    }
                }
            });    
        });
		
		var explorerTarget = document.getElementById('notification-exploringNotification');
        explorerObserver.observe(explorerTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Teleport Ready
		var teleportObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("explorer-teleportCd-label").style.display == "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hTeleport === "true")) {
                        var notification = new Notification("Teleport Ready",{ icon: 'images/teleportSpell.png' });
                    }
                }
            });    
        });
		
		var teleportTarget = document.getElementById('explorer-teleportCd-label');
        teleportObserver.observe(teleportTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Shiny Monster
		var shinyObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("img-tag-monster-shiny").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hShiny === "true")) {
                        var notification = new Notification("Shiny Monster",{ icon: 'images/shiny.gif' });
                    }
                }
            });    
        });
		
		var shinyTarget = document.getElementById('img-tag-monster-shiny');
        shinyObserver.observe(shinyTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Cousin Idle
		var cousinObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-exploringNotification2").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hCousin === "true")) {
                        var notification = new Notification("Cousin Idle",{ icon: 'images/goblinCousin.png' });
                    }
                }
            });    
        });
		
		var cousinTarget = document.getElementById('notification-exploringNotification2');
        cousinObserver.observe(cousinTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Boat Idle
		var boatObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-rowBoatNotification").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hBoat === "true")) {
                        var notification = new Notification("Boat Ready",{ icon: 'images/rowBoat.png' });
                    }
                }
            });    
        });
		
		var boatTarget = document.getElementById('notification-rowBoatNotification');
        boatObserver.observe(boatTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Canoe Idle
		var canoeObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-canoeBoatNotification").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hBoat === "true")) {
                        var notification = new Notification("Canoe Ready",{ icon: 'images/canoeBoat.png' });
                    }
                }
            });    
        });
		
		var canoeTarget = document.getElementById('notification-canoeBoatNotification');
        canoeObserver.observe(canoeTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Sail Idle
		var sailObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-sailBoatNotification").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hBoat === "true")) {
                        var notification = new Notification("Sail Ready",{ icon: 'images/sailBoat.png' });
                    }
                }
            });    
        });
		
		var sailTarget = document.getElementById('notification-sailBoatNotification');
        sailObserver.observe(sailTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Steam Idle
		var steamObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-steamBoatNotification").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hBoat === "true")) {
                        var notification = new Notification("Steam Ready",{ icon: 'images/steamBoat.png' });
                    }
                }
            });    
        });
		
		var steamTarget = document.getElementById('notification-steamBoatNotification');
        steamObserver.observe(steamTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Trawler Idle
		var trawlerObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-trawlerNotification").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hBoat === "true")) {
                        var notification = new Notification("Trawler Ready",{ icon: 'images/trawler.png' });
                    }
                }
            });    
        });
		
		var trawlerTarget = document.getElementById('notification-trawlerNotification');
        trawlerObserver.observe(trawlerTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Chef Ready
		var chefObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-chefNotification").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hChef === "true")) {
                        var notification = new Notification("Chef Ready",{ icon: 'images/chef.png' });
                    }
                }
            });    
        });
		
		var chefTarget = document.getElementById('notification-chefNotification');
        chefObserver.observe(chefTarget, { attributes : true, attributeFilter : ['style'] });
		
		// Goblin Shop
		var goblinShopObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                if (document.getElementById("notification-gemGoblinShopNotification").style.display !== "none") {
                    if ((localStorage.hNotifications === "true") && (localStorage.hGoblinShop === "true")) {
                        var notification = new Notification("Goblin Shop New Items",{ icon: 'images/gemGoblinShopIcon.png' });
                    }
                }
            });    
        });
		
		var goblinShopTarget = document.getElementById('notification-gemGoblinShopNotification');
        goblinShopObserver.observe(goblinShopTarget, { attributes : true, attributeFilter : ['style'] });
		
	}
});


