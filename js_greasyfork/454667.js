// ==UserScript==
// @name         KAIS-NT
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Simulasi isi IRS SIAK dengan jadwal semester terbaru
// @author       You
// @match        https://academic.ui.ac.id/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atomicobject.com
// @grant GM_setValue
// @grant GM_getValue
// @require https://code.jquery.com/jquery-3.6.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/454667/KAIS-NT.user.js
// @updateURL https://update.greasyfork.org/scripts/454667/KAIS-NT.meta.js
// ==/UserScript==

function GM_addStyle(cssStr) {
    var D = document;
    var newNode = D.createElement('style');
    newNode.textContent = cssStr;

    var targ = D.getElementsByTagName('head')[0] || D.body || D.documentElement;
    targ.appendChild(newNode);
}

function simulasi_web_sibuk() {
    document.body.innerHTML = `
        <style>
            .center {
                line-height: 700px;
                height: 700px;
                text-align: center;
            }

            /* If the text has multiple lines, add the following: */
            .center p {
                line-height: 1.5;
                display: inline-block;
                vertical-align: middle;
            }
        </style>
        <div class="center">
            <p>Server Siak sedang sibuk. <br> Silahkan coba beberapa saat lagi</p>
        </div>
    `
}

(function main() {
    'use strict';
    // Your code here...
    if (GM_getValue("crash-chance", -1) < 0) {
        GM_setValue("crash-chance", 0.9);
    }
    GM_setValue("crash-chance", GM_getValue("crash-chance", 0) - Math.random() * 1 / 15);
    if (GM_getValue("crash-chance", 99) < 0.6) {
        simulasi_web_sibuk();
    } else {
        var count = 0;
        $(document).ready(function () {


            if (window.location.href.indexOf("main/Authentication/") > -1) {
                $('form').submit(function (event) {
                    GM_setValue("login-time", Date.now());

                });

                $('#left div:nth-child(3) h3:nth-child(1)').html("Selalu login ulang untuk load data siak terbaru!")
            } else {
                $("#t_h").css("background", `url(https://upload.wikimedia.org/wikipedia/commons/b/b9/Solid_red.png) top left no-repeat`);
                $("#t_h .w0").css("background", `url(https://upload.wikimedia.org/wikipedia/commons/b/b9/Solid_red.png) top right no-repeat`);
                $("#t_h .w0 .w1").css("background", `url(https://upload.wikimedia.org/wikipedia/commons/b/b9/Solid_red.png) top repeat-x`);
                document.getElementById("m_b1").innerHTML = `<div class="rinfo" style="border-right:0;border-left:0;text-align: center;">
            Selalu login ulang<br>untuk mengambil data terbaru
        </div>` + document.getElementById("m_b1").innerHTML
            }

            $('a[href="../CoursePlan/CoursePlanEdit"]').attr('href', '../Schedule/Index?period=2023-1&search=');
            $(".w1 h1").html("KAIS<em>NT</em>");


            if (window.location.href.indexOf("main/Schedule/Index") > -1) {
                $('.ri').remove();
                $('tbody tr').each(function (index, element) {
                    var attr = $(element).attr('class');

                    // For some browsers, `attr` is undefined; for others,
                    // `attr` is false.  Check for both.
                    if (typeof attr !== 'undefined' && attr !== false) {
                        // ...
                        element.innerHTML = `<td class="ri"><input type="radio" name=radio${count}></td>` + element.innerHTML;

                    } else {
                        count = count + 1;


                    }
                });
                $(".tab").remove();
                $("td h3").remove();
                $(".box tbody tr:first-child").remove();

                $("#ti_h").each(function (index, element) {
                    element.innerHTML = "Pengisian IRS (Simulasi CUK)"
                });
                $("fieldset").remove();
                $("form").remove();
                $(".toolbar").remove();
                $('.box:last-child tbody').append(`<tr><td align="center" colspan="8"><div id="tmStopWatchBlck">
        <button id="tmStopWatchBttn">Simpan IRS</button>
        <span id="tmTimeStat">&nbsp;</span>
        <span>Waktu dihitung dari login</span>
    </div></td></tr>`);

                $("table.box").css("width", "100%");






                var startTime = Date.now();

        $("#tmStopWatchBttn").click(zEvent => {
            var statusNode = $("#tmTimeStat");
            var tmrButton = $(zEvent.target);

            //-- Stop the timer
            statusNode.css("background", "lightgreen");

            var stopTime = Date.now();
            var elapsedtime = stopTime - startTime;  // Milliseconds
            var purtyElpsdTime = (elapsedtime / 1000).toFixed(3) + " seconds";
            console.log(
                "Timer stopped at: ", stopTime.toFixed(0), new Date(),
                "Elapsed: ", purtyElpsdTime
            );
            statusNode.text(purtyElpsdTime);
        });

                GM_addStyle(`
                    #tmStopWatchBttn {
                        font-size: 1.2em;
                        padding: 0.5ex 1em;
                        width: 5em;
                    }
                    #tmTimeStat {
                        margin-left: 1em;
                        padding: 0.2ex 2ex;
                        border: 1px solid lightgray;
                        border-radius: 0.5ex;
                    }
` );
            }
        });

    }


}());

