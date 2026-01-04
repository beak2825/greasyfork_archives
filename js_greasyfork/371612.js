// ==UserScript==
// @name         荒野求生MOD
// @namespace    https://greasyfork.org/zh-CN/users/208194-lz0211
// @version      3.28
// @description  荒野求生H5游戏作弊脚本
// @author       Liezhang
// @match        *://*.dayukeji.com/publish_hyrj/*
// @match        *://hyqsserver*.dayukeji.com*
// @match        *://sxiao.4399.com/*4399id=190326*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371612/%E8%8D%92%E9%87%8E%E6%B1%82%E7%94%9FMOD.user.js
// @updateURL https://update.greasyfork.org/scripts/371612/%E8%8D%92%E9%87%8E%E6%B1%82%E7%94%9FMOD.meta.js
// ==/UserScript==

(function () {
  function each(object, func) {
    for (var k in object) {
      func.call(object, k, object[k], object);
    }
  }
  function hash(keys, value) {
    var hash = {};
    keys.forEach(function (key) {
      hash[key] = value;
    });
    return hash;
  }
  function copy(from, to) {
    for (var k in from) {
      if (!(k in to)) {
        to[k] = from[k];
      }
    }
    return to;
  }
  function sample(array, count) {
    var pool = array.concat();
    var arr = [];
    for (var i = 0; i < count; i++) {
      var idx = Math.floor(Math.random() * pool.length);
      arr.push(array[idx]);
      pool.splice(idx);
    }
    return arr;
  }
  //Math.random = function(){return 0.99999};
  function mod() {
    console.log("======开始加载MOD脚本=====");
    with (profile_config) {
      //10倍活动奖励贝壳
      /*console.log("100倍活动奖励贝壳");
      each(activities_profile, function (k, item) {
        if (!Array.isArray(item.ACTION)) return;
        item.ACTION.forEach(function (action) {
          if (!action.COIN) return;
          action.COIN = action.COIN + "tt";
        });
      });*/
      //种植生产时间减半
      console.log("种植生产时间减半");
      each(buff_profile, function (x, item) {
        item.H_TIME && (item.H_TIME = item.H_TIME / 5);
      });
      //建筑耐久
      console.log("建筑耐久加倍");
      each(build_profile, function (x, items) {
        each(items, function (k, item) {
          if (typeof item.DURATION === "number") {
            item.DURATION = 2 * item.DURATION;
          }
        });
      });
      //100%掉率
      console.log("最大数目");
      each(drop_profile, function (x, items) {
        each(items, function (k, item) {
          item.MIN = item.MAX;
          if(item.RATIO && item.RATIO < 50){
              item.RATIO += 25;
          }
        });
      });
      //宝藏掉率
      console.log("调整掉率");
      each(treasure, function (x, items) {
        each(items, function (k, item) {
          item.WEIGHT = 50;
        });
      });
      //陷阱概率100%
      console.log("陷阱100%概率");
      each(trap_profile, function (x, item) {
        item.RATIO = 100;
      });
      //标准答案
      console.log("参考答案");
      each(activities_answer_profile,function(x,item){
        item.DESC.cn += '参考答案：' + item.CHOOSE[item.ANSWER-1].DESC.cn;
      });
      //添加神秘地点
      console.log("添加神秘地点");
      each(pot_profile, function (x, item) {
        if (x < 26) return;
        if (
          !item.R_STAGE ||
          !item.R_STAGE.length ||
          !item.M_STAGE ||
          !item.R_STAGE.length
        ) return;
        var area = {
          ID: x,
          NAME: { cn: "隐秘的" + item.NAME.cn },
          DESC: item.DESC,
          R_STAGE: sample(item.R_STAGE, 1),
          M_STAGE: sample(item.M_STAGE, 2),
        };
        secret_profile[area.ID] = area;
      });
      //100%发现神秘地点
      console.log("100%发现神秘地点");
      each(pot_profile, function (x, item) {
        (item.M_STAGE || item.R_STAGE) && !item.SECRET &&
          (item.SECRET = {
            IDS: Object.keys(secret_profile),
            RATE: 100,
            LIMIT: 1,
          });
        item.SECRE && (item.SECRET.RATE = 100);
      });
      each(c_pot_profile, function (x, item) {
        (item.M_STAGE || item.R_STAGE) && !item.SECRE &&
          (item.SECRET = {
            IDS: Object.keys(secret_profile),
            RATE: 100,
            LIMIT: 1,
          });
        item.SECRE && (item.SECRET.RATE = 100);
      });
      //types
      var items = [
          {type:'food',weight:5,desc:'食物',cond:{1009: { 7006: { MIN: 0, MAX: 90 } }}},
          {type:'food',weight:5,desc:'食物',cond:{1009: { 7006: { MIN: 0, MAX: 80 } }}},
          {type:'food',weight:5,desc:'食物',cond:{1009: { 7006: { MIN: 0, MAX: 70 } }}},
          {type:'food',weight:5,desc:'食物',cond:{1009: { 7006: { MIN: 0, MAX: 60 } }}},
          {type:'food',weight:5,desc:'食物',cond:{1009: { 7006: { MIN: 0, MAX: 50 } }}},
          {type:'food',weight:5,desc:'食物',cond:{1009: { 7006: { MIN: 0, MAX: 40 } }}},
          {type:'food',weight:5,desc:'食物',cond:{1009: { 7006: { MIN: 0, MAX: 30 } }}},
          {type:'food',weight:5,desc:'食物',cond:{1009: { 7006: { MIN: 0, MAX: 20 } }}},
          {type:'food',weight:5,desc:'食物',cond:{1009: { 7006: { MIN: 0, MAX: 10 } }}},

          {type:'drug',weight:2,desc:'药物',cond:{1009: { 7003: { MIN: 0, MAX: 300 } }}},
          {type:'drug',weight:2,desc:'药物',cond:{1009: { 7003: { MIN: 0, MAX: 200 } }}},
          {type:'drug',weight:2,desc:'药物',cond:{1009: { 7003: { MIN: 0, MAX: 100 } }}},
          {type:'drug',weight:2,desc:'药物',cond:{1009: { 7000: { MIN: 0, MAX: 85 } }}},
          {type:'drug',weight:2,desc:'药物',cond:{1009: { 7000: { MIN: 0, MAX: 55 } }}},
          {type:'drug',weight:2,desc:'药物',cond:{1009: { 7004: { MIN: 0, MAX: 85 } }}},
          {type:'drug',weight:2,desc:'药物',cond:{1009: { 7004: { MIN: 0, MAX: 55 } }}},
          {type:'drug',weight:2,desc:'药物',cond:{1009: { 7005: { MIN: 0, MAX: 85 } }}},
          {type:'drug',weight:2,desc:'药物',cond:{1009: { 7005: { MIN: 0, MAX: 55 } }}},

          {type:'tool',weight:2,desc:'装备',cond:{1002: 5}},
          {type:'tool',weight:2,desc:'装备',cond:{1002: 15}},
          {type:'tool',weight:2,desc:'装备',cond:{1002: 25}},
          {type:'tool',weight:2,desc:'装备',cond:{1002: 35}},
          {type:'tool',weight:2,desc:'装备',cond:{1002: 45}},
          {type:'tool',weight:2,desc:'装备',cond:{1002: 55}},
          {type:'tool',weight:2,desc:'装备',cond:{1002: 65}},
          {type:'tool',weight:2,desc:'装备',cond:{1002: 75}},
          {type:'tool',weight:2,desc:'装备',cond:{1002: 85}},
          {type:'tool',weight:2,desc:'装备',cond:{1002: 95}},

          {type:'prop',weight:5,desc:'材料',cond:{1006: { MIN: -100, MAX: 30 }}},
          {type:'prop',weight:5,desc:'材料',cond:{1006: { MIN: -100, MAX: 25 }}},
          {type:'prop',weight:5,desc:'材料',cond:{1006: { MIN: -100, MAX: 20 }}},
          {type:'prop',weight:5,desc:'材料',cond:{1006: { MIN: -100, MAX: 15 }}},
          {type:'prop',weight:5,desc:'材料',cond:{1006: { MIN: -100, MAX: 10 }}},
          {type:'prop',weight:5,desc:'材料',cond:{1006: { MIN: -100, MAX: 5 }}},
          {type:'prop',weight:5,desc:'材料',cond:{1006: { MIN: -100, MAX: 0 }}},
          {type:'prop',weight:5,desc:'材料',cond:{1006: { MIN: -100, MAX: -5 }}},
          {type:'prop',weight:5,desc:'材料',cond:{1006: { MIN: -100, MAX: -10 }}},
          {type:'prop',weight:5,desc:'材料',cond:{1006: { MIN: -100, MAX: -15 }}},
          {type:'prop',weight:5,desc:'材料',cond:{1006: { MIN: -100, MAX: -20 }}},

          {type:'spe',weight:1,desc:'特殊',max:0,cond:{1027: { 4: "4114" },1040: 1,}},
      ];
      let groups = {
        food : {src:{},max:10},
        prop : {src:{},max:16},
        drug : {src:{},max:3},
        tool : {src:{},max:1},
        spe  : {src:{},max:0}
      };
      each(item_profile,function (k, item) {
        if(!item.COIN_VALUE || !groups[item.TYPE] || item.ISFISH || item.ISGIFT || item.ISPACKAGE || item.COIN_VALUE == 9999) return;
        if(['4194','4195','4196','4197','4198','4199','4403','4404','4405','4119','4120'].indexOf(String(k))>=0) return;
        if(item.SOURCE && item.SOURCE.cn == '未知') return;
        if(item.SOURCE && item.SOURCE.cn.match('活动')) return;
        groups[item.TYPE].src[item.ID] = {
          MIN: 1,
          MAX: ~~(2 / (4 * item.WEIGHT + 1 * item.VALUE) * groups[item.TYPE].max)+1,
          RATIO: ~~(100 / Math.sqrt(item.COIN_VALUE+200))+1
        }
        //console.log(item.NAME.cn,items[item.TYPE].src[item.ID].MAX)
      });
      //钓鱼集齐7龙珠
      items.push({src:{4061:{MIN:1,MAX:1,RATIO:1}},weight:1,desc:'神秘',cond:{1019:{4061:0},1002: 5}});
      items.push({src:{4062:{MIN:1,MAX:1,RATIO:1}},weight:1,desc:'神秘',cond:{1019:{4062:0},1002: 10}});
      items.push({src:{4063:{MIN:1,MAX:1,RATIO:1}},weight:1,desc:'神秘',cond:{1019:{4063:0},1002: 15}});
      items.push({src:{4064:{MIN:1,MAX:1,RATIO:1}},weight:1,desc:'神秘',cond:{1019:{4064:0},1002: 20}});
      items.push({src:{4065:{MIN:1,MAX:1,RATIO:1}},weight:1,desc:'神秘',cond:{1019:{4065:0},1002: 25}});
      items.push({src:{4066:{MIN:1,MAX:1,RATIO:1}},weight:1,desc:'神秘',cond:{1019:{4066:0},1002: 30}});
      items.push({src:{4067:{MIN:1,MAX:1,RATIO:1}},weight:1,desc:'神秘',cond:{1019:{4067:0},1002: 35}});
      //钓鱼宝箱
      console.log("钓鱼出宝箱");
      each(fish_profile,function(k,v){
        v.WEIGHT = 1//~~(v.WEIGHT / 2);
      });
      fish_profile[0].WEIGHT = 0;
      fish_profile[36].WEIGHT = 10;
      each(items,function (k, item) {
        item.id = +k+37;
        item.src = item.src || groups[item.type].src
        //概率归一化
        var RATIOs = 0
        each(item.src,function(k,v){
            RATIOs += v.RATIO
        });
        each(item.src,function(k,v){
            v.RATIO = ~~(v.RATIO / RATIOs * 400) + 1
        });
        drop_profile['70' + item.id] = item.src;
        fish_box_profile['50' + item.id] = copy(fish_box_profile[5036], {
          ID: '50' + item.id,
          DROP_ID: '70' + item.id,
          NAME: { cn: item.desc + '补给箱' },
          DESC: { cn: '你感觉鱼钩好像钩住什么重物，费了不小的劲儿拉出一个' + item.desc + '补给箱' }
        });
        fish_profile[item.id] = {
          WEIGHT: item.weight,
          NAME: { cn: item.desc + '补给箱'},
          EVENT: '50' + item.id,
          TYPE: "box",
          COND: item.cond
        };
      });
      //物品减重+5倍伤害
      console.log("物品减重+5倍伤害");
      each(item_profile, function (k, item) {
        if ("WEIGHT" in item) {
          item.WEIGHT = "" + Math.ceil(item.WEIGHT / 2);
        }
        if ("DURATION" in item){
          item.DURATION = "" + item.DURATION * 2;
        }
        if ("E_ATTRS" in item) {
          item.E_ATTRS.ATK && (item.E_ATTRS.ATK *= 10);
          item.E_ATTRS.DIS && (item.E_ATTRS.ATK *= 2);
          item.E_ATTRS.SPD && (item.E_ATTRS.SPD *= 2);
          item.E_ATTRS.HIT && (item.E_ATTRS.HIT += 100);
          item.E_ATTRS.RECYCLE && (item.E_ATTRS.RECYCLE += 30);
          item.E_ATTRS.SUBATK && (item.E_ATTRS.SUBATK += 30);
        }
      });
      //人物属性调整
      console.log("人物属性调整");
      /*
                7000 精神
                7001 失眠
                7002 生命上限
                7003 当前生命
                7004 受伤
                7005 感染
                7006 饥饿
                7007 速度
                7012 防御
                7013 徒手攻击
                7014 移动速度
                7016 近战攻击
                7017 远程攻击
                7018 闪避
                7019 攻击速度
                7032 未知
                7040 负重
                7041 有船
                7042 有骆驼
                7044 精神上限
                7045 失眠上限
                7046 受伤上限
                7047 感染上限
                7048 饥饿上限
                7051 万人迷
                7054 有鞋子
                7055 有背包
            */
      //罗兰
      console.log("调整罗兰人物属性");
      with (role_profile[1000]) {
        BASE[7007] = 10;//速度
        BASE[7014] = 10;//移动速度
        BASE[7054] = 0;//取消鞋子效果
        BASE[7055] = 1;//有背包
        BASE[7048] = 120;
        BASE[7040] = 120;
        BASE[7055] = 1;
      }
      //朱莉
      console.log("调整朱莉人物属性");
      with (role_profile[1001]) {
        BASE[7007] = 12;//速度
        BASE[7014] = 12;//移动速度
        BASE[7054] = 0;//取消鞋子效果
        BASE[7017] = 120;
        BASE[7019] = 10;
        BASE[7018] = 25;
        BASE[7040] = 160;
        BASE[7048] = 160;
        BASE[7055] = 1;
      }
      //老贝
      console.log("调整老贝人物属性");
      with (role_profile[1002]) {
        BASE[7007] = 10;//速度
        BASE[7014] = 10;//移动速度
        BASE[7054] = 0;//取消鞋子效果
        BASE[7055] = 1;//有背包
        BASE[7013] = 35;
        BASE[7018] = 30;
        BASE[7040] = 80;
        BASE[7047] = 170;
      }
      //小哥
      console.log("调整小哥人物属性");
      with (role_profile[1003]) {
        BASE[7007] = 10;//速度
        BASE[7014] = 10;//移动速度
        BASE[7054] = 0;//取消鞋子效果
        BASE[7055] = 1;//有背包
        BASE[7000] = 120;
        BASE[7044] = 120;
        BASE[7045] = 120;
        BASE[7040] = 130;
      }
      //基德
      console.log("调整基德人物属性");
      with (role_profile[1003]) {
        BASE[7007] = 10;//速度
        BASE[7014] = 10;//移动速度
        BASE[7054] = 0;//取消鞋子效果
        BASE[7055] = 0;
        BASE[7016] = 120;
        BASE[7046] = 120;
        BASE[7047] = 110;
        BASE[7040] = 180;
      }
      //探索点资源上限翻倍
      console.log("探索点资源上限翻倍，增长速度翻倍");
      each(pot_profile, function (k, item) {
        if (!item.STAGE) return;
        each(item.STAGE, function (k, v, o) {
          if (v.CIRCLE && v.MAX_CNT > 1 && v.WAY.cn != "狩猎") {
            v.RAW_CNT = v.MAX_CNT;
            (item.ID != 1006) && (v.MAX_CNT *= 2);
            v.CIRCLE *= 2;
          }
        });
      });
      each(c_pot_profile, function (k, item) {
        if (!item.STAGE) return;
        each(item.STAGE, function (k, v, o) {
          if (v.CIRCLE && v.MAX_CNT > 1 && v.WAY.cn != "狩猎") {
            v.RAW_CNT = v.MAX_CNT;
            v.MAX_CNT = 2 * v.MAX_CNT;
            v.CIRCLE = 2 * v.CIRCLE;
          }
        });
      });
      //荒野大礼包
      console.log("荒野大礼包");
      var gift = {
        ID: "208",
        INCLUDE: [
          "1",//老贝
          "2",//朱莉
          "3",//小哥
          "4",//基德
          "10",//天赋：神射手
          "11",//天赋：大家伙
          "12",//天赋：清扫者
          "13",//天赋：万人迷
          "14",//天赋：长臂猿
          "15",//天赋：空手道
          "16",//天赋：逆境者
          "17",//天赋：养护者
          "18",//天赋：银刚狼
          "19",//天赋：药剂师
          "20",//天赋：北境者
          //"21",//背包
          //"22",//靴子
          "23",//天赋：石皮者
          "24",//天赋：修仙者
          "25",//天赋：小吃货
          "26",//天赋：环境家
          "27",//天赋：陷猎者
          "28",//天赋：夜语者
          "29",//天赋：建筑师
          "30",//天赋：占星师
          "31",//天赋：洞察者
          "32",//天赋：速泳者
          "33",//天赋：谈判家
          "34",//图纸：改良平底锅
          "35",//图纸：某人的新衣
          "36",//图纸：奇特香料
          "37",//图纸：研磨器
          "38",//图纸：伪袖珍手枪
          "39",//图纸：小哥肉酱
          "40",//图纸：扑克
          "41",//图纸：石锤
          "42",//图纸：暖身丸
          "43",//图纸：强身丸
          "44",//图纸：军粮丸
          "45",//图纸：驯兽鞭
          "46",//图纸：吹箭
          "47",//图纸：机关剑
          "48",//图纸：机关连弩
          "49",//图纸：麻痹针
          "50",//图纸：女巫扫把
          "52",//天赋：好战者
          "53",//图纸：羽毛裙
          "54",//配方：姜饼人
          "55",//种植法：可可豆
          "56",//配方：巧克力
          "57",//配方：防护服
          "100",
          "101",
          "102",
          "103",
          "104",
          "105",
          "106",
          "107",
          "334",//节日狂欢限定礼包，进阶角色
        ],
        NAME: {
          cn: "荒野大礼包",
        },
        ITEMS: {
          100000: 100,//书页
          100002:80,//求生精选
          100003: 160,//天赋原石
          100004: 25,//天赋结晶
        },
        ICON: "Texture/Item/limit208",
        ICON_SCALE: 1.2,
        DISC_DESC: "福利",
        PRICE_FAKE: {
          cn: "3280",
        },
        PRICE: "satt",
        COIN_PRICE: "satt",
        DESC: {
          cn:
            "立即解锁所有角色、天赋和图纸。\n获得后永久有效。",
        },
        IS_LOCKED: false,
        IS_PURCHASED: false,
        RECOMMEND: "1",
        SHOPNAME: {
          cn: "荒野大礼包",
        },
        SHOPDESC: {
          cn: "解锁所有角色、天赋、图纸。",
        },
      };
      each(shop_profile.FOR_LIMIT, function (k, item, o) {
        if (item.ID == 208) {
          o[k] = gift;
        }
      });
      if (shop_profile.SHOP_OUT.selList.indexOf(208) === -1) {
        shop_profile.SHOP_OUT.selList.unshift(208);
      }
      if (shop_profile.SHOP_IN.supList.indexOf(208) === -1) {
        shop_profile.SHOP_IN.supList.unshift(208);
      }
    }
    console.log("======MOD脚本加载完成======");
  }
  var timer = setInterval(function () {
    if (typeof profile_config !== "undefined") {
      mod();
      clearInterval(timer);
    }
  }, 500);
})();

