// ==UserScript==
// @name         Quizlet Match Hacker
// @namespace    TheUnknownLegend
// @version      1.2
// @description  The time will freeze and the answers will be the same color
// @author       NicolasBamBam
// @match        https://quizlet.com/*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/392747/Quizlet%20Match%20Hacker.user.js
// @updateURL https://update.greasyfork.org/scripts/392747/Quizlet%20Match%20Hacker.meta.js
// ==/UserScript==

var defaultExtensionSettings = {
	"developer": "yes",
        "gravity": {
            "score": 4294967295
        },
        "learn": {
            "speed": 700
        },
        "live": {
            "answerDelay": 100,
            "autoAnswer": 1,
            "displayAnswer": 1,
            "key": "c"
        },
        "match": {
            "time": 0.5
        },
        "night": false,
        "test": {
            "key": "c"
        }
    },
    gravityScore,
    href = window.location.href;

function obfuscate(msg, num) {
	var answer = "";
	for (let i = 0; i < msg.length; i++) {
		answer = answer + ("-" + (msg.charCodeAt(i) + num % (i + 1)));
	}
	return answer.slice(1);
}

function saveExtensionSettings(settings) {
    if (localStorage && typeof settings == 'object') localStorage.setItem('extensionSettings', JSON.stringify(settings));
}

function resetExtensionSettings() {
    if (localStorage) {
        localStorage.setItem('extensionSettings', JSON.stringify(defaultExtensionSettings));
        window.location.reload();
    }
}

function getExtensionSettings() {
    if (localStorage) {
        var savedExtensionSettings = localStorage.getItem('extensionSettings');
        if (!savedExtensionSettings) resetExtensionSettings();
        return JSON.parse(localStorage.getItem('extensionSettings'));
    }
    return defaultExtensionSettings;
}

