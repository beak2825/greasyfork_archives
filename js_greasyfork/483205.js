// ==UserScript==
// @name         冒险家综合辅助
// @namespace    http://tampermonkey.net/
// @version      1.39
// @description  冒险家竞技场查看属性,个人过滤
// @author       RuoChen丶5251
// @match        *://www.seagame.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/483205/%E5%86%92%E9%99%A9%E5%AE%B6%E7%BB%BC%E5%90%88%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/483205/%E5%86%92%E9%99%A9%E5%AE%B6%E7%BB%BC%E5%90%88%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var flag = 0;
    setInterval(function() {
//         const divsWithRejection = document.querySelectorAll('div span[style="color: #cc0033"]');
//         divsWithRejection.forEach(div => {
//             div.closest('div.middle').style.display = 'none';
//         });
        const alldiv = document.querySelectorAll('div h2.ts');
        alldiv.forEach(h2Element => {
            var div = h2Element.parentElement;
            var mat = div.innerHTML.match(/门票:\$(\d+)/); // 获取门票价格
            var p1='X';
            if(mat!==null) p1=mat[1];
            var p2 = h2Element.innerText.replace('$', ''); // 获取 h2 元素中的价格信息，去掉 $ 符号
            div.innerHTML = `价格:${p1}<br>回报:${p2}`;
            if(p2>=1000&&p1!=='X'&&p1!=='500')
                div.style.color = 'red';
            if(p2>=10000)
                div.style.color = 'red';
        });
        const myLands = document.querySelectorAll('div.middle');
        myLands.forEach(div => {
            if(div.textContent.includes('若尘丶5251')){
                div.closest('div.middle').style.display = 'none';
            }
        });
        var status = getStatus();
        if(status!=="jjc") return;
        // 获取页面文本内容
        var pageText = document.body.innerText;

        // 要查找的字符串，可以使用正则表达式进行灵活的匹配
        var searchString = /.+(强度:.*)/g;

        // 使用正则表达式进行查找
        var matches = pageText.match(searchString);

        // 检查是否找到了字符串
        if (matches !== null) {
            if(flag===0){
                var name = matches[0].match(/[^()]+(?=\()/)[0];
                var targetElement = document.querySelector('td[style="color: #333333"]');
                //根据名字查找数据
                var data = json.data.find(function(item) {
                    return item.name === name;
                });
                targetElement.appendChild(document.createElement('br'));
                var t1 = document.createTextNode(`血量:${data.health}, 攻击:${data.attack},防御:${data.defense}`);
                targetElement.appendChild(t1);

                targetElement.appendChild(document.createElement('br'));
                var t2 = document.createTextNode(`愤怒:${data.anger}, 属性:${data.attribute},闪避:${data.dodge}`);
                targetElement.appendChild(t2);

                targetElement.appendChild(document.createElement('br'));
                targetElement.appendChild(document.createTextNode(`装备:${data.equip}`));
                targetElement.appendChild(document.createElement('br'));
                targetElement.appendChild(document.createTextNode(`特效:${data.special}`));
            }
            flag = 1;
        }
        else{
            flag = 0;
        }
    }, 1000); // 时间间隔为 1000 毫秒，即 1 秒
    function getStatus(){

        var lt = document.querySelector("#chatbox");
        if (lt !== null) return "lt";

        var zb = document.querySelector("body > div:nth-child(85) > div:nth-child(1) > div > table > tbody > tr > td > table > tbody > tr > td > p:nth-child(2) > select")
        if(zb!==null) return "zb";

        var skill = document.querySelector("#game > div:nth-child(25) > span");
        if(skill!==null) return "mx";

        var bx = document.querySelector("#game > div:nth-child(11) > button");
        if(bx!==null) return "jjc";

    }
    var json = {
        "data": [
            {
                "name": "墓碑",
                "health": 15,
                "attack": 0,
                "defense": 5,
                "anger": 0,
                "attribute": 0,
                "dodge": 0,
                "equip": "",
                "special": "随机产生亡灵系"
            },
            {
                "name": "屠夫的晚餐",
                "health": 25,
                "attack": 0,
                "defense": 0,
                "anger": 0,
                "attribute": 0,
                "dodge": 0,
                "equip": "",
                "special": "给屠夫增加15血"
            },
            {
                "name": "熊猫练习靶",
                "health": 30,
                "attack": 10,
                "defense": 0,
                "anger": 0,
                "attribute": 0,
                "dodge": 0,
                "equip": "狂怒者刺盾",
                "special": "免疫毒"
            },
            {
                "name": "地狱火",
                "health": 30,
                "attack": 20,
                "defense": 0,
                "anger": 0,
                "attribute": 10,
                "dodge": 0,
                "equip": "太阳战衣",
                "special": ""
            },
            {
                "name": "小雏龙",
                "health": 30,
                "attack": 10,
                "defense": 0,
                "anger": 4,
                "attribute": 0,
                "dodge": 0,
                "equip": "",
                "special": "回血吸收伤害的一半"
            },
            {
                "name": "小牛崽子",
                "health": 35,
                "attack": 10,
                "defense": 0,
                "anger": 0,
                "attribute": 0,
                "dodge": 0,
                "equip": "",
                "special": "受到攻击增加3点愤怒"
            },
            {
                "name": "骷髅宝宝",
                "health": 30,
                "attack": 10,
                "defense": 0,
                "anger": 0,
                "attribute": 0,
                "dodge": 0,
                "equip": "",
                "special": ""
            },
            {
                "name": "野猪",
                "health": 35,
                "attack": 10,
                "defense": 3,
                "anger": 0,
                "attribute": 0,
                "dodge": 0,
                "equip": "",
                "special": ""
            },
            {
                "name": "猫咪",
                "health": 35,
                "attack": 12,
                "defense": 0,
                "anger": 0,
                "attribute": 0,
                "dodge": 0,
                "equip": "",
                "special": ""
            },
            {
                "name": "火焰猪",
                "health": 35,
                "attack": 12,
                "defense": 0,
                "anger": 0,
                "attribute": 4,
                "dodge": 0,
                "equip": "",
                "special": ""
            },
            {
                "name": "剧毒猪",
                "health": 35,
                "attack": 12,
                "defense": 0,
                "anger": 0,
                "attribute": 4,
                "dodge": 0,
                "equip": "",
                "special": ""
            },
            {
                "name": "仙人掌宝宝",
                "health": 35,
                "attack": 10,
                "defense": 0,
                "anger": 1,
                "attribute": 0,
                "dodge": 0,
                "equip": "狂怒者刺盾",
                "special": ""
            },
            {
                "name": "蛮族战士",
                "health": 50,
                "attack": 12,
                "defense": 5,
                "anger": 0,
                "attribute": 0,
                "dodge": 0,
                "equip": "",
                "special": ""
            },
            {
                "name": "蛮族刺客",
                "health": 50,
                "attack": 15,
                "defense": 0,
                "anger": 0,
                "attribute": 5,
                "dodge": 0,
                "equip": "",
                "special": ""
            },
            {
                "name": "刺客",
                "health": 30,
                "attack": 10,
                "defense": 0,
                "anger": 0,
                "attribute": 0,
                "dodge": 40,
                "equip": "",
                "special": ""
            },
            {
                "name": "岩石怪",
                "health": 50,
                "attack": 15,
                "defense": 5,
                "anger": 5,
                "attribute": 0,
                "dodge": 0,
                "equip": "",
                "special": ""
            },
            {
                "name": "红鳄鱼",
                "health": 40,
                "attack": 12,
                "defense": 3,
                "anger": 0,
                "attribute": 4,
                "dodge": 0,
                "equip": "",
                "special": ""
            },
            {
                "name": "绿鳄鱼",
                "health": 40,
                "attack": 12,
                "defense": 3,
                "anger": 0,
                "attribute": 4,
                "dodge": 0,
                "equip": "",
                "special": ""
            },
            {
                "name": "坏羊羊",
                "health": 40,
                "attack": 10,
                "defense": 0,
                "anger": 0,
                "attribute": 0,
                "dodge": 0,
                "equip": "雌雄双剑",
                "special": ""
            },
            {
                "name": "小牛战士",
                "health": 55,
                "attack": 10,
                "defense": 0,
                "anger": 0,
                "attribute": 0,
                "dodge": 0,
                "equip": "",
                "special": "受到攻击增加3点愤怒"
            },
            {
                "name": "骷髅战士",
                "health": 50,
                "attack": 12,
                "defense": 3,
                "anger": 0,
                "attribute": 0,
                "dodge": 0,
                "equip": "",
                "special": ""
            },
            {
                "name": "闪电狼",
                "health": 50,
                "attack": 13,
                "defense": 5,
                "anger": 0,
                "attribute": 5,
                "dodge": 0,
                "equip": "",
                "special": ""
            },
            {
                "name": "野狼",
                "health": 50,
                "attack": 15,
                "defense": 5,
                "anger": 5,
                "attribute": 0,
                "dodge": 0,
                "equip": "",
                "special": ""
            },
            {
                "name": "剧毒蛙",
                "health": 40,
                "attack": 8,
                "defense": 0,
                "anger": 0,
                "attribute": 0,
                "dodge": 0,
                "equip": "",
                "special": "死亡对敌方产生蛇蝎之力+6的蛇蝎伤害"
            },
            {
                "name": "冰狼",
                "health": 50,
                "attack": 13,
                "defense": 5,
                "anger": 0,
                "attribute": 5,
                "dodge": 0,
                "equip": "",
                "special": ""
            },
            {
                "name": "烈焰花",
                "health": 50,
                "attack": 13,
                "defense": 0,
                "anger": 0,
                "attribute": 5,
                "dodge": 0,
                "equip": "",
                "special": ""
            },
            {
                "name": "紫电花",
                "health": 50,
                "attack": 13,
                "defense": 0,
                "anger": 0,
                "attribute": 5,
                "dodge": 0,
                "equip": "",
                "special": ""
            },
            {
                "name": "冰魔",
                "health": 50,
                "attack": 18,
                "defense": 0,
                "anger": 0,
                "attribute": 5,
                "dodge": 0,
                "equip": "",
                "special": ""
            },
            {
                "name": "暗影魔",
                "health": 50,
                "attack": 18,
                "defense": 0,
                "anger": 0,
                "attribute": 5,
                "dodge": 0,
                "equip": "",
                "special": ""
            },
            {
                "name": "混乱小丑",
                "health": 60,
                "attack": 15,
                "defense": 0,
                "anger": 0,
                "attribute": 3,
                "dodge": 0,
                "equip": "",
                "special": "每回合对友方全体增加2点攻击2点血量"
            },
            {
                "name": "燃烧小丑",
                "health": 60,
                "attack": 15,
                "defense": 0,
                "anger": 0,
                "attribute": 5,
                "dodge": 0,
                "equip": "",
                "special": ""
            },
            {
                "name": "蛮族巫师",
                "health": 60,
                "attack": 15,
                "defense": 0,
                "anger": 0,
                "attribute": 3,
                "dodge": 0,
                "equip": "",
                "special": "每回合对友方全体增加2点攻击2点血量"
            },
            {
                "name": "钢铁怪",
                "health": 90,
                "attack": 15,
                "defense": 10,
                "anger": 5,
                "attribute": 0,
                "dodge": 0,
                "equip": "",
                "special": ""
            },
            {
                "name": "熊剑士",
                "health": 65,
                "attack": 20,
                "defense": 0,
                "anger": 0,
                "attribute": 10,
                "dodge": 0,
                "equip": "泰坦之剑",
                "special": ""
            },
            {
                "name": "企鹅骑士",
                "health": 80,
                "attack": 18,
                "defense": 5,
                "anger": 3,
                "attribute": 0,
                "dodge": 0,
                "equip": "",
                "special": ""
            },
            {
                "name": "骷髅法师",
                "health": 50,
                "attack": 12,
                "defense": 2,
                "anger": 2,
                "attribute": 2,
                "dodge": 0,
                "equip": "骷髅胸甲",
                "special": "每回合对友方亡灵恢复5滴血"
            },
            {
                "name": "软泥怪",
                "health": 80,
                "attack": 17,
                "defense": 5,
                "anger": 5,
                "attribute": 5,
                "dodge": 0,
                "equip": "",
                "special": ""
            },
            {
                "name": "死神法师",
                "health": 60,
                "attack": 12,
                "defense": 0,
                "anger": 0,
                "attribute": 4,
                "dodge": 0,
                "equip": "",
                "special": "每死亡一名生物全属性增加3点并恢复生命"
            },
            {
                "name": "烈焰甲虫",
                "health": 90,
                "attack": 18,
                "defense": 5,
                "anger": 0,
                "attribute": 8,
                "dodge": 0,
                "equip": "",
                "special": ""
            },
            {
                "name": "杀人蟹",
                "health": 80,
                "attack": 18,
                "defense": 0,
                "anger": 0,
                "attribute": 6,
                "dodge": 0,
                "equip": "",
                "special": ""
            },
            {
                "name": "剧毒蟹",
                "health": 80,
                "attack": 18,
                "defense": 0,
                "anger": 0,
                "attribute": 6,
                "dodge": 0,
                "equip": "",
                "special": ""
            },
            {
                "name": "猪王",
                "health": 60,
                "attack": 15,
                "defense": 0,
                "anger": 5,
                "attribute": 0,
                "dodge": 0,
                "equip": "",
                "special": "每两回合召唤一只强度1的猪"
            },
            {
                "name": "火蟹",
                "health": 80,
                "attack": 18,
                "defense": 0,
                "anger": 0,
                "attribute": 6,
                "dodge": 0,
                "equip": "",
                "special": ""
            },
            {
                "name": "秃鹰",
                "health": 80,
                "attack": 15,
                "defense": 0,
                "anger": 5,
                "attribute": 0,
                "dodge": 0,
                "equip": "秃鹫戒指",
                "special": ""
            },
            {
                "name": "剧毒甲虫",
                "health": 90,
                "attack": 18,
                "defense": 5,
                "anger": 0,
                "attribute": 8,
                "dodge": 0,
                "equip": "",
                "special": ""
            },
            {
                "name": "食人花王",
                "health": 80,
                "attack": 10,
                "defense": 0,
                "anger": 5,
                "attribute": 5,
                "dodge": 0,
                "equip": "",
                "special": ""
            },
            {
                "name": "仙人掌射手",
                "health": 50,
                "attack": 12,
                "defense": 0,
                "anger": 6,
                "attribute": 0,
                "dodge": 0,
                "equip": "",
                "special": "友方存在仙人掌宝宝可附加其普攻的伤害"
            },
            {
                "name": "南瓜怪",
                "health": 45,
                "attack": 12,
                "defense": 0,
                "anger": 0,
                "attribute": 4,
                "dodge": 0,
                "equip": "剧毒戒指",
                "special": ""
            },
            {
                "name": "城墙巨人",
                "health": 100,
                "attack": 20,
                "defense": 20,
                "anger": 0,
                "attribute": 0,
                "dodge": 0,
                "equip": "",
                "special": ""
            },
            {
                "name": "魔能战甲",
                "health": 90,
                "attack": 18,
                "defense": 5,
                "anger": 0,
                "attribute": 8,
                "dodge": 0,
                "equip": "能量铠甲",
                "special": "每回合对友方全体增加2点攻击5点血量"
            },
            {
                "name": "害人精",
                "health": 90,
                "attack": 25,
                "defense": 0,
                "anger": 0,
                "attribute": 10,
                "dodge": 50,
                "equip": "",
                "special": ""
            },
            {
                "name": "蛮族精英勇士",
                "health": 90,
                "attack": 20,
                "defense": 0,
                "anger": 0,
                "attribute": 0,
                "dodge": 0,
                "equip": "",
                "special": "每回合增加2点攻击2点护甲"
            },
            {
                "name": "兽人战士",
                "health": 150,
                "attack": 25,
                "defense": 5,
                "anger": 5,
                "attribute": 0,
                "dodge": 0,
                "equip": "",
                "special": ""
            },
            {
                "name": "兽人枪兵",
                "health": 120,
                "attack": 25,
                "defense": 5,
                "anger": 5,
                "attribute": 0,
                "dodge": 0,
                "equip": "",
                "special": ""
            },
            {
                "name": "兽人狂战士",
                "health": 125,
                "attack": 30,
                "defense": 5,
                "anger": 5,
                "attribute": 0,
                "dodge": 0,
                "equip": "",
                "special": ""
            },
            {
                "name": "虎剑士",
                "health": 100,
                "attack": 15,
                "defense": 0,
                "anger": 15,
                "attribute": 0,
                "dodge": 0,
                "equip": "陨铁剑",
                "special": ""
            },
            {
                "name": "软泥刺怪",
                "health": 100,
                "attack": 25,
                "defense": 5,
                "anger": 10,
                "attribute": 0,
                "dodge": 0,
                "equip": "狂怒者刺盾",
                "special": ""
            },
            {
                "name": "双头狼",
                "health": 135,
                "attack": 18,
                "defense": 5,
                "anger": 8,
                "attribute": 0,
                "dodge": 0,
                "equip": "雌雄双剑",
                "special": ""
            },
            {
                "name": "铁甲虫",
                "health": 135,
                "attack": 20,
                "defense": 10,
                "anger": 0,
                "attribute": 0,
                "dodge": 0,
                "equip": "",
                "special": ""
            },
            {
                "name": "食人鲨",
                "health": 135,
                "attack": 21,
                "defense": 3,
                "anger": 9,
                "attribute": 0,
                "dodge": 0,
                "equip": "",
                "special": "受到攻击增加3点愤怒之力"
            },
            {
                "name": "红龙",
                "health": 300,
                "attack": 35,
                "defense": 5,
                "anger": 0,
                "attribute": 15,
                "dodge": 0,
                "equip": "",
                "special": ""
            },
            {
                "name": "屠夫弟弟",
                "health": 200,
                "attack": 30,
                "defense": 5,
                "anger": 10,
                "attribute": 5,
                "dodge": 0,
                "equip": "",
                "special": "攻击生物回血"
            },
            {
                "name": "丛林熊王",
                "health": 300,
                "attack": 35,
                "defense": 10,
                "anger": 0,
                "attribute": 0,
                "dodge": 0,
                "equip": "",
                "special": ""
            },
            {
                "name": "猛犸象",
                "health": 250,
                "attack": 35,
                "defense": 5,
                "anger": 5,
                "attribute": 0,
                "dodge": 0,
                "equip": "巨刃剑",
                "special": ""
            },
            {
                "name": "熔岩之王",
                "health": 225,
                "attack": 35,
                "defense": 5,
                "anger": 10,
                "attribute": 15,
                "dodge": 0,
                "equip": "",
                "special": "每2回合召唤一只地狱火"
            },
            {
                "name": "恶魔猫之王",
                "health": 250,
                "attack": 22,
                "defense": 5,
                "anger": 8,
                "attribute": 12,
                "dodge": 0,
                "equip": "雌雄双剑",
                "special": ""
            },
            {
                "name": "深海神龙",
                "health": 150,
                "attack": 35,
                "defense": 5,
                "anger": 10,
                "attribute": 25,
                "dodge": 0,
                "equip": "蓝宝石铠甲",
                "special": "每2回合随机召唤2强度或者6强度"
            },
            {
                "name": "屠夫哥哥",
                "health": 200,
                "attack": 35,
                "defense": 5,
                "anger": 10,
                "attribute": 0,
                "dodge": 0,
                "equip": "",
                "special": "每2回合召唤屠夫的晚餐"
            },
            {
                "name": "骨龙法师",
                "health": 150,
                "attack": 30,
                "defense": 5,
                "anger": 5,
                "attribute": 10,
                "dodge": 0,
                "equip": "",
                "special": "每2回合召唤墓碑"
            },
            {
                "name": "恶魔猫",
                "health": 175,
                "attack": 30,
                "defense": 5,
                "anger": 10,
                "attribute": 0,
                "dodge": 0,
                "equip": "巨刃剑",
                "special": ""
            },
            {
                "name": "猛犸之王",
                "health": 250,
                "attack": 45,
                "defense": 5,
                "anger": 10,
                "attribute": 0,
                "dodge": 0,
                "equip": "巨刃剑",
                "special": ""
            },
            {
                "name": "千年花王",
                "health": 150,
                "attack": 30,
                "defense": 5,
                "anger": 5,
                "attribute": 5,
                "dodge": 0,
                "equip": "",
                "special": "每2回合召唤6强度一下的植物附带每回合千年花毒一回合6点蛇蝎之力"
            },
            {
                "name": "南瓜王",
                "health": 175,
                "attack": 25,
                "defense": 5,
                "anger": 5,
                "attribute": 15,
                "dodge": 0,
                "equip": "剧毒戒指",
                "special": "每2回合召唤南瓜怪"
            }
        ]
    };
})();
