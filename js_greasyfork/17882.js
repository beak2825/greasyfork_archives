// ==UserScript==
// @name         Dressing Room
// @version      3.1
// @description  WoWhead Dressing Room
// @namespace    http://mogboutique.tumblr.com/
// @author       http://mogboutique.tumblr.com/
// @match        https://*.wowhead.com/dressing-room*
// @match        https://*.wowhead.com/beta/dressing-room*
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/17882/Dressing%20Room.user.js
// @updateURL https://update.greasyfork.org/scripts/17882/Dressing%20Room.meta.js
// ==/UserScript==


var HTML = '<style type="text/css" id="wmv_style">.dressing-room-controls-block.block-bg{display:none;}\
.dr_code_buttons>button{margin:4px 4px;background:#a71a19;padding:2px;font-size:10px;width:40px;.dr_link{background:transparent;}\
#record_video[active="true"]{background-color:red;}\
#dr_script_arrow_button:before{content: "\f078";}\
</style>\
<div id="dressing_room_script" data-open="false" style="border-top:1px dashed #ffd100;margin-top:10px;">\
<span id="dr_script_header" style="cursor:pointer;border-bottom:1px dashed;color:#ffd100;">Dressing Room Script</span>\
<div id="dr_script_arrow_button" style="cursor:pointer;color:#ffd100;"></div>\
<div id="dressing_room_wrapper" style="display:none;">\
<button id="comp_click" class="" \
style="border:1px solid #ffd100;color:#ffd100;padding-left:5px;padding-right:5px;font-size:14px;margin-top:5px;background-color:transparent;">\
Import MogIt or WoWHead Comparison link</button>\
<div id="dr_itemlist" style="margin-top:5px;/*background:black*/;display:flex;flex-direction:row;" > \
<div id="dr-preview" style="padding:10px;font-size:10px;margin-top:5px;margin-bottom:5px;border:1px solid #ffd100;display:block;width:90%;height:178px;" >\
</div>\
<textarea id="dr_code_box" style="padding:10px;margin-top:5px;margin-bottom:5px;display:none;border:1px solid;font-size:10px;\
height:200px;width:90%;background:transparent;color:#ffd100;border-radius:0px;"></textarea>\
<div class="dr_code_buttons" style="text-align:center;display:flex;order:-1;flex-direction:column;vertical-align:top;">\
<button mode="preview" title="Preview">👁️</button>\
<button mode="html" title="Create HTML Item List">HTML</button><button mode="reddit" title="Create Reddit Markup Item List">Reddit</button>\
<button mode="forum" title="Create BBCode Item List">Forum</button><button mode="plain" title="Create Plain Text Item List">Plain</button>\
<button id="code_wmv" mode="wmv" title="Show WoW Model Viewer Code">WMV</button></div></div>\
<div id="wmv_pad" style="margin-top:5px;margin-bottom:5px;display:flex;flex-direction:row;justify-content: space-around;" >\
    <button id="generate_chr" class="btn btn-site" href="javascript:void(0);"\
    title="Save as an WoW Model Viewer&#013;.CHR (Character) file.&#013;Use Character -> Load Character in WMV"\
    style="text-align:center;width:48%;">\
    WMV .chr file</button>\
    <button class="btn btn-site" id="generate_eq" href="javascript:void(0);"\
    title="Save as an WoW Model Viewer&#013;.EQ (equipment-only) file.&#013;Use Character -> Load Equipment in WMV"\
    style="text-align:center;width:48%;">\
    WMV .eq file</button>\
<a class="fa canvas_screen dr_link" title="test&#013;test" href="javascript:void(0);" style="text-align:center;display:none;border:0px solid;font-size:10px;padding:0px;">\
Save Screenshot</a>\
<div id="wmv_hide" style="display:none;"><a id="download_file" download="MyCharacter.chr" style="display:none;" href="javascript:void:(0);"></a>\
<a id="code_file" style="display:none;" target="File Code" href="javascript:void:(0);"></a>\
<a href="#" class="button" id="btn-download" download="my-file-name.png">Download</a>\
</div></div>\
<div id="video_recorder" style="border-top:1px dashed #ffd100;padding-top:5px;">\
    <button id="record_video" style="border-radius:4px;background-color:#a71a19;color:white;">🎦 Record video</button>\
    <a href="" id="download_video_link" download="movie.mkv" style="margin-left:10px;font-size:10px;">Download movie</a>\
<div>\
</div></div>';

var DR = {};

var $ = unsafeWindow.$;

document.addEventListener('click', pageClick, false);

