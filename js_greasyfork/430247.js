// ==UserScript==
// @name        WaniKani Review Clock
// @namespace   wkreviewclock
// @description Adds a clock to WaniKani review session statistics and estimates the remaining time.
// @match       http://www.wanikani.com/subjects/review
// @match       https://www.wanikani.com/subjects/review
// @match       http://www.wanikani.com/subjects/extra_study?queue_type=*
// @match       https://www.wanikani.com/subjects/extra_study?queue_type=*
// @version     1.5
// @author      Markus Tuominen
// @grant       none
// @license     GPL version 3 or later: http://www.gnu.org/copyleft/gpl.html
// @source      https://github.com/Markus98/wk-review-clock
// @downloadURL https://update.greasyfork.org/scripts/430247/WaniKani%20Review%20Clock.user.js
// @updateURL https://update.greasyfork.org/scripts/430247/WaniKani%20Review%20Clock.meta.js
// ==/UserScript==

let statHtmlElems;
let time;
let startTime;
let rateShowDelay;

const timerTimeKey = 'reviewTimerTime';
const timerRateKey = 'reviewTimerRate';
const averageStatsKey = 'reviewRateAverageStats';
const scriptId = 'WKReviewClock';

const defaultSettings = {
    units: 'rph',
    location: 'toprightright',
    showTimer: true,
    showRate: true,
    showRemaining: true,
    updateInterval: 1.0,
    enableRateShowDelay: false,
    rateShowDelay: 5,
    showTimeEstimate: true,
    averageIgnorePeriod: 3,
};

function splitToHourMinSec(timeSec) {
    const h = Math.floor( timeSec/60/60 );
    const min = Math.floor( (timeSec - (h*60*60)) / 60 );
    const sec = Math.round( timeSec - h*60*60 - min*60 );
    return {h, min, sec};
}

function getTimeString(hourMinSec, includeSec=true) {
    const { h, min, sec } = hourMinSec;

    const hourString = h ? h+'h ' : '';

    const minuteZero = h ? '0' : '';
    const minuteString = (h||min||!includeSec) ? (minuteZero+min).slice(-2)+'m ' : '';

    const secondZero = (h||min) ? '0' : '';
    const secondString = (secondZero+sec).slice(-2)+'s';

    return hourString + minuteString + (includeSec ? secondString : '');
}

function setCurrentTimerStats() {
    // settings
    let showTimer = defaultSettings.showTimer;
    let showRate = defaultSettings.showRate;
    let showRemaining = defaultSettings.showRemaining;
    let hideRateRemaining = false;
    if (window.wkof) {
        showTimer = wkof.settings[scriptId].showTimer;
        showRate = wkof.settings[scriptId].showRate;
        showRemaining = wkof.settings[scriptId].showRemaining;
        const enableRateShowDelay = wkof.settings[scriptId].enableRateShowDelay;
        hideRateRemaining = enableRateShowDelay && time<rateShowDelay;
    }

    const hourMinSec = splitToHourMinSec(time);
    if (showTimer) {
        statHtmlElems.timer.getLabel().textContent = getTimeString(hourMinSec);
    }

    const reviewsDoneNumber = parseInt(
        document.querySelector('[data-quiz-statistics-target="completeCount"]').textContent
    );
    const reviewRate = time !== 0 ? reviewsDoneNumber/time : 0; // reviews/sec
    if (showRate) {
        const formattedRate = formatRate(reviewRate, 'short');
        statHtmlElems.rate.getLabel().textContent = (hideRateRemaining ? '—' : formattedRate) + '';
    }

    const reviewsAvailableNumber = parseInt(
        document.querySelector('[data-quiz-statistics-target="remainingCount"]').textContent
    );
    const timeRemaining = reviewsAvailableNumber / reviewRate; // seconds
    if (showRemaining) {
        let remainingStr = 'Est. ';
        if (hideRateRemaining) {
            remainingStr += '—';
        } else if (Number.isFinite(timeRemaining)) {
            remainingStr += getTimeString(splitToHourMinSec(timeRemaining), false);
        } else {
            remainingStr += '∞';
        }
        statHtmlElems.remaining.getLabel().textContent = remainingStr;
    }

    // Set time and rate to localstorage for diplaying them later
    window.localStorage.setItem(timerTimeKey, time);
    window.localStorage.setItem(timerRateKey, reviewRate);
}

