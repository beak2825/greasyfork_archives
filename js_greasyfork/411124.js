// ==UserScript==
// @name        复旦选课辅助脚本
// @namespace   cloudkitty
// @match       https://xk.fudan.edu.cn/xk/stdElectCourse!defaultPage.action
// @grant       none
// @version     1.2
// @require     https://cdn.bootcdn.net/ajax/libs/jquery/1.12.4/jquery.min.js
// @author      w568w
// @grant       unsafeWindow
// @description 可以隐藏一些不会选的课程，仅适用于复旦选课页面！
// @downloadURL https://update.greasyfork.org/scripts/411124/%E5%A4%8D%E6%97%A6%E9%80%89%E8%AF%BE%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/411124/%E5%A4%8D%E6%97%A6%E9%80%89%E8%AF%BE%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
var searchLessons = new Array();
var selectedLessons = new Array();
function contains(lesson) {
    for (var key in unsafeWindow.selected) {
        if (key == lesson['id']) {
            return true;
        }
    }
    return false;
}
function deepClone(obj) {
    var objClone = Array.isArray(obj) ? [] : {};
    if (obj && typeof obj === "object") {
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (obj[key] && typeof obj[key] === "object") {
                    objClone[key] = deepClone(obj[key]);
                } else {
                    objClone[key] = obj[key];
                }
            }
        }
    }
    return objClone;
}
function isConflict(selectedLessons, lessonArrangeInfo) {
    for (var index in selectedLessons) {
        for (var key in selectedLessons[index].arrangeInfo) {
            if (selectedLessons[index].arrangeInfo[key].weekDay == lessonArrangeInfo.weekDay) {
                if (!((selectedLessons[index].arrangeInfo[key].startUnit > lessonArrangeInfo.endUnit) ||
                    (selectedLessons[index].arrangeInfo[key].endUnit < lessonArrangeInfo.startUnit)
                )) {
                    return true;
                }
            }
        }
    }
    return false;
}
function refreshLessonCache() {
    searchLessons = new Array();
    selectedLessons = new Array();
    for (var ss in unsafeWindow.lessonJSONs) {
        if (contains(unsafeWindow.lessonJSONs[ss])) {
            selectedLessons.push(unsafeWindow.lessonJSONs[ss]);
        } else {
            searchLessons.push(unsafeWindow.lessonJSONs[ss]);
        }
    }
}
$(document).ready(function () {
    'use strict';
    unsafeWindow.selected = deepClone(unsafeWindow.lessonId2Counts);
    var duplicateButton = document.createElement("button");
    duplicateButton.innerHTML = "去除时间重叠的课/Remove overlapping lessons";
    duplicateButton.onclick = function () {
        refreshLessonCache();
        console.log(searchLessons);
        for (var index in searchLessons) {
            for (var key in searchLessons[index].arrangeInfo) {
                if (isConflict(selectedLessons, searchLessons[index].arrangeInfo[key])) {
                    document.getElementById("lesson" + searchLessons[index]['id']).style.visibility = "hidden";
                    break;
                }
            }
        }
    }
    $("#electDescription").append(duplicateButton);

    var essayButton = document.createElement("button");
    essayButton.innerHTML = "去除期末考论文的课/Remove lessons requiring an essay";
    essayButton.onclick = function () {
        refreshLessonCache();
        for (var index in searchLessons) {
            if (searchLessons[index].examFormName == "论文") {
                document.getElementById("lesson" + searchLessons[index]['id']).style.visibility = "hidden";
            }
        }
    }
    $("#electDescription").append(essayButton);

    var fullButton = document.createElement("button");
    fullButton.innerHTML = "去除人数已满的课/Remove full lessons";
    fullButton.onclick = function () {
        refreshLessonCache();
        for (var index1 in searchLessons) {
            for (var index2 in unsafeWindow.lessonId2Counts) {
                if (index2 == searchLessons[index1]['id'] && unsafeWindow.lessonId2Counts[index2]['lc'] == unsafeWindow.lessonId2Counts[index2]['sc']) {
                    document.getElementById("lesson" + searchLessons[index1]['id']).style.visibility = "hidden";
                }
            }
        }
    }
    $("#electDescription").append(fullButton);
});