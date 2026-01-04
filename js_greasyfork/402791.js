// ==UserScript==
// @name         Pardus Faction Voting Auditor
// @namespace    fear.math@gmail.com
// @version      0.1
// @description  Allows you to copy a list of all pilots voting a certain way on the Faction Relations page.
// @author       Math (Orion)
// @match        http*://*.pardus.at/faction_relations.php*
// @downloadURL https://update.greasyfork.org/scripts/402791/Pardus%20Faction%20Voting%20Auditor.user.js
// @updateURL https://update.greasyfork.org/scripts/402791/Pardus%20Faction%20Voting%20Auditor.meta.js
// ==/UserScript==

(function() {
    // First, get the two voter tables
    let spans = document.getElementsByTagName('span');
    
    let dispositionTowardsSpans = [];
    for (let i = 0; i < spans.length; i++) {
        if (spans[i].innerHTML.includes('DISPOSITIONS')) {
            dispositionTowardsSpans.push(spans[i]);
        }
    }
    
    // There should be exactly two voting tables
    if (dispositionTowardsSpans.length != 2) {
        //return;
    }
    
    let voterTables = {};
    
    dispositionTowardsSpans.forEach(span => {
        let factionImageUrl = span.parentElement.parentElement.children[1].firstChild.src;
        
        let faction = 'Unknown Faction';
        
        if (factionImageUrl.includes('fed')) faction = 'Federation';
        if (factionImageUrl.includes('uni')) faction = 'Union';
        if (factionImageUrl.includes('emp')) faction = 'Empire';
        
        let voterTable = span.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
        
        voterTables[faction] = voterTable;
    });
    
    Object.keys(voterTables).forEach(faction => {
        let votes = {
            amicable : [],
            indifferent : [],
            hostile : [],
            unknown : []
        };
        
        let voteImages = voterTables[faction].getElementsByTagName('img');
        
        // Start at the fourth image to skip extraneous uses of the vote images
        for (let i = 4; i < voteImages.length; i++) {
            let vote = 'unknown';
            let voteImageUrl = voteImages[i].src;
            
            if (voteImageUrl.includes('single_minus')) vote = 'amicable';
            if (voteImageUrl.includes('single_neutral')) vote = 'indifferent';
            if (voteImageUrl.includes('single_plus')) vote = 'hostile';
                        
            let name = voteImages[i].parentElement.nextElementSibling;
            
            if (!name) continue;
            
            name = name.firstChild.innerHTML;
            
            votes[vote].push(name);
        }

        console.log('The following pilots are amicable towards the ' + faction + ': ' + votes.amicable.join(', '));
        console.log('The following pilots are indifferent towards the ' + faction + ': ' + votes.indifferent.join(', '));
        console.log('The following pilots are hostile towards the ' + faction + ': ' + votes.hostile.join(', '));
    });
})();