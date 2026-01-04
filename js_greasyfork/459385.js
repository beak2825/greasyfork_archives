// ==UserScript==
// @name         宝可梦点击（Poke Clicker）辅助脚本 维他命喂养脚本
// @namespace    PokeClickerHelper
// @version      1.3
// @description  在喂养界面中倍数选项右边的下拉菜单
// @author       CoCo
// @match        https://www.pokeclicker.com
// @match        https://g8hh.github.io/pokeclicker/
// @match        https://pokeclicker.g8hh.com
// @match        https://yx.g8hh.com/pokeclicker/
// @icon         data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wAAAP8AAAD/AAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAA/319hf99fYX/fX2F/319hf8AAAD/AAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///////////////////////////99fYX/fX2F/319hf8AAAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/////////////////wAAAP8AAAD/fX2F/319hf99fYX/AAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////8AAAD/AAAA/wAAAP99fYX/fX2F/wAAAP8AAAD/AAAA/319hf8AAAD/AAAAAAAAAAAAAAAAAAAAAAAAAP8AAAD/HBT//xwU//8AAAD//////319hf8AAAD/Dgim/w4Ipv8AAAD/AAAA/wAAAAAAAAAAAAAAAAAAAAAAAAD/HBT//xwU//8cFP//HBT//wAAAP8AAAD/Dgim/w4Ipv8OCKb/Dgim/wAAAP8AAAAAAAAAAAAAAAAAAAAAAAAA/xwU//8cFP//HBT//xwU/44cFP//HBT//xwU//8cFP//Dgim/w4Ipv8AAAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/HBT//xwU/47/////HBT/jhwU//8cFP//HBT//w4Ipv8AAAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/xwU//8cFP//HBT/jhwU//8OCKb/Dgim/w4Ipv8OCKb/AAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAA/xwU//8OCKb/Dgim/w4Ipv8AAAD/AAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAA/wAAAP8AAAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAPw/AADwDwAA4AcAAOAHAADAAwAAwAMAAMADAADAAwAA4AcAAOAHAADwDwAA/D8AAP//AAD//wAA//8AAA==
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/459385/%E5%AE%9D%E5%8F%AF%E6%A2%A6%E7%82%B9%E5%87%BB%EF%BC%88Poke%20Clicker%EF%BC%89%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC%20%E7%BB%B4%E4%BB%96%E5%91%BD%E5%96%82%E5%85%BB%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/459385/%E5%AE%9D%E5%8F%AF%E6%A2%A6%E7%82%B9%E5%87%BB%EF%BC%88Poke%20Clicker%EF%BC%89%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC%20%E7%BB%B4%E4%BB%96%E5%91%BD%E5%96%82%E5%85%BB%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

const LoadUAV = function () {
    if (document.readyState === 'interactive') {
        const text = `<a class="dropdown-item" id="UAV" href="#" onclick="UseAllVitamins()">按繁殖效率排序喂养</a>`;
        $('#pokemonVitaminExpandedModal div .dropdown-menu').prepend(text);
    }
    if (document.readyState === 'complete') { this.removeEventListener('readystatechange', LoadUAV) }
}
document.addEventListener('readystatechange', LoadUAV);


function attckdebuff(pokemonname) {//计算地区debuff
    if (App.game.challenges.list.regionalAttackDebuff.active()) {
        if (PokemonHelper.calcNativeRegion(pokemonname) !== player.highestRegion()) {
            return App.game.party.getRegionAttackMultiplier();
        }
    }
    return 1.0
}
function Steps(Protein, Calcium, Carbos, eggsteps) {//计算步数
    const div = 300;
    const extraCycles = (Protein + Calcium) * 20;
    const steps = eggsteps + extraCycles;
    return steps <= div ? steps : Math.round(((steps / div) ** (1 - Carbos / 70)) * div);
}

function BreedingAttackBonus(Protein, Calcium, baseAttack) {//计算攻击成长

    return baseAttack * (25 + Calcium) / 100 + Protein;
}

function BreedingEfficiency(Protein, Calcium, Carbos, eggsteps, baseAttack, pokemonid, pokemonname) {//效率计算
    return ((BreedingAttackBonus(Protein, Calcium, baseAttack) * App.game.party.getPokemon(pokemonid).calculateEVAttackBonus()) / Steps(Protein, Calcium, Carbos, eggsteps)) * GameConstants.EGG_CYCLE_MULTIPLIER * attckdebuff(pokemonname);
}

