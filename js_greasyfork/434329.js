// ==UserScript==
// @name        meneame.net - Mostrar/ocultar detalles en meneos
// @namespace   http://tampermonkey.net/
// @version     0.10
// @description Añadir desplegable a meneos para mostrar/ocultar detalles.
// @author      ᵒᶜʰᵒᶜᵉʳᵒˢ
// @include     *.meneame.net/*
// @icon        https://www.meneame.net/favicon.ico
// @grant       GM_addStyle
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/434329/meneamenet%20-%20Mostrarocultar%20detalles%20en%20meneos.user.js
// @updateURL https://update.greasyfork.org/scripts/434329/meneamenet%20-%20Mostrarocultar%20detalles%20en%20meneos.meta.js
// ==/UserScript==

// RECOMENDADO USAR JUNTO AL CSS DE @Ergo: https://userstyles.world/style/1811

// ---- SCRIPT values ----
const DEFAULT_HIDE = true; // true or false
const DEFAULT_HIDE_PIC = false; // true or false
const DISABLE_IN_MENEOS = true; // true or false

// ---- API values ----
const MENEO_CLASS = '.news-body';
const MENEO_CLICS = '.clics';
const MENEO_PIC = '.fancybox.thumbnail-wrapper';
const MENEO_SUB_NAME = '.sub-name';
const MENEO_SHAKE_IT = '.news-shakeit';
const LIST_TO_HIDE = [
    '.news-submitted',
    '.news-details',
    '.news-tags',
    '.box',
];

const CSS_HIDECONTROLS = "#btnControl_XX {display: none;} " +
      "#btnControl_XX:checked + label {transform:rotate(180deg);}";
const CSS_DROPDOWN = ".btnCHK {background-image:linear-gradient(-180deg, #f5720e 0%, #fe4a00 100%);border: 1px solid rgba(122, 47, 11, 0.45);display: block;color: #fff;text-decoration: none;font-weight: bold;border-radius: 3px;outline: none;vertical-align: baseline;margin: 0;padding: 0;box-sizing: border-box;font-size: 12px;text-align: center;overflow: hidden !important;} .news-summary .center-content {padding-right: 10px;} [class^='news-summary'] { min-height: 150px;}"
const CSS_DROPDOWN_CLASS = "Dropdown_XX";

const HTML_Checkboxes = "<input type='checkbox' id='btnControl_XX' style='display: none;'/><label class='btnCHK' for='btnControl_XX' onclick=\"javascript:$('.Dropdown_XX').toggle();\">&nbsp;V&nbsp;</label>";
const CONFIG_SAVED = 'CONFIG_SAVED';

var CSS_PAGE = "";
var i = -1;
var css_Str = '';

// ===================
AddDropdownMeneos();

function AddDropdownMeneos() {
    if (DISABLE_IN_MENEOS && link_id > 0) {
        // DoNothing
    } else {
        let meneos = document.querySelectorAll(MENEO_CLASS);
        CSS_PAGE = CSS_DROPDOWN;
        meneos.forEach( function(node) {
            i++;
            InsertCheckBoxDropdown(node);
            Move_Sub_Label(node);
            for(var ItemToHide of LIST_TO_HIDE) {
                if (ItemToHide != null) Hide_Element(node, ItemToHide);
                if (DEFAULT_HIDE_PIC) Hide_Element(node, MENEO_PIC);
            }
        });
        meneos = "";
        i = "";
        GM_addStyle(CSS_PAGE);
        CSS_PAGE="";
    }
}

function InsertCheckBoxDropdown(meneoBodyNode) {
    let findClicsNode = meneoBodyNode.querySelector(MENEO_CLICS);
    if (findClicsNode != null) {
        var strCSSToHide = CSS_HIDECONTROLS.replace(/XX/g, i);
        CSS_PAGE += strCSSToHide;
        var strLabelCheckbox = HTML_Checkboxes.replace(/XX/g, i);
        findClicsNode.insertAdjacentHTML('afterend', strLabelCheckbox);
    }
}

function Hide_Element(meneoBodyNode, classToHide) {
    let elementToHide = meneoBodyNode.querySelector(classToHide);
    if (elementToHide != null) {
        css_Str = CSS_DROPDOWN_CLASS.replace(/XX/g, i);
        if (DEFAULT_HIDE) elementToHide.style.display = 'none';
        elementToHide.classList.add(css_Str);
    }
}

function Move_Sub_Label(meneoBodyNode) {
    var nodeSub = meneoBodyNode.querySelector(MENEO_SUB_NAME);
    if (nodeSub) {
        var nodeShakeIt = meneoBodyNode.querySelector(MENEO_SHAKE_IT);
        if (nodeShakeIt) nodeShakeIt.append(nodeSub);
    }
}