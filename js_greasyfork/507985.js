// ==UserScript==
// @name               Auto Dark Mode for Oracle Live SQL
// @name:zh-TW         Oracle Live SQL 自動黑暗模式
// @description        Automatically switch the theme between light and dark, based on the browser’s color scheme preference.
// @description:zh-TW  根據瀏覽器的佈景主題設定，自動從明亮和黑暗模式間切換。
// @icon               data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAMAAABlApw1AAAA1VBMVEUAAADaz8/X08/a1NDZ09DGRTPXz8/GRjPX0s/a1M/Z09DKRTXZ1NDHRjPZ1NDGRDPZ09DX08/Y1NDGRTP8+/rHRjTHRzXGRTTZ09DHRTTHRTTFRjTY1M/ERTXHSDDIRjTY1NDHRjTHRjPZ09DHRTPY08/HRjTERTDZ1NDHRjTNXUz8+/rUc2Xbin715OHioZfhoJfOXU3ot6/KUUD48O3y2dX8+vnHRzXot7DvzsjlrKP58O7uzcjrw7zelorsw7zLUUHRaFn8+vjx2NTUc2brwrzQaFg7/KO7AAAAKHRSTlMAMH+/75Agr58w3jD+3+6groC+7/7+/u/uv76AjzAgrp7u3u2fj38w7RYQTQAAAlZJREFUeNrt2llv00AUxfGbQg20pi1JCkkBQ9nHY2dp0qZLukCB7/+RQGG5UsY8VAjCQf/z5jxY9yf5jCeZ2Lc8fdPvBKF0+uuFeYo7QTCvfhLedoJkXmx+nz+oZnchKO4H2ewXZrYdhPPMrPArzYdoPUjnsfW1AXv2SBuwb0E7uwAAAAAAAAAAHcBlKQ6I8aAUB8Q4LMUBcVArA5ygC1gQ3osDvM2CACeIA+JgKAcYxCVCLQaYjGJCkAB4xsfLhJNSA+AEf468zQoAT50QTksJgGd0llRBBeBVSAgaACdcJ4SPEgBP3dBmCYBn1EDQATRX4WyoAXDCp2WCDMCrIAtwgirAqyAOCJ8PpQGTU+lHaDKcSpf4Yiq9jFbJu3iuBKhOkvGroAMoD5L9aCWzmfPueqa1yna6efzRVdABpF8FfHwBQNrd87HQl/qycekRAfi2wXNYCf2w1bz0CAGalh4pQMP4woDjsegBhy89woB5xTHrSgDeXVGAjy8K8KVHFDCv+MMTAAAA/jvAbDn/FGAWb5wjAAAAKACOfpkPvAcAAAAAAAAAAAAAAPiR2Z/MQ3v3G4kx+sVqbpIDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABFQNROF8CqAZQYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwwMEBBwcclBgAAAAAAAAAAAAAAAAAAKgAbmsDtuyWNqBtD7QBT6wlDcgzsx1hQP7czLKeLmAjs69p5aqAly1bpLWhCPD5zbK7uR4g38nMk71u9/Ibp9vtJp/9nZv02mv3bJEvnM+9fClwaoYAAAAASUVORK5CYII=
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.0.0
// @license            MIT
// @match              https://livesql.oracle.com/apex/*
// @run-at             document-idle
// @grant              none
// @supportURL         https://greasyfork.org/scripts/507985/feedback
// @downloadURL https://update.greasyfork.org/scripts/507985/Auto%20Dark%20Mode%20for%20Oracle%20Live%20SQL.user.js
// @updateURL https://update.greasyfork.org/scripts/507985/Auto%20Dark%20Mode%20for%20Oracle%20Live%20SQL.meta.js
// ==/UserScript==

const toggle = document.getElementById("P0_DARKMODE");
const query = matchMedia("(prefers-color-scheme: dark)");

query.addEventListener("change", updateTheme);


const interval = setInterval(() =>
{
    if (document.body.classList.contains("is-darkmode") === query.matches)
    {
        clearInterval(interval);
    }
    else
    {
        toggle.checked = !query.matches;
        updateTheme(query);
    }
}, 100);

function updateTheme({ matches: isDarkMode })
{
    if (toggle.checked !== isDarkMode)
    {
        toggle.click();
    }
}
