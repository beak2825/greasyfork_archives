// ==UserScript==
// @name         Ghost Trappers Wiki Links
// @version      1.9
// @description  Adds wiki links to Ghost Trappers
// @author       Hazado
// @match        *www.ghost-trappers.com/fb/camp.php*
// @match        *www.ghost-trappers.com/fb/hunt.php*
// @match        *www.ghost-trappers.com/fb/setup.php*
// @match        *www.ghost-trappers.com/fb/ghostphotos*
// @match        *www.ghost-trappers.com/fb/scotch_intern.php*
// @match        *www.ghost-trappers.com/fb/scotch_ninth_floor.php*exhibition*
// @match        *www.ghost-trappers.com/fb/scotch_ninth_floor.php*earnedSkillPoints*
// @match        *www.ghost-trappers.com/fb/scotch_ninth_floor.php*shop*
// @match        *www.ghost-trappers.com/fb/scotch_intern.php*
// @grant        none
// @namespace    https://greasyfork.org/users/149039
// @downloadURL https://update.greasyfork.org/scripts/32379/Ghost%20Trappers%20Wiki%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/32379/Ghost%20Trappers%20Wiki%20Links.meta.js
// ==/UserScript==


//Seperates regex into array
function getMatches(string, regex, index) {
    index || (index = 1); // default to the first capturing group
    var matches = [];
    var match;
    while (match = regex.exec(string)) {
        matches.push(match[index]);
    }
    return matches;
}

