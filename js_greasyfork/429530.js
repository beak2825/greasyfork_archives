// ==UserScript==
// @name         Steam Collection Manager
// @version      3.1.0
// @description  Adds buttons to collections related to the mass removal, addition, and sorting of items.
// @author       pointfeev
// @copyright    2021, pointfeev (https://github.com/pointfeev)
// @license      MIT
// @match        *://*.steamcommunity.com/sharedfiles/filedetails/?id=*
// @match        *://*.steamcommunity.com/workshop/filedetails/?id=*
// @match        *://*.steamcommunity.com/sharedfiles/managecollection/?id=*
// @match        *://*.steamcommunity.com/workshop/managecollection/?id=*
// @icon         https://steamcommunity.com/favicon.ico
// @grant        none
// @namespace    https://github.com/pointfeev
// @homepageURL  https://gist.github.com/pointfeev/31618a04ab2f754158ca7d950e1dd35c
// @downloadURL https://update.greasyfork.org/scripts/429530/Steam%20Collection%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/429530/Steam%20Collection%20Manager.meta.js
// ==/UserScript==

(function() {
    "use strict";

    if (document.querySelector("div#mainContentsCollection") == null && document.querySelector("div.manageCollectionItemsBody") == null) return;

    let collection_id = new URL(document.location.href).searchParams.get("id");
    let sessionID = window.g_sessionID;
    let steamID = window.g_steamID;

    let author = jQuery("a.friendBlockLinkOverlay").attr("href");
    let user = jQuery("a.user_avatar.playerAvatar").attr("href").slice(0, -1);
    if (author != null && author != user) return;

    let container = document.querySelector("#ig_bottom");
    if (container == null)
        container = document.querySelector("#BG_bottom");
    if (container == null)
        return;

    let back_color = "#334455";
    let back_shadow_color = "#001122";
    let text_color = "#FFFFFF";
    let remove_color = "#772222";
    let add_color = "#226622";
    let sort_color = "#226666";

    let btn_container_padding = 5;

    let btn_offset_x = 1;
    let btn_offset_y = 3;
    let btn_radius = 3;

    let btn_container = document.createElement("div");
    btn_container.style.background = back_color;
    btn_container.style["border-radius"] = btn_radius * 2 + "px";
    btn_container.style.width = btn_container_padding * 2 + "px";
    btn_container.style.height = btn_container_padding * 2 + "px";
    btn_container.style.position = "fixed";
    btn_container.style.top = "33%";
    btn_container.style["box-shadow"] = "0 0 10px " + back_shadow_color;
    function update_position()
    {
        btn_container.style.left = jQuery(document).outerWidth(true) / 2 + jQuery(container).width() / 2 + 20 + "px";
    }
    update_position();
    jQuery(window).resize(update_position);
    document.body.insert(btn_container);
    function create_button(text, background)
    {
        let btn = document.createElement("a");
        jQuery(btn).text(text);
        btn.style["font-size"] = "1em";
        btn.style["font-family"] = "Arial, Helvetica, Verdana, sans-serif";
        btn.style.background = background;
        btn.style.color = text_color;
        btn.style.padding = "4px";
        btn.style["padding-left"] = "6px";
        btn.style["padding-right"] = "6px";
        btn.style["border-top-left-radius"] = btn_radius + "px";
        btn.style["border-bottom-left-radius"] = btn_radius + "px";
        btn.style["border-top-right-radius"] = btn_radius + "px";
        btn.style["border-bottom-right-radius"] = btn_radius + "px";
        btn.style.position = "absolute";
        btn.style.top = btn_container_padding + "px";
        btn.style.left = btn_container_padding + "px";
        btn.style["white-space"] = "nowrap";
        btn.style["user-select"] = "none";
        //btn.style["box-shadow"] = "3px 3px 3px black";
        return btn;
    }

    function unix()
    {
        return new Date().getTime() / 1000;
    }

    let btn_cancel;
    function is_cancelled(btn)
    {
        if (btn_cancel == null)
            return true;
        if (btn == null)
            return false;
        let btn_dom = btn[0];
        return btn_cancel.style.top != btn_dom.style.top
           || btn_cancel.style.bottom != btn_dom.style.bottom
           //|| btn_cancel.style.left != btn_dom.style.left
           || btn_cancel.style.right != btn_dom.style.right;
    }

    let btn_container_width;
    function set_working_text(btn, text)
    {
        btn.text(text);
        let btn_dom = btn[0];
        btn_container.style.width = Math.max(parseInt(btn_container_width, 10), parseInt(btn_dom.style.left, 10) + btn.outerWidth(true) + btn_container_padding) + "px";
    }
    function start_working(btn, btn_text)
    {
        if (btn_cancel != null)
        {
            btn_cancel.remove();
            btn_cancel = null;
        }
        let btn_dom = btn[0];
        btn_cancel = create_button("Cancel", btn_dom.style.background);
        btn_cancel.style.top = btn_dom.style.top;
        btn_cancel.style.bottom = btn_dom.style.bottom;
        btn_cancel.style.left = btn_dom.style.left;
        btn_cancel.style.right = btn_dom.style.right;
        btn_cancel.style["border-top-right-radius"] = "0px";
        btn_cancel.style["border-bottom-right-radius"] = "0px";
        btn_container.insert(btn_cancel);
        btn_dom.style["border-top-left-radius"] = "0px";
        btn_dom.style["border-bottom-left-radius"] = "0px";
        btn_dom.style.left = parseInt(btn_dom.style.left, 10) + jQuery(btn_cancel).outerWidth(true) + btn_offset_x + "px";
        set_working_text(btn, btn_text);
        jQuery(btn_cancel).click(function() {
            stop_working(btn, btn_text);
            //location.reload();
        });
    }
    function stop_working(btn, btn_text)
    {
        btn.text(btn_text);
        let btn_dom = btn[0];
        btn_dom.style["border-top-left-radius"] = btn_radius + "px";
        btn_dom.style["border-bottom-left-radius"] = btn_radius + "px";
        btn_dom.style.left = parseInt(btn_dom.style.left, 10) - jQuery(btn_cancel).outerWidth(true) - btn_offset_x + "px";
        btn_container.style.width = btn_container_width;
        if (btn_cancel != null)
        {
            btn_cancel.remove();
            btn_cancel = null;
        }
    }

    let manage_document;
    let manage_document_unix;
    function get_manage_document(btn, func)
    {
        if (manage_document != null && unix() - manage_document_unix < 15) { func(); return; }
        manage_document_unix = unix();
        set_working_text(btn, "Getting manage document . . .");
        if (window.location.pathname == "/sharedfiles/managecollection/")
        {
            manage_document = jQuery(document.documentElement);
            func();
        }
        else
        {
            jQuery.ajax({
                type: "GET",
                url: "https://steamcommunity.com/sharedfiles/managecollection",
                data: {
                    id: collection_id
                },
                success: function (response) {
                    if (is_cancelled(btn)) return;
                    manage_document = jQuery(jQuery.parseHTML(response));
                }
            }).done(func);
        }
    }

    function update_choice_item(btn, childID, add)
    {
        let listItems = ["#choice_MyItems_" + childID, "#choice_MyFavoriteItems_" + childID, "#choice_MySubscribedItems_" + childID];
        for (let i = 0; i < listItems.length; ++i)
        {
            if (is_cancelled(btn)) return;
            let listElem = manage_document.find(listItems[i]);
            if (listElem)
            {
                if (add) listElem.addClass("inCollection");
                else listElem.removeClass("inCollection");
            }
        }
    }

    function remove_item(btn, choice_string)
    {
        if (btn_cancel != null) return;
        let btn_text = btn.text();
        start_working(btn, btn_text);
        set_working_text(btn, "Working . . .");
        get_manage_document(btn, function() {
            if (is_cancelled(btn)) return;
            let sortable_items = manage_document.find("div#sortable_items div.managedCollectionItem");
            if (sortable_items.length)
            {
                let i = 0;
                sortable_items.each(function() {
                    if (is_cancelled(btn)) return;
                    let item = jQuery(this);
                    let childID = item.attr("id").replace("sharedfile_", "");
                    if (choice_string != null && manage_document.find("#choice_" + choice_string + "_" + childID).length) return;
                    i++;
                    set_working_text(btn, "Removing " + i + (i == 1 ? " item . . ." : " items . . ."));
                    jQuery.ajax({
                        type: "POST",
                        url: "https://steamcommunity.com/sharedfiles/removechild",
                        data: {
                            id: collection_id,
                            sessionid: sessionID,
                            childid: childID
                        },
                        success: function () {
                            if (is_cancelled(btn)) return;
                            item.remove();
                            update_choice_item(btn, childID, false);
                        }
                    }).done(function() {
                        if (is_cancelled(btn)) return;
                        i--;
                        if (i == 0)
                        {
                            set_working_text(btn, "Refreshing . . .");
                            location.reload();
                        }
                        else
                            set_working_text(btn, "Removing " + i + (i == 1 ? " item . . ." : " items . . ."));
                    });
                });
                if (is_cancelled(btn)) return;
                if (i == 0)
                    stop_working(btn, btn_text);
            }
            else
                stop_working(btn, btn_text);
        });
    }

    function add_item(btn, choice_string)
    {
        if (btn_cancel != null) return;
        let btn_text = btn.text();
        start_working(btn, btn_text);
        set_working_text(btn, "Working . . .");
        get_manage_document(btn, function() {
            if (is_cancelled(btn)) return;
            let sortable_items = manage_document.find("div#" + choice_string + " div.itemChoice:not(.inCollection)");
            if (sortable_items.length)
            {
                let i = 0;
                sortable_items.each(function() {
                    if (is_cancelled(btn)) return;
                    let item = jQuery(this);
                    if (item.find("div.itemChoiceType").text().trim() != "Item") return;
                    let childID = item.attr("id").replace("choice_" + choice_string + "_", "");
                    i++;
                    set_working_text(btn, "Adding " + i + (i == 1 ? " item . . ." : " items . . ."));
                    jQuery.ajax({
                        type: "POST",
                        url: "https://steamcommunity.com/sharedfiles/addchild",
                        data: {
                            id: collection_id,
                            sessionid: sessionID,
                            childid: childID
                        },
                        success: function () {
                            if (is_cancelled(btn)) return;
                            update_choice_item(btn, childID, true);
                        }
                    }).done(function() {
                        if (is_cancelled(btn)) return;
                        i--;
                        if (i == 0)
                        {
                            set_working_text(btn, "Refreshing . . .");
                            location.reload();
                        }
                        else
                            set_working_text(btn, "Adding " + i + (i == 1 ? " item . . ." : " items . . ."));
                    });
                });
                if (is_cancelled(btn)) return;
                if (i == 0)
                    stop_working(btn, btn_text);
            }
            else
                stop_working(btn, btn_text);
        });
    }

    function sort(btn, sort_selector)
    {
        if (btn_cancel != null) return;
        let btn_text = btn.text();
        start_working(btn, btn_text);
        set_working_text(btn, "Working . . .");
        get_manage_document(btn, function() {
            if (is_cancelled(btn)) return;
            let items = manage_document.find("#sortable_items").find("div.managedCollectionItem");
            let n = 0;
            let i = items.length;
            items.sort((a, b) => jQuery(a).find(sort_selector).text().localeCompare(jQuery(b).find(sort_selector).text()));
            if (is_cancelled(btn)) return;
            items.each(function() {
                if (is_cancelled(btn)) return;
                if (jQuery(this).find(".sortorder_input").val() != items.length - i--) n++;
            });
            if (is_cancelled(btn)) return;
            if (n)
            {
                set_working_text(btn, "Sorting " + n + (n == 1 ? " item . . ." : " items . . ."));
                i = items.length;
                items.each(function() {
                    if (is_cancelled(btn)) return;
                    jQuery(this).find(".sortorder_input").val(items.length - i--);
                });
                if (is_cancelled(btn)) return;
                jQuery.ajax({
                    type: "POST",
                    url: "https://steamcommunity.com/sharedfiles/setcollectionsortorder",
                    data: manage_document.find("#ChildItemsForm").serialize(),
                    success: function () {
                        if (is_cancelled(btn)) return;
                        set_working_text(btn, "Refreshing . . .");
                        location.reload();
                    }
                });
            }
            else
                stop_working(btn, btn_text);
        });
    }

    let btns = [];
    function add_button(text, background, double_offset, click) {
        let btn_dom = create_button(text, background);
        let btn = jQuery(btn_dom);
        btn.click(click);
        let last_btn = btns[btns.length - 1];
        if (last_btn != null)
        {
            btn_container.style.height = parseInt(btn_container.style.height, 10) + btn_offset_y + "px";
            btn_dom.style.top = parseInt(last_btn.style.top, 10) + jQuery(last_btn).outerHeight(true) + btn_offset_y + "px";
            if (double_offset)
            {
                btn_container.style.height = parseInt(btn_container.style.height, 10) + btn_offset_y + "px";
                btn_dom.style.top = parseInt(btn_dom.style.top, 10) + btn_offset_y + "px";
            }
        }
        btn_container.insert(btn_dom);
        btn_container.style.width = Math.max(parseInt(btn_container.style.width, 10), btn.outerWidth(true) + btn_container_padding * 2) + "px";
        btn_container.style.height = parseInt(btn_container.style.height, 10) + btn.outerHeight(true) + "px";
        btn_container_width = btn_container.style.width;
        btns.push(btn_dom);
        return btn_dom;
    }

    add_button("Remove all unowned items", remove_color, false, function() { remove_item(jQuery(this), "MyItems"); });
    add_button("Add all unowned items", add_color, false, function() { add_item(jQuery(this), "MyItems"); });

    add_button("Remove all unfavorited items", remove_color, true, function() { remove_item(jQuery(this), "MyFavoriteItems"); });
    add_button("Add all favorited items", add_color, false, function() { add_item(jQuery(this), "MyFavoriteItems"); });

    add_button("Remove all unsubscribed items", remove_color, true, function() { remove_item(jQuery(this), "MySubscribedItems"); });
    add_button("Add all subscribed items", add_color, false, function() { add_item(jQuery(this), "MySubscribedItems"); });

    add_button("Remove all items", remove_color, true, function() { remove_item(jQuery(this)); });

    add_button("Sort items by name", sort_color, true, function() { sort(jQuery(this), ".actual_title"); });
    add_button("Sort items by author", sort_color, false, function() { sort(jQuery(this), ".workshopItemAuthorName"); });
})();