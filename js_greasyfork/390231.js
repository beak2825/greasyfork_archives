// ==UserScript==
// @name         Goatlings: Battle Center Auto-Fighter
// @version      3.0.22
// @description  Auto-fights the baddy of choice in the Battle Center.
// @author       Felix "Automalix" G.
// @namespace    https://greasyfork.org/users/322117
// @match        https://www.goatlings.com/
// @match        https://www.goatlings.com/*
// @downloadURL https://update.greasyfork.org/scripts/390231/Goatlings%3A%20Battle%20Center%20Auto-Fighter.user.js
// @updateURL https://update.greasyfork.org/scripts/390231/Goatlings%3A%20Battle%20Center%20Auto-Fighter.meta.js
// ==/UserScript==

+(function() {
	'use strict';
	function setStoredValue(key, value) {
		if (value == null || value == undefined || !value) {
			sessionStorage.removeItem(key);
		} else {
			if (typeof value != 'number' && typeof value != 'string') {
				value = JSON.stringify(value);
			}
			sessionStorage.setItem(key, value);
		}
	}
	function getStoredValue(key, safety) {
		let value = sessionStorage.getItem(key);
		if (value) {
			if (typeof value == 'string') {
				try {
					return JSON.parse(value);
				} catch (ex) {
					console.log(ex);
				}
			}
			return value;
		}
		return safety;
	}
	/////////////////////////////////

    let stored = getStoredValue('Auto-Fighter Battle Parameters', {}); //the object with all of the power
    let itemStorage = getStoredValue('Saved Items List', {});
    let generalCase = "Battling in progress.";
    const content = document.body.textContent || document.body.innerText;
	const delay = Math.round(Math.random() * (1000 - 2500)) + 2000;

	const url = {
		challengers: 'https://www.goatlings.com/battle/challengers',
		theBattle: 'https://www.goatlings.com/battle/thebattle',
		inventory: 'https://www.goatlings.com/inventory/',
		fountain: 'https://www.goatlings.com/fountain',
		battleOver: 'https://www.goatlings.com/battle/over'
    };

    ////////////////////////////////

    //custom CSS styling
    function addGlobalStyle(css) {
		if (!document.head) return;
		let style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML += css;
		document.head.appendChild(style);
	}

	//returns string with url of available weapon
	function getWeapon() {
		let links = document.links;
        let urls = [];
		for (let value in links) {
			urls.push(links[value].href);
		}
		const WEAPON = urls.find(value => /\/battle\/attack\/\d+/g.test(value));
		return WEAPON;
    }
    //return string with url of item from one of our lists
    function itemFinder(arr) {
        let listItemArr = arr;
        if (document.querySelectorAll('.item-invent')) {
            let items = document.querySelectorAll('.item-invent');
            let itemNames = [];
            for (let item of items) {
                itemNames.push(item.childNodes[2].textContent);
            }
            console.log(itemNames);
            let foundItemPosition = -1;
            let URL = listItemArr.map(currentItem => {
                console.log(currentItem);
                foundItemPosition = itemNames.indexOf(currentItem);
                if (foundItemPosition >= 0) {
                    let foundItem = items[foundItemPosition].childNodes[2].parentNode;
                    return String(foundItem.childNodes[0].href);
                }
            });
            console.log(URL)
            return URL;
        }
        return;
    };
    //go to the url of an item we found from a list (setting a flag to confirm we're getting an item)
    function clickOnItem(itemArr) {
        let itemURL = itemFinder(itemArr)[0];
        if(!itemURL) itemURL = itemFinder(itemArr)[1];
        if(!itemURL) itemURL = itemFinder(itemArr)[2];
        if(!itemURL) itemURL = itemFinder(itemArr)[3];
        if (itemURL && itemURL.length > 0) {
            stored['Do we need an item?'] = true;
            setStoredValue('Auto-Fighter Battle Parameters', stored);
            setTimeout(() => {
                location.href = itemURL;
            }, delay);
        } else {
            alert('No usable item in inventory!');
            console.log(
                `No usable item in inventory!\nCase: ${stored['Goat Status']}`
            );
        }
    };
	// Count how many battles against a baddie we've made
	function battleCounter() {
        let a, b, c;
        let battleArr = []
        let position = stored['Target Baddie'];

        document.querySelectorAll('.battle-grid').forEach(cur => {
            a = cur.lastChild.childNodes[19].textContent.replace(/\D/g,'');
            b = cur.lastChild.childNodes[21].textContent.replace(/\D/g,'');
            c = cur.lastChild.childNodes[23].textContent.replace(/\D/g,'');
            if(a === "") a = 0;
            if(b === "") b = 0;
            if(c === "") c = 0;
            battleArr.push([Number(a),Number(b),Number(c)]);
        })
        stored['Current Battle Count'] = battleArr[position].reduce((a, b) => a + b, 0);
        if(stored.Round > 0){
            stored.Round++
        } else {
            stored.Round = 1;
        }
        return battleArr[position];
	}

	// This function appears on startup
	function inputBox() {
		+ function inputBoxConstructor() {
            let itemListBox = '';
            let battleConfigBox = '';

			addGlobalStyle(`
            #form {
                width: 700px;
                margin: 5px auto;
                padding: 10px 2em 0 2em
            }
            #consumableForm {
                width: 700px;
                margin: 5px auto;
            }
            .shortForm {
                display: flex;
                justify-content: space-around;
                height: 100px;
                align-content: center;
            }
            .flex {
                width: 85%;
                margin: 5px auto;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .bottom {
                margin-top: 10px;
                margin-bottom: 10px;
            }
            .basis {
                flex-basis: 60%;
            }
            .label {
                flex-basis: 40%;
            }
            .basis-mini {
                flex-basis: 20%;
            }
            .start {
                margin: 10px auto;
                text-align: center;
            }
            label {
                font-weight: bold;
            }
            legend {
                margin: 0 auto;
                font-size: 130%;
                font-weight: bold;
            }
            .large {
                font-size: 120%;
            }
            fieldset, .decoration {
                border: 1px solid var(--main-faded);
                border-radius: 6px;
                margin: 0;
            }
            .decoration {
                border-color: #e6dfd7;
                padding: 3px 9px;
                margin-top: 3px;
            }
            .hiddenEl {
                display: none;
            }
            .confirmSavedText {
                color: #4caf50;
            }
            .startBattleBtn {
                font-weight: bold;
                background-color: #4cabe3;
                border-color: #4cabe3;
            }
            .startBattleBtn:hover, .startBattleBtn:focus {
                font-weight: bold;
                color: white;
                background-color: #68c9f3;
                border-color: #68c9f3;
            }
            .resetBattleBtn{
                background-color: #999;
                border-color: #999;
            }
            .resetBattleBtn:hover, .resetBattleBtn:focus {
                background-color: #AAA;
                border-color: #AAA;
            }
            .saveBattleBtn{
                background-color: #6ac30f;
                border-color: #6ac30f;
            }
            .saveBattleBtn:hover, .saveBattleBtn:focus {
                background-color: #6cd94e;
                border-color: #6cd94e;
            }`);

            if (stored.Saved){
                battleConfigBox = `<section>
                    <fieldset id="form" class="shortForm">
                        <legend>Goatlings Battle Center Auto-Fighter</legend>
                        <div>
                            <b class="label">Selected Goatling:</b>
                            <br>
                            <p class="decoration">${document.querySelector(`option[value="${stored['Battle Goat']}"]`).textContent}</p>
                        </div>
                        <div>
                            <b class="label">Selected Challenger:</b>
                            <br>
                            <p class="decoration">${document.querySelector('.battle-grid').parentNode.childNodes[stored["Target Baddie"]+1].children[0].childNodes[2].textContent}</p>
                        </div>
                        <div>
                            <b class="label">Number of Battles:</b>
                            <br>
                            <p class="decoration">${stored["Fights"]}</p>
                        </div>
                    </fieldset>
                </section>
                <div>
                    <button id="resetBattleValues" class="button mini-height mini-padding basis-mini resetBattleBtn" style="margin-bottom:3px; text-align:center">Reset Battle Config</button>
                </div>`;
            } else {
                battleConfigBox = `<section>
                <fieldset id="form">
                    <legend>Goatlings Battle Center Auto-Fighter</legend>
                    <div class="flex">
                        <label for="customPetSelector" class="label">Select Goatling:</label>
                        <select id="customPetSelector" class="basis custom-select"></select>
                    </div>
                    <div class="flex">
                        <label for="customBaddieSelector" class="label">Select Challenger:</label>
                        <select id="customBaddieSelector" class="basis custom-select"></select>
                    </div>
                    <div class="flex">
                        <label for="numberOfFights" class="label">Number of Battles:</label>
                        <input type="number" id="numberOfFights" value="1" class="basis custom-input">
                    </div>
                    <div class="flex bottom">
                        <button id="resetBattleValues" class="button mini-height mini-padding basis-mini resetBattleBtn">Reset Battle Config</button>
                        <div class="label">
                        <div id="savedBattleToast" class="confirmSavedText hiddenEl">
                            Saved Battle Configuration!
                        </div>
                        <div id="resetBattleToast" class="confirmResetText hiddenEl">
                            Battle Configuration Reset
                        </div>
                        </div>
                        <button id="saveBattleValues" class="button mini-height mini-padding basis-mini saveBattleBtn">Save Battle Config</button>
                    </div>
                </fieldset>
            </section>`
            }
            if (itemStorage.Saved) {
				itemListBox = `<button id="resetItemValues" class="button mini-height mini-padding basis-mini resetBattleBtn" style="text-align:center">Reset Item Lists</button>`;
			} else {
				itemListBox = `<section>
                <fieldset id="consumableForm">
                    <legend>Consumable Items</legend>
                    <div>
                        Seperate items by hitting enter in between each one. No additional periods / commas necessary.
                    </div>
                    <div class="flex">
                    <div>
                        <label for="foodList" class="label">Food Items to Use:</label>
                        <br>
                        <textarea id="foodList" class="custom-input" rows="5" style="margin-top:3px">Rainbow Fruit\nRainbow Apple\nHoney and Apples</textarea>
                    </div>
                    <div>
                        <label for="toyList" class="label">Toys to Use:</label>
                        <br>
                        <textarea id="toyList" class="custom-input" rows="5" style="margin-top:3px">Plush Deer\nPlush Fox\nPlush Skunk\nPlush Unicorn</textarea>
                    </div>
                    <div>
                        <label for="weaponList" class="label">Weapons to Use:</label>
                        <br>
                        <textarea id="weaponList" class="custom-input" rows="5" style="margin-top:3px">Hero Sword</textarea>
                    </div>
                    </div>
                    <div class="flex bottom" style="justify-content:space-around">
                        <button id="resetItemValues" class="button mini-height mini-padding basis-mini resetBattleBtn">Reset Items</button>
                        <div class="label">
                        <div id="savedItemToast" class="confirmSavedText hiddenEl">
                            Saved Item Lists!
                        </div>
                        <div id="resetItemToast" class="confirmResetText hiddenEl">
                            Item List Reset
                        </div>
                        </div>
                        <button id="saveItemValues" class="button mini-height mini-padding basis-mini saveBattleBtn">Save Items</button>
                    </div>
                </fieldset>
                </section>`;
            }
            if (itemStorage.Saved && stored.Saved){
                battleConfigBox = `<section>
                    <fieldset id="form" class="shortForm">
                        <legend>Goatlings Battle Center Auto-Fighter</legend>
                        <div>
                            <b class="label">Selected Goatling:</b>
                            <br>
                            <p class="decoration">${document.querySelector(`option[value="${stored['Battle Goat']}"]`).textContent}</p>
                        </div>
                        <div>
                            <b class="label">Selected Challenger:</b>
                            <br>
                            <p class="decoration">${document.querySelector('.battle-grid').parentNode.childNodes[stored["Target Baddie"]+1].children[0].childNodes[2].textContent}</p>
                        </div>
                        <div>
                            <b class="label">Number of Battles:</b>
                            <br>
                            <p class="decoration">${stored["Fights"]}</p>
                        </div>
                    </fieldset>
                </section>
                <div class="flex" style="width:500px">
                    <button id="resetBattleValues" class="button mini-height mini-padding basis-mini resetBattleBtn">Reset Battle Config</button>
                    <button id="resetItemValues" class="button mini-height mini-padding basis-mini resetBattleBtn">Reset Items</button>
                </div>`;
                itemListBox = "";
            }
			document.querySelector('.battle-grid').parentNode.insertAdjacentHTML('beforebegin',
                `${battleConfigBox}
                 ${itemListBox}
                <div class="start">
                    <button id="startProgram" class="large button startBattleBtn">Start Auto-Battling!</button>
                </div>`
			);
		}();

		let resetBattleValuesButton = document.getElementById('resetBattleValues');
		let resetItemValuesButton = document.getElementById('resetItemValues');
        let savedItemToast;
        let savedBattleToast;
        let saveItemValuesButton;
        let saveBattleValuesButton;

		if (document.getElementById('saveItemValues')) {
            savedItemToast = document.getElementById('savedItemToast');
			saveItemValuesButton = document.getElementById('saveItemValues');
		}
        if (document.getElementById('saveBattleValues')) {
            saveBattleValuesButton = document.getElementById('saveBattleValues');
            savedBattleToast = document.getElementById('savedBattleToast');

            + function createGoatDropdown() {
                const dropdown = document.querySelector('select[name="petid"]');
                let goatValueArray = [];
                let goatOptionTextArray = [];
                for (let i = 0; i < dropdown.length; i++) {
                    goatOptionTextArray.push(dropdown[i].text);
                    goatValueArray.push(dropdown[i].value);

                    let customGoatDropdown = document.createElement('option'); // populates customPetSelector with options/values
                    customGoatDropdown.textContent = goatOptionTextArray[i];
                    customGoatDropdown.value = goatValueArray[i];
                    document
                        .getElementById('customPetSelector')
                        .appendChild(customGoatDropdown);
                }
            }();
            + function createBaddieDropdown() {
                let challengerNameArray = [];
                let table = document.querySelectorAll('.battle-grid');
                table.forEach(e => {
                    challengerNameArray.push(e.lastChild.childNodes[2].textContent)
                });
                for (let baddiePositionValue in challengerNameArray) {
                    let customBaddieDropdown = document.createElement('option');
                    customBaddieDropdown.textContent = challengerNameArray[baddiePositionValue];
                    customBaddieDropdown.value = baddiePositionValue;
                    document
                        .getElementById('customBaddieSelector')
                        .appendChild(customBaddieDropdown);
                }
            }();
        }
            // grabs the value selected on a provided dropdown ID
            function getSelectedOption(elementValue) {
                let element = document.getElementById(elementValue);
                if (element.selectedIndex == -1) {
                    return null;
                }
                return element.options[element.selectedIndex].value;
            }

            //Setting the three variables, goat ID, enemy position on page, number of battles
            function saveBattleValues() {
                let selectedPet = getSelectedOption('customPetSelector');
                let selectedBaddie = getSelectedOption('customBaddieSelector');
                let numberOfFights = Number(
                    document.getElementById('numberOfFights').value
                );

                if (numberOfFights > 0 && numberOfFights % 1 == 0) {
                    stored['Battle Goat'] = Number(selectedPet);
                    stored['Target Baddie'] = Number(selectedBaddie);
                    stored.Fights = numberOfFights;
                    stored.Saved = true;
                    stored.useCase = 'Ready for battle';

                    let arr = battleCounter();
                    stored['End Goal'] = arr.reduce((a, b) => a + b, 0) + stored.Fights;
                    setStoredValue('Auto-Fighter Battle Parameters', stored);

                    document.querySelectorAll('select[name="petid"]')[stored['Target Baddie']].value = [stored['Battle Goat']];
                    savedBattleToast.classList.remove('hiddenEl');
                    console.log('Saved! Debug info below:');
                    console.log(stored);
                } else alert('Please input a number above zero!');
            }

		function saveItemValues() {
			let foodList = document.getElementById('foodList').value;
			let toyList = document.getElementById('toyList').value;
			let weaponList = document.getElementById('weaponList').value;

			if (!foodList && !toyList && !weaponList) {
				alert("You must enter at least one of each type of item to use, or the program won't work!");
				return;
			}

			foodList = foodList.replace(/[&\/\\#,+()$~%.":*?<>{}]/g, '');
			foodList = foodList.split(/\n/);
			for (let i = 0; i < foodList.length; i++) {
				foodList[i] = foodList[i].trim();
			}
			itemStorage.foodListArr = foodList;

			toyList = toyList.replace(/[&\/\\#,+()$~%.":*?<>{}]/g, '');
			toyList = toyList.split(/\n/);
			for (let i = 0; i < toyList.length; i++) {
				toyList[i] = toyList[i].trim();
			}
			itemStorage.toyListArr = toyList;

			weaponList = weaponList.replace(/[&\/\\#,+()$~%.":*?<>{}]/g, '');
			weaponList = weaponList.split(/\n/);
			for (let i = 0; i < weaponList.length; i++) {
				weaponList[i] = weaponList[i].trim();
			}
			itemStorage.weaponListArr = weaponList;
            itemStorage.Saved = true;

			setStoredValue('Saved Items List', itemStorage);
			console.log(itemStorage);

			savedItemToast.classList.remove('hiddenEl');
		}

		function resetBattleValues() {
			stored = {};
			setStoredValue('Auto-Fighter Battle Parameters', stored);
            location.reload(true);
		}

		function resetItemValues() {
			itemStorage = {};
            setStoredValue('Saved Items List', itemStorage);
            location.reload(true);
		}

		function startProgram() {
			if (stored.Saved && itemStorage.Saved) {
                stored['Auto-fighting'] = true;
                stored.useCase = generalCase;
				setStoredValue('Auto-Fighter Battle Parameters', stored);
				document
                    .querySelectorAll('input[value="Start Battle"]')[stored['Target Baddie']]
                    .click();
			} else {
                alert('Please save some values first!');
            }
		}

		resetBattleValuesButton.addEventListener('click', resetBattleValues);
        resetItemValuesButton.addEventListener('click', resetItemValues);
        if(document.getElementById('saveBattleValues')){
            saveBattleValuesButton.addEventListener('click', saveBattleValues);
        }
		if (document.getElementById('saveItemValues')) {
			saveItemValuesButton.addEventListener('click', saveItemValues);
		}

		document
			.querySelector('#startProgram')
			.addEventListener('click', startProgram);
    }

	// Check if we're already mid-auto-battling
	if (!stored['Auto-fighting'] && /\/battle\/challengers/.test(document.URL)) {
		inputBox();
	} else if (stored['Auto-fighting']) {

        //Status box drawn on every page during the course of the program's run
        + function battleStatusBox() {
            addGlobalStyle(
                `.battleStatus {margin:5px auto;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;}
                 .battleStatusTxt {width: 400px; border:1px solid var(--main-faded);border-radius:4px;margin:0}
                 .biggerTxt {font-size:120%; margin: 3px; auto}
                 .tag {margin: 0 auto; font-weight:bold}`
            );
            if(document.querySelector('.page-title')){
                addGlobalStyle(`.micro-button {padding: 0px 10px 2px 10px; height:22px; width:25%; margin:6px auto 0 auto; font-size: 90%;}`)
            document.querySelector('.page-title').insertAdjacentHTML('afterend',
                `<section class="battleStatus ">
                    <fieldset class="battleStatusTxt" style="display:flex; flex-direction: column; justify-content: center;">
                        <legend class="tag">Auto-Battle Status</legend>
                        <div class="biggerTxt">${stored.useCase}</div>
                        <a id="abort-mission" class="button micro-button">Cancel Script</a>
                    </fieldset>
                </section>`
            );
            } else {
                addGlobalStyle(`.micro-button {padding: 2px 10px -8px 10px; height:12px; width:25%; margin:6px auto 0 auto; font-size: 90%;}`)
                document.querySelector('#content').insertAdjacentHTML('afterbegin',
                `<section class="battleStatus ">
                    <fieldset class="battleStatusTxt" style="display:flex; flex-direction: column; justify-content: center;">
                        <legend class="tag">Auto-Battle Status</legend>
                        <div class="biggerTxt">${stored.useCase}</div>
                        <a id="abort-mission" class="button micro-button">Cancel Script</a>
                    </fieldset>
                </section>`
            );
            }
            document.querySelector('#abort-mission').addEventListener('click', () => {
                stored = {};
                setStoredValue('Auto-Fighter Battle Parameters', stored);
                location.reload(true);
            })
        }();

		switch (true) {
			case /\/battle\/challengers/.test(document.URL):
                battleCounter();
				console.log(stored);
				if (stored.Round === stored.Fights || stored['Current Battle Count'] >= stored['End Goal']) {
                    alert(`Finished ${stored.Fights} battle(s)!`);
                    stored = {};
                    sessionStorage.removeItem('Auto-Fighter Battle Parameters');
                    document.querySelector('section.battleStatus').remove();
					location.reload(true);
				} else {
					document.querySelectorAll('select[name="petid"]')[stored['Target Baddie']].value = [stored['Battle Goat']];
					setTimeout(() => {
						document
                            .querySelectorAll('input[value="Start Battle"]')[stored['Target Baddie']]
                            .click();
					}, delay);
				}
				break;

			case /\/battle\/create\/\d*/.test(document.URL):
				switch (true) {
					case content.search('too hungry to battle') > 0:
                        stored['Goat Status'] = 'HUNGRY';
                        stored.useCase = 'Getting Food for pet';
						setStoredValue('Auto-Fighter Battle Parameters', stored);
						setTimeout(() => {
							location.href = url.inventory;
						}, delay);
						break;
					case content.search('too unhappy to battle') > 0:
                        stored['Goat Status'] = 'UNHAPPY';
                        stored.useCase = 'Getting a Toy for pet';
						setStoredValue('Auto-Fighter Battle Parameters', stored);
						setTimeout(() => {
							location.href = url.inventory;
						}, delay);
						break;
					default:
                        stored.useCase = generalCase;
                        setStoredValue('Auto-Fighter Battle Parameters', stored);
						break;
				}
				break;

			case /\/battle\/thebattle/.test(document.URL):
				switch (true) {
					case /^1\//.test(document.getElementsByClassName('HP')[0].innerHTML):
                        stored['Goat Status'] = 'LOW_HP';
                        stored.useCase = 'Going to heal pet';
						setStoredValue('Auto-Fighter Battle Parameters', stored);
						setTimeout(() => {
							location.href = url.fountain;
						}, delay);
						break;
					case content.search('too hungry to battle') > 0:
                        stored['Goat Status'] = 'HUNGRY';
                        stored.useCase = 'Getting Food for pet';
						setStoredValue('Auto-Fighter Battle Parameters', stored);
						setTimeout(() => {
							location.href = url.inventory;
						}, delay);
						break;
					case content.search('too unhappy to battle') > 0:
                        stored['Goat Status'] = 'UNHAPPY';
                        stored.useCase = 'Getting a Toy for pet';
						setStoredValue('Auto-Fighter Battle Parameters', stored);
						setTimeout(() => {
							location.href = url.inventory;
						}, delay);
						break;
					default:
						(function() {
							let checkWeapon = getWeapon();
							let anchorList = '';
							for (let anchors of document.links) {
								anchorList += anchors.href + '\n';
							}
							switch (true) {
								case /\/battle\/over/.test(anchorList):
									setTimeout(() => {
										location.href = url.battleOver;
									}, delay);
									break;
								case typeof checkWeapon == 'string':
									setTimeout(() => {
										location.href = checkWeapon;
									}, delay);
									break;
								case !checkWeapon:
                                    stored['Goat Status'] = 'NO_WEAPON';
                                    stored.useCase = 'Getting a Weapon for pet';
									setStoredValue('Auto-Fighter Battle Parameters', stored);
									setTimeout(() => {
										location.href = url.inventory;
									}, delay);
									break;
							}
						})();
						break;
				}
				break;

			case /\/battle\/over/.test(document.URL):
				if (/^1\//.test(document.getElementsByClassName('HP')[0].innerHTML)) {
                    stored['Goat Status'] = 'LOW_HP';
                    stored.useCase = 'Going to heal pet';
					setStoredValue('Auto-Fighter Battle Parameters', stored);
					setTimeout(() => {
						location.href = url.fountain;
					}, delay);
				} else {
					setTimeout(() => {
						location.href = url.challengers;
					}, delay);
				}
				break;

			case /\/fountain/.test(document.URL):
				if (content.indexOf('ERROR: It costs 1,000 SS to heal your pets.') == -1) {
					if (stored['Goat Status'] == 'LOW_HP') {
                        delete stored['Goat Status'];
                        stored.useCase = generalCase;
						setStoredValue('Auto-Fighter Battle Parameters', stored);
						setTimeout(() => {
							document.querySelector('input[name="heal"]').click();
						}, delay);
					} else {
						console.log("We don't need healing");
						setTimeout(() => {
							location.href = url.challengers;
						}, delay);
					}
				} else alert("We don't have enough sugar stars!");
				break;

			case /\/inventory\/$/.test(document.URL):
                switch (stored['Goat Status']) {
                    case 'HUNGRY':
                        clickOnItem(itemStorage.foodListArr);
                        break;
                    case 'UNHAPPY':
                        clickOnItem(itemStorage.toyListArr);
                        break;
                    case 'NO_WEAPON':
                        clickOnItem(itemStorage.weaponListArr);
                        break;
                    default:
                        console.log(
                            `No inventory related status set (we have ${stored['Goat Status']}) or undefined error`
                        );
                        break;
					}
				break;

			case /\/inventory\/view\/\d*/.test(document.URL):
				if (stored['Do we need an item?']) {
					let options = document.getElementById('option');
					if (options.options[9]) {
						options.options[9].selected = true;
					} else if (options.options[8]) {
						options.options[8].selected = true;
					}
					if (document.querySelector('input[type="submit"][value="Use"]')) {
						setTimeout(() => {
							document
								.querySelector('input[type="submit"][value="Use"]')
								.click();
						}, delay);
					}
				}
				break;

			case /\/inventory\/view_action\/.*/.test(document.URL):
                stored.useCase = generalCase;
				if (stored['Do we need an item?']) {
					document.querySelector('select[name="petid"]').value = [
						stored['Battle Goat']
					];
                    delete stored['Do we need an item?'];
					setStoredValue('Auto-Fighter Battle Parameters', stored);
					setTimeout(() => {
						document
							.querySelector('select[name="petid"]')
							.nextElementSibling
                            .click();
					}, delay);
				} else {
                    delete stored['Goat Status'];
					setStoredValue('Auto-Fighter Battle Parameters', stored);
                    setTimeout(() => {
                        location.href = url.challengers;
                    }, delay);
				}
				break;

			case /\/bank/.test(document.URL):
                document.querySelector('section.battleStatus').remove();
				sessionStorage.removeItem('Auto-Fighter Battle Parameters');
				break;

			default:
				break;
		}
		if (content.search('ERROR: You are already in a battle!') > 0) {
			setTimeout(() => {
				location.href = url.theBattle;
			}, delay);
        }
        if (content.search('ERROR: Battle does not exist!') > 0){
            setTimeout(() => {
				location.href = url.challengers;
			}, delay);
        }
	}
})();
