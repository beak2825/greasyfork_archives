// ==UserScript==
// @name         GC - The Golden Dubloon Selector
// @namespace    https://www.grundos.cafe/
// @version      1.2
// @description  Automatically selects The Golden Dubloon food sequence (starter, main course, dessert, cocktail) that interests you
// @author       Teffy
// @match        https://www.grundos.cafe/pirates/restaurant/*
// @match        www.grundos.cafe/pirates/restaurant/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493659/GC%20-%20The%20Golden%20Dubloon%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/493659/GC%20-%20The%20Golden%20Dubloon%20Selector.meta.js
// ==/UserScript==
 
const getQueryParam = (name) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
};
 
const menuItems = {
    starters: {
        DoubleStuffedGuppy: document.querySelector('[data-key="15701"]'), // 5 dubloons
        CrustyClamSurprise: document.querySelector('[data-key="15702"]'), // 3 dubloons
        TropicalBreeze: document.querySelector('[data-key="15703"]'), // 1 dubloon
        OysterObsession: document.querySelector('[data-key="15704"]'), // 2 dubloons
        TomatoCannonBall: document.querySelector('[data-key="15705"]'), // 2 dubloons
        ShiverMeShrimp: document.querySelector('[data-key="15706"]'), // 3 dubloons
        CaesarSalad: document.querySelector('[data-key="15707"]') // 1 dubloon
    },
    mainCourses: {
        BabyBloater: document.querySelector('[data-key="15731"]'), // 3 dubloons
        HeadlessHorsefish: document.querySelector('[data-key="15732"]'), // 5 dubloons
        SlitheringSquidSurprise: document.querySelector('[data-key="15733"]'), // 3 dubloons
        BarnacleBillsBeltBustingBurger: document.querySelector('[data-key="15734"]'), // 4 dubloons
        BilgeRatMadeira: document.querySelector('[data-key="15735"]'), // 4 dubloons
        LorettaFontainesPerfectPizza: document.querySelector('[data-key="15736"]'), // 5 dubloons
        CapnThreelegsCutlassCrusade: document.querySelector('[data-key="15737"]'), // 9 dubloons
        OurFamousKrawkPie: document.querySelector('[data-key="15738"]') // 5 dubloons
    },
    desserts: {
        PinannaParadise: document.querySelector('[data-key="15723"]'), // 4 dubloons
        BlueberryAndOysterIceCream: document.querySelector('[data-key="15724"]'), // 3 dubloons
        SquidOnAStick: document.querySelector('[data-key="15725"]'), // 3 dubloons
        ChocolateJoyFunPop: document.querySelector('[data-key="15726"]'), // 2 dubloons
        BerryJoyFunPop: document.querySelector('[data-key="15727"]'), // 2 dubloons
        MochaJoyFunPop: document.querySelector('[data-key="15728"]'), // 2 dubloons
        KrakuberryCove: document.querySelector('[data-key="15729"]'), // 2 dubloons
        ForbiddenPlunder: document.querySelector('[data-key="15730"]') // 3 dubloons
    },
    cocktails: {
        DoubleStuffedGuppy: document.querySelector('[data-key="15708"]'), // 2 dubloons
        BomberryGrog: document.querySelector('[data-key="15709"]'), // 2 dubloons
        ErgyFruitGrog: document.querySelector('[data-key="15710"]'), // 2 dubloons
        TcheaGrog: document.querySelector('[data-key="15711"]'), // 2 dubloons
        KrakuberryGrog: document.querySelector('[data-key="15712"]'), // 2 dubloons
        LemonPop: document.querySelector('[data-key="15713"]'), // 2 dubloons
        CherryPop: document.querySelector('[data-key="15714"]'), // 2 dubloons
        GrapePop: document.querySelector('[data-key="15715"]'), // 2 dubloons
        RaspberryPop: document.querySelector('[data-key="15716"]'), // 2 dubloons
        KeelHaul: document.querySelector('[data-key="15718"]'), // 2 dubloons
        CannonFodder: document.querySelector('[data-key="15719"]'), // 2 dubloons
        WalkThePlank: document.querySelector('[data-key="15720"]'), // 2 dubloons
        LandLubber: document.querySelector('[data-key="15721"]'), // 2 dubloons
        Hogshead: document.querySelector('[data-key="15722"]') // 2 dubloons
    }
};
 
const chosenButton = document.querySelector('button[type="submit"]');
const eatAllButton = document.querySelector('input[value="Eat ALL of the food!"]');
 
const selectFood = (menuItem) => {
    if (menuItem) {
        menuItem.click();
    }
};
 
const type = getQueryParam('type');
switch (type) {
    case '1':
        selectFood(menuItems.starters.CaesarSalad); // change here the name of the starter you would like to have
        break;
    case '2':
        selectFood(menuItems.mainCourses.BabyBloater); // change here the name of the main course you would like to have
        break;
    case '3':
        selectFood(menuItems.desserts.ChocolateJoyFunPop); // change here the name of the dessert you would like to have
        break;
    case '4':
        selectFood(menuItems.cocktails.ErgyFruitGrog); // change here the name of the cocktail you would like to have
        break;
    case 'eat':
        // start the process over again by pressing enter after feeding your pet
        document.addEventListener("keydown", (event) => {
            if (event.keyCode === 13) {
                window.location.href = '/pirates/restaurant/?type=1';
            }
        });
        break;
    default:
        break;
}
 
document.addEventListener("keydown", (event) => {
    if (event.keyCode === 13) {
        chosenButton && chosenButton.click();
        eatAllButton && eatAllButton.click();
    }
});