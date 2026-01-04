// ==UserScript==
// @name         Panel+
// @namespace    http://tampermonkey.net/
// @version      0.3.2
// @description  Balises supplémentaires
// @author       Laïn
// @match        https://www.dreadcast.net/Forum/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/536750/Panel%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/536750/Panel%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addCustomButtons() {
        const zoneReponse = document.getElementById('zone_reponse');
        const zoneSmileys = document.getElementById('zone_smileys');
        const textarea = document.getElementById('zone_reponse_text');
        const originalButtonsContainer = document.getElementById('zone_modif_texte');

        if (!zoneReponse || !textarea || !originalButtonsContainer) {
            console.log('Panel+: Essential elements not found.');
            return;
        }

        if (document.getElementById('custom_editor_row')) {
            console.log('Panel+: Already initialized.');
            return;
        }

        const buttonsToAdd = [
            { label: 'T', open: '[titre]', close: '[/titre]' },
            { label: 'S-T', open: '[sous-titre]', close: '[/sous-titre]' },
            { label: '⬍', open: '[taille=VALEUR]', close: '[/taille]' },
            { label: 'Inv', open: '[invisible]', close: '[/invisible]' },
            { label: 'Cod', open: '[code]', close: '[/code]' },
            { label: '←', open: '[gauche]', close: '[/gauche]' },
            { label: '→', open: '[droite]', close: '[/droite]' },
            { label: 'C', open: '[c=]', close: '[/c]' },
        ];

        const originalContainerCS = window.getComputedStyle(originalButtonsContainer);
        const textareaCS = window.getComputedStyle(textarea);

        Object.assign(originalButtonsContainer.style, {
            display: 'flex', flexDirection: 'column', alignItems: 'stretch',
            margin: '0', marginLeft: '0px', 
            padding: originalContainerCS.padding, boxSizing: 'border-box',
            backgroundColor: originalContainerCS.backgroundColor, border: originalContainerCS.border,
            overflowY: 'hidden', flexShrink: '0',
        });
        for (const child of originalButtonsContainer.children) {
            if (child.classList && child.classList.contains('link')) {
                Object.assign(child.style, {display:'block', float:'none', position:'static', boxSizing: 'border-box'});
            }
        }

        const newCustomButtonsColumn = document.createElement('div');
        newCustomButtonsColumn.id = 'dc_custom_buttons_column';
        Object.assign(newCustomButtonsColumn.style, {
            display: 'flex', flexDirection: 'column', alignItems: 'stretch',
            margin: '0', padding: originalContainerCS.padding,
            backgroundColor: originalContainerCS.backgroundColor, border: originalContainerCS.border,
            boxSizing: 'border-box', overflowY: 'hidden', flexShrink: '0',
            order: '0'
        });

        const buttonsWrapper = document.createElement('div');
        buttonsWrapper.id = 'dc_extended_buttons_wrapper';
        Object.assign(buttonsWrapper.style, {
            display: 'flex', flexDirection: 'row', alignItems: 'stretch',
            marginLeft: '8px',
            flexShrink: '0', boxSizing: 'border-box'
        });
        buttonsWrapper.appendChild(originalButtonsContainer);
        buttonsWrapper.appendChild(newCustomButtonsColumn);


        const sHeight = '19px';
        const sMarginBottom = '2px';
        const sLineHeight = '19px';

        let sPadding = '0px 5px';
        let sFontSize = '14px';
        let sFontFamily = 'Verdana,"Trebuchet MS",Arial,sans-serif';
        let sColor = '#005ba3';
        let sBgColor = 'transparent';

        const sampleOriginalButton = originalButtonsContainer.querySelector('.link');
        if(sampleOriginalButton){
            const sbs = getComputedStyle(sampleOriginalButton);
            sColor = sbs.color;
            sFontFamily = sbs.fontFamily;
            sPadding = sbs.paddingLeft === sbs.paddingRight ? sbs.paddingTop + " " + sbs.paddingLeft : sbs.padding;
        }


        buttonsToAdd.forEach(btnData => {
            const newButton = document.createElement('div');
            newButton.className = 'link infoAide';
            newButton.innerHTML = btnData.label;
            Object.assign(newButton.style, {
                height: sHeight,
                textAlign: 'center',
                marginBottom: sMarginBottom,
                cursor: 'pointer',
                color: sColor,
                padding: sPadding,
                lineHeight: sLineHeight,
                fontSize: sFontSize,
                fontFamily: sFontFamily,
                backgroundColor: sBgColor,
                border: 'none',
                boxSizing: 'border-box',
                display: 'block',
                width: '100%'
            });
            if (typeof forum !== 'undefined' && typeof forum.addDCCode === 'function') {
                newButton.onclick = btnData.close ? () => forum.addDCCode(btnData.open, btnData.close) : () => forum.addDCCode(btnData.open);
            } else {
                newButton.onclick = () => alert('Erreur: forum.addDCCode non trouvée.');
            }
            newCustomButtonsColumn.appendChild(newButton);
        });

        const editorRow = document.createElement('div');
        editorRow.id = 'custom_editor_row';
        Object.assign(editorRow.style, {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: '5px'
        });

        const taComputedHeightVal = parseFloat(textareaCS.height);
        const taLineHeightVal = parseFloat(textareaCS.lineHeight) || 18;
        let initialTextareaHeight = (isNaN(taComputedHeightVal) || taComputedHeightVal < taLineHeightVal * 3) ? (taLineHeightVal * 5) + 'px' : textareaCS.height;
        let minTextareaHeight = (parseFloat(textareaCS.minHeight) > parseFloat(initialTextareaHeight)) ? textareaCS.minHeight : initialTextareaHeight;

        Object.assign(textarea.style, {
            flexGrow: '1',
            flexShrink: '1',
            boxSizing: 'border-box',
            minWidth: '150px',
            paddingTop: textareaCS.paddingTop, paddingBottom: textareaCS.paddingBottom,
            paddingLeft: textareaCS.paddingLeft, paddingRight: textareaCS.paddingRight,
            border: textareaCS.border, margin: textareaCS.margin,
            height: initialTextareaHeight,
            minHeight: minTextareaHeight
        });

        if (zoneSmileys) {
            const smileysCS = window.getComputedStyle(zoneSmileys);
            Object.assign(zoneSmileys.style, {
                flexShrink: '0',
                marginRight: '8px',
                boxSizing: 'border-box',
                overflowY: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: smileysCS.padding,
                backgroundColor: smileysCS.backgroundColor,
                border: smileysCS.border
            });
        }

        const posterButton = zoneReponse.querySelector('.bouton.poster');
        if (posterButton) {
            zoneReponse.insertBefore(editorRow, posterButton);
        } else {
            zoneReponse.appendChild(editorRow);
        }

        if (zoneSmileys) {
            editorRow.appendChild(zoneSmileys);
        }
        editorRow.appendChild(textarea);
        editorRow.appendChild(buttonsWrapper);

        setTimeout(() => {
            if (!originalButtonsContainer.offsetParent) { 
                console.log('Panel+: Original buttons container not visible for sizing.');
                return;
            }

            const determinedWidth = originalButtonsContainer.offsetWidth + 'px';
            originalButtonsContainer.style.width = determinedWidth;
            newCustomButtonsColumn.style.width = determinedWidth;

            const determinedHeight = Math.max(originalButtonsContainer.offsetHeight, newCustomButtonsColumn.offsetHeight) + 'px';

            originalButtonsContainer.style.height = determinedHeight;
            newCustomButtonsColumn.style.height = determinedHeight;
            buttonsWrapper.style.height = determinedHeight;

            textarea.style.height = determinedHeight;
            textarea.style.minHeight = determinedHeight;

            if (zoneSmileys && zoneSmileys.offsetParent) {
                zoneSmileys.style.height = determinedHeight;
            }
        }, 500);
    }

    function safeAddCustomButtons() {
        try {
            addCustomButtons();
        } catch (e) {
            console.error('Panel+ Error:', e);
        }
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(safeAddCustomButtons, 700);
    } else {
        window.addEventListener('DOMContentLoaded', () => setTimeout(safeAddCustomButtons, 700));
    }

})();