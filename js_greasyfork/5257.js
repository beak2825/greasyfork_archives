// ==UserScript==
// @name        learn-from-your-mistakes
// @namespace   404
// @description Learn from your own mistakes!
// @include     https://geportal.sumtotalsystems.com/sites/100054/SitePages/GE_Learning.aspx*
// @include     https://ge.sumtotalsystems.com/sumtotal/app/management/LMS_ProgDtl.aspx*
// @include     https://ge.sumtotalsystems.com/sumtotal/app/management/QuickAssessment/QA_Player.aspx*
// @version     2.27
// @require     https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore-min.js
// @grant       unsafeWindow
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_listValues
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/5257/learn-from-your-mistakes.user.js
// @updateURL https://update.greasyfork.org/scripts/5257/learn-from-your-mistakes.meta.js
// ==/UserScript==

/*jslint browser:true, devel:true, newcap: true, moz:true */
/*global GM_getValue, GM_setValue, GM_registerMenuCommand, unsafeWindow, uneval, _ */

// dummy console.log
if (!("console" in unsafeWindow)) {
    alert("dummy console.log");
    var names = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml", "group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"];
    unsafeWindow.console = {};
    for (var i = 0, len = names.length; i < len; ++i) {
        unsafeWindow.console[names[i]] = function () {};
    }
}

console.log("Learning aid. Known courses so far: %r", GM_listValues());


function asKey(s) {
    return s.replace(/[^a-zA-Z_0-9]/g, '_');
}

function removeHTMLCrap(s) {
    return s.replace(/<[^>]+>/ig, " ").replace(/&[^;]+;/ig, ' ').replace(/\s+/ig, ' ').replace(/^\s+|\s+$/g, '');
}

function deserialize(name, def) {
    "use strict";
    return eval(GM_getValue(asKey(name), (def || '({})'))); // jshint ignore:line
}
unsafeWindow.document.deserialize = deserialize;

function serialize(name, val) {
    "use strict";
    GM_setValue(asKey(name), uneval(val));
}
unsafeWindow.document.serialize = serialize;

function withTrace(fun, args) {
    try {
        fun.apply(undefined, args);
    } catch (e) {
        console.trace();
    }
}

////////////////////////
// functions for results scoring
////////////////////////

function getTitleAndDb() {
    var courseTitle, courseDb;
    courseTitle = document.getElementsByClassName('clsSubHeading')[0].textContent;
    console.info("courseTitle", courseTitle);

    courseDb = deserialize(courseTitle);
    console.info("Loaded db" + JSON.stringify(courseDb));
    return [courseTitle, courseDb];
}

// trying to inplace reduce the maybes
function reducing(qDb) {
    var [trues, falses] = _(_(qDb.answers).pairs())
        .partition(function (e) {
            return e[1];
        })
        .map(function (e) {
            return _(e).map(_.first);
        });

    qDb.maybeNo = _.chain(qDb.maybeNo)
        .reject(function (mb) { // remove maybe groups, which has one false results
            return _.intersection(falses, mb).length;
        })
        .map(function (mb) { // remove sure falses from groups and sort values
            return _.difference(mb, falses).sort();
        })
        .filter(function (mb) { // remove empty and 1 lenght, andalso convert lonely maybes to sure ones
            switch (mb.length) {
            case 0:
                return false;
            case 1:
                console.log("Lonely maybe");
                qDb.answers[mb[0]] = false;
                return false;
            default:
                return true;
            }
        })
        .sortBy(function (e) { // sort the list by size
            return e.length;
        })
        .reject(function (e, i, list) { // remove irrelevant maybes (remove [1,2,3] if [1,2] is present)
            if (i === 0) return false;
            var slice = _.first(list, i);
            // if we found some  subset of the maybe, drop id
            return _.some(slice, function (other) {
                var res = _.difference(other, e).length === 0;
                if (res) console.info("Found!", e, other);
                return res;
            });
        })
        .value();
    return qDb;
}

function processAnswers() {

    var courseDb, courseTitle, table;

    [courseTitle, courseDb] = getTitleAndDb();

    table = document.getElementById('idProgressTable');
    if (!table) {
        console.log("OMG, table is %s", table);
        return;
    }

    ['clsTableRowEven', 'clsTableRowOdd'].forEach(function (cls) {
        _(table.getElementsByClassName(cls)).each(function (rowEl) {
            var tds, q, qType, point, answered, multi, mn;
            tds = rowEl.getElementsByTagName('td');
            q = removeHTMLCrap(tds[0].title);
            qType = tds[1].title;
            point = tds[2].title;
            answered = tds[3].title.split(",");
            multi = qType == "Multiple Select";

            try {
                console.log("[?] " + q);
                if (!courseDb[q]) {
                    console.warn("No info for question %s", q);
                    courseDb[q] = {
                        answers: {},
                        maybeNo: [],
                        complete: false
                    };
                }
                var qDb = courseDb[q];

                if (qDb.complete) return;

                if (point == '1') qDb.complete = true;

                if (multi) {
                    if (point == '0') {
                        console.warn("Maybeno ", answered);

                        qDb.maybeNo.push(answered);
                    } else {
                        qDb.noCorrect = Math.round(answered.length / parseFloat(point));
                        _(answered).each(function (e) {
                            qDb.answers[e] = true;
                        });
                    }
                } else {
                    qDb.noCorrect = 1;
                    _(answered).each(function (e) {
                        qDb.answers[e] = _(answered).contains(e) == (point != '0');
                    });
                }
                reducing(qDb);

            } catch(e) {
                alert(e);
            }
        });
    });

    var res = {};
    res[courseTitle] = courseDb;
    alert(JSON.stringify(res));
    serialize(courseTitle, courseDb);
    console.log("Updating successful");
}

