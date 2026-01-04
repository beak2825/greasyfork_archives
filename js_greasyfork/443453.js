// ==UserScript==
// @name        Google Classroom Productivity Boost
// @namespace   Violentmonkey Scripts
// @match       https://classroom.google.com/*
// @grant       none
// @version     3.2
// @author      Spiralshape21
// @icon        https://i.pinimg.com/originals/98/d3/a2/98d3a283f98cded8e639957e935bd373.png
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @license     MIT
// @description changes 'due tomorrow' to 'finish by today:'
// @downloadURL https://update.greasyfork.org/scripts/443453/Google%20Classroom%20Productivity%20Boost.user.js
// @updateURL https://update.greasyfork.org/scripts/443453/Google%20Classroom%20Productivity%20Boost.meta.js
// ==/UserScript==

// ============ START ============ //




function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async function(){
    'use strict';
    var found = false;
    var toTest, i;
    while (!found) {
        await sleep(100);

        toTest = document.querySelectorAll("h2");
        for (i=0; i<toTest.length; i++) {
            if (toTest[i].innerHTML == "Due today") {
                toTest[i].innerHTML = "Due today: (was to be done by yesterday)";
                found = true;
            }
        }
    }
})();





function slee(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async function(){
    'use strict';
    var found = false;
    var toTest, i;
    while (!found) {
        await slee(100);

        toTest = document.querySelectorAll("h2");
        for (i=0; i<toTest.length; i++) {
            if (toTest[i].innerHTML == "Due tomorrow") {
                toTest[i].innerHTML = "Finish by today:";
                found = true;
            }
        }
    }
})();





function a1(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async function(){
    'use strict';
    var found = false;
    var toTest, i;
    while (!found) {
        await a1(100);

        toTest = document.querySelectorAll("h2");
        for (i=0; i<toTest.length; i++) {
            if (toTest[i].innerHTML == "Due Monday") {
                toTest[i].innerHTML = "Finish by Sunday:";
                found = true;
            }
        }
    }
})();



function b2(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async function(){
    'use strict';
    var found = false;
    var toTest, i;
    while (!found) {
        await b2(100);

        toTest = document.querySelectorAll("h2");
        for (i=0; i<toTest.length; i++) {
            if (toTest[i].innerHTML == "Due Tuesday") {
                toTest[i].innerHTML = "Finish by Monday:";
                found = true;
            }
        }
    }
})();







function c3(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async function(){
    'use strict';
    var found = false;
    var toTest, i;
    while (!found) {
        await c3(100);

        toTest = document.querySelectorAll("h2");
        for (i=0; i<toTest.length; i++) {
            if (toTest[i].innerHTML == "Due Wednesday") {
                toTest[i].innerHTML = "Finish by Tuesday:";
                found = true;
            }
        }
    }
})();







function d4(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async function(){
    'use strict';
    var found = false;
    var toTest, i;
    while (!found) {
        await d4(100);

        toTest = document.querySelectorAll("h2");
        for (i=0; i<toTest.length; i++) {
            if (toTest[i].innerHTML == "Due Thursday") {
                toTest[i].innerHTML = "Finish by Wednesday:";
                found = true;
            }
        }
    }
})();






function e5(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async function(){
    'use strict';
    var found = false;
    var toTest, i;
    while (!found) {
        await e5(100);

        toTest = document.querySelectorAll("h2");
        for (i=0; i<toTest.length; i++) {
            if (toTest[i].innerHTML == "Due Friday") {
                toTest[i].innerHTML = "Finish by Thursday:";
                found = true;
            }
        }
    }
})();








function f6(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async function(){
    'use strict';
    var found = false;
    var toTest, i;
    while (!found) {
        await f6(100);

        toTest = document.querySelectorAll("h2");
        for (i=0; i<toTest.length; i++) {
            if (toTest[i].innerHTML == "Due Saturday") {
                toTest[i].innerHTML = "Finish by Friday:";
                found = true;
            }
        }
    }
})();






function g7(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async function(){
    'use strict';
    var found = false;
    var toTest, i;
    while (!found) {
        await g7(100);

        toTest = document.querySelectorAll("h2");
        for (i=0; i<toTest.length; i++) {
            if (toTest[i].innerHTML == "Due Sunday") {
                toTest[i].innerHTML = "Finish by Saturday:";
                found = true;
            }
        }
    }
})();


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async function(){
    'use strict';
    var found = false;
    var toTest, i;
    while (!found) {
        await sleep(100);

        toTest = document.querySelectorAll("h2");
        for (i=0; i<toTest.length; i++) {
            if (toTest[i].innerHTML == "Due today") {
                toTest[i].innerHTML = "Due today: (was to be done by yesterday)";
                found = true;
            }
        }
    }
})();





function slee(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async function(){
    'use strict';
    var found = false;
    var toTest, i;
    while (!found) {
        await slee(100);

        toTest = document.querySelectorAll("h2");
        for (i=0; i<toTest.length; i++) {
            if (toTest[i].innerHTML == "Due tomorrow") {
                toTest[i].innerHTML = "Finish by today:";
                found = true;
            }
        }
    }
})();










