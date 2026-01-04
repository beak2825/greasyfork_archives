// ==UserScript==
// @name         梦幻藏宝阁工具
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  多功能分析
// @author       大象无形
// @match        https://xyq.cbg.163.com/equip*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415904/%E6%A2%A6%E5%B9%BB%E8%97%8F%E5%AE%9D%E9%98%81%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/415904/%E6%A2%A6%E5%B9%BB%E8%97%8F%E5%AE%9D%E9%98%81%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==


(function() {
    'use strict';
    window.summary = "";
    window.sleep = function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    window.getFinalPrice = () => {
        document.querySelector("#role_basic").click();
        // 角色总价格
        const charPrice = getPrice();
        // 乾元丹溢价
        const telentDelta = getTelentCountDelta();
        // 宠物修炼溢价
        const petTrainDelta = getPetTrainingDelta();
        // 切换到技能页面
        document.querySelector("#role_skill").click();

        // 强壮溢价
        const strong = getStrongDelta();

        // 神速溢价
        const speed = getSpeedDelta();

        // 师门技能溢价
        const mainSkillDelta = getSkillDelta();

        // 辅助， 中药或者烹饪
        const additionalDelta = getAdditionalSkillDelta()

        // 坐骑成长
        const mountTalent = getMountTalent()

        return charPrice - (telentDelta
                            + petTrainDelta + strong + speed +
                            mainSkillDelta + additionalDelta + mountTalent)*0.8;
    }
    window.getAnalysis = function () {
        summary += "最终估价: " + getFinalPrice() + "\n";
        alert(summary);
    }

    // 宠物修炼 单位 宠物经验
    window.petTrainingCost = {
        15: 0,
        16: 3150,
        17: 6660,
        18: 10550,
        19: 14840,
        20: 19550,
        21: 24700 + 413/70*150,
        22: 30310 + 900/70*150,
        23: 36400 + 1700/70*150,
        24: 42990 + 2900/70*150,
        25: 50100 + 5000/70*150,
    }

    // 强壮消耗 单位w
    window.strong = [43, 49.5, 57, 65, 75, 85, 97, 110, 123, 137, 153, 170, 187, 205, 225, 245, 267, 290, 313, 337,
                     363, 389, 417, 445, 475, 505, 537, 569, 603, 637, 673, 710, 747, 785, 825, 865, 907, 949, 993, 1037]


    window.getPrice = function(){
        let price = parseInt(document.querySelector(".price.fB").textContent.match(/\d/g).join(""))/100;
        summary += "角色初始价格: " + price + "\n"
        summary += "计算按照3个技能150， 修炼攻法20， 防御15， 修炼果70w， 比例 3000：230 计算 \n"
        return price;
    }

    window.getPetTrainingDelta = ()=> {
        const petTrainingMap = getPetTrainings();
        let totalCount = 0;
        let lastCount = 0;
        for (let key in petTrainingMap) {
            if (key === '育兽术') {
                continue;
            }
            // 攻法从20开始起算
            if (key ==='攻击控制力' || key === '法术控制力'){
                totalCount -= 19550;
            }
            summary += key + " 当前修炼等级: " + petTrainingMap[key] + "\n";
            totalCount += petTrainingCost[petTrainingMap[key]];
        }
        //最后结果，按照一个修炼果70w 3000w=230元比例换算
        summary += "修炼价格折算："+ Math.floor(totalCount/150 * 70 / 3000 * 230 *0.8) + "\n";
        return totalCount / 150 * 70 / 3000 * 230;
    }
    window.getMountTalent = () => {
         let riderTalent = 0;
         document.querySelector("#role_riders").click();
         const count = document.querySelector("#RoleRiders").children[0].rows[0].cells.length;
         for (let i=0; i<count; i++) {
             let nextMount = document.querySelector("#RoleRiders").children[0].rows[0].cells[i].children[0];
             if (typeof nextMount === 'undefined') break;
             nextMount.click();
             let riderTelant = document
        .evaluate("//th[contains(.,'成长')]", document, null, XPathResult.ANY_TYPE, null )
        .iterateNext()
        .getParent()
        .textContent
        .match(/\d+\.\d+/)[0];
             if (parseFloat(riderTelant) >= 2.2){
                 riderTalent = 400
             }
         }
        if (riderTalent > 0) {
         summary += "有至少一个坐骑成长大于2.2, 折算 320 \n";
        }
        return riderTalent;
    }

    window.getTelentCountDelta = ()=>{
        let countInstr = document
        .evaluate("//strong[contains(.,'新版乾元丹数量：')]", document, null, XPathResult.ANY_TYPE, null )
        .iterateNext()
        .getParent()
        .textContent
        .match(/\d/)[0]
        if (countInstr === "5") summary += "五颗乾元丹，折算800元\n"
        return countInstr === "5" ? 1000: 0;
    }

    window.getTrainings = ()=>{
        const allTrainDes= document.querySelector("#role_info_box")
        .querySelectorAll(".cols")[1]
        .querySelectorAll(".tb02")[0]
        .innerText
        .split("\n");
        return pullData(allTrainDes);
    }

    window.getPetTrainings = ()=>{
        const allTrainDes= document.querySelector("#role_info_box")
        .querySelectorAll(".cols")[1]
        .querySelectorAll(".tb02")[1]
        .innerText
        .split("\n");
        return pullData(allTrainDes);
    }

    window.pullData = (allDes)=>{
        let trainings = {}
        for (let row of allDes) {
            let key = row.split("：")[0];
            let value = parseInt(row.match(/\d+/g)[0]);
            trainings[key] = value;
        }
        return trainings;
    }

    window.getStrongDelta = () =>{
        const strongLevel = getSkillLevel('强壮');
        let cost = 0;
        for (let i=0; i<strongLevel; i++) {
            cost += strong[i];
        }
        summary += "强壮等级："+ strongLevel + ` 折算价格: ${Math.floor(cost / 3000 * 230*0.8)}` + "\n";
        return cost / 3000 * 230;
    }

    window.getSpeedDelta=()=>{
        const strongLevel = getSkillLevel('神速');
        let cost = 0;
        for (let i=0; i<strongLevel; i++) {
            cost += strong[i];
        }
        summary += "神速等级："+ strongLevel + ` 折算价格: ${Math.floor(cost / 3000 * 230*0.8)}` + "\n";
        return cost / 3000 * 230;
    }

    window.getSkillLevel = (skillName) => {
        try{
            return parseInt(document
                            .evaluate("//h5[contains(.,'" + skillName + "')]", document, null, XPathResult.ANY_TYPE, null )
                            .iterateNext()
                            .getParent()
                            .textContent
                            .match(/\d+/g)[0]);
        } catch(e) {
            return 0;
        }
    }

    window.getSkillDelta = ()=>{
        let count = document
        .evaluate("//h4[contains(.,'师门技能')]", document, null, XPathResult.ANY_TYPE, null )
        .iterateNext()
        .getParent()
        .textContent
        .match(/150/g)
        .length
        let value = count >= 3 ? (count - 3) * 191 : 0;
        // 按照一个技能不是150 就是120 -> 150 计算
        summary += `师门满技能个数：${count}, 折算价格: ${value*0.8}\n`;
        return value;
    }


    window.getAdditionalSkillDelta = ()=>{
        let cockLevel = getSkillLevel('烹饪技巧');
        let cockDelta = cockLevel >= 140 ? 200 : 0;
        summary += `烹饪技巧: ${cockLevel} 折算价格: ${cockDelta*0.8} \n`
    let pillLevel = getSkillLevel('中药医理');
    let pillDelta = pillLevel >= 140 ? 200 : 0;
    summary += `中药医理: ${pillLevel} 折算价格: ${pillDelta*0.8} \n`;

    let anqi = getSkillLevel('暗器技巧');
    let anqiDelta = anqi >= 160 ? 300 : 0;
    summary += `暗器技巧: ${anqi} 折算价格: ${anqiDelta*0.8} \n`

    return cockDelta + pillDelta + anqiDelta;
}
// Your code here...
document.querySelectorAll(".header.area.hasLayout.clearfix")[0].innerHTML += '<button onclick="getAnalysis()">详细估价</button>'
    document.querySelector("#info_panel").innerHTML += `<li> <strong>大象估价:</strong> <span class="price fB"><span class="p10000">￥${getFinalPrice().toFixed(2)}（元）</span></span> </li>`
})();