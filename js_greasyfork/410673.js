// ==UserScript==
// @name         天龙畅易阁扫描角色脚本
// @namespace    http://tampermonkey.net/
// @require      https://cdn.bootcss.com/jquery/2.2.4/jquery.js
// @version      0.2.8
// @description  扫描稀有道具，坐骑，时装，珍兽
// @author       huaguoguo
// @match        http://tl.cyg.changyou.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410673/%E5%A4%A9%E9%BE%99%E7%95%85%E6%98%93%E9%98%81%E6%89%AB%E6%8F%8F%E8%A7%92%E8%89%B2%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/410673/%E5%A4%A9%E9%BE%99%E7%95%85%E6%98%93%E9%98%81%E6%89%AB%E6%8F%8F%E8%A7%92%E8%89%B2%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 扫描账号详情信息
    let xiyouObj = {}
    let dataIdNameObj = {}
    if (typeof charObj != 'undefined') {
        // 添加关注监听 监听节点直接用title包含关注的
        $("[title*='关注']")[0].addEventListener("click",function(){
            favorgoodLister();
        });
        scancharObj();
    }


    // 扫描账号详情信息入口
    function scancharObj() {



        let charStr = JSON.stringify(charObj);


        init();
        console.log('------------------------------')
        console.log('角色：' + charObj.charName)
        let infoArr = [];
        // 扫描稀有道具
        for (let name in xiyouObj) {
            let info = '';
            for (let string of xiyouObj[name]) {
                if (charStr.indexOf(string) != -1) {
                    info = name + "-" + string;
                    infoArr.push(info);
                }
            }

        }
        // 扫描稀有道具
        infoArr.push.apply(infoArr, scanYiFu());
        // 扫描资质超过4000的珍兽
        infoArr.push.apply(infoArr, scanPetList());
        console.log('------------------------------', infoArr)
        // 扫描到的稀有道具插入页面中
        let ul = document.createElement('ul')
        ul.class = "info-list";
        let charName_li = $('<li>角色:' + charObj.charName + '</li>');
        let infantName_li = $('<li>子女:' + charObj.infants[0].infantName + '</li>');
        let total_li = $('<li>稀有道具数量:' + infoArr.length + '</li>');
        $(ul).append(charName_li)
        $(ul).append(infantName_li)
        $(ul).append(total_li)
        for (let info of infoArr) {
            let infoStr = '┖-' + info;
            let li = document.createElement('li')
            let newContent = document.createTextNode(infoStr);
            // 添加文本节点 到这个新的 div 元素
            li.appendChild(newContent);
            ul.appendChild(li)
        }
        let goods_info = document.getElementsByClassName("goods-info")[0];
        goods_info.appendChild(ul)
    }

    function init() {
        console.log("加载稀有道具列表")

        // 稀有坐骑
        let zuoqiArr = ["沧澜羽翼", "金羽", "梦灵仙驹", "青翼战龙", "添福锦鳞", "水碧飞鸢", "绒雪神牛", "黑天马", "紫电", "月白龙马", "四喜送鲤台",
            "绝云焱龙", "熔岩魔犀", "绛紫飞鸢", "梦幻仙驹", "霸世羽龙", "鹊暝墨羽", "鹊歌锦羽", "绮梦蝶", "霞上仙", "炎羽", "乌夜兮游缰", "坠风莲", "云水叠"];
        // 稀有时装
        let yifuArr = ["龙凤呈祥", "龙凤遥相倚", "锦衣醉画", "枭龙霸铠", "虎啸雄装", "炎狼尊袍", "鲤戏澜芳", "辰渊云蕊", "霓裳羽衣", "碧景琉璃",
            "梦华录", "惜君青玉裳", "瑞鹤集", "红泪多", "笑红尘", "虹蝉锦装", "愿君共白首", "羽衣何翩跹", "熹年画中人", "上元清嘉景", "缇骑照玉京"]
        // 稀有幻世武器
        let huanshiArr = ["绿绮"]
        xiyouObj = {
            "坐骑": zuoqiArr,
            "时装": yifuArr,
            "幻视武器": huanshiArr,
            "稀有道具": ["移骨丹"]
        }
    }

    // 扫描稀有时装
    function scanYiFu() {
        // 获取装备，道具描述信息
        dataIdNameObj = {
            '凤染梧桐': '时装-仙侣情缘【凤染梧桐风格】',
            '紫绶仙尊风格': '时装-仙侣情缘【紫绶仙尊风格】',
            '朱颜风格': '时装-银霏染月【朱颜风格】',
            '金粉世家': '时装-墨羽潜幽【金粉世家风格】',
            '檀粉风格': '时装-锦绣游仙【檀粉风格】'
        }
        let dataIdArr = [];
        for (let key in dataIdNameObj) {
            dataIdArr.push(key)
        }
        // 扫描到的稀有道具
        let xiyouDataArr = [];
        $("script[id]").each(function () {
            let type = $(this).attr("type");
            let id = $(this).attr("id");
            if ("text/tips" == type && /^[0-9]*$/.test(id)) {
                let desc = $(this).html();
                for (let string of dataIdArr) {
                    if (desc.indexOf(string) != -1) {
                        xiyouDataArr.push(dataIdNameObj[string])
                    }
                }

            }

        });
        return xiyouDataArr;
    }

    // 扫描珍兽
    function scanPetList() {
        let xiyouPetList = [];
        for (let i = 0; i < charObj.petList.length; i++) {
            let pet = charObj.petList[i];
            let petInfo = "珍兽-" + pet.petVarLevelExplain;
            // 30附体 悟性-灵性-融合度
            if (pet.savvy == 10 && pet.lingXing == 10 && pet.fitValue == 10) {
                petInfo += "【30附体】"
            }
            // 获取各项资质,其中一项资质超过4000，就展示出来
            if (pet.strPerception >= 4000) {
                petInfo += "【力量资质" + pet.strPerception + "】";
            }
            if (pet.sprPerception >= 4000) {
                petInfo += "【灵气资质" + pet.sprPerception + "】"
            }
            if (pet.conPerception >= 4000) {
                petInfo += "【体力资质" + pet.conPerception + "】"
            }
            if (pet.comPerception >= 4000) {
                petInfo += "【定力资质" + pet.comPerception + "】"
            }
            if (pet.dexPerception >= 4000) {
                petInfo += "【身法资质" + pet.dexPerception + "】"
            }
            // 七八级变异等级
            if (pet.petVarLevel > 6 && pet.petVarLevel < 9) {
                petInfo += "【" + pet.petVarLevel + "级变异】";
            }
            if (petInfo.indexOf("【") != -1) {
                xiyouPetList.push(petInfo);
            }
        }
        return xiyouPetList;
    }

    // 关注商品监听，用来收集角色数据发送到服务端
    function favorgoodLister() {
        console.log("关注进来咯")
        // 获取价格，serial_num， 如果登录了，获取data-goods-id
        let list =  {};
        $.ajax({
            //请求方式
            type : "POST",
            //请求的媒体类型
            contentType: "application/json;charset=UTF-8",
            //请求地址
            url : "http://localhost:8080/renren-fast/cyg/favorgood",
            //数据，json字符串
            data : JSON.stringify(charObj),
            //请求成功
            success : function(result) {
                console.log(result);
            },
            //请求失败，包含具体的错误信息
            error : function(e){
                console.log(e.status);
                console.log(e.responseText);
            }
        });
    }
})();

