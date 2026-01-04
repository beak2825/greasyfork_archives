// ==UserScript==
// @name         D&D Beyond Hide Legacy Races/Species and Classes
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Adds The Gunslinger Class, Valda’s Spire of Secrets, and The Crooked Moon Part One to 3rd Party Toggle
// @license      CC BY 4.0
// @author       yeahimliam
// @match        https://www.dndbeyond.com/classes
// @match        https://www.dndbeyond.com/races
// @match        https://www.dndbeyond.com/species
// @downloadURL https://update.greasyfork.org/scripts/506851/DD%20Beyond%20Hide%20Legacy%20RacesSpecies%20and%20Classes.user.js
// @updateURL https://update.greasyfork.org/scripts/506851/DD%20Beyond%20Hide%20Legacy%20RacesSpecies%20and%20Classes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let legacyHidden = true;
    let thirdPartyHidden = true;

    function hideLegacyClasses() {
        const legacyClasses = document.querySelectorAll('#legacy-badge');
        const phb2014Section = Array.from(document.querySelectorAll('.j-collapsible')).find(section =>
            section.textContent.includes("Player's Handbook (2014) / Basic Rules (2014)")
        );

        legacyClasses.forEach(badge => {
            const classCard = badge.closest('.j-collapsible__item');
            if (classCard) {
                classCard.style.display = 'none';
            }
        });

        if (phb2014Section) {
            phb2014Section.style.display = 'none';
        }
    }

    function hideLegacyRaces() {
        const legacyBadges = document.querySelectorAll('#legacy-badge');
        const sections = document.querySelectorAll('.j-collapsible');

        legacyBadges.forEach(badge => {
            const raceCard = badge.closest('.listing-card');
            if (raceCard) {
                raceCard.style.display = 'none';
            }
        });

        sections.forEach(section => {
            const raceCards = section.querySelectorAll('.listing-card');
            const visibleCards = Array.from(raceCards).filter(card => card.style.display !== 'none');
            if (visibleCards.length === 0) {
                section.style.display = 'none';
            }
        });
    }

    function moveFreeRulesContent() {
        const freeRulesSectionClasses = Array.from(document.querySelectorAll('.j-collapsible')).find(section =>
            section.textContent.includes("D&D Free Rules (2024)")
        );
        const phb2024SectionClasses = Array.from(document.querySelectorAll('.j-collapsible')).find(section =>
            section.textContent.includes("Player’s Handbook (2024)")
        );

        if (freeRulesSectionClasses && phb2024SectionClasses) {
            const freeRulesClasses = freeRulesSectionClasses.querySelector('.listing-body ul');
            const phb2024Classes = phb2024SectionClasses.querySelector('.listing-body ul');
            if (freeRulesClasses && phb2024Classes) {
                while (freeRulesClasses.firstChild) {
                    phb2024Classes.appendChild(freeRulesClasses.firstChild);
                }
            }
            freeRulesSectionClasses.style.display = 'none';
        }

        const freeRulesSectionRaces = Array.from(document.querySelectorAll('.j-collapsible')).find(section =>
            section.textContent.includes("D&D Free Rules (2024)")
        );
        const phb2024SectionRaces = Array.from(document.querySelectorAll('.j-collapsible')).find(section =>
            section.textContent.includes("Player’s Handbook (2024)")
        );

        if (freeRulesSectionRaces && phb2024SectionRaces) {
            const freeRulesRaces = freeRulesSectionRaces.querySelector('.listing-body ul');
            const phb2024Races = phb2024SectionRaces.querySelector('.listing-body ul');
            if (freeRulesRaces && phb2024Races) {
                while (freeRulesRaces.firstChild) {
                    phb2024Races.appendChild(freeRulesRaces.firstChild);
                }
            }
            freeRulesSectionRaces.style.display = 'none';
        }
    }

    function moveSelectedClasses() {
        const cleric = document.querySelector('.listing-card[data-collapsible-search*="Cleric"]');
        const fighter = document.querySelector('.listing-card[data-collapsible-search*="Fighter"]');
        const rogue = document.querySelector('.listing-card[data-collapsible-search*="Rogue"]');
        const wizard = document.querySelector('.listing-card[data-collapsible-search*="Wizard"]');
        const barbarian = document.querySelector('.listing-card[data-collapsible-search*="Barbarian"]');

        if (cleric && fighter && rogue && wizard && barbarian) {
            const parent = barbarian.parentElement;
            parent.insertBefore(cleric, barbarian);
            parent.insertBefore(fighter, barbarian);
            parent.insertBefore(rogue, barbarian);
            parent.insertBefore(wizard, barbarian);
        }
    }

    function moveSelectedRaces() {
        const dwarf = document.querySelector('.listing-card[data-collapsible-search*="Dwarf"]');
        const elf = document.querySelector('.listing-card[data-collapsible-search*="Elf"]');
        const halfling = document.querySelector('.listing-card[data-collapsible-search*="Halfling"]');
        const human = document.querySelector('.listing-card[data-collapsible-search*="Human"]');
        const aasimar = document.querySelector('.listing-card[data-collapsible-search*="Aasimar"]');

        if (dwarf && elf && halfling && human && aasimar) {
            const parent = aasimar.parentElement;
            parent.insertBefore(dwarf, aasimar);
            parent.insertBefore(elf, aasimar);
            parent.insertBefore(halfling, aasimar);
            parent.insertBefore(human, aasimar);
        }
    }

