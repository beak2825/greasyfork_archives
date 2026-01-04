// ==UserScript==
// @name         Wanikani: Integrated Dashboard Overhaul
// @namespace    http://tampermonkey.net/
// @version      0.1.9
// @description  Integrates multiple user scripts into one neat package and add some stylings to the dashboard
// @author       BJennWare
// @include      /https?://(www|preview).wanikani.com/
// @include      /https?://(www|preview).wanikani.com/dashboard/
// @require      https://greasyfork.org/scripts/377613-wanikani-open-framework-jlpt-joyo-and-frequency-filters/code/Wanikani%20Open%20Framework%20JLPT,%20Joyo,%20and%20Frequency%20filters.user.js
// @require      https://greasyfork.org/scripts/377638-wanikani-open-framework-subject-ids-filter/code/Wanikani%20Open%20Framework%20Subject%20IDs%20filter.user.js
// @license      MIT; http://opensource.org/licenses/MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397485/Wanikani%3A%20Integrated%20Dashboard%20Overhaul.user.js
// @updateURL https://update.greasyfork.org/scripts/397485/Wanikani%3A%20Integrated%20Dashboard%20Overhaul.meta.js
// ==/UserScript==

(function() {
    // Make sure WKOF is installed
	const wkof = window.wkof;
	if (!wkof) {
		const response = confirm('Wanikani: JLPT Progress requires WaniKani Open Framework.\n Click "OK" to be forwarded to installation instructions.');
		if (response) window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
		return;
    } else {
        function addGlobalStyle(css) {
            const head = document.getElementsByTagName('head');
            if (!head) { return; }
            const style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = css;
            head[0].appendChild(style);
        }

        addGlobalStyle(`
          .highlight-critical {
            font-weight: bold;
          }
          .dashboard section.lessons-and-reviews li {
            flex: 0 1 100% !important;
            margin-right: 20px;
          }
          .progress-and-forecast {
            grid-gap: 20px 20px !important;
            gap: 20px 20px !important;
          }
          section { margin: 0 0 20px !important; }
          .progress_percentages { margin-bottom: 0 !important; margin-top: 15px !important; }
          .lesson-review-info {
            position: absolute;
            top: 16px;
            right: 16px;
          }
          .lesson-review-info .info:before {
            content: \F01C;
            margin-right: .25em;
            font-family: FontAwesome;
          }
        `);

        // Initiate progress variable
		const jlptProgress = {1: {learned: 0, total: 1232}, 2: {learned: 0, total: 367}, 3: {learned: 0, total: 367}, 4: {learned: 0, total: 166}, 5: {learned: 0, total: 79}};

        // Fetch lesson info then process it
		// wkof.include('ItemData');
		// wkof.ready('ItemData')
		//  .then(updateProgress)
		//	.then(displayData);

        wkof.include('Apiv2');
        wkof.ready('Apiv2')
            .then(calculateCriticalReview)
            .then(displayLessonAndReviewDetail);

        // Retreives lesson data
        function updateProgress() {
            let resolve, promise = new Promise((res, rej)=>{resolve=res;});
            const config = {
                wk_items: {
                    options: { assignments: true },
                    filters: { item_type: 'kan', srs: '5,6,7,8,9', include_jlpt_data: true }
                }
            };
            wkof.ItemData.get_items(config).then((data)=> {
                Object.values(data).forEach(record => {
                    if(record.jlpt_level) jlptProgress[record.jlpt_level].learned += 1;
                });
                resolve();
            })
            return promise;
        }

        function displayData() {
            const progressionDiv = document.createElement('div');
            progressionDiv.className = 'jlpt_progress';

            Object.keys(jlptProgress).reverse().forEach(level => {
                $(progressionDiv).append(`
                  <div class="stage" title="${jlptProgress[level].learned}/${jlptProgress[level].total} learned">
                    <span class="level">N${level} </span>
                    <span class="percent">${Math.round(1.0 * jlptProgress[level].learned / jlptProgress[level].total * 1000)/10}%</span>
                  </div>`);
            });
            $('#search > div > div > div > form').before(progressionDiv);
        }

        function highlightCriticalReview(date, currentReviewCount) {
            if(date !== null) {
                if($(`time[datetime='${date.replace('.000000', '')}']`).length !== 0) {
                    $(`time[datetime='${date.replace('.000000', '')}']`).addClass("highlight-critical");
                } else {
                    const todaySelector = $(`.review-forecast__day:first`);

                    if(todaySelector.children.length <= 1) {
                        const nowElem = document.createElement('tbody');

                        $(nowElem).html(`
                            <tr class="review-forecast__day-header grid relative block py-2 bg-white grid-cols-auto rounded md:z-10 leading-normal md:sticky md:top-0 md:mb-10 cursor-pointer">
                                <th class="review-forecast__day-label rounded md:sticky py-0 px-3 bg-white top-0 select-none block text-left leading-normal pt-2 -mt-2" rowspan="4">
                                    <i class="review-forecast__toggleicon mr-2 inline-block icon-chevron-up"></i>
                                    <time>Today</time>
                                </th>
                                <td class="review-forecast__change text-right border-0 border-r border-solid border-gray-200 whitespace-no-wrap leading-normal md:sticky bg-white top-0 block select-none py-0 px-3 hidden"></td>
                                <td class="review-forecast__running-total text-left rounded-r md:sticky bg-white top-0 block select-none py-0 px-3 hidden"></td>
                            </tr>
                            <tr class="review-forecast__hour grid block pl-3">
                                <th class="p-0 font-normal text-left leading-normal" scope="row">
                                    <time><b>Now</b></time>
                                </th>
                                <td class="p-0 border-0 border-l border-solid border-gray-200 leading-normal"></td>
                                <td class="p-0 whitespace-no-wrap text-right px-3 border-0 border-r border-solid border-gray-200 leading-normal">
                                    <span class="inline-block mr-px opacity-25">+</span>0
                                </td>
                                <td class="text-left px-3 leading-normal">${currentReviewCount}</td>
                            </tr>`);
                        nowElem.className = 'review-forecast__day mb-3 relative bg-white block rounded';
                        $(todaySelector).replaceWith($(nowElem));
                    } else {
                        const todaySelectorHeader = $(`.review-forecast__day-header:first`);
                        const nowElem = document.createElement('tr');

                        $(nowElem).html(`
                            <th class="p-0 font-normal text-left leading-normal" scope="row">
                                <time><b>Now</b></time>
                            </th>
                            <td class="p-0 border-0 border-l border-solid border-gray-200 leading-normal"></td>
                            <td class="p-0 whitespace-no-wrap text-right px-3 border-0 border-r border-solid border-gray-200 leading-normal">
                                <span class="inline-block mr-px opacity-25">+</span>0
                            </td>
                            <td class="text-left px-3 leading-normal">${currentReviewCount}</td>`);
                        nowElem.className = 'review-forecast__hour grid block pl-3';
                        $(nowElem).insertAfter(todaySelectorHeader);
                    }
                }
            }
        }

        function getLessonAndReviewCount(results) {
            const summary = results[0];
            const subjects = results[1];

            const lesson = { radical: 0, kanji: 0, vocabulary: 0 };
            const review = { radical: 0, kanji: 0, vocabulary: 0 };

            const lessonSubjectIds = summary.lessons[0].subject_ids;
            lessonSubjectIds.forEach(subjectId => {
                const item = subjects[subjectId];
                lesson[item.object]++;
            });
            const reviewSubjectIds = summary.reviews.find(rev => rev.available_at === summary.next_reviews_at).subject_ids;
            reviewSubjectIds.forEach(subjectId => {
                const item = subjects[subjectId];
                review[item.object]++;
            });

            return { lesson, review };
        }

        function displayLessonAndReviewDetail() {
            const promises = [];
            promises.push(wkof.Apiv2.get_endpoint('summary'));
            promises.push(wkof.Apiv2.get_endpoint('subjects'));

            Promise.all(promises).then(processData => {
                const { lesson, review } = getLessonAndReviewCount(processData);

                const lessonDisplay = [];
                if(lesson.radical > 0) lessonDisplay.push(`${lesson.radical} 部`)
                if(lesson.kanji > 0) lessonDisplay.push(`${lesson.kanji} 漢`)
                if(lesson.vocabulary > 0) lessonDisplay.push(`${lesson.vocabulary} 語`)
                const lessonSelector = $(".lessons-and-reviews__button[href='/lesson'] > span");
                if(lessonSelector.text() !== "0") lessonSelector.text(lessonDisplay.join(' '));

                const reviewDisplay = [];
                if(review.radical > 0) reviewDisplay.push(`${review.radical} 部`)
                if(review.kanji > 0) reviewDisplay.push(`${review.kanji} 漢`)
                if(review.vocabulary > 0) reviewDisplay.push(`${review.vocabulary} 語`)
                const reviewSelector = $(".lessons-and-reviews__button[href='/review'] > span");
                if(reviewSelector.text() !== "0") reviewSelector.text(reviewDisplay.join(' '));
            });
        }

        function calculateCriticalReview() {
            const currentReviewCount = $(".lessons-and-reviews__button[href='/review'] > span").text();
            wkof.Apiv2.fetch_endpoint('user').then(response => {
                const level = response.data.level;

                wkof.Apiv2.fetch_endpoint('assignments', {filters: { levels: [level], subject_types: ['radical', 'kanji'] }}).then(assignmentResponse => {
                    console.log(assignmentResponse);
                    const radicals = assignmentResponse.data
                        .filter((item) => item.data.subject_type == 'radical' && !item.data.passed)
                        .sort((a, b) => a.data.srs_stage < b.data.srs_stage || (a.data.srs_stage == b.data.srs_stage && a.data.available_at > b.data.available_at) ? 1 : -1);

                    if (radicals.length > 0) {
                        highlightCriticalReview(radicals[radicals.length - 1].data.available_at, currentReviewCount);
                    } else {
                        const kanji = assignmentResponse.data
                            .filter((item) => item.data.subject_type == 'kanji')
                            .sort((a, b) => a.data.srs_stage < b.data.srs_stage || (a.data.srs_stage == b.data.srs_stage && a.data.available_at > b.data.available_at) ? 1 : -1);

                        const criticalKanjiCount = Math.ceil(kanji.length * 0.9);
                        const criticalKanji = kanji[criticalKanjiCount - 1];

                        if (criticalKanji.data.available_at) {
                            highlightCriticalReview(criticalKanji.data.available_at, currentReviewCount);
                        }
                    }
                })
            });
        }
    }
})();