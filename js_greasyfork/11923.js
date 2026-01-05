// ==UserScript==
// @name       Reminder 
// @namespace  
// @version    0.0.3
// @description  To remind you to be more productive
// @include     *facebook.com*
// @include     *reddit.com*
// @include     *mturkgrind.com*
// @include     *godlikeproductions.com*
// @include     *twitter.com*
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/11923/Reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/11923/Reminder.meta.js
// ==/UserScript==



/*This will pop up each time you refresh the listed pages if it's after a certain time. 
You can edit the time by changing the n > 12 to be anything in military time. 
You can edit the code to say something else if you have different goals
Upcoming update: Have it only pop up three times per day or not pop up when you answer yes. 
If you'd like to add more sites for it to pop up on under the include put *www.thewebsitehere.com* 
Another upcoming update: not requiring lowercase answer. */


var d = new Date();
var n = d.getHours();
    

    if (n > 12) {
       var answer = confirm("Did you study (code or language) or turk/work today?? Ok for yes, cancel for no");
       if (answer){
           alert("Good job!! Go have fun!");
       } else if (!answer) {
           alert("Then get out of here and get to it.");
       } else {
           alert("That's not a valid answer");
       }
}