// ==UserScript==
// @name         GetCourseVideo
// @namespace    http://tampermonkey.net/
// @version      2024-04-28-2
// @description  a simple script to get course video
// @author       Cedric
// @match        http://219.223.238.14:88/ve/back/rp/common/rpIndex.shtml?method=getStudyCourseLiveList*
// @icon         https://img.icons8.com/?size=100&id=35090&format=png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493514/GetCourseVideo.user.js
// @updateURL https://update.greasyfork.org/scripts/493514/GetCourseVideo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var currentUrl = window.location.href;

    var urlParams = new URLSearchParams(currentUrl);

    var courseId = urlParams.get('courseId');
    var courseNum = urlParams.get('courseNum');
    var fzId = urlParams.get('fzId');

    var checkboxContainer = document.createElement("div");
    checkboxContainer.id = "publicRpTypeContainer";

    var checkbox1 = createCheckbox("1", "front", false);
    var checkbox2 = createCheckbox("2", "back", true);
    var checkbox3 = createCheckbox("3", "computer", true);

    checkboxContainer.appendChild(checkbox1);
    checkboxContainer.appendChild(checkbox2);
    checkboxContainer.appendChild(checkbox3);

    checkboxContainer.style.position = "fixed";
    checkboxContainer.style.top = "20px";
    checkboxContainer.style.right = "20px";

    document.body.appendChild(checkboxContainer);

    function createCheckbox(value, label, checked) {
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = value;
        checkbox.checked = checked;

        var checkboxLabel = document.createElement("label");
        checkboxLabel.textContent = label;
        checkboxLabel.style.color = "white";

        var checkboxWrapper = document.createElement("div");
        checkboxWrapper.appendChild(checkbox);
        checkboxWrapper.appendChild(checkboxLabel);

        return checkboxWrapper;
    }

    var aTags = document.getElementsByTagName('a');

   for (var i = 0; i < aTags.length; i++) {
        var aTag = aTags[i];
        var onclickValue = aTag.getAttribute('onclick');
        if (onclickValue) {
            var match = onclickValue.match(/getStuControlType\('([^']+)'/);
            if (match) {
                var rpId = match[1];
                aTag.onclick = (function(rpId) {
                    return function() {
                        var publicRpTypeValues = [];
                        var checkboxes = checkboxContainer.querySelectorAll("input[type='checkbox']");
                        for (var j = 0; j < checkboxes.length; j++) {
                            if (checkboxes[j].checked) {
                                publicRpTypeValues.push(checkboxes[j].value);
                            }
                        }
                        var publicRpType = publicRpTypeValues.length > 0 ? publicRpTypeValues.join(",") : "0";
                        var targetUrl = "../../../back/rp/common/rpIndex.shtml?method=studyCourseDeatil&courseId="+courseId+"&dataSource=1&courseNum="+courseNum+"&fzId="+fzId+"&rpId="+rpId+"&publicRpType="+publicRpType;

                        window.open(targetUrl);
                    };
                })(rpId);
            }
        }
    }
})();