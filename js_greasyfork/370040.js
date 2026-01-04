// ==UserScript==
// @name 　　　SCNU_PAY_HELPER
// @name:zh  　华南师范大学水电费支付助手
// @namespace https://github.com/fengkx/
// @match     http://pay.scnu.edu.cn/pay.html
// @version 0.1
// @description       换了系统已经没卵用了。。。为交水电费提供友好的界面，不用纠结输支付码了 
// @description:en    Provide a friendly interface for paying water and electricity　for SCNU, no need to think of the payment code
// @description:zh    换了系统已经没卵用了。。。为交水电费提供友好的界面，不用纠结输支付码了 
// @description:zh-CN 换了系统已经没卵用了。。。为交水电费提供友好的界面，不用纠结输支付码了 
// @grant none
//@run-at             document-end
// @downloadURL https://update.greasyfork.org/scripts/370040/SCNU_PAY_HELPER.user.js
// @updateURL https://update.greasyfork.org/scripts/370040/SCNU_PAY_HELPER.meta.js
// ==/UserScript==

// 生成界面
//　输入框
let body = document.querySelector('.body_to');
let table = body.querySelectorAll('table')[1];
let inputRoomNum = document.createElement('input');
inputRoomNum.setAttribute('id', 'roomNum');
inputRoomNum.setAttribute('placeholder', '房间号');
inputRoomNum.setAttribute('style', 'border-style:none;color:#000000;width:60px;margin-right:10px;margin-left:20px')
table.append(inputRoomNum);

// 各宿舍楼的对应编码　目前仅有石牌校区
let buildings = [
    {
        text: '石牌西一栋',
        areaNum: '01',
        buildingNum: 'W01'
    },
    {
        text: '石牌西二栋',
        areaNum: '01',
        buildingNum: 'W02'
    },
    {
        text: '石牌西三栋',
        areaNum: '01',
        buildingNum: 'W03'
    },
    {
        text: '石牌西四栋',
        areaNum: '01',
        buildingNum: 'W04'
    },
    {
        text: '石牌西五栋',
        areaNum: '01',
        buildingNum: 'W05'
    },
    {
        text: '石牌西六栋',
        areaNum: '01',
        buildingNum: 'W06'
    },
    {
        text: '石牌星河楼',
        areaNum: '01',
        buildingNum: 'XHL'
    }, {
        text: '石牌东四栋',
        areaNum: '01',
        buildingNum: 'E04'
    },
    {
        text: '石牌东九栋',
        areaNum: '01',
        buildingNum: 'E09'
    },
    {
        text: '石牌东十栋',
        areaNum: '01',
        buildingNum: 'E10'
    },
    {
        text: '石牌东十二栋',
        areaNum: '01',
        buildingNum: 'E12'
    },
    {
        text: '石牌十三栋',
        areaNum: '01',
        buildingNum: 'E13'
    },
    {
        text: '石牌东十四栋',
        areaNum: '01',
        buildingNum: 'E14'
    },
    {
        text: '石牌东十五栋',
        areaNum: '01',
        buildingNum: 'E15'
    },
    {
        text: '石牌东十六栋',
        areaNum: '01',
        buildingNum: 'E16'
    },
    {
        text: '石牌东十九栋',
        areaNum: '01',
        buildingNum: 'E19'
    },
    {
        text: '石牌陶南',
        areaNum: '01',
        buildingNum: 'TTN'
    },
    {
        text: '石牌陶北',
        areaNum: '01',
        buildingNum: 'TTB'
    },
    {
        text: '沁园',
        areaNum: '01',
        buildingNum: 'TQY'
    },
    {
        text: '研究生公寓',
        areaNum: '01',
        buildingNum: 'YGY'
    }
]

//选择框
let whichBuilding = document.createElement('select');
whichBuilding.setAttribute('id', 'building');
whichBuilding.setAttribute('name', 'building');
whichBuilding.style = 'border-style:none;color:#000000;width:110px;margin-right:10px';
for (let i = 0; i < buildings.length; i++) {
    let opt = document.createElement('option');
    let text = document.createTextNode(buildings[i]["text"]);
    opt.appendChild(text);
    opt.setAttribute('value', i);
    whichBuilding.appendChild(opt);
}
table.append(whichBuilding);

//确认按键
let ok = document.createElement('button');
ok.setAttribute('id', 'ok');
ok.setAttribute('style', "margin-top:2px;border:0;font-size:16px;font-family:'黑体';color:#f58220;width:100px;cursor:pointer;");
ok.innerText = 'ok';

ok.onclick = function () {
    //　获取日期，月份补零
    let date = new Date();
    let month = date.getMonth().toString();
    if (month.length < 2) {
        month = "0" + month;
    }
    //　生成对应编码
    let peopleNum = date.getFullYear().toString() + month + buildings[whichBuilding.value]["areaNum"] + buildings[whichBuilding.value]["buildingNum"] + inputRoomNum.value;
    let peopleName = buildings[whichBuilding.value]["text"].substring(2) + inputRoomNum.value
    console.debug(peopleNum, peopleName);

    document.querySelector('#userName').value = peopleName;
    document.querySelector('#userId').value = peopleNum;
    document.querySelector('#userName').onfocus();
    document.querySelector('#userId').onfocus();
    document.querySelector('#queryPayCodeBtn').click();

}
//Tip
table.append(ok);
let tip = document.createElement('p');
tip.innerText = "直接填写宿舍号选择宿舍楼，按ＯＫ即可"
tip.setAttribute('style', 'color:pink;margin-left: 12px;font-size: 16px;');
table.appendChild(tip);
