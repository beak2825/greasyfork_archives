// ==UserScript==
// @name         OHS Reminder
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  Reminder Script for Our Hit Stop Members Concerning Amazon Shopping
// @require     http://code.jquery.com/jquery-2.1.4.min.js
// @require     http://code.jquery.com/ui/1.11.4/jquery-ui.min.js
// @author      Ian
// @match        https://www.amazon.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407694/OHS%20Reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/407694/OHS%20Reminder.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function() {
        const wrapper = document.createElement('div');
        wrapper.setAttribute('class','shadowroot');
        document.body.appendChild(wrapper)

        wrapper.attachShadow({mode: 'open'});
        wrapper.shadowRoot.innerHTML = `
            <style>
                .container {
                    position: fixed;
                    right: 5px;
                    top: 5px;
                    background: white;
                    box-shadow: 0 1px 6px 0 rgba(32,33,36,0.28);
                    z-index: 2147483647;
                    width: 520px;
                }

                .wrapper {
                    border: 3px solid black;
                    border-radius: 10px;
                    padding: 20px;
                    margin: 20px;
                    text-align: center;
                }

                .close-icon {
                    position: absolute;
                    right: 4px;
                    top: 4px;
                    font-weight: bold;
                    height: 18px;
                    width: 18px;
                    cursor: pointer;
                }

                .close-icon:hover {
                    height: 16px;
                    width: 16px;
                    right: 5px;
                    top: 5px;
                }

                .btn-container {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-evenly;
                    margin: 10px 0px;
                }

                .btn {
                    padding: 6px 40px;
                    font-size: 18px;
                    border-radius: 20px;
                    color: white;
                    border-width: 0px;
                    background-image: linear-gradient(#333395, #00d4ff);
                    cursor: pointer;
                }

                .otto-img {
                    position: absolute;
                    height: 60px;
                    right: 25px;
                    bottom: 25px;
                }
            </style>
            <div class="container">
                
            </div>
        `;

        if (localStorage.noFirstVisit === "true" && document.referrer === "" && sessionStorage.getItem("isVisited") === null) {
            wrapper.shadowRoot.querySelector(".container").innerHTML = `
                <div class="wrapper">
                    <img
                        class="close-icon"
                        alt="close-icon"
                        src="https://firebasestorage.googleapis.com/v0/b/otto-resource.appspot.com/o/icon-close-512.png?alt=media&token=c23b4276-8b3b-451e-8952-efc4bab7bdff"
                    />
                    <div>Would you like to use the Our Hit Stop Amazon Shopping Portal?</div>
                    <div class="btn-container">
                        <button class="yes-btn btn">Yes</button>
                        <button class="no-btn btn">No</button>
                    </div>
                    <div>The shopping portal costs you nothing, and a small percentage of your purchases goes towards site maintenance and costs.</div>
                    <div>Thank you!</div>
                    <img
                        class="otto-img"
                        src="https://firebasestorage.googleapis.com/v0/b/otto-resource.appspot.com/o/logo-Our-Hit_Stop.png?alt=media&token=cfd749e0-b798-4af4-97f8-0d2cf7773eb4"
                        alt="otto-img"
                    />
                </div>
            `

            wrapper.shadowRoot.querySelector(".yes-btn").onclick = function() {
                sessionStorage.setItem("isVisited", "true")
                window.open("https://amzn.to/2RHoaSq", "_self");
            };

            wrapper.shadowRoot.querySelector(".no-btn").onclick = function() {
                sessionStorage.setItem("isVisited", "true")
                wrapper.shadowRoot.querySelector(".container").style.display = "none";
            };
        } else if (localStorage.noFirstVisit === undefined) {
            wrapper.shadowRoot.querySelector(".container").innerHTML = `
                <div class="wrapper">
                    <img
                        class="close-icon"
                        alt="close-icon"
                        src="https://firebasestorage.googleapis.com/v0/b/otto-resource.appspot.com/o/icon-close-512.png?alt=media&token=c23b4276-8b3b-451e-8952-efc4bab7bdff"
                    />
                    <div>Thank you for installing the Out Hit Stop Shopping Reminder</div>
                    <div>To complete activation, please send the following code phrase to
                        <br />admin@ourhitstop.com
                    </div>
                    <div>Otto is my mTurk Co-Pilot</div>
                    <img
                        class="otto-img"
                        src="https://firebasestorage.googleapis.com/v0/b/otto-resource.appspot.com/o/logo-Our-Hit_Stop.png?alt=media&token=cfd749e0-b798-4af4-97f8-0d2cf7773eb4"
                        alt="otto-img"
                    />
                </div>
            `
            localStorage.noFirstVisit = "true";
        }

        closeIconHandler(wrapper.shadowRoot)
    })
    function closeIconHandler(document) {
        document.querySelector(".close-icon") && (document.querySelector(".close-icon").onclick = function() {
            document.querySelector(".container").style.display = "none";
        });
    }
})();