function generateStatHtmlElems() {
    function genStatDiv(title, iconClassName, idSuffix) {
        const statDiv = document.createElement('div');
        const statDivId = 'wk-review-clock-markus98_stat-div-' + idSuffix;
        statDiv.id = statDivId;
        statDiv.title = title;
        statDiv.className = 'quiz-statistics__item';
        const statCountDiv = document.createElement('div');
        statCountDiv.className = 'quiz-statistics__item-count';
        const statCountIconDiv = document.createElement('div');
        statCountIconDiv.className = 'quiz-statistics__item-count-icon';
        const statIcon = document.createElement('i');
        statIcon.className = iconClassName;
        const statLabelDiv = document.createElement('div');
        const labelId = 'wk-review-clock-markus98_label-' + idSuffix;
        statLabelDiv.id = labelId;
        statLabelDiv.className = 'quiz-statistics__item-count-text';
        statLabelDiv.style.cssText = 'white-space: nowrap;';

        statDiv.appendChild(statCountDiv);
        statCountDiv.appendChild(statCountIconDiv);
        statCountDiv.appendChild(statLabelDiv);
        statCountIconDiv.appendChild(statIcon);
        return {
            div: statDiv,
            getLabel: function () {
                return document.getElementById(labelId);
            },
            getDiv: function () {
                return document.getElementById(statDivId);
            },
        };
    }
    // Create statistics divs
    const timer = genStatDiv('elapsed time', 'fa fa-clock-o', 'timer');
    const rate = genStatDiv('review rate', 'fa fa-bolt', 'rate');
    const remaining = genStatDiv('estimated remaining time', 'fa fa-clock-o', 'remaining');

    statHtmlElems = {
        timer: timer,
        rate: rate,
        remaining: remaining,
        updateVisibility: function() {
            if (!window.wkof) return;
            const settings = wkof.settings[scriptId];
            if (settings) {
                const disp = (bool) => bool ? '' : 'display: none;';
                this.timer.getDiv().style.cssText = disp(settings.showTimer);
                this.rate.getDiv().style.cssText = disp(settings.showRate);
                this.remaining.getDiv().style.cssText = disp(settings.showRemaining);
            }
        }
    }

    // append divs to appropriate parent
    const location = window.wkof ? wkof.settings[scriptId].location : defaultSettings.location;
    if (location == 'toprightright') {
        const parent = document.getElementsByClassName('quiz-statistics')[0];
        parent.appendChild(timer.div);
        parent.appendChild(rate.div);
        parent.appendChild(remaining.div);
    } else if (location == 'toprightleft') {
        const parent = document.getElementsByClassName('quiz-statistics')[0];
        parent.prepend(remaining.div);
        parent.prepend(rate.div);
        parent.prepend(timer.div);
    } else if (location == 'bottom') {
        const parent = document.getElementById('additional-content');
        const bottomMenu = document.createElement('div');
        bottomMenu.style.cssText = 'display: flex; justify-content: center; padding: 10px;';
        bottomMenu.appendChild(timer.div);
        bottomMenu.appendChild(rate.div);
        bottomMenu.appendChild(remaining.div);
        bottomMenu.className = "additional-content__menu wkrc_bottom"
        parent.append(bottomMenu);
    }
    statHtmlElems.updateVisibility();
}

function setStatsAndUpdateTime() {
    time = (new Date() - startTime)/1000;
    setCurrentTimerStats();
}

function startTimer (intervalSec) {
    startTime = new Date();
    setStatsAndUpdateTime();
    setInterval(setStatsAndUpdateTime, intervalSec*1000);
}

function getAverageStats() {
    const statsObj = JSON.parse(localStorage.getItem(averageStatsKey));
    if (statsObj) {
        return statsObj;
    } else {
        // default
        return {
            rateSum: 0,
            reviews: 0,
            mostRecentAdded: false
        };
    }
}

function setAverageStats(statsObj) {
    localStorage.setItem(averageStatsKey, JSON.stringify(statsObj));
}

function setAverageRecentAdded(bool) {
    const stats = getAverageStats();
    stats.mostRecentAdded = bool;
    setAverageStats(stats);
}

function startReviewTimer() {
    // Start the timer
    const interval = window.wkof ? parseFloat(wkof.settings[scriptId].updateInterval) : defaultSettings.updateInterval;
    startTimer(interval);
    setAverageRecentAdded(false);
}

