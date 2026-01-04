// ==UserScript==
// @name         Character Sheet Tools & Styles
// @namespace    https://roll20.net
// @version      1.6
// @description  Adding a few personal character sheet tools and styles for organization
// @author       AppEternal
// @match        https://app.roll20.net/editor/character/*
// @match        https://app.roll20.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roll20.net
// @grant        GM_addStyle
// @grant        GM.setValue
// @grant        GM.getValue
// @license MIT
// @run-at       document-start
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/487241/Character%20Sheet%20Tools%20%20Styles.user.js
// @updateURL https://update.greasyfork.org/scripts/487241/Character%20Sheet%20Tools%20%20Styles.meta.js
// ==/UserScript==

const $ = window.jQuery;
const configs = {}

async function pageLoad(){
    await bookmark()
    await moveApiDown()
}

async function charaterSheetLoad(){
    await setDrawerClasses()
    await addListener()
    await spellSideBySide()
    await mathBox()
    await renameItems()
    await hideCharacteristics()
    await loadDroorStatus()
}


async function deleteBookMark(id) {
    let current = await get(`bookMarks-${unsafeWindow.campaign_id}`) ?? "{}"
    let converted = JSON.parse(current)
    if(converted[id]) delete converted[id]
    await set(`bookMarks-${unsafeWindow.campaign_id}`, JSON.stringify(converted))
    await RenderBookmark(true)
}
async function getBookMarks() {
    let current = await get(`bookMarks-${unsafeWindow.campaign_id}`) ?? "{}"
    let converted = JSON.parse(current)
    return converted
}
async function saveBookMark(id, name) {
    let current = await get(`bookMarks-${unsafeWindow.campaign_id}`) ?? "{}"
    let converted = JSON.parse(current)
    converted[id] = name
    await set(`bookMarks-${unsafeWindow.campaign_id}`, JSON.stringify(converted))
    await RenderBookmark(true)
}

