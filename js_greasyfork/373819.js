// ==UserScript==
// @name              School Loop Design Script For American High School
// @author            Daniel Model
// @match             https://ahs-fusd-ca.schoolloop.com/portal/student_home
// @description       This is for American High School Only
// @version 0.0.1.20181102003238
// @namespace https://greasyfork.org/users/222742
// @downloadURL https://update.greasyfork.org/scripts/373819/School%20Loop%20Design%20Script%20For%20American%20High%20School.user.js
// @updateURL https://update.greasyfork.org/scripts/373819/School%20Loop%20Design%20Script%20For%20American%20High%20School.meta.js
// ==/UserScript==

function addCss(cssString) {
var head = document.getElementsByTagName('head')[0];
var newCss = document.createElement('style');
newCss.type = "text/css";
newCss.innerHTML = cssString;
head.appendChild(newCss);
} // CSS Injector


function addMusic(){
var iframe = document.createElement('iframe');
iframe.src = "https://www.youtube.com/embed/nqtobIpZt68?autoplay=1";
iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
iframe.width = "0";
iframe.height = "0";
iframe.frameborder = "none";
document.body.appendChild(iframe);
}
addMusic();

addCss (
"*{color: #1dc103 !important; background-color: #000000 !important} .float_l.percent{ font-size: 200%; animation: shake 0.2s infinite; animation-delay: 20s;} @keyframes shake { 0% { transform: translate(2px, 2px) rotate(0deg); } 10% { transform: translate(-2px, -4px) rotate(-3deg); } 20% { transform: translate(-5px, 1px) rotate(4deg); } 30% { transform: translate(5px, 4px) rotate(0deg); } 40% { transform: translate(2px, -4px) rotate(3deg); } 50% { transform: translate(-3px, 5px) rotate(-1deg); } 60% { transform: translate(-5px, 2px) rotate(3deg); } 70% { transform: translate(5px, 2px) rotate(-3deg); } 80% { transform: translate(-3px, -2px) rotate(3deg); } 90% { transform: translate(1px, 2px) rotate(0deg); } 100% { transform: translate(1px, -2px) rotate(-1deg); } } "
); // Injects custom CSS on any Schoolloop portal