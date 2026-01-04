// ==UserScript==
// @name         Auto Battle
// @namespace    http://tampermonkey.net/
// @description  Slot Machine, Las Noches, Tailed Beast, Valhalla Lv. 56
// @version      5.0
// @match        https://pockieninja.online
// @downloadURL https://update.greasyfork.org/scripts/533151/Auto%20Battle.user.js
// @updateURL https://update.greasyfork.org/scripts/533151/Auto%20Battle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let autoBattleSlot = false;
    let autoBattleLN = false;
    let autoBattleTB = false;
    let currentBeastIndex = 0;

    // Daftar koordinat Tailed Beast (Urutan: Shukaku → Kurama)
    const tailedBeastCoordinates = [
        { name: "Shukaku", x: 810, y: 475 },
        { name: "Son Goku", x: 718, y: 308 },
        { name: "Son Goku 2", x: 750, y: 280 },
        { name: "Matatabi", x: 286, y: 310 },
        { name: "Matatabi2", x: 228, y: 305 },
        { name: "Chomei", x: 559, y: 198 },
        { name: "Chomei 2", x: 585, y: 145 },
        { name: "Kurama", x: 290, y: 514 },
        { name: "Gyuki", x: 548, y: 439 },
        { name: "Saiken", x: 512, y: 372 },
        { name: "Kokuo", x: 986, y: 351 },
        { name: "Isobu", x: 892, y: 178 },
    ];

    // === SLOT MACHINE ===
    function klikChallengeSlot() {
        if (!autoBattleSlot) return;

        let tombolChallenge = document.querySelector(".slot-machine__challenge-btn");
        if (tombolChallenge) {
            console.log("🎰 Menekan tombol Challenge (Slot)...");
            tombolChallenge.click();
            cekBattleSelesai(klikChallengeSlot);
        }
    }

    function startAutoBattleSlot() {
        if (autoBattleSlot) return;
        autoBattleSlot = true;
        console.log("🚀 Auto Battle Slot Machine DIMULAI!");
        klikChallengeSlot();
    }

    function stopAutoBattleSlot() {
        autoBattleSlot = false;
        console.log("🛑 Auto Battle Slot Machine DIHENTIKAN!");
    }

    // === LAS NOCHES ===
    function klikContinueLN() {
        if (!autoBattleLN) return;

        let floorElement = [...document.querySelectorAll('pre')]
            .find(pre => pre.textContent.trim().startsWith("Current Floor"));

        if (floorElement) {
            let currentFloor = parseInt(floorElement.textContent.replace("Current Floor", "").trim(), 10);
            if (!isNaN(currentFloor) && currentFloor >= 166) {
                console.log(`🚫 Current Floor telah mencapai ${currentFloor}. Menghentikan Auto Battle.`);
                autoBattleLN = false;
                return;
            }
            console.log(`🏛️ Current Floor: ${currentFloor}`);
        }

        let button = [...document.querySelectorAll('button')].find(btn =>
            btn.textContent.trim() === "Continue" &&
            btn.classList.contains("theme__button--original")
        );

        if (button) {
            console.log("⚔️ Menekan tombol Continue (LN)...");
            button.click();
            cekBattleSelesai(klikContinueLN);
        }
    }

    function startAutoBattleLN() {
        if (autoBattleLN) return;
        autoBattleLN = true;
        console.log("🚀 Auto Battle Las Noches DIMULAI!");
        klikContinueLN();
    }

    function stopAutoBattleLN() {
        autoBattleLN = false;
        console.log("🛑 Auto Battle Las Noches DIHENTIKAN!");
    }

    // === TAILED BEAST ===
    function clickNextBeast() {
        if (!autoBattleTB) return;

        const beast = tailedBeastCoordinates[currentBeastIndex];
        console.log(`🦊 Mencoba klik ${beast.name} di (${beast.x}, ${beast.y})`);
        clickCanvas(beast.x, beast.y);

        // Pindah ke beast berikutnya
        currentBeastIndex = (currentBeastIndex + 1) % tailedBeastCoordinates.length;
    }

    function clickCanvas(x, y) {
        if (!autoBattleTB) return;

        const canvas = document.querySelector("#tailed-beast-map-container canvas");
        if (!canvas) {
            console.log("❌ Canvas tidak ditemukan!");
            return;
        }

        console.log(`📌 Klik pada X=${x}, Y=${y}`);

        ["mousedown", "mouseup", "click"].forEach(eventType => {
            const event = new MouseEvent(eventType, {
                bubbles: true,
                cancelable: true,
                composed: true,
                clientX: x,
                clientY: y
            });

            canvas.dispatchEvent(event);
            document.dispatchEvent(event);
        });

        console.log(`✅ Klik berhasil di X: ${x}, Y: ${y}`);

        setTimeout(checkChooseDifficulty, 500);  // Periksa elemen "Choose Difficulty Level" setelah klik canvas
    }

        function checkChooseDifficulty() {
        if (!autoBattleTB) return;

        // Periksa apakah elemen "Choose Difficulty Level" sudah muncul
        const difficultyLevelText = document.querySelector("#game-container > div:nth-child(9) > div.panel__top_bar.moveable > div > b");

        if (difficultyLevelText && difficultyLevelText.textContent.trim() === "Choose Difficulty Level") {
            console.log("✅ 'Choose Difficulty Level' muncul! Klik tombol 'Fight'...");
            clickButtonAfterCanvas();
        } else {
            console.log("⚠️ 'Choose Difficulty Level' belum muncul, mencoba koordinat lain...");
            // Coba koordinat berikutnya jika elemen belum muncul
            clickNextBeast();
        }
    }

