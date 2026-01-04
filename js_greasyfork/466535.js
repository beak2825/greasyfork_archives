// ==UserScript==
// @name         cpasbien preview Image
// @namespace    https://www.cpasbien.moe/
// @version      2.3
// @description  Show image preview next to the titles by hovering the mouse (without caching and forcefully deleting old cache).
// @author       dr.bobo0
// @match        https://www-cpasbien.com/*
// @match        https://www.cpasbien.moe/*
// @match        https://www.cpasbien.wtf/*
// @match        https://www.cpasbien.rs/*
// @match        https://www.cpasbien.pm/*
// @match        https://www.cpasbien.city/*
// @match        https://www.cpasbien.sbs/*
// @match        https://www.cpasbien.*/*
// @include      https://www.cpasbien.*/*
// @include      https://www.cpasbien4.*/*
// @include      https://www.cpasbien.*/*
// @include      https://www.cpasbien.diy/*
// @icon     data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADEUlEQVR4nO2av0tbURTH38svNcGAaUWCHbqUpkpRpw5CoUJLwUkEkXQsqLugf4Lg4uKuCJnclNLBUhTdikOHJkZLqkUxRklM9MUYjenSod9vrMkjtWe497t9HvddvhzOPe+ee59ZLpfLhsJySBuQlg6AtAFpuey+EI9GgT8sLAA7uaSYpn1Xf6pUwvlbWoDDY2PAgUDA1vTKZ4AOgLQBaZl29wGRkRHgd+EwDmhuBizTGrYrs6kJuLC+jn5cWMbek79qUj4DdACkDUir6j6AS4TfsnBAWxuy0wlo1ttqNDYitrYCW3t7dU2vfAboAEgbkJbtXsDjoJgdHiJTDahbPh/y2Rmgi/3YlPIZoAMgbUBa9msAP8hkkHlNci/A5wMNDciFAvLaGqC1sgLsHhi43WiNUj4DdACkDUjLdg1w8xo+PUW+uUHm8dwbxOPIy8uA1s4O8D758QwO/sVpbVI+A3QApA1Iy1UqFuFBPpcDLl5dAZf5O51KIfN3//wcORZDpjVuXFwA+uic/zH1AhvZLHDm5ATYQTWJ51M+A3QApA1Iy4yursKHOTU6CgMe0V2c1+sFDnZ14YxcI2iNcj9fwbyvoF7jJp0G/kZnlFnaZ5Ab4+HmJrDyGaADIG1AWq4nvb3wwJqfB/ZOTAAHh4dxBlqTFTWAakYFu93I3EtcXgI6aN/ynMb/zOeBv8zNAb/s7MT5DMWlAyBtQFpV/w+I0T9B5vg4cGhoCF+gNVtxZsg1g/buFXx8fCcn6F7i++Ii8Jv+fuMuKZ8BOgDSBqRl+x+hFPX/PyYngV/09eELdJ5g7NOpXrUacHQEGN3eBi4uLQF39/QYdqR8BugASBuQlu0awErTd/3r1BTwq/Z2fMFDt4sHB8i7u4AbVBMezMwAP+voqNHp7VI+A3QApA1Iq+4awCpSv/55ehr4Lf9neH0N+DGRAO6enQUOBoN1OkQpnwE6ANIGpPXPawCLp/8UiQDntraAX9MZpN/vvx9jv6V8BugASBuQ1r3XAFYymQTO0l3g01Dof9rRGaADIG1AWr8AhIEBFM6P8KEAAAAASUVORK5CYII=
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466535/cpasbien%20preview%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/466535/cpasbien%20preview%20Image.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to clear all localStorage items related to this script
    function clearOldCache() {
        for(let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            if(key.startsWith('https://www.cpasbien.')) {
                localStorage.removeItem(key);
            }
        }
        console.log('Old cache cleared');
    }

    // Clear old cache on script load
    clearOldCache();

    document.querySelectorAll("td > a.titre").forEach(link => {
        link.addEventListener("mouseover", function(event) {
            let previewContainer = document.createElement("div");
            previewContainer.style.position = "fixed";
            previewContainer.style.display = "none";
            previewContainer.style.transition = "opacity 0.1s ease-in-out";
            previewContainer.style.opacity = 0;
            previewContainer.style.width = "216px";
            previewContainer.style.height = "307px";
            previewContainer.style.borderRadius = "10px"; // Rounded corners
            previewContainer.style.overflow = "hidden";
            document.body.appendChild(previewContainer);

            var url = link.href;
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.responseType = "document";

            xhr.onload = function() {
                let preview = xhr.response.querySelector("#bigcover img");
                previewContainer.innerHTML = `<img style="width: 100%; height: 100%;" src="${preview.getAttribute("src")}"/>`;
            };

            document.addEventListener("mousemove", function (event) {
                previewContainer.style.top = event.clientY + 20 + "px";
                previewContainer.style.left = event.clientX + 20 + "px";

                // Check if preview container is too close to edge of viewport
                if (previewContainer.getBoundingClientRect().right > window.innerWidth) {
                    previewContainer.style.left = (window.innerWidth - previewContainer.offsetWidth - 20) + "px";
                }
                if (previewContainer.getBoundingClientRect().bottom > window.innerHeight) {
                    previewContainer.style.top = (window.innerHeight - previewContainer.offsetHeight - 20) + "px";
                }
            });

            xhr.send();
            previewContainer.style.display = "block";
            setTimeout(function () {
                previewContainer.style.opacity = 1;
            }, 0);
        });

        link.addEventListener("mouseout", function() {
            let previewContainer = document.querySelector("div[style*='opacity: 1']");
            if (previewContainer) {
                previewContainer.style.opacity = 0;
                setTimeout(function () {
                    previewContainer.style.display = "none";
                    previewContainer.remove();
                }, 100);
            }
        });
    });
})();