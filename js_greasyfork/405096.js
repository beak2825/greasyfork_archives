// ==UserScript==
// @name         BishBashBosh+
// @namespace    http://tampermonkey.net/
// @version      0.17
// @description  Extend BishBashBosh's great interface with more review types
// @author       Ian Mason
// @match        http://jptools.s3-website-us-east-1.amazonaws.com/bishbashbosh.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405096/BishBashBosh%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/405096/BishBashBosh%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = "#answer2 {font-size: 3em;width: 15em;text-align: center;} #config { margin-left: 40px; width: 50px; } #oneanddonelabel { margin-left: 40px; }";
    document.head.appendChild(styleSheet);

    var element = document.getElementById('contentSelectorForm');
    element.id = "contentSelectorForm2";
    var whitespace = "    ";
    element.innerHTML = element.innerHTML.concat(whitespace);

    {
        var p = document.createElement("b");
        p.innerHTML = "1&Done";
        p.id = "oneanddonelabel";
        element.appendChild(p);

        var oneanddone = document.createElement("Input");
        oneanddone.setAttribute("type", "checkbox");
        oneanddone.id = "oneanddone";

        element.appendChild(oneanddone);
    }
    var answer = document.getElementById('answer');
    var answer_parent = answer.parentNode;
    answer.style.display = "none";
    var cln = answer.cloneNode(false);
    answer_parent.appendChild(cln);

    var config = document.createElement("input");
    config.placeholder = "ALL";
    var idAttribute = document.createAttribute("id");
    idAttribute.value = "config";
    config.setAttributeNode(idAttribute);
    element.appendChild(config);


    cln.id = "answer";
    answer.id = "answer2";

    function getInputElement(name) {
        var input = document.createElement("Input");
        var idAttribute = document.createAttribute("id");
        idAttribute.value = name;
        var typeAttribute = document.createAttribute("type");
        typeAttribute.value = "radio";
        var nameAttribute = document.createAttribute("name");
        nameAttribute.value = "content";
        var valueAttribute = document.createAttribute("value");
        valueAttribute.value = name;
        input.setAttributeNode(idAttribute);
        input.setAttributeNode(typeAttribute);
        input.setAttributeNode(nameAttribute);
        input.setAttributeNode(valueAttribute);
        return input;
    }
    function getLabelElement(name, visibleName) {
        var label = document.createElement("Label");
        label.innerHTML = visibleName;//"ALL Ancient Gurus and Apprentice";
        var forAttribute = document.createAttribute("for");
        forAttribute.value = name;
        var idAttribute = document.createAttribute("id");
        idAttribute.value = name;
        label.setAttributeNode(forAttribute);
        label.setAttributeNode(idAttribute);
        return label;
    }

    var input = getInputElement("allOldGuruApprentice");
    var label = getLabelElement("allOldGuruApprentice", "ALL ancient guru and apprentice");

    var input2 = getInputElement("randomBurned");
    var label2 = getLabelElement("randomBurned", "ALL random burned");
    element.appendChild(input);
    element.appendChild(label);
    element.appendChild(input2);
    element.appendChild(label2);

    var one_and_done_mode = false;
