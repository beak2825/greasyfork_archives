// ==UserScript==
// @name        GN_SortClanStorage
// @namespace   Gradient
// @author      Gradient
// @description Значительное улучшение вида и функционала кланового склада: настраиваемая cортировка по слотам и по крафту-цене; автоодевание на персонажа при аренде, отключение перезагрузки страницы, возврат одним кликом всех, даже одетых, артов на склад.
// @include     /.+sklad_info\.php\?id=\d+&cat=[0-3]/
// @version     1.1.0
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/12742/GN_SortClanStorage.user.js
// @updateURL https://update.greasyfork.org/scripts/12742/GN_SortClanStorage.meta.js
// ==/UserScript==

"use strict";

//----------------------------------------------------------------------------//

(function(){ // wrapper start

//----------------------------------------------------------------------------//
// UnifiedLibrary start
//----------------------------------------------------------------------------//

//----------------------------------------------------------------------------//
// CommonValues
//----------------------------------------------------------------------------//

    var GN_CommonValues = new CommonValues();

//----------------------------------------------------------------------------//

    function CommonValues(){  // wrapper start

//----------------------------------------------------------------------------//
// Artefacts
//----------------------------------------------------------------------------//

        var hero_lvl = 19;

        this.enum_ak = {
            shop:      0,
            hunter:    1,
            event:     2,
            thief:     3,
            tactic:    4,
            verb:      5,
            war:       6,
            relict:    7,
            ranger:    8,
            shop_gift: 9,
            unknown:   10
        };

        this.enum_as = {
            right_arm: 0,
            left_arm:  1,
            foots:     2,
            ring:      3,
            head:      4,
            neck:      5,
            rear:      6,
            body:      7
        };

        var enum_at = {
            weapon:  0,
            armor:   1,
            jewelry: 2
        };

        var a_prices = [
            // shop weapon
            { id: 'staff', name: 'Боевой посох ', price: 2581, ppb: 64.53, own_ppb: 0 },
            { id: 'sword18', name: 'Гладий предвестия', price: 18690, ppb: 267.00, own_ppb: 0 },
            { id: 'wood_sword', name: 'Деревянный меч', price: 140, ppb: 20.00, own_ppb: 0 },
            { id: 'long_bow', name: 'Длинный лук', price: 6450, ppb: 129.00, own_ppb: 0 },
            { id: 'dagger', name: 'Кинжал мести', price: 932, ppb: 31.07, own_ppb: 0 },
            { id: 'shortbow', name: 'Короткий лук', price: 350, ppb: 17.50, own_ppb: 0 },
            { id: 'gnome_hammer', name: 'Легкий топорик', price: 300, ppb: 12.00, own_ppb: 0 },
            { id: 'bow14', name: 'Лук полуночи', price: 10156, ppb: 156.25, own_ppb: 0 },
            { id: 'bow17', name: 'Лук рассвета', price: 10640, ppb: 163.69, own_ppb: 0 },
            { id: 'power_sword', name: 'Меч власти', price: 9981, ppb: 124.76, own_ppb: 0 },
            { id: 'requital_sword', name: 'Меч возмездия', price: 2580, ppb: 64.50, own_ppb: 0 },
            { id: 'firsword15', name: 'Меч возрождения', price: 18042, ppb: 257.74, own_ppb: 0 },
            { id: 'ssword16', name: 'Меч гармонии', price: 6179, ppb: 134.33, own_ppb: 0 },
            { id: 'ssword8', name: 'Меч жесткости', price: 3919, ppb: 97.97, own_ppb: 0 },
            { id: 'ssword10', name: 'Меч отваги', price: 4957, ppb: 110.16, own_ppb: 0 },
            { id: 'broad_sword', name: 'Меч равновесия', price: 4821, ppb: 80.35, own_ppb: 0 },
            { id: 'def_sword', name: 'Меч расправы', price: 1320, ppb: 33.00, own_ppb: 0 },
            { id: 'mif_sword', name: 'Мифриловый меч', price: 17314, ppb: 247.34, own_ppb: 0 },
            { id: 'mif_staff', name: 'Мифриловый посох', price: 16732, ppb: 239.03, own_ppb: 0 },
            { id: 'ssword13', name: 'Обсидиановый меч', price: 6111, ppb: 122.22, own_ppb: 0 },
            { id: 'mstaff13', name: 'Обсидиановый посох', price: 4898, ppb: 122.45, own_ppb: 0 },
            { id: 'mstaff8', name: 'Посох весны', price: 2949, ppb: 98.30, own_ppb: 0 },
            { id: 'smstaff16', name: 'Посох забвения', price: 4986, ppb: 134.76, own_ppb: 0 },
            { id: 'staff18', name: 'Посох затмения', price: 18680, ppb: 266.86, own_ppb: 0 },
            { id: 'sor_staff', name: 'Посох могущества', price: 6247, ppb: 124.94, own_ppb: 0 },
            { id: 'ffstaff15', name: 'Посох повелителя огня', price: 18052, ppb: 257.89, own_ppb: 0 },
            { id: 'mstaff10', name: 'Посох теней', price: 3980, ppb: 113.71, own_ppb: 0 },
            { id: 'mm_sword', name: 'Рубиновый меч', price: 17557, ppb: 250.81, own_ppb: 0 },
            { id: 'mm_staff', name: 'Рубиновый посох', price: 17344, ppb: 247.77, own_ppb: 0 },
            { id: 'composite_bow', name: 'Составной лук', price: 8420, ppb: 153.09, own_ppb: 0 },
            { id: 'steel_blade', name: 'Стальной клинок', price: 475, ppb: 15.83, own_ppb: 0 },

            // shop armor
            { id: 'large_shield', name: 'Башенный щит', price: 9778, ppb: 139.69, own_ppb: 0 },
            { id: 'hauberk', name: 'Боевая кольчуга', price: 2338, ppb: 58.45, own_ppb: 0 },
            { id: 'boots2', name: 'Боевые сапоги', price: 1048, ppb: 29.94, own_ppb: 0 },
            { id: 'armor15', name: 'Доспех пламени', price: 9506, ppb: 135.80, own_ppb: 0 },
            { id: 'marmor17', name: 'Доспехи сумерек', price: 9800, ppb: 140.00, own_ppb: 0 },
            { id: 'sarmor16', name: 'Кираса благородства', price: 4443, ppb: 100.98, own_ppb: 0 },
            { id: 'armor17', name: 'Кираса рассвета', price: 9990, ppb: 142.71, own_ppb: 0 },
            { id: 'leather_shiled', name: 'Кожаная броня', price: 272, ppb: 15.11, own_ppb: 0 },
            { id: 'leatherhat', name: 'Кожаная шляпа', price: 180, ppb: 15.00, own_ppb: 0 },
            { id: 'leatherboots', name: 'Кожаные ботинки', price: 204, ppb: 14.57, own_ppb: 0 },
            { id: 'leatherplate', name: 'Кожаные доспехи', price: 1387, ppb: 46.23, own_ppb: 0 },
            { id: 'hunter_boots', name: 'Кожаные сапоги', price: 932, ppb: 31.07, own_ppb: 0 },
            { id: 'leather_helm', name: 'Кожаный шлем', price: 641, ppb: 21.37, own_ppb: 0 },
            { id: 'wizard_cap', name: 'Колпак мага', price: 1630, ppb: 46.57, own_ppb: 0 },
            { id: 'chain_coif', name: 'Кольчужный шлем', price: 1572, ppb: 39.30, own_ppb: 0 },
            { id: 'xymhelmet15', name: 'Корона пламенного чародея', price: 6752, ppb: 96.46, own_ppb: 0 },
            { id: 'mhelmetzh13', name: 'Корона чернокнижника', price: 6519, ppb: 93.13, own_ppb: 0 },
            { id: 'round_shiled', name: 'Круглый щит', price: 110, ppb: 15.71, own_ppb: 0 },
            { id: 'mif_light', name: 'Лёгкая мифриловая кираса', price: 6383, ppb: 91.19, own_ppb: 0 },
            { id: 'mif_lboots', name: 'Лёгкие мифриловые сапоги', price: 7304, ppb: 132.80, own_ppb: 0 },
            { id: 'mif_lhelmet', name: 'Лёгкий мифриловый шлем', price: 5355, ppb: 76.50, own_ppb: 0 },
            { id: 'sarmor9', name: 'Мифриловая кольчуга', price: 2532, ppb: 63.30, own_ppb: 0 },
            { id: 'miff_plate', name: 'Мифриловые доспехи', price: 10050, ppb: 134.00, own_ppb: 0 },
            { id: 'sarmor13', name: 'Обсидиановая броня', price: 4413, ppb: 88.26, own_ppb: 0 },
            { id: 'boots13', name: 'Обсидиановые сапоги', price: 8681, ppb: 124.01, own_ppb: 0 },
            { id: 'zxhelmet13', name: 'Обсидиановый шлем', price: 6519, ppb: 93.13, own_ppb: 0 },
            { id: 'shield13', name: 'Обсидиановый щит', price: 10389, ppb: 148.41, own_ppb: 0 },
            { id: 'mage_armor', name: 'Одеяние мага', price: 4559, ppb: 91.18, own_ppb: 0 },
            { id: 'robewz15', name: 'Роба пламенного чародея', price: 9506, ppb: 135.80, own_ppb: 0 },
            { id: 'wiz_robe', name: 'Роба чародея', price: 9574, ppb: 136.77, own_ppb: 0 },
            { id: 'sboots12', name: 'Рубиновые сапоги', price: 3055, ppb: 87.29, own_ppb: 0 },
            { id: 'shelm12', name: 'Рубиновый шлем', price: 2716, ppb: 67.90, own_ppb: 0 },
            { id: 'sboots16', name: 'Сапоги благородства', price: 3308, ppb: 110.27, own_ppb: 0 },
            { id: 'boots15', name: 'Сапоги пламени', price: 8740, ppb: 124.86, own_ppb: 0 },
            { id: 'boots17', name: 'Сапоги рассвета', price: 9140, ppb: 130.57, own_ppb: 0 },
            { id: 'mboots17', name: 'Сапоги сумерек', price: 9140, ppb: 130.57, own_ppb: 0 },
            { id: 'mboots14', name: 'Сапоги чернокнижника', price: 9011, ppb: 128.73, own_ppb: 0 },
            { id: 'sboots9', name: 'Солдатские сапоги ', price: 2182, ppb: 72.73, own_ppb: 0 },
            { id: 'ciras', name: 'Стальная кираса', price: 4549, ppb: 64.99, own_ppb: 0 },
            { id: 'steel_helmet', name: 'Стальной шлем', price: 3754, ppb: 53.63, own_ppb: 0 },
            { id: 's_shield', name: 'Стальной щит', price: 272, ppb: 18.13, own_ppb: 0 },
            { id: 'full_plate', name: 'Стальные доспехи', price: 9438, ppb: 125.84, own_ppb: 0 },
            { id: 'steel_boots', name: 'Стальные сапоги', price: 5907, ppb: 84.39, own_ppb: 0 },
            { id: 'shoe_of_initiative', name: 'Туфли стремления', price: 2435, ppb: 60.88, own_ppb: 0 },
            { id: 'wiz_boots', name: 'Туфли чародея', price: 8177, ppb: 125.80, own_ppb: 0 },
            { id: 'mif_hboots', name: 'Тяжёлые мифриловые сапоги', price: 7916, ppb: 121.78, own_ppb: 0 },
            { id: 'mif_hhelmet', name: 'Тяжёлый мифриловый шлем', price: 6431, ppb: 91.87, own_ppb: 0 },
            { id: 'shelm16', name: 'Шлем благородства', price: 2833, ppb: 70.83, own_ppb: 0 },
            { id: 'mage_helm', name: 'Шлем мага', price: 3346, ppb: 66.92, own_ppb: 0 },
            { id: 'shelm8', name: 'Шлем отваги', price: 1223, ppb: 40.77, own_ppb: 0 },
            { id: 'myhelmet15', name: 'Шлем пламени', price: 6722, ppb: 96.03, own_ppb: 0 },
            { id: 'helmet17', name: 'Шлем рассвета', price: 7620, ppb: 108.86, own_ppb: 0 },
            { id: 'mhelmet17', name: 'Шлем сумерек', price: 7620, ppb: 108.86, own_ppb: 0 },
            { id: 'knowledge_hat', name: 'Шляпа знаний', price: 999, ppb: 39.96, own_ppb: 0 },
            { id: 'dragon_shield', name: 'Щит драконов', price: 8963, ppb: 128.04, own_ppb: 0 },
            { id: 'shield16', name: 'Щит пламени', price: 10515, ppb: 150.21, own_ppb: 0 },
            { id: 'sshield17', name: 'Щит подавления', price: 4230, ppb: 120.86, own_ppb: 0 },
            { id: 'shield19', name: 'Щит рассвета', price: 11020, ppb: 157.43, own_ppb: 0 },
            { id: 'sshield5', name: 'Щит славы', price: 2949, ppb: 73.72, own_ppb: 0 },
            { id: 'sshield11', name: 'Щит сокола', price: 3958, ppb: 98.95, own_ppb: 0 },
            { id: 'defender_shield', name: 'Щит хранителя', price: 1154, ppb: 28.85, own_ppb: 0 },
            { id: 'sshield14', name: 'Щит чешуи дракона', price: 4006, ppb: 105.42, own_ppb: 0 },

            // shop jewelry
            { id: 'wzzamulet16', name: 'Амулет битвы', price: 11203, ppb: 172.35, own_ppb: 0 },
            { id: 'mmzamulet16', name: 'Амулет духа', price: 11203, ppb: 172.35, own_ppb: 0 },
            { id: 'smamul17', name: 'Амулет единения', price: 4620, ppb: 154.00, own_ppb: 0 },
            { id: 'bafamulet15', name: 'Амулет трёх стихий', price: 11039, ppb: 169.83, own_ppb: 0 },
            { id: 'amulet_of_luck', name: 'Амулет удачи', price: 980, ppb: 39.20, own_ppb: 0 },
            { id: 'samul14', name: 'Амулет фортуны', price: 4462, ppb: 148.73, own_ppb: 0 },
            { id: 'wzzamulet13', name: 'Амулет ярости', price: 10185, ppb: 169.75, own_ppb: 0 },
            { id: 'warring13', name: 'Глаз дракона', price: 10496, ppb: 174.93, own_ppb: 0 },
            { id: 'ring19', name: 'Кольцо бесстрашия', price: 11900, ppb: 183.08, own_ppb: 0 },
            { id: 'wwwring16', name: 'Кольцо боли', price: 11475, ppb: 176.54, own_ppb: 0 },
            { id: 'warriorring', name: 'Кольцо воина', price: 6838, ppb: 170.95, own_ppb: 0 },
            { id: 'mmmring16', name: 'Кольцо звёзд', price: 11475, ppb: 176.54, own_ppb: 0 },
            { id: 'i_ring', name: 'Кольцо ловкости', price: 175, ppb: 17.50, own_ppb: 0 },
            { id: 'smring10', name: 'Кольцо молнии', price: 2920, ppb: 97.33, own_ppb: 0 },
            { id: 'mring19', name: 'Кольцо непрестанности', price: 11630, ppb: 178.92, own_ppb: 0 },
            { id: 'circ_ring', name: 'Кольцо отречения', price: 6644, ppb: 132.88, own_ppb: 0 },
            { id: 'powerring', name: 'Кольцо пророка', price: 5297, ppb: 132.43, own_ppb: 0 },
            { id: 'bring14', name: 'Кольцо противоречий', price: 10593, ppb: 176.55, own_ppb: 0 },
            { id: 'sring4', name: 'Кольцо силы', price: 592, ppb: 39.47, own_ppb: 0 },
            { id: 'doubt_ring', name: 'Кольцо сомнений', price: 1087, ppb: 90.58, own_ppb: 0 },
            { id: 'rashness_ring', name: 'Кольцо стремительности', price: 1969, ppb: 65.63, own_ppb: 0 },
            { id: 'darkring', name: 'Кольцо теней', price: 8556, ppb: 171.12, own_ppb: 0 },
            { id: 'sring17', name: 'Кольцо хватки дракона', price: 2969, ppb: 98.97, own_ppb: 0 },
            { id: 'warrior_pendant', name: 'Кулон воина', price: 8216, ppb: 164.32, own_ppb: 0 },
            { id: 'mamulet19', name: 'Кулон непостижимости', price: 11620, ppb: 178.77, own_ppb: 0 },
            { id: 'power_pendant', name: 'Кулон отчаяния', price: 7537, ppb: 125.62, own_ppb: 0 },
            { id: 'amulet19', name: 'Кулон рвения', price: 11620, ppb: 178.77, own_ppb: 0 },
            { id: 'magic_amulet', name: 'Магический амулет', price: 8556, ppb: 171.12, own_ppb: 0 },
            { id: 'cloack17', name: 'Мантия вечности', price: 10500, ppb: 161.54, own_ppb: 0 },
            { id: 'cloackwz15', name: 'Мантия пламенного чародея', price: 9817, ppb: 151.03, own_ppb: 0 },
            { id: 'scroll18', name: 'Манускрипт концентрации', price: 10850, ppb: 155.00, own_ppb: 0 },
            { id: 'scloack8', name: 'Маскировочный плащ', price: 2096, ppb: 69.87, own_ppb: 0 },
            { id: 'bravery_medal', name: 'Медаль отваги', price: 572, ppb: 22.88, own_ppb: 0 },
            { id: 'mmzamulet13', name: 'Мистический амулет', price: 10185, ppb: 169.75, own_ppb: 0 },
            { id: 'soul_cape', name: 'Накидка духов', price: 1223, ppb: 40.77, own_ppb: 0 },
            { id: 'wiz_cape', name: 'Накидка чародея', price: 8895, ppb: 148.25, own_ppb: 0 },
            { id: 'samul17', name: 'Оскал дракона', price: 4482, ppb: 149.40, own_ppb: 0 },
            { id: 'smamul14', name: 'Осколок тьмы', price: 4462, ppb: 148.73, own_ppb: 0 },
            { id: 'verve_ring', name: 'Перстень вдохновения', price: 1611, ppb: 89.50, own_ppb: 0 },
            { id: 'smring17', name: 'Печать единения', price: 3060, ppb: 102.00, own_ppb: 0 },
            { id: 'magring13', name: 'Печать заклинателя', price: 10496, ppb: 174.93, own_ppb: 0 },
            { id: 'scloack16', name: 'Плащ драконьего покрова', price: 3260, ppb: 108.67, own_ppb: 0 },
            { id: 'powercape', name: 'Плащ магической силы', price: 5452, ppb: 136.30, own_ppb: 0 },
            { id: 'scoutcloack', name: 'Плащ разведчика', price: 311, ppb: 15.55, own_ppb: 0 },
            { id: 'energy_scroll', name: 'Свиток энергии', price: 9235, ppb: 131.93, own_ppb: 0 },
            { id: 'samul8', name: 'Счастливая подкова', price: 3463, ppb: 115.43, own_ppb: 0 },
            { id: 'sring10', name: 'Терновое кольцо', price: 2920, ppb: 97.33, own_ppb: 0 },
            { id: 'antiair_cape', name: 'Халат ветров', price: 2988, ppb: 49.80, own_ppb: 0 },
            { id: 'antimagic_cape', name: 'Халат магической защиты', price: 5054, ppb: 101.08, own_ppb: 0 },
        ];

        function set_a_price(art){
            for(var i = 0; i < a_prices.length; ++i)
                if(a_prices[i].id == art.id){
                    var a = a_prices[i];

                    if(a.price)
                        art.price = a.price;

                    if(a.ppb)
                        art.ppb = a.ppb;

                    if(a.own_ppb)
                        art.own_ppb = a.own_ppb;

                    break;
                }
        }

// NB check it later
        var a_high_durability = [
            // shop weapon
            { id: 'sword18', name: 'Гладий предвестия', extended: [ { durability: 85, price: 23300 }, { durability: 90, price: 35000 } ] },
            { id: 'bow14', name: 'Лук полуночи', extended: [ { durability: 75, price: 14400 }, { durability: 85, price: 49000 } ] },
            { id: 'bow17', name: 'Лук рассвета', extended: [ { durability: 75, price: 14000 }, { durability: 85, price: 29000 } ] },
            { id: 'power_sword', name: 'Меч власти', extended: [ { durability: 95, price: 25000 }, { durability: 100, price: 105000 } ] },
            { id: 'firsword15', name: 'Меч возрождения', extended: [ { durability: 85, price: 31000 }, { durability: 90, price: 61000 } ] },
            { id: 'mif_sword', name: 'Мифриловый меч', extended: [ { durability: 85, price: 28000 }, { durability: 90, price: 28000 } ] },
            { id: 'mif_staff', name: 'Мифриловый посох', extended: [ { durability: 85, price: 18000 }, { durability: 90, price: 19600 } ] },
            { id: 'staff18', name: 'Посох затмения', extended: [ { durability: 85, price: 15200 }, { durability: 90, price: 17200 } ] },
            { id: 'sor_staff', name: 'Посох могущества', extended: [ { durability: 65, price: 8500 } ] },
            { id: 'ffstaff15', name: 'Посох повелителя огня', extended: [ { durability: 85, price: 18500 }, { durability: 90, price: 19500 } ] },
            { id: 'mm_sword', name: 'Рубиновый меч', extended: [ { durability: 85, price: 25000 }, { durability: 90, price: 37000 } ] },
            { id: 'mm_staff', name: 'Рубиновый посох', extended: [ { durability: 85, price: 17500 }, { durability: 90, price: 20000 } ] },
            { id: 'composite_bow', name: 'Составной лук', extended: [ { durability: 65, price: 9800 }, { durability: 70, price: 15000 } ] },

            // shop armor
            { id: 'xymhelmet15', name: 'Корона пламенного чародея', extended: [ { durability: 85, price: 7600 }, { durability: 90, price: 8300 } ] },
            { id: 'mhelmetzh13', name: 'Корона чернокнижника', extended: [ { durability: 85, price: 7000 }, { durability: 90, price: 7500 } ] },
            { id: 'mif_lhelmet', name: 'Лёгкий мифриловый шлем', extended: [ { durability: 85, price: 7800 }, { durability: 90, price: 8700 } ] },
            { id: 'zxhelmet13', name: 'Обсидиановый шлем', extended: [ { durability: 85, price: 9000 } ] },
            { id: 'steel_helmet', name: 'Стальной шлем', extended: [ { durability: 85, price: 4600 }, { durability: 90, price: 7600 } ] },
            { id: 'mif_hhelmet', name: 'Тяжёлый мифриловый шлем', extended: [ { durability: 85, price: 7800 }, { durability: 90, price: 10000 } ] },
            { id: 'mage_helm', name: 'Шлем мага', extended: [ { durability: 60, price: 4500 }, { durability: 65, price: 4500 } ] },
            { id: 'myhelmet15', name: 'Шлем пламени', extended: [ { durability: 85, price: 12700 }, { durability: 90, price: 12700 } ] },
            { id: 'helmet17', name: 'Шлем рассвета', extended: [ { durability: 85, price: 16000 }, { durability: 90, price: 16000 } ] },
            { id: 'mhelmet17', name: 'Шлем сумерек', extended: [ { durability: 85, price: 13000 }, { durability: 90, price: 13000 } ] },

            { id: 'armor15', name: 'Доспех пламени', extended: [ { durability: 85, price: 14500 }, { durability: 90, price: 20000 } ] },
            { id: 'marmor17', name: 'Доспехи сумерек', extended: [ { durability: 85, price: 11700 }, { durability: 90, price: 13000 } ] },
            { id: 'armor17', name: 'Кираса рассвета', extended: [ { durability: 85, price: 14000 }, { durability: 90, price: 21000 } ] },
            { id: 'mif_light', name: 'Лёгкая мифриловая кираса', extended: [ { durability: 85, price: 9500 }, { durability: 90, price: 9500 } ] },
            { id: 'miff_plate', name: 'Мифриловые доспехи', extended: [ { durability: 90, price: 15500 }, { durability: 95, price: 19500 } ] },
            { id: 'mage_armor', name: 'Одеяние мага', extended: [ { durability: 60, price: 5000 }, { durability: 65, price: 5000 } ] },
            { id: 'robewz15', name: 'Роба пламенного чародея', extended: [ { durability: 85, price: 11000 }, { durability: 90, price: 14300 } ] },
            { id: 'wiz_robe', name: 'Роба чародея', extended: [ { durability: 85, price: 11000 }, { durability: 90, price: 11800 } ] },
            { id: 'ciras', name: 'Стальная кираса', extended: [ { durability: 85, price: 8700 }, { durability: 90, price: 9200 } ] },
            { id: 'full_plate', name: 'Стальные доспехи', extended: [ { durability: 90, price: 12000 }, { durability: 95, price: 15000 } ] },

            { id: 'large_shield', name: 'Башенный щит', extended: [ { durability: 85, price: 12300 }, { durability: 90, price: 15000 } ] },
            { id: 'shield13', name: 'Обсидиановый щит', extended: [ { durability: 85, price: 20000 }, { durability: 90, price: 20000 } ] },
            { id: 'dragon_shield', name: 'Щит драконов', extended: [ { durability: 85, price: 12000 }, { durability: 90, price: 12500 } ] },
            { id: 'shield16', name: 'Щит пламени', extended: [ { durability: 85, price: 16500 }, { durability: 90, price: 30000 } ] },
            { id: 'shield19', name: 'Щит рассвета', extended: [ { durability: 85, price: 13200 }, { durability: 90, price: 13400 } ] },

            { id: 'mif_lboots', name: 'Лёгкие мифриловые сапоги', extended: [ { durability: 65, price: 9000 }, { durability: 70, price: 9500 } ] },
            { id: 'boots13', name: 'Обсидиановые сапоги', extended: [ { durability: 85, price: 12000 }, { durability: 90, price: 19000 } ] },
            { id: 'boots15', name: 'Сапоги пламени', extended: [ { durability: 85, price: 13500 }, { durability: 90, price: 14000 } ] },
            { id: 'boots17', name: 'Сапоги рассвета', extended: [ { durability: 85, price: 15000 }, { durability: 90, price: 20000 } ] },
            { id: 'mboots17', name: 'Сапоги сумерек', extended: [ { durability: 85, price: 11000 }, { durability: 90, price: 11500 } ] },
            { id: 'mboots14', name: 'Сапоги чернокнижника', extended: [ { durability: 85, price: 12000 }, { durability: 90, price: 12000 } ] },
            { id: 'steel_boots', name: 'Стальные сапоги', extended: [ { durability: 85, price: 9000 }, { durability: 90, price: 9000 } ] },
            { id: 'wiz_boots', name: 'Туфли чародея', extended: [ { durability: 75, price: 9000 }, { durability: 85, price: 10000 } ] },
            { id: 'mif_hboots', name: 'Тяжёлые мифриловые сапоги', extended: [ { durability: 75, price: 10500 }, { durability: 85, price: 16500 } ] },

            // shop jewelry
            { id: 'wzzamulet16', name: 'Амулет битвы', extended: [ { durability: 75, price: 18000 }, { durability: 85, price: 18000 } ] },
            { id: 'mmzamulet16', name: 'Амулет духа', extended: [ { durability: 75, price: 10000 }, { durability: 85, price: 12800 } ] },
            { id: 'bafamulet15', name: 'Амулет трёх стихий', extended: [ { durability: 75, price: 10600 }, { durability: 85, price: 12500 } ] },
            { id: 'wzzamulet13', name: 'Амулет ярости', extended: [ { durability: 70, price: 17000 } ] },
            { id: 'warrior_pendant', name: 'Кулон воина', extended: [ { durability: 60, price: 10500 }, { durability: 65, price: 12500 } ] },
            { id: 'mamulet19', name: 'Кулон непостижимости', extended: [ { durability: 75, price: 9500 }, { durability: 85, price: 9500 } ] },
            { id: 'amulet19', name: 'Кулон рвения', extended: [ { durability: 75, price: 12400 }, { durability: 85, price: 14100 } ] },
            { id: 'magic_amulet', name: 'Магический амулет', extended: [ { durability: 60, price: 8700 }, { durability: 65, price: 9500 } ] },
            { id: 'mmzamulet13', name: 'Мистический амулет', extended: [ { durability: 70, price: 12000 }, { durability: 75, price: 12000 } ] },

            { id: 'cloack17', name: 'Мантия вечности', extended: [ { durability: 75, price: 11800 }, { durability: 85, price: 13400 } ] },
            { id: 'cloackwz15', name: 'Мантия пламенного чародея', extended: [ { durability: 75, price: 16000 }, { durability: 85, price: 19000 } ] },
            { id: 'wiz_cape', name: 'Накидка чародея', extended: [ { durability: 70, price: 11000 }, { durability: 75, price: 12000 } ] },
            { id: 'antimagic_cape', name: 'Халат магической защиты', extended: [ { durability: 60, price: 6000 }, { durability: 65, price: 6000 } ] },

            { id: 'ring19', name: 'Кольцо бесстрашия', extended: [ { durability: 75, price: 17000 }, { durability: 85, price: 18600 } ] },
            { id: 'wwwring16', name: 'Кольцо боли', extended: [ { durability: 75, price: 19000 }, { durability: 85, price: 40000 } ] },
            { id: 'mmmring16', name: 'Кольцо звёзд', extended: [ { durability: 75, price: 11500 }, { durability: 85, price: 13000 } ] },
            { id: 'mring19', name: 'Кольцо непрестанности', extended: [ { durability: 75, price: 12200 }, { durability: 85, price: 12700 } ] },
            { id: 'bring14', name: 'Кольцо противоречий', extended: [ { durability: 70, price: 12500 }, { durability: 75, price: 13500 } ] },
            { id: 'darkring', name: 'Кольцо теней', extended: [ { durability: 60, price: 10000 }, { durability: 65, price: 11000 } ] },
            { id: 'magring13', name: 'Печать заклинателя', extended: [ { durability: 70, price: 12700 }, { durability: 75, price: 14300 } ] },
        ];

        function set_a_high_durability(art){
            for(var i = 0; i < a_high_durability.length; ++i)
                if(a_high_durability[i].id == art.id){
                    var a = a_high_durability[i];

                    a.extended.forEach(function(current){
                        art.extended.push(current);
                    });

                    break;
                }
        }

        var a_resources = [
            // shop weapon
            { id: 'steel_blade', resource: { gold: 490 } },
            { id: 'sword18', resource: { gold: 7530, wood: 10, ore: 10, mercury: 5, sulfur: 6, crystal: 5, gem: 5 } },
            { id: 'ffstaff15', resource: { gold: 8530, wood: 1, ore: 1, mercury: 6, sulfur: 7, crystal: 7, gem: 7 } },
            { id: 'mif_staff', resource: { gold: 8070, wood: 3, mercury: 6, sulfur: 6, crystal: 6, gem: 6 } },
            { id: 'mm_staff', resource: { gold: 8160, wood: 8, mercury: 5, sulfur: 6, crystal: 6, gem: 6 } },
            { id: 'mstaff10', resource: { gold: 20, wood: 2, ore: 2, mercury: 2, sulfur: 3, crystal: 2, gem: 2 } },
            { id: 'mstaff13', resource: { gold: 190, wood: 2, ore: 3, mercury: 2, sulfur: 3, crystal: 3, gem: 3 } },
            { id: 'mstaff8', resource: { gold: 160, wood: 1, ore: 1, mercury: 1, sulfur: 2, crystal: 2, gem: 2 } },
            { id: 'smstaff16', resource: { gold: 640, wood: 2, ore: 3, mercury: 2, sulfur: 3, crystal: 2, gem: 3 } },
            { id: 'sor_staff', resource: { gold: 140, wood: 3, mercury: 5, sulfur: 1, crystal: 5, gem: 5 } },
            { id: 'staff', resource: { gold: 1220, crystal: 2, gem: 2 } },
            { id: 'staff18', resource: { gold: 1760, mercury: 11, sulfur: 12, crystal: 12, gem: 12 } },
            { id: 'bow14', resource: { gold: 5430, wood: 14, mercury: 1, sulfur: 2, crystal: 2, gem: 2 } },
            { id: 'bow17', resource: { gold: 5600, wood: 28 } },
            { id: 'composite_bow', resource: { gold: 4900, wood: 15, sulfur: 3 } },
            { id: 'dagger', resource: { gold: 960 } },
            { id: 'long_bow', resource: { gold: 3590, wood: 11, sulfur: 3 } },
            { id: 'shortbow', resource: { gold: 180, wood: 1 } },
            { id: 'broad_sword', resource: { gold: 2450, sulfur: 4, crystal: 3 } },
            { id: 'def_sword', resource: { gold: 1360 } },
            { id: 'firsword15', resource: { gold: 9420, wood: 3, ore: 4, mercury: 5, sulfur: 6, crystal: 5, gem: 6 } },
            { id: 'mif_sword', resource: { gold: 8490, wood: 5, ore: 5, mercury: 5, sulfur: 6, crystal: 5, gem: 5 } },
            { id: 'mm_sword', resource: { gold: 9280, wood: 3, ore: 4, mercury: 5, sulfur: 6, crystal: 5, gem: 5 } },
            { id: 'power_sword', resource: { gold: 5250, mercury: 3, sulfur: 4, crystal: 3, gem: 4 } },
            { id: 'ssword10', resource: { gold: 790, wood: 2, ore: 2, mercury: 2, sulfur: 3, crystal: 2, gem: 3 } },
            { id: 'ssword13', resource: { gold: 720, wood: 3, ore: 4, mercury: 3, sulfur: 3, crystal: 3, gem: 3 } },
            { id: 'ssword16', resource: { gold: 790, wood: 3, ore: 4, mercury: 3, sulfur: 3, crystal: 3, gem: 3 } },
            { id: 'ssword8', resource: { gold: 800, wood: 1, ore: 3, mercury: 1, sulfur: 2, crystal: 2, gem: 2 } },
            { id: 'wood_sword', resource: { gold: 140 } },
            { id: 'gnome_hammer', resource: { gold: 310 } },
            { id: 'requital_sword', resource: { gold: 1580, crystal: 1, gem: 2 } },

            //shop armor
            { id: 'knowledge_hat', resource: { gold: 670, crystal: 1 } },
            { id: 'leatherboots', resource: { gold: 210 } },
            { id: 'leatherhat', resource: { gold: 180 } },
            { id: 'mage_armor', resource: { gold: 2180, mercury: 3, gem: 4 } },
            { id: 'mhelmetzh13', resource: { gold: 4200, mercury: 1, sulfur: 2, crystal: 2, gem: 2 } },
            { id: 'robewz15', resource: { gold: 3500, wood: 3, ore: 4, mercury: 3, sulfur: 4, crystal: 3, gem: 4 } },
            { id: 'shoe_of_initiative', resource: { gold: 1790, sulfur: 1, gem: 1 } },
            { id: 'wiz_boots', resource: { gold: 5190, mercury: 2, sulfur: 3, crystal: 2, gem: 2 } },
            { id: 'wiz_robe', resource: { gold: 7350, sulfur: 3, crystal: 4 } },
            { id: 'wizard_cap', resource: { gold: 1320, mercury: 1 } },
            { id: 'xymhelmet15', resource: { gold: 3720, mercury: 2, sulfur: 3, crystal: 2, gem: 2 } },
            { id: 'armor17', resource: { gold: 6750, wood: 1, ore: 3, mercury: 2, sulfur: 2, crystal: 1, gem: 2 } },
            { id: 'ciras', resource: { gold: 2890, ore: 4, mercury: 3 } },
            { id: 'hauberk', resource: { gold: 1510, ore: 3, mercury: 1 } },
            { id: 'leather_shiled', resource: { gold: 280 } },
            { id: 'mif_light', resource: { gold: 2800, ore: 3, mercury: 3, sulfur: 2, crystal: 2, gem: 2 } },
            { id: 'sarmor13', resource: { gold: 770, wood: 2, ore: 3, mercury: 2, sulfur: 2, crystal: 2, gem: 2 } },
            { id: 'sarmor16', resource: { gold: 800, wood: 2, ore: 3, mercury: 2, sulfur: 2, crystal: 2, gem: 2 } },
            { id: 'sarmor9', resource: { gold: 810, wood: 1, ore: 1, mercury: 1, sulfur: 1, crystal: 1, gem: 1 } },
            { id: 'defender_shield', resource: { gold: 1010, ore: 1 } },
            { id: 'dragon_shield', resource: { gold: 4200, mercury: 7, crystal: 7 } },
            { id: 'large_shield', resource: { gold: 6300, ore: 7, mercury: 3, crystal: 4 } },
            { id: 'round_shiled', resource: { gold: 110 } },
            { id: 's_shield', resource: { gold: 280 } },
            { id: 'shield13', resource: { gold: 6390, ore: 10, mercury: 1, sulfur: 2, crystal: 2, gem: 2 } },
            { id: 'shield16', resource: { gold: 6340, wood: 3, ore: 4, mercury: 1, sulfur: 3, crystal: 2, gem: 3 } },
            { id: 'shield19', resource: { gold: 6520, wood: 1, ore: 6, mercury: 3, sulfur: 2, crystal: 3, gem: 1 } },
            { id: 'sshield11', resource: { gold: 1200, wood: 8, ore: 8 } },
            { id: 'sshield14', resource: { gold: 710, wood: 9, ore: 10 } },
            { id: 'sshield17', resource: { gold: 810, wood: 9, ore: 10 } },
            { id: 'sshield5', resource: { gold: 520, wood: 1, ore: 1, mercury: 1, sulfur: 2, crystal: 1, gem: 2 } },
            { id: 'boots13', resource: { gold: 4810, ore: 9, mercury: 1, sulfur: 3, crystal: 1, gem: 2 } },
            { id: 'boots15', resource: { gold: 4870, ore: 7, mercury: 2, sulfur: 2, crystal: 2, gem: 2 } },
            { id: 'boots17', resource: { gold: 4820, ore: 8, mercury: 2, sulfur: 2, crystal: 2, gem: 2 } },
            { id: 'boots2', resource: { gold: 720, wood: 1, ore: 1 } },
            { id: 'hunter_boots', resource: { gold: 780, ore: 1 } },
            { id: 'mboots14', resource: { gold: 5330, mercury: 2, sulfur: 3, crystal: 3, gem: 3 } },
            { id: 'mboots17', resource: { gold: 5180, mercury: 2, sulfur: 3, crystal: 3, gem: 3 } },
            { id: 'mif_hboots', resource: { gold: 4380, ore: 7, mercury: 1, sulfur: 2, crystal: 2, gem: 2 } },
            { id: 'mif_lboots', resource: { gold: 4470, ore: 3, mercury: 1, sulfur: 2, crystal: 2, gem: 2 } },
            { id: 'sboots12', resource: { gold: 810, wood: 1, ore: 2, mercury: 1, sulfur: 2, crystal: 1, gem: 1 } },
            { id: 'sboots16', resource: { gold: 170, wood: 2, ore: 2, mercury: 1, sulfur: 2, crystal: 2, gem: 2 } },
            { id: 'sboots9', resource: { gold: 810, mercury: 1, sulfur: 1, crystal: 1, gem: 1 } },
            { id: 'steel_boots', resource: { gold: 4290, ore: 4, crystal: 1, gem: 2 } },
            { id: 'chain_coif', resource: { gold: 1080, ore: 1, mercury: 1 } },
            { id: 'helmet17', resource: { gold: 3840, wood: 3, ore: 4, mercury: 1, sulfur: 2, crystal: 2, gem: 2 } },
            { id: 'leather_helm', resource: { gold: 660 } },
            { id: 'mage_helm', resource: { gold: 930, mercury: 1, sulfur: 2, crystal: 2, gem: 2 } },
            { id: 'mhelmet17', resource: { gold: 4380, mercury: 2, sulfur: 3, crystal: 2, gem: 2 } },
            { id: 'mif_hhelmet', resource: { gold: 3930, wood: 3, ore: 4, mercury: 1, sulfur: 1, crystal: 1, gem: 1 } },
            { id: 'mif_lhelmet', resource: { gold: 3540, wood: 2, ore: 3, sulfur: 1, crystal: 1, gem: 1 } },
            { id: 'myhelmet15', resource: { gold: 3150, wood: 3, ore: 4, mercury: 1, sulfur: 2, crystal: 2, gem: 2 } },
            { id: 'shelm12', resource: { gold: 1000, wood: 1, ore: 1, mercury: 1, sulfur: 1, crystal: 1, gem: 1 } },
            { id: 'shelm16', resource: { gold: 400, wood: 1, ore: 1, mercury: 1, sulfur: 2, crystal: 1, gem: 2 } },
            { id: 'shelm8', resource: { gold: 720, ore: 1, sulfur: 1 } },
            { id: 'steel_helmet', resource: { gold: 2250, ore: 3, mercury: 2, sulfur: 1 } },
            { id: 'zxhelmet13', resource: { gold: 4380, wood: 1, ore: 2, mercury: 1, sulfur: 2, crystal: 1, gem: 1 } },
            { id: 'armor15', resource: { gold: 6740, wood: 1, ore: 2, mercury: 1, sulfur: 2, crystal: 2, gem: 2 } },
            { id: 'full_plate', resource: { gold: 5950, ore: 7, mercury: 7 } },
            { id: 'leatherplate', resource: { gold: 1070, ore: 2 } },
            { id: 'marmor17', resource: { gold: 3500, wood: 3, ore: 4, mercury: 3, sulfur: 4, crystal: 3, gem: 4 } },
            { id: 'miff_plate', resource: { gold: 6040, wood: 5, ore: 5, mercury: 1, sulfur: 2, crystal: 2, gem: 2 } },

            // shop jewelry
            { id: 'power_pendant', resource: { gold: 5250, mercury: 1, sulfur: 2, crystal: 2, gem: 2 } },
            { id: 'smamul14', resource: { gold: 280, wood: 2, ore: 2, mercury: 2, sulfur: 3, crystal: 2, gem: 3 } },
            { id: 'smring17', resource: { gold: 360, wood: 1, ore: 2, mercury: 1, sulfur: 2, crystal: 1, gem: 2 } },
            { id: 'soul_cape', resource: { gold: 900, sulfur: 1 } },
            { id: 'verve_ring', resource: { gold: 1660 } },
            { id: 'warring13', resource: { gold: 5780, wood: 14, ore: 14 } },
            { id: 'warrior_pendant', resource: { gold: 5950, wood: 7, ore: 7 } },
            { id: 'wiz_cape', resource: { gold: 3770, mercury: 5, sulfur: 8, crystal: 1, gem: 1 } },
            { id: 'smring10', resource: { gold: 490, wood: 1, ore: 1, mercury: 1, sulfur: 2, crystal: 1, gem: 2 } },
            { id: 'sring10', resource: { gold: 1210, wood: 1, ore: 1, mercury: 1, sulfur: 1, crystal: 1, gem: 1 } },
            { id: 'sring17', resource: { gold: 360, wood: 1, ore: 2, mercury: 1, sulfur: 2, crystal: 1, gem: 2 } },
            { id: 'sring4', resource: { gold: 430, ore: 1 } },
            { id: 'warriorring', resource: { gold: 4350, ore: 1, crystal: 3, gem: 4 } },
            { id: 'wwwring16', resource: { gold: 5890, wood: 8, ore: 9, mercury: 2, sulfur: 2, crystal: 2, gem: 2 } },
            { id: 'wzzamulet13', resource: { gold: 4200, wood: 17, ore: 18 } },
            { id: 'wzzamulet16', resource: { gold: 5250, wood: 3, ore: 4, mercury: 3, sulfur: 4, crystal: 3, gem: 4 } },
            { id: 'amulet_of_luck', resource: { gold: 1010 } },
            { id: 'amulet19', resource: { gold: 2260, wood: 5, ore: 5, mercury: 5, sulfur: 6, crystal: 5, gem: 5 } },
            { id: 'antiair_cape', resource: { gold: 2720, sulfur: 1 } },
            { id: 'antimagic_cape', resource: { gold: 4490, sulfur: 1, gem: 1 } },
            { id: 'bafamulet15', resource: { gold: 2020, wood: 5, ore: 5, mercury: 5, sulfur: 6, crystal: 5, gem: 5 } },
            { id: 'bravery_medal', resource: { gold: 590 } },
            { id: 'bring14', resource: { gold: 5340, wood: 3, ore: 4, mercury: 3, sulfur: 3, crystal: 3, gem: 3 } },
            { id: 'circ_ring', resource: { gold: 4330, sulfur: 3, crystal: 2, gem: 2 } },
            { id: 'cloack17', resource: { gold: 4380, mercury: 3, sulfur: 4, crystal: 7, gem: 3 } },
            { id: 'cloackwz15', resource: { gold: 5080, mercury: 3, sulfur: 8, crystal: 1, gem: 2 } },
            { id: 'darkring', resource: { gold: 6300, mercury: 3, sulfur: 4 } },
            { id: 'doubt_ring', resource: { gold: 1120 } },
            { id: 'energy_scroll', resource: { gold: 7000, mercury: 1, sulfur: 2, crystal: 2, gem: 2 } },
            { id: 'i_ring', resource: { gold: 180 } },
            { id: 'magic_amulet', resource: { gold: 6300, crystal: 3, gem: 4 } },
            { id: 'magring13', resource: { gold: 5780, mercury: 3, sulfur: 4, crystal: 3, gem: 4 } },
            { id: 'mamulet19', resource: { gold: 1540, mercury: 7, sulfur: 7, crystal: 7, gem: 7 } },
            { id: 'mmmring16', resource: { gold: 6070, mercury: 4, sulfur: 4, crystal: 4, gem: 4 } },
            { id: 'mmzamulet13', resource: { gold: 4380, crystal: 8, gem: 9 } },
            { id: 'mmzamulet16', resource: { gold: 2190, mercury: 8, crystal: 9, gem: 9 } },
            { id: 'mring19', resource: { gold: 5870, mercury: 4, sulfur: 5, crystal: 4, gem: 4 } },
            { id: 'powercape', resource: { gold: 580, mercury: 7, sulfur: 7 } },
            { id: 'powerring', resource: { gold: 2940, mercury: 1, sulfur: 2, crystal: 2, gem: 2 } },
            { id: 'rashness_ring', resource: { gold: 1670, gem: 1 } },
            { id: 'ring19', resource: { gold: 5600, wood: 3, ore: 4, mercury: 3, sulfur: 4, crystal: 3, gem: 4 } },
            { id: 'samul14', resource: { gold: 1360, mercury: 2, sulfur: 3, crystal: 2, gem: 2 } },
            { id: 'samul17', resource: { gold: 300, wood: 2, ore: 2, mercury: 2, sulfur: 3, crystal: 2, gem: 3 } },
            { id: 'samul8', resource: { gold: 1050, mercury: 1, sulfur: 2, crystal: 2, gem: 2 } },
            { id: 'scloack16', resource: { gold: 300, wood: 1, ore: 2, mercury: 1, sulfur: 2, crystal: 2, gem: 2 } },
            { id: 'scloack8', resource: { gold: 720, wood: 1, ore: 1, sulfur: 1, crystal: 1, gem: 1 } },
            { id: 'scoutcloack', resource: { gold: 320 } },
            { id: 'scroll18', resource: { gold: 4550, wood: 3, ore: 4, mercury: 3, sulfur: 4, crystal: 3, gem: 4 } },
            { id: 'smamul17', resource: { gold: 300, wood: 2, ore: 2, mercury: 2, sulfur: 3, crystal: 2, gem: 3 } },

            // shop gift
            { id: 'protazan', resource: { gold: 8750 } },
            { id: 'bfly', resource: { gold: 52500 } },
            { id: 'bril_pendant', resource: { gold: 24500 } },
            { id: 'd_spray', resource: { gold: 3500 } },
            { id: 'flowers1', resource: { gold: 350 } },
            { id: 'flowers2', resource: { gold: 350 } },
            { id: 'flowers3', resource: { gold: 3500 } },
            { id: 'flowers4', resource: { gold: 5250 } },
            { id: 'flowers5', resource: { gold: 5250 } },
            { id: 'half_heart_m', resource: { gold: 5250 } },
            { id: 'half_heart_w', resource: { gold: 5250 } },
            { id: 'koltsou', resource: { gold: 24500 } },
            { id: 'roses', resource: { gold: 8750 } },
            { id: 'bril_ring', resource: { gold: 35000 } },
            { id: 'flower_heart', resource: { gold: 1750 } },
            { id: 'venok', resource: { gold: 350 } },
            { id: 'wboots', resource: { gold: 17500 } },
            { id: 'whelmet', resource: { gold: 17500 } },
            { id: 'warmor', resource: { gold: 17500 } },
            { id: 'defender_dagger', resource: { gold: 1400 } },
            { id: 'shpaga', resource: { gold: 28000 } },
            { id: 'goldciras', resource: { gold: 14000 } },
        ];

        function set_a_resource(art){
            for(var i = 0; i < a_resources.length; ++i)
                if(a_resources[i].id == art.id){
                    var a = a_resources[i];

                    if(a.resource.gold)
                        art.resource.gold = a.resource.gold;
                    if(a.resource.wood)
                        art.resource.wood = a.resource.wood;
                    if(a.resource.ore)
                        art.resource.ore = a.resource.ore;
                    if(a.resource.mercury)
                        art.resource.mercury = a.resource.mercury;
                    if(a.resource.sulfur)
                        art.resource.sulfur = a.resource.sulfur;
                    if(a.resource.crystal)
                        art.resource.crystal = a.resource.crystal;
                    if(a.resource.gem)
                        art.resource.gem = a.resource.gem;

                    break;
                }
        }

        var a_states = [
            // shop weapon
            { id: 'steel_blade', states: { attack: 2 } },
            { id: 'sword18', states: { attack: 8, defence: 1 } },
            { id: 'ffstaff15', states: { attack: 1, spellpower: 2, knowledge: 3 } },
            { id: 'mif_staff', states: { attack: 1, spellpower: 2, knowledge: 2 } },
            { id: 'mm_staff', states: { defence: 1, spellpower: 2, knowledge: 2 } },
            { id: 'mstaff10', states: { attack: 1, defence: 1, spellpower: 1, knowledge: 2 } },
            { id: 'mstaff13', states: { defence: 1, spellpower: 1, knowledge: 3 } },
            { id: 'mstaff8', states: { defence: 1, spellpower: 1, knowledge: 2 } },
            { id: 'smstaff16', states: { defence: 2, spellpower: 2, knowledge: 2 } },
            { id: 'sor_staff', states: { spellpower: 2, knowledge: 2 } },
            { id: 'staff', states: { attack: 1, spellpower: 1 } },
            { id: 'staff18', states: { attack: 1, defence: 2, spellpower: 3, knowledge: 2 } },
            { id: 'bow17', states: { initiative: 1 } },
            { id: 'dagger', states: { attack: 1 } },
            { id: 'broad_sword', states: { attack: 2, defence: 2, initiative: 2 } },
            { id: 'def_sword', states: { attack: 2, defence: 1 } },
            { id: 'firsword15', states: { attack: 8 } },
            { id: 'mif_sword', states: { attack: 6, initiative: 2 } },
            { id: 'mm_sword', states: { attack: 7, initiative: 1 } },
            { id: 'power_sword', states: { attack: 5, initiative: 3 } },
            { id: 'ssword10', states: { attack: 6 } },
            { id: 'ssword13', states: { attack: 7 } },
            { id: 'ssword16', states: { attack: 7, defence: 1 } },
            { id: 'ssword8', states: { attack: 4, defence: 1, initiative: 2 } },
            { id: 'wood_sword', states: { attack: 1 } },
            { id: 'gnome_hammer', states: { attack: 2, defence: -1} },
            { id: 'requital_sword', states: { attack: 3, defence: 1 } },

            // shop armor
            { id: 'knowledge_hat', states: { knowledge: 1 } },
            { id: 'leatherboots', states: { initiative: 1 } },
            { id: 'leatherhat', states: { initiative: 1 } },
            { id: 'mage_armor', states: { defence: 3, spellpower: 1 } },
            { id: 'mhelmetzh13', states: { defence: 3, spellpower: 1, knowledge: 1 } },
            { id: 'robewz15', states: { defence: 5, spellpower: 1, knowledge: 1 } },
            { id: 'shoe_of_initiative', states: { initiative: 3 } },
            { id: 'wiz_boots', states: { defence: 2, spellpower: 1 } },
            { id: 'wiz_robe', states: { defence: 4, spellpower: 2 } },
            { id: 'wizard_cap', states: { spellpower: 1 } },
            { id: 'xymhelmet15', states: { defence: 2, spellpower: 1, knowledge: 2 } },
            { id: 'armor17', states: { defence: 5 } },
            { id: 'ciras', states: { defence: 4 } },
            { id: 'hauberk', states: { defence: 3 } },
            { id: 'leather_shiled', states: { defence: 1 } },
            { id: 'mif_light', states: { defence: 4 } },
            { id: 'sarmor13', states: { defence: 4 } },
            { id: 'sarmor16', states: { defence: 4, initiative: 1 } },
            { id: 'sarmor9', states: { defence: 3, initiative: 1 } },
            { id: 'defender_shield', states: { defence: 3 } },
            { id: 'dragon_shield', states: { attack: 1, defence: 4 } },
            { id: 'large_shield', states: { defence: 5 } },
            { id: 'round_shiled', states: { defence: 1 } },
            { id: 's_shield', states: { defence: 2 } },
            { id: 'shield13', states: { attack: 1, defence: 4 } },
            { id: 'shield16', states: { defence: 5 } },
            { id: 'shield19', states: { defence: 6 } },
            { id: 'sshield11', states: { defence: 4, initiative: 1 } },
            { id: 'sshield14', states: { defence: 5 } },
            { id: 'sshield17', states: { attack: 1, defence: 4 } },
            { id: 'sshield5', states: { defence: 4 } },
            { id: 'boots13', states: { defence: 5 } },
            { id: 'boots15', states: { defence: 5 } },
            { id: 'boots17', states: { defence: 5 } },
            { id: 'boots2', states: { defence: 2 } },
            { id: 'hunter_boots', states: { defence: 1 } },
            { id: 'mboots14', states: { defence: 3, spellpower: 1 } },
            { id: 'mboots17', states: { defence: 4, spellpower: 1 } },
            { id: 'mif_hboots', states: { defence: 5 } },
            { id: 'mif_lboots', states: { defence: 3, initiative: 2 } },
            { id: 'sboots12', states: { defence: 4 } },
            { id: 'sboots16', states: { defence: 4, initiative: 1 } },
            { id: 'sboots9', states: { defence: 2, initiative: 3 } },
            { id: 'steel_boots', states: { defence: 4 } },
            { id: 'chain_coif', states: { defence: 2 } },
            { id: 'helmet17', states: { defence: 5 } },
            { id: 'leather_helm', states: { defence: 1 } },
            { id: 'mage_helm', states: { defence: 2, spellpower: 1 } },
            { id: 'mhelmet17', states: { defence: 3, spellpower: 1, knowledge: 2 } },
            { id: 'mif_hhelmet', states: { defence: 4 } },
            { id: 'mif_lhelmet', states: { defence: 2, initiative: 1 } },
            { id: 'myhelmet15', states: { defence: 5 } },
            { id: 'shelm12', states: { defence: 3 } },
            { id: 'shelm16', states: { defence: 4, initiative: 1 } },
            { id: 'shelm8', states: { defence: 2, initiative: 1 } },
            { id: 'steel_helmet', states: { defence: 3 } },
            { id: 'zxhelmet13', states: { defence: 5 } },
            { id: 'armor15', states: { defence: 5 } },
            { id: 'full_plate', states: { defence: 5 } },
            { id: 'leatherplate', states: { defence: 2 } },
            { id: 'marmor17', states: { defence: 5, spellpower: 1, knowledge: 1 } },
            { id: 'miff_plate', states: { defence: 5 } },

            // shop jewelry
            { id: 'power_pendant', states: { attack: 1, defence: 1, initiative: 5 } },
            { id: 'smamul14', states: { defence: 2, knowledge: 3 } },
            { id: 'smring17', states: { defence: 2, spellpower: 1, knowledge: 1 } },
            { id: 'soul_cape', states: { spellpower: 1 } },
            { id: 'verve_ring', states: { morale: 1 } },
            { id: 'warring13', states: { attack: 3, initiative: 3 } },
            { id: 'warrior_pendant', states: { attack: 3, defence: 2, initiative: 3 } },
            { id: 'wiz_cape', states: { spellpower: 2 } },
            { id: 'smring10', states: { defence: 2, knowledge: 1 } },
            { id: 'sring10', states: { attack: 2, defence: 2 } },
            { id: 'sring17', states: { attack: 2, defence: 3 } },
            { id: 'sring4', states: { attack: 1, defence: 1 } },
            { id: 'warriorring', states: { attack: 3, initiative: 2 } },
            { id: 'wwwring16', states: { attack: 3, defence: 2, initiative: 1 } },
            { id: 'wzzamulet13', states: { attack: 3, defence: 3, initiative: 3 } },
            { id: 'wzzamulet16', states: { attack: 3, defence: 1, initiative: 6 } },
            { id: 'amulet_of_luck', states: { luck: 1 } },
            { id: 'amulet19', states: { attack: 3, defence: 3, initiative: 5 } },
            { id: 'bafamulet15', states: { attack: 2, defence: 2, spellpower: 1, knowledge: 1, initiative: 2 } },
            { id: 'bravery_medal', states: { morale: 1 } },
            { id: 'bring14', states: { attack: 1, defence: 1, spellpower: 1, knowledge: 1, initiative: 1 } },
            { id: 'circ_ring', states: { defence: -1, initiative: 5 } },
            { id: 'cloack17', states: { defence: 1, spellpower: 2, knowledge: 1 } },
            { id: 'cloackwz15', states: { spellpower: 2, knowledge: 1 } },
            { id: 'darkring', states: { spellpower: 2 } },
            { id: 'doubt_ring', states: { morale: -2, luck: 1 } },
            { id: 'energy_scroll', states: { spellpower: 1, knowledge: 2 } },
            { id: 'i_ring', states: { initiative: 1 } },
            { id: 'magic_amulet', states: { spellpower: 2, knowledge: 1 } },
            { id: 'magring13', states: { spellpower: 2, knowledge: 1 } },
            { id: 'mamulet19', states: { defence: 1, spellpower: 2, knowledge: 3 } },
            { id: 'mmmring16', states: { spellpower: 2, knowledge: 1 } },
            { id: 'mmzamulet13', states: { spellpower: 2, knowledge: 2 } },
            { id: 'mmzamulet16', states: { spellpower: 3, knowledge: 2 } },
            { id: 'mring19', states: { defence: 1, spellpower: 2, knowledge: 1 } },
            { id: 'powercape', states: { spellpower: 2 } },
            { id: 'powerring', states: { spellpower: 1 } },
            { id: 'rashness_ring', states: { initiative: 2 } },
            { id: 'ring19', states: { attack: 3, defence: 3, initiative: 1 } },
            { id: 'samul14', states: { attack: 1, defence: 1, initiative: 1, luck: 1 } },
            { id: 'samul17', states: { attack: 1, defence: 3, morale: 1 } },
            { id: 'samul8', states: { initiative: 3, luck: 1 } },
            { id: 'scloack16', states: { defence: 1 } },
            { id: 'scroll18', states: { defence: 2, spellpower: 2, knowledge: 2 } },
            { id: 'smamul17', states: { defence: 3, spellpower: 1, knowledge: 2 } },

            // shop gift
            { id: 'protazan', states: { attack: 4, initiative: 2 } },
            { id: 'bfly', states: { attack: 1, defence: 2, initiative: 1 } },
            { id: 'bril_pendant', states: { initiative: 2, luck: 1 } },
            { id: 'd_spray', states: { initiative: 5 } },
            { id: 'flowers1', states: { defence: 1 } },
            { id: 'flowers2', states: { attack: 1 } },
            { id: 'flowers3', states: { attack: 2, initiative: 2 } },
            { id: 'flowers4', states: { defence: 3, initiative: 1 } },
            { id: 'flowers5', states: { attack: 3, initiative: 3 } },
            { id: 'half_heart_m', states: { luck: 1 } },
            { id: 'half_heart_w', states: { luck: 1 } },
            { id: 'koltsou', states: { attack: 3, defence: 1, initiative: 2 } },
            { id: 'roses', states: { attack: 4, defence: 2, initiative: 3 } },
            { id: 'bril_ring', states: { initiative: 1, morale: 1 } },
            { id: 'flower_heart', states: { defence: 2, initiative: 1 } },
            { id: 'venok', states: { defence: 1, initiative: 1 } },
            { id: 'wboots', states: { defence: 3, initiative: 3 } },
            { id: 'whelmet', states: { defence: 3, initiative: 2 } },
            { id: 'warmor', states: { defence: 3, initiative: 3 } },
            { id: 'defender_dagger', states: { attack: 1, defence: 1 } },
            { id: 'shpaga', states: { attack: 7, initiative: 2 } },
            { id: 'goldciras', states: { defence: 4, initiative: 1 } },

            // hunter
            { id: 'gm_kastet', states: { attack: 4, initiative: 4 } },
            { id: 'hunter_sword1', states: { attack: 1, initiative: -1 } },
            { id: 'hunterdsword', states: { attack: 2 } },
            { id: 'huntersword2', states: { attack: 3, initiative: 1 } },
            { id: 'sh_4arrows', states: { attack: 1 } },
            { id: 'sh_spear', states: { attack: 10 } },
            { id: 'hunterdagger', states: { attack: 2 } },
            { id: 'sh_bow', states: { attack: 1 } },
            { id: 'gm_sword', states: { attack: 3 } },
            { id: 'sh_sword', states: { attack: 4 } },
            { id: 'hunter_gloves1', states: { defence: 1 } },
            { id: 'hunter_pendant1', states: { initiative: 1 } },
            { id: 'gm_amul', states: { attack: 1, initiative: 2, luck: 1 } },
            { id: 'gm_rring', states: { spellpower: 1, initiative: 1 } },
            { id: 'gm_sring', states: { attack: 1, initiative: 3 } },
            { id: 'hunter_amulet1', states: { attack: 1, luck: 1 } },
            { id: 'hunter_ring2', states: { initiative: 1 } },
            { id: 'neut_amulet', states: { attack: 2, initiative: 4 } },
            { id: 'sh_amulet2', states: { attack: 3, initiative: 3, luck: 1 } },
            { id: 'sh_ring1', states: { attack: 1, defence: 1, initiative: 4 } },
            { id: 'sh_ring2', states: { attack: 4, initiative: 1 } },
            { id: 'hunter_hat1', states: { initiative: 1 } },
            { id: 'hunter_jacket1', states: { initiative: 1 } },
            { id: 'gm_arm', states: { defence: 2, initiative: 3 } },
            { id: 'hunter_armor1', states: { defence: 1, initiative: 2 } },
            { id: 'sh_armor', states: { defence: 3, initiative: 4 } },
            { id: 'gm_defence', states: { defence: 3, initiative: 2 } },
            { id: 'hunter_shield1', states: { defence: 2 } },
            { id: 'huntershield2', states: { defence: 2, initiative: 1 } },
            { id: 'sh_shield', states: { defence: 4, initiative: 3 } },
            { id: 'gm_spdb', states: { defence: 1, initiative: 3 } },
            { id: 'hunter_boots1', states: { initiative: 1 } },
            { id: 'hunter_boots2', states: { defence: 2 } },
            { id: 'hunter_boots3', states: { initiative: 2 } },
            { id: 'sh_boots', states: { defence: 2, initiative: 4 } },
            { id: 'gm_hat', states: { defence: 2, knowledge: 1 } },
            { id: 'hunter_helm', states: { attack: 1, defence: 1 } },
            { id: 'hunter_roga1', states: { initiative: 2 } },
            { id: 'sh_helmet', states: { defence: 3, knowledge: 1, initiative: 1 } },

            // event
            { id: 'brush', states: { attack: 6, initiative: 2 } },
            { id: 'sea_trident', states: { spellpower: 2 } },
            { id: 'tunnel_kirka', states: { attack: 3, initiative: 1 } },
            { id: 'a_mallet', states: { attack: 1 } },
            { id: 'bludgeon', states: { attack: 6, initiative: 4 } },
            { id: 'dem_kosa', states: { attack: 7 } },
            { id: 'dubina', states: { attack: 10, initiative: -3 } },
            { id: 'gdubina', states: { attack: 5, initiative: 1 } },
            { id: 'kopie', states: { attack: 6, defence: 1, initiative: 1 } },
            { id: 'molot_tan', states: { attack: 9, defence: 2, initiative: -2 } },
            { id: 'ogre_bum', states: { attack: 12, initiative: -4 } },
            { id: 'pegaskop', states: { attack: 5, defence: -1, initiative: 5 } },
            { id: 'pen', states: { attack: 6, initiative: 2 } },
            { id: 'pika', states: { attack: 7, initiative: 1 } },
            { id: 'sunart1', states: { attack: 5, defence: 2 } },
            { id: 'windsword', states: { attack: 2, defence: 2, initiative: 4 } },
            { id: 'centaurbow', states: { attack: 1 } },
            { id: 'dem_dtopor', states: { attack: 8, initiative: 1 } },
            { id: 'elfdagger', states: { attack: 2, initiative: 6 } },
            { id: 'goblin_bow', states: { attack: 3 } },
            { id: 'orc_axe', states: { attack: 7, initiative: 2 } },
            { id: 'sniperbow', states: { initiative: 2 } },
            { id: 'sunart2', states: { attack: 3, defence: 4, initiative: 2 } },
            { id: 'topor_skelet', states: { attack: 4, defence: 2 } },
            { id: 'vbow1', states: { attack: 1, defence: 1, initiative: 1 } },
            { id: 'vbow2', states: { attack: 1, initiative: 1 } },
            { id: 'vbow3', states: { attack: 1, initiative: 1 } },
            { id: 'blacksword', states: { attack: 4 } },
            { id: 'blacksword1', states: { attack: 3, defence: 1, spellpower: 1, knowledge: 1 } },
            { id: 'cold_sword2014', states: { attack: 1 + Math.floor(hero_lvl/2) } },
            { id: 'lbow', states: { initiative: Math.floor(hero_lvl/9) } },
            { id: 'dem_dmech', states: { attack: 4, initiative: 1 } },
            { id: 'slayersword', states: { attack: 8, defence: 3 } },
            { id: 'sunart3', states: { attack: 7, defence: 1 } },
            { id: 'sunart4', states: { attack: 7, defence: 2 } },
            { id: '2year_amul_lords', states: { luck: 1 } },
            { id: '3year_amul', states: { luck: 1 } },
            { id: '3year_art', states: { initiative: 1, luck: 1 } },
            { id: '4year_klever', states: { initiative: 1, luck: 1 } },
            { id: '5years_star', states: { attack: 1, initiative: 5 } },
            { id: '6ring', states: { attack: 1, defence: 1, initiative: 2 } },
            { id: '7ka', states: { initiative: 1, luck: 1 } },
            { id: 'dudka', states: { morale: 1 } },
            { id: 'mart8_ring1', states: { initiative: 5 } },
            { id: 'rog_demon', states: { attack: 3, defence: 3, initiative: 2 } },
            { id: 'ru_statue', states: { defence: 1, initiative: 1 } },
            { id: 'sharik', states: { luck: 1, initiative: 1 + Math.floor(hero_lvl/4) } },
            { id: 'snowjinka', states: { initiative: 1, morale: 1 } },
            { id: 'sosulka', states: { initiative: 1, luck: 1 } },
            { id: 'tjam1', states: { attack: 3, initiative: 8 } },
            { id: 'tjam2', states: { attack: 2, initiative: 7 } },
            { id: 'tjam3', states: { attack: 1, initiative: 6 } },
            { id: 'vbolt1', states: { defence: 5 } },
            { id: 'vbolt2', states: { defence: 4 } },
            { id: 'vbolt3', states: { defence: 3 } },
            { id: 'zub', states: { attack: 5, defence: 3, initiative: 2 } },
            { id: '8amul_inf', states: { attack: Math.floor(hero_lvl/6), defence: 1, knowledge: 1 + Math.floor(hero_lvl/7), initiative: 1 + Math.floor(hero_lvl/6) } },
            { id: 'battlem_cape', states: { attack: 1, defence: 1, spellpower: 1, knowledge: 1 } },
            { id: 'blackring', states: { knowledge: 1 } },
            { id: 'quest_pendant1', states: { attack: 1 } },
            { id: 'ring2013', states: { defence: 2 } },
            { id: 'testring', states: { attack: 1, defence: 1, spellpower: 1, knowledge: 1 } },
            { id: 'trinitypendant', states: { attack: 1, spellpower: 1, initiative: 4 } },
            { id: 'ttring', states: { attack: Math.floor(hero_lvl/7), defence: 1 + Math.floor(hero_lvl/10), knowledge: Math.floor(hero_lvl/7), initiative: 1 } },
            { id: 'v-ring1', states: { attack: 1, defence: 2, initiative: 4 } },
            { id: 'v-ring2', states: { attack: 1, defence: 1, initiative: 3 } },
            { id: 'v-ring3', states: { attack: 1, initiative: 3 } },
            { id: 'vtjcloak1', states: { defence: 1, initiative: 3 } },
            { id: 'vtjcloak2', states: { defence: 1, initiative: 2 } },
            { id: 'vtjcloak3', states: { defence: 1, initiative: 1 } },
            { id: 'dragon_crown', states: { attack: 1, defence: 1, knowledge: 1 } },
            { id: 'necrohelm2', states: { spellpower: 4 } },
            { id: 'pir_armor1', states: { defence: 4, spellpower: 1, knowledge: 1, initiative: 2 } },
            { id: 'pir_armor2', states: { defence: 3, spellpower: 1, initiative: 2 } },
            { id: 'pir_armor3', states: { defence: 2, spellpower: 1, initiative: 2 } },
            { id: 'piratehat1', states: { defence: 4, knowledge: 2, initiative: 2 } },
            { id: 'piratehat2', states: { defence: 2, knowledge: 2, initiative: 2 } },
            { id: 'piratehat3', states: { defence: 1, knowledge: 1, initiative: 2 } },
            { id: 'wolfjacket', states: { defence: 2 } },
            { id: 'bshield1', states: { attack: 2, defence: 4, initiative: 1 } },
            { id: 'bshield2', states: { attack: 1, defence: 4, initiative: 1 } },
            { id: 'bshield3', states: { attack: 1, defence: 3, initiative: 1 } },
            { id: 'gargoshield', states: { defence: 4 } },
            { id: 'tj-shield1', states: { defence: 6, initiative: 1 } },
            { id: 'tj-shield2', states: { defence: 5, initiative: 1 } },
            { id: 'tj-shield3', states: { defence: 4, initiative: 1 } },
            { id: 'wshield', states: { attack: 2, defence: 2 } },
            { id: 'tj_vboots1', states: { defence: 6, initiative: 1 } },
            { id: 'tj_vboots2', states: { defence: 5, initiative: 1 } },
            { id: 'tj_vboots3', states: { defence: 4, initiative: 1 } },
            { id: 'necrohelm1', states: { attack: 1, defence: 1 } },
            { id: 'necrohelm3', states: { attack: 3, defence: 3 } },
            { id: 'ogre_helm', states: { defence: 10, initiative: -2 } },
            { id: 'orc_hat', states: { defence: 3, initiative: 3 } },
            { id: 'tj_helmet1', states: { defence: 6, initiative: 1 } },
            { id: 'tj_helmet2', states: { defence: 4, initiative: 1 } },
            { id: 'tj_helmet3', states: { defence: 3, initiative: 1 } },
            { id: 'magneticarmor', states: { defence: 5, spellpower: 1, knowledge: 1 } },
            { id: 'tjarmor1', states: { defence: 6, initiative: 1 } },
            { id: 'tjarmor2', states: { defence: 5, initiative: 1 } },
            { id: 'tjarmor3', states: { defence: 3, initiative: 1 } },
            { id: 'compass', states: { defence: 1, knowledge: 1 } },

            // thief
            { id: 'thief_unique_secretops', states: { attack: 6 } },
            { id: 'thief_arb', states: { attack: 4, initiative: 3 } },
            { id: 'thief_ml_dagger', states: { attack: 1, defence: 1, initiative: 2 } },
            { id: 'tm_arb', states: { attack: 5, initiative: 4 } },
            { id: 'tm_knife', states: { attack: 2, initiative: 3 } },
            { id: 'ring_of_thief', states: { initiative: 6 } },
            { id: 'thief_neckl', states: { initiative: 4, morale: 1, luck: 1 } },
            { id: 'thief_premiumring1', states: { attack: 2, initiative: 7 } },
            { id: 'thief_premiumring2', states: { attack: 2, initiative: 6 } },
            { id: 'thief_premiumring3', states: { attack: 1, initiative: 6 } },
            { id: 'tm_amulet', states: { attack: 1, initiative: 5, morale: 1, luck: 1 } },
            { id: 'tm_cape', states: { initiative: 1 } },
            { id: 'tm_mring', states: { spellpower: 1, knowledge: 2 } },
            { id: 'tm_wring', states: { attack: 2, initiative: 6 } },
            { id: 'thief_msk', states: { defence: 2, initiative: 3 } },
            { id: 'tm_msk', states: { defence: 3, initiative: 4 } },
            { id: 'thief_fastboots', states: { defence: 3, initiative: 3 } },
            { id: 'tm_boots', states: { defence: 3, initiative: 4 } },
            { id: 'thief_goodarmor', states: { defence: 4, initiative: 2 } },
            { id: 'tm_armor', states: { defence: 5, initiative: 4 } },

            // war
            { id: 'bunt_medal1', states: { attack: 2, defence: 2, initiative: 5, luck: 1 } },
            { id: 'bunt_medal2', states: { attack: 2, defence: 1, initiative: 2, luck: 1 } },
            { id: 'bunt_medal3', states: { attack: 1, initiative: 1, luck: 1 } },
            { id: 'bwar_splo', states: { attack: 1, defence: 1, initiative: 1, morale: 1, luck: 1 } },
            { id: 'bwar_stoj', states: { defence: 6, luck: 1 } },
            { id: 'bwar_takt', states: { initiative: 6, luck: 1 } },
            { id: 'bwar1', states: { attack: 4, defence: 4, initiative: 5, luck: 1 } },
            { id: 'bwar2', states: { attack: 3, defence: 3, initiative: 4, luck: 1 } },
            { id: 'bwar3', states: { attack: 3, defence: 3, initiative: 2, luck: 1 } },
            { id: 'bwar4', states: { attack: 2, defence: 2, initiative: 2, luck: 1 } },
            { id: 'bwar5', states: { attack: 2, defence: 1, initiative: 2, luck: 1 } },
            { id: 'bwar6', states: { attack: 1, defence: 1, initiative: 2, luck: 1 } },
            { id: 'bwar7', states: { attack: 1, defence: 1, initiative: 1, luck: 1 } },
            { id: 'demwar1', states: { attack: 3, defence: 3, initiative: 4, morale: 1, luck: 1 } },
            { id: 'demwar2', states: { attack: 2, defence: 2, initiative: 3, morale: 1, luck: 1 } },
            { id: 'demwar3', states: { attack: 2, defence: 2, initiative: 3, luck: 1 } },
            { id: 'demwar4', states: { attack: 2, defence: 1, initiative: 2, luck: 1 } },
            { id: 'demwar5', states: { attack: 2, defence: 1, initiative: 2 } },
            { id: 'demwar6', states: { attack: 2, initiative: 2 } },
            { id: 'elfwar1', states: { attack: 3, defence: 2, initiative: 5, luck: 2 } },
            { id: 'elfwar2', states: { attack: 3, defence: 2, initiative: 5, luck: 1 } },
            { id: 'elfwar3', states: { attack: 2, defence: 2, initiative: 3, luck: 1 } },
            { id: 'elfwar4', states: { attack: 2, defence: 1, initiative: 2, luck: 1 } },
            { id: 'elfwar5', states: { attack: 2, defence: 1, initiative: 1, luck: 1 } },
            { id: 'elfwar6', states: { attack: 1, defence: 1, luck: 1 } },
            { id: 'gnomewar_splo', states: { attack: 1, defence: 1, initiative: 1, morale: 1, luck: 1 } },
            { id: 'gnomewar_stoj', states: { defence: 6, luck: 1 } },
            { id: 'gnomewar_takt', states: { initiative: 6, luck: 1 } },
            { id: 'gnomewar1', states: { attack: 4, defence: 4, initiative: 5, luck: 1 } },
            { id: 'gnomewar2', states: { attack: 3, defence: 3, initiative: 4, luck: 1 } },
            { id: 'gnomewar3', states: { attack: 3, defence: 3, initiative: 2, luck: 1 } },
            { id: 'gnomewar4', states: { attack: 2, defence: 2, initiative: 2, luck: 1 } },
            { id: 'gnomewar5', states: { attack: 2, defence: 1, initiative: 2, luck: 1 } },
            { id: 'gnomewar6', states: { attack: 1, defence: 1, initiative: 2, luck: 1 } },
            { id: 'gnomewar7', states: { attack: 1, defence: 1, initiative: 1, luck: 1 } },
            { id: 'kwar_splo', states: { attack: 1, defence: 1, initiative: 1, morale: 1, luck: 1 } },
            { id: 'kwar_stoj', states: { defence: 6, luck: 1 } },
            { id: 'kwar_takt', states: { initiative: 6, luck: 1 } },
            { id: 'kwar1', states: { attack: 4, defence: 4, initiative: 5, luck: 1 } },
            { id: 'kwar2', states: { attack: 3, defence: 3, initiative: 4, luck: 1 } },
            { id: 'kwar3', states: { attack: 3, defence: 3, initiative: 2, luck: 1 } },
            { id: 'kwar4', states: { attack: 2, defence: 2, initiative: 2, luck: 1 } },
            { id: 'kwar5', states: { attack: 2, defence: 1, initiative: 2, luck: 1 } },
            { id: 'kwar6', states: { attack: 1, defence: 1, initiative: 2, luck: 1 } },
            { id: 'kwar7', states: { attack: 1, defence: 1, initiative: 1, luck: 1 } },
            { id: 'magewar1', states: { attack: 3, knowledge: 2, initiative: 3, luck: 1 } },
            { id: 'magewar2', states: { attack: 2, knowledge: 1, initiative: 3, luck: 1 } },
            { id: 'magewar3', states: { attack: 1, knowledge: 1, initiative: 2, luck: 1 } },
            { id: 'magewar4', states: { knowledge: 1, initiative: 1, luck: 1 } },
            { id: 'magewar5', states: { attack: 1, initiative: 1, luck: 1 } },
            { id: 'necrwar1st', states: { attack: 3, defence: 2, spellpower: 1, initiative: 4, morale: 1, luck: 1 } },
            { id: 'necrwar2st', states: { attack: 3, defence: 2, initiative: 3, luck: 1 } },
            { id: 'necrwar3st', states: { attack: 2, defence: 2, initiative: 2 } },
            { id: 'necrwar4st', states: { attack: 2, defence: 2 } },
            { id: 'necrwar5st', states: { attack: 2 } },
            { id: 'tl_medal1', states: { attack: 1, defence: 1, initiative: 3, morale: 1, luck: 1 } },
            { id: 'tl_medal2', states: { attack: 1, defence: 1, luck: 1 } },
            { id: 'tl_medal3', states: { defence: 1, luck: 1 } },
            { id: 'warthief_medal1', states: { attack: 3, initiative: 3, luck: 1 } },
            { id: 'warthief_medal2', states: { attack: 3, initiative: 1, luck: 1 } },
            { id: 'warthief_medal3', states: { attack: 2, initiative: 1, luck: 1 } },
            { id: 'warthief_medal4', states: { attack: 2, initiative: 1 } },
            { id: 'warthief_medal5', states: { attack: 1, defence: 1, initiative: 1 } },

            // verb
            { id: 'verb11_sword', states: { attack: 8, defence: 2 } },
            { id: 'vrb_shild', states: { defence: 4 } },
            { id: 'verbboots', states: { defence: 4 } },
            { id: 've_helm', states: { defence: 4 } },
            { id: 'v_1armor', states: { defence: 4 } },

            //tactic
            { id: 'tactmag_staff', states: { defence: 1, spellpower: 5 } },
            { id: 'tact765_bow', states: { attack: 1 } },
            { id: 'tactaz_axe', states: { attack: 7, defence: 1 } },
            { id: 'tactsm0_dagger', states: { attack: 3, defence: 2 } },
            { id: 'tact1w1_wamulet', states: { attack: 3, defence: 2, initiative: 5 } },
            { id: 'tactms1_mamulet', states: { spellpower: 5 } },
            { id: 'tactpow_cloack', states: { spellpower: 3 } },
            { id: 'tactspw_mring', states: { spellpower: 3 } },
            { id: 'tactwww_wring', states: { attack: 4, initiative: 2 } },
            { id: 'tactdff_shield', states: { attack: 1, defence: 4 } },
            { id: 'tactzl4_boots', states: { defence: 5, initiative: 1 } },
            { id: 'tacthapp_helmet', states: { defence: 5 } },
            { id: 'tactcv1_armor', states: { defence: 6 } },

            // relict
            { id: 'barb_club', states: { attack: 5, defence: 2 } },
            { id: 'gnomehammer', states: { attack: 6, defence: 3 } },
            { id: 'gnomem_hammer', states: { attack: 5, defence: 2, initiative: 1 } },
            { id: 'sv_weap', states: { attack: 8 } },
            { id: 'amf_weap', states: { attack: 1, defence: 1, spellpower: 2, knowledge: 3 } },
            { id: 'darkelfstaff', states: { attack: 2, spellpower: 3, knowledge: 1 } },
            { id: 'druid_staff', states: { attack: 6, spellpower: 1, knowledge: 1, initiative: 3 } },
            { id: 'gmage_staff', states: { attack: 1, spellpower: 3, knowledge: 3 } },
            { id: 'inq_weap', states: { attack: 5, defence: 5, spellpower: 1, knowledge: 1 } },
            { id: 'mage_staff', states: { attack: 1, spellpower: 2, knowledge: 3 } },
            { id: 'necr_staff', states: { attack: 1, defence: 1, spellpower: 2, knowledge: 2 } },
            { id: 'dem_axe', states: { attack: 6, spellpower: 2 } },
            { id: 'merc_dagger', states: { attack: 2, defence: 2, initiative: 2 } },
            { id: 'paladin_bow', states: { attack: 3 } },
            { id: 'sv_arb', states: { attack: 5 } },
            { id: 'welfbow', states: { initiative: 1 } },
            { id: 'kn_weap', states: { attack: 5, defence: 4 } },
            { id: 'knightsword', states: { attack: 7, defence: 2 } },
            { id: 'merc_sword', states: { attack: 3, defence: 2, initiative: 3 } },
            { id: 'nv_weap', states: { attack: 10 } },
            { id: 'paladin_sword', states: { attack: 3, defence: 3, spellpower: 1, knowledge: 1 } },
            { id: 'welfsword', states: { attack: 7, initiative: 3 } },
            { id: 'amf_cl', states: { defence: 1, spellpower: 3, knowledge: 1 } },
            { id: 'amf_scroll', states: { spellpower: 4 } },
            { id: 'darkelfpendant', states: { attack: 1, spellpower: 3, knowledge: 1 } },
            { id: 'gmage_cloack', states: { spellpower: 2, knowledge: 1 } },
            { id: 'gmage_scroll', states: { spellpower: 3, knowledge: 2 } },
            { id: 'mage_scroll', states: { spellpower: 2, knowledge: 2 } },
            { id: 'darkelfcloack', states: { defence: 2, spellpower: 2 } },
            { id: 'dem_amulet', states: { attack: 3, defence: 2, spellpower: 1, knowledge: 1, initiative: 1 } },
            { id: 'druid_amulet', states: { attack: 1, defence: 1, spellpower: 1, knowledge: 1, initiative: 2, morale: 1, luck: 1 } },
            { id: 'druid_cloack', states: { spellpower: 1, knowledge: 1, initiative: 3 } },
            { id: 'elfamulet', states: { initiative: 5, luck: 2 } },
            { id: 'gnomem_amulet', states: { attack: 5, initiative: 3, luck: 1 } },
            { id: 'inq_cl', states: { defence: 4, spellpower: 1 } },
            { id: 'mage_cape', states: { spellpower: 1, knowledge: 2 } },
            { id: 'necr_amulet', states: { defence: 2, spellpower: 1, knowledge: 2 } },
            { id: 'amf_boot', states: { spellpower: 3, knowledge: 1 } },
            { id: 'darkelfkaska', states: { defence: 2, spellpower: 1, knowledge: 1 } },
            { id: 'druid_armor', states: { defence: 4, knowledge: 1, initiative: 3 } },
            { id: 'elfshirt', states: { defence: 2, initiative: 5 } },
            { id: 'gmage_armor', states: { defence: 3, spellpower: 2, knowledge: 2 } },
            { id: 'gmage_crown', states: { defence: 2, spellpower: 1, knowledge: 2 } },
            { id: 'lizard_armor', states: { defence: 1, initiative: 1 } },
            { id: 'mage_hat', states: { spellpower: 1, knowledge: 2 } },
            { id: 'mage_robe', states: { defence: 1, spellpower: 1, knowledge: 2 } },
            { id: 'necr_helm', states: { defence: 2, spellpower: 1, knowledge: 2 } },
            { id: 'necr_robe', states: { defence: 1, spellpower: 1, knowledge: 2 } },
            { id: 'welfboots', states: { defence: 3, initiative: 3 } },
            { id: 'barb_armor', states: { attack: 2, defence: 4 } },
            { id: 'darkelfciras', states: { defence: 3, spellpower: 2 } },
            { id: 'dem_armor', states: { defence: 5, spellpower: 2 } },
            { id: 'merc_armor', states: { defence: 5, initiative: 1 } },
            { id: 'barb_shield', states: { attack: 2, defence: 4 } },
            { id: 'dem_bootshields', states: { attack: 2, defence: 5 } },
            { id: 'dem_shield', states: { attack: 2, defence: 5 } },
            { id: 'gnomem_shield', states: { defence: 7 } },
            { id: 'gnomeshield', states: { defence: 6 } },
            { id: 'kn_shield', states: { defence: 6 } },
            { id: 'knightshield', states: { attack: 1, defence: 5 } },
            { id: 'nv_shield', states: { attack: 2, defence: 4, initiative: 1 } },
            { id: 'paladin_shield', states: { defence: 6 } },
            { id: 'sv_shield', states: { attack: 4, defence: 2 } },
            { id: 'welfshield', states: { defence: 3, initiative: 3 } },
            { id: 'barb_boots', states: { attack: 1, defence: 1, initiative: 4 } },
            { id: 'darkelfboots', states: { defence: 3, spellpower: 1, initiative: 2 } },
            { id: 'druid_boots', states: { defence: 3, knowledge: 1, initiative: 3 } },
            { id: 'elfboots', states: { defence: 2, initiative: 5 } },
            { id: 'gmage_boots', states: { defence: 2, spellpower: 1, knowledge: 1 } },
            { id: 'gnomeboots', states: { defence: 5 } },
            { id: 'gnomem_boots', states: { defence: 4, initiative: 1 } },
            { id: 'inq_boot', states: { defence: 5, knowledge: 2 } },
            { id: 'knightboots', states: { attack: 1, defence: 4 } },
            { id: 'lizard_boots', states: { defence: 1, initiative: 1 } },
            { id: 'mage_boots', states: { defence: 2, knowledge: 1, initiative: 3 } },
            { id: 'merc_boots', states: { defence: 1, initiative: 5 } },
            { id: 'nv_boot', states: { attack: 1, defence: 4, initiative: 1 } },
            { id: 'paladin_boots', states: { defence: 5, knowledge: 1 } },
            { id: 'sv_boot', states: { attack: 2, defence: 3 } },
            { id: 'amf_helm', states: { defence: 1, spellpower: 3, knowledge: 1 } },
            { id: 'barb_helm', states: { attack: 2, defence: 2 } },
            { id: 'dem_helmet', states: { defence: 4, knowledge: 2 } },
            { id: 'gnomehelmet', states: { defence: 5 } },
            { id: 'gnomem_helmet', states: { defence: 4 } },
            { id: 'inq_helm', states: { defence: 3, knowledge: 2 } },
            { id: 'kn_helm', states: { defence: 5 } },
            { id: 'knighthelmet', states: { attack: 1, defence: 4 } },
            { id: 'lizard_helm', states: { defence: 1, initiative: 1 } },
            { id: 'nv_helm', states: { attack: 1, defence: 4, initiative: 1 } },
            { id: 'paladin_helmet', states: { defence: 4, knowledge: 1 } },
            { id: 'sv_helm', states: { attack: 3, defence: 3 } },
            { id: 'welfhelmet', states: { defence: 2, initiative: 3 } },
            { id: 'amf_body', states: { attack: 1, defence: 2, spellpower: 3, knowledge: 1 } },
            { id: 'gnomearmor', states: { defence: 6 } },
            { id: 'gnomem_armor', states: { defence: 5, initiative: 1 } },
            { id: 'inq_body', states: { defence: 6, knowledge: 2 } },
            { id: 'kn_body', states: { defence: 6 } },
            { id: 'knightarmor', states: { attack: 1, defence: 5 } },
            { id: 'nv_body', states: { attack: 1, defence: 5, initiative: 1 } },
            { id: 'paladin_armor', states: { defence: 6, knowledge: 1 } },
            { id: 'sv_body', states: { attack: 3, defence: 5 } },
            { id: 'welfarmor', states: { defence: 4, initiative: 3 } },

            // ranger
            { id: 'r_magy_staff', states: { attack: 1, spellpower: 3, knowledge: 2, initiative: 2 } },
            { id: 'r_dagger', states: { attack: 2, defence: 3, initiative: 3 } },
            { id: 'r_bigsword', states: { attack: 7, initiative: 2 } },
            { id: 'r_goodscroll', states: { spellpower: 2, knowledge: 2 } },
            { id: 'r_m_amulet', states: { spellpower: 2, knowledge: 3, initiative: 1 } },
            { id: 'r_magicsring', states: { spellpower: 1, knowledge: 2, initiative: 1 } },
            { id: 'r_warring', states: { attack: 1, initiative: 3, morale: 1 } },
            { id: 'r_warriorsamulet', states: { initiative: 6, luck: 2 } },
            { id: 'r_zarmor', states: { defence: 3, initiative: 3 } },
            { id: 'r_bootsmb', states: { defence: 3, initiative: 3 } },
            { id: 'r_helmb', states: { defence: 3, initiative: 3 } },
            { id: 'r_clck', states: { spellpower: 3, initiative: 1 } },
        ];

        function set_a_state(art){
            for(var i = 0; i < a_states.length; ++i)
                if(a_states[i].id == art.id){
                    var a = a_states[i];

                    if(a.states.attack)
                        art.states.attack = a.states.attack;
                    if(a.states.defence)
                        art.states.defence = a.states.defence;
                    if(a.states.spellpower)
                        art.states.spellpower = a.states.spellpower;
                    if(a.states.knowledge)
                        art.states.knowledge = a.states.knowledge;
                    if(a.states.initiative)
                        art.states.initiative = a.states.initiative;
                    if(a.states.morale)
                        art.states.morale = a.states.morale;
                    if(a.states.luck)
                        art.states.luck = a.states.luck;

                    break;
                }
        }

        var a_ex_states = [
            // shop weapon
            { id: 'sword18', ex_states: { increase_close_combat_damage: 10 } },
            { id: 'bow14', ex_states: { increase_range_combat_damage: 18 } },
            { id: 'bow17', ex_states: { increase_range_combat_damage: 20 } },
            { id: 'composite_bow', ex_states: { increase_range_combat_damage: 15 } },
            { id: 'long_bow', ex_states: { increase_range_combat_damage: 10 } },
            { id: 'shortbow', ex_states: { increase_range_combat_damage: 5 } },
            { id: 'firsword15', ex_states: { increase_close_combat_damage: 9 } },
            { id: 'mif_sword', ex_states: { increase_close_combat_damage: 5 } },
            { id: 'mm_sword', ex_states: { increase_close_combat_damage: 7 } },
            { id: 'ssword10', ex_states: { increase_close_combat_damage: 4 } },
            { id: 'ssword13', ex_states: { increase_close_combat_damage: 5 } },
            { id: 'ssword16', ex_states: { increase_close_combat_damage: 6 } },

            // shop armor
            { id: 'mhelmetzh13', ex_states: { magic_protection: 3 } },
            { id: 'robewz15', ex_states: { magic_protection: 3 } },
            { id: 'wiz_boots', ex_states: { hero_initiative: 10 } },
            { id: 'xymhelmet15', ex_states: { magic_protection: 5 } },
            { id: 'armor17', ex_states: { magic_protection: 9, close_combat_protection: 9 } },
            { id: 'mif_light', ex_states: { magic_protection: 5 } },
            { id: 'sarmor13', ex_states: { close_combat_protection: 5 } },
            { id: 'sarmor16', ex_states: { close_combat_protection: 6 } },
            { id: 'sarmor9', ex_states: { magic_protection: 3 } },
            { id: 'large_shield', ex_states: { range_combat_protection: 5 } },
            { id: 'shield13', ex_states: { range_combat_protection: 10 } },
            { id: 'shield16', ex_states: { range_combat_protection: 15 } },
            { id: 'shield19', ex_states: { range_combat_protection: 17 } },
            { id: 'sshield11', ex_states: { range_combat_protection: 5 } },
            { id: 'sshield14', ex_states: { range_combat_protection: 6 } },
            { id: 'sshield17', ex_states: { range_combat_protection: 7 } },
            { id: 'boots13', ex_states: { magic_protection: 7 } },
            { id: 'boots15', ex_states: { magic_protection: 7, close_combat_protection: 3 } },
            { id: 'boots17', ex_states: { magic_protection: 9, close_combat_protection: 6 } },
            { id: 'mboots14', ex_states: { magic_protection: 5, hero_initiative: 10 } },
            { id: 'mboots17', ex_states: { magic_protection: 10, hero_initiative: 10 } },
            { id: 'mif_hboots', ex_states: { magic_protection: 5 } },
            { id: 'mif_lboots', ex_states: { magic_protection: 5 } },
            { id: 'sboots12', ex_states: { magic_protection: 3 } },
            { id: 'sboots16', ex_states: { magic_protection: 5 } },
            { id: 'helmet17', ex_states: { magic_protection: 9, close_combat_protection: 5 } },
            { id: 'mhelmet17', ex_states: { magic_protection: 10 } },
            { id: 'mif_hhelmet', ex_states: { magic_protection: 5 } },
            { id: 'mif_lhelmet', ex_states: { magic_protection: 5 } },
            { id: 'myhelmet15', ex_states: { magic_protection: 7, close_combat_protection: 2 } },
            { id: 'shelm12', ex_states: { magic_protection: 5 } },
            { id: 'shelm16', ex_states: { magic_protection: 5 } },
            { id: 'zxhelmet13', ex_states: { magic_protection: 5 } },
            { id: 'armor15', ex_states: { magic_protection: 7, close_combat_protection: 7 } },
            { id: 'full_plate', ex_states: { close_combat_protection: 5 } },
            { id: 'marmor17', ex_states: { magic_protection: 10, hero_initiative: 5 } },
            { id: 'miff_plate', ex_states: { magic_protection: 5, close_combat_protection: 5 } },

            // shop jewelry
            { id: 'antimagic_cape', ex_states: { magic_protection: 15 } },
            { id: 'mamulet19', ex_states: { hero_initiative: 5 } },
            { id: 'scloack16', ex_states: { range_combat_protection: 14 } },
            { id: 'scloack8', ex_states: { range_combat_protection: 12 } },
            { id: 'scoutcloack', ex_states: { range_combat_protection: 5 } },

            // shop gift
            { id: 'shpaga', ex_states: { increase_close_combat_damage: 5 } },

            // hunter
            { id: 'hunterdsword', ex_states: { increase_close_combat_damage: 10 } },
            { id: 'hunter_bow1', ex_states: { increase_range_combat_damage: 5 } },
            { id: 'gm_sword', ex_states: { increase_close_combat_damage: 15 } },
            { id: 'sh_sword', ex_states: { increase_close_combat_damage: 20 } },
            { id: 'gm_protect', ex_states: { range_combat_protection: 20 } },
            { id: 'hunter_mask1', ex_states: { range_combat_protection: 10 } },
            { id: 'sh_cloak', ex_states: { range_combat_protection: 25 } },
            { id: 'hunter_ring2', ex_states: { hero_initiative: 7 } },

            // event
            { id: 'cold_sword2014', ex_states: { increase_close_combat_damage: Math.floor(hero_lvl/2), increase_range_combat_damage: Math.floor(hero_lvl/2) } },
            { id: 'lbow', ex_states: { increase_range_combat_damage: 3 + hero_lvl } },
            { id: 'brush', ex_states: { increase_close_combat_damage: 5 } },
            { id: 'dem_kosa', ex_states: { increase_close_combat_damage: 5 } },
            { id: 'dubina', ex_states: { increase_close_combat_damage: 8 } },
            { id: 'kopie', ex_states: { increase_range_combat_damage: 8 } },
            { id: 'molot_tan', ex_states: { increase_close_combat_damage: 9 } },
            { id: 'ogre_bum', ex_states: { increase_close_combat_damage: 10 } },
            { id: 'pegaskop', ex_states: { increase_close_combat_damage: 15 } },
            { id: 'pen', ex_states: { increase_close_combat_damage: 5 } },
            { id: 'windsword', ex_states: { increase_close_combat_damage: 5 } },
            { id: 'centaurbow', ex_states: { increase_range_combat_damage: 11 } },
            { id: 'dem_dtopor', ex_states: { increase_close_combat_damage: 5 } },
            { id: 'elfdagger', ex_states: { increase_close_combat_damage: 5 } },
            { id: 'goblin_bow', ex_states: { increase_range_combat_damage: 4 } },
            { id: 'orc_axe', ex_states: { increase_range_combat_damage: 5, increase_close_combat_damage: 6 } },
            { id: 'sniperbow', ex_states: { increase_range_combat_damage: 20 } },
            { id: 'sunart2', ex_states: { increase_range_combat_damage: 7 } },
            { id: 'vbow1', ex_states: { increase_range_combat_damage: 15 } },
            { id: 'vbow2', ex_states: { increase_range_combat_damage: 9 } },
            { id: 'vbow3', ex_states: { increase_range_combat_damage: 5 } },
            { id: 'slayersword', ex_states: { increase_close_combat_damage: 6 } },
            { id: 'sunart3', ex_states: { increase_close_combat_damage: 8 } },
            { id: 'sunart4', ex_states: { close_combat_protection: 7, increase_close_combat_damage: 7 } },
            { id: 'battlem_cape', ex_states: { magic_protection: 10, range_combat_protection: 15 } },
            { id: 'vtjcloak1', ex_states: { magic_protection: 10, range_combat_protection: 10 } },
            { id: 'vtjcloak2', ex_states: { magic_protection: 8, range_combat_protection: 8 } },
            { id: 'vtjcloak3', ex_states: { magic_protection: 5, range_combat_protection: 5 } },
            { id: 'pir_armor1', ex_states: { range_combat_protection: 7 } },
            { id: 'pir_armor2', ex_states: { range_combat_protection: 5 } },
            { id: 'pir_armor3', ex_states: { range_combat_protection: 3 } },
            { id: 'piratehat1', ex_states: { range_combat_protection: 7 } },
            { id: 'piratehat2', ex_states: { range_combat_protection: 5 } },
            { id: 'piratehat3', ex_states: { range_combat_protection: 3 } },
            { id: 'gargoshield', ex_states: { magic_protection: 12 } },
            { id: 'magneticarmor', ex_states: { magic_protection: 15, close_combat_protection: 10 } },
            { id: 'compass', ex_states: { magic_protection: 30 } },

            // thief
            { id: 'thief_ml_dagger', ex_states: { increase_close_combat_damage: 10 } },
            { id: 'tm_knife', ex_states: { increase_close_combat_damage: 13 } },
            { id: 'thief_cape', ex_states: { range_combat_protection: 24 } },
            { id: 'tm_cape', ex_states: { range_combat_protection: 30 } },
            { id: 'tm_mring', ex_states: { hero_initiative: 3 } },
            { id: 'tm_msk', ex_states: { magic_protection: 9 } },
            { id: 'tm_boots', ex_states: { magic_protection: 9 } },
            { id: 'tm_armor', ex_states: { magic_protection: 9 } },

            // verb
            { id: 'verb11_sword', ex_states: { increase_close_combat_damage: 5 } },
            { id: 'vrb_shild', ex_states: { range_combat_protection: 20 } },
            { id: 'verbboots', ex_states: { magic_protection: 10, close_combat_protection: 5 } },
            { id: 've_helm', ex_states: { magic_protection: 10, close_combat_protection: 5 } },
            { id: 'v_1armor', ex_states: { magic_protection: 12, close_combat_protection: 12 } },
            { id: 'tact765_bow', ex_states: { increase_range_combat_damage: 17 } },
            { id: 'tactaz_axe', ex_states: { increase_close_combat_damage: 10 } },
            { id: 'tactsm0_dagger', ex_states: { increase_close_combat_damage: 7 } },
            { id: 'tactdff_shield', ex_states: { range_combat_protection: 15 } },
            { id: 'tactzl4_boots', ex_states: { magic_protection: 7, close_combat_protection: 3 } },
            { id: 'tacthapp_helmet', ex_states: { magic_protection: 5, close_combat_protection: 3 } },
            { id: 'tactcv1_armor', ex_states: { magic_protection: 7, close_combat_protection: 7 } },
            { id: 'gnomem_hammer', ex_states: { increase_close_combat_damage: 10 } },
            { id: 'sv_weap', ex_states: { increase_close_combat_damage: 20 } },
            { id: 'elfbow', ex_states: { increase_range_combat_damage: 25 } },
            { id: 'paladin_bow', ex_states: { increase_range_combat_damage: 10 } },
            { id: 'sv_arb', ex_states: { increase_range_combat_damage: 15 } },
            { id: 'welfbow', ex_states: { increase_range_combat_damage: 12 } },
            { id: 'paladin_sword', ex_states: { increase_close_combat_damage: 15 } },
            { id: 'gmage_cloack', ex_states: { range_combat_protection: 10 } },
            { id: 'druid_cloack', ex_states: { magic_protection: 5, range_combat_protection: 10 } },
            { id: 'inq_cl', ex_states: { magic_protection: 7, range_combat_protection: 15 } },
            { id: 'amf_boot', ex_states: { hero_initiative: 10 } },
            { id: 'druid_armor', ex_states: { magic_protection: 5 } },
            { id: 'dem_armor', ex_states: { magic_protection: 3, close_combat_protection: 4 } },
            { id: 'dem_bootshields', ex_states: { close_combat_protection: 4 } },
            { id: 'dem_shield', ex_states: { close_combat_protection: 4 } },
            { id: 'paladin_shield', ex_states: { range_combat_protection: 10 } },
            { id: 'sv_shield', ex_states: { range_combat_protection: 6 } },
            { id: 'druid_boots', ex_states: { magic_protection: 5 } },
            { id: 'gmage_boots', ex_states: { hero_initiative: 15 } },
            { id: 'gnomem_boots', ex_states: { magic_protection: 10 } },
            { id: 'inq_boot', ex_states: { magic_protection: 7 } },
            { id: 'paladin_boots', ex_states: { magic_protection: 5 } },
            { id: 'sv_boot', ex_states: { magic_protection: 5 } },
            { id: 'dem_helmet', ex_states: { close_combat_protection: 3 } },
            { id: 'gnomem_helmet', ex_states: { magic_protection: 10 } },
            { id: 'inq_helm', ex_states: { magic_protection: 5 } },
            { id: 'paladin_helmet', ex_states: { magic_protection: 5 } },
            { id: 'sv_helm', ex_states: { magic_protection: 5 } },
            { id: 'gnomem_armor', ex_states: { magic_protection: 10 } },
            { id: 'inq_body', ex_states: { magic_protection: 7 } },
            { id: 'paladin_armor', ex_states: { magic_protection: 5 } },
            { id: 'sv_body', ex_states: { magic_protection: 5 } },
            { id: 'r_bow', ex_states: { increase_range_combat_damage: 20 } },
            { id: 'r_bigsword', ex_states: { increase_close_combat_damage: 11 } },
            { id: 'r_zarmor', ex_states: { magic_protection: 12, close_combat_protection: 9 } },
            { id: 'r_bootsmb', ex_states: { magic_protection: 12, close_combat_protection: 5 } },
            { id: 'r_helmb', ex_states: { magic_protection: 12, close_combat_protection: 4 } },
            { id: 'r_clck', ex_states: { range_combat_protection: 10 } },
        ];

        function set_a_ex_state(art){
            for(var i = 0; i < a_ex_states.length; ++i)
                if(a_ex_states[i].id == art.id){
                    var a = a_ex_states[i];

                    if(a.ex_states.magic_protection)
                        art.ex_states.magic_protection = a.ex_states.magic_protection;
                    if(a.ex_states.close_combat_protection)
                        art.ex_states.close_combat_protection = a.ex_states.close_combat_protection;
                    if(a.ex_states.hero_initiative)
                        art.ex_states.hero_initiative = a.ex_states.hero_initiative;
                    if(a.ex_states.range_combat_protection)
                        art.ex_states.range_combat_protection = a.ex_states.range_combat_protection;
                    if(a.ex_states.increase_range_combat_damage)
                        art.ex_states.increase_range_combat_damage = a.ex_states.increase_range_combat_damage;
                    if(a.ex_states.increase_close_combat_damage)
                        art.ex_states.increase_close_combat_damage = a.ex_states.increase_close_combat_damage;

                    break;
                }
        }

        var a_unique_states = [
            // to be defined
        ];

        function set_a_unique_state(art){
            for(var i = 0; i < a_unique_states.length; ++i)
                if(a_high_durability[i].id == art.id){
                    var a = a_unique_states[i];

                    break;
                }
        }

        this.artefacts = [
            // shop weapon
            new Artefact('staff', 'Боевой посох ', 5, 40, 6, 2527, this.enum_ak.shop, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('sword18', 'Гладий предвестия', 18, 70, 12, 17755, this.enum_ak.shop, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('wood_sword', 'Деревянный меч', 1, 7, 1, 133, this.enum_ak.shop, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('long_bow', 'Длинный лук', 6, 50, 4, 6317, this.enum_ak.shop, enum_at.weapon, this.enum_as.rear),
            new Artefact('dagger', 'Кинжал мести', 3, 30, 1, 912, this.enum_ak.shop, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('shortbow', 'Короткий лук', 4, 20, 1, 342, this.enum_ak.shop, enum_at.weapon, this.enum_as.rear),
            new Artefact('gnome_hammer', 'Легкий топорик', 2, 25, 2, 294, this.enum_ak.shop, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('bow14', 'Лук полуночи', 14, 65, 6, 9946, this.enum_ak.shop, enum_at.weapon, this.enum_as.rear),
            new Artefact('bow17', 'Лук рассвета', 17, 65, 7, 10108, this.enum_ak.shop, enum_at.weapon, this.enum_as.rear),
            new Artefact('power_sword', 'Меч власти', 7, 80, 8, 9775, this.enum_ak.shop, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('requital_sword', 'Меч возмездия', 5, 40, 5, 2527, this.enum_ak.shop, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('firsword15', 'Меч возрождения', 15, 70, 11, 17670, this.enum_ak.shop, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('ssword16', 'Меч гармонии', 16, 46, 11, 6051, this.enum_ak.shop, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('ssword8', 'Меч жесткости', 8, 40, 8, 3838, this.enum_ak.shop, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('ssword10', 'Меч отваги', 10, 45, 9, 4854, this.enum_ak.shop, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('broad_sword', 'Меч равновесия', 6, 60, 6, 4721, this.enum_ak.shop, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('def_sword', 'Меч расправы', 3, 40, 3, 1292, this.enum_ak.shop, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('mif_sword', 'Мифриловый меч', 9, 70, 9, 16957, this.enum_ak.shop, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('mif_staff', 'Мифриловый посох', 9, 70, 9, 16387, this.enum_ak.shop, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('ssword13', 'Обсидиановый меч', 13, 50, 10, 5985, this.enum_ak.shop, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('mstaff13', 'Обсидиановый посох', 13, 40, 10, 4797, this.enum_ak.shop, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('mstaff8', 'Посох весны', 8, 30, 8, 2888, this.enum_ak.shop, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('smstaff16', 'Посох забвения', 16, 37, 11, 4883, this.enum_ak.shop, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('staff18', 'Посох затмения', 18, 70, 12, 17746, this.enum_ak.shop, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('sor_staff', 'Посох могущества', 7, 50, 8, 6118, this.enum_ak.shop, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('ffstaff15', 'Посох повелителя огня', 15, 70, 11, 17679, this.enum_ak.shop, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('mstaff10', 'Посох теней', 10, 35, 9, 3781, this.enum_ak.shop, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('mm_sword', 'Рубиновый меч', 12, 70, 10, 17195, this.enum_ak.shop, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('mm_staff', 'Рубиновый посох', 12, 70, 10, 16986, this.enum_ak.shop, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('composite_bow', 'Составной лук', 11, 55, 5, 8246, this.enum_ak.shop, enum_at.weapon, this.enum_as.rear),
            new Artefact('steel_blade', 'Стальной клинок', 3, 30, 2, 465, this.enum_ak.shop, enum_at.weapon, this.enum_as.right_arm),

            // shop armor
            new Artefact('large_shield', 'Башенный щит', 10, 70, 6, 9576, this.enum_ak.shop, enum_at.armor, this.enum_as.left_arm),
            new Artefact('hauberk', 'Боевая кольчуга', 5, 40, 3, 2289, this.enum_ak.shop, enum_at.armor, this.enum_as.body),
            new Artefact('boots2', 'Боевые сапоги', 5, 35, 2, 1026, this.enum_ak.shop, enum_at.armor, this.enum_as.body),
            new Artefact('armor15', 'Доспех пламени', 15, 70, 8, 9310, this.enum_ak.shop, enum_at.armor, this.enum_as.body),
            new Artefact('marmor17', 'Доспехи сумерек', 17, 70, 9, 9310, this.enum_ak.shop, enum_at.armor, this.enum_as.body),
            new Artefact('sarmor16', 'Кираса благородства', 16, 44, 8, 4351, this.enum_ak.shop, enum_at.armor, this.enum_as.body),
            new Artefact('armor17', 'Кираса рассвета', 17, 70, 9, 9490, this.enum_ak.shop, enum_at.armor, this.enum_as.body),
            new Artefact('leather_shiled', 'Кожаная броня', 1, 18, 1, 266, this.enum_ak.shop, enum_at.armor, this.enum_as.body),
            new Artefact('leatherhat', 'Кожаная шляпа', 1, 12, 1, 171, this.enum_ak.shop, enum_at.armor, this.enum_as.head),
            new Artefact('leatherboots', 'Кожаные ботинки', 1, 14, 1, 199, this.enum_ak.shop, enum_at.armor, this.enum_as.foots),
            new Artefact('leatherplate', 'Кожаные доспехи', 3, 30, 2, 1358, this.enum_ak.shop, enum_at.armor, this.enum_as.body),
            new Artefact('hunter_boots', 'Кожаные сапоги', 4, 30, 1, 912, this.enum_ak.shop, enum_at.armor, this.enum_as.foots),
            new Artefact('leather_helm', 'Кожаный шлем', 3, 30, 1, 627, this.enum_ak.shop, enum_at.armor, this.enum_as.head),
            new Artefact('wizard_cap', 'Колпак мага', 5, 35, 2, 1596, this.enum_ak.shop, enum_at.armor, this.enum_as.head),
            new Artefact('chain_coif', 'Кольчужный шлем', 5, 40, 2, 1539, this.enum_ak.shop, enum_at.armor, this.enum_as.head),
            new Artefact('xymhelmet15', 'Корона пламенного чародея', 15, 70, 7, 6612, this.enum_ak.shop, enum_at.armor, this.enum_as.head),
            new Artefact('mhelmetzh13', 'Корона чернокнижника', 13, 70, 6, 6384, this.enum_ak.shop, enum_at.armor, this.enum_as.head),
            new Artefact('round_shiled', 'Круглый щит', 1, 7, 1, 104, this.enum_ak.shop, enum_at.armor, this.enum_as.left_arm),
            new Artefact('mif_light', 'Лёгкая мифриловая кираса', 8, 70, 5, 6251, this.enum_ak.shop, enum_at.armor, this.enum_as.body),
            new Artefact('mif_lboots', 'Лёгкие мифриловые сапоги', 8, 55, 6, 7153, this.enum_ak.shop, enum_at.armor, this.enum_as.foots),
            new Artefact('mif_lhelmet', 'Лёгкий мифриловый шлем', 9, 70, 5, 5244, this.enum_ak.shop, enum_at.armor, this.enum_as.head),
            new Artefact('sarmor9', 'Мифриловая кольчуга', 9, 40, 5, 2479, this.enum_ak.shop, enum_at.armor, this.enum_as.body),
            new Artefact('miff_plate', 'Мифриловые доспехи', 12, 75, 7, 9842, this.enum_ak.shop, enum_at.armor, this.enum_as.body),
            new Artefact('sarmor13', 'Обсидиановая броня', 13, 50, 7, 4322, this.enum_ak.shop, enum_at.armor, this.enum_as.body),
            new Artefact('boots13', 'Обсидиановые сапоги', 13, 70, 7, 8502, this.enum_ak.shop, enum_at.armor, this.enum_as.foots),
            new Artefact('zxhelmet13', 'Обсидиановый шлем', 13, 70, 6, 6384, this.enum_ak.shop, enum_at.armor, this.enum_as.head),
            new Artefact('shield13', 'Обсидиановый щит', 13, 70, 7, 10174, this.enum_ak.shop, enum_at.armor, this.enum_as.left_arm),
            new Artefact('mage_armor', 'Одеяние мага', 8, 50, 5, 4465, this.enum_ak.shop, enum_at.armor, this.enum_as.body),
            new Artefact('robewz15', 'Роба пламенного чародея', 15, 70, 8, 9310, this.enum_ak.shop, enum_at.armor, this.enum_as.body),
            new Artefact('wiz_robe', 'Роба чародея', 11, 70, 7, 9376, this.enum_ak.shop, enum_at.armor, this.enum_as.body),
            new Artefact('sboots12', 'Рубиновые сапоги', 12, 35, 6, 2992, this.enum_ak.shop, enum_at.armor, this.enum_as.foots),
            new Artefact('shelm12', 'Рубиновый шлем', 12, 40, 5, 2660, this.enum_ak.shop, enum_at.armor, this.enum_as.head),
            new Artefact('sboots16', 'Сапоги благородства', 16, 30, 8, 3239, this.enum_ak.shop, enum_at.armor, this.enum_as.foots),
            new Artefact('boots15', 'Сапоги пламени', 15, 70, 8, 8559, this.enum_ak.shop, enum_at.armor, this.enum_as.foots),
            new Artefact('boots17', 'Сапоги рассвета', 17, 70, 9, 8683, this.enum_ak.shop, enum_at.armor, this.enum_as.foots),
            new Artefact('mboots17', 'Сапоги сумерек', 17, 70, 9, 8683, this.enum_ak.shop, enum_at.armor, this.enum_as.foots),
            new Artefact('mboots14', 'Сапоги чернокнижника', 14, 70, 8, 8825, this.enum_ak.shop, enum_at.armor, this.enum_as.foots),
            new Artefact('sboots9', 'Солдатские сапоги ', 9, 30, 5, 2137, this.enum_ak.shop, enum_at.armor, this.enum_as.foots),
            new Artefact('ciras', 'Стальная кираса', 7, 70, 4, 4455, this.enum_ak.shop, enum_at.armor, this.enum_as.body),
            new Artefact('steel_helmet', 'Стальной шлем', 7, 70, 3, 3676, this.enum_ak.shop, enum_at.armor, this.enum_as.head),
            new Artefact('s_shield', 'Стальной щит', 2, 15, 2, 266, this.enum_ak.shop, enum_at.armor, this.enum_as.left_arm),
            new Artefact('full_plate', 'Стальные доспехи', 10, 75, 6, 9243, this.enum_ak.shop, enum_at.armor, this.enum_as.body),
            new Artefact('steel_boots', 'Стальные сапоги', 7, 70, 4, 5785, this.enum_ak.shop, enum_at.armor, this.enum_as.foots),
            new Artefact('shoe_of_initiative', 'Туфли стремления', 5, 40, 3, 2384, this.enum_ak.shop, enum_at.armor, this.enum_as.foots),
            new Artefact('wiz_boots', 'Туфли чародея', 12, 65, 6, 8008, this.enum_ak.shop, enum_at.armor, this.enum_as.foots),
            new Artefact('mif_hboots', 'Тяжёлые мифриловые сапоги', 11, 65, 6, 7752, this.enum_ak.shop, enum_at.armor, this.enum_as.foots),
            new Artefact('mif_hhelmet', 'Тяжёлый мифриловый шлем', 11, 70, 5, 6298, this.enum_ak.shop, enum_at.armor, this.enum_as.head),
            new Artefact('shelm16', 'Шлем благородства', 16, 40, 7, 2774, this.enum_ak.shop, enum_at.armor, this.enum_as.head),
            new Artefact('mage_helm', 'Шлем мага', 7, 50, 4, 3277, this.enum_ak.shop, enum_at.armor, this.enum_as.head),
            new Artefact('shelm8', 'Шлем отваги', 8, 30, 3, 1197, this.enum_ak.shop, enum_at.armor, this.enum_as.head),
            new Artefact('myhelmet15', 'Шлем пламени', 15, 70, 7, 6583, this.enum_ak.shop, enum_at.armor, this.enum_as.head),
            new Artefact('helmet17', 'Шлем рассвета', 17, 70, 8, 7239, this.enum_ak.shop, enum_at.armor, this.enum_as.head),
            new Artefact('mhelmet17', 'Шлем сумерек', 17, 70, 8, 7239, this.enum_ak.shop, enum_at.armor, this.enum_as.head),
            new Artefact('knowledge_hat', 'Шляпа знаний', 5, 25, 2, 978, this.enum_ak.shop, enum_at.armor, this.enum_as.head),
            new Artefact('dragon_shield', 'Щит драконов', 7, 70, 5, 8778, this.enum_ak.shop, enum_at.armor, this.enum_as.left_arm),
            new Artefact('shield16', 'Щит пламени', 16, 70, 8, 10298, this.enum_ak.shop, enum_at.armor, this.enum_as.left_arm),
            new Artefact('sshield17', 'Щит подавления', 17, 35, 8, 4018, this.enum_ak.shop, enum_at.armor, this.enum_as.left_arm),
            new Artefact('shield19', 'Щит рассвета', 19, 70, 9, 10469, this.enum_ak.shop, enum_at.armor, this.enum_as.left_arm),
            new Artefact('sshield5', 'Щит славы', 5, 40, 4, 2888, this.enum_ak.shop, enum_at.armor, this.enum_as.left_arm),
            new Artefact('sshield11', 'Щит сокола', 11, 40, 6, 3876, this.enum_ak.shop, enum_at.armor, this.enum_as.left_arm),
            new Artefact('defender_shield', 'Щит хранителя', 4, 40, 3, 1130, this.enum_ak.shop, enum_at.armor, this.enum_as.left_arm),
            new Artefact('sshield14', 'Щит чешуи дракона', 14, 38, 7, 3923, this.enum_ak.shop, enum_at.armor, this.enum_as.left_arm),

            // shop jewelry
            new Artefact('wzzamulet16', 'Амулет битвы', 16, 65, 10, 10972, this.enum_ak.shop, enum_at.jewelry, this.enum_as.neck),
            new Artefact('mmzamulet16', 'Амулет духа', 16, 65, 10, 10972, this.enum_ak.shop, enum_at.jewelry, this.enum_as.neck),
            new Artefact('smamul17', 'Амулет единения', 17, 30, 10, 4389, this.enum_ak.shop, enum_at.jewelry, this.enum_as.neck),
            new Artefact('bafamulet15', 'Амулет трёх стихий', 15, 65, 9, 10811, this.enum_ak.shop, enum_at.jewelry, this.enum_as.neck),
            new Artefact('amulet_of_luck', 'Амулет удачи', 3, 25, 2, 959, this.enum_ak.shop, enum_at.jewelry, this.enum_as.neck),
            new Artefact('samul14', 'Амулет фортуны', 14, 30, 9, 4370, this.enum_ak.shop, enum_at.jewelry, this.enum_as.neck),
            new Artefact('wzzamulet13', 'Амулет ярости', 13, 60, 9, 9975, this.enum_ak.shop, enum_at.jewelry, this.enum_as.neck),
            new Artefact('warring13', 'Глаз дракона', 13, 60, 6, 10279, this.enum_ak.shop, enum_at.jewelry, this.enum_as.ring),
            new Artefact('ring19', 'Кольцо бесстрашия', 19, 65, 7, 11305, this.enum_ak.shop, enum_at.jewelry, this.enum_as.ring),
            new Artefact('wwwring16', 'Кольцо боли', 16, 65, 6, 11238, this.enum_ak.shop, enum_at.jewelry, this.enum_as.ring),
            new Artefact('warriorring', 'Кольцо воина', 10, 40, 5, 6697, this.enum_ak.shop, enum_at.jewelry, this.enum_as.ring),
            new Artefact('mmmring16', 'Кольцо звёзд', 16, 65, 6, 11238, this.enum_ak.shop, enum_at.jewelry, this.enum_as.ring),
            new Artefact('i_ring', 'Кольцо ловкости', 2, 10, 1, 171, this.enum_ak.shop, enum_at.jewelry, this.enum_as.ring),
            new Artefact('smring10', 'Кольцо молнии', 10, 30, 5, 2859, this.enum_ak.shop, enum_at.jewelry, this.enum_as.ring),
            new Artefact('mring19', 'Кольцо непрестанности', 19, 65, 7, 11390, this.enum_ak.shop, enum_at.jewelry, this.enum_as.ring),
            new Artefact('circ_ring', 'Кольцо отречения', 6, 50, 4, 6507, this.enum_ak.shop, enum_at.jewelry, this.enum_as.ring),
            new Artefact('powerring', 'Кольцо пророка', 7, 40, 4, 5187, this.enum_ak.shop, enum_at.jewelry, this.enum_as.ring),
            new Artefact('bring14', 'Кольцо противоречий', 14, 60, 6, 10374, this.enum_ak.shop, enum_at.jewelry, this.enum_as.ring),
            new Artefact('sring4', 'Кольцо силы', 4, 15, 2, 579, this.enum_ak.shop, enum_at.jewelry, this.enum_as.ring),
            new Artefact('doubt_ring', 'Кольцо сомнений', 4, 12, 2, 1064, this.enum_ak.shop, enum_at.jewelry, this.enum_as.ring),
            new Artefact('rashness_ring', 'Кольцо стремительности', 5, 30, 2, 1928, this.enum_ak.shop, enum_at.jewelry, this.enum_as.ring),
            new Artefact('darkring', 'Кольцо теней', 10, 50, 5, 8379, this.enum_ak.shop, enum_at.jewelry, this.enum_as.ring),
            new Artefact('sring17', 'Кольцо хватки дракона', 17, 30, 6, 2907, this.enum_ak.shop, enum_at.jewelry, this.enum_as.ring),
            new Artefact('warrior_pendant', 'Кулон воина', 10, 50, 8, 8046, this.enum_ak.shop, enum_at.jewelry, this.enum_as.neck),
            new Artefact('mamulet19', 'Кулон непостижимости', 19, 65, 11, 11039, this.enum_ak.shop, enum_at.jewelry, this.enum_as.neck),
            new Artefact('power_pendant', 'Кулон отчаяния', 7, 60, 7, 7381, this.enum_ak.shop, enum_at.jewelry, this.enum_as.neck),
            new Artefact('amulet19', 'Кулон рвения', 19, 65, 11, 11039, this.enum_ak.shop, enum_at.jewelry, this.enum_as.neck),
            new Artefact('magic_amulet', 'Магический амулет', 10, 50, 7, 8379, this.enum_ak.shop, enum_at.jewelry, this.enum_as.neck),
            new Artefact('cloack17', 'Мантия вечности', 17, 65, 9, 9975, this.enum_ak.shop, enum_at.jewelry, this.enum_as.rear),
            new Artefact('cloackwz15', 'Мантия пламенного чародея', 15, 65, 8, 9614, this.enum_ak.shop, enum_at.jewelry, this.enum_as.rear),
            new Artefact('scroll18', 'Манускрипт концентрации', 18, 70, 9, 10307, this.enum_ak.shop, enum_at.jewelry, this.enum_as.left_arm),
            new Artefact('scloack8', 'Маскировочный плащ', 8, 30, 4, 2052, this.enum_ak.shop, enum_at.jewelry, this.enum_as.rear),
            new Artefact('bravery_medal', 'Медаль отваги', 2, 25, 2, 560, this.enum_ak.shop, enum_at.jewelry, this.enum_as.neck),
            new Artefact('mmzamulet13', 'Мистический амулет', 13, 60, 9, 9975, this.enum_ak.shop, enum_at.jewelry, this.enum_as.neck),
            new Artefact('soul_cape', 'Накидка духов', 5, 30, 2, 1197, this.enum_ak.shop, enum_at.jewelry, this.enum_as.rear),
            new Artefact('wiz_cape', 'Накидка чародея', 12, 60, 7, 8711, this.enum_ak.shop, enum_at.jewelry, this.enum_as.rear),
            new Artefact('samul17', 'Оскал дракона', 17, 30, 10, 4389, this.enum_ak.shop, enum_at.jewelry, this.enum_as.neck),
            new Artefact('smamul14', 'Осколок тьмы', 14, 30, 9, 4370, this.enum_ak.shop, enum_at.jewelry, this.enum_as.neck),
            new Artefact('verve_ring', 'Перстень вдохновения', 4, 18, 2, 1577, this.enum_ak.shop, enum_at.jewelry, this.enum_as.ring),
            new Artefact('smring17', 'Печать единения', 17, 30, 6, 2907, this.enum_ak.shop, enum_at.jewelry, this.enum_as.ring),
            new Artefact('magring13', 'Печать заклинателя', 13, 60, 6, 10279, this.enum_ak.shop, enum_at.jewelry, this.enum_as.ring),
            new Artefact('scloack16', 'Плащ драконьего покрова', 16, 30, 8, 3192, this.enum_ak.shop, enum_at.jewelry, this.enum_as.rear),
            new Artefact('powercape', 'Плащ магической силы', 8, 40, 4, 5339, this.enum_ak.shop, enum_at.jewelry, this.enum_as.rear),
            new Artefact('scoutcloack', 'Плащ разведчика', 4, 20, 1, 304, this.enum_ak.shop, enum_at.jewelry, this.enum_as.rear),
            new Artefact('energy_scroll', 'Свиток энергии', 10, 70, 6, 9044, this.enum_ak.shop, enum_at.jewelry, this.enum_as.left_arm),
            new Artefact('samul8', 'Счастливая подкова', 8, 30, 7, 3391, this.enum_ak.shop, enum_at.jewelry, this.enum_as.neck),
            new Artefact('sring10', 'Терновое кольцо', 10, 30, 5, 2859, this.enum_ak.shop, enum_at.jewelry, this.enum_as.ring),
            new Artefact('antiair_cape', 'Халат ветров', 6, 60, 3, 2926, this.enum_ak.shop, enum_at.jewelry, this.enum_as.rear),
            new Artefact('antimagic_cape', 'Халат магической защиты', 8, 50, 5, 4949, this.enum_ak.shop, enum_at.jewelry, this.enum_as.rear),

            // shop gift
            new Artefact('d_spray', 'Аромат страсти', 5, 15, 5, 3325, this.enum_ak.shop_gift, enum_at.jewelry, this.enum_as.right_arm),
            new Artefact('bfly', 'Бабочка богини', 9, 50, 5, 49875, this.enum_ak.shop_gift, enum_at.jewelry, this.enum_as.rear),
            new Artefact('bril_pendant', 'Бриллиантовый кулон', 3, 50, 6, 23275, this.enum_ak.shop_gift, enum_at.jewelry, this.enum_as.neck),
            new Artefact('warmor', 'Броня изящества', 7, 50, 6, 16625, this.enum_ak.shop_gift, enum_at.armor, this.enum_as.body),
            new Artefact('flowers3', 'Букет Аромат весны', 3, 15, 4, 3325, this.enum_ak.shop_gift, enum_at.jewelry, this.enum_as.right_arm),
            new Artefact('flowers1', 'Букет Восторг', 3, 10, 1, 332, this.enum_ak.shop_gift, enum_at.jewelry, this.enum_as.left_arm),
            new Artefact('flowers4', 'Букет Для любимой', 5, 25, 5, 4987, this.enum_ak.shop_gift, enum_at.jewelry, this.enum_as.left_arm),
            new Artefact('flowers2', 'Букет Женское счастье', 3, 10, 1, 332, this.enum_ak.shop_gift, enum_at.jewelry, this.enum_as.right_arm),
            new Artefact('roses', 'Букет Очарование', 7, 40, 9, 8312, this.enum_ak.shop_gift, enum_at.jewelry, this.enum_as.right_arm),
            new Artefact('flowers5', 'Букет Роскошный', 5, 25, 5, 4987, this.enum_ak.shop_gift, enum_at.jewelry, this.enum_as.right_arm),
            new Artefact('half_heart_m', 'Вторая половинка (M)', 3, 25, 2, 4987, this.enum_ak.shop_gift, enum_at.jewelry, this.enum_as.neck),
            new Artefact('half_heart_w', 'Вторая половинка (Ж)', 3, 25, 2, 4987, this.enum_ak.shop_gift, enum_at.jewelry, this.enum_as.neck),
            new Artefact('venok', 'Девичий венок', 3, 10, 2, 332, this.enum_ak.shop_gift, enum_at.armor, this.enum_as.head),
            new Artefact('defender_dagger', 'Кинжал защитника', 3, 15, 2, 1330, this.enum_ak.shop_gift, enum_at.armor, this.enum_as.left_arm),
            new Artefact('goldciras', 'Кираса защитника', 7, 50, 4, 13300, this.enum_ak.shop_gift, enum_at.armor, this.enum_as.body),
            new Artefact('koltsou', 'Кольцо предводителя', 10, 40, 6, 23275, this.enum_ak.shop_gift, enum_at.jewelry, this.enum_as.ring),
            new Artefact('bril_ring', 'Кольцо с бриллиантом', 4, 40, 5, 33250, this.enum_ak.shop_gift, enum_at.jewelry, this.enum_as.ring),
            new Artefact('wboots', 'Сапожки искусительницы', 5, 50, 6, 16625, this.enum_ak.shop_gift, enum_at.armor, this.enum_as.foots),
            new Artefact('flower_heart', 'Сердце из роз', 3, 20, 3, 1662, this.enum_ak.shop_gift, enum_at.jewelry, this.enum_as.left_arm),
            new Artefact('protazan', 'Серебряный протазан', 5, 40, 2, 8312, this.enum_ak.shop_gift, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('whelmet', 'Шляпка соблазна', 9, 50, 6, 16625, this.enum_ak.shop_gift, enum_at.armor, this.enum_as.head),
            new Artefact('shpaga', 'Шпага защитника', 9, 60, 10, 26600, this.enum_ak.shop_gift, enum_at.weapon, this.enum_as.right_arm),

            // hunter
            new Artefact('gm_amul', 'Амулет великого охотника', 6, 10, 5, 1200, this.enum_ak.hunter, enum_at.jewelry, this.enum_as.neck),
            new Artefact('sh_amulet2', 'Амулет зверобоя', 9, 15, 7, 2400, this.enum_ak.hunter, enum_at.jewelry, this.enum_as.neck),
            new Artefact('neut_amulet', 'Амулет леса', 5, 20, 10, 10000, this.enum_ak.hunter, enum_at.jewelry, this.enum_as.neck),
            new Artefact('hunter_amulet1', 'Амулет мастера-охотника', 3, 10, 3, 800, this.enum_ak.hunter, enum_at.jewelry, this.enum_as.neck),
            new Artefact('gm_arm', 'Броня великого охотника', 7, 10, 5, 1200, this.enum_ak.hunter, enum_at.armor, this.enum_as.body),
            new Artefact('sh_armor', 'Броня зверобоя', 10, 15, 7, 2400, this.enum_ak.hunter, enum_at.armor, this.enum_as.body),
            new Artefact('hunter_armor1', 'Броня мастера-охотника', 4, 10, 3, 800, this.enum_ak.hunter, enum_at.armor, this.enum_as.body),
            new Artefact('gm_rring', 'Заколдованное кольцо в. охотника', 7, 10, 2, 1200, this.enum_ak.hunter, enum_at.jewelry, this.enum_as.ring),
            new Artefact('gm_kastet', 'Кастет великого охотника', 6, 10, 8, 1200, this.enum_ak.hunter, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('hunterdagger', 'Кинжал мастера-охотника', 5, 10, 2, 800, this.enum_ak.hunter, enum_at.weapon, this.enum_as.left_arm),
            new Artefact('gm_sring', 'Кольцо ловкости в. охотника', 7, 10, 4, 1200, this.enum_ak.hunter, enum_at.jewelry, this.enum_as.ring),
            new Artefact('sh_ring1', 'Кольцо ловкости зверобоя', 10, 15, 6, 2400, this.enum_ak.hunter, enum_at.jewelry, this.enum_as.ring),
            new Artefact('hunter_ring2', 'Кольцо ловкости мастера-охотника', 5, 10, 3, 800, this.enum_ak.hunter, enum_at.jewelry, this.enum_as.ring),
            new Artefact('hunter_ring1', 'Кольцо полёта мастера-охотника', 5, 10, 2, 800, this.enum_ak.hunter, enum_at.jewelry, this.enum_as.ring),
            new Artefact('sh_ring2', 'Кольцо силы зверобоя', 10, 15, 4, 2400, this.enum_ak.hunter, enum_at.jewelry, this.enum_as.ring),
            new Artefact('sh_spear', 'Копьё зверобоя', 9, 15, 10, 2400, this.enum_ak.hunter, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('hunter_roga1', 'Костяной шлем мастера-охотника', 4, 10, 2, 800, this.enum_ak.hunter, enum_at.armor, this.enum_as.head),
            new Artefact('hunter_pendant1', 'Кулон охотника', 2, 10, 1, 400, this.enum_ak.hunter, enum_at.jewelry, this.enum_as.neck),
            new Artefact('huntersword2', 'Лёгкая сабля мастера-охотника', 5, 10, 4, 800, this.enum_ak.hunter, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('hunter_boots3', 'Лёгкие сапоги мастера-охотника', 4, 10, 2, 800, this.enum_ak.hunter, enum_at.armor, this.enum_as.foots),
            new Artefact('gm_abow', 'Лук великого охотника', 7, 10, 6, 1200, this.enum_ak.hunter, enum_at.weapon, this.enum_as.rear),
            new Artefact('sh_bow', 'Лук зверобоя', 11, 15, 8, 2400, this.enum_ak.hunter, enum_at.weapon, this.enum_as.rear),
            new Artefact('hunter_bow2', 'Лук мастера-охотника', 5, 10, 3, 800, this.enum_ak.hunter, enum_at.weapon, this.enum_as.rear),
            new Artefact('hunter_bow1', 'Лук охотника', 3, 10, 2, 400, this.enum_ak.hunter, enum_at.weapon, this.enum_as.rear),
            new Artefact('gm_protect', 'Маскхалат великого охотника', 7, 10, 6, 1200, this.enum_ak.hunter, enum_at.jewelry, this.enum_as.rear),
            new Artefact('sh_cloak', 'Маскхалат зверобоя', 10, 15, 8, 2400, this.enum_ak.hunter, enum_at.jewelry, this.enum_as.rear),
            new Artefact('hunter_mask1', 'Маскхалат мастера-охотника', 5, 10, 3, 800, this.enum_ak.hunter, enum_at.jewelry, this.enum_as.rear),
            new Artefact('gm_sword', 'Меч великого охотника', 7, 10, 8, 1200, this.enum_ak.hunter, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('sh_sword', 'Меч зверобоя', 10, 15, 10, 2400, this.enum_ak.hunter, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('hunter_gloves1', 'Перчатка охотника', 3, 10, 1, 400, this.enum_ak.hunter, enum_at.jewelry, this.enum_as.ring),
            new Artefact('hunter_jacket1', 'Рубаха охотника', 3, 10, 1, 400, this.enum_ak.hunter, enum_at.armor, this.enum_as.body),
            new Artefact('hunterdsword', 'Сабля мастера-охотника', 5, 10, 4, 800, this.enum_ak.hunter, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('gm_spdb', 'Сапоги великого охотника', 6, 10, 2, 1200, this.enum_ak.hunter, enum_at.armor, this.enum_as.foots),
            new Artefact('sh_boots', 'Сапоги зверобоя', 9, 15, 4, 2400, this.enum_ak.hunter, enum_at.armor, this.enum_as.foots),
            new Artefact('hunter_boots2', 'Сапоги мастера-охотника', 5, 10, 2, 800, this.enum_ak.hunter, enum_at.armor, this.enum_as.foots),
            new Artefact('hunter_boots1', 'Сапоги охотника', 3, 10, 1, 400, this.enum_ak.hunter, enum_at.armor, this.enum_as.foots),
            new Artefact('gm_3arrows', 'Стрелы великого охотника', 6, 10, 5, 1200, this.enum_ak.hunter, enum_at.weapon, this.enum_as.left_arm),
            new Artefact('sh_4arrows', 'Стрелы зверобоя', 9, 15, 7, 2400, this.enum_ak.hunter, enum_at.weapon, this.enum_as.left_arm),
            new Artefact('hunter_arrows1', 'Стрелы мастера-охотника', 4, 10, 3, 800, this.enum_ak.hunter, enum_at.weapon, this.enum_as.left_arm),
            new Artefact('hunter_sword1', 'Тесак охотника', 1, 10, 1, 400, this.enum_ak.hunter, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('gm_hat', 'Шлем великого охотника', 7, 10, 4, 1200, this.enum_ak.hunter, enum_at.armor, this.enum_as.head),
            new Artefact('sh_helmet', 'Шлем зверобоя', 10, 15, 6, 2400, this.enum_ak.hunter, enum_at.armor, this.enum_as.head),
            new Artefact('hunter_helm', 'Шлем мастера-охотника', 5, 10, 2, 800, this.enum_ak.hunter, enum_at.armor, this.enum_as.head),
            new Artefact('hunter_hat1', 'Шляпа охотника', 2, 10, 1, 400, this.enum_ak.hunter, enum_at.armor, this.enum_as.head),
            new Artefact('gm_defence', 'Щит великого охотника', 7, 10, 5, 1200, this.enum_ak.hunter, enum_at.armor, this.enum_as.left_arm),
            new Artefact('sh_shield', 'Щит зверобоя', 10, 15, 7, 2400, this.enum_ak.hunter, enum_at.armor, this.enum_as.left_arm),
            new Artefact('huntershield2', 'Щит мастера-охотника', 5, 10, 3, 800, this.enum_ak.hunter, enum_at.armor, this.enum_as.left_arm),
            new Artefact('hunter_shield1', 'Щит охотника', 3, 10, 2, 400, this.enum_ak.hunter, enum_at.armor, this.enum_as.left_arm),

            // event
            new Artefact('8amul_inf', 'Амулет бесконечности', 3, 8, 8, 12000, this.enum_ak.event, enum_at.jewelry, this.enum_as.neck),
            new Artefact('quest_pendant1', 'Амулет буйвола', 1, 20, 1, 600, this.enum_ak.event, enum_at.jewelry, this.enum_as.neck),
            new Artefact('trinitypendant', 'Амулет троицы', 7, 50, 7, 6400, this.enum_ak.event, enum_at.jewelry, this.enum_as.neck),
            new Artefact('sunart2', 'Арбалет солнца', 8, 20, 9, 28000, this.enum_ak.event, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('a_mallet', 'Аукционный молоточек', 3, 10000, 1, 40, this.enum_ak.event, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('piratehat3', 'Бандана пирата', 5, 1, 7, 12000, this.enum_ak.event, enum_at.armor, this.enum_as.head),
            new Artefact('vbow1', 'Великий лук времен', 13, 1, 8, 24000, this.enum_ak.event, enum_at.weapon, this.enum_as.rear),
            new Artefact('vtjcloak1', 'Великий плащ времен', 13, 1, 8, 24000, this.enum_ak.event, enum_at.jewelry, this.enum_as.rear),
            new Artefact('mart8_ring1', 'Весеннее колечко', 1, 8, 5, 400, this.enum_ak.event, enum_at.jewelry, this.enum_as.ring),
            new Artefact('wolfjacket', 'Волчья шкура', 3, 15, 2, 800, this.enum_ak.event, enum_at.armor, this.enum_as.body),
            new Artefact('sharik', 'Волшебный шар', 3, 1, 4, 4000, this.enum_ak.event, enum_at.jewelry, this.enum_as.neck),
            new Artefact('tjarmor2', 'Доспех времён', 8, 1, 10, 20000, this.enum_ak.event, enum_at.armor, this.enum_as.body),
            new Artefact('magneticarmor', 'Доспех магнитного голема', 14, 1, 14, 36000, this.enum_ak.event, enum_at.armor, this.enum_as.body),
            new Artefact('dubina', 'Дубина огра', 14, 30, 11, 40000, this.enum_ak.event, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('ogre_bum', 'Дубина огра-ветерана', 14, 1, 14, 36000, this.enum_ak.event, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('gdubina', 'Дубинка гоблина', 6, 30, 7, 14000, this.enum_ak.event, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('5years_star', 'Звезда пятилетия', 3, 10, 5, 5000, this.enum_ak.event, enum_at.jewelry, this.enum_as.neck),
            new Artefact('zub', 'Зуб дракона', 13, 30, 10, 40000, this.enum_ak.event, enum_at.jewelry, this.enum_as.neck),
            new Artefact('pir_armor1', 'Камзол пирата-капитана', 15, 1, 12, 20000, this.enum_ak.event, enum_at.armor, this.enum_as.body),
            new Artefact('tunnel_kirka', 'Кирка шахтёра', 5, 25, 7, 4000, this.enum_ak.event, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('bludgeon', 'Кистень степных воинов', 10, 30, 9, 28000, this.enum_ak.event, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('brush', 'Кисть художника', 9, 70, 9, 19824, this.enum_ak.event, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('windsword', 'Клинок ветров', 7, 1, 10, 22000, this.enum_ak.event, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('v-ring2', 'Кольцо времён', 8, 1, 6, 20000, this.enum_ak.event, enum_at.jewelry, this.enum_as.ring),
            new Artefact('ring2013', 'Кольцо года Змеи', 3, 50, 3, 800, this.enum_ak.event, enum_at.jewelry, this.enum_as.ring),
            new Artefact('testring', 'Кольцо памяти', 3, 30, 6, 40000, this.enum_ak.event, enum_at.jewelry, this.enum_as.ring),
            new Artefact('ttring', 'Кольцо равновесия', 3, 1, 4, 10800, this.enum_ak.event, enum_at.jewelry, this.enum_as.ring),
            new Artefact('blackring', 'Кольцо черного рыцаря', 5, 40, 4, 8000, this.enum_ak.event, enum_at.jewelry, this.enum_as.ring),
            new Artefact('pegaskop', 'Копье всадника пегаса', 12, 1, 14, 36000, this.enum_ak.event, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('sunart1', 'Копьё гвардейца', 5, 20, 7, 14000, this.enum_ak.event, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('kopie', 'Копьё гномов', 10, 30, 9, 28000, this.enum_ak.event, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('pika', 'Копьё тёмного всадника', 10, 30, 9, 28000, this.enum_ak.event, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('dragon_crown', 'Корона из зубов дракона', 7, 50, 5, 6800, this.enum_ak.event, enum_at.armor, this.enum_as.head),
            new Artefact('necrohelm2', 'Корона лича', 8, 10, 8, 16000, this.enum_ak.event, enum_at.armor, this.enum_as.head),
            new Artefact('dem_kosa', 'Коса рогатого жнеца', 8, 30, 9, 40000, this.enum_ak.event, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('tjam2', 'Кулон времён', 8, 1, 9, 20000, this.enum_ak.event, enum_at.jewelry, this.enum_as.neck),
            new Artefact('tj_vboots3', 'Лёгкие сапоги времён', 5, 1, 7, 16000, this.enum_ak.event, enum_at.armor, this.enum_as.foots),
            new Artefact('tjarmor3', 'Лёгкий доспех времён', 5, 1, 7, 16000, this.enum_ak.event, enum_at.armor, this.enum_as.body),
            new Artefact('vbow3', 'Легкий лук времен', 5, 1, 5, 16000, this.enum_ak.event, enum_at.weapon, this.enum_as.rear),
            new Artefact('vtjcloak3', 'Легкий плащ времен', 5, 1, 5, 16000, this.enum_ak.event, enum_at.jewelry, this.enum_as.rear),
            new Artefact('tj_helmet3', 'Лёгкий шлем времён', 5, 1, 7, 16000, this.enum_ak.event, enum_at.armor, this.enum_as.head),
            new Artefact('tj-shield3', 'Лёгкий щит времён', 5, 1, 7, 16000, this.enum_ak.event, enum_at.armor, this.enum_as.left_arm),
            new Artefact('bshield3', 'Лёгкий щит предводителя', 5, 1, 7, 8000, this.enum_ak.event, enum_at.armor, this.enum_as.left_arm),
            new Artefact('vbow2', 'Лук времен', 8, 1, 6, 20000, this.enum_ak.event, enum_at.weapon, this.enum_as.rear),
            new Artefact('goblin_bow', 'Лук гоблина', 6, 1, 8, 16000, this.enum_ak.event, enum_at.weapon, this.enum_as.rear),
            new Artefact('centaurbow', 'Лук кентавра', 5, 30, 5, 16000, this.enum_ak.event, enum_at.weapon, this.enum_as.rear),
            new Artefact('lbow', 'Лук света', 5, 85, 7, 10100, this.enum_ak.event, enum_at.weapon, this.enum_as.rear),
            new Artefact('sniperbow', 'Лук снайпера', 11, 1, 8, 36000, this.enum_ak.event, enum_at.weapon, this.enum_as.rear),
            new Artefact('v-ring3', 'Малое кольцо времён', 5, 1, 5, 16000, this.enum_ak.event, enum_at.jewelry, this.enum_as.ring),
            new Artefact('tjam3', 'Малый кулон времён', 5, 1, 7, 16000, this.enum_ak.event, enum_at.jewelry, this.enum_as.neck),
            new Artefact('vbolt3', 'Малый перстень времён', 5, 1, 5, 16000, this.enum_ak.event, enum_at.jewelry, this.enum_as.ring),
            new Artefact('sunart3', 'Меч воздаяния', 11, 20, 11, 32000, this.enum_ak.event, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('sunart4', 'Меч откровения', 14, 20, 12, 36000, this.enum_ak.event, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('dem_dmech', 'Меч пещерного демона', 5, 30, 6, 14000, this.enum_ak.event, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('blacksword1', 'Меч тьмы лорда', 5, 1, 10, 10000, this.enum_ak.event, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('blacksword', 'Меч тьмы', 5, 10, 10, 20000, this.enum_ak.event, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('slayersword', 'Меч убийцы', 14, 30, 11, 40000, this.enum_ak.event, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('cold_sword2014', 'Меч холода', 1, 85, 4, 17600, this.enum_ak.event, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('v-ring1', 'Мифриловое кольцо времён', 13, 1, 8, 24000, this.enum_ak.event, enum_at.jewelry, this.enum_as.ring),
            new Artefact('tjam1', 'Мифриловый кулон времён', 13, 1, 12, 24000, this.enum_ak.event, enum_at.jewelry, this.enum_as.neck),
            new Artefact('vbolt1', 'Мифриловый перстень времён', 13, 1, 8, 24000, this.enum_ak.event, enum_at.jewelry, this.enum_as.ring),
            new Artefact('molot_tan', 'Молот тана', 14, 30, 12, 40000, this.enum_ak.event, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('snowjinka', 'Новогодняя снежинка 2014', 5, 40, 4, 4000, this.enum_ak.event, enum_at.jewelry, this.enum_as.neck),
            new Artefact('sosulka', 'Новогодняя сосулька 2014', 5, 40, 4, 4000, this.enum_ak.event, enum_at.jewelry, this.enum_as.neck),
            new Artefact('pen', 'Перо поэта', 9, 70, 9, 19824, this.enum_ak.event, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('vbolt2', 'Перстень времён', 8, 1, 6, 20000, this.enum_ak.event, enum_at.jewelry, this.enum_as.ring),
            new Artefact('pir_armor3', 'Пиратская жилетка', 5, 1, 7, 12000, this.enum_ak.event, enum_at.armor, this.enum_as.body),
            new Artefact('pir_armor2', 'Пиратский сюртук', 9, 1, 9, 16000, this.enum_ak.event, enum_at.armor, this.enum_as.body),
            new Artefact('battlem_cape', 'Плащ боевого мага', 10, 1, 11, 28000, this.enum_ak.event, enum_at.jewelry, this.enum_as.rear),
            new Artefact('vtjcloak2', 'Плащ времен', 8, 1, 7, 20000, this.enum_ak.event, enum_at.jewelry, this.enum_as.rear),
            new Artefact('2year_amul_lords', 'Подвеска двухлетней удачи', 3, 10, 2, 4000, this.enum_ak.event, enum_at.jewelry, this.enum_as.neck),
            new Artefact('7ka', 'Подвеска семилетия', 3, 10, 7, 4000, this.enum_ak.event, enum_at.jewelry, this.enum_as.neck),
            new Artefact('3year_amul', 'Подвеска трёхлетней удачи', 3, 10, 2, 4000, this.enum_ak.event, enum_at.jewelry, this.enum_as.neck),
            new Artefact('rog_demon', 'Рог демона', 13, 30, 10, 40000, this.enum_ak.event, enum_at.jewelry, this.enum_as.neck),
            new Artefact('tj_vboots2', 'Сапоги времён', 8, 1, 9, 20000, this.enum_ak.event, enum_at.armor, this.enum_as.foots),
            new Artefact('compass', 'Старинный компас', 9, 40, 7, 8000, this.enum_ak.event, enum_at.jewelry, this.enum_as.left_arm),
            new Artefact('ru_statue', 'Статуэтка Рунета 2009', 1, 20, 10, 2009, this.enum_ak.event, enum_at.jewelry, this.enum_as.left_arm),
            new Artefact('3year_art', 'Талисман трёхлетия', 3, 10, 3, 4000, this.enum_ak.event, enum_at.jewelry, this.enum_as.neck),
            new Artefact('dem_dtopor', 'Топор дьявола', 13, 30, 11, 48000, this.enum_ak.event, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('orc_axe', 'Топор орка-тирана', 10, 1, 12, 28000, this.enum_ak.event, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('topor_skelet', 'Топорик скелета', 5, 30, 7, 14000, this.enum_ak.event, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('sea_trident', 'Трезубец сирен', 5, 15, 7, 4000, this.enum_ak.event, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('tj_vboots1', 'Тяжёлые сапоги времён', 13, 1, 12, 24000, this.enum_ak.event, enum_at.armor, this.enum_as.foots),
            new Artefact('tjarmor1', 'Тяжёлый доспех времён', 13, 1, 12, 24000, this.enum_ak.event, enum_at.armor, this.enum_as.body),
            new Artefact('tj_helmet1', 'Тяжёлый шлем времён', 13, 1, 12, 24000, this.enum_ak.event, enum_at.armor, this.enum_as.head),
            new Artefact('tj-shield1', 'Тяжёлый щит времён', 13, 1, 10, 24000, this.enum_ak.event, enum_at.armor, this.enum_as.left_arm),
            new Artefact('bshield1', 'Тяжёлый щит предводителя', 13, 1, 10, 16000, this.enum_ak.event, enum_at.armor, this.enum_as.left_arm),
            new Artefact('dudka', 'Флейта сатира', 4, 1, 5, 6000, this.enum_ak.event, enum_at.jewelry, this.enum_as.neck),
            new Artefact('antifire_cape', 'Халат пламени', 3, 40, 3, 16000, this.enum_ak.event, enum_at.jewelry, this.enum_as.rear),
            new Artefact('4year_klever', 'Четырёхлистный клевер', 3, 10, 3, 4000, this.enum_ak.event, enum_at.jewelry, this.enum_as.neck),
            new Artefact('6ring', 'Шестигранный перстень', 3, 10, 5, 15000, this.enum_ak.event, enum_at.jewelry, this.enum_as.ring),
            new Artefact('tj_helmet2', 'Шлем времён', 8, 1, 9, 20000, this.enum_ak.event, enum_at.armor, this.enum_as.head),
            new Artefact('ogre_helm', 'Шлем огра-ветерана', 14, 1, 12, 24000, this.enum_ak.event, enum_at.armor, this.enum_as.head),
            new Artefact('orc_hat', 'Шлем орка-тирана', 8, 1, 8, 20000, this.enum_ak.event, enum_at.armor, this.enum_as.head),
            new Artefact('necrohelm3', 'Шлем рыцаря тьмы', 13, 10, 9, 24000, this.enum_ak.event, enum_at.armor, this.enum_as.head),
            new Artefact('necrohelm1', 'Шлем скелета-воина', 5, 10, 4, 10000, this.enum_ak.event, enum_at.armor, this.enum_as.head),
            new Artefact('piratehat2', 'Шляпа пирата', 9, 1, 9, 16000, this.enum_ak.event, enum_at.armor, this.enum_as.head),
            new Artefact('piratehat1', 'Шляпа пирата-капитана', 15, 1, 12, 20000, this.enum_ak.event, enum_at.armor, this.enum_as.head),
            new Artefact('wshield', 'Щит ветров', 5, 65, 6, 4000, this.enum_ak.event, enum_at.armor, this.enum_as.left_arm),
            new Artefact('tj-shield2', 'Щит времён', 8, 1, 9, 20000, this.enum_ak.event, enum_at.armor, this.enum_as.left_arm),
            new Artefact('gargoshield', 'Щит из крыла горгульи', 6, 1, 8, 16000, this.enum_ak.event, enum_at.armor, this.enum_as.left_arm),
            new Artefact('bshield2', 'Щит предводителя', 9, 1, 9, 12000, this.enum_ak.event, enum_at.armor, this.enum_as.left_arm),
            new Artefact('elfdagger', 'Эльфийский кинжал', 13, 1, 12, 36000, this.enum_ak.event, enum_at.weapon, this.enum_as.left_arm),

            // thief
            new Artefact('thief_neckl', 'Амулет вора', 7, 60, 8, 8000, this.enum_ak.thief, enum_at.jewelry, this.enum_as.neck),
            new Artefact('tm_amulet', 'Амулет налётчика', 13, 60, 11, 24000, this.enum_ak.thief, enum_at.jewelry, this.enum_as.neck),
            new Artefact('thief_arb', 'Арбалет вора', 7, 60, 9, 8000, this.enum_ak.thief, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('tm_arb', 'Арбалет налётчика', 13, 60, 12, 24000, this.enum_ak.thief, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('thief_goodarmor', 'Доспехи вора', 7, 60, 6, 8000, this.enum_ak.thief, enum_at.armor, this.enum_as.body),
            new Artefact('tm_armor', 'Доспехи налётчика', 13, 60, 10, 24000, this.enum_ak.thief, enum_at.armor, this.enum_as.body),
            new Artefact('thief_ml_dagger', 'Кинжал вора', 7, 60, 7, 8000, this.enum_ak.thief, enum_at.weapon, this.enum_as.left_arm),
            new Artefact('tm_knife', 'Кинжал налётчика', 13, 60, 11, 24000, this.enum_ak.thief, enum_at.weapon, this.enum_as.left_arm),
            new Artefact('tm_mring', 'Колдовское кольцо налётчика', 13, 60, 8, 24000, this.enum_ak.thief, enum_at.jewelry, this.enum_as.ring),
            new Artefact('ring_of_thief', 'Кольцо вора', 7, 60, 5, 8000, this.enum_ak.thief, enum_at.jewelry, this.enum_as.ring),
            new Artefact('tm_wring', 'Кольцо налётчика', 13, 60, 8, 24000, this.enum_ak.thief, enum_at.jewelry, this.enum_as.ring),
            new Artefact('thief_premiumring1', 'Кольцо почётного вора I ранга', 7, 70, 8, 24000, this.enum_ak.thief, enum_at.jewelry, this.enum_as.ring),
            new Artefact('thief_premiumring2', 'Кольцо почётного вора II ранга', 7, 65, 7, 18000, this.enum_ak.thief, enum_at.jewelry, this.enum_as.ring),
            new Artefact('thief_premiumring3', 'Кольцо почётного вора III ранга', 6, 60, 6, 12000, this.enum_ak.thief, enum_at.jewelry, this.enum_as.ring),
            new Artefact('thief_msk', 'Маска вора', 7, 60, 5, 8000, this.enum_ak.thief, enum_at.armor, this.enum_as.head),
            new Artefact('tm_msk', 'Маска налётчика', 13, 60, 8, 24000, this.enum_ak.thief, enum_at.armor, this.enum_as.head),
            new Artefact('thief_cape', 'Плащ вора', 7, 60, 5, 8000, this.enum_ak.thief, enum_at.jewelry, this.enum_as.rear),
            new Artefact('tm_cape', 'Плащ налётчика', 13, 60, 7, 24000, this.enum_ak.thief, enum_at.jewelry, this.enum_as.rear),
            new Artefact('thief_fastboots', 'Сапоги вора', 7, 60, 6, 8000, this.enum_ak.thief, enum_at.armor, this.enum_as.foots),
            new Artefact('tm_boots', 'Сапоги налётчика', 13, 60, 8, 24000, this.enum_ak.thief, enum_at.armor, this.enum_as.foots),
            new Artefact('thief_unique_secretops', 'Секретная шпага воров', 6, 200, 3, 0, this.enum_ak.thief, enum_at.weapon, this.enum_as.right_arm),

            // war
            new Artefact('tl_medal1', 'Tiger`s Lake медаль 1-й степени', 3, 50, 9, 32000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('tl_medal2', 'Tiger`s Lake медаль 2-й степени', 3, 40, 4, 16000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('tl_medal3', 'Tiger`s Lake медаль 3-й степени', 3, 30, 3, 6000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('bwar1', 'Имперская медаль 1-й степени', 8, 1, 15, 60000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('kwar1', 'Имперская медаль 1ой степени', 8, 1, 15, 60000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('gnomewar1', 'Имперская медаль 1ой степени', 8, 70, 15, 60000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('bwar2', 'Имперская медаль 2-й степени', 7, 1, 12, 48000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('kwar2', 'Имперская медаль 2ой степени', 7, 1, 12, 48000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('gnomewar2', 'Имперская медаль 2ой степени', 7, 65, 12, 48000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('kwar3', 'Имперская медаль 3ей степени', 6, 1, 10, 36000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('gnomewar3', 'Имперская медаль 3ей степени', 6, 60, 10, 36000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('bwar3', 'Имперская медаль 3-й степени', 6, 1, 10, 36000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('bwar4', 'Имперская медаль 4-й степени', 5, 1, 8, 28000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('kwar4', 'Имперская медаль 4ой степени', 5, 1, 8, 28000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('gnomewar4', 'Имперская медаль 4ой степени', 5, 55, 8, 28000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('bwar5', 'Имперская медаль 5-й степени', 5, 1, 7, 20000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('kwar5', 'Имперская медаль 5ой степени', 5, 1, 7, 20000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('gnomewar5', 'Имперская медаль 5ой степени', 5, 50, 7, 20000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('bwar6', 'Имперская медаль 6-й степени', 5, 1, 6, 16000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('kwar6', 'Имперская медаль 6ой степени', 5, 1, 6, 16000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('gnomewar6', 'Имперская медаль 6ой степени', 5, 45, 6, 16000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('bwar7', 'Имперская медаль 7-й степени', 5, 1, 5, 12000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('kwar7', 'Имперская медаль 7ой степени', 5, 1, 5, 12000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('gnomewar7', 'Имперская медаль 7ой степени', 5, 40, 5, 12000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('bunt_medal1', 'Медаль доблести 1-й степени', 3, 60, 11, 40000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('bunt_medal2', 'Медаль доблести 2-й степени', 3, 50, 6, 20000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('bunt_medal3', 'Медаль доблести 3-й степени', 1, 40, 4, 10000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('bwar_splo', 'Медаль за сплоченность', 5, 50, 8, 28000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('gnomewar_splo', 'Медаль за сплоченность', 5, 50, 8, 28000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('kwar_splo', 'Медаль за сплоченность', 5, 50, 8, 28000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('kwar_stoj', 'Медаль за стойкость', 5, 25, 8, 28000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('bwar_stoj', 'Медаль за стойкость', 5, 30, 8, 28000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('gnomewar_stoj', 'Медаль за стойкость', 5, 50, 8, 28000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('bwar_takt', 'Медаль за тактику', 5, 50, 8, 28000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('gnomewar_takt', 'Медаль за тактику', 5, 50, 8, 28000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('kwar_takt', 'Медаль за тактику', 5, 50, 8, 28000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('necrwar1st', 'Медаль защитника 1-ая степень', 3, 70, 14, 56000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('necrwar2st', 'Медаль защитника 2-ая степень', 3, 60, 10, 36000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('necrwar3st', 'Медаль защитника 3-я степень', 3, 50, 6, 20000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('necrwar4st', 'Медаль защитника 4-ая степень', 3, 40, 4, 10000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('necrwar5st', 'Медаль защитника 5-ая степень', 3, 30, 2, 4000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('warthief_medal1', 'Медаль противостояния 1 степени', 5, 70, 7, 18000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('warthief_medal2', 'Медаль противостояния 2 степени', 4, 60, 6, 14000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('warthief_medal3', 'Медаль противостояния 3 степени', 3, 50, 5, 10000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('warthief_medal4', 'Медаль противостояния 4 степени', 3, 40, 4, 6000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('warthief_medal5', 'Медаль противостояния 5 степени', 3, 30, 3, 2000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('elfwar1', 'Орден доблести 1ой степени', 3, 80, 13, 60000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('elfwar2', 'Орден доблести 2ой степени', 3, 70, 11, 40000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('elfwar3', 'Орден доблести 3ей степени', 3, 60, 8, 32000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('elfwar4', 'Орден доблести 4ой степени', 3, 50, 7, 20000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('elfwar5', 'Орден доблести 5ой степени', 3, 40, 6, 10000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('elfwar6', 'Орден доблести 6ой степени', 3, 30, 4, 4000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('magewar1', 'Орден мира 1ой степени', 5, 80, 12, 52000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('magewar2', 'Орден мира 2ой степени', 3, 70, 9, 40000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('magewar3', 'Орден мира 3ей степени', 3, 60, 7, 32000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('magewar4', 'Орден мира 4ой степени', 3, 50, 5, 20000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('magewar5', 'Орден мира 5ой степени', 3, 35, 4, 12000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('demwar1', 'Орден свободы 1ой степени', 3, 80, 14, 60000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('demwar2', 'Орден свободы 2ой степени', 3, 70, 11, 44000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('demwar3', 'Орден свободы 3ей степени', 3, 60, 9, 36000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('demwar4', 'Орден свободы 4ой степени', 3, 50, 7, 24000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('demwar5', 'Орден свободы 5ой степени', 3, 40, 5, 16000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),
            new Artefact('demwar6', 'Орден свободы 6ой степени', 3, 30, 4, 8000, this.enum_ak.war, enum_at.jewelry, this.enum_as.neck),

            // verb
            new Artefact('v_1armor', 'Доспех вербовщика', 13, 90, 9, 48000, this.enum_ak.verb, enum_at.armor, this.enum_as.body),
            new Artefact('verb11_sword', 'Меч вербовщика', 13, 90, 11, 48000, this.enum_ak.verb, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('verbboots', 'Сапоги вербовщика', 13, 90, 9, 48000, this.enum_ak.verb, enum_at.armor, this.enum_as.foots),
            new Artefact('ve_helm', 'Шлем вербовщика', 13, 90, 8, 48000, this.enum_ak.verb, enum_at.armor, this.enum_as.head),
            new Artefact('vrb_shild', 'Щит вербовщика', 13, 90, 8, 48000, this.enum_ak.verb, enum_at.armor, this.enum_as.left_arm),

            //tactic
            new Artefact('tact1w1_wamulet', 'Боевой кулон тактика', 13, 75, 10, 40000, this.enum_ak.tactic, enum_at.jewelry, this.enum_as.neck),
            new Artefact('tactcv1_armor', 'Доспех тактика', 13, 75, 9, 40000, this.enum_ak.tactic, enum_at.armor, this.enum_as.body),
            new Artefact('tactsm0_dagger', 'Кинжал тактика', 13, 75, 8, 40000, this.enum_ak.tactic, enum_at.weapon, this.enum_as.left_arm),
            new Artefact('tactspw_mring', 'Кольцо мудрости тактика', 13, 75, 7, 40000, this.enum_ak.tactic, enum_at.jewelry, this.enum_as.ring),
            new Artefact('tactwww_wring', 'Кольцо силы тактика', 13, 75, 7, 40000, this.enum_ak.tactic, enum_at.jewelry, this.enum_as.ring),
            new Artefact('tact765_bow', 'Лук тактика', 13, 75, 7, 40000, this.enum_ak.tactic, enum_at.weapon, this.enum_as.rear),
            new Artefact('tactms1_mamulet', 'Магический амулет тактика', 13, 75, 10, 40000, this.enum_ak.tactic, enum_at.jewelry, this.enum_as.neck),
            new Artefact('tactpow_cloack', 'Плащ тактика', 13, 75, 9, 40000, this.enum_ak.tactic, enum_at.jewelry, this.enum_as.rear),
            new Artefact('tactmag_staff', 'Посох тактика', 13, 75, 10, 40000, this.enum_ak.tactic, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('tactzl4_boots', 'Сапоги тактика', 13, 75, 9, 40000, this.enum_ak.tactic, enum_at.armor, this.enum_as.foots),
            new Artefact('tactaz_axe', 'Топор тактика', 13, 75, 11, 40000, this.enum_ak.tactic, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('tacthapp_helmet', 'Шлем тактика', 13, 75, 8, 40000, this.enum_ak.tactic, enum_at.armor, this.enum_as.head),
            new Artefact('tactdff_shield', 'Щит тактика', 13, 75, 8, 40000, this.enum_ak.tactic, enum_at.armor, this.enum_as.left_arm),

            // relict
            new Artefact('gnomem_amulet', 'Амулет гнома-мастера', 11, 100, 11, 64000, this.enum_ak.relict, enum_at.jewelry, this.enum_as.neck),
            new Artefact('dem_amulet', 'Амулет демона-воина', 5, 100, 12, 50000, this.enum_ak.relict, enum_at.jewelry, this.enum_as.neck),
            new Artefact('druid_amulet', 'Амулет друида', 13, 100, 11, 64000, this.enum_ak.relict, enum_at.jewelry, this.enum_as.neck),
            new Artefact('necr_amulet', 'Амулет некроманта-ученика', 3, 100, 8, 40000, this.enum_ak.relict, enum_at.jewelry, this.enum_as.neck),
            new Artefact('elfamulet', 'Амулет эльфа-скаута', 3, 100, 9, 50000, this.enum_ak.relict, enum_at.jewelry, this.enum_as.neck),
            new Artefact('paladin_bow', 'Арбалет паладина', 13, 100, 8, 64000, this.enum_ak.relict, enum_at.weapon, this.enum_as.rear),
            new Artefact('sv_arb', 'Арбалет степного варвара', 14, 100, 8, 64000, this.enum_ak.relict, enum_at.weapon, this.enum_as.rear),
            new Artefact('barb_armor', 'Броня варвара-воина', 3, 100, 6, 40000, this.enum_ak.relict, enum_at.armor, this.enum_as.body),
            new Artefact('dem_armor', 'Броня демона-воина', 5, 100, 9, 50000, this.enum_ak.relict, enum_at.armor, this.enum_as.body),
            new Artefact('merc_armor', 'Броня наёмника-воина', 3, 100, 6, 40000, this.enum_ak.relict, enum_at.armor, this.enum_as.body),
            new Artefact('darkelfkaska', 'Венец слуги тьмы', 3, 100, 6, 50000, this.enum_ak.relict, enum_at.armor, this.enum_as.head),
            new Artefact('amf_body', 'Доспех амфибии', 14, 100, 8, 64000, this.enum_ak.relict, enum_at.armor, this.enum_as.body),
            new Artefact('gnomearmor', 'Доспех гнома-воина', 7, 100, 6, 44000, this.enum_ak.relict, enum_at.armor, this.enum_as.body),
            new Artefact('gnomem_armor', 'Доспех гнома-мастера', 11, 100, 8, 64000, this.enum_ak.relict, enum_at.armor, this.enum_as.body),
            new Artefact('inq_body', 'Доспех инквизитора', 14, 100, 9, 64000, this.enum_ak.relict, enum_at.armor, this.enum_as.body),
            new Artefact('nv_body', 'Доспех непокорного варвара', 11, 100, 7, 56000, this.enum_ak.relict, enum_at.armor, this.enum_as.body),
            new Artefact('paladin_armor', 'Доспех паладина', 13, 100, 8, 64000, this.enum_ak.relict, enum_at.armor, this.enum_as.body),
            new Artefact('kn_body', 'Доспех рыцаря солнца', 7, 100, 6, 44000, this.enum_ak.relict, enum_at.armor, this.enum_as.body),
            new Artefact('knightarmor', 'Доспех рыцаря-воина', 7, 100, 6, 44000, this.enum_ak.relict, enum_at.armor, this.enum_as.body),
            new Artefact('sv_body', 'Доспех степного варвара', 14, 100, 8, 64000, this.enum_ak.relict, enum_at.armor, this.enum_as.body),
            new Artefact('welfarmor', 'Доспех эльфа-воина', 7, 100, 6, 44000, this.enum_ak.relict, enum_at.armor, this.enum_as.body),
            new Artefact('barb_club', 'Дубина варвара-воина', 3, 100, 7, 40000, this.enum_ak.relict, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('sv_weap', 'Дубина степного варвара', 14, 100, 11, 64000, this.enum_ak.relict, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('lizard_armor', 'Жилет из кожи ящера', 3, 15, 2, 800, this.enum_ak.relict, enum_at.armor, this.enum_as.body),
            new Artefact('necr_helm', 'Капюшон некроманта-ученика', 3, 100, 7, 40000, this.enum_ak.relict, enum_at.armor, this.enum_as.head),
            new Artefact('merc_dagger', 'Кинжал наёмника-воина', 3, 100, 6, 40000, this.enum_ak.relict, enum_at.weapon, this.enum_as.left_arm),
            new Artefact('darkelfciras', 'Кираса слуги тьмы', 3, 100, 7, 50000, this.enum_ak.relict, enum_at.armor, this.enum_as.body),
            new Artefact('gmage_crown', 'Корона великого мага', 13, 100, 6, 64000, this.enum_ak.relict, enum_at.armor, this.enum_as.head),
            new Artefact('darkelfpendant', 'Кулон слуги тьмы', 3, 100, 9, 50000, this.enum_ak.relict, enum_at.jewelry, this.enum_as.neck),
            new Artefact('welfbow', 'Лук эльфа-воина', 7, 100, 6, 44000, this.enum_ak.relict, enum_at.weapon, this.enum_as.rear),
            new Artefact('elfbow', 'Лук эльфа-скаута', 3, 100, 8, 50000, this.enum_ak.relict, enum_at.weapon, this.enum_as.rear),
            new Artefact('merc_sword', 'Меч наёмника-воина', 3, 100, 8, 40000, this.enum_ak.relict, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('nv_weap', 'Меч непокорного варвара', 11, 100, 10, 56000, this.enum_ak.relict, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('paladin_sword', 'Меч паладина', 13, 100, 11, 64000, this.enum_ak.relict, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('kn_weap', 'Меч рыцаря солнца', 7, 100, 9, 44000, this.enum_ak.relict, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('knightsword', 'Меч рыцаря-воина', 7, 100, 9, 44000, this.enum_ak.relict, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('welfsword', 'Меч эльфа-воина', 7, 100, 9, 44000, this.enum_ak.relict, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('gnomehammer', 'Молот гнома-воина', 7, 100, 9, 44000, this.enum_ak.relict, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('gnomem_hammer', 'Молот гнома-мастера', 11, 100, 10, 64000, this.enum_ak.relict, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('amf_cl', 'Накидка амфибии', 14, 100, 8, 64000, this.enum_ak.relict, enum_at.jewelry, this.enum_as.rear),
            new Artefact('gmage_cloack', 'Накидка великого мага', 13, 100, 8, 64000, this.enum_ak.relict, enum_at.jewelry, this.enum_as.rear),
            new Artefact('druid_cloack', 'Плащ друида', 13, 100, 8, 64000, this.enum_ak.relict, enum_at.jewelry, this.enum_as.rear),
            new Artefact('inq_cl', 'Плащ инквизитора', 14, 100, 8, 64000, this.enum_ak.relict, enum_at.jewelry, this.enum_as.rear),
            new Artefact('mage_cape', 'Плащ мага-ученика', 6, 100, 6, 60000, this.enum_ak.relict, enum_at.jewelry, this.enum_as.rear),
            new Artefact('darkelfcloack', 'Плащ слуги тьмы', 3, 100, 6, 50000, this.enum_ak.relict, enum_at.jewelry, this.enum_as.rear),
            new Artefact('amf_boot', 'Поножи амфибии', 14, 100, 7, 64000, this.enum_ak.relict, enum_at.armor, this.enum_as.foots),
            new Artefact('welfboots', 'Поножи эльфа-воина', 7, 100, 5, 44000, this.enum_ak.relict, enum_at.armor, this.enum_as.foots),
            new Artefact('amf_weap', 'Посох амфибии', 14, 100, 11, 64000, this.enum_ak.relict, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('gmage_staff', 'Посох великого мага', 13, 100, 11, 64000, this.enum_ak.relict, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('druid_staff', 'Посох друида', 13, 100, 11, 64000, this.enum_ak.relict, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('inq_weap', 'Посох инквизитора', 14, 100, 12, 64000, this.enum_ak.relict, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('mage_staff', 'Посох мага-ученика', 6, 100, 11, 60000, this.enum_ak.relict, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('necr_staff', 'Посох некроманта-ученика', 3, 100, 10, 40000, this.enum_ak.relict, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('darkelfstaff', 'Посох слуги тьмы', 3, 100, 10, 50000, this.enum_ak.relict, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('gmage_armor', 'Роба великого мага', 13, 100, 8, 64000, this.enum_ak.relict, enum_at.armor, this.enum_as.body),
            new Artefact('druid_armor', 'Роба друида', 13, 100, 8, 64000, this.enum_ak.relict, enum_at.armor, this.enum_as.body),
            new Artefact('mage_robe', 'Роба мага-ученика', 6, 100, 7, 60000, this.enum_ak.relict, enum_at.armor, this.enum_as.body),
            new Artefact('elfshirt', 'Рубаха эльфа-скаута', 3, 100, 7, 50000, this.enum_ak.relict, enum_at.armor, this.enum_as.body),
            new Artefact('barb_boots', 'Сапоги варвара-воина', 3, 100, 6, 40000, this.enum_ak.relict, enum_at.armor, this.enum_as.foots),
            new Artefact('gmage_boots', 'Сапоги великого мага', 13, 100, 7, 64000, this.enum_ak.relict, enum_at.armor, this.enum_as.foots),
            new Artefact('gnomeboots', 'Сапоги гнома-воина', 7, 100, 5, 44000, this.enum_ak.relict, enum_at.armor, this.enum_as.foots),
            new Artefact('gnomem_boots', 'Сапоги гнома-мастера', 11, 100, 7, 64000, this.enum_ak.relict, enum_at.armor, this.enum_as.foots),
            new Artefact('druid_boots', 'Сапоги друида', 13, 100, 7, 64000, this.enum_ak.relict, enum_at.armor, this.enum_as.foots),
            new Artefact('lizard_boots', 'Сапоги из кожи ящера', 3, 15, 2, 800, this.enum_ak.relict, enum_at.armor, this.enum_as.foots),
            new Artefact('inq_boot', 'Сапоги инквизитора', 14, 100, 7, 64000, this.enum_ak.relict, enum_at.armor, this.enum_as.foots),
            new Artefact('mage_boots', 'Сапоги мага-ученика', 6, 100, 7, 60000, this.enum_ak.relict, enum_at.armor, this.enum_as.foots),
            new Artefact('merc_boots', 'Сапоги наёмника-воина', 3, 100, 6, 40000, this.enum_ak.relict, enum_at.armor, this.enum_as.foots),
            new Artefact('nv_boot', 'Сапоги непокорного варвара', 11, 100, 6, 56000, this.enum_ak.relict, enum_at.armor, this.enum_as.foots),
            new Artefact('paladin_boots', 'Сапоги паладина', 13, 100, 7, 64000, this.enum_ak.relict, enum_at.armor, this.enum_as.foots),
            new Artefact('knightboots', 'Сапоги рыцаря-воина', 7, 100, 5, 44000, this.enum_ak.relict, enum_at.armor, this.enum_as.foots),
            new Artefact('darkelfboots', 'Сапоги слуги тьмы', 3, 100, 7, 50000, this.enum_ak.relict, enum_at.armor, this.enum_as.foots),
            new Artefact('sv_boot', 'Сапоги степного варвара', 14, 100, 7, 64000, this.enum_ak.relict, enum_at.armor, this.enum_as.foots),
            new Artefact('elfboots', 'Сапоги эльфа-скаута', 3, 100, 7, 50000, this.enum_ak.relict, enum_at.armor, this.enum_as.foots),
            new Artefact('amf_scroll', 'Свиток амфибии', 14, 100, 8, 64000, this.enum_ak.relict, enum_at.jewelry, this.enum_as.left_arm),
            new Artefact('gmage_scroll', 'Свиток великого мага', 13, 100, 8, 64000, this.enum_ak.relict, enum_at.jewelry, this.enum_as.left_arm),
            new Artefact('mage_scroll', 'Свиток мага-ученика', 6, 100, 8, 60000, this.enum_ak.relict, enum_at.jewelry, this.enum_as.left_arm),
            new Artefact('dem_bootshields', 'Стальные щитки демона-воина', 5, 100, 8, 50000, this.enum_ak.relict, enum_at.armor, this.enum_as.foots),
            new Artefact('dem_axe', 'Топор демона-воина', 5, 100, 12, 50000, this.enum_ak.relict, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('necr_robe', 'Халат некроманта-ученика', 3, 100, 7, 40000, this.enum_ak.relict, enum_at.armor, this.enum_as.rear),
            new Artefact('amf_helm', 'Шлем амфибии', 14, 100, 6, 64000, this.enum_ak.relict, enum_at.armor, this.enum_as.head),
            new Artefact('barb_helm', 'Шлем варвара-воина', 3, 100, 4, 40000, this.enum_ak.relict, enum_at.armor, this.enum_as.head),
            new Artefact('gnomehelmet', 'Шлем гнома-воина', 7, 100, 5, 44000, this.enum_ak.relict, enum_at.armor, this.enum_as.head),
            new Artefact('gnomem_helmet', 'Шлем гнома-мастера', 11, 100, 6, 64000, this.enum_ak.relict, enum_at.armor, this.enum_as.head),
            new Artefact('dem_helmet', 'Шлем демона-воина', 5, 100, 9, 50000, this.enum_ak.relict, enum_at.armor, this.enum_as.head),
            new Artefact('lizard_helm', 'Шлем из кожи ящера', 3, 15, 2, 800, this.enum_ak.relict, enum_at.armor, this.enum_as.head),
            new Artefact('inq_helm', 'Шлем инквизитора', 14, 100, 6, 64000, this.enum_ak.relict, enum_at.armor, this.enum_as.head),
            new Artefact('nv_helm', 'Шлем непокорного варвара', 11, 100, 6, 56000, this.enum_ak.relict, enum_at.armor, this.enum_as.head),
            new Artefact('paladin_helmet', 'Шлем паладина', 13, 100, 6, 64000, this.enum_ak.relict, enum_at.armor, this.enum_as.head),
            new Artefact('kn_helm', 'Шлем рыцаря солнца', 7, 100, 5, 44000, this.enum_ak.relict, enum_at.armor, this.enum_as.head),
            new Artefact('knighthelmet', 'Шлем рыцаря-воина', 7, 100, 5, 44000, this.enum_ak.relict, enum_at.armor, this.enum_as.head),
            new Artefact('sv_helm', 'Шлем степного варвара', 14, 100, 6, 64000, this.enum_ak.relict, enum_at.armor, this.enum_as.head),
            new Artefact('welfhelmet', 'Шлем эльфа-воина', 7, 100, 5, 44000, this.enum_ak.relict, enum_at.armor, this.enum_as.head),
            new Artefact('mage_hat', 'Шляпа мага-ученика', 6, 100, 6, 60000, this.enum_ak.relict, enum_at.armor, this.enum_as.head),
            new Artefact('barb_shield', 'Щит варвара-воина', 3, 100, 6, 40000, this.enum_ak.relict, enum_at.armor, this.enum_as.left_arm),
            new Artefact('gnomeshield', 'Щит гнома-воина', 7, 100, 6, 44000, this.enum_ak.relict, enum_at.armor, this.enum_as.left_arm),
            new Artefact('gnomem_shield', 'Щит гнома-мастера', 11, 100, 7, 64000, this.enum_ak.relict, enum_at.armor, this.enum_as.left_arm),
            new Artefact('dem_shield', 'Щит демона-воина', 5, 100, 8, 50000, this.enum_ak.relict, enum_at.armor, this.enum_as.left_arm),
            new Artefact('nv_shield', 'Щит непокорного варвара', 11, 100, 7, 56000, this.enum_ak.relict, enum_at.armor, this.enum_as.left_arm),
            new Artefact('paladin_shield', 'Щит паладина', 13, 100, 7, 64000, this.enum_ak.relict, enum_at.armor, this.enum_as.left_arm),
            new Artefact('kn_shield', 'Щит рыцаря солнца', 7, 100, 6, 44000, this.enum_ak.relict, enum_at.armor, this.enum_as.left_arm),
            new Artefact('knightshield', 'Щит рыцаря-воина', 7, 100, 6, 44000, this.enum_ak.relict, enum_at.armor, this.enum_as.left_arm),
            new Artefact('sv_shield', 'Щит степного варвара', 14, 100, 7, 64000, this.enum_ak.relict, enum_at.armor, this.enum_as.left_arm),
            new Artefact('welfshield', 'Щит эльфа-воина', 7, 100, 6, 44000, this.enum_ak.relict, enum_at.armor, this.enum_as.left_arm),

            // ranger
            new Artefact('r_warriorsamulet', 'Амулет удачи рейнджера', 11, 70, 11, 36000, this.enum_ak.ranger, enum_at.jewelry, this.enum_as.neck),
            new Artefact('r_m_amulet', 'Амулет энергии рейнджера', 11, 70, 11, 36000, this.enum_ak.ranger, enum_at.jewelry, this.enum_as.neck),
            new Artefact('r_zarmor', 'Жилет рейнджера', 11, 70, 10, 36000, this.enum_ak.ranger, enum_at.armor, this.enum_as.body),
            new Artefact('r_dagger', 'Кинжал рейнджера', 11, 70, 8, 36000, this.enum_ak.ranger, enum_at.weapon, this.enum_as.left_arm),
            new Artefact('r_magicsring', 'Кольцо духа рейнджера', 11, 70, 7, 36000, this.enum_ak.ranger, enum_at.jewelry, this.enum_as.ring),
            new Artefact('r_warring', 'Кольцо ловкости рейнджера', 11, 70, 7, 36000, this.enum_ak.ranger, enum_at.jewelry, this.enum_as.ring),
            new Artefact('r_bow', 'Лук рейнджера', 11, 70, 7, 36000, this.enum_ak.ranger, enum_at.weapon, this.enum_as.rear),
            new Artefact('r_bigsword', 'Меч рейнджера', 11, 70, 13, 36000, this.enum_ak.ranger, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('r_clck', 'Плащ рейнджера', 11, 70, 11, 36000, this.enum_ak.ranger, enum_at.jewelry, this.enum_as.rear),
            new Artefact('r_magy_staff', 'Посох рейнджера', 11, 70, 13, 36000, this.enum_ak.ranger, enum_at.weapon, this.enum_as.right_arm),
            new Artefact('r_bootsmb', 'Сапоги рейнджера', 11, 70, 10, 36000, this.enum_ak.ranger, enum_at.armor, this.enum_as.foots),
            new Artefact('r_goodscroll', 'Свиток рейнджера', 11, 70, 9, 36000, this.enum_ak.ranger, enum_at.jewelry, this.enum_as.left_arm),
            new Artefact('r_helmb', 'Шлем рейнджера', 11, 70, 10, 36000, this.enum_ak.ranger, enum_at.armor, this.enum_as.head),
        ];

//----------------------------------------------------------------------------//

        this.get_artefact = function(id){
            for(var i = 0; i < this.artefacts.length; ++i)
                if(this.artefacts[i].id == id)
                    return this.artefacts[i];

            return null;
        }

//----------------------------------------------------------------------------//

        function Artefact(id_, name_, lvl_, usual_dur_, ap_, repair_cost_, kind_, type_, slot_){
            this.id          = id_;
            this.name        = name_;
            this.lvl         = lvl_;
            this.usual_dur   = usual_dur_;
            this.ap          = ap_;
            this.repair_cost = repair_cost_;
            this.kind        = kind_;
            this.type        = type_;
            this.slot        = slot_;

            this.resource = {
                gold:    0,
                wood:    0,
                ore:     0,
                mercury: 0,
                sulfur:  0,
                crystal: 0,
                gem:     0
            };

            this.states = {
                attack:     0,
                defence:    0,
                spellpower: 0,
                knowledge:  0,
                initiative: 0,
                morale:     0,
                luck:       0
            };

            this.ex_states = {
                magic_protection:             0,
                close_combat_protection:      0,
                range_combat_protection:      0,
                increase_range_combat_damage: 0,
                increase_close_combat_damage: 0,
                hero_initiative:              0,
            }

            this.unique_states = {

            };

            this.extended = [];

            this.price   = 0;
            this.ppb     = 0;
            this.own_ppb = 0;

            set_a_price(this);
            set_a_resource(this);
            set_a_state(this);
            set_a_ex_state(this);
            set_a_unique_state(this);
            set_a_high_durability(this);
        }

//----------------------------------------------------------------------------//

    } // wrapper end

//----------------------------------------------------------------------------//
// SysUtils
//----------------------------------------------------------------------------//

    var GN_SysUtils = new SysUtils();

//----------------------------------------------------------------------------//

    function SysUtils(){  // wrapper start

//----------------------------------------------------------------------------//

        this.show_error = function(error_string){
            throw new Error(error_string);
        }

//----------------------------------------------------------------------------//

        this.compare = function(a, b){
            return (a == b) ? 0 : (a > b ? 1 : -1);
        }

//----------------------------------------------------------------------------//

        this.send_async_post = function(url, params){
            var xhr = new XMLHttpRequest();
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send(params);
        }

//----------------------------------------------------------------------------//

        this.send_post = function(url, params){
            var xhr = new XMLHttpRequest();
            xhr.open('POST', url, false);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send(params);

            if(xhr.status == 200)
                return xhr.responseText;

            return null;
        }

//----------------------------------------------------------------------------//

        this.send_async_get = function(url)
        {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.overrideMimeType('text/plain; charset=windows-1251');
            xhr.send(null);
        }

//----------------------------------------------------------------------------//

        this.send_get = function(url)
        {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            xhr.overrideMimeType('text/plain; charset=windows-1251');
            xhr.send(null);

            if(xhr.status == 200)
                return xhr.responseText;

            return null;
        }

//----------------------------------------------------------------------------//  

        this.save_value = function(desc, value){
            if(check_gm_function()){
                GM_setValue(desc, value);
                return;
            }

            check_local_storage();

            try{
                localStorage.setItem(desc, value);
            }
            catch(e){
                show_error(script_name + ': ошибка при сохранении значения');
            }
        }

//----------------------------------------------------------------------------//  

        this.load_value = function(value, def){
            if(check_gm_function())
                return GM_getValue(value, def);

            check_local_storage();

            var val = localStorage.getItem(value);
            return val ? val : def;
        }

//----------------------------------------------------------------------------//

        this.remove_value = function(value){
            if(check_gm_function()){
                GM_deleteValue(value);
                return;
            }

            check_local_storage();

            localStorage.removeItem(value);
        }

//----------------------------------------------------------------------------//

        this.check_login = function(){
            var re = /.*?pl_id=\d+?.*?/gmi;

            if(!re.test(document.cookie))
                show_error('Пользователь не авторизован');
        }

//----------------------------------------------------------------------------//  

        function check_local_storage(){
            if('localStorage' in window && window['localStorage'] !== null)
                return;

            show_error('Не найдено локальное хранилище');
        }

//----------------------------------------------------------------------------//  

        function check_gm_function(){
            return typeof GM_setValue == 'function';
        }

//----------------------------------------------------------------------------//  

    } // wrapper end

//----------------------------------------------------------------------------//
// UnifiedLibrary end
//----------------------------------------------------------------------------//

    var script_name = 'GN_SortClanStorage';

    var SU = GN_SysUtils;
    var show_error = SU.show_error;
    var load_value = SU.load_value;
    var save_value = SU.save_value;
    var compare    = SU.compare;

    var CV = GN_CommonValues;
    var artefacts = CV.artefacts;
    var slot_type = CV.enum_as;
    slot_type.unknown  = -1;
    slot_type.complect = -2;

    var options = [
        { label: 'Показ только выбранных:',    id: 'OnlyChoosedChb',   title: 'Показывать только указанные внутри скрипта артефакты' },
        { label: 'Сортировка по крафту/цене:', id: 'SortByPriceChb',   title: 'Сортировать артефакты по цене, если цены одинаковы - по крафту' },
        //{ label: 'Сортировать по КПД:',        id: 'SortByOptimumChb', title: 'Сортировка по КПД, где КПД - статы и крафт артефакта' }, //NB maybe later
        { label: 'Одевать при аренде:',        id: 'DressChb',         title: 'Артефакты будут сразу одеваться на персонажа' },
        { label: 'Перезагружать страницу:',    id: 'ReloadChb',        title: 'После каждой аренды страница будет перезагружаться' },
        { label: 'Показ цен:',                 id: 'ShowPriceChb',     title: 'Показ цен на кнопках' },
    ];

//----------------------------------------------------------------------------//

    var settings = load_settings();

    var unknown_arts   = [];
    var right_arm_arts = [];
    var left_arm_arts  = [];
    var head_arts      = [];
    var body_arts      = [];
    var foots_arts     = [];
    var neck_arts      = [];
    var rear_arts      = [];
    var ring_arts      = [];
    var complect_arts  = [];

    var choosed = [
        'cold_sword2014'
    ];

    start_work();

//----------------------------------------------------------------------------// 

    function start_work(){
        var content = get_content_element();
        var childs = content.querySelectorAll('tr[bgcolor]');
        var elements = [];

        for(var i = 0; i < childs.length; ++i)
            elements.push(childs[i]);

        elements.forEach(function(current){
            insert_converted(convert_element(current));
        });

        while(content.firstChild)
            content.removeChild(content.firstChild);

        add_new_content(content);

        draw_header(content);
        draw_undress_button(content);
    }

//----------------------------------------------------------------------------//

    function get_content_element(){
        var matches = /.*\?id=(\d+).*/.exec(document.location);
        var header_sign = document.querySelector('table > tbody > tr > td > a[href*="sklad_info.php?id=' + matches[1] + '&cat="]');

        if(!header_sign)
            show_error('Не найден элемент для поиска заголовка таблицы');

        var prev_table = header_sign.parentNode.parentNode.parentNode.parentNode;

        if(!prev_table)
            show_error('Не найден заголовок таблицы');

        var parent_table = prev_table.nextSibling;

        if(!parent_table)
            show_error('Не найдена таблица с содержимым(1)');

        var content = parent_table.firstChild.querySelector('table > tbody');

        if(!content)
            show_error('Не найдена таблица с содержимым(2)');

        return content;
    }

//----------------------------------------------------------------------------//

    function convert_element(element){
        //length = 20 - complects or 21 (artefact);
        var art_count      = 21;
        var complect_count = 20;

        var childs = element.childNodes;

        if(childs.length != art_count && childs.length != complect_count)
            return null;

        var is_c = childs[0].querySelectorAll('table[background]').length > 1;

        var converted = {
            id:      '',
            uids:    [],
            name:    '',
            craft:   0,
            price:   0,
            b_count: 0,
            lvl:     0,
            slot:    slot_type.unknown,
            is_c:    is_c,
            node:    null,
            form: {
                depository: 0,
                sign:       '',
                category:   0,
                inv_id:     0,
                set_id:     0
            }
        };

        var re = /uid=(\d+?)&/gmi;
        var matches = [];

        while(matches = re.exec(childs[0].innerHTML)){
            var uid = matches[1];

            if(converted.uids.indexOf(uid) == -1)
                converted.uids.push(uid);
        }


        if(!is_c)
        {
            matches = /.+?art_info\.php\?id=([^&"]*)/.exec(childs[0].innerHTML);
            converted.id = matches[1];

            matches = /.+>'(.+)'.+/.exec(childs[1].innerHTML);
            converted.name = matches[1];

            matches = /.+\[(.+)\]/.exec(converted.name);

            if(matches)
                converted.craft = craft_to_int(matches[1]);
        }

        matches = />(\d+)</.exec(childs[is_c ? 16 : 17].innerHTML);
        converted.price = +matches[1];

        matches = /.*(<option\svalue="(\d+)"\>).*/.exec(childs[is_c ? 17 : 18].innerHTML);
        converted.b_count = +matches[2];

        if(!is_c)
        {
            var abstract = CV.get_artefact(converted.id);

            if(abstract)
            {
                converted.lvl  = abstract.lvl;
                converted.slot = abstract.slot;
            }
        }
        else
            converted.slot = slot_type.complect;

        converted.form.depository = childs[is_c ? 4 : 5].value;
        converted.form.sign       = childs[is_c ? 6 : 7].value;
        converted.form.category   = childs[is_c ? 8 : 9].value;
        converted.form.inv_id     = childs[is_c ? 12: 13].value;
        converted.form.set_id     = childs[is_c ? 14: 15].value;

        if(!converted.uids.length)
            converted.uids.push(converted.form.inv_id);

        convert_node(element, converted);

        return converted;
    }

//----------------------------------------------------------------------------//

    function craft_to_int(mod){
        var count = 0;
        var crafts = ['A', 'D', 'E', 'F', 'I', 'N', 'W'];

        crafts.forEach(function(current){
            var result = new RegExp(current + '(\\d+)').exec(mod);
            count += result ? +result[1] : 0;
        });

        return count;
    }

//----------------------------------------------------------------------------//

    function convert_node(element, converted){
        //appendChild - live operation
        var tr = document.createElement('tr');

        tr.appendChild(element.firstChild); //img
        if(!converted.is_c)
            tr.appendChild(element.firstChild); //name
        tr.appendChild(element.childNodes[15]); //price

        var b_count = converted.b_count;
        tr.appendChild(b_count >= 1 ? create_button(1, converted) : create_empty_td());
        tr.appendChild(b_count >= 2 ? create_button(2, converted) : create_empty_td());
        tr.appendChild(b_count >= 3 ? create_button(3, converted) : create_empty_td());

        var select = create_select(b_count, converted.form.inv_id, converted.slot);

        tr.appendChild(select ? select : create_empty_td());
        tr.appendChild(select ? create_button(4, converted) : create_empty_td());

        converted.node = tr;
    }

//----------------------------------------------------------------------------//

    function create_button(b_count, converted){
        var td = document.createElement('td');
        td.align = 'center';

        var button = document.createElement('button');
        button.textContent = 'На ' + b_count + (settings.ShowPriceChb ? '[' + Math.floor(+converted.price*1.01)*b_count + ']' : '');
        button.addEventListener('click', function(e){
            e.preventDefault();
            var form = converted.form;
            var url = 'sklad_info.php?id=' + form.depository +
                '&sign=' + form.sign +
                '&cat=' + form.category +
                '&action=rent&inv_id=' + form.inv_id +
                '&set_id=' + form.set_id +
                '&bcnt' + form.inv_id + '=' + b_count;

            settings.DressChb ? dress_artefacts(url, converted) : send_async_get(url);
        });

        td.appendChild(button);

        return td;
    }

//----------------------------------------------------------------------------//

    function create_empty_td(){
        var td = document.createElement('td');
        td.align = 'center';
        td.textContent = '';

        return td;
    }

//----------------------------------------------------------------------------//

    function create_select(b_count, inv_id, slot){
        if(b_count < 4)
            return null;

        var td = document.createElement('td');
        td.align = 'center';

        var select = document.createElement('select');
        select.setAttribute('inv_id', inv_id);
        select.setAttribute('slot', slot);

        for(var i = 4, e = b_count; i <= e; ++i)
        {
            var option = document.createElement('option');
            option.value       = i;
            option.textContent = i;

            select.appendChild(option);
        }

        select.addEventListener('change', function(e){
            e.preventDefault();

            var select = e.target;

            var array_ = find_array_by_type(+select.getAttribute('slot'));

            if(!array_){
                alert('Внутренняя ошибка, обратитесь к разработчику [select handler1]');
                return;
            }

            var converted = find_converted(array_, +select.getAttribute('inv_id'));

            if(!converted){
                alert('Внутренняя ошибка, обратитесь к разработчику [select handler2]');
                return;
            }

            var btn = select.parentNode.nextSibling.firstChild;
            var new_btn = create_button(select.options[select.selectedIndex].value, converted);

            btn.parentNode.replaceChild(new_btn, btn);
        });

        td.appendChild(select);

        return td;
    }

//----------------------------------------------------------------------------//

    function insert_converted(object_){
        if(!object_)
            return;

        if(object_.is_c)
            complect_arts.push(object_);
        else
            find_array_by_type(object_.slot).push(object_);
    }

//----------------------------------------------------------------------------//

    function find_array_by_type(slot){
        switch(slot)
        {
            case slot_type.unknown:
                return unknown_arts;

            case slot_type.complect:
                return complect_arts;

            case slot_type.right_arm:
                return right_arm_arts;

            case slot_type.ring:
                return ring_arts;

            case slot_type.head:
                return head_arts;

            case slot_type.body:
                return body_arts;

            case slot_type.foots:
                return foots_arts;

            case slot_type.neck:
                return neck_arts;

            case slot_type.rear:
                return rear_arts;

            case slot_type.left_arm:
                return left_arm_arts;
        }

        return null;
    }

//----------------------------------------------------------------------------//

    function sort_all(){
        sort_artefacts(right_arm_arts);
        sort_artefacts(ring_arts);
        sort_artefacts(head_arts);
        sort_artefacts(body_arts);
        sort_artefacts(foots_arts);
        sort_artefacts(neck_arts);
        sort_artefacts(rear_arts);
        sort_artefacts(left_arm_arts);
        sort_artefacts(unknown_arts);

        sort_artefacts(complect_arts);
    }

//----------------------------------------------------------------------------//

    function sort_artefacts(array_){
        array_.sort(function(a, b){
            if(a.price == b.price){
                if(a.craft == b.craft){
                    if(a.lvl == b.lvl)
                        return compare(b.b_count, a.b_count);

                    return compare(b.lvl, a.lvl);
                }

                return compare(b.craft, a.craft);
            }

            return compare(a.price, b.price);
        });
    }

//----------------------------------------------------------------------------//

    function add_new_content(content){
        if(settings.SortByPriceChb)
            sort_all();

        var counter = { val: 0 };

        add_array_content(content, unknown_arts,   slot_type.unknown,   'Неизвестные артефакты', counter);
        add_array_content(content, right_arm_arts, slot_type.right_arm, 'В правую руку',         counter);
        add_array_content(content, ring_arts,      slot_type.ring,      'Кольца',                counter);
        add_array_content(content, head_arts,      slot_type.head,      'Головные уборы',        counter);
        add_array_content(content, body_arts,      slot_type.body,      'Броня/одежда',          counter);
        add_array_content(content, foots_arts,     slot_type.foots,     'Обувь',                 counter);
        add_array_content(content, neck_arts,      slot_type.neck,      'Ожерелья/амулеты',      counter);
        add_array_content(content, rear_arts,      slot_type.rear,      'Оружие на спину/плащи', counter);
        add_array_content(content, left_arm_arts,  slot_type.left_arm,  'В левую руку',          counter);

        add_array_content(content, complect_arts,  slot_type.complect,  'Комплекты',             counter);
    }

//----------------------------------------------------------------------------//

    function add_array_content(content, array_, type, caption, counter){
        if(settings.OnlyChoosedChb){
            array_ = array_.filter(function(current){
                if(!current.id)
                    return true;

                return choosed.indexOf(current.id) != -1;
            });
        }

        if(!array_.length)
            return;

        var e_color = '#eeeeee';
        var f_color = '#ffffff';

        //caption
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        td.class = 'wblight';
        td.align = 'center';

        var is_expanded = load_value(script_name + 'SlotExpand' + type, 'false') == 'true' ? true : false;

        var b = document.createElement('b');
        var a = document.createElement('a');
        a.textContent = caption + '[' + array_.length + ']';
        a.href        = "#";
        a.style       = 'text-decoration: none;';
        a.setAttribute('expand', is_expanded ? 'true' : 'false');
        a.addEventListener('click', function(e){
            e.preventDefault();

            var expand = e.target.getAttribute('expand') == 'true';

            show_content_table(e.target, !expand);

            e.target.setAttribute('expand', expand ? 'false' : 'true');
            save_value(script_name + 'SlotExpand' + type, expand ? 'false' : 'true');
        });

        tr.appendChild(td);
        td.appendChild(b);
        b.appendChild(a);
        content.appendChild(tr);
        //end caption

        //content
        tr = document.createElement('tr');
        td = document.createElement('td');

        var table = document.createElement('table');
        table.width="100%";

        for(var i = 0; i < array_.length; ++i){
            array_[i].node.bgColor = (counter.val % 2 == 0) ? e_color : f_color;
            table.appendChild(array_[i].node);
            ++counter.val;
        }

        td.appendChild(table);
        tr.appendChild(td);
        content.appendChild(tr);
        //end content

        show_content_table(a, is_expanded);
    }

//----------------------------------------------------------------------------//

    function show_content_table(element, visible){
        var tr = element.parentNode.parentNode.parentNode;
        var next = tr.nextSibling;
        show_el(next, visible);
    }

//----------------------------------------------------------------------------//

    function find_converted(array_, inv_id){
        for(var i = 0, size = array_.length; i < size; ++i)
            if(inv_id == array_[i].form.inv_id)
                return array_[i];

        return null;
    }

//----------------------------------------------------------------------------//

    function send_async_get(url){
        document.body.style.cursor = 'wait';

        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.overrideMimeType('text/plain; charset=windows-1251');
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status == 200){
                document.body.style.cursor = 'default';
                if(settings.ReloadChb)
                    document.location = document.location;
            }
        };

        xhr.send(null);
    }

//----------------------------------------------------------------------------//

    function dress_artefacts(url, object_){
        document.body.style.cursor = 'wait';

        var counter = { counter: object_.uids.length };

        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.overrideMimeType('text/plain; charset=windows-1251');
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status == 200)
                send_dress_async_get('/inventory.php?dress=' + object_.uids[counter.counter - 1] + '&js=1&rand=' + Math.random()*1000000, object_, counter);
        };

        xhr.send(null);
    }

//----------------------------------------------------------------------------//

    function send_dress_async_get(url, object_, counter){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.overrideMimeType('text/plain; charset=windows-1251');
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status == 200){
                --counter.counter;

                if(counter.counter)
                    send_dress_async_get('/inventory.php?dress=' + object_.uids[counter.counter - 1] + '&js=1&rand=' + Math.random()*1000000, object_, counter);
                else{
                    document.body.style.cursor = 'default';
                    if(settings.ReloadChb)
                        document.location = document.location;
                }
            }
        };

        xhr.send(null);
    }

//----------------------------------------------------------------------------//

    function draw_header(parent){
        var header = document.createElement('tr');
        parent.insertBefore(header, parent.firstChild);

        var td = document.createElement('td');
        td.setAttribute('colspan', 6);
        header.appendChild(td);

        var table = document.createElement('table');
        table.style.width = '100%';
        td.appendChild(table);

        var tr = document.createElement('tr');
        table.appendChild(tr);

        var expander = document.createElement('td');
        expander.setAttribute('align', 'center');
        var is_expanded = load_value(script_name + 'SettingsExpand', 'false') == 'true' ? true : false;
        expander.setAttribute('expand', is_expanded ? 'true' : 'false');
        expander.textContent = is_expanded ? 'Скрыть настройки' : 'Показать настройки';
        expander.addEventListener('click', function(e){
            e.preventDefault();

            var expanded = expander.getAttribute('expand') == 'false' ? true : false;
            show_el(settings_table, expanded);

            save_value(script_name + 'SettingsExpand', expanded ? 'true' : 'false');

            expander.setAttribute('expand', expanded ? 'true' : 'false');
            expander.textContent = expanded ? 'Скрыть настройки' : 'Показать настройки';
        });

        tr.appendChild(expander);

        tr = document.createElement('tr');
        table.appendChild(tr);

        var td = document.createElement('td');
        tr.appendChild(td);

        var settings_table = document.createElement('table');
        td.appendChild(settings_table);

        tr = document.createElement('tr');
        settings_table.appendChild(tr);

        td = document.createElement('td');
        tr.appendChild(td);

        options.forEach(function(current){
            var text = document.createTextNode(current.label);
            td.appendChild(text);

            var chb = document.createElement('input');
            chb.type    = 'checkbox';
            chb.title   = current.title;
            chb.id      = script_name + current.id;
            chb.checked = settings[current.id];

            td.appendChild(chb);
        });

        tr = document.createElement('tr');
        settings_table.appendChild(tr);

        td = document.createElement('td');
        td.setAttribute('align', 'right');
        tr.appendChild(td);

        var saver = document.createElement('input');
        saver.type = 'button';
        saver.value = 'Применить';
        saver.addEventListener('click', function(e){
            e.preventDefault();

            save_settings();
        });
        td.appendChild(saver);

        show_el(settings_table, is_expanded);
    }

//----------------------------------------------------------------------------//

    function draw_undress_button(content){
        var table = content.parentNode.parentNode.parentNode.parentNode.parentNode.previousSibling.previousSibling;

        if(table.firstChild.childNodes.length < 4)
            return;

        var your_arenda = table.firstChild.childNodes[2];

        var a = document.createElement('a');
        a.href = '';
        a.textContent = '(вернуть все)';

        your_arenda.firstChild.appendChild(a);
        a.addEventListener('click', function(e){
            e.preventDefault();

            document.body.style.cursor = 'wait';

            var xhr = new XMLHttpRequest();
            xhr.open('GET', '/inventory.php?all_off=100', true);
            xhr.overrideMimeType('text/plain; charset=windows-1251');
            xhr.onreadystatechange = function(){
                if(xhr.readyState == 4 && xhr.status == 200)
                    send_storage_async_get(document.location);
            };

            xhr.send(null);
        });
    }

//----------------------------------------------------------------------------//

    function send_storage_async_get(url){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.overrideMimeType('text/plain; charset=windows-1251');
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status == 200){
                var response = xhr.response;

                var re = /<a href="(inventory\.php\?art_return=.+?)">/gmi;
                var matches = [];
                var links = [];

                while(matches = re.exec(response))
                    links.push(matches[1]);

                var counter = { counter: links.length };

                if(counter.counter)
                    send_return_async_get(links[counter.counter - 1], links, counter);
            }
        };

        xhr.send(null);
    }

//----------------------------------------------------------------------------//

    function send_return_async_get(url, array_, counter){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.overrideMimeType('text/plain; charset=windows-1251');
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status == 200){
                --counter.counter;

                if(counter.counter)
                    send_return_async_get(array_[counter.counter - 1], array_, counter);
                else{
                    document.body.style.cursor = 'default';
                    if(settings.ReloadChb)
                        document.location = document.location;
                }
            }
        };

        xhr.send(null);
    }

//----------------------------------------------------------------------------//

    function show_el(el, visible){
        el.style.display = visible ? '' : 'none';
    }

//----------------------------------------------------------------------------//

    function load_settings(){
        var settings_ = load_value(script_name + 'Settings');

        if(settings_)
            return JSON.parse(settings_);

        settings_ = {};

        options.forEach(function(current){
            settings_[current.id] = false;
        });

        return settings_;
    }

//----------------------------------------------------------------------------//

    function save_settings(){
        /*var errors = [];

         if(document.getElementById(script_name + 'SortByPriceChb').checked && document.getElementById(script_name + 'SortByOptimumChb').checked)
         errors.push('Сортировки по цене/КПД не могут быть использованы одновременно');

         if(errors.length){
         alert('Ошибки при сохранении:\n\n' + errors.join('\n'));
         return;
         }*/
        options.forEach(function(current){
            var chb = document.getElementById(script_name + current.id);
            settings[current.id] = chb.checked;
        });

        save_value(script_name + 'Settings', JSON.stringify(settings));

        document.location = document.location;
    }

//----------------------------------------------------------------------------//

})(); // wrapper end

//----------------------------------------------------------------------------//