// ==UserScript==
// @name         pokerogue hack
// @name:en      pokerogue hack
// @name:ja      pokerogue ハッキング
// @name:zh      pokerogue 黑客
// @name:ko      pokerogue 해킹
// @namespace    http://tampermonkey.net/
// @version      2025-05-04
// @description    Press ctrl to execute.
// @description:en Press ctrl to execute.
// @description:ja ctrlキーで実行
// @description:zh 如果将 enabled 设置为 true，你可以破解它
// @description:ko enabled를 true로 설정하면 해킹할 수 있습니다.
// @author       ぐらんぴ
// @match        https://pokerogue.net/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pokerogue.net
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506302/pokerogue%20hack.user.js
// @updateURL https://update.greasyfork.org/scripts/506302/pokerogue%20hack.meta.js
// ==/UserScript==

let hacks = {
    money:      { enabled: true, value: 10000 },
    eggVoucher: { enabled: true, value: [0, 0, 0, 50] },
    pokeball:   { enabled: true, value: [10, 7, 5, 3, 1] },// poke, great, ultra, rogue, master ball
    wave:       { enabled: false, value: 199 },
    // party
    Level: { enabled: false, value: 100 },
    Shiny: { enabled: true, value: true },
    Luck:  { enabled: true, value: 14 },// 0 - 14
    // enemyParty
    enemyLevel: { enabled: false, value: 20 },
    enemyShiny: { enabled: true, value: true },
    // Execute without pressing ctrl
    unlockAllPokemon: { enabled: false, value: {seenAttr: 479n, caughtAttr: 255n, natureAttr: 100, seenCount: 50, caughtCount: 50, hatchedCount: 50, ivs: [31, 31, 31, 31, 31, 31] } },
    unlockEverything: { enabled: false, value: { moveset: null, eggMoves: 15, candyCount: 100, friendship: 90, abilityAttr: 7, passiveAttr: 0, valueReduction: 8, classicWinCount: 1 } },
    resetDexData:     { enabled: false },
};

///-------------------------------------------------///

var gameObj;
const origObjDefineProperty = Object.defineProperty;
Object.defineProperty = (...props)=>{
    if(props[2].value === 'Game'){
        const origFunc = props[0];
        props[0] = function(...funcArgs){
            gameObj = this;
            return origFunc.call(this, ...funcArgs);
        };
    }
    return origObjDefineProperty.call(this, ...props);
};

document.addEventListener('keydown', e =>{
    if(e.ctrlKey){
        const scene = gameObj.scene.scenes[0]
        console.log(scene)
        if(hacks.money.enabled) scene.addMoney(hacks.money.value)
        if(hacks.eggVoucher.enabled) scene.gameData.voucherCounts = hacks.eggVoucher.value;
        if(hacks.wave.enabled) try{ scene.currentPhase.lastSessionData.waveIndex = hacks.wave.value; }catch{}
        if(hacks.pokeball.enabled){
            Object.keys(scene.pokeballCounts).forEach((key , index)=>{
                scene.pokeballCounts[key] += hacks.pokeball.value[index];
            });
        }
        // party
        if(hacks.Level.enabled || hacks.Shiny.enabled || hacks.Luck.enabled){
            scene.party.forEach(p =>{
                if(hacks.Level.enabled && p.level <= hacks.Level.value) p.level = hacks.Level.value
                if(hacks.Shiny.enabled) p.shiny = hacks.Shiny.value
                if(hacks.Luck.enabled) p.luck = hacks.Luck.value
            });
        }
        // enemyParty
        if(hacks.enemyLevel.enabled || hacks.enemyShiny.enabled){
            try{
                scene.currentBattle.enemyParty.forEach(p =>{
                    if(hacks.enemyLevel.enabled) p.level = hacks.enemyLevel.value
                    if(hacks.enemyShiny.enabled) p.shiny = hacks.enemyShiny.value
                });
            }catch{}
        }
    }
});

