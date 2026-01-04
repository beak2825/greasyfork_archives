// ==UserScript==
// @name         Letterboxd Friend Ratings Analyzer
// @version      3.8
// @description  Show ratings by your friends in a histogram, similar to the one Letterboxd shows for all user ratings.
// @match        https://letterboxd.com/film/*
// @run-at       document-end
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/509173/Letterboxd%20Friend%20Ratings%20Analyzer.user.js
// @updateURL https://update.greasyfork.org/scripts/509173/Letterboxd%20Friend%20Ratings%20Analyzer.meta.js
// ==/UserScript==

const username = "YOUR_USERNAME_HERE";
const film = location.pathname.split('/').at(-2);
const ratingString = (count) => count === 1 ? "rating" : "ratings";

const fetchRatings = (user, film) =>
    fetch(`/${user}/friends/film/${film}/ratings/rated/.5-5/`)
        .then(response => response.text())
        .then(html =>
            Array.from(new DOMParser().parseFromString(html, 'text/html').querySelectorAll(".film-rating-group"))
                .flatMap(section => {
                    const [, score] = section.querySelector("h2 > .rating")?.className.match(/rated-large-(\d+)/) || [];
                    const reviewCount = section.querySelectorAll("ul.avatar-list > li").length;
                    return score ? Array(reviewCount).fill(parseFloat(score) / 2) : [];
                })
        );

const constructHistogram = (ratings, user, film) => {
    const bins = Array(10).fill(0);
    ratings.forEach(rating => bins[Math.floor((rating - 0.5) * 2)]++);
    const maxCount = Math.max(...bins);

    return `
        <section class="section ratings-histogram-chart" style="height: 27px;">
            <div class="rating-histogram rating-histogram-exploded">
                <span class="rating-green rating-green-tiny rating-1"><span class="rating rated-2">★</span></span>
                <ul>
                    ${bins.map((count, index) => {
                        const stars = ((index / 2) + 0.5).toFixed(1);
                        const ratingLink = `/${user}/friends/film/${film}/rated/${stars}/`;
                        const barHtml = `<i style="height: ${(maxCount ? (count / maxCount) * 44 : 1)}px;"></i>`;
                        return `
                            <li class="rating-histogram-bar" style="width: 15px; left: ${index * 16}px">
                                ${count > 0 ?
                          				`<a href="${ratingLink}" class="ir tooltip" title="${count} ${'★'.repeat(stars).concat(stars % 1 === 0 ? '' : '½')} ${ratingString(count)}">${stars}★ ${barHtml}</a>`
                        					: `${stars}★ ${barHtml}`}
                            </li>
                        `;
                    }).join('')}
                </ul>
                <span class="rating-green rating-green-tiny rating-5"><span class="rating rated-10">★★★★★</span></span>
            </div>
        </section>
    `;
};

const placeHistogram = (histogramHtml, averageRating, user, film, count) => {
    const globalHistogramSection = document.querySelector('.ratings-histogram-chart');
    if (globalHistogramSection) {
        const friendsRatingsLink = `/${user}/friends/film/${film}/rated/.5-5/`;
        const friendsHistogramSection = document.createElement('section');
        friendsHistogramSection.classList.add('section', 'ratings-histogram-chart');
        friendsHistogramSection.innerHTML = `
            <h2 class="section-heading">
                <a href="${friendsRatingsLink}">Ratings from friends</a>
                <span class="average-rating">
                    <a href="${friendsRatingsLink}" title="${count} ${ratingString(count)}">
                        <span class="display-rating">${averageRating}</span>
                    </a>
                </span>
            </h2>
            ${histogramHtml}
        `;
        globalHistogramSection.parentNode.insertBefore(friendsHistogramSection, globalHistogramSection.nextSibling);
    }
};

fetchRatings(username, film)
    .then(ratings => {
        if (ratings.length) {
            const averageRating = (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1);
            placeHistogram(constructHistogram(ratings, username, film), averageRating, username, film, ratings.length);
        }
    });