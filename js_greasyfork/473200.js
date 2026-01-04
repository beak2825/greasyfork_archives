// ==UserScript==
// @name         Better Rrolf
// @name:zh-CN   Better Rrolf
// @namespace    http://tampermonkey.net/
// @version      1.07
// @description  record game crafts
// @description:zh-CN   record game crafts
// @author       NetheriteJam
// @match        https://rrolf.io/
// @run-at		 document-start
// @license		 MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473200/Better%20Rrolf.user.js
// @updateURL https://update.greasyfork.org/scripts/473200/Better%20Rrolf.meta.js
// ==/UserScript==

const color = {
	default: '#6137BD',
	red: '#FF002F',
	green: '#00FF6F',
}

const types = [
	'basic',
	'pellet',
	'rock',
	'spikes',
	'light',
	'missile',
	'peas',
	'leaf',
	'egg',
	'magnet',
	'uranium',
	'feather',
	'azalea',
	'bone',
	'web',
	'seed',
	'gravel',
	'club',
	'crest',
	'droplet',
	'beak',
	'lightning',
];

const rarities = [
	'common',
	'uncommon',
	'rare',
	'epic',
	'legendary',
	'mythic',
	'exotic',
];

const craftP = [
	0.5,
	0.3,
	0.15,
	0.05,
	0.03,
	0.01,
]

const craftC = [
	0.3021030253,
	0.1189491927,
	0.0322209144,
	0.0038016583,
	0.0013861777,
	0.0001560417,
]

const consoleLogPrefix = '[BetterRrolf] ';

const consoleHeading = 'Better Rrolf by NetheriteJam'

let enabled = true; // if the console is enabled

let input; // the console

let state = 0; // state of console
let selectedOption;

// window.localStorage.setItem('betterRrolf_settings', 'null');
// window.localStorage.setItem('betterRrolf_craft_record', 'null');

let settings = window.localStorage.getItem('betterRrolf_settings'); // get stored craft records

let craftRecord = window.localStorage.getItem('betterRrolf_craft_record'); // get stored craft records

let selectedRarity, selectedType;

let qRarity, qType;

let listPage, pageLength = 20;

function getLocalStorage() {
	if ( settings == 'null' ) {
		settings = [
			false, // abbrCheckWhenLogging
			false, // focusEventLogging
		];
	} else {
		settings = JSON.parse(settings);
	}

	if ( craftRecord == 'null' ) {
		craftRecord = [];
	} else {
		craftRecord = JSON.parse(craftRecord);
	}
}

log(consoleHeading);
log('Loading...');
log('Refresh the page if it doesn\'t load.');
getLocalStorage();
betterRrolf();
// window.addEventListener('load', betterRrolf);

