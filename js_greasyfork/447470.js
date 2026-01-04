// ==UserScript==
// @name         bilibili PC端分区屏蔽
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  本脚本通过删除页面元素可屏蔽bilibili弹幕网站的某些分区
// @author       HotCoffer
// @match        https://www.bilibili.com/
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @lincense     MIT
// @downloadURL https://update.greasyfork.org/scripts/447470/bilibili%20PC%E7%AB%AF%E5%88%86%E5%8C%BA%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/447470/bilibili%20PC%E7%AB%AF%E5%88%86%E5%8C%BA%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
        try {
            //请在这里输入想要屏蔽的分区名称,用英文逗号隔开 eg. '直播','动画'
            var inputPartitionList = ['直播','国创','音乐','漫画','舞蹈','课堂','汽车','鬼畜','时尚','资讯','娱乐','影视','特别推荐'];
            //请在这里输入想要屏蔽右侧导航栏名称,用英文逗号隔开 eg. '直播','动画'
            var elevator = ['直播','国创','音乐','漫画','舞蹈','课堂','汽车','鬼畜','时尚','资讯','娱乐','影视'];

            //键值对
            var tabList = [];
            tabList['推广'] = 'reportFirst2';
            tabList['赛事'] = 'reportFirst3';

            tabList['直播'] = 'bili_live';
            tabList['动画'] = 'bili_douga';
            tabList['番剧'] = 'bili_anime';
            tabList['国创'] = 'bili_guochuang';
            tabList['漫画'] = 'bili_manga';
            tabList['音乐'] = 'bili_music';
            tabList['舞蹈'] = 'bili_dance';
            tabList['游戏'] = 'bili_game';
            tabList['知识'] = 'bili_knowledge';
            tabList['课堂'] = 'bili_cheese';
            tabList['科技'] = 'bili_tech';
            tabList['运动'] = 'bili_sports';
            tabList['汽车'] = 'bili_car';
            tabList['生活'] = 'bili_life';
            tabList['美食'] = 'bili_food';
            tabList['动物圈'] = 'bili_animal';
            tabList['鬼畜'] = 'bili_kichiku';
            tabList['时尚'] = 'bili_fashion';
            tabList['资讯'] = 'bili_information';
            tabList['娱乐'] = 'bili_ent';
            tabList['专栏'] = 'bili_read';
            tabList['电影'] = 'bili_movie';
            tabList['电视剧'] = 'bili_teleplay';
            tabList['影视'] = 'bili_cinephile';
            tabList['纪录片'] = 'bili_documentary';
            tabList['特别推荐'] = 'bili_report_spe_rec';

            //删除分区元素
            for (var inputKey in inputPartitionList) {
                if (!isBlank(tabList[inputPartitionList[inputKey]])) {
                    document.getElementById(tabList[inputPartitionList[inputKey]].toString()).remove();
                } else {
                    console.info("输入值有误！请检查{%s}是否在字典列表中" + inputKey);
                }
            }

            //TODO 删除侧边栏元素
            //var elementsByClassName = document.getElementsByClassName("item sortable");

        } catch (errorMessage) {
            console.error("bilibili分区屏蔽脚本错误：%s",errorMessage);
        }
        document.getElementById("bili_live").remove();

    },false);

    function isBlank(data) {
        if (data == null || data === 'null' || data === '' || data === undefined || data === 'undefined' || data === 'unknown') {
            return true
        } else {
            return false
        }
    }