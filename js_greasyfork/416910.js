// ==UserScript==
// @name         Dark fotka
// @namespace    dark_fotka
// @version      0.1
// @description  Dark theme for fotka.com
// @match        https://fotka.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/416910/Dark%20fotka.user.js
// @updateURL https://update.greasyfork.org/scripts/416910/Dark%20fotka.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let is_dark = false;

    function add_global_style(css) {
        let head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    function makeHttpObject() {
        try {return new XMLHttpRequest();}
        catch (error) {}
        try {return new ActiveXObject("Msxml2.XMLHTTP");}
        catch (error) {}
        try {return new ActiveXObject("Microsoft.XMLHTTP");}
        catch (error) {}

        throw new Error("Could not create HTTP request object.");
    }

    function load_styles(){
        var request = makeHttpObject();
        request.open("GET", "https://gist.githubusercontent.com/Mativve/52f85ad27161ef32642760a3cc52e043/raw/1af12ad52227b1bcd6d538b7983b9405ce381f04/fotka_dark.min.css", true);
        request.send(null);
        request.onreadystatechange = function() {
            if (request.readyState == 4){ add_global_style(request.responseText); }
        };
    }

    function apply_mode(){
        is_dark = GM_SuperValue.get("is_dark");

        if( is_dark != 'true' && is_dark != 'false' ){
            GM_SuperValue.set("is_dark", (is_dark) ? "true" : "false");
            is_dark = GM_SuperValue.get("is_dark");
        }


        console.log("apply_mode", is_dark);

        if( is_dark == "true" ){
            document.body.classList.add("dark");
        }
        else if( is_dark == "false" ){
            document.body.classList.remove("dark");
        }
    }

    function switch_theme(){
        if( is_dark == "true" ){ is_dark = "false"; }else if( is_dark == "false" ){ is_dark = "true"; }

        GM_SuperValue.set("is_dark", is_dark);

        apply_mode();
    }

    function create_float_button(){
        let button_el = document.createElement("button");
        button_el.className = "contrast_float_button";
        button_el.innerHTML = '<img src="//cdn0.iconfinder.com/data/icons/typicons-2/24/adjust-contrast-512.png" alt=""/>';

        document.body.appendChild(button_el);

        button_el.addEventListener('click', function(){ switch_theme(); });
    }

    function init(){
        load_styles();

        create_float_button();

        apply_mode();
    }
    init();
})();