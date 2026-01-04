// ==UserScript==
// @name         Inventuren Dortmund Zeitexport
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        https://work2gether.de/Administration/Activities/Hours
// @icon         https://www.google.com/s2/favicons?domain=work2gether.de
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430926/Inventuren%20Dortmund%20Zeitexport.user.js
// @updateURL https://update.greasyfork.org/scripts/430926/Inventuren%20Dortmund%20Zeitexport.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var mapping = {
    "Judith Andrea Reitz": "Judith Reitz",
    "Aliz Kalkó": "Aliz Kalko"
}

function prepHours(){

    var hours = []
    $('.ReactVirtualized__Grid .react-table-row').each((i,e) => {
      hours.push({"name": $(e).children()[1].innerText.trim(), "hours": parseFloat($(e).children()[5].innerText)})
    })

    for (var p in hours) {
      p = hours[p]
      name = p.name
      p.fullName = name.substr(name.indexOf(",")+2)  + " " + name.substr(0, name.indexOf(","))
      if (mapping[p.fullName]){
          p.fullName = mapping[p.fullName]
      }
    }

    var list = prompt("liste").split("\r\n")
    var result = ""

    function convertNumber(numb){
        var t = "" + numb
        t= t.replace(".", ",")
        return t
    }

    for (var l in list) {
      l = list[l].trim()

      var found = null
      for (var p in hours) {
          p = hours[p]
          if (p.fullName == l) {
            found = p
            p.found = true
            break
          }
      }

      result += (found ? convertNumber(found.hours) : "") + "\r\n"
    }

    prompt("Stunden", result)

    var notFound = ""
    for (var p in hours) {
        p = hours[p]
        if (p.found)
            continue

        notFound += p.fullName + "\t" + convertNumber(p.hours)  + "\r\n"
    }

    prompt("Ohne Zuordnung", notFound)
}

var button_ = $('<button>Stundenabgleich</button>')
button_.click(prepHours);
$('#hour-registrations-container').prepend(button_)
})();