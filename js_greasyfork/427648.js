// ==UserScript==
// @name         DoubleList Enhancer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add Image Thumbnail Previews, throttled per link @1200ms
// @author       Technoid
// @match        https://doublelist.com/city/*
// @icon         https://www.google.com/s2/favicons?domain=doublelist.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427648/DoubleList%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/427648/DoubleList%20Enhancer.meta.js
// ==/UserScript==

/* eslint-env jquery */
(function() {
    'use strict';

    setTimeout(function() {
        let matchnum = 0

        $("a.item").each(function( index ) {
            let a = $( this )
            //console.log( index + ": " + a.text() );
            a.parent().css("flex-wrap", "wrap")
            let url = a.attr("href")

            //console.log("a.item " + index)
            //console.log(url)
            if (url.match(/posts/) && a.find(".orn").length > 0) {
                setTimeout(function() {

                    $.ajax({
                        url: url,
                        cache: true,
                        success: function(response) {
                            //console.log("Ajax Success")
                            let thumbs = $(response).find(".gallery-thumbs .swiper-slide");
                            //let result = $(response).find("#mainpic");
                            //console.log(response); // works as expected (returns all html)

                            if (thumbs.length === 0) {
                              //console.log("No Pic Found")
                              return
                            }

                            let imgdiv = $("<div style='flex-basis: 100%;'></div>")
                            a.append(imgdiv)

                            thumbs.each(function(index2) {
                              let img = $(this)
                              let ohtml = img.prop("outerHTML")

                              if (!ohtml.match(/background-image/)) {
                                  //console.log("No Image Element found.")
                                  //console.log(ohtml)
                                  return;
                              }

                              console.log("Pic Found - appending html : " + ohtml); // returns [object Object]
                              let thumb = $(ohtml)
                              thumb.css("background-size", "cover");
                              thumb.css("background-position", "center")
                              thumb.css("height", "60px")
                              thumb.css("width", "60px")
                              thumb.css("display", "inline-block")
                              thumb.css("margin", "10px")
                              imgdiv.append(thumb)
                            })

                        },
                        error: function(error) {
                          console.log("Ajax Error")
                          console.log(error)
                        }
                    });
                }, 1200 * matchnum++);
            } else {
                //console.log("Not matched posts")
                return
            }

            //if (index > 3) return false;


        });

    }, 1500)
})();