//CONCRATS//



function sleed(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
 
(async function(){
    'use strict';
    var found = false;
    var toTest, i;
    while (!found) {
        await sleed(100);
 
        toTest = document.querySelectorAll("span");
        for (i=0; i<toTest.length; i++) {
            if (toTest[i].innerHTML == "Woohoo, no work due soon!") {
                toTest[i].innerHTML = "Woohoo, no work due soon! Pat yourself on the back, why don't you?";
                found = true;
            }
        }
    }
})();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async function(){
    'use strict';
    var found = false;
    var toTest, i;
    while (!found) {
        await sleep(100);

        toTest = document.querySelectorAll("h2");
        for (i=0; i<toTest.length; i++) {
            if (toTest[i].innerHTML == "Due today") {
                toTest[i].innerHTML = "Due today: (was to be done by yesterday)";
                found = true;
            }
        }
    }
})();





function slee(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async function(){
    'use strict';
    var found = false;
    var toTest, i;
    while (!found) {
        await slee(100);

        toTest = document.querySelectorAll("h2");
        for (i=0; i<toTest.length; i++) {
            if (toTest[i].innerHTML == "Due tomorrow") {
                toTest[i].innerHTML = "Finish by today:";
                found = true;
            }
        }
    }
})();





function a1(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async function(){
    'use strict';
    var found = false;
    var toTest, i;
    while (!found) {
        await a1(100);

        toTest = document.querySelectorAll("h2");
        for (i=0; i<toTest.length; i++) {
            if (toTest[i].innerHTML == "Due Monday") {
                toTest[i].innerHTML = "Finish by Sunday:";
                found = true;
            }
        }
    }
})();



function b2(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async function(){
    'use strict';
    var found = false;
    var toTest, i;
    while (!found) {
        await b2(100);

        toTest = document.querySelectorAll("h2");
        for (i=0; i<toTest.length; i++) {
            if (toTest[i].innerHTML == "Due Tuesday") {
                toTest[i].innerHTML = "Finish by Monday:";
                found = true;
            }
        }
    }
})();







function c3(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async function(){
    'use strict';
    var found = false;
    var toTest, i;
    while (!found) {
        await c3(100);

        toTest = document.querySelectorAll("h2");
        for (i=0; i<toTest.length; i++) {
            if (toTest[i].innerHTML == "Due Wednesday") {
                toTest[i].innerHTML = "Finish by Tuesday:";
                found = true;
            }
        }
    }
})();







function d4(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async function(){
    'use strict';
    var found = false;
    var toTest, i;
    while (!found) {
        await d4(100);

        toTest = document.querySelectorAll("h2");
        for (i=0; i<toTest.length; i++) {
            if (toTest[i].innerHTML == "Due Thursday") {
                toTest[i].innerHTML = "Finish by Wednesday:";
                found = true;
            }
        }
    }
})();






function e5(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async function(){
    'use strict';
    var found = false;
    var toTest, i;
    while (!found) {
        await e5(100);

        toTest = document.querySelectorAll("h2");
        for (i=0; i<toTest.length; i++) {
            if (toTest[i].innerHTML == "Due Friday") {
                toTest[i].innerHTML = "Finish by Thursday:";
                found = true;
            }
        }
    }
})();








function f6(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async function(){
    'use strict';
    var found = false;
    var toTest, i;
    while (!found) {
        await f6(100);

        toTest = document.querySelectorAll("h2");
        for (i=0; i<toTest.length; i++) {
            if (toTest[i].innerHTML == "Due Saturday") {
                toTest[i].innerHTML = "Finish by Friday:";
                found = true;
            }
        }
    }
})();






function g7(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async function(){
    'use strict';
    var found = false;
    var toTest, i;
    while (!found) {
        await g7(100);

        toTest = document.querySelectorAll("h2");
        for (i=0; i<toTest.length; i++) {
            if (toTest[i].innerHTML == "Due Sunday") {
                toTest[i].innerHTML = "Finish by Saturday:";
                found = true;
            }
        }
    }
})();


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async function(){
    'use strict';
    var found = false;
    var toTest, i;
    while (!found) {
        await sleep(100);

        toTest = document.querySelectorAll("h2");
        for (i=0; i<toTest.length; i++) {
            if (toTest[i].innerHTML == "Due today") {
                toTest[i].innerHTML = "Due today: (was to be done by yesterday)";
                found = true;
            }
        }
    }
})();





function slee(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async function(){
    'use strict';
    var found = false;
    var toTest, i;
    while (!found) {
        await slee(100);

        toTest = document.querySelectorAll("h2");
        for (i=0; i<toTest.length; i++) {
            if (toTest[i].innerHTML == "Due tomorrow") {
                toTest[i].innerHTML = "Finish by today:";
                found = true;
            }
        }
    }
})();