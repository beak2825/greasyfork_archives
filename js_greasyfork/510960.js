// ==UserScript==
// @name         XPanel Helper Mini One LVL Payments
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @description  Помощник в выплатах
// @author       Dmitry - Payments Manager
// @match        http://xpanel.me/withdrawals
// @match        https://xpanel.me/withdrawals
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510960/XPanel%20Helper%20Mini%20One%20LVL%20Payments.user.js
// @updateURL https://update.greasyfork.org/scripts/510960/XPanel%20Helper%20Mini%20One%20LVL%20Payments.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function highlightRowsWithfk() {
        const rows = document.querySelectorAll('tr');

        rows.forEach(function (row) {
            if (row.textContent.toLowerCase().includes('fk')) {
                row.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
            }
            if (row.textContent.toLowerCase().includes('payeer')) {
                row.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
            }
            if (row.textContent.toLowerCase().includes('piastrix')) {
                row.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
            }
        });
    }

    function highlightRowsWithCard() {
        const rows = document.querySelectorAll('tr');

        rows.forEach(function (row) {
            if (row.textContent.toLowerCase().includes('2202206825199065')) {
                row.style.backgroundColor = 'rgba(0, 0, 255, 0.2)';
            }
            if (row.textContent.toLowerCase().includes('79850010660')) {
                row.style.backgroundColor = 'rgba(0, 0, 255, 0.2)';
            }
            if (row.textContent.toLowerCase().includes('f112576345')) {
                row.style.backgroundColor = 'rgba(0, 0, 255, 0.2)';
            }
            if (row.textContent.toLowerCase().includes('f7202414017360797')) {
                row.style.backgroundColor = 'rgba(0, 0, 255, 0.2)';
            }
            if (row.textContent.toLowerCase().includes('201567513965')) {
                row.style.backgroundColor = 'rgba(0, 0, 255, 0.2)';
            }
            if (row.textContent.toLowerCase().includes('79210168554')) {
                row.style.backgroundColor = 'rgba(0, 0, 255, 0.2)';
            }
            if (row.textContent.toLowerCase().includes('79312705716')) {
                row.style.backgroundColor = 'rgba(0, 0, 255, 0.2)';
            }
            if (row.textContent.toLowerCase().includes('f111076806')) {
                row.style.backgroundColor = 'rgba(0, 0, 255, 0.2)';
            }
            if (row.textContent.toLowerCase().includes('79214148290')) {
                row.style.backgroundColor = 'rgba(0, 0, 255, 0.2)';
            }
            if (row.textContent.toLowerCase().includes('4100118295416955')) {
                row.style.backgroundColor = 'rgba(0, 0, 255, 0.2)';
            }
            if (row.textContent.toLowerCase().includes('f7202430158915330')) {
                row.style.backgroundColor = 'rgba(0, 0, 255, 0.2)';
            }
            if (row.textContent.toLowerCase().includes('79538989261')) {
                row.style.backgroundColor = 'rgba(0, 0, 255, 0.2)';
            }
            if (row.textContent.toLowerCase().includes('2202208070784591')) {
                row.style.backgroundColor = 'rgba(0, 0, 255, 0.2)';
            }
if (
    row.textContent.toLowerCase().includes('79850010660') ||
    row.textContent.toLowerCase().includes('79501653905') ||
    row.textContent.toLowerCase().includes('5469680012082535') ||
    row.textContent.toLowerCase().includes('2200700464203479') ||
    row.textContent.toLowerCase().includes('trtzbfvksnvdv5xeunwamphs7ddu3xztcu') ||
    row.textContent.toLowerCase().includes('bc1qt44h3vkx5gjfazukjmfgaepvvuj47tmmwjcq7w') ||
    row.textContent.toLowerCase().includes('0x177c4c4463d1c558d3203bd0fe4635606c2d09c4')
) {
    row.style.backgroundColor = 'rgba(0, 0, 255, 0.2)';
}
        });
    }

    function highlightLargeAmounts() {
        const rows = document.querySelectorAll('tr');

        rows.forEach(function (row) {
            const cells = row.querySelectorAll('td');

            cells.forEach(function (cell) {
                const span = cell.querySelector('span');
                if (span) {
                    const amountText = span.textContent.replace(/\s+/g, '').replace(',', '.');
                    const amount = parseFloat(amountText);

                    if (amount > 50000) {
                        row.style.backgroundColor = 'rgba(0, 96, 128, 0.2)';
                    }
                }
            });
        });
    }

    function cleanText(text) {
        return text.replace(/,/g, '.').replace(/[\s\u00A0&\xa0;]/g, '');
    }

    function calculateSumAboveRow(currentRow) {
        let sum = 0;
        let previousRows = Array.from(currentRow.parentElement.children);
        let currentRowIndex = previousRows.indexOf(currentRow);

        for (let i = 0; i < currentRowIndex; i++) {
            let prevRow = previousRows[i];

            const spans = prevRow.querySelectorAll('span');
            spans.forEach(span => {
                const textContent = span.textContent;
                const cleanedText = cleanText(textContent);

                const match = cleanedText.match(/\(([\d.]+)RUB\.\)/);
                if (match) {
                    const value = parseFloat(match[1]);
                    if (!isNaN(value)) {
                        sum += value;
                    }
                }
            });
        }
        return sum;
    }



    function updateButtons(buttonClass, buttonColor, depositTextMatch, textUpdateCallback) {
        const buttons = document.querySelectorAll(buttonClass);
        buttons.forEach(button => {
            let currentRow = button.closest('tr');
            let sum = calculateSumAboveRow(currentRow);

            const depositCell = currentRow.querySelectorAll('td')[2];
            const depositText = depositCell ? cleanText(depositCell.textContent) : '';
            const depositMatch = depositText.match(depositTextMatch);
            let depositValue = 1;
            if (depositMatch) {
                depositValue = parseFloat(depositMatch[1]);
            }

            const multiplier = sum / depositValue;

            const innerOperations = currentRow.querySelector('.awsui_content_gwq0h_f8qtu_97');
            let innerOperationsCount = '';
            let innerOperationsNumber = 0;
            if (innerOperations) {
                const match = innerOperations.textContent.match(/Inner operations:\s*(\d+)/);
                if (match) {
                    innerOperationsNumber = parseInt(match[1], 10);
                    innerOperationsCount = ` (COUNT: ${innerOperationsNumber})`;
                }
            }

            // Only add innerOperationsCount for specific button texts
            const buttonText = button.textContent.replace(/\(COUNT: \d+\)/g, "").trim();
            if (buttonText.includes("WHEEL") || buttonText.includes("VK BONUS") || buttonText.includes("TG BONUS") || buttonText.includes("RAIN")) {
                button.textContent = `${buttonText}${innerOperationsCount}`;
            } else if (buttonText.includes("PROMO CODE")) {
                if (innerOperationsNumber > 5) {
                    button.textContent = `PROMO CODE (X: ${multiplier.toFixed(2)}) and COUNT ${innerOperationsCount})`;
                } else {
                    button.textContent = `PROMO CODE (X: ${multiplier.toFixed(2)})`;
                }
            } else {
                textUpdateCallback(button, multiplier);
            }
        });
    }

    function updateDepositButtons() {
        updateButtons(
            'span.main_badge__u6DKH.main_tab__8EKqV.main_green__wzcid.awsui_badge_1yjyg_1kk9m_93.awsui_badge-color-grey_1yjyg_1kk9m_113',
            'main_green__wzcid',
            /([\d.]+)RUB\./,
            (button, multiplier) => {
                button.textContent = `DEPOSIT (X: ${multiplier.toFixed(2)})`;
            }
        );
    }

    function updatePromoButtons() {
        updateButtons(
            'span.main_badge__u6DKH.main_tab__8EKqV.main_cyan__Iedd2.awsui_badge_1yjyg_1kk9m_93.awsui_badge-color-grey_1yjyg_1kk9m_113',
            'main_cyan__Iedd2',
            /([\d.]+)RUB\./,
            (button, multiplier, innerOperationsCount, innerOperationsNumber) => {
                const depositCell = button.closest('tr').querySelectorAll('td')[2];
                const depositText = depositCell ? cleanText(depositCell.textContent) : '';
                const depositMatch = depositText.match(/([\d.]+)RUB\./);
                let depositValue = 1;
                if (depositMatch) {
                    depositValue = parseFloat(depositMatch[1]);
                }

                if (button.textContent === "PROMO CODE") {
                    if (innerOperationsNumber > 5) {
                        button.textContent = `PROMO CODE (X: ${multiplier.toFixed(2)}) and COUNT ${innerOperationsCount})`;
                    } else {
                        button.textContent = `PROMO CODE (X: ${multiplier.toFixed(2)})`;
                    }
                }
            }
        );
    }

    function updateWeeklyButtons() {
        updateButtons(
            'span.main_badge__u6DKH.main_tab__8EKqV.main_darkYellow__mFVi0.awsui_badge_1yjyg_1kk9m_93.awsui_badge-color-grey_1yjyg_1kk9m_113',
            'main_darkYellow__mFVi0',
            /([\d.]+)RUB\./,
            (button, multiplier) => {
                if (button.textContent === "WEEKLY GIVEAWAY") {
                    button.textContent = `WEEKLY GIVEAWAY (X: ${multiplier.toFixed(2)})`;
                }
            }
        );
    }

    function processNewNodes(nodes) {
        nodes.forEach(node => {
            if (node.nodeType === 1) {
                if (node.matches('span.main_badge__u6DKH.main_tab__8EKqV.main_green__wzcid.awsui_badge_1yjyg_1kk9m_93.awsui_badge-color-grey_1yjyg_1kk9m_113')) {
                    updateDepositButtons();
                }
                if (node.matches('span.main_badge__u6DKH.main_tab__8EKqV.main_cyan__Iedd2.awsui_badge_1yjyg_1kk9m_93.awsui_badge-color-grey_1yjyg_1kk9m_113')) {
                    updatePromoButtons();
                }
                if (node.matches('span.main_badge__u6DKH.main_tab__8EKqV.main_darkYellow__mFVi0.awsui_badge_1yjyg_1kk9m_93.awsui_badge-color-grey_1yjyg_1kk9m_113')) {
                    updateWeeklyButtons();
                }

                const childButtons = node.querySelectorAll('span.main_badge__u6DKH.main_tab__8EKqV.main_green__wzcid.awsui_badge_1yjyg_1kk9m_93.awsui_badge-color-grey_1yjyg_1kk9m_113');
                if (childButtons.length > 0) {
                    updateDepositButtons();
                }
                const childButtonsPromo = node.querySelectorAll('span.main_badge__u6DKH.main_tab__8EKqV.main_cyan__Iedd2.awsui_badge_1yjyg_1kk9m_93.awsui_badge-color-grey_1yjyg_1kk9m_113');
                if (childButtonsPromo.length > 0) {
                    updatePromoButtons();
                }
                const childButtonsWeekly = node.querySelectorAll('span.main_badge__u6DKH.main_tab__8EKqV.main_darkYellow__mFVi0.awsui_badge_1yjyg_1kk9m_93.awsui_badge-color-grey_1yjyg_1kk9m_113');
                if (childButtonsWeekly.length > 0) {
                    updateWeeklyButtons();
                }
            }
        });
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            processNewNodes(mutation.addedNodes);
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    updateDepositButtons();
    updatePromoButtons();
    updateWeeklyButtons();

    function highlightAmountsBefore6000() {
        const tables = document.querySelectorAll('.awsui_table_wih1l_1ykdk_135');

        tables.forEach(function (table) {
            const parentDiv = table.closest('.awsui_wrapper_wih1l_1ykdk_145');
            const containerDiv = table.closest('.awsui_container_1d2i7_1fymu_262');
            if (parentDiv && !containerDiv) {
                const rows = table.querySelectorAll('tr');

                rows.forEach(function (row) {
                    let shouldHighlight = true;
                    const badges = row.querySelectorAll('.main_badge__u6DKH');
                    badges.forEach(function (badge) {
                        const text = badge.textContent;
                        if (text.includes("RAKEBACK") || text.includes("RELOAD") || text.includes("SYSTEM") ||
                            text.includes("BOOST") || text.includes("VK BONUS") || text.includes("DEPOSIT") ||
                            text.includes("RACE") || text.includes("REFUND") || text.includes("WITHDRAW") ||
                            text.includes("WHEEL") || text.includes("PROMO CODE") || text.includes("AFF") ||
                            text.includes("LOYALTY") || text.includes("WEEKLY GIVEAWAY") || text.includes("TG BONUS") ||
                            text.includes("RAIN") || text.includes("(") || text.includes("GAME") || text.includes(":") ||
                            text.includes("LVLUP")) {
                            shouldHighlight = false;
                        }
                    });

                    if (shouldHighlight) {
                        const cells = row.querySelectorAll('td');

                        cells.forEach(function (cell) {
                            const span = cell.querySelector('span');
                            if (span && span.textContent.includes("RUB.") && !span.textContent.includes("(")) {
                                const amountText1 = span.textContent.replace(/[()\s+&nbsp;]/g, '').replace(',', '.');
                                const amount1 = parseFloat(amountText1);

                                if (amount1 >= 13000) {
                                    //row.style.display = 'none';
                                    //row.style.backgroundColor = 'rgba(0, 255, 92, 0.05)';
                                }
                            }
                        });
                    }
                });
            }
        });
    }

    function LiveInstantGames() {
        // Массив с названиями игр
        const gameNames = ["LIVE ROULETTE A (2871)", "LIVE SPEED ROULETTE (2872)", "ROULETTE GERMANY (2873)", "ROULETTE ITALY (2874)", "ROULETTE RUSSIA (2875)", "LIVE BLACKJACK A (2972)", "LIVE BLACKJACK B (2973)", "LIVE BLACKJACK C (2974)", "LIVE BLACKJACK D (2975)", "LIVE BLACKJACK E (2976)", "LIVE BACCARAT A (3276)", "LIVE BACCARAT B (3277)", "LIVE BACCARAT C (3278)", "ROULETTE MACAO (3279)", "SPEED BACCARAT A (3280)", "SPEED BACCARAT B (3281)", "MEGA SIC BO (3918)", "BLACKJACK AZURE B (4306)", "BLACKJACK AZURE C (4307)", "BLACKJACK AZURE D (4308)", "BLACKJACK AZURE E (4309)", "BLACKJACK AZURE F (4310)", "BLACKJACK AZURE G (4311)", "BLACKJACK AZURE H (4312)", "BLACKJACK AZURE I (4313)", "BLACKJACK AZURE J (4314)", "ROULETTE AZURE (4315)", "BLACKJACK AZURE A (4316)", "MEGA WHEEL (4363)", "MEGA ROULETTE (5189)", "ONE BLACKJACK (5200)", "SPORTBOOK (6142)", "DRAGON TIGER (6155)", "AUTO ROULETTE (6282)", "BLACKJACK 18: AZURE (6284)", "BLACKJACK 20: AZURE (6285)", "SPEED BACCARAT C (6289)", "LIVE BACCARAT E (6291)", "BLACKJACK 21: AZURE (6292)", "BLACKJACK 17: AZURE (6293)", "LIVE BACCARAT D (6295)", "SPEED BACCARAT E (6296)", "BLACKJACK 19: AZURE (6297)", "SPEED BACCARAT D (6298)", "BLACKJACK 24: AZURE (6329)", "BLACKJACK 23: AZURE (6330)", "BLACKJACK 22: AZURE (6331)", "BLACKJACK 26: AZURE (6333)", "BLACKJACK 25: AZURE (6334)", "BLACKJACK 30: AZURE 2 (7059)", "BLACKJACK 31: AZURE 2 (7063)", "BLACKJACK 32: AZURE 2 (7123)", "SWEET BONANZA CANDYLAND (7398)", "BLACKJACK 33: THE CLUB (7399)", "BLACKJACK 36: THE CLUB (7401)", "BLACKJACK 34: THE CLUB (7403)", "ROULETTE 9: THE CLUB (7404)", "ONE BLACKJACK 2: INDIGO (7407)", "BLACKJACK 35: THE CLUB (7408)", "BACCARAT 7 (7439)", "SPEED BACCARAT 8 (7461)", "BACCARAT 9 (7462)", "SPEED BACCARAT 7 (7464)", "BACCARAT 8 (7465)", "BACCARAT 10 (7467)", "ROULETTE 10: RUBY (7474)", "SPEED BACCARAT 9 (7480)", "SPORT (10000)", "DUELBITS: FIRST PERSON BLACKJACK (11173)", "FASTPAY: FIRST PERSON BLACKJACK (11176)", "FOOTBALL STUDIO: DICE (11183)", "FOOTBALL STUDIO; ROULETTE (11184)", "FREE BET BLACKJACK 1 (11187)", "FREE BET BLACKJACK 2 (11188)", "FREE BET BLACKJACK 3 (11189)", "FREE BET BLACKJACK 4 (11190)", "FREE BET BLACKJACK 5 (11191)", "FREE BET BLACKJACK 6 (11192)", "FREE BET BLACKJACK 7 (11193)", "GONZO'S TREASURE HUNT (11198)", "GOODMAN FIRST PERSON BLACKJACK (11199)", "HINDI LIGHTNING ROULETTE (11204)", "INFINITE FREE BET BLACKJACK (11208)", "MONOPOLY LIVE (11221)", "CRAZY COIN FLIP (11236)", "RULETKA LIVE (11268)", "SPEED ROULETTE (11338)", "THREE CARD POKER (11347)", "TURKISH LIGHTNING ROULETTE (11353)", "VIP ROULETTE (11361)", "AUTO LIGHTNING ROULETTE (11367)", "BLACKJACK C (11378)", "BACCARAT C (11400)", "BACCARAT B (11408)", "BLACKJACK VIP X (11430)", "BLACKJACK VIP F (11435)", "BLACKJACK VIP U (11436)", "FIRST PERSON: BLACKJACK (11437)", "BLACKJACK VIP (11438)", "BLACKJACK VIP I (11439)", "BLACKJACK VIP 2 (11445)", "BLACKJACK VIP 6 (11450)", "BLACKJACK VIP 7 (11451)", "BLACKJACK VIP 8 (11452)", "BLACKJACK VIP 9 (11453)", "BLACKJACK VIP A (11454)", "BLACKJACK VIP 3 (11462)", "BLACKJACK VIP 4 (11463)", "BLACKJACK VIP 5 (11465)", "BLACKJACK VIP B (11466)", "BLACKJACK VIP C (11468)", "BLACKJACK VIP D (11469)", "BLACKJACK VIP E (11470)", "BLACKJACK VIP G (11471)", "BLACKJACK VIP H (11472)", "BLACKJACK VIP J (11473)", "BLACKJACK VIP K (11474)", "BLACKJACK VIP L (11475)", "BLACKJACK VIP M (11476)", "BLACKJACK VIP O (11477)", "BLACKJACK VIP P (11479)", "BLACKJACK VIP Q (11480)", "BLACKJACK VIP R (11481)", "BLACKJACK VIP S (11482)", "BLACKJACK VIP T (11483)", "BLACKJACK VIP V (11484)", "BLACKJACK VIP Z (11485)", "BLACKJACK VIP Z (11563)", "BGAMING JACKPOT (13400)", "BLAZE ROLETA AO VIVO (18125)", "FIRST PERSON BACCARAT (18132)", "AVIATOR (22630)", "GOAL (22631)", "DICE (22632)", "KENO (22634)", "HOTLINE (22635)", "MINES (22636)", "PLINKO (22637)", "HILO (22638)", "CLASSIC SPEED BLACKJACK 51 (22820)", "CLASSIC SPEED BLACKJACK 55 (22821)", "CLASSIC SPEED BLACKJACK 54 (22822)", "FIRST PERSON XXXTREME LIGHTNING BACCARAT (33389)", "XXXTREME LIGHTNING BACCARAT (33391)", "DREAM CATCHER (33392)", "MONOPOLY LIVE (33393)", "T√ЬRK√ЗE FUTBOL ST√ЬDYOSU (33394)", "LA PARTAGE FRANCOPHONE (33395)", "SVENSK ROULETTE (33396)", "AMERICAN ROULETTE (33397)", "LONDON ROULETTE (33398)", "FIRST PERSON LIGHTNING ROULETTE (33399)", "FIRST PERSON DREAM CATCHER (33400)", "HIPPODROME GRAND CASINO (33401)", "RULETKA LIVE (33402)", "SALON PRIV√Й ROULETTE (33403)", "BUCHAREST ROULETTE (33404)", "JAPANESE ROULETTE (33405)", "GRAND CASINO ROULETTE (33406)", "VIP ROULETTE (33407)", "LIGHTNING DICE (33408)", "CASINO HOLDEM (33409)", "CARIBBEAN STUD POKER (33410)", "BUCHAREST AUTO-ROULETTE (33411)", "SUOMALAINEN RULETTI (33412)", "FRENCH ROULETTE GOLD (33413)", "SIDE BET CITY (33414)", "DEUTSCHES ROULETTE (33415)", "THREE CARD POKER (33416)", "AUTO LIGHTNING ROULETTE (33417)", "CASINO MALTA ROULETTE (33418)", "VENEZIA ROULETTE (33419)", "FIRST PERSON AMERICAN ROULETTE (33420)", "AUTO-ROULETTE VIP (33421)", "ULTIMATE TEXAS HOLDEM (33422)", "T√ЬRK√ЗE RULET 2 (33423)", "CRAZY TIME (33424)", "ARABIC ROULETTE (33425)", "ROULETTE FRANCOPHONE (33426)", "FIRST PERSON ROULETTE (33427)", "FIRST PERSON BLACKJACK (33428)", "VENEZIA LA PARTAGE (33429)", "NORSK ROULETTE (33430)", "CASH OR CRASH (33431)", "MEGA BALL (33432)", "BENELUX SLINGSHOT (33433)", "SPEED AUTO ROULETTE (33434)", "DANSK ROULETTE (33435)", "FOOTBALL STUDIO (33436)", "DOUBLE BALL ROULETTE (33437)", "SPEED ROULETTE (33438)", "TEXAS HOLDEM BONUS POKER (33439)", "2 HAND CASINO HOLDEM (33440)", "FIRST PERSON MEGA BALL (33441)", "CLASSIC SPEED BLACKJACK 49 (33453)", "CLASSIC SPEED BLACKJACK 27 (33455)", "CLASSIC SPEED BLACKJACK 52 (33458)", "CLASSIC SPEED BLACKJACK 47 (33459)", "CLASSIC SPEED BLACKJACK 56 (33461)", "CLASSIC SPEED BLACKJACK 58 (33474)", "CLASSIC SPEED BLACKJACK 36 (33476)", "CLASSIC SPEED BLACKJACK 13 (33482)", "CLASSIC SPEED BLACKJACK 51 (33489)", "CLASSIC SPEED BLACKJACK 15 (33491)", "TURKISH ROULETTE (33510)", "BACCARAT (33511)", "BACCARAT 2 (33512)", "BACCARAT 3 (33513)", "BACCARAT 5 (33514)", "BACCARAT 8 (33515)", "SPEED BACCARAT 1 (33516)", "SPEED BACCARAT 3 (33517)", "SPEED BACCARAT 6 (33518)", "SPEED BACCARAT 8 (33519)", "SPEED ROULETTE 1 (33520)", "RED DOOR ROULETTE (33523)", "BLACKJACK 37: RUBY (33526)", "SPEED ROULETTE 2 (33529)", "GONZOS TREASURE MAP (33532)", "KLASIK SPEED BLACKJACK 3 (33533)", "SPEED BACCARAT 14 (33534)", "DRAGON TIGER (33536)", "ROMANIAN ROULETTE (33537)", "SPEED BACCARAT 12 (33539)", "LIGHTNING LOTTO (33541)", "GOLD VAULT ROULETTE (33542)", "SPEED BACCARAT 13 (33544)", "CLASSIC SPEED BLACKJACK 57 (33547)", "CLASSIC SPEED BLACKJACK 40 (33548)", "CLASSIC SPEED BLACKJACK 21 (33554)", "CLASSIC SPEED BLACKJACK 26 (33565)", "CRAZY PACHINKO (33566)", "CLASSIC SPEED BLACKJACK 39 (33567)", "CLASSIC SPEED BLACKJACK 31 (33568)", "CLASSIC SPEED BLACKJACK 19 (33571)", "CLASSIC SPEED BLACKJACK 43 (33572)", "CLASSIC SPEED BLACKJACK 48 (33577)", "CLASSIC SPEED BLACKJACK 53 (33578)", "CLASSIC SPEED BLACKJACK 17 (33579)", "CLASSIC SPEED BLACKJACK 59 (33580)", "CLASSIC SPEED BLACKJACK 14 (33581)", "CLASSIC SPEED BLACKJACK 33 (33582)", "CLASSIC SPEED BLACKJACK 12 (33583)", "CLASSIC SPEED BLACKJACK 41 (33584)", "CLASSIC SPEED BLACKJACK 34 (33587)", "CLASSIC SPEED BLACKJACK 46 (33588)", "CLASSIC SPEED BLACKJACK 18 (33590)", "CLASSIC SPEED BLACKJACK 16 (33591)", "CLASSIC SPEED BLACKJACK 37 (33593)", "CLASSIC SPEED BLACKJACK 42 (33594)", "CLASSIC SPEED BLACKJACK 29 (33596)", "CLASSIC SPEED BLACKJACK 54 (33602)", "CLASSIC SPEED BLACKJACK 30 (33604)", "CLASSIC SPEED BLACKJACK 28 (33609)", "CLASSIC SPEED BLACKJACK 24 (33611)", "CLASSIC SPEED BLACKJACK 55 (33612)", "CLASSIC SPEED BLACKJACK 22 (33613)", "CLASSIC SPEED BLACKJACK 44 (33614)", "CLASSIC SPEED BLACKJACK 35 (33616)", "CLASSIC SPEED BLACKJACK 45 (33617)", "CLASSIC SPEED BLACKJACK 38 (33624)", "CLASSIC SPEED BLACKJACK 50 (33626)", "CLASSIC SPEED BLACKJACK 11 (33630)", "CLASSIC SPEED BLACKJACK 23 (33631)", "SPEED BLACKJACK 6: RUBY (33632)", "CLASSIC SPEED BLACKJACK 32 (33634)", "SPEED BACCARAT 2 (33637)", "SPEED BACCARAT 7 (33646)", "ROULETTE (33647)", "ROULETTE 9: THE CLUB (33648)", "MEGA SIC BO (33649)", "BLACKJACK CLASSIC 88 (33650)", "SPEED BACCARAT 11 (33651)", "FIRST PERSON GOLDEN WEALTH BACCARAT (33653)", "SPEED BACCARAT 15 (33654)", "FUNKY TIME (33655)", "FIRST PERSON LIGHTNING LOTTO (33656)", "FIRST PERSON CRAPS (33658)", "SPEED BACCARAT 10 (33660)", "BACCARAT 7 (33664)", "AUTO ROULETTE (33679)", "BACCARAT 1 (33680)", "BACCARAT 6 (33681)", "ROULETTE RUBY (33683)", "VIP ROULETTE вАУ THE CLUB UPGRADE (33684)", "PRIVE LOUNGE BLACKJACK 3 (33686)", "ROULETTE INDIAN (33687)", "SPEED BACCARAT 5 (33689)", "PRIVE LOUNGE BLACKJACK 2 (33691)", "PRIVE LOUNGE BLACKJACK 1 (33692)", "PRIVE LOUNGE BLACKJACK 5 (33698)", "MEGA BACCARAT (33700)", "PRIVE LOUNGE BLACKJACK 4 (33703)", "BACCARAT 9 (33705)", "SPEED BACCARAT 9 (33706)", "BLACKJACK 7: AZURE (33707)", "BLACKJACK 2: AZURE (33708)", "BLACKJACK 5: AZURE (33709)", "BLACKJACK 9: AZURE (33710)", "BLACKJACK 8: AZURE (33711)", "BLACKJACK 4: AZURE (33719)", "BLACKJACK 1: AZURE (33720)", "CLASSIC SPEED BLACKJACK 66 (33721)", "BLACKJACK CLASSIC 9 (33722)", "INFINITE BLACKJACK (33723)", "BLACKJACK CLASSIC 49 (33724)", "SWEET BONANZA CANDYLAND (33725)", "ANDAR BAHAR (33726)", "BLACKJACK VIP I (33727)", "BLACKJACK CLASSIC 50 (33728)", "DRAGON TIGER (33729)", "BLACKJACK CLASSIC 55 (33730)", "BLACKJACK VIP V (33731)", "BLACKJACK CLASSIC 70 (33733)", "ONE BLACKJACK (33734)", "BLACKJACK CLASSIC 53 (33737)", "BLACKJACK CLASSIC 62 (33739)", "BLACKJACK VIP F (33740)", "BLACKJACK CLASSIC 56 (33742)", "BLACKJACK CLASSIC 64 (33743)", "BLACKJACK CLASSIC 59 (33744)", "BLACKJACK CLASSIC 58 (33745)", "BLACKJACK CLASSIC 57 (33746)", "BLACKJACK CLASSIC 61 (33747)", "BLACKJACK CLASSIC 60 (33751)", "CLASSIC SPEED BLACKJACK 62 (33753)", "ONE BLACKJACK 2: RUBY (33754)", "MEGA WHEEL (33761)", "BLACKJACK CLASSIC 72 (33766)", "BLACKJACK 15 (33768)", "BLACKJACK CLASSIC 26 (33769)", "BLACKJACK 12 (33770)", "BLACKJACK CLASSIC 20 (33771)", "BLACKJACK CLASSIC 25 (33772)", "BLACKJACK CLASSIC 24 (33773)", "CLASSIC SPEED BLACKJACK 64 (33774)", "BLACKJACK 16 (33779)", "BLACKJACK CLASSIC 63 (33780)", "BLACKJACK VIP B (33781)", "BLACKJACK VIP C (33782)", "BLACKJACK VIP D (33784)", "MEGA ROULETTE (33785)", "BLACKJACK SILVER C (33786)", "BLACKJACK SILVER E (33788)", "CLASSIC SPEED BLACKJACK 63 (33791)", "BLACKJACK CLASSIC 35 (33792)", "BLACKJACK VIP A (33793)", "BLACKJACK 18: AZURE (33794)", "BLACKJACK CLASSIC 54 (33795)", "BLACKJACK 22: AZURE (33796)", "BLACKJACK SILVER A (33797)", "BLACKJACK SILVER D (33798)", "BLACKJACK SILVER B (33800)", "BLACKJACK 30: AZURE (33802)", "BLACKJACK CLASSIC 51 (33803)", "BLACKJACK 28: AZURE (33804)", "BLACKJACK 34: THE CLUB (33806)", "BLACKJACK 21: AZURE (33807)", "BLACKJACK 17: AZURE (33808)", "ROULETTE AZURE (33809)", "BLACKJACK 26: AZURE (33811)", "BLACKJACK 36: THE CLUB (33812)", "BLACKJACK 35: THE CLUB (33813)", "BLACKJACK 31: AZURE (33817)", "BLACKJACK 33: THE CLUB (33818)", "BLACKJACK 32: AZURE (33819)", "ITALIAN ROULETTE (33820)", "BLACKJACK 3: AZURE (33821)", "GERMAN ROULETTE (33824)", "ROULETTE GREEN (33826)", "ROULETTE MACAO (33828)", "BLACKJACK 25: AZURE (33832)", "BLACKJACK 23: AZURE (33839)", "BLACKJACK 24: AZURE (33841)", "BLACKJACK 29: AZURE (33843)", "RUSSIAN ROULETTE (33848)", "BLACKJACK 6: AZURE (33849)", "BLACKJACK VIP L (33851)", "BLACKJACK VIP X (33852)", "BLACKJACK VIP Q (33853)", "BLACKJACK VIP S (33858)", "BLACKJACK VIP Z (33860)", "SALON PRIV√Й BLACKJACK C (33861)", "BLACKJACK CLASSIC 65 (33863)", "INSTANT ROULETTE (33864)", "BLACKJACK VIP ALPHA (33868)", "CLASSIC SPEED BLACKJACK 65 (33872)", "BLACKJACK VIP G (33873)", "BLACKJACK CLASSIC 30 (33875)", "BLACKJACK SILVER F (33876)", "BLACKJACK PLATINUM VIP (33877)", "BLACKJACK VIP E (33878)", "BLACKJACK VIP R (33879)", "BLACKJACK FORTUNE VIP (33882)", "BLACKJACK CLASSIC 44 (33884)", "BLACKJACK CLASSIC 47 (33885)", "FREE BET BLACKJACK (33887)", "BLACKJACK SILVER G (33888)", "BLACKJACK CLASSIC 69 (33890)", "BLACKJACK CLASSIC 8 (33891)", "BLACKJACK VIP O (33892)", "BLACKJACK VIP N (33893)", "BLACKJACK CLASSIC 45 (33894)", "GAME SHOWS (33896)", "BLACKJACK 11 (33897)", "BLACKJACK VIP H (33898)", "BLACKJACK VIP P (33901)", "BLACKJACK CLASSIC 29 (33902)", "BLACKJACK VIP K (33905)", "POWER BLACKJACK (33906)", "BLACKJACK 14 (33908)", "BLACKJACK CLASSIC 17 (33909)", "BLACKJACK VIP M (33911)", "BLACKJACK VIP J (33912)", "BLACKJACK CLASSIC 52 (33913)", "BLACKJACK (33914)", "BLACKJACK CLASSIC 46 (33915)", "BLACKJACK CLASSIC 71 (33921)", "BLACKJACK CLASSIC 18 (33924)", "CLASSIC SPEED BLACKJACK 60 (33925)", "BLACKJACK CLASSIC 48 (33926)", "BLACKJACK CLASSIC 68 (33929)", "BLACKJACK 27: AZURE (33933)", "BLACKJACK CLASSIC 43 (33935)", "IMMERSIVE ROULETTE (33936)", "SALON PRIV√Й BLACKJACK D (33937)", "BLACKJACK CLASSIC 66 (33938)", "AUTO-ROULETTE (33941)", "LIGHTNING ROULETTE (33942)", "SALON PRIV√Й BLACKJACK E (33943)", "BLACKJACK GRAND VIP (33944)", "BLACKJACK CLASSIC 74 (33945)", "SALON PRIV√Й BLACKJACK F (33946)", "SALON PRIV√Й BLACKJACK A (33947)", "BLACKJACK VIP GAMMA (33948)", "SALON PRIV√Й BLACKJACK B (33949)", "BLACKJACK CLASSIC 67 (33950)", "BLACKJACK 19: AZURE (33952)", "BLACKJACK 10: AZURE (33953)", "CLASSIC SPEED BLACKJACK 61 (33954)", "BLACKJACK VIP T (33955)", "BLACKJACK CLASSIC 73 (33956)", "BLACKJACK DIAMOND VIP (33958)", "BLACKJACK VIP U (33959)", "BLACKJACK VIP BETA (33961)", "BLACKJACK 20: AZURE (33962)", "ROULETTE (33966)", "VIP BLACKJACK 4 (33969)", "VIP BLACKJACK 5 (33970)", "SPEED BLACKJACK 4 (33971)", "SPEED BLACKJACK 5 (33972)", "BLACKJACK 65: RUBY (33973)", "BLACKJACK 64: RUBY (33974)", "VIP BLACKJACK 1 (33975)", "VIP BLACKJACK 2 (33976)", "SPEED BLACKJACK 1 (33977)", "SPEED BLACKJACK 2 (33978)", "SPEED BLACKJACK 3 (33979)", "VIP BLACKJACK 3 (33980)", "SUPER 8 BACCARAT (33981)", "POWERUP ROULETTE (33982)", "BLACKJACK 70: RUBY (33983)", "CLASSIC SPEED BLACKJACK 9 (33984)", "CLASSIC SPEED BLACKJACK 10 (33985)", "CLASSIC SPEED BLACKJACK 8 (33986)", "CRAPS (33987)", "SPEED BACCARAT B (33988)", "NO COMMISSION SPEED BACCARAT C (33989)", "SPEED BACCARAT Q (33990)", "SPEED BACCARAT I (33991)", "CLASSIC SPEED BLACKJACK 4 (33992)", "SALON PRIV√Й BACCARAT B (33993)", "SPEED BACCARAT K (33994)", "SPEED BACCARAT R (33995)", "SPEED BACCARAT A (33996)", "NO COMMISSION BACCARAT (33998)", "BACCARAT SQUEEZE (33999)", "FAN TAN (34000)", "SPEED BACCARAT S (34002)", "CLASSIC SPEED BLACKJACK 6 (34004)", "BACCARAT CONTROL SQUEEZE (34005)", "SALON PRIV√Й BACCARAT E (34006)", "SPEED BACCARAT J (34007)", "CLASSIC SPEED BLACKJACK 1 (34012)", "LIGHTNING BACCARAT (34014)", "SPEED BACCARAT C (34015)", "CLASSIC SPEED BLACKJACK 3 (34019)", "SPEED BACCARAT D (34021)", "SPEED BACCARAT G (34024)", "SPEED BACCARAT P (34026)", "SPEED BACCARAT M (34028)", "NO COMMISSION SPEED BACCARAT B (34037)", "SPEED BACCARAT L (34038)", "CLASSIC SPEED BLACKJACK 2 (34042)", "SALON PRIV√Й BACCARAT C (34044)", "SPEED BACCARAT E (34046)", "SALON PRIV√Й BACCARAT D (34047)", "SPEED BACCARAT O (34049)", "NO COMMISSION SPEED BACCARAT A (34050)", "CLASSIC SPEED BLACKJACK 5 (34052)", "SUPER SIC BO (34053)", "SPEED BACCARAT N (34057)", "SPEED BACCARAT F (34058)", "SPEED BACCARAT H (34059)", "SALON PRIV√Й BACCARAT A (34064)", "BACCARAT C (34065)", "PRIV√Й LOUNGE BACCARAT 5 (34071)", "PRIV√Й LOUNGE BACCARAT 3 (34072)", "PRIV√Й LOUNGE BACCARAT 2 (34073)", "PRIV√Й LOUNGE BACCARAT 1 (34074)", "BLACKJACK 77: RUBY (34076)", "BLACKJACK 76: AZURE (34078)", "BLACKJACK 78: RUBY (34079)", "PRIV√Й LOUNGE BACCARAT 4 (34082)", "BLACKJACK 75: AZURE (34085)", "FORTUNE 6 BACCARAT (34087)", "BOOM CITY (34093)", "LUCKY 6 ROULETTE (34104)", "FIRST PERSON DRAGON TIGER (34114)", "POKER LOBBY (34135)", "TEXAS HOLDEM (34136)", "SALON PRIV√Й BACCARAT F (34137)", "ROULETTE LOBBY (34139)", "KLASIK BLACKJACK 4 (34140)", "SPEED BACCARAT V (34141)", "BLACKJACK VIP 27 (34142)", "BLACKJACK CLASICO EN ESPA√СOL 2 (34143)", "LIGHTNING BLACKJACK (34144)", "SPEED BACCARAT T (34145)", "BLACKJACK CLASICO EN ESPA√СOL 3 (34146)", "GAME SHOWS LOBBY (34147)", "SPEED VIP BLACKJACK I (34148)", "BLACKJACK CLASSIC 84 (34149)", "SPEED VIP BLACKJACK K (34150)", "BLACKJACK CLASICO EN ESPA√СOL 1 (34151)", "BLACKJACK VIP 25 (34152)", "BAC BO (34153)", "SPEED VIP BLACKJACK J (34154)", "FIRST PERSON LOBBY (34155)", "BLACKJACK VIP 26 (34157)", "CRAZY COIN FLIP (34158)", "FIRST PERSON BACCARAT (34159)", "MONOPOLY BIG BALLER (34160)", "BLACKJACK CL√БSSICO EM PORTUGU√КS 1 (34161)", "BLACKJACK CLASSIC 82 (34162)", "KLASIK BLACKJACK 3 (34163)", "BLACKJACK CLASSIC 83 (34164)", "SPEED BACCARAT W (34165)", "BLACKJACK CLASSIC 85 (34166)", "SALON PRIV√Й BLACKJACK G (34167)", "SPEED BACCARAT U (34168)", "BLACKJACK CLASSIC 86 (34170)", "KLASIK BLACKJACK (34171)", "DEAL OR NO DEAL (34172)", "BLACKJACK (34173)", "SPEED VIP BLACKJACK M (34174)", "SUPER ANDAR BAHAR (34175)", "BLACKJACK CL√БSSICO EM PORTUGU√КS 2 (34176)", "T√ЬRK√ЗE LIGHTNING RULET (34177)", "BUCHAREST INFINITE FREE BET BLACKJACK (34178)", "SPEED VIP BLACKJACK L (34179)", "SALON PRIV√Й BACCARAT G (34180)", "SPEED BACCARAT X (34181)", "TOP GAMES LOBBY (34182)", "BACCARAT LOBBY (34183)", "KLASIK BLACKJACK 2 (34184)", "XXXTREME LIGHTNING ROULETTE (34185)", "CLASSIC BLACKJACK 11 (34186)", "KOREAN DEALER SPEED BLACKJACK (34187)", "FREE BET BLACKJACK 2 (34188)", "SALON PRIV√Й BLACKJACK H (34189)", "KLASIK BLACKJACK 8 (34190)", "ITALIAN LIGHTNING ROULETTE (34191)", "CASINO HOLDEM ITALIA (34192)", "KOREAN DEALER LIGHTNING ROULETTE (34193)", "FREE BET BLACKJACK 3 (34194)", "CRAZY TIME A (34195)", "GOLDEN WEALTH BACCARAT (34196)", "KOREAN SPEED BACCARAT C (34197)", "DRAGONARA ROULETTE (34199)", "KLASIK BLACKJACK 9 (34200)", "SALON PRIV√Й BACCARAT H (34201)", "KOREAN SPEAKING SPEED BACCARAT 2 (34202)", "DEAD OR ALIVE SALOON (34203)", "SALON PRIV√Й BACCARAT J (34204)", "RULETA BOLA RAPIDA EN VIVO (34205)", "SALON PRIV√Й BLACKJACK I (34206)", "SPEED BACCARAT 3 (34207)", "KOREAN SPEED BACCARAT A (34208)", "SPEED BACCARAT Z (34209)", "SPEED BACCARAT 2 (34210)", "VIP BLACKJACK EM PORTUGU√КS (34211)", "FREE BET BLACKJACK 1 (34212)", "FREE BET BLACKJACK 5 (34213)", "DEAD OR ALIVE (34214)", "KOREAN DEALER BASEBALL STUDIO (34215)", "KLASIK BLACKJACK 5 (34216)", "ROLETA REL√ВMPAGO (34217)", "CLASSIC BLACKJACK 10 (34218)", "KLASIK SPEED BLACKJACK 1 (34219)", "VIP BLACKJACK EN ESPA√СOL (34220)", "FREE BET BLACKJACK 7 (34222)", "KLASIK BLACKJACK 12 (34223)", "KLASIK SPEED BLACKJACK 2 (34224)", "FREE BET BLACKJACK 6 (34225)", "EXTRA CHILLI EPIC SPINS (34226)", "FREE BET BLACKJACK 4 (34227)", "SALON PRIV√Й BLACKJACK J (34228)", "HINDI LIGHTNING ROULETTE (34229)", "KOREAN SPEAKING SPEED BACCARAT (34230)", "KOREAN SPEED BACCARAT B (34231)", "FREE BET BLACKJACK 1 (34232)", "SPEED BACCARAT 2 (34233)", "ROLETA AO VIVO (34234)", "DEAD OR ALIVE (34235)", "SALON PRIV√Й BACCARAT I (34236)", "VEGAS BALL BONANZA (34245)", "AUTO MEGA ROULETTE (34246)", "SPEED AUTO ROULETTE (34257)", "BLACKJACK CLASSIC 76 (34277)", "BLACKJACK CLASSIC 81 (34278)", "SPEED BLACKJACK I (34279)", "BLACKJACK VIP 18 (34280)", "SPEED BLACKJACK G (34281)", "BLACKJACK VIP 4 (34282)", "SPEED VIP BLACKJACK C (34283)", "CLASSIC SPEED BLACKJACK 25 (34284)", "BLACKJACK B (34285)", "SPEED BLACKJACK K (34286)", "BLACKJACK VIP 14 (34287)", "BLACKJACK VIP 15 (34288)", "SPEED BLACKJACK E (34289)", "SPEED BLACKJACK L (34290)", "BLACKJACK CLASSIC 77 (34291)", "BLACKJACK VIP 17 (34292)", "BLACKJACK CLASSIC 80 (34293)", "BLACKJACK VIP 19 (34294)", "BLACKJACK VIP 7 (34295)", "BLACKJACK CLASSIC 7 (34296)", "BLACKJACK VIP 8 (34297)", "CLASSIC SPEED BLACKJACK 7 (34298)", "BLACKJACK CLASSIC 75 (34299)", "BLACKJACK VIP 5 (34300)", "BLACKJACK VIP 11 (34301)", "CLASSIC SPEED BLACKJACK 20 (34302)", "BLACKJACK VIP 9 (34303)", "BLACKJACK CLASSIC 79 (34304)", "BLACKJACK CLASSIC 78 (34305)", "SPEED BLACKJACK J (34306)", "SPEED BLACKJACK H (34307)", "BLACKJACK VIP 10 (34308)", "BLACKJACK VIP 3 (34309)", "SPEED BLACKJACK D (34310)", "BLACKJACK VIP 16 (34311)", "BLACKJACK VIP 2 (34312)", "SPEED VIP BLACKJACK D (34313)", "BLACKJACK VIP 6 (34315)", "BLACKJACK VIP 12 (34316)", "SPEED VIP BLACKJACK F (34317)", "BLACKJACK C (34318)", "BLACKJACK VIP 13 (34319)", "SPEED VIP BLACKJACK G (34320)", "SPEED VIP BLACKJACK E (34321)", "SPEED BLACKJACK M (34322)", "SPEED VIP BLACKJACK B (34323)", "BLACKJACK PARTY (34324)", "BLACKJACK VIP 1 (34325)", "SPEED VIP BLACKJACK A (34326)", "SIC BO (34506)", "BLACKJACK 43: RUBY (34512)", "BLACKJACK 47: RUBY (34513)", "BLACKJACK 39: RUBY (34518)", "BLACKJACK 42: RUBY (34519)", "BLACKJACK 38: RUBY (34522)", "BLACKJACK 40: RUBY (34523)", "BLACKJACK 44: RUBY (34529)", "BLACKJACK 45: RUBY (34530)", "BLACKJACK 46: RUBY (34531)", "BLACKJACK 41: RUBY (34532)", "BLACKJACK 48: RUBY (34545)", "BLACKJACK 50: RUBY (34548)", "BLACKJACK 49: RUBY (34556)", "BLACKJACK 51: RUBY (34558)", "SPACEMAN (34588)", "INSTANT SUPER SIC BO (35068)", "VIDEO POKER (35073)", "FIRST PERSON XXXTREME LIGHTNING ROULETTE (35076)", "PUNTO BANCO (35159)", "FIRST PERSON TOP CARD (36829)", "TEEN PATTI (36830)", "FIRST PERSON VIDEO POKER (36832)", "FIRST PERSON PROSPERITY TREE BACCARAT (36834)", "FIRST PERSON DEAL OR NO DEAL (36835)", "PROSPERITY TREE BACCARAT (36837)", "PEEK BACCARAT (36840)", "FIRST PERSON LIGHTNING BLACKJACK (36841)", "STOCK MARKET (36906)", "SCRATCHY MINI (37628)", "SCRATCHY BIG (37631)", "SCRATCH! BRONZE (37632)", "SCRATCH! PLATINUM (37635)", "SCRATCH! SILVER (37636)", "KING TREASURE (37640)", "SCRATCH! GOLD (37657)", "EXPRESS 200 SCRATCH (37662)", "BLOCKS (37671)", "SCRATCHY (37673)", "QUEEN TREASURE (37677)", "LINES (37692)", "BACCARAT (37695)", "HI-LO (37874)", "PLINKO (37879)", "IT'S BANANAS! (37883)", "HAPPY SCRATCH (37885)", "LUCKY NUMBERS X8 (37892)", "CASH VAULT I (37893)", "PRINCE TREASURE (37895)", "GOLD RUSH (37896)", "LUCKY NUMBERS X20 (37897)", "LUCKY NUMBERS X12 (37898)", "LUCKY SCRATCH (37899)", "DREAM CAR SPEED (37900)", "DIAMOND RUSH (37901)", "LUCKY NUMBERS X16 (37903)", "SHAVE THE BEARD (37904)", "RUBY RUSH (37909)", "COLORS (37910)", "LUCKY SHOT (37912)", "DREAM CAR URBAN (37915)", "CUT THE GRASS (37918)", "CASH VAULT II (37919)", "DREAM CAR SUV (37921)", "TWENTY-ONE (37938)", "BOXES 97% (37939)", "BOXES 88% (37940)", "BOXES 92% (37941)", "MINES (37943)", "COINS 92% (37945)", "BOXES 96% (37947)", "BOXES 98% (37948)", "COINS 94% (37949)", "MINES 98% (37950)", "MINES 97% (37951)", "COINS 88% (37952)", "COINS  (37953)", "COINS 98% (37954)", "COINS 97% (37955)", "BOXES 94% (37956)", "RAT RICHES (37964)", "CHAOS CREW SCRATCH (37965)", "SNOW SCRATCHER (37966)", "GO PANDA (37974)", "SCRATCH'EM (37975)", "STACK'EM SCRATCH (37976)", "SPOOKY SCARY SCRATCHY (37978)", "MINES 94% (37980)", "THE PERFECT SCRATCH (37981)", "CASH POOL (37984)", "FROGS SCRATCH (37985)", "FOOTBALL SCRATCH (37986)", "CRAZY DONUTS (37989)", "KOI CASH (37990)", "EGGSTRA CASH (37991)", "BALLOONS (37992)", "DOUBLE SALARY: 1 YEAR (37993)", "SHAVE THE SHEEP (37996)", "CASH SCRATCH (37997)", "GOLD COINS (37999)", "LOVE IS ALL YOU NEED (38005)", "TIGER SCRATCH (38007)", "MINES 88% (38009)", "BREAK THE ICE (38011)", "MINES 92% (38012)", "BIG BASS CRASH (39102)", "SPACEMAN (39247)", "BLOCKS (39674)", "CASH COMPASS (39714)", "COINS (39784)", "COLORS (39833)", "TWENTY-ONE (39870)", "LINES (39920)", "PLINKO (39949)", "WHEEL (40012)", "MEGA SIC BAC (40574)"];
        // Получаем все строки таблицы
        const rows = document.querySelectorAll('tr');

        // Перебираем все строки
        rows.forEach(function (row) {
            // В каждой строке ищем ячейки с нужным классом, содержащие названия игр
            const cells = row.querySelectorAll('td');

            cells.forEach(function (cell) {
                const span = cell.querySelector('span.main_badge__u6DKH');
                if (span) {
                    // Проверяем, содержит ли текст внутри span одно из названий игр из массива
                    if (gameNames.some(gameName => span.textContent.includes(gameName))) {
                        // Если находим совпадение, выделяем всю строку цветом
                        row.style.backgroundColor = 'rgba(255, 165, 0, 0.2)'; // Оранжевый цвет с прозрачностью
                    }
                }
            });
        });
    }

    function parseDate(dateStr) {
        const parts = dateStr.match(/(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}):(\d{2}):(\d{2})/);
        return new Date(`${parts[2]}/${parts[1]}/${parts[3]} ${parts[4]}:${parts[5]}:${parts[6]}`);
    }

    function highlightRecentRegDates() {
        const currentDate = new Date();
        const lastMonthDate = new Date();
        lastMonthDate.setMonth(currentDate.getMonth() - 1);

        const spans = document.querySelectorAll('span.awsui_root_18wu0_1n73s_93');
        const mainMenu = document.querySelector('.awsui_with-paddings_14iqq_4079j_165');

        spans.forEach(function (span) {
            const content = span.textContent.trim();
            if (content.startsWith("Reg date:")) {
                const dateString = content.replace("Reg date:", "").trim();
                const regDate = parseDate(dateString);
                if (regDate > lastMonthDate && regDate <= currentDate) {
                    let parent = span.closest('.awsui_child-vertical-m_18582_66aol_216');
                    if (parent) {
                        parent.style.backgroundColor = 'rgba(255, 0, 0, 1)';
                        document.getElementsByClassName("awsui_description_2qdw9_12hrg_211 awsui_description-variant-h2_2qdw9_12hrg_224")[1].innerHTML = `<div style = "font-size:18px; color:red">!!!!!!!!!РЕГИСТРАЦИЯ МЕНЬШЕ МЕСЯЦА!!!!!!!!!</div></b>`;
                        document.getElementsByClassName("awsui_root_2rhyz_einbc_93 awsui_input-container_2rhyz_einbc_220")[2].innerHTML = `<div style = "font-size:18px; color:red">!!!!!!!!!!!!!!!!!!!!!!!!!!!  РЕГИСТРАЦИЯ МЕНЬШЕ МЕСЯЦА  !!!!!!!!!!!!!!!!!!!!!!!!!!!</div></b><div style = "font-size:18px; color:red">!!!!!!!!!!!!!!!!!!!  ПРОВЕРЯТЬ НА АБУЗ БОНУСОВ  !!!!!!!!!!!!!!!!!!!</div>`;
                    }
                }
            }
        });
    }

    let project;
    let numberOfTOS;
    let WithdrawalLimits;

    function extractNumber(str) {
        const matches = str.match(/(\d{1,3}(?:\s\d{3})*(?:,\d+)?)(?=\sRUB)/);

        if (matches) {
            const numberString = matches[1].replace(/\s/g, '').replace(',', '.');
            return parseFloat(numberString);
        }

        return null;
    }
     function GetGot() {
        const SelectorDark = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTM0IiBoZWlnaHQ9IjM2MiIgdmlld0JveD0iMCAwIDkzNCAzNjIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0yNS41NzUgMEgzMDAuN0wyMzIuNSAzNjEuMTVMMCAzMjcuODI1TDI1LjU3NSAwWiIgZmlsbD0iIzA0N0NGQyIvPgo8cGF0aCBkPSJNODMuMjM0OSAx';
        const SelectorLight = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5MzQiIGhlaWdodD0iMzYyIiB2aWV3Qm94PSIwIDAgOTM0IDM2MiIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0yNS41NzUgMEgzMDAuN0wyMzIuNSAzNjEuMTVMMCAzMjcuODI1TDI1LjU3NSAwWiIgZmlsbD0iIzA0N0NGQyIvPgo8cGF0aCBkPSJNODMuMjM0OSAxOTguOTcyQzk1LjMyNDkgMjAyLjM4MiAxMDguNzMyIDIwNC4wODcg';
        const Bounty = 'data:image/svg+xml;base64,PHN2ZyBpZD0ic3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zy';
        const FriendsDark = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABoMAAAKUCAYAAADPZEEvAAAACXBIWXMAAC4jAAAuIwF4pT92AADPFUlEQVR4nOzdeXxeVYH/8W9yc5Oma7qX7rSlLQWkgFCgtFBnUNz1joILKqKOqDjuPwEdQMV9d2YcHVdcRnHG676PhqYt0LJvhUKBsrQUWujetDk5';
        const FriendsLight = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABoMAAAKUCAYAAADPZEEvAAAACXBIWXMAAC4jAAAuIwF4pT92AAAGOWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmU';
        const TurboDark = 'data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgNTQwLjQ1IDEyMC4zIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6bm9uZTt9LmNscy0ye2NsaXAtcGF0aDp1cmwoI2NsaXAtcGF0aCk7fS5jbHMtM3tmaWxs';
        const TurboLight = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB2aWV3Qm94PSIwIDAgNTQwLjQ1IDEyMC4zIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6bm9uZTt9LmNscy0ye2NsaXAtcGF0aDp1cmwoI2NsaXAtcGF0aCk7fS5jbHMtM3tmaWxsOiMyNzJkM2E7fS5jbHMtMywuY2xzLTV7ZmlsbC1ydWxlOmV2ZW5vZGQ';
        const BrillxDark = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI3ODQiIGhlaWdodD0iMjM3IiB2aWV3Qm94PSIwIDAgNzg0IDIzNyIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik00NzcuNjY5IDIyOS43MDhDNDc1LjM4NCAyMjkuNzA4IDQ3My41MTUgMjI4Ljk3OCA0NzIuMDYyIDIyNy41MkM0NzAuNjA4IDIyNi4wNjIgNDY5Ljg4MSAyMjQuMTg2IDQ2OS44ODEgMjIxLjg5NVYxOC4yMzA4QzQ2O';
        const BrillxLight = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI3ODQiIGhlaWdodD0iMjM3IiB2aWV3Qm94PSIwIDAgNzg0IDIzNyIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik00NzcuNjY5IDIyOS43MDhDNDc1LjM4NCAyMjkuNzA4IDQ3My41MTUgMjI4Ljk3OCA0NzIuMDYyIDIyNy41MkM0NzAuNjA4IDIyNi4wNjIgNDY5Ljg4MSAyMjQuMTg2IDQ2OS44ODEgMjIxLjg5NVYxOC4yMzA4QzQ2OS44ODEgMTUuOTM4OSA0NzAuNjA4IDE0LjA2MzggNDc';

        // Получаем все img элементы
        const img = document.querySelectorAll('img');
        const divsWithImages = document.querySelectorAll('.awsui_actions_2qdw9_12hrg_162');

        // Перебираем все img элементы и проверяем их src атрибут
        divsWithImages.forEach(div => {
            const img = div.querySelector('img'); // Находим img внутри div
            if (img && img.src) {
                if (img.src.startsWith(SelectorDark) || img.src.startsWith(SelectorLight)) {
                    project = "selector";
                } else if (img.src.startsWith(BrillxDark) || img.src.startsWith(BrillxLight)) {
                    project = "brillx";
                } else if (img.src.startsWith(Bounty)) {
                    project = "bounty";
                } else if (img.src.startsWith(FriendsDark) || img.src.startsWith(FriendsLight)) {
                    project = "friends";
                } else if (img.src.startsWith(TurboDark) || img.src.startsWith(TurboLight)) {
                    project = "turbo";
                } else {
                    project = "else";
                }
            }
        });
    }

    function formatNumber(number) {
        let [integer, fraction] = number.toString().split('.');

        integer = integer.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');

        return fraction ? `${integer}.${fraction.slice(0, 2)}` : integer;
    }

    function getWithdrawalLimits(depositAmount) {
        if (project == "bounty" || project == "friends" || project == "else" || project == "selector" || project == "brillx" || project == "turbo") {
            if (depositAmount <= 5000) {
                numberOfTOS = "5.13.1";
                WithdrawalLimits = { day: 10000, week: 25000, month: 50000 };
            } else if (depositAmount <= 10000) {
                numberOfTOS = "5.13.2";
                WithdrawalLimits = { day: 35000, week: 60000, month: 100000 };
            } else if (depositAmount <= 25000) {
                numberOfTOS = "5.13.3";
                WithdrawalLimits = { day: 90000, week: 180000, month: 300000 };
            } else if (depositAmount <= 50000) {
                numberOfTOS = "5.13.4";
                WithdrawalLimits = { day: 150000, week: 300000, month: 500000 };
            } else if (depositAmount <= 100000) {
                numberOfTOS = "5.13.5";
                WithdrawalLimits = { day: 300000, week: 600000, month: 1000000 };
            } else if (depositAmount <= 250000) {
                numberOfTOS = "5.13.6";
                WithdrawalLimits = { day: 600000, week: 1200000, month: 2000000 };
            } else if (depositAmount <= 500000) {
                numberOfTOS = "5.13.7";
                WithdrawalLimits = { day: 1500000, week: 3000000, month: 5000000 };
            } else if (depositAmount <= 1000000) {
                numberOfTOS = "5.13.8";
                WithdrawalLimits = { day: 3000000, week: 6000000, month: 10000000 };
            } else {
                numberOfTOS = "5.13.9";
                WithdrawalLimits = { day: "Индивидуально", week: "Индивидуально", month: "Индивидуально" };
            };
        }
    }

    function checkTransactions() {
        GetGot();
        const transactionElements = document.querySelectorAll('div.main_item__qFGmJ');

        let transactions = {};
        transactionElements.forEach(el => {
            const textContent = el.textContent;
            if (textContent.includes('Лимит за')) {
            } else {
                if (textContent.includes('Deposits last 30 days')) {
                    transactions.deposits30Days = extractNumber(textContent);
                } else if (textContent.includes('Withdrawals last 30 days')) {
                    transactions.withdrawals30Days = extractNumber(textContent);
                } else if (textContent.includes('Deposits last 7 days')) {
                    transactions.deposits7Days = extractNumber(textContent);
                } else if (textContent.includes('Withdrawals last 7 days')) {
                    transactions.withdrawals7Days = extractNumber(textContent);
                } else if (textContent.includes('Deposits last 24 hours')) {
                    transactions.deposits24Hours = extractNumber(textContent);
                } else if (textContent.includes('Withdrawals last 24 hours')) {
                    transactions.withdrawals24Hours = extractNumber(textContent);
                }
            }
        });

        const limits = getWithdrawalLimits(transactions.deposits30Days);
        let remainingLimits;
        if (numberOfTOS == "5.13.9") {
            remainingLimits = {
                month: transactions.deposits30Days * 7.5,
                week: (transactions.deposits30Days * 7.5) / 2,
                day: (transactions.deposits30Days * 7.5) / 4
            };
        } else {
            remainingLimits = {
                day: Math.max(0, WithdrawalLimits.day - transactions.withdrawals24Hours),
                week: Math.max(0, WithdrawalLimits.week - transactions.withdrawals7Days),
                month: Math.max(0, WithdrawalLimits.month - transactions.withdrawals30Days)
            };
        }

        const spanElements = document.querySelectorAll('span.awsui_root_18wu0_1n73s_93');
        remainingLimits.month = parseFloat(remainingLimits.month);
        remainingLimits.week = parseFloat(remainingLimits.week);
        remainingLimits.day = parseFloat(remainingLimits.day);
        spanElements.forEach(span => {
            if (span.textContent.includes('Withdrawals last 30 days')) {
                if (span.innerHTML.includes('Лимит за 30 дней')) {

                } else {
                    span.innerHTML = `<b>Withdrawals last 30 days: Лимит за 30 дней - <div style="color:red">${formatNumber(remainingLimits.month)} RUB.</div>или Правило ${numberOfTOS}_month</b>`;
                    if (remainingLimits.month <= 0) {
                        span.innerHTML = `<b>Withdrawals last 30 days: Лимит за 30 дней - <div style="color:red">${formatNumber(remainingLimits.month)} RUB.</div>ОГРАНИЧЕНИЕ<div style = "font-size:30px; color:red">${numberOfTOS}_month</div></b>`;
                    }
                }

            } else if (span.textContent.includes('Withdrawals last 7 days')) {
                if (span.innerHTML.includes('Лимит за 7 дней')) {

                } else {
                    span.innerHTML = `<b>Withdrawals last 7 days: Лимит за 7 дней - <div style="color:red">${formatNumber(remainingLimits.week)} RUB.</div>или Правило ${numberOfTOS}_week</b>`;
                }
                if (remainingLimits.week <= 0) {
                    span.innerHTML = `<b>Withdrawals last 7 days: Лимит за 7 дней - <div style="color:red">${formatNumber(remainingLimits.week)} RUB.</div>ОГРАНИЧЕНИЕ<div style = "font-size:30px; color:red">${numberOfTOS}_week</div></b>`;
                }
            } else if (span.textContent.includes('Withdrawals last 24 hours')) {
                if (span.innerHTML.includes('Лимит за 24 часа')) {

                } else {
                    span.innerHTML = `<b>Withdrawals last 24 hours: Лимит за 24 часа - <div style="color:red">${formatNumber(remainingLimits.day)} RUB.</div>или Правило ${numberOfTOS}_day</b>`;
                }
                if (remainingLimits.day <= 0) {
                    span.innerHTML = `<b>Withdrawals last 24 hours: Лимит за 24 часа - <div style="color:red">${formatNumber(remainingLimits.day)} RUB.</div>ОГРАНИЧЕНИЕ<div style = "font-size:30px; color:red">${numberOfTOS}_day</div></b>`;
                }
            }
        });
    }

    window.addEventListener('load', highlightRowsWithfk);
    window.addEventListener('load', highlightRowsWithCard);
    window.addEventListener('load', highlightLargeAmounts);
    window.addEventListener('load', LiveInstantGames);
    window.addEventListener('load', highlightRecentRegDates);
    window.addEventListener('load', highlightAmountsBefore6000);

    setInterval(highlightRowsWithfk, 5000);
    setInterval(highlightRowsWithCard, 3000);
    setInterval(highlightLargeAmounts, 5000);
    setInterval(checkTransactions, 3000);
    setInterval(highlightAmountsBefore6000, 1000);
    setInterval(LiveInstantGames, 1000);
    setInterval(highlightRecentRegDates, 1000);
})();