function clickButtonAfterCanvas() {
    if (!autoBattleTB) return;

    const selector = "#game-container > div:nth-child(9) > div.themed_panel.theme__transparent--original > div > div:nth-child(1) > div.grid > div:nth-child(4) > button";
    const button = document.querySelector(selector);

    if (button && button.textContent.trim() === "Fight") {
        console.log("✅ Tombol 'Fight' ditemukan! Menunggu tombol tidak disabled...");

        const waitUntilEnabled = setInterval(() => {
            if (!autoBattleTB) {
                clearInterval(waitUntilEnabled);
                return;
            }

            if (!button.disabled) {
                clearInterval(waitUntilEnabled);

                console.log("✅ Tombol 'Fight' sudah aktif! Menunggu 1 detik sebelum klik...");
                setTimeout(() => {
                    button.click();
                    console.log("🔥 Tombol 'Fight' diklik!");

                    // Mulai timeout 10 detik untuk cek fightContainer
                    let timeout = setTimeout(() => {
                        if (!document.querySelector("#fightContainer")) {
                            console.log("❌ #fightContainer tidak muncul dalam 10 detik!");

                            // Tekan tombol Close jika ada
                            let closeBtn = [...document.querySelectorAll(".theme__button--original")]
                                .find(btn => btn.textContent.trim() === "Close");

                            if (closeBtn) {
                                console.log("🧹 Menekan tombol Close karena tidak ada respon...");
                                closeBtn.click();
                            }

                            // Ulangi klik koordinat dari awal
                            currentBeastIndex = 0;
                            setTimeout(clickNextBeast, 1000);
                        }
                    }, 7000);

                    // Jika #fightContainer muncul, lanjut battle
                    const checkFightContainer = setInterval(() => {
                        const fightContainer = document.querySelector("#fightContainer");
                        if (fightContainer) {
                            clearTimeout(timeout);
                            clearInterval(checkFightContainer);

                            console.log("✅ #fightContainer ditemukan, battle dimulai!");
                            cekBattleSelesai(() => {
                                console.log("✅ Battle selesai, mulai dari awal...");
                                currentBeastIndex = 0;
                                setTimeout(clickNextBeast, 500);
                            });
                        }
                    }, 500);

                }, 500);
            } else {
                console.log("⏳ Menunggu tombol 'Fight' aktif...");
            }
        }, 500);
    } else {
        console.log("⚠️ Tombol 'Fight' tidak ditemukan atau teksnya bukan 'Fight'!");
    }
}

    function startAutoBattleTB() {
        if (autoBattleTB) return;
        autoBattleTB = true;
        currentBeastIndex = 0;
        console.log("🚀 Auto Battle Tailed Beast DIMULAI!");
        clickNextBeast();
    }

    function stopAutoBattleTB() {
        autoBattleTB = false;
        console.log("🛑 Auto Battle Tailed Beast DIHENTIKAN!");
    }

    // === CEK BATTLE SELESAI ===
    function cekBattleSelesai(callback) {
        let cekInterval = setInterval(() => {
            let tombolCloseList = document.querySelectorAll(".theme__button--original");
            for (let tombol of tombolCloseList) {
                if (tombol.textContent.trim() === "Close") {
                    console.log("🏁 Battle selesai! Menekan tombol 'Close'...");
                    tombol.click();
                    clearInterval(cekInterval);
                    setTimeout(callback, 500);
                    return;
                }
            }
        }, 500);
    }

    // === VALHALLA LV.56 ===