async function betterRrolf() {
	await new Promise(resolve => setTimeout(resolve, 1000));
	initInputBox();
	initDependencies();
	log('Finished loading.');
	log('Execute command \'help\' for more information.');
	log('Press [/] to toggle BetterRrolf console');
	log('Press [.] to focus on BetterRrolf console.');
	window.addEventListener('keydown', e => {
		if ( e.code == 'Slash' ) {
			clr();
			if ( enabled ) {
				log('Disabled console.');
				log('Press [/] to toggle BetterRrolf console');
			} else {
				log('Enabled console.');
				log('Press [/] to toggle BetterRrolf console');
				log('Press [.] to focus on BetterRrolf console.');
				log('Execute command \'help\' for more information.');
			}
			toggleInputBox();
		} else if ( e.code == 'Period' ) {
			if ( settings[1] ) {
				log('Focused on console.');
			}
			input.focus();
			e.preventDefault();
		}
	});
	input.addEventListener('keydown', e => {
		if ( e.code == 'Enter' ) {
			let cmd = input.value;
			input.value = '';
			if ( cmd !== '' ) {
				if ( state == 0 ) { // waiting
					if ( cmd == 'help' ) {
						clr();
						log(`Executed command '${cmd}'`);
						log("");
						help();
					} else if ( cmd == 'set' ) {
						clr();
						log(`Executed command '${cmd}'`);
						log("");
						set();
					} else if ( cmd == 'clr' ) {
						clr();
						log(`Executed command '${cmd}'`);
						log('Execute command \'help\' for more information.');
						log("");
					} else if ( cmd == 'log' ) {
						clr();
						log(`Executed command '${cmd}'`);
						log("");
						log('Input rarity or type to select that of the craft.');
						log('Then input the number of petals you lose.');
						log('Input 5 for a successful craft.');
						log('You DON\'T need to select the rarity and type every time you input the number above.');
						log('You can only select them when you start to craft petals of a new type or rarity.');
						log('Use \'exit\' to exit.');
						state = 3;
						selectedRarity = undefined;
						selectedType = undefined;
					} else if ( cmd == 'q' ) {
						clr();
						log(`Executed command '${cmd}'`);
						log("");
						qRarity = -1;
						qType = -1;
						state = 4;
						q();
					} else if ( cmd == 'list' ) {
						clr();
						log(`Executed command '${cmd}'`);
						log("");
						listPage = 1;
						state = 7;
						list();
					}
				} else if ( state == 1 ) { // select id of an option in settings
					if ( cmd == '0' ) {
						state = 0;
						clr();
						log('Better Rrolf by Netheritejam');
						log('Execute command \'help\' for more information.');
						log('Press [/] to toggle BetterRrolf console');
					} else {
						selectedOption = parseInt(cmd) - 1;
						if ( settings[selectedOption] === undefined ) {
							clr();
							log(`Invalid option ID '${cmd}'`, 'red');
							set();
						} else {
							log('Input the value you want to set this option to:');
							state = 2;
						}
					}
				} else if ( state == 2 ) { // change value of selected option in settings
					if ( selectedOption == 0 || selectedOption == 1 ) {
						if ( cmd == "true" || cmd == "false" ) {
							settings[selectedOption] = (cmd == "true" ? true : false);
							state = 0;
							clr();
							console.log(settings);
							log('Settings has been updated.');
							set();
						} else {
							log('Invalid value', 'red');
						}
					}
				} else if ( state == 3 ) { // log crafts
					if ( cmd == 'exit' ) {
						log('Exited.');
						log('Execute command \'help\' for more information.');
						state = 0;
					} else if ( parseInt(cmd) !== NaN && parseInt(cmd) > 0 && parseInt(cmd) < 6 ) {
						if ( selectedRarity === undefined || selectedType === undefined ) {
							if ( selectedRarity === undefined )
								log('Rarity not selected.', 'red');
							if ( selectedType === undefined )
								log('Type not selected.', 'red');
						} else {
							log(`Recorded craft ${rarities[selectedRarity]} ${types[selectedType]} at ${moment().format('YYYY-MM-DD hh:mm:ss')}.`);
							if ( parseInt(cmd) == 5 )
								log('Successful', 'green');
							else
								log('Unsuccessful', 'red');
							craftRecord.push({
								rarity: selectedRarity,
								type: selectedType,
								cost: parseInt(cmd),
								state: ( parseInt(cmd) == 5 ? true : false ),
								date: moment().format('YYYY-MM-DD hh:mm:ss'),
							});
						}
					} else {
						let matched = [];
						let len = cmd.length;
						if ( settings[0] ) {
							rarities.forEach(rarity => {
								if ( rarity.slice(0, len) == cmd )
									matched.push(rarity);
							});
							types.forEach(type => {
								if ( type.slice(0, len) == cmd )
									matched.push(type);
							});
						} else {
							rarities.forEach(rarity => {
								if ( rarity == cmd )
									matched.push(rarity);
							});
							types.forEach(type => {
								if ( type == cmd )
									matched.push(type);
							});
						}
						if ( matched.length > 1 ) {
							let s = '';
							matched.forEach(str => {
								s += str + ', ';
							});
							s = s.slice(0, s.length - 2);
							log(`Abbreviation is not distinguishable(${s}).`, 'red');
						} else if ( matched.length == 0 ) {
							log(`No match for '${cmd}' in dictionary.`, 'red');
						} else {
							matched = matched[0];
							let idx = rarities.findIndex(rarity => rarity == matched);
							if ( idx != -1 ) {
								selectedRarity = idx;
								log(`Selected rarity ${matched}.`);
							} else {
								selectedType = types.findIndex(type => type == matched);
								log(`Selected type ${matched}.`);
							}
						}
					}
				} else if ( state == 4 ) {
					if ( cmd == '1' ) {
						clr();
						log("Input the rarity you want to apply to the filter.");
						log("Input '1' for any.");
						state = 5;
					} else if ( cmd == '2' ) {
						clr();
						log("Input the type you want to apply to the filter.");
						log("Input '1' for any.");
						state = 6;
					} else if ( cmd == 'q' ) {
						clr();
						let cnt0 = 0, cnt1 = 0, cost = 0;
						let latest;
						craftRecord.forEach(record => {
							if ( record.rarity == qRarity || qRarity == -1 ) {
								if ( record.type == qType || qType == -1 ) {
									latest = record;
									if ( record.state == false ) {
										cnt0 ++;
									} else {
										cnt1 ++;
									}
									cost += record.cost;
								}
							}
						});
						if ( latest === undefined ) {
							log(`There are no crafts that satisfy all the filters.`);
						} else {
							let be = 'are';
							if ( cnt1 == 1 )
								be = 'is';

							if ( qRarity != -1 && qType != -1 )
								log(`${cnt1} crafts using ${rarities[qRarity]} ${types[qType]} ${be} successful`, 'green');
							else if ( qRarity == -1 && qType == -1 ) 
								log(`${cnt1} crafts ${be} successful`, 'green');
							else if ( qRarity == -1 ) 
								log(`${cnt1} crafts using any ${types[qType]} ${be} successful`, 'green');
							else
								log(`${cnt1} crafts using ${rarities[qRarity]} petals ${be} successful`, 'green');

							be = 'are';
							if ( cnt0 == 1 )
								be = 'is';

							if ( qRarity != -1 && qType != -1 )
								log(`${cnt0} crafts using ${rarities[qRarity]} ${types[qType]} ${be} unsuccessful`, 'red');
							else if ( qRarity == -1 && qType == -1 ) 
								log(`${cnt0} crafts ${be} unsuccessful`, 'red');
							else if ( qRarity == -1 ) 
								log(`${cnt0} crafts using any ${types[qType]} ${be} unsuccessful`, 'red');
							else
								log(`${cnt0} crafts using ${rarities[qRarity]} petals ${be} unsuccessful`, 'red');

							log(`You have ${cnt1} out of ${cnt0 + cnt1} crafts successful.`);
							log(`Your success rate is ${(cnt1 / (cnt0 + cnt1) * 100).toFixed(2)}%`);
							if ( qRarity != -1 ) {
								log(`The nominal success rate is ${craftP[qRarity] * 100}%`);
								log(`You have ${(craftP[qRarity] * (cnt0 + cnt1)).toFixed(2)} crafts successful on expectations.`);
							}
							log("");
							log(`You crafted ${cnt1} petals out of ${cost} petals.`);
							log(`You spend ${(cost / cnt1).toFixed(2)} petals for each success on average.`);
							if ( qRarity != -1 ) {
								log(`You spend ${((craftP[qRarity] * 5 + (1 - craftP[qRarity]) * 2.5) / craftP[qRarity]).toFixed(2)} petals for each success on expectations.`);
							}
							log("");
							log(`Your last craft was on ${latest.date}, which was ${latest.state ? 'successful' : 'unsuccessful'}.`, latest.state ? 'green' : 'red');
							if ( qRarity != -1 && qType != -1 ) {
								let cnt = 0;
								for (let i = craftRecord.length - 1; i > 0; i -- ) {
									let record = craftRecord[i];
									if ( record.type == qType && record.rarity == qRarity) {
										if ( record.state ) {
											break;
										} else {
											cnt ++;
										}
									}
								}
								log(`You have failed crafting this petal for ${cnt} times since last success.`);
								log(`The next craft will have a ${(cnt * craftC[qRarity] * 100).toFixed(2)}% chance to success.`);
							}
						}
						log('Execute command \'help\' for more information.');
						state = 0;
					} else if ( cmd == 'exit' ) {
						log('Exited');
						log('Execute command \'help\' for more information.');
						state = 0;
					} else {
						log("Invalid input");
					}
				} else if ( state == 5 ) {
					let matched = [];
					let len = cmd.length;
					if ( settings[0] ) {
						rarities.forEach(rarity => {
							if ( rarity.slice(0, len) == cmd )
								matched.push(rarity);
						});
					} else {
						rarities.forEach(rarity => {
							if ( rarity == cmd )
								matched.push(rarity);
						});
					}
					if ( matched.length > 1 ) {
						let s = '';
						matched.forEach(str => {
							s += str + ', ';
						});
						s = s.slice(0, s.length - 2);
						log(`Abbreviation is not distinguishable(${s}).`, 'red');
					} else if ( matched.length == 0 ) {
						qRarity = -1;
						clr();
						state = 4;
						log(`Rarity filter has been changed to any.`);
						q();
					} else {
						matched = matched[0];
						let idx = rarities.findIndex(rarity => rarity == matched);
						if ( idx != -1 ) {
							qRarity = idx;
							clr();
							state = 4;
							log(`Rarity filter has been changed to ${matched}.`);
							q();
						} else { // should not happen
							log('ERROR', 'red');
						}
					}
				} else if ( state == 6 ) {
					let matched = [];
					let len = cmd.length;
					if ( settings[0] ) {
						types.forEach(type => {
							if ( type.slice(0, len) == cmd )
								matched.push(type);
						});
					} else {
						types.forEach(type => {
							if ( type == cmd )
								matched.push(type);
						});
					}
					if ( matched.length > 1 ) {
						let s = '';
						matched.forEach(str => {
							s += str + ', ';
						});
						s = s.slice(0, s.length - 2);
						log(`Abbreviation is not distinguishable(${s}).`, 'red');
					} else if ( matched.length == 0 ) {
						qType = -1;
						clr();
						state = 4;
						log(`Type filter has been changed to any.`);
						q();
					} else {
						matched = matched[0];
						let idx = types.findIndex(type => type == matched);
						if ( idx != -1 ) {
							qType = idx;
							clr();
							state = 4;
							log(`Type filter has been changed to ${matched}.`);
							q();
						} else { // should not happen
							log('ERROR', 'red');
						}
					}
					
				} else if ( state == 7 ) {
					if ( cmd == 'exit' ) {
						log('Exited');
						log('Execute command \'help\' for more information.');
						state = 0;
					} else if ( cmd == 'del' ) {
						log("THIS OPERATION CAN'T BE REVOKED", 'red');
						log('Input the ID of the log you want to delete.');
						state = 8;
					} else {
						let page = parseInt(cmd);
						if ( page === NaN || page <= 0 ) {
							log('Invalid input', 'red');
						} else {
							listPage = page;
							clr();
							list();
						}
					}
				} else if ( state == 8 ) {
					let id = parseInt(cmd);
					if ( id === NaN ) {
						log('Invalid Input', 'red');
					} else {
						craftRecord.splice(id - 1, 1);
						state = 7;
						clr();
						list();
					}
				}
			}
		}
	});
	window.addEventListener('beforeunload', () => {
		window.localStorage.setItem('betterRrolf_craft_record', JSON.stringify(craftRecord));
		window.localStorage.setItem('betterRrolf_settings', JSON.stringify(settings));
	});
}

