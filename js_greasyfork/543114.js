// ==UserScript==
// @name         1. rpg.kr 협동 오토 메크로 최종 UI버전
// @namespace    https://rpg.kr/
// @version      1.6
// @description  특정 조건에 맞는 보스를 자동으로 클릭하는 스크립트 (키보드 단축키 사용, ID 기준 정렬, UI ON/OFF 토글 추가)
// @author       meme
// @match        https://rpg.kr/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543114/1%20rpgkr%20%ED%98%91%EB%8F%99%20%EC%98%A4%ED%86%A0%20%EB%A9%94%ED%81%AC%EB%A1%9C%20%EC%B5%9C%EC%A2%85%20UI%EB%B2%84%EC%A0%84.user.js
// @updateURL https://update.greasyfork.org/scripts/543114/1%20rpgkr%20%ED%98%91%EB%8F%99%20%EC%98%A4%ED%86%A0%20%EB%A9%94%ED%81%AC%EB%A1%9C%20%EC%B5%9C%EC%A2%85%20UI%EB%B2%84%EC%A0%84.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 설정 객체
    const config = {
        minActionPoint: 20,
        clickDelay: 500,
        autoInterval: 5000
    };

    // 보스 정보 배열에 active 속성 추가 (true: 공격 대상, false: 제외)
    const bosses = [
        { name: "구미호", maxHealth: 400000, minDamage: 100000, active: false },
        { name: "저주받은 석상", maxHealth: 2500000, minDamage: 600000, active: false },
        { name: "리치", maxHealth: 8000000, minDamage: 1500000, active: false },
        { name: "사이클롭스", maxHealth: 20000000, minDamage: 3000000, active: false },
        { name: "드레이크", maxHealth: 50000000, minDamage: 6000000, active: false },
        { name: "아크 리치", maxHealth: 95000000, minDamage: 10000000, active: false },
        { name: "크라켄", maxHealth: 160000000, minDamage: 15000000, active: false },
        { name: "잠자는 용", maxHealth: 250000000, minDamage: 25000000, active: false },
        { name: "성룡", maxHealth: 370000000, minDamage: 37000000, active: false },
        { name: "노룡", maxHealth: 530000000, minDamage: 53000000, active: false },
        { name: "고룡", maxHealth: 740000000, minDamage: 74000000, active: false },
        { name: "사룡", maxHealth: 5550000000, minDamage: 416250000, active: false },
        { name: "펜리르", maxHealth: 2000000000, minDamage: 200000000, active: false }
    ];

    let isAutoMode = false;
    let isUIVisible = true;
    let bossUI;

    document.addEventListener('keydown', function (event) {
        if (event.key === '=') {
            isAutoMode = !isAutoMode;
            console.log(`자동화 기능이 ${isAutoMode ? '활성화' : '비활성화'}되었습니다.`);
        } else if (event.key === '8') {
            console.log('"8" 키가 눌렸습니다.');
            clickElement("협동") && console.log('"협동" 버튼 클릭 성공');
        } else if (event.key === '[') {
            console.log("보스 자동 클릭 시작...");
            processBossList();
        }
    });

    function processBossList() {
        const alimiWkpDispValue = parseInt(document.getElementById('alimiWkpDisp')?.textContent.trim() || '0', 10);
        if (alimiWkpDispValue < config.minActionPoint) {
            console.log(`행동력이 ${config.minActionPoint} 미만입니다.`);
            return;
        }

        const dynamicBosses = updateBossesFromPage();
        console.log(`동적 보스 데이터:`, dynamicBosses);

//        const sortedBosses = dynamicBosses; // 정렬 없이 원래 순서 유지
        const sortedBosses = dynamicBosses.sort((a, b) => a.id - b.id); // 오름차순
//        const sortedBosses = dynamicBosses.sort((a, b) => b.id - a.id); // 내림차순

        for (let boss of sortedBosses) {
            console.log(`${boss.name} (#${boss.id}) 확인 중...`);
            const row = Array.from(document.querySelectorAll('tr.line'))
                .find(r => r.querySelector('td:first-child')?.textContent.trim() === `${boss.name} (#${boss.id})`);

            if (!row) continue;

            const healthCell = row.querySelector('td:nth-child(2)');
            const match = healthCell.textContent.trim().match(/^(\d+)\/(\d+)(?: \((\d+)\))?/);
            if (!match) continue;

            const currentHealth = parseInt(match[1].replace(/,/g, ''), 10);
            const myDamage = match[3] ? parseInt(match[3].replace(/,/g, ''), 10) : 0;

            const bossDef = bosses.find(b => b.name === boss.name);
            if (!bossDef) continue;

            if (!bossDef.active) {
                console.log(`${boss.name} 비활성화 상태입니다.`);
                continue;
            }

            if (currentHealth === -1) {
                row.click();
                console.log(`${boss.name} 체력이 0입니다. 보상 수령...`);
                setTimeout(() => clickElement("보상", true), config.clickDelay);
                return;
            } else if (myDamage >= bossDef.minDamage) {
                console.log(`딜량 ${myDamage.toLocaleString()}이 ${bossDef.minDamage.toLocaleString()} 이상입니다.`);
                continue;
            } else if (myDamage < bossDef.minDamage && currentHealth + myDamage > bossDef.minDamage) {
                row.click();
                console.log(`${boss.name} 공격 시도 (딜량: ${myDamage.toLocaleString()})`);
                setTimeout(() => clickElement("공격"), config.clickDelay);
                return;
            } else {
                console.log(`${boss.name} 조건 불만족: 현재체력=${currentHealth}, 내 딜량=${myDamage}, 최소딜량=${bossDef.minDamage}`);
            }
        }
        console.log("보스 목록 확인 완료.");
    }

    function updateBossesFromPage() {
        const bossRows = document.querySelectorAll('tr.line');
        const updatedBosses = [];

        bossRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length < 5) return;

            const fullName = cells[0].textContent.trim();
            const baseName = fullName.split(' (')[0].trim();
            const idMatch = fullName.match(/#(\d+)/);
            const bossId = idMatch ? parseInt(idMatch[1], 10) : null;

            const healthInfo = cells[1].textContent.trim();
            const [currentHealth, maxHealth] = healthInfo.split('/').map(h => parseInt(h.replace(/,/g, ''), 10));

            const summoner = cells[2].textContent.trim();
            const remainingTime = cells[3].textContent.trim();
            const isPublic = cells[4].textContent.trim().includes('공개');

            updatedBosses.push({
                name: baseName,
                id: bossId,
                currentHealth,
                maxHealth,
                summoner,
                remainingTime,
                isPublic,
                minDamage: bosses.find(b => b.name === baseName)?.minDamage || 0
            });
        });

        return updatedBosses;
    }

    const clickElement = (text, isSpecial = false) => {
        const xpaths = isSpecial
            ? [`//input[@value = '${text}']`]
            : [`//a[text() = '${text}']`, `//input[@value = '${text}']`];
        for (let xpath of xpaths) {
            const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (element) {
                element.click();
                return true;
            }
        }
        return false;
    };

    function autoPressKeys() {
        if (isAutoMode) {
            clickElement("협동");
            setTimeout(processBossList, 1000);
        }
    }

    // 보스 토글 UI 생성 함수 (접기/펼치기 및 왼쪽 정렬 적용)
    function createBossToggleUI() {
        bossUI = document.createElement('div');
        bossUI.style.position = 'fixed';
        bossUI.style.top = '160px';
        bossUI.style.left = '10px';
        bossUI.style.background = '#000';
        bossUI.style.padding = '10px';
        bossUI.style.border = '1px solid #000';
        bossUI.style.zIndex = '1000';
        bossUI.style.color = '#fff';

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = '보스 목록 접기';
        toggleBtn.style.width = '100%';
        toggleBtn.style.marginBottom = '5px';
        let isCollapsed = false;
        toggleBtn.onclick = () => {
            isCollapsed = !isCollapsed;
            bossContainer.style.display = isCollapsed ? 'none' : 'block';
            toggleBtn.textContent = isCollapsed ? '보스 목록 펼치기' : '보스 목록 접기';
        };
        bossUI.appendChild(toggleBtn);

        const bossContainer = document.createElement('div');
        bossContainer.style.textAlign = 'left';
        bosses.forEach(boss => {
            const div = document.createElement('div');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = boss.active;
            checkbox.onchange = () => {
                boss.active = checkbox.checked;
                console.log(`${boss.name} ${boss.active ? '활성화' : '비활성화'}됨`);
            };
            div.appendChild(checkbox);
            div.append(` ${boss.name} (목표딜량: ${boss.minDamage.toLocaleString()})`);
            bossContainer.appendChild(div);
        });
        bossUI.appendChild(bossContainer);

        document.body.appendChild(bossUI);
    }

    // UI ON/OFF 토글 버튼 생성 함수
    function createUIToggleButton() {
        const toggleButton = document.createElement('button');
        toggleButton.textContent = 'UI OFF';
        toggleButton.style.position = 'fixed';
        toggleButton.style.bottom = '10px';
        toggleButton.style.left = '10px';
        toggleButton.style.zIndex = '1001';
        toggleButton.style.padding = '5px 10px';
        toggleButton.style.background = '#000';
        toggleButton.style.color = '#fff';
        toggleButton.style.border = '1px solid #fff';

        toggleButton.onclick = () => {
            isUIVisible = !isUIVisible;
            if (bossUI) {
                bossUI.style.display = isUIVisible ? 'block' : 'none';
            }
            toggleButton.textContent = isUIVisible ? 'UI OFF' : 'UI ON';
        };

        document.body.appendChild(toggleButton);
    }

    // 스크립트 시작 시 UI 생성
    createBossToggleUI();
    createUIToggleButton();

    setInterval(autoPressKeys, config.autoInterval);
})();