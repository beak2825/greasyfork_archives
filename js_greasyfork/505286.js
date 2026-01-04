// ==UserScript==
// @name              日常本子-小鹿日用(飞飞修改1.0)
// @description       无剑Mud辅修，由在线版移植而来，順便《略改》
// @namespace         http://orchin.cn/
// @version           01_1.24
// @author            燕飞，东方鸣，懒人，小鹿
// @match        http://121.40.177.24:8001/*
// @match        http://110.42.64.223:8021/*
// @match        http://121.40.177.24:8041/*
// @match        http://121.40.177.24:8061/*
// @match        http://110.42.64.223:8081/*
// @match        http://121.40.177.24:8101/*
// @match        http://121.40.177.24:8102/*
// @match        http://swordman-s1.btmud.com/*
// @grant             unsafeWindow
// @grant             GM_info
// @grant             GM_setClipboard
// @run-at            document-end
// @compatible        Chrome >= 80
// @compatible        Edge >= 80
// @compatible        Firefox PC >= 74
// @compatible        Opera >= 67
// @compatible        Safari MacOS >= 13.1
// @compatible        Firefox Android >= 79
// @compatible        Opera Android >= 57
// @compatible        Safari iOS >= 13.4
// @compatible        WebView Android >= 80
// @downloadURL https://update.greasyfork.org/scripts/505286/%E6%97%A5%E5%B8%B8%E6%9C%AC%E5%AD%90-%E5%B0%8F%E9%B9%BF%E6%97%A5%E7%94%A8%28%E9%A3%9E%E9%A3%9E%E4%BF%AE%E6%94%B910%29.user.js
// @updateURL https://update.greasyfork.org/scripts/505286/%E6%97%A5%E5%B8%B8%E6%9C%AC%E5%AD%90-%E5%B0%8F%E9%B9%BF%E6%97%A5%E7%94%A8%28%E9%A3%9E%E9%A3%9E%E4%BF%AE%E6%94%B910%29.meta.js
// ==/UserScript==
//兼容一下低版本浏览器flat函数
if (!Array.prototype.flat) {
  Array.prototype.flat = function (count) {
    let c = count || 1;
    let len = this.length;
    let exe = [];
    if (this.length == 0) return this;
    while (c--) {
      let _arr = [];
      let flag = false;
      if (exe.length == 0) {
        flag = true;
        for (let i = 0; i < len; i++) {
          if (this[i] instanceof Array) {
            exe.push(...this[i]);
          } else {
            exe.push(this[i]);
          }
        }
      } else {
        for (let i = 0; i < exe.length; i++) {
          if (exe[i] instanceof Array) {
            flag = true;
            _arr.push(...exe[i]);
          } else {
            _arr.push(exe[i]);
          }
        }
        exe = _arr;
      }
      if (!flag && c == Infinity) {
        break;
      }
    }
    return exe;
  };
}
if (document.domain == "orchin.cn") {
  var params = new URLSearchParams(location.href.split("?")[1])
  var host = params.get("ws_host")
  params.delete("ws_host")
  location.replace("http://"+host+"?"+params.toString())
}
"use strict";
// 取消屏蔽
var KEYWORD_PATTERNS = g_gmain.KEYWORD_PATTERNS;
g_gmain.KEYWORD_PATTERNS = [];
$(() => {
  function init() {
    unsafeWindow.YFD = {
      qixiaList: [
        "宇文无敌",
        "李玄霸",
        "夏岳卿",
        "玄月研",
        "穆妙羽",
        "烈九州",
        "厉沧若",
        "八部龙将",
        "妙无心",
        "巫夜姬",
        "狼居胥",
        "风行骓",
        "风无痕",
        "吴缜",
        "狐苍雁",
        "护竺",
        "李宇飞",
        "庞统",
        "逆风舞",
        "王蓉",
        "浪唤雨",
        "火云邪神",
        "风南",
        "郭济",
        "步惊鸿",
      ],
      qixiaFriend: [
        { name: "宇文无敌", skillFN: 40000 },
        { name: "李玄霸", skillFN: 40000 },
        { name: "夏岳卿", skillFN: 40000 },
        { name: "玄月研", skillFN: 40000 },
        { name: "穆妙羽", skillFN: 40000 },
        { name: "烈九州", skillFN: 40000 },
        { name: "厉沧若", skillFN: 40000 },
        { name: "八部龙将", skillFN: 40000 },
        { name: "妙无心", skillFN: 40000 },
        { name: "巫夜姬", skillFN: 40000 },
        { name: "狼居胥", skillFN: 40000 },
        { name: "风行骓", skillFN: 40000 },
        { name: "风无痕", skillFN: 40000 },
        { name: "吴缜", skillFN: 40000 },
        { name: "狐苍雁", skillFN: 35000 },
        { name: "护竺", skillFN: 35000 },
        { name: "李宇飞", skillFN: 25000 },
        { name: "庞统", skillFN: 25000 },
        { name: "逆风舞", skillFN: 25000 },
        { name: "王蓉", skillFN: 25000 },
        { name: "浪唤雨", skillFN: 25000 },
        { name: "火云邪神", skillFN: 25000 },
        { name: "风南", skillFN: 25000 },
        { name: "郭济", skillFN: 25000 },
        { name: "步惊鸿", skillFN: 25000 },
      ],
      youxiaList: [
        {
          n: "门客",
          v: [
            "王语嫣",
            "范蠡",
            "程灵素",
            "水灵光",
            "霍青桐",
            "石青璇",
            "李红袖",
            "宋玉致",
            "华佗",
            "鲁妙子",
            "顾倩兮",
            "水笙",
            "林仙儿",
            "郭襄",
            "程瑛",
            "任盈盈",
            "阿朱",
            "袁紫衣",
            "赵敏",
            "小昭",
            "韦小宝",
          ],
        },
        { n: "魔武", v: ["林远图", "厉工", "金轮法王", "鸠摩智", "上官金虹", "封寒", "卓凌昭", "厉若海", "干罗", "孙恩", "婠婠", "练霓裳", "成昆", "侯希白", "夜魔"] },
        {
          n: "侠客",
          v: ["柯镇恶", "哈玛雅", "乔峰", "卢云", "虚竹", "徐子陵", "虚夜月", "云梦璃", "花无缺", "风行烈", "黄药师", "洪七公", "石破天", "宁不凡", "独孤求败"],
        },
        { n: "魔尊", v: ["庞斑", "杨肃观", "欧阳锋", "叶孤城", "燕狂徒"] },
        { n: "宗师", v: ["逍遥子", "李寻欢", "令东来", "宋缺", "楚留香"] },
      ],
      pathCmds: { e: "go east", s: "go south", w: "go west", n: "go north", se: "go southeast", sw: "go southwest", ne: "go northeast", nw: "go northwest" },
      gemPrefix: ["碎裂的", "裂开的", "", "无暇的", "完美的", "君王的", "皇帝的", "天神的"],
      gemType: [
        { name: "红宝石", key: "hongbaoshi", color: "#F00" },
        { name: "黄宝石", key: "huangbaoshi", color: "#FA0" },
        { name: "绿宝石", key: "lvbaoshi", color: "#0C0" },
        { name: "蓝宝石", key: "lanbaoshi", color: "#00F" },
        { name: "紫宝石", key: "zishuijing", color: "#F0F" },
      ],
      youxiaSkillMap: [
        {
          skill: "长春不老功",
          name: "逍遥子",
          kind: "宗师",
          type: "内功",
          pre: [
            { skill: "龙象般若功", name: "金轮法王", kind: "邪武", type: "内功", lvl: 40 },
            { skill: "紫血大法", name: "厉工", kind: "邪武", type: "内功", lvl: 40 },
          ],
        },
        {
          skill: "九阴逆",
          name: "欧阳锋",
          kind: "魔尊",
          type: "内功",
          pre: [
            { skill: "白首太玄经", name: "石破天", kind: "侠客", type: "内功", lvl: 40 },
            { skill: "弹指神通", name: "黄药师", kind: "侠客", type: "掌法", lvl: 40 },
          ],
        },
        {
          skill: "凤舞九天",
          name: "宫九",
          kind: "魔尊",
          type: "轻功",
          pre: [
            { skill: "天魔妙舞", name: "婠婠", kind: "邪武", type: "轻功", lvl: 120 },
            { skill: "云梦归月", name: "云梦璃", kind: "侠客", type: "轻功", lvl: 120 },
            { skill: "飞鸿鞭法", name: "哈玛雅", kind: "侠客", type: "鞭法", lvl: 120 },
            {
              skill: "踏月留香",
              name: "楚留香",
              kind: "宗师",
              type: "轻功",
              lvl: 120,
              pre: [
                { skill: "天魔妙舞", name: "婠婠", kind: "邪武", type: "轻功", lvl: 40 },
                { skill: "云梦归月", name: "云梦璃", kind: "侠客", type: "轻功", lvl: 40 },
                { skill: "降魔杖法", name: "0柯镇恶", kind: "侠客", type: "杖法", lvl: 40 },
                { skill: "飞鸿鞭法", name: "哈玛雅", kind: "侠客", type: "鞭法", lvl: 40 },
              ],
            },
          ],
        },
        {
          skill: "无剑之剑",
          name: "白云天",
          kind: "宗师",
          type: "剑法",
          pre: [
            { skill: "天魔妙舞", name: "婠婠", kind: "邪武", type: "轻功", lvl: 120 },
            { skill: "神剑慧芒", name: "卓凌昭", kind: "邪武", type: "剑法", lvl: 120 },
            { skill: "不凡三剑", name: "宁不凡", kind: "侠客", type: "剑法", lvl: 120 },
            {
              skill: "天外飞仙",
              name: "叶孤城",
              kind: "魔尊",
              type: "剑法",
              lvl: 120,
              pre: [
                { skill: "紫虚辟邪剑", name: "林远图", kind: "邪武", type: "剑法", lvl: 40 },
                { skill: "神剑慧芒", name: "卓凌昭", kind: "邪武", type: "剑法", lvl: 40 },
                { skill: "不凡三剑", name: "宁不凡", kind: "侠客", type: "剑法", lvl: 40 },
              ],
            },
          ],
        },
        {
          skill: "披罗紫气",
          name: "伍定远",
          kind: "宗师",
          type: "掌法",
          pre: [
            { skill: "云梦归月", name: "云梦璃", kind: "侠客", type: "轻功", lvl: 120 },
            { skill: "降龙廿八掌", name: "乔峰", kind: "侠客", type: "掌法", lvl: 120 },
            { skill: "弹指神通", name: "黄药师", kind: "侠客", type: "掌法", lvl: 120 },
            {
              skill: "天魔策",
              name: "庞斑",
              kind: "魔尊",
              type: "掌法",
              lvl: 120,
              pre: [
                { skill: "降龙廿八掌", name: "乔峰", kind: "侠客", type: "掌法", lvl: 40 },
                { skill: "无相六阳掌", name: "虚竹", kind: "侠客", type: "掌法", lvl: 40 },
                { skill: "折花百式", name: "侯希白", kind: "邪武", type: "掌法", lvl: 40 },
                { skill: "释迦拈花指", name: "鸠摩智", kind: "邪武", type: "掌法", lvl: 40 },
              ],
            },
          ],
        },
        {
          skill: "火贪一刀",
          name: "方子敬",
          kind: "魔尊",
          type: "刀法",
          pre: [
            { skill: "天魔妙舞", name: "婠婠", kind: "邪武", type: "轻功", lvl: 120 },
            { skill: "左手刀法", name: "封寒", kind: "邪武", type: "刀法", lvl: 120 },
            { skill: "移花接玉刀", name: "花无缺", kind: "侠客", type: "刀法", lvl: 120 },
            {
              skill: "天刀八诀",
              name: "宋缺",
              kind: "宗师",
              type: "刀法",
              lvl: 120,
              pre: [
                { skill: "左手刀法", name: "封寒", kind: "邪武", type: "刀法", lvl: 40 },
                { skill: "移花接玉刀", name: "花无缺", kind: "侠客", type: "刀法", lvl: 40 },
              ],
            },
          ],
        },
        {
          skill: "天雷落",
          name: "石刚",
          kind: "魔尊",
          type: "暗器",
          pre: [
            { skill: "云梦归月", name: "云梦璃", kind: "侠客", type: "轻功", lvl: 120 },
            { skill: "九字真言印", name: "徐子陵", kind: "侠客", type: "暗器", lvl: 120 },
            { skill: "九星定形针", name: "练霓裳", kind: "邪武", type: "暗器", lvl: 120 },
            {
              skill: "小李飞刀",
              name: "李寻欢",
              kind: "宗师",
              type: "暗器",
              lvl: 120,
              pre: [
                { skill: "九字真言印", name: "徐子陵", kind: "侠客", type: "暗器", lvl: 40 },
                { skill: "九星定形针", name: "练霓裳", kind: "邪武", type: "暗器", lvl: 40 },
                { skill: "子母龙凤环", name: "上官金虹", kind: "邪武", type: "暗器", lvl: 40 },
              ],
            },
          ],
        },
        {
          skill: "孤帆鞭影",
          name: "陆孤瞻",
          kind: "魔尊",
          type: "鞭法",
          pre: [
            { skill: "弹指神通", name: "黄药师", kind: "侠客", type: "掌法", lvl: 120 },
            { skill: "降魔杖法", name: "0柯镇恶", kind: "侠客", type: "杖法", lvl: 120 },
            { skill: "飞鸿鞭法", name: "哈玛雅", kind: "侠客", type: "鞭法", lvl: 120 },
            { skill: "冰玄鞭法", name: "干罗", kind: "邪武", type: "鞭法", lvl: 120 },
          ],
        },
        {
          skill: "无双连锤",
          name: "瓦耳拉齐",
          kind: "魔尊",
          type: "锤法",
          pre: [
            { skill: "游龙剑", name: "孙恩", kind: "邪武", type: "剑法", lvl: 120 },
            { skill: "幻阴指锤", name: "成昆", kind: "邪武", type: "锤法", lvl: 120 },
            { skill: "正道十七", name: "卢云", kind: "侠客", type: "锤法", lvl: 120 },
            {
              skill: "玉石俱焚",
              name: "燕狂徒",
              kind: "魔尊",
              type: "锤法",
              lvl: 120,
              pre: [
                { skill: "幻阴指锤", name: "成昆", kind: "邪武", type: "锤法", lvl: 40 },
                { skill: "正道十七", name: "卢云", kind: "侠客", type: "锤法", lvl: 40 },
              ],
            },
          ],
        },
        {
          skill: "暗山神斧",
          name: "0六先生",
          kind: "魔尊",
          type: "斧法",
          pre: [
            { skill: "云梦归月", name: "云梦璃", kind: "侠客", type: "轻功", lvl: 120 },
            { skill: "弹指神通", name: "黄药师", kind: "侠客", type: "掌法", lvl: 120 },
            { skill: "降魔杖法", name: "0柯镇恶", kind: "侠客", type: "杖法", lvl: 120 },
            { skill: "独孤斧诀", name: "独孤求败", kind: "侠客", type: "斧法", lvl: 120 },
          ],
        },
        {
          skill: "六道轮回",
          name: "杨肃观",
          kind: "魔尊",
          type: "斧法",
          pre: [
            { skill: "天魔妙舞", name: "婠婠", kind: "邪武", type: "轻功", lvl: 40 },
            { skill: "青冥血斧", name: "夜魔", kind: "邪武", type: "斧法", lvl: 40 },
            { skill: "独孤斧诀", name: "独孤求败", kind: "侠客", type: "斧法", lvl: 40 },
          ],
        },
        {
          skill: "温候戟舞",
          name: "韩毅",
          kind: "魔尊",
          type: "枪法",
          pre: [
            { skill: "弹指神通", name: "黄药师", kind: "侠客", type: "掌法", lvl: 120 },
            { skill: "冰月破魔枪", name: "风行烈", kind: "侠客", type: "枪法", lvl: 120 },
            { skill: "燎原百击", name: "厉若海", kind: "邪武", type: "枪法", lvl: 120 },
            {
              skill: "神龙东来",
              name: "令东来",
              kind: "宗师",
              type: "枪法",
              lvl: 120,
              pre: [
                { skill: "冰月破魔枪", name: "风行烈", kind: "侠客", type: "枪法", lvl: 40 },
                { skill: "燎原百击", name: "厉若海", kind: "邪武", type: "枪法", lvl: 40 },
                { skill: "月夜鬼萧", name: "虚夜月", kind: "侠客", type: "棍法", lvl: 40 },
              ],
            },
          ],
        },
      ],
      mapsLib: {
        Npc: [
          { jh: "雪亭镇", loc: "离隐斋", name: "金庸大师", way: "jh 1;w", desc: "泱泱中华，上下五千年，朝代更替，江山变换，风云人物之中，唯有此人开创一全新世界，谓之『江湖』。凡入江湖之人，无能得出。只缘所闻故事均曲折离奇，所见之人皆栩栩如生，所历若长江大河一气呵成，所思无不字字入心绕梁三日。明知在他谈笑之间赠予你的，不过是夏日里的一场春梦，却鲜有人不痴迷于其斑斓的色彩和无尽的神韵。", },
          { jh: "雪亭镇", loc: "飞狐外传", name: "胡斐", way: "jh 1;w;w;n", desc: "这人满腮虬髯，根根如铁，一头浓发，却不结辫，横生倒竖般有如乱草，你看到他不禁也是一惊。", },
          { jh: "雪亭镇", loc: "雪山飞狐", name: "苗若兰", way: "jh 1;w;w;w;n", desc: "肤光胜雪，双目犹似一泓清水，容貌秀丽之极，当真如明珠生晕，美玉莹光，眉目间隐隐有一股书卷的清气，与胡斐同榻时脸蛋羞得如海棠花般，娇美艳丽，难描难画，美目流波，俏脸生晕，月光雪光映在身旁苗若兰皎洁无瑕的脸上，当真是人间仙境，是天仙般的人物。", },
          { jh: "雪亭镇", loc: "连城诀", name: "凌霜华", way: "jh 1;w;w;w;w;n", desc: "只见一个清秀绝俗的少女正在观赏菊花，穿一身嫩黄衫子，当真是人淡如菊，怕是你这一生之中，从未见过这般雅致清丽的姑娘。", },
          { jh: "雪亭镇", loc: "天龙八部", name: "乔峰", way: "jh 1;w;w;w;w;w;n", desc: "身材甚是魁伟，三十来岁年纪，身穿灰色旧布袍，已微有破烂，浓眉大眼，高鼻阔口，一张四方的国字脸，颇有风霜之色，顾盼之际，极有威势。", },
          { jh: "雪亭镇", loc: "笑傲江湖", name: "红叶禅师", way: "jh 1;w;w;s", desc: "莆田南少林方丈，收藏《葵花宝典》一书，乃是一位大智大慧的了不起人物。", },
          { jh: "雪亭镇", loc: "倚天屠龙记", name: "赵敏", way: "jh 1;w;w;w;w;w;w;s", desc: "汝阳王之女，封号“绍敏郡主”，赵敏是她的汉名。其父在当朝执掌兵马大权，因此自幼生性好武，内力不深，但见识颇广。她爱做汉人打扮，活脱脱是个汉人美女。她娇美无匹，面莹如玉，眼澄似水，笑意盈盈，不单艳丽不可方物，还自有一番说不尽的娇媚可爱。", },
          { jh: "雪亭镇", loc: "白马啸西风", name: "李文秀", way: "jh 1;w;w;w;w;w;w;w;n", desc: "这是草原上最美丽、最会唱歌的少女。她玉雪可爱，却不得心上人所爱。" },
          { jh: "雪亭镇", loc: "鹿鼎记", name: "双儿", way: "jh 1;#8 w;n", desc: "重情重义，温柔善良，善解人意，乖巧聪慧，体贴贤惠，清秀可人，腼腆羞涩，诚实不欺，胸无城府，忠肝义胆，天真纯洁。", },
          { jh: "雪亭镇", loc: "神雕侠侣", name: "郭襄", way: "jh 1;w;w;w;w;s", desc: "少女清雅秀丽，无疑是个美人坯子。穿淡绿缎子皮袄，颈中挂著一串明珠，每颗珠子都一般的小指头大小，发出淡淡光晕。你不禁为她美貌所慑，住口不言，呆呆望著。", },
          { jh: "雪亭镇", loc: "侠客行", name: "丁丁当当", way: "jh 1;w;w;w;w;w;s", desc: "一张清丽白腻的脸庞，小嘴边带著俏皮微笑，月光照射在她明澈的眼睛之中，宛然便是两点明星。", },
          { jh: "雪亭镇", loc: "射雕英雄传", name: "郭靖", way: "jh 1;w;w;w;w;w;w;n", desc: "体格粗壮，浓眉大眼。虽衣著带几分土气，却难掩大侠风骨。" },
          { jh: "雪亭镇", loc: "越女剑", name: "阿青", way: "jh 1;#9 w", desc: "这少女一张瓜子脸，睫长眼大，皮肤白晰，容貌甚为秀丽，身材苗条，弱质纤纤。" },
          { jh: "雪亭镇", loc: "书剑恩仇录", name: "霍青桐", way: "jh 1;w;w;w;s", desc: "霍青桐：十八九岁年纪，腰插匕首，长辫垂肩，头戴金丝绣的小帽，帽边插一根长长的翠绿羽毛，革履青马，旖旎如画。秀美中透著一股英气，光彩照人，当真是丽若春梅绽雪，神如秋蕙披霜，两颊融融，霞映澄塘，双目晶晶，月射寒江。此女乃天山北路回疆部落首领木卓伦之女，霍阿伊之妹，喀丝丽之姐，“天山双鹰”之徒。一手天山剑法甚是厉害。她相貌出众，才智过人，爱穿黄衫，帽边常插一根长长的翠绿羽毛，因此得了个漂亮外号，天山南北武林中人都知道“翠羽黄衫”霍青桐。", },
          { jh: "雪亭镇", loc: "碧血剑", name: "袁承志", way: "jh 1;#7 w;s", desc: "为人沉稳，以国家大义为己任，出生入死；他以其父为标榜，当仁不让。" },
          { jh: "雪亭镇", loc: "鸳鸯刀", name: "任飞燕", way: "jh 1;#8 w;s", desc: "一个风程仆仆的侠客。" },
          { jh: "雪亭镇", loc: "饮风客栈", name: "五一大使", way: "jh 1", desc: "一个风程仆仆的侠客。" },
          { jh: "雪亭镇", loc: "饮风客栈", name: "小糖人", way: "jh 1", desc: "小糖人造型多变，本以熬化的蔗糖或麦芽糖做成，一会变成人物、一会变成动物、花草等。据说诞生于宋代春节闹花灯的集市。", },
          { jh: "雪亭镇", loc: "饮风客栈", name: "光棍", way: "jh 1", desc: "一个风程仆仆的侠客。" },
          { jh: "雪亭镇", loc: "饮风客栈", name: "陈汤", way: "jh 1", desc: "西汉六大名将之一，其句“明犯我强汉者，虽远必诛”，过了两千年依然是激动人心。", },
          { jh: "雪亭镇", loc: "饮风客栈", name: "双旦使者", way: "jh 1", desc: "一个风程仆仆的侠客。" },
          { jh: "雪亭镇", loc: "饮风客栈", name: "过年小【二】", way: "jh 1", desc: "这是论剑两周年特别形象大使，眉目俊秀，颇有几分剑大师的风采。", },
          { jh: "雪亭镇", loc: "饮风客栈", name: "逄义", way: "jh 1", desc: "逄义是封山派中和柳淳风同辈的弟子，但是生性好赌的他并不受师父及同门师兄弟的喜爱，因此辈分虽高，却未曾担任门中任何重要职务。逄义经常外出，美其名曰：旅行，实则避债，碍于门规又不敢做那打家劫舍的勾当，因此经常四处寻找赚钱发财的机会。", },
          { jh: "雪亭镇", loc: "饮风客栈", name: "店小二", way: "jh 1", desc: "这位店小二正笑咪咪地忙著，还不时拿起挂在脖子上的抹布擦脸。" },
          { jh: "雪亭镇", loc: "饮风客栈", name: "剑大师", way: "jh 1", desc: "宗之潇洒美少年举觞白眼望青天皎如玉树临风前" },
          { jh: "雪亭镇", loc: "广场", name: "苦力", way: "jh 1;e", desc: "一个苦力打扮的汉子在这里等人来雇用。" },
          { jh: "雪亭镇", loc: "城隍庙", name: "庙祝", way: "jh 1;e;e", desc: "这个老人看起来七十多岁了，看著他佝偻的身影，你忽然觉得心情沈重了下来。" },
          { jh: "雪亭镇", loc: "黄土小径", name: "野狗", way: "jh 1;e;e;s;ne", desc: "一只浑身脏兮兮的野狗。" },
          { jh: "雪亭镇", loc: "山路", name: "蒙面剑客", way: "jh 1;e;e;s;ne;ne", desc: "蒙著脸，身后背著一把剑，看上去武艺颇为不俗。" },
          { jh: "雪亭镇", loc: "淳风武馆大门", name: "刘安禄", way: "jh 1;e;n;e", desc: "刘安禄是淳风武馆的门房，除了馆主柳淳风没有人知道他的出身来历，只知到他的武艺不弱，一手快刀在这一带罕有敌手。", },
          { jh: "雪亭镇", loc: "淳风武馆教练场", name: "武馆弟子", way: "jh 1;e;n;e;e", desc: "你看到一位身材高大的汉子，正在辛苦地操练著。" },
          { jh: "雪亭镇", loc: "淳风武馆教练场", name: "李火狮", way: "jh 1;e;n;e;e", desc: "李火狮是个孔武有力的大块头，他正在训练他的弟子们习练「柳家拳法」。", },
          { jh: "雪亭镇", loc: "淳风武馆大厅", name: "柳淳风", way: "jh 1;e;n;e;e;e", desc: "柳淳风是个相当高大的中年儒生，若不是从他腰间挂著的「玄苏剑」你大概猜不到眼前这个温文儒雅的中年人竟是家大武馆的馆主。", },
          { jh: "雪亭镇", loc: "书房", name: "柳绘心", way: "jh 1;e;n;e;e;e;e;n", desc: "柳绘心是淳风武馆馆主柳淳风的独生女。" },
          { jh: "雪亭镇", loc: "雪亭镇街道", name: "醉汉", way: "jh 1;e;n;n", desc: "一个喝得醉醺醺的年轻人。。。。。" },
          { jh: "雪亭镇", loc: "雪亭镇街道", name: "收破烂的", way: "jh 1;e;n;n", desc: "这个人不但自己收破烂，身上也穿得破烂不堪。" },
          { jh: "雪亭镇", loc: "木屋", name: "花不为", way: "jh 1;e;n;n;n;n;e", desc: "此人前几年搬到雪亭镇来，身世迷糊。" },
          { jh: "雪亭镇", loc: "雪亭驿", name: "杜宽", way: "jh 1;e;n;n;n;n;w", desc: "杜宽担任雪亭驿的驿长已经有十几年了，虽然期间有几次升迁的机会，但是他都因为舍不得离开这个小山村而放弃了，雪亭镇的居民对杜宽的风评相当不错，常常会来到驿站跟他聊天。", },
          { jh: "雪亭镇", loc: "雪亭驿", name: "杜宽宽", way: "jh 1;e;n;n;n;n;w", desc: "不要杀我~~~~~~~~~~" },
          { jh: "雪亭镇", loc: "桑邻药铺", name: "杨掌柜", way: "jh 1;e;n;n;n;w", desc: "杨掌柜是这附近相当有名的大善人，常常施舍草药给付不起药钱的穷人。此外他的医术也不错，年轻时曾经跟著山烟寺的玄智和尚学医，一般的伤寒小病直接问他开药吃比医生还灵。", },
          { jh: "雪亭镇", loc: "桑邻药铺", name: "樵夫", way: "jh 1;e;n;n;n;w", desc: "你看到一个粗壮的大汉，身上穿著普通樵夫的衣服。" },
          { jh: "雪亭镇", loc: "打铁铺子", name: "王铁匠", way: "jh 1;e;n;n;w", desc: "王铁匠正用铁钳夹住一块红热的铁块放进炉中。打孔" },
          { jh: "雪亭镇", loc: "安记钱庄", name: "安惜迩", way: "jh 1;e;n;w", desc: "安惜迩是个看起来相当斯文的年轻人，不过有时候会有些心不在焉的样子，雪亭镇的居民对安惜迩都觉得有点神秘莫测的感觉，为什么他年纪轻轻就身为一家大钱庄的老板，还有他一身稀奇古怪的武功，所幸安惜迩似乎天性恬淡，甚至有些隐者的风骨，只要旁人不去惹他，他也绝不会去招惹旁人。", },
          { jh: "雪亭镇", loc: "雪亭镇街口", name: "黎老八", way: "jh 1;e;s", desc: "这是位生性刚直，嫉恶如仇的丐帮八袋弟子。" },
          { jh: "雪亭镇", loc: "雪亭镇街道", name: "老农夫", way: "jh 1;e;s;w", desc: "你看到一位面色黝黑的农夫。" },
          { jh: "雪亭镇", loc: "雪亭镇街道", name: "农夫", way: "jh 1;e;s;w", desc: "你看到一位面色黝黑的农夫。" },
          { jh: "雪亭镇", loc: "书院", name: "魏无极", way: "jh 1;e;s;w;s", desc: "魏无极是个博学多闻的教书先生，他年轻时曾经中过举人，但是因为生性喜爱自由而不愿做官，魏无极以教书为业，如果你付他一笔学费，就可以成为他的弟子学习读书识字。", },
          { jh: "雪亭镇", loc: "青石官道", name: "疯狗", way: "jh 1;e;s;w;w", desc: "一只浑身脏兮兮的野狗，一双眼睛正恶狠狠地瞪著你。" },
          { jh: "雪亭镇", loc: "饮风客栈二楼", name: "星河大师", way: "jh 1;雪亭镇:饮风客栈^饮风客栈二楼", desc: "帅" },
          { jh: "雪亭镇", loc: "饮风客栈二楼", name: "崔元基", way: "jh 1;雪亭镇:饮风客栈^饮风客栈二楼", desc: "此人恶行累累，身背无数血案，其身上布满刀伤，看上去极为凶神恶煞。", },
          { jh: "雪亭镇", loc: "饮风客栈二楼", name: "神秘男子", way: "jh 1;雪亭镇:饮风客栈^饮风客栈二楼", desc: "该男子头顶笠帽，一身劲装。看不清面容，极为神秘。", },
          { jh: "洛阳", loc: "北郊矿山", name: "剑遇北", way: "jh 2;n;n;n;n;n;n;n;n;n;n;w", desc: "一个身受重伤的布衣青年，手持一把染血的佩剑。" },
          { jh: "洛阳", loc: "矿场", name: "矿监", way: "jh 2;n;n;n;n;n;n;n;n;n;n;w;w", desc: "他身著红色官袍，方脸阔嘴，下颌一捋长须，不时用那双小眼睛瞅你。", },
          { jh: "洛阳", loc: "冶炼场", name: "邵空子", way: "jh 2;n;n;n;n;n;n;n;n;n;n;w;w;w", desc: "他穿一件棕布麻衣，身材壮硕，目光炯炯，两手尤为粗大，负责冶炼数十年，是存世不多的铸造大师之一。", },
          { jh: "洛阳", loc: "矿洞入口", name: "矿洞入口", way: "jh 2;n;n;n;n;n;n;n;n;n;n;w;w;w;w", desc: "黝黑的洞口深不见底，里面似乎传来叮叮当当的声音。根据产出矿品质的不同，矿坑可以分为普通、地品和天品三种。曾经有人在里面挖出过矿髓，这可是能升级矿脉的好东西。不过地品及天品矿洞必须要有朝廷的许可才能进入。", },
          { jh: "洛阳", loc: "南郊小路", name: "农夫", way: "jh 2;n", desc: "一个戴著斗笠，正在辛勤劳作的农夫。" },
          { jh: "洛阳", loc: "南门", name: "守城士兵", way: "jh 2;n;n", desc: "一个守卫洛阳城的士兵" },
          { jh: "洛阳", loc: "南市", name: "客商", way: "jh 2;n;n;e", desc: "长途跋涉至此的客商。" },
          { jh: "洛阳", loc: "船坞", name: "蓑衣男子", way: "jh 2;n;n;e;s;洛阳:洛水渡口^船坞", desc: "身穿蓑衣坐在船头的男子，头上的斗笠压得很低，你看不见他的脸。" },
          { jh: "洛阳", loc: "南大街", name: "乞丐", way: "jh 2;n;n;n", desc: "一个穿著破破烂烂的乞丐" },
          { jh: "洛阳", loc: "金刀门", name: "金刀门弟子", way: "jh 2;n;n;n;e", desc: "这人虽然年纪不大，却十分傲慢。看来金刀门是上梁不正下梁歪。", },
          { jh: "洛阳", loc: "练武场", name: "王霸天", way: "jh 2;n;n;n;e;s", desc: "王霸天已有七十来岁，满面红光，颚下一丛长长的白须飘在胸前，精神矍铄，左手呛啷啷的玩著两枚鹅蛋大小的金胆。", },
          { jh: "洛阳", loc: "洛川街", name: "地痞", way: "jh 2;n;n;n;n", desc: "洛阳城里的地痞，人见人恶。" },
          { jh: "洛阳", loc: "集市", name: "小贩", way: "jh 2;n;n;n;n;e", desc: "起早贪黑养家糊口的小贩。" },
          { jh: "洛阳", loc: "猪肉摊", name: "郑屠夫", way: "jh 2;n;n;n;n;e;s", desc: "一个唾沫四溅，满身油星的屠夫。看上去粗陋鄙俗，有些碍眼。" },
          { jh: "洛阳", loc: "草屋", name: "绿袍老者", way: "jh 2;n;n;n;n;n;e;e;n;n;e;n", desc: "一身绿袍的老人，除了满头白发，强健的身姿和矍铄的眼神都不像一位老者。", },
          { jh: "洛阳", loc: "林间石阶", name: "山贼", way: "jh 2;n;n;n;n;n;e;e;n;n;n", desc: "隐藏在密林中打家劫舍的贼匪。" },
          { jh: "洛阳", loc: "登山小径", name: "守墓人", way: "jh 2;n;n;n;n;n;e;e;n;n;n;n", desc: "负责看守白冢的老人，看起来也是有些功夫的。" },
          { jh: "洛阳", loc: "松风亭", name: "凌云", way: "jh 2;n;n;n;n;n;e;e;n;n;n;n;e", desc: "败剑山庄少庄主，跟著父亲云游四海。" },
          { jh: "洛阳", loc: "松风亭", name: "凌中天", way: "jh 2;n;n;n;n;n;e;e;n;n;n;n;e", desc: "好游山玩水的败剑山庄庄主。" },
          { jh: "洛阳", loc: "白公墓", name: "黑衣文士", way: "jh 2;n;n;n;n;n;e;e;n;n;n;n;n", desc: "看样子很斯文，不像会欺负人哦～" },
          { jh: "洛阳", loc: "白公墓", name: "盗墓贼", way: "jh 2;n;n;n;n;n;e;e;n;n;n;n;n", desc: "以盗窃古墓财宝为生的人。" },
          { jh: "洛阳", loc: "墓道", name: "黑衣女子", way: "jh 2;n;n;n;n;n;e;e;n;n;n;n;n;get_silver", desc: "一身紧身黑衣将其身体勾勒的曲线毕露，黑纱遮住了面容，但看那剪水双眸，已经足以勾魂。", },
          { jh: "洛阳", loc: "听伊亭", name: "白面书生", way: "jh 2;n;n;n;n;n;e;e;n;n;n;w", desc: "书生打扮的中年男子，手中的折扇隐露寒光。" },
          { jh: "洛阳", loc: "观景台", name: "护卫", way: "jh 2;n;n;n;n;n;e;e;n;n;w", desc: "大户人家的护卫，一身劲装。" },
          { jh: "洛阳", loc: "富人庄院", name: "富家公子", way: "jh 2;n;n;n;n;n;e;n", desc: "此人一副风流倜傥的样子，一看就是个不知天高地厚的公子哥。" },
          { jh: "洛阳", loc: "储藏室", name: "洪帮主", name_new: "尚锄奸", way: "jh 2;n;n;n;n;n;e;n;op1", desc: "他就是丐帮帮主。" },
          { jh: "洛阳", loc: "青石街", name: "鲁长老", way: "jh 2;n;n;n;n;n;n;e", desc: "鲁长老虽然武功算不得顶尖高手，可是在江湖上却颇有声望。因为他在丐帮中有仁有义，行事光明磊落，深得洪帮主的器重。", },
          { jh: "洛阳", loc: "北大街", name: "卖花姑娘", way: "jh 2;n;n;n;n;n;n;n", desc: "她总是甜甜的微笑，让人不忍拒绝她篮子里的鲜花。" },
          { jh: "洛阳", loc: "钱庄", name: "刘守财", way: "jh 2;n;n;n;n;n;n;n;e", desc: "洛阳城的财主，开了一家钱庄，家财万贯。" },
          { jh: "洛阳", loc: "北门", name: "守城武将", way: "jh 2;n;n;n;n;n;n;n;n", desc: "一个守卫洛阳城的武将" },
          { jh: "洛阳", loc: "北郊小路", name: "疯狗", way: "jh 2;n;n;n;n;n;n;n;n;n", desc: "一只四处乱窜的疯狗，顶著一身脏兮兮的的毛发。" },
          { jh: "洛阳", loc: "绿竹林", name: "青竹蛇", way: "jh 2;n;n;n;n;n;n;n;n;n;e", desc: "一条全身翠绿的毒蛇，缠绕在竹枝上。" },
          { jh: "洛阳", loc: "绿竹雅舍", name: "布衣老翁", way: "jh 2;n;n;n;n;n;n;n;n;n;e;n", desc: "一身布衣，面容慈祥的老人。" },
          { jh: "洛阳", loc: "清响斋", name: "萧问天", way: "jh 2;n;n;n;n;n;n;n;n;n;e;n;n", desc: "虽然身居陋室，衣著朴素，眼神的锐利却让人不能忽视他的存在。", },
          { jh: "洛阳", loc: "密室", name: "藏剑楼首领", way: "jh 2;n;n;n;n;n;n;n;n;n;e;n;n;n", desc: "一名看上去风度非凡之人，正背手闭目养神中好像等候什么。", },
          { jh: "洛阳", loc: "瓮城", name: "胡商", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n", desc: "" },
          { jh: "洛阳", loc: "明德门", name: "城门卫兵", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n", desc: "" },
          { jh: "洛阳", loc: "天狼阁", name: "江湖大盗", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e;e", desc: "" },
          { jh: "洛阳", loc: "凌烟阁", name: "李贺", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e;e;n;n;n;n;n;n;n;n;n;n;n;n;n;n", desc: "" },
          { jh: "洛阳", loc: "凌烟阁顶", name: "云梦璃", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e;e;n;n;n;n;n;n;n;n;n;n;n;n;n;n;event_1_95312623", desc: "", },
          { jh: "洛阳", loc: "水榭", name: "游客", way: "jh 2;n;n;n;n;n;e;e;n", desc: "来白冢游玩的人，背上的包袱里鼓鼓囊囊，不知道装了什么？" },
          { jh: "洛阳", loc: "承天门大街", name: "游客", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n", desc: "一个风程仆仆的侠客。" },
          { jh: "洛阳", loc: "六扇门", name: "捕快", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e", desc: "" },
          { jh: "洛阳", loc: "六扇门", name: "捕快统领", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e", desc: "" },
          { jh: "洛阳", loc: "富贵银庄", name: "苗一郎", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;n;e", desc: "" },
          { jh: "洛阳", loc: "东市大街", name: "王府总管", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;n;n", desc: "" },
          { jh: "洛阳", loc: "东市大街", name: "王府小厮", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;n;n", desc: "" },
          { jh: "洛阳", loc: "珍玉斋", name: "董老板", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;n;n;e", desc: "" },
          { jh: "洛阳", loc: "东市大街", name: "龟兹乐师", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;n;n;n", desc: "" },
          { jh: "洛阳", loc: "羽霓坊", name: "上官小婉", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;n;n;n;e", desc: "" },
          { jh: "洛阳", loc: "锦官绣院", name: "龟兹舞女", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;n;n;n;w", desc: "" },
          { jh: "洛阳", loc: "锦官绣院", name: "卓小妹", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;n;n;n;w", desc: "" },
          { jh: "洛阳", loc: "天和当铺", name: "护国军卫", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;n;n;w", desc: "" },
          { jh: "洛阳", loc: "天和当铺", name: "朱老板", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;n;n;w", desc: "" },
          { jh: "洛阳", loc: "山海古玩店", name: "仇老板", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;n;w", desc: "" },
          { jh: "洛阳", loc: "山海古玩店", name: "顾先生", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;n;w", desc: "" },
          { jh: "洛阳", loc: "承天门广场", name: "独孤须臾", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n", desc: "" },
          { jh: "洛阳", loc: "玄武门", name: "金甲卫士", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n", desc: "" },
          { jh: "洛阳", loc: "大明宫内庭", name: "独孤皇后", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n", desc: "" },
          { jh: "洛阳", loc: "云远寺大门", name: "刀僧卫", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w", desc: "" },
          { jh: "洛阳", loc: "诛心楼", name: "镇魂使", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;s;s;s;s;s", desc: "" },
          { jh: "洛阳", loc: "招魂台", name: "招魂师", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;s;s;s;s;w", desc: "" },
          { jh: "洛阳", loc: "明月客栈", name: "说书人", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;n;w", desc: "" },
          { jh: "洛阳", loc: "明月客栈", name: "客栈老板", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;n;w", desc: "" },
          { jh: "洛阳", loc: "老高铁铺", name: "高铁匠", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;e", desc: "" },
          { jh: "洛阳", loc: "老高铁铺", name: "哥舒翰", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;e", desc: "" },
          { jh: "洛阳", loc: "玉门客栈", name: "樊天纵", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;e", desc: "" },
          { jh: "洛阳", loc: "玉门客栈", name: "若羌巨商", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;e", desc: "" },
          { jh: "洛阳", loc: "西市大街", name: "乌孙马贩", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n", desc: "" },
          { jh: "洛阳", loc: "老孙肉铺", name: "孙三娘", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;e", desc: "" },
          { jh: "洛阳", loc: "天策大道", name: "白衣少侠", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n", desc: "" },
          { jh: "洛阳", loc: "天策府大门", name: "玄甲卫兵", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n;n", desc: "" },
          { jh: "洛阳", loc: "照壁", name: "杜如晦", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n;n;n;e", desc: "" },
          { jh: "洛阳", loc: "议事厅", name: "秦王", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n;n;n;n;n;n;n", desc: "" },
          { jh: "洛阳", loc: "军机室", name: "翼国公", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n;n;n;n;n;n;n;e", desc: "" },
          { jh: "洛阳", loc: "军机室", name: "尉迟敬德", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n;n;n;n;n;n;n;e", desc: "" },
          { jh: "洛阳", loc: "参谋室", name: "程知节", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n;n;n;n;n;n;n;w", desc: "" },
          { jh: "洛阳", loc: "照壁", name: "房玄龄", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n;n;n;w", desc: "" },
          { jh: "洛阳", loc: "钟楼大街", name: "马夫", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;n", desc: "" },
          { jh: "洛阳", loc: "钟楼大街", name: "大宛使者", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;n", desc: "" },
          { jh: "洛阳", loc: "风花酒馆", name: "卫青", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;w", desc: "" },
          { jh: "洛阳", loc: "风花酒馆", name: "方秀珣", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;w", desc: "" },
          { jh: "洛阳", loc: "红云布庄", name: "杨玄素", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;w", desc: "" },
          { jh: "洛阳", loc: "游记货栈", name: "游四海", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;w", desc: "" },
          { jh: "洛阳", loc: "游记货栈", name: "糖人张", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;w", desc: "" },
          { jh: "洛阳", loc: "南城墙", name: "无影卫", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w", desc: "" },
          { jh: "洛阳", loc: "安化门", name: "紫衣追影", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w", desc: "" },
          { jh: "洛阳", loc: "七星角楼", name: "城门禁卫", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w;w", desc: "" },
          { jh: "洛阳", loc: "七星角楼", name: "禁卫统领", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w;w", desc: "" },
          { jh: "洛阳", loc: "延平门", name: "蓝色城门卫兵", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w;w;n;n;n;n", desc: "" },
          { jh: "洛阳", loc: "金光门", name: "血手天魔", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n", desc: "" },
          { jh: "洛阳", loc: "开远门", name: "先锋大将", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;n;n", desc: "" },
          { jh: "洛阳", loc: "狼居胥楼", name: "霍骠姚", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;n;n;n;n;n;n;n", desc: "" },
          { jh: "洛阳", loc: "沙石地", name: "看门人", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;nw;w;sw;s", desc: "" },
          { jh: "洛阳", loc: "石土场", name: "钦官", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;nw;w;sw;s;s", desc: "" },
          { jh: "洛阳", loc: "沙石地", name: "督察官", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;nw;w;sw;s;s;event_1_54329477;n", desc: "" },
          { jh: "洛阳", loc: "沙石地", name: "神秘黑衣人", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;nw;w;sw;s;s;event_1_54329477;n", desc: "" },
          { jh: "洛阳", loc: "城楼密室", name: "李元帅", way: "jh 2;n;n;n;n;n;n;n;n;w;洛阳:城楼^城楼密室", desc: "吃了败仗的元帅逃在此密室，却不知是为了什么。", },
          { jh: "洛阳", loc: "当铺", name: "陈扒皮", way: "jh 2;n;n;n;n;n;n;w", desc: "据洛阳城中最小气的人，号称陈扒皮，意思是见了谁都想赚个小便宜。", },
          { jh: "洛阳", loc: "马厩", name: "马倌", way: "jh 2;n;n;n;n;n;w;n;n;w", desc: "这是是客栈的马倌，正在悉心照料客人的马匹。" },
          { jh: "洛阳", loc: "牡丹园", name: "守园老人", way: "jh 2;n;n;n;n;n;w;s", desc: "守护牡丹园的老人。因为洛阳城地痞不少，所以这守园老人可不轻松。", },
          { jh: "洛阳", loc: "牡丹亭", name: "赛牡丹", way: "jh 2;n;n;n;n;n;w;s;luoyang111_op1", desc: "人称赛牡丹，自然是个美人儿啦~" },
          { jh: "洛阳", loc: "赌坊大门", name: "黑衣打手", way: "jh 2;n;n;n;n;n;w;w", desc: "一身黑衣的打手，脚下功夫还是有点的。" },
          { jh: "洛阳", loc: "赌坊大厅", name: "小偷", way: "jh 2;n;n;n;n;n;w;w;n", desc: "混迹在赌坊里的小偷。" },
          { jh: "洛阳", loc: "雅舍", name: "玉娘", way: "jh 2;n;n;n;n;n;w;w;n;n;n;e", desc: "肌肤如白玉般晶莹的美人，不知道在这赌坊雅舍中等谁？" },
          { jh: "洛阳", loc: "暗道", name: "张逍林", way: "jh 2;n;n;n;n;n;w;w;n;w;get_silver", desc: "来洛阳游玩的游客，被困在银钩赌坊一段时间了。" },
          { jh: "洛阳", loc: "铜驼巷", name: "何九叔", way: "jh 2;n;n;n;n;w", desc: "丐帮5袋弟子，衣著干净，看起来是净衣派的。" },
          { jh: "洛阳", loc: "石街", name: "无赖", way: "jh 2;n;n;n;n;w;event_1_98995501;n", desc: "洛阳城无赖，专靠耍赖撒泼骗钱。" },
          { jh: "洛阳", loc: "酒肆", name: "甄大海", way: "jh 2;n;n;n;n;w;event_1_98995501;n;n;e", desc: "洛阳地痞无赖头领，阴险狡黠，手段极其卑鄙。" },
          { jh: "洛阳", loc: "桃花别院", name: "红娘", way: "jh 2;n;n;n;n;w;s", desc: "一个肥胖的中年妇女，以做媒为生。" },
          { jh: "洛阳", loc: "绣楼", name: "柳小花", way: "jh 2;n;n;n;n;w;s;w", desc: "洛阳武馆馆主的女儿，身材窈窕，面若桃花，十分漂亮。性格却是骄纵任性，大小姐脾气。", },
          { jh: "洛阳", loc: "洛神庙", name: "庙祝", way: "jh 2;n;n;n;w", desc: "洛神庙的庙祝" },
          { jh: "洛阳", loc: "地道", name: "老乞丐", way: "jh 2;n;n;n;w;putuan", desc: "一个穿著破破烂烂的乞丐" },
          { jh: "华山村", loc: "地道", name: "米不为", way: "", desc: "一名青年男子，衣衫上血迹斑斑，奄奄一息的躺在地上。" },
          { jh: "华山村", loc: "华山村村口", name: "泼皮", way: "jh 3", desc: "好吃懒做的无赖，整天无所事事，欺软怕硬。" },
          { jh: "华山村", loc: "松林小径", name: "松鼠", way: "jh 3;n", desc: "一只在松林里觅食的小松鼠。" },
          { jh: "华山村", loc: "神女冢", name: "野兔", way: "jh 3;n;e", desc: "正在吃草的野兔。" },
          { jh: "华山村", loc: "青石街", name: "泼皮头子", way: "jh 3;s", desc: "好吃懒做的无赖，整天无所事事，欺软怕硬。" },
          { jh: "华山村", loc: "碎石路", name: "采花贼", way: "jh 3;s;e", desc: "声名狼藉的采花贼，一路潜逃来到了华山村。" },
          { jh: "华山村", loc: "打铁铺", name: "冯铁匠", way: "jh 3;s;e;n", desc: "这名铁匠看上去年纪也不大，却是一副饱经沧桑的样子。" },
          { jh: "华山村", loc: "银杏广场", name: "村民", way: "jh 3;s;s", desc: "身穿布衣的村民" },
          { jh: "华山村", loc: "杂货铺", name: "方老板", way: "jh 3;s;s;e", desc: "平日行踪有些诡秘，看来杂货铺并不是他真正的营生。" },
          { jh: "华山村", loc: "后院", name: "跛脚汉子", way: "jh 3;s;s;e;s", desc: "衣著普通的中年男子，右脚有些跛。" },
          { jh: "华山村", loc: "车厢", name: "云含笑", way: "jh 3;s;s;e;s;huashancun24_op2", desc: "眸含秋水清波流盼，香娇玉嫩，秀靥艳比花娇，指如削葱根，口如含朱丹，一颦一笑动人心魂。", },
          { jh: "华山村", loc: "石板桥", name: "英白罗", way: "jh 3;s;s;s", desc: "这是华山派弟子，奉师命下山寻找游玩未归的小师妹。" },
          { jh: "华山村", loc: "石板桥", name: "黑狗", way: "jh 3;s;s;s", desc: "一只黑色毛发的大狗。" },
          { jh: "华山村", loc: "田间小路", name: "刘三", way: "jh 3;s;s;s;s", desc: "这一代远近闻名的恶棍，欺男霸女无恶不作" },
          { jh: "华山村", loc: "油菜花地", name: "血尸", way: "jh 3;s;s;s;s;huashancun15_op1", desc: "这是一具极为可怖的男子尸体，只见他周身肿胀，肌肤崩裂，眼角、鼻子、指甲缝里都沁出了鲜血，在这片美丽的花海里，这具尸体的出现实在诡异至极。", },
          { jh: "华山村", loc: "油菜花地", name: "藏剑楼杀手", way: "jh 3;s;s;s;s;huashancun15_op1;event_1_46902878", desc: "极为冷酷无情的男人，手上不知道沾满了多少无辜生命的鲜血。", },
          { jh: "华山村", loc: "练武场", name: "丐帮弟子", way: "jh 3;s;s;s;s;huashancun15_op1;event_1_46902878;;kill?藏剑楼杀手;@藏剑楼杀手的尸体;jh 3;s;s;s;s;s;nw;n;n;n;w;give huashancun_huashancun_fb9", desc: "一名脏兮兮的人，颇为怕事，显得特别畏惧。", },
          { jh: "华山村", loc: "杂草小路", name: "毒蛇", way: "jh 3;s;s;s;s;s", desc: "一条色彩斑斓的毒蛇" },
          { jh: "华山村", loc: "小茅屋", name: "丐帮长老", way: "jh 3;s;s;s;s;s;e", desc: "丐帮长老，衣衫褴褛，满头白发，看起来精神不错。" },
          { jh: "华山村", loc: "山脚", name: "小狼", way: "jh 3;s;s;s;s;s;nw", desc: "出来觅食的小狼" },
          { jh: "华山村", loc: "蜿蜒山径", name: "老狼", way: "jh 3;s;s;s;s;s;nw;n", desc: "在山上觅食的老狼" },
          { jh: "华山村", loc: "清风寨大门", name: "土匪", way: "jh 3;s;s;s;s;s;nw;n;n", desc: "清风寨土匪" },
          { jh: "华山村", loc: "桃花泉", name: "土匪头目", way: "jh 3;s;s;s;s;s;nw;n;n;e", desc: "清风寨土匪头目" },
          { jh: "华山村", loc: "花房", name: "玉牡丹", way: "jh 3;s;s;s;s;s;nw;n;n;e;get_silver", desc: "这是一名看不出年龄的男子，一身皮肤又白又细，宛如良质美玉，竟比闺门处子都要光滑细腻许多。若不是高大身材和脸颊上青色胡茬，他可能会让大多女子汗颜。", },
          { jh: "华山村", loc: "议事厅", name: "刘龟仙", way: "jh 3;s;s;s;s;s;nw;n;n;n;n", desc: "清风寨军事，诡计多端。" },
          { jh: "华山村", loc: "后院", name: "萧独眼", way: "jh 3;s;s;s;s;s;nw;n;n;n;n;n", desc: "清风寨二当家，一次劫镖时被刺伤一目，自此成了独眼龙。", },
          { jh: "华山村", loc: "卧房", name: "刘寨主", way: "jh 3;s;s;s;s;s;nw;n;n;n;n;n;n", desc: "清风寨寨主，对手下极为严厉。" },
          { jh: "华山村", loc: "厢房", name: "受伤的曲右使", way: "jh 3;s;s;s;s;w;get_silver", desc: "他已经深受重伤，半躺在地上。" },
          { jh: "华山村", loc: "小厅", name: "曲姑娘", way: "jh 3;s;s;s;s;w;n", desc: "这是一名身穿翠绿衣裳的少女，皮肤白皙，脸蛋清秀可爱。" },
          { jh: "华山村", loc: "祠堂大门", name: "朱老伯", way: "jh 3;s;s;w", desc: "一位德高望重的老人，须发已经全白。" },
          { jh: "华山村", loc: "厅堂", name: "剑大师", way: "jh 3;s;s;w;n", desc: "宗之潇洒美少年举觞白眼望青天皎如玉树临风前" },
          { jh: "华山村", loc: "厅堂", name: "方寡妇", way: "jh 3;s;s;w;n", desc: "颇有几分姿色的女子，是个寡妇。" },
          { jh: "华山村", loc: "杏林", name: "小男孩", way: "jh 3;w", desc: "扎著双髻的小男孩，正在杏林里跟小伙伴们捉迷藏。" },
          { jh: "华山村", loc: "土地庙门口", name: "村中地痞", way: "jh 3;w;event_1_59520311", desc: "村内地痞，人见人恶。" },
          { jh: "华山村", loc: "庙堂", name: "抠脚大汉", way: "jh 3;w;event_1_59520311;n", desc: "坐在土地面前抠脚的汉子" },
          { jh: "华山村", loc: "地道入口", name: "黑狗", way: "jh 3;w;event_1_59520311;n;n", desc: "凶恶的黑狗，张开的大嘴露出锋利的獠牙。" },
          { jh: "华山村", loc: "楼梯", name: "青衣守卫", way: "jh 3;w;event_1_59520311;n;n;n", desc: "身穿青衣的守卫，武功招式看起来有些眼熟。" },
          { jh: "华山村", loc: "大厅", name: "葛不光", way: "jh 3;w;event_1_59520311;n;n;n;n;n", desc: "四十岁左右的中年男子，颇为好色。" },
          { jh: "华山村", loc: "囚室", name: "米义为", way: "jh 3;w;event_1_59520311;n;n;w;get_silver", desc: "" },
          { jh: "华山村", loc: "茶棚", name: "王老二", way: "jh 3;w;n", desc: "看起来跟普通村民没什么不同，但一双眼睛却透著狡黠。" },
          { jh: "华山", loc: "书房", name: "陶钧", way: "jh 4;n;n;n;n;n;n;n;n;n;n;n;n;e;n;n", desc: "陶钧是岳不群的第七位弟子" },
          { jh: "华山", loc: "老君沟", name: "赵辅徳", way: "jh 4;n;n;n;n;n;n;e;n", desc: "负责打理群仙观的老人" },
          { jh: "华山", loc: "狭长通道", name: "丛云弃", way: "jh 4;n;n;n;n;n;n;n;event_1_91604710;s;s", desc: "华山派传人，封剑羽的师弟。" },
          { jh: "华山", loc: "华山山脚", name: "孙驼子", way: "jh 4", desc: "一面容猥琐可憎，让人不忍直视，脊背高高隆起的驼子。" },
          { jh: "华山", loc: "莎萝坪", name: "吕子弦", way: "jh 4;n", desc: "青衣长袍的书生，前来华山游玩。" },
          { jh: "华山", loc: "云门", name: "女弟子", way: "jh 4;n;n", desc: "她是华山派女弟子，不施脂粉，衣著素雅。" },
          { jh: "华山", loc: "青柯坪", name: "游客", way: "jh 4;n;n;n", desc: "这是一名来华山游玩的中年男子，揹著包裹。" },
          { jh: "华山", loc: "回心石", name: "公平子", way: "jh 4;n;n;n;e", desc: "这是一位仙风道骨的中年道人，早年云游四方，性好任侠，公正无私。" },
          { jh: "华山", loc: "蜿蜒山路", name: "白二", way: "jh 4;n;n;n;n;n;n", desc: "山贼头目，看起来很强壮。" },
          { jh: "华山", loc: "蜿蜒山路", name: "山贼", way: "jh 4;n;n;n;n;n;n", desc: "拦路抢劫的山贼" },
          { jh: "华山", loc: "群仙观", name: "李铁嘴", way: "jh 4;n;n;n;n;n;n;e", desc: "李铁嘴是个买卜算卦的江湖术士，兼代客写书信、条幅。" },
          { jh: "华山", loc: "老君沟", name: "赵辅德", way: "jh 4;n;n;n;n;n;n;e;n", desc: "" },
          { jh: "华山", loc: "上天梯", name: "猿猴", way: "jh 4;n;n;n;n;n;n;n", desc: "华山上的猿猴，时常骚扰过路人" },
          { jh: "华山", loc: "崎岖山路", name: "剑宗弟子", way: "jh 4;n;n;n;n;n;n;n;event_1_91604710", desc: "华山剑宗弟子" },
          { jh: "华山", loc: "狭长通道", name: "从云弃", way: "jh 4;n;n;n;n;n;n;n;event_1_91604710;s;s", desc: "" },
          { jh: "华山", loc: "潭畔草地", name: "尘无剑", way: "jh 4;n;n;n;n;n;n;n;event_1_91604710;s;s;s", desc: "他是华山控剑宗派的第一高手。" },
          { jh: "华山", loc: "悬崖石洞", name: "封剑羽", way: "jh 4;n;n;n;n;n;n;n;event_1_91604710;s;s;s;s;e", desc: "他是华山控剑宗派的第一高手。" },
          { jh: "华山", loc: "松林石径", name: "大松鼠", way: "jh 4;n;n;n;n;n;n;n;n", desc: "一只在松林里觅食的小松鼠。" },
          { jh: "华山", loc: "朝阳峰山道", name: "英黑罗", way: "jh 4;n;n;n;n;n;n;n;n;n", desc: "英白罗是岳不群的第八位弟子" },
          { jh: "华山", loc: "长空栈道", name: "魔教喽喽", way: "jh 4;n;n;n;n;n;n;n;n;n;e", desc: "日月神教小喽喽喽" },
          { jh: "华山", loc: "临渊石台", name: "史大哥", way: "jh 4;n;n;n;n;n;n;n;n;n;e;n", desc: "" },
          { jh: "华山", loc: "临渊石台", name: "卢大哥", way: "jh 4;n;n;n;n;n;n;n;n;n;e;n", desc: "日月神教教众" },
          { jh: "华山", loc: "草丛小路", name: "史老三", way: "jh 4;n;n;n;n;n;n;n;n;n;e;n;n", desc: "日月神教教众" },
          { jh: "华山", loc: "竹林", name: "闵老二", way: "jh 4;n;n;n;n;n;n;n;n;n;e;n;n;n", desc: "日月神教教众" },
          { jh: "华山", loc: "密洞", name: "藏剑楼刺客", way: "jh 4;n;n;n;n;n;n;n;n;n;e;n;n;n;e;s;event_1_11292200", desc: "一名手持利刃身穿夜行衣的男子，眼神极为狠厉无情。", },
          { jh: "华山", loc: "空地", name: "戚老四", way: "jh 4;n;n;n;n;n;n;n;n;n;e;n;n;n;n", desc: "日月神教教众" },
          { jh: "华山", loc: "小木屋", name: "葛长老", way: "jh 4;n;n;n;n;n;n;n;n;n;e;n;n;n;n;e", desc: "日月神教教众" },
          { jh: "华山", loc: "华山之巅", name: "小林子", way: "jh 4;n;n;n;n;n;n;n;n;n;e;n;n;n;n;n", desc: "气宗传人小林子，实力已是非同凡响。" },
          { jh: "华山", loc: "前院", name: "高算盘", name_new: "陈飞鱼", way: "jh 4;n;n;n;n;n;n;n;n;n;n", desc: "此人整天拿著算盘，身材高大，长得很胖，但别看他其貌不扬，他在同门中排行第五，是华山派年轻一代中的好手。", },
          { jh: "华山", loc: "正气堂", name: "岳掌门", name_new: "许秋雨", way: "jh 4;n;n;n;n;n;n;n;n;n;n;n", desc: "华山掌门，他今年四十多岁，素以温文尔雅著称。", },
          { jh: "华山", loc: "后院", name: "舒奇", way: "jh 4;n;n;n;n;n;n;n;n;n;n;n;n", desc: "华山派小弟子" },
          { jh: "华山", loc: "花园", name: "梁师兄", name_new: "梁迎阳", way: "jh 4;n;n;n;n;n;n;n;n;n;n;n;n;e", desc: "他就是华山排行第三的弟子。" },
          { jh: "华山", loc: "长廊", name: "林师弟", way: "jh 4;n;n;n;n;n;n;n;n;n;n;n;n;e;s", desc: "林师弟是华山众最小的一个弟子。" },
          { jh: "华山", loc: "卧房", name: "小尼姑", way: "jh 4;n;n;n;n;n;n;n;n;n;n;n;n;e;s;s", desc: "一个娇俏迷人的小尼姑。" },
          { jh: "华山", loc: "凛然轩", name: "劳师兄", way: "jh 4;n;n;n;n;n;n;n;n;n;n;n;n;n", desc: "" },
          { jh: "华山", loc: "寝室", name: "宁女侠", way: "jh 4;n;n;n;n;n;n;n;n;n;n;n;n;n;get_silver", desc: "华山派掌门的夫人，眉宇间还少不了年轻时的英气。", },
          { jh: "华山", loc: "厨房", name: "小猴", way: "jh 4;n;n;n;n;n;n;n;n;n;n;n;n;w", desc: "这是一只调皮的小猴子，虽是畜牲，却喜欢模仿人样。" },
          { jh: "华山", loc: "练武场", name: "施剑客", way: "jh 4;n;n;n;n;n;n;n;n;n;n;w", desc: "同门中排行第四，是华山派年轻一代中的好手。" },
          { jh: "华山", loc: "库房入口", name: "华山弟子", way: "jh 4;n;n;n;n;n;n;n;n;n;n;w;event_1_30014247", desc: "华山派门下的第子" },
          { jh: "华山", loc: "地道入口", name: "蒙面剑客", way: "jh 4;n;n;n;n;n;n;n;n;n;n;w;event_1_30014247;s;s;s;s", desc: "手握长剑的蒙面人" },
          { jh: "华山", loc: "密室", name: "黑衣人", way: "jh 4;n;n;n;n;n;n;n;n;n;n;w;event_1_30014247;s;s;s;s;s;e", desc: "戴著神秘的黑衣人，压低的帽簷遮住的他的面容。", },
          { jh: "华山", loc: "玉女祠", name: "岳师妹", way: "jh 4;n;n;n;n;n;n;n;n;w;s", desc: "华山派掌门的爱女。她看起来十多岁，容貌秀丽，虽不是绝代美人，也别有一番可人之处。", },
          { jh: "华山", loc: "思过崖", name: "六猴儿", way: "jh 4;n;n;n;n;n;n;n;n;w;w", desc: "六猴儿身材很瘦，又长的尖嘴猴腮的，但别看他其貌不扬，他在同门中排行第六，是华山派年轻一代中的好手。", },
          { jh: "华山", loc: "山洞", name: "令狐大师哥", way: "jh 4;n;n;n;n;n;n;n;n;w;w;n", desc: "他是华山派的大师兄，英气逼人。" },
          { jh: "华山", loc: "石壁", name: "风老前辈", name_new: "独孤传人", way: "jh 4;n;n;n;n;n;n;n;n;w;w;n;get_xiangnang2", desc: "这便是当年名震江湖的华山名宿。他身著青袍，神气抑郁脸如金纸。身材瘦长，眉宇间一直笼罩著一股淡淡的忧伤神色。", },
          { jh: "华山", loc: "观瀑台", name: "豪客", way: "jh 4;n;n;w", desc: "一名满脸彪悍之色的江湖豪客" },
          { jh: "扬州", loc: "飞雪堂", name: "书生", way: "jh 5;n;n;n;n;n;e;n;e;n;w;n;n", desc: "一个摇头晃脑正在吟诗的书生。" },
          { jh: "扬州", loc: "扬州港", name: "船运东主", way: "jh 5;n;n;n;n;n;n;n;n;n;n;ne", desc: "此人一身黝黑的皮肤，几道深深的岁月的沟壑在他脸上烙下了印记。深邃凹进的眼眶中显露出干练的眼神。显露出不凡的船上阅历。", },
          { jh: "扬州", loc: "醉仙楼大厅", name: "少林恶僧", way: "jh 5;n;n;n;n;n;n;e", desc: "因嗜酒如命，故从少林叛出，顺便盗取些许经书以便拿来换酒。", },
          { jh: "扬州", loc: "太平桥", name: "白胡子老头", way: "jh 5;n;w", desc: "一位精神矍铄的老人，额下有寸许长的白须。在扬州支了个糖画小摊维持生计，身边的铜锅里面熬著糖液，咕嘟咕嘟冒著大泡，香气四溢。", },
          { jh: "扬州", loc: "太平桥", name: "姜子牙", way: "jh 5;n;w", desc: "身材高大，面容清秀，额头宽阔，目光犀利。他常穿著一身简朴的道袍，手持一把看似普通但实则包含玄机的长剑。头发自然散落在肩上，整体气质给人一种淡然、高远但又不失威严的感觉。", },
          { jh: "扬州", loc: "小东门桥", name: "斗笠老人", way: "jh 5;n;e", desc: "头戴斗笠，身形佝偻的老者，但似乎武功高强。" },
          { jh: "扬州", loc: "安定门", name: "官兵", way: "jh 5", desc: "守城的官兵，相貌可长得不好瞧。" },
          { jh: "扬州", loc: "十里长街3", name: "大黑马", way: "jh 5;n;n", desc: "一匹受惊的大黑马，一路狂奔到了闹市街头。" },
          { jh: "扬州", loc: "小宝斋", name: "双儿", way: "jh 5;n;n;e", desc: "柔善良，善解人意，乖巧聪慧，体贴贤惠，清秀可人，腼腆羞涩，似乎男人喜欢的品质都集中在她身上了。", },
          { jh: "扬州", loc: "十里长街2", name: "黑狗子", way: "jh 5;n;n;n", desc: "扬州街头人见人恶的地痞，嘴角一颗黑色痦子，看起来极为可憎。" },
          { jh: "扬州", loc: "武馆大门", name: "武馆护卫", way: "jh 5;n;n;n;e", desc: "一名武馆护卫，专门对付那些想混进来闹事的人。" },
          { jh: "扬州", loc: "武馆大院", name: "武馆弟子", way: "jh 5;n;n;n;e;n", desc: "在武馆拜师学艺的弟子，看来还是会些基本功。" },
          { jh: "扬州", loc: "武馆大厅", name: "方不为", way: "jh 5;n;n;n;e;n;n", desc: "武馆管家，馆中大小事务都需要向他禀报。" },
          { jh: "扬州", loc: "长廊", name: "范先生", way: "jh 5;n;n;n;e;n;n;n", desc: "武馆账房先生，为人极为谨慎，账房钥匙通常带在身上。" },
          { jh: "扬州", loc: "书房", name: "古三通", way: "jh 5;n;n;n;e;n;n;n;e", desc: "一名看起来和蔼的老人，手里拿著一个旱烟袋，据说跟馆主颇有渊源。" },
          { jh: "扬州", loc: "卧室", name: "陈有德", way: "jh 5;n;n;n;e;n;n;n;n", desc: "这就是武馆馆主，紫金脸庞，面带威严，威武有力，站在那里就象是一座铁塔。", },
          { jh: "扬州", loc: "休息室", name: "神秘客", way: "jh 5;n;n;n;e;n;n;w;n;get_silver", desc: "一名四十岁左右的中年男子，脸上一道刀疤给他平添了些许沧桑。" },
          { jh: "扬州", loc: "练武场", name: "王教头", way: "jh 5;n;n;n;e;n;w", desc: "一名武馆内的教头，专门负责教新手武功。" },
          { jh: "扬州", loc: "十里长街1", name: "游客", way: "jh 5;n;n;n;n", desc: "来扬州游玩的游客，背上的包裹看起来有些重。" },
          { jh: "扬州", loc: "中央广场", name: "空空儿", way: "jh 5;n;n;n;n;n", desc: "一个满脸风霜之色的老乞丐。" },
          { jh: "扬州", loc: "中央广场", name: "艺人", way: "jh 5;n;n;n;n;n", desc: "一名四海为家的卖艺人，满脸沧桑。" },
          { jh: "扬州", loc: "至止堂", name: "朱先生", way: "jh 5;n;n;n;n;n;e;n;n;n", desc: "这就是当今大儒朱先生。" },
          { jh: "扬州", loc: "庭院", name: "管家", way: "jh 5;n;n;n;n;n;e;n;n", desc: "一名瘦小的中年男子走了出来，颏下留著短须，外貌甚是精明，显然就是管家了。" },
          { jh: "扬州", loc: "十里长街4", name: "马夫人", way: "jh 5;n;n;n;n;n;n", desc: "一名体格魁梧的妇人，看起来极为彪悍。" },
          { jh: "扬州", loc: "十里长街4", name: "润玉", way: "jh 5;n;n;n;n;n;n", desc: "买花少女，手中的花篮里装著时令鲜花。" },
          { jh: "扬州", loc: "十里长街4", name: "流氓", way: "jh 5;n;n;n;n;n;n", desc: "扬州城里的流氓，经常四处游荡，调戏妇女。" },
          { jh: "扬州", loc: "醉仙楼大厅", name: "醉仙楼伙计", way: "jh 5;n;n;n;n;n;n;e", desc: "这是醉仙楼伙计，看起来有些功夫。" },
          { jh: "扬州", loc: "楼梯", name: "丰不为", way: "jh 5;n;n;n;n;n;n;e;n", desc: "一个常在酒楼混吃混喝的地痞，不知酒店老板为何不将他逐出。" },
          { jh: "扬州", loc: "二楼大厅", name: "张总管", way: "jh 5;n;n;n;n;n;n;e;n;n", desc: "一名中年男子，目露凶光。" },
          { jh: "扬州", loc: "芍药宴厅", name: "胡神医", way: "jh 5;n;n;n;n;n;n;e;n;n;e", desc: "这就是江湖中有名的胡神医，看起来很普通。" },
          { jh: "扬州", loc: "牡丹宴厅", name: "胖商人", way: "jh 5;n;n;n;n;n;n;e;n;n;n", desc: "一名衣著华丽，体态臃肿，手脚看起来极短的中年男子。" },
          { jh: "扬州", loc: "观景台", name: "冼老板", way: "jh 5;n;n;n;n;n;n;e;n;n;n;n", desc: "醉仙楼老板，能将这家祖传老店买下来，其来历应该没那么简单。", },
          { jh: "扬州", loc: "芙蓉宴厅", name: "计无施", way: "jh 5;n;n;n;n;n;n;e;n;n;w", desc: "一名剑眉星目的白衣剑客。" },
          { jh: "扬州", loc: "十里长街5", name: "马员外", way: "jh 5;n;n;n;n;n;n;n", desc: "马员外是扬州有名的善人，看起来有点郁郁不乐。" },
          { jh: "扬州", loc: "富春茶社", name: "茶社伙计", way: "jh 5;n;n;n;n;n;n;n;e", desc: "提著茶壶的伙计，目露精光，看起来不简单。" },
          { jh: "扬州", loc: "富春茶社", name: "云九天", way: "jh 5;n;n;n;n;n;n;n;e", desc: "他是大旗门的掌刑长老，最是严厉不过。" },
          { jh: "扬州", loc: "雅舍", name: "柳文君", way: "jh 5;n;n;n;n;n;n;n;e;get_silver", desc: "茶社老板娘，扬州闻名的才女，姿色娇美，精通音律，善弹琴。许多文人墨客慕名前来，茶社总是客满为患。", },
          { jh: "扬州", loc: "十里长街6", name: "毒蛇", way: "jh 5;n;n;n;n;n;n;n;n", desc: "一条毒蛇草丛窜出，正昂首吐信虎视眈眈地盯著你。" },
          { jh: "扬州", loc: "东关街", name: "小混混", way: "jh 5;n;n;n;n;n;n;n;n;n;e", desc: "扬州城里的小混混，整天无所事事，四处游荡。" },
          { jh: "扬州", loc: "镇淮门 ", name: "北城门士兵", way: "jh 5;n;n;n;n;n;n;n;n;n;n", desc: "看守城门的士兵" },
          { jh: "扬州", loc: "禅智寺山门", name: "扫地僧", way: "jh 5;n;n;n;n;n;n;n;n;n;w;w;n", desc: "一名看起来很普通的僧人" },
          { jh: "扬州", loc: "昆丘台", name: "张三", way: "jh 5;n;n;n;n;n;n;n;n;n;w;w;n;e", desc: "看起来很邋遢的道士，似乎有些功夫。" },
          { jh: "扬州", loc: "吕祖照面池", name: "火工僧", way: "jh 5;n;n;n;n;n;n;n;n;n;w;w;n;n;n;e", desc: "禅智寺中专做杂事的火工僧，身体十分地强壮" },
          { jh: "扬州", loc: "竹西亭", name: "柳碧荷", way: "jh 5;n;n;n;n;n;n;n;n;n;w;w;n;w", desc: "来禅智寺上香的女子，颇有几分姿色。" },
          { jh: "扬州", loc: "虹桥", name: "恶丐", way: "jh 5;n;n;n;n;n;n;n;n;w", desc: "看守城门的士兵" },
          { jh: "扬州", loc: "草河北街", name: "顽童", way: "jh 5;n;n;n;n;n;n;n;n;w;w", desc: "一个顽皮的小童。" },
          { jh: "扬州", loc: "魁星阁", name: "书生", way: "jh 5;n;n;n;n;n;n;n;n;w;w;n", desc: "一个摇头晃脑正在吟诗的书生。" },
          { jh: "扬州", loc: "阁楼", name: "李丽君", way: "jh 5;n;n;n;n;n;n;n;n;w;w;n;get_silver", desc: "女扮男装的女子，容颜清丽，孤身一身住在魁星阁的阁楼上。", },
          { jh: "扬州", loc: "浅月楼", name: "青衣门卫", way: "jh 5;n;n;n;n;n;n;n;n;w;w;w", desc: "浅月楼门口的侍卫。" },
          { jh: "扬州", loc: "浅月楼大厅", name: "玉娇红", way: "jh 5;n;n;n;n;n;n;n;n;w;w;w;s", desc: "浅月楼的老板娘，看似年不过三十，也是一个颇有姿色的女子。她抬起眼来，黛眉轻扫，红唇轻启，嘴角勾起的那抹弧度仿佛还带著丝丝嘲讽。当她眼波一转，流露出的风情似可让人忘记一切。红色的外袍包裹著洁白细腻的肌肤，她每走一步，都要露出细白水嫩的小腿。脚上的银铃也随著步伐轻轻发出零零碎碎的声音。", },
          { jh: "扬州", loc: "二楼走道", name: "青楼小厮", way: "jh 5;n;n;n;n;n;n;n;n;w;w;w;s;e", desc: "这是一个青楼的小侍从，不过十五六岁。" },
          { jh: "扬州", loc: "弦羽阁", name: "苏小婉", way: "jh 5;n;n;n;n;n;n;n;n;w;w;w;s;e;e;s;s;e;e;s;s;s", desc: "名满天下的第一琴姬，苏小婉是那种文人梦中的红颜知己。这样美貌才智具备的女子，怕是世间几百年才能出现一位。曾有人替她惋惜，说如若她是一大家闺秀，或许也能寻得一志趣相投之人，也会有“赌书消得泼茶香”的美谈。即使她只是一贫家女子，不读书亦不学艺，纵使是貌胜西子，或许仍可安稳一生。然而命运时常戏弄人，偏偏让那如花美眷落入淤泥，误了那似水流年。本想为一人盛开，却被众人窥去了芳颜。可她只是微微一笑，说道：『寻一平凡男子，日出而作日落而息，相夫教子，如湮没于历史烟尘中的所有女子一般。那样的生活，不是我做不到，只是不愿意。没有燃烧过的，只是一堆黑色的粉末，哪里能叫做烟火？』", },
          { jh: "扬州", loc: "浅月楼偏厅", name: "赵明诚", way: "jh 5;n;n;n;n;n;n;n;n;w;w;w;s;w", desc: "：当朝仆射，也是一代名士，致力于金石之学，幼而好之，终生不渝。", },
          { jh: "扬州", loc: "广陵当铺", name: "唐老板", way: "jh 5;n;n;n;n;n;n;n;w", desc: "广陵当铺老板，肩宽体壮，看起来颇为威严。" },
          { jh: "扬州", loc: "武庙", name: "刘步飞", way: "jh 5;n;n;n;n;n;n;w", desc: "龙门镖局的镖师，正在武庙里祭拜。" },
          { jh: "扬州", loc: "通泗桥", name: "赤练仙子", way: "jh 5;n;n;n;n;n;w", desc: "她生得极为美貌，但冰冷的目光让人不寒而栗。" },
          { jh: "扬州", loc: "衙门大门", name: "衙役", way: "jh 5;n;n;n;n;n;w;w;n", desc: "扬州官衙衙役，看起来一脸疲态。" },
          { jh: "扬州", loc: "正堂", name: "程大人", way: "jh 5;n;n;n;n;n;w;w;n;n;n", desc: "扬州知府，脸色阴沉，微有怒色，" },
          { jh: "扬州", loc: "内室", name: "楚雄霸", way: "jh 5;n;n;n;n;n;w;w;n;n;n;get_silver", desc: "江湖有名的江洋大盗，五短身材，貌不惊人。" },
          { jh: "扬州", loc: "天井", name: "公孙岚", way: "jh 5;n;n;n;n;n;w;w;n;n;w", desc: "扬州官衙有名的神捕，据说曾经抓获不少江湖大盗。" },
          { jh: "扬州", loc: "玉器店", name: "白老板", way: "jh 5;n;n;n;n;n;w;w;s;s", desc: "玉器店老板，对珍宝古玩颇为熟稔。" },
          { jh: "扬州", loc: "彦明钱庄", name: "小飞贼", way: "jh 5;n;n;n;n;w", desc: "一个年级尚幼的飞贼。" },
          { jh: "扬州", loc: "彦明钱庄", name: "账房先生", way: "jh 5;n;n;n;n;w", desc: "满脸精明的中年男子，手里的算盘拨的飞快。" },
          { jh: "扬州", loc: "银库", name: "飞贼", way: "jh 5;n;n;n;n;w;yangzhou16_op1", desc: "一身黑色劲装，黑巾蒙面，眼露凶光。" },
          { jh: "扬州", loc: "黄记杂货", name: "黄掌柜", way: "jh 5;n;n;n;w", desc: "杂货铺老板，看似慵懒，实则精明过人。" },
          { jh: "扬州", loc: "铁匠铺", name: "铁匠", way: "jh 5;n;n;w", desc: "看起来很强壮的中年男子" },
          { jh: "扬州", loc: "花店", name: "花店伙计", way: "jh 5;n;w;w;n", desc: "花店的伙计，正忙碌地给花淋水。" },
          { jh: "丐帮", loc: "树洞内部", name: "裘万家", way: "jh 6", desc: "这是位衣著邋塌，蓬头垢面的丐帮二袋弟子。" },
          { jh: "丐帮", loc: "树洞内部", name: "左全", way: "jh 6", desc: "这是位豪爽大方的丐帮七袋弟子，看来是个北地豪杰。" },
          { jh: "丐帮", loc: "树洞下", name: "梁长老", way: "jh 6;event_1_98623439", desc: "梁长老是丐帮出道最久，武功最高的长老，在武林中享名已久。丐帮武功向来较强，近来梁长老一力整顿，更是蒸蒸日上。", },
          { jh: "丐帮", loc: "暗道", name: "藏剑楼统领", way: "jh 6;event_1_98623439;ne;n", desc: "此人似乎是这群人的头目，正在叮嘱手下办事。" },
          { jh: "丐帮", loc: "屋角边", name: "何不净", way: "jh 6;event_1_98623439;ne;n;ne;ne", desc: "这是位衣著邋塌，蓬头垢面的丐帮七袋弟子。" },
          { jh: "丐帮", loc: "谷场槐树边", name: "马俱为", way: "jh 6;event_1_98623439;ne;n;ne;ne;ne", desc: "这是位武艺精强，却沉默寡言的丐帮八袋弟子。", },
          { jh: "丐帮", loc: "沙丘小洞", name: "余洪兴", way: "jh 6;event_1_98623439;ne;n;ne;ne;ne;event_1_97428251", desc: "这是位笑眯眯的丐帮八袋弟子，生性多智，外号小吴用。", },
          { jh: "丐帮", loc: "暗道", name: "莫不收", way: "jh 6;event_1_98623439;ne;ne", desc: "这是位衣著邋塌，蓬头垢面的丐帮三袋弟子。" },
          { jh: "丐帮", loc: "秘密通道", name: "藏剑楼探子", way: "jh 6;event_1_98623439;ne;ne;ne;event_1_16841370", desc: "看上去身手极为敏捷，似乎在此处调查著什么。", },
          { jh: "丐帮", loc: "储藏室", name: "何一河", name_new: "何宏生", way: "jh 6;event_1_98623439;s", desc: "他是丐帮新近加入的弟子，可也一步步升到了五袋。他长的极其丑陋，脸上坑坑洼洼。", },
          { jh: "丐帮", loc: "密室", name: "解九风", way: "jh 6;event_1_98623439;s;w", desc: "如果说洪七公是丐帮的食神，那么九风就是丐帮的酒圣，论酒量，无人能比，似乎从来没有人看到他喝醉过，也被称为“解酒疯”。", },
          { jh: "乔阴县", loc: "树王坟", name: "朦胧鬼影", way: "jh 3;s;s;s;;kill?黑狗;@黑狗的尸体;jh 7;event_1_57435070;s;s;s;s;event_1_65599392", desc: "一个高大的身影，看起来像是个人，不过。。。。", },
          { jh: "乔阴县", loc: "树王坟", name: "县城官兵", way: "", desc: "这是个正在执行公务的县城官兵，虽然和许多武林人物比起来，官兵们的武功实在稀松平常，但是他们是有组织、有纪律的战士，谁也不轻易地招惹他们。", },
          { jh: "乔阴县", loc: "街道", name: "琵琶鬼", way: "jh 3;s;s;s;;kill?黑狗;@黑狗的尸体;jh 7;event_1_57435070;s;s;s;s;s;s;s;sw", desc: "一个风尘仆仆的侠客。。" },
          { jh: "乔阴县", loc: "乔阴县城北门", name: "孤魂野鬼", way: "jh 3;s;s;s;;kill?黑狗;@黑狗的尸体;jh 7;event_1_57435070", desc: "一个飘忽不定的朦胧身影。" },
          { jh: "乔阴县", loc: "石板空地", name: "藏剑楼学者", way: "jh 7;s;s;s;w", desc: "此人文质彬彬，手持一本书册，正不断的翻阅似乎想在里面找到想要的答案。", },
          { jh: "乔阴县", loc: "休息室", name: "藏剑楼长老", way: "jh 7;s;s;s;s;s;s;e;n;n;e", desc: "一名谈吐不凡的中年男子，备受手下尊崇。" },
          { jh: "乔阴县", loc: "乔阴县城北门", name: "守城官兵", way: "jh 7", desc: "这是个正在这里站岗的守城官兵，虽然和许多武林人物比起来，官兵们的武功实在稀松平常，但是他们是有组织、有纪律的战士，谁也不轻易地招惹他们。", },
          { jh: "乔阴县", loc: "福林大街", name: "陆得财", way: "jh 7;s", desc: "陆得财是一个浑身脏兮兮的老丐，一副无精打采要死不活的样子，可是武林中人人都识得他身上打著二十三个结的皮酒囊，这不但是「花紫会」龙头的信物，更是名镇漠南的「黑水伏蛟」独门兵器，只不过陆得财行踪诡密，据说各处随时都有七、八的他的替身在四处活动，所以你也很难确定眼前这个陆得财到底是不是真的。", },
          { jh: "乔阴县", loc: "福林大街", name: "卖饼大叔", way: "jh 7;s", desc: "一个相貌朴实的卖饼大叔，憨厚的脸上挂著和蔼的笑容。" },
          { jh: "乔阴县", loc: "福林大街", name: "卖包子的", way: "jh 7;s;s;s", desc: "这个卖包子的小贩对你微微一笑，说道：热腾腾的包子，来一笼吧" },
          { jh: "乔阴县", loc: "树王坟内部", name: "怪人", way: "jh 7;s;s;s;s;event_1_65599392;w", desc: "体型与小孩一般，脸上却满是皱纹，头发已经掉光。" },
          { jh: "乔阴县", loc: "福林酒楼", name: "汤掌柜", way: "jh 7;s;s;s;s;s;s;e", desc: "汤掌柜是这家大酒楼的主人，别看他只是一个小小的酒楼老板，乔阴县境内除了知县老爷以外，恐怕就属他最财大势大。", },
          { jh: "乔阴县", loc: "福林酒楼", name: "武官", way: "jh 7;s;s;s;s;s;s;e", desc: "一位相貌威武的武官，独自一个人站在这里发呆，似乎正有什么事困扰著他。" },
          { jh: "乔阴县", loc: "福林酒楼", name: "家丁", way: "jh 7;s;s;s;s;s;s;e;n", desc: "一个穿著家人服色的男子，必恭必敬地垂手站在一旁。" },
          { jh: "乔阴县", loc: "福林酒楼", name: "贵公子", way: "jh 7;s;s;s;s;s;s;e;n", desc: "一个相貌俊美的年轻贵公子正优雅地欣赏著窗外的景物。" },
          { jh: "乔阴县", loc: "福林酒楼", name: "酒楼守卫", way: "jh 7;s;s;s;s;s;s;e;n;n", desc: "一个身穿蓝布衣的人，从他锐利的眼神跟神情，显然是个练家子。", },
          { jh: "乔阴县", loc: "曲桥", name: "书生", way: "jh 7;s;s;s;s;s;s;s;s;e", desc: "一个看起来相当斯文的书生，正拿著一本书摇头晃脑地读著。" },
          { jh: "乔阴县", loc: "曲桥", name: "官家小姐", way: "jh 7;s;s;s;s;s;s;s;s;e;n;e", desc: "一个看起来像是有钱人家的女子，正在这里游湖。" },
          { jh: "乔阴县", loc: "曲桥", name: "丫鬟", way: "jh 7;s;s;s;s;s;s;s;s;e;n;e", desc: "一个服侍有钱人家小姐的丫鬟，正无聊地玩弄著衣角。" },
          { jh: "乔阴县", loc: "曼云台", name: "骆云舟", way: "jh 7;s;s;s;s;s;s;s;s;e;n;e;s;e", desc: "骆云舟本是世家公子，因喜爱诗酒剑法，不为家族中人所偏爱。因此他年少离家，常年在外漂泊，时至今日，倒是武有所成，在文学的造诣上，也是深不可测了。", },
          { jh: "乔阴县", loc: "火龙将军庙", name: "干瘪老太婆", way: "jh 7;s;s;s;s;s;s;s;sw;w", desc: "这个老太婆怀中抱了个竹篓，似乎在卖什么东西，也许你可以跟她问问价钱？", },
          { jh: "乔阴县", loc: "火龙将军庙", name: "妇人", way: "jh 7;s;s;s;s;s;s;s;sw;w;n", desc: "一个衣饰华丽的妇人正跪在这里虔诚地膜拜著。" },
          { jh: "峨眉山", loc: "钓鱼山脚", name: "先锋敌将", way: "jh 8;ne;e;e;e", desc: "攻城先锋大将，长期毫无进展的战事让他难掩烦躁。" },
          { jh: "峨眉山", loc: "军械库", name: "乞利", way: "jh 8;ne;e;e;e;n;n;n;n;n;e;e;n", desc: "攻城大将，曾是江湖上一等一的好手。" },
          { jh: "峨眉山", loc: "打坐室", name: "文碧师太", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill emei_shoushan;;n;;n;n;n;w;n;n;n;e;e;n;w", desc: "她是峨眉派的“文”辈弟子。", },
          { jh: "峨眉山", loc: "打坐室", name: "静火师太", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill emei_shoushan;;n;;n;n;n;w;n;n;n;w;w;n;e", desc: "她是峨眉派的“静”辈弟子。", },
          { jh: "峨眉山", loc: "打坐室", name: "静鸿师太", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill emei_shoushan;;n;;n;n;n;w;n;n;n;w;w;n;n;e", desc: "她是峨眉派的“静”辈弟子。", },
          { jh: "峨眉山", loc: "打坐室", name: "静能师太", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill emei_shoushan;;n;;n;n;n;w;n;n;n;w;w;s;w", desc: "她是峨眉派的“静”辈弟子。", },
          { jh: "峨眉山", loc: "打坐室", name: "文虹师太", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill emei_shoushan;;n;;n;n;n;w;n;n;n;e;e;s;s;w", desc: "她是峨眉派的“文”辈弟子。", },
          { jh: "峨眉山", loc: "峨眉山门", name: "赵灵剑", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill emei_shoushan;;n;;n;n;n;w;n;n;n;e;e;n;e", desc: "她是峨嵋派的第四代俗家弟子。", },
          { jh: "峨眉山", loc: "打坐室", name: "文好师太", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill emei_shoushan;;n;;n;n;n;w;n;n;n;e;e;n;n;w", desc: "她是峨眉派的“文”辈弟子。", },
          { jh: "峨眉山", loc: "俗家弟子房", name: "李明霞", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill emei_shoushan;;n;;n;n;n;w;n;n;n;e;e;s;e", desc: "她是峨嵋派的第四代俗家弟子。", },
          { jh: "峨眉山", loc: "接引殿", name: "静无师太", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill emei_shoushan;;n;;n;n;n;w;n;n;n;n", desc: "她是峨眉派的“静”辈弟子。", },
          { jh: "峨眉山", loc: "打坐室", name: "静白师太", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill emei_shoushan;;n;;n;n;n;w;n;n;n;w;w;n;w", desc: "她是峨眉派的“静”辈弟子。", },
          { jh: "峨眉山", loc: "后殿", name: "静松师太", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill emei_shoushan;;n;;n;n;n;w;n;n;n;n;n", desc: "她是峨眉派的“静”辈弟子。", },
          { jh: "峨眉山", loc: "俗家弟子房", name: "苏寒清", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill emei_shoushan;;n;;n;n;n;w;n;n;n;e;e;s;s;e", desc: "她是峨嵋派的第四代俗家弟子。", },
          { jh: "峨眉山", loc: "打坐室", name: "静身师太", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill emei_shoushan;;n;;n;n;n;w;n;n;n;w;w;s;s;w", desc: "她是峨眉派的“静”辈弟子。", },
          { jh: "峨眉山", loc: "打坐室", name: "静法师太", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill emei_shoushan;;n;;n;n;n;w;n;n;n;w;w;s;e", desc: "她是峨眉派的“静”辈弟子。", },
          { jh: "峨眉山", loc: "打坐室", name: "静尼师太", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill emei_shoushan;;n;;n;n;n;w;n;n;n;w;w;s;s;e", desc: "她是峨眉派的“静”辈弟子。", },
          { jh: "峨眉山", loc: "峨眉后山", name: "藏剑楼剑客", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill emei_shoushan;;n;;n;n;n;w;n;n;n;n;n;n;n;n;n;n", desc: "此人手持长剑，正虎视眈眈的留神周围，准备伺机而动。", },
          { jh: "峨眉山", loc: "打坐室", name: "文海师太", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill emei_shoushan;;n;;n;n;n;w;n;n;n;e;e;s;w", desc: "她是峨眉派的“文”辈弟子。", },
          { jh: "峨眉山", loc: "护国门", name: "金狼大将", way: "jh 8;ne;e;e;e;n;n;n;n;n", desc: "攻城大将，曾是江湖上一等一的好手。" },
          { jh: "峨眉山", loc: "钓鱼山脚", name: "先锋军士", way: "jh 8;ne;e;e;e", desc: "攻城大军的先锋军士，满脸凶狠，却也掩饰不住疲乏之色。" },
          { jh: "峨眉山", loc: "敌军大营", name: "耶律霸", way: "jh 8;ne;e;e;e;e", desc: "辽国皇族后裔，蒙古宰相耶律楚材之子，金狼军主帅。他骁勇善战，精通兵法，凭借著一手堪可开山破岳的好斧法杀得武林中人无人可挡闻之色变。视天波杨门为心腹之患欲处之而后快。", },
          { jh: "峨眉山", loc: "东新城门", name: "赤豹死士", way: "jh 8;ne;e;e;e;n", desc: "攻城大军的赤豹营死士，战力蛮横，重盔重甲，防御极好。" },
          { jh: "峨眉山", loc: "城南-字墙", name: "守城军士", way: "jh 8;ne;e;e;e;n;n", desc: "守城的军士，英勇强悍，不畏生死。" },
          { jh: "峨眉山", loc: "镇西门", name: "黑鹰死士", way: "jh 8;ne;e;e;e;n;n;n", desc: "攻城大军的黑鹰营死士，出手极准。" },
          { jh: "峨眉山", loc: "护国门", name: "金狼死士", way: "jh 8;ne;e;e;e;n;n;n;n;n", desc: "攻城大军将领的近身精锐。" },
          { jh: "峨眉山", loc: "城中主路", name: "运输兵", way: "jh 8;ne;e;e;e;n;n;n;n;n;e", desc: "负责运送器械的士兵。" },
          { jh: "峨眉山", loc: "城守府", name: "王坚", way: "jh 8;ne;e;e;e;n;n;n;n;n;e;e;e", desc: "钓鱼城守城大将，智勇双全，有条不紊地指挥著整座城市的防御工作。", },
          { jh: "峨眉山", loc: "城守府", name: "参谋官", way: "jh 8;ne;e;e;e;n;n;n;n;n;e;e;e", desc: "守军参谋军官，负责传递消息和提出作战意见。" },
          { jh: "峨眉山", loc: "军械库", name: "军械官", way: "jh 8;ne;e;e;e;n;n;n;n;n;e;e;n", desc: "管理军械库的一位中年军官，健壮有力。" },
          { jh: "峨眉山", loc: "箭楼", name: "神箭手", way: "jh 8;ne;e;e;e;n;n;n;n;n;e;e;s", desc: "钓鱼城守城大军的神箭手，百步穿杨，箭无虚发。" },
          { jh: "峨眉山", loc: "箭楼", name: "黑羽刺客", way: "jh 8;ne;e;e;e;n;n;n;n;n;e;e;s", desc: "攻城黑羽将领的精锐刺客。" },
          { jh: "峨眉山", loc: "箭楼", name: "黑羽敌将", way: "jh 8;ne;e;e;e;n;n;n;n;n;e;e;s", desc: "攻城大将，曾是江湖上一等一的好手。" },
          { jh: "峨眉山", loc: "粮库", name: "粮库主薄", way: "jh 8;ne;e;e;e;n;n;n;n;n;e;n", desc: "管理粮库的军官，双眼炯炯有神，一丝一毫的细节都牢记于心。", },
          { jh: "峨眉山", loc: "瞭望台", name: "斥候", way: "jh 8;ne;e;e;e;n;n;n;n;n;e;s", desc: "负责侦查敌情的军士" },
          { jh: "峨眉山", loc: "瞭望台", name: "阿保甲", way: "jh 8;ne;e;e;e;n;n;n;n;n;e;s", desc: "攻城大将，曾是江湖上一等一的好手。" },
          { jh: "峨眉山", loc: "瞭望台", name: "胡族军士", way: "jh 8;ne;e;e;e;n;n;n;n;n;e;s", desc: "攻城大军将领的近身精锐。" },
          { jh: "峨眉山", loc: "山脚小路", name: "传令兵", way: "jh 8;ne;e;e;e;s", desc: "钓鱼城派往长安求援的传令兵，行色匆匆，满面尘土。" },
          { jh: "峨眉山", loc: "峨眉山门", name: "文虚师太", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e", desc: "她是峨眉派的“文”辈弟子。" },
          { jh: "峨眉山", loc: "峨眉山门", name: "看山弟子", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e", desc: "一个女弟子，手上拿著一把长剑。" },
          { jh: "峨眉山", loc: "山门广场", name: "文玉师太", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n", desc: "她是峨眉派的“文”辈弟子。" },
          { jh: "峨眉山", loc: "山门广场", name: "文寒师太", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n", desc: "她是峨眉派的“文”辈弟子。" },
          { jh: "峨眉山", loc: "十二盘", name: "巡山弟子", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n;n", desc: "一个拿著武器，有点气势的巡山弟子。" },
          { jh: "峨眉山", loc: "千佛庵大门", name: "小女孩", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n;n;n;n;w", desc: "这是个小女孩。" },
          { jh: "峨眉山", loc: "千佛庵大门", name: "小贩", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n;n;n;n;w", desc: "峨眉山上做点小生意的小贩。", },
          { jh: "峨眉山", loc: "毗卢殿", name: "静洪师太", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n;n;n;n;w;n", desc: "她是峨眉派的“静”辈弟子。", },
          { jh: "峨眉山", loc: "文殊殿", name: "静雨师太", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n;n;n;n;w;n;n", desc: "她是峨眉派的“静”辈弟子。", },
          { jh: "峨眉山", loc: "俗家弟子房", name: "贝锦瑟", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n;n;n;n;w;n;n;n;e;e;n;n;e", desc: "她是峨嵋派的第四代俗家弟子。", },
          { jh: "峨眉山", loc: "峨眉后山", name: "毒蛇", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;n", desc: "一条剧毒的毒蛇。" },
          { jh: "峨眉山", loc: "狭窄山路", name: "护法弟子", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n;n;n;n;w;n;n;n;n;n;n;n;n;n;ne", desc: "她是一位年轻的师太。是灭绝石台座前的护法弟子。", },
          { jh: "峨眉山", loc: "狭窄山道", name: "护法大弟子", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n;n;n;n;w;n;n;n;n;n;n;n;n;n;ne;ne", desc: "她是一位年轻的师太。是灭绝石台座前的护法弟子。", },
          { jh: "峨眉山", loc: "静修后殿", name: "方碧翠", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n;n;n;n;w;n;n;n;n;n;n;n;n;n;ne;ne;n", desc: "她是峨嵋派的第四代俗家弟子。", },
          { jh: "峨眉山", loc: "静修后殿", name: "灭绝掌门", name_new: "通星师太", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n;n;n;n;w;n;n;n;n;n;n;n;n;n;ne;ne;n", desc: "她是峨嵋派的第三代弟子，现任峨嵋派掌门人。", },
          { jh: "峨眉山", loc: "九王洞", name: "静慈师太", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n;n;n;n;w;n;n;n;n;n;n;n;n;n;ne;ne;se;e", desc: "这是一位年纪不算很大的师太。", },
          { jh: "峨眉山", loc: "打坐室", name: "静玄师太", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n;n;n;n;w;n;n;n;w;w;n;n;w", desc: "她是峨眉派的“静”辈弟子。", },
          { jh: "峨眉山", loc: "风动坡", name: "尼姑", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n;n;n;n;w;n;n;n;w;w;w;w;n", desc: "这是一个年轻尼姑。" },
          { jh: "峨眉山", loc: "雷动坪", name: "尼姑", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n;n;n;n;w;n;n;n;w;w;w;w;sw", desc: "这是一个年轻尼姑，似乎有几手武功。", },
          { jh: "峨眉山", loc: "风动坡", name: "女孩", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n;n;n;n;w;n;n;n;w;w;w;w;n", desc: "这是个少女，虽然只有十二、三岁，身材已经开始发育。", },
          { jh: "峨眉山", loc: "雷动坪", name: "小尼姑", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n;n;n;n;w;n;n;n;w;w;w;w;sw", desc: "一个年纪赏小的尼姑。" },
          { jh: "峨眉山", loc: "清音阁", name: "青书少侠", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n;n;n;n;n;e;e", desc: "他今年二十岁，乃是武当第三代中出类拔萃的人物。", },
          { jh: "峨眉山", loc: "眺望台", name: "白猿", way: "jh 8;w;nw;n;n;n;n;w", desc: "这是一头全身白色毛发的猿猴。" },
          { jh: "恒山", loc: "眺望台", name: "杀神寨匪首", way: "", desc: "匪寨首领，杀气腾腾。" },
          { jh: "恒山", loc: "桃花林", name: "嵩山死士", way: "jh 9;n;n;n;n;n;event_1_85624865;n;w;event_1_27135529", desc: "这是一名狂热的嵩山弟子，甘愿为嵩山付出自己的生命。", },
          { jh: "恒山", loc: "桃花林", name: "杀神寨头目", way: "", desc: "匪寨的头目，目露凶光。" },
          { jh: "恒山", loc: "大字岭", name: "山盗", way: "jh 9", desc: "一个盘踞山林的盗匪。" },
          { jh: "恒山", loc: "虎风口", name: "秦卷帘", way: "jh 9;n", desc: "恒山派俗家弟子，脸上没有一丝表情，让人望而却步。" },
          { jh: "恒山", loc: "果老岭", name: "郑婉儿", way: "jh 9;n;n", desc: "恒山派俗家弟子，看起来清丽可人。" },
          { jh: "恒山", loc: "夕阳岭", name: "哑太婆", way: "jh 9;n;n;e", desc: "一身黑衣，头发虽已花白，但俏丽的容颜却让人忍不住多看两眼。" },
          { jh: "恒山", loc: "北岳庙", name: "云问天", way: "jh 9;n;n;n", desc: "身背行囊的游客，看起来会些功夫。" },
          { jh: "恒山", loc: "北岳殿", name: "石高达", way: "jh 9;n;n;n;n", desc: "一名身份可疑的男子，最近常在山上游荡。" },
          { jh: "恒山", loc: "玉羊游云", name: "公孙浩", way: "jh 9;n;n;n;n;e", desc: "一名行走五湖四海的游侠，看起来功夫还不错。" },
          { jh: "恒山", loc: "秘道", name: "不可不戒", way: "jh 9;n;n;n;n;henshan15_op1", desc: "曾经是江湖上有名的采花大盗，被不戒和尚用药迷倒，剪掉了作案工具，剃度后收为徒弟。", },
          { jh: "恒山", loc: "见性峰山道", name: "山蛇", way: "jh 9;n;n;n;n;n", desc: "一条吐著红舌头的毒蛇" },
          { jh: "恒山", loc: "见性峰山道", name: "嵩山弟子", way: "jh 9;n;n;n;n;n;event_1_85624865", desc: "嵩山派弟子" },
          { jh: "恒山", loc: "紫芝丛", name: "司马承", way: "jh 9;n;n;n;n;n;event_1_85624865;n;e", desc: "嵩山派高手，看起来颇有些修为。" },
          { jh: "恒山", loc: "千年菩提", name: "沙江龙", way: "jh 9;n;n;n;n;n;event_1_85624865;n;n;n;henshan_zizhiyu11_op1", desc: "嵩山派高手，看起来颇有些修为。", },
          { jh: "恒山", loc: "云洞", name: "史师兄", way: "jh 9;n;n;n;n;n;event_1_85624865;n;n;n;n", desc: "嵩山派大弟子，武功修为颇高。" },
          { jh: "恒山", loc: "桃花林", name: "赵志高", way: "jh 9;n;n;n;n;n;event_1_85624865;n;w", desc: "嵩山派高手，看起来颇有些修为。" },
          { jh: "恒山", loc: "白云庵", name: "定云师太", way: "jh 9;n;n;n;n;n;n;n", desc: "恒山派白云庵庵主，外刚内和，脾气虽然暴躁，心地却极慈祥。", },
          { jh: "恒山", loc: "藏经阁", name: "仪雨", way: "jh 9;n;n;n;n;n;n;n;e;e", desc: "恒山派二弟子" },
          { jh: "恒山", loc: "练武房", name: "仪容", way: "jh 9;n;n;n;n;n;n;n;e;n", desc: "恒山派大弟子" },
          { jh: "恒山", loc: "长廊", name: "吸血蝙蝠", way: "jh 9;n;n;n;n;n;n;n;n", desc: "这是一只黑色的吸血蝙蝠" },
          { jh: "恒山", loc: "白云庵后殿", name: "定安师太", way: "jh 9;n;n;n;n;n;n;n;n;n", desc: "恒山派掌门，心细如发，虽然平时极少出庵，但于江湖上各门各派的人物，无一不是了如指掌，其武功修为极高。", },
          { jh: "恒山", loc: "悬空栈道", name: "神教杀手", way: "jh 9;n;n;n;n;n;n;n;n;n;w", desc: "日月神教杀手，手段极其凶残。" },
          { jh: "恒山", loc: "小茅屋", name: "魔教杀手", way: "jh 9;n;n;n;n;n;n;n;n;n;w;n;e;henshan_qinqitai23_op1", desc: "魔教杀手，一张黄脸让人过目难忘。", },
          { jh: "恒山", loc: "小茅屋", name: "魔教长老", way: "jh 9;n;n;n;n;n;n;n;n;n;w;n;e;n", desc: "此人衣著非凡，在魔教中颇有地位。" },
          { jh: "恒山", loc: "小茅屋", name: "魔教护卫", way: "jh 9;n;n;n;n;n;n;n;n;n;w;n;e;n", desc: "一名面容冷峻的带刀护卫，正警惕的打量四周。" },
          { jh: "恒山", loc: "松树林", name: "神秘人", way: "jh 9;n;n;n;n;n;n;n;n;n;w;n;event_1_89533343", desc: "一个眼神凌厉的黑衣人，浑身散发著无比杀气，令人不安。" },
          { jh: "恒山", loc: "琴棋台", name: "魔教头目", way: "jh 9;n;n;n;n;n;n;n;n;n;w;n;n;n;n", desc: "看起来风流倜傥的中年男子，魔教的小头目。" },
          { jh: "恒山", loc: "斋堂", name: "小师太", way: "jh 9;n;n;n;n;n;n;n;w;n", desc: "恒山入门弟子" },
          { jh: "恒山", loc: "鸡叫石", name: "柳云烟", way: "jh 9;n;n;n;w", desc: "一身短装的女子，头戴纱帽，一张俏脸在面纱后若隐若现，让人忍不住想掀开面纱瞧个仔细。", },
          { jh: "恒山", loc: "悬根松", name: "九戒大师", way: "jh 9;n;w", desc: "虽著一身袈裟，但一脸络腮胡让他看起来颇有些凶悍。" },
          { jh: "武当山", loc: "西厢走廊", name: "练功弟子", way: "jh 10;w;n;n;w;w;w;n;n;n;n;n;w", desc: "一位正在练功的青年弟子，但似乎很不耐烦。", },
          { jh: "武当山", loc: "藏经阁", name: "道德经「上卷」", way: "jh 10;w;n;n;w;w;w;n;n;n;n;n;w;n", desc: "这是一册道德经「上卷」，由体道第一始至去用第四十止。", },
          { jh: "武当山", loc: "藏经阁", name: "道德经「第一章」", way: "jh 10;w;n;n;w;w;w;n;n;n;n;n;w;n", desc: "第一章   道可道，非常道。名可名，非常名。   无名天地之始；有名万物之母。   故常无，欲以观其妙；常有，欲以观其徼。   此两者，同出而异名，同谓之玄。玄之又玄，众妙之门。", },
          { jh: "武当山", loc: "林中小路", name: "王五", way: "jh 10;w", desc: "一位邋邋遢遢的道士。" },
          { jh: "武当山", loc: "林中小路", name: "土匪头", way: "jh 10", desc: "这家伙满脸杀气，一付凶神恶煞的模样，令人望而生畏。" },
          { jh: "武当山", loc: "林中小路", name: "土匪", way: "jh 10", desc: "这家伙满脸横肉一付凶神恶煞的模样，令人望而生畏。" },
          { jh: "武当山", loc: "遇剑阁大门", name: "布衣弟子", way: "jh 10;w;n;event_1_74091319;ne;n;sw;nw;w;ne;n;n", desc: "遇剑阁的一位弟子，不知是哪个长老门下的。" },
          { jh: "武当山", loc: "阁主楼", name: "剑童", way: "jh 10;w;n;event_1_74091319;ne;n;sw;nw;w;ne;n;n;n;n;n;n", desc: "遇剑阁的一名剑童，长得十分可爱。", },
          { jh: "武当山", loc: "阁主寝室", name: "剑遇安", way: "jh 10;w;n;event_1_74091319;ne;n;sw;nw;w;ne;n;n;n;n;n;n;n", desc: "一位似乎身重剧毒的老前辈，但仍能看出其健康之时武功不凡。", },
          { jh: "武当山", loc: "小院子", name: "剑遇治", way: "jh 10;w;n;event_1_74091319;ne;n;sw;nw;w;ne;n;n;n;n;ne;n;n", desc: "一位身形肥胖的布衣青年。", },
          { jh: "武当山", loc: "山长老楼", name: "剑遇山", way: "jh 10;w;n;event_1_74091319;ne;n;sw;nw;w;ne;n;n;n;n;ne;n;n;e", desc: "一位看起来非常高傲的老前辈。", },
          { jh: "武当山", loc: "行长老楼", name: "剑遇行", way: "jh 10;w;n;event_1_74091319;ne;n;sw;nw;w;ne;n;n;n;n;ne;s;e", desc: "一问看起来非常慈祥的老前辈", },
          { jh: "武当山", loc: "鸣长老楼", name: "剑遇鸣", way: "jh 10;w;n;event_1_74091319;ne;n;sw;nw;w;ne;n;n;n;n;ne;s;sw", desc: "一位看起来非常自负的老前辈。", },
          { jh: "武当山", loc: "小院子", name: "剑遇南", way: "jh 10;w;n;event_1_74091319;ne;n;sw;nw;w;ne;n;n;n;n;nw;nw", desc: "一个布衣青年，腰间系著一把配剑。", },
          { jh: "武当山", loc: "穆长老楼", name: "剑遇穆", way: "jh 10;w;n;event_1_74091319;ne;n;sw;nw;w;ne;n;n;n;n;nw;nw;n", desc: "一位布衣长者，看起来道风仙骨。", },
          { jh: "武当山", loc: "黄土路", name: "野兔", way: "jh 10;w;n;n;w", desc: "一只好可爱的小野兔。" },
          { jh: "武当山", loc: "武当牌坊", name: "进香客", way: "jh 10;w;n;n;w;w", desc: "一位前往武当山进香的人。" },
          { jh: "武当山", loc: "武当牌坊", name: "青书少侠", way: "jh 10;w;n;n;w;w", desc: "他今年二十岁，乃是武当第三代中出类拔萃的人物。" },
          { jh: "武当山", loc: "三清殿", name: "知客道长", way: "jh 10;w;n;n;w;w;w;n;n;n", desc: "他是武当山的知客道长。" },
          { jh: "武当山", loc: "武当广场", name: "道童", way: "jh 10;w;n;n;w;w;w;n;n;n;n", desc: "他是武当山的小道童。" },
          { jh: "武当山", loc: "桃园小路", name: "蜜蜂", way: "jh 10;w;n;n;w;w;w;n;n;n;n;e;e;e;e;s;e;s;e;n", desc: "这是一只蜜蜂，正忙著采蜜。" },
          { jh: "武当山", loc: "桃园小路", name: "小蜜蜂", way: "jh 10;w;n;n;w;w;w;n;n;n;n;e;e;e;e;s;e;s;e;n", desc: "这是一只蜜蜂，正忙著采蜜。" },
          { jh: "武当山", loc: "桃园小路", name: "猴子", way: "jh 10;w;n;n;w;w;w;n;n;n;n;e;e;e;e;s;e;s;e;s", desc: "这只猴子在在桃树间跳上跳下，还不时津津有味地啃几口著蜜桃。", },
          { jh: "武当山", loc: "三清殿", name: "清虚道长", way: "jh 10;w;n;n;w;w;w;n;n;n;n;n", desc: "他就是清虚道长。他今年四十岁，主管武当派的俗事。", },
          { jh: "武当山", loc: "三清殿", name: "宋首侠", way: "jh 10;w;n;n;w;w;w;n;n;n;n;n", desc: "他就是张三丰的大弟子、武当七侠之首。身穿一件干干净净的灰色道袍。他已年过六十，身材瘦长，满脸红光。恬淡冲和，沉默寡言。", },
          { jh: "武当山", loc: "东厢走廊", name: "张松溪", way: "jh 10;w;n;n;w;w;w;n;n;n;n;n;e", desc: "他就是张三丰的四弟子张松溪。他今年四十岁，精明能干，以足智多谋著称。", },
          { jh: "武当山", loc: "比武房", name: "俞二侠", way: "jh 10;w;n;n;w;w;w;n;n;n;n;n;e;e;e;e", desc: "服下丹药之后的他武功似乎提升了不少，实力不容小觑。", },
          { jh: "武当山", loc: "茶室", name: "小翠", way: "jh 10;w;n;n;w;w;w;n;n;n;n;n;e;e;s", desc: "这是个年年龄不大的小姑娘，但宽松的道袍也遮不住她过早发育的身体。一脸聪明乖巧，满口伶牙俐齿。见有人稍微示意，便过去加茶倒水。", },
          { jh: "武当山", loc: "茶室", name: "水蜜桃", way: "jh 10;w;n;n;w;w;w;n;n;n;n;n;e;e;s", desc: "一碟水灵新鲜的水蜜桃，跟小翠的脸蛋儿一样红艳可人。" },
          { jh: "武当山", loc: "茶室", name: "香茶", way: "jh 10;w;n;n;w;w;w;n;n;n;n;n;e;e;s", desc: "一杯热茶，悠悠地冒著香气～～～" },
          { jh: "武当山", loc: "后院", name: "俞莲舟", way: "jh 10;w;n;n;w;w;w;n;n;n;n;n;n", desc: "他就是张三丰的二弟子俞莲舟。他今年五十岁，身材魁梧，气度凝重。虽在武当七侠中排名第二，功夫却是最精。", },
          { jh: "武当山", loc: "后山小院", name: "张三丰", way: "jh 10;w;n;n;w;w;w;n;n;n;n;n;n;n;n;n", desc: "他就是武当派开山鼻祖、当今武林的泰山北斗，中华武功承先启后、继往开来的大宗师。身穿一件污秽的灰色道袍，不修边幅。身材高大，年满百岁，满脸红光，须眉皆白。", },
          { jh: "晚月庄", loc: "后山小院", name: "安妮儿", way: "", desc: "一个风尘仆仆的侠客。。" },
          { jh: "晚月庄", loc: "□香榭", name: "颜慧如", way: "jh 11;e;e;s;sw;se;s;s;s;w;s;s;se", desc: "她是一位美女，真是红颜似玉，绿鬓如云，明丽的眼睛，洁白的牙齿。容色俊俏，风度飘逸，令人心动。", },
          { jh: "晚月庄", loc: "翠湘阁", name: "莫欣芳", way: "jh 11;e;e;s;sw;se;w;w;s;s;s;w;n;e;n", desc: "她国色天香，娇丽无伦；温柔娴静，秀绝人寰。她姿容绝美，世所罕见。从她身旁你闻道一寒谷幽香。", },
          { jh: "晚月庄", loc: "紫翎小轩", name: "上官钰翎", way: "jh 11;e;e;s;sw;se;s;s;s;w;s;s;w", desc: "一个风尘仆仆的侠客。。" },
          { jh: "晚月庄", loc: "暖香榭", name: "美珊", way: "jh 11;e;e;s;sw;se;s;s;s;e;se;s", desc: "她看起来成熟中带有一些韵味。飘逸的长发十分迷人。" },
          { jh: "晚月庄", loc: "暖香榭", name: "金丝雀", way: "jh 11;e;e;s;sw;se;s;s;s;e;se;s", desc: "一只羽毛鲜□的小金丝雀。" },
          { jh: "晚月庄", loc: "沁芳亭", name: "袭人", way: "jh 11;e;e;s;sw;se;s;s;s;s;s", desc: "她有著春花般的脸儿，青山似的眉黛，灵活如秋波的眼睛，高低适宜如玉□的鼻子，珊珊似的小口。她的特点就是清秀大方，如花中之牡丹，鸟中之鸾凤。", },
          { jh: "晚月庄", loc: "紫翎小轩", name: "小金鼠", way: "jh 11;e;e;s;sw;se;s;s;s;w;s;s;w", desc: "一只可爱的长尾巴的小金鼠。" },
          { jh: "晚月庄", loc: "沐浴更衣室", name: "阮欣郁", way: "jh 11;e;e;s;sw;se;w;w;s;s;s;e;s;s;w;s;e", desc: "一个风尘仆仆的侠客。。" },
          { jh: "晚月庄", loc: "内厅穿堂", name: "龙韶吟", way: "jh 11;e;e;s;sw;se;w;w;s;s;s;e;s;s;w;s", desc: "一个风尘仆仆的侠客。。" },
          { jh: "晚月庄", loc: "内厅", name: "虞琼衣", way: "jh 11;e;e;s;sw;se;w;w;s;s;s;e;s;s;w", desc: "一个风尘仆仆的侠客。。" },
          { jh: "晚月庄", loc: "后厅", name: "苗郁手", way: "jh 11;e;e;s;sw;se;w;w;s;s;s", desc: "她看起来很有活力，两眼明亮有神。给你一种巾帼不让须眉的气势，但刚毅之中似又隐含著女孩子有的娇柔。", },
          { jh: "晚月庄", loc: "后厅", name: "圆春", way: "jh 11;e;e;s;sw;se;w;w;s;s;s", desc: "她是惜春的妹妹，跟姐姐从小就在晚月庄长大。因为与双亲失散，被庄主收留。平常帮忙庄内琐碎事务。", },
          { jh: "晚月庄", loc: "内书房", name: "惜春", way: "jh 11;e;e;s;sw;se;w;w;s;s;s;w;w", desc: "她看起来成熟中带有一些稚气。飘逸的长发十分迷人。她是个孤儿，从小与妹妹圆春被庄主收留，她很聪明，在第四代弟子中算是武功很出色的一个。", },
          { jh: "晚月庄", loc: "小花池", name: "凤凰", way: "jh 11;e;e;s;sw;se;w;w;s;s;s;e;s;s;w;s;e;e", desc: "火神「凤凰」乃勇士寒于的魂魄所化成的十三个精灵之一。由于其奇异神迹，被晚月庄供奉为护庄神兽。", },
          { jh: "晚月庄", loc: "小花池", name: "金仪彤", way: "jh 11;e;e;s;sw;se;w;w;s;s;s;e;s;s;w;s;e;e", desc: "她国色天香，娇丽无伦；温柔娴静，秀绝人寰。可惜眉心上有一道地煞纹干犯紫斗，恐要玉手染血，浩劫武林。", },
          { jh: "晚月庄", loc: "东厢房", name: "瑷伦", way: "jh 11;e;e;s;sw;se;w;w;s;s;s;e;s;s;e", desc: "她已是步入老年，但仍风采依旧。" },
          { jh: "晚月庄", loc: "厨房", name: "曲馥琪", way: "jh 11;e;e;s;sw;se;w;w;s;s;e;e;e", desc: "她国色天香，娇丽无伦；温柔娴静，秀绝人寰。她姿容绝美，世所罕见。从她身旁你闻道一寒谷幽香。", },
          { jh: "晚月庄", loc: "上等厢房", name: "梦玉楼", way: "jh 11;e;e;s;sw;se;w;w;s;s;w;w;s", desc: "一个风尘仆仆的侠客。。" },
          { jh: "晚月庄", loc: "桂花园", name: "蓝小蝶", way: "jh 11;e;e;s;sw;se;s;s;s;w;s", desc: "她长得十分漂亮！让你忍不住多瞧她几眼，从她身上你闻到淡淡的香气。她很有礼貌的向你点头，优雅的动作，轻盈的步伐，好美哦!她是晚月庄主蓝止萍的养女，平常庄内的接待是看她。", },
          { jh: "晚月庄", loc: "", name: "小白兔", way: ".靠谜题飞", desc: "一只红眼睛的小白兔。" },
          { jh: "晚月庄", loc: "", name: "风老四", way: ".靠谜题飞", desc: "风梭风九幽，但他现在走火入魔，一动也不能动了。" },
          { jh: "晚月庄", loc: "", name: "水灵儿", way: ".靠谜题飞", desc: "她满面愁容，手里虽然拿著本书，却只是呆呆的出神。" },
          { jh: "晚月庄", loc: "蜿蜒小径", name: "蝴蝶", way: "jh 11;e;e;s", desc: "一只翩翩起舞的小蝴蝶哦!" },
          { jh: "晚月庄", loc: "小路", name: "小贩", way: "jh 11;e;e;s;n;nw;w;nw;e", desc: "这小贩左手提著个篮子，右手提著个酒壶。篮上系著铜铃，不住叮铛作响。", },
          { jh: "晚月庄", loc: "茅屋内", name: "酒肉和尚", way: "jh 11;e;e;s;n;nw;w;nw;e;e;e;n;w", desc: "这是一个僧不僧俗不俗，满头乱发的怪人" },
          { jh: "晚月庄", loc: "幽州台", name: "陈子昂", way: "jh 11;e;e;s;n;nw;w;nw;e;e;e;se", desc: "一个狂放书生，显是出自豪富之家，轻财好施，慷慨任侠。", },
          { jh: "晚月庄", loc: "晚月庄大门", name: "彩衣少女", way: "jh 11;e;e;s;sw", desc: "小姑娘是晚月庄的女弟子，虽说身形单薄，可眼神里透出的傲气让人感到并不好欺负。", },
          { jh: "晚月庄", loc: "晚月庄大厅", name: "婢女", way: "jh 11;e;e;s;sw;se;w", desc: "一个风尘仆仆的侠客。。" },
          { jh: "晚月庄", loc: "晚月庄大厅", name: "蓝止萍", way: "jh 11;e;e;s;sw;se;w", desc: "蓝止萍是一个十分出色的美女，她弹的一手琵琶更是闻名千里，许多王侯子弟，富商豪客都为她天下无双的美貌与琴艺倾倒。", },
          { jh: "晚月庄", loc: "傍厅", name: "蓝雨梅", way: "jh 11;e;e;s;sw;se;w;n", desc: "蓝雨梅是晚月庄主蓝止萍的养女，由于庄主不信任男子，因此晚月庄接待外宾的工作向来由她负责。", },
          { jh: "晚月庄", loc: "禁闭房", name: "芳绫", way: "jh 11;e;e;s;sw;se;w;w;n;w", desc: "她看起来像个小灵精，头上梳两个小包包头。她坐在地上，看到你看她便向你作了个鬼脸!你想她一定是调皮才会在这受罚!", },
          { jh: "晚月庄", loc: "夹道", name: "昭蓉", way: "jh 11;e;e;s;sw;se;w;w;s;s;w", desc: "她长得十分漂亮！让你忍不住多瞧她几眼，从她身上你闻到淡淡的香气。她很有礼貌的向你点头，优雅的动作，轻盈的步伐，好美哦!", },
          { jh: "晚月庄", loc: "后院书房", name: "昭仪", way: "jh 11;e;e;s;sw;se;w;w;w;w", desc: "她看起来非常可爱。身材玲珑有致，曲线苗条。第一眼印象，你觉的她舞蹈一定跳的不错，看她的一举一动有一种说不出的流畅优雅！", },
          { jh: "水烟阁", loc: "水烟阁正门", name: "水烟阁武士", way: "jh 12;n;n;n", desc: "这是一个水烟阁武士。" },
          { jh: "水烟阁", loc: "厨房", name: "董老头", way: "jh 12;n;n;n;e;n;n", desc: "于兰天武的亲兵，追随于兰天武多年，如今隐居于水烟阁，继续保护王爷。", },
          { jh: "水烟阁", loc: "水烟阁正厅", name: "潘军禅", way: "jh 12;n;n;n;n", desc: "潘军禅是当今武林的一位传奇性人物，以他仅仅二十八岁的年龄竟能做到水烟阁执法使的职位，著实是一位不简单的人物。潘军禅是封山剑派掌门柳淳风的结拜义弟，但是他为人其实十分风趣，又好交朋友，丝毫不会摆出武林执法者的架子。", },
          { jh: "水烟阁", loc: "水烟阁正厅", name: "萧辟尘", way: "jh 12;n;n;n;n", desc: "萧辟尘自幼生长于岚城之中，看起来仙风道骨，不食人间烟火。" },
          { jh: "水烟阁", loc: "西侧厅", name: "水烟阁红衣武士", way: "jh 12;n;n;n;w;n;nw", desc: "这个人身著红色水烟阁武士服色，眼神十分锐利。", },
          { jh: "水烟阁", loc: "聆啸厅", name: "水烟阁司事", way: "jh 12;n;n;n;w;n;nw;e", desc: "这个人看起来十分和蔼可亲，一双眼睛炯炯有神。" },
          { jh: "水烟阁", loc: "春秋水色斋", name: "于兰天武", way: "jh 12;n;n;n;w;n;nw;e;n", desc: "于兰天武是当今皇上的叔父，但是他毕生浸淫武学，甘愿抛弃荣华富以换取水烟阁传功使一职，以便阅读水烟阁中所藏的武学典籍，无论你有什么武学上的疑难，他都能为你解答。", },
          { jh: "少林寺", loc: "般若堂五层", name: "澄志", way: "jh 13;n;n;n;n;n;n;n;n;n;n;w;s;s;s;s", desc: "他是一位须发花白的老僧，身穿一袭金边黑布袈裟。他身材瘦高，太阳穴高高鼓起，似乎身怀绝世武功。", },
          { jh: "少林寺", loc: "罗汉堂九层", name: "澄和", way: "jh 13;n;n;n;n;n;n;n;n;n;n;e;s;s;s;s;s;s;s;s", desc: "他是一位须发花白的老僧，身穿一袭金边黑布袈裟。他身材瘦高，太阳穴高高鼓起，似乎身怀绝世武功。", },
          { jh: "少林寺", loc: "罗汉堂四层", name: "澄净", way: "jh 13;n;n;n;n;n;n;n;n;n;n;e;s;s;s", desc: "他是一位须发花白的老僧，身穿一袭金边黑布袈裟。他身材瘦高，太阳穴高高鼓起，似乎身怀绝世武功。", },
          { jh: "少林寺", loc: "卧室", name: "道果禅师", way: "jh 13;n;w;w;n;shaolin012_op1", desc: "他是一位身材高大的中年僧人，两臂粗壮，膀阔腰圆。他手持兵刃，身穿一袭灰布镶边袈裟，似乎有一身武艺。", },
          { jh: "少林寺", loc: "般若堂四层", name: "澄识", way: "jh 13;n;n;n;n;n;n;n;n;n;n;w;s;s;s", desc: "他是一位须发花白的老僧，身穿一袭金边黑布袈裟。他身材瘦高，太阳穴高高鼓起，似乎身怀绝世武功。", },
          { jh: "少林寺", loc: "般若堂七层", name: "澄灵", way: "jh 13;n;n;n;n;n;n;n;n;n;n;w;s;s;s;s;s;s", desc: "他是一位须发花白的老僧，身穿一袭金边黑布袈裟。他身材瘦高，太阳穴高高鼓起，似乎身怀绝世武功。", },
          { jh: "少林寺", loc: "般若堂六层", name: "澄信", way: "jh 13;n;n;n;n;n;n;n;n;n;n;w;s;s;s;s;s", desc: "他是一位须发花白的老僧，身穿一袭金边黑布袈裟。他身材瘦高，太阳穴高高鼓起，似乎身怀绝世武功。", },
          { jh: "少林寺", loc: "罗汉堂一层", name: "澄观", way: "jh 13;n;n;n;n;n;n;n;n;n;n;e", desc: "他是一位须发花白的老僧，身穿一袭金边黑布袈裟。他身材瘦高，太阳穴高高鼓起，似乎身怀绝世武功。", },
          { jh: "少林寺", loc: "般若堂九层", name: "澄尚", way: "jh 13;n;n;n;n;n;n;n;n;n;n;w;s;s;s;s;s;s;s;s", desc: "他是一位须发花白的老僧，身穿一袭金边黑布袈裟。他身材瘦高，太阳穴高高鼓起，似乎身怀绝世武功。", },
          { jh: "少林寺", loc: "罗汉堂八层", name: "澄灭", way: "jh 13;n;n;n;n;n;n;n;n;n;n;e;s;s;s;s;s;s;s", desc: "他是一位须发花白的老僧，身穿一袭金边黑布袈裟。他身材瘦高，太阳穴高高鼓起，似乎身怀绝世武功。", },
          { jh: "少林寺", loc: "小木屋", name: "乔三槐", way: "jh 13;n;w;w;n", desc: "勤劳朴实的山民，皮肤黝黑粗糙。" },
          { jh: "少林寺", loc: "菩提金刚阵", name: "渡云神识", way: "jh 13;e;s;s;w;w;w;event_1_38874360", desc: "这是渡云的神识。" },
          { jh: "少林寺", loc: "般若堂三层", name: "澄思", way: "jh 13;n;n;n;n;n;n;n;n;n;n;w;s;s", desc: "他是一位须发花白的老僧，身穿一袭金边黑布袈裟。他身材瘦高，太阳穴高高鼓起，似乎身怀绝世武功。", },
          { jh: "少林寺", loc: "罗汉堂三层", name: "澄明", way: "jh 13;n;n;n;n;n;n;n;n;n;n;e;s;s", desc: "他是一位须发花白的老僧，身穿一袭金边黑布袈裟。他身材瘦高，太阳穴高高鼓起，似乎身怀绝世武功。", },
          { jh: "少林寺", loc: "菩提金刚阵", name: "渡风神识", way: "jh 13;e;s;s;w;w;w;event_1_38874360", desc: "这是渡风的神识。" },
          { jh: "少林寺", loc: "般若堂八层", name: "澄欲", way: "jh 13;n;n;n;n;n;n;n;n;n;n;w;s;s;s;s;s;s;s", desc: "他是一位须发花白的老僧，身穿一袭金边黑布袈裟。他身材瘦高，太阳穴高高鼓起，似乎身怀绝世武功。", },
          { jh: "少林寺", loc: "罗汉堂七层", name: "澄寂", way: "jh 13;n;n;n;n;n;n;n;n;n;n;e;s;s;s;s;s;s", desc: "他是一位须发花白的老僧，身穿一袭金边黑布袈裟。他身材瘦高，太阳穴高高鼓起，似乎身怀绝世武功。", },
          { jh: "少林寺", loc: "罗汉堂五层", name: "澄坚", way: "jh 13;n;n;n;n;n;n;n;n;n;n;e;s;s;s;s", desc: "他是一位须发花白的老僧，身穿一袭金边黑布袈裟。他身材瘦高，太阳穴高高鼓起，似乎身怀绝世武功。", },
          { jh: "少林寺", loc: "般若堂二层", name: "澄意", way: "jh 13;n;n;n;n;n;n;n;n;n;n;w;s", desc: "他是一位须发花白的老僧，身穿一袭金边黑布袈裟。他身材瘦高，太阳穴高高鼓起，似乎身怀绝世武功。", },
          { jh: "少林寺", loc: "般若堂一层", name: "澄心", way: "jh 13;n;n;n;n;n;n;n;n;n;n;w", desc: "他是一位须发花白的老僧，身穿一袭金边黑布袈裟。他身材瘦高，太阳穴高高鼓起，似乎身怀绝世武功。", },
          { jh: "少林寺", loc: "菩提金刚阵", name: "渡雨神识", way: "jh 13;e;s;s;w;w;w;event_1_38874360", desc: "这是渡雨的神识。" },
          { jh: "少林寺", loc: "罗汉堂二层", name: "澄知", way: "jh 13;n;n;n;n;n;n;n;n;n;n;e;s", desc: "他是一位须发花白的老僧，身穿一袭金边黑布袈裟。他身材瘦高，太阳穴高高鼓起，似乎身怀绝世武功。", },
          { jh: "少林寺", loc: "丛林山径", name: "虚通", way: "jh 13", desc: "他是一位身穿黄布袈裟的青年僧人。脸上稚气未脱，身手却已相当矫捷，看来似乎学过一点武功。", },
          { jh: "少林寺", loc: "丛林山径", name: "山猪", way: "jh 13", desc: "黑色山猪，披著一身刚硬的鬃毛。" },
          { jh: "少林寺", loc: "金刚伏魔圈", name: "渡云", way: "jh 13;e;s;s;w;w;w", desc: "这是一个面颊深陷，瘦骨零丁的老僧，他脸色枯黄，如同一段枯木。", },
          { jh: "少林寺", loc: "金刚伏魔圈", name: "渡雨", way: "jh 13;e;s;s;w;w;w", desc: "这是一个面颊深陷，瘦骨零丁的老僧，他脸色惨白，象一张纸一样。" },
          { jh: "少林寺", loc: "金刚伏魔圈", name: "渡风", way: "jh 13;e;s;s;w;w;w", desc: "这是一个面颊深陷，瘦骨零丁的老僧，他脸色惨白，象一张纸一样。", },
          { jh: "少林寺", loc: "少林寺山门", name: "僧人", way: "jh 13;n", desc: "少林寺僧人，负责看守山门。" },
          { jh: "少林寺", loc: "少林寺山门", name: "虚明", way: "jh 13;n", desc: "他是一位身穿黄布袈裟的青年僧人。脸上稚气未脱，身手却已相当矫捷，看来似乎学过一点武功。", },
          { jh: "少林寺", loc: "甬道", name: "慧色尊者", way: "jh 13;n;n", desc: "他是一位两鬓斑白的老僧，身穿一袭青布镶边袈裟。他身材略高，太阳穴微凸，双目炯炯有神。" },
          { jh: "少林寺", loc: "甬道", name: "扫地和尚", way: "jh 13;n;n", desc: "一名年轻僧人，身穿灰色僧衣。" },
          { jh: "少林寺", loc: "甬道", name: "慧如尊者", way: "jh 13;n;n", desc: "他是一位两鬓斑白的老僧，身穿一袭青布镶边袈裟。他身材略高，太阳穴微凸，双目炯炯有神。" },
          { jh: "少林寺", loc: "东碑林", name: "洒水僧", way: "jh 13;n;n;e", desc: "一名年轻僧人，身穿灰色僧衣。" },
          { jh: "少林寺", loc: "天王殿", name: "小北", way: "jh 13;n;n;n", desc: "这是一个天真活泼的小沙弥，刚进寺不久，尚未剃度。" },
          { jh: "少林寺", loc: "天王殿", name: "玄痛大师", way: "jh 13;n;n;n", desc: "他是一位白须白眉的老僧，身穿一袭银丝棕黄袈裟。他身材高大，两手过膝。双目半睁半闭，却不时射出一缕精光。", },
          { jh: "少林寺", loc: "广场", name: "慧空尊者", way: "jh 13;n;n;n;n", desc: "他是一位两鬓斑白的老僧，身穿一袭青布镶边袈裟。他身材略高，太阳穴微凸，双目炯炯有神。", },
          { jh: "少林寺", loc: "广场", name: "慧名尊者", way: "jh 13;n;n;n;n", desc: "他是一位两鬓斑白的老僧，身穿一袭青布镶边袈裟。他身材略高，太阳穴微凸，双目炯炯有神。", },
          { jh: "少林寺", loc: "广场", name: "进香客", way: "jh 13;n;n;n;n", desc: "来寺里进香的中年男子，看起来满脸疲惫。" },
          { jh: "少林寺", loc: "钟楼", name: "扫地僧", way: "jh 13;n;n;n;n;e", desc: "一个年老的僧人，看上去老态龙钟，但是双目间却有一股精气？" },
          { jh: "少林寺", loc: "钟楼", name: "行者", way: "jh 13;n;n;n;n;e", desc: "他是一位云游四方的行者，风霜满面，行色匆匆，似乎正在办一件急事。" },
          { jh: "少林寺", loc: "大雄宝殿", name: "道象禅师", way: "jh 13;n;n;n;n;n", desc: "他是一位身材高大的中年僧人，两臂粗壮，膀阔腰圆。他手持兵刃，身穿一袭灰布镶边袈裟，似乎有一身武艺。", },
          { jh: "少林寺", loc: "大雄宝殿", name: "小南", way: "jh 13;n;n;n;n;n", desc: "青衣小沙弥，尚未剃度。" },
          { jh: "少林寺", loc: "月台", name: "巡寺僧人", way: "jh 13;n;n;n;n;n;n", desc: "身穿黄色僧衣的僧人，负责看守藏经阁。" },
          { jh: "少林寺", loc: "月台", name: "托钵僧", way: "jh 13;n;n;n;n;n;n", desc: "他是一位未通世故的青年和尚，脸上挂著孩儿般的微笑。" },
          { jh: "少林寺", loc: "月台", name: "行者", way: "jh 13;n;n;n;n;n;n", desc: "他是一位云游四方的行者，风霜满面，行色匆匆，似乎正在办一件急事。" },
          { jh: "少林寺", loc: "东禅房", name: "打坐僧人", way: "jh 13;n;n;n;n;n;n;e", desc: "正在禅室打坐修行的僧人。" },
          { jh: "少林寺", loc: "藏经阁", name: "清晓比丘", way: "jh 13;n;n;n;n;n;n;n", desc: "他是一位体格强健的壮年僧人，他身得虎背熊腰，全身似乎蕴含著无穷劲力。他身穿一袭白布黑边袈裟，似乎身怀武艺。", },
          { jh: "少林寺", loc: "藏经阁", name: "黑衣大汉", way: "jh 13;n;n;n;n;n;n;n", desc: "黑布蒙面，只露出一双冷电般的眼睛的黑衣大汉。" },
          { jh: "少林寺", loc: "藏经阁", name: "清缘比丘", way: "jh 13;n;n;n;n;n;n;n", desc: "他是一位体格强健的壮年僧人，他身得虎背熊腰，全身似乎蕴含著无穷劲力。他身穿一袭白布黑边袈裟，似乎身怀武艺。", },
          { jh: "少林寺", loc: "方丈院", name: "清为比丘", way: "jh 13;n;n;n;n;n;n;n;n", desc: "他是一位体格强健的壮年僧人，他身得虎背熊腰，全身似乎蕴含著无穷劲力。他身穿一袭白布黑边袈裟，似乎身怀武艺。", },
          { jh: "少林寺", loc: "方丈院", name: "清无比丘", way: "jh 13;n;n;n;n;n;n;n;n", desc: "他是一位体格强健的壮年僧人，他身得虎背熊腰，全身似乎蕴含著无穷劲力。他身穿一袭白布黑边袈裟，似乎身怀武艺。", },
          { jh: "少林寺", loc: "方丈院", name: "小沙弥", way: "jh 13;n;n;n;n;n;n;n;n", desc: "一名憨头憨脑的和尚，手里端著茶盘。" },
          { jh: "少林寺", loc: "方丈院", name: "清闻比丘", way: "jh 13;n;n;n;n;n;n;n;n", desc: "他是一位体格强健的壮年僧人，他身得虎背熊腰，全身似乎蕴含著无穷劲力。他身穿一袭白布黑边袈裟，似乎身怀武艺。", },
          { jh: "少林寺", loc: "东厢房", name: "玄悲大师", way: "jh 13;n;n;n;n;n;n;n;n;e", desc: "他是一位白须白眉的老僧，身穿一袭银丝棕黄袈裟。他身材甚高，但骨瘦如柴，顶门高耸，双目湛然有神。", },
          { jh: "少林寺", loc: "方丈室", name: "玄慈大师", way: "jh 13;n;n;n;n;n;n;n;n;n", desc: "他是一位白须白眉的老僧，身穿一袭金丝绣红袈裟。他身材略显佝偻，但却满面红光，目蕴慈笑，显得神完气足。", },
          { jh: "少林寺", loc: "方丈室", name: "清乐比丘", way: "jh 13;n;n;n;n;n;n;n;n;n", desc: "他是一位体格强健的壮年僧人，他身得虎背熊腰，全身似乎蕴含著无穷劲力。他身穿一袭白布黑边袈裟，似乎身怀武艺。", },
          { jh: "少林寺", loc: "方丈室", name: "清善比丘", way: "jh 13;n;n;n;n;n;n;n;n;n", desc: "他是一位体格强健的壮年僧人，他身得虎背熊腰，全身似乎蕴含著无穷劲力。他身穿一袭白布黑边袈裟，似乎身怀武艺。", },
          { jh: "少林寺", loc: "立雪亭", name: "清法比丘", way: "jh 13;n;n;n;n;n;n;n;n;n;n", desc: "他是一位体格强健的壮年僧人，他生得虎背熊腰，全身似乎蕴含著无穷劲力。他身穿一袭白布黑边袈裟，似乎身怀武艺。", },
          { jh: "少林寺", loc: "立雪亭", name: "清观比丘", way: "jh 13;n;n;n;n;n;n;n;n;n;n", desc: "他是一位体格强健的壮年僧人，他身得虎背熊腰，全身似乎蕴含著无穷劲力。他身穿一袭白布黑边袈裟，似乎身怀武艺。", },
          { jh: "少林寺", loc: "立雪亭", name: "立雪亭", way: "jh 13;n;n;n;n;n;n;n;n;n;n", desc: "" },
          { jh: "少林寺", loc: "立雪亭", name: "白眉老僧", way: "jh 13;n;n;n;n;n;n;n;n;n;n", desc: "少林寺高僧，武功修为无人能知。" },
          { jh: "少林寺", loc: "院落", name: "慧真尊者", way: "jh 13;n;n;n;n;n;n;n;n;n;n;n", desc: "他是一位两鬓斑白的老僧，身穿一袭青布镶边袈裟。他身材略高，太阳穴微凸，双目炯炯有神。", },
          { jh: "少林寺", loc: "院落", name: "慧虚尊者", way: "jh 13;n;n;n;n;n;n;n;n;n;n;n", desc: "他是一位两鬓斑白的老僧，身穿一袭青布镶边袈裟。他身材略高，太阳穴微凸，双目炯炯有神。", },
          { jh: "少林寺", loc: "院落", name: "青松", way: "jh 13;n;n;n;n;n;n;n;n;n;n;n", desc: "天真无邪的小沙弥" },
          { jh: "少林寺", loc: "白衣殿", name: "冷幽兰", way: "jh 13;n;n;n;n;n;n;n;n;n;n;n;e", desc: "“吐秀乔林之下，盘根众草之旁。虽无人而见赏，且得地而含芳。”她如同空谷幽兰一般素雅静谧，纤巧削细，面若凝脂，眉目如画，神若秋水。", },
          { jh: "少林寺", loc: "千佛殿", name: "慧修尊者", way: "jh 13;n;n;n;n;n;n;n;n;n;n;n;n", desc: "他是一位两鬓斑白的老僧，身穿一袭青布镶边袈裟。他身材略高，太阳穴微凸，双目炯炯有神。", },
          { jh: "少林寺", loc: "千佛殿", name: "慧轮", way: "jh 13;n;n;n;n;n;n;n;n;n;n;n;n", desc: "少林寺弟子，虚竹的师傅，武功修为平平。" },
          { jh: "少林寺", loc: "药楼", name: "守药僧", way: "jh 13;n;n;n;n;n;n;n;n;n;n;n;n;e", desc: "一位守著少林药楼的高僧。" },
          { jh: "少林寺", loc: "树林", name: "砍柴僧", way: "jh 13;n;n;n;n;n;n;n;n;n;n;n;n;w", desc: "一名年轻僧人，身穿灰色僧衣。" },
          { jh: "少林寺", loc: "树林", name: "道相禅师", way: "jh 13;n;n;n;n;n;n;n;n;n;n;n;n;w", desc: "他是一位身材高大的中年僧人，两臂粗壮，膀阔腰圆。他手持兵刃，身穿一袭灰布镶边袈裟，似乎有一身武艺。", },
          { jh: "少林寺", loc: "火龙洞", name: "达摩老祖", way: "jh 13;n;n;n;n;n;n;n;n;n;n;n;n;w;n;get_silver", desc: "这是少林派的开山祖师达摩老祖他身材高大，看起来不知有多大年纪，目光如炬，神光湛然！", },
          { jh: "少林寺", loc: "地藏殿", name: "道一禅师", way: "jh 13;n;n;n;n;n;n;n;n;n;n;n;w", desc: "他是一位身材高大的中年僧人，两臂粗壮，膀阔腰圆。他手持兵刃，身穿一袭灰布镶边袈裟，似乎有一身武艺。", },
          { jh: "少林寺", loc: "地藏殿", name: "玄难大师", way: "jh 13;n;n;n;n;n;n;n;n;n;n;n;w", desc: "他是一位白须白眉的老僧，身穿一袭银丝棕黄袈裟。他身材极瘦，两手更象鸡爪一样。他双目微闭，一副没精打采的模样。", },
          { jh: "少林寺", loc: "地藏殿", name: "道正禅师", way: "jh 13;n;n;n;n;n;n;n;n;n;n;n;w", desc: "他是一位身材高大的中年僧人，两臂粗壮，膀阔腰圆。他手持兵刃，身穿一袭灰布镶边袈裟，似乎有一身武艺。", },
          { jh: "少林寺", loc: "茶室", name: "叶十二娘", way: "jh 13;n;n;n;n;n;n;n;n;n;shaolin25_op1", desc: "颇有姿色的中年女子，一双大眼里似乎隐藏著无穷愁苦、无限伤心。", },
          { jh: "少林寺", loc: "西厢房", name: "玄苦大师", way: "jh 13;n;n;n;n;n;n;n;n;w", desc: "他是一位白须白眉的老僧，身穿一袭银丝棕黄袈裟。他身材瘦高，脸上满布皱纹，手臂处青筋绽露，似乎久经风霜。", },
          { jh: "少林寺", loc: "西厢房", name: "慧合尊者", way: "jh 13;n;n;n;n;n;n;n;n;w", desc: "他是一位两鬓斑白的老僧，身穿一袭青布镶边袈裟。他身材略高，太阳穴微凸，双目炯炯有神。", },
          { jh: "少林寺", loc: "西厢房", name: "慧洁尊者", way: "jh 13;n;n;n;n;n;n;n;n;w", desc: "他是一位两鬓斑白的老僧，身穿一袭青布镶边袈裟。他身材略高，太阳穴微凸，双目炯炯有神。", },
          { jh: "少林寺", loc: "藏经阁二楼", name: "灰衣僧", way: "jh 13;n;n;n;n;n;n;n;shaolin27_op1", desc: "一名灰衣僧人，灰布蒙面，一双眼睛里透著过人的精明。" },
          { jh: "少林寺", loc: "藏经阁二楼", name: "萧远山", way: "jh 13;n;n;n;n;n;n;n;shaolin27_op1", desc: "契丹绝顶高手之一，曾随汉人学武，契丹鹰师总教头。", },
          { jh: "少林寺", loc: "藏经阁三楼", name: "守经僧人", way: "jh 13;n;n;n;n;n;n;n;shaolin27_op1;event_1_34680156", desc: "似乎常年镇守于藏经阁，稀稀疏疏的几根长须已然全白，正拿著经书仔细研究。", },
          { jh: "少林寺", loc: "西禅房", name: "盈盈", way: "jh 13;n;n;n;n;n;n;w", desc: "魔教任教主之女，有倾城之貌，闭月之姿，流转星眸顾盼生辉，发丝随意披散，慵懒不羁。", },
          { jh: "少林寺", loc: "鼓楼", name: "道尘禅师", way: "jh 13;n;n;n;n;w", desc: "他是一位身材高大的中年僧人，两臂粗壮，膀阔腰圆。他手持兵刃，身穿一袭灰布镶边袈裟，似乎有一身武艺。", },
          { jh: "少林寺", loc: "鼓楼", name: "狱卒", way: "jh 13;n;n;n;n;w", desc: "一名看起来凶神恶煞的狱卒" },
          { jh: "少林寺", loc: "西碑林", name: "道成禅师", way: "jh 13;n;n;w", desc: "他是一位身材高大的中年僧人，两臂粗壮，膀阔腰圆。他手持兵刃，身穿一袭灰布镶边袈裟，似乎有一身武艺。", },
          { jh: "少林寺", loc: "西碑林", name: "挑水僧", way: "jh 13;n;n;w", desc: "一名年轻僧人，身穿灰色僧衣。" },
          { jh: "少林寺", loc: "土路", name: "道品禅师", way: "jh 13;n;w", desc: "他是一位身材高大的中年僧人，两臂粗壮，膀阔腰圆。他手持兵刃，身穿一袭灰布镶边袈裟，似乎有一身武艺。", },
          { jh: "少林寺", loc: "土路", name: "田鼠", way: "jh 13;n;w", desc: "一只脏兮兮的田鼠，正在田间觅食。" },
          { jh: "少林寺", loc: "小院", name: "道觉禅师", way: "jh 13;n;w;w", desc: "他是一位身材高大的中年僧人，两臂粗壮，膀阔腰圆。他手持兵刃，身穿一袭灰布镶边袈裟，似乎有一身武艺。", },
          { jh: "少林寺", loc: "小院", name: "小孩", way: "jh 13;n;w;w", desc: "一个农家小孩，不知道在这里干什么。" },
          { jh: "唐门", loc: "南津关", name: "高一毅", way: "jh 14;e", desc: "五代十国神枪王后人，英气勃发，目含剑气。" },
          { jh: "唐门", loc: "张宪祠", name: "张之岳", way: "jh 14;e;event_1_10831808;n", desc: "张宪之子，身形高大，威风凛凛" },
          { jh: "唐门", loc: "", name: "紫衣剑客", way: "", desc: "傲然而立，一脸严肃，好像是在瞪著你一样。" },
          { jh: "唐门", loc: "", name: "独臂剑客", way: "", desc: "他一生守护在这，剑重要过他的生命。" },
          { jh: "唐门", loc: "", name: "青衣剑客", way: "", desc: "一个风程仆仆的侠客。" },
          { jh: "唐门", loc: "", name: "黑衣剑客", way: "", desc: "一身黑衣，手持长剑，就像世外高人一样。" },
          { jh: "唐门", loc: "", name: "无情剑客", way: "", desc: "神秘的江湖侠客，如今在这里不知道作甚么。" },
          { jh: "唐门", loc: "浣花剑碑", name: "程倾城", way: "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e", desc: "曾是两淮一代最有天赋的年轻剑客，在观海庄追杀徽北剧盗之战一剑破对方七人刀阵，自此“倾城剑客”之名响彻武林。", },
          { jh: "唐门", loc: "浣花剑池入口", name: "无名剑客", way: "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;e", desc: "一位没有名字的剑客，他很可能是曾经冠绝武林的剑术高手。", },
          { jh: "唐门", loc: "瑶光池", name: "默剑客", way: "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;e;e", desc: "这是一个沉默不语的剑客，数年来不曾说过一句话，专注地参悟著剑池绝学。", },
          { jh: "唐门", loc: "破军剑阁", name: "竺霁庵", way: "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;e;e;n", desc: "湖竺家一门七进士，竺霁庵更是天子门生独占鳌头，随身喜携带一柄折扇。后因朝廷乱政心灰意冷，弃仕从武，更拜入少林成为俗家弟子。不足二十三岁便学尽少林绝学，武功臻至登峰造极之化境。后在燕北之地追凶时偶遇当时也是少年的鹿熙吟和谢麟玄，三人联手血战七日，白袍尽赤，屠尽太行十八夜骑。三人意气相投，志同道合，结为异姓兄弟，在鹿谢二人引荐下，终成为浣花剑池这一代的破军剑神。", },
          { jh: "唐门", loc: "武曲剑阁", name: "甄不恶", way: "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;e;e;n;ne", desc: "他的相貌看起来是那么宁静淡泊、眼睛眉毛都透著和气，嘴角弯弯一看就象个善笑的人。他不象个侠客，倒象一个孤隐的君子。不了解的人总是怀疑清秀如竹的他怎么能拿起手中那把重剑？然而，他确是浣花剑派最嫉恶如仇的剑神，武林奸邪最惧怕的名字，因为当有恶人听到『甄不恶』被他轻轻从嘴里吐出，那便往往是他听到的最后三个字。", },
          { jh: "唐门", loc: "廉贞剑阁", name: "素厉铭", way: "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;e;e;n;ne;e", desc: "本是淮南渔家子弟，也并无至高的武学天赋，然其自幼喜观察鱼虫鸟兽，竟不自觉地悟出了一套气脉运转的不上心法。后因此绝学获难，被千夜旗余孽追杀，欲夺其心法为己用。上代封山剑主出手相救，并送至廉贞剑神门下，专心修炼内功，最终竟凭借其一颗不二之心，成就一代剑神。", },
          { jh: "唐门", loc: "七杀剑阁", name: "骆祺樱", way: "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;e;e;n;ne;e;se", desc: "塞外武学世家骆家家主的千金，自幼聪慧无比，年纪轻轻便习尽骆家绝学，十八岁通过剑池试炼，成为剑池数百年来最年轻的七杀剑神。她双眸似水，却带著谈谈的冰冷，似乎能看透一切；四肢纤长，有仙子般脱俗气质。她一袭白衣委地，满头青丝用蝴蝶流苏浅浅绾起，虽峨眉淡扫，不施粉黛，却仍然掩不住她的绝世容颜。", },
          { jh: "唐门", loc: "天梁剑阁", name: "谢麟玄", way: "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;e;e;n;ne;e;se;s;se", desc: "一袭青缎长衫，儒雅中透著英气，好一个翩翩公子。书香门第之后，其剑学领悟大多出自绝世的琴谱，棋谱，和书画，剑法狂放不羁，处处不合武学常理，却又有著难以言喻的写意和潇洒。他擅长寻找对手的薄弱环节，猛然一击，敌阵便土崩瓦解。", },
          { jh: "唐门", loc: "巨门剑阁", name: "祝公博", way: "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;e;e;n;ne;e;se;s;se;e", desc: "曾经的湘西农家少年，全家遭遇匪祸，幸得上一代巨门剑神出手相救。剑神喜其非凡的武学天赋和不舍不弃的勤奋，收作关门弟子，最终得以承接巨门剑神衣钵。祝公博嫉恶如仇，公正不阿，视天道正义为世间唯一准则。", },
          { jh: "唐门", loc: "紫薇池", name: "黄衫少女", way: "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;e;e;n;ne;e;se;s;se;e;ne", desc: "身著鹅黄裙衫的少女，一席华贵的栗色秀发真达腰际，碧色的瞳孔隐隐透出神秘。她见你走过来，冲你轻轻一笑。", },
          { jh: "唐门", loc: "贪狼剑阁", name: "鹿熙吟", way: "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;e;e;n;ne;e;se;s;se;e;ne;n", desc: "浣花剑派当世的首席剑神，他身形挺拔，目若朗星。虽然已是中年，但岁月的雕琢更显出他的气度。身为天下第一剑派的首席，他待人和善，却又不怒自威。百晓公见过鹿熙吟之后，惊为天人，三月不知如何下笔，最后据说在百晓图录贪狼剑神鹿熙吟那一页，只留下了两个字：不凡。他的家世出身是一个迷，从来无人知晓。", },
          { jh: "唐门", loc: "唐门牌坊", name: "唐门弟子", way: "jh 14;w;n", desc: "这是唐门的弟子，不苟言笑。" },
          { jh: "唐门", loc: "唐门厨房", name: "唐门弟子", way: "jh 14;w;n;n;n;e;s", desc: "这是唐门的弟子，不苟言笑。" },
          { jh: "唐门", loc: "唐门前院", name: "唐风", way: "jh 14;w;n;n", desc: "唐风是唐门一个神秘之人，世人对他知之甚少。他在唐门默默地传授武艺，极少说话。", },
          { jh: "唐门", loc: "狭长小道", name: "唐看", way: "jh 14;w;n;n;n", desc: "这是嫡系死士之一，一身的功夫却是不凡。" },
          { jh: "唐门", loc: "练武广场", name: "黄色唐门弟子", way: "jh 14;w;n;n;n;e;e;n", desc: "" },
          { jh: "唐门", loc: "练武广场", name: "唐健", way: "jh 14;w;n;n;n;e;e;n", desc: "他身怀绝技，心气也甚高。" },
          { jh: "唐门", loc: "练武广场", name: "(黄色)唐门弟子", way: "jh 14;w;n;n;n;e;e;n", desc: "这是唐门的弟子，不苟言笑。" },
          { jh: "唐门", loc: "授艺亭", name: "唐舌", way: "jh 14;w;n;n;n;e;e;n;e", desc: "这是嫡系死士之一，一身的功夫却是不凡。用毒高手。" },
          { jh: "唐门", loc: "后院", name: "唐情", way: "jh 14;w;n;n;n;e;e;n;n", desc: "一个小女孩，十分可爱。" },
          { jh: "唐门", loc: "后院", name: "唐刚", way: "jh 14;w;n;n;n;e;e;n;n", desc: "一个尚未成年的小男孩，但也已经开始学习唐门的武艺。" },
          { jh: "唐门", loc: "地室", name: "欧阳敏", way: "jh 14;w;n;n;n;e;e;n;n;ask tangmen_tangmei;ask tangmen_tangmei;e;唐门:拜箭亭^兵器室;n;n", desc: "一个老妇人，眼睛中射出道道精光，一看就是武艺高强之人。", },
          { jh: "唐门", loc: "会客室", name: "方媃", way: "jh 14;w;n;n;n;n", desc: "一个美丽的中年妇女，使得一手好暗器。" },
          { jh: "唐门", loc: "会客室", name: "唐怒", way: "jh 14;w;n;n;n;n", desc: "唐门门主，在江湖中地位很高。" },
          { jh: "唐门", loc: "东侧房", name: "唐鹤", way: "jh 14;w;n;n;n;w;s", desc: "唐门中的高层，野心很大，一直想将唐门称霸武林。" },
          { jh: "唐门", loc: "唐镖卧室", name: "唐镖", way: "jh 14;w;n;n;n;w;w;s", desc: "唐门中所有的绝门镖法，他都会用。" },
          { jh: "唐门", loc: "唐芳卧室", name: "唐芳", way: "jh 14;w;n;n;n;w;w;w;n", desc: "虽然是一个少女，但武艺已达精进之境界了。" },
          { jh: "唐门", loc: "唐缘卧室", name: "唐缘", way: "jh 14;w;n;n;n;w;w;w;s", desc: "人如其名，虽然年幼，但已是能看出美人胚子了。" },
          { jh: "青城山", loc: "练武场", name: "白衣镖师", way: "jh 15;s;s;s;w;w;s;s", desc: "这个镖师穿著一身白衣。" },
          { jh: "青城山", loc: "青城大门", name: "侯老大", way: "jh 15;n;nw;w;nw;w;s;s", desc: "他就是「英雄豪杰，青城四秀」之一，武功也远高同门。" },
          { jh: "青城山", loc: "福州大街", name: "福州捕快", way: "jh 15;s;s;s;s;s", desc: "福州的捕快，整天懒懒散散，不务正业。" },
          { jh: "青城山", loc: "福州南门", name: "童泽", way: "jh 15;s;s;s;s;s;s", desc: "一个青年人，眼神有悲伤、亦有仇恨。" },
          { jh: "青城山", loc: "石拱桥", name: "童隆", way: "jh 15;s;s;s;s;s;s;sw", desc: "一个眼神凶恶的老头，身材有点佝偻。" },
          { jh: "青城山", loc: "", name: "林老镖头", way: ".靠谜题飞", desc: "他就是「福武镖局」的总镖头。" },
          { jh: "青城山", loc: "北郊", name: "海公公", way: "jh 15", desc: "海公公是皇帝身边的红人，不知为什么在此？" },
          { jh: "青城山", loc: "小径", name: "游方郎中", way: "jh 15;n", desc: "一个到处贩卖药材的赤脚医生。" },
          { jh: "青城山", loc: "龙晶石洞", name: "孽龙之灵", way: "jh 15;n;nw;w;nw;n;event_1_14401179", desc: "当年为害岷水的孽龙，为李冰父子收服，魂魄不散，凝聚于此，看守洞内龙魄。", },
          { jh: "青城山", loc: "龙晶石洞", name: "孽龙分身", way: "jh 15;n;nw;w;nw;n;event_1_14401179", desc: "孽龙分身，不可小视。" },
          { jh: "青城山", loc: "龙晶石洞", name: "暗甲盟主", way: "jh 15;n;nw;w;nw;n;event_1_14401179;event_1_80293122;n;n", desc: "暗誓盟巴蜀据点的盟主。" },
          { jh: "青城山", loc: "龙晶石洞", name: "暗甲将领", way: "jh 15;n;nw;w;nw;n;event_1_14401179;event_1_80293122;n;n", desc: "一个风程仆仆的侠客。", },
          { jh: "青城山", loc: "青城大门", name: "青城弟子", way: "jh 15;n;nw;w;nw;w;s;s", desc: "青城派的弟子，年纪刚过二十，武艺不错，资质上乘。" },
          { jh: "青城山", loc: "青城大门", name: "严月青", way: "jh 15;n;nw;w;nw;w;s;s", desc: "他就是「英雄豪杰，青城四秀」之一，武功也远高同门。" },
          { jh: "青城山", loc: "青城大门", name: "青城派弟子", way: "jh 15;n;nw;w;nw;w;s;s", desc: "青城派的弟子，年纪刚过二十，武艺还过得去。" },
          { jh: "青城山", loc: "解剑石", name: "申月富", way: "jh 15;n;nw;w;nw;w;s;s;s", desc: "他就是「英雄豪杰，青城四秀」之一，武功也远高同门。" },
          { jh: "青城山", loc: "演武堂", name: "吉人英", way: "jh 15;n;nw;w;nw;w;s;s;s;;kill qingcheng_renjie;w;w", desc: "他就是和申人俊焦孟不离的吉人通。" },
          { jh: "青城山", loc: "小室", name: "贾老二", name_new: "孟月城", way: "jh 15;n;nw;w;nw;w;s;s;s;;kill qingcheng_renjie;w;w;n", desc: "他就是「青城派」中最为同门不齿、最下达的家伙。", },
          { jh: "青城山", loc: "松风观", name: "余大掌门", name_new: "吕朝阳", way: "jh 15;n;nw;w;nw;w;s;s;s;;kill qingcheng_renjie;w;w;w", desc: "青城派十八代掌门人", },
          { jh: "青城山", loc: "青城走廊", name: "黄袍老道", way: "jh 15;n;nw;w;nw;w;s;s;s;;kill qingcheng_renjie;w;w;w;n", desc: "一个穿著黄色道袍的老道士。", },
          { jh: "青城山", loc: "青城走廊", name: "青袍老道", way: "jh 15;n;nw;w;nw;w;s;s;s;;kill qingcheng_renjie;w;w;w;n", desc: "一个穿著青色道袍的老道士。" },
          { jh: "青城山", loc: "青城山走廊", name: "于老三", way: "jh 15;n;nw;w;nw;w;s;s;s;;kill qingcheng_renjie;w;w;w;n;w", desc: "他就是「英雄豪杰，青城四秀」之一，武功也远高同门。", },
          { jh: "青城山", loc: "义庄", name: "仵作", way: "jh 15;s;ne", desc: "这是福州城外的一个仵作，专门检验命案死尸。" },
          { jh: "青城山", loc: "福州大街", name: "恶少", way: "jh 15;s;s", desc: "这是福州城中人见人恶的恶少，最好别惹。" },
          { jh: "青城山", loc: "福州大街", name: "仆人", way: "jh 15;s;s", desc: "恶少带著这个仆人，可是威风得紧的。" },
          { jh: "青城山", loc: "小肉铺", name: "屠夫", way: "jh 15;s;s;e", desc: "一个卖肉的屠夫。" },
          { jh: "青城山", loc: "四季花店", name: "小甜", way: "jh 15;s;s;s;e", desc: "花店中卖花的姑娘，花衬人脸，果然美不胜收。" },
          { jh: "青城山", loc: "书院", name: "读千里", way: "jh 15;s;s;s;s;e", desc: "此人学富五车，摇头晃脑，只和人谈史论经。" },
          { jh: "青城山", loc: "福州官衙", name: "福州府尹", way: "jh 15;s;s;s;s;s;e", desc: "此人官架子很大。" },
          { jh: "青城山", loc: "剑庐", name: "背剑老人", way: "jh 15;s;s;s;s;s;s;s;s;s;e;s", desc: "揹著一把普通的剑，神态自若，似乎有一股剑势与围于周身，退隐江湖几十年，如今沉醉于花道。", },
          { jh: "青城山", loc: "小河边", name: "木道神", name_new: "林长老", way: "jh 15;s;s;s;s;s;s;w", desc: "他是青城山的祖师级人物了，年纪虽大，但看不出岁月沧桑。" },
          { jh: "青城山", loc: "武器店", name: "兵器贩子", way: "jh 15;s;s;s;s;w", desc: "一个贩卖兵器的男子，看不出有什么来历。" },
          { jh: "青城山", loc: "镖局车站", name: "阿美", way: "jh 15;s;s;s;w;w;n", desc: "此人三十来岁，专门福州驾驶马车。" },
          { jh: "青城山", loc: "练武场", name: "红衣镖师", way: "jh 15;s;s;s;w;w;s;s", desc: "这个镖师穿著一身红衣。" },
          { jh: "青城山", loc: "练武场", name: "黄衣镖师", way: "jh 15;s;s;s;w;w;s;s", desc: "这个镖师穿著一身黄衣。" },
          { jh: "青城山", loc: "练武场", name: "镖局弟子", way: "jh 15;s;s;s;w;w;s;s", desc: "福威镖局的弟子。" },
          { jh: "青城山", loc: "内宅", name: "林师弟", way: "jh 15;s;s;s;w;w;w;w;w;n", desc: "林师弟是华山众最小的一个弟子。" },
          { jh: "青城山", loc: "无醉酒家", name: "店小二", way: "jh 15;s;s;w", desc: "这个店小二忙忙碌碌，招待客人手脚利索。" },
          { jh: "青城山", loc: "无醉酒家", name: "酒店老板", way: "jh 15;s;s;w", desc: "酒店老板是福州城有名的富人。" },
          { jh: "青城山", loc: "酒家二楼", name: "女侍", way: "jh 15;s;s;w;n", desc: "这是一个女店小二，在福州城内，可是独一无二哦。" },
          { jh: "青城山", loc: "酒家二楼", name: "酒店女老板", way: "jh 15;s;s;w;n", desc: "一个漂亮的女老板，体格风骚。" },
          { jh: "逍遥林", loc: "石室", name: "逍遥祖师", way: "jh 16;s;s;s;s;e;n;e;event_1_5221690;s;w;event_1_57688376;n;n;event_1_38333366;event_1_38333366;event_1_38333366;event_1_38333366;event_1_38333366;event_1_38333366;event_1_38333366;place?石室", desc: "他就是逍遥派开山祖师、但是因为逍遥派属于一个在江湖中的秘密教派，所以他在江湖中不是很多人知道，但其实他的功夫却是。。。。他年满七旬，满脸红光，须眉皆白。", },
          { jh: "逍遥林", loc: "林间小道", name: "吴统领", way: "jh 16;s;s;s;s;e;e;s;w", desc: "他雅擅丹青，山水人物，翎毛花卉，并皆精巧。拜入师门之前，在大宋朝廷做过领军将军之职，因此大家便叫他吴统领。", },
          { jh: "逍遥林", loc: "林间小道", name: "蒙面人", way: "jh 16;s;s;s;s;e;e;s;w", desc: "一个蒙著面部，身穿黑色夜行衣服的神秘人。" },
          { jh: "逍遥林", loc: "石屋", name: "范棋痴", way: "jh 16;s;s;s;s;e;e;s;w;n", desc: "他师从聪辩先生，学的是围棋，当今天下，少有敌手" },
          { jh: "逍遥林", loc: "工匠屋", name: "冯巧匠", way: "jh 16;s;s;s;s;e;e;s;w;s;s", desc: "据说他就是鲁班的后人，本来是木匠出身。他在精于土木工艺之学，当代的第一巧匠，设计机关的能手。", },
          { jh: "逍遥林", loc: "青草坪", name: "苏先生", way: "jh 16;s;s;s;s;e;e;s;w;w", desc: "此人就是苏先生，据说他能言善辩，是一个武林中的智者，而他的武功也是无人能知。", },
          { jh: "逍遥林", loc: "林间小道", name: "石师妹", way: "jh 16;s;s;s;s;e;e;s;w;w;n", desc: "师妹，精于莳花，天下她精于莳花，天下的奇花异卉，一经她的培植，无不欣欣向荣。", },
          { jh: "逍遥林", loc: "小木屋", name: "薛神医", way: "jh 16;s;s;s;s;e;e;s;w;w;n;n", desc: "据说他精通医理，可以起死回生。" },
          { jh: "逍遥林", loc: "木屋", name: "康琴癫", way: "jh 16;s;s;s;s;e;e;s;w;w;s;s", desc: "只见他高额凸颡，容貌奇古，笑眯眯的脸色极为和谟，手中抱著一具瑶琴。", },
          { jh: "逍遥林", loc: "林间小道", name: "苟书痴", name_new: "张通鉴", way: "jh 16;s;s;s;s;e;e;s;w;w;w", desc: "他看上去也是几十岁的人了，性好读书，诸子百家，无所不窥，是一位极有学问的宿儒，却是纯然一个书呆子的模样。", },
          { jh: "逍遥林", loc: "酒家", name: "李唱戏", way: "jh 16;s;s;s;s;e;e;s;w;w;w;w;s", desc: "他看起来青面獠牙，红发绿须，形状可怕之极，直是个妖怪，身穿一件亮光闪闪的锦袍。他一生沉迷扮演戏文，疯疯颠颠，于这武学一道，不免疏忽了。", },
          { jh: "逍遥林", loc: "石室", name: "天山姥姥", name_new: "童冰烟", way: "jh 16;s;s;s;s;e;n;e;event_1_5221690;s;w;event_1_57688376;n;n;e;n;event_1_88625473;event_1_82116250;event_1_90680562;event_1_38586637", desc: "她乍一看似乎是个十七八岁的女子，可神情却是老气横秋。双目如电，炯炯有神，向你瞧来时，自有一股凌人的威严。", },
          { jh: "逍遥林", loc: "马帮驻地", name: "常一恶", way: "jh 16;s;s;s;s;e;n;e;event_1_56806815", desc: "马帮帮主，总管事，喜欢钱财的老狐狸。" },
          { jh: "开封", loc: "御街南", name: "白玉堂", way: "jh 17;n", desc: "金华人氏，因少年华美，气宇不凡，文武双全，故人称'锦毛鼠'。他武艺高强、聪明特达、性情高傲、正邪分明、扶危济困、行侠仗义、浑身是胆、为国为民，后被宋仁宗赞赏。", },
          { jh: "开封", loc: "沿河大街", name: "玄衣少年", way: "jh 17;n;n;e;e", desc: "一身玄衣的一个少年，似乎对开封的繁华十分向往。" },
          { jh: "开封", loc: "御碑亭", name: "七煞堂总舵主", way: "jh 17;e;s;s;s;e;kaifeng_yuwangtai23_op1", desc: "这是七煞堂总舵主，看起道貌岸然，但眼神藏有极深的戾气。", },
          { jh: "开封", loc: "御碑亭", name: "七煞堂护法", way: "jh 17;e;s;s;s;e;kaifeng_yuwangtai23_op1", desc: "武功高强的护卫，乃总舵主的贴身心腹。", },
          { jh: "开封", loc: "贡院", name: "张老知府", way: "jh 17;n;n;n;e", desc: "开封的前任知府大人，如今虽退休多年，但仍然忧国忧民。" },
          { jh: "开封", loc: "朱雀门", name: "骆驼", way: "jh 17", desc: "这是一条看起来有些疲惫的骆驼。" },
          { jh: "开封", loc: "官道", name: "官兵", way: "jh 17;e", desc: "这是一名官兵，虽然武艺不能跟武林人士比，但他们靠的是人多力量大。" },
          { jh: "开封", loc: "树林", name: "七煞堂弟子", way: "jh 17;e;s", desc: "江湖上臭名昭著的七煞堂弟子，最近经常聚集在禹王台，不知道有什么阴谋。" },
          { jh: "开封", loc: "菊园小径", name: "七煞堂打手", way: "jh 17;e;s;s", desc: "七煞堂打手，还有点功夫的。" },
          { jh: "开封", loc: "前院", name: "七煞堂护卫", way: "jh 17;e;s;s;s;s", desc: "七煞堂护卫，似乎有一身武艺。" },
          { jh: "开封", loc: "禹王庙", name: "七煞堂堂主", way: "jh 17;e;s;s;s;s;s", desc: "这是七煞堂堂主，看起来一表人才，不过据说手段极为残忍。" },
          { jh: "开封", loc: "羊肠小道", name: "毒蛇", way: "jh 17;event_1_97081006", desc: "一条剧毒的毒蛇。" },
          { jh: "开封", loc: "野猪林入口", name: "野猪", way: "jh 17;event_1_97081006;s", desc: "一只四肢强健的野猪，看起来很饿。" },
          { jh: "开封", loc: "荆棘丛", name: "黑鬃野猪", way: "jh 17;event_1_97081006;s;s;s;s", desc: "这是一直体型较大的野猪，一身黑色鬃毛。" },
          { jh: "开封", loc: "野猪窝", name: "野猪王", way: "jh 17;event_1_97081006;s;s;s;s;s", desc: "这是野猪比普通野猪体型大了近一倍，一身棕褐色鬃毛竖立著，看起来很凶残。", },
          { jh: "开封", loc: "杂草小路", name: "野猪", way: "jh 17;event_1_97081006;s;s;s;s;s;w", desc: "一只四肢强健的野猪，看起来很饿。" },
          { jh: "开封", loc: "破烂小屋", name: "白面人", way: "jh 17;event_1_97081006;s;s;s;s;s;w;kaifeng_yezhulin05_op1", desc: "一个套著白色长袍，带著白色面罩的人，犹如鬼魅，让人见之心寒。", },
          { jh: "开封", loc: "木屋据点", name: "鹤发老人", way: "jh 17;event_1_97081006;s;s;s;s;s;w;w", desc: "此人愚钝好酒，但武功卓绝，乃是一代武林高手。经常与鹿杖老人同闯武林。", },
          { jh: "开封", loc: "木屋据点", name: "鹿杖老人", way: "jh 17;event_1_97081006;s;s;s;s;s;w;w", desc: "此人好色奸诈，但武功卓绝，乃是一代武林高手。经常与鹤发老人同闯武林。", },
          { jh: "开封", loc: "御街南", name: "灯笼小贩", way: "jh 17;n", desc: "这是一个勤劳朴实的手艺人，据说他做的灯笼明亮又防风。" },
          { jh: "开封", loc: "御街南", name: "小男孩", way: "jh 17;n", desc: "一个衣衫褴褛，面有饥色的10多岁小男孩，正跪在大堂前，眼里布满了绝望！" },
          { jh: "开封", loc: "开封府", name: "欧阳春", way: "jh 17;n;e", desc: "这是大名鼎鼎的北侠。" },
          { jh: "开封", loc: "开封府", name: "展昭", way: "jh 17;n;e", desc: "这就是大名鼎鼎的南侠。" },
          { jh: "开封", loc: "开封府大堂", name: "包拯", way: "jh 17;n;e;s", desc: "他就是朝中的龙图大学士包丞相。只见他面色黝黑，相貌清奇，气度不凡。让你不由自主，好生敬仰。", },
          { jh: "开封", loc: "州桥", name: "皮货商", way: "jh 17;n;n", desc: "这是一位皮货商，他自己也是满身皮裘。" },
          { jh: "开封", loc: "汴河大街东", name: "武官", way: "jh 17;n;n;e", desc: "这名武官看起来养尊处优，不知道能不能出征打仗。" },
          { jh: "开封", loc: "沿河大街", name: "菜贩子", way: "jh 17;n;n;e;e", desc: "一个老实巴交的农民，卖些新鲜的蔬菜" },
          { jh: "开封", loc: "汴河码头", name: "码头工人", way: "jh 17;n;n;e;e;n", desc: "这是一名膀大腰圆的码头工人，也许不会什么招式，但力气肯定是有的。", },
          { jh: "开封", loc: "客船", name: "落魄书生", way: "jh 17;n;n;e;e;n;get_silver", desc: "一名衣衫褴褛的书生，右手摇著一柄破扇，面色焦黄，两眼无神。", },
          { jh: "开封", loc: "货运栈", name: "船老大", way: "jh 17;n;n;e;e;n;n", desc: "看起来精明能干的中年男子，坚毅的眼神让人心生敬畏。" },
          { jh: "开封", loc: "王家纸马店", name: "王老板", way: "jh 17;n;n;e;e;s", desc: "王家纸马店老板，为人热诚。" },
          { jh: "开封", loc: "石拱门", name: "高衙内", way: "jh 17;n;n;e;s", desc: "这就是开封府内恶名远扬的高衙内，专一爱调戏淫辱良家妇女。" },
          { jh: "开封", loc: "八宝琉璃殿", name: "护寺僧人", way: "jh 17;n;n;e;s;s", desc: "他是一位身材高大的青年僧人，两臂粗壮，膀阔腰圆。他手持兵刃，身穿一袭白布镶边袈裟，似乎有一身武艺。", },
          { jh: "开封", loc: "后院", name: "烧香老太", way: "jh 17;n;n;e;s;s;s", desc: "一个见佛烧香的老太太，花白的头发松散的梳著发髻，满是皱纹的脸上愁容密布。", },
          { jh: "开封", loc: "明廊", name: "泼皮", way: "jh 17;n;n;e;s;s;s;e", desc: "大相国寺附近的泼皮，常到菜园中偷菜。" },
          { jh: "开封", loc: "菜地", name: "老僧人", way: "jh 17;n;n;e;s;s;s;e;e", desc: "一个老朽的僧人，脸上满是皱纹，眼睛都睁不开来了" },
          { jh: "开封", loc: "柴房", name: "烧火僧人", way: "jh 17;n;n;e;s;s;s;e;s", desc: "一名专职在灶下烧火的僧人。" },
          { jh: "开封", loc: "竹林小径", name: "张龙", way: "jh 17;n;n;e;s;s;s;s", desc: "这便是开封府霍霍有名的捕头张龙，他身体强壮，看上去武功不错。", },
          { jh: "开封", loc: "放生池", name: "孔大官人", way: "jh 17;n;n;e;s;s;s;s;w", desc: "开封府中的富户，最近家中似乎有些变故。" },
          { jh: "开封", loc: "素斋厨", name: "素斋师傅", way: "jh 17;n;n;e;s;s;s;w", desc: "在寺庙中烧饭的和尚。" },
          { jh: "开封", loc: "御街北", name: "李四", way: "jh 17;n;n;n", desc: "他长得奸嘴猴腮的，一看就不像是个好人。" },
          { jh: "开封", loc: "贡院", name: "陈举人", way: "jh 17;n;n;n;e", desc: "看起来有些酸腐的书生，正在查看贡院布告牌。" },
          { jh: "开封", loc: "西角楼大街", name: "流浪汉", way: "jh 17;n;n;n;n", desc: "这是一名看上去老实巴交的流浪汉，听说他跟官府有交情，最好不要招惹。", },
          { jh: "开封", loc: "雅瓷轩", name: "富家弟子", way: "jh 17;n;n;n;n;e", desc: "一个白白胖胖的年轻人，一看就知道是娇生惯养惯的富家子。" },
          { jh: "开封", loc: "天波门", name: "赵虎", way: "jh 17;n;n;n;n;n", desc: "这便是开封府霍霍有名的捕头赵虎，他身体强壮，看上去武功不错。" },
          { jh: "开封", loc: "溪边小路", name: "踏青妇人", way: "jh 17;n;n;n;n;n;e", desc: "春天出来游玩的妇人，略有姿色。" },
          { jh: "开封", loc: "瓦屋", name: "平夫人", way: "jh 17;n;n;n;n;n;e;n;n", desc: "方面大耳，眼睛深陷，脸上全无血色。" },
          { jh: "开封", loc: "柳树林", name: "恶狗", way: "jh 17;n;n;n;n;n;e;n;n;n", desc: "这是一条看家护院的恶狗。" },
          { jh: "开封", loc: "炼药房", name: "平怪医", way: "jh 17;n;n;n;n;n;e;n;n;n;event_1_27702191", desc: "他身材矮胖，脑袋极大，生两撇鼠须，摇头晃脑，形相十分滑稽。", },
          { jh: "开封", loc: "天波府", name: "杨排风", way: "jh 17;n;n;n;n;w", desc: "容貌俏丽，风姿绰约，自幼在天波杨门长大，性情爽直勇敢，平日里常跟穆桂英练功习武，十八般武艺样样在行。曾被封为“征西先锋将军”，大败西夏国元帅殷奇。因为是烧火丫头出身，且随身武器是烧火棍，所以被宋仁宗封为“火帅”。又因为，民间称赞其为“红颜火帅”。", },
          { jh: "开封", loc: "天波府", name: "天波侍卫", way: "jh 17;n;n;n;n;w", desc: "天波府侍卫，个个均是能征善战的勇士！" },
          { jh: "开封", loc: "中院", name: "柴郡主", way: "jh 17;n;n;n;n;w;w;w", desc: "六郎之妻，为后周世宗柴荣之女，宋太祖赵匡胤敕封皇御妹金花郡主。一名巾帼英雄、女中豪杰，成为当时著名的杨门女将之一，有当时天下第一美女之称。", },
          { jh: "开封", loc: "北院", name: "穆桂英", way: "jh 17;n;n;n;n;w;w;w;n;n", desc: "穆柯寨穆羽之女，有沉鱼落雁之容，且武艺超群，巾帼不让须眉。传说有神女传授神箭飞刀之术。因阵前与杨宗保交战，穆桂英生擒宗保并招之成亲，归于杨家将之列，为杨门女将中的杰出人物。", },
          { jh: "开封", loc: "演兵场", name: "杨文姬", way: "jh 17;n;n;n;n;w;w;w;n;n;w", desc: "乃天波杨门么女。体态文秀儒雅、有惊鸿之貌，集万千宠爱于一身，被杨门一族视为掌上明珠。其武学集杨门之大成，却又脱胎于杨门自成一格，实属武林中不可多得的才女。", },
          { jh: "开封", loc: "回廊", name: "侍女", way: "jh 17;n;n;n;n;w;w;w;s", desc: "一个豆蔻年华的小姑娘，看其身手似也是有一点武功底子的呢。" },
          { jh: "开封", loc: "天波碧潭", name: "佘太君", way: "jh 17;n;n;n;n;w;w;w;s;s;w", desc: "名将之女，自幼受其父兄武略的影响，青年时候就成为一名性机敏、善骑射，文武双全的女将。她与普通的大家闺秀不同，她研习兵法，颇通将略，把戍边御侵、保卫疆域、守护中原民众为己任，协助父兄练兵把关，具备巾帼英雄的气度。夫君边关打仗，她在杨府内组织男女仆人丫环习武，仆人的武技和忠勇之气个个都不亚于边关的士兵。", },
          { jh: "开封", loc: "天波楼", name: "杨延昭", way: "jh 17;n;n;n;n;w;w;w;w", desc: "杨延昭是北宋抗辽名将杨业的长子，契丹人认为北斗七星中的第六颗主镇幽燕北方，是他们的克星，辽人将他看做是天上的六郎星宿下凡，故称为杨六郎。", },
          { jh: "开封", loc: "汴河大街西", name: "新郎官", way: "jh 17;n;n;w", desc: "这是一名披著大红花的新郎官，脸上喜气洋洋。" },
          { jh: "开封", loc: "稻香居", name: "混混张三", way: "jh 17;n;n;w;n", desc: "他长得奸嘴猴腮的，一看就不像是个好人。" },
          { jh: "开封", loc: "稻香居二楼", name: "铁翼", way: "jh 17;n;n;w;n;n", desc: "他是大旗门的元老。他刚正不阿，铁骨诤诤。" },
          { jh: "开封", loc: "稻香居二楼", name: "刘财主", way: "jh 17;n;n;w;n;n", desc: "开封府中的富户，看起来脑满肠肥，养尊处优。" },
          { jh: "开封", loc: "药铺", name: "赵大夫", way: "jh 17;n;w", desc: "赵大夫医术高明，尤其善治妇科各种疑难杂症。" },
          { jh: "开封", loc: "郊外别院", name: "新娘", way: "jh 17;sw;nw", desc: "新郎官的未婚妻，被高衙内抓到此处。" },
          { jh: "开封", loc: "桥底密室", name: "耶律夷烈", way: "jh 17;sw;s;sw;nw;ne;event_1_38940168", desc: "辽德宗耶律大石之子，身材高大，满面虬髯。" },
          { jh: "明教", loc: "链桥", name: "杨左使", name_new: "梁风", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;e;e;n;n;n", desc: "明教光明左使。" },
          { jh: "明教", loc: "观景台", name: "神秘女子", way: "jh 18;n;nw;n;n;w", desc: "这是一个女子" },
          { jh: "明教", loc: "盗洞", name: "蒙面人", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n;n;n;n;n;event_1_90080676;event_1_56007071;e;ne;n;nw", desc: "用厚厚面巾蒙著脸上的武士，看不清他的真面目。", },
          { jh: "明教", loc: "小村", name: "村民", way: "jh 18", desc: "这是村落里的一个村名。" },
          { jh: "明教", loc: "屋子", name: "沧桑老人", way: "jh 18;e", desc: "这是一个满脸沧桑的老人。" },
          { jh: "明教", loc: "巨石", name: "明教小圣使", way: "jh 18;n;nw;n;n;n;n;n", desc: "他是一个明教小圣使。" },
          { jh: "明教", loc: "巨木旗大厅", name: "闻旗使", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n", desc: "他是明教巨林旗掌旗使。" },
          { jh: "明教", loc: "明教", name: "韦蝠王", name_new: "季燕青", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n", desc: "明教四大护法之一，传说喜好吸人鲜血。", },
          { jh: "明教", loc: "大空地", name: "彭散玉", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n", desc: "明教五散仙之一。" },
          { jh: "明教", loc: "洪水旗大厅", name: "唐旗使", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;e;e", desc: "他是明教白水旗掌旗使。" },
          { jh: "明教", loc: "大空地", name: "周散仙", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;e;e;n", desc: "明教五散仙之一" },
          { jh: "明教", loc: "锐金旗", name: "庄旗使", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;e;e;n;n", desc: "明教耀金旗掌旗使。" },
          { jh: "明教", loc: "大空地", name: "冷步水", name_new: "冷脸先生", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n", desc: "他是明教五散仙之一。在他僵硬的面孔上看不出一点表情。", },
          { jh: "明教", loc: "遇水堂", name: "张散仙", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;e", desc: "明教五散仙之一。长于风雅之做。" },
          { jh: "明教", loc: "明教偏殿", name: "冷文臻", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n", desc: "冷步水的侄子，较为自傲，且要面子。" },
          { jh: "明教", loc: "列英堂", name: "殷鹰王", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n", desc: "他就是赫赫有名的白眉鹰王，张大教主的外公，曾因不满明教的混乱，独自创立了飞鹰教，自从其外孙成为教主之后，便回归了明教", },
          { jh: "明教", loc: "列英堂", name: "明教教众", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n", desc: "他是身材矮小，两臂粗壮，膀阔腰圆。他手持兵刃，身穿一黑色圣衣，似乎有一身武艺。", },
          { jh: "明教", loc: "狮王殿", name: "谢狮王", name_new: "仇毕烈", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n;e", desc: "他就是赫赫有名的金发狮王，张大教主的义父，生性耿直，只因满心仇恨和脾气暴躁而做下了许多憾事。", },
          { jh: "明教", loc: "明教大殿", name: "张教主", name_new: "九阳君", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n;n", desc: "年方二十多岁的年轻人。明教现今正统教主，武功集各家之长最全面，修为当世之罕见。", },
          { jh: "明教", loc: "圣火桥", name: "范右使", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n;n;n", desc: "明教光明右使。" },
          { jh: "明教", loc: "黑金桥", name: "小昭", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n;n;n;n", desc: "她双目湛湛有神，修眉端鼻，颊边微现梨涡，真是秀美无伦，只是年纪幼小，身材尚未长成，虽然容貌绝丽，却掩不住容颜中的稚气。", },
          { jh: "明教", loc: "龙王殿", name: "黛龙王", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n;w", desc: "她就是武林中盛传的紫衣龙王，她肤如凝脂，杏眼桃腮，容光照人，端丽难言。虽然已年过中年，但仍风姿嫣然。", },
          { jh: "明教", loc: "昆仑墟", name: "九幽毒魔", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n;w;nw;nw;event_1_70957287", desc: "千夜旗至尊九长老之一，看似一个面容慈祥的白发老人，鹤发童颜，双手隐隐的黑雾却显露了他不世的毒功！", },
          { jh: "明教", loc: "毒池地牢", name: "青衣女孩", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n;w;nw;nw;event_1_70957287;event_1_39374335;;kill?九幽毒童;event_1_2077333", desc: "一个身著青衣的小女孩，被抓来此出准备炼毒之用，虽能感觉到恐惧，但双眼仍透出不屈的顽强。", },
          { jh: "明教", loc: "九幽毒池", name: "九幽毒童", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n;w;nw;nw;event_1_70957287;event_1_39374335", desc: "负责管理九幽毒池的童子们，个个面色阴沉，残忍好杀。", },
          { jh: "明教", loc: "铁木长廊", name: "明教小喽啰", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;w", desc: "明教的一个小喽啰，看起来有点猥琐，而且还有点阴险。", },
          { jh: "明教", loc: "烈火旗大厅", name: "辛旗使", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;w;w", desc: "他是明教烈焰旗掌旗使。" },
          { jh: "明教", loc: "大空地", name: "布袋大师", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;w;w;n", desc: "他是明教五散仙之一的布袋大师说不得，腰间歪歪斜斜的挂著几支布袋。", },
          { jh: "明教", loc: "厚土旗大厅", name: "颜旗使", name_new: "杨塬", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;w;w;n;n", desc: "他是明教深土旗掌旗使。", },
          { jh: "明教", loc: "民居", name: "村妇", way: "jh 18;w", desc: "一个村妇。" },
          { jh: "明教", loc: "卧房", name: "小男孩", way: "jh 18;w;n", desc: "这是个七八岁的小男孩。" },
          { jh: "明教", loc: "卧房", name: "老太婆", way: "jh 18;w;n", desc: "一个满脸皱纹的老太婆。" },
          { jh: "全真教", loc: "终南石阶", name: "终南山游客", way: "jh 19;s;s;s;sw;s", desc: "一个来终南山游玩的游客。" },
          { jh: "全真教", loc: "终南石阶", name: "男童", way: "jh 19;s;s;s;sw;s;e;n;nw", desc: "这是一个男童。" },
          { jh: "全真教", loc: "终南石阶", name: "全真女弟子", way: "jh 19;s;s;s;sw;s;e;n;nw;n", desc: "这是一个女道姑。" },
          { jh: "全真教", loc: "全真教大门", name: "迎客道长", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n", desc: "他是全真教内负责接待客人的道士。" },
          { jh: "全真教", loc: "万物堂", name: "程遥伽", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n", desc: "她长相清秀端庄。" },
          { jh: "全真教", loc: "天心殿", name: "尹志平", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n", desc: "他是丘处机的得意大弟子尹志平，他粗眉大眼，长的有些英雄气概，在全真教第三代弟子中算得上年轻有为。身材不高，眉宇间似乎有一股忧郁之色。长的倒是长眉俊目，容貌秀雅，面白无须，可惜朱雀和玄武稍有不和。", },
          { jh: "全真教", loc: "天心殿", name: "练功弟子", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n", desc: "这是全真教的练功弟子。" },
          { jh: "全真教", loc: "后堂三进", name: "孙不二", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;e;e;e", desc: "她就是全真教二代弟子中唯一的女弟子孙不二孙真人。她本是马钰入道前的妻子，道袍上绣著一个骷髅头。", },
          { jh: "全真教", loc: "柴房", name: "柴火道士", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;e;e;n;n", desc: "一个负责柴火的道士。" },
          { jh: "全真教", loc: "静修室", name: "马钰", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n", desc: "他就是王重阳的大弟子，全真七子之首，丹阳子马钰马真人。他慈眉善目，和蔼可亲，正笑著看著你。", },
          { jh: "全真教", loc: "小花园", name: "丘处机", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n", desc: "他就是江湖上人称‘长春子’的丘处机丘真人，他方面大耳，满面红光，剑目圆睁，双眉如刀，相貌威严，平生疾恶如仇。", },
          { jh: "全真教", loc: "勤习堂", name: "老道长", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;e", desc: "这是一个年老的道人。" },
          { jh: "全真教", loc: "小花园", name: "王处一", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;n", desc: "他就是全真七子之五王处一王真人。他身材修长，服饰整洁，三绺黑须飘在胸前，神态潇洒。", },
          { jh: "全真教", loc: "小花园", name: "鹿道清", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;n;e", desc: "他是全真教尹志平门下第四代弟子" },
          { jh: "全真教", loc: "小花园", name: "青年弟子", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;n;n", desc: "一个风程仆仆的侠客。" },
          { jh: "全真教", loc: "容物堂", name: "谭处端", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;n;n;n;e", desc: "他就是全真次徒谭处端谭真人，他身材魁梧，浓眉大眼，嗓音洪亮，拜重阳真人为师前本是铁匠出身。", },
          { jh: "全真教", loc: "过真殿", name: "刘处玄", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;n;n;n;e;e", desc: "他就是全真三徒刘处玄刘真人，他身材瘦小，但顾盼间自有一种威严气概。", },
          { jh: "全真教", loc: "厨房", name: "掌厨道士", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;n;n;n;e;e;e", desc: "一个负责掌厨的道士。" },
          { jh: "全真教", loc: "大堂一进", name: "小麻雀", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;n;n;n;e;e;e;n", desc: "一只叽叽咋咋的小麻雀。" },
          { jh: "全真教", loc: "肥料房", name: "老人", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;n;n;n;n;n;n", desc: "这是一个老人，在全真教内已有几十年了。" },
          { jh: "全真教", loc: "后花园", name: "挑水道士", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e", desc: "这是全真教内负责挑水的道士。" },
          { jh: "全真教", loc: "树林", name: "蜜蜂", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;n", desc: "一直忙碌的小蜜蜂。" },
          { jh: "全真教", loc: "会真堂", name: "观想兽", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;n;w", desc: "一只只有道家之所才有的怪兽。" },
          { jh: "全真教", loc: "元始殿", name: "赵师兄", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;n;w;n", desc: "他就是全真教真人王处一的弟子赵师兄", },
          { jh: "全真教", loc: "药剂室", name: "老顽童", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;n;w;w;n", desc: "此人年龄虽大但却顽心未改，一头乱糟糟的花白胡子，一双小眼睛透出让人觉得滑稽的神色。", },
          { jh: "全真教", loc: "藏经殿", name: "小道童", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;w", desc: "他是全真教的一个小道童。" },
          { jh: "全真教", loc: "天尊殿", name: "重阳祖师", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;w;w;s", desc: "他就是全真教的开山祖师，其身材消瘦，精神矍铄，飘飘然仿佛神仙中人", },
          { jh: "全真教", loc: "后堂一进", name: "小道童", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;w;w;w;s", desc: "一个全真教的小道童。" },
          { jh: "全真教", loc: "大禅房", name: "郝大通", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;w;w;w;w;n;n;n", desc: "他就是全真七子中的郝大通郝真人。他身材微胖，象个富翁模样，身上穿的道袍双袖皆无。", },
          { jh: "全真教", loc: "马厩", name: "健马", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;w;w;w;s", desc: "一匹健壮的大马。" },
          { jh: "全真教", loc: "马厩", name: "李四", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;w;w;w;s", desc: "这是一个中年道士。" },
          { jh: "全真教", loc: "事为室", name: "小道童", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;w", desc: "他是全真教的一个小道童。" },
          { jh: "古墓", loc: "事为室", name: "白玉蜂", way: "", desc: "这是一只玉色的蜜蜂，个头比普通蜜蜂大得多，翅膀上被人用尖针刺有字" },
          { jh: "古墓", loc: "事为室", name: "红玉蜂", way: "", desc: "这是一只玉色的蜜蜂，个头比普通蜜蜂大得多，翅膀上被人用尖针刺有字。" },
          { jh: "古墓", loc: "", name: "毒蟒", way: ".树上", desc: "一条庞大无比，色彩斑斓的巨蟒。浑身发出阵阵强烈的腥臭味。" },
          { jh: "古墓", loc: "小树林", name: "天蛾", way: "jh 20;w;w;s;e;s;s;s", desc: "蜜蜂的天敌之一。" },
          { jh: "古墓", loc: "小树林", name: "食虫虻", way: "jh 20;w;w;s;e;s;s;s;s;s;sw", desc: "食肉昆虫，蜜蜂的天敌之一。" },
          { jh: "古墓", loc: "草地", name: "玉蜂", way: "jh 20;w;w;s;e;s;s;s;s;s;sw;sw;s", desc: "这是一只玉色的蜜蜂，个头比普通蜜蜂大得多，翅膀上被人用尖针刺有字。" },
          { jh: "古墓", loc: "悬崖", name: "玉蜂", way: "jh 20;w;w;s;e;s;s;s;s;s;sw;sw;s;s;e", desc: "这是一只玉色的蜜蜂，个头比普通蜜蜂大得多，翅膀上被人用尖针刺有字。", },
          { jh: "古墓", loc: "中厅", name: "龙儿", way: "jh 20;w;w;s;e;s;s;s;s;s;sw;sw;s;s;s;s;e;e", desc: "盈盈而站著一位秀美绝俗的女子，肌肤间少了一层血色，显得苍白异常。披著一袭轻纱般的白衣，犹似身在烟中雾里。", },
          { jh: "古墓", loc: "密室", name: "林祖师", way: "jh 20;w;w;s;e;s;s;s;s;s;sw;sw;s;s;s;s;e;e;event_1_3723773;se;n;e;s;e;s;e", desc: "她就是古墓派的开山祖师，虽然已经是四十许人，望之却还如同三十出头。当年她与全真教主王重阳本是一对痴心爱侣，只可惜有缘无份，只得独自在这古墓上幽居。", },
          { jh: "古墓", loc: "小屋", name: "孙婆婆", way: "jh 20;w;w;s;e;s;s;s;s;s;sw;sw;s;s;s;s;s;s;s;e;e;e;e;s;e", desc: "这是一位慈祥的老婆婆，正看著你微微一笑。", },
          { jh: "白驮山", loc: "小路", name: "雷震天", way: "jh 21;nw;ne;n;n;ne", desc: "雷横天的儿子，与其父亲不同，长得颇为英俊。" },
          { jh: "白驮山", loc: "中军大帐", name: "军中主帅", way: "jh 21;n;n;n;n;w;w;w;w", desc: "敌军主帅，黑盔黑甲，手持长刀。" },
          { jh: "白驮山", loc: "近卫狼营", name: "银狼近卫", way: "jh 21;n;n;n;n;w;w;w", desc: "主帅身侧的近卫，都是万里挑一的好手" },
          { jh: "白驮山", loc: "飞羽箭阵", name: "飞羽神箭", way: "jh 21;n;n;n;n;w;w", desc: "百发百中的神箭手，难以近身，必须用暗器武学方可隔空攻击", },
          { jh: "白驮山", loc: "青铜盾阵", name: "青衣盾卫", way: "jh 21;n;n;n;n;w", desc: "身著青衣，手持巨盾，是敌军阵前的铁卫，看起来极难对付。", },
          { jh: "白驮山", loc: "戈壁", name: "傅介子", way: "jh 21", desc: "中原朝廷出使西域楼兰国的使臣，气宇轩昂，雍容华度，似也会一些武功。" },
          { jh: "白驮山", loc: "玉门关外", name: "玉门守将", way: "jh 21;n;n;n;n;e", desc: "一位身经百战的将军，多年驻守此地，脸上满是大漠黄沙和狂风留下的沧桑。", },
          { jh: "白驮山", loc: "玉门关西门", name: "玉门守军", way: "jh 21;n;n;n;n;e;e", desc: "玉门关的守卫军士，将军百战死，壮士十年归。" },
          { jh: "白驮山", loc: "西驰马道", name: "玄甲骑兵", way: "jh 21;n;n;n;n;e;e;e", desc: "黑盔黑甲的天策骑兵，连马也被锃亮的铠甲包裹著。" },
          { jh: "白驮山", loc: "西车道", name: "车夫", way: "jh 21;n;n;n;n;e;e;e;e", desc: "一名驾车的车夫，尘霜满面。" },
          { jh: "白驮山", loc: "守将府", name: "天策大将", way: "jh 21;n;n;n;n;e;e;e;e;e", desc: "天策府左将军，英勇善战，智勇双全。身穿黑盔黑甲，腰间有一柄火红的长刀。", },
          { jh: "白驮山", loc: "守将府", name: "玄甲参将", way: "jh 21;n;n;n;n;e;e;e;e;e", desc: "天策玄甲军的参将，双目专注，正在认真地看著城防图。", },
          { jh: "白驮山", loc: "戈壁滩", name: "马匪", way: "jh 21;n;n;n;n;e;e;e;e;e;e;e;e;e", desc: "这是肆虐戈壁的马匪，长相凶狠，血债累累。" },
          { jh: "白驮山", loc: "马车店", name: "醉酒男子", way: "jh 21;n;n;n;n;e;e;e;e;e;e;e;s", desc: "此人看似已经喝了不少，面前摆著不下七八个空酒坛，两颊绯红，然而双目却仍是炯炯有神，身长不足七尺，腰别一把看似贵族名士方才有的长剑，谈笑之间雄心勃勃，睥睨天下。男子醉言醉语之间，似是自称青莲居士。", },
          { jh: "白驮山", loc: "马车店", name: "慕容孤烟", way: "jh 21;n;n;n;n;e;e;e;e;e;e;e;s", desc: "英姿飒爽的马车店女老板，汉族和鲜卑族混血，双目深邃，含情脉脉，细卷的栗色长发上夹著一个金色玉蜻蜓。", },
          { jh: "白驮山", loc: "龙门客栈", name: "凤七", way: "jh 21;n;n;n;n;e;e;e;e;e;s;s;w", desc: "无影楼金凤堂堂主，武功卓绝自是不在话下，腕上白玉镯衬出如雪肌肤，脚上一双鎏金鞋用宝石装饰。", },
          { jh: "白驮山", loc: "丝绸之路驿站", name: "匈奴杀手", way: "jh 21;n;n;n;n;e;n;n;n", desc: "匈奴人杀手，手持弯刀，眼露凶光。" },
          { jh: "白驮山", loc: "东街", name: "花花公子", way: "jh 21;nw", desc: "这是个流里流气的花花公子。" },
          { jh: "白驮山", loc: "小路", name: "小山贼", way: "jh 21;nw;ne;n;n", desc: "这是个尚未成年的小山贼。" },
          { jh: "白驮山", loc: "洞口", name: "山贼", way: "jh 21;nw;ne;n;n;ne;n", desc: "这是个面目可憎的山贼。" },
          { jh: "白驮山", loc: "洞内", name: "雷横天", way: "jh 21;nw;ne;n;n;ne;n;n", desc: "这是个粗鲁的山贼头。一身膘肉，看上去内力极度强劲！" },
          { jh: "白驮山", loc: "侧洞", name: "金花", way: "jh 21;nw;ne;n;n;ne;n;n;w", desc: "一个年少貌美的姑娘。" },
          { jh: "白驮山", loc: "杖场", name: "侍杖", way: "jh 21;nw;ne;n;n;ne;w", desc: "他头上包著紫布头巾，一袭紫衫，没有一丝褶皱。" },
          { jh: "白驮山", loc: "坟地", name: "寡妇", way: "jh 21;nw;ne;ne", desc: "一个年轻漂亮又不甘寂寞的小寡妇。" },
          { jh: "白驮山", loc: "打铁铺", name: "铁匠", way: "jh 21;nw;s", desc: "铁匠正用汗流浃背地打铁。" },
          { jh: "白驮山", loc: "西街", name: "舞蛇人", way: "jh 21;nw;w", desc: "他是一个西域来的舞蛇人。" },
          { jh: "白驮山", loc: "西街", name: "农民", way: "jh 21;nw;w", desc: "一个很健壮的壮年农民。" },
          { jh: "白驮山", loc: "酒店", name: "店小二", way: "jh 21;nw;w;n", desc: "这位店小二正笑咪咪地忙著招呼客人。" },
          { jh: "白驮山", loc: "小桥", name: "村姑", way: "jh 21;nw;w;w", desc: "一个很清秀的年轻农村姑娘，挎著一只盖著布小篮子。" },
          { jh: "白驮山", loc: "广场", name: "小孩", way: "jh 21;nw;w;w;nw", desc: "这是个农家小孩子" },
          { jh: "白驮山", loc: "农舍", name: "农家妇女", way: "jh 21;nw;w;w;nw;e", desc: "一个很精明能干的农家妇女。" },
          { jh: "白驮山", loc: "大门", name: "门卫", way: "jh 21;nw;w;w;nw;n;n", desc: "这是个年富力强的卫兵，样子十分威严。" },
          { jh: "白驮山", loc: "大厅", name: "丫环", way: "jh 21;nw;w;w;nw;n;n;n;n", desc: "一个很能干的丫环。" },
          { jh: "白驮山", loc: "大厅", name: "欧阳少主", name_new: "白鹤轩", way: "jh 21;nw;w;w;nw;n;n;n;n", desc: "他一身飘逸的白色长衫，手摇折扇，风流儒雅。", },
          { jh: "白驮山", loc: "练功场", name: "李教头", way: "jh 21;nw;w;w;nw;n;n;n;n;n", desc: "这是个和蔼可亲的教头。" },
          { jh: "白驮山", loc: "练功房", name: "教练", way: "jh 21;nw;w;w;nw;n;n;n;n;n;e", desc: "这是个和蔼可亲的教练。" },
          { jh: "白驮山", loc: "练功室", name: "陪练童子", way: "jh 21;nw;w;w;nw;n;n;n;n;n;e;ne", desc: "这是个陪人练功的陪练童子。" },
          { jh: "白驮山", loc: "门廊", name: "管家", way: "jh 21;nw;w;w;nw;n;n;n;n;n;n", desc: "一个老谋深算的老管家。" },
          { jh: "白驮山", loc: "花园", name: "老毒物", name_new: "白厉峰", way: "jh 21;nw;w;w;nw;n;n;n;n;n;n;n", desc: "他是白驮山庄主，号称“老毒物”。" },
          { jh: "白驮山", loc: "花园", name: "白衣少女", way: "jh 21;nw;w;w;nw;n;n;n;n;n;n;n", desc: "一个聪明伶俐的白衣少女。" },
          { jh: "白驮山", loc: "厨房", name: "肥肥", way: "jh 21;nw;w;w;nw;n;n;n;n;n;n;n;e", desc: "一个肥头大耳的厨师，两只小眼睛不停地眨巴著。" },
          { jh: "白驮山", loc: "柴房", name: "老材", way: "jh 21;nw;w;w;nw;n;n;n;n;n;n;n;e;e", desc: "一个有名的吝啬鬼，好象他整日看守著柴房也能发财似的。" },
          { jh: "白驮山", loc: "兔苑", name: "白兔", way: "jh 21;nw;w;w;nw;n;n;n;n;n;n;n;n;ne", desc: "一只雪白的小白兔，可爱之致。" },
          { jh: "白驮山", loc: "蛇园", name: "驯蛇人", way: "jh 21;nw;w;w;nw;n;n;n;n;n;n;n;n;ne;e", desc: "蛇园里面的驯蛇人，替白驼山庄驯养各种毒蛇。", },
          { jh: "白驮山", loc: "蛇园", name: "金环蛇", way: "jh 21;nw;w;w;nw;n;n;n;n;n;n;n;n;ne;e", desc: "一只让人看了起毛骨悚然的金环蛇。" },
          { jh: "白驮山", loc: "蛇园", name: "竹叶青蛇", way: "jh 21;nw;w;w;nw;n;n;n;n;n;n;n;n;ne;e", desc: "一只让人看了起鸡皮疙瘩的竹叶青蛇。" },
          { jh: "白驮山", loc: "兽舍", name: "野狼", way: "jh 21;nw;w;w;nw;n;n;n;n;n;n;n;n;ne;w", desc: "一只独行的野狼，半张著的大嘴里露著几颗獠牙。" },
          { jh: "白驮山", loc: "兽舍", name: "狐狸", way: "jh 21;nw;w;w;nw;n;n;n;n;n;n;n;n;ne;w", desc: "一只多疑成性的狐狸。" },
          { jh: "白驮山", loc: "兽舍", name: "雄狮", way: "jh 21;nw;w;w;nw;n;n;n;n;n;n;n;n;ne;w", desc: "一只矫健的雄狮，十分威风。" },
          { jh: "白驮山", loc: "兽舍", name: "老虎", way: "jh 21;nw;w;w;nw;n;n;n;n;n;n;n;n;ne;w", desc: "一只斑斓猛虎，雄伟极了。" },
          { jh: "白驮山", loc: "后院", name: "张妈", way: "jh 21;nw;w;w;nw;n;n;n;n;n;n;n;n;nw", desc: "一个历经沧桑的老婆婆。" },
          { jh: "白驮山", loc: "药房", name: "小青", way: "jh 21;nw;w;w;nw;n;n;n;n;n;w;s", desc: "这是个聪明乖巧的小姑娘，打扮的很朴素，一袭青衣，却也显得落落有致。小青对人非常热情。你要是跟她打过交道就会理解这一点！", },
          { jh: "白驮山", loc: "草丛", name: "黑冠巨蟒", way: "jh 21;nw;w;w;nw;n;n;n;n;n;w;w;w;n", desc: "一只庞然大物，它眼中喷火，好象要一口把你吞下。" },
          { jh: "白驮山", loc: "岩洞", name: "蟒蛇", way: "jh 21;nw;w;w;nw;n;n;n;n;n;w;w;w;n;n;n", desc: "一只昂首直立，吐著长舌芯的大蟒蛇。" },
          { jh: "白驮山", loc: "武器库", name: "仕卫", way: "jh 21;nw;w;w;nw;n;n;n;w", desc: "这是个样子威严的仕卫。" },
          { jh: "白驮山", loc: "山路", name: "樵夫", way: "jh 21;nw;w;w;nw;nw;nw", desc: "一个很健壮的樵夫。" },
          { jh: "白驮山", loc: "山庄大门", name: "玄衣中年", way: "jh 21;nw;w;w;nw;nw;nw;n;w;s;event_1_47975698", desc: "一身玄衣的中年人，似乎是这里山庄的一名守卫" },
          { jh: "白驮山", loc: "正堂", name: "闻人毅", way: "jh 21;nw;w;w;nw;nw;nw;n;w;s;event_1_47975698;s;sw;s;ne;e;s;s", desc: "一位神骏的青年，神情冷峻，周身似乎有一股强烈的剑气包围，令人感到非常压抑。", },
          { jh: "嵩山", loc: "剑池", name: "左罗", way: "jh 22;n;n;w;n;n;n;n;n;e;n;n;n;n;n", desc: "左掌门的侄子，武功平平，但多谋善断，有传闻说他是左掌门的亲生儿子。", },
          { jh: "嵩山", loc: "瀑布山洞", name: "马帮精锐", way: "jh 22;n;n;n;ss1;n;e;n;event_1_29122616", desc: "身材异常高大的男子，眼神中充满杀气，脸上满布虬龙似的伤疤。", },
          { jh: "嵩山", loc: "瀑布山洞", name: "枯瘦的人", way: "jh 22;n;n;w;w;s;s;s;s;s;event_1_52783704", desc: "身形枯瘦，似乎被困于此多年，但眼神中仍有强烈的生存意志", },
          { jh: "嵩山", loc: "太室阙", name: "脚夫", way: "jh 22", desc: "五大三粗的汉子，看起来会些拳脚功夫。" },
          { jh: "嵩山", loc: "青石大道", name: "风骚少妇", way: "jh 22;n", desc: "一个风骚的少妇，颇有几分姿色。" },
          { jh: "嵩山", loc: "青石大道", name: "秋半仙", way: "jh 22;n", desc: "一名算命道士，灰色道袍上缀著几个补丁。" },
          { jh: "嵩山", loc: "中岳庙", name: "锦袍老人", way: "jh 22;n;n", desc: "神情威猛须发花白的老人，看起来武功修为颇高。" },
          { jh: "嵩山", loc: "青岗坪", name: "柳易之", way: "jh 22;n;n;n;n", desc: "朝廷通事舍人，负责传达皇帝旨意。" },
          { jh: "嵩山", loc: "卢鸿草堂", name: "卢鸿一", way: "jh 22;n;n;n;n;e", desc: "一名布衣老者，慈眉善目，须发皆白。" },
          { jh: "嵩山", loc: "卢崖瀑布", name: "英元鹤", way: "jh 22;n;n;n;n;e;n", desc: "这是一名枯瘦矮小的黑衣老人，一双灰白的耳朵看起来有些诡异。", },
          { jh: "嵩山", loc: "启母阙", name: "游客", way: "jh 22;n;n;w", desc: "来嵩山游玩的男子，书生打扮，看来来颇为儒雅。" },
          { jh: "嵩山", loc: "嵩岳山道", name: "野狼", way: "jh 22;n;n;w;n", desc: "山林觅食的野狼，看起来很饿。" },
          { jh: "嵩山", loc: "嵩阳书院", name: "林立德", way: "jh 22;n;n;w;n;n", desc: "在嵩阳书院进学的书生，看起来有些木讷。" },
          { jh: "嵩山", loc: "石阶", name: "山贼", way: "jh 22;n;n;w;n;n;n", desc: "拦路抢劫的山贼" },
          { jh: "嵩山", loc: "无极老姆洞", name: "修行道士", way: "jh 22;n;n;w;n;n;n;n", desc: "在嵩山隐居修行的道士" },
          { jh: "嵩山", loc: "密林小径", name: "黄色毒蛇", way: "jh 22;n;n;w;n;n;n;n;event_1_88705407", desc: "一条吐舌蛇信子的毒蛇。" },
          { jh: "嵩山", loc: "山溪畔", name: "麻衣刀客", way: "jh 22;n;n;w;n;n;n;n;event_1_88705407;s;s", desc: "一身麻衣，头戴斗笠的刀客" },
          { jh: "嵩山", loc: "石洞", name: "白板煞星", way: "jh 22;n;n;w;n;n;n;n;event_1_88705407;s;s;s;s", desc: "没有鼻子，脸孔平平，像一块白板，看起来极为可怖" },
          { jh: "嵩山", loc: "山楂林", name: "小猴", way: "jh 22;n;n;w;n;n;n;n;n", desc: "这是一只调皮的小猴子，虽是畜牲，却喜欢模仿人样。" },
          { jh: "嵩山", loc: "朝天门", name: "万大平", way: "jh 22;n;n;w;n;n;n;n;n;e", desc: "嵩山弟子，看起来很普通。" },
          { jh: "嵩山", loc: "朝天门", name: "芙儿", way: "jh 22;n;n;w;n;n;n;n;n;e;e", desc: "一名身穿淡绿衫子的少女，只见她脸如白玉，颜若朝华，真是艳冠群芳的绝色美人。", },
          { jh: "嵩山", loc: "峻极山道", name: "嵩山弟子", way: "jh 22;n;n;w;n;n;n;n;n;e;n", desc: "这是一名嵩山弟子，武功看起来稀松平常。" },
          { jh: "嵩山", loc: "峻极禅院", name: "史师兄", way: "jh 22;n;n;w;n;n;n;n;n;e;n;n;n", desc: "嵩山派大弟子，武功修为颇高。" },
          { jh: "嵩山", loc: "会盟堂", name: "白头仙翁", way: "jh 22;n;n;w;n;n;n;n;n;e;n;n;n;n", desc: "嵩山派高手，年纪不大，头花却已全白。" },
          { jh: "嵩山", loc: "剑池", name: "左挺", way: "jh 22;n;n;w;n;n;n;n;n;e;n;n;n;n;n", desc: "冷面短髯，相貌堂皇的青年汉子。" },
          { jh: "嵩山", loc: "东长廊", name: "钟九曲", way: "jh 22;n;n;w;n;n;n;n;n;e;n;n;n;n;n;e", desc: "脸白无须，看起来不像练武之人。" },
          { jh: "嵩山", loc: "北长廊", name: "陆太保", way: "jh 22;n;n;w;n;n;n;n;n;e;n;n;n;n;n;n", desc: "面目凶光的中年汉子，虽是所谓名门正派，但手段极为凶残。", },
          { jh: "嵩山", loc: "书斋", name: "高锦毛", way: "jh 22;n;n;w;n;n;n;n;n;e;n;n;n;n;n;n;e", desc: "须发火红的中年汉子" },
          { jh: "嵩山", loc: "花园", name: "邓神鞭", way: "jh 22;n;n;w;n;n;n;n;n;e;n;n;n;n;n;n;n", desc: "一名面容黯淡的老人，但看外表，很难想到他是一名内外皆修的高手。", },
          { jh: "嵩山", loc: "卧室", name: "聂红衣", way: "jh 22;n;n;w;n;n;n;n;n;e;n;n;n;n;n;n;n;e", desc: "一名体态风流的少妇，酥胸微露，媚眼勾人。", },
          { jh: "嵩山", loc: "独尊坛", name: "左盟主", way: "jh 22;n;n;w;n;n;n;n;n;e;n;n;n;n;n;n;n;n", desc: "身穿杏黄长袍，冷口冷面，喜怒皆不行于色，心机颇深。" },
          { jh: "嵩山", loc: "西长廊", name: "乐老狗", way: "jh 22;n;n;w;n;n;n;n;n;e;n;n;n;n;n;w", desc: "这人矮矮胖胖，面皮黄肿，约莫五十来岁年纪，目神光炯炯，凛然生威，两只手掌肥肥的又小又厚。", },
          { jh: "嵩山", loc: "练武场", name: "冷峻青年", way: "jh 22;n;n;w;n;n;n;n;n;e;n;n;n;n;n;w;n;n", desc: "一个风程仆仆的侠客。" },
          { jh: "嵩山", loc: "厨房", name: "伙夫", way: "jh 22;n;n;w;n;n;n;n;n;e;n;n;n;n;n;w;n;w", desc: "一名肥头大耳的伙夫，负责打理嵩山派一众大小伙食。", },
          { jh: "嵩山", loc: "仓库", name: "沙秃翁", way: "jh 22;n;n;w;n;n;n;n;n;e;n;n;n;n;n;w;w", desc: "这是一名秃头老者，一双鹰眼微闭。" },
          { jh: "嵩山", loc: "封禅台", name: "麻衣汉子", way: "jh 22;n;n;w;n;n;n;n;n;e;n;n;w;n", desc: "头戴斗笠，身材瘦长，一身麻衣的中年男子，看起来有些诡异。", },
          { jh: "嵩山", loc: "魔云洞口", name: "吸血蝙蝠", way: "jh 22;n;n;w;w;s", desc: "一只体型巨大的吸血蝙蝠。" },
          { jh: "嵩山", loc: "魔云洞空地", name: "瞎眼剑客", way: "jh 22;n;n;w;w;s;s", desc: "一名黑衣剑客，双面失明。" },
          { jh: "嵩山", loc: "危崖", name: "瞎眼老者", way: "jh 22;n;n;w;w;s;s;s;s;s", desc: "这是一名黑衣瞎眼老者，看起来武功修为颇高。" },
          { jh: "嵩山", loc: "通天洞", name: "瞎眼刀客", way: "jh 22;n;n;w;w;s;s;s;s;w", desc: "一名黑衣刀客，双面失明。" },
          { jh: "寒梅庄", loc: "囚室", name: "厉傲天", way: "jh 23;n;n;n;n;n;n;n;n;n;n;w;n;;kill?夏春雷;@夏春雷的尸体;s;e;s;s;s;w;w;give meizhuang_meizhuang3;n;n;n;n;n;e;event_1_35389772", desc: "这名老者身材甚高，一头黑发，穿的是一袭青衫，长长的脸孔，脸色雪白，更无半分血色，眉目清秀，只是脸色实在白得怕人，便如刚从坟墓中出来的僵尸一般。", },
          { jh: "寒梅庄", loc: "酒室", name: "奎孜墨", way: "jh 23;n;n;n;n;n;n;n;n;n;n;w;n;;kill?夏春雷;@夏春雷的尸体;s;e;s;s;s;w;w;give meizhuang_meizhuang3;n;n;n;n;n", desc: "这是一名身穿黑衣的年轻男子，一张脸甚是苍白，漆黑的眉毛下是艺术按个深沉的眼睛，深沉的跟他的年龄极不相符。", },
          { jh: "寒梅庄", loc: "岳王庙", name: "武悼", way: "jh 23;n;n;e;event_1_50956819", desc: "一个白发苍苍的老人，默默打扫著这万人景仰的武穆祠堂。" },
          { jh: "寒梅庄", loc: "柳树林", name: "柳府家丁", way: "jh 23", desc: "这是杭州有名大户柳府的家丁，穿著一身考究的短衫，一副目中无人的样子。" },
          { jh: "寒梅庄", loc: "梅林", name: "老者", way: "jh 23;n;n", desc: "一个姓汪的老者，似乎有什么秘密在身上。" },
          { jh: "寒梅庄", loc: "梅林", name: "柳玥", way: "jh 23;n;n", desc: "柳府二小姐，只见她眸含秋水清波流盼，香娇玉嫩，秀靥艳比花娇，指如削葱根，口如含朱丹，一颦一笑动人心魂，旖旎身姿在上等丝绸长裙包裹下若隐若现。听说柳府二千金芳名远扬，传闻柳府大小姐月夜逃婚，至今不知下落。", },
          { jh: "寒梅庄", loc: "放鹤亭", name: "筱西风", way: "jh 23;n;n;e", desc: "这是一名看起来很冷峻的男子，只见他鬓若刀裁，眉如墨画，身上穿著墨色的缎子衣袍，袍内露出银色镂空木槿花的镶边，腰上挂著一把长剑。", },
          { jh: "寒梅庄", loc: "青石板大路", name: "梅庄护院", way: "jh 23;n;n;n", desc: "一身家人装束的壮汉，要挂宝刀，看起来有些功夫。" },
          { jh: "寒梅庄", loc: "大天井", name: "梅庄家丁", way: "jh 23;n;n;n;n;n", desc: "一身家人装束的男子，看起来有些功夫。" },
          { jh: "寒梅庄", loc: "大厅", name: "施令威", way: "jh 23;n;n;n;n;n;n", desc: "一身家人装束的老者，目光炯炯，步履稳重，看起来武功不低。" },
          { jh: "寒梅庄", loc: "百木园", name: "丁管家", way: "jh 23;n;n;n;n;n;n;n", desc: "一身家人装束的老者，目光炯炯，步履稳重，看起来武功不低。" },
          { jh: "寒梅庄", loc: "棋室", name: "玄天指", way: "jh 23;n;n;n;n;n;n;n;e;s", desc: "这人虽然生的眉清目秀，然而脸色泛白，头发极黑而脸色极白，像一具僵尸的模样。据说此人酷爱下棋，为人工于心计。", },
          { jh: "寒梅庄", loc: "奇槐坡", name: "瘦小汉子", way: "jh 23;n;n;n;n;n;n;n;n", desc: "脸如金纸的瘦小的中年男子，一身黑衣，腰系黄带。" },
          { jh: "寒梅庄", loc: "画室", name: "龙点睛", way: "jh 23;n;n;n;n;n;n;n;n;e;n", desc: "此人髯长及腹，一身酒气，据说此人极为好酒好丹青，为人豪迈豁达。", },
          { jh: "寒梅庄", loc: "临水平台", name: "上官香云", way: "jh 23;n;n;n;n;n;n;n;n;n;n", desc: "这女子有著倾城之貌，闭月之姿，流转星眸顾盼生辉，发丝随意披散，慵懒不羁。她是江南一带有名的歌妓，据闻琴棋书画无不精通，文人雅士、王孙公子都想一亲芳泽。", },
          { jh: "寒梅庄", loc: "书斋", name: "铁笔张", way: "jh 23;n;n;n;n;n;n;n;n;n;n;e", desc: "这人身型矮矮胖胖，头顶秃得油光滑亮，看起来没有半点文人雅致，却极为嗜好书法。", },
          { jh: "寒梅庄", loc: "杏林", name: "黑衣刀客", way: "jh 23;n;n;n;n;n;n;n;n;n;n;event_1_8188693;n", desc: "一身黑色劲装，手持大刀，看起来很凶狠。" },
          { jh: "寒梅庄", loc: "练武场", name: "青衣剑客", way: "jh 23;n;n;n;n;n;n;n;n;n;n;event_1_8188693;n;n", desc: "一身青衣，不知道练得什么邪门功夫，看起来脸色铁青。", },
          { jh: "寒梅庄", loc: "菜园", name: "黄衫婆婆", way: "jh 23;n;n;n;n;n;n;n;n;n;n;event_1_8188693;n;n;n;e;n", desc: "虽已满头白发，但眉眼间依旧可见年轻时的娟秀。", },
          { jh: "寒梅庄", loc: "茅草屋", name: "红衣僧人", way: "jh 23;n;n;n;n;n;n;n;n;n;n;event_1_8188693;n;n;n;n", desc: "这人虽然身穿红色僧袍，但面目狰狞，看起来绝非善类。", },
          { jh: "寒梅庄", loc: "凉棚", name: "紫袍老者", way: "jh 23;n;n;n;n;n;n;n;n;n;n;event_1_8188693;n;n;w", desc: "看起来气度不凡的老人，紫色脸膛在紫袍的衬托下显得更是威严。", },
          { jh: "寒梅庄", loc: "琴室", name: "琴童", way: "jh 23;n;n;n;n;n;n;n;n;n;n;w", desc: "这是一名青衣童子，扎著双髻，眉目清秀。" },
          { jh: "寒梅庄", loc: "内室", name: "夏春雷", way: "jh 23;n;n;n;n;n;n;n;n;n;n;w;n", desc: "这是一名身型骨瘦如柴的老人，炯炯有神的双目却让内行人一眼看出其不俗的内力。", },
          { jh: "寒梅庄", loc: "酒室", name: "地牢看守", way: "jh 23;n;n;n;n;n;n;n;n;n;n;w;n;;kill?夏春雷;@夏春雷的尸体;s;e;s;s;s;w;w;give meizhuang_meizhuang3", desc: "身穿灰布衣裳，脸色因为常年不见阳光，看起来有些灰白。", },
          { jh: "寒梅庄", loc: "酒室", name: "地鼠", way: "jh 23;n;n;n;n;n;n;n;n;n;n;w;n;;kill?夏春雷;@夏春雷的尸体;s;e;s;s;s;w;w;give meizhuang_meizhuang3;n;n", desc: "一只肥大的地鼠，正在觅食。", },
          { jh: "寒梅庄", loc: "酒室", name: "地鼠", way: "jh 23;n;n;n;n;n;n;n;n;n;n;w;n;;kill?夏春雷;@夏春雷的尸体;s;e;s;s;s;w;w;give meizhuang_meizhuang3;n;n;n;n", desc: "一只肥大的地鼠，正在觅食。", },
          { jh: "寒梅庄", loc: "小院", name: "柳蓉", way: "jh 23;n;n;n;n;n;n;n;n;w", desc: "这女子虽是一袭仆人粗布衣裳，却掩不住其俊俏的容颜。只见那张粉脸如花瓣般娇嫩可爱，樱桃小嘴微微轻启，似是要诉说少女心事。", },
          { jh: "寒梅庄", loc: "厨房", name: "丁二", way: "jh 23;n;n;n;n;n;n;n;n;w;n", desc: "这是一名满脸油光的中年男子，虽然其貌不扬，据说曾是京城御厨，蒸炒煎炸样样拿手。", },
          { jh: "寒梅庄", loc: "偏房", name: "聋哑老人", way: "jh 23;n;n;n;n;n;n;n;n;w;w", desc: "这是一名弯腰曲背的聋哑老人，须发皆白，满脸皱纹。据说他每天都去湖底地牢送饭。", },
          { jh: "寒梅庄", loc: "酒室", name: "庄左使", way: "jh 23;n;n;n;n;n;n;n;w;w", desc: "这是一名身穿白袍的老人，容貌清癯，刻颏下疏疏朗朗一缕花白长须，身材高瘦，要挂弯刀。", },
          { jh: "泰山", loc: "木屋", name: "铁恶人", way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;w;n;n;n;n;e", desc: "铁毅同父异母之弟，为了「大旗门」宝藏，时常算计其大哥铁毅。", },
          { jh: "泰山", loc: "木屋", name: "黑衣人", way: "", desc: "一个风程仆仆的侠客。" },
          { jh: "泰山", loc: "青州城外", name: "镖师", way: "jh 24;se", desc: "当地镖局的镖师，现在被狼军士兵团团围住，难以脱身。" },
          { jh: "泰山", loc: "", name: "铁翼", way: ".位置：地牢，靠谜题飞", desc: "铁翼是铁血大旗门的元老。他刚正不阿，铁骨诤诤，如今被囚禁于此。" },
          { jh: "泰山", loc: "岱宗坊", name: "挑夫", way: "jh 24", desc: "这青年汉子看起来五大三粗，估计会些三脚猫功夫。" },
          { jh: "泰山", loc: "石阶", name: "黄衣刀客", way: "jh 24;n", desc: "这家伙满脸横肉，一付凶神恶煞的模样，令人望而生畏。" },
          { jh: "泰山", loc: "一天门", name: "瘦僧人", way: "jh 24;n;n", desc: "他是一位中年游方和尚，骨瘦如柴，身上的袈裟打满了补丁。" },
          { jh: "泰山", loc: "天梯", name: "柳安庭", way: "jh 24;n;n;n", desc: "这是个饱读诗书，却手无缚鸡之力的年轻书生。" },
          { jh: "泰山", loc: "石板路", name: "石云天", way: "jh 24;n;n;n;n", desc: "生性豁达，原本是丐帮弟子，因为风流本性难改，被逐出丐帮。" },
          { jh: "泰山", loc: "弥勒院", name: "朱莹莹", way: "jh 24;n;n;n;n;e", desc: "艳丽的容貌、曼妙的身姿，真是数不尽的万种风情。" },
          { jh: "泰山", loc: "小洞天", name: "温青青", way: "jh 24;n;n;n;n;e;e", desc: "这名女子神态娴静淡雅，穿著一身石青色短衫，衣履精致，一张俏脸白里透红，好一个美丽俏佳人。", },
          { jh: "泰山", loc: "小洞天", name: "易安居士", way: "jh 24;n;n;n;n;e;e", desc: "这是有“千古第一才女”之称的李清照，自幼生活优裕，其父李格非藏书甚丰，小时候就在良好的家庭环境中打下文学基础。少年时即负文学的盛名，她的词更是传诵一时。中国女作家中，能够在文学史上占一席地的，必先提李易安。她生活的时代虽在北宋南宋之间，却不愿意随著当时一般的潮流，而专意于小令的吟咏。她的名作象《醉花阴》，《如梦令》，有佳句象“花自飘零水自流，一种相思两处闲愁”等等，都脍炙人口。", },
          { jh: "泰山", loc: "白骡冢", name: "欧阳留云", way: "jh 24;n;n;n;n;e;s", desc: "这是位中年武人，肩背长剑，长长的剑穗随风飘扬，看来似乎身怀绝艺。", },
          { jh: "泰山", loc: "飞云阁", name: "吕进", way: "jh 24;n;n;n;n;n", desc: "此人出身神秘，常常独来独往，戴一副铁面具，不让人看到真面目，师承不明。", },
          { jh: "泰山", loc: "万仙楼", name: "司马玄", way: "jh 24;n;n;n;n;n;n", desc: "这是一名白发老人，慈眉善目，据说此人精通医术和药理。" },
          { jh: "泰山", loc: "三义柏", name: "桑不羁", way: "jh 24;n;n;n;n;n;n;e", desc: "此人身似猿猴，动作矫健，因轻功出众，江湖中难有人可以追的上他，故而以刺探江湖门派消息为生。", },
          { jh: "泰山", loc: "斗母宫", name: "于霸天", way: "jh 24;n;n;n;n;n;n;n", desc: "此人身材魁梧，身穿铁甲，看起来似乎是官府的人。" },
          { jh: "泰山", loc: "山谷小溪", name: "神秘游客", way: "jh 24;n;n;n;n;n;n;n;e", desc: "此人年纪虽不大，但须发皆白，一身黑袍，看起来气度不凡。", },
          { jh: "泰山", loc: "云步桥", name: "李三", way: "jh 24;n;n;n;n;n;n;n;n;n", desc: "此人无发无眉，相貌极其丑陋。" },
          { jh: "泰山", loc: "酌泉亭", name: "仇霸", way: "jh 24;n;n;n;n;n;n;n;n;n;e", desc: "此人独目秃顶，面目凶恶，来官府通缉要犯。" },
          { jh: "泰山", loc: "五大夫松", name: "平光杰", way: "jh 24;n;n;n;n;n;n;n;n;n;n", desc: "这是一名身穿粗布衣服的少年，背上揹著一个竹篓，里面放著一些不知名的药草。", },
          { jh: "泰山", loc: "十八盘", name: "玉师兄", way: "jh 24;n;n;n;n;n;n;n;n;n;n;n", desc: "这人面色灰白，双眼无神，看起来一副沉溺酒色的模样。", },
          { jh: "泰山", loc: "南天门", name: "玉师伯", way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n", desc: "泰山掌门的师叔，此人看起来老奸巨猾。" },
          { jh: "泰山", loc: "天街", name: "任娘子", way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;e", desc: "这是一名艳丽少妇，勾魂双面中透出一股杀气。" },
          { jh: "泰山", loc: "石阶", name: "红衣卫士", way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;e;e", desc: "一身红色劲装的卫士，看起来有些功夫。" },
          { jh: "泰山", loc: "迎旭亭", name: "白飞羽", way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;e;e;n;e", desc: "这人算得上是一个美男子，长眉若柳，身如玉树。", },
          { jh: "泰山", loc: "禅房", name: "商鹤鸣", way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;e;e;n;n;e", desc: "这人生的有些难看，黑红脸膛，白发长眉，看起来有些阴郁。", },
          { jh: "泰山", loc: "玉皇殿", name: "冯太监", way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;e;e;n;n;n;n", desc: "皇帝身边鹤发童颜的太监，权势滔天，眼中闪著精光。", },
          { jh: "泰山", loc: "玉皇殿", name: "钟逍林", way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;e;e;n;n;n;n", desc: "这是一名魁梧的中年男子，看起来内家功夫造诣不浅。", },
          { jh: "泰山", loc: "登封台", name: "西门宇", way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;e;e;n;n;n;n;n", desc: "这是一名身材伟岸的中年男子，看起来霸气逼人。", },
          { jh: "泰山", loc: "望河亭", name: "西门允儿", way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;e;e;n;n;w", desc: "这是一名极有灵气的女子，穿著碧绿纱裙。", },
          { jh: "泰山", loc: "双鞭客栈", name: "黄老板", way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;e;s", desc: "双鞭客栈老板，看起来精明过人。" },
          { jh: "泰山", loc: "泰山派山门", name: "迟一城", way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;n", desc: "泰山弟子，剑眉星目，身姿挺拔如松。" },
          { jh: "泰山", loc: "前院", name: "泰山弟子", way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;n;n", desc: "这是一名青衣弟子，手里握著一把长剑。" },
          { jh: "泰山", loc: "厢房", name: "建除", way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e", desc: "泰山掌门的弟子，身形矫健，看起来武功不错。" },
          { jh: "泰山", loc: "东灵殿", name: "天柏", way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n", desc: "泰山掌门的师弟，看起来英气勃勃。" },
          { jh: "泰山", loc: "后院", name: "天松", way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n", desc: "泰山掌门的师弟，嫉恶如仇，性子有些急躁。" },
          { jh: "泰山", loc: "静观山房", name: "泰山掌门", way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n", desc: "此人为泰山掌门，此人看起来正气凛然。", },
          { jh: "泰山", loc: "休息室", name: "玉师叔", way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w", desc: "泰山掌门的师叔，处事冷静，极有见识。" },
          { jh: "泰山", loc: "桃花峪入口", name: "黑衣密探", way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;w", desc: "这是一名蒙面密探。" },
          { jh: "泰山", loc: "桃花路", name: "毒蛇", way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;w;n", desc: "这是一条斑斓的大蛇，一眼看去就知道有剧毒" },
          { jh: "泰山", loc: "垂钓台", name: "筱墨客", way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;w;n;n;w", desc: "这人脸上挂著难以捉摸的笑容，看起来城府极深。" },
          { jh: "泰山", loc: "望人松", name: "玉师弟", way: "jh 24;n;n;n;n;n;n;n;n;n;n;w", desc: "此人一身道袍，看起来颇为狡诈。" },
          { jh: "泰山", loc: "翠竹林", name: "海棠杀手", way: "jh 24;n;n;n;n;n;n;n;n;w", desc: "这人的脸上看起来没有一丝表情，手里的刀刃闪著寒光。", },
          { jh: "泰山", loc: "石亭", name: "路独雪", way: "jh 24;n;n;n;n;n;n;n;n;w;n;n", desc: "这人便是江湖有名的海棠杀手“三剑断命”，看起来倒也算是一表人才，只是双目透出的杀气却让人见之胆寒。", },
          { jh: "泰山", loc: "大石坪", name: "铁云", way: "jh 24;n;n;n;n;n;n;n;n;w;n;n;n", desc: "据说杀手无情便无敌，这人看起来风流倜傥，却是极为冷血之人。", },
          { jh: "泰山", loc: "百丈崖", name: "孔翎", way: "jh 24;n;n;n;n;n;n;n;n;w;n;n;n;n;n", desc: "据说他就是海棠杀手组织的首领，不过看他的样子，似乎不像是一个能统领众多杀手的人。", },
          { jh: "泰山", loc: "石桥", name: "姬梓烟", way: "jh 24;n;n;n;n;n;n;n;n;w;n;n;n;w", desc: "这是一名极为妖艳的女子，一身黑色的紧身衣将其包裹得曲线毕露，估计十个男人见了十个都会心痒难耐。", },
          { jh: "泰山", loc: "朱樱林", name: "柳兰儿", way: "jh 24;n;n;n;n;n;n;n;n;w;n;n;n;w;n", desc: "这是一个看起来天真烂漫的少女，不过等她的剑刺穿你的身体时，你才会意识到天真是多么好的伪装。", },
          { jh: "泰山", loc: "朱樱林", name: "朱樱林", way: "jh 24;n;n;n;n;n;n;n;n;w;n;n;n;w;n", desc: "" },
          { jh: "泰山", loc: "石门", name: "布衣男子", way: "jh 24;n;n;n;n;n;n;n;n;w;n;n;n;w;n;event_1_15941870", desc: "这是一名身穿粗布衣服的男子，看起来很强壮。" },
          { jh: "泰山", loc: "巨石广场", name: "阮小", way: "jh 24;n;n;n;n;n;n;n;n;w;n;n;n;w;n;event_1_15941870;n", desc: "这人五短身材，尖嘴猴腮。" },
          { jh: "泰山", loc: "聚兵房", name: "史义", way: "jh 24;n;n;n;n;n;n;n;n;w;n;n;n;w;n;event_1_15941870;n;n;e", desc: "这人身穿粗布劲装，满脸络腮胡，双眼圆瞪，似乎随时准备发怒。", },
          { jh: "泰山", loc: "演武场", name: "林忠达", way: "jh 24;n;n;n;n;n;n;n;n;w;n;n;n;w;n;event_1_15941870;n;n;n;n", desc: "这人看起来很普通，是那种见过后便会忘记的人。", },
          { jh: "泰山", loc: "三透天", name: "铁面人", way: "jh 24;n;n;n;n;n;n;n;n;w;n;n;n;w;n;event_1_15941870;n;n;n;n;n", desc: "这人脸上蒙著一张黑铁面具，看不见他的模样，但面具后双眼却给人一种沧桑感。", },
          { jh: "泰山", loc: "茅舍", name: "司马墉", way: "jh 24;n;n;n;n;n;n;n;n;w;n;n;n;w;n;event_1_15941870;n;n;n;w", desc: "这人穿著一身长袍，敏锐的双眼让人感觉到他的精明过人。", },
          { jh: "泰山", loc: "跑马场", name: "阮大", way: "jh 24;n;n;n;n;n;n;n;n;w;n;n;n;w;n;event_1_15941870;n;w", desc: "这人五短身材，尖嘴猴腮。" },
          { jh: "泰山", loc: "山崖", name: "鲁刚", way: "jh 24;n;n;n;n;n;n;w", desc: "一名隐士，据闻此人精通铸剑。" },
          { jh: "泰山", loc: "红门宫", name: "程不为", way: "jh 24;n;n;n;n;w", desc: "此人出身神秘，常常独来独往，戴一副铁面具，不让人看到真面目，师承不明。", },
          { jh: "大旗门", loc: "", name: "卓三娘", way: ".靠谜题飞", desc: "闪电卓三娘轻功世无双，在碧落赋中排名第三。" },
          { jh: "大旗门", loc: "", name: "小白兔", way: ".靠谜题飞", desc: "小白兔白又白两只耳朵竖起来。" },
          { jh: "大旗门", loc: "", name: "朱藻", way: ".靠谜题飞", desc: "风流倜傥" },
          { jh: "大旗门", loc: "", name: "水灵儿", way: ".靠谜题飞", desc: "她满面愁容，手里虽然拿著本书，却只是呆呆的出神。" },
          { jh: "大旗门", loc: "", name: "风老四", way: ".靠谜题飞", desc: "风梭风九幽，但他现在走火入魔，一动也不能动了。" },
          { jh: "大旗门", loc: "", name: "阴宾", way: ".靠谜题飞", desc: "她面上蒙著轻红罗纱，隐约间露出面容轮廓，当真美得惊人，宛如烟笼芍药，雾里看花", },
          { jh: "大旗门", loc: "海边路", name: "渔夫", way: "jh 25;e;e;e", desc: "这是一个满脸风霜的老渔夫。" },
          { jh: "大旗门", loc: "海边", name: "叶缘", way: "jh 25;e;e;e;e;s", desc: "刚拜入大旗门不久的青年。" },
          { jh: "大旗门", loc: "常春岛渡口", name: "老婆子", way: "jh 25;e;e;e;e;s;yell", desc: "她面容被岁月侵蚀，风雨吹打，划出了千百条皱纹，显得那么衰老但一双眼睛，却仍亮如闪电，似是只要一眼瞧过去，任何人的秘密，却再也休想瞒过她。", },
          { jh: "大旗门", loc: "小路", name: "罗少羽", way: "jh 25;e;e;e;e;s;yell;e", desc: "刚拜入大旗门不久的青年。" },
          { jh: "大旗门", loc: "小路", name: "青衣少女", way: "jh 25;e;e;e;e;s;yell;e;ne", desc: "一个身材苗条，身著青衣的少女。" },
          { jh: "大旗门", loc: "观月顶", name: "青衣少女", way: "jh 25;e;e;e;e;s;yell;e;ne;se;e;e;e;e", desc: "一个身材苗条，身著青衣的少女。" },
          { jh: "大旗门", loc: "观月顶", name: "日岛主", name_new: "铁夫人", way: "jh 25;e;e;e;e;s;yell;e;ne;se;e;e;e;e", desc: "日岛主乃大旗门第七代掌门人云翼之妻，因看不惯大旗门人对其n妻子的无情，开创常春岛一派，以收容世上所有伤心女子。", },
          { jh: "大旗门", loc: "礁石", name: "潘兴鑫", way: "jh 25;e;e;e;e;s;yell;s", desc: "刚到拜入大旗门不久的青年。" },
          { jh: "大旗门", loc: "洞穴", name: "铁掌门", name_new: "雷昊阳", way: "jh 25;e;e;e;e;s;yell;s;e;event_1_81629028", desc: "他是大旗门的传人。", },
          { jh: "大旗门", loc: "石屋", name: "夜皇", name_new: "铁雍华", way: "jh 25;e;e;e;e;s;yell;s;e;event_1_81629028;s;e;n;w;w", desc: "他容光焕发，须发有如衣衫般轻柔，看来虽是潇洒飘逸，又带有一种不可抗拒之威严。", },
          { jh: "大旗门", loc: "秘道", name: "红衣少女", way: "jh 25;e;e;e;e;s;yell;s;e;event_1_81629028;s;e;n;w;w;s;w", desc: "她身穿轻纱柔丝，白足如霜，青丝飘扬。", },
          { jh: "大旗门", loc: "秘道", name: "紫衣少女", way: "jh 25;e;e;e;e;s;yell;s;e;event_1_81629028;s;e;n;w;w;s;w", desc: "她身穿轻纱柔丝，白足如霜，青丝飘扬。" },
          { jh: "大旗门", loc: "秘道", name: "橙衣少女", way: "jh 25;e;e;e;e;s;yell;s;e;event_1_81629028;s;e;n;w;w;s;w", desc: "她身穿轻纱柔丝，白足如霜，青丝飘扬。" },
          { jh: "大旗门", loc: "秘道", name: "蓝衣少女", way: "jh 25;e;e;e;e;s;yell;s;e;event_1_81629028;s;e;n;w;w;s;w", desc: "她身穿轻纱柔丝，白足如霜，蓝丝飘扬。", },
          { jh: "大旗门", loc: "危崖前", name: "宾奴", way: "jh 25;w", desc: "阴宾所养的波斯猫" },
          { jh: "大昭寺", loc: "草原", name: "头狼", way: "jh 26;w;w;w;n;w;w;w;n", desc: "狼群之王，体型硕大，狼牙寒锋毕露。" },
          { jh: "大昭寺", loc: "阴山", name: "李将军", way: "jh 26;w;w;n", desc: "一个玄甲黑盔，身披白色披风的少年将军，虽面容清秀，却不掩眉宇之间的果决和坚毅。", },
          { jh: "大昭寺", loc: "草原", name: "镇魂将", way: "jh 26;w;w;w;n;w;w;w;n", desc: "金盔金甲的护陵大将。" },
          { jh: "大昭寺", loc: "草原", name: "突厥先锋大将", way: "jh 26;w;w;w;n;n", desc: "东突厥狼军先锋大将，面目凶狠，身披狼皮铠甲，揹负长弓，手持丈余狼牙棒。", },
          { jh: "大昭寺", loc: "大青山", name: "神秘甲士", way: "jh 26;w;w;n;w", desc: "身披重甲，手持长戟，不许旁人前进一步。" },
          { jh: "大昭寺", loc: "乌拉山", name: "地宫暗哨", way: "jh 26;w;w;n;w;w", desc: "黑衣黑靴，一旦有外人靠近地宫，便手中暗器齐发。" },
          { jh: "大昭寺", loc: "狼山", name: "守山力士", way: "jh 26;w;w;n;w;w;w", desc: "他们的双拳，便是镇守陵寝最好的武器。" },
          { jh: "大昭寺", loc: "草原", name: "牧羊女", way: "jh 26", desc: "一个天真活泼，美丽大方的少女。" },
          { jh: "大昭寺", loc: "草原", name: "草原狼", way: "jh 26;w", desc: "一直凶残的草原狼。" },
          { jh: "大昭寺", loc: "草原", name: "小绵羊", way: "jh 26;w", desc: "一只全身雪白的的绵羊。" },
          { jh: "大昭寺", loc: "草原", name: "牧羊女", way: "jh 26;w;w", desc: "一个牧羊女正在放羊。" },
          { jh: "大昭寺", loc: "草原", name: "大绵羊", way: "jh 26;w;w", desc: "一只全身雪白的的绵羊。" },
          { jh: "大昭寺", loc: "草原", name: "白衣少年", way: "jh 26;w;w;w", desc: "年纪轻轻的少年，武功了得，却心狠手辣。" },
          { jh: "大昭寺", loc: "草原", name: "小羊羔", way: "jh 26;w;w;w", desc: "一只全身雪白的的绵羊。" },
          { jh: "大昭寺", loc: "城门", name: "城卫", way: "jh 26;w;w;w;w;w", desc: "一个年青的藏僧。" },
          { jh: "大昭寺", loc: "塔顶", name: "紫衣妖僧", way: "jh 26;w;w;w;w;w;n", desc: "附有邪魔之气的僧人。" },
          { jh: "大昭寺", loc: "塔顶", name: "塔僧", way: "jh 26;w;w;w;w;w;n", desc: "一个负责看管舍利塔的藏僧。" },
          { jh: "大昭寺", loc: "八角街", name: "关外旅客", way: "jh 26;w;w;w;w;w;w", desc: "这是一位来大昭寺游览的旅客。" },
          { jh: "大昭寺", loc: "八角街", name: "护寺喇嘛", way: "jh 26;w;w;w;w;w;w", desc: "一个大招寺的藏僧。" },
          { jh: "大昭寺", loc: "八角街", name: "护寺藏尼", way: "jh 26;w;w;w;w;w;w;n", desc: "一个大招寺的藏尼。" },
          { jh: "大昭寺", loc: "鹰记商号", name: "卜一刀", way: "jh 26;w;w;w;w;w;w;n;n;e", desc: "他是个看起来相当英俊的年轻人，不过点神秘莫测的感觉。" },
          { jh: "大昭寺", loc: "八角街", name: "疯狗", way: "jh 26;w;w;w;w;w;w;n;n;w", desc: "一只浑身脏兮兮的野狗，一双眼睛正恶狠狠地瞪著你。" },
          { jh: "大昭寺", loc: "八角街", name: "余洪兴", way: "jh 26;w;w;w;w;w;w;s", desc: "这是位笑眯眯的丐帮八袋弟子，生性多智，外号小吴用。" },
          { jh: "大昭寺", loc: "迎梅客栈", name: "店老板", way: "jh 26;w;w;w;w;w;w;s;e", desc: "这位店老板正在招呼客人。" },
          { jh: "大昭寺", loc: "八角街", name: "野狗", way: "jh 26;w;w;w;w;w;w;s;s;w;w;w;w", desc: "一只浑身脏兮兮的野狗，一双眼睛正恶狠狠地瞪著你。一只浑身脏兮兮的野狗。", },
          { jh: "大昭寺", loc: "八角街", name: "收破烂的", way: "jh 26;w;w;w;w;w;w;s;s;w;w;w;w", desc: "一个收破烂的。" },
          { jh: "大昭寺", loc: "八角街", name: "樵夫", way: "jh 26;w;w;w;w;w;w;s;s;w;w;w;w", desc: "你看到一个粗壮的大汉，身上穿著普通樵夫的衣服。" },
          { jh: "大昭寺", loc: "八角街", name: "乞丐", way: "jh 26;w;w;w;w;w;w;s;s;w;w;w;w;n;n", desc: "一个满脸风霜之色的老乞丐。" },
          { jh: "大昭寺", loc: "驿站", name: "陶老大", way: "jh 26;w;w;w;w;w;w;s;w", desc: "这是整天笑咪咪的车老板，虽然功夫不高，却也过得自在。" },
          { jh: "大昭寺", loc: "木屋", name: "胭松", way: "jh 26;w;w;w;w;w;w;w;w;n;e", desc: "胭松是葛伦高僧的得意二弟子。" },
          { jh: "大昭寺", loc: "宝塔", name: "塔祝", way: "jh 26;w;w;w;w;w;w;w;w;w", desc: "这个老人看起来七十多岁了，看著他佝偻的身影，你忽然觉得心情沈重了下来。" },
          { jh: "大昭寺", loc: "禅房", name: "灵空", way: "jh 26;w;w;w;w;w;w;w;w;w;w", desc: "灵空高僧是大昭寺现在的主持。" },
          { jh: "大昭寺", loc: "禅房", name: "护寺藏尼", way: "jh 26;w;w;w;w;w;w;w;w;w;w", desc: "一个大招寺的藏尼。" },
          { jh: "大昭寺", loc: "大昭秘境", name: "葛伦", way: "jh 26;w;w;w;w;w;w;w;w;w;w;ask?lama_master;event_1_91837538", desc: "葛伦高僧已在大昭寺主持多年。男女弟子遍布关外。", },
          { jh: "魔教", loc: "风雷堂正殿", name: "童长老", way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的尸体;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;nw", desc: "他使得一手好锤法。", },
          { jh: "魔教", loc: "饮马滩", name: "船夫", way: "jh 27;ne;nw;w;nw;w;w", desc: "一个船夫。" },
          { jh: "魔教", loc: "黄土小径", name: "冉无望", way: "jh 27;ne;n;ne", desc: "一个面容俊朗的少年，却眉头深锁，面带杀气。" },
          { jh: "魔教", loc: "饮马滩", name: "外面船夫", way: "jh 27;ne;nw;w;nw;w;w", desc: "一个船夫。" },
          { jh: "魔教", loc: "跪拜坪", name: "见钱开", way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的尸体;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;e", desc: "此人十分喜好钱财。", },
          { jh: "魔教", loc: "日月神道", name: "魔教弟子", way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的尸体;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n", desc: "这家伙满脸横肉，一付凶神恶煞的模样，令人望而生畏。", },
          { jh: "魔教", loc: "神教监牢", name: "(紫色)魔教犯人", way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的尸体;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;e;n", desc: "一个魔教的犯人，他们都是到魔教卧底的各大门派弟子事泄被捕的", },
          { jh: "魔教", loc: "神教监牢", name: "(青色)魔教犯人", way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的尸体;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;e;e;e;n", desc: "一个魔教的犯人，他们都是到魔教卧底的各大门派弟子事泄被捕的", },
          { jh: "魔教", loc: "神教监牢", name: "(红色)魔教犯人", way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的尸体;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;e;e;e;e;n", desc: "一个魔教的犯人，他们都是到魔教卧底的各大门派弟子事泄被捕的", },
          { jh: "魔教", loc: "神教监牢", name: "(蓝色)魔教犯人", way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的尸体;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;e;e;e;e;e;n", desc: "一个魔教的犯人，他们都是到魔教卧底的各大门派弟子事泄被捕的", },
          { jh: "魔教", loc: "神剑阁", name: "独孤风", name_new: "夏侯京", way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的尸体;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;e", desc: "此人是用剑高手。", },
          { jh: "魔教", loc: "魔庆堂", name: "杨延庆", way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的尸体;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;e;e", desc: "他使得一手好枪法。", },
          { jh: "魔教", loc: "魔松阁", name: "范松", way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的尸体;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;e;e;e", desc: "他使得一手好斧法。", },
          { jh: "魔教", loc: "魔灵阁", name: "巨灵", way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的尸体;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e", desc: "他使得一手好锤法。", },
          { jh: "魔教", loc: "魔楚阁", name: "楚笑", way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的尸体;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e", desc: "虽是女子，但武功绝不输于须眉。", },
          { jh: "魔教", loc: "成德殿", name: "莲亭", way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的尸体;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;n", desc: "他身形魁梧，满脸虬髯，形貌极为雄健。", },
          { jh: "魔教", loc: "成德殿", name: "(亮蓝色)魔教弟子", way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的尸体;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;n", desc: "", },
          { jh: "魔教", loc: "针线小筑", name: "东方教主", name_new: "葵花传人", way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的尸体;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;n;n;event_1_57107759;e;e;n;w", desc: "他就是日月神教教主。号称无人可敌。", },
          { jh: "魔教", loc: "魔容阁", name: "花想容", way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的尸体;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;w", desc: "她使得一手好刀法。", },
          { jh: "魔教", loc: "魔洋阁", name: "曲右使", way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的尸体;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;w;w", desc: "他使得一手好钩法。", },
          { jh: "魔教", loc: "魔风阁", name: "张矮子", way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的尸体;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;w;w;w", desc: "他使得一手好武功。", },
          { jh: "魔教", loc: "魔云阁", name: "张白发", way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的尸体;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w", desc: "他使得一手好掌法。", },
          { jh: "魔教", loc: "魔鹤阁", name: "赵长老", way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的尸体;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w", desc: "他使得一手好叉法。", },
          { jh: "魔教", loc: "风雷堂", name: "王诚", way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的尸体;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;ne", desc: "他使得一手好刀法。", },
          { jh: "魔教", loc: "白虎堂正堂", name: "上官云", way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的尸体;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;w;n", desc: "他使得一手好剑法。", },
          { jh: "魔教", loc: "流云堂", name: "桑三娘", way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的尸体;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;w;ne", desc: "她使得一手好叉法。", },
          { jh: "魔教", loc: "霸气堂", name: "葛停香", way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的尸体;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;w;nw", desc: "他天生神力，勇猛无比。", },
          { jh: "魔教", loc: "白虎堂", name: "罗烈", way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的尸体;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;w;se", desc: "他使得一手好枪法。", },
          { jh: "魔教", loc: "朱雀正堂", name: "贾布", way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的尸体;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;w;sw", desc: "他使得一手好钩法。", },
          { jh: "魔教", loc: "玄武正堂", name: "鲍长老", way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的尸体;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;w;w", desc: "他一身横练的功夫，孔武有力。", },
          { jh: "魔教", loc: "饮马滩", name: "里面船夫", way: "jh 27;ne;nw;w;nw;w;w;yell", desc: "一个船夫。" },
          { jh: "魔教", loc: "步神小道", name: "(青色)魔教弟子", way: "jh 27;ne;nw;w;nw;w;w;yell;w;nw;n;n;n;n;n", desc: "" },
          { jh: "魔教", loc: "步神小道", name: "青色魔教弟子", way: "jh 27;ne;nw;w;nw;w;w;yell;w;nw;n;n;n;n;n", desc: "" },
          { jh: "魔教", loc: "绳索吊桥", name: "魔教弟子", way: "jh 27;ne;nw;w;nw;w;w;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n", desc: "这家伙满脸横肉，一付凶神恶煞的模样，令人望而生畏。", },
          { jh: "魔教", loc: "铁门", name: "白色魔教弟子", way: "jh 27;ne;nw;w;nw;w;w;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n", desc: "" },
          { jh: "魔教", loc: "铁门", name: "(白色)魔教弟子", way: "jh 27;ne;nw;w;nw;w;w;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n", desc: "" },
          { jh: "魔教", loc: "铁门", name: "(蓝色)魔教弟子", way: "jh 27;ne;nw;w;nw;w;w;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n", desc: "" },
          { jh: "魔教", loc: "铁门", name: "蓝色魔教弟子", way: "jh 27;ne;nw;w;nw;w;w;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n", desc: "" },
          { jh: "魔教", loc: "平地", name: "黄色魔教弟子", way: "jh 27;ne;nw;w;nw;w;w;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n", desc: "" },
          { jh: "魔教", loc: "平地", name: "(黄色)魔教弟子", way: "jh 27;ne;nw;w;nw;w;w;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n", desc: "", },
          { jh: "魔教", loc: "子午楼", name: "店小二", way: "jh 27;ne;w", desc: "这是一个忙忙碌碌的小二。" },
          { jh: "魔教", loc: "子午楼", name: "客店老板", way: "jh 27;ne;w", desc: "一个贼眉鼠眼的商人。" },
          { jh: "魔教", loc: "黑山林", name: "黑熊", way: "jh 27;se;e", desc: "一只健壮的黑熊。" },
          { jh: "魔教", loc: "林洞", name: "怪人", way: "jh 27;se;e;e;e", desc: "看起来像是只妖怪一般。" },
          { jh: "星宿海", loc: "山洞", name: "玄衣刀妖", way: "jh 28;n;w;w;w;se", desc: "一个白发老人，身著紫衣，眼神凶狠，太阳穴隆起，显是有不低的内力修为。" },
          { jh: "星宿海", loc: "小屋", name: "波斯老者", way: "jh 28;nw;sw", desc: "一个老者来自波斯，似乎是一个铁匠，脸上看起来有点阴险的感觉。" },
          { jh: "星宿海", loc: "天山下", name: "波斯商人", way: "jh 28", desc: "一个高鼻蓝眼的波斯商人。他看著你脸上露出狡猾的笑容。" },
          { jh: "星宿海", loc: "天山山路", name: "牧羊人", way: "jh 28;n", desc: "一个老汉，赶著几十只羊。" },
          { jh: "星宿海", loc: "天山山路", name: "星宿派钹手", way: "jh 28;n;n", desc: "他是星宿派的击钹手。他手中拿著一对铜钹，一边敲一边扯著嗓子唱些肉麻的话。", },
          { jh: "星宿海", loc: "天山山路", name: "星宿派鼓手", way: "jh 28;n;n", desc: "他是星宿派的吹鼓手。他面前放著一只铜鼓，一边敲一边扯著嗓子唱些肉麻的话。" },
          { jh: "星宿海", loc: "天山山路", name: "狮吼师兄", way: "jh 28;n;n", desc: "他就是丁老怪的二弟子。他三十多岁，狮鼻阔口，一望而知不是中土人士。", },
          { jh: "星宿海", loc: "天山山路", name: "星宿派号手", way: "jh 28;n;n", desc: "他是星宿派的吹号手。他手中拿著一只铜号，鼓足力气一脸沉醉地吹著。", },
          { jh: "星宿海", loc: "星宿海", name: "摘星大师兄", way: "jh 28;n;n;n", desc: "他就是丁老怪的大弟子、星宿派大师兄。他三十多岁，脸庞瘦削，眼光中透出一丝乖戾之气。", },
          { jh: "星宿海", loc: "日月洞", name: "丁老怪", name_new: "天宿老怪", way: "jh 28;n;n;n;n;n", desc: "他就是天宿派开山祖师、令正派人士深恶痛绝的天宿老怪。可是他看起来形貌清奇，仙风道骨。", },
          { jh: "星宿海", loc: "石道", name: "采花子", way: "jh 28;n;n;n;n;nw;w", desc: "采花子是星宿派的一个小喽罗，武功虽不好，但生性淫邪，经常奸淫良家妇女，是官府通缉的犯人，故而星宿派名义上也不承认有这个弟子。", },
          { jh: "星宿海", loc: "天山山路", name: "紫姑娘", way: "jh 28;n;w", desc: "她就是丁老怪弟子紫姑娘。她容颜俏丽，可眼神中总是透出一股邪气。" },
          { jh: "星宿海", loc: "小路", name: "天狼师兄", way: "jh 28;n;w;n", desc: "他就是丁老怪的三弟子。" },
          { jh: "星宿海", loc: "小路", name: "出尘师弟", way: "jh 28;n;w;n;n", desc: "他就是丁老怪的八弟子。他身才矮胖，可手中握的钢杖又长又重。" },
          { jh: "星宿海", loc: "天山山路", name: "采药人", way: "jh 28;n;w;w", desc: "一个辛苦工作的采药人。" },
          { jh: "星宿海", loc: "天山顶峰", name: "周女侠", way: "jh 28;n;w;w;w;w", desc: "身形修长，青裙曳地。皮肤白嫩，美若天人。恍若仙子下凡，是人世间极少的绝美女子。其武功修为十分了得。", },
          { jh: "星宿海", loc: "天山顶峰", name: "毒蛇", way: "jh 28;n;w;w;w;w", desc: "一只有著三角形脑袋的蛇，尾巴沙沙做响。" },
          { jh: "星宿海", loc: "百龙山", name: "毒蛇", way: "jh 28;n;w;w;w;w;n", desc: "一只有著三角形脑袋的蛇，尾巴沙沙做响。" },
          { jh: "星宿海", loc: "野牛沟", name: "牦牛", way: "jh 28;n;w;w;w;w;w;w;nw;ne;nw;w", desc: "这是一头常见的昆仑山野牦牛" },
          { jh: "星宿海", loc: "野牛沟", name: "雪豹", way: "jh 28;n;w;w;w;w;w;w;nw;ne;nw;w", desc: "这是一头通体雪白的昆仑山雪豹，极为罕有。" },
          { jh: "星宿海", loc: "伊犁", name: "唐冠", way: "jh 28;nw", desc: "唐门中的贵公子，父亲是唐门中的高层，看起来极自负。" },
          { jh: "星宿海", loc: "伊犁", name: "伊犁", way: "jh 28;nw", desc: "" },
          { jh: "星宿海", loc: "伊犁", name: "矮胖妇女", way: "jh 28;nw", desc: "一个很胖的中年妇女。" },
          { jh: "星宿海", loc: "巴依家院", name: "巴依", way: "jh 28;nw;e", desc: "一个风尘仆仆的侠客。。" },
          { jh: "星宿海", loc: "巴依家院", name: "小孩", way: "jh 28;nw;e", desc: "这是个小孩子" },
          { jh: "星宿海", loc: "巴依家客厅", name: "阿凡提", way: "jh 28;nw;e;e", desc: "他头上包著头巾，长著向上翘的八字胡，最喜欢捉弄巴依、帮助穷人。他常给别人出谜语。", },
          { jh: "星宿海", loc: "赛马场", name: "伊犁马", way: "jh 28;nw;nw", desc: "这是一匹雄壮的母马，四肢发达，毛发油亮。" },
          { jh: "星宿海", loc: "赛马场", name: "阿拉木罕", way: "jh 28;nw;nw", desc: "她身段不肥也不瘦。她的眉毛像弯月，她的眼睛很多情。" },
          { jh: "星宿海", loc: "杂货铺", name: "买卖提", way: "jh 28;nw;w", desc: "买卖提是个中年商人，去过几次中原，能讲一点儿汉话。" },
          { jh: "星宿海", loc: "戈壁山洞", name: "天梵密使", way: "jh 28;nw;w;buy /map/xingxiu/npc/obj/fire from xingxiu_maimaiti;e;se;sw;event_1_83637364", desc: "天梵宗主密使，遮住了容貌，神秘莫测。", },
          { jh: "星宿海", loc: "南疆沙漠", name: "梅师姐", way: "jh 28;sw", desc: "此人一脸干皱的皮肤，双眼深陷，犹如一具死尸。" },
          { jh: "星宿海", loc: "南疆沙漠", name: "铁尸", way: "jh 28;sw;nw;sw;sw;nw;nw;se;sw", desc: "这人全身干枯，不像一个人，倒像是一具干尸。" },
          { jh: "茅山", loc: "南疆沙漠", name: "心魔", way: "", desc: "缺" },
          { jh: "茅山", loc: "山道", name: "野猪", way: "jh 29;n", desc: "一只笨笨的野猪" },
          { jh: "茅山", loc: "龙城道场", name: "阳明居士", way: "jh 29;n;n;n;n;event_1_60035830;place?平台;e", desc: "阳明居士潇洒俊逸，一代鸿儒，学识渊博且深谙武事，有「军神」之美誉，他开创的「阳明心学」更是打破了朱派独霸天下的局面。", },
          { jh: "茅山", loc: "", name: "张天师", way: "jh 29;n;n;n;n;event_1_60035830;place?平台;event_1_65661209;place?无名山峡谷;n", desc: "他是龙虎山太乙一派的嫡系传人，他法力高强，威名远播。", },
          { jh: "茅山", loc: "", name: "万年火龟", way: "jh 29;n;n;n;n;event_1_60035830;place?平台;event_1_65661209;place?无名山峡谷;n", desc: "一只尺许大小，通体火红的乌龟。", },
          { jh: "茅山", loc: "", name: "道士", way: "jh 29;n;n;n;n;event_1_60035830;place?平台;event_1_65661209;place?洞口;n;n;n;n;n;e;n", desc: "茅山派的道士，著一身黑色的道袍", },
          { jh: "茅山", loc: "", name: "孙天灭", way: "jh 29;n;n;n;n;event_1_60035830;place?平台;event_1_65661209;place?洞口;n;n;n;n;n;n;n", desc: "孙天灭外号六指小真人，是林忌最喜爱的徒弟。他尽得林忌真传！", },
          { jh: "茅山", loc: "", name: "道灵", way: "jh 29;n;n;n;n;event_1_60035830;place?平台;event_1_65661209;place?洞口;n;n;n;n;n;n;n;event_1_98579273", desc: "道灵真人是林忌的师弟，也是上代掌门的关门弟子，虽然比林忌小了几岁，但道行十分高深，「谷衣心法」已修炼到极高境界了。", },
          { jh: "茅山", loc: "", name: "林忌", way: "jh 29;n;n;n;n;event_1_60035830;place?平台;event_1_65661209;place?洞口;n;n;n;n;n;n;n;event_1_98579273;n", desc: "林忌是一位道行十分高深的修道者，你发现他的眼珠一个是黑色的，一个是金色的，这正是「谷衣心法」修炼到极高境界的征兆。", },
          { jh: "茅山", loc: "", name: "护山使者", way: "jh 29;n;n;n;n;event_1_60035830;place?平台;event_1_65661209;place?洞口;n;n;n;n;n;n;n;event_1_98579273;w", desc: "护山使者是茅山派的护法，著一身黑色的道袍", },
          { jh: "桃花岛", loc: "后院", name: "桃花岛弟子", way: "jh 30;n;n;n;n;n;n;n", desc: "一个三十出头的小伙子，身板结实，双目有神，似乎练过几年功夫。", },
          { jh: "桃花岛", loc: "", name: "陆废人", way: "jh 30", desc: "他是黄岛主的三弟子。" },
          { jh: "桃花岛", loc: "", name: "老渔夫", way: "jh 30;n;n;n;n;n;n", desc: "一个看上去毫不起眼的老渔夫，然而……" },
          { jh: "桃花岛", loc: "习武房", name: "桃花岛弟子", way: "jh 30;n;n;n;n;n;n;n;n;n;n;w", desc: "一个二十出头的小伙子，身板结实，双目有神，似乎练过几年功夫。", },
          { jh: "桃花岛", loc: "", name: "曲三", way: "jh 30;n;n;n;n;n;n;n;n;n;n;e;e;n", desc: "他是黄岛主的四弟子。" },
          { jh: "桃花岛", loc: "", name: "丁高阳", way: "jh 30;n;n;n;n;n;n;n;n;n;n;e;s", desc: "曲三的一位好友，神态似乎非常著急。" },
          { jh: "桃花岛", loc: "", name: "黄岛主", name_new: "李奇门", way: "jh 30;n;n;n;n;n;n;n;n;n;n;n;n;n;n", desc: "他就是桃花岛主，喜怒无常，武功深不可测。", },
          { jh: "桃花岛", loc: "", name: "蓉儿", way: "jh 30;n;n;n;n;n;n;n;n;n;n;n;n;n;n;se;s", desc: "她是黄岛主的爱女，长得极为漂亮。" },
          { jh: "桃花岛", loc: "药房", name: "桃花岛弟子", way: "jh 30;n;n;n;n;n;n;n;n;n;n;w;w;s", desc: "一个二十出头的小伙子，身板结实，双目有神，似乎练过几年功夫。", },
          { jh: "桃花岛", loc: "", name: "哑仆", way: "jh 30;n;n;n;n;n;n;n;n;n;n;w;w;s", desc: "这是一个桃花岛的哑仆。他们全是十恶不赦的混蛋，黄药师刺哑他们，充为下御。", },
          { jh: "桃花岛", loc: "", name: "哑仆人", way: "jh 30;n;n;n;n;n;n;n;w;w", desc: "又聋又哑，似乎以前曾是一位武林高手。" },
          { jh: "桃花岛", loc: "", name: "神雕大侠", name_new: "过必修", way: "jh 30;n;n;ne", desc: "他就是神雕大侠，一张清癯俊秀的脸孔，剑眉入鬓。", },
          { jh: "桃花岛", loc: "", name: "傻姑", way: "jh 30;yell;w;n", desc: "这位姑娘长相还算端正，就是一副傻头傻脑的样子。" },
          { jh: "桃花岛", loc: "", name: "戚总兵", way: "jh 30;yell;w;n;e", desc: "此乃东南海防驻军主将，英武之气凛凛逼人，威信素著，三军皆畏其令，从不敢扰民。", },
          { jh: "铁雪山庄", loc: "", name: "小贩", way: "jh 11;e;e;s;n;nw;w;nw;e", desc: "这小贩左手提著个篮子，右手提著个酒壶。篮上系著铜铃，不住叮铛作响。", },
          { jh: "铁雪山庄", loc: "", name: "酒肉和尚", way: "jh 11;e;e;s;n;nw;w;nw;e;e;e;n;w", desc: "这是一个僧不僧俗不俗，满头乱发的怪人" },
          { jh: "铁雪山庄", loc: "野猪岭", name: "纵横老野猪\u001b\t", way: "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e", desc: "两件普通的黑布衣衫罩在身上，粗犷的眉宇间英华内敛，目光凝实如玉，显出极高的修行。《参同契》有云：「故铅外黑，内怀金华，被褐怀玉，外为狂夫」。目睹此人，可窥一斑。", },
          { jh: "铁雪山庄", loc: "", name: "老妖", way: "jh 31;n;se;e;se;s;s;sw;se;se", desc: "一个金眼赤眉的老人，传说来自遥远的黑森之山，有著深不可测的妖道修为。" },
          { jh: "铁雪山庄", loc: "羊肠小道", name: "樵夫", way: "jh 31;n;n;n", desc: "一个砍柴为生的樵夫。" },
          { jh: "铁雪山庄", loc: "", name: "樵夫", way: "jh 31;n;n;n;w", desc: "一个砍柴为生的樵夫。" },
          { jh: "铁雪山庄", loc: "世外桃源", name: "欧冶子", way: "jh 31;n;n;n;w;w;w", desc: "华夏铸剑第一人，许多神剑曾出自他手。" },
          { jh: "铁雪山庄", loc: "翠竹庄门", name: "老张", way: "jh 31;n;n;n;w;w;w;w;n", desc: "铁血山庄的门卫。" },
          { jh: "铁雪山庄", loc: "山庄前院", name: "雪鸳", way: "jh 31;n;n;n;w;w;w;w;n;n", desc: "神秘的绿衣女子，似乎隐居在铁雪山庄，无人能知其来历。", },
          { jh: "铁雪山庄", loc: "", name: "小翠", way: "jh 31;n;n;n;w;w;w;w;n;n;n", desc: "铁雪山庄的一个丫鬟。" },
          { jh: "铁雪山庄", loc: "", name: "雪蕊儿", way: "jh 31;n;n;n;w;w;w;w;n;n;n", desc: "雪蕊儿肤白如雪，很是漂亮。在这铁雪山庄中，和铁少过著神仙一般的日子。", },
          { jh: "铁雪山庄", loc: "翠竹屋", name: "铁少", way: "jh 31;n;n;n;w;w;w;w;n;n;n", desc: "铁山是一个风流倜傥的公子。" },
          { jh: "铁雪山庄", loc: "山庄后院", name: "白袍公", way: "jh 31;n;n;n;w;w;w;w;n;n;n;n", desc: "一个一袭白衣的老翁。" },
          { jh: "铁雪山庄", loc: "", name: "黑袍公", way: "jh 31;n;n;n;w;w;w;w;n;n;n;n", desc: "一个一袭黑衣的老翁。" },
          { jh: "铁雪山庄", loc: "洞后营地", name: "黑衣人", way: "jh 31;n;e;n;n;se;sw;s;nw;n", desc: "全身黑衣的青年，现在似乎没有没有带面罩，相貌很不显眼" },
          { jh: "铁雪山庄", loc: "营地大帐", name: "黑衣首领", way: "jh 31;n;e;n;n;se;sw;s;nw;n;e", desc: "看起来像是这里的首领，身穿黑衣，相貌非常普通", },
          { jh: "铁雪山庄", loc: "青石溪畔", name: "陈小神", way: "jh 31;n;se", desc: "快活林里小神仙，一个眉清目秀的江湖新人，据说机缘巧合下得到了不少江湖秘药，功力非同一般，前途不可限量。", },
          { jh: "铁雪山庄", loc: "", name: "剑荡八荒", way: "jh 31;n;se;e", desc: "虬髯大汉，要凭一把铁剑战胜天下高手，八荒无敌。" },
          { jh: "铁雪山庄", loc: "", name: "魏娇", way: "jh 31;n;se;e;se", desc: "女扮男装的青衣秀士，手持长剑，英姿飒爽，好一个巾帼不让须眉。" },
          { jh: "铁雪山庄", loc: "", name: "神仙姐姐", way: "jh 31;n;se;e;se;s", desc: "白裙袭地，仙气氤氲，武林中冉冉升起的新星，誓要问鼎至尊榜，执天下之牛耳。" },
          { jh: "铁雪山庄", loc: "半山桃林", name: "寒夜·斩", way: "jh 31;n;se;e;se;s;s", desc: "一副浪荡书生打扮的中年剑客，据说他也曾是一代高手。", },
          { jh: "铁雪山庄", loc: "", name: "他", way: "jh 31;n;se;e;se;s;s;sw", desc: "这人的名字颇为奇怪，只一个字。行为也颇为怪诞，总是藏在花丛里。不过武功底子看起来却一点都不弱。", },
          { jh: "铁雪山庄", loc: "", name: "出品人◆风云", way: "jh 31;n;se;e;se;s;s;sw;se", desc: "江湖豪门『21世纪影业』的核心长老之一，与帮主番茄携手打下一片江山，江湖中威震一方的豪杰。", },
          { jh: "铁雪山庄", loc: "", name: "二虎子", way: "jh 31;n;se;e;se;s;s;sw;se;se", desc: "一个已过盛年的江湖高手，像是曾有过辉煌，却早已随风吹雨打去。他曾有过很多名字，现在却连一个像样的都没有留下，只剩下喝醉后嘴里呢喃不清的“大师”，“二二二”，“泯恩仇”，你也听不出个所以然。", },
          { jh: "铁雪山庄", loc: "", name: "欢乐剑客", way: "jh 31;n;se;e;se;s;s;sw;se;se;e", desc: "『地府』威震江湖的右护法，手中大斧不知道收留了多少江湖高手的亡魂。", },
          { jh: "铁雪山庄", loc: "", name: "黑市老鬼", way: "jh 31;n;se;e;se;s;s;sw;se;se;e;nw", desc: "江湖人无人不知，无人不晓的黑市老鬼头，包裹里无奇不有，无所不卖，只要你有钱，什么稀奇的货品都有，比如黑鬼的凝视，眼泪，咆哮，微笑。。。一应俱全。", },
          { jh: "铁雪山庄", loc: "踏云小径", name: "无头苍蝇", way: "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne", desc: "一个佝偻著身躯的玄衣老头，从后面看去，似是没有头一样，颇为骇人。", },
          { jh: "铁雪山庄", loc: "", name: "神弑☆铁手", way: "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n", desc: "武林中数一数二的后起之秀，和所有崛起的江湖高手一样，潜心修炼，志气凌云。", },
          { jh: "铁雪山庄", loc: "", name: "禅师", way: "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne", desc: "一个退隐的禅师，出家人连名字都忘怀了，只剩下眼中隐含的光芒还能看出曾是问鼎武林的高手。", },
          { jh: "铁雪山庄", loc: "", name: "道一", way: "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n", desc: "后起之秀，面若中秋之月，色如春晓之花，鬓若刀裁，眉如墨画。", },
          { jh: "铁雪山庄", loc: "真龙隐武阁", name: "采菊隐士", way: "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n", desc: "一个与世无争的清修高人，无心江湖，潜心修仙。用「美男子」来形容他一点也不为过。身高近七尺，穿著一袭绣绿纹的紫长袍，外罩一件亮绸面的乳白色对襟袄背子。", },
          { jh: "铁雪山庄", loc: "武神步道", name: "【人间】雨修", way: "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n;n;n", desc: "曾经的江湖第二豪门『天傲阁』的大当家，武勇过人，修为颇深。怎奈何门派日渐式微，江湖声望一日不如一日，让人不禁扼腕叹息，纵使一方霸主也独木难支。", },
          { jh: "铁雪山庄", loc: "无双洞", name: "汉时叹", way: "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n;n;n;n;n;e;e;event_1_47175535", desc: "身穿水墨色衣、头戴一片毡巾，生得风流秀气。『地府』帮的开山祖师，曾是武功横绝一时的江湖至尊。手中暗器『大巧不工』闻者丧胆，镖身有字『挥剑诀浮云』。", },
          { jh: "铁雪山庄", loc: "破虚石台", name: "冷泉心影", way: "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n;n;n;n;n;e;n", desc: "『不落皇朝』当之无愧的君主和领袖，致力破除心中习武障魔，参得无上武道。头上戴著束发嵌宝紫金冠，齐眉勒著二龙抢珠金抹额，如同天上神佛降临人世。", },
          { jh: "铁雪山庄", loc: "绣冬堂", name: "烽火戏诸侯", way: "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n;n;n;n;n;n;n;n;e;e;event_1_94442590", desc: "身躯凛凛，相貌堂堂。一双眼光射寒星，两弯眉浑如刷漆。胸脯横阔，有万夫难敌之威风。武林至尊榜顶尖剑客，一人一剑，手持『春雷』荡平天剑谷，天下武林无人不晓！神剑剑身一面刻“凤年”，一面刻著“天狼”。", },
          { jh: "铁雪山庄", loc: "燕谿阁", name: "阿不", way: "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n;n;n;n;n;n;n;n;w;w;event_1_57281457", desc: "器宇轩昂，吐千丈凌云之志气。白衣黑发，双手负于背后，立于巨岩之顶，直似神明降世。这是武林至尊榜第一高手，不世出的天才剑客，率『纵横天下』帮独尊江湖。手持一柄『穿林雨』长枪，枪柄上刻著一行小字：『归去，也无风雨也无晴』。", },
          { jh: "铁雪山庄", loc: "破虚石台", name: "男主角◆番茄", way: "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n;n;n;n;n;w;n", desc: "江湖豪门『21世纪影业』的灵魂，当世绝顶高手之一，正在此潜心修练至上武学心法，立志要在这腥风血雨的江湖立下自己的声威！", },
          { jh: "铁雪山庄", loc: "沉剑渊", name: "剑仙", way: "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n;n;n;n;n;w;w;sw", desc: "白须白发，仙风道骨，离世独居的高人。", },
          { jh: "铁雪山庄", loc: "球霸酒家", name: "小飞", way: "jh 31;n;se;e;se;s;w", desc: "『不落皇朝』的二当家，为人洒脱风趣，酷爱蹴鞠，酒量超群，以球入道。传闻只要饮下三杯佳酿，带醉出战，那么不论是踢全场、转花枝、大小出尖，流星赶月，他都能凭借出色的技艺独占鳌头。", },
          { jh: "慕容山庄", loc: "", name: "家丁", way: "jh 32;n;n", desc: "一个穿著仆人服装的家丁。" },
          { jh: "慕容山庄", loc: "", name: "邓家臣", way: "jh 32;n;n;se", desc: "他是慕容家四大家臣之首，功力最为深厚。" },
          { jh: "慕容山庄", loc: "", name: "朱姑娘", way: "jh 32;n;n;se;e;s;s", desc: "这是个身穿红衣的女郎，大约十七八岁，一脸精灵顽皮的神气。一张鹅蛋脸，眼珠灵动，别有一番动人风韵。", },
          { jh: "慕容山庄", loc: "", name: "船工小厮", way: "jh 32;n;n;se;e;s;s;event_1_99232080", desc: "一位年轻的船工。表情看上去很消沉，不知道发生了什么。", },
          { jh: "慕容山庄", loc: "", name: "芳绫", way: "jh 32;n;n;se;e;s;s;event_1_99232080;e;e;s;e;s;e;e;e", desc: "她看起来像个小灵精，头上梳两个小包包头。她坐在地上，看到你看她便向你作了个鬼脸!你想她一定是调皮才会在这受罚!", },
          { jh: "慕容山庄", loc: "", name: "无影斥候", way: "jh 32;n;n;se;e;s;s;event_1_99232080;e;e;s;e;s;e;e;e;n", desc: "经常在孔府徘徊的斥候。", },
          { jh: "慕容山庄", loc: "", name: "柳掌门", way: "jh 32;n;n;se;e;s;s;event_1_99232080;e;e;s;e;s;e;e;e;s;s;event_1_92057893;e;s;event_1_8205862", desc: "封山剑派掌门，看似中了某种迷香，昏昏沉沉的睡著。", },
          { jh: "慕容山庄", loc: "", name: "慕容老夫人", way: "jh 32;n;n;se;n", desc: "她身穿古铜缎子袄裙，腕带玉镯，珠翠满头，打扮的雍容华贵，脸上皱纹甚多，眼睛迷迷朦朦，似乎已经看不见东西。", },
          { jh: "慕容山庄", loc: "", name: "慕容侍女", way: "jh 32;n;n;se;n", desc: "一个侍女，年龄不大。" },
          { jh: "慕容山庄", loc: "", name: "公冶家臣", way: "jh 32;n;n;se;n;n", desc: "他是慕容家四大家臣之二，为人稳重。" },
          { jh: "慕容山庄", loc: "", name: "包家将", way: "jh 32;n;n;se;n;n;n;n", desc: "他是慕容家四大家臣之三，生性喜欢饶舌。" },
          { jh: "慕容山庄", loc: "", name: "风波恶", way: "jh 32;n;n;se;n;n;n;n;n", desc: "他是慕容家四大家臣之四，最喜欢打架，轻易却不服输。" },
          { jh: "慕容山庄", loc: "", name: "慕容公子", way: "jh 32;n;n;se;n;n;n;n;w;w;n", desc: "他是姑苏慕容的传人，他容貌俊雅，风度过人，的确非寻常人可比。" },
          { jh: "慕容山庄", loc: "", name: "慕容家主", name_new: "燕浩宇", way: "jh 32;n;n;se;n;n;n;n;w;w;w;n;event_1_72278818;event_1_35141481;event_1_35141481;event_1_35141481;event_1_35141481;event_1_35141481;event_1_35141481;w", desc: "他是姑苏慕容的传人，可以说是自慕容龙城以下武功最为杰出之人。不仅能贯通天下百家之长，更是深为精通慕容家绝技。", },
          { jh: "慕容山庄", loc: "", name: "小兰", way: "jh 32;n;n;se;n;n;n;n;w;w;w;n;w", desc: "这是一个蔓陀山庄的丫环。" },
          { jh: "慕容山庄", loc: "", name: "神仙姐姐", way: "jh 32;n;n;se;n;n;n;n;w;w;w;n;w;n;e;n;e;n;e", desc: "她秀美的面庞之上，端庄中带有稚气，隐隐含著一丝忧色。见你注目看她不觉低头轻叹。只听得这轻轻一声叹息。霎时之间，你不由得全身一震，一颗心怦怦跳动。心想：“这一声叹息如此好听，世上怎能有这样的声音？”听得她唇吐玉音，更是全身热血如沸！", },
          { jh: "慕容山庄", loc: "", name: "小茗", way: "jh 32;n;n;se;n;n;n;n;w;w;w;n;w;n;e;n;e;n;n", desc: "这是一个蔓陀山庄的丫环。" },
          { jh: "慕容山庄", loc: "", name: "王夫人", way: "jh 32;n;n;se;n;n;n;n;w;w;w;n;w;n;e;n;e;n;n", desc: "她身穿鹅黄绸衫，眉目口鼻均美艳无伦，脸上却颇有风霜岁月的痕迹。", },
          { jh: "慕容山庄", loc: "", name: "严妈妈", way: "jh 32;n;n;se;n;n;n;n;w;w;w;n;w;n;e;n;e;n;w", desc: "一个中年妇女，身上的皮肤黝黑，常年不见天日的结果。", },
          { jh: "大理", loc: "", name: "侍从", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;n;w;n", desc: "这位倒也打扮的利索，一身短打，白布包头，翘起的裤腿，一双洁白的布鞋，格外醒目。他正准备出去筹备白尼族一年一度的大会。", },
          { jh: "大理", loc: "", name: "摆夷女子", way: "jh 33;sw;sw", desc: "她是一个身著白衣的摆夷女子，长发飘飘，身态娥娜。" },
          { jh: "大理", loc: "", name: "士兵", way: "jh 33;sw;sw;s;s", desc: "他是一个大理国禁卫军士兵，身著锦衣，手执钢刀，双目精光炯炯，警惕地巡视著四周的情形。" },
          { jh: "大理", loc: "", name: "武将", way: "jh 33;sw;sw;s;s", desc: "他站在那里，的确有说不出的威风。" },
          { jh: "大理", loc: "下关城", name: "台夷商贩", way: "jh 33;sw;sw;s;s;s;nw;n", desc: "一位台夷族的商贩，正在贩卖一竹篓刚打上来的活蹦乱跳的鲜鱼。", },
          { jh: "大理", loc: "", name: "乌夷商贩", way: "jh 33;sw;sw;s;s;s;nw;n", desc: "一位乌夷族的商贩，挑著一担皮毛野味在贩卖。" },
          { jh: "大理", loc: "", name: "土匪", way: "jh 33;sw;sw;s;s;s;nw;n;ne;n;n;ne", desc: "" },
          { jh: "大理", loc: "", name: "猎人", way: "jh 33;sw;sw;s;s;s;nw;n;nw;n", desc: "一位身强力壮的乌夷族猎手。" },
          { jh: "大理", loc: "", name: "皮货商", way: "jh 33;sw;sw;s;s;s;nw;n;nw;n", desc: "一位来远道而来的汉族商人，来此采购皮货。" },
          { jh: "大理", loc: "", name: "牧羊女", way: "jh 33;sw;sw;s;s;s;nw;n;nw;n;n;n;n;e;e", desc: "她是一个摆夷牧羊女子。" },
          { jh: "大理", loc: "", name: "牧羊人", way: "jh 33;sw;sw;s;s;s;nw;n;nw;n;n;n;n;e;e", desc: "他一个摆夷牧羊男子。" },
          { jh: "大理", loc: "", name: "僧人", way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;e;e", desc: "一个精壮僧人。" },
          { jh: "大理", loc: "", name: "贵公子", way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;e;e;e;e;e", desc: "这是一介翩翩贵公子，长得到也算玉树临风、一表人才，可偏偏一双眼睛却爱斜著瞟人。", },
          { jh: "大理", loc: "", name: "恶奴", way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;e;e;e;e;e", desc: "他看上去膀大腰粗，横眉怒目，满面横肉。看来手下倒也有点功夫。", },
          { jh: "大理", loc: "", name: "枯大师", way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;e;e;e;n", desc: "他的面容奇特之极，左边的一半脸色红润，皮光肉滑，有如婴儿，右边的一半却如枯骨，除了一张焦黄的面皮之外全无肌肉，骨头突了出来，宛然便是半个骷髅骨头。这是他修习枯荣禅功所致。", },
          { jh: "大理", loc: "", name: "平通镖局镖头", way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s", desc: "" },
          { jh: "大理", loc: "", name: "「平通镖局」镖头", way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s", desc: "一个风尘仆仆的侠客。。" },
          { jh: "大理", loc: "", name: "游客", way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e", desc: "一个远道来的汉族游客，风尘仆仆，但显然为眼前美景所动，兴高彩烈。", },
          { jh: "大理", loc: "", name: "村妇", way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e", desc: "一个年轻的摆夷村妇。" },
          { jh: "大理", loc: "", name: "段公子", way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne", desc: "他是一个身穿青衫的年轻男子。脸孔略尖，自有一股书生的呆气。" },
          { jh: "大理", loc: "罗伽甸", name: "农夫", way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;e", desc: "一位身强体壮的摆夷族农夫。" },
          { jh: "大理", loc: "阳宗镇", name: "台夷商贩", way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;e;e;se;e;e", desc: "一个台夷妇女，揹著个竹篓贩卖些丝织物品和手工艺品。", },
          { jh: "大理", loc: "", name: "老祭祀", way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;e;e;se;e;e;ne;e;n", desc: "" },
          { jh: "大理", loc: "", name: "老祭司", way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;e;e;se;e;e;ne;e;n", desc: "一个颇老朽的摆夷老人，穿戴齐整，是本村的祭司，权力颇大，相当于族长。", },
          { jh: "大理", loc: "", name: "采桑女", way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;e;e;se;e;e;s", desc: "一个年轻的摆夷采桑姑娘。" },
          { jh: "大理", loc: "", name: "竹叶青蛇", way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;e;e;se;e;e;sw", desc: "一只让人看了起鸡皮疙瘩的竹叶青蛇。", },
          { jh: "大理", loc: "林中山涧", name: "采笋人", way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;e;e;se;e;e;sw;s", desc: "一个壮年村民，住在数里外的村庄，背后背了个竹筐，手拿一把砍柴刀，上山来采竹笋。", },
          { jh: "大理", loc: "", name: "砍竹人", way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;e;e;se;e;e;sw;s;s", desc: "一个壮年村民，住在山下的村落里，是上山来砍伐竹子的。", },
          { jh: "大理", loc: "", name: "养蚕女", way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;e;e;se;e;e;sw;s;s;e;e", desc: "一个年轻的摆夷村妇，养蚕纺丝为生。", },
          { jh: "大理", loc: "", name: "纺纱女", way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;e;e;se;e;e;sw;s;s;e;n;e;n", desc: "一个年轻的摆夷村妇，心灵手巧，专擅纺纱。", },
          { jh: "大理", loc: "", name: "麻雀", way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;s", desc: "一只叽叽喳喳，飞来飞去的小麻雀。" },
          { jh: "大理", loc: "玉虚观前", name: "小道姑", way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;s;w;n", desc: "玉虚观的小道姑，她是在这接待香客的。" },
          { jh: "大理", loc: "", name: "刀俏尼", way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;s;w;n", desc: "这是个容貌秀丽的中年道姑，是个摆夷族女子，颇有雍容气质。" },
          { jh: "大理", loc: "", name: "毒蜂", way: "jh 33;sw;sw;s;s;s;s;e;e;n", desc: "一只色彩斑斓大个野蜂，成群结队的。" },
          { jh: "大理", loc: "", name: "傅护卫", way: "jh 33;sw;sw;s;s;s;s;s;e", desc: "他是大理国四大护卫之一。" },
          { jh: "大理", loc: "", name: "褚护卫", way: "jh 33;sw;sw;s;s;s;s;s;e;n", desc: "他是大理国四大护卫之一。身穿黄衣，脸上英气逼人。手持一根铁杆。", },
          { jh: "大理", loc: "", name: "家丁", way: "jh 33;sw;sw;s;s;s;s;s;e;n;se", desc: "他是大理国镇南王府的家丁。" },
          { jh: "大理", loc: "", name: "丹顶鹤", way: "jh 33;sw;sw;s;s;s;s;s;e;n;se;e", desc: "一只全身洁白的丹顶鹤，看来是修了翅膀，没法高飞了。" },
          { jh: "大理", loc: "", name: "段王妃", way: "jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e", desc: "大理王妃，徐娘半老，风韵犹存。" },
          { jh: "大理", loc: "", name: "养花女", way: "jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e;e;e", desc: "一位养花少女，她每天就是照顾这数也数不清的茶花。", },
          { jh: "大理", loc: "", name: "段无畏", way: "jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e;n", desc: "他是大理国镇南王府管家。" },
          { jh: "大理", loc: "", name: "古护卫", way: "jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e;n;n", desc: "" },
          { jh: "大理", loc: "", name: "王府御医", way: "jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e;n;n;n", desc: "一个风程仆仆的侠客。" },
          { jh: "大理", loc: "", name: "婉清姑娘", way: "jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e;n;n;n;ne;e;e;n", desc: "" },
          { jh: "大理", loc: "", name: "段皇爷", way: "jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e;n;n;n;ne;n", desc: "他就是大理国的镇南王，当今皇太弟，是有名的爱情圣手。", },
          { jh: "大理", loc: "", name: "石人", way: "jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e;s", desc: "一个练功用的比武石人，雕凿得很精细，如同真人一般。" },
          { jh: "大理", loc: "", name: "范司马", way: "jh 33;sw;sw;s;s;s;s;s;e;n;se;n;e", desc: "他是大理国三公之一。" },
          { jh: "大理", loc: "", name: "巴司空", way: "jh 33;sw;sw;s;s;s;s;s;e;n;se;n;n", desc: "他是大理国三公之一。一个又瘦又黑的汉子，但他的擅长轻功。" },
          { jh: "大理", loc: "", name: "华司徒", way: "jh 33;sw;sw;s;s;s;s;s;e;n;se;n;w", desc: "他是大理国三大公之一。华司徒本名阿根，出身贫贱，现今在大理国位列三公，未发迹时，干部的却是盗墓掘坟的勾当，最擅长的本领是偷盗王公巨贾的坟墓。这些富贵人物死后，必有珍异宝物殉葬，华阿根从极远处挖掘地道，通入坟墓，然后盗取宝物。所花的一和虽巨，却由此而从未为人发觉。有一次他掘入一坟，在棺木中得到了一本殉葬的武功秘诀，依法修习，练成了一身卓绝的外门功夫，便舍弃了这下贱的营生，辅佐保定帝，累立奇功，终于升到司徒之职。", },
          { jh: "大理", loc: "", name: "霍先生", way: "jh 33;sw;sw;s;s;s;s;s;e;n;se;w", desc: "他一身邋遢，形容委琐，整天迷迷糊糊的睡不醒模样。可是他的账务十几年来无可挑剔。原来他就是伏牛派的崔百泉，为避仇祸隐居于此。", },
          { jh: "大理", loc: "", name: "石匠", way: "jh 33;sw;sw;s;s;s;s;s;s;e;e", desc: "他是一个打磨大理石的石匠，身上只穿了一件坎肩，全身布满了厚实的肌肉。" },
          { jh: "大理", loc: "", name: "薛老板", way: "jh 33;sw;sw;s;s;s;s;s;s;e;n", desc: "这是一个经验老到的生意人，一双精明的眼睛不停的打量著你。", },
          { jh: "大理", loc: "", name: "江湖艺人", way: "jh 33;sw;sw;s;s;s;s;s;s;s", desc: "他是一个外地来的江湖艺人，手里牵著一只金丝猴儿，满脸风尘之色。", },
          { jh: "大理", loc: "太和居", name: "店小二", way: "jh 33;sw;sw;s;s;s;s;s;s;s;e", desc: "这位店小二正笑咪咪地忙著，还不时拿起挂在脖子上的抹布擦脸。" },
          { jh: "大理", loc: "", name: "歌女", way: "jh 33;sw;sw;s;s;s;s;s;s;s;e;n", desc: "她是一个卖唱为生的歌女。" },
          { jh: "大理", loc: "", name: "南国姑娘", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;e;s", desc: "南国的大姑娘颇带有当地优美秀丽山水的风韵，甜甜的笑，又有天真的浪漫。她穿著白色上衣，蓝色的宽裤，外面套著黑丝绒领褂，头上缠著彩色的头巾。", },
          { jh: "大理", loc: "", name: "摆夷老叟", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;e;s", desc: "一个摆夷老叟大大咧咧地坐在竹篱板舍门口，甩著三四个巴掌大的棕吕树叶，瞧著道上来来往往的人们，倒也快活自在。", },
          { jh: "大理", loc: "", name: "大土司", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;n;w;n", desc: "大土司是摆夷族人氏，是苍山纳苏系的。他倒是长的肥头大耳的，每说一句话，每有一点表情，满脸的肉纹便象是洱海里的波浪一样。他身著彩绸，头带凤羽，脚踩藤鞋，满身挂著不同色彩的贝壳。只见他傲气凛然地高居上座，不把来人看在眼里。", },
          { jh: "大理", loc: "", name: "族头人", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;n;w;n;se;ne", desc: "这位是哈尼的族头人，哈尼是大理国的第三大族，大多聚在大都附近。此人貌甚精明，身穿对襟衣，亦是白布包头。他坐在大土司的右下首，对来人细细打量著。", },
          { jh: "大理", loc: "", name: "黄衣卫士", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;n;w;s", desc: "这是位黄衣卫士，身著锦衣，手执钢刀，双目精光炯炯，警惕地巡视著四周的情形。", },
          { jh: "大理", loc: "", name: "盛皮罗客商", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s", desc: "这是一位从印度来的客商，皮肤黝黑，白布包头，大理把印度人叫作盛皮罗。", },
          { jh: "大理", loc: "客店", name: "店小二", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;e", desc: "这位店小二正笑咪咪地忙著，还不时拿起挂在脖子上的抹布擦脸。" },
          { jh: "大理", loc: "", name: "古灯大师", name_new: "段氏南僧", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;s", desc: "他身穿粗布僧袍，两道长长的白眉从眼角垂了下来，面目慈祥，长须垂肩，眉间虽隐含愁苦，但一番雍容高华的神色，却是一望而知。大师一生行善，积德无穷。", },
          { jh: "大理", loc: "", name: "族长", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;s;e;n;n", desc: "一位满脸皱纹的老年妇女，正是本村的族长。台夷时处母系氏族，族中权贵皆为妇女。", },
          { jh: "大理", loc: "", name: "祭司", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;s;e;n;n;n", desc: "一位满脸皱纹的老年妇女，是本村的大祭司，常年司守祭台。台夷时处母系氏族，祭司要职皆为妇女。", },
          { jh: "大理", loc: "", name: "祭祀", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;s;s;e;n;n;n", desc: "" },
          { jh: "大理", loc: "", name: "渔夫", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;s;se;sw;n", desc: "一位台夷族的渔夫，扛这两条竹桨，提著一个鱼篓。", },
          { jh: "大理", loc: "", name: "台夷猎人", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;s;se;sw;s", desc: "一位台夷族的猎手，擅用短弩，射飞鸟。", },
          { jh: "大理", loc: "", name: "台夷妇女", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;s;se;sw;w", desc: "一位中年的台夷妇女，上著无领衬花对襟，下穿五色筒裙，正在编织渔网。", },
          { jh: "大理", loc: "", name: "台夷姑娘", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;sw;sw", desc: "一位年轻的台夷姑娘，上著无领衬花对襟，下穿五色筒裙。", },
          { jh: "大理", loc: "竹楼下", name: "水牛", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;sw;sw;n", desc: "一头南方山区常见的水牛，是耕作的主力，也用来拉车载物。由于水草茂盛，长得十分肥壮。", },
          { jh: "大理", loc: "", name: "台夷农妇", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;sw;sw;s", desc: "一位年轻的台夷农妇，在田里辛勤地劳作著。", },
          { jh: "大理", loc: "青竹林", name: "采笋人", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;sw;sw;w", desc: "一个卢鹿部的青年台夷妇女，背后背了个竹筐，手拿一把砍柴刀，来采竹笋。", },
          { jh: "大理", loc: "", name: "野兔", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;se", desc: "一只好可爱的小野兔。" },
          { jh: "大理", loc: "", name: "侍者", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;w;w;se", desc: "他看上去长的眉清目秀。" },
          { jh: "大理", loc: "", name: "高侯爷", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;w;w;se;n", desc: "大理国侯爷，这是位宽袍大袖的中年男子，三缕长髯，形貌高雅", },
          { jh: "大理", loc: "", name: "素衣卫士", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;w;w;se;n", desc: "这是位身怀绝技的武士。" },
          { jh: "大理", loc: "", name: "傣族首领", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;w;w;se;n;n;e;e;se", desc: "" },
          { jh: "大理", loc: "", name: "陪从", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;w;w;se;n;n;w;se", desc: "" },
          { jh: "大理", loc: "", name: "摆夷小孩", way: "jh 33;sw;sw;s;s;s;s;s;s;w", desc: "一个幼小的摆夷儿童。" },
          { jh: "大理", loc: "", name: "锦衣卫士", way: "jh 33;sw;sw;s;s;s;s;s;w", desc: "这是位锦衣卫士，身著锦衣，手执钢刀，双目精光炯炯，警惕地巡视著四周的情形。", },
          { jh: "大理", loc: "", name: "朱护卫", way: "jh 33;sw;sw;s;s;s;s;s;w", desc: "他是大理国四大护卫之一。一副书生酸溜溜的打扮行头。" },
          { jh: "大理", loc: "", name: "太监", way: "jh 33;sw;sw;s;s;s;s;s;w;n;n", desc: "一个风尘仆仆的侠客。。" },
          { jh: "大理", loc: "", name: "宫女", way: "jh 33;sw;sw;s;s;s;s;s;w;n;n;n;n", desc: "一位大理皇宫乌夷族宫女，以酥泽发，盘成两环，一身宫装，目无表情。", },
          { jh: "大理", loc: "", name: "破嗔", way: "jh 33;sw;sw;s;s;s;s;w;w;n", desc: "他是一个和尚，是黄眉大师的二弟子。" },
          { jh: "大理", loc: "", name: "破疑", way: "jh 33;sw;sw;s;s;s;s;w;w;n", desc: "他是一个和尚，是黄眉大师的大弟子。" },
          { jh: "大理", loc: "", name: "段恶人", way: "jh 33;sw;sw;s;s;s;s;w;w;n;se", desc: "他身穿一件青布长袍，身高五尺有余，脸上常年戴一张人皮面具，喜怒哀乐一丝不露。", },
          { jh: "大理", loc: "", name: "神农帮弟子", way: "jh 33;sw;sw;s;s;s;s;w;w;s", desc: "这是一个神农帮的帮众，身穿黄衣，肩悬药囊，手持一柄药锄。", },
          { jh: "大理", loc: "", name: "无量剑弟子", way: "jh 33;sw;sw;s;s;s;s;w;w;s;nw", desc: "这是无量剑派的一名弟子，腰挎一柄长剑，神情有些鬼祟，象是惧怕些什么。", },
          { jh: "大理", loc: "", name: "吴道长", way: "jh 33;sw;sw;s;s;s;s;w;w;w;w", desc: "一个看起来道风仙骨的道士。" },
          { jh: "大理", loc: "", name: "(镇雄)农夫", way: "jh 33;sw;sw;s;s;s;s;w;w;w;w;w;n;e", desc: "一位乌夷族的农夫，束发总于脑后，用布纱包著，上半身裸露，下著兽皮。", },
          { jh: "大理", loc: "", name: "农夫", way: "jh 33;sw;sw;s;s;s;s;w;w;w;w;w;n;e", desc: "" },
          { jh: "大理", loc: "", name: "山羊", way: "jh 33;sw;sw;s;s;s;s;w;w;w;w;w;n;n", desc: "一头短角山羊，大理地区常见的家畜。" },
          { jh: "大理", loc: "", name: "少女", way: "jh 33;sw;sw;s;s;s;s;w;w;w;w;w;n;ne", desc: "一位乌夷族的少女，以酥泽发，盘成两环，上披蓝纱头巾，饰以花边。" },
          { jh: "大理", loc: "", name: "乌夷老祭祀", way: "jh 33;sw;sw;s;s;s;s;w;w;w;w;w;n;w;se", desc: "" },
          { jh: "大理", loc: "", name: "乌夷老祭司", way: "jh 33;sw;sw;s;s;s;s;w;w;w;w;w;n;w;se", desc: "一个乌夷族的祭司，身披乌夷大麾，戴著颇多金银饰物，显示其地位不凡。", },
          { jh: "大理", loc: "", name: "孟加拉虎", way: "jh 33;sw;sw;s;s;s;s;w;w;w;w;w;s;s;w;w", desc: "一只斑斓孟加拉虎，雄伟极了。" },
          { jh: "断剑山庄", loc: "", name: "黑袍老人", way: "jh 34;ne;e;e;e;e;e;n;e;n", desc: "一生黑装的老人。" },
          { jh: "断剑山庄", loc: "", name: "白袍老人", way: "jh 34;ne;e;e;e;e;e;n;e;n", desc: "一生白装的老人。" },
          { jh: "断剑山庄", loc: "", name: "尼姑", way: "jh 34;ne;e;e;e;e;e;n;n;n;n;n;n;e", desc: "一个正虔诚念经的尼姑。" },
          { jh: "断剑山庄", loc: "", name: "和尚", way: "jh 34;ne;e;e;e;e;e;n;n;n;n;n;w", desc: "出了家的人，唯一做的事就是念经了。" },
          { jh: "断剑山庄", loc: "", name: "摆渡老人", way: "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell", desc: "一个饱经风霜的摆渡老人。" },
          { jh: "断剑山庄", loc: "", name: "天怒剑客", way: "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;e;e", desc: "他是独孤求败的爱徒，但他和师傅的性格相差极远。他从不苟言笑，他的脸永远冰冷，只因他已看透了世界，只因他杀的人已太多。他永远只在杀人的时候微笑，当剑尖穿过敌人的咽喉，他那灿烂的一笑令人感到温暖，只因他一向认为——死者无罪！", },
          { jh: "断剑山庄", loc: "", name: "栽花老人", way: "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;n", desc: "一个饱经风霜的栽花老人。" },
          { jh: "断剑山庄", loc: "", name: "背刀人", way: "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;n;e;e", desc: "此人揹著一把生锈的刀，他似乎姓浪，武功深不可测。" },
          { jh: "断剑山庄", loc: "", name: "雁南飞", way: "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;n;e;n;e", desc: "这是一个绝美的女子，正在静静地望著天上的圆月。她的脸美丽而忧伤，忧伤得令人心碎。", },
          { jh: "断剑山庄", loc: "", name: "剑痴", way: "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;n;n;n;n", desc: "他是剑痴，剑重要过他的生命。" },
          { jh: "断剑山庄", loc: "", name: "独孤不败", name_new: "剑魔求败", way: "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;n;n;n;n;e;e;event_1_10251226", desc: "这就是一代剑帝独孤求败。独孤求败五岁练剑，十岁就已经罕有人能敌。被江湖称为剑术天才。", },
          { jh: "断剑山庄", loc: "", name: "雾中人", way: "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;n;n;n;n;n", desc: "这个人全身都是模糊的，仿佛是一个并不真正存在的影子。只因他一生都生活在雾中，雾朦胧，人亦朦胧。", },
          { jh: "断剑山庄", loc: "", name: "梦如雪", way: "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;n;n;w;w", desc: "这是一个寻梦的人。他已厌倦事实。他只有寻找曾经的梦，不知道这算不算是一种悲哀呢？", },
          { jh: "断剑山庄", loc: "", name: "落魄中年", way: "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;w;s", desc: "一位落魄的中年人，似乎是一位铁匠。" },
          { jh: "断剑山庄", loc: "", name: "摘星老人", way: "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;w;s;w", desc: "他站在这里已经有几十年了。每天看天上划过的流星，已经完全忘记了一切……甚至他自己。", },
          { jh: "断剑山庄", loc: "", name: "任笑天", way: "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;w;w", desc: "这是一个中年男子。正静静地站著，双目微闭，正在听海！", },
          { jh: "冰火岛", loc: "", name: "蓬面老头", way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;w;n;w;event_1_53278632", desc: "蓬头垢面，衣服千丝万缕，显然被关在这里已经很久了。", },
          { jh: "冰火岛", loc: "", name: "火麒麟王", way: "jh 35;nw;nw;nw;n;ne;nw", desc: "浑身充满灼热的气息，嘴巴可吐出高温烈焰，拥有强韧的利爪以及锋利的尖齿，是主宰冰火岛上的兽王。岛上酷热的火山地带便是他的领地，性格极其凶残，会将所看到闯入其领地的生物物焚烧殆尽。", },
          { jh: "冰火岛", loc: "", name: "游方道士", way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e", desc: "一名云游四海的道士，头束白色发带，身上的道袍颇为残旧，背驮著一个不大的行囊，脸上的皱纹显示饱经风霜的游历，双目却清澈异常，仿佛包容了天地。", },
          { jh: "冰火岛", loc: "", name: "梅花鹿", way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e", desc: "一身赭黄色的皮毛，背上还有许多像梅花白点。头上岔立著的一双犄角，看上去颇有攻击性。行动十分机敏。", },
          { jh: "冰火岛", loc: "大冰原", name: "赵郡主", way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n", desc: "天下兵马大元帅汝阳王之女，大元第一美人。明艳不可方物，艳丽非凡，性格精灵俊秀，直率豪爽，对张大教主一往情深，为爱放弃所有与其共赴冰焰岛厮守终身。", },
          { jh: "冰火岛", loc: "", name: "谢狮王", way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;ne;n", desc: "他就是明教的四大护法之一的金毛狮王。他身材魁伟异常，满头金发散披肩头。但双目已瞎。在你面前一站，威风凛凛，真如天神一般。", },
          { jh: "冰火岛", loc: "", name: "白熊", way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;w;n;w;ne", desc: "全身长满白色长毛，双爪极度锋利，身材颇为剽悍，十分嗜血狂暴。是冰焰岛上最强的猎食者。", },
          { jh: "冰火岛", loc: "", name: "黑衣杀手", way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;w;n;w;nw", desc: "穿著极其神秘的黑衣人，黑色的面巾遮住了他的面容。武功十分高强。", },
          { jh: "冰火岛", loc: "冰火裂谷", name: "杀手头目", way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;w;n;w;nw;sw;se;s;sw;sw;se", desc: "颇为精明能干。闪烁的双眼散发毋容置疑的威望。乃是这群不明来历黑衣人的统领头目。", },
          { jh: "冰火岛", loc: "冰火裂谷", name: "黑衣杀手", way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;w;n;w;nw;sw;se;s;sw;sw;se", desc: "穿著极其神秘的黑衣人，黑色的面巾遮住了他的面容。武功十分高强。", },
          { jh: "冰火岛", loc: "冰火裂谷", name: "元真和尚", way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;w;n;w;nw;sw;se;s;sw;sw;se;se", desc: "此人武功极高，极富智谋，心狠手辣杀人如麻。因与前明教教主私怨而恼羞成怒，出家剃度意图挑拨江湖各大派，以达歼灭明教颠覆武林之目的。与谢狮王也有过一段不为人知的恩怨情仇。", },
          { jh: "冰火岛", loc: "", name: "雪狼", way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;s;se;w;nw", desc: "毛色净白，眼瞳红如鲜血，牙齿十分锐利，身形巨大强壮，速度极快。天性狡猾，通常都是群体出动。", },
          { jh: "冰火岛", loc: "", name: "殷夫人", way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;s;se;w;nw;s;s;s;s;s;s;e", desc: "此女容貌娇艳无伦，虽已过中年但风采依稀不减。为人任性长情，智计百出，武功十分了得。立场亦正亦邪。乃张五侠结发妻子，张大教主亲生母亲。", },
          { jh: "冰火岛", loc: "", name: "张五侠", way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;s;se;w;nw;s;s;s;s;s;s;w;w;n;e;n;w;w;s;s", desc: "在武当七侠之中排行第五，人称张五侠。虽人已过中年，但脸上依然俊秀。为人彬彬有礼，谦和中又遮不住激情如火的风发意气。可谓文武双全，乃现任张大教主的亲生父亲。", },
          { jh: "冰火岛", loc: "", name: "火麒麟", way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;n;nw", desc: "磷甲刀枪不入，四爪孔武有力速度奇快。浑身能散发极高温的火焰，喜热厌冷，嗜好吞噬火山晶元。现居于冰焰岛火山一侧。", },
          { jh: "冰火岛", loc: "", name: "麒麟幼崽", way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;n;nw", desc: "火麒麟的爱子，生人勿近。" },
          { jh: "侠客岛", loc: "", name: "丁三", way: "", desc: "一个鹤发童颜的老头，穿得荒诞不经，但看似武功十分了得。" },
          { jh: "侠客岛", loc: "", name: "侠客岛厮仆", way: "jh 36;yell", desc: "他是岛上的一个仆人，手底下似乎很有两下子。" },
          { jh: "侠客岛", loc: "", name: "黄衣船夫", way: "jh 36;yell", desc: "这是个身著黄衣的三十几岁汉子，手持木桨，面无表情。" },
          { jh: "侠客岛", loc: "", name: "张三", way: "jh 36;yell;e", desc: "乃江湖传闻中赏善罚恶使者之一，其精明能干，为人大公无私。但平时大大咧咧表情十分滑稽。", },
          { jh: "侠客岛", loc: "", name: "云游高僧", way: "jh 36;yell;e;ne;ne", desc: "一位云游四方的行者，风霜满面，行色匆匆，似乎正在办一件急事。", },
          { jh: "侠客岛", loc: "", name: "马六", way: "jh 36;yell;e;ne;ne;ne;e;e", desc: "他身材魁梧，圆脸大耳，笑嘻嘻地和蔼可亲。" },
          { jh: "侠客岛", loc: "", name: "侠客岛弟子", way: "jh 36;yell;e;ne;ne;ne;e;e", desc: "这是身材魁梧的壮汉，膀大腰圆，是岛主从中原招募来的。力气十分之大。", },
          { jh: "侠客岛", loc: "", name: "龙岛主", way: "jh 36;yell;e;ne;ne;ne;e;e;e", desc: "就是天下闻之色变的侠客岛岛主，号称“不死神龙”。他须眉全白，脸色红润，有如孩童。看不出他的实际年纪。", },
          { jh: "侠客岛", loc: "", name: "童子", way: "jh 36;yell;e;ne;ne;ne;e;e;e", desc: "这是一个十五六岁的少年，眉清目秀，聪明伶俐，深得岛主喜爱。" },
          { jh: "侠客岛", loc: "", name: "侍者", way: "jh 36;yell;e;ne;ne;ne;e;e;e;e", desc: "这是个身著黄衣的三十几岁汉子，垂手站立，面无表情。" },
          { jh: "侠客岛", loc: "", name: "史婆婆", way: "jh 36;yell;e;ne;ne;ne;e;e;e;e;e", desc: "她是雪山派白掌门的妻子，虽说现在人已显得苍老，但几十年前提起“江湖一枝花”史小妹来，武林中却是无人不知。", },
          { jh: "侠客岛", loc: "", name: "谢居士", way: "jh 36;yell;e;ne;ne;ne;e;e;e;e;e;e;n;e;e;ne", desc: "他就是摩天崖的主人。是个亦正亦邪的高手，但信守承诺，年轻时好武成兴，无比骄傲，自认为天下第一。", },
          { jh: "侠客岛", loc: "", name: "矮老者", way: "jh 36;yell;e;ne;ne;ne;e;e;e;e;e;e;n;n;n;e;ne;nw", desc: "此老身躯矮小，但气度非凡，令人不敢小窥。他与其师弟高老者闭关已久，江湖上鲜闻其名。武功之高，却令人震惊。", },
          { jh: "侠客岛", loc: "", name: "高老者", way: "jh 36;yell;e;ne;ne;ne;e;e;e;e;e;e;n;n;n;e;ne;nw;w", desc: "他身形高大硕状，满面红光。举止滑稽，带点傻气，武功却是极高。他因不常在江湖上露面，是以并非太多人知闻其名。", },
          { jh: "侠客岛", loc: "", name: "朱熹", way: "jh 36;yell;e;ne;ne;ne;e;e;e;e;e;e;n;n;n;w;w", desc: "他是个精通诗理的学者，原本是被逼而来到侠客岛，但学了武功后死心塌地的留了下来。", },
          { jh: "侠客岛", loc: "", name: "木岛主", way: "jh 36;yell;e;ne;ne;ne;e;e;e;fly;e", desc: "他就是天下闻之色变的侠客岛岛主，号称“叶上秋露”。只见他长须稀稀落落，兀自黑多白少，但一张脸却满是皱纹。看不出他的实际年纪。", },
          { jh: "侠客岛", loc: "", name: "蓝衣弟子", way: "jh 36;yell;e;ne;ne;ne;e;e;n", desc: "她是木岛主的女弟子，专管传授岛上弟子的基本功夫。" },
          { jh: "侠客岛", loc: "", name: "李四", way: "jh 36;yell;e;ne;ne;ne;e;e;n", desc: "身形甚高，但十分瘦削，留一撇鼠尾须，脸色阴沉。就是江湖传闻中赏善罚恶使者之一，其精明能干，但总是阴沉著脸。", },
          { jh: "侠客岛", loc: "", name: "石公子", way: "jh 36;yell;e;ne;ne;ne;e;n", desc: "这是一个年轻公子，面若中秋之月，色如春晓之花，鬓若刀裁，眉如墨画，鼻如悬胆，情若秋波，虽怒而时笑，即视而有情。", },
          { jh: "侠客岛", loc: "", name: "书生", way: "jh 36;yell;e;ne;ne;ne;e;n", desc: "他看过去像个落泊的书生，呆头呆脑的一付书呆子的样子。但只要你留心，你就发现他两眼深沉，而且腰挂一把长剑。", },
          { jh: "侠客岛", loc: "", name: "丁当", way: "jh 36;yell;e;ne;ne;ne;e;n;n", desc: "一个十七八岁的少女，身穿淡绿衫子，一张瓜子脸，秀丽美艳。" },
          { jh: "侠客岛", loc: "", name: "白掌门", way: "jh 36;yell;e;ne;ne;ne;e;n;w", desc: "他就是雪山剑派的掌门人，习武成性，自认为天下武功第一，精明能干，嫉恶如仇，性如烈火。", },
          { jh: "侠客岛", loc: "", name: "白衣弟子", way: "jh 36;yell;e;ne;ne;ne;e;s", desc: "乃侠客岛龙岛主门下的一个弟子。身上穿著洗得发白的锦衣，头上带著秀才帽，一脸的书呆子气，怎么看也不象是个武林中人。", },
          { jh: "侠客岛", loc: "", name: "王五", way: "jh 36;yell;e;ne;ne;ne;e;s", desc: "他大约二十多岁，精明能干，笑嘻嘻的和蔼可亲。" },
          { jh: "侠客岛", loc: "", name: "店小二", way: "jh 36;yell;e;ne;ne;ne;e;s;e", desc: "位店小二正笑咪咪地忙著，还不时拿起挂在脖子上的抹布擦脸。" },
          { jh: "侠客岛", loc: "", name: "侠客岛闲人", way: "jh 36;yell;e;ne;ne;ne;e;s;w", desc: "他是岛上一个游手好闲的人。不怀好意。" },
          { jh: "侠客岛", loc: "", name: "小猴子", way: "jh 36;yell;e;se;e", desc: "一只机灵的猴子，眼巴巴的看著你，大概想讨些吃的。" },
          { jh: "侠客岛", loc: "", name: "樵夫", way: "jh 36;yell;e;se;e;e", desc: "一个一辈子以砍材为生的老樵夫，由于饱受风霜，显出与年龄不相称的衰老。" },
          { jh: "侠客岛", loc: "", name: "医者", way: "jh 36;yell;e;se;e;e;e;e", desc: "一位白发银须的老者。据说当年曾经是江湖上一位著名的神医。'但自从来到侠客岛上后，隐姓埋名，至今谁也不知道他真名是甚么了。'他看起来懒洋洋的，你要是想请他疗伤的话恐怕不那么容易。", },
          { jh: "侠客岛", loc: "", name: "石帮主", way: "jh 36;yell;e;se;e;e;n;e;s", desc: "为人忠厚老实，性情温和，天赋极高，记性极好。穿著一身破烂的衣服，却也挡不住他一身的英气。似乎身怀绝世武功。", },
          { jh: "侠客岛", loc: "", name: "渔家少女", way: "jh 36;yell;e;se;e;e;s;s;s;e", desc: "这是个渔家少女，虽然只有十二、三岁，但身材已经发育得很好了，眼睛水汪汪很是诱人。", },
          { jh: "侠客岛", loc: "", name: "阅书老者", way: "jh 36;yell;e;se;e;e;s;s;s;e;ne", desc: "一个精神矍烁的老者，他正手持书籍，稳站地上，很有姜太公之风。", },
          { jh: "侠客岛", loc: "", name: "青年海盗", way: "jh 36;yell;e;se;e;e;s;s;s;e;ne;e;e;n", desc: "一个青年海盗，颇为精壮，，眼角中展露出了凶相。", },
          { jh: "侠客岛", loc: "", name: "老海盗", way: "jh 36;yell;e;se;e;e;s;s;s;e;ne;e;e;n;e;n;e;n", desc: "一个年老的海盗，虽然胡子一大把了，但还是凶巴巴的。", },
          { jh: "侠客岛", loc: "", name: "渔夫", way: "jh 36;yell;e;se;e;e;s;s;s;s", desc: "看过去像个平平凡凡的渔夫，脸和赤裸的臂膀都晒得黑黑的。但只要你留心，你就发现他两眼深沉，而且腰挂一把长剑。", },
          { jh: "侠客岛", loc: "", name: "渔家男孩", way: "jh 36;yell;e;se;e;e;s;s;s;w", desc: "这是个渔家少年，大概由于长期在室外的缘故，皮肤已晒得黝黑，人也长得很粗壮了。", },
          { jh: "侠客岛", loc: "", name: "野猪", way: "jh 36;yell;e;se;e;e;w", desc: "这是一只凶猛的野猪，长得极为粗壮，嘴里还不断发出可怕的哄声。" },
          { jh: "绝情谷", loc: "", name: "冰蛇", way: "jh 37;n;e;e;nw;nw;w;n;nw;n;n;ne;n;nw;sw;event_1_12492702", desc: "身体犹如冰块透明般的蛇。" },
          { jh: "绝情谷", loc: "", name: "千年寒蛇", way: "jh 37;n;e;e;nw;nw;w;n;nw;n;n;ne;n;nw;sw;event_1_12492702", desc: "一条通体雪白的大蛇。" },
          { jh: "绝情谷", loc: "", name: "土匪", way: "jh 37;n", desc: "在山谷下烧伤抢掠的恶人。" },
          { jh: "绝情谷", loc: "", name: "村民", way: "jh 37;n;e;e", desc: "世代生活于此的人，每日靠著进山打打猎生活。" },
          { jh: "绝情谷", loc: "", name: "雪若云", way: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;ne;ne;event_1_16813927", desc: "身著黑色纱裙，面容精致秀美，神色冷若冰雪，嘴角却隐隐透出一股温暖的笑意。现在似是在被仇家围攻，已是身受重伤。", },
          { jh: "绝情谷", loc: "", name: "养鳄人", way: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;ne;ne;se", desc: "饲养鳄鱼的年轻汉子。" },
          { jh: "绝情谷", loc: "", name: "鳄鱼", way: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;ne;ne;se", desc: "悠闲的在鳄鱼潭边休息，看似人畜无害，但是无人敢靠近它们。", },
          { jh: "绝情谷", loc: "", name: "囚犯", way: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;ne;ne;se;s;s;s", desc: "被关押在暗无天日的地牢内，落魄的样子无法让你联想到他们曾是江湖好汉。", },
          { jh: "绝情谷", loc: "", name: "地牢看守", way: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;ne;ne;se;s;s;s;w", desc: "看守著地牢的武者，一脸严肃，不知道在想些什么。" },
          { jh: "绝情谷", loc: "", name: "天竺大师", way: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w", desc: "在绝情谷中研究怎么破解情花之毒的医学圣手。", },
          { jh: "绝情谷", loc: "", name: "养花女", way: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n", desc: "照顾著绝情谷的花花草草的少女。" },
          { jh: "绝情谷", loc: "", name: "侍女", way: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n", desc: "好色的绝情谷谷主从来劫来的少女。" },
          { jh: "绝情谷", loc: "", name: "拓跋嗣", way: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;ne", desc: "鲜卑皇族后裔，自幼就表现出过人的军事天赋，十七岁时就远赴河套抗击柔然骑兵，迫使柔然不敢入侵。", },
          { jh: "绝情谷", loc: "", name: "没藏羽无", way: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;ne;e", desc: "多权谋，善用计，所率西夏堂刺客素以神鬼莫测著称，让对头心惊胆战。", },
          { jh: "绝情谷", loc: "", name: "野利仁嵘", way: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;ne;e;ne", desc: "西夏皇族后裔，黑道威名赫赫的杀手头领，决策果断，部署周密，讲究战法，神出鬼没。", },
          { jh: "绝情谷", loc: "", name: "嵬名元昊", way: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;ne;e;ne;se", desc: "一副圆圆的面孔，炯炯的目光下，鹰勾鼻子耸起，刚毅中带著几分凛然不可侵犯的神态。中等身材，却显得魁梧雄壮，英气逼人。平素喜穿白色长袖衣，头戴黑色冠帽，身佩弓矢。此人城府心机深不可测，凭借一身最惊世骇俗的的锤法位居西夏堂最处尊居显之位，力图在天波杨门与燕云世家三方互相牵制各自鼎立态势下，为本门谋求最大之利益。", },
          { jh: "绝情谷", loc: "", name: "谷主夫人", way: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;nw", desc: "绝情谷上一任谷主的女儿，被现任谷主所伤，终日只得坐在轮椅之上。", },
          { jh: "绝情谷", loc: "", name: "采花贼", way: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;nw;n;ne;e;ne;e;n", desc: "声名狼藉的采花贼，一路潜逃来到了绝情谷。", },
          { jh: "绝情谷", loc: "", name: "门卫", way: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;nw;n;nw", desc: "这是个年富力强的卫兵，样子十分威严。", },
          { jh: "绝情谷", loc: "", name: "谷主分身", way: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;nw;n;nw;n;nw", desc: "好色、阴险狡诈的独眼龙。" },
          { jh: "绝情谷", loc: "", name: "绝情谷谷主", way: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;nw;n;nw;n;nw", desc: "好色、阴险狡诈的独眼龙。", },
          { jh: "绝情谷", loc: "", name: "白衣女子", way: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;nw;ne;n;ne", desc: "一个宛如仙女般的白衣女子。" },
          { jh: "绝情谷", loc: "", name: "野兔", way: "jh 37;n;e;e;nw;nw;w;n;nw;n;n", desc: "正在吃草的野兔。" },
          { jh: "绝情谷", loc: "", name: "绝情谷弟子", way: "jh 37;n;e;e;nw;nw;w;n;nw;n;n;ne;n;nw", desc: "年纪不大，却心狠手辣，一直守候在绝情山庄。", },
          { jh: "碧海山庄", loc: "碧海山庄大门", name: "护卫", way: "jh 38;n;n;n;n;n;n;n", desc: "他是一个身材高大的中年男子，看起来凶神恶煞，招惹不得。", },
          { jh: "碧海山庄", loc: "前院", name: "家丁", way: "jh 38;n;n;n;n;n;n;n;n", desc: "碧海山庄的家丁。" },
          { jh: "碧海山庄", loc: "", name: "耶律楚歌", way: "jh 38;n;n;n;n;n;n;n;n;n", desc: "" },
          { jh: "碧海山庄", loc: "碧海山庄大厅、炼丹室", name: "护卫总管", way: "jh 38;n;n;n;n;n;n;n;n;n", desc: "身材瘦小，可是一身武艺超群，碧海山庄之内能胜他者不超过五人。", },
          { jh: "碧海山庄", loc: "碧海山庄大厅", name: "耶律楚哥", way: "jh 38;n;n;n;n;n;n;n;n;n", desc: "出身契丹皇族，为人多智谋，善料敌先机，骑术了得，为大辽立下赫赫卓著战功。故而被奉为燕云世家之主。与天波杨门缠斗一生，至死方休。", },
          { jh: "碧海山庄", loc: "厨房", name: "易牙传人", way: "jh 38;n;n;n;n;n;n;n;n;n;e;se;s", desc: "一身厨艺已经傲世天下，煎、熬、燔、炙，无所不精。", },
          { jh: "碧海山庄", loc: "柴房", name: "砍柴人", way: "jh 38;n;n;n;n;n;n;n;n;n;e;se;s;e", desc: "碧海山庄所需木柴都由他来供给。" },
          { jh: "碧海山庄", loc: "客房", name: "独孤雄", way: "jh 38;n;n;n;n;n;n;n;n;n;n;n;e;e;se;se;e;n", desc: "一个风程仆仆的侠客。" },
          { jh: "碧海山庄", loc: "宅院", name: "王子轩", way: "jh 38;n;n;n;n;n;n;n;n;n;n;n;e;e;se;se;e;n;n;n", desc: "碧海山庄少庄主，整日沉迷于一些稀奇古怪的玩意。", },
          { jh: "碧海山庄", loc: "炼丹室", name: "王昕", way: "jh 38;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n", desc: "年过半百的中年男子，长相平庸，很难让人把他与碧海山庄庄主这个身份联想起来。", },
          { jh: "碧海山庄", loc: "碧海亭", name: "侍女", way: "jh 38;n;n;n;n;n;n;n;w;w;nw", desc: "打理碧海山庄上上下下的杂物。" },
          { jh: "碧海山庄", loc: "小桥", name: "尹秋水", way: "jh 38;n;n;n;n;n;n;n;w;w;nw;w", desc: "她肌肤胜雪，双目犹似一泓清水，顾盼之际，自有一番清雅高华的气质，让人为之所摄、自惭形秽、不敢亵渎。但那冷傲灵动中颇有勾魂摄魄之态，又让人不能不魂牵蒙绕。", },
          { jh: "碧海山庄", loc: "花园", name: "养花女", way: "jh 38;n;n;n;n;n;n;n;w;w;nw;w;w;n;n", desc: "一位养花少女，她每天就是照顾这数也数不清的花。", },
          { jh: "碧海山庄", loc: "桃花源", name: "隐士", way: "jh 38;n;n;n;n;w", desc: "厌倦了这世间的纷纷扰扰，隐居于此的世外高人。" },
          { jh: "碧海山庄", loc: "溪流", name: "野兔", way: "jh 38;n;n;n;n;w;w", desc: "正在吃草的兔子。" },
          { jh: "碧海山庄", loc: "龙王殿", name: "僧人", way: "jh 38;n;n;w", desc: "龙王殿僧人，负责每年祭祀龙王。" },
          { jh: "碧海山庄", loc: "龙王殿", name: "法明大师", way: "jh 38;n;n;w", desc: "管理龙王殿的高僧，龙王殿大大小小的事物都是他在负责。" },
          { jh: "天山", loc: "官道", name: "周教头", way: "jh 39;ne", desc: "大内军教头，外表朴实无华，实则锋芒内敛。有著一腔江湖豪情。" },
          { jh: "天山", loc: "", name: "辛怪人", way: "jh 39;ne;e;n;ne", desc: "性情古怪，不好交往，喜用新招，每每和对方对招之际，学会对方的招式，然后拿来对付对方，令到对方啼笑皆非。。是个狼养大的孩子，他很能打，打起来不要命，一个性情古怪的人，有著一段谜一样的过去。", },
          { jh: "天山", loc: "", name: "穆小哥", way: "jh 39;ne;e;n;ne;ne;n", desc: "一个只有十八九岁的小伙子，乐观豁达，无处世经验，对情感也茫然无措，擅长进攻，变化奇快。", },
          { jh: "天山", loc: "", name: "武壮士", way: "jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791;place?失足岩;nw;n", desc: "他身穿一件藏蓝色古香缎夹袍，腰间绑著一根青色蟒纹带，一头暗红色的发丝，有著一双深不可测眼睛，体型挺秀，当真是风度翩翩飒爽英姿。", },
          { jh: "天山", loc: "", name: "程首领", way: "jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791;place?失足岩;nw;n;ne;nw", desc: "她是「灵柩宫」九天九部中钧天部的副首领。", },
          { jh: "天山", loc: "", name: "菊剑", way: "jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791;place?失足岩;nw;n;ne;nw;nw;n", desc: "这是个容貌姣好的女子，瓜子脸蛋，眼如点漆，清秀绝俗。", },
          { jh: "天山", loc: "", name: "兰剑", way: "jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791;place?失足岩;nw;n;ne;nw;nw;w;s", desc: "这是个容貌姣好的女子，瓜子脸蛋。", },
          { jh: "天山", loc: "", name: "符针神", way: "jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791;place?失足岩;nw;n;ne;nw;nw;w;n;n", desc: "她是「灵柩宫」九天九部中阳天部的首领她号称「针神」", },
          { jh: "天山", loc: "", name: "梅剑", way: "jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791;place?失足岩;nw;n;ne;nw;nw;w;n;n;e", desc: "她有著白皙的面容，犹如梅花般的亲丽脱俗，堆云砌黑的浓发，整个人显得妍姿俏丽惠质兰心。", },
          { jh: "天山", loc: "", name: "护关弟子", way: "jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791;place?失足岩;nw;n;ne;nw;nw;w;n;n;n;e;e;s", desc: "这是掌门最忠心的护卫，武功高深莫测。正用警惕的眼光打量著你。", },
          { jh: "天山", loc: "", name: "余婆", way: "jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791;place?失足岩;nw;n;ne;nw;nw;w;n;n;n;e;nw", desc: "她是「灵柩宫」九天九部中昊天部的首领。她跟随童姥多年，出生入死，饱经风霜。", },
          { jh: "天山", loc: "", name: "九翼", way: "jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791;place?失足岩;nw;n;ne;nw;nw;w;n;n;n;e;nw;w;ne", desc: "他是西夏一品堂礼聘的高手，身材高瘦，脸上总是阴沉沉的他轻功极高，擅使雷公挡，凭一手雷公挡功夫，成为江湖的一流高手。", },
          { jh: "天山", loc: "", name: "天山死士", way: "jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791;place?失足岩;nw;n;ne;nw;nw;w;n;n;n;e;nw;w;nw", desc: "是掌门从武林掳掠天资聪明的小孩至天山培养的弟子，自小就相互厮杀，脱颖而出者便会成为天山死士，只听命于掌门一人，倘若有好事者在天山大动干戈，他将毫不犹豫的将对方动武，至死方休。", },
          { jh: "天山", loc: "", name: "天山大剑师", way: "jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791;place?失足岩;nw;n;ne;nw;nw;w;n;n;n;e;nw;w;nw", desc: "弃尘世而深居天山颠峰，数十年成铸剑宗师，铸成七把宝剑。此七把剑代表晦明大师在天山上经过的七个不同剑的境界。", },
          { jh: "天山", loc: "", name: "竹剑", way: "jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791;place?失足岩;nw;n;ne;nw;nw;w;n;n;w", desc: "这是个容貌姣好的女子，瓜子脸蛋，眼如点漆，清秀绝俗。你总觉得在哪见过她。", },
          { jh: "天山", loc: "", name: "石嫂", way: "jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791;place?失足岩;nw;n;ne;nw;nw;w;w", desc: "她是[灵柩宫]的厨师。" },
          { jh: "天山", loc: "", name: "楚大师兄", way: "jh 39;ne;e;n;ne;ne;n;ne;nw;ne;nw;event_1_17801939;place?星星峡", desc: "有“塞外第一剑客”之称、“游龙一出，万剑臣服”之勇。性傲、极度自信、重情重义、儿女情长，具有英雄气盖，但容易感情用事，做事走极端。乃天山派大师兄。", },
          { jh: "天山", loc: "", name: "傅奇士", way: "jh 39;ne;e;n;ne;ne;n;ne;nw;ne;nw;event_1_17801939;place?星星峡;ne;ne;nw", desc: "一个三绺长须、面色红润、儒冠儒服的老人，不但医术精妙，天下无匹，而且长于武功，在剑法上有精深造诣。除此之外，他还是书画名家。", },
          { jh: "天山", loc: "", name: "杨英雄", way: "jh 39;ne;e;n;ne;ne;n;ne;nw;ne;nw;event_1_17801939;place?星星峡;ne;ne;nw;nw", desc: "一个有情有义的好男儿，他武功高强大义凛然，乃天山派二师兄。", },
          { jh: "天山", loc: "", name: "胡大侠", way: "jh 39;ne;e;n;ne;ne;n;ne;nw;ne;nw;event_1_17801939;place?星星峡;ne;ne;nw;nw;nw;w", desc: "因其武功高强神出鬼没。在江湖上人送外号「雪山飞狐」。他身穿一件白色长衫，腰间别著一把看起来很旧的刀。他满腮虬髯，根根如铁，一头浓发，却不结辫。", },
          { jh: "天山", loc: "", name: "波斯商人", way: "jh 39;ne;e;n;ne;ne;se", desc: "这是一位来自波斯的商人，经商手段十分高明。" },
          { jh: "天山", loc: "", name: "铁好汉", way: "jh 39;ne;e;n;ne;ne;se;e", desc: "邱莫言重金雇佣的绿林好汉，贺兰山草寇。缺乏主见，使一柄没有太多特色的单刀，虽是为财而来，却也不失为江湖义士。", },
          { jh: "天山", loc: "", name: "贺好汉", way: "jh 39;ne;e;n;ne;ne;se;e", desc: "乃行走江湖的绿林好汉，脾气极为暴躁。" },
          { jh: "天山", loc: "", name: "韩马夫", way: "jh 39;ne;e;n;ne;ne;se;e;e", desc: "一位憨直的汉子，面容普通，但本性古道热肠，有侠义本色。" },
          { jh: "天山", loc: "", name: "刁屠夫", way: "jh 39;ne;e;n;ne;ne;se;e;n", desc: "乃龙门客栈屠夫，此人凭借常年累月的剔骨切肉练就一身好刀法。" },
          { jh: "天山", loc: "", name: "金老板", way: "jh 39;ne;e;n;ne;ne;se;e;n", desc: "龙门客栈老板娘，为人八面玲珑。左手使镖，右手使刀，体态婀娜多姿，妩媚泼辣。", },
          { jh: "天山", loc: "", name: "蒙面女郎", way: "jh 39;ne;e;n;ne;ne;se;e;s;e;se", desc: "这是个身材娇好的女郎，轻纱遮面，一双秀目中透出一丝杀气。" },
          { jh: "天山", loc: "", name: "牧民", way: "jh 39;ne;e;n;nw", desc: "这是一位边塞牧民，正在驱赶羊群。" },
          { jh: "天山", loc: "", name: "塞外胡兵", way: "jh 39;ne;e;n;nw;nw;w;s;s", desc: "一副凶神恶煞的长相，来自塞外。以掳掠关外牧民卫生。" },
          { jh: "天山", loc: "", name: "胡兵头领", way: "jh 39;ne;e;n;nw;nw;w;s;s;sw;n;nw;e;sw;w", desc: "手持一根狼牙棒，揹负一口长弓。身材高大，面目可憎。", },
          { jh: "天山", loc: "", name: "乌刀客", way: "jh 39;ne;e;n;nw;nw;w;s;s;sw;n;nw;e;sw;w;s;w", desc: "他就是名动江湖的乌老大，昔日曾谋反童姥未遂而被囚禁于此。", },
          { jh: "天山", loc: "", name: "宝箱", way: "jh 39;ne;e;n;nw;nw;w;s;s;sw;n;nw;e;sw;w;s;w;n;w;event_1_69872740", desc: "" },
          { jh: "苗疆", loc: "", name: "温青", way: "jh 40;s;s;s;s", desc: "此人俊秀异常，个性温和有风度，喜好游历山水是一位姿态优雅的翩翩君子。" },
          { jh: "苗疆", loc: "", name: "田嫂", way: "jh 40;s;s;s;s;e;s;se", desc: "一个白皙丰满的中年妇人．" },
          { jh: "苗疆", loc: "", name: "金背蜈蚣", way: "jh 40;s;s;s;s;e;s;se;sw;s;s", desc: "一条三尺多长，张牙舞爪的毒蜈蚣。" },
          { jh: "苗疆", loc: "", name: "樵夫", way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e", desc: "一位面色黑红，悠然自得的樵夫．" },
          { jh: "苗疆", loc: "", name: "三足金蟾", way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw", desc: "一只拳头大小通身金黄的小蟾蜍，据说只有月宫才有。" },
          { jh: "苗疆", loc: "", name: "莽牯朱蛤", way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?澜沧江南岸;se;s", desc: "一只拳头大小，叫声洪亮的毒蛤蟆。", },
          { jh: "苗疆", loc: "", name: "食尸蝎", way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s", desc: "一条三尺来长，全身铁甲的毒蝎子。", },
          { jh: "苗疆", loc: "", name: "蛇", way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e", desc: "一条七尺多长，手腕般粗细的毒蛇。十分骇人。", },
          { jh: "苗疆", loc: "", name: "五毒教徒", way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw", desc: "一个五毒的基层教徒，看来刚入教不久。", },
          { jh: "苗疆", loc: "", name: "沙护法", way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n", desc: "他就是五毒教的护法弟子，身材魁梧，方面大耳。在教中转管招募教众，教授弟子们的入门功夫。", },
          { jh: "苗疆", loc: "", name: "五毒弟子", way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n", desc: "五毒教一个身体强壮的苗族青年，看来武功已小由所成。", },
          { jh: "苗疆", loc: "", name: "毒郎中", way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;e", desc: "一位身穿道服，干瘪黑瘦的中年苗人．", },
          { jh: "苗疆", loc: "", name: "毒女", way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;n", desc: "年纪约20岁，冷艳绝伦，背景离奇，混身是毒，外号毒女曼陀罗，涉嫌下毒命案，其实她是个十分善良的女子。与铁捕快有一段缠绵悱恻的爱情，花耐寒而艳丽。", },
          { jh: "苗疆", loc: "", name: "白髯老者", way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;w;w", desc: "一个须发皆白的老者，精神矍铄，满面红光。", },
          { jh: "苗疆", loc: "", name: "潘左护法", way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;n;n", desc: "他就是五毒教的左护法，人称笑面阎罗。别看他一脸笑眯眯的，但是常常杀人于弹指之间，一手五毒钩法也已达到登峰造极的境界。", },
          { jh: "苗疆", loc: "", name: "大祭司", way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;n;n;e", desc: "乃苗疆最为德高望重的祭师。但凡祭祀之事皆是由其一手主持。", },
          { jh: "苗疆", loc: "", name: "岑秀士", way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;n;n;nw", desc: "他就是五毒教的右护法，人称五毒秀士。经常装扮成一个白衣秀士的模样，没事总爱附庸风雅。", },
          { jh: "苗疆", loc: "", name: "何教主", way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;n;n;nw;ne;ne;nw;ne;e", desc: "你对面的是一个一身粉红纱裙，笑靥如花的少女。她长得肌肤雪白，眉目如画，赤著一双白嫩的秀足，手脚上都戴著闪闪的金镯。谁能想到她就是五毒教的教主，武林人士提起她无不胆颤心惊。", },
          { jh: "苗疆", loc: "", name: "五毒护法", way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;n;n;nw;ne;ne;nw;ne;e", desc: "乃帮主的贴身护法，为人忠心耿耿，武艺深不可测。帮主有难时，会豁尽全力以护佑她人身安全。", },
          { jh: "苗疆", loc: "", name: "齐长老", way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;n;n;nw;ne;ne;se;se", desc: "他就是五毒教的长老，人称锦衣毒丐。乃是教主的同门师兄，在教中一向飞扬跋扈，大权独揽。他长的身材魁梧，面目狰狞，身穿一件五彩锦衣，太阳穴高高坟起。", },
          { jh: "苗疆", loc: "", name: "白鬓老者", way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;w", desc: "", },
          { jh: "苗疆", loc: "", name: "何长老", way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;w;sw", desc: "她就是五毒教的长老，教主的姑姑。随然是教主的长辈，但功夫却是一块跟上代教主学的。据说她曾经被立为教主继承人，但后来犯下大错，所以被罚到此处面壁思过，以赎前罪。她穿著一身破旧的衣衫，满脸疤痕，长得骨瘦如柴，双目中满是怨毒之色。", },
          { jh: "苗疆", loc: "", name: "阴山天蜈", way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?澜沧江南岸;se;s;s;s", desc: "一条三寸多长，长有一双翅膀剧毒蜈蚣。", },
          { jh: "苗疆", loc: "", name: "蓝姑娘", way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?澜沧峡;sw", desc: "此女千娇百媚，风韵甚佳，声音娇柔宛转，荡人心魄。年龄约莫二十三四岁。喜欢养毒蛇，能炼制传说中苗族人的蛊毒，还善于配置各种剧毒。喜欢吹洞箫，口哨也很好。", },
          { jh: "苗疆", loc: "", name: "吸血蜘蛛", way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;s;sw", desc: "一只拳头大小，全身绿毛的毒蜘蛛。" },
          { jh: "苗疆", loc: "", name: "人面蜘蛛", way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;s;sw", desc: "一只面盆大小，长著人样脑袋的大蜘蛛。" },
          { jh: "苗疆", loc: "", name: "苗村长", way: "jh 40;s;s;s;s;w;w;w", desc: "这是本村的村长，凡是村里各家各户，老老少少的事他没有不知道的。" },
          { jh: "苗疆", loc: "", name: "苗家小娃", way: "jh 40;s;s;s;s;w;w;w;n", desc: "此娃肥肥胖胖，走路一晃一晃，甚是可爱。" },
          { jh: "苗疆", loc: "", name: "苗族少女", way: "jh 40;s;s;s;s;w;w;w;w", desc: "一个身穿苗族服饰的妙龄少女。" },
          { jh: "苗疆", loc: "", name: "苗族少年", way: "jh 40;s;s;s;s;w;w;w;w", desc: "一个身穿苗族服饰的英俊少年。" },
          { jh: "白帝城", loc: "", name: "近身侍卫", way: "jh 41;se;e;e;nw;nw;n;n;e;ne;e", desc: "公孙将军的近身侍卫，手执长剑。" },
          { jh: "白帝城", loc: "", name: "白衣弟子", way: "jh 41;se;e;e", desc: "身穿白衣的青年弟子，似乎身手不凡，傲气十足。" },
          { jh: "白帝城", loc: "", name: "镇长", way: "jh 41;se;e;e;ne;ne;se;e;e;ne", desc: "白发苍苍的镇长，看起来还挺精神的。" },
          { jh: "白帝城", loc: "", name: "李巡", way: "jh 41;se;e;e;ne;ne;se;e;e;s;w", desc: "白发苍苍的老头，貌似是李峰的父亲。" },
          { jh: "白帝城", loc: "", name: "守门士兵", way: "jh 41;se;e;e;nw;nw", desc: "身穿白帝城军服的士兵。" },
          { jh: "白帝城", loc: "", name: "公孙将军", way: "jh 41;se;e;e;nw;nw;n;n;e;ne;e", desc: "公孙氏的一位将军，深受白帝信任，被派到紫阳城担任守城要务。", },
          { jh: "白帝城", loc: "", name: "贴身侍卫", way: "jh 41;se;e;e;nw;nw;n;n;e;ne;e", desc: "" },
          { jh: "白帝城", loc: "", name: "粮官", way: "jh 41;se;e;e;nw;nw;n;n;e;ne;n;nw;n", desc: "负责管理紫阳城的粮仓的官员。" },
          { jh: "白帝城", loc: "", name: "白衣士兵", way: "jh 41;se;e;e;nw;nw;n;n;w;w", desc: "身穿白衣的士兵，正在街上巡逻。" },
          { jh: "白帝城", loc: "", name: "文将军", way: "jh 41;se;e;e;nw;nw;n;n;w;w;n;n;e", desc: "白帝城公孙氏的外戚，主要在紫阳城替白帝城防御外敌。", },
          { jh: "白帝城", loc: "", name: "白衣少年", way: "jh 41;se;e;e;se;se;se;se", desc: "身穿白帝城统一服饰的少年，长相虽然一般，但神态看起来有点傲气。" },
          { jh: "白帝城", loc: "", name: "李峰", way: "jh 41;se;e;e;se;se;se;se;s;s", desc: "精神奕奕的中年汉子，看起来非常自信。" },
          { jh: "白帝城", loc: "", name: "李白", way: "jh 41;se;e;e;se;se;se;se;s;s;s", desc: "字太白，号青莲居士，又号“谪仙人”，他拿著一壶酒，似乎醉醺醺的样子。" },
          { jh: "白帝城", loc: "", name: "“妖怪”", way: "jh 41;se;e;e;se;se;se;se;s;s;s;e", desc: "一个公孙氏的纨绔弟子，无聊得假扮妖怪到处吓人。" },
          { jh: "白帝城", loc: "", name: "庙祝", way: "jh 41;se;e;e;se;se;se;se;s;s;s;e;e;ne", desc: "一个风程仆仆的侠客。" },
          { jh: "白帝城", loc: "", name: "鹤发老人", way: "jh 41;se;e;e;se;se;se;se;s;s;s;e;e;ne;event_1_7159906;w;nw;n;sw;s;nw;w;w", desc: "一头浓密鹤发，脸上虽然皱纹满布，但整个人看起来仍然生机勃勃，不知道此人活了多久。", },
          { jh: "白帝城", loc: "", name: "练武士兵", way: "jh 41;se;e;e;se;se;se;se;se;se;event_1_57976870;e;e", desc: "正在奋力操练的士兵。" },
          { jh: "白帝城", loc: "", name: "白帝", way: "jh 41;se;e;e;se;se;se;se;se;se;event_1_57976870;n;n;n", desc: "现任白帝，乃公孙氏族长，看起来威严无比，在他身旁能感受到不少压力。", },
          { jh: "白帝城", loc: "", name: "狱卒", way: "jh 41;se;e;e;se;se;se;se;se;se;event_1_57976870;w;w;w", desc: "一个普通的狱卒，似乎在这发呆。" },
          { jh: "墨家机关城", loc: "", name: "索卢参", way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n", desc: "此人乃墨子学生，为人特别诚恳，因此被指派负责接待外宾司仪一职。", },
          { jh: "墨家机关城", loc: "", name: "墨家弟子", way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n", desc: "一声正气禀然的装束，乃天下间心存侠义之人仰慕墨家风采而成为其中一员。", },
          { jh: "墨家机关城", loc: "", name: "高孙子", way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n", desc: "为墨子的学生，口才十分了得。故而负责机关城与外界联系。", },
          { jh: "墨家机关城", loc: "", name: "黑衣人", way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213", desc: "一身蒙面黑衣，鬼鬼祟祟，不知是何人。", },
          { jh: "墨家机关城", loc: "", name: "随巢子", way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818;e;n;e;s;e;n;nw;e;nw;e", desc: "此人乃墨子的学生，沉迷于打造大型机关兽，木鸢便是出自其手。", },
          { jh: "墨家机关城", loc: "", name: "曹公子", way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818;e;n;e;s;e;n;nw;e;nw;n;e", desc: "早年曾质疑墨子之道，后被博大精深的墨家机关术所折服，专职看守天工坞。", },
          { jh: "墨家机关城", loc: "", name: "墨子", way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818;e;n;e;s;e;n;nw;e;nw;n;ne", desc: "墨家的开山祖师，以一人之力开创出机关流派，须眉皆白，已不知其岁数几何，但依然满脸红光，精神精神焕发。", },
          { jh: "墨家机关城", loc: "", name: "耕柱子", way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818;e;n;e;s;e;n;nw;e;nw;n;nw", desc: "为墨子的学生，此人天资异禀，但骄傲自满，因此被墨子惩罚到兼爱祠看管。", },
          { jh: "墨家机关城", loc: "", name: "鲁班", way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818;e;n;e;s;e;n;nw;e;nw;n;w", desc: "机关术的专家，以善于发明各种机关而闻名。木匠出身，在机关术上有著天人一般的精湛技艺。如今不知为何来到墨家机关城。", },
          { jh: "墨家机关城", loc: "", name: "高何", way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818;e;n;e;s;e;n;nw;e;nw;sw", desc: "此人乃墨子学生，面相凶神恶煞，因而负责机关城的安全事务。", },
          { jh: "墨家机关城", loc: "", name: "随师弟", way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818;e;n;e;s;e;n;nw;e;nw;sw;sw", desc: "随巢子的师弟，因犯事被暂时关于此地。", },
          { jh: "墨家机关城", loc: "", name: "大匠师", way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818;e;n;e;s;e;n;nw;e;nw;w;w", desc: "铸艺高超的墨家宗师，主管墨家兵器打造。", },
          { jh: "墨家机关城", loc: "", name: "屈将子", way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818;e;s;e;s;ne;s;sw;nw;s;se;s;e;e", desc: "此人乃资深航海师，墨家麾下的殸龙船便是由其掌控。", },
          { jh: "墨家机关城", loc: "", name: "偷剑贼", way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818;e;s;e;s;ne;s;sw;nw;s;se;s;e;e;e", desc: "身穿黑色夜行衣，举手投足之间尽显高手风范，实力不容小觑。", },
          { jh: "墨家机关城", loc: "", name: "徐夫子", way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818;e;s;e;s;ne;s;sw;nw;s;se;s;sw;s;s", desc: "墨家最优秀的铸匠，毕生致力精研铸剑术，很多名震天下的神兵利刃皆是出自他手。", },
          { jh: "墨家机关城", loc: "", name: "治徒娱", way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;n;w", desc: "为墨子的学生，有过目不忘之才数目分明之能，因此在节用市坐镇负责机关城资源调配。", },
          { jh: "墨家机关城", loc: "", name: "大博士", way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;w", desc: "对天下学术有著极高造诣的宗师，主管墨家学说的传承。", },
          { jh: "墨家机关城", loc: "", name: "高石子", way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;w", desc: "此人乃墨子的学生，深受墨子欣赏。曾经当过高官，现主管墨家日常政务。", },
          { jh: "墨家机关城", loc: "", name: "荆轲", way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;n;n", desc: "墨家绝顶刺客，剑法在墨家中出类拔萃，为人慷慨侠义。备受墨家弟子所敬重。", },
          { jh: "墨家机关城", loc: "", name: "燕丹", way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;n;n", desc: "此人乃前朝皇族，灭国之后投身到墨家麾下四处行侠仗义神秘莫测。", },
          { jh: "墨家机关城", loc: "", name: "庖丁", way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;n;n;n;n;n", desc: "一名憨厚开朗的大胖子，其刀法如神，是个烧遍天下美食的名厨。", },
          { jh: "墨家机关城", loc: "", name: "县子硕", way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;w;w;n;e", desc: "此人乃墨子学生，与高何一样无恶不作，后师从墨子，收心敛性，专职培养墨家人才。", },
          { jh: "墨家机关城", loc: "", name: "魏越", way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;w;w;n;n;e", desc: "为墨子的学生，此人天敏而好学，时常不耻下问，因此被墨子钦点在此顾守书籍。", },
          { jh: "墨家机关城", loc: "", name: "公尚过", way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;w;w;n;n;n;e", desc: "墨子的弟子，深得墨子器重，为人大公无私，现主管墨家的检察维持门内秩序。", },
          { jh: "掩月城", loc: "瀑下石屋（六道探视）", name: "雪若云", way: "jh 43;n;ne;ne;n;e;e;se;se;e;ne;se;se;s;s;sw;s;sw;sw;sw;sw;event_1_67934650", desc: "这是无影楼长老雪若云，此刻正在榻上打坐静养。", },
          { jh: "掩月城", loc: "出云厅", name: "执法长老", way: "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;e;e;e", desc: "这是出云庄四大长老之一的执法长老，负责庄中的法规制度的执行，严肃公正，一丝不苟。", },
          { jh: "掩月城", loc: "松柏石道", name: "狄啸", way: "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;e;e", desc: "这是一个能征战四方的将军，出云庄的得力大将。", },
          { jh: "掩月城", loc: "风花谷", name: "小马驹", way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se", desc: "出生不足一年的小马驹，虽不知其名，但显是有著极纯正优秀的血统，世人皆说风花牧场尽收天下名驹，此言非虚。", },
          { jh: "掩月城", loc: "", name: "宋喉", way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;event_1_90371900", desc: "武林第一通缉犯，可为何被通缉无人所知。如今藏身于隐秘之所，似是在等待何人。", },
          { jh: "掩月城", loc: "越女玉雕", name: "野狗", way: "jh 43", desc: "一条低头啃著骨头的野狗。" },
          { jh: "掩月城", loc: "越女玉雕", name: "执定长老", way: "jh 43", desc: "出云阁四大长老之一，负责出云庄在城中的各种日常事务，也带一些难得下山的年轻小弟子来城中历练。虽表情严肃，却深受晚辈弟子的喜爱。", },
          { jh: "掩月城", loc: "越女玉雕", name: "佩剑少女", way: "jh 43", desc: "两个年方豆蔻的小女孩，身上揹著一把短剑，腰间系著一块『出云』玉牌，脸上全是天真烂漫。", },
          { jh: "掩月城", loc: "南岭密道", name: "穿山甲", way: "jh 43;n;ne;ne;n;e;e;se;se;e;ne", desc: "这是一只穿山甲。" },
          { jh: "掩月城", loc: "南岭密道", name: "火狐", way: "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw", desc: "这是一只红色皮毛的狐狸。" },
          { jh: "掩月城", loc: "南岭密道", name: "黄鹂", way: "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se", desc: "这是一只黄鹂鸟儿，吱吱呀呀地唱著。", },
          { jh: "掩月城", loc: "花海", name: "夜攸裳", way: "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se", desc: "一个来自波斯国的女子，看似穿著华裙，内中却是劲衣。头上扎著一个侧髻，斜插著一支金玉双凤钗。", },
          { jh: "掩月城", loc: "出云庄、松柏石道", name: "云卫", way: "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n", desc: "这是守卫出云庄大门的守卫，气度不凡。", },
          { jh: "掩月城", loc: "松柏石道", name: "云将", way: "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e", desc: "这是统管出云庄护卫的将领，龙行虎步，神威凛凛。", },
          { jh: "掩月城", loc: "松柏石道", name: "女眷", way: "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;e", desc: "这是出云庄的女眷，虽为女流，却精通武艺。", },
          { jh: "掩月城", loc: "松柏石道", name: "青云仙子", way: "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;e;e", desc: "这是一个游历四方的道姑，姿态飘逸，身负古琴，能成为出云庄的客人，怕也是来头不小。", },
          { jh: "掩月城", loc: "", name: "狄仁啸", way: "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;e;e", desc: "" },
          { jh: "掩月城", loc: "出云厅", name: "执剑长老", way: "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;e;e;e", desc: "这是出云庄四大长老之一的执剑长老，负责传授庄中武士的武艺，其一身武功之高自是不在话下。", },
          { jh: "掩月城", loc: "出云厅", name: "秦东海", way: "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;e;e;e", desc: "是出云庄的主人，也是出云部军队的大统帅。身穿狮头麒麟铠，腰佩神剑。", },
          { jh: "掩月城", loc: "出云厅、密室（秦东海推石狮）", name: "执典长老", way: "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;e;e;e;event_1_89957254;ne;ne;se;s;s;s", desc: "这是出云庄四大长老之一的执典长老，负责维护管理庄中重要的典籍和秘书。", },
          { jh: "掩月城", loc: "冶炼坊", name: "莫邪传人", way: "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;e;n", desc: "这是一个顶尖的铸炼天匠，据传曾是莫邪的弟子。", },
          { jh: "掩月城", loc: "九牧溪", name: "老仆", way: "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;e;n;n", desc: "一名忠心耿耿的老仆人，一言不发地守在公子身后。", },
          { jh: "掩月城", loc: "甲胄坊", name: "制甲师", way: "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;e;s", desc: "这是一个顶尖的制造甲胄的大师。", },
          { jh: "掩月城", loc: "练武场", name: "试剑士", way: "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;e;s;s", desc: "这是一个试炼各式兵器和器械的武士。", },
          { jh: "掩月城", loc: "锁龙潭", name: "黑衣老者", way: "jh 43;n;ne;ne;n;e;e;se;se;e;ne;se;se;s;s;sw;s", desc: "一个表情凶狠的黑衣老者，你最好还是不要招惹他。" },
          { jh: "掩月城", loc: "深山石窟", name: "六道禅师", way: "jh 43;n;ne;ne;n;e;e;se;se;e;ne;se;se;s;s;sw;s;sw;sw;sw;sw", desc: "曾经的武林禅宗第一高手，武功修为极高，内力深厚，一身真气护体的功夫，寻常人难以企及。", },
          { jh: "掩月城", loc: "落霞山径", name: "野兔", way: "jh 43;n;ne;ne;n;n;n;nw", desc: "这是一只灰耳白尾的野兔" },
          { jh: "掩月城", loc: "落霞山径", name: "老烟杆儿", way: "jh 43;n;ne;ne;n;n;n;nw;n", desc: "一名白发苍苍的老人，手持一柄烟杆儿。" },
          { jh: "掩月城", loc: "落霞山径", name: "杂货脚夫", way: "jh 43;n;ne;ne;n;n;n;nw;n", desc: "一个负责运送日常杂货的脚夫。" },
          { jh: "掩月城", loc: "落霞山径", name: "短衫剑客", way: "jh 43;n;ne;ne;n;n;n;nw;n;ne", desc: "一个身著短衫，利落干净的剑客。" },
          { jh: "掩月城", loc: "落霞山径", name: "巧儿", way: "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne", desc: "一个聪明伶俐，娇小可爱的小丫头。" },
          { jh: "掩月城", loc: "落霞山径", name: "青牛", way: "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n", desc: "一头通体泛青，健硕无比的公牛。" },
          { jh: "掩月城", loc: "落霞山径", name: "骑牛老汉", way: "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n", desc: "一个黑衫华发的老人，腰佩长剑。" },
          { jh: "掩月城", loc: "孤鹜枫林", name: "书童", way: "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w", desc: "一名年不及二八的小书童，身上揹著书篓。" },
          { jh: "掩月城", loc: "孤鹜枫林", name: "樊川居士", way: "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;nw", desc: "百年难得一出的天纵英才，诗文当世无二，其诗雄姿英发。而人如其诗，个性张扬，如鹤舞长空，俊朗飘逸。", },
          { jh: "掩月城", loc: "孤鹜枫林", name: "青衫女子", way: "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;nw", desc: "一名身著青衫，头戴碧玉簪的年青女子。手里拿著一支绿色玉箫。", },
          { jh: "掩月城", loc: "无影楼", name: "无影暗侍", way: "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;nw;nw", desc: "这是一个无影楼守门的侍卫，全身黑衣，面带黑纱。", },
          { jh: "掩月城", loc: "退思台", name: "琴仙子", way: "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;nw;nw;n;n;n;n;ne;ne;nw;ne;ne;n;n", desc: "一个身著朴素白裙，满头青丝垂下的少女，手指轻动，天籁般的琴音便流淌而出。琴声之间还包含了极深的内力修为。", },
          { jh: "掩月城", loc: "千叶飞瀑", name: "百晓居士", way: "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;nw;nw;n;n;n;n;ne;ne;nw;ne;ne;n;n;ne;e", desc: "这是一个江湖事无所不晓的老头，总是一副若有所思的样子。", },
          { jh: "掩月城", loc: "碎影栈道", name: "清风童子", way: "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;nw;nw;n;n;n;n;ne;ne;nw;ne;ne;n;n;ne;e;se;se", desc: "这是无影楼的小侍童。", },
          { jh: "掩月城", loc: "落英小筑", name: "刀仆", way: "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;nw;nw;n;n;n;n;ne;ne;nw;ne;ne;n;n;ne;e;se;se;se;sw;sw", desc: "这是天刀宗师的仆人，忠心耿耿。", },
          { jh: "掩月城", loc: "落英小筑", name: "天刀宗师", way: "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;nw;nw;n;n;n;n;ne;ne;nw;ne;ne;n;n;ne;e;se;se;se;sw;sw", desc: "一个白发老人，身形挺拔，传说这是二十年前突然消失于武林的天下第一刀客。", },
          { jh: "掩月城", loc: "与谁同坐亭（花间回廊入亭赏月）", name: "虬髯长老", way: "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;nw;nw;n;n;n;n;ne;ne;nw;ne;ne;n;n;ne;e;se;se;se;sw;sw;s;e;s;s;s;event_1_69228002", desc: "这是无影阁四大长老之一的虬髯公，满面赤色的虬髯，腰间一把帝王之剑。", },
          { jh: "掩月城", loc: "黑岩溪", name: "赤尾雪狐", way: "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;sw", desc: "一只通体雪白，尾稍赤红如火的狐狸。" },
          { jh: "掩月城", loc: "黑岩溪", name: "泥鳅", way: "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;sw;sw", desc: "一条乌黑油亮的小泥鳅，在溪水中畅快地游著。", },
          { jh: "掩月城", loc: "黑岩溪", name: "灰衣血僧", way: "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;sw;sw;sw;s;s", desc: "一个满面煞气，身著灰色僧袍，手持大环刀的中年恶僧。", },
          { jh: "掩月城", loc: "白龙天瀑", name: "白鹭", way: "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;sw;sw;sw;s;s;s", desc: "一只羽毛如雪的白鹭，双翅一展有丈许，直欲振翅上九天而去。", },
          { jh: "掩月城", loc: "清溪石板路", name: "行脚贩子", way: "jh 43;sw", desc: "这是一个远道而来的商人，满面风尘。" },
          { jh: "掩月城", loc: "马车店、铁匠铺", name: "店老板", way: "jh 43;sw;sw;sw;s;se;se;se", desc: "马车店老板，年近不惑。" },
          { jh: "掩月城", loc: "骡马市", name: "白衣弟子", way: "jh 43;sw;sw;sw;s;se;se;se;e", desc: "出云庄的年轻弟子，第一次来到市集，看什么都是新鲜。" },
          { jh: "掩月城", loc: "铁匠铺", name: "青衫铁匠", way: "jh 43;sw;sw;sw;s;se;se;se;e;e", desc: "一个深藏不露的铁匠，据说能打出最上乘的武器。", },
          { jh: "掩月城", loc: "骡马市", name: "黑衣骑士", way: "jh 43;sw;sw;sw;s;se;se;se;e;n", desc: "穿著马靴的黑衣少年，似是在维持市场的秩序。", },
          { jh: "掩月城", loc: "天青原", name: "青鬃野马", way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw", desc: "野外的空阔辽远，青鬃马扬起鬃毛，收腰扎背，四蹄翻飞，跨阡度陌，跃丘越壑，尽情地奔驰在自由的风里。", },
          { jh: "掩月城", loc: "天青原", name: "牧民", way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw", desc: "一个风霜满面却面带微笑的中年男子。" },
          { jh: "掩月城", loc: "风花谷", name: "乌骓马", way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne", desc: "通体黑缎子一样，油光放亮，唯有四个马蹄子部位白得赛雪。乌骓背长腰短而平直，四肢关节筋腱发育壮实，这样的马有个讲头，名唤“踢雪乌骓”。", },
          { jh: "掩月城", loc: "风花谷", name: "的卢幼驹", way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne", desc: "额上有白点，通体黝黑的神骏幼驹。" },
          { jh: "掩月城", loc: "风花牧场", name: "千小驹", way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s", desc: "一个年近弱冠的小孩子，身著皮袄，手拿小鞭，自幼在牧场长大，以马驹为名，也极善与马儿相处，据说他能听懂马儿说话。", },
          { jh: "掩月城", loc: "风花牧场", name: "秦惊烈", way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s", desc: "一个身高七尺的伟岸男子，腰里挂著弯刀，明明是满脸虬髯，脸上却总是带著温和的微笑。", },
          { jh: "掩月城", loc: "风花马道", name: "小马驹儿", way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e", desc: "一只刚出生不久的小马驹，虽步行踉跄，却也已能看出纯种烈血宝马的一二分风采。", },
          { jh: "掩月城", loc: "风花马道", name: "牧羊犬", way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e", desc: "牧民们的牧羊犬，威风凛凛，忠心耿耿。" },
          { jh: "掩月城", loc: "风花马道", name: "追风马", way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e", desc: "中原诸侯梦寐以求的军中良马，可日行六百，四蹄翻飞，逐风不休。", },
          { jh: "掩月城", loc: "风花马道", name: "诸侯秘使", way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne", desc: "一个来求购良马的使者，不知道哪个诸侯派出，身份隐秘。", },
          { jh: "掩月城", loc: "风花马道", name: "赤菟马", way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;ne", desc: "人中吕布，马中赤兔，如龙如神，日行千里，红影震慑千军阵！", },
          { jh: "掩月城", loc: "风花马道", name: "风如斩", way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;ne;ne", desc: "风花牧场上最好的牧人之一，左耳吊坠是一只狼王之齿，腰间的马刀也是功勋赫赫！", },
          { jh: "掩月城", loc: "轻舞丘", name: "白狐", way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;ne;ne;nw", desc: "一只通体雪白的小狐狸，在树洞里伸出头来看著你。", },
          { jh: "掩月城", loc: "轻舞丘", name: "小鹿", way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;ne;ne;nw;nw", desc: "" },
          { jh: "掩月城", loc: "", name: "破石寻花", way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;ne;ne;nw;nw;w", desc: "" },
          { jh: "掩月城", loc: "风花马道", name: "爪黄飞电", way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;se", desc: "据说是魏武帝最爱的名驹，体型高大，气势磅礴，万马之中也可一眼看出。", },
          { jh: "掩月城", loc: "风花马道", name: "黑狗", way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;se;s", desc: "一条牧场上的黑狗，汪汪地冲你叫著。" },
          { jh: "掩月城", loc: "风花马道", name: "照夜玉狮子", way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;se;s;s", desc: "此马天下无双，通体上下，一色雪白，没有半根杂色，浑身雪白，传说能日行千里，产于西域，是极品中的极品。", },
          { jh: "掩月城", loc: "风花马道", name: "鲁总管", way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;se;s;s;se", desc: "风花牧场的总管，上上下下的诸多事情都归他打理，内务外交都会经他之手。他却一副好整以暇的样子，似是经纬尽在掌握。", },
          { jh: "掩月城", loc: "风花马道", name: "风花侍女", way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;se;s;s;se", desc: "风花牧场的侍女，虽名义上都是仆从，但却神色轻松，喜笑颜开，和主人管事们都亲热非常。", },
          { jh: "掩月城", loc: "天玑台", name: "天玑童子", way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;se;s;s;se;e", desc: "天玑楼里的小童子，身穿青衫，头系蓝色发带。", },
          { jh: "掩月城", loc: "百里原", name: "灰耳兔", way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;se;s;s;sw;sw", desc: "一只白色的兔子，耳朵却是灰色。", },
          { jh: "掩月城", loc: "", name: "闻香寻芳", way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;se;s;s;sw;sw;sw", desc: "" },
          { jh: "掩月城", loc: "九牧溪", name: "绛衣剑客", way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;se", desc: "一名身著绛色短衫的剑客，太阳穴微微鼓起，显是有著极强内力修为。", },
          { jh: "掩月城", loc: "九牧溪", name: "白衣公子", way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;se;ne", desc: "手持折扇，白衣飘飘的俊美公子，似是女扮男装。" },
          { jh: "掩月城", loc: "浣衣台", name: "农家少妇", way: "jh 43;sw;sw;sw;w", desc: "附近农家的新婚妇人，一边带著孩子，一边浣洗著衣服。" },
          { jh: "掩月城", loc: "浣衣台", name: "六婆婆", way: "jh 43;sw;sw;sw;w", desc: "年长的妇女，总忍不住要善意地指导一下年轻女孩们的家务。" },
          { jh: "掩月城", loc: "甜水井", name: "青壮小伙", way: "jh 43;sw;sw;sw;w;w", desc: "在井边打水的健壮少年，浑身都是紧实的肌肉，总是在有意无意之间展示著自己的力量。", },
          { jh: "掩月城", loc: "东林集市", name: "醉酒男子", way: "jh 43;w", desc: "一名喝得酩酊大醉的男子，看起来似是个浪荡的公子哥。" },
          { jh: "掩月城", loc: "东林集市", name: "仆人", way: "jh 43;w", desc: "富家公子的仆人，唯唯诺诺地跟在身后。" },
          { jh: "掩月城", loc: "犹怜楼", name: "紫衣仆从", way: "jh 43;w;n", desc: "身著紫衣的侍从，不像是青楼守卫，却更有豪门王府门卫的气派。" },
          { jh: "掩月城", loc: "妙玉池", name: "轻纱女侍", way: "jh 43;w;n;n", desc: "一名身著轻纱的女子，黛眉轻扫，红唇轻启，嘴角勾起的那抹弧度仿佛还带著丝丝嘲讽。眼波一转。流露出的风情让人忘记一切。", },
          { jh: "掩月城", loc: "妙玉池", name: "抚琴女子", way: "jh 43;w;n;n", desc: "身著红衣的抚琴少女，红色的外袍包裹著洁白细腻的肌肤，她偶尔站起走动，都要露出细白水嫩的小腿。脚上的银铃也随著步伐轻轻发出零零碎碎的声音。纤细的手指划过古朴的琵琶。令人骚动的琴声从弦衫流淌下来。", },
          { jh: "掩月城", loc: "曲径", name: "小厮", way: "jh 43;w;n;n;n", desc: "楼里的小厮，看起来乖巧得很。" },
          { jh: "掩月城", loc: "曲径", name: "梅映雪", way: "jh 43;w;n;n;n;ne", desc: "一名英姿飒爽的女剑客，身手非凡，负责把守通向后院的小路。" },
          { jh: "掩月城", loc: "朝暮阁", name: "琴楚儿", way: "jh 43;w;n;n;n;ne;nw;nw;ne", desc: "女子长长的秀发随著绝美的脸庞自然垂下，月光下，长发上似乎流动著一条清澈的河流，直直泻到散开的裙角边，那翠色欲流的玉箫轻轻挨著薄薄的红唇，萧声凄美苍凉。她的双手洁白无瑕，轻柔的流动在乐声中，白色的衣裙，散落的长发，流离凄美。她眉宇间，忧伤像薄薄的晨雾一样笼罩著。没有金冠玉饰，没有尊贵华杉。她却比任何人都美。", },
          { jh: "掩月城", loc: "朝暮阁", name: "寄雪奴儿", way: "jh 43;w;n;n;n;ne;nw;nw;ne", desc: "一条从西域带来的波斯猫。" },
          { jh: "掩月城", loc: "荼蘼阁", name: "舞眉儿", way: "jh 43;w;n;n;n;ne;nw;nw;nw", desc: "犹怜楼内最善舞的女子，云袖轻摆招蝶舞、纤腰慢拧飘丝绦。她似是一只蝴蝶翩翩飞舞、一片落叶空中摇曳，又似是丛中的一束花、随著风的节奏扭动腰肢。若有若无的笑容始终荡漾在她脸上，清雅如同夏日荷花。", },
          { jh: "掩月城", loc: "落魂厅", name: "黑纱舞女", way: "jh 43;w;n;n;w", desc: "一个在大厅中间舞台上表演的舞女，身著黑纱。她玉足轻旋，在地上留下点点画痕，水袖乱舞，沾染墨汁勾勒眼里牡丹，裙摆旋舞，朵朵莲花在她脚底绽放，柳腰轻摇，勾人魂魄，暗送秋波，一时间天地竞相为此美色而失色羞愧。可谓是丝竹罗衣舞纷飞！", },
          { jh: "掩月城", loc: "落魂厅", name: "女官人", way: "jh 43;w;n;n;w", desc: "犹怜楼的女主事，半老徐娘，风韵犹存。" },
          { jh: "掩月城", loc: "东林集市", name: "老乞丐", way: "jh 43;w;w", desc: "衣衫破烂却不污秽的老乞丐，身上有八个口袋，似是丐帮净衣八袋弟子。" },
          { jh: "掩月城", loc: "东林集市", name: "赤髯刀客", way: "jh 43;w;w", desc: "一名面向粗旷威武的刀客，胡髯全是火红之色，似是锺馗一般。" },
          { jh: "掩月城", loc: "东林集市", name: "华衣女子", way: "jh 43;w;w", desc: "衣著华贵的女子，年纪尚轻，身上似藏有一些秘密。" },
          { jh: "掩月城", loc: "东林集市", name: "马帮弟子", way: "jh 43;w;w;w", desc: "漠北马帮的得力弟子。" },
          { jh: "掩月城", loc: "东林集市", name: "候君凛", way: "jh 43;w;w;w", desc: "一名中年男子，虽是平常侠客打扮，却颇有几分朝廷中人的气度。" },
          { jh: "掩月城", loc: "卧马客栈", name: "养马小厮", way: "jh 43;w;w;w;n", desc: "这是客栈门口负责为客人牵马喂马的小厮。" },
          { jh: "掩月城", loc: "客栈大堂", name: "客栈掌柜", way: "jh 43;w;w;w;n;n", desc: "卧马客栈的大掌柜的。" },
          { jh: "掩月城", loc: "客栈大堂", name: "店小二", way: "jh 43;w;w;w;n;n", desc: "一个跑前跑后的小二，忙得不可开交。" },
          { jh: "掩月城", loc: "西郊小路", name: "蝮蛇", way: "jh 43;w;w;w;w", desc: "当地特有的毒蛇，嘶嘶地发出警告，你最好不要靠近。" },
          { jh: "掩月城", loc: "西郊小路", name: "东方秋", way: "jh 43;w;w;w;w;nw;n;n", desc: "一名年青剑客，腰插一块显是王府内的令牌，让人对其身份产生了好奇。", },
          { jh: "掩月城", loc: "沧浪河渡口西", name: "函谷关武官", way: "jh 43;w;w;w;w;nw;n;n;nw", desc: "函谷关统兵武官，驻守渡口监视著敌人的动向。", },
          { jh: "掩月城", loc: "沧浪河渡口西", name: "函谷关官兵", way: "jh 43;w;w;w;w;nw;n;n;nw", desc: "这是镇守函谷关的官兵，在渡口侦探敌情。", },
          { jh: "掩月城", loc: "沧浪河谷", name: "长刀敌将", way: "jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw", desc: "这是一名手持长刀的敌将。" },
          { jh: "掩月城", loc: "", name: "黑虎敌将", way: "jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w", desc: "" },
          { jh: "掩月城", loc: "", name: "长鞭敌将", way: "jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w;sw", desc: "" },
          { jh: "掩月城", loc: "", name: "巨锤敌将", way: "jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w;sw;nw;sw;s", desc: "" },
          { jh: "掩月城", loc: "", name: "狼牙敌将", way: "jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w;sw;nw;sw;s;sw", desc: "" },
          { jh: "掩月城", loc: "", name: "金刚敌将", way: "jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w;sw;nw;sw;s;sw;sw;sw", desc: "" },
          { jh: "掩月城", loc: "", name: "蛮斧敌将", way: "jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w;sw;nw;sw;s;sw;sw;sw;nw;n", desc: "" },
          { jh: "掩月城", loc: "", name: "血枪敌将", way: "jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w;sw;nw;sw;s;sw;sw;sw;nw;n;n;n;nw", desc: "" },
          { jh: "掩月城", loc: "", name: "夜魔", way: "jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w;sw;nw;sw;s;sw;sw;sw;nw;n;n;n;nw;nw", desc: "" },
          { jh: "掩月城", loc: "", name: "千夜精锐", way: "jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w;sw;nw;sw;s;sw;sw;sw;nw;n;n;n;nw;nw;n", desc: "" },
          { jh: "掩月城", loc: "", name: "胡人王子", way: "jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w;sw;nw;sw;s;sw;sw;sw;nw;n;n;n;nw;nw;n;n;ne", desc: "" },
          { jh: "掩月城", loc: "", name: "夜魔侍从", way: "jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w;sw;nw;sw;s;sw;sw;sw;nw;n;n;n;nw;nw;n;n;ne;ne;ne", desc: "", },
          { jh: "海云阁", loc: "星夜阁4", name: "越女", way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;w;n;n;n;n;n;w;w;s;s", desc: "这是一个隐世剑客，年方十六，眉目之间极为清秀，却满怀幽怨，莫不是受了情伤？", },
          { jh: "海云阁", loc: "海云镇", name: "马夫", way: "jh 44", desc: "这是一个等候主人的马夫，耐心地打扫著马车。" },
          { jh: "海云阁", loc: "海云镇", name: "野狗", way: "jh 44;n", desc: "一只浑身脏兮兮的野狗。" },
          { jh: "海云阁", loc: "海云镇", name: "老镇长", way: "jh 44;n;n", desc: "这是海云镇的镇长，平日里也没啥事情可管，便拿著个烟袋闲逛。" },
          { jh: "海云阁", loc: "晒谷场", name: "烟袋老头", way: "jh 44;n;n;w", desc: "一个显然有著不低功夫底子的老头子，手拿一个烟袋。" },
          { jh: "海云阁", loc: "晒谷场", name: "青年女子", way: "jh 44;n;n;w", desc: "一个青年女剑客，年方二八，身姿矫健。" },
          { jh: "海云阁", loc: "海云镇", name: "背枪客", way: "jh 44;n;n;n", desc: "这是一个青年武士，背后揹著一把亮银长枪。" },
          { jh: "海云阁", loc: "海云镇", name: "小孩", way: "jh 44;n;n;n;n", desc: "这是海云镇的一个小孩子，年方五六岁，天真烂漫。" },
          { jh: "海云阁", loc: "新月道", name: "野兔", way: "jh 44;n;n;n;n;w;w", desc: "正在吃草的兔子。" },
          { jh: "海云阁", loc: "满月道", name: "游客", way: "jh 44;n;n;n;n;e;ne", desc: "这是一个游客，揹著手享受著山海美景。" },
          { jh: "海云阁", loc: "怒龙栈道", name: "青年剑客", way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w", desc: "这是一个青年剑客，眼含剑气。", },
          { jh: "海云阁", loc: "怒龙栈道", name: "九纹龙", way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;w", desc: "这是海云阁四大杀手之一的九纹龙，凶狠非常。", },
          { jh: "海云阁", loc: "怒龙栈道", name: "蟒蛇", way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;w;n;n;n;n", desc: "一只昂首直立，吐著长舌芯的大蟒蛇。", },
          { jh: "海云阁", loc: "临海平台", name: "暗哨", way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;w;n;n;n;n;n", desc: "这是海云阁的暗哨，身穿平常的布衣，却掩饰不了眼神里的狡黠和敏锐。", },
          { jh: "海云阁", loc: "怒龙台", name: "石邪王", way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;w;n;n;n;n;n;e;e;s;s", desc: "据说这曾是武林魔道名门掌门，其武学造诣也是登峰造极。", },
          { jh: "海云阁", loc: "海云门", name: "天杀", way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e", desc: "这是一名海云阁高级杀手。", },
          { jh: "海云阁", loc: "海云道", name: "地杀", way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;wn;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e;;s;s", desc: "这是一名海云阁高级杀手。", },
          { jh: "海云阁", loc: "海云道", name: "穿山豹", way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e;s;s;s;s;s", desc: "这事海云阁四大杀手之一的穿山豹，行动敏捷，狡黠异常。", },
          { jh: "海云阁", loc: "海云殿", name: "海东狮", way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e;n", desc: "这是海云阁四大杀手之首的海东狮，近十年来从未失手，手底已有数十个江湖名门掌门的性命。", },
          { jh: "海云阁", loc: "海云殿", name: "海云长老", way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e;n", desc: "这是海云阁内的长老级杀手。", },
          { jh: "海云阁", loc: "海云殿", name: "红纱舞女", way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e;n", desc: "这是一个身著轻纱的舞女，穿著轻薄，舞姿极尽媚态，眉目轻笑之间却隐含著淡淡的杀气。", },
          { jh: "海云阁", loc: "海云殿", name: "青纱舞女", way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e;n", desc: "这是一个身著轻纱的舞女，穿著轻薄，舞姿极尽媚态，眉目轻笑之间却隐含著淡淡的杀气。", },
          { jh: "海云阁", loc: "海云殿", name: "紫纱舞女", way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e;n", desc: "这是一个身著轻纱的舞女，穿著轻薄，舞姿极尽媚态，眉目轻笑之间却隐含著淡淡的杀气。", },
          { jh: "海云阁", loc: "海云殿", name: "白纱舞女", way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e;n", desc: "这是一个身著轻纱的舞女，穿著轻薄，舞姿极尽媚态，眉目轻笑之间却隐含著淡淡的杀气。", },
          { jh: "海云阁", loc: "", name: "虬髯犯人", way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e;n;n;nw;w;w;nw", desc: "这人满脸虬髯，头发长长的直垂至颈，衣衫破烂不堪，简直如同荒山中的野人", },
          { jh: "海云阁", loc: "", name: "六如公子", way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;n;w;n;n;n;n;w;n;w;w;n;n;n", desc: "这是一个隐士，武学修为极高，也似乎并不受海云阁辖制。", },
          { jh: "海云阁", loc: "", name: "萧秋水", way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;n;e;n;n;n;n;n;e;e;n;n", desc: "传闻他出自天下第一名门浣花剑派，却无人知晓他的名讳。", },
          { jh: "海云阁", loc: "苍穹栈道", name: "啸林虎", way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;e;e;e;e;e;e;n;n", desc: "这事海云阁四大杀手之一的啸林虎，武功极高。", },
          { jh: "海云阁", loc: "雪山小道", name: "陆大刀", way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;e;e;e;e;e;e;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e", desc: "江湖南四奇之首，人称仁义陆大刀。", },
          { jh: "海云阁", loc: "雪山小道", name: "水剑侠", way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;e;e;e;e;e;e;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;ne", desc: "江湖南四奇之一，外号叫作“冷月剑”", },
          { jh: "海云阁", loc: "雪山小道", name: "乘风客", way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;e;e;e;e;e;e;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;ne;ne", desc: "江湖南四奇之一，外号叫作“柔云剑”。", },
          { jh: "海云阁", loc: "雪山山脚", name: "血刀妖僧", way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;e;e;e;e;e;e;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;ne;ne;e;se;se;se", desc: "「血刀圣教」掌门人，自称「武林第一邪派高手」，门下都作和尚打扮，但个个都是十恶不赦的淫僧。", },
          { jh: "海云阁", loc: "山路", name: "花铁枪", way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;e;e;e;e;e;e;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;ne;ne;e;se;se;se;ne;ne", desc: "江湖南四奇之一，外号叫作“中平枪”。", },
          { jh: "海云阁", loc: "雪洞", name: "狄小侠", way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;e;e;e;e;e;e;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;ne;ne;e;se;se;se;ne;ne;n;n;n;n;nw", desc: "其貌不扬，但却有情有义，敢爱敢恨，性格鲜明。", },
          { jh: "海云阁", loc: "雪洞", name: "水姑娘", way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;e;e;e;e;e;e;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;ne;ne;e;se;se;se;ne;ne;n;n;n;n;nw", desc: "白衫飘飘，样貌清秀俏丽，人品俊雅，嫉恶如仇。", },
          { jh: "幽冥山庄", loc: "幽暗山路", name: "野狗", way: "jh 45;ne", desc: "一条低头啃著骨头的野狗。" },
          { jh: "幽冥山庄", loc: "幽暗山路", name: "毒蛇", way: "jh 45;ne;ne;n;n", desc: "当地特有的毒蛇，嘶嘶地发出警告，你最好不要靠近。" },
          { jh: "幽冥山庄", loc: "五龙堂", name: "柳激烟", way: "jh 45;ne;ne;n;n;ne;ne;nw;nw;nw;n;n;n", desc: "五湖九州、黑白两道、十二大派都尊称为“捕神”的六扇门第一把好手。", },
          { jh: "幽冥山庄", loc: "正厅", name: "龟敬渊", way: "jh 45;ne;ne;n;n;ne;ne;nw;nw;nw;n;n;n;n", desc: "一名鹑衣百结、满脸黑须的老人，眼睛瞪得像铜钱一般大，粗眉大目，虽然比较矮，但十分粗壮，就像铁罩一般，一双粗手，也比常人粗大一二倍。这人身上并无兵器，但一身硬功，“铁布衫”横练，再加上“十三太保”与“童于功”，据说已有十一成的火候，不但刀剑不入，就算一座山塌下来，也未必把他压得住！", },
          { jh: "幽冥山庄", loc: "正厅", name: "凌玉象", way: "jh 45;ne;ne;n;n;ne;ne;nw;nw;nw;n;n;n;n", desc: "银眉白须，容貌十分清灌，身形颀长，常露慈蔼之色，背插长剑", },
          { jh: "幽冥山庄", loc: "正厅", name: "慕容水云", way: "jh 45;ne;ne;n;n;ne;ne;nw;nw;nw;n;n;n;n", desc: "一个白发斑斑，但脸色泛红的老者，腰问一柄薄而利的缅刀，终日不离身，左右太阳穴高高鼓起，显然内功已入化境。", },
          { jh: "幽冥山庄", loc: "正厅", name: "沈错骨", way: "jh 45;ne;ne;n;n;ne;ne;nw;nw;nw;n;n;n;n", desc: "一个装扮似道非道的老者，黑发长髯，态度冷傲，手中一把拂尘。", },
          { jh: "幽冥山庄", loc: "书房", name: "冷血", way: "jh 45;ne;ne;n;n;ne;ne;nw;nw;nw;n;n;n;n;e", desc: "善剑法，性坚忍，他的剑法是没有名堂的，他刺出一剑是一剑，快、准而狠，但都是没招式名称的。", },
          { jh: "幽冥山庄", loc: "后花园", name: "庄之洞", way: "jh 45;ne;ne;n;n;ne;ne;nw;nw;nw;n;n;n;n;n", desc: "腰间缠著椎链子，一副精明能干的样子。", },
          { jh: "幽冥山庄", loc: "后花园", name: "高山青", way: "jh 45;ne;ne;n;n;ne;ne;nw;nw;nw;n;n;n;n;n", desc: "高头大马，高山青拿著的是一条玉一般的桃木棍，棒身细滑，杖尖若刀，长七尺六寸。", },
          { jh: "幽冥山庄", loc: "二楼", name: "金盛煌", way: "jh 45;ne;ne;n;n;ne;ne;nw;nw;nw;n;n;n;n;w", desc: "富甲一方，武功盖世的“三十六手蜈蚣鞭”。" },
          { jh: "幽冥山庄", loc: "幽暗山路", name: "樵夫", way: "jh 45;ne;ne;n;n;ne;ne;e;ne;n", desc: "一个砍柴为生的樵夫。" },
          { jh: "幽冥山庄", loc: "火堆", name: "鲍龙", way: "jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;e", desc: "虬髯怒目的大汉。" },
          { jh: "幽冥山庄", loc: "火堆", name: "鲍蛇", way: "jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;e", desc: "虬髯怒目的大汉。" },
          { jh: "幽冥山庄", loc: "火堆", name: "鲍虎", way: "jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;e", desc: "虬髯怒目的大汉。" },
          { jh: "幽冥山庄", loc: "山庄石道", name: "过之梗", way: "jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne", desc: "年约四五十岁，长眉黑髯，样子十分刚正。", },
          { jh: "幽冥山庄", loc: "山庄石道", name: "翁四", way: "jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n", desc: "武功不弱，而且为人正义，素得侠名。" },
          { jh: "幽冥山庄", loc: "小连环坞", name: "屈奔雷", way: "jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;e", desc: "行事于正邪之间，性格刚烈，脾气古怪，不过从不作伤天害理之事，只是明目张胆的抢劫烧杀，这人可干得多了；据说他武功很高，内功外功兼备，铁斧也使得出神入化。", },
          { jh: "幽冥山庄", loc: "小连环坞", name: "屈奔雷分身", way: "jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;e", desc: "屈奔雷分身，实力不容小视！" },
          { jh: "幽冥山庄", loc: "枫林小栈", name: "伍湘云", way: "jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;e;e", desc: "一身彩衣，垂发如瀑，腰上挽了一个小花结，结上两柄玲珑的小剑，更显得人娇如花，容光照人。", },
          { jh: "幽冥山庄", loc: "枫林小栈", name: "殷乘风", way: "jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;e;e", desc: "身段颀长而略瘦，但眉宇之间，十分精明锐利，犹如琼瑶玉树，丰神英朗", },
          { jh: "幽冥山庄", loc: "山庄石道", name: "辛仇", way: "jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n", desc: "自幼残肢断臂，受人歧视，故苦练奇技，仇杀江湖，无人不畏之如神鬼也。", },
          { jh: "幽冥山庄", loc: "山庄石道", name: "辛杀", way: "jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n", desc: "一个风程仆仆的侠客。" },
          { jh: "幽冥山庄", loc: "山庄石道", name: "蔡玉丹", way: "jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;nw;nw", desc: "家财万贯，是丝绸商人，但仁侠异常，喜助人，义疏财，武功很高。", },
          { jh: "幽冥山庄", loc: "山庄石道", name: "暗杀", way: "jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;nw;nw;n", desc: "这是跟随辛十三娘的杀手。", },
          { jh: "幽冥山庄", loc: "山庄石道", name: "辛十三娘", way: "jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;nw;nw;n", desc: "这女魔头似具有动物的本能护体色，如贴在树上动也不动，便像一张叶子一般，如坐在地上动也不动，便像一颗岩石一般；在黑夜里便像是夜色的一部分，在雪地上就变成了雪花，谁也认不出来。", },
          { jh: "幽冥山庄", loc: "暗风岭", name: "巴司空", way: "jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;nw;nw;n;w", desc: "他是大理国三公之一。一个又瘦又黑的汉子，但他的擅长轻功。", },
          { jh: "幽冥山庄", loc: "山庄石道", name: "追命", way: "jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;nw;nw;n;e;e", desc: "脚力无双，所以轻功也奇佳，追踪术一流，嗜酒如命。", },
          { jh: "幽冥山庄", loc: "山庄石道", name: "艳无忧", way: "jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;nw;nw;n;e;e;e", desc: "江湖中一大魔头，年轻貌美，因她擅‘吸血功’，以别人之鲜血，保持她的青春与容貌。", },
          { jh: "幽冥山庄", loc: "山庄石道", name: "摄魂鬼杀", way: "jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;nw;nw;n;e;e;e", desc: "这是跟随艳无忧的杀手，武功颇为高深。", },
          { jh: "幽冥山庄", loc: "幽冥山庄", name: "幽冥山庄", way: "jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;nw;nw;n;e;e;e;e;e", desc: "" },
          { jh: "花街", loc: "花街", name: "尊信门杀手", way: "jh 46;e", desc: "尊信门叛将带领的杀手，个个心狠手辣。" },
          { jh: "花街", loc: "花街", name: "花札敖", way: "jh 46;e", desc: "魔宗长老，紫色瞳孔彰显他天魔功法已经大成。" },
          { jh: "花街", loc: "花街", name: "山赤岳", way: "jh 46;e;e", desc: "魔宗长老，使一对八角大锤。" },
          { jh: "花街", loc: "花街", name: "鹰飞", way: "jh 46;e;e;e", desc: "魔宗后起高手，是魔宗的希望。" },
          { jh: "花街", loc: "花街", name: "由蚩敌", way: "jh 46;e;e;e;e", desc: "蒙古两大高手之一，擅用连环索。" },
          { jh: "花街", loc: "花街", name: "强望生", way: "jh 46;e;e;e;e;e", desc: "火须红发，蒙古两大高手之一。" },
          { jh: "花街", loc: "花街", name: "莫意闲", way: "jh 46;e;e;e;e;e;e", desc: "江湖黑道邪派高手之一，列名十大高手榜。" },
          { jh: "花街", loc: "花街", name: "甄素善", way: "jh 46;e;e;e;e;e;e;e", desc: "黑道最富有诱惑力的女人，风情万种。" },
          { jh: "花街", loc: "醉梦楼", name: "谈应手", way: "jh 46;e;e;e;e;e;e;e;e", desc: "黑道高手，十恶庄庄主，一方霸主。" },
          { jh: "花街", loc: "大厅", name: "方夜羽", way: "jh 46;e;e;e;e;e;e;e;e;n", desc: "「魔师」庞斑的关门弟子，有「小魔师」之称，文秀之极，肌肤比少女还滑嫩，但身形颇高，肩宽膊阔，秀气透出霸气，造成一种予人文武双全的感觉。", },
          { jh: "花街", loc: "二楼", name: "封寒", way: "jh 46;e;e;e;e;e;e;e;e;n;n;n;e;e", desc: "黑榜天下第二的高手，天下第一刀客。" },
          { jh: "花街", loc: "沁芳阁", name: "寒碧翠", way: "jh 46;e;e;e;e;e;e;e;e;n;n;n;e;e;e", desc: "优雅十分，舞姿倾城，据说观舞可领悟出长生之道。" },
          { jh: "花街", loc: "凝香阁", name: "薄昭如", way: "jh 46;e;e;e;e;e;e;e;e;n;n;n;e;e;s", desc: "清雅十分，舞姿倾城，据说观舞可领悟出防御之道。" },
          { jh: "花街", loc: "藏娇阁", name: "盈散花", way: "jh 46;e;e;e;e;e;e;e;e;n;n;n;e;e;n", desc: "据说来自西域，擅长波斯舞，每日来观舞之人络绎不绝，虽耗费颇高，但据说观舞可以领悟出武学攻击招式的奥秘。", },
          { jh: "花街", loc: "花街", name: "怒蛟高手", way: "jh 46;e;e;e;e;e;e;e;e;e", desc: "这是黑道第一大帮-怒蛟帮的顶尖高手。" },
          { jh: "花街", loc: "花街", name: "戚长征", way: "jh 46;e;e;e;e;e;e;e;e;e", desc: "江湖中的后起之秀，新一代高手中最好的刀客，得左手刀封寒亲传。", },
          { jh: "花街", loc: "花街", name: "韩柏", way: "jh 46;e;e;e;e;e;e;e;e;e;e", desc: "阴差阳错成为高手的小书童。" },
          { jh: "花街", loc: "花街", name: "烈震北", way: "jh 46;e;e;e;e;e;e;e;e;e;e;e", desc: "黑道最负盛名的神医，义气干云。" },
          { jh: "花街", loc: "花街", name: "赤尊信", way: "jh 46;e;e;e;e;e;e;e;e;e;e;e;e", desc: "尊信门门主，黑榜十大高手之一。" },
          { jh: "花街", loc: "花街", name: "干罗", way: "jh 46;e;e;e;e;e;e;e;e;e;e;e;e;e", desc: "山城门主，黑榜十大高手之一。" },
          { jh: "花街", loc: "花街", name: "厉若海", way: "jh 46;e;e;e;e;e;e;e;e;e;e;e;e;e;e", desc: "黑道高手排名第三，也有人说他实力与浪翻云相较也不差半分。", },
          { jh: "花街", loc: "花街", name: "浪翻云", way: "jh 46;e;e;e;e;e;e;e;e;e;e;e;e;e;e;e", desc: "黑榜之首，江湖第一大帮的核心人物。" },
          { jh: "西凉城", loc: "荒漠", name: "响尾蛇", way: "jh 47;ne", desc: "一条带有剧毒，尾环在御敌时发出嗡嗡响的响尾蛇。" },
          { jh: "西凉城", loc: "荒丘", name: "官差", way: "jh 47;ne;n;n;n;nw", desc: "这是西凉城衙门的一名官差，呆呆的不言不动，只是浑身颤抖。" },
          { jh: "西凉城", loc: "荒丘", name: "官兵", way: "jh 47;ne;n;n;n;nw", desc: "西凉城的官兵，透著几分疲惫。" },
          { jh: "西凉城", loc: "城外马道", name: "驿卒", way: "jh 47;ne;n;n;n;ne;ne;e", desc: "这是别的城市前来此处送信的驿卒，满面尘土。" },
          { jh: "西凉城", loc: "西凉城门", name: "官兵", way: "jh 47;ne;n;n;n;ne;ne;e;e;e", desc: "西凉城的官兵，透著几分疲惫。" },
          { jh: "西凉城", loc: "土路", name: "苦力", way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne", desc: "一个苦力打扮的汉子在这里等人来雇用。" },
          { jh: "西凉城", loc: "土路", name: "屠凌心", way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;se", desc: "身材矮小，一张脸丑陋无比，满是刀疤伤痕。" },
          { jh: "西凉城", loc: "土路", name: "昆仑杀手", way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;se", desc: "一个风程仆仆的侠客。" },
          { jh: "西凉城", loc: "土路", name: "金凌霜", way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;se;s", desc: "六十来岁年纪，双目神光湛然。" },
          { jh: "西凉城", loc: "土路", name: "醉汉", way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;se;s", desc: "一个喝得醉醺醺的年轻人。。。。。" },
          { jh: "西凉城", loc: "土路", name: "钱凌异", way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;se;s;s", desc: "一名高瘦的汉子，眼神阴毒。" },
          { jh: "西凉城", loc: "马王庙", name: "齐伯川", way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;se;s;s;s", desc: "燕陵镖局的少镖头，平日里飞扬跋扈，现在却是一副落魄样子。", },
          { jh: "西凉城", loc: "土路", name: "樵夫", way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n", desc: "你看到一个粗壮的大汉，身上穿著普通樵夫的衣服。" },
          { jh: "西凉城", loc: "土路", name: "疯狗", way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne", desc: "一只浑身脏兮兮的野狗，一双眼睛正恶狠狠地瞪著你。", },
          { jh: "西凉城", loc: "正殿", name: "止观大师", way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;e;e;n;n;n;n;n", desc: "一名白衣灰须的老僧，双眼炯炯有神。", },
          { jh: "西凉城", loc: "正殿", name: "止观分身", way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;e;e;n;n;n;n;n", desc: "止观大师的分身，战斗力爆棚！", },
          { jh: "西凉城", loc: "正殿", name: "慧清", way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;e;e;n;n;n;n;n", desc: "止观大师的亲传弟子，灰色衣袍。" },
          { jh: "西凉城", loc: "殿后小路", name: "佛灯", way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;e;e;n;n;n;n;n;n;ne;n", desc: "这是一盏佛灯，闪著微弱的青光，照亮著山路。", },
          { jh: "西凉城", loc: "土路", name: "野狗", way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n", desc: "一只浑身脏兮兮的野狗。" },
          { jh: "西凉城", loc: "土路", name: "农民", way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;n", desc: "一个戴著斗笠，正在辛勤劳作的农民。" },
          { jh: "西凉城", loc: "土路", name: "马夫", way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;n;n;n", desc: "这是一个等候主人的马夫，耐心地打扫著马车。", },
          { jh: "西凉城", loc: "铁剑山庄", name: "管家", way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;n;n;n;nw;nw;ne;n;ne", desc: "铁剑山庄管家，约莫五十来岁。" },
          { jh: "西凉城", loc: "正堂", name: "李铁杉", way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;n;n;n;nw;nw;ne;n;ne;n", desc: "一名红光满面的高大老者。", },
          { jh: "西凉城", loc: "燕陵镖局", name: "齐润翔", way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;n;n;n;nw;nw;nw", desc: "一名老者坐在镖局大厅，须长及胸，生得一张紫膛脸，正是燕陵镖局的总镖头齐润翔。", },
          { jh: "西凉城", loc: "燕陵镖局", name: "黑衣镖师", way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;n;n;n;nw;nw;nw", desc: "身著黑衣的镖师，一看就是经验丰富的老江湖。", },
          { jh: "西凉城", loc: "练武场", name: "镖师", way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;n;n;n;nw;nw;nw;nw", desc: "燕陵镖局的年青镖师，正在发呆。", },
          { jh: "西凉城", loc: "中堂", name: "捕快", way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;w;w", desc: "西凉城的捕快，腰佩单刀。" },
          { jh: "西凉城", loc: "中堂", name: "伍定远", way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;w;w", desc: "黝黑的四方脸上一派威严，一望便知是这些官差的头儿，衙门的捕头。", },
          { jh: "西凉城", loc: "后堂", name: "捕快", way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;w;w;w", desc: "西凉城的捕快，腰佩单刀。" },
          { jh: "高昌迷宫", loc: "蒙古包", name: "苏普", way: "jh 48;e;ne", desc: "年轻俊朗的小伙子，虎背熊腰，是大漠第一勇士苏鲁克的儿子。" },
          { jh: "高昌迷宫", loc: "蒙古包", name: "糟老头子", way: "jh 48;e;ne", desc: "他满头白发，竟无一根是黑的，身材甚是高大，只是弓腰曲背，衰老已极", },
          { jh: "高昌迷宫", loc: "蒙古包", name: "陈达海", way: "jh 48;e;ne", desc: "一个身穿羊皮袄的高大汉子，虬髯满腮，他腰间上左右各插著一柄精光闪亮的短剑。两柄短剑的剑把一柄金色，一柄银色。", },
          { jh: "高昌迷宫", loc: "蒙古包", name: "阿曼", way: "jh 48;e;ne", desc: "貌美如花的哈萨克女子，苏普的妻子。" },
          { jh: "高昌迷宫", loc: "蒙古包", name: "太行刀手", way: "jh 48;e;ne", desc: "当地的刀功绝活大师，随便放在江湖中都是个了不起的刀霸。" },
          { jh: "高昌迷宫", loc: "蒙古包", name: "哈卜拉姆", way: "jh 48;e;ne;ne", desc: "铁延部中精通「可兰经」、最聪明最有学问的老人。" },
          { jh: "高昌迷宫", loc: "蒙古包", name: "牧民", way: "jh 48;e;ne;ne;se", desc: "哈萨克牧民，正在做著晚餐。" },
          { jh: "高昌迷宫", loc: "", name: "天铃鸟", way: "jh 48;e;ne;ne;s", desc: "这鸟儿的歌声像是天上的银铃。它只在晚上唱歌，白天睡觉。有人说，这是天上的星星掉下来之后变的。又有些哈萨克人说，这是草原上一个最美丽、最会唱歌的少女死了之后变的。她的情郎不爱她了，她伤心死的。", },
          { jh: "高昌迷宫", loc: "大沙漠", name: "霍元龙", way: "jh 48;e;se", desc: "虬髯大汉，身挎长刀，一脸凶神恶煞。" },
          { jh: "高昌迷宫", loc: "大沙漠", name: "太行刀手", way: "jh 48;e;se", desc: "当地的刀功绝活大师，随便放在江湖中都是个了不起的刀霸。" },
          { jh: "高昌迷宫", loc: "戈壁滩", name: "恶狼", way: "jh 48;e;se;se;e;ne;se", desc: "一头大灰狼，闪著尖利的牙齿。" },
          { jh: "高昌迷宫", loc: "戈壁滩", name: "响尾蛇", way: "jh 48;e;se;se;e;ne;se;e", desc: "戈壁滩上的响尾蛇，你要小心了！" },
          { jh: "高昌迷宫", loc: "大沙漠", name: "骆驼", way: "jh 48;e;se;se;e;ne;se;e;e;e;ne;se;se;s", desc: "行走于沙漠的商队骆驼。" },
          { jh: "高昌迷宫", loc: "山陵", name: "男尸", way: "jh 48;e;se;se;e;ne;se;e;e;e;ne;se;se;s;s;s;sw", desc: "一具男尸，看身上的装束似是中原武士。", },
          { jh: "高昌迷宫", loc: "山洞", name: "老翁", way: "jh 48;e;se;se;e;ne;se;e;e;e;ne;se;se;s;s;s;sw;sw;s", desc: "身形瘦弱，形容枯槁，愁眉苦脸，身上穿的是汉人装束，衣帽都已破烂不堪。但他头发卷曲，却又不大像汉人。", },
          { jh: "高昌迷宫", loc: "山洞", name: "李文秀", way: "jh 48;e;se;se;e;ne;se;e;e;e;ne;se;se;s;s;s;sw;sw;s;sw;se", desc: "身著哈萨克长袍的汉族少女，眉清目秀，貌美如花。有人说，她唱出的歌声，便如同那天铃鸟一般动人。", },
          { jh: "高昌迷宫", loc: "甬道", name: "苏鲁克", way: "jh 48;e;se;se;e;ne;se;e;e;e;ne;ne;event_1_369927", desc: "哈萨克第一勇士，力大无穷。" },
          { jh: "高昌迷宫", loc: "甬道", name: "车尔库", way: "jh 48;e;se;se;e;ne;se;e;e;e;ne;ne;event_1_369927;n", desc: "哈萨克第二勇士，苏鲁克的好朋友。", },
          { jh: "高昌迷宫", loc: "高昌宝藏", name: "瓦耳拉齐", way: "jh 48;e;se;se;e;ne;se;e;e;e;ne;ne;event_1_369927;n;n;n", desc: "白衣白袍的哈萨克高手，为李文秀所救。", },
          { jh: "高昌迷宫", loc: "高昌宝藏", name: "分身", way: "jh 48;e;se;se;e;ne;se;e;e;e;ne;ne;event_1_369927;n;n;n", desc: "瓦耳拉齐的分身，十分强悍！" },
          { jh: "京城", loc: "城外山路", name: "贵妇", way: "rank go 194;s;se", desc: "城里大户人家的贵妇，正要上山拜佛还愿。" },
          { jh: "京城", loc: "城外山路", name: "王一通", way: "rank go 194;s;se;se", desc: "千万个小人物中的一个，读过书算过账，没有经世致用之才，没有平定一方之力，匡扶天下他没有这个志气，建功立业怕也没有这个本事。老婆刚又生了个孩子，家里却又有债主上门，正急得如热锅上的蚂蚁。", },
          { jh: "京城", loc: "西直门", name: "城门官兵", way: "rank go 194;s;se;se;se;e", desc: "镇守京城的官兵，银盔银甲，威风凛凛。" },
          { jh: "京城", loc: "阜成门", name: "城门官兵", way: "rank go 194;s;se;se;se;e;s;s;s", desc: "镇守京城的官兵，银盔银甲，威风凛凛。" },
          { jh: "京城", loc: "御花园", name: "银川公主", way: "rank go 194;s;se;se;se;e;s;s;s;e;se;e;e;n;n;nw;nw;n", desc: "貌美的皇帝长女，奉命西嫁和番，性格仁慈，高贵端丽，让人不敢轻侮，西疆大战中，展现出皇家天女的绝代风华，令无数乱臣贼子为之感动敬服。见识卓越，忍人所不能忍，在去西疆途中爱慕卢云，可为了国家深藏情感。银川有著极其独立的人格和无奈得让人心碎的命运。只因生在帝王家，便要在豆蔻年华永远放弃自己的爱情和未来，远嫁异邦，靠自己柔软无依的肩膀支撑起千万将士的性命和两国的和平。都说华夏自古多英豪，为何女子从此不得归故乡？", },
          { jh: "京城", loc: "皇极殿", name: "柳昂天", way: "rank go 194;s;se;se;se;e;s;s;s;e;se;e;e;n;n;n;n;n", desc: "胆小的大将军，赳赳武夫，官拜大都督，统领数十万兵马，却是个怯懦政客。他表面是天下英雄的领袖和希望，然而却一再屈从于强权，虚伪而懦弱。他不是残害忠良之辈，但也不会为了公道正义损害自己的功名利禄；与奸臣斗，并非因为伸张正义，而是因为自己也不好过。弱小者的沉默也许还能借口能力有限自身难保，然而处在这样位高权重的位置，胆小却是他千秋万世的罪恶。", },
          { jh: "京城", loc: "皇极殿", name: "柳府铁卫", way: "rank go 194;s;se;se;se;e;s;s;s;e;se;e;e;n;n;n;n;n", desc: "柳府的私人卫队。" },
          { jh: "京城", loc: "皇极殿", name: "江充", way: "rank go 194;s;se;se;se;e;s;s;s;e;se;e;e;n;n;n;n;n", desc: "大奸臣，年约五十，十八省总按察，官拜太子太师。阴谋诡诈，多疑善变，是景泰王朝的第一权臣，与东厂刘敬、征北大都督柳昂天鼎足而立。为一宗多年尘封的旧案屡出天山，威势所逼，终令朝廷要员弃官亡命，也让许多江湖人物走投无路。一个没有武功、没有文才的矮胖小人，凭著三寸不烂之舌和掌控他人的心理，便能够驱使天下英杰如驱使猪狗。所有祸端皆应他而起，纵你有神佛之能也要被他诬陷、算计。都说只因奸臣当道，所以才有天下英雄皆不得志。然，哪朝没有奸臣，何曾有过断绝？当皇帝被蒙蔽、直言之人死于横祸、天下黎民尽皆哀嚎的时候，为何朝堂之上鸦雀无声；而元凶授首、挫骨扬灰之际，却又为何如此人声鼎沸、争先恐后？其实，胆怯的我们都曾是小人的帮凶，在每个时代里，扮演著每一个肮脏的庞然大物的吹鼓手。江充，便是所有沉默的天下人心里开出的恶之花。", },
          { jh: "京城", loc: "御书房", name: "刘敬", way: "rank go 194;s;se;se;se;e;s;s;s;e;se;e;e;n;n;ne;ne;n;n;nw", desc: "作为朝廷三大派之一的领袖人物，他心机深沉、眼光毒辣、言辞精巧。", },
          { jh: "京城", loc: "御书房", name: "小太监", way: "rank go 194;s;se;se;se;e;s;s;s;e;se;e;e;n;n;ne;ne;n;n;nw", desc: "宫里的小太监，身著布衣。", },
          { jh: "京城", loc: "正阳门", name: "城门官兵", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e", desc: "镇守京城的官兵，银盔银甲，威风凛凛。", },
          { jh: "京城", loc: "永定大街", name: "东厂侍卫", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s", desc: "东厂的鹰犬，怕是又在做什么坏事。", },
          { jh: "京城", loc: "永定大街", name: "九华山女弟子", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s", desc: "九华剑派的女弟子，身姿绰约，腰带长剑。", },
          { jh: "京城", loc: "永定大街", name: "娟儿", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s", desc: "青衣秀士徒弟，艳婷之师妹，对师傅师姐有极强的依赖心，情牵阿傻，然而阿傻恢复记忆后忘记与娟儿的一切经历，离娟儿而去。", },
          { jh: "京城", loc: "永定大街", name: "侯府小姐", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s", desc: "这是一个侯府的小姐，身著华丽，谈吐优雅。" },
          { jh: "京城", loc: "永定大街", name: "小丫鬟", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s", desc: "一个笑嘻嘻的小丫头，侯府的丫鬟，跟小姐显是关系亲密。", },
          { jh: "京城", loc: "王府后街", name: "莫凌山", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e", desc: "昆仑剑派高手之一，心狠手辣。" },
          { jh: "京城", loc: "王府后街", name: "昆仑弟子", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e", desc: "昆仑剑派的弟子，白衣长剑。", },
          { jh: "京城", loc: "王府后街", name: "安道京", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e;e", desc: "东厂大太监之一，功夫深不可测。" },
          { jh: "京城", loc: "王府后街", name: "东厂高手", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e;e", desc: "东厂高手，面目冷漠。", },
          { jh: "京城", loc: "万福楼", name: "伍崇卿", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e;e;s", desc: "伍定远的义子，本为一流浪儿，伍定远收养了他，并取名伍崇卿。武英帝复辟后为“义勇人”成员。后性情大变，怨伍定远懦弱退缩。想用自己的方式保护伍定远。曾在“魁星站五关”后蒙面黑衣独自一人杀入太医院，击败了包括苏颖超、哲尔丹在内的众多高手。", },
          { jh: "京城", loc: "万福楼", name: "苏颖超", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e;e;s", desc: "武林四大宗师之一华山派掌门宁不凡嫡传弟子，宁不凡退隐后，接任华山掌门，为武林新一代的俊杰。才貌双全的苏颖超，和「紫云轩」少阁主琼芳一见钟情，可谓青梅竹马。在太医院中被黑衣人伍崇卿击败后，接著练剑遭遇瓶颈，揹负上了沉重的心理包袱。", },
          { jh: "京城", loc: "万福楼", name: "店伙计", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e;e;s", desc: "一个酒楼的小伙计，十五六岁上下。", },
          { jh: "京城", loc: "万福楼", name: "茶圣-陆羽", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e;e;s", desc: "一个酒楼的小伙计，十五六岁上下。", },
          { jh: "京城", loc: "王府后街", name: "郝震湘", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e;e;e", desc: "本是一方名捕，奈何受人冤枉入狱，为保家人性命不得已委身于锦衣卫旗下，满面惆怅。", },
          { jh: "京城", loc: "王府后街", name: "锦衣卫", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e;e;e", desc: "本是朝廷卫士，却已受东厂所辖。", },
          { jh: "京城", loc: "王府后街", name: "韦子壮", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e;e;e;e", desc: "武当弟子，现为侯府卫士统领，功力深厚。", },
          { jh: "京城", loc: "王府后街", name: "王府卫士", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e;e;e;e", desc: "善穆侯府的卫士，双目炯炯有神，腰挂长刀。", },
          { jh: "京城", loc: "善穆侯府", name: "王府卫士", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e;e;e;e;n", desc: "善穆侯府的卫士，双目炯炯有神，腰挂长刀。", },
          { jh: "京城", loc: "善穆侯府", name: "风流司郎中", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e;e;e;e;n", desc: "俊俏无比的当朝司郎中，风流倜傥，当朝大学士之子，也是少林天绝神僧关门弟子。", },
          { jh: "京城", loc: "永安大街", name: "学士", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w", desc: "一个在六部任职的学士，虽著便服，但气度不凡。", },
          { jh: "京城", loc: "永安大街", name: "书生", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w", desc: "一个斯文的书生，穿著有些寒酸。", },
          { jh: "京城", loc: "白虎赌坊", name: "荷官", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w;s", desc: "白虎赌坊的荷官，身姿曼妙，烟视媚行。" },
          { jh: "京城", loc: "白虎赌坊", name: "胡媚儿", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w;s", desc: "绝美无比的性感尤物，她虽使毒厉害，但却是一个极重情义之人。她认死理，为江充办事，便是一心一意，纵然江充势败，也是全力为其寻找玉玺。后来遇见卢云，两人日久相处，产生爱意，更是愿意为了卢云牺牲自己的一切。后来在与卢云返回自己家乡的途中遭到“镇国铁卫”的追杀迫害，不得已成为“镇国铁卫”的一员，加入了“客栈”。", },
          { jh: "京城", loc: "白虎赌坊", name: "下注血战", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w;s", desc: "" },
          { jh: "京城", loc: "青龙赌坊", name: "打手", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w;n", desc: "赌坊打手，满脸横肉，手持大锤。" },
          { jh: "京城", loc: "青龙赌坊", name: "藏六福", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w;n", desc: "青龙赌坊的老板，五十岁上下，腰间系著一块绝世玉璧，眼睛里闪著狡黠的光芒。", },
          { jh: "京城", loc: "青龙赌坊", name: "兽雀游戏", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w;n", desc: "" },
          { jh: "京城", loc: "地下格斗场", name: "琼芳", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w;n", desc: "她生得明眸皓齿，桃笑李妍，脸颊上带著两个深深的酒涡，看来明媚可人，年岁虽小，但已是个十足十的美人胚子。琼武川的孙女，紫云轩少阁主，自幼失怙，被琼国丈当男子养大，倍加宠爱。却不知为何在这地下格斗场。", },
          { jh: "京城", loc: "地下格斗场", name: "看场打手", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w;n", desc: "地下格斗场的看场打手，面目冷漠。", },
          { jh: "京城", loc: "永安大街", name: "杂货贩子", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w;w", desc: "一个卖杂货的贩子，你也许可以看看需要些什么。", },
          { jh: "京城", loc: "永安大街", name: "苦力", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w;w;w", desc: "进城找活路的苦力，衣著随便，满身灰尘。" },
          { jh: "京城", loc: "京城驿站", name: "掌柜", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w;w;w;s", desc: "驿站的大掌柜，眼神深邃。", },
          { jh: "京城", loc: "永安大街", name: "醉汉", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w;w;w;w", desc: "赌坊里出来的醉汉，嘴里嘟嘟囔囔些什么，也许是一些赌坊的秘密。", },
          { jh: "京城", loc: "永安大街", name: "游客", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w;w;w;w;w", desc: "来京城游玩的外地人，对大城市的繁华目不暇接，满眼都是惊喜的神色。", },
          { jh: "京城", loc: "广和楼", name: "顾倩兮", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w;w;w;w;w;n", desc: "出生扬州，其父乃景泰朝兵部尚书顾嗣源，未婚夫是景泰朝状元卢云，后因为卢云掉入水瀑音讯全无，一边抚养卢云留下的小婴儿杨神秀，一边为父亲被正统皇帝下狱的事而四处奔波，后因其父在狱中自杀，为继承父亲的志向开办书林斋，批判朝政，与正统皇帝针锋相对。后嫁给佛国的创始人杨肃观。正统十年，再遇卢云。是典型的学识渊博，见识不凡的奇女子，当之无愧的扬州第一美女。", },
          { jh: "京城", loc: "永定大街", name: "武将", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;s", desc: "京城武将，虎背熊腰，胆大心细。", },
          { jh: "京城", loc: "永定大街", name: "捕快", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;s", desc: "京城的捕快，自是与外地的不同。" },
          { jh: "京城", loc: "入城大道", name: "饥民", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;s;s;s", desc: "天下灾荒四起，流民失所，饥肠辘辘，只能上京城来乞食。", },
          { jh: "京城", loc: "德胜门", name: "城门官兵", way: "rank go 194;s;se;se;se;e;n;n;ne;e", desc: "镇守京城的官兵，银盔银甲，威风凛凛。" },
          { jh: "京城", loc: "安定门", name: "城门官兵", way: "rank go 194;s;se;se;se;e;n;n;ne;e;e;e", desc: "镇守京城的官兵，银盔银甲，威风凛凛。", },
          { jh: "京城", loc: "玄武门", name: "城门官兵", way: "rank go 194;s;se;se;se;e;n;n;ne;e;e;e;s;s;s", desc: "镇守京城的官兵，银盔银甲，威风凛凛。", },
          { jh: "京城", loc: "东直门", name: "城门官兵", way: "rank go 194;s;se;se;se;e;n;n;ne;e;e;e;e;e;e;se;s;s", desc: "镇守京城的官兵，银盔银甲，威风凛凛。", },
          { jh: "京城", loc: "通天塔", name: "通天塔", way: "rank go 194;s;se;se;se;e;n;n;ne;e;e;e;e;e;e;se;s;s;e;e;e;s;s", desc: "" },
          { jh: "越王剑宫", loc: "欧余山路", name: "樵夫", way: "jh 50", desc: "一个砍柴为生的樵夫。" },
          { jh: "越王剑宫", loc: "欧余山路", name: "毒蛇", way: "jh 50;ne", desc: "一条外表看起来十分花哨的蛇，毒性巨强。" },
          { jh: "越王剑宫", loc: "欧余山路", name: "欧余刀客", way: "jh 50;ne;ne", desc: "欧余山中隐藏的刀客，武功深不可测。" },
          { jh: "越王剑宫", loc: "欧余山路", name: "山狼", way: "jh 50;ne;ne;n;n", desc: "欧余山中的霸主，山狼，比一般的野狼大一倍有余。" },
          { jh: "越王剑宫", loc: "欧余山路", name: "山狼王", way: "jh 50;ne;ne;n;n", desc: "欧余山中的霸主，山狼，比一般的野狼大一倍有余。" },
          { jh: "越王剑宫", loc: "欧余山路", name: "西施", way: "jh 50;ne;ne;n;n", desc: "施夷光，天下第一美女，世人称为西施，尊称其“西子“。越国苎萝村浣纱女。她天生丽质、秀媚出众。", },
          { jh: "越王剑宫", loc: "欧余山路", name: "范蠡", way: "jh 50;ne;ne;n;n;n;ne", desc: "越国当朝大夫，越王倚重的重臣。" },
          { jh: "越王剑宫", loc: "欧余山路", name: "欧余刀客", way: "jh 50;ne;ne;n;n;n;ne", desc: "欧余山中隐藏的刀客，武功深不可测。" },
          { jh: "越王剑宫", loc: "欧余山路", name: "吴国暗探", way: "jh 50;ne;ne;n;n;n;ne", desc: "来自吴国的暗探，隐藏在山中，负责刺探剑宫内的消息。", },
          { jh: "越王剑宫", loc: "欧余山路", name: "老奶奶", way: "jh 50;ne;ne;n;n;n;ne;ne;ne", desc: "一个拄著拐杖的老奶奶，似是在等著孙女回家。" },
          { jh: "越王剑宫", loc: "竹林", name: "青竹巨蟒", way: "jh 50;ne;ne;n;n;n;ne;ne;ne;n", desc: "青竹林中的巨型蟒蛇，通体翠绿，隐藏在竹林中，等待猎物自投罗网。" },
          { jh: "越王剑宫", loc: "竹林", name: "青竹巨蟒", way: "jh 50;ne;ne;n;n;n;ne;ne;ne;n;n", desc: "青竹林中的巨型蟒蛇，通体翠绿，隐藏在竹林中，等待猎物自投罗网。", },
          { jh: "越王剑宫", loc: "竹林", name: "猎人", way: "jh 50;ne;ne;n;n;n;ne;ne;ne;n;n", desc: "山中的猎户，正在寻觅今天的收获。" },
          { jh: "越王剑宫", loc: "竹林", name: "白猿", way: "jh 50;ne;ne;n;n;n;ne;ne;ne;n;n;n", desc: "一头巨大的白猿，若是见生人来了，一声长啸，跃上树梢，接连几个纵跃，已窜出数十丈外，但听得啸声凄厉，渐渐远去，山谷间猿啸回声，良久不绝。", },
          { jh: "越王剑宫", loc: "欧余山路", name: "白猿", way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se", desc: "一头巨大的白猿，若是见生人来了，一声长啸，跃上树梢，接连几个纵跃，已窜出数十丈外，但听得啸声凄厉，渐渐远去，山谷间猿啸回声，良久不绝。", },
          { jh: "越王剑宫", loc: "欧余山路", name: "采药人", way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se", desc: "一个山中的采药人，年纪近五十了。" },
          { jh: "越王剑宫", loc: "欧余山路", name: "锦衣剑士", way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se", desc: "越王剑宫的精英剑士，身佩长剑。" },
          { jh: "越王剑宫", loc: "欧余山路", name: "青衣剑士", way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se", desc: "来自吴国的精英剑士，极度高傲自负。", },
          { jh: "越王剑宫", loc: "欧余山路", name: "青竹巨蟒", way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s", desc: "青竹林中的巨型蟒蛇，通体翠绿，隐藏在竹林中，等待猎物自投罗网。", },
          { jh: "越王剑宫", loc: "欧余山路", name: "牧羊少女", way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s", desc: "这少女一张瓜子脸，睫长眼大，皮肤白晰，容貌甚是秀丽，身材苗条，弱质纤纤，手持一根长竹竿。", },
          { jh: "越王剑宫", loc: "欧余山路", name: "山羊", way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s", desc: "雪白的羊毛，在少女的驯服下，乖巧在吃草。" },
          { jh: "越王剑宫", loc: "欧余山路", name: "采药少女", way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s", desc: "在山中采药户的小女孩，只有十二三岁，却已能熟练地行走山间，采集药材。", },
          { jh: "越王剑宫", loc: "欧余山路", name: "锦衣剑士", way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s", desc: "越王剑宫的精英剑士，身佩长剑。", },
          { jh: "越王剑宫", loc: "欧亭台", name: "锦衣剑士", way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;sw;sw;sw", desc: "越王剑宫的精英剑士，身佩长剑。", },
          { jh: "越王剑宫", loc: "欧亭台", name: "青衣剑士", way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;sw;sw;sw", desc: "来自吴国的精英剑士，极度高傲自负。", },
          { jh: "越王剑宫", loc: "欧亭台", name: "风胡子", way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;sw;sw;sw", desc: "楚国铸剑师，身著玄色短衫，欧冶子的二位弟子之一。", },
          { jh: "越王剑宫", loc: "欧亭台", name: "采药少女", way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;sw;sw;sw", desc: "在山中采药户的小女孩，只有十二三岁，却已能熟练地行走山间，采集药材。", },
          { jh: "越王剑宫", loc: "大夫第", name: "山狼", way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;e", desc: "欧余山中的霸主，山狼，比一般的野狼大一倍有余", },
          { jh: "越王剑宫", loc: "大夫第", name: "锦衣剑士", way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;e", desc: "越王剑宫的精英剑士，身佩长剑。", },
          { jh: "越王剑宫", loc: "大夫第", name: "范蠡", way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;e", desc: "越国当朝大夫，越王倚重的重臣。" },
          { jh: "越王剑宫", loc: "大夫第", name: "青衣剑士", way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;e", desc: "来自吴国的精英剑士，极度高傲自负。", },
          { jh: "越王剑宫", loc: "大夫第", name: "风胡子", way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;e", desc: "楚国铸剑师，身著玄色短衫，欧冶子的二位弟子之一。", },
          { jh: "越王剑宫", loc: "大夫第", name: "西施", way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;e", desc: "施夷光，天下第一美女，世人称为西施，尊称其“西子“。越国苎萝村浣纱女。她天生丽质、秀媚出众。", },
          { jh: "越王剑宫", loc: "剑宫大门", name: "锦衣剑士", way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;n;n", desc: "越王剑宫的精英剑士，身佩长剑。", },
          { jh: "越王剑宫", loc: "论剑石台", name: "青衣剑士", way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;n;n;n;n", desc: "来自吴国的精英剑士，极度高傲自负。", },
          { jh: "越王剑宫", loc: "论剑石台", name: "青衣剑士-御", way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;n;n;n;n;n", desc: "来自吴国的精英剑士，极度高傲自负。", },
          { jh: "越王剑宫", loc: "论剑石台", name: "青衣剑士-极", way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;n;n;n;n;n;n", desc: "来自吴国的精英剑士，极度高傲自负。", },
          { jh: "越王剑宫", loc: "藏虚殿", name: "越王", way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;n;n;n;n;n;n;n", desc: "越王身披锦袍，形貌拙异，头颈甚长，嘴尖如鸟，对你微微一笑，你却觉得毛骨悚然。", },
          { jh: "越王剑宫", loc: "藏虚殿", name: "金衣剑士", way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;n;n;n;n;n;n;n", desc: "越国最顶尖的剑士，身著金衣，手持长剑。", },
          { jh: "越王剑宫", loc: "藏虚殿", name: "文种", way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;n;n;n;n;n;n;n", desc: "春秋末期著名的谋略家。越王勾践的谋臣，和范蠡一起为勾践最终打败吴王夫差立下赫赫功劳。", },
          { jh: "越王剑宫", loc: "铸剑台", name: "铸剑师", way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;n;n;n;n;n;n;n;n", desc: "一个风程仆仆的侠客。", },
          { jh: "越王剑宫", loc: "铸剑台", name: "薛烛", way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;n;n;n;n;n;n;n;n", desc: "二十多岁的年轻人，是欧冶子的二位亲传弟子之一。", },
          { jh: "江陵", loc: "长平街", name: "茶叶贩子", way: "jh 51", desc: "来自外地的茶叶贩子，来此收购也贩卖茶叶。" },
          { jh: "江陵", loc: "长平街", name: "书生", way: "jh 51;n", desc: "一个年纪轻轻的读书人，拿著书本，摇头晃脑。" },
          { jh: "江陵", loc: "长平街", name: "乞丐", way: "jh 51;n;n", desc: "一个衣衫褴褛的乞丐，口中嘟囔著一些模糊的语句。" },
          { jh: "江陵", loc: "江陵米店", name: "米三江", way: "jh 51;n;n;w", desc: "一个青衣小帽的中年商人，是米店的大掌柜。" },
          { jh: "江陵", loc: "江陵米店", name: "米店伙计", way: "jh 51;n;n;w", desc: "米店的小伙计，正忙的不可开交。" },
          { jh: "江陵", loc: "江陵米店", name: "妇人", way: "jh 51;n;n;w", desc: "前来买米的妇人，手里拿著米袋。" },
          { jh: "江陵", loc: "小倩花店", name: "花小倩", way: "jh 51;n;n;e", desc: "一个二十出头，笑容动人的少女，有人说她是城中最美丽的少女，每天都会收到不少求爱的信笺呢。", },
          { jh: "江陵", loc: "长平街", name: "巡城府兵", way: "jh 51;n;n;n;n", desc: "江陵总兵府的巡城士兵，手持长矛，腰别钢刀。" },
          { jh: "江陵", loc: "长平街", name: "巡城参将", way: "jh 51;n;n;n;n", desc: "江陵巡城参将，身材高大，脚步沉稳。" },
          { jh: "江陵", loc: "飞鸿客栈", name: "客栈小二", way: "jh 51;n;n;n;n;w", desc: "手拿酒壶菜碟，脚步如飞，忙得不亦乐乎，抬头看你一眼，飞快地给你指了个座位。", },
          { jh: "江陵", loc: "飞鸿客栈", name: "酒保", way: "jh 51;n;n;n;n;w;w", desc: "客栈的小酒保，年纪大约十来岁而已。" },
          { jh: "江陵", loc: "飞鸿客栈", name: "江小酒", way: "jh 51;n;n;n;n;w;w;n", desc: "客栈老板的女儿，一笑起来脸上就有两个酒窝。" },
          { jh: "江陵", loc: "后庭", name: "江老板", way: "jh 51;n;n;n;n;w;w;n;n", desc: "客栈的老板，身材不高，却自有一番气度。" },
          { jh: "江陵", loc: "落日街", name: "苦力", way: "jh 51;n;n;n;n;e", desc: "一个衣衫褴褛的苦力，正在街角坐著等活儿上门。" },
          { jh: "江陵", loc: "落日街", name: "驿使", way: "jh 51;n;n;n;n;e;e;e", desc: "一个远方驿站来的信使，看起来颇为悠闲，应是没有公务在身。" },
          { jh: "江陵", loc: "落日街", name: "江陵府卫", way: "jh 51;n;n;n;n;e;e;e;e", desc: "江陵总兵府的卫士，身披软甲，腰胯长刀。" },
          { jh: "江陵", loc: "江陵府", name: "参将", way: "jh 51;n;n;n;n;e;e;e;e;s", desc: "江陵总兵府的参将，都是萧劲手下最得力的干将。" },
          { jh: "江陵", loc: "江陵府", name: "萧劲", way: "jh 51;n;n;n;n;e;e;e;e;s", desc: "江陵府总兵，统管两湖地界，手握数万大军。" },
          { jh: "江陵", loc: "演兵场", name: "江陵府兵", way: "jh 51;n;n;n;n;e;e;e;e;s;s", desc: "江陵府统御下的士兵，一举一动都有干练之风，看起来颇为训练得法。" },
          { jh: "江陵", loc: "霹雳门", name: "雷动山", way: "jh 51;n;n;n;n;n;n;w", desc: "霹雳门两湖分舵的舵主，太阳穴高高鼓起，显然是有极深厚的内功。", },
          { jh: "江陵", loc: "药材店", name: "水掌柜", way: "jh 51;n;n;n;n;n;n;n;nw;n", desc: "江陵府远近几百里最出名的神医，对药材和医理的理解出神入化。", },
          { jh: "江陵", loc: "药材店", name: "王铁柱", way: "jh 51;n;n;n;n;n;n;n;nw;n", desc: "一个前来求药的庄稼汉，看起来颇为著急。" },
          { jh: "江陵", loc: "北小街", name: "趟子手", way: "jh 51;n;n;n;n;e;e;e;e;n;n", desc: "镖局的趟子手，是镖局最低级的打手。" },
          { jh: "江陵", loc: "江陵镖局", name: "萧长河", way: "jh 51;n;n;n;n;e;e;e;e;n;n;w", desc: "江陵镖局总镖头，一身长衫，手握一对钢珠，颇有威不可犯之风。", },
          { jh: "江陵", loc: "江陵镖局", name: "分身", way: "jh 51;n;n;n;n;e;e;e;e;n;n;w", desc: "萧长河的分身。" },
          { jh: "江陵", loc: "马厩", name: "周长老", way: "jh 51;n;n;n;n;e;e;e;e;n;n;w;w", desc: "萧长河相交三十多年的生死之交，也是镖局日常事务最主要的负责人。", },
          { jh: "江陵", loc: "马厩", name: "脱不花马", way: "jh 51;n;n;n;n;e;e;e;e;n;n;w;w", desc: "大月氏远道而来的最好的宝马，可日行八百。" },
          { jh: "江陵", loc: "马厩", name: "分身", way: "jh 51;n;n;n;n;e;e;e;e;n;n;w;w", desc: "周长老的分身。" },
          { jh: "江陵", loc: "小鱼小食", name: "渔老", way: "jh 51;n;n;n;n;e;e;e;e;n;n;e", desc: "念过半百的老人，精神很好，手中拿著一张渔网在仔细修复。", },
          { jh: "江陵", loc: "小鱼小食", name: "余小鱼", way: "jh 51;n;n;n;n;e;e;e;e;n;n;e", desc: "豆蔻年华的小女孩，长得颇为清秀，正在熟练的整理著小食店，一副有条不紊成竹在胸的样子。", },
          { jh: "江陵", loc: "北门", name: "城门守卫", way: "jh 51;n;n;n;n;e;e;e;e;n;n;n;n", desc: "江陵城的守卫士兵，铁剑铁甲。" },
          { jh: "江陵", loc: "江边路", name: "截道恶匪", way: "jh 51;n;n;n;n;e;e;e;e;n;n;n;n;nw;n", desc: "截道的恶匪，正恶狠狠地看著你。" },
          { jh: "江陵", loc: "码头", name: "漕帮好手", way: "jh 51;n;n;n;n;e;e;e;e;n;n;n;n;nw;n;n;n", desc: "漕帮的好手，个个都是浪里白条。" },
          { jh: "江陵", loc: "江陵水道", name: "扬子鳄", way: "jh 51;n;n;n;n;e;e;e;e;n;n;n;n;nw;n;n;n;e;e", desc: "凶狠的鳄鱼，正不怀好意地盯著你。" },
          { jh: "江陵", loc: "水道暗洞", name: "金冠巨蟒", way: "jh 51;n;n;n;n;e;e;e;e;n;n;n;n;nw;n;n;n;e;e;e;e;e;se;event_1_1065178", desc: "一条通体火红的巨蟒，头部有金色花纹。", },
          { jh: "江陵", loc: "葬剑谷", name: "亡魂分身", way: "jh 51;n;n;n;n;e;e;e;e;n;n;n;n;nw;n;n;n;e;e;e;e;e;se;event_1_1065178;se;se", desc: "一个风程仆仆的侠客。" },
          { jh: "江陵", loc: "葬剑谷", name: "剑之亡魂", way: "jh 51;n;n;n;n;e;e;e;e;n;n;n;n;nw;n;n;n;e;e;e;e;e;se;event_1_1065178;se;se", desc: "一柄无主之剑。", },
          { jh: "江陵", loc: "落日街", name: "醉汉", way: "jh 51;n;n;n;n;e;e;e;e;e;e", desc: "一个醉醺醺的男人，嘴里不知道嘟囔著什么。" },
          { jh: "江陵", loc: "南小街", name: "黑衣人", way: "jh 51;n;n;n;n;e;e;e;e;e;e;s", desc: "一个鬼鬼祟祟的黑衣人，腰间似乎藏著兵器。" },
          { jh: "江陵", loc: "南门", name: "城门守卫", way: "jh 51;n;n;n;n;e;e;e;e;e;e;s;s;s", desc: "江陵城的守卫士兵，铁剑铁甲。" },
          { jh: "江陵", loc: "城外泥路", name: "癞蛤蟆", way: "jh 51;n;n;n;n;e;e;e;e;e;e;s;s;s;se;se", desc: "趴在城外泥路两旁的沼泽地，正呱呱呱地叫著，真让人心烦。", },
          { jh: "江陵", loc: "无双窑", name: "霍无双", way: "jh 51;n;n;n;n;e;e;e;e;e;e;s;s;s;se;se;e;e;e", desc: "两湖最好的手艺人，从他手里出品的瓷器，白若瑞雪，清透如浮云。", },
          { jh: "江陵", loc: "落日街", name: "金莲", way: "jh 51;n;n;n;n;e;e;e;e;e;e;e;e", desc: "玉泉酒坊老板的相好，眉目流媚，身姿诱人。" },
          { jh: "江陵", loc: "深巷", name: "邋遢男子", way: "jh 51;n;n;n;n;e;e;e;e;e;e;e;e;se", desc: "一个醉醺醺的邋遢男子，正在对墙小便，你只想赶紧捂著鼻子走开。" },
          { jh: "江陵", loc: "玉泉酒坊", name: "酒坊伙计", way: "jh 51;n;n;n;n;e;e;e;e;e;e;e;e;se;e;e", desc: "酒坊的小伙计，忙得不可开交，瘦骨嶙峋。", },
          { jh: "江陵", loc: "玉泉酒坊", name: "九叔", way: "jh 51;n;n;n;n;e;e;e;e;e;e;e;e;se;e;e", desc: "酒坊现在的老板，身上一派珠光宝气，却有人说他是盗了哥哥的产业。", },
          { jh: "天龙寺", loc: "苍山山脚", name: "小女童", way: "jh 52", desc: "一个金钗之年的小女孩。" },
          { jh: "天龙寺", loc: "苍山山脚", name: "小男童", way: "jh 52", desc: "一个垂髻之年的小男孩。" },
          { jh: "天龙寺", loc: "苍山山路", name: "羚牛", way: "jh 52;ne;ne;", desc: "苍山特有，体形粗大，雌雄均具短角，分布在苍山麓密林地区。" },
          { jh: "天龙寺", loc: "苍山山路", name: "点苍派弟子", way: "jh 52;ne;ne;n;", desc: "南诏「七大门派」之一，点苍山明水秀，四季如春，门下弟子们从小拜师，在这环境中生长，大多数都是温良如玉的君子，对名利都看得很淡。", },
          { jh: "天龙寺", loc: "苍山山路", name: "浮尘子", way: "jh 52;ne;ne;n;n;", desc: "点苍派三大高手之一，仙风道骨。" },
          { jh: "天龙寺", loc: "苍山山路", name: "浮尘子分身", way: "jh 52;ne;ne;n;n;", desc: "浮尘子分身，咄咄逼人！" },
          { jh: "天龙寺", loc: "苍山山路", name: "云豹", way: "jh 52;ne;ne;n;n;n;nw;", desc: "苍山云豹有著粗短而矫健的四肢，几乎与身体一样长而且很粗的尾巴。头部略圆，口鼻突出，爪子非常大。体色金黄色，并覆盖有大块的深色云状斑纹，因此称作“云豹”。", },
          { jh: "天龙寺", loc: "苍山山路", name: "雯姑", way: "jh 52;ne;ne;n;n;n;nw;nw;", desc: "容貌国色天香，即使是娇艳的花朵见了也要自愧不如。" },
          { jh: "天龙寺", loc: "苍山山路", name: "霞郎", way: "jh 52;ne;ne;n;n;n;nw;nw;", desc: "忠实善良，吃苦耐劳，心灵手巧，而且他的歌喉也美妙无比，歌声像百灵一样的婉转，像夜莺一般的悠扬。每当他唱起歌来的时候，山上的百鸟都会安静下来，默默地倾听他那美妙动人的歌声。", },
          { jh: "天龙寺", loc: "苍山山路", name: "游客", way: "jh 52;ne;ne;n;n;n;nw;nw;n;n;", desc: "外地来苍山的游客，一副陶醉于美景之态。" },
          { jh: "天龙寺", loc: "苍山山路", name: "南诏公主", way: "jh 52;ne;ne;n;n;n;ne;ne;", desc: "她是身世扑搠的郑氏南诏公主，从小就被送去水灵山险的苗疆由苗人抚养;她极擅苗人盅毒，并以此为趣。", },
          { jh: "天龙寺", loc: "苍山山路", name: "凌霄子", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e", desc: "点苍剑派三大高手之一，揹负古剑，手持拂尘。" },
          { jh: "天龙寺", loc: "苍山山路", name: "凌霄子分身", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e", desc: "一个风程仆仆的侠客。" },
          { jh: "天龙寺", loc: "苍山山路", name: "点苍派弟子", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;n;", desc: "南诏「七大门派」之一，点苍山明水秀，四季如春，门下弟子们从小拜师，在这环境中生长，大多数都是温良如玉的君子，对名利都看得很淡。", },
          { jh: "天龙寺", loc: "青石长阶", name: "枯叶蝶", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;n;n;n;", desc: "当它阖起两张翅膀的时候，像生长在树枝上的一张干枯了的树叶。谁也不注意它，谁也不会瞧它一眼。", },
          { jh: "天龙寺", loc: "青石长阶", name: "双尾褐凤蝶", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;n;n;n;n;w", desc: "前翅黑色有光泽，有淡黄色细横带自前缘直达中脉，后翅狭长黑色，外缘呈扇形。", },
          { jh: "天龙寺", loc: "青石长阶", name: "金斑啄凤蝶", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;n;n;n;n;w;nw;nw;n;", desc: "南疆八大名贵蝴蝶之首，大理当地人称之为“梦幻蝴蝶”", },
          { jh: "天龙寺", loc: "青石长阶", name: "不孤子", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;n;n;n;n;w;nw;nw;n;n;", desc: "一个年近五旬的剑客，身世极为神秘，内力修为看起来极为深厚。", },
          { jh: "天龙寺", loc: "青石长阶", name: "不孤子分身", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;n;n;n;n;w;nw;nw;n;n;", desc: "哪怕是分身也爆发出强劲的内功气场。" },
          { jh: "天龙寺", loc: "青石长阶", name: "玫瑰眼蝶", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;n;n;n;n;n;", desc: "全翅透明，薄若蝉翼，后翅膀为分散的玫瑰色，眼斑瞳仁上会反光。", },
          { jh: "天龙寺", loc: "牟尼楼", name: "打坐老僧", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;n;n;n;n;n;event_1_15863945;", desc: "一个打坐的老僧人，双目紧闭，长眉下垂。", },
          { jh: "天龙寺", loc: "青石长阶", name: "谢逸紫", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;n;n;n;n;n;n;n;", desc: "苍山七剑之一，是云南最出众的女剑客，相貌出众，身姿动人。", },
          { jh: "天龙寺", loc: "崇圣阁", name: "龙纹寺僧", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;n;n;n;n;n;n;n;n;", desc: "天龙寺的老寺僧，前臂有飞龙纹身，地位较一般寺僧更高。", },
          { jh: "天龙寺", loc: "崇圣阁", name: "天龙方丈", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;n;n;n;n;n;n;n;n;", desc: "天龙寺的方丈主持，白发白眉，面目慈祥。", },
          { jh: "天龙寺", loc: "险恶山路", name: "白开心", way: "rank go 237;nw;n;n;n;n;n;n;nw;nw;n", desc: "十大恶人之一，一个喜欢捣蛋的聪明人。", },
          { jh: "天龙寺", loc: "险恶山路", name: "剧毒蟒蛇", way: "rank go 237;nw;n;n;n;n;n;n;nw", desc: "恶人谷内的剧毒蟒蛇，见人就会攻击。", },
          { jh: "天龙寺", loc: "村口", name: "屠娇娇", way: "rank go 237;nw;n;n;n;n;n;n", desc: "十大恶人之一，易容之术天下无双。她的武功并不能算高超，但却是十大恶人中最为智慧的，她是所有计划的策动者，可说是算无遗策。", },
          { jh: "天龙寺", loc: "村口", name: "李大嘴", way: "rank go 237;nw;n;n;n;n;n;n", desc: "十大恶人之一，却是一个不折不扣的好人。", },
          { jh: "天龙寺", loc: "土路", name: "铁战", way: "rank go 237;nw;n;n;n;n", desc: "十大恶人之一，对武学的痴迷到了忘我的境界，而且所研究的武功都让人大跌眼镜。", },
          { jh: "天龙寺", loc: "猛兽屋", name: "杜杀", way: "rank go 237;nw;n;n;n;n;w", desc: "大恶人之一，面白如雪，身材清瘦。性格说一不二，冷酷胜雪。武功位列十大恶人之首，由于残忍嗜杀，江湖送名曰——「血手」。", },
          { jh: "天龙寺", loc: "大槐树", name: "轩辕三光", way: "rank go 237;nw;n;n;e", desc: "只要有好玩的事情，老赌鬼就会出现。", },
          { jh: "天龙寺", loc: "大槐树", name: "哈哈儿", way: "rank go 237;nw;n;n;e", desc: "最可怕的不是明眼的恶人，而是明里笑脸相迎暗地里磨刀霍霍的笑面虎。十大恶人之一的「笑里藏刀小弥陀」。", },
          { jh: "天龙寺", loc: "土路", name: "恶虎", way: "rank go 237;nw;n", desc: "恶人谷内的凶兽，赤额金睛。", },
          { jh: "天龙寺", loc: "南山小院", name: "萧咪咪", way: "rank go 237;nw;n;w", desc: "十大恶人之一，美艳无双，和他在一起的男人都不会有好下场。", },
          { jh: "天龙寺", loc: "土路", name: "欧阳丁", way: "rank go 237;nw", desc: "十大恶人中唯一的两兄弟，拥有著富可敌国的家财却喜欢偷偷摸摸。", },
          { jh: "天龙寺", loc: "土路", name: "欧阳当", way: "rank go 237;nw", desc: "十大恶人中唯一的两兄弟，拥有著富可敌国的家财却喜欢偷偷摸摸。", },
          { jh: "天龙寺", loc: "大鹳淜洲", name: "柴绍", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;", desc: "出身于将门，自幼便矫捷有勇力，抑强扶弱，闻名天下。", },
          { jh: "天龙寺", loc: "大鹳淜洲", name: "李秀宁", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;", desc: "高祖李渊之女，太宗之妹，自幼习武，且精通琴棋书画，有著举世无双的外交才能。", },
          { jh: "天龙寺", loc: "天龙塔林", name: "小沙弥", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;w;sw;s;s", desc: "打扫塔林的小沙弥，身著灰色僧衣。", },
          { jh: "天龙寺", loc: "天龙塔林", name: "护塔僧兵", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;w;sw;s;s;sw;sw;", desc: "塔林的护卫僧兵，手持戒棍，一丝不苟。", },
          { jh: "天龙寺", loc: "天龙塔林", name: "护塔僧兵", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;w;sw;s;s;sw;sw;sw;se;", desc: "塔林的护卫僧兵，手持戒棍，一丝不苟。", },
          { jh: "天龙寺", loc: "天龙塔林", name: "小沙弥", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;w;sw;s;s;sw;sw;sw;se;se;se;", desc: "打扫塔林的小沙弥，身著灰色僧衣。", },
          { jh: "天龙寺", loc: "桃溪", name: "婠婠", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;e;ne;ne;n;n;n;ne;ne;nw;", desc: "魔门邪派阴癸派的继承人，为武功超强的盖代魔女，虽年纪轻轻，有著美丽的容颜，却是阴癸派有史以来最强传人。", },
          { jh: "天龙寺", loc: "慈航静斋", name: "周老叹", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;e;ne;ne;n;n;n;ne;ne;nw;ne;n;", desc: "前任魔门第一高手，邪帝向雨田的四大弟子之一。", },
          { jh: "天龙寺", loc: "慈航静斋", name: "尤鸟倦", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;e;ne;ne;n;n;n;ne;ne;nw;ne;n;", desc: "前任魔门第一高手，邪帝向雨田的四大弟子之一。", },
          { jh: "天龙寺", loc: "慈航静斋", name: "丁九重", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;e;ne;ne;n;n;n;ne;ne;nw;ne;n;", desc: "前任魔门第一高手，邪帝向雨田的四大弟子之一。", },
          { jh: "天龙寺", loc: "慈航静斋", name: "金环真", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;e;ne;ne;n;n;n;ne;ne;nw;ne;n;", desc: "前任魔门第一高手，邪帝向雨田的四大弟子之一。", },
          { jh: "天龙寺", loc: "静云小径", name: "符瑶红", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;e;ne;ne;n;n;n;ne;ne;nw;ne;n;n;n;e;ne;", desc: "阴癸派第一高手「血手」厉工的师妹，擅长男女欢合之术。", },
          { jh: "天龙寺", loc: "藏典塔", name: "杨虚彦", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;e;ne;ne;n;n;n;ne;ne;nw;ne;n;n;n;n;n;n;", desc: "隋文帝杨坚之孙，太子杨勇之子，隋炀帝杨广即位之后被「邪王」所救，由于资质好被其收为徒，并答应为其报仇复国。他不过是石之轩阴暗面的投影，石之轩对他的重用象征他邪恶的一面占上风，对侯希白的疼爱象征善良面的回归。", },
          { jh: "天龙寺", loc: "赏雨亭", name: "侯希白", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;e;ne;ne;n;n;n;ne;ne;nw;ne;n;n;n;n;n;n;", desc: "侯希白琴棋书画、文韬武略样样精通，爱流连青楼，自诩为护花使者，绰号乃「多情公子」。倾慕慈航静斋传人师妃暄，两人曾共游三峡。虽然周旋于众美之间，却绝非好色风流之徒。", },
          { jh: "天龙寺", loc: "桃溪", name: "『闲钓』", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;e;ne;ne;n;n;n;ne;", desc: "日常", },
          { jh: "天龙寺", loc: "后山茶园", name: "『采茶』", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;e;ne;ne;n;n;n;ne;ne;nw;ne;n;n;n;e;ne;e;ne;ne;", desc: "日常", },
        { jh: "西夏", loc: "韦州", name: "李继迁", way: "jh 53;#4 nw;", desc: "西夏奠基者，幼年时即以勇敢果断，以“擅骑射，饶智数”而闻名乡里，继迁以勇敢、尚武知名。" },
            { jh: "西夏", loc: "韦州", name: "大夏神箭", way: "jh 53;#4 nw;", desc: "暴雨飞箭兵有着超强的压制能力和杀伤力。" },
            { jh: "西夏", loc: "城外荒野", name: "宋军将领", way: "jh 53;#4 nw;s;", desc: "统领宋军部队的主帅。" },
            { jh: "西夏", loc: "城外荒野", name: "宋军", way: "jh 53;#4 nw;s;", desc: "宋朝军队，因翻越黄土高原入侵西夏则消耗的大量粮草以及精力" },
            { jh: "西夏", loc: "西平府", name: "李继冲", way: "jh 53;#4 nw;n;nw;ne;#3 n;", desc: "西夏皇族，定难军节度副使，绥州刺史兼右司马指挥使、行军司马。后被契丹封为西平王。" },
            { jh: "西夏", loc: "西平府", name: "金锤虎将", way: "jh 53;#4 nw;n;nw;ne;#3 n;", desc: "只是一个威风凛凛的锤将，夏皇麾下万里挑一的近卫精英。" },
            { jh: "西夏", loc: "西平府", name: "西夏弩手", way: "jh 53;#4 nw;n;nw;ne;#3 n;", desc: "装备精良劲弩的射手。" },
            { jh: "西夏", loc: "兴庆府", name: "野利旺荣", way: "jh 53;#4 nw;n;nw;ne;#3 n;;#4 nw;n;e;e;", desc: "西夏大将军，与兄野利遇乞分统左、右厢军，在对宋军作战中，多参与军机。曾与野利遇乞俘获宋将刘平、石元孙等。" },
            { jh: "西夏", loc: "兴庆府", name: "铁鹞子", way: "jh 53;#4 nw;n;nw;ne;#3 n;;#4 nw;n;e;e;", desc: "身披铠甲的重骑兵，冲锋时犹如蛮牛，具有极大的冲击力和破坏力，步兵阵营的噩梦。" },
            { jh: "西夏", loc: "兴庆府", name: "野利遇乞", way: "jh 53;#4 nw;n;nw;ne;#3 n;;#4 nw;n;e;e;", desc: "西夏大将，党项族野利部人。多权谋，善用兵。所率领的士兵素以善战著称，与兄野利旺荣分统左、右厢军，让宋军心惊胆战，曾用过围点打援之策多次大败宋军。" },
            { jh: "西夏", loc: "西夏王宫", name: "李元昊", way: "jh 53;#4 nw;n;nw;ne;#3 n;;#4 nw;n;e;e;n;", desc: "西夏开国皇帝。年少时尤倾心于治国安邦的法律著作，善于思索、谋划，对事物往往有独到的见解。这些都造就了他成为文有韬略、武有谋勇的英才。称帝后与宋作战中大获全胜，数万宋军精锐被全歼，还击败御驾亲征的辽兴宗，奠定了宋、辽、西夏三分天下的格局。" },
            { jh: "西夏", loc: "西夏王宫", name: "没藏黑云", way: "jh 53;#4 nw;n;nw;ne;#3 n;;#4 nw;n;e;e;n;", desc: "出身凉州豪门，宣穆惠文皇后，有西夏艳后之美誉。" },
            { jh: "西夏", loc: "西夏王宫", name: "李谅祚", way: "jh 53;#4 nw;n;nw;ne;#3 n;;#4 nw;n;e;e;n;", desc: "夏景宗李元昊之子，年少英明，智勇双全。" },
            { jh: "西夏", loc: "皇室冰窖", name: "梦姑", way: "jh 53;#4 nw;n;nw;ne;#3 n;;#4 nw;n;e;e;n;n;", desc: "西夏公主，没有多少人见过她的真容，据说始终以面纱示人，但是人皆称美，端丽秀雅，无双无对，花容月貌，世间无双。" },
            { jh: "西夏", loc: "夏州", name: "黑衣弩将", way: "jh 53;#4 nw;n;nw;ne;#3 n;;#4 nw;n;e;e;;#4 e;se;se;", desc: "只是一个威风凛凛的弩将，夏皇麾下万里挑一的近卫精英。" },
            { jh: "西夏", loc: "兀刺海城", name: "蒙古族居民", way: "jh 53;#4 nw;n;nw;ne;#3 n;;#4 nw;n;;n;n;ne;n;n;ne;ne;ne;", desc: "一个风程仆仆的侠客。" },
            { jh: "西夏", loc: "兀刺海城", name: "断龙斧将", way: "jh 53;#4 nw;n;nw;ne;#3 n;;#4 nw;n;;n;n;ne;n;n;ne;ne;ne;", desc: "只是一个威风凛凛的斧将，夏皇麾下万里挑一的近卫精英。" },
            { jh: "西夏", loc: "兀刺海城", name: "宋守约", way: "jh 53;#4 nw;n;nw;ne;#3 n;;#4 nw;n;;n;n;ne;n;n;ne;ne;ne;", desc: "以父任为左班殿直，至河北缘边安抚副使，选知恩州。累进步军副都指挥使、威武军留后，禁军统帅，为神宗皇帝鞠躬尽瘁死而后已，著名的轶事典故宋守约令兵捕蝉就出自于此。" },
            { jh: "西夏", loc: "兀刺海城", name: "御围内六班直", way: "jh 53;#4 nw;n;nw;ne;#3 n;;#4 nw;n;;n;n;ne;n;n;ne;ne;ne;", desc: "由贵族子弟构成的精锐马上骑射手，战力强悍，机动灵活。" },
            { jh: "西夏", loc: "城堡", name: "黑衣弩将", way: "jh 53;#4 nw;n;nw;ne;#3 n;;#4 nw;n;;n;n;ne;n;n;ne;ne;ne;n;", desc: "只是一个威风凛凛的弩将，夏皇麾下万里挑一的近卫精英。" },
            { jh: "西夏", loc: "城堡", name: "西夏弩手", way: "jh 53;#4 nw;n;nw;ne;#3 n;;#4 nw;n;;n;n;ne;n;n;ne;ne;ne;n;", desc: "装备精良劲弩的射手。" },
            { jh: "西夏", loc: "城外荒野", name: "辽军将领", way: "jh 53;#4 nw;n;nw;ne;#3 n;;#4 nw;n;;n;n;ne;n;n;ne;ne;ne;n;e;", desc: "统领辽兵的主帅。" },
            { jh: "西夏", loc: "城外荒野", name: "辽军", way: "jh 53;#4 nw;n;nw;ne;#3 n;;#4 nw;n;;n;n;ne;n;n;ne;ne;ne;n;e;", desc: "契丹族的精兵，实力不容小觑。" },
            { jh: "西夏", loc: "西凉府", name: "阿绰", way: "jh 53;#4 nw;n;nw;ne;#3 n;#4 nw;#4 sw;", desc: "西夏将领，党项羌族，甘州守将。" },
            { jh: "西夏", loc: "西凉府", name: "铁鹞子", way: "jh 53;#4 nw;n;nw;ne;#3 n;#4 nw;#4 sw;", desc: "身披铠甲的重骑兵，冲锋时犹如蛮牛，具有极大的冲击力和破坏力，步兵阵营的噩梦。" },
            { jh: "西夏", loc: "嘉峪关", name: "铁鹞子", way: "jh 53;#4 nw;n;nw;ne;#3 n;#4 nw;#4 sw;;nw;nw;n;nw;", desc: "身披铠甲的重骑兵，冲锋时犹如蛮牛，具有极大的冲击力和破坏力，步兵阵营的噩梦。" },
            { jh: "西夏", loc: "嘉峪关", name: "张元", way: "jh 53;#4 nw;n;nw;ne;#3 n;#4 nw;#4 sw;;nw;nw;n;nw;", desc: "西夏军师，国相。年轻时“以侠自任”、“负气倜傥、有纵横才”，才华出众。在北宋累试不第，自视才能难以施展，遂决心叛宋投夏。在宋仁宗景祐年间，也是元昊建国前的广运、大庆年间，与好友吴昊听说李元昊有立国称帝大志，就来到西夏，此时才改名为张元，入夏后颇得信任，元昊称帝建国后不久，即任命张元为中书令，后来吴昊也被重用。" },
            { jh: "西夏", loc: "嘉峪关", name: "御围内六班直", way: "jh 53;#4 nw;n;nw;ne;#3 n;#4 nw;#4 sw;;nw;nw;n;nw;", desc: "由贵族子弟构成的精锐马上骑射手，战力强悍，机动灵活。" },
            { jh: "西夏", loc: "破旧长城", name: "修补长城", way: "jh 53;#4 nw;n;nw;ne;#3 n;#4 nw;#4 sw;;nw;nw;n;nw;sw;", desc: "修补长城" },
            { jh: "西夏", loc: "沙漠迷宫", name: "沙漠迷宫", way: "jh 53;#4 nw;n;nw;ne;#3 n;#4 nw;#4 sw;;nw;nw;n;nw;ne;", desc: "做哈日" },
            { jh: "西夏", loc: "龙门客栈", name: "云中鹤", way: "jh 53;#4 nw;n;nw;ne;#3 n;#4 nw;#4 sw;;nw;nw;n;#3 nw;", desc: "四大恶人之一，武功以轻功见长，极为好色，云中鹤身材极高，却又极瘦，便似是根竹杆，一张脸也是长得吓人。" },
            { jh: "西夏", loc: "天山", name: "九翼道人", way: "jh 53;#4 nw;n;nw;ne;#3 n;#4 nw;#4 sw;;nw;nw;n;#3 nw;w;#3 nw;", desc: "西夏一品堂高手，雷电门门人，善使一手雷公挡功夫，生平少逢敌手，轻功登顶，与人动手，自必施展轻功。" },
            { jh: "西夏", loc: "灵鹫宫", name: "虚竹", way: "jh 53;#4 nw;n;nw;ne;#3 n;#4 nw;#4 sw;;nw;nw;n;#3 nw;w;#3 nw;ne;n;n;", desc: "本是少林寺内的无名小僧，性格木讷老实、但记性甚好。相貌丑陋，浓眉大眼、鼻孔上翻，双耳招风、嘴唇甚厚，又不善于词令。但为人忠厚善良，待人坦诚。不强求而尽得之。" },
            { jh: "南诏国", loc: "巍山河畔", name: "船夫", way: "jh 54;nw;", desc: "一个船夫，五大三粗的汉子，看起来会些拳脚功夫。" },
            { jh: "南诏国", loc: "巍山山脚", name: "樵夫", way: "jh 54;#4 nw;", desc: "" },
            { jh: "南诏国", loc: "巍山半腰", name: "神秘游客", way: "jh 54;#4 nw;;w;w;n;n;", desc: "此人年纪虽不大，但须发皆白，一身黑袍，看起来气度不凡。" },
            { jh: "南诏国", loc: "巍山山道", name: "青年游客", way: "jh 54;#4 nw;;w;w;#4 n;e;e;n;", desc: "外地来巍山的青年游客，一副陶醉于美景之态。" },
            { jh: "南诏国", loc: "巍山文庙广场", name: "游客", way: "jh 54;#4 nw;;w;w;#4 n;e;e;n;e;", desc: "一个远道来的汉族游客，风尘仆仆，但显然为眼前美景所动，兴高彩烈。" },
            { jh: "南诏国", loc: "巍山文庙", name: "南诏夫子", way: "jh 54;#4 nw;;w;w;#4 n;e;e;n;e;e;", desc: "这是当世闻名天下的大儒，正在文庙授课，正是：鹤发银丝映日月，丹心热血沃新花。" },
            { jh: "南诏国", loc: "巍山文庙", name: "书生", way: "jh 54;#4 nw;;w;w;#4 n;e;e;n;e;e;", desc: "一个看起来相当斯文的书生，正拿著一本书摇头晃脑地读著" },
            { jh: "南诏国", loc: "巍山山道", name: "雀鹰", way: "jh 54;#4 nw;;w;w;#8 n;nw;nw;w;nw;n;", desc: "中等体型，小型猛禽，主要以小鸟、昆虫和鼠类为食。" },
            { jh: "南诏国", loc: "陈异叔石棺", name: "守灵人", way: "jh 54;#4 nw;;w;w;#8 n;nw;nw;w;nw;n;n;w;n;n;", desc: "负责看守陈异叔石棺的老人，看起来深不可测。" },
            { jh: "南诏国", loc: "无为寺", name: "无为大师", way: "jh 54;#4 nw;;w;w;#8 n;ne;ne;nw;nw;#6 n;", desc: "一名白衣灰须的老僧，双眼炯炯有神，看上去似有似无" },
            { jh: "南诏国", loc: "无为寺", name: "无为大师弟子", way: "jh 54;#4 nw;;w;w;#8 n;ne;ne;nw;nw;#6 n;", desc: "一个风程仆仆的侠客。" },
            { jh: "南诏国", loc: "巍山山谷", name: "飞跃", way: "jh 54;#4 nw;;w;w;#5 n;w;w;sw;w;", desc: "蛇村" },
            { jh: "南诏国", loc: "狮子口", name: "金色神猿", way: "jh 54;#4 nw;;w;w;#5 n;w;w;sw;w;event_1_69046360;", desc: "这是南诏国郊外的猿猴，比一般猿猴体型更为巨大，全身金色，显得异常凶猛。" },
            { jh: "南诏国", loc: "蛇村", name: "养蛇人", way: "jh 54;#4 nw;;w;w;#5 n;w;w;sw;w;event_1_69046360;w;s;", desc: "蛇村里的养蛇人，听说是从西域远道而来。" },
            { jh: "南诏国", loc: "密林", name: "南蛮暴熊", way: "jh 54;#4 nw;;w;w;#5 n;w;w;sw;w;event_1_69046360;w;s;s;w;", desc: "" },
            { jh: "南诏国", loc: "南蛮沼泽", name: "南蛮沼泽-入口(右)", way: "jh 54;#4 nw;;w;w;#5 n;w;w;sw;w;event_1_69046360;w;s;s;w;w;", desc: "" },
            { jh: "南诏国", loc: "南蛮沼泽", name: "大黑蛭", way: "jh 54;#4 nw;;w;w;#5 n;w;w;sw;w;event_1_69046360;w;s;s;w;w;;w;se;n;nw;s;", desc: "" },
            { jh: "南诏国", loc: "南蛮沼泽", name: "南蛮沼泽-入口(左)", way: "jh 1;e;#4 n;w;event_1_90287255 go 9;;n;#5 e;#4 s;#3 e;", desc: "" },
            { jh: "南诏国", loc: "忘忧酒馆", name: "金镶玉", way: "jh 1;e;#4 n;w;event_1_90287255 go 9;", desc: "" },
            { jh: "南诏国", loc: "忘忧酒馆", name: "李宓", way: "jh 1;e;#4 n;w;event_1_90287255 go 9;", desc: "" },
            { jh: "南诏国", loc: "玄龙寺", name: "天竺圣僧", way: "jh 1;e;#4 n;w;event_1_90287255 go 9;n;e;#4 n;e;e;n;", desc: "" },
            { jh: "南诏国", loc: "古城街道", name: "小贩", way: "jh 1;e;#4 n;w;event_1_90287255 go 9;n;e;#4 n;#3 e;", desc: "" },
            { jh: "南诏国", loc: "古城街道", name: "蒲甘商人", way: "jh 1;e;#4 n;w;event_1_90287255 go 9;n;e;#4 n;#3 e;", desc: "" },
            { jh: "南诏国", loc: "角楼", name: "艮龙龙灵", way: "jh 1;e;#4 n;w;event_1_90287255 go 9;n;e;#12 n;#3 e;", desc: "" },
            { jh: "南诏国", loc: "角楼", name: "巽龙龙灵", way: "jh 1;e;#4 n;w;event_1_90287255 go 9;n;#5 e;#11 s;", desc: "" },
            { jh: "南诏国", loc: "角楼", name: "坤龙龙灵", way: "jh 1;e;#4 n;w;event_1_90287255 go 9;n;w;w;#11 s;#7 w;", desc: "" },
            { jh: "南诏国", loc: "角楼", name: "乾龙龙灵", way: "jh 1;e;#4 n;w;event_1_90287255 go 9;n;#9 w;#12 n;", desc: "" },
            { jh: "南诏国", loc: "南诏棋院", name: "【棋圣】黄龙士", way: "jh 1;e;#4 n;w;event_1_90287255 go 9;n;w;n;", desc: "学棋道" },
            { jh: "南诏国", loc: "南诏琴院", name: "【琴圣】嵇康", way: "jh 1;e;#4 n;w;event_1_90287255 go 9;n;w;w;#6 s;e;", desc: "学琴" },
            { jh: "南诏国", loc: "西云书院", name: "杨慎", way: "jh 1;e;#4 n;w;event_1_90287255 go 9;n;w;w;#4 s;w;n;", desc: "" },
            { jh: "南诏国", loc: "西云书院", name: "李元阳", way: "jh 1;e;#4 n;w;event_1_90287255 go 9;n;w;w;#4 s;w;n;", desc: "" },
            { jh: "南诏国", loc: "南诏医馆", name: "【医圣】济苍生", way: "jh 1;e;#4 n;w;event_1_90287255 go 9;n;#7 w;s;", desc: "解毒、问诊" },
            { jh: "南诏国", loc: "武庙照壁", name: "神秘男人", way: "jh 1;e;#4 n;w;event_1_90287255 go 9;n;#5 w;n;n;w;", desc: "" },
            { jh: "南诏国", loc: "南诏大殿", name: "南诏皇后", way: "jh 1;e;#4 n;w;event_1_90287255 go 9;n;e;#8 s;e;e;n;n;", desc: "" },
            { jh: "南诏国", loc: "南诏大殿", name: "南诏皇帝", way: "jh 1;e;#4 n;w;event_1_90287255 go 9;n;e;#8 s;e;e;n;n;", desc: "" },
            { jh: "南诏国", loc: "元帅府", name: "【大元帅】杜文秀", way: "jh 1;e;#4 n;w;event_1_90287255 go 9;n;e;#8 s;#7 w;n;", desc: "" },
            { jh: "南诏国", loc: "古城小巷", name: "蒲甘美女", way: "jh 1;e;#4 n;w;event_1_90287255 go 9;n;e;#11 s;#6 w;n;w", desc: "" },
            { jh: "南诏国", loc: "容宝斋", name: "容宝斋主", way: "jh 1;e;#4 n;w;event_1_90287255 go 9;n;e;#11 s;#6 w;n;w;w;n;", desc: "" },
            { jh: "南诏国", loc: "承恩大道", name: "西域商人", way: "jh 1;e;#4 n;w;event_1_90287255 go 9;n;w;w;#15 s;e;e;s;", desc: "" },
            { jh: "南诏国", loc: "南诏兽苑", name: "【驯兽大师】斯金纳", way: "jh 1;e;#4 n;w;event_1_90287255 go 9;n;e;#8 n;e;e;n;n;", desc: "学驯兽" },
            { jh: "长白山", loc: "天池", name: "天池(泡澡)", way: "jh 55;e;ne;n;w;n;e;se;n;n;#6 w;n;e;n;w;w;s;w;w;s;w;n;ne;n;n;e;s;e;n;nw;w;n;e;n;w;n;ne;nw;nw;ne;e;e;n;w;ne;", desc: "湖的水深幽清澈，群峰环抱的湖面五彩斑斓，蔚为壮观。从古自今，无人知此地湖水从何而来，故名为天池。" },
            { jh: "长白山", loc: "藏经阁", name: "藏经阁(抄书)", way: "jh 55;e;ne;n;w;n;e;se;n;n;#3 w;n;n;w;n;e;e;s;s;e;#5 n;", desc: "这里是雪山寺的藏经之处。" },
            { jh: "长白山", loc: "圣湖", name: "枫林秘境", way: "jh 55;e;ne;n;w;n;e;se;n;n;#3 w;n;n;w;n;e;e;s;s;e;#3 n;e;e;s;se;e;ne;se;sw", desc: "碧蓝的湖面倒影着蓝天和白云，浩淼的水面让人心旷神怡。金碧辉煌的雪山寺倒影在湖水上清晰可见，再远处是几座延绵的大雪山，雪山中融化的雪水都汇入湖中。" },

        ],
        Map: [
          {
            jh: "1", loc: "全图", name: "雪亭镇",
            way: "jh 1;inn_op1;w;e;n;s;e;w;s;e;s;w;s;n;w;e;e;e;ne;ne;sw;sw;n;w;n;w;e;e;e;n;s;e;e;n;s;s;n;e;w;w;w;w;w;n;w;e;n;w;e;e;e;w;w;n;e;w;w;e;n",
          },
          {
            jh: "2", loc: "全图", name: "洛阳",
            way: "jh 2;n;n;e;s;luoyang317_op1;n;n;w;n;w;putuan;n;e;e;s;n;w;n;e;s;n;w;w;event_1_98995501;n;w;e;n;e;w;s;s;s;s;w;e;n;e;n;w;s;luoyang111_op1;e;n;w;n;w;get_silver;s;e;n;n;e;get_silver;n;w;s;s;s;e;n;n;w;e;s;s;e;e;n;op1;s;s;e;n;n;w;e;e;n;s;w;n;w;e;n;e;w;n;w;e;s;s;s;s;s;w;w;n;w;e;e;n;s;w;n;e;w;n;w;luoyang14_op1;n;e;e;w;n;e;n;n;n;s;s;s;w;n;w;w;w;w;e;e;e;e;n;n;n;n",
          },
          {
            jh: "3", loc: "全图", name: "华山村",
            way: "jh 3;n;e;w;s;w;n;s;event_1_59520311;n;n;w;get_silver;s;e;n;n;e;get_silver;n;w;n;e;w;s;s;s;s;s;e;e;s;e;n;s;w;s;e;s;huashancun24_op2;w;n;w;w;n;s;e;s;s;w;get_silver;n;n;s;e;huashancun15_op1;event_1_46902878;kill?藏剑楼杀手;@藏剑楼杀手;w;w;s;e;w;nw;n;n;e;get_silver;s;w;n;w;give huashancun_huashancun_fb9;e;e;n;n;w;e;n;s;e",
          },
          {
            jh: "4", loc: "全图", name: "华山",
            way: "jh 4;n;n;w;e;n;e;w;n;n;n;n;event_1_91604710;s;s;s;w;get_silver;s;e;s;e;w;n;n;n;n;nw;s;s;w;n;n;w;s;n;w;n;get_xiangnang2;w;s;e;e;n;e;n;n;w;w;event_1_26473707;e;e;e;n;e;s;event_1_11292200;n;n;w;n;e;w;n;s;s;s;s;s;w;n;n;n;w;e;n;get_silver;s;s;e;n;n;s;s;s;s;n;n;w;s;s;w;event_1_30014247;s;w;e;s;e;w;s;s;s;e",
          },
          {
            jh: "5", loc: "全图", name: "扬州",
            way: "jh 5;n;w;w;n;s;e;e;e;w;n;w;e;e;w;n;w;e;e;n;w;e;n;w;n;get_silver;s;s;e;e;get_silver;n;w;n;n;s;e;w;s;s;s;w;n;w;yangzhou16_op1;e;e;n;e;n;n;n;s;s;w;n;e;n;n;s;s;w;n;n;e;n;n;event_1_89774889;s;s;s;e;s;s;s;w;s;w;w;w;n;n;w;n;n;n;s;s;s;e;n;get_silver;s;s;e;e;w;w;s;s;s;s;n;n;e;e;n;w;e;e;n;n;n;n;s;s;e;w;w;e;s;s;w;n;w;e;e;get_silver;s;w;n;w;w;n;get_silver;s;s;w;s;w;e;e;e;s;s;e;e;s;s;s;n;n;n;w;w;n;n;w;w;n;e;e;e;n;e;s;e;s;s;s;n;n;n;w;n;w;n;ne;sw;s;w;s;n;w;n;w;e;e;w;n;n;w;n;s;e;e;s;n;w;n;s;s;s;s;e;e;s;s;s;w;event_1_69751810",
          },
          {
            jh: "6", loc: "全图", name: "丐帮",
            way: "jh 6;event_1_98623439;s;w;e;n;ne;n;ne;ne;ne;event_1_97428251;n;sw;sw;sw;s;ne;ne;event_1_16841370"
          },
          {
            jh: "7", loc: "全图", name: "乔阴县",
            way: "jh 7;s;s;s;w;s;w;w;w;e;e;e;e;event_1_65599392;n;s;w;e;ne;s;s;e;n;n;e;w;s;s;w;s;w;w;w;n;s;s;e;n;s;e;ne;s;e;n;e;s;e",
          },
          {
            jh: "8", loc: "全图", name: "峨眉山",
            way: "jh 8;w;nw;n;n;n;n;w;e;se;nw;e;n;s;e;n;n;e;kill?看山弟子;n;n;n;n;e;e;w;w;w;n;n;n;w;w;s;e;w;w;e;s;e;w;w;e;n;n;w;w;n;s;sw;ne;e;e;n;e;w;w;e;n;e;w;w;e;n;w;w;w;n;n;n;s;s;s;e;e;e;e;e;s;s;s;e;e;s;w;e;e;w;s;w;e;e;w;n;n;e;e;w;w;n;w;e;e;w;n;w;e;e;w;n;e;e;w;w;w;w;n;w;w;e;n;s;s;n;e;n;n;n;n;s;s;nw;nw;n;n;s;s;se;sw;w;nw;w;e;se;e;ne;se;ne;se;s;se;nw;n;nw;ne;n;s;se;e",
          },
          {
            jh: "9", loc: "全图", name: "恒山",
            way: "jh 9;n;w;e;n;e;get_silver;w;w;n;w;e;n;henshan15_op1;e;e;w;n;event_1_85624865;n;w;event_1_27135529;e;e;e;w;n;n;n;s;henshan_zizhiyu11_op1;e;s;s;s;w;n;n;w;n;s;s;n;e;e;e;w;n;s;w;n;n;w;n;e;n;s;w;n;n;w;get_silver;s;e;n",
          },
          {
            jh: "10", loc: "全图", name: "武当",
            way: "jh 10;w;n;n;w;w;w;n;n;n;n;e;e;e;e;s;e;s;e;n;s;s;n;e;e;n;s;e;w;s;s;s;n;n;n;w;w;w;n;w;n;w;w;w;w;n;w;n;s;e;e;e;s;n;e;e;w;w;w;w;n;n;n;n;jh 10;w;n;event_1_74091319;ne;n;sw;nw;w;ne;n;w;nw;sw;ne;n;nw;event_1_5824311",
          },
          {
            jh: "11", loc: "全图", name: "晚月庄",
            way: "jh 11;e;e;s;sw;se;w;n;s;w;w;s;n;w;e;e;s;w;e;s;e;e;e;w;w;w;w;s;n;w;n;s;s;n;e;e;s;w;w;e;e;e;e;w;w;s;e;e;w;w;n;e;n;n;w;n;n;n;e;e;s;s;s;w;s;s;w;e;se;e;se;ne;n;nw;w;s;s;s;se;s",
          },
          {
            jh: "12", loc: "全图", name: "水烟阁",
            way: "jh 12;n;e;w;n;n;n;s;w;n;n;e;w;s;nw;e;e;sw;n;s;s;e;w;n;ne;w;n"
          },
          {
            jh: "13", loc: "全图", name: "少林寺",
            way: "jh 13;e;s;s;w;w;w;event_1_38874360;jh 13;n;w;w;n;shaolin012_op1;s;s;e;e;n;w;e;e;w;n;n;w;e;e;w;n;n;w;e;e;w;n;shaolin27_op1;event_1_34680156;s;w;n;w;e;e;w;n;shaolin25_op1;w;n;w;s;s;s;get_silver;w;s;s;s;s;s;n;n;n;n;n;n;n;n;e;e;s;s;s;s;get_silver;w;s;s;s;get_silver;w;s;n;n;n;n;n;n;n;n;w;n;w;e;e;w;n;e;w;w;n;get_silver",
          },
          {
            jh: "14", loc: "全图", name: "唐门",
            way: "jh 14;e;w;w;n;n;n;n;s;w;n;s;s;n;w;n;s;s;n;w;n;s;s;n;w;e;e;e;e;e;s;n;e;n;e;w;n;n;s;ask tangmen_tangmei;ask tangmen_tangmei;e;event_1_8413183;event_1_39383240;e;s;e;n;w;n;n;s;s;e",
          },
          {
            jh: "16", loc: "全图", name: "逍遥林",
            way: "jh 16;s;s;s;s;e;e;s;w;n;s;s;s;n;n;w;n;n;s;s;s;s;n;n;w;w;n;s;s;n;w;e;e;e;e;e;e;n;n;e;event_1_5221690;s;w;event_1_57688376;n;n;w;w;e;n;s;e;e;n;event_1_88625473;event_1_82116250;event_1_90680562;event_1_38586637;s;s;e;n;n;w;n;e;jh 16;s;s;s;s;e;n;e;event_1_56806815;jh 16;s;s;s;s;e;n;e;event_1_5221690;s;w;event_1_57688376;n;n;event_1_38333366;event_1_38333366;event_1_38333366;event_1_38333366;event_1_38333366;event_1_38333366;event_1_38333366;event_1_38333366",
          },
          {
            jh: "17", loc: "全图", name: "开封",
            way: "jh 17;n;w;e;e;s;n;w;n;w;s;n;n;n;s;s;e;e;e;s;n;n;n;s;s;w;s;s;s;w;e;s;w;e;n;e;n;s;s;n;e;e;jh 17;n;n;n;e;w;n;e;w;n;e;se;s;n;nw;n;n;n;event_1_27702191;jh 17;n;n;n;n;w;w;n;s;s;n;w;w;e;n;n;w;e;s;s;s;s;w;jh 17;sw;nw;se;s;sw;nw;ne;event_1_38940168;jh 17;e;s;s;s;e;kaifeng_yuwangtai23_op1;s;w;s;s;w;jh 17;n;n;e;e;n;get_silver",
          },
          {
            jh: "18", loc: "全图", name: "明教",
            way: "jh 18;w;n;s;e;e;w;n;nw;sw;ne;n;n;w;e;n;n;n;ne;n;n;e;w;w;e;n;e;w;w;e;n;n;e;e;se;se;e;w;nw;nw;n;w;w;w;w;s;s;n;e;w;n;n;n;e;nw;nw;se;se;e;s;w;e;e;w;n;e;e;se;e;w;sw;s;w;w;n;e;w;n;n;n;n;n;w;e;n;event_1_90080676;event_1_56007071;ne;n;nw;se;s;s;e;n;w;nw;sw;se;e;se;nw;s;s;s;s;w;nw;nw;event_1_70957287;event_1_39374335;kill?九幽毒童;event_1_2077333",
          },
          {
            jh: "19", loc: "全图", name: "全真教",
            way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;w;e;e;w;n;w;w;w;s;n;w;s;n;e;e;e;e;e;n;s;e;n;n;s;s;e;w;w;w;n;n;n;w;e;e;s;n;e;n;n;n;n;s;e;s;n;n;n;w;n;w;w;w;s;s;s;s;s;e;n;n;n;s;w;s;n;w;n;s;s;s;w;n;n;n;s;w;s;s;s;s;e;s;s;n;n;e;s;s;n;n;e;e;n;n;n;n;w;w;w;n;n;e;n;e;e;n;n",
          },
          {
            jh: "21", loc: "全图", name: "白驼山",
            way: "jh 21;nw;s;n;ne;ne;sw;n;n;ne;w;e;n;n;n;s;w;w;jh 21;nw;w;n;s;w;nw;e;w;nw;nw;n;w;sw;ne;s;event_1_47975698;s;sw;s;ne;e;s;s;jh 21;nw;w;w;nw;n;e;w;n;n;w;e;n;n;e;e;w;nw;se;e;ne;sw;e;se;nw;w;n;s;s;n;w;w;n;n;n;n;s;s;s;s;e;e;e;n;n;w;e;e;e;w;w;n;nw;se;ne;w;e;e;w;n",
          },
          {
            jh: "22", loc: "全图", name: "嵩山",
            way: "jh 22;n;n;w;w;s;s;e;w;s;s;w;e;s;n;n;n;n;n;e;n;n;n;n;n;e;n;e;e;w;w;n;w;n;s;e;n;n;n;e;songshan33_op1;n;w;w;w;e;n;w;e;n;s;s;e;n;e;w;n;e;w;n;get_silver;jh 22;n;n;n;n;e;n;event_1_1412213;s;event_1_29122616;jh 22;n;n;n;n;n;n;n",
          },
          {
            jh: "23", loc: "全图", name: "寒梅庄",
            way: "jh 23;n;n;e;w;n;n;n;n;n;w;w;e;e;e;s;n;w;n;w;n;s;w;e;e;e;n;s;w;n;n;e;w;event_1_8188693;n;n;w;e;n;e;n;s;w;n;s;s;s;s;s;w;n",
          },
          {
            jh: "24", loc: "全图", name: "泰山",
            way: "jh 24;se;nw;n;n;n;n;w;e;e;e;w;s;n;w;n;n;w;e;e;w;n;e;w;n;w;n;n;n;n;n;s;s;w;n;s;e;s;s;s;e;n;e;w;n;w;e;n;n;e;s;n;e;n;e;w;n;w;e;e;w;n;n;s;s;s;s;s;w;w;n;n;w;e;e;w;n;n;w;e;e;w;n;s;s;s;s;s;w;n;e;w;n;w;e;n;n;e",
          },
          {
            jh: "25", loc: "全图", name: "大旗门",
            way: "jh 11;e;e;s;n;nw;w;nw;e;e;e;n;w;e;s;se;jh 25;w;e;e;e;e;e;s;yell;n;s;e;ne;se;e;e;e;e;w;w;w;w;nw;sw;w;s;e;event_1_81629028;s;e;n;w;w;s;w",
          },
          {
            jh: "26", loc: "全图", name: "大昭寺",
            way: "jh 26;w;w;w;w;w;n;s;w;s;w;e;e;e;w;w;s;w;w;w;s;n;w;n;n;n;n;n;e;e;e;e;e;w;s;s;w;w;n;w;e;e;w;s;w;n;s;s;n;w;ask lama_master;ask lama_master;ask lama_master;event_1_91837538",
          },
          {
            jh: "27", loc: "全图", name: "魔教",
            way: "jh 27;se;e;e;e;w;w;w;nw;ne;w;e;n;ne;sw;s;nw;w;nw;w;w;kill?船夫;@船夫的尸体;yell;w;nw;sw;ne;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;w;e;e;w;n;e;n;s;w;n;nw;n;s;se;ne;n;s;sw;w;ne;n;s;ne;n;n;s;s;nw;n;s;se;w;n;s;e;sw;n;s;ne;se;n;s;nw;e;e;n;s;s;n;e;n;s;s;n;e;n;s;s;n;e;n;s;s;n;e;n;s;s;n;w;w;w;w;w;n;n;n;n;n;w;w;w;w;w;e;e;e;e;e;e;e;e;e;e;w;w;w;w;w;n;n;event_1_57107759;e;e;n;w",
          },
            {
            jh: "28", loc: "全图", name: "星宿海",
            way: "jh 28;n;w;w;w;se;jh 28;nw;sw;jh 28;jh 28;n;jh 28;n;n;jh 28;n;n;jh 28;n;n;jh 28;n;n;jh 28;n;n;n;jh 28;n;n;n;n;nw;w;jh 28;n;w;jh 28;n;w;n;jh 28;n;w;n;n;jh 28;n;w;w;jh 28;n;w;w;w;w;jh 28;n;w;w;w;w;jh 28;n;w;w;w;w;n;jh 28;n;w;w;w;w;w;w;nw;ne;nw;w;jh 28;n;w;w;w;w;w;w;nw;ne;nw;w;jh 28;nw;jh 28;nw;jh 28;nw;jh 28;nw;e;jh 28;nw;e;jh 28;nw;e;e;jh 28;nw;nw;jh 28;nw;nw;jh 28;nw;w;jh 28;nw;w;buy /map/xingxiu/npc/obj/fire from xingxiu_maimaiti;e;se;sw;event_1_83637364;jh 28;sw;jh 28;sw;nw;sw;sw;nw;nw;se;sw;",
          },
            {
            jh: "29", loc: "全图", name: "茅山",
            way: "jh 29;n;jh 29;n;n;n;n;event_1_60035830;place?平台;e;jh 29;n;n;n;n;event_1_60035830;place?平台;event_1_65661209;place?无名山峡谷;n;jh 29;n;n;n;n;event_1_60035830;place?平台;event_1_65661209;place?无名山峡谷;n;jh 29;n;n;n;n;event_1_60035830;place?平台;event_1_65661209;place?洞口;n;n;n;n;n;e;n;jh 29;n;n;n;n;event_1_60035830;place?平台;event_1_65661209;place?洞口;n;n;n;n;n;n;n;jh 29;n;n;n;n;event_1_60035830;place?平台;event_1_65661209;place?洞口;n;n;n;n;n;n;n;event_1_98579273;jh 29;n;n;n;n;event_1_60035830;place?平台;event_1_65661209;place?洞口;n;n;n;n;n;n;n;event_1_98579273;n;jh 29;n;n;n;n;event_1_60035830;place?平台;event_1_65661209;place?洞口;n;n;n;n;n;n;n;event_1_98579273;w;",
          },
            {
            jh: "30", loc: "全图", name: "桃花岛",
            way: "jh 30;n;n;n;n;n;n;n;jh 30;jh 30;n;n;n;n;n;n;jh 30;n;n;n;n;n;n;n;n;n;n;w;jh 30;n;n;n;n;n;n;n;n;n;n;e;e;n;jh 30;n;n;n;n;n;n;n;n;n;n;e;s;jh 30;n;n;n;n;n;n;n;n;n;n;n;n;n;n;se;s;jh 30;n;n;n;n;n;n;n;n;n;n;w;w;s;jh 30;n;n;n;n;n;n;n;n;n;n;w;w;s;jh 30;n;n;n;n;n;n;n;w;w;jh 30;yell;w;n;jh 30;yell;w;n;e;",
          },
            {
            jh: "31", loc: "全图", name: "铁雪山庄",
            way: "jh 11;e;e;s;n;nw;w;nw;e;jh 11;e;e;s;n;nw;w;nw;e;e;e;n;w;jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;jh 31;n;se;e;se;s;s;sw;se;se;jh 31;n;n;n;jh 31;n;n;n;w;jh 31;n;n;n;w;w;w;jh 31;n;n;n;w;w;w;w;n;jh 31;n;n;n;w;w;w;w;n;n;jh 31;n;n;n;w;w;w;w;n;n;n;jh 31;n;n;n;w;w;w;w;n;n;n;jh 31;n;n;n;w;w;w;w;n;n;n;jh 31;n;n;n;w;w;w;w;n;n;n;n;jh 31;n;n;n;w;w;w;w;n;n;n;n;jh 31;n;e;n;n;se;sw;s;nw;n;jh 31;n;e;n;n;se;sw;s;nw;n;e;jh 31;n;se;jh 31;n;se;e;jh 31;n;se;e;se;jh 31;n;se;e;se;s;jh 31;n;se;e;se;s;s;jh 31;n;se;e;se;s;s;sw;jh 31;n;se;e;se;s;s;sw;se;jh 31;n;se;e;se;s;s;sw;se;se;jh 31;n;se;e;se;s;s;sw;se;se;e;jh 31;n;se;e;se;s;s;sw;se;se;e;nw;jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n;jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n;n;n;jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n;n;n;n;n;e;e;event_1_47175535;jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n;n;n;n;n;e;n;jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n;n;n;n;n;n;n;n;e;e;event_1_94442590;jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n;n;n;n;n;n;n;n;w;w;event_1_57281457;jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n;n;n;n;n;w;n;jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n;n;n;n;n;w;w;sw;jh 31;n;se;e;se;s;w;",
          },
            {
            jh: "32", loc: "全图", name: "慕容山庄",
            way: "jh 32;n;n;jh 32;n;n;se;jh 32;n;n;se;e;s;s;jh 32;n;n;se;e;s;s;event_1_99232080;jh 32;n;n;se;e;s;s;event_1_99232080;e;e;s;e;s;e;e;e;jh 32;n;n;se;e;s;s;event_1_99232080;e;e;s;e;s;e;e;e;n;jh 32;n;n;se;e;s;s;event_1_99232080;e;e;s;e;s;e;e;e;s;s;event_1_92057893;e;s;event_1_8205862;jh 32;n;n;se;n;jh 32;n;n;se;n;jh 32;n;n;se;n;n;jh 32;n;n;se;n;n;n;n;jh 32;n;n;se;n;n;n;n;n;jh 32;n;n;se;n;n;n;n;w;w;n;jh 32;n;n;se;n;n;n;n;w;w;w;n;w;jh 32;n;n;se;n;n;n;n;w;w;w;n;w;n;e;n;e;n;e;jh 32;n;n;se;n;n;n;n;w;w;w;n;w;n;e;n;e;n;n;jh 32;n;n;se;n;n;n;n;w;w;w;n;w;n;e;n;e;n;n;jh 32;n;n;se;n;n;n;n;w;w;w;n;w;n;e;n;e;n;w;",
          },
            {
            jh: "33", loc: "全图", name: "大理",
            way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;n;w;n;jh 33;sw;sw;jh 33;sw;sw;s;s;jh 33;sw;sw;s;s;jh 33;sw;sw;s;s;s;nw;n;jh 33;sw;sw;s;s;s;nw;n;jh 33;sw;sw;s;s;s;nw;n;ne;n;n;ne;jh 33;sw;sw;s;s;s;nw;n;nw;n;jh 33;sw;sw;s;s;s;nw;n;nw;n;jh 33;sw;sw;s;s;s;nw;n;nw;n;n;n;n;e;e;jh 33;sw;sw;s;s;s;nw;n;nw;n;n;n;n;e;e;jh 33;sw;sw;s;s;s;s;e;e;e;e;se;e;e;jh 33;sw;sw;s;s;s;s;e;e;e;e;se;e;e;e;e;e;jh 33;sw;sw;s;s;s;s;e;e;e;e;se;e;e;e;e;e;jh 33;sw;sw;s;s;s;s;e;e;e;e;se;e;e;e;n;jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;e;jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;e;e;se;e;e;jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;e;e;se;e;e;ne;e;n;jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;e;e;se;e;e;ne;e;n;jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;e;e;se;e;e;s;jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;e;e;se;e;e;sw;jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;e;e;se;e;e;sw;s;jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;e;e;se;e;e;sw;s;s;jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;e;e;se;e;e;sw;s;s;e;e;jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;e;e;se;e;e;sw;s;s;e;n;e;n;jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;s;jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;s;w;n;jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;s;w;n;jh 33;sw;sw;s;s;s;s;e;e;n;jh 33;sw;sw;s;s;s;s;s;e;jh 33;sw;sw;s;s;s;s;s;e;n;jh 33;sw;sw;s;s;s;s;s;e;n;se;jh 33;sw;sw;s;s;s;s;s;e;n;se;e;jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e;jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e;e;e;jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e;n;jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e;n;n;jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e;n;n;n;jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e;n;n;n;ne;e;e;n;jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e;n;n;n;ne;n;jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e;s;jh 33;sw;sw;s;s;s;s;s;e;n;se;n;e;jh 33;sw;sw;s;s;s;s;s;e;n;se;n;n;jh 33;sw;sw;s;s;s;s;s;e;n;se;n;w;jh 33;sw;sw;s;s;s;s;s;e;n;se;w;jh 33;sw;sw;s;s;s;s;s;s;e;e;jh 33;sw;sw;s;s;s;s;s;s;e;n;jh 33;sw;sw;s;s;s;s;s;s;s;jh 33;sw;sw;s;s;s;s;s;s;s;e;jh 33;sw;sw;s;s;s;s;s;s;s;e;n;jh 33;sw;sw;s;s;s;s;s;s;s;s;e;s;jh 33;sw;sw;s;s;s;s;s;s;s;s;e;s;jh 33;sw;sw;s;s;s;s;s;s;s;s;s;n;w;n;jh 33;sw;sw;s;s;s;s;s;s;s;s;s;n;w;n;se;ne;jh 33;sw;sw;s;s;s;s;s;s;s;s;s;n;w;s;jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;e;jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;s;e;n;n;jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;s;e;n;n;n;jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;s;s;e;n;n;n;jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;s;se;sw;n;jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;s;se;sw;s;jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;s;se;sw;w;jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;sw;sw;jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;sw;sw;n;jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;sw;sw;s;jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;sw;sw;w;jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;se;jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;w;w;se;jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;w;w;se;n;jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;w;w;se;n;jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;w;w;se;n;n;e;e;se;jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;w;w;se;n;n;w;se;jh 33;sw;sw;s;s;s;s;s;s;w;jh 33;sw;sw;s;s;s;s;s;w;jh 33;sw;sw;s;s;s;s;s;w;jh 33;sw;sw;s;s;s;s;s;w;n;n;jh 33;sw;sw;s;s;s;s;s;w;n;n;n;n;jh 33;sw;sw;s;s;s;s;w;w;n;jh 33;sw;sw;s;s;s;s;w;w;n;jh 33;sw;sw;s;s;s;s;w;w;n;se;jh 33;sw;sw;s;s;s;s;w;w;s;jh 33;sw;sw;s;s;s;s;w;w;s;nw;jh 33;sw;sw;s;s;s;s;w;w;w;w;jh 33;sw;sw;s;s;s;s;w;w;w;w;w;n;e;jh 33;sw;sw;s;s;s;s;w;w;w;w;w;n;e;jh 33;sw;sw;s;s;s;s;w;w;w;w;w;n;n;jh 33;sw;sw;s;s;s;s;w;w;w;w;w;n;ne;jh 33;sw;sw;s;s;s;s;w;w;w;w;w;n;w;se;jh 33;sw;sw;s;s;s;s;w;w;w;w;w;n;w;se;jh 33;sw;sw;s;s;s;s;w;w;w;w;w;s;s;w;w;",
          },
            {
            jh: "34", loc: "全图", name: "断剑山庄",
            way: "jh 34;ne;e;e;e;e;e;n;e;n;jh 34;ne;e;e;e;e;e;n;e;n;jh 34;ne;e;e;e;e;e;n;n;n;n;n;n;e;jh 34;ne;e;e;e;e;e;n;n;n;n;n;w;jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;e;e;jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;n;jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;n;e;e;jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;n;e;n;e;jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;n;n;n;n;jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;n;n;n;n;n;jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;n;n;w;w;jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;w;s;jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;w;s;w;jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;w;w;",
          },
            {
            jh: "35", loc: "全图", name: "冰火岛",
            way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;w;n;w;event_1_53278632;jh 35;nw;nw;nw;n;ne;nw;jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;ne;n;jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;w;n;w;ne;jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;w;n;w;nw;jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;w;n;w;nw;sw;se;s;sw;sw;se;jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;w;n;w;nw;sw;se;s;sw;sw;se;jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;w;n;w;nw;sw;se;s;sw;sw;se;se;jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;s;se;w;nw;jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;s;se;w;nw;s;s;s;s;s;s;e;jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;s;se;w;nw;s;s;s;s;s;s;w;w;n;e;n;w;w;s;s;jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;n;nw;jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;n;nw;",
          },
            {
            jh: "36", loc: "全图", name: "侠客岛",
            way: "jh 36;yell;jh 36;yell;jh 36;yell;e;jh 36;yell;e;ne;ne;jh 36;yell;e;ne;ne;ne;e;e;jh 36;yell;e;ne;ne;ne;e;e;jh 36;yell;e;ne;ne;ne;e;e;e;jh 36;yell;e;ne;ne;ne;e;e;e;jh 36;yell;e;ne;ne;ne;e;e;e;e;jh 36;yell;e;ne;ne;ne;e;e;e;e;e;jh 36;yell;e;ne;ne;ne;e;e;e;e;e;e;n;e;e;ne;jh 36;yell;e;ne;ne;ne;e;e;e;e;e;e;n;n;n;e;ne;nw;jh 36;yell;e;ne;ne;ne;e;e;e;e;e;e;n;n;n;e;ne;nw;w;jh 36;yell;e;ne;ne;ne;e;e;e;e;e;e;n;n;n;w;w;jh 36;yell;e;ne;ne;ne;e;e;e;fly;e;jh 36;yell;e;ne;ne;ne;e;e;n;jh 36;yell;e;ne;ne;ne;e;e;n;jh 36;yell;e;ne;ne;ne;e;n;jh 36;yell;e;ne;ne;ne;e;n;jh 36;yell;e;ne;ne;ne;e;n;n;jh 36;yell;e;ne;ne;ne;e;n;w;jh 36;yell;e;ne;ne;ne;e;s;jh 36;yell;e;ne;ne;ne;e;s;jh 36;yell;e;ne;ne;ne;e;s;e;jh 36;yell;e;ne;ne;ne;e;s;w;jh 36;yell;e;se;e;jh 36;yell;e;se;e;e;jh 36;yell;e;se;e;e;e;e;jh 36;yell;e;se;e;e;n;e;s;jh 36;yell;e;se;e;e;s;s;s;e;jh 36;yell;e;se;e;e;s;s;s;e;ne;jh 36;yell;e;se;e;e;s;s;s;e;ne;e;e;n;jh 36;yell;e;se;e;e;s;s;s;e;ne;e;e;n;e;n;e;n;jh 36;yell;e;se;e;e;s;s;s;s;jh 36;yell;e;se;e;e;s;s;s;w;jh 36;yell;e;se;e;e;w;",
          },
            {
            jh: "37", loc: "全图", name: "绝情谷",
            way: "jh 37;n;e;e;nw;nw;w;n;nw;n;n;ne;n;nw;sw;event_1_12492702;jh 37;n;e;e;nw;nw;w;n;nw;n;n;ne;n;nw;sw;event_1_12492702;jh 37;n;jh 37;n;e;e;jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;ne;ne;event_1_16813927;jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;ne;ne;se;jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;ne;ne;se;jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;ne;ne;se;s;s;s;jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;ne;ne;se;s;s;s;w;jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;ne;jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;ne;e;jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;ne;e;ne;jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;ne;e;ne;se;jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;nw;jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;nw;n;ne;e;ne;e;n;jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;nw;n;nw;jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;nw;n;nw;n;nw;jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;nw;n;nw;n;nw;jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;nw;ne;n;ne;jh 37;n;e;e;nw;nw;w;n;nw;n;n;jh 37;n;e;e;nw;nw;w;n;nw;n;n;ne;n;nw;",
          },
            {
            jh: "38", loc: "全图", name: "碧海山庄",
            way: "jh 38;n;n;n;n;n;n;n;jh 38;n;n;n;n;n;n;n;n;jh 38;n;n;n;n;n;n;n;n;n;jh 38;n;n;n;n;n;n;n;n;n;jh 38;n;n;n;n;n;n;n;n;n;jh 38;n;n;n;n;n;n;n;n;n;e;se;s;jh 38;n;n;n;n;n;n;n;n;n;e;se;s;e;jh 38;n;n;n;n;n;n;n;n;n;n;n;e;e;se;se;e;n;jh 38;n;n;n;n;n;n;n;n;n;n;n;e;e;se;se;e;n;n;n;jh 38;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;jh 38;n;n;n;n;n;n;n;w;w;nw;jh 38;n;n;n;n;n;n;n;w;w;nw;w;jh 38;n;n;n;n;n;n;n;w;w;nw;w;w;n;n;jh 38;n;n;n;n;w;jh 38;n;n;n;n;w;w;jh 38;n;n;w;jh 38;n;n;w;",
          },
            {
            jh: "39", loc: "全图", name: "天山",
            way: "jh 39;ne;jh 39;ne;e;n;ne;jh 39;ne;e;n;ne;ne;n;jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791;place?失足岩;nw;n;jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791;place?失足岩;nw;n;ne;nw;jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791;place?失足岩;nw;n;ne;nw;nw;n;jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791;place?失足岩;nw;n;ne;nw;nw;w;s;jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791;place?失足岩;nw;n;ne;nw;nw;w;n;n;jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791;place?失足岩;nw;n;ne;nw;nw;w;n;n;e;jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791;place?失足岩;nw;n;ne;nw;nw;w;n;n;n;e;e;s;jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791;place?失足岩;nw;n;ne;nw;nw;w;n;n;n;e;nw;jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791;place?失足岩;nw;n;ne;nw;nw;w;n;n;n;e;nw;w;ne;jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791;place?失足岩;nw;n;ne;nw;nw;w;n;n;n;e;nw;w;nw;jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791;place?失足岩;nw;n;ne;nw;nw;w;n;n;n;e;nw;w;nw;jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791;place?失足岩;nw;n;ne;nw;nw;w;n;n;w;jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791;place?失足岩;nw;n;ne;nw;nw;w;w;jh 39;ne;e;n;ne;ne;n;ne;nw;ne;nw;event_1_17801939;place?星星峡;jh 39;ne;e;n;ne;ne;n;ne;nw;ne;nw;event_1_17801939;place?星星峡;ne;ne;nw;jh 39;ne;e;n;ne;ne;n;ne;nw;ne;nw;event_1_17801939;place?星星峡;ne;ne;nw;nw;jh 39;ne;e;n;ne;ne;n;ne;nw;ne;nw;event_1_17801939;place?星星峡;ne;ne;nw;nw;nw;w;jh 39;ne;e;n;ne;ne;se;jh 39;ne;e;n;ne;ne;se;e;jh 39;ne;e;n;ne;ne;se;e;jh 39;ne;e;n;ne;ne;se;e;e;jh 39;ne;e;n;ne;ne;se;e;n;jh 39;ne;e;n;ne;ne;se;e;n;jh 39;ne;e;n;ne;ne;se;e;s;e;se;jh 39;ne;e;n;nw;jh 39;ne;e;n;nw;nw;w;s;s;jh 39;ne;e;n;nw;nw;w;s;s;sw;n;nw;e;sw;w;jh 39;ne;e;n;nw;nw;w;s;s;sw;n;nw;e;sw;w;s;w;jh 39;ne;e;n;nw;nw;w;s;s;sw;n;nw;e;sw;w;s;w;n;w;event_1_69872740;",
          },
            {
            jh: "40", loc: "全图", name: "苗疆",
            way: "jh 40;s;s;s;s;jh 40;s;s;s;s;e;s;se;jh 40;s;s;s;s;e;s;se;sw;s;s;jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?澜沧江南岸;se;s;jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;e;jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;n;jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;w;w;jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;n;n;jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;n;n;e;jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;n;n;nw;jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;n;n;nw;ne;ne;nw;ne;e;jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;n;n;nw;ne;ne;nw;ne;e;jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;n;n;nw;ne;ne;se;se;jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;w;jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?澜沧江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;w;sw;jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?澜沧江南岸;se;s;s;s;jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?澜沧峡;sw;jh 40;s;s;s;s;e;s;se;sw;s;s;s;s;sw;jh 40;s;s;s;s;e;s;se;sw;s;s;s;s;sw;jh 40;s;s;s;s;w;w;w;jh 40;s;s;s;s;w;w;w;n;jh 40;s;s;s;s;w;w;w;w;jh 40;s;s;s;s;w;w;w;w;",
          },
            {
            jh: "41", loc: "全图", name: "白帝城",
            way: "jh 41;se;e;e;nw;nw;n;n;e;ne;e;jh 41;se;e;e;jh 41;se;e;e;ne;ne;se;e;e;ne;jh 41;se;e;e;ne;ne;se;e;e;s;w;jh 41;se;e;e;nw;nw;jh 41;se;e;e;nw;nw;n;n;e;ne;e;jh 41;se;e;e;nw;nw;n;n;e;ne;e;jh 41;se;e;e;nw;nw;n;n;e;ne;n;nw;n;jh 41;se;e;e;nw;nw;n;n;w;w;jh 41;se;e;e;nw;nw;n;n;w;w;n;n;e;jh 41;se;e;e;se;se;se;se;jh 41;se;e;e;se;se;se;se;s;s;jh 41;se;e;e;se;se;se;se;s;s;s;jh 41;se;e;e;se;se;se;se;s;s;s;e;jh 41;se;e;e;se;se;se;se;s;s;s;e;e;ne;jh 41;se;e;e;se;se;se;se;s;s;s;e;e;ne;event_1_7159906;w;nw;n;sw;s;nw;w;w;jh 41;se;e;e;se;se;se;se;se;se;event_1_57976870;e;e;jh 41;se;e;e;se;se;se;se;se;se;event_1_57976870;n;n;n;jh 41;se;e;e;se;se;se;se;se;se;event_1_57976870;w;w;w;",
          },
            {
            jh: "42", loc: "全图", name: "墨家机关城",
            way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818;e;n;e;s;e;n;nw;e;nw;e;jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818;e;n;e;s;e;n;nw;e;nw;n;e;jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818;e;n;e;s;e;n;nw;e;nw;n;ne;jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818;e;n;e;s;e;n;nw;e;nw;n;nw;jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818;e;n;e;s;e;n;nw;e;nw;n;w;jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818;e;n;e;s;e;n;nw;e;nw;sw;jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818;e;n;e;s;e;n;nw;e;nw;sw;sw;jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818;e;n;e;s;e;n;nw;e;nw;w;w;jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818;e;s;e;s;ne;s;sw;nw;s;se;s;e;e;jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818;e;s;e;s;ne;s;sw;nw;s;se;s;e;e;e;jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818;e;s;e;s;ne;s;sw;nw;s;se;s;sw;s;s;jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;n;w;jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;w;jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;w;jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;n;n;jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;n;n;jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;n;n;n;n;n;jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;w;w;n;e;jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;w;w;n;n;e;jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;w;w;n;n;n;e;",
          },
            {
            jh: "43", loc: "全图", name: "掩月城",
            way: "jh 43;n;ne;ne;n;e;e;se;se;e;ne;se;se;s;s;sw;s;sw;sw;sw;sw;event_1_67934650;jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;e;e;e;jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;e;e;jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;event_1_90371900;jh 43;jh 43;jh 43;jh 43;n;ne;ne;n;e;e;se;se;e;ne;jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;e;jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;e;e;jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;e;e;jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;e;e;e;jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;e;e;e;jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;e;e;e;event_1_89957254;ne;ne;se;s;s;s;jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;e;n;jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;e;n;n;jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;e;s;jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;e;s;s;jh 43;n;ne;ne;n;e;e;se;se;e;ne;se;se;s;s;sw;s;jh 43;n;ne;ne;n;e;e;se;se;e;ne;se;se;s;s;sw;s;sw;sw;sw;sw;jh 43;n;ne;ne;n;n;n;nw;jh 43;n;ne;ne;n;n;n;nw;n;jh 43;n;ne;ne;n;n;n;nw;n;jh 43;n;ne;ne;n;n;n;nw;n;ne;jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;nw;jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;nw;jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;nw;nw;jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;nw;nw;n;n;n;n;ne;ne;nw;ne;ne;n;n;jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;nw;nw;n;n;n;n;ne;ne;nw;ne;ne;n;n;ne;e;jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;nw;nw;n;n;n;n;ne;ne;nw;ne;ne;n;n;ne;e;se;se;jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;nw;nw;n;n;n;n;ne;ne;nw;ne;ne;n;n;ne;e;se;se;se;sw;sw;jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;nw;nw;n;n;n;n;ne;ne;nw;ne;ne;n;n;ne;e;se;se;se;sw;sw;jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;nw;nw;n;n;n;n;ne;ne;nw;ne;ne;n;n;ne;e;se;se;se;sw;sw;s;e;s;s;s;event_1_69228002;jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;sw;jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;sw;sw;jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;sw;sw;sw;s;s;jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;sw;sw;sw;s;s;s;jh 43;sw;jh 43;sw;sw;sw;s;se;se;se;jh 43;sw;sw;sw;s;se;se;se;e;jh 43;sw;sw;sw;s;se;se;se;e;e;jh 43;sw;sw;sw;s;se;se;se;e;n;jh 43;sw;sw;sw;s;se;se;se;e;s;sw;jh 43;sw;sw;sw;s;se;se;se;e;s;sw;jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;ne;jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;ne;ne;jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;ne;ne;nw;jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;ne;ne;nw;nw;jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;ne;ne;nw;nw;w;jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;se;jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;se;s;jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;se;s;s;jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;se;s;s;se;jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;se;s;s;se;jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;se;s;s;se;e;jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;se;s;s;sw;sw;jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;se;s;s;sw;sw;sw;jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;se;jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;se;ne;jh 43;sw;sw;sw;w;jh 43;sw;sw;sw;w;jh 43;sw;sw;sw;w;w;jh 43;w;jh 43;w;jh 43;w;n;jh 43;w;n;n;jh 43;w;n;n;jh 43;w;n;n;n;jh 43;w;n;n;n;ne;jh 43;w;n;n;n;ne;nw;nw;ne;jh 43;w;n;n;n;ne;nw;nw;ne;jh 43;w;n;n;n;ne;nw;nw;nw;jh 43;w;n;n;w;jh 43;w;n;n;w;jh 43;w;w;jh 43;w;w;jh 43;w;w;jh 43;w;w;w;jh 43;w;w;w;jh 43;w;w;w;n;jh 43;w;w;w;n;n;jh 43;w;w;w;n;n;jh 43;w;w;w;w;jh 43;w;w;w;w;nw;n;n;jh 43;w;w;w;w;nw;n;n;nw;jh 43;w;w;w;w;nw;n;n;nw;jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w;jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w;sw;jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w;sw;nw;sw;s;jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w;sw;nw;sw;s;sw;jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w;sw;nw;sw;s;sw;sw;sw;jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w;sw;nw;sw;s;sw;sw;sw;nw;n;jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w;sw;nw;sw;s;sw;sw;sw;nw;n;n;n;nw;jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w;sw;nw;sw;s;sw;sw;sw;nw;n;n;n;nw;nw;jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w;sw;nw;sw;s;sw;sw;sw;nw;n;n;n;nw;nw;n;jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w;sw;nw;sw;s;sw;sw;sw;nw;n;n;n;nw;nw;n;n;ne;jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w;sw;nw;sw;s;sw;sw;sw;nw;n;n;n;nw;nw;n;n;ne;ne;ne;",
          },
            {
            jh: "44", loc: "全图", name: "海云阁",
            way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;w;n;n;n;n;n;w;w;s;s;jh 44;jh 44;n;jh 44;n;n;jh 44;n;n;w;jh 44;n;n;w;jh 44;n;n;n;jh 44;n;n;n;n;jh 44;n;n;n;n;w;w;jh 44;n;n;n;n;e;ne;jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;w;jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;w;n;n;n;n;jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;w;n;n;n;n;n;jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;w;n;n;n;n;n;e;e;s;s;jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e;jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;wn;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e;;s;s;jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e;s;s;s;s;s;jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e;n;jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e;n;jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e;n;jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e;n;jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e;n;jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e;n;jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e;n;n;nw;w;w;nw;jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;n;w;n;n;n;n;w;n;w;w;n;n;n;jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;n;e;n;n;n;n;n;e;e;n;n;jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;e;e;e;e;e;e;n;n;jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;e;e;e;e;e;e;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;e;e;e;e;e;e;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;ne;jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;e;e;e;e;e;e;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;ne;ne;jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;e;e;e;e;e;e;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;ne;ne;e;se;se;se;jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;e;e;e;e;e;e;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;ne;ne;e;se;se;se;ne;ne;jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;e;e;e;e;e;e;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;ne;ne;e;se;se;se;ne;ne;n;n;n;n;nw;jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;e;e;e;e;e;e;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;ne;ne;e;se;se;se;ne;ne;n;n;n;n;nw;",
          },
            {
            jh: "45", loc: "全图", name: "幽冥山庄",
            way: "jh 45;ne;jh 45;ne;ne;n;n;jh 45;ne;ne;n;n;ne;ne;nw;nw;nw;n;n;n;jh 45;ne;ne;n;n;ne;ne;nw;nw;nw;n;n;n;n;jh 45;ne;ne;n;n;ne;ne;nw;nw;nw;n;n;n;n;jh 45;ne;ne;n;n;ne;ne;nw;nw;nw;n;n;n;n;jh 45;ne;ne;n;n;ne;ne;nw;nw;nw;n;n;n;n;jh 45;ne;ne;n;n;ne;ne;nw;nw;nw;n;n;n;n;e;jh 45;ne;ne;n;n;ne;ne;nw;nw;nw;n;n;n;n;n;jh 45;ne;ne;n;n;ne;ne;nw;nw;nw;n;n;n;n;n;jh 45;ne;ne;n;n;ne;ne;nw;nw;nw;n;n;n;n;w;jh 45;ne;ne;n;n;ne;ne;e;ne;n;jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;e;jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;e;jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;e;jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;e;jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;e;jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;e;e;jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;e;e;jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;nw;nw;jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;nw;nw;n;jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;nw;nw;n;jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;nw;nw;n;w;jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;nw;nw;n;e;e;jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;nw;nw;n;e;e;e;jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;nw;nw;n;e;e;e;jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;nw;nw;n;e;e;e;e;e;",
          },
            {
            jh: "46", loc: "全图", name: "花街",
            way: "jh 46;e;jh 46;e;jh 46;e;e;jh 46;e;e;e;jh 46;e;e;e;e;jh 46;e;e;e;e;e;jh 46;e;e;e;e;e;e;jh 46;e;e;e;e;e;e;e;jh 46;e;e;e;e;e;e;e;e;jh 46;e;e;e;e;e;e;e;e;n;jh 46;e;e;e;e;e;e;e;e;n;n;n;e;e;jh 46;e;e;e;e;e;e;e;e;n;n;n;e;e;e;jh 46;e;e;e;e;e;e;e;e;n;n;n;e;e;s;jh 46;e;e;e;e;e;e;e;e;n;n;n;e;e;n;jh 46;e;e;e;e;e;e;e;e;e;jh 46;e;e;e;e;e;e;e;e;e;jh 46;e;e;e;e;e;e;e;e;e;e;jh 46;e;e;e;e;e;e;e;e;e;e;e;jh 46;e;e;e;e;e;e;e;e;e;e;e;e;jh 46;e;e;e;e;e;e;e;e;e;e;e;e;e;jh 46;e;e;e;e;e;e;e;e;e;e;e;e;e;e;jh 46;e;e;e;e;e;e;e;e;e;e;e;e;e;e;e;",
          },
            {
            jh: "47", loc: "全图", name: "西凉城",
            way: "jh 47;ne;jh 47;ne;n;n;n;nw;jh 47;ne;n;n;n;nw;jh 47;ne;n;n;n;ne;ne;e;jh 47;ne;n;n;n;ne;ne;e;e;e;jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;se;jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;se;jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;se;s;jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;se;s;jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;se;s;s;jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;se;s;s;s;jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;e;e;n;n;n;n;n;jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;e;e;n;n;n;n;n;jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;e;e;n;n;n;n;n;jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;e;e;n;n;n;n;n;n;ne;n;jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;n;jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;n;n;n;jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;n;n;n;nw;nw;ne;n;ne;jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;n;n;n;nw;nw;ne;n;ne;n;jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;n;n;n;nw;nw;nw;jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;n;n;n;nw;nw;nw;jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;n;n;n;nw;nw;nw;nw;jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;w;w;jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;w;w;jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;w;w;w;",
          },{
            jh: "48", loc: "全图", name: "高昌迷宫",
            way: "jh 48;e;ne;jh 48;e;ne;jh 48;e;ne;jh 48;e;ne;jh 48;e;ne;jh 48;e;ne;ne;jh 48;e;ne;ne;se;jh 48;e;ne;ne;s;jh 48;e;se;jh 48;e;se;jh 48;e;se;se;e;ne;se;jh 48;e;se;se;e;ne;se;e;jh 48;e;se;se;e;ne;se;e;e;e;ne;se;se;s;jh 48;e;se;se;e;ne;se;e;e;e;ne;se;se;s;s;s;sw;jh 48;e;se;se;e;ne;se;e;e;e;ne;se;se;s;s;s;sw;sw;s;jh 48;e;se;se;e;ne;se;e;e;e;ne;se;se;s;s;s;sw;sw;s;sw;se;jh 48;e;se;se;e;ne;se;e;e;e;ne;ne;event_1_369927;jh 48;e;se;se;e;ne;se;e;e;e;ne;ne;event_1_369927;n;jh 48;e;se;se;e;ne;se;e;e;e;ne;ne;event_1_369927;n;n;n;jh 48;e;se;se;e;ne;se;e;e;e;ne;ne;event_1_369927;n;n;n;",
          },
            {
            jh: "49", loc: "全图", name: "京城",
            way: "rank go 194;s;se;rank go 194;s;se;se;rank go 194;s;se;se;se;e;rank go 194;s;se;se;se;e;s;s;s;rank go 194;s;se;se;se;e;s;s;s;e;se;e;e;n;n;nw;nw;n;rank go 194;s;se;se;se;e;s;s;s;e;se;e;e;n;n;n;n;n;rank go 194;s;se;se;se;e;s;s;s;e;se;e;e;n;n;n;n;n;rank go 194;s;se;se;se;e;s;s;s;e;se;e;e;n;n;n;n;n;rank go 194;s;se;se;se;e;s;s;s;e;se;e;e;n;n;ne;ne;n;n;nw;rank go 194;s;se;se;se;e;s;s;s;e;se;e;e;n;n;ne;ne;n;n;nw;rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e;rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e;rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e;e;rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e;e;rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e;e;s;rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e;e;s;rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e;e;s;rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e;e;s;rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e;e;e;rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e;e;e;rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e;e;e;e;rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e;e;e;e;rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e;e;e;e;n;rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e;e;e;e;n;rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w;rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w;s;rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w;s;rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w;s;rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w;n;rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w;n;rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w;n;rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w;n;rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w;n;rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w;w;rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w;w;w;rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w;w;w;s;rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w;w;w;w;rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w;w;w;w;w;rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w;w;w;w;w;n;rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;s;rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;s;rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;s;s;s;rank go 194;s;se;se;se;e;n;n;ne;e;rank go 194;s;se;se;se;e;n;n;ne;e;e;e;rank go 194;s;se;se;se;e;n;n;ne;e;e;e;s;s;s;rank go 194;s;se;se;se;e;n;n;ne;e;e;e;e;e;e;se;s;s;rank go 194;s;se;se;se;e;n;n;ne;e;e;e;e;e;e;se;s;s;e;e;e;s;s;",
          },
            {
            jh: "50", loc: "全图", name: "越王剑宫",
            way: "jh 50;jh 50;ne;jh 50;ne;ne;jh 50;ne;ne;n;n;jh 50;ne;ne;n;n;jh 50;ne;ne;n;n;jh 50;ne;ne;n;n;n;ne;jh 50;ne;ne;n;n;n;ne;jh 50;ne;ne;n;n;n;ne;jh 50;ne;ne;n;n;n;ne;ne;ne;jh 50;ne;ne;n;n;n;ne;ne;ne;n;jh 50;ne;ne;n;n;n;ne;ne;ne;n;n;jh 50;ne;ne;n;n;n;ne;ne;ne;n;n;jh 50;ne;ne;n;n;n;ne;ne;ne;n;n;n;jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;sw;sw;sw;jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;sw;sw;sw;jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;sw;sw;sw;jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;sw;sw;sw;jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;e;jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;e;jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;e;jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;e;jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;e;jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;e;jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;n;n;jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;n;n;n;n;jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;n;n;n;n;n;jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;n;n;n;n;n;n;jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;n;n;n;n;n;n;n;jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;n;n;n;n;n;n;n;jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;n;n;n;n;n;n;n;jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;n;n;n;n;n;n;n;n;jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;n;n;n;n;n;n;n;n;",
          },
            {
            jh: "51", loc: "全图", name: "江陵",
            way: "jh 51;jh 51;n;jh 51;n;n;jh 51;n;n;w;jh 51;n;n;w;jh 51;n;n;w;jh 51;n;n;e;jh 51;n;n;n;n;jh 51;n;n;n;n;jh 51;n;n;n;n;w;jh 51;n;n;n;n;w;w;jh 51;n;n;n;n;w;w;n;jh 51;n;n;n;n;w;w;n;n;jh 51;n;n;n;n;e;jh 51;n;n;n;n;e;e;e;jh 51;n;n;n;n;e;e;e;e;jh 51;n;n;n;n;e;e;e;e;s;jh 51;n;n;n;n;e;e;e;e;s;jh 51;n;n;n;n;e;e;e;e;s;s;jh 51;n;n;n;n;n;n;w;jh 51;n;n;n;n;n;n;n;nw;n;jh 51;n;n;n;n;n;n;n;nw;n;jh 51;n;n;n;n;e;e;e;e;n;n;jh 51;n;n;n;n;e;e;e;e;n;n;w;jh 51;n;n;n;n;e;e;e;e;n;n;w;jh 51;n;n;n;n;e;e;e;e;n;n;w;w;jh 51;n;n;n;n;e;e;e;e;n;n;w;w;jh 51;n;n;n;n;e;e;e;e;n;n;w;w;jh 51;n;n;n;n;e;e;e;e;n;n;e;jh 51;n;n;n;n;e;e;e;e;n;n;e;jh 51;n;n;n;n;e;e;e;e;n;n;n;n;jh 51;n;n;n;n;e;e;e;e;n;n;n;n;nw;n;jh 51;n;n;n;n;e;e;e;e;n;n;n;n;nw;n;n;n;jh 51;n;n;n;n;e;e;e;e;n;n;n;n;nw;n;n;n;e;e;jh 51;n;n;n;n;e;e;e;e;n;n;n;n;nw;n;n;n;e;e;e;e;e;se;event_1_1065178;jh 51;n;n;n;n;e;e;e;e;n;n;n;n;nw;n;n;n;e;e;e;e;e;se;event_1_1065178;se;se;jh 51;n;n;n;n;e;e;e;e;n;n;n;n;nw;n;n;n;e;e;e;e;e;se;event_1_1065178;se;se;jh 51;n;n;n;n;e;e;e;e;e;e;jh 51;n;n;n;n;e;e;e;e;e;e;s;jh 51;n;n;n;n;e;e;e;e;e;e;s;s;s;jh 51;n;n;n;n;e;e;e;e;e;e;s;s;s;se;se;jh 51;n;n;n;n;e;e;e;e;e;e;s;s;s;se;se;e;e;e;jh 51;n;n;n;n;e;e;e;e;e;e;e;e;jh 51;n;n;n;n;e;e;e;e;e;e;e;e;se;jh 51;n;n;n;n;e;e;e;e;e;e;e;e;se;e;e;jh 51;n;n;n;n;e;e;e;e;e;e;e;e;se;e;e;",
          },
            {
            jh: "52", loc: "全图", name: "天龙寺",
            way: "jh 52;jh 52;jh 52;ne;ne;;jh 52;ne;ne;n;;jh 52;ne;ne;n;n;;jh 52;ne;ne;n;n;;jh 52;ne;ne;n;n;n;nw;;jh 52;ne;ne;n;n;n;nw;nw;;jh 52;ne;ne;n;n;n;nw;nw;;jh 52;ne;ne;n;n;n;nw;nw;n;n;;jh 52;ne;ne;n;n;n;ne;ne;;jh 52;ne;ne;n;n;n;ne;ne;e;e;jh 52;ne;ne;n;n;n;ne;ne;e;e;jh 52;ne;ne;n;n;n;ne;ne;e;e;n;;jh 52;ne;ne;n;n;n;ne;ne;e;e;n;n;n;;jh 52;ne;ne;n;n;n;ne;ne;e;e;n;n;n;n;w;jh 52;ne;ne;n;n;n;ne;ne;e;e;n;n;n;n;w;nw;nw;n;;jh 52;ne;ne;n;n;n;ne;ne;e;e;n;n;n;n;w;nw;nw;n;n;;jh 52;ne;ne;n;n;n;ne;ne;e;e;n;n;n;n;w;nw;nw;n;n;;jh 52;ne;ne;n;n;n;ne;ne;e;e;n;n;n;n;n;;jh 52;ne;ne;n;n;n;ne;ne;e;e;n;n;n;n;n;event_1_15863945;;jh 52;ne;ne;n;n;n;ne;ne;e;e;n;n;n;n;n;n;n;;jh 52;ne;ne;n;n;n;ne;ne;e;e;n;n;n;n;n;n;n;n;;jh 52;ne;ne;n;n;n;ne;ne;e;e;n;n;n;n;n;n;n;n;;rank go 237;nw;n;n;n;n;n;n;nw;nw;n;rank go 237;nw;n;n;n;n;n;n;nw;rank go 237;nw;n;n;n;n;n;n;rank go 237;nw;n;n;n;n;n;n;rank go 237;nw;n;n;n;n;rank go 237;nw;n;n;n;n;w;rank go 237;nw;n;n;e;rank go 237;nw;n;n;e;rank go 237;nw;n;rank go 237;nw;n;w;rank go 237;nw;rank go 237;nw;jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;;jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;;jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;w;sw;s;s;jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;w;sw;s;s;sw;sw;;jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;w;sw;s;s;sw;sw;sw;se;;jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;w;sw;s;s;sw;sw;sw;se;se;se;;jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;e;ne;ne;n;n;n;ne;ne;nw;;jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;e;ne;ne;n;n;n;ne;ne;nw;ne;n;;jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;e;ne;ne;n;n;n;ne;ne;nw;ne;n;;jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;e;ne;ne;n;n;n;ne;ne;nw;ne;n;;jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;e;ne;ne;n;n;n;ne;ne;nw;ne;n;;jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;e;ne;ne;n;n;n;ne;ne;nw;ne;n;n;n;e;ne;;jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;e;ne;ne;n;n;n;ne;ne;nw;ne;n;n;n;n;n;n;;jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;e;ne;ne;n;n;n;ne;ne;nw;ne;n;n;n;n;n;n;;jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;e;ne;ne;n;n;n;ne;;jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;e;ne;ne;n;n;n;ne;ne;nw;ne;n;n;n;e;ne;e;ne;ne;",
          },
        ],
        SundayCart: [
          { jh: "雪亭镇", loc: "周日镖车", name: "淳风武馆大厅", way: "jh 1;e;n;e;e;e" },
          { jh: "洛阳", loc: "周日镖车", name: "问鼎街", way: "jh 2;n;n;n;n;n;w" },
          { jh: "洛阳", loc: "周日镖车", name: "城楼", way: "jh 2;n;n;n;n;n;n;n;n;w" },
          { jh: "洛阳", loc: "周日镖车", name: "绿竹林", way: "jh 2;n;n;n;n;n;n;n;n;n;e" },
          { jh: "华山村", loc: "周日镖车", name: "银杏广场", way: "jh 3;s;s" },
          { jh: "华山", loc: "周日镖车", name: "千尺幢", way: "jh 4;n;n;n;n" },
          { jh: "华山", loc: "周日镖车", name: "上天梯", way: "jh 4;n;n;n;n;n;n;n" },
          { jh: "扬州", loc: "周日镖车", name: "太平桥", way: "jh 5;n;w" },
          { jh: "扬州", loc: "周日镖车", name: "通泗桥", way: "jh 5;n;n;n;n;n;w" },
          { jh: "扬州", loc: "周日镖车", name: "虹桥", way: "jh 5;n;n;n;n;n;n;n;n;w" },
          { jh: "扬州", loc: "周日镖车", name: "梅船轩", way: "jh 5;n;n;n;n;n;n;n;n;n;e;s;e;s" },
          { jh: "乔阴县", loc: "周日镖车", name: "树王坟", way: "jh 7;s;s;s;s" },
          { jh: "乔阴县", loc: "周日镖车", name: "南门广场", way: "jh 7;s;s;s;s;s;s;s" },
          { jh: "峨眉山", loc: "周日镖车", name: "解剑碑", way: "jh 8;w;nw;n;n" },
          { jh: "峨眉山", loc: "周日镖车", name: "解脱坡", way: "jh 8;w;nw;n;n;n;n;e;e" },
          { jh: "峨眉山", loc: "周日镖车", name: "金顶", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;kill?看山弟子;n;n;n;n;w;n;n;n;n;n;n;n;n;n;nw;nw;n;n" },
          { jh: "恒山", loc: "周日镖车", name: "虎风口", way: "jh 9;n" },
          { jh: "恒山", loc: "周日镖车", name: "夕阳岭", way: "jh 9;n;n;e" },
          { jh: "恒山", loc: "周日镖车", name: "北岳殿", way: "jh 9;n;n;n;n" },
          { jh: "武当山", loc: "周日镖车", name: "三清殿", way: "jh 10;w;n;n;w;w;w;n;n;n" },
          { jh: "武当山", loc: "周日镖车", name: "武当广场", way: "jh 10;w;n;n;w;w;w;n;n;n;n" },
          { jh: "武当山", loc: "周日镖车", name: "武当广场", way: "jh 10;w;n;n;w;w;w;n;n;n;n" },
        ],
        Item: [
          { jh: "活动", loc: "物品", name: "匕首", way: "jh 1" },
          { jh: "活动", loc: "物品", name: "牛皮酒袋", way: "jh 1" },
          { jh: "活动", loc: "物品", name: "包子", way: "jh 1" },
          { jh: "活动", loc: "物品", name: "烤鸭腿", way: "jh 1" },
          { jh: "活动", loc: "物品", name: "星河剑", way: "jh 1;inn_op1" },
          { jh: "活动", loc: "物品", name: "蓑衣", way: "jh 1;e;s;w" },
          { jh: "活动", loc: "物品", name: "草鞋", way: "jh 1;e;s;w" },
          { jh: "活动", loc: "物品", name: "草帽", way: "jh 1;e;s;w" },
          { jh: "活动", loc: "物品", name: "布衣", way: "jh 1;e" },
          { jh: "活动", loc: "物品", name: "布鞋", way: "jh 1;e;s;w;s" },
          { jh: "活动", loc: "物品", name: "单刀", way: "jh 1;e;n;e" },
          { jh: "活动", loc: "物品", name: "粗布衣", way: "jh 1;e;n;e;e" },
          { jh: "活动", loc: "物品", name: "玄苏剑", way: "jh 1;e;n;e;e;e" },
          { jh: "活动", loc: "物品", name: "白缨冠", way: "jh 1;e;n;e;e;e" },
          { jh: "活动", loc: "物品", name: "狼皮雪靴", way: "jh 1;e;n;e;e;e" },
          { jh: "活动", loc: "物品", name: "丝绸马褂", way: "jh 1;e;n;e;e;e" },
          { jh: "活动", loc: "物品", name: "细剑", way: "jh 1;e;n;e;e;e;e;n" },
          { jh: "活动", loc: "物品", name: "绣花小鞋", way: "jh 1;e;n;e;e;e;e;n" },
          { jh: "活动", loc: "物品", name: "粉红绸衫", way: "jh 1;e;n;e;e;e;e;n" },
          { jh: "活动", loc: "物品", name: "旧书", way: "jh 1;e;n;n" },
          { jh: "活动", loc: "物品", name: "单刀", way: "jh 1;e;n;n;w" },
          { jh: "活动", loc: "物品", name: "铁锤", way: "jh 1;e;n;n;w" },
          { jh: "活动", loc: "物品", name: "皮鞭", way: "jh 1;e;n;n;w" },
          { jh: "活动", loc: "物品", name: "长枪", way: "jh 1;e;n;n;w" },
          { jh: "活动", loc: "物品", name: "长剑", way: "jh 1;e;n;n;w" },
          { jh: "活动", loc: "物品", name: "木杖", way: "jh 1;e;n;n;w" },
          { jh: "活动", loc: "物品", name: "飞镖", way: "jh 1;e;n;n;w" },
          { jh: "活动", loc: "物品", name: "木棍", way: "jh 1;e;n;n;w" },
          { jh: "活动", loc: "物品", name: "匕首", way: "jh 1;e;n;n;w" },
          { jh: "活动", loc: "物品", name: "铁锤", way: "jh 1;e;n;n;w" },
          { jh: "活动", loc: "物品", name: "铁项链", way: "jh 1;e;n;n;n;w" },
          { jh: "活动", loc: "物品", name: "铁斧", way: "jh 1;e;n;n;n;w" },
          { jh: "活动", loc: "物品", name: "刀法基础", way: "jh 1;e;n;n;n;w" },
          { jh: "活动", loc: "物品", name: "铁手镯", way: "jh 1;e;n;n;n;n;e" },
          { jh: "活动", loc: "物品", name: "铁戒", way: "jh 1;e;n;n;n;n;w" },
          { jh: "活动", loc: "物品", name: "", way: "" },
          { jh: "活动", loc: "物品", name: "单刀", way: "jh 2;n" },
          { jh: "活动", loc: "物品", name: "皮帽", way: "jh 2;n;n;e" },
          { jh: "活动", loc: "物品", name: "银项链", way: "jh 2;n;n;e;s;luoyang317_op1" },
          { jh: "活动", loc: "物品", name: "长剑", way: "jh 2;n;n;e;s;luoyang317_op1" },
          { jh: "活动", loc: "物品", name: "木棍", way: "jh 2;n;n;n" },
          { jh: "活动", loc: "物品", name: "鬼头刀", way: "jh 2;n;n;n;e;s" },
          { jh: "活动", loc: "物品", name: "画卷", way: "jh 2;n;n;n;n;e" },
          { jh: "活动", loc: "物品", name: "猪骨头", way: "jh 2;n;n;n;n;e;s" },
          { jh: "活动", loc: "物品", name: "猪上肉", way: "jh 2;n;n;n;n;e;s" },
          { jh: "活动", loc: "物品", name: "猪耳", way: "jh 2;n;n;n;n;e;s" },
          { jh: "活动", loc: "物品", name: "猪排骨", way: "jh 2;n;n;n;n;e;s" },
          { jh: "活动", loc: "物品", name: "绣鞋", way: "jh 2;n;n;n;n;w;s" },
          { jh: "活动", loc: "物品", name: "布衣", way: "jh 2;n;n;n;n;w;s" },
          { jh: "活动", loc: "物品", name: "丝绸衣", way: "jh 2;n;n;n;n;n;e;n" },
          { jh: "活动", loc: "物品", name: "玉竹杖", way: "jh 2;n;n;n;n;n;e;n;op1" },
          { jh: "活动", loc: "物品", name: "叫化鸡", way: "jh 2;n;n;n;n;n;e;n;op1" },
          { jh: "活动", loc: "物品", name: "钢剑", way: "jh 2;n;n;n;n;n;e;e;n;n;n;w" },
          { jh: "活动", loc: "物品", name: "兽皮鞋", way: "jh 2;n;n;n;n;n;e;e;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "兽皮鞋", way: "jh 2;n;n;n;n;n;w;w;n;w;get_silver" },
          { jh: "活动", loc: "物品", name: "银戒", way: "jh 2;n;n;n;n;n;w;w;n;n;n;e" },
          { jh: "活动", loc: "物品", name: "铁棍", way: "jh 2;n;n;n;n;n;w;s" },
          { jh: "活动", loc: "物品", name: "紫玫瑰", way: "jh 2;n;n;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "黑玫瑰", way: "jh 2;n;n;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "蓝玫瑰", way: "jh 2;n;n;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "黄玫瑰", way: "jh 2;n;n;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "红玫瑰", way: "jh 2;n;n;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "银手镯", way: "jh 2;n;n;n;n;n;n;n;n;w;luoyang14_op1" },
          { jh: "活动", loc: "物品", name: "", way: "" },
          { jh: "活动", loc: "物品", name: "波斯长袍", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "时光卷轴", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "银丝甲", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w;w" },
          { jh: "活动", loc: "物品", name: "精铁甲", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w;w" },
          { jh: "活动", loc: "物品", name: "匕首", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "冰糖葫芦", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;w" },
          { jh: "活动", loc: "物品", name: "糖葫芦", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;w" },
          { jh: "活动", loc: "物品", name: "银丝衣", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;e" },
          { jh: "活动", loc: "物品", name: "铁鞭", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n" },
          { jh: "活动", loc: "物品", name: "风花琼酿", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;w" },
          { jh: "活动", loc: "物品", name: "白色长袍", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n" },
          { jh: "活动", loc: "物品", name: "青玉令牌", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n;n" },
          { jh: "活动", loc: "物品", name: "黑色长袍", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n;n;n;e" },
          { jh: "活动", loc: "物品", name: "天龙枪", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n;n;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "观海令", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e" },
          { jh: "活动", loc: "物品", name: "精铁甲", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "飞羽剑", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "碧玉红裎带", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;n;n;n;w" },
          { jh: "活动", loc: "物品", name: "腰鼓", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;n;n;n;w" },
          { jh: "活动", loc: "物品", name: "", way: "" },
          { jh: "活动", loc: "物品", name: "闪避基础", way: "jh 3;w;event_1_59520311;n" },
          { jh: "活动", loc: "物品", name: "单刀", way: "jh 3;w;event_1_59520311;n" },
          { jh: "活动", loc: "物品", name: "油布包裹", way: "jh 3;w;event_1_59520311;n;n;n" },
          { jh: "活动", loc: "物品", name: "长剑", way: "jh 3;w;event_1_59520311;n;n;n" },
          { jh: "活动", loc: "物品", name: "钢丝甲衣", way: "jh 3;w;event_1_59520311;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "拆招基础", way: "jh 3;w;n" },
          { jh: "活动", loc: "物品", name: "银丝帽", way: "jh 3;s;e" },
          { jh: "活动", loc: "物品", name: "钢剑", way: "jh 3;s;e;n" },
          { jh: "活动", loc: "物品", name: "黑狗血", way: "jh 3;s;s;s" },
          { jh: "活动", loc: "物品", name: "金手镯", way: "jh 3;s;s;s;s;huashancun15_op1" },
          { jh: "活动", loc: "物品", name: "藏剑楼吊坠", way: "jh 3;s;s;s;s;huashancun15_op1;event_1_46902878" },
          { jh: "活动", loc: "物品", name: "银丝鞋", way: "jh 3;s;s;s;s;w;get_silver" },
          { jh: "活动", loc: "物品", name: "金项链", way: "jh 3;s;s;s;s;w;n" },
          { jh: "活动", loc: "物品", name: "长虹剑", way: "jh 3;s;s;s;s;s;e" },
          { jh: "活动", loc: "物品", name: "精铁棒", way: "jh 3;s;s;s;s;s;nw;n;n;e" },
          { jh: "活动", loc: "物品", name: "弯月刀", way: "jh 3;s;s;s;s;s;nw;n;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "", way: "" },
          { jh: "活动", loc: "物品", name: "白金项链", way: "jh 4;n;n;n;e" },
          { jh: "活动", loc: "物品", name: "长剑", way: "jh 4;n;n;n;e" },
          { jh: "活动", loc: "物品", name: "单刀", way: "jh 4;n;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "绿色长裙", way: "jh 4;n;n;n;n;n;n;n;n;w;s" },
          { jh: "活动", loc: "物品", name: "蛇胆草", way: "jh 4;n;n;n;n;n;n;n;n;w" },
          { jh: "活动", loc: "物品", name: "灰色长衫", way: "jh 4;n;n;n;n;n;n;n;n;w;w" },
          { jh: "活动", loc: "物品", name: "青色长衫", way: "jh 4;n;n;n;n;n;n;n;n;w;w;n" },
          { jh: "活动", loc: "物品", name: "白金戒指", way: "jh 4;n;n;n;n;n;n;n;n;n;e;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "紫霞秘笈", way: "jh 4;n;n;n;n;n;n;n;n;n;e;n;n;w" },
          { jh: "活动", loc: "物品", name: "白金手镯", way: "jh 4;n;n;n;n;n;n;n;n;n;e;n;n;n;n;e" },
          { jh: "活动", loc: "物品", name: "金丝鞋", way: "jh 4;n;n;n;n;n;n;n;event_1_91604710;s;s" },
          { jh: "活动", loc: "物品", name: "紫霞秘籍", way: "jh 4;n;n;n;n;n;n;n;n;n;n;n;n;w" },
          { jh: "活动", loc: "物品", name: "紫色长衫", way: "jh 4;n;n;n;n;n;n;n;n;n;n;n;n;n;get_silver" },
          { jh: "活动", loc: "物品", name: "金丝帽", way: "jh 4;n;n;n;n;n;n;n;n;n;n;n;n;e;s" },
          { jh: "活动", loc: "物品", name: "闪避基础", way: "jh 4;n;n;n;n;n;n;n;n;n;n;w;event_1_30014247" },
          { jh: "活动", loc: "物品", name: "", way: "" },
          { jh: "活动", loc: "物品", name: "长剑", way: "jh 5;n;n;e" },
          { jh: "活动", loc: "物品", name: "单刀", way: "jh 5;n;n;n" },
          { jh: "活动", loc: "物品", name: "银丝衣", way: "jh 5;n;n;n;e;n;n;n;e" },
          { jh: "活动", loc: "物品", name: "追风棍", way: "jh 5;n;n;n;n;n;n;e;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "青色道袍", way: "jh 5;n;n;n;n;n;w" },
          { jh: "活动", loc: "物品", name: "拂尘", way: "jh 5;n;n;n;n;n;w" },
          { jh: "活动", loc: "物品", name: "疾风剑", way: "jh 5;n;n;n;n;n;w;w;s;s" },
          { jh: "活动", loc: "物品", name: "割鹿刀", way: "jh 5;n;n;n;n;n;w;w;n;n;n" },
          { jh: "活动", loc: "物品", name: "尚书", way: "jh 5;n;n;n;n;n;e;n;n;n" },
          { jh: "活动", loc: "物品", name: "庄子", way: "jh 5;n;n;n;n;n;e;n;n;n" },
          { jh: "活动", loc: "物品", name: "老子", way: "jh 5;n;n;n;n;n;e;n;n;n" },
          { jh: "活动", loc: "物品", name: "", way: "" },
          { jh: "活动", loc: "物品", name: "竹杖", way: "jh 6;event_1_98623439" },
          { jh: "活动", loc: "物品", name: "钢刀", way: "jh 6;event_1_98623439;s" },
          { jh: "活动", loc: "物品", name: "大环刀", way: "jh 6;ask gaibang_qiu-wan;event_1_98623439;ne;ne;ask gaibang_mo-bu;sw;n;ne;ne;ask gaibang_he-bj" },
          { jh: "活动", loc: "物品", name: "宝玉帽", way: "jh 6;event_1_98623439;ne;n;ne;ne;ne" },
          { jh: "活动", loc: "物品", name: "", way: "" },
          { jh: "活动", loc: "物品", name: "长剑", way: "jh 7" },
          { jh: "活动", loc: "物品", name: "制服", way: "jh 7" },
          { jh: "活动", loc: "物品", name: "从寿衣撕下的布条", way: "jh 7" },
          { jh: "活动", loc: "物品", name: "大饼", way: "jh 7;s" },
          { jh: "活动", loc: "物品", name: "布衣", way: "jh 7;s" },
          { jh: "活动", loc: "物品", name: "黑水伏蛟", way: "jh 7;s" },
          { jh: "活动", loc: "物品", name: "包子", way: "jh 7;s;s;s" },
          { jh: "活动", loc: "物品", name: "乌檀木刀", way: "jh 7;s;s;s;s;event_1_65599392" },
          { jh: "活动", loc: "物品", name: "桃木箱", way: "jh 7;s;s;s;s;event_1_65599392;w;n" },
          { jh: "活动", loc: "物品", name: "玉带冠", way: "jh 7;s;s;s;s;s;s;e;n" },
          { jh: "活动", loc: "物品", name: "寒士列传", way: "jh 7;s;s;s;s;s;s;s;s;e" },
          { jh: "活动", loc: "物品", name: "银簪", way: "jh 7;s;s;s;s;s;s;s;s;e;n;e" },
          { jh: "活动", loc: "物品", name: "轻罗绸衫", way: "jh 7;s;s;s;s;s;s;s;s;e;n;e" },
          { jh: "活动", loc: "物品", name: "玉石琵琶", way: "jh 7;s;s;s;s;s;s;s;sw" },
          { jh: "活动", loc: "物品", name: "银簪", way: "jh 7;s;s;s;s;s;s;s;sw;w;n" },
          { jh: "活动", loc: "物品", name: "轻罗绸衫", way: "jh 7;s;s;s;s;s;s;s;sw;w;n" },
          { jh: "活动", loc: "物品", name: "风泉之剑", way: "jh 7;s;s;s;s;s;s;s;s;e;n;e;s;e" },
          { jh: "活动", loc: "物品", name: "", way: "" },
          { jh: "活动", loc: "物品", name: "布衣", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e" },
          { jh: "活动", loc: "物品", name: "长剑", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e" },
          { jh: "活动", loc: "物品", name: "宝玉鞋", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;n;n;n;n;e;e" },
          { jh: "活动", loc: "物品", name: "布衣", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;fight emei_shoushan;golook_room;n;eval_halt_move();golook_room;n;n;n;w" },
          { jh: "活动", loc: "物品", name: "铁甲", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;fight emei_shoushan;golook_room;n;eval_halt_move();golook_room;n;n;n;w" },
          { jh: "活动", loc: "物品", name: "绣花小鞋", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;fight emei_shoushan;golook_room;n;eval_halt_move();golook_room;n;n;n;w" },
          { jh: "活动", loc: "物品", name: "长剑", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;fight emei_shoushan;golook_room;n;eval_halt_move();golook_room;n;n;n;w" },
          { jh: "活动", loc: "物品", name: "豆腐", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;fight emei_shoushan;golook_room;n;eval_halt_move();golook_room;n;n;n;w" },
          { jh: "活动", loc: "物品", name: "金戒指", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;fight emei_shoushan;golook_room;n;eval_halt_move();golook_room;n;n;n;w" },
          { jh: "活动", loc: "物品", name: "葫芦", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;fight emei_shoushan;golook_room;n;eval_halt_move();golook_room;n;n;n;w" },
          { jh: "活动", loc: "物品", name: "包子", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;fight emei_shoushan;golook_room;n;eval_halt_move();golook_room;n;n;n;w" },
          { jh: "活动", loc: "物品", name: "馒头", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;fight emei_shoushan;golook_room;n;eval_halt_move();golook_room;n;n;n;w" },
          { jh: "活动", loc: "物品", name: "钢刀", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;fight emei_shoushan;golook_room;n;eval_halt_move();golook_room;n;n;n;w" },
          { jh: "活动", loc: "物品", name: "皮背心", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;fight emei_shoushan;golook_room;n;eval_halt_move();golook_room;n;n;n;w" },
          { jh: "活动", loc: "物品", name: "", way: "" },
          { jh: "活动", loc: "物品", name: "长剑", way: "jh 9;n" },
          { jh: "活动", loc: "物品", name: "单刀", way: "jh 9" },
          { jh: "活动", loc: "物品", name: "钻石项链", way: "jh 9;n;n;e" },
          { jh: "活动", loc: "物品", name: "鸡叫草", way: "jh 9;n;n;n;w" },
          { jh: "活动", loc: "物品", name: "钻石手镯", way: "jh 9;n;n;n;n;n;event_1_85624865;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "钻石戒指", way: "jh 9;n;n;n;n;n;n;n;n;n;w;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "", way: "" },
          { jh: "活动", loc: "物品", name: "短剑", way: "jh 10" },
          { jh: "活动", loc: "物品", name: "布衣", way: "jh 10" },
          { jh: "活动", loc: "物品", name: "长剑", way: "jh 10" },
          { jh: "活动", loc: "物品", name: "宝玉鞋", way: "jh 10;w;n;n;w;w" },
          { jh: "活动", loc: "物品", name: "灰色道袍", way: "jh 10;w;n;n;w;w;w;n;n;n" },
          { jh: "活动", loc: "物品", name: "道德经「第一章」", way: "jh 10;w;n;n;w;w;w;n;n;n;n;n;w;n" },
          { jh: "活动", loc: "物品", name: "道德经「上卷」", way: "jh 10;w;n;n;w;w;w;n;n;n;n;n;w;n" },
          { jh: "活动", loc: "物品", name: "真武剑", way: "jh 10;w;n;n;w;w;w;n;n;n;n;n;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "钢剑", way: "jh 10;w;n;n;w;w;w;n;n;n;n;n;e'" },
          { jh: "活动", loc: "物品", name: "水蜜桃", way: "jh 10;w;n;n;w;w;w;n;n;n;n;n;e;e;s" },
          { jh: "活动", loc: "物品", name: "香茶", way: "h 10;w;n;n;w;w;w;n;n;n;n;n;e;e;s" },
          { jh: "活动", loc: "物品", name: "青色道袍", way: "jh 10;w;n;n;w;w;w;n;n;n;n;n;e;e;s" },
          { jh: "活动", loc: "物品", name: "竹剑", way: "jh 10;w;n;n;w;w;w;n;n;n;n;n;e;e;e" },
          { jh: "活动", loc: "物品", name: "", way: "" },
          { jh: "活动", loc: "物品", name: "长鞭", way: "jh 11;e;e;s;sw" },
          { jh: "活动", loc: "物品", name: "舞蝶彩衫", way: "jh 11;e;e;s;sw" },
          { jh: "活动", loc: "物品", name: "魔鞭翩珑", way: "jh 11;e;e;s;sw;se;w" },
          { jh: "活动", loc: "物品", name: "穿花蛇影鞋", way: "jh 11;e;e;s;sw;se;w" },
          { jh: "活动", loc: "物品", name: "紫霜血蝉衣", way: "jh 11;e;e;s;sw;se;w" },
          { jh: "活动", loc: "物品", name: "软金束带", way: "jh 11;e;e;s;sw;se;w" },
          { jh: "活动", loc: "物品", name: "鹿皮小靴", way: "jh 11;e;e;s;sw;se;w;w;n;w" },
          { jh: "活动", loc: "物品", name: "绵裙", way: "jh 11;e;e;s;sw;se;w;w;n;w" },
          { jh: "活动", loc: "物品", name: "柳玉刀", way: "jh 11;e;e;s;sw;se;w;w;w;w" },
          { jh: "活动", loc: "物品", name: "绣花鞋", way: "jh 11;e;e;s;sw;se;w;w;w;w" },
          { jh: "活动", loc: "物品", name: "舞蝶彩衫", way: "jh 11;e;e;s;sw;se;w;w;w;w" },
          { jh: "活动", loc: "物品", name: "玉竹剑", way: "jh 11;e;e;s;sw;se;w;w;s;s;w" },
          { jh: "活动", loc: "物品", name: "银翅金簪", way: "jh 11;e;e;s;sw;se;w;w;s;s;w" },
          { jh: "活动", loc: "物品", name: "鹿皮小靴", way: "jh 11;e;e;s;sw;se;w;w;s;s;w" },
          { jh: "活动", loc: "物品", name: "青绫绸裙", way: "jh 11;e;e;s;sw;se;w;w;s;s;w" },
          { jh: "活动", loc: "物品", name: "宝蓝缎衫", way: "jh 11;e;e;s;sw;se;w;w;s;s;s;e;s;s;e" },
          { jh: "活动", loc: "物品", name: "钻石胸针", way: "jh 11;e;e;s;sw;se;w;w;s;s;s" },
          { jh: "活动", loc: "物品", name: "耳环", way: "jh 11;e;e;s;sw;se;w;w;s;s;s" },
          { jh: "活动", loc: "物品", name: "紫玉宝剑", way: "jh 11;e;e;s;sw;se;w;w;s;s;s;w;s;s;w" },
          //{ jh: "活动", loc: "物品", name: "碧玉红裎带", way: "jh 11;e;e;s;sw;se;w;w;s;s;s;w;s;s;w" },
          { jh: "活动", loc: "物品", name: "布裙", way: "jh 11;e;e;s;sw;se;w;w;s;s;s;w;s;s;w" },
          { jh: "活动", loc: "物品", name: "花针", way: "jh 11;e;e;s;sw;se;w;w;s;s;s;w;s;s;w" },
          { jh: "活动", loc: "物品", name: "绿罗裙", way: "jh 11;e;e;s;sw;se;w;w;s;s;s;e;s;s;w" },
          { jh: "活动", loc: "物品", name: "珍珠项链", way: "jh 11;e;e;s;sw;se;w;w;s;s;s;e;s;s;w;s;e" },
          { jh: "活动", loc: "物品", name: "绵裙", way: "jh 11;e;e;s;sw;se;s;s;s;w;s;s;se" },
          { jh: "活动", loc: "物品", name: "匕首", way: "jh 11;e;e;s;sw;se;s;s;s;w;s;s;se" },
          { jh: "活动", loc: "物品", name: "银翅金簪", way: " jh 11;e;e;s;sw;se;w;w;s;s;s;w;n;e;n" },
          { jh: "活动", loc: "物品", name: "鹿皮小靴", way: " jh 11;e;e;s;sw;se;w;w;s;s;s;w;n;e;n" },
          { jh: "活动", loc: "物品", name: "腰带", way: " jh 11;e;e;s;sw;se;w;w;s;s;s;w;n;e;n" },
          { jh: "活动", loc: "物品", name: "冰玉戒指", way: "jh 11;e;e;s;sw;se;s;s;s;w;s;s;w" },
          { jh: "活动", loc: "物品", name: "鹿皮小靴", way: "jh 11;e;e;s;sw;se;s;s;s;s;s" },
          { jh: "活动", loc: "物品", name: "青纱裙", way: "jh 11;e;e;s;sw;se;s;s;s;s;s" },
          { jh: "活动", loc: "物品", name: "腰带", way: "jh 11;e;e;s;sw;se;s;s;s;s;s" },
          { jh: "活动", loc: "物品", name: "银翅金簪", way: "jh 11;e;e;s;sw;se;w;w;s;s;e;e;e" },
          { jh: "活动", loc: "物品", name: "鹿皮小靴", way: "jh 11;e;e;s;sw;se;w;w;s;s;e;e;e" },
          { jh: "活动", loc: "物品", name: "腰带", way: "jh 11;e;e;s;sw;se;w;w;s;s;e;e;e" },
          { jh: "活动", loc: "物品", name: "长剑", way: "jh 11;e;e;s;sw;se;w;w;s;s;w;w;s" },
          { jh: "活动", loc: "物品", name: "黄金令牌", way: "jh 11;e;e;s;sw;se;w;w;s;s;w;w;s" },
          { jh: "活动", loc: "物品", name: "鹿皮小靴", way: "jh 11;e;e;s;sw;se;w;w;s;s;w;w;s" },
          { jh: "活动", loc: "物品", name: "绿罗裙", way: "jh 11;e;e;s;sw;se;w;w;s;s;w;w;s" },
          { jh: "活动", loc: "物品", name: "鹿皮小靴", way: "jh 11;e;e;s;sw;se;s;s;s;w;s" },
          { jh: "活动", loc: "物品", name: "绿罗裙", way: "jh 11;e;e;s;sw;se;s;s;s;w;s" },
          { jh: "活动", loc: "物品", name: "绣花针", way: "jh 11;e;e;s;sw;se;s;s;s;w;s" },
          { jh: "活动", loc: "物品", name: "鲜红锦衣", way: "jh 12;n;n;n" },
          { jh: "活动", loc: "物品", name: "邪剑穿灵", way: "jh 12;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "吹雪残云巾", way: "jh 12;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "吹雪残云衣", way: "jh 12;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "吹雪残云带", way: "jh 12;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "吹雪残云靴", way: "jh 12;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "长剑", way: "jh 12;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "鲜红锦衣", way: "jh 12;n;n;n;w;n;nw" },
          { jh: "活动", loc: "物品", name: "鲜红金乌冠", way: "jh 12;n;n;n;w;n;nw" },
          { jh: "活动", loc: "物品", name: "牛皮靴", way: "jh 12;n;n;n;w;n;nw" },
          { jh: "活动", loc: "物品", name: "水烟阁武士氅", way: "jh 12;n;n;n;w;n;nw" },
          { jh: "活动", loc: "物品", name: "水烟阁司事帽", way: "jh 12;n;n;n;w;n;nw;e" },
          { jh: "活动", loc: "物品", name: "水烟阁司事褂", way: "jh 12;n;n;n;w;n;nw;e" },
          { jh: "活动", loc: "物品", name: "妖刀狗屠", way: "jh 12;n;n;n;w;n;nw;e;n" },
          { jh: "活动", loc: "物品", name: "怒龙锦胄", way: "jh 12;n;n;n;w;n;nw;e;n" },
          { jh: "活动", loc: "物品", name: "", way: "" },
          { jh: "活动", loc: "物品", name: "小猪耳朵", way: "jh 13" },
          { jh: "活动", loc: "物品", name: "黄布袈裟", way: "jh 13" },
          { jh: "活动", loc: "物品", name: "长剑", way: "jh 13;n" },
          { jh: "活动", loc: "物品", name: "灰布镶边袈裟", way: "jh 13;n" },
          { jh: "活动", loc: "物品", name: "戒刀", way: "jh 13;n" },
          { jh: "活动", loc: "物品", name: "护法袈裟", way: "jh 13;n;n;n" },
          { jh: "活动", loc: "物品", name: "禅杖", way: "jh 13;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "青布镶边袈裟", way: "jh 13;n;n" },
          { jh: "活动", loc: "物品", name: "钢刀", way: "jh 13;n;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "青布僧衣", way: "jh 13;n;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "白布黑边袈裟", way: "jh 13;n;n;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "金边黑布袈裟", way: "jh 13;n;n;n;n;n;n;n;n;n;n;e" },
          { jh: "活动", loc: "物品", name: "宝玉鞋", way: "jh 13;n;n;n;n;n;n;n;n;n;n;e" },
          { jh: "活动", loc: "物品", name: "搏蛟拳套", way: "jh 13;n;n;n;n;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "齐眉棍", way: "jh 13;n;n;n;n;n;n;n;n;n;n;e;s;s;s;s;s;s" },
          { jh: "活动", loc: "物品", name: "断水剑", way: "jh 13;n;n;n;n;n;n;n;n;n;n;w;s;s;s;s;s;s;s;s" },
          { jh: "活动", loc: "物品", name: "金钟罩", way: "jh 13;n;n;n;n;n;n;n;n;n;n;n;n;w;n;get_silver" },
          { jh: "活动", loc: "物品", name: "长鞭", way: "jh 13;e;s;s;w;w;w" },
          { jh: "活动", loc: "物品", name: "", way: "" },
          { jh: "活动", loc: "物品", name: "钢剑", way: "jh 14;w;n" },
          { jh: "活动", loc: "物品", name: "布衣", way: "jh 14;w;n" },
          { jh: "活动", loc: "物品", name: "漫天花雨匕", way: "jh 14;w;n;n" },
          { jh: "活动", loc: "物品", name: "锦衣", way: "jh 14;w;n;n" },
          { jh: "活动", loc: "物品", name: "飞镖", way: "jh 14;w;n;n" },
          { jh: "活动", loc: "物品", name: "毒蒺藜", way: "jh 14;w;n;n;n" },
          { jh: "活动", loc: "物品", name: "银丝链甲衣", way: "jh 14;w;n;n;n;w;w;w" },
          { jh: "活动", loc: "物品", name: "竹剑", way: "jh 14;w;n;n;n;e;e;n;e" },
          { jh: "活动", loc: "物品", name: "钥匙", way: "jh 14;w;n;n;n;e;e;n;n" },
          { jh: "活动", loc: "物品", name: "丝衣", way: "jh 14;w;n;n;n;e;e;n;n" },
          { jh: "活动", loc: "物品", name: "回旋镖", way: "jh 14;w;n;n;n;e;e;n;n;ask tangmen_tangmei;ask tangmen_tangmei;e;event_1_8413183;event_1_39383240;e;s;e;n;w;n;n", },
          { jh: "活动", loc: "物品", name: "暗器手法", way: "jh 14;w;n;n;n;e;e;n;n;ask tangmen_tangmei;ask tangmen_tangmei;e;event_1_8413183;event_1_39383240;e;s;e" },
          { jh: "活动", loc: "物品", name: "暗器手法(下册)", way: "jh 14;w;n;n;n;e;e;n;n;ask tangmen_tangmei;ask tangmen_tangmei;e;event_1_8413183;event_1_39383240;e;s;e;n;w;n", },
          { jh: "活动", loc: "物品", name: "鬼赤剑", way: "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e" },
          { jh: "活动", loc: "物品", name: "浣花令", way: "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;e" },
          { jh: "活动", loc: "物品", name: "天命立心扇", way: "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;e;e;n" },
          { jh: "活动", loc: "物品", name: "萧瑟无晴剑", way: "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;e;e;n;ne" },
          { jh: "活动", loc: "物品", name: "玄冰经天剑", way: "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;e;e;n;ne;e" },
          { jh: "活动", loc: "物品", name: "微雨落花剑", way: "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;e;e;n;ne;e;se" },
          { jh: "活动", loc: "物品", name: "秋水长河剑", way: "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;e;e;n;ne;e;se;s;se" },
          { jh: "活动", loc: "物品", name: "洞庭观潮剑", way: "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;e;e;n;ne;e;se;s;se;e" },
          { jh: "活动", loc: "物品", name: "【紫狼刑天剑】", way: "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;e;e;n;ne;e;se;s;se;e;ne;n" },
          { jh: "活动", loc: "物品", name: "", way: "" },
          { jh: "活动", loc: "物品", name: "布衣", way: "jh 15" },
          { jh: "活动", loc: "物品", name: "长剑", way: "jh 15;n;nw;w;nw;w;s;s" },
          { jh: "活动", loc: "物品", name: "茶壶", way: "jh 15;n;nw;w;nw;w;s;s;s;w;w;n;w" },
          { jh: "活动", loc: "物品", name: "水蜜桃", way: "jh 15;n;nw;w;nw;w;s;s;s;w;w;n;e" },
          { jh: "活动", loc: "物品", name: "青锋剑", way: "jh 15;n;nw;w;nw;w;s;s;s;w;w;w" },
          { jh: "活动", loc: "物品", name: "青色道袍", way: "jh 15;n;nw;w;nw;w;s;s;s;w;w;w;n" },
          { jh: "活动", loc: "物品", name: "松子", way: "jh 15;n;nw;w;nw;w;s;s;s;w;w;w;n" },
          { jh: "活动", loc: "物品", name: "黄色道袍", way: "jh 15;n;nw;w;nw;w;s;s;s;w;w;w;n" },
          { jh: "活动", loc: "物品", name: "山猪肉", way: "jh 15;s;s;e" },
          { jh: "活动", loc: "物品", name: "紫花瓣儿", way: "jh 15;s;s;s;e" },
          { jh: "活动", loc: "物品", name: "轻罗绸衫", way: "jh 15;s;s;s;e" },
          { jh: "活动", loc: "物品", name: "蓝天鹅", way: "jh 15;s;s;s;e" },
          { jh: "活动", loc: "物品", name: "白玫瑰", way: "jh 15;s;s;s;e" },
          { jh: "活动", loc: "物品", name: "黄玫瑰", way: "jh 15;s;s;s;e" },
          { jh: "活动", loc: "物品", name: "紫罗兰", way: "jh 15;s;s;s;e" },
          { jh: "活动", loc: "物品", name: "满天星", way: "jh 15;s;s;s;e" },
          { jh: "活动", loc: "物品", name: "勿忘我", way: "jh 15;s;s;s;e" },
          { jh: "活动", loc: "物品", name: "周易", way: "jh 15;s;s;s;s;e" },
          { jh: "活动", loc: "物品", name: "春秋", way: "jh 15;s;s;s;s;e" },
          { jh: "活动", loc: "物品", name: "沉虹刀", way: "jh 15;s;s;s;s;s;e" },
          { jh: "活动", loc: "物品", name: "烧刀子", way: "jh 15;s;s;w" },
          { jh: "活动", loc: "物品", name: "井盐", way: "jh 15;s;s;w" },
          { jh: "活动", loc: "物品", name: "包子", way: "jh 15;s;s;w" },
          { jh: "活动", loc: "物品", name: "粉红布衫", way: "酒店女老板" },
          { jh: "活动", loc: "物品", name: "黄色劲服", way: "jh 15;s;s;s;w;w;s;s" },
          { jh: "活动", loc: "物品", name: "匕首", way: "jh 15;s;s;w;n" },
          { jh: "活动", loc: "物品", name: "红色劲服", way: "jh 15;s;s;s;w;w;s;s" },
          { jh: "活动", loc: "物品", name: "白色劲服", way: "jh 15;s;s;s;w;w;s;s" },
          { jh: "活动", loc: "物品", name: "牛皮盾", way: "jh 15;s;s;s;s;w" },
          { jh: "活动", loc: "物品", name: "皮鞭", way: "jh 15;s;s;s;s;w" },
          { jh: "活动", loc: "物品", name: "长剑", way: "jh 15;s;s;s;s;w" },
          { jh: "活动", loc: "物品", name: "飞镖", way: "jh 15;s;s;s;s;w" },
          { jh: "活动", loc: "物品", name: "匕首", way: "jh 15;s;s;s;s;w" },
          { jh: "活动", loc: "物品", name: "", way: "" },
          { jh: "活动", loc: "物品", name: "步步生莲", way: "jh 16;s;s;s;s;e;n;e;event_1_5221690;s;w" },
          { jh: "活动", loc: "物品", name: "芦苇", way: "jh 16;s;s;s;s;e;n;e;event_1_5221690;s;w" },
          { jh: "活动", loc: "物品", name: "羽衣霓裳", way: "jh 16;s;s;s;s;e;n;e;event_1_5221690;s;w" },
          { jh: "活动", loc: "物品", name: "小蒲团", way: "jh 16;s;s;s;s;e;n;e;event_1_5221690;s;w;event_1_57688376;n;n;w;w" },
          { jh: "活动", loc: "物品", name: "钢刀", way: "jh 16;s;s;s;s;e;e;s;w" },
          { jh: "活动", loc: "物品", name: "布衣", way: "jh 16;s;s;s;s;e;e;s;w" },
          { jh: "活动", loc: "物品", name: "", way: "" },
          { jh: "活动", loc: "物品", name: "单刀", way: "jh 17;event_1_97081006;s;s;s;s;s;w;kaifeng_yezhulin05_op1" },
          { jh: "活动", loc: "物品", name: "鹿角杖", way: "jh 17;event_1_97081006;s;s;s;s;s;w;w" },
          { jh: "活动", loc: "物品", name: "长剑", way: "jh 17;n;w" },
          { jh: "活动", loc: "物品", name: "布衣", way: "jh 17;n;n;w;n;n" },
          { jh: "活动", loc: "物品", name: "踏云棍", way: "jh 17;e;s;s;s;s;s" },
          { jh: "活动", loc: "物品", name: "", way: "" },
          { jh: "活动", loc: "物品", name: "布衣", way: "jh 18;w" },
          { jh: "活动", loc: "物品", name: "绿色圣衣", way: "jh 18;n;nw;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "棕色长衫", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n" },
          { jh: "活动", loc: "物品", name: "青色长衫", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "白色圣衣", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "兰色长衫", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;e;e" },
          { jh: "活动", loc: "物品", name: "长剑", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;e;e" },
          { jh: "活动", loc: "物品", name: "青锋宝刀", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;e;e;n" },
          { jh: "活动", loc: "物品", name: "金色长衫", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;e;e;n;n" },
          { jh: "活动", loc: "物品", name: "黄色长衫", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;w;w;n;n" },
          { jh: "活动", loc: "物品", name: "红色长衫", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;w;w" },
          { jh: "活动", loc: "物品", name: "竹剑", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;e" },
          { jh: "活动", loc: "物品", name: "银色长衫", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "紫色华服", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n;w" },
          { jh: "活动", loc: "物品", name: "单刀", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n;w" },
          { jh: "活动", loc: "物品", name: "珊瑚白菜", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n;w;nw" },
          { jh: "活动", loc: "物品", name: "麻辣豆腐", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n;w;nw" },
          { jh: "活动", loc: "物品", name: "清水葫芦", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n;w;nw" },
          { jh: "活动", loc: "物品", name: "圣火令", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "黑色长衫", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n;e" },
          { jh: "活动", loc: "物品", name: "", way: "" },
          { jh: "活动", loc: "物品", name: "布衣", way: "jh 19;s;s;s;sw;s;e" },
          { jh: "活动", loc: "物品", name: "白色道袍", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "钢剑", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "长剑", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;w;w;s" },
          { jh: "活动", loc: "物品", name: "道德经", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;w" },
          { jh: "活动", loc: "物品", name: "大剪刀", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;n;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "", way: "" },
          { jh: "活动", loc: "物品", name: "银钥匙", way: "jh 20;w;w;s;e;s;s;s;s;s;sw;sw;s;s;s;s;e;e" },
          { jh: "活动", loc: "物品", name: "淑女剑", way: "jh 20;w;w;s;e;s;s;s;s;s;sw;sw;s;s;s;s;e;e" },
          { jh: "活动", loc: "物品", name: "玉蜂浆", way: "jh 20;w;w;s;e;s;s;s;s;s;sw;sw;s;s;s;s;s;s" },
          { jh: "活动", loc: "物品", name: "玉蜂蜜", way: "jh 20;w;w;s;e;s;s;s;s;s;sw;sw;s;s;s;s;s;s" },
          { jh: "活动", loc: "物品", name: "玉蜂浆", way: "jh 20;w;w;s;e;s;s;s;s;s;sw;sw;s;s;s;s;s;s;s;e;e;e;e" },
          { jh: "活动", loc: "物品", name: "玉蜂蜜", way: "jh 20;w;w;s;e;s;s;s;s;s;sw;sw;s;s;s;s;s;s;s;e;e;e;e" },
          { jh: "活动", loc: "物品", name: "蜂浆瓶", way: "jh 20;w;w;s;e;s;s;s;s;s;sw;sw;s;s;s;s;s;s;s;e;e;e;e;s;e" },
          { jh: "活动", loc: "物品", name: "长剑", way: "jh 20;w;w;s;e;s;s;s;s;s;sw;sw;s;s;s;s;s;s;s;e;e;e;e;s;e" },
          { jh: "活动", loc: "物品", name: "布衣", way: "jh 20;w;w;s;e;s;s;s;s;s;sw;sw;s;s;s;s;s;s;s;e;e;e;e;s;e" },
          { jh: "活动", loc: "物品", name: "", way: "" },
          { jh: "活动", loc: "物品", name: "大刀", way: "jh 21;nw;ne;n;n;ne;n" },
          { jh: "活动", loc: "物品", name: "布衣", way: "jh 21;nw;ne;n;n;ne;w" },
          { jh: "活动", loc: "物品", name: "白色长袍", way: "h 21;nw;w" },
          { jh: "活动", loc: "物品", name: "草莓", way: "jh 21;nw;w;w" },
          { jh: "活动", loc: "物品", name: "兔肉", way: "jh 21;nw;w;w" },
          { jh: "活动", loc: "物品", name: "柴刀", way: "jh 21;nw;w;w;nw;nw;nw" },
          { jh: "活动", loc: "物品", name: "柴", way: "jh 21;nw;w;w;nw;nw;nw" },
          { jh: "活动", loc: "物品", name: "草莓", way: "jh 21;nw;w;w;nw;nw;nw;n;w;sw" },
          { jh: "活动", loc: "物品", name: "钢杖", way: "jh 21;nw;w;w;nw;n;n" },
          { jh: "活动", loc: "物品", name: "钢杖", way: "jh 21;nw;w;w;nw;n;n;n;w" },
          { jh: "活动", loc: "物品", name: "蛇杖", way: "jh 21;nw;w;w;nw;n;n;n;w" },
          { jh: "活动", loc: "物品", name: "青色丝袍", way: "jh 21;nw;w;w;nw;n;n;n;n;n;w;s" },
          { jh: "活动", loc: "物品", name: "豆浆", way: "jh 21;nw;w;w;nw;n;n;n;n;n;n;n;e" },
          { jh: "活动", loc: "物品", name: "兔肉", way: "jh 21;nw;w;w;nw;n;n;n;n;n;n;n;n;ne" },
          { jh: "活动", loc: "物品", name: "蛋糕", way: "jh 21;nw;w;w;nw;n;n;n;n;n;n;n;e" },
          { jh: "活动", loc: "物品", name: "", way: "" },
          { jh: "活动", loc: "物品", name: "单刀", way: "jh 22;n;n;w;n;n;n;n;event_1_88705407;s;s" },
          { jh: "活动", loc: "物品", name: "长剑", way: "jh 22;n;n;w;n;n;n;n;n;e" },
          { jh: "活动", loc: "物品", name: "天寒帽", way: "jh 22;n;n;w;n;n;n;n;event_1_88705407;s;s;s;s" },
          { jh: "活动", loc: "物品", name: "天寒项链", way: "jh 22;n;n;w;w;s;s;s;s;s" },
          { jh: "活动", loc: "物品", name: "天寒手镯", way: "jh 23;n;n;n;n;n;n;n;n;n;n;event_1_8188693;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "长剑", way: "jh 23;n;n" },
          { jh: "活动", loc: "物品", name: "单刀", way: "jh 23;n;n;n" },
          { jh: "活动", loc: "物品", name: "地牢钥匙", way: "jh 23;n;n;n;n;n;n;n;n;n;n;w;n" },
          { jh: "活动", loc: "物品", name: "天寒鞋", way: "jh 23;n;n;n;n;n;n;n;n;n;n;w;n;kill meizhuang_meizhuang10;s;e;s;s;s;w;w;give meizhuang_meizhuang3;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "天寒戒", way: "jh 23;n;n;n;n;n;n;n;n;n;n;w;n;kill meizhuang_meizhuang10;s;e;s;s;s;w;w;give meizhuang_meizhuang3;n;n;n;n;n;event_1_35389772", },
          { jh: "活动", loc: "物品", name: "", way: "" },
          { jh: "活动", loc: "物品", name: "单刀", way: "jh 24;n" },
          { jh: "活动", loc: "物品", name: "长剑", way: "jh 24;n;n;n" },
          { jh: "活动", loc: "物品", name: "新月棍", way: "jh 24;n;n;n;n;n;n;n;n;w;n;n;n" },
          { jh: "活动", loc: "物品", name: "飞羽剑", way: "jh 24;n;n;n;n;n;n;n;n;w;n;n;n;w;n;event_1_15941870;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "斩空刀", way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;e;e;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "软甲衣", way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;e;e;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "", way: "" },
          { jh: "活动", loc: "物品", name: "布衣", way: "jh 25;e;e;e" },
          { jh: "活动", loc: "物品", name: "铜哨", way: "jh 25;e;e;e;e;s" },
          { jh: "活动", loc: "物品", name: "茶壶", way: "jh 25;e;e;e;e;s;yell;n" },
          { jh: "活动", loc: "物品", name: "包子", way: "jh 25;e;e;e;e;s;yell;n" },
          { jh: "活动", loc: "物品", name: "彩衣", way: "jh 25;e;e;e;e;s;yell;e;ne;ask tieflag_qinggirl" },
          { jh: "活动", loc: "物品", name: "彩带", way: "jh 25;e;e;e;e;s;yell;e;ne;ask tieflag_qinggirl" },
          { jh: "活动", loc: "物品", name: "帝王剑", way: "jh 25;e;e;e;e;s;yell;s;e;event_1_81629028;s;e;n;w;w;ask tieflag_yedi" },
          { jh: "活动", loc: "物品", name: "丝衣", way: "jh 25;e;e;e;e;s;yell;s;e;event_1_81629028;s;e;n;w;w;ask tieflag_yedi" },
          { jh: "活动", loc: "物品", name: "彩帽", way: "jh 25;e;e;e;e;s;yell;s;e;event_1_81629028;s;e;n;w;w;s;w;ask tieflag_maggirl;ask tieflag_redgirl;ask tieflag_blugirl;ask tieflag_orggirl", },
          { jh: "活动", loc: "物品", name: "彩巾", way: "jh 25;e;e;e;e;s;yell;s;e;event_1_81629028;s;e;n;w;w;s;w;ask tieflag_maggirl;ask tieflag_redgirl;ask tieflag_blugirl;ask tieflag_orggirl", },
          { jh: "活动", loc: "物品", name: "彩镯", way: "jh 25;e;e;e;e;s;yell;s;e;event_1_81629028;s;e;n;w;w;s;w;ask tieflag_maggirl;ask tieflag_redgirl;ask tieflag_blugirl;ask tieflag_orggirl", },
          { jh: "活动", loc: "物品", name: "彩带", way: "jh 25;e;e;e;e;s;yell;s;e;event_1_81629028;s;e;n;w;w;s;w;ask tieflag_maggirl;ask tieflag_redgirl;ask tieflag_blugirl;ask tieflag_orggirl", },
          { jh: "活动", loc: "物品", name: "彩靴", way: "jh 25;e;e;e;e;s;yell;s;e;event_1_81629028;s;e;n;w;w;s;w;ask tieflag_maggirl;ask tieflag_redgirl;ask tieflag_blugirl;ask tieflag_orggirl", },
          { jh: "活动", loc: "物品", name: "彩衣", way: "jh 25;e;e;e;e;s;yell;s;e;event_1_81629028;s;e;n;w;w;s;w;ask tieflag_maggirl;ask tieflag_redgirl;ask tieflag_blugirl;ask tieflag_orggirl", },
          { jh: "活动", loc: "物品", name: "油垢斑斑的僧衣", way: "jh 11;e;e;s;n;nw;w;nw;e;e;e;n;w" },
          { jh: "活动", loc: "物品", name: "", way: "" },
          { jh: "活动", loc: "物品", name: "牧羊鞭", way: "jh 26;w;w;w;ask guanwai_sheepgirl2" },
          { jh: "活动", loc: "物品", name: "羊毛裙", way: "jh 26;w;w;w;ask guanwai_sheepgirl2" },
          { jh: "活动", loc: "物品", name: "三环禅杖", way: "jh 26;w;w;w;w;w" },
          { jh: "活动", loc: "物品", name: "大红僧袍", way: "jh 26;w;w;w;w;w" },
          { jh: "活动", loc: "物品", name: "破弯刀", way: "jh 26;w;w;w;w;w;w;s;e" },
          { jh: "活动", loc: "物品", name: "羊皮酒袋", way: "jh 26;w;w;w;w;w;w;s;e" },
          { jh: "活动", loc: "物品", name: "烤羊腿", way: "jh 26;w;w;w;w;w;w;s;e" },
          { jh: "活动", loc: "物品", name: "玉戒指", way: "jh 26;w;w;w;w;w;w;s;e" },
          { jh: "活动", loc: "物品", name: "蛇药", way: "jh 26;w;w;w;w;w;w;s;e" },
          { jh: "活动", loc: "物品", name: "布袋", way: "jh 26;w;w;w;w;w;w;s;e" },
          { jh: "活动", loc: "物品", name: "木禅杖", way: "jh 26;w;w;w;w;w;w;s;e" },
          { jh: "活动", loc: "物品", name: "破剑", way: "jh 26;w;w;w;w;w;w;s;e" },
          { jh: "活动", loc: "物品", name: "垃圾", way: "jh 26;w;w;w;w;w;w;s;s;w;w;w;w" },
          { jh: "活动", loc: "物品", name: "木禅杖", way: "jh 26;w;w;w;w;w;w;s;s;w;w;w;w" },
          { jh: "活动", loc: "物品", name: "破弯刀", way: "jh 26;w;w;w;w;w;w;s;s;w;w;w;w" },
          { jh: "活动", loc: "物品", name: "舍利子", way: "jh 26;w;w;w;w;w;w;s;s;w;w;w;w" },
          { jh: "活动", loc: "物品", name: "破剑", way: "jh 26;w;w;w;w;w;w;s;s;w;w;w;w" },
          { jh: "活动", loc: "物品", name: "大红尼袍", way: "jh 26;w;w;w;w;w;w;n" },
          { jh: "活动", loc: "物品", name: "紫金杖", way: "jh 26;w;w;w;w;w;w;w;w;w;w" },
          { jh: "活动", loc: "物品", name: "大红袈裟", way: "jh 26;w;w;w;w;w;w;w;w;w;w" },
          { jh: "活动", loc: "物品", name: "九环禅杖", way: "jh 26;w;w;w;w;w;w;w;w;w;w;ask lama_master;event_1_91837538" },
          { jh: "活动", loc: "物品", name: "", way: "" },
          { jh: "活动", loc: "物品", name: "船篙", way: "jh 27;ne;nw;w;nw;w;w" },
          { jh: "活动", loc: "物品", name: "布衣", way: "jh 27;ne;nw;w;nw;w;w" },
          { jh: "活动", loc: "物品", name: "日月神教腰牌", way: "jh 27;ne;nw;w;nw;w;w" },
          { jh: "活动", loc: "物品", name: "银锤", way: "jh 27;ne;nw;w;nw;w;w;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "长戟", way: "jh 27;ne;nw;w;nw;w;w;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "长刀", way: "jh 27;ne;nw;w;nw;w;w;yell;w;nw;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "长枪", way: "jh 27;ne;nw;w;nw;w;w;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n" },
          {
            jh: "活动", loc: "物品", name: "大光明经", way: "jh 27;ne;nw;w;nw;w;w;kill heimuya_shaogong;golook_room;eval_AutoGet1();yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;w;n",
          },
          { jh: "活动", loc: "物品", name: "木剑", way: "jh 27;ne;nw;w;nw;w;w;kill heimuya_shaogong;golook_room;eval_AutoGet1();yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;w;n;n", },
          { jh: "活动", loc: "物品", name: "长戟", way: "jh 27;ne;nw;w;nw;w;w;kill heimuya_shaogong;golook_room;eval_AutoGet1();yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;w;nw", },
          { jh: "活动", loc: "物品", name: "木戟", way: "jh 27;ne;nw;w;nw;w;w;kill heimuya_shaogong;golook_room;eval_AutoGet1();yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;w;nw;n", },
          { jh: "活动", loc: "物品", name: "五股钢叉", way: "jh 27;ne;nw;w;nw;w;w;kill heimuya_shaogong;golook_room;eval_AutoGet1();yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;w;ne", },
          { jh: "活动", loc: "物品", name: "木叉", way: "jh 27;ne;nw;w;nw;w;w;kill heimuya_shaogong;golook_room;eval_AutoGet1();yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;w;ne;n", },
          {
            jh: "活动", loc: "物品", name: "长鞭", way: "jh 27;ne;nw;w;nw;w;w;kill heimuya_shaogong;golook_room;eval_AutoGet1();yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;w;w",
          },
          { jh: "活动", loc: "物品", name: "竹鞭", way: "jh 27;ne;nw;w;nw;w;w;kill heimuya_shaogong;golook_room;eval_AutoGet1();yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;w;w;n", },
          { jh: "活动", loc: "物品", name: "吴钩", way: "jh 27;ne;nw;w;nw;w;w;kill heimuya_shaogong;golook_room;eval_AutoGet1();yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;w;sw", },
          { jh: "活动", loc: "物品", name: "木钩", way: "jh 27;ne;nw;w;nw;w;w;kill heimuya_shaogong;golook_room;eval_AutoGet1();yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;w;sw", },
          { jh: "活动", loc: "物品", name: "长枪", way: "jh 27;ne;nw;w;nw;w;w;kill heimuya_shaogong;golook_room;eval_AutoGet1();yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;w;se", },
          { jh: "活动", loc: "物品", name: "木枪", way: "jh 27;ne;nw;w;nw;w;w;kill heimuya_shaogong;golook_room;eval_AutoGet1();yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;w;se", },
          { jh: "活动", loc: "物品", name: "长刀", way: "jh 27;ne;nw;w;nw;w;w;kill heimuya_shaogong;golook_room;eval_AutoGet1();yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;ne", },
          { jh: "活动", loc: "物品", name: "木刀", way: "jh 27;ne;nw;w;nw;w;w;kill heimuya_shaogong;golook_room;eval_AutoGet1();yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;ne", },
          { jh: "活动", loc: "物品", name: "吴钩", way: "jh 27;ne;nw;w;nw;w;w;kill heimuya_shaogong;golook_room;eval_AutoGet1();yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;n", },
          { jh: "活动", loc: "物品", name: "天魔刀", way: "jh 27;ne;nw;w;nw;w;w;kill heimuya_shaogong;golook_room;eval_AutoGet1();yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;w", },
          { jh: "活动", loc: "物品", name: "横断钩", way: "jh 27;ne;nw;w;nw;w;w;kill heimuya_shaogong;golook_room;eval_AutoGet1();yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;w;w", },
          { jh: "活动", loc: "物品", name: "无极戟", way: "jh 27;ne;nw;w;nw;w;w;kill heimuya_shaogong;golook_room;eval_AutoGet1();yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;w;w;w", },
          { jh: "活动", loc: "物品", name: "夺魄叉", way: "jh 27;ne;nw;w;nw;w;w;kill heimuya_shaogong;golook_room;eval_AutoGet1();yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w", },
          { jh: "活动", loc: "物品", name: "天龙枪", way: "jh 27;ne;nw;w;nw;w;w;kill heimuya_shaogong;golook_room;eval_AutoGet1();yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;e;e", },
          { jh: "活动", loc: "物品", name: "天怒斧", way: "jh 27;ne;nw;w;nw;w;w;kill heimuya_shaogong;golook_room;eval_AutoGet1();yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;e;e;e", },
          { jh: "活动", loc: "物品", name: "无心锤", way: "jh 27;ne;nw;w;nw;w;w;kill heimuya_shaogong;golook_room;eval_AutoGet1();yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e", },
          { jh: "活动", loc: "物品", name: "狂风鞭", way: "jh 27;ne;nw;w;nw;w;w;kill heimuya_shaogong;golook_room;eval_AutoGet1();yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e", },
          { jh: "活动", loc: "物品", name: "绣花针", way: "jh 27;ne;nw;w;nw;w;w;kill heimuya_shaogong;golook_room;eval_AutoGet1();yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;n;n;event_1_57107759;e;e;n;w", },
          { jh: "活动", loc: "物品", name: "绣花鞋", way: "jh 27;ne;nw;w;nw;w;w;kill heimuya_shaogong;golook_room;eval_AutoGet1();yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;n;n;event_1_57107759;e;e;n;w", },
          { jh: "活动", loc: "物品", name: "红色绸裙", way: "jh 27;ne;nw;w;nw;w;w;kill heimuya_shaogong;golook_room;eval_AutoGet1();yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;n;n;event_1_57107759;e;e;n;w", },
          { jh: "活动", loc: "物品", name: "", way: "" },
          { jh: "活动", loc: "物品", name: "钢杖", way: "jh 28;n;n" },
          { jh: "活动", loc: "物品", name: "铜鼓", way: "jh 28;n;n" },
          { jh: "活动", loc: "物品", name: "铜号", way: "jh 28;n;n" },
          { jh: "活动", loc: "物品", name: "铜钹", way: "jh 28;n;n" },
          { jh: "活动", loc: "物品", name: "粉红绸衫", way: "jh 28;n;n;n;n;n;n;nw;w" },
          { jh: "活动", loc: "物品", name: "维吾尔族长袍", way: "jh 28;n" },
          { jh: "活动", loc: "物品", name: "羊鞭", way: "jh 28;n" },
          { jh: "活动", loc: "物品", name: "清心散", way: "jh 28;n;w" },
          { jh: "活动", loc: "物品", name: "羊肉串", way: "jh 28;n;w;n;n;n;" },
          { jh: "活动", loc: "物品", name: "药锄", way: "jh 28;n;w;w" },
          { jh: "活动", loc: "物品", name: "天山雪莲", way: "jh 28;n;w;w" },
          { jh: "活动", loc: "物品", name: "钢剑", way: "jh 28;n;w;w;w;w" },
          { jh: "活动", loc: "物品", name: "小牛腰子", way: "jh 28;n;w;w;w;w;n;w;w;nw;ne;nw;w" },
          { jh: "活动", loc: "物品", name: "阿拉伯弯刀", way: "jh 28" },
          { jh: "活动", loc: "物品", name: "波斯长袍", way: "jh 28" },
          { jh: "活动", loc: "物品", name: "长鞭", way: "jh 28;nw;nw" },
          { jh: "活动", loc: "物品", name: "火折", way: "jh 28;nw;w" },
          { jh: "活动", loc: "物品", name: "马奶酒壶", way: "jh 28;nw;w" },
          { jh: "活动", loc: "物品", name: "冬不拉", way: "jh 28;nw;w" },
          { jh: "活动", loc: "物品", name: "哈密瓜", way: "jh 28;nw;w" },
          { jh: "活动", loc: "物品", name: "馕", way: "jh 28;nw;w" },
          { jh: "活动", loc: "物品", name: "", way: "" },
          { jh: "活动", loc: "物品", name: "暗灵", way: "jh 29;n;n;n;n;eval_MaoShanWuZhongFunc();eval_halt_move();n" },
          { jh: "活动", loc: "物品", name: "桃木剑", way: "jh 29;n;n;n;n;eval_MaoShanJindongFunc();eval_halt_move();n;n;n;n;n;n;e" },
          { jh: "活动", loc: "物品", name: "长剑", way: "jh 29;n;n;n;n;eval_MaoShanJindongFunc();eval_halt_move();n;n;n;n;n;n;n;event_1_98579273" },
          { jh: "活动", loc: "物品", name: "三清神冠", way: "jh 29;n;n;n;n;eval_MaoShanJindongFunc();eval_halt_move();n;n;n;n;n;n;n;event_1_98579273" },
          { jh: "活动", loc: "物品", name: "七星翻云靴", way: "jh 29;n;n;n;n;eval_MaoShanJindongFunc();eval_halt_move();n;n;n;n;n;n;n;event_1_98579273" },
          { jh: "活动", loc: "物品", name: "天师道袍", way: "jh 29;n;n;n;n;eval_MaoShanJindongFunc();eval_halt_move();n;n;n;n;n;n;n;event_1_98579273" },
          { jh: "活动", loc: "物品", name: "咒剑王□", way: "jh 29;n;n;n;n;eval_MaoShanJindongFunc();eval_halt_move();n;n;n;n;n;n;n;event_1_98579273;n" },
          { jh: "活动", loc: "物品", name: "桃木剑", way: "h 29;n;n;n;n;eval_MaoShanJindongFunc();eval_halt_move();n;n;n;n;n;n;n;event_1_98579273;n;e" },
          { jh: "活动", loc: "物品", name: "桃符纸", way: "h 29;n;n;n;n;eval_MaoShanJindongFunc();eval_halt_move();n;n;n;n;n;n;n;event_1_98579273;n;e" },
          { jh: "活动", loc: "物品", name: "", way: "" },
          { jh: "活动", loc: "物品", name: "钢剑", way: "jh 30" },
          { jh: "活动", loc: "物品", name: "长剑", way: "jh 30;n;n;ne" },
          { jh: "活动", loc: "物品", name: "布衣", way: "jh 30;n;n;ne" },
          { jh: "活动", loc: "物品", name: "怒火浪心剑", way: "jh 30;n;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "竹剑", way: "jh 30;n;n;n;n;n;n;n;n;n;n;w;w" },
          { jh: "活动", loc: "物品", name: "玉箫", way: "jh 30;n;n;n;n;n;n;n;n;n;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "九阴真经摹本", way: "jh 30;n;n;n;n;n;n;n;n;n;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "竹杖", way: "jh 30;n;n;n;n;n;n;n;n;n;n;n;n;n;n;se;s" },
          { jh: "活动", loc: "物品", name: "", way: "" },
          { jh: "活动", loc: "物品", name: "铁斧", way: "jh 31;n;n;n" },
          { jh: "活动", loc: "物品", name: "布衣", way: "jh 31;n;n;n" },
          { jh: "活动", loc: "物品", name: "细剑", way: "jh 31;n;n;n;w;w;w;w;n;n" },
          { jh: "活动", loc: "物品", name: "飞花逐月之带", way: "jh 31;n;n;n;w;w;w;w;n;n" },
          { jh: "活动", loc: "物品", name: "粗布鹅黄袍", way: "jh 31;n;n;n;w;w;w;w;n;n;n" },
          { jh: "活动", loc: "物品", name: "虞姬剑", way: "jh 31;n;n;n;w;w;w;w;n;n;n" },
          { jh: "活动", loc: "物品", name: "粗布白袍", way: "jh 31;n;n;n;w;w;w;w;n;n;n" },
          { jh: "活动", loc: "物品", name: "垓下刀", way: "jh 31;n;n;n;w;w;w;w;n;n;n" },
          { jh: "活动", loc: "物品", name: "细剑", way: "jh 31;n;n;n;w;w;w;w;n;n;n" },
          { jh: "活动", loc: "物品", name: "绣花小鞋", way: "jh 31;n;n;n;w;w;w;w;n;n;n" },
          { jh: "活动", loc: "物品", name: "粉红绸衫", way: "jh 31;n;n;n;w;w;w;w;n;n;n" },
          { jh: "活动", loc: "物品", name: "白棋子", way: "jh 31;n;n;n;w;w;w;w;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "黑布袍", way: "jh 31;n;n;n;w;w;w;w;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "黑棋子", way: "jh 31;n;n;n;w;w;w;w;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "白布袍", way: "jh 31;n;n;n;w;w;w;w;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "内功心法秘笈", way: "jh 31;n;n;n;w;w;w;w;n;n;n;n;e" },
          { jh: "活动", loc: "物品", name: "竹剑", way: "jh 31;n;n;n;w;w;w;w;n;n;n;n;e" },
          { jh: "活动", loc: "物品", name: "竹刀", way: "jh 31;n;n;n;w;w;w;w;n;n;n;n;e" },
          { jh: "活动", loc: "物品", name: "", way: "" },
          { jh: "活动", loc: "物品", name: "长剑", way: "jh 32;n;n" },
          { jh: "活动", loc: "物品", name: "布衣", way: "jh 32;n;n" },
          { jh: "活动", loc: "物品", name: "古铜缎子袄裙", way: "jh 32;n;n;se;n" },
          { jh: "活动", loc: "物品", name: "拐杖", way: "jh 32;n;n;se;n" },
          { jh: "活动", loc: "物品", name: "七星剑", way: "jh 32;n;n;se;n;n;n;n;w;w;n" },
          { jh: "活动", loc: "物品", name: "银色丝带", way: "jh 32;n;n;se;n;n;n;n;w;w;w;n;w;n;e;n;e;n;e" },
          { jh: "活动", loc: "物品", name: "藕色纱衫", way: "jh 32;n;n;se;n;n;n;n;w;w;w;n;w;n;e;n;e;n;e" },
          { jh: "活动", loc: "物品", name: "鹅黄绸衫", way: "jh 32;n;n;se;n;n;n;n;w;w;w;n;w;n;e;n;e;n;n" },
          { jh: "活动", loc: "物品", name: "", way: "" },
          { jh: "活动", loc: "物品", name: "白衣", way: "jh 33;sw;sw" },
          { jh: "活动", loc: "物品", name: "钢刀", way: "jh 33;sw;sw;s;s" },
          { jh: "活动", loc: "物品", name: "黄衣军服", way: "jh 33;sw;sw;s;s" },
          { jh: "活动", loc: "物品", name: "钢剑", way: "jh 33;sw;sw;s;s" },
          { jh: "活动", loc: "物品", name: "铁甲", way: "jh 33;sw;sw;s;s" },
          { jh: "活动", loc: "物品", name: "台夷头巾", way: "jh 33;sw;sw;s;s;s;nw;n" },
          { jh: "活动", loc: "物品", name: "台夷短裙", way: "jh 33;sw;sw;s;s;s;nw;n" },
          { jh: "活动", loc: "物品", name: "乌夷大麾", way: "jh 33;sw;sw;s;s;s;nw;n;nw;n" },
          { jh: "活动", loc: "物品", name: "布衣", way: "jh 33;sw;sw;s;s;s;nw;n;nw;n" },
          { jh: "活动", loc: "物品", name: "乌夷长裙", way: "jh 33;sw;sw;s;s;s;nw;n;nw;n;n;n;n;e;e" },
          { jh: "活动", loc: "物品", name: "灰布镶边袈裟", way: "jh 33;sw;sw;s;s;s;s;w;w;n" },
          { jh: "活动", loc: "物品", name: "钢杖", way: "jh 33;sw;sw;s;s;s;s;w;w;n;s" },
          { jh: "活动", loc: "物品", name: "羊羔坐臀", way: "jh 33;sw;sw;s;s;s;s;w;w;w;w;w;n;n" },
          { jh: "活动", loc: "物品", name: "药锄", way: "jh 33;sw;sw;s;s;s;s;w;w;s" },
          { jh: "活动", loc: "物品", name: "长剑", way: "jh 33;sw;sw;s;s;s;s;s;w" },
          { jh: "活动", loc: "物品", name: "白绸衫", way: "jh 33;sw;sw;s;s;s;s;s;w;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "钓杆", way: "jh 33;sw;sw;s;s;s;s;s;e;n" },
          { jh: "活动", loc: "物品", name: "落第秀才", way: "jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e;e;e" },
          { jh: "活动", loc: "物品", name: "八仙过海", way: "jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e;e;se" },
          { jh: "活动", loc: "物品", name: "满月", way: "jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e;e;ne" },
          { jh: "活动", loc: "物品", name: "八宝妆", way: "jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e;e;ne" },
          { jh: "活动", loc: "物品", name: "眼儿媚", way: "jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e;e;ne" },
          { jh: "活动", loc: "物品", name: "红妆素裹", way: "jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e;e;ne;se" },
          { jh: "活动", loc: "物品", name: "倚栏娇", way: "jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e;e;ne;se" },
          { jh: "活动", loc: "物品", name: "抓破美人脸", way: "jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e;e;ne;se" },
          { jh: "活动", loc: "物品", name: "板斧", way: "jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e;n;n" },
          { jh: "活动", loc: "物品", name: "茶壶", way: "jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e;n;n;w" },
          { jh: "活动", loc: "物品", name: "大理雪梨", way: "jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e;n;n;w" },
          { jh: "活动", loc: "物品", name: "断云斧", way: "jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e;n;n;n;ne;n" },
          { jh: "活动", loc: "物品", name: "铁锤", way: "jh 33;sw;sw;s;s;s;s;s;s;e;e" },
          { jh: "活动", loc: "物品", name: "云南火腿", way: "jh 33;sw;sw;s;s;s;s;s;s;s;e" },
          { jh: "活动", loc: "物品", name: "烧鸡", way: "jh 33;sw;sw;s;s;s;s;s;s;s;e" },
          { jh: "活动", loc: "物品", name: "瑶琴", way: "jh 33;sw;sw;s;s;s;s;s;s;s;e;n" },
          { jh: "活动", loc: "物品", name: "窄裉袄", way: "jh 33;sw;sw;s;s;s;s;s;s;s;e;n" },
          { jh: "活动", loc: "物品", name: "护法袈裟", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;s;s" },
          { jh: "活动", loc: "物品", name: "台夷头巾", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;s;s;se;sw;n" },
          { jh: "活动", loc: "物品", name: "圆领小袄", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;s;s;se;sw;n" },
          { jh: "活动", loc: "物品", name: "筒裙", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;s;s;se;sw;w" },
          { jh: "活动", loc: "物品", name: "毛毯", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;sw;sw;n" },
          { jh: "活动", loc: "物品", name: "砍刀", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;sw;sw;w" },
          { jh: "活动", loc: "物品", name: "铁笛", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;w;w;se;n" },
          { jh: "活动", loc: "物品", name: "钢刀", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;w;w;se;n" },
          { jh: "活动", loc: "物品", name: "紫袍", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;w;w;se;n" },
          { jh: "活动", loc: "物品", name: "铁甲", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;w;w;se;n" },
          { jh: "活动", loc: "物品", name: "蛮刀", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;w;w;se;n;n;e;e;se" },
          { jh: "活动", loc: "物品", name: "虎皮", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;w;w;se;n;n;e;e;se" },
          { jh: "活动", loc: "物品", name: "贝壳项链", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;n;w;n" },
          { jh: "活动", loc: "物品", name: "青色道袍", way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;s;w" },
          { jh: "活动", loc: "物品", name: "金边黑布袈裟", way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;e;e;e;n" },
          { jh: "活动", loc: "物品", name: "拂尘", way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;s;w;n" },
          { jh: "活动", loc: "物品", name: "摆夷短裙", way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;e;e;se;e;e;s" },
          { jh: "活动", loc: "物品", name: "乌夷长裙", way: "jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e;e;e" },
          { jh: "活动", loc: "物品", name: "", way: "" },
          { jh: "活动", loc: "物品", name: "黑色棋子", way: "jh 34;ne;e;e;e;e;e;n;e;n" },
          { jh: "活动", loc: "物品", name: "白袍", way: "jh 34;ne;e;e;e;e;e;n;e;n" },
          { jh: "活动", loc: "物品", name: "白色棋子", way: "jh 34;ne;e;e;e;e;e;n;e;n" },
          { jh: "活动", loc: "物品", name: "黑袍", way: "jh 34;ne;e;e;e;e;e;n;e;n" },
          { jh: "活动", loc: "物品", name: "袈裟", way: "jh 34;ne;e;e;e;e;e;n;n;n;n;n;w" },
          { jh: "活动", loc: "物品", name: "布衣", way: "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell" },
          { jh: "活动", loc: "物品", name: "船桨", way: "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell" },
          { jh: "活动", loc: "物品", name: "天剑", way: "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;e;e" },
          { jh: "活动", loc: "物品", name: "天剑战袍", way: "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;e;e" },
          { jh: "活动", loc: "物品", name: "梦里听涛剑", way: "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;w;w" },
          { jh: "活动", loc: "物品", name: "长袍", way: "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;w;w" },
          { jh: "活动", loc: "物品", name: "梦里流星剑", way: "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;w;s;w" },
          { jh: "活动", loc: "物品", name: "梦里望月剑", way: "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;n;e;n;e" },
          { jh: "活动", loc: "物品", name: "天蓝丝裙", way: "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;n;e;n;e" },
          { jh: "活动", loc: "物品", name: "梦里寻梦剑", way: "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;n;n;w;w" },
          { jh: "活动", loc: "物品", name: "断剑", way: "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "梦里拔雾剑", way: "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "", way: "" },
          { jh: "活动", loc: "物品", name: "钢剑", way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e" },
          { jh: "活动", loc: "物品", name: "灰色道袍", way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e" },
          { jh: "活动", loc: "物品", name: "獐腿肉", way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e" },
          { jh: "活动", loc: "物品", name: "鹿茸", way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e" },
          { jh: "活动", loc: "物品", name: "钢剑", way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;s;se;w;nw;s;s;s;s;s;s;e" },
          { jh: "活动", loc: "物品", name: "丝绸衣", way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;s;se;w;nw;s;s;s;s;s;s;e" },
          { jh: "活动", loc: "物品", name: "真武剑", way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;s;se;w;nw;s;s;s;s;s;s;w;w;n;e;n;w;w;s;s" },
          { jh: "活动", loc: "物品", name: "青色道袍", way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;s;se;w;nw;s;s;s;s;s;s;w;w;n;e;n;w;w;s;s" },
          { jh: "活动", loc: "物品", name: "长虹剑", way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n" },
          { jh: "活动", loc: "物品", name: "紫霜血蝉衣", way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n" },
          { jh: "活动", loc: "物品", name: "鬼头刀", way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;ne;n" },
          { jh: "活动", loc: "物品", name: "灰布镶边袈裟", way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;w;n;w;nw;sw;se;s;sw;sw;se;se" },
          { jh: "活动", loc: "物品", name: "", way: "" },
          { jh: "活动", loc: "物品", name: "鬼头刀", way: "jh 36;yell" },
          { jh: "活动", loc: "物品", name: "钢剑", way: "jh 36;yell;e;ask xiakedao_zhangsan" },
          { jh: "活动", loc: "物品", name: "鹿皮手套", way: "jh 36;yell;e;ne;ne;ask xiakedao_yunyougaoseng" },
          { jh: "活动", loc: "物品", name: "单刀", way: "jh 36;yell;e;se;e;e;s;s;s;e;ne;e;e;n;e;n;ask xiakedao_laohaidao" },
          { jh: "活动", loc: "物品", name: "长虹剑", way: "jh 37;n;e;e;nw;nw;w;n;nw;n;n;ne;n;nw" },
          { jh: "活动", loc: "物品", name: "暗箭", way: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;nw" },
          { jh: "活动", loc: "物品", name: "鬼头刀", way: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;nw;n;nw;n;nw" },
          { jh: "活动", loc: "物品", name: "钢剑", way: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;nw;ne;n;ne" },
          { jh: "活动", loc: "物品", name: "鹿皮手套", way: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;ne;ne;se;s;s;s;w" },
          { jh: "活动", loc: "物品", name: "鬼头刀", way: "jh 38;n;n;n;n;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "长剑", way: "jh 38;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "毒琥珀", way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;se;s" },
          { jh: "活动", loc: "物品", name: "藏怨汁", way: "s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;se;s;s;e;n;n;e;s;e;ne;s;sw;e" },
          { jh: "活动", loc: "物品", name: "石斧", way: "jh 41;se;e;e;nw;nw;n;n;e;ne;e" },
          { jh: "活动", loc: "物品", name: "暗香灯盏", way: "jh 43;w;n;n;n;ne;nw" },
          { jh: "活动", loc: "物品", name: "粉金小炉", way: "jh 43;w;n;n;n;ne;nw;nw;nw" },
          { jh: "活动", loc: "物品", name: "", way: "" },
          { jh: "活动", loc: "物品", name: "精铁斧", way: "jh 46;e" },
          { jh: "活动", loc: "物品", name: "钢刀", way: "jh 46;e" },
          { jh: "活动", loc: "物品", name: "破甲锤", way: " jh 46;e;e" },
          { jh: "活动", loc: "物品", name: "银丝长鞭", way: " jh 46;e;e;e" },
          { jh: "活动", loc: "物品", name: "铁鞭", way: " jh 46;e;e;e;e" },
          { jh: "活动", loc: "物品", name: "飞镖", way: "jh 46;e;e;e;e;e" },
          { jh: "活动", loc: "物品", name: "星河剑", way: "jh 46;e;e;e;e;e;e" },
          { jh: "活动", loc: "物品", name: "点钢枪", way: "jh 46;e;e;e;e;e;e;e" },
          { jh: "活动", loc: "物品", name: "单刀", way: "jh 46;e;e;e;e;e;e;e;e;e" },
          { jh: "活动", loc: "物品", name: "长剑", way: " jh 46;e;e;e;e;e;e;e;e;e" },
          { jh: "活动", loc: "物品", name: "铁锤", way: "jh 46;e;e;e;e;e;e;e;e;e;e;e;e" },
          { jh: "活动", loc: "物品", name: "铁鞭", way: "jh 46;e;e;e;e;e;e;e;e;e;e;e;e;e" },
          { jh: "活动", loc: "物品", name: "亮银枪", way: "jh 46;e;e;e;e;e;e;e;e;e;e;e;e;e;e" },
          { jh: "活动", loc: "物品", name: "霸王戟", way: "jh 46;e;e;e;e;e;e;e;e;n" },
          { jh: "活动", loc: "物品", name: "单刀", way: "jh 46;e;e;e;e;e;e;e;e;n;n;n;e;e" },
          { jh: "活动", loc: "物品", name: "", way: "" },
          { jh: "活动", loc: "物品", name: "长剑", way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;se" },
          { jh: "活动", loc: "物品", name: "弯月刀", way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;se;s" },
          { jh: "活动", loc: "物品", name: "飞镖", way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;se;s;s" },
          { jh: "活动", loc: "物品", name: "铁锤", way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;e;e;n;n;n;n;" },
          { jh: "活动", loc: "物品", name: "青铜斧", way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;e;e;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "鬼头刀", way: "jh 48;e;se" },
          { jh: "活动", loc: "物品", name: "狼牙棒", way: "jh 48;e;se;se;e;ne;se;e;e;e;ne;ne;event_1_369927;n;n;n" },
          { jh: "活动", loc: "物品", name: "章台柳谏集", way: "jh 49;n;n;n;n;n;w;w;w;w;w;w;n" },
          { jh: "活动", loc: "物品", name: "长剑", way: "jh 49;n;n;n;n;n;e" },
          { jh: "活动", loc: "物品", name: "皮鞭", way: "jh 49;n;n;n;n;n;e;e" },
          { jh: "活动", loc: "物品", name: "飞镖", way: "jh 49;n;n;n;n;n;e;e" },
          { jh: "活动", loc: "物品", name: "搏蛟拳套", way: "jh 49;n;n;n;n;n;e;e;s" },
          { jh: "活动", loc: "物品", name: "丝绸掌套", way: "jh 49;n;n;n;n;n;e;e;e" },
          { jh: "活动", loc: "物品", name: "单刀", way: "jh 49;n;n;n;n;n;e;e;e" },
          { jh: "活动", loc: "物品", name: "钢杖", way: "jh 49;n;n;n;n;n;e;e;e;e" },
          { jh: "活动", loc: "物品", name: "青铜斧", way: "jh 49;n;n;n;n;n;e;e;e;e" },
          { jh: "活动", loc: "物品", name: "", way: "" },
          { jh: "活动", loc: "物品", name: "『荀子』", way: "jh 51;n" },
          { jh: "活动", loc: "物品", name: "金饭碗", way: " jh 51;n;n" },
          { jh: "活动", loc: "物品", name: "精铁秤砣", way: "jh 51;n;n;w" },
          { jh: "活动", loc: "物品", name: "旧毛巾", way: "jh 51;n;n;w" },
          { jh: "活动", loc: "物品", name: "米袋", way: "jh 51;n;n;w" },
          { jh: "活动", loc: "物品", name: "抓破猫儿脸", way: " jh 51;n;n;e" },
          { jh: "活动", loc: "物品", name: "猫耳钗", way: " jh 51;n;n;e" },
          { jh: "活动", loc: "物品", name: "精钢砍刀", way: "jh 51;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "护心镜", way: "jh 51;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "仙桃蒸三元", way: "jh 51;n;n;n;n;w" },
          { jh: "活动", loc: "物品", name: "酒壶", way: "jh 51;n;n;n;n;w;w" },
          { jh: "活动", loc: "物品", name: "燕子风筝", way: "jh 51;n;n;n;n;w;w;n" },
          { jh: "活动", loc: "物品", name: "翡翠小壶", way: "jh 51;n;n;n;n;w;w;n;n" },
          { jh: "活动", loc: "物品", name: "弯月刀", way: "jh 51;n;n;n;n;e;e;e;e" },
          { jh: "活动", loc: "物品", name: "猛虎战甲", way: "jh 51;n;n;n;n;e;e;e;e;s" },
          { jh: "活动", loc: "物品", name: "疾风剑", way: "jh 51;n;n;n;n;e;e;e;e;s" },
          { jh: "活动", loc: "物品", name: "点钢枪", way: "jh 51;n;n;n;n;e;e;e;e;s" },
          { jh: "活动", loc: "物品", name: "虎啸刀", way: "jh 51;n;n;n;n;e;e;e;e;s" },
          { jh: "活动", loc: "物品", name: "诸葛行军散", way: "jh 51;n;n;n;n;e;e;e;e;s;s" },
          { jh: "活动", loc: "物品", name: "霹雳弹", way: "jh 51;n;n;n;n;n;n;w" },
          { jh: "活动", loc: "物品", name: "五味子", way: "jh 51;n;n;n;n;n;n;n;nw;n" },
          { jh: "活动", loc: "物品", name: "锄头", way: "jh 51;n;n;n;n;n;n;n;nw;n" },
          { jh: "活动", loc: "物品", name: "割鹿刀", way: "jh 51;n;n;n;n;e;e;e;e;n;n;w" },
          { jh: "活动", loc: "物品", name: "峨嵋刺", way: "h 51;n;n;n;n;e;e;e;e;n;n;w;w" },
          { jh: "活动", loc: "物品", name: "马蹄铁", way: "jh 51;n;n;n;n;e;e;e;e;n;n;w;w" },
          { jh: "活动", loc: "物品", name: "渔网", way: "jh 51;n;n;n;n;e;e;e;e;n;n;e" },
          { jh: "活动", loc: "物品", name: "明月银钩", way: "jh 51;n;n;n;n;e;e;e;e;n;n;e" },
          { jh: "活动", loc: "物品", name: "小算盘", way: "jh 51;n;n;n;n;e;e;e;e;n;n;e" },
          { jh: "活动", loc: "物品", name: "蟒蛇胆", way: "jh 51;n;n;n;n;e;e;e;e;n;n;n;n;nw;n;n;n;e;e;e;e;e;se;event_1_1065178" },
          { jh: "活动", loc: "物品", name: "疾风剑", way: " jh 51;n;n;n;n;e;e;e;e;n;n;n;n;nw;n;n;n;e;e;e;e;e;se;event_1_1065178;se;se" },
          { jh: "活动", loc: "物品", name: "毒蛤蟆肉", way: "h 51;n;n;n;n;e;e;e;e;e;e;s;s;s;se;se" },
          { jh: "活动", loc: "物品", name: "钧红花釉", way: "h 51;n;n;n;n;e;e;e;e;e;e;s;s;s;se;se;e;e;e" },
          { jh: "活动", loc: "物品", name: "桃花肚兜", way: "jh 51;n;n;n;n;e;e;e;e;e;e;e;e" },
          { jh: "活动", loc: "物品", name: "碎饼子", way: "jh 51;n;n;n;n;e;e;e;e;e;e;e;e;se;e;e" },
          { jh: "活动", loc: "物品", name: "砒霜", way: "jh 51;n;n;n;n;e;e;e;e;e;e;e;e;se;e;e" },
          { jh: "活动", loc: "物品", name: "", way: "" },
          { jh: "活动", loc: "物品", name: "拨浪鼓", way: "jh 52" },
          { jh: "活动", loc: "物品", name: "小竹竿", way: "jh 52" },
          { jh: "活动", loc: "物品", name: "羚牛角", way: "jh 52;ne;ne" },
          { jh: "活动", loc: "物品", name: "点苍长衫", way: "jh 52;ne;ne;n" },
          { jh: "活动", loc: "物品", name: "南云长剑", way: "jh 52;ne;ne;n" },
          { jh: "活动", loc: "物品", name: "格斗拳套", way: "jh 52;ne;ne;n;n" },
          { jh: "活动", loc: "物品", name: "GE1龟纹豹皮", way: "jh 52;ne;ne;n;n;n;nw" },
          { jh: "活动", loc: "物品", name: "蝶纱", way: " jh 52;ne;ne;n;n;n;nw;nw" },
          { jh: "活动", loc: "物品", name: "劈山斧", way: "jh 52;ne;ne;n;n;n;nw;nw;n;n" },
          { jh: "活动", loc: "物品", name: "苗巫指环", way: "jh 52;ne;ne;n;n;n;ne;ne" },
          { jh: "活动", loc: "物品", name: "杜鹃花", way: "jh 52;ne;ne;n;n;n;ne;ne" },
          { jh: "活动", loc: "物品", name: "疾风剑", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e" },
          { jh: "活动", loc: "物品", name: "峨嵋刺", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;n;n;n;n;w;nw;nw;n;n" },
          { jh: "活动", loc: "物品", name: "麻布僧衣", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "流云剑", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;n;n;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "金边龙纹僧衣", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;n;n;n;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "天龙降魔禅杖", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;n;n;n;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "天罗紫芳衣", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762" },
          { jh: "活动", loc: "物品", name: "朽木", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s" },
          { jh: "活动", loc: "物品", name: "苍纹暗灰僧衣", way: " jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;w;sw;s;s" },
          { jh: "活动", loc: "物品", name: "大青树叶", way: " jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;w;sw;s;s" },
          { jh: "活动", loc: "物品", name: "戒棍", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;w;sw;s;s;sw;sw" },
          { jh: "活动", loc: "物品", name: "割鹿刀", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;e;ne;ne;n;n;n;ne;ne;nw;ne;n" },
          { jh: "活动", loc: "物品", name: "疾风剑", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;e;ne;ne;n;n;n;ne;ne;nw;ne;n" },
          { jh: "活动", loc: "物品", name: "银丝长鞭", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;e;ne;ne;n;n;n;ne;ne;nw;ne;n" },
          { jh: "活动", loc: "物品", name: "破甲锤", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;e;ne;ne;n;n;n;ne;ne;nw;ne;n" },
          { jh: "活动", loc: "物品", name: "黑手魔拳", way: " jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;e;ne;ne;n;n;n;ne;ne;nw;ne;n;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "美人扇", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;e;ne;ne;n;n;n;ne;ne;nw;ne;n;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "离别钩", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;e;ne;ne;n;n;n;ne;ne;nw;ne;n;n;n;e;ne" },
          { jh: "活动", loc: "物品", name: "天命采魂帽", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;e;ne;ne;n;n;n;ne;ne;nw;ne;n;n;n;e;ne" },
          { jh: "活动", loc: "物品", name: "南瓜盅", way: "rank go 235;nw;n;n;n;n;n;n;nw;nw;n" },
          { jh: "活动", loc: "物品", name: "三湘盟主令", way: "rank go 235;nw;n;n;n;n;n;n" },
          { jh: "活动", loc: "物品", name: "离别钩", way: "rank go 235;nw;n;n;n;n;w" },
          { jh: "活动", loc: "物品", name: "碧玉骰子", way: "rank go 235;nw;n;n;e" },
          { jh: "活动", loc: "物品", name: "弥勒衫", way: "rank go 235;nw;n;n;e" },
          { jh: "活动", loc: "物品", name: "金漆盘", way: "rank go 235;nw" },
        ],
      },
      dailyList: [
        { n: "西凉铁剑", v: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;n;n;n;nw;nw;ne;n;ne;n;event_1_10117215;" },
        { n: "云远寺", v: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;s;s;s;s;e;event_1_2215721;" },
        { n: "四大绝杀", v: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;n;e;n;n;n;n;n;w;w;n;n;n;n;n;n;n;n;event_1_33144912;" },
        { n: "十八木人", v: "jh 41;se;e;e;se;se;se;se;se;se;event_1_57976870;n;n;n;event_1_91914705;e;e;e;" },
        { n: "剑宫白猿", v: "rank go 204;e;s;s;s;s;s;s;s;s;w;w;n;n;n;n;nw;nw;nw;n;n;n;attrs;attrs;attrs;event_1_86676244;" },
        { n: "闯入冥庄", v: "jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;nw;nw;n;e;e;e;e;e;event_1_77775145" },
        { n: "去通天塔", v: "rank go 193" },
        { n: "去红螺寺", v: "rank go 194" },
        { n: "去越女剑楼", v: "rank go 204" },
        { n: "去铸剑洞", v: "rank go 210" },
        { n: "去霹雳门", v: "rank go 222" },
        { n: "去葬剑谷", v: "rank go 223" },
        { n: "去无湘楼", v: "rank go 231" },
        { n: "去藏典塔", v: "rank go 232" },
        { n: "去魔皇殿", v: "rank go 236" },
        { n: "去名将堂", v: "rank go 262" },
        { n: "去一品堂", v: "rank go 296" },
        { n: "去无为寺", v: "jh 54;#4 nw;#2 w;#8 n;#2 ne;#2 nw;#6 n;" },
        { n: "去石棺", v: "jh 54;#4 nw;#2 w;#8 n;#2 nw;w;nw;#2 n;w;#2 n;" },
        { n: "拱辰楼", v: "jh 54;nw;nw;nw;nw;w;w;n;n;n;n;n;w;w;sw;w;event_1_69046360;;place?狮子口;w;s;s;w;w;w;se;n;nw;s;e;w;sw;w;w;w;n;n;n;n;w;w;w;w;w;w;w;w;n;" },
        { n: "塔林湖畔", v: "rank go 231;s;s;s;se;se;e;s;s;s;s;se;se;s;s;s;" },
        { n: "种丹秘境", v: "jh 54;nw;nw;nw;nw;w;w;n;n;n;n;n;w;w;sw;w;event_1_69046360;event_1_30634412;place?巍宝仙踪:2;" },
        { n: "灵鹫宫", v: "rank go 311" },
        { n: "去哈日", v: "rank go 311;s;s;sw;se;se;se;e;se;se;ne;" },
        { n: "去九翼", v: "rank go 311;s;s;sw;" },
        { n: "修长城", v: "rank go 311;s;s;sw;se;se;se;e;se;se;sw;sw;event_1_71928780;home;" },
        { n: "问诊奏乐", v: "jh 1;e;n;n;n;n;w;event_1_90287255 go 9;n;w;w;#8 s;#4 w;n;event_1_41100562;s;e;e;#8 n;w;w;s;event_1_27222525" },
        { n: "格斗城", v: "rank go 195;event_1_36867949 pay;event_1_36867949 take;" },
      ],
      QuestAnsLibs: {
        "“白玉牌楼”场景是在哪个地图上？": "c",
        "“百龙山庄”场景是在哪个地图上？": "b",
        "“冰火岛”场景是在哪个地图上？": "b",
        "“常春岛渡口”场景是在哪个地图上？": "c",
        "“跪拜坪”场景是在哪个地图上？": "b",
        "“翰墨书屋”场景是在哪个地图上？": "c",
        "“花海”场景是在哪个地图上？": "a",
        "“留云馆”场景是在哪个地图上？": "b",
        "“日月洞”场景是在哪个地图上？": "b",
        "“蓉香榭”场景是在哪个地图上？": "c",
        "“三清殿”场景是在哪个地图上？": "b",
        "“三清宫”场景是在哪个地图上？": "c",
        "“双鹤桥”场景是在哪个地图上？": "b",
        "“无名山脚”场景是在哪个地图上？": "d",
        "“伊犁”场景是在哪个地图上？": "b",
        "“鹰记商号”场景是在哪个地图上？": "d",
        "“迎梅客栈”场景是在哪个地图上？": "d",
        "“子午楼”场景是在哪个地图上？": "c",
        "8级的装备摹刻需要几把刻刀": "a",
        NPC公平子在哪一章地图: "a",
        瑷伦在晚月庄的哪个场景: "b",
        安惜迩是在那个场景: "c",
        "黯然销魂掌有多少招式？": "c",
        黯然销魂掌是哪个门派的技能: "a",
        "八卦迷阵是哪个门派的阵法？": "b",
        八卦迷阵是那个门派的阵法: "a",
        "白金戒指可以在哪位那里获得？": "b",
        "白金戒指可以在哪位npc那里获得？": "b",
        "白金手镯可以在哪位那里获得？": "a",
        "白金手镯可以在哪位npc那里获得？": "a",
        "白金项链可以在哪位那里获得？": "b",
        "白金项链可以在哪位npc那里获得？": "b",
        "白蟒鞭的伤害是多少？": "a",
        白驼山第一位要拜的师傅是谁: "a",
        白银宝箱礼包多少元宝一个: "d",
        "白玉腰束是腰带类的第几级装备？": "b",
        拜师风老前辈需要正气多少: "b",
        拜师老毒物需要蛤蟆功多少级: "a",
        拜师铁翼需要多少内力: "b",
        拜师小龙女需要容貌多少: "c",
        拜师张三丰需要多少正气: "b",
        包家将是哪个门派的师傅: "a",
        包拯在哪一章: "d",
        "宝石合成一次需要消耗多少颗低级宝石？": "c",
        "宝玉帽可以在哪位那里获得？": "d",
        宝玉鞋击杀哪个可以获得: "a",
        宝玉鞋在哪获得: "a",
        "暴雨梨花针的伤害是多少？": "c",
        北斗七星阵是第几个的组队副本: "c",
        北冥神功是哪个门派的技能: "b",
        北岳殿神像后面是哪位: "b",
        匕首加什么属性: "c",
        碧海潮生剑在哪位师傅处学习: "a",
        "碧磷鞭的伤害是多少？": "b",
        镖局保镖是挂机里的第几个任务: "d",
        "冰魄银针的伤害是多少？": "b",
        病维摩拳是哪个门派的技能: "b",
        不可保存装备下线多久会消失: "c",
        不属于白驼山的技能是什么: "b",
        沧海护腰可以镶嵌几颗宝石: "d",
        "沧海护腰是腰带类的第几级装备？": "a",
        藏宝图在哪个NPC处购买: "a",
        藏宝图在哪个处购买: "b",
        藏宝图在哪里那里买: "a",
        "草帽可以在哪位那里获得？": "b",
        成功易容成异性几次可以领取易容成就奖: "b",
        "成长计划第七天可以领取多少元宝？": "d",
        "成长计划六天可以领取多少银两？": "d",
        "成长计划需要多少元宝方可购买？": "a",
        城里打擂是挂机里的第几个任务: "d",
        城里抓贼是挂机里的第几个任务: "b",
        充值积分不可以兑换下面什么物品: "d",
        出生选武学世家增加什么: "a",
        "闯楼第几层可以获得称号“藏剑楼护法”": "b",
        "闯楼第几层可以获得称号“藏剑楼楼主”": "d",
        "闯楼第几层可以获得称号“藏剑楼长老”": "c",
        闯楼每多少层有称号奖励: "a",
        春风快意刀是哪个门派的技能: "b",
        春秋水色斋需要多少杀气才能进入: "d",
        从哪个处进入跨服战场: "a",
        摧心掌是哪个门派的技能: "a",
        达摩在少林哪个场景: "c",
        "达摩杖的伤害是多少？": "d",
        "打开引路蜂礼包可以得到多少引路蜂？": "b",
        "打排行榜每天可以完成多少次？": "a",
        打土匪是挂机里的第几个任务: "c",
        打造刻刀需要多少个玄铁: "a",
        打坐增长什么属性: "a",
        "大保险卡可以承受多少次死亡后不降技能等级？": "b",
        大乘佛法有什么效果: "d",
        大旗门的修养术有哪个特殊效果: "a",
        大旗门的云海心法可以提升哪个属性: "c",
        大招寺的金刚不坏功有哪个特殊效果: "a",
        大招寺的铁布衫有哪个特殊效果: "c",
        "当日最低累积充值多少元即可获得返利？": "b",
        刀法基础在哪掉落: "a",
        倒乱七星步法是哪个门派的技能: "d",
        "等级多少才能在世界频道聊天？": "c",
        第一个副本需要多少等级才能进入: "d",
        "貂皮斗篷是披风类的第几级装备？": "b",
        丁老怪是哪个门派的终极师傅: "a",
        丁老怪在星宿海的哪个场景: "b",
        东方教主在魔教的哪个场景: "b",
        斗转星移是哪个门派的技能: "a",
        斗转星移阵是哪个门派的阵法: "a",
        "毒龙鞭的伤害是多少？": "a",
        毒物阵法是哪个门派的阵法: "b",
        "独孤求败有过几把剑？": "d",
        独龙寨是第几个组队副本: "a",
        "读书写字301-400级在哪里买书": "c",
        读书写字最高可以到多少级: "b",
        端茶递水是挂机里的第几个任务: "b",
        断云斧是哪个门派的技能: "a",
        "锻造一把刻刀需要多少玄铁碎片锻造？": "c",
        "锻造一把刻刀需要多少银两？": "a",
        兑换易容面具需要多少玄铁碎片: "c",
        多少消费积分换取黄金宝箱: "a",
        多少消费积分可以换取黄金钥匙: "b",
        翻译梵文一次多少银两: "d",
        方媃是哪个门派的师傅: "b",
        飞仙剑阵是哪个门派的阵法: "b",
        风老前辈在华山哪个场景: "b",
        风泉之剑加几点悟性: "c",
        "风泉之剑可以在哪位那里获得？": "b",
        "风泉之剑可以在哪位npc那里获得？": "b",
        风泉之剑在哪里获得: "d",
        "疯魔杖的伤害是多少？": "b",
        "伏虎杖的伤害是多少？": "c",
        副本完成后不可获得下列什么物品: "b",
        副本一次最多可以进几人: "a",
        副本有什么奖励: "d",
        富春茶社在哪一章: "c",
        "改名字在哪改？": "d",
        丐帮的绝学是什么: "a",
        丐帮的轻功是哪个: "b",
        干苦力是挂机里的第几个任务: "a",
        "钢丝甲衣可以在哪位那里获得？": "d",
        高级乾坤再造丹加什么: "b",
        "高级乾坤再造丹是增加什么的？": "b",
        高级突破丹多少元宝一颗: "d",
        "割鹿刀可以在哪位npc那里获得？": "b",
        葛伦在大招寺的哪个场景: "b",
        根骨能提升哪个属性: "c",
        功德箱捐香火钱有什么用: "a",
        "功德箱在雪亭镇的哪个场景？": "c",
        "购买新手进阶礼包在挂机打坐练习上可以享受多少倍收益？": "b",
        孤独求败称号需要多少论剑积分兑换: "b",
        孤儿出身增加什么: "d",
        古灯大师是哪个门派的终极师傅: "c",
        古灯大师在大理哪个场景: "c",
        "古墓多少级以后才能进去？": "d",
        寒玉床睡觉修炼需要多少点内力值: "c",
        寒玉床睡觉一次多久: "c",
        寒玉床需要切割多少次: "d",
        寒玉床在哪里切割: "a",
        "寒玉床在那个地图可以找到？": "a",
        黑狗血在哪获得: "b",
        "黑水伏蛟可以在哪位那里获得？": "c",
        红宝石加什么属性: "b",
        洪帮主在洛阳哪个场景: "c",
        "虎皮腰带是腰带类的第几级装备？": "a",
        花不为在哪一章: "a",
        花花公子在哪个地图: "a",
        华山村王老二掉落的物品是什么: "a",
        华山施戴子掉落的物品是什么: "b",
        华山武器库从哪个NPC进: "d",
        黄宝石加什么属性: "c",
        黄岛主在桃花岛的哪个场景: "d",
        黄袍老道是哪个门派的师傅: "c",
        "积分商城在雪亭镇的哪个场景？": "c",
        "技能柳家拳谁教的？": "a",
        技能数量超过了什么消耗潜能会增加: "b",
        嫁衣神功是哪个门派的技能: "b",
        剑冢在哪个地图: "a",
        街头卖艺是挂机里的第几个任务: "a",
        "金弹子的伤害是多少？": "a",
        金刚不坏功有什么效果: "a",
        "金刚杖的伤害是多少？": "a",
        "金戒指可以在哪位npc那里获得？": "d",
        "金手镯可以在哪位npc那里获得？": "b",
        "金丝鞋可以在哪位npc那里获得？": "b",
        "金项链可以在哪位npc那里获得？": "d",
        金玉断云是哪个门派的阵法: "a",
        "锦缎腰带是腰带类的第几级装备？": "a",
        "精铁棒可以在哪位那里获得？": "d",
        九区服务器名称: "d",
        九阳神功是哪个门派的技能: "c",
        九阴派梅师姐在星宿海哪个场景: "a",
        军营是第几个组队副本: "b",
        "开通VIP月卡最低需要当天充值多少元方有购买资格？": "a",
        "可以召唤金甲伏兵助战是哪个门派？": "a",
        客商在哪一章: "b",
        孔雀氅可以镶嵌几颗宝石: "b",
        "孔雀氅是披风类的第几级装备？": "c",
        枯荣禅功是哪个门派的技能: "a",
        跨服是星期几举行的: "b",
        跨服天剑谷每周六几点开启: "a",
        跨服需要多少级才能进入: "c",
        跨服在哪个场景进入: "c",
        兰花拂穴手是哪个门派的技能: "a",
        蓝宝石加什么属性: "a",
        蓝止萍在哪一章: "c",
        蓝止萍在晚月庄哪个小地图: "b",
        老毒物在白驮山的哪个场景: "b",
        老顽童在全真教哪个场景: "b",
        莲花掌是哪个门派的技能: "a",
        烈火旗大厅是那个地图的场景: "c",
        烈日项链可以镶嵌几颗宝石: "c",
        林祖师是哪个门派的师傅: "a",
        灵蛇杖法是哪个门派的技能: "c",
        凌波微步是哪个门派的技能: "b",
        凌虚锁云步是哪个门派的技能: "b",
        "领取消费积分需要寻找哪个NPC？": "c",
        "鎏金缦罗是披风类的第几级装备？": "d",
        柳淳风在哪一章: "c",
        柳淳风在雪亭镇哪个场景: "b",
        柳文君所在的位置: "a",
        六脉神剑是哪个门派的绝学: "a",
        陆得财是哪个门派的师傅: "c",
        陆得财在乔阴县的哪个场景: "a",
        论剑每天能打几次: "a",
        论剑是每周星期几: "c",
        论剑是什么时间点正式开始: "a",
        论剑是星期几进行的: "c",
        论剑是星期几举行的: "c",
        论剑输一场获得多少论剑积分: "a",
        论剑要在晚上几点前报名: "b",
        "论剑在周几进行？": "b",
        论剑中步玄派的师傅是哪个: "a",
        论剑中大招寺第一个要拜的师傅是谁: "c",
        论剑中古墓派的终极师傅是谁: "d",
        论剑中花紫会的师傅是谁: "c",
        论剑中青城派的第一个师傅是谁: "a",
        论剑中青城派的终极师傅是谁: "d",
        论剑中逍遥派的终极师傅是谁: "c",
        论剑中以下不是峨嵋派技能的是哪个: "b",
        论剑中以下不是华山派的人物的是哪个: "d",
        论剑中以下哪个不是大理段家的技能: "c",
        论剑中以下哪个不是大招寺的技能: "b",
        论剑中以下哪个不是峨嵋派可以拜师的师傅: "d",
        论剑中以下哪个不是丐帮的技能: "d",
        论剑中以下哪个不是丐帮的人物: "a",
        论剑中以下哪个不是古墓派的的技能: "b",
        论剑中以下哪个不是华山派的技能的: "d",
        论剑中以下哪个不是明教的技能: "d",
        论剑中以下哪个不是魔教的技能: "a",
        论剑中以下哪个不是魔教的人物: "d",
        论剑中以下哪个不是全真教的技能: "d",
        论剑中以下哪个不是是晚月庄的技能: "d",
        论剑中以下哪个不是唐门的技能: "c",
        论剑中以下哪个不是唐门的人物: "c",
        论剑中以下哪个不是铁雪山庄的技能: "d",
        论剑中以下哪个不是铁血大旗门的技能: "c",
        论剑中以下哪个是大理段家的技能: "a",
        论剑中以下哪个是大招寺的技能: "b",
        论剑中以下哪个是丐帮的技能: "b",
        论剑中以下哪个是花紫会的技能: "a",
        论剑中以下哪个是华山派的技能的: "a",
        论剑中以下哪个是明教的技能: "b",
        论剑中以下哪个是青城派的技能: "b",
        论剑中以下哪个是唐门的技能: "b",
        论剑中以下哪个是天邪派的技能: "b",
        论剑中以下哪个是天邪派的人物: "a",
        论剑中以下哪个是铁雪山庄的技能: "c",
        论剑中以下哪个是铁血大旗门的技能: "b",
        论剑中以下哪个是铁血大旗门的师傅: "a",
        论剑中以下哪个是晚月庄的技能: "a",
        论剑中以下哪个是晚月庄的人物: "a",
        论剑中以下是峨嵋派技能的是哪个: "a",
        论语在哪购买: "a",
        骆云舟在哪一章: "c",
        骆云舟在乔阴县的哪个场景: "b",
        落英神剑掌是哪个门派的技能: "b",
        吕进在哪个地图: "a",
        绿宝石加什么属性: "c",
        漫天花雨匕在哪获得: "a",
        茅山的绝学是什么: "b",
        茅山的天师正道可以提升哪个属性: "d",
        茅山可以招几个宝宝: "c",
        茅山派的轻功是什么: "b",
        茅山天师正道可以提升什么: "c",
        茅山学习什么技能招宝宝: "a",
        茅山在哪里拜师: "c",
        "每次合成宝石需要多少银两？": "a",
        每个玩家最多能有多少个好友: "b",
        vip每天不可以领取什么: "b",
        每天的任务次数几点重置: "d",
        每天分享游戏到哪里可以获得20元宝: "a",
        每天能挖几次宝: "d",
        每天能做多少个谜题任务: "a",
        每天能做多少个谜: "a",
        每天能做多少个师门任务: "c",
        每天微信分享能获得多少元宝: "d",
        每天有几次试剑: "b",
        "每天在线多少个小时即可领取消费积分？": "b",
        每突破一次技能有效系数加多少: "a",
        密宗伏魔是哪个门派的阵法: "c",
        灭绝师太在第几章: "c",
        灭绝师太在峨眉山哪个场景: "a",
        明教的九阳神功有哪个特殊效果: "a",
        "明月帽要多少刻刀摩刻？": "a",
        摹刻10级的装备需要摩刻技巧多少级: "b",
        "摹刻烈日宝链需要多少级摩刻技巧？": "c",
        "摹刻扬文需要多少把刻刀？": "a",
        魔鞭诀在哪里学习: "d",
        魔教的大光明心法可以提升哪个属性: "d",
        莫不收在哪一章: "a",
        "墨磷腰带是腰带类的第几级装备？": "d",
        木道人在青城山的哪个场景: "b",
        慕容家主在慕容山庄的哪个场景: "a",
        慕容山庄的斗转星移可以提升哪个属性: "d",
        哪个NPC掉落拆招基础: "a",
        哪个处可以捏脸: "a",
        哪个分享可以获得20元宝: "b",
        哪个技能不是魔教的: "d",
        哪个门派拜师没有性别要求: "d",
        哪个npc属于全真七子: "b",
        哪样不能获得玄铁碎片: "c",
        能增容貌的是下面哪个技能: "a",
        "捏脸需要花费多少银两？": "c",
        "捏脸需要寻找哪个NPC？": "a",
        "欧阳敏是哪个门派的？": "b",
        欧阳敏是哪个门派的师傅: "b",
        欧阳敏在哪一章: "a",
        欧阳敏在唐门的哪个场景: "c",
        "排行榜最多可以显示多少名玩家？": "a",
        逄义是在那个场景: "a",
        "披星戴月是披风类的第几级装备？": "d",
        劈雳拳套有几个镶孔: "a",
        霹雳掌套的伤害是多少: "b",
        辟邪剑法是哪个门派的绝学技能: "a",
        辟邪剑法在哪学习: "b",
        婆萝蜜多心经是哪个门派的技能: "b",
        七宝天岚舞是哪个门派的技能: "d",
        "七星鞭的伤害是多少？": "c",
        七星剑法是哪个门派的绝学: "a",
        棋道是哪个门派的技能: "c",
        千古奇侠称号需要多少论剑积分兑换: "d",
        乾坤大挪移属于什么类型的武功: "a",
        乾坤一阳指是哪个师傅教的: "a",
        青城派的道德经可以提升哪个属性: "c",
        青城派的道家心法有哪个特殊效果: "a",
        清风寨在哪: "b",
        清风寨在哪个地图: "d",
        清虚道长在哪一章: "d",
        去唐门地下通道要找谁拿钥匙: "a",
        全真的道家心法有哪个特殊效果: "a",
        全真的基本阵法有哪个特殊效果: "b",
        全真的双手互搏有哪个特殊效果: "c",
        日月神教大光明心法可以提升什么: "d",
        "如何将华山剑法从400级提升到440级？": "d",
        如意刀是哪个门派的技能: "c",
        "山河藏宝图需要在哪个NPC手里购买？": "d",
        上山打猎是挂机里的第几个任务: "c",
        少林的混元一气功有哪个特殊效果: "d",
        少林的易筋经神功有哪个特殊效果: "a",
        蛇形刁手是哪个门派的技能: "b",
        什么影响打坐的速度: "c",
        什么影响攻击力: "d",
        什么装备不能镶嵌黄水晶: "d",
        "什么装备都能镶嵌的是什么宝石？": "c",
        什么装备可以镶嵌紫水晶: "c",
        神雕大侠所在的地图: "b",
        神雕大侠在哪一章: "a",
        "神雕侠侣的时代背景是哪个朝代？": "d",
        "神雕侠侣的作者是?": "b",
        升级什么技能可以提升根骨: "a",
        "生死符的伤害是多少？": "a",
        师门磕头增加什么: "a",
        "师门任务每天可以完成多少次？": "a",
        "师门任务每天可以做多少个？": "c",
        "师门任务什么时候更新？": "b",
        师门任务一天能完成几次: "d",
        "师门任务最多可以完成多少个？": "d",
        施令威在哪个地图: "b",
        石师妹哪个门派的师傅: "c",
        "使用朱果经验潜能将分别增加多少？": "a",
        "首次通过乔阴县不可以获得那种奖励？": "a",
        受赠的消费积分在哪里领取: "d",
        "兽皮鞋可以在哪位那里获得？": "b",
        树王坟在第几章节: "c",
        双儿在扬州的哪个小地图: "a",
        孙天灭是哪个门派的师傅: "c",
        踏雪无痕是哪个门派的技能: "b",
        "踏云棍可以在哪位那里获得？": "a",
        唐门的唐门毒经有哪个特殊效果: "a",
        唐门密道怎么走: "c",
        天蚕围腰可以镶嵌几颗宝石: "d",
        "天蚕围腰是腰带类的第几级装备？": "d",
        天山姥姥在逍遥林的哪个场景: "d",
        天山折梅手是哪个门派的技能: "c",
        天师阵法是哪个门派的阵法: "b",
        天邪派在哪里拜师: "b",
        天羽奇剑是哪个门派的技能: "a",
        "铁戒指可以在哪位那里获得？": "a",
        "铁手镯可以在哪位那里获得？": "a",
        铁血大旗门云海心法可以提升什么: "a",
        "通灵需要花费多少银两？": "d",
        "通灵需要寻找哪个NPC？": "c",
        突破丹在哪里购买: "b",
        屠龙刀法是哪个门派的绝学技能: "b",
        屠龙刀是什么级别的武器: "a",
        挖剑冢可得什么: "a",
        "弯月刀可以在哪位那里获得？": "b",
        玩家每天能够做几次正邪任务: "c",
        "玩家想修改名字可以寻找哪个NPC？": "a",
        晚月庄的内功是什么: "b",
        晚月庄的七宝天岚舞可以提升哪个属性: "b",
        晚月庄的小贩在下面哪个地点: "a",
        晚月庄七宝天岚舞可以提升什么: "b",
        晚月庄主线过关要求: "a",
        王铁匠是在那个场景: "b",
        王重阳是哪个门派的师傅: "b",
        "魏无极处读书可以读到多少级？": "a",
        魏无极身上掉落什么装备: "c",
        魏无极在第几章: "a",
        闻旗使在哪个地图: "a",
        "乌金玄火鞭的伤害是多少？": "d",
        "乌檀木刀可以在哪位那里获得？": "d",
        "乌檀木刀可以在哪位npc那里获得？": "d",
        "钨金腰带是腰带类的第几级装备？": "d",
        武当派的绝学技能是以下哪个: "d",
        "武穆兵法提升到多少级才能出现战斗必刷？": "d",
        武穆兵法通过什么学习: "a",
        武学世家加的什么初始属性: "a",
        舞中之武是哪个门派的阵法: "b",
        "西毒蛇杖的伤害是多少？": "c",
        吸血蝙蝠在下面哪个地图: "a",
        "下列哪项战斗不能多个玩家一起战斗？": "a",
        下列装备中不可摹刻的是: "c",
        下面哪个不是古墓的师傅: "d",
        下面哪个不是门派绝学: "d",
        下面哪个不是魔教的: "d",
        下面哪个地点不是乔阴县的: "d",
        下面哪个门派是正派: "a",
        下面哪个是天邪派的师傅: "a",
        下面有什么是寻宝不能获得的: "c",
        "向师傅磕头可以获得什么？": "b",
        逍遥步是哪个门派的技能: "a",
        逍遥林是第几章的地图: "c",
        逍遥林怎么弹琴可以见到天山姥姥: "b",
        逍遥派的绝学技能是以下哪个: "a",
        萧辟尘在哪一章: "d",
        "小李飞刀的伤害是多少？": "d",
        "小龙女住的古墓是谁建造的？": "b",
        小男孩在华山村哪里: "a",
        新人礼包在哪个npc处兑换: "a",
        新手礼包在哪里领取: "a",
        "新手礼包在哪领取？": "c",
        需要使用什么衣服才能睡寒玉床: "a",
        选择孤儿会影响哪个属性: "c",
        选择商贾会影响哪个属性: "b",
        选择书香门第会影响哪个属性: "b",
        选择武学世家会影响哪个属性: "a",
        学习屠龙刀法需要多少内力: "b",
        雪莲有什么作用: "a",
        雪蕊儿是哪个门派的师傅: "a",
        雪蕊儿在铁雪山庄的哪个场景: "d",
        扬文的属性: "a",
        扬州询问黑狗能到下面哪个地点: "a",
        扬州在下面哪个地点的处可以获得玉佩: "c",
        "羊毛斗篷是披风类的第几级装备？": "a",
        阳刚之劲是哪个门派的阵法: "c",
        "杨过小龙女分开多少年后重逢?": "c",
        杨过在哪个地图: "a",
        "夜行披风是披风类的第几级装备？": "a",
        夜皇在大旗门哪个场景: "c",
        一个队伍最多有几个队员: "c",
        一天能完成谜题任务多少个: "b",
        一天能完成师门任务有多少个: "c",
        一天能完成挑战排行榜任务多少次: "a",
        一张分身卡的有效时间是多久: "c",
        一指弹在哪里领悟: "b",
        移开明教石板需要哪项技能到一定级别: "a",
        以下不是步玄派的技能的哪个: "c",
        以下不是天宿派师傅的是哪个: "c",
        以下不是隐藏门派的是哪个: "d",
        以下哪个宝石不能镶嵌到戒指: "c",
        以下哪个宝石不能镶嵌到内甲: "a",
        以下哪个宝石不能镶嵌到披风: "c",
        以下哪个宝石不能镶嵌到腰带: "c",
        以下哪个宝石不能镶嵌到衣服: "a",
        "以下哪个不是道尘禅师教导的武学？": "d",
        "以下哪个不是何不净教导的武学？": "c",
        "以下哪个不是慧名尊者教导的技能？": "d",
        "以下哪个不是空空儿教导的武学？": "b",
        "以下哪个不是梁师兄教导的武学？": "b",
        "以下哪个不是论剑的皮肤？": "d",
        "以下哪个不是全真七子？": "c",
        "以下哪个不是宋首侠教导的武学？": "d",
        "以下哪个不是微信分享好友、朋友圈、QQ空间的奖励？": "a",
        "以下哪个不是岳掌门教导的武学？": "a",
        以下哪个不是在洛阳场景: "d",
        以下哪个不是在雪亭镇场景: "d",
        以下哪个不是在扬州场景: "d",
        "以下哪个不是知客道长教导的武学？": "b",
        "以下哪个门派不是隐藏门派？": "c",
        "以下哪个门派是正派？": "d",
        "以下哪个门派是中立门派？": "a",
        以下哪个是步玄派的祖师: "b",
        以下哪个是封山派的祖师: "c",
        以下哪个是花紫会的祖师: "a",
        以下哪个是晚月庄的祖师: "d",
        "以下哪些物品不是成长计划第二天可以领取的？": "c",
        "以下哪些物品不是成长计划第三天可以领取的？": "d",
        "以下哪些物品不是成长计划第一天可以领取的？": "d",
        "以下哪些物品是成长计划第四天可以领取的？": "a",
        "以下哪些物品是成长计划第五天可以领取的？": "b",
        以下属于邪派的门派是哪个: "b",
        以下属于正派的门派是哪个: "a",
        "以下谁不精通降龙十八掌？": "d",
        "以下有哪些物品不是每日充值的奖励？": "d",
        倚天剑加多少伤害: "d",
        "倚天屠龙记的时代背景哪个朝代？": "a",
        易容后保持时间是多久: "a",
        易容面具需要多少玄铁兑换: "c",
        易容术多少级才可以易容成异性NPC: "a",
        "易容术可以找哪位NPC学习？": "b",
        易容术向谁学习: "a",
        易容术在哪里学习: "a",
        "易容术在哪学习？": "b",
        "银手镯可以在哪位那里获得？": "b",
        "银丝链甲衣可以在哪位npc那里获得？": "a",
        "银项链可以在哪位那里获得？": "b",
        尹志平是哪个门派的师傅: "b",
        隐者之术是那个门派的阵法: "a",
        鹰爪擒拿手是哪个门派的技能: "a",
        "影响你出生的福缘的出生是？": "d",
        油流麻香手是哪个门派的技能: "a",
        游龙散花是哪个门派的阵法: "d",
        玉蜂浆在哪个地图获得: "a",
        玉女剑法是哪个门派的技能: "b",
        岳掌门在哪一章: "a",
        云九天是哪个门派的师傅: "c",
        云问天在哪一章: "a",
        在洛阳萧问天那可以学习什么心法: "b",
        在庙祝处洗杀气每次可以消除多少点: "a",
        "在哪个NPC可以购买恢复内力的药品？": "c",
        在哪个处可以更改名字: "a",
        在哪个处领取免费消费积分: "d",
        在哪个处能够升级易容术: "b",
        "在哪里可以找到“香茶”？": "a",
        在哪里捏脸提升容貌: "d",
        在哪里消杀气: "a",
        在逍遥派能学到的技能是哪个: "a",
        在雪亭镇李火狮可以学习多少级柳家拳: "b",
        在战斗界面点击哪个按钮可以进入聊天界面: "d",
        "在正邪任务中不能获得下面什么奖励？": "d",
        怎么样获得免费元宝: "a",
        赠送李铁嘴银两能够增加什么: "a",
        张教主在明教哪个场景: "d",
        张三丰在哪一章: "d",
        张三丰在武当山哪个场景: "d",
        张松溪在哪个地图: "c",
        张天师是哪个门派的师傅: "a",
        张天师在茅山哪个场景: "d",
        "长虹剑在哪位那里获得？": "a",
        "长剑在哪里可以购买？": "a",
        正邪任务杀死好人增长什么: "b",
        正邪任务一天能做几次: "a",
        正邪任务中客商的在哪个地图: "a",
        正邪任务中卖花姑娘在哪个地图: "b",
        "正邪任务最多可以完成多少个？": "d",
        支线对话书生上魁星阁二楼杀死哪个NPC给10元宝: "a",
        朱姑娘是哪个门派的师傅: "a",
        朱老伯在华山村哪个小地图: "b",
        "追风棍可以在哪位npc那里获得？": "a",
        追风棍在哪里获得: "b",
        紫宝石加什么属性: "d",
        下面哪个npc不是魔教的: "d",
        藏宝图在哪里npc那里买: "a",
        从哪个npc处进入跨服战场: "a",
        钻石项链在哪获得: "a",
        在哪个npc处能够升级易容术: "b",
        扬州询问黑狗子能到下面哪个地点: "a",
        北岳殿神像后面是哪位npc: "b",
        "兽皮鞋可以在哪位npc那里获得？": "b",
        在哪个npc处领取免费消费积分: "d",
        "踏云棍可以在哪位npc那里获得？": "a",
        "钢丝甲衣可以在哪位npc那里获得？": "d",
        "铁手镯可以在哪位npc那里获得？": "a",
        哪个npc处可以捏脸: "a",
        "草帽可以在哪位npc那里获得？": "b",
        "铁戒指可以在哪位npc那里获得？": "a",
        "银项链可以在哪位npc那里获得？": "b",
        在哪个npc处可以更改名字: "a",
        "宝玉帽可以在哪位npc那里获得？": "d",
        论剑中以下哪个不是晚月庄的技能: "d",
        "精铁棒可以在哪位npc那里获得？": "d",
        "弯月刀可以在哪位npc那里获得？": "b",
        藏宝图在哪个npc处购买: "b",
        宝玉鞋击杀哪个npc可以获得: "a",
        "银手镯可以在哪位npc那里获得？": "b",
        扬州在下面哪个地点的npc处可以获得玉佩: "c",
        跨服天剑谷是星期几举行的: "b",
        "长虹剑在哪位npc那里获得？": "a",
        "追风棍在哪里获得？": "b",
        "黑水伏蛟可以在哪位npc那里获得？": "c",
        跨服副本周六几点开启: "a",
        "铁手镯  可以在哪位npc那里获得？": "a",
      },
      usualList: [
        { n: "风泉之剑", v: "jh 7;s;s;s;s;s;s;s;s;e;n;e;s;e;" },
        { n: "洛阳挖矿", v: "jh 2;n;n;n;n;n;n;n;n;n;n;w;w;w" },
        { n: "青竹蛇", v: "jh 2;n;n;n;n;n;n;n;n;n;e;" },
        { n: "武当桃园", v: "jh 10;w;n;n;w;w;w;n;n;n;n;e;e;e;e;s;e;s;e;" },
        { n: "小龙女", v: "jh 20;w;w;s;e;s;s;s;s;s;sw;sw;s;s;s;s;e;e;" },
        { n: "㊖游四海", v: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;w", style: { "background-color": "#9FE" } },
        { n: "白驼去星宿", v: "jh 21;nw;w;w;nw;n;n;n;n;n;n;n;n;ne;n;" },
        { n: "峨眉大门", v: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;" },
        { n: "全真大门", v: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;" },
        { n: "乔阴老太婆", v: "jh 7;s;s;s;s;s;s;s;sw;w;" },
        { n: "洛阳白冢", v: "jh 2;n;n;n;n;n;e;e;n;n;n;n;" },
        { n: "云梦璃", v: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e;e;n;n;n;n;n;n;n;n;n;n;n;n;n;n;event_1_95312623;" },
        { n: "扬州武庙", v: "jh 5;n;n;n;n;n;n;w;" },
        { n: "富春茶社", v: "jh 5;n;n;n;n;n;n;n;e;get_silver" },
        { n: "杭界山", v: "jh 2;n;n;e;s;luoyang317_op1;go_hjs go;se;se;ne;w;n;" },
        { n: "浣花剑碑", v: "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;" },
        { n: "京城赌坊", v: "rank go 195" },
        { n: "掩月千小驹", v: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s" },
        { n: "泰山孔翎", v: "jh 24;n;n;n;n;n;n;n;n;w;n;n;n;n;n" },
        { n: "长安秦王", v: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n;n;n;n;n;n;n" },
        { n: "百晓居士", v: "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;nw;nw;n;n;n;n;ne;ne;nw;ne;ne;n;n;ne;e" },
        { n: "去花街", v: "rank go 170" },
        { n: "生死双修", v: "rank go 232;s;s;s;e;ne;event_1_66728795;" },
        { n: "星宿射雕", v: "jh 28;n;w;w;w;w;w;w;nw;ne;nw;ne;nw;ne;e;" },
        { n: "杏花牧童", v: "rank go 184" },
        { n: "真龙隐武阁", v: "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n" },
        { n: "过巨石阵", v: "s;sw;s;w;n;nw;w;sw;nw;n;" },
        { n: "天龙闲钓", v: "rank go 232;s;s;s;s;s;s;" },
        { n: "天龙采茶", v: "rank go 232;s;s;s;e;ne;e;ne;ne;" },
        { n: "花街醉梦楼", v: "jh 46;e;e;e;e;e;e;e;e;n;n;n;e;e;" },
        { n: "去巍山文庙", v: "jh 54;#4 nw;#2 w;#4 n;#2 e;n;#2 e;" },
        { n: "南诏左到右", v: "e;e;e;se;ne;sw;nw;e;ne;e;" },
        { n: "马车去文庙", v: "jh 1;e;n;n;n;n;w;event_1_90287255 go 9;n;#5 e;#4 s;e;e;e;e;e;se;ne;sw;nw;e;ne;e;e;n;e;event_1_30634412;e;ne;e;e;s;e;e;n;e;e;event_1_62143505 go;event_1_62143505 get;event_1_63750325 get;" },
        { n: "马车去南诏", v: "jh 1;e;n;n;n;n;w;event_1_90287255 go 9;" },
        { n: "马南诏问诊", v: "jh 1;e;n;n;n;n;w;event_1_90287255 go 9;n;#7 w;s;event_1_12050280;event_1_27222525;" },
        { n: "万福楼", v: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e;e;s" },
      ],
      cityList: [
        "雪亭镇",
        "洛阳",
        "华山村",
        "华山",
        "扬州",
        "丐帮",
        "乔阴县",
        "峨眉山",
        "恒山",
        "武当山",
        "晚月庄",
        "水烟阁",
        "少林寺",
        "唐门",
        "青城山",
        "逍遥林",
        "开封",
        "光明顶",
        "全真教",
        "古墓",
        "白驼山",
        "嵩山",
        "梅庄",
        "泰山",
        "铁血大旗门",
        "大昭寺",
        "黑木崖",
        "星宿海",
        "茅山",
        "桃花岛",
        "铁雪山庄",
        "慕容山庄",
        "大理",
        "断剑山庄",
        "冰火岛",
        "侠客岛",
        "绝情谷",
        "碧海山庄",
        "天山",
        "苗疆",
        "白帝城",
        "墨家机关城",
        "掩月城",
        "海云阁",
        "幽冥山庄",
        "花街",
        "西凉城",
        "高昌迷宫",
        "京城",
        "越王剑宫",
        "江陵",
        "天龙寺",
        "西夏",
        "南诏国",
      ],
      cityId: {
        baidicheng: "白帝城",
        baituo: "白驼山",
        baizhong: "洛阳",
        banruotang: "少林寺",
        beiyinxiang: "洛阳",
        bihaishanzhuang: "碧海山庄",
        binghuo: "冰火岛",
        changan: "洛阳",
        choyin: "乔阴县",
        dali: "大理",
        duanjian: "断剑山庄",
        emei: "峨眉山",
        gaibang: "丐帮",
        gaochangmigong: "宫高昌迷",
        guanwai: "大昭寺",
        gumu: "古墓",
        haiyunge: "海云阁",
        heilongtan: "泰山",
        heimuya: "魔教",
        henshan: "恒山",
        huajie: "花街",
        huashan: "华山",
        huashancun: "华山村",
        hudidinao: "寒梅庄",
        jiangling: "江陵",
        jingcheng: "京城",
        jishanlvgu: "嵩山",
        jueqinggu: "绝情谷",
        kaifeng: "开封",
        latemoon: "晚月庄",
        luohantang: "少林寺",
        luoyang: "洛阳",
        luoyanya: "华山",
        meizhuang: "寒梅庄",
        miaojiang: "苗疆",
        mingjiao: "光明顶",
        mojiajiguancheng: "墨家机关城",
        moyundong: "嵩山",
        murong: "慕容山庄",
        qingcheng: "青城山",
        qingfengzhai: "华山村",
        qinqitai: "恒山",
        quanzhen: "全真教",
        resort: "铁雪山庄",
        shaolin: "少林寺",
        snow: "雪亭镇",
        songshan: "嵩山",
        taishan: "泰山",
        tangmen: "唐门",
        taoguan: "茅山",
        taohua: "桃花岛",
        tianlongsi: "天龙寺",
        tianshan: "天山",
        tianshengxia: "华山",
        tianshengzhai: "泰山",
        tieflag: "大旗门",
        tudimiao: "华山村",
        waterfog: "水烟阁",
        wudang: "武当山",
        wuguan: "扬州",
        wuqiku: "华山",
        xiakedao: "侠客岛",
        xiaoyao: "逍遥林",
        xiliangcheng: "西凉城",
        xinglinxiaoyuan: "寒梅庄",
        xingxiu: "星宿海",
        yangzhou: "扬州",
        yangzhouguanya: "扬州",
        yanyuecheng: "掩月城",
        yezhulin: "开封",
        yingoudufang: "洛阳",
        yuewangjiangong: "越王剑宫",
        yuhuangding: "泰山",
        yuwangtai: "开封",
        zizhiyu: "恒山",
        zuixianlou: "扬州",
      },
      qlList: [
        { n: "书房", v: "jh 1;e;n;e;e;e;e;n" },
        { n: "打铁铺子", v: "jh 1;e;n;n;w" },
        { n: "桑邻药铺", v: "jh 1;e;n;n;n;w" },
        { n: "南市", v: "jh 2;n;n;e" },
        { n: "绣楼", v: "jh 2;n;n;n;n;w;s;w" },
        { n: "北大街", v: "jh 2;n;n;n;n;n;n;n" },
        { n: "钱庄", v: "jh 2;n;n;n;n;n;n;;n;e" },
        { n: "杂货铺", v: "jh 3;s;s;e" },
        { n: "祠堂大门", v: "jh 3;s;s;w" },
        { n: "厅堂", v: "jh 3;s;s;w;n" },
      ],
      mjList: [
        { n: "山坳", v: "jh 1;e;n;n;n;n;n;" },
        { n: "桃花泉", v: "jh 3;s;s;s;s;s;nw;n;n;e;" },
        { n: "千尺幢", v: "jh 4;n;n;n;n" },
        { n: "猢狲愁", v: "jh 4;n;n;n;n;n;n;e;n;n;" },
        { n: "潭畔草地", v: "jh 4;n;n;n;n;n;n;n;event_1_91604710;s;s;s;" },
        { n: "玉女峰", v: "jh 4;n;n;n;n;n;n;n;n;w;" },
        { n: "长空栈道", v: "jh 4;n;n;n;n;n;n;n;n;n;e;" },
        { n: "临渊石台", v: "jh 4;n;n;n;n;n;n;n;n;n;e;n;" },
        { n: "沙丘小洞", v: "jh 6;event_1_98623439;ne;n;ne;ne;ne;event_1_97428251;" },
        { n: "九老洞", v: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;kill emei_shoushan;;n;;n;n;n;w;n;n;n;n;n;n;n;n;n;nw;sw;w;nw;w;" },
        { n: "悬根松", v: "jh 9;n;w;" },
        { n: "夕阳岭", v: "jh 9;n;n;e;" },
        { n: "青云坪", v: "jh 13;e;s;s;w;w;" },
        { n: "玉壁瀑布", v: "jh 16;s;s;s;s;e;n;e;" },
        { n: "湖边", v: "jh 16;s;s;s;s;e;n;e;event_1_5221690;s;w;" },
        { n: "碧水寒潭", v: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;e;e;se;se;e;" },
        { n: "寒水潭", v: "jh 20;w;w;s;e;s;s;s;s;s;sw;sw;s;e;se;" },
        { n: "悬崖", v: "jh 20;w;w;s;e;s;s;s;s;s;sw;sw;s;s;e;" },
        { n: "戈壁", v: "jh 21;" },
        { n: "卢崖瀑布", v: "jh 22;n;n;n;;;;n;e;n" },
        { n: "启母石", v: "jh 22;n;n;w;w;" },
        { n: "无极老姆洞", v: "jh 22;n;n;w;n;n;n;n;" },
        { n: "山溪畔", v: "jh 22;n;n;w;n;n;n;n;event_1_88705407;s;s;" },
        { n: "奇槐坡", v: "jh 23;n;n;n;n;n;n;n;n;" },
        { n: "天梯", v: "jh 24;n;n;n;" },
        { n: "小洞天", v: "jh 24;n;n;n;n;e;e;" },
        { n: "云步桥", v: "jh 24;n;n;n;n;n;n;n;n;n;" },
        { n: "观景台", v: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;e;e;n;" },
        { n: "危崖前", v: "jh 25;w;" },
        { n: "草原", v: "jh 26;w;" },
        { n: "无名山峡谷", v: "jh 29;n;n;n;n;event_1_60035830;place?平台;event_1_65661209;place?无名山峡谷;" },
      ],
      prizeList: [
        [
          "明月鞋",
          "月光宝甲衣",
          "明月戒",
          "明月帽",
          "明月项链",
          "明月手镯",
          "屠龙刀",
          "倚天剑",
          "冰魄银针",
          "墨玄掌套",
          "碧磷鞭",
          "烈日棍",
          "西毒蛇杖",
          "星月大斧",
          "碧玉锤",
          "霸王枪",
        ],
        [
          "烈日宝靴",
          "日光宝甲衣",
          "烈日宝戒",
          "烈日帽",
          "烈日宝链",
          "烈日宝镯",
          "斩神刀",
          "诛仙剑",
          "暴雨梨花针",
          "龙象拳套",
          "七星鞭",
          "残阳棍",
          "伏虎杖",
          "破冥斧",
          "撼魂锤",
          "赤焰枪",
        ],
        [
          "斩龙宝靴",
          "龙皮至尊甲衣",
          "斩龙宝戒",
          "斩龙帽",
          "斩龙宝链",
          "斩龙宝镯",
          "飞宇天怒刀",
          "九天龙吟剑",
          "小李飞刀",
          "天罡掌套",
          "乌金玄火鞭",
          "开天宝棍",
          "达摩杖",
          "天雷断龙斧",
          "烛幽鬼煞锤",
          "斩龙鎏金枪",
        ],
        [
          "君影草",
          "矢车菊",
          "忘忧草",
          "仙客来",
          "雪英",
          "朝开暮落花",
          "夕雾草",
          "凤凰木",
          "熙颜花",
          "晚香玉\\u001b",
          "凌霄花",
          "彼岸花",
          "洛神花",
          "百宜雪梅",
          "胤天宝帽碎片",
          "胤天项链碎片",
          "胤天宝戒碎片",
          "鱼肠碎片",
          "轩辕剑碎片",
          "破岳拳套碎片",
          "胤天宝镯碎片",
          "胤天宝靴碎片",
          "胤天紫金衣碎片",
          "昊天龙旋铠碎片",
          "水羽云裳碎片",
          "奉天金带碎片",
          "凤羽乾坤盾碎片",
          "玄冰凝魄枪碎片",
          "雷霆诛神刀碎片",
          "天雨玄镖碎片",
          "天神杖碎片",
          "轰天巨棍碎片",
          "神龙怒火鞭碎片",
          "胤武伏魔斧碎片",
          "九天灭世锤碎片",
        ],
      ],
      masterList: [
        { n: "九阴", in: __("九阴派", "九阴派"), npc: ["梅师姐", "铁尸"] },
        { n: "白驼", in: "白驮山派", npc: ["门卫", "白驮山@管家", "白鹤轩", "白厉峰"] },
        { n: "唐门", in: "唐门", npc: ["欧阳敏"] },
        { n: "魔教", in: "魔教", npc: ["见钱开", "上官云", "夏侯京", "杨延庆", "葵花传人"] },
        { n: "青城", in: "青城派", npc: ["吉人英", "黄袍老道", "吕朝阳", "林长老"] },
        { n: "星宿", in: "天宿派", npc: ["天宿老怪"] },
        { n: "天邪", in: "天邪派", npc: ["于兰天武"] },
        { n: "大招", in: "大招寺", npc: ["葛伦"] },
        { n: "晚月", in: "晚月庄", npc: ["瑷伦"] },
        { n: "花紫", in: "花紫会", npc: ["陆得财"] },
        { n: "少林", in: "少林派", npc: ["清为比丘", "达摩老祖"] },
        { n: "华山", in: "华山派", npc: ["独孤传人"] },
        { n: "大理", in: "大理段家", npc: ["段氏南僧"] },
        { n: "武当", in: "武当派", npc: ["张三丰"] },
        { n: "铁旗", in: "大旗门", npc: ["铁雍华"] },
        { n: "明教", in: "明教", npc: ["杨塬", "冷脸先生", "季燕青", "梁风", "仇毕烈", "九阳君"] },
        { n: "全真", in: "全真派", npc: ["老顽童"] },
        { n: "丐帮", in: "丐帮", npc: ["尚锄奸"] },
        { n: "峨嵋", in: "峨嵋派", npc: ["通星师太"] },
        { n: "步玄", in: "步玄派", npc: ["骆云舟"] },
        { n: "逍遥", in: "逍遥派", npc: ["童冰烟"] },
        { n: "慕容", in: "慕容世家", npc: ["燕浩宇"] },
        { n: "古墓", in: "古墓派", npc: ["过必修"] },
        { n: "桃花", in: "桃花岛", npc: ["李奇门"] },
        { n: "茅山", in: "茅山派", npc: ["张天师"] },
        { n: "铁雪", in: "铁雪山庄", npc: ["铁少", "雪蕊儿"] },
        { n: "封山", in: "封山剑派", npc: ["柳淳风"] },
        { n: "断剑", in: "断剑山庄", npc: ["剑魔求败"] },
        { n: "风花", in: "风花牧场", npc: ["宋喉"] },
        { n: "天波", in: "天波杨门", npc: ["杨延昭"] },
        { n: "燕云", in: "燕云世家", npc: ["耶律楚哥"] },
        { n: "西夏", in: "西夏堂", npc: ["嵬名元昊"] },
        { n: "自动出师", v: "eval_PLU.autoChushi()" },
      ],
    };
    PLU.YFUI = YFUI;
    PLU.UTIL = UTIL;
    PLU.YFD = unsafeWindow.YFD;
    let waitGameSI = setInterval(() => {
      if (unsafeWindow.g_obj_map && g_obj_map.get("msg_attrs")) {
        clearInterval(waitGameSI);
        PLU.init();
      }
    }, 500);
  }
  // 本地化
  function _(c, t) {
    return navigator.language == "zh-CN" || !t ? c : t;
  }
  function __(c, t) {
    return unsafeWindow.g_version_tw ? t : c;
  }
  class Base64 {
    constructor() {
      let Encoder = new TextEncoder();
      let Decoder = new TextDecoder();
      this.encode = (s) => btoa(Array.from(Encoder.encode(s), (x) => String.fromCodePoint(x)).join(""));
      this.decode = (s) => Decoder.decode(Uint8Array.from(atob(s), (m) => m.codePointAt(0)));
    }
  }
  function attach() {
    let oldWriteToScreen = unsafeWindow.writeToScreen;
    unsafeWindow.writeToScreen = function (a, e, f, g) {
      if (PLU.developerMode) console.debug(a);
      if (e == 2 && a.indexOf("find_task_road") != -1) {
        a = a.replace(/find_task_road3/g, "find_task_road2");
        var puzzleItems = a.split("<br/><br/>");
        var puzzleid = "";
        for (var i = 0; i < puzzleItems.length; i++) {
          if (puzzleItems[i].indexOf("find_task_road") == -1) {
            continue;
          }
          puzzleid = PLU.autoPuzzle.analyzePuzzle(puzzleItems[i]);
          if (PLU.getCache("listenPuzzle") && PLU.TMP.puzzleWating?.puzzleid != puzzleid) {
            if (PLU.getCache("puzzleTimeOut"))
              PLU.TMP.puzzleTimeOut = setTimeout(() => {
                PLU.TMP.puzzleList[puzzleid] = undefined;
                PLU.execActions("home");
              }, PLU.getCache("puzzleTimeOut") * 1000);
            PLU.autoPuzzle.startpuzzle(puzzleid);
          }
          if (puzzleItems[i].indexOf('javascript:go1("cus|startpuzzle|') == -1)
            puzzleItems[i] += " <a class='go-btn' href='javascript:PLU.autoPuzzle.startpuzzle(\"" + puzzleid + "\")'>【GO】</a>";
          else puzzleItems[i] = puzzleItems[i].replace('javascript:go1("cus|startpuzzle|', 'javascript:PLU.autoPuzzle.startpuzzle("');
          if (PLU.TMP.puzzleWating && puzzleid == PLU.TMP.puzzleWating.puzzleid && puzzleItems[i].indexOf("谜题") == -1) {
            PLU.autoPuzzle.startpuzzle(puzzleid);
          }
        }
        a = puzzleItems.join("<br/><br/>");
      } else if (PLU.TMP.puzzleWating) {
        if (e == 2 && a.indexOf("不接受你给的东西。") > -1 && PLU.TMP.puzzleWating.puzzleid && PLU.TMP.puzzleWating.status == "give") {
          PLU.TMP.puzzleWating.waitCount--;
          if (PLU.TMP.puzzleWating.waitCount <= 0) {
            clearTimeout(PLU.TMP.puzzleWating.waitTimer);
            PLU.TMP.puzzleWating.status = "trace";
            PLU.execActions("find_task_road " + PLU.TMP.puzzleWating.puzzleid);
          }
        } else if (
          e == 2 &&
          PLU.TMP.puzzleWating.puzzleid &&
          (PLU.TMP.puzzleWating.status == "wait" || PLU.TMP.puzzleWating.status == "traced") &&
          PLU.TMP.puzzleWating.action == "get" &&
          (a.indexOf("你捡起") > -1 || /你从.*的尸体里搜出.*。/.test(a) || /你用.*向.*买下.*。/.test(a)) &&
          a.indexOf(PLU.TMP.puzzleWating.target) > -1
        ) {
          PLU.TMP.puzzleWating = {
            puzzleid: PLU.TMP.puzzleWating.puzzleid,
            action: "get",
            actionCode: "give",
            target: PLU.TMP.puzzleList[PLU.TMP.puzzleWating.puzzleid].publisherName,
            status: "return",
          };
          PLU.execActions("find_task_road2 " + PLU.TMP.puzzleWating.puzzleid);
        } else if (e == 2 && a.indexOf("我就不给，你又能怎样？") > -1 && PLU.TMP.puzzleWating.puzzleid && PLU.TMP.puzzleWating.actionCode == "fight") {
          PLU.autoPuzzle.doPuzzle(PLU.TMP.puzzleWating.puzzleid);
        } else if (e == 2 && PLU.TMP.puzzleWating.puzzleid && /完成谜题\((\d+)\/\d+\)：(.*)的谜题\S*\s*\S*x(\d+)\s*\S*x\d+\s*\S*银两x(\d{1,})/.test(a)) {
          clearTimeout(PLU.TMP.puzzleTimeOut);
          if (PLU.getCache("listenPuzzle") && !PLU.TMP.autoscan) {
            PLU.execActions("home");
            return;
          }
          var puzzleFinish = /完成谜题\((\d+)\/\d+\)：(.*)的谜题\S*\s*\S*x(\d+)\s*\S*x\d+\s*\S*银两x(\d{1,})/.exec(a);
          puzzleFinish[2] = puzzleFinish[2].replace(/^<\/span>/, "").replace(//g, "");
          if (puzzleFinish[2] == PLU.TMP.puzzleList[PLU.TMP.puzzleWating.puzzleid].firstPublisherName) {
            PLU.TMP.puzzleList[PLU.TMP.puzzleWating.puzzleid].prize = puzzleFinish[0].replace(/<\/?span[^>]*>/g, "").replace(/<br\/>/g, "\n");
            if (+puzzleFinish[4] > 1800) {
              a +=
                "<br><button onClick='PLU.autoPuzzle.puzzlesubmit(\"" +
                PLU.TMP.puzzleWating.puzzleid +
                "\");' style='background: #FF6B00; color: #fff; margin: 5px;'>【发布】</button>";
              if (PLU.TMP.autoscan) PLU.autoPuzzle.puzzlesubmit(PLU.TMP.puzzleWating.puzzleid);
            }
            if (a.indexOf("当前谜题密码") >= 0) {
              var mimatext = a.split("当前谜题密码：")[1].split("<")[0];
              if ((localStorage.getItem("masterAcc") || PLU.accId) == PLU.accId) {
                a +=
                  "<button onClick='PLU.execActions(\"jh 1;e;n;n;n;n;w;event_1_65953349 " +
                  mimatext +
                  ";home\")' style='background: #FF6B00; color: #fff; margin: 5px;'>【交密码】</button>";
              } else {
                a +=
                  "<button onClick='PLU.execActions(\"tell u" +
                  localStorage.getItem("masterAcc") +
                  " 谜题密码： " +
                  mimatext +
                  "\")' style='background: #FF6B00; color: #fff; margin: 5px;'>【交密码】</button>";
              }
            }
            PLU.TMP.puzzleWating = {};
            if (PLU.TMP.autoscan) {
              PLU.TMP.index++;
              PLU.TMP.func();
            }
          }
        }
      }
      oldWriteToScreen(a, e, f, g);
    };
  }
  //=================================================================================
  // UTIL模块
  //=================================================================================
  unsafeWindow.PLU = {
    version: GM_info.script.version + "(24.01.27)",
    accId: null,
    nickName: null,
    battleData: null,
    MPFZ: {},
    TODO: [], //待办列表
    STO: {},
    SIT: {},
    ONOFF: {},
    STATUS: {
      inBattle: 0,
      isBusy: 0,
    },
    CACHE: {
      autoDZ: 1,
      autoHYC: 1,
      auto9H: 1,
      autoLX: 1,
      autoBF: 1,
      autoB6: 1,
      autoB5F: 1,
      autoDY: 0,
      develop: 0,
      puzzleTimeOut: 60,
    },
    FLK: null,
    TMP: { autotask: false, iBatchAskModel: 0 },
    logHtml: "",
    signInMaps: null,
    //================================================================================================
    init() {
      this.accId = UTIL.getAccId();
      this.developerMode =//专属
        (UTIL.getMem("CACHE") && JSON.parse(UTIL.getMem("CACHE")).developer) || ["4020484(1)","4512928(1)", "2904280(8)","8432667(1)", "8432616(1)"].includes(this.accId);
      this.PersonalMode =//个人
        (UTIL.getMem("CACHE") && JSON.parse(UTIL.getMem("CACHE")).developer) || ["3070884(1)","4512928(1)", "6768697(1)","3028780(1)","7525192(1)","6740379(1)","3028233(1)","6740205(1)", "2904280(8)","3091591(8)","3613445(1)","3093761(8)","3091552(8)","3091552(8)","3107986(8)", "4020484(1)", " ",].includes(this.accId);
      if (this.developerMode) {
        this.GM_info = GM_info;
        UTIL.addSysListener("developer", (b, type, subtype, msg) => {
          if (type && type == "attrs_changed") return;
          if (type && type == "channel" && subtype == "rumor") return;
          console.log(b);
        });
      }
      this.initMenu();
      this.initTickTime();
      this.initStorage();
      this.initHistory();
      this.initSocketMsgEvent();
      this.initVersion();
      addEventListener("keydown", (key) => {
        if (key.altKey || key.ctrlKey || key.metaKey || key.shiftKey) return; // 不考虑组合键
        if (document.activeElement && document.activeElement.tagName == "INPUT") return;
        switch (key.keyCode) {
          case 81: // q
           
            break;
          case 87: // w
          
            break;
          case 69: // e
           
            break;
          case 65: // a
          
            break;
          case 83: // s
           
            break;
          case 68: // d
          
            break;
          case 90: // z
           
            break;
          case 67: // c
          
            break;
          case 66: // B
          
            break;
          case 75: // k
           // clickButton("skills");
            break;
          case 86: // v
            break;
        }
      });
    },
    //================================================================================================
    initVersion() {
      this.nickName = g_obj_map.get("msg_attrs").get("name");
      YFUI.writeToOut(
        `<span style='color:yellow;'>
            +===========================+
                 脚本名称：无剑Mud辅助  版本：${this.version}
                 脚本开发：燕飞,东方鸣
                 当前角色：${this.nickName}${this.developerMode ? "（已开启开发者模式）" : ""}
                 角色 ID：${this.accId}
         +===========================+</span>`,
      );
      var playerName = this.removeColorCode(this.nickName); //窗口标题
      document.title = playerName;
      YFUI.writeToOut("<span style='color:#FFF;'>监听设定:</span>");
      let autosets = "";
      if (PLU.getCache("autoDZ") == 1) autosets += "连续打坐, ";
      if (PLU.getCache("autoHYC") == 1) autosets += "连续睡床, ";
      if (PLU.getCache("auto9H") == 1) autosets += "持续九花, ";
      if (PLU.getCache("autoDY") == 1) autosets += "持续钓鱼, ";
      if (PLU.getCache("autoLX") == 1) autosets += "连续练习, ";
      if (PLU.getCache("autoBF") == 1) autosets += "加入帮四, ";
      if (PLU.getCache("autoB6") == 1) autosets += "加入帮六, ";
      if (PLU.getCache("autoB5F") == 1) autosets += "帮五跟杀, ";
      if (PLU.getCache("listenPuzzle") == 1) autosets += "暴击谜题, ";
      YFUI.writeToOut("<span style='color:#CFF;'>" + autosets + "</span>");
      if (PLU.getCache("autoTP") == 1) {
        YFUI.writeToOut("<span style='color:#CFF;'>自动突破: <span style='color:#FF9;'>" + PLU.getCache("autoTP_keys") + "</span></span>");
      }
      if (PLU.getCache("listenQL") == 1) {
        YFUI.writeToOut("<span style='color:#CFF;'>自动青龙: <span style='color:#FF9;'>" + PLU.getCache("listenQL_keys") + "</span></span>");
      }
      if (PLU.getCache("listenKFQL") == 1) {
        YFUI.writeToOut("<span style='color:#CFF;'>跨服青龙: <span style='color:#FF9;'>" + PLU.getCache("listenKFQL_keys") + "</span></span>");
      }
      if (PLU.getCache("listenTF") == 1) {
        YFUI.writeToOut("<span style='color:#CFF;'>自动逃犯: <span style='color:#FF9;'>" + PLU.getCache("listenTF_keys") + "</span></span>");
      }
      if (!g_gmain.is_fighting) {
        PLU.getSkillsList((allSkills, tupoSkills) => {
          if (tupoSkills.length > 0) {
            YFUI.writeToOut("<span style='color:white;'>突破中技能:</span>");
            let topos = "";
            tupoSkills.forEach((sk, i) => {
              topos += "<span style='color:#CCF;min-width:100px;display:inline-block;'>" + (i + 1) + " : " + sk.name + "</span>";
            });
            YFUI.writeToOut("<span style='color:#CCF;'> " + topos + "</span>");
            YFUI.writeToOut("<span style='color:yellow;'>+------------------------------+</span>");
          } else {
            YFUI.writeToOut("<span style='color:white;'>突破中技能: 无</span>");
            YFUI.writeToOut("<span style='color:yellow;'>+------------------------------+</span>");
          }
          let lxSkill = g_obj_map.get("msg_attrs")?.get("practice_skill") || 0;
          if (lxSkill) {
            let sk = allSkills.find((s) => s.key == lxSkill);
            if (sk) {
              YFUI.writeToOut("<span style='color:white;'>练习中技能: <span style='color:#F0F;'>" + sk.name + "</span> (" + sk.level + ")</span>");
              YFUI.writeToOut("<span style='color:yellow;'>+------------------------------+</span>");
            }
          } else {
            YFUI.writeToOut("<span style='color:white;'>练习中技能: 无</span>");
            YFUI.writeToOut("<span style='color:yellow;'>+------------------------------+</span>");
          }
        });
      }
    },
    removeColorCode(name) {//去除角色名的彩色代码
      return name.replace(/\u001B\[[0-9;]*[mG]/g, "");
    },
    //================================================================================================
    initSocketMsgEvent() {
      if (!gSocketMsg) {
        console.log("%c%s", "background:#C33;color:#FFF;", " ERROR:Not found gSocketMsg!! ");
        return;
      }
      gSocketMsg.YFBackupDispatchMsg = gSocketMsg.dispatchMessage;
      gSocketMsg.dispatchMessage = (b) => {
        gSocketMsg.YFBackupDispatchMsg(b);
        let type = b.get("type");
        let subtype = b.get("subtype");
        let msg = b.get("msg");
        UTIL.sysDispatchMsg(b, type, subtype, msg);
      };
      gSocketMsg.change_skill_button = function (m, is_del) {
        var m_vs_info = g_obj_map.get("msg_vs_info"),
          m2 = g_obj_map.get("msg_attrs");
        if (!m_vs_info || !m2) return 0;
        if (is_del) {
          g_obj_map.remove("skill_button" + is_del);
          return 1;
        }
        var id = this.get_combat_user_id();
        if (id != m.get("uid")) return 0;
        var pos = parseInt(m.get("pos"));
        if (pos <= 0 || pos > this._skill_btn_cnt) return 0;
        g_obj_map.put("skill_button" + pos, m);
        this.refresh_skill_button();
      };
      PLU.initListeners();
      if (unsafeWindow.clickButton) {
        PLU.Base64 = new Base64();
        var proxy_clickButton = unsafeWindow.clickButton;
        unsafeWindow.clickButton = function () {
          let args = arguments;
          if (PLU.developerMode) {
            console.log(args);
          }
          // 指令录制
            if (
            PLU.TMP.cmds &&
            !g_gmain.is_fighting &&
            ["attrs", "none", "jh", "fb", "prev_combat", "home_prompt", "jhselect", "fbselect", "send_chat"].indexOf(args[0]) < 0 &&
            args[0].indexOf("look_npc ") &&
            !args[0].match(/^(jh|fb)go /) &&
            args[0].indexOf("go_chat")
          ) {
            if (
              args[0].indexOf("go southeast.") == 0 ||
              args[0].indexOf("go southwest.") == 0 ||
              args[0].indexOf("go northeast.") == 0 ||
              args[0].indexOf("go northwest.") == 0
            )
              PLU.TMP.cmds.push(args[0][3] + args[0][8]);
            else if (args[0].indexOf("go east.") == 0 || args[0].indexOf("go west.") == 0 || args[0].indexOf("go south.") == 0 || args[0].indexOf("go north.") == 0)
              PLU.TMP.cmds.push(args[0][3]);
            else PLU.TMP.cmds.push(args[0]);
          }
          if (args[0].indexOf("ask ") == 0) {
            UTIL.addSysListener("ask", (b, type, subtype, msg) => {
              if ((type == "jh" && subtype == "info") || UTIL.inHome()) {
                UTIL.delSysListener("ask");
              }
              if (type != "main_msg" || msg.indexOf("嗯，相遇即是缘，你是练武奇才，我送点东西给你吧。") == -1) return;
              proxy_clickButton(args[0]);
              UTIL.delSysListener("ask");
            });
            setTimeout(() => {
              UTIL.delSysListener("ask");
            }, 500);
            proxy_clickButton(args[0]);
          }
          // 解除聊天屏蔽，对非脚本玩家可用
          else if (PLU.developerMode && args[0].indexOf("chat ") == 0) {
            let msg = args[0].substring(5);
            for (var PATTERN of KEYWORD_PATTERNS) msg = msg.replace(PATTERN, (s) => Array.from(s).join("\f"));
            proxy_clickButton("chat " + msg);
          }
          // 解除四海商店限制
          else if ((args[0].indexOf("reclaim recl ") == 0 || args[0].indexOf("reclaim buy ") == 0) && !args[0].match(" page ")) {
            let cmd = args[0].match(/^reclaim (recl|buy) (\d+) (go )?(.+)$/);
            if (cmd[1]) {
              let n = Number(cmd[2]);
              switch (cmd[1]) {
                case "recl":
                  for (; n > 50000; n -= 50000) {
                    proxy_clickButton(`reclaim recl 50000 go ${cmd[4]}`, 1);
                  }
                  proxy_clickButton(`reclaim recl ${n} go ${cmd[4]}`, 1);
                  break;
                case "buy":
                  for (; n > 50000; n -= 50000) {
                    proxy_clickButton(`reclaim buy 50000 go ${cmd[4]}`, 1);
                  }
                  proxy_clickButton(`reclaim buy ${n} go ${cmd[4]}`, 1);
                  break;
              }
            }
          } else {
            proxy_clickButton(...args);
          }
          if (PLU.TMP.leaderTeamSync) {
            PLU.commandTeam(args);
          }
        };
      }
    },
    //================================================================================================
    initMenu() {
      YFUI.init();
      YFUI.addBtn({
        id: "ro",
        text: "▲隐",
        style: { width: "30px", opacity: ".6", background: "#333", color: "#FFF", border: "1px solid #CCC", borderRadius: "8px 0 0 0" },
        onclick($btn) {
          $("#pluginMenus").toggle();
          $("#pluginMenus").is(":hidden") ? $btn.text("▼显") : $btn.text("▲隐");
          $(".menu").hide();
        },
      });
      YFUI.addBtnGroup({ id: "pluginMenus" });
      //Paths
      let PathsArray = [];
      PathsArray.push({
        id: "bt_home",
        groupId: "pluginMenus",
        text: "首页",
        style: { background: "#FFFF99", padding: "5px 2px", width: "40px" },
        onclick(e) {
          $(".menu").hide();
          PLU.STATUS.isBusy = false;
          clickButton("home", 1);
        },
      });
      let citysArray = PLU.YFD.cityList.map((c, i) => {
        return { id: "bt_jh_" + (i + 1), text: c, extend: "jh " + (i + 1) };
      });
      PathsArray.push({
        id: "bt_citys",
        text: "地图",
        style: { background: "#FFE", width: "40px", padding: "5px 2px" },
        menuStyle: { width: "240px", "margin-top": "-25px" },
        children: citysArray,
      });
      let qlArray = PLU.YFD.qlList.map((p, i) => {
        return {
          id: "bt_ql_" + (i + 1),
          text: p.n,
          extend: { func: () => PLU.execActions(PLU.minPath(PLU.queryRoomPath(), p.v)) },
          style: { "background-color": "#CFF" },
        };
      });
      if (PLU.developerMode)
        qlArray.push({
          id: "bt_ql_xunluo",
          text: "巡逻",
          extend: { func: PLU.qlxl },
          style: { "background-color": "#CFF" },
        });
      PathsArray.push({
        id: "bt_qls",
        text: "青龙",
        style: { background: "#DFF", width: "40px", padding: "5px 2px" },
        menuStyle: { width: "160px", "margin-top": "-50px" },
        children: qlArray,
      });
      let mjArray = PLU.YFD.mjList.map((p, i) => {
        return { id: "bt_mj_" + (i + 1), text: p.n, extend: p.v, style: { "background-color": "#EFD" } };
      });
      PathsArray.push({
        id: "bt_mjs",
        text: "秘境",
        style: { background: "#EFD", width: "40px", padding: "5px 2px" },
        menuStyle: { width: "160px", "margin-top": "-75px" },
        children: mjArray,
      });
      PLU.autoChushi = () => {
        let family = g_obj_map.get("msg_attrs") && g_obj_map.get("msg_attrs").get("family_name");
        let master = PLU.YFD.masterList.slice(0, 32).find((e) => e.in == family);
        if (master == undefined) return;
        let npc = PLU.queryNpc("^" + master.npc.slice(-1)[0] + "$", true);
        if (!npc.length) return;
        let way = npc[0].way;
        //PLU.ONOFF["bt_kg_teamSync"] = 0;
        PLU.execActions(way, () => {
          let npc = UTIL.findRoomNpcReg("^" + master.npc.slice(-1)[0] + "$");
          if (!npc) return;
          let key = npc.key;
          PLU.execActions("apprentice " + key, () => {
            PLU.autoFight({
              targetKey: key,
              fightKind: "fight",
              autoSkill: "multi",
              onEnd() {
                PLU.execActions("chushi " + key, () => {
                  if (family == "铁雪山庄") PLU.execActions("chushi resort_master");
                });
              },
              onFail() {
                PLU.autoFight({
                  targetKey: key,
                  fightKind: "chushi",
                  autoSkill: "multi",
                  onEnd() {
                    PLU.execActions("chushi " + key);
                  },
                });
              },
            });
          });
        });
      };
      let masterArray = PLU.YFD.masterList.map((p, i) => {
        if (i == 32)
          return {
            id: "bt_master_33",
            text: p.n,
            extend: p.v,
            style: {
              "background-color": "#FBB",
              width: "88px",
              padding: "5px 2px",
            },
          };
        let colr = i < 10 ? "#FCF" : i < 20 ? "#CFF" : "#FFC";
        return {
          id: "bt_master_" + (i + 1),
          text: p.n,
          children: (() => {
            if (!PLU.developerMode) return [];
            return [
              {
                id: "bt_master_" + (i + 1) + "_0",
                text: "拜入" + p.n,
                extend: {
                  func: () => send_prompt(" 是否确定要加入" + p.in + "\n\n\n\n", "home apprentice " + p.in, "确定", 0),
                },
                style: { "background-color": colr },
              },
            ];
          })().concat(
            p.npc.map((name, j) => {
              return {
                id: "bt_master_" + (i + 1) + "_" + (j + 1),
                text: name.split("@").slice(-1)[0],
                extend: PLU.queryNpc(name + "道", true)[0].way,
                style: { "background-color": colr },
              };
            }),
          ),
          style: {
            "background-color": colr,
            width: "40px",
            padding: "5px 2px",
          },
          menuStyle: (function () {
            if (i & 1) return { right: "101px", width: "160px" };
            return { width: "160px" };
          })(),
        };
      });
      PathsArray.push({
        id: "bt_masters",
        text: "师门",
        style: { background: "#FCF", width: "40px", padding: "5px 2px" },
        menuStyle: { width: "96px", "margin-top": "-125px" },
        children: masterArray,
      });
      let dailyArray = PLU.YFD.dailyList.map((p, i) => {
        let colr = i < 6 ? "#FFC" : i < 20 ? "#FCF" : "#CFF";
        return {
          id: "bt_daily_" + (i + 1),
          text: p.n,
          extend: p.v,
          style: { "background-color": colr },
        };
      });
      PathsArray.push({
        id: "bt_daily",
        text: "日常",
        style: { background: "#FED", width: "40px", padding: "5px 2px" },
        menuStyle: { width: "160px", "margin-top": "-125px" },
        children: dailyArray,
      });
      let usualArray = PLU.YFD.usualList.map((p, i) => {
        let sty = p.style || { "background-color": "#CDF" };
        return {
          id: "bt_usual_" + (i + 1),
          text: p.n,
          extend: p.v,
          style: sty,
        };
      });
      PathsArray.push({
        id: "bt_usual",
        text: "常用",
        style: { background: "#CDF", width: "40px", padding: "5px 2px" },
        menuStyle: { width: "160px", "margin-top": "-150px" },
        children: usualArray,
      });
      let cts = [],
        libCity = PLU.YFD.mapsLib.Npc.filter((e) => {
          if (!cts.includes(e.jh)) {
            cts.push(e.jh);
            return true;
          }
          return false;
        }).map((e) => e.jh);
      let queryJHMenu = libCity.map((c, i) => {
        return {
          id: "bt_queryjh_" + (i + 1),
          text: c,
          style: {
            width: "50px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            fontSize: "12px",
          },
          extend: { func: PLU.queryJHMenu, param: c },
        };
      });
      let queryArray = [
        {
          id: "bt_queryJHList",
          text: "章节",
          children: queryJHMenu,
          style: { width: "40px", "background-color": "#9ED" },
          menuStyle: { width: "180px", "margin-top": "-180px" },
        },
        { id: "bt_queryHistory", text: "历史", style: { width: "40px", "background-color": "#FDD" }, extend: { func: PLU.toQueryHistory } },
        { id: "bt_queryNpc", text: "寻人", style: { width: "40px", "background-color": "#FDD" }, extend: { func: PLU.toQueryNpc } },
        { id: "bt_pathNpc", text: "扫图", style: { width: "40px", "background-color": "#FE9" }, extend: { func: PLU.toPathNpc } },
        { id: "bt_pathNpc", text: "谜题", style: { width: "40px", "background-color": "#00bbbb" }, extend: { func: PLU.toQueryMiTi } },
      ];
      PathsArray.push({
        id: "bt_query",
        text: "查找",
        style: { background: "#9ED", width: "40px", padding: "5px 2px" },
        menuStyle: { "margin-top": "-30px" },
        children: queryArray,
      });
      YFUI.addMenu({
        id: "m_paths",
        groupId: "pluginMenus",
        text: "导航",
        style: { background: "#CCFFFF", width: "40px", padding: "5px 2px" },
        multiCol: true,
        menuStyle: { width: "80px", "margin-top": "-25px" },
        children: PathsArray,
        onclick($btn, $box) {
          if ($btn.$extend) {
            $(".menu").hide();
            if ($btn.$extend.func) {
              if ($btn.$extend.param) $btn.$extend.func($btn, $btn.$extend.param);
              else $btn.$extend.func($btn);
              return;
            }
            PLU.execActions($btn.$extend, () => {
              if ($btn.text() == "去哈日") PLU.goHaRi();
              if ($btn.text() == "杭界山") PLU.goHJS();
            });
            // clickButton($btn.$extend)
          }
        },
      });
      //auto do something
      let somethingArray = [];
      somethingArray.push({ id: "bt_autoTeach", text: "传授技能", extend: { func: PLU.toAutoTeach }, style: { background: "#BFF" } });
      somethingArray.push({ id: "bt_autoUpgrade", text: "升级游侠", extend: { func: PLU.toAutoUpgrade }, style: { background: "#BFF" } });
      somethingArray.push({ id: "hr_null2", text: "", style: { display: "none" }, boxStyle: { display: "block", height: "5px" } });
      somethingArray.push({ id: "bt_autoLearn", text: "一键学习", extend: { func: PLU.toAutoLearn }, style: { background: "#FBF" } });
      somethingArray.push({ id: "bt_autoChuaiMo", text: "自动揣摩", extend: { func: PLU.toAutoChuaiMo }, style: { background: "#FBF" } });
      somethingArray.push({ id: "hr_null2", text: "", style: { display: "none" }, boxStyle: { display: "block", height: "5px" } });
      somethingArray.push({ id: "bt_loopScript", text: "循环执行", extend: { func: PLU.toLoopScript }, style: { background: "#FBB" } });
      somethingArray.push({ id: "bt_loopKillByN", text: "计数击杀", extend: { func: PLU.toLoopKillByN }, style: { background: "#FBB" } });
      somethingArray.push({ id: "bt_waitCDKill", text: "倒计时杀", extend: { func: PLU.toWaitCDKill }, style: { background: "#FBB" } });
      somethingArray.push({ id: "bt_loopKillName", text: "名字连杀", extend: { func: PLU.toLoopKillName }, style: { background: "#FBB" } });
      somethingArray.push({ id: "bt_loopClick", text: "自动点击", extend: { func: PLU.toLoopClick }, style: { background: "#FBB" } });
      somethingArray.push({ id: "bt_loopSlowClick", text: "慢速点击", extend: { func: PLU.toLoopSlowClick }, style: { background: "#FBB" } });
      somethingArray.push({ id: "bt_autoLianXi", text: "自动练习", extend: { func: PLU.toAutoLianXi }, style: { background: "#FBF" } });
      somethingArray.push({ id: "bt_record", text: "指令录制", extend: { func: PLU.toRecord }, style: { background: "#FBB" } });
      somethingArray.push({ id: "hr_null2", text: "", style: { display: "none" }, boxStyle: { display: "block", height: "5px" } });
      somethingArray.push({ id: "bt_sellLaji", text: "批量出售", extend: { func: PLU.toSellLaji }, style: { background: "#DEF" } });
      somethingArray.push({ id: "bt_splitItem", text: "批量分解", extend: { func: PLU.toSplitItem }, style: { background: "#DEF" } });
      somethingArray.push({ id: "bt_putStore", text: "批量入库", extend: { func: PLU.toPutStore }, style: { background: "#DEF" } });
      somethingArray.push({ id: "bt_autoUse", text: "批量使用", extend: { func: PLU.toAutoUse }, style: { background: "#DEF" } });
      somethingArray.push({ id: "bt_combineGem", text: "合成宝石", extend: { func: PLU.openCombineGem }, style: { background: "#DEF" } });
      somethingArray.push({ id: "bt_autoMasterGem", text: "一键合天神", extend: { func: PLU.autoMasterGem }, style: { background: "#DEF" } });
      somethingArray.push({ id: "hr_null2", text: "", style: { display: "none" }, boxStyle: { display: "block", height: "5px" } });
      somethingArray.push({ id: "bt_autoXTL1", text: "刷琅嬛玉洞", extend: { func: PLU.autoXTL1 }, style: { background: "#FED" } });
      somethingArray.push({ id: "bt_autoXTL2", text: "刷山崖", extend: { func: PLU.autoXTL2 }, style: { background: "#FED" } });
      somethingArray.push({ id: "bt_autoERG", text: "刷恶人谷", extend: { func: PLU.autoERG }, style: { background: "#FED" } });
      somethingArray.push({ id: "bt_searchBangQS", text: "扫暴击", extend: { func: PLU.scanPuzzle }, style: { background: "#BBF" } });
      somethingArray.push({ id: "hr_null2", text: "", style: { display: "none" }, boxStyle: { display: "block", height: "5px" } });
      somethingArray.push({ id: "bt_autoGetKey", text: "自动捡钥匙", extend: { func: PLU.toAutoGetKey }, style: { background: "#EBC" } });
      somethingArray.push({ id: "bt_autoMoke", text: "一键摹刻", extend: { func: PLU.toAutoMoke }, style: { background: "#EFD" } });
      somethingArray.push({ id: "bt_autoKillZYY", text: "刷祝玉妍", extend: { func: PLU.toAutoKillZYY }, style: { background: "#FBF" } });
      somethingArray.push({ id: "bt_autoJHYL", text: "九花原料", extend: { func: PLU.buyJHYL }, style: { background: "#DEF" } });
      somethingArray.push({ id: "bt_loopReadBase", text: "读技能书", extend: { func: PLU.toLoopReadBase }, style: { background: "#FBB" } });
      somethingArray.push({ id: "bt_checkYouxia", text: "技能检查", extend: { func: PLU.checkYouxia }, style: { background: "#DEF" } });
      somethingArray.push({ id: "bt_searchFamilyQS", text: "搜师门任务", extend: { func: PLU.toSearchFamilyQS }, style: { background: "#BBF" }, });
      somethingArray.push({ id: "bt_searchBangQS", text: "搜帮派任务", extend: { func: PLU.toSearchBangQS }, style: { background: "#BBF" } });
      somethingArray.push({ id: "bt_autoFB11", text: "自动本11", extend: { func: PLU.autoFB11 }, style: { background: "#FC9" } });
      somethingArray.push({ id: "bt_autoFB10", text: "自动本10", extend: { func: PLU.autoFB10 }, style: { background: "#FED" } });
      somethingArray.push({ id: "bt_autoyoumhy", text: "幽冥后院", extend: { func: PLU.autoyoumhy }, style: { background: "#FED" } });

      YFUI.addMenu({
        id: "m_autoDoSomething",
        groupId: "pluginMenus",
        text: "自动",
        style: { width: "40px" },
        multiCol: true,
        menuStyle: { width: "160px", "margin-top": "-61px" },
        children: somethingArray,
        onclick($btn, $box) {
          if ($btn.$extend) {
            $(".menu").hide();
            $btn.$extend.func($btn);
          }
        },
      });
      //listens
      let listensArray = [];
      listensArray.push({ id: "bt_autoBF", text: "自动帮四", extend: { key: "autoBF" }, style: { background: "#EDC" } });
      listensArray.push({ id: "bt_autoB6", text: "自动帮六", extend: { key: "autoB6" }, style: { background: "#ECD" } });
      listensArray.push({ id: "bt_autoB5F", text: "帮五跟杀", extend: { key: "autoB5F" }, style: { background: "#CEF" } });
      listensArray.push({ id: "bt_autoTP", text: "持续突破", extend: { key: "autoTP" }, style: { background: "#BEF" } });
      listensArray.push({ id: "bt_autoHYC", text: "持续睡床", extend: { key: "autoHYC" }, style: { background: "#CEC" } });
      listensArray.push({ id: "bt_autoDZ", text: "持续打坐", extend: { key: "autoDZ" }, style: { background: "#CEC" } });
      listensArray.push({ id: "bt_autoLX", text: "持续练习", extend: { key: "autoLX" }, style: { background: "#CEC" } });
      listensArray.push({ id: "bt_autoConnect", text: "自动重连", extend: { key: "autoConnect" }, style: { background: "#FED" } });
      listensArray.push({ id: "bt_autoDY", text: "持续钓鱼", extend: { key: "autoDY" }, style: { background: "#BEF" } });
      listensArray.push({ id: "bt_auto9H", text: "持续九花", extend: { key: "auto9H" }, style: { background: "#BEF" } });
      listensArray.push({ id: "bt_autoQuitTeam", text: "进塔离队", extend: { key: "autoQuitTeam" }, style: { background: "#EEF" } });
      listensArray.push({ id: "bt_autoSignIn", text: "定时签到", extend: { key: "autoSignIn" }, style: { background: "#BEF" } });
      listensArray.push({ id: "hr_listen", text: "", style: { width: "160px", opacity: 0 }, boxStyle: { "font-size": 0 } });
      listensArray.push({ id: "bt_listenQL", text: "本服青龙", extend: { key: "listenQL" } });
      listensArray.push({ id: "bt_listenKFQL", text: "广场青龙", extend: { key: "listenKFQL" } });
      listensArray.push({ id: "bt_listenYX", text: "游侠", extend: { key: "listenYX" } });
      listensArray.push({ id: "bt_listenTF", text: "夜魔逃犯", extend: { key: "listenTF" } });
      listensArray.push({ id: "bt_listenPuzzle", text: "暴击谜题", extend: { key: "listenPuzzle" } });
      listensArray.push({ id: "bt_listenChat", text: "闲聊", extend: { key: "listenChat" } });
      YFUI.addMenu({
        id: "m_listens",
        groupId: "pluginMenus",
        text: "监听",
        style: { background: "#DDFFDD", width: "40px" },
        multiCol: true,
        menuStyle: { width: "160px", "margin-top": "-25px" },
        children: listensArray,
        onclick($btn, $box) {
          if ($btn.$extend) PLU.setListen($btn, $btn.$extend.key);
        },
      });
      //fightset
      let fightSetsArray = [];
      fightSetsArray.push({
        id: "bt_enableSkills",
        text: "技 能 组",
        style: { background: "#FBE" },
        menuStyle: { "margin-top": "-25px" },
        children: [
          { id: "bt_enableSkill1", text: "技能组1", extend: { key: "enable1" } },
          { id: "bt_enableSkill2", text: "技能组2", extend: { key: "enable2" } },
          { id: "bt_enableSkill3", text: "技能组3", extend: { key: "enable3" } },
        ],
      });
      fightSetsArray.push({
        id: "bt_wearEquip",
        text: "装备切换",
        style: { background: "#FEB" },
        children: [
          { id: "bt_wearEquip1", text: "装备组1", extend: { key: "equip1" }, canSet: true },
          { id: "bt_wearEquip2", text: "装备组2", extend: { key: "equip2" }, canSet: true },
        ],
      });
      fightSetsArray.push({ id: "bt_followKill", text: "跟杀设置", extend: { key: "followKill" }, style: { background: "#FCC" } });
      fightSetsArray.push({ id: "bt_autoCure", text: "血蓝设置", extend: { key: "autoCure" }, style: { background: "#CCF" } });
      fightSetsArray.push({ id: "bt_autoPerform", text: "技能设置", extend: { key: "autoPerform" }, style: { background: "#CFC" } });
      YFUI.addMenu({
        id: "m_fightsets",
        groupId: "pluginMenus",
        text: "战斗",
        style: { background: "#FFDDDD", width: "40px" },
        //multiCol: true,
        menuStyle: { width: "80px", "margin-top": "-50px" },
        children: fightSetsArray,
        onclick($btn, $box, BtnMode) {
          if ($btn.$extend) {
            if ($btn.$extend.key && PLU.getCache($btn.$extend.key) == 0) $(".menu").hide();
            if ($btn.$extend.key.match("enable")) return PLU.setSkillGroup($btn.$extend.key.substr(-1));
            if ($btn.$extend.key.match("equip")) {
              let equipKey = "equip_" + $btn.$extend.key.substr(-1) + "_keys";
              let equipsStr = PLU.getCache(equipKey);
              $(".menu").hide();
              if (equipsStr && BtnMode != "setting") {
                return PLU.wearEquip(equipsStr);
              }
              return PLU.setWearEquip($btn.$extend.key.substr(-1));
            }
            if ($btn.$extend.key == "followKill") return PLU.setFightSets($btn, $btn.$extend.key);
            if ($btn.$extend.key == "autoCure") return PLU.setAutoCure($btn, $btn.$extend.key);
            if ($btn.$extend.key == "autoPerform") return PLU.setAutoPerform($btn, $btn.$extend.key);
            if ($btn.$extend.key == "autoPerform") return PLU.setAutoPerform($btn, $btn.$extend.key);
          }
        },
      });
      // puzzle
      let puzzleArray = [];
      if (PLU.developerMode)
        puzzleArray.push({
          id: "bt_puzzle_key",
          text: "通告设置",
          extend: { key: "" },
        });
      puzzleArray.push({
        id: "bt_puzzle_Key",
        text: "密码设置",
        extend: { func: PLU.puzzleKey },
      });
      if (PLU.developerMode)
        puzzleArray.push({
          id: "bt_puzzle_key",
          text: "进度设置",
          extend: { func: PLU.key },
        });
      puzzleArray.push({
        id: "bt_puzzle_key",
        text: "超时设置",
        extend: { func: PLU.puzzleTimeOut },
      });
      YFUI.addMenu({
        id: "m_puzzle",
        groupId: "pluginMenus",
        text: "谜题",
        style: { background: "#CCC", width: "40px" },
        menuStyle: { "margin-top": "-75px" },
        children: puzzleArray,
        onclick($btn, $box) {
          if ($btn.$extend) {
            $(".menu").hide();
            $btn.$extend.func($btn);
          }
        },
      });
      //Sign
      let signArray = [];
      signArray.push({ id: "bt_autoAskQixia", text: "自动问奇侠", extend: { func: PLU.toAutoAskQixia } });
      signArray.push({ id: "bt_autoVisitQixia", text: "亲近奇侠", style: { background: "#CFC" }, extend: { func: PLU.toAutoVisitQixia } });
      signArray.push({ id: "hr_dlus", text: "", style: { width: "240px", opacity: 0 } });
      signArray.push({ id: "bt_sign", text: "一键签到", extend: { key: "signIn" }, style: { background: "#CCFFFF" } });
      YFUI.addMenu({
        id: "m_signs",
        groupId: "pluginMenus",
        text: "签到",
        style: { background: "#DDFFFF", width: "40px" },
        menuStyle: { "margin-top": "-92px" },
        children: signArray,
        onclick($btn, $box) {
          if ($btn.$extend) {
            if ($btn.$extend.key == "signIn") {
              $(".menu").hide();
              return PLU.toSignIn();
            } else if ($btn.$extend.key == "autoSignIn") {
              return PLU.setListen($btn, $btn.$extend.key);
            } else {
              $(".menu").hide();
              $btn.$extend.func($btn);
            }
          }
        },
      });
      //sys
      let sysArray = [];
      sysArray.push({ id: "bt_openTeam", text: "开队伍", extend: "team" });
      sysArray.push({ id: "bt_openFudi", text: "开府邸", extend: "fudi" });
      sysArray.push({ id: "bt_openShop", text: "开商城", extend: "shop" });
      sysArray.push({ id: "bt_openJFShop", text: "积分商城", extend: "shop xf_shop" });
      sysArray.push({
        id: "bt_open4HShop",
        text: "四海商店",
        children: [
          { id: "bt_open4HShop1", text: "回收", extend: "reclaim recl" },
          { id: "bt_open4HShop2", text: "兑换", extend: "reclaim buy" },
        ],
      });
      sysArray.push({ id: "bt_clanShop", text: "帮派商店", extend: "clan;clan_shop" });
      sysArray.push({ id: "hr_sys", text: "", style: { width: "160px", opacity: 0 }, boxStyle: { "font-size": 0 } });
      sysArray.push({ id: "bt_intervene", text: "杀隐藏怪", extend: { func: PLU.intervene } });
      sysArray.push({ id: "bt_openQixia", text: "奇侠列表", extend: "open jhqx" });
      sysArray.push({ id: "bt_cleartask", text: "清谜题", extend: "auto_tasks cancel" });
      sysArray.push({ id: "bt_task", text: "谜题列表", extend: "task_quest" });
      sysArray.push({ id: "bt_huanpf", text: "换皮肤", extend:  { func: PLU.huanpf }, style: { background: "#DEF" } });
      sysArray.push({ id: "hr_sys", text: "", style: { width: "160px", opacity: 0 }, boxStyle: { "font-size": 0 } });
      sysArray.push({ id: "bt_showMPFZ", text: "纷争显示", extend: { func: PLU.showMPFZ }, style: { background: "#EEEEFF" } });
      sysArray.push({ id: "bt_log", text: "消息日志", extend: { func: PLU.showLog }, style: { background: "#99CC00" } });
      sysArray.push({ id: "bt_upset", text: "备份设置", extend: { func: PLU.saveSetting }, style: { background: "#FFAAAA" } });
      sysArray.push({ id: "bt_dlset", text: "下载设置", extend: { func: PLU.loadSetting }, style: { background: "#FFCC00" } });
      YFUI.addMenu({
        id: "m_sys",
        groupId: "pluginMenus",
        text: "工具",
        multiCol: true,
        style: { background: "#FFFFDD", width: "40px" },
        menuStyle: { width: "160px", "margin-top": "-117px" },
        children: sysArray,
        onclick($btn, $box) {
          if ($btn.$extend && $btn.$extend.func) {
            $(".menu").hide();
            $btn.$extend.func($btn);
          } else if ($btn.$extend) {
            $(".menu").hide();
            PLU.execActions($btn.$extend);
          }
        },
      });
      //个人增加
        let SgerenArray = [];
        SgerenArray.push({ id: "bt_autoQubaos", text: "取宝石", extend: { func: PLU.Qubaos } });
        SgerenArray.push({ id: "bt_autoQuTianss", text: "取天神", extend: { func: PLU.QuTianss }, style: { background: "#ff5555" } });
        SgerenArray.push({ id: "bt_autoDianLiCai", text: "文庙超投", extend: { func: PLU.DianLiCai }, style: { background: "#FBE" } });
        SgerenArray.push({ id: "bt_autoQuLiCai", text: "取理财", extend: { func: PLU.QuLiCai }, style: { background: "#bbbb00" } });
        SgerenArray.push({ id: "bt_autoXuelian", text: "买雪莲", extend: { func: PLU.buyXueLian }, style: { background: "#DEF" } });
        SgerenArray.push({ id: "bt_autoeatHuoG", text: "吃火锅", extend: { func: PLU.eatHuoG }, style: { background: "#55ffff" } });
        SgerenArray.push({ id: "bt_autobuping", text: "吃补品", extend: { func: PLU.eatbuping }, style: { background: "#DEF" } });
        SgerenArray.push({ id: "bt_autoLLBao", text: "礼包", extend: { func: PLU.LLBao }, style: { background: "#DEF" } });
        SgerenArray.push({ id: "bt_autoaskTianmd", text: "讨天命", extend: { func: PLU.askTianmd }, style: { background: "#55ffff" } });
        //SgerenArray.push({ id: "bt_autoChuangLou", text: "闯楼", extend: { func: PLU.autoChuangLou }, style: { background: "#DEF" } });
        SgerenArray.push({ id: "bt_autoYandijd", text: "炎帝祭典", extend: { func: PLU.Yandijd }, style: { background: "#55ffff" } });
        SgerenArray.push({id:"bt_autoasChongKdw",text:"重开队伍",extend:{func:PLU.asChongKdw},style:{background:"#00ff00"}});
        SgerenArray.push({id:"bt_autoeatSans",text:"用三生",extend:{func:PLU.eatSans},style:{background:"#55ffff"}});
        SgerenArray.push({ id: "bt_autoasjirudw", text: "加队伍", extend: { func: PLU.asJirudw }, style: { background: "#DEF" } });
        SgerenArray.push({ id: "bt_autoasLikaidw", text: "退队伍", extend: { func: PLU.asLikaidw } });
        SgerenArray.push({ id: "bt_zbjianshen", text: "剑神套", extend: { func: PLU.zbjianshen }, style: { background: "#FEB" } });
        SgerenArray.push({ id: "bt_zbchuidiao", text: "垂钓套", extend: { func: PLU.zbchuidiao }, style: { background: "#FBE" } });
        SgerenArray.push({ id: "bt_autocaomeibs", text: "草莓冰沙", extend: { func: PLU.caomeibs }, style: { background: "#FBE" } });
        SgerenArray.push({id: "bt_autokillXLR",text: "刷小龙人",extend: { func: PLU.toFindDragon},style: {background: "#FFFF99"},});
        SgerenArray.push({id: "bt_autokillXLR",text: "刷斥候",extend: { func: PLU.toFindCiKe},style: {background: "#FFFF99"},});
        SgerenArray.push({ id: "bt_autochoujiang",text: "去抽奖",extend: {func: PLU.choujiang},style: {background: "#FFFF55"},});
        SgerenArray.push({id: "bt_autogivehuf",text: "交虎符",extend: {func: PLU.givehuf},style: {background: "#E19100"},});

      YFUI.addMenu({
        id: "m_Sgeren",
        groupId: "pluginMenus",
        text: "个人",
        multiCol: true,
        style: { background: "#FBE", width: "40px" },
        menuStyle: { width: "160px", "margin-top": "-117px" },
        children: SgerenArray,
        onclick($btn, $box) {
          if ($btn.$extend && $btn.$extend.func) {
            $(".menu").hide();
            $btn.$extend.func($btn);
          } else if ($btn.$extend) {
            $(".menu").hide();
            PLU.execActions($btn.$extend);
          }
        },
       });

      //================================================================================
      //  活动
      //================================================================================
      // let activeArray=[]
      // activeArray.push({id:"bt_goShop1", text:"去小二", extend:"jh 1;"})
      // activeArray.push({id:"bt_buyItem1", text:"买四样", extend:"#21 buy_npc_item go 0;#21 buy_npc_item go 1;#21 buy_npc_item go 2;#21 buy_npc_item go 3;"})
      // activeArray.push({id:"bt_goShop2", text:"去掌柜", extend:"jh 5;n;n;n;w;", style:{background:"#FDD"}})
      // activeArray.push({id:"bt_buyItem2", text:"买红粉", extend:"#6 buy_npc_item go 0;", style:{background:"#FDD"}})
      // activeArray.push({id:"bt_goShop3", text:"去小贩", extend:"jh 2;n;n;n;n;e;", style:{background:"#DEF"}})
      // activeArray.push({id:"bt_buyItem3", text:"买黄粉", extend:"#6 event_1_17045611 go 0;", style:{background:"#DEF"}})
      // activeArray.push({id:"bt_goShop4", text:"去峨眉", extend:"jh 8;w;nw;n;n;n;n;e;e;n;n;e;kill?看山弟子;n;n;n;n;w;", style:{background:"#EFE"}})
      // activeArray.push({id:"bt_buyItem4", text:"买蓝粉", extend:"#6 event_1_39153184 go 0;", style:{background:"#EFE"}})
      // activeArray.push({id:"bt_goAll", text:"一键买材料", extend:"jh 1;#21 buy_npc_item go 0;#21 buy_npc_item go 1;#21 buy_npc_item go 2;#21 buy_npc_item go 3;jh 5;n;n;n;w;#6 buy_npc_item go 0;jh 2;n;n;n;n;e;#6 event_1_17045611 go 0;jh 8;w;nw;n;n;n;n;e;e;n;n;e;kill?看山弟子;n;n;n;n;w;#6 event_1_39153184 go 0;", style:{background:"#9F9"}})
      // activeArray.push({id:"bt_goShoot", text:"去放烟花", extend:"jh 2;n;n;n;", style:{background:"#FD9"}})
      // // activeArray.push({id:"bt_n", text:"", style:{opacity:0}})
      // // activeArray.push({id:"hr_sys", text:"", style:{width:"160px",opacity:0}, boxStyle:{"font-size":0}})
      // activeArray.push({id:"bt_goShoot1", text:"一键璀璨", extend:"#5 event_1_99582507;#15 event_1_48376442;", style:{background:"#F9D"}})
      // activeArray.push({id:"bt_goShoot2", text:"一键四款", extend:"#5 event_1_74166959;#5 event_1_10053782;#5 event_1_25918230;#5 event_1_48376442;", style:{background:"#D9F"}})
      // YFUI.addMenu({
      //     id: "m_active",
      //     groupId:"pluginMenus",
      //     text: "元宵",
      //     multiCol: true,
      //     style:{"background":"#FFFF55","width":"40px","margin-top":"25px"},
      //     menuStyle: {width: "160px","margin-top":"-22px"},
      //     children: activeArray,
      //     onclick($btn,$box){
      //         if($btn.$extend && $btn.$extend.func){
      //             //$(".menu").hide()
      //             $btn.$extend.func($btn)
      //         }else if($btn.$extend){
      //             //$(".menu").hide()
      // 			PLU.execActions($btn.$extend,()=>{
      // 				YFUI.writeToOut("<span style='color:#FFF;'>========== OK ==========</span>")
      // 			})
      // 		}
      //     }
      // })
      //========实验田===================================================
      if (PLU.developerMode) {
        let flagArray = [];
        flagArray.push({
          id: "bt_npcDataUpdate",
          text: "npc数据更新",
          extend: { func: PLU.npcDataUpdate },
        });
        YFUI.addMenu({
          id: "m_flag",
          groupId: "pluginMenus",
          text: "专属",
          multiCol: true,
          style: { background: "#FBB", width: "40px" },
          menuStyle: { width: "160px", "margin-top": "-117px" },
          children: flagArray,
          onclick($btn, $box) {
            if ($btn.$extend && $btn.$extend.func) {
              $(".menu").hide();
              $btn.$extend.func($btn);
            } else if ($btn.$extend) {
              $(".menu").hide();
              PLU.execActions($btn.$extend);
            }
          },
        });
      }
      //================================================================================
      //================================================================================
      let gh = parseInt($("#page").height() * $("#page").height() * 0.00025);
      YFUI.addBtn({
        id: "bt_col_null",
        groupId: "pluginMenus",
        text: "",
        style: { background: "transparent", height: gh + "px", width: "0px", visibility: "hidden" },
        boxStyle: { "pointer-events": "none" },
      });
      //战斗按钮
     /* YFUI.addBtn({
        id: "bt_kg_autoEscape",
        groupId: "pluginMenus",
        text: "逃跑",
        style: { background: "#DDCCEE", height: "20px", width: "40px" },
        // boxStyle:{"margin-bottom":"15px"},
        onclick($btn) {
          let btnFlag = PLU.setBtnRed($btn);
          if (btnFlag) {
            PLU.autoEscape({
              onEnd() {
                PLU.setBtnRed($btn);
              },
            });
          } else UTIL.delSysListener("onAutoEscape");
        },
      });*/
        YFUI.addBtn({
        id: "go_choujiang",
        groupId: "pluginMenus",
        text: "去抽奖",
        style: { background: "#DDCCEE", height: "20px", width: "40px" },
        // boxStyle:{"margin-bottom":"15px"},
        onclick($btn) {
            PLU.choujiang();
        },
      });
      YFUI.addBtn({
        id: "bt_kg_loopKill",
        groupId: "pluginMenus",
        text: "循环杀",
        style: { background: "#EECCCC", height: "20px", width: "40px" },
        // boxStyle:{"margin-bottom":"15px"},
        onclick($btn) {
          PLU.toLoopKill($btn);
        },
      });
      YFUI.addBtn({
        id: "bt_kg_teamSync",
        groupId: "pluginMenus",
        text: "同步",
        style: { background: "#DDCCEE", height: "20px", width: "40px" },
        boxStyle: { "margin-bottom": "15px" },
        onclick($btn) {
          PLU.toggleTeamSync($btn);
        },
      });
      YFUI.addBtn({
        id: "bt_kg_followKill",
        groupId: "pluginMenus",
        text: "跟杀",
        style: { background: "#FFDDDD", height: "25px", width: "40px" },
        onclick($btn) {
          PLU.toggleFollowKill($btn, "followKill");
        },
      });
      YFUI.addBtn({
        id: "bt_kg_autoCure",
        groupId: "pluginMenus",
        text: "血蓝",
        style: { background: "#CCCCFF", height: "25px", width: "40px" },
        onclick($btn) {
          PLU.toggleAutoCure($btn, "autoCure");
        },
      });
      YFUI.addBtn({
        id: "bt_kg_autoPerform",
        groupId: "pluginMenus",
        text: "连招",
        style: { background: "#FFCCFF", height: "25px", width: "40px" },
        onclick($btn) {
          PLU.toggleAutoPerform($btn, "autoPerform");
        },
      });
      //monitor
      let momaxW = $("#page").width() - $("#out").width() > 4 && $("#out").width() > 634 ? 475 : Math.floor($("#out").width() * 0.75);
      let leftSty = $("#page").width() - $("#out").width() > 4 && $("#page").width() > 634 ? "79px" : "12%";
      YFUI.addBtnGroup({
        id: "topMonitor",
        style: {
          position: "fixed",
          top: 0,
          left: leftSty,
          width: "75%",
          height: "15px",
          maxWidth: momaxW + "px",
          lineHeight: "1.2",
          fontSize: "11px",
          textAlign: "left",
          color: "#FF9",
          background: "rgba(0,0,0,0)",
          display: "none",
        },
      });
    },
    //================================================================================================
    getCache(key) {
      return PLU.CACHE[key] ?? "";
    },
    //================================================================================================
    setCache(key, val) {
      PLU.CACHE[key] = val;
      UTIL.setMem("CACHE", JSON.stringify(PLU.CACHE));
      return val;
    },
    //================================================================================================
    initStorage() {
      if (!UTIL.getMem("CACHE")) UTIL.setMem("CACHE", JSON.stringify(PLU.CACHE));
      let caObj,
        ca = UTIL.getMem("CACHE");
      try {
        caObj = JSON.parse(ca);
      } catch (err) { }
      if (caObj) {
        PLU.CACHE = caObj;
        let listen = [
          "listenPuzzle",
          "listenChat",
          "listenQL",
          "listenTF",
          "listenKFQL",
          "listenYX",
          "autoDZ",
          "autoHYC",
          "auto9H",
          "autoDY",
          "autoTP",
          "autoLX",
          "autoBF",
          "autoB5F",
          "autoB6",
          "autoConnect",
          "autoSignIn",
          "autoQuitTeam",
        ];
        for (var i = 0, len = listen.length; i < len; i++) {
          if (PLU.getCache(listen[i]) == 1) PLU.setListen($("#btn_bt_" + listen[i]), listen[i], 1);
        }
        if (PLU.getCache("listenPuzzle") == 0) {
          PLU.TMP.autotask = false;
        }
        if (PLU.getCache("followKill") == 1) {
          PLU.toggleFollowKill($("#btn_bt_kg_followKill"), "followKill", 1);
        }
        if (PLU.getCache("autoCure") == 1) {
          PLU.toggleAutoCure($("#btn_bt_kg_autoCure"), "autoCure", 1);
        }
        if (PLU.getCache("autoPerform") >= 1) {
          PLU.toggleAutoPerform($("#btn_bt_kg_autoPerform"), "autoPerform", PLU.getCache("autoPerform"));
        }
        if (PLU.getCache("showTopMonitor") == 1) {
          PLU.showMPFZ($("#btn_bt_showMPFZ"));
        }
      }
    },
    //================================================================================================
    initHistory() {
      //---------------------
      document.addEventListener("addLog", PLU.updateShowLog);
      //---------------------
      let hisArr = [],
        hstr = UTIL.getMem("HISTORY");
      if (hstr)
        try {
          hisArr = JSON.parse(hstr);
        } catch (err) { }
      if (hisArr && hisArr.length) {
        let nowTs = new Date().getTime();
        let newArr = hisArr.filter((h) => {
          UTIL.log(Object.assign({}, h, { isHistory: true }));
          if (nowTs - h.time > 43200000) return false;
          return true;
        });
        UTIL.logHistory = newArr;
        UTIL.setMem("HISTORY", JSON.stringify(newArr));
      }
      PLU.MPFZ = UTIL.getMem("MPFZ") ? JSON.parse(UTIL.getMem("MPFZ")) : {};
    },
    //================================================================================================
    initListeners() {
      //监听战斗消息
      UTIL.addSysListener("listenAllFight", (b, type, subtype, msg) => {
        if (type == "vs") {
          switch (subtype) {
            case "vs_info":
              if (b.containsKey("is_watcher")) {
                PLU.STATUS.inBattle = 2;
                break;
              }
              PLU.STATUS.inBattle = 1;
              if (!PLU.battleData)
                PLU.battleData = {
                  skills: {},
                  xdz: 0,
                  myPos: 0,
                  mySide: "",
                  performTime: 0,
                  cureTimes: 0,
                };
              for (let i = b.elements.length - 1; i > -1; i--) {
                let val = b.elements[i].value + "";
                if (!val || val.indexOf(PLU.accId) < 0) continue;
                PLU.battleData.myPos = b.elements[i].key.charAt(7);
                PLU.battleData.mySide = b.elements[i].key.substring(0, 3);
                break;
              }
              PLU.STATUS.isBusy = true;
              break;
            case "ready_skill":
              if (b.get("uid").indexOf(PLU.accId) < 0 || b.get("skill") == "fight_item") break;
              if (!PLU.battleData)
                PLU.battleData = {
                  skills: {},
                  xdz: 0,
                  myPos: 0,
                  mySide: "",
                  performTime: 0,
                  cureTimes: 0,
                };
              PLU.battleData.skills[b.get("pos") - 1] = {
                name: UTIL.filterMsg(b.get("name")),
                skill: b.get("skill"),
                xdz: b.get("xdz"),
                key: "playskill " + b.get("pos"),
              };
              break;
            case "add_xdz":
              if (b.get("uid").indexOf(PLU.accId) < 0) break;
              if (!PLU.battleData)
                PLU.battleData = {
                  skills: {},
                  xdz: 0,
                  myPos: 0,
                  mySide: "",
                  performTime: 0,
                  cureTimes: 0,
                };
              PLU.battleData.xdz = parseInt(b.get("xdz"));
              if (PLU.STATUS.inBattle == 1 && PLU.battleData && PLU.battleData.xdz > 1) {
                PLU.checkUseSkills();
              }
              break;
            case "playskill":
              if (b.get("uid").indexOf(PLU.accId) < 0) break;
              if (!PLU.battleData)
                PLU.battleData = {
                  skills: {},
                  xdz: 0,
                  myPos: 0,
                  mySide: "",
                  performTime: 0,
                  cureTimes: 0,
                };
              let x = PLU.battleData.xdz - parseInt(b.get("lose_xdz"));
              if (parseInt(b.get("lose_xdz"))) PLU.battleData.xdz = x > 0 ? x : 0;
              break;
            case "out_watch":
              PLU.STATUS.inBattle = 0;
              PLU.STATUS.isBusy = false;
              break;
            case "combat_result":
              PLU.STATUS.inBattle = 0;
              PLU.battleData = null;
              PLU.STATUS.isBusy = false;
              if (PLU.TMP.loopUseSkill) {
                clearInterval(PLU.TMP.loopUseSkill);
                PLU.TMP.loopUseSkill = null;
              }
              break;
            default:
              break;
          }
          if (PLU.STATUS.inBattle == 1 && !PLU.TMP.loopUseSkill) {
            PLU.TMP.loopUseSkill = setInterval(() => {
              if (PLU.STATUS.inBattle == 1 && PLU.battleData && PLU.battleData.xdz > 1) {
                PLU.checkUseSkills();
              }
            }, 250);
          }
        }
        if (g_gmain.is_fighting && PLU.STATUS.inBattle == 1) {
          if (type == "vs" || type == "attrs_changed") {
            //自动疗伤及自动技能
            if (PLU.battleData && PLU.battleData.xdz > 1 && PLU.STATUS.inBattle == 1) {
              PLU.checkUseSkills();
            }
          }
        }
      });
      //监听场景消息
      UTIL.addSysListener("listenNotice", (b, type, subtype, msg) => {
        if (type != "notice" && type != "main_msg") return;
        if (msg.match(/闲聊|告诉|队伍/)) return;
        let msgTxt = UTIL.filterMsg(msg);
        if (msgTxt.match("你打坐完毕") && PLU.getCache("autoDZ") == 1) {
          if (UTIL.inHome()) clickButton("exercise", 0);
          else PLU.TODO.push({ type: "cmds", cmds: "exercise", timeout: new Date().getTime() + 8 * 60 * 60 * 1000 });
        } else if ((msgTxt.match("你从寒玉床上爬起") || msgTxt.match("你从地髓石乳中出来")) && PLU.getCache("autoHYC") == 1) {
          if (UTIL.inHome()) PLU.execActions("golook_room;sleep_hanyuchuang;home");
          else PLU.TODO.push({ type: "cmds", cmds: "golook_room;sleep_hanyuchuang;home", timeout: new Date().getTime() + 8 * 60 * 60 * 1000 });
        } else if (msgTxt.match("你今天使用九花玉露丸次数已经达到上限了")) {
          YFUI.writeToOut("<span style='color:yellow;'>九花玉露丸次数已达到上限!取消监听九花玉露丸...</span>");
          PLU.setListen($("#btn_bt_auto9H"), "auto9H", 0);
        } else if (msgTxt.match("九花玉露丸效果：") && PLU.getCache("auto9H") == 1) {
          PLU.execActions("items use obj_jiuhuayulouwan");
        } else if (msgTxt.match("毒发作了！") && !g_gmain.is_fighting ) {
            let faminame = g_obj_map.get("msg_attrs") && g_obj_map.get("msg_attrs").get("family_name");
            if ( faminame !== "铁雪山庄") {
              //PLU.execActions("items use ice lotus");//解毒
            }
        } else if (msgTxt.match("病人终于心满意足")) {
          PLU.execActions("event_1_12050280");
        } else if (msgTxt.match("本届比武大会第一名")) {
          PLU.execActions(";;home;swords get_drop go");
        } else if ((msgTxt.includes("领取(.*)周奖励获得") || msgTxt.match("领取(.*)通关奖励获得")) && !msgTxt.includes("拱辰楼")) {
          PLU.execActions(";home;");
        } else if (msgTxt.match("你抽到了") && (type == "notice")) {
          if (msgTxt.match(/此轮游戏结束/)) {
              PLU.execActions("event_1_36867949 get;event_1_36867949 pay;event_1_36867949 take;");//拿钱走人再开
            }
            var sjindi = msgTxt.match(/奖池提升至(\d+)金锭/);
            var sjindiNumber = sjindi[1];
            if (sjindiNumber >= 30) {
              PLU.execActions("event_1_36867949 get;event_1_23520182");
              YFUI.writeToOut("<span style='color:#FFF;'>--到达--</span>");//到达地下格斗场
            } else {
              PLU.execActions(";event_1_36867949 take");//抽牌
            }
        } else if (msgTxt.includes("今天的游戏次数已达到上限了")) {
          PLU.execActions(";home");
          YFUI.writeToOut("<span style='color:yellow;'>---次数用完，明天再来---</span>");
        } else if (msgTxt.match(/此技能已经达到500级了/) && PLU.getCache("autoLX") == 1) {
          if (UTIL.inHome()) PLU.autoLianXi();
        } else if (msgTxt.match(/你的(.*)成功向前突破了/) && PLU.getCache("autoTP") == 1) {
          if (UTIL.inHome()) PLU.toToPo();
          else {
            let checktp = PLU.TODO.find((e) => e.cmds == "toToPo");
            if (!checktp) PLU.TODO.push({ type: "func", cmds: "toToPo", timeout: new Date().getTime() + 8 * 60 * 60 * 1000 });
          }
        } else if ((msgTxt.match("你现在正突破") && msgTxt.match("同时突破")) || msgTxt.match("此次突破需要")) {
          //突破失败
          PLU.TMP.stopToPo = true;
        } else if (msgTxt.match("青龙会组织：")) {
          //本服青龙
          let l = msgTxt.match(/青龙会组织：(.*)正在\003href;0;([\w\d\s]+)\003(.*)\0030\003施展力量，本会愿出(.*)的战利品奖励给本场战斗的最终获胜者。/);
          if (l && l.length > 3) {
            UTIL.log({ msg: "【青龙】" + l[3].padStart(5) + " - " + l[1].padEnd(4) + "  奖品:" + l[4], type: "QL", time: new Date().getTime() });
            if (PLU.getCache("listenQL") == 1) {
              let keysStr = PLU.getCache("listenQL_keys")
                .split("|")[1]
                .split(",")
                .map((e) => (e == "*" ? ".*" : e.replace("*", "\\*")))
                .join("|");
              let reg = new RegExp(keysStr);
              if (l[4].match(reg) && UTIL.inHome()) {
                PLU.goQinglong(l[1], l[3], PLU.getCache("listenQL_keys").split("|")[0], false);
              }
            }
          }
        } else if (msgTxt.match("这是你今天完成的第")) {
          //逃犯完成
          let l = msgTxt.match(/这是你今天完成的第(\d)\/\d场逃犯任务/);
          if (l && l.length > 0 && l[1] == 5) {
            YFUI.writeToOut('<span style="color:yellow;">逃犯任务已达到上限!取消逃犯监听...</span>');
            UTIL.log({ msg: " 逃犯任务已达到上限!取消逃犯监听...", type: "TIPS", time: new Date().getTime() });
            PLU.setListen($("#btn_bt_listenTF"), "listenTF", 0);
          }
        } else if (msgTxt.match("对你悄声道：你现在去") && !PLU.TMP.autoQixiaMijing) {
          //奇侠说秘境
          let l = msgTxt.match(/(.*)对你悄声道：你现在去(.*)，应当会有发现/);
          if (l && l.length > 2) {
            let placeData = PLU.YFD.mjList.find((e) => e.n == l[2]);
            if (placeData) {
              YFUI.writeToOut(
                "<span>奇侠秘境: <a style='text-decoration:underline;color:yellow;cursor:pointer;' onclick='PLU.execActions(\"" +
                placeData.v +
                "\")'>" +
                placeData.n +
                "</a></span>",
              );
              YFUI.showPop({
                title: "奇侠秘境",
                text: "秘境：" + placeData.n,
                okText: "去秘境",
                onOk() {
                  PLU.execActions(placeData.v + ";find_task_road secret;", () => {
                    YFUI.writeToOut(
                      "<span>:: <a style='text-decoration:underline;color:yellow;cursor:pointer;' onclick='clickButton(\"open jhqx\", 0)'>奇侠列表</a></span>",
                    );
                  });
                },
                onNo() { },
              });
            }
          }
        } else if (msgTxt.match("你赢了这场宝藏秘图之战！")) {
          PLU.execActions("clan bzmt puzz");
        } else if (msgTxt.match("开启了帮派副本") && PLU.getCache("autoBF") == 1) {
          //帮四开启
          let ll = msg.match(/开启了帮派副本.*十月围城.*【(.*)】/);
          if (ll) {
            let n = "一二三".indexOf(ll[1]);
            UTIL.log({ msg: "【帮四】帮四(" + ll[1] + ")开启 ", type: "BF", time: new Date().getTime() });
            if (n >= 0) {
              if (!g_gmain.is_fighting) {
                PLU.toBangFour(n + 1);
              } else {
                let checktodo = PLU.TODO.find((e) => e.cmds == "toBangFour");
                if (!checktodo) PLU.TODO.push({ type: "func", cmds: "toBangFour", param: n + 1, timeout: new Date().getTime() + 5 * 60 * 1000 });
              }
            }
          }
        } else if (msgTxt.match("开启了帮派副本") && PLU.getCache("autoB6") == 1) {
          //帮六开启
          let ls = msg.match(/开启了帮派副本.*蛮荒七神寨.*/);
          if (ls) {
            if (!g_gmain.is_fighting) {
              PLU.toBangSix();
            } else {
              let checktodo = PLU.TODO.find((e) => e.cmds == "toBangSix");
              if (!checktodo) PLU.TODO.push({ type: "func", cmds: "toBangSix", param: "", timeout: new Date().getTime() + 5 * 60 * 1000 });
            }
          }
        } else if (msgTxt.match("十月围城】帮派副本胜利")) {
          //帮四完成
          PLU.STO.bangFourTo && clearTimeout(PLU.STO.bangFourTo);
          if (!g_gmain.is_fighting) {
            setTimeout(() => {
              PLU.execActions("home;");
            }, 2000);
          }
        } else if (msgTxt.match("蛮荒七神寨】帮派副本胜利")) {
          //帮六完成
          PLU.STO.bangSixTo && clearTimeout(PLU.STO.bangSixTo);
          if (!g_gmain.is_fighting) {
            setTimeout(() => {
              PLU.execActions("home;");
            }, 2000);
          }
        } else if (msgTxt.match("你今天进入此副本的次数已达到上限了")) {
          //帮四六无法进入
          PLU.STO.bangFourTo && clearTimeout(PLU.STO.bangFourTo);
          PLU.STO.bangSixTo && clearTimeout(PLU.STO.bangSixTo);
          UTIL.log({ msg: " !!副本超量!!", type: "TIPS", time: new Date().getTime() });
        } else if (msgTxt.match(/你已进入帮派副本\*\*可汗金帐\*\*/) && PLU.getCache("autoB5F") == 1) {
          //帮五进入
          PLU.inBangFiveEvent();
        } else if (msgTxt.match("成功消灭了守将府内的所有敌人")) {
          //帮二完成
          let l = msgTxt.match(/守城成功】(.*)成功消灭了守将府内的所有敌人，帮派副本完成/);
          if (l && l.length > 1 && !g_gmain.is_fighting) {
            setTimeout(() => {
              PLU.execActions("home;");
            }, 3000);
          }
        } else if (msgTxt.match("你没有精良鱼饵，无法钓鱼")) {
          //钓鱼完成
          if (!UTIL.inHome() && !g_gmain.is_fighting) {
            if (PLU.getCache("autoDY") == 1) {
              let attr = g_obj_map.get("msg_attrs");
              if (attr.get("yuanbao") >= PLU.getCache("autoDY_key") + 50) PLU.execActions("shop buy shop45;diaoyu;");
              else
                setTimeout(() => {
                  PLU.execActions("home;");
                }, 1000);
            }
          } else
            setTimeout(() => {
              PLU.execActions("home;");
            }, 1000);
        }
      });
      //监听频道消息
      UTIL.addSysListener("listenChannel", function (b, type, subtype, msg) {
        if (type != "channel" || subtype != "sys") return;
        let msgTxt = UTIL.filterMsg(msg);
        //本服逃犯
        if (msgTxt.match("慌不择路") && msgTxt.indexOf("跨服") < 0) {
          var l = msgTxt.match(/系统】([\u4e00-\u9fa5|\*]+).*慌不择路，逃往了(.*)-\003href;0;([\w\d\s]+)\003([\u4e00-\u9fa5]+)/);
          if (l && l.length > 4) {
            UTIL.log({ msg: "【逃犯】" + l[2] + "-" + l[4] + " : " + l[1], type: "TF", time: new Date().getTime() });
            //111
            if (PLU.getCache("listenTF") == 1 && UTIL.inHome()) {
              if (!PLU.TMP.lis_TF_list) {
                PLU.splitTFParam();
              }
              if (PLU.TMP.lis_TF_list.includes(l[1])) {
                let idx = PLU.TMP.lis_TF_list.findIndex((k) => k == l[1]);
                if (idx >= 0) {
                  let gb = Number(PLU.getCache("listenTF_keys").split("|")[0]) || 0;
                  PLU.goTaofan(l[1], l[2], l[3], gb, PLU.TMP.lis_TF_force[idx]);
                }
              }
            }
          }
        } else if (msgTxt.match("跨服时空")) {
          //广场青龙
          let l = msgTxt.match(/跨服：(.*)逃到了跨服时空(.*)之中，青龙会组织悬赏(.*)惩治恶人，众位英雄快来诛杀。/);
          if (l && l.length > 3) {
            UTIL.log({ msg: "【跨服青龙】" + l[2] + " - " + l[1].padEnd(8) + "  奖品:" + l[3], type: "KFQL", time: new Date().getTime() });
            if (PLU.getCache("listenKFQL") == 1) {
              let keysStr = PLU.getCache("listenKFQL_keys")
                .split("|")[1]
                .split(",")
                .map((e) => (e == "*" ? ".*" : e.replace("*", "\\*")))
                .join("|");
              let reg = new RegExp(keysStr);
              if (PLU.developerMode && l[3].match(reg) && UTIL.inHome()) {
                UTIL.addSysListener("KuaFu", (b, type, subtype, msg) => {
                  if (b.get("map_id") == "kuafu") {
                    UTIL.delSysListener("KuaFu");
                    PLU.goQinglong(l[1], l[2], PLU.getCache("listenKFQL_keys").split("|")[0], true);
                  }
                });
                setTimeout(() => {
                  clickButton("change_server world;");
                }, 500);
              }
            }
          }
        } else if (msgTxt.match("江湖纷争")) {
          //江湖纷争
          let fz = msgTxt.match(
            /【江湖纷争】：(.*)(门派|流派)的(.*)剑客伤害同门，欺师灭组，判师而出，却有(.*)坚持此种另有别情而强行庇护，两派纷争在(.*)-(.*)一触即发，江湖同门速速支援！/,
          );
          if (!fz) return;
          let ro = fz[3];
          let pl = fz[5] + "-" + fz[6];
          let vs = fz[1] + " VS " + fz[4];
          let tp = fz[2];
          let logType = tp == "门派" ? "MPFZ" : "LPFZ";
          UTIL.log({ msg: "【" + tp + "之争】 " + ro + "  地点:[" + pl + "]  " + vs, type: logType, time: new Date().getTime() });
          if (tp == "门派") {
            let nowTime = new Date().getTime();
            for (let k in PLU.MPFZ) {
              if (k < nowTime) delete PLU.MPFZ[k];
            }
            let extime = new Date().getTime() + 1560000;
            PLU.MPFZ[extime] = { n: ro, p: pl, v: vs, t: new Date().getTime() };
            UTIL.setMem("MPFZ", JSON.stringify(PLU.MPFZ));
          }
        } else if (msgTxt.match("出来闯荡江湖了")) {
          //游侠
          let yx = msgTxt.match(/【系统】游侠会：听说(.*)出来闯荡江湖了，目前正在前往(.*)的路上/);
          if (!yx) return;
          let yn = $.trim(yx[1]);
          let yp = yx[2];
          let yr = "";
          PLU.YFD.youxiaList.forEach((g) => {
            if (g.v.includes(yn)) yr = g.n;
          });
          UTIL.log({ msg: "【游侠-" + yr + "】 " + yn + "  地点:[" + yp + "]  ", type: "YX", time: new Date().getTime() });
          if (PLU.getCache("listenYX") == 1 && UTIL.inHome()) {
            if (!PLU.TMP.listenYX_list) {
              PLU.TMP.listenYX_list = PLU.getCache("listenYX_keys").split(",");
            }
            if (PLU.TMP.listenYX_list && PLU.TMP.listenYX_list.includes(yn)) {
              let jhName = PLU.fixJhName(yp);
              let jhMap = PLU.YFD.mapsLib.Map.find((e) => e.name == jhName);
              if (!jhMap) return;
              else {
                let ways = jhMap.way.split(";");
                PLU.goFindYouxia({ paths: ways, idx: 0, objectNPC: yn });
              }
            }
          }
        }
      });
      //监听场景
      UTIL.addSysListener("listenRoomInfo", function (b, type, subtype, msg) {
        if (type == "prompt" && msg.indexOf("想要加入你的") >= 0) {
          PLU.execActions(b.get("cmd1"));
          PLU.execActions("prev;prev");
        }
        if (type == "notice" && subtype == "notify_fail" && msg.indexOf("必须杀完所有的怪物才可以打开宝箱") >= 0) {
          PLU.execActions("ak;;ka;;event_1_68529291;");
        }
        if (type == "notice" && msg.indexOf("完成子关卡*八戒神殿*获得武林名望值x50") >= 0) {
          let mapNamefb = UTIL.filterMsg(g_obj_map.get("msg_room").get("short"));
          if (mapNamefb.match(/本源之心/)) {
          setTimeout(() => {
              PLU.execActions("home;");
            }, 2500);
        }
      }

        if (type != "jh") return;
        //奇侠加按钮
        $("#out .out>button.cmd_click3").each((i, e) => {
          if (PLU.YFD.qixiaList.includes(e.innerText)) {
            let snpc = e.outerHTML.match(/clickButton\('look_npc (\w+)'/i);
            if (snpc && snpc.length >= 2) {
              $(e).css({ position: "relative" });
              let $btnAsk = $(
                '<span style="position:absolute;display:inline-block;left:0;top:0;padding:3% 5%;text-align:center;background:#39F;color:#fff;border-radius:3px;font-size:1.2em;">问<span>',
              );
              let $btnGold = $(
                '<span style="position:absolute;display:inline-block;right:0;bottom:0;padding:3% 5%;text-align:center;background:#F93;color:#fff;border-radius:3px;font-size:1.2em;">金<span>',
              );
              $(e).append($btnAsk);
              $(e).append($btnGold);
              $btnAsk.click((e) => {
                e.stopPropagation();
                PLU.execActions("ask " + snpc[1] + ";");
              });
              $btnGold.click((e) => {
                e.stopPropagation();
                let ename = snpc[1].split("_")[0];
                PLU.execActions("auto_zsjd20_" + ename + ";golook_room");
              });
            }
          }
        });
        //监听入队灵鹫和塔
        if (type == "jh" && subtype == "info" && PLU.getCache("autoQuitTeam") == 1) {
          let sn = g_obj_map.get("msg_room").get("short");
          if (
            sn.match(/灵鹫宫(\D+)层/) ||
            sn.match(/拱辰楼(\D+)层/) ||
            sn.match(/陈异叔(\D+)层/) ||
            sn.match(/无为寺(\D+)层/) ||
            sn.match(/一品堂(\D+)层/) ||
            sn.match(/名将堂(\D+)层/) ||
            sn.match(/魔皇殿(\D+)层/) ||
            sn.match(/藏典塔(\D+)层/) ||
            sn.match(/无相楼(\D+)层/) ||
            sn.match(/葬剑谷(\D+)层/) ||
            sn.match(/霹雳堂(\D+)层/) ||
            sn.match(/铸剑洞(\D+)层/) ||
            sn.match(/剑楼(\D+)层/) ||
            sn.match(/红螺寺(\D+)层/) ||
            sn.match(/通天塔(\D+)层/)
          ) {
            //退出队伍
            let quitTeamPrevTimeOut = setTimeout(() => {
              UTIL.delSysListener("quitTeamPrev");
            }, 5000);
            UTIL.addSysListener("quitTeamPrev", (b, type, subtype, msg) => {
              if (type == "team" && subtype == "info") {
                UTIL.delSysListener("quitTeamPrev");
                clearTimeout(quitTeamPrevTimeOut);
                clickButton("prev");
              }
            });
            clickButton("team quit");
          }
        }
        //刷新后恢复监听帮五
        if (type == "jh" && subtype == "info" && PLU.TMP.listenBangFive == undefined) {
          let roomName = UTIL.filterMsg(g_obj_map.get("msg_room").get("short"));
          if (roomName.match(/蒙古高原|成吉思汗的金帐/)) {
            PLU.inBangFiveEvent();
          } else {
            PLU.TMP.listenBangFive = false;
          }
        }
        return;
      });

      // 谜题密码
      UTIL.addSysListener("key", (b, type, subtype, msg) => {
        if (type != "channel" || subtype != "tell") return;
        let key = msg.match(/告诉你：谜题密码：(\d+)/)[1];
        if (key)
          PLU.TODO.push({
            type: "cmds",
            cmds: "jh 1;e;n;n;n;n;w;event_1_65953349 " + key + ";home;",
            timeout: new Date().getTime() + 8 * 60 * 60 * 1000,
          });
      });
      // 监听闲聊
      UTIL.addSysListener("listenChat", (b, type, subtype, msg) => {
        if (type != "channel" || subtype != "chat") return;
        /** UNICODE 15.0
         * CJK Radicals Supplement 2E80–2EFF
         * CJK Unified Ideographs (Han) 4E00–9FFF
         * CJK Extension A 3400-4DBF
         * CJK Extension B 20000–2A6DF
         * CJK Extension C 2A700–2B739
         * CJK Extension D 2B740–2B81D
         * CJK Extension E 2B820–2CEA1
         * CJK Extension F 2CEB0–2EBE0
         * CJK Extension G 30000–3134A
         * CJK Extension H 31350–323AF
         */
        msg = msg.replace("\f", "");
        let text = msg.match(/^[^：]+：.*?([\u2E80-\u2EFF\u3400-\u4DBF\u4E00-\u9FFF\-，”'!！]+道：.+)\x1B\[2;37;0m/);
        if (text) {
          text = text[1];
          if (text.match(/柴绍|李秀宁|大鹳淜洲/)) {
            /**
             * 李秀宁昨天捡到了我几十辆银子
             * 李秀宁鬼鬼祟祟的叫人生疑
             * 李秀宁竟对我横眉瞪眼的
             * 竟然吃了李秀宁的亏
             * 李秀宁竟敢得罪我
             * 被李秀宁抢走了
             * 李秀宁好大胆
             * 想找李秀宁
             * 藏在了(天龙寺-)?大鹳淜洲
             * 想要一件天罗紫芳衣
             */
            UTIL.log({
              msg: "【谜题-天命丹】" + text,
              type: "TIPS",
              time: new Date().getTime(),
            });
          } else if (text.match(/阴九幽|潜龙|谷底石室/)) {
            UTIL.log({
              msg: "【谜题-鬼杀剑】" + text,
              type: "TIPS",
              time: new Date().getTime(),
            });
          } else if (text.match(/打坐老僧|牟尼楼|牟尼洞/)) {
            UTIL.log({
              msg: "【谜题-700级读书识字】" + text,
              type: "TIPS",
              time: new Date().getTime(),
            });
          } else if (text.match(/本恒禅师|无相堂/)) {
            UTIL.log({
              msg: "【谜题-木棉袈裟】" + text,
              type: "TIPS",
              time: new Date().getTime(),
            });
          } else if (text.match(/天罗紫芳衣/)) {
            UTIL.log({
              msg: "【谜题-天命丹】" + text,
              type: "TIPS",
              time: new Date().getTime(),
            });
          } else if (text.match(/鬼杀剑|金凤翅盔/)) {
            UTIL.log({
              msg: "【谜题-鬼杀剑】" + text,
              type: "TIPS",
              time: new Date().getTime(),
            });
          } else if (text.match(/麻布僧衣/)) {
            UTIL.log({
              msg: "【谜题-700级读书识字】" + text,
              type: "TIPS",
              time: new Date().getTime(),
            });
          } else if (text.match(/追风棍|木棉袈裟/)) {
            UTIL.log({
              msg: "【谜题-木棉袈裟】" + text,
              type: "TIPS",
              time: new Date().getTime(),
            });
          }
        }
        let text2 = msg.match(/[^：]+：(.+)\x1B\[2;37;0m/)[1];
        if (PLU.getCache("listenChat") == 1 && text2 != "哈哈，我也来闯荡江湖啦！" && text2 != "哈哈，我去也……") YFUI.writeToOut(msg);
        let text3 = msg.match(/^[^：]+：(.+道)：(.+)\x1B\[2;37;0m/);
        if (text3) var tmp = PLU.queryNpc(text3[1], true);
        else {
          let text3 = msg.match(/^[^：]+：(.+)的谜题\x1B\[2;37;0m/);
          if (text3) var tmp = PLU.queryNpc(text3[1] + "道", true);
        }
        if (tmp && tmp.length && PLU.getCache("listenPuzzle") == 1) {
          PLU.TMP.autotask = true;
          for (var npc of tmp) {
            PLU.TODO.push({
              type: "func",
              cmds: "execActions",
              param: [
                npc.way,
                (code, name) => {
                  let npcObj = UTIL.findRoomNpc(name, 0, 1);
                  if (npcObj) PLU.execActions("ask " + npcObj.key);
                },
                npc.name_new ?? npc.name_tw ?? npc.name,
              ],
              timeout: new Date().getTime() + 15 * 60 * 1000,
            });
          }
        }
      });
      //----------监听练习----------------------------
      UTIL.addSysListener("listenPractice", (b, type, subtype, msg) => {
        if (type == "practice" && subtype == "stop_practice" && PLU.getCache("autoLX") == 1) {
          let skillId = b.get("sid"),
            lxcmds = "enable " + skillId + ";practice " + skillId;
          if (UTIL.inHome()) PLU.execActions(lxcmds);
          else
            PLU.TODO.push({
              type: "cmds",
              cmds: lxcmds,
              timeout: new Date().getTime() + 8 * 60 * 60 * 1000,
            });
        }
      });
      //----------------------------------------------
      //----------------------------------------------
      //监听剑阵
      UTIL.addSysListener("listenJianzhen", function (b, type, subtype, msg) {
        if (type != "notice") return;
        if (msg.indexOf("阵升级完毕！") < 0) return;
        let msgTxt = UTIL.filterMsg(msg);
        if (msgTxt.match(/(.*)阵升级完毕！成功升级到/)) {
          setTimeout(() => {
            let jzcmds = "hhjz xiulian go;;;hhjz speedup go;";
            let room = g_obj_map.get("msg_room")?.get("short");
            if (room == "桃溪" || room == "后山茶园" || UTIL.inHome()) PLU.execActions(jzcmds);
            else
              PLU.TODO.push({
                type: "cmds",
                cmds: jzcmds,
                timeout: new Date().getTime() + 8 * 60 * 60 * 1000,
              });
          }, 8000);
        }
      });
      //监听跟杀
      UTIL.addSysListener("listenFightKill", function (b, type, subtype, msg) {
        if (type != "main_msg" || !msg) return;
        if (msg.indexOf("对著") < 0) return;
        if (PLU.getCache("followKill") != 1) return;
        let msgTxt = UTIL.filterMsg(msg);
        var matchKill = msgTxt.match(/(.*)对著(.*)喝道：「(.*)！今日不是你死就是我活！」/);
        if (matchKill && $.trim(matchKill[1]) != "你" && $.trim(matchKill[2]) != "你" && !g_gmain.is_fighting) {
          PLU.toCheckFollowKill($.trim(matchKill[1]), $.trim(matchKill[2]), "kill", msgTxt);
          return;
        }
        var matchFight = msgTxt.match(/(.*)对著(.*)说道：(.*)，领教(.*)的高招！/);
        if (matchFight && $.trim(matchFight[1]) != "你" && $.trim(matchFight[2]) != "你" && !g_gmain.is_fighting) {
          PLU.toCheckFollowKill($.trim(matchFight[1]), $.trim(matchFight[2]), "fight", msgTxt);
          return;
        }
      });
      UTIL.addSysListener("room", (b, type, subtype, msg) => {
        if (type == "jh") {
          if (subtype == "info") {
            unsafeWindow.hasReachRoom = true;
            if (PLU.TMP.puzzleWating.puzzleid) {
              if (PLU.TMP.puzzleWating.status == "trace") {
                PLU.TMP.puzzleWating.status = "traced";
                PLU.autoPuzzle.doPuzzle(PLU.TMP.puzzleWating.puzzleid);
              } else if (PLU.TMP.puzzleWating.status == "return") {
                PLU.TMP.puzzleWating.status = "returned";
                PLU.autoPuzzle.doPuzzle(PLU.TMP.puzzleWating.puzzleid);
              }
            }
          } else if (subtype == "new_item" || subtype == "new_npc") {
            var name = PLU.autoPuzzle.ansiToHtml(b.get("name")),
              plainName = ansi_up.ansi_to_text(b.get("name")),
              id = b.get("id");
            if (PLU.TMP.puzzleWating && PLU.TMP.puzzleWating.puzzleid && PLU.TMP.puzzleWating.status == "wait") {
              if (subtype == "new_npc") {
                if (
                  ["npc_datan", "answer", "ask", "fight", "kill", "give"].indexOf(PLU.TMP.puzzleWating.actionCode) > -1 &&
                  (name == PLU.TMP.puzzleWating.target ||
                    (PLU.TMP.puzzleWating.target == "恶人" && id.indexOf("eren") == 0) ||
                    (PLU.TMP.puzzleWating.target == "捕快" && id.indexOf("bukuai") == 0) ||
                    (["柳绘心", "王铁匠", "杨掌柜", "客商", "柳小花", "卖花姑娘", "刘守财", "方老板", "朱老伯", "方寡妇"].indexOf(PLU.TMP.puzzleWating.target) > -1 &&
                      id.indexOf("bad_target_") == 0))
                ) {
                  PLU.execActions(PLU.TMP.puzzleWating.actionCode + " " + id);
                } else if (PLU.TMP.puzzleWating.actionCode == "killget" && plainName == PLU.TMP.puzzleWating.waitTargetName) {
                  PLU.execActions("kill " + id);
                }
              } else if (
                subtype == "new_item" &&
                ["get"].indexOf(PLU.TMP.puzzleWating.actionCode) > -1 &&
                (name == PLU.TMP.puzzleWating.target ||
                  (PLU.TMP.puzzleWating.target == "恶人" && id.indexOf("eren") == 0) ||
                  (PLU.TMP.puzzleWating.target == "捕快" && id.indexOf("bukuai") == 0) ||
                  (["柳绘心", "王铁匠", "杨掌柜", "客商", "柳小花", "卖花姑娘", "刘守财", "方老板", "朱老伯", "方寡妇"].indexOf(PLU.TMP.puzzleWating.target) > -1 &&
                    id.indexOf("bad_target_") == 0) ||
                  id.indexOf("corpse") > -1)
              ) {
                PLU.execActions("get " + id);
              }
            }
          }
        }
      });
      //test
      UTIL.addSysListener("testListener", (b, type, subtype, msg) => {
        if (type == "g_login" && subtype == "login_ret" && msg == "1") {
          YFUI.writeToOut("<span style='color:#FFF;background:#F00;'>[" + UTIL.getNow() + "] 断线重连了 </span>");
          PLU.TMP.reConnectTime = 0;
        }
      });
      UTIL.addSysListener("disconnect", (b, type, subtype, msg) => {
        if (type == "disconnect" && subtype == "change") {
        console.log("%c%s", "color:#F00", ">>>>>>>sock disconnected");
        //sock && sock.close(); sock = 0
        if (PLU.getCache("autoConnect") == 1) {
          let recTime = Number(PLU.getCache("autoConnect_keys"));
            if (recTime) g_gmain.g_delay_connect = recTime;
        }
        }
      });
      unsafeWindow.sock.on("telnet_connected", () => {
        console.log("%c%s", "color:#0F0", ">>>>>>>sock connected");
      });
      UTIL.addSysListener("YXSkillsListener", (b, type, subtype, msg) => {
        if (type != "show_html_page") return;
        if (msg.indexOf("须传授技能") < 0) return;
        let list = msg.match(/\x1B\[1;36m(\d+)\/(\d+)[\s\S]{1,200}(fudi juxian up_skill .* 10)/g);
        let outList = null;
        if (list && list.length) {
          outList = list.map((s) => {
            let r = s.match(/\x1B\[1;36m(\d+)\/(\d+)[\s\S]{1,200}(fudi juxian up_skill .* 10)/);
            return { lvl: r[1], max: r[2], cmd: r[3] + "0" };
          });
        }
        PLU.TMP.CUR_YX_SKILLS = outList;
        let matchNameLine = msg.match(/<span class="out2">([\s\S]+)<\/span><span class="out2">/);
        let npcNameLine = matchNameLine ? UTIL.filterMsg(matchNameLine[1]) : "";
        let dg = npcNameLine.match(/(\d+)级/)[1];
        PLU.TMP.CUR_YX_LEVEL = Number(dg);
        let nn = msg.match(/fudi juxian upgrade (\S+) 1/)[1];
        PLU.TMP.CUR_YX_ENG = nn;
      });
      UTIL.addSysListener("masterSkillsListener", (b, type, subtype, msg) => {
        if (type != "master_skills" || subtype != "list") return;
        let masterSkills = PLU.parseSkills(b);
        PLU.TMP.MASTER_ID = b.get("id");
        PLU.TMP.MASTER_SKILLS = masterSkills;
      });
    },
    //================================================================================================
    initTickTime() {
      setInterval(() => {
        let nowDate = new Date();
        let nowTime = nowDate.getTime();
        if (PLU.TODO.length > 0 && !PLU.STATUS.isBusy && UTIL.inHome()) {
          //待办
          let ctd = PLU.TODO.shift();
          if (nowDate.getTime() < ctd.timeout) {
            if (ctd.type == "cmds") {
              PLU.execActions(ctd.cmds);
            } else if (ctd.type == "func") {
              if (ctd.param) PLU[ctd.cmds](...ctd.param);
              else PLU[ctd.cmds]();
            }
          }
        }
        if ($("#topMonitor").text() != "") $("#topMonitor").empty();
        let bi = 0;
        for (let k in PLU.MPFZ) {
          if (k < nowTime) delete PLU.MPFZ[k];
          else {
            let f = PLU.MPFZ[k];
            let dt = Math.floor((k - nowTime) / 1000);
            let flo = bi % 2 == 1 ? "float:right;text-align:right;" : "";
            $("#topMonitor").append(
              `<div title="${f.v}" style="display:inline-block;width:40%;${flo}">${f.n.substr(0, 1)} <span style="color:#9CF;">[${
                f.p
              }]</span> <span style="color:#DDD;">${dt}</span></div>`,
            );
            bi++;
          }
        }
        if (PLU.ONOFF["btn_bt_waitCDKill"] && PLU.TMP.DATA_MPFZ) PLU.toCheckAndWaitCDKill(nowTime);
      }, 1000);
    },
    //================================================================================================
    toSignIn() {
      if (!this.signInMaps) this.initSignInMaps();
      let ckeds = PLU.getCache("signInArray")?.split(",") || this.signInMaps.map((e, i) => i);
      let htm = '<div style="display:flex;flex-direction:row;flex-wrap: wrap;justify-content: space-between;width: 100%;align-content: flex-start;line-height:2;">';
      this.signInMaps.forEach((e, i) => {
        if (!e.n) htm += '<span style="width:92px;">&nbsp;</span>';
        else
          htm += `<span><button class="signInBtn" data-sid="${i}" style="font-size:12px;padding:1px 2px;cursor:pointer;">GO</button>
            <label data-id="${i}" style="font-size:13px;margin:0 3px 5px 0;">${e.n}<input type="checkbox" name="signInId" value="${i}"
             ${ckeds.includes(i + "") || e.f ? "checked" : ""} ${e.f ? "disabled" : ""} /></label></span>`;
      });
      htm += '</div><button class="signInAll" style="cursor:pointer;position:absolute;left:15px;bottom:10px;">全选</button>';
      YFUI.showPop({
        title: "签到",
        text: htm,
        width: "360px",
        okText: "一键签到",
        onOk(e) {
          let checkeds = [];
          e.find('input[name="signInId"]:checked').each((i, b) => {
            checkeds.push(b.value);
          });
          PLU.setCache("auto9H", 1);
          PLU.setCache("signInArray", checkeds.join(","));
          PLU.goSign(checkeds);
        },
        onNo() { },
        afterOpen($el) {
          $el.find(".signInBtn").click((e) => {
            let btnSid = $(e.currentTarget).attr("data-sid");
            PLU.goSign(btnSid);
          });
          $el.find(".signInAll").click((e) => {
            $el.find('input[name="signInId"]').each(function () {
              $(this).prop("checked", true);
            });
          });
        },
      });
    },
    //================================================================================================
    autoSwords(callback) {
      UTIL.addSysListener("sword", (b, type, subtype, msg) => {
        if (type != "notice" || msg.indexOf("试剑") == -1) return;
        if (msg.indexOf("5/5") > 0 || !msg.indexOf("你今天试剑次数已达限额")) {
          UTIL.delSysListener("sword");
          callback && callback();
        } else PLU.execActions("swords fight_test go");
      });
      PLU.execActions("swords report go");
      PLU.execActions("swords;swords select_member heimuya_dfbb;swords select_member qingcheng_mudaoren;swords select_member tangmen_madam;swords fight_test go");
    },
    //================================================================================================
    autoGetVipReward(callback) {
      let acts = "";
      let vipInfo = g_obj_map.get("msg_vip");
      if (vipInfo.get("get_vip_drops") == 0) acts += "vip drops;";
      if (vipInfo.get("finish_sort") % 1000 < 5) acts += "#5 vip finish_sort;";
      if (vipInfo.get("finish_dig") % 1000 < 10) acts += "#10 vip finish_dig;";
      if (vipInfo.get("finish_diaoyu") % 1000 < 10) acts += "#10 vip finish_diaoyu;";
      if (vipInfo.get("do_task_num") % 1000 < 10) acts += "#10 vip finish_big_task;";
      if (vipInfo.get("family_quest_count") % 1000 < 25) acts += "#25 vip finish_family;";
      if (g_obj_map.get("msg_clan_view") && vipInfo.get("clan_quest_count") % 1000 < 20) acts += "#20 vip finish_clan;";
      if (vipInfo.get("saodang_fb_1")?.split(",")[2] || 0 % 1000 < 4) acts += "#4 vip finish_fb dulongzhai;";
      if (vipInfo.get("saodang_fb_2")?.split(",")[2] || 0 % 1000 < 4) acts += "#4 vip finish_fb junying;";
      if (vipInfo.get("saodang_fb_3")?.split(",")[2] || 0 % 1000 < 4) acts += "#4 vip finish_fb beidou;";
      if (vipInfo.get("saodang_fb_4")?.split(",")[2] || 0 % 1000 < 4) acts += "#4 vip finish_fb youling;";
      if (vipInfo.get("saodang_fb_5")?.split(",")[2] || 0 % 1000 < 3) acts += "#3 vip finish_fb siyu;";
      if (vipInfo.get("saodang_fb_6")?.split(",")[2] || 0 % 1000 < 3) acts += "#3 vip finish_fb changleweiyang;";
      if (vipInfo.get("saodang_fb_7")?.split(",")[2] || 0 % 1000 < 3) acts += "#3 vip finish_fb heishuihuangling;";
      if (vipInfo.get("saodang_fb_8")?.split(",")[2] || 0 % 1000 < 3) acts += "#3 vip finish_fb jiandangfenglingdu;";
      if (vipInfo.get("saodang_fb_9")?.split(",")[2] || 0 % 1000 < 3) acts += "#3 vip finish_fb tianshanlongxue;";
      if (vipInfo.get("saodang_fb_10")?.split(",")[2] || 0 % 1000 < 3) acts += "#3 vip finish_fb sizhanguangmingding;";
      if (vipInfo.get("saodang_fb_11")?.split(",")[2] || 0 % 1000 < 3) acts += "#3 vip finish_fb bajieshendian;";

      acts += "home;";
      PLU.execActions(acts, () => {
        callback && callback();
      });
    },

    autoShaodan(callback) {
      let acts = "";
      let vipInfo = g_obj_map.get("msg_vip");
      let isVip = vipInfo.get("vip_tm") > 0;
      if (vipInfo.get("saodang_fb_1")?.split(",")[2] || 0 % 1000 < 4) {
        if (isVip) acts += "#4 vip finish_fb dulongzhai;";
        else
          acts +=
            "team create;fb 1;;ak;n;;n;;n;;n;;ka;" +
            "team create;fb 1;;ak;n;;n;;n;;n;;ka;";
      }
      if (vipInfo.get("saodang_fb_2")?.split(",")[2] || 0 % 1000 < 4)
        if (isVip) acts += "#4 vip finish_fb junying;";
        else
          acts +=
            "team create;fb 2;;ak;;e;n;event_1_48728674;fb 2;e;s;event_1_41361248;fb 2;e;e;;event_1_43484736;;ka;@赫造基的尸体;@严廷殷的尸体;" +
            "team create;fb 2;;ak;;e;n;event_1_48728674;fb 2;e;s;event_1_41361248;fb 2;e;e;;event_1_43484736;;ka;@赫造基的尸体;@严廷殷的尸体;" ;
      if (vipInfo.get("saodang_fb_3")?.split(",")[2] || 0 % 1000 < 4) {
        if (isVip) acts += "#4 vip finish_fb beidou;";
        else
          acts +=
            "team create;fb 3;w;;ak;e;s;;n;e;;event_1_9777898;;ka;@天枢剑客的尸体;" +
            "team create;fb 3;w;;ak;e;s;;n;e;;event_1_9777898;;ka;@天枢剑客的尸体;";
      }
      if (vipInfo.get("saodang_fb_4")?.split(",")[2] || 0 % 1000 < 4) {
        if (isVip) acts += "#4 vip finish_fb youling;";
        else
          acts +=
            "team create;fb 4;n;;ak;n;;n;;n;;n;;ka;" +
            "team create;fb 4;n;;ak;n;;n;;n;;n;;ka;";
      }
      if (vipInfo.get("saodang_fb_5")?.split(",")[2] || 0 % 1000 < 3) {
        if (isVip) acts += "#3 vip finish_fb siyu;";
        else
          acts +=
          "team create;fb 5;event_1_26662342;ak;se;;nw;nw;event_1_15727082;;nw;;se;se;event_1_12238479;;sw;;ne;ne;event_1_889199;;ne;;sw;sw;;;;;;;event_1_77337496;;ka;";
      }
      if (vipInfo.get("saodang_fb_6")?.split(",")[2] || 0 % 1000 < 3) {
        if (isVip) acts += "#3 vip finish_fb changleweiyang;";
        else
          acts +=
            "team create;fb 6;event_1_94101353;ak;event_1_8221898;;event_1_18437151;;event_1_74386803;;event_1_39816829;event_1_92691681;event_1_19998221;event_1_62689078;;event_1_85127800;;ask changleweiyang_jiangzuodajiang;event_1_39026868;;s;;ka;";
      }
      if (vipInfo.get("saodang_fb_7")?.split(",")[2] || 0 % 1000 < 3)
        if (isVip) acts += "#3 vip finish_fb heishuihuangling;";
        else
          acts +=
            "team create;fb 7;event_1_20980858;;ak;fb 7;event_1_81463220;;fb 7;event_1_5770640;;fb 7;event_1_56340108;;event_1_21387224;s;;ka;event_1_94902320;";
      if (vipInfo.get("saodang_fb_8")?.split(",")[2] || 0 % 1000 < 3)
        if (isVip) acts += "#3 vip finish_fb jiandangfenglingdu;";
        else
          acts +=
            "team create;fb 8;n;;ak;n;;fb 8;e;;e;;fb 8;w;w;;fb 8;s;;s;;event_1_28034211;;ka;event_1_17257217;";
      if (vipInfo.get("saodang_fb_9")?.split(",")[2] || 0 % 1000 < 3)
        if (isVip) acts += "#3 vip finish_fb tianshanlongxue;";
        else acts += "team create;fb 9;;ak;n;;n;;n;;n;;n;;ka;";
      if (vipInfo.get("saodang_fb_10")?.split(",")[2] || 0 % 1000 < 3)
        if (isVip) acts += "#3 vip finish_fb sizhanguangmingding;";
        else acts += "team create;fb 10;;ak;n;;n;;n;;n;;n;;ka;";
      if (vipInfo.get("saodang_fb_11")?.split(",")[2] || 0 % 1000 < 3)
        if (isVip) acts += "#3 vip finish_fb bajieshendian;";
        else acts += "team create;fb 11;;ak;n;;n;;n;;n;;n;;ka;";
      acts += "home;";
      PLU.execActions(acts, () => {
        callback && callback();
      });
    },
    //================================================================================================
    getClanInfo(callback) {
      let openClanTimeout = setTimeout(() => {
        UTIL.delSysListener("listenOpenClan");
        callback && callback(0);
      }, 5000);
      UTIL.addSysListener("listenOpenClan", (b, type, subtype, msg) => {
        if (type == "clan") {
          UTIL.delSysListener("listenOpenClan");
          clearTimeout(openClanTimeout);
          clickButton("prev");
          //console.log(g_obj_map.get("msg_clan_view"))
          callback && callback(1);
        }
      });
      clickButton("clan");
    },
    getVipInfo(callback) {
      let openVipTimeout = setTimeout(() => {
        UTIL.delSysListener("listenOpenVip");
        callback && callback(0);
      }, 5000);
      UTIL.addSysListener("listenOpenVip", (b, type, subtype, msg) => {
        if (type == "vip") {
          UTIL.delSysListener("listenOpenVip");
          clearTimeout(openVipTimeout);
          clickButton("prev");
          //console.log(g_obj_map.get("msg_vip"))
          callback && callback(1);
        }
      });
      clickButton("vip");
    },
    //================================================================================================
    goSign(param) {
      if (!param) {
        return YFUI.writeToOut("<span style='color:#FFF;'>--结束--</span>");
      } else if (param.length == 0) {
        return YFUI.writeToOut("<span style='color:#FFF;'>--签到结束--</span>");
      }
      let sid = null;
      if (typeof param == "object") {
        sid = param.shift();
      } else {
        sid = param;
        param = null;
      }
      let signD = PLU.signInMaps[sid];
      if (signD.c != undefined) {
        if (signD.c()) {
          if (signD.fn) {
            signD.fn(() => {
              PLU.goSign(param);
            });
          } else if (signD.go) {
            PLU.execActions(signD.go, () => {
              PLU.goSign(param);
            });
          }
        } else {
          PLU.goSign(param);
        }
      } else {
        if (signD.fn) {
          signD.fn(() => {
            PLU.goSign(param);
          });
        } else if (signD.go) {
          PLU.execActions(signD.go, () => {
            PLU.goSign(param);
          });
        }
      }
    },
    //================================================================================================
    initSignInMaps() {
      let _this = this;
      this.getVipInfo((b) => {
        _this.getClanInfo((a) => { });
      });
      this.signInMaps = [
          { n: "扬州签到", f: true, go: "jh 5;n;n;n;w;look_npc yangzhou_yangzhou4;sign7;home;" },
          { n: "每日礼包", f: true, go: "jh 1;event_1_48246976;event_1_85373703;home;fudi houshan fetch;fudi juxian mpay;fudi juxian fetch_zhuguo;home;" },
          { n: "潜龙礼包", f: true, go: "jh 1;w;event_1_26383297;home;" },
          { n: "分享奖励", f: true, go: "share_ok 1;share_ok 2;share_ok 3;share_ok 4;share_ok 5;share_ok 7;home;" },
          { n: "南诏投资", f: true, go: "items get_store /obj/shop/jiuzhuanshendan;items get_store /obj/baoshi/hongbaoshi8;items get_store /obj/baoshi/huangbaoshi8;items get_store /obj/baoshi/lvbaoshi8;items get_store /obj/baoshi/zishuijing8;items get_store /obj/baoshi/lanbaoshi8;jh 54;#4 nw;#2 w;#4 n;#2 e;n;#2 e;event_1_62143505 go;;;event_1_62143505 get;event_1_63750325 get;home;" },
          { n: "消费积分", f: true, go: "jh 1;e;n;e;e;event_1_44731074;event_1_8041045;event_1_8041045;event_1_29721519;home;" },
          { n: "打坐睡床", f: true, go: "home;exercise stop;exercise;golook_room;sleep_hanyuchuang;home;" },
          { n: "买引路蜂", f: true, go: "shop money_buy mny_shop2_N_10;home;" },
          { n: "续约会员", go: "jh 1;event_1_45018293;home;" },
          { n: "领取工资", f: true,
           go: "home;work click maikuli;work click duancha;work click dalie;work click baobiao;work click maiyi;work click xuncheng;work click datufei;work click dalei;work click kangjijinbin;work click zhidaodiying;work click dantiaoqunmen;work click shenshanxiulian;work click jianmenlipai;work click dubawulin;work click youlijianghu;work click yibangmaoxiang;work click zhengzhanzhongyuan;work click taofamanyi;public_op3;home;",
          },
          { n: "爬楼奖励", f: true,
           go: "home;cangjian get_all;xueyin_shenbinggu blade get_all;xueyin_shenbinggu unarmed get_all;xueyin_shenbinggu throwing get_all;xueyin_shenbinggu spear get_all;xueyin_shenbinggu hammer get_all;xueyin_shenbinggu axe get_all;xueyin_shenbinggu whip get_all;xueyin_shenbinggu stick get_all;xueyin_shenbinggu staff get_all;home;",
          },
         // { n: "吃九花丸", go: "items use obj_jiuhuayulouwan;home;" },
          { n: "银两上香",f: true,  c: function () { return !!g_obj_map.get("msg_clan_view");},go: "#20 clan incense yx;#20 clan incense jx;#5 clan incense cx;home;",},
          { n: "VIP 福利",  c: function () {
              return g_obj_map.get("msg_vip") && g_obj_map.get("msg_vip").get("vip_tm") > 0 && g_obj_map.get("msg_vip").get("get_vip_drops") == 0;
          },
           go: "vip drops;home;",
          },
          {
              n: "VIP 暴击",go: "home;remove obj_dijianxian;wear obj_zhongzuiduxing;wear obj_qingtianwanshi;wear obj_lankeyimeng;wear obj_shanyecunfu;wear obj_xianzhe-xianglian;wear obj_xianzhe-shouzhuo;wear obj_xianzhe-jiezhi;#21 items use obj_mitiling;#15 vip finish_big_task;#15 vip buy_task;#15 vip finish_big_task;#15 vip buy_task;#15 vip finish_big_task;#15 vip buy_task;#15 vip finish_big_task;#15 vip buy_task;#15 vip finish_big_task;#15 vip buy_task;#15 vip finish_big_task;#15 vip buy_task;#15 vip finish_big_task;#15 vip buy_task;#15 vip finish_big_task;remove obj_zhongzuiduxing;remove obj_qingtianwanshi;remove obj_lankeyimeng;remove obj_shanyecunfu;remove obj_xianzhe-xianglian;remove obj_xianzhe-shouzhuo;remove obj_xianzhe-jiezhi;wear obj_jianyironghen;wear obj_wuyinglou-jiezhi;wear obj_jianxinbumie;wear obj_jiandaozhangcun;wear obj_wuyinglou-xianglian;wear obj_wuwozhijian;wear obj_wuyinglou-shouzhuo;wear obj_dijianxian;" ,
          },
          {
              n: "VIP 师门",
              c: function () {
                  return g_obj_map.get("msg_vip") && g_obj_map.get("msg_vip").get("vip_tm") > 0 && g_obj_map.get("msg_vip").get("family_quest_count") % 1000 < 25;
              },
              go: "#3 items use obj_shimenling;#100 vip finish_family;#10 event_1_71691631;",
          },
          {
              n: "VIP 帮派",
              c: function () {
                  return (
                      g_obj_map.get("msg_vip") &&
                      g_obj_map.get("msg_vip").get("vip_tm") > 0 &&
                      g_obj_map.get("msg_clan_view") &&
                      g_obj_map.get("msg_vip").get("clan_quest_count") % 1000 < 20
                  );
              },
              go: "#20 vip finish_clan;",
          },
          {
              n: "VIP 排行",f: true,
              c: function () {
                  return g_obj_map.get("msg_vip") && g_obj_map.get("msg_vip").get("vip_tm") > 0 && g_obj_map.get("msg_vip").get("finish_sort") % 1000 < 5;
              },
              go: "#5 vip finish_sort;",
          },
          {
              n: "VIP 寻宝",
              c: function () {
                  return g_obj_map.get("msg_vip") && g_obj_map.get("msg_vip").get("vip_tm") > 0 && g_obj_map.get("msg_vip").get("finish_dig") % 1000 < 10;
              },
              go: "#10 vip finish_dig;",
          },
          {
              n: "VIP 钓鱼",
              c: function () {
                  return g_obj_map.get("msg_vip") && g_obj_map.get("msg_vip").get("vip_tm") > 0 && g_obj_map.get("msg_vip").get("finish_diaoyu") % 1000 < 10;
              },
              go: "#10 vip finish_diaoyu;",
          },
          //{n:'VIP 扫荡',c:function(){return g_obj_map.get("msg_vip")&&g_obj_map.get("msg_vip").get("vip_tm")>0},fn:PLU.autoVipShaodan},
          { n: "扫荡副本",fn: PLU.autoShaodan },
          //{ n: "冰火玄铁", go: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;w;n;w;event_1_53278632;sousuo;sousuo;home;" },
          //{ n: "破阵采矿", go: "jh 26;w;w;n;e;e;event_1_18075497;w;w;n;event_1_14435995;home;" },
          //{ n: "求教阿不", go: "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n;n;n;n;n;n;n;n;w;w;event_1_57281457;event_1_10395181;;home;" },
          // { n: "绝情鳄鱼", go: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;ne;ne;se;n;event_1_97487911;home;" },
          // { n: "少林渡劫", go: "jh 13;e;s;s;w;w;w;;event_1_38874360;;kill?渡风神识;;home;" },
          //{ n: "天山七侠", fn: PLU.TianShan7Xia },
          // { n: "明教毒魔", go: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n;w;nw;nw;event_1_70957287;;kill?九幽毒魔;;home;" },
          //{ n: "侠客看书", go: "jh 36;yell;e;ne;ne;ne;e;e;e;event_1_9179222;e;event_1_11720543;home;" },
          //{ n: "白驼闯阵", go: "jh 21;n;n;n;n;w;;ak;w;;w;ka;w;;fight baituo_junzhongzhushuai;home;" },
          // { n: "青城孽龙", go: "jh 15;n;nw;w;nw;n;event_1_14401179;;kill?孽龙之灵;home;" },
          //{ n: "峨眉解围", go: "jh 8;ne;e;e;e;n;;kill?赤豹死士;n;n;;kill?黑鹰死士;n;n;;kill?金狼大将;home;" },
          // { n: "大昭岩画", go: "jh 26;w;w;n;w;w;w;n;n;place?阴山岩画;event_1_12853448;home;" },
          // { n: "恒山盗贼", go: "jh 9;event_1_20960851;;kill?杀神寨匪首;home;" },
          //{ n: "白驮奇袭",go: "jh 21;n;n;n;n;e;e;e;e;e;e;e;s;s;event_1_66710076;s;e;ne;e;se;n;event_1_53430818;n;;kill?豹军主帅;s;s;nw;n;n;;kill?虎军主帅;s;s;se;e;e;e;;kill?鹰军主帅;w;w;w;nw;w;nw;event_1_89411813;;kill?颉利;home;"},
          //{ n: "十八木人", go: "jh 41;se;e;e;se;se;se;se;se;se;event_1_57976870;n;n;n;event_1_91914705;e;e;e;e;#2 vent_1_85950082;home;" },
          { n: "西安采莲", f: true, go: "jh 2;#19 n;e;n;n;n;w;event_1_31320275;home;" },
          //{ n: "论剑试剑", fn: PLU.autoSwords },
          //{ n: "唐门冰月", fn: PLU.autoBingyue },
          { n: "华山祭酒", f: true, go: "jh 4;n;n;n;n;n;n;n;n;n;e;n;n;n;n;n;event_1_355715;event_1_355715;home;" },
          { n: "活动签到", f: true, go: "jh 5;n;w;event_1_3144437;event_1_85439674;home;jh 2;#4 n;w;s;qixilibao;qixilibao1;" },
          { n: "扬州抽奖",  go: "items get_store /obj/shop/choujiangquan;jh 5;n;n;e;event_1_90665830" },
          { n: "扫荡帮五", f: true, go: "clan fb go_saodang kehanjinzhang2;clan buy 103;clan buy 104;items use obj_clan_daodang6;items use obj_clan_daodang4;" },
          { n: "斥候门票", f: true, go: "jh 1;event_1_57222966;items use obj_bqd;home;" },
          { n: "杀小龙人", f: true, go: "jh 2;event_1_69287816;#2 kill snow_xiaolongren;;#2 kill snow_xiaolongren;;;;;" },
          { n: "洛阳采矿", f: true, go: "jh 2;#10 n;w;w;event_1_85264690;w;w;event_1_37287831;event_1_7731992;home;" },
          { n: "洞府演奏", f: true, go: "event_1_23611724;#4 w;#3 event_1_91626116;" },
          { n: "茶山采茶", go: "rank go 193;s;s;sw;sw;w;s;se;#4 w;#3 s;e;e;s;event_1_38117343;#12 event_1_19342640;" },
          { n: "日常扫荡", go: "shop buy shop1;items use obj_rcrwsdj;" },
          { n: "长白抄书", go: "jh 55;e;ne;n;w;n;e;se;n;n;w;w;w;n;n;w;n;e;e;s;s;e;n;n;n;n;n;event_1_21205386;event_1_21205386;event_1_21205386" },
          { n: "天池泡澡", go: "jh 55;e;ne;n;w;n;e;se;n;n;w;w;w;w;w;w;n;e;n;w;w;s;w;w;s;w;n;ne;n;n;e;s;e;n;nw;w;n;e;n;w;n;ne;nw;nw;ne;e;e;n;w;ne;event_1_53145897;event_1_16427201;" },
          { n: "龙辰兑奖", go: "items get_store /obj/quest/jinyuhufusuipian;event_1_56364978;jh 1;e;n;n;n;n;w;event_1_90287255 go go_lsyj;event_1_49251725;home;" },
          //{ n: "自动答题", fn: PLU.loopAnswerQues },
          //{ n: "暖冬礼包", go: "jh 1;w;event_1_67976578;home;" },
          //{ n: "讨天命丹", fn: PLU.askTianmd },
          { n: "日常任务", fn: PLU.richangjob },
          { n: "周常任务", fn: PLU.zhouchangjob },
          //{ n: "预留任务", go: "attrs;" },
          { n: "", go: "home;" },
      ];
    },
    //================================================================================================
    TianShan7Xia(callback) {
      PLU.execActions("jh 39;ne;e;n;ne;ne;n;ne;nw;ne;nw;event_1_17801939;place?星星峡;ne;ne;nw;nw", () => {
        PLU.autoFight({
          targetKey: "\nevent_1_37376258", // 懒的改函数了，直接注入（
          fightKind: " ",
          onFail() {
            PLU.execActions("home;", () => {
              callback && callback();
            });
          },
          onEnd() {
            PLU.execActions("home;", () => {
              callback && callback();
            });
          },
        });
      });
    },
    loopAnswerQues(callback) {
      let setAnswerTimeout = function () {
        PLU.STO.ansTo && clearTimeout(PLU.STO.ansTo);
        PLU.STO.ansTo = setTimeout(() => {
          UTIL.delSysListener("onAnswerQuestions");
          YFUI.writeToOut("<span style='color:#FFF;'>--答案超时！--</span>");
        }, 5000);
      };
      UTIL.addSysListener("onAnswerQuestions", function (b, type, subtype, msg) {
        if (type == "notice" && msg.indexOf("每日武林知识问答次数已经达到限额") > -1) {
          if (callback) callback();
          else clickButton("home");
          UTIL.delSysListener("onAnswerQuestions");
          PLU.STO.ansTo && clearTimeout(PLU.STO.ansTo);
          return;
        }
        if (type != "show_html_page") return;
        var qs = msg.split("\n");
        if (!qs) return;
        if (qs[0].indexOf("知识问答第") < 0) return;
        setAnswerTimeout();
        var qus = "";
        for (var i = 1; i < qs.length; i++) {
          qus = $.trim(UTIL.filterMsg(qs[i]));
          if (qus.length > 0) break;
        }
        if (qus.indexOf("回答正确") >= 0) {
          clickButton("question");
          return;
        }
        var answer = PLU.getAnswer2Question(qus);
        if (answer == null) {
          UTIL.delSysListener("onAnswerQuestions");
          PLU.STO.ansTo && clearTimeout(PLU.STO.ansTo);
          PLU.setBtnRed($btn, 0);
          YFUI.writeToOut("<span style='color:#FFF;'>--未找到答案：" + qus + "--</span>");
          return;
        }
        setTimeout(() => {
          clickButton("question " + answer);
        }, 300);
      });
      setAnswerTimeout();
      clickButton("question");
    },
    //================================================================================================
    getAnswer2Question(localQuestion) {
      var answer = PLU.YFD.QuestAnsLibs[localQuestion];
      if (answer) return answer;
      var halfQuestion = localQuestion.substring(localQuestion.length / 2);
      for (var quest in PLU.YFD.QuestAnsLibs) {
        if (quest.indexOf(halfQuestion) == 0) {
          return PLU.YFD.QuestAnsLibs[quest];
        }
      }
      return null;
    },
     //================================================================================================

    //================================================================================================
    autoBingyue(callback) {
      PLU.execActions("jh 14;w;n;n;n;n;event_1_32682066;;;", () => {
        setTimeout(() => {
          PLU.killBingYue(() => {
            if (callback) callback();
            else clickButton("home");
          });
        });
      });
    },
    //================================================================================================
    killBingYue(endCallback) {
      if (parseInt(PLU.getCache("autoPerform")) < 1) {
        PLU.toggleAutoPerform($("#btn_bt_kg_autoPerform"), "autoPerform", 1);
      }
      let tryKill = function (kname, cb, er) {
        PLU.autoFight({
          targetName: kname,
          fightKind: "kill",
          onFail() {
            er && er();
          },
          onEnd() {
            cb && cb();
          },
        });
      };
      PLU.execActions("event_1_48044005;;;;", () => {
        tryKill("冰麟兽",() => {PLU.execActions("event_1_95129086;;;;", () => {
        tryKill("玄武机关兽",() => {PLU.execActions("event_1_17623983;event_1_41741346;;;;", () => {
        tryKill("九幽魔灵",() => {PLU.execActions("s;;;;", () => {
        tryKill("冰月仙人",() => {endCallback && endCallback();},() => {endCallback && endCallback();},);
                        });
                      },
                      () => {
                        endCallback && endCallback();
                      },
                    );
                  });
                },
                () => {
                  endCallback && endCallback();
                },
              );
            });
          },
          () => {
            endCallback && endCallback();
          },
        );
      });
    },
    //================================================================================================
    autoXTL1() {
      clickButton("team create");
      PLU.killLHYD((err) => {
        return YFUI.writeToOut("<span style='color:#FFF;'>--结束--" + err + "</span>");
      });
    },
    autoXTL2() {
      clickButton("team create");
      PLU.killSY((err) => {
        return YFUI.writeToOut("<span style='color:#FFF;'>--结束--" + err + "</span>");
      });
    },
    autoFB11() {
      //clickButton("team create");
      YFUI.showPop({
        title: "副本11",
        text: "请自行组队，准备好可以开始",
        onOk(val) {
          PLU.killFB11((err) => {
            return YFUI.writeToOut("<span style='color:#FFF;'>--结束--" + err + "</span>");
          });
        },
        onNo() { },
    });

    },
    autoFB10() {
      clickButton("team create");
      PLU.killFB10((err) => {
        return YFUI.writeToOut("<span style='color:#FFF;'>--结束--" + err + "</span>");
      });
    },
    autoyoumhy() {
      clickButton("team create");
      PLU.killyoumhy((err) => {
        return YFUI.writeToOut("<span style='color:#FFF;'>--结束--" + err + "</span>");
      });
    },
    autoERG() {
      PLU.killERG((err) => {
        return YFUI.writeToOut("<span style='color:#FFF;'>--结束--" + err + "</span>");
      });
    },
    //================================================================================================
    scanPuzzle() {
      PLU.TMP.autoscan = true;
      PLU.TMP.autotask = true;
      UTIL.addSysListener("reload", (b, type, subtype, msg) => {
        if (type == "notice" && subtype == "notify_fail" && msg == "你的背包里没有这个物品。\n") location.reload();
      });
      if (!PLU.TMP.index) PLU.TMP.index = 0;
      PLU.TMP.func = () => {
        PLU.execActions(PLU.linkPath(PLU.queryRoomPath(), PLU.YFD.mapsLib.Npc_New[PLU.TMP.index].way), () => {
          PLU.execActions(";;ask " + PLU.YFD.mapsLib.Npc_New[PLU.TMP.index].id, () => {
            PLU.TMP.puzzleTimeOut = setTimeout(() => {
              if (!PLU.TMP.puzzleWating.status) {
                PLU.TMP.index++;
                PLU.TMP.func();
              }
            }, PLU.getCache("puzzleTimeOut") * 1000);
          });
        });
      };
      PLU.TMP.func();
    },
    puzzleKey() {
      YFUI.showInput({
        title: "密码设置",
        text: "此设置跨角色共享<br>指定暴击密码由谁提交(输入角色ID)",
        value: localStorage.getItem("masterAcc") || PLU.accId,
        onOk(val) {
          localStorage.setItem("masterAcc", String(val));
        },
        onNo() { },
      });
    },
    puzzleTimeOut() {
      YFUI.showInput({
        title: "超时设置",
        text: "一条谜题最多耗时(单位：秒)，0为不超时，暂不推荐设置为0",
        value: PLU.getCache("puzzleTimeOut") || 60,
        onOk(val) {
          PLU.setCache("puzzleTimeOut", val);
        },
        onNo() { },
      });
    },
    path4FHMJ(endCallback) {
      PLU.execActions("jh");
      if (g_obj_map.get("msg_jh_list") && g_obj_map.get("msg_jh_list").get("finish43") == 0) {
        return "jh 1;e;n;n;n;n;w;event_1_90287255 go 6;e;s;sw;se;ne;se;s;";
      } else {
        return "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;;s;";
      }
    },
    //琅嬛玉洞
    killLHYD(endCallback) {
      PLU.execActions(PLU.path4FHMJ() + ";event_1_52732806", (f) => {
        if (!f) return endCallback && endCallback(1);
        PLU.execActions("kill langhuanyudong_qixing;;kill langhuanyudong_benkuangxiao;;sw;;kill murong_tuboguoshi;;;get?吐蕃国师的尸体;;", (f2) => {
          if (!f2) return endCallback && endCallback(2);
          PLU.execActions("ne;n;;event_1_96023188;w;event_1_39972900;w;event_1_92817399;w;event_1_91110342;s;event_1_74276536;se;event_1_14726005;se;se;;;", () => {
            let sd = g_obj_map.get("msg_room").elements.find((e) => e.value.indexOf("扫荡") >= 0);
            if (sd) {
              let cmd_sd = g_obj_map.get("msg_room").get(sd.key.split("_")[0]);
              PLU.doSaoDang("langhuanyudong", cmd_sd, () => {
                PLU.killLHYD(endCallback);
              });
            } else {
              endCallback && endCallback(5);
            }
          });
        });
      });
    },
    //山崖
    killSY(endCallback) {
      PLU.execActions(PLU.path4FHMJ() + "event_1_64526228", (f) => {
        if (!f) return endCallback && endCallback(1);
        PLU.execActions("kill shanya_muzhaoxue;;kill shanya_qiongduwu;;kill shanya_yuanzhenheshang;;;", (f2) => {
          if (!f2) return endCallback && endCallback(2);
          PLU.execActions("w;event_1_61179401;n;event_1_93134350;n;event_1_60227051;n;event_1_66986009;;kill mingjiao_mengmianrentoumu;;;;get?蒙面人头目的尸体;;", () => {
            PLU.execActions("n;event_1_53067175;n;event_1_58530809;w;event_1_86449371;event_1_66983665;;", () => {
              let sd = g_obj_map.get("msg_room").elements.find((e) => e.value.indexOf("扫荡") >= 0);
              if (sd) {
                let cmd_sd = g_obj_map.get("msg_room").get(sd.key.split("_")[0]);
                PLU.doSaoDang("shanya", cmd_sd, () => {
                  PLU.killSY(endCallback);
                });
              } else {
                endCallback && endCallback(5);
              }
            });
          });
        });
      });
    },
    // 恶人谷
    killERG(endCallback) {
      var flag = false;
      PLU.execActions("rank go 236;", (f) => {
        if (!f) return endCallback && endCallback(1);
        PLU.execActions("nw;n;n;n;n;n;n;wait#kill tianlongsi_lidazui;get?李大嘴的尸体;", (f2) => {
          if (!f2) return endCallback && endCallback(2);
          PLU.execActions("nw;nw;n;wait#kill tianlongsi_baikaixin;get?白开心的尸体;", (f3) => {
            if (!f3) return endCallback && endCallback(3);
            PLU.execActions("home;items use tianlongsi_nanguagu;items use tianlongsi_sanxiangmenmgzhuling;")
          });
        });
      });
    },
    buyJHYL() {
      UTIL.addSysListener("9HYL", (b, type, subtype, msg) => {
        if (type != "show_html_page") return;
        var sp = msg.match(/你有四海商票\u001b\[1;32mx(\d+)\u001b\[2;37;0m/);
        if (!sp) return;
        sp = sp[1];
        if (sp < 21750) return YFUI.writeToOut("<span style='color:#FF0;'>--你的商票不足21750--</span>");
        else
          PLU.execActions(
            "reclaim buy 27 go 45;" + // 矢车菊
            "reclaim buy 46 go 45;" + // 雪英
            "reclaim buy 45 go 45;" + // 忘忧草
            "reclaim buy 29 go 15;" + // 凤凰木
            "reclaim buy 36 go 5;" + // 洛神花
            "reclaim buy 31 go 45;" + // 君影草
            "reclaim buy 32 go 45;" + // 仙客来
            "reclaim buy 33 go 15;" + // 凌霄花
            "reclaim buy 34 go 15;" + // 夕雾草
            (UTIL.inHome() ? "go_lookroom" : "home"),
          );
        UTIL.delSysListener("9HYL");
      });
      PLU.execActions("reclaim recl");
    },
    //================================================================================================
    richangjob(endCallback) {
        var flag = false;
        function execTask(actions, callback, num) {
          PLU.execActions(actions, (f) => {
            if (!f) {
              YFUI.writeToOut("<span style='color:#FFF;'>====日常任务结束====</span>");
              return endCallback && endCallback(num);
            }
            setTimeout(() => {
              callback && callback(num + 1);
            }, 2000);
          });
        }
        function task1(num) {
            execActions("jh 45;ne;ne;n;n;ne;ne;e;ne;#5 n;ne;ne;#3 n;nw;nw;n;#5 e;event_1_77775145 ymsz_houyuan;se;ak;;se;;s;;w;;e;e;;w;s;;s;;s;;w;;e;e;;s;;n;e;;e;;n;;s;e;;e;;n;ka;;", task2, num);
        }
        function task2(num) {
            execTask("jh 45;ne;ne;n;n;ne;ne;e;ne;#5 n;ne;ne;#3 n;nw;nw;n;#5 e;event_1_77775145 ymsz_houyuan;se;ak;;se;;s;;w;;e;e;;w;s;;s;;s;;w;;e;e;;s;;n;e;;e;;n;;s;e;;e;;n;ka;;", task3, num);
        }
        function task3(num) {
            execTask("jh 45;ne;ne;n;n;ne;ne;e;ne;#5 n;ne;ne;#3 n;nw;nw;n;#5 e;event_1_77775145 ymsz_houyuan;se;ak;;se;;s;;w;;e;e;;w;s;;s;;s;;w;;e;e;;s;;n;e;;e;;n;;s;e;;e;;n;ka;;", task4, num);
        }
        function task4(num) {
          execTask("fb 11;nw;ak;;se;n;;;s;ne;;;sw;e;;;w;se;;;nw;s;;;n;sw;;;ne;w;;;w;;;e;e;nw;nw;;;se;se;n;n;;;s;s;ne;ne;;;sw;sw;e;e;;;w;w;se;se;;;nw;nw;s;s;;;n;n;sw;sw;;attrs;;attrs;;attrs;;attrs;;attrs;;golook_room;;golook_room;;ka;event_1_68529291;;event_1_68529291;", task5, num);
        }
        function task5(num) {//铁剑
          execTask("jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;n;n;n;nw;nw;ne;n;ne;n;event_1_10117215;;", task6, num);
        }
        function task6(num) {//白猿
          execTask("rank go 204;e;s;s;s;s;s;s;s;s;w;w;n;n;n;n;nw;nw;nw;n;n;n;event_1_86676244;;", task7, num);
        }
        function task7(num) {//阎王10
          execTask("rank go 223;nw;event_1_42827171;ak;;ka;event_1_45876452;;", task8, num);
        }
        function task8(num) {//拱辰13
          execTask("jh 1;e;#4 n;w;event_1_90287255 go 9;n;#3 w;n;event_1_63249896;ak;;ka;event_1_23639130;;", task9, num);
        }
        function task9(num) {//荣宝斋

            execTask("event_1_87723605;;s;w;w;#10 s;w;w;n;event_1_27429615;;", (result) => {
                if (result.type == "notice" && result.msg.indexOf("你的'南诏棋谱'未达到1000级") > -1) {
                  YFUI.writeToOut("<span style='color:#FFF;'>---条件不足-跳过荣宝斋---</span>");
                task10(num);
                // 或者直接执行下一个任务，调用 task10(num) 或其他函数
              } else {
                task10(num);
              }
            }, num);
          }
          function task10(num) {//回城
            YFUI.writeToOut("<span style='color:#FFF;'>====日常任务结束====</span>");
            execTask("home", null, num);
          }
        task1(1);
      },

    tiejian(){  //西凉铁剑
        PLU.execActions(
          "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;n;n;n;nw;nw;ne;n;ne;n;event_1_10117215;;"
        );
      },
    baiyuan(){  //剑宫白猿
        PLU.execActions(
          "rank go 204;e;s;s;s;s;s;s;s;s;w;w;n;n;n;n;nw;nw;nw;n;n;n;event_1_86676244;;"
        );
      },
    yanwang10(){  //阎王十殿
        PLU.execActions(
          "rank go 223;nw;event_1_42827171;ak;;ka;event_1_45876452;;"
        );
      },
    gongcheng13(){  //拱辰13
        PLU.execActions(
          "jh 1;e;#4 n;w;event_1_90287255 go 9;n;#3 w;n;event_1_63249896;ak;;ka;event_1_23639130;;"
        );
      },
    rongbaoz(){  //荣宝斋
        PLU.execActions(
          "event_1_87723605;;s;w;w;#10 s;w;w;n;event_1_27429615;;"
        );
      },
    //================================================================================================
    zhouchangjob(endCallback) {
        var flag = false;
        function execTask(actions, callback, num) {
          PLU.execActions(actions, (f) => {
            if (!f) {
              YFUI.writeToOut("<span style='color:#FFF;'>====周常任务结束====</span>");
              return endCallback && endCallback(num);
            }
            setTimeout(() => {
              callback && callback(num + 1);
            }, 2000);
          });
        }

        function task1(num) {
          execTask("fb 11;nw;ak;;se;n;;;s;ne;;;sw;e;;;w;se;;;nw;s;;;n;sw;;;ne;w;;;w;;;e;e;nw;nw;;;se;se;n;n;;;s;s;ne;ne;;;sw;sw;e;e;;;w;w;se;se;;;nw;nw;s;s;;;n;n;sw;sw;;attrs;;attrs;;attrs;;attrs;;attrs;;golook_room;;golook_room;;ka;;event_1_68529291;;", () => {
            setTimeout(() => {
              PLU.execActions("ak;;;ka;;event_1_68529291;;");
              task5(num);
            }, 7000);
          }, num);
        }
        function task5(num) {//铁剑
          execTask("jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;n;n;n;nw;nw;ne;n;ne;n;event_1_10117215;;", task6, num);
        }
        function task6(num) {//白猿
          execTask("rank go 204;e;s;s;s;s;s;s;s;s;w;w;n;n;n;n;nw;nw;nw;n;n;n;event_1_86676244;;", task7, num);
        }
        function task7(num) {//阎王10
          execTask("rank go 223;nw;event_1_42827171;ak;;ka;event_1_45876452;;", task8, num);
        }
        function task8(num) {//拱辰13
          execTask("jh 1;e;#4 n;w;event_1_90287255 go 9;n;#3 w;n;event_1_63249896;ak;;ka;event_1_23639130;;", task9, num);
        }
        function task9(num) {//荣宝斋
            execTask("event_1_87723605;;s;w;w;#10 s;w;w;n;event_1_27429615;;", (result) => {
                if (type == "main_msg" && msg.indexOf("你的'南诏棋谱'未达到1000级！")) {
                  YFUI.writeToOut("<span style='color:#FFF;'>---条件不足-跳过荣宝斋---</span>");
                task10(num);
                // 或者直接执行下一个任务，调用 task10(num) 或其他函数
              } else {
                task10(num);
              }
            }, num);
          }
          function task10(num) {//回城
            //YFUI.writeToOut("<span style='color:#FFF;'>====周常任务结束====</span>");
            execTask("home", null, num);
          }
        task1(1);
      },


    //======个人=====================================================================================
      choujiang: function choujiang() {//抽奖
          var countProte = 0; // 统计神秘渔护的数量
          var countTalisman = 0; // 统计龙神试炼锦囊的数量
          var countLSDBag = 0; // 统计龙神试炼福袋的数量
          var youxiajiasu = 0; // 统计龙神试炼福袋的数量
          var jianzhenjiasu = 0; // 统计龙神试炼福袋的数量
          var countcj=100;
    UTIL.addSysListener("choujjuan", function (b, type, subtype, msg) {
      if ((type === "items" && subtype === "info" && UTIL.filterMsg(b.get("name")) === "抽奖券") ||
          (type === "notice" && subtype === "notify_fail" && msg.indexOf("你的背包里没有这个物品") === 0)) {
        var choujjuan = parseInt(b.get("amount")) || 0;
        YFUI.writeToOut("<span style='color:#FFFF55;'>当前抽奖卷数量: " + choujjuan + "</span>");
        if (!choujjuan) {
          UTIL.delSysListener("choujjuan");
          return;
        }
   YFUI.showInput({
          title: "抽奖",
          text: "请确保抽奖卷足够，默认为100=1000次抽奖",
          value: 100,
          onOk: function onOk(valcj) {
            countcj = 100;
            PLU.execActions("jh 1;go_choujiang 10");
          },
          onNo: function onNo() {
            UTIL.delSysListener("choujjuan");
          },
        });
      }
      else if ((countcj && type === "notice" && msg.indexOf("抽奖10次额外获得") !== -1)) {
          PLU.execActions("go_choujiang 10")
          countcj--;
      }
      else if (type === "notice" && ((msg.indexOf("剩余抽奖次数不够") !== -1) || msg.indexOf("抽奖次数已经用完") !== -1)) {
        UTIL.delSysListener("choujjuan");
        setTimeout(function () {
            UTIL.delSysListener("choujjuan");
            YFUI.writeToOut("<span style='color:yellow;'>=====完成抽奖=====</span>");
            YFUI.writeToOut("<span style='color:#ffffff;'>获得神秘渔护: " + countProte + "</span>");
            YFUI.writeToOut("<span style='color:#ffffff;'>获得龙神试炼锦囊: " + countTalisman + "</span>");
            YFUI.writeToOut("<span style='color:#ffffff;'>获得龙神试炼福袋: " + countLSDBag + "</span>");
            YFUI.writeToOut("<span style='color:#ffffff;'>获得游侠加速卡: " + youxiajiasu + "</span>");
            YFUI.writeToOut("<span style='color:#ffffff;'>获得剑阵加速卡: " + jianzhenjiasu + "</span>");
        }, 500);
      }
      // 监听抽奖获得物品的消息
        else if (type === "notice" && msg.indexOf("抽奖") !== -1) {
            var regexMyProte = /神秘[\s\S]*?渔[\s\S]*?护[\s\S]*?x(\d+)/;
            var regexTalisman = /龙[\s\S]*?神[\s\S]*?试炼[\s\S]*?锦囊[\s\S]*?x(\d+)/;
            var regexLSDBag = /龙[\s\S]*?神[\s\S]*?试炼[\s\S]*?福袋[\s\S]*?x(\d+)/;
            var regexYXka = /游侠[\s\S]*?加[\s\S]*?速[\s\S]*?卡[\s\S]*?x(\d+)/;
            var regexJZka = /剑阵[\s\S]*?加[\s\S]*?速[\s\S]*?卡[\s\S]*?x(\d+)/;

            if (regexMyProte.test(msg)) {
                var quantity = parseInt(regexMyProte.exec(msg)[1]) || 1;
                countProte += quantity;
            }
            if (regexTalisman.test(msg)) {
                var quantity = parseInt(regexTalisman.exec(msg)[1]) || 1;
                countTalisman += quantity;
            }
            if (regexLSDBag.test(msg)) {
                var quantity = parseInt(regexLSDBag.exec(msg)[1]) || 1;
                countLSDBag += quantity;
            }
            if (regexYXka.test(msg)) {
                var quantity = parseInt(regexYXka.exec(msg)[1]) || 1;
                youxiajiasu += quantity;
            }
            if (regexJZka.test(msg)) {
                var quantity = parseInt(regexJZka.exec(msg)[1]) || 1;
                jianzhenjiasu += quantity;
            }
      }
      else if (!countcj) {
        UTIL.delSysListener("choujjuan");
        setTimeout(function () {
            UTIL.delSysListener("choujjuan");
            YFUI.writeToOut("<span style='color:yellow;'>=====完成抽奖=====</span>");
            YFUI.writeToOut("<span style='color:#ffffff;'>获得神秘渔护: " + countProte + "</span>");
            YFUI.writeToOut("<span style='color:#ffffff;'>获得龙神试炼锦囊: " + countTalisman + "</span>");
            YFUI.writeToOut("<span style='color:#ffffff;'>获得龙神试炼福袋: " + countLSDBag + "</span>");
            YFUI.writeToOut("<span style='color:#ffffff;'>获得游侠加速卡: " + youxiajiasu + "</span>");
            YFUI.writeToOut("<span style='color:#ffffff;'>获得剑阵加速卡: " + jianzhenjiasu + "</span>");
          }, 500);

      }
    });
    setTimeout(function () {
      PLU.execActions("items get_store /obj/shop/choujiangquan;items info obj_choujiangquan;");
    }, 250);
  },

  givehuf: function givehuf() {
    //交虎符
    PLU.execActions("jh 1;e;#3 n;n;w;event_1_90287255 go go_lsyj;=200;items get_store /obj/quest/jinyuhufusuipian;event_1_56364978;event_1_51700868;=200;home;");
  },
    huanpf() { //换皮肤
      YFUI.showInput({
        title: "换皮肤",
        text: `请输入你要选的皮肤，<br>
              <span>1：极简之风<br>
              <span style="color:#578DC9;">2：碧海奇侠<br>
              <span style="color:#8F7D5C;">3：大漠飞鹰<br>
              `,
          value: "1", // 默认值为1
          onOk(val) {
              PLU.execActions(`skin_select ${val}`); // 使用输入的值换皮肤
          },
          onNo() { },
      });
    },
    zbjianshen() {  //剑神套
        PLU.execActions(
          "wear obj_wuyinglou-xianglian;wear obj_wuyinglou-shouzhuo;wear obj_wuyinglou-jiezhi;"
        );
        setTimeout(() => {
            YFUI.writeToOut("<span style='color:yellow;'> ==装备完毕!== </span>");
          }, 1500);
      },
    zbchuidiao() {  //垂钓套
        PLU.execActions(
          "wear obj_chuidiaozhe-xianglian;wear obj_chuidiaozhe-shouzhuo;wear obj_chuidiaozhe-jiezhi"
        );
        setTimeout(() => {
            YFUI.writeToOut("<span style='color:yellow;'> ==装备完毕!== </span>");
          }, 1500);
      },
    caomeibs() {  //草莓冰沙
        PLU.execActions(
          "items use obj_caomeibingsha"
        );
      },
    eatbuping() {  //吃补品
      PLU.execActions(
        "items use tianlongsi_nanguagu;items use tianlongsi_sanxiangmenmgzhuling;items use obj_molitang;items use obj_yuanxiao;items use obj_jiuhuayulouwan;items use obj_qiaoguoer;items use obj_lanlingmeijiu;items use obj_bingtanghulu;"
      );
    },
    Qubaos() {
      PLU.execActions(
        "items get_store /obj/baoshi/lvbaoshi2;" + //绿宝石裂开
        "items get_store /obj/baoshi/lvbaoshi3;" + //绿宝石
        "items get_store /obj/baoshi/lvbaoshi4;" + //绿宝石无暇
        "items get_store /obj/baoshi/lvbaoshi5;" + //绿宝石完美
        "items get_store /obj/baoshi/lvbaoshi6;" + //绿宝石君王
        "items get_store /obj/baoshi/lvbaoshi7;" + //绿宝石皇帝
        "items get_store /obj/baoshi/hongbaoshi2;" + //红宝石裂开
        "items get_store /obj/baoshi/hongbaoshi3;" + //红宝石
        "items get_store /obj/baoshi/hongbaoshi4;" + //红宝石无暇
        "items get_store /obj/baoshi/hongbaoshi5;" + //红宝石完美
        "items get_store /obj/baoshi/hongbaoshi6;" + //红宝石君王
        "items get_store /obj/baoshi/hongbaoshi7;" + //红宝石皇帝
        "items get_store /obj/baoshi/lanbaoshi2;" + //蓝宝石裂开
        "items get_store /obj/baoshi/lanbaoshi3;" + //蓝宝石
        "items get_store /obj/baoshi/lanbaoshi4;" + //蓝宝石无暇
        "items get_store /obj/baoshi/lanbaoshi5;" + //蓝宝石完美
        "items get_store /obj/baoshi/lanbaoshi6;" + //蓝宝石君王
        "items get_store /obj/baoshi/lanbaoshi7;" + //蓝宝石皇帝
        "items get_store /obj/baoshi/huangbaoshi2;" + //黄宝石裂开
        "items get_store /obj/baoshi/huangbaoshi3;" + //黄宝石
        "items get_store /obj/baoshi/huangbaoshi4;" + //黄宝石无暇
        "items get_store /obj/baoshi/huangbaoshi5;" + //黄宝石完美
        "items get_store /obj/baoshi/huangbaoshi6;" + //黄宝石君王
        "items get_store /obj/baoshi/huangbaoshi7;" + //黄宝石皇帝
        "items get_store /obj/baoshi/zishuijing2;" + //紫宝石裂开
        "items get_store /obj/baoshi/zishuijing3;" + //紫宝石
        "items get_store /obj/baoshi/zishuijing4;" + //紫宝石无暇
        "items get_store /obj/baoshi/zishuijing5;" + //紫宝石完美
        "items get_store /obj/baoshi/zishuijing6;" + //紫宝石君王
        "items get_store /obj/baoshi/zishuijing7;"  //紫宝石皇帝
      );
    },
    QuTianss() {
      PLU.execActions(
        "items get_store /obj/baoshi/lvbaoshi8;" + //绿宝石天神
        "items get_store /obj/baoshi/hongbaoshi8;" + //红宝石天神
        "items get_store /obj/baoshi/lanbaoshi8;" + //蓝宝石天神
        "items get_store /obj/baoshi/huangbaoshi8;" + //黄宝石天神
        "items get_store /obj/baoshi/zishuijing8;"  //紫宝石天神
      );
    },
    buyXueLian() {
      PLU.execActions(
        "jh 1;e;n;n;n;w;" +
        "#10 buy /map/snow/npc/obj/ice_lotus_N_10 from snow_herbalist;" + //购买100雪莲
        "home;"
      );
    },
    LLBao() {
      PLU.execActions(
        "jh 2;#7 n;lq_chunhui_lb;lq_fuai_lb;" +//礼包：春晖 父爱
        "jh 1;sd_2024_lb;sd_2024_ch;" + //礼包：元旦
        "home;"
      );
    },
    eatHuoG() {
      PLU.execActions(
        "items use obj_bingjilinghuoguo1;" //吃火锅
      );
    },
    QuLiCai() {
      PLU.execActions(
        "items get_store /obj/shop/jiuzhuanshendan;" +  //九转神丹
        "items get_store /obj/baoshi/huangbaoshi8;"  //黄宝石天神
      );
    },
    DianLiCai() {
      PLU.execActions(
        "event_1_62143505 go;" +  //超级投资
        "event_1_62143505 get;event_1_63750325 get;"  //领收益
      );
    },
    autoChuangLou(endcallback) {
      UTIL.addSysListener("sword", (b, type, subtype, msg) => {
        if (msg.includes("战斗结束") || msg.includes("戰鬥結束")) {
          // PLU.execActions("prev_combat;cangjian kill");//执行prev_combat和cangjian kill命令，挑战剑楼
        }
      });
      PLU.execActions("prev_combat"); // 执行prev_combat命令
    },
    asJirudw() {
      let defaultValue = "3070884(1)"; // 默认值
      YFUI.showInput({
          title: "队伍加入",
          text: "请输入你要加入谁队伍，比如：3070884(1)",
          value: defaultValue,
          onOk(val) {
              PLU.execActions(`team join u${val}`); // 加入队伍
              defaultValue = val;
          },
          onNo() { },
      });
    },
    asJirudwdm() {
       PLU.execActions(
          "team join u3070884(1);prev;" // 加入队伍
      );

    },
    asLikaidw() {
      PLU.execActions(
        "team quit"  //离开队伍
      );
    },
    asChongKdw() {
      PLU.execActions(
            "team create" //重开队伍
         );
    },
    eatSans() {//使用三生石
      PLU.execActions(
        "items get_store /obj/shop/sanshengshi;event_1_66830905;"
      );
    },
    Yandijd() {//炎帝祭典
      PLU.execActions(
        "jh 5;#6 n;w;event_1_69751810;event_1_43899943;event_1_43899943 go 5;home;"
      );
    },

    askTianmd() {//讨天命丹
      var countttmd = 0;
      PLU.execActions("rank go 236;nw;n;n;n;n;n;n;nw;nw;n;n;nw;nw;n;n;nw;ne;event_1_1996692;event_1_10567243", () => {
        UTIL.addSysListener("asktmd", function (b, type, subtype, msg) {
            if (type == "notice" && msg.startsWith("你得到天命丹x1")) {
                countttmd++;
                YFUI.writeToOut("<span style='color:yellow;'>=====获得天命丹：" + countttmd + " 次=====</span>");
                if (countttmd >= 10) {
                    UTIL.delSysListener("asktmd");
                    PLU.execActions("w;sw;s;s;ak;sw;sw;sw;;get tianlongsi_putiguo;se;se;se;ne;get tianlongsi_xiaoxianglu;ne;ne;;get tianlongsi_putiguo;nw;nw;ka;nw;home");
                }
            } else if (type == "main_msg" && msg.indexOf("柴绍") >= 0 ){
                    PLU.execActions(";ask tianlongsi_chaishao");
                }
        });
        PLU.execActions("ask tianlongsi_chaishao");
    });
  },
  //全杀了
  allkill(params) {
        let npcs = UTIL.getRoomAllNpc().filter(e => !(["金甲符兵", "玄阴符兵", "玄陰符兵"].indexOf(e.name) >= 0));
        //let npcs = UTIL.getRoomAllNpc().filter(e=>!(UTIL.filterMsg(e.name).match(/(金甲|玄阴)符兵/)))
        //let npcs = UTIL.getRoomAllNpc()
        if (npcs.length) {
          PLU.autoFight({
              targetKey: npcs[0].key,
              onEnd() {
                  setTimeout(() => {
                    PLU.allkill(params)
                  },500)
              }
          });
      }
       else {
           params.idx++;
           if (params.paths[params.idx] != "ka") {
        params.paths.splice(params.idx+1, 0, "ak")}
           else {
           params.idx++;
           }
           PLU.actions(params);
       }
    },
    //================================================================================================
    execActions(str, endcallback, params) {
      var acs = str.split(";");
      acs = acs
        .map((e) => {
          let np = e.match(/^#(\d+)\s(.*)/);
          if (np) {
            let r = [];
            for (let i = 0; i < np[1]; i++) r.push(np[2]);
            return r;
          }
          return e;
        })
        .flat();
      acs = acs.map((e) => {
        if (PLU.YFD.pathCmds[e]) return PLU.YFD.pathCmds[e] + "." + UTIL.rnd();
        return e;
      });
      PLU.actions({
        paths: acs,
        idx: 0,
        onPathsEnd() {
          PLU.STATUS.isBusy = false;
          endcallback && endcallback(true, params);
        },
        onPathsFail() {
          PLU.STATUS.isBusy = false;
          endcallback && endcallback(false, params);
        },
      });
    },
    //================================================================================================
    actions(params) {
      PLU.STATUS.isBusy = true;
      //params:{paths,idx,onPathsEnd,onPathsFail}
      if (params.idx >= params.paths.length) {
        return params.onPathsEnd && params.onPathsEnd();
      }
      let curAct = params.paths[params.idx];
      //null
      if (!curAct) {
        setTimeout(() => {
          params.idx++;
          PLU.actions(params);
        }, 250);
        return;
      }
      //等待复活
      if (curAct.indexOf("wait#") > -1 || curAct.indexOf("wait ") > -1) {
        let npc = curAct.substring(curAct.indexOf(" ") + curAct.indexOf("?") + 2);
        if (UTIL.getRoomAllNpc().some((e) => e.name == npc || e.key == npc)) {
          if (params.paths[params.idx].indexOf("wait ") > -1) params.idx++;
          else params.paths[params.idx] = params.paths[params.idx].substring(5);
          PLU.actions(params);
        } else
          UTIL.addSysListener("wait", (b, type, subtype, msg) => {
            if (UTIL.inHome()) {
              UTIL.delSysListener("wait");
              params.idx = params.paths.length;
              PLU.actions(params);
            }
            if (type != "jh") return;
            if (subtype == "info") {
              UTIL.delSysListener("wait");
              params.idx = params.paths.length;
              PLU.actions(params);
            }
            if (subtype != "new_npc") return;
            if (b.get("id") == npc || b.get("name") == npc) {
              UTIL.delSysListener("wait");
              if (curAct.indexOf("wait ") > -1) params.idx++;
              else params.paths[params.idx] = params.paths[params.idx].substring(5);
              PLU.actions(params);
            }
          });
        return;
      }
      //对话
      if (curAct.indexOf("ask#") > -1) {
        if (curAct.indexOf("?") > -1) {
          var npc = UTIL.findRoomNpc(curAct.substring(curAct.indexOf("?") + 1), 0, 1)?.key;
        } else {
          var npc = curAct.substring(curAct.indexOf(" ") + 1);
        }
        npc && clickButton("ask " + npc);
        params.paths[params.idx] = params.paths[params.idx].substring(4);
        PLU.actions(params);
        return;
      }
      //去比试
      if (curAct.indexOf("fight?") > -1 || curAct.indexOf("fight ") > -1) {
        let kt = parseInt(PLU.getCache("autoPerform")) < 1 ? "multi" : "";
        PLU.autoFight({
          targetName: curAct.indexOf("fight?") > -1 ? curAct.substring(6) : null,
          targetKey: curAct.indexOf("fight ") > -1 ? curAct.substring(6) : null,
          fightKind: "fight",
          autoSkill: kt,
          onFail() {
            setTimeout(() => {
              params.idx++;
              PLU.actions(params);
            }, 500);
          },
          onEnd() {
            setTimeout(() => {
              params.idx++;
              PLU.actions(params);
            }, 500);
          },
        });
        return;
      }
      //去杀
      if (curAct.indexOf("kill?") > -1 || curAct.indexOf("kill ") > -1) {
        let kt = parseInt(PLU.getCache("autoPerform")) < 1 ? "multi" : "";
        PLU.autoFight({
          targetName: curAct.indexOf("kill?") > -1 ? curAct.substring(5) : null,
          targetKey: curAct.indexOf("kill ") > -1 ? curAct.substring(5) : null,
          autoSkill: kt,
          onFail() {
            setTimeout(() => {
              params.idx++;
              PLU.actions(params);
            }, 500);
          },
          onEnd() {
            setTimeout(() => {
              params.idx++;
              PLU.actions(params);
            }, 500);
          },
        });
        return;
      }
      // 去摸尸体
      if (curAct.indexOf("get?") > -1) {
        UTIL.getItemFrom(curAct.substring(4));
        setTimeout(() => {
          params.idx++;
          PLU.actions(params);
        }, 500);
        return;
      }
      // 去摸尸体
      if (curAct.indexOf("@") > -1) {
        UTIL.getItemFrom(curAct.substring(1));
        setTimeout(() => {
          params.idx++;
          PLU.actions(params);
        }, 500);
        return;
      }
      // 叫船
      if (curAct.indexOf("yell") > -1) {
        let yellBoatTimeout = setTimeout((e) => {
          clearTimeout(yellBoatTimeout);
          UTIL.delSysListener("goYellBoat");
          params.idx++;
          PLU.actions(params);
        }, 120000);
        UTIL.addSysListener("goYellBoat", function (b, type, subtype, msg) {
          if (type == "main_msg" && msg.indexOf("还没有达到这") > -1) {
            setTimeout(() => {
              clearTimeout(yellBoatTimeout);
              UTIL.delSysListener("goYellBoat");
              PLU.actions(params);
            }, 2000);
            return;
          }
          if (type == "notice" && msg.indexOf("这儿没有船可以喊") > -1) {
            setTimeout(() => {
              clearTimeout(yellBoatTimeout);
              UTIL.delSysListener("goYellBoat");
              params.idx++;
              PLU.actions(params);
            }, 500);
            return;
          }
          if (type != "jh" || subtype != "info") return;
          for (var key of b.keys()) {
            var val = b.get(key);
            if (val.indexOf("yell") < 0) continue;
            clearTimeout(yellBoatTimeout);
            UTIL.delSysListener("goYellBoat");
            params.idx++;
            PLU.actions(params);
            break;
          }
        });
        clickButton(curAct);
        return;
      }
      //函式
      if (curAct.indexOf("eval_") > -1) {
        eval(curAct.substring(5));
        setTimeout(() => {
          params.idx++;
          PLU.actions(params);
        }, 500);
        return;
      }
      //检查地点重走
      if (curAct.indexOf("place?") > -1) {
        var pName = curAct.split(/[?:]/)[1];
        var curName = UTIL.filterMsg(g_obj_map.get("msg_room").get("short") || "");
        var backStep = curAct.split(/[?:]/)[2];
        // 未到达指定地，重新走
        if (pName != curName) {
          if (backStep) {
            //退后几步
            params.idx -= Number(backStep);
            PLU.actions(params);
            return;
          }
          params.idx = 0;
          PLU.actions(params);
          return;
        }
        // 已到达指定地点，继续下一个
        params.idx++;
        PLU.actions(params);
        return;
      }
      //迷宫
      if (curAct.match(/^(.+):(.+\^.+)$/)) {
        let cmd = curAct.match(/^(.+):(.+\^.+)$/);
        PLU.execActions(PLU.YFD.mapsLib.Labyrinth[cmd[1]][cmd[2]], () => {
          params.idx++;
          PLU.actions(params);
        });
        return;
      }
      //称号飞修正
      if (curAct.indexOf("rank go") > -1) {
        let m = curAct.match(/rank go (\d+)/);
        if (m && m[1]) {
          curAct = "rank go " + (Number(m[1]) + 1);
        }
      }
      //look,ask,
      if (curAct.match(/look|ask|get|buy|home|prev|moke|sort|share|sign|sleep|exercise|clan|work|chushi |vip |event_|lq_|wear |wield |remove |unwield/)) {
        if (curAct == "ask?lama_master") {
          UTIL.addSysListener("lama", (b, type, subtype, msg) => {
            if (type == "main_msg")
              if (msg.indexOf("葛伦师傅在幻境之中") == -1) clickButton("ask lama_master");
              else {
                params.idx++;
                PLU.actions(params);
                UTIL.delSysListener("lama");
              }
          });
          clickButton("ask lama_master");
        } else {
          clickButton(curAct);
          setTimeout(() => {
            params.idx++;
            PLU.actions(params);
          }, 300);
        }
        return;
      }
      // 全杀了
      if (curAct.indexOf("ak") > -1) {
          PLU.allkill(params)
          return;
            }
      if (curAct == "飞雪连天射白鹿，笑书神侠倚碧鸳。") {
        if (PLU.developerMode) {
          PLU.setCache("developer", 0);
          YFUI.writeToOut("<span style='color:white;'>==已关闭开发者模式部分功能，刷新后关闭开发者模式全部功能==</span>");
          setTimeout(() => location.reload(), 300);
        } else {
          YFUI.showPop({
            title: "！！！警告！！！",
            text:
              "你将开启本脚本开发者模式<br>" +
              "开发者模式功能清单：<br>" +
              "浏览器控制台（F12）输出按键指令、变量g_obj_map的实时变化<br>" +
              "闲聊允许向非脚本玩家打印屏蔽词（屏蔽词不会转为“*”，单字、特殊字符除外）<br>" +
              "可在非首页、非师傅所在地拜入门派，包括未开图的隐藏门派（掌握空间法则（误））<br>" +
              "显示全自动暴击开关（掌握时间法则（延长寿命（<br>" +
              "<b>专属功能可能会使你触摸到轮回法则（夏格艾迪剑），是否继续？</b>",
            okText: "继续",
            onOk() {
              PLU.setCache("developer", 1);
              location.reload();
            },
            onNo() {
              params.idx++;
              PLU.actions(params);
            },
          });
        }
        return;
      }
      //行动
      PLU.go({
        action: curAct,
        onEnd() {
          if (params.idx + 1 >= params.paths.length) {
            return params.onPathsEnd && params.onPathsEnd();
          }
          params.idx++;
          PLU.actions(params);
        },
        onFail(flag) {
          if (flag && PLU.STATUS.inBattle) {
            PLU.autoEscape({
              onEnd() {
                setTimeout(() => {
                  PLU.actions(params);
                }, 1000);
              },
            });
            return;
          } else if (flag) {
            if (PLU.STO.REGO) {
              clearTimeout(PLU.STO.REGO);
              PLU.STO.REGO = null;
            }
            PLU.STO.REGO = setTimeout(() => {
              params.idx++;
              PLU.actions(params);
            }, 1000);
          } else {
            params.onPathsFail && params.onPathsFail();
          }
        },
      });
    },
    //================================================================================================
    go({ action, onEnd, onFail }) {
      if (!action) return onEnd && onEnd(false);
      let clearGoTimeout = function (timeoutKey) {
        clearTimeout(timeoutKey);
        timeoutKey = null;
        UTIL.delSysListener("goMove");
      };
      let goTimeout = setTimeout(function () {
        clearGoTimeout(goTimeout);
        onEnd && onEnd(false);
      }, 2000);
      UTIL.addSysListener("goMove", function (b, type, subtype, msg) {
        if (type == "notice" && subtype == "notify_fail") {
          if (msg.indexOf("你正忙着呢") > -1) {
            clearGoTimeout(goTimeout);
            return onFail && onFail(true);
          }
          if (
            msg.indexOf("无法走动") > -1 ||
            msg.indexOf("没有这个方向") > -1 ||
            msg.indexOf("只有VIP才可以直接去往此地") > -1 ||
            msg.indexOf("你什么都没发觉") > -1 ||
            msg.indexOf("就此钻入恐有辱墓主") > -1 ||
            msg.indexOf("你虽知这松林内有乾坤，但并没发现任何线索") > -1 ||
            msg.indexOf("此地图还未解锁，请先通关前面的地图。") > -1
          ) {
            clearGoTimeout(goTimeout);
            return onFail && onFail(false, msg);
          }
        }
        if (type == "unknow_command" || (type == "jh" && subtype == "info")) {
          clearGoTimeout(goTimeout);
          setTimeout(function () {
            onEnd && onEnd(true);
          }, 200);
          return;
        }
      });
      clickButton(action);
    },
    //================================================================================================
    fastExec(str, endcallback) {
      var acs = str.split(";");
      acs = acs
        .map((e) => {
          let np = e.match(/^#(\d+)\s(.*)/);
          if (np) {
            let r = [];
            for (let i = 0; i < np[1]; i++) r.push(np[2]);
            return r;
          }
          return e;
        })
        .flat();
      acs = acs.map((e) => {
        if (PLU.YFD.pathCmds[e]) return PLU.YFD.pathCmds[e] + "." + UTIL.rnd();
        return e;
      });
      let fastFunc = (acts, idx) => {
        if (idx >= acts.length) {
          setTimeout(() => {
            endcallback && endcallback(true);
          }, 1000);
          return;
        }
        let curAct = acts[idx];
        if (!curAct) return fastFunc(acts, idx + 1);
        clickButton(curAct);
        setTimeout(() => {
          fastFunc(acts, idx + 1);
        }, 200);
        return;
      };
      fastFunc(acs, 0);
    },
    //================================================================================================
    selectSkills(skillName) {
      if (!PLU.battleData || !PLU.battleData.skills) return null;
      let keys = Object.keys(PLU.battleData.skills);
      if (skillName) {
        for (let i = 0; i < keys.length; i++) {
          let sk = PLU.battleData.skills[keys[i]];
          if (sk && sk.name && sk.name.match(skillName)) return sk;
        }
      } else {
        let n = Math.floor(keys.length * Math.random());
        return PLU.battleData.skills[keys[n]];
      }
      return null;
    },
    //================================================================================================
    autoFight(params) {
      if (PLU.STO.autoF) {
        clearTimeout(PLU.STO.autoF);
        PLU.STO.autoF = null;
      }
      if (!params.targetKey && !params.targetName) {
        params.onFail && params.onFail(0);
        YFUI.writeToOut("<span style='color:#FFF;'>--战斗参数缺失--</span>");
        return;
      }
      if (params.targetName && !params.targetKey) {
        let npcObj = UTIL.findRoomNpc(params.targetName, false, true);
        if (npcObj) {
          params.targetKey = npcObj.key;
        } else {
          params.onFail && params.onFail(1);
          YFUI.writeToOut("<span style='color:#FFF;'>--找不到NPC--</span>");
          return;
        }
      }
      let fightAct = params.fightKind ?? "kill";
      let performTime = 0;
      UTIL.addSysListener("onAutoFight", function (b, type, subtype, msg) {
        if (type == "vs" && subtype == "vs_info") {
          setTimeout(() => {
            if (params.autoSkill && PLU.battleData) PLU.battleData.autoSkill = params.autoSkill;
          }, 100);
          if (PLU.TMP.loopCheckFight) {
            clearInterval(PLU.TMP.loopCheckFight);
            PLU.TMP.loopCheckFight = null;
          }
          PLU.TMP.loopCheckFight = setInterval(() => {
            if (!g_gmain.is_fighting) {
              UTIL.delSysListener("onAutoFight");
              if (PLU.STO.autoF) {
                clearTimeout(PLU.STO.autoF);
                PLU.STO.autoF = null;
              }
              if (PLU.TMP.loopCheckFight) {
                clearInterval(PLU.TMP.loopCheckFight);
                PLU.TMP.loopCheckFight = null;
              }
              params.onEnd && params.onEnd();
            }
          }, 2000);
          params.onStart && params.onStart();
        } else if (type == "vs" && (subtype == "add_xdz" || subtype == "text" || subtype == "attack")) {
          let curTime = new Date().getTime();
          if (curTime - performTime < 500) return;
          performTime = curTime;
          let useSkill = null;
          if (params.autoSkill) {
            if (!PLU.battleData || PLU.battleData.xdz < 2) return;
            if (params.autoSkill == "item") {
              if (PLU.battleData.xdz >= 6) useSkill = { key: "playskill 7" };
              else useSkill = {};
            } else if (params.autoSkill == "dodge") {
              if (PLU.battleData.xdz > 9) useSkill = PLU.selectSkills(/乾坤大挪移|凌波微步|无影毒阵|九妙飞天术/);
            } else if (params.autoSkill == "multi") {
              if (PLU.battleData.xdz > 2) useSkill = PLU.selectSkills(/破军棍法|千影百伤棍|八荒功|月夜鬼萧|打狗棒法/);
            } else if (params.autoSkill == "fast") {
              if (PLU.battleData.xdz >= 2) useSkill = PLU.selectSkills(/吸星大法|斗转星移|无影毒阵|空明拳|乾坤大挪移/);
            }
            if (!useSkill) {
              if (PLU.getCache("autoPerform") >= 1) {
                PLU.battleData.autoSkill = "";
                return;
              }
              if (params.autoSkill) PLU.battleData.autoSkill = "";
              useSkill = PLU.selectSkills();
            }
            if (params.onFighting) {
              let block = params.onFighting(useSkill);
              if (block) return;
            }
            useSkill && clickButton(useSkill.key, 0);
          } else {
            params.onFighting && params.onFighting();
          }
        } else if (type == "vs" && subtype == "combat_result") {
          performTime = 0;
          UTIL.delSysListener("onAutoFight");
          if (PLU.STO.autoF) {
            clearTimeout(PLU.STO.autoF);
            PLU.STO.autoF = null;
          }
          if (PLU.TMP.loopCheckFight) {
            clearInterval(PLU.TMP.loopCheckFight);
            PLU.TMP.loopCheckFight = null;
          }
          clickButton("prev_combat");
          params.onEnd && params.onEnd();
        } else if (type == "notice" && subtype == "notify_fail") {
          let errCode = 0;
          if (msg.indexOf("没有这个人") > -1) {
            errCode = 1;
          } else if (msg.indexOf("你正忙着呢") > -1) {
            errCode = 2;
          } else if (msg.indexOf("已经超量") > -1) {
            errCode = 3;
          } else if (msg.indexOf("已达到上限") > -1) {
            errCode = 4;
          } else if (msg.indexOf("太多人了") > -1) {
            errCode = 5;
          } else if (msg.indexOf("不能战斗") > -1) {
            errCode = 6;
          } else if (msg.indexOf("秒后才能攻击这个人") > -1) {
            let sat = msg.match(/(\d+)秒后才能攻击这个人/);
            if (sat) errCode = "delay_" + sat[1];
            else errCode = 77;
          } else if (msg.indexOf("先观察一下") > -1) {
            errCode = 88;
          } else {
            if (!PLU.STATUS.inBattle) {
              errCode = 99;
            }
          }
         if (errCode) UTIL.delSysListener("onAutoFight");
          if (PLU.STO.autoF) {
            clearTimeout(PLU.STO.autoF);
            PLU.STO.autoF = null;
          }
          if (PLU.TMP.loopCheckFight) {
            clearInterval(PLU.TMP.loopCheckFight);
            PLU.TMP.loopCheckFight = null;
          }
          params.onFail && params.onFail(errCode);
        }
      });
      PLU.STO.autoF = setTimeout(() => {
        PLU.STO.autoF = null;
        if (!g_gmain.is_fighting) {
          UTIL.delSysListener("onAutoFight");
          if (PLU.TMP.loopCheckFight) {
            clearInterval(PLU.TMP.loopCheckFight);
            PLU.TMP.loopCheckFight = null;
          }
          return params.onFail && params.onFail(100);
        }
      }, 300000);
      clickButton(fightAct + " " + params.targetKey, 0);
    },
    //================================================================================================
 /*   autoEscape(params) {
      if (!PLU.STATUS.inBattle) return params.onEnd && params.onEnd();
      let lastEscapeTime = new Date().getTime();
      UTIL.addSysListener("onAutoEscape", function (b, type, subtype, msg) {
        if (type == "vs" && subtype == "combat_result") {
          UTIL.delSysListener("onAutoEscape");
          clickButton("prev_combat");
          return params.onEnd && params.onEnd();
        } else if (type == "vs" && (subtype == "add_xdz" || subtype == "text" || subtype == "attack")) {
          let nt = new Date().getTime();
          if (nt - lastEscapeTime > 500) {
            lastEscapeTime = nt;
            clickButton("escape");
          }
        }
      });
    },*/
    //================================================================================================
    setBtnRed($btn, flag, sColr) {
      if (!PLU.ONOFF[$btn[0].id + "_color"]) {
        PLU.ONOFF[$btn[0].id + "_color"] = $btn.css("background-color");
        let carr = PLU.ONOFF[$btn[0].id + "_color"].split(/[\D\s]+/);
        carr.pop();
        carr.shift();
        if (carr[0] == carr[1] && carr[1] == carr[2]) {
          carr[1] = carr[1] - 32;
          carr[2] = carr[2] - 32;
        }
        let m = carr.reduce((a, b) => (Number(a) + Number(b)) / 2);
        let narr = carr.map((e) => {
          return Math.min(e - 96 + 4 * (e - m), 256);
        });
        PLU.ONOFF[$btn[0].id + "_colorDark"] = "rgb(" + narr.join(",") + ")";
      }
      if (flag == undefined) {
        if (PLU.ONOFF[$btn[0].id]) {
          PLU.ONOFF[$btn[0].id] = 0;
          $btn.css({
            background: PLU.ONOFF[$btn[0].id + "_color"],
            color: "#000",
          });
          return 0;
        } else {
          PLU.ONOFF[$btn[0].id] = 1;
          $btn.css({
            background: PLU.ONOFF[$btn[0].id + "_colorDark"],
            color: "#FFF",
          });
          return 1;
        }
      } else {
        PLU.ONOFF[$btn[0].id] = flag;
        let colr = sColr || PLU.ONOFF[$btn[0].id + "_color"],
          fcolr = "#000";
        if (flag) {
          colr = sColr || PLU.ONOFF[$btn[0].id + "_colorDark"];
          fcolr = "#FFF";
        }
        $btn.css({ background: colr, color: fcolr });
        return flag;
      }
    },
    getBtnRed($btn) {
      if (PLU.ONOFF[$btn[0].id]) return 1;
      return 0;
    },
    //================================================================================================
    toAutoChuaiMo($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        PLU.STATUS.isBusy = false;
        PLU.TMP.CMSkill = null;
        return;
      }
      YFUI.showPop({
        title: "自动揣摩技能",
        text: "一键自动揣摩所有能揣摩的技能！(除了六阴追魂剑法)",
        onOk() {
          PLU.autoChuaiMo();
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    //================================================================================================
    toAutoLianXi($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        PLU.STATUS.isBusy = false;
        PLU.TMP.CMSkill = null;
        return;
      }
      YFUI.showPop({
        title: "自动练习技能",
        text: "开启自动练习技能！(除了六阴剑、九阴爪、九阴刀)",
        onOk() {
          PLU.autoLianXi();
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    //================================================================================================
    toAutoGetKey($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        return UTIL.delSysListener("listenGetKey");
      }
      clickButton("get yin yaoshi");
      UTIL.addSysListener("listenGetKey", function (b, type, subtype, msg) {
        if (g_obj_map.get("msg_room") && g_obj_map.get("msg_room").get("short").match(/匾后/)) {
          if (type == "jh") {
            if (subtype == "new_item") {
              if (b.get("id") == "yin yaoshi") clickButton("get yin yaoshi");
            } else if (subtype == "info") {
              clickButton("get yin yaoshi");
            }
          }
        }
      });
    },
    //================================================================================================
    toAutoMoke($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        PLU.STATUS.isBusy = false;
        return;
      }
      PLU.getAllItems((list) => {
        let daoItems = list.find((it) => !!it.name.match("玄铁刻刀"));
        let daoNum = daoItems?.num || 0;
        let eqItems = list.filter((it) => !!(it.key.match(/(equip|weapon)_\S+8/) && !it.key.match("_moke_") && !it.key.match("_xinwu") && !it.key.match("_barcer")));
        let myNum = 0;
        eqItems &&
          eqItems.forEach((eq) => {
            myNum += eq.num;
          });
        console.log(eqItems);
        YFUI.showPop({
          title: "自动摹刻所有明月",
          text:
            "一键自动摹刻所有明月装备！<br><span style='color:#F00;font-weight:bold;'>注意准备足够的刻刀!!!</span><br>当前玄铁刻刀数量 <span style='color:#F00;'>" +
            daoNum +
            "</span><br>当前未摹刻明月装备数量 <span style='color:#F00;'>" +
            myNum +
            "</span>",
          onOk() {
            PLU.autoMoke(eqItems);
          },
          onNo() {
            PLU.setBtnRed($btn, 0);
          },
        });
      });
    },
    autoMoke(eqList) {
      if (!PLU.ONOFF["btn_bt_autoMoke"]) return YFUI.writeToOut("<span style='color:#F0F;'> ==摹刻暂停!== </span>");
      if (eqList && eqList.length > 0) {
        let eq = eqList.pop(),
          mokeCmds = "";
        mokeCmds;
        for (var i = 0; i < eq.num; i++) {
          mokeCmds += "moke " + eq.key + ";";
        }
        PLU.execActions(mokeCmds, () => PLU.autoMoke(eqList));
      } else {
        PLU.setBtnRed($("#btn_bt_autoMoke"), 0);
        YFUI.writeToOut("<span style='color:yellow;'> ==摹刻完毕!== </span>");
      }
    },
    //================================================================================================
    toAutoKillZYY($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        return UTIL.delSysListener("listenLoopKillZYY");
      }
      YFUI.showPop({
        title: "自动去刷祝玉妍",
        text: "自动去刷祝玉妍！<br><span style='color:#FFF;background:#F00;font-weight:bold;'>----- 注意: -----</span><br><span style='color:#F00;font-weight:bold;'>1、准备足够的邪帝舍利!!!<br>2、不要有队伍!!!<br>3、切记要打开自动技能阵!!!<br>4、要上足够的保险卡!!!</span>",
        onOk() {
          PLU.execActions("rank go 232;s;s;;;", () => {
            PLU.loopKillZYY();
          });
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
          UTIL.delSysListener("listenLoopKillZYY");
        },
      });
    },
    loopKillZYY() {
      UTIL.addSysListener("listenLoopKillZYY", function (b, type, subtype, msg) {
        if (type == "vs" && subtype == "combat_result") {
          if (!PLU.ONOFF["btn_bt_autoKillZYY"]) {
            PLU.execActions(";;;n;", () => {
              YFUI.writeToOut("<span style='color:yellow;'>=====刷祝玉妍结束!!=====</span>");
              UTIL.delSysListener("listenLoopKillZYY");
            });
          } else {
            PLU.execActions(";;;n;s");
          }
        }
      });
      clickButton("s");
    },
    //================================================================================================
    toAutoFB11($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        return UTIL.delSysListener("listenFB11");
      }
      YFUI.showPop({
        title: "自动副本11",
        text: `自动打副本11！<br>
                    <span style='color:#F00;font-weight:bold;'>----- 选择要打的门 -----</span><br>
                    <div style="font-size:12px;line-height:2;box">
                    <label style="display:inline-block;width: 31%;text-align:center;border:1px solid #333;">8 懒惰<input type="checkbox" name="chkfb11" value="nw" checked/></label>
                    <label style="display:inline-block;width: 31%;text-align:center;border:1px solid #333;">1非时食<input type="checkbox" name="chkfb11" value="n" checked/></label>
                    <label style="display:inline-block;width: 31%;text-align:center;border:1px solid #333;">2 杀生<input type="checkbox" name="chkfb11" value="ne" checked/></label>
                    <br>
                    <label style="display:inline-block;width: 31%;text-align:center;border:1px solid #333;">7 奢华<input type="checkbox" name="chkfb11" value="w" checked/></label>
                    <span style="display:inline-block;width: 31%;color:#999;text-align:center;border:1px solid transparent;">初心之地</span>
                    <label style="display:inline-block;width: 31%;text-align:center;border:1px solid #333;">3 偷盗<input type="checkbox" name="chkfb11" value="e" checked/></label>
                    <br>
                    <label style="display:inline-block;width: 31%;text-align:center;border:1px solid #333;">6 饮酒<input type="checkbox" name="chkfb11" value="sw" checked/></label>
                    <label style="display:inline-block;width: 31%;text-align:center;border:1px solid #333;">5 妄语<input type="checkbox" name="chkfb11" value="s" checked/></label>
                    <label style="display:inline-block;width: 31%;text-align:center;border:1px solid #333;">4 淫邪<input type="checkbox" name="chkfb11" value="se" checked/></label><br>
                    </div>
                    <span style='color:#F00;font-weight:bold;'>1、在副本外开始脚本<br>2、记得要组队<br></span>`,
        okText: "开始",
        onOk() {
          let chks = $('input[name="chkfb11"]:checked');
          let selects = [];
          $.each(chks, (i, e) => {
            selects.push(e.value);
          });
          if (selects.length == 0) return false;
          console.log(selects);
          //PLU.TMP.chkTmpList=[]
          //PLU.execActions('rank go 232;s;s;;;', ()=>{
          PLU.autoToFB11(selects);
          //})
          //UTIL.findRoomNpcReg
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
          UTIL.delSysListener("listenFB11");
        },
      });
    },
    autoToFB11() { },
    killAllNpc(callback) {
      let npcObj = UTIL.findRoomNpcReg("");
      if (npcObj) {
        let needAutoSkill = PLU.getCache("autoPerform") >= 1 ? null : "multi";
        PLU.autoFight({
          targetKey: npcObj.key,
          fightKind: "kill",
          autoSkill: needAutoSkill,
          onFail() {
            setTimeout((t) => {
              PLU.killAllNpc(callback);
            }, 1000);
          },
          onEnd() {
            setTimeout((t) => {
              PLU.killAllNpc(callback);
            }, 500);
          },
        });
      } else {
        callback && callback();
      }
    },
    killyoumhy(endCallback) {
      var flag = false;
      PLU.execActions("jh 45;ne;ne;n;n;ne;ne;e;ne;#5 n;ne;ne;#3 n;nw;nw;n;#5 e;event_1_77775145 ymsz_houyuan;", (f) => {
        if (!f) return endCallback && endCallback(1);
        PLU.execActions("se;ak;;se;;s;;w;;e;e;;w;s;;s;;s;;w;;e;e;;s;;n;e;;e;;n;;s;e;;e;;n;attrs;;attrs;;attrs;;attrs;;attrs;;attrs;;ka;;", (f2) => {
          if (!f2) return endCallback && endCallback(2);
          PLU.execActions("home;");
        });
      });
    },
    killFB11(endCallback) {
      var flag = false;
      PLU.execActions("fb 11;", (f) => {
        if (!f) return endCallback && endCallback(1);
        PLU.execActions("nw;ak;;se;n;;;s;ne;;;sw;e;;;w;se;;;nw;s;;;n;sw;;;ne;w;;;w;;;e;e;nw;nw;;;se;se;n;n;;;s;s;ne;ne;;;sw;sw;e;e;;;w;w;se;se;;;nw;nw;s;s;;;n;n;sw;sw;;ka;", (f2) => {
          if (!f2) return endCallback && endCallback(2);
          setTimeout(() => {
            PLU.execActions("event_1_68529291;");
          }, 2000);
        });
      });
    },

    killFB10(endCallback) {
      var flag = false;
      PLU.execActions("fb 10;", (f) => {
        if (!f) return endCallback && endCallback(1);
        PLU.execActions("event_1_31980331;ak;;fb 10;event_1_23348240;;;fb 10;event_1_84015482;;;fb 10;event_1_25800358;;;event_1_24864938;;;fb 10;event_1_31980331;event_1_98378977;;;event_1_5376728;;event_1_43541317;;ka;event_1_5914414;", (f2) => {
          if (!f2) return endCallback && endCallback(2);
          PLU.execActions("home;");
        });
      });
    },

    //================================================================================================
    checkYouxia($btn) {
      YFUI.showPop({
        title: "检查入室游侠技能",
        text: `选择需要的对应技能:<br>
                <div style="font-size:15px;">
                    <label style="display:inline-block;">内功:<input type="checkbox" name="chkskiyx" value="内功" checked/></label>&nbsp;
                    <label style="display:inline-block;">轻功:<input type="checkbox" name="chkskiyx" value="轻功" checked/></label>&nbsp;
                    <label style="display:inline-block;">剑法:<input type="checkbox" name="chkskiyx" value="剑法" checked/></label>&nbsp;
                    <label style="display:inline-block;">掌法:<input type="checkbox" name="chkskiyx" value="掌法" checked/></label>&nbsp;
                    <label style="display:inline-block;">刀法:<input type="checkbox" name="chkskiyx" value="刀法" checked/></label>&nbsp;
                    <label style="display:inline-block;">暗器:<input type="checkbox" name="chkskiyx" value="暗器"/></label>&nbsp;
                    <label style="display:inline-block;">鞭法:<input type="checkbox" name="chkskiyx" value="鞭法"/></label>&nbsp;
                    <label style="display:inline-block;">枪法:<input type="checkbox" name="chkskiyx" value="枪法"/></label>&nbsp;
                    <label style="display:inline-block;">锤法:<input type="checkbox" name="chkskiyx" value="锤法"/></label>&nbsp;
                    <label style="display:inline-block;">斧法:<input type="checkbox" name="chkskiyx" value="斧法"/></label>
                </div>`,
        onOk() {
          let chks = $('input[name="chkskiyx"]:checked');
          let selects = [];
          PLU.TMP.chkTmpList = [];
          $.each(chks, (i, e) => {
            selects.push(e.value);
          });
          PLU.getSkillsList((allSkills, tupoSkills) => {
            PLU.getYouxiaList((yxs) => {
              PLU.checkMySkills(allSkills, yxs, selects);
            });
          });
        },
        onNo() { },
      });
    },
    checkMySkills(mySkills, myYouxia, checkList) {
      // console.log(mySkills, myYouxia, checkList)
      let clstr = "";
      checkList.forEach((c) => (clstr += "【" + c[0] + "】"));
      YFUI.writeToOut("<span style='color:#FFF;'>--技能检测 <span style='color:yellow;'>" + clstr + "</span>--</span>");
      checkList.forEach((cn) => {
        let carr = PLU.YFD.youxiaSkillMap.filter((r) => r.type == cn);
        carr.forEach((n) => {
          PLU.checkPreSKill(n, mySkills, myYouxia);
        });
      });
      if (PLU.TMP.chkTmpList.length == 0) {
        YFUI.writeToOut("<span style='color:yellow;'>检查的技能都准备好了!</span>");
      }
    },
    checkPreSKill(node, mySkills, myYouxia) {
      let ms = mySkills.find((s) => s.name == node.skill);
      if (!ms && !PLU.TMP.chkTmpList.includes(node.skill)) {
        PLU.TMP.chkTmpList.push(node.skill);
        let clr = node.kind == "宗师" || node.kind == "侠客" ? "#E93" : "#36E";
        let htm = '<span style="color:' + clr + ';">【' + node.type[0] + "】" + node.skill + " ";
        //htm+= ms?'<span style="color:#3F3;display:inline-block;">('+ms.level+')</span>':'(缺)';
        htm += '<span style="color:#F00;display:inline-block;">(未学)</span>';
        let myx = myYouxia.find((y) => y.name.match(node.name));
        htm +=
          " - " +
          (myx
            ? '<span style="color:#3F3;display:inline-block;">' + myx.name + "[" + myx.level + "]</span>"
            : '<span style="color:#F36;display:inline-block;">需要：<span style="color:#FFF;background:' +
            clr +
            ';"> ' +
            node.kind +
            "-" +
            node.name +
            " </span></span>");
        htm += "</span>";
        YFUI.writeToOut(htm);
      }
      if (node.pre) {
        node.pre.forEach((n) => {
          PLU.checkPreSKill(n, mySkills, myYouxia);
        });
      }
    },
    getYouxiaList(callback) {
      UTIL.addSysListener("getYouxiaList", function (b, type, subtype, msg) {
        if (type != "fudi" && subtype != "juxian") return;
        UTIL.delSysListener("getYouxiaList");
        clickButton("prev");
        let youxias = [];
        for (var i = 0; i < 41; i++) {
          let str = b.get("yx" + i);
          if (str) {
            let attr = str.split(",");
            let ns = UTIL.filterMsg(attr[1]).split("】");
            let nam = ns.length > 1 ? ns[1] : ns[0];
            youxias.push({
              key: attr[0],
              name: nam,
              level: Number(attr[4]),
              kind: attr[3],
            });
          }
        }
        callback(youxias);
      });
      clickButton("fudi juxian");
    },
    //================================================================================================
    toAutoLearn($btn) {
      if (!PLU.TMP.MASTER_SKILLS) {
        return YFUI.showPop({
          title: "缺少数据",
          text: "需要打开师傅技能界面",
          // onOk(){
          // },
        });
      }
      // console.log(PLU.TMP.MASTER_ID, PLU.TMP.MASTER_SKILLS)
      let needSkills = [];
      PLU.getSkillsList((allSkills, tupoSkills) => {
        PLU.TMP.MASTER_SKILLS.forEach((ms) => {
          let sk = allSkills.find((s) => s.key == ms.key) || { level: 0 };
          if (sk.level < ms.level) {
            needSkills.push({
              key: ms.key,
              name: ms.name,
              lvl: ms.level - sk.level,
              cmd: "learn " + ms.key + " from " + PLU.TMP.MASTER_ID + " to 10",
            });
          }
        });
        //console.log(needSkills.map(e=>e.name))
        loopLearn(needSkills);
      });
      let curSkill = null;
      UTIL.addSysListener("loopLearnSkill", function (b, type, subtype, msg) {
        if (type == "notice" && msg.indexOf("不愿意教你") >= 0) {
          //UTIL.delSysListener("loopLearnSkill");
          if (curSkill) curSkill.lvl = -1;
        }
        return;
      });
      let loopLearn = function (list) {
        if (list.length > 0) {
          if (list[0].lvl > 0) {
            list[0].lvl -= 10;
            curSkill = list[0];
            clickButton(list[0].cmd);
          } else {
            list.shift();
          }
          setTimeout(() => {
            loopLearn(list);
          }, 200);
        } else {
          UTIL.delSysListener("loopLearnSkill");
          YFUI.writeToOut("<span style='color:#FFF;'>----自动学习结束,记得检查噢!----</span>");
        }
      };
    },
    //================================================================================================
    autoChuaiMo() {
      if (!PLU.ONOFF["btn_bt_autoChuaiMo"]) return;
      PLU.STATUS.isBusy = true;
      if (!PLU.TMP.CMSkill) {
        PLU.getSkillsList((allSkills, tupoSkills) => {
          if (!PLU.TMP.CANTCMS) PLU.TMP.CANTCMS = [];
          PLU.TMP.CMSkill = allSkills.find(
            (e) =>
              e.level >= 500 &&
              e.level < 600 &&
              e.name != "六阴追魂剑法" &&
              (e.kind == "attack" || e.kind == "recovery" || e.kind == "force") &&
              !PLU.TMP.CANTCMS.includes(e.name),
          );
          if (!PLU.TMP.CMSkill) {
            PLU.STATUS.isBusy = false;
            PLU.TMP.CMSkill = null;
            PLU.setBtnRed($("#btn_bt_autoChuaiMo"), 0);
          } else {
            clickButton("enable " + PLU.TMP.CMSkill.key);
            UTIL.addSysListener("listenChuaiMo", function (b, type, subtype, msg) {
              if (type == "notice" && (msg.indexOf("揣摩最高等级为") >= 0 || msg.indexOf("这项技能不能揣摩") >= 0)) {
                UTIL.delSysListener("listenChuaiMo");
                if (msg.indexOf("这项技能不能揣摩") >= 0) {
                  PLU.TMP.CANTCMS.push(PLU.TMP.CMSkill.name);
                }
                YFUI.writeToOut("<span style='color:#FFF;'>--揣摩结束--</span>");
                PLU.TMP.CMSkill = null;
              }
              return;
            });
          }
          PLU.autoChuaiMo();
        });
      } else {
        clickButton("chuaimo go," + PLU.TMP.CMSkill.key, 0);
        setTimeout((e) => {
          PLU.autoChuaiMo();
        }, 250);
      }
    },
    //================================================================================================
    autoLianXi() {
      PLU.STATUS.isBusy = true; // 设置状态为忙碌
      PLU.getSkillsList((allSkills, tupoSkills) => { // 获取技能列表
        PLU.TMP.CANTLXS = PLU.TMP.CANTLXS || []; // 初始化无法练习的技能列表
        PLU.TMP.LXISkill = allSkills.find(skill =>
          skill.level >= 200 &&
          skill.level < 500 &&
          !PLU.TMP.CANTLXS.includes(skill.name) &&
          !["基本钩法", "基本戟法", "六阴追魂剑法", "天魔焚身", "纵意登仙步", "九阴噬骨刀"].includes(skill.name) &&
          ["attack", "recovery"].includes(skill.kind)
        );
        if (!PLU.TMP.LXISkill) { // 如果没有找到合适的技能
          PLU.STATUS.isBusy = false;
          return;
        }
        clickButton("enable " + PLU.TMP.LXISkill.key); // 启用找到的技能
        UTIL.addSysListener("listenLianXi", (b, type, subtype, msg) => {
          if (type === "notice") {
            if (msg.includes("练习已经不能提高了") || msg.includes("这项技能不能练习")) {
              // 处理练习结束的情况
              UTIL.delSysListener("listenLianXi");
              if (msg.includes("这项技能不能练习")) {
                PLU.TMP.CANTLXS.push(PLU.TMP.LXISkill.name);
              }
              clearTimeout(PLU.TMP.timer);
              PLU.STATUS.isBusy = false;
              PLU.TMP.LXISkill = null;
            } else if (msg.includes("你开始练习")) {
              // 如果正在练习其他技能
              UTIL.delSysListener("listenLianXi");
              YFUI.writeToOut("<span style='color:#FFF;'>--开始练习--</span>");
              clearTimeout(PLU.TMP.timer);
              PLU.STATUS.isBusy = false;
              PLU.TMP.LXISkill = null;
            }
          }
        });
        clickButton("practice " + PLU.TMP.LXISkill.key, 100); // 开始练习技能
        PLU.TMP.timer = setTimeout(autoLianXi, 250); // 设置定时器，250毫秒后继续练习
      });
    },
    //================================================================================================
    toAutoTeach($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        PLU.STATUS.isBusy = false;
        PLU.TMP.TeachSkill = null;
        return;
      }
      YFUI.showPop({
        title: "自动传授游侠技能",
        text: "一键自动传授游侠技能！<b style='color:#F00;'>需要点开游侠技能界面,需要传授的技能不能为0级</b>",
        onOk() {
          PLU.autoTeach();
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    //================================================================================================
    autoTeach() {
      if (!PLU.ONOFF["btn_bt_autoTeach"]) return;
      PLU.STATUS.isBusy = true;
      if (PLU.TMP.CUR_YX_SKILLS) {
        let ac = PLU.TMP.CUR_YX_SKILLS.find((e) => Number(e.lvl) > 0 && Number(e.lvl) < Number(e.max));
        if (ac) {
          clickButton(ac.cmd, 0);
          setTimeout((e) => {
            PLU.autoTeach();
          }, 200);
        } else {
          YFUI.writeToOut("<span style='color:#FFF;'>--传授结束--</span>");
          PLU.STATUS.isBusy = false;
          PLU.setBtnRed($("#btn_bt_autoTeach"), 0);
        }
      } else {
        PLU.STATUS.isBusy = false;
        PLU.setBtnRed($("#btn_bt_autoTeach"), 0);
      }
    },
    //================================================================================================
    toAutoUpgrade($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        PLU.STATUS.isBusy = false;
        PLU.TMP.TeachSkill = null;
        return;
      }
      YFUI.showPop({
        title: "自动升级游侠等级",
        text: "一键升级游侠等级！<b style='color:#F00;'>需要点开游侠技能界面</b>",
        onOk() {
          PLU.autoUpgrade();
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    // 今天提升鸠摩智等级的次数已达到上限了。
    //不能提升阿朱的等级。
    //游侠等级超过上限了。
    //================================================================================================
    autoUpgrade() {
      if (!PLU.ONOFF["btn_bt_autoUpgrade"]) return;
      PLU.STATUS.isBusy = true;
      if (PLU.TMP.CUR_YX_LEVEL && PLU.TMP.CUR_YX_SKILLS && PLU.TMP.CUR_YX_ENG) {
        if (PLU.TMP.CUR_YX_SKILLS.length > 4 && PLU.TMP.CUR_YX_LEVEL < 2000) {
          var canUpgrade = true;
          UTIL.addSysListener("listenAutoUpgrade", function (b, type, subtype, msg) {
            if (type == "notice" && (msg.indexOf("等级的次数已达到上限了") >= 0 || msg.indexOf("不能提升") >= 0 || msg.indexOf("等级超过上限了") >= 0)) {
              UTIL.delSysListener("listenAutoUpgrade");
              canUpgrade = false;
              PLU.STATUS.isBusy = false;
              YFUI.writeToOut("<span style='color:#FFF;'>--升级结束--</span>");
              PLU.setBtnRed($("#btn_bt_autoUpgrade"), 0);
            }
            return;
          });
          clickButton("fudi juxian upgrade go " + PLU.TMP.CUR_YX_ENG + " 100");
          setTimeout((e) => {
            if (canUpgrade) PLU.autoUpgrade();
          }, 500);
        } else {
          YFUI.writeToOut("<span style='color:#FFF;'>--升级结束--</span>");
          PLU.STATUS.isBusy = false;
          PLU.setBtnRed($("#btn_bt_autoUpgrade"), 0);
        }
      } else {
        PLU.STATUS.isBusy = false;
        PLU.setBtnRed($("#btn_bt_autoUpgrade"), 0);
      }
    },
    //================================================================================================
    toLoopKillByN($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        $("#btn_bt_loopKillByN").text("计数击杀");
        return;
      }
      clickButton("golook_room");
      YFUI.showInput({
        title: "计数击杀",
        text: "输入数量，确定后单击怪!!(数量后带小数点为比试)",
        value: PLU.getCache("lookKillNum") || 20,
        onOk(val) {
          if (!Number(val)) return;
          setTimeout((o) => {
            $(document).one("click", (o) => {
              let snpc = $(o.target)
                .closest("button")[0]
                .outerHTML.match(/clickButton\('look_npc (\w+)'/i);
              if (snpc && snpc.length >= 2) {
                let kf = String(val).indexOf(".") > 0 ? "fight" : "kill";
                PLU.setCache("lookKillNum", Number(val));
                PLU.loopKillByN(snpc[1], parseInt(val), kf);
              } else {
                PLU.setBtnRed($btn, 0);
              }
            });
          }, 500);
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    //================================================================================================
    loopKillByN(npcId, killN, killorfight) {
      if (killN <= 0 || !PLU.ONOFF["btn_bt_loopKillByN"]) return;
      $("#btn_bt_loopKillByN").text("停(" + killN + ")");
      PLU.autoFight({
        targetKey: npcId,
        fightKind: killorfight,
        autoSkill: "fast",
        onFail() {
          setTimeout((t) => {
            PLU.loopKillByN(npcId, killN, killorfight);
          }, 500);
        },
        onEnd() {
          if (killN <= 1) {
            PLU.setBtnRed($("#btn_bt_loopKillByN"), 0);
            $("#btn_bt_loopKillByN").text("计数击杀");
            clickButton("home", 1);
            return;
          } else {
            setTimeout((t) => {
              PLU.loopKillByN(npcId, killN - 1, killorfight);
            }, 500);
          }
        },
      });
    },
    //================================================================================================
    toLoopKillName($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        $("#btn_bt_loopKillName").text("名字连杀");
        return;
      }
      YFUI.showInput({
        title: "名字连杀",
        text: `格式：次数|人物词组<br>
                        次数：省略则默认1次<br>
                        人物词组：以英文逗号分割多个关键词<br>
                        <span style="color:red;">例如：</span><br>
                        [例1] <span style="color:blue;">99|铁狼军,银狼军,金狼军,金狼将,十夫长,百夫长,千夫长</span><br>
                        [例2] <span style="color:blue;">醉汉,收破烂的</span>;
                        `,
        value: PLU.getCache("lookKillNames") || "299|铁狼军,银狼军,金狼军,金狼将,十夫长,百夫长,千夫长",
        onOk(val) {
          if (!$.trim(val)) return;
          let str = $.trim(val),
            times = 1,
            names = "",
            arr = str.split("|");
          if (arr.length > 1) {
            times = Number(arr[0]) || 1;
            names = arr[1];
          } else {
            names = arr[0];
          }
          PLU.setCache("lookKillNames", str);
          PLU.loopKillName(names, Number(times));
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    //================================================================================================
    loopKillName(names, killN) {
      if (killN <= 0 || !PLU.ONOFF["btn_bt_loopKillName"]) return;
      $("#btn_bt_loopKillName").text("停击杀(" + killN + ")");
      let npcObj = null,
        namesArr = names.split(",");
      for (let i = 0; i < namesArr.length; i++) {
        npcObj = UTIL.findRoomNpc(namesArr[i], false, true);
        if (npcObj) break;
      }
      if (npcObj) {
        let needAutoSkill = PLU.getCache("autoPerform") >= 1 ? null : "multi";
        PLU.autoFight({
          targetKey: npcObj.key,
          fightKind: "kill",
          autoSkill: needAutoSkill,
          onFail() {
            setTimeout((t) => {
              PLU.loopKillName(names, killN);
            }, 1000);
          },
          onEnd() {
            if (killN <= 1) {
              PLU.setBtnRed($("#btn_bt_loopKillName"), 0);
              $("#btn_bt_loopKillName").text("名字连杀");
              return;
            } else {
              setTimeout((t) => {
                PLU.loopKillName(names, killN - 1);
              }, 1000);
            }
          },
        });
      } else {
        setTimeout((t) => {
          PLU.loopKillName(names, killN);
        }, 2000);
      }
    },
    //================================================================================================
    toLoopKill($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        // $("#btn_bt_kg_loopKill").text('循环杀')
        return;
      }
      YFUI.showInput({
        title: "循环杀",
        text: `格式：名字词组<br>
                        名字词组：以英文逗号分割多个关键词, <b style="color:red;">可模糊匹配!</b><br>
                        <span style="color:red;">不需要战斗时建议关闭以节省性能!!</span><br>
                        [例1] <span style="color:blue;">铁狼军,银狼军,金狼军,金狼将,十夫长,百夫长,千夫长,蛮荒铁,蛮荒银,蛮荒金,寨近卫,蛮荒近卫</span><br>
                        `,
        type: "textarea",
        value: PLU.getCache("lookKillKeys") || "怯薛军,蒙古突骑,草原枪骑,重装铁骑,狼军,狼将,夫长,蛮荒,近卫,春龙,龙九",
        onOk(val) {
          if (!$.trim(val)) return;
          let str = $.trim(val),
            names = str.split(/[,，#]/);
          PLU.setCache("lookKillKeys", str);
          PLU.loopKills(str);
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    //================================================================================================
    loopKills(names) {
      if (!PLU.ONOFF["btn_bt_kg_loopKill"]) return;
      // $("#btn_bt_kg_loopKill").text('停循环');
      let npcObj = null,
        namesArr = names.split(/[,，#]/);
      for (let i = 0; i < namesArr.length; i++) {
        npcObj = UTIL.findRoomNpcReg(namesArr[i]);
        if (npcObj) break;
      }
      if (npcObj) {
        let needAutoSkill = PLU.getCache("autoPerform") >= 1 ? null : "multi";
        PLU.autoFight({
          targetKey: npcObj.key,
          fightKind: "kill",
          autoSkill: needAutoSkill,
          onFail() {
            setTimeout((t) => {
              PLU.loopKills(names);
            }, 1000);
          },
          onEnd() {
            setTimeout((t) => {
              PLU.loopKills(names);
            }, 500);
          },
        });
      } else {
        setTimeout((t) => {
          PLU.loopKills(names);
        }, 1000);
      }
    },
    //================================================================================================
    toLoopReadBase($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        // $("#btn_bt_loopReadBase").text('读技能书')
        return;
      }
      YFUI.showInput({
        title: "读书还神",
        text: `格式：比试NPC名称|基础秘籍名称<br>
                        比试NPC名称：要比试进行回神的NPC名字<br>
                        基础秘籍名称：基础秘籍名称关键词<br>
                        <span style="color:red;">战斗必刷道具栏必须用还神丹</span><br>
                        <span style="color:red;">例如：</span><br>
                        [例1] <span style="color:blue;">地痞|基本剑法秘籍</span>
                        `,
        value: PLU.getCache("loopReadBase") || "地痞|基本剑法秘籍",
        onOk(val) {
          if (!$.trim(val)) return;
          let str = $.trim(val),
            npcName = "",
            bookName = "",
            arr = str.split("|");
          if (arr.length > 1) {
            npcName = arr[0];
            bookName = arr[1];
            PLU.setCache("loopReadBase", str);
            PLU.getAllItems((list) => {
              let bookItem = list.find((it) => !!it.name.match(bookName));
              let reN = Math.floor(g_obj_map.get("msg_attrs").get("max_shen_value") / 55) || 1;
              console.log(npcName, bookItem.key, reN);
              if (bookItem) {
                PLU.toggleAutoPerform($("#btn_bt_kg_autoPerform"), "autoPerform", 0);
                PLU.loopReadBase(npcName, bookItem.key, reN);
              }
            });
          } else {
            PLU.setBtnRed($btn, 0);
            return;
          }
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    loopReadBase(npcName, bookKey, reN) {
      //你使用了一本
      //你的神值不足：10以上。
      //你目前不能使用
      //使用技能等级为
      if (!PLU.ONOFF["btn_bt_loopReadBase"]) {
        UTIL.delSysListener("listenLoopReadBase");
        YFUI.writeToOut("<span style='color:#FFF;'>--读基本技能书停止--</span>");
        PLU.setBtnRed($("#btn_bt_loopReadBase"), 0);
        return;
      }
      UTIL.addSysListener("listenLoopReadBase", function (b, type, subtype, msg) {
        if (type == "main_msg" && msg.indexOf("你使用了一本") >= 0) {
          UTIL.delSysListener("listenLoopReadBase");
          setTimeout(() => {
            PLU.loopReadBase(npcName, bookKey, reN);
          }, 500);
        } else if (type == "notice" && msg.indexOf("你的神值不足") >= 0) {
          UTIL.delSysListener("listenLoopReadBase");
          setTimeout(() => {
            let refreshNumber = 0;
            PLU.autoFight({
              targetName: npcName,
              fightKind: "fight",
              autoSkill: "item",
              onStart() {
                console.log("start fight==");
              },
              onFighting(ps) {
                if (refreshNumber >= reN) return true;
                if (ps && ps.key == "playskill 7") {
                  refreshNumber++;
                  console.log(ps.key, refreshNumber, reN);
                  if (refreshNumber >= reN) {
                   // PLU.autoEscape({});
                       PLU.execActions("escape")
                  }
                }
              },
              onFail(err) {
                console.log(err);
                setTimeout(() => {
                  PLU.loopReadBase(npcName, bookKey, reN);
                }, 1000);
              },
              onEnd(e) {
                setTimeout(() => {
                  PLU.loopReadBase(npcName, bookKey, reN);
                }, 1000);
              },
            });
          }, 500);
        } else if (type == "notice" && msg.indexOf("使用技能等级为") >= 0) {
          UTIL.delSysListener("listenLoopReadBase");
          YFUI.writeToOut("<span style='color:#FFF;'>--读基本技能书结束--</span>");
          PLU.setBtnRed($("#btn_bt_loopReadBase"), 0);
        } else if (type == "notice" && msg.indexOf("你的背包里没有这个物品") >= 0) {
          YFUI.writeToOut("<span style='color:#FFF;'>--读基本技能书停止--</span>");
          PLU.setBtnRed($("#btn_bt_loopReadBase"), 0);
        }
        return;
      });
      let cmds = "items use " + bookKey;
      PLU.execActions(cmds);
    },
    //================================================================================================
    toSearchFamilyQS($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) return;
      YFUI.showInput({
        title: "搜索师门任务",
        text: `格式：任务包含的关键字,多个以英文逗号分隔<br>
                        <span style="color:red;">例如：</span><br>
                        [例1] <span style="color:blue;">硫磺,黝黑山洞</span>
            [例2] <span style="color:blue;">茅山,</span>
                        `,
        value: PLU.getCache("searchFamilyQS") || "硫磺,黝黑山洞",
        onOk(val) {
          if (!$.trim(val)) return;
          let str = $.trim(val),
            arr = str.split(",");
          if (arr.length > 1) {
            PLU.setCache("searchFamilyQS", str);
            clickButton("family_quest", 0);
            PLU.TMP.master = g_obj_map?.get("msg_attrs")?.get("master_name");
            PLU.loopSearchFamilyQS(arr);
          } else {
            PLU.setBtnRed($btn, 0);
            return;
          }
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    loopSearchFamilyQS(keys, cmd) {
      if (!PLU.ONOFF["btn_bt_searchFamilyQS"]) {
        UTIL.delSysListener("listenLoopSearchFamilyQS");
        YFUI.writeToOut("<span style='color:#FFF;'>--停止搜索--</span>");
        PLU.setBtnRed($("#btn_bt_searchFamilyQS"), 0);
        return;
      }
      UTIL.addSysListener("listenLoopSearchFamilyQS", function (b, type, subtype, msg) {
        if (type == "main_msg") {
          if (msg.indexOf(`${PLU.TMP.master}一拂袖`) >= 0 || msg.indexOf("你现在没有师门任务。") >= 0) {
            UTIL.delSysListener("listenLoopSearchFamilyQS");
            setTimeout(() => {
              PLU.loopSearchFamilyQS(keys);
            }, 250);
          } else if (msg.indexOf("你现在的任务是") >= 0 || msg.indexOf(PLU.TMP.master) >= 0) {
            UTIL.delSysListener("listenLoopSearchFamilyQS");
            let qsStr = msg.replace(/\x03(0)?|href;0;|[\033|\27|\0x1b]\[[0-9|;]+m/gi, "");
            for (let i = 0; i < keys.length; i++) {
              let key = $.trim(keys[i]);
              if (key && qsStr.indexOf(key) >= 0) {
                YFUI.writeToOut("<span style='color:#FF0;'>========= 结束搜索 =========</span>");
                delete PLU.TMP.master;
                PLU.setBtnRed($("#btn_bt_searchFamilyQS"), 0);
                break;
              } else {
                setTimeout(() => {
                  PLU.loopSearchFamilyQS(keys, "family_quest cancel go");
                }, 250);
              }
            }
          }
        }
      });
      if (cmd) clickButton(cmd);
      else clickButton("family_quest", 0);
    },
    //================================================================================================
    toSearchBangQS($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) return;
      YFUI.showInput({
        title: "搜索帮派任务",
        text: `格式：任务包含的关键字,多个以英文逗号分隔<br>
                        <span style="color:red;">例如：</span><br>
                        [例1] <span style="color:blue;">硫磺,黝黑山洞</span>
                        `,
        value: PLU.getCache("searchBangQS") || "硫磺,黝黑山洞",
        onOk(val) {
          if (!$.trim(val)) return;
          let str = $.trim(val),
            arr = str.split(",");
          if (arr.length > 1) {
            PLU.setCache("searchBangQS", str);
            clickButton("clan scene", 0);
            PLU.loopSearchBangQS(arr);
          } else {
            PLU.setBtnRed($btn, 0);
            return;
          }
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    loopSearchBangQS(keys, cmd) {
      if (!PLU.ONOFF["btn_bt_searchBangQS"]) {
        UTIL.delSysListener("listenLoopSearchBangQS");
        YFUI.writeToOut("<span style='color:#FFF;'>--停止搜索--</span>");
        PLU.setBtnRed($("#btn_bt_searchBangQS"), 0);
        return;
      }
      UTIL.addSysListener("listenLoopSearchBangQS", function (b, type, subtype, msg) {
        if (type == "main_msg") {
          if (msg.indexOf("帮派使者一拂袖") >= 0 || msg.indexOf("帮派使者：现在没有任务") >= 0) {
            UTIL.delSysListener("listenLoopSearchBangQS");
            setTimeout(() => {
              PLU.loopSearchBangQS(keys);
            }, 250);
          } else if (msg.indexOf("你现在的任务是") >= 0 || msg.indexOf("帮派使者：") >= 0) {
            UTIL.delSysListener("listenLoopSearchBangQS");
            let qsStr = msg.replace(/\x03(0)?|href;0;|[\033|\27|\0x1b]\[[0-9|;]+m/gi, "");
            for (let i = 0; i < keys.length; i++) {
              let key = $.trim(keys[i]);
              if (key && qsStr.indexOf(key) >= 0) {
                YFUI.writeToOut("<span style='color:#FF0;'>========= 结束搜索 =========</span>");
                PLU.setBtnRed($("#btn_bt_searchBangQS"), 0);
                break;
              } else {
                setTimeout(() => {
                  PLU.loopSearchBangQS(keys, "clan cancel_task go");
                }, 250);
              }
            }
          }
        }
      });
      if (cmd) clickButton(cmd);
      else clickButton("clan task", 0);
    },
    //================================================================================================
    toLoopClick($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        $("#btn_bt_loopClick").text("自动点击");
        return;
      }
      YFUI.showInput({
        title: "自动点击",
        text: "输入自动点击的次数，确定后点击要点按钮",
        value: PLU.getCache("autoClickNum") || 20,
        onOk(val) {
          if (!Number(val)) return;
          setTimeout((o) => {
            $(document).one("click", (o) => {
              let snpc = $(o.target)
                .closest("button")[0]
                .outerHTML.match(/clickButton\([\'\"](.+)[\'\"](,\s*(\d+))*\)/i);
              if (snpc && snpc.length >= 2) {
                let param = snpc[3] ?? 0;
                PLU.setCache("autoClickNum", Number(val));
                PLU.loopClick(snpc[1], param, Number(val));
              } else {
                PLU.setBtnRed($btn, 0);
              }
            });
          }, 500);
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    //================================================================================================
    loopClick(btnCmd, param, clickNum) {
      if (!clickNum || clickNum < 1 || !PLU.ONOFF["btn_bt_loopClick"]) {
        PLU.setBtnRed($("#btn_bt_loopClick"), 0);
        $("#btn_bt_loopClick").text("连续点击");
        return;
      }
      $("#btn_bt_loopClick").text("停点击(" + clickNum + ")");
      clickButton(btnCmd, param);
      clickNum--;
      setTimeout(() => {
        PLU.loopClick(btnCmd, param, clickNum);
      }, 250);
    },
    //================================================================================================
    loopSlowClick(btnCmd, param, clickNum, delay) {
      if (!delay) delay = 1000;
      if (!clickNum || clickNum < 1 || !PLU.ONOFF["btn_bt_loopSlowClick"]) {
        PLU.setBtnRed($("#btn_bt_loopSlowClick"), 0);
        $("#btn_bt_loopSlowClick").text("慢速点击");
        return;
      }
      $("#btn_bt_loopSlowClick").text("停(" + clickNum + ")");
      clickButton(btnCmd, param);
      clickNum--;
      setTimeout(() => {
        PLU.loopSlowClick(btnCmd, param, clickNum, delay);
      }, delay);
    },
    //================================================================================================
    toLoopSlowClick($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        $("#btn_bt_loopSlowClick").text("自动点击");
        return;
      }
      YFUI.showPop({
        title: "自动点击",
        text: `输入自动点击的次数，输入点击速度，确定后点击游戏中要点的按钮<br>
                        <div style='margin:10px 0;'>
                            <span>速度(几秒一次): </span>
                            <input id="slowClickSec" value="0.5" style="font-size:16px;height:30px;width:15%;"></input>
                            <span>次数: </span>
                            <input id="slowClickTimes" value="${PLU.getCache("autoClickNum") || 20}" style="font-size:16px;height:26px;width:40%;"></input>
                        </div>`,
        onOk() {
          let times = Number($("#slowClickTimes").val()),
            delay = Number($("#slowClickSec").val());
          if (Number(times) <= 0 || Number(delay) <= 0) return;
          setTimeout((o) => {
            $(document).one("click", (o) => {
              let snpc = $(o.target)
                .closest("button")[0]
                .outerHTML.match(/clickButton\([\'\"](.+)[\'\"](,\s*(\d+))*\)/i);
              if (snpc && snpc.length >= 2) {
                let param = snpc[3] ?? 0;
                PLU.setCache("autoClickNum", times);
                PLU.loopSlowClick(snpc[1], param, times, delay * 1000);
              } else {
                PLU.setBtnRed($btn, 0);
              }
            });
          }, 500);
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    toRecord($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (btnFlag) {
        PLU.TMP.cmds = [];
        $("#btn_record").text("停止录制");
        return;
      }
      let cmds = PLU.TMP.cmds;
      delete PLU.TMP.cmds;
      // 指令壓縮算法
      var count = 1;
      for (var index = 0; index < cmds.length; index++) {
        if (cmds[index] == cmds[index + 1]) {
          count++;
          continue;
        }
        if (count >= 2 + cmds[index].length == 1) {
          index -= count - 1;
          cmds.splice(index, count, "#" + count + " " + cmds[index]);
        }
        count = 1;
      }
      cmds = cmds
        .map((e) => {
          let res = e.match(/#\d+ ((jh|fb) \d+)/);
          return res ? res[1] : e;
        })
        .join(";");
      YFUI.showPop({
        title: "指令详情",
        text: cmds,
        okText: "复制",
        onOk() {
          if (GM_setClipboard) GM_setClipboard(cmds);
          else YFUI.writeToOut("<span>权限不足！</span>");
          $("#btn_record").text("指令录制");
        },
      });
    },
    //================================================================================================
    autoMasterGem($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        $("#btn_bt_autoMasterGem").text("一键合天神");
        return;
      }
      let arr = ["碎裂的", "裂开的", "无前缀", "无暇的", "完美的", "君王的", "皇帝的"];
      let sel1 = '<select id="startGemLvl" style="font-size:16px;height:30px;width:25%;">';
      arr.forEach((p, pi) => {
        sel1 += '<option value="' + pi + '" ' + (pi == 0 ? "selected" : "") + ">" + p + "</option>";
      });
      sel1 += "</select>";
      YFUI.showPop({
        title: "一键合天神",
        text: `选择合成起始宝石等级，选择速度(请根据网速和游戏速度选择)，确定后自动向上合成所有<br>
                        <div style='margin:10px 0;'>
                            <span>起始等级: </span>${sel1}
                            <span>速度(秒): </span>
                            <select id="combineSec" style="font-size:16px;height:30px;width:15%;">
                                <option selected>0.5</option>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                            </select>
                        </div>`,
        width: "382px",
        okText: "开始",
        onOk() {
          let startLvl = Number($("#startGemLvl").val()),
            delay = Number($("#combineSec").val());
          PLU.autoCombineMasterGem(startLvl, delay * 1000);
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    autoCombineMasterGem(startLvl, delay, gemCode, count) {
      if (!PLU.ONOFF["btn_bt_autoMasterGem"]) {
        PLU.setBtnRed($("#btn_bt_autoMasterGem"), 0);
        $("#btn_bt_autoMasterGem").text("一键合天神");
        YFUI.writeToOut("<span style='color:white;'>==停止合成宝石!==</span>");
        return;
      }
      if (!UTIL.sysListeners["listenCombineMasterGem"]) {
        UTIL.addSysListener("listenCombineMasterGem", function (b, type, subtype, msg) {
          if (type == "notice" && msg.indexOf("合成宝石需要") >= 0) {
            UTIL.delSysListener("listenCombineMasterGem");
            YFUI.writeToOut("<span style='color:#F00;'>--缺少银两, 合成结束--</span>");
            PLU.setBtnRed($("#btn_bt_autoMasterGem"), 0);
          }
          return;
        });
      }
      //合成宝石需要5万银两。
      //没有这么多的完美的蓝宝石
      if (!gemCode || count < 3) {
        PLU.getGemList((gemList) => {
          // console.log(gemList)
          let g = gemList.find((e) => e.key.indexOf("" + (startLvl + 1)) > 0 && e.num >= 3);
          if (g) {
            PLU.autoCombineMasterGem(startLvl, delay, g.key, g.num);
          } else {
            if (startLvl < 6) PLU.autoCombineMasterGem(startLvl + 1, delay);
            else {
              PLU.setBtnRed($("#btn_bt_autoMasterGem"), 0);
              YFUI.writeToOut("<span style='color:white;'>==合成宝石结束!==</span>");
            }
          }
        });
      } else {
        let cd = (delay / 4) | 250,
          n = 1;
        cd = cd > 250 ? cd : 250;
        if (count >= 30000) {
          n = 10000;
          cd = delay;
        } else if (count >= 15000) {
          n = 5000;
          cd = delay;
        } else if (count >= 9000) {
          n = 3000;
          cd = delay;
        } else if (count >= 3000) {
          n = 1000;
          cd = delay;
        } else if (count >= 300) {
          n = 100;
          cd = delay;
        } else if (count >= 150) {
          n = 50;
          cd = delay;
        } else if (count >= 90) {
          n = 30;
          cd = (delay / 2) | 0;
        } else if (count >= 30) {
          n = 10;
          cd = (delay / 3) | 0;
        }
        let cmd = "items hecheng " + gemCode + "_N_" + n + "";
        clickButton(cmd);
        setTimeout(() => {
          PLU.autoCombineMasterGem(startLvl, delay, gemCode, count - n * 3);
        }, cd);
      }
    },
    //================================================================================================
    toSellLaji($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        //$("#btn_bt_sellLaji").text('清理垃圾')
        return;
      }
      let defaultList =
        "破烂衣服,水草,木盾,铁盾,藤甲盾,青铜盾,鞶革,军袍,麻带,破披风,长斗篷,牛皮带,锦缎腰带,丝质披风,逆钩匕,匕首,铁甲,重甲,精铁甲,逆钩匕,银丝甲,梅花匕,软甲衣,羊角匕,金刚杖,白蟒鞭,天寒项链,天寒手镯,新月棍,天寒戒,天寒帽,天寒鞋,金弹子,拜月掌套,斩空刀,飞羽剑,七星宝戒,迷幻经纶,长剑,鹿皮小靴,铁手镯,银手镯,丝绸马褂,钢剑,布鞋,布衣,铁项链,银项链,单刀,丝绸衣,竹剑,松子,黑棋子,白棋子,沉虹刀,丝衣,木棍,钢刀,铁戒,银戒,船篙";
      YFUI.showInput({
        title: "清理垃圾",
        text: `格式：物品词组<br>
                        物品词组：以英文逗号分割多个关键词<br>
                        <span style="color:red;">例如：</span><br>
                        [例1] <span style="color:blue;">${defaultList}</span><br>
                        `,
        value: PLU.getCache("sellItemNames") || defaultList,
        type: "textarea",
        onOk(val) {
          if (!$.trim(val)) return;
          let str = $.trim(val);
          PLU.setCache("sellItemNames", str);
          let keysList = str.split(",");
          let itemsTimeOut = setTimeout(() => {
            UTIL.delSysListener("listItems");
          }, 5000);
          UTIL.addSysListener("listItems", function (b, type, subtype, msg) {
            if (type != "items") return;
            UTIL.delSysListener("listItems");
            clearTimeout(itemsTimeOut);
            clickButton("prev");
            let iId = 1,
              itemList = [];
            while (b.get("items" + iId)) {
              let it = UTIL.filterMsg(b.get("items" + iId)).split(",");
              if (it && it.length > 4 && it[3] == "0" && keysList.includes(it[1]))
                itemList.push({
                  key: it[0],
                  name: it[1],
                  num: Number(it[2]),
                });
              iId++;
            }
            PLU.loopSellItems(itemList);
          });
          clickButton("items", 0);
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    //================================================================================================
    loopSellItems(itemList) {
      if (itemList.length <= 0) {
        PLU.setBtnRed($("#btn_bt_sellLaji"), 0);
        return YFUI.writeToOut("<span style='color:#F66;'>--无出售物件!--</span>");
      }
      let ac = [];
      itemList.forEach((it) => {
        let ct = it.num;
        while (ct > 0) {
          if (ct >= 10000) {
            ac.push("items sell " + it.key + "_N_10000");
            ct -= 10000;
          } else if (ct >= 1000) {
            ac.push("items sell " + it.key + "_N_1000");
            ct -= 1000;
          } else if (ct >= 100) {
            ac.push("items sell " + it.key + "_N_100");
            ct -= 100;
          } else if (ct >= 50) {
            ac.push("items sell " + it.key + "_N_50");
            ct -= 50;
          } else if (ct >= 10) {
            ac.push("items sell " + it.key + "_N_10");
            ct -= 10;
          } else {
            ac.push("items sell " + it.key + "");
            ct -= 1;
          }
        }
      });
      let acs = ac.join(";");
      PLU.fastExec(acs, () => {
        PLU.setBtnRed($("#btn_bt_sellLaji"), 0);
        YFUI.writeToOut("<span style='color:white;'>==出售完成!==</span>");
      });
    },
    //================================================================================================
    toSplitItem($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) return;
      let defaultList =
        "玄武盾,破军盾,金丝宝甲衣,夜行披风,羊毛斗篷,残雪戒,残雪项链,残雪手镯,残雪鞋,金丝甲,宝玉甲,月光宝甲,虎皮腰带,沧海护腰,红光匕,毒龙鞭,玉清棍,霹雳掌套,血屠刀,生死符,残雪帽,星河剑,疯魔杖,天寒匕,无心匕,明月戒,明月鞋,明月帽,明月手镯,明月项链,软猬甲,月光宝甲衣,扬文,碧磷鞭,倚天剑,屠龙刀";
      YFUI.showInput({
        title: "分解装备",
        text: `格式：物品词组<br>
                        物品词组：以英文逗号分割多个关键词<br>
                        <span style="color:red;">例如：</span><br>
                        [例1] <span style="color:blue;">${defaultList}</span><br>
                        `,
        value: PLU.getCache("splitItemNames") || defaultList,
        type: "textarea",
        onOk(val) {
          if (!$.trim(val)) return;
          let str = $.trim(val);
          PLU.setCache("splitItemNames", str);
          let keysList = str.split(",");
          let itemsTimeOut = setTimeout(() => {
            UTIL.delSysListener("listItems_si");
          }, 5000);
          UTIL.addSysListener("listItems_si", function (b, type, subtype, msg) {
            if (type != "items") return;
            UTIL.delSysListener("listItems_si");
            clearTimeout(itemsTimeOut);
            clickButton("prev");
            let iId = 1,
              itemList = [];
            while (b.get("items" + iId)) {
              let it = UTIL.filterMsg(b.get("items" + iId)).split(",");
              if (it && it.length > 4 && it[3] == "0" && keysList.includes(it[1]))
                itemList.push({
                  key: it[0],
                  name: it[1],
                  num: Number(it[2]),
                });
              iId++;
            }
            PLU.loopSplitItem(itemList);
          });
          clickButton("items", 0);
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    //================================================================================================
    loopSplitItem(itemList) {
      if (itemList.length <= 0) {
        PLU.setBtnRed($("#btn_bt_splitItem"), 0);
        return YFUI.writeToOut("<span style='color:#F66;'>--无分解物件!--</span>");
      }
      let ac = [];
      itemList.forEach((it) => {
        let ct = it.num;
        while (ct > 0) {
          if (ct >= 100) {
            ac.push("items splite " + it.key + "_N_100");
            ct -= 100;
          } else if (ct >= 50) {
            ac.push("items splite " + it.key + "_N_50");
            ct -= 50;
          } else if (ct >= 10) {
            ac.push("items splite " + it.key + "_N_10");
            ct -= 10;
          } else {
            ac.push("items splite " + it.key + "");
            ct -= 1;
          }
        }
      });
      let acs = ac.join(";");
      PLU.fastExec(acs, () => {
        PLU.setBtnRed($("#btn_bt_splitItem"), 0);
        YFUI.writeToOut("<span style='color:white;'>==分解完成!==</span>");
      });
    },
    //================================================================================================
    toPutStore($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) return;
      let defaultList = "树枝,碎片,璞玉,青玉,墨玉,白玉,秘籍木盒,锦袋,瑞雪针扣,武穆遗书,隐武竹笺,空识卷轴,技能书,开元宝票,霹雳弹,舞鸢尾,百宜雪梅,宝石,宝箱,技能天书,钥匙,玄重铁,武林至高绝学残页,九转,采掘许可,提速卡,采掘许可,礼券";
      YFUI.showInput({
        title: "物品入库",
        text: `格式：物品词组<br>
                        物品词组：以英文逗号分割多个关键词<br>
                        <span style="color:red;">例如：</span><br>
                        [例1] <span style="color:blue;">${defaultList}</span><br>
                        `,
        value: PLU.getCache("putStoreNames") || defaultList,
        type: "textarea",
        onOk(val) {
          if (!$.trim(val)) return;
          let str = $.trim(val);
          PLU.setCache("putStoreNames", str);
          let keysList = str.split(",").join("|");
          let itemsTimeOut = setTimeout(() => {
            UTIL.delSysListener("listItems_ps");
          }, 5000);
          UTIL.addSysListener("listItems_ps", function (b, type, subtype, msg) {
            if (type != "items") return;
            UTIL.delSysListener("listItems_ps");
            clearTimeout(itemsTimeOut);
            clickButton("prev");
            let iId = 1,
              itemList = [];
            while (b.get("items" + iId)) {
              let it = UTIL.filterMsg(b.get("items" + iId)).split(",");
              if (it && it.length > 4 && it[3] == "0" && it[1].match(keysList) && it[1] != "青龙碎片" && it[1] != "玄铁碎片")
                itemList.push({
                  key: it[0],
                  name: it[1],
                  num: Number(it[2]),
                });
              iId++;
            }
            PLU.loopPutStore(itemList);
          });
          clickButton("items", 0);
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    //================================================================================================
    loopPutStore(itemList) {
      if (itemList.length <= 0) {
        PLU.setBtnRed($("#btn_bt_putStore"), 0);
        return YFUI.writeToOut("<span style='color:#F66;'>--无物件入库!--</span>");
      }
      let ac = [];
      itemList.forEach((it) => {
        ac.push("items put_store " + it.key + "");
      });
      PLU.fastExec(ac.join(";"), () => {
        PLU.setBtnRed($("#btn_bt_putStore"), 0);
        YFUI.writeToOut("<span style='color:white;'>==入库完成!==</span>");
      });
    },
    //================================================================================================
    toAutoUse($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) return;
      let defaultList =
        "*龙神试炼宝盒,*龙神试炼福袋,*龙神试炼锦囊,*龙辰礼包,*白银玉匣,*武林名望卡,*青木玉匣,*突破丹玉匣,*精致百宝箱,*江湖游历宝箱,*盂兰盛会福袋,*盂兰盛会锦囊,*暴击谜题百宝箱,*垂钓一夏百宝箱,*暴击谜题玉匣,*垂钓一夏玉匣,*龙神丹,*凰魄丹,药罐,地灵康复丸,薄暮幽影丹,风驰电掣散,碧波春水丹,无尽真元丸,玄冰寒露丸,金刚霸体丸";
      YFUI.showInput({
        title: "物品使用",
        text: `格式：物品词组<br>
                        物品词组：以英文逗号分割多个关键词, 只能单个使用的物品前面加*星号<br>
                        <span style="color:red;">例如：</span><br>
                        [例1] <span style="color:blue;">${defaultList}</span><br>
                        `,
        value: PLU.getCache("autoUseNames") || defaultList,
        type: "textarea",
        onOk(val) {
          if (!$.trim(val)) return;
          let str = $.trim(val);
          PLU.setCache("autoUseNames", str);
          let keysList = str.split(",");
          let itemsTimeOut = setTimeout(() => {
            UTIL.delSysListener("listItems_au");
          }, 5000);
          UTIL.addSysListener("listItems_au", function (b, type, subtype, msg) {
            if (type != "items") return;
            UTIL.delSysListener("listItems_au");
            clearTimeout(itemsTimeOut);
            clickButton("prev");
            let iId = 1,
              itemList = [];
            while (b.get("items" + iId)) {
              let it = UTIL.filterMsg(b.get("items" + iId)).split(",");
              if (!it[1]) continue;
              if (it && it.length > 4 && it[3] == "0") {
                if (keysList.includes(it[1]))
                  itemList.push({
                    key: it[0],
                    name: it[1],
                    num: Number(it[2]),
                    multi: true,
                  });
                else if (keysList.includes("*" + it[1]))
                  itemList.push({
                    key: it[0],
                    name: it[1],
                    num: Number(it[2]),
                    multi: false,
                  });
              }
              iId++;
            }
            PLU.loopAutoUse(itemList);
          });
          clickButton("items", 0);
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    //================================================================================================
    loopAutoUse(itemList) {
      if (itemList.length <= 0) {
        PLU.setBtnRed($("#btn_bt_autoUse"), 0);
        return YFUI.writeToOut("<span style='color:#F66;'>--无物件使用!--</span>");
      }
      let ac = [];
      itemList.forEach((it) => {
        let ct = it.num;
        while (ct > 0) {
          if (it.multi && ct >= 100) {
            ac.push("items use " + it.key + "_N_100");
            ct -= 100;
          } else if (it.multi && ct >= 50) {
            ac.push("items use " + it.key + "_N_50");
            ct -= 50;
          } else if (it.multi && ct >= 10) {
            ac.push("items use " + it.key + "_N_10");
            ct -= 10;
          } else {
            ac.push("items use " + it.key + "");
            ct -= 1;
          }
        }
      });
      PLU.fastExec(ac.join(";"), () => {
        PLU.setBtnRed($("#btn_bt_autoUse"), 0);
        YFUI.writeToOut("<span style='color:white;'>==使用完成!==</span>");
      });
    },
    //================================================================================================
    toLoopScript($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        $("#btn_bt_loopScript").text("循环执行");
        PLU.STO.loopScTo && clearTimeout(PLU.STO.loopScTo) && delete PLU.STO.loopScTo;
        return;
      }
      YFUI.showInput({
        title: "循环执行",
        text: `格式：循环次数@时间间隔|执行指令<br>
                        循环次数：省略则默认1次<br>
                        时间间隔：省略则默认5(5秒)<br>
                        执行指令：以分号分隔的指令<br>
                        <span style="color:red;">例如</span><br>
                        [例1] 3@5|jh 1;e;n;home;<br>
                        [例2] jh 5;n;n;n;w;sign7;
                        `,
        value: PLU.getCache("loopScript") || "home;",
        type: "textarea",
        onOk(val) {
          if (!$.trim(val)) return;
          let str = $.trim(val),
            scripts = "",
            times = 1,
            interval = 5,
            arr = str.split("|");
          if (arr.length > 1) {
            scripts = arr[1];
            if (arr[0].indexOf("@") >= 0) {
              times = Number(arr[0].split("@")[0]) || 1;
              interval = Number(arr[0].split("@")[1]) || 5;
            } else {
              times = Number(arr[0]) || 1;
            }
          } else {
            scripts = arr[0];
          }
          PLU.setCache("loopScript", str);
          PLU.loopScript(scripts, times, interval);
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    //================================================================================================
    loopScript(scripts, times, interval) {
      times--;
      $("#btn_bt_loopScript").text("停执行(" + times + ")");
      PLU.execActions(scripts, () => {
        if (times <= 0 || !PLU.ONOFF["btn_bt_loopScript"]) {
          PLU.setBtnRed($("#btn_bt_loopScript"), 0);
          $("#btn_bt_loopScript").text("循环执行");
          PLU.STO.loopScTo && clearTimeout(PLU.STO.loopScTo) && delete PLU.STO.loopScTo;
          return;
        } else {
          PLU.STO.loopScTo = setTimeout(() => {
            PLU.loopScript(scripts, times, interval);
          }, interval * 1000);
        }
      });
    },
    //================================================================================================
    toAutoAskQixia($btn, autoTime) {
      if (g_gmain.is_fighting) return;
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) return;
      $(".menu").hide();
      clickButton("open jhqx", 0);
      YFUI.showPop({
        title: "自动访问奇侠",
        text: "自动对话所有有亲密度的奇侠<br>请在做完20次赞助金锭后再进行<br><b style='color:#F00;'>是否现在进行?</b>",
        autoOk: autoTime ?? null,
        onOk() {
          let jhqxTimeOut = setTimeout(() => {
            UTIL.delSysListener("listQixia");
            PLU.setBtnRed($btn, 0);
          }, 5000);
          UTIL.addSysListener("listQixia", function (b, type, subtype, msg) {
            if (type != "show_html_page" || msg.indexOf("江湖奇侠成长信息") < 0) return;
            UTIL.delSysListener("listQixia");
            clearTimeout(jhqxTimeOut);
            let listHtml = msg;
            clickButton("prev");
            let str = "find_task_road qixia (\\d+)\x03(.{2,4})\x030\x03\\((\\d+)\\)(.{15,25}朱果)?.{30,50}(已出师|未出世)",
              //let str = "find_task_road qixia (\\d+)\x03(.{2,4})\x030\x03\\((\\d+)\\)(.{15,25}朱果?.{30,50}已出师)",
              rg1 = new RegExp(str, "g"),
              rg2 = new RegExp(str),
              visQxs = [];
            listHtml.match(rg1).forEach((e) => {
              let a = e.match(rg2);
              if (a)
                visQxs.push({
                  key: a[1],
                  name: a[2],
                  num: Number(a[3]),
                  link: "find_task_road qixia " + a[1],
                  fast: a[4] ? "open jhqx " + a[1] : null,
            });
            });
            visQxs = visQxs.sort((a, b) => {
              if (a.fast && b.num >= 25000) return -1;
              else return 2;
            });
            visQxs.reverse();
            PLU.toAskQixia(visQxs, 0);
          });
          clickButton("open jhqx", 0);
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    //================================================================================================
    toAskQixia(qxList, idx) {
      clickButton("home");
      if (idx >= qxList.length || !PLU.ONOFF["btn_bt_autoAskQixia"]) {
        PLU.setBtnRed($("#btn_bt_autoAskQixia"), 0);
        YFUI.writeToOut("<span style='color:#FFF;'>--奇侠访问结束!--</span>");
        YFUI.writeToOut("<span style='color:yellow;'> 今日一共获得玄铁令x" + PLU.TMP.todayGetXT + "</span>");
        UTIL.log({ msg: " 今日一共获得玄铁令x " + PLU.TMP.todayGetXT + "  ", type: "TIPS", time: new Date().getTime() });
        return;
      }
      let qxObj = qxList[idx];
      if (qxObj.fast) {
        clickButton(qxObj.fast, 0);
        setTimeout(() => {
          PLU.toAskQixia(qxList, idx + 1);
        }, 500);
      } else {
        PLU.execActions(qxObj.link + ";golook_room;", () => {
          let objNpc = UTIL.findRoomNpc(qxObj.name, false, true);
          if (objNpc) {
            PLU.execActions("ask " + objNpc.key + ";ask " + objNpc.key + ";ask " + objNpc.key + ";ask " + objNpc.key + ";ask " + objNpc.key + ";golook_room;", () => {
              setTimeout(() => {
                PLU.toAskQixia(qxList, idx + 1);
              }, 500);
            });
          } else {
            YFUI.writeToOut("<span style='color:#FFF;'>--找不到奇侠:" + qxObj.name + "--</span>");
            setTimeout(() => {
              PLU.toAskQixia(qxList, idx + 1);
            }, 500);
          }
        });
      }
    },
    //================================================================================================
    getQixiaList(callback) {
      let jhQixiaTimeOut = setTimeout(() => {
        UTIL.delSysListener("getlistQixia");
      }, 5000);
      UTIL.addSysListener("getlistQixia", function (b, type, subtype, msg) {
        if (type != "show_html_page" || msg.indexOf("江湖奇侠成长信息") < 0) return;
        UTIL.delSysListener("getlistQixia");
        clearTimeout(jhQixiaTimeOut);
        unsafeWindow.ttttt = msg;
        let listHtml = msg.replace(/\x03(0)?|href;0;|[\033|\27|\0x1b]\[[0-9|;]+m/gi, "");
        clickButton("prev");
        let str =
          "find_task_road qixia (\\d+)(.{2,4})(\\((\\d*)\\))?(open jhqx \\d+朱果)?<\\/td><td.{20,35}>(.{1,10})<\\/td><td.{20,35}>(.{1,15})<\\/td><td .{20,40}领悟(.{2,10})<\\/td><\\/tr>";
        let rg1 = new RegExp(str, "g"),
          rg2 = new RegExp(str),
          qxList = [];
        listHtml.match(rg1).forEach((e) => {
          let a = e.match(rg2);
          if (a)
            qxList.push({
              index: a[1],
              name: a[2],
              num: Number(a[4]) || 0,
              link: "find_task_road qixia " + a[1],
              fast: a[5] ? "open jhqx " + a[1] : null,
              inJh: a[6] && a[6].indexOf("未出世") < 0 ? true : false,
            });
        });
        callback && callback(qxList);
      });
      clickButton("open jhqx", 0);
    },
    //================================================================================================
    toAutoVisitQixia($btn) {
      if (g_gmain.is_fighting) return;
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        //$("#btn_bt_autoVisitQixia").text('亲近奇侠')
        PLU.TMP.autoQixiaMijing = false;
        return;
      }
      $(".menu").hide();
      clickButton("open jhqx", 0);
      YFUI.showInput({
        title: "奇侠秘境",
        text:
          `请输入要提升亲密度的游侠的姓名<br>
                        格式：金锭数量|游侠姓名@目标友好度<br>
                        金锭数量：给予1或5或15金锭，可省略则只对话<br>
                        游侠姓名：只能输入一个游侠姓名<br>
                        目标友好度：省略则以可学技能的友好度为目标<br>
                        <span style="color:red;">例如</span><br>
                        [例1] 15|风无痕 <span style="color:blue;">访问风无痕赠与15金锭</span><br>
                        [例2] 火云邪神 <span style="color:blue;">访问火云邪神对话</span><br>
                        [例2] 15|步惊鸿@30000 <span style="color:blue;">访问步惊鸿对话赠与15金锭到30000友好度</span><br>
                        ` +
          '<div style="text-align:right;"><label>自动挖宝:<input type="checkbox" id="if_auto_wb" name="awb" value="1"/></label><label>不要扫荡秘境:<input type="checkbox" id="if_auto_mj" name="noamj" value="1"/></label></div>',
        value: PLU.getCache("visitQixiaName") || "15|风无痕@4000000",
        onOk(val) {
          if (!$.trim(val)) return;
          let str = $.trim(val),
            arr = str.split("|"),
            giveNum = 15,
            qxName = "",
            objectFN = 0;
          let ifAutoMj = $("#if_auto_mj").is(":checked");
          let ifAutoWb = $("#if_auto_wb").is(":checked");
          if (arr.length > 1) {
            giveNum = Number(arr[0]) || 15;
            let nn = arr[1].split("@");
            qxName = nn[0].trim();
            if (nn.length > 1) objectFN = Number(nn[1]);
          } else {
            giveNum = 0;
            let nn = arr[0].split("@");
            qxName = nn[0].trim();
            if (nn.length > 1) objectFN = Number(nn[1]);
          }
          PLU.setCache("visitQixiaName", str);
          PLU.TMP.todayGetXT = 0;
          UTIL.delSysListener("listenVisitNotice");
          PLU.STO.listenVisit && clearTimeout(PLU.STO.listenVisit);
          PLU.TMP.goingQixiaMijing = false;
          PLU.tryVisitQixia(qxName, giveNum, objectFN, ifAutoMj, ifAutoWb, (err) => {
            if (err) {
              if (err.code == 1) {
                PLU.setBtnRed($btn, 0);
                UTIL.delSysListener("listenVisitNotice");
                PLU.toAutoAskQixia($("#btn_bt_autoAskQixia"), 10);
                YFUI.writeToOut("<span style='color:yellow;'> 今日一共获得玄铁令x" + PLU.TMP.todayGetXT + "</span>");
                UTIL.log({ msg: " 今日一共获得玄铁令x " + PLU.TMP.todayGetXT + "  ", type: "TIPS", time: new Date().getTime() });
              } else {
                YFUI.showPop({
                  title: "提示",
                  text: "<b style='color:#F00;'>" + err.msg + "</b>",
                  onOk() {
                    PLU.setBtnRed($btn, 0);
                    PLU.toAutoVisitQixia($btn);
                  },
                  onX() {
                    PLU.setBtnRed($btn, 0);
                  },
                });
              }
            }
          });
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
        onX() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    //================================================================================================
    tryVisitQixia(qxName, giveNum, objectFN, ifAutoMj, ifAutoWb, callback) {
      PLU.TMP.autoQixiaMijing = true;
      //发现
      PLU.getQixiaList((qxlist) => {
        let testDone = qxlist.find((e) => !!e.fast);
        if (testDone) {
          PLU.STO.listenVisit && clearTimeout(PLU.STO.listenVisit);
          callback && callback({ code: 1, msg: "今日奇侠友好度操作已经完毕" });
          return;
        }
        let qx = qxlist.find((e) => e.name == qxName);
        if (!qx) {
          callback && callback({ code: 2, msg: "没有这个奇侠!" });
          return;
        }
        if (!qx.inJh) {
          callback && callback({ code: 3, msg: "这个奇侠还没出师!" });
          return;
        }
        let objectFriendNum = objectFN ?? PLU.YFD.qixiaFriend.find((e) => e.name == qxName).skillFN;
        if (qx.num >= objectFriendNum) {
          callback && callback({ code: 4, msg: "奇侠友好度已足够" });
          return;
        }
        let listenVisitTimeout = function () {
          if (!PLU.TMP.goingQixiaMijing) PLU.tryVisitQixia(qxName, giveNum, objectFN, ifAutoMj, ifAutoWb, callback);
        };
        UTIL.delSysListener("listenVisitNotice");
        //监听场景消息
        UTIL.addSysListener("listenVisitNotice", function (b, type, subtype, msg) {
          if (type != "notice" && type != "main_msg") return;
          let msgTxt = UTIL.filterMsg(msg);
          if (msgTxt.match("对你悄声道：你现在去")) {
            //奇侠说秘境
            let l = msgTxt.match(/(.*)对你悄声道：你现在去(.*)，应当会有发现/);
            if (l && l.length > 2) {
              PLU.TMP.goingQixiaMijing = true;
              let placeData = PLU.YFD.mjList.find((e) => e.n == l[2]);
              if (placeData) {
                PLU.execActions(placeData.v + ";;find_task_road secret;;", () => {
                  setTimeout(() => {
                    let mapid = g_obj_map.get("msg_room").get("map_id");
                    let shortName = g_obj_map.get("msg_room").get("short");
                    YFUI.writeToOut("<span style='color:#FFF;'>--地图ID:" + mapid + "--</span>");
                    if (mapid == "public") {
                      PLU.execActions("secret_op1;", () => {
                        PLU.TMP.goingQixiaMijing = false;
                        PLU.tryVisitQixia(qxName, giveNum, objectFN, ifAutoMj, ifAutoWb, callback);
                      });
                    } else if (ifAutoMj) {
                      UTIL.delSysListener("listenVisitNotice");
                      PLU.setBtnRed($("#btn_bt_autoVisitQixia"), 0);
                      YFUI.writeToOut("<span style='color:yellow;'> ===== 进入了秘境! ===== </span>");
                    } else {
                      let ss = g_obj_map.get("msg_room").elements.find((e) => e.value == "仔细搜索");
                      if (ss) {
                        let cmd_ss = g_obj_map.get("msg_room").get(ss.key.split("_")[0]);
                        PLU.execActions(cmd_ss + ";;", () => {
                          if (ifAutoWb) {
                            let wb = g_obj_map.get("msg_room").elements.find((e) => e.value.indexOf("秘境挖宝") >= 0);
                            if (wb) {
                              PLU.execActions("mijing_wb;;");
                            }
                          }
                          let sd = g_obj_map.get("msg_room").elements.find((e) => e.value.indexOf("扫荡") >= 0);
                          if (sd) {
                            let cmd_sd = g_obj_map.get("msg_room").get(sd.key.split("_")[0]);
                            PLU.doSaoDang(mapid, cmd_sd, () => {
                              PLU.TMP.goingQixiaMijing = false;
                              PLU.tryVisitQixia(qxName, giveNum, objectFN, ifAutoMj, ifAutoWb, callback);
                            });
                          } else if (shortName == "无尽深渊") {
                            PLU.goWuJinShenYuan(() => {
                              PLU.TMP.goingQixiaMijing = false;
                              PLU.tryVisitQixia(qxName, giveNum, objectFN, ifAutoMj, ifAutoWb, callback);
                            });
                          } else {
                            UTIL.delSysListener("listenVisitNotice");
                            PLU.setBtnRed($("#btn_bt_autoVisitQixia"), 0);
                            YFUI.writeToOut("<span style='color:yellow;'> ===进入了未通关秘境!=== </span>");
                          }
                        });
                      }
                    }
                  }, 1500);
                });
              }
              return;
            }
          }
          let vis = msgTxt.match(/今日亲密度操作次数\((\d+)\/20\)/);
          if (vis) {
            PLU.STO.listenVisit && clearTimeout(PLU.STO.listenVisit);
            setTimeout(() => {
              if (!PLU.TMP.goingQixiaMijing) {
                PLU.STO.listenVisit = setTimeout(listenVisitTimeout, 4000);
                let objNpc = UTIL.findRoomNpc(qxName, false, true);
                if (objNpc) {
                  PLU.doVisitAction(objNpc.key, giveNum);
                } else {
                  YFUI.writeToOut("<span style='color:#FFF;'>--找不到奇侠!--</span>");
                  setTimeout(() => {
                    PLU.tryVisitQixia(qxName, giveNum, objectFN, ifAutoMj, ifAutoWb, callback);
                  }, 500);
                }
              }
            }, 500);
            return;
          }
          if (msgTxt.match("今日做了太多关于亲密度的操作")) {
            PLU.STO.listenVisit && clearTimeout(PLU.STO.listenVisit);
            callback && callback({ code: 1, msg: "今日奇侠友好度操作已经完毕" });
            return;
          }
          if (msgTxt.match(/今日奇侠赠送次数(\d+)\/(\d+)，.*赠送次数(\d+)\/(\d+)/)) {
            PLU.STO.listenVisit && clearTimeout(PLU.STO.listenVisit);
            callback && callback({ code: 1, msg: "今日奇侠友好度操作已经完毕" });
            return;
          }
          if (msgTxt.match("扫荡成功，获得：")) {
            let xtnum = parseInt(msgTxt.split("、")[0].split("玄铁令x")[1]);
            if (xtnum) PLU.TMP.todayGetXT += xtnum;
            xtnum && YFUI.writeToOut("<span>--玄铁令+" + xtnum + "--</span>");
            return;
          }
          if (msgTxt.match("你开始四处搜索……你找到了")) {
            let xtnum = parseInt(msgTxt.split("、")[0].split("玄铁令x")[1]);
            if (xtnum) PLU.TMP.todayGetXT += xtnum;
            xtnum && YFUI.writeToOut("<span>--玄铁令+" + xtnum + "--</span>");
            return;
          }
        });
        PLU.execActions(qx.link + ";;", () => {
          let objNpc = UTIL.findRoomNpc(qxName, false, true);
          if (objNpc) {
            PLU.STO.listenVisit = setTimeout(listenVisitTimeout, 3000);
            PLU.doVisitAction(objNpc.key, giveNum);
          } else {
            YFUI.writeToOut("<span style='color:#FFF;'>--找不到奇侠:" + qxName + "--</span>");
            setTimeout(() => {
              PLU.tryVisitQixia(qxName, giveNum, objectFN, ifAutoMj, ifAutoWb, callback);
            }, 500);
          }
        });
      });
    },
    //================================================================================================
    doVisitAction(qxKey, giveNum) {
      if (giveNum == 0) {
        PLU.execActions("ask " + qxKey + ";");
      } else if (giveNum == 1) {
        PLU.execActions("auto_zsjd_" + qxKey.split("_")[0] + ";");
      } else if (giveNum == 5) {
        PLU.execActions("auto_zsjd5_" + qxKey.split("_")[0] + ";");
      } else {
        PLU.execActions("auto_zsjd20_" + qxKey.split("_")[0] + ";");
      }
    },
    //================================================================================================
    doSaoDang(mapid, cmd, callback) {
      UTIL.addSysListener("listenVisitSaodang", function (b, type, subtype, msg) {
        if (type != "prompt") return;
        let xtnum = parseInt(msg.split("、")[0].split("玄铁令x")[1]);
        if (["yaowanggu", "leichishan"].includes(mapid)) {
          if (xtnum < 5)
            return setTimeout(() => {
              clickButton(cmd);
            }, 300);
        } else if (["liandanshi", "lianhuashanmai", "qiaoyinxiaocun", "duzhanglin", "shanya", "langhuanyudong", "dixiamigong"].includes(mapid)) {
          if (xtnum < 3)
            return setTimeout(() => {
              clickButton(cmd);
            }, 300);
        }
        UTIL.delSysListener("listenVisitSaodang");
        PLU.execActions(cmd + " go;", () => {
          callback && callback();
        });
      });
      setTimeout(() => {
        clickButton(cmd);
      }, 300);
    },
    //================================================================================================
    goWuJinShenYuan(endcallback) {
      //无尽深渊
      let paths = "e;e;s;w;w;s;s;e;n;e;s;e;e;n;w;n;e;n;w".split(";");
      var sidx = 0;
      let gostep = function (pathArray, stepFunc) {
        let ca = pathArray[sidx];
        PLU.execActions(ca + "", () => {
          stepFunc && stepFunc();
          sidx++;
          if (sidx >= pathArray.length) {
            endcallback && endcallback();
          } else {
            setTimeout(() => {
              gostep(pathArray, stepFunc);
            }, 250);
          }
        });
      };
      gostep(paths, () => {
        let fc = g_obj_map.get("msg_room").elements.find((e) => e.value == "翻查");
        if (fc) {
          let cmd_fc = g_obj_map.get("msg_room").get(fc.key.split("_")[0]);
          PLU.execActions(cmd_fc + "");
        }
      });
    },
    //================================================================================================
    toWaitCDKill($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        //$("#btn_bt_waitCDKill").text('')
        return;
      }
      clickButton("golook_room");
      YFUI.showPop({
        title: "倒计时叫杀门派纷争",
        text: "倒计时最后5秒叫杀最近结束时间的门派纷争!，确定后单击NPC<br>",
        onOk() {
          setTimeout((o) => {
            $(document).one("click", (o) => {
              let npcbtn = $(o.target).closest("button");
              let snpc = npcbtn[0].outerHTML.match(/clickButton\('look_npc (\w+)'/i);
              if (snpc && snpc.length >= 2) {
                let nowTime = new Date().getTime(),
                  cMPFZ = null;
                for (let k in PLU.MPFZ) {
                  if (!cMPFZ || cMPFZ.t > PLU.MPFZ[k].t) cMPFZ = PLU.MPFZ[k];
                }
                if (cMPFZ) {
                  PLU.TMP.DATA_MPFZ = Object.assign({}, cMPFZ, {
                    killId: snpc[1],
                  });
                  YFUI.showPop({
                    title: "倒计时叫杀门派纷争",
                    text:
                      '<div style="line-height:2;">人物：' +
                      npcbtn.text() +
                      "<br>地点：" +
                      PLU.TMP.DATA_MPFZ.p +
                      "<br>对决：" +
                      PLU.mp2icon(PLU.TMP.DATA_MPFZ.v) +
                      "</div>",
                    okText: "好的",
                    onOk() { },
                    onNo() {
                      PLU.TMP.DATA_MPFZ = null;
                      PLU.setBtnRed($btn, 0);
                    },
                  });
                }
              } else {
                PLU.TMP.DATA_MPFZ = null;
                PLU.setBtnRed($btn, 0);
              }
            });
          }, 500);
        },
        onNo() {
          PLU.TMP.DATA_MPFZ = null;
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    //================================================================================================
    mp2icon(mplist) {
      let htm = "",
        zfarr = mplist.split(" VS "),
        zarr = zfarr[0].split("、"),
        farr = zfarr[1].split("、");
      zarr.forEach((zm) => {
        htm += '<span style="display:inline-block;background:#F66;border-radius:2px;padding:0 2px;margin:1px;color:#FFF;">' + zm + "</span>";
      });
      htm += '<span style="color:#FFF;background:#F00;font-weight:bold;border-radius:50%;padding:2px;">VS</span>';
      farr.forEach((fm) => {
        htm += '<span style="display:inline-block;background:#66F;border-radius:2px;padding:0 2px;margin:1px;color:#FFF;">' + fm + "</span>";
      });
      return htm;
    },
    //================================================================================================
    toCheckAndWaitCDKill(nowTime) {
      let k = PLU.TMP.DATA_MPFZ.t + 1560000;
      let dt = Math.floor((k - nowTime) / 1000);
      if (dt == 5) {
        YFUI.writeToOut("<span style='color:#F99;'>--最后5秒,进入战斗!--</span>");
        //PLU.TMP.DATA_MPFZ = null
        //PLU.setBtnRed($btn,0)
        PLU.autoFight({
          targetKey: PLU.TMP.DATA_MPFZ.killId,
          fightKind: "kill",
          onFail() {
            PLU.TMP.DATA_MPFZ = null;
            PLU.setBtnRed($("#btn_bt_waitCDKill"), 0);
            setTimeout((t) => {
              PLU.autoChushi();
            }, 500);
          },
          onEnd() {
            PLU.TMP.DATA_MPFZ = null;
            PLU.setBtnRed($("#btn_bt_waitCDKill"), 0);
            setTimeout((t) => {
              PLU.autoChushi();
            }, 500);
          },
        });
      }
    },
    //================================================================================================
    setListen($btn, listenKey, stat) {
      let btnFlag = 0;
      if (stat != undefined) {
        btnFlag = PLU.setBtnRed($btn, stat);
        PLU.setCache(listenKey, stat);
        return;
      } else {
        btnFlag = PLU.setBtnRed($btn);
      }
      if (!btnFlag) {
        PLU.setCache(listenKey, 0);
        return;
      }
      if (listenKey == "listenQL") {
        //监听青龙
        YFUI.showInput({
          title: "监听本服青龙",
          text: `格式：击杀类型|物品词组<br>
                            击杀类型：0杀守方(好人)，1杀攻方(坏人)。<br>
                            物品词组：以英文逗号分割多个关键词<br>
                            <span style="color:red;">例如：</span><br>
                            [例1] <span style="color:blue;">0|斩龙,斩龙宝镯,碎片</span><br>
                            [例2] <span style="color:blue;">1|*</span>;
                            `,
          value: PLU.getCache(listenKey + "_keys") || "0|斩龙,开天宝棍,天罡掌套,龙皮至尊甲衣",
          type: "textarea",
          onOk(val) {
            let str = $.trim(val);
            if (!str || str.indexOf("|") < 0) return PLU.setBtnRed($btn, 0);
            PLU.setCache(listenKey + "_keys", str);
            PLU.setCache(listenKey, 1);
          },
          onNo() {
            PLU.setCache(listenKey, 0);
            PLU.setBtnRed($btn, 0);
          },
        });
      } else if (listenKey == "listenTF") {
        //监听夜魔
        YFUI.showInput({
          title: "监听逃犯",
          text: `格式：击杀类型|逃犯词组<br>
                            击杀类型：0杀守方(逃犯)，1杀攻方(捕快)。<br>
                            逃犯词组：以英文逗号分割多个关键词<br>
                            <span style="color:#F00;">【新人】以#开头则等候他人开杀再进</span><br>
                            <span style="color:#933;">例如：</span><br>
                            [例1] <span style="color:blue;">0|夜魔*段老大,#夜魔*流寇</span>
                            `,
          value: PLU.getCache(listenKey + "_keys") || "0|夜魔*段老大,夜魔*二娘,#夜魔*岳老三,#夜魔*云老四,#夜魔*流寇,#夜魔*恶棍,#夜魔*剧盗",
          type: "textarea",
          onOk(val) {
            let str = $.trim(val);
            if (!str || str.indexOf("|") < 0) return PLU.setBtnRed($btn, 0);
            PLU.setCache(listenKey + "_keys", str);
            PLU.setCache(listenKey, 1);
            PLU.splitTFParam();
          },
          onNo() {
            PLU.setCache(listenKey, 0);
            PLU.setBtnRed($btn, 0);
          },
        });
      } else if (listenKey == "listenKFQL") {
        //监听跨服青龙
        YFUI.showInput({
          title: "监听跨服青龙",
          text: `格式：击杀类型|物品词组<br>
                            击杀类型：0杀守方(好人)，1杀攻方(坏人)。<br>
                            物品词组：以英文逗号分割多个关键词<br>
                            <span style="color:red;">例如：</span><br>
                            [例1] <span style="color:blue;">0|斩龙,斩龙宝镯,碎片</span><br>
                            [例2] <span style="color:blue;">1|*</span>;
                            `,
          value: PLU.getCache(listenKey + "_keys") || "1|斩龙,开天宝棍,天罡掌套,龙皮至尊甲衣",
          type: "textarea",
          onOk(val) {
            let str = $.trim(val);
            if (!str || str.indexOf("|") < 0) return PLU.setBtnRed($btn, 0);
            PLU.setCache(listenKey + "_keys", str);
            PLU.setCache(listenKey, 1);
          },
          onNo() {
            PLU.setCache(listenKey, 0);
            PLU.setBtnRed($btn, 0);
          },
        });
      } else if (listenKey == "listenYX") {
        //监听游侠
        YFUI.showInput({
          title: "监听游侠",
          text: `格式：游侠词组<br>
                游侠词组：以英文逗号分割多个关键词<br>
                <span style="color:red;">例如：</span><br>
                 [例1] <span style="color:blue;">王语嫣,厉工,金轮法王,虚夜月,云梦璃,叶孤城</span><br>
                `,
          value: PLU.getCache(listenKey + "_keys") || [].concat(...PLU.YFD.youxiaList.map((e) => e.v)).join(","),
          type: "textarea",
          onOk(val) {
            let str = $.trim(val);
            if (!str) return PLU.setBtnRed($btn, 0);
            PLU.setCache(listenKey + "_keys", str);
            PLU.setCache(listenKey, 1);
          },
          onNo() {
            PLU.setCache(listenKey, 0);
            PLU.setBtnRed($btn, 0);
          },
        });
      } else if (listenKey == "autoTP") {
        //监听突破
        YFUI.showInput({
          title: "持续突破",
          text: `请输入需要自动突破的技能，以英文逗号分割，自动突破将在当前全部突破完后才开始。<br>
                以1|开头使用金刚舍利加速<br>
                 以2|开头使用通天丸加速<br>
                 以3|开头使用突破宝典加速<br>
                 以4|开头使用三生石加速(未开发)<br>
                 <span style="color:red;">例如：</span><br>
                 [例1] <span style="color:blue;">千影百伤棍,1|排云掌法,2|无相金刚掌,3|降龙十八掌,独孤九剑</span>
                 `,
          value: PLU.getCache(listenKey + "_keys") || "1|千影百伤棍,1|排云掌法,1|不动明王诀",
          type: "textarea",
          onOk(val) {
            let str = $.trim(val);
            if (!str) return PLU.setBtnRed($btn, 0);
            PLU.setCache(listenKey + "_keys", str);
            PLU.setCache(listenKey, 1);
            PLU.getSkillsList((allSkills, tupoSkills) => {
              if (tupoSkills.length == 0) {
                PLU.toToPo();
              }
            });
          },
          onNo() {
            PLU.setCache(listenKey, 0);
            PLU.setBtnRed($btn, 0);
          },
        });
      } else if (listenKey == "autoDY") {
        //监听钓鱼
        let yuanbao = g_obj_map.get("msg_attrs") && g_obj_map.get("msg_attrs").get("yuanbao");
        //let targetYuanbao = yuanbao ? Math.floor(yuanbao * 0.9) : 4000000; // 将元宝数量减少10%
        let yuanbaoStr = Math.floor(yuanbao).toString(); // 将元宝数量转换为字符串
        let deductedYuanbao = yuanbaoStr.length >= 5 ? Number(yuanbaoStr.slice(-5)) : 0; // 取后5位数作为扣除的元宝数量
        let targetYuanbao = yuanbao - deductedYuanbao; // 计算保留的元宝数量
        YFUI.writeToOut(`<span style='color:#7FFF00;'>当前元宝数量: ${yuanbao || '未知'}</span>`);
        YFUI.showInput({
          title: "持续钓鱼",
          text: "请输入需要保留的元宝数，默认为保留元宝后五位",
          value: targetYuanbao, // 默认值为元宝数量减去扣除的元宝数量
          onOk(val) {
            let num = Number($.trim(val));
            PLU.setCache(listenKey + "_key", num);
            PLU.setCache(listenKey, 1);
            let room = g_obj_map.get("msg_room");
            if (room) room = room.get("short");
            if (room != "桃溪" || UTIL.inHome()) {
              let path = ["rank go 233;#6 s", "sw;se", "sw", "se", "s", "s"];
              // 人满是啥提示...，不知道...（那就随机选位置吧（
              PLU.execActions(path.slice(0, Math.floor(Math.random() * 6) + 1).join(";") + ";diaoyu");
            }
          },
          onNo() {
            PLU.setCache(listenKey, 0);
            PLU.setBtnRed($btn, 0);
          },
        });
      } else if (listenKey == "autoConnect") {
        YFUI.showInput({
          title: "自动重连",
          text: `请输入断线后自动重连的时间，重连方式为到时间自动刷新页面。<br>单位为秒，0代表不自动重连。<br>
                <span style="color:red;">例如：</span><br>
               [例1] <span style="color:blue;">60</span> 代表60秒后刷新页面
                            `,
          value: PLU.getCache(listenKey + "_keys") || "0",
          //type:"textarea",
          onOk(val) {
            let v = Number(val);
            if (val == "") return PLU.setBtnRed($btn, 0);
            PLU.setCache(listenKey + "_keys", v);
            PLU.setCache(listenKey, 1);
          },
          onNo() {
            PLU.setCache(listenKey, 0);
            PLU.setBtnRed($btn, 0);
          },
        });
      } else if (listenKey == "autoSignIn") {
        //YFUI.showPop(
        YFUI.showPop({
          title: "定时一键签到",
          text: `请输入自动签到的时间。<br>
                <div><span style="font-size:18px;line-height:2;">每日: </span><input id="autoSignInTime" type="time" style="font-size:20px;border-radius:5px;margin:10px 0"/></div>
                        `,
          onOk() {
            let v = $.trim($("#autoSignInTime").val());
            if (v == "") return PLU.setBtnRed($btn, 0);
            PLU.setCache(listenKey, 1);
          },
          onNo() {
            PLU.setCache(listenKey, 0);
            PLU.setBtnRed($btn, 0);
          },
        });
      } else if (listenKey == "autoQuitTeam") {
        //进塔离队
        YFUI.showPop({
          title: "进塔自动离队",
          text: `是否进塔自动离队?<br>`,
          onOk() {
            PLU.setCache(listenKey, 1);
          },
          onNo() {
            PLU.setCache(listenKey, 0);
            PLU.setBtnRed($btn, 0);
          },
        });
      } else {
        PLU.setCache(listenKey, 1);
        return;
      }
    },
    //================================================================================================
    //================================================================================================
    splitTFParam() {
      let ltl = (PLU.getCache("listenTF_keys").split("|")[1] || "").split(",");
      PLU.TMP.lis_TF_list = [];
      PLU.TMP.lis_TF_force = [];
      ltl.map((e, i) => {
        if (e.charAt(0) == "#") {
          PLU.TMP.lis_TF_list.push(e.substring(1));
          PLU.TMP.lis_TF_force.push(0);
        } else {
          PLU.TMP.lis_TF_list.push(e);
          PLU.TMP.lis_TF_force.push(1);
        }
      });
    },
    //================================================================================================
    goQinglong(npcName, place, gb, kf) {
      let placeData = PLU.YFD.qlList.find((e) => e.n == place);
      if (kf || (UTIL.inHome() && placeData)) {
        PLU.execActions(placeData.v + ";golook_room", () => {
          let objNpc = UTIL.findRoomNpc(npcName, !Number(gb));
          if (objNpc) {
            PLU.killQinglong(objNpc.key, 0);
          } else {
            YFUI.writeToOut("<span style='color:#FFF;'>--寻找目标失败!--</span>");
            PLU.execActions("golook_room;home");
          }
        });
      }
    },
    //================================================================================================
    killQinglong(npcId, tryNum) {
      PLU.autoFight({
        targetKey: npcId,
        fightKind: "kill",
        autoSkill: "random",
        onFail(errCode) {
          if (errCode >= 88 && tryNum < 100) {
            setTimeout(() => {
              PLU.killQinglong(npcId, tryNum + 1);
            }, 250);
            return;
          }
          YFUI.writeToOut("<span style='color:#FFF;'>--抢青龙失败!--</span>");
          PLU.execActions("home;");
        },
        onEnd() {
          PLU.execActions("prev_combat;home;");
        },
      });
    },
    //================================================================================================
    goTaofan(npcName, npcPlace, flyLink, gb, force) {
      if (UTIL.inHome()) {
        let ctn = 0,
          gocmd = flyLink;
        PLU.YFD.cityList.forEach((e, i) => {
          if (e == npcPlace) ctn = i + 1;
        });
        if (ctn > 0) gocmd = "jh " + ctn;
        PLU.execActions(gocmd + ";golook_room;", (e) => {
          setTimeout((t) => {
            PLU.killTaofan(npcName, -Number(gb), force, 0);
          }, 1000);
        });
      }
    },
    //================================================================================================
    killTaofan(npcName, gb, force, tryCount) {
      console.debug(gb);
      let npcObj = UTIL.findRoomNpc(npcName, gb);
      if (npcObj) {
        if (force) {
          PLU.autoFight({
            targetKey: npcObj.key,
            fightKind: "kill",
            autoSkill: "random",
            onFail(errCode) {
              if (errCode == 4) {
                YFUI.writeToOut("<span style='color:#FFF;'>--已达到上限!取消逃犯监听!--</span>");
                PLU.setListen($("#btn_bt_listenTF"), "listenTF", 0);
              } else if (errCode > 1 && tryCount < 36) {
                setTimeout(() => {
                  PLU.killTaofan(npcName, gb, force, tryCount + 1);
                }, 500);
                return;
              }
              PLU.execActions("golook_room;home;");
            },
            onEnd() {
              PLU.execActions("prev_combat;home;");
            },
          });
        } else {
          PLU.waitDaLaoKill({
            targetId: npcObj.key,
            onFail(ec) {},
            onOk() {
              PLU.autoFight({
                targetKey: npcObj.key,
                fightKind: "kill",
                autoSkill: "random",
                onFail(errCode) {
                  if (errCode == 4) {
                    YFUI.writeToOut("<span style='color:#FFF;'>--已达到上限!取消逃犯监听--</span>");
                    PLU.setListen($("#btn_bt_listenTF"), "listenTF", 0);
                  } else YFUI.writeToOut("<span style='color:#FFF;'>--'ERR=" + errCode + "--</span>");
                  PLU.execActions("golook_room;home;");
                },
                onEnd() {
                  PLU.execActions("prev_combat;home;");
                },
              });
            },
          });
        }
      } else {
        YFUI.writeToOut("<span style='color:#FFF;'>--找不到NPC!--</span>");
        if (tryCount < 4) {
          return setTimeout(() => {
            PLU.killTaofan(npcName, gb, force, tryCount + 1);
          }, 500);
        }
        PLU.execActions("golook_room;home;");
      }
    },
    //================================================================================================
    waitDaLaoKill({ targetId, onOk, onFail }) {
      let tryTimes = 0;
      UTIL.addSysListener("lookNpcWait", function (b, type, subtype, msg) {
        if (type == "notice" && subtype == "notify_fail" && msg.indexOf("没有这个人") >= 0) {
          YFUI.writeToOut("<span style='color:#FFF;'>--目标已丢失!--</span>");
          UTIL.delSysListener("lookNpcWait");
          return onFail && onFail(1);
        }
        if (type == "look_npc") {
          let desc = UTIL.filterMsg(b.get("long"));
          let lookInfo = desc.match(/[他|她]正与 (\S*)([\S\s]*) 激烈争斗中/);
          if (lookInfo && lookInfo.length > 2 && $.trim(lookInfo[2]) != "") {
            YFUI.writeToOut("<span style='color:#9F9;'>--目标已被大佬攻击,可以跟进--</span>");
            UTIL.delSysListener("lookNpcWait");
            return onOk && onOk();
          }
          tryTimes++;
          if (tryTimes > 30) {
            UTIL.delSysListener("lookNpcWait");
            return onFail && onFail(30);
          } else {
            setTimeout(() => {
              clickButton("look_npc " + targetId);
            }, 500);
          }
        }
        //如提前进入战斗可能是因为杀气, 逃跑后继续
      /*  if (type == "vs" && subtype == "vs_info" && b.get("vs2_pos1") != targetId) {
          PLU.autoEscape({
            onEnd() {
              setTimeout(() => {
                clickButton("look_npc " + targetId);
              }, 500);
            },
          });
        }*/
      });
      clickButton("look_npc " + targetId);
    },
    //================================================================================================
    //================================================================================================
    fixJhName(name) {
      switch (name) {
        case "白驼山":
          return "白驮山";
        case "黑木崖":
          return "魔教";
        case "光明顶":
          return "明教";
        case "铁血大旗门":
          return "大旗门";
        case "梅庄":
          return "寒梅庄";
      }
      return name;
    },
    //================================================================================================
    goFindYouxia(params) {
      //{paths,idx,objectNPC}
      if (params.idx >= params.paths.length) {
        setTimeout(() => {
          PLU.execActions("home");
        }, 500);
        YFUI.writeToOut("<span style='color:#FFF;'>--找不到游侠!...已搜索完地图--</span>");
        return;
      }
      let acs = [params.paths[params.idx]];
      PLU.actions({
        paths: acs,
        idx: 0,
        onPathsEnd() {
          setTimeout(() => {
            let npcObj = UTIL.findRoomNpc(params.objectNPC, false, true);
            if (npcObj) {
              YFUI.writeToOut("<span style='color:#FFF;'>--游侠已找到--</span>");
              PLU.killYouXia(npcObj.key, 0);
            } else {
              params.idx++;
              PLU.goFindYouxia(params);
            }
          }, 300);
        },
        onPathsFail() {
          setTimeout(() => {
            PLU.execActions("home");
          }, 500);
          YFUI.writeToOut("<span style='color:#FFF;'>--找不到游侠!...路径中断--</span>");
          return;
        },
      });
    },
    //================================================================================================
    killYouXia(npcId, tryNum) {
      PLU.autoFight({
        targetKey: npcId,
        fightKind: "kill",
        autoSkill: "multi",
        onFail(errCode) {
          if (String(errCode).indexOf("delay_") >= 0) {
            let mc = String(errCode).match(/delay_(\d+)/);
            if (mc) {
              let wtime = 500 + 1000 * Number(mc[1]);
              PLU.execActions("follow_play " + npcId + ";");
              YFUI.writeToOut("<span style='color:#FFF;'>▶开始尝试做游侠跟班!!</span>");
              setTimeout(() => {
                PLU.execActions("follow_play none", () => {
                  YFUI.writeToOut("<span style='color:#FFF;'>◼停止做游侠跟班!!准备开杀!!</span>");
                  PLU.killYouXia(npcId, tryNum + 1);
                });
              }, wtime);
              return;
            }
          } else if (errCode >= 88 && tryNum < 44) {
            setTimeout(() => {
              PLU.killYouXia(npcId, tryNum + 1);
            }, 1000);
            return;
          } else if (errCode == 1) {
            YFUI.writeToOut("<span style='color:#F99;'>--现场找不到游侠了!--</span>");
          } else {
            YFUI.writeToOut("<span style='color:#F99;'>--攻击游侠失败!--</span>");
          }
          PLU.execActions("home;");
        },
        onEnd() {
          PLU.execActions("prev_combat;home;");
        },
      });
    },
    //================================================================================================
    getSkillsList(callback) {
      UTIL.addSysListener("getSkillsList", function (b, type, subtype, msg) {
        if (type != "skills" && subtype != "list") return;
        UTIL.delSysListener("getSkillsList");
        clickButton("prev");
        let all = [],
          tupo = [];
        all = PLU.parseSkills(b);
        all.forEach((skill) => {
          if (skill.state >= 4) {
            tupo.push(skill);
          }
        });
        callback(all, tupo);
      });
      clickButton("skills");
    },
    //================================================================================================
    parseSkills(b) {
      let allSkills = [];
      for (var i = b.elements.length - 1; i > -1; i--) {
        if (b.elements[i].key && b.elements[i].key.match(/skill(\d+)/)) {
          var attr = b.elements[i].value.split(",");
          var skill = {
            key: attr[0],
            name: $.trim(UTIL.filterMsg(attr[1])),
            level: Number(attr[2]),
            kind: attr[4],
            prepare: Number(attr[5]),
            state: Number(attr[6]),
            from: attr[7],
          };
          allSkills.push(skill);
        }
      }
      allSkills = allSkills.sort((a, b) => {
        if (a.kind == "known") return -1;
        else if (b.kind != "known" && a.from == "基础武功") return -1;
        else if (b.kind != "known" && b.from != "基础武功" && a.kind == "force") return -1;
        else return 1;
      });
      return allSkills;
    },
    //================================================================================================
    toToPo() {
      setTimeout(function () {
        if (UTIL.inHome()) {
          PLU.getSkillsList((allSkills, tupoSkills) => {
            if (tupoSkills.length > 0) {
              if (PLU.STO.outSkillList) clearTimeout(PLU.STO.outSkillList);
              PLU.STO.outSkillList = setTimeout(() => {
                PLU.STO.outSkillList = null;
                if (!!$("#out_top").height() && $("#out_top .outtitle").text() == "我的技能") clickButton("home");
              }, 200);
              return;
            }
            let tpArr = PLU.getCache("autoTP_keys").split(",");
            let tpList = [];
            tpArr.forEach((s) => {
              let sk = {};
              let cs = s.match(/((\d)\|)?(.*)/);
              if (cs) {
                sk.name = cs[3];
                sk.sp = Number(cs[2]);
              } else {
                sk.name = s;
                sk.sp = 0;
              }
              let skobj = allSkills.find((e) => e.name.match(sk.name));
              if (skobj) tpList.push(Object.assign({}, skobj, sk));
            });
            PLU.TMP.stopToPo = false;
            PLU.toPo(tpList, 0);
          });
        }
      }, 500);
    },
    //================================================================================================
    toPo(tpList, skIdx) {
      if (skIdx < tpList.length && !PLU.TMP.stopToPo) {
        let acts = "enable " + tpList[skIdx].key + ";tupo go," + tpList[skIdx].key + ";";
        if (tpList[skIdx].sp == 1) acts += "tupo_speedup4_1 " + tpList[skIdx].key + " go;";
        else if (tpList[skIdx].sp == 2) acts += "tupo_speedup3_1 " + tpList[skIdx].key + " go;";
        else if (tpList[skIdx].sp == 3) acts += "tupo_up " + tpList[skIdx].key + " go;";
        else if (tpList[skIdx].sp == 4) acts += "items info obj_sanshengshi;event_1_66830905 " + tpList[skIdx].key + " go;";
        PLU.execActions(acts, () => {
          setTimeout(() => {
            if (PLU.STO.outSkillList) clearTimeout(PLU.STO.outSkillList);
            PLU.STO.outSkillList = null;
            PLU.toPo(tpList, skIdx + 1);
          }, 300);
        });
      } else {
        YFUI.writeToOut("<span style='color:yellow;'> ==突破完毕!== </span>");
        clickButton("home");
      }
    },
    //================================================================================================
    toBangFour(n) {
      UTIL.log({ msg: " 进入帮四(" + n + ") ", type: "TIPS", time: new Date().getTime() });
      PLU.STO.bangFourTo && clearTimeout(PLU.STO.bangFourTo);
      PLU.STO.bangFourTo = setTimeout(function () {
        clickButton("home");
      }, 30 * 60 * 1000);
      clickButton("clan fb enter shiyueweiqiang-" + n, 0);
    },
    toBangSix() {
      UTIL.log({ msg: " 进入帮六 ", type: "TIPS", time: new Date().getTime() });
      PLU.STO.bangSixTo && clearTimeout(PLU.STO.bangSixTo);
      PLU.STO.bangSixTo = setTimeout(function () {
        clickButton("home");
      }, 30 * 60 * 1000);
      clickButton("clan fb enter manhuanqishenzhai", 0);
    },
    //================================================================================================
    inBangFiveEvent() {
      PLU.toggleFollowKill($("#btn_bt_kg_followKill"), "followKill", 1);
      var moving = false;
      PLU.TMP.listenBangFive = true;
      UTIL.addSysListener("listenBangFive", function (b, type, subtype, msg) {
        if (!moving && type == "jh" && (subtype == "dest_npc" || subtype == "info")) {
          moving = true;
          let roomName = UTIL.filterMsg(g_obj_map.get("msg_room").get("short"));
          if (roomName.match(/蒙古高原|成吉思汗的金帐/) && !UTIL.roomHasNpc()) {
            PLU.execActions(";;n;", () => {
              moving = false;
            });
          } else {
            moving = false;
          }
        }
        if (type == "home" && subtype == "index") {
          UTIL.delSysListener("listenBangFive");
          YFUI.writeToOut("<span style='color:white;'> ==帮五完毕!== </span>");
          PLU.execActions("golook_room;home");
        }
      });
    },
    intervene($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        UTIL.delSysListener("intervene");
        UTIL.delSysListener("score");
        return;
      }
      let Fight = function (b, num) {
        PLU.autoFight({
          targetKey: b.get("vs2_pos" + num),
          fightKind: "fight",
          onEnd() {
            UTIL.delSysListener("intervene");
            UTIL.delSysListener("score");
            PLU.setBtnRed($btn);
          },
          onFail() {
            PLU.autoFight({
              targetKey: b.get("vs2_pos" + num),
              onEnd() {
                UTIL.delSysListener("intervene");
                UTIL.delSysListener("score");
                PLU.setBtnRed($btn);
              },
              onFail() {
                if (num <= 7) {
                  Fight(++num);
                } else {
                  UTIL.delSysListener("intervene");
                  UTIL.delSysListener("score");
                }
              },
            });
          },
        });
      };
      UTIL.addSysListener("intervene", (b, type, subtype, msg) => {
        if (type == "vs" && subtype == "vs_info") {
          UTIL.delSysListener("intervene");
          UTIL.delSysListener("score");
          Fight(b, 1);
        }
      });
      UTIL.addSysListener("score", (b, type, subtype, msg) => {
        if (type == "score" && subtype == "user") {
          if (b.get("long").indexOf("激烈争斗中...") == -1) {
            PLU.execActions("score " + b.get("id"));
            return;
          }
          UTIL.delSysListener("score");
          PLU.execActions("watch_vs " + b.get("id"));
        }
      });
      YFUI.showPop({
        title: "杀隐藏怪",
        text: "自动观战，自动加入战斗<br>确认后，点开要跟的玩家页面",
        onNo() {
          UTIL.delSysListener("intervene");
          UTIL.delSysListener("score");
          PLU.setBtnRed($btn);
        },
      });
    },
    // 字符串相似度算法
    getSimilarity(str1, str2) {
      let sameNum = 0;
      for (let i = 0; i < str1.length; i++)
        for (let j = 0; j < str2.length; j++)
          if (str1[i] === str2[j]) {
            sameNum++;
            break;
          }
      let length = Math.max(str1.length, str2.length);
      return (sameNum / length) * 100 || 0;
    },
    npcDataUpdate() {
      var wayList = [...new Set(PLU.YFD.mapsLib.Npc.map((e) => e.way))];
      if (PLU.YFD.mapsLib.Npc_New[PLU.YFD.mapsLib.Npc_New.length - 1]) var i = wayList.indexOf(PLU.YFD.mapsLib.Npc_New[PLU.YFD.mapsLib.Npc_New.length - 1].way);
      else var i = 0;
      PLU.UTIL.addSysListener("look_npc", (b, type, subtype, msg) => {
        if (type != "look_npc") return;
        if (b.get("id").indexOf("bad_target_") == 0) return;
        if (b.get("id").indexOf("hero_") == 0) return;
        if (b.get("id").indexOf("eren_") == 0) return;
        if (b.get("id").indexOf("bukuai") == 0) return;
        if (PLU.YFD.qixiaList.includes(ansi_up.ansi_to_text(b.get("name")))) return;
        let roomInfo = g_obj_map.get("msg_room");
        let jh = PLU.YFD.cityId[roomInfo.get("map_id")] ?? roomInfo.get("map_id");
        let curName = UTIL.filterMsg(roomInfo.get("short") || "");
        PLU.YFD.mapsLib.Npc_New.push({
          jh: jh,
          loc: curName,
          name_new: ansi_up.ansi_to_text(b.get("name")),
          id: b.get("id") || "",
          desc: ansi_up.ansi_to_text(b.get("long")?.split("\n")[1]),
          way: wayList[i],
        });
      });
      func = () => {
        PLU.execActions(wayList[i], () => {
          for (var npc of PLU.UTIL.getRoomAllNpc()) PLU.execActions("look_npc " + npc.key);
          setTimeout(() => {
            i++;
            func();
          }, 1500);
        });
      };
      func();
    },
    //================================================================================================
    checkUseSkills() {
      let curTime = new Date().getTime();
      if (!PLU.battleData.performTime || curTime - PLU.battleData.performTime >= 400) {
        PLU.battleData.performTime = curTime;
        if (!PLU.battleData.mySide) {
          let vsInfo = g_obj_map.get("msg_vs_info");
          for (let i = vsInfo.elements.length - 1; i > -1; i--) {
            let val = vsInfo.elements[i].value + "";
            if (!val || val.indexOf(PLU.accId) < 0) continue;
            PLU.battleData.myPos = vsInfo.elements[i].key.charAt(7);
            PLU.battleData.mySide = vsInfo.elements[i].key.substring(0, 3);
            break;
          }
        }
        if (PLU.battleData.mySide) {
          if (PLU.getCache("autoCure") == 1) {
            PLU.checkAutoCure();
          }
          if (PLU.getCache("autoPerform") >= 1) {
            PLU.checkAutoPerform();
          }
        }
      }
    },
    //================================================================================================
    setAutoCure($btn, listenKey, stat) {
      if (listenKey == "autoCure") {
        //自动加血蓝
        YFUI.showInput({
          title: "自动加血加蓝",
          text: `格式：血百分比|加血技能,蓝百分比|加蓝技能，以英文逗号分割，每样只能设置一个技能。<br>
                <span style="color:red;">例如：</span><br>
                [例1] <span style="color:blue;">50|道种心魔经,10|不动明王诀</span><br> 血低于50%自动加血,蓝低于10%自动加蓝<br>
                [例2] <span style="color:blue;">50|白首太玄经,30|紫血大法</span><br> 血低于50%自动加血,蓝低于30%自动加蓝<br>
                [例3] <span style="color:blue;">30|紫血大法</span><br> 血低于30%自动加血技能,不自动加蓝<br>
                            `,
          value: PLU.getCache(listenKey + "_keys") || "50|道种心魔经,10|不动明王诀",
          onOk(val) {
            let str = $.trim(val);
            PLU.setCache(listenKey + "_keys", str);
            PLU.splitCureSkills();
          },
          onNo() { },
        });
      }
    },
    toggleAutoCure($btn, listenKey, stat) {
      let btnFlag = 0;
      if (stat != undefined) {
        btnFlag = PLU.setBtnRed($btn, stat);
        PLU.setCache(listenKey, stat);
      } else {
        btnFlag = PLU.setBtnRed($btn);
      }
      if (!btnFlag) {
        return PLU.setCache(listenKey, 0);
      } else {
        PLU.setCache(listenKey, 1);
        setTimeout(() => {
          YFUI.writeToOut("<span style='color:yellow;'>自动血蓝: " + PLU.getCache(listenKey + "_keys") + " </span>");
        }, 100);
      }
    },
    //================================================================================================
    splitCureSkills() {
      let kf = (PLU.getCache("autoCure_keys") || "").split(",");
      PLU.TMP.autoCure_percent = "";
      PLU.TMP.autoCure_skills = "";
      PLU.TMP.autoCure_force_percent = "";
      PLU.TMP.autoCure_force_skills = "";
      if (kf.length > 0) {
        let acp = kf[0].split("|");
        PLU.TMP.autoCure_percent = Number(acp[0]) || 50;
        PLU.TMP.autoCure_skills = acp[1];
        if (kf.length > 1) {
          let acf = kf[1].split("|");
          PLU.TMP.autoCure_force_percent = Number(acf[0]) || 10;
          PLU.TMP.autoCure_force_skills = acf[1];
        }
      }
    },
    //================================================================================================
    checkAutoCure() {
      let vsInfo = g_obj_map.get("msg_vs_info");
      let userInfo = g_obj_map.get("msg_attrs");
      let keePercent = ((100 * Number(vsInfo.get(PLU.battleData.mySide + "_kee" + PLU.battleData.myPos))) / Number(userInfo.get("max_kee"))).toFixed(2);
      let forcePercent = ((100 * Number(vsInfo.get(PLU.battleData.mySide + "_force" + PLU.battleData.myPos))) / Number(userInfo.get("max_force"))).toFixed(2);
      if (!PLU.TMP.autoCure_percent) {
        PLU.splitCureSkills();
      }
      if (PLU.TMP.autoCure_force_skills && Number(forcePercent) < PLU.TMP.autoCure_force_percent) {
        PLU.autoCureByKills(PLU.TMP.autoCure_force_skills, forcePercent);
      } else if (PLU.TMP.autoCure_skills && Number(keePercent) < PLU.TMP.autoCure_percent && PLU.battleData.cureTimes < 3) {
        PLU.autoCureByKills(PLU.TMP.autoCure_skills, forcePercent);
      }
    },
    //================================================================================================
    autoCureByKills(skill, forcePercent) {
      if (PLU.battleData && PLU.battleData.xdz > 2) {
        let rg = new RegExp(skill);
        let useSkill = PLU.selectSkills(rg);
        if (useSkill) {
          clickButton(useSkill.key, 0);
          if (Number(forcePercent) > 1) PLU.battleData.cureTimes++;
        }
      }
    },
    //================================================================================================
    setAutoPerform($btn, listenKey, stat) {
      if (listenKey == "autoPerform") {
        //自动技能
        let skillsList = [];
        try {
          skillsList = JSON.parse(PLU.getCache(listenKey + "_keysList"));
        } catch (error) {
          skillsList = ["12|九阳神功,真龙 爪手","12|九阳神功,湿 魂 剑 诀","12|九阳神功,月影轻灵鞭法","6|千影百伤棍,九天龙吟剑法",];
        }
        YFUI.showInput({
          title: "自动技能",
          text: `格式：触发气值|技能词组，以英文逗号分割多个关键词。<br>
                            <span style="color:red;">例如：</span><br>
                            [例1] <span style="color:blue;">9|千影百伤棍,九天龙吟剑法,排云掌法</span><br> 气大于等于9时自动使用技能<br>
                            `,
          value: skillsList,
          inputs: ["技能1", "技能2", "技能3", "技能4"],
          onOk(val) {
            PLU.setCache(listenKey + "_keysList", JSON.stringify(val));
            if (PLU.getCache(listenKey)) {
              PLU.setPerformSkill(PLU.getCache(listenKey));
            }
          },
          onNo() { },
        });
      }
    },
    toggleAutoPerform($btn, listenKey, stat) {
      let curIdx = Number(PLU.getCache(listenKey));
      if (stat != undefined) {
        if (stat > 0) {
          PLU.setBtnRed($btn, 1);
          PLU.setPerformSkill(stat);
        } else PLU.setBtnRed($btn, 0);
        $btn.text(["连招", "技一", "技二", "技三", "技四"][stat]);
        PLU.setCache(listenKey, stat);
        if (stat > 0) PLU.TMP.lastAutoPerformSet = stat;
      } else {
        let nowTime = Date.now();
        if (curIdx == 0 && nowTime - (PLU.TMP.lastClickAutoPerform || 0) < 350) {
          curIdx = PLU.TMP.lastAutoPerformSet || 1;
          curIdx++;
          if (curIdx > 4) curIdx = 1;
        } else {
          curIdx = curIdx == 0 ? PLU.TMP.lastAutoPerformSet || 1 : 0;
        }
        PLU.TMP.lastClickAutoPerform = nowTime;
        if (curIdx > 0) PLU.TMP.lastAutoPerformSet = curIdx;
        PLU.setCache(listenKey, curIdx);
        if (curIdx == 0) {
          PLU.setBtnRed($btn, 0);
          $btn.text("连招");
        } else {
          PLU.setBtnRed($btn, 1);
          $btn.text(["连招", "技一", "技二", "技三", "技四"][curIdx]);
          PLU.setPerformSkill(curIdx);
        }
      }
    },
    setPerformSkill(idx) {
      let skillsList = [];
      idx = idx - 1;
      try {
        skillsList = JSON.parse(PLU.getCache("autoPerform_keysList"));
      } catch (error) {
        skillsList = [];
      }
      let str = skillsList[idx] || "";
      let aps = str.split("|");
      if (aps && aps.length == 2) {
        PLU.TMP.autoPerform_xdz = Number(aps[0]);
        PLU.TMP.autoPerform_skills = aps[1].split(",");
      } else {
        PLU.TMP.autoPerform_xdz = 0;
        PLU.TMP.autoPerform_skills = [];
      }
      setTimeout(() => {
        let setCh = ["一", "二", "三", "四"][idx];
        YFUI.writeToOut(
          "<span style='color:yellow;'>自动技能[" + setCh + "] : " + str + " </span><br><span style='color:white;'>** 双击自动技能按钮切换技能设置 **</span>",
        );
      }, 100);
    },
    //================================================================================================
    checkAutoPerform() {
      // if(PLU.battleData.autoSkill) return;
      if (!PLU.TMP.autoPerform_xdz) return;
      // if(!PLU.TMP.autoPerform_xdz){
      //     let aps = PLU.getCache("autoPerform_keys").split('|')
      //     PLU.TMP.autoPerform_xdz = Number(aps[0])
      //     PLU.TMP.autoPerform_skills = aps[1].split(',')
      // }
      if (PLU.battleData.xdz >= PLU.TMP.autoPerform_xdz) {
        if (PLU.TMP.autoPerform_skills && PLU.TMP.autoPerform_skills.length > 0) {
          PLU.TMP.autoPerform_skills.forEach((skn, idx) => {
            let useSkill = PLU.selectSkills(skn);
            if (useSkill) {
              setTimeout((e) => {
                clickButton(useSkill.key, 0);
              }, idx * 100);
            }
          });
        }
      }
    },
    //================================================================================================
    setFightSets($btn, listenKey, stat) {
      if (listenKey == "followKill") {
        //开跟杀
        YFUI.showInput({
          title: "开跟杀",
          text: `格式：跟杀的人名词组，以英文逗号分割多个关键词，人名前带*为反跟杀。<br>
                            <span style="color:red;">例如：</span><br>
                            [例1] <span style="color:blue;">步惊鸿,*醉汉</span><br> 步惊鸿攻击(杀or比试)谁我攻击谁；谁攻击醉汉我攻击谁<br>
                            `,
          value: PLU.getCache(listenKey + "_keys") || "☆,★,人",
          //type:"textarea",
          onOk(val) {
            let str = $.trim(val);
            PLU.setCache(listenKey + "_keys", str);
            PLU.splitFollowKillKeys();
          },
          onNo() { },
        });
      }
    },
    toggleFollowKill($btn, listenKey, stat) {
      let btnFlag = 0;
      if (stat != undefined) {
        btnFlag = PLU.setBtnRed($btn, stat);
        PLU.setCache(listenKey, stat);
      } else {
        btnFlag = PLU.setBtnRed($btn);
      }
      if (!btnFlag) {
        return PLU.setCache(listenKey, 0);
      } else {
        PLU.splitFollowKillKeys();
        PLU.setCache(listenKey, 1);
        setTimeout(() => {
          YFUI.writeToOut("<span style='color:yellow;'>自动跟杀: " + PLU.getCache(listenKey + "_keys") + " </span>");
        }, 100);
      }
    },
    //================================================================================================
    splitFollowKillKeys() {
      let keystr = PLU.getCache("followKill_keys") || "";
      let keys = keystr.split(/[,，]/);
      PLU.FLK = {
        followList: [],
        defendList: [],
      };
      keys.forEach((e) => {
        if (!e) return;
        if (e.charAt(0) == "*") {
          PLU.FLK.defendList.push(e.substring(1));
        } else {
          PLU.FLK.followList.push(e);
        }
      });
    },
    //================================================================================================
    toCheckFollowKill(attacker, defender, fightType, msgText) {
      if (!PLU.FLK) PLU.splitFollowKillKeys();
      for (let i = 0; i < PLU.FLK.followList.length; i++) {
        let flname = PLU.FLK.followList[i];
        if (attacker.match(flname)) {
          PLU.autoFight({
            targetName: defender,
            fightKind: fightType,
            onFail() { },
            onEnd() { },
          });
          return;
        }
      }
      for (let i = 0; i < PLU.FLK.defendList.length; i++) {
        let dfname = PLU.FLK.defendList[i];
        if (defender.match(dfname)) {
          PLU.autoFight({
            targetName: attacker,
            fightKind: fightType,
            onFail() { },
            onEnd() { },
          });
          return;
        }
      }
    },
    //================================================================================================
    startSync($btn) {
      PLU.getTeamInfo((t) => {
        if (!t) PLU.setBtnRed($btn);
        else {
          YFUI.writeToOut("<span style='color:yellow;'>===队伍同步开始" + (t.is_leader ? ", <b style='color:#F00;'>我是队长</b>" : "") + " ===</span>");
          PLU.allowedcmds = ["go", "fb", "yell", "rank", "fight", "kill", "escape", "jh", "ask", "npc_datan", "give", "room_sousuo", "change_server"];
          if (t.is_leader) {
            PLU.TMP.leaderTeamSync = true;
          } else {
            PLU.listenTeamSync(t.leaderId);
          }
        }
      });
    },
    toggleTeamSync($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (btnFlag) {
        PLU.TMP.teamSync = true;
        if (PLU.TMP.firstSync) PLU.startSync($btn);
        else {
          YFUI.showPop({
            title: "队伍同步",
            text: "<b style='color:#F00;'>入队后再打开队伍同步!!</b><br>队长发布指令, 队员监听同步指令!",
            okText: "同步",
            onOk(e) {
              PLU.TMP.firstSync = 1;
              PLU.startSync($btn);
            },
            onNo() {
              PLU.setBtnRed($btn);
            },
            onX() {
              PLU.setBtnRed($btn);
            },
          });
        }
      } else {
        PLU.TMP.teamSync = false;
        PLU.TMP.leaderTeamSync = false;
        UTIL.delSysListener("syncTeamChannel");
      }
    },
    //================================================================================================
    commandTeam(args) {
      if (!PLU.TMP.leaderTeamSync) return;
      let cmd = args[0];
      if (
        !g_gmain.is_fighting &&
        (PLU.allowedcmds.indexOf(cmd.split(" ")[0]) > -1 ||
          cmd.indexOf("find_") == 0 ||
          cmd.indexOf("event_") == 0 ||
          cmd.indexOf("give_") == 0 ||
          cmd.indexOf("get_") == 0 ||
          cmd.indexOf("op1") >= 0 ||
          cmd.indexOf("_op2") > 0 ||
          ["nw", "n", "ne", "w", "e", "sw", "s", "se"].includes(cmd))
      ) {
        cmd = PLU.Base64.encode(args[0]).split("").join("-");
        clickButton("team chat " + cmd + "\n");
      }
    },
    //================================================================================================
    listenTeamSync(leaderId) {
      UTIL.addSysListener("syncTeamChannel", (b, type, subtype, msg) => {
        if (type == "channel" && subtype == "team" && msg.indexOf(leaderId) > 0 && msg.indexOf("【队伍】") > 0) {
          var cmd = PLU.Base64.decode(msg.split("：")[1].replace("\x1B[2;37;0m", "").replace(/-/g, "")).replace(/\n/g, "");
          if (
            PLU.allowedcmds.indexOf(cmd.split(" ")[0]) > -1 ||
            cmd.indexOf("find_") == 0 ||
            cmd.indexOf("event_") == 0 ||
            cmd.indexOf("give_") == 0 ||
            cmd.indexOf("get_") == 0 ||
            cmd.indexOf("op1") >= 0 ||
            cmd.indexOf("_op2") > 0 ||
            ["nw", "n", "ne", "w", "e", "sw", "s", "se"].includes(cmd)
          ) {
            clickButton(cmd);
          }
          /*if (cmd == "change_server world") {
            clickButton("team join " + leaderId + "-1a1a");
}*/
        }
      });
    },
    //================================================================================================
    getTeamInfo(callback) {
      UTIL.addSysListener("checkTeam", (b, type, subtype, msg) => {
        if (type != "team" && subtype != "info") return;
        UTIL.delSysListener("checkTeam");
        if (b.get("team_id")) {
          if (b.get("is_member_of") == "1") {
            callback &&
              callback({
                is_leader: parseInt(b.get("is_leader")),
                leaderId: b.get("member1").split(",")[0],
              });
          } else {
            callback && callback(0);
          }
        } else {
          callback && callback(0);
        }
        clickButton("prev");
      });
      clickButton("team");
    },
    //================================================================================================
    setSkillGroup(idx) {
      if (g_gmain.is_fighting) return;
      $(".menu").hide();
      let lsgTimeOut = setTimeout(() => {
        UTIL.delSysListener("loadSkillGroup");
      }, 5000);
      UTIL.addSysListener("loadSkillGroup", (b, type, subtype, msg) => {
        if (type != "enable" && subtype !== "list") return;
        UTIL.delSysListener("loadSkillGroup");
        clearTimeout(lsgTimeOut);
        clickButton("prev");
      });
      clickButton("enable mapped_skills restore go " + idx);
    },
    //================================================================================================
    setWearEquip(idx) {
      if (g_gmain.is_fighting) return;
      $(".menu").hide();
      let equipKey = "equip_" + idx + "_keys";
      YFUI.showInput({
        title: "装备组-" + idx,
        text: `格式：武器装备词组，以英文逗号分割多个关键词，<br>
                        <span style="color:#D60;">武器名前必须带上*，入脉武器名前带**。<br>
                        卸下武器名前带上#。</span><br>
                        <span style="color:red;">例如：</span><br>
                        [例1] <span style="color:blue;">#风泉之剑,*离别钩,*倾宇破穹棍,**驭风腾云,霸天圣袍,紫贪狼戒</span><br>
                        [例2] <span style="color:blue;">*风泉之剑,**雨叶魔枪,木棉袈裟,龙渊扳指,大士无双帽,天玑九玄冠,博睿扳指,崆峒不老戒,杨柳怨羌笛,*妙韵梨花萧</span><br>
                        `,
        value: PLU.getCache(equipKey) || "",
        type: "textarea",
        onOk(val) {
          let str = $.trim(val);
          if (!str) return;
          PLU.setCache(equipKey, str);
          PLU.wearEquip(str);
        },
        onNo() { },
      });
    },
    wearEquip(equipsStr) {
      PLU.getAllItems((list) => {
        let equips = equipsStr.split(","),
          equipCmds = "";
        let equipArr = equips.forEach((e) => {
          let eqObj = {};
          if (e.substr(0, 1) == "#") {
            eqObj = { type: -1, name: e.substr(1) };
          } else if (e.substr(0, 2) == "**") {
            eqObj = { type: 2, name: e.substr(2) };
          } else if (e.substr(0, 1) == "*") {
            eqObj = { type: 1, name: e.substr(1) };
          } else {
            eqObj = { type: 0, name: e };
          }
          let bagItem = list.find((it) => !!it.name.match(eqObj.name));
          if (bagItem) {
            if (eqObj.type == -1) equipCmds += "unwield " + bagItem.key + ";";
            else if (eqObj.type == 2) equipCmds += "wield " + bagItem.key + " rumai;";
            else if (eqObj.type == 1) equipCmds += "wield " + bagItem.key + ";";
            else equipCmds += "wear " + bagItem.key + ";";
          }
        });
        PLU.execActions(equipCmds, () => {
          YFUI.writeToOut("<span style='color:yellow;'> ==装备完毕!== </span>");
          if (g_gmain.is_fighting) gSocketMsg.go_combat();
        });
      });
    },
    //================================================================================================
    showLog() {
      if ($("#myTools_InfoPanel").length > 0) return $("#myTools_InfoPanel").remove();
      let $logPanel = YFUI.showInfoPanel({
        text: "",
        onOpen() {
          $("#myTools_InfoPanel .infoPanel-wrap").html(PLU.logHtml);
          $("#myTools_InfoPanel .infoPanel-wrap").scrollTop($("#myTools_InfoPanel .infoPanel-wrap")[0].scrollHeight);
        },
        onNo() {
          PLU.logHtml = "";
          UTIL.logHistory = [];
          UTIL.setMem("HISTORY", JSON.stringify(this.logHistory));
          $("#myTools_InfoPanel .infoPanel-wrap").empty();
        },
        onClose() { },
      });
    },
    //================================================================================================
    updateShowLog(e) {
      let html = `<div style="${e.ext.style}">${UTIL.getNow(e.ext.time)} ${e.ext.msg}</div>`;
      PLU.logHtml += html;
      if ($("#myTools_InfoPanel").length < 1) return;
      $("#myTools_InfoPanel .infoPanel-wrap").append(html);
      $("#myTools_InfoPanel .infoPanel-wrap").scrollTop($("#myTools_InfoPanel .infoPanel-wrap")[0].scrollHeight);
    },
    //================================================================================================
    goHJS(where, npc) {
      let roomInfo = g_obj_map.get("msg_room");
      let curName = UTIL.filterMsg(roomInfo.get("short") || "");
      let act = "";
      if (curName == "青苔石阶" && roomInfo.get("northwest") == "青苔石阶") act = "nw";
      else if (curName == "青苔石阶" && roomInfo.get("northeast") == "青苔石阶") act = "ne";
      else if (curName == "青苔石阶" && roomInfo.get("southwest") == "青苔石阶") act = "sw";
      else if (curName == "榆叶林" && roomInfo.get("north") == "榆叶林") act = "n";
      else if (curName == "榆叶林" && roomInfo.get("south") == "榆叶林") act = "s";
      else if (curName == "世外桃源" && where == "镜星府") act = "nw";
      else if (curName == "世外桃源" && where == "荣威镖局") act = "ne";
      else if (curName == "世外桃源" && where == "碧落城") act = "s";
      if (act)
        PLU.execActions(act, () => {
          let npcObj = roomInfo.get("npc1");
          if (npcObj) {
            var npcName = npcObj.split(",")[1];
          }
          if (npc && ((npcName && npcName != npc) || !npcObj))
            PLU.execActions("jh 2;n;n;e;s;luoyang317_op1;go_hjs go;se;se;ne;w;n;", () => {
              PLU.goHJS(where, npc);
            });
          else PLU.goHJS(where, npc);
        });
    },
    //================================================================================================
    goHaRi() {
      let roomInfo = g_obj_map.get("msg_room");
      let curName = UTIL.filterMsg(roomInfo.get("short") || "");
      let act = "";
      if (curName == "沙漠迷宫") {
        if (roomInfo.get("east") == "沙漠迷宫") act = "e";
        else if (roomInfo.get("north") == "沙漠迷宫") act = "n";
        else if (roomInfo.get("west") == "沙漠迷宫") act = "w";
        else if (roomInfo.get("south") == "沙漠迷宫") act = "s";
        if (act)
          PLU.execActions(act, () => {
            PLU.goHaRi();
          });
      } else if (curName == "荒漠") {
        PLU.execActions("n;n;nw;n;ne", () => {
          YFUI.writeToOut("<span style='color:#FFF;'>--到达--</span>");
        });
      } else {
        PLU.execActions("rank go 311;s;s;sw;se;se;se;e;se;se;ne;", () => {
          PLU.goHaRi();
        });
      }
    },
     //================================================================================================
    queryJHMenu($btn, jhname) {
      let npcList = PLU.YFD.mapsLib.Npc.filter((e) => e.jh == jhname);
      npcList.forEach((e) => {
        let str = [e.jh, e.loc, e.name].filter((s) => !!s).join("-");
        YFUI.writeToOut(
          "<span><a style='text-decoration:underline;color:yellow;cursor:pointer;' onclick='PLU.goNpcWay(\"" +
            str +
            '","' +
            e.way +
            "\")'>" +
            str +
            "</a> &nbsp;&nbsp;<a style='text-decoration:underline;color:yellow;cursor:pointer;' onclick='PLU.showNpcWay(\"" +
            str +
            '","' +
            e.way +
            "\")'>路徑詳情</a></span>",
        );
      });
      YFUI.writeToOut("<span>----------</span>");
    },
    //================================================================================================
    toQueryNpc() {
      YFUI.showInput({
        title: "查找NPC",
        text:
          "输入NPC名字，可模糊匹配，支持<a target='_blank' href='https://www.runoob.com/regexp/regexp-syntax.html'>正则表达式</a>，同时支持简体（不包括地址名）和繁体<br>" +
          "正则表达式之外语法例子：<br>" +
          "[例1] 开封@毒蛇<br>" +
          "[例2] 星宿海@百龙山@毒蛇" +
          "[例3] ^.?(男|女)[孩童]",
        value: PLU.getCache("prevSearchStr") || "^.?(男|女)[孩童]",
        onOk(val) {
          if (!$.trim(val)) return;
          let str = $.trim(val);
          PLU.setCache("prevSearchStr", str);
          PLU.queryNpc(str + "道");
        },
        onNo() { },
      });
    },
    // 查询房间路径
    queryRoomPath() {
      if (UTIL.inHome()) return;
      let jh = PLU.YFD.cityId[g_obj_map?.get("msg_room")?.get("map_id")];
      if (jh) {
        let room = ansi_up.ansi_to_text(g_obj_map?.get("msg_room")?.get("short"));
        return PLU.queryNpc(jh + "@" + room + "@.*道", true)[0]?.way;
      }
    },
    // 链接两个路径终点
    linkPath(pathA, pathB) {
      if (!pathA) return pathB;
      let arrayA = pathA.split(";");
      let arrayB = pathB.split(";");
      let len = Math.min(arrayA.length, arrayB.length);
      for (var index = 0; index < len; index++) if (arrayA[index] != arrayB[index]) break;
      if (!index) return pathB;
      return arrayA
        .slice(index)
        .reverse()
        .map((e) => {
          let cmd = e.match(/^(#\d+ )?([ns]?[we]?)$/);
          if (cmd) {
            if (!cmd[1]) cmd[1] = "";
            if (cmd[2].indexOf("n") == 0) {
              var way = cmd[2].replace("n", "s");
            } else {
              var way = cmd[2].replace("s", "n");
            }
            if (way.indexOf("w") >= 0) {
              way = way.replace("w", "e");
            } else {
              way = way.replace("e", "w");
            }
            return cmd[1] + way;
          }
          // 迷宫反走
          cmd = e.match(/^(.+):(.+)\^(.+)$/);
          if (cmd) return cmd[1] + ":" + cmd[3] + "^" + cmd[2];
          return e;
        })
        .concat(arrayB.slice(index))
        .join(";");
    },
    // 最短路径
    minPath(pathA, pathB) {
      let linkPath = PLU.linkPath(pathA, pathB);
      if (linkPath == "" || linkPath == pathB) return linkPath;
      let a = linkPath.split(";");
      let len = a.length;
      for (var index = 0; index < len; index++) {
        let cmd = a[index].match(/^(.+):(.+\^.+)$/);
        if (cmd) a[index] = PLU.YFD.mapsLib.Labyrinth[cmd[1]][cmd[2]];
      }
      a = a.join(";").split(";");
      let b = pathB.split(";");
      len = b.length;
      for (var index = 0; index < len; index++) {
        let cmd = b[index].match(/^(.+):(.+\^.+)$/);
        if (cmd) b[index] = PLU.YFD.mapsLib.Labyrinth[cmd[1]][cmd[2]];
      }
      b = b.join(";").split(";");
      return a.length <= b.length ? linkPath : pathB;
    },
    //================================================================================================
    formatNpcData(text) {
      let npc = text.match(/^(.*)@(.*)@(.*)道$/);
      if (npc) {
        var jh = npc[1];
        var loc = npc[2];
        var name = "^" + npc[3] + "$";
      } else {
        npc = text.match(/^([^*-]*)[@*-](.*)道$/);
        if (npc) {
          if (npc[1] == "茶圣" || npc[1] == "青衣剑士") {
            var name = "^" + npc[1] + "-" + npc[2] + "$";
          } else {
            var jh = npc[1];
            var name = "^" + npc[2] + "$";
          }
        } else {
          npc = text.match(/^(.*)道$/);
          if (npc) {
            var name = npc[1];
          } else {
            var name = text;
          }
        }
      }
      return [jh, loc, name];
    },
    queryNpc(name, quiet) {
      if (!name) return;
      let [jh, loc, tmpName] = PLU.formatNpcData(name);
      name = tmpName;
      let npcLib = PLU.YFD.mapsLib.Npc;
      let findList = npcLib.filter((e) => {
        if (e.jh == jh && e.loc == loc && (e.name.match(name) || (e.name_tw && e.name_tw.match(name)) || (e.name_new && e.name_new.match(name)))) return true;
        return false;
      });
      if (findList.length == 0)
        findList = npcLib.filter((e) => {
          if ((e.jh == jh || !jh) && (e.name.match(name) || (e.name_tw && e.name_tw.match(name)) || (e.name_new && e.name_new.match(name)))) return true;
          return false;
        });
      if (findList.length == 0)
        findList = npcLib.filter((e) => {
          if (e.name.match(name) || (e.name_tw && e.name_tw.match(name)) || (e.name_new && e.name_new.match(name))) return true;
          return false;
        });
      let res = [];
      if (findList && findList.length > 0) {
        findList.forEach((e) => {
          let str = [e.jh, e.loc, _(e.name, e.name_tw)].filter((s) => !!s).join("-");
          if (!quiet)
            YFUI.writeToOut(
              "<span><a style='text-decoration:underline;color:yellow;cursor:pointer;' onclick='PLU.goNpcWay(\"" +
              str +
              '","' +
              e.way +
              "\")'>" +
              str +
              "</a> &nbsp;&nbsp;<a style='text-decoration:underline;color:yellow;cursor:pointer;' onclick='PLU.showNpcWay(\"" +
              str +
              '","' +
              e.way +
              "\")'>路径详情</a></span>",
            );
          res.push(e);
        });
        if (!quiet) YFUI.writeToOut("<span>----------</span>");
      } else if (!quiet) {
        YFUI.writeToOut("<span style='color:#F66;'>查询不到相关数据</span>");
      }
      return res;
    },
//================================================================================================
        vipBJ(){
            PLU.execActions("#15 vip finish_big_task;")
        },
//================================================================================================
        toFindDragon($btn){
            let btnFlag = PLU.setBtnRed($btn)
            if(!btnFlag) {
                //YFUI.writeToOut("<span style='color:#FFF;'>-------Stop Find Dragon-------</span>")
                PLU.TMP.findDragon = false
                return
            }else{
                let htm=`<div style='margin:0 0 10px 0;'>
						<span>起始地图: </span>
						<div style="font-size:12px;display:flex;flex-direction:row;flex-wrap: wrap;justify-content: flex-start;width: 100%;align-content: flex-start;line-height:2;margin-bottom:10px;" >
							<label style="width:20%"><input type="radio" name="findDragon_start" value="1" checked>1雪亭镇</label>
							<label style="width:20%"><input type="radio" name="findDragon_start" value="2">2洛阳</label>
							<label style="width:20%"><input type="radio" name="findDragon_start" value="3">3华山村</label>
							<label style="width:20%"><input type="radio" name="findDragon_start" value="4">4华山</label>
							<label style="width:20%"><input type="radio" name="findDragon_start" value="5">5扬州</label>
							<label style="width:20%"><input type="radio" name="findDragon_start" value="6">6丐帮</label>
							<label style="width:20%"><input type="radio" name="findDragon_start" value="7">7乔阴县</label>
							<label style="width:20%"><input type="radio" name="findDragon_start" value="8">8峨眉山</label>
							<label style="width:20%"><input type="radio" name="findDragon_start" value="9">9恒山</label>
							<label style="width:20%"><input type="radio" name="findDragon_start" value="10">10武当山</label>
							<label style="width:20%"><input type="radio" name="findDragon_start" value="11">11晚月庄</label>
							<label style="width:20%"><input type="radio" name="findDragon_start" value="12">12水烟阁</label>
							<label style="width:20%"><input type="radio" name="findDragon_start" value="13">13少林寺</label>
							<label style="width:20%"><input type="radio" name="findDragon_start" value="14">14唐门</label>
							<label style="width:20%"><input type="radio" name="findDragon_start" value="15">15青城山</label>
						</div>
						<span>搜图顺序: </span>
						<select id="findDragon_SearchOrder" style="font-size:16px;height:30px;width:30%;">
							<option selected value="1">顺序</option>
							<option value="-1">倒序</option>
						</select>
					</div>`

                YFUI.showPop({
                    title:"找小龙人",
                    text: htm,
                    width:"400px",
                    okText:"开始",
                    onOk(e){
                        let start = $(e.find('input[name="findDragon_start"]:checked')).val()
                        let order = Number($('#findDragon_SearchOrder').val())
                        //YFUI.writeToOut("<span style='color:#FFF;'>-------Find Dragon-------</span>")
                        YFUI.writeToOut("<span style='color:#FFF;'>--start jh "+start+'   --search order:'+order+"</span>")
                        PLU.findDragonMaps(Number(start),Number(order))
                    },
                    onNo(){
                        PLU.setBtnRed($btn)
                    }
                })
            }

        },
        async findDragonMaps(startCity, order){
            PLU.TMP.findDragon = true
            let curCity = startCity,
                endCity = startCity-order
            endCity = endCity<1 ? 15 : endCity>15 ? 1 : endCity
            do {
                let jhMap = YFD.mapsLib.Map.find(e=>e.jh==curCity)
                if(jhMap){
                    YFUI.writeToOut("<span style='color:#FFF;'>--开始搜索地图 jh "+curCity+"--</span>")
                    let paths = jhMap.way.split(";")
                    let npcName = '小龙人'
                    let res = await PLU.mapFindNpc(paths, npcName)
                    if(res=='end'){
                        YFUI.writeToOut("<span style='color:#FFF;'>--任务完成--</span>")
                        break
                    }else{
                        curCity = curCity+order
                        curCity = curCity<1 ? 15 : curCity>15 ? 1 : curCity
                    }
                }
            } while (curCity!=endCity && PLU.TMP.findDragon);
            YFUI.writeToOut("<span style='color:#FFF;'>--搜索完成--</span>")
            PLU.execActions("home")
            PLU.setBtnRed($("#btn_bt_kg_finddragon"),0)
        },
        async mapFindNpc(paths,NPCName){
            return new Promise(async (resolve,reject)=>{
                let idx = 0, preIdx = -1, res=''
                while (idx < paths.length) {
                    try {
                        if(preIdx!=idx) await PLU.stepPath(paths[idx])
                    } catch (error) {
                        resolve('noway')
                        break
                    }
                    preIdx = idx
                    let fnpc = UTIL.findRoomNpc(NPCName,false,true)
                    if(fnpc){
                        try {
                            let kiilres = await PLU.toKillNpc(fnpc.key)
                            if(kiilres=='noflower'){
                                PLU.execActions("shop buy shop26_N_10;shop buy shop26_N_10;")
                                await PLU.waitTime()
                            }else if(kiilres=='next'){
                                idx++
                            }else if(kiilres=='ok'){
                                //idx++
                            }else{
                                idx++
                            }
                        } catch (error) {
                            resolve('end')
                            break
                        }
                    }else{
                        idx++
                    }
                    if(!PLU.TMP.findDragon) { res='break';resolve('end');break;}
                }
                if(!res) resolve('next')
            })
        },
        async stepPath(act){
            return new Promise((resolve,reject)=>{
                PLU.actions({
                    paths:[act],
                    idx:0,
                    onPathsEnd(){
                        setTimeout(()=>{
                            resolve()
                        },200)
                    },
                    onPathsFail(){
                        reject()
                    }
                })
            })
        },
        async toKillNpc(npcId){
            return new Promise((resolve,reject)=>{
                PLU.autoFight({
                    targetKey:npcId,
                    fightKind:'kill',
                    // autoSkill:'fast',
                    onFail(errCode){
                        if(errCode==9){
                            resolve("next")
                        } else if(errCode==10){
                            resolve("noflower")
                        } else if(errCode==11){
                            reject("end")
                        }else{
                            resolve(false)
                        }
                    },
                    onEnd(){
                        setTimeout(()=>{
                            resolve('ok')
                        },500)
                    }
                })
            })
        },
        async waitTime(t=1000){
            return new Promise((resolve,reject)=>{
                setTimeout(()=>{
                    resolve()
                },t)
            })
        },
//================================================================================================

//================================================================================================
        toFindCiKe($btn){
            let btnFlag = PLU.setBtnRed($btn)
            if(!btnFlag) {
                //YFUI.writeToOut("<span style='color:#FFF;'>-------Stop Find Dragon-------</span>")
                PLU.TMP.findCiKe = false
                return
            }else{
                let htm=`<div style='margin:0 0 10px 0;'>
						<span>起始地图: </span>
						<div style="font-size:12px;display:flex;flex-direction:row;flex-wrap: wrap;justify-content: flex-start;width: 100%;align-content: flex-start;line-height:2;margin-bottom:10px;" >
							<label style="width:20%"><input type="radio" name="findCiKe_start" value="2" checked>1洛阳</label>
							<label style="width:20%"><input type="radio" name="findCiKe_start" value="5">2扬州</label>
							<label style="width:20%"><input type="radio" name="findCiKe_start" value="17">3开封</label>
							<label style="width:20%"><input type="radio" name="findCiKe_start" value="33">4大理</label>
							<label style="width:20%"><input type="radio" name="findCiKe_start" value="43">5掩月城</label>
						</div>
						<span>搜图顺序: </span>
						<select id="findCiKe_SearchOrder" style="font-size:16px;height:30px;width:30%;">
							<option selected value="1">顺序</option>
							<option value="-1">倒序</option>
						</select>
					</div>`

                YFUI.showPop({
                    title:"找斥候",
                    text: htm,
                    width:"400px",
                    okText:"开始",
                    onOk(e){
                        let start = $(e.find('input[name="findCiKe_start"]:checked')).val()
                        let order = Number($('#findCiKe_SearchOrder').val())
                        YFUI.writeToOut("<span style='color:#FFF;'>--start jh "+start+'   --search order:'+order+"</span>")
                        PLU.findCIKeMaps(Number(start),Number(order))
                    },
                    onNo(){
                        PLU.setBtnRed($btn)
                    }
                })
            }

        },
        async findCIKeMaps(startCity, order){
            PLU.TMP.findCiKe = true
            let curCity = startCity,
                endCity = startCity-order
            endCity = endCity<1 ? 50 : endCity>50 ? 1 : endCity
            do {
                let jhMap = YFD.mapsLib.Map.find(e=>e.jh==curCity)
                if(jhMap){
                    YFUI.writeToOut("<span style='color:#FFF;'>--开始搜索地图 jh "+curCity+"--</span>")
                    let paths = jhMap.way.split(";")
                    let npcName = '幽厄斥候'
                    let res = await PLU.mapFindCiKe(paths, npcName)
                    if(res=='end'){
                        YFUI.writeToOut("<span style='color:#FFF;'>--任务完成--</span>")
                        break
                    }else{
                        //curCity = curCity+order
                        curCity = curCity<1 ? 50 : curCity>50 ? 1 : curCity
                    }
                }
            } while (curCity!=endCity && PLU.TMP.findCiKe);
            YFUI.writeToOut("<span style='color:#FFF;'>--搜索完成--</span>")
            PLU.execActions("home")
            PLU.setBtnRed($("#btn_bt_kg_findCiKe"),0)
        },
        async mapFindCiKe(paths,NPCName){
            return new Promise(async (resolve,reject)=>{
                let idx = 0, preIdx = -1, res=''
                while (idx < paths.length) {
                    try {
                        if(preIdx!=idx) await PLU.stepPath(paths[idx])
                    } catch (error) {
                        resolve('noway')
                        break
                    }
                    preIdx = idx
                    let fnpc = UTIL.findRoomNpc(NPCName,false,true)
                    if(fnpc){
                        try {
                            let kiilres = await PLU.toKillNpc(fnpc.key)
                            if(kiilres=='noflower'){
                                PLU.execActions("shop buy shop26_N_10;shop buy shop26_N_10;")
                                await PLU.waitTime()
                            }else if(kiilres=='next'){
                                idx++
                            }else if(kiilres=='ok'){
                                //idx++
                            }else{
                                idx++
                            }
                        } catch (error) {
                            resolve('end')
                            break
                        }
                    }else{
                        idx++
                    }
                    if(!PLU.TMP.findCiKe) { res='break';resolve('end');break;}
                }
                if(!res) resolve('next')
            })
        },
        async stepPath(act){
            return new Promise((resolve,reject)=>{
                PLU.actions({
                    paths:[act],
                    idx:0,
                    onPathsEnd(){
                        setTimeout(()=>{
                            resolve()
                        },200)
                    },
                    onPathsFail(){
                        reject()
                    }
                })
            })
        },
        async toKillNpc(npcId){
            return new Promise((resolve,reject)=>{
                PLU.autoFight({
                    targetKey:npcId,
                    fightKind:'kill',
                    // autoSkill:'fast',
                    onFail(errCode){
                        if(errCode==9){
                            resolve("next")
                        } else if(errCode==10){
                            resolve("noflower")
                        } else if(errCode==11){
                            reject("end")
                        }else{
                            resolve(false)
                        }
                    },
                    onEnd(){
                        setTimeout(()=>{
                            resolve('ok')
                        },500)
                    }
                })
            })
        },
        async waitTime(t=1000){
            return new Promise((resolve,reject)=>{
                setTimeout(()=>{
                    resolve()
                },t)
            })
        },
        //================================================================================================

    AutoPuzzle() {
      PLU.TMP.puzzleList = {};
      PLU.TMP.puzzleWating = {};
      return {
        //puzzleWating: {},
        analyzePuzzle: function (puzzle) {
          var puzzleid = "";
          var publisherName = "";
          var targetName = "";
          var publisherResult = /<a[^>]*find_task_road2 [^>]*>((?!<a[^>]*>).)+<\/a>/.exec(puzzle);
          if (publisherResult && publisherResult.length > 0) {
            publisherName = publisherResult[0].replace(/<\/?a[^>]*>/g, "");
            if (publisherName.indexOf("-") > -1) {
              publisherName = publisherName.split("-")[1];
            }
            publisherName = publisherName.replace(/\x1B/g, "").replace(/^<\/span>/, "");
            var result1 = /find_task_road2 [^>^']*/.exec(publisherResult[0]);
            puzzleid = result1[0].replace(/find_task_road2 /g, "");
          }
          var targetResult = puzzle.match(/<a[^>]*find_task_road [^>]*>((?!<a[^>]*>).)+<\/a>/g);
          if (targetResult && targetResult.length > 0) {
            var targetInfoIndex = 0;
            if (/抢走了，去替我要回来吧！/.test(puzzle)) {
              targetInfoIndex = targetResult.length - 1;
            }
            targetName = targetResult[targetInfoIndex].replace(/<\/?a[^>]*>/g, "");
            if (targetName.indexOf("-") > -1) {
              targetName = targetName.split("-")[1];
            }
            targetName = targetName.replace(/\x1B/g, "").replace(/^<\/span>/, "");
            if (!puzzleid) {
              var result1 = /find_task_road [^>^']*/.exec(targetResult[targetInfoIndex]);
              puzzleid = result1[0].replace(/find_task_road /g, "");
            }
          }
          if (!puzzleid) {
            return "";
          }
          if (puzzleid in PLU.TMP.puzzleList) {
            $.extend(PLU.TMP.puzzleList[puzzleid], {
              puzzle: puzzle,
              publisherName: publisherName,
              targetName: targetName,
            });
          } else {
            PLU.TMP.puzzleList[puzzleid] = {
              puzzle: puzzle,
              publisherName: publisherName,
              targetName: targetName,
              firstPublisherName: publisherName,
              firstStep: puzzle.replace(/<[^>]*>/g, ""),
              publisherMap: g_obj_map.get("msg_room").get("map_id"),
              publisherRoom: g_obj_map.get("msg_room").get("short"),
            };
          }
          return puzzleid;
        },
        startpuzzle: function (puzzleid) {
          if (!PLU.TMP.puzzleList[puzzleid]) return;
          var puzzle = PLU.TMP.puzzleList[puzzleid].puzzle;
          if (/看上去好生奇怪，/.test(puzzle) || /鬼鬼祟祟的叫人生疑，/.test(puzzle)) {
            PLU.TMP.puzzleWating = {
              puzzleid: puzzleid,
              action: "npc_datan",
              actionCode: "npc_datan",
              target: PLU.TMP.puzzleList[puzzleid].targetName,
              status: "start",
            };
          } else if (
            /你一番打探，果然找到了一些线索，回去告诉/.test(puzzle) ||
            /你一番搜索，果然找到了，回去告诉/.test(puzzle) ||
            /好，我知道了。你回去转告/.test(puzzle) ||
            /老老实实将东西交了出来，现在可以回去找/.test(puzzle) ||
            /好，好，好，我知错了……你回去转告/.test(puzzle) ||
            /脚一蹬，死了。现在可以回去找/.test(puzzle)
          ) {
            PLU.TMP.puzzleWating = {
              puzzleid: puzzleid,
              action: "answer",
              actionCode: "ask",
              target: PLU.TMP.puzzleList[puzzleid].publisherName,
              status: "start",
            };
          } else if (/我想找/.test(puzzle) || /我有个事情想找/.test(puzzle)) {
            PLU.TMP.puzzleWating = {
              puzzleid: puzzleid,
              action: "ask",
              actionCode: "ask",
              target: PLU.TMP.puzzleList[puzzleid].targetName,
              status: "start",
            };
          } else if (
            /我十分讨厌那/.test(puzzle) ||
            /好大胆，竟敢拿走了我的/.test(puzzle) ||
            /竟敢得罪我/.test(puzzle) ||
            /抢走了，去替我要回来吧！/.test(puzzle) ||
            /十分嚣张，去让[他她]见识见识厉害！/.test(puzzle)
          ) {
            PLU.TMP.puzzleWating = {
              puzzleid: puzzleid,
              action: "fight",
              actionCode: "fight",
              target: PLU.TMP.puzzleList[puzzleid].targetName,
              status: "start",
            };
          } else if (
            /上次我不小心，竟然吃了/.test(puzzle) ||
            /竟对我横眉瞪眼的，真想杀掉[他她]！/.test(puzzle) ||
            /昨天捡到了我几十辆银子，拒不归还。钱是小事，但人品可不好。/.test(puzzle)
          ) {
            PLU.TMP.puzzleWating = {
              puzzleid: puzzleid,
              action: "kill",
              actionCode: "kill",
              target: PLU.TMP.puzzleList[puzzleid].targetName,
              status: "start",
            };
          } else if (/银子/.test(puzzle)) {
            PLU.execActions("auto_tasks cancel");
            PLU.TMP.puzzleWating = {};
            return;
          } else if (/突然想要一/.test(puzzle) || /唉，好想要一/.test(puzzle)) {
            PLU.TMP.puzzleWating = {
              puzzleid: puzzleid,
              action: "get",
              actionCode: "get",
              target: PLU.TMP.puzzleList[puzzleid].targetName,
              status: "start",
            };
          } else if (/可前去寻找/.test(puzzle)) {
            PLU.TMP.puzzleWating = {
              puzzleid: puzzleid,
              action: "room_sousuo",
              actionCode: "room_sousuo",
              target: "",
              status: "start",
            };
          }
          this.gotoPuzzle(puzzleid);
        },
        gotoPuzzle: function (puzzleid) {
          if (puzzleid != PLU.TMP.puzzleWating.puzzleid) return;
          var that = this;
          switch (PLU.TMP.puzzleWating.action) {
            case "npc_datan":
            case "fight":
            case "kill":
            case "ask":
            case "room_sousuo":
              PLU.TMP.puzzleWating.status = "trace";
              PLU.execActions("find_task_road " + puzzleid);
              break;
            case "get":
              if (
                g_obj_map.get("msg_room").get("map_id") == PLU.TMP.puzzleList[puzzleid].publisherMap &&
                g_obj_map.get("msg_room").get("short") == PLU.TMP.puzzleList[puzzleid].publisherRoom
              ) {
                var npc = g_obj_map.get("msg_room").elements.filter(function (item) {
                  return item.key.indexOf("npc") == 0 && that.ansiToHtml(item.value.split(",")[1]) == PLU.TMP.puzzleList[puzzleid].publisherName;
                });
                if (npc.length > 0) {
                  PLU.TMP.puzzleWating.waitTimer = setTimeout(function () {
                    PLU.TMP.puzzleWating.status = "trace";
                    PLU.execActions("find_task_road " + puzzleid);
                  }, 2000);
                  PLU.TMP.puzzleWating.status = "give";
                  var npcArr = {};
                  for (var i = 0; i < npc.length; i++) {
                    var npcinfo = npc[i].value.split(",");
                    npcArr[npcinfo[0]] = npc[i];
                  }
                  PLU.TMP.puzzleWating.waitCount = 0;
                  for (var npcid in npcArr) {
                    PLU.execActions("give " + npc[0].value.split(",")[0]);
                    PLU.TMP.puzzleWating.waitCount++;
                  }
                  return;
                }
              }
              PLU.TMP.puzzleWating.status = "trace";
              PLU.execActions("find_task_road " + puzzleid);
              break;
            case "answer":
              PLU.TMP.puzzleWating.status = "trace";
              PLU.execActions("find_task_road2 " + puzzleid);
              break;
          }
        },
        doPuzzle: function (puzzleid) {
          if (puzzleid != PLU.TMP.puzzleWating.puzzleid) return;
          var that = this;
          switch (PLU.TMP.puzzleWating.action) {
            case "npc_datan":
            case "answer":
            case "ask":
            case "fight":
            case "kill":
              PLU.TMP.puzzleWating.status = "wait";
              var npcs = g_obj_map.get("msg_room").elements.filter(function (item) {
                return (
                  item.key.indexOf("npc") == 0 &&
                  (that.ansiToHtml(item.value.split(",")[1]) == PLU.TMP.puzzleWating.target ||
                    (PLU.TMP.puzzleWating.target == "恶人" && item.value.split(",")[0].indexOf("eren") == 0) ||
                    (PLU.TMP.puzzleWating.target == "捕快" && item.value.split(",")[0].indexOf("bukuai") == 0) ||
                    (["柳绘心", "王铁匠", "杨掌柜", "客商", "柳小花", "卖花姑娘", "刘守财", "方老板", "朱老伯", "方寡妇"].indexOf(PLU.TMP.puzzleWating.target) > -1 &&
                      item.value.split(",")[0].indexOf("bad_target_") == 0))
                );
              });
              if (npcs.length > 0) {
                var distinctNpcs = {};
                for (var i = 0; i < npcs.length; i++) {
                  distinctNpcs[npcs[i].value.split(",")[0]] = 1;
                }
                if (PLU.TMP.puzzleWating.action == "fight") {
                  for (var npcid in distinctNpcs) {
                    PLU.autoFight({
                      targetKey: npcid,
                      fightKind: "fight",
                      autoSkill: "multi",
                      onFail() {
                        PLU.autoFight({
                          targetKey: npcid,
                          fightKind: "kill",
                          autoSkill: "multi",
                        });
                      },
                    });
                  }
                } else {
                  for (var npcid in distinctNpcs) {
                    PLU.execActions(PLU.TMP.puzzleWating.actionCode + " " + npcid);
                  }
                }
              }
              break;
            case "get":
              if (PLU.TMP.puzzleWating.status == "traced") {
                PLU.TMP.puzzleWating.status = "wait";
                var objs = g_obj_map.get("msg_room").elements.filter(function (item) {
                  return item.key.indexOf("item") == 0 && that.ansiToHtml(item.value.split(",")[1]) == PLU.TMP.puzzleWating.target;
                });
                if (objs.length > 0) {
                  for (var index in objs) {
                    PLU.execActions("get " + objs[index].value.split(",")[0]);
                  }
                } else {
                  var npcs = g_obj_map.get("msg_room").elements.filter(function (item) {
                    return (
                      item.key.indexOf("npc") == 0 && !isNaN(item.key.replace("npc", "")) && item.value.indexOf("金甲符兵") == -1 && item.value.indexOf("玄阴符兵") == -1
                    );
                  });
                  that.lookNpcForBuy(
                    npcs,
                    function () {
                      PLU.TMP.puzzleWating.status = "return";
                      PLU.execActions("find_task_road2 " + puzzleid);
                    },
                    function () {
                      npcs = g_obj_map.get("msg_room").elements.filter(function (item) {
                        return (
                          item.key.indexOf("npc") == 0 &&
                          !isNaN(item.key.replace("npc", "")) &&
                          item.value.indexOf("金甲符兵") == -1 &&
                          item.value.indexOf("玄阴符兵") == -1
                        );
                      });
                      that.lookNpcForKillGet(npcs);
                    },
                  );
                }
              } else {
                if (PLU.TMP.puzzleWating.status == "returned") {
                  var npcs = g_obj_map.get("msg_room").elements.filter(function (item) {
                    return item.key.indexOf("npc") == 0 && that.ansiToHtml(item.value.split(",")[1]) == PLU.TMP.puzzleWating.target;
                  });
                  if (npcs.length > 0) {
                    for (var index in npcs) {
                      if (npcs[index].value) PLU.execActions("give " + npcs[index].value.split(",")[0]);
                    }
                  }
                }
              }
              break;
            case "room_sousuo":
              PLU.execActions("room_sousuo");
              break;
          }
        },
        lookNpcForBuy: function (npcs, foundcallback, notfoundcallback) {
          if (PLU.TMP.puzzleWating.actionCode != "get") return;
          if (npcs.length > 0) {
            var that = this;
            var npc = npcs.shift();
            var npcid = npc.value.split(",")[0];
            PLU.execActions("look_npc " + npcid);
            setTimeout(function () {
              that.getNpcInfoForBuy(npcid, npcs, foundcallback, notfoundcallback);
            }, 200);
          } else {
            notfoundcallback && notfoundcallback();
          }
        },
        getNpcInfoForBuy: function (npcid, othernpcs, foundcallback, notfoundcallback) {
          if (PLU.TMP.puzzleWating.actionCode != "get") return;
          var that = this;
          if (!g_obj_map.get("msg_npc") || g_obj_map.get("msg_npc").get("id") != npcid) {
            setTimeout(function () {
              that.getNpcInfoForBuy(npcid, othernpcs, foundcallback, notfoundcallback);
            }, 200);
            return;
          }
          var cmds = g_obj_map.get("msg_npc").elements.filter(function (item) {
            return item.value == "购买";
          });
          if (cmds.length > 0) {
            PLU.execActions("buy " + npcid);
            setTimeout(function () {
              that.getNpcBuyInfo(npcid, othernpcs, foundcallback, notfoundcallback);
            }, 200);
          } else {
            if (othernpcs.length > 0) {
              var npc = othernpcs.shift();
              var npcid = npc.value.split(",")[0];
              PLU.execActions("look_npc " + npcid);
              setTimeout(function () {
                that.getNpcInfoForBuy(npcid, othernpcs, foundcallback, notfoundcallback);
              }, 200);
            } else {
              notfoundcallback && notfoundcallback();
            }
          }
        },
        getNpcBuyInfo: function (npcid, othernpcs, foundcallback, notfoundcallback) {
          if (PLU.TMP.puzzleWating.actionCode != "get") return;
          var that = this;
          if (!g_obj_map.get("msg_buys") || g_obj_map.get("msg_buys").get("npcid") != npcid) {
            setTimeout(function () {
              that.getNpcBuyInfo(npcid, othernpcs, foundcallback, notfoundcallback);
            }, 200);
            return;
          }
          var buyitems = g_obj_map.get("msg_buys").elements.filter(function (item) {
            return item.key.indexOf("item") == 0 && that.ansiToHtml(item.value.split(",")[1]) == PLU.TMP.puzzleWating.target;
          });
          if (buyitems.length > 0) {
            for (var i = 0; i < buyitems.length; i++) {
              PLU.execActions("buy " + buyitems[i].value.split(",")[0] + " from " + npcid);
            }
            foundcallback && foundcallback();
          } else {
            if (othernpcs.length > 0) {
              var npc = othernpcs.shift();
              var npcid = npc.value.split(",")[0];
              PLU.execActions("look_npc " + npcid);
              setTimeout(function () {
                that.getNpcInfoForBuy(npcid, othernpcs, foundcallback, notfoundcallback);
              }, 200);
            } else {
              notfoundcallback && notfoundcallback();
            }
          }
        },
        lookNpcForKillGet: function (npcs, foundcallback, notfoundcallback) {
          if (PLU.TMP.puzzleWating.actionCode != "get") return;
          if (npcs.length > 0) {
            var that = this;
            var npc = npcs.shift();
            var npcid = npc.value.split(",")[0];
            PLU.execActions("look_npc " + npcid);
            setTimeout(function () {
              that.getNpcInfoForKillGet(npcid, npcs, foundcallback, notfoundcallback);
            }, 200);
          } else {
            notfoundcallback && notfoundcallback();
          }
        },
        getNpcInfoForKillGet: function (npcid, othernpcs, foundcallback, notfoundcallback) {
          if (PLU.TMP.puzzleWating.actionCode != "get") return;
          var that = this;
          if (!g_obj_map.get("msg_npc") || g_obj_map.get("msg_npc").get("id") != npcid) {
            setTimeout(function () {
              that.getNpcInfoForKillGet(npcid, othernpcs, foundcallback, notfoundcallback);
            }, 200);
            return;
          }
          var cmds = g_obj_map.get("msg_npc").elements.filter((item) => {
            return item.value == "杀死";
          });
          if (cmds.length > 0 && g_obj_map.get("msg_npc").get("long").indexOf(PLU.TMP.puzzleWating.target) > -1) {
            PLU.TMP.puzzleWating.waitTarget = npcid;
            PLU.execActions("kill " + npcid);
            foundcallback && foundcallback();
          } else {
            if (othernpcs.length > 0) {
              var npc = othernpcs.shift();
              var npcid = npc.value.split(",")[0];
              PLU.execActions("look_npc " + npcid);
              setTimeout(function () {
                that.getNpcInfoForKillGet(npcid, othernpcs, foundcallback, notfoundcallback);
              }, 200);
            } else {
              notfoundcallback && notfoundcallback();
            }
          }
        },
        puzzlekillget: function () {
          var npcname = prompt("请输入要杀的npc名称", "");
          if (npcname) {
            PLU.TMP.puzzleWating.actionCode = "killget";
            PLU.TMP.puzzleWating.waitTargetName = npcname;
          }
        },
        ansiToHtml: function (str) {
          return ansi_up.ansi_to_html(str).replace(/\x1B/g, "");
        },
        puzzlesubmit: function (puzzleid) {
          let mapname = PLU.YFD.cityId[PLU.TMP.puzzleList[puzzleid].publisherMap] ?? PLU.TMP.puzzleList[puzzleid].publisherMap;
          let value =
            mapname + "@" + ansi_up.ansi_to_html(PLU.TMP.puzzleList[puzzleid].publisherRoom).replace(/<[^>]*>/g, "") + "@" + PLU.TMP.puzzleList[puzzleid].firstStep;
          if (!PLU.getCache("listenPuzzle")) unsafeWindow.clickButton("chat " + value);
        },
      };
    },
    //================================================================================================
    toQueryMiTi() {
      let defaultMapId = PLU.getCache("pathFindMiTi") || "1";
      let citys = PLU.YFD.cityList
        .map((c, i) => {
          let issel = i + 1 == defaultMapId ? "selected" : "";
          return '<option value="' + (i + 1) + '" ' + issel + ">" + c + "</option>";
        })
        .join("");
      YFUI.showPop({
        title: "全图找谜题",
        text: `选择地图, 输入关键词（人物，地点，物品）列表（英文逗号隔开）<br>可模糊匹配<br>
            <div style='margin:10px 0;'>
              <span>去哪找: </span>
              <select id="pathFindMap" style="font-size:15px;height:32px;width:81%;border:1px solid #444;">
                ${citys}
              </select>
            </div>
            <div style='margin:10px 0;'>
              <span>要找啥: </span>
              <input id="pathFindKeyword" value="${PLU.getCache("pathFindKeyword") || "柴绍,李秀宁,大鹳淜洲,天罗紫芳衣"
          }" style="font-size:14px;height:26px;width:80%;border:1px solid #444;"></input>
            </div>`,
        onOk() {
          let mapStr = $.trim($("#pathFindMap").val()),
            KeywordStr = $.trim($("#pathFindKeyword").val());
          if (!KeywordStr) return;
          PLU.setCache("pathFindMap", mapStr);
          PLU.setCache("pathFindKeyword", KeywordStr);
          let jhMap = PLU.YFD.mapsLib.Map[parseInt(mapStr) - 1];
          if (!jhMap) {
            return YFUI.writeToOut("<span style='color:#F66;'>---无地图数据---</span>");
          } else {
            let ways = jhMap.way.split(";");
            console.log({ paths: ways, idx: 0, objectKeyword: KeywordStr });
            PLU.MiTiArray = [];
            PLU.goPathFindMiTi({
              paths: ways,
              idx: 0,
              objectKeyword: KeywordStr,
            });
          }
        },
        onNo() { },
      });
    },
    goPathFindMiTi(params) {
      //goFindYouxia
      if (params.idx >= params.paths.length) {
        setTimeout(() => {
          PLU.execActions("home");
        }, 100);
        YFUI.writeToOut("<span style='color:#FFF;'>--找不到目标谜题!...已搜索完地图--</span>");
        return;
      }
      let acs = [params.paths[params.idx]];
      PLU.actions({
        paths: acs,
        idx: 0,
        onPathsEnd() {
          let npcArray = UTIL.getRoomAllNpc();
          UTIL.addSysListener("MiTi", (b, type, subtype, msg) => {
            if (type != "main_msg") return;
            if (msg.match(params.objectKeyword)) PLU.MiTiArray.push(msg);
          });
          for (var npc of npcArray) {
            PLU.execActions("auto_tasks cancel;ask " + npc.key);
          }
          UTIL.delSysListener("MiTi");
          if (PLU.MiTiArray.length) {
            YFUI.writeToOut("<span style='color:#FFF;'>--目标谜题已找到--</span>");
            return;
          } else {
            setTimeout(() => {
              params.idx++;
              PLU.goPathFindMiTi(params);
            }, 500);
          }
        },
        onPathsFail() {
          setTimeout(() => {
            PLU.execActions("home");
          }, 500);
          YFUI.writeToOut("<span style='color:#FFF;'>--路径中断--</span>");
          return;
        },
      });
    },
    //================================================================================================
    goNpcWay(desc, way) {
      let goList = PLU.getCache("prevQueryList") || [];
      let newList = goList.filter((e) => e.desc != desc);
      let len = newList.unshift({ desc: desc, way: way });
      if (len > 10) newList.length = 10;
      PLU.setCache("prevQueryList", newList);
      PLU.execActions(way);
    },
    //================================================================================================
    showNpcWay(desc, way) {
      let text = "<span style='color:blue;background:rgba(255,255,244,0.8);padding:1px 10px;display:inline-block;word-break:break-all;'>" + way + "</span></br>";
      let way2 = PLU.linkPath(PLU.queryRoomPath(), way);
      let way3 = PLU.minPath(PLU.queryRoomPath(), way);
      if (way != way2) {
        text +=
          "<span style='color:blue;background:rgba(255,255,244,0.8);padding:1px 10px;display:inline-block;word-break:break-all;'>同图路径（？）：" +
          way2 +
          "</span></br>";
        text +=
          "<span style='color:blue;background:rgba(255,255,244,0.8);padding:1px 10px;display:inline-block;word-break:break-all;'>最短路径（？）：" +
          way3 +
          "</span></br>";
      }
      YFUI.showPop({
        title: "路径详情：" + desc,
        text: text,
        autoOk: 10,
        okText: "关闭",
        noText: "前往",
        onOk() { },
        onNo() {
          PLU.goNpcWay(desc, way);
        },
      });
    },
    //================================================================================================
    toQueryHistory() {
      let prevList = PLU.getCache("prevQueryList") || [];
      if (prevList.length == 0) return YFUI.writeToOut("<span style='color:#F66;'>---无历史数据---</span>");
      for (let i = prevList.length - 1; i >= 0; i--) {
        let e = prevList[i];
        YFUI.writeToOut(
          "<span><a style='text-decoration:underline;color:yellow;cursor:pointer;' onclick='PLU.goNpcWay(\"" +
          e.desc +
          '","' +
          e.way +
          "\")'>" +
          e.desc +
          "</a> &nbsp;&nbsp;<a style='text-decoration:underline;color:yellow;cursor:pointer;' onclick='PLU.showNpcWay(\"" +
          e.desc +
          '","' +
          e.way +
          "\")'>路径详情</a></span>",
        );
      }
      YFUI.writeToOut("<span>----------</span>");
    },
    //================================================================================================
    showMPFZ($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        $("#topMonitor").hide();
        $("#btn_bt_showMPFZ").text("纷争显示");
        PLU.setCache("showTopMonitor", 0);
        return;
      }
      $("#topMonitor").show();
      $("#btn_bt_showMPFZ").text("纷争隐藏");
      PLU.setCache("showTopMonitor", 1);
    },
    //================================================================================================
    openCombineGem() {
      let htm = "<div>";
      PLU.YFD.gemType.forEach((t, ti) => {
        htm += "<div>";
        PLU.YFD.gemPrefix.forEach((p, pi) => {
          if (pi > 2)
            htm +=
              '<button onclick="PLU.combineGem(' +
              ti +
              "," +
              pi +
              ')" style="color:' +
              t.color +
              ';width:18%;margin:2px 1%;padding:3px;">' +
              (p.substr(0, 2) + t.name.substr(0, 1)) +
              "</button>";
        });
        htm += "</div>";
      });
      htm += "</div>";
      htm += `<div style="margin:10px 0 0 3px;position:absolute;left:15px;bottom:10px;">每次连续合成最多 <input id="maxCombine" type="number" value="1" style="width:50px;height:25px;line-height:25px;" maxlength="3" min=1 max=9999 oninput="if(value.length>4)value=value.substr(0,4)"/> 颗宝石。</div>`;
      YFUI.showPop({
        title: "合成宝石",
        text: htm,
        width: "382px",
        okText: "关闭",
        onOk() { },
      });
    },
    //================================================================================================
    combineGem(type, grade) {
      if (PLU.TMP.combineTooFast) return YFUI.writeToOut("<span style='color:#F66;'>--点击不要太快!--</span>");
      PLU.TMP.combineTooFast = setTimeout(() => {
        PLU.TMP.combineTooFast = null;
      }, 600000);
      let targetNum = parseInt($("#maxCombine").val()) || 1;
      let getNum = 0;
      let countString = (combineNum, gemCode) => {
        let combineStr = "";
        if (combineNum % 3 != 0) return "";
        combineStr += "items hecheng " + gemCode + "_N_" + Math.floor(combineNum / 3) + ";";
        return combineStr;
      };
      let needGem = (gemGrade, needNum, gemList) => {
        if (gemGrade < 0) return null;
        let gemName = PLU.YFD.gemPrefix[gemGrade] + PLU.YFD.gemType[type].name;
        let gemCode = PLU.YFD.gemType[type].key + "" + (gemGrade + 1);
        let objGem = gemList.find((e) => e.name == gemName);
        let gemNum = objGem?.num ?? 0;
        if (gemNum >= needNum) {
          return countString(needNum, gemCode);
        } else {
          let dtNum = needNum - gemNum;
          let next = needGem(gemGrade - 1, 3 * dtNum, gemList);
          if (next) return next + countString(needNum, gemCode);
          return null;
        }
      };
      let countCombine = function (cb) {
        PLU.getGemList((gemList) => {
          let runStr = needGem(grade - 1, 3, gemList);
          if (runStr) {
            PLU.fastExec(runStr + "items", () => {
              YFUI.writeToOut("<span style='color:white;'>==合成宝石x1==</span>");
              getNum++;
              targetNum--;
              if (targetNum > 0) {
                countCombine(() => {
                  cb && cb(true);
                });
              } else {
                cb && cb(true);
              }
            });
          } else {
            YFUI.writeToOut("<span style='color:#F66;'>--没有足够的宝石!--</span>");
            cb && cb(false);
          }
        });
      };
      countCombine((end) => {
        clearTimeout(PLU.TMP.combineTooFast);
        PLU.TMP.combineTooFast = null;
        YFUI.writeToOut("<span style='color:white;'>==合成宝石结束! 得到宝石x" + getNum + "==</span>");
      });
    },
    //================================================================================================
    getGemList(callback) {
      let getItemsTimeOut = setTimeout(() => {
        UTIL.delSysListener("getListItems");
      }, 5000);
      UTIL.addSysListener("getListItems", function (b, type, subtype, msg) {
        if (type != "items" || subtype != "list") return;
        UTIL.delSysListener("getListItems");
        clearTimeout(getItemsTimeOut);
        //clickButton("prev");
        let iId = 1,
          itemList = [];
        while (b.get("items" + iId)) {
          let it = UTIL.filterMsg(b.get("items" + iId)).split(",");
          if (it && it.length > 4 && it[3] == "0" && it[1].match("宝石"))
            itemList.push({
              key: it[0],
              name: it[1],
              num: Number(it[2]),
            });
          iId++;
        }
        callback && callback(itemList);
      });
      clickButton("items", 0);
    },
    //================================================================================================
    getAllItems(callback) {
      let getItemsTimeOut = setTimeout(() => {
        UTIL.delSysListener("getListItems");
      }, 5000);
      UTIL.addSysListener("getListItems", (b, type, subtype, msg) => {
        if (type != "items" || subtype != "list") return;
        UTIL.delSysListener("getListItems");
        clearTimeout(getItemsTimeOut);
        clickButton("prev");
        let iId = 1,
          itemList = [];
        while (b.get("items" + iId)) {
          let it = UTIL.filterMsg(b.get("items" + iId)).split(",");
          if (it && it.length > 4)
            itemList.push({
              key: it[0],
              name: it[1],
              num: Number(it[2]),
              equipped: it[3] == "0",
            });
          iId++;
        }
        callback && callback(itemList);
      });
      clickButton("items", 0);
    },
    //================================================================================================
    saveSetting() {
      YFUI.showPop({
        title: "设置上传",
        text: "<b style='color:red;'>确定要上传当前角色脚本设置吗？</b>",
        onOk() {
          let cacheData = UTIL.getMem("CACHE");
          $.ajax({
            url: "http://www.jiaozis.work:8765/comm/save",
            type: "POST",
            data: { data_key: btoa(escape(PLU.accId)), data_type: "CACHE", data_value: btoa(escape(cacheData)) },
            dataType: "json",
            success: (res) => {
              if (res.code == "00000") {
                YFUI.writeToOut("<span><span style='color:#AF0;'>本地脚本设置上传成功!</span></span>");
              } else {
                YFUI.writeToOut("<span><span style='color:#F80;'>上传失败!(" + res.msg + ")</span></span>");
              }
            },
          });
        },
        onNo() { },
      });
    },
    //================================================================================================
    loadSetting() {
      $.ajax({
        url: "http://www.jiaozis.work:8765/comm/load",
        type: "POST",
        data: { data_key: btoa(escape(PLU.accId)) },
        dataType: "json",
        success: (res) => {
          if (res.code == "00000") {
            let cacheData = unescape(atob(res.data[0].data_value));
            YFUI.showPop({
              title: "设置下载",
              text: "<span style='color:#360;'>角色脚本设置下载成功！是否替换本地设置？</span>",
              autoOk: 10,
              onOk() {
                UTIL.setMem("CACHE", cacheData);
                PLU.initStorage();
                YFUI.writeToOut("<span><span style='color:#AF0;'>本地脚本设置替换成功!</span></span>");
              },
              onNo() { },
            });
          } else {
            YFUI.writeToOut("<span><span style='color:#F80;'>下载失败!(" + res.msg + ")</span></span>");
          }
        },
      });
    },
  };
  //=================================================================================
  // UTIL模块
  //=================================================================================
  unsafeWindow.UTIL = {
    //================
    accId: null,
    sysListeners: {},
    logHistory: [],
    //================
    getUrlParam(key) {
      let res = null,
        au = location.search.split("?"),
        sts = au[au.length - 1].split("&");
      sts.forEach((p) => {
        if (p.split("=").length > 1 && key == p.split("=")[0]) res = unescape(p.split("=")[1]);
      });
      return res;
    },
    getAccId() {
      this.accId = this.getUrlParam("id");
      return this.accId;
    },
    setMem(key, data) {
      localStorage.setItem("PLU_" + this.accId + "_" + key, data);
    },
    getMem(key) {
      return localStorage.getItem("PLU_" + this.accId + "_" + key);
    },
    rnd() {
      return Math.floor(Math.random() * 1000000);
    },
    getuuid: function () {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },
    getNow(timestamp) {
      var date = timestamp ? new Date(timestamp) : new Date();
      var Y = date.getFullYear();
      var M = (date.getMonth() + 1 + "").padStart(2, "0");
      var D = (date.getDate() + "").padStart(2, "0");
      var h = (date.getHours() + "").padStart(2, "0");
      var m = (date.getMinutes() + "").padStart(2, "0");
      var s = (date.getSeconds() + "").padStart(2, "0");
      return M + "-" + D + " " + h + ":" + m + ":" + s;
    },
    log({ msg, type, time, isHistory }) {
      let style = "color:#333";
      if (type == "TF") {
        let co = msg.match("夜魔") ? "#F0F" : "#666";
        style = "color:" + co;
      } else if (type == "QL") {
        style = "color:#00F";
      } else if (type == "MPFZ") {
        style = "color:#F60";
      } else if (type == "LPFZ") {
        style = "color:#033";
      } else if (type == "KFQL") {
        style = "color:#F00;background:#FF9;";
      } else if (type == "YX") {
        let co2 = msg.match("宗师】") ? "#00F" : msg.match("侠客】") ? "#08F" : msg.match("魔尊】") ? "#F00" : msg.match("邪武】") ? "#F80" : "#999";
        style = "color:" + co2 + ";background:#CFC;";
      } else if (type == "BF") {
        style = "color:#FFF;background:#93C;";
      } else if (type == "TIPS") {
        style = "color:#29F";
      }
      //console.log('%c%s',style,this.getNow(time)+msg)
      if (!isHistory) {
        this.logHistory.push({ msg, type, time });
        this.setMem("HISTORY", JSON.stringify(this.logHistory));
      }
      let evt = new Event("addLog");
      evt.ext = { msg, type, time, style };
      document.dispatchEvent(evt);
    },
    filterMsg(s) {
      if (typeof s == "string") return s.replace(/[\033|\27|\0x1b]\[[0-9|;]+m/gi, "");
      return "";
    },
    sysDispatchMsg(b, type, subtype, msg) {
      for (var key in this.sysListeners) {
        this.sysListeners[key](b, type, subtype, msg);
      }
    },
    addSysListener(key, fn) {
      this.sysListeners[key] = fn;
    },
    delSysListener(key) {
      delete this.sysListeners[key];
    },
    findRoomNpc(npcName, gb, searchAll) {
      console.debug(npcName);
      let roomInfo = g_obj_map.get("msg_room");
      if (!roomInfo) return null;
      for (let i = roomInfo.elements.length - 1; i >= 0; i--) {
        let bNpc = this.getSpNpcByIdx(roomInfo, i, searchAll);
        if (bNpc && bNpc.name == npcName) {
          if (!gb) return bNpc;
          else {
            let gNpc = this.getSpNpcByIdx(roomInfo, i - 1);
            if (gNpc) return gNpc;
          }
        }
      }
      return null;
    },
    roomHasNpc() {
      let roomInfo = g_obj_map.get("msg_room");
      let res = false;
      if (!roomInfo) return null;
      for (let i = roomInfo.elements.length - 1; i >= 0; i--) {
        if (roomInfo.elements[i].key.match("npc")) {
          res = true;
          break;
        }
      }
      return res;
    },
    getRoomAllNpc() {
      let roomInfo = g_obj_map.get("msg_room");
      let res = [];
      if (!roomInfo) return res;
      for (let i = roomInfo.elements.length - 1; i >= 0; i--) {
        let npc = roomInfo.elements[i].key.match(/npc(\d+)/);
        if (npc) {
          let infoArr = roomInfo.elements[i].value.split(",");
          let name = this.filterMsg(infoArr[1]);
          res.push({ name: name, key: infoArr[0] });
        }
      }
      return res;
    },
    findRoomNpcReg(npcName) {
      let roomInfo = g_obj_map.get("msg_room");
      if (!roomInfo) return null;
      for (let i = roomInfo.elements.length - 1; i >= 0; i--) {
        let npc = roomInfo.elements[i].key.match(/npc(\d+)/);
        if (npc) {
          let infoArr = roomInfo.elements[i].value.split(",");
          let name = this.filterMsg(infoArr[1]);
          if (name.match(npcName)) return { name: name, key: infoArr[0] };
        }
      }
      return null;
    },
    getSpNpcByIdx(roomInfo, idx, searchAll) {
      let npcInfo = roomInfo.get("npc" + idx);
      if (npcInfo) {
        let infoArr = npcInfo.split(",");
        let name = this.filterMsg(infoArr[1]);
        if (searchAll) return { name: name, key: infoArr[0] };
        if (name != infoArr[1]) return { name: name, key: infoArr[0] };
      }
      return null;
    },
    getItemFrom(name) {
      if (g_gmain.is_fighting) return;
      var item = g_obj_map.get("msg_room")?.elements.find((it) => it.key.substring(0, 4) == "item" && it.value.indexOf(name) >= 0);
      if (item) {
        clickButton("get " + item.value.split(",")[0]);
      }
    },
    inHome() {
      return gSocketMsg._is_in_home;
    },
  };
  //=================================================================================
  // UI模块
  //=================================================================================
  unsafeWindow.YFUI = {
    init() {
      let maxW = $("#out").width() > 634 ? 634 : $("#out").width();
      console.log($("#page").width(), $("#out").width());
      let rightStyle = $("#page").width() - $("#out").width() > 4 ? "left:" + (maxW - 76 + 4) + "px;" : "right:0;";
      this.$Panel = $(
        '<div id="WJPlug_Panel" style="pointer-events:none;position:absolute;z-index:9999;' +
        rightStyle +
        ';top:5.5%;font-size:12px;line-height:1.2;text-align:right;list-style:none;">',
      );
      $("body").append(this.$Panel);
    },
    addBtnGroup({ id, style }) {
      let $box = $('<div id="' + id + '" style="position:relative;"></div>');
      style && $box.css(style);
      this.$Panel.append($box);
      return $box;
    },
    addBtn({ id, groupId, text, onclick, style, boxStyle, extend, children, canSet }) {
      let $box = $('<div id="' + id + '" class="btn-box" style="position:relative;pointer-events:auto;"></div>');
      let $btn = $(
        '<button id="btn_' +
        id +
        '" style="padding:4px 2px;box-sizing:content-box;margin:1px 1px;border:1px solid #333;border-radius:4px;width:68px;">' +
        text +
        "</button>",
      );
      style && $btn.css(style);
      boxStyle && $box.css(boxStyle);
      $btn.$extend = extend;
      $btn.click((e) => {
        onclick && onclick($btn, $box);
      });
      $box.append($btn);
      if (children) $box.append($('<b style="position:absolute;left:1px;top:3px;font-size:12px;">≡</b>'));
      if (canSet) {
        let $setbtn = $(
          '<i style="position:absolute;right:-8px;top:2px;font-size:14px;background:#333;color:#fff;font-style:normal;;line-height:1;border:1px solid #CCC;border-radius:100%;padding:2px 6px;cursor:pointer;">S</i>',
        );
        $box.append($setbtn);
        $setbtn.click((e) => {
          onclick && onclick($btn, $box, "setting");
        });
      }
      groupId ? $("#" + groupId).append($box) : this.$Panel.append($box);
      $box.$button = $btn;
      return $box;
    },
    addMenu({ id, groupId, text, extend, style, menuStyle, multiCol, onclick, children }) {
      //{text,id,btnId}
      let $btnBox = this.addBtn({ id, groupId, text, extend, style, children }),
        _this = this;
      function addMenuToBtn({ btnId, $parent, list, menuStyle }) {
        let $listBox = $('<div id="menu_' + btnId + '" class="menu" style="position:absolute;top:0;right:' + $parent.width() + 'px;display:none;"></div>');
        $parent.append($listBox);
        list &&
          list.forEach((sub) => {
            let btnOpt = Object.assign({}, sub, { groupId: "menu_" + btnId });
            if (!btnOpt.onclick) {
              btnOpt.onclick = onclick;
            }
            if (multiCol) btnOpt.boxStyle = Object.assign({}, { display: "inline-block" }, btnOpt.boxStyle);
            let $subBtnBox = _this.addBtn(btnOpt);
            if (sub.children)
              $subBtnBox.$list = addMenuToBtn({
                btnId: sub.id,
                $parent: $subBtnBox,
                list: sub.children,
                menuStyle: sub.menuStyle,
          });
          });
        $parent.$button.click((e) => {
          $listBox.toggle().css({ right: $parent.width() + 5 });
          menuStyle && $listBox.css(menuStyle);
          $listBox.is(":visible") && $listBox.parent().siblings(".btn-box").find(".menu").hide();
          onclick && onclick($parent.$button, $parent);
        });
        return $listBox;
      }
      $btnBox.$list = addMenuToBtn({
        btnId: id,
        $parent: $btnBox,
        list: children,
        menuStyle: menuStyle,
      });
      return $btnBox;
    },
    showPop(params) {
      if ($("#myTools_popup").length) $("#myTools_popup").remove();
      params = params || {};
      let okText = params.okText || "确定",
        noText = params.noText || "取消",
        _this = this;
      _this.SI_autoOk && clearInterval(_this.SI_autoOk);
      _this.SI_autoOk = null;
      let ph = `<div style="z-index:9999;position:fixed;top: 40%;left:50%;width:100%;height:0;font-size:14px;" id="myTools_popup">
            <div class="popup-content" style="width:${params.width || "70%"
        };max-width:512px;background: rgba(255,255,255,.8);border:1px solid #999999;border-radius: 10px;transform: translate(-50%,-50%) scale(.1,.1);transition:all .1s;">
            <div style="padding: 10px 15px;"><span style="font-weight:700;">${params.title || ""
        }</span><span style="float:right;color:#666;cursor:pointer;" class="btncl">✖</span></div>
            <div style="padding: 0 15px;line-height:1.5;max-height:500px;overflow-y:auto;">${params.text || ""}</div>
            <div style="text-align:right;padding: 10px;">`;
      if (params.onNo) ph += `<button style="margin-right: 15px;padding: 5px 20px;border: 1px solid #000;border-radius:5px;" class="btnno">${noText}</button>`;
      ph += `<button style="padding: 5px 20px;background-color: #963;color:#FFF;border: 1px solid #000;border-radius: 5px;" class="btnok">${okText}</button>
            </div></div></div>`;
      let $ph = $(ph);
      $("body").append($ph);
      setTimeout(() => {
        $ph.find(".popup-content").css({ transform: "translate(-50%,-50%) scale(1,1)" });
        params.afterOpen && params.afterOpen($ph);
      }, 100);
      if (params.autoOk) {
        let autoCloseN = Number(params.autoOk);
        $("#myTools_popup .btnok").text(okText + "(" + autoCloseN + "s)");
        _this.SI_autoOk = setInterval(() => {
          autoCloseN--;
          $("#myTools_popup .btnok").text(okText + "(" + autoCloseN + "s)");
          if (autoCloseN < 1) {
            $ph.find(".btnok").click();
          }
        }, 1000);
      } else if (params.autoNo) {
        let autoCloseN = Number(params.autoNo);
        $("#myTools_popup .btnno").text(noText + "(" + autoCloseN + "s)");
        _this.SI_autoOk = setInterval(() => {
          autoCloseN--;
          $("#myTools_popup .btnno").text(noText + "(" + autoCloseN + "s)");
          if (autoCloseN < 1) {
            $ph.find(".btnno").click();
          }
        }, 1000);
      }
      $ph.find(".btncl").click((e) => {
        _this.SI_autoOk && clearInterval(_this.SI_autoOk);
        params.onX && params.onX();
        $ph.remove();
      });
      $ph.find(".btnno").click((e) => {
        _this.SI_autoOk && clearInterval(_this.SI_autoOk);
        params.onNo && params.onNo();
        $ph.remove();
      });
      $ph.find(".btnok").click((e) => {
        _this.SI_autoOk && clearInterval(_this.SI_autoOk);
        params.onOk && params.onOk($ph);
        $ph.remove();
      });
    },
    showInput(params) {
      let popParams = Object.assign({}, params);
      let inpstyle = "font-size:14px;line-height:1.5;width:100%;padding:5px;border:1px solid #999;border-radius:5px;margin:5px 0;outline:none;box-sizing:border-box;";
      if (params.inputs && params.inputs.length > 1) {
        for (let i = 0; i < params.inputs.length; i++) {
          let val = params.value[i] || "";
          popParams.text += `<div><div style="width:20%;float:left;margin:5px 0;line-height:2;text-align:right;">${params.inputs[i]}: </div><div style="width:73%;margin-left:21%;">`;
          popParams.text +=
            params.type == "textarea"
              ? `<textarea id="myTools_popup_input_${i}" rows="4" style="${inpstyle}">${val}</textarea></div></div>`
              : `<input id="myTools_popup_input_${i}" type="text" value="${val}" style="${inpstyle}"/></div></div>`;
        }
        popParams.onOk = () => {
          let val = [];
          for (let i = 0; i < params.inputs.length; i++) {
            val.push($("#myTools_popup_input_" + i).val());
          }
          params.onOk(val);
        };
      } else {
        popParams.text +=
          params.type == "textarea"
            ? `<div><textarea id="myTools_popup_input" rows="4" style="${inpstyle}">${params.value || ""}</textarea></div>`
            : `<div><input id="myTools_popup_input" type="text" value="${params.value || ""}" style="${inpstyle}"/></div>`;
        popParams.onOk = () => {
          let val = $("#myTools_popup_input").val();
          params.onOk(val);
        };
      }
      this.showPop(popParams);
    },
    showInfoPanel(params) {
      if ($("#myTools_InfoPanel").length) $("#myTools_InfoPanel").remove();
      params = params || {};
      let okText = params.okText || "关闭",
        noText = params.noText || "清空",
        _this = this;
      let $ph = $(`<div style="z-index:9900;position:fixed;top:10%;left:0;width:100%;height:0;font-size:12px;" id="myTools_InfoPanel">
            <div class="infoPanel-content" style="width:${params.width || "75%"
        };max-width:512px;height:620px;background: rgba(255,255,255,.9);border:1px solid #999;border-radius:0 10px 10px 0;transform: translate(-100%,0);transition:all .1s;">
                <div style="padding: 10px 15px;"><span style="font-weight:700;">${params.title || ""
        }</span><span style="float:right;color:#666;cursor:pointer;" class="btncl">✖</span></div>
                <div style="padding: 0 15px;line-height:1.5;height:550px;overflow-y:auto;" class="infoPanel-wrap">${params.text || ""}</div>
                <div style="text-align:right;padding: 10px;">
                <button style="padding: 5px 20px;background-color: #969;color:#FFF;border: 1px solid #000;border-radius: 5px;margin-right:25px;" class="btnno">${noText}</button>
                <button style="padding: 5px 20px;background-color: #963;color:#FFF;border: 1px solid #000;border-radius: 5px;" class="btnok">${okText}</button>
                </div>
            </div></div>`);
      $("body").append($ph);
      setTimeout(() => {
        $ph.find(".infoPanel-content").css({ transform: "translate(0,0)" });
        params.onOpen && params.onOpen();
      }, 100);
      $ph.find(".btncl").click((e) => {
        params.onClose && params.onClose();
        $ph.remove();
      });
      $ph.find(".btnok").click((e) => {
        params.onOk && params.onOk();
        params.onClose && params.onClose();
        $ph.remove();
      });
      $ph.find(".btnno").click((e) => {
        params.onNo && params.onNo();
      });
      return $ph;
    },
    writeToOut(html) {
      var m = new unsafeWindow.Map();
      m.put("type", "main_msg");
      m.put("subtype", "html");
      m.put("msg", html);
      gSocketMsg.dispatchMessage(m);
    },
  };
  PLU.autoPuzzle = PLU.AutoPuzzle();
  attach();
  init();

});