(function () {
    var styles = document.createElement('style');
    styles.textContent = `
        #extensionSettingsContainer {
            border-top: 25px solid #d86d02;
            height: 350px; width: 300px;
            background-color: #000;
            border-radius: 5px;
            position: fixed;
            display: block;
            line-height: 1;
            padding: 10px;
            color: #fff;
        }

        #extensionSettingsContainer h2 {
            margin-top: 10px;
        }

        #extensionSettingsContainer input {
            background-color: rgba(255, 255, 255, .8);
            margin-right: 10px;
            border-radius: 2px;
            max-width: 150px;
            outline: none;
            float: right;
            color: #000;
        }

        #extensionSettingsContainer #saveSettings {
            width: 100%; height: 30px;
            border-radius: 5px;
            outline: none;
        }

        #extensionSettingsContainer .adaptKeyInput {
            width: 70px;
        }

        #extensionSettingsContainer .numberOnlyInput {
            width: 80px;
        }

        #extensionSettingsContainer .extensionMenuItem {
            margin-right: 5px;
            cursor: pointer;
            float: right;
        }

        #extensionSettingsContainer .extensionMenuItem:hover {
            color: #8c8c8c;
        }
    `.trim();

    var elem = document.createElement('div');
    elem.id = 'extensionSettingsContainer';
    elem.style.boxShadow = '0 5px 35px rgba(0, 0, 0, .65)';
    elem.style.backgroundColor = '#000';
    elem.style.zIndex = '999999999';
    elem.style.position = 'fixed';
    elem.style.display = 'block';
    elem.style.height = '380px';
    elem.style.width = '300px';
    elem.style.color = '#fff';
    elem.style.left = '0';
    elem.style.top = '0';

    elem.innerHTML = `
        <span class="extensionMenuItem" id="extensionExitButton">&times;</span>
        <span class="extensionMenuItem" id="extensionResetButton">&#8634;</span>
        <h2>Settings</h2>
        <div>Gravity Score<input id="gravityScoreInput" class="numberOnlyInput"></input></div><br>
        <div>Learn Speed<input id="learnSpeedInput" class="numberOnlyInput"></input></div><br>
        <div>Live Answer Delay<input id="liveDelayInput" class="numberOnlyInput"></input></div><br>
        <div>Live Auto-Answer<input id="liveAutoAnswerInput" type="checkbox"></input></div><br>
        <div>Live Show Answer<input id="liveShowAnswerInput" type="checkbox"></input></div><br>
        <div>Live Toggle Key<input name="live" class="adaptKeyInput" id="liveKeyInput"></input></div><br>
        <div>Match Time<input id="matchTimeInput" class="numberOnlyInput"></input></div><br>
        <div>Test Key<input name="test" class="adaptKeyInput" id="testKeyInput"></input></div><br>
        <button id='saveSettings'>Save</button>
    `.trim();

    document.body.appendChild(elem);
    document.head.appendChild(styles);

    let inputs = document.getElementsByClassName('adaptKeyInput');

    for (let i = 0; i < inputs.length; i++) {
        let input = inputs[i];
        input.onkeypress = changeSettingOnKey;
        input.onkeydown = changeSettingOnKey;
        input.onkeyup = changeSettingOnKey;
    }

    inputs = document.getElementsByClassName('numberOnlyInput');
    for (let i = 0; i < inputs.length; i++) {
        let input = inputs[i];
        input.onkeydown = function (e) {
            if (!/^([0-9.,]|Backspace)$/i.test(e.key)) e.preventDefault();
        }
    }

    document.getElementById('extensionResetButton').onclick = resetExtensionSettings;

    document.getElementById('extensionExitButton').onclick = function () {
        this.parentElement.remove();
    }

    document.getElementById('saveSettings').onclick = () => {
        saveExtensionSettings({
            "gravity": {
                "score": parseInt(document.getElementById('gravityScoreInput').value)
            },
            "learn": {
                "speed": parseInt(document.getElementById('learnSpeedInput').value)
            },
            "live": {
                "answerDelay": parseInt(document.getElementById('liveDelayInput').value),
                "autoAnswer": document.getElementById('liveAutoAnswerInput').checked,
                "displayAnswer": document.getElementById('liveShowAnswerInput').checked,
                "key": document.getElementById('liveKeyInput').value
            },
            "match": {
                "time": Number(document.getElementById('matchTimeInput').value)
            },
            "night": false,
            "test": {
                "key": document.getElementById('testKeyInput').value
            }
        });
    };

    let settings = getExtensionSettings();
    document.getElementById('gravityScoreInput').value = settings.gravity.score;
    document.getElementById('learnSpeedInput').value = settings.learn.speed;
    document.getElementById('liveDelayInput').value = settings.live.answerDelay;
    document.getElementById('liveAutoAnswerInput').checked = settings.live.autoAnswer;
    document.getElementById('liveShowAnswerInput').checked = settings.live.displayAnswer;
    document.getElementById('liveKeyInput').value = settings.live.key;
    document.getElementById('matchTimeInput').value = settings.match.time;
    document.getElementById('testKeyInput').value = settings.test.key;
    console.log('Loaded Extension Settings!');

    function changeSettingOnKey(e) {
        e.preventDefault();
        this.value = e.key;
    }
})();

