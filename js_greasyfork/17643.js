// ==UserScript==
// @name         Style Manager
// @namespace    de.177103.proxer
// @version      0.9.2
// @description  Ein einfacher Style Manager für Proxer.Me
// @author       InfiniteSoul
// @include      http://proxer.me/*
// @include      https://proxer.me/*
// @include      http://www.proxer.me/*
// @include      https://www.proxer.me/*
// @run-at       document-start
// @require      https://greasyfork.org/scripts/12981-proxer-userscript-anker/code/Proxer-Userscript-Anker.js?version=108562
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/17643/Style%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/17643/Style%20Manager.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...
var style_manager_cookie_name = "style_manager";
var proxer_style_cookie_name = "style";

var styles_list = [];
var select_list;

document.addEventListener('DOMContentLoaded', function () {
    registerEvents();
    styles_list = JSON.parse(GM_getValue("styles", "[]"));
    convertStylesList();
    addAnkerMember('style_manager', 'Style Manager', 3, skinManagerActionControl, 'style_manager', 0, getAnkerExtendedComponents());
    showNewVersion();
});

function showNewVersion(){
    neueVersion("0.9.2", "v0.9.2: Löschen wird jetzt durch Dialog bestätigt!");
}

function registerEvents(){
    jQuery(".colorbox").not(".custom").click(function () {
        switchToBaseStyle();
    });
}

function convertStylesList(){
    for (var i = 0; i < styles_list.length; i++) {
        if (styles_list[i] !== null) {
            if(styles_list[i].author === undefined) styles_list[i].author = "";
        }
    }
}

function skinManagerActionControl(change) {
    if (change === true) {
        if (GM_getValue("style_manager", 0) === 0) {
            jQuery(".colorbox.custom").remove();
            switch_style(get_cookie(proxer_style_cookie_name), true);
        } else {
            initStyles();
            createTestStyles();
        }
    } else {
        if (GM_getValue("style_manager", 0) === 0) {
            jQuery(".colorbox.custom").remove();
        } else {
            initStyles();
            var style_id = get_cookie(style_manager_cookie_name);
            if(style_id !== undefined && style_id !== "") switchStyleFromSaveObject(getSaveObjectOfId(style_id));
            createTestStyles();
        }
    }
}

function createTestStyles() {
    addStyle(createSaveObject("test1", "body{background-color: #FDDFD3;}", "gray", "", "", "InfiniteSoul"), true);
    addStyle(createSaveObject("test2", "body{background-color: #B32500;}", "black", "", "", "InfiniteSoul"), true);
    addStyle(createSaveObject("testPantsu", "body{background: url(\"//cdn.proxer.me/news/th/4445_359458246705.png\") repeat;}\n#wrapper {background: url(\"//cdn.proxer.me/news/th/4448_714984233543.png\") repeat scroll;}", "pantsu", "", "", "InfiniteSoul"), true);
}

function addStyle(save_object, ignore_warning, overwrite) {
    if (overwrite) {
        for(var i = 0; i < styles_list.length; i++) {
            if (styles_list[i] !== null && styles_list[i].id === save_object.id) {
                styles_list[i] = save_object;
                saveStyles();
            }
        }
    }
    else if (canAddStyle(save_object.id)) {
        styles_list.push(save_object);
        saveStyles();
        if (GM_getValue("style_manager", 0) === 1) addSingleStyleNode(save_object);
        refreshStyleTable();
    } else {
        if (!ignore_warning) window.alert("Style existiert bereits!");
    }
}

function canAddStyle(id) {
    for (var i = 0; i < styles_list.length; i++) {
        if (styles_list[i] !== null && styles_list[i].id === id) return false;
    }

    return true;
}

function initStyles() {
    if(jQuery("div#style-separator").length == 0){
        var separator = document.createElement("div");
        separator.style.height = "17px";
        separator.id = "style-separator";
        document.getElementsByClassName("colorbox")[0].parentNode.appendChild(separator);
    }
    for (var i = 0; i < styles_list.length; i++) {
        addSingleStyleNode(styles_list[i]);
    }

    refreshStyleTable();
}

