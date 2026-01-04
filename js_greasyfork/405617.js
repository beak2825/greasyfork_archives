// ==UserScript==
// @name        河海大学教务系统--辅助评教脚本
// @namespace   HHU
// @version     2.02
// @description 在教师评教页面显示十个按钮，根据需要（上方按钮随机选择，下方按钮为全相同选项）即可一键全选并填充简单的评语
// @author      plusmultiply0
// @match       http://202.119.113.135/*
// @match       http://202.119.113.136/*
// @match       http://202.119.113.147/*
// @match       http://202.119.113.148/*
// @run-at      document-idle
// @grant       none
// @license     MIT License
// @downloadURL https://update.greasyfork.org/scripts/405617/%E6%B2%B3%E6%B5%B7%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F--%E8%BE%85%E5%8A%A9%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/405617/%E6%B2%B3%E6%B5%B7%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F--%E8%BE%85%E5%8A%A9%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
function mainForJudge() {
    try {
        // functional
        const selectItem = (row, col) => {
            let path = `#tblView > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(${row}) > td > input[type=radio]:nth-child(${col})`;
            document.querySelector(path).setAttribute('checked', true);
        }

        const randomGernete = (num, base) => {
            return [1, 2, 3, 4, 5].map(() => Math.ceil(num + base * Math.random())).concat([1, 2, 3, 4, 5].map(() => Math.ceil(num + base * Math.random()))).slice(0, 6);
        }

        const result = (num, base) => {
            // clear exist
            let clearList = [...document.querySelectorAll("#tblView > tbody > tr > td:nth-child(2) > table > tbody input[type=radio]")];
            clearList.map((item) => item.removeAttribute('checked'));

            let newArr = randomGernete(num, base);
            for (let i = 0; i < 6; i++) {
                selectItem((2 + 3 * i), newArr[i]);
            }
            // 一般为教材的选用情况，默认为 正式出版教材
            // 实验课程，该问会询问实验仪器的情况；下一问才是教材的选用情况
            selectItem(20, 1);
            // 默认为默认为 正式出版教材（当为实验课程时）
            try {
                selectItem(23, 1);
            } catch (error) { }
            // 生成简单的评语
            document.querySelector("body > form > table.fieldsettop > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr > td > textarea").value = "感谢老师这个学期的教学和指导";
        }

        const best = () => result(1, 0);
        const good = () => result(0, 3);
        const soso = () => result(1, 3);
        const notgood = () => result(2, 3);
        const bad = () => result(5, 0);

        // 选项相同的情况
        const same_best = () => result(1, 0);
        const same_good = () => result(2, 0);
        const same_soso = () => result(3, 0);
        const same_notgood = () => result(4, 0);
        const same_bad = () => result(5, 0);

        const eventlist = [best, good, soso, notgood, bad];
        const eventlist2 = [same_best,same_good,same_soso,same_notgood,same_bad];
        // UI
        // 生成评教按钮
        const judge = ['非常好', '较好', '一般', '较差', '非常差'];
        const judge2 = ['全-非常满意', '全-比较满意', '全-一般满意', '全-不满意','全-非常不满意'];

        let fragments = document.createDocumentFragment('div');
        let fragmentAll = document.createElement('div');

        let fragmentOne = document.createElement('div');
        let fragmentTwo = document.createElement('div');

        fragmentOne.style = "display:flex;margin:3px";
        fragmentTwo.style = "display:flex;margin:3px";

        const addElem = (text) => {
            let div = document.createElement('div');
            let textnode = document.createTextNode(text);
            div.appendChild(textnode);
            div.style = 'border:1px solid #000;font:700 24px serif;';
            return div;
        }

        const addElem2 = (text) => {
            let div = document.createElement('div');
            let textnode = document.createTextNode(text);
            div.appendChild(textnode);
            div.style = 'border:1px solid #603434;font:700 24px serif;';
            return div;
        }

        // 为每个按钮绑定事件
        let nodes = judge.map((item => addElem(item)));
        for (let i = 0; i < nodes.length; i++) {
            nodes[i].onclick = eventlist[i];
        }
        let nodes2 = judge2.map((item => addElem2(item)));
        for (let i = 0; i < nodes2.length; i++) {
            nodes2[i].onclick = eventlist2[i];
        }

        // 添加至文档片段中
        nodes.map((item) => fragmentOne.appendChild(item));
        nodes2.map((item) => fragmentTwo.appendChild(item));

        fragmentAll.appendChild(fragmentOne);
        fragmentAll.appendChild(fragmentTwo);

        fragments.appendChild(fragmentAll);
        // 添加至页面中
        document.querySelector("body > form > table.fieldsettop > tbody > tr > td > table:nth-child(1) > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr > td").appendChild(fragments);
    }
    catch (error) {
        // console.log(error);
    }
}

mainForJudge();