function sortresult(a, b) {//按效率排序
    return b[3] - a[3];
}
function Need(Need_amount, Used_amount, Leftover_amount) {//计算余量
    if (Need_amount - Used_amount - Leftover_amount > 0) {
        return Need_amount - Used_amount - Leftover_amount;
    }
    return 0;
}
UseAllVitamins = () => {
    let pokemonArr = App.game.party.caughtPokemon;
    let Protein;
    let Calcium;
    let Carbos;
    let baseAttack;//基础攻击力
    let eggsteps;//孵蛋步数
    let breedingEfficiency;//效率
    let max;
    let Vitamins_amount;//可用维他命总数
    let X;//记录Protein
    let Y;//记录Calcium
    let Z;//记录Carbos
    let Protein_amount;//Protein现有数量
    let Calcium_amount;//Calcium现有数量
    let Carbos_amount;//Carbos现有数量
    let result = [];//记录所有最优解
    let pokemonid;
    let pokemonname;
    let Need_Protein_amount = 0;//Protein所需数量
    let Need_Calcium_amount = 0;//Calcium所需数量
    let Need_Carbos_amount = 0;//Carbos所需数量
    let Used_Protein_amount = 0;//Protein已用数量
    let Used_Calcium_amount = 0;//Calcium已用数量
    let Used_Carbos_amount = 0;//Carbos已用数量
    PartyController.removeAllVitaminsFromParty(false);//清除所有维他命
    Vitamins_amount = (player.highestRegion() + 1) * 5;
    for (let i = 0; i < pokemonArr.length; i++) {//计算最优解并放入数组
        //初始化
        Protein = 0;
        Calcium = 0;
        Carbos = 0;
        max = 0;
        X = 0;
        Y = 0;
        Z = 0;
        pokemonid = App.game.party.caughtPokemon[i].id;//获取ID
        pokemonname = App.game.party.caughtPokemon[i].name;//获取名字
        baseAttack = App.game.party.caughtPokemon[i].baseAttack;//获取基础攻击力
        eggsteps = App.game.party.caughtPokemon[i].eggCycles * 40;//获取孵蛋步数
        for (Carbos = Vitamins_amount; Carbos > 0; Carbos--) {//计算最优解
            if (baseAttack > 100) {
                Calcium = Vitamins_amount - Carbos
            }
            else if (baseAttack <= 100) {
                Protein = Vitamins_amount - Carbos;
            }
            breedingEfficiency = BreedingEfficiency(Protein, Calcium, Carbos, eggsteps, baseAttack, pokemonid, pokemonname);
            if (breedingEfficiency > max) {
                //记录
                max = breedingEfficiency;
                X = Protein;
                Y = Calcium;
                Z = Carbos;
            }
        }
        Need_Protein_amount += X;
        Need_Calcium_amount += Y;
        Need_Carbos_amount += Z;
        result.push([X, Y, Z, max, pokemonid]);//存入数据
    }
    result.sort(sortresult);//按繁殖效率排序
    for (let j = 0; j < result.length; j++) {//喂维他命
        let flag;
        for (let i = 0; i < pokemonArr.length; i++) {
            if (App.game.party.caughtPokemon[i].id == result[j][4]) {
                //获取三种维他命现有数量（不含已使用）
                Protein_amount = player.itemList["Protein"]();
                Calcium_amount = player.itemList["Calcium"]();
                Carbos_amount = player.itemList["Carbos"]();
                if (Protein_amount < result[j][0] || Calcium_amount < result[j][1] || Carbos_amount < result[j][2])//判断是否够用
                {
                    alert("维他命不足，已结束喂药" + '\n' +
                        "距离喂下一个还需买" + '\n' +
                        "Protein:" + Need(result[j][0], Protein_amount, 0) + '\n' +
                        "Protein:" + Need(result[j][1], Calcium_amount, 0) + '\n' +
                        "Carbos:" + Need(result[j][2], Carbos_amount, 0) + '\n');
                    flag = true;
                    break;
                }
                else {
                    if (result[j][0] > 0) {
                        App.game.party.caughtPokemon[i].useVitamin(0, result[j][0]);//喂Protein
                        Used_Protein_amount += result[j][0];
                    }
                    if (result[j][1] > 0) {
                        App.game.party.caughtPokemon[i].useVitamin(1, result[j][1]);//喂Calcium
                        Used_Calcium_amount += result[j][1];
                    }
                    if (result[j][2] > 0) {
                        App.game.party.caughtPokemon[i].useVitamin(2, result[j][2]);//喂Carbos
                        Used_Carbos_amount += result[j][2];
                    }
                }
            }
        }
        if (flag) {
            break;
        }
    }
    alert("已结束喂药,距离当前已获得宝可梦完全喂满还需喂" + '\n' +
        "Protein:" + Need(Need_Protein_amount, Used_Protein_amount, player.itemList["Protein"]()) + '\n' +
        "Protein:" + Need(Need_Calcium_amount, Used_Calcium_amount, player.itemList["Calcium"]()) + '\n' +
        "Carbos:" + Need(Need_Carbos_amount, Used_Carbos_amount, player.itemList["Carbos"]()) + '\n'
    )
}