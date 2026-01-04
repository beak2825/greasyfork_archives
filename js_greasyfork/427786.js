// ==UserScript==
// @name         정플러스
// @namespace    mirnar1000-jungplus
// @version      1.0.3
// @description  정병소녀 관련 사이트 추가 요소
// @author       미르나래하늘
// @match        https://gall.dcinside.com/mgallery/*
// @match       https://www.youtube.com/channel/UCf0hB1FVie0EEIH6f6ls15Q*
// @match       https://tgd.kr/s/ghghgigi*
// @match       https://www.twitch.tv/ghghgigi*
// @match       https://www.instagram.com/soommnii/
// @grant        none
// @run-at      document_end
// @downloadURL https://update.greasyfork.org/scripts/427786/%EC%A0%95%ED%94%8C%EB%9F%AC%EC%8A%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/427786/%EC%A0%95%ED%94%8C%EB%9F%AC%EC%8A%A4.meta.js
// ==/UserScript==
(function () {
  "use strict";
  /**
   * 이름,이미지,링크
   */

  var siteList = [
    [
      "인스타그램",
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAsQAAALEBxi1JjQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAASQSURBVEiJjZZbiFZVFMd/a5/L981Nx/GCoWbWeKkxRyclxGKyLIJ6UjQD6fqShIUhWaBQpj1EBfoUgWBhF3CQiB6km0kIUTozjc6Mg6N56YKk48w4zved2efs1cP55sw4aXlgsc/ee7HX+q//f519hNKjq5bXJRpsiF24LNHg1sSF45yGJC4gGTW6bB6SaLZ3OfUNLyT43zBU/uGSIyuPAwiAPt34JEXd42IvvPbQ0iEuxJXGZExQN8Yv0QDnQhsTPLv0p9WfiK5/aAHW/ULkQiLFJf6ND76pYFlyUYIs8smxEZEQNaAOE8VQPRHT+CjB7XOgZhIyYQJgUEqgVVAEN1AkvjjAYOt5+r7uIuqxqKR7iOTQYKPo5hXdRHoHkULkYO5i2PAGlFVAfz/a24vaGC1EuFgBQdWgIkhFBf7UGkxVGW6gyB9bvuRKy4XRKE6Lbn24QKR5IoVgHLy1F670wc4dJJ1d13DhxtR6uExBXS2TtzyBhAGnntrDUE88LIbIEEqOUCAUaHwM8uWwdyecPo4xFiMWz1g8sdncGIsnMUFNnik7niGcNp5Lu77CVOWpXjE79U1NfEIRFFCg9m6wQ9DdAqEgqnjWghikfhH+3PmoetiOU0QtJzEzJ5NbMg91jovbPkPjhPKFM7jcdBQ1gBN8QiELMH4S9P0NJmZ4XcZV47+yHebWDbcMIZBr72Lg7Q/o3fw+Q2cuIXFE/PtF/IkVeGJTMYjgk5NSpwFBAIX+7HAQ2LQdZs1BP91NcvgwiYaYZY0Ea9dQ+foL9L32LrgATwLc5X7MpGqMsagTVBiDwAg4OxJg3j0wuw6adiNffIxxPupCkqbPwfMI1q4hV19L1NoNIhBbxEiKQASMYDKCQwFjAAc5SW12qSzNP0AoGIlLBFvc4UMABHW1GfFYC2jmZ8SOQSCA540g8ErlC0sBAS8qZSdJqe2SrOZiQNA0mOM6CFDww5H5nx1pgHsfZLSfMRb//vtS6k60Y0yMEYvkfHButEzHIEAhCEcQnGuBc+3wyDpIEvj5EFhFGh6AlWvR9jZob8aTAAxI4IEmGLGokevI1A1BkB8JoApN22DVVnj8+dSGn85f4b038RhKP0+A5EOwdpRMx6qo2AOT50MuzQQFoj74aBNMr4fpdRArnDgGbc1IMcGIl2Vrpk4h6egakakZi6C3A25ZDDMWwNnWkXVVON8C3c2kH0WFIO1UowkkFll0D1JZievsxJM4FQIpyQMZgX99C/EgLH0ZZjZA3r+G3BuZaWjAf2kTXL2Kfncgk60Rq6Jtq1qJtD7LrGoBLHwVggqIi1DohaECxDEUB1OyXdouhOUwZRqUV8HVK7h3thEfa88uHqdhm08g36PUZ+Xob4ND62HqchhXC/mJkK8GvwzylaMEodDfA51HobsTDh7AXOpLFYWULh5+FD2zehYF7cjuhOGLJ3v/r7V/r6uV4ewLTnJ3Grlt32+E5jlCGbqZev+fia94Ygseybqy/fvPSvbbcnL1XVh9kcgtJqKGoqsh0vIRZDdEUCTSQSLtSc0doWB2yb6DXQD/AE1urtg49iT3AAAAAElFTkSuQmCC",
      "https://www.instagram.com/soommnii"
    ],
    [
      "유튜브",
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAhQAAAIUB4uz/wQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFTSURBVEiJ7dXBSltBFMbx353YSGmQFt2JFvetEUHBNyil+ASSleBTuPcR3PoW7QMIrroxtC4FxZ0oora5KMfFTSS2hUnSuPMPh5nLnPudmTnMObyQoej/CF5hHu/wFm9Q7y73z3/jV3fewQ0ucY6TgvsnUYLPQTu4C+I/rQy+B5964otBZwzCf1on+JCw0Xf0cVJHK2HxGcR7fEx4n3VrNpmbGyXAfMJ01m1lhaMjdnZoNIYJMCO4zSZsczMeOT2NaLUiimKQRF8nwyZ4dpa9PQ4OWFvLeU+mocT7qdVI+d8TyqGEz87Y2mJ1lf39nHdnAtd4nRUuS3Z32d7m6mrQ7dwIfmSTtbwcsbAwymtuC749Q5no2deEw0HPOwJtQbNbAce9+zJYAsGXqMr1/ZjEfwbr/N1w6qraNI2GqukUmELtH1dw0R0vcatqOMdF1ZBeGIwH5nhwBS/Zcs4AAAAASUVORK5CYII=",
      "https://www.youtube.com/channel/UCf0hB1FVie0EEIH6f6ls15Q"
    ],
    [
      "트위치",
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAsQAAALEBxi1JjQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAHiSURBVEiJ7ZWxa5NBGMZ/732J1KZaGhetINJBQcHFQdqIlEb4muAqiiCIYG0LnZz8H6SjNi0OVRR0KIK2aRHsUD+zuNk6FgdBWimdhKTJd6+D+TRJY/qliZsPHNw9d+/z3L13vCeUMZpYeKYqN2gvdgRg4sLC4R1HvgGd7TaIABQdrv0RlxfGlMZaUVUbPa7YTwCRsuit37NC4dH7K9utGIxfWuryS7/6ZuT8x6hCfyuCjWC28+sCyL8yiIRdODKweE/QtKo8ns4NPw/4uwPZp0Avjk5kVtKfa+NME5s5AwxhOFnFKglgCF+66wU1Y7Av/DfYE6FfkYjOY9lQtV71jD5EJe5EzdeWDDJeag6Y28Xn0g9quWLJHg1S0/YUjSWypwVelYdbbTW4c3H+lK+8E+gFNlWtGzpFYcTFmuVAXDDJTC61KlfPvjwQ7z5UqFi7BXypihZzP+O5b8cHl7v8Yv4Jyok6Hn1AD+iGFZOc8YbXoP4lHym3Cvjxm+eWYn4h/xphsMFBNgXn8oznrgVEqDsQS6wzZt/sLW6SUx/c1Uoy0tPRp/B9vU7AQeAYgIpMAkExs9SmEH7g6PWpFXdXNf3rPzDan3VVWKyhrQq3p73UbIOTVKGZZ9q0eDMG+xIH+AmMWZZ7UWlikwAAAABJRU5ErkJggg==",
      "https://www.twitch.tv/ghghgigi"
    ],
    [
      "트게더",
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAFzUkdCAK7OHOkAAAAEZ0FNQQAAsY8L/GEFAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABz0lEQVRIS8WVTSgEYRjHn3dmXRatyCblY4uNEw6u4rQOQpxwpMSBMweF5CInlHJQLtrk4ICznJSPlIOUA8r62BCSj531Pv93ZzTsrrW16zf9+z8zzTvPvP/eeUeEJfQLyzO78ODVM4UNdXuu20mdg7Wo46FFPGXEnMHcyBb85DBIQgjUYXmYCHmYlFbk0MBkfeTMTtQG472bdH/9ivoj9A6Ph65lUFaOjnpssQlukt6I5se24cd7Qfnmb6gTRdcz4J5Ke1y2GRztBCA8nNv+QSEZJev06E5e+CLlEVkNVub3SdN0iNc6J/cn8RiMI1qa3oEYq8HVxSMZhgHxTcnLoNvLJ4hJX0RRp52kjJASYzXIL8yWXeTXKSXvSVo8Pq8gE2JSHpHtQ+tv9MPVJetygqi9SdccNLPRjpqxzaCixg1pwvFj6r9JE3KJS5V4XZGnKdIbkclw1xrd36jdNBT+gMeDY3G61F405W+Fm8T8HwzJJszd9YuMwEDNmP8GITSZugqgqDybhmZ9qL/zPxExE32b8POTB2s98T7lzFLvVF7lJl9HJWqPNw8ejZgNRrvX4YGzZyooVh9NXXMZNbR4USfK/0W0unAAb+uphicH0Sf04W4He/uz7AAAAABJRU5ErkJggg==",
      "https://tgd.kr/ghghgigi"
    ],
    [
      "디시인사이드",
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAQcSURBVEhLpVXNa1xVFP+9+96bN0kmMxNa06RGUGqrhZIuXLiNuMj/4sqQnaCki0JwkUQEF1qELgKiIoJQspGWrgpqUVuqpBSDzTQxJvP1JpmP93E9v/veS6bTYKD9PQ73nnPuPV/v3nMtLXj4uIvfH7XhOhYy6EgDKavly2AdCWHZR+v7EYQa0+eGcP4VD9b63229U4+wUwtgKwvizyyKo1gsiAHhYyGaokZRlsqVrcxai3wfolhjfMzFeNmG9e3NmlayjsYJOjAki7SxIyOzScGoadBiBrLHzLn3aIkBncSM8ftbNaPSsiMKIyOMYxklg1gWBTIGQZQFDde14UrkSowqRyKUvXRieEuZcjIIpZmdzL+7VWXIJtLQOBDPUYReL0S56KIw7GDitCcRMUtge7eL1kGIRjOAk3OMYTqwbXHGKMSoSufkFA2zxonh2GQRiYNAHAzlILV0cOn1Ii5fKJqRPOUMIAyEzHpmy8xjCZSU2GRpVBQG6HUDHLR7qNVbqNZ87O42UdmqoThsY/qNsSSalMhTTn216qNWa6Eu+5r+PvxWB81WzwQXi2MtpbZWbzzRxREHw3kLp0qORMRoYnS7IV6dGsXUxEiaegJGt7m9j41NH57HEinRS/nSsrBk1WaIg66Gvx/Duv7Dpp4azyelOF9KzTyNQQcn4Y+/Wtith3jybwC132zjVNE2xrMyDNIg5ubmjl2X0cXXCnip7KInp8/hz4j6znmG5eVlqW0d5XLZGOwHZRlmZmYwOzuLTqdjeL/ZgPxv+Ac82hLcJ9f/1D/f25PMTe6H1I9B+cLCwiG/uLhoZP1Y3/D17btVvXpjW6uox2PGtc+HLPL3PriJj5Z+wpVP7+LHO3t4tNGSiyd3greBmbwoSkUPpYLQcB6ey1PFvianKtW/MBp+V+5CAN+P0ekF0lHlwsnPMA6ev0BAPp8342dX38GV+bfw4fuX8O7bkzj3ckF6WAx5Adiwnq3RysrK4Sn6P6ytrZm70X+KPl5aRrUht1naD1auretf7lXN3xf9iUTMz88dq8uIuP+wpa99XdFqaMjDzl6I3x7UTSQn0e07FVxdXDpWl9H99Sa2dzrSVaU2X3z1WJdGbWnLCmdO56QXsbNKD0mrJuvNJvJ8lDY2WxgrexgdcY2OvYdIehLbtiUBB9hvazRactm+/Kaio5BtV/5+t2fuRCh85oB1pIPk+dBwc66RsUXz+eSzScOONDvO6Sjn5YSXOXWfr25peuWzGUWBMZZQ4kBuicyZUXaiDxUGpv9wTB8ei2ffURKEBCdz69cHvt76p4eKkIXIbOL5ZbQZkhKlKQ3AyKlP2za3CYezEx7OnslBXb5YwKRMmLZSkqYQe3s/OY7zjCwjloRPJN9jk6XwfF4nx3OYfrOA/wDkApslOG2EswAAAABJRU5ErkJggg==",
      "https://gall.dcinside.com/mgallery/board/lists/?id=ghghgigi"
    ]
  ];

  function addIcon(parent, siteName) {
    siteList.forEach(function (site) {
      if (siteName !== site[0]) {
        var elImg = document.createElement("img");
        elImg.title = site[0];
        elImg.src = site[1];
        var elLink = document.createElement("a");
        elLink.append(elImg);
        elLink.href = site[2];
        parent.append(document.createTextNode("\xA0"), elLink);
      }
    });
  }

  var urlParams = new URLSearchParams(window.location.search); // 디시인사이드

  if (
    window.location.hostname === "gall.dcinside.com" &&
    urlParams.has("id") &&
    urlParams.get("id") === "ghghgigi"
  ) {
    var elTitle = document.querySelector(
      "#container > section > header > div > div.fl.clear"
    );
    addIcon(elTitle, "디시인사이드");
  } // 유튜브

  if (window.location.hostname === "www.youtube.com") {
    var _elTitle = document.querySelector("#meta");

    addIcon(_elTitle, "유튜브");
  } // 트게더

  if (window.location.hostname === "tgd.kr") {
    var _elTitle2 = document.querySelector("#board-info > h1");

    addIcon(_elTitle2, "트게더");
  } // 트위치

  if (window.location.hostname === "www.twitch.tv") {
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (record) {
        if (record.addedNodes.length) {
          record.addedNodes.forEach(function (nodeAdded) {
            if (nodeAdded.nodeType === 1) {
              if (nodeAdded.querySelector(".hVWvPU")) {
                var _elTitle3 = document.querySelector(".hVWvPU");

                addIcon(_elTitle3, "트위치");
                observer.disconnect();
              } else if (
                nodeAdded.querySelector(".metadata-layout__support > div")
              ) {
                var _elTitle4 = document.querySelector(
                  ".metadata-layout__support > div"
                );

                addIcon(_elTitle4, "트위치");
                observer.disconnect();
              }
            }
          });
        }
      });
    });
    observer.observe(document, {
      childList: true,
      subtree: true
    });
  } // 인스타그램

  if (window.location.hostname === "www.instagram.com") {
    var _observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mut) {
        if (mut.addedNodes.length) {
          mut.addedNodes.forEach(function (add) {
            if (add.nodeType === 1 && add.querySelector(".nZSzR")) {
              var _elTitle5 = document.querySelector(".nZSzR");

              addIcon(_elTitle5, "인스타그램");

              _observer.disconnect();
            }
          });
        }
      });
    });

    _observer.observe(document, {
      childList: true,
      subtree: true
    });
  }
})();
