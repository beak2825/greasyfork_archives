// ==UserScript==
// @name         Super_UA
// @namespace    https://greasyfork.org/ru/scripts/404157-super-ua
// @version      0.5
// @description  based on Gradient's common filler
// @author       achepta
// @include     /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/inventory\.php/
// @grant       unsafeWindow
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/404157/Super_UA.user.js
// @updateURL https://update.greasyfork.org/scripts/404157/Super_UA.meta.js
// ==/UserScript==

(function (window, undefined) {
    let w;
    if (typeof unsafeWindow !== undefined) {
        w = unsafeWindow;
    } else {
        w = window;
    }
    if (w.self !== w.top) {
        return;
    }
    let shop_arts = get_a_prices();
    function start() {
        let trs = document.querySelector("#test > table > tbody").childNodes;
        let tds = [];
        for (let i = 0; i < trs.length; i++) {
            tds.push.apply(tds, trs[i].childNodes);
        }

        for (let i = 0; i < tds.length; i++) {
            if (tds[i].innerHTML.length < 10) {
                continue
            }
            let art_name = tds[i].querySelector("table > tbody > tr:nth-child(1) > td.wb > table > tbody > tr:nth-child(1) > td:nth-child(1) > a > b").innerHTML;
            let art_dur = tds[i].querySelector("table > tbody > tr:nth-child(1) > td:nth-child(1) > div > div > div").innerHTML.match(/\d{1,2}/);
            if (isShopArt(art_name)) {
                let art_info = get_art_info(art_name);
                let tbody = tds[i].querySelector("table > tbody > tr:nth-child(1) > td.wb > table > tbody");
                let nice_place = tbody.appendChild(document.createElement("tr")).appendChild(document.createElement("td"));
                nice_place.innerHTML = "Цена: " + (Math.floor(art_dur*art_info.ppb)).toString();
                nice_place.setAttribute("width", "50%");
                nice_place.setAttribute("colspan", "2");
                nice_place.setAttribute("align", "center")
            }
        }
    }
    window.addEventListener('load', function() {
        start()
    }, false);

    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        document.querySelector("#android_container > table > tbody > tr:nth-child(1)").addEventListener("click", function(){
            start()
        });
    } else {
        document.querySelector("body > center > table > tbody > tr > td > table > tbody > tr:nth-child(1)").addEventListener("click", function(){
            start()
        });
    }


    function get_art_info(art_name) {
        for (let i = 0; i < shop_arts.length; i++) {
            if (shop_arts[i].name === art_name)
                return shop_arts[i]
        }
        return ""
    }

    function isShopArt(art_name) {
        for (let i = 0; i < shop_arts.length; i++) {
            if (shop_arts[i].name === art_name)
                return true
        }
        return false
    }


    function get_a_prices() {
        return [
            // shop weapon
            { id: 'staff', name: 'Боевой посох', price: 2660, ppb: 66.50 },
            { id: 'sword18', name: 'Гладий предвестия', price: 18129, ppb: 258.98 },
            { id: 'wood_sword', name: 'Деревянный меч', price: 140, ppb: 20.00 },
            { id: 'long_bow', name: 'Длинный лук', price: 6450, ppb: 129.00 },
            { id: 'dagger_dex', name: 'Кинжал ловкости', price: 4840, ppb: 121.00 },
            { id: 'dagger', name: 'Кинжал мести', price: 960, ppb: 32.00 },
            { id: 'dagger20', name: 'Клинок сумерек', price: 9780, ppb: 163.00 },
            { id: 'dagger16', name: 'Клинок феникса', price: 9600, ppb: 160.00 },
            { id: 'shortbow', name: 'Короткий лук', price: 360, ppb: 18.00 },
            { id: 'gnome_hammer', name: 'Легкий топорик', price: 300, ppb: 12.00 },
            { id: 'bow14', name: 'Лук полуночи', price: 10155, ppb: 156.23 },
            { id: 'bow17', name: 'Лук рассвета', price: 10640, ppb: 163.69 },
            { id: 'power_sword', name: 'Меч власти', price: 9981, ppb: 124.76 },
            { id: 'requital_sword', name: 'Меч возмездия', price: 2580, ppb: 64.50 },
            { id: 'firsword15', name: 'Меч возрождения', price: 18042, ppb: 257.74 },
            { id: 'ssword16', name: 'Меч гармонии', price: 6178, ppb: 134.30 },
            { id: 'ssword8', name: 'Меч жесткости', price: 3918, ppb: 97.95 },
            { id: 'ssword10', name: 'Меч отваги', price: 4956, ppb: 110.13 },
            { id: 'broad_sword', name: 'Меч равновесия', price: 4820, ppb: 80.33 },
            { id: 'def_sword', name: 'Меч расправы', price: 1319, ppb: 32.98 },
            { id: 'dagger_myf', name: 'Мифриловый кинжал', price: 9080, ppb: 151.34 },
            { id: 'mif_sword', name: 'Мифриловый меч', price: 17314, ppb: 247.34 },
            { id: 'mif_staff', name: 'Мифриловый посох', price: 17250, ppb: 255.42 },
            { id: 'ssword13', name: 'Обсидиановый меч', price: 6111, ppb: 122.22 },
            { id: 'mstaff13', name: 'Обсидиановый посох', price: 4898, ppb: 122.45 },
            { id: 'mstaff8', name: 'Посох весны', price: 3040, ppb: 101.33 },
            { id: 'smstaff16', name: 'Посох забвения', price: 4985, ppb: 134.73 },
            { id: 'staff18', name: 'Посох затмения', price: 18680, ppb: 266.86 },
            { id: 'sor_staff', name: 'Посох могущества', price: 6440, ppb: 128.80 },
            { id: 'ffstaff15', name: 'Посох повелителя огня', price: 18610, ppb: 265.85 },
            { id: 'mstaff10', name: 'Посох теней', price: 3980, ppb: 113.71 },
            { id: 'mm_sword', name: 'Рубиновый меч', price: 17557, ppb: 250.81 },
            { id: 'mm_staff', name: 'Рубиновый посох', price: 17880, ppb: 247.77 },
            { id: 'composite_bow', name: 'Составной лук', price: 8419, ppb: 153.07 },
            { id: 'steel_blade', name: 'Стальной клинок', price: 475, ppb: 15.83 },

            // shop armor
            { id: 'large_shield', name: 'Башенный щит', price: 9777, ppb: 139.67 },
            { id: 'hauberk', name: 'Боевая кольчуга', price: 2337, ppb: 58.42 },
            { id: 'boots2', name: 'Боевые сапоги', price: 1047, ppb: 29.91 },
            { id: 'armor15', name: 'Доспех пламени', price: 9506, ppb: 135.80 },
            { id: 'marmor17', name: 'Доспехи сумерек', price: 9800, ppb: 140.00 },
            { id: 'sarmor16', name: 'Кираса благородства', price: 4442, ppb: 100.95 },
            { id: 'armor17', name: 'Кираса рассвета', price: 9690, ppb: 138.42 },
            { id: 'leather_shiled', name: 'Кожаная броня', price: 271, ppb: 15.06 },
            { id: 'leatherhat', name: 'Кожаная шляпа', price: 180, ppb: 15.00 },
            { id: 'leatherboots', name: 'Кожаные ботинки', price: 203, ppb: 14.50 },
            { id: 'leatherplate', name: 'Кожаные доспехи', price: 1387, ppb: 46.23 },
            { id: 'hunter_boots', name: 'Кожаные сапоги', price: 931, ppb: 31.03 },
            { id: 'leather_helm', name: 'Кожаный шлем', price: 640, ppb: 21.33 },
            { id: 'wizard_cap', name: 'Колпак мага', price: 1680, ppb: 48.00 },
            { id: 'chain_coif', name: 'Кольчужный шлем', price: 1571, ppb: 39.27 },
            { id: 'xymhelmet15', name: 'Корона пламенного чародея', price: 6960, ppb: 99.42 },
            { id: 'mhelmetzh13', name: 'Корона чернокнижника', price: 6720, ppb: 96.00 },
            { id: 'round_shiled', name: 'Круглый щит', price: 110, ppb: 15.71 },
            { id: 'mif_light', name: 'Лёгкая мифриловая кираса', price: 6382, ppb: 91.17 },
            { id: 'mif_lboots', name: 'Лёгкие мифриловые сапоги', price: 7304, ppb: 132.80 },
            { id: 'mif_lhelmet', name: 'Лёгкий мифриловый шлем', price: 5354, ppb: 76.49 },
            { id: 'sarmor9', name: 'Мифриловая кольчуга', price: 2531, ppb: 63.27 },
            { id: 'miff_plate', name: 'Мифриловые доспехи', price: 10049, ppb: 133.99 },
            { id: 'sarmor13', name: 'Обсидиановая броня', price: 4413, ppb: 88.26 },
            { id: 'boots13', name: 'Обсидиановые сапоги', price: 8681, ppb: 124.01 },
            { id: 'zxhelmet13', name: 'Обсидиановый шлем', price: 6518, ppb: 93.11 },
            { id: 'shield13', name: 'Обсидиановый щит', price: 10388, ppb: 148.40 },
            { id: 'mage_armor', name: 'Одеяние мага', price: 4700, ppb: 94.00 },
            { id: 'robewz15', name: 'Роба пламенного чародея', price: 9506, ppb: 135.80 },
            { id: 'wiz_robe', name: 'Роба чародея', price: 9573, ppb: 136.76 },
            { id: 'sboots12', name: 'Рубиновые сапоги', price: 3055, ppb: 87.29 },
            { id: 'shelm12', name: 'Рубиновый шлем', price: 2716, ppb: 67.90 },
            { id: 'sboots16', name: 'Сапоги благородства', price: 3307, ppb: 110.23 },
            { id: 'boots15', name: 'Сапоги пламени', price: 8739, ppb: 124.84 },
            { id: 'boots17', name: 'Сапоги рассвета', price: 8865, ppb: 126.64 },
            { id: 'mboots17', name: 'Сапоги сумерек', price: 9140, ppb: 130.57 },
            { id: 'mboots14', name: 'Сапоги чернокнижника', price: 9011, ppb: 128.73 },
            { id: 'sboots9', name: 'Солдатские сапоги', price: 2182, ppb: 72.73 },
            { id: 'ciras', name: 'Стальная кираса', price: 4549, ppb: 64.99 },
            { id: 'steel_helmet', name: 'Стальной шлем', price: 3753, ppb: 53.61 },
            { id: 's_shield', name: 'Стальной щит', price: 271, ppb: 18.07 },
            { id: 'full_plate', name: 'Стальные доспехи', price: 9438, ppb: 125.84 },
            { id: 'steel_boots', name: 'Стальные сапоги', price: 5907, ppb: 84.39 },
            { id: 'shoe_of_initiative', name: 'Туфли стремления', price: 2510, ppb: 62.75 },
            { id: 'wiz_boots', name: 'Туфли чародея', price: 8430, ppb: 129.69 },
            { id: 'mif_hboots', name: 'Тяжёлые мифриловые сапоги', price: 7915, ppb: 121.77 },
            { id: 'mif_hhelmet', name: 'Тяжёлый мифриловый шлем', price: 6431, ppb: 91.87 },
            { id: 'shelm16', name: 'Шлем благородства', price: 2832, ppb: 70.80 },
            { id: 'mage_helm', name: 'Шлем мага', price: 3346, ppb: 66.92 },
            { id: 'shelm8', name: 'Шлем отваги', price: 1222, ppb: 40.73 },
            { id: 'myhelmet15', name: 'Шлем пламени', price: 6722, ppb: 96.03 },
            { id: 'helmet17', name: 'Шлем рассвета', price: 7391, ppb: 105.58 },
            { id: 'mhelmet17', name: 'Шлем сумерек', price: 7620, ppb: 108.86 },
            { id: 'knowledge_hat', name: 'Шляпа знаний', price: 999, ppb: 39.96 },
            { id: 'dragon_shield', name: 'Щит драконов', price: 8962, ppb: 128.03 },
            { id: 'shield16', name: 'Щит пламени', price: 10514, ppb: 150.20 },
            { id: 'sshield17', name: 'Щит подавления', price: 4230, ppb: 120.86 },
            { id: 'shield19', name: 'Щит рассвета', price: 11020, ppb: 157.43 },
            { id: 'sshield5', name: 'Щит славы', price: 2948, ppb: 73.70 },
            { id: 'sshield11', name: 'Щит сокола', price: 3957, ppb: 98.92 },
            { id: 'defender_shield', name: 'Щит хранителя', price: 1154, ppb: 28.85 },
            { id: 'sshield14', name: 'Щит чешуи дракона', price: 4006, ppb: 105.42 },

            // shop jewelry
            { id: 'wzzamulet16', name: 'Амулет битвы', price: 11203, ppb: 172.35 },
            { id: 'mmzamulet16', name: 'Амулет духа', price: 11550, ppb: 177.69 },
            { id: 'smamul17', name: 'Амулет единения', price: 4620, ppb: 154.00 },
            { id: 'bafamulet15', name: 'Амулет трёх стихий', price: 11038, ppb: 169.82 },
            { id: 'amulet_of_luck', name: 'Амулет удачи', price: 979, ppb: 39.16 },
            { id: 'samul14', name: 'Амулет фортуны', price: 4462, ppb: 148.73 },
            { id: 'wzzamulet13', name: 'Амулет ярости', price: 10185, ppb: 169.75 },
            { id: 'warring13', name: 'Глаз дракона', price: 10495, ppb: 174.92 },
            { id: 'ring19', name: 'Кольцо бесстрашия', price: 11900, ppb: 183.08 },
            { id: 'wwwring16', name: 'Кольцо боли', price: 11475, ppb: 176.54 },
            { id: 'dring5', name: 'Кольцо веры', price: 3569, ppb: 89.22 },
            { id: 'warriorring', name: 'Кольцо воина', price: 6838, ppb: 170.95 },
            { id: 'mmmring16', name: 'Кольцо звёзд', price: 11475, ppb: 176.54 },
            { id: 'i_ring', name: 'Кольцо ловкости', price: 174, ppb: 17.40 },
            { id: 'smring10', name: 'Кольцо молнии', price: 3010, ppb: 100.33 },
            { id: 'dring18', name: 'Кольцо надежды', price: 15132, ppb: 216.17 },
            { id: 'mring19', name: 'Кольцо непрестанности', price: 11990, ppb: 184.46 },
            { id: 'circ_ring', name: 'Кольцо отречения', price: 6644, ppb: 132.88 },
            { id: 'dring15', name: 'Кольцо пламенного взора', price: 14841, ppb: 212.01 },
            { id: 'powerring', name: 'Кольцо пророка', price: 5460, ppb: 136.50 },
            { id: 'bring14', name: 'Кольцо противоречий', price: 10920, ppb: 182.00 },
            { id: 'sring4', name: 'Кольцо силы', price: 591, ppb: 39.40 },
            { id: 'doubt_ring', name: 'Кольцо сомнений', price: 1086, ppb: 90.50 },
            { id: 'dring21', name: 'Кольцо сопряжения', price: 15900, ppb: 227.14 },
            { id: 'rashness_ring', name: 'Кольцо стремительности', price: 1969, ppb: 65.63 },
            { id: 'darkring', name: 'Кольцо теней', price: 8820, ppb: 176.40 },
            { id: 'sring17', name: 'Кольцо хватки дракона', price: 2968, ppb: 98.93 },
            { id: 'warrior_pendant', name: 'Кулон воина', price: 8215, ppb: 164.30 },
            { id: 'mamulet19', name: 'Кулон непостижимости', price: 11620, ppb: 178.77 },
            { id: 'power_pendant', name: 'Кулон отчаяния', price: 7536, ppb: 125.60 },
            { id: 'amulet19', name: 'Кулон рвения', price: 11271, ppb: 173.40 },
            { id: 'magic_amulet', name: 'Магический амулет', price: 8820, ppb: 176.40 },
            { id: 'cloack17', name: 'Мантия вечности', price: 10500, ppb: 161.54 },
            { id: 'cloackwz15', name: 'Мантия пламенного чародея', price: 9816, ppb: 151.02 },
            { id: 'scroll18', name: 'Манускрипт концентрации', price: 10850, ppb: 155.00 },
            { id: 'scloack8', name: 'Маскировочный плащ', price: 2095, ppb: 69.83 },
            { id: 'bravery_medal', name: 'Медаль отваги', price: 572, ppb: 22.88 },
            { id: 'mmzamulet13', name: 'Мистический амулет', price: 10500, ppb: 175.00 },
            { id: 'dring12', name: 'Мифриловая печать', price: 13638, ppb: 209.81 },
            { id: 'soul_cape', name: 'Накидка духов', price: 1222, ppb: 40.73 },
            { id: 'wiz_cape', name: 'Накидка чародея', price: 8894, ppb: 148.23 },
            { id: 'samul17', name: 'Оскал дракона', price: 4481, ppb: 149.36 },
            { id: 'smamul14', name: 'Осколок тьмы', price: 4600, ppb: 153.33 },
            { id: 'verve_ring', name: 'Перстень вдохновения', price: 1610, ppb: 89.44 },
            { id: 'dring9', name: 'Перстень хранителя', price: 10243, ppb: 204.86 },
            { id: 'smring17', name: 'Печать единения', price: 3060, ppb: 102.00 },
            { id: 'magring13', name: 'Печать заклинателя', price: 10820, ppb: 180.33 },
            { id: 'scloack16', name: 'Плащ драконьего покрова', price: 3259, ppb: 108.63 },
            { id: 'powercape', name: 'Плащ магической силы', price: 5451, ppb: 136.28 },
            { id: 'scoutcloack', name: 'Плащ разведчика', price: 310, ppb: 15.50 },
            { id: 'energy_scroll', name: 'Свиток энергии', price: 9520, ppb: 136.00 },
            { id: 'samul8', name: 'Счастливая подкова', price: 3462, ppb: 115.40 },
            { id: 'sring10', name: 'Терновое кольцо', price: 2919, ppb: 97.30 },
            { id: 'antiair_cape', name: 'Халат ветров', price: 3080, ppb: 51.33 },
            { id: 'antimagic_cape', name: 'Халат магической защиты', price: 5210, ppb: 104.20 }
        ];
    }


})(window);