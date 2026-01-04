// ==UserScript==
// @name         Torn Pickpocketing Sorter
// @namespace    nodelore.torn.pickpocketSorter
// @version      1.2
// @description  Sort pickpocket target by expected cs gain to simplify selection.
// @author       nodelore[2786679]
// @license      MIT
// @match        https://www.torn.com/loader.php?sid=crimes*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/480283/Torn%20Pickpocketing%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/480283/Torn%20Pickpocketing%20Sorter.meta.js
// ==/UserScript==

(function(){
    'use strict';

    if(window.PICKPOCKET_EXTENDED){
        return;
    }
    window.PICKPOCKET_EXTENDED = true;
    // TODO: support toggle button
    // const ENABLE_NOTIFICATION_KEY = "nodelore.tornpickpocket.enablenotify";
    const enableNotify = true;

    let inPDA = false;
    const PDAKey = "###PDA-APIKEY###";
    if(PDAKey.charAt(0) !== "#"){
        inPDA = true;
    }

    const isMobile = ()=>{
        return inPDA || window.innerWidth <= 784;
    }

    const notifyCyclist = (leftTime)=>{
        const notification_text = `Cyclist appears！Left: ${leftTime}s.`;
        if(inPDA){
            alert(notification_text);
        }
        else{
            if (Notification.permission === "granted") {
                new Notification(notification_text);
            } 
            else if (Notification.permission !== "denied") {
                Notification.requestPermission().then(function (permission) {
                  if (permission === "granted") {
                    new Notification(notification_text);
                  }
                });
            }
        }
    }

    const PICKPOCKET_SUGGESTION = {
        "Businessman": {
            "rate": {
                "tier1": {
                    "succ": 0.6481,
                    "crit": 0.0558
                },
                "tier2": {
                    "succ": 0.7426,
                    "crit": 0.0421
                },
                "tier3": {
                    "succ": 0.7699,
                    "crit": 0.0628
                },
                "tier4": {
                    "succ": 0.7912,
                    "crit": 0.022
                },
                "tier5": {
                    "succ": 0.8817,
                    "crit": 0.0323
                }
            },
            "riskStatus": "Walking",
            "riskPhysics": "Skinny",
            "bestStatus": "",
            "uniqueGain": {
                "status": "",
                "needEnhancer": false,
                "needCS100": false,
                "drop": "2x Speed"
            },
            "normalGain": "",
            "csRatio": 2.5,
            "mark": 3
        },
        "Businesswoman": {
            "rate": {
                "tier1": {
                    "succ": 0.6609,
                    "crit": 0.0696
                },
                "tier2": {
                    "succ": 0.7359,
                    "crit": 0.0611
                },
                "tier3": {
                    "succ": 0.7782,
                    "crit": 0.0564
                },
                "tier4": {
                    "succ": 0.8784,
                    "crit": 0.0135
                },
                "tier5": {
                    "succ": 0.931,
                    "crit": 0.0086
                }
            },
            "riskStatus": "Walking",
            "riskPhysics": "Heavyset",
            "bestStatus": "",
            "uniqueGain": {
                "status": "Walking",
                "needEnhancer": false,
                "needCS100": false,
                "drop": "1x Glasses"
            },
            "normalGain": "",
            "csRatio": 2.5,
            "mark": 3
        },
        "Classy lady": {
            "rate": {
                "tier1": {
                    "succ": 0.8759,
                    "crit": 0.0276
                },
                "tier2": {
                    "succ": 0.9245,
                    "crit": 0.0113
                },
                "tier3": {
                    "succ": 0.9611,
                    "crit": 0.0111
                },
                "tier4": {
                    "succ": 0.9296,
                    "crit": 0.0
                },
                "tier5": {
                    "succ": 0.95,
                    "crit": 0.0
                }
            },
            "riskStatus": "",
            "riskPhysics": "Heavyset",
            "bestStatus": "",
            "uniqueGain": {
                "status": "On the phone",
                "needEnhancer": false,
                "needCS100": false,
                "drop": "1x Pair of High Heels"
            },
            "normalGain": "",
            "csRatio": 1.5,
            "mark": 1
        },
        "Cyclist": {
            "rate": {
                "tier1": {
                    "succ": 0.4222,
                    "crit": 0.1333
                },
                "tier2": {
                    "succ": 0.7,
                    "crit": 0.06
                },
                "tier3": {
                    "succ": 0.7222,
                    "crit": 0.1667
                },
                "tier4": {
                    "succ": 0.6364,
                    "crit": 0.0909
                },
                "tier5": {
                    "succ": 0.8756,
                    "crit": 0.0323
                }
            },
            "riskStatus": "",
            "riskPhysics": "",
            "bestStatus": "",
            "uniqueGain": {
                "status": "",
                "needEnhancer": true,
                "needCS100": true,
                "drop": "1x Mountain Bike"
            },
            "normalGain": "Xanax",
            "csRatio": 3.0,
            "mark": 4
        },
        "Drunk man": {
            "rate": {
                "tier1": {
                    "succ": 0.9695,
                    "crit": 0.0051
                },
                "tier2": {
                    "succ": 0.9769,
                    "crit": 0.0
                },
                "tier3": {
                    "succ": 1.0,
                    "crit": 0.0
                },
                "tier4": {
                    "succ": 0.9286,
                    "crit": 0.0
                },
                "tier5": {
                    "succ": 1.0,
                    "crit": 0.0
                }
            },
            "riskStatus": "Distracted",
            "riskPhysics": "Muscular",
            "bestStatus": "",
            "uniqueGain": {
                "status": "",
                "needEnhancer": true,
                "needCS100": false,
                "drop": "6x Bottle of Beer"
            },
            "normalGain": "",
            "csRatio": 1.0,
            "mark": 0
        },
        "Drunk woman": {
            "rate": {
                "tier1": {
                    "succ": 0.9845,
                    "crit": 0.0
                },
                "tier2": {
                    "succ": 0.9607,
                    "crit": 0.0056
                },
                "tier3": {
                    "succ": 0.9832,
                    "crit": 0.0
                },
                "tier4": {
                    "succ": 1.0,
                    "crit": 0.0
                },
                "tier5": {
                    "succ": 1.0,
                    "crit": 0.0
                }
            },
            "riskStatus": "Distracted",
            "riskPhysics": "",
            "bestStatus": "",
            "uniqueGain": {
                "status": "",
                "needEnhancer": true,
                "needCS100": false,
                "drop": "2x Bottle of Pumpkin Brew"
            },
            "normalGain": "",
            "csRatio": 1.0,
            "mark": 0
        },
        "Elderly man": {
            "rate": {
                "tier1": {
                    "succ": 0.9609,
                    "crit": 0.0056
                },
                "tier2": {
                    "succ": 0.9578,
                    "crit": 0.0241
                },
                "tier3": {
                    "succ": 0.9836,
                    "crit": 0.0
                },
                "tier4": {
                    "succ": 0.9286,
                    "crit": 0.0
                },
                "tier5": {
                    "succ": 1.0,
                    "crit": 0.0
                }
            },
            "riskStatus": "",
            "riskPhysics": "",
            "bestStatus": "",
            "uniqueGain": {
                "status": "",
                "needEnhancer": true,
                "needCS100": false,
                "drop": "1x Bag of Tootsie Rolls"
            },
            "normalGain": "",
            "csRatio": 1.0,
            "mark": 0
        },
        "Elderly woman": {
            "rate": {
                "tier1": {
                    "succ": 0.9726,
                    "crit": 0.0046
                },
                "tier2": {
                    "succ": 0.9441,
                    "crit": 0.0
                },
                "tier3": {
                    "succ": 1.0,
                    "crit": 0.0
                },
                "tier4": {
                    "succ": 1.0,
                    "crit": 0.0
                },
                "tier5": {
                    "succ": 0.8,
                    "crit": 0.0
                }
            },
            "riskStatus": "",
            "riskPhysics": "",
            "bestStatus": "",
            "uniqueGain": {
                "status": "",
                "needEnhancer": false,
                "needCS100": false,
                "drop": "1x Opium"
            },
            "normalGain": "",
            "csRatio": 1.0,
            "mark": 0
        },
        "Gang member": {
            "rate": {
                "tier1": {
                    "succ": 0.7111,
                    "crit": 0.0889
                },
                "tier2": {
                    "succ": 0.7273,
                    "crit": 0.0606
                },
                "tier3": {
                    "succ": 0.9231,
                    "crit": 0.0
                },
                "tier4": {
                    "succ": 0.8333,
                    "crit": 0.0417
                },
                "tier5": {
                    "succ": 0.8966,
                    "crit": 0.0345
                }
            },
            "riskStatus": "",
            "riskPhysics": "Muscular",
            "bestStatus": "",
            "uniqueGain": {
                "status": "Loitering",
                "needEnhancer": true,
                "needCS100": false,
                "drop": "1x Spray Can:red, 1x Spray Can:Purple, 1x Spray Can:Blue, 1x Wire Cutters"
            },
            "normalGain": "",
            "csRatio": 2.5,
            "mark": 3
        },
        "Homeless person": {
            "rate": {
                "tier1": {
                    "succ": 0.913,
                    "crit": 0.0
                },
                "tier2": {
                    "succ": 0.9626,
                    "crit": 0.0093
                },
                "tier3": {
                    "succ": 1.0,
                    "crit": 0.0
                },
                "tier4": {
                    "succ": 1.0,
                    "crit": 0.0
                },
                "tier5": {
                    "succ": 1.0,
                    "crit": 0.0
                }
            },
            "riskStatus": "Loitering",
            "riskPhysics": "",
            "bestStatus": "",
            "uniqueGain": {
                "status": "",
                "needEnhancer": false,
                "needCS100": false,
                "drop": "4x Morphine, 1x Soap on a Rope, 3x Brick, 1x Toothbrush"
            },
            "normalGain": "",
            "csRatio": 1.0,
            "mark": 0
        },
        "Jogger": {
            "rate": {
                "tier1": {
                    "succ": 0.6941,
                    "crit": 0.0588
                },
                "tier2": {
                    "succ": 0.7297,
                    "crit": 0.0405
                },
                "tier3": {
                    "succ": 0.8788,
                    "crit": 0.0303
                },
                "tier4": {
                    "succ": 0.9592,
                    "crit": 0.0204
                },
                "tier5": {
                    "succ": 0.9351,
                    "crit": 0.0325
                }
            },
            "riskStatus": "",
            "riskPhysics": "",
            "bestStatus": "Walking",
            "uniqueGain": {
                "status": "Walking",
                "needEnhancer": true,
                "needCS100": false,
                "drop": "1x Can of Crocozade"
            },
            "normalGain": "",
            "csRatio": 2.5,
            "mark": 3
        },
        "Junkie": {
            "rate": {
                "tier1": {
                    "succ": 0.9542,
                    "crit": 0.0065
                },
                "tier2": {
                    "succ": 0.962,
                    "crit": 0.019
                },
                "tier3": {
                    "succ": 0.9474,
                    "crit": 0.0132
                },
                "tier4": {
                    "succ": 1.0,
                    "crit": 0.0
                },
                "tier5": {
                    "succ": 1.0,
                    "crit": 0.0
                }
            },
            "riskStatus": "Loitering",
            "riskPhysics": "Muscular",
            "bestStatus": "",
            "uniqueGain": {
                "status": "Stumbling",
                "needEnhancer": false,
                "needCS100": false,
                "drop": "1x Ecstasy, 1x LSD, 1x PCP, 1x Speed"
            },
            "normalGain": "",
            "csRatio": 1.0,
            "mark": 0
        },
        "Laborer": {
            "rate": {
                "tier1": {
                    "succ": 0.8757,
                    "crit": 0.0113
                },
                "tier2": {
                    "succ": 0.9581,
                    "crit": 0.014
                },
                "tier3": {
                    "succ": 0.9649,
                    "crit": 0.0117
                },
                "tier4": {
                    "succ": 0.9429,
                    "crit": 0.0143
                },
                "tier5": {
                    "succ": 0.9556,
                    "crit": 0.0
                }
            },
            "riskStatus": "Distracted",
            "riskPhysics": "",
            "bestStatus": "",
            "uniqueGain": {
                "status": "Walking",
                "needEnhancer": false,
                "needCS100": false,
                "drop": "1x Megaphone"
            },
            "normalGain": "",
            "csRatio": 1.5,
            "mark": 1
        },
        "Mobster": {
            "rate": {
                "tier1": {
                    "succ": 0.4286,
                    "crit": 0.2857
                },
                "tier2": {
                    "succ": 0.5333,
                    "crit": 0.2667
                },
                "tier3": {
                    "succ": 0.5714,
                    "crit": 0.0714
                },
                "tier4": {
                    "succ": 0.9167,
                    "crit": 0.0
                },
                "tier5": {
                    "succ": 0.913,
                    "crit": 0.0435
                }
            },
            "riskStatus": "",
            "riskPhysics": "",
            "bestStatus": "",
            "uniqueGain": {
                "status": "",
                "needEnhancer": true,
                "needCS100": true,
                "drop": "$561,000-$772,000"
            },
            "normalGain": "",
            "csRatio": 2.5,
            "mark": 3
        },
        "Police officer": {
            "rate": {
                "tier1": {
                    "succ": 0.0313,
                    "crit": 0.2292
                },
                "tier2": {
                    "succ": 0.1899,
                    "crit": 0.2658
                },
                "tier3": {
                    "succ": 0.0938,
                    "crit": 0.1563
                },
                "tier4": {
                    "succ": 0.0,
                    "crit": 0.0
                },
                "tier5": {
                    "succ": 0.3571,
                    "crit": 0.0714
                }
            },
            "riskStatus": "",
            "riskPhysics": "",
            "bestStatus": "",
            "uniqueGain": {
                "status": "Running",
                "needEnhancer": false,
                "needCS100": false,
                "drop": "1x Billfold, 1x Police Badge"
            },
            "normalGain": "",
            "csRatio": 3.5,
            "mark": 5
        },
        "Postal worker": {
            "rate": {
                "tier1": {
                    "succ": 0.9254,
                    "crit": 0.0149
                },
                "tier2": {
                    "succ": 0.8939,
                    "crit": 0.0227
                },
                "tier3": {
                    "succ": 0.9538,
                    "crit": 0.0154
                },
                "tier4": {
                    "succ": 1.0,
                    "crit": 0.0
                },
                "tier5": {
                    "succ": 1.0,
                    "crit": 0.0
                }
            },
            "riskStatus": "Walking",
            "riskPhysics": "",
            "bestStatus": "",
            "uniqueGain": {
                "status": "Dsitracted",
                "needEnhancer": false,
                "needCS100": false,
                "drop": "1x Lottery Voucher"
            },
            "normalGain": "Special Ammo",
            "csRatio": 1.5,
            "mark": 1
        },
        "Rich kid": {
            "rate": {
                "tier1": {
                    "succ": 0.84,
                    "crit": 0.0343
                },
                "tier2": {
                    "succ": 0.8486,
                    "crit": 0.0246
                },
                "tier3": {
                    "succ": 0.908,
                    "crit": 0.0287
                },
                "tier4": {
                    "succ": 0.8592,
                    "crit": 0.0141
                },
                "tier5": {
                    "succ": 0.9592,
                    "crit": 0.0
                }
            },
            "riskStatus": "Walking",
            "riskPhysics": "Muscular",
            "bestStatus": "",
            "uniqueGain": {
                "status": "Listening to music",
                "needEnhancer": true,
                "needCS100": false,
                "drop": "1x Six-Pack of Alcohol"
            },
            "normalGain": "",
            "csRatio": 2.0,
            "mark": 2
        },
        "Sex worker": {
            "rate": {
                "tier1": {
                    "succ": 0.8191,
                    "crit": 0.0106
                },
                "tier2": {
                    "succ": 0.8821,
                    "crit": 0.041
                },
                "tier3": {
                    "succ": 0.8828,
                    "crit": 0.0234
                },
                "tier4": {
                    "succ": 0.8718,
                    "crit": 0.0256
                },
                "tier5": {
                    "succ": 0.9655,
                    "crit": 0.0
                }
            },
            "riskStatus": "",
            "riskPhysics": "",
            "bestStatus": "",
            "uniqueGain": {
                "status": "Soliciting",
                "needEnhancer": false,
                "needCS100": false,
                "drop": "1x Thong"
            },
            "normalGain": "",
            "csRatio": 2.0,
            "mark": 2
        },
        "Student": {
            "rate": {
                "tier1": {
                    "succ": 0.9295,
                    "crit": 0.0064
                },
                "tier2": {
                    "succ": 0.9156,
                    "crit": 0.0169
                },
                "tier3": {
                    "succ": 0.9635,
                    "crit": 0.0073
                },
                "tier4": {
                    "succ": 1.0,
                    "crit": 0.0
                },
                "tier5": {
                    "succ": 1.0,
                    "crit": 0.0
                }
            },
            "riskStatus": "",
            "riskPhysics": "Athletic",
            "bestStatus": "On the phone",
            "uniqueGain": {
                "status": "",
                "needEnhancer": true,
                "needCS100": false,
                "drop": "1x laptop, 1x Cannabis, 1x Coin Purse, 1x Cell Phone"
            },
            "normalGain": "",
            "csRatio": 1.5,
            "mark": 1
        },
        "Thug": {
            "rate": {
                "tier1": {
                    "succ": 0.8144,
                    "crit": 0.0722
                },
                "tier2": {
                    "succ": 0.8306,
                    "crit": 0.0601
                },
                "tier3": {
                    "succ": 0.8713,
                    "crit": 0.0099
                },
                "tier4": {
                    "succ": 0.9063,
                    "crit": 0.0313
                },
                "tier5": {
                    "succ": 0.9737,
                    "crit": 0.0263
                }
            },
            "riskStatus": "",
            "riskPhysics": "",
            "bestStatus": "",
            "uniqueGain": {
                "status": "Loitering",
                "needEnhancer": false,
                "needCS100": false,
                "drop": "1x PCP, 1x Cut-Throat Razor, 1x Billfold"
            },
            "normalGain": "",
            "csRatio": 2.0,
            "mark": 2
        },
        "Young man": {
            "rate": {
                "tier1": {
                    "succ": 0.8897,
                    "crit": 0.0076
                },
                "tier2": {
                    "succ": 0.9415,
                    "crit": 0.0142
                },
                "tier3": {
                    "succ": 0.9342,
                    "crit": 0.0094
                },
                "tier4": {
                    "succ": 0.9595,
                    "crit": 0.0116
                },
                "tier5": {
                    "succ": 0.954,
                    "crit": 0.0
                }
            },
            "riskStatus": "",
            "riskPhysics": "",
            "bestStatus": "",
            "uniqueGain": {
                "status": "",
                "needEnhancer": false,
                "needCS100": false,
                "drop": "1x Ketamine"
            },
            "normalGain": "",
            "csRatio": 1.5,
            "mark": 1
        },
        "Young woman": {
            "rate": {
                "tier1": {
                    "succ": 0.9148,
                    "crit": 0.0033
                },
                "tier2": {
                    "succ": 0.9352,
                    "crit": 0.0125
                },
                "tier3": {
                    "succ": 0.9116,
                    "crit": 0.0113
                },
                "tier4": {
                    "succ": 0.9609,
                    "crit": 0.0168
                },
                "tier5": {
                    "succ": 0.9894,
                    "crit": 0.0
                }
            },
            "riskStatus": "",
            "riskPhysics": "",
            "bestStatus": "On the phone",
            "uniqueGain": {
                "status": "Listening to music",
                "needEnhancer": false,
                "needCS100": false,
                "drop": "1x Ecstasy"
            },
            "normalGain": "",
            "csRatio": 1.5,
            "mark": 1
        }
    }

    const markColorMap = {
        0: "#37b24d",
        1: "#74b816",
        2: "#f59f00",
        3: "#f76707",
        4: "#f03e3e",
        5: "#7048e8",
    };

    const extractPhysical = function(physicalProps){
        if(physicalProps.length > 0){
            const allText = physicalProps.text();
            if(allText.length > 0){
                const splitProps = allText.split(',');
                if(splitProps.length > 0){
                    return splitProps[0].split(' ')[0];
                }
            }
        }
        return '';
    }

    const processStatistics = ()=>{
        const result = {
            cs100: false,
            hasEnhancer: false,
            csTier: 'tier1',
        }
        $('button[class*=statistic]').each(function(){
            const statiscItem = $(this).find('span.label___gaSIm.copyTrigger___m_sge').text();
            if(statiscItem === 'Skill'){
                const crimeLevel = parseFloat($(this).find('.value___Q3ZWA.copyTrigger___m_sge').text());
                if(crimeLevel > 20 && crimeLevel <= 40){
                    result.csTier = 'tier2';
                }
                else if(crimeLevel > 40 && crimeLevel <= 60){
                    result.csTier = 'tier3';
                }
                else if(crimeLevel > 60 && crimeLevel <= 80){
                    result.csTier = 'tier4';
                }
                else if(crimeLevel > 80){
                    result.csTier = 'tier5';
                }

                if(crimeLevel >= 100){
                    result.cs100 = true;
                }
            }
            else if(statiscItem === 'Enhancer'){
                const enhancerStatus = $(this).find('.value___FdkAT.copyTrigger___fsdzI');
                if(!enhancerStatus.is('[class*=notAvailable]')){
                    result.hasEnhancer = true;
                }
            }
        })
        return result;
    }

    const updatePickpocket = (item)=>{
        if(item.find('span.pickpocket-csexpected').length > 0){
            return;
        }
        const statisStatus = processStatistics();

        const titleProps = item.find('div[class^=titleAndProps]');
        const nameItem = titleProps.find('div');

        const physicalProps = titleProps.find('button[class^=physicalPropsButton]');
 
        const activities = item.find('div[class^=activity]');
        if(titleProps.length > 0 && activities.length > 0){
            const title = nameItem.clone().remove('span').contents().filter(function(){
                return this.nodeType === 3;
            }).text().split(' ').slice(0, 2).join(' ').trim();
            const physical = extractPhysical(physicalProps);
            const activity = activities.contents().filter(function(){
                return this.nodeType === 3;
            }).text();

            const suggestion = PICKPOCKET_SUGGESTION[title];
            const rateDetail = suggestion['rate'][statisStatus.csTier];
            const expectedGain = (suggestion['csRatio'] * (rateDetail['succ'] - rateDetail['crit']*10)).toFixed(3);
            const markColor = markColorMap[suggestion['mark']];

            physicalProps.append($(`<span class='pickpocket-csexpected' style='color: #0080ff';>
                ${expectedGain}x ${isMobile() ? "" : "CS"}
            </span>`))
            item.attr('csgain', expectedGain);

            nameItem.css({
                'color': markColor
            })
            item.css({
                'border-left': `3px solid ${markColor}`
            });

            const riskStatus = suggestion['riskStatus'];
            const riskPhysics = suggestion['riskPhysics'];
            const bestStatus = suggestion['bestStatus'];

            if(activity !== '' && riskStatus === activity || riskPhysics === physical){
                item.find("button[class*='commitButton']").css({
                    border: '2px solid red'
                });
            }
            else if(activity !== '' && bestStatus === activity){
                item.find("button[class*='commitButton']").css({
                    border: '2px solid green'
                });
            }

            if(statisStatus.csTier === 'tier5' && title === 'Cyclist' && enableNotify){
                const leftTime = activities.find('div[class*=clock]').text();
                notifyCyclist(leftTime);
            }
        }
    }

    let pickpocketObserver;
    const updatePage = ()=>{
        if(location.href.endsWith('pickpocketing')){
            let interval = setInterval(()=>{
                const pickpocketTarget = '.pickpocketing-root [class*=crimeOptionGroup___]';
                if($(pickpocketTarget).length > 0){
                    $(pickpocketTarget).find('div.crime-option').each(function(){
                        updatePickpocket($(this));
                    });
                    $(pickpocketTarget).find('div.crime-option').sort((a, b)=>{
                        return $(b).attr('csgain') - $(a).attr('csgain');
                    }).each(function(){
                        $(pickpocketTarget).append($(this).parent());
                    })
                    pickpocketObserver = new MutationObserver((mutationList)=>{
                        for(const mut of mutationList){
                            if(mut.type === 'attributes' && mut.attributeName === 'class'){
                                if(mut.target.classList.contains('crime-option-locked')){
                                    setTimeout(()=>{
                                        $(mut.target).hide();
                                    }, 500); 
                                }
                            }
                            for(let addedNode of mut.addedNodes){
                                addedNode = $(addedNode).find(".crime-option")[0];
                                if(!addedNode){
                                    continue;
                                }
                                if(addedNode.classList.contains('crime-option-locked')){
                                    setTimeout(()=>{
                                        $(addedNode).hide();
                                    }, 500);
                                }
                                else if(addedNode.classList.contains('crime-option') && !$(addedNode).attr('csgain')){
                                    updatePickpocket($(addedNode));
                                    const expectedGain = $(addedNode).attr('csgain');
                                    let insertFlag = false;
                                    $(pickpocketTarget).find('div.crime-option').each(function(){
                                        if(insertFlag) return;
                                        if($(this).attr('csgain') < expectedGain){
                                            $(addedNode).insertBefore($(this));
                                            insertFlag = true;
                                        }
                                    });
                                    if(!insertFlag){
                                        $(pickpocketTarget).append($(addedNode).parent());
                                    }
                                }
                            }
                        }
                    })
                    pickpocketObserver.observe($(pickpocketTarget)[0], {subtree: true, childList: true, attributes: true});
                    clearInterval(interval);
                }
            }, 1000)
        } else{
            if(pickpocketObserver){
                pickpocketObserver.disconnect();
                pickpocketObserver = null;
            }
        }
    }

    console.log('Userscript pickpocket sorter starts');

    window.onhashchange = ()=>{
        if(pickpocketObserver){
            pickpocketObserver.disconnect();
            pickpocketObserver = null;
        }
        updatePage();
    }

    updatePage();

    const bindEventListener = function(type) {
        const historyEvent = history[type];
        return function() {
            const newEvent = historyEvent.apply(this, arguments);
           const e = new Event(type);
            e.arguments = arguments;
            window.dispatchEvent(e);
            return newEvent;
        };
    };
    history.pushState = bindEventListener('pushState');
    window.addEventListener('pushState', function(e) {
        updatePage();
    });


})();