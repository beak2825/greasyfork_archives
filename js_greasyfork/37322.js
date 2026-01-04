// ==UserScript==
// @name         IQ JazzMan
// @namespace    https://iq-jazz-firestore.firebaseio.com
// @version      1.1.5
// @description  do some jazz
// @author       studentx
// @copyright    2017+, JazzMan
// @license      Beerware License; https://people.freebsd.org/~phk/
// @match        http://iq.karelia.ru/next1.php
// @match        http://iq.karelia.ru/finish.php
// @require      http://code.jquery.com/jquery-3.2.1.min.js
// @require      https://unpkg.com/firebase@4.8.2/firebase.js
// @require      https://unpkg.com/firebase@4.8.2/firebase-firestore.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37322/IQ%20JazzMan.user.js
// @updateURL https://update.greasyfork.org/scripts/37322/IQ%20JazzMan.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var ninjaLevel = 0;
    var autoclick = false;

    var firebaseConfig = {
        apiKey: "AIzaSyD3fEm1BI7UPXDZHpKf5Zz6sAjAh37C4es",
        authDomain: "iq-jazz-clean.firebaseapp.com",
        databaseURL: "https://iq-jazz-clean.firebaseio.com",
        projectId: "iq-jazz-clean",
        storageBucket: "iq-jazz-clean.appspot.com",
        messagingSenderId: "1014132620264"
    };

    var answCache = [];
    var answCacheTime = 0;

    var lspKey = 'jazz';

    function setLocalStorage(arr, key = 'jazz') {
        localStorage.setItem(key, JSON.stringify(arr));
    }

    function addLocalStorage(obj, key = 'jazz') {
        var templs = getLocalStorage(key);
        templs.push(obj);
        setLocalStorage(templs, key);
    }

    function getLocalStorage(key = 'jazz') {
        return JSON.parse(localStorage.getItem(key));
    }

    function trimNR(str) {
        return str.replace(/[\n\r]+/g, '').trim();
    }

    function useGlue() {
        function checkSym(fsym, ssym) {
            if (fsym === undefined && ssym === undefined) {
                return '';
            }
            if (ssym === undefined) {
                return fsym;
            }
            if (fsym === undefined) {
                return ssym;
            }

            if (fsym.trim() !== '') {
                return fsym;
            } else {
                return ssym;
            }
        }

        var elements = $('.kbd');
        var text = [];
        for (var i = 0; i < elements.length; i += 2) {
            var firstStr = $(elements[i]).text();
            var secondStr = $(elements[i + 1]).text();
            var parsedStr = '';
            for (var j = 0; j < secondStr.length; j++) {
                parsedStr += checkSym(firstStr[j], secondStr[j]);
            }
            text.push(parsedStr);
        }

        elements.each(function (i, element) {
            element = $(element);
            if (i % 2 === 0) {
                element.text(text.shift());
            } else {
                element.remove();
            }
        });
    }

    function isBroken() {
        if ($('.kbd').length)
            return true;
        else
            return false;
    }

    function checkInputs() {
        var choosed = [];
        if ($('input:radio').length != 0) {
            $('input:radio').each(function (i, el) {
                if ($(el).prop("checked")) choosed.push(i);
            });
        } else if ($('input:checkbox').length != 0) {
            $('input:checkbox').each(function (i, el) {
                if ($(el).prop("checked")) choosed.push(i);
            });
        }
        obj.timestamp = Date.now();
        obj.choosed = choosed;
    }

    function selectAnswers(obj) {
        var answ = [];
        obj.choosed.forEach(function(val) {answ.push(`"${obj.answers[val]}"`);});
        return answ.join(', ');
    }

    $(function () {
        firebase.initializeApp(firebaseConfig);
        var db = firebase.firestore();

        var ls = getLocalStorage(lspKey);
        if (!Array.isArray(ls) || ls === null || ls === undefined) {
            ls = [];
            setLocalStorage(ls, lspKey);
        }

        var yblock = $('body > center > table > tbody > tr > td:nth-child(2) > table > tbody > \
tr:nth-child(2) > td:nth-child(2) > table > tbody > tr > td:nth-child(1)');

        var testLabel = $('body > center > table > tbody > tr > td:nth-child(2) > table > \
tbody > tr:nth-child(1) > td > div:nth-child(1) > font > b');
        var testLabelText = testLabel.text();

        window.obj = {};

        if (window.location.pathname == "/next1.php") {
            var question = '';
            var answers = [];

            if (getLocalStorage('answCacheTime') !== null) {
                answCacheTime = getLocalStorage('answCacheTime');
            }
            if (getLocalStorage('answCache') !== null) {
                answCache = getLocalStorage('answCache');
            }
            console.log(answCacheTime, answCache);

            if (isBroken()) {
                useGlue();

                $('body > center > center > table:nth-child(3) > tbody > tr > \
td > table > tbody > tr > td > div > font > table').each(function (i, el) {
                    if (i != 0)
                        question += ' ';
                    question += $(el).text();
                });

                var $answer;
                $('span.answ').each(function (questionNumber, el) {
                    $answer = '';
                    $(el).find('table').each(function (i, tel) {
                        if (i != 0)
                            $answer += ' ';
                        $answer += $(tel).find('tbody > tr:nth-child(1) > td:nth-child(2) > pre').text();
                    });
                    answers.push(trimNR($answer));
                });
            } else {
                question = $('body > center > center > table:nth-child(3)').text().trim();

                $('.answ').each(function (i, el) {
                    answers.push(trimNR($(el).text()));
                });
            }

            var questionNumber = Number($('body > center > center > \
table:nth-child(1) > tbody > tr > td:nth-child(2)').text().slice(7, 9).trim());
            var testName = $("body > center > center > table:nth-child(1) \
> tbody > tr > td:nth-child(1)").text().slice(8);

            obj = {
                timestamp: Date.now(),
                test: trimNR(testName),
                question: trimNR(question),
                answers: answers,
                choosed: []
            };

            db.collection("tests").where("question", "==", obj.question).orderBy("mark", "desc").limit(3)
                .get()
                .then(function(querySnapshot) {
                $('body').append('<div id="zhopa"><div id="govno"></div></div>');
                $('#zhopa').css('background-color', 'white');
                $('#zhopa').css('margin-top', '100%');

                var bestAnswer = null;
                querySnapshot.forEach(function(doc) {
                    if(bestAnswer === null) {
                        bestAnswer = doc.data();
                    }
                    $('#govno').append(`<tr class="moipez"}><td>${doc.data().question}</td><td>${selectAnswers(doc.data())}</td><td>${doc.data().mark}</td></tr>`);
                });
                $('.moipez').css('background-color', 'lightgreen');
                yblock.click(function() {
                    if (bestAnswer !== null) {
                        var needToSelect = [];
                        bestAnswer.choosed.forEach(function(val) {
                            needToSelect.push(bestAnswer.answers[val]);
                        });
                        answers.forEach(function(localAnsw, num) {
                            if (needToSelect.includes(localAnsw)) {
                                $($('input')[num]).click();
                            }
                            //console.log(localAnsw, num);
                        });
                        testLabel.text(`${testLabelText} ${bestAnswer.mark}`);
                        //console.log(needToSelect);
                        //console.log(answers);
                    }
                });
                if (autoclick) {
                    yblock.click();
                    var checkedCounter = 0;
                    $('input').each(function(num, el) {
                        if($(el).is(':checked'))
                            checkedCounter++;
                    });
                    if (checkedCounter > 0) {
                        $('input:submit').first().click();
                        checkedCounter = 0;
                    }
                    console.log('clickayu');
                }
            })
                .catch(function(error) {
                console.log("Error getting documents: ", error);
            });

            $('input:submit').first().click(function (e) {
                console.log('special click');
                e.preventDefault();
                checkInputs();
                addLocalStorage(obj, lspKey);
                $(this).unbind('click').click();
            });
        }

        if (window.location.pathname == "/finish.php") {
            var testName = $("body > center > table:nth-child(2) > \
tbody > tr > td:nth-child(1)").text().slice(8);
            var fullName = $("body > center > table:nth-child(2) > \
tbody > tr > td:nth-child(2)").text();
            var mark = $("body > center > table:nth-child(4) > tbody > \
tr > td > table > tbody > tr > td > div > \
font > font:nth-child(7) > b").text();

            window.obj = {
                timestamp: Date.now(),
                test: trimNR(testName),
                mark: parseFloat(mark)
            };

            var innerLs = getLocalStorage(lspKey);
            if (Array.isArray(innerLs)) {
                var batch = db.batch();
                var testsRef = db.collection("tests");

                innerLs.forEach(function(item) {
                    if (item.test == obj.test) {
                        item.timestamp = obj.timestamp;
                        item.mark = obj.mark;
                        batch.set(testsRef.doc(), item);
                    }
                });
                batch.commit();
            }

            setLocalStorage([], lspKey);
        }

        console.log('activated');
    });
})();