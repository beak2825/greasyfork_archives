// ==UserScript==
// @name        IMDb rating sanitiser.
// @namespace   dicks
// @description Replaces rating on IMDb title pages with Non-US user rating.
// @include     http*://*.imdb.com/title/tt*
// @include     http*://imdb.com/title/tt*
// @version     0005
// @downloadURL https://update.greasyfork.org/scripts/3438/IMDb%20rating%20sanitiser.user.js
// @updateURL https://update.greasyfork.org/scripts/3438/IMDb%20rating%20sanitiser.meta.js
// ==/UserScript==
function main(url, combined) {
    $.ajax({
        url: url + 'ratings-international',
        success: function (data) {
            var line = $(data).find('#tn15content').find('p').eq(0).text();
            if (!line) {
                return false;
            }

            var realvotes = line.match(/^(\d+) Non-US users/)[1].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' non-US ',
                realscore = line.match(/vote of (\d+\.?\d*) \/ 10/)[1];

            if (combined) {
                var star = $('#general-voting-stars'),
                    rate = $('.starbar-meta').find('b').eq(0),
                    vote = $('.tn15more').eq(0);
            } else {
                var star = $('.imdbRating').eq(0).find('span'),
                    rate = star.eq(0),
                    vote = star.eq(3);
            }

            star.fadeOut(400);
            rate.fadeOut(400);
            vote.fadeOut(400);
            setTimeout(function () {
                if (combined) {
                    star.width((realscore * 20));
                }
                rate.text(realscore + (combined ? '/10' : ''));
                vote.text(realvotes + (combined ? 'votes' : ''));
            }, 400);
            star.fadeIn(400);
            rate.fadeIn(400);
            vote.fadeIn(400);
        }
    });
}

combined = (location.href.match(/\/combined\/?/)) ? true : false;
url = location.href.replace(/(combined\/?|\?(pf_rd_m|ref_)=).*/g, '');
if (url.match(/\/title\/tt\d{7,}\/$/)) {
    main(url, combined);
}