/**
 * @deprecated
 */
function showLastReviewStats() {
    const footer = document.getElementById('last-session-date');

    let ignoreInterval = defaultSettings.averageIgnorePeriod*60;
    let showEstimatedSessionTime = defaultSettings.showTimeEstimate;
    // Get settings if WK Open Framework is installed
    if (window.wkof) {
        ignoreInterval = parseFloat(wkof.settings[scriptId].averageIgnorePeriod)*60;
        showEstimatedSessionTime = wkof.settings[scriptId].showTimeEstimate;
    }

    // Create divs and spans for stats in footer
    const rateDiv = document.createElement('div');
    const timeDiv = document.createElement('div');
    const timeSpan = document.createElement('span');
    const rateSpan = document.createElement('span');
    timeDiv.appendChild(timeSpan);
    rateDiv.appendChild(rateSpan);
    const estimatedTimeDiv = document.createElement('div');
    estimatedTimeDiv.style.cssText = 'font-size: 0.6em; position: relative; top: -70%;';

    // Center text in review queue count
    const reviewCountSpan = document.getElementById('review-queue-count');
    reviewCountSpan.style.cssText += 'text-align: center;';
    
    // Reset button
    const resetAvgButton = document.createElement('button');
    resetAvgButton.textContent = 'reset average';
    resetAvgButton.style.cssText = 'font-size: 0.6em; color: inherit';
    resetAvgButton.onclick = () => {
        if (confirm('Are you sure you want to reset the average review rate?')) {
            localStorage.removeItem(averageStatsKey);
            location.reload();
        }
    };
    
    // Saved time and rate
    const lastTime = parseFloat(localStorage.getItem(timerTimeKey));
    const lastTimeStr = isNaN(lastTime) ? '—' : getTimeString(splitToHourMinSec(lastTime));
    const lastRate = parseFloat(localStorage.getItem(timerRateKey));
    const lastRateStr = formatRate(lastRate);

    // Average rate
    const avgStats = getAverageStats();
    if (!avgStats.mostRecentAdded && lastTime > ignoreInterval && lastRate > 0) {
        avgStats.rateSum += lastRate;
        avgStats.reviews += 1;
        avgStats.mostRecentAdded = true;
        setAverageStats(avgStats);
    }
    const avgRate = avgStats.rateSum / avgStats.reviews; // reviews/second
    const avgRateStr = formatRate(avgRate, 'short');

    // Estimate time for current reviews
    const numOfReviews = parseInt(reviewCountSpan.textContent);
    const estimatedTime = numOfReviews / avgRate;
    const estimatedTimeStr = getTimeString(splitToHourMinSec(estimatedTime), false);
    
    // Set stats text content
    timeSpan.textContent = `Duration: ${lastTimeStr}`;
    rateSpan.textContent = `Review rate: ${lastRateStr} (avg. ${avgRateStr}) (${avgStats.reviews} sessions)`;
    estimatedTimeDiv.textContent = 
        !showEstimatedSessionTime || isNaN(estimatedTime) || numOfReviews === 0 ? 
        '' : `~${estimatedTimeStr}`;

    // Append html elements to page
    footer.appendChild(timeDiv);
    footer.appendChild(rateDiv);
    footer.appendChild(resetAvgButton);
    reviewCountSpan.appendChild(estimatedTimeDiv);
}

let shortUnitNames = {'rph': 'r/h', 'rpm': 'r/m', 'mp100r': 'm/100r'}
let unitNames = {'rph': 'reviews/hr', 'rpm': 'reviews/min', 'mp100r': 'min/100 reviews'}
function formatRate(rps, format) {
    if (isNaN(rps) || rps < 0.00001) {
        return '—';
    }
    rps = parseFloat(rps);
    const units = window.wkof ? wkof.settings[scriptId].units : defaultSettings.units;
    let res;
    if (units == 'rph') {
        res = rps*3600;
    } else if (units == 'rpm') {
        res = rps*60;
    } else if (units == 'mp100r') {
        res = 1/rps/60*100;
    }
    if (format == 'short') {
        return res.toFixed(1) + ' ' + shortUnitNames[units];
    } else {
        return res.toFixed(1) + ' ' + unitNames[units];
    }

}

