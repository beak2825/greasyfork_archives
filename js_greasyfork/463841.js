// ==UserScript==
// @name         淋语化
// @namespace    azite.cn
// @version      0.1.2
// @description  将网页上的文字都变成淋语~
// @author       Azite
// @license      MIT
// @match        *
// @downloadURL https://update.greasyfork.org/scripts/463841/%E6%B7%8B%E8%AF%AD%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/463841/%E6%B7%8B%E8%AF%AD%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 用闭包的方式实现唯一编号生成
    const getId = (() => {
        let counter = 0;
        return () => ++counter;
    })();

    function workerFn() {
        // 基础淋语词库
        const linyuBase = new Map([
            // 多字词语
            ["笑死", "孝鼠"],
            ["真的?是", "珍素"],
            ["大胆", "Big胆"],
            ["喜欢", "洗翻"],
            ["蠢直", "春芝"],
            ["姐姐", "解解"],
            ["得到|获得", "阴到"],
            ["nobody cares|[没|无]人在意", "nbcs"],
            ["逼飞奶炸", "bfnz"],
            ["蔡依林", ["淋淋", "脚淋"]],
            ["天[哪|啊]", "天啦噜"],
            ["同性恋", "通讯录"],
            ["几把|鸡巴", "乌干达"],
            ["孩子", "孩柱"],
            ["样子", "样柱"],
            ["停止", "婷芷"],
            ["天才", "地才"],
            ["美人", "花蝴蝶"],
            ["丑[得|的|地]要死", "丑Die"],
            ["盯上", "锁定"],
            ["聆听", "淋听"],
            ["足控", "甜椒婆"],
            ["nmsl|你妈死了", "尼美舒利"],

            // 语气词
            ["了", "惹"],
            ["鼠惹", "鼠了"], // 校正
            ["嘻", "吸"],
            ["呵+[！|!]", "厚！"],
            ["啊+[！|!]", "厚！"],
            ["啊+。?$", "厚"],
            ["哦", "厚"],
            ["吗[？|?]", "厚？"],

            // 称谓
            ["兄弟", "姐妹"],
            ["xdm", "姐妹们"],

            // 一些单字
            ["哭", "Cry"],
            ["死", "鼠"],
            ["是", "素"],
            ["停", "婷"],
            ["谢", "靴"],
            ["心", "熏"],
            ["我", "本可"],
            // ["逼", ["β", "贝塔"]]
        ]);

        // 其他淋语词库，如有更多词库可以联系我添加

        // 王者荣耀词库
        const linyuWzry = new Map([
            ["杨玉环", ["李华", "你华"]],
            ["貂蝉", "淋蝉"],
            ["西施", ["拉客妹", "吸虱"]],
            ["王昭君", "鸡菌"],
            ["(不知)?火舞", "东瀛女特务"],
            ["(上官)?婉儿", ["蒜姐", "飞天婆"]],
            ["武则天", "自控婆"],
            ["米莱迪", ["超生婆", "下蛋婆"]],
            ["安琪拉", "安嫔"],
            ["妲己", "狐臭女"],
            ["甄姬", "泔水婆"],
            ["公孙离", "驴姐"],
            ["小乔", "矮子乔"],
            ["沈梦溪", "阴猫"],
            ["妓芈", "妓芈"],
            ["孙尚香", "滚地婆"],
            ["虞姬", "🐟🐔"],
            ["艾琳", "蚊子婆"],
            ["伽罗", "长臂猿"],
            ["花木兰", "花铁t"],
            ["夏洛特", ["夏铁t", "西洋女特务"]],
            ["孙膑", "孙答应"],
            ["(百里)?守约", "阴约"],
            ["诸葛亮", "母亮"],
            ["韩信", "阴信"],
            ["李白", "母白"],
            ["元歌", "阴歌"],
            ["扁鹊", "下毒婆"],
            ["世隐", "明公公"],
            ["狄仁杰", "狄公公"],
            ["云缨", "孕婴"],
            ["司空震", "司空daddy"],
            ["孙策", "孙笨"],
            ["李信", "阴信"],
            ["暃", "母妃"],
            ["孙悟空|猴子", "阴🐒"],
            ["曜|臭脚曜|🐭曜", ["臭脚曜", "🐭曜"]],
        ]);

        // 原神词库（不完全，欢迎补充）
        const linyuGenshin = new Map([
            ["(珊瑚宫)?心海", "水母婆"],
            ["可莉", "炸弹婆"],
            ["七七", "僵尸婆"],
            ["夜兰", "我腋"],
        ])

        const linyuMap = new Map([...linyuBase, ...linyuWzry, ...linyuGenshin]);

        function convert(text) {
            for (let [key, value] of linyuMap) {
                // 将key转换为正则表达式并设置全局匹配
                if (!(key instanceof RegExp)) {
                    key = new RegExp(key, "g");
                }

                // 若值为一个数组，则从数组中随机抽取一个
                if (value instanceof Array) {
                    value = value[Math.floor(Math.random() * value.length)];
                }

                text = text.replace(key, value);
            }
            return text;
        }

        onmessage = function (e) {
            const data = e.data;
            data.text = convert(data.text);
            // 将转换后的数据传给主线程
            postMessage(data);
        }
    }

    // 这里用worker是为了防止大量匹配正则导致渲染卡顿
    // 将函数转换成url，再构建worker
    const workerUrl = URL.createObjectURL(new Blob(['(' + workerFn.toString() + ')()'], { type: 'text/javascript' }));
    const worker = new Worker(workerUrl);

    // 存放未处理的节点（听说用map效率会比object高）
    const unprocessedNodes = new Map();

    // 从worker收到处理后的数据
    worker.onmessage = function (e) {
        const data = e.data;
        const node = unprocessedNodes.get(data.id);
        // 当转换后与原文本不一致时才修改dom，减少性能开销
        if (data.text !== node.nodeValue) {
            node.nodeValue = data.text;
        }
        // 处理完成后删除记录
        unprocessedNodes.delete(data.id);
    };

    function handleNode(node) {
        // 只处理非脚本的文本节点
        if (node.nodeType === Node.TEXT_NODE && node.nodeName !== "SCRIPT") {
            // 忽略空白节点
            if (node.nodeValue.trim() === "") return;

            // 给每个节点分配一个唯一id，传入worker
            const id = getId();
            unprocessedNodes.set(id, node);
            worker.postMessage({ id, text: node.nodeValue });
        } else {
            if (node.childNodes.length > 0) {
                node.childNodes.forEach(handleNode);
            }
        }
    }

    handleNode(document.body);

    // 观察整个body的节点变动
    new MutationObserver((mutationList) => {
        mutationList.forEach(mutation => {
            handleNode(mutation.target);
        });
    }).observe(document.body, {
        subtree: true,
        childList: true,
        attributes: false // 不监听属性值变动
    });
})();
