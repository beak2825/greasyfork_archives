// ==UserScript==
// @name        PD_mod
// @run-at document-end
// @description own usage
// @grant       GM_addStyle
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM_deleteValue
// @grant       GM_listValues


// @version	0.9.1
// @include     https://r*.bloodwars.net/*
// @include 	https://r*.bloodwars.pl/*
// @include     https://beta.bloodwars.net/*

// @namespace https://greasyfork.org/users/14941
// @downloadURL https://update.greasyfork.org/scripts/533714/PD_mod.user.js
// @updateURL https://update.greasyfork.org/scripts/533714/PD_mod.meta.js
// ==/UserScript==

async function pdBwMod() {

    const retryLink = document.querySelector('a[href="?a=quest"]');

    if (!retryLink) {
        // Ustaw timer na 20 sekund
        setTimeout(() => {
            window.location.reload(); // Odśwież stronę
        }, 20000); // 20000 ms = 20 sekund
        return;
    } else {

        const arcaneArr = [
            '<option value="0">--- brak ---</option>',
            '<option value="1">Maska Adonisa</option>',
            '<option value="2">Maska Kaliguli</option>',
            '<option value="9">Majestat</option>',
            '<option value="3">Dziki Szał</option>',
            '<option value="4">Skóra Bestii</option>',
            '<option value="10">Cień bestii</option>',
            '<option value="5">Krew Życia</option>',
            '<option value="6">Kocie Ścieżki</option>',
            '<option value="11">Żar krwi</option>',
            '<option value="7">Cisza Krwi</option>',
            '<option value="8">Wyssanie mocy</option>',
            '<option value="12">Moc krwi</option>',
            '<option value="13">Nocny Łowca</option>',
            '<option value="14">Tchnienie Śmierci</option>',
            '<option value="15">Groza</option>',
        ];

        const item1xArr = [
            '<option value="0">--- brak ---</option>',
            '<option value="1" data-tier="1" title="SIŁA +3, SPOSTRZEGAWCZOŚĆ -2, ZWINNOŚĆ +2, WIEDZA -2">Krew wilka</option>',
            '<option value="2" data-tier="1" title="ODPORNOŚĆ +3, bazowe PKT ŻYCIA +7 %">Jabłko żelaznego drzewa</option>',
            '<option value="3" data-tier="1" title="obrażenia minimalne wszystkich broni +2, obrażenia maksymalne wszystkich broni +3, CHARYZMA -2">Płetwa rekina</option>',
            '<option value="4" data-tier="1" title="SIŁA -1, CHARYZMA +2, WYGLĄD -2, SPOSTRZEGAWCZOŚĆ +4, ZWINNOŚĆ -2, ODPORNOŚĆ -2, INTELIGENCJA +1, WIEDZA +1">Eliksir zmysłów</option>',
            '<option value="5" data-tier="1" title="ODPORNOŚĆ +4, ZWINNOŚĆ -1">Święcona woda</option>',
            '<option value="6" data-tier="1" title="WPŁYWY -2, regeneruje 15 PKT ŻYCIA po każdej rundzie walki">Łza feniksa</option>',
            '<option value="7" data-tier="1" title="SIŁA +2, CHARYZMA -2, WPŁYWY -2, ODPORNOŚĆ +2, SZCZĘŚCIE +4">Magiczna pieczęć</option>',
            '<option value="8" data-tier="1" title="obrażenia minimalne wszystkich broni -2, obrażenia maksymalne wszystkich broni -2, obrona postaci +14">Serce nietoperza</option>',
            '<option value="9" data-tier="1" title="CHARYZMA -6, WPŁYWY -5, WYGLĄD +6, SZCZĘŚCIE +7">Kwiat lotosu</option>',
            '<option value="10" data-tier="1" title="obrażenia maksymalne wszystkich broni +7, SPOSTRZEGAWCZOŚĆ -1, ZWINNOŚĆ -1, ODPORNOŚĆ -5">Jad Wielkopchły</option>',
            '<option value="11" data-tier="1" title="SPOSTRZEGAWCZOŚĆ -2, ZWINNOŚĆ -2, INTELIGENCJA +4, WIEDZA +6">Serum oświecenia</option>',
            '<option value="12" data-tier="1" title="SZCZĘŚCIE +10">Wywar z czarnego kota</option>',
            '<option value="13" data-tier="1" title="CHARYZMA -2, WPŁYWY +6">Węgiel</option>',
            '<option value="14" data-tier="1" title="CHARYZMA +2">Sierść kreta</option>',
            '<option value="15" data-tier="1" title="SPOSTRZEGAWCZOŚĆ -1, ZWINNOŚĆ -1, szansa trafienia krytycznego +4 %">Saletra</option>',
            '<option value="46" data-tier="1" title="ignoruje 3 % obrony przeciwnika, szansa trafienia krytycznego bronią palną -10 %">Sok z żuka</option>',
            '<option value="0">--- brak ---</option>',
            '<option value="16" data-tier="2" title="SIŁA +4, SPOSTRZEGAWCZOŚĆ -4, ZWINNOŚĆ +2, WIEDZA -3">Esencja młodości</option>',
            '<option value="17" data-tier="2" title="ZWINNOŚĆ -2, ODPORNOŚĆ +4, INTELIGENCJA -1, bazowe PKT ŻYCIA +10 %">Paznokieć trolla</option>',
            '<option value="18" data-tier="2" title="obrażenia minimalne wszystkich broni +4, obrażenia maksymalne wszystkich broni +4, CHARYZMA -4">Wilcza jagoda</option>',
            '<option value="19" data-tier="2" title="SIŁA -2, CHARYZMA +2, WYGLĄD -3, SPOSTRZEGAWCZOŚĆ +6, ZWINNOŚĆ -3, ODPORNOŚĆ -4, INTELIGENCJA +2, WIEDZA +2">Oko kota</option>',
            '<option value="20" data-tier="2" title="ODPORNOŚĆ +6, ZWINNOŚĆ -2">Absynt</option>',
            '<option value="21" data-tier="2" title="WPŁYWY -4, regeneruje 80 PKT ŻYCIA po każdej rundzie walki">Łuski salamandry</option>',
            '<option value="22" data-tier="2" title="SIŁA +2, CHARYZMA -3, WPŁYWY -3, ODPORNOŚĆ +2, SZCZĘŚCIE +7">Woda źródlana</option>',
            '<option value="23" data-tier="2" title="obrażenia minimalne wszystkich broni -5, obrażenia maksymalne wszystkich broni -5, obrona postaci +27">Kość męczennika</option>',
            '<option value="24" data-tier="2" title="CHARYZMA -10, WPŁYWY -8, WYGLĄD +8, SZCZĘŚCIE +10">Napój miłosny</option>',
            '<option value="25" data-tier="2" title="obrażenia maksymalne wszystkich broni +10, SIŁA -1, SPOSTRZEGAWCZOŚĆ -2, ZWINNOŚĆ -2, ODPORNOŚĆ -8">Jad skorpiona</option>',
            '<option value="26" data-tier="2" title="SPOSTRZEGAWCZOŚĆ -4, ZWINNOŚĆ -4, INTELIGENCJA +6, WIEDZA +6">Korzeń mandragory</option>',
            '<option value="27" data-tier="2" title="SZCZĘŚCIE +15">Gwiezdny pył</option>',
            '<option value="28" data-tier="2" title="CHARYZMA -4, WPŁYWY +8">Fiolka kwasu</option>',
            '<option value="29" data-tier="2" title="CHARYZMA +4">Siarka</option>',
            '<option value="30" data-tier="2" title="SPOSTRZEGAWCZOŚĆ -2, ZWINNOŚĆ -2, szansa trafienia krytycznego +7 %">Czarny diament</option>',
            '<option value="47" data-tier="2" title="ignoruje 6 % obrony przeciwnika, szansa trafienia krytycznego bronią palną -15 %">Oko topielca</option>',
            '<option value="0">--- brak ---</option>',
            '<option value="31" data-tier="3" title="SIŁA +6, SPOSTRZEGAWCZOŚĆ -2, ZWINNOŚĆ +4">Boska łza</option>',
            '<option value="32" data-tier="3" title="ODPORNOŚĆ +8, ZWINNOŚĆ -3, INTELIGENCJA -4, bazowe PKT ŻYCIA +14 %">Ząb ghula</option>',
            '<option value="33" data-tier="3" title="obrażenia minimalne wszystkich broni +5, obrażenia maksymalne wszystkich broni +7, CHARYZMA -8">Wywar z koralowca</option>',
            '<option value="34" data-tier="3" title="SPOSTRZEGAWCZOŚĆ +10, CHARYZMA +4, WIEDZA +4, SIŁA -4, ZWINNOŚĆ -6, WYGLĄD -6">Serce proroka</option>',
            '<option value="35" data-tier="3" title="ODPORNOŚĆ +14, ZWINNOŚĆ -4">Pazur bazyliszka</option>',
            '<option value="36" data-tier="3" title="WPŁYWY +4, ODPORNOŚĆ -4, regeneruje 140 PKT ŻYCIA po każdej rundzie walki">Łuski demona</option>',
            '<option value="37" data-tier="3" title="SIŁA +4, ODPORNOŚĆ +4, CHARYZMA -5, WPŁYWY -5, SZCZĘŚCIE +10">Skrzydła chrząszcza</option>',
            '<option value="38" data-tier="3" title="obrażenia minimalne wszystkich broni -6, obrażenia maksymalne wszystkich broni -6, obrona postaci +60">Maska gargulca</option>',
            '<option value="39" data-tier="3" title="WYGLĄD +14, SZCZĘŚCIE +14, CHARYZMA -10, WPŁYWY -6">Sok z modliszki</option>',
            '<option value="40" data-tier="3" title="obrażenia maksymalne wszystkich broni +17, SIŁA -2, ZWINNOŚĆ -2, ODPORNOŚĆ -6, SPOSTRZEGAWCZOŚĆ -2">Oddech smoka</option>',
            '<option value="41" data-tier="3" title="INTELIGENCJA +7, WIEDZA +8, SPOSTRZEGAWCZOŚĆ -2, ZWINNOŚĆ -2">Ząb wiedźmy</option>',
            '<option value="42" data-tier="3" title="SZCZĘŚCIE +20">Grimoire</option>',
            '<option value="43" data-tier="3" title="WPŁYWY +14, CHARYZMA -6">Czarna żółć</option>',
            '<option value="44" data-tier="3" title="CHARYZMA +10">Palec kowala</option>',
            '<option value="45" data-tier="3" title="ZWINNOŚĆ -3, SPOSTRZEGAWCZOŚĆ -3, szansa trafienia krytycznego +10 %">Kwiat bzu</option>',
            '<option value="48" data-tier="3" title="ignoruje 10 % obrony przeciwnika, szansa trafienia krytycznego bronią palną -25 %">Ogień z serca ziemi</option>',
            '<option value="0">--- brak ---</option>',
        ];

        const evoArr = [
            '<option value="0">--- brak ---</option>',
            '<option value="1">Skrzydła</option>',
            '<option value="2">Pancerz</option>',
            '<option value="3">Kły/Pazury/Kolce</option>',
            '<option value="4">Gruczoły jadowe</option>',
            '<option value="5">Wzmocnione ścięgna</option>',
            '<option value="8">Mutacja DNA</option>',
            '<option value="9">Oświecony</option>',
            '<option value="10">Szósty zmysł</option>',
            '<option value="11">Absorpcja</option>',
            '<option value="12">Harmonijny rozwój</option>',
            '<option value="21">Piętno demona</option>',
            '<option value="22">Wzmocnione mięśnie</option>',
        ];

        const expLocationArr = [
            '<option value="0">--- brak ---</option>',
            '<option value="1">Biała Wieża</option>',
            '<option value="2">Pustynia Rozpaczy</option>',
            '<option value="3">Pustynia Efermeh</option>',
            '<option value="4">Oaza Gorących Źródeł</option>',
            '<option value="5">Wielki Step</option>',
            '<option value="6">Złota Wieża</option>',
            '<option value="7">Palec Diabła</option>',
            '<option value="8">Pustynia Efermeh II</option>',
            '<option value="9">Kamienne Bagna</option>',
            '<option value="10">Pajęcza Przepaść</option>',
            '<option value="11">Wielki Step II</option>',
            '<option value="12">Góry Mądrości</option>',
            '<option value="13">Skorupia Pustynia</option>',
            '<option value="14">Góry Przemiany</option>',
            '<option value="15">Świątynia Śmierci</option>',
            '<option value="16">Pole Wielu Kości</option>',
            '<option value="17">Talerz Kronosa</option>',
            '<option value="21">Pole lawy</option>',
            '<option value="22">Kanały</option>',
            '<option value="23">Torturownica</option>',
            '<option value="24">Szlak zabójców</option>',
            '<option value="25">Tajemniczy artefakt</option>',
            '<option value="26">Robacze gniazdo</option>',
            '<option value="27">Wielka siekaczka</option>',
            '<option value="28">Cmentarz niewiernych</option>',
            '<option value="29">Szubieniczne drzewo</option>',
            '<option value="30">Jezioro topielców</option>',
            '<option value="31">Spalona biblioteka</option>',
            '<option value="32">Obelisk</option>',
            '<option value="33">Sala przemienionych</option>',
            '<option value="34">Ziemia pokryta wrzodami</option>',
            '<option value="35">Duma obrońców</option>',
            '<option value="36">Ostatni bastion</option>',
            '<option value="37">Portal</option>',
        ];

        const kwLocationArr = [
            '<option value="0">--- brak ---</option>',
            '<option value="1">Slumsy</option>',
            '<option value="2">Twierdza Horacego</option>',
            '<option value="3">Mała Brama</option>',
            '<option value="4">Kuźnie</option>',
            '<option value="5">Targowisko</option>',
            '<option value="6">Szpital</option>',
            '<option value="7">Skład paliwa</option>',
            '<option value="8">Cytadela</option>'
        ];

        const difficultArr = [
            '<option value="0">--- brak ---</option>',
            '<option value="1">1 gwiazdka</option>',
            '<option value="2">2 gwiazdki</option>',
            '<option value="3">3 gwiazdki</option>',
            '<option value="4">4 gwiazdki</option>',
            '<option value="5">5 gwiazdek</option>',
            '<option value="6">6 gwiazdek</option>',
            '<option value="7">7 gwiazdek</option>',
            '<option value="8">8 gwiazdek</option>',
            '<option value="9">9 gwiazdek</option>',
            '<option value="10">10 gwiazdek</option>',
            '<option value="11">11 gwiazdek</option>',
            '<option value="12">12 gwiazdek</option>',
        ];

        const optionListArr = [
            '<option value="0">--- brak ---</option>',
            '<option value="1">-- Ogólne --</option>',
            '<option value="2">- Wyprawki -</option>',
            '<option value="3">---- KW ----</option>',
            '<option value="4">--- Expy ---</option>',
            '<option value="5">--- 1vs1 ---</option>',
            '<option value="6">--- 3vs3 ---</option>',
            '<option value="7">--- PvsP ---</option>',
            '<option value="8">--- KvsK ---</option>',
            '<option value="9">- Polowanie </option>',
            '<option value="10">-- Podróż --</option>',
        ];

        const daysArr = [
            '<option value="1">Poniedziałek</option>',
            '<option value="2">Wtorek</option>',
            '<option value="3">Środa</option>',
            '<option value="4">Czwartek</option>',
            '<option value="5">Piątek</option>',
            '<option value="6">Sobota</option>',
            '<option value="0">Niedziela</option>',
        ];

        const taskRewardsArray = [
            '<option value="0">--- brak ---</option>',
            '<option value="1">Punkty Ewolucji</option>',
            '<option value="2">Runa</option>',
            '<option value="3">Wolne punkty ŁPC</option>',
            '<option value="4">Srebrne monety</option>',
            '<option value="5">Punkty Reputacji</option>',
            '<option value="6">Pieniądze</option>',
            '<option value="7">Krew</option>',
            '<option value="8">Ludzie</option>',
            '<option value="9">Punkty skarbu</option>',
            '<option value="10">Dodatki do podróży</option>',
        ];

        const colorsArr = [
            '<option value="0">--- brak ---</option>',
            '<option value="aqua">morski</option>',
            '<option value="black">czarny</option>',
            '<option value="blue">niebieski</option>',
            '<option value="fuchsia">fuksja</option>',
            '<option value="green">zielony</option>',
            '<option value="lime">limonkowy</option>',
            '<option value="maroon">bordowy</option>',
            '<option value="navy">granatowy</option>',
            '<option value="olive">oliwkowy</option>',
            '<option value="purple">fioletwy</option>',
            '<option value="red">czerwony</option>',
            '<option value="silver">srebrny</option>',
            '<option value="teal">turkusowy</option>',
            '<option value="white">biały</option>',
            '<option value="yellow">żółty</option>',
            '<option value="orange">pomarańczowy</option>',
        ];

        const souvenirArr = [
            '<option value="0">Krew</option>',
            '<option value="1">Ludzie</option>',
            '<option value="2">Złom</option>',
            '<option value="3">Reputacja</option>',
            '<option value="4">Pkty Ewolucji</option>',
            '<option value="5">Esencja</option>',
            '<option value="6">Pkty podróży</option>',
        ];

        const journeyLocationsArray = [
            '<option value="0">--- brak ---</option>',
            '<option value="1">Kanały</option>',
            '<option value="2">Szlak przemytników</option>',
            '<option value="3">Ochrona karawany</option>',
            '<option value="4">Szklana pustynia</option>',
            '<option value="5">Zaginiona oaza</option>',
            '<option value="6">Bagna przemienionych</option>',
            '<option value="7">Ukryte miasto</option>',
            '<option value="8">Starożytny grobowiec</option>',
            '<option value="9">Skarbiec</option>',
        ];

        const journeyRewardsArray = [
            '<option value="0">--- brak ---</option>',
            '<option value="1">Punkty Ewolucji</option>',
            '<option value="2">Runa</option>',
            '<option value="3">Wolne punkty ŁPC</option>',
            '<option value="4">Srebrne monety</option>',
            '<option value="5">Punkty Reputacji</option>',
            '<option value="6">Punkty doświadczenia</option>',
            '<option value="7">Pieniądze</option>',
            '<option value="8">Krew</option>',
            '<option value="9">Ludzie</option>',
        ];

        const journeyDifficultArray = [
            '<option value="0">--- brak ---</option>',
            '<option value="1">Poziom trudności 1</option>',
            '<option value="2">Poziom trudności 2</option>',
            '<option value="3">Poziom trudności 3</option>',
            '<option value="4">Poziom trudności 4</option>',
            '<option value="5">Poziom trudności 5</option>',
            '<option value="6">Poziom trudności 6</option>',
            '<option value="7">Poziom trudności 7</option>',
            '<option value="8">Poziom trudności 8</option>',
            '<option value="9">Poziom trudności 9</option>',
        ];

        function copySettings(btnName) {

            async function copySettingsByName(name, newSettingName) {
                name = name.slice(name.lastIndexOf(" ") + 1);
                const keys = GM_listValues();
                for (const key of keys) {
                    if (key.includes(`${bwCharacter.serverNumber} ${bwCharacter.nickName}`) && key.includes(name)) {
                        const value = await GM.getValue(key);
                        await GM.setValue(key.replace(name, newSettingName), value);
                    }
                }
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }

            const settingsMap = {
                "kwCopySettingsButton": ["exp", "kw"],
                "expCopySettingsButton": ["kw", "exp"],
                "arena1CopySettingsButton": ["pvp", "arena1"],
                "arena3CopySettingsButton": ["arena1", "arena3"],
                "pvpCopySettingsButton": ["arena1", "pvp"],
                "arenakCopySettingsButton": ["exp", "arenak"]
            };

            if (settingsMap[btnName]) {
                const [from, to] = settingsMap[btnName];
                copySettingsByName(from, to);
            }
        }

        function toggleAutoBwFunction(btnId, value) {
            const validIds = ["stopAutoBw", "startAutoBw"];
            if (validIds.includes(btnId)) {
                GM.setValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} autoBw`, value);
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            }
        }

        const stopAutoBwButton = createButtons('stopAutoBw', 'button', 'Stop Auto BW');
        document.querySelector('.menu-bottom').appendChild(stopAutoBwButton);

        const startAutoBwButton = createButtons('startAutoBw', 'button', 'Start Auto BW');
        document.querySelector('.menu-bottom').appendChild(startAutoBwButton);

        document.querySelector("body").addEventListener("click", function (e) {
            const btnId = e.target.id;
            if (btnId === "stopAutoBw") {
                toggleAutoBwFunction(btnId, false);
            } else if (btnId === "startAutoBw") {
                toggleAutoBwFunction(btnId, true);
            }
            cleanData(btnId);
            yesNoEvent(btnId);
            copySettings(btnId);
        });

        function insertAfter(referenceNode, newNode) {
            referenceNode?.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }

        async function updateYesNoDisplay(gmName) {
            const ynElement = document.getElementById(`${gmName}YesNo`);
            if (ynElement) {
                const value = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} ${gmName}`);
                ynElement.innerHTML = value ? "Tak" : "Nie";
            }
        }

        async function yesNoSet(elId) {
            const elIdTmp = elId.slice(0, -8);
            const ynElement = document.createElement("span");
            ynElement.setAttribute("id", `${elIdTmp}YesNo`);

            const existingElement = document.getElementById(elId);
            if (existingElement) {
                insertAfter(existingElement, ynElement);
                await updateYesNoDisplay(elIdTmp);
            }
        }

        async function yesNoEvent(inputId) {
            if (inputId.endsWith('Checkbox')) {
                const gmName = inputId.slice(0, -8);
                const isChecked = document.getElementById(inputId)?.checked ?? false;
                await GM.setValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} ${gmName}`, isChecked);
                await updateYesNoDisplay(gmName);
            }
        }

        function makeTable(containerId, data) {
            const container = document.getElementById(containerId);
            if (!container) return;

            // Sprawdź, czy kontener już zawiera tabelę
            let table = container.querySelector('table');
            if (!table) {
                // Jeśli tabela nie istnieje, utwórz nową
                table = document.createElement("table");
                container.appendChild(table);
            }

            const tbody = table.querySelector('tbody') || document.createElement("tbody");

            data.forEach(rowData => {
                const row = document.createElement("tr");
                rowData.forEach(cellData => {
                    const cell = document.createElement("td");
                    cell.append(cellData);
                    row.appendChild(cell);
                });
                tbody.appendChild(row);
            });

            if (!table.contains(tbody)) {
                table.appendChild(tbody);
            }
        }

        function createTextarea(textarea_id, textarea_value) {
            const txt_area = document.createElement("input");
            txt_area.id = textarea_id;
            txt_area.type = "text";
            txt_area.className = "inputbox";
            txt_area.style.height = "15px";
            txt_area.style.width = "80px";
            txt_area.value = textarea_value;
            return txt_area;
        }

        function createCheckboxs(checkbox_id, is_checked) {
            const chkbox = document.createElement("input");
            chkbox.id = checkbox_id;
            chkbox.type = "checkbox";
            chkbox.checked = is_checked;
            return chkbox;
        }

        function createButtons(bttn_id, bttn_class, bttn_text) {
            const bttn = document.createElement("input");
            bttn.id = bttn_id;
            bttn.type = "button";
            bttn.className = bttn_class;
            bttn.value = bttn_text;
            return bttn;
        }

        function createSelects(select_id) {
            const sel = document.createElement("select");
            sel.id = select_id;
            sel.style.textAlignLast = "center";
            sel.className = "combobox";
            return sel;
        }

        async function createDiv(index) {
            const existingDiv = document.getElementById(`divOpt${index}`);
            if (existingDiv) return existingDiv;

            const div = document.createElement("div");
            div.id = `divOpt${index}`;
            div.style.width = "auto";
            div.style.height = "auto";
            div.style.display = "none";
            return div;
        }

        async function showHideDiv(selName, index) {
            const divOpt = document.getElementById(`divOpt${index}`);
            if (!divOpt) return;

            const key = `${bwCharacter.serverNumber} ${bwCharacter.nickName} ${selName.slice(0, -6)}`;

            const visibleDiv = await GM.getValue(key) ?? 0;
            if (Number(visibleDiv) === parseInt(index)) divOpt.style.display = "";
        }

        async function getStoredOptionIndex(selName) {
            const key = `${bwCharacter.serverNumber} ${bwCharacter.nickName} ${selName.slice(0, -6)}`;
            const storedValue = await GM.getValue(key);
            return storedValue ?? 0;
        }

        async function populateSelect(selName, selArr) {
            const selectElement = document.getElementById(selName);
            if (!selectElement) return;

            const selValueName = selName.slice(0, -6);
            const selectedIndex = await getStoredOptionIndex(selName);

            if (selArr) {
                selArr.forEach(htmlString => {
                    selectElement.insertAdjacentHTML("beforeend", htmlString);
                });
            }

            const selectOptions = selectElement.getElementsByTagName("option");

            if (selName.includes("options")) {
                selectElement[selectedIndex].setAttribute("selected", "selected");
                await showHideDiv(selName, selectedIndex);
            }


            if (selName.includes("Color")) {
                const color = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} ${selValueName}`);
                selectElement.style.color = color;
                Array.from(selectOptions).forEach(option => {
                    option.style.color = option.value;
                });
            }

            if (selName.includes("Member") || (selName.includes("Join") && !selName.includes("Day"))) {
                Array.from(selectOptions).forEach(option => {
                    option.value = option.innerText === '---- brak ----' ? 0 : option.innerText;
                });
            }

            if (selName === "equip") {
                const equipValue = bwCharacter.equipedEq;
                const selectedOption = Array.from(selectOptions).find(option => option.value === equipValue);

                if (selectedOption) {
                    const key = selName.includes("Arkana") || selName.includes("Evo")
                        ? `${bwCharacter.serverNumber} ${bwCharacter.nickName} ${selValueName}Value`
                        : `${bwCharacter.serverNumber} ${bwCharacter.nickName} ${selValueName}`;
                    GM.setValue(key, selectedOption.value);
                    selectedOption.setAttribute("selected", "selected");
                }
            }

            Array.from(selectOptions).forEach(async option => {
                const storedOptionValue = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} ${selValueName}`);
                if (option.value === storedOptionValue) {
                    option.setAttribute("selected", "selected");
                }
            });

            selectElement.addEventListener("change", async function (e) {
                if (e.target.id === selName) {
                    if (selName.includes("options")) {
                        const prevDivId = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} ${selValueName}`) ?? 0;
                        document.getElementById(`divOpt${prevDivId}`).style.display = "none";
                        document.getElementById(`divOpt${this.value}`).style.display = "";
                    }

                    if (selName.includes("Color")) {
                        selectElement.style.color = this.value;
                    }

                    if (selName === "equip") {
                        await equipEq(this.value);
                    }

                    GM.setValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} ${selValueName}`, this.value);
                }
            });

        }

        function getNumericContent(htmlContent) {
            return parseInt(htmlContent.textContent.replace(/[^0-9\.]/g, "").replace(/\s/g, ""));
        }

        function insertHTMLContent(element, content) {
            element.insertAdjacentHTML("beforeend", content);
        }

        async function createMembersSettings(name, div, members) {
            if (parseInt(members) > 0) {

                const membersSettings = [];

                for (let index = 0; index < members; index++) {
                    const selectId = `${name}Member${index}Select`;
                    const membersSelect = createSelects(selectId);

                    membersSettings.push([
                        `Nick nr ${index + 1}: `,
                        membersSelect
                    ]);
                }

                if (membersSettings.length > 0) {
                    makeTable(div, membersSettings);
                }

                const membersList = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} members`);
                if (membersList && membersList.length > 0) {
                    for (let index = 0; index < members; index++) {
                        populateSelect(`${name}Member${index}Select`, membersList);
                    }
                }
            }
        }

        async function createEvoSettings(name, div) {
            if (!div) return;

            const evolutionSettings = [];
            const evoLength = evoArr.length - 1;

            const values = await Promise.all(
                Array.from({ length: evoLength }, (_, index) => [
                    GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} ${name}Evo${index + 1}Value`, ""),
                    GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} ${name}Evo${index + 1}Max`)
                ]).flat()
            );

            for (let index = 0; index < evoLength; index++) {
                const selectId = `${name}Evo${index + 1}Select`;
                const TextareaId = `${name}Evo${index + 1}Textarea`;
                const checkboxId = `${name}Evo${index + 1}MaxCheckbox`;

                const TextareaValue = values[index * 2];
                const checkboxValue = values[index * 2 + 1];

                const evoSelect = createSelects(selectId);
                const evoTextarea = createTextarea(TextareaId, TextareaValue);
                const evoCheckbox = createCheckboxs(checkboxId, checkboxValue);

                evolutionSettings.push([
                    `Evo ${index + 1}: `,
                    evoSelect,
                    " ilość: ",
                    evoTextarea,
                    " ustaw max ",
                    evoCheckbox,
                ]);
            }

            makeTable(div, evolutionSettings);

            for (let index = 0; index < evoLength; index++) {
                populateSelect(`${name}Evo${index + 1}Select`, evoArr);
                handleTextareaInput(`${name}Evo${index + 1}Textarea`, "number");
                yesNoSet(`${name}Evo${index + 1}MaxCheckbox`);
            }
        }

        function handleTextareaInput(textareaName, type) {
            const textarea = document.getElementById(textareaName);
            if (!textarea) return;

            if (type === "link") {
                textarea.placeholder = "?a=";
            } else if (type === "number") {
                textarea.placeholder = "Tylko cyfry";
            }

            textarea.addEventListener("input", function () {
                const value = textarea.value;

                if (type === "link") {
                    if (value.includes("?a=")) {
                        GM.setValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} ${textareaName}`, value);
                    } else {
                        textarea.placeholder = "Wpisz końcówkę odnośnika z linku!";
                    }
                } else if (type === "number") {
                    const containsNonNumeric = /[^\d]/.test(value);
                    if (containsNonNumeric) {
                        textarea.placeholder = "Wpisz tylko cyfry!";
                    } else {
                        const key = textareaName.includes('Arkana') || textareaName.includes('Evo')
                            ? `${bwCharacter.serverNumber} ${bwCharacter.nickName} ${textareaName.slice(0, -8)}Value`
                            : `${bwCharacter.serverNumber} ${bwCharacter.nickName} ${textareaName.slice(0, -8)}`;
                        GM.setValue(key, value);
                    }
                }
            });
        }

        const checkPrem = () => {
            let prem = playerResources.getAll().premiumDays;
            return prem > 0 ? true : false;
        };

        //Wykrzyknik to true
        const activityCheck = (attr) => {
            return document.querySelectorAll('.menu-content li.menu a[href="' + attr + '"]')[0]?.querySelectorAll('span')[1]?.textContent.indexOf("!") > 0 ? true : false;
        };

        const bwCharacter = {
            serverNumber: window.location.hostname.split(".")[0],
            linkApi: window.location.search,
            nickName: document.getElementsByClassName("me")[0]?.innerText,
            activePremium: false,//checkPrem(),
            journey: activityCheck("?a=journey"),
            task: activityCheck("?a=tasks"),
            hunt: activityCheck("?a=hunt"),
            realmType: document.getElementsByClassName("gameStats")[0]?.getElementsByTagName("b")[0]?.textContent.split(" ")[0],
            equipedEq: parseInt(document.querySelectorAll('.menu-content li.menu a[href="?a=equip"]')[0]?.textContent.replace(/[^\d\.]*/g, "")),
            money: playerResources.getAll().cash,
            junk: playerResources.getAll().junk,
            minutes:parseInt(new Date().getMinutes()),
            hour: parseInt(new Date().getHours()),
            day: parseInt(new Date().getDay()),
            attacks: parseInt(document.querySelectorAll('.menu-content li.menu a[href="?a=ambush"]')[0]?.textContent.split('/')[0].replace(/[^\d\.]*/g, "")) ?? 0,
            quest: parseInt(document.querySelectorAll('.menu-content li.menu a[href="?a=quest"]')[0]?.textContent.replace(/[^\d\.]*/g, "")) ?? 0,
        };

        (function optionsList() {
            if (bwCharacter.linkApi === "?a=settings") {
                const contentMid = document.getElementById("content-mid");
                if (!contentMid) return;

                const selectElement = createSelects("optionsSelect");
                selectElement.className = "combobox";
                selectElement.style.textAlignLast = "center";
                selectElement.style.marginLeft = "40%";
                selectElement.style.marginRight = "50%";
                contentMid.appendChild(selectElement);

                populateSelect("optionsSelect", optionListArr);

                optionListArr.forEach(async (_, index) => {
                    const divOpt = await createDiv(index);
                    contentMid.appendChild(divOpt);
                });
            }
        })();

        function cleanData(btnId) {
            if (btnId === "cleanScript") {
                const keys = GM_listValues();
                for (let i = 0, key = null; (key = keys[i]); i++) {
                    if (key.indexOf(`${bwCharacter.serverNumber} ${bwCharacter.nickName}`) >= 0) {
                        GM_deleteValue(key);
                    } else {
                        continue;
                    }
                }
                location.reload();
            }
        }



        (async function generalSettings() {

            const autoBwCheckbox = createCheckboxs("autoBwCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} autoBw`));
            const cleanScriptButton = createButtons("cleanScriptButton", "armoryInvertSelectionTabButton button", "Resetuj skrypt dla " + bwCharacter.serverNumber);
            const epikColorSelect = createSelects("epikColorSelect", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} epikColor`));
            const ldsColorSelect = createSelects("ldsColorSelect", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} ldsColor`));
            const ldbColorSelect = createSelects("ldbColorSelect", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} ldbColor`));
            const zkColorCheckbox = createCheckboxs("zkColorCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} zkColor`));
            const item1xCheckbox = createCheckboxs("item1xCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} item1x`));
            const alianceCheckbox = createCheckboxs("alianceCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} aliance`));
            const fastEquipCheckbox = createCheckboxs("fastEquipCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} fastEquip`));
            const junkCostCheckbox = createCheckboxs("junkCostCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} junkCost`));
            const crapSellTextarea = createTextarea("crapSellTextarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} crapSell`, ""));
            const lvlsLeftCheckbox = createCheckboxs("lvlsLeftCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} lvlsLeft`));
            const alt = [];
            for (let index = 0; index < 10; index++) {
                alt[index] = createTextarea("alt" + index, await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} alt${index}`, ""));
            }
            const autoReloadTextarea = createTextarea("autoReloadTextarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} autoReload`, ""));
            const defendEqSelect = createSelects("defendEqSelect");
            const taskRewardTakeCheckbox = createCheckboxs("taskRewardTakeCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} taskRewardTake`));
            const taskReward1Select = createSelects("taskReward1Select");
            const taskReward2Select = createSelects("taskReward2Select");
            const taskReward3Select = createSelects("taskReward3Select");
            // const summaryCheckbox = createCheckboxs("summaryCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} summary`));

            const generalSettingsArr = [
                ["-------------------------------------"],
                ["Automatyczne BW włącza lub wyłącza cały skrypt", autoBwCheckbox],
                ["-------------------------------------"],
                ["W przypadku problemów wyczyść ustawienia skryptu i sprawdź ponownie", "", cleanScriptButton],
                ["-------------------------------------"],
                ["Kolorowanie epików", '', epikColorSelect],
                ["Kolorowanie legendarny doskonały", '', ldsColorSelect],
                ["Kolorowanie legendarny dobry", '', ldbColorSelect],
                ["Kolorowanie itemów i/w zk", zkColorCheckbox],
                ["-------------------------------------"],
                ["Wyświetlanie od razu informacji o jednorazach", item1xCheckbox],
                ["Ukrywanie opisu klanów", alianceCheckbox],
                ["Szybka zbrojownia", fastEquipCheckbox],
                ["Wyświetlanie kosztu jednostkowego złomu w aukcjach", junkCostCheckbox],
                ["Czyszczenie ostatniej półki (bez epików) podaj kwotę powyżej jakiej itemy NIE będą sprzedawane", crapSellTextarea],
                ["-------------------------------------"],
                ["Ctrl + strzałki do przełączania wiadomości i stron rankingu oraz wklej końcówkę linku dla własnych skrótów (np. '?/a=quest')"],
                ["Alt + 0 dla ", alt[0]],
                ["Alt + 1 dla ", alt[1]],
                ["Alt + 2 dla ", alt[2]],
                ["Alt + 3 dla ", alt[3]],
                ["Alt + 4 dla ", alt[4]],
                ["Alt + 5 dla ", alt[5]],
                ["Alt + 6 dla ", alt[6]],
                ["Alt + 7 dla ", alt[7]],
                ["Alt + 8 dla ", alt[8]],
                ["Alt + 9 dla ", alt[9]],
                ["-------------------------------------"],
                ["Zliczanie pozostalych wolnych miejsc w poziomach dla KW i Exp", lvlsLeftCheckbox],
                ["Auto odświeżanie strony (wskazany czas od ostatniego odświeżania) odświeżanie co ", autoReloadTextarea, " minut"],
                ["-------------------------------------"],
                ["Zestaw bezczynności - na obrony", defendEqSelect],
                ["-------------------------------------"],
                ["Szukanie wybranych nagród z zadań", taskReward1Select, taskReward2Select, taskReward3Select],
                ["Automatyczne odbieranie nagród z zadań dziennych oraz zmiana niechcianych nagród (najpierw ustaw nagrody dopiero zaznacz)", taskRewardTakeCheckbox],
                ["-------------------------------------"],
                ["Podsumowanie walk i aren", 'in progress'],
                ["-------------------------------------"]

            ];
            if (document.getElementById("divOpt1")) {
                setTimeout(async function () {
                    makeTable("divOpt1", generalSettingsArr);
                    yesNoSet("autoBwCheckbox");

                    populateSelect("epikColorSelect", colorsArr);
                    populateSelect("ldsColorSelect", colorsArr);
                    populateSelect("ldbColorSelect", colorsArr);

                    yesNoSet("zkColorCheckbox");
                    yesNoSet("item1xCheckbox");
                    yesNoSet("alianceCheckbox");
                    yesNoSet("fastEquipCheckbox");
                    yesNoSet("junkCostCheckbox");
                    handleTextareaInput("crapSellTextarea", "number");
                    yesNoSet("lvlsLeftCheckbox");

                    for (let index1 = 0; index1 < 10; index1++) {
                        handleTextareaInput("alt" + index1, "link");
                    }

                    handleTextareaInput("autoReloadTextarea", "number");
                    populateSelect("defendEqSelect", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} equipSets`));
                    yesNoSet("taskRewardTakeCheckbox");
                    populateSelect("taskReward1Select", taskRewardsArray);
                    populateSelect("taskReward2Select", taskRewardsArray);
                    populateSelect("taskReward3Select", taskRewardsArray);
                    // yesNoSet("summaryCheckbox");
                }, 10);
            }
        })();

        (async function autoQuestSettings() {

            const questTypeArray = [
                '<option value="0">Okolice miasta</option>',
                '<option value="1">Daleka wyprawa</option>',
                '<option value="2">Pielgrzymka w nieznane</option>',
            ];

            const autoQuestCheckbox = createCheckboxs("questAutoCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} questAuto`));
            const questTypeSelect = createSelects("questTypeSelect");
            const questEqSelect = createSelects("questEqSelect");
            const questItem1xSelect = createSelects("questItem1xSelect");
            const questArkana1Select = createSelects("questArkana1Select");
            const questArkana2Select = createSelects("questArkana2Select");
            const questArkana3Select = createSelects("questArkana3Select");
            const questArkana1Textarea = createTextarea("questArkana1Textarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} questArkana1Value`, ""));
            const questArkana2Textarea = createTextarea("questArkana2Textarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} questArkana2Value`, ""));
            const questArkana3Textarea = createTextarea("questArkana3Textarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} questArkana3Value`, ""));
            const questArkana1MaxCheckbox = createCheckboxs("questArkana1MaxCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} questArkana1Max`));
            const questArkana2MaxCheckbox = createCheckboxs("questArkana2MaxCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} questArkana2Max`));
            const questArkana3MaxCheckbox = createCheckboxs("questArkana3MaxCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} questArkana3Max`));
            const questKarawanaCheckbox = createCheckboxs("questKarawanaCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} questKarawana`));
            const questSettings = [
                ["Auto wypki", autoQuestCheckbox],
                ["Rodzaj wypraw: ", questTypeSelect],
                ["Zestaw na wyprawki nr: ", questEqSelect],
                ["Jednoraz na wyprawy", questItem1xSelect],
                ["Arkana 1: ", questArkana1Select, " ilość: ", questArkana1Textarea, " ustaw max ", questArkana1MaxCheckbox],
                ["Arkana 2: ", questArkana2Select, " ilość: ", questArkana2Textarea, " ustaw max ", questArkana2MaxCheckbox],
                ["Arkana 3: ", questArkana3Select, " ilość: ", questArkana3Textarea, " ustaw max ", questArkana3MaxCheckbox],
                ["Karawana: ", questKarawanaCheckbox]
            ];
            setTimeout(async function () {
                if (document.getElementById("divOpt2")) {
                    makeTable("divOpt2", questSettings);
                    yesNoSet("questAutoCheckbox");
                    populateSelect("questTypeSelect", questTypeArray);
                    populateSelect("questEqSelect", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} equipSets`));
                    populateSelect("questItem1xSelect", item1xArr);
                    populateSelect("questArkana1Select", arcaneArr);
                    populateSelect("questArkana2Select", arcaneArr);
                    populateSelect("questArkana3Select", arcaneArr);
                    handleTextareaInput("questArkana1Textarea", "number");
                    handleTextareaInput("questArkana2Textarea", "number");
                    handleTextareaInput("questArkana3Textarea", "number");
                    yesNoSet("questArkana1MaxCheckbox");
                    yesNoSet("questArkana2MaxCheckbox");
                    yesNoSet("questArkana3MaxCheckbox");
                    yesNoSet("questKarawanaCheckbox");
                }
            }, 50);
        })();

        (async function kwSettings() {
            const kwCopySettingsButton = createButtons("kwCopySettingsButton", "armoryInvertSelectionTabButton button", "Kopiuj z Expedycji");

            const kwAutoStartCheckbox = createCheckboxs("kwAutoStartCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} kwAutoStart`));
            const kwStartEqSelect = createSelects("kwStartEqSelect", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} kwStartEq`));
            const kwItem1xSelect = createSelects("kwItem1xSelect", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} kwItem1x`));
            const kwStartHourTextarea = createTextarea("kwStartHourTextarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} kwStartHour`, ""));
            const kwStartMinTextarea = createTextarea("kwStartMinTextarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} kwStartMin`, ""));
            const kwThursdayStartCheckbox = createCheckboxs("kwThursdayStartCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} kwThursdayStart`));
            const kwLocationListSelect = createSelects("kwLocationListSelect", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} kwLocationList`));
            const kwDifficultSelect = createSelects("kwDifficultSelect", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} kwDifficult`));

            const kwInviteTextarea = createTextarea("kwInviteTextarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} kwInvite`, ""));
            const kwMembersMaxCheckbox = createCheckboxs("kwMembersMaxCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} kwMembersMax`));

            const kwEqSelect = createSelects("kwEqSelect", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} kwEq`));
            const kwEndHourTextarea = createTextarea("kwEndHourTextarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} kwEndHour`, ""));
            const kwEndMinTextarea = createTextarea("kwEndMinTextarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} kwEndMin`, ""));

            const kwJoinSelect = createSelects("kwJoinSelect", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} kwJoin`));
            const kwThursdayJoinCheckbox = createCheckboxs("kwThursdayJoinCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} kwThursdayJoin`));
            const kwJoinHourTextarea = createTextarea("kwJoinHourTextarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} kwJoinHour`, ""));
            const kwJoinMinTextarea = createTextarea("kwJoinMinTextarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} kwJoinMin`, ""));

            const kwJoinSamSelect = createSelects("kwJoinSamSelect", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} kwJoinSamSelect`));
            const kwThursdayJoinSamCheckbox = createCheckboxs("kwThursdayJoinCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} kwThursdayJoinSam`));
            const kwJoinSamHourTextarea = createTextarea("kwJoinHourTextarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} kwJoinSamHour`, ""));
            const kwJoinSamMinTextarea = createTextarea("kwJoinMinTextarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} kwJoinSamMin`, ""));

            const kwArkana1Select = createSelects("kwArkana1Select", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} kwArkana1`));
            const kwArkana2Select = createSelects("kwArkana2Select", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} kwArkana2`));
            const kwArkana3Select = createSelects("kwArkana3Select", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} kwArkana3`));
            const kwArkana4Select = createSelects("kwArkana4Select", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} kwArkana4`));
            const kwArkana5Select = createSelects("kwArkana5Select", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} kwArkana5`));
            const kwArkana1Textarea = createTextarea("kwArkana1Textarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} kwArkana1Value`, ""));
            const kwArkana2Textarea = createTextarea("kwArkana2Textarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} kwArkana2Value`, ""));
            const kwArkana3Textarea = createTextarea("kwArkana3Textarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} kwArkana3Value`, ""));
            const kwArkana4Textarea = createTextarea("kwArkana4Textarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} kwArkana4Value`, ""));
            const kwArkana5Textarea = createTextarea("kwArkana5Textarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} kwArkana5Value`, ""));
            const kwArkana1MaxCheckbox = createCheckboxs("kwArkana1MaxCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} kwArkana1Max`));
            const kwArkana2MaxCheckbox = createCheckboxs("kwArkana2MaxCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} kwArkana2Max`));
            const kwArkana3MaxCheckbox = createCheckboxs("kwArkana3MaxCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} kwArkana3Max`));
            const kwArkana4MaxCheckbox = createCheckboxs("kwArkana4MaxCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} kwArkana4Max`));
            const kwArkana5MaxCheckbox = createCheckboxs("kwArkana5MaxCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} kwArkana5Max`));

            let kwSettings = [
                ["-------------------------------------"],
                [`Skopiuj ustawienia z Ekspedycji`, kwCopySettingsButton],
                ["-------------------------------------"],
                [`Automatyczne KW`, kwAutoStartCheckbox],
                ["-------------------------------------"],
                [`Zestaw do rozpoczęcia KW (krew, twardy itd)`, kwStartEqSelect],
                [`Wybierz 1x do rozpoczęcia KW`, kwItem1xSelect],
                ["-------------------------------------"],
                [`O której godzinie rozpocząć KW (h/m) {godziny 0-23}`, kwStartHourTextarea, kwStartMinTextarea],
                [`W czwartki zakłada KW po 20:35 żeby kończyło się po 0:00`, kwThursdayStartCheckbox],
                ["-------------------------------------"],
                [`Wybierz lokacje do rozpoczęcia KW`, kwLocationListSelect],
                [`Poziom trudności`, kwDifficultSelect, `jeśli nie ustawisz to pominie`],
                ["-------------------------------------"],
                [`Wybierz ile osób zaprosić do KW`, kwInviteTextarea, "zaproś wszystkich", kwMembersMaxCheckbox],
                [`Zestaw zakładany na KW`, kwEqSelect],
                ["-------------------------------------"],
                [`O której godzinie zakończyć KW (h/m)`, kwEndHourTextarea, kwEndMinTextarea],
                ["-------------------------------------"],
                [`Wybierz do kogo dołączyć do KW`, kwJoinSelect],
                [`W czwartki dołącza do KW po 20:35`, kwThursdayJoinCheckbox],
                [`O której godzinie dołączyć do KW`, kwJoinHourTextarea, kwJoinMinTextarea],
                ["-------------------------------------"],
                [`Wybierz do kogo dołączyć do expy jako samarytanin`, kwJoinSamSelect],
                [`W czwartki dołącza jako samarytanin do KW po 20:35`, kwThursdayJoinSamCheckbox],
                [`O której godzinie dołączyć do KW jako samarytanin`, kwJoinSamHourTextarea, kwJoinSamMinTextarea],
                ["-------------------------------------"],
                ["Arkana używane do założenia i dołączenia"],
                [`Arkana nr 1`, kwArkana1Select, kwArkana1Textarea, kwArkana1MaxCheckbox],
                [`Arkana nr 2`, kwArkana2Select, kwArkana2Textarea, kwArkana2MaxCheckbox],
                [`Arkana nr 3`, kwArkana3Select, kwArkana3Textarea, kwArkana3MaxCheckbox],
                [`Arkana nr 4`, kwArkana4Select, kwArkana4Textarea, kwArkana4MaxCheckbox],
                [`Arkana nr 5`, kwArkana5Select, kwArkana5Textarea, kwArkana5MaxCheckbox]
            ];
            setTimeout(async function () {
                if (document.getElementById("divOpt3")) {
                    makeTable("divOpt3", kwSettings);
                    yesNoSet("kwAutoStartCheckbox");
                    populateSelect("kwStartEqSelect", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} equipSets`));
                    populateSelect("kwItem1xSelect", item1xArr);
                    handleTextareaInput("kwStartHourTextarea", "number");
                    handleTextareaInput("kwStartMinTextarea", "number");
                    yesNoSet("kwThursdayStartCheckbox");
                    populateSelect("kwLocationListSelect", kwLocationArr);
                    populateSelect("kwDifficultSelect", difficultArr);
                    handleTextareaInput("kwInviteTextarea", "number");
                    yesNoSet("kwMembersMaxCheckbox");
                    const initMembers = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} kwInvite`) ?? 0;
                    createMembersSettings("kw", "divOpt3", initMembers);

                    handleTextareaInput("kwJoinHourTextarea", "number");
                    handleTextareaInput("kwJoinMinTextarea", "number");

                    populateSelect("kwEqSelect", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} equipSets`));
                    handleTextareaInput("kwEndTimerTextarea", "number");
                    handleTextareaInput("kwEndMinTextarea", "number");
                    handleTextareaInput("kwEndHourTextarea", "number");

                    yesNoSet("kwThursdayJoinCheckbox");
                    populateSelect("kwJoinSelect", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} members`));
                    populateSelect("kwJoinSamSelect", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} members`));

                    populateSelect("kwArkana1Select", arcaneArr);
                    populateSelect("kwArkana2Select", arcaneArr);
                    populateSelect("kwArkana3Select", arcaneArr);
                    populateSelect("kwArkana4Select", arcaneArr);
                    populateSelect("kwArkana5Select", arcaneArr);
                    handleTextareaInput("kwArkana1Textarea", "number");
                    handleTextareaInput("kwArkana2Textarea", "number");
                    handleTextareaInput("kwArkana3Textarea", "number");
                    handleTextareaInput("kwArkana4Textarea", "number");
                    handleTextareaInput("kwArkana5Textarea", "number");
                    yesNoSet("kwArkana1MaxCheckbox");
                    yesNoSet("kwArkana2MaxCheckbox");
                    yesNoSet("kwArkana3MaxCheckbox");
                    yesNoSet("kwArkana4MaxCheckbox");
                    yesNoSet("kwArkana5MaxCheckbox");
                    createEvoSettings("kw", "divOpt3");
                }
            }, 50);
        })();

        (async function expeditionSettings() {

            const expCopySettingsButton = createButtons("expCopySettingsButton", "armoryInvertSelectionTabButton button", "Kopiuj z KW");

            const expAutoStartCheckbox = createCheckboxs("expAutoStartCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expAutoStart`));
            const expStartEqSelect = createSelects("expStartEqSelect", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expStartEq`));
            const expItem1xSelect = createSelects("expItem1xSelect", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expItem1x`));
            const expStartHourTextarea = createTextarea("expStartHourTextarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expStartHour`, ""));
            const expStartMinTextarea = createTextarea("expStartMinTextarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expStartMin`, ""));
            const expThursdayStartCheckbox = createCheckboxs("expThursdayStartCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expThursdayStart`));
            const expLocationListSelect = createSelects("expLocationListSelect", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expLocationList`));
            const expDifficultSelect = createSelects("expDifficultSelect", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expDifficult`));

            const expInviteTextarea = createTextarea("expInviteTextarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expInvite`, ""));
            const expMembersMaxCheckbox = createCheckboxs("expMembersMaxCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expMembersMax`));

            const expEqSelect = createSelects("expEqSelect", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expEq`));
            const expEndTimerTextarea = createTextarea("expEndTimerTextarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expEndTimer`, ""));
            const expEndHourTextarea = createTextarea("expEndHourTextarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expEndHour`, ""));
            const expEndMinTextarea = createTextarea("expEndMinTextarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expEndMin`, ""));

            const expJoinSelect = createSelects("expJoinSelect", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expJoin`));
            const expThursdayJoinCheckbox = createCheckboxs("expThursdayJoinCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expThursdayJoin`));
            const expJoinHourTextarea = createTextarea("expJoinHourTextarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expJoinHour`, ""));
            const expJoinMinTextarea = createTextarea("expJoinMinTextarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expJoinMin`, ""));

            const expJoinSamSelect = createSelects("expJoinSamSelect", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expJoinSam`));
            const expThursdayJoinSamCheckbox = createCheckboxs("expThursdayJoinCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expThursdayJoinSam`));
            const expJoinSamHourTextarea = createTextarea("expJoinSamHourTextarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expJoinSamHour`, ""));
            const expJoinSamMinTextarea = createTextarea("expJoinSamMinTextarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expJoinSamMin`, ""));

            const expArkana1Select = createSelects("expArkana1Select", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expArkana1`));
            const expArkana2Select = createSelects("expArkana2Select", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expArkana2`));
            const expArkana3Select = createSelects("expArkana3Select", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expArkana3`));
            const expArkana4Select = createSelects("expArkana4Select", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expArkana4`));
            const expArkana5Select = createSelects("expArkana5Select", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expArkana5`));
            const expArkana1Textarea = createTextarea("expArkana1Textarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expArkana1Value`, ""));
            const expArkana2Textarea = createTextarea("expArkana2Textarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expArkana2Value`, ""));
            const expArkana3Textarea = createTextarea("expArkana3Textarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expArkana3Value`, ""));
            const expArkana4Textarea = createTextarea("expArkana4Textarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expArkana4Value`, ""));
            const expArkana5Textarea = createTextarea("expArkana5Textarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expArkana5Value`, ""));
            const expArkana1MaxCheckbox = createCheckboxs("expArkana1MaxCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expArkana1Max`));
            const expArkana2MaxCheckbox = createCheckboxs("expArkana2MaxCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expArkana2Max`));
            const expArkana3MaxCheckbox = createCheckboxs("expArkana3MaxCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expArkana3Max`));
            const expArkana4MaxCheckbox = createCheckboxs("expArkana4MaxCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expArkana4Max`));
            const expArkana5MaxCheckbox = createCheckboxs("expArkana5MaxCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expArkana5Max`));

            const autoRepCheckbox = createCheckboxs("autoRepCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} autoRep`));
            const autoPremCheckbox = createCheckboxs("autoPremCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} autoPrem`));

            const expSettings = [
                ["-------------------------------------"],
                [`Skopiuj ustawienia z KW`, expCopySettingsButton],
                [`Automatycznie zakładaj ekspedycje`, expAutoStartCheckbox],
                ["-------------------------------------"],
                [`Zestaw do rozpoczęcia ekspedycji (krew, twardy itd)`, expStartEqSelect],
                [`Wybierz 1x do rozpoczęcia ekspedycji`, expItem1xSelect],
                ["-------------------------------------"],
                [`O której godzinie rozpocząć ekspedycję`, expStartHourTextarea, expStartMinTextarea],
                [`W czwartki zaczynaj poźniej`, expThursdayStartCheckbox],
                ["-------------------------------------"],
                [`Wybierz lokacje do rozpoczęcia ekspedycji`, expLocationListSelect],
                [`Poziom trudności`, expDifficultSelect, `jeśli nie ustawisz to pominie`],
                ["-------------------------------------"],
                [`Łowy za Repkę`, autoRepCheckbox, `lub Premium`, autoPremCheckbox],
                [`Wybierz ile osób zaprosić do expy`, expInviteTextarea, "zaproś wszystkich", expMembersMaxCheckbox],
                ["-------------------------------------"],
                [`Zestaw zakładany na ekspedycje`, expEqSelect],
                [`Automatycznie kończ ekspedycje w ciągu (min):`, expEndTimerTextarea],
                ["-------------------------------------"],
                [`O której godzinie zakończyć ekspedycję`, expEndHourTextarea, expEndMinTextarea],
                ["-------------------------------------"],
                [`Wybierz do kogo dołączyć do expy`, expJoinSelect],
                [`W czwartki dołącza do exp po 20:35`, expThursdayJoinCheckbox],
                [`O której godzinie dołączyć do ekspedycji`, expJoinHourTextarea, expJoinMinTextarea],
                ["-------------------------------------"],
                [`Wybierz do kogo dołączyć do expy jako samarytanin`, expJoinSamSelect],
                [`W czwartki dołącza jako samarytanin do KW po 20:35`, expThursdayJoinSamCheckbox],
                [`O której godzinie dołączyć do KW jako samarytanin`, expJoinSamHourTextarea, expJoinSamMinTextarea],
                ["-------------------------------------"],
                [`Arkana nr 1`, expArkana1Select, expArkana1Textarea, expArkana1MaxCheckbox],
                [`Arkana nr 2`, expArkana2Select, expArkana2Textarea, expArkana2MaxCheckbox],
                [`Arkana nr 3`, expArkana3Select, expArkana3Textarea, expArkana3MaxCheckbox],
                [`Arkana nr 4`, expArkana4Select, expArkana4Textarea, expArkana4MaxCheckbox],
                [`Arkana nr 5`, expArkana5Select, expArkana5Textarea, expArkana5MaxCheckbox]

            ];
            setTimeout(async function () {
                if (document.getElementById("divOpt4")) {
                    makeTable("divOpt4", expSettings);
                    yesNoSet("expAutoStartCheckbox");
                    populateSelect("expStartEqSelect", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} equipSets`));
                    populateSelect("expItem1xSelect", item1xArr);
                    handleTextareaInput("expStartHourTextarea", "number");
                    handleTextareaInput("expStartMinTextarea", "number");
                    yesNoSet("expThursdayStartCheckbox");
                    populateSelect("expLocationListSelect", expLocationArr);
                    populateSelect("expDifficultSelect", difficultArr);
                    yesNoSet("autoRepCheckbox");
                    yesNoSet("autoPremCheckbox");
                    handleTextareaInput("expInviteTextarea", "number");
                    yesNoSet("expMembersMaxCheckbox");
                    const initMembers = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expInvite`) ?? 0;
                    createMembersSettings("exp", "divOpt4", initMembers);

                    handleTextareaInput("expJoinHourTextarea", "number");
                    handleTextareaInput("expJoinMinTextarea", "number");

                    populateSelect("expEqSelect", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} equipSets`));
                    handleTextareaInput("expEndTimerTextarea", "number");
                    handleTextareaInput("expEndMinTextarea", "number");
                    handleTextareaInput("expEndHourTextarea", "number");

                    yesNoSet("expThursdayJoinCheckbox");

                    populateSelect("expJoinSelect", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} members`));

                    populateSelect("expJoinSamSelect", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} members`));
                    yesNoSet("expThursdayJoinSamCheckbox");
                    handleTextareaInput("expJoinSamHourTextarea", "number");
                    handleTextareaInput("expJoinSamMinTextarea", "number");

                    populateSelect("expArkana1Select", arcaneArr);
                    populateSelect("expArkana2Select", arcaneArr);
                    populateSelect("expArkana3Select", arcaneArr);
                    populateSelect("expArkana4Select", arcaneArr);
                    populateSelect("expArkana5Select", arcaneArr);
                    handleTextareaInput("expArkana1Textarea", "number");
                    handleTextareaInput("expArkana2Textarea", "number");
                    handleTextareaInput("expArkana3Textarea", "number");
                    handleTextareaInput("expArkana4Textarea", "number");
                    handleTextareaInput("expArkana5Textarea", "number");
                    yesNoSet("expArkana1MaxCheckbox");
                    yesNoSet("expArkana2MaxCheckbox");
                    yesNoSet("expArkana3MaxCheckbox");
                    yesNoSet("expArkana4MaxCheckbox");
                    yesNoSet("expArkana5MaxCheckbox");
                    createEvoSettings("exp", "divOpt4");
                }
            }, 50);
        })();

        (async function arena1Settings() {
            const arena1AutoCheckbox = createCheckboxs("arena1AutoCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arena1Auto`));
            const arena1CopySettingsButton = createButtons("arena1CopySettingsButton", "armoryInvertSelectionTabButton button", "Kopiuj z ataków");
            const arena1EqSelect = createSelects("arena1EqSelect");
            const arena1Item1xSelect = createSelects("arena1Item1xSelect",);
            const arena1Arkana1Select = createSelects("arena1Arkana1Select");
            const arena1Arkana2Select = createSelects("arena1Arkana2Select");
            const arena1Arkana3Select = createSelects("arena1Arkana3Select");
            const arena1Arkana4Select = createSelects("arena1Arkana4Select");
            const arena1Arkana5Select = createSelects("arena1Arkana5Select");
            const arena1Arkana1Textarea = createTextarea("arena1Arkana1Textarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arena1Arkana1Value`, ""));
            const arena1Arkana2Textarea = createTextarea("arena1Arkana2Textarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arena1Arkana2Value`, ""));
            const arena1Arkana3Textarea = createTextarea("arena1Arkana3Textarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arena1Arkana3Value`, ""));
            const arena1Arkana4Textarea = createTextarea("arena1Arkana4Textarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arena1Arkana4Value`, ""));
            const arena1Arkana5Textarea = createTextarea("arena1Arkana5Textarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arena1Arkana5Value`, ""));
            const arena1Arkana1MaxCheckbox = createCheckboxs("arena1Arkana1MaxCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arena1Arkana1Max`));
            const arena1Arkana2MaxCheckbox = createCheckboxs("arena1Arkana2MaxCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arena1Arkana2Max`));
            const arena1Arkana3MaxCheckbox = createCheckboxs("arena1Arkana3MaxCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arena1Arkana3Max`));
            const arena1Arkana4MaxCheckbox = createCheckboxs("arena1Arkana4MaxCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arena1Arkana4Max`));
            const arena1Arkana5MaxCheckbox = createCheckboxs("arena1Arkana5MaxCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arena1Arkana5Max`));

            const arena1Settings = [
                ["Auto arena", arena1AutoCheckbox],
                ["Skopiuj ustawienia z ataków", arena1CopySettingsButton],
                ["Zestaw na arenę 1vs1", arena1EqSelect],
                ["Jednoraz na arenę", arena1Item1xSelect],
                ["Arkana nr 1", arena1Arkana1Select, arena1Arkana1Textarea, arena1Arkana1MaxCheckbox],
                ["Arkana nr 2", arena1Arkana2Select, arena1Arkana2Textarea, arena1Arkana2MaxCheckbox],
                ["Arkana nr 3", arena1Arkana3Select, arena1Arkana3Textarea, arena1Arkana3MaxCheckbox],
                ["Arkana nr 4", arena1Arkana4Select, arena1Arkana4Textarea, arena1Arkana4MaxCheckbox],
                ["Arkana nr 5", arena1Arkana5Select, arena1Arkana5Textarea, arena1Arkana5MaxCheckbox],
            ];
            setTimeout(async function () {
                if (document.getElementById("divOpt5")) {
                    makeTable("divOpt5", arena1Settings);
                    yesNoSet("arena1AutoCheckbox");
                    populateSelect("arena1EqSelect", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} equipSets`));
                    populateSelect("arena1Item1xSelect", item1xArr);
                    populateSelect("arena1Arkana1Select", arcaneArr);
                    populateSelect("arena1Arkana2Select", arcaneArr);
                    populateSelect("arena1Arkana3Select", arcaneArr);
                    populateSelect("arena1Arkana4Select", arcaneArr);
                    populateSelect("arena1Arkana5Select", arcaneArr);
                    handleTextareaInput("arena1Arkana1Textarea", "number");
                    handleTextareaInput("arena1Arkana2Textarea", "number");
                    handleTextareaInput("arena1Arkana3Textarea", "number");
                    handleTextareaInput("arena1Arkana4Textarea", "number");
                    handleTextareaInput("arena1Arkana5Textarea", "number");
                    yesNoSet("arena1Arkana1MaxCheckbox");
                    yesNoSet("arena1Arkana2MaxCheckbox");
                    yesNoSet("arena1Arkana3MaxCheckbox");
                    yesNoSet("arena1Arkana4MaxCheckbox");
                    yesNoSet("arena1Arkana5MaxCheckbox");
                    createEvoSettings("arena1", "divOpt5");
                }
            }, 50);
        })();

        (async function arena3v3settings() {

            const arena3AutoCheckbox = createCheckboxs("arena3AutoCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arena3Auto`));
            const arena3CopySettingsButton = createButtons("arena3CopySettingsButton", "armoryInvertSelectionTabButton button", "Kopiuj z 1v1");
            const arena3StartJoinCheckbox = createCheckboxs("arena3StartJoinCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arena3StartJoin`));
            const arena3StartEqSelect = createSelects("arena3StartEqSelect");
            const arena3Item1xSelect = createSelects("arena3Item1xSelect",);
            const arena3FightEqSelect = createSelects("arena3FightEqSelect");
            const arena3JoinSelect = createSelects("arena3JoinSelect", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arena3Join`));
            const arena3StartJoinDay1Select = createSelects("arena3StartJoinDay1Select", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arena3StartJoinDay1`));
            const arena3StartJoinDay2Select = createSelects("arena3StartJoinDay2Select", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arena3StartJoinDay2`));
            const arena3StarJointHourTextarea = createTextarea("arena3StartJoinHourTextarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arena3StartJoinHour`, ""));
            const arena3StarJointMinTextarea = createTextarea("arena3StartJoinMinTextarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arena3StartJoinMin`, ""));
            const arena3InviteTextarea = createTextarea("arena3InviteTextarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arena3Invite`, ""));
            const arena3MembersMaxCheckbox = createCheckboxs("arena3MembersMaxCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arena3MembersMax`));
            const arena3Arkana1Select = createSelects("arena3Arkana1Select");
            const arena3Arkana2Select = createSelects("arena3Arkana2Select");
            const arena3Arkana3Select = createSelects("arena3Arkana3Select");
            const arena3Arkana4Select = createSelects("arena3Arkana4Select");
            const arena3Arkana5Select = createSelects("arena3Arkana5Select");
            const arena3Arkana1Textarea = createTextarea("arena3Arkana1Textarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arena3Arkana1Value`, ""));
            const arena3Arkana2Textarea = createTextarea("arena3Arkana2Textarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arena3Arkana2Value`, ""));
            const arena3Arkana3Textarea = createTextarea("arena3Arkana3Textarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arena3Arkana3Value`, ""));
            const arena3Arkana4Textarea = createTextarea("arena3Arkana4Textarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arena3Arkana4Value`, ""));
            const arena3Arkana5Textarea = createTextarea("arena3Arkana5Textarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arena3Arkana5Value`, ""));
            const arena3Arkana1MaxCheckbox = createCheckboxs("arena3Arkana1MaxCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arena3Arkana1Max`));
            const arena3Arkana2MaxCheckbox = createCheckboxs("arena3Arkana2MaxCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arena3Arkana2Max`));
            const arena3Arkana3MaxCheckbox = createCheckboxs("arena3Arkana3MaxCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arena3Arkana3Max`));
            const arena3Arkana4MaxCheckbox = createCheckboxs("arena3Arkana4MaxCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arena3Arkana4Max`));
            const arena3Arkana5MaxCheckbox = createCheckboxs("arena3Arkana5MaxCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arena3Arkana5Max`));

            const arena3Settings = [
                [`Automatyczne 3v3`, arena3AutoCheckbox],
                [`Skopiuj ustawienia z areny 1v1`, arena3CopySettingsButton],
                ["-------------------------------------"],
                [`Zakładanie (tak) lub dołączanie (nie) do areny 3v3`, arena3StartJoinCheckbox],
                ["-------------------------------------"],
                [`Zestaw do rozpoczęcia/dołączenia 3v3 (krew, twardy itd)`, arena3StartEqSelect],
                [`Wybierz 1x do rozpoczęcia/dołączenia 3v3`, arena3Item1xSelect],
                ["Zestaw na arenę 3v3", arena3FightEqSelect],
                [`Wybierz do kogo dołączyć do 3v3`, arena3JoinSelect],
                [`Zakładaj/dołączaj (1) w:`, arena3StartJoinDay1Select],
                [`Zakładaj/dołączaj (2) w:`, arena3StartJoinDay2Select],
                [`Zakładaj/dołączaj po godz. :`, arena3StarJointHourTextarea, arena3StarJointMinTextarea],
                [`Wybierz ile osób zaprosić do areny`, arena3InviteTextarea, "zaproś wszystkich", arena3MembersMaxCheckbox],
                [`Arkana nr 1`, arena3Arkana1Select, arena3Arkana1Textarea, arena3Arkana1MaxCheckbox],
                [`Arkana nr 2`, arena3Arkana2Select, arena3Arkana2Textarea, arena3Arkana2MaxCheckbox],
                [`Arkana nr 3`, arena3Arkana3Select, arena3Arkana3Textarea, arena3Arkana3MaxCheckbox],
                [`Arkana nr 4`, arena3Arkana4Select, arena3Arkana4Textarea, arena3Arkana4MaxCheckbox],
                [`Arkana nr 5`, arena3Arkana5Select, arena3Arkana5Textarea, arena3Arkana5MaxCheckbox],
            ];
            setTimeout(async function () {
                if (document.getElementById("divOpt6")) {
                    makeTable("divOpt6", arena3Settings);
                    yesNoSet("arena3AutoCheckbox");
                    yesNoSet("arena3MembersMaxCheckbox");
                    yesNoSet("arena3StartJoinCheckbox");
                    populateSelect("arena3StartEqSelect", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} equipSets`));
                    populateSelect("arena3Item1xSelect", item1xArr);
                    populateSelect("arena3FightEqSelect", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} equipSets`));
                    populateSelect("arena3JoinSelect", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} members`));
                    handleTextareaInput("arena3InviteTextarea", "number");
                    const initMembers = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arena3Invite`) ?? 0;
                    createMembersSettings("arena3", "divOpt6", initMembers);
                    populateSelect("arena3StartJoinDay1Select", daysArr);
                    populateSelect("arena3StartJoinDay2Select", daysArr);
                    populateSelect("arena3Arkana1Select", arcaneArr);
                    populateSelect("arena3Arkana2Select", arcaneArr);
                    populateSelect("arena3Arkana3Select", arcaneArr);
                    populateSelect("arena3Arkana4Select", arcaneArr);
                    populateSelect("arena3Arkana5Select", arcaneArr);
                    handleTextareaInput("arena3Arkana1Textarea", "number");
                    handleTextareaInput("arena3Arkana2Textarea", "number");
                    handleTextareaInput("arena3Arkana3Textarea", "number");
                    handleTextareaInput("arena3Arkana4Textarea", "number");
                    handleTextareaInput("arena3Arkana5Textarea", "number");
                    handleTextareaInput("arena3StartJoinHourTextarea", "number");
                    handleTextareaInput("arena3StartJoinMinTextarea", "number");
                    yesNoSet("arena3Arkana1MaxCheckbox");
                    yesNoSet("arena3Arkana2MaxCheckbox");
                    yesNoSet("arena3Arkana3MaxCheckbox");
                    yesNoSet("arena3Arkana4MaxCheckbox");
                    yesNoSet("arena3Arkana5MaxCheckbox");
                    createEvoSettings("arena3", "divOpt6");
                }
            }, 50);
        })();

        (async function pvpSettings() {

            const pvpAutoCheckbox = createCheckboxs("pvpAutoCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} pvpAuto`));
            const pvpCopySettingsButton = createButtons("pvpCopySettingsButton", "armoryInvertSelectionTabButton button", "Kopiuj z areny 1v1");
            const pvpEqSelect = createSelects("pvpEqSelect");
            const pvpItem1xSelect = createSelects("pvpItem1xSelect",);
            const pvpTaxiMaxCheckbox = createCheckboxs("pvpTaxiMaxCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} pvpTaxiMax`));
            const pvpAtkChanceTextarea = createTextarea("pvpAtkChanceTextarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} pvpAtkChance`, ""));
            const pvpArkana1Select = createSelects("pvpArkana1Select");
            const pvpArkana2Select = createSelects("pvpArkana2Select");
            const pvpArkana3Select = createSelects("pvpArkana3Select");
            const pvpArkana4Select = createSelects("pvpArkana4Select");
            const pvpArkana5Select = createSelects("pvpArkana5Select");
            const pvpArkana1Textarea = createTextarea("pvpArkana1Textarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} pvpArkana1Value`, ""));
            const pvpArkana2Textarea = createTextarea("pvpArkana2Textarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} pvpArkana2Value`, ""));
            const pvpArkana3Textarea = createTextarea("pvpArkana3Textarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} pvpArkana3Value`, ""));
            const pvpArkana4Textarea = createTextarea("pvpArkana4Textarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} pvpArkana4Value`, ""));
            const pvpArkana5Textarea = createTextarea("pvpArkana5Textarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} pvpArkana5Value`, ""));
            const pvpArkana1MaxCheckbox = createCheckboxs("pvpArkana1MaxCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} pvpArkana1Max`));
            const pvpArkana2MaxCheckbox = createCheckboxs("pvpArkana2MaxCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} pvpArkana2Max`));
            const pvpArkana3MaxCheckbox = createCheckboxs("pvpArkana3MaxCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} pvpArkana3Max`));
            const pvpArkana4MaxCheckbox = createCheckboxs("pvpArkana4MaxCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} pvpArkana4Max`));
            const pvpArkana5MaxCheckbox = createCheckboxs("pvpArkana5MaxCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} pvpArkana5Max`));


            const pvpSettings = [
                [
                    "Auto ataki wyłączą się jeśli czas trwania ataku wyniesie powyżej 27 minut",
                    "Problemem jest wykonanie ataku przed koniecznością zmiany eq na Ekspy i Kw",
                ],
                ["Auto ataki", pvpAutoCheckbox],
                ["Skopiuj ustawienia z areny 1vs1", pvpCopySettingsButton],
                ["Zestaw na ataki", pvpEqSelect],
                ["Jednoraz na ataki", pvpItem1xSelect],
                ["Auto Taxi Max", pvpTaxiMaxCheckbox],
                ["Procent na udaną zasadzkę powyżej którego wykonywane będą ataki", pvpAtkChanceTextarea],
                ["Arkana nr 1", pvpArkana1Select, pvpArkana1Textarea, pvpArkana1MaxCheckbox],
                ["Arkana nr 2", pvpArkana2Select, pvpArkana2Textarea, pvpArkana2MaxCheckbox],
                ["Arkana nr 3", pvpArkana3Select, pvpArkana3Textarea, pvpArkana3MaxCheckbox],
                ["Arkana nr 4", pvpArkana4Select, pvpArkana4Textarea, pvpArkana4MaxCheckbox],
                ["Arkana nr 3", pvpArkana5Select, pvpArkana5Textarea, pvpArkana5MaxCheckbox]
            ];
            setTimeout(async function () {
                if (document.getElementById("divOpt7")) {
                    makeTable("divOpt7", pvpSettings);
                    yesNoSet("pvpAutoCheckbox");
                    populateSelect("pvpEqSelect", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} equipSets`));
                    populateSelect("pvpItem1xSelect", item1xArr);
                    yesNoSet("pvpTaxiMaxCheckbox");
                    handleTextareaInput("pvpAtkChanceTextarea", "number");
                    populateSelect("pvpArkana1Select", arcaneArr);
                    populateSelect("pvpArkana2Select", arcaneArr);
                    populateSelect("pvpArkana3Select", arcaneArr);
                    populateSelect("pvpArkana4Select", arcaneArr);
                    populateSelect("pvpArkana5Select", arcaneArr);
                    handleTextareaInput("pvpArkana1Textarea", "number");
                    handleTextareaInput("pvpArkana2Textarea", "number");
                    handleTextareaInput("pvpArkana3Textarea", "number");
                    handleTextareaInput("pvpArkana4Textarea", "number");
                    handleTextareaInput("pvpArkana5Textarea", "number");
                    yesNoSet("pvpArkana1MaxCheckbox");
                    yesNoSet("pvpArkana2MaxCheckbox");
                    yesNoSet("pvpArkana3MaxCheckbox");
                    yesNoSet("pvpArkana4MaxCheckbox");
                    yesNoSet("pvpArkana5MaxCheckbox");
                    createEvoSettings("pvp", "divOpt7");
                }
            }, 50);
        })();

        (async function arenaKvKsettings() {

            const arenakAutoCheckbox = createCheckboxs("arenakAutoCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arenakAuto`));
            const arenakCopySettingsButton = createButtons("arenakCopySettingsButton", "armoryInvertSelectionTabButton button", "Kopiuj z ataków");
            const arenakStartEqSelect = createSelects("arenakStartEqSelect");
            const arenakItem1xSelect = createSelects("arenakItem1xSelect",);
            const arenakFightEqSelect = createSelects("arenakFightEqSelect");
            const arenakStartJoinDay1Select = createSelects("arenakStartJoinDay1Select", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arenakStartJoinDay1`));
            const arenakArkana1Select = createSelects("arenakArkana1Select");
            const arenakArkana2Select = createSelects("arenakArkana2Select");
            const arenakArkana3Select = createSelects("arenakArkana3Select");
            const arenakArkana4Select = createSelects("arenakArkana4Select");
            const arenakArkana5Select = createSelects("arenakArkana5Select");
            const arenakArkana1Textarea = createTextarea("arenakArkana1Textarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arenakArkana1Value`, ""));
            const arenakArkana2Textarea = createTextarea("arenakArkana2Textarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arenakArkana2Value`, ""));
            const arenakArkana3Textarea = createTextarea("arenakArkana3Textarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arenakArkana3Value`, ""));
            const arenakArkana4Textarea = createTextarea("arenakArkana4Textarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arenakArkana4Value`, ""));
            const arenakArkana5Textarea = createTextarea("arenakArkana5Textarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arenakArkana5Value`, ""));
            const arenakArkana1MaxCheckbox = createCheckboxs("arenakArkana1MaxCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arenakArkana1Max`));
            const arenakArkana2MaxCheckbox = createCheckboxs("arenakArkana2MaxCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arenakArkana2Max`));
            const arenakArkana3MaxCheckbox = createCheckboxs("arenakArkana3MaxCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arenakArkana3Max`));
            const arenakArkana4MaxCheckbox = createCheckboxs("arenakArkana4MaxCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arenakArkana4Max`));
            const arenakArkana5MaxCheckbox = createCheckboxs("arenakArkana5MaxCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arenakArkana5Max`));

            let arenakSettings = [
                [`Auto dołączenie do areny KvK`, arenakAutoCheckbox],
                ['Kopiuj ustawienie z Ekspedycji', arenakCopySettingsButton],
                ["Zestaw do wbicia na arenę", arenakStartEqSelect],
                [`Wybierz 1x`, arenakItem1xSelect],
                ['Zestaw zakłądany na arenę KvK', arenakFightEqSelect],
                [`Dzień wbicia`, arenakStartJoinDay1Select],
                [`Arkana nr 1`, arenakArkana1Select, arenakArkana1Textarea, arenakArkana1MaxCheckbox],
                [`Arkana nr 2`, arenakArkana2Select, arenakArkana2Textarea, arenakArkana2MaxCheckbox],
                [`Arkana nr 3`, arenakArkana3Select, arenakArkana3Textarea, arenakArkana3MaxCheckbox],
                [`Arkana nr 4`, arenakArkana4Select, arenakArkana4Textarea, arenakArkana4MaxCheckbox],
                [`Arkana nr 5`, arenakArkana5Select, arenakArkana5Textarea, arenakArkana5MaxCheckbox],
            ];
            setTimeout(async function () {
                if (document.getElementById("divOpt8")) {
                    makeTable("divOpt8", arenakSettings);

                    yesNoSet("arenakAutoCheckbox");
                    populateSelect("arenakStartEqSelect", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} equipSets`));
                    populateSelect("arenakItem1xSelect", item1xArr);
                    populateSelect("arenakFightEqSelect", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} equipSets`));
                    populateSelect("arenakStartJoinDay1Select", daysArr);
                    populateSelect("arenakArkana1Select", arcaneArr);
                    populateSelect("arenakArkana2Select", arcaneArr);
                    populateSelect("arenakArkana3Select", arcaneArr);
                    populateSelect("arenakArkana4Select", arcaneArr);
                    populateSelect("arenakArkana5Select", arcaneArr);
                    handleTextareaInput("arenakArkana1Textarea", "number");
                    handleTextareaInput("arenakArkana2Textarea", "number");
                    handleTextareaInput("arenakArkana3Textarea", "number");
                    handleTextareaInput("arenakArkana4Textarea", "number");
                    handleTextareaInput("arenakArkana5Textarea", "number");
                    yesNoSet("arenakArkana1MaxCheckbox");
                    yesNoSet("arenakArkana2MaxCheckbox");
                    yesNoSet("arenakArkana3MaxCheckbox");
                    yesNoSet("arenakArkana4MaxCheckbox");
                    yesNoSet("arenakArkana5MaxCheckbox");

                    createEvoSettings("arenak", "divOpt8");
                }
            }, 50);
        })();

        (async function huntSettings() {

            const huntAutoCheckbox = createCheckboxs("huntAutoCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} huntAuto`));
            const huntEqSelect = createSelects("huntEqSelect");
            const huntItem1xSelect = createSelects("huntItem1xSelect",);
            const huntArkana1Select = createSelects("huntArkana1Select");
            const huntArkana2Select = createSelects("huntArkana2Select");
            const huntArkana3Select = createSelects("huntArkana3Select");
            const huntArkana4Select = createSelects("huntArkana4Select");
            const huntArkana5Select = createSelects("huntArkana5Select");
            const huntArkana1Textarea = createTextarea("huntArkana1Textarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} huntArkana1Value`, ""));
            const huntArkana2Textarea = createTextarea("huntArkana2Textarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} huntArkana2Value`, ""));
            const huntArkana3Textarea = createTextarea("huntArkana3Textarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} huntArkana3Value`, ""));
            const huntArkana4Textarea = createTextarea("huntArkana4Textarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} huntArkana4Value`, ""));
            const huntArkana5Textarea = createTextarea("huntArkana5Textarea", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} huntArkana5Value`, ""));
            const huntArkana1MaxCheckbox = createCheckboxs("huntArkana1MaxCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} huntArkana1Max`));
            const huntArkana2MaxCheckbox = createCheckboxs("huntArkana2MaxCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} huntArkana2Max`));
            const huntArkana3MaxCheckbox = createCheckboxs("huntArkana3MaxCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} huntArkana3Max`));
            const huntArkana4MaxCheckbox = createCheckboxs("huntArkana4MaxCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} huntArkana4Max`));
            const huntArkana5MaxCheckbox = createCheckboxs("huntArkana5MaxCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} huntArkana5Max`));

            const huntSettings = [
                ["Auto polowanie", huntAutoCheckbox],
                ["Zestaw na polowanie", huntEqSelect],
                [`Wybierz 1x`, huntItem1xSelect],
                [`Arkana nr 1`, huntArkana1Select, huntArkana1Textarea, huntArkana1MaxCheckbox],
                [`Arkana nr 2`, huntArkana2Select, huntArkana2Textarea, huntArkana2MaxCheckbox],
                [`Arkana nr 3`, huntArkana3Select, huntArkana3Textarea, huntArkana3MaxCheckbox],
                [`Arkana nr 4`, huntArkana4Select, huntArkana4Textarea, huntArkana4MaxCheckbox],
                [`Arkana nr 5`, huntArkana5Select, huntArkana5Textarea, huntArkana5MaxCheckbox],
            ];
            if (document.getElementById("divOpt9")) {
                setTimeout(async function () {
                    makeTable("divOpt9", huntSettings);

                    yesNoSet("huntAutoCheckbox");
                    populateSelect("huntEqSelect", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} equipSets`));
                    populateSelect("huntItem1xSelect", item1xArr);
                    populateSelect("huntArkana1Select", arcaneArr);
                    populateSelect("huntArkana2Select", arcaneArr);
                    populateSelect("huntArkana3Select", arcaneArr);
                    populateSelect("huntArkana4Select", arcaneArr);
                    populateSelect("huntArkana5Select", arcaneArr);
                    handleTextareaInput("huntArkana1Textarea", "number");
                    handleTextareaInput("huntArkana2Textarea", "number");
                    handleTextareaInput("huntArkana3Textarea", "number");
                    handleTextareaInput("huntArkana4Textarea", "number");
                    handleTextareaInput("huntArkana5Textarea", "number");
                    yesNoSet("huntArkana1MaxCheckbox");
                    yesNoSet("huntArkana2MaxCheckbox");
                    yesNoSet("huntArkana3MaxCheckbox");
                    yesNoSet("huntArkana4MaxCheckbox");
                    yesNoSet("huntArkana5MaxCheckbox");

                    createEvoSettings("hunt", "divOpt9");
                }, 10);
            }
        })();

        (async function autoJourneySettings() {

            const journeyAutoCheckbox = createCheckboxs("journeyAutoCheckbox", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} journeyAuto`));
            const journeyEqSelect = createSelects("journeyEqSelect");
            const journeyLocationSelect = createSelects("journeyLocationSelect");
            const journeyReward1Select = createSelects("journeyReward1Select");
            const journeyReward2Select = createSelects("journeyReward2Select");
            const journeyDifficultSelect = createSelects("journeyDifficultSelect");
            const journeySettings = [
                ["Automatyczne podróże", journeyAutoCheckbox],
                ["Wybiera opcję gdzie mamy więcej pkt, zawsze używa 'specjala'", ''],
                ["Eq na podróże: ", journeyEqSelect],
                ["Wybierz konkretną lokacje dla podróży:", journeyLocationSelect],
                ["przy wyszukaniu lokacji z nagrodą (opcja poniżej) to będzie maksymalna lokacja wyszukiwania", ''],
                ["Wybierz automatycznie lokacje z nagrodą: ", journeyReward1Select, journeyReward2Select],
                ["wybierana jest 1 lub 2 nagroda (pierwsza dopasowana)", ''],
                ["Wybierz poziom trudności lokacji: ", journeyDifficultSelect],
                ["jeśli chcesz użyć konkretnej lokacji ustaw BRAK W OBU opcjach wyszukiwani nagród", ''],
                ["Jeśli nie dopasuje nagrody użyje maksylamnej/konkretnej lokacji", '']
            ]

            if (document.getElementById("divOpt10")) {
                setTimeout(async function () {
                    makeTable("divOpt10", journeySettings);
                    yesNoSet("journeyAutoCheckbox");
                    populateSelect("journeyEqSelect", await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} equipSets`));
                    populateSelect("journeyLocationSelect", journeyLocationsArray);
                    populateSelect("journeyReward1Select", journeyRewardsArray);
                    populateSelect("journeyReward2Select", journeyRewardsArray);
                    populateSelect("journeyDifficultSelect", journeyDifficultArray);
                }, 10);
            }
        })();

        (async function autoBW() {

            const equipEq = async (eqValue) => {
                // Sprawdź, czy na stronie pojawił się komunikat o błędzie zmiany ekwipunku
                const errorTxt = document.querySelector('.auBid .error')?.textContent;
                const errorTxtToCheck = 'Nie możesz dokonać zmiany ekwipunku';
                if (errorTxt && errorTxt.includes(errorTxtToCheck)) {
                    return
                    // await GM.setValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} timer`, 10);
                }

                eqValue = isNaN(eqValue) ? 1 : eqValue;

                // Nie przełączaj ekwipunku, jeśli już jest ustawiony ten sam
                const isEquipmentAlreadyEquipped = bwCharacter.equipedEq === parseInt(eqValue);
                if (!isEquipmentAlreadyEquipped) {
                    const key = accessKey;
                    window.location.href = `?a=equip&eqset=${eqValue}&akey=${key}`;
                }
            };

            // 🧠 Podfunkcja: zwraca czas trwania wyprawy (zaokrąglony w górę)
            function getRoundedDuration() {
                // 🔍 Sprawdzenie, czy jest wybrana wyprawa
                const selectedQuest = document.querySelector('input[name="questDiff"]:checked');
                if (selectedQuest) {
                    const row = selectedQuest.closest('tr');
                    if (!row) return 0;

                    const durationCell = row.querySelector('td:last-child');
                    if (!durationCell) return 0;

                    const durationText = durationCell.textContent.trim();
                    const match = durationText.match(/(\d+)\s*min.*?(\d+)\s*sek/);
                    if (!match) return 0;

                    const minutes = parseInt(match[1], 10);
                    const seconds = parseInt(match[2], 10);

                    return minutes + (seconds > 0 ? 1 : 0); // zaokrąglenie w górę
                }

                // 🔍 Sprawdzenie, czy trwa atak (PVP, ekspedycja, itp.)
                const timeText = document.querySelector("#totalTime")?.textContent;
                if (timeText && timeText !== "?") {
                    const parts = timeText.split(":").map(p => parseInt(p.trim(), 10));
                    if (parts.length !== 3) return 0;

                    const [h, m, s] = parts;
                    const totalMinutes = h * 60 + m + (s > 0 ? 1 : 0); // zaokrąglenie w górę

                    console.log("totalMinutes",totalMinutes);
                    return totalMinutes;
                }

                // ❌ Brak danych
                return 0;
            }

            async function nonPremiumJobTimeCheck() {
                if (bwCharacter.activePremium) return;
            
                const currentMinute = bwCharacter.minutes;
                const currentSecond = new Date().getSeconds();
                const questDuration = getRoundedDuration();
                const questEndMinute = (currentMinute + questDuration);
            
                const keyBase = `${bwCharacter.serverNumber} ${bwCharacter.nickName}`;
                const nowTotalSeconds = currentMinute * 60 + currentSecond;
            
                const kwEq = await GM.getValue(`${keyBase} kwEq`);
                const expEq = await GM.getValue(`${keyBase} expEq`);
                
                // 🎯 KW EQ – jeśli jesteśmy w zakazanym czasie KW
                if ((currentMinute >= 4 && currentMinute < 6) || (currentMinute >= 34 && currentMinute < 36)) {
                    await GM.setValue(`${keyBase} timer`, 2);
                    await equipEq(kwEq, true);
                }
            
                // 🎯 EXP EQ – jeśli jesteśmy w zakazanym czasie EXP
                if ((currentMinute >= 59 || currentMinute < 1) || (currentMinute >= 29 && currentMinute < 31)) {
                    await GM.setValue(`${keyBase} timer`, 2);
                    await equipEq(expEq, true);
                }
            
                // 🔒 EXP – jeśli wyprawa zakończy się po 29 minucie
                if (currentMinute >= 6 && currentMinute < 29 && questEndMinute >= 29) {
                    const waitTime = (29 * 60) - nowTotalSeconds;
                    await GM.setValue(`${keyBase} timer`, waitTime);
                    window.location.href = "?a=main";
                    return;
                }
            
                // 🔒 KW – jeśli zakończy się po 34
                if (currentMinute >= 31 && currentMinute < 34 && questEndMinute >= 34) {
                    const waitTime = (34 * 60) - nowTotalSeconds;
                    await GM.setValue(`${keyBase} timer`, waitTime);
                    window.location.href = "?a=main";
                    return;
                }
            
                // 🔒 EXP – jeśli zakończy się po 59
                if (currentMinute >= 36 && currentMinute < 59 && questEndMinute >= 59) {
                    const waitTime = (59 * 60) - nowTotalSeconds;
                    console.log(questEndMinute, waitTime);
                    await GM.setValue(`${keyBase} timer`, waitTime);
                    window.location.href = "?a=main";
                    return;
                }
            
                // 🔒 KW – wraparound: jeśli zakończy się po 4
                if (currentMinute >= 1 && currentMinute < 4 && questEndMinute >= 4) {
                    const waitTime = (4 * 60) - nowTotalSeconds;
                    await GM.setValue(`${keyBase} timer`, waitTime);
                    window.location.href = "?a=main";
                    return;
                }
            
            }
            
            async function handleArenaEquips() {
                if (bwCharacter.day === 1 || bwCharacter.day === 4 || bwCharacter.day === 7) {


                    const currentMinute = bwCharacter.minutes;
                    const sec = new Date().getSeconds();

                    const keyBase = `${bwCharacter.serverNumber} ${bwCharacter.nickName}`;
                    const nowTotalSeconds = bwCharacter.minutes * 60 + sec;

                    const wait = (11 * 60) - nowTotalSeconds;

                    let eqKey = null;

                    // 🏅 Arena K – niedziela
                    if (bwCharacter.day === 7) {
                        eqKey = "arenakFightEq";
                    }

                    // 🥷 Arena 3v3 – poniedziałek i czwartek
                    if ((bwCharacter.day === 1 || bwCharacter.day === 4)) {
                        eqKey = "arena3FightEq";
                    }

                    console.log(eqKey);
                    if (!eqKey) return;


                    const eq = await GM.getValue(`${keyBase} ${eqKey}`);

                    if (bwCharacter.hour === 21 && currentMinute < 12) {
                        if (bwCharacter.activePremium) {
                            await GM.setValue(`${keyBase} timer`, wait);
                            await equipEq(eq);
                            console.log(`🎯 Arena – zakładam eq (${eqKey}) w minucie ${currentMinute}`);
                        } else if (currentMinute >= 6) {
                            await GM.setValue(`${keyBase} timer`, wait);
                            await equipEq(eq);
                            console.log(`🎯 Arena – zakładam eq (${eqKey}) w minucie ${currentMinute}`);
                        }

                    }
                }
                else{
                    return
                }
            }

            async function timersReset(min, sec) {
                if (min % 10 === 0 && sec < 2) {
                    const keys = [
                        'arenakJoinLater',
                        'kwStartLater',
                        'kwJoinLater',
                        'expJoinLater',
                        'expStartLater',
                        'arena3JoinLater',
                        'pvpLater',
                        'questLater',
                        'huntEvoSet',
                        'huntArkanaSet'
                    ];

                    for (const key of keys) {
                        const fullKey = `${bwCharacter.serverNumber} ${bwCharacter.nickName} ${key}`;
                        const value = await GM.getValue(fullKey);
                        if (value) {
                            await GM.setValue(fullKey, false);
                        }
                    }

                    window.location.reload();
                }
            }

            if (await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} autoBw`)) {

                (async function getMembers() {
                    const members = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} members`) ?? 0;
                    const isMembersPage = bwCharacter.linkApi === "?a=aliance";
                    const nonMembersError = document.querySelectorAll('.error');

                    if (!members && !isMembersPage) {
                        window.location.href = "?a=aliance";
                        return;
                    }

                    if (isMembersPage) {
                        const membersArray = [];
                        const membersList = Array.from(document.querySelectorAll("#clanMemberList tr"));

                        if (nonMembersError.length > 0) {
                            membersArray.push(`<option value="0">---- brak ----</option>`);
                        }

                        membersList.slice(1).forEach((member, index) => {
                            const memberNick = member.querySelectorAll("td")[1].querySelector('a').innerText;
                            membersArray.push(`<option value="${index + 1}">${memberNick}</option>`);
                        });

                        GM.setValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} members`, membersArray);
                    }
                })();

                (async function getSets() {
                    const eqSets = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} equipSets`) ?? 0;
                    const isEqPage = bwCharacter.linkApi === "?a=equip";

                    if (!eqSets.length && !isEqPage) {
                        window.location.href = "?a=equip";
                        return;
                    }

                    if (bwCharacter.linkApi.startsWith("?a=equip")) {
                        const equipArray = [];
                        const itemSetNrContainers = Array.from(document.getElementsByClassName("itemSetNrContainer"));

                        itemSetNrContainers.forEach((container, index) => {
                            if (container.outerHTML.length > 56) {
                                let nameEq = container.outerHTML;
                                nameEq = nameEq.substring(nameEq.indexOf("CAPTION,") + 9, nameEq.indexOf(",CAPTIONFONTCLASS") - 1);
                                equipArray.push(`<option value="${index + 1}">${index + 1}. ${nameEq}</option>`);
                            }
                        });

                        GM.setValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} equipSets`, equipArray);
                    }
                })();


                (async function updateTimer() {
                    const quest = gameTimers.getAll().quest_timeleft;
                    const atk = gameTimers.getAll().atkTimeLeft;

                    const questTime = quest?.getSecondsLeft();
                    const atkTime = atk?.getSecondsLeft();

                    const questValid = Number.isFinite(questTime) && questTime > 0;
                    const atkValid = Number.isFinite(atkTime) && atkTime > 0;

                    if (!questValid && !atkValid) return;

                    const timeLeft = Math.max(questValid ? questTime : 0, atkValid ? atkTime : 0);

                    await GM.setValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} timer`, timeLeft);
                })();


                setInterval(async function timer() {

                    const min = bwCharacter.minutes;
                    const sec = new Date().getSeconds();

                    await timersReset(min, sec);
                    await nonPremiumJobTimeCheck();
                    await handleArenaEquips();

                    const timerKey = `${bwCharacter.serverNumber} ${bwCharacter.nickName} timer`;
                    let currentTimeLeft = parseInt(await GM.getValue(timerKey)) || 0;

                    if (currentTimeLeft > 0) {
                        currentTimeLeft--;
                        await GM.setValue(timerKey, currentTimeLeft);

                        if (currentTimeLeft <= 0) {
                            await GM.setValue(timerKey, 0);
                            window.location.reload();
                        }
                    }
                }, 1000); // interwał 0.9 sekundy


                (async function colors() {
                    const epikColor = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} epikColor`);
                    const ldbColor = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} ldsColor`);
                    const ldsColor = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} ldbColor`);
                    const zkColor = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} zkColor`);

                    async function applyItemColor(itemQuality) {
                        if (itemQuality.innerText.includes("Epick")) {
                            itemQuality.style.setProperty("color", epikColor, "important");
                        }
                        if (itemQuality.innerText.includes("Legendarn")) {
                            if (itemQuality.innerText.includes("Dobr")) {
                                itemQuality.style.setProperty("color", ldbColor, "important");
                            }
                            if (itemQuality.innerText.includes("Dosk")) {
                                itemQuality.style.setProperty("color", ldsColor, "important");
                            }
                        }
                    }

                    function observeMutations(mutationsList) {
                        mutationsList.forEach((mutation) => {
                            mutation.addedNodes.forEach((el) => {
                                if (el && el.classList && el.classList.contains("item")) {
                                    itemColoring(el);
                                }
                                if (el && el.classList && el.classList.contains("armoryItemTabContainer")) {
                                    el.querySelectorAll("span[class*=item-]").forEach((e) => itemColoring(e.parentNode));
                                }
                            });
                        });
                    }

                    async function itemColoring(item) {
                        const itemQuality = item.querySelector("span[class*=item-]") || item;
                        applyItemColor(itemQuality);
                    }

                    const observerConfig = {
                        childList: true,
                        subtree: true,
                    };

                    const stockItemListObserver = new MutationObserver(observeMutations);
                    const clanArmoryObserver = new MutationObserver(observeMutations);

                    const stockItemList = document.querySelector("#stockItemList");
                    const clanArmoryItemListContainer = document.querySelector("#clanArmoryItemListContainer");

                    if (bwCharacter.linkApi.startsWith("?a=equip")) {
                        if (zkColor) {
                            if (clanArmoryItemListContainer) {
                                clanArmoryObserver.observe(clanArmoryItemListContainer, observerConfig);
                            }
                        }
                        if (stockItemList) {
                            stockItemListObserver.observe(stockItemList, observerConfig);
                        }
                    }

                    document.querySelectorAll("span[class*=item-]").forEach((el) => itemColoring(el));
                })();

                (async function allianceDescriptionHide() {
                    const hasAlliance = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} aliance`);
                    const isAllyPage = bwCharacter.linkApi.startsWith("?a=aliance");

                    if (hasAlliance && isAllyPage) {
                        const descriptions = document.getElementsByClassName("clan-desc");

                        function hideDescription(element) {
                            const allianceLink = document.createElement("a");
                            allianceLink.setAttribute("href", "#");
                            allianceLink.textContent = "Kliknij tutaj aby rozwinąć opis";

                            const allianceTxt = element.innerHTML;
                            element.innerHTML = "";
                            element.append(allianceLink);
                            element.style.textAlignLast = "center";

                            allianceLink.addEventListener("click", function (event) {
                                event.preventDefault();

                                if (allianceLink.textContent === "Kliknij tutaj aby zwinąć opis") {
                                    allianceLink.textContent = "Kliknij tutaj aby rozwinąć opis";
                                    element.innerHTML = "";
                                    element.append(allianceLink);
                                } else {
                                    allianceLink.textContent = "Kliknij tutaj aby zwinąć opis";
                                    element.innerHTML = allianceTxt;
                                    element.append(allianceLink);
                                }
                            });
                        }

                        Array.from(descriptions).forEach(hideDescription);
                    }
                })();

                (async function onetimeItemShow() {
                    const isTownshopPage = bwCharacter.linkApi.startsWith("?a=townshop");
                    if (isTownshopPage) {
                        function processItemLink(itemLink) {
                            const onclickAttr = itemLink.getAttribute("onclick");
                            if (!onclickAttr) return "";
                            const startIdx = onclickAttr.indexOf("<table");
                            const endIdx = onclickAttr.indexOf("</table>") + 8;
                            let result = onclickAttr.substring(startIdx, endIdx);
                            return result.replace(/&quot;/g, '"').replace(/Przedmiot jednorazowego użytku/g, "");
                        }

                        function showItems(shellNumber) {
                            const equipElements = document.querySelectorAll(".equip");
                            const targetElement = equipElements[equipElements.length - shellNumber];

                            targetElement.querySelectorAll(".item-link").forEach(itemLink => {
                                const resultHTML = processItemLink(itemLink);
                                if (resultHTML) {
                                    itemLink.insertAdjacentHTML("beforeend", resultHTML);
                                }
                            });
                        }

                        const isOnetimeItemEnabled = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} item1x`);

                        if (isOnetimeItemEnabled) {
                            const onetimeItem3Element = document.getElementById("ts_onetime3");

                            if (!onetimeItem3Element) {
                                showItems(1);
                            } else {
                                showItems(1);
                                showItems(2);
                                showItems(3);
                            }
                        }
                    }
                })();

                (async function fastEquip() {
                    if ((await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} fastEquip`)) === true) {

                        const divEq = document.createElement("div");
                        divEq.setAttribute("id", "fastEquip");
                        divEq.style.width = "48px";
                        divEq.style.height = "22px";
                        divEq.style.border = "1px solid gray";
                        divEq.style.padding = "1px";
                        divEq.style.margin = "2px";
                        divEq.style.cursor = "pointer";
                        divEq.style.float = "right";
                        divEq.style.textAlign = "center";
                        divEq.style.lineHeight = "20px";

                        const selectEq = document.createElement("select");
                        selectEq.setAttribute("id", "fastEquipSelect");
                        selectEq.style.height = "20px";
                        selectEq.style.width = "40px";
                        selectEq.style.fontSize = "8px";

                        sbox.append(divEq);
                        divEq.append(selectEq);

                        const equipSets = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} equipSets`);
                        populateSelect("fastEquipSelect", equipSets);

                        selectEq.addEventListener("change", async function () {
                            await equipEq(this.value);
                        });
                    }
                })();

                function processAuctionRow(index, index1, junk) {
                    const auctionRow = document.querySelectorAll(".auctionRow")[index];
                    let junkCostRow = auctionRow.querySelectorAll("td")[3];
                    let moriaNecroDesc;

                    if (bwCharacter.realmType === "Necropolia") {
                        moriaNecroDesc = 'pr';
                    } else {
                        moriaNecroDesc = 'kk';
                        junkCostRow = junkCostRow.querySelector("div");
                    }

                    const junkCost = (getNumericContent(junkCostRow) / junk).toFixed(2);
                    const junkCostValue = getNumericContent(junkCostRow);

                    if (parseInt(auctionRow.querySelectorAll("td")[2].textContent) > 0) {
                        insertHTMLContent(
                            auctionRow.querySelectorAll("span")[index1],
                            ` <span class="enabled">(${junkCost.toLocaleString("pl-PL")} ${moriaNecroDesc}/szt)</span>`
                        );

                        insertHTMLContent(
                            auctionRow.querySelectorAll("td")[3],
                            `<span> -> ${Math.ceil(junkCostValue * 1.05).toLocaleString("pl-PL")}</span><br><span class="enabled">(${((junkCostValue * 1.05) / junk).toFixed(2)} ${moriaNecroDesc}/szt)</span>`
                        );
                    } else {
                        insertHTMLContent(
                            auctionRow.querySelectorAll("span")[index1],
                            ` <span class="disabled">(${junkCost.toLocaleString("pl-PL")} ${moriaNecroDesc}/szt)</span>`
                        );
                    }
                }

                (async function junkCostAuction() {
                    const isAuctionPage = bwCharacter.linkApi.startsWith("?a=auction");
                    if (isAuctionPage) {
                        const isJunkCostEnabled = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} junkCost`);

                        if (isJunkCostEnabled) {
                            const auctionRows = document.querySelectorAll(".auctionRow");

                            auctionRows.forEach((row, index) => {
                                const spans = row.querySelectorAll("span");

                                spans.forEach((span, index1) => {
                                    if (span.innerHTML.startsWith("Złom")) {
                                        const junk = parseInt(span.innerHTML.replace("Złom sztuk: ", ""));
                                        processAuctionRow(index, index1, junk);
                                    }
                                });
                            });
                        }
                    }
                })();

                (async function crappSell() {
                    const isArmoryPage = bwCharacter.linkApi.startsWith("?a=equip");
                    if (!isArmoryPage) return;

                    const eqcrapp = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} crapSell`);
                    if (!eqcrapp) return;

                    const hc_c0 = document.getElementById("hc_c0");
                    const hc_c19 = document.getElementById("hc_c19");
                    if (!hc_c0 || !hc_c19) return;

                    // Dodaj przyciski do odpowiednich sekcji
                    const buttonsInfo = [
                        { parent: hc_c0.querySelectorAll("div")[0], id: "crapp1", tabId: 0 },
                        { parent: hc_c0.querySelectorAll("div")[2], id: "crapp2", tabId: 0 },
                        { parent: hc_c19.querySelectorAll("div")[0], id: "crapp3", tabId: 19 },
                        { parent: hc_c19.querySelectorAll("div")[1], id: "crapp4", tabId: 19 }
                    ];

                    for (const { parent, id } of buttonsInfo) {
                        parent.insertAdjacentHTML("beforeend", `<input class="armoryInvertSelectionTabButton button" id="${id}" type="button" value="CZYSZCZENIE">`);
                    }

                    /**
                     * Pomocnicza funkcja sprzedająca przedmioty z określonej zakładki
                     * @param {number} tabId - numer zakładki (0 lub 19)
                     */
                    async function itemClickSellHelper(tabId) {
                        const items = document.querySelectorAll(`#armoryTabItemList_${tabId} .item`);

                        items.forEach(item => {
                            const sellCostElement = item.querySelector("div[data-name=displaySellCost] span:nth-child(2)");
                            if (!sellCostElement) return;

                            const sellCost = parseInt(sellCostElement.textContent.replace(/ /g, "").replace("PLN", ""), 10);

                            // Sprawdź koszt i czy przedmiot jest epicki
                            if (eqcrapp >= sellCost && item.querySelector("div span").innerText.includes("Epick")) {
                                const checkbox = item.querySelector("input[type=checkbox]");
                                if (checkbox) checkbox.click();
                            }
                        });

                        setTimeout(() => {
                            const sellButton = document.querySelector(".sellButton");
                            if (sellButton) sellButton.click();
                        }, 300);
                    }

                    // Podpinamy eventy pod każdy z czterech przycisków
                    document.getElementById("crapp1").addEventListener("click", () => itemClickSellHelper(0));
                    document.getElementById("crapp2").addEventListener("click", () => itemClickSellHelper(0));
                    document.getElementById("crapp3").addEventListener("click", () => itemClickSellHelper(19));
                    document.getElementById("crapp4").addEventListener("click", () => itemClickSellHelper(19));
                })();


                (async function shortcutsEvent() {
                    document.addEventListener("keydown", async function (event) {
                        if (event.ctrlKey) {
                            switch (event.key) {
                                case "ArrowLeft":
                                    document.querySelector(".button[value=POPRZEDNIA]")?.click();
                                    document.querySelector('a[href*="?a=rank&page="]')?.click();
                                    break;
                                case "ArrowRight":
                                    document.querySelector(".button[value=NASTĘPNA]")?.click();
                                    document.querySelectorAll('a[href*="?a=rank&page="]')[1]?.click();
                                    break;
                            }
                        }
                        if (event.altKey) {
                            const keyMap = {
                                "0": "alt0",
                                "1": "alt1",
                                "2": "alt2",
                                "3": "alt3",
                                "4": "alt4",
                                "5": "alt5",
                                "6": "alt6",
                                "7": "alt7",
                                "8": "alt8",
                                "9": "alt9"
                            };

                            if (keyMap[event.key] !== undefined) {
                                const url = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} ${keyMap[event.key]}`);
                                if (url) {
                                    window.location.href = url;
                                }
                            }
                        }
                    });
                })();

                (async function levelsLeftKwExp() {
                    const isLKEEnabled = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} lvlsLeft`);

                    if (isLKEEnabled) {
                        const expeditionList = document.querySelector(".expeditionCurrentList")?.querySelectorAll("tr");

                        expeditionList?.forEach(currentRow => {
                            const cells = currentRow.querySelectorAll("td");

                            if (cells.length === 7) {
                                const expCell = cells[3];
                                const spans = expCell.querySelectorAll("span");

                                if (spans.length >= 2) {
                                    const totalExp = parseInt(expCell.textContent.replace(/\s/g, "").split("/")[1]);
                                    const firstSpanExp = parseInt(spans[1].innerHTML.replace(/\s/g, ""));

                                    let additionalExp = firstSpanExp;

                                    if (spans.length > 2) {
                                        const thirdSpanExp = parseInt(spans[2].innerHTML.replace(/\s/g, ""));
                                        additionalExp = isNaN(thirdSpanExp) ? firstSpanExp : firstSpanExp - thirdSpanExp;
                                    }
                                    const remainingExp = totalExp - additionalExp;

                                    expCell.insertAdjacentHTML(
                                        "beforeend",
                                        `<span class="disabled"><br>(${remainingExp})</span>`
                                    );
                                }
                            }
                        });
                    }
                })();

                (async function autoReloadPage() {
                    const reloadInterval = isNaN(await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} autoReload`)) ? 0 : parseInt(await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} autoReload`));
                    if (reloadInterval > 0) {
                        const reloadTimer = parseInt(reloadInterval, 10) * 60;
                        if (reloadTimer > 0) {
                            setInterval(() => {
                                window.location.reload();
                            }, reloadTimer * 1000);
                        }
                    }
                })();

                async function tasksCheckAndReward() {
                    const autoTask = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} taskRewardTake`);

                    if (autoTask) {

                        const findReward1 = parseInt(await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} taskReward1`));
                        const findReward2 = parseInt(await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} taskReward2`));
                        const findReward3 = parseInt(await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} taskReward3`));


                        if (findReward1 || findReward2 || findReward3) {
                            const claimRewardButton = document.querySelector("[name='claimReward']");
                            if (claimRewardButton) {
                                claimRewardButton.click();
                            }

                            const rewardsHelper = [
                                " ",
                                "m_evoPts",
                                "m_rune",
                                "m_darkPts_free",
                                "m_silverCoins",
                                "m_repPts",
                                "m_pln",
                                "m_blood",
                                "m_ppl",
                                "m_questBonusPts",
                                "m_journeyBoost",
                            ];

                            const refreshButtons = document.querySelectorAll("[name='refreshTask']");

                            refreshButtons.forEach(el => {
                                const rewardBox = el.parentElement.parentElement.parentElement.querySelector(".loginBonus_rewardBox");
                                if (rewardBox) {
                                    const rewardImg = rewardBox.querySelector(".loginBonus_rewardImg");
                                    if (rewardImg) {
                                        const reward = rewardImg.getAttribute("src").split("/").pop().split(".")[0];
                                        if (
                                            reward.search(rewardsHelper[findReward1]) < 0 &&
                                            reward.search(rewardsHelper[findReward2]) < 0 &&
                                            reward.search(rewardsHelper[findReward3]) < 0
                                        ) {
                                            el.onclick = function () {
                                                return true;
                                            };
                                            el.click();
                                        }
                                    }
                                }
                            });
                        }
                    }
                };

                async function set1x(name) {

                    const oneTimeSelect = document.getElementById("onetime");
                    const oneTimeToSet = parseInt(await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} ${name}Item1x`), 10);
                    let oneTimeOk = false;

                    if (parseInt(oneTimeSelect.value, 10) === oneTimeToSet) {
                        oneTimeOk = true;
                    } else {
                        oneTimeSelect.value = oneTimeToSet;
                    }

                    return oneTimeOk;
                }

                async function setEquipment(name) {
                    const eqToSet = parseInt(await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} ${name}Eq`), 10);
                    const eqSetted = document.getElementById("selectedEquipSetNr");
                    let setOk = false;

                    if (!eqSetted || parseInt(eqSetted.value, 10) === eqToSet) {
                        setOk = true;
                    } else {
                        eqSetted.value = eqToSet;
                    }

                    return setOk;
                }

                async function setArkana(name) {
                    let settingDone = false; // Ustaw na false na początku

                    const arcPts = async (nr) => parseInt(await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} ${name}Arkana${nr}Value`));
                    const arcType = async (nr) => parseInt(await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} ${name}Arkana${nr}`));
                    const arcPtsMax = async (nr) => await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} ${name}Arkana${nr}Max`);

                    let checkedCount = 0; // Zmienna do zliczania zaznaczonych checkboxów

                    for (let index1 = 0; index1 < 5; index1++) {
                        const idx = index1 + 1;
                        const type = await arcType(idx); // Zakładam, że arcType jest funkcją asynchroniczną

                        if (type === 11 || type === 15) {
                            const arcExists = document.getElementById("ark_" + type);
                            if (arcExists && !arcExists.checked) {
                                arcExists.click();
                            }
                        }
                        checkedCount++; // Zwiększ licznik, gdy checkbox jest zaznaczony
                    }

                    // Możesz użyć checkedCount jako kolejnego warunku
                    if (checkedCount > 4) {
                        // Druga pętla: ustawianie wartości arkan
                        for (let index1 = 1; index1 <= 5; index1++) {
                            const type = await arcType(index1);
                            const arcExists = document.getElementById("ark_" + type);
                            const arcPrevVal = parseInt(document.getElementById(`disp_${type}`)?.getAttribute('data-previousvalue'), 10);

                            if (arcExists) {
                                if (type !== 11 && type !== 15) {
                                    const pts = await arcPts(index1);
                                    if (pts !== arcPrevVal) {
                                        if (await arcPtsMax(index1)) {
                                            clickMax(type);
                                        } else {
                                            setArc(type, pts);
                                        }
                                    }
                                }
                            }
                            if (index1 >= 5) settingDone = true;
                        }
                    }
                    return settingDone; // Zwróć settingDone
                }

                async function setEvo(name) {
                    let settingDone = false; // Ustaw na false na początku
                    for (let i = 1; i <= 12; i++) {
                        const evoTypeMax = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} ${name}Evo${i}Max`);
                        const evoType = parseInt(await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} ${name}Evo${i}`), 10);
                        const evoPts = parseInt(await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} ${name}Evo${i}Value`), 10);

                        if (evoTypeMax) {
                            EvoSelection.instance().clickMaxEvo(evoType);
                        } else {
                            for (let index = 0; index < evoPts; index++) {
                                EvoSelection.instance().addEvoPt(evoType);
                            }
                        }
                        if (i >= 12) settingDone = true; // Ustaw na true, jeśli pętla się wykona
                    }

                    return settingDone; // Zwróć settingDone
                }

                let settingArkEvoCounter = 0;
                async function autoArkanaEvo1x(name) {
                    if (settingArkEvoCounter >= 2) return true;

                    if (settingArkEvoCounter === 0) {
                        if (typeof resetAllArc !== 'undefined') {
                            resetAllArc();
                        }
                        if (typeof EvoSelection !== 'undefined') {
                            EvoSelection.instance().resetAllEvo();
                        }
                        settingArkEvoCounter = 1;
                    }
                    if (settingArkEvoCounter >= 1 && settingArkEvoCounter < 2) { // Poprawiony warunek
                        await setArkana(name);
                        await setEvo(name);
                        await set1x(name);
                        await setEquipment(name); //equipEq
                        // settingCounter++;
                    }
                    settingArkEvoCounter = 2;
                }

                async function plnCheckSet() {
                    let actions_cost = 0;
                    let plnOk = false;
                    const onetimeElement = document.getElementById("onetime");
                    const onetime_item = parseInt(onetimeElement?.value, 10);
                    let item1xHelper = 0;

                    if (onetimeElement) {
                        if ((onetime_item > 0 && onetime_item < 16) || onetime_item === 46) {
                            item1xHelper = 5000;
                        } else if ((onetime_item > 15 && onetime_item < 31) || onetime_item === 47) {
                            item1xHelper = 22500;
                        } else if ((onetime_item > 30 && onetime_item < 46) || onetime_item === 48) {
                            item1xHelper = 45000;
                        }
                    }

                    const karawanaEnabled = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} karawana`);
                    const karawanaSection = document.querySelector(".questKarawanaSection");

                    if (karawanaEnabled && karawanaSection) {
                        const questCount = parseInt(document.querySelector('.menu-content li.menu a[href="?a=quest"]')?.textContent.split(" · ")[1], 10);
                        const questItem = item1xHelper * (questCount - 1);

                        const questType = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} questType`);
                        const questCostElement = document.querySelector("form[name='questForm'] table tr:nth-child(" + (questType + 1) + ")");
                        const questCost = parseInt(questCostElement?.innerText.split(":")[1]?.split("PLN")[0]?.replace(/\s/g, "") || 0, 10);

                        actions_cost += questCost + questCost * (questCount - 1) * 1.75 + questItem;
                    }

                    const taxiCostElement = document.getElementById("taxiCost");
                    if (taxiCostElement) {
                        const taxiCost = parseInt(taxiCostElement.textContent.split(" PLN")[0], 10) || 0;
                        actions_cost += taxiCost;
                    }

                    actions_cost += item1xHelper;

                    if (bwCharacter.money < actions_cost) {
                        const key = accessKey;
                        const sellJunkAmount = Math.ceil((actions_cost - bwCharacter.money) / 20000);
                        if (sellJunkAmount < bwCharacter.junk) {
                            window.location.href = `?a=townshop&selljunk=${sellJunkAmount}&akey=${key}`;
                        } else {
                            GM.setValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} autoBw`, false);
                            setTimeout(() => {
                                window.location.reload();
                            }, 500);
                        }
                    } else {
                        plnOk = true;
                    }

                    return plnOk;
                }

                async function karawana_check() {
                    const karawanaSection = document.querySelector(".questKarawanaSection");
                    const karawana = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} karawana`) ?? false;
                    if (!karawanaSection || !karawana) return true;

                    let karawanaOk = false;
                    const questCount = parseInt(document.querySelector('.menu-content li.menu a[href="?a=quest"]')?.textContent.split(" · ")[1], 10);

                    const qKarawanaValue = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} questKarawana`);

                    if (qKarawanaValue === true) {
                        const questDispValue = parseInt(document.getElementById("questDisp")?.textContent, 10);
                        if (questDispValue < questCount) {
                            questForm.onMaxQuestAmmountClick();
                        } else {
                            karawanaOk = true;
                        }
                    }
                    return karawanaOk;
                }

                async function checkPropperQuest() {
                    const questType = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} questType`);
                    let questOk = false;
                    if (document.getElementsByName("questForm")[0]?.getElementsByClassName("radio")[questType].checked === true) {
                        questOk = true;
                    } else {
                        document.getElementsByName("questForm")[0]?.getElementsByClassName("radio")[questType].click();
                    }
                    return questOk;
                }

                async function autoQuest() {

                    const keyBase = `${bwCharacter.serverNumber} ${bwCharacter.nickName}`;
                    const eqQuest = await GM.getValue(`${keyBase} questEq`);
                    await equipEq(eqQuest);
                    const goQuestButton = document.getElementById("startQuest");

                    if (!goQuestButton) return;

                    setInterval(async () => {
                        const allSetted = await autoArkanaEvo1x('quest');
                        const karawanaSetted = await karawana_check();
                        const checkedQuest = await checkPropperQuest();
                        const plnOk = await plnCheckSet();

                        if (checkedQuest && karawanaSetted && allSetted && plnOk) {
                            goQuestButton.click();
                        }
                    }, 1000);
                }

                let targetCounter = 0;
                async function canTargetAtck() {

                    const percentDeclared = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} pvpAtkChance`) ?? 0;
                    const avaliableTargets = document.querySelectorAll(".playerRow:not(.hidden)");
                    const canStartAttack = playerData.canStartAttack;

                    if (!canStartAttack) {
                        if (bwCharacter.linkApi !== '?a=ambush') window.location.href = '?a=ambush';
                    } else {
                        if (bwCharacter.linkApi !== '?a=ambush&opt=atk') window.location.href = '?a=ambush&opt=atk';
                    }

                    if (targetCounter > 0) {
                        const targetName = document.querySelector('#confirmedTargetName')?.textContent.length > 0;
                        if (targetName) {
                            return true;
                        } else {
                            GM.setValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} pvpLater`, true);
                            window.location.reload();
                        }
                    }

                    if (targetCounter === 0) {
                        if (!avaliableTargets.length) targetCounter++;
                        for (let index = 0; index < avaliableTargets.length; index++) {
                            const targetHelper = avaliableTargets[index];
                            const targetPercent = targetHelper.querySelector(".attackPerc")?.innerText.slice(0, -2);
                            const targetWin = targetHelper.querySelector('img[alt="wygrana"]');
                            const targetDetected = targetHelper.querySelector('img[alt="zasadzka została wykryta"]');
                            if (parseInt(targetPercent, 10) >= parseInt(percentDeclared, 10) && (targetWin || targetDetected)) {
                                targetHelper.querySelector('.timeBallContainer img')?.click();
                                targetCounter++;
                                break;
                            }
                            if (index >= avaliableTargets.length - 1) targetCounter++;
                        }
                    }

                }

                async function autoPvp() {
                    const eqAtk = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} pvpEq`);
                    await equipEq(eqAtk);

                    if (!document.getElementById("submit2")) {
                        window.location.href = "?a=ambush&opt=atk";
                    }

                    const taxiMax = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} pvpTaxiMax`) ?? false;

                    const intervalId = setInterval(async () => {
                        const toggleTargetList = document.querySelector("#toggleTargetListVisibilityByAttack");
                        if (toggleTargetList && !toggleTargetList.checked) {
                            toggleTargetList.click();
                            attackController.onFilterNotPossibleToAttackClick();
                        }

                        const targetOk = await canTargetAtck();

                        const plnOk = await plnCheckSet();
                        if (targetOk) {
                            if (taxiMax) attackController.taxiClickMax();
                            const allSetted = await autoArkanaEvo1x('pvp');
                            if (plnOk && allSetted) {
                                clearInterval(intervalId);
                                document.getElementById("submit2")?.click();
                            }
                        }
                    }, 1000);
                }

                let inviteCounter = 0;
                async function inviteMembers(name) {

                    const membersInBox = document.querySelector('.inviteBoxPlayerList');
                    if (!membersInBox) return false;

                    const errorTxtInvited = "Zaktualizowano listę zaproszonych."

                    if (errorTxtInvited) {
                        return true;
                    }

                    if (inviteCounter === 0) {
                        // Tools.showElement($$('inviteBox'));
                        Expedition.onInviteListClick()
                        inviteCounter = 1;
                    }

                    if (inviteCounter === 1) {
                        await GM.setValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} ${name}InviteToday`, bwCharacter.day);
                        document.getElementsByName('updateInvites')[0]?.click();
                    }
                }

                async function difficultSet(name) {
                    const locationDiv = document.getElementById("locationName");
                    const numberText = name === 'kw' ? document.querySelectorAll('.star').length : parseInt(locationDiv.childNodes[1].textContent.trim()) || 1; // Pobierz tekst z węzła tekstowego (numer)

                    let diff;
                    if (name === 'exp') {
                        diff = parseInt(await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expDifficult`), 10) ?? 0;
                    } else if (name === 'kw') {
                        diff = parseInt(await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} kwDifficult`), 10) ?? 0;
                    }

                    const diffIs = parseInt(numberText, 10);
                    const right = document.querySelector('.rightArrow.swiper-button-next');
                    const left = document.querySelector('.leftArrow.swiper-button-next');

                    if (diffIs < 1) return 0;
                    if (diff - diffIs > 0) right?.click();
                    if (diff - diffIs < 0) left?.click();
                    if (diff - diffIs === 0) return true;
                }

                async function locationSet(name) {
                    let locationToSet;

                    if (name === 'exp') {
                        const lastLocValue = parseInt(document.getElementsByName('locsel')[16]?.value, 10);
                        locationToSet = parseInt(await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expLocationList`)) ?? 0;
                        if (lastLocValue < locationToSet) {
                            document.querySelector('img[alt="Przełącz mapę"]')?.click();
                        }
                    } else if (name === 'kw') {
                        locationToSet = parseInt(await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} kwLocationList`)) ?? 0;
                    }

                    const locationChecked = document.getElementById(`locsel${locationToSet}`);
                    if (locationChecked) {
                        if (!locationChecked.checked) {
                            locationChecked.click();
                        } else {
                            return true;
                        }
                    }

                    return false;
                }

                async function findPlaceToJoin(nick) {

                    const links = document.querySelectorAll('a[href^="?a=profile&uid="]:not(.clanOwner):not(.players)');
                    let findJoin = false;

                    if (!links || links.length === 0) return findJoin;

                    // Przykład: iteracja przez wszystkie znalezione linki
                    for (let i = 0; i < links.length; i++) {
                        const link = links[i];
                        // Sprawdź, czy uid jest zgodne z nickiem
                        if (link.textContent === nick) {
                            const checkbox = link.closest('tr').querySelector('input');
                            if (checkbox && !checkbox.checked) {
                                checkbox.click(); // Zaznacz checkbox
                                findJoin = true;
                                break; // Przerwij pętlę po kliknięciu
                            }
                        }
                    }
                    return findJoin; // Zwróć wynik
                }

                //łowy
                async function huntCheck() {
                    const huntCheckboxes = document.querySelector('#cevent-overslot-selection');
                    if (!huntCheckboxes) return true;
                    const huntRep = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} autoRep`);
                    const huntRepInput = document.getElementById('ceCostType1');
                    const huntPrem = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} autoPrem`);
                    const huntPremInput = document.getElementById('ceCostType2');
                    let huntFinish = false;
                    if (huntRep && huntRepInput) {
                        if (huntRepInput.checked) {
                            huntFinish = true;
                        } else {
                            huntRepInput.click();
                        }
                    }

                    if (huntPrem && huntPremInput) {
                        if (huntPremInput.checked) {
                            huntFinish = true;
                        } else {
                            huntPremInput.click();
                        }
                    }
                    return huntFinish;
                }

                const checkAndSetExpTodayLater = async (element, variableName) => {
                    if (element) {
                        const timeText = element.textContent; // Pobierz tekst
                        const regex = /(\d+)\s*godz\.\s*(\d+)\s*min\.\s*(\d+)\s*sek\./; // Wyrażenie regularne do wyodrębnienia czasu
                        const match = timeText.match(regex);

                        if (match) {
                            const hours = parseInt(match[1], 10);
                            const minutes = parseInt(match[2], 10);
                            const seconds = parseInt(match[3], 10);

                            // Oblicz całkowity czas w sekundach
                            const totalSeconds = hours * 3600 + minutes * 60 + seconds;

                            // Oblicz czas do północy
                            const now = new Date();
                            const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1); // Północ następnego dnia
                            const secondsUntilMidnight = Math.floor((midnight - now) / 1000);

                            // Sprawdź, czy czas do rozpoczęcia ekspedycji jest mniejszy niż czas do północy
                            if (totalSeconds < secondsUntilMidnight) {
                                await GM.setValue(variableName, true); // Ustaw zmienną
                                window.location.reload();
                            }
                        }
                    }
                };


                async function autoExp(name, join) {
                    const keyBase = `${bwCharacter.serverNumber} ${bwCharacter.nickName}`;
                
                    const timeElement = document.querySelector('td.same b:nth-of-type(1)');
                    const joinElement = document.querySelector('td.same b:nth-of-type(2)');
                
                    await checkAndSetExpTodayLater(timeElement, `${keyBase} ${name}TodayLater`);
                    await checkAndSetExpTodayLater(joinElement, `${keyBase} ${name}JoinLater`);
                
                    const expStartEq = await GM.getValue(`${keyBase} ${name}StartEq`);
                    await equipEq(expStartEq);
                
                    const expJoinLater = await GM.getValue(`${keyBase} ${name}JoinLater`);
                    const inviteToday = parseInt(await GM.getValue(`${keyBase} ${name}InviteToday`)) === bwCharacter.day;
                    const joinedToday = parseInt(await GM.getValue(`${keyBase} ${name}JoinToday`)) === bwCharacter.day;
                    const expStartToday = parseInt(await GM.getValue(`${keyBase} ${name}Today`)) === bwCharacter.day;
                
                    const expNameJoin = await GM.getValue(`${keyBase} ${name}Join`);
                
                    const errorTxt = document.querySelector('.auBid .error')?.textContent;
                    const inviteTxt = document.querySelector('.auBid .enabled')?.textContent;

                    if (inviteTxt === "Zaktualizowano listę zaproszonych.") {
                        await GM.setValue(`${keyBase} ${name}Today`, bwCharacter.day);
                        // location.reload();
                        window.location.href = "?a=main";
                        return;
                    }
                    
                    let expJcounter = 0;
                    const intervalId = setInterval(async () => {
                        if (errorTxt === "Poczekaj aż zakończy się Twoja aktualnie trwająca ekspedycja przed założeniem nowej.") {
                            window.location.href = name === "kw" ? "?a=swr" : "?a=cevent";
                            return;
                        }
                
                        const canStart = document.querySelector('.same b')?.innerText === "TERAZ";
                        const canJoin = document.querySelectorAll('.same b')[1]?.innerText === "TERAZ";
                
                        const joinedImage = document.querySelector('img[alt="Bierzesz udział w tej ekspedycji."]');
                        const joinedNoInviteImage = document.querySelector('img[alt="Twoje zgłoszenie oczekuje na akceptację założyciela ekspedycji."]');
                
                        if (joinedImage || joinedNoInviteImage) {
                            await GM.setValue(`${keyBase} ${name}JoinToday`, bwCharacter.day);
                        }
                
                        // 🔁 JOIN ekspedycji
                        if (join && canJoin && !joinedToday && !expJoinLater) {
                            if (expJcounter === 0 && await findPlaceToJoin(expNameJoin)) {
                                expJcounter = 1;
                            } else if (expJcounter === 0) {
                                await GM.setValue(`${keyBase} ${name}JoinLater`, true);
                                location.reload();
                            }
                
                            if (expJcounter === 1) {
                                const allSetted = await autoArkanaEvo1x(name);
                                const plnOk = await plnCheckSet();
                                if (plnOk && allSetted) expJcounter = 2;
                            }
                
                            if (expJcounter === 2) {
                                document.getElementById('joinEvent')?.click();
                            }
                        }
                
                        // 🛡️ START ekspedycji
                        if (canStart) {
                            const expLocationsList = document.querySelector('#cevent-location-selection');
                            const kwLocationsList = document.querySelector('.swr-location-selection');
                
                            if (expJcounter === 0 && (expLocationsList || kwLocationsList)) {
                                const huntRep = await huntCheck();
                                const loc = await locationSet(name);
                                const diff = await difficultSet(name);
                                if (loc && huntRep && diff) expJcounter = 1;
                            }
                
                            if (expJcounter === 1) {
                                const allSetted = await autoArkanaEvo1x(name);
                                const plnOk = await plnCheckSet();
                                if (plnOk && allSetted) expJcounter = 2;
                            }
                
                            if (expJcounter === 2) {
                                document.getElementById('startEvent')?.click();
                            }
                        }
                
                        // ✉️ INVITE jeśli jeszcze nie zaproszono i nie trwa
                        if (!canStart && !inviteToday && !expStartToday) {
                            Tools.toggleVisibility($$('inviteBox'));
                            setTimeout(()=>{
                                document.querySelector('[name="updateInvites"]')?.click();
                            }, 200);
                        }
                
                    }, 1000);
                }



                async function autoArena3(join) {
                    const keyBase = `${bwCharacter.serverNumber} ${bwCharacter.nickName}`;
                    const arena3StartEq = await GM.getValue(`${keyBase} arena3StartEq`);
                    await equipEq(arena3StartEq);
                
                    const arena3Join = await GM.getValue(`${keyBase} arena3Join`);
                    let arena3Counter = join ? 1 : 0;
                
                    const intervalId = setInterval(async () => {
                        const inviteImage = document.querySelector('img[alt="ZAPROŚ"]');
                        const joinedImage = document.querySelector('img[alt="Bierzesz udział w tej ekspedycji."]');
                        const joinedNoInviteImage = document.querySelector('img[alt="Twoje zgłoszenie oczekuje na akceptację założyciela ekspedycji."]');
                        const clanOwnerLink = document.querySelector('a.clanOwner');
                
                        // ✅ Jeśli już jesteś w drużynie lub jesteś jej właścicielem
                        if (
                            (clanOwnerLink && clanOwnerLink.textContent === bwCharacter.nickName) ||
                            joinedImage || joinedNoInviteImage
                        ) {
                            await GM.setValue(`${keyBase} arena3Today`, bwCharacter.day);
                            location.reload();
                            clearInterval(intervalId);
                            return;
                        }
                
                        // 🧩 Dołączenie do drużyny
                        if (join) {
                            if (arena3Counter === 0) {
                                const foundPlace = await findPlaceToJoin(arena3Join);
                                if (foundPlace) {
                                    arena3Counter = 1;
                                } else {
                                    await GM.setValue(`${keyBase} arena3JoinLater`, true);
                                    location.reload();
                                    clearInterval(intervalId);
                                    return;
                                }
                            }
                
                            if (arena3Counter === 1) {
                                const allSet = await autoArkanaEvo1x('arena3');
                                if (allSet) arena3Counter = 2;
                            }
                
                            if (arena3Counter === 2) {
                                document.getElementById("newTeam")?.click();
                                // ⛔️ jeśli tu pojawi się błąd – przeładuje stronę, więc nie musisz go sprawdzać dalej
                                document.getElementById("joinTeam")?.click();
                            }
                        }
                
                        // ✉️ ZAPROŚ jeśli widzisz przycisk
                        if (inviteImage) {
                            document.querySelector('[name="updateInvites"]')?.click();
                        }
                    }, 1000);
                }
                

                async function autoArenak() {
                    const keyBase = `${bwCharacter.serverNumber} ${bwCharacter.nickName}`;
                
                    const arenaCreated = document.querySelector('.clanArenaBasicInfo');
                    const isArenakPage = bwCharacter.linkApi.startsWith("?a=newarena&cat=3");
                
                    if (isArenakPage && !arenaCreated) {
                        await GM.setValue(`${keyBase} arenakJoinLater`, true);
                        return;
                    }
                
                    const errorTxt = document.querySelector('.auBid .error')?.textContent;
                    const errorTxtToCheck = 'Aby walczyć na arenie musisz należeć do klanu!';
                    if (errorTxt === errorTxtToCheck) {
                        await GM.setValue(`${keyBase} arenakToday`, bwCharacter.day);
                        return;
                    }
                
                    const arenakStartEq = await GM.getValue(`${keyBase} arenakStartEq`);
                    await equipEq(arenakStartEq);
                
                    // W razie potrzeby pokaż ukrytą sekcję z przyciskiem dołączenia
                    const ambJoin = document.querySelector('#amb_1_join');
                    if (ambJoin?.style.display === 'none') {
                        showJoin(1);
                    }
                
                    const joinArenaButton = document.querySelector("#joinClanArena");
                    const showJoinButton = document.querySelector('span.lnk.enabled[onclick="showJoin(1);"]');
                
                    let stage = 0;
                
                    const intervalId = setInterval(async () => {
                        // ✅ Arena już założona lub dołączono — zakończ
                        if (!joinArenaButton) {
                            await GM.setValue(`${keyBase} arenakToday`, bwCharacter.day);
                            location.reload();
                            clearInterval(intervalId);
                            return;
                        }
                
                        // 🔁 Ustawienia przed dołączeniem
                        if (showJoinButton && stage === 0) {
                            const allSet = await autoArkanaEvo1x('arenak');
                            const plnOk = await plnCheckSet();
                            if (allSet && plnOk) {
                                stage = 1;
                            }
                        }
                
                        // 🎯 Kliknij dołącz do walki
                        if (stage === 1) {
                            joinArenaButton.click();
                            clearInterval(intervalId);
                        }
                    }, 1000);
                }
                

                async function autoArena1() {
                    const eqArena = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arena1Eq`);
                    await equipEq(eqArena);

                    const intervalId = setInterval(async () => {
                        const doFightButton = document.getElementsByName("doFight")[0]; // Sprawdź ponownie przycisk w każdej iteracji

                        if (!doFightButton) {
                            await GM.setValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arena1Today`, bwCharacter.day);
                            window.location.reload();
                            clearInterval(intervalId); // Zatrzymaj interwał, jeśli przycisk nie istnieje
                        }

                        const allSetted = await autoArkanaEvo1x('arena1');
                        const plnOk = await plnCheckSet();

                        if (plnOk && allSetted) {
                            doFightButton.click(); // Odkomentuj, aby kliknąć przycisk walki
                            clearInterval(intervalId); // Zatrzymaj interwał po kliknięciu
                        }
                    }, 1000);
                }

                async function autoHunting() {
                    const huntingEq = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} huntEq`);
                    await equipEq(huntingEq);

                    const huntButton = document.querySelector('.hunt-button');
                    if (!huntButton) return;

                    const intervalId = setInterval(async function () {
                        const arcaneSelect = document.querySelector('.hunt-arcane-select');
                        if (!arcaneSelect) return;

                        const arcaneSelectHidden = arcaneSelect.classList.contains('hidden');
                        if (arcaneSelectHidden) {
                            huntButton.click();
                        } else {
                            const goHuntingButton = document.getElementById("goHunting");

                            const allSetted = await autoArkanaEvo1x('hunt');

                            if (allSetted) {
                                goHuntingButton.click();
                                clearInterval(intervalId);
                            }
                        }
                    }, 1000);
                }

                function navigateToPage(currentUrl, expectedUrl) {
                    if (!currentUrl.startsWith(expectedUrl)) {
                        window.location.href = expectedUrl;
                    }
                }

                async function autoJourney() {
                    const journeyEq = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} journeyEq`);
                    await equipEq(journeyEq);

                    async function journey_location_find() {
                        const rewardsHelper = ["", "EWOLUCJI", "Run", "ŁPC", "Srebrn", "REPUTACJ", "doświadczeni", "PLN", "krw", "ludzi"];
                        const location = parseInt(await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} journeyLocation`));
                        if (location > 0) return location;
                        const findReward1 = rewardsHelper[await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} journeyReward1`)] ?? false;
                        const findReward2 = rewardsHelper[await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} journeyReward2`)] ?? false;
                        const locationChoice = document.querySelector('.locationSelection:not(.hidden)');
                        const rewardsImg = document.querySelectorAll(".rewardImg");
                        let locationToCheck = 0;
                        if (locationChoice) {
                            locationToCheck = location;
                            if (findReward1 || findReward2) {
                                for (let index = 9; index > 0; index--) {
                                    const currentReward = rewardsImg[index - 1]?.getAttribute("alt");
                                    if (currentReward.search(findReward1) > 0 || currentReward.search(findReward2) > 0) {
                                        locationToCheck = index;
                                        break;
                                    }
                                }
                            }
                        } else {
                            const rewardsImg2 = document.querySelector('.swiper-slide.locationSlide:not(.hidden) .locationReward img')?.getAttribute("alt");
                            const locationChoosen = parseInt(document.querySelector('.swiper-slide.locationSlide:not(.hidden)')?.getAttribute('data-locationnr'));
                            if (rewardsImg2?.search(findReward1) > 0 || rewardsImg2?.search(findReward2) > 0) {
                                locationToCheck = locationChoosen;
                            }
                        }
                        return locationToCheck;
                    }

                    async function journey_location_set() {
                        let locationSetFinish = false;

                        const locationNr = await journey_location_find() ? await journey_location_find() : parseInt(document.querySelector("input:checked").value)

                        const locationChecked = document.getElementById(`location_form_${locationNr}`);
                        if (!locationChecked) return;

                        const locationNrFrame = !document.getElementById(`locationSlide_${locationNr}`).classList.contains('hidden');
                        if (locationNrFrame) locationSetFinish = true;

                        if (locationNr && !locationChecked.checked) {
                            locationChecked.click();
                        }
                        return locationSetFinish;
                    }

                    async function setDifficulty() {
                        let setDifficultyFinished = false;
                        const difficultLevelSet = parseInt(await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} journeyDifficult`)) ?? false;
                        const diffLvlIs = parseInt(document.getElementById('difficulty_label')?.textContent);
                        const difference = diffLvlIs - difficultLevelSet;
                        if (document.getElementById('difficulty_label')) {
                            for (let index = 0; index < Math.abs(difference); index++) {
                                difference > 0 ? JourneyStartController.instance().decreaseDifficultyLvl() : JourneyStartController.instance().increaseDifficultyLvl();
                            }
                        }
                        if (difference === 0) setDifficultyFinished = true;
                        return setDifficultyFinished;
                    }

                    function optionToChoose() {
                        const optionDescriptions = document.querySelectorAll(".optionDescription");
                        const option1Helper = optionDescriptions[0].innerText.split("/")[0].indexOf('-');
                        const option2Helper = optionDescriptions[1].innerText.split("/")[0].indexOf('-');
                        const optionBase1Helper = optionDescriptions[0].innerText.split("/")[1].indexOf('p');
                        const optionBase2Helper = optionDescriptions[1].innerText.split("/")[1].indexOf('p');

                        const option1Cost = parseInt(optionDescriptions[0].innerText.split("/")[0].slice(option1Helper + 1).replace(/\s/g, "")) ?? 0;
                        const option2Cost = parseInt(optionDescriptions[1].innerText.split("/")[0].slice(option2Helper + 1).replace(/\s/g, "")) ?? 0;

                        const option1Base = parseInt(optionDescriptions[0].innerText.split("/")[1]?.slice(0, optionBase1Helper).replace(/\s/g, "")) ?? 0;
                        const option2Base = parseInt(optionDescriptions[1].innerText.split("/")[1]?.slice(0, optionBase2Helper).replace(/\s/g, "")) ?? 0;

                        let result;
                        if (option1Cost > option2Cost) {
                            result = 2;
                        } else if (option1Cost < option2Cost) {
                            result = 1;
                        } else {
                            result = option1Base >= option2Base ? 2 : 1;
                        }
                        if (option1Cost === 0 && option2Cost === 0 && option1Base === 0 && option2Base === 0) result = 0;
                        return result;
                    }

                    function escape() {
                        const escapeButton = document.querySelector(".buttonMechaRedElastic[name='escapeJourney']:not([disabled])");
                        if (escapeButton) {
                            escapeButton.onclick = function () {
                                return true;
                            };
                            escapeButton.click();
                        }
                    }

                    function handleOptions() {
                        const specialAttack = document.querySelector(".buttonMechaRedElastic[name='useSpecialAttack']:not([disabled])");
                        specialAttack?.click();

                        const fightEnemy = document.getElementsByName('fightEnemy');
                        fightEnemy[0]?.click();

                        const baseStat = document.querySelector(".buttonMechaRedElastic[name='useBaseStat']:not([disabled])");
                        const additionalStat = document.querySelector(".buttonMechaRedElastic[name='useAdditionalStat']:not([disabled])");

                        const killButton = document.querySelector(".buttonMechaRedElastic[value='ZABIJ']:not([disabled])");
                        killButton?.click();

                        if (!baseStat && !additionalStat && !specialAttack) escape();
                        if (!baseStat) additionalStat?.click();
                        if (!additionalStat) baseStat?.click();
                        if (!specialAttack && !fightEnemy[0]) {
                            if (baseStat && !additionalStat) baseStat.click();
                            if (baseStat && additionalStat) {
                                if (optionToChoose() === 1) additionalStat.click();
                                else baseStat.click();
                            }
                        }
                    }

                    function startJourney() {
                        let startDone = false;
                        const startJourneyForm = document.getElementsByName('startJourney');
                        if (startJourneyForm.length > 0) {
                            startJourneyForm[0].onclick = () => {
                                startDone = true;
                                return true;
                            };
                            startJourneyForm[0]?.click();
                        }
                        if (document.querySelector('.journeyNodeProgress')) startDone = true;
                        return startDone;
                    }

                    let journeyCounter = 0;
                    setInterval(async () => {

                        const fightOrRest = document.querySelector('.journeyFightOrRest');
                        const fightOptions = document.querySelector('.fightOptions');
                        if (fightOrRest || fightOptions) {
                            handleOptions();
                        } else {
                            if (journeyCounter === 0) {
                                if (await journey_location_set()) {
                                    journeyCounter = 1;
                                }
                            }

                            if (journeyCounter === 1) {
                                if (await setDifficulty()) {
                                    journeyCounter = 2;
                                }
                            }

                            if (journeyCounter === 2) {
                                const okButton = document.querySelector('.switchToDifficultySelectionButton')?.classList.contains('hidden') ? true : JourneyStartController.instance().switchToDifficultySelection();

                                if (okButton) {
                                    journeyCounter = 3;
                                }
                            }
                            if (journeyCounter === 3) {
                                startJourney();
                            }

                        }
                    }, 1000);
                }


                async function checkAndStartKw(join, type) {
                    const keyBase = `${bwCharacter.serverNumber} ${bwCharacter.nickName}`;
                    const errorText = document.querySelector('.auBid .error')?.textContent;
                    const blockedError = 'Poczekaj aż zakończy się Twoja aktualnie trwająca ekspedycja przed założeniem nowej.';
                
                    const isKwPage = bwCharacter.linkApi.startsWith("?a=swr");
                    const isExpPage = bwCharacter.linkApi.startsWith("?a=cevent");
                
                    const redirect = (type, join) => {
                        const base = type === 'kw' ? "?a=swr" : "?a=cevent";
                        window.location.href = join ? base : `${base}&do=new`;
                    };
                
                    // 🔁 Jeśli inna wyprawa trwa – odśwież
                    if (errorText === blockedError) {
                        window.location.href = type === 'kw' ? "?a=swr" : "?a=cevent";
                        return;
                    }
                
                    if (type === 'kw') {
                        if (!isKwPage) {
                            redirect('kw', join);
                        } else {
                            await autoExp('kw', join);
                        }
                    } else if (type === 'exp') {
                        if (!isExpPage) {
                            redirect('exp', join);
                        } else {
                            const expStartToday = parseInt(await GM.getValue(`${keyBase} expToday`)) !== bwCharacter.day;
                            await autoExp('exp', join, expStartToday);
                        }
                    } else {
                        console.error(`❌ Nieznany typ wyprawy: "${type}"`);
                    }
                }
                
                (async function mainAutoGame() {
                    const keyBase = `${bwCharacter.serverNumber} ${bwCharacter.nickName}`;
                    let timer = await GM.getValue(`${keyBase} timer`);
                
                    // 🔁 Logowanie timera w interwale (pomoc debugowania)
                    setInterval(async () => {
                        let t = await GM.getValue(`${keyBase} timer`);
                        console.log('⏳ timer', t);
                    }, 1000);
                
                    // ⛔️ Jeśli timer aktywny – blokuj działania
                    if (timer >= 1 && !isNaN(timer)) return;
                
                    // 🎯 Zadania blokują resztę akcji
                    if (bwCharacter.task) {
                        await GM.setValue(`${keyBase} timer`, 10);
                        if (!bwCharacter.linkApi.startsWith("?a=tasks")) {
                            window.location.href = "?a=tasks";
                        }
                    }
                    await tasksCheckAndReward();
                
                    // ✅ Kolejność działań – ważna kolejność
                    if (await shouldDoJourney(bwCharacter)) {
                        await navigateToPage(bwCharacter.linkApi, "?a=journey");
                        await autoJourney();
                    } else if (await shouldDoHunt(bwCharacter)) {
                        await navigateToPage(bwCharacter.linkApi, "?a=hunt");
                        await autoHunting();
                    } else if (await shouldDoArena1(bwCharacter)) {
                        await navigateToPage(bwCharacter.linkApi, "?a=newarena&cat=1");
                        await autoArena1();
                    } else if (await shouldDoArena3(bwCharacter)) {
                        const arena3StartJoin = await GM.getValue(`${keyBase} arena3StartJoin`, false);
                        const url = arena3StartJoin ? "?a=newarena&cat=2&do=new" : "?a=newarena&cat=2";
                        await navigateToPage(bwCharacter.linkApi, url);
                        await autoArena3(arena3StartJoin);
                    } else if (await shouldDoArenaKlanowa(bwCharacter)) {
                        await navigateToPage(bwCharacter.linkApi, "?a=newarena&cat=3");
                        await autoArenak();
                    } else if (await shouldStartKw(bwCharacter)) {
                        await checkAndStartKw(false, 'kw');
                    } else if (await shouldJoinKw(bwCharacter)) {
                        await checkAndStartKw(true, 'kw');
                    } else if (await shouldStartExp(bwCharacter)) {
                        await checkAndStartKw(false, 'exp');
                    } else if (await shouldJoinExp(bwCharacter)) {
                        await checkAndStartKw(true, 'exp');
                    } else if (await shouldDoPvp(bwCharacter)) {
                        await autoPvp();
                    } else if (await shouldDoQuest(bwCharacter)) {
                        await navigateToPage(bwCharacter.linkApi, "?a=quest");
                        await autoQuest();
                    }
                })();
               
                async function shouldDoJourney() {
                    const enabled = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} journeyAuto`);
                    return enabled && bwCharacter.journey;
                }
                
                async function shouldDoArena1() {
                    const enabled = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arena1Auto`);
                    const isToday = parseInt(await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arena1Today`)) !== bwCharacter.day;
                    return enabled && isToday;
                }
                
                async function shouldDoQuest(bwCharacter) {
                    const questAuto = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} questAuto`);
                    const questLater = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} questLater`, false);
                    return questAuto && bwCharacter.quest > 0 && !questLater;
                }
                
                async function shouldDoPvp(bwCharacter) {
                    const pvpAuto = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} pvpAuto`);
                    const pvpLater = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} pvpLater`, false);
                    return pvpAuto && bwCharacter.attacks > 0 && !pvpLater;
                }
                
                
                async function shouldDoHunt(bwCharacter) {
                    const enabled = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} huntAuto`);
                    return enabled && bwCharacter.hunt;
                }
                

                async function shouldDoArena3(bwCharacter) {
                    const enabled = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arena3Auto`);
                    const day1 = parseInt(await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arena3StartJoinDay1`)) === bwCharacter.day;
                    const day2 = parseInt(await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arena3StartJoinDay2`)) === bwCharacter.day;
                    const today = parseInt(await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arena3Today`)) !== bwCharacter.day;
                    const later = !(await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arena3JoinLater`, false));
                
                    return enabled && (day1 || day2) && today && later;
                }
                
                async function shouldDoArenaKlanowa(bwCharacter) {
                    const enabled = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arenakAuto`);
                    const day1 = parseInt(await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arenakStartJoinDay1`)) === bwCharacter.day;
                    const today = parseInt(await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arenakToday`)) !== bwCharacter.day;
                    const joinLater = !(await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} arenakJoinLater`, false));
                    const after21 = !(bwCharacter.day === 0 && (bwCharacter.hour > 21 || (bwCharacter.hour === 21 && bwCharacter.min > 10)));
                
                    return enabled && day1 && today && joinLater && after21;
                }
                
                async function shouldStartExp(bwCharacter) {
                    const enabled = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expAutoStart`) ?? false;
                    const today = parseInt(await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expToday`)) !== bwCharacter.day;
                    const later = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expStartLater`, false);
                
                    const thursday = (bwCharacter.day === 4);
                    const thursdayCheckbox = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expThursdayStart`) ?? false;
                    const hourMinOk = await compareHourMin(`${bwCharacter.serverNumber} ${bwCharacter.nickName}`, 'expStartHour', 'expStartMin', bwCharacter);
                
                    return enabled && today && !later && (
                        (thursday && thursdayCheckbox && bwCharacter.hour === 20 && bwCharacter.minutes >= 35) ||
                        (!thursdayCheckbox && hourMinOk) ||
                        (!thursday && thursdayCheckbox && hourMinOk)
                    );
                }
                
                async function shouldJoinExp(bwCharacter) {
                    const join = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expJoin`, 0) !== '0';
                    const today = parseInt(await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expJoinToday`)) !== bwCharacter.day;
                    const later = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expJoinLater`, false);
                
                    const thursday = (bwCharacter.day === 4);
                    const thursdayCheckbox = await GM.getValue(`${bwCharacter.serverNumber} ${bwCharacter.nickName} expThursdayJoin`) ?? false;
                    const hourMinOk = await compareHourMin(`${bwCharacter.serverNumber} ${bwCharacter.nickName}`, 'expJoinHour', 'expJoinMin', bwCharacter);
                
                    return join && today && !later && (
                        (thursday && thursdayCheckbox && bwCharacter.hour === 20 && bwCharacter.minutes >= 35) ||
                        (!thursdayCheckbox && thursday && hourMinOk) ||
                        (!thursday && hourMinOk)
                    );
                }
                
                async function compareHourMin(keyBase, hourKey, minKey, bwCharacter) {
                    const h = parseInt(await GM.getValue(`${keyBase} ${hourKey}`, -1));
                    const m = parseInt(await GM.getValue(`${keyBase} ${minKey}`, -1));
                    if (h < 0 || m < 0) return false;
                    return bwCharacter.hour > h || (bwCharacter.hour === h && bwCharacter.minutes >= m);
                }
                
                async function shouldStartKw(bwCharacter) {
                    const keyBase = `${bwCharacter.serverNumber} ${bwCharacter.nickName}`;
                
                    const enabled = await GM.getValue(`${keyBase} kwAutoStart`) ?? false;
                    const today = parseInt(await GM.getValue(`${keyBase} kwToday`)) !== bwCharacter.day;
                
                    const thursday = (bwCharacter.day === 4);
                    const thursdayCheckbox = await GM.getValue(`${keyBase} kwThursdayStart`) ?? false;
                    const hourMinOk = await compareHourMin(keyBase, 'kwStartHour', 'kwStartMin', bwCharacter);
                
                    return enabled && today && (
                        (thursday && thursdayCheckbox && bwCharacter.hour === 20 && bwCharacter.minutes >= 35) ||
                        (!thursdayCheckbox && hourMinOk) ||
                        (!thursday && thursdayCheckbox && hourMinOk)
                    );
                }
                
                async function shouldJoinKw(bwCharacter) {
                    const keyBase = `${bwCharacter.serverNumber} ${bwCharacter.nickName}`;
                
                    const join = await GM.getValue(`${keyBase} kwJoin`, 0) !== '0';
                    const today = parseInt(await GM.getValue(`${keyBase} kwJoinToday`)) !== bwCharacter.day;
                    const later = await GM.getValue(`${keyBase} kwJoinLater`, false);
                
                    const thursday = (bwCharacter.day === 4);
                    const thursdayCheckbox = await GM.getValue(`${keyBase} kwThursdayJoin`) ?? false;
                    const hourMinOk = await compareHourMin(keyBase, 'kwJoinHour', 'kwJoinMin', bwCharacter);
                
                    return join && today && !later && (
                        (thursday && thursdayCheckbox && bwCharacter.hour === 20 && bwCharacter.minutes >= 35) ||
                        (!thursdayCheckbox && thursday && hourMinOk) ||
                        (!thursday && hourMinOk)
                    );
                }

            }
        })();
    } //retry link
}; // pdmod

document.addEventListener('DOMContentLoaded', pdBwMod());