function toggleLegacyContent(button) {
    const legacyBadges = document.querySelectorAll('#legacy-badge');
    const legacySections = Array.from(document.querySelectorAll('.j-collapsible')).filter(section =>
        section.textContent.includes("Player's Handbook (2014)") ||
        section.textContent.includes("Basic Rules (2014)") ||
        section.textContent.includes("Volo's Guide to Monsters") ||
        section.textContent.includes("Elemental Evil Player's Companion") ||
        section.textContent.includes("Tortle Package") ||
        section.textContent.includes("Mordenkainen")
    );

    legacyBadges.forEach(badge => {
        const contentCard = badge.closest('.listing-card') || badge.closest('.j-collapsible__item');
        if (contentCard) {
            contentCard.style.display = contentCard.style.display === 'none' ? '' : 'none';
        }
    });

    legacySections.forEach(section => {
        const contentCards = section.querySelectorAll('.listing-card, .j-collapsible__item');
        const visibleCards = Array.from(contentCards).filter(card => card.style.display !== 'none');
        section.style.display = visibleCards.length === 0 ? 'none' : '';
    });

    button.querySelector('.label').style.color = legacyHidden ? 'white' : '#bebfc0';
    legacyHidden = !legacyHidden;
}


    function toggleThirdPartyContent(button) {
        const thirdPartySections = Array.from(document.querySelectorAll('.j-collapsible')).filter(section =>
            section.textContent.includes("Critical Role") ||
            section.textContent.includes("The Illrigger Revised") ||
            section.textContent.includes("Book of Ebon Tides") ||
            section.textContent.includes("Grim Hollow: Player Pack") ||
            section.textContent.includes("Humblewood Campaign Setting") ||
            section.textContent.includes("The Lord of the Rings Roleplaying") ||
            section.textContent.includes("The Griffon’s Saddlebag: Book Two") ||
            section.textContent.includes("Obojima: Tales from the Tall Grass") ||
            section.textContent.includes("Heliana’s Guide to Monster Hunting: Part 1") ||
            section.textContent.includes("The Gunslinger Class: Valda’s Spire of Secrets") ||
            section.textContent.includes("Valda’s Spire of Secrets: Player Pack") ||
            section.textContent.includes("The Crooked Moon Part One: Player Options & Campaign Setting")
        );

        thirdPartySections.forEach(section => {
            section.style.display = section.style.display === 'none' ? '' : 'none';
        });

        button.querySelector('.label').style.color = thirdPartyHidden ? 'white' : '#bebfc0';
        thirdPartyHidden = !thirdPartyHidden;
    }

    function createToggleButton() {
        const button = document.createElement('a');
        button.href = '#';
        button.classList.add('view-rules', 'button-alt', 'characters');
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '1000';
        button.style.width = '180px';
        button.style.height = '36px';
        button.style.lineHeight = '34px';
        button.style.padding = '0 12px';
        button.style.fontSize = '14px';
        button.style.textAlign = 'center';
        button.style.display = 'inline-flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';

        const span = document.createElement('span');
        span.classList.add('label');
        span.textContent = 'Toggle Legacy Content';
        span.style.color = '#bebfc0';

        button.appendChild(span);
        button.addEventListener('click', (e) => {
            e.preventDefault();
            toggleLegacyContent(button);
        });

        document.body.appendChild(button);
    }

    function createThirdPartyToggleButton() {
        const button = document.createElement('a');
        button.href = '#';
        button.classList.add('view-rules', 'button-alt', 'characters');
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '200px';
        button.style.zIndex = '1000';
        button.style.width = '195px';
        button.style.height = '36px';
        button.style.lineHeight = '34px';
        button.style.padding = '0 12px';
        button.style.fontSize = '14px';
        button.style.textAlign = 'center';
        button.style.display = 'inline-flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';

        const span = document.createElement('span');
        span.classList.add('label');
        span.textContent = 'Toggle 3rd Party Content';
        span.style.color = '#bebfc0';

        button.appendChild(span);
        button.addEventListener('click', (e) => {
            e.preventDefault();
            toggleThirdPartyContent(button);
        });

        document.body.appendChild(button);
    }

    function hideThirdPartyContentInitially() {
        const thirdPartySections = Array.from(document.querySelectorAll('.j-collapsible')).filter(section =>
            section.textContent.includes("Critical Role") ||
            section.textContent.includes("The Illrigger Revised") ||
            section.textContent.includes("Book of Ebon Tides") ||
            section.textContent.includes("Grim Hollow: Player Pack") ||
            section.textContent.includes("Humblewood Campaign Setting") ||
            section.textContent.includes("The Lord of the Rings Roleplaying") ||
            section.textContent.includes("The Griffon’s Saddlebag: Book Two") ||
            section.textContent.includes("Obojima: Tales from the Tall Grass") ||
            section.textContent.includes("Heliana’s Guide to Monster Hunting: Part 1") ||
            section.textContent.includes("The Gunslinger Class: Valda’s Spire of Secrets") ||
            section.textContent.includes("Valda’s Spire of Secrets: Player Pack") ||
            section.textContent.includes("The Crooked Moon Part One: Player Options & Campaign Setting")
        );

        thirdPartySections.forEach(section => {
            section.style.display = 'none';
        });
    }

    window.addEventListener('load', () => {
        moveFreeRulesContent();
        hideLegacyClasses();
        hideLegacyRaces();
        hideThirdPartyContentInitially();
        createToggleButton();
        createThirdPartyToggleButton();
        moveSelectedClasses();
        moveSelectedRaces();
    });

})();
