// ==UserScript==
// @name         cleanNovel
// @namespace    http://tampermonkey.net/
// @version      0.0.13
// @description  清净阅读，添购都给我爬
// @author       cctyl
// @match       *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499661/cleanNovel.user.js
// @updateURL https://update.greasyfork.org/scripts/499661/cleanNovel.meta.js
// ==/UserScript==

(function () {
    'use strict';
    /*
         关键词替换列表
         格式： '原文本':'替换文本',
    */
    let keyWordMap = {

        '\\?\\?\\?\\?':'',
        '性侵':'犯罪',

        '旗袍':'裤子',
        '大腿根':'下半身',
        '漂漂亮亮':'长相正常',
        '漂亮':'长相正常',

        '玉足': '脚',
        '香肩': '臂膀',
        '妙龄': '年轻',
        '小娘子': '妇女',
        '良家': '正常',
        '容貌秀丽': '好看',
        '奴家': '我',
        '娇躯': '体型',
        '美艳': '普通',
        '眼波盈盈': '眼神强烈',
        '芳心': '心脏',

        '一颤': '一跳',
        '眸子': '眼睛',

        '唇红齿白': '，',
        '乌黑靓丽': '黑色',
        '俊美': '帅气',
        '丰腴': '肥胖',

        '美妇': '妇女',
        '少女': '女青年',
        '尖俏': '正常',
        '活色生香': ' ',
        '娇俏': 'q弹',
        '红霞': '脸红',
        '霞飞双颊': '脸红',
        '羞怯': '害羞',
        '美眸': '眼睛',
        '香汗': '大汗',
        '红润': '红色',
        '小嘴': '嘴唇',
        '精美': '精良',
        '妇人': '妇女',
        '美妙': '健康',
        '绝美': '好看',
        '美人': '女青年',
        '盛世美颜': '，',
        '绝色': '正常',
        '柔美': '正常',
        '柔媚': '正常',
        '娇媚': '正常',
        '俏脸': '脸庞',
        '黑丝': '裤子',
        '含春': '正常',
        '包裹': '东西',
        '肌肤': '皮肤',
        '白皙': '亮白',
        '精致': '精良',
        '闺秀': '妇女',
        '脚丫': '脚',
        '丝绸': '衣服',
        '绸缎': '衣服',
        '长腿': '腿',
        '半露': '-',
        '若隐若现': '出现',
        '沟壑': '沟渠',
        '柔荑': '手',
        '纤腰': '-',
        '胸脯': '-',
        '含苞待放': '-',
        '鼓胀': '-',
        '诱人': '-',
        '薄纱': '-',
        '轻薄': '-',
        '丰满': '-',
        '芊芊': 'qq',
        '纤纤': 'xx',
        '兰花指': ' lhz',
        '眼波': ' yb',
        '荡漾': ' 党员',
        '动人': ' 党员',
        '娇小': '小小',
        '美目': '眼睛',
        '美腿': '大腿',
        '异彩': '眼睛',
        '悦耳': '声音',
        '曼妙': '-',
        '女孩': '女青年',
        '脸蛋': '脸',
        '温柔可人': '-',
        '婀娜': '-',
        '女神': '女的',
        '女生': '女的',
        '精美': '工艺精美',
        '艳丽': '色彩',
        '风韵': '风俗',
        '风韵': '风俗',
        '幽怨': '悠悠',
        '妹子': '女青年',
        '妞儿': '女青年',

        '大腿': '下肢',
        '窈窕': '身体健康',
        '脸颊': '脸',
        '双腿': '下肢',
        '嘴唇': '嘴巴',
        '诱惑': '油猴',
        '欲望': '梦想',
        '欲火': '梦想',
        '娇嫩': '新鲜',
        '性感': '理智',
        '身材': '体型',
        '雪白': '雪豹',
        '妩媚': '-',
        '靓丽': '凉凉',
        '靓丽': '凉凉',
        '波涛汹涌': '起伏不定',
        '汹涌': '起伏不定',
        '波涛': '起伏不定',
        '小手': '手掌',
        '羞耻': '不好意思',
        '欲念': '梦想',
        '妖娆': '混乱',
        '炽热': '很烫',
        '喜欢': '稀罕',
        '妹妹': '一抹多',
        '亭亭玉立': '站起来了',
        '婷婷玉立': '站起来了',
        '小萝莉': '小朋友',
        '萝莉': '小朋友',
        'loli': '小朋友',
        '傲人': '熬仁',
        '高挑': '高杆',
        '甜美': '好汀',
        '青春靓丽': '朝气蓬勃',
        '明眸皓齿': '身体健康',
        '风华': '外形',
        '步步生莲': '脚下生风',
        '优美': '正常',
        '身体曲线': '体型',
        '身体线条': '体型',
        '勾勒': '描绘',
        '佳人': '家人',


    };
    let charWordMap = {

        //单字通配’

        '唇': '大嘴巴',
        '凶': '恶',
        '姐': '杰',
        '妞': '女青年',
        '妹': '一抹多',
        '腿': '下肢',
        '软': '圆',
        '嫩': '能',
        '姜': '江',
        '柔': '手',
        '美': '没',
        '胸': '-',
        '妍': '-',
        '粉': 'f',
        '香': 'x',
		'臀':'t',
        '妙': 'miao',
        '盈': 'y',
        '莹': 'y',
        '俊': 'j',
        '俏': 'q',
        '柔': 'r',
        '白': '冰',
        '眸': '眼',
        '秀': '修',
        '芳': 'f',
        '腴': 'y',
        '媚': '-',
        '妩': '5',
        '魅': 'm',
        '脂': ' z',
        '玉': ' y',
        '娇': 'j ',
        '羞': '不好意思',
        '欲': ' y',
        '艳': ' y',
        '滑': 'h',
        '藕': '莲藕',
        '臂': '手臂',
        '雪': 'x',
        '丽': 'l',
    }


    let keyArray = Object.keys(keyWordMap).concat(Object.keys(charWordMap));

    //合并两个map
    for (let key in charWordMap) {
        keyWordMap[key] = charWordMap[key];
    }


    let regMap = {};
    for (let key in keyWordMap) {
        regMap[key] = new RegExp(key, 'g');
    }


    window.addEventListener("load", () => {
        clearText();
    });

    let historyStrLenth = 0;

    function clearText() {

        const elements = document.body.getElementsByTagName('*');
        if (historyStrLenth == elements.length) {
            console.log("元素未变化，不替换")
        } else {

            console.log("元素变化，开始替换    ");
            console.log(`${historyStrLenth}  ${elements.length}`)

            for (let element of elements) {
                if (element.childNodes.length) {
                    for (let node of element.childNodes) {
                        if (node.nodeType === Node.TEXT_NODE) {
                            for (let i = 0; i < keyArray.length; i++) {
                                let key = keyArray[i];
                                // console.log(`替换${key} 为 ${keyWordMap[key]}`)
                                node.textContent = node.textContent.replace(regMap[key], keyWordMap[key]);
                            }
                        }
                    }
                }
            }

            historyStrLenth = elements.length;
        }

    }

    if (window.interValItem) {
        clearInterval(window.interValItem);
    }
    window.interValItem = setInterval(clearText, 20000);

})();
