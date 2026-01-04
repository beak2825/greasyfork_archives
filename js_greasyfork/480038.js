// ==UserScript==
// @name         Idle Infinity - All in One
// @description  Idle Infinity
// @author       小黄不会擦屁股
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_cookie
// @match        https://www.idleinfinity.cn/*
// @namespace https://greasyfork.org/users/1202891
// @version 0.0.1.20231117173910
// @downloadURL https://update.greasyfork.org/scripts/480038/Idle%20Infinity%20-%20All%20in%20One.user.js
// @updateURL https://update.greasyfork.org/scripts/480038/Idle%20Infinity%20-%20All%20in%20One.meta.js
// ==/UserScript==

setTimeout(() => {

    Characters();   //快速切换人物
    Titles();       //修改网页标题
    Auction();      //显示拍卖行价格
    NavBar();       //优化导航栏
    MapSwitch();    //常用挂机层数切换
    //以下内容包含自动化程序，默认关闭，请慎重使用
    Dungeon();    //自动秘境
    Equipments(); //自动扫描装备（与小尾巴冲突）
    Accounts();   //快速切换账号（请下载tampermonkey beta版，普通版不支持此功能）
    OnlineUsers();//自动刷新在线玩家页面
    AutoBattle(); //自动抢挂机位置
}, 0);

// ==Public==

