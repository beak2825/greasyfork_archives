// ==UserScript==
// @name         PFC Modernizer
// @namespace    http://statonions.com/
// @version      0.2
// @description  Grid is pretty cool
// @author       Justice Noon
// @match        https://app.roll20.net/editor/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/381083/PFC%20Modernizer.user.js
// @updateURL https://update.greasyfork.org/scripts/381083/PFC%20Modernizer.meta.js
// ==/UserScript==

(function() {
    'use strict';
	function extraFormatting() {
        if (!document.querySelector('.dialog.characterdialog')) {
            setTimeout(extraFormatting, 500);
            return;
        }
		/*
        function calcAll() {

            document.querySelectorAll('.repitem input.sheet-counted.sheet-sect-show').forEach(o => {
				var compute;
				if (compute = o.closest('.sheet-nontable-repeating,.sheet-table-repeating')) {
					o.closest('.repitem').setAttribute('boxheight', Math.ceil(parseInt(getComputedStyle(o.closest('.sheet-nontable-repeating,.sheet-table-repeating')).getPropertyValue('height').slice(0,-2)) / 100) + "");
					o.addEventListener('click', itemHeight);
				}
            });

            document.querySelectorAll('.repitem input.sheet-showarrow').forEach(o => {
				var compute;
				if (compute = o.closest('.sheet-nontable-repeating,.sheet-table-repeating')) {
					o.closest('.repitem').setAttribute('boxheight', Math.ceil(parseInt(getComputedStyle(o.closest('.sheet-nontable-repeating,.sheet-table-repeating')).getPropertyValue('height').slice(0,-2)) / 100) + "");
					o.addEventListener('click', itemHeight);
				}
            });
        }
        calcAll();
        document.querySelectorAll('input.sheet-minimize-show.sheet-cssbutton').forEach(c => c.addEventListener('click', calcAll));


        function itemHeight(c) {
            c.currentTarget.closest('.repitem').setAttribute('boxheight', Math.ceil(parseInt(getComputedStyle(c.currentTarget.closest('.sheet-nontable-repeating,.sheet-table-repeating')).getPropertyValue('height').slice(0,-2)) / 100) + "");
        }
*/
        debugger;
        document.querySelectorAll('select[name="attr_equip-type"]').forEach(o => {
            var typeList = ['t_norm','t_weap','t_armo','t_ammo','t_cons','t_magi','t_gear','t_oth1','t_chrg','t_oth2'];
            o.closest('div').classList.add(typeList[o.value]);
            o.addEventListener('input', c => {o.closest('div').classList.remove(...typeList); o.closest('div').classList.add(typeList[o.value]);});
        });

		//Spell inputs
		document.querySelectorAll('.sheet-Spells label input[type="number"]').forEach(i => {
			if (!i.readOnly) {
				var downButton = document.createElement('button'), upButton = document.createElement('button');
				downButton.innerHTML = '-';
				upButton.innerHTML = '+';
				downButton.onclick = function() {this.nextElementSibling.stepDown();};
				upButton.onclick = function() {this.previousElementSibling.stepUp();};
				i.parentNode.insertBefore(upButton, i.nextSibling);
				i.parentNode.insertBefore(downButton, i);
				i.parentNode.style.width = '6em';
			}
		});
    }
	if (document.location.href == 'https://app.roll20.net/editor/popout')
		setTimeout(extraFormatting);

	if (typeof $ != 'undefined') {
        $("#journal").on("click", ".character", function() {
            if (!currentPlayer.attributes.usePopouts)
                setTimeout(extraFormatting);
        });
    }

if (true)
    GM_addStyle(`
.charsheet {
    --columns: 4;
    /*--head-height: calc(var(--columns) / 2 * .9);*/
    --head-height: calc(1 * .9);
}

.repcontainer[data-groupname="repeating_item"] {
    --columns: 4;
}

.repcontainer[data-groupname="repeating_buff2"] {
    --columns: 4;
}

.repcontainer {
    columns: 400px var(--columns);
}

.repitem {
    break-inside: avoid;
}
.repitem label {
    width: min-content;
}

.charsheet .sheet-repeating-sect .repcontainer .repitem .sheet-nontable-repeating.sheet-compendium-drop-target {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

/*Colors per item type*/
.sheet-Items.t_norm {
    background: white;
}

.sheet-Items.t_weap {
    background: #ffdedd;
}

.sheet-Items.t_armo {
    background: #9eaec3;
}

.sheet-Items.t_ammo {
    background: #fffbdd;
}

.sheet-Items.t_cons {
    background: #ddffe1;
}

.sheet-Items.t_magi {
    background: #edddff;
}

.sheet-Items.t_gear {
    background: #d6c4bd;
}

.sheet-Items.t_oth1 {
    background: #f5dfb6;
}

.sheet-Items.t_chrg {
    background: #ffddfc;
}

.sheet-Items.t_oth2 {
    background: #b7b7b7;
}

.charsheet .sheet-small-label2.sheet-small-label {
    width: min-content;
    display: inline-block;
}

.charsheet .sheet-small-label2.sheet-small-label[style="height: auto"] {
    width: -webkit-fill-available;
}

.charsheet .sheet-small-label2.sheet-small-label[style="width: 10%"] {
    width: 20% !important;
}

.charsheet .sheet-small-label2.sheet-small-label[style="width: 15%"] {
    width: 20% !important;
}

.charsheet .sheet-small-label2 > input:not(.sheet-cssbutton), .charsheet .sheet-small-label2 > select, .charsheet .sheet-small-label2 > .sheet-calc {
    /*width: 100%;*/
}

.charsheet .sheet-Items .sheet-small-label2:nth-child(6) > input:not(.sheet-cssbutton),.charsheet .sheet-Spells .sheet-small-label2:nth-child(6) > input {
    width: -webkit-fill-available;
    font-weight: bold;
    font-size: 1.5rem;
}

.charsheet .sheet-Items .sheet-small-label2:nth-child(6) {
    /*width: -webkit-fill-available;
    max-width: 250px;*/
    flex-grow: 1;
}

.charsheet .sheet-Items textarea[data-i18n-placeholder="short-description"] {
    height: fit-content;
}

.charsheet .repitem input:not([readonly]), .charsheet .repitem textarea, .charsheet .repitem select{
    background: rgba(255, 255, 255, .5)
}

.charsheet .repcontainer .repitem label > span {
    white-space: pre-wrap;
}

.charsheet .sheet-nontable-repeating .sheet-divider-db-lg {
    width: 2% !important;
}

select.sheet-select-small,select[name="attr_ability_type"],select[name="attr_spell_level"] {
    -webkit-appearance: none;
    width: -webkit-fill-available;
}

/*Show/hide arrow on repitems */
.charsheet .repitem .sheet-sect-show+span {
    margin-left: 0 !important;
    position: absolute !important;
    left: .9rem;
    top: .5rem;
}

.charsheet .repitem .sheet-repeating-rollbutton, .charsheet .repitem .sheet-sect-show+span+label[data-i18n-aria-label="toggle-buff"] {
    margin-left: 4rem !important;
}

/*All show/hide sections fit closer together*/
.charsheet .sheet-sect.sheet-expand .sheet-showsect {
    margin-right: auto
}

/*Reverse negative margin order to prevent line-breaks*/
.charsheet .repitem .sheet-sect.sheet-expand .sheet-showarrow {
    margin-right: 0 !important;
}

.sheet-weapon-attributes-showlabel,.sheet-armor-attributes-showlabel,.sheet-iterations-showlabel,.sheet-advmacro-text-showlabel,.sheet-level-showlabel {
    margin-left: -11em !important;
    z-index: 1;
}

.sheet-desc-showlabel,.sheet-macro-text-showlabel,.sheet-extra-damage-showlabel,.sheet-options-showlabel,.sheet-attack-damage-showlabel {
    margin-left: -9em !important;
    z-index: 1;
}

.sheet-id-showlabel,.sheet-misc-showlabel,.sheet-range-showlabel {
    margin-left: -5em !important;
    z-index: 1;
}

/*Expand show/hide section header to accomodate more lines*/
.charsheet .sheet-subnav-hr {
    display: none;
}

.charsheet .repitem .sheet-sect.sheet-expand {
    box-shadow: inset 0px 5rem 10rem 0px #DAE4F2;
    order: 10;
}

.repitem .sheet-Items > div:nth-child(14), .repitem .sheet-Items > label:nth-child(13) {
    order: 1;
}

/*Various fixes*/
span[data-i18n="range-in-feet"] {
    display: none;
}

span[data-i18n="range-custom"] {
    white-space: nowrap !important;
}

.repitem .sheet-sect-show {
    position:absolute !important;
    left: 1rem !important;
    top: .5rem !important;
}

.repitem .sheet-sect-show+span {

}


/* # Used*/
.sheet-Spells label input[type="number"] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    display: inline-block !important;
    width: 2.3em !important;
    min-width: 2.3em !important;
}

.sheet-Spells label input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
}

.sheet-Spells label select {
    -webkit-appearance: textfield;
}

.sheet-Spells label.sheet-narrow-numbers{
    width: min-content;
}

.sheet-Spells .sheet-sect-show:not(:checked)~label.sheet-small-label2 select[name="attr_spell_level"], .sheet-Spells .sheet-sect-show:not(:checked)~label.sheet-small-label2 span[data-i18n="level"], .sheet-minimize-show:checked~.sheet-spells label.sheet-small-label2 select[name="attr_spell_level"], .sheet-minimize-show:checked~.sheet-spells label.sheet-small-label2 span[data-i18n="level"] {
    display:none;
}

.sheet-Spells .sheet-entry-25p.sheet-small-label2 {
    /*width:min-content;*/
    flex-grow: 1;
}

.charsheet .repitem {
    grid-row: auto;
}

.charsheet .repitem[boxheight=NaN] {
    grid-row: footer-start;
}
`);
})();