let autoBattleRunning = false;
let currentDungeonIndex = 0;

const dungeons = [
    {
        completeSelector: '#game-container > div:nth-child(5) > div:nth-child(2) > img[src*="0_complete.png"]',
        buttonSelector: '#game-container > div:nth-child(5) > div:nth-child(2) > button > img',
        monsterContainer: '#game-container > div:nth-child(5) > div:nth-child(3)',
    },
    {
        completeSelector: '#game-container > div:nth-child(5) > div:nth-child(3) > img[src*="1_complete.png"]',
        buttonSelector: '#game-container > div:nth-child(5) > div:nth-child(3) > button > img',
        monsterContainer: '#game-container > div:nth-child(5) > div:nth-child(4)',
    },
    {
        completeSelector: '#game-container > div:nth-child(5) > div:nth-child(4) > img[src*="2_complete.png"]',
        buttonSelector: '#game-container > div:nth-child(5) > div:nth-child(4) > button > img',
        monsterContainer: '#game-container > div:nth-child(5) > div:nth-child(5)',
    },
    {
        completeSelector: '#game-container > div:nth-child(5) > div:nth-child(5) > img[src*="3_complete.png"]',
        buttonSelector: '#game-container > div:nth-child(5) > div:nth-child(5) > button > img',
        monsterContainer: '#game-container > div:nth-child(5) > div:nth-child(6)',
    }
];

function waitForElement(selector, callback, checkInterval = 500) {
    const interval = setInterval(() => {
        if (!autoBattleRunning) return clearInterval(interval);
        const el = document.querySelector(selector);
        if (el) {
            clearInterval(interval);
            callback(el);
        }
    }, checkInterval);
}

function cekBattleSelesai2(callback) {
    const cekInterval = setInterval(() => {
        const tombolCloseList = document.querySelectorAll(".theme__button--original");
        for (let tombol of tombolCloseList) {
            if (tombol.textContent.trim() === "Close") {
                console.log("🏁 Battle selesai, klik Close");
                tombol.click();
                clearInterval(cekInterval);
                setTimeout(callback, 4000);
                return;
            }
        }
    }, 500);
}

function bukaDungeon(index, callback) {
    console.log(`📂 Buka Dungeon ke-${index + 1}`);
    waitForElement(dungeons[index].buttonSelector, (btn) => {
        btn.click();
        waitForElement('img[src*="dungeons/select.png"]', () => {
            console.log("📜 Panel select muncul");
            callback();
        });
    });
}

function lawanSemuaMonster(index, callback) {
    const baseSelector = dungeons[index].monsterContainer;
    let currentMonster = 2;

    function lawanBerikutnya() {
        if (!autoBattleRunning) return;

        if (currentMonster > 6) {
            console.log("✅ Semua monster di dungeon ini telah dilawan.");
            callback(); // Lanjut ke dungeon berikutnya
            return;
        }

        const monsterBtn = document.querySelector(`${baseSelector} > button:nth-child(${currentMonster}) > img`);
        if (!monsterBtn || monsterBtn.parentElement.classList.contains("--disabled")) {
            console.log(`⚠️ Monster ke-${currentMonster - 1} tidak bisa dilawan, lanjut ke berikutnya...`);
            currentMonster++;
            return lawanBerikutnya();
        }

        console.log(`⚔️ Melawan monster ke-${currentMonster - 1}`);
        monsterBtn.click();

        cekBattleSelesai2(() => {
            currentMonster++;
            lawanBerikutnya();
        });
    }

    lawanBerikutnya();
}