function getRandomInt(min, max) {
    min = Math.ceil(min);  // 向上取整，确保不会小于最小值
    max = Math.floor(max); // 向下取整，确保不会大于最大值
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getStore(key, defualt) {
    return Object.assign({}, defualt, {
        load() {
            const saved = JSON.parse(localStorage.getItem(key) || "{}")
            for (const [key, val] of Object.entries(saved)) {
                this[key] = val
            }
        },
        save() {
            localStorage.setItem(key, JSON.stringify(this))
        },
    })
}

function createElementByHTML(html) {
    const template = document.createElement('template')
    template.innerHTML = html.trim()
    return template.content.firstChild
}

// ==Equipment==

function Equipments(){
    if(location.pathname=="/Equipment/Query"){
        initFromStore();
        var elements = $(".panel-body.equip-bag .equip-name, .panel-body.equip-box .equip-name").filter(function() {return !$(this).next("span.tips").length;});
        console.log(elements.length);
        var index = 0;
        processNextElement(index,elements);
    }
}

function processNextElement(index,elements) {
    if (index < elements.length) {
        var nameDiv = $(elements[index]);
        var contentDiv = nameDiv.parent().next();
        var eid = nameDiv.data("id");
        contentDiv = $(".equip-content-container > [data-id='" + eid + "']");
        var s = contentDiv.data("s");
        s = s ? s : 0;
        var f = contentDiv.data("f");
        f = f ? f : 0;
        var m = contentDiv.data("m");
        m = m ? m : 0;
        var cid = $("#cid").val();
        $.get("/Equipment/EquipRender?cid=" + cid + "&eid=" + eid + "&s=" + s + "&f=" + f + "&m=" + m, function (data) {
            contentDiv.empty().append(data);
        }, "html");
        console.log(nameDiv.text());
        index++;
        setTimeout(function() {processNextElement(index,elements)}, getRandomInt(1000, 2000));
    }
}

const equipStore = getStore(`dd_ui_equip`, { ancient: {} })

const configStore = getStore(`dd_ui_config`, { tips: {} })

const allSkills = ["牺牲", "白热", "复仇", "裁决", "圣光闪现", "圣光道标", "奉献", "忏悔", "祝福之锤", "力量光环", "专注光环", "狂热光环", "反抗光环", "荆棘光环", "审判光环", "祈祷光环", "拯救光环", "冥想光环", "火球", "烈焰风暴", "陨石", "静态力场", "连锁闪电", "雷云风暴", "冰弹", "霜之新星", "冰封球", "暖气", "强化", "支配火焰", "激活", "法力护盾", "支配闪电", "冰封装甲", "时间延缓", "支配冰冷", "顺劈斩", "狂乱", "旋风斩", "猛击", "蓄力攻击", "处决", "战斗怒吼", "浴血", "武器大师", "撕裂", "眩晕攻击", "雷霆一击", "嘲讽", "钢铁之躯", "命令怒吼", "自然抵抗", "重整旗鼓", "生存本能", "震荡射击", "穿刺箭", "箭雨", "毒蛇钉刺", "爆裂箭", "急冻箭", "多重箭", "闪电攻击", "闪电之怒", "内视", "强击光环", "致命攻击", "草本治疗", "诱捕", "刺穿", "专心", "回避", "女武神", "惩击", "神圣之火", "苦修", "恢复", "治疗之环", "救赎光环", "神圣护盾", "驱散", "痛苦压制", "暗影箭", "暗影之触", "暗影尖刺", "暗影魔", "灵魂吸取", "精神灼烧", "虚弱诅咒", "腐蚀光环", "暗影行者", "背刺", "刀扇", "魔影斗篷", "影舞", "出血", "绞杀", "切割", "伺机待发", "武学艺术", "淬毒匕首", "毒牙", "毒雾", "毒伤", "能量消解", "毒素蒸馏", "麻痹网", "闪光粉", "法术反噬", "风歌", "风切", "风怒", "狂野扑击", "风暴打击", "先祖之力", "幽魂步", "噬血", "复生", "灼热图腾", "地震术", "地心守卫", "闪电箭", "怒雷", "元素之怒", "闪电护盾", "治疗链", "大地之力", "牙", "骨矛", "白骨之魂", "生命分流", "衰老", "白骨装甲", "骨牢", "骨刺收割", "死亡主宰", "骷髅复生", "骷髅法师", "粘土石魔", "重生", "致伤诅咒", "支配骷髅", "献祭", "坟墓呼唤", "生生不息", "狼人变化", "狂犬病", "狂怒", "饥饿", "焰爪", "野性狂暴", "熊人变化", "撞槌", "大地震击", "洞察光环", "火山爆发", "自然之力", "小旋风", "狂风鞭笞", "龙卷风", "飓风装甲", "橡木智者", "狼獾之心", "猛虎击", "灵蛇击", "凤凰击", "烈焰拳", "雷电爪", "寒冰刃", "龙爪", "神龙摆尾", "飞龙在天", "惩戒真言", "治愈真言", "定罪真言", "暗言术•痛", "暗言术•破", "暗言术•灭", "真言术•慰", "真言术•障", "真言术•耀", "刃之守卫", "刀刃护盾", "爆炸陷阱", "火焰爆震", "狱火守卫", "稳固陷阱", "电能守卫", "雷电守卫", "亡者守卫", "猎人标记", "瞄准射击", "炮轰", "支配野兽", "灵魂链接", "召唤乌鸦", "狩猎呼唤", "森林狼", "召唤灰熊", "暗影爆发", "剥皮者", "伤害加深", "攻击反噬", "致死", "暴风雪", "降低抵抗", "圣光弹", "死亡射线", "微暗灵视", "法力燃烧", "闪电新星", "剧毒新星", "棱光射线", "残废", "升腾", "空间压缩", "分裂之眼", "灼热射线", "冻结射线", "剧毒射线", "激光射线", "平静", "定罪", "圣光普照", "虚化领域", "黑洞", "剧毒之种", "燃烧之种", "法力真空", "黑暗之种", "禁魔领域", "灵魂印记", "灵魂之刺", "灵魂剥离", "火焰之种", "律令.死亡", "虚化", "天罚", "冰风暴", "火风暴", "晶化之壳", "熔岩爆裂", "瘟疫诅咒", "地狱之牛", "火焰新星", "尸体爆炸", "骷髅射手", "啃咬", "感染", "毒刺", "烈焰长矛", "裂地斩", "致命绞杀", "冰霜之刺", "魔法箭", "多重施法", "狂战士", "庇护光环", "冰冻光环", "圣火光环", "冲击光环", "生命光环", "野性光环", "传送", "神恩", "愤怒光环", "唤醒光环", "恐惧光环", "狂暴之心", "灼烧光环", "束缚光环", "辉煌光环", "消散", "净化光环", "冰冷转换", "火焰转换", "闪电转换", "毒素转换", "魔法转换", "物理转换", "抗火光环"]

const shortSkills = {
    "光环": "",
    "暗影之触": "触",
    "致命攻击": "致命",
    "暗影尖刺": "尖刺",
    "精神灼烧": "灼烧",
    "灵魂吸取": "灵吸",
    "治愈真言": "治愈",
    "治愈真言": "治愈",
    "定罪真言": "定罪",
    "惩戒真言": "惩戒",
    "烈焰风暴": "烈焰",
    "法力护盾": "法盾",
    "白骨之魂": "骨魂",
    "骷髅复生": "骷复",
    "骷髅法师": "骷法",
    "骨刺收割": "骨刺"
};

const tipRules = [
    { name: "几率施放", regexp: /^(.).+时有(\d+)%几率施放Lv(\d+)(.+)/, format: (a, b, c, d) => `${a}${b}%${d}${c}`, style: "skill", default: false },
    { name: "职业技能", regexp: /^\+(\d+) .{0,2}(.{2})技能/, format: (a, b) => `${a}${b}`, style: "skill", default: true },
    { name: "职业技能（基底）", regexp: /^\+(\d+) .{0,0}(.*)（/, format: (a, b) => `${a}${b}`, style: "skill", default: true },
    { name: "获得技能", regexp: new RegExp(`^\\+(\\d+) (${allSkills.join('|')})$`), format: (a, b) => `${a}${b}`, style: "skill", default: true },
    { name: "赋予技能", regexp: /^赋予Lv(\d+)(.+)/, format: (a, b) => `${a}${b}`, style: "magic", default: true },
    { name: "召唤数量", regexp: /^\+(\d+) (.{1,6})最大召唤数量/, format: (a, b) => `${a}${b}`, style: "magic", default: true },
    { name: "增强伤害", regexp: /^\+(\d+)\% 增强伤害$/, format: a => `${a}ed`, style: "physical", default: true },
    { name: "攻击速度", regexp: /^攻击速度提升 (\d+)\%/, format: a => `${a}ias`, style: "physical", default: true },
    { name: "施法速度", regexp: /^施法速度提升 (\d+)\%/, format: a => `${a}fcr`, style: "magic", default: true },
    { name: "魔法装备", regexp: /^\+(\d+)\% 更佳的机会取得魔法装备/, format: a => `${a}mf`, style: "state", default: true },
    { name: "额外金币", regexp: /^\+(\d+)\% 额外金币从怪物身上取得/, format: a => `${a}gf`, style: "lightning", default: true },
    { name: "元素抗性", regexp: /^元素抗性 \+(\d+)\%/, format: a => `${a}res`, style: "skill", default: true },
    { name: "抗火", regexp: /^抗火 \+(\d+)/, format: a => `${a}f`, style: "fire", default: true },
    { name: "抗寒", regexp: /^抗寒 \+(\d+)/, format: a => `${a}c`, style: "cold", default: true },
    { name: "抗闪电", regexp: /^抗闪电 \+(\d+)/, format: a => `${a}l`, style: "lightning", default: true },
    { name: "抗毒", regexp: /^抗毒 \+(\d+)/, format: a => `${a}p`, style: "poison", default: true },
    { name: "凹槽", regexp: /^凹槽(\(0\/\d+\))/, format: a => `${a}`, style: "", default: true },
    { name: "无法装备", regexp: /（无法装备）$/, format: () => `❌`, style: "", default: false },
    { name: "双手武器", regexp: /^双手伤害：/, format: () => `2H`, style: "", default: false },
    { name: "掉落等级", regexp: /^掉落等级：(\d+)/, format: a => `dlv${a}`, style: "", default: false },
    { name: "需要等级", regexp: /^需要等级：(\d+)/, format: a => `rlv${a}`, style: "", default: false },
    { name: "平均伤害", regexp: /^平均伤害：\s(\d+(\.\d+)?$)/, format: a => `dps${a}`, style: "", default: false },
    { name: "已有太古", regexp: /^(无形)?(.+?)\(\d+\)$/, format: ancient, style: "", default: false, first: true },
]

function ancient(_, name) {
    if (equipStore.ancient[name]) {
        return `⭕️`
  }
    if (name.endsWith("★")) {
        name = name.substring(0, name.length - 1)
        if (equipStore.ancient[name] !== 1) {
            equipStore.ancient[name] = 1
            equipStore.save()
        }
    }
}

function parseContent(id, node) {
    if (node == null) {
        return
    }

    // 判断content是否有内容
    const lines = node.querySelectorAll('p')
    if (lines.length === 0) {
        return
    }
    // 提取content内容，拼接成一个字符串
    const content_lines = []
    for (const line of lines) {
        if (line.classList.contains('divider')) {
            break
        }
        content_lines.push(line.innerText.replace(/\s{2,}/g, ''))
    }
    const content = content_lines.join('|')

    equipStore[id] = content
    equipStore.save()
}

function addTips(id, equipNode) {
    if (equipStore[id] == null) {
        return
    }
    if (equipNode == null) {
        equipNode = document.querySelector(`.equip-name[data-id="${id}"]`)
    }
    if (equipNode.parentNode.querySelector(".tips") != null) {
        return
    }

    const container = document.createElement('span')
    container.classList.add("tips")
    function addChild(text, className) {
        const span = document.createElement('span')
        span.innerText = text
        if (className != null && className != "") {
            span.classList.add(className)
        }
        container.append(span)
    }

    // 通过regexp提取信息
    const contents = equipStore[id].split('|')
    .map(content => content.replace(/（\d+-\d+）/g, ''))
    for (const rule of tipRules) {
        const enabled = configStore.tips[rule.name] != null ? configStore.tips[rule.name] : rule.default
        if (!enabled) continue

        for (const content of contents) {
            const match = content.match(rule.regexp)
            if (match == null) continue
            const tip = rule.format(...match.slice(1))
            var newTip = tip;
            if (tip != null) {
                const regex = /^[1-9]光环$/;
                if (regex.test(tip)) {
                    newTip = newTip.replace("光环", "骑环");
                }
                if (tip.includes("•")) {
                    const index = newTip.indexOf("•");
                    newTip = newTip.substring(index + 1);
                }
                for (const key in shortSkills) {
                    if (tip.includes(key)) {
                        //console.log(key,shortSkills[key]);
                        newTip = newTip.replace(key, shortSkills[key]);
                        //console.log(newTip);
                    }
                }
            }
            if (newTip != null) {
                addChild(' ' + newTip, rule.style)
                //console.log(newTip);
            }else{
                addChild(' ' + tip, rule.style)
            }
        }
        if (rule.first) {
            break
        }
    }

    if (container.childElementCount === 0) {
        addChild(`-`)
    }

    equipNode.after(container)
}

function initFromStore(){
    equipStore.load()
    configStore.load()

    // 先从缓存中渲染
    for (const node of document.querySelectorAll(".equip-name[data-id]")) {
        const id = node.attributes['data-id'].value
        addTips(id, node)
    }
    // 解析已装备
    for (const contentNode of document.querySelectorAll(".panel .equip-content")) {
        if (contentNode.childElementCount === 0) {
            continue
        }
        const equipNode = contentNode.previousElementSibling.getElementsByClassName('equip-name')[0]
        const id = equipNode.attributes['data-id'].value
        parseContent(id, contentNode)
        addTips(id, equipNode)
    }
    // 解析背包中
    const equipObserver = new MutationObserver((mutationList, _) => {
        for (const mutation of mutationList) {
            if (mutation.type === 'childList') {
                const node = mutation.target
                const id = node.attributes['data-id'].value
                parseContent(id, node)
                addTips(id)
                return
            }
        }
    })
    for (const node of document.querySelectorAll(".equip-content-container .equip-content")) {
        equipObserver.observe(node, { childList: true })
    }

    // 增加CSS，鼠标移上去隐藏标记，避免内容过长换行
    GM_addStyle(`.equip-container > p:hover > .tips { display: none; }`)

    // 网页上增加配置标记的功能
    const configNode = createElementByHTML(`
    <div class="btn-group">
      <button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
        小尾巴
        <span class="caret"></span>
      </button>
      <ul class="dropdown-menu">
        ${tipRules.map(rule => `<li><a class="base">
          <input type="checkbox" name="${rule.name}" ${(configStore.tips[rule.name] != null ? configStore.tips[rule.name] : rule.default) ? "checked" : ""}>
          ${rule.name}
        </a></li>`).join('')}
      </ul>
    </div>
  `)
    document.querySelector(".panel-heading > .pull-right").prepend(configNode)
    for (const node of configNode.querySelectorAll("input")) {
        node.addEventListener('change', (event) => {
            const node = event.target
            //console.log(`on change ${node.name}`)
            configStore.tips[node.name] = node.checked
            configStore.save()
        })
    }
}

// ==Characters==

function Characters() {
    if($(".dropdown-menu.char-switch .base").length!=0){
        var characts = $(".dropdown-menu.char-switch .base");
        //$(".dropdown-menu.char-switch .base").closest("li.dropdown").hide();
        var charactContainers = '';
        for (var i = 0; i < characts.length; i++) {
            charactContainers += `<div class="col-xs-2 col-sm-2 col-md-2 skill-container">${characts[i].outerHTML}</div>`;
        }

        // 动态生成完整的 HTML 代码
        var configNode = createElementByHTML(`
    <div class="col-md-12">
        <div class="panel panel-inverse">
            <div class="panel-body charact-container">
                ${charactContainers}
            </div>
        </div>
    </div>
`);
        document.querySelector(".container > .row").prepend(configNode);

    }
}

// ==ShowTitle==

const store = {
    load() {
        const saved = JSON.parse(localStorage.getItem(`dd_ui_title`) || "{}")
        for (const [key, val] of Object.entries(saved)) {
            this[key] = val
        }
    },
    save() {
        localStorage.setItem(`dd_ui_title`, JSON.stringify(this))
    },
}

const rules = {
    "/Home/Index": ["主页"],
    "/Battle/Guaji": ["离线挂机"],
    "/Character/Detail": ["角色"],
    "/Skill/Config": ["技能"],
    "/Equipment/Query": ["装备"],
    "/Equipment/Material": ["材料/符文/宝石"],
    "/Battle/BattleField": ["战场"],
    "/Character/Group": ["团队"],
    "/Equipment/Artifact": ["神器清单"],
    "/Auction/Query": ["拍卖行"],

    "/Map/Detail": ["地图"],
    "/Map/Dungeon": ["秘境", () => {
        const san = document.querySelector(".panel-heading .state").textContent
        const explored = document.querySelector('.panel-body .explore').textContent
        const monster = document.querySelector('.panel-body .monster-left').textContent
        const boss = document.querySelector('.panel-body .boss-left').textContent
        return `${Math.floor(100 * explored / 400)}% ${monster}/${boss} ${san}san`
  }],
    "/Battle/InDungeon": ["战斗", () => {
        const timeNode = document.getElementById("time")
        if (timeNode != null) {
            return `in ${timeNode.textContent}s`
    }
        const dataNode = document.querySelector(".battle-data")
        if (dataNode != null) {
            return dataNode.classList.contains("visually-hidden") ? "..." : "done"
        }
    }],
    "/Home/OnlineUsers": ["在线玩家",() =>{
        if($(".panel-footer")!=null)
            return $(".panel-footer")[0].innerText.split("，")[0].split(" ")[1];
    }],
    "/Config/Query": ["物品过滤"],
    "/Character/RankingList": ["赛季排行"],
    "/Character/AllChar": ["角色等级排行"],
    "/Character/AllCharMCU": ["符文掉落排行"],

    "/Help/Content?url=Base": ["基础知识"],
    "/Help/Content?url=CharType": ["职业技能"],
    "/Help/Content?url=Monsters": ["怪物介绍"],
    "/Help/Content?url=Equip": ["物品装备"],
    "/Help/Content?url=BaseEquip": ["普通物品"],
    "/Help/Content?url=Prefix": ["前缀词缀"],
    "/Help/Content?url=Suffix": ["后缀词缀"],
    "/Help/Content?url=SpecialAffix": ["固定词缀"],
    "/Help/Content?url=Set": ["套装物品"],
    "/Help/Content?url=Sacred": ["圣衣套装"],
    "/Help/Content?url=Unique": ["传奇物品"],
    "/Help/Content?url=Artifact": ["神器物品"],

    "/Guide/Query": ["攻略列表"],
    "/Guide/Detail": ["攻略详情"],
}

function Titles(){
    const char = (() => {
        const matches = location.search.match(/\bid=(\d+)/i)
        if (matches == null) return
        const id = matches[1]

        store.load()
        if (store[id] == null) {
            const firstNavItem = document.querySelector("#navbar > ul > li")
            if (firstNavItem.classList.contains("dropdown")) {
                store[id] = firstNavItem.firstElementChild.text
                store.save()
            }
        }
        return store[id]
    })()

    const [title, getInfo] = (() => {
        for (const key of [location.pathname, `${location.pathname}${location.search}`]) {
            if (rules[key] != null) {
                return rules[key]
            }
        }
        return []
    })()

    function update() {
        document.title = [
            char != null ? `[${char}]` : null,
            title != null ? title : location.pathname,
            getInfo != null ? getInfo() : null,
        ].filter(x => x != null).join(' ')
    }
    if (getInfo != null) {
        setInterval(update, 1000)
    }
    update()
}

// ==Auction==

function Auction(){
    if(location.pathname=="/Auction/Query"){
        $(".panel .equip-name").each(function() {
            var eid = $(this).data("id");
            var contentDiv = $(".equip-content-container > [data-id='" + eid + "']");
            var equipSpan = contentDiv.find(".equip");
            var equipP = equipSpan.find(".equip-price");
            var equipS1 = equipP.children().html()
            $(this).append("<br>"+equipS1)
        })
    }
}

// ==Dungeon==

function Dungeon(){
    if(location.pathname=="/Map/Dungeon"){
        //console.log("页面加载完毕，开始脚本");
        addStopButton();
        //console.log("添加按钮");
        setTimeout(function() {processNextBlock();}, getRandomInt(1000, 2000));
        //console.log("开始脚本");
    }
}

setInterval(checkForVictory(), 5);

function processNextBlock() {
    var next;
    //寻址
    var public = $(".panel-body.dungeon-container.hidden-xsm .block").filter(function() {return $(this).hasClass("public");});
    public.each(function() {
        var id=parseInt($(this).attr("id"));
        var top=id-20;
        var left=id-1;
        var right=id+1;
        var bottom=id+20;
        if(!$(this).hasClass("top") && $("#"+top).hasClass("mask"))
        {
            //unfinished.push(id);
            next = $(this);
            //console.log("top"+id);
            return false;
        }else if(!$(this).hasClass("left") && $("#"+left).hasClass("mask") && (id%20!=0))
        {
            //unfinished.push(id);
            next = $(this);
            //console.log("left"+id);
            return false;
        }else if(!$("#"+right).hasClass("left") && $("#"+right).hasClass("mask") && (id%20!=19))
        {
            //unfinished.push(id);
            next = $(this);
            //console.log("right"+id);
            return false;
        }else if(!$("#"+bottom).hasClass("top") && $("#"+bottom).hasClass("mask"))
        {
            //unfinished.push(id);
            next = $(this);
            //console.log("buttom"+id);
            return false;
        }
    });
    //boss优先
    var boss = $(".panel-body.dungeon-container.hidden-xsm .block").filter(function() {return $(this).hasClass("boss");});
    if(boss.length==1)
    {
        next = boss;
    }
    //战斗
    if(isDungeon && !$(".physical.boss-left").text().includes("0" && next!=null)){
        next.trigger("mousedown");
    }else if($(".physical.boss-left").text().includes("0"))
    {
        console.log("秘境结束");
        isDungeon =false;
    }else if(!isDungeon){
        console.log("检测到停止");
    }else
    {
        location.reload();
    }
    setTimeout(function() {processNextBlock();}, getRandomInt(1000, 2000));
}

function checkForVictory() {
    if(location.pathname=="/Battle/InDungeon"){
        var queryString = window.location.search;
        var params = new URLSearchParams(queryString);
        var idValue = params.get("id");
        var firstChild = $(".panel.panel-inverse .panel-body .turn").first();
        var content = firstChild.find("div").first().text();

        if (content.includes("战斗胜利")||content.includes("战斗失败")||content.includes("同归于尽")) {
            console.log(content);
            window.location.href = "/Map/Dungeon?id="+idValue;
        }else
        {
            console.log("等待结果");
        }
    }
}

var isDungeon=true;

function addStopButton() {
    // 网页上增加配置标记的功能
    const configNode = createElementByHTML(`
            <a class="btn btn-xs btn-primary" href="#" role="button">小黄停工</a>
  `)
    document.querySelector(".panel-heading > .pull-right").prepend(configNode)
    for (const node of configNode.querySelectorAll("input")) {
        node.addEventListener('change', (event) => {
            const node = event.target
            console.log(`on change ${node.name}`)
            configStore.tips[node.name] = node.checked
            configStore.save()
        })
    }
    $(".btn.btn-xs.btn-primary").click(function() {
        isDungeon = false;
        console.log('停止秘境');
    });
}

// ==Accounts==

function Accounts() {
    if($('a[href="/Home/Index"]:not([class])').length!=0)
    {
        var name = $('a[href="/Home/Index"]:not([class])')[0].text;
        accountsStore.load();
        //console.log(accountsStore.accounts.length);
        GM_cookie.list({ url: 'https://www.idleinfinity.cn/', name: 'idleinfinity.cookies' }, (cookies, error) => {
            if (error) {
                console.log(error);
            }else{
                //重复检测
                var refresh = true;
                //console.log(accountsStore.accounts);
                for (const accountName in accountsStore.accounts) {
                    if(accountsStore.accounts[accountName]==cookies[0].value){
                        refresh = false;
                        //console.log("重复");
                    }
                    //console.log(`账户名: ${accountName}, 值: ${value}`);
                }
                if(refresh){
                    //console.log("不重复");
                    accountsStore.accounts[name]= cookies[0].value;
                    //console.log(accountsStore.accounts);
                }
                //console.log(cookies[0].value);
                accountsStore.save();
                //console.log(accountsStore);
                var AccountsContainers = '';
                for (const key in accountsStore.accounts) {
                    if (typeof accountsStore.accounts[key]=="string") {
                        AccountsContainers += `<li><a class="base account" >${key}</a></li>`;
                    }
                }
                // 网页上增加配置标记的功能
                const configNode = createElementByHTML(`
                    <li class="dropdown">
                            <a class="dropdown-toggle" role="button" aria-expanded="false" aria-haspopup="true" href="#" data-toggle="dropdown">${name}<span class="caret"></span></a>
                            <ul class="dropdown-menu">
                            ${AccountsContainers}
                            </ul>
                        </li>
                     `);
                //console.log($('a[href="/Home/Index"]:not([class])'));
                //document.querySelector(".nav.navbar-nav.navbar-right").firstChild.replaceWith(configNode);
                $('a[href="/Home/Index"]:not([class])')[0].parentNode.replaceWith(configNode);
                $(".account").click(function() {
                    //accountsStore.load();
                    //console.log(accountsStore);
                    //console.log($(this).text());
                    //console.log(accountsStore.accounts[$(this).text()]);
                    GM_cookie.set({
                        //url: 'https://www.idleinfinity.cn/',
                        name: 'idleinfinity.cookies',
                        value: accountsStore.accounts[$(this).text()],
                        //domain: 'www.idleinfinity.cn',
                        path: '/',
                        secure: true,
                        httpOnly: true,
                        expirationDate: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 999) // Expires in 30 days
                    }, function(error) {
                        if (error) {
                            console.error(error);
                        } else {
                            //console.log('Cookie set successfully.');
                            window.location.href = location.pathname;
                        }
                    });

                });

            }
        });
    }
}

