// ==UserScript==
// @name              中共网站党话转白话
// @description       将共产汉语替换为人类可读文本。
// @name:en           Communist Chinese word replacer
// @description:en    Replace Communist Chinese language with human readable one.
// @version           3.11.1
// @author            张书记
// @match             *://*.gov.cn/*
// @match             *://*.gov.hk/*
// @match             *://*.people.com.cn/*
// @namespace         zh-Hans-CCP
// @license           GPL-3.0-only
// @run-at            document-idle
// @grant             none
// @downloadURL https://update.greasyfork.org/scripts/538842/%E4%B8%AD%E5%85%B1%E7%BD%91%E7%AB%99%E5%85%9A%E8%AF%9D%E8%BD%AC%E7%99%BD%E8%AF%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/538842/%E4%B8%AD%E5%85%B1%E7%BD%91%E7%AB%99%E5%85%9A%E8%AF%9D%E8%BD%AC%E7%99%BD%E8%AF%9D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const textRegexRules = [
        // noun
        { regex: /(习近平|习总书记|习主席)/, replacement: '我' },
        { regex: /绿色通道/, replacement: '后门' },
        { regex: /万无一失/, replacement: '没事' },
        { regex: /(高水平|高质量|高素质|高标准)/, replacement: '节省' },
        { regex: /组成部分/, replacement: '一部分' },
        { regex: /根本任务/, replacement: '任务' },
        { regex: /群众生命财产安全/, replacement: '人口税收' },
        { regex: /中国特色社会主义/, replacement: '邓主义' },
        { regex: /社会主义市场经济/, replacement: '资本' },
        { regex: /(中国特色|中国式)/, replacement: '非' },
        { regex: /复兴/, replacement: '驯化' },
        { regex: /(强国|大国)/, replacement: '上国' },
        { regex: /思想/, replacement: '想法' },
        { regex: /精神/, replacement: '法案' },
        { regex: /讲话精神/g, replacement: '的讲话' },
        { regex: /同志/, replacement: '' },
        { regex: /新时代/, replacement: '习时代' },
        { regex: /新中国/, replacement: '毛中国' },
        { regex: /新华社/, replacement: '腥滑射' },
        { regex: /新/, replacement: '假' },
        { regex: /中华/, replacement: '汉' },
        { regex: /总书记/, replacement: '主教' },
        { regex: /(领导人|总统|主席|总理|首相)/, replacement: '头头' },
        { regex: /党/g, replacement: '教' },
        { regex: /部门/g, replacement: '组织' },
        { regex: /办公室/g, replacement: '帮' },
        { regex: /就(.*)答记者问/g, replacement: '$1FAQ' },
        { regex: /乱象/g, replacement: '现象' },
        { regex: /身心健康/g, replacement: '控制' },
        { regex: /的(公告|通告|通知|意见|决定)/, replacement: '' },
        { regex: /烈士/g, replacement: '战争英雄' },
        { regex: /国情/g, replacement: '王道' },
        { regex: /生产生活/g, replacement: '说谎' },
        { regex: /生产力/g, replacement: '财路' },
        { regex: /红旗/g, replacement: '血旗' },
        { regex: /马克思/g, replacement: '玛柯斯' },
        { regex: /时政/g, replacement: '圣谕' },
        { regex: /曝光/g, replacement: '批斗' },
        { regex: /政府工作/g, replacement: '暴力活动' },
        { regex: /政务/g, replacement: '罪行' },
        { regex: /政策/g, replacement: '教令' },
        { regex: /为中心/g, replacement: '当草芥' },
        { regex: /理解和支持/g, replacement: '不满' },
        { regex: /少年儿童/g, replacement: '和骨烂' },
        { regex: /儿童/g, replacement: '娈童' },
        /// NS Defuckment
        { regex: /国家安全/g, replacement: '北京安全' },
        { regex: /国安/g, replacement: '北安' },
        { regex: /(警队|警务|警察)/g, replacement: '黑警' },
        { regex: /Police/g, replacement: 'Thugs' },
        /// MFA
        { regex: /中方/g, replacement: '北方' },
        { regex: /(中国|中央|国家)/g, replacement: '北京' },
        { regex: /合作共赢/g, replacement: '恶贯满盈' },
        { regex: /两国人民/, replacement: '我俩' },
        { regex: /成果/g, replacement: '恶果' },
        { regex: /国际经贸合作和人员往来/g, replacement: '门户开放' },
        /// PSB
        { regex: /公安机关/g, replacement: '暴力团' },
        
        { regex: /等工作/g, replacement: '' },
        { regex: /摄/g, replacement: '射' },
        { regex: /日报/g, replacement: '日爆' },
        { regex: /环球时报/g, replacement: '混球时报' },
        { regex: /政治局/g, replacement: '内阁' },
        { regex: /职业技能/g, replacement: '集中营' },
        { regex: /矛盾/g, replacement: '敌对' },
        { regex: /学习/g, replacement: '洗脑' },
        { regex: /方面/g, replacement: '' },
        { regex: /(传统美德|传家宝)/g, replacement: '古习' },
        { regex: /理论/g, replacement: '诈骗' },
        { regex: /人人有责/g, replacement: '领导不管' },
        { regex: /(群众|人民群众|纳税人)/g, replacement: '信众' },
        { regex: /看病钱/g, replacement: '什一' },
        { regex: /救命钱/g, replacement: '吉兹亚' },
        { regex: /网络安全/g, replacement: '电子骚扰' },
        { regex: /第一课/g, replacement: '初洗脑' },
        /// MOH
        { regex: /招聘会/g, replacement: '奴隶市场' },
        { regex: /人力资源/g, replacement: '人肉电池' },
        { regex: /用人单位/g, replacement: '杀人场所' },
        { regex: /(劳动者|求职者|人才)/g, replacement: '信众' },
        // verb
        { regex: /发挥(.*?)对(.*?)的(.*?)作用/g, replacement: '使$1$3$2' },
        { regex: /打好(.*?)战/g, replacement: '$1' },
        { regex: /打赢(.*?)战/g, replacement: '$1' },
        { regex: /绷紧(.*?)这根弦/g, replacement: '$1' },
        { regex: /铲除(.*?)滋生土壤/g, replacement: '虐杀$1' },
        { regex: /铲除(.*?)滋生的土壤和条件/g, replacement: '虐杀$1' },
        { regex: /做(.*?)斗争/g, replacement: '血腥地$1' },
        { regex: /夺取(.*?)/g, replacement: '暴力地$1' },
        { regex: /把握(.*?)主动权/g, replacement: '$1' },
        { regex: /打牢(.*?)基础/g, replacement: '$1' },
        { regex: /为(.*?)奠定坚实基础/g, replacement: '$1' },
        { regex: /为(.*?)注入正能量/g, replacement: '$1' },
        { regex: /关于(.*?)的(.*?)/g, replacement: '$1的$2' },
        { regex: /做好(.*?)工作/g, replacement: '$1' },
        { regex: /为(.*?)贡献/g, replacement: '为$1牺牲' },
        { regex: /为(.*?)注入动能/g, replacement: '$1' },
        { regex: /发挥(.*?)作用/g, replacement: '$1' },
        { regex: /推动(.*?)发展/g, replacement: '发展$1' },
        { regex: /这个(.*?)的/g, replacement: '$1' },
        // { regex: /要(.*?)好/g, replacement: '要$1' },
        { regex: /(斗争|革命)/g, replacement: '虐杀' },
        { regex: /准确把握/g, replacement: '把握' },
        { regex: /(表示|指出|强调|传达|发言)/g, replacement: '说' },
        // { regex: /研究/g, replacement: '说' },
        { regex: /印发/g, replacement: '写' },
        { regex: /了解/g, replacement: '听' },
        { regex: /会见/g, replacement: '见' },
        { regex: /(考察|审议|察看)/g, replacement: '看' },
        { regex: /(参加|访问)/g, replacement: '去' },
        { regex: /召开/g, replacement: '开' },
        { regex: /成功举行/g, replacement: '开' },
        { regex: /牢记/g, replacement: '记住了' },
        { regex: /主持召开/g, replacement: '主持了' },
        { regex: /(传达学习|学习贯彻|贯彻落实)/g, replacement: '重复' },
        { regex: /(铸牢|筑牢)/g, replacement: '' },
        { regex: /实现/g, replacement: '' },
        { regex: /推动/g, replacement: '' },
        { regex: /压实/g, replacement: '做' },
        { regex: /强化/g, replacement: '做' },
        { regex: /加强/g, replacement: '做' },
        { regex: /开展/g, replacement: '做' },
        { regex: /落实/g, replacement: '做' },
        { regex: /争做/g, replacement: '做' },
        { regex: /(坚持|传承)/g, replacement: '做' },
        { regex: /主持/g, replacement: '做' },
        { regex: /团结奋斗/g, replacement: '做' },
        { regex: /(保障|规范|管理|维护|审核|制度|稳定|帮扶)/g, replacement: '镇压' },
        { regex: /整治/g, replacement: '临时限制' },
        { regex: /指示/g, replacement: '话' },
        { regex: /批复/g, replacement: '' },
        { regex: /全力以赴/g, replacement: '更多' },
        { regex: /(提升|提高|增进|加快|加大|推进)/g, replacement: '更多' },
        { regex: /努力/g, replacement: '奴隶' },
        { regex: /备案/g, replacement: '注册' },
        { regex: /(转型升级|转型加速)/g, replacement: '倒闭' },
        { regex: /振兴/g, replacement: '荒废' },
        { regex: /(完善|健全)/g, replacement: '恶化' },
        { regex: /优化/g, replacement: '削减' },
        { regex: /自查/g, replacement: '自杀' },
        { regex: /自纠/g, replacement: '自残' },
        { regex: /(违法|违规|违纪|违章)/g, replacement: '活着' },
        { regex: /感谢您/g, replacement: '去你妈的' },
        { regex: /畅所欲言/g, replacement: '替我放屁' },
        { regex: /安置/g, replacement: '杀害' },
        { regex: /讲话/g, replacement: '假话' },
        { regex: /倡议/g, replacement: '娼疫' },
        { regex: /上当受骗/g, replacement: '被骗' },
        { regex: /行政/g, replacement: '法外' },
        { regex: /收官/g, replacement: '分赃' },
        /// MOH
        { regex: /(求职|就业)/g, replacement: '作奴' },
        { regex: /创业/g, replacement: '上供' },
        /// PSB
        { regex: /打击/g, replacement: '报复' },
        { regex: /处理/g, replacement: '迫害' },
        { regex: /尊重/g, replacement: '没收' },
        { regex: /优化/g, replacement: '削减' },
        { regex: /(扫黑除恶)/g, replacement: '打砸抢' },
        { regex: /(黑恶势力)/g, replacement: '商家' },
        /// MFA
        { regex: /(通电话|会谈)/g, replacement: '说话' },
        { regex: /致(贺电|贺信)/g, replacement: '问候' },
        { regex: /(建交|关系|一道)/g, replacement: '团伙' },
        { regex: /(命运共同体|战略合作伙伴)/g, replacement: '团伙' },
        { regex: /重视/g, replacement: '' },
        { regex: /愿与/g, replacement: '和' },
        /// CCDI / National Supervisory Commission / KGB / Gestapo
        { regex: /涉嫌严重违纪违法/g, replacement: '异见' },
        { regex: /纪律审查/g, replacement: '教内迫害' },
        { regex: /监察调查/g, replacement: '教外迫害' },
        { regex: /反腐败/g, replacement: '反异己' },
        { regex: /严肃查处/g, replacement: '假装查一下' },
        // adj
        { regex: /(重要|重大|重点|根本)/g, replacement: '' },
        { regex: /严格/g, replacement: '' },
        { regex: /典型/g, replacement: '' },
        { regex: /坚强/g, replacement: '' },
        { regex: /正式/g, replacement: '' },
        { regex: /全面/g, replacement: '' },
        { regex: /切实/g, replacement: '' },
        { regex: /生动/g, replacement: '' },
        { regex: /优秀/g, replacement: '' },
        { regex: /战略/, replacement: '' },
        { regex: /(强大|伟大|光荣)/g, replacement: '' },
        { regex: /有关/g, replacement: '' },
        { regex: /鲜明/g, replacement: '' },
        { regex: /独特/g, replacement: '' },
        { regex: /实实在在的/g, replacement: '假的' },
        { regex: /光明/g, replacement: '黑暗' }, // 我们都有光明的未来 / 光明学校 aka 集中营
        { regex: /广大/g, replacement: '极少数' },
        /// CAC
        { regex: /(不雅|不良)/g, replacement: '露骨' },
        { regex: /色情低俗/g, replacement: '色情' },

        { regex: /(一是|二是|三是|四是|五是|六是|七是)/g, replacement: '' },
        { regex: /(一|二|三|四|五|六|七|八|九|)、/g, replacement: '' },
        { regex: /(1\.|2\.|3\.|4\.|5\.)/g, replacement: '' },
        { regex: /(（.*）)/g, replacement: '' },
        { regex: /关键/g, replacement: '' },
        { regex: /常态化/g, replacement: '经常' },
        // adv
        { regex: /进一步/g, replacement: '' },
        { regex: /深入/g, replacement: '' },
        { regex: /充分/g, replacement: '' },
        { regex: /扎实/g, replacement: '' },
        { regex: /认真/g, replacement: '' },
        { regex: /统筹/g, replacement: '' },
        { regex: /不断/g, replacement: '' },
        { regex: /真正/g, replacement: '' },
        { regex: /积极/g, replacement: '愚蠢' },
        { regex: /(全力|强力|奋力|有力|着力)/g, replacement: '' },
        { regex: /高效/g, replacement: '' },
        { regex: /快速/g, replacement: '' },
        { regex: /妥善/g, replacement: '杀死' },
        { regex: /(平稳顺利|平稳有序|平安顺利|安全有序|安全稳定|良好秩序|公平公正|公平正义|清朗有序|健康有序|公平均衡普惠可及)/g, replacement: '镇压' },
        { regex: /(坚持不懈|坚定不移|坚决)/g, replacement: '' },
        { regex: /(深化|深刻)/g, replacement: '继续' },
        { regex: /到底/g, replacement: '' },
        { regex: /有效/g, replacement: '' },
        { regex: /十分/g, replacement: '' },
        { regex: /高度/g, replacement: '' },
        { regex: /持续/g, replacement: '' },
        { regex: /暖心/g, replacement: '' },
        { regex: /最/g, replacement: '' },
        { regex: /以零容忍态度/g, replacement: '' },
        { regex: /(从严|从重|从轻|从宽)/g, replacement: '' },
        { regex: /自觉/g, replacement: '' },
        { regex: /共同/g, replacement: '' },
        { regex: /(合法|非法)/g, replacement: '' },
        { regex: /盲目/g, replacement: '' },
        { regex: /始终/g, replacement: '' },
        { regex: /牢牢/g, replacement: '' },
        { regex: /(实地|一线)/g, replacement: '' },
        { regex: /详细/g, replacement: '' },
        { regex: /(顺利|平稳|圆满)/g, replacement: '' },
        { regex: /轻易/g, replacement: '' },
        // mark
        { regex: /(“|”)/g, replacement: '' },
    ];

    function disableScripts() {
        document.querySelectorAll('script').forEach(script => {
            script.remove();
        });
    }
    
    function replaceText(node, regexRules) {
        if (node.nodeType === Node.TEXT_NODE && node.parentNode) {
            let text = node.textContent;
            let modified = false;

            regexRules.forEach(rule => {
                if (rule.regex.test(text)) {
                    text = text.replace(rule.regex, rule.replacement);
                    modified = true;
                }
            });

            if (modified && text !== node.textContent) {
                node.textContent = text;
            }
        } else {
            for (let child of node.childNodes) {
                replaceText(child, regexRules);
            }
        }
    }

    function processElements(root) {
        const elements = root.querySelectorAll('h1, h2, h3, h4, h5, h6, a, p, div');
        elements.forEach(element => {
            replaceText(element, textRegexRules);
        });
    }

    disableScripts();
    processElements(document.body);

    document.addEventListener('DOMContentLoaded', () => {
        processElements(document.body);
    });

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    processElements(node);
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();