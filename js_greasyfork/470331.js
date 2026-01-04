// ==UserScript==
// @name         Glitch Checkmark
// @namespace    http://checkmark.glitch.me/
// @version      0.1
// @description  Add checkmarks to Glitch user profiles
// @author       You
// @match        *://glitch.com/*
// @icon         https://addons.mozilla.org/user-media/addon_icons/2805/2805267-64.png
// @grant        none
// @licence      MIT
// @downloadURL https://update.greasyfork.org/scripts/470331/Glitch%20Checkmark.user.js
// @updateURL https://update.greasyfork.org/scripts/470331/Glitch%20Checkmark.meta.js
// ==/UserScript==

(async function() {

    const $ = (e) => document.querySelector(e);
const $$ = (e) => document.querySelectorAll(e);
const verSvg = `data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M7.59175 1.20025C7.43448 1.34256 7.26921 1.47578 7.09675 1.59925C6.79875 1.79925 6.46375 1.93725 6.11175 2.00725C5.95875 2.03725 5.79875 2.05025 5.47975 2.07525C4.67875 2.13925 4.27775 2.17125 3.94375 2.28925C3.56185 2.42409 3.21498 2.64272 2.9286 2.9291C2.64222 3.21548 2.42359 3.56235 2.28875 3.94425C2.17075 4.27825 2.13875 4.67925 2.07475 5.48025C2.06384 5.69202 2.04114 5.90301 2.00675 6.11225C1.93675 6.46425 1.79875 6.79925 1.59875 7.09725C1.51175 7.22725 1.40775 7.34925 1.19975 7.59225C0.67875 8.20425 0.41775 8.51025 0.26475 8.83025C-0.08825 9.57025 -0.08825 10.4303 0.26475 11.1703C0.41775 11.4903 0.67875 11.7963 1.19975 12.4083C1.40775 12.6513 1.51175 12.7733 1.59875 12.9033C1.79875 13.2013 1.93675 13.5363 2.00675 13.8883C2.03675 14.0413 2.04975 14.2013 2.07475 14.5203C2.13875 15.3213 2.17075 15.7223 2.28875 16.0563C2.42359 16.4382 2.64222 16.785 2.9286 17.0714C3.21498 17.3578 3.56185 17.5764 3.94375 17.7113C4.27775 17.8293 4.67875 17.8613 5.47975 17.9253C5.79875 17.9503 5.95875 17.9633 6.11175 17.9933C6.46375 18.0633 6.79875 18.2023 7.09675 18.4013C7.22675 18.4883 7.34875 18.5923 7.59175 18.8003C8.20375 19.3213 8.50975 19.5823 8.82975 19.7353C9.56975 20.0883 10.4298 20.0883 11.1698 19.7353C11.4898 19.5823 11.7958 19.3213 12.4078 18.8003C12.6508 18.5923 12.7728 18.4883 12.9028 18.4013C13.2008 18.2013 13.5357 18.0633 13.8877 17.9933C14.0407 17.9633 14.2008 17.9503 14.5198 17.9253C15.3208 17.8613 15.7217 17.8293 16.0557 17.7113C16.4377 17.5764 16.7845 17.3578 17.0709 17.0714C17.3573 16.785 17.5759 16.4382 17.7108 16.0563C17.8288 15.7223 17.8607 15.3213 17.9247 14.5203C17.9497 14.2013 17.9628 14.0413 17.9928 13.8883C18.0628 13.5363 18.2017 13.2013 18.4007 12.9033C18.4877 12.7733 18.5917 12.6513 18.7997 12.4083C19.3207 11.7963 19.5818 11.4903 19.7348 11.1703C20.0878 10.4303 20.0878 9.57025 19.7348 8.83025C19.5818 8.51025 19.3207 8.20425 18.7997 7.59225C18.6574 7.43498 18.5242 7.26971 18.4007 7.09725C18.2009 6.79914 18.0623 6.46434 17.9928 6.11225C17.9584 5.90301 17.9357 5.69202 17.9247 5.48025C17.8607 4.67925 17.8288 4.27825 17.7108 3.94425C17.5759 3.56235 17.3573 3.21548 17.0709 2.9291C16.7845 2.64272 16.4377 2.42409 16.0557 2.28925C15.7217 2.17125 15.3208 2.13925 14.5198 2.07525C14.308 2.06434 14.097 2.04164 13.8877 2.00725C13.5357 1.93774 13.2009 1.79906 12.9028 1.59925C12.7305 1.47552 12.5652 1.34231 12.4078 1.20025C11.7958 0.679252 11.4898 0.418252 11.1698 0.265252C10.8044 0.0906332 10.4047 0 9.99975 0C9.59484 0 9.19507 0.0906332 8.82975 0.265252C8.50975 0.418252 8.20375 0.679252 7.59175 1.20025ZM14.3727 7.86325C14.5141 7.70856 14.5903 7.50533 14.5856 7.29585C14.5809 7.08636 14.4956 6.88677 14.3474 6.73861C14.1992 6.59045 13.9996 6.50512 13.7902 6.5004C13.5807 6.49568 13.3774 6.57192 13.2227 6.71325L8.37275 11.5633L6.77675 9.96825C6.62206 9.82692 6.41882 9.75068 6.20934 9.7554C5.99986 9.76012 5.80027 9.84545 5.65211 9.99361C5.50394 10.1418 5.41862 10.3414 5.4139 10.5508C5.40918 10.7603 5.48541 10.9636 5.62675 11.1183L7.79675 13.2883C7.94936 13.4405 8.15615 13.5261 8.37175 13.5261C8.58735 13.5261 8.79414 13.4405 8.94675 13.2883L14.3738 7.86325H14.3727Z' fill='url(%23paint0_linear_2534_1259)'/%3E%3Cdefs%3E%3ClinearGradient id='paint0_linear_2534_1259' x1='9.99975' y1='0' x2='9.99975' y2='20' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23FF7698'/%3E%3Cstop offset='1' stop-color='%232800FF'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E`;

    var loc = location.pathname;
    if (loc.endsWith("/")) {
        loc = loc.slice(0, -1);
    }

    var verifiedUsers = await (await fetch("https://api.glitch.com/projects/verapi/readme")).text();
    verifiedUsers = verifiedUsers.split("\n");

    const currentUser = (JSON.parse(localStorage.getItem("cachedUser")).login || "")

    var i = setInterval(function() {
        if ($("main#main")) {
            clearInterval(i)
            if (loc.startsWith("/@") && location.pathname.split("/").length == 2) {
                isProfilePage()
            }
        }
    }, 1)

    setInterval(function () {
        auto()
    }, 100)


    const isProfilePage = async function() {
        const pageUser = loc.replace("@", "").replace("/", "")
        if (currentUser == pageUser) {
            return;
        }
        if (!($('div[class*="_profileInfo_"] h1.heading'))) {
            return;
        }


        var check = false;
        verifiedUsers.forEach(user => {
            if (user == pageUser) {
                check = true
            }
        })
        if (check) {
            var el = $('div[class*="_profileInfo_"] h1.heading');
            verify(el)
        }
    }

    const auto = async function() {
        $$("a[href^='/@']").forEach(function(el) {
            if (el.getAttribute("data-verified") == "yes") {
                return;
            }
            if (!el.getAttribute("href").startsWith("/@")) {
                return;
            }
            if (el.innerHTML.includes(`class="avatar__`)) {
                return;
            }
            const pageUser = el.getAttribute("href").replaceAll("@", "").replaceAll("/", "");
            console.log("reading ", pageUser)

            var check = false;
            verifiedUsers.forEach(user => {
                if (user == pageUser) {
                    check = true
                }
            })
            if (check) {
                verify(el.querySelector("span"))
                el.setAttribute("data-verified", "yes")
            }

        })
    }

    const verify = function(el) {
        console.log("verifying", el)
        el.innerHTML = `${el.innerHTML} <img src="${verSvg}" alt="Verified" title="Verified" data-tooltip="Glitch Team Member" style="width: 1rem;height: 1rem;margin-bottom: -1px;">`;
    }
})();