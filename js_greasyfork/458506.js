// ==UserScript==
// @name               B站、西瓜_制裁低价值号
// @name:zh-CN         B站、西瓜_制裁低价值号
// @name:en-US         BILI, ixigua_Kick Low-value creators
// @description        当检测到低创内容作者后阻止播放行为，降低完播率。从而降低平台收益。目前支持哔哩哔哩和西瓜视频(字节跳动旗下中长视频平台)。
// @version            1.0.7
// @author             LiuliPack
// @license            WTFPL
// @namespace          https://gitlab.com/LiuliPack/UserScript
// @match              https://www.bilibili.com/video/*
// @match              https://www.ixigua.com/*
// @run-at             document-body
// @downloadURL https://update.greasyfork.org/scripts/458506/B%E7%AB%99%E3%80%81%E8%A5%BF%E7%93%9C_%E5%88%B6%E8%A3%81%E4%BD%8E%E4%BB%B7%E5%80%BC%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/458506/B%E7%AB%99%E3%80%81%E8%A5%BF%E7%93%9C_%E5%88%B6%E8%A3%81%E4%BD%8E%E4%BB%B7%E5%80%BC%E5%8F%B7.meta.js
// ==/UserScript==

'use strict';

// 定义低创号清单(list)、类型描述(TD, TypeDesc)、当前页面二级域名(SLD, Second-level domain)和当前页面投稿者编号(id)变量，元素快捷选择器($(元素选取器))和元素存在检测器($$(元素选取器))函数
// 可用类型：0 毒科普；1 洗稿；2 无意义内容合集；3 广告引流；4 短影视解说；5 未授权搬运；6 低质量新闻
let list = [
    {"remark": "备注", "id": {"BL": "哔哩哔哩编号", "XG": "西瓜视频编号"}, "type": "类型"},
    {"remark": "冷却报告", "id": {"BL": "511148568", "XG": "1917171738881464"}, "type": 0},
    {"remark": "小纪实家", "id": {"BL": "1329677333"}, "type": 6},
    {"remark": "原理趣科普", "id": {"BL": "1798518455", "XG": "3751972806071959"}, "type": 1},
    {"remark": "粗犷毛线君", "id": {"BL": "12394995"}, "type": 2},
    {"remark": "无声酱鸭鸭", "id": {"BL": "387385062", "XG": "676943859819358"}, "type": 1},
    {"remark": "X情报社", "id": {"BL": "1503059936", "XG": "3878665920984280"}, "type": 1},
    {"remark": "F-Future2022", "id": {"BL": "1211154067"}, "type": 1},
    {"remark": "裤子嘚吧嘚", "id": {"BL": "1080164746", "XG": "3267371387336763"}, "type": 1},
    {"remark": "二小姐柠檬", "id": {"BL": "1741163079", "XG": "4035852637979"}, "type": 1},
    {"remark": "冰凌娜", "id": {"BL": "680374692"}, "type": 1},
    {"remark": "阿右电影", "id": {"BL": "174471602", "XG": "3175812858643869"}, "type": 1},
    {"remark": "晚安ko", "id": {"BL": "364853032"}, "type": 2},
    {"remark": "笑点有点低哦", "id": {"BL": "158673680", "XG": "4275377194145319"}, "type": 1},
    {"remark": "吃货来上车", "id": {"BL": "1656835346"}, "type": 1},
    {"remark": "吃货请上车", "id": {"XG": "99029540909"}, "type": 1},
    {"remark": "环球军科", "id":{"BL": "1204975783"}, "type": 1},
    {"remark": "元宇宙全能美少女", "id":{"BL": "1882051418"}, "type": 1},
    {"remark": "带你吃(大|瓜)瓜", "id":{"BL": "626471891", "XG": "1107901812580164"}, "type": 2},
    {"remark": "YY别人都说帅", "id":{"BL": "31238384"}, "type": 2},
    {"remark": "小林有点胖", "id":{"BL": "169991083"}, "type": 1},
    {"remark": "有亿思(cz|有亿思)", "id":{"BL": "35676481", "XG": "2309418916249656"}, "type": 1},
    {"remark": "世界美食official", "id":{"BL": "1007043700", "XG": "1670896160871144"}, "type": 1},
    {"remark": "源不可言", "id":{"BL": "475224358"}, "type": 1},
    {"remark": "3D建模核心技术", "id":{"BL": "1330811804"}, "type": 3},
    {"remark": "大锤RUNKMD", "id":{"BL": "22649032"}, "type": 2},
    {"remark": "船长电影解说", "id":{"BL": "1569685991", "XG": "4362488755264743"}, "type": 4},
    {"remark": "幕撩电影", "id":{"BL": "631060438", "XG": "940827779276462"}, "type": 4},
    {"remark": "泡菜电影", "id":{"BL": "631072409", "XG": "958402976824141"}, "type": 4},
    {"remark": "探长放映室", "id":{"BL": "490487433", "XG": "4037822997605120"}, "type": 4},
    {"remark": "扎女说影视", "id":{"BL": "519239408"}, "type": 4},
    {"remark": "复活视频", "id":{"BL": "1689406467"}, "type": 4},
    {"remark": "(干|幹)道夫探影", "id":{"BL": "3493094200707336", "XG": "369043023868495"}, "type": 4},
    {"remark": "ikun追剧", "id":{"BL": "481797510"}, "type": 4},
    {"remark": "侃片大师兄", "id":{"BL": "688872987", "XG": "69976039105790"}, "type": 4},
    {"remark": "老王忆经典", "id":{"BL": "107076367", "XG": "86466532249"}, "type": 4},
    {"remark": "剧浪江湖", "id":{"BL": "269542999", "XG": "519384839491328"}, "type": 4},
    {"remark": "科学大魔王i", "id":{"BL": "1694354896"}, "type": 4},
    {"remark": "小姜欢乐堂", "id":{"BL": "1786023735"}, "type": 4},
    {"remark": "三无公社", "id":{"BL": "1087374746"}, "type": 2},
    {"remark": "四川观察", "id":{"BL": "487614876", "XG": "52528956214"}, "type": 6},
    {"remark": "star星视频", "id":{"BL": "1685024055", "XG": "83802268282"}, "type": 6},
    {"remark": "东方今报", "id":{"BL": "493260599", "XG": "4157040672"}, "type": 6},
    {"remark": "洲洲continent", "id":{"BL": "702291885", "XG": "316287101186527"}, "type": 2},
    {"remark": "脑洞大开官方", "id":{"BL": "1294700074"}, "type": 1},
    {"remark": "新闻晨报", "id":{"BL": "412578153"}, "type": 6},
    {"remark": "蛋蛋来科普", "id":{"BL": "1593836506"}, "type": 1},
],
    TD = ["毒科普(受到美西方势力资助或传播错误信息的科普)", "洗稿(通过篡改、删减等行为搬运他人原创稿件)", "无意义内容合集(对无意义图片或评论进行整合或点评)", "广告引流(在稿件本体、稿件简介、稿件评论区或个人简介等信息展示区域含有以课程等借口诱骗钱财的群组或链接)", "短影视解说(流水帐式解说视频时常通常不超过三分钟，无内涵、无意义的影视内容拆解)", "未授权搬运(未注明出处搬运他人原创稿件)", "低质量新闻(包装生活琐事或发布虚假新闻)"],
    SLD = location.host.split('.')[1],
    id = $('.username') && $('.username').href.split('/')[3] || $('.author__userName') && $('.author__userName').href.split('/')[4],
    $ = ele => document.querySelector(ele);
function $$(ele) {
    return new Promise(resolve => {
        if ($(ele)) {
            return resolve($(ele));
        }
        const observer = new MutationObserver(mutations => {
            if ($(ele)) {
                resolve($(ele));
                observer.disconnect();
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
};

// 遍历低创号清单
list.forEach(data => {
    // 如果匹配低创号主站编号匹配
    if(SLD === "bilibili" && data.id.BL !== undefined && data.id.BL === id || SLD === "ixigua" && data.id.XG !== undefined && data.id.XG === id) {
        // 告警当前投稿者作为，如果选择“确定”
        if(confirm(`当前稿件的 UP 主含有连续三次的${TD[data.type]}行为，是否阻止播放。`)) {
            // 当视频播放时，就暂停播放并将进度回到 1 秒处
            $$('video').then((vid) => {
                vid.addEventListener("playing", () => {
                    vid.pause();
                    vid.currentTime = 1;
                });
            })
        }
    }
})