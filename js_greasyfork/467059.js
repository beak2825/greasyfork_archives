// ==UserScript==
// @name            getCanvasCourseCode
// @name:en         getCanvasCourseCode
// @name:zh         获取Canvas课程代码
// @namespace       getCanvasCourseCode
// @match           *://*canvas*/courses
// @grant           none
// @version         1.1.2
// @author          wznmickey
// @description:en  get Canvas Course Code and show on the top of the page
// @description:zh  获取Canvas课程代码并展示在页面顶部
// @license         Apache License 2.0
// @language    
// @description getCanvasCourseCode and show on the top of the page
// @downloadURL https://update.greasyfork.org/scripts/467059/getCanvasCourseCode.user.js
// @updateURL https://update.greasyfork.org/scripts/467059/getCanvasCourseCode.meta.js
// ==/UserScript==
function getCode() {
    try {
        temp = document.getElementsByClassName("course-list-table-row");
        data = [];
        for (let i = 0; i < temp.length; i++) {
            try {
                url = temp[i].getElementsByClassName("course-list-course-title-column")[0].lastElementChild;
                x = url.href.split("/");
                y = x[x.length - 1]
                data.push(Number(y));
            }
            catch (err) {
                console.log(err);
            }
        }
        ans = { "courseIDs": data };
        return JSON.stringify(ans);
    }
    catch (err) {

    }
}
function showID(st) {
    x = document.createElement("div");
    x.innerHTML = st;
    y = document.getElementsByClassName("header-bar")[0].parentNode;
    y.insertBefore(x, document.getElementsByClassName("header-bar")[0]);
    console.log(st);
}
showID(getCode());

