// ==UserScript==
// @name        ymrh - 91huayi.com
// @namespace   Violentmonkey Scripts
// @match       https://nlts.91huayi.com/Exercise/ExerciseCourse/CoursePlay
// @grant       小小梁
// @version     1.1
// @author      -
// @description 2023/12/1 19:32:23
// @downloadURL https://update.greasyfork.org/scripts/481309/ymrh%20-%2091huayicom.user.js
// @updateURL https://update.greasyfork.org/scripts/481309/ymrh%20-%2091huayicom.meta.js
// ==/UserScript==
window.onload=(function () {
         setTimeout(function () {

        function skip() {
            let video = document.getElementsByTagName('video')
            for (let i=0; i<video.length; i++) {
                video[i].currentTime = video[i].duration
            }
        }
        setInterval(skip,200)


        // document.querySelector("#content > div > form > div.hy-list > div.kc-detail1-1 > div.kc-detail1-2 > div > a").click()
         },3000)

        setTimeout(function () {

         window.close()

         },6000)

        }

)();