// ==UserScript==
// @name         GSE License
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Allows you to pull data from umbrella. Meant to be use to create the GSE license. Created by penavari
// @author       penavari
// @match        https://iad.umbrella.amazon.dev/portal/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473327/GSE%20License.user.js
// @updateURL https://update.greasyfork.org/scripts/473327/GSE%20License.meta.js
// ==/UserScript==

window.addEventListener("error", handleError, true);

function handleError(evt) {
    console.log(evt)
    alert("If you see this. Please just try again until it works! Sorry!")
}

var test = function(){
    var outString = "";
    var outArray = [];
    var i;

    var learnerContainer = document.querySelectorAll(".learner-entry-container")
    for (var learner of learnerContainer) {
        var learnerLoginUntrimed = learner.querySelectorAll(".learner-profile-column")[1].children[1].children[1].innerText;
        var learnerLogin = learnerLoginUntrimed.trim().replace("@", "");

        var t = 1;

        function myLoop() {
            setTimeout(function() {
                var elements = learner.querySelectorAll("#accContent-ex-2")[1].children;
                var buttonLoadMoreIndex = elements.length - 1
                var buttonLoadMore = elements[buttonLoadMoreIndex].children[1].children[0]
                if (buttonLoadMore != undefined) {
                    buttonLoadMore.click();
                }
                document.getElementById("counterForButtonCourses").innerText = t
                t++;
                if (t < 1000000 && buttonLoadMore != undefined) {
                    myLoop();
                } else {
                    for (var element of elements) {
                        if (element.__ngContext__[21].status === "satisfied") {
                            var closedDateTimeYear = element.__ngContext__[21].closedDateTimeUtc._a[0];
                            var closedDateTimeMonth = element.__ngContext__[21].closedDateTimeUtc._a[1];
                            var closedDateTimeDay = element.__ngContext__[21].closedDateTimeUtc._a[2];

                            var courseInfo = {
                                login: learnerLogin,
                                courseTitle: element.__ngContext__[21].courseTitle,
                                status: element.__ngContext__[21].status,
                                deliveredBy: element.__ngContext__[21].deliveredBy,
                                closedDateTimeUtc: closedDateTimeMonth + "/" + closedDateTimeDay + "/" + closedDateTimeYear,
                            }
                            var longString = courseInfo.login + ";" + courseInfo.courseTitle + ";" + courseInfo.status + ";" + courseInfo.deliveredBy + ";" + courseInfo.closedDateTimeUtc
                            outString = longString + "\n" + outString
                        }

                    }
                    GM_setClipboard (outString);
                    alert("Process has been completed!")
                }
            }, 1000)
        }

        myLoop();
    }
}

setTimeout(() => {
    var zNode = document.createElement ('li');
    zNode.innerHTML = '<button id="buttonCourses" type="button"> Get courses data</button>';
    zNode.setAttribute ('id', 'buttonCourses');
    document.getElementsByClassName('tabnav-list')[0].appendChild(zNode);
    document.getElementById("buttonCourses").addEventListener (
        "click", test, false
    );

    var yNode = document.createElement ('li');
    yNode.innerHTML = '<span id="counterForButtonCourses" style="color: #fff"></span>';
    document.getElementsByClassName('tabnav-list')[0].appendChild(yNode);
}, "2000");