// ==UserScript==
// @name         IMDb rating sanitizer
// @author       anon
// @description  shows arithmetic mean of ratings submitted by males aged 18-44
// @include      /^https://www\.imdb\.com/title/tt\d*/(\?|$)/
// @grant        none
// @version      0.0.1.20181229233300
// @namespace    https://greasyfork.org/users/85937
// @downloadURL https://update.greasyfork.org/scripts/376060/IMDb%20rating%20sanitizer.user.js
// @updateURL https://update.greasyfork.org/scripts/376060/IMDb%20rating%20sanitizer.meta.js
// ==/UserScript==

(function(){
    var round = 1;
    var finalRatingSum = 0;
    var finalRatingCount = 0;

    const ratingsIFrame = document.createElement('iframe');
    ratingsIFrame.style.display = 'none';
    ratingsIFrame.sandbox = 'allow-same-origin';
    ratingsIFrame.onload = function() {
        // muh accuracy
        [...ratingsIFrame.contentDocument.querySelectorAll('table:nth-child(7) td:nth-child(3)')].forEach((v, i) => {
            const ratingCount = parseInt(v.textContent.replace(/,/g, ''));
            finalRatingSum += ratingCount * (10 - i);
            finalRatingCount += ratingCount
        });

        if (round == 1) {
            ratingsIFrame.src = ratingsIFrame.src.replace(/.{5}$/, '30_44');
            round++
        }
        else {
            const finalRatingValue = (finalRatingSum / finalRatingCount).toFixed(1);
            finalRatingCount = finalRatingCount.toLocaleString();
            document.querySelector('.imdbRating a').textContent = finalRatingCount;
            document.querySelector('.ratingValue *').title = `${finalRatingValue} based on ${finalRatingCount} user ratings`;
            document.querySelector('[itemprop=ratingValue]').textContent = finalRatingValue;
            ratingsIFrame.parentNode.removeChild(ratingsIFrame)
        }
    }
    ratingsIFrame.src = location.href.split('?')[0] + 'ratings?demo=males_aged_18_29';
    document.body.appendChild(ratingsIFrame)
})();