function help() {
	log('Press [/] to toggle BetterRrolf console.');
	log('Press [.] to focus on BetterRrolf console.');
	log("Commands(Use without dot):");
	log(".help: Open this page.");
	log(".set: Open settings page.");
	log(".clr: Clear console.");
	log(".log: Start logging your crafts.");
	log(".q: Query your crafts.");
	log(".list: List your crafts(you can also operate logs here | currently unavailable).");
	// log(".acc: ");
	log("Commands will be explained more specificly when you execute them.");
}

function set() {
	state = 1;

	log("Settings:");

	log("ID: 1");
	log("abbrCheckWhenLogging(true/false):");
	if ( settings[0] )
		log("true", 'green');
	else
		log("false", 'red');
	log("When enabled, checks abbreviation for rarities and types (of petals) when logging crafts.");
	log("");

	log("ID: 2");
	log("focusEventLogging(true/false):");
	if ( settings[1] )
		log("true", 'green');
	else
		log("false", 'red');
	log("When enabled, focus events will be logged in console.");
	log("");

	log("Select the ID of the option you want to change or 0 to exit");
}

function log(str, clr) {
	if ( clr === undefined ) {
		clr = 'default';
	}
	console.log('%c' + consoleLogPrefix + str, `background: #E3F8FF; color: ${color[clr]}`);
}