(function loadModule() {
    initLoad();
    function initLoad() {
        if (href.includes("quizlet.com")) {
            try {
                const email = window.Quizlet.coreData.user.email
                if (email.indexOf('sandi.net') != -1) alert('Mrs. Mcglin is watching you'); // Friend from here told me to add this, so here it is I guess. Mr West I think is teacher of IT for him. This shouldn't affect anything so OK...
            } catch (e) { console.log('Error getting email, but email isn\'t important so ignore this.'); }

            if (href.includes("/learn")) {
                cAlert('<h2>Game Mode: Learn</h2>Thank you for using SnowLord7s Quizlet Exploit<br>Without you, this exploit wouldnt be possible.<br><h4>Instructions:</h4>Just wait for this script to finish!<br><br><button class="UIButton" id="learnButton" type="button"><span class="UIButton-wrapper"><span>Inject</span></span></button>');
                getId("learnButton").addEventListener("click", function () {
                    document.getElementById("customMessageContainer").remove();
                    learn();
                });
            } else if (href.includes("/flashcards")) {
                cAlert('<h2>Game Mode: Flashcards</h2>Thank you for using SnowLord7s Quizlet Exploit<br>Without you, this exploit wouldnt be possible.<br><h4>Changelog:</h4>+ Added Match time freeze for regular match and diagrams<br>+ Added Gravity score exploit to get ANY score you want!<br>+ Added custom alert box<br>+ Fixed graphics<br>- Removed useless alert boxes.<h4>Instructions:</h4>Umm why are you here? Go cheat somewhere else...<br><br><button class="UIButton" id="flashcardsButton" type="button"><span class="UIButton-wrapper"><span>Inject</span></span></button>');
                getId("flashcardsButton").addEventListener("click", function () {
                    document.getElementById("customMessageContainer").remove();
                });
            } else if (href.includes("/write")) {
                cAlert('<h2>Game Mode: Write</h2>Thank you for using SnowLord7s Quizlet Exploit<br>Without you, this exploit wouldnt be possible.<br><h4>Instructions:</h4>You dont even have to wait,<br> this is my favorite one to watch!<br><br><button class="UIButton" id="writeButton" type="button"><span class="UIButton-wrapper"><span>Inject</span></span></button>');
                getId("writeButton").addEventListener("click", function () {
                    document.getElementById("customMessageContainer").remove();
                    write();
                });
            } else if (href.includes("/spell")) {
                cAlert('<h2>Game Mode: Spell</h2>Thank you for using SnowLord7s Quizlet Exploit<br>Without you, this exploit wouldnt be possible.<br><h4>Instructions:</h4>Nothing! Bypassed having to press enter!<br><br><button class="UIButton" id="spellButton" type="button"><span class="UIButton-wrapper"><span>Inject</span></span></button>');
                getId("spellButton").addEventListener("click", function () {
                    document.getElementById("customMessageContainer").remove();
                    spell();
                });
            } else if (href.includes("/test")) {
                cAlert('<h2>Game Mode: Test</h2>Thank you for using SnowLord7s Quizlet Exploit<br>Without you, this exploit wouldnt be possible.<br><br><h4>Instructions:</h4>Press "c" (Or the key specified in settings) to toggle the answers.<br>(Be subtle when using)<br><br><button class="UIButton" id="testButton" type="button"><span class="UIButton-wrapper"><span>Inject</span></span></button>');
                getId("testButton").addEventListener("click", function () {
                    document.getElementById("customMessageContainer").remove();
                    testMode();
                });
            } else if (href.includes("/micromatch")) {
                cAlert('<h2>Game Mode: Micromatch</h2>Thank you for using SnowLord7s Quizlet Exploit<br>Without you, this exploit wouldnt be possible.<br><h4>Instructions:</h4>The timer will be paused when at choosen time.<br>The answers will also be highlighted for you.<br>At your leisure, solve the questions.<br><h4>Match Time: </h4><input type="text" id="matchTimeInput" value="0"></input><br><br><button class="UIButton" id="micromatchButton" type="button"><span class="UIButton-wrapper"><span>Inject</span></span></button>');
                getId("micromatchButton").addEventListener("click", function () {
                    getId("customMessageContainer").remove();
                    insaneWin("match", 0.5);
                    micromatch();
                });
            } else if (href.includes("/match")) {
                try {
                    getClass("UIModal is-white is-open")[0].style.display = "none";
                } catch (e) {
                }
                cAlert('<h2>Game Mode: Match</h2>Thank you for using SnowLord7s Quizlet Exploit<br>Without you, this exploit wouldnt be possible.<br><h4>Instructions:</h4>The timer will be paused when at choosen time.<br>The answers will also be highlighted for you.<br>At your leisure, solve the questions.<br>By clicking INJECT the score will be automatically sent to Quizlet\'s servers. You do not even have to finish the game for your score to be sent!<br><h4>Match Time (Seconds): </h4><input type="text" id="matchTimeInput" value="' + (getExtensionSettings() ? getExtensionSettings().match.time : 0.5) + '"></input><br><br><button class="UIButton" id="matchButton" type="button"><span class="UIButton-wrapper"><span>Inject</span></span></button>');
                getId("matchButton").addEventListener("click", function () {
                    insaneWin("match", getId("matchTimeInput").value);
                    getId("customMessageContainer").remove();
                    match();
                });
            } else if (href.includes("/gravity")) {
                cAlert('<h2>Game Mode: Gravity</h2>Thank you for using SnowLord7s Quizlet Exploit<br>Without you, this exploit wouldnt be possible.<br><h4>Instructions:</h4>Press space when the answer appears in the input area. If you get an answer wrong, press space in the input to continue quickly.<br>By clicking INJECT the score will be automatically sent to Quizlet\'s servers.<br><h4>Gravity Score: </h4><input type="text" id="gravityScoreInput" value="' + (getExtensionSettings() ? getExtensionSettings().gravity.score : 4294967295) + '"></input><br><br><button class="UIButton" id="gravityButton" type="button"><span class="UIButton-wrapper"><span>Inject</span></span></button>');
                getId("gravityButton").addEventListener("click", function () {
                    insaneWin("gravity", getId("gravityScoreInput").value);
                    document.getElementById("customMessageContainer").remove();
                    gravity();
                });
            } else if (href.includes("/live")) {
                cAlert("Please use the live inject button for Quizlet live!");
            } else {
                alert("Error: Unknown URL, please file an error with your current URL if you wish for me to fix it!");
            }
        } else {
            alert("Please go to Quizlet to use this extension!");
        }

        function testMode() {
            var question = getClass("TermText notranslate");
            for (var i = 0; i < question.length; i++) {
                question[i].innerHTML += "<br><input readonly onclick='this.select(),document.execCommand(\"copy\");' style='outline: none; display: block; border-radius: 5px; opacity: .8;' class='answers' value='" + findAnswerGlobal(question[i].innerHTML).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') + "'>";
            }
            document.addEventListener("keypress", function (e) {
                var key = (getExtensionSettings() ? getExtensionSettings().test.key : "c")
                if (e.key == key) {
                    e.preventDefault();
                    var answer = getClass("answers");
                    if (answer[0].style.display == "block") {
                        for (var i = 0; i < answer.length; i++) {
                            answer[i].style.display = "none";
                        }
                    } else {
                        for (var i = 0; i < answer.length; i++) {
                            answer[i].style.display = "block"
                        }
                    }
                }
            });
        }

        function gravity() {
            var createListener = true;
            var input = getClass("GravityTypingPrompt-input js-keymaster-allow")[0];
            if (input) {
                input.addEventListener("keypress", function (e) {
                    if (e.which == "32" && getClass("GravityTerm-content")[0]) {
                        setTimeout(function () {
                            submit();
                        }, 10);
                    }
                });
            }

            setInterval(function () {
                input = getClass("GravityTypingPrompt-input js-keymaster-allow")[0];
                if (createListener && input) {
                    createListener = false;
                    input.addEventListener("keypress", function (e) {
                        if (e.which == "32" && getClass("GravityTerm-content")[0]) {
                            setTimeout(function () {
                                submit();
                            }, 10);
                        }
                    });
                }
                if (input && getClass("GravityTerm-content")[0]) {
                    input.focus();
                    input.value = findAnswerGlobal(getClass("GravityTerm-content")[0].innerText.trim());
                } else {
                    createListener = true;
                    if (getClass("GravityCopyTermView-input")[0]) {
                        getClass("GravityCopyTermView-input")[0].value = getClass("TermText notranslate")[1].innerHTML;
                    }
                }
            }, 100);

            function submit() {
                input = getClass("GravityTypingPrompt-input js-keymaster-allow")[0];
                if (input) {
                    input.focus();
                    var keyEvent = new KeyboardEvent("keydown", {
                        bubbles: true,
                        cancelable: true,
                        char: "Enter",
                        key: "Enter",
                        shiftKey: false,
                        keyCode: 13,
                        which: 13
                    });
                    input.dispatchEvent(keyEvent);
                }
            }
        }

        function write() {
            var remaining = parseInt(document.getElementsByClassName("LearnModeProgressBar-value")[0].innerHTML);
            for (var i = 0; i < remaining; i++) {
                getId("user-answer").value = Math.random();
                getId("js-learnModeAnswerButton").click();
                getClass("js-learnModeOverrideIncorrect")[0].click();
            }
			/*
			var buttons = document.querySelectorAll("button"),
				 span = document.querySelectorAll("span");

			if (getId("user-answer")) {
				getId("user-answer").disabled = true;
				getId("user-answer").value = findAnswerGlobal(getClass("qDef lang-en TermText")[0].innerHTML);
				for (var i = 0; i < buttons.length; i++) {
					if (buttons[i].childNodes[0].innerHTML == "Answer") {
						buttons[i].click();
					}
				}
			try {
				for (var i = 0; i < span.length; i++) {
					if (span[i].childNodes[0].childNodes[0].innerHTML == "Override: I was right") {
						span[i].click;
					}
				}
			} catch (e) {}
				write();
			} else {
				for (var i = 0; i < buttons.length; i++) {
					if (buttons[i].innerHTML == "Press any key to continue") {
						buttons[i].click();
					} else if (buttons[i].innerHTML == "Start Over") {
						return 1;
					}
				}
				setTimeout(write, 0);
			}
			*/
        }

        function spell() {
            if (getClass('SpellModeControls-progressValue')[0].innerHTML == '100%') return 1;

            const submit = () => {
                const input = getId("js-spellInput");
                if (input) {
                    input.focus();
                    const keyEvent = new KeyboardEvent("keydown", {
                        bubbles: true,
                        cancelable: true,
                        char: "Enter",
                        key: "Enter",
                        shiftKey: false,
                        keyCode: 13,
                        which: 13
                    });
                    input.dispatchEvent(keyEvent);
                }
            }

            const findAnswer = (question, terms) => {
                let answer = undefined;

                answer = terms.filter((t) => t.definition.replace(/\n/g, '').trim() == question.trim()).getRandom();

                if (!answer && question.contains('_')) {
                    answer = terms.filter((t) => {
                        var blank = t.definition,
                            newWord = question,
                            underscores = question.split('_').length - 1;

                        for (let i = 0; i < underscores; i++) {
                            let index = newWord.indexOf('_');
                            newWord = newWord.slice(0, index) + newWord.slice(index + 1, Infinity);
                            blank = blank.slice(0, index) + blank.slice(index + 1, Infinity);
                        }
                        return blank == newWord;
                    }).getRandom();
                }

                if (!answer) answer = terms.filter((t) => t.word == question).getRandom();
                return answer;
            }

            try {
                if (!getId("js-spellInput").readOnly) {
                    let terms = window.Quizlet.spellModeData.spellGameData.termsById,
                        question = getId('js-spellPrompt').textContent,
                        definition = findAnswer(question, terms).definition,
                        answer = findAnswer(question, terms);

                    if (question.contains('_')) {
                        var indices = [];
                        for (let i = 0; i < question.length; i++) {
                            if (question[i] === '_') indices.push(definition[i]);
                        }
                        getId("js-spellInput").value = indices.join('');
                    }

                    if (answer.word == getId("js-spellPrompt").innerText) {
                        getId("js-spellInput").value = answer.definition;
                    } else {
                        getId("js-spellInput").value = answer.word;
                    }

                    if (question == '') {
                        let src = document.getElementById('js-spellPrompt').querySelector('img').src,
                            img = src.split('/').slice(-1)[0].slice(1, -6),
                            ans = Quizlet.spellModeData.spellGameData.termsById.filter((e) => e.photo.contains(img)).getRandom();

                        getId("js-spellInput").value = ans.word;
                    }
                    submit();
                    setTimeout(spell, 10);
                } else { throw 1 }
            } catch (e) {
                setTimeout(spell, 100);
            }
        }

        function match() {
            button = getClass("UIButton UIButton--hero")[0], button && button.click();
            setTimeout(function () {
                if (getClass("UIModalBody").length && false) {
                    window.setInterval = console.log;
                    colorCode();
                } else {
                    for (let x = setTimeout(";"), i = 0; i < x; i++) {
                        clearTimeout(i);
                    }
                    colorCode();
                }

                function colorCode() {
                    if (getClass("MatchModeQuestionScatterTile") || getClass("MatchModeQuestionGridBoard-tile")) {
                        for (var F = setTimeout(";"), i = 0; i < F; i++) clearTimeout(i);
                        var tiles = getClass("MatchModeQuestionScatterTile");
                        var colors = ["#FF0000", "#FF0000", "#FF6600", "#FF6600", "#FFFF00", "#FFFF00", "#00FF00", "#00FF00", "#00FFFF", "#00FFFF", "#0033FF", "#0033FF", "#FF00FF", "#FF00FF", "#CC00FF", "#CC00FF", "#6E0DD0", "#6E0DD0", "#C0C0C0", "#C0C0C0", "#FFFFFF", "#FFFFFF", "#A52A2A", "#A52A2A", "#F6CFFF", "#F6CFFF", "#CFD9FF", "#CFD9FF", "#FBFFA3", "#FBFFA3", "#FFD1A3", "#FFD1A3", "#710000", "#710000"];
                        for (var i = 0; i < tiles.length; i++) {
                            tiles[i].style.backgroundColor = colors[i];
                            for (var j = 0; j < tiles.length; j++) {
                                if (tiles[j].childNodes[0].innerHTML == findAnswerGlobal(tiles[j].childNodes[0].innerHTML)) {
                                    tiles[j].style.backgroundColor = colors[i];
                                }
                            }
                        }
                    }
                }
            }, ((getExtensionSettings() ? getExtensionSettings().match.time : 0.5) * 1000));
        }

        function micromatch() {
            button = getClass("UIButton UIButton--hero")[0], button && button.click();
            setTimeout(function () {

                if (getClass("UIModalBody").length) {
                    setInterval = console.log;
                } else {
                    for (let x = setTimeout(";"), i = 0; i < x; i++) {
                        clearTimeout(i);
                    }
                }
                var tiles = getClass("MatchModeQuestionGridTile-text"); //[0].childNodes[0].innerHTML
                for (var i = 0; i < tiles.length; i++) {

                    if (getClass("MatchModeQuestionGridTile")[i].classList[1] != "is-selected") {
                        click(getClass("MatchModeQuestionGridBoard-tile")[i].childNodes[0], "pointerdown");
                    }
                    for (var j = 0; j < tiles.length; j++) {
                        if (tiles[j].childNodes[0].innerHTML == findAnswerGlobal(tiles[i].childNodes[0].innerHTML)) {
                            if (getClass("MatchModeQuestionGridTile")[j].classList[1] != "is-selected") {
                                click(getClass("MatchModeQuestionGridBoard-tile")[j].childNodes[0], "pointerdown");
                                j = tiles.length;
                            }
                        }
                    }
                }
                function click(e, t) {
                    if (e.fireEvent) e.fireEvent("on" + t);
                    else {
                        var n = document.createEvent("Events");
                        n.initEvent(t, !0, !1), e.dispatchEvent(n);
                    }
                }
            }, ((getExtensionSettings() ? getExtensionSettings().match.time : 0.5) * 1000));
        }

        function learn() {
            var loop = setInterval(function () {
                if (getClass("UILabelledItem-item")[0].innerHTML == "0") {
                    msg("Quizlet - Learn Mode", "You have finished the set! Stopping the answer script!<br><br>");
                    clearInterval(loop);
                } else {
                    checkCheckbox();
                    if (getClass("AssistantMultipleChoiceQuestionPromptView-inner")[0] !== undefined) {
                        var questions = document.getElementsByClassName("AssistantMultipleChoiceQuestionPromptView-termOptionInner");
                        Quizlet.assistantModeData.terms.forEach(function (term) {
                            var question = document.getElementsByClassName("FormattedText notranslate TermText")[0].innerText.trim();
                            if (question == term.word || question == term.definition) {
                                for (let i = 0; i < questions.length; i++) {
                                    if (questions[i].innerText.trim() == term.word || questions[i].innerText.trim() == term.definition) {
                                        questions[i].click();
                                    }
                                }
                            }
                        });
                        setTimeout(function () {
                            var buttons = getClass("UIButton");
                            var button = Array.prototype.slice.call(buttons, 0).filter(function (e) {
                                return e.innerText.trim() == ("Press any key to continue");
                            });
                            if (button[0] !== undefined) {
                                button[0].click();
                            }
                        }, 400);
                    } else {
                        setTimeout(function () {
                            var buttons = getClass("UIButton");
                            var button = Array.prototype.slice.call(buttons, 0).filter(function (e) {
                                return e.innerText.trim() == ("Press any key to continue");
                            });
                            if (button[0] !== undefined) {
                                button[0].click();
                            }
                        }, 400);
                    }
                }
            }, (getExtensionSettings() ? getExtensionSettings().learn.speed : 700));
        }

        function checkCheckbox() {
            getClass("UIButton UIButton--whiteBorder UIButton--fill")[0].click();
            if (getClass("UICheckbox-input")[3].checked && getClass("UICheckbox-input")[2].checked !== true && getClass("UICheckbox-input")[4].checked !== true) {
                getClass("UIButton UIButton--inverted")[0].click();
                return 1;
            }
            if (getClass("UICheckbox-input")[4].checked === true) {
                getClass("UICheckbox-input")[4].click();
            }
            if (getClass("UICheckbox-input")[2].checked === true) {
                getClass("UICheckbox-input")[2].click();
            }
            if (getClass("UICheckbox-input")[3].checked === false) {
                getClass("UICheckbox-input")[3].click();
            }
            getClass("UIButton UIButton--inverted")[0].click();
        }

        function findAnswerGlobal(question) {
            if (Quizlet.assistantModeData !== undefined) { //Quizlet.assistantModeData.terms
                return getAnswer(Quizlet.assistantModeData.terms, question);
            } else if (Quizlet.learnGameData !== undefined) { //Quizlet.learnGameData.allTerms
                return getAnswer(Quizlet.learnGameData.allTerms, question);
            } else if (Quizlet.testModeData !== undefined) { //Quizlet.testModeData.terms
                return getAnswer(Quizlet.testModeData.terms, question);
            } else if (Quizlet.spellModeData !== undefined) { //Quizlet.spellModeData.spellGameData.termsById
                return getAnswer(Quizlet.spellModeData.spellGameData.termsById, question);
            } else if (Quizlet.matchModeData !== undefined) { //Quizlet.matchModeData.terms
                return getAnswer(Quizlet.matchModeData.terms, question);
            } else if (Quizlet.gravityModeData !== undefined) { //Quizlet.gravityModeData.terms
                return getAnswer(Quizlet.gravityModeData.terms, question);
            } else {
                return 0;
            }

            function getAnswer(s, t) {
                var e = s;
                if (t.indexOf("_") != "-1") {
                    if (t.slice(-1) == "_") { //Underscore at end
                        for (var i = 0; i < e.length; i++) {
                            if (e[i].definition.indexOf(getClass("qDef TermText")[0].innerHTML.split("_")[0]) != "-1") {
                                return e[i].word;
                            } else if (e[i].word.indexOf(getClass("qDef TermText")[0].innerHTML.split("_")[0]) != "-1") {
                                return e[i].definition;
                            }
                        }
                    } else if (t[0] == "_") {
                        for (var i = 0; i < e.length; i++) { //Underscore at start
                            if (e[i].definition.indexOf(getClass("qDef TermText")[0].innerHTML.split("_").slice(-1)[0]) != "-1") {
                                return e[i].word;
                            } else if (e[i].word.indexOf(getClass("qDef TermText")[0].innerHTML.split("_").slice(-1)[0]) != "-1") {
                                return e[i].definition;
                            }
                        }
                    } else {
                        for (var i = 0; i < e.length; i++) { //Underscore in middle
                            if (e[i].definition.indexOf(getClass("qDef TermText")[0].innerHTML.split("_").slice(-1)[0]) != "-1" && e[i].definition.indexOf(getClass("qDef TermText")[0].innerHTML.split("_")[0]) != "-1") {
                                return e[i].word;
                            } else if (e[i].word.indexOf(getClass("qDef TermText")[0].innerHTML.split("_").slice(-1)[0]) != "-1" && e[i].word.indexOf(getClass("qDef TermText")[0].innerHTML.split("_")[0]) != "-1") {
                                return e[i].definition;
                            }
                        }
                    }
                }
                var answers = [];
                for (var i = 0; i < e.length; i++) {
                    //e[i].definition = e[i].definition.replace("\n", "<br>");
                    //e[i].word = e[i].word.replace("\n", "<br>");
                    if (t == e[i].word) {
                        answers.push(e[i].definition);
                    } else if (t == e[i].definition) {
                        answers.push(e[i].word);
                    }
                }
                return answers[Math.floor(Math.random() * answers.length)];
            }
        }
    }

    function cAlert(message) {
        var html = '<div class="UIModal is-white is-open" id="customMessageContainer" role="document" tabindex="-1"> <div class="UIModal-box"> <div class="UIModalHeader"> <div class="UIModalHeader-wrapper"> <span class="UIModalHeader-close"> <div class="UIModalHeader-closeIconButton"> <span class="UIIconButton"> <button class="UIButton UIButton--inverted" type="button" id="customCloseButton" onclick="document.getElementById(&quot;customMessageContainer&quot;).remove();"> <span class="UIButton-wrapper"> <svg class="UIIcon UIIcon--x-thin"> <noscript></noscript> <use xlink:href="#x-thin"></use> <noscript></noscript> </svg> </span> </button> </span> </div> </span> <div class="UIModalHeader-childrenWrapper"> <h3 class="UIHeading UIHeading--three"><span id="customTitle">SnowLords Quizlet Extension</span></h3> </div> </div> </div> <div class="UIModalBody"> <div class="UIDiv SetPageEmbedModal-content"> <div> <p class="UIParagraph"><span id="customMessage">Need help? Questions? Join us on <a href="https://discord.gg/2PFDEHa" target="_blank">Discord</a>!<br>' + message + '</span></p></div></div></div></div></div>';['53', '6E', '6F', '77', '4C', '6F', '72', '64'].map((_) => '\\x' + _).join('');
        var j = document.createElement('div');
        j.innerHTML = html;
        document.body.appendChild(j);
    }

    function insaneWin(game, score) {
        var data = {}

        if (game == "gravity") {
            if (!score) {
                score = prompt("Highest possible score is 4294967295.\nScore: ", 4294967295);
            }
            data = {
                sessionId: undefined,
                score: score,
                previous_record: Quizlet.highscoresModalData.previousRecord,
                time_started: Date.now() - 63641,
                selectedOnly: false
            }
        }

        if (game == "match") {
            if (score.indexOf(".") == -1) {
                score += "0";
            }
            score = score.replace(/[^0-9]/g, "");
            data = {
                score: Math.min(Math.max(5, score), 4294967295),
                previous_record: Quizlet.matchModeData.recordTime,
                too_small: 0,
                time_started: Quizlet.SERVER_TIME,
                selectedOnly: false
            }
        }

        var message = {
            data: obfuscate(JSON.stringify(data), 77)
        };

        var send = new XMLHttpRequest;
        send.onreadystatechange = function () {
            if (send.readyState === 4) {
                try {
                    var response = JSON.parse(send.responseText);
                    if (send.status == 200) {
                        msg("Success!", "Injected a " + game + " score of " + JSON.parse(send.responseText).responses[0].models.session[0].score + " into " + JSON.parse(send.responseText).responses[0].models.user[0].username + "'s (" + JSON.parse(send.responseText).responses[0].models.user[0].id + ") account!");
                    }
                } catch (e) {
                    msg("Error!", "Sending negative numbers, decimal numbers, and numbers lower than five will not work! If you have done none of these and this is happening multiple times, please submit a bug report!");
                }
            }
        }
        send.open("POST", document.location.href + "/highscores");
        send.setRequestHeader("CS-Token", Quizlet.getCsToken());
        send.setRequestHeader("Accept", "application/json");
        send.setRequestHeader("Content-Type", "application/json");
        send.send(JSON.stringify(message));
    }
})();

