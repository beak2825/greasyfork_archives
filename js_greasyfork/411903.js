// ==UserScript==
// @name         [De Geo Online] Sneller vragen maken script
// @version      1.0
// @description  Maak sneller je vragen met dit script! Geen 10 miljoen knoppen indrukken of steeds je score aan te geven.
// @author       Moodyzoo
// @match        https://edition.thiememeulenhoff.nl/secure/d/stream/geo_e9_hv3/question/*
// @grant        none
// @namespace https://greasyfork.org/users/690187
// @downloadURL https://update.greasyfork.org/scripts/411903/%5BDe%20Geo%20Online%5D%20Sneller%20vragen%20maken%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/411903/%5BDe%20Geo%20Online%5D%20Sneller%20vragen%20maken%20script.meta.js
// ==/UserScript==

window.onload = (event) => {
setInterval(() => {
var but = document.getElementsByClassName("button")[0]

if(but.innerHTML.toString().includes("Volgende opdracht")) {
    but.click()

}


    }, 1000)

    setInterval(() => {
        var but = document.getElementsByClassName("button")[0]


      if(document.getElementById("skip")) return;
        
        if(but.innerHTML.toString().includes("Nakijken")) {

            but.id = "nakijken";

    var div = document.getElementsByClassName("mr-4")[0]
    var btn = document.createElement("button");
    btn.innerHTML = "Geef Voldoende";
    btn.className = "button button--primary"
    btn.setAttribute("onclick", "document.skip()");
    btn.id = "skip"
    div.appendChild(btn);
    but.removeAttribute("disabled")

    var text = document.createElement("input");
    text.className = "exercise-input-extended"
    text.type = "text";
    text.setAttribute("name", "extended_text[text]")
    text.setAttribute("data-decorator", "extended-text")
    text.setAttribute("autocomplete", "off")

    var par = document.getElementsByTagName("textarea")[0].parentNode
    document.getElementsByTagName("textarea")[0].remove()
    par.appendChild(text);
    text.focus()

}
    }, 1000)


    function skip(){
        var but = document.getElementById("nakijken")
        but.click()
        setTimeout(() => {
        var star = document.getElementById("star-3")

        star.click()

            setTimeout(() => {
                var save = document.getElementsByClassName("button")[0]

        save.click()
            }, 5000)


        }, 1000)

    }

    document.skip = skip
}