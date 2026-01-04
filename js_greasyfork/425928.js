// ==UserScript==
// @name         Kant C Shit
// @namespace    kantcshit
// @version      0.3
// @description  Adjust brightness and contrast in YouTube Videos, Vimeo, Netflix, HBO, Prime video, or any other site with a video on it
// @author       Adriano Galello
// @homepage     https://gdi3d.github.io/change-youtube-videos-brightness/
// @match        *://www.youtube.com/watch*
// @match        *://www.primevideo.com/detail/*
// @match        *://vimeo.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @compatible chrome
// @compatible firefox
// @compatible opera
// @compatible safari
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/425928/Kant%20C%20Shit.user.js
// @updateURL https://update.greasyfork.org/scripts/425928/Kant%20C%20Shit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // panel with controls for Brightness, Contrast
    // Saturation and Hue using CSS filter property
    // https://developer.mozilla.org/en-US/docs/Web/CSS/filter
    let html = "<link href=\"https://fonts.googleapis.com/icon?family=Material+Icons\"rel=stylesheet><link href=https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css rel=stylesheet media=screen,projection><div style=\"position:fixed;top:80px;right:10px;z-index:99999; display:none\" id=\"open_kantcshit\"><a class=\"waves-effect waves-light btn\" style=\"font-size:2.3em\">🎨</a></div><div style=\"position:fixed;bottom:10px;width:90%;left:50%;margin-left:-45%;background:#fafafa;z-index:9999999;font-size:1em;filter:drop-shadow(2px 4px 6px #000);border-radius:10px\" id=\"panel_kantcshit\"><div class=\"row\"><div class=\"col m3 s2\"><form action=\"#\"><p class=\"range-field\"><label>Brightness <span id=\"br_val\"></span>%</label><input type=\"range\" id=\"br_slider\" min=\"0\" max=\"500\" value=\"100\"><a class=\"waves-effect waves-light btn-small\" id=\"br_reset\"><i class=\"material-icons\">close</i></a></p></form></div><div class=\"col m3 s2\"><form action=\"#\"><p class=\"range-field\"><label>Contrast <span id=\"ct_val\"></span>%</label><input type=\"range\" id=\"ct_slider\" min=\"0\" max=\"500\" value=\"100\"><a class=\"waves-effect waves-light btn-small\" id=\"ct_reset\"><i class=\"material-icons\">close</i></a></p></form></div><div class=\"col m3 s2\"><form action=\"#\"><p class=\"range-field\"><label>Saturation <span id=\"st_val\"></span>%</label><input type=\"range\" id=\"st_slider\" min=\"0\" max=\"500\" value=\"100\"><a class=\"waves-effect waves-light btn-small\" id=\"st_reset\"><i class=\"material-icons\">close</i></a></p></form></div><div class=\"col m2 s2\"><form action=\"#\"><p class=\"range-field\"><label>Hue <span id=\"hue_val\"></span>deg</label><input type=\"range\" id=\"hue_slider\" min=\"0\" max=\"360\" value=\"0\"><a class=\"waves-effect waves-light btn-small\" id=\"hue_reset\"><i class=\"material-icons\">close</i></a></p></form></div><div class=\"col m1 s4\"><p style=\"text-align:center\"><a href=\"http://twitter.com/intent/tweet?source=https%3A%2F%2Fgdi3d.github.io%2Fchange-youtube-videos-brightness&text=Adjust+brightness+and+contrast+in+YouTube+Videos,+Vimeo,+Netflix,+HBO,+Prime+video,+or+any other+site+with+a+video+on+it https%3A%2F%2Fgdi3d.github.io%2Fchange-youtube-videos-brightness\" target=\"_blank\" title=\"Tweet\"><img src=\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTguMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMTEyLjE5NyAxMTIuMTk3IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMTIuMTk3IDExMi4xOTc7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8Y2lyY2xlIHN0eWxlPSJmaWxsOiM1NUFDRUU7IiBjeD0iNTYuMDk5IiBjeT0iNTYuMDk4IiByPSI1Ni4wOTgiLz4KCTxnPgoJCTxwYXRoIHN0eWxlPSJmaWxsOiNGMUYyRjI7IiBkPSJNOTAuNDYxLDQwLjMxNmMtMi40MDQsMS4wNjYtNC45OSwxLjc4Ny03LjcwMiwyLjEwOWMyLjc2OS0xLjY1OSw0Ljg5NC00LjI4NCw1Ljg5Ny03LjQxNwoJCQljLTIuNTkxLDEuNTM3LTUuNDYyLDIuNjUyLTguNTE1LDMuMjUzYy0yLjQ0Ni0yLjYwNS01LjkzMS00LjIzMy05Ljc5LTQuMjMzYy03LjQwNCwwLTEzLjQwOSw2LjAwNS0xMy40MDksMTMuNDA5CgkJCWMwLDEuMDUxLDAuMTE5LDIuMDc0LDAuMzQ5LDMuMDU2Yy0xMS4xNDQtMC41NTktMjEuMDI1LTUuODk3LTI3LjYzOS0xNC4wMTJjLTEuMTU0LDEuOTgtMS44MTYsNC4yODUtMS44MTYsNi43NDIKCQkJYzAsNC42NTEsMi4zNjksOC43NTcsNS45NjUsMTEuMTYxYy0yLjE5Ny0wLjA2OS00LjI2Ni0wLjY3Mi02LjA3My0xLjY3OWMtMC4wMDEsMC4wNTctMC4wMDEsMC4xMTQtMC4wMDEsMC4xNwoJCQljMCw2LjQ5Nyw0LjYyNCwxMS45MTYsMTAuNzU3LDEzLjE0N2MtMS4xMjQsMC4zMDgtMi4zMTEsMC40NzEtMy41MzIsMC40NzFjLTAuODY2LDAtMS43MDUtMC4wODMtMi41MjMtMC4yMzkKCQkJYzEuNzA2LDUuMzI2LDYuNjU3LDkuMjAzLDEyLjUyNiw5LjMxMmMtNC41OSwzLjU5Ny0xMC4zNzEsNS43NC0xNi42NTUsNS43NGMtMS4wOCwwLTIuMTUtMC4wNjMtMy4xOTctMC4xODgKCQkJYzUuOTMxLDMuODA2LDEyLjk4MSw2LjAyNSwyMC41NTMsNi4wMjVjMjQuNjY0LDAsMzguMTUyLTIwLjQzMiwzOC4xNTItMzguMTUzYzAtMC41ODEtMC4wMTMtMS4xNi0wLjAzOS0xLjczNAoJCQlDODYuMzkxLDQ1LjM2Niw4OC42NjQsNDMuMDA1LDkwLjQ2MSw0MC4zMTZMOTAuNDYxLDQwLjMxNnoiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K\" width=\"35\" alt=\"\"></a></p><p style=\"text-align:center\"><a href=\"https://gdi3d.github.io/change-youtube-videos-brightness/\" target=\"_blank\"><img src=\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDQ4IDQ4Ij4KICA8dGl0bGU+Z2l0aHViPC90aXRsZT4KICA8ZyBpZD0iTGF5ZXJfMiIgZGF0YS1uYW1lPSJMYXllciAyIj4KICAgIDxnIGlkPSJpbnZpc2libGVfYm94IiBkYXRhLW5hbWU9ImludmlzaWJsZSBib3giPgogICAgICA8cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIGZpbGw9Im5vbmUiLz4KICAgICAgPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSJub25lIi8+CiAgICA8L2c+CiAgICA8ZyBpZD0iaWNvbnNfUTIiIGRhdGEtbmFtZT0iaWNvbnMgUTIiPgogICAgICA8cGF0aCBkPSJNMjQsMS45YTIxLjYsMjEuNiwwLDAsMC02LjgsNDIuMmMxLC4yLDEuOC0uOSwxLjgtMS44VjM5LjRjLTYsMS4zLTcuOS0yLjktNy45LTIuOWE2LjUsNi41LDAsMCwwLTIuMi0zLjJDNi45LDMxLjksOSwzMiw5LDMyYTQuMyw0LjMsMCwwLDEsMy4zLDJjMS43LDIuOSw1LjUsMi42LDYuNywyLjFhNS40LDUuNCwwLDAsMSwuNS0yLjlDMTIuNywzMiw5LDI4LDksMjIuNkExMC43LDEwLjcsMCwwLDEsMTEuOSwxNWE2LjIsNi4yLDAsMCwxLC4zLTYuNCw4LjksOC45LDAsMCwxLDYuNCwyLjksMTUuMSwxNS4xLDAsMCwxLDUuNC0uOCwxNy4xLDE3LjEsMCwwLDEsNS40LjcsOSw5LDAsMCwxLDYuNC0yLjgsNi41LDYuNSwwLDAsMSwuNCw2LjRBMTAuNywxMC43LDAsMCwxLDM5LDIyLjZDMzksMjgsMzUuMywzMiwyOC41LDMzLjJhNS40LDUuNCwwLDAsMSwuNSwyLjl2Ni4yYTEuOCwxLjgsMCwwLDAsMS45LDEuOEEyMS43LDIxLjcsMCwwLDAsMjQsMS45WiIvPgogICAgPC9nPgogIDwvZz4KPC9zdmc+Cg==\" width=\"35\" alt=\"\"></a></p><p style=\"text-align:center\"><a class=\"waves-effect waves-light btn-small\" id=\"close_kantcshit\">close</a></p></div></div></div>"

    // search for video tag inside the html
    if(document.getElementsByTagName("video").length == 0) {
        alert("Oh no!, couldn't detect video in this page.\r\nIf you think this is an error open a ticket at https://github.com/gdi3d/change-youtube-videos-brightness/issues/new");
        throw new Error("No video tag detected!. WTF!!??!")
    } else if (document.getElementsByTagName("video").length == 1) {
        var vp = document.getElementsByTagName("video")[0];
    } else if (document.getElementsByTagName("video").length > 1) {
        for (let ve of document.getElementsByTagName("video")) {
            if (ve.src.startsWith('blob:')){
                var vp = ve;
                break;
            }
        }
    }

    if (vp === undefined) {
        alert("Mmm, we couldn't detect where the video is at. I don't know what to do!. If you think this is an error open a ticket at https://github.com/gdi3d/change-youtube-videos-brightness/issues/new");
        throw new Error("More than one video tag detected -.-")
    }

    // create kantcshit panel container
    let kantcshit_container = document.createElement("div");
    kantcshit_container.id = 'container_kantcshit';
    kantcshit_container.innerHTML = html;
    document.body.appendChild(kantcshit_container);  

    // prefix for the controlers
    // st_slider, hue_slider, etc...
    const controls = ['st', 'hue', 'ct', 'br'];
    


    // set actions to sliders and reset buttons
    for (let c of controls) {
        
        let slider = document.getElementById(`${c}_slider`);
        let val = document.getElementById(`${c}_val`);
        val.innerHTML = slider.value; // Display the default slider value

        // sliders value update
        slider.oninput = function() {
          val.innerHTML = this.value;

          switch(c) {
            case 'br':
                let br_flt = vp.style.filter;
                const br_reg = /brightness\(\d*\%\)/
                br_flt = br_flt.replace(br_reg, '');
                vp.style.filter = `${br_flt} brightness(${this.value}%)`;
                break;
            case 'st':
                let st_flt = vp.style.filter;
                const st_reg = /saturate\(\d*\%\)/
                st_flt = st_flt.replace(st_reg, '');
                vp.style.filter = `${st_flt} saturate(${this.value}%)`;
                break;
            case 'hue':
                let hue_flt = vp.style.filter;
                const hue_reg = /hue-rotate\(\d*deg\)/
                hue_flt = hue_flt.replace(hue_reg, '');
                vp.style.filter = `${hue_flt} hue-rotate(${this.value}deg)`;
                break;
            case 'ct':
                let ct_flt = vp.style.filter;
                const ct_reg = /contrast\(\d*\%\)/
                ct_flt = ct_flt.replace(ct_reg, '');
                vp.style.filter = `${ct_flt} contrast(${this.value}%)`;
                break;

          }
          
        }

        // reset buttons
        let r_btn = document.getElementById(`${c}_reset`);
        switch(c) {
            case 'br':
                
                r_btn.onclick = function(){
                    vp.style.filter = "brightness(100%)";
                    slider.value = 100;
                    slider.dispatchEvent(new Event('input'));
                };
                
                break;
            case 'st':
                
                r_btn.onclick = function(){
                    vp.style.filter = "saturate(100%)";
                    slider.value = 100;
                    slider.dispatchEvent(new Event('input'));
                };
                
                break;

            case 'hue':
                
                r_btn.onclick = function(){
                    vp.style.filter = "hue-rotate(0deg)";
                    slider.value = 0;
                    slider.dispatchEvent(new Event('input')); 
                };

                break;
            case 'ct':

                r_btn.onclick = function(){
                    vp.style.filter = "contrast(100%)";
                    slider.value = 100;
                    slider.dispatchEvent(new Event('input')); 
                };
                
                break;

      }
    }

    // Close b.deo panel
    let ckantcshit = document.getElementById('close_kantcshit');
    ckantcshit.onclick = function() {
        document.getElementById('panel_kantcshit').style.display = 'none';
    }

    // open b.deo panel
    let okantcshit = document.getElementById('open_kantcshit');
    okantcshit.onclick = function() {
        document.getElementById('panel_kantcshit').style.display = 'block';
        okantcshit.style.display = 'none';
    }

    // hover to display b.deo top right icon
    // that allows the user to open the effect panel
    vp.addEventListener('mouseenter', function(){ 

        if(document.getElementById('panel_kantcshit').style.display == 'none') {
            document.getElementById('open_kantcshit').style.display = 'block';    
        }
    });
})();