// ==UserScript==
// @name         Realtor Edited
// @namespace    https://fxzfun.com/
// @version      0.1
// @description  adds features to realtor.com
// @author       FXZFun
// @match        https://www.realtor.com/realestateandhomes-search/*
// @grant        GM.xmlHttpRequest
// @require      https://unpkg.com/@turf/turf@6/turf.min.js
// @connect      https://yearbook.wels.net/unitlistProx
// @grant        GM_getValue
// @grant        GM_setValue
// @license      GNU GPL v3
// @downloadURL https://update.greasyfork.org/scripts/462213/Realtor%20Edited.user.js
// @updateURL https://update.greasyfork.org/scripts/462213/Realtor%20Edited.meta.js
// ==/UserScript==

/* global turf, db, results */

(function() {
    'use strict';

    window.results = "";
    window.turf = turf;

    //document.write('<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDuDBm96B82JKMvrKPy1GHuGCRavIXiuLs&amp;callback=initMap" defer=""></script>');
    console.log("started realtor");

    window.db = JSON.parse(GM_getValue("realtor-wels-db", '{}'));

    document.getElementById("srp-body").addEventListener("scroll", () => {
        console.log("scroll");
        nullHouses.forEach(h => {
            var el = document.querySelector("[data-id='" + h.property_id + "'] .cta-wrap");
            if (el != null) {
                console.log("Property now available");
                addChurches(h.location.address.coordinate.lon + "," + h.location.address.coordinate.lat);
                nullHouses.remove(nullHouses.indexOf(h));
            }
        });
    });

    var nullHouses = [];

    function hulkGrabber(response) {
        response.json().then(j => {
            console.log("intercepted...:)");
            results = j?.data?.home_search?.results;
            results?.forEach(r => {
                var p0 = turf.point([r.location.address.coordinate.lon, r.location.address.coordinate.lat]);
                var addedToDb = false;
                Object.keys(db).forEach(key => {
                    var p1 = turf.point(key.split(","));
                    if (turf.distance(p0, p1, {units: 'miles'}) < 1) {
                        db[key].houses.push(r);
                        addedToDb = true;
                    }
                });

                if (!addedToDb) {
                    db[p0.geometry.coordinates.toString()] = {'houses': []};
                    db[p0.geometry.coordinates.toString()].houses.push(r);
                }
            });

            // find churches
            Object.keys(db).forEach(key => { addChurches(key) });
        });
    }

    // add churches based on db key
    function addChurches(key) {
        var point = key.split(",")[1] + "+" + key.split(",")[0];
        if (db[key]?.church == null) {
            GM.xmlHttpRequest({
                method: "POST",
                headers: {
                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                    "content-type": "application/x-www-form-urlencoded",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
                },
                data: "address=" + point + "&proximity=60",
                url: "https://yearbook.wels.net/unitlistProx",
                onload: function(response) {
                    callback(response.responseText, key, "search");
                }
            });
        } else {
            console.log("Already know the church: " + db[key].church.link);
            var church = db[key].church;
            var addHtml = "<div class='cta-wrap'><div class='address'>" + church.link + "</div><div class='address-second'>"+document.querySelector("button.jsx-4154418115.right-button.active > svg").outerHTML + church.distance + "</div></div>";
            db[key].houses.forEach(h => {
                var el = document.querySelector("[data-id='" + h.property_id + "'] .cta-wrap");
                if (el != null) {
                    el.outerHTML = addHtml;
                } else {
                    nullHouses.push(h);
                }
            });
        }
    }

    // intercept requests
    const originalFetch = window.fetch;

    unsafeWindow.fetch = async (...args) => {
        let [resource, config ] = args;
        const response = await originalFetch(resource, config);
        if (resource.includes("hulk")) {
            console.log("intercepting...");
            hulkGrabber(response.clone());
        }
        return response;
    };

    function callback(response, key, page) {
        var responseHTML = document.createElement("html");
        responseHTML.innerHTML = response;

        if (page == "search") {
            var addHtml;
            if (!responseHTML.innerHTML.includes("Your search returned no results")) {
                addHtml = "<div><div class='address'>" + responseHTML.querySelectorAll("tbody tr")[1].querySelector("td").innerHTML.trim().replace("href=\"", "target='_blank' href=\"https://yearbook.wels.net/") + "</div><div class='address-second'>"+document.querySelector("button.jsx-4154418115.right-button.active > svg").outerHTML + responseHTML.querySelectorAll("tbody tr")[1].querySelectorAll("td")[2].innerHTML.trim() + " mi</div></div>";
                db[key].church = {"link": responseHTML.querySelectorAll("tbody tr")[1].querySelector("td").innerHTML.trim().replace("href=\"", "target='_blank' href=\"https://yearbook.wels.net/"),
                              "distance": responseHTML.querySelectorAll("tbody tr")[1].querySelectorAll("td")[2].innerHTML.trim() + " mi"};
            } else {
                addHtml = "<div><div class='address'>None Found</div></div>";
                db[key].church = {"link": "No Churches Found",
                              "distance": ">60 mi"};
            }

            db[key].houses.forEach(h => {
                var el = document.querySelector("[data-id='" + h.property_id + "'] .cta-wrap");
                if (el != null) {
                    el.outerHTML = addHtml;
                } else {
                    nullHouses.push(h);
                }
            });
        } else if (page == "detail") {
            document.querySelector(".rui__aqtg6p-0.jtzgsk").insertAdjacentHTML("beforeend", "<div><div class='address'>" + responseHTML.querySelectorAll("tbody tr")[1].querySelector("td").innerHTML.trim().replace("href=\"", "target='_blank' href=\"https://yearbook.wels.net/") + "</div><div class='address-second'>"+document.querySelector("[data-testid=icon-car]").outerHTML + responseHTML.querySelectorAll("tbody tr")[1].querySelectorAll("td")[2].innerHTML.trim() + " mi</div></div>");
        }

        GM_setValue("realtor-wels-db", JSON.stringify(db));
        console.log("Saved DB");
    }

    function addChurchToListing() {

    }
})();