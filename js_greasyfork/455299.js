

    // ==UserScript==
    // @name           Facebook Autopoke
    // @author         emperor
    // @description    Automatically pokes back people listed on your home page. Make sure to be on this page https://www.facebook.com/pokes/?notif_t=poke
    // @version        Last Updated 23/11/2022
    // @include        http://facebook.com/pokes
    // @include        https://www.facebook.com/pokes/?notif_t=poke
// @namespace https://greasyfork.org/users/986996
// @downloadURL https://update.greasyfork.org/scripts/455299/Facebook%20Autopoke.user.js
// @updateURL https://update.greasyfork.org/scripts/455299/Facebook%20Autopoke.meta.js
    // ==/UserScript==


    var noPokes = 0;
    let num = 0;

    function poke()
    {
        console.log("Calling poke..")

        /* Auto-poke part */
        let elt_links = document.getElementsByTagName("span");
        // var deSuitePrev = deSuite;
        for (var i = 0 ; i != elt_links.length; i++)
        {
            let elt_link = elt_links[i];
            if (elt_link.innerHTML.includes("Poke Back"))
            {
                num++;
                pokes_done();
                elt_link.click();
            }
        }

       


        setTimeout(poke, 1000+Math.round(Math.random()*40000));

    }


	function pokes_done() {
		let newScore = document.getElementById("nb_pokes_div").innerHTML;
		let value = parseInt(newScore) + 1;
		document.getElementById("nb_pokes_div").innerHTML = value;
	};

    let nbPokesDiv = document.createElement("div");
    nbPokesDiv.id = "nb_pokes_div";
    nbPokesDiv.innerHTML = 0;
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

