// ==UserScript==
// @name         替换文字/emoji
// @namespace    http://tampermonkey.net/
// @include        http://tieba.baidu.com/*
// @include        https://tieba.baidu.com/*
// @exclude        http://tieba.baidu.com/tb*
// @version      0.1
// @description  Modified from http://www.anoneh.com/093.php and stackoverflow.com/questions/10992921/how-to-remove-emoji-code-using-javascript
// @author       某b吧吧友
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380005/%E6%9B%BF%E6%8D%A2%E6%96%87%E5%AD%97emoji.user.js
// @updateURL https://update.greasyfork.org/scripts/380005/%E6%9B%BF%E6%8D%A2%E6%96%87%E5%AD%97emoji.meta.js
// ==/UserScript==

 var second = 3; //每几秒替换一轮
 var special= 1; // =1 启用防误译词组   =0 不启用

 setInterval(function() {
  var replacements,replacements0,regex,regex0,key, textnodes, node, s;




     //防误译单字
     replacements0 = {
      "孤": "寂寞",
      "杀": "干掉",
      "娃": "酱",
      "滚": "请离开呢喵~", //相撞的关键词，二段替换
      "请离开呢喵~出克": "请离开呢嘤嘤嘤~",
      "恰": "品",
      "酸": "委屈",
      "马": "母上大人",
      "儿": "孩子",
      "批": "喵",
      "啊": "啦",
       "。": "嘤嘤嘤~~",
       "，": "喵,",
       "？": "喵?"

     };



     //普通词
  replacements = {


    "抗压": "健康",
      "孙吧": "某个吧",
      "贴吧管理": "GM",
     "奥利给": "喵利给",
     "bilibili吧": "萌萌的新b吧",
    "如何评价": "人家想了解一下",
      "背刺": "背后突击",
    "nmsl": "你的母上大人会不高兴的喵～",
      "反串": "蹭得累",
      "吧主": "社长",
      "大吧": "社长",
      "吧务": "游戏管理员",
      "小吧": "游戏管理员",
      "带节奏": "跳舞",
      "钓鱼": "恶意卖萌",
      "8行": "不行喵",
      "憨憨": "老实人",
      "biss": "会吃苦头的喵",
      "阴阳人": "含蓄害羞的人",
      "暴毙": "突然be",
      "对线": "慢慢交流",
      "栽种": "Bugster",
       "five": "faiz",
       "Five": "Faiz",
      "阴阳怪气": "含蓄害羞",
      "8是": "不是",
      "幺蛾子": "不好的东西",
      "粪坑": "堆杂物的地方",
      "日漫痴": "日漫沉醉者",
      "弟弟": "欧豆豆",
       "几把": "愚蠢的欧豆豆",
       "sb": "baka",
       "傻 逼": "baka",
        "nc": "baka",
        "智障": "baka",
       "弱智": "baka",
       "弱 智": "baka",
        "傻逼": "baka",
        "脑瘫": "大baka",
       "傻子": "baka",
       "玩意": "东西喵",
       "什么东西": "什么啊喵",
       "司马": "惹怒母上",
       "狗": "人类之友",
       "妈": "母上大人",
       "粪": "尘",
        "在？": "在吗喵？",
      "高贵": "优雅",
      "弟中弟": "欧豆豆中的欧豆豆",
      "人肉": "禁忌搜索",
      "引战": "点燃战火",
       "在 ": "在吗喵",
      "睿智": "天真",
      "老子": "人家",
      "母亲": "母上大人",
      "二刺猿": "二次元",
      "gck": "请离开呢喵~",
      "GCK": "请离开呢喵~",
       "Hape": "baka",
       "hape": "baka",
       "gkd": "请注意时间呢喵~",
       "滚出克": "请离开呢喵~",
       "抗吧": "健康吧",
       "死了": "发生了悲伤的事",
       "死": "离开",
       "爬": "还请离开呢喵～",
       "爪巴": "还请离开呢喵～",
      "恶心": "让人不适",
      "搞事": "引起纷争",
      "嗷": "呜喵",
      "呕": "不舒服",
      "屁": "喵",
      "口区": "不舒服",
      "嘴臭": "忘了刷牙",
      "哥": "人家",
      "跪舔": "拥护",
      "屎": "糟糕物",
      "锤子": "小锤锤",
      "哥哥": "欧尼酱",
      "爷爷": "欧鸡桑",
      "臭": "不好闻的",
      "骨灰": "生命结晶",
      "哑巴": "无口",
      "剁了": "了结了",
      "牛逼": "好厉害啊喵",
      "牛批": "好厉害啊喵",
       "pxj": "活泼可爱的b站群众",
       "蛆": "小虫虫",
      };

regex0 = {};
regex = {};
var regex2 = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;

for (key in replacements0) {
    regex0[key] = new RegExp(key, 'g');
}

for (key in replacements) {
    regex[key] = new RegExp(key, 'g');
}

textnodes = document.evaluate( "//text()", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

for (var i = 0; i < textnodes.snapshotLength; i++) {
    node = textnodes.snapshotItem(i);
    s = node.data;

    for (key in replacements0) {
    if (special == 1)s = s.replace(regex0[key], replacements0[key]);
    }

    for (key in replacements) {
        s = s.replace(regex[key], replacements[key]);

      }

    //替换emoji
    s = s.replace("🐴", '母上大人喵');
    s = s.replace("🐎", '母上大人喵');
    s = s.replace(regex2, '喵喵'); //替换其余的emoji
    node.data = s;
}

},second*1000);

//弃用部分
function removeEmojis (string) {
  var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
  return string.replace(regex, '');
}