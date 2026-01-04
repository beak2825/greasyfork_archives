// ==UserScript==
// @name         Add attack to friends/enemies lists
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds an "attack" link to friends/enemies in Torn's list page
// @author       You
// @match        https://www.torn.com/*list.php
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/humanize-duration/3.17.0/humanize-duration.min.js
// @downloadURL https://update.greasyfork.org/scripts/528478/Add%20attack%20to%20friendsenemies%20lists.user.js
// @updateURL https://update.greasyfork.org/scripts/528478/Add%20attack%20to%20friendsenemies%20lists.meta.js
// ==/UserScript==
/* jshint -W097 */
/*global
    $, moment, humanizeDuration
*/
/* jshint ignore:end */

// InsertionQuery script starts here
// This script is responsible for animating elements that are inserted into the page.
var insertionQ=function(){"use strict"; 
    var m=100, t=!1, u="animationName", d="", n="Webkit Moz O ms Khtml".split(" "), e="", i=document.createElement("div"), s={strictlyNew:!0, timeout:20, addImportant:!1}; 
    if(i.style.animationName&&(t=!0),!1===t)for(var o=0;o<n.length;o++)if(void 0!==i.style[n[o]+"AnimationName"]){e=n[o],u=e+"AnimationName",d="-"+e.toLowerCase()+"-",t=!0;break}

    // Check if element has been previously animated
    function c(t){return s.strictlyNew&&!0===t.QinsQ} 

    // Insert keyframe animation styles dynamically for inserted elements
    function r(t,n){ 
        function e(t){t.animationName!==o&&t[u]!==o||c(t.target)||n(t.target)} 
        var i, o="insQ_"+m++, r=s.addImportant?" !important":""; 
        (i=document.createElement("style")).innerHTML="@"+d+"keyframes "+o+" {  from {  outline: 1px solid transparent  } to {  outline: 0px solid transparent }  }\n"+t+" { animation-duration: 0.001s"+r+"; animation-name: "+o+r+"; "+d+"animation-duration: 0.001s"+r+"; "+d+"animation-name: "+o+r+";  } ",document.head.appendChild(i); 
        var a=setTimeout(function(){document.addEventListener("animationstart",e,!1),document.addEventListener("MSAnimationStart",e,!1),document.addEventListener("webkitAnimationStart",e,!1)},s.timeout); 
        return{destroy:function(){clearTimeout(a),i&&(document.head.removeChild(i),i=null),document.removeEventListener("animationstart",e),document.removeEventListener("MSAnimationStart",e),document.removeEventListener("webkitAnimationStart",e)}}}

    // Mark element as inserted and animated
    function a(t){t.QinsQ=!0} 

    // Traverse DOM and animate any matching inserted element
    function f(t){if(t)for(a(t),t=t.firstChild;t;t=t.nextSibling)void 0!==t&&1===t.nodeType&&f(t)} 

    // Monitor and animate newly inserted elements
    function l(t,n){ 
        var e,i=[],o=function(){clearTimeout(e),e=setTimeout(function(){i.forEach(f),n(i),i=[]},10)};
        return r(t,function(t){if(!c(t)){a(t); var n=function t(n){return c(n.parentNode)||"BODY"===n.nodeName?n:t(n.parentNode)}(t); i.indexOf(n)<0&&i.push(n), o()}})}

    // Main insertionQuery interface
    function v(n){ 
        return!(!t||!n.match(/[^{}]/))&&(s.strictlyNew&&f(document.body),{every:function(t){return r(n,t)},summary:function(t){return l(n,t)}})}
    return v.config=function(t){for(var n in t)t.hasOwnProperty(n)&&(s[n]=t[n])},v}();
// InsertionQuery script ends here

(function() {
    'use strict';

    // Configure InsertionQuery with custom settings
    insertionQ.config({
        strictlyNew : false,  // Allow previously inserted elements to be processed
        timeout : 0           // Set no timeout for insertion detection
    });

    // Function to process the list of users and add an "attack" link
    function getAllUsers() {
        // Loop through each user in the blacklist section
        insertionQ('ul.user-info-blacklist-wrap').every(function(element) {
            // For each user, check their status and look for the "Okay" status
            $(element).children('li').each(function() {
                let child = $(this).find('.acc-body');
                let status = child.find('.status.left');
                let okayStatus = status.find('.user-green-status');

                // If the "Okay" status is found, generate an "Attack" link
                if (okayStatus.length) {
                    // Extract user ID from the data attribute
                    let name = $(this).find('a.user.name')[0].dataset.placeholder.split(" ");
                    let userId = name[1].slice(1,name[1].length).slice(0, name[1].length - 2);

                    // Create the attack link element
                    const attackSpan = document.createElement('span');
                    attackSpan.innerHTML = "<a href='https://www.torn.com/loader.php?sid=attack&user2ID="+userId+"' target='_blank'><span class='user-green-status '>Okay</span></a>";

                    // Replace the "Okay" status with the attack link
                    status[0].replaceChild(attackSpan, okayStatus[0]);
                }
            });
        });
    }

    // Call the function to add attack links to users
    getAllUsers();
})();
