// ==UserScript==
// @name         MyFigureCollection+
// @namespace    https://github.com/awhitetiger/myfigurecollectionplus
// @version      0.1
// @description  Makes MFC Great Again!
// @author       OwO
// @include      https://myfigurecollection.net/*
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/37334/MyFigureCollection%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/37334/MyFigureCollection%2B.meta.js
// ==/UserScript==

//Settings//
var profileHomepage = false; //Do you want to change your profile to your MFC homepage?
var globalBG = true; //Do you want a custom background for all pages?
var BGUrl = "https://i.imgur.com/nDfpzDB.jpg"; //If so what is it?
var profileBG = false; //Do you want the global background to overwrite your profiles?
//End of Settings//

//Changes thumbnails of figures in the catalog to full figure
(function() {
    if (window.location.href.includes("item"))
        return false;
    var imgs = document.getElementsByTagName("img");
    for (i = 0; i < imgs.length; i++) {
        var slug = imgs[i].src;
        if(slug.includes("/figure/")){
            //var newSlugLarge = [slug.slice(0, 49), "/large", slug.slice(49)].join(''); --Really weird, some figures have a large verison where others don't, however, every product has a "Big" Version.
            var newSlugBig = [slug.slice(0, 49), "/big", slug.slice(49)].join('');
            imgs[i].src = newSlugBig;
        }
    }
})();

//Kinda dumb function, makes it so you automatically go to your profile if you're on the homepage
(function() {
    if (window.location.href == "https://myfigurecollection.net/" && profileHomepage == true) {
        var username = $('.username.desktop').html();
        window.location.href = "https://myfigurecollection.net/profile/" + username;
    }
})();

//background stuff
(function() {
    if (window.location.href.includes("profile") && profileBG == false || globalBG == false)
        return false;
    $('#ref-top').attr("style","background:#eeeeee url("+BGUrl+") no-repeat fixed");
})();

//Price Converter
(function() {
    //Remove convert to USD button & convert.
    var rConvert = document.getElementsByTagName("a");
    for (i = 0; i < rConvert.length; i++) {
        if (rConvert[i].innerHTML == "convert into USD") {
            rConvert[i].innerHTML = "";
            //Converts JPY to USD
            var yPrice = $('.item-price').html().replace("¥","").replace(",","");
            var uPrice = "$" + yPrice * 0.0090;
            $('.item-price').html(uPrice);
        }
    }
})();