const accountsStore = getStore(`idleinfinity.accounts`,{ accounts: {} })

// ==OnlineUsers==

function OnlineUsers(){
    if(location.pathname=="/Home/OnlineUsers"){
        setTimeout(function() {location.reload();}, getRandomInt(31000, 32000));
    }
}

// ==NavBar==

function NavBar(){
    $(".navbar-header").hide();
    var queryString = window.location.search;
    var params = new URLSearchParams(queryString);
    var id =params.get("id");
    if(id==null){id =params.get("Id");}
    // 网页上增加配置标记的功能
    if(id!=null && id!==""){
        const configNode = createElementByHTML(`
                    <ul class="nav navbar-nav navbar-left">
                        <li><a href="/Home/Index" class="add">主页</a></li>
                        <li><a href="/Character/Detail?id=`+id+`">人物</a></li>
                        <li><a href="/Skill/Config?id=`+id+`">技能</a></li>
                        <li><a href="/Equipment/Query?id=`+id+`">装备</a></li>
                        <li><a href="/Map/Detail?id=`+id+`">地图</a></li>
                        <li><a href="/Equipment/Material?id=`+id+`">符文</a></li>
                        <li><a href="/Auction/Query?id=`+id+`">拍卖</a></li>
                        <li><a href="/Config/Query?id=`+id+`">过滤</a></li>
                </ul>
                     `);
        //console.log($(".navbar-collapse .collapse"));
        //document.querySelector(".nav.navbar-nav.navbar-right").firstChild.replaceWith(configNode);
        $(".navbar-collapse.collapse").prepend(configNode);
    }
}