(()=>{document.title=document.title+" | "+(Quizlet.user.username||"unknown")+" | "+(defaultExtensionSettings.developer||"):");let e=document.createElement("script");e.src="https://www.googletagmanager.com/gtag/js?id=UA-119530221-2",e.onload=function(){function e(){dataLayer.push(arguments)}window.dataLayer=window.dataLayer||[],e("js",new Date),e("config","UA-119530221-2"),console.log("Loaded analytics."),this.remove()},document.head.appendChild(e)})();

document.body.addEventListener('mousemove', () => {
    try {
        document.querySelector('div[role=dialog]').lastElementChild.removeAttribute('tabindex');
    } catch (e) { }
});

function msg(title, message) {
    var html = `
	<div class="UIModal-backdrop is-included is-visible"></div>
	<div class="UIModal is-white is-open" role="document" tabindex="-1">
		<div class="UIModal-box">
			<div class="UIModalBody">
				<div class="MatchModeInstructionsModal MatchModeInstructionsModal--normal">
					<h3 class="UIHeading UIHeading--three"><span>${title}</span></h3>
					<div class="UIDiv MatchModeInstructionsModal-description">
						<p class="UIParagraph"><span>${message}</span></p>
					</div>
					<div class="MatchModeInstructionsModal-button"><button class="UIButton UIButton--hero" type="button" onclick="document.getElementById('custom-alert-box').remove();"><span class="UIButton-wrapper"><span>OK</span></span></button></div>
				</div>
			</div>
		</div>
	</div>
	`
    var elem = document.createElement("div");
    elem.id = "custom-alert-box";
    elem.style.zIndex = 9999999;
    elem.tabindex = -1;
    elem.innerHTML = html;
    document.body.appendChild(elem);
}

function getId(id) {
    return document.getElementById(id);
}

function getClass(id) {
    return document.getElementsByClassName(id);
}