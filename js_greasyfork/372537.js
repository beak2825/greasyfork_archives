// ==UserScript==
// @name         Sonemic: Auto count average tracks rating with modifiers
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  .
// @author       https://rateyourmusic.com/~PusH
// @match        https://rateyourmusic.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372537/Sonemic%3A%20Auto%20count%20average%20tracks%20rating%20with%20modifiers.user.js
// @updateURL https://update.greasyfork.org/scripts/372537/Sonemic%3A%20Auto%20count%20average%20tracks%20rating%20with%20modifiers.meta.js
// ==/UserScript==

(() => {
    'use strict';

    /*
    Use recountRating(...ratings) in console to manually count any rating combinations. Function should return object with ratings info.
    For example: recountRating(1,2,3,4,5,6,7,8,9,10) should print this object:
        averageRating: 5.5 - raw average rating counted by adding all rating values then multiplying by number of ratings
        bonusRating: 0.45 - added bonus rating for some number of tracks rated higher than average rating
        highestPercent: {highestRatingPercent: 40, highestRatingCount: 4} - object with two keys. "highestRatingPercent" is the percent of ratings and "highestRatingCount" is number of ratings higher or equal to the avarage rating
        ratingsString: "1, 2, 3, 4, 5, 6, 7, 8, 9, 10" - shows string of entered values
        realAverageRating: "7.24/20" - real counted average rating with all modifiers, excluding bonus rating, not converted to result rating scale
        resultRatingScale: 100 - current final rating scale (maximum rating)
        rymScaleSuggestedAverageRating: "3.5" - suggested rating on 5-grade rating scale
        shownAverageRating: 60 - final rating
        suggestedAverageRating: 7 - which rating will be suggested by script with that ratings combination

        So, avarage rating is 7 and ratings 7,8,9,10 are counted in highestPercent object. Release need more than 33.33% of highestPercent ratings to get counted suggested average rating.
        Also bonus rating is 0.45 (rating 8 gives additional +0.11, 9 adds +0.14 and 10 adds +0.2).
    */

    //Final rating scale.
    //RYM has only 5-grade rating scale, so, for RYM resultRatingScale should be 5. Sonemic has 100-grade rating scale, so, on Sonemic, resultRatingScale would be 100.
    //If this is more than 10, shownAverageRating would be rounded to integer number.
    const resultRatingScale = 100;

    //By how much single track rating will be multiplied.
    //For example, rating 5/10 will be multiplied by 0.9 and will result in 4.5. Otherwise, 9 will be multiplied by 1.7 what will result in 15.30.
    //Also, 10 * 2 is the highest rating (and 1 * 0.5 is the minimum rating), so ratings goes from 0.5 to 20. As result, script suggests RYM ratings going from 1 to 10.
    const ratingsModifiers = {
        1: .5, //0.50/20
        2: .6, //1.20
        3: .7, //2.10
        4: .8, //3.20
        5: .9, //4.50
        6: 1, //6.00
        7: 1.2, //8.40
        8: 1.4, //11.20
        9: 1.7, //15.30
        10: 2 //20
    };

    //Script will suggest overall release rating by average track rating values multiplied by rating modifiers, which are specified in ratingsModifiers object.
    //Example: release with all 9 ratings will have these multiplied by 1.7 modifier received from ratingsModifiers object. So, average multiplied rating will be 15.30.
    //This means, 15.30 > 13 but less than 16.25, so script will show 9 as suggested rating.
    //Also, release need at least one track of some rating to be elegible for that rating.
    const suggestedRatingValues = {
        1: 0,
        2: 0.9,
        3: 1.7,
        4: 2.65,
        5: 3.8,
        6: 4.85,
        7: 6.9,
        8: 9.6,
        9: 12.95,
        10: 16.25
    };

    //Script can suggest higher release average rating by this modifier if there is any tracks higher than average rating.
    //For example: recountRating(7, 7, 8, 9, 8, 8, 10, 7, 9, 9) results in 12.57 average rating, which is lower for 9/10 rating (13).
    //But release has one 10/10 track, so suggested average rating is reduced by modifier 0.6, 13 - 0.6 = 12.40, and script will suggest 9/10 for this release, because 12.57 > 12.40.
    //This is edge cases, I don't have much release ratings changed by these modifiers.
    const suggestedMinimumRatingValueModifier = .6;

    //There are bonus rating for releases with low average rating, but with some tracks with higher ratings. Mostly, this is a rather small value, but sometimes it makes a difference.
    //This means, for example, what for any tracks rated 10 on any release with average rating 9 or less, this rating gets + 0.2 points.
    //The purpose of this is to increase avarage rating of releases with high number of tracks. Releases with 15+ tracks tends to have much lower average rating, and bonus rating makes these albums comparable to releases with less number of tracks.
    //Bonus rating are added to releases with 5 or more tracks.
    const bonusRatings = {
        6: .04,
        7: .08,
        8: .11,
        9: .14,
        10: .2
    };




















    //----------------------------
    //----------------------------
    //----------------------------
    let pagetype;
    if (window.location.pathname.startsWith('/release/')) pagetype = 'release';
    else if (window.location.pathname.startsWith('/collection/')) pagetype = 'collection';
    else if (window.location.pathname.startsWith('/collection_t/')) pagetype = 'mass-edit';
    else if (window.location.pathname.startsWith('/list/') || window.location.pathname.startsWith('/lists/edit')) pagetype = 'list';

    const highestPercentCount = (averageRating, ratingsArray) => {
        let highestRatingCount = 0;

        ratingsArray.forEach(rating => {
            if (rating >= averageRating) highestRatingCount += 1;
        });

        const highestRatingPercent = Number.parseFloat((highestRatingCount / ratingsArray.length * 100).toFixed(2));

        return {
            highestRatingPercent,
            highestRatingCount
        };
    };

    let initial = true;

    //Main recount function. Can be used in console with provided track ratings as arguments. Example: recountRating(8, 9, 8, 7)
    window.recountRating = (ratingBlock, ...ratings) => {
        if (!ratingBlock) return console.error('"ratingBlock" is not defined');
        const ratingIsElement = ratingBlock instanceof Element;

        let trackRatings;
        let ratingsAverage;
        let suggestedRating;
        if (ratingIsElement) {
            ratingsAverage = ratingBlock.querySelectorAll('.track_rating_average');
            suggestedRating = ratingBlock.querySelector('.release_rating_suggestion');
            if (pagetype === 'release') {
                trackRatings = ratingBlock.querySelectorAll('.tracklisting .my_catalog_rating');
            }

            else if (pagetype === 'collection' || pagetype === 'list') {
                trackRatings = ratingBlock.querySelectorAll('.trackratings td:last-child');
            }
        }

        const ratingsArgs = (!ratingIsElement && ratings.length === 0) ? String(ratingBlock).split('').map(num => Number.parseInt(num, 10)) : [ratingBlock, ...ratings];
        const ratingsArray = ratingIsElement ? [] : ratingsArgs;
        let countedTracks = ratingIsElement ? trackRatings.length : ratingsArray.length;
        let totalRating = 0;
        let averageRating;
        let ratingPercent;
        let suggestedTotalRating = 0;
        let suggestedAverageRating;
        let suggestedAverageRatingValue = 0;
        let highestRating = 0;
        let bonusRating = 0.00;
        let highestPercent;

        if (ratingIsElement) {
            [...trackRatings].forEach(element => {
                let ratingValue;
                let ratingText = '';

                if (pagetype === 'release') {
                    if (initial) {
                        ratingText = element.nextElementSibling.textContent.split(', ')[2];
                        if (ratingText.startsWith('0')) {
                            countedTracks -= 1;
                            return;
                        }
                        ratingValue = Number.parseInt(ratingText, 10);
                    } else {
                        ratingText = element.querySelector('.rating_num').textContent;
                        if (ratingText === '---') {
                            countedTracks -= 1;
                            return;
                        }
                        ratingValue = Number.parseFloat(ratingText) * 2;
                    }
                }

                else if (pagetype === 'collection' || pagetype === 'list') {
                    ratingText = element.querySelector('img') && parseFloat(element.querySelector('img').getAttribute('title'));
                    if (!ratingText) {
                        countedTracks -= 1;
                        return;
                    }
                    ratingValue = Number.parseFloat(ratingText) * 2;
                }

                ratingsArray.push(ratingValue);
            });
            if (initial) {
                initial = false;
            }
        }

        ratingsArray.forEach(ratingValue => {
            let albumRatingTrackValue;
            if (ratingValue > highestRating) highestRating = ratingValue;
            totalRating += ratingValue;
            albumRatingTrackValue = ratingValue * ratingsModifiers[ratingValue];
            suggestedTotalRating += albumRatingTrackValue;
        });

        if (ratingIsElement && countedTracks === 0) {
            suggestedRating.style.display = 'none';
            return [...ratingsAverage].forEach(item => {
                item.style.display = 'none';
            });
        }

        averageRating = Number.parseFloat((totalRating / countedTracks).toFixed(2));
        suggestedAverageRatingValue = Number.parseFloat((suggestedTotalRating / countedTracks).toFixed(2));

        if (ratingIsElement) {
            [...ratingsAverage].forEach(item => {
                item.style.display = 'inline';
                item.querySelector('span').innerHTML = `<b>${averageRating.toFixed(2)}</b> from ${countedTracks}/${trackRatings.length}`;
            });
        }

        //Bonus rating added to releases with 5 or more tracks
        if (ratingsArray.length > 4) {
            ratingsArray.forEach(rating => {
                if (bonusRatings[rating] && suggestedAverageRatingValue <= suggestedRatingValues[rating] - (rating === 10 ? 0 : suggestedMinimumRatingValueModifier)) {
                    bonusRating += bonusRatings[rating];
                }
            });
            bonusRating = Number.parseFloat(bonusRating.toFixed(2));
            suggestedAverageRatingValue = Number.parseFloat((suggestedAverageRatingValue + bonusRating).toFixed(2));
        }

        suggestedAverageRating = (() => {
            let checkedRating = highestRating;
            while (suggestedAverageRatingValue < (suggestedRatingValues[checkedRating] - ((checkedRating === 10 || checkedRating <= 6) ? 0 : suggestedMinimumRatingValueModifier)) && highestRating === (checkedRating + 1) ||
                suggestedAverageRatingValue < suggestedRatingValues[checkedRating] && highestRating === checkedRating) {
                checkedRating -= 1;
            }
            return checkedRating;
        })();

        const prevSuggestedAverageRating = suggestedAverageRating;
        const currentSuggestedMinimumRatingValueModifier = (suggestedAverageRating === 10 || suggestedAverageRating <= 6) ? 0 : suggestedMinimumRatingValueModifier;
        highestPercent = highestPercentCount(suggestedAverageRating, ratingsArray);
        //Decreases suggested average rating if there are less than 33.33% of tracks (or number is less than 3) higher than average rating (except for releases with 3 tracks)
        if ((highestPercent.highestRatingPercent < 33.33 && suggestedAverageRatingValue < ((suggestedRatingValues[suggestedAverageRating + 1] || 20) - currentSuggestedMinimumRatingValueModifier)) ||
            (ratingsArray.length > 6 && highestPercent.highestRatingCount < 3) || (ratingsArray.length === 3 && highestPercent.highestRatingCount < 2)) {
            suggestedAverageRating -= 1;
        }
        highestPercent = highestPercentCount(suggestedAverageRating, ratingsArray);

        const ratingsString = ratingsArray.join(', ');
        const ratingValueSpan = (suggestedRatingValues[suggestedAverageRating + 1] || 20) - suggestedRatingValues[suggestedAverageRating];
        const ratingValueRest = suggestedAverageRatingValue - bonusRating - suggestedRatingValues[suggestedAverageRating];
        const tenScaleRating = (suggestedAverageRating - 1) + (ratingValueRest / ratingValueSpan);
        let shownAverageRating = (tenScaleRating / (10 / resultRatingScale)).toFixed(2);
        if (resultRatingScale > 10) shownAverageRating = Number.parseInt(shownAverageRating, 10);
        const realAverageRatingNumber = suggestedAverageRatingValue - bonusRating;
        const realAverageRating = `${(realAverageRatingNumber).toFixed(2)}/20`;
        let starsRating = shownAverageRating;
        const rymScaleSuggestedAverageRating = (suggestedAverageRating / 2).toFixed(1);
        const scaledTenRating = suggestedAverageRating / (10 / resultRatingScale);
        const hasMarkMinus = suggestedRatingValues[suggestedAverageRating + 1] < realAverageRatingNumber;
        const hasMarkPlus = suggestedRatingValues[suggestedAverageRating] > realAverageRatingNumber;
        if (resultRatingScale <= 10) {
            starsRating = (suggestedAverageRating / (10 / resultRatingScale)).toFixed(1);
        }

        //Print html to browser page
        if (ratingIsElement) {
            suggestedRating.style.display = 'inline-block';
            let suggestedRatingContent = `Suggested rating: <b class="release_rating_suggestion_value" title="${starsRating}/${resultRatingScale}">${starsRating}</b> ` +
                `(<span title="rating value by 5-grade scale">${rymScaleSuggestedAverageRating}</span>, ` +
                `<span title="bonus rating">+${bonusRating}</span>, <span title="percentage of ratings equal to or higher than average rating, ${highestPercent.highestRatingCount} ratings">${highestPercent.highestRatingPercent}%</span>)`;
            suggestedRating.innerHTML = suggestedRatingContent;
            ratingPercent = Number.parseInt(countedTracks / trackRatings.length * 100, 10);
            suggestedRating.style.opacity = (ratingPercent === 100) ? 1 : (ratingPercent >= 50 ? .66 : .33);
        }

        //Return info values
        return {
            averageRating,
            bonusRating,
            highestPercent,
            ratingsString,
            realAverageRating,
            resultRatingScale,
            rymScaleSuggestedAverageRating,
            shownAverageRating,
            suggestedAverageRating
        };
    };

    if (!document.querySelector('header')) return;

    (() => {
        //Correctly show average track rating on custom collection page
        if (pagetype === 'collection' && window.location.pathname.includes('/d.rp,')) {
            const tracksHeader = document.createElement('th');
            tracksHeader.textContent = 'Track ratings';
            const ratingsHeader = document.querySelector('.or_q_header:nth-child(2)');
            ratingsHeader.parentNode.insertBefore(tracksHeader, ratingsHeader.nextSibling);

            const ratingCol = document.querySelectorAll('.or_q_rating');
            ratingCol.forEach(item => {
                const reviewCol = document.createElement('td');
                reviewCol.classList.add('or_q_review_td');
                item.parentNode.insertBefore(reviewCol, item.nextSibling);
            });

            const tracksCol = document.querySelectorAll('.or_q_review_td[colspan="3"]');
            tracksCol.forEach(item => {
                const parentRow = item.parentNode;
                const previousRow = parentRow.previousSibling;
                const reviewInner = item.querySelector('.or_q_review');

                const reviewsCol = previousRow.querySelector('.or_q_review_td');
                reviewsCol.appendChild(reviewInner);

                const tagsCol = item.nextSibling;
                previousRow.appendChild(tagsCol);

                parentRow.remove();
            });
        }

        //Correctly show average track rating on mass-edit page
        else if (pagetype === 'mass-edit') {
            const tracksHeader = document.createElement('th');
            tracksHeader.textContent = 'Track ratings';
            const ratingsHeader = document.querySelector('.or_q_header:nth-child(4)');
            ratingsHeader.parentNode.insertBefore(tracksHeader, ratingsHeader.nextSibling);

            const ratingCol = document.querySelectorAll('.or_q_rating');
            ratingCol.forEach(item => {
                const reviewCol = document.createElement('td');
                reviewCol.classList.add('or_q_review_td');
                item.parentNode.insertBefore(reviewCol, item.nextSibling);
            });

            const tracksCol = document.querySelectorAll('.or_q_review_td[colspan="5"]');
            tracksCol.forEach(item => {
                const parentRow = item.parentNode;
                const previousRow = parentRow.previousSibling;
                const reviewInner = item.querySelector('.or_q_review');

                const reviewsCol = previousRow.querySelector('.or_q_review_td');
                reviewsCol.appendChild(reviewInner);

                const tagsCol = item.nextSibling;
                previousRow.appendChild(tagsCol);

                parentRow.remove();
            });
        }
    })();

    (() => {
        //Create DOM elements on release page
        if (pagetype === 'release') {
            const trackRatingsButton = document.getElementById('track_rating_btn');
            if (!trackRatingsButton) return;
            const trackRatingsSaveButton = document.getElementById('track_ratings_save_btn');
            const trackRatingsSuccess = document.getElementById('track_rating_success');
            let ratingsSaveInterval;
            let ratingsSaveIntervalIndex = 0;

            const ratingsAverage = [];
            ratingsAverage.push(document.createElement('span'));
            ratingsAverage[0].classList.add('track_rating_average');
            ratingsAverage[0].style.display = 'none';
            ratingsAverage[0].innerHTML = ': <span></span>';

            ratingsAverage.push(ratingsAverage[0].cloneNode(true));
            ratingsAverage[1].innerHTML = `Average${ratingsAverage[1].innerHTML}`;
            ratingsAverage[1].style.fontSize = '11px';
            ratingsAverage[1].style.marginLeft = '5px';

            trackRatingsButton.appendChild(ratingsAverage[0]);
            trackRatingsSuccess.parentNode.insertBefore(ratingsAverage[1], trackRatingsSuccess.nextSibling);

            const suggestedRating = document.createElement('span');
            const catalogTopDiv = document.querySelector('.release_my_catalog');
            suggestedRating.classList.add('release_rating_suggestion');
            suggestedRating.style.fontSize = '11px';
            suggestedRating.style.marginTop = '2px';
            suggestedRating.style.cursor = 'pointer';
            suggestedRating.style.opacity = .3;
            catalogTopDiv.parentNode.insertBefore(suggestedRating, catalogTopDiv.nextSibling);

            trackRatingsSaveButton.addEventListener('click', () => {
                window.recountRating(document.getElementById('my_catalog'));

                clearInterval(ratingsSaveInterval);
                ratingsSaveInterval = setInterval(() => {
                    ratingsSaveIntervalIndex++;
                    if (trackRatingsSaveButton.getAttribute('disabled') || ratingsSaveIntervalIndex >= 15) {
                        console.log(window.recountRating(document.getElementById('my_catalog')));
                        clearInterval(ratingsSaveInterval);
                        ratingsSaveIntervalIndex = 0;
                    }
                }, 300);
            });

            console.log(window.recountRating(document.getElementById('my_catalog')));
        }

        //Create DOM elements on collection pages
        else if ((pagetype === 'collection') || (pagetype === 'mass-edit')) {
            const resultsArray = [];
            const trackRatingsButton = document.querySelectorAll('.or_q_review');

            trackRatingsButton.forEach(item => {
                const trackRatingsHeader = item.querySelector('.track_rating_header');
                if (!trackRatingsHeader) return;
                const titleDiv = trackRatingsHeader.querySelector('div[style="float:left;"]');

                const suggestedRating = document.createElement('span');
                suggestedRating.classList.add('release_rating_suggestion');
                suggestedRating.style.marginLeft = '25px';
                suggestedRating.style.color = '#000';
                suggestedRating.style.opacity = .3;
                titleDiv.parentNode.insertBefore(suggestedRating, titleDiv.nextSibling);

                const ratingsAverage = document.createElement('span');
                ratingsAverage.classList.add('track_rating_average');
                ratingsAverage.style.marginLeft = '25px';
                ratingsAverage.style.fontSize = '11px';
                ratingsAverage.style.color = '#000';
                ratingsAverage.style.display = 'none';
                ratingsAverage.innerHTML = 'Average: <span></span>';
                titleDiv.parentNode.insertBefore(ratingsAverage, titleDiv.nextSibling);

                resultsArray.push(window.recountRating(item));
            });

            console.table(resultsArray);
        }

        //Create DOM elements on list pages
        else if (pagetype === 'list') {
            const loadingFunction = () => {
                const resultsArray = [];
                const spoilers = document.querySelectorAll('.spoiler');

                spoilers.forEach(item => {
                    if (!item.offsetParent) return;
                    const spoilerContent = item.querySelector('.spoiler_inner');
                    const trackRatingsWrapper = spoilerContent.querySelector('.rsummaryframe .mbgen > tbody > tr > td[style]');
                    if (!trackRatingsWrapper) return;

                    const trackRatingsTable = spoilerContent.querySelector('.trackratings');
                    if (!trackRatingsTable) return;

                    const suggestedRating = document.createElement('span');
                    suggestedRating.classList.add('release_rating_suggestion');
                    suggestedRating.style.color = '#000';
                    suggestedRating.style.opacity = .3;
                    trackRatingsWrapper.appendChild(suggestedRating);

                    resultsArray.push(window.recountRating(spoilerContent));

                    item.textContent = `(${spoilerContent.querySelector('.release_rating_suggestion_value').textContent})`;
                    item.parentNode.title = `${spoilerContent.querySelector('.artist').textContent} — ${spoilerContent.querySelector('.album').textContent} | ${spoilerContent.querySelector('.release_rating_suggestion').textContent}`;
                });

                console.table(resultsArray);
            };

            const loadingDiv = document.getElementById('list_loading');
            let loadingInterval = setInterval(() => {
                if (loadingDiv && loadingDiv.offsetParent) return;

                clearInterval(loadingInterval);

                loadingFunction();
            }, 100);

            //Load ratings on lists pages change
            const navbar = document.getElementById('navbar');
            if (navbar) {
                navbar.addEventListener('click', event => {
                    if (event.target.tagName !== 'A') return;

                    clearInterval(loadingInterval);

                    const currentPage = document.querySelector('.navlinkcurrent').textContent;
                    loadingInterval = setInterval(() => {
                        if (currentPage === document.querySelector('.navlinkcurrent').textContent) return;

                        clearInterval(loadingInterval);

                        loadingFunction();
                    }, 100);
                });
            }
        }
    })();
})();