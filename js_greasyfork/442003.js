// ==UserScript==
// @name         Rubik's cube set up show
// @namespace    http://tampermonkey.net/
// @version      1.12
// @description  Show the set-up move next to the Rubik's cube algorithm. Avoid to do it inversely in your mind.
// @author       You
// @match        *://solvethecube.com/*
// @match        *://www.speedcubedb.com/*
// @match        *://www.speedcubedb.com/algsheet/*
// @match        *://cubingcheatsheet.com/*
// @match        *://www.speedsolving.com/*
// @match        *://ruwix.com/*
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        unsafeWindow
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442003/Rubik%27s%20cube%20set%20up%20show.user.js
// @updateURL https://update.greasyfork.org/scripts/442003/Rubik%27s%20cube%20set%20up%20show.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function setup(steps) {
      let words=steps.split(/\xa0|\(|\)|\s/).filter(function (s) {
        return s && s.trim();
      });
      let result="";
      words.reverse();
      for (var elem of words) {
          if(elem.indexOf("\'") < 0) {
              elem = elem.concat("'");
          }else{
              elem = elem.replace("'", '');
          }
          result += elem.concat(' ');
      }
      return result;
    }

    function doSolvethecube() {
           $(".steps").each(function () {
            var txt1=$("<span></span>").text(setup($(this).text()));
            txt1.css("color","green");
            txt1.css("display", "flex");
            $(this).append(txt1);
        });
        $("#menu").remove();
        $("#navbar").remove();
        $(".adsbygoogle").remove();
        $(".alg-table-controls").remove();
    }

    function doSpeedcubedb() {
        $(".col-12.col-md-4").remove();
        $(".col.col-md-8").css("width","100%");
        $(".card-body > ul ").each(function () {
             var txt1=$("<li><span></span></li>").text(setup($(this).find("li").eq(0).find("span").text()));
            txt1.css("color","green");
            txt1.css("display", "flex");
            $(this).append(txt1);
        });

        $(".community-algs>li:first-child ").each(function() {
            var txt2=$("<span></span>").text(setup($(this).find("span").text()));
            txt2.css("color","green");
            txt2.css("display", "flex");
            $(this).append(txt2);
        });
    }

    function doCubingcheatsheet() {
        $(".alg-sequence ").each(function () {
             var txt1=$("<div><span></span></div>").text(setup($(this).text()));
             txt1.css("color","green");
             $(this).append(txt1);
        });
    }

    function doSpeedsolving() {
        var rows = $('td').filter(function(){
                    var color = $(this).css("background-color");
                    var font = $(this).css("font-family");
                    return (color === "#F0F0F0" || color === "rgb(240, 240, 240)") && (font === "Tahoma");
                });
                rows.each(function () {
                    var txt1=$("<td></td>").text(setup($(this).text()));
                    txt1.css("color","green");
                    $(this).parent().append(txt1);
                });
    }

    function doRuwix() {
        $(".algDescr").each(function () {
             var txt1=$("<div></div>").text(setup($(this).text()));
             txt1.css("color","green");
             $(this).append(txt1);
        });
    }

    let main = {
        init() {
            if (/speedcubedb.com/.test(location.host)) {
                doSpeedcubedb();
            }
            if (/solvethecube.com/.test(location.host)) {
                doSolvethecube();
            }
            if(/cubingcheatsheet.com/.test(location.host)) {
                doCubingcheatsheet();
            }
            if(/speedsolving.com/.test(location.host)) {
                doSpeedsolving();
            }
            if(/ruwix.com/.test(location.host)) {
                doRuwix();
            }

        }
    };

    main.init();
})();

