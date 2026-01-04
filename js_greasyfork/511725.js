// ==UserScript==
// @name         LeG Army filters
// @namespace    https://greasyfork.org/users/722588
// @version      1.8
// @description  Add functional filters in the leader_army page
// @author       Prozyk
// @match        https://www.lordswm.com/leader_army*
// @match        https://www.heroeswm.ru/leader_army*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511725/LeG%20Army%20filters.user.js
// @updateURL https://update.greasyfork.org/scripts/511725/LeG%20Army%20filters.meta.js
// ==/UserScript==


// 1-10: Current factions
// -1: All
// 0: Other
const customBookmarks = {
    '11': { label: 'Lifeless', skills: ['Elemental', 'Undead'] },
    '12': { label: 'Penetrate', skills: ['Ignore defense', 'Lizard charge', 'Poison', 'Venom', 'Harvest Soul'] },
    '13': { label: 'Utility', skills: ['Caster', 'Mirth', 'Confer Luck', 'Aura of bravery', 'Incentive Presence', 'Shield Allies', 'Mana'] },
    '14': { label: 'Shooter', skills: ['Shooter'] }, 
    '15': { label: 'Fast', speed: 8}, // Speed >= 8
    '16': { label: 'Infantry', creatures: ['Warlords', 'Orc warriors', 'Dreadlords', 'Valkyries', 'Pikemen', 'Templars', 'Enforcers', 'Sailor-strangers']}
};

(function() {
    'use strict';
        
    function prettyBookmarks() {
        const bookmarkContainer = document.querySelector('.leader_bookmarks');
        bookmarkContainer.style.width='90px'
        Array.from(bookmarkContainer.children).forEach(child => {
            child.style.width='90px'
        });        
    }
    
    // Add new bookmarks for custom filters
    function addNewBookmarks() {
        const bookmarkContainer = document.querySelector('.leader_bookmarks');
        
        if (!bookmarkContainer) {
            console.error('Bookmark container not found');
            return;
        }

    // Add each bookmark dynamically
    Object.entries(customBookmarks).forEach(function([key, filter]) {
        const newDiv = document.createElement('div');
        newDiv.className = 'bookmark';
        newDiv.id = "bookmark" + key;
        newDiv.bookmark = key; // Bookmark ID  
    
        const span = document.createElement('span');
        span.innerText = filter.label;

        newDiv.appendChild(span);
        bookmarkContainer.appendChild(newDiv);

        // Attach the event listener for filtering
        newDiv.addEventListener('mouseup', applyFilter);
    });

        console.log('New bookmarks added');
    }

    // Function to apply a filter based on skills
    function applyFilter(event) {
        document.getElementById('bookmark'+current_bookmark).classList.add('bookmark');
        document.getElementById('bookmark'+current_bookmark).classList.remove('selected_bookmark');
        current_bookmark = this.bookmark
        document.getElementById('bookmark'+this.bookmark).classList.add('selected_bookmark');
        document.getElementById('bookmark'+this.bookmark).classList.remove('bookmark');
               
        let bookmark = customBookmarks[current_bookmark]
        console.log(bookmark)
        
        let check = `if ((current_bookmark == -1)`;
        
        if ('skills' in bookmark) {
            bookmark.skills.forEach((skill) => {
                skill = skill.toLowerCase()
                check = check + ` || (obj[i]['skills'] && obj[i]['skills'].some(skillItem => skillItem.toLowerCase().includes('${skill}')))`;
            });
        }
                
        
        if ('speed' in bookmark) {
            console.log(bookmark.speed)
            speed = bookmark.speed
            check = check + ` || (obj[i]['skills'] && obj[i]['speed'] >= ${speed})`;
        }
        
        if ('creatures' in bookmark) {
            bookmark.creatures.forEach((creature) => {
                creature = creature.toLowerCase()
                check = check + ` || (obj[i]['skills'] && obj[i]['name'].toLowerCase().includes('${creature}'))`;
            });
        }
        
        check = check + `)`           
//         console.log(check)
        
        var showArmyString = show_army.toString();
//         // Replace the existing race-based filter with a skill-based filter
        showArmyString = showArmyString.replace(
            `if ((current_bookmark == -1)||(obj[i]['race'] == current_bookmark))`,
            check
        );
        let show_army_new = new Function('skip_update', showArmyString.slice(showArmyString.indexOf('{') + 1, -1));
        show_army_new(false);
    }


    addNewBookmarks();
    prettyBookmarks();
})();