const pokemon = [1, 4, 7, 10, 13, 16, 19, 21, 23, 25, 27, 29, 32, 35, 37, 39, 41, 43, 46, 48, 50, 52, 54, 56, 58, 60, 63, 66, 69, 72, 74, 77, 79, 81, 83, 84, 86, 88, 90, 92, 95, 96, 98, 100, 102, 104, 106, 107, 108, 109, 111, 113, 114, 115, 116, 118, 120, 122, 123, 124, 125, 126, 127, 128, 129, 131, 132, 133, 137, 138, 140, 142, 143, 144, 145, 146, 147, 150, 151, 152, 155, 158, 161, 163, 165, 167, 170, 172, 173, 174, 175, 177, 179, 183, 185, 187, 190, 191, 193, 194, 198, 200, 201, 202, 203, 204, 206, 207, 209, 211, 213, 214, 215, 216, 218, 220, 222, 223, 225, 226, 227, 228, 231, 234, 235, 236, 238, 239, 240, 241, 243, 244, 245, 246, 249, 250, 251, 252, 255, 258, 261, 263, 265, 270, 273, 276, 278, 280, 283, 285, 287, 290, 293, 296, 298, 299, 300, 302, 303, 304, 307, 309, 311, 312, 313, 314, 315, 316, 318, 320, 322, 324, 325, 327, 328, 331, 333, 335, 336, 337, 338, 339, 341, 343, 345, 347, 349, 351, 352, 353, 355, 357, 358, 359, 360, 361, 363, 366, 369, 370, 371, 374, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386, 387, 390, 393, 396, 399, 401, 403, 406, 408, 410, 412, 415, 417, 418, 420, 422, 425, 427, 431, 433, 434, 436, 438, 439, 440, 441, 442, 443, 446, 447, 449, 451, 453, 455, 456, 458, 459, 479, 480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493, 494, 495, 498, 501, 504, 506, 509, 511, 513, 515, 517, 519, 522, 524, 527, 529, 531, 532, 535, 538, 539, 540, 543, 546, 548, 550, 551, 554, 556, 557, 559, 561, 562, 564, 566, 568, 570, 572, 574, 577, 580, 582, 585, 587, 588, 590, 592, 594, 595, 597, 599, 602, 605, 607, 610, 613, 615, 616, 618, 619, 621, 622, 624, 626, 627, 629, 631, 632, 633, 636, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649, 650, 653, 656, 659, 661, 664, 667, 669, 672, 674, 676, 677, 679, 682, 684, 686, 688, 690, 692, 694, 696, 698, 701, 702, 703, 704, 707, 708, 710, 712, 714, 716, 717, 718, 719, 720, 721, 722, 725, 728, 731, 734, 736, 739, 741, 742, 744, 746, 747, 749, 751, 753, 755, 757, 759, 761, 764, 765, 766, 767, 769, 771, 772, 774, 775, 776, 777, 778, 779, 780, 781, 782, 785, 786, 787, 788, 789, 793, 794, 795, 796, 797, 798, 799, 800, 801, 802, 803, 805, 806, 807, 808, 810, 813, 816, 819, 821, 824, 827, 829, 831, 833, 835, 837, 840, 843, 845, 846, 848, 850, 852, 854, 856, 859, 868, 870, 871, 872, 874, 875, 876, 877, 878, 880, 881, 882, 883, 884, 885, 888, 889, 890, 891, 893, 894, 895, 896, 897, 898, 905, 906, 909, 912, 915, 917, 919, 921, 924, 926, 928, 931, 932, 935, 938, 940, 942, 944, 946, 948, 950, 951, 953, 955, 957, 960, 962, 963, 965, 967, 968, 969, 971, 973, 974, 976, 977, 978, 984, 985, 986, 987, 988, 989, 990, 991, 992, 993, 994, 995, 996, 999, 1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010, 1012, 1014, 1015, 1016, 1017, 1020, 1021, 1022, 1023, 1024, 1025, 2670, 2019, 2027, 2037, 2050, 2052, 2074, 2088, 4052, 4077, 4079, 4083, 4122, 4144, 4145, 4146, 4222, 4263, 4554, 4562, 4618, 6058, 6100, 6211, 6215, 6570, 8128, 8194, 8901];
const Starters = [1, 4, 7, 152, 155, 158, 252, 255, 258, 387, 390, 393, 495, 498, 501, 650, 653, 656, 722, 725, 728, 810, 813, 816, 906, 909, 912];
const StartersDexData = {seenAttr: 149n, caughtAttr: 157n, natureAttr: 524288, seenCount: 0, caughtCount: 0, hatchedCount: 0, ivs: [10, 10, 10, 10, 10, 10] };
const resetDexData = {seenAttr: 0n, caughtAttr: 0n, natureAttr: 0, seenCount: 0, caughtCount: 0, hatchedCount: 0, ivs: [0, 0, 0, 0, 0, 0] };
const StartersStarterData = { moveset: null, eggMoves: 0, candyCount: 0, friendship: 0, abilityAttr: 1, passiveAttr: 0, valueReduction: 0, classicWinCount: 0 };
const resetStarterData = { moveset: null, eggMoves: 0, candyCount: 0, friendship: 0, abilityAttr: 0, passiveAttr: 0, valueReduction: 0, classicWinCount: 0 };

const origConsoleDebug = unsafeWindow.console.debug;
unsafeWindow.console.debug = function(...args){
    args.forEach(arg =>{
        console.log(args)
        // unlockAllPokemon
        if(arg && arg.dexData !== undefined && hacks.unlockAllPokemon.enabled){
            pokemon.forEach(p =>{
                arg.dexData[p] = hacks.unlockAllPokemon.value;
            });
        }
        // unlockEverything
        if(arg && arg.starterData !== undefined && hacks.unlockEverything.enabled){
            pokemon.forEach(p =>{
                arg.starterData[p] = hacks.unlockEverything.value;
            });
        }
        // resetDexData
        if(arg && arg.starterData !== undefined && hacks.resetDexData.enabled){
            Object.keys(arg.dexData).forEach(index =>{
                arg.dexData[index] = Starters.includes(Number(index)) ? StartersDexData : resetDexData;
            })
            Object.keys(arg.starterData).forEach(index =>{
                arg.starterData[index] = Starters.includes(Number(index)) ? StartersStarterData : resetStarterData;
            })
        }
    });
}