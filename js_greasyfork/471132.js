// ==UserScript==
// @name         Faction Friend or Foe
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  hilight friends or foes on hospital page for easier identification
// @author       Baskerville
// @license      MIT
// @match        https://www.torn.com/hospitalview.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @sandbox      DOM
// @downloadURL https://update.greasyfork.org/scripts/471132/Faction%20Friend%20or%20Foe.user.js
// @updateURL https://update.greasyfork.org/scripts/471132/Faction%20Friend%20or%20Foe.meta.js
// ==/UserScript==

const OBN = [231, 1149, 8520, 8706, 8803, 9055, 9110, 9412, 9533, 10820, 11062, 11581, 11747, 12863, 13502, 13784, 15222, 20554, 21526, 22492, 22887, 25025, 28073, 29865, 33007, 35507, 40992, 42125, 48097];
const WEST_WORLD = [366, 2095, 6731, 6984, 7282, 7709, 7835, 7969, 8085, 8336, 8384, 8468, 8677, 8802, 8954, 9032, 9047, 9118, 9171, 9176, 9420, 9745, 10818, 10960, 11522, 11539, 11559, 12094, 12249, 12645, 12893, 13851, 14078, 14760, 15120, 15446, 15655, 15929, 16120, 16282, 16299, 17133, 17845, 18736, 20303, 20514, 21028, 21040, 22781, 26437, 26885, 27223, 27370, 29107, 30085, 30820, 33241, 35423, 36693, 36891, 37530, 39549, 39756, 40518, 40775, 41028, 41225, 42685, 43785, 45046];
const CRPT = [19, 89, 230, 478, 946, 1117, 2736, 5431, 7049, 7197, 7818, 8124, 8151, 8317, 8400, 8537, 8836, 8867, 8938, 9036, 9041, 9517, 9689, 10566, 10610, 10850, 10856, 12912, 13343, 13665, 13842, 14052, 15151, 16053, 16312, 16503, 16628, 18090, 18569, 18714, 19060, 21368, 22295, 22680, 26043, 26154, 30009, 30009, 31397, 36274, 37595, 38761, 40200, 40449, 41218, 41419, 41775, 41853, 42681, 44404, 44445, 44758, 45465, 48277, 48628, 48673, 49164];
const ROD = [525, 937, 2013, 6780, 6974, 7227, 7935, 7990, 8285, 8811, 9280, 9357, 11131, 11376, 11782, 12255, 12894, 13307, 13377, 13872, 14686, 15154, 15644, 16247, 16296, 16634, 17587, 17991, 18597, 20747, 21716, 23193, 23492, 27312, 27554, 28205, 33458, 33783, 35840, 36140, 37093, 37185, 37498, 38887, 39531, 39960, 40624, 40905, 40959, 41164, 41234, 41297, 41363, 42505, 43325, 43836, 44467, 44562, 45595, 46089, 46127, 46442, 47100, 48002, 48112, 48640, 48680, 48832, 48989, 49184, 49346, 49763];
const JFK = [355,3241,6924,7652,7986,8076,8422,8715,9100,9356,9405,9674,9953,10174,10741,11428,11796,14365,14821,16335,16424,20465,21234,21665,23952,25874,27902,31764,32781,35776,36134];

const friends = WEST_WORLD.concat(OBN)
const foes = JFK.concat(ROD, CRPT)

function colorFriends(){
    const l = document.querySelectorAll('a.user.faction')
    for(const a of l){
        if(a.href){
            let b = new URL(a.href)
            b = Number(b.searchParams.get('ID'))
            if (friends.includes(b)){
                a.style.backgroundColor = '#ccffcc'
            }
            else if (foes.includes(b)){
                a.style.backgroundColor = '#ffcccc'
            }
        }

    }
}

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true }
const observer = new MutationObserver(colorFriends)
observer.observe(document.body, config)