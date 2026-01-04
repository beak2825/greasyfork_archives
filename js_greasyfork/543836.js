// ==UserScript==
// @name         uwuowo 한글패치
// @namespace    http://tampermonkey.net/
// @version      2025-07-28
// @description  로스트아크 북미 미터기 한글패치
// @author       AGAK
// @match        https://uwuowo.mathi.moe/*
// @icon         https://uwuowo.mathi.moe/favicon.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543836/uwuowo%20%ED%95%9C%EA%B8%80%ED%8C%A8%EC%B9%98.user.js
// @updateURL https://update.greasyfork.org/scripts/543836/uwuowo%20%ED%95%9C%EA%B8%80%ED%8C%A8%EC%B9%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 여기에 사용자 지정 번역 단어를 정의하세요.
    // 대소문자를 구분합니다.
    const customTranslations = {
        "Raid Statistics": "레이드 통계",
        "Stats": "통계",
        "Leaderboards": "순위표",
        "Style Book": "스타일 북",

        "Filters": "필터",
        "Raid": "레이드",

        "Behemoth, the Storm Commander": "폭풍의 지휘관, 베히모스",
        "Behemoth - Gate 1": "베히모스 1관문",
        "Behemoth, Cruel Storm Slayer": "잔혹한 폭풍의 처단자, 베히모스",
        "Behemoth - Gate 2": "베히모스 2관문",
        "Akkan, Lord of Death": "죽음의 왕, 일리아칸",
        "Aegir - Gate 1": "1막 1관문 - 일리아칸",
        "Aegir, the Oppressor": "짓밟는 자, 에기르",
        "Aegir - Gate 2": "1막 2관문 - 에기르",
        "Narok the Butcher": "도륙하는 자, 나로크",
        "Brelshaza - Gate 1": "2막 1관문 - 나로크",
        "Phantom Manifester Brelshaza": "몽환의 현시자, 아브렐슈드",
        "Brelshaza - Gate 2": "2막 2관문 - 아브렐슈드",
        "Infernas": "어둠의 주인 카멘",
        "Mordum - Gate 1": "3막 1관문 - 카멘",
        "Blossoming Fear, Naitreya": "만개한 공포, 나이트레야",
        "Mordum - Gate 2": "3막 2관문 - 나이트레아",
        "Mordum, the Abyssal Punisher": "심연의 징벌자, 모르둠",
        "Mordum - Gate 3": "3막 3관문 - 모르둠",

        "Difficulty": "난이도",
        "Normal": "노말",
        "Hard": "하드",
        "Filter By": "필터 기준",
        "Item Level": "아이템 레벨",
        "Combat Power": "전투력",
        "Show stats from": "통계 범위 :",
        "and less than": "~",
        "Additional Options": "추가 옵션",
        "Include Bus": "버스 포함",
        "Include Weird": "이상한 파티 포함",
        "Patch": "패치 버전",
        "Call of the Wildsoul": "환수사 추가",
        "April Balance": "4월 밸런스 패치",
        "July Balance": "7월 밸런스 패치",
        "Sort By": "정렬 기준",
        "Floor": "저점",
        "Q1": "하위 25%",
        "Median": "평균",
        "Q3": "상위 25%",
        "Ceiling": "고점",
        "Best": "최고기록",
        "Popularity": "표본수",

        "Behemoth Gate 1": "베히모스 1관문 - 베히모스",
        "Behemoth Gate 2": "베히모스 2관문 - 베히모스",
        "Aegir Gate 1": "1막 1관문 - 일리아칸",
        "Aegir Gate 2": "1막 2관문 - 에기르",
        "Brelshaza Gate 1": "2막 1관문 - 나로크",
        "Brelshaza Gate 2": "2막 2관문 - 아브렐슈드",
        "Mordum Gate 1": "3막 1관문 - 카멘",
        "Mordum Gate 2": "3막 2관문 - 나이트레아",
        "Mordum Gate 3": "3막 3관문 - 모르둠",
        "Normal": "노말",
        "Hard": "하드",
        "DPS Performance": "DPS 통계",

        "Mayhem": "광기",
        "Berserker Technique": "광전사의 비기",
        "Gravity Training": "중력 수련",
        "Rage Hammer": "분노의 망치",
        "Combat Readiness": "전투 태세",
        "Lone Knight": "고독한 기사",
        "Judgment": "심판자",
        "Predator": "포식자",
        "Punisher": "처단자",
        "Grace of the Empress": "황후의 은총",
        "Order of the Emperor": "황제의 칙령",
        "Communication Overflow": "넘치는 교감",
        "Master Summoner": "상급 소환사",
        "Igniter": "점화",
        "Reflux": "환류",
        "True Courage": "진실된 용맹",
        "Pinnacle": "절정",
        "Control": "절제",
        "Ultimate Skill: Taijutsu": "극의: 체술",
        "Shock Training": "충격 단련",
        "Esoteric Skill Enhancement": "오의 강화",
        "First Intention": "초심",
        "Energy Overflow": "역천지체",
        "Robust Spirit": "세맥타통",
        "Deathblow": "일격",
        "Esoteric Flurry": "오의 난무",
        "Asura's Path": "수라의 길",
        "Brawl King Storm": "권왕파천무",
        "Hunger": "갈증",
        "Lunar Voice": "달의 소리",
        "Demonic Impulse": "멈출 수 없는 충동",
        "Perfect Suppression": "완벽한 억제",
        "Remaining Energy": "잔재된 기운",
        "Surge": "버스트 강화",
        "Full Moon Harvester": "만월의 집행자",
        "Night's Edge": "그믐의 경계",
        "Enhanced Weapon": "전술 탄환",
        "Pistoleer": "핸드거너",
        "Evolutionary Legacy": "진화의 유산",
        "Arthetinean Skill": "아르데타인의 기술",
        "Barrage Enhancement": "포격 강화",
        "Firepower Enhancement": "화력 강화",
        "Loyal Companion": "두 번째 동료",
        "Death Strike": "죽음의 습격",
        "Peacemaker": "피스메이커",
        "Time to Hunt": "사냥의 시간",
        "Recurrence": "회귀",
        "Wind Fury": "질풍노도",
        "Drizzle": "이슬비",
        "Ferality": "야성",
        "Phantom Beast Awakening": "환수 각성",

        "Berserker": "버서커",
        "Destroyer": "디스트로이어",
        "Gunlancer": "워로드",
        "Paladin": "홀리나이트",
        "Slayer": "슬레이어",
        "Arcana": "아르카나",
        "Summoner": "서머너",
        "Sorceress": "소서리스",
        "Bard": "바드",
        "Artillerist": "블래스터",
        "Sharpshooter": "호크아이",
        "Deadeye": "데빌헌터",
        "Machinist": "스카우터",
        "Gunslinger": "건슬링어",
        "Glaivier": "창술사",
        "Soulfist": "기공사",
        "Scrapper": "인파이터",
        "Wardancer": "배틀마스터",
        "Striker": "스트라이커",
        "Breaker": "브레이커",
        "Deathblade": "블레이드",
        "Reaper": "리퍼",
        "Shadowhunter": "데모닉",
        "Souleater": "소울이터",
        "Artist": "도화가",
        "Aeromancer": "기상술사",
        "Wildsoul": "환수사",

        "Support Uptime": "서폿 통계",
        "H.A. Skill": "초각성 스킬",
        "Identity": "아덴",
        "Brand": "낙인",
        "AP": "공증"
    };

    function applyTranslation(node) {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
            let originalText = node.textContent;
            let translatedText = originalText;

            for (const [key, value] of Object.entries(customTranslations)) {
                const regex = new RegExp(`\\b${escapeRegExp(key)}\\b`, 'g');
                translatedText = translatedText.replace(regex, value);
            }
            node.textContent = translatedText;
        }
    }

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function translateElementContent(element) {
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let node;
        while ((node = walker.nextNode())) {
            if (node.parentNode.tagName !== 'SCRIPT' &&
                node.parentNode.tagName !== 'STYLE' &&
                !node.parentNode.hasAttribute('data-no-translate') &&
                !node.parentNode.classList.contains('no-translate')) {
                applyTranslation(node);
            }
        }
    }

    // DOM 변경 사항을 감지하고 새 콘텐츠를 번역합니다.
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 새로 추가된 요소 내부의 텍스트 노드를 번역합니다.
                        translateElementContent(node);
                    } else if (node.nodeType === Node.TEXT_NODE) {
                        // 새로 추가된 텍스트 노드를 번역합니다.
                        applyTranslation(node);
                    }
                });
            } else if (mutation.type === 'characterData') { // 텍스트 내용 변경 감지 재활성화
                applyTranslation(mutation.target);
            }
        });
    });

    window.addEventListener('load', () => {
        translateElementContent(document.body);

        if (document.title) {
            let originalTitle = document.title;
            let translatedTitle = originalTitle;
            for (const [key, value] of Object.entries(customTranslations)) {
                const regex = new RegExp(`\\b${escapeRegExp(key)}\\b`, 'g');
                translatedTitle = translatedTitle.replace(regex, value);
            }
            document.title = translatedTitle;
        }

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
})();