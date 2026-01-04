// ==UserScript==
// @name         mbeling(ua)
// @version      0.2
// @author       KulkasTerbakar
// @match        https://newbinusmaya.binus.ac.id/beelingua/*
// @icon         https://binusmaya.binus.ac.id/favicon.ico
// @grant        none
// @description  not stable, only works in objective questions(not multi choice)
// @license MIT
// @namespace https://greasyfork.org/users/1143242
// @downloadURL https://update.greasyfork.org/scripts/489536/mbeling%28ua%29.user.js
// @updateURL https://update.greasyfork.org/scripts/489536/mbeling%28ua%29.meta.js
// ==/UserScript==

(function () {
  "use strict";
  let exec = null;
  let isStop = false;
  let btnCheck;

  /*
  Declare the start button to exceute the script
  */
  let btnStart = document.createElement("button");
  btnStart.innerHTML = `
    <div style="padding: 10px; display: flex; align-items: center; justify-content: center; background: blue; color: white; border-radius: 4px;">
      Start
    </div>`;
  btnStart.style = "position: fixed; bottom: 0; right: 0; z-index: 9999;";
  document.body.appendChild(btnStart);

  function setDelay(milliseconds) {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }

  function checkIsCorrect() {
    if (
      document.getElementsByClassName(
        "bl-col bl-flex-1 bl-m-l-left bl-m-xl-right"
      )[0].children[0].children[0].innerText == "Correct!"
    ) {
      return true;
    } else {
      return false;
    }
  }

  function getYellowBtnByInnerText(text) {
    let btnsYellow = document.getElementsByClassName(
      "bl-button__container secondary-shade-color "
    );

    for (let idx = 0; idx < btnsYellow.length; idx++) {
      const element = btnsYellow[idx];

      if (
        element.firstElementChild.firstElementChild.firstElementChild
          .firstElementChild.firstElementChild.innerText == text
      ) {
        return element;
      }
    }

    // If the all btns not match
    return false;
  }

  function setMainBtn(setStatus) {
    if (setStatus == "start") {
      btnStart.innerHTML = `
      <div style="padding: 10px; display: flex; align-items: center; justify-content: center; background: blue; color: white; border-radius: 4px;">
        Start
      </div>
    `;
      btnStart.onclick = start;
    } else if (setStatus == "stop") {
      btnStart.innerHTML = `
      <div style="padding: 10px; display: flex; align-items: center; justify-content: center; background: red; color: white; border-radius: 4px;">
        Stop
      </div>
    `;
      btnStart.onclick = stop;
    }
  }

  function goToNextQuestion() {
    let btnNext = getYellowBtnByInnerText("Next");

    btnNext.click();
  }

  // Stop the auto solve
  function stop() {
    isStop = true;
    setMainBtn("start");
  }

  // Start the auto solve
  async function start() {
    isStop = false;
    setMainBtn("stop");

    /*
      Elements
    */
    let nodeNavElement = document.getElementsByClassName(
      "MuiGrid-root MuiGrid-container MuiGrid-spacing-xs-2"
    )[0];

    let btnListAns = document.getElementsByClassName(
      "MuiButtonBase-root bl-w-full justify-content-start"
    );

    for (let i = 0; i < nodeNavElement.childElementCount; i++) {
      // check if stop() executed and check if there is a submit button
      if (isStop || getYellowBtnByInnerText("Submit")) {
        stop();
        break;
      }

      // check if already correct
      if (checkIsCorrect()) {
        goToNextQuestion();
        continue;
      }

      for (let i = 0; i < btnListAns.length; i++) {
        if (isStop) break;

        await setDelay(300);
        let btnAnswer = btnListAns[i];

        btnAnswer.click();

        await setDelay(300);

        let btnsYellow = document.getElementsByClassName(
          "bl-button__container secondary-shade-color "
        );

        for (let idx = 0; idx < btnsYellow.length; idx++) {
          const element = btnsYellow[idx];

          btnCheck = getYellowBtnByInnerText("Check");

          if (btnCheck) {
            // click the check button
            btnCheck.click();
            break;
          }

          // If check button not found
          if (idx == btnsYellow.length - 1) {
            goToNextQuestion();
          }
        }

        await setDelay(300);

        if (checkIsCorrect()) {
          break;
        }
      }

      goToNextQuestion();
    }
  }

  /*
  Execution
*/
  btnStart.onclick = start;
})();