function pageClick(e) {
    if (e.target.className === 'appearance-button') {
        if (e.target.dataset.itemBonus && e.target.dataset.itemId) {
            var bonus = e.target.dataset.itemBonus;
            DR.setItem({ id: e.target.dataset.itemId, bonus: bonus });
        }
    }
    else if (e.target.id === 'dr_script_header') {
        $('#dressing_room_wrapper').slideToggle('slow');
    }
}

DR.mode = "html";

DR.urlInput;

DR.equipmentOrderToCharacterSlot = {
    1: 1,
    2: 3,
    3: 15,
    4: 5,
    5: 4,
    6: 19,
    7: 9,
    8: 10,
    9: 6,
    10: 7,
    11: 8,
    12: 16,
    13: 17
};
DR.characterSlotToEquipmentOrder = {
    //Head
    1: 1,
    //Shoulders
    3: 2,
    //Cloak
    16: 3,
    //Chest
    5: 4,
    //Shirt
    4: 5,
    //Tabard
    19: 6,
    //Wrists
    9: 7,
    //Hands
    10: 8,
    //Waist
    6: 9,
    //Legs
    7: 10,
    //Feet
    8: 11,
    //Ranged
    15: 12,
    //1-Hand
    13: 12,
    //2-Hand
    17: 12,
    //Shield
    14: 13,
    //Off-Hand
    23: 13
};

DR.characterSlotToSlotName = {
    1: "head",
    3: "shoulder",
    15: "back",
    5: "chest",
    4: "shirt",
    19: "tabard",
    9: "wrist",
    10: "hands",
    6: "waist",
    7: "legs",
    8: "feet",
    16: "mainhand",
    17: "offhand"
};

DR.equipmentOrderToWMVSlot = {
    //Head
    1: [0, 'Head'],
    //Shoulders
    2: [1, 'Shoulders'],
    //Cloak
    3: [11, 'Cloak'],
    //Chest
    4: [6, 'Chest'],
    //Shirt
    5: [4, 'Shirt'],
    //Tabard
    6: [12, 'Tabard'],
    //Wrists
    7: [7, 'Wrists'],
    //Hands
    8: [8, 'Hands'],
    //Waist
    9: [3, 'Waist'],
    //Legs
    10: [5, 'Legs'],
    //Feet
    11: [2, 'Feet'],
    //Ranged
    12: [9, 'Main Hand'],
    //Shield
    13: [10, 'Off-Hand'],
}