function addSingleStyleNode(save_object) {
    if (canAddStyleNode(save_object.id)) {
        var style_node = document.createElement("span");
        style_node.className = "colorbox " + save_object.base_css + " custom " + save_object.id;
        style_node.innerHTML = "&nbsp;";
        if (save_object.icon !== "" && save_object.icon !== undefined) style_node.style.backgroundImage = "url('" + save_object.icon + "')";
        style_node.style.backgroundSize = "cover";
        style_node.style.marginRight = "5px";
        style_node.onclick = function () {
            switchStyleFromSaveObject(save_object);
        };
        document.getElementById("style-separator").parentNode.appendChild(style_node);
        return style_node;
    }
    return document.createElement("div");
}

function canAddStyleNode(style_id) {
    return jQuery(".colorbox.custom." + style_id).length === 0;
}

function createSaveObject(id, css, base_css, icon_url, custom_css, author) {
    var save_object = {};
    save_object.id = id;
    save_object.css = css;
    save_object.base_css = base_css;
    save_object.icon = icon_url;
    save_object.custom_css = custom_css;
    save_object.author = author;
    return save_object;
}

function getSaveObjectOfId(style_id){
    for (var i = 0; i < styles_list.length; i++) {
        if(styles_list[i] !== null && styles_list[i].id === style_id){
            return styles_list[i];
        }
    }
}

function switchStyleFromSaveObject(save_object){
    if(get_cookie(proxer_style_cookie_name) !== save_object.base_css) switch_style(save_object.base_css, true);
    set_cookie(style_manager_cookie_name, save_object.id, 30);
    set_cookie(proxer_style_cookie_name, save_object.base_css, 30);
    addCustomCss(save_object.id);
    jQuery(".colorbox").removeClass("check");
    jQuery(".colorbox.custom." + save_object.id).addClass("check");
}

function switchToBaseStyle(base_style){
    if(base_style !== undefined) switch_style(base_style, true);
    removeAllCustomCss();
    set_cookie(style_manager_cookie_name, "", 30);
}

function addCustomCss(style_id){
    removeAllCustomCss();
    if (style_id !== "") {
        for (var i = 0; i < styles_list.length; i++) {
            if (styles_list[i] !== null && styles_list[i].id === style_id) {
                var style_head = document.createElement("style");
                style_head.innerHTML = "/*Custom*/" + styles_list[i].css;
                style_head.type = "text/css";
                document.head.appendChild(style_head);
            }
        }
    }
}

function removeAllCustomCss(){
    var style_tags = document.head.getElementsByTagName("style");
    while(style_tags.length !== 0 && style_tags[style_tags.length - 1].innerHTML.startsWith("/*Custom*/")) {
        document.head.removeChild(style_tags[style_tags.length - 1]);
        style_tags = document.head.getElementsByTagName("style");
    }
}

function saveStyles() {
    GM_setValue("styles", JSON.stringify(styles_list));
}

function getAnkerExtendedComponents() {
    var container_div = document.createElement('div');
    container_div.appendChild(createStyleTable());

    var add_button = document.createElement("a");
    add_button.href = "javascript:;";
    add_button.innerHTML = "<h4>Hinzufügen</h4>";
    add_button.style.textAlign = "center";
    add_button.style.color = getStyleProp(main, "color");
    add_button.onclick = function () {
        addStyleDialog(createSaveObject("", "", "", "", "", ""));
    };
    container_div.appendChild(add_button);

    return container_div;
}

function createStyleTable() {
    select_list = document.createElement('table');
    select_list.id = "box-table-a";
    select_list.align = "center";
    select_list.style.width = "100%";

    var header_row = select_list.insertRow(0);
    var column_id = document.createElement("th");
    column_id.innerHTML = "ID";
    header_row.appendChild(column_id);

    var column_author = document.createElement("th");
    column_author.innerHTML = "Autor";
    header_row.appendChild(column_author);

    var column_options = document.createElement("th");
    column_options.innerHTML = "Optionen";
    header_row.appendChild(column_options);

    return select_list;
}

