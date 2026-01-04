// ==UserScript==
// @name         Toyhouse Multi-Image Upload
// @namespace    http://circlejourney.net
// @version      2024-04-25
// @description  [WIP] Tidy up Toyhouse's the multi-image upload page. Layouts designed by YoctoCrunch (toyhou.se/YoctoCrunch).
// @author       You
// @match        https://toyhou.se/~images/multi-upload
// @icon         https://www.google.com/s2/favicons?sz=64&domain=toyhou.se
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491911/Toyhouse%20Multi-Image%20Upload.user.js
// @updateURL https://update.greasyfork.org/scripts/491911/Toyhouse%20Multi-Image%20Upload.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const headerRow = $("<li class='list-group-item font-weight-bold bg-faded border-0 d-none d-lg-block' id='header-row'><div class='row w-100'><div class='col-auto row-select-col'></div><div class='col-auto' style='width: 240px;'>Thumbnail</div><div class='col-2'>Artist Credits</div><div class='col-2'>Characters</div><div class='col-3'>Caption</div><div class='col'>Other Settings</div></div></li>");
    $(".row-select-col", headerRow).append($("<input type='checkbox'>").on("change", function() { $(".upload-list-point:not(.hide) .row-select").prop("checked", this.checked); updateCounter(); }));
    const style = $(`<style>
        .upload-drop-zone, .upload-input { display: none; }
        #user-character-selector { z-index: 1051; }
        .multi-uploader .upload-list-wrapper .upload-list-point .row { width: auto; }
        .permissions-column label.w-100, .image-credit-wrapper label { font-weight: bold; }
        .character-name-number, .character-select-selected-character img { display: none; }
        .character-select-selected .btn,  .btn { height: auto; white-space: wrap; }
        .character-select-selected-remove { background: none; border: none; }
        .permissions-container { max-width: 300px; }
        </style>`);
    const buttons = [{
            name: "Artist Credits",
            fa: 'paintbrush',
            form: '.artist-form',
            property: 'artists',
            appendable: true
        }, {
            name: "Characters",
            fa: 'users',
            form: '.character-form',
            property: 'characters',
            appendable: true
        }, {
            name: "Caption",
            fa: 'message',
            form: '.text-form',
            property: 'text'
        }, {
            name: "NSFW Settings",
            fa: 'warning',
            form: '.nsfw-form .dropdown-menu',
            permissionsForm: '.nsfw-form-wrapper',
            property: 'nsfw'
        }, {
            name: "Authorized Viewer Visibility",
            fa: 'lock',
            form: '.privacies-form .form-group:nth-child(1)',
            property: 'privacies'
        }, {
            name: "Public Viewers Visibility",
            fa: 'eye',
            form: '.privacies-form .form-group:nth-child(2)',
            property: 'privacies'
        }, {
            name: "Watermark",
            fa: 'pen',
            form: '.privacies-form .form-group:nth-child(3)',
            property: 'privacies'
        }, {
            name: "Delete",
            fa: 'trash',
            class: 'text-danger',
            handler: function(e) {
                e.preventDefault();
                $("#delete-modal").modal("show");
            }
        }, {
            name: "Submit",
            fa: 'arrow-up-from-bracket',
            class: 'text-success',
            handler: function(e) {
                e.preventDefault();
                $("#submit-modal").modal("show");
            }
        }];

    $(document).ready(init);

    function init() {
        restyle();
        insertModal();
    }

    function insertModal() {
        // Basic modal
        const modal = $(`<div class="modal fade" id="settings-modal" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog" role="document"><div class="modal-content">
              <div class="modal-header">
                <h2 class="modal-title font-weight-bold" id="modal-title">Modal title</h2>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div id="modal-body" class="modal-body"></div>
              <div id="modal-footer" class="modal-footer">
              </div>
            </div></div></div>`);
        const replaceButton = $('<button class="btn btn-primary" data-dismiss="modal">Replace</button>').on("click", function() { updateForm("replace") });
        const addButton = $('<button id="add-button" class="btn btn-primary" data-dismiss="modal">Add</button>').on("click", function() { updateForm("add") });
        $("#modal-footer", modal).append(addButton, replaceButton);

        // Submit/delete modals
        const confirmTemplate = $(`<div class="modal fade" id="submit-modal" tabindex="-1" role="dialog" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
            <div class="d-flex justify-content-end">
                <button class="close mt-3 mr-3" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
                </div>
              <div id="modal-body" class="modal-body flex-column justify-content-center align-items-center mb-4">
              <p id="confirm-message"></p>
              <div class="button-row">
              <button class="btn btn-secondary" data-dismiss="modal">Cancel</button>
              </div>
              </div>
            </div>
          </div>
        </div>`);
        const submitModal = $(confirmTemplate).clone().attr("id", "submit-modal");
        $("#confirm-message", submitModal).text("Are you sure you want to submit these images?");
        const deleteModal = $(confirmTemplate).clone().attr("id", "delete-modal");
        $("#confirm-message", deleteModal).text("Are you sure you want to delete these images?");
        const submitButton = $('<button class="btn btn-success" data-dismiss="modal">Submit</button>').on("click", submit);
        const deleteButton = $('<button class="btn btn-danger" data-dismiss="modal">Delete</button>').on("click", remove);
        $("#modal-body .button-row", submitModal).append(submitButton);
        $("#modal-body .button-row", deleteModal).append(deleteButton);

        const modalButtonTemplate = '<a class="btn" data-toggle="modal" href="#settings-modal">Open</a>';
        
        const toolbarWrapper = $("<div class='d-flex flex-wrap justify-content-lg-start'><a class='btn btn-primary ml-1 mt-1' onclick='$(\".upload-input\").click()' href='#'><i class='fi-plus'></i> Upload Images</a></div>");
        const toolbar = $("<div class='ml-1 mt-1 card bg-faded flex-row flex-wrap justify-content-center justify-content-lg-between'><span class='btn' id='toolbar-counter'>0 selected</span></div>").appendTo(toolbarWrapper);
        const toolbarButtons = $("<div class='flex-wrap justify-content-lg-start justify-content-center'></div>").appendTo(toolbar);
        $(toolbarWrapper).append($(".submit-all-btn").removeClass("form-control mt-2").addClass("submit-all-btn mt-1 ml-1"));

        buttons.forEach(function(btn, i) {
            const kebab = kebabify(btn.name);
            const button = btn.form ?
            (
                $(modalButtonTemplate).html("<i class='fa fa-"+btn.fa+"'></i>").addClass(btn.class).on("click", function() { showModal(btn.property, "."+kebab, btn.name) })
            ) : (
                $("<a href='#'></a>").addClass("btn "+(btn.class || "")).html("<i class='fa fa-"+btn.fa+"'></i>").on("click", btn.handler)
            );
            $("i", button).attr({ "data-toggle": "tooltip", "title": btn.name }).tooltip("enable");
            $(toolbarButtons).append(button);
            if(btn.form) {
                const source = $(btn.form, ".upload-list-point-cloneable").clone(true, true).removeClass("dropdown-menu");
                const form = $("<form></form>").addClass("modal-form hide "+kebab+" "+$(source).attr("class"));
                if(kebab == "nsfw-settings") $(form).removeClass("p-3");
                $(form).append($(source).children());
                $("#modal-body", modal).append(form);
            }
        });

        $(".upload-list-wrapper").before(toolbarWrapper);
        $(document.body).append([modal, submitModal, deleteModal]);


        function kebabify(str) {
            return str.replace(/\W+/g, "-").toLowerCase().trim();
        }

        function updateForm(mode="add") {
            /*
                artists: array[object { type: "offsite"|"onsite", name: string, url?: string }]
                characters: array[object { id: int, namebadge: string }]
                privacies: authorized_privacy: 0|1|2|3, public_privacy: 0|1|2|3, watermark_id: number
                nsfw: is_sexual = 0|1|2, is_nudity: bool, is_gore: bool, is_sensitive: bool, warning: string
            */
            const { property, activeform } = $("#settings-modal").data();
            const updateData = {};
            const form = $("#modal-body "+activeform)[0];
            const formData = new FormData(form);

            if(property == "artists") {
                updateData.artists = [];
                $("#clone-dst .image-credit-wrapper", form).each(function(i, imageCredit) {
                    const type = $(".image-credit-input", imageCredit).val();
                    if(type == "onsite") {
                        const username = $(".active .radio_select[name^=artist_username]", imageCredit).val();
                        username && (
                            updateData.artists.push({ type: type, name: username })
                            );
                    }
                    if(type == "offsite") {
                        const data = {
                            type: type,
                        };
                        data.url = $(".active .radio_select[name^=artist_url]", imageCredit).val()
                        if(!data.url) return true;
                        const name = $(".active .radio_select[name^=artist_name]", imageCredit).val();
                        name && (data.name = name);
                        updateData.artists.push({ type: type, url: url });
                    }
                });

            } else if(property == "characters") {
                const keys = [ ...formData.keys() ];
                const values = [ ...formData.values() ];
                updateData.characters = [];
                for(let i=0; i<values.length; i++) {
                    if(!values[i]) continue;
                console.log(!values[i]);
                    updateData.characters.push({
                        id: +values[i],
                        namebadge: $(".character-select-widget", form).eq(i).find(".character-name-badge")[0].outerHTML
                    });
                }

            } else if(property == "nsfw") {
                updateData.nsfw = Object.fromEntries(formData.entries());
                updateData.nsfw.is_sexual = formData.get("selected") ? +formData.get("is_sexual") : 0;

            } else if(property == "text") {
                updateData.text = formData.get("text");

            } else {
                updateData[property] = Object.fromEntries(formData.entries());
            }
            $(".row-select:checked").each(function(i, checkbox) {
                fill($(checkbox).closest(".upload-list-point"), updateData, mode);
            });
        }

        function submit() {
            $(".upload-list-point:not(.hide) .row-select:checked").each(function(i, select) {
                    $(select).closest(".row").find(".submit-btn").click();
            });
         }

        function remove() {
            $(".upload-list-point:not(.hide) .row-select:checked").each(function(i, select) {
                    $(select).closest(".row").find(".cancel-btn").click();
            });
         }

        function showModal(property, selector, title) {
            $("#settings-modal").data({ "property": property, "activeform": selector }).find(".modal-form").addClass("hide");
            $("#settings-modal").find(selector).removeClass("hide");
            $("#modal-title").text(title);
        }
    }

    function restyle() {
        const colorDanger = $("<span class='text-danger'>").appendTo(document.body).css("color");
        $(style).append(".character-select-selected-remove { color: " + colorDanger + " }");
        $(document.head).append(style);


        $(".upload-list").before(headerRow);
        $(".upload-list *[class$=-form]").removeClass("hide");
        $(".upload-list-point .list-group-item").remove();
        $(".upload-list-point .card").removeClass("card");
        $(".upload-list-point .card-block").removeClass("card-block");
        $(".upload-list-point .col-lg-3").removeClass("col-lg-3").addClass("col-lg-auto");
        $(".upload-list-point .col-lg-4").removeClass("col-lg-4").addClass("col-lg-2");
        $(".upload-list-point .col-lg-5").removeClass("col-lg-5").addClass("col-lg-2");
        $(".upload-list-point .mt-3").removeClass("mt-3");

        $(".fi-plus").attr("class", "fa fa-users mr-1");
        $(".fa-times-circle").removeClass("fa-times-circle").addClass("fa-trash");

        $("select", ".privacies-form,.nsfw-form").addClass("w-100").closest(".row").removeClass("row").children().prop("class", "w-100");

        $("label[for=artist_username]").prepend("<i class='fa fa-paintbrush'></i> ");
        $("label[for=artist_url]").html("<i class='fa fa-paintbrush'></i> Artist's link");
        $("label[for=authorized_privacy]").prepend("<i class='fa fa-lock'></i> ");
        $("label[for=public_privacy]").prepend("<i class='fa fa-eye'></i> ");
        $("label[for=watermark_id]").prepend("<i class='fa fa-pen'></i> ");

        $(".upload-list-point").each(function(i, element) {
            const n = $(element).data("index");
            const rowSelect = $("<div class='col-auto'><input class='row-select' type='checkbox' name='row[]' value='" + n + "'></div>").on("change", updateCounter);
            $("> .row", element).prepend(rowSelect);

            const textForm = $(".text-form", element).addClass("h-100");
            $(".form-control", textForm).addClass("h-100").prop("maxlength", "255");
            const caption = $("<div class='col-md-5 col-lg-3'></div>").append(textForm);
            $("> .row", element).append(caption);

            $(".character-form .cloneable", element).each(function(i, cloneable) {
                $(cloneable).prepend( $("> .form-control:last-child", cloneable).addClass("mb-1").removeClass("mt-1") );
            });

            const nsfwFormOld = $(".nsfw-form", element);
            const nsfwSelectName = $("#is_sexual", element).attr("name");
            const nsfwCheckbox = $("<input type='checkbox' class='custom-control-input'>")
            .on("change", function() {
                $(this).closest(".form-group").find(".radio-label").toggleClass("hide", !$(this).prop("checked"))
                    .find("input").removeProp("checked").removeAttr("checked");
            });
            const nsfwLevelWrapper = $(".nsfw-form label.form-group", element).eq(0).clone();
            $(nsfwLevelWrapper).find("input[type=checkbox]").replaceWith(nsfwCheckbox);
            const nsfwRadios = [
                $("<input type='hidden' value='0'>").attr("name", nsfwSelectName),
                $("<label class='radio-label hide' for='mild'><input type='radio' id='mild' name='"+nsfwSelectName+"' value='1'> Mild</label>"),
                $("<label class='radio-label hide' for='explicit'><input type='radio' name='"+nsfwSelectName+"' id='explicit' value='2'> Explicit</label>")
            ];
            $(".col-md-4", nsfwLevelWrapper).empty().append("<div>Sexual Content</div>").append(nsfwRadios);
            $("select#is_sexual", nsfwFormOld).closest(".form-group").replaceWith($(nsfwLevelWrapper).clone(true, true));
            $(".col-md-8", nsfwFormOld).each(function(i, element) {
                $(element).removeClass("col-md-8 col-6").addClass("col-2").insertBefore($(element).prev());
            });
            $(".col-md-4.col-6", nsfwFormOld).prop("class", "col-8 label-text");
            $(".form-group", nsfwFormOld).addClass("mb-0 w-auto no-gutters");

            const nsfwDropdown = $("<div class='dropdown nsfw-form w-100'><a class='btn btn-secondary form-control dropdown-toggle' data-toggle='dropdown'>NSFW settings</a></div>");
            $("<div class='dropdown-menu p-3' onclick='event.stopPropagation()'></div>").append($(nsfwFormOld).children()).appendTo(nsfwDropdown);

            const nsfwFormNew = $("<div class='nsfw-form-wrapper form-group'></div>")
            .append( "<label class='w-100'><i class='fa fa-warning'></i> NSFW Settings</label>" )
            .append(nsfwDropdown);

            const permissions = $("<div class='col d-none d-xl-block permissions-column'></div>")
            .append( nsfwFormNew )
            .append( $(".privacies-form", element) );

            const permissionsbar = $("<div class='d-flex flex-column justify-content-center d-xl-none col permissions-bar'></div>").css({"gap": "1rem", "font-size": "14pt"});
            /*const permissionsContainer = $("<div class='card bg-faded px-4 pt-4 pb-3 permissions-container'></div>").hide().css({position: "absolute", right: 0})
            .append( $('<button type="button" class="close"><span>×</span></button>').css({ position: "absolute", top: "5px", right: "5px" }).on("click", function(){
                $(this.closest(".permissions-container")).hide();
            }) );*/
            for(let i=3; i<7; i++) {
                const button = buttons[i];
                const form = $(button.permissionsForm || button.form, permissions).addClass("permissions-toggle")[0];
                permissionsbar.append($("<a href='#'><i class='fa fa-"+button.fa+"'></i></a>")
                    .addClass("permissions-button").data('target', form)
                    .on("click", function(e){
                        e.preventDefault();
                        const open = s$($(this).data("target")).is(":visible");
                        $(".permissions-toggle", element).hide();
                        if(open) {
                            $(".permissions-column", element).addClass("d-none");
                            $(form).hide();
                        } else {
                            $(".permissions-column", element).removeClass("d-none");
                            const top = $(this).position().top + $(this).outerHeight(true);
                            const right = $(this).position().left + $(this).outerWidth(true);
                            $(form).show();
                        }
                    })
                );
            }

            const submitRow = $("<div class='w-100 mt-2 mr-2'></div>")
            .append( $(".submit-btn", element) )
            .append( $(".cancel-btn", element) );

            $("> .row", element).append([permissionsbar, permissions, submitRow]);

            const inputname = $(".image-credit-input", element).attr("name");
            const onsiteOffsite = "<select class='image-credit-input form-control mb-3' name='artist[1][]'><option value='onsite'>On-site Artist</option><option value='offsite'>Off-site Artist</option></select>";
            $(".image-credit-wrapper", element).prepend(
                $(onsiteOffsite).attr({ "name": inputname, 'onchange': '$(this).siblings(".tab-content").find(".tab-pane:not(.image-credit-"+this.value+"-info)").hide(); $(this).siblings(".tab-content").find(".image-credit-"+this.value+"-info").show();' })
            ).find(".nav").remove();

            $(".character-select-selected-character", element).each(function(i, selectedchar) {
                $(selectedchar).prev(".btn").removeClass("btn btn-danger btn-square").insertAfter(selectedchar);
            });
        });
    }

    function fill(form, settings, mode) {
        const { artists, characters, text, privacies, nsfw } = settings;
        const append = mode=="add";

        if(artists) {
            if(!append) $("#clone-dst [th-clone]", form).remove();
            for(let i=0; i < artists.length; i++) {
                const artist = artists[i];
                const inputSelector = artist.type == "onsite" ? "#clone-dst .active .radio_select[name^=artist_username]" : "#clone-dst .active .radio_select[name^=artist_url]";
                const filterDuplicate = artist.type == "onsite" ? artist.name : artist.url;
                if(append && $(inputSelector, form).filter(function() { return $(this).val()==filterDuplicate; }).length) continue;

                let wrapper;
                if(append) {
                    const blanks = $(inputSelector, form).filter(function(){ return $(this).val()==""; });
                    wrapper = blanks.length ?
                    blanks.first().closest(".image-credit-wrapper")
                    :
                    ($(".artist-form #clone-src [th-clone]", form)
                        .clone(true, true)
                        .appendTo($(form).find("#clone-dst"))
                        .removeClass("hide"));
                } else {
                    if(!$("#clone-dst .image-credit-wrapper", form).eq(i).length) {
                        ($(".artist-form #clone-src .image-credit-wrapper", form)
                         .clone(true, true)
                         .appendTo($(form).find("#clone-dst"))
                         .removeClass("hide"));
                    }
                    wrapper = $("#clone-dst .image-credit-wrapper", form).eq(i)
                }

                $(wrapper).find(".image-credit-input").val(artist.type);
                $(wrapper).find(".image-credit-a").removeClass("active");
                $(wrapper).find(".image-credit-a[data-type='" + artist.type + "']").addClass("active");
                $(wrapper).find(".tab-pane").removeClass("active");
                $(wrapper).find(".image-credit-" + artist.type + "-info").addClass("active");

                if(artist.type == "onsite") {
                    $(wrapper).find(".radio_select[name^=artist_username]").val(artist.name);
                } else {
                    $(wrapper).find(".radio_select[name^=artist_url]").val(artist.url);
                    $(wrapper).find(".radio_select[name^=artist_name]").val(artist.name);
                }
            }
        }

        if(characters) {
            if(!append) $(".character-form .clone-dst .character-select-widget", form).remove();
            characters.forEach(function(character, i) {
                const charaWrapper = $(form).find(".character-form").eq(0);
                if($(".character-select-selected-input[value="+character.id+"]", form).length) return true;
                const charaClone = $(charaWrapper)
                .find(".clone-src .character-select-widget")
                .clone(true, true)
                .appendTo($(charaWrapper).find(".clone-dst"))
                .removeClass("hide");
                $(charaClone).find(".character-select-selectors").addClass("hide");

                const charaInput = $(charaClone).find(".character-select-selected").removeClass("hide");
                const charaSelect = $(charaInput).find(".character-select-selected-character");

                $(charaInput).find(".character-select-selected-input").val(character.id);
                $(charaSelect).append(character.namebadge);
            });
        }

        if(privacies) {
            for(let [k, v] of Object.entries(privacies)) {
                $("#"+k, form).val(v);
            }
        }

        if(nsfw) {
            for(let [k, v] of Object.entries(nsfw)) {
                k == "is_sexual" ? $("#is_sexual", form).val(v) : $(".custom-control-input[name^="+k+"]").attr("checked", v);
            }
        }

        if(text) {
            $("[name^=text]", form).val(text);
        }
    }

    function updateCounter() {
        const updating = $(".row-select:checked").length;
        $("#toolbar-counter").text(updating + " selected");
        $("#counter").text( "Updating " + updating + (updating == 1 ? " entry" : " entries") );
    }
})();