DR.init = function () {
    //console.log('WH.Wow.DressingRoom', WH.Wow.DressingRoom, 'Controls', $('div.dressing-room-controls')[0]);

    const switchers = $('.dressing-room-character-controls-category-switchers');

    /*<a data-category="gear" href="javascript:" style="background-image: url(&quot;https://wow.zamimg.com/images/wow/icons/large/inv_chest_leather_09.jpg&quot;);" class=""></a>*/
    //achievement_boss_grandmagustelestra petbattle_health inv_misc_toy_07
    const a = $(`<a data-category="script" href="javascript:" 
    style="order:90;background-image: url('https://wow.zamimg.com/images/wow/icons/large/inv_misc_toy_07.jpg');
    background-position:center center;background-size:contain;"
    class=""></a>`);
    switchers.append(a);

    //console.log('TEST**************************************', $('.dressing-room-character-controls-category').last());

    /*<div class="dressing-room-character-controls-category-option" data-character-customization-type="tattoo">Tessssssssssst</div>*/
    const opt = $(`<div class="dressing-room-character-controls-category" data-active="false" data-category="script" style="pointer-events:auto;"></div>`);
    $('.dressing-room-character-controls-category').last().after(opt);

    $('head').append(`<style>
    .dressing-room-character-controls-category #dr_script_header {
        font-size: 14px;
        font-weight: bold;
        margin: 0 0 10px;
        text-transform: uppercase;
    }
    #dressing_room_script{
        border:0 !important;
        margin-top:0 !important;
    }
    #dr_itemlist {
        flex-direction:column !important;
    }
    .dr_code_buttons {
        flex-direction:row !important;
    }
    </style>`);

    new MutationObserver(me => {
        for (let m of me) {
            if (m.target && m.target.tagName === "A" && m.target.dataset.category !== "script") {
                //console.log(m.target.dataset.category, m.target.dataset.active);
                if (m.target.dataset.active === "true") {
                    opt[0].dataset.active = false;
                    a[0].dataset.active = false;
                }
            }
        }
    }).observe($('.dressing-room-character-controls-category-switchers')[0], {
        attributes: true, childList: false, subtree: true,
        attributeFilter: ['data-active'],
    });

    $('.dressing-room-character-controls-category-switchers').on('click', e => {
        const t = e.target;
        if (e.target.tagName === "A") {
            if (t.dataset.category === "script") {
                $('.dressing-room-character-controls-category-switchers > a').each(function (index) {
                    this.dataset.active = false;
                });
                $(".dressing-room-character-controls-category").each(function (index) {
                    this.dataset.active = false;
                });
                $(".dressing-room-character")[0].dataset.category = "script";
                opt[0].dataset.active = true;
                a[0].dataset.active = true;
            }
            /*else {
                opt[0].dataset.active = false;
                a[0].dataset.active = false;
            }*/
            //console.log("CATEGORY SWITCH",t.dataset.category);
        }
    });

    if (!WH.Wow.DressingRoom) {
        console.log('No Wowhead dressing room.');
        return;
    }
    //$('div.dressing-room-character-controls-general').after('<div id="Dressing_Room_Script_Controls" style="max-width:315px;"></div>');
    $('body').append('<div id="Dressing_Room_Script_Controls" style="background:#202020;position:fixed;z-index:100000;right:0;bottom:0;min-width:400px;padding:20px;"></div>');
    //$('div.dressing-room-controls').append(HTML);
    //$('#Dressing_Room_Script_Controls').append(HTML);
    opt.append(HTML);
    $('#dressing_room_wrapper').show();
    //console.log('Character', WH.Wow.DressingRoom.getCharacterForHash());

    DR.urlInput = $('#comp_src');
    DR.urlInput.change(DR.onUrlInput);
    $('#comp_click').click(DR.onImportClick);
    $('.dr_code_buttons button').on('click', function (e) {
        //console.log("CLICKED");
        var mode = $(e.target).attr('mode');
        DR.createListCode(mode);
        DR.mode = mode;
        if (mode === "preview") {
            $('#dr_code_box').hide();
            $('#dr-preview').show();
        }
        else {
            $('#dr_code_box').show();
            $('#dr-preview').hide();
        }

    });
    $('#generate_chr').on('click', function (e) {
        DR.createWMVCode();
        $("#download_file")[0].click();
    });
    $('#generate_eq').on('click', function (e) {
        DR.createWMVCode('eq');
        $("#download_file")[0].click();
    });

    $('#record_video').on('click', function (e) {
        $(this).attr('active', true);
        if (!DR.recorder)
            DR.initRecorder();

        if (DR.recorder.state == 'inactive')
            DR.startRecording();
        else if (DR.recorder.state == 'recording')
            DR.stopRecording();
    });

    var interval = setInterval(function () {
        var paperdoll = g_paperdolls['dressing-room-paperdoll'];
        if (paperdoll) {
            clearInterval(interval);
            DR.hookUpdateViewer(paperdoll);
            DR.hookUpdateViewer(Paperdoll.prototype);
            //DR.onUpdateDressingRoom();
        }
    }, 100);


}

DR.hookUpdateViewer = function (p) {
    if (!p._updateSlots) {
        p._updateSlots = p.updateSlots;
        p.updateSlots = function (b) {
            this._updateSlots(b);
            try {
                //console.log('PAPER DOLL UPDATING SLOTS');
                DR.onUpdateDressingRoom();
            }
            catch (e) {
                console.log("COULD NOT INIT UPDATE SLOTS EVENT, ERROR ", e);
            }
        }
    }
    if (!p._updateCharAppearance) {
        p._updateCharAppearance = p.updateCharAppearance;
        p.updateCharAppearance = function (a) {
            this._updateCharAppearance(a);
            try {
                console.log('PAPER DOLL UPDATING CHAR APPEARANCE');
                DR.onUpdateDressingRoom();
            }
            catch (e) {
                console.log("COULD NOT INIT UPDATE CHAR APPEARANCE EVENT, ERROR ", e);
            }
        }
    }
    if (!p._saveData) {
        p._saveData = p.saveData;
        p.saveData = function (a) {
            var data = this._saveData(a);
            try {
                console.log('PAPER DOLL SAVING DATA');
                DR.onUpdateDressingRoom();
            }
            catch (e) {
                console.log("COULD NOT INIT SAVE PAPERDOLL DATA EVENT, ERROR ", e);
            }
            return data;
        }
    }
}

DR.recorder = null;

DR.recorderActive = false;

DR.onUpdateDressingRoom = function () {
    DR.createListCode(DR.mode);
    DR.multiAppearances();
}