/*
1 1 1
1 0 1
1 1 1
解法：24568

0 1 0
1 0 1
0 1 0
解法：123456789

0 0 0
0 1 0
0 0 0
解法：1234 6789

1 0 0
1 1 0
1 0 1
解法：125

0 1 1
0 1 1
1 0 0
解法：48

0 0 0
0 0 0
0 1 0
解法：279

0 1 0
1 1 0
0 1 1
解法：257

0 1 0
1 1 1
0 1 0
解法：1379

1 0 1
1 0 1
1 0 1
解法：1345679

1 1 1
0 0 0
1 1 1
解法：1235789

1 0 1
1 1 1
1 0 1
解法：123789

1 0 0
0 1 1
0 1 0
解法：379
*/

/*
红色-林中暗流，雾天，击杀100只动物，智斗元洛图胜利
橙色-荒漠，晴天，气温30度，海岸椰树16棵
黄色-海滩，每个季节的第14-16天（14，15，16，44，45，46...），回收箭失>=50，晚上
绿色-灌木丛
青色-竹林，24颗竹子，每个季节的第7-9天（7，8，9，37，38，39...）
蓝色-雪原，100颗草药，生命>=350，受伤>=100，感染>=100，饥饿>=100，没有熊
紫色-松木林，秋天，有宠物，骑骆驼
*/
