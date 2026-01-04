// ==UserScript==
// @name         Item Labels
// @name:fr      Libellé des éléments
// @namespace    http://tampermonkey.net/
// @version      0.1.2.3
// @description  Show items labels in Wikidata Query Service web results view in the navigator user language without calling the Label Service in the sparql code
// @description:fr  Montre les libellés en anglais des éléments à coté de leur identifiant Q dans les résultats de recherche sans avoir à faire appel au service de libellé dans la requête, pour le Wikidata Query service.
// @author       TomT0m
// @match        https://query.wikidata.org/
// @match        https://commons-query.wikimedia.org/
// @grant        none
// @license      Creative Commons CC0 1.0 Universal
// @downloadURL https://update.greasyfork.org/scripts/434682/Item%20Labels.user.js
// @updateURL https://update.greasyfork.org/scripts/434682/Item%20Labels.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const base_url="http://www.wikidata.org/"
    const entity_prefix = base_url + "entity/"
    
    let lang="en"

    if (navigator.language) {
        lang = navigator.language.split(/-/)[0];
    }


    function gen_wdapi_queryurl(ids){
        let api = "https://www.wikidata.org/w/api.php?"

        var searchParams = new URLSearchParams("");
        searchParams.set("action","wbgetentities")
        searchParams.set("sites","wikidatawiki")
        searchParams.set("ids",ids)
        searchParams.set("props", "labels")

        searchParams.set("languages", lang)
        searchParams.set("format","json")
        searchParams.set("origin","*")
        return api + searchParams.toString()
    }

    function listifyReqJson(json) {
        return Object.entries(json.entities)
            .filter(([k, v] , i) => v.labels[lang] ) // keep only entities with an actual label in language
            .map( ([k, v] , i) => [k, v.labels])
    }

    function render_label(label){
        return $("<span/>", {
            "lang":label.language
        }).append(document.createTextNode(label.value));
    }
    const lclass = "itemLabels-labellized";
    const queried_class = "itemLabels-queried";

    function LabellizeQitems () {

        let links = $( '#query-result' ).find( `a.item-link:not(.${queried_class})` )

        if (!links.length){return}
        if (links.attr("checked")) {return}

        links.addClass(queried_class)

        let ids = links.map(
            (o, v) => { if(/\/entity\/(.*)$/.exec(v.href)){
                return /\/entity\/(.*)$/.exec(v.href)[1]}
                       else {return "K" }
                      }
        ).filter((k,v) => v[0]=="Q")
        .toArray()

        let plop = ""

        while( ids.length > 0){
            fetch(gen_wdapi_queryurl(ids.splice(0,50).join("|")))
                .then(
                response => response.json()
            ).then(json => listifyReqJson(json).forEach(
                ([k, labels]) => {
                    let link=$(`.item-link[href='${entity_prefix}${k}']:not(.${lclass})`)
                    link.append(" – ").append(render_label(labels[lang]))
                    link.addClass(lclass)
                }
            )
                  )
        }

    }
    setInterval(LabellizeQitems, 3000);
})(window.$)