DR.initRecorder = function () {

    var stream = $('.paperdoll-model-inner canvas')[0].captureStream();
    DR.recorder = new MediaRecorder(stream);

    DR.recorder.chunks = [];
    DR.recorder.totalsize = 0;

    DR.recorder.ondataavailable = function (event) {
        var audioURL = window.URL.createObjectURL(event.data);

        this.chunks.push(event.data);
        DR.recorder.totalsize = DR.recorder.totalsize + event.data.size;
        var totalSize = DR.recorder.totalsize;
        for (var i in this.chunks) {
            totalSize = totalSize + this.chunks[i].size;
        }
        if (totalSize / Math.pow(1024, 2) > 10) {
            console.log("More than 10MB of data");
            this.stop();
        }
        var totalSizeKB = Math.round(totalSize / Math.pow(1024, 1));
        var totalSizeMB = Math.round(totalSize / Math.pow(1024, 2));
        //var totalSizeGB = totalsize / Math.pow(1024,3);
        $('#download_video_link').text('Download movie (' + totalSizeMB + 'MB)');
    }

    DR.recorder.onstop = function (event) {
        var finalBlob = new Blob(this.chunks, { 'type': this.chunks[0].type });
        //var finalBlob = new Blob(this.chunks, { type: "video/webm" });
        var finalSrc = window.URL.createObjectURL(finalBlob);
        this.chunks = []; this.totalsize = 0;
        $('#record_video').text('Recording stopped');
        $('#download_video_link').attr('href', finalSrc);
    }
}

DR.startRecording = function () {
    if (!this.recorder) this.initRecorder();
    DR.recorder.chunks = []; DR.recorder.totalsize = 0;

    DR.recorder.start(500);
    $('#record_video').text('Recording video...');
}

DR.stopRecording = function () {
    this.recorderActive = false;
    DR.recorder.stop();
}


DR.test = function () {
    var i = e[i];
}

