// ==UserScript==
// @name         WaniKani Lesson Balance
// @version      0.1.4
// @description  Reorder lessons to maintain an even balance across radicals / kanji / vocab as well as ordering to maximize unlocks.
// @require      https://cdn.rawgit.com/curious-attempt-bunny/wanikani-user-script-helper/4374eae6a4a284c3c3da9d50caa83b8e1a1a6e5d/loader.js
// @author       hitechbunny
// @include      https://www.wanikani.com/lesson/session
// @run-at       document-end
// @grant        none
// @namespace https://greasyfork.org/users/149329
// @downloadURL https://update.greasyfork.org/scripts/34858/WaniKani%20Lesson%20Balance.user.js
// @updateURL https://update.greasyfork.org/scripts/34858/WaniKani%20Lesson%20Balance.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Hook into App Store
    try { $('.app-store-menu-item').remove(); $('<li class="app-store-menu-item"><a href="https://community.wanikani.com/t/there-are-so-many-user-scripts-now-that-discovering-them-is-hard/20709">App Store</a></li>').insertBefore($('.navbar .dropdown-menu .nav-header:contains("Account")')); window.appStoreRegistry = window.appStoreRegistry || {}; window.appStoreRegistry[GM_info.script.uuid] = GM_info; localStorage.appStoreRegistry = JSON.stringify(appStoreRegistry); } catch (e) {}

    $('#lessons').css('filter','blur(8px)').css('opacity','0.9');

    function subjectToKey(subject) {
        return subject.object.substring(0,3)+"/"+(subject.data.characters || subject.data.character);
    }

    function candidateToKey(candidate) {
        if (candidate.kan) {
            return "kan/"+candidate.kan;
        } else if (candidate.voc) {
            return "voc/"+candidate.voc;
        } else {
            return "rad/"+candidate.rad;
        }
    }

    window.WKHelper.init(GM_info, function() {
        window.WKHelper.ajax_retry('https://wanikanitools-golang.curiousattemptbunny.com/level/progress?api_key='+window.WKHelper.api_key_v2).then(function(progress) {
            $('#lessons').css('filter','').css('opacity','');

            var userLevel = progress.progresses[progress.progresses.length-1].level;
            var progressType = {};
            progress.progresses.forEach(function(type) {
                if (type.level == userLevel) {
                    progressType[type.type] = type;
                }
            });

            window.WKHelper.ajax_retry('https://wanikani.com/api/v2/subjects?levels='+userLevel, {headers: {'Authorization': 'Token token='+window.WKHelper.api_key_v2}}).then(function(level) {
                //console.log(level);
                var levelSubjectsByKey = {};
                var levelSubjectsById = {};
                level.data.forEach(function(subject) {
                    levelSubjectsByKey[subjectToKey(subject)] = subject;
                    levelSubjectsById[subject.id] = subject;
                });

                var unlocksByKey = {};
                level.data.forEach(function(subject) {
                    if (subject.data.component_subject_ids) {
                        subject.data.component_subject_ids.forEach(function(unlocker) {
                            var unlockedSubject = levelSubjectsById[unlocker];
                            if (unlockedSubject) {
                                var key = subjectToKey(unlockedSubject);
                                if (!unlocksByKey[key]) {
                                    unlocksByKey[key] = [];
                                }
                                unlocksByKey[key].push(subjectToKey(subject));
                            }
                        });
                    }
                });
//                console.log(unlocksByKey);

//                console.log(levelSubjectIds);
//                console.log("level characters:", level.data.map(function(subject) { return subject.data.characters || subject.data.character; }).join(", "));

                function reorder() {
                    var candidates = [].concat($.jStorage.get('l/activeQueue')).concat($.jStorage.get('l/lessonQueue'));

                    var ordered = [];
                    var candidatesByType = {radical: [], kanji: [], vocabulary: []};
                    var countsByType = {radical: {count: 0, max: 0}, kanji: {count: 0, max: 0}, vocabulary: {count: 0, max: 0}};
                    level.data.forEach(function(subject) {
                        countsByType[subject.object].max += 1;
                    });
                    var typeByPriority = ['vocabulary', 'kanji', 'radical'];
                    typeByPriority.forEach(function(type) {
                        if (progressType[type].level == userLevel) {
                            for(var i=1; i<progressType[type].srs_level_totals.length; i++) {
                                countsByType[type].count += progressType[type].srs_level_totals[i];
                            }
                        }
                        countsByType[type].started = (100.0*countsByType[type].count) / countsByType[type].max;
                    });
                    //                console.log(countsByType);

                    var candidatesByKey = {};
                    candidates.forEach(function(candidate) {
                        var subject = levelSubjectsByKey[candidateToKey(candidate)];
                        if (subject) {
                            candidatesByType[subject.object].push(candidate);
                            candidatesByKey[subjectToKey(subject)] = candidate;
                        } else {
                            console.log(candidateToKey(candidate), candidate);
                            ordered.push(candidate);
                        }
                    });

                    console.log("candidatesByType:", candidatesByType);
                    console.log("ordered:", ordered);

                    var i = 0;
                    while(true) {
                        var msg = i+": "+typeByPriority.map(function(type) { return type+" @ "+Math.floor(countsByType[type].started)+"%"; }).join(', ');

                        var minType = null;
                        typeByPriority.forEach(function(type) {
                            if (candidatesByType[type].length > 0) {
                                if (!minType || countsByType[type].started < countsByType[minType].started) {
                                    minType = type;
                                }
                            }
                        });

                        if (minType === null) {
                            break;
                        }
                        //console.log("candidatesByType["+minType+"].length:", candidatesByType[minType].length);
                        msg += " MinType is "+minType+" @ "+Math.floor(countsByType[minType].started)+"%";

                        var best = null;
                        var bestUnlocks = null;
                        candidatesByType[minType].forEach(function(candidate) {
                            var unlocked = {};
                            var todo = [candidateToKey(candidate)];
                            while(todo.length > 0) {
                                var testKey = todo[0];
                                todo = todo.slice(1);
                                //console.log("test:"+testKey);
                                var unlocks = unlocksByKey[testKey];
                                if (unlocks) {
                                    unlocks.forEach(function(leafKey) {
                                        //console.log("leaf:"+leafKey);
                                        if (!unlocked[leafKey] && levelSubjectsByKey[leafKey]) {
                                            unlocked[leafKey] = leafKey;
                                            todo.push(leafKey);
                                        }
                                    });
                                }
                            }

                            //console.log("\t"+candidateToKey(candidate)+" unlocks "+Object.keys(unlocked).join(", "));
                            if (!best || Object.keys(unlocked).length > Object.keys(bestUnlocks).length) {
                                best = candidate;
                                bestUnlocks = unlocked;
                            }
                        });

                        countsByType[minType].count += 1;
                        countsByType[minType].started = (100.0*countsByType[minType].count) / countsByType[minType].max;

                        //console.log("best:", best);
                        console.log(msg+" -- "+candidateToKey(best)+" unlocks "+Object.keys(bestUnlocks).join(", "));

                        candidatesByType[minType] = candidatesByType[minType].filter(function(test) { return test.id != best.id; });
                        delete candidatesByKey[candidateToKey(best)];
                        ordered.push(best);
                    }

                    $.jStorage.set('l/activeQueue', ordered.slice(0, $.jStorage.get('l/batchSize')));
                    $.jStorage.set('l/lessonQueue', ordered.slice($.jStorage.get('l/batchSize')));
                    $.jStorage.set('l/currentLesson', ordered[0]);
                    $.jStorage.set('l/lessonIndex', 0);
                    $.jStorage.listenKeyChange('l/lessonQueue', function() { window.location.reload(); });
                    console.log("FINISHED REORDERING");
                }

                reorder();
            });

        });
    });
})();