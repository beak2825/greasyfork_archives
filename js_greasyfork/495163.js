// ==UserScript==
// @name         Toyhouse Quickdial
// @namespace    http://circlejourney.net/
// @version      2024.2
// @description  Create a "quick dial" list of your most-used Toyhouse characters, and add them to image uploads without using the character select widget.
// @author       You
// @match        https://toyhou.se/~images/upload*
// @match        https://toyhou.se/~images/edit*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=toyhou.se
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @require   	 https://unpkg.com/@popperjs/core@2
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495163/Toyhouse%20Quickdial.user.js
// @updateURL https://update.greasyfork.org/scripts/495163/Toyhouse%20Quickdial.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    const frame = document.createElement('div');
    const style = document.createElement('style');
    style.innerHTML = "#quickdial-selector .character-name-badge {font-size: 10pt; cursor: pointer } .quickdial-add, .quickdial-delete { padding: 0.2rem 0.4rem; height: auto !important; } .char-nickname { margin-left: -5px }";
    document.body.appendChild(frame);
    document.head.appendChild(style);

    const formSettings = {
        'id': 'quickdial',
        'title': "Toyhouse Quickdial",
        'css': "#quickdial { border-radius: 0.5rem; border: none; color: black; z-index: 1000 !important; } #quickdial * { font-family: inherit; } #quickdial_wrapper { padding: 1rem; } #quickdial_char_display { gap: 0.5rem; }  .quickdial_char { white-space: nowrap }",
        'frame': frame,
        'fields': {
            "info": {
                'section': "Add characters",
                "type": "hidden"
            },
            "characters": {
                'label': 'Link to character or tab profile (e.g. <code>https://toyhou.se/12345.character-name/67890.tab-name</code>)',
                'type': 'text'
            },
            "add": {
                'label': 'Add character',
                'type': 'button',
                'click': function(){
                    addFromURL($("#quickdial_field_characters").val().trim());
                }
            },
            "manage": {
                'section': "Your quickdial characters",
                "type": "hidden"
            }
        },
        "events": {
            "close": function() {
                syncSelector();
            },
            "open": function() {
                $("#quickdial_section_header_0").before([
                    "<p>Toyhouse Quickdial is a utility that lets you add your most-used Toyhouse characters to image uploads without using the character select widget. Start adding characters/tabs to quickdial with the form below, then you can add them to any image upload with the shortcuts below the 'Add characters' panel. Still in beta, report bugs to <a href='https://toyhou.se/~messages/create/circlejourney' target='_blank'>circlejourney</a>.",
                    "<p>New in 16 June 2024 version: Wheel-click the character's name to open their profile in a new tab.</p>"
                ]);
                $("#quickdial_section_header_1").after("<div id='quickdial_char_display' class='flex-column p-1'></div>");
                $("#quickdial_saveBtn").remove();
                syncSelector();
            },
            "reset": async function() {
                const characters = await GM.getValue("characters");
                characters.forEach(function(character, i){
                    remove(character.id);
                });
                GM.deleteValue("characters");
            }
        }
    };

    const form = new GM_config(formSettings);
    const isCreate = location.pathname.indexOf("upload") > -1;
    let poppable, thisUser, charcard;

    window.addEventListener("load", function() {
        $(".display-user-username").eq(0).text();
        const formButton = $("<a class='quickdial-button btn btn-sm btn-primary w-100' href='#' onclick='event.preventDefault()'></a>").on("click", function(){ form.open() }).text("Add/remove quickdial characters");
        const quickdialBar = $("<div id='quickdial-wrapper' class='mt-3'><hr></div>")
        .append("<h4><i class='fa fa-phone'></i> Quickdial (click to add to image's character list)</h4>").append("<div id='quickdial-selector' class='p-1 d-flex flex-wrap'></div>").append(formButton);

        if(isCreate) charcard = $("#content .col-lg-5 .mb-3").first();
        else charcard = $("#content .col-xl-4 .mb-3").eq(1);
        $(".card-block", charcard).append(quickdialBar);

        syncSelector();

        poppable = $("<a data-toggle='tooltip' title='Placeholder' href='#'></a>");
        $(".btn[th-clone-trigger]", charcard).eq(0).on("click", function(){
            setTimeout(function() {
                const lastInput = $(".clone-dst .character-select-widget:last-child .character-select-selected-input", charcard);
                lastInput.on("change", function() {
                    if($(this).data("handler-attached")) return false;
                    appendButtons($(this).closest(".character-select-selected").eq(0));
                    $(this).data("handler-attached", true);
                });
            });
        });

        appendButtons($(".clone-dst .character-select-selected")[0])
    });

    async function add(id) {
        let addcharacters;
        let characters = await GM.getValue("characters") || [];
        let usechars = pluck(characters, "id");
        if(usechars.indexOf(id) > -1) return true;

        //if($("#quickdial_char_display .char-"+id).length) return true;
        let name;
        await getName(id).then((foundname)=>{ name=foundname }, function(){
            const note = $("<span class='badge badge-primary'> Character doesn't exist or unauthorised</span>");
            $("#quickdial_field_characters").after(note);
            setTimeout(function(){
                $(note).animate({ opacity: 0 }, { easing: "linear", duration: 500, complete: function(){$(this).remove()} })
            }, 1000);
        });
        if(!name) return true;

        const charselect = $(".character-select-widget .character-select-selected.char-"+id);
        $(charselect).find(".quickdial-add").addClass("hide");
        $(charselect).find(".quickdial-delete").removeClass("hide");
        form.set("characters", "");

        const thumb = await getThumbnail(id);
        characters.push({
            "id": id,
            "thumb": thumb || null,
            "name": name
        });

        GM.setValue("characters", characters).then(syncSelector);
    }

    async function remove(id) {
        const characters = await GM.getValue("characters");
        if(!characters || !characters.length) return false;
        characters.splice(findFirstIndex(characters, id), 1);

        GM.setValue("characters", characters).then(syncSelector);

        const classname = ".char-"+id;
        $("#quickdial_char_display "+classname).remove();
        $("#quickdial-selector "+classname).remove();
        const charselect = $(".character-select-widget .character-select-selected"+classname);
        $(charselect).find(".quickdial-add").removeClass("hide");
        $(charselect).find(".quickdial-delete").addClass("hide");
    }

    async function syncSelector() {
        let append = [];
        const characters = await GM.getValue("characters");
        if(!characters || !characters.length) return false;
        $("#quickdial-selector").empty()
        $("#quickdial_char_display").empty()
        for(let i=0; i<characters.length; i++) {
            const {id, thumb, name, nickname} = characters[i];
            const url = "https://toyhou.se/"+id+".";
            let tooltipTitle = nickname || "#"+id;
            const clickable = $(createBadge(id, thumb, name)).attr({ "data-toggle": "tooltip", "title": tooltipTitle });
            if(nickname) $(clickable).append("<small class='char-nickname'>"+(nickname || "")+"</small>");
            const badgeContent = $(".character-name-badge", clickable).clone();
            $(".character-name-badge", clickable).replaceWith(
                $("<a></a>").html(badgeContent).attr({ "href": url, "target": "_blank" })
            );
          	clickable.tooltip();
            $(clickable).find(".character-name-badge")
                .on("click", function(e){ e.preventDefault(); attachCharacter(this, id) });
            $("#quickdial-selector").append(clickable);

            const unclickable = clickable.clone().attr({ "data-toggle": "tooltip", "title": tooltipTitle });
            $("small", unclickable).remove();

          	unclickable.tooltip();
            const deletebutton = $('<a class="character-select-selected-remove btn btn-danger btn-square" href="#"><i class="fi-trash"></i></a>')
            .on("click", function(e){ e.preventDefault(); remove(id) });
            const nicknameInput = $("<input>").addClass("quickdial_char_nickname").attr({ "maxlength": 255, "placeholder": "Nickname" }).val(nickname || "");
            const nicknameUpdate = $("<button></button>").html("<i class='fi-check'></i>").addClass("btn btn-sm btn-primary quickdial_char_nickname_button")
            .on("click", async function() {
                const characters = await GM.getValue("characters");
                if(!characters || !characters.length) return false;
                const found = findFirstIndex(characters, id);
                characters[found].nickname = $(this).siblings(".quickdial_char_nickname").val();
                const nameBadge = $(this).siblings(".character-select-selected-character").attr({
                    "title": characters[found].nickname,
                    "data-original-title": characters[found].nickname
                });
                nameBadge.tooltip("update");
                await GM.setValue("characters", characters);
                const note = $("<span class='badge badge-success'> Saved</span>");
                $(this).after(note);
                setTimeout(function(){
                    $(note).animate({ opacity: 0 }, { easing: "linear", duration: 500, complete: function(){$(this).remove()} })
                }, 500);
            });
            const badgewrapper = $("<div></div>").addClass("quickdial_char form-inline char-"+id).append([deletebutton, unclickable, nicknameInput, nicknameUpdate]);
            $("#quickdial_char_display").append(badgewrapper);
        }
    }

    function attachCharacter(caller, id) {
        $(".btn[th-clone-trigger]", charcard).eq(0).click();
        const charselect = isCreate ? $(".clone-dst .character-select-widget:last-child", charcard) : $("form.mt-3", charcard);
        $(".character-select-selectors", charselect).addClass("hide");
        $(".character-select-selected", charselect).removeClass("hide");
        $(".character-select-selected-input", charselect).val(id);
        appendButtons(charselect.find(".character-select-selected")[0]);
        const formbadge = $(caller).closest(".character-select-selected-character").clone();
        $(".hide", formbadge).removeClass("hide");
        $(".char-nickname", formbadge).remove();
        $(".character-select-selected-character", charselect).replaceWith(formbadge);
    }

    function createBadge(id, thumb, name) {
        return `<span class='character-select-selected-character char-${id}'>
                        <img src='${thumb}'>
                        <span class='btn btn-sm btn-primary mr-1 character-name-badge'>${name}</span>
                        <small class='hide mr-1 character-name-number'>#${id}</small>
                        </span>`
    }

    async function getName(val) {
        const url = "https://toyhou.se/"+val+"./";
        let found;
        await $.get(url, function(d){
            //if($(d).find(".display-user").eq(0).text().trim() != thisUser) return false;
            found = $(d).find(".profile-name-info h1").text();
        }).fail(function() { found = false; });
        return found;
    }

    async function getThumbnail(val) {
        const name = val + "?" + Date.now();
        const urls = [ "https://file.toyhou.se/characters/" + name, "https://f2.toyhou.se/file/f2-toyhou-se/characters/" + name ];
        let found;
        for(let i=0; i<urls.length; i++) {
            const url = urls[i];
            const img = new Image();
            img.src = url;
            const promise1 = new Promise(function(resolve, reject) {
                img.onload = function(){ resolve(url); }
                img.onerror = function(){ reject(url); }
            });
            await promise1.then(function(url) {
                found = url;
            }, ()=>{});
        }
        console.log(found);
        return found;
    }

    function pluck(objectArray, key){
        let result = [];
        objectArray.forEach(function(item, k) {
            result[k] = item[key];
        });
        return result;
    }

    function findFirstIndex(characters, id) {
        return characters.findIndex(i => i.id == id);
    }

    async function appendButtons(wrapper) {
        if($(".quickdial-add", wrapper).length) return false;
        const id = $(".character-select-selected-input", wrapper).val();
        $(wrapper).addClass("char-"+id);
        const characters = await GM.getValue("characters");
        let hasBeenAdded = false;
        if(pluck(characters, "id").indexOf(id) > -1) hasBeenAdded = true;

        const addButton = poppable.clone().addClass('quickdial-add btn btn-primary ml-1').attr("title", "Add to quickdial").html("<i class='fa fa-plus'></i> <i class='fa fa-phone'></i></a>").on("click", function(e){ e.preventDefault(); callFromForm("add", this); });
      	addButton.tooltip();
        const deleteButton = poppable.clone().addClass('quickdial-delete btn btn-primary ml-1').attr("title", "Remove from quickdial").html("<i class='fa fa-times'></i> <i class='fa fa-phone'></i></a>").on("click", function(e){ e.preventDefault(); callFromForm("remove", this); }).tooltip();
        if(hasBeenAdded) $(addButton).addClass("hide");
        else $(deleteButton).addClass("hide");
        $(wrapper).append([addButton, deleteButton]);
    }

    function addFromURL(url) {
        const matches = [...url.matchAll(/([0-9]+)\.[a-z0-9\-]*/g)];
        const id = matches[matches.length-1][1];
        add(id);
    }

    function callFromForm(fn, caller) {
        const id = $(caller).closest(".character-select-selected").find(".character-select-selected-input").val();
        if(fn == "add") add(id);
        if(fn == "remove") remove(id);
    }

})();