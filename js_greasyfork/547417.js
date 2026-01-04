// ==UserScript==
// @name         OpenWF WebUI 管理/紫卡编辑器 - 自动补齐汉化
// @namespace    http://tampermonkey.net/
// @version      250250915.083707
// @description  自动本地化所有动态内容和下拉框，支持页面刷新和内容变动
// @author       vancat
// @match        *://*/webui/
// @match        *://*/webui/*
// @icon         https://5b0988e595225.cdn.sohucs.com/images/20171001/29f8b42081514b5ebef0e61c03547eb4.gif
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547417/OpenWF%20WebUI%20%E7%AE%A1%E7%90%86%E7%B4%AB%E5%8D%A1%E7%BC%96%E8%BE%91%E5%99%A8%20-%20%E8%87%AA%E5%8A%A8%E8%A1%A5%E9%BD%90%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/547417/OpenWF%20WebUI%20%E7%AE%A1%E7%90%86%E7%B4%AB%E5%8D%A1%E7%BC%96%E8%BE%91%E5%99%A8%20-%20%E8%87%AA%E5%8A%A8%E8%A1%A5%E9%BD%90%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 本地化映射, 按国服翻译优先
    const localizationMap = {
        'Buffs': '正面加成',
        'Curses': '负面加成',
        'Misc': '其他',
        'Fingerprint': '印记代码',

        'LotusArchgunRandomModRare': '空战武器',
        'LotusModularMeleeRandomModRare': '天工武器',
        'LotusModularPistolRandomModRare': '组件枪',
        'LotusPistolRandomModRare': '副武器',
        'LotusRifleRandomModRare': '步枪',
        'LotusShotgunRandomModRare': '霰弹枪',
        'PlayerMeleeWeaponRandomModRare': '近战',
        'ArmorPiercingDamage': '穿刺伤害',
        'CritChance': '暴击几率',
        'CritDamage': '暴击伤害',
        'ElectricityDamage': '电击伤害',
        'FireDamage': '火焰伤害',
        'FireRate': '射速/近战攻速',
        'FreezeDamage': '冰冻伤害',
        'ImpactDamage': '冲击伤害',
        'ProcTime': '状态触发持续时间',
        'SlashDamage': '切割伤害',
        'StunChance': '状态触发几率',
        'ToxinDamage': '毒素伤害',
        'AmmoMax': '弹药最大值',
        'ClipMax': '弹匣容量',
        'DamageAmount': '基础伤害',
        'FireIterations': '多重射击',
        'PunctureDepth': '护甲穿透',
        'RecoilReduction': '后坐力',
        'ReloadSpeed': '装填速度',
        'FactionDamageCorpus': '科普斯派系伤害',
        'FactionDamageGrineer': '克隆尼派系伤害',
        'FactionDamageInfested': '异变体派系伤害',
        'ZoomFov': '缩放视野',
        'MeleeDamage': '近战武器伤害',
        'MeleeFactionDamageCorpus': '科普斯派系近战伤害',
        'MeleeFactionDamageGrineer': '克隆尼派系近战伤害',
        'MeleeFactionDamageInfested': '异变体派系近战伤害',
        'ComboDuration': '连击持续时间',
        'SlideAttackCritChance': '滑铲攻击暴击率',
        'MeleeRangeInc': '近战范围',
        'MeleeFinisherDamage': '近战终结伤害',
        'MeleeComboEfficiency': '近战重击效率',
        'MeleeComboInitialBonus': '近战初始连击',
        'MeleeComboPointsOnHit': '近战命中获得连击数',
        'MeleeComboBonusOnHit': '近战额外连击数几率',
        'ProjectileSpeed': '投射物速度',

        'Compat': '适用武器地址',
        'Level': '等级',
        'Polarity': '极性',
        'Min MR': '最低段位要求',
        'Rerolls': '洗卡次数',

        'None': '无',
        'Universal': '万用槽位',
        'Vazarin': 'V极 (防御)',
        'Naramon': 'N极 (辅助)',
        'Madurai': 'V极 (伤害)',
        'Zenurik': 'Z极 (战甲)',
        'Unairu': 'U极 (架式)',
        'Penjaga': 'Y极 (同伴)',
        'Umbra': '暗影 (虚空)',

        'Name suffix from buffs: ': '设备',
        'dexdex': 'dd',
    };

    // 本地化的标签和类名
    const elementTypesAndClasses = [
        { tag: 'P', classes: ['text'] },
        { tag: 'LABEL', classes: ['form-label'] },
        { tag: 'H5', classes: ['card-header'] },
        { tag: 'OPTION', classes: [] },
    ];

    // 本地化单个元素
    function localizeElement(element) {
        if (!element || !element.textContent) return;
        const originText = element.textContent.trim();
        const localizedText = localizationMap[originText];
        if (localizedText) {
            element.textContent = localizedText;
        }
    }

    // 本地化所有option
    function localizeAllOptions(selectElement) {
        if (!selectElement || !selectElement.options) return;
        for (let option of selectElement.options) {
            localizeElement(option);
        }
    }

    // 初始化本地化所有已存在元素
    function localizeInitialElements() {
        elementTypesAndClasses.forEach(typeAndClass => {
            const selector = typeAndClass.classes.length > 0
                ? `${typeAndClass.tag}.${typeAndClass.classes.join('.')}`
                : typeAndClass.tag;
            document.querySelectorAll(selector).forEach(el => {
                if (typeAndClass.tag === 'SELECT') {
                    localizeAllOptions(el);
                } else if (typeAndClass.tag === 'OPTION') {
                    localizeElement(el);
                } else {
                    localizeElement(el);
                }
            });
        });
        // 额外处理所有select的option
        document.querySelectorAll('select').forEach(localizeAllOptions);
    }

    // MutationObserver回调
    function callback(mutationsList) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 递归本地化所有相关子元素
                        if (node.tagName === 'SELECT') {
                            localizeAllOptions(node);
                        } else if (node.tagName === 'OPTION') {
                            localizeElement(node);
                        } else {
                            elementTypesAndClasses.forEach(typeAndClass => {
                                if (node.tagName === typeAndClass.tag &&
                                    (typeAndClass.classes.length === 0 || typeAndClass.classes.some(cls => node.classList.contains(cls)))) {
                                    localizeElement(node);
                                }
                            });
                        }
                        // 递归处理子节点
                        node.querySelectorAll && node.querySelectorAll('option').forEach(localizeElement);
                    }
                });
            }
            if (mutation.type === 'attributes') {
                if (mutation.target.tagName === 'OPTION') {
                    localizeElement(mutation.target);
                }
                if (mutation.target.tagName === 'SELECT') {
                    localizeAllOptions(mutation.target);
                }
            }
        }
    }

    // 启动观察器
    const observer = new MutationObserver(callback);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    // 页面初始本地化
    localizeInitialElements();

    // 下拉框选项切换时本地化（全局处理所有select）
    document.addEventListener('change', function (e) {
        if (e.target && e.target.tagName === 'SELECT') {
            const selectedOption = e.target.options[e.target.selectedIndex];
            localizeElement(selectedOption);
        }
    });

    // 页面完全加载后再本地化一次，防止异步渲染遗漏
    window.addEventListener('DOMContentLoaded', localizeInitialElements);

})();