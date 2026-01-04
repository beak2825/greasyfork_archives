// ==UserScript==
// @name         kp4jd2
// @namespace    https://sleazyfork.org/en/scripts/441628-kp4jd2
// @version      0.35
// @description  Generate a list of links for JD2 from kemono posts.
// @author       You
// @match        https://kemono.party/*/user/*/post/*
// @match        https://kemono.su/*/user/*/post/*
// @icon         https://www.google.com/s2/favicons?domain=kemono.party
// @require      http://code.jquery.com/jquery-latest.min.js
// @license      MIT
// @grant        GM.getValue
// @grant        GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/441628/kp4jd2.user.js
// @updateURL https://update.greasyfork.org/scripts/441628/kp4jd2.meta.js
// ==/UserScript==
var $ = window.jQuery;

(function() {
    'use strict';

    // Default ignore post thumb behavior
    let iPT = GM.getValue('kp_ipt', true).then((kp_ipt) => { iPT = kp_ipt; });


    $(document).ready(function () {
        $(".post__header").after("<div class='kpdlh'></div>");
        $(".kpdlh").append(`<button class="kpdl" style="vertical-align:middle">Generate List for JD2</button>`).css("padding","0.5rem");
        $(".kpdl").click(function() {genList();});

        $(".kpdlh").append(`<input class="kpit" type="checkbox">`).append(`<label>Ignore post thumb</label>`);
        $('.kpdlh').children().css('vertical-align', 'middle');
        $('.kpit').css({'width':'16px','height':'16px','margin':'4px'});
        $('.kpit').prop('checked', GM.getValue('kp_ipt', true).then((kp_ipt) => { $(".kpit").prop('checked', kp_ipt); }));
        $('.kpit').on('change', () => {GM.setValue("kp_ipt", $('.kpit').prop('checked')); GM.getValue('kp_ipt', true).then((kp_ipt) => { iPT = kp_ipt; } );});

        function genList() {
            let srcList = "";
            let idx = 0;
            let imgcount = $(".post__files .post__thumbnail a.image-link").length;

            $(".post__files .post__thumbnail a.image-link").each(function() {
                let tmtl = $(this).attr("href");
                let tmfi = tmtl.lastIndexOf("?f=") != -1 ? tmtl.lastIndexOf("?f=") : tmtl.length;
                let tmei = tmtl.lastIndexOf(".") + 1;
                let tmnf = tmtl.slice(tmfi);
                let tmex = tmtl.substr(tmei);
                tmtl = tmtl.slice(0,tmfi);

                let kpid = window.location.pathname;
                kpid = kpid.substr(kpid.lastIndexOf("/")+1);
                let lidx = idx.toString().padStart(Math.max(2,imgcount.toString().length),'0');

                if (iPT === true && lidx == "00") {
                    console.log(`${kpid}_${lidx} ignored.`);
                    idx += 1;
                } else {
                    //jd2 for some reason dislikes .jpe files
                    if (tmex == "jpe") tmex = "jpeg";
                    let base = ""; // "https://kemono.party"
                    //console.log(tmtl);
                    let url = base+tmtl+"?f="+kpid+"_"+lidx+"."+tmex;
                    srcList += url + "\n";
                    idx += 1;
                }
            });

            $(".post__attachment a.post__attachment-link").each(function() {
                let tmtl = $(this).attr("href");
                let url = tmtl.indexOf("https://kemono.su") ? tmtl : "https://kemono.su"+tmtl;
                srcList += url + "\n";
            });

            srcList += $.trim($(".post__title").text());
            navigator.clipboard.writeText(srcList);

            $(".kpdlh").append(`<span class="kpdlfb">List copied to Clipboard.</span>`);
            $(".kpdlfb").css("margin-left","0.5rem");
            setTimeout(function() {
                $(".kpdlfb").fadeOut(500, function() {
                    $(".kpdlfb").remove()});
            }, 2000);
        }
    });
})();