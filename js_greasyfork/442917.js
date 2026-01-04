// ==UserScript==
// @name         Discord Rainbow Name
// @namespace    http://tampermonkey.net/
// @version      6.9
// @description  A super simple javascript program I've been working on, makes your Discord name change colours!
// @author       Jim Jim
// @match        https://discord.com/channels/*
// @icon         https://www.google.com/s2/favicons?domain=discord.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442917/Discord%20Rainbow%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/442917/Discord%20Rainbow%20Name.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var generatedNumber;

function getname()
{
    return document.querySelector("#app-mount > div.app-3xd6d0 > div > div.layers-OrUESM.layers-1YQhyW > div > div.container-1eFtFS > div > div > div.sidebar-1tnWFu > section > div.container-YkUktl > div.nameTag-sc-gpq.canCopy-IgTwyV > div.colorStandard-21JIj7.size14-3fJ-ot.usernameContainer-3PPkWq > div").textContent;
}

var toggled = false;
document.addEventListener('keydown', function(event){

    if (!toggled && event.which==192){
        event.preventDefault();
        toggled = true;
            var namee = getname().toLowerCase().split('');
        var nameWithSpace = [];
        var finalDisplayNames = [];

        for (var i = 0; i<namee.length; i++)
        {
            nameWithSpace.push(namee[i]);
            nameWithSpace.push(" ");
        }

        //namewithspace: ['s o d m a n']
        for(var ip = 0; ip<nameWithSpace.length; ip+=2)
        {
            nameWithSpace[ip] = nameWithSpace[ip].toUpperCase();
            finalDisplayNames.push(nameWithSpace.join(''));
            nameWithSpace[ip] = nameWithSpace[ip].toLowerCase();
        }

    var r = 50, g = 55, b =55 , counter = 0;
    var rcounter="up", gcounter= "up", bcounter = "up";

    function timekeeper()
    {
        return new Promise(resolve => {setTimeout(function(){resolve(69);}, 50)});
    }

    var word = [];

    async function mane()
    {
        var e = 0;
        var countingstatus = 'up';
        for(;;)
        {
            try{
                var doc = document.querySelector("#app-mount > div.app-3xd6d0 > div > div.layers-OrUESM.layers-1YQhyW > div > div.container-1eFtFS > div > div > div.sidebar-1tnWFu > section > div.container-YkUktl > div.nameTag-sc-gpq.canCopy-IgTwyV > div.colorStandard-21JIj7.size14-3fJ-ot.usernameContainer-3PPkWq > div");
                var doc2 = document.querySelector("#app-mount > div.app-3xd6d0 > div > div.layers-OrUESM.layers-1YQhyW > div > div.container-1eFtFS > div > div > div.sidebar-1tnWFu > section > div.container-YkUktl > div.nameTag-sc-gpq.canCopy-IgTwyV > div.size12-oc4dx4.subtext-2HDqJ7");
                var serverName = document.getElementsByClassName("name-3Uvkvr");
                var channelGroups = document.getElementsByClassName("name-3BUDLf container-q97qHp");
                var channelName = document.getElementsByClassName("title-17SveM base-21yXnu size16-rrJ6ag");
                var dmsName = document.getElementsByClassName("input-1nrc5P");
                counter++
            if (r==250)
            {
                rcounter = "down";
            }
            else if (r == 50)
            {
                rcounter = "up";
            }

            if (g == 255)
            {
                gcounter = "down";
            }
            else if (g == 55)
            {
                gcounter = "up";
            }

            if (b == 255)
            {
                bcounter = "down";
            }
            else if (b == 55)
            {
                bcounter = "up";
            }


            if(counter % 1 == 0)
            {
                if(rcounter == "up")
                {
                    r+= 10;
                }
                else
                {
                    r -= 10;
                }
            }
            if (counter % 2 == 0)
            {
                if (gcounter == "up")
                {
                    g+=5;
                }
                else{
                    g-=5;
                }
            }
            if(counter%3 == 0)
            {
                if(bcounter == "up")
                {
                    b+=5;
                }
                else
                {
                    b-=5;
                }
            }
            if(e==finalDisplayNames.length-1)
            {
                countingstatus="down";
            }
            else if(e == 0)
            {
                countingstatus = "up";
            }

            switch(countingstatus)
            {
                case "up":
                    e++
                    break;
                default:
                    e--;
            }
            doc.textContent=finalDisplayNames[e];
            doc.style.color = "#" + r.toString(16) + g.toString(16) + b.toString(16);
            generatedNumber = Math.round(Math.random()*9999).toString();
            switch(generatedNumber.length)
            {
                case 4:
                    break;
                case 3:
                    generatedNumber = "0"+generatedNumber;break;
                case 2:
                    generatedNumber = "00"+generatedNumber;break;
                default:
                    generatedNumber = "000"+generatedNumber;
            }
            doc2.textContent = "#" + generatedNumber;
            doc2.style.color = "#" + r.toString(16) + g.toString(16) + b.toString(16);
                for(let cum = 0; cum < serverName.length; cum++)
                {
                    for (var i = 0; i<namee.length; i++)
                    {
                        nameWithSpace.push(namee[i]);
                        nameWithSpace.push(" ");
                    }

                    serverName[cum].style.color = "#" + r.toString(16) + g.toString(16) + b.toString(16);
                    serverName[cum].style.fontSize = "large";
                    serverName[cum].style.fontWeight = 900;
                }
                for(var fore = 0; fore<channelGroups.length; fore++)
                {
                    channelGroups[fore].style.fontSize = "large";
                    channelGroups[fore].style.color = "#" + r.toString(16) + g.toString(16) + b.toString(16);
                    channelGroups[fore].style.textWeight = 900;
                }
                for(var counters = 0; counters < channelName.length; counters++)
                {
                    channelName[counters].style.fontSize = "large";
                    channelName[counters].style.color = "#" + r.toString(16) + g.toString(16) + b.toString(16);
                }
                for(let cum = 0; cum<dmsName.length; cum++)
                {
                    dmsName[cum].style.fontSize = "large";
                    dmsName[cum].style.textWeight = 900;
                    dmsName[cum].style.color = "#" + r.toString(16) + g.toString(16) + b.toString(16);
                }
            await timekeeper();}
            catch
            {

            }
        }
    }
    mane();}
});
})();