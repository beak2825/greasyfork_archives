// ==UserScript==
// @name         Location Copy Buttons
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds copy and map buttons to Location and Building pages
// @author       You
// @match        https://zayo.my.salesforce.com/a0b*
// @match        https://zayo.my.salesforce.com/a0W*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402119/Location%20Copy%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/402119/Location%20Copy%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var pageURL = window.location.href;
    if (pageURL.search("zayo.my.salesforce.com/a0b") >= 0){ //If this is a "Location" page
        locationPage();
    } else if (pageURL.search("zayo.my.salesforce.com/a0W") >= 0){ //If this is a "Building" page
        buildingPage();
    };

    function locationPage (){

        var fullAddress = $("00N60000001iuHN_ileinner").innerText + ", " + $("00N60000001iuHS_ileinner").innerText + " " + $("00N60000001iuHX_ileinner").innerText + " " + $("00N60000001iuHc_ileinner").innerText;
        var minifiedAddress = document.getElementsByClassName("pageDescription")[0].innerText;

        //Create button to Copy full Address
        var btnCopyAddress = document.createElement("input");
        btnCopyAddress.type = "button";
        btnCopyAddress.name = "✂️ Address";
        btnCopyAddress.value = "✂️ Address";
        btnCopyAddress.style.margin = "3px";
        btnCopyAddress.onclick = function (){
            document.getElementById("phSearchInput").value = fullAddress; //typically, you'd want to create a hidden text field and put the text to be coppied into it, but I don't see the point. This just puts it in the search field at the top of the page
            document.getElementById("phSearchInput").select(); //select all the text in the search field
            document.execCommand("copy"); //Copy the selected text to the clipboard
            document.getElementById("phSearchInput").value = ""; //Clear the search box at the top, like it never happened
        };

        //Create button to copy the SF minified Address
        var btnCopyLocationName = document.createElement("input");
        btnCopyLocationName.type = "button";
        btnCopyLocationName.name = "✂️ Location";
        btnCopyLocationName.value = "✂️ Location";
        btnCopyLocationName.style.margin = "3px";
        btnCopyLocationName.onclick = function (){
            document.getElementById("phSearchInput").value = fullAddress; //typically, you'd want to create a hidden text field and put the text to be coppied into it, but I don't see the point. This just puts it in the search field at the top of the page
            document.getElementById("phSearchInput").select(); //select all the text in the search field
            document.execCommand("copy"); //Copy the selected text to the clipboard
            document.getElementById("phSearchInput").value = ""; //Clear the search box at the top, like it never happened
        };
        //Create button to open Address in Google Maps
        var btnMapAddress = document.createElement("input");
        btnMapAddress.type = "button";
        btnMapAddress.name = "Map It";
        btnMapAddress.value = "🌐 Map";
        btnMapAddress.style.margin = "3px";
        //btnMapAddress.style.backgroundSize = "contain";
        //btnMapAddress.style.backgroundImage = "url(https://www.google.com/images/branding/product/ico/maps_32dp.ico)";
        btnMapAddress.onclick = function (){
            window.open("http://maps.google.com/maps?f=q&source=s_q&hl=en&q=" + fullAddress, "_blank");
        };

        //Add the buttons to the page
        document.getElementsByClassName("pageDescription")[0].appendChild(btnCopyLocationName);
        document.getElementsByClassName("pageDescription")[0].appendChild(btnCopyAddress);
        document.getElementsByClassName("pageDescription")[0].appendChild(btnMapAddress);
    };
    function $ (id){
        return document.getElementById(id);
    };

    function buildingPage (){

        var fullAddress = $("00N60000001igA3_ileinner").innerText + ", " + $("00N60000001ig9n_ileinner").innerText + " " + $("00N60000001igA2_ileinner").innerText + " " + $("00N60000001ig9z_ileinner").innerText;
        var latitude = $("00N60000001ig9s_ileinner").innerText;
        var longitude = $("00N60000001ig9t_ileinner").innerText;

        //Create button to Copy full Address
        var btnCopyAddress = document.createElement("input");
        btnCopyAddress.type = "button";
        btnCopyAddress.name = "✂️ Address";
        btnCopyAddress.value = "✂️ Address";
        btnCopyAddress.style.margin = "3px";
        btnCopyAddress.onclick = function (){
            document.getElementById("phSearchInput").value = fullAddress; //typically, you'd want to create a hidden text field and put the text to be coppied into it, but I don't see the point. This just puts it in the search field at the top of the page
            document.getElementById("phSearchInput").select(); //select all the text in the search field
            document.execCommand("copy"); //Copy the selected text to the clipboard
            document.getElementById("phSearchInput").value = ""; //Clear the search box at the top, like it never happened
        };

        //Create button to Copy Lat/Lon
        var btnCopyLatLon = document.createElement("input");
        btnCopyLatLon.type = "button";
        btnCopyLatLon.name = "✂️ Lat/Lon";
        btnCopyLatLon.value = "✂️ Lat/Lon";
        btnCopyLatLon.style.margin = "3px";
        btnCopyLatLon.onclick = function (){
            document.getElementById("phSearchInput").value = latitude + ", " + longitude; //typically, you'd want to create a hidden text field and put the text to be coppied into it, but I don't see the point. This just puts it in the search field at the top of the page
            document.getElementById("phSearchInput").select(); //select all the text in the search field
            document.execCommand("copy"); //Copy the selected text to the clipboard
            document.getElementById("phSearchInput").value = ""; //Clear the search box at the top, like it never happened
        };

        //Create button to open Address in Google Maps
        var btnMapAddress = document.createElement("input");
        btnMapAddress.type = "button";
        btnMapAddress.name = "Map Address";
        btnMapAddress.value = "🌐 Map Address";
        btnMapAddress.innerHTML = "<img src=\"http://icons.iconarchive.com/icons/custom-icon-design/mono-general-2/24/copy-icon.png\"> Address";
        btnMapAddress.style.margin = "3px";
        //btnMapAddress.style.backgroundSize = "contain";
        //btnMapAddress.style.backgroundImage = "url(https://www.google.com/images/branding/product/ico/maps_32dp.ico)";
        btnMapAddress.onclick = function (){
            window.open("http://maps.google.com/maps?f=q&source=s_q&hl=en&q=" + fullAddress, "_blank");
        };

                //Create button to Open in Google Maps
        var btnMapLotLon = document.createElement("input");
        btnMapLotLon.type = "button";
        btnMapLotLon.name = "Map LatLon";
        btnMapLotLon.value = "🌐 Map Lat/Lon";
        btnMapLotLon.style.margin = "3px";
        btnMapLotLon.onclick = function (){
            window.open("http://maps.google.com/maps?f=q&source=s_q&hl=en&q=" + latitude + ", " + longitude, "_blank");
        };
        document.getElementsByClassName("pageDescription")[0].appendChild(btnCopyAddress);
        document.getElementsByClassName("pageDescription")[0].appendChild(btnMapAddress);
        document.getElementsByClassName("pageDescription")[0].appendChild(btnCopyLatLon);
        document.getElementsByClassName("pageDescription")[0].appendChild(btnMapLotLon);
    };
})();