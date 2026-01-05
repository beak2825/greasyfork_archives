// ==UserScript==
// @name         PracujMapa
// @version      0.1
// @description  Robi mapę pracodawców po wyszukiwaniu ofert pracy.
// @author       trzye
// @grant        none
// @include      https://www.pracuj.pl/praca/*
// @namespace https://greasyfork.org/users/13725
// @downloadURL https://update.greasyfork.org/scripts/29630/PracujMapa.user.js
// @updateURL https://update.greasyfork.org/scripts/29630/PracujMapa.meta.js
// ==/UserScript==

window.addEventListener('load', function() {

    var head = document.head || document.documentElement;

    var script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCz7dmFcFT_n9I2V0Hq7JU8Vd1bql-JGcs&callback=initMap';

    var script2 = document.createElement('script');
    script2.textContent =`

        result = document.getElementsByClassName('offer clearfix block')[0];

    var divMap = document.createElement('div');
    divMap.innerHTML = '*';
    divMap.id= 'map';
    divMap.setAttribute("style","height:500px");

    var button = document.createElement('input');
    button.id = 'submit';
    button.type = 'button';
    button.value = 'pokaż oferty na mapie';

    result.insertBefore(divMap, result[0]);
    divMap.parentNode.insertBefore(button, divMap);

    function httpGetAsync(theUrl, callback)
    {
        var xmlHttp = new XMLHttpRequest();

        theUrl = theUrl.replace("http://", "");
        theUrl = theUrl.replace("https://", "");

        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                callback(xmlHttp.responseText);
        };
        xmlHttp.open("GET", theUrl, true); // true for asynchronous
        xmlHttp.setRequestHeader('Access-Control-Allow-Origin', '*');
        xmlHttp.send(null);
    }

    function getAddress(el) {
        results = el.getElementsByTagName('p');
        for(var i=0; i<results.length; i++){
            console.log(results[i]);
            if(results[i].attributesiitemprop !== undefined){
                if(results[i].attributes.itemprop.value == 'address'){
                    return results[i].innerText;
                }
            }
        }
    }

    function getAddressesList(){

        mainOfferList = document.getElementsByClassName('o-list_item_link');

        var companies = [];

        for(var i = 0; i < mainOfferList.length ; i++) {
            if(mainOfferList[i].attributes.itemprop !== undefined){
                var company = {
                    name : mainOfferList[i].textContent,
                    link : mainOfferList[i].firstElementChild.attributes.href.value,
                    address : mainOfferList[i].textContent
                };
                var isNewCompany = true;
                for(var j = 0; j < companies.length ; j++) {
                    if(companies[j].name == company.name){
                        isNewCompany = false;
                    }
                }
                if(isNewCompany){
                    companies.push(company);
                }
            }
        }

        for(i = 0; i < companies.length; i++){
            console.log(companies[i].link);
            if(companies[i].link.search("http") > -1){
                if(companies[i].link.search("https") > -1){
                    httpGetAsync(companies[i].link, function(result){

                        var htmlObject = document.createElement('div');
                        htmlObject.innerHTML = result;
                        var someAddress = getAddress(htmlObject);
                        if(someAddress !== undefined)
                            companies[i].address = someAddress;

                        console.log(companies[i]);
                    });
                    continue;
                }
            }
            companies.splice(i, 1);
        }

        return companies;
    }

    function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 8,
            center: {lat: -34.397, lng: 150.644}
        });

        var addresses = getAddressesList();

        document.getElementById('submit').addEventListener('click', function() {
            for(var i = 0; i < addresses.length; i++){
                var geocoder = new google.maps.Geocoder();
                var tofind = addresses[i].address;
                geocodeAddresses(geocoder, map, tofind, addresses[i].name );
            }
        });
    }

    function geocodeAddresses(geocoder, resultsMap, address, name) {

        var contentString = name;
        //console.log(contentString);

        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });

        geocoder.geocode({'address': address}, function(results, status) {
            if (status === 'OK') {
                resultsMap.setCenter(results[0].geometry.location);
                var marker = new google.maps.Marker({
                    map: resultsMap,
                    position: results[0].geometry.location
                });

                marker.addListener('click', function() {
                    infowindow.open(map, marker);
                });
            } else {
                //alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }`;


    head.appendChild(script2);
    head.appendChild(script);

    //script2.parentNode.removeChild(script2);
    //script.parentNode.removeChild(script);



}, false);


