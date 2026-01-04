// ==UserScript==
// @name     Study Lichess
// @description Plays random chapters from a study
// @license public domain
// @version  1
// @namespace jlxip
// @grant    none
// @include  https://lichess.org/study/*
// @include  https://lichess.org/study/*/*
// @downloadURL https://update.greasyfork.org/scripts/529347/Study%20Lichess.user.js
// @updateURL https://update.greasyfork.org/scripts/529347/Study%20Lichess.meta.js
// ==/UserScript==

// Source: https://stackoverflow.com/a/12646864/23750873
function shuffleArray(array) {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Source: https://stackoverflow.com/a/61511955/23750873
function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

// ---

let chapters = null;
const exercises = [];

// Waits for something to have the class "active"
function waitActive(x, f, cb) {
  	setTimeout(() => {
      	let e = x;
      	if (typeof(x) === "function")
          	e = x();

      	if (e.classList.contains("active")) {
          	cb();
        } else {
          	if (f != null)
          			f(e);
          	waitActive(x, f, cb);
        }
    }, 10);
}

function play() {
  	if (exercises.length == 0) {
      	alert("🎉");
      	return;
    }
  
		const e = exercises.pop();
  	chapters[e].click();
  
  	// Wait for chapter to become active
  	waitActive(chapters[e], null, () => {
      	// Click preview button (repeatedly until it works)
      	waitActive(() => document.getElementsByClassName("preview")[0], x => x.click(), () => {
          	// That's it, wait for solve
            waitForElm(".retry").then(play);
        });
    });
}

waitForElm(".study__side").then((x) => {
    const but = document.createElement("span");
		but.classList.add("more");
		but.classList.add("narrow");
		but.setAttribute("data-icon", "🧐");

		but.onclick = () => {
        // Get exercises
        chapters = document.getElementsByClassName("study__chapters")[0].children;
        for (let i=0; i<chapters.length - 1; ++i)
          	exercises.push(i);

      	// Shuffle
        shuffleArray(exercises);

      	// Play the first
      	play();
		};

		x.children[0].append(but);
});