/*
    var input = document.createElement("Input");
    var idAttribute = document.createAttribute("id");
    idAttribute.value = "test";
    var typeAttribute = document.createAttribute("type");
    typeAttribute.value = "radio";
    var nameAttribute = document.createAttribute("name");
    nameAttribute.value = "content";
    var valueAttribute = document.createAttribute("value");
    valueAttribute.value = "test";

    input.setAttributeNode(idAttribute);
    input.setAttributeNode(typeAttribute);
    input.setAttributeNode(nameAttribute);
    input.setAttributeNode(valueAttribute);
    element.appendChild(input);

    var label = document.createElement("Label");
    label.innerHTML = "ALL Ancient Gurus and Apprentice";
    var forAttribute = document.createAttribute("for");
    forAttribute.value = "test";
    label.setAttributeNode(forAttribute);

    element.appendChild(label);
*/
    console.log('/// Testing');

    //function fetchStudyMaterials() {
    //    console.log("Make useless");
    //    return [];
    //}

    //function fetchSubjects() {
    //    console.log("FetchSubjects overridden");
    //    return [];
    //}

    function fetchAncientThings() {
        // 4 random gurus older than 10 weeks and not seen in in the past 2 days,
        // picked from the oldest 20
        const ageCutoff = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7 * 10);
        const recentCorrectCutoff = new Date(Date.now() - 1000 * 60 * 60 * 24 * 2);
        return pullWholeCollection("assignments?srs_stages=1,2,3,4,5,6").then(list => {
            const output = _(list)
            .sortBy(["data.created_at"])
            .filter(x => new Date(x.data_updated_at) < recentCorrectCutoff)
            .filter(x => ageCutoff > new Date(x.data.started_at))
            .shuffle()
            .take(isNaN(config.value) || config.value == "" ? 99999 : config.value)
            .value();
            console.log(output);
            return output;
        });
    }

    function fetchRandomBurned() {
        return pullWholeCollection("assignments?burned=true").then(list => {
            const output = _(list)
            .shuffle()
            .take(isNaN(config.value) || config.value == "" ? 99999 : config.value).value();
            console.log(output);
            return output;
        });
    }

    function play2(assignments, subjects) {
        const answerField_orig = document.querySelector("#answer");
        answerField_orig.style.display = "none";
        const answerField = document.querySelector("#answer2");
        const questionDiv = document.querySelector("#question");
        const whatToPut = document.querySelector("#whattoput");
        const solution = document.querySelector("#solution");
        const queue = document.querySelector("#queue");
        const result = document.querySelector("#result");
        const tpl = _.template(
            '<span class="label"><%= label %></span><br>' +
            '<span class="kind" style="border-color:<%= colours[object] %>"><%= object %></span>'
        );
        const solTpl = _.template('<h2><%= title %></h2><%= sub.length > 1 ? "<h4>" + sub.join(", ") + "</h4>" : "" %><p><%= body %></p>');

        const PH_MEANING = 1;
        const PH_READING = 2;

        const now = new Date();
        const deck2 = _(assignments).map(a => ({
            score: startingScore,
            perfect: true,
            type: a.data.subject_type,
            subject: subjects[a.data.subject_id],
            availNow: new Date(a.data.available_at) <= now
        })).shuffle().orderBy(["availNow"],["desc"]).value();
        const hand2 = deck2.splice(0, Math.min(initialHandSize, deck2.length));
        console.log(hand2);
        const pile2 = [];
        subjects = null; // free some ram

        let phase = PH_MEANING;
        let hadError = false;
        let curAudio = null;

        function check2() {
            if (phase === PH_READING && !wanakana.isKana(answerField.value)) {
                // catch unfinished n's etc
                answerField.value = wanakana.toKana(answerField.value);
            }
            const card2 = hand2[0], subj2 = card2.subject;
            console.log(subj2);
            const answer2 = _.trim(answerField.value).toLowerCase();
            console.log(answer2);

            if (answer2 === "") { return; }
            if (TESTMODE && answer2==="1" || answer2==="2") {
                return answer2 === "1" ? success2() : fail2();
            }
            if (phase === PH_MEANING) {
                const found = _.find(subj2.accepted_meanings,
                                     m => levenshtein(m, answer2) <= Math.floor(1 + m.length/5));
                return found ? success2() : fail2();
            } else {
                if (subj2.accepted_readings.includes(answer2)) {
                    return success2();
                } else if (subj2.bad_readings.includes(answer2)) {
                    return notQuite2();
                } else {
                    const rom = wanakana.toRomaji(answer2);
                    const foundClose = _.find(subj2.accepted_readings,
                                              m => levenshtein(wanakana.toRomaji(m), rom) <= (m.length < 2 ? 0 : 1));
                    if (foundClose) {
                        return notQuite2();
                    }
                }
                return fail2();
            }
        };
        function maybeAddFronDeck2() {
            const lowestHandScore = _(hand2).map("score").min();
            if (lowestHandScore >= increaseHandThreshold && hand2.length < maxHandSize && deck2.length) {
                hand2.unshift(deck2.pop());
            }
        }
        function animateResult2(isCorrect, score) {
            result.innerHTML = (isCorrect ? goodResults : badResults)[score];
            result.classList.remove("animate");
            void result.offsetWidth; // interesting hack
            result.classList.add("animate");
            result.classList.remove("right");
            result.classList.remove("wrong");
            result.classList.add(isCorrect ? "right" : "wrong");
        }
        function success2() {
            const card = hand2[0], subj = card.subject;
            animateResult2(true, card.score);
            if (subj.object === "radical" || phase === PH_READING) {
                if (curAudio) { curAudio.play(); }
                if (hadError) {
                    hand2.splice(1, 0, hand2.shift());
                } else {
                    card.score += card.perfect ? one_and_done_mode ? discardScore : 2 : 1;
                    const enoughStillInPlay = deck2.length > 0 || hand2.length > initialHandSize;
                    const allDone = _(hand2).map("score").min() >= discardScore;
                    if (card.score >= discardScore) {
                        if (!enoughStillInPlay) {
                            if (_(hand2).map("score").min() >= discardScore) {
                                // discard all
                                while (hand2.length) {
                                    pile2.push(hand2.shift());
                                }
                            } else {
                                // rotate to back
                                hand2.push(hand2.shift());
                            }
                        } else {
                            // discard
                            pile2.push(hand2.shift());
                        }
                    } else {
                        // move back in hand
                        hand2.splice(Math.min(hand2.length-1, card.score*3), 0, hand2.shift());
                    }
                    maybeAddFronDeck2();
                }
                hadError = false;
                phase = PH_MEANING;
            } else {
                phase = PH_READING;
            }
            display2();
        }
        function notQuite2() {
            const card = hand2[0];
            card.perfect = false;
            solution.innerHTML = "<h2>Not quite...</h2>";
            solution.style.display = "block";
            answerField.value = "";
        }
        function fail2() {
            const card2 = hand2[0], subj2 = card2.subject;
            animateResult2(false, card2.score);
            if (phase === PH_MEANING) {
                solution.innerHTML = solTpl({title: subj2.primary_meanings, sub: subj2.accepted_meanings, body: subj2.meaning_mnemonic});
            } else {
                if (curAudio) { curAudio.play(); };
                solution.innerHTML = solTpl({title: subj2.primary_readings, sub: subj2.accepted_readings, body: subj2.reading_mnemonic});
            }
            if (!hadError) {
                card2.score = Math.max(0, card2.score - 2);
                card2.perfect = false;
            }
            solution.style.display = "block";
            answerField.value = "";
            answerField.placeholder = "Nope :(    Try again...";
            hadError = true;
        }
        function display2() {
            const card = hand2[0];
            if (!card) {
                answerField.style.display = "none";
                whatToPut.style.display = "none";
                questionDiv.innerHTML = tpl({label:"BOSH!",object:""});
                document.querySelector("#info").style.display = "block";
                redrawQueue2();
                return;
            }
            questionDiv.innerHTML = tpl(card.subject);
            switchInputMode2(phase === PH_READING);
            whatToPut.innerHTML = phase === PH_READING ? "読み方" : "MEANING";
            answerField.value = "";
            answerField.placeholder = "";
            answerField.style.display = "inline-block";
            whatToPut.style.display = "block";
            solution.style.display = "none";
            curAudio = _.get(card, "subject.audio.length", 0) ? new Audio(_.sample(card.subject.audio)) : null;
            redrawQueue2();
            answerField.focus();
        }
        function redrawQueue2() {
            const style = score => {
                const offset = Math.round(score / discardScore * 55);
                return 'style="background-color: rgb(' + (255-offset) + ',' + (200+offset) + ',200);"';
            };
            queue.innerHTML = '<strong style="color:#2c2;">' + pile2.length + "</strong> + " +
                _.map(hand2, c => "<span " + style(c.score) + ">" + c.subject.label + "</span>").join("") +
                ' + <strong style="color:#f22;">' + deck2.length + "</strong>";
        }

        function switchInputMode2(isKana) {
            try {
                wanakana.unbind(answerField);
            } catch (err) {
                // fails if not bound already and I'm lazy
            }
            if (isKana) {
                wanakana.bind(answerField, {
                    IMEMode: true
                });
            }
        }

        answerField.addEventListener("keydown", ev => {
            if (ev.keyCode !== 13) { return; }
            check2();
        });

        display2();
    }

    document.querySelector("#contentSelectorForm2").addEventListener("change", ev => {
        if(ev.target.id == "oneanddone")
        {
            one_and_done_mode = !one_and_done_mode;
            return;
        }
        if(ev.target.id == "config")
        {
            if(ev.target.value == "")
            {
                label.innerHTML = "ALL ancient guru and apprentice";
                label2.innerHTML = "ALL random burned";
            }
            else
            {
                label.innerHTML = ev.target.value.toString() + " ancient guru and apprentice";
                label2.innerHTML = ev.target.value.toString() + " random burned";
            }
            return;
        }
        const content = usableFormData("contentSelectorForm2").content;
        storeLocal("content", content);
        document.querySelector("#loading").style.display = "block";
        document.querySelector("#main").style.display = "none";

        isLoading = true;

        const selectedContent = () => {
            switch (content) {
                case "apprentice1":
                    var lvl = queryStr().srsLevelOverride || "1";
                    return pullWholeCollection("assignments?srs_stages=" + lvl);
                case "recentlyFailed":
                    return fetchRecentlyFailed();
                case "oldestApprentices":
                    return fetchTenOldestApprentices();
                case "allThatStuff":
                    return fetchAllThatStuff();
                case "plusGurus":
                    return fetchAllThatStuffPlusGurus();
                case "allOldGuruApprentice":
                    return fetchAncientThings();
                case "randomBurned":
                    return fetchRandomBurned();
            }
        }

        Promise.all([selectedContent(), fetchSubjects(), fetchStudyMaterials()]).then(
            ([assignments, subjects, sm]) => {
                console.log(assignments);
                console.log(subjects);
                console.log(sm);
                subjects.forEach(s => {
                    const extra = sm[s.id];
                    if (extra) {
                        s.accepted_meanings = s.accepted_meanings.concat(extra.accepted_meanings);
                        s.meaning_mnemonic = extra.meaning_mnemonic + s.meaning_mnemonic;
                        s.reading_mnemonic = extra.reading_mnemonic + s.reading_mnemonic;
                    }
                });

                document.querySelector("#loading").style.display = "none";
                isLoading = false;

                if (!assignments || assignments.length < 1) {
                    window.alert("Nothing found to cram!");
                    document.querySelector("#info").style.display = "block";
                    return;
                }

                document.querySelector("#main").style.display = "block";
                console.log("PLAY");
                play2(assignments, subjects);
            }
        );
    });

})();