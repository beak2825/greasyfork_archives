// ==UserScript==
// @name         AnytimeMailbox CMAR
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Check the address is marked as CMAR by USPS or not
// @author       Rieon Ke
// @license MIT
// @match        https://www.anytimemailbox.com/l/usa/*
// @icon         https://cdn.anytimemailbox.com/portals/home/assets/images/anytime-mailbox-logo-black-anniversary.png
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/476958/AnytimeMailbox%20CMAR.user.js
// @updateURL https://update.greasyfork.org/scripts/476958/AnytimeMailbox%20CMAR.meta.js
// ==/UserScript==



(function() {
    'use strict';
    function get_address(text) {
        const br_expr = /<br\s*\/?>/i;
        const st_segs = text.split(br_expr)
        const city_segs = st_segs[1].trim().split(",")
        const state_segs = city_segs[1].trim().split(" ")
        const addr_st = st_segs[0].trim()
        const addr_city = city_segs[0].trim()
        const addr_state = state_segs[0]
        const addr_zip = state_segs[1]
        return {
            street: addr_st,
            city: addr_city,
            state: addr_state,
            zip: addr_zip
        }
    }

    function query_cmar(addr, cb) {
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://tools.usps.com/tools/app/ziplookup/zipByAddress",
            headers: {
                "accept": "application/json, text/javascript, */*; q=0.01",
                "accept-language": "",
                "cache-control": "no-cache",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "pragma": "no-cache",
                "referrer": "https://tools.usps.com/zip-code-lookup.htm?byaddress",

            },
            data: "companyName=&address1="+addr.street+"&address2=&city="+addr.city+"&state="+addr.state+"&urbanCode=&zip="+addr.zip,
            onload: function(response) {
                console.log(response.responseText);
                const data = JSON.parse(response.responseText)
                if(data.resultStatus == "SUCCESS") {
                    const result = []
                    for (const d of data.addressList) {
                        result.push(d.cmar)
                    }
                    cb(result)
                }

            }
        });
    }

    var items = $(".theme-location-item")

    items.each(function(idx, item) {
        var address_element = $(item).find(".t-addr")
        var address_html = address_element.html().trim()
        var addr = get_address(address_html)
        query_cmar(addr, function(res) {
            const title = $(item).find(".t-title")
            const title_div = $(title)
            title_div.append("<span style='margin-left:10px'>CMAR:<span>")
            const Y_count = res.filter(x => x=='Y').length
            const N_count = res.filter(x => x=='N').length
            if (Y_count == 1) {
                title_div.append("<span style='background: red; padding: 0 4px; color: white; margin: 0 2px'>Y<span>")

            }else if (Y_count > 1) {
                title_div.append("<span style='background: red; padding: 0 4px; color: white; margin: 0 2px'>Yx"+Y_count+"<span>")
            }

            if (N_count == 1) {
                title_div.append("<span style='background: green; padding: 0 4px; color: white; margin: 0 2px'>N<span>")

            }else if (N_count > 1) {
                title_div.append("<span style='background: green; padding: 0 4px; color: white; margin: 0 2px'>Nx"+N_count+"<span>")
            }

        })
    })

})();