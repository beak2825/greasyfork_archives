// ==UserScript==
// @name         exh which is gif?
// @namespace    https://sleazyfork.org/en/scripts/436971
// @version      0.31
// @description  Highlights .gif files in gallery view by adding a glow around the thumbnail. Customizable settings are shown in the right sidebar, under the petition rename/expunge links.
// @author       coombrain
// @match        https://exhentai.org/g/*
// @match        https://e-hentai.org/g/*
// @icon         none
// @grant        GM.setValue
// @grant        GM.getValue
// @require      http://code.jquery.com/jquery-latest.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436971/exh%20which%20is%20gif.user.js
// @updateURL https://update.greasyfork.org/scripts/436971/exh%20which%20is%20gif.meta.js
// ==/UserScript==
var $ = window.jQuery;

var defc = GM.getValue("wigColor", "#00ffff").then(function(wigColor) { defc = wigColor; });
var defs = GM.getValue("wigSize", 8).then(function(wigSize) { defs = wigSize; });
var defw = GM.getValue("webpChk", true).then(function(webpChk) {defw = webpChk});

(function() {
    'use strict';

    $(document).ready(function () {
        $("#gd5").append(`<div class="wigcn"><a class="g2 wigst" href="#" style="font-weight:bold;">Which is GIF? ⚙️</a></div>`);
        $(".wigcn").append(`<div class="wigcns"><div class="tha nosel wigsto"><input type="color" name="which is gif? glow color" id="cpick" value="${defc}" style="border:none;padding:0;margin:0;height:24px;"></div>`);
        $(".wigcn").append(`<div class="tha nosel wigsto"><input type="number" name="which is gif? glow size" id="wigsz" min="0" value="${defs}" style="border:none;padding:0 0 0 5px;margin:none;max-width:50px;height:24px;"></div>`);
        $(".wigcn").append(`<div class="thtgl nosel wigsto"><label><input type="checkbox" name="which is gif? webp toggle" id="wbpc">Highlight .webp</label></div></div>`);
        $("#wbpc").prop('checked', defw);

        $("#cpick, #wigsz, #wbpc").on("change", wigupd);

        //-----------------
        // Uncomment the line below to hide the setting sidebar once you've set your desired glow color/size. Comment it out again to have it appear again.
        // $(".wigcn").css({"display":"none"});
        //-----------------

        $(".wigsto").css({"display":"none","margin":"0 auto 0 10px"});
        $(".wigst").css({"margin":"0 auto 0 10px","max-width":"150px","padding":"0"}).click(function() {
            $(".wigsto").css("display",$(".wigsto").css("display") == "none" ? "inline-block" : "none");
        });

        wigupd();

        function wigupd() {
            let WG_GLOW_COLOR = $("#cpick")[0].value;
            let WG_GLOW_SIZE = $("#wigsz")[0].value;
            let WG_WEBP_CHK = $("#wbpc")[0].checked;
            GM.setValue("wigColor", WG_GLOW_COLOR);
            GM.setValue("wigSize", WG_GLOW_SIZE);
            GM.setValue("webpChk", WG_WEBP_CHK);
            wigApply(WG_GLOW_COLOR, WG_GLOW_SIZE, WG_WEBP_CHK);
        }

        function wigApply(wigc, wigs, wbpc) {
            $("#gdt a div").each(function() {
                let tmtl = $(this).attr("title");
                let tmei = tmtl.lastIndexOf(".") + 1;
                let tmex = tmtl.substr(tmei);

                console.log(wbpc)

                if (tmex == "gif" || tmex == "apng" || tmex == "webm" || (tmex == "webp" && wbpc == true)) {
                    //as of writing only gif is supported on exh galleries so lol
                    $(this).css("box-shadow", `0 0 ${wigs}px ${wigc}`);
                } else if (tmex == "webp" && wbpc == false) {
                    $(this).css("box-shadow", `0 0 0px ${wigc}`);
                }
            });
       }
    });

})();