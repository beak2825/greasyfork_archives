// ==UserScript==
// @name         Panel Herosów i Tytanów
// @namespace    https://greasyfork.org/users/1036645
// @version      1.80
// @description  Panel ilustrujący tajmery herosów z groove w postaci kolorowych obrazków
// @author       Mateoo
// @match        http*://*.margonem.pl
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461186/Panel%20Heros%C3%B3w%20i%20Tytan%C3%B3w.user.js
// @updateURL https://update.greasyfork.org/scripts/461186/Panel%20Heros%C3%B3w%20i%20Tytan%C3%B3w.meta.js
// ==/UserScript==

(Engine => {
    // Konfiguracja domyślna przycisków
    const defaultPosition = [3, 'bottom-left-additional'];

    const addWidgetToDefaultWidgetSet = function() {
        Engine.widgetManager.addKeyToDefaultWidgetSet(
            'heroskipanel',
            defaultPosition[0],
            defaultPosition[1],
            'Panel Herosów i Tytanów',
            'green',
            changeMenuState
        );
    };

    $('head').append('<style>' +
        '.main-buttons-container .widget-button .icon.heroskipanel {' +
        'background-image: url("https://i.imgur.com/nnb9tAe.png");' +
        'background-position: 0;' +
        '}' +
        '</style>'
    );

    const addWidgetButtons = Engine.widgetManager.addWidgetButtons;
    Engine.widgetManager.addWidgetButtons = function(additionalBarHide) {
        addWidgetButtons.call(Engine.widgetManager, additionalBarHide);
        addWidgetToDefaultWidgetSet();
        createButtonNI();

        Engine.widgetManager.addWidgetButtons = addWidgetButtons;
    };

    if (Engine.interfaceStart) {
        addWidgetToDefaultWidgetSet();
        createButtonNI();
    }

    function createButtonNI() {
        if (Engine.interfaceStart && Object.keys(Engine.widgetManager.getDefaultWidgetSet()).includes('heroskipanel')) {
            let heroskipanelPos = defaultPosition;

            const serverStoragePos = Engine.serverStorage.get(Engine.widgetManager.getPathToHotWidgetVersion());
            if (serverStoragePos && serverStoragePos.heroskipanel) heroskipanelPos = serverStoragePos.heroskipanel;

            Engine.widgetManager.createOneWidget('heroskipanel', { heroskipanel: heroskipanelPos }, true, []);
            Engine.widgetManager.setEnableDraggingButtonsWidget(false);
        } else setTimeout(createButtonNI, 500);
    }

    // Główne menu i stylizacja
    const menu = document.createElement("div");
    const menueve = document.createElement("div");
	const menutyt = document.createElement("div");

    const changeMenuState = function() {
        menu.style["display"] = menu.style["display"] === "block" ? "none" : "block";
        menueve.style["display"] = "none";
        menutyt.style["display"] = "none";
    };

    menu.id = "dodawanie_menu";
    menu.style.cssText = "position:absolute;top:6%;left:82.5%;width:17%;height:87%;background-color: rgba(108, 114, 115, 0.3);color:#0d3a6b;border-style:solid;border-width:1.5px;border-color:#098491;border-radius:16px;opacity:0.9;font-size:20px;font-family:Comic Sans MS;z-index:999;display:none;";

    menueve.id = "herosyeve_menu";
    menueve.style.cssText = "position:absolute;top:6%;left:82.5%;width:17%;height:87%;background-color: rgba(108, 114, 115, 0.3);color:#0d3a6b;border-style:solid;border-width:1.5px;border-color:#098491;border-radius:16px;opacity:0.9;font-size:20px;font-family:Comic Sans MS;z-index:999;display:none;";

    menutyt.id = "tytany_menu";
    menutyt.style.cssText = "position:absolute;top:6%;left:82.5%;width:17%;height:87%;background-color: rgba(108, 114, 115, 0.3);color:#0d3a6b;border-style:solid;border-width:1.5px;border-color:#098491;border-radius:16px;opacity:0.9;font-size:20px;font-family:Comic Sans MS;z-index:999;display:none;";

    // Funkcja generująca elementy
    function createHeroElement(hero, container, position) {
        const heroDiv = document.createElement("div");
        heroDiv.id = hero.id;
        heroDiv.style.cssText = `
            position:absolute;
            top:${position.top}%;
            left:${position.left}%;
            width:23%;
            height:15%;
            text-align:center;
            background-color:#24803c;
            border-radius:4px;
            border:1px solid black;`;

        const heroTitle = document.createElement("h3");
        heroTitle.innerText = hero.name;
        heroTitle.style.cssText = "font-size:10px;color:#fff;font-weight:bold;text-shadow:1px 1px #0a0909;";
        heroDiv.appendChild(heroTitle);

        const heroImg = document.createElement("img");
        heroImg.src = hero.img;
        heroImg.style.cssText = "max-width:60%;max-height:60%;margin-top:2%;";
        heroDiv.appendChild(heroImg);

         // Tworzenie miejsca na innerText (timer)
        const timerText = document.createElement("div");
        timerText.id = `${hero.id}Podpis`;
        timerText.style.cssText = "font-size:10px;color:red;text-shadow:1px 1px #0a0909;";
        heroDiv.appendChild(timerText);

        container.appendChild(heroDiv);
    }

    // Lista herosów i ich pozycji
    const heroes = [
        { id: "pat", name: "Mroczny Patryk", img: "https://micc.garmory-cdn.cloud/obrazki/npc/her/bardzozlypatryk.gif", position: { top: 1, left: 1 } },
        { id: "karm", name: "Karmazynowy Mściciel", img: "https://micc.garmory-cdn.cloud/obrazki/npc/her/gnom_msciciel.gif", position: { top: 1, left: 25 } },
        { id: "zlod", name: "Złodziej", img: "https://micc.garmory-cdn.cloud/obrazki/npc/her/zlodziej.gif", position: { top: 1, left: 49 } },
        { id: "przew", name: "Zły Przewodnik", img: "https://micc.garmory-cdn.cloud/obrazki/npc/her/mnich-zly2.gif", position: { top: 1, left: 73 } },
        { id: "opek", name: "Opętany Paladyn", img: "https://micc.garmory-cdn.cloud/obrazki/npc/her/opetanypaladyn02.gif", position: { top: 17, left: 1 } },
        { id: "kost", name: "Piekielny Kościej", img: "https://micc.garmory-cdn.cloud/obrazki/npc/her/piekielny_kosciej.gif", position: { top: 17, left: 25 } },
        { id: "kozi", name: "Koziec Mąciciel Ścieżek", img: "https://micc.garmory-cdn.cloud/obrazki/npc/her/koziec_maciciel_sciezek.gif", position: { top: 17, left: 49 } },
        { id: "koch", name: "Kochanka Nocy", img: "https://micc.garmory-cdn.cloud/obrazki/npc/her/kochanka-nocy.gif", position: { top: 17, left: 73 } },
        { id: "kasi", name: "Książe Kasim", img: "https://micc.garmory-cdn.cloud/obrazki/npc/her/ksiaze-kasim.gif", position: { top: 33, left: 1 } },
        { id: "brat", name: "Święty Braciszek", img: "https://micc.garmory-cdn.cloud/obrazki/npc/her/sw_braciszek.gif", position: { top: 33, left: 25 } },
        { id: "roger", name: "Złoty Roger", img: "https://micc.garmory-cdn.cloud/obrazki/npc/her/szkielet_pirata.gif", position: { top: 33, left: 49 } },
        { id: "bacaa", name: "Baca Bez Łowiec", img: "https://micc.garmory-cdn.cloud/obrazki/npc/her/baca-bez-lowiec.gif", position: { top: 33, left: 73 } },
        { id: "ata", name: "Czarująca Atalia", img: "https://micc.garmory-cdn.cloud/obrazki/npc/her/tri_atalia.gif", position: { top: 49, left: 1 } },
        { id: "oblo", name: "Obłąkany Łowca Orków", img: "https://micc.garmory-cdn.cloud/obrazki/npc/her/oblakany_ac1dae9d.gif", position: { top: 49, left: 25 } },
        { id: "lichw", name: "Lichwiarz Grauhaz", img: "https://micc.garmory-cdn.cloud/obrazki/npc/her/heros_129xd.gif", position: { top: 49, left: 49 } },
        { id: "viv", name: "Viviana Nandin", img: "https://micc.garmory-cdn.cloud/obrazki/npc/her/viv_nandin_i3bd1.gif", position: { top: 49, left: 73 } },
        { id: "przeraza", name: "Przeraza", img: "https://micc.garmory-cdn.cloud/obrazki/npc/her/przeraza.gif", position: { top: 65, left: 1 } },
        { id: "dem", name: "Demonis Pan Nicości", img: "https://micc.garmory-cdn.cloud/obrazki/npc/her/sekta_demon_cz_s.gif", position: { top: 65, left: 25 } },
        { id: "mulh", name: "Mulher Ma", img: "https://micc.garmory-cdn.cloud/obrazki/npc/her/mulher_ma.gif", position: { top: 65, left: 49 } },
        { id: "vap", name: "Vapor Veneno", img: "https://micc.garmory-cdn.cloud/obrazki/npc/her/joziniec_bagienny.gif", position: { top: 65, left: 73 } },
        { id: "debo", name: "Dęborożec", img: "https://micc.garmory-cdn.cloud/obrazki/npc/her/zwierz_kniei.gif", position: { top: 81, left: 1 } },
        { id: "tep", name: "Tepeyollotl", img: "https://micc.garmory-cdn.cloud/obrazki/npc/her/tep_35ecb966.gif", position: { top: 81, left: 25 } },
        { id: "nego", name: "Negthotep Czarny Kapłan", img: "https://micc.garmory-cdn.cloud/obrazki/npc/her/negthotep.gif", position: { top: 81, left: 49 } },
        { id: "smo", name: "Młody Smok", img: "https://micc.garmory-cdn.cloud/obrazki/npc/her/smokbarb.gif", position: { top: 81, left: 73 } },
    ];

    heroes.forEach(hero => createHeroElement(hero, menu, hero.position));

// Przycisk odświeżania dla Panelu Herosów
const refreshButton = document.createElement("button");
refreshButton.innerHTML = "<img src='https://i.imgur.com/0igjW7J.png' width='15px' height='15px' alt='Odśwież' />";
refreshButton.style.cssText = "position:absolute;bottom:2px;left:75%;width:auto;height:30px;background-color:#21b865;color:#fff;border-radius:5px;";
refreshButton.style.cssText += "transition: background-color 0.3s ease-in-out;";
refreshButton.addEventListener("mouseenter", function() {
    refreshButton.style.backgroundColor = "#66afe9";
});
refreshButton.addEventListener("mouseleave", function() {
    refreshButton.style.backgroundColor = "#21b865";
});

refreshButton.onclick = () => {
    console.log("Odświeżono Panel Herosów");

    let respTimersArray = [
        ["domina ecclesiae", "domina", 20, 60],
        ["mietek żul", "mietek", 10, 30],
        ["mroczny patryk", "pat", 45, 135],
        ["karmazynowy mściciel", "karm", 45, 135],
        ["złodziej", "zlod", 45, 135],
        ["zły przewodnik", "przew", 55, 165],
        ["piekielny kościej", "kost", 55, 165],
        ["opętany paladyn", "opek", 55, 165],
        ["koziec maciciel sciezek", "kozi", 55, 165],
        ["kochanka nocy", "koch", 55, 165],
        ["ksiaze kasim", "kasi", 60, 180],
        ["święty braciszek", "brat", 60, 180],
        ["zloty roger", "roger", 60, 180],
        ["baca bez łowiec", "bacaa", 60, 180],
        ["czarująca atalia", "ata", 63, 197],
        ["obłąkany łowca orków", "oblo", 65, 195],
        ["lichwiarz grauhaz", "lichw", 60, 180],
        ["viviana nandin", "viv", 70, 210],
        ["przeraza", "przeraza", 70, 210],
        ["demonis pan nicości", "dem", 70, 210],
        ["mulher ma", "mulh", 70, 210],
        ["vapor veneno", "vap", 80, 240],
        ["dęborożec", "debo", 80, 240],
        ["tepeyollotl", "tep", 80, 240],
        ["negthotep czarny kaplan", "nego", 80, 240],
        ["młody smok", "smo", 85, 260]
    ];

    let arrayTimers = document.getElementsByClassName("cll-timer");

    for (let i = 0; i < arrayTimers.length; i++) {
        if (!arrayTimers[i].dataset.tip.includes("Dodany przez")) {
            let timerText = arrayTimers[i].firstElementChild.innerText.toLowerCase().trim();
            // Szukamy indeksu w tabeli
            let matchIndex = respTimersArray.findIndex(arr => arr[0].toLowerCase().trim() === timerText);

            if (matchIndex !== -1) {
                let firstIndex = matchIndex;
                if (arrayTimers[i].firstElementChild.style.color.includes("rgb")) {
                    document.getElementById(respTimersArray[firstIndex][1]).style.backgroundColor = '#ccc372';
                    document.getElementById(respTimersArray[firstIndex][1]).children[2].innerText = arrayTimers[i].children[1].innerText;
                } else {
                    document.getElementById(respTimersArray[firstIndex][1]).style.backgroundColor = '#cf616a';
                }
            } else {
                console.log("Nie znaleziono dopasowania dla: ", timerText); // Debugowanie - brak dopasowania
            }
        }
    }
};

menu.appendChild(refreshButton);




    // Dodanie herosów eventowych do Panelu Eventowego
    const eventHeroes = [
        { id: "roga", name: "Rogoglowy Anthony (62)", img: "https://micc.garmory-cdn.cloud/obrazki/npc/hev/h25-h1-anthony.gif", position: { top: 1, left: 1 } },
        { id: "czte", name: "Czteroreka Sophia (120)", img: "https://micc.garmory-cdn.cloud/obrazki/npc/hev/h25-h2-sophia.gif", position: { top: 1, left: 25 } },
        { id: "jedn", name: "Jednoreki Noah (164)", img: "https://micc.garmory-cdn.cloud/obrazki/npc/hev/h25-h3-noah.gif", position: { top: 1, left: 49 } },
        { id: "dwug", name: "Dwuglowa Charlotte (202)", img: "https://micc.garmory-cdn.cloud/obrazki/npc/hev/h25-h4-charlotte.gif", position:  { top: 1, left: 73 } },
        // Dodaj więcej eventowych herosów według potrzeb
    ];
 eventHeroes.forEach(hero => {
    const heroDiv = document.createElement("div");
    heroDiv.id = hero.id;
    heroDiv.style.cssText = `position:absolute;
                            top:${hero.position.top}%;
                            left:${hero.position.left}%;
                            width:23%;
                            height:15%;
                            text-align:center;
                            background-color:#24803c;
                            border-radius:4px;
                            border:1px solid black;`;

    const heroTitle = document.createElement("h3");
    heroTitle.innerText = hero.name;
    heroTitle.style.cssText = "font-size:10px;color:#fff;font-weight:bold;text-shadow:1px 1px #0a0909;";
    heroDiv.appendChild(heroTitle);

    const heroImg = document.createElement("img");
    heroImg.src = hero.img;
    heroImg.style.cssText = "max-width:40%;max-height:40%;margin-top:2%;";
    heroDiv.appendChild(heroImg);

	// Tworzenie miejsca na innerText (timer)
    const timerText = document.createElement("div");
    timerText.id = `${hero.id}Podpis`;
    timerText.style.cssText = "font-size:10px;color:red;text-shadow:1px 1px #0a0909;";
    heroDiv.appendChild(timerText);

    menueve.appendChild(heroDiv);
});

    // Przycisk odświeżania dla Panelu Eventowego
    const refreshEventButton = document.createElement("button");
   refreshEventButton.innerHTML = "<img src='https://i.imgur.com/0igjW7J.png' width='15px' height='15px' alt='Odśwież' />";
refreshEventButton.style.cssText = "position:absolute;bottom:2px;left:75%;width:auto;height:30px;background-color:#21b865;color:#fff;border-radius:5px;";
refreshEventButton.style.cssText += "transition: background-color 0.3s ease-in-out;";
refreshEventButton.addEventListener("mouseenter", function() {
    refreshEventButton.style.backgroundColor = "#66afe9";
});
refreshEventButton.addEventListener("mouseleave", function() {
    refreshEventButton.style.backgroundColor = "#21b865";
});

    refreshEventButton.onclick = () => {
        console.log("Odświeżono Panel Eventowy");
         let respTimerseveArray = [
             ["Rogoglowy Anthony", "roga", 10, 30],
             ["Czteroreka Sophia", "czte", 24, 75],
             ["Jednoreki Noah", "jedn", 24, 75],
             ["Dwuglowa Charlotte", "dwug", 24, 75],
         ];

    let arrayTimers = document.getElementsByClassName("cll-timer");

    for (let i = 0; i < arrayTimers.length; i++) {
        if (!arrayTimers[i].dataset.tip.includes("Dodany przez")) {
            let timerText = arrayTimers[i].firstElementChild.innerText.toLowerCase().trim();
            console.log("Sprawdzam timer: ", timerText); // Debugowanie - tekst timera

            // Szukamy indeksu w tabeli
            let matchIndex = respTimerseveArray.findIndex(arr => arr[0].toLowerCase().trim() === timerText);
            console.log("Indeks dopasowanego herosa: ", matchIndex); // Debugowanie - znaleziony indeks

            if (matchIndex !== -1) {
                let firstIndex = matchIndex;
                if (arrayTimers[i].firstElementChild.style.color.includes("rgb")) {
                    document.getElementById(respTimerseveArray[firstIndex][1]).style.backgroundColor = '#ccc372';
                    document.getElementById(respTimerseveArray[firstIndex][1]).children[2].innerText = arrayTimers[i].children[1].innerText;
                } else {
                    document.getElementById(respTimerseveArray[firstIndex][1]).style.backgroundColor = '#cf616a';
                }
            } else {
                console.log("Nie znaleziono dopasowania dla: ", timerText); // Debugowanie - brak dopasowania
            }
        }
    }
};

menueve.appendChild(refreshEventButton);



// Dodanie tytanoww do Panelu Tytanow
    const tytanHeroes = [
        { id: "orla", name: "Dziewicza Orlica", img: "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/dziewicza_orlica.gif", position: { top: 1, left: 1 } },
        { id: "kic", name: "Zabójczy Królik", img: "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/zabojczy_krolik.gif", position: { top: 1, left: 25 } },
        { id: "rene", name: "Renegat Baulus", img: "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/titanbandit.gif", position: { top: 1, left: 49 } },
         { id: "arcy", name: "Piekielny Arcymag", img: "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/archdemon.gif", position: { top: 1, left: 73 } },
         { id: "zons", name: "Versus Zoons", img: "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/titangoblin.gif", position: { top: 17, left: 1 } },
         { id: "łowka", name: "Łowczyni Wspomnień", img: "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/lowcz-wspo-driady.gif", position: { top: 17, left: 25 } },
         { id: "przyz", name: "Przyzywacz Demonów", img: "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/przyz_demon_sekta.gif", position: { top: 17, left: 49 } },
         { id: "magu", name: "Maddok Magua", img: "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/maddok-tytan.gif", position: { top: 17, left: 73 } },
         { id: "tez", name: "Tezcatlipoca", img: "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/tezcatlipoca.gif", position: { top: 33, left: 1 } },
         { id: "barb", name: "Barbatos Smoczy Strażnik", img: "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/hebrehoth_smokoludzie.gif", position: { top: 33, left: 25 } },
         { id: "thh", name: "Tanroth", img: "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/ice_king.gif", position: { top: 33, left: 49 } },
        // Dodaj więcej tytanow według potrzeb
    ];
 tytanHeroes.forEach(hero => {
    const heroDiv = document.createElement("div");
    heroDiv.id = hero.id;
    heroDiv.style.cssText = `position:absolute;
                            top:${hero.position.top}%;
                            left:${hero.position.left}%;
                            width:23%;
                            height:15%;
                            text-align:center;
                            background-color:#24803c;
                            border-radius:4px;
                            border:1px solid black;`;

    const heroTitle = document.createElement("h3");
    heroTitle.innerText = hero.name;
    heroTitle.style.cssText = "font-size:10px;color:#fff;font-weight:bold;text-shadow:1px 1px #0a0909;";
    heroDiv.appendChild(heroTitle);

    const heroImg = document.createElement("img");
    heroImg.src = hero.img;
    heroImg.style.cssText = "max-width:60%;max-height:60%;margin-top:2%;";
    heroDiv.appendChild(heroImg);

	// Tworzenie miejsca na innerText (timer)
    const timerText = document.createElement("div");
    timerText.id = `${hero.id}Podpis`;
    timerText.style.cssText = "font-size:10px;color:red;text-shadow:1px 1px #0a0909;";
    heroDiv.appendChild(timerText);

    menutyt.appendChild(heroDiv);
});

  // Przycisk odświeżania dla Panelu Tytanow
    const refreshTytanButton = document.createElement("button");
    refreshTytanButton.innerHTML = "<img src='https://i.imgur.com/0igjW7J.png' width='15px' height='15px' alt='Odśwież' />";
    refreshTytanButton.style.cssText = "position:absolute;bottom:2px;left:75%;width:auto;height:30px;background-color:#21b865;color:#fff;border-radius:5px;";
    refreshTytanButton.style.cssText += "transition: background-color 0.3s ease-in-out;";
    refreshTytanButton.addEventListener("mouseenter", function() {
        refreshTytanButton.style.backgroundColor = "#66afe9";
    });
    refreshTytanButton.addEventListener("mouseleave", function() {
        refreshTytanButton.style.backgroundColor = "#21b865";
    });

    refreshTytanButton.onclick = () => {
        console.log("Odświeżono Panel tytanowy");
         let respTimerstytArray = [
             ["dziewicza orlica", "orla", 20, 60],
             ["zabójczy królik", "kic", 10, 30],
             ["renegat baulus", "rene", 45, 135],
             ["piekielny arcymag", "arcy", 45, 135],
             ["versus zoons", "zons", 45, 135],
             ["łowczyni wspomnień", "łowka", 55, 165],
             ["przyzywacz demonów", "przyz", 55, 165],
             ["maddok magua", "magu", 55, 165],
             ["tezcatlipoca", "tez", 55, 165],
             ["barbatos smoczy straznik", "barb", 55, 165],
             ["tanroth", "thh", 60, 180]
         ];

    let arrayTimers = document.getElementsByClassName("cll-timer");

    for (let i = 0; i < arrayTimers.length; i++) {
        if (!arrayTimers[i].dataset.tip.includes("Dodany przez")) {
            let timerText = arrayTimers[i].firstElementChild.innerText.toLowerCase().trim();
            console.log("Sprawdzam timer: ", timerText); // Debugowanie - tekst timera

            // Szukamy indeksu w tabeli
            let matchIndex = respTimerstytArray.findIndex(arr => arr[0].toLowerCase().trim() === timerText);
            console.log("Indeks dopasowanego herosa: ", matchIndex); // Debugowanie - znaleziony indeks

            if (matchIndex !== -1) {
                let firstIndex = matchIndex;
                if (arrayTimers[i].firstElementChild.style.color.includes("rgb")) {
                    document.getElementById(respTimerstytArray[firstIndex][1]).style.backgroundColor = '#ccc372';
                    document.getElementById(respTimerstytArray[firstIndex][1]).children[2].innerText = arrayTimers[i].children[1].innerText;
                } else {
                    document.getElementById(respTimerstytArray[firstIndex][1]).style.backgroundColor = '#cf616a';
                }
            } else {
                console.log("Nie znaleziono dopasowania dla: ", timerText); // Debugowanie - brak dopasowania
            }
        }
    }
};

menutyt.appendChild(refreshTytanButton);



    // Przyciski przełączania
    const switchToEventButton = document.createElement("button");
    switchToEventButton.innerText = "Eventowe";
    switchToEventButton.style.cssText = "position:absolute;bottom:2px;left:25%;width:23%;height:30px;background-color:#608aafbd;color:#fff;border-radius:5px;";
    switchToEventButton.onclick = () => {
        menu.style.display = "none";
        menueve.style.display = "block";
    };
    menu.appendChild(switchToEventButton);

     const switchToHeroesButtonHeroes = document.createElement("button");
   switchToHeroesButtonHeroes.innerText = "Herosy";
   switchToHeroesButtonHeroes.style.cssText = "position:absolute;bottom:2px;left:1%;width:23%;height:30px;background-color:#bf475ebd;color:#fff;border-radius:5px;";
    switchToHeroesButtonHeroes.onclick = () => {
        menu.style.display = "none";
        menueve.style.display = "none";
    };
    menu.appendChild(switchToHeroesButtonHeroes);

     const switchToEventButtonEvent = document.createElement("button");
    switchToEventButtonEvent.innerText = "Eventowe";
    switchToEventButtonEvent.style.cssText = "position:absolute;bottom:2px;left:25%;width:23%;height:30px;background-color:#bf475ebd;color:#fff;border-radius:5px;";
    switchToEventButtonEvent.onclick = () => {
        menu.style.display = "none";
        menueve.style.display = "none";
    };
    menueve.appendChild(switchToEventButtonEvent);

   const switchToTytantButtonEvent = document.createElement("button");
    switchToTytantButtonEvent.innerText = "Tytany";
    switchToTytantButtonEvent.style.cssText = "position:absolute;bottom:2px;left:49%;width:23%;height:30px;background-color:#608aafbd;color:#fff;border-radius:5px;";
    switchToTytantButtonEvent.onclick = () => {
        menueve.style.display = "none";
        menutyt.style.display = "block";
    };
    menueve.appendChild(switchToTytantButtonEvent);

    const switchToHeroesButton = document.createElement("button");
    switchToHeroesButton.innerText = "Herosy";
    switchToHeroesButton.style.cssText = "position:absolute;bottom:2px;left:1%;width:23%;height:30px;background-color:#608aafbd;color:#fff;border-radius:5px;";
    switchToHeroesButton.onclick = () => {
        menueve.style.display = "none";
        menu.style.display = "block";
    };
    menueve.appendChild(switchToHeroesButton);

	const switchToTytanButton = document.createElement("button");
    switchToTytanButton.innerText = "Tytany";
    switchToTytanButton.style.cssText = "position:absolute;bottom:2px;left:49%;width:23%;height:30px;background-color:#608aafbd;color:#fff;border-radius:5px;";
    switchToTytanButton.onclick = () => {
        menu.style.display = "none";
		menutyt.style.display = "block";
    };
    menu.appendChild(switchToTytanButton);

    const switchToHeroesButtonFromTyt = document.createElement("button");
    switchToHeroesButtonFromTyt.innerText = "Herosy";
    switchToHeroesButtonFromTyt.style.cssText = "position:absolute;bottom:2px;left:1%;width:23%;height:30px;background-color:#608aafbd;color:#fff;border-radius:5px;";
    switchToHeroesButtonFromTyt.onclick = () => {
        menu.style.display = "block";
		menutyt.style.display = "none";
    };
    menutyt.appendChild(switchToHeroesButtonFromTyt);

    const switchToEventButtonTytan = document.createElement("button");
    switchToEventButtonTytan.innerText = "Eventowe";
    switchToEventButtonTytan.style.cssText = "position:absolute;bottom:2px;left:25%;width:23%;height:30px;background-color:#608aafbd;color:#fff;border-radius:5px;";
    switchToEventButtonTytan.onclick = () => {
        menueve.style.display = "block";
        menutyt.style.display = "none";
    };
    menutyt.appendChild(switchToEventButtonTytan);

const switchToTytantButtonTytan = document.createElement("button");
    switchToTytantButtonTytan.innerText = "Tytany";
    switchToTytantButtonTytan.style.cssText = "position:absolute;bottom:2px;left:49%;width:23%;height:30px;background-color:#bf475ebd;color:#fff;border-radius:5px;";
    switchToTytantButtonTytan.onclick = () => {
        menueve.style.display = "none";
        menutyt.style.display = "none";
    };
    menutyt.appendChild(switchToTytantButtonTytan);

document.addEventListener("keydown", function(event) {
      if (event.key.toLowerCase() === "h" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName) && document.activeElement.getAttribute("contenteditable") !== "true") {
        let menu = document.getElementById("dodawanie_menu");
        if (menu) {
            menu.style.display = (menu.style.display === "none" || menu.style.display === "") ? "block" : "none";
            menueve.style["display"] = "none";
            menutyt.style["display"] = "none";
        }
    }
});


    document.querySelector(".game-window-positioner").appendChild(menu);
    document.querySelector(".game-window-positioner").appendChild(menueve);
	document.querySelector(".game-window-positioner").appendChild(menutyt);

    $("#dodawanie_menu").draggable();
    $("#herosyeve_menu").draggable();
	$("#tytany_menu").draggable();

})(window.Engine);
