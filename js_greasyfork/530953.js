// ==UserScript==
// @name         RR Watch Alert
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a "Watch Alert" button to the Russian Roulette page in Torn
// @author       Lollipop :)
// @match        https://www.torn.com/page.php*
// @grant        GM_xmlhttpRequest
// @connect      discord.com
// @downloadURL https://update.greasyfork.org/scripts/530953/RR%20Watch%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/530953/RR%20Watch%20Alert.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // EDIT THIS TO USE YOUR OWN WEBHOOK!!!!!!!!
    const webhookURL = "https://discord.com/api/webhooks/1354536461567004904/2VMdAn99fqzds-r73uAI3ffXjUKBoKIrUcWxAJBSh3FU3Wlp__k3YEH8L93ESKoQ59Cu";



    console.log("Userscript loaded");

    if (!window.location.href.includes("russianRoulette")) {
        console.log("Not on Russian Roulette page, exiting...");
        return;
    }

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    function getPlayerInfo() {
        try {
            let uid = getCookie('uid');
            let data = JSON.parse(sessionStorage.getItem('sidebarData' + uid));
            if(data && data.user) {
                return { id: uid, name: data.user.name };
            }
        } catch (error) {
            console.error("Error getting player info:", error);
        }
        return { id: null, name: "Unknown Player" };
    }

    function sendWebhook() {
        const playerInfo = getPlayerInfo();
        if (!playerInfo.id) {
            console.error("Could not retrieve player information");
            return;
        }

        const payload = {
            content: "",
            tts: false,
            embeds: [{
                title: `${playerInfo.name} [${playerInfo.id}]`,
                description: `${playerInfo.name} has requested somebody watch their loader!\n\nIf you [know how](https://docs.google.com/document/d/1MFIMYqa_7z9pEsSgF6csljBmZqpG2LlMs3sUMS0KMNk), have time to watch, and have 25E click the button below.\n\n\u200B\n**>>> [👁️ WATCH LOADER 👁️](https://www.torn.com/loader.php?sid=attack&user2ID=${playerInfo.id}) <<<**`,
                color: 15409955,
                author: {
                    icon_url: "https://cdn.discordapp.com/icons/1274353457192767489/b877f60af01e678bd608e919f177695f.webp",
                    name: "Sore Foot Club • Loader Watch Request"
                }
            }],
            components: [{
                type: 1,
                components: [{
                    type: 2,
                    style: 5,
                    label: "Watch Loader",
                    url: `https://www.torn.com/loader.php?sid=attack&user2ID=${playerInfo.id}`
                }]
            }]
        };

        GM_xmlhttpRequest({
            method: "POST",
            url: webhookURL,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify(payload),
            onload: response => console.log("Webhook sent successfully", response),
            onerror: error => console.error("Error sending webhook", error)
        });
    }

    function addButton() {
        console.log("Attempting to add button...");
        let container = document.querySelector(".linksContainer___LiOTN");
        if (!container) return;

        let lastGamesButton = container.querySelector("[aria-labelledby='last-games']");
        if (!lastGamesButton) return;

        let newButton = document.createElement("a");
        newButton.setAttribute("role", "button");
        newButton.setAttribute("aria-labelledby", "watch-alert");
        newButton.href = "#";
        newButton.className = "linkContainer___X16y4 inRow___VfDnd greyLineV___up8VP iconActive___oAum9";
        newButton.innerHTML = `
    <span class="iconWrapper___x3ZLe iconWrapper___COKJD svgIcon___IwbJV" style="width:36px;height:36px;display:inline-flex;align-items:center;justify-content:center;">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 900 1100">
                    <path fill="#999" d="
M575.637573,463.413391
	C589.888123,483.123077 596.375610,504.853241 596.249329,528.767578
	C596.083130,560.249756 596.202148,591.733398 596.193542,623.216431
	C596.191650,630.057861 596.142578,630.124084 589.160461,630.126038
	C523.862305,630.144470 458.564117,630.110229 393.266266,630.249329
	C388.366486,630.259766 386.583435,628.941650 386.613678,623.784241
	C386.811981,589.970276 386.529755,556.153381 386.758820,522.339844
	C387.091644,473.208954 427.192139,428.560089 475.827118,422.642181
	C516.562805,417.685486 549.726440,431.173950 575.637573,463.413391
M429.464478,477.002289
	C438.526794,465.145874 450.323456,457.075806 464.181152,451.810516
	C469.596771,449.752838 471.809723,446.488525 470.602417,442.726227
	C469.303528,438.678619 465.082184,437.266357 459.683197,439.073212
	C425.088654,450.650635 399.293549,486.461121 399.272736,522.938965
	C399.269318,528.928955 401.228058,531.654114 405.626282,531.778625
	C409.967438,531.901550 412.481232,528.978516 412.689636,523.349792
	C413.318542,506.363983 418.651855,491.067505 429.464478,477.002289
z"/>
<path fill="#999" opacity="1.000000" stroke="none"
	d="
M538.000122,643.658936
	C559.321228,643.665344 580.142273,643.653320 600.963379,643.683960
	C617.312561,643.708008 627.813965,653.982788 628.184326,670.381165
	C628.319641,676.374512 628.235901,682.373718 628.196045,688.369873
	C628.149231,695.397705 627.377136,696.196838 620.486206,696.201843
	C595.334351,696.220276 570.182434,696.207092 545.030579,696.207764
	C484.233002,696.209473 423.435394,696.214905 362.637817,696.211365
	C354.570740,696.210876 353.792419,695.517700 353.904724,687.320312
	C354.004944,680.004456 353.153076,672.646606 354.387512,665.376648
	C356.676788,651.894531 366.421875,643.686707 380.092651,643.679382
	C432.561798,643.651428 485.030914,643.662415 538.000122,643.658936
z"/>
<path fill="#999" opacity="1.000000" stroke="none"
	d="
M728.545654,540.133789
	C712.944214,540.145752 697.792725,540.130859 682.641174,540.119995
	C679.597717,540.117798 676.553711,539.962341 674.331238,537.527405
	C671.940796,534.908386 671.862183,531.755310 672.982971,528.614929
	C674.136047,525.383850 677.011597,523.959412 680.063049,523.927246
	C696.377197,523.755432 712.695618,523.708618 729.008850,523.912415
	C733.353638,523.966675 735.998718,526.747498 736.348755,531.266663
	C736.727112,536.151062 734.561462,538.722595 728.545654,540.133789
z"/>
<path fill="#999" opacity="1.000000" stroke="none"
	d="
M482.655090,311.000214
	C482.666290,305.175995 482.569489,299.848602 482.720490,294.528229
	C482.871124,289.218384 485.852631,286.109772 490.516724,286.049316
	C495.125885,285.989563 498.098022,288.605194 498.412567,293.806976
	C499.387207,309.924927 499.063232,326.066223 498.570892,342.189606
	C498.390808,348.088165 495.251007,350.639801 490.072754,350.297791
	C485.333649,349.984802 482.772461,347.042755 482.718384,341.449860
	C482.621857,331.467346 482.668732,321.483429 482.655090,311.000214
z"/>
<path fill="#999" opacity="1.000000" stroke="none"
	d="
M286.998444,523.766602
	C292.154846,523.781982 296.817474,523.658997 301.467072,523.850708
	C306.661926,524.064941 309.862946,527.212341 309.934479,531.796204
	C310.002380,536.147644 306.586517,539.965393 301.591858,540.029236
	C285.627777,540.233215 269.658081,540.221069 253.693497,540.038391
	C248.479340,539.978821 245.608871,536.639221 245.663406,531.770996
	C245.716522,527.031006 248.630371,523.974792 254.067291,523.865112
	C264.874084,523.646912 275.687958,523.779419 286.998444,523.766602
z"/>
<path fill="#999" opacity="1.000000" stroke="none"
	d="
M345.977936,376.022736
	C351.290680,381.344238 356.407196,386.363159 361.406036,391.496643
	C365.709229,395.915771 365.908661,400.741699 362.114655,404.255280
	C358.792603,407.331818 354.276733,406.851074 350.160553,402.763702
	C339.517365,392.195160 328.908508,381.591492 318.351868,370.936554
	C313.903198,366.446411 313.556427,361.742462 317.179504,358.259857
	C320.881134,354.701752 325.224182,355.192383 329.874451,359.811890
	C335.194305,365.096527 340.448120,370.447632 345.977936,376.022736
z"/>
<path fill="#999" opacity="1.000000" stroke="none"
	d="
M632.665527,378.665588
	C639.264404,372.069000 645.559692,365.667450 651.984253,359.398346
	C656.390869,355.098358 660.759277,354.842163 664.215698,358.411713
	C667.497314,361.800720 667.139709,366.667603 663.090088,370.755798
	C652.326416,381.622192 641.514771,392.441315 630.676025,403.232910
	C626.922668,406.969910 622.552551,407.197601 619.209534,404.017365
	C615.805420,400.778992 615.777039,395.865295 619.420044,392.015808
	C623.646667,387.549561 628.075806,383.274933 632.665527,378.665588
z"/>
</svg>
    </span>
    <span class="linkTitle____NPyM">Watch Alert</span>
`;


        newButton.addEventListener("click", event => {
            event.preventDefault();
            console.log("Watch Alert button clicked");

            // Show a confirm dialog before sending the webhook
            let userConfirmed = confirm("Send Watch Request?");
            if (userConfirmed) {
                sendWebhook();
            } else {
                console.log("User cancelled the Watch Request.");
            }
        });

        container.insertBefore(newButton, lastGamesButton);
        console.log("Button added successfully");
    }

    let observer = new MutationObserver((mutations, obs) => {
        if (document.querySelector(".linksContainer___LiOTN")) {
            addButton();
            obs.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
