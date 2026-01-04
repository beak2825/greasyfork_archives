// ==UserScript==
// @name         DNF韩文职业名称翻译中文
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在页面上把指定的韩文职业/角色名替换为中文
// @author       你
// @license MIT
// @match        https://df.nexon.com/community/news/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547163/DNF%E9%9F%A9%E6%96%87%E8%81%8C%E4%B8%9A%E5%90%8D%E7%A7%B0%E7%BF%BB%E8%AF%91%E4%B8%AD%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/547163/DNF%E9%9F%A9%E6%96%87%E8%81%8C%E4%B8%9A%E5%90%8D%E7%A7%B0%E7%BF%BB%E8%AF%91%E4%B8%AD%E6%96%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ---------- 配置区 ----------
    // 若只希望在某一站点生效，可把上面的 @match 改为目标站点，或在这里设置 TARGET_HOST 为域名（如 "example.com"）
    //const TARGET_HOST = null; // null = 全站生效；否则填入字符串，比如 "example.com"
    // ---------- 映射表（韩文 -> 中文） ----------
    const map = {
        "캐릭터 밸런스": "职业平衡",
        "기본 공격 및 전직 계열 스킬 공격력이": "基本攻击及转职系技能攻击力",
        "증가합니다.": "增加",
        "다크나이트": "黑暗武士",
        "트래블러": "旅人",
        "스페셜리스트": "源能专家",
        "트러블 슈터": "战线佣兵",
        "요원": "特工",
        "히트맨": "暗刃",
        "다크 랜서": "暗枪",
        "드래고니안 랜서": "狩猎者",
        "듀얼리스트": "决战者",
        "뱅가드": "征战者",
        "드래곤나이트": "龙骑士",
        "팔라딘": "帕拉丁",
        "카오스": "混沌魔灵",
        "섀도우댄서": "影舞者",
        "쿠노이치": "忍者",
        "사령술사": "黑夜术士",
        "로그": "暗星",
        "미스트리스": "魅影术师",
        "무녀": "驱魔师(巫女?)",
        "이단심판관": "异端审判者",
        "어벤저": "惩戒者",
        "퇴마사": "驱魔师",
        "인파이터": "蓝拳使者",
        "마도학자": "魔道学者",
        "배틀메이지": "战斗法师",
        "소환사": "召唤师",
        "엘레멘탈 마스터": "元素师",
        "디멘션워커": "次元行者",
        "스위프트 마스터": "风法",
        "블러드 메이지": "猩红法师",
        "빙결사": "冰洁师",
        "엘레멘탈 바머": "元素爆破师",
        "스핏파이어(여)": "弹药专家(女)",
        "메카닉(여)": "机械师(女)",
        "런처(여)": "枪炮师(女)",
        "레인저(여)": "漫游抢手(女)",
        "메카닉(남)": "机械师(男)",
        "런처(남)": "枪炮师(男)",
        "레인저(남)": "漫游抢手(男)",
        "그래플러(여)": "柔道家(女)",
        "스트라이커(여)": "散打(女)",
        "그래플러(남)": "柔道家(男)",
        "스트리트파이터(남)": "街霸(男)",
        "스트라이커(남)": "散打(男)",
        "넨마스터(남)": "气功师(男)",
        "블레이드": "刃影",
        "베가본드": "流浪武士",
        "데몬슬레이어": "契魔者",
        "소드마스터": "驭剑士",
        "검귀": "剑影",
        "버서커": "狂战士",
        "소울브링어": "鬼泣",
        "웨펀마스터": "剑魂"
    };

 const keys = Object.keys(map).sort((a,b)=>b.length-a.length).map(escapeRegExp);
    const regex = new RegExp(keys.join("|"), "g");

    function escapeRegExp(s){ return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

    function translateTextNode(node) {
        if (!node || !node.nodeValue) return;
        const old = node.nodeValue;
        if (!node.parentNode) return;
        if (!node.parentNode.dataset) return;
        // 如果没有保存过原文，先保存
        if (!node.parentNode.dataset.originalText) {
            node.parentNode.dataset.originalText = old;
        }
        const replaced = old.replace(regex, m => map[m] ?? m);
        if (replaced !== old) node.nodeValue = replaced;
    }

    function walkAndTranslate(root) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
        let n;
        while (n = walker.nextNode()) {
            translateTextNode(n);
        }
    }

    function restore(root) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
        let n;
        while (n = walker.nextNode()) {
            const parent = n.parentNode;
            if (parent && parent.dataset && parent.dataset.originalText) {
                n.nodeValue = parent.dataset.originalText;
                delete parent.dataset.originalText;
            }
        }
    }

    // 初始翻译
    function initialTranslate() {
        walkAndTranslate(document.body);
    }

    // 添加控制按钮
    function addControlButtons() {
        const bar = document.createElement("div");
        bar.style.position = "fixed";
        bar.style.bottom = "10px";
        bar.style.left = "10px";
        bar.style.zIndex = "999999";
        bar.style.background = "rgba(0,0,0,0.6)";
        bar.style.color = "white";
        bar.style.padding = "5px";
        bar.style.borderRadius = "6px";

        const btnTranslate = document.createElement("button");
        btnTranslate.textContent = "翻译";
        btnTranslate.onclick = ()=>walkAndTranslate(document.body);

        const btnRestore = document.createElement("button");
        btnRestore.textContent = "还原";
        btnRestore.onclick = ()=>restore(document.body);

        [btnTranslate, btnRestore].forEach(b=>{
            b.style.margin = "0 5px";
            bar.appendChild(b);
        });

        document.body.appendChild(bar);
    }

    if (document.readyState === "complete" || document.readyState === "interactive") {
        initialTranslate();
        addControlButtons();
    } else {
        window.addEventListener("DOMContentLoaded", ()=>{
            initialTranslate();
            addControlButtons();
        });
    }

})();