function refreshStyleTable(){
    if(window.location.pathname.split('/')[1] !== 'ucp' || location.search !== "?s=scripts"){
        return;
    }

    for (var i = select_list.rows.length - 1; i >= 1; i--) {
        select_list.deleteRow(i);
    }

    for (i = 0; i < styles_list.length; i++) {
        var save_object = styles_list[i];

        var row = select_list.insertRow(-1);
        var column_id = row.insertCell(0);
        column_id.innerHTML = save_object.id;

        var column_author = row.insertCell(1);
        column_author.innerHTML = save_object.author;

        var column_options = row.insertCell(2);
        var edit_button = document.createElement("a");
        var delete_button = document.createElement("a");
        edit_button.href = "javascript:;";
        edit_button.style.textAlign = "center";
        edit_button.innerHTML = "Bearbeiten";
        edit_button.className = save_object.id;
        edit_button.onclick = function () {
            addStyleDialog(getSaveObjectFromId(this.className), true);
        };
        delete_button.href = "javascript:;";
        delete_button.style.textAlign = "center";
        delete_button.innerHTML = "Löschen";
        delete_button.className = save_object.id;
        delete_button.onclick = function () {
            createAnkerDialog("Möchtest du \"" + save_object.id + "\" von " + save_object.author + "\" wirklich löschen?", function(){removeStyle(getSaveObjectFromId(save_object.id));}, function(){});
        };
        column_options.appendChild(edit_button);
        column_options.appendChild(document.createElement("div"));
        column_options.appendChild(delete_button);
    }
}

function getSaveObjectFromId(id){
    for (var i = 0; i < styles_list.length; i++) {
        if (styles_list[i] !== null && styles_list[i].id === id) {
            return styles_list[i];
        }
    }
}

function removeStyle(save_object){
    for (var i = 0; i < styles_list.length; i++) {
        if (styles_list[i] !== null && styles_list[i].id === save_object.id) {
            styles_list.splice(i, 1);
        }
    }

    if(jQuery(".colorbox.custom.check." + save_object.id).length !== 0){
        switchToBaseStyle(save_object.base_css);
        set_cookie(style_manager_cookie_name, "", 30);
    }
    jQuery(".colorbox.custom." + save_object.id).remove();
    saveStyles();
    refreshStyleTable();
}

function getStyleString(save_object) {
    var return_string = "//@id: " + save_object.id + "\n";
    return_string += "//@base_css: " + save_object.base_css + "\n";
    return_string += "//@icon_url: " + save_object.icon + "\n";
    return_string += "//@author: " + save_object.author + "\n";
    return_string += save_object.custom_css === "" || save_object.custom_css === undefined ? save_object.css : save_object.custom_css;
    return return_string;
}

