// ==UserScript==
// @name         Weer-informatie in reisplanner
// @namespace    http://ns.nl
// @version      0.2
// @description  NS Online Hackathon
// @author       Team 6: Francis, Han, Leon, Maarten, Marco, Serven & Esther
// @match        http://*.ns.nl/reisplanner*
// @grant        GM_xmlhttpRequest
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @connect      buienradar.nl
// @downloadURL https://update.greasyfork.org/scripts/21471/Weer-informatie%20in%20reisplanner.user.js
// @updateURL https://update.greasyfork.org/scripts/21471/Weer-informatie%20in%20reisplanner.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // global constants
    var checkForReloadIntervalInMilliseconds = 500;
    var library = {
        weatherIcon : {
            dry : '<img style="padding-left: 10px;" height="20" src="http://www.freeiconspng.com/uploads/sun-icon-14.png" title="Droog"/>',
            raining : '<img style="padding-left: 10px;" height="20" src="http://www.freeiconspng.com/uploads/rain-cloud-icon-5.png" title="Regen"/>'
        },
        bannerUrl : {
            dry : 'https://www.ns.nl/webshop/nieuwproduct?product=OFI&reisklasse=U&contractduur=DRLP&returnurl=http%3A%2F%2Fwww2.ns.nl%2Fdeur-tot-deur%2Fov-fiets%2Fonline-abonnee-worden.html',
            raining : 'https://www.nszonetaxi.nl/inloggen'
        },
        bannerImage : {
            dry : 'http://bergsebossen.nl/wp-content/uploads/2014/08/Lunch-4-MB-50.jpg',
            raining : 'http://www.taxipro.nl/wp-content/uploads/2015/10/zonetaxi.jpg'
        },
        bannerText : {
            dry : 'Ook gezond op de fiets?',
            raining : ' <strong>Droog aankomen?</strong>'
        },
        buttonText : {
            dry : 'Reserveer een fiets',
            raining : 'Boek een rit'
        }
    };

    // global variables
    var weather, done, bannerUrl, bannerImage, bannerText, buttonText, weatherIcon;

    $(document).ready(function () {
        // initial call
        goTeamSix();

        // check every X milliseconds whether or not the page has been reloaded
        setInterval(function () {
            // if the Milieu Centraal widget is visible, the script should be executed again
            if ($(".rp-carbonDisclaimer").is(':visible')) {
                goTeamSix();
            }
        }, checkForReloadIntervalInMilliseconds);
    });

    function goTeamSix() {
        // global var 'done' is used to prevent multiple icons/banners being shown
        done = false;

        // hide Milieu Centraal widget - this is also used to check whether or not the page has been reloaded
        $(".rp-carbonDisclaimer").hide();

        // get destination and replace spaces with + signs so it can be used in the url for the Google Maps API
        var destination = $(".rp-Stop.rp-Stop--last .rp-Stop__name").text().replace(" ", "+");
        if ('' !== destination.trim()) {
            /*
             * The following commented section was used in the demo to simulate a destination where it's always raining
             *
            if ('Groningen' === destination.trim()) {
                weather = 'raining';
                showWeatherRelatedContent();
                return;
            }
             */

            // get the coordinates of the destination from Google Maps API (actually the Geocode API)
            var googleMapsApi = "https://maps.googleapis.com/maps/api/geocode/json?address=" +
                destination +
                "&key=AIzaSyAqIgWwxYzBgJ2u3To-r1Zwe88mBqzR89I"; // API key linked to Leon's Google-account
            $.getJSON(googleMapsApi, function (geoData) {
                if (geoData.results !== null && geoData.results.length > 0) {
                    var lat = geoData.results[0].geometry.location.lat;
                    var lng = geoData.results[0].geometry.location.lng;

                    // Buienradar does not supply data for every minute, so we round the time to 10 minute intervals
                    var time = $(".rp-Stop.rp-Stop--last .rp-Stop__arrivalTime").text();
                    var roundedTime = time.substring(0, 4);

                    // get the weather forecast from Buienradar API
                    GM_xmlhttpRequest({
                        method:             'GET',
                        url:                'http://gps.buienradar.nl/getrr.php?lat=' + lat + '&lon=' + lng,
                        onreadystatechange: function (response) {
                            if (response.readyState != 4) {
                                return;
                            }

                            // use a regex expression to find the weather for the given time
                            var pattern = '(\\d*)\\|' + roundedTime;
                            var regExp = new RegExp(pattern, 'gm');
                            var result = regExp.exec(response.responseText);

                            // write to the console to explain why there is no weather-related content in some cases
                            if(result === null) {
                                console.log('Weather data could not be retrieved for your destination at ' +
                                    time +
                                    '. Only data between now and 2 hours in the future can be retrieved.');
                            }
                            else {
                                // for any result other than '000', we consider it to be raining
                                weather = result[1] == '000' ? 'dry' : 'raining';
                                showWeatherRelatedContent();
                            }
                        }
                    });
                }
            });
        }
    }

    function showWeatherRelatedContent() {
        // global var 'done' is used to prevent multiple icons/banners being shown
        if(!done) {
            // global var 'raining' is used to determine what images/url should be used

            // show weather-icon to the right of the destination
            $(".rp-Stop.rp-Stop--last .rp-Stop__name")
                .append(library.weatherIcon[weather]);

            // show banner above the other banners
            $(".rp-inspire__blocks")
                .prepend('\
            <a class="unlink rp-inspire__block tile tile--banner tile--whiteText is-clickable" href="' +
                    library.bannerUrl[weather] +
                    '" >\
                <div class="tile__backgroundImage">\
                    <img width="685" id="theImg" src="' +
                    library.bannerImage[weather] +
                    '" style="margin-top: -40px;"/>\
                </div>\
                <div class="tile__content">\
                    <div class="tile__bannerContent">\
                          <p><strong>' +
                    library.bannerText[weather] +
                    '</strong></p>\
                    </div>\
                </div>\
                <div class="tile__footer">\
                    <p><span class="button button--arrowRight">\
                    ' +
                    library.buttonText[weather] +
                    '\
                    </span></p>\
                </div>\
            </a>\
        ');

            done = true;
        }
    }

})();