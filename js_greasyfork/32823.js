// ==UserScript==
// @name         APA etc. Warner for derstandard.at
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  try to take over the world!(!!)...and warn users if an article on derstandard.at is written by a questionable author
// @author       Csabinho
// @match        *://derstandard.at/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32823/APA%20etc%20Warner%20for%20derstandardat.user.js
// @updateURL https://update.greasyfork.org/scripts/32823/APA%20etc%20Warner%20for%20derstandardat.meta.js
// ==/UserScript==

//TODO for 0.2
//configuration via front end

(function() {
    const re=/\(([^,(]+,)(( [^,(]+,)*) \d{1,2}.\d{1,2}.\d{4}\)/;
    var content=document.getElementsByClassName("copytext")[0].innerHTML;
    console.log(content);

    var warnings= [
    {
        Name: "APA",
        Warning: "Warning! May contain stuff that makes you go nuts!"
    },
    {
        Name: "Andreas Peter Auersberger",
        Warning: "Warning! May contain stuff that makes you go nuts!"
    },
    {
        Name: "gpi",
        Warning: "Kann OK sein, muss aber nicht!"
    },
    {
        Name: "Georg Pichler",
        Warning: "Kann OK sein, muss aber nicht!"
    },
    {
        Name: "fsc",
        Warning: "Highlights aus Fabian Schmids Facebook-Timeline!"
    },
    {
        Name: "Fabian Schmid",
        Warning: "Highlights aus Fabian Schmids Facebook-Timeline!"
    }/*,
        //Test for e.g. http://derstandard.at/2000059939174/Automobil-Weltverband-untersucht-Vettels-Baku-Rempler
    {
        Name: "sid",
        Warning: "Eichhörnchen aus Ice Age!"
    }*/
    ];
    var m=re.exec(content);
    if(m) //if the pattern matches(it should always match! if it doesn't the DOM was changed)
    {
        var authors=[];

        authors[0]=m[1].slice(0,-1); //stripped the colon
        if(m.length == 4) //if the match-array has 4 elements split the "all others part": 0 -> full match(greetings to Captain Obvious), 1 -> first author, 2 -> all others, 3 -> the last author
        {
            var authorsTemp=m[2].split(",");
            for(var i=0;i < authorsTemp.length;i++)
            {
                authors[i+1]=authorsTemp[i].slice(1); //because of the blank
            }
        }
        console.log(authors);
        for(var authorCount = 0; authorCount < authors.length; authorCount++)
        {
            for(var warnCount = 0; warnCount < warnings.length; warnCount++)
            {
                if(authors[authorCount] == warnings[warnCount].Name)
                {
                    document.getElementsByClassName("copytext")[0].innerHTML="<p style=\"background-color: red;\">"+warnings[warnCount].Warning+"</p>"+document.getElementsByClassName("copytext")[0].innerHTML;
                }
            }
        }
    }
})();