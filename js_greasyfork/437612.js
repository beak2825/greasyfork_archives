// ==UserScript==
// @name         My 115
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  115
// @author       You



// @include     http*://115.com/*

// @icon         https://www.google.com/s2/favicons?domain=115.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437612/My%20115.user.js
// @updateURL https://update.greasyfork.org/scripts/437612/My%20115.meta.js
// ==/UserScript==
function addJQuery(callback) {
    var script = document.createElement("script");
    script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
    script.addEventListener('load', function() {
        var script = document.createElement("script");
        script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
        document.body.appendChild(script);
    }, false);
    document.body.appendChild(script);
}

function main(){
    const regex = /((?:(?!(boy|oy|hjd|jd|com|om|SIS|IS|sis)))[a-zA-Z]{2,5})-?\d{3,4}/g;
    const subtitle_r = /((?:(?!(boy|oy|hjd|jd|com|om|SIS|IS)))[a-zA-Z]{2,5})-?\d{3,4}(-|_)?(ch|C|c)/g;
    function mainBtnClick() {
        var items = $(".name")
           items.each((i, video) => {
               var texts = $(video).find("span")
               var t = texts.text().toUpperCase()
               const found = t.match(regex);
               const sub = t.match(subtitle_r)
               if (found && found.length === 1) {
                   var code = found[0]
                   var temp = code.match(/[a-zA-Z]+|\d+/g)
                   code = temp[0] + temp[1]
                   $.ajax({url: "https://www.mingren.life/av/" + code, success: (result) => {
                     if (result.DownloadMovies.length > 0){
                        // already download
                        if (result.DownloadMovies[0].subtitle == 0 && sub) {
                          $(texts).css("color", "purple")
                        } else {
                          $(texts).css("color", "blue")
                        }
                     } else {
                        $(texts).css("color", "red")
                     }
                   }})
               }


           })
    }


    $(document).ready(function(){
        'use strict';
        let body = $("body");
        let btn = $("<button style='z-index:100;position: absolute; left: 100px; top: 200px' id='main-btn-addon'>Start</button>")
        body.append(btn)

           $('#main-btn-addon').click(mainBtnClick)

        console.log(body)
    });
}
// load jQuery and execute the main function
addJQuery(main);