function getLabelFor(id) {
    return _.find(document.getElementsByTagName('label'), function (e) {
        return e.attributes.for.value == id;
    });
}

function labelFor(id, shouldCheck) {
    var label = getLabelFor(id);
    var prefix;
    switch (shouldCheck) {
    case true:
        prefix = '[\u2714] ';
        var cb = document.getElementById(id);
        if (!cb.checked) cb.click();
        break;
    case false:
        prefix = '[\u2718] ';
        break;
    }
    label.textContent = prefix + label.textContent;
}

function markAnswers() {
    var asnwerPanel = document.getElementById('AnswerPanel');
        ['clsCheckBox', 'clsTableRowOdd'].forEach(function (cls) {
        _.each(asnwerPanel.getElementsByClassName(cls), function (rowEl) {
            var l = getLabelFor(rowEl.id);
            l.textContent = rowEl.value + ' ' + l.textContent;
        });
    });
}

function helpAnswers() {
    markAnswers();
    console.log("Help answers");
    var courseTitle = document.getElementsByTagName('title')[0].text.replace(/.*?- /, '');
    console.log("courseTitle", courseTitle);
    var courseDb = deserialize(courseTitle);
    console.log("Helping");
    console.log(courseDb);

    var qTitle = document.getElementById('QuestionTextLabel');
    if (!qTitle) {
        console.log("not a question");
        return;
    }
    try {
        qTitle = removeHTMLCrap(qTitle.innerHTML);
        console.log(qTitle);

        var answers = courseDb[qTitle];
        console.log("knowledge", answers);

        var div = document.createElement('div');
        document.getElementById('QuestionTextPanel').appendChild(div);

        if (!answers) {
            div.appendChild(document.createTextNode('No info'));
            return; // no previous answers
        }

        div.appendChild(document.createTextNode(JSON.stringify(answers)));

        var asnwerPanel = document.getElementById('AnswerPanel');
        ['clsCheckBox', 'clsTableRowOdd'].forEach(function (cls) {
            _.each(asnwerPanel.getElementsByClassName(cls), function (rowEl) {
                //console.debug(rowEl);
                if (!_(answers.answers).has(rowEl.value)) return;
                labelFor(rowEl.id, answers.answers[rowEl.value]);
            });
        });
    } catch (e) {
        console.trace();
        console.log(e);
    }
}

function navClicked() {
    console.log("navClicked");
    setTimeout(function() { withTrace(nextHook)}, 2000);
}

function nextHook() {
    console.log("nextHook");
    try {
        ['NextBtn', 'PreviousBtn', 'SubmitAssessmentBtn'].forEach(function (btn) {
            document.getElementById(btn).addEventListener("click", navClicked);
        });
    } catch (e) {
        console.trace();
        console.log(e);
    }
    console.log("Hooks active");
    helpAnswers();
}

function main() {
    try {
        console.info("main", window.location);
        if (window.location.toString().startsWith('https://ge.sumtotalsystems.com/sumtotal/app/management/LMS_ProgDtl.aspx') ||
            window.location.toString().startsWith('https://ge.sumtotalsystems.com/sumtotal/app/management/LMS_LearnerReports.aspx')) {
            if (document.getElementsByClassName('clsALink').length) {
                processAnswers();
            }
        }

        if (window.location.toString().startsWith('https://ge.sumtotalsystems.com/sumtotal/app/management/QuickAssessment/QA_Player.aspx')) {
            nextHook();
        }

        if (window.top !== window.self) { //don't run on frames or iframes
            console.log("In frame " + window.location);
            // return;
        }
    } catch (e) {
        console.log(e);
        setTimeout(main, 10000);
    }
}

window.addEventListener('load', function () {
    main();
});

function mergeData(data1, data2) {
    console.log("Merging", data1, data2);
    _.extend(data1, data2);
    _.extend(data1.answers, data2.answers);
    _.union(data1.maybeNo, data2.maybeNo);

    _.each(data1, function (e) {
        reducing(e);
    });
    return data1;
}

function mergeResults() {
    var input, first, courseTitle, data;
    try {
        input = JSON.parse(prompt("Enter JSON data"));
    } catch (e) {
        alert("Could not parse");
        console.debug(e);
        return;
    }


    first = (_.pairs(input))[0];
    console.info("First", first);
    
    [courseTitle, data]  = first; // 
    
    console.info("Course title", JSON.stringify(courseTitle));
    console.info("Merged data " + JSON.stringify(data));


    var courseDb = deserialize(courseTitle);

    console.info("Before merging " + JSON.stringify(courseDb));
    courseDb = mergeData(data, courseDb);
    serialize(courseTitle, courseDb);
    console.info("After merging ");
    console.info(deserialize(courseTitle));
    alert("I haz moar knowledge");
}

GM_registerMenuCommand("Import knowledge", mergeResults);