function addStyleDialog(save_object, overwrite) {
    var window_height = window.innerHeight;
    var messages_div = document.getElementById('messages');

    var dialog_overlay = document.createElement("div");
    dialog_overlay.style.display = "block";
    dialog_overlay.style.height = window_height + "px";
    dialog_overlay.style.backgroundColor = '#A2A4A8';
    dialog_overlay.style.opacity = '0.6';

    var dialog_box = document.createElement("div");
    dialog_box.style.display = "block";
    dialog_box.style.position = "absolute";
    dialog_box.style.top = "50%";
    dialog_box.style.left = "50%";
    dialog_box.setAttribute("class", "message");

    var dialog_type_select = document.createElement("select");
    dialog_type_select.style.width = "100px";
    dialog_type_select.style.float = "left";
    dialog_type_select.style.marginBottom = "10px";

    var dialog_type_select_container = document.createElement("div");
    dialog_type_select_container.appendChild(dialog_type_select);

    var dialog_type_option_css = document.createElement("option");
    dialog_type_option_css.value = "css";
    dialog_type_option_css.innerHTML = "CSS";
    dialog_type_option_css.selected = save_object.custom_css === "";

    var dialog_type_option_custom = document.createElement("option");
    dialog_type_option_custom.value = "custom";
    dialog_type_option_custom.innerHTML = "Custom";
    dialog_type_option_custom.selected = save_object.custom_css !== "";

    dialog_type_select.appendChild(dialog_type_option_css);
    dialog_type_select.appendChild(dialog_type_option_custom);

    var dialog_text_box = document.createElement("textarea");
    dialog_text_box.rows = 40;
    dialog_text_box.cols = 100;
    dialog_text_box.style.textAlign = "left";
    dialog_text_box.style.textShadow = "none";
    dialog_text_box.value = getStyleString(save_object);

    var dialog_buttons = document.createElement("div");
    dialog_buttons.style.textAlign = "center";
    dialog_buttons.style.marginTop = "20px";

    var dialog_button_yes = document.createElement("a");
    dialog_button_yes.innerHTML = '<a href="javascript:;"><img src="https://proxer.me/images/misc/haken.png" width="30" height="30"></a>';
    dialog_buttons.appendChild(dialog_button_yes);

    var dialog_button_no = document.createElement("a");
    dialog_button_no.innerHTML = '<a href="javascript:;"><img src="https://proxer.me/images/misc/kreuz.png" width="30" height="30"></a>';
    dialog_button_no.style.margin = "0px 0px 0px 20px";
    dialog_buttons.appendChild(dialog_button_no);

    dialog_box.appendChild(dialog_type_select_container);
    dialog_box.appendChild(dialog_text_box);
    dialog_box.appendChild(dialog_buttons);

    messages_div.appendChild(dialog_overlay);
    messages_div.appendChild(dialog_box);

    dialog_box.style.marginTop = (dialog_box.clientHeight / -2) + "px";
    dialog_box.style.marginLeft = (dialog_box.clientWidth / -2) + "px";

    dialog_button_yes.addEventListener("click", function () {
        if (dialog_text_box.value !== '') {
            if (dialog_type_select.selectedIndex === 0) {
                if(!processCssStyleInput(dialog_text_box.value, overwrite)) return;
            } else if (dialog_type_select.selectedIndex === 1) {
                if(!processCustomStyleInput(dialog_text_box.value, overwrite)) return;
            }
        }

        messages_div.removeChild(dialog_overlay);
        messages_div.removeChild(dialog_box);
    });

    dialog_button_no.addEventListener("click", function () {
        messages_div.removeChild(dialog_overlay);
        messages_div.removeChild(dialog_box);
    });

    jQuery("#messages .message").css("background-color", getStyleProp(main, "background-color"));
}

/*
Verarbeitung von neuen Styles
 */
function processBasicStyleInfo(text) {
    var return_object = {};
    return_object.id = "";
    return_object.base_css = "";

    text.split("\n").forEach(function (current_value) {
        if (current_value.lastIndexOf("//@", 0) === 0) {
            switch (current_value.substring(3).split(":")[0]) {
                case "id":
                    return_object.id = current_value.split(":")[1].trim();
                    break;
                case "base_css":
                    return_object.base_css = current_value.split(":")[1].trim();
                    break;
                case "icon_url":
                    return_object.icon = current_value.substring(current_value.split(":")[0].length + 1).trim();
                    break;
                case "author":
                    return_object.author = current_value.substring(current_value.split(":")[0].length + 1).trim();
                    break;
            }
        }
    });

    if (return_object.id === "") {
        createAnkerMessage("Bitte gib eine Id für den neuen Style ein!");
        return null;
    }
    if (return_object.base_css === "") {
        createAnkerMessage("Bitte gib einen Style ein, auf dem der neue aufbauen soll!");
        return null;
    }

    return return_object;
}

