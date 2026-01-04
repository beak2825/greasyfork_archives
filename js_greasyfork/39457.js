// ==UserScript==
// @name         Mikerific's Quizlet Extension
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Exploits Learn, Flashcards, Write, Spell, Test, and Match.
// @author       Mikerific
// @match        https://quizlet.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39457/Mikerific%27s%20Quizlet%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/39457/Mikerific%27s%20Quizlet%20Extension.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var href = window.location.href;
    if (href.includes("/learn")) {
        cAlert('<h2>Game Mode: Learn</h2>Thank you for using Mikerific\'s Quizlet Extension<br><br><h4>Instructions:</h4>Press ~ to answer the current question!<br>');
        learn();
    } else if (href.includes("/flashcards")) {
        cAlert('<h2>Game Mode: Flashcards</h2>Thank you for using Mikerific\'s Quizlet Extension<br><br><h4>Instructions:</h4>Flashcards? Really? What did you expect to be here?<br>');
    } else if (href.includes("/write")) {
        cAlert('<h2>Game Mode: Write</h2>Thank you for using Mikerific\'s Quizlet Extension<br><br><h4>Instructions:</h4>Press Go! Boom! You\'re Done! (Might Freeze The Page For A Few Seconds)<br><br><button class="UIButton" id="writeButton" type="button"><span class="UIButton-wrapper"><span>Go!</span></span></button>');
        getId("writeButton").addEventListener("click", function() {
            document.getElementById("customMessageContainer").remove();
            write();
		});
    } else if (href.includes("/spell")) {
        cAlert('<h2>Game Mode: Spell</h2>Thank you for using Mikerific\'s Quizlet Extension<br><br><h4>Instructions:</h4>Hold down enter with your cursor in the textbox. This one takes forever...<br>');
        setInterval(function(){
            spell();
        }, 10);
    } else if (href.includes("/test")) {
        cAlert('<h2>Game Mode: Test</h2>Thank you for using Mikerific\'s Quizlet Extension<br><br><h4>Instructions:</h4>Right click to toggle the answers.<br>');
        setTimeout(function(){
            testMode();
        }, 1000);
    } else if (href.includes("/match")) {
        setTimeout(function(){
            cAlert('<h2>Game Mode: Match</h2>Thank you for using Mikerific\'s Quizlet Extension<br><br><h4>Instructions:</h4>Enter a Time and Press Go! The Correct Answers Will Be Highlighted! (0.5 is the Lowest Possible for the Leaderboards)<br><br><input type="number" id="matchInput" step="0.1" value="0.5"><br><button class="UIButton" id="matchButton" type="button"><span class="UIButton-wrapper"><span>Go!</span></span></button>');
            getId("matchButton").addEventListener("click", function() {
                match(getId("matchInput").value);
                document.getElementById("customMessageContainer").remove();
            });
        }, 1000);
    } else if (href.includes("/gravity")) {
        cAlert('<h2>Game Mode: Gravity</h2>Thank you for using Mikerific\'s Quizlet Extension<br><br><h4>Instructions:</h4>Adding Gravity Soon!<br>');
    }
    function learn() {
        var learnInsertJs = "function figure(match) {termsWord = window.Quizlet.assistantModeData.terms.filter(function z(x) {return x.word == match}); termsDefinition = window.Quizlet.assistantModeData.terms.filter(function z(x) {return x.definition === match}); if (termsWord.length > 0) {return termsWord[0].definition;}; if (termsDefinition.length > 0) {return termsDefinition[0].word;}}; function solve() {input = document.querySelector('#AssistantModeTarget > div > div > div > div.ModeLayout-content > div > span:nth-child(2) > div > div > div.AssistantScrollableViewLayout-content > div > div.AssistantMultipleChoiceQuestionPromptView-promptArea > div > div > div > span').innerHTML; output = figure(input); outs = document.querySelectorAll('.AssistantMultipleChoiceQuestionPromptView-termOptionInner > div > span'); for (var i = 0; i < outs.length; i++) {if (outs[i].innerText === output) {outs[i].click();}}; if (document.querySelector('#AssistantModeTarget > div > div > div > div.ModeLayout-controls > div > div > div > div.ModeControls-main > div.ModeControls-progress > div > div > div > svg > text.ProgressSegmentedSemicircle-text.ProgressSegmentedSemicircle-progressText > tspan').innerHTML.slice(0, -1) !== '100') {setTimeout(solve, 10);};}; solve();";
        window.addEventListener("keypress", keyPressed, false);
        function keyPressed(e) {
            if(e.keyCode == 96) {
                var script = document.createElement('script');
                script.textContent = learnInsertJs;
                (document.head||document.documentElement).appendChild(script);
                script.remove();
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
    }
    function spell() {
		if (getId("js-spellInput") !== null) {
			getId("js-spellInput").value = getAnswer(Quizlet.spellModeData.spellGameData.termsById, getClass("qDef lang-en TermText")[0].innerHTML);
            const event = new KeyboardEvent("keypress", {
                view: window, keyCode: 13, bubbles: true, cancelable: true
            });
            getId("js-spellInput").dispatchEvent(event)
			setTimeout(spell, 10);
		}
    }
    function match(time) {
        document.getElementsByClassName("UIButton UIButton--hero")[0].children[0].click();
        setTimeout(function(){waitMatch();}, parseFloat(time) * 1000);

        function waitMatch() {
            for (var F = setTimeout(";"), i = 0; i < F; i++) clearTimeout(i);
            var tiles = getClass("MatchModeQuestionScatterTile");
            var colors = ["#FF0000", "#FF0000", "#FF6600", "#FF6600", "#FFFF00", "#FFFF00", "#00FF00", "#00FF00", "#00FFFF", "#00FFFF", "#0033FF", "#0033FF", "#FF00FF", "#FF00FF", "#CC00FF", "#CC00FF", "#6E0DD0", "#6E0DD0", "#C0C0C0", "#C0C0C0", "#FFFFFF", "#FFFFFF", "#A52A2A", "#A52A2A", "#F6CFFF", "#F6CFFF", "#CFD9FF", "#CFD9FF", "#FBFFA3", "#FBFFA3", "#FFD1A3", "#FFD1A3", "#710000", "#710000"];
            for (var i = 0; i < tiles.length; i++) {
                tiles[i].style.backgroundColor = colors[i];
                for (var j = 0; j < tiles.length; j++) {
                    if (tiles[j].childNodes[0].innerHTML == getAnswer(Quizlet.matchModeData.terms, tiles[j].childNodes[0].innerHTML)) {
                        tiles[j].style.backgroundColor = colors[i];
                    }
                }
            }
        }
    }
    function testMode() {
		var question = getClass("TermText notranslate lang-en");
		for (var i = 0; i < question.length; i++) {
			question[i].innerHTML += '<br><small style="font-weight: bold; display: block;" class="answers">' + getAnswer(Quizlet.testModeData.terms, question[i].innerHTML) + "</small>";
		}
		window.oncontextmenu = function(e) {
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
	}

    function getAnswer(s, t) {
		var e = s;
		if (t.indexOf("_") != "-1") {
            if (t.slice(-1) == "_") { //Underscore at end
                for (var i=0; i<e.length; i++) {
                    if (e[i].definition.indexOf(getClass("qDef lang-en TermText")[0].innerHTML.split("_")[0]) != "-1") {
						return e[i].word;
					} else if (e[i].word.indexOf(getClass("qDef lang-en TermText")[0].innerHTML.split("_")[0]) != "-1") {
						return e[i].definition;
                    }
				}
			} else if (t[0] == "_") {
                for (var i=0; i<e.length; i++) { //Underscore at start
					if (e[i].definition.indexOf(getClass("qDef lang-en TermText")[0].innerHTML.split("_").slice(-1)[0]) != "-1") {
						return e[i].word;
					} else if (e[i].word.indexOf(getClass("qDef lang-en TermText")[0].innerHTML.split("_").slice(-1)[0]) != "-1") {
						return e[i].definition;
					}
				}
			} else {
				for (var i=0; i<e.length; i++) { //Underscore in middle
					if (e[i].definition.indexOf(getClass("qDef lang-en TermText")[0].innerHTML.split("_").slice(-1)[0]) != "-1" && e[i].definition.indexOf(getClass("qDef lang-en TermText")[0].innerHTML.split("_")[0]) != "-1") {
						return e[i].word;
					} else if (e[i].word.indexOf(getClass("qDef lang-en TermText")[0].innerHTML.split("_").slice(-1)[0]) != "-1" && e[i].word.indexOf(getClass("qDef lang-en TermText")[0].innerHTML.split("_")[0]) != "-1") {
						return e[i].definition;
					}
				}
			}
		}
		var answers = [];
		for (var i=0; i<e.length; i++) {
			e[i].definition = e[i].definition.replace("\n", "<br>");
			e[i].word = e[i].word.replace("\n", "<br>");
			if (t == e[i].word) {
				answers.push(e[i].definition);
			} else if (t == e[i].definition) {
				answers.push(e[i].word);
			}
		}
		return answers[Math.floor(Math.random() * answers.length)];
	}
    function cAlert(message) {
		var html = '<div class="UIModal is-white is-open" id="customMessageContainer" role="document" tabindex="-1"> <div class="UIModal-box"> <div class="UIModalHeader"> <div class="UIModalHeader-wrapper"> <span class="UIModalHeader-close"> <div class="UIModalHeader-closeIconButton"> <span class="UIIconButton"> <button class="UIButton UIButton--inverted" type="button" id="customCloseButton" onclick="document.getElementById(&quot;customMessageContainer&quot;).remove();"> <span class="UIButton-wrapper"> <svg class="UIIcon UIIcon--x-thin"> <noscript></noscript> <use xlink:href="#x-thin"></use> <noscript></noscript> </svg> </span> </button> </span> </div> </span> <div class="UIModalHeader-childrenWrapper"> <h3 class="UIHeading UIHeading--three"><span id="customTitle">Mikerific\'s Quizlet Extension</span></h3> </div> </div> </div> <div class="UIModalBody"> <div class="UIDiv SetPageEmbedModal-content"> <div> <p class="UIParagraph"><span id="customMessage">'+message+'</span></p></div></div></div></div></div>';
		var j = document.createElement('div');
		j.innerHTML = html;
		document.body.appendChild(j);
	}
    function getId(id) {
        return document.getElementById(id);
    }

    function getClass(id) {
        return document.getElementsByClassName(id);
    }
})();