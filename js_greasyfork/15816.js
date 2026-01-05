// ==UserScript==
// @name         GlobalQuest
// @namespace    RedWyne, Sketch2
// date          Jan 11, 2016
// @version      0.7
// @description  Shows needed items for Global_Quest + columns click~sort.
// @author       DoYouSketch2
//
// @match        http://bots.el-services.net/*
//
// @grant      GM_info
// @grant      GM_getValue
// @grant      GM_setValue
// @grant      GM_xmlhttpRequest
// @grant      GM_registerMenuCommand
// @UpdateURL  https://greasyfork.org/scripts/15816-globalquest/code/GlobalQuest.user.js
//
// @require      http://code.jquery.com/jquery-2.1.4.min.js
//
// @copyright     (c) 2015 USA, DoYouSketch2       (GPL-3.0)
// Released under the GNU General Public License, version 3
// https://gnu.org/licenses/gpl-3.0.txt
//
// @downloadURL https://update.greasyfork.org/scripts/15816/GlobalQuest.user.js
// @updateURL https://update.greasyfork.org/scripts/15816/GlobalQuest.meta.js
// ==/UserScript==

//  Do you want to log debug info to console?
var Debug = 0
//  set Debug = 1 to log variable info
//  set Debug = 0 to reduce render time


//  add "Global_Quest" Bot link to the front page

$('p.index') .append('<a class="arrow" href="Global_Quest.php">Global_Quest</a>');
$('a.arrow:contains("Global_Quest")') .css('padding-left','30px') .css('padding-right','30px');


var BotName = $('table#botinfo td.botinfo-botname') .text();