DR.processUrl = function (url) {
    //console.log(url.match(/^compare\?items=/));
    if (url.match(/^compare\?items=/)) {
        url = window.location.origin + '/' + url;
    }
    var _URL = new URL(url);
    if (_URL.hostname === "www.wowhead.com" && _URL.pathname === "/compare") {
        this.loadComparison(_URL);
        return;
    }
    if (url.match(/wowhead\.com\/compare/)) {
        this.loadComparison(url);
    }
    else if (url.match(/:\/\/\w+.wowhead.com\/outfit=/)) {
        var s = "/outfit=" + url.match(/outfit=(\d+)/)[1];
        $.get(s, function (data) {
            var l = data.match(/su_addToSaved\('([\d:.]+)',/)[1];
            DR.loadComparison(document.domain + "/compare?items=" + l);
        });
    }
    else {
        alert("Not a valid comparison or outfit URL");
    }
}


DR.loadComparison = function (url) {
    //url = url.search.replace("?items=","").replaceAll(":",",")
    const itemList = DR.buildComparisonList(url.search);
    //console.log("ITEMLIST",itemList);
    fetch("/beta/gatherer?items=" + itemList[0]).then(res=>res.text()).then(text=>{
            var summary = DR.parseSummary(text,itemList[1]);
            var character = DR.setEquipment(WH.Wow.DressingRoom.getCharacterForHash(), summary);
            //console.log("Updating from hash",character);
            WH.Wow.DressingRoom.updateFromHash(character);
            DR.updatePaperdoll();
    });
}

DR.buildComparisonList = function(string) {
    string = string.replace("?items=","")
    var items = [];
    var itemsWithBonuses = [];
    var items_ = string.split(":");
    
    for( var i of items_ ) {
            var i_ = i.split('.0.0.0.0.0.0.0.0.0.');
            itemsWithBonuses.push(i_);
            items.push(i_[0]);
    }

    return [items.join(','),itemsWithBonuses];
}

DR.parseSummary = function (text,items) {
    //console.log('DR.parseSummary');
    let match = text.match(/(\{(.+)\})/);
    //console.log('NEW ITEMS',text,"match1",match[1]);
    if(!match || !match[1]) return;


    const json = JSON.parse(match[1]);

    //console.log("NEW ITEMS****************************",items,text);

    eval(text);

    if (!items) {
        alert("No item list in summary");
        return null;
    }

    var itemlist = {};
    for (var i of items) {
        //const id = i[0];
        //const bonus = i[1];
        //var slot = g_items[items[i][0]].jsonequip.slot;
        //console.log('g_items[i[0]]',i[0],g_items);
        //var slot = g_items[i[0]].json.slot;
        if(!json[i[0]]) continue;

        var slot = json[i[0]].json.slot;
        
        var slotEq = DR.characterSlotToEquipmentOrder[slot];
        //console.log("TEST",json[i[0]],json[i[0]].json.slot,'slotEQ'+slotEq);
        //itemlist[slotEq] = { itemId: items[i][0], itemBonus: items[i][10], slotId: slot };
        itemlist[slotEq] = { itemId: i[0], itemBonus: i[1], slotId: slot };
    }
    return itemlist;
}

DR.setEquipment = function (character, equipment) {
    //console.log("NEW EQUIPMENT*************",equipment);
    for (var i in character.equipment) {
        character.equipment[i].itemId = 0;
        character.equipment[i].itemBonus = 0;

        var slot = DR.equipmentOrderToCharacterSlot[i];
        character.equipment[i].slotId = slot;

        if (equipment[i]) {
            character.equipment[i].itemId = equipment[i].itemId;
            character.equipment[i].itemBonus = equipment[i].itemBonus;
        }
    }
    return character;
}

DR.parseSummary_old = function (text) {
    var s_match = text.match(/new Summary(\(.+)/);
    if (!s_match || !s_match[0]) {
        alert("No summary detected");
        return null;
    }
    var summary = null;
    var Summary = function (data) {
        this.data = data;
    }
    summary = eval(s_match[0]);
    var items = summary.data.groups[0];
    if (!items) {
        alert("No item list in summary");
        return null;
    }
    var itemlist = {};
    for (var i in items) {
        var slot = g_items[items[i][0]].jsonequip.slot;
        var slotEq = DR.characterSlotToEquipmentOrder[slot];
        itemlist[slotEq] = { itemId: items[i][0], itemBonus: items[i][10], slotId: slot };
    }
    return itemlist;
}

DR.loadComparison_old = function (url) {
    $.ajax("/compare" + url.search,
        {
            dataType: "text",
            complete: function (data) {
                var g_match = data.responseText.match(/(g_items.add.+)/g);
                eval(g_match.join(''));
                var summary = DR.parseSummary(data.responseText);
                var character = DR.setEquipment(WH.Wow.DressingRoom.getCharacterForHash(), summary);
                WH.Wow.DressingRoom.updateFromHash(character);
                DR.updatePaperdoll();
            }
        });
}

DR.setPaperdollSlot = function (itemId, itemBonus, k) {
    var item = { itemId: itemId, itemBonus: itemBonus };
    item.slotId = DR.getGitemsJsonProp(itemId, 'slot');
    var raw = WH.convertPaperdollItemDataToRaw(item);
    var data = { raw: raw, artifactAppearanceMod: 0 }
    g_paperdolls["dressing-room-paperdoll"].setSlot(data, true);
}

DR.updatePaperdoll = function () {
    var raw = [];
    var newCharacter = WH.Wow.DressingRoom.getCharacterForHash();
    for (var i in newCharacter.equipment) {
        var item = {};
        var slot = newCharacter.equipment[i].slotId;
        if (!slot) {
            newCharacter.equipment[i].slotId = DR.getGitemsJsonProp(newCharacter.equipment[i].itemId, 'slot');
        }
        item.raw = WH.convertPaperdollItemDataToRaw(newCharacter.equipment[i]);
        item.artifactAppearanceMod = 0;
        raw.push(item);
    }
    g_paperdolls["dressing-room-paperdoll"].updateSlots(raw);
}



DR.onUrlInput = function (e) {
    var url = e.target.value;
    DR.processUrl(url);
}

DR.onImportClick = function (e) {
    var urlInput = prompt("Enter MogIt or WoWHead comparison link  e.g.\ncompare?items=115551:177580:25822:54473:18730:125171:51232:24112:71360\n", "");

    if (urlInput != null && urlInput.length > 0) {
        DR.processUrl(urlInput);
    }
}

DR.getItem = function (id) {
    return unsafeWindow.g_items[id]
}

DR.getGitemsJsonProp = function (id, propname) {
    var gitem = unsafeWindow.g_items[id];
    if (!gitem) {
        //console.log( "No such g_item: " + id , g_items[id] );
        return null;
    }
    //console.log('JSON ITEM', g_items[id]);
    if (g_items[id].json && g_items[id].json[propname])
        return g_items[id].json[propname];
    else if (g_items[id].jsonequip && g_items[id].jsonequip[propname])
        return g_items[id].jsonequip[propname];
    else return null;
}

DR.itemAppearances = {};

DR.multiAppearances = function () {
    $('div.iconmedium > div.bonus-buttons').remove();
    $('div.iconmedium a').css('outline', 'none');
    var equipment = WH.Wow.DressingRoom.getCharacterForHash().equipment;
    for (var i in equipment) {
        var appearances = DR.getGitemsJsonProp(equipment[i].itemId, 'appearances');
        if (appearances && Object.keys(appearances).length > 1) {
            //if item has more than one appearance
            if (!DR.itemAppearances[equipment[i].itemId])
                DR.searchItem(equipment[i].itemId);
            else
                DR.createAppearanceButtons(equipment[i].itemId);
        }
    }
}

DR.getItemName = function (id) {
    var gitem = g_items[id];
    for (var prop in gitem) {
        if (prop.match('name_')) {
            return gitem[prop];
        }
    }
    return null;
}

DR.searchItem = function (id) {
    var name = this.getItemName(id);
    if (!name || name.length < 1)
        return false;
    var base = window.location.origin + '/search?q=';
    var url = base + encodeURIComponent(name) + '&json&skipcb&skipis';
    $.post(url, function (res) {
        //console.log("SEARCHING ITEM", id);
        var a = eval(res);
        DR.searchItemProcess(id, a);
    });
}

DR.searchItemProcess = function (id, data) {
    if (!data[1] || !data[1].items) {
        return false;
    }
    var bonuses = [];
    var items = data[1].items
    for (var i = 0; i < items.length; i++) {
        if (items[i].id == id) {
            bonuses.push(items[i].bonuses[0]);
        }
    }
    DR.itemAppearances[id] = bonuses.sort();
    //console.log(DR.itemAppearances);
    DR.createAppearanceButtons(id);
}

DR.createAppearanceButtons = function (id) {
    var bonuses = DR.itemAppearances[id];
    //find paperdoll icon
    var a = $('div.iconmedium > a[href*="/item=' + id + '"]');
    a.css('outline', '1px solid red');
    a.parent('div.iconmedium').find('div.bonus-buttons').remove();
    var div = $('<div class="bonus-buttons" style="z-index:300;position:absolute;display:flex;flex-direction:row;bottom:0px;"></div>');
    a.parent('div.iconmedium').append(div);
    for (var b = 0; b < bonuses.length; b++) {
        var bonusButton = $('<button class="appearance-button" style="width:10px;font-size:9px;background:red;color:white;padding:0px;" />');
        div.append(bonusButton);
        bonusButton[0].dataset.itemId = id;
        bonusButton[0].dataset.itemBonus = bonuses[b];
        bonusButton.text(b);
    }
}

DR.setItem = function (info) {
    var eq = WH.Wow.DressingRoom.getCharacterForHash();
    if (!info.slot) {
        for (var e in eq.equipment) {
            if (parseInt(eq.equipment[e].itemId) == parseInt(info.id)) {
                eq.equipment[e].itemBonus = info.bonus;
            }
        }
    }
    WH.Wow.DressingRoom.updateFromHash(eq);
    DR.setPaperdollSlot(parseInt(info.id), parseInt(info.bonus), true);
}

DR.createListCode = function (mode) {
    if (!mode) mode = DR.mode;
    if (mode == "wmv") return this.createWMVCode();

    //var equipment = WH.Wow.DressingRoom.getCharacter().equipment;
    var equipment = WH.Wow.DressingRoom.getCharacterForHash().equipment;

    var list = [];

    for (var e in equipment) {
        if (equipment[e].itemId > 0) {
            var id = equipment[e].itemId;
            //var name = DR.getGitemsJsonProp( id , 'name' ).slice(1);
            var name = DR.getGitemsJsonProp(id, 'name');
            var slot = DR.getGitemsJsonProp(id, 'slot');

            //var slotName = g_item_slots[slot];
            var slotName = DR.getSlotName(slot);
            slotName = slotName || "";
            slotName = slotName.charAt(0).toUpperCase() + slotName.slice(1);

            var subclass = DR.getGitemsJsonProp(id, 'subclass');

            if (e > 11 && subclass > -1) { //weapons
                slotName = g_item_subclasses[2][subclass];
            }
            slotName = (slotName) ? slotName : "";
            name = (name) ? name : "";
            var url = "https://" + document.domain + "/item=" + id + "&bonus=" + equipment[e].itemBonus;
            list.push({ name: name, href: url, slot: slotName });
        }
    }

    var list_text = "";
    var codes = { html: "", reddit: "", forum: "", plain: "" };

    /*
  for( var i=0;i<list.length;i++ ) {
     if( mode == "html")
        list_text = list_text + list[i].slot + ": " + '<a href="' + list[i].href + '">' + list[i].name + '</a><br>\n';
     else if( mode == "reddit")
        list_text = list_text + list[i].slot + ": " + '[' + list[i].name + '](' + list[i].href + ')\n\n';
     else if( mode == "forum")
        list_text = list_text + list[i].slot + ': [url=' + list[i].href + ']' + list[i].name + '[/url]';
     else
        list_text = list_text + list[i].slot + ': ' + list[i].name + '\n';
  }*/

    for (var i = 0; i < list.length; i++) {
        codes.html = codes.html + list[i].slot + ": " + '<a href="' + list[i].href + '">' + list[i].name + '</a><br>\n';
        codes.reddit = codes.reddit + list[i].slot + ": " + '[' + list[i].name + '](' + list[i].href + ')\n\n';
        codes.forum = codes.forum + list[i].slot + ': [url=' + list[i].href + ']' + list[i].name + '[/url]';
        codes.plain = codes.plain + list[i].slot + ': ' + list[i].name + '\n';
    }

    //console.log( list_text );
    $('#dr_code_box').val(codes[mode]);
    $('#dr-preview')[0].innerHTML = codes.html;

    DR.mode = mode;
    return codes;
}

DR.getSlotName = function (slotId) {
    if (!g_character_slots_data) return false;
    for (let i of g_character_slots_data) {
        if (i.id === slotId) return i.name;
    }
    return false;
}



DR.createWMVItemCode = function (itemId, bonus, slot) {
    var gitem = g_items[itemId];
    var charSlot = DR.equipmentOrderToWMVSlot[slot];
    if (!charSlot || !gitem) {
        return "";
    }

    var id, displayId, level;

    //if( gitem ) {
    var json = (gitem.json) ? gitem.json : gitem.jsonequip;

    id = itemId;
    var gappearance = g_items.getAppearance(id, [bonus], WH.Wow.DressingRoom.getCharacterForHash().settings.artifactAppearanceMod);
    if (gappearance) {
        displayId = gappearance[0];
        var appearances = json.appearances;
        var levels = [];
        for (var o in appearances) {
            levels.push(appearances[o][0]);
        }
        level = levels.indexOf(gappearance[0]);
    }
    else {
        //if item has only 1 appearance
        for (var j in json.appearances) {
            if (json.appearances[j][0]) {
                displayId = json.appearances[j][0];
                break;
            }
        }
    }
    //}

    id = (id) ? id : -1;
    displayId = (displayId) ? displayId : -1;
    level = (level) ? level : 0;

    var string = '   <item>\n' +
        '      <slot value="' + charSlot[0] + '" name="' + charSlot[1] + '"/>\n' +
        '      <id value="' + id + '" name="' + json.name + '"/>\n' +
        '      <displayId value="' + displayId + '"/>\n' +
        '      <level value="' + level + '"/>\n' +
        '   </item>\n';
    return string;

}

DR.testHairHat = function (equipment) {
    var baldHats = "cowl chapeau turban hat faceguard visor helm helmet fez cap shroud";
    function isBald(name) {
        name = name.toLowerCase();
        for (var i of baldHats.split(" ")) {
            if (name.includes(" "+i)||name.includes(i+" ")) return true;
        }
        return false;
    }
    if (equipment[1].itemId > 0) {
        var gitem = g_items[equipment[1].itemId];
        var json = (gitem.json) ? gitem.json : gitem.jsonequip;
        let bald = isBald(json.name);
        //console.log('HEAD', json, 'bald', bald,'json',json);
        return bald;
    }
}

DR.createWMVCode = function (param) {
    DR.mode = "wmv";
    GM_setValue('mode', 'wmv');
    DR.bald = false;
    var character = WH.Wow.DressingRoom.getCharacterForHash();
    var settings = character.settings;

    //var race = g_file_races[settings.race];
    var race = WH.getPageData('wow.race.names')[settings.race];

    const genders = ['Male', 'Female'];

    //const showHair = (DR.testHairHat(character.equipment))?0:1;
    const showHair = 1;

    //var gender = g_file_genders[settings.gender];
    var gender = genders[settings.gender];

    //console.log('CHARACTER***************', character);

    const Custom = WH.getPageData('wow.dressingRoom.customizationOptions');

    const getCustomizationOptions = function (e, t) {
        let i = Custom[e];
        i = i && i[t];
        i = i || [];
        return i.slice()
    }

    const opts = getCustomizationOptions(settings.race, settings.gender);

    //console.log('customizationOptions', opts);

    //console.log('RACE', settings.race, WH.getPageData('wow.race.names'));

    const hdModels = 'human gnome orc bloodelf tauren draenei nightelf troll dwarf scourge';

    const optsByName = {};

    function createCharDetail(detail) {
        let arr = [];
        for (let d in detail) {
            arr.push(`${d}="${detail[d]}"`);
        }
        return `<customization ${arr.join(" ")}/>`;
    }

    const optstrings = [];

    for (let set of opts) {
        const choices = set.choices;
        let oo = optsByName[set.slug];
        oo = {
            id: set.id,
            value: settings[set.slug],
            name: set.name,
        };

        for (let c of choices) {
            if (c.id === settings[set.slug]) {
                if (c.color) oo.color = '#' + c.color;
                else oo.valueName = c.name;
                break;
            }
        }
        oo.string = createCharDetail(oo);
        optstrings.push(oo.string);
        optsByName[set.slug] = oo;
    }

    //console.log('OPTIONS', optsByName, optstrings.join("\n"));

    //Race Modification
    race = race.toLowerCase().replaceAll(" ", "");
    //If Naga
    if (settings.race == 13) race = "naga_";
    //If Undead
    if (settings.race == 5) race = "scourge";

    var classs = settings.class;

    var eyeGlow = 1;
    if (settings.class == 6)
        eyeGlow = 2;

    const classNames = WH.getPageData('wow.playerClass.names');
    //console.log("CLASSES", classNames);

    var isDemonHunter = 0;
    var DHTattooStyle = 0;
    var DHTattooColor = 0;
    var DHHornStyle = 0;
    var DHBlindFolds = 0;

    //If Demon Hunter
    if (classs == 12) {
        isDemonHunter = 1;
        DHTattooStyle = settings.tattoos;
        DHTattooColor = 0;
        DHHornStyle = settings.hornstyle;
        DHBlindFolds = settings.blindfolds;
    }

    var hdon = (g_paperdolls["dressing-room-paperdoll"].enableHD);
    var hd = "";

    //Races that have HD & OLD models
    /*if( settings.race < 12 ){
        if(hdon) hd = "_hd";
        //demon hunter models should be hd
        if(classs == 12) hd = "_hd";
    }*/

    if (hdModels.split(" ").indexOf(race) > -1) {
        hd = "_hd";
    }

    //If Naga
    //if( settings.race == 13 ) race = "naga_";

    //Old char details
    /*  '     <skinColor value="' + settings["skin-color"] + '"/>\n' +
        '     <faceType value="' + settings.face + '"/>\n' +
        '     <hairColor value="' + settings["hair-color"] + '"/>\n' +
        '     <hairStyle value="' + settings["hair-style"] + '"/>\n' +*/


    gender = gender.toLowerCase();
    var modelstring = 'character/' + race + '/' + gender + '/' + race + gender + hd;

    var equiplist = WH.Wow.DressingRoom.getCharacterForHash().equipment;
    let equipText = "";
    for (var i in equiplist) {
        try {
            var itemCode = DR.createWMVItemCode(equiplist[i].itemId, equiplist[i].itemBonus, i);
            equipText = equipText + itemCode;
        }
        catch (e) {
            console.log("Error processing item " + equiplist[i].itemId + " \n Errorcode: " + e);
        }
    }

    const modelText = `<model>
                        <file name="${modelstring}.m2"/>
                        <CharDetails>
                            ${optstrings.join("\n")}
                            <eyeGlowType value="${eyeGlow}"/>
                            <showUnderwear value="1"/>
                            <showEars value="1"/>
                            <showHair value="${showHair}"/>
                            <showFacialHair value="1"/>
                            <showFeet value="0"/>
                            <isDemonHunter value="${isDemonHunter}"/>
                        </CharDetails>
                    </model>`;

    var text = `<?xml version="1.0" encoding="UTF-8"?>
                    <SavedCharacter version="2.0">
                        ${(param == 'eq') ? "" : modelText}
                        <equipment>
                        ${equipText}
                        </equipment>
                    </SavedCharacter>`;

    /*if (param == 'eq') text = '<?xml version="1.0" encoding="UTF-8"?>\n' +
        ' <SavedCharacter version="1.0">\n' +
        '<equipment>\n';



    text = text + '  </equipment>\n' +
        ' </SavedCharacter>\n';*/

    text = `<?xml version="1.0" encoding="UTF-8"?>\n` + DR.prettifyXml(text);
    $('#wmv_export').val(text);


    var file_uri = 'data:text/xml;charset=utf-8,' + encodeURIComponent(text);


    $("#download_file").attr('href', file_uri);
    $("#code_file").attr('href', file_uri);

    var filename = "My Character";

    if (param == "eq") $("#download_file").attr('download', filename + ".eq");
    else
        $("#download_file").attr('download', filename + ".chr");


    filename = "My Character";

    $("#dr_code_box").val(text);


    return text;
}

DR.prettifyXml = function (sourceXml) {
    var xmlDoc = new DOMParser().parseFromString(sourceXml, 'application/xml');
    var xsltDoc = new DOMParser().parseFromString([
        // describes how we want to modify the XML - indent everything
        '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
        '  <xsl:strip-space elements="*"/>',
        '  <xsl:template match="para[content-style][not(text())]">', // change to just text() to strip space in text nodes
        '    <xsl:value-of select="normalize-space(.)"/>',
        '  </xsl:template>',
        '  <xsl:template match="node()|@*">',
        '    <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
        '  </xsl:template>',
        '  <xsl:output indent="yes"/>',
        '</xsl:stylesheet>',
    ].join('\n'), 'application/xml');

    var xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xsltDoc);
    var resultDoc = xsltProcessor.transformToDocument(xmlDoc);
    var resultXml = new XMLSerializer().serializeToString(resultDoc);
    return resultXml;
};

DR.init();