function openSettings() {
    var config = {
        script_id: scriptId,
        title: 'Review Clock Settings',
        on_save: () => {
            wkof.Settings.save(scriptId);
            statHtmlElems.updateVisibility();
            rateShowDelay = parseFloat(wkof.settings[scriptId].rateShowDelay)*60;
        },
        content: {
            general: {
                type: 'page',
                label: 'General',
                content: {
                    units: {
                        type: 'dropdown',
                        label: 'Units for Speed',
                        default: defaultSettings.units,
                        hover_tip: 'What units the review rate of completion should be displayed in.',
                        content: {
                            rph: 'reviews/hr',
                            rpm: 'reviews/min',
                            mp100r: 'min/100 reviews',
                        }
                    },
                }
            },
            reviewPage: {
                type: 'page',
                label: 'Review Page',
                content: {
                    location: {
                        type: 'dropdown',
                        label: 'Display Location',
                        default: defaultSettings.location,
                        hover_tip: 'Where to show the below items (if checked) during reviews.',
                        content: {
                            toprightright: 'top right (right of other stats)',
                            toprightleft: 'top right (left of other stats)',
                            bottom: 'bottom in gray font',
                        }
                    },
                    showTimer: {
                        type: 'checkbox',
                        label: 'Show elapsed time',
                        default: defaultSettings.showTimer,
                        hover_tip: 'Show the elapsed time during a review session.',
                    },
                    showRate: {
                        type: 'checkbox',
                        label: 'Show review rate',
                        default: defaultSettings.showRate,
                        hover_tip: 'Show the review rate (reviews/hour).',
                    },
                    showRemaining: {
                        type: 'checkbox',
                        label: 'Show remaining time estimate',
                        default: defaultSettings.showRemaining,
                        hover_tip: 'Show the estimated remaining time based on the review rate and remaining items.',
                    },
                    divider1: {
                        type: 'divider'
                    },
                    updateInterval: {
                        type: 'number',
                        label: 'Statistics update interval (s)',
                        hover_tip: 'How often the statistic numbers should be updated (x second intervals).',
                        default: defaultSettings.updateInterval,
                        min: 0.01
                    },
                    rateShowDelayGroup: {
                        type: 'group',
                        label: 'Estimate Show Delay',
                        content: {
                            rateShowDelaySection: {
                                type: 'html',
                                html: 'Only show the review rate and remaining time estimate after the session is longer than a specified duration.'
                            },
                            enableRateShowDelay: {
                                type: 'checkbox',
                                label: 'Enabled',
                                default: defaultSettings.enableRateShowDelay,
                                hover_tip: 'Enable a delay in showing the rate and time estimate.'
                            },
                            rateShowDelay: {
                                type: 'number',
                                label: 'Duration (min)',
                                hover_tip: 'The number of minutes that the review rate and time estimate should be hidden for at the beginning of a session.',
                                default: defaultSettings.rateShowDelay,
                                min: 0
                            }
                        }
                    }
                }
            },
        }
    }
    var dialog = new wkof.Settings(config);
    dialog.open();
}

function installSettingsMenu() {
    wkof.Menu.insert_script_link({
        name:      'review_clock_settings',
        submenu:   'Settings',
        title:     'Review Clock',
        on_click:  openSettings
    });
}

async function main() {
    if (window.wkof) {
        const wkof_modules = 'Settings,Menu';
        wkof.include(wkof_modules);
        await wkof.ready(wkof_modules)
            .then(() => wkof.Settings.load(scriptId, defaultSettings))
            .then(installSettingsMenu);
        rateShowDelay = parseFloat(wkof.settings[scriptId].rateShowDelay)*60;
    } else {
        console.warn('WaniKani Review Clock: Wanikani Open FrameWork required for adjusting settings. '
            + 'Installation instructions can be found here: https://community.wanikani.com/t/installing-wanikani-open-framework/28549');
    }

    const style = document.createElement('style');
    style.textContent = '.wkrc_bottom i { margin-right: 0.5em; margin-left: 0.8em; }' +
        '.wkrc_bottom span { margin-right: 0.5em; }' +
        '.wkrc_bottom { color:#BBB; letter-spacing: initial; display: block; text-align: center; }';
    document.head.append(style);

    if(/subjects\/(review|extra_study\?queue_type=.*)$/.exec(window.location.href)) { // review page
        await generateStatHtmlElems();
        startReviewTimer();
    } else { // review summary page
        // showLastReviewStats();
    }
}

main();