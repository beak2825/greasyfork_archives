// ==UserScript==
// @name        Sort Hacker News
// @description Adds a dropdown for sorting Hacker News (Y Combinator) by various criteria
// @match       https://news.ycombinator.com/
// @match       https://news.ycombinator.com/news
// @grant       none
// @namespace   http://foo.at/
// @version     1.0
// @downloadURL https://update.greasyfork.org/scripts/16911/Sort%20Hacker%20News.user.js
// @updateURL https://update.greasyfork.org/scripts/16911/Sort%20Hacker%20News.meta.js
// ==/UserScript==

/*
 * Copyright 2015-2016 Stefan Weiss <weiss@foo.at>
 * License: Public Domain
 * Please let me know if the HN layout changes and this script stops working for you.
 */

/* jshint esversion: 6 */
(function () {

    "use strict";

    const COMM_WEIGHT = 1.0,  // how much comments are worth ("auto" mode)
          VOTE_WEIGHT = 1.0;  // how much votes are worth ("auto" mode)

    const haufna = [],
          things = document.getElementsByClassName("athing"),
          initialSort = localStorage.gm__hn_sort || "score";

    if (things.length != 30) {
        console.error("Page doesn't contain the 30 expected items.");
        return;
    }

    analyzePage();
    insertDropdown();
    sortEm(initialSort);


    /// functions //////////////////////////////////////////////////////////////

    function _qs (sel, base)
    {
        return (base || document).querySelector(sel);
    }

    function analyzePage ()
    {
        for (let i = 0; i < things.length; ++i) {
            let line0 = things[i],
                line1 = line0.nextElementSibling,
                idEle = _qs(".age > a", line1),
                votesEle = _qs(".score", line1),
                commEle = _qs(".subtext > a:last-child", line1),
                votes = votesEle && parseInt(votesEle.textContent),
                comments = 0,
                id = 0;

            if (idEle && idEle.href) {
                id = +(idEle.href.match(/item\?id=(\d+)/) || [])[1] || 0;
            }
            if (commEle && /\d+ comments?/.test(commEle.textContent)) {
                comments = parseInt(commEle.textContent);
            }

            haufna.push({
                rank: i + 1,
                comments: comments,
                votes: votes,
                score: votes * VOTE_WEIGHT + comments * COMM_WEIGHT,
                id: id,
                line0: line0,
                line1: line1,
                spacer: line1.nextElementSibling,
            });
        }
    }

    function sortEm (crit)
    {
        const tbody = things[0].parentNode;
        localStorage.gm__hn_sort = crit;
        tbody.innerHTML = "";
        haufna.sort(getSorter(crit)).forEach(function(item) {
            tbody.appendChild(item.line0);
            tbody.appendChild(item.line1);
            tbody.appendChild(item.spacer);
        });
    }

    function getSorter (crit)
    {
        let inverter = 1;
        if (crit == "age-old") {
            crit = "id";
        } else if (crit == "age-new") {
            crit = "id";
            inverter = -1;
        } else if (crit == "score" || crit == "comments" || crit == "votes") {
            inverter = -1;
        }
        return function (a, b) {
            return a[crit] < b[crit] ? -1 * inverter : a[crit] > b[crit] ? 1 * inverter : 0;
        };
    }

    function insertDropdown ()
    {
        const menu = _qs("span.pagetop > a[href=submit]").parentNode,
              sel = document.createElement("select");

        sel.style.WebkitAppearance = "none";
        sel.style.MozAppearance = "none";
        sel.style.appearance = "none";
        sel.style.border = "0";
        sel.style.backgroundColor = "inherit";
        sel.style.color = "#000";
        sel.style.verticalAlign = "baseline";
        sel.style.fontSize = "inherit";
        sel.style.padding = "0";
        sel.style.margin = "0";

        sel.options[0] = new Option("sort by rank", "rank");
        sel.options[1] = new Option("sort by auto", "score");
        sel.options[2] = new Option("sort by votes", "votes");
        sel.options[3] = new Option("sort by comments", "comments");
        sel.options[4] = new Option("sort by newest", "age-new");
        sel.options[5] = new Option("sort by oldest", "age-old");
        sel.value = initialSort;

        menu.appendChild(document.createTextNode(" | "));
        menu.appendChild(sel);
        sel.onchange = function () {
            sortEm(sel.value);
        };
    }

})();
