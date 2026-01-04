// ==UserScript==
// @name         BTV Scraper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Scrapes all Btv leagues in vurrent open league
// @author       Beat2er
// @match        *://www.btv.de/de/spielbetriebDisabled/*
// @match        https://widget.btv.de/btvgrpsearch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @run-at       document-end
// @grant        none
// @license MIT
// @require http://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/445391/BTV%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/445391/BTV%20Scraper.meta.js
// ==/UserScript==
let btv_initial_delay = 1000;
let btv_scrape_delay = 3500;

(function() {
    $.noConflict();
    console.log("Hello there!");

    function btv_scraper_main() {

        let league_name1_dom = jQuery('.headline-h2.headline-aleo.z-label');
        let league_name2_doms = jQuery('button.btn-default.dropdown-toggle.z-button');

        let league_name = league_name1_dom.text().trim();

        jQuery(league_name2_doms).each(function() {
            league_name += " " + jQuery(this).text().trim();
        });
        league_name = league_name.trim()
        console.log(league_name);



        let ids_dom = btv_scraper_get_ids_dom();

        let ids_list = [];
        jQuery(ids_dom).each(function() {
            ids_list.push(jQuery(this).text());
        });

        ids_list.sort(function(a, b) {
            return parseInt(a) - parseInt(b);
        });

        if (ids_list.length == 0) return;
        if (isNaN(ids_list[0])) return;
        console.log(ids_list);

        let confirmed = confirm("Diese Liga (" + league_name + ") scrapen?");
        if (!confirmed) return;

        let data = {}; // id => {"link" => url, "teams" => [name1, name2]}

        jQuery(ids_list).each(function() {
            console.log(this)
        });
        btv_scraper_loop_scrape_ids(ids_list, data, league_name); //here it goes on (i hate async shit)
    }

    async function btv_scraper_loop_scrape_ids(ids_list, data, league_name) {
        for (let i = 0; i < ids_list.length; i++) {
            await btv_scraper_screape_id(ids_list[i], data);
        }

        console.log('finished data', data)
        btv_scraper_create_table(data, league_name);
    }

    function btv_scraper_create_table(data, league_name) {
        let t = "<h4>SCRAPED: " + league_name + "</h4>" + "<table><thead><tr><th>Gruppe</th><th>Mannschaft</th></tr></thead><tbody>";
        for (const [key, value] of Object.entries(data)) {
            value['teams'].forEach(element => {
                t += "<tr><td><a href='" + value['link'] + "'>" + key + "</a></td><td>" + element + "</td></tr>"
            });
        }

        t += "</tbody></table>";
        jQuery('.u-section .is-container.z-div .z-div[style^="border"]').append(t);
        console.log(t);
        var a = document.createElement("a");
        a.href = "data:text," + t;
        a.download = league_name + ".html";
        a.click();
    }


    function btv_scraper_get_ids_dom() {
        let container_dom = jQuery('div.slick-track');
        let subontainers_dom = jQuery(container_dom).children(':not(.slick-cloned)');
        let ids_dom = jQuery(subontainers_dom).find('.z-toolbarbutton-content');
        return ids_dom;
    }

    async function btv_scraper_screape_id(id, data) {
        console.log('scraping id ' + id);
        let ids_dom = btv_scraper_get_ids_dom();
        let this_id_dom = null;

        jQuery(ids_dom).each(function() {
            if (jQuery(this).text() == id) this_id_dom = this;
        });
        if (this_id_dom !== null)
            jQuery(this_id_dom)[0].click();

        return new Promise(resolve => {
            setTimeout(function() {
                let url = null;
                let teams = [];
                jQuery('.z-hlayout .z-hlayout-inner .gbmeeting.z-groupbox.z-groupbox-3d').find('.z-toolbarbutton-content').each(function() {
                    teams.push(jQuery(this).text());
                });


                url = jQuery('.z-html').find('a[href^="https://www.btv.de/de/spielbetrieb"]').attr('href');
                data[id] = {"link": url, "teams": teams};
                console.log(data);
                resolve();
            }, btv_scrape_delay);
        });
    }

    setTimeout(function() {
        jQuery('.big-container.z-div').append('<button type="button" class="btn-default z-button" id="btv_scraper_button">Scrape</button>');
        jQuery('#btv_scraper_button').click(btv_scraper_main);
    }, btv_initial_delay);
})();

