// ==UserScript==
// @name:en      SOVA
// @name         SOVA
// @namespace    privat
// @version      3.0
// @description  LOGIN SOVA
// @description:en  LOGIN SOVA
// @author       Romanki
// @match        https://login.sova72.ru/
// @match        https://www.login.sova72.ru/
// @match        https://is.sova72.ru
// @match        https://is.sova72.ru/EditForm/create/type/Flats
// @match        https://www.is.sova72.ru
// @match        https://www.is.sova72.ru/EditForm/create/type/Flats
// @match        https://is.sova72.ru/adobjects/create/id/1
// @match        https://www.is.sova72.ru/adobjects/create/id/1

// @downloadURL https://update.greasyfork.org/scripts/423071/SOVA.user.js
// @updateURL https://update.greasyfork.org/scripts/423071/SOVA.meta.js
// ==/UserScript==

window.onload = function() {
    var currentLocation = window.location.href;
    if (currentLocation == "https://login.sova72.ru/") {
    document.getElementsByName("name")[0].value=" ";
	document.getElementsByName("name")[0].value=" ";
	document.getElementsByName("password")[0].value=" ";
	document.getElementsByName("password")[0].value=" ";
    document.getElementsByClassName("login-button mt-2")[0].click();
    document.getElementsByClassName("login-button mt-2")[0].click();
    }
    if (currentLocation == "https://is.sova72.ru/") {
    document.location.href = "https://is.sova72.ru/EditForm/create/type/Flats";
    }
    if (currentLocation == "https://is.sova72.ru/EditForm/create/type/Flats") {
    document.getElementsByName("type_flat_id")[2].click();
    document.getElementsByName("object_makeup_id")[7].click();
    document.getElementsByName("object_makeup_id")[7].click();
    document.getElementsByName("object_realprice")[0].value="6000";
    document.getElementsByName("object_area_all")[0].value="80";
    document.getElementsByName("area_kitchen")[0].value="15";
    document.getElementsByName("floors_field")[0].value="3";
    document.getElementsByName("object_floor_all")[0].value="35";
    document.querySelectorAll("[data-name='object_send_sms_owner']")[0].click();
    document.querySelectorAll("[data-pos='2']")[0].click();
    document.querySelectorAll("[for='features_131']")[0].click();
    document.querySelectorAll("[for='features_133']")[0].click();
    document.querySelectorAll("[data-pos='3']")[0].click();
    document.getElementsByName("object_region")[2].click();
    document.getElementsByName("object_region")[2].click();
    document.getElementsByName("object_community")[1].click();
    document.getElementsByName("object_community")[1].click();
    document.getElementsByName("object_price")[0].value="5900";
    document.getElementsByName("object_community")[1].click();
    document.getElementsByName("object_community")[3].click();
    document.getElementsByName("object_sourceId")[24].click();
    document.getElementsByName("object_sourceId")[24].click();
    document.getElementById("tab_3").setAttribute('style', 'display: grid; width: 680px');
    document.getElementById("tab3_fields_col1").setAttribute('style', 'display: none');
    document.getElementById("content").setAttribute('style', 'width: 680px');
    document.getElementById("form_wrapper").setAttribute('style', 'width: 680px');
    document.getElementById("pbOverlay").setAttribute('style', 'width: 680px');
    document.querySelector("meta[name=viewport]").setAttribute("content", "width=680");
    document.getElementsByClassName("header-menu")[0].setAttribute('style', 'width: 680px');
    document.getElementsByClassName("uk-sticky")[0].setAttribute('style', 'width: 680px');
    document.getElementsByClassName("uk-sticky-fixed")[0].setAttribute('style', 'width: 680px');


        function sayHi() {
            document.getElementsByName("object_community")[1].click();
            document.getElementsByName("object_community")[1].click();
            document.getElementsByClassName("header-menu")[0].setAttribute('style', 'display: none');
            document.getElementsByClassName("uk-sticky")[0].setAttribute('style', 'display: none');
            document.getElementById("fixed_header").setAttribute('style', 'width: 680px');
            document.getElementById("object_street").setAttribute('style', 'width: 420px; font-size: 26px');
        }
        setTimeout(sayHi, 2000);
    }
    

}
