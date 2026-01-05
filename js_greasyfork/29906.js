// ==UserScript==
// @id             eg.OPR
// @name           OPRAnalysis
// @version        00.00.00.00068
// @namespace      http://eg.opr
// @description    Operation Portal Recon Analysis
// @include        https://opr.ingress.com/recon*
// @downloadURL https://update.greasyfork.org/scripts/29906/OPRAnalysis.user.js
// @updateURL https://update.greasyfork.org/scripts/29906/OPRAnalysis.meta.js
// ==/UserScript==
/// <reference path="typing.d.ts" />
/// <reference path="logging.ts" />
var HISTORY_STORAGE_KEY = "eg.opr";
var RECORDING_KEY = 'eg.opr.savedAnalisys';
var eg;
(function (eg) {
    var opr;
    (function (opr) {
        (function (Performance) {
            Performance[Performance["Poor"] = 0] = "Poor";
            Performance[Performance["Good"] = 1] = "Good";
            Performance[Performance["Great"] = 2] = "Great";
        })(opr.Performance || (opr.Performance = {}));
        var Performance = opr.Performance;
        (function (EventType) {
            EventType[EventType["Review"] = 0] = "Review";
            EventType[EventType["StatChange"] = 1] = "StatChange";
        })(opr.EventType || (opr.EventType = {}));
        var EventType = opr.EventType;
    })(opr = eg.opr || (eg.opr = {}));
})(eg || (eg = {}));
function getCurrentPerformance() {
    var perfImgSrc = document.querySelector('#player_stats>div>img').src;
    var stats = document.querySelectorAll('#player_stats>div>p');
    var currentPerformance = {
        prf: perfImgSrc.indexOf('great.png') >= 0
            ? eg.opr.Performance.Great : perfImgSrc.indexOf('good.png') >= 0
            ? eg.opr.Performance.Good : eg.opr.Performance.Poor,
        rvw: parseInt(stats[1].querySelector('span:last-child').textContent, 10),
        apr: parseInt(stats[2].querySelector('span:last-child').textContent, 10),
        rej: parseInt(stats[3].querySelector('span:last-child').textContent, 10)
    };
    return currentPerformance;
}
function getCurrentAnalysis() {
    var descriptions = document.querySelectorAll('#descriptionDiv>a');
    var buttonGroups = getStarButtonGroups();
    var mapsRef = descriptions[descriptions.length - 1].href;
    var latLng = mapsRef.split('@')[1].split(',');
    var homePortal = document.getElementById('opr_homeportal');
    var notes = document.getElementById('opr_notes');
    //[0].querySelectorAll('.glyphicon-star')
    var result = {
        name: descriptions[0].textContent.trim(),
        addr: descriptions[descriptions.length - 1].textContent.trim(),
        lt: parseFloat(latLng[0]),
        lg: parseFloat(latLng[1]),
        review: {
            apr: buttonGroups[0].querySelectorAll('.glyphicon-star').length,
            ttl: buttonGroups[1].querySelectorAll('.glyphicon-star').length,
            hst: buttonGroups[2].querySelectorAll('.glyphicon-star').length,
            vis: buttonGroups[3].querySelectorAll('.glyphicon-star').length,
            loc: buttonGroups[4].querySelectorAll('.glyphicon-star').length,
            saf: buttonGroups[0].querySelectorAll('.glyphicon-star').length
        },
        dup: false
    };
    if (homePortal.checked)
        result.homePortal = true;
    if (notes.value && notes.value.trim() != '')
        result.notes = notes.value;
    return result;
}
function processCurrentAnalysis(events, currentAnalysis) {
    console.info('recording analysis');
    console.info(currentAnalysis);
    events.push({
        data: currentAnalysis,
        ts: new Date().valueOf(),
        type: eg.opr.EventType.Review
    });
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(events));
}
//add current performance if different from most recent.  Difference means review or reject count changed.  Return true if added
function processCurrentPerformance(events, currentPerformance) {
    var mostRecentHistory;
    var statEvents = events.filter(function (e) { return e.type == eg.opr.EventType.StatChange; });
    if (statEvents.length > 0) {
        mostRecentHistory = statEvents[statEvents.length - 1].data;
    }
    if (!mostRecentHistory
        || mostRecentHistory.prf != currentPerformance.prf
        || mostRecentHistory.apr != currentPerformance.apr
        || mostRecentHistory.rej != currentPerformance.rej) {
        events.push({
            ts: new Date().valueOf(),
            type: eg.opr.EventType.StatChange,
            data: currentPerformance
        });
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(events));
        return true;
    }
    return false;
}
function watchButtons(events) {
    console.info('starting button monitoring');
    //there are 3 potential buttons we need to attach to.  Static Submit, dynamic Submit that is created when
    //you click 1 star should-be-a-portal, and Mark as duplicate.
    var watchedButtons = [];
    setInterval(function () {
        var buttons = document.querySelectorAll('button.button');
        for (var i = 0; i < buttons.length; i++)
            if (watchedButtons.indexOf(buttons[i]) == -1) {
                var txt = buttons[i].textContent;
                var isSubmit = txt == "Submit";
                var ngClick = buttons[i].getAttribute('ng-click');
                var isDup = ngClick && ngClick.indexOf('confirmDuplicate()') > -1;
                if (isSubmit) {
                    console.info('monitoring new button ' + isSubmit + ' ' + isDup);
                    console.info(buttons[i]);
                    watchedButtons.push(buttons[i]);
                    buttons[i].addEventListener('click', getSubmitEventHandler(isDup, events));
                }
            }
    }, 250);
}
function getDrawToolsHistory(events) {
    var hexPad = function (h) {
        return (h.length < 2 ? "0" + h : h);
    };
    var result = new Array();
    events.filter(function (e) { return e.type != eg.opr.EventType.StatChange; }).forEach(function (evt) {
        var reviewEvent = evt.data;
        var quality = reviewEvent.review.apr / 5;
        var iquality = 1 - quality;
        result.push({
            type: "marker",
            color: '#00' + hexPad(Math.round(255 * quality).toString(16)) + '00',
            latLng: {
                lat: reviewEvent.lt,
                lng: reviewEvent.lg
            }
        });
    });
    return result;
}
function getDrawToolsContainer(containerDiv, events) {
    var controls = addElement(containerDiv, 'div', {}, {});
    var content = addElement(containerDiv, 'div', {}, {});
    var homePortalsOnly = addElement(controls, 'input', { type: 'checkbox' }, {});
    var startDate = addElement(controls, 'input', { type: 'text', value: '1/1/1900' }, {});
    var stopDate = addElement(controls, 'input', { type: 'text', value: '1/1/2100' }, {});
    function updateDrawData() {
        content.innerHTML = '';
        try {
            var start = Date.parse(startDate.value);
            var stop = Date.parse(stopDate.value);
            var filteredEvents = events.filter(function (e) {
                var data = e.data;
                return e.type != eg.opr.EventType.StatChange
                    && (!homePortalsOnly.checked || data.homePortal)
                    && e.ts >= start.valueOf()
                    && e.ts <= stop.valueOf();
            });
            var drawData = getDrawToolsHistory(filteredEvents);
            content.innerText = JSON.stringify(drawData);
        }
        catch (e) {
            content.innerText = e;
        }
    }
    startDate.addEventListener('change', updateDrawData);
    stopDate.addEventListener('change', updateDrawData);
    homePortalsOnly.addEventListener('change', updateDrawData);
}
function selectText(container) {
    if (window.getSelection) {
        var range = document.createRange();
        range.selectNode(container);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    }
}
var toggleInProgress = false;
function createToggle(container, showText, hideText, targetElement) {
    var showA = addElement(container, 'a', { href: 'javascript:void' }, {});
    showA.textContent = showText;
    showA.addEventListener('click', function () {
        if (toggleInProgress)
            return;
        toggleInProgress = true;
        targetElement.style.display = '';
        showA.style.display = 'none';
        hideA.style.display = '';
        setTimeout(function () {
            toggleInProgress = false;
            selectText(targetElement);
        });
    });
    var hideA = addElement(container, 'a', { href: 'javascript:void' }, { 'display': 'none' });
    hideA.textContent = hideText;
    hideA.addEventListener('click', function () {
        if (toggleInProgress)
            return;
        toggleInProgress = true;
        targetElement.style.display = 'none';
        showA.style.display = '';
        hideA.style.display = 'none';
        setTimeout(function () { toggleInProgress = false; });
    });
    targetElement.style.display = 'none';
}
function createTd(tr, text) {
    var td = document.createElement('td');
    td.setAttribute('style', 'white-space: nowrap;border:1px solid black');
    td.textContent = text;
    tr.appendChild(td);
    return td;
}
function pad(n) {
    return (n < 10 ? "0" : "") + n;
}
function addHistoryUI(events) {
    var rejected = 0;
    var nia_rejected = 0;
    var reviewed = 0;
    var duplicates = 0;
    var nia_accepted = 0;
    var total = 0;
    var historyDiv = addElement(document.body, 'div', {}, {
        background: 'white',
        color: 'black',
        'border-collapse': 'collapse'
    });
    var toggleContainer = addElement(historyDiv, 'div', {}, {});
    var tableContainer = addElement(historyDiv, 'div', {}, {});
    createToggle(toggleContainer, 'Show Stat History', 'Hide Stat History', tableContainer);
    var table = addElement(tableContainer, 'table', {}, {});
    var th = addElement(table, 'tr', {}, {});
    addElement(th, 'th', {}, {}).textContent = 'Timestamp';
    addElement(th, 'th', {}, {}).textContent = 'Total';
    addElement(th, 'th', {}, {}).textContent = 'Created';
    addElement(th, 'th', {}, {}).textContent = 'Rejected';
    events.filter(function (e) { return e.type == eg.opr.EventType.StatChange; }).forEach(function (evt) {
        var tr = document.createElement('tr');
        var d = new Date(evt.ts);
        createTd(tr, (d.getMonth() + 1) + '/' + d.getDate() + '/' + (d.getFullYear() + '').substr(2, 2) + ' ' + d.getHours() + ':' + pad(d.getMinutes()));
        var statEvt = evt.data;
        nia_accepted = statEvt.apr;
        nia_rejected = statEvt.rej;
        total = statEvt.rvw;
        createTd(tr, statEvt.rvw + '');
        createTd(tr, statEvt.apr + '');
        createTd(tr, statEvt.rej + '');
        table.appendChild(tr);
    });
    createReviewHistoryUI(historyDiv, events.filter(function (e) { return e.type != eg.opr.EventType.StatChange; }), 'Review History');
    toggleContainer = addElement(historyDiv, 'div', {}, {});
    tableContainer = addElement(historyDiv, 'div', {}, {});
    createToggle(toggleContainer, 'Show Draw Data', 'Hide Draw Data', tableContainer);
    getDrawToolsContainer(tableContainer, events);
}
function createReviewHistoryUI(historyDiv, events, title) {
    var toggleContainer = addElement(historyDiv, 'div', {}, {});
    var tableContainer = addElement(historyDiv, 'div', {}, {});
    createToggle(toggleContainer, 'Show ' + title, 'Hide ' + title, tableContainer);
    var table = addElement(tableContainer, 'table', {}, {});
    var th = addElement(table, 'tr', {}, {});
    addElement(th, 'th', {}, {}).textContent = 'Timestamp';
    addElement(th, 'th', {}, {}).textContent = 'Disposition';
    addElement(th, 'th', {}, {}).textContent = 'Name';
    addElement(th, 'th', {}, {}).textContent = 'Address';
    addElement(th, 'th', {}, {}).textContent = 'Quality';
    addElement(th, 'th', {}, {}).textContent = 'Notes';
    addElement(th, 'th', {}, {}).textContent = 'Home Portal?';
    events.forEach(function (evt) {
        var tr = document.createElement('tr');
        var d = new Date(evt.ts);
        createTd(tr, (d.getMonth() + 1) + '/' + d.getDate() + '/' + (d.getFullYear() + '').substr(2, 2) + ' ' + d.getHours() + ':' + pad(d.getMinutes()));
        var reviewEvent = evt.data;
        //total++;
        //if (reviewEvent.dup)
        //    duplicates++;
        //if (reviewEvent.review.apr < 2)
        //    rejected++;
        createTd(tr, (reviewEvent.dup ? "Duplicate" : reviewEvent.review.apr < 2 ? "Reject" : "Reviewed"));
        var td = createTd(tr, "");
        var a = document.createElement('a');
        a.textContent = reviewEvent.name;
        a.setAttribute('href', 'https://www.ingress.com/intel?ll=' + reviewEvent.lt + ',' + reviewEvent.lg + '&z=17&pll=' + reviewEvent.lt + ',' + reviewEvent.lg + '');
        td.appendChild(a);
        createTd(tr, reviewEvent.addr);
        var avg = (reviewEvent.review.apr + reviewEvent.review.hst + reviewEvent.review.loc + reviewEvent.review.saf + reviewEvent.review.ttl + reviewEvent.review.vis) / 6.0;
        avg = Math.round(avg * 10.0) / 10.0;
        td = createTd(tr, '');
        a = addElement(td, 'a', { href: 'javascript:void' }, {});
        a.textContent = avg + "";
        a.addEventListener('click', getSetAnalysisFx(reviewEvent));
        createTd(tr, reviewEvent.notes ? reviewEvent.notes : '');
        createTd(tr, reviewEvent.homePortal ? 'true' : '');
        table.appendChild(tr);
    });
}
function getSubmitEventHandler(isDuplicate, events) {
    console.info('returning click handler');
    return function () {
        debugger;
        try {
            var analysis = getCurrentAnalysis();
            analysis.dup = isDuplicate;
            processCurrentAnalysis(events, analysis);
        }
        catch (e) {
            alert('failed to save: ' + e + '\n');
        }
    };
}
function addElement(parent, name, attr, styles) {
    var element = document.createElement(name);
    if (parent)
        parent.appendChild(element);
    for (var a in attr)
        element.setAttribute(a, attr[a]);
    var style = "";
    for (var s in styles)
        style = (style == "" ? "" : style + "; ") + s + ":" + styles[s];
    if (style != "")
        element.setAttribute('style', style);
    return element;
}
function getStarButtonGroups() {
    //1 2 3 4 8 9
    var buttonGroups = document.querySelectorAll('div.btn-group');
    if (buttonGroups.length < 9)
        throw new Error("unexpected button group count");
    var result = [buttonGroups[1], buttonGroups[2], buttonGroups[3], buttonGroups[4], buttonGroups[8], buttonGroups[9]];
    return result;
}
function getSetAnalysisFx(analysis) {
    var r = analysis.review;
    return function () {
        var buttonGroups = getStarButtonGroups();
        if (r.apr > 0)
            buttonGroups[0].querySelectorAll('.button-star')[r.apr - 1].click();
        setTimeout(function () {
            if (r.ttl > 0)
                buttonGroups[1].querySelectorAll('.button-star')[r.ttl - 1].click();
            setTimeout(function () {
                if (r.hst > 0)
                    buttonGroups[2].querySelectorAll('.button-star')[r.hst - 1].click();
                setTimeout(function () {
                    if (r.vis > 0)
                        buttonGroups[3].querySelectorAll('.button-star')[r.vis - 1].click();
                    setTimeout(function () {
                        if (r.loc > 0)
                            buttonGroups[4].querySelectorAll('.button-star')[r.loc - 1].click();
                        setTimeout(function () {
                            if (r.saf > 0)
                                buttonGroups[5].querySelectorAll('.button-star')[r.saf - 1].click();
                            setTimeout(function () {
                                if (analysis.searchString && analysis.category && analysis.subcategory) {
                                    var categorySelector = document.querySelector('.classification-row span.text-center');
                                    if (categorySelector)
                                        categorySelector.click(); //it wont be present if the search box is already shown
                                    setTimeout(function () {
                                        var input = document.querySelector('.classification-row input');
                                        input.value = analysis.searchString;
                                        angular.element(input).triggerHandler('input');
                                        setTimeout(function () {
                                            var lis = document.querySelectorAll('.classification-row li');
                                            for (var i = 0; i < lis.length; i++) {
                                                var li = lis[i];
                                                var cat = getCategory(li);
                                                var subCat = getSubcategory(li);
                                                if (cat == analysis.category && subCat == analysis.subcategory) {
                                                    li.querySelector('span:last-child').click();
                                                }
                                            }
                                        }, 100);
                                    }, 100);
                                }
                            }, 100);
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        }, 100);
    };
}
function getDeleteRecordingFx(name, button) {
    return function (evt) {
        if (confirm('are you sure you want to delete: ' + name + '?')) {
            var raw = localStorage.getItem(RECORDING_KEY);
            var recorded = {};
            if (raw)
                recorded = JSON.parse(raw);
            delete recorded[name];
            localStorage.setItem(RECORDING_KEY, JSON.stringify(recorded));
            event.cancelBubble = true;
            event.stopPropagation();
            button.parentElement.removeChild(button);
        }
    };
}
function addUI(events, statsHaveChanged) {
    var div = addElement(document.body, "div", {}, {
        "position": "absolute",
        "top": "50px",
        width: '200px',
        background: 'transparent',
        border: 'none'
    });
    if (statsHaveChanged) {
        var statDiv = addElement(div, 'div', {}, {});
        statDiv.textContent = "Stats have changed: ";
        var stats = events.filter(function (e) { return e.type == eg.opr.EventType.StatChange; });
        var old = stats[stats.length - 2].data;
        var _new = stats[stats.length - 1].data;
        if (old.rej != _new.rej)
            statDiv.textContent += " Rejected " + old.rej + " => " + _new.rej;
        if (old.apr != _new.apr)
            statDiv.textContent += " Approved " + old.apr + " => " + _new.apr;
    }
    var raw = localStorage.getItem(RECORDING_KEY);
    var recorded = {};
    if (raw)
        recorded = JSON.parse(raw);
    for (var name in recorded) {
        var button = addElement(div, "button", { "class": "button" }, { width: '100%' });
        addElement(button, 'span', {}, {}).textContent = name;
        var deleteButton = addElement(button, 'a', { href: 'javascript:void' }, { 'margin-left': '10px' });
        deleteButton.textContent = "X";
        deleteButton.addEventListener('click', getDeleteRecordingFx(name, button));
        button.addEventListener("click", getSetAnalysisFx(recorded[name]));
    }
    addElement(div, 'br', {}, {});
    addElement(div, 'br', {}, {});
    addElement(div, 'br', {}, {});
    addElement(div, 'br', {}, {});
    var recordDiv = addElement(div, 'div', {}, {});
    var btn = addElement(recordDiv, 'button', { "class": "button" }, { width: '100%' });
    btn.textContent = "Record...";
    btn.addEventListener('click', recordAnalysis);
    var catDiv = addElement(recordDiv, 'div', {}, {});
    var cb = addElement(catDiv, 'input', { type: 'checkbox', id: 'recordWhatIsIt' }, {});
    addElement(catDiv, 'span', {}, {}).textContent = "also record category";
    var helpDiv = addElement(catDiv, 'div', {}, { display: 'none' });
    helpDiv.textContent = 'To use this feature, pick your star ratings, then click "make a selection" under "What is it?" and type a search string that finds what you\'re looking for, but DON\'T SELECT IT YET!  Then click the record button, click the item you want to classify this analysis as, then enter a name';
    cb.addEventListener('change', function () {
        helpDiv.style.display = '';
    });
    addElement(div, 'br', {}, {});
    addElement(div, 'br', {}, {});
    var submitButton = document.querySelector('.big-submit-button');
    var notesDiv = addElement(null, 'div', {}, {});
    submitButton.insertAdjacentElement('afterend', notesDiv);
    addElement(notesDiv, 'input', { type: 'checkbox', id: 'opr_homeportal' }, {});
    addElement(notesDiv, 'span', {}, {}).textContent = 'Home portal';
    addElement(notesDiv, 'input', { type: 'text', id: 'opr_notes' }, {});
    return div;
}
function opr_main() {
    console.info('eg.opr starting up...');
    var performance = getCurrentPerformance();
    var rawhistory = localStorage.getItem(HISTORY_STORAGE_KEY);
    var events = new Array();
    if (rawhistory)
        events = JSON.parse(rawhistory);
    watchButtons(events);
    var statsHaveChanged = processCurrentPerformance(events, performance);
    addHistoryUI(events);
    addUI(events, statsHaveChanged);
    var scope = angular.element(document.querySelectorAll('#NewSubmissionController')[0]).scope();
    scope.subCtrl.map2.setMapTypeId('hybrid');
}
function getCategory(li) {
    var category = li.querySelector('span').textContent.trim();
    category = category.substr(0, category.length - 2);
    return category;
}
function getSubcategory(li) {
    return li.querySelector('span:last-child').textContent.trim();
}
function getCategoryClickHandler(li, analysis) {
    return function (evt) {
        analysis.category = getCategory(li);
        analysis.subcategory = getSubcategory(li);
        saveRecordAnalysis(analysis);
    };
}
function recordAnalysis() {
    var recordClassification = document.getElementById('recordWhatIsIt').checked;
    debugger;
    var analysis = getCurrentAnalysis();
    if (recordClassification) {
        analysis.searchString = document.querySelector('.classification-row input').value;
        var lis = document.querySelectorAll('.classification-row li');
        for (var i = 0; i < lis.length; i++) {
            var li = lis[i];
            var subcat = li.querySelector('span:last-child');
            subcat.addEventListener('click', getCategoryClickHandler(li, analysis));
        }
    }
    else {
        saveRecordAnalysis(analysis);
    }
}
function saveRecordAnalysis(analysis) {
    var name = window.prompt('Name?');
    if (name) {
        var raw = localStorage.getItem(RECORDING_KEY);
        var recorded = {};
        if (raw)
            recorded = JSON.parse(raw);
        recorded[name] = analysis;
        localStorage.setItem(RECORDING_KEY, JSON.stringify(recorded));
        alert('your analysis has been recorded.  It will appear as a button after you refresh the page.  The button will set all ratings (and optinal category) when clicked.');
    }
}
setTimeout(opr_main, 1000);
