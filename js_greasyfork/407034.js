// ==UserScript==
// @name       Pluralsight Continuous Play Next module
// @namespace  http://www.goldtect.com/
// @version    0.1
// @require      https://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @description  Pluralsight Continuous Play
// @match      https://app.pluralsight.com/course-player*
// @copyright  2019, Hulk.Yang
// @include https://app.pluralsight.com/course-player*
// @downloadURL https://update.greasyfork.org/scripts/407034/Pluralsight%20Continuous%20Play%20Next%20module.user.js
// @updateURL https://update.greasyfork.org/scripts/407034/Pluralsight%20Continuous%20Play%20Next%20module.meta.js
// ==/UserScript==


console.log('[start]Pluralsight Continuous Play');

window.setInterval(function(){
    //angular.element($0).scope().setPlaybackSpeed(3)；
    //console.log('checking...');
    function clickNextModule(){
        var nextButton = $('button:contains("Continue to next module")')
        if (nextButton && !nextButton.is(':hidden')) {
            nextButton.click();
        }else{
            console.log("not found next module button");
        }
    }
    clickNextModule()
},5000);