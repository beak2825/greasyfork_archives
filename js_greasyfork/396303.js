// ==UserScript== 
// @name           Facebook Autopoke
// @author         augesrob
// @description    Automatically pokes back people listed on your home page. Make sure to be on this page https://www.facebook.com/pokes/?notif_t=poke
// @version        Last Updated 2/10/2020
// @include        http://facebook.com/pokes
// @include        https://www.facebook.com/pokes/?notif_t=poke
// @namespace https://greasyfork.org/users/443677
// @downloadURL https://update.greasyfork.org/scripts/396303/Facebook%20Autopoke.user.js
// @updateURL https://update.greasyfork.org/scripts/396303/Facebook%20Autopoke.meta.js
// ==/UserScript==    

var deSuite = 0;
var noPokes = 0;

function poke()
{
    console.log("Calling poke()..")
    
    /* Auto-poke part */
    elt_links = document.getElementsByTagName("a");
    var deSuitePrev = deSuite;
    for (var i = 0 ; i != elt_links.length; i++)
    {
        elt_link = elt_links[i];
        if (elt_link.innerHTML.includes("Poke Back"))
        {
            deSuite++;
            var nbPokesDiv = document.getElementById("nb_pokes_div");
            nbPokesDiv.innerHTML = parseInt(nbPokesDiv.innerHTML) +1;
            elt_link.click();
        }
    }
    
    /* Make it more real */
    if (deSuitePrev == deSuite)
    {
        noPokes++;
    }
    else
    {
        noPokes = 0;
    }
    
    if (deSuite == 0)
    {
        console.log("Calling poke().. (0)")
        setTimeout(poke, 1000+Math.round(Math.random()*600000));
    }
    else if (deSuitePrev == deSuite && noPokes > 5)
    {
        console.log("Calling poke().. (1)")
        setTimeout(poke, 1000+Math.round(Math.random()*120000));
        deSuite = 0;
    }
    else if (deSuite <= 6)
    {
        console.log("Calling poke().. (2)")
        setTimeout(poke, 1000+Math.round(Math.random()*30000));
    }
    else if (deSuite >= 50)
    {
        console.log("Calling poke().. (3)")
        setTimeout(poke, 1000+Math.round(Math.random()*120000));
    }
    else
    {
        console.log("Calling poke().. (4)")
        setTimeout(poke, 1000);
    }
}

var nbPokesDiv = document.createElement("div");
nbPokesDiv.id = "nb_pokes_div";
nbPokesDiv.innerHTML = "0";
nbPokesDiv.style.position = "fixed";
nbPokesDiv.style.zIndex = "999";
nbPokesDiv.style.left = "3px";
nbPokesDiv.style.top = "42px";
nbPokesDiv.style.width = "25px";
nbPokesDiv.style.textAlign = "center";
nbPokesDiv.style.border = "1px #5555ff solid";
nbPokesDiv.style.color = "#5555ff";
nbPokesDiv.style.backgroundColor = "#ffffff";
nbPokesDiv.style.fontSize = "0.7em";
document.body.appendChild(nbPokesDiv);

poke();
