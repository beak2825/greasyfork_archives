// ==UserScript==
// @name         x-kom omnibus price chart
// @namespace    https://www.x-kom.pl/
// @version      1.2
// @description  draw price history chart
// @author       ( ͡° ͜ʖ ͡°)
// @match        https://www.x-kom.pl/p/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x-kom.pl
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457586/x-kom%20omnibus%20price%20chart.user.js
// @updateURL https://update.greasyfork.org/scripts/457586/x-kom%20omnibus%20price%20chart.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // add chartjs
    var scriptElement = document.createElement("script");
    scriptElement.type = "text/javascript";
    scriptElement.src = "https://cdn.jsdelivr.net/npm/chart.js";
    document.body.appendChild( scriptElement );

    scriptElement.addEventListener('load', function(e) {
        // console.log('chartjs added', e);
    });

    // intercept request
    const origOpen = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function() {
        this.addEventListener('load', function() {
            const { responseURL, response } = this;

            if(responseURL.includes('priceChanges')) {
                const priceChanges = response.PriceChanges;

                // add chart
                const canvas = document.createElement('canvas');
                canvas.id = 'chart';
                canvas.style = 'width:100%; max-width:100%; max-height: 300px;';
                canvas.width = canvas.offsetWidth;
                document.body.appendChild(canvas);

                const [, nav] = document.querySelectorAll('nav');
                const container = nav.parentNode;
                container.insertBefore(canvas, nav);

                const data = {
                    labels: priceChanges.map(priceChange => {
                        const d = new Date(priceChange.CreateDate);
                        const ye = new Intl.DateTimeFormat('pl', { year: 'numeric' }).format(d);
                        const mo = new Intl.DateTimeFormat('pl', { month: 'short' }).format(d);
                        const da = new Intl.DateTimeFormat('pl', { day: '2-digit' }).format(d);
                        return `${da} ${mo} ${ye}`;
                    }),
                    datasets: [{
                        label: 'Price history',
                        data: priceChanges.map(priceChange => priceChange.Price),
                        fill: false,
                        tension: 0.2
                    }]
                };

                const myChart = new Chart("chart", {
                    type: "line",
                    data,
                    options: {
                        plugins: {
                            legend: {
                                display: false
                            },
                            datalabels: {
                                display: false
                            }
                        }
                    }

                });
            }
        });
        origOpen.apply(this, arguments);
    };

})();