// ==UserScript==
// @name         Digital Clock Widget by Chua Nghi Ten
// @namespace    http://tampermonkey.net/
// @version      2024.05.19.15.49
// @license      GNU GPLv3
// @description  Provide a seemingly useless clock in the corner of the screen.
// @author       Chua Nghi Ten
// @match        *://*/*
// @icon         https://github.com/chuanghiten/chuanghiten.github.io/raw/main/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494750/Digital%20Clock%20Widget%20by%20Chua%20Nghi%20Ten.user.js
// @updateURL https://update.greasyfork.org/scripts/494750/Digital%20Clock%20Widget%20by%20Chua%20Nghi%20Ten.meta.js
// ==/UserScript==

(() => {
  "use strict";
  window.addEventListener("load", () => {
    let cfr = 0,
      time = 0,
      seconds = 0,
      minutes = 0,
      hours = 0,
      oldSeconds,
      oldMinutes,
      oldHours,
      menuActive = false,
      widgetMove = false,
      secondsHided = false,
      smoothSeconds = true,
      hour12 = true,
      showAMPM = true,
      autoCheckUpdate = true,
      updateChecking = false,
      cntDelayMs = 0,
      cntDelayEnable = false,
      cntDelayCallBack = () => {},
      cntDelayFollowCallBack = () => {};
    const bodyElement = window.document.querySelector("html body"),
      cntTimeWidget = window.document.createElement("div"),
      cntStyle = window.document.createElement("style"),
      currentVersion = "2024.05.19.15.49",
      windowSize = {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      cntTimeOnWindowSize = {
        width: 1,
        height: 1,
      },
      updateSeconds = Object.freeze({
        size: (clockWidth, clockHeight) => {
          let w1 = clockWidth - 1,
            h10d5 = clockHeight - 9,
            h0d4 = clockHeight - 4.6,
            w0d4 = clockWidth - 4.6,
            h1 = clockHeight - 1,
            w10d5 = clockWidth - 9;
          window.document
            .querySelectorAll(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock .cntSecondsProgress svg path"
            )
            .forEach((c) => {
              c.setAttribute(
                "d",
                `M 1 9 C 1 4.6 4.6 1 9 1 H ${w10d5} C ${
                  clockWidth - 4.6
                } 1 ${w1} 4.6 ${w1} 9 V ${h10d5} C ${w1} ${h0d4} ${w0d4} ${h1} ${w10d5} ${h1} H 9 C 4.6 ${h1} 1 ${h0d4} 1 ${h10d5} Z`
              );
            });
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock .cntSecondsProgress svg"
            )
            .setAttribute("width", clockWidth);
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock .cntSecondsProgress svg"
            )
            .setAttribute("height", clockHeight);
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock .cntSecondsProgress svg"
            )
            .setAttribute("viewbox", `0 0 ${clockWidth} ${clockHeight}`);
          window.document.querySelector(
            "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock .cntSecondsProgress svg path + path"
          ).style.strokeDasharray = `${window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock .cntSecondsProgress svg path + path"
            )
            .getTotalLength()}px`;
        },
        seconds: (s) => {
          window.document.querySelector(
            "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock .cntSecondsProgress svg path + path"
          ).style.strokeDashoffset = `${
            (1 - s) *
            window.document
              .querySelector(
                "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock .cntSecondsProgress svg path + path"
              )
              .getTotalLength()
          }px`;
        },
      }),
      getViTriWidget = (wWidth, wHeight) => {
        if (
          (cntTimeWidget.getBoundingClientRect().left +
            cntTimeWidget.getBoundingClientRect().width / 2) /
            wWidth <
          0.5
        ) {
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock"
            )
            .removeAttribute("cntright");
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock"
            )
            .setAttribute("cntleft", "");
        } else {
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock"
            )
            .removeAttribute("cntleft");
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock"
            )
            .setAttribute("cntright", "");
        }
        if (
          (cntTimeWidget.getBoundingClientRect().top +
            cntTimeWidget.getBoundingClientRect().height / 2) /
            wHeight <
          0.5
        ) {
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock"
            )
            .removeAttribute("cntbottom");
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock"
            )
            .setAttribute("cnttop", "");
        } else {
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock"
            )
            .removeAttribute("cnttop");
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock"
            )
            .setAttribute("cntbottom", "");
        }
      },
      fr = 10,
      cntDelay = () => {
        cntDelayFollowCallBack();
        if (cntDelayMs < Date.now()) {
          cntDelayCallBack();
          cntDelayEnable = false;
        }
      },
      updateTimeWithFPS = () => {
        time = new Date();
        if (cfr > fr) {
          cfr = 0;
          seconds = time.getSeconds();
          if (seconds != oldSeconds) {
            oldSeconds = seconds;
            minutes = time.getMinutes();
            if (minutes != oldMinutes) {
              oldMinutes = minutes;
              hours = time.getHours();
              if (hours != oldHours) {
                oldHours = hours;
                if (hour12) {
                  if (hours <= 12)
                    window.document.querySelector(
                      "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock .cntClockText .cntHours"
                    ).innerHTML = hours;
                  else
                    window.document.querySelector(
                      "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock .cntClockText .cntHours"
                    ).innerHTML = hours - 12;
                } else
                  window.document.querySelector(
                    "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock .cntClockText .cntHours"
                  ).innerHTML = hours;
                if (autoCheckUpdate && !updateChecking) checkForUpdate();
              }
              if (minutes < 10)
                window.document.querySelector(
                  "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock .cntClockText .cntMinutes"
                ).innerHTML = `0${minutes}`;
              else
                window.document.querySelector(
                  "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock .cntClockText .cntMinutes"
                ).innerHTML = minutes;
              if (showAMPM && hour12) {
                if (hours * 60 + minutes < 720)
                  window.document.querySelector(
                    "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock .cntClockText .cntAmPm"
                  ).innerHTML = " AM";
                else
                  window.document.querySelector(
                    "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock .cntClockText .cntAmPm"
                  ).innerHTML = " PM";
              }
            }
            if (!secondsHided) {
              if (seconds < 10)
                window.document.querySelector(
                  "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock .cntClockText .cntSeconds"
                ).innerHTML = `:0${seconds}`;
              else
                window.document.querySelector(
                  "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock .cntClockText .cntSeconds"
                ).innerHTML = `:${seconds}`;
            }
            if (!smoothSeconds) updateSeconds.seconds(time.getSeconds() / 60);
            updateSeconds.size(
              window.document
                .querySelector(
                  "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock"
                )
                .getBoundingClientRect().width,
              window.document
                .querySelector(
                  "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock"
                )
                .getBoundingClientRect().height
            );
          }
        } else ++cfr;
        if (smoothSeconds)
          updateSeconds.seconds(
            (time.getSeconds() + time.getMilliseconds() / 999) / 60
          );
        if (cntDelayEnable) cntDelay();
        window.requestAnimationFrame(updateTimeWithFPS);
      },
      cntUserData = Object.freeze({
        write: (key, value) => {
          window.localStorage.setItem(`${key}`, `${value}`);
        },
        read: (key) => {
          return window.localStorage.getItem(`${key}`);
        },
        remove: (key) => {
          window.localStorage.removeItem(`${key}`);
        },
      }),
      setViTriWidget = (w, h) => {
        if (h < 0.5) {
          cntTimeWidget.style.bottom = "auto";
          if (
            h <
            cntTimeWidget.getBoundingClientRect().height / windowSize.height
          )
            cntTimeWidget.style.top = "0";
          else
            cntTimeWidget.style.top = `${
              windowSize.height * h -
              cntTimeWidget.getBoundingClientRect().height / 2
            }px`;
        } else {
          cntTimeWidget.style.top = "auto";
          if (
            h >
            1 - cntTimeWidget.getBoundingClientRect().height / windowSize.height
          )
            cntTimeWidget.style.bottom = "0";
          else
            cntTimeWidget.style.bottom = `${
              windowSize.height * (1 - h) -
              cntTimeWidget.getBoundingClientRect().height / 2
            }px`;
        }
        if (w < 0.5) {
          cntTimeWidget.style.right = "auto";
          if (
            w <
            cntTimeWidget.getBoundingClientRect().width / windowSize.width
          )
            cntTimeWidget.style.left = "0";
          else
            cntTimeWidget.style.left = `${
              windowSize.width * w -
              cntTimeWidget.getBoundingClientRect().width / 2
            }px`;
        } else {
          cntTimeWidget.style.left = "auto";
          if (
            w >
            1 - cntTimeWidget.getBoundingClientRect().width / windowSize.width
          )
            cntTimeWidget.style.right = "0";
          else
            cntTimeWidget.style.right = `${
              windowSize.width * (1 - w) -
              cntTimeWidget.getBoundingClientRect().width / 2
            }px`;
        }
      },
      mouseMoveOnDocumentEvent = (e) => {
        if (widgetMove) {
          cntTimeOnWindowSize.width = e.clientX / windowSize.width;
          cntTimeOnWindowSize.height = e.clientY / windowSize.height;
          setViTriWidget(cntTimeOnWindowSize.width, cntTimeOnWindowSize.height);
        }
      },
      blockHoverDoubleClick = (e) => {
        if (widgetMove) {
          e.preventDefault();
          widgetMove = false;
          getViTriWidget(windowSize.width, windowSize.height);
          cntUserData.write("cntWidgetWidth", cntTimeOnWindowSize.width);
          cntUserData.write("cntWidgetHeight", cntTimeOnWindowSize.height);
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntBlockHover"
            )
            .removeAttribute("active");
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li.cntMoveButton"
            )
            .removeEventListener("click", cntMoveButtonClicked);
          window.document.removeEventListener(
            "mousemove",
            mouseMoveOnDocumentEvent
          );
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu"
            )
            .removeAttribute("active");
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li.cntMoveButton"
            )
            .removeEventListener("click", cntMoveButtonClicked);
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li.cntSecondsDropdown span"
            )
            .removeEventListener("click", cntSecondDropdownClicked);
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li.cntSecondsDropdown ul li span span.cntShowSecondsSwitch"
            )
            .removeEventListener("click", cntShowSecondsClicked);
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li.cntSecondsDropdown ul li span span.cntSmoothSecondsSwitch"
            )
            .removeEventListener("click", cntSmoothSecondsClicked);
          if (
            window.document.querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li.cntSecondsDropdown ul"
            ).attributes.length == 1
          )
            cntSecondDropdownClicked();
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li span span.hour12Switch"
            )
            .removeEventListener("click", hour12SwitchClicked);
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li span span.cntShowAMPMSwitch.cntSwitch"
            )
            .removeEventListener("click", showAMPMClicked);
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li span span.cntAutoUpdateSwitch.cntSwitch"
            )
            .removeEventListener("click", autoUpdateSwitchClicked);
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li > span.cntUpdate + ul li > span"
            )
            .removeEventListener("click", checkUpdateClicked);
        }
      },
      cntMoveButtonClicked = () => {
        widgetMove = true;
        window.document
          .querySelector(
            "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu"
          )
          .removeAttribute("active");
        window.document
          .querySelector(
            "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntBlockHover"
          )
          .setAttribute("active", "");
        menuActive = false;
        window.document.addEventListener("mousemove", mouseMoveOnDocumentEvent);
        window.document
          .querySelector(
            "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntBlockHover"
          )
          .addEventListener("dblclick", blockHoverDoubleClick, { once: true });
      },
      cntShowSecondsClicked = () => {
        if (!secondsHided) {
          cntUserData.write("cntHideSeconds", "1");
          window.document.querySelector(
            "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock .cntClockText .cntSeconds"
          ).style.display = "none";
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li.cntSecondsDropdown ul li span span.cntShowSecondsSwitch"
            )
            .removeAttribute("active");
        } else {
          cntUserData.write("cntHideSeconds", "0");
          window.document.querySelector(
            "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock .cntClockText .cntSeconds"
          ).style.display = "inline";
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li.cntSecondsDropdown ul li span span.cntShowSecondsSwitch"
            )
            .setAttribute("active", "");
        }
        updateSeconds.size(
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock"
            )
            .getBoundingClientRect().width,
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock"
            )
            .getBoundingClientRect().height
        );
        secondsHided = !secondsHided;
      },
      cntSmoothSecondsClicked = () => {
        if (smoothSeconds) {
          smoothSeconds = false;
          cntUserData.write("cntSmoothSeconds", "0");
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li.cntSecondsDropdown ul li span span.cntSmoothSecondsSwitch"
            )
            .removeAttribute("active");
        } else {
          smoothSeconds = true;
          cntUserData.write("cntSmoothSeconds", "1");
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li.cntSecondsDropdown ul li span span.cntSmoothSecondsSwitch"
            )
            .setAttribute("active", "");
        }
      },
      cntSecondDropdownClicked = () => {
        if (
          window.document.querySelector(
            "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li.cntSecondsDropdown ul"
          ).attributes.length == 1
        ) {
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li.cntSecondsDropdown ul"
            )
            .removeAttribute("active");
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li.cntSecondsDropdown ul li span span.cntShowSecondsSwitch"
            )
            .removeEventListener("click", cntShowSecondsClicked);
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li.cntSecondsDropdown ul li span span.cntSmoothSecondsSwitch"
            )
            .removeEventListener("click", cntSmoothSecondsClicked);
        } else {
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li.cntSecondsDropdown ul"
            )
            .setAttribute("active", "");
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li.cntSecondsDropdown ul li span span.cntShowSecondsSwitch"
            )
            .addEventListener("click", cntShowSecondsClicked);
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li.cntSecondsDropdown ul li span span.cntSmoothSecondsSwitch"
            )
            .addEventListener("click", cntSmoothSecondsClicked);
        }
      },
      showAMPMClicked = () => {
        if (showAMPM) {
          showAMPM = false;
          cntUserData.write("cntShowAMPM", "0");
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li span span.cntShowAMPMSwitch.cntSwitch"
            )
            .removeAttribute("active");
          window.document.querySelector(
            "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock .cntClockText .cntAmPm"
          ).style.display = "none";
        } else {
          showAMPM = true;
          cntUserData.write("cntShowAMPM", "1");
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li span span.cntShowAMPMSwitch.cntSwitch"
            )
            .setAttribute("active", "");
          window.document.querySelector(
            "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock .cntClockText .cntAmPm"
          ).style.display = "inline";
          if (hours * 60 + minutes < 720)
            window.document.querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock .cntClockText .cntAmPm"
            ).innerHTML = " AM";
          else
            window.document.querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock .cntClockText .cntAmPm"
            ).innerHTML = " PM";
        }
        updateSeconds.size(
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock"
            )
            .getBoundingClientRect().width,
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock"
            )
            .getBoundingClientRect().height
        );
      },
      hour12SwitchClicked = () => {
        if (hour12) {
          hour12 = false;
          cntUserData.write("cnt12Hour", "0");
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li span span.hour12Switch"
            )
            .removeAttribute("active");
          window.document.querySelector(
            "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock .cntClockText .cntHours"
          ).innerHTML = hours;
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li.cntShowAMPM ul"
            )
            .removeAttribute("active");
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li span span.cntShowAMPMSwitch.cntSwitch"
            )
            .removeEventListener("click", showAMPMClicked);
          if (!showAMPM) showAMPM = !showAMPM;
          showAMPMClicked();
        } else {
          hour12 = true;
          cntUserData.write("cnt12Hour", "1");
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li span span.hour12Switch"
            )
            .setAttribute("active", "");
          if (hours <= 12)
            window.document.querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock .cntClockText .cntHours"
            ).innerHTML = hours;
          else
            window.document.querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock .cntClockText .cntHours"
            ).innerHTML = hours - 12;
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li.cntShowAMPM ul"
            )
            .setAttribute("active", "");
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li span span.cntShowAMPMSwitch.cntSwitch"
            )
            .addEventListener("click", showAMPMClicked);
          if (showAMPM) {
            showAMPM = !showAMPM;
            showAMPMClicked();
          }
        }
        updateSeconds.size(
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock"
            )
            .getBoundingClientRect().width,
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock"
            )
            .getBoundingClientRect().height
        );
      },
      checkForUpdate = async () => {
        const data = await fetch(
          "https://raw.githubusercontent.com/chuanghiten/CNT-User-Script/main/cntDigitalClockWidget/version.json"
        )
          .then((v) => {
            if (v.status == 200 || v.status == 304) return v.json();
            else return false;
          })
          .catch((e) => {
            console.log(e);
            return false;
          });
        // console.log(data.version);
        if (data) {
          const currentVersionArray = currentVersion.split("."),
            newVersionArray = data.version.split(".");
          const updateStatus = currentVersionArray.every((c, i) => {
            if (c < newVersionArray[i]) {
              window.document.querySelector(
                "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntNotiStatus"
              ).innerHTML =
                '<span><a href="https:/' +
                '/raw.githubusercontent.com/chuanghiten/CNT-User-Script/main/cntDigitalClockWidget/script.user.js">A new update is available. Check it now !!!</a></span><span title="Close" style="margin-left: 50px;">[ <span style="color: #f94b53; cursor: pointer;">X</span> ]</span>';
              window.document
                .querySelector(
                  "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntNotiStatus"
                )
                .setAttribute("active", "");
              window.document
                .querySelector(
                  "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntNotiStatus span + span span"
                )
                .addEventListener(
                  "click",
                  () => {
                    window.document
                      .querySelector(
                        "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntNotiStatus"
                      )
                      .removeAttribute("active");
                  },
                  {
                    once: true,
                  }
                );
              return false;
            } else return true;
          });
          if (updateStatus) {
            let dl = 10000;
            window.document.querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntNotiStatus"
            ).innerHTML =
              '<div>No updates available!<div style="width: 100%; height: 1px; background: #fff; transform-origin: 0 0; margin-top: 2px"></div></div>';
            window.document
              .querySelector(
                "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntNotiStatus"
              )
              .setAttribute("active", "");
            cntDelayMs = Date.now() + dl;
            cntDelayCallBack = () => {
              window.document
                .querySelector(
                  "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntNotiStatus"
                )
                .removeAttribute("active");
            };
            cntDelayFollowCallBack = () => {
              let progress = cntDelayMs - Date.now();
              window.document.querySelector(
                "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntNotiStatus div div"
              ).style.transform = `scaleX(${progress / dl})`;
              if (progress < dl / 3)
                window.document.querySelector(
                  "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntNotiStatus div div"
                ).style.background = "#f94b53";
            };
            cntDelayEnable = true;
          }
        } else {
          let dl = 10000;
          window.document.querySelector(
            "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntNotiStatus"
          ).innerHTML =
            '<div><a href="https:/' +
            '/raw.githubusercontent.com/chuanghiten/CNT-User-Script/main/cntDigitalClockWidget/script.user.js" style="display: inline; color: #f94b53; font-weight: bold">Update check failed! Check manually now.</a><div style="width: 100%; height: 1px; background: #fff; transform-origin: 0 0; margin-top: 2px"></div></div>';
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntNotiStatus"
            )
            .setAttribute("active", "");
          cntDelayMs = Date.now() + dl;
          cntDelayCallBack = () => {
            window.document
              .querySelector(
                "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntNotiStatus"
              )
              .removeAttribute("active");
          };
          cntDelayFollowCallBack = () => {
            let progress = cntDelayMs - Date.now();
            window.document.querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntNotiStatus div div"
            ).style.transform = `scaleX(${progress / dl})`;
            if (progress < dl / 3)
              window.document.querySelector(
                "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntNotiStatus div div"
              ).style.background = "#f94b53";
          };
          cntDelayEnable = true;
        }
        updateChecking = false;
        window.document
          .querySelector(
            "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li > span.cntUpdate + ul li span span + span"
          )
          .removeAttribute("active");
      },
      checkUpdateClicked = () => {
        if (!updateChecking) {
          updateChecking = true;
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li > span.cntUpdate + ul li span span + span"
            )
            .setAttribute("active", "");
          checkForUpdate();
        }
      },
      autoUpdateSwitchClicked = () => {
        if (autoCheckUpdate) {
          autoCheckUpdate = false;
          cntUserData.write("cntAutoCheckUpdate", "0");
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li span span.cntAutoUpdateSwitch.cntSwitch"
            )
            .removeAttribute("active");
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li span.cntUpdate + ul"
            )
            .setAttribute("active", "");
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li > span.cntUpdate + ul li > span"
            )
            .addEventListener("click", checkUpdateClicked);
        } else {
          autoCheckUpdate = true;
          cntUserData.write("cntAutoCheckUpdate", "1");
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li span span.cntAutoUpdateSwitch.cntSwitch"
            )
            .setAttribute("active", "");
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li span.cntUpdate + ul"
            )
            .removeAttribute("active");
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li > span.cntUpdate + ul li > span"
            )
            .removeEventListener("click", checkUpdateClicked);
        }
      },
      cntButtonMenuClicked = () => {
        if (!menuActive) {
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu"
            )
            .setAttribute("active", "");
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li.cntMoveButton"
            )
            .addEventListener("click", cntMoveButtonClicked);
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li.cntSecondsDropdown span"
            )
            .addEventListener("click", cntSecondDropdownClicked);
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li span span.hour12Switch"
            )
            .addEventListener("click", hour12SwitchClicked);
          if (hour12)
            window.document
              .querySelector(
                "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li span span.cntShowAMPMSwitch.cntSwitch"
              )
              .addEventListener("click", showAMPMClicked);
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li span span.cntAutoUpdateSwitch.cntSwitch"
            )
            .addEventListener("click", autoUpdateSwitchClicked);
          if (!autoCheckUpdate)
            window.document
              .querySelector(
                "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li > span.cntUpdate + ul li > span"
              )
              .addEventListener("click", checkUpdateClicked);
        } else {
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu"
            )
            .removeAttribute("active");
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li.cntMoveButton"
            )
            .removeEventListener("click", cntMoveButtonClicked);
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li.cntSecondsDropdown span"
            )
            .removeEventListener("click", cntSecondDropdownClicked);
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li.cntSecondsDropdown ul li span span.cntShowSecondsSwitch"
            )
            .removeEventListener("click", cntShowSecondsClicked);
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li.cntSecondsDropdown ul li span span.cntSmoothSecondsSwitch"
            )
            .removeEventListener("click", cntSmoothSecondsClicked);
          if (
            window.document.querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li.cntSecondsDropdown ul"
            ).attributes.length == 1
          )
            cntSecondDropdownClicked();
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li span span.hour12Switch"
            )
            .removeEventListener("click", hour12SwitchClicked);
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li span span.cntShowAMPMSwitch.cntSwitch"
            )
            .removeEventListener("click", showAMPMClicked);
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li span span.cntAutoUpdateSwitch.cntSwitch"
            )
            .removeEventListener("click", autoUpdateSwitchClicked);
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li > span.cntUpdate + ul li > span"
            )
            .removeEventListener("click", checkUpdateClicked);
        }
        menuActive = !menuActive;
      },
      mouseEnterCntClock = () => {
        updateSeconds.size(
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock"
            )
            .getBoundingClientRect().width,
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock"
            )
            .getBoundingClientRect().height
        );
        updateSeconds.seconds(
          (time.getSeconds() + time.getMilliseconds() / 999) / 60
        );
        window.document
          .querySelector(
            "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock"
          )
          .addEventListener("mouseleave", mouseLeaveCntClock, { once: true });
        window.document
          .querySelectorAll(
            "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock .cntButtonMenu"
          )
          .forEach((c) => {
            c.addEventListener("click", cntButtonMenuClicked);
          });
      },
      mouseLeaveCntClock = () => {
        updateSeconds.size(
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock"
            )
            .getBoundingClientRect().width,
          window.document
            .querySelector(
              "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock"
            )
            .getBoundingClientRect().height
        );
        updateSeconds.seconds(
          (time.getSeconds() + time.getMilliseconds() / 999) / 60
        );
        window.document
          .querySelector(
            "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock"
          )
          .addEventListener("mouseenter", mouseEnterCntClock, { once: true });
        window.document
          .querySelectorAll(
            "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock .cntButtonMenu"
          )
          .forEach((c) => {
            c.removeEventListener("click", cntButtonMenuClicked);
          });
      };
    cntTimeWidget.setAttribute("class", "Chua Nghi Ten Digital Clock Widget");
    cntStyle.innerHTML =
      '@keyframes scaleOut {0%, 12.5%, 50%, 62.5%, 100% {opacity: .25} 25%, 37.5%, 75%, 87.5% {opacity: 1}} html body .Chua.Nghi.Ten.Digital.Clock.Widget, html body .Chua.Nghi.Ten.Digital.Clock.Widget * {margin: 0; padding: 0; border: 0; box-sizing: border-box; position: relative; display: block; font-family: Roboto, Arial, sans-serif; font-size: 16px; line-height: 19px; user-select: none; white-space: nowrap} html body .Chua.Nghi.Ten.Digital.Clock.Widget span {display: inline} html body .Chua.Nghi.Ten.Digital.Clock.Widget a {color: #fff; text-decoration: none} html body .Chua.Nghi.Ten.Digital.Clock.Widget {position: fixed; padding: 10px; z-index: 2147483647} html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock {background: #0009; color: #fff; border-radius: 10px; padding: 6px 10px; box-shadow: 0 0 15px 0 #00000044; min-width: 20px; min-height: 20px; backdrop-filter: blur(5px)} html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock .cntButtonMenu {display: none} html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock .cntButtonMenu span {cursor: pointer} html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock[cntright]:hover .cntleftButtonMenu {display: inline} html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock[cntleft]:hover .cntrightButtonMenu {display: inline} html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntSecondsProgress {position: absolute; top: 0; left: 0; width: 100%; height: 100%} html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock .cntSecondsProgress svg {width: 100%; height: 100%} html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock .cntSecondsProgress svg path {fill: #0000; stroke-width: 2px; stroke: #fff} html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock .cntSecondsProgress svg path:first-child {stroke: #fff3} html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu, html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntNotiStatus {position: absolute; background: #0009; border-radius: 10px; box-shadow: 0 0 15px 0 #00000044; backdrop-filter: blur(5px); border: 2px solid #fff; padding: 6px 10px; color: #fff; display: none} html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu[active], html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntNotiStatus[active] {display: flex} html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock[cntleft] + .cntNotiStatus + .cntMenu[active], html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock[cntleft] + .cntNotiStatus[active] {left: 10px} html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock[cntright] + .cntNotiStatus + .cntMenu[active], html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock[cntright] + .cntNotiStatus[active] {right: 10px} html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock[cntbottom] + .cntNotiStatus[active], html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock[cntbottom] + .cntNotiStatus + .cntMenu[active] {bottom: 100%} html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock[cnttop] + .cntNotiStatus[active], html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock[cnttop] + .cntNotiStatus + .cntMenu[active] {top: 100%} html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock[cntbottom] + .cntNotiStatus[active] + .cntMenu[active] {bottom: 200%} html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock[cnttop] + .cntNotiStatus[active] + .cntMenu[active] {top: 200%} html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li {cursor: pointer; border-bottom: 1px solid #fff; padding-bottom: 5px; margin-bottom: 5px} html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li:hover {background: #fff2} html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li:last-child {border: 0; padding: 0; margin: 0} html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntBlockHover {width: 100%; height: 100%; position: absolute; top: 0; left: 0; display: none} html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntBlockHover[active] {display: block; cursor: all-scroll} html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock .cntClockText {white-space: nowrap} html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li ul {margin: 5px 0 5px 20px; display: none} html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li ul[active] {display: block} html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li > span {display: flex; justify-content: space-between} html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li > span > span + span {margin-left: 50px} html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li.cntSecondsDropdown ul li span span.cntSwitch, html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li span span.cntSwitch {width: 35px; height: 20px; border: 2px solid #fff; border-radius: 10px; display: flex; justify-content: flex-start} html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li.cntSecondsDropdown ul li span span.cntSwitch[active], html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li span span.cntSwitch[active] {justify-content: flex-end} html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li.cntSecondsDropdown ul li span span.cntSwitch:before, html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li span span.cntSwitch:before {content: ""; display: block; position: relative; width: 12px; height: 12px; border-radius: 50%; background: #fff; margin: 2px} html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li > span.cntUpdate + ul li span span + span span {display: none} html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu[active] ul li > span.cntUpdate + ul[active] li span span + span[active] span {display: inline; animation: scaleOut 1.5s linear .1s infinite} html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu[active] ul li > span.cntUpdate + ul[active] li span span + span[active] span:last-child {animation-delay: .2s} html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu[active] ul li > span.cntUpdate + ul[active] li span span + span[active] span:first-child {animation-delay: 0s}';
    cntTimeWidget.innerHTML =
      '<div class="cntClock" cntleft cntright><div class="cntSecondsProgress"><svg><path stroke-linecap="round" stroke-linejoin="round"></path><path stroke-linecap="round" stroke-linejoin="round"></path></svg></div><span class="cntleftButtonMenu cntButtonMenu"><span title="Open or Close settings">•••</span> | </span><span class="cntClockText"><span class="cntHours">88</span>:<span class="cntMinutes">88</span><span class="cntSeconds">:88</span><span class="cntAmPm"></span></span><span class="cntrightButtonMenu cntButtonMenu"> | <span title="Open or Close settings">•••</span></span></div><div class="cntNotiStatus"></div><div class="cntMenu"><ul><li class="cntMoveButton" title="Move to...">Move</li><li class="cntSecondsDropdown"><span><span title="Seconds settings">Seconds</span><span title="Expand / Collapse">•••</span></span><ul><li><span><span>Show Seconds</span><span class="cntShowSecondsSwitch cntSwitch" title="Disable / Enable"></span></span></li><li><span><span>Smooth Seconds Progress Bar</span><span class="cntSmoothSecondsSwitch cntSwitch" title="Disable / Enable"></span></span></li></ul></li><li class="cntShowAMPM"><span><span>12 - Hour time</span><span class="hour12Switch cntSwitch" title="Disable / Enable"></span></span><ul><li><span><span>Show AM / PM</span><span class="cntShowAMPMSwitch cntSwitch" title="Disable / Enable"></span></span></li></ul></li><li><span class="cntUpdate"><span>Auto check update</span><span class="cntAutoUpdateSwitch cntSwitch" title="Disable / Enable"></span></span><ul><li><span><span>Check for Update</span><span><span>•</span><span>•</span><span>•</span></span></span></span></li></ul></li></ul></div><div class="cntBlockHover" title="Double click to set and exit"></div>';
    bodyElement.appendChild(cntTimeWidget);
    window.document.querySelector("html").appendChild(cntStyle);
    updateSeconds.size(
      window.document
        .querySelector(
          "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock"
        )
        .getBoundingClientRect().width,
      window.document
        .querySelector(
          "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock"
        )
        .getBoundingClientRect().height
    );
    window.document
      .querySelector("html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock")
      .addEventListener("mouseenter", mouseEnterCntClock, { once: true });
    window.document
      .querySelector("html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock")
      .addEventListener("mouseleave", mouseLeaveCntClock, { once: true });
    if (cntUserData.read("cntHideSeconds") != null)
      secondsHided = Number(cntUserData.read("cntHideSeconds"));
    if (cntUserData.read("cntSmoothSeconds") != null)
      smoothSeconds = Number(cntUserData.read("cntSmoothSeconds"));
    if (smoothSeconds)
      window.document
        .querySelector(
          "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li.cntSecondsDropdown ul li span span.cntSmoothSecondsSwitch"
        )
        .setAttribute("active", "");
    if (cntUserData.read("cnt12Hour") != null)
      hour12 = Number(cntUserData.read("cnt12Hour"));
    if (hour12) {
      window.document
        .querySelector(
          "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li span span.hour12Switch"
        )
        .setAttribute("active", "");
      window.document
        .querySelector(
          "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li.cntShowAMPM ul"
        )
        .setAttribute("active", "");
    }
    if (secondsHided) {
      window.document.querySelector(
        "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock .cntClockText .cntSeconds"
      ).style.display = "none";
      window.document
        .querySelector(
          "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li.cntSecondsDropdown ul li span span.cntShowSecondsSwitch"
        )
        .removeAttribute("active");
    } else
      window.document
        .querySelector(
          "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li.cntSecondsDropdown ul li span span.cntShowSecondsSwitch"
        )
        .setAttribute("active", "");
    if (cntUserData.read("cntShowAMPM") != null)
      showAMPM = Number(cntUserData.read("cntShowAMPM"));
    window.requestAnimationFrame(updateTimeWithFPS);
    if (showAMPM) {
      if (hours * 60 + minutes < 720)
        window.document.querySelector(
          "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock .cntClockText .cntAmPm"
        ).innerHTML = " AM";
      else
        window.document.querySelector(
          "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock .cntClockText .cntAmPm"
        ).innerHTML = " PM";
      window.document
        .querySelector(
          "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li span span.cntShowAMPMSwitch.cntSwitch"
        )
        .setAttribute("active", "");
    } else {
      window.document.querySelector(
        "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntClock .cntClockText .cntAmPm"
      ).style.display = "none";
      window.document
        .querySelector(
          "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li span span.cntShowAMPMSwitch.cntSwitch"
        )
        .removeAttribute("active");
    }
    if (cntUserData.read("cntWidgetWidth") != null)
      cntTimeOnWindowSize.width = Number(cntUserData.read("cntWidgetWidth"));
    if (cntUserData.read("cntWidgetHeight") != null)
      cntTimeOnWindowSize.height = Number(cntUserData.read("cntWidgetHeight"));
    if (cntUserData.read("cntAutoCheckUpdate") != null)
      autoCheckUpdate = Number(cntUserData.read("cntAutoCheckUpdate"));
    if (autoCheckUpdate) {
      window.document
        .querySelector(
          "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li span span.cntAutoUpdateSwitch.cntSwitch"
        )
        .setAttribute("active", "");
      window.document
        .querySelector(
          "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li span.cntUpdate + ul"
        )
        .removeAttribute("active");
    } else {
      window.document
        .querySelector(
          "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li span span.cntAutoUpdateSwitch.cntSwitch"
        )
        .removeAttribute("active");
      window.document
        .querySelector(
          "html body .Chua.Nghi.Ten.Digital.Clock.Widget .cntMenu ul li span.cntUpdate + ul"
        )
        .setAttribute("active", "");
    }
    setViTriWidget(cntTimeOnWindowSize.width, cntTimeOnWindowSize.height);
    getViTriWidget(windowSize.width, windowSize.height);
    if (autoCheckUpdate) {
      checkForUpdate();
      updateChecking = true;
    }
  });
})();
