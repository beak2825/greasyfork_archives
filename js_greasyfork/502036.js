// ==UserScript==
// @name        Sparkles
// @namespace   Jira Improvements
// @match       https://maxart-aus.atlassian.net/jira/software/c/projects/SER/boards/*
// @license MIT
// @version     1.2
// @author      - Probably Dylan?
// @description 24/07/2024, 15:29:28
// @downloadURL https://update.greasyfork.org/scripts/502036/Sparkles.user.js
// @updateURL https://update.greasyfork.org/scripts/502036/Sparkles.meta.js
// ==/UserScript==

var confettiScript = document.createElement("script");

confettiScript.setAttribute(
  "src",
  "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js",
);

document.head.appendChild(confettiScript);

window.addEventListener("load", function (event) {
  setTimeout(start, 2500);
});

var actualDropZones = [];
var container;
function start() {
  container = document.getElementsByClassName(
    "_m6k41e03 _1e0c1ule _kqswh2mm _1bsb1osq",
  )[0];
  const config = {
    attributes: false,
    childList: true,
    subtree: false,
  };

  checkForDropZones(); // Run once so we don't need to wait for a change

  const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        console.log("A child node has been added or removed.");
        checkForDropZones();
      }
    }
  };
  const observer = new MutationObserver(callback);

  observer.observe(container, config);
}

function checkForDropZones() {
  clearActualDropZones();

  var potentialDropZones = container.getElementsByClassName(
    "_kqswh2mm _1e0c1txw _2lx21bp4 _1wpz1wug _v564stkc _1ul91qnl _p12f1osq _16jlkb7n _1o9zkb7n _i0dlf1ug",
  );

  console.log(potentialDropZones);

  for (let i = 0; i < potentialDropZones.length; i++) {
    let element = potentialDropZones[i];
    actualDropZones.push(element);
    element.addEventListener("drop", checkIfDone);
  }
}

function checkIfDone(event) {
  // console.log(event);
  // Done class buhim-0 kJLFQd // _uizt1wug _syaz1o15 _4bfu18uv _1hms1911 _ajmmnqa1 _1nrm18uv _1a3b18uv _9oik18uv _5bd618uv _1ydc18uv _c2wa1911 _4fpr1911 _1bnx1911 _13jx1911 _1x281911 _1iohnqa1 _5goinqa1 _jf4cnqa1 _xatrnqa1 _1726nqa1
  var element = event.target.closest(".yse7za_content");
  console.log(event.target);
  console.log(element);

  var doneElement = element.getElementsByClassName(
    "_uizt1wug _syaz1o15 _4bfu18uv _1hms1911 _ajmmnqa1 _1nrm18uv _1a3b18uv _9oik18uv _5bd618uv _1ydc18uv _c2wa1911 _4fpr1911 _1bnx1911 _13jx1911 _1x281911 _1iohnqa1 _5goinqa1 _jf4cnqa1 _xatrnqa1 _1726nqa1",
  );
  console.log(doneElement);
  if (doneElement.length > 0) {
    console.log("Full send");
    launchZeeMissiles();
  } else {
    console.log("No Send");
  }
}

function clearActualDropZones() {
  if (this.actualDropZones == null) {
    return;
  }

  for (let i = 0; i < this.actualDropZones.length; i++) {
    this.actualDropZones[i].removeEventListener("drop", checkIfDone);
  }

  this.actualDropZones = [];
}

function launchZeeMissiles() {
  console.log("launch");
  fireworks();
  sideCannons();
}

function sideCannons() {
  var end = Date.now() + 0.4 * 1000;

  // go Buckeyes!
  var colors = ["#0071BC", "#FF9500"];

  (function frame() {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: {
        x: 0,
      },
      colors: colors,
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: {
        x: 1,
      },
      colors: colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

var count = 200;
var defaults = {
  origin: {
    y: 0.7,
  },
};

function fire(particleRatio, opts) {
  confetti({
    ...defaults,
    ...opts,
    particleCount: Math.floor(count * particleRatio),
  });
}

function fireworks() {
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}