if (BotName == "Global_Quest") {

    //  Add in column headers

    $('div#selling th.storage') .filter(':first')
        .before('<th class="storage">Emu</th>')
        .after('<th class="storage">Quest</th>');
    $('div#selling th.storage') .filter(':eq(5)')
        .after('<th class="storage">Required</th>')
        .after('<th class="storage">Hyutan has</th>')
        .next() .addClass('Hyutan');

    //  Get free slots & EMU info
    
    $('table#botinfo td.botinfo-owner') .width('425px');
    var Storage = ($('div#selling th.storage:last') .text() .split(" "));
    $('div#selling th.storage:last') .remove();
    $('table#botinfo  td.botinfo-owner') .after('<font size="3"> ' + (300-parseInt(Storage[0])) + '</font>')
    .next() .css('padding','3px 3px 3px 12px') .css('border-width','0px 0px 0px 3px')
    .css('border-style','solid') .css('border-color','grey')
    .after('<font size="1">  storage slots free</font>');

    var Emu = $('td.public_footer') .text() .split(" ");
    $('td.botinfo-owner')
        .after('<font size="2"> ' + Emu[5] + '</font>')
        .next() .css('padding','0px 18px 0px 0px');

    //  If Emu is full, highlight with big red 0

    if (parseInt(Emu[4]) == 0)
        $('td.botinfo-owner') .after('</font><font size="6" color="red">0</font>');
    else
        $('td.botinfo-owner') .after('<font size="5">' + Emu[4] + '</font>');

    //  "Slots &"

    $('td.botinfo-owner') .after('<font size="1"> ' + Emu[1] +' '+ Emu[2] +' '+ Emu[3] + ' </font>');

    //  If Slots are full, highlight with big red 0

    if (parseInt(Emu[0]) == 0)
        $('td.botinfo-owner') .after('</font><font size="6" color="red">0</font>');
    else
        $('td.botinfo-owner') .after('' + Emu[0] + '</font>');


    //  Credits

    $('table#botinfo td.botinfo-location:first')
    .attr('colspan','1') 
    .after('<font size="1" color="grey">Thanks to: <b>RedWyne</b> // <b>Sketch2</b> for this jQuery script!</font>');


    //  Function to find exact text, disregarding case

    $.expr[":"] .exactContain = $.expr .createPseudo(function(arg) {
        return function(elem) {
            if ($(elem) .text() .toLowerCase() .indexOf(arg) >= 0)
                if (String($(elem) .text() .length) == String(arg .length))
                    return $(elem);
        };
    });


    //  We don't need items to be listed twice

    $('div#selling td:even:even:exactContain("5")') .siblings(':exactContain("potions")') .parent() .remove();
    $('div#selling td:even:even:exactContain("8")') .siblings(':exactContain("weapons")') .parent() .remove();
    $('div#selling td:even:even:exactContain("39")') .siblings(':exactContain("flowers")') .parent() .remove();
    $('div#selling td:even:even:exactContain("641")') .siblings(':exactContain("potions")') .parent() .remove();


    //  Set up variables

    var Hyutan = ["261","363","468","469","1029","1076"];

    var ItemId = ["5","17","19","22","23",
                  "40","89","114","115","158","174",
                  "200","204","252","253",
                  "254","255","256","257","261",
                  "265","284","363",
                  "466",
                  "468","469",
                  "634","641","642",
                  "650","652","655",
                  "658","906","907",
                  "1029","1076"];

    var ItemName = ["Potion of Feasting","Tulips","Daffodils","Dandelion","Nightshade",
                    "Mugwort","Empty Vial","Rue","Mullein","Poison Ivy","Henbane",
                    "Blue Berries","White Chanterelle","Ogre Toes","Tree Mushroom",
                    "Yarrow","Red Currents","Poppies","Wormwood","Gypsum",
                    "Valerian","Feran Horn","Black Dragon Scale",
                    "Yarrow - Wormwood - Tulips Extract",
                    "Refined Vegetal Mixture","Mixture of Power",
                    "Wheat","Creature food","Mule Glyph",
                    "Nightshade - Mullein - Dandelion Extract",
                    "Red Currents - Blue Berries - Rue Extract",
                    "Poison Ivy - Henbane - Poppies Extract",
                    "White Chanterelle - Ogre Toes - Tree Mushroom Extract",
                    "Wheat - Daffodils - Feran Horn Extract",
                    "Wheat - Valerian - Mugwort Extract",
                    "Orange","Amber"];

    var Category = ["Potions","Flowers","Flowers","Flowers","Flowers",
                    "Flowers","Misc","Flowers","Flowers","Flowers","Flowers",
                    "Flowers","Flowers","Flowers","Flowers",
                    "Flowers","Flowers","Flowers","Flowers","Minerals",
                    "Flowers","Animal","Magic",
                    "Potions",
                    "Potions","Potions",
                    "Flowers","Misc","Misc",
                    "Potions","Potions","Potions",
                    "Potions","Potions","Potions",
                    "Misc","Minerals"];

    var BgColor = ["#33FFFF","#FFCCCC","#FFCCCC","#FFCCCC","#FFCCCC",
                    "#FFCCCC","#FFFFFF","#FFCCCC","#FFCCCC","#FFCCCC","#FFCCCC",
                    "#FFCCCC","#FFCCCC","#FFCCCC","#FFCCCC",
                    "#FFCCCC","#FFCCCC","#FFCCCC","#FFCCCC","#FFFF99",
                    "#FFCCCC","#FF9966","#00CCFF",
                    "#33FFFF",
                    "#33FFFF","#33FFFF",
                    "#FFCCCC","#FFFFFF","#FFFFFF",
                    "#33FFFF","#33FFFF","#33FFFF",
                    "#33FFFF","#33FFFF","#33FFFF",
                    "#FFFFFF","#FFFF99"];

    var ItemEmu = ["5","1","1","1","1",
                   "1","1","1","1","1","1",
                   "1","1","1","1",
                   "1","1","1","1","10",
                   "1","3","1",
                   "1",
                   "1","1",
                   "1","1","1",
                   "1","1","1",
                   "1","1","1",
                   "1","5"];

    var Quest = ["0","10000","10000","10000","10000",
                 "10000","1750","10000","10000","10000","10000",
                 "10000","10000","10000","10000",
                 "10000","10000","10000","10000","13500",
                 "10000","1000","50",
                 "250",
                 "50","50",
                 "20000","0","0",
                 "250","250","250",
                 "250","250","250",
                 "25","1200"];

    var MOPings = ["0","0","200","0","0",
                    "200","15","0","0","0","0",
                    "0","200","200","200",
                    "0","0","0","0","30",
                    "200","20","0",
                    "0",
                    "0","0",
                    "400","0","0",
                    "0","0","0",
                    "5","5","5",
                    "0","0"];

    var RVMings = ["0","200","0","200","200",
                    "0","20","200","200","200","200",
                    "200","0","0","0",
                    "200","200","200","200","40",
                    "0","0","0",
                    "5",
                    "0","0",
                    "0","0","0",
                    "5","5","5",
                    "0","0","0",
                    "0","0"];

//  Hide extraneous data

    $('div#purchasing') .remove();
    $('div#selling tr:gt(0)') .hide();

//  Only show items we need
    for	(i = 0; i < ItemId.length; i++) {
        var Column1 = $('div#selling td:first-child:exactContain(' + ItemId[i] + ')');

        Column1 .addClass('ID') .parent() .show() .children(':first')
        // Emu
            .before('<td class="storage">' + 
            (parseInt(ItemEmu[i]) * parseInt(Column1 .parent() .children(':eq(2)') .text())) + '</td>')
            .prev() .addClass('EMU')
        // Quest
            .next() .after('<td class="storage">' + Quest[i] + '</td>')
            .next() .addClass('Quest')
        // Labels
            .next() .addClass('Name')
            .next() .addClass('Quant')
            .attr('initialval',(Column1 .parent() .children('.Quant') .text()))
            .next() .addClass('Cat')
        // Hyutan
            .after('<td class="storage">' + GM_getValue(ItemId[i],0) + '</td>')
            .next() .addClass('Hyutan')
        // Reqired
            .after('<td class="storage">' + 
            (parseInt(Quest[i]) - parseInt(Column1 .parent() .children(':eq(4)') .text()))+ '</td>')
            .next() .addClass('Req') .css('color','black') .css('font-weight','bold')
            .attr('initialVal',(Quest[i]))
            .text((Column1 .siblings(':last') .attr('initialval')) - GM_getValue(ItemId[i],0) - (Column1 .parent() .children('.Quant') .attr('initialval')));

        // Add in rows that are missing
        if (!Column1.length) {
            $('div#selling tr:last')
                .after('<tr bgcolor="' + BgColor[i] + '"></tr>') .next('tr')
                .append('<td class="storage">~</td>')
                .append('<td class="storage">' + ItemId[i] + '</td>')
                .append('<td class="storage">' + Quest[i] + '</td>')
                .append('<td class="storage">' + ItemName[i] + '</td>')
                .append('<td class="storage">~</td>')
                .append('<td class="storage">' + Category[i] + '</td>')
                .append('<td class="storage">~</td>')
                .append('<td class="storage">' + (parseInt(Quest[i]) - parseInt(GM_getValue(ItemId[i],0))) + '</td>')

            //  Label them
                .children(':first') .addClass('EMU')
                .next() .addClass('ID')
                .next() .addClass('Quest')
                .next() .addClass('Name')
                .next() .addClass('Quant')
                .next() .addClass('Cat')
                .next() .addClass('Hyutan')
                .next() .addClass('Req')
                .css('color','black')
                .css('font-weight','bold')
                .attr('initialval',Quest[i]);
        };

        // Add in .class names so it's easier to filter later
        if (MOPings[i] > 0) $('td.ID:exactContain(' + ItemId[i] + ')') .parent() .addClass('MOP');
        if (RVMings[i] > 0) {
            $('td.ID:exactContain(' + ItemId[i] + ')') .parent() .filter('.MOP') .addClass('Both');
            $('td.ID:exactContain(' + ItemId[i] + ')') .parent() .addClass('RVM');
        };
    };

//  For the hidden rows, add in a couple columns, so everything lines up
    $('div#selling td:first-child') .not('.EMU') 
    .before('<td></td>') .after('<td></td>')
    .prev() .addClass('storage')
    .next() .next() .addClass('storage') .next() .next() .next()
    .after('<td></td>') .next() .addClass('storage')
    .after('<td></td>') .next() .addClass('storage');


//  If it's an item Hyutan wants, give it an input box

    for	(i = 0; i < Hyutan.length; i++) {
        var Hval = GM_getValue(Hyutan[i],0);
        $('td.ID:exactContain(' + Hyutan[i] + ')')
            .siblings('.Hyutan') .addClass('input')
            .html('<input value=' + Hval + '>')
    };

    //  Make Hyutan's items clickable content

    $('td.input') .focusout(function() {
        var Ident = $(this) .prevAll('.ID') .text();
        if (Debug == 1) console.log('Ident ' + Ident)
        var Quest = parseInt($(this) .prevAll('.Quest') .text());
        if (!(Quest > 0)) Quest = 0;
        if (Debug == 1) console.log('Quest ' + Quest)
        var Quant = parseInt($(this) .prevAll('.Quant') .text());
        if (!(Quant > 0)) Quant = 0;
        if (Debug == 1) console.log('Quant ' + Quant)
        var HyutanHas = parseInt($(this) .children() .val());
        if (HyutanHas > Quest) {
            HyutanHas = Quest;
            $(this) .children() .val(Quest);
        };
        if (!(HyutanHas > 0)) {
            $(this) .children() .val('0');
            HyutanHas = 0;
        };
        if (Debug == 1) console.log('HyutanHas ' + HyutanHas)
        GM_setValue(Ident,HyutanHas);
        var Req = (Quest-Quant-HyutanHas);

        //  Get values, default to 0. Subtract amounts to find what's still required

        for	(i = 0; i < ItemId.length; i++) {
            if (Ident == ItemId[i]) {
                var MOPsum = 0;
                if (MOPings[i] > 0) {
                    MOPsum = (GM_getValue(469,0)*MOPings[i]);
                    if (!(MOPsum > 0)) MOPsum = 0;
                };
                if (Debug == 1) console.log('MOPsum ' + MOPsum)
                var RVMsum = 0;
                if (RVMings[i] > 0) {
                    RVMsum = (GM_getValue(468,0)*RVMings[i]);
                    if (!(RVMsum > 0)) RVMsum = 0;
                };
                if (Debug == 1) console.log('RVMsum ' + RVMsum)
            }
            else if (Ident == 468 || Ident == 469) {
                for	(x = 0; x < ItemId.length; x++) {
                    if (MOPings[x] > 0 || RVMings[x] > 0) {
                        var Me = $('td.ID:contains(' + ItemId[x] +')');
                        var Init = Me .nextAll('.Req') .attr('initialVal');
                        if (!(Init > 0)) Init = 0;
                        if (Debug == 1) console.log('Init ' + Init)
                        var Hyu = Me .nextAll('.Hyutan input') .val();
                        if (!(Hyu > 0)) Hyu = 0;
                        if (Debug == 1) console.log('Hyu ' + Hyu)
                        var Quan = Me .nextAll('.Quant') .attr('initialVal');
                        if (!(Quan > 0)) Quan = 0;
                        if (Debug == 1) console.log('Quan ' + Quan)
                        var MOPamt = (GM_getValue(469,0)*MOPings[x]);
                        if (Debug == 1) console.log('MOPamt ' + MOPamt)
                        var RVMamt = (GM_getValue(468,0)*RVMings[x]);
                        if (Debug == 1) console.log('RVMamt ' + RVMamt)
                        if (!(Init-Hyu-Quan-MOPamt-RVMamt > 0)) var Yet = "~"
                        else var Yet = (Init-Hyu-Quan-MOPamt-RVMamt);
                        if (Debug == 1) console.log('Yet ' + Yet)
                        Me .nextAll('.Req') .text(Yet);
                    };
                };
            };
        };
        var Required = (Req-MOPsum-RVMsum);
        if (Debug == 1) console.log('Required ' + Required)

        // Hide the ings that have already been collected
        if (!(Required > 0)) {
            $(this) .next() .text('~');
            if (Ident == 469) $('tr.MOP') .hide();
            if (Ident == 468) $('tr.RVM') .hide();
        }

        // Show the ings we haven't collected
        else {
            $(this) .next() .text(Required);
            if (Ident == 469) $('tr.MOP') .show();
            if (Ident == 468) $('tr.RVM') .show();
        };
        $('tr.Both') .show();
    });


    //  Keyboard events

    $('td.input') .keydown(function(event) {

        //  If we press Enter, it updates values

        if (event.keyCode == 13) $(this) .focusout();

        //  If we press Escape, it clears values

        if (event.keyCode == 27) {
            $(this) .children(':first') .val('0');
            $(this) .focusout();
        }
    });


    //  Hide data that is <= 0
    //  We can't simply hide items with the "-" symbol in them,
    //  because that would hide extracts as well  :P

    $('div#selling td:contains("-1")') .text('~');
    $('div#selling td:contains("-2")') .text('~');
    $('div#selling td:contains("-3")') .text('~');
    $('div#selling td:contains("-4")') .text('~');
    $('div#selling td:contains("-5")') .text('~');
    $('div#selling td:contains("-6")') .text('~');
    $('div#selling td:contains("-7")') .text('~');
    $('div#selling td:contains("-8")') .text('~');
    $('div#selling td:contains("-9")') .text('~');

    $('div#selling td:exactContain("0")') .text('~');


    //  Fade logo at top, so it's easier to read text

    $('div#logo') .css('background','URL(data:image/jpeg;base64,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) no-repeat');


    //  TrustBot results for bot owner

    var Owner = $('td.botinfo-owner') .html() .split(" ");
    $('td.botinfo-owner')
    .html('<td>My Owner is <b><a href=http://www.reptileroom.net/elstuff/trustbot/details.php?player=' + Owner[3] .toLowerCase() + ' style="color:blue">' + Owner[3] + '</a></b></td>');


    //  Sorting algorithm for tables

    function getCellValue(row, index){ return $(row) .children('td') .eq(index) .text() };

    function compare(index) {
        return function(a, b) {
            var valA = getCellValue(a, index), valB = getCellValue(b, index)
            //  bypass commas, so we can sort numbers 1,000 and up
            var fixA = valA.replace(/,/g, ''), fixB = valB.replace(/,/g, '')
            return $.isNumeric(fixA) && $.isNumeric(fixB) ? fixA - fixB : fixA.localeCompare(fixB)
        }
    };


    //  Make headers click~sort

    $('div#content th.storage') .click(function() {
        var table = $(this) .parent() .parent()
        var rows = table.find('tr:gt(0)') .toArray() .sort(compare($(this).index()))
        this.asc = !this.asc
        if (!this.asc){rows = rows.reverse()}
        for (var i = 0; i < rows.length; i++){table.append(rows[i])}
    });


    //  Click reset to clear Hyutan values

    $('div#ddtopmenubar ul') .append('<li><a>Reset</a></li>');
    $('div#ddtopmenubar li:last a') .css('float','right') .click(function() {
            $('div#content td.input') .children() .val('0') .focusout();
    });


    //  Hide & Show toggle for extra rows

    var Hidden = 1;
    $('div#ddtopmenubar ul') .append('<li><a>Show</a></li>');
    $('div#ddtopmenubar li:eq("-1") a') .css('float','right') .css('border-left','1px solid white') .click(function() {
        if (Hidden == 1) {
            $('div#ddtopmenubar li:eq("-1") a') .text('Hide');
            $('div#selling tr') .show();
            Hidden = 0;
        }
        else {
            $('div#ddtopmenubar li:eq("-1") a') .text('Show');
            $('div#selling tr') .hide();
            $('div#selling td.ID') .parent() .show();
            Hidden = 1;
        };
    });


    //  Center table

    $('div#selling') .width('70%');
    $('div#selling') .css('padding-left','10%');
    $('div#content th') .css('padding','6px') .css('padding-bottom','10px');
    $('div#content td') .css('padding','6px');


    //  Shrink Hyutan column a bit

    $('div#content input') .width('70px');
    $('div#content tr.Hyutan') .width('90px');


    //  Send click events, so that Hyutan boxes are up top, and flower values are generated

    $('div#content th.Hyutan') .click();
    $('div#content td.ID:contains(468)') .nextAll('.Hyutan') .children() .focusout();
    $('div#content td.ID:contains(469)') .nextAll('.Hyutan') .children() .focusout();
    $('div#content td.ID:contains(261)') .nextAll('.Hyutan') .children() .focusout();
};
