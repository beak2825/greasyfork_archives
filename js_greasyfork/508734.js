// ==UserScript==
// @name         SearchForHiddenArts
// @license      none
// @namespace    nexterot
// @version      1.1.2
// @description  Поиск скрытых артов
// @author       nexterot
// @include      *heroeswm.ru/ob-igre-komplekty*
// @include      *lordswm.com/about-game-sets*
// @grant        GM_getValue
// @grant        GM_setValue
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heroeswm.ru
// @homepage     https://greasyfork.org/ru/scripts/508734-searchforhiddenarts
// @downloadURL https://update.greasyfork.org/scripts/508734/SearchForHiddenArts.user.js
// @updateURL https://update.greasyfork.org/scripts/508734/SearchForHiddenArts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const allPossibleArtsList = [
        'kastet', 'defence', 'arm', 'protect', 'abow', 'sring', 'rring', 'spear', 'fastboots', 'goodarmor', 'cape', 'arb', 'neck', 'msk',
        'knife', 'wring', 'mring', 'bigsword', 'staff', 'scroll', 'clck', 'warring', 'helmb', 'shild', 'robe', 'crown', 'shirt',
        'club', 'kiras', 'kaska', 'axe', 'bootshields', 'hammer', 'weap', 'body', 'staffik', 'axes', 'crossbow', 'bolt', 'blt', 'sph', 'sphere',
        'am', 'pistol', 'compas', 'glefa', 'glaive', 'crystal', 'greaves', 'sumka', 'bag', 'backpack', 'pack', 'back', 'rn', 'armr', 'bts',
        'amlt', 'swrd', 'pend', 'pendant', 'rd', 'clc', 'lshield', 'dgr', 'eye', 'm_shield', 'per', 'ring', 'screw', 'b', 'bl', 'bt',
        'clk', 'longbow', 'fring', 'sumk', 'bsword', 'mbook', 'book', 'svboots', 'barrel', 'cap', 'sekstant', 'r', 'handgun',
        'sword', 'saber', 'sabre', 'scimitar', 'dag', 'cloak', 'amulet', 'blade', 'helm', 'knives', 'edge', 'halberd', 'ringa', 'ringd',
        'amul', 'helmet', 'jacket', 'bow', 'gloves', 'glove', 'mask', 'arrows', 'roga', 'dagr', 'yataghan', 'bw', 'handbag',
        'purse', 'kit', 'sac', 'satchel', 'claymore', 'broadsword', 'cutlass', 'cleaver', 'hatchet', 'cutter', 'daga', 'swd', 'sw', 'swr',
        'svord', 'svrd', 'mech', 'dirk', 'ax', 'tomahawk', 'spr', 's', 'sord', 'battleaxe', 'falchion', 'dusack', 'messer', 'mameluke', 'katana', 'dao',
        'falcata', 'gladius', 'yatagan', 'naginata', 'puffin', 'pike', 'lance', 'javelin', 'dart', 'harpoon', 'rapier', 'rapier', 'skewer', 'epee',
        'estok', 'partisan', 'poleaxe', 'stiletto', 'machete', 'longsword', 'flamberge', 'flamberge', 'shamshir', 'mace', 'bludgeon', 'club',
        'flail', 'hammeraxe', 'pickaxe', 'medal', 'ls', 'bs', 'ss', 'totem', 'chains', 'stone', 'kniga', 'pouch', 'cube', 'kirka', 'sbow', 'shortbow',
        'necklace', 'paper', 'mirror', 'knuckles', 'brass', 'brassknuckles', 'fist', 'ironfist', 'knuckle', 'knuckleduster', 'knuckledusters',
        'punch', 'ya', 'y', 'yat', 'ytg', 'ytgn', 'ytghn', 'yata', 'kast', 'kst', 'kstt', 'ka', "gl", "glf", "glv", "sum", "mascot", "sumochka", 'iring',
        'hlm', 'crsb', 'helmt', 'crsbow', 'arbalet', 'arbalest', 'arbal', 'hm', 'coif', 'necrohelm', 'necrohelmet', 'maska', 'perst', 'dring', 'gring',
        'signet', 'scythe', 'boots', 'bonearmour', 'cloack', 'amulk', 'shield', 'sickle', 'lantern', 'dagger', 'cl', 'armour', 'boot', 'aml', 'shid',
        'backsword', 'armor', 'hat', 'ark', 'shld', 'tuf', 'mtuf', 'magam', 'hook', 'hanger', 'piton', 'crook', 'crampon', 'clasp', 'latch', 'gaff',
        'claw', 'nipper', 'tesak', 'sh', 'cb', 'garp', 'bw',
    ];

    const sets = [
        [
            'ronin',
            'Ронин',
            ['ronin_'],
            '1',
            ['ronin_mask', 'ronin_sh'],
        ],
        [
            'planeswalker',
            'Мироходец',
            ['pw_', 'pl_', 'mrh_', 'mrhd_', 'mh_', 'mirh_', 'mir_'],
            '1',
            ['mh_sword', 'mir_am', 'mir_shld', 'mir_armor', 'mir_boots', 'mir_helmt', 'mir_cl', 'mir_bow', 'mirh_ring'],
        ],
        [
            'stalker',
            'Ловчий',
            ['stlk_', 'st_', 'stalk_', 'stlkr_', 'lovch_', 'lvch_', 'lv_', 'stalker_'],
            '1',
            ['stalker_dagger', 'stalker_hlm', 'stalker_crsb', 'stalker_cl', 'stalker_armour', 'stalker_boot', 'stalker_aml', 'stalker_shid', 'stalker_iring', 'stalker_backsword', 'stalker_ark', 'stalker_sring'],
        ],
        [
            'wanderer',
            'Странник',
            ['wanderer_', 'wandr_'],
            '1',
            ['wanderer_armor', 'wanderer_hat', 'wanderer_boot', 'wandr_cloack', 'wanderer_cb'],
        ],
        [
            'arm',
            'Армада',
            ['pirate_', 'armada_', 'am_', 'armd_', 'armad_', 'arm_'],
            '1',
            ['arm_cap', 'arm_armor', 'arm_clk', 'arm_sekstant', 'arm_bts', 'arm_r', 'arm_handgun', 'armad_aml', 'arm_tesak', 'arm_garp'],
        ],
        [
            'ice',
            'Лёд',
            ['ice'],
            '1',
            ['bow', 'sphere', 'hammer'],
        ],
        [
            'forest',
            'Лес',
            ['les_', 'neut_', 'forest_'],
            '',
            [
                'forest_helm', 'neut_amulet', 'forest_bolt', 'neut_ring', 'forest_armor', 'les_cl', 'forest_bow', 'forest_crossbow', 'forest_edge', 'forest_blade', 'forest_spear', 'forest_boots', 'forest_dagger',
                'forest_knives', 'neut_leaf', 'shieldofforest'
            ],
        ],
        [
            'dungeon',
            'Подземка',
            ['dung_', 'dun_', 'drak_'],
            '1',
            [
                'dun_sword', 'dun_dagger', 'dun_bow', 'dung_axe', 'dun_ring', 'dering', 'dun_boots', 'dun_armor', 'dun_shield', 'hm', 'drak_crown', 'dung_glefa', 'dun_amul', 'dun_pendant', 'crystal', 'drak_greaves',
                'dun_cloak', 'drak_armor', 'drak_shield'
            ],
        ],
        [
            'warlord',
            'Война',
            ['warlord_'],
            '',
            ['armor'],
        ],
        [
            'legend',
            'Легенда',
            ['legend_'],
            '1',
            ['nature'],
        ],
        /*
        [
            'fear',
            'Страх',
            ['fear_'],
            '',
            ['scythe', 'boots', 'bonearmour', 'cloack', 'amulk', 'shield', 'sickle', 'lantern', 'bow'],
        ],
        */
    ];


    var running = false;

    setTimeout(main, 300);

    function main() {
        var html = `<select id="select_box" name="choose_set">`;
        for (var i = 0; i < sets.length; i++) {
            var set = sets[i];
            var setId = set[0];
            var setName = set[1];
            html += `<option value="${i}">${setName}</option>`;
        }
        html += `</select>&nbsp;`
            + `<span id="search_for_arts" style="cursor: pointer; text-decoration: underline">Поиск</span><br>`
            + `<span id="result"></span>`;
        var elem = document.querySelector("#help_text_inside");
        elem.innerHTML = html + elem.innerHTML;
        $('search_for_arts').addEventListener('click', e => {
            if (running) {
                running = false;
                return;
            }
            running = true;
            var select_box = $('select_box');
            run(select_box.options[select_box.selectedIndex].value);
        });
    }
    function onResponseCallback(objXMLHttpReq, args){
        if (objXMLHttpReq.readyState == 4 && objXMLHttpReq.status == 200) {
            var dateStr = '';
            var page = objXMLHttpReq.responseText;
            var resultWindow = $("result");
            if (!page.includes('i/artifacts/empty_b.png')) {
                resultWindow.innerHTML = `<br><b>арт найден!</b> <a href="${args.link}">${args.link}</a>`;
                return;
            }
            else
            {
                resultWindow.innerHTML = `<br>нет такого ${args.link}`;
            }
            if (args.arts_list.length == 0)
            {
                resultWindow.innerHTML += `<br>поиск окончен.`;
                running = false;
                return;
            }
            if (!running) {
                resultWindow.innerHTML += `<br>поиск остановлен.`;
                return;
            }
            var nextArtName = args.arts_list.pop();
            var link = `art_info.php?id=${nextArtName}${args.postfix}`;
            var newArgs = {link:link, arts_list:args.arts_list, postfix:args.postfix};
            request(link, onResponseCallback, newArgs);
        }
    }
    function create_combinations(list1, list2) {
        var res = [];
        for (var item1 of list1) {
            for (var item2 of list2) {
                res.push(`${item1}${item2}`);
            }
        }
        return res;
    }
    function run(setId) {
        var set = sets[setId];
        var prefixes = set[2];
        var postfix = set[3];
        var existingArts = set[4];
        var combinations = create_combinations(prefixes, allPossibleArtsList).filter(function (x){ return !existingArts.includes(x); });
        var firstArt = combinations.pop();
        var link = `art_info.php?id=${firstArt}${postfix}`;
        var args = {link:link, arts_list:combinations, postfix:postfix};
        request(link, onResponseCallback, args);
    }
    function $(id, where = document) {
        return where.querySelector(`#${id}`);
    }
    function request(url_req, callback, args){
        var objXMLHttpReq = createXMLHttpReq();
        try{
            objXMLHttpReq.open('GET', url_req, true);
            setXMLHttpReqHeaders(objXMLHttpReq);
            objXMLHttpReq.onreadystatechange = function() { callback(objXMLHttpReq, args); }
            objXMLHttpReq.send(null);
        }catch(e){console.log(e);alert("request failed with error=" + e);}
    }
    function createXMLHttpReq(){
        var objXMLHttpReq;
        if (window.XMLHttpRequest){
            objXMLHttpReq = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            // IE
            objXMLHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
        } else {
            alert('Can\'t create XMLHttpRequest!');
        }
        return objXMLHttpReq;
    }
    function setXMLHttpReqHeaders(objXMLHttpReq){
        objXMLHttpReq.setRequestHeader('Content-type', 'text/html; charset=windows-1251');
        if(objXMLHttpReq.overrideMimeType)
            objXMLHttpReq.overrideMimeType('text/html; charset=windows-1251');
    }
})();