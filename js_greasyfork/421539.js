(function () {
  // ==UserScript==
  // @name         Code Ninjas Saddle Brook Extension
  // @version      0.2.2
  /* @description
  /* GDP autosave @ 30 second intervals.
  /* GDP automatically stops the game if the code window is clicked.
  /* GDP "remembers" the event you had open, e.g. it will try to remember if you had Mouse Click open and revert to it whenever you switch objects or start/stop the game.
  /* Grading has curriculum links injected.
  /*/
  // @author       Sensei Frank
  // @match        *://*/*
  // @esversion    6
  // @namespace https://greasyfork.org/users/736417
  // @description Extends CNSB functionality
// @downloadURL https://update.greasyfork.org/scripts/421539/Code%20Ninjas%20Saddle%20Brook%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/421539/Code%20Ninjas%20Saddle%20Brook%20Extension.meta.js
  // ==/UserScript==

  /* jshint esversion: 6 */
  // @ts-check

  function parsePerf(func) {
    const performanceFirst = performance.now();

    func();

    console.log(`${func.name} took ${performance.now() - performanceFirst}ms to parse @ ${GM.info.script.name}.`);
  }

  function GDPFunctionality() {
    if (!window.location.href.includes("gdp.code.ninja/Scenes")) return;

    (function autoSave(seconds) {
      setInterval(() => {
        document
          .querySelectorAll(
            "[data-bind='visible: (!scene.isWorking() && viewModel.isSubmitViaJson() && scene.state() == Scene.STATE_STOP)']"
          )[0]
          .querySelectorAll("a")[0]
          .click();
      }, seconds * 1000);
    })(30);

    let objectSelectorNode = document.getElementById("DDLEventDropDown");
    let stopNode = document.querySelectorAll(
      "[data-bind='enable: state() == Scene.STATE_PLAY, click:stopCode']"
    )[0];

    let savedEvent = objectSelectorNode.value;

    function attachObjectSelector() {
      objectSelectorNode = document.getElementById("DDLEventDropDown");

      objectSelectorNode.addEventListener("change", (evt) => {
        savedEvent = evt.target.value;
      });
    }

    function attachStopNodeSelector() {
      stopNode = document.querySelector(
        "[data-bind='enable: state() == Scene.STATE_PLAY, click:stopCode']"
      );

      stopNode.addEventListener("click", () => {
        attachObjectSelector();
        objectSelectorNode.value = savedEvent;
      });
    }

    attachObjectSelector();
    attachStopNodeSelector();

    const OBSERVER = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (!mutation.addedNodes) return;

        mutation.addedNodes.forEach((NODE) => {
          if (!NODE || !NODE.innerHTML) return;

          try {
            if (NODE.classList && NODE.classList.contains("ace_content")) {
              attachStopNodeSelector();

              NODE.addEventListener("click", () => {
                if (stopNode.disabled === false) {
                  stopNode.click();
                }
              });
            }
          } catch (err) {
            console.log(err);
          }
        });
      });
    });

    OBSERVER.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false,
    });
  }

  function GDPGrading() {
    if (!window.location.href.includes("gdp.code.ninja/Grading")) return;

    const CENTER_VAL = Array.from(
      document.getElementById("centers-list").childNodes
    )
      .map((option) => {
        if (option.value && String(option.value).length > 1)
          return option.value;
      })
      .filter(Boolean)[0];

    function getCurriculumLink(hash, page = 2) {
      return `https://dojo.code.ninja/students/curriculum/${CENTER_VAL}/${hash}/index.html#page=${page}`;
    }

    const BELT_HASH = {
      fundamentals: `https://dojo.code.ninja/students/curriculum/${CENTER_VAL}/digitalview/d3f4b313-e538-4f8a-a257-a73a0f68d04d`, // hashed oddly
      white: getCurriculumLink("y0endefblj"),
      yellow: getCurriculumLink("iryxfrckjp"),
      orange: getCurriculumLink("q7ajrnnk2n"),
      green: getCurriculumLink("vcaot8fztm"),
      blue: `https://dojo.code.ninja/students/curriculum/${CENTER_VAL}/view/7gw7ujaxeg`, // hashed oddly
      purple: getCurriculumLink("6lcxc5yf3g"),
      brown: getCurriculumLink("yztcvgvwje"),
      red: getCurriculumLink("lqugowh2cw"),
      black: getCurriculumLink("ndjpppgyk8"),
    };

    // Inject Col Label
    document
      .querySelectorAll("tr")[0]
      .querySelectorAll("[data-col='stars']")[0]
      .insertAdjacentHTML("afterend", "<th class='sortable'> Curriculum </th>");

    // Inject Curriculum Links
    document
      .querySelectorAll("tbody")[0]
      .querySelectorAll("tr")
      .forEach((project) => {
        const NODE_LOC = project.querySelectorAll(".col-stars-earned")[0]
          .parentElement;

        let newNode = document.createElement("td");
        let newNodeA = document.createElement("a");
        newNode.appendChild(newNodeA);

        newNodeA.classList.add("btn", "btn-primary", "btn-sm");

        Object.keys(BELT_HASH).forEach((belt) => {
          if (project.innerHTML.toLowerCase().includes(belt)) {
            newNodeA.innerHTML =
              belt[0].toUpperCase() + belt.slice(1, belt.length);

            newNodeA.addEventListener("click", () => {
              window.open(BELT_HASH[belt]);
            });

            return;
          }
        });

        NODE_LOC.insertAdjacentElement("afterend", newNode);
      });
  }

  parsePerf(GDPFunctionality);
  parsePerf(GDPGrading);
})();