function q() {
	let len = craftRecord.length;
	if ( len == 0 ) {
		log('There are no crafting records yet.');
		log('Execute command \'help\' for more information.');
		state = 0;
	} else {
		log("Current filters:");
		log("rarity:");
		if ( qRarity == -1 ) {
			log("any");
		} else {
			log(rarities[qRarity]);
		}
		log("type:");
		if ( qType == -1 ) {
			log("any");
		} else {
			log(types[qType]);
		}
		log("");
		log("Input '1' to change rarity filter.");
		log("Input '2' to change type filter.");
		log("Input 'q' again to query.");
		log("Input 'exit' to exit. ");
	}
}

function list() {
	let len = craftRecord.length;
	if ( len == 0 ) {
		log('There are no crafting records yet.');
		log('Execute command \'help\' for more information.');
		state = 0;
	} else {
		log("Input a page number to turn to that page.");
		log("Input 'del' to delete a record.");
		log("Input 'exit' to exit.");
		let pageCount = Math.floor((len - 1) / pageLength) + 1;
		log(`Page ${listPage} / ${pageCount}`);
		for (let i = (listPage - 1) * pageLength + 1; i <= listPage * pageLength && i <= len; i ++ ) {
			let record = craftRecord[i - 1];
			log(`${i} | Attempt to craft ${record.rarity} ${record.type} on ${record.date} ${record.state ? "succeeded" : "failed and lost " + record.cost }`, record.state ? 'green' : 'red');
		}
	}
}