// ==MapSwitch==

function MapSwitch(){
    if(location.pathname=="/Map/Detail"){
        // 网页上增加配置标记的功能
        var maps = [5,10,15,20,25,30,38,40,43,45,48,50,53,58,60,63,67,68]
        //,69,70,71,72,78,80,88,90,98
        maps.reverse().forEach(function(item) {
            const configNode = createElementByHTML(`<a class="btn btn-xs btn-primary mapswitch" href="#" role="button">`+item+`</a>`)
            document.querySelector(".panel-heading > .pull-right").prepend(configNode);
        });

        $(".mapswitch").click(function() {
            //console.log($(this)[0].innerText)
            $("#ml").val($(this)[0].innerText);
            $("form").attr("action", "MapSwitch");
            $("form").trigger("submit");
        });
    }
}

// ==AutoBattle==

function AutoBattle()
{
    if(location.pathname=="/Map/Detail"){
        if($(".btn-info").length==0){
            if($(".battle-guaji").length!=0)
            {
                console.log("开抢");
                $("form").attr("action", "BattleGuaji");
                $("form").trigger("submit");
            }else
            {
                console.log("等待刷新");
                setTimeout(function() {location.reload();}, getRandomInt(31000, 60000));
            }
        }else{console.log("正常挂机");}
    }

    if(location.pathname=="/Map/BattleGuaji"){
        console.log("挂机失败");
        window.history.back();
    }
}

