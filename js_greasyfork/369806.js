// ==UserScript==
// @name         GDSF Auto Study
// @namespace    https://emzee.be/
// @version      1.0.0
// @description  Jump to next GDSF class after completion
// @author       Maddie
// @match        http://xfks-study.gdsf.gov.cn/*
// @require      https://cdn.bootcss.com/jquery/3.1.0/jquery.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/369806/GDSF%20Auto%20Study.user.js
// @updateURL https://update.greasyfork.org/scripts/369806/GDSF%20Auto%20Study.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var username = '姚晓星';
    var mobile = '18680663633';

    // Fill in username and mobile on login page
    if (location.pathname == '/' || location.pathname.indexOf('login') !== -1) {
        $('[name="userName"]').val(username);
        $('[name="mobile"]').val(mobile);
        return
    }

    var sortedParents = ["10359", "10365", "10371", "10375", "10379", "10380", "10386", "10401"];
    var classMap = {
        "10359": ["10361", "10362", "10363", "10370", "10504", "10505"],
        "10365": ["10366", "10367", "10368", "10369"],
        "10371": ["10372", "10373", "10374"],
        "10375": ["10376", "10377", "10378"],
        "10379": ["10381", "10384", "10385"],
        "10380": ["10382", "10383"],
        "10386": ["10387"],
        "10401": ["10426", "10427", "10428", "10429", "10430"],
    };

    // Counter for minutes reference
    var pollCounter = 0;
    var timer;

    // Check when in chapter
    if (location.pathname.indexOf('chapter') !== -1) {
        setTimeout(function() {
            checkForCompletion();
            pollCounter++;

            timer = setInterval(function() {
                checkForCompletion();
                pollCounter++;
            }, 60000);
        }, 5000);
    }

    // Do actual work
    function checkForCompletion() {
        var arr = location.pathname.split("/");
        var currentClassParent = arr[arr.length-3];
        var currentClassId = arr[arr.length-1];

        console.log("Current class parent: " + currentClassParent);
        console.log("Current class ID: " + currentClassId);
        console.log("Polling for completion, current counter: " + pollCounter);

        var completed = $(".chapter-score").hasClass("chapter-score-suc");
        //console.log("Completed: " + completed);

        if (completed) {
            console.log("Change needed, checking for next class.");
            var currentParentIndex = sortedParents.indexOf(currentClassParent);
            var currentClassList = classMap[currentClassParent];
            var newClassIndex = currentClassList.indexOf(currentClassId) + 1;
            console.log("Current class list: " + currentClassList + ", length " + currentClassList.length);
            console.log("New class index: " + newClassIndex);

            if (newClassIndex >= currentClassList.length) {
                console.log("Current class list is over, turning to next one.");
                var newParentIndex = currentParentIndex + 1;
                var newParent = sortedParents[newParentIndex];
                console.log("New parent: index " + newParentIndex + ", ID " + newParent);
                if (newParentIndex >= sortedParents.length) {
                    console.log("Wrapped around!");
                    jumpToClass(0, 0);
                    return
                }

                var newClassMap = classMap[newParent];
                console.log("New class map: " + newClassMap);
                jumpToClass(newParentIndex, 0);
                return
            } else {
                console.log("Current class list is not over, proceeding to next one.");
                jumpToClass(currentParentIndex, newClassIndex);
            }
        } else {
            console.log("Not completed yet, waiting.");
        }
    }

    // Jump to next class
    function jumpToClass(parentIdx, classIdx) {
        var parentId = sortedParents[parentIdx];
        var classId = classMap[parentId][classIdx];
        console.log("Jumping to next location, parent ID " + parentId + ", class ID " + classId);
        var path = "/study/course/"+parentId+"/chapter/"+classId;
        console.log("New path: " + path);
        clearInterval(timer);
        if (parentId && classId) {
            setTimeout(function() {
                location.pathname = path;
            }, 5000);
        }
    }
})();