if (document.location.href.match(/www.ghost-trappers.com\/fb\/camp.php|www.ghost-trappers.com\/fb\/hunt.php/) !== null) {
    //Loot conversion to Links
    for (i = 0; i < document.querySelectorAll('b').length; i++) {
        if (document.querySelectorAll('b')[i].innerHTML.search('^<br>[0-9]+') === 0)
        {
            var matches = getMatches(document.querySelectorAll('b')[i].innerHTML,/<br>[0-9]+(?: x)? ([a-zA-Z -:()ß]*)/g,0);
            var saved = getMatches(document.querySelectorAll('b')[i].innerHTML,/(<br>[0-9]+(?: x)? )[a-zA-Z -:()ß]*/g,0);
            document.querySelectorAll('b')[i].innerHTML = null;
            for (j = 0; j < matches.length; j++) {
                var a = document.createElement('a');
                a.innerHTML = saved[j]+'<a href="http://wiki.ghost-trappers.com/index.php/'+matches[j].replace(/ \(special\)| \([0-9]+ bonus loot\)|\!|Blueprint: |Molding half: |Schematic: |Diary: |Bait: /,'').replace(/([0-9])-([0-9])/,'$1/$2') +'" target="_blank">'+matches[j]+'</a>';
                while(a.firstChild) {
                    document.querySelectorAll('b')[i].appendChild(a.firstChild);
                }
            }
        }
    }


    //Adds link to ghosts wiki page when clicking on picture in feed
    for (i = 0; i < document.querySelectorAll('div[class*=logText]').length; i++) {
        if (document.querySelectorAll('div[class*=logText]')[i].innerText.match(/You helped your fellow agent/) !== null) {
            document.querySelectorAll('div[class*=logImageOverlay]')[i].outerHTML = '<a href="http://wiki.ghost-trappers.com/index.php/Livefeed_and_assist_loot" target="_blank" >' + document.querySelectorAll('div[class*=logImageOverlay]')[i].outerHTML + '</a>';
        }
        else if (document.querySelectorAll('div[class*=logText]')[i].innerText.match(/Your.*contained:|You've returned from your raid trip|so you had to replace it with another bottle|Unfortunately your bait did not attract any ghost, however you can use it for the next hunt/) !== null) {
        }
        else if (document.querySelectorAll('div[class*=logText]')[i].innerText.match(/You fall through a trap door into|You left the trap door and are back in/) !== null) {
            document.querySelectorAll('div[class*=logImageOverlay]')[i].outerHTML = '<a href="http://wiki.ghost-trappers.com/index.php/Trapdoor" target="_blank" >' + document.querySelectorAll('div[class*=logImageOverlay]')[i].outerHTML + '</a>';
        }
        else if (document.querySelectorAll('div[class*=logText]')[i].innerText.match(/This ghost counts as.*for "Words with ghosts"\. Next letter:/) !== null) {
            document.querySelectorAll('div[class*=logImageOverlay]')[i].outerHTML = '<a href="http://wiki.ghost-trappers.com/index.php/Words_with_ghosts" target="_blank" >' + document.querySelectorAll('div[class*=logImageOverlay]')[i].outerHTML + '</a>';
        }
        else if (document.querySelectorAll('div[class*=logText]')[i].innerText.match(/This ghost counts as.*for "Words with ghosts"\. You can now get your reward at the library./) !== null) {
            document.querySelectorAll('div[class*=logImageOverlay]')[i].outerHTML = '<a href="http://www.ghost-trappers.com/fb/ghost_words.php?page=tradePost" target="_blank" >' + document.querySelectorAll('div[class*=logImageOverlay]')[i].outerHTML + '</a>';
        }
        else if (document.querySelectorAll('div[class*=logText]')[i].innerText.match(/You encountered (?:a|an) .*, but it/) !== null) {
            document.querySelectorAll('div[class*=logImageOverlay]')[i].outerHTML = '<a href="http://wiki.ghost-trappers.com/index.php/' + document.querySelectorAll('div[class*=logText]')[i].innerText.match(/You encountered (?:a|an) (?:frozen |burning )?(.*), but it/)[1] + '" target="_blank" >' + document.querySelectorAll('div[class*=logImageOverlay]')[i].outerHTML + '</a>';
        }
        else if (document.querySelectorAll('div[class*=logText]')[i].innerText.match(/Your friend.*started a hunt for you. You have successfully trapped .*\. The reward/) !== null) {
            document.querySelectorAll('div[class*=logImageOverlay]')[i].outerHTML = '<a href="http://wiki.ghost-trappers.com/index.php/' + document.querySelectorAll('div[class*=logText]')[i].innerText.match(/Your friend.*started a hunt for you. You have successfully trapped (?:a|an) (.*)\. The reward/)[1] + '" target="_blank" >' + document.querySelectorAll('div[class*=logImageOverlay]')[i].outerHTML + '</a>';
        }
        else if (document.querySelectorAll('div[class*=logText]')[i].children[2].innerText.match(/frozen|burning|ghost monster journal/) === null) {
            document.querySelectorAll('div[class*=logImageOverlay]')[i].outerHTML = '<a href="http://wiki.ghost-trappers.com/index.php/' + document.querySelectorAll('div[class*=logText]')[i].children[2].innerText + '" target="_blank" >' + document.querySelectorAll('div[class*=logImageOverlay]')[i].outerHTML + '</a>';
        }
        else if (document.querySelectorAll('div[class*=logText]')[i].children[2].innerText.match(/ghost monster journal/) !== null) {
            document.querySelectorAll('div[class*=logImageOverlay]')[i].outerHTML = '<a href="http://wiki.ghost-trappers.com/index.php/' + document.querySelectorAll('div[class*=logText]')[i].innerText.match(/You encountered (?:a|an) (.*). This/)[1] + '" target="_blank" >' + document.querySelectorAll('div[class*=logImageOverlay]')[i].outerHTML + '</a>';
        }
        else if (document.querySelectorAll('div[class*=logText]')[i].children[2].innerText.match(/frozen|burning/) !== null) {
            document.querySelectorAll('div[class*=logImageOverlay]')[i].outerHTML = '<a href="http://wiki.ghost-trappers.com/index.php/' + document.querySelectorAll('div[class*=logText]')[i].innerText.match(/(?:You encountered|have successfully trapped) (?:a|an) (?:frozen|burning) (.*)(?:, but|\. The)/)[1] + '" target="_blank" >' + document.querySelectorAll('div[class*=logImageOverlay]')[i].outerHTML + '</a>';
        }
    }
}

//Adds links to pictures on setup pages
if (document.location.href.match(/www.ghost-trappers.com\/fb\/setup.php/) !== null) {
    for (i = 0; i < document.querySelectorAll('div[class*=itemHeadline]').length; i++) {
        //document.querySelectorAll('div[class*=itemHeadline]')[i].outerHTML = '<a href="http://wiki.ghost-trappers.com/index.php/' + document.querySelectorAll('div[class*=itemHeadline]')[i].innerText + '" target="_blank" >' + document.querySelectorAll('div[class*=itemHeadline]')[i].outerHTML + '</a>';
        document.querySelectorAll('div[class*=itemImageContainer]')[i].outerHTML = '<a href="http://wiki.ghost-trappers.com/index.php/' + document.querySelectorAll('div[class*=itemHeadline]')[i].innerText.replace(/ \(special\)| \([0-9]+ bonus loot\)|\!|Blueprint: |Molding half: |Schematic: |Diary: |Bait: /,'').replace(/([0-9])-([0-9])/,'$1/$2') + '" target="_blank" >' + document.querySelectorAll('div[class*=itemImageContainer]')[i].outerHTML + '</a>';
    }
}

//Adds links to pictures on ghost pages
if (document.location.href.match(/www.ghost-trappers.com\/fb\/ghostphotos/) !== null) {
    for (i = 0; i < document.querySelectorAll('img').length; i++) {
        if (document.querySelectorAll('img')[i].height == 319) {
            document.querySelectorAll('img')[i].outerHTML = '<a href="http://wiki.ghost-trappers.com/index.php/' + document.querySelectorAll('img')[i].parentNode.parentNode.children[1].children[1].innerText + '" target="_blank" >' + document.querySelectorAll('img')[i].outerHTML + '</a>';
        }
    }
}

//Adds links on Exhibition page and Training Page
if (document.location.href.match(/www.ghost-trappers.com\/fb\/scotch_ninth_floor.php.*exhibition|www.ghost-trappers.com\/fb\/scotch_ninth_floor.php.*earnedSkillPoints/) !== null) {
    for (i = 0; i < document.querySelectorAll('img[title]').length; i++) {
        document.querySelectorAll('img[title]')[i].outerHTML = '<a href="http://wiki.ghost-trappers.com/index.php/' + document.querySelectorAll('img[title]')[i].title + '" target="_blank" >' + document.querySelectorAll('img[title]')[i].outerHTML + '</a>';
    }
}

//Adds links to bar, Qsection, Laboratory and Office
if (document.location.href.match(/www.ghost-trappers.com\/fb\/scotch_intern.php/) !== null) {
    for (i = 0; i < document.querySelectorAll('div').length; i++) {
        if (document.querySelectorAll('div')[i].style.fontWeight == "bold" && document.querySelectorAll('div')[i].style.fontSize == "18px") {
            if (document.querySelectorAll('div')[i].textContent.match(/Recipe/) !== null) document.querySelectorAll('div')[i].parentNode.parentNode.childNodes[1].childNodes[1].childNodes[0].outerHTML = '<a href="http://wiki.ghost-trappers.com/index.php/' + document.querySelectorAll('div')[i].textContent.replace(/Recipe: /,'') + '" target="_blank" >' + document.querySelectorAll('div')[i].parentNode.parentNode.childNodes[1].childNodes[1].childNodes[0].outerHTML + '</a>';
            else document.querySelectorAll('div')[i].parentNode.parentNode.childNodes[1].childNodes[0].outerHTML = '<a href="http://wiki.ghost-trappers.com/index.php/' + document.querySelectorAll('div')[i].textContent.replace(/Mechanism: |Camera: |Magic circle: |Recipe: |Contract: |Bait: /,'') + '" target="_blank" >' + document.querySelectorAll('div')[i].parentNode.parentNode.childNodes[1].childNodes[0].outerHTML + '</a>';
        }
    }
}

//Adds links to Bayoushi shop item titles
if (document.location.href.match(/www.ghost-trappers.com\/fb\/scotch_ninth_floor.php.*shop/) !== null) {
    for (i = 0; i < document.querySelectorAll('div[class*=itemHeadline]').length; i++) {
        document.querySelectorAll('div[class*=itemHeadline]')[i].outerHTML = '<a href="http://wiki.ghost-trappers.com/index.php/' + document.querySelectorAll('div[class*=itemHeadline]')[i].innerText.replace(/ \(special\)| \([0-9]+ bonus loot\)|\!|Blueprint: |Molding half: |Schematic: |Diary: |Bait: /,'').replace(/([0-9])-([0-9])/,'$1/$2') + '" target="_blank" >' + document.querySelectorAll('div[class*=itemHeadline]')[i].outerHTML + '</a>';
    }
}