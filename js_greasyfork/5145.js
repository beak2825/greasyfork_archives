// ==UserScript==
// @name       It's Broke
// @version    0.1
// @description Force submit broken hits.
// @author     Cristo
// @include       *
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/710
// @downloadURL https://update.greasyfork.org/scripts/5145/It%27s%20Broke.user.js
// @updateURL https://update.greasyfork.org/scripts/5145/It%27s%20Broke.meta.js
// ==/UserScript==


//Turn on the script, go to the broken hit and hit the ~ key. Solve the math problem and it might submit.




if (window.location != window.parent.location) {
    document.addEventListener( "keydown", kas, false);
    function kas(i) {
        if (i.keyCode == 192) { // ~ Key
            var form = document.getElementsByTagName("form")[0];
            var randomnumber1 = Math.floor(Math.random() * (15 - 1 + 1)) + 1;
            var randomnumber2 = Math.floor(Math.random() * (13 - 3 + 1)) + 3;
            var added = prompt(randomnumber1+"+"+randomnumber2+"=");  
            if (added==(randomnumber1+randomnumber2)) {
                console.log(form.id);
                document.getElementById(form.id).submit();
            } else {
                alert("Incorrect");
            }
        }
    }
}