function processCssStyleInput(text, overwrite) {
    var css = "";
    text.split("\n").forEach(function (currentValue) {
        if (currentValue.trim().lastIndexOf("//", 0) !== 0) {
            css += currentValue + "\n";
        }
    });

    if(css.trim() === "") return true;

    var info_container = processBasicStyleInfo(text);
    if(info_container === null) return false;
    addStyle(createSaveObject(info_container.id, css.trim(), info_container.base_css, info_container.icon, "", info_container.author), false, overwrite);

    return true;
}


/*
Verarbeitung des eigenen Styleformats
 */
function getCssFromElement(property, append_char) {
    var css_string = "";
    for (var element in property) {
        if (property.hasOwnProperty(element)) {
            var append_css = "";
            css_string += append_char + element.replace(/LINE/g, "-") + "{\n";
            for (var css_property in property[element]) {
                if (property[element].hasOwnProperty(css_property)) {
                    switch (css_property) {
                        case "element":
                            break;
                        case "id":
                            append_css += getCssFromElement(property[element][css_property], append_char + element.replace(/LINE/g, "-") + "#");
                            break;
                        case "childElement":
                            append_css += getCssFromElement(property[element][css_property], append_char + element.replace(/LINE/g, "-") + " ");
                            break;
                        case "class":
                            append_css += getCssFromElement(property[element][css_property], append_char + element.replace(/LINE/g, "-") + ".");
                            break;
                        case "event":
                            append_css += getCssFromElement(property[element][css_property], append_char + element.replace(/LINE/g, "-") + ":");
                            break;
                        default:
                            css_string += property[element][css_property] + ";\n";
                            break;
                    }
                }
            }
            css_string += "}\n";
            css_string += append_css;
        }
    }
    return css_string;
}

function getCssText(css_container) {
    var css_string = "";
    for (var property in css_container) {
        if (css_container.hasOwnProperty(property)) {
            switch (property) {
                case "element":
                    css_string += getCssFromElement(css_container[property], "");
                    break;
                case "id":
                    css_string += getCssFromElement(css_container[property], "#");
                    break;
                case "class":
                    css_string += getCssFromElement(css_container[property], ".");
                    break;
            }
        }
    }
    return css_string;
}

