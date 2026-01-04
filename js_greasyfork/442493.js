// ==UserScript==
// @name         Add badge markdown to pre-commit.ci
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add code of badge markdown to CI result pages in pre-commit.ci
// @author       eggplants
// @homepage     https://github.com/eggplants
// @match        *://results.pre-commit.ci/run/github/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442493/Add%20badge%20markdown%20to%20pre-commitci.user.js
// @updateURL https://update.greasyfork.org/scripts/442493/Add%20badge%20markdown%20to%20pre-commitci.meta.js
// ==/UserScript==
 
/*jshint esversion: 6 */
 
(function() {
    "use strict";
 
    const badge_base = "https://results.pre-commit.ci";
    const result_pathes = document.querySelectorAll("h2.pc-header.mb-3>a");
    const owner = result_pathes[0].innerText;
    const project = result_pathes[1].innerText;
    const branch = result_pathes[2].innerText;
 
    const badge_src = `${badge_base}/badge/github/${owner}/${project}/${branch}.svg`;
    const badge_href = `${badge_base}/latest/github/${owner}/${project}/${branch}`;
 
    const badge_area = document.createElement("div");
 
    const badge_img = document.createElement("img");
    badge_img.src = badge_src;
    const p_img = document.createElement("p");
    p_img.textContent = "badge preview: ";
    p_img.appendChild(badge_img);
    badge_area.appendChild(p_img);
 
    const badge_clip = document.createElement("input");
    badge_clip.value += `[![pre-commit.ci](${badge_src})](${badge_href})`;
    badge_clip.readOnly = true;
    const p_clip = document.createElement("p");
    p_clip.textContent = "markdown badge: ";
    p_clip.appendChild(badge_clip);
    badge_area.appendChild(p_clip);
 
    const target_parent = document.querySelector("div.container.bg-light.text-dark.py-5");
    const target = document.querySelector("div.pc-results.border.rounded.p-2");
    target_parent.insertBefore(badge_area, target);
})();
