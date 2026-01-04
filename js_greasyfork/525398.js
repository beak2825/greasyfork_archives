// ==UserScript==
// @name         Hide responses udemy
// @namespace    ludoo
// @version      0.2
// @description  Hide answers for quizz training
// @author       LudoO
// @match        https://*.udemy.com/course/*/learn/quiz/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525398/Hide%20responses%20udemy.user.js
// @updateURL https://update.greasyfork.org/scripts/525398/Hide%20responses%20udemy.meta.js
// ==/UserScript==

const styleSheet = `
.gm-simple {
 div > span[data-purpose="answer-result-header-user-label"]{display:none}
 div.answer-result-pane--answer-correct--PLOEU, div.answer-result-pane--answer-incorrect--vFyOv{
    background: #fff !important;
    border: 1px solid #d1d2e0 !important;
    color: #595c73 !important;
 }
 span[data-purpose="answer-result-body-selection-icon"]{display:none}
}

`;

(function () {
	const labelHideAnswers = "Hide answers";
	const labelShowAnswers = "Show answers";

    function first(css, apply){
       var el = document.querySelectorAll(css)[0];
      if (el){
          apply(el)
      }
    }
    function forAll(css, apply){
       document.querySelectorAll(css).forEach(apply)
    }

	function toggleAnswers() {
		var button = document.getElementById("answers-button");
		if (button.innerHTML === labelShowAnswers) {
			button.innerHTML = labelHideAnswers;
			document.body.classList.remove('gm-simple')
		} else {
			button.innerHTML = labelShowAnswers;
            document.body.classList.add('gm-simple')
		}
	}

	function addButton() {
		var button = document.createElement("button");
		button.setAttribute("id", "answers-button");
		button.innerHTML = labelHideAnswers;
		button.onclick = toggleAnswers;
		button.style.backgroundColor = "#29303b";
		button.style.color = "#f5c647";
		button.style.borderWidth = "1px";
		button.style.borderStyle = "solid";
		button.style.borderColor = "#f5c647";
		button.style.padding = "6px 10px";
		button.style.alignSelf = "center";

		first('[class^="header--vertical-divider"]', function(el){
		   el.appendChild(button);
		   el.style.height = "auto";
        });
    }

    const s = document.createElement('style');
    s.type = "text/css";
    s.innerHTML = styleSheet;
    (document.head || document.documentElement).appendChild(s);

	setTimeout(function () {
		addButton();
	}, 4000);
})();
