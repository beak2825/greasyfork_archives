// ==UserScript==
// @name         Five Marks
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  izi five
// @author       You
// @match        https://sgo.rso23.ru/angular/school/studentdiary/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411002/Five%20Marks.user.js
// @updateURL https://update.greasyfork.org/scripts/411002/Five%20Marks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function addJQuery(callback) {
        var script = document.createElement("script");
        script.setAttribute("src", "https://code.jquery.com/jquery-3.4.1.js");
        script.addEventListener('load', function() {
            var script = document.createElement("script");
            script.textContent = "(" + callback.toString() + ")();";
            document.body.appendChild(script);
        }, false);
        document.body.appendChild(script);
    }

    addJQuery(function(){
        setInterval(function(){
            $("div.level_data.one.two.three.four.five.mark").removeClass("quantity-points-0").addClass("quantity-points-1").html('<a href="#" ng-if="$ctrl.imageMarks" ng-repeat="assignWithMark in lesson.assignmentsWithMarks" ng-click="$ctrl.showAssignInfo(assignWithMark)" ng-class="{one: assignWithMark.mark.mark == 1, two: assignWithMark.mark.mark == 2, three: assignWithMark.mark.mark == 3, four: assignWithMark.mark.mark == 4, five: assignWithMark.mark.mark == 5, mark: assignWithMark.mark.dutyMark}" title="Ответ на уроке" class="ng-scope five"></a>');
        }, 20);
        });
    })();