function mulaiAutoBattleValhalla() {
    if (autoBattleRunning) return;
    autoBattleRunning = true;
    currentDungeonIndex = 0;
    console.log("🚀 Auto Battle Valhalla DIMULAI!");

    function nextDungeon() {
        if (!autoBattleRunning) return;

        if (currentDungeonIndex >= dungeons.length) {
            console.log("🎉 Semua dungeon telah selesai!");
            autoBattleRunning = false;
            return;
        }

        const dungeon = dungeons[currentDungeonIndex];

        // Cek apakah dungeon sudah complete
        if (document.querySelector(dungeon.completeSelector)) {
            console.log(`✅ Dungeon ${currentDungeonIndex + 1} sudah selesai, lanjut ke dungeon berikutnya...`);
            currentDungeonIndex++;
            return nextDungeon();
        }

        bukaDungeon(currentDungeonIndex, () => {
            lawanSemuaMonster(currentDungeonIndex, () => {
                console.log(`➡️ Selesai Dungeon ${currentDungeonIndex + 1}, lanjut...`);
                currentDungeonIndex++;
                setTimeout(nextDungeon, 1000);
            });
        });
    }

    nextDungeon();
}

function startAutoBattleValhalla() {
    if (!autoBattleRunning) {
        console.log("▶️ Memulai auto battle Valhalla");
        mulaiAutoBattleValhalla(); // ✅ Ini benar
    }
}

function stopAutoBattleValhalla() {
    autoBattleRunning = false;
    console.log("⏹️ Auto battle Valhalla dihentikan.");
}


// === UI AUTO BATTLE ===
function createUIButton() {
    let uiDiv = document.createElement("div");
    uiDiv.innerHTML = `
        <div id="autoBattleUI" style="position: fixed; top: 205px; left: 0px; background: rgba(0, 0, 0, 0.8); padding: 12px; z-index: 9999; border-radius: 8px; font-family: sans-serif; min-width: 100px;">
            <h4 style="color: #ffffff; text-align: center; margin-top: 0; margin-bottom: 10px;">⚔️ Auto Battle</h4>
            <div style="margin-bottom: 10px;">
                <button id="toggleSlot" class="auto-btn">Start SM</button>
            </div>
            <div style="margin-bottom: 10px;">
                <button id="toggleLN" class="auto-btn">Start LN</button>
            </div>
            <div style="margin-bottom: 10px;">
                <button id="toggleTB" class="auto-btn">Start TB</button>
            </div>
            <div>
                <button id="toggleVH" class="auto-btn">Start VH</button>
            </div>
        </div>
        <style>
            .auto-btn {
                width: 100%;
                padding: 6px 10px;
                border: none;
                border-radius: 5px;
                background-color: #007bff;
                color: white;
                font-size: 13px;
                cursor: pointer;
                transition: 0.2s ease-in-out;
            }
            .auto-btn:hover {
                background-color: #0056b3;
            }
            .auto-btn.active {
                background-color: #dc3545;
            }
        </style>
    `;
    document.body.appendChild(uiDiv);

    function setupToggle(buttonId, startFn, stopFn, label) {
        let isRunning = false;
        const button = document.getElementById(buttonId);
        button.addEventListener("click", () => {
            isRunning = !isRunning;
            button.textContent = isRunning ? `Stop ${label}` : `Start ${label}`;
            button.classList.toggle("active", isRunning);
            isRunning ? startFn() : stopFn();
        });
    }

    setupToggle("toggleSlot", startAutoBattleSlot, stopAutoBattleSlot, "SM");
    setupToggle("toggleLN", startAutoBattleLN, stopAutoBattleLN, "LN");
    setupToggle("toggleTB", startAutoBattleTB, stopAutoBattleTB, "TB");
    setupToggle("toggleVH", startAutoBattleValhalla, stopAutoBattleValhalla, "VH");
}

createUIButton();
})();