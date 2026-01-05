// ==UserScript==
// @name            Open WME in Google Maps
// @description     Opens the current Waze Map Editor view in Google Maps
// @namespace       vaindil
// @version         1.1
// @grant           none
// @include         https://www.waze.com/editor/*
// @include         https://www.waze.com/*/editor/*
// @include         https://beta.waze.com/editor/*
// @include         https://beta.waze.com/*/editor/*
// @exclude         https://www.waze.com/user/*
// @exclude         https://www.waze.com/*/user/*
// @author          vaindil
// @downloadURL https://update.greasyfork.org/scripts/12969/Open%20WME%20in%20Google%20Maps.user.js
// @updateURL https://update.greasyfork.org/scripts/12969/Open%20WME%20in%20Google%20Maps.meta.js
// ==/UserScript==

console.log("WMEGM BEGINNING");

var icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAFV0lEQVRIx32VX4xdVRnFf9/+c+69c2fuzDh25s6UWErHzgy0U6CIYG0pA4HyQh0TE31RE/pQNKQSNTxpNP558qGaVkVq0gaiCRDAKGYCFGKMmGqHAkI0rSWxGirQznXamfvvnL0/H+6dO3fGxH3OyTl7J2fttda39t6y5ekv9UgaH1HVQwb6FaV9oyiqCqzrK0SUnmbgrotNZs8vsflqEycGenowvaW6Ha2+4DYuH3CSxkeM8k0QFEXa7//XAspAI/LdUxVuu7hEQyIBIaqi1SqxspDX+uj9agtPOFU9RBdoM6TUQwZAYi1ObFtBe1KFgPCdPy9w03tLVC2gghFBY1tpjGTvv4vJXzPjOrYAOeN5eHo/n986g4jw47ef59G358g0dpQpsPODBlsv1QjSGl3KIueuLFNKHJsKOYwAIRAqV5xbsaUZUh6e3s/esW08+PufsJzWKNiEWmjijev4rwJbFhvkQ2wpjsoL/15gsZkSVZkZHuDaYh4VIV69ikFBVamHjC9O3MUP3niOF/91hs+N38F9H7mFr+6YpRmzNTVwEURbfjVCJI2KE0EEFtOASLtWsRmMthMCEIkdpplmTAxu5NPX3U4as9U0ReX9vKFpWij9iWVTMU9ihEHv+WhfnqggMVIf3mjdiv+JtRz/20m+vmOWECNPnf8D37jls/zy3O/wxnXYG+DUUI5FCxsihKjsGipxQ6mHnBG8tByRLOXq9p24FWZOLEff+i2qytHdBzEIj597hRNnX27lu600qDI9mjG4x8BcAAeZKkVrVtOmSnVkjNr4JLL5iQOd0CuQxoxGyFAiifX4TkwhKEwUmjw5dQlD4PLhJvZdAUPbwpVFKVycuY/mjbfSqcHKLM5Yij5H0eXXgFeDsGugzrPTlxlMlFxsEmYnNC30deoDICFwZdN1VLffjDUGo6y9gDU/rDCf+VCNxyb/Q79TRJosmj1UBr8gS7d+nFZsWtZkSY739s3irCVJPEa1ne+uhy5VWVQme1KOTVXob+ezmbuTCp/B+4T6x24n6+trsc8yLt65D5PP46zFOYfpZrrWLmU5g08ONnh2xyVKTsHUobiHdODLlMsbKRQKmNIASzs/gWQp9Q0jNLZM4IxpgbcsWvW/W0UWYWaozs8mK5Ssgq3xq7P7eezNh8j7BO8d5XKZvlxC7bbdxKhUrx1H8gWcc3jvcc6txrS7ZQpTxZSfT1Uo2QgoJ9+5l2NvPICqYaBH2bdd8N4zPDxMQ6E2Pkk2MoZrA1trWwrWW7QchF39dZ7bcYmSi+DqnLywlyPzBwlqCcCJV4W5v0DeQ5IkjI0Mw+Q2dOjDeO/x3mNMC9r2zt74rRUNQeGOwXo8dn2FfqeCq/Gbs7McnT9IM3oERRSiwusXhCzCzZuUGIVk8zj1fAHTLu5KDTp7QGjZEo/fsBB7jTpUeen8vfrTMw9IVIOsHHNdip8+bSj4qPu2IbneXsrex4WFBQkhiLR3PKPaSsvugWr9+ekPQq9Rh6nz4j/2cuS1ByVEu2YlrgaiRerxPzqZe8tSSNCeYtGMjo7GJEnSzt6VKdwzVF86PrVoeyweU9Vfn/sUPzz9EI0s12LeHeHWeloNRIQTrzp+ccpTcFG997ZcLksul6upKmZrMb385PbLoWijh6AvvXOPPnrmAFFN56DsZs26rUXa40+dtvLMvCiqaq11IyMjKVCxf/3+hoEEcze2xssX9tR+NH/Ip9FLd2x1nffdne7JX/+noT8fl64f01xUm+vr6/22/d7XrvkTplaa+/v9Q4fnvzKSBi/rYP4HdP3nqjKR1y7YnFF986bNekTEHf4vYx67NSB7cBcAAAAASUVORK5CYII=';
var zooms = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

function gen_url() {
    var projI=new OpenLayers.Projection("EPSG:900913");
    var projE=new OpenLayers.Projection("EPSG:4326");
    var center_lonlat=(new OpenLayers.LonLat(Waze.map.center.lon,Waze.map.center.lat)).transform(projI, projE);
    lat=Math.round(center_lonlat.lat * 1000000)/1000000;
    lon=Math.round(center_lonlat.lon * 1000000)/1000000;
    return 'https://www.google.com/maps/@'+lat+','+lon+','+zooms[W.map.zoom]+'z';
}

function init() {
    try {
        var element = $('.WazeControlPermalink');
        if ($(element).length) {
            $('.WazeControlPermalink').prepend('<img src="' + icon + '" id="WMEtoGM" alt="GM" style="margin:0 5px 5px 0;cursor:pointer" />');
            $('#WMEtoGM').click(function() {
                window.open(gen_url(), '_blank');
            });
            console.log("WMEGM done");
        } else {
            setTimeout(init, 1000);
        }
    } catch (err) {
        console.log("WMEGM - " + err);
        setTimeout(init, 1000);
    }
}

init();