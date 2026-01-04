// ==UserScript==
// @name         IOIHW UserName Mapper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  想看到编号下的真实姓名？这个将会满足你！
// @author       iotang
// @match        https://ioihw.duck-ac.cn/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/392052/IOIHW%20UserName%20Mapper.user.js
// @updateURL https://update.greasyfork.org/scripts/392052/IOIHW%20UserName%20Mapper.meta.js
// ==/UserScript==

"use strict";

function getMapper()
{
    var temp = GM_getValue("mapper");

    if(temp === undefined)
    {
        GM_setValue("mapper", {"ioi2020_01": "周雨扬", "ioi2020_02": "张哲宇", "ioi2020_03": "任清宇", "ioi2020_04": "叶卓睿", "ioi2020_05": "李佳衡", "ioi2020_06": "马耀华", "ioi2020_07": "徐翊轩", "ioi2020_08": "罗煜翔", "ioi2020_09": "周楷文", "ioi2020_10": "周任飞", "ioi2020_11": "蒋明润", "ioi2020_12": "姜迅驰", "ioi2020_13": "袁无为", "ioi2020_14": "林凯风", "ioi2020_15": "虞皓翔", "ioi2020_16": "方汤骐", "ioi2020_17": "高子翼", "ioi2020_18": "张好风", "ioi2020_19": "卞浏予", "ioi2020_20": "李骥", "ioi2020_21": "郑钧天", "ioi2020_22": "陈立言", "ioi2020_23": "屠学畅", "ioi2020_24": "曾致远", "ioi2020_25": "陈枫", "ioi2020_26": "周镇东", "ioi2020_27": "甄子豪", "ioi2020_28": "房励行", "ioi2020_29": "周书予", "ioi2020_30": "林立", "ioi2020_31": "王展鹏", "ioi2020_32": "孙诺舟", "ioi2020_33": "曹天佑", "ioi2020_34": "陈峻宇", "ioi2020_35": "党星宇", "ioi2020_36": "潘骏跃", "ioi2020_37": "陈孙立", "ioi2020_38": "魏精", "ioi2020_39": "吴清月", "ioi2020_40": "蒋凌宇", "ioi2020_41": "何文阳", "ioi2020_42": "王慧", "ioi2020_43": "袁桢淏", "ioi2020_44": "李白天", "ioi2020_45": "李天晓", "ioi2020_46": "左骏驰", "ioi2020_47": "陈宇", "ioi2020_48": "安博施", "ioi2020_49": "刘肖", "ioi2020_50": "时中", "ioi2020_51": "钱易", "ioi2020_52": "张隽恺", "ioi2020_53": " 林昊翰", "ioi2020_54": "戴江齐", "ioi2020_55": "代晨昕", "ioi2020_56": "黄子宽", "ioi2020_57": "周欣", "ioi2020_58": "邱天异", "ioi2020_59": "丁晓漫", "ioi2020_60": "张博为", "ioi2020_61": "徐哲安", "ioi2020_62": "高麟翔", "ioi2020_63": "徐源", "ioi2020_64": "邓晗", "ioi2020_65": "蒋轩林", "ioi2020_66": "钟雨薇", "ioi2020_67": "顾奕成", "ioi2020_68": " 谌星宇", "ioi2020_69": "陆宏", "ioi2020_70": "刘宇豪"});
        temp = GM_getValue("mapper");
    }

    return temp;
}

function getHashie(who)
{
    var temp = getMapper();

    if(temp[who] == undefined)
    {
        return who;
    }

    return temp[who];
}

function setHashie(who, val)
{
    var temp = getMapper();
    temp[who] = val;
    GM_setValue("mapper", temp);
}

function cleanUp()
{
	var users = document.getElementsByClassName("uoj-username");
    var honor = document.getElementsByClassName("uoj-honor");
    var i;

    for(i = 0; i < users.length; i++)
    {
        users[i].innerHTML = getHashie(users[i].innerHTML);
    }
    for(i = 0; i < honor.length; i++)
    {
        honor[i].innerHTML = getHashie(honor[i].innerHTML);
    }
}

function comfirmHashie()
{
    var who = prompt("输入源 ID");
    if(who === null || who === undefined || who.length <= 0)return;

    var val = prompt("输入对应名字");
    if(val === null || val === undefined || val.length <= 0)
    {
        val = undefined;
    }

    setHashie(who,val);
    cleanUp();
}


var uojContent = document.getElementsByClassName("uoj-content")[0];

var buttonHashie = document.createElement("button");
buttonHashie.style = "background: rgb(212,255,212); border: none;";
buttonHashie.name = "hashieUser";
buttonHashie.id = "hashieUser";
buttonHashie.innerHTML = "添加规则";
buttonHashie.onclick = function(){comfirmHashie();};

uojContent.appendChild(buttonHashie);

cleanUp();
