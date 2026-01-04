// ==UserScript==
// @name         atbmarket.com - price spy
// @name:uk         atbmarket.com - price spy
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Follow products and get notified when price changes
// @description:uk Слідкуйте за продуктами та отримуйте сповіщення, коли ціни змінюються
// @author       Untiy16
// @license      MIT
// @match        https://www.atbmarket.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atbmarket.com
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js
// @downloadURL https://update.greasyfork.org/scripts/497372/atbmarketcom%20-%20price%20spy.user.js
// @updateURL https://update.greasyfork.org/scripts/497372/atbmarketcom%20-%20price%20spy.meta.js
// ==/UserScript==

'use strict';
let url = window.location.href.split('?')[0];
let getFollowedStatus = function () { return $('.product-page-follow-icon').data('followed'); };
let getEyeIconSvgHtml = function (isFollowed = false) { return `<svg class="product-page-follow-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000" height="800px" width="800px" version="1.1" viewBox="0 0 512 512" enable-background="new 0 0 512 512" data-followed="${isFollowed}" style="width:24px;fill:${isFollowed ? 'green' : 'red'}"><g><path d="m494.8,241.4l-50.6-49.4c-50.1-48.9-116.9-75.8-188.2-75.8s-138.1,26.9-188.2,75.8l-50.6,49.4c-11.3,12.3-4.3,25.4 0,29.2l50.6,49.4c50.1,48.9 116.9,75.8 188.2,75.8s138.1-26.9 188.2-75.8l50.6-49.4c4-3.8 11.7-16.4 0-29.2zm-238.8,84.4c-38.5,0-69.8-31.3-69.8-69.8 0-38.5 31.3-69.8 69.8-69.8 38.5,0 69.8,31.3 69.8,69.8 0,38.5-31.3,69.8-69.8,69.8zm-195.3-69.8l35.7-34.8c27-26.4 59.8-45.2 95.7-55.4-28.2,20.1-46.6,53-46.6,90.1 0,37.1 18.4,70.1 46.6,90.1-35.9-10.2-68.7-29-95.7-55.3l-35.7-34.7zm355,34.8c-27,26.3-59.8,45.1-95.7,55.3 28.2-20.1 46.6-53 46.6-90.1 0-37.2-18.4-70.1-46.6-90.1 35.9,10.2 68.7,29 95.7,55.4l35.6,34.8-35.6,34.7z"></path></g></svg>`; }
let updateEyeIconSvgHtml = function (isFollowed = false) { $('.product-page-follow-icon').css('fill', isFollowed ? 'green' : 'red').attr('data-followed', isFollowed).data('followed', isFollowed); }
// .product-main .product-button
$.ajax({
    url: 'https://untiy16.s-host.net/api/supermarket-products/is-followed',
    data: {
        url: url
    },
    success: function (response) {
        let $button = $('.product-main .product-button').clone();
        $button.find('input').remove();
        $button.find('.product-button__wrapper').html(getEyeIconSvgHtml(response.data.is_followed));
        $button.on('click', function (e) {
            if (getFollowedStatus() === true) {
                $.post('https://untiy16.s-host.net/api/supermarket-products/unfollow', { url: url }, function (response) {
                    if (response.data > 0) {
                        updateEyeIconSvgHtml(false);
                    }
                });
            } else {
                $.post('https://untiy16.s-host.net/api/supermarket-products/follow', { url: url, name: $('.product-page__title').text() }, function (response) {
                    updateEyeIconSvgHtml(true);
                });
            }
        });
        $button.insertAfter('.product-main .product-button');

    }
});

let chartData = [];
let year = new URLSearchParams(window.location.search).get('year') ?? new Date().getFullYear();
$.get('https://untiy16.s-host.net/api/supermarket-products/price-history', { url: url, year: year }, function(response) {
    if (response.data && response.data.prices.length) {
        chartData = response?.data?.prices ?? [];

        if (chartData.length) {
            $('.product-about__available-row').append('<div style="width: 800px;"><canvas id="acquisitions"></canvas></div>');//style="width: 800px;"
            new Chart(document.getElementById('acquisitions'), {
                type: "line",
                data: {
                    labels: chartData.map(row => row.date.split('(')[0].trim()),
                    datasets: [{
                        rangeCount: chartData.map(row => row.date.split('(')[1].replace(')','')),
                        label: `Ціна в ${year} році`,
                        backgroundColor: "rgba(0,0,255,1.0)",
                        borderColor: "rgba(0,0,255,0.1)",
                        data: chartData.map(row => row.price)
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    aspectRatio: 0.7,
                    plugins: {
                      tooltip: {
                        callbacks: {
                            title: (tooltipItems) => {
                                let title = `Дата: ${tooltipItems[0].label}`;
                                let rangeCount = parseInt(tooltipItems[0].dataset.rangeCount[tooltipItems[0].dataIndex]);
                                if (rangeCount !== 1) {
                                    title += ` (${rangeCount})`;
                                }

                                return title;
                            },
                            label: (tooltipItems) => `Ціна: ${tooltipItems.formattedValue}`,
                        }
                      }
                    },
                }
            });
        }
    }
});





//-------------- STYLES ---------------//

GM_addStyle(/*css*/`
    
`);