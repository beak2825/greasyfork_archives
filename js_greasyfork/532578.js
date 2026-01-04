// ==UserScript==
// @name         Mobile War Timer
// @namespace    http://torn.city.com.dot.com.com
// @version      0.1
// @description  Zhen war timer now on TornPDA
// @author       Zhengyi
// @match        https://www.torn.com/factions*
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/532578/Mobile%20War%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/532578/Mobile%20War%20Timer.meta.js
// ==/UserScript==
let myAPIKey = "YOURAPIKEYHERE";


let intervalMap = {};
let EnemyList = new Map();

        const GLOBAL_STATE = {
            userSettings: {
              highlightSettings: {
                highlightGreenIf: {
                  //Code lovingly adapted from Status Highlighter, code thats not being used will be removed after BETA
                  // DEFAULT GREEN: ALL PLAYERS WITH OKAY & OFFLINE STATUSES
          
                  status: ['Okay'], // Possible options are: ['Okay', 'Hospital', 'Travelling', 'Jail'] ### CASE SENSITIVE ###
                  onOffIdle: ['online', 'idle', 'offline'], // Possible options are: ['online', 'idle', 'offline']
                  levelRange: [0, 0], // first number is lower level range, second number is higher level range
                  includeExceptions: [], // array of players names (not case sensitive) that are OUTSIDE the level range you wish TO highlight, if they meet the other criteria
                  excludeExceptions: [], // array of players that are INSIDE the level range you wish NOT TO highlight, if they meet the other criteria
                },
          
                highlightOrangeIf: {
                  // DEFAULT ORANGE: ALL PLAYERS WITH OKAY & IDLE STATUSES
          
                  status: ['Okay'], // Possible options are: ['Okay', 'Hospital', 'Travelling', 'Jail'] ### CASE SENSITIVE ###
                  onOffIdle: ['idle'], // Possible options are: ['online', 'idle', 'offline']
                  levelRange: [0, 100], // first number is lower level range, second number is higher level range
                  includeExceptions: [], // array of players that are OUTSIDE the level range you wish TO highlight, if they meet the other criteria
                  excludeExceptions: [], // array of players that are INSIDE the level range you wish NOT TO highlight, if they meet the other criteria
                },
          
                highlightRedIf: {
                  // DEFAULT RED: NO-ONE HIGHLIGHTED RED
          
                  status: ['Okay'], // Possible options are: ['Okay', 'Hospital', 'Travelling', 'Jail'] ### CASE SENSITIVE ###
                  onOffIdle: ['offline', 'idle', 'okay'], // Possible options are: ['online', 'idle', 'offline']
                  levelRange: [0, 0], // first number is lower level range, second number is higher level range
                  includeExceptions: [], // array of players that are OUTSIDE the level range you wish TO highlight, if they meet the other criteria
                  excludeExceptions: [], // array of players that are INSIDE the level range you wish NOT TO highlight, if they meet the other criteria
                },
              },
              refreshRateMs: 2000,
            },
          };
          
          ////////  VARIABLES  ////////
          const greenMossDark = '#4b5738';
          const greenMossDarkTranslucent = 'rgb(75, 87, 56, 0.9)';
          const greenMoss = '#57693a';
          const greenMossTranslucent = 'rgb(87, 105, 58, 0.9)';
          const greenApple = '#85b200';
          const greenAppleTranslucent = 'rgba(134, 179, 0, 0.4)';
          
          const orangeFulvous = '#d08000';
          const orangeFulvousTranslucent = 'rgba(209, 129, 0, 0.3)';
          const orangeAmber = '#ffbf00';
          const orangeAmberTranslucent = 'rgba(255, 191, 0, 0.4)';
          
          const redFlame = '#e64d1a';
          const redFlameTranslucent = 'rgba(230, 77, 25, 0.3)';
          const redMelon = '#ffa8a8';
          const redMelonTranslucent = 'rgba(255, 168, 168, 0.3)';
          
          const stylesheetHTML = `
              <style>
              .wh-bg--green {
                --wh-bg-color: ${greenAppleTranslucent};
                --wh-outline-fb: 1px solid ${greenApple}
              }
              .dark-mode .wh-bg--green {
                --wh-bg-color: ${greenMossTranslucent};
              }
              
              .wh-bg--orange {
                --wh-bg-color: ${orangeAmberTranslucent};
                --wh-outline-fb: 1px solid ${orangeFulvous}
              }
              .dark-mode .wh-bg--orange {
                --wh-bg-color: ${orangeAmberTranslucent};
              }
              
              .wh-bg--red {
                --wh-bg-color: ${redFlameTranslucent};
                --wh-outline-fb: 1px solid ${redFlame}
              }
              .dark-mode .wh-bg--red {
                --wh-bg-color: ${redFlameTranslucent};
              }
          
              #body li.enemy {
                display: flex;
                margin-top: -1px;
                width: 100%;
              }
              #body li.enemy .attack {
                display: flex;
                justify-content: center;
                padding: 0 0;
                flex-grow: 1;
              }
              
              #body.warHighlighter ul.members-list li.enemy {
                z-index: 200;
                outline: var(--wh-outline, var(--wh-outline-fb, inherit));
                outline-offset: -2px;
                background: var(--wh-bg-color, #f2f2f2);
              }
              #body.dark-mode.warHighlighter ul.members-list li.enemy {
                background: var(--wh-bg-color, #222);
              }
              </style>`;
          
          ////////  MODEL  ////////
          //// Getters and Setters
          function getGlobalState() {
            return GLOBAL_STATE;
          }
          
          function getUserSettings() {
            return getGlobalState().userSettings;
          }
          
          function getEmemiesArr() {
            return [...document.querySelectorAll('li.enemy')];
          }
          
          ////////  UTIL FUNCTIONS  ////////
          async function turnObjectToArray(membersObject) {
            //console.log(membersObject)
        
            let membersMap= new Map();
            /*
            for (const [key, value] of Object.entries(membersObject)) {
                //onsole.log(`${key}: ${value}`);
                membersMap.set(value.name, key);
              }
            */
            
            EnemyList.set("BeastieBoy", 3237910);

            return membersMap;
        }

        async function fetchFactionMembers(apiUrl) {
            try {
                const response = await fetch(apiUrl);
        
                if (!response.ok) {
                    throw new Error('Could not fetch data');
                }
        
                const data = await response.json();
        
                return data.members;
            } catch (error) {
                console.error('Error:', error);
            }
        }


          async function getEnemyFactionData(enemyFactionId) {
        
            //const enemyApiUrl = `https://api.torn.com/faction/${enemyFactionId}?selections=&key=${localStorage.getItem('potatoWarTimerApiKey')}`
            //const membersObjectEnemy = await fetchFactionMembers(enemyApiUrl);
            EnemyList = await turnObjectToArray(membersObjectEnemy)

          }

          function replaceCountryText(fullCountry) {
            let returnCounty = "PANIC"
            //Because of the way we handle hidden travel job perk, default is "Hidden"
            switch (fullCountry){
                case "Switzerland":
                    returnCounty = "Switz";
                    break;
                case "China":
                    returnCounty = "China";
                    break;
                case "South Africa":
                    returnCounty = "S.Afr";
                    break;
                case "United Kingdom":
                    returnCounty = "U.K.";
                    break;
                case "UAE":
                    returnCounty = "UAE";
                    break;
                case "Japan":
                    returnCounty = "Japan";
                    break;
                case "Argentina":
                    returnCounty = "A.tina";
                    break;
                case "Cayman Islands":
                    returnCounty = "Cayman";
                    break;
                case "Hawaii":
                    returnCounty = "Hawaii";
                    break;
                case "Mexico":
                    returnCounty = "Mexico";
                    break;
                case "Canada":
                    returnCounty = "Canada";
                    break;
                default:
                    returnCounty = " Hidden"
                    break;
        
            }
            return returnCounty
        }


          function validateFilter(valuesObject, colorToValidate) {
            // debugger;
            let settings;
            const { onIdleOffValue, levelValue, statusValue, nameValue, idValue } = valuesObject;
          
            if (colorToValidate === 'green') {
              settings = getUserSettings().highlightSettings.highlightGreenIf;
            }
            if (colorToValidate === 'orange') {
              settings = getUserSettings().highlightSettings.highlightOrangeIf;
            }
            if (colorToValidate === 'red') {
              settings = getUserSettings().highlightSettings.highlightRedIf;
            }
            const { onOffIdle, status, levelRange, includeExceptions, excludeExceptions } = settings;
          
            const isIncluded = includeExceptions.includes(nameValue) || includeExceptions.includes(idValue);
            const isExcluded = excludeExceptions.includes(nameValue) || includeExceptions.includes(idValue);
          
            if (((!isExcluded && levelValue >= levelRange[0] && levelValue <= levelRange[1]) || isIncluded) && onOffIdle.includes(onIdleOffValue) && status.includes(statusValue)) {
              return true;
            }
            return false;
          }
          
          ////////  VIEW  ////////
          
          function renderStylesheet() {
            const headEl = document.querySelector('head');
            headEl.insertAdjacentHTML('beforeend', stylesheetHTML);
          }
          
          function renderWarHighlighterClass(el) {
            document.body.classList.add('warHighlighter');
          }
          
          function renderColorClasses(el, valuesObject) {
            const colorsArr = ['green', 'orange', 'red'];
          
            for (const color of colorsArr) {
              if (validateFilter(valuesObject, color)) {
                if (el.classList.contains(`wh-bg--${color}`)) return;
                const otherColorClasses = colorsArr.filter((oc) => oc !== color).map((oc) => `wh-bg--${oc}`);
                el.classList.remove(...otherColorClasses);
                el.classList.add(`wh-bg--${color}`);
                return;
              }
            }
          }
          
          ////////  CONTROLLERS  ////////
          function initController() {
            renderStylesheet();
            renderWarHighlighterClass();
          }
          

          async function fetchMemberStats(apiUrl) {
            try {
                const response = await fetch(apiUrl);
        
                if (!response.ok) {
                    throw new Error('Could not fetch data');
                }
        
                const data = await response.json();
        
                return data.status;
            } catch (error) {
                console.error('Error:', error);
                return -1;
            }
        }

          function loadController() {
            setInterval(() => {
              const enemiesArr = getEmemiesArr();

              //const warTableAll = document.querySelectorAll('.members-cont');

              enemiesArr.forEach(async (el) => {

                const currentStatus = el.querySelector('.status');
                const facIdEl = el.querySelectorAll('a.linkWrap___ZS6r9 ');
                const enemyUserId = facIdEl[1].href.match(/\d+$/)[0];
      

                //const personalStatsURL = `https://api.torn.com/user/${userID}?selections=personalstats&key=${apiKey}`
                const personalStatsURL = `https://api.torn.com/user/${enemyUserId}?selections=basic&key=${myAPIKey}`
                let personalData = await fetchMemberStats(personalStatsURL);
                let currentMemberID = enemyUserId

                //el.querySelector('.status').innerHTML = facIdValue

                if (personalData != -1)
                {
                    //el.querySelector('.status').innerHTML = personalData


                    //Zhen War Timer Coded - Ported
                    
                    if (personalData.state === "Hospital") {
                        const updateTimer = () => {
                            
                            const currentTimestamp = Math.floor(Date.now() / 1000);
                            const timeRemaining = personalData.until - currentTimestamp;
        
                            if (timeRemaining <= 0) {
                                 clearInterval(intervalMap[currentMemberID]);
                                 delete intervalMap[currentMemberID];
                            } else {
                                const hours = Math.floor(timeRemaining / 3600);
                                const minutes = Math.floor((timeRemaining % 3600) / 60);
                                const seconds = timeRemaining % 60;
                                const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                                el.querySelector('.status').style.fontSize = "100%"
                                el.querySelector('.status').innerHTML = formattedTime;
        
        
                                if (personalData.description.search("In a") != -1){
                                    //We are in a hospital aboard
                                    el.querySelector('.status').style.fontSize = "85%"
                                    el.querySelector('.status').innerHTML = "✈️:" + formattedTime;
                                    
                                }
        
                            }
                        };
        
                        updateTimer();
                        intervalMap[currentMemberID] = setInterval(updateTimer, 1000);
        
                    }  
                    else if(personalData.state === "Traveling") {
                        let fullDesc = personalData.description
                        let startText ="✈️"
                        if (fullDesc.search("Return") != -1) {
                            el.querySelector('.status').style.fontSize = "70%"
                            el.querySelector('.status').innerHTML = startText + "-> Torn"
                        } else {
                            let county = personalData.description.split("Traveling to ")[1]
                            el.querySelector('.status').style.fontSize = "70%"
                            el.querySelector('.status').innerHTML = startText +"-> "+ replaceCountryText(county)
                            //
                        }
                    }  else if(personalData.state === "Abroad") {
                        let county = personalData.description.split("In ")[1]
                        el.querySelector('.status').style.fontSize = "80%"
                        el.querySelector('.status').innerHTML = replaceCountryText(county)
        
                    } else {
                        clearInterval(intervalMap[currentMemberID]);
                        delete intervalMap[currentMemberID];
                    }
                    
                }

              });
            }, getUserSettings().refreshRateMs);
          }
          
          (function () {
            initController();
            loadController();
          })();