async function RenderBookmark(cycle = false){
    let Start = `<div id="bookmarkWindow" class="ui-dialog ui-resizable updated" tabindex="-1" style="outline: 0px; z-index: 10518; position: absolute; height: 424.8px; width: 289.8px; top: 361px; left: 2px; display: flex;" role="dialog" aria-labelledby="ui-id-9"><div class="ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix ui-draggable-handle">Bookmarks</div><div class="dialog ui-dialog-content ui-widget-content" style="display: block; width: auto; min-height: 0px; height: 465px;" scrolltop="0" scrollleft="0">`
    let End = `</div></div>`;
    if ($('#bookmarkWindow').length) {
        $('#bookmarkWindow').remove();
        if(!cycle) return
    }else{
        if(cycle) return
    }
    let bookmarks = await getBookMarks()
    let display = ""
    for(let item in bookmarks){
        display += `<li><button class="btn deleteBookmark" data-itemidnew="${item}" style="margin-right:10px;"><span class="pictos">d</span></button><a href="#" data-itemidnew="${item}" class="bookmarkOpen"'>${bookmarks[item]}</a></li>`
    }

    let Middle = `<ul style="list-style-type: none;margin:0px;">${display}</ul>`;
    $("body").append(`${Start}${Middle}${End}`)
    $('.bookmarkOpen').click(async function (event){
        const handoutId = $(this).attr('data-itemidnew');
        $(`[data-itemid="${handoutId}"]`).click()
    })
    $('.deleteBookmark').click(async function (event){
        const handoutId = $(this).attr('data-itemidnew');
        await deleteBookMark(handoutId)
    })
}
async function displayBookmarks(){
    if(!await get("moveApiDown")) return
    $('.upper-buttons').append(`<div><button class="btn displayBookMarks" style=""><span class="pictos">z</span></button></div>`)
     $('.displayBookMarks').click(async function (event){
         await RenderBookmark()
    })
}
async function bookmark(){
    if(!await get("useBookmarks")) return
    await displayBookmarks()
    async function runBookMark(event){
        event.preventDefault();
        const handoutId = $(this)
        .closest('.ui-dialog')
        .find('.ui-dialog-content')
        .attr('data-handoutid');
        const handoutIdCharacter = $(this)
        .closest('.ui-dialog')
        .find('.ui-dialog-content')
        .attr('data-characterid');
        const handoutTitle = $(this)
        .closest('.ui-dialog')
        .find('.ui-dialog-title')
        .contents().filter(function() {
            return this.nodeType === 3; // Node.TEXT_NODE
        }).text();
        let id = handoutId ?? handoutIdCharacter
        if(id) await saveBookMark(id, handoutTitle)

        let bookMarks = await getBookMarks()
    }
    const observer = new MutationObserver((mutationsList, observer) => {
        if ($('.ui-dialog:not(.updated)').length) {
            $('.ui-dialog:not(.updated) .showpopout').after(`<button class="btn smallBtn bookMark" style="margin-right: 15px;"><span class="pictos">z</span></button>`);
            $('.ui-dialog:not(.updated) .bookMark').click(runBookMark)
            $('.ui-dialog:not(.updated)').addClass("updated")

        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

}

/*
 *
 * hide the Characteristics section
 *
*/
async function hideCharacteristics(){
    if(await get("hideCharacteristics")){
        $(".charactersheet .rp-traits").addClass("hideCharacteristics");
    }else{
        $(".charactersheet .rp-traits").removeClass("hideCharacteristics");
    }
}

/*
 *
 * Toggle move api class
 *
*/
async function moveApiDown(){
    if(await get("moveApiDown")){
        $("#secondary-toolbar").addClass("move2bottom");
    }else{
        $("#secondary-toolbar").removeClass("move2bottom");
    }
}

/*
 *
 * Allow Renaming Items
 *
*/
async function renameItems(){
    if(await get("collapsibleCharacterSheetRename")){
        $(".toggleItems.toggleItemsStyle .name").removeClass("blockRename");
    }else{
        $(".toggleItems.toggleItemsStyle .name").addClass("blockRename");
    }
}

/*
 *
 * Toggle move api class
 *
*/
async function spellSideBySide(){
    if(await get("spellSideBySide")){
        $(".container.pc .page.spells").addClass("spellSideBySide");
    }else{
        $(".container.pc .page.spells").removeClass("spellSideBySide");
    }
}

/*
 *
 * Add math to the input boxes
 *
*/
async function mathBox(){
    if(await get("handleMath")){
        $("input:not(.skipMe)").change(function(event){
            let value = $(this).val()
            if(!/^[0-9+\-*]+$/.test(value)) return
            if(!/[*\-+]+/.test(value)) return

            $(this).val(parse(value))

        })
        $("input[type=number]").prop("type", "text");
        $("input:not(.skipMe)").addClass("skipMe")
    }
}
function parse(str) {
    return Function(`'use strict'; return (${str})`)()
}

/*
 *
 * save & load droor status
 *
*/
async function saveDroorStatus(id, status) {
    let current = await get("savedIds") ?? "{}"
    let converted = JSON.parse(current)
    converted[id] = status
    await set("savedIds", JSON.stringify(converted))
}
async function loadDroorStatus() {
    let current = await get("savedIds") ?? "{}"
    let converted = JSON.parse(current)
    let reSave = {}
    for (const id in converted){
        if(converted[id]) {
            toggleHide(id);
            reSave[id] = converted[id]
        }
    }
    await set("savedIds", JSON.stringify(converted))
}
/*
 *
 * set the classes for the droor items
 *
*/
async function setDrawerClasses() {
    console.log("Character Sheet Tools: adding drawer classes")
    let repList = $(".licensecontainer .repcontainer .repitem");
    let hiddenText = await get("collapsibleCharacterSheetString")
    let collapseEnabled = await get("collapsibleCharacterSheet")
    let style1 = await get("styleOption1")
    let style1String = await get("styleOption1String")
    let style2 = await get("styleOption2")
    let style2String = await get("styleOption2String")
    let style3 = await get("styleOption3")
    let style3String = await get("styleOption3String")
    console.log(`Character Sheet Tools: checking options - ${style1} - ${style1String}`)
    console.log(`Character Sheet Tools: checking options - ${style2} - ${style2String}`)
    console.log(`Character Sheet Tools: checking options - ${style3} - ${style3String}`)
    let style = await get("collapsibleCharacterSheetStyle")
    for (let i = 0; i < repList.length; i++) {
        let element = repList.eq(i);
        let blockText = element.text();
        let itemText = $(element).find(".item").text();
        let itemValue = $(element).find(".name ").val();
        let text = blockText + itemText + itemValue;

        if (style1 && text.includes(style1String)) {
            $(element).closest(".repitem").addClass("custom_Style1");
        }
        if (style2 && text.includes(style2String)) {
            $(element).closest(".repitem").addClass("custom_Style2");
        }
        if (style3 && text.includes(style3String)) {
            $(element).closest(".repitem").addClass("custom_Style3");
        }

        if (collapseEnabled && text.includes(hiddenText)) {
            if(style){
                $(element).closest(".repitem").addClass("toggleItemsStyle");
            }
            $(element).closest(".repitem").addClass("toggleItemsOpen");
            $(element).closest(".repitem").addClass("toggleItems");
        }
    }
}

/*
 *
 * Add collapsed draws
 *
*/
async function addListener() {
    if(!await get("collapsibleCharacterSheet")) return

    let repList = $('.licensecontainer .repcontainer .repitem');
    repList.off("click");
    repList.on("click", async function () {
        if($(this).find(`.trait`)?.length) return
        let id = $(this).attr("data-reprowid");
        await toggleHide(id);
    });

    let repListTrait = $(".licensecontainer .textbox .repcontainer .repitem .display-flag");
    repListTrait.off("click");
    repListTrait.on("click", async function () {
        let id = $(this).closest(".repitem").attr("data-reprowid");
        await toggleHide(id);
    });
}
async function toggleHide(id) {
    if(!await get("collapsibleCharacterSheet")) return
    let repList = $(".licensecontainer .repcontainer .repitem");
    let hiddenText = await get("collapsibleCharacterSheetString")
    let styleDrop = await get("collapsibleCharacterSheetStyle")
    let allRep = {};
    for (let i = 0; i < repList.length; i++) {
        let element = repList.eq(i);
        let nearestContainer = $(element)
        .closest(".repcontainer")
        .attr("data-groupname");
        let reprowid = element.attr("data-reprowid");
        if (!allRep[nearestContainer]) allRep[nearestContainer] = [];
        allRep[nearestContainer].push({
            id: reprowid,
            rep: element,
        });
    }
    let collapseRep = {};
    for (let i = 0; i < repList.length; i++) {
        let element = repList.eq(i);
        let blockText = element.text();
        let itemText = $(element).find(".item").text();
        let itemValue = $(element).find(".name ").val();
        let text = blockText + itemText + itemValue;
        if (text.includes(hiddenText)) {
            let nearestRepItem = $(element)
            .closest(".repitem")
            .attr("data-reprowid");
            let nearestContainer = $(element)
            .closest(".repcontainer")
            .attr("data-groupname");
            if (!collapseRep[nearestContainer]){
                collapseRep[nearestContainer] = [];
            }
            collapseRep[nearestContainer].push({
                id: nearestRepItem,
                rep: $(element).closest(".repitem"),
            });
        }
    }

    function getRange(start) {
        let end = undefined;
        let group = undefined;

        outGroup: for (const g in collapseRep) {
            for (let i = 0; i < collapseRep[g].length; i++) {
                if (collapseRep[g][i].id == start) {
                    end = collapseRep[g]?.[i + 1]?.id;
                    group = g;
                    break outGroup;
                }
            }
        }
        if (!allRep?.[group]) return;
        let startIndex = allRep?.[group].findIndex((x) => x.id == start);
        let endIndex = allRep?.[group].findIndex((x) => x.id == end);
        if (endIndex < 0) endIndex = allRep?.[group].length;

        return {
            start,
            startIndex,
            end,
            endIndex,
            group,
        };
    }
    function hide(id) {
        let range = getRange(id);
        if (!range?.group) return;
        let group = allRep[range.group];
        let isOpen = $(group[range.startIndex]?.rep).hasClass("toggleStatusClosed") ? false : true
        saveDroorStatus(id, isOpen)
        if(styleDrop) $(group[range.startIndex]?.rep).toggleClass("toggleItemsClose");
        $(group[range.startIndex]?.rep).toggleClass("toggleStatusClosed");
        for (let i = range.startIndex + 1; i < range.endIndex; i++) {
            $(group[i]?.rep).toggleClass("hide");
        }
    }
    hide(id);
}



/*
 *
 * Load Handlers
 *
*/
$(async function(){
    console.log("Character Sheet Tools: started")
    await waitForElm('#settings-accordion')
    $("#settings-accordion").append(MENUHTML)
    await loadConfigs()
    await configHandler()
    console.log("Character Sheet Tools: settings page loaded")
    await pageLoad()

});

$(async function(){
    console.log("Character Sheet Tools: loading saved configs")
    await loadConfigs()
    console.log("Character Sheet Tools: loading colors")
    await loadColors()
    while(true){
        console.log("Character Sheet Tools: waiting for character sheet")
        await waitForElm('#dialog-window')
        await charaterSheetLoad()
        console.log("Character Sheet Tools: character loaded")
        await waitForNoElm('#dialog-window')
    }






});
function waitForNoElm(selector) {
    return new Promise(resolve => {
        if (!document.querySelector(selector)) {
            return resolve(true);
        }
        const observer = new MutationObserver(mutations => {
            if (!document.querySelector(selector)) {
                observer.disconnect();
                resolve(true);
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(true);
        }
        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(true);
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


/*
 *
 * Configs Manager
 *
*/
async function configHandler(){



    $("#hideCharacteristics").change(async function(){
        await set("hideCharacteristics", $(this).is(":checked"));
        await hideCharacteristics()
    });

    $("#moveApiDown").change(async function(){
        await set("moveApiDown", $(this).is(":checked"));
        await moveApiDown()
    });
    $("#useBookmarks").change(async function(){
        await set("useBookmarks", $(this).is(":checked"));
    });
    $("#handleMath").change(async function(){
        await set("handleMath", $(this).is(":checked"));
    });
    $("#spellSideBySide").change(async function(){
        await set("spellSideBySide", $(this).is(":checked"));
        await spellSideBySide()
    });
    $("#collapsibleCharacterSheet").change(async function(){
        await set("collapsibleCharacterSheet", $(this).is(":checked"));
    });
    $("#collapsibleCharacterSheetStyle").change(async function(){
        await set("collapsibleCharacterSheetStyle", $(this).is(":checked"));
    });
    $("#collapsibleCharacterSheetString").change(async function(){
        await set("collapsibleCharacterSheetString", $(this).val());
    });
    $("#collapsibleCharacterSheetColor").change(async function(){
        await set("collapsibleCharacterSheetColor", $(this).val());
    });
    $("#collapsibleCharacterSheetRename").change(async function(){
        await set("collapsibleCharacterSheetRename", $(this).is(":checked"));
        await renameItems()
    });


    $("#styleOption1").change(async function(){
        await set("styleOption1", $(this).is(":checked"));
    });
    $("#styleOption1String").change(async function(){
        await set("styleOption1String", $(this).val());
    });
    $("#styleOption1Color").change(async function(){
        await set("styleOption1Color", $(this).val());
    });
    $("#styleOption2").change(async function(){
        await set("styleOption2", $(this).is(":checked"));
    });
    $("#styleOption2String").change(async function(){
        await set("styleOption2String", $(this).val());
    });
    $("#styleOption2Color").change(async function(){
        await set("styleOption2Color", $(this).val());
    });
    $("#styleOption3").change(async function(){
        await set("styleOption3", $(this).is(":checked"));
    });
    $("#styleOption3String").change(async function(){
        await set("styleOption3String", $(this).val());
    });
    $("#styleOption3Color").change(async function(){
        await set("styleOption3Color", $(this).val());
    });
}

async function set(location, value){
    await GM.setValue(location, value);
    configs[location] = value;
}
async function get(location, dfValue = undefined){
    if(configs[location] !== undefined) return configs[location]
    let value = await GM.getValue(location)
    if(value == undefined && dfValue !== undefined){
        await set(location, value ?? dfValue)
    }
    configs[location] = value ?? dfValue;
    return value ?? dfValue
}

async function loadConfigs(){


    $("#hideCharacteristics").prop('checked', await get("hideCharacteristics", false));
    $("#moveApiDown").prop('checked', await get("moveApiDown", false));
    $("#useBookmarks").prop('checked', await get("useBookmarks", false));
    $("#handleMath").prop('checked', await get("handleMath", false));
    $("#collapsibleCharacterSheet").prop('checked', await get("collapsibleCharacterSheet", false));
    $("#spellSideBySide").prop('checked', await get("spellSideBySide", false));
    $("#collapsibleCharacterSheetStyle").prop('checked', await get("collapsibleCharacterSheetStyle", false));
    $("#collapsibleCharacterSheetRename").prop('checked', await get("collapsibleCharacterSheetRename", false));
    $("#collapsibleCharacterSheetString").val(await get("collapsibleCharacterSheetString", "[H]"));
    $("#collapsibleCharacterSheetColor").val(await get("collapsibleCharacterSheetColor", "#4FC3F7"));
    $("#collapsibleCharacterSheetColorClosed").val(await get("collapsibleCharacterSheetColorClosed", "#0288D1"));

    $("#styleOption1").prop('checked', await get("styleOption1", false));
    $("#styleOption1String").val(await get("styleOption1String", "[A]"));
    $("#styleOption1Color").val(await get("styleOption1Color", "red"));

    $("#styleOption2").prop('checked', await get("styleOption2", false));
    $("#styleOption2String").val(await get("styleOption2String", "[BA]"));
    $("#styleOption2Color").val(await get("styleOption2Color", "blue"));

    $("#styleOption3").prop('checked', await get("styleOption3", false));
    $("#styleOption3String").val(await get("styleOption3String", "[R]"));
    $("#styleOption3Color").val(await get("styleOption3Color", "yellow"));
}


async function loadColors(){

    let root = document.documentElement;
    if(root.classList.contains("colorsLoaded")) return

    let collapsibleCharacterSheetColor = await get("collapsibleCharacterSheetColor");
    let collapsibleCharacterSheetColorClosed = await get("collapsibleCharacterSheetColorClosed");
    let styleOption1Color = await get("styleOption1Color");
    let styleOption2Color = await get("styleOption2Color");
    let styleOption3Color = await get("styleOption3Color");

    root.classList.add("colorsLoaded");
    root.style.setProperty('--custom-toggle-open', collapsibleCharacterSheetColor);
    root.style.setProperty('--custom-toggle-close',collapsibleCharacterSheetColorClosed);
    root.style.setProperty('--custom-style-1',styleOption1Color);
    root.style.setProperty('--custom-style-2',styleOption2Color);
    root.style.setProperty('--custom-style-3',styleOption3Color);
}

let MENUHTML = `<div data-v-9f30d89c="" class="panel panel-default"><div data-v-9f30d89c="" class="panel-heading collapsed" data-toggle="collapse" data-parent="#settings-accordion" href="#collapseExpandedOptions" aria-expanded="false"><h4 data-v-9f30d89c="" class="panel-title"><a data-v-9f30d89c="" class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#settings-accordion" href="#collapseExpandedOptions" aria-expanded="false">Expanded Options</a></h4></div><div data-v-9f30d89c="" id="collapseExpandedOptions" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;"><div data-v-9f30d89c="" class="panel-body">`
    +
`<i>* Close & re-open sheet for changes to take effect</i>
<i>** Color changes require page refresh to take effect.</i>`
    +
`<div>
  <input type="checkbox" id="moveApiDown" name="moveApiDown" value="true">
  <label for="moveApiDown" style="display: inline;padding-left: 5px;">Move API bar down</label><br>
</div>`
    +
`<div>
  <input type="checkbox" id="useBookmarks" name="useBookmarks" value="true">
  <label for="useBookmarks" style="display: inline;padding-left: 5px;">** Enable the bookmarks feature</label><br>
</div>`
    +
`<div>
  <input type="checkbox" id="hideCharacteristics" name="hideCharacteristics" value="true">
  <label for="hideCharacteristics" style="display: inline;padding-left: 5px;">* Hide Characteristics (ideals,flaws)</label><br>
</div>`
    +

`<div>
  <input type="checkbox" id="handleMath" name="handleMath" value="true">
  <label for="handleMath" style="display: inline;padding-left: 5px;">*Allow math inside input boxes</label><br>
</div>`
    +
`<div>
  <input type="checkbox" id="spellSideBySide" name="spellSideBySide" value="true">
  <label for="spellSideBySide" style="display: inline;padding-left: 5px;">*Spell sheet side by side</label><br>
</div>`
    +
`<div style="border-style: ridge;padding:5px;border-radius: 5px;">
  <div>
    <input type="checkbox" id="collapsibleCharacterSheet" name="collapsibleCharacterSheet" value="true">
    <label for="collapsibleCharacterSheet" style="display: inline;padding-left: 5px;">*Enable collapsible items and features</label><br>
  </div>
  <div>
    <input type="checkbox" id="collapsibleCharacterSheetStyle" name="collapsibleCharacterSheetStyle" value="true">
    <label for="collapsibleCharacterSheetStyle" style="display: inline;padding-left: 5px;">*Style the labeled items</label><br>
  </div>
  <div>
    <input type="checkbox" id="collapsibleCharacterSheetRename" name="collapsibleCharacterSheetRename" value="true">
    <label for="collapsibleCharacterSheetRename" style="display: inline;padding-left: 5px;">Allow Renaming/Editing Items</label><br>
  </div>
  <div>
    <input placeholder="Select the string that identifies an item as a header" type="text" id="collapsibleCharacterSheetString" name="collapsibleCharacterSheetString" value="">
    <label for="collapsibleCharacterSheetString" style="display: inline;padding-left: 5px;"></label><br>
  </div>
  <div>
    <input placeholder="Open Color - #4FC3F7" type="text" id="collapsibleCharacterSheetColor" name="collapsibleCharacterSheetColor" value="">
    <label for="collapsibleCharacterSheetColor" style="display: inline;padding-left: 5px;"></label><br>
  </div>
  <div>
    <input placeholder="Closed Color - #0288D1" type="text" id="collapsibleCharacterSheetColorClosed" name="collapsibleCharacterSheetColorClosed" value="">
    <label for="collapsibleCharacterSheetColorClosed" style="display: inline;padding-left: 5px;"></label><br>
  </div>
</div>`
    +
`<div style="border-style: ridge;padding:5px;border-radius: 5px;">
  <div>
    <input type="checkbox" id="styleOption1" name="styleOption1" value="true">
    <label for="styleOption1" style="display: inline;padding-left: 5px;">*Enable style 1</label><br>
  </div>
  <div>
    <input placeholder="Style option 1 String" type="text" id="styleOption1String" name="styleOption1String" value="">
    <label for="styleOption1String" style="display: inline;padding-left: 5px;"></label><br>
  </div>
  <div>
    <input placeholder="Style option 1 Color - red" type="text" id="styleOption1Color" name="styleOption1Color" value="">
    <label for="styleOption1Color" style="display: inline;padding-left: 5px;"></label><br>
  </div>
</div>`
    +
    `<div style="border-style: ridge;padding:5px;border-radius: 5px;">
  <div>
    <input type="checkbox" id="styleOption2" name="styleOption2" value="true">
    <label for="styleOption2" style="display: inline;padding-left: 5px;">*Enable style 2</label><br>
  </div>
  <div>
    <input placeholder="Style option 2 String" type="text" id="styleOption2String" name="styleOption2String" value="">
    <label for="styleOption2String" style="display: inline;padding-left: 5px;"></label><br>
  </div>
  <div>
    <input placeholder="Style option 2 Color - blue" type="text" id="styleOption2Color" name="styleOption2Color" value="">
    <label for="styleOption2Color" style="display: inline;padding-left: 5px;"></label><br>
  </div>
</div>`
+
    `<div style="border-style: ridge;padding:5px;border-radius: 5px;">
  <div>
    <input type="checkbox" id="styleOption3" name="styleOption3" value="true">
    <label for="styleOption3" style="display: inline;padding-left: 5px;">*Enable style 3</label><br>
  </div>
  <div>
    <input placeholder="Style option 3 String" type="text" id="styleOption3String" name="styleOption3String" value="">
    <label for="styleOption3String" style="display: inline;padding-left: 5px;"></label><br>
  </div>
  <div>
    <input placeholder="Style option 3 Color - yellow" type="text" id="styleOption3Color" name="styleOption3Color" value="">
    <label for="styleOption3Color" style="display: inline;padding-left: 5px;"></label><br>
  </div>
</div>`
    +
`</div></div></div>`

GM_addStyle ( `
    #secondary-toolbar.move2bottom {
        bottom: 20px !important;
        top: unset !important;
    }

    .note-editable {
        height: 100% !important;
        max-height: 100% !important;
    }
    .container.pc {
        display: flex !important;
    }
    .container.pc .page.spells.spellSideBySide{
        display: block !important;
    }

    .hideBookMarks {
       display: none !important;
    }

    .container.pc .rp-traits.hideCharacteristics {
       display: none !important;
    }

    .toggleItems .output.btn.ui-draggable {
        display: none !important;
    }

    .textbox .toggleItems.toggleItemsStyle {
        border-radius: 8px;
    }
    .blockRename {
        pointer-events:none;
    }
    .toggleItems.toggleItemsStyle:has(.item .name),
    .toggleItems.toggleItemsStyle .item .name {
        border-radius: 25px;
    }
    .toggleItems.toggleItemsStyle .item .equipped,
    .toggleItems.toggleItemsStyle .item .weight {
      display: none !important;
    }
    .custom_Style1{
       background-color:var(--custom-style-1) !important;
    }
    .custom_Style2{
       background-color:var(--custom-style-2) !important;
    }
    .custom_Style3{
       background-color:var(--custom-style-3) !important;
    }

    .toggleItems.toggleItemsStyle.toggleItemsOpen .title,
    .toggleItems.toggleItemsStyle.toggleItemsOpen .name,
    .toggleItems.toggleItemsStyle.toggleItemsOpen {
        background-color:var(--custom-toggle-open) !important;
        color: #E0E0E0 !important;
    }
    .toggleItems.toggleItemsStyle.toggleItemsClose .title,
    .toggleItems.toggleItemsStyle.toggleItemsClose .name,
    .toggleItems.toggleItemsStyle.toggleItemsClose {
        background-color:var(--custom-toggle-close) !important;
        color: #E0E0E0 !important;
    }
` );
