// ==UserScript==
// @name        64mi.reader.pinyin
// @namespace   clumsyman
// @description 将拼音转换为汉字
// @include     http://www.64mi.com/book/*
// @version     5
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4330/64mireaderpinyin.user.js
// @updateURL https://update.greasyfork.org/scripts/4330/64mireaderpinyin.meta.js
// ==/UserScript==

py2hz = {
    "ān wèi ": "安慰",
    "bǎi xìng ": "百姓",
    "bàn fǎ ": "办法",
    "bāng zhù ": "帮助",
    "bǎo bèi ": "宝贝",
    "biǎo xiàn ": "表现",
    "bǐ sài ": "比赛",
    "cāi cè ": "猜测",
    "càn làn ": "灿烂",
    "chǎn yè ": "产业",
    "chāo yuè ": "超越",
    "chén mò ": "沉默",
    "dá àn ": "答案",
    "dǎ duàn ": "打断",
    "dǎ suàn ": "打算",
    "dān xīn ": "担心",
    "dào xiè ": "道谢",
    "duì fù ": "对付",
    "fǎn yīng ": "反应",
    "fèi huà ": "废话",
    "fēng yìn ": "封印",
    "fú qì ": "服气",
    "gāo dù ": "高度",
    "gāo xìng": "高兴", //
    "gù yì ": "故意",
    "guān xì ": "关系",
    "hā hā": "哈哈",
    "hē hē ": "呵呵",
    "hé shì ": "合适",
    "hé zuò ": "合作",
    "huī fù ": "恢复",
    "huí qù ": "回去",
    "jī dòng ": "激动",
    "jì xù ": "继续",
    "jiàn miàn ": "见面",
    "jiāo dài ": "交待",
    "jiāo xùn ": "教训",
    "jiǎo bù ": "脚步",
    "jié shù ": "结束",
    "jìn kuài ": "尽快",
    "jīng guò ": "经过",
    "jiù mìng ": "救命",
    "jiù shì ": "就是",
    "jù jué ": "拒绝",
    "kǎo lǜ ": "考虑",
    "kě è ": "可恶",
    "kōng qì ": "空气",
    "kuì jiù ": "愧疚",
    "lěng mò ": "冷漠",
    "lì kè ": "立刻",
    "lì qì ": "力气",
    "lí qù ": "离去",
    "lì yòng": "利用", //
    "líng luàn ": "凌乱",
    "míng rì ": "明日",
    "mò rèn ": "默认",
    "mó yàng ": "模样",
    "nǎo dài ": "脑袋",
    "pǐn wèi ": "品味",
    "qián jìn ": "前进",
    "qì wèi ": "气味",
    "qīn qiē ": "亲切",
    "què dìng ": "确定",
    "shān dòng ": "山洞",
    "shēn kè ": "深刻",
    "shèng lì ": "胜利",
    "shí jì ": "实际",
    "shì fàng ": "释放",
    "shōu rù ": "收入",
    "tán huà ": "谈话",
    "tí yì ": "提议",
    "tǒng jì ": "统计",
    "tòng kuài ": "痛快",
    "wēi hài ": "危害",
    "wèi dào ": "味道",
    "wèi zhì ": "位置",
    "wú nài ": "无奈",
    "xiào huà ": "笑话",
    "xiōng dì ": "兄弟",
    "yī zhèn ": "一阵",
    "yí huò ": "疑惑",
    "yí wèn ": "疑问",
    "yì wài ": "意外",
    "yìn xiàng ": "印象",
    "yōu xiù ": "优秀",
    "yuán gù ": "缘故",
    "zé guài ": "责怪",
    "zhè gè ": "这个",
    "zhǔ dòng ": "主动",
    "zhǔn bèi ": "准备",
    "zhù shì ": "注视",
    "zuǒ yòu ": "左右",
}

var elem = document.getElementById("contents");
if (elem) {
    var text = elem.innerHTML;
    for (var py in py2hz) {
        var hz = py2hz[py];
        var re = new RegExp(py, "g");
        text = text.replace(re, hz);
    }
    elem.innerHTML = text;
}
