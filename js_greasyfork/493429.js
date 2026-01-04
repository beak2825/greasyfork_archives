// ==UserScript==
// @name            WME Standard Suffix Abbreviations
// @description     Check suffix abbreviations without leaving WME (uses Australian mapping standards)
// @version         2025.01.23.01
// @author          Brandon28AU
// @license         MIT
// @match           *://*.waze.com/*editor*
// @exclude         *://*.waze.com/user/editor*
// @grant           none
// @namespace https://greasyfork.org/users/1253347
// @downloadURL https://update.greasyfork.org/scripts/493429/WME%20Standard%20Suffix%20Abbreviations.user.js
// @updateURL https://update.greasyfork.org/scripts/493429/WME%20Standard%20Suffix%20Abbreviations.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const wmessa_approvedAbbr = {"Ally":  "Alley", "App":  "Approach", "Arc":  "Arcade", "Av":  "Avenue", "Bwlk":  "Boardwalk", "Bvd":  "Boulevard", "Brk":  "Break", "Bypa":  "Bypass", "Ch":  "Chase", "Cct":  "Circuit", "Cl":  "Close", "Con":  "Concourse", "Ct":  "Court", "Cr":  "Crescent", "Crst":  "Crest", "Dr":  "Drive", "Ent":  "Entrance", "Esp":  "Esplanade", "Exp":  "Expressway", "Ftrl":  "Firetrail", "Fwy":  "Freeway", "Glde":  "Glade", "Gra":  "Grange", "Gr":  "Grove", "Hwy":  "Highway", "Mwy":  "Motorway", "Pde":  "Parade", "Pwy":  "Parkway", "Psge":  "Passage", "Pl":  "Place", "Plza":  "Plaza", "Prom":  "Promenade", "Qys":  "Quays", "Rtt":  "Retreat", "Rdge":  "Ridge", "Rd":  "Road", "Sq":  "Square", "Stps":  "Steps", "St":  "Street", "Sbwy":  "Subway", "Tce":  "Terrace", "Trk":  "Track", "Trl":  "Trail", "Vsta":  "Vista"};
    const wmessa_suggestedAbbr = {"Alley":  "Ally", "Approach":  "App", "Arcade":  "Arc", "Avenue":  "Av", "Boardwalk":  "Bwlk", "Boulevard":  "Bvd", "Blvd":  "Bvd", "Break":  "Brk", "Bypass":  "Bypa", "Chase":  "Ch", "Circuit":  "Cct", "Close":  "Cl", "Concourse":  "Con", "Court":  "Ct", "Crescent":  "Cr", "Crest":  "Crst", "Drive":  "Dr", "Entrance":  "Ent", "Esplanade":  "Esp", "Expressway":  "Exp", "Firetrail":  "Ftrl", "Freeway":  "Fwy", "Glade":  "Glde", "Grange":  "Gra", "Grove":  "Gr", "Highway":  "Hwy", "Ln": "Lane", "Motorway":  "Mwy", "Parade":  "Pde", "Parkway":  "Pwy", "Passage":  "Psge", "Place":  "Pl", "Plaza":  "Plza", "Promenade":  "Prom", "Quays":  "Qys", "Retreat":  "Rtt", "Ridge":  "Rdge", "Road":  "Rd", "Square":  "Sq", "Steps":  "Stps", "Street":  "St", "Subway":  "Sbwy", "Terrace":  "Tce", "Track":  "Trk", "Trail":  "Trl", "Vista":  "Vsta"};
    const wmessa_knownNoAbbr = ["Lane", "Loop", "Mall", "Mews", "Path", "Ramp", "Rise", "View", "Walk", "Way"];
    let wmessa_valueObserver;


    function wmessa_init() {
        const observer = new MutationObserver((mutationsList, observer) => {
            mutationsList.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.removedNodes.forEach(node => {
                        if (node.classList && node.classList.contains('address-edit-card')) {
                            wmessa_valueObserver.disconnect();
                        }
                    });

                    mutation.addedNodes.forEach(node => {
                        if (node.classList && node.classList.contains('address-edit-card')) {
                            setTimeout(() => {
                                wmessa_monitor(node.querySelector('wz-autocomplete.street-name').shadowRoot.querySelector('wz-text-input'));
                            }, 250);
                        }
                    });
                }
            });
        });
        observer.observe(document.getElementById('edit-panel'), { childList: true, subtree: true });
    }


    function wmessa_monitor(element) {
        let abbrContainer = document.createElement('div');
        abbrContainer.id = 'WMESSA_container';
        abbrContainer.innerHTML =
            '<div class="WMESSA_icon" title="WME Standard Suffix Abbreviations"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" d="M4.5 2A2.5 2.5 0 0 0 2 4.5v2.879a2.5 2.5 0 0 0 .732 1.767l4.5 4.5a2.5 2.5 0 0 0 3.536 0l2.878-2.878a2.5 2.5 0 0 0 0-3.536l-4.5-4.5A2.5 2.5 0 0 0 7.38 2H4.5ZM5 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clip-rule="evenodd" /></svg></div>' +
            '<div id="WMESSA_output">Loading...</div>';
        element.shadowRoot.querySelector('.status-text-container').insertBefore(abbrContainer, element.shadowRoot.querySelector('.status-text-container').firstChild);
        let abbrOutput = abbrContainer.querySelector('#WMESSA_output');

        const css = [
            '.status-text-container {width: calc(100% + ' + (document.querySelector('#edit-panel .address-edit-card .street-name-row .tts-playback') ? document.querySelector('#edit-panel .address-edit-card .street-name-row .tts-playback').offsetWidth : 0) + 'px);}',
            '#WMESSA_container {display: flex; align-items: center; flex-grow: 1; margin-top: var(--wz-label-margin, 8px); padding: 0 2px; border-radius: 5px; background: #ffffff; color: #ffffff; gap: 5px; cursor: default; transition: background 0.25s linear, color 0.25s linear;}',
            '#WMESSA_output {color: #000000;}',
            '.WMESSA_icon {display: inline-flex; padding: 2px; height: 12px; background: rgba(0,0,0,0.5); border-radius: 3px;}',
            '.WMESSA_icon svg {height: 100%;}',
            '#WMESSA_container.info {background: #e0f2fe; color: #e0f2fe;}',
            '#WMESSA_container.check {background: #fef3c7; color: #fef3c7; cursor: pointer;}',
            '#WMESSA_container.check:hover {background: #fde68a; color: #fde68a;}',
            '#WMESSA_container.valid {background: #d1fae5; color: #d1fae5;}'
        ].join(' ');
        $(`<style type="text/css">${css}</style>`).appendTo(element.shadowRoot);

        wmessa_valueObserver = new MutationObserver((mutationsList, observer) => {
            for(let mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
                    wmessa_update(element, abbrContainer, abbrOutput);
                }
            }
        });
        wmessa_valueObserver.observe(element, { attributes: true });

        wmessa_update(element, abbrContainer, abbrOutput);
    }


    function wmessa_update(element, abbrContainer, abbrOutput) {
        abbrContainer.classList.remove('valid', 'check', 'info');
        abbrContainer.onclick = '';
        abbrOutput.innerText = 'Awaiting suffix';

        if (element.value.match(/^The [a-z]+$/i)) {
            // Info | Standards say not to abbreviate 'The x'
            abbrContainer.classList.add('info');
            abbrOutput.innerText = 'Do not abbreviate \'The x\'';
            return;
        }

        let suffixExists = element.value.match(/ ([a-z]+)$/i);
        if (suffixExists) {
            if (wmessa_approvedAbbr[suffixExists[1]]) {
                // Veririfed | Suffix matches an approved abbreviation
                abbrContainer.classList.add('valid');
                abbrOutput.innerText = suffixExists[1] + " for " + wmessa_approvedAbbr[suffixExists[1]];
                return;
            }

            if (wmessa_knownNoAbbr.includes(suffixExists[1])) {
                // Veririfed | Suffix matches an approved non-abbreviated suffix
                abbrContainer.classList.add('valid');
                abbrOutput.innerText = suffixExists[1];
                return;
            }

            let suffixRegex = new RegExp(`^${suffixExists[1]}`, 'i');
            let suffixHasAbbrSuggestion = Object.keys(wmessa_suggestedAbbr).find(key => suffixRegex.test(key));
            if (suffixHasAbbrSuggestion) {
                // Suggest | Possibly typing an approved abbreviation
                abbrContainer.classList.add('check');
                abbrContainer.onclick = function() {element.value = element.value.replace(new RegExp(`${suffixExists[1]}$`), wmessa_suggestedAbbr[suffixHasAbbrSuggestion])};
                abbrOutput.innerText = "Use " + wmessa_suggestedAbbr[suffixHasAbbrSuggestion] + " for " + suffixHasAbbrSuggestion;
                return;
            }

            let suffixHasSuggestion = wmessa_knownNoAbbr.find(key => suffixRegex.test(key));
            if (suffixHasSuggestion) {
                // Suggest | Possibly typing an approved non-abbreviated suffix
                abbrContainer.classList.add('check');
                abbrContainer.onclick = function() {element.value = element.value.replace(new RegExp(`${suffixExists[1]}$`), suffixHasSuggestion)};
                abbrOutput.innerText = "Use " + suffixHasSuggestion;
                return;
            }

            let suffixHasCompletion = Object.keys(wmessa_approvedAbbr).find(key => suffixRegex.test(key));
            if (suffixHasCompletion) {
                // Suggest | Possibly typing a suffix in full which should be abbreviated
                abbrContainer.classList.add('check');
                abbrContainer.onclick = function() {element.value = element.value.replace(new RegExp(`${suffixExists[1]}$`), suffixHasCompletion)};
                abbrOutput.innerText = "Use " + suffixHasCompletion + " for " + wmessa_approvedAbbr[suffixHasCompletion];
                return;
            }

            // Info | Has typed a suffix, but can not be matched to any list
            abbrContainer.classList.add('info');
            abbrOutput.innerText = 'No match found';
        }
    }


    function wmessa_bootstrap() {
        if (typeof W === 'object' && W.userscripts?.state.isReady) {
            wmessa_init();
        } else {
            setTimeout(wmessa_bootstrap, 250);
        }
    }


    wmessa_bootstrap();

})();