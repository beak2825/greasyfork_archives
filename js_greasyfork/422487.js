// ==UserScript==
// @name         Make APR sections foldable
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://ukri.sharepoint.com/sites/i-apdr/sitepages/EditForm.aspx?XmlLocation=/sites/i-apdr/Appraisals*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422487/Make%20APR%20sections%20foldable.user.js
// @updateURL https://update.greasyfork.org/scripts/422487/Make%20APR%20sections%20foldable.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const MID_YEAR_REVIEW_HEADING = "fv_br7lcQpYkXibYZIB_0";
    const MID_YEAR_REVIEW_COMMENTS = "fy_br7lcQpYkXibYZIB_0";
    const MID_YEAR_REVIEW_DATE = "f1_br7lcQpYkXibYZIB_0";
    const MID_YEAR_REVIEW_LM_COMMENTS = "f4_br7lcQpYkXibYZIB_0";
    const MID_YEAR_REVIEW_LM_DATE = "f6_br7lcQpYkXibYZIB_0";
    const ANNUAL_REVIEW_HEADING = "bu_br7lcQpYkXibYZIB_0";
    const ANNUAL_REVIEW_COMMENTS = "ga_br7lcQpYkXibYZIB_0";
    const ANNUAL_REVIEW_DATE = "fq_br7lcQpYkXibYZIB_0";
    const ANNUAL_REVIEW_LM_COMMENTS = "gf_br7lcQpYkXibYZIB_0";
    const ANNUAL_REVIEW_LM_DATE = "gg_br7lcQpYkXibYZIB_0";

    function makeClickable(elem, classes) {
        elem.shown = true;
        elem.onclick = () => {
            for (let i = 0; i < classes.length; i++) {
                const children = elem.parentElement.getElementsByClassName(classes[i]);
                for (let j = 0; j < children.length; j++) {
                    // skip the first element containing ANNUAL_REVIEW_DATE, because that one happens
                    // to be duplicated as the Objective status row.
                    if (children[j].classList.contains(ANNUAL_REVIEW_DATE) && j == 0) {
                        continue;
                    }
                    children[j].style.display = !elem.shown ? "block" : "none";
                }
            }
            elem.shown = !elem.shown;
        }
        elem.click()

    }
    const mid_year_elems = document.getElementsByClassName(MID_YEAR_REVIEW_HEADING);
    for (let x = 0; x < mid_year_elems.length; x++) {
        makeClickable(mid_year_elems[x], [MID_YEAR_REVIEW_COMMENTS, MID_YEAR_REVIEW_DATE, MID_YEAR_REVIEW_LM_COMMENTS, MID_YEAR_REVIEW_LM_DATE]);

    }

    const annual_elems = document.getElementsByClassName(ANNUAL_REVIEW_HEADING);
    for (let x = 0; x < annual_elems.length; x++) {
        makeClickable(annual_elems[x], [ANNUAL_REVIEW_COMMENTS, ANNUAL_REVIEW_DATE, ANNUAL_REVIEW_LM_COMMENTS, ANNUAL_REVIEW_LM_DATE]);
    }
})();