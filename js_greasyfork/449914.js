// ==UserScript==
// @name         OneTapBigStudy
// @namespace    http://xjtudj.edu.cn/
// @version      0.1
// @description  One Tap XJTUDJ study
// @author       anonymous
// @match        http://xjtudj.edu.cn/course_detail.html*
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/449914/OneTapBigStudy.user.js
// @updateURL https://update.greasyfork.org/scripts/449914/OneTapBigStudy.meta.js
// ==/UserScript==



(function() {
    'use strict';
    window.safePost('/partyconstruction/client/course/getLearnedHistory',
        {
            "courseId": window.courseId,
            "coursewareId": window.coursewareId,
            "progress": 0
        },
        function (res) {
            window.safePost('/partyconstruction/client/course/setFinished',
                    {
                        "courseId": window.courseId,
                        "coursewareId": window.coursewareId,
                        "progress": res.data.mediaTime
                    },function (res){console.log(res);})
        })
})();