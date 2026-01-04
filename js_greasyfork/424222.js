// ==UserScript==
// @name         AIdungeon Tag Blacklist
// @namespace    AIDTagBlacklist
// @version      1.1
// @description  Get those scenarios outta here!
// @author       pitaden
// @match        https://play.aidungeon.io/main/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424222/AIdungeon%20Tag%20Blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/424222/AIdungeon%20Tag%20Blacklist.meta.js
// ==/UserScript==

/*
some ideas for me to implement later, maybe:

add a "hard" blacklist, which replaces the desc with "This scenario was blocked due to hard blacklist" or removes the scenario from the list entirely
    sometimes, you don't even want to see what the tag is

add a whitelist, if a scenario has a normal blacklisted tag and a whitelisted tag, it will stay unblocked.
    the scenario will still be blocked for hard blacklist tags.

make an interface in-browser so you don't have to fuck with code to make this work
    the problem is... how the fuck does website design work. how do I do this.
    could try to copy AIdungeon's scenario tagging screen? somehow?

now that I sorta know how javascript works: rewrite ALLLL of this code.
*/

(function() {
    'use strict';

    // full block means the scenario is removed entirely, as if it was never there
    // if it's false, it replaces the scenario with grey text that shows why it was blocked
    var fullBlock = true;

    var blockedTags = [
        "smut",
        "femboy",
        "monstergirl",
        "monster girl",
        "monster girls",
        "monsterboy",
        "monster boy",
        "monster boys",
        "femdom",
        "meme",
        "incest",
        "nnn",
        "milf",
        "dilf",
        "gilf",
        "age gap",
        "age difference",
        "sugar daddy",
        "romance",
        "passionate",
        "impregnation",
        "bondage",
        "dating",
        "degenerate",
        "naked",
        "nude",
        "sex",
        "slut",
        "furry",
        "abuse",
        "yuri",
        "submission",
        "corruption",
        "feminization",
        "slavery",
        "watersports",
        "piss",
        "peeing",
        "horny",
        "lewd",
        "gay", // not nsfw on its own, but i've yet to see a gay scenario that isn't written to be NSFW
        "m/m",
        "waifu",
        "bimbo",
        "transformation",
        "yandere",
        "dick",
        "femsub",
        "petplay",
        "pet play",
        "sempai",
        "senpai",
        "slave",
        "herm",
        "futa",
        "blowjob",
        "edging",
        "porn",
        "arousal",
        "aroused",
        "teasing",
        "tomboy",
        "bestiality",
        "zoophilia",
        "femdom",
        "mommy",
        "succubus",
        "vanilla",
        "rule 34",
        "dumb idiot",
        " x ",
        "slime",
        "vore",
        "drowning",
        "cannibal",
        "pervert",
        "tentacle",
        "living suit",
        "weight",
        "feed",
        "stuffing",
        "bbw",
        "feet",
        "foot",
        "fetish",
        "maledom",
        "submissive",
        "hypnosis",
        "kidnapping"
    ];
    
    // if I remember correctly, this doesn't actually work right now?
    var blockedAuthors = [

    ];

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // There's probably a better way to do this but interval seems to work fine
    setInterval(function() {
        var scenarios = document.getElementsByClassName("css-1dbjc4n r-18u37iz");
        Array.from(scenarios).forEach(function(element, index, array) {
            if(element.checked != "true"){
                blockedTags.forEach(function(a, b, c){
                    var tagText = element.childNodes[0].childNodes[0];
                    //console.log(tagText)
                    if (tagText.innerHTML != undefined){
                        if(b%50 == 0){console.log(tagText)}
                        var tagsHaveBlacklist = tagText.innerHTML.toLowerCase().indexOf(a)>=0 && element.getAttribute('style') == "border-color: rgb(153, 153, 153); border-radius: 20px; border-width: 0.5px; display: flex; margin: 4px; padding: 4px 8px;"
                        if (tagsHaveBlacklist){
                            var scenarioBase = element.parentElement.parentElement.getElementsByClassName("css-18t94o4 css-1dbjc4n r-1loqt21 r-1otgn73 r-1i6wzkk r-lrvibr")[0];
                            var desc = scenarioBase.getElementsByClassName("css-901oao css-cens5h")[0];
                            var title = scenarioBase.childNodes[1];
                            var author = scenarioBase.getElementsByClassName("css-1dbjc4n r-18u37iz")[0].childNodes[0].childNodes[1];
                            if (fullBlock == true){
                                // contributed by thrwaway777
                                element.parentElement.parentElement.style.display = "none"
                            }else{
                                if (element.parentElement.tagsFound == "true"){
                                    desc.innerHTML = desc.innerHTML+", '"+tagText.innerHTML.slice(1,tagText.innerHTML.length)+"'";
                                }
                                else{

                                    element.parentElement.tagsFound = "true";
                                    // To any javascript developers looking at this code:
                                    // sorry.
                                    title.innerHTML = "Blocked";
                                    title.style.color = "rgb(128,128,128)";
                                    title.style.fontSize = "18px";
                                    title.style.marginBottom = "15px";

                                    desc.innerHTML = "This scenario was blocked because of the tag(s) '"+tagText.innerHTML.slice(1,tagText.innerHTML.length)+"'";
                                    desc.style.color = "rgb(128,128,128)"
                                    desc.style.fontSize = "15px"

                                    author.style.display = "none";
                                    author.innerHTML = "[Blocked Author]";
                                    author.style.color = "rgb(128,128,128)"
                                    author.style.fontSize = "15px"

                                    // because the profile picture and tag are still possibly recognizable, scrub those too
                                    scenarioBase.getElementsByClassName("css-1dbjc4n r-18u37iz")[0].childNodes[0].childNodes[0].style.display = "none";
                                    // if there isn't a tag, pretend we don't see the undefined and carry on
                                    try{scenarioBase.getElementsByClassName("css-1dbjc4n r-18u37iz")[0].childNodes[0].childNodes[2].style.display = "none";}catch(err){}

                                    scenarioBase.parentElement.childNodes[1].style.display = 'none'; // hides tags
                                    scenarioBase.parentElement.childNodes[2].style.display = "none"; // hides upload/edit dates
                                    scenarioBase.parentElement.childNodes[3].style.display = "none";
                                }
                            }
                        }
                    }
                });
                element.checked = "true";
            }
        });
        var authors = document.getElementsByClassName("css-901oao css-bfa6kz");
        Array.from(authors).forEach(function(element, index, array) {
            if(element.checked != "true"){
                blockedAuthors.forEach(function(a, b, c){
                    if (element.innerHTML.toLowerCase().indexOf(a.toLowerCase())>=0 && element.getAttribute('style') == "color: rgb(224, 224, 224); font-family: HelveticaNeue-Light, Helvetica, sans-serif, Classic; font-size: 20px; margin-left: 8px;"){

                            var scenarioBase = element.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("css-18t94o4 css-1dbjc4n r-1loqt21 r-1otgn73 r-1i6wzkk r-lrvibr")[0];
                            var desc = scenarioBase.getElementsByClassName("css-901oao css-cens5h")[0];
                            var title = scenarioBase.childNodes[1];
                            var author = scenarioBase.getElementsByClassName("css-1dbjc4n r-18u37iz")[0].childNodes[0].childNodes[1];

                            title.innerHTML = "Blocked";
                            title.style.color = "rgb(128,128,128)";
                            title.style.fontSize = "18px";
                            title.style.marginBottom = "15px";

                            desc.innerHTML = "This scenario was blocked because of the author.";
                            desc.style.color = "rgb(128,128,128)"
                            desc.style.fontSize = "15px"

                            author.style.display = "none";
                            author.innerHTML = "[Blocked Author]";
                            author.style.color = "rgb(128,128,128)"
                            author.style.fontSize = "15px"

                            // because the profile picture and tag are still possibly recognizable, scrub those too
                            scenarioBase.getElementsByClassName("css-1dbjc4n r-18u37iz")[0].childNodes[0].childNodes[0].style.display = "none";
                            // if there isn't a tag, pretend we don't see the undefined and carry on
                            try{scenarioBase.getElementsByClassName("css-1dbjc4n r-18u37iz")[0].childNodes[0].childNodes[2].style.display = "none";}catch(err){}

                            scenarioBase.parentElement.childNodes[1].style.display = "none"; // hides tags
                            scenarioBase.parentElement.childNodes[2].style.display = "none"; // hides upload/edit dates
                            scenarioBase.parentElement.childNodes[3].style.display = "none"; // I forgot what this hides
                    }
                });
                element.checked = "true";
            }
        });
    }, 200);
})();