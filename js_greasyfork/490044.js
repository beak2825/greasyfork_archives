// ==UserScript==
// @name         Gta5Mods to FiveM resource tool
// @namespace    https://gta5mods.hk416.org/
// @version      1.0
// @description  A tool can convert the gta5-mods.com mods to FiveM resource
// @author       Akkariin
// @match        *://*.gta5-mods.com/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490044/Gta5Mods%20to%20FiveM%20resource%20tool.user.js
// @updateURL https://update.greasyfork.org/scripts/490044/Gta5Mods%20to%20FiveM%20resource%20tool.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var postURL = "https://gta5mods.hk416.org/en";
    if(window.location.hostname == "zh.gta5-mods.com") {
        postURL = "https://gta5mods.hk416.org/";
    }
    function fivem_println(text) {
        $(".downloadFiveM").html(text);
    }
    function fivem_enableBtn() {
        $(".downloadFiveM").removeAttr('disabled');
    }
    function fivem_disableBtn() {
        $(".downloadFiveM").attr('disabled', 'disabled');
    }
    function fivem_query() {
        var url = window.location.href.substr(0, window.location.href.length - window.location.hash.length);
        if(url == "") return;
        fivem_disableBtn();
        var htmlobj = $.ajax({
            type: 'POST',
            url: postURL,
            async: true,
            data: {
                url: url
            },
            success: function() {
                try {
                    var json = JSON.parse(htmlobj.responseText);
                    if(json.status == 200) {
                        fivem_println("<i class='fa fa-check'></i>&nbsp;Task submit finished, ID: " + json.message);
                        localStorage.setItem("convertUid", json.message);
                        fivem_startInterval(json.message);
                    } else {
                        fivem_println("<i class='fa fa-close'></i>&nbsp;" + json.message);
                        fivem_enableBtn();
                        localStorage.removeItem("convertUid");
                    }
                } catch(e) {
                    fivem_println("<i class='fa fa-close'></i>&nbsp;Failed to submit the task!");
                    fivem_enableBtn();
                    localStorage.removeItem("convertUid");
                }
            },
            error: function() {
                fivem_println("<i class='fa fa-close'></i>&nbsp;Failed to submit the task!");
                fivem_enableBtn();
                localStorage.removeItem("convertUid");
            }
        });
    }
    function fivem_startInterval(uuid) {
        var htmlobj = $.ajax({
            type: 'POST',
            url: postURL,
            async: true,
            data: {
                uuid: uuid,
                lang: "en_US"
            },
            success: function() {
                try {
                    var json = JSON.parse(htmlobj.responseText);
                    if(json.status == 200) {
                        fivem_println("<i class='fa fa-check'></i>&nbsp;Convert finished: " + json.message.name);
                        localStorage.removeItem("convertUid");
                        fivem_enableBtn();
                        fivem_downloadFile("https://gta5mods.hk416.org/" + json.message.file, json.message.name);
                    } else if(json.status == 101) {
                        fivem_println('<i class="fa fa-circle-o-notch fa-spin"></i>&nbsp;' + json.message);
                        setTimeout(function() {
                            fivem_startInterval(uuid)
                        }, 1000);
                    } else {
                        fivem_println("<i class='fa fa-close'></i>&nbsp;" + json.message);
                        localStorage.removeItem("convertUid");
                        fivem_enableBtn();
                    }
                } catch(e) {
                    fivem_println("<i class='fa fa-close'></i>&nbsp;Failed to get the task status!");
                    localStorage.removeItem("convertUid");
                    fivem_enableBtn();
                }
            },
            error: function() {
                fivem_println("<i class='fa fa-close'></i>&nbsp;Failed to get the task status!");
                localStorage.removeItem("convertUid");
                fivem_enableBtn();
            }
        });
    }
    function fivem_downloadFile(content, filename) {
        // $("#downloadFrame").attr('src', content);
        window.location = content;
    }
    $(".btn-download").after("<style>.downloadFiveM{width:100%;}</style>");
    $(".btn-download").after("<p><button class='btn btn-default downloadFiveM'><i class='fa fa-download'></i>&nbsp;&nbsp;Download FiveM Resource</button></p>");
    $("body").append('<iframe src="about:blank" id="downloadFrame" style="width:0px;height:0px;border:0px;"></iframe>');
    var uuid = localStorage.getItem("convertUid");
    if(uuid != null && uuid != undefined) {
        fivem_startInterval(uuid);
    } else {
        $(".downloadFiveM").click(function() {
            fivem_query();
        });
    }
})();