function processCustomStyleInput(text, overwrite) {
    var css_container = {};
    var custom_css = "";
    text.split("\n").forEach(function (current_value) {
        if (current_value.trim().lastIndexOf("//", 0) !== 0) {
            custom_css += current_value + "\n";
            switch (current_value.split(":")[0]) {
                case "background-color":
                    var color = current_value.substring(current_value.split(":")[0].length + 1).trim();
                    if(!createProperties(css_container, "element.body")) return false;
                    css_container.element.body.backgroundImage = "background-image: url('')";
                    css_container.element.body.backgroundColor = "background-color: " + color;
                    break;
                case "background-url":
                    if(!createProperties(css_container, "element.body")) return false;
                    css_container.element.body.backgroundImage = "background-image: url('" + current_value.substring(current_value.split(":")[0].length + 1).trim() + "')";
                    break;
                case "header-url":
                    if(!createProperties(css_container, "id.wrapper", css_container)) return false;
                    css_container.id.wrapper.backgroundImage = "background-image: url('" + current_value.substring(current_value.split(":")[0].length + 1).trim() + "')";
                    break;
                case "body-background-color-light":
                    var color = current_value.substring(current_value.split(":")[0].length + 1).trim();
                    if(!createProperties(css_container, "id.nav", css_container)) return false;
                    if(!createProperties(css_container, "id.boxLINEtableLINEa.childElement.th", css_container)) return false;
                    if(!createProperties(css_container, "element.ul.id.simpleLINEnavi", css_container)) return false;
                    if(!createProperties(css_container, "class.topmenu.childElement.ul", css_container)) return false;
                    if(!createProperties(css_container, "class.details.childElement.td", css_container)) return false;
                    css_container.element.ul.id.simpleLINEnavi.backgroundColor = "background-color: " + color;
                    css_container.id.nav.backgroundColor = "background-color: " + current_value.substring(current_value.split(":")[0].length + 1).trim();
                    css_container.id.boxLINEtableLINEa.childElement.th.backgroundColor = "background-color: " + color;
                    css_container.class.topmenu.childElement.ul.backgroundColor = "background-color: " + color;
                    css_container.class.details.childElement.td.backgroundColor = "background-color: " + color;
                    break;
                case "body-background-color":
                    var color = current_value.substring(current_value.split(":")[0].length + 1).trim();
                    var gradient = "linear-gradient(top, " + colorLuminance(color, 0.5) + " 0%, " + colorLuminance(color, 0.3) + " 9%, " + color + " 21%, " + color + " 100%);"
                    if(!createProperties(css_container, "id.chat", css_container)) return false;
                    if(!createProperties(css_container, "id.main", css_container)) return false;
                    if(!createProperties(css_container, "id.loginBubble.event.after", css_container)) return false;
                    if(!createProperties(css_container, "id.notificationBubble.event.after", css_container)) return false;
                    if(!createProperties(css_container, "id.boxLINEtableLINEa.childElement.td", css_container)) return false;
                    if(!createProperties(css_container, "class.customBubble.event.after", css_container)) return false;
                    if(!createProperties(css_container, "element.ul.id.simpleLINEnavi.childElement.li.childElement.a.event.hover", css_container)) return false;
                    if(!createProperties(css_container, "element.ul.id.simpleLINEnavi.childElement.li.class.active.childElement.a", css_container)) return false;
                    css_container.element.ul.id.simpleLINEnavi.childElement.li.class.active.childElement.a.backgroundWebkit = "background: -webkit-" + gradient;
                    css_container.element.ul.id.simpleLINEnavi.childElement.li.class.active.childElement.a.backgroundMoz = "background: -moz-" + gradient;
                    css_container.element.ul.id.simpleLINEnavi.childElement.li.class.active.childElement.a.backgroundOpera = "background: -o-" + gradient;
                    css_container.element.ul.id.simpleLINEnavi.childElement.li.class.active.childElement.a.background = "background: " + gradient;
                    css_container.element.ul.id.simpleLINEnavi.childElement.li.childElement.a.event.hover.backgroundWebkit = "background: -webkit-" + gradient;
                    css_container.element.ul.id.simpleLINEnavi.childElement.li.childElement.a.event.hover.backgroundMoz = "background: -moz-" + gradient;
                    css_container.element.ul.id.simpleLINEnavi.childElement.li.childElement.a.event.hover.backgroundOpera = "background: -o-" + gradient;
                    css_container.element.ul.id.simpleLINEnavi.childElement.li.childElement.a.event.hover.background = "background: " + gradient;
                    css_container.id.main.backgroundColor = "background-color: " + color;
                    css_container.id.notificationBubble.backgroundColor = "background-color: " + color;
                    css_container.id.notificationBubble.event.after.borderColorBottom = "border-bottom-color: " + color;
                    css_container.id.loginBubble.backgroundColor = "background-color: " + color;
                    css_container.id.loginBubble.event.after.borderColorBottom = "border-bottom-color: " + color;
                    css_container.id.chat.backgroundColor = "background-color: " + color;
                    css_container.id.boxLINEtableLINEa.childElement.td.backgroundColor = "background-color: " + color;
                    css_container.class.customBubble.backgroundColor = "background-color: " + color;
                    //cssContainer.class.customBubble.event.after.borderColorBottom = "border-bottom-color: " + color;
                    break;
                case "body-background-color-dark":
                    var color = current_value.substring(current_value.split(":")[0].length + 1).trim();
                    if(!createProperties(css_container, "element.div.id.panel", css_container)) return false;
                    css_container.element.div.id.panel.background = "background: none repeat scroll 0 0 " + color;
                    break;
                case "link-color":
                    var color = current_value.substring(current_value.split(":")[0].length + 1).trim();
                    if(!createProperties(css_container, "element.a", css_container)) return false;
                    css_container.element.a.color = "color: " + color;
                    break;
                case "link-hover-color":
                    var color = current_value.substring(current_value.split(":")[0].length + 1).trim();
                    if(!createProperties(css_container, "element.a.event.hover", css_container)) return false;
                    css_container.element.a.event.hover.color = "color: " + color;
                    break;
                case "font-color-light":
                    var color = current_value.substring(current_value.split(":")[0].length + 1).trim();
                    if(!createProperties(css_container, "id.nav.childElement.a", css_container)) return false;
                    if(!createProperties(css_container, "element.ul.id.simpleLINEnavi.childElement.li.childElement.a.event.hover", css_container)) return false;
                    if(!createProperties(css_container, "element.ul.id.simpleLINEnavi.childElement.li.class.active.childElement.a", css_container)) return false;
                    css_container.element.ul.id.simpleLINEnavi.childElement.li.class.active.childElement.a.color = "color: " + color;
                    css_container.element.ul.id.simpleLINEnavi.childElement.li.childElement.a.event.hover.color = "color: " + color;
                    css_container.id.nav.childElement.a.color = "color: " + color;
                    break;
                case "font-color":
                    var color = current_value.substring(current_value.split(":")[0].length + 1).trim();
                    if(!createProperties(css_container, "element.body", css_container)) return false;
                    css_container.element.body.color = "color: " + color;
                    break;
                case "tab-font-color":
                    var color = current_value.substring(current_value.split(":")[0].length + 1).trim();
                    if(!createProperties(css_container, "css_container.element.ul.id.simpleLINEnavi.childElement.li.class.active.childElement.a", css_container)) return false;
                    css_container.element.ul.id.simpleLINEnavi.childElement.li.childElement.a.color = "color: " + color;
                    break;
                case "tab-color":
                    var color = current_value.substring(current_value.split(":")[0].length + 1).trim();
                    var gradient = "linear-gradient(top, " + colorLuminance(color, 0.5) + " 0%, " + colorLuminance(color, 0.3) + " 9%, " + color + " 21%, " + color + " 100%);";
                    if(!createProperties(css_container, "element.ul.id.simpleLINEnavi.childElement.li.class.active.childElement.a", css_container)) return false;
                    css_container.element.ul.id.simpleLINEnavi.childElement.li.childElement.a.backgroundWebkit = "background: -webkit-" + gradient;
                    css_container.element.ul.id.simpleLINEnavi.childElement.li.childElement.a.backgroundMoz = "background: -moz-" + gradient;
                    css_container.element.ul.id.simpleLINEnavi.childElement.li.childElement.a.backgroundOpera = "background: -o-" + gradient;
                    css_container.element.ul.id.simpleLINEnavi.childElement.li.childElement.a.background = "background: " + gradient;
                    break;
            }
        }
    });

    if(custom_css.trim() !== ""){
        var info_container = processBasicStyleInfo(text);
        if (info_container === null) return false;
        info_container.css = getCssText(css_container);
        addStyle(createSaveObject(info_container.id, info_container.css.trim(), info_container.base_css, info_container.icon, custom_css, info_container.author === undefined ? "" : info_container.author), false, overwrite);
        return true;
    }
    return true;
}

function createProperties(object, properties) {
    if(properties === ""){
        return true;
    }
    if(properties.substring(0, 1) === ".") properties = properties.substring(1);

    var curProperty = properties.indexOf(".") === -1 ? properties : properties.substring(0, properties.indexOf("."));
    if(!object.hasOwnProperty(curProperty)) {
        object[curProperty] = {};
    }

    return createProperties(object[curProperty], properties.indexOf(".") === -1 ? "" : properties.substring(properties.indexOf(".") + 1));
}

function colorLuminance(color, percent) {
    var f = parseInt(color.slice(1), 16), t = percent < 0 ? 0 : 255, p = percent < 0 ? percent * -1 : percent, R = f >> 16, G = f >> 8 & 0x00FF, B = f & 0x0000FF;
    return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
}