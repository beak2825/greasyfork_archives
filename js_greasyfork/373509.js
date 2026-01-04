// ==UserScript==
// @name         FF14俺tools汉化
// @namespace    undefined
// @version      0.7
// @description  将FF14俺tools生成的制作宏替换为中文译名
// @author       苦芒草
// @match        https://ffxiv.rs.exdreams.net/crafter/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373509/FF14%E4%BF%BAtools%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/373509/FF14%E4%BF%BAtools%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function(){
var ffyy = {};
        var map = itemData.data;
        for(var key in ffyy){
            map[key].name=ffyy[key]
        }


    });
    // 新技能翻译
    var actionMap = {
        'ヘイスティタッチII':'仓促II',
        '模範作業III':'模范制作III',
        '突貫作業II':'高速制作II',
        '専心加工':'专心加工',
        'マニピュレーションII':'掌握II',
        '倹約加工':'俭约加工',
        '注視作業':'注视制作',
        '注視加工':'注视加工',
        '初手仕込':'起始准备',
        '魔匠の閃き':'魔匠的闪念',
        'マイスターの切札：再生':'专精绝技：巩固',
        'マイスターの切札：静穏':'专精绝技：安稳',
        'マイスターの切札：真価':'专精绝技：闲静'
    };

    // 中文译名导入crafterActionData对象
    for (var i in crafterActionData) {
        if(crafterActionData[i].ch === '-' && actionMap[crafterActionData[i].jp]){
            crafterActionData[i].ch = actionMap[crafterActionData[i].jp];
        }else if(crafterActionData[i].ch === '中级作业'){
            crafterActionData[i].ch = '中级制作';
        }
    }

    // 切换为中文
    lang = 'ch';

    // 不转换职业中文译名，否则无法获取配方
    translateJobName = function(text) {
        return text;
    };

    // 初始化技能名
    applyDefaultData();
})();