function initInputBox() {
	let newInputBox = document.createElement('input');
	newInputBox.id = `betterRrolfConsole`;
	newInputBox.type = 'text';
	newInputBox.placeholder = `Better Rrolf Console`;
	document.body.append(newInputBox);
	let style = document.getElementById('betterRrolfConsole').style;
	style['height'] = '3vh';
	style['width'] = '27vw';
	style['position'] = 'absolute';
	style['z-index'] = '4';
	style['left'] = '85vw';
	style['top'] = '3vh';
	style['transform'] = 'translateY(-50%) translateX(-50%)';
	style['padding'] = '0vh';
	style['background-color'] = 'rgba(255, 255, 255, 0.7)';
	style['outline-color'] = 'rgba(0, 0, 0, 0)';
	style['outline-style'] = 'solid';
	style['outline-width'] = '0vh';
	style['border-radius'] = '0.5vh';
	style['font-size'] = '2.5vh';
	style['font-family'] = 'Ubuntu';
	input = document.getElementById('betterRrolfConsole');
}

function initDependencies() {
	let script = document.createElement('script');
	script.src = 'https://momentjs.com/downloads/moment.min.js';
	script.async = true;
	document.head.append(script);
}

function toggleInputBox() {
	if ( enabled ) {
		enabled = false;
		document.getElementById('betterRrolfConsole').style.visibility = 'hidden';
	} else {
		enabled = true;
		document.getElementById('be·tterRrolfConsole').style.visibility = 'visible';
	}
}

function clr() {
	console.clear();
}