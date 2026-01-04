// ==UserScript==
// @name         Pixiv ranking scatter plot
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Show a scatter plot of date versus rank
// @author       cro
// @match        https://www.pixiv.net/dashboard/report/ranking*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixiv.net
// @grant        none
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/chart.js@3.7.1/dist/chart.min.js
// @require      https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns@2.0.0/dist/chartjs-adapter-date-fns.bundle.min.js
// @downloadURL https://update.greasyfork.org/scripts/441474/Pixiv%20ranking%20scatter%20plot.user.js
// @updateURL https://update.greasyfork.org/scripts/441474/Pixiv%20ranking%20scatter%20plot.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

(function() {
    'use strict';
    let zipwith = (a, b, f) => a.map((k, i) => f(k, b[i]));
    let jpcn_regex = /(\d+)\D(\d+)\D(\d+)\D/;
    let rank_regex = /\d+/;
    let date_parse = function(str)
    {
        let match = str.match(jpcn_regex);
        if (match)
        {
            str = `${match[1]} ${match[2]} ${match[3]}`;
        }
        return new Date(str);
    };

    let menubar = document.querySelector('section.analytics-menu-unit');
    let div = document.createElement('div');
    let canvas = document.createElement('canvas');
    canvas.style.backgroundColor = 'white';
    div.appendChild(canvas);
    menubar.insertAdjacentElement('beforeBegin', div);
    let dates = Array.from(document.querySelectorAll('h1.date')).map(x => date_parse(x.textContent));
    let top_rank = function(n)
    {
        let crown = document.querySelector(`.crown${n}`);
        return crown ? Array.from(crown.nextSibling.querySelectorAll('h1.date')).map(x => n) : [];
    }
    let top_ranks = [1,2,3].map(top_rank).flat();
    let ranks = top_ranks.concat(Array.from(document.querySelectorAll('h1.rank')).map(x => parseInt(x.textContent.match(rank_regex))));
    let data = {
        datasets: [{
            label: 'Date vs Rank',
            data: zipwith(dates, ranks, (date, rank) => ({ x: date, y: rank })),
            backgroundColor: 'black'
        }]
    };
    let config = {
        type: 'scatter',
        data: data,
        options: {
            animation: false,
            scales: {
                x: {
                    type: 'time',
                    display: true,
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Rank'
                    },
                    reverse: true,
                    min: 0,
                    suggestedMax: 100,
                }
            }
        }
    };
    let chart = new Chart(canvas, config);
})();