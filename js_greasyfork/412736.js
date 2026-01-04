// ==UserScript==
// @name         mine
// @namespace    http://tampermonkey.net/
// @version      0.0.0.7
// @description  自动挖矿机器人
// @author       LaoTie
// @match        https://www.element3ds.com/plugin.php?id=yw_mine:front&mod=mineDetail&mineId=*
// @match        https://www.element3ds.com/plugin.php?id=yinxingfei_zzza:yinxingfei_zzza_hall
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/412736/mine.user.js
// @updateURL https://update.greasyfork.org/scripts/412736/mine.meta.js
// ==/UserScript==

(async function () {
    'use strict';
    await sleep(2000);
    await workupdate();
    await kaikuang();
    await lingqu();
    await AskAction();
    await MineLocalStorage();
    var timer = setInterval(async function () {
        location.reload();
    }, 180000);
})();

async function MineLocalStorage() {
    var mineid = getQuery('mineId');
    var minstr = localStorage.getItem('minelist');
    var mines = JSON.parse(minstr)
    var nowvalue = Date.now();
    if (mines === null) {
        mines = [];
    } else {
        console.log(mines);
        var has = false;
        for (let i = 0; i < mines.length; i++) {
            console.log(dateFormat('YYYY-mm-dd HH:MM', new Date(mines[i].date)));
            if (mines[i].mineid === mineid) {
                has = true;
                if (mines[i].date > nowvalue) {
                    var datestr = jQuery('.yun_mine_detail span')[8].innerText;
                    datestr = datestr.replace(' 到期', '');
                    var daoqidate = new Date(datestr);
                    var daoqi = Date.parse(daoqidate);
                    if (mines[i].date !== daoqi) {
                        mines[i].date = daoqi;
                    }
                }
            }
            if (mines[i].date < nowvalue) {
                mines.shift(mines[i])
                localStorage.setItem('minelist', JSON.stringify(mines));
                window.location.href='https://www.element3ds.com/plugin.php?id=yw_mine:front&mod=mineDetail&mineId=' + mines[i].mineid;
            }
        }
        if (!has) {
            var datestr = jQuery('.yun_mine_detail span')[8].innerText;
            datestr = datestr.replace(' 到期', '');
            var daoqidate = new Date(datestr);
            var daoqi = Date.parse(daoqidate);
            let mine = {}
            mine['mineid'] = mineid;
            mine['date'] = daoqi;
            mines.push(mine);
        }
    }
    localStorage.setItem('minelist', JSON.stringify(mines));
}

//开矿
async function kaikuang() {
    var ele = jQuery('.yun_mine_control.clearfix a')[0];
    if (ele === undefined) {
        return;
    }
    var attr = ele.attributes[1];
    if (attr.value.indexOf('background-color:#696969;') < 0 && ele.innerText == '开始挖矿') {
        ele.click();
        await sleep(500);
        jQuery('.tps-bottom a')[0].click();
        await sleep(500);
        jQuery('.yunw_button.clearfix a').click();
        await sleep(500);
        jQuery('#enter').click();
    }
}
//更新工人数量
async function workupdate() {
    var ele = jQuery('.yun_mine_control.clearfix a')[2]
    if (ele === undefined) {
        return;
    }
    var mnumele = jQuery('.yun_user_record .icon-miner');
    var minerCount = 0;
    if (mnumele.length > 0) {
        minerCount = jQuery('.yun_user_record .icon-miner')[0].innerText.trim();
    }
    if (ele.innerText == '矿工管理' && minerCount > 0) { //派遣
        ele.click();
        await sleep(500);
        var canSendMiner = jQuery('.yunw_text .clearfix')[1];
        canSendMiner = canSendMiner.innerText.replace('*可派遣人数：', '').replace('人', '');
        if (canSendMiner > 0) {
            jQuery('.yunw_label_radio label input')[0].click();
            await sleep(500);
            jQuery('.yunw_label_input').val(canSendMiner);
            await sleep(500);
            jQuery('.yunw_button input')[0].click();
            await sleep(500);
            jQuery('#enter').click();
        } else {
            jQuery('.yunw_title div span').click();
        }
    }
}
//领取操作
async function lingqu() {
    let list = await findele('.yun_user_ore')
    if (list.length > 0) {
        for (let i = 0; i < list.length; i++) {
            if (list[i].children.length > 0) {
                for (let j = 0; j < list[i].children.length; j++) {
                    if (list[i].children[j].children[0].innerHTML > 0 && list[i].children[j].children[1].attributes[1].value.indexOf('plugin.php?id=yw_mine:front&mod=myStore&act=callback_input&oreId=0') < 0) {
                        let name = list[i].children[j].children[1].innerHTML;
                        let cminfo = {};
                        cminfo.name = name;
                        cminfo.ele = list[i].children[j].children[1];
                        await getMine(cminfo);
                        await sleep(500);
                    }
                }
            }
        }
    }
}

//执行领取和出售的确认操作
async function getMine(ele) {
    ele.ele.click();
    // console.log(Date.parse(new Date()));
    await sleep(500);
    // console.log(Date.parse(new Date()));
    let buts = jQuery('#yunform .yunw_button input');
    if (buts.length > 0) {
        // console.log(buts[0].value);
        buts[0].click();
        await sleep(1000);
        jQuery('#enter').click();
    }
}

//打开问答需要辅助其他的答题脚本
async function AskAction() {
    var starele = jQuery('#ahome_question_icon')[0];
    if (starele !== undefined) {
        await yaoyiyao();
        starele.click();
        await sleep(500);
        jQuery('.tps-bottom a')[0].click();
        await sleep(500);
    }
}

async function yaoyiyao() {
    if (window.location.href.indexOf('yinxingfei_zzza_hall', 0) > 0) {
        var ele = jQuery('.zzza_hall_bottom_right_yjan_left a');
        if (ele === undefined) {
            return;
        }
        ele.click();
        await sleep(500);
        jQuery('.tps-bottom a')[0].click();
        await sleep(500);
        jQuery('#zzza_go').click();
        await sleep(1000);
    } else {
        window.location = 'https://www.element3ds.com/plugin.php?id=yinxingfei_zzza:yinxingfei_zzza_hall';
    }
}

async function findele(cls) {
    let list = [];
    jQuery(cls).each(function (i, e) {
        list.push(e);
    })
    return list;
}

//等待时间
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//获取地址参数
function getQuery(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

function GM_setObject(name, value) {
    if (value instanceof Object) {
        GM_setValue(name, JSON.stringify(value));
    }
}

function GM_getObject(name, undefined) {
    try {
        return JSON.parse(GM_getValue(name, '') || '{}');
    } catch (e) {
        return undefined;
    }
};

function dateFormat(fmt, date) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}