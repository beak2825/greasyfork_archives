// ==UserScript==
// @name         Auto Text Skipper Education Perfect
// @namespace    http://tampermonkey.net/
// @version      1.1 BETA
// @icon         data:image/png;base64,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
// @description  This scirpt will automaticly complete the text secrtion on Education Perfect
// @match        https://app.educationperfect.com/app/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473473/Auto%20Text%20Skipper%20Education%20Perfect.user.js
// @updateURL https://update.greasyfork.org/scripts/473473/Auto%20Text%20Skipper%20Education%20Perfect.meta.js
// ==/UserScript==

const loadScriptXML = (src) => {
    return new Promise((resolve, reject) => {
        var connect = new XMLHttpRequest();
        connect.open('GET', src, true);

        connect.onload = () => {
            if (connect.status == 200) {
                resolve(connect.responseText);
                return;
            } else {
                reject(connect.statusText);
                return;
            }
        }

        connect.send();
    });
}

const loadScriptJq = (src, jQuery) => {
    return new Promise((resolve, reject) => {
        jQuery.get(src, (data) => {
            resolve(data);
            return;
        });
    });
}

function loadScripts() {
    loadScriptXML('https://code.jquery.com/jquery-3.6.0.min.js').then((jQuery_dat) => {
        var jqF = new Function(jQuery_dat + "; return jQuery;");
        var jQuery = jqF();

        detectPage();
    });
}

loadScripts();

       function detectPage() {
    global();

    if (location.href.includes("educationperfect.com")) educationPerfect();
}

async function global() {
    var panel = `
    <div id='panel' class='inactive'>
        <p>No</p>
    </div>

    <style>
    #panel {
        position: fixed;
        top: 0;
        left: 0;
        background: hotpink;
        width: 100vw;
        height: 100vh;
        z-index: 9999999;
        color: orange;
        transition: 0.5s ease;
        transform: translateX(0);
    }

    #panel.inactive {
        transform: translateX(-100vw);
    }
    </style>
    `;

    $("body").append(panel);

    document.addEventListener('keydown', function(event) {
        if (event.altKey && event.code == 'KeyL') {
            event.preventDefault();
            $("#panel").toggleClass("inactive");
        }
    });
}

async function educationPerfect() {
    // Wait for .sa-navigation-controls-content.h-group.v-align-center.h-align-space-between.align-right to load
    await new Promise(resolve => {
        var interval = setInterval(function() {
            if ($(".sa-navigation-controls-content.h-group.v-align-center.h-align-space-between.align-right").length) {
                clearInterval(interval);
                resolve();
            }
        }, 100);
    });

    setInterval(() => {
        if ($(".learnsharp-ep-skip-btn").length == 0 || $("#learnsharp-ep-skip").length == 0) {
            console.log('a');
            $(".learnsharp-ep-skip-btn").remove();
            $("#learnsharp-ep-skip").remove();

            $(".sa-navigation-controls-content.h-group.v-align-center.h-align-space-between.align-right").append(`
            <div class="continue arrow action-bar-button v-group learnsharp-ep-skip-btn" sidebar="self.model.sidebarMode" walkthrough-position="top">
                <button id="skip-btn" class="learnsharp-ep-btn">
                    <span ng-hide="self.sidebar" class="abb-label" ng-transclude="">
                    <span class="ng-binding ng-scope"> Skip </span></span>
                    <span class="highlight"></span>
                </button>
                <div class="sidemode-label ng-hide">
                    <span class="ng-binding ng-scope"> Skip </span>
                </div>
            </div>

            <div class="continue arrow action-bar-button v-group learnsharp-ep-skip-btn" sidebar="self.model.sidebarMode" walkthrough-position="top">
                <button id="skip-sec-btn" class="learnsharp-ep-btn">
                    <span ng-hide="self.sidebar" class="abb-label" ng-transclude="">
                    <span class="ng-binding ng-scope"> Skip Section </span></span>
                    <span class="highlight"></span>
                </button>
                <div class="sidemode-label ng-hide">
                    <span class="ng-binding ng-scope"> Skip Section </span>
                </div>
            </div>

            <div class="learnsharp-ep-skip-btn">
                <input type="checkbox" id="learnsharp-ep-skip" name="learnsharp-ep-skip" value="learnsharp-ep-skip">
                <label for="learnsharp-ep-skip">Auto Skip</label>
            </div>

            <style>
            .learnsharp-ep-skip-btn {
                margin-left: 10px;
            }
            </style>
            `);
        }

        // clear $("#skip-btn") click events
        $("#skip-btn").off("click");

        $("#skip-btn").on('click', function() {
            var elms = $(".h-group.v-align-center.expanded-content.information.selected");
            if (elms.length > 0) {
                var btn = $(".continue.arrow.action-bar-button.v-group.ng-isolate-scope").find('button');

                // Make sure we dont click the button we just clicked.
                for (var i = 0; i < btn.length; i++) {
                    if (btn[i].classList.contains("learnsharp-ep-btn"))
                            continue;

                        console.log(btn[i]);

                    btn[i].click();
                }
            }
        });

        $("#skip-sec-btn").off("click");

        $("#skip-sec-btn").on('click', async function() {
            while (true) {
                var elms = $(".h-group.v-align-center.expanded-content.information.selected");
                if (elms.length > 0) {
                    var btn = $(".continue.arrow.action-bar-button.v-group.ng-isolate-scope").find('button');

                    for (var i = 0; i < btn.length; i++) {
                        // Check if has class
                        if (btn[i].classList.contains("learnsharp-ep-btn"))
                            continue;

                        btn[i].click();
                    }
                } else break;

                await new Promise(resolve => { setTimeout(resolve, 100); });
            }
        });
    }, 100);

    setInterval(() => {
        if ($(".h-group.v-align-center.expanded-content.information.selected").length > 0) {
            $(".continue.arrow.action-bar-button.v-group:not(.ng-isolate-scop)").css("display", "block");
            $(".continue.arrow.action-bar-button.v-group.ng-isolate-scope").css("display", "none");
        } else {
            $(".continue.arrow.action-bar-button.v-group:not(.ng-isolate-scop)").css("display", "none");
            $(".continue.arrow.action-bar-button.v-group.ng-isolate-scope").css("display", "block");
        }
    }, 100);

    while (true) {
        if ($("#learnsharp-ep-skip").is(":checked")) {
            var elms = $(".h-group.v-align-center.expanded-content.information.selected");
            if (elms.length > 0) {
                var btn = $(".continue.arrow.action-bar-button.v-group.ng-isolate-scope").find('button');

                for (var i = 0; i < btn.length; i++) {
                    btn[i].click();
                }
            }
        }

        await new Promise(resolve => { setTimeout(resolve, 1000); });
    }
}