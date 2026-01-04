// ==UserScript==
// @name         timerecorder
// @namespace    *
// @version      0.4
// @description  记录你在各个网站学习的时间
// @author       passer21
// @match        *://*/*
// @icon         https://img.zcool.cn/community/01271c5d391e43a80120695ccafcc2.jpg@1280w_1l_2o_100sh.jpg
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475891/timerecorder.user.js
// @updateURL https://update.greasyfork.org/scripts/475891/timerecorder.meta.js
// ==/UserScript==
(function () {
    'use strict';
    // Your code here...
    const setcss = () => {
        var newstyles = `
        /* CSS */
        .button-86 {
          all: unset;
          width: 80px;
          height: 30px;
          font-size: 16px;
          background: transparent;
          border: none;
          position: relative;
          color: #f0f0f0;
          cursor: pointer;
          z-index: 1;
          padding: 10px 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
          user-select: none;
          -webkit-user-select: none;
          touch-action: manipulation;
        }
        .button-86::after,
        .button-86::before {
          content: '';
          position: absolute;
          bottom: 0;
          right: 0;
          z-index: -99999;
          transition: all .4s;
        }

        .button-86::before {
          transform: translate(0%, 0%);
          width: 100%;
          height: 100%;
          background: #28282d;
          border-radius: 10px;
        }

        .button-86::after {
          transform: translate(10px, 10px);
          width: 35px;
          height: 35px;
          background: #ffffff15;
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          border-radius: 50px;
        }

        .button-86:hover::before {
          transform: translate(5%, 20%);
          width: 110%;
          height: 110%;
        }

        .button-86:hover::after {
          border-radius: 10px;
          transform: translate(0, 0);
          width: 100%;
          height: 100%;
        }

        .button-86:active::after {
          transition: 0s;
          transform: translate(0, 5%);
        }`
        var styleSheet = document.createElement("style")
        styleSheet.innerText = newstyles
        document.head.appendChild(styleSheet)
    }
    var startTime, endTime, timeSpent;
    const startcount = () => {
        // Get the current time when the page is loaded
        startTime = new Date();
        //console.log(startTime);
        timeSpent = Number(localStorage.getItem("timeSpent")) || 0;
        // Get the previous time spent from localStorage or set it to zero if not found
        //console.log(timeSpent)
    }
    const stopcount = () => {
        // Get the current time when the page is unloaded
        endTime = new Date();
        // Calculate the time difference in milliseconds
        var timeDiff = (endTime - startTime) / 1000;
        // Add the time difference to the previous time spent
        timeSpent += timeDiff;
        //console.log(timeSpent, endTime, startTime)
        // Save the new time spent in localStorage
        if (!isNaN(timeSpent)) {
            //console.log(timeSpent, 'when storage')
            localStorage.setItem("timeSpent", timeSpent);
        }
    }
    const GetTime = () => {
        let timer = localStorage.getItem("timeSpent");
        //console.log(`total time is ${timer / 60} min`);
        return (timer / 60)
    }
    window.onload = function () {
        startcount();
        //startcount();
    };
    window.onbeforeunload = function () {
        stopcount();
    };
    document.addEventListener("visibilitychange", function () {
        // If the document is hidden, stop the timer and save the time spent
        if (document.hidden) {
            stopcount();
        } else {
            // If the document is visible, resume the timer and update the start time
            startcount();
        }
    });
    const showtime = () => {
        var iframe = document.createElement("iframe");
        iframe.src = "about:blank";
        document.body.appendChild(iframe);
        let spendingtime = GetTime()
        iframe.contentDocument.write(`<html><head><title>you time spending</title></head><body>你在这个网站的努力时长累计为${spendingtime}分钟</body></html>`);
    }
    const makebutton = () => {
        setcss()
        // Create a button element
        var button = document.createElement("button");
        // Set the button text
        button.className = 'button-86'
        button.innerHTML = "time";
        // Set the button style
        button.style.position = "fixed";
        button.style.bottom = "0%";
        button.style.right = "0";
        // button.style.width = "50px";
        // button.style.height = "50px";
        // button.style.borderRadius = "50%";
        // button.style.transform = "translate(0%, 0%)";
        // button.style.backgroundColor = "blue";
        // button.style.color = "white";
        // button.style.border = "none";
        // Add an event listener for the button click
        button.addEventListener("click", function () {
            // Do something when the button is clicked
            let spendingtime = GetTime()
            alert(`大神！您已经在这个网站上学习了${spendingtime}分钟了`);
        });
        // Append the button to the document body
        document.body.appendChild(button);
    }
    makebutton()
    //comment it if you dont need it.
    //showtime()
    //uncomment it if you need.
})();
