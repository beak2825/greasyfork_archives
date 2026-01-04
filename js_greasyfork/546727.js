// ==UserScript==
// @name         IQRPG 人员伴侣
// @namespace    https://www.iqrpg.com/
// @version      0.2.0
// @author       Tempest(edit by Tiande)
// @description  适配汉化。QoL enhancement for IQRPG Personnel
// @homepage     https://slyboots.studio/iqrpg-personnel-companion/
// @source       https://github.com/SlybootsStudio/iqrpg-personnel-companion
// @match        https://*.iqrpg.com/*
// @require      http://code.jquery.com/jquery-latest.js
// @license      unlicense
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546727/IQRPG%20%E4%BA%BA%E5%91%98%E4%BC%B4%E4%BE%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/546727/IQRPG%20%E4%BA%BA%E5%91%98%E4%BC%B4%E4%BE%A3.meta.js
// ==/UserScript==

/* global $ */

//-----------------------------------------------------------------------
// Config
//-----------------------------------------------------------------------

const RENDER_DELAY = 100; // Delay for modifying the page.

const SHOW_PREVIOUS_TIERS = 0;

/**
 * Used to debounce DOM modifications
 */
let loadPersonnelOnce = false;

function onReadyStateChangeReplacement(e) {
    //
    // This is called anytime there is an action complete, or a view (page) loads.
    setTimeout( () => {
        /**
         * Personnel page.
         */
        if(e.responseURL.includes("php/land.php?mod=loadPersonnel")) {
            if(e.response && !loadPersonnelOnce) {

                loadPersonnelOnce = true;

                /**
                 * Show previously earned tiers. They exist, just hidden.
                 */
                if(SHOW_PREVIOUS_TIERS) {
                    $('.bonus').show();
                }

                /**
                 * Find all personnel sections
                 */
                const personnel = $('.personnel');

                for(let i = 0; i < personnel.length; i += 1) {
                    const level = $('.green-text', personnel[i])[0];
                    let _level = $(level).text();

                    let total = COSTS[_level - 1][1];
                    $(level).after(` - <span class='gold-text'>${total.toLocaleString()}</span> Invested`);


                    /**
                     * Get all bonus rows in the table
                     */
                    const bonuses = $('.bonus td', personnel[i]);

                    for(let j = 0; j < bonuses.length; j += 1 ) {
                        let bonusText = $(bonuses[j]).text();
                        /**
                         * Each row has two 'bonus' tds. One is the level. One is the definition.
                         */
                        if(bonusText.includes('Level') || bonusText.includes('等级')) {
                            let _bonusLevel = bonusText.replace(":", "").replace("：", "");
                            _bonusLevel = _bonusLevel.replace("Level ", "").replace("等级 ", "");

                            /**
                             * Determine the remaining cost
                             */
                            let target = COSTS[parseInt(_bonusLevel) - 1][1] - total;

                            /**
                             * Does the personnel level already matched or exceeded the bonus level.
                             */
                            if(parseInt(_level) >= parseInt(_bonusLevel)) {
                                target = "-";
                            }

                            /**
                             * Insert a data cell between the level and description.
                             */
                            $(bonuses[j]).after(`<td class='gold-text'>${target.toLocaleString()}</td>`);
                        }
                    }
                }
            }
        } else {
            loadPersonnelOnce = false;
        }

    }, RENDER_DELAY );
}




//-----------------------------------------------------------------------
// HTTP Request Override -- DO NOT EDIT
//-----------------------------------------------------------------------

let send = window.XMLHttpRequest.prototype.send;

function sendReplacement() {
    let old = this.onreadystatechange;

    this.onreadystatechange = () => {
        onReadyStateChangeReplacement(this);
        if(old) {
            old();
        }
    }

    return send.apply(this, arguments);
}

window.XMLHttpRequest.prototype.send = sendReplacement;



const COSTS = [
[1,0],
[2,100000],
[3,308400],
[4,634129],
[5,1086675],
[6,1676116],
[7,2413153],
[8,3309145],
[9,4376144],
[10,5626933],
[11,7075069],
[12,8734922],
[13,10621723],
[14,12751607],
[15,15141664],
[16,17809992],
[17,20775750],
[18,24059215],
[19,27681842],
[20,31666330],
[21,36036684],
[22,40818288],
[23,46037978],
[24,51724119],
[25,57906685],
[26,64617345],
[27,71889553],
[28,79758641],
[29,88261920],
[30,97438780],
[31,107330802],
[32,117981872],
[33,129438300],
[34,141748948],
[35,154965362],
[36,169141909],
[37,184335927],
[38,200607877],
[39,218021502],
[40,236643999],
[41,256546196],
[42,277802738],
[43,300492282],
[44,324697703],
[45,350506311],
[46,378010075],
[47,407305863],
[48,438495687],
[49,471686969],
[50,506992812],
[51,544532290],
[52,584430749],
[53,626820123],
[54,671839269],
[55,719634312],
[56,770359015],
[57,824175158],
[58,881252943],
[59,941771417],
[60,1005918913],
[61,1073893514],
[62,1145903540],
[63,1222168060],
[64,1302917426],
[65,1388393835],
[66,1478851916],
[67,1574559349],
[68,1675797511],
[69,1782862156],
[70,1896064124],
[71,2015730089],
[72,2142203338],
[73,2275844592],
[74,2417032864],
[75,2566166361],
[76,2723663426],
[77,2889963527],
[78,3065528294],
[79,3250842606],
[80,3446415728],
[81,3652782506],
[82,3870504616],
[83,4100171875],
[84,4342403614],
[85,4597850116],
[86,4867194124],
[87,5151152421],
[88,5450477484],
[89,5765959220],
[90,6098426779],
[91,6448750461],
[92,6817843707],
[93,7206665190],
[94,7616221001],
[95,8047566943],
[96,8501810930],
[97,8980115504],
[98,9483700468],
[99,10013845645],
[100,10571893769],
[101,11159251398],
[102,11777402653],
[103,12427891398],
[104,13112345859],
[105,13832471695],
[106,14590057923],
[107,15386980914],
[108,16225208574],
[109,17106804723],
[110,18033933680],
[111,19008865066],
[112,20033978830],
[113,21111770512],
[114,22244856756],
[115,23435981082],
[116,24688019923],
[117,26003988956],
[118,27387049721],
[119,28840516554],
[120,30367863845],
[121,31972733637],
[122,33658943580],
[123,35430495256],
[124,37291582896],
[125,39246602504],
[126,41300161407],
[127,43457088251],
[128,45722443465],
[129,48101530213],
[130,50599905858],
[131,53223393957],
[132,55978096823],
[133,58870408663],
[134,61907029334],
[135,65094978741],
[136,68441611898],
[137,71954634698],
[138,75642120409],
[139,79512526944],
[140,83574714928],
[141,87837966605],
[142,92312005626],
[143,97007017751],
[144,101933672517],
[145,107103145904],
[146,112527144057],
[147,118217928105],
[148,124188340131],
[149,130451830342],
[150,137022485498]
];
