// ==UserScript==
// @name        autonomnom - Tamara Berg - Identify If Images Correspond To General Categories
// @namespace   mkrobert
// @author mkrobert
// @description Autostart, keyboard shortcuts for 1 to 5 images, next button, and submit.
// @include     https://vision.cs.unc.edu/wliu/projects/*
// @version     1.01
// @grant       none
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @icon 	 http://mturkgrind.com/data/avatars/l/8/8874.jpg?1445404860
// @downloadURL https://update.greasyfork.org/scripts/13301/autonomnom%20-%20Tamara%20Berg%20-%20Identify%20If%20Images%20Correspond%20To%20General%20Categories.user.js
// @updateURL https://update.greasyfork.org/scripts/13301/autonomnom%20-%20Tamara%20Berg%20-%20Identify%20If%20Images%20Correspond%20To%20General%20Categories.meta.js
// ==/UserScript==
//Requester: https://www.mturk.com/mturk/searchbar?requesterId=A2ST2HIC0MRRNE&selectedSearchType=hitgroups
//Current HIT: https://www.mturk.com/mturk/preview?groupId=3SKITTYV050IREZCO78MG7PVPJY36F

runScript();
function runScript()
{
    /*
    Removed this section in 1.01 because it might be implicated in a bug causing an error message and being unable to do the HIT.
    $('#nopref').focus();
    $('#nopref').click();
    */

    window.onkeydown = function (e)
    {
        //autofocus  
        $('body > table > tbody > tr:nth-child(2) > td > div > div:nth-child(1) > table > tbody > tr:nth-child(1) > td > div > div > div:nth-child(1) > table > tbody > tr:nth-child(1) > td > div > div > table > tbody > tr:nth-child(3) > td > div > b > font').focus();

        if (e.keyCode === 49) //1 for image 1
            $('body > table > tbody > tr:nth-child(2) > td > div > div:nth-child(1) > table > tbody > tr:nth-child(1) > td > div > div > div:nth-child(1) > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(1) > div > img').click();
        if (e.keyCode === 50) //2 for image 2
            $('body > table > tbody > tr:nth-child(2) > td > div > div:nth-child(1) > table > tbody > tr:nth-child(1) > td > div > div > div:nth-child(1) > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > div > img').click();
        if (e.keyCode === 51) //3 for image 3
            $('body > table > tbody > tr:nth-child(2) > td > div > div:nth-child(1) > table > tbody > tr:nth-child(1) > td > div > div > div:nth-child(1) > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(3) > div > img').click();
        if (e.keyCode === 52) //4 for image 4
            $('body > table > tbody > tr:nth-child(2) > td > div > div:nth-child(1) > table > tbody > tr:nth-child(1) > td > div > div > div:nth-child(1) > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(4) > div > img').click();
        if (e.keyCode === 53) //5 for image 5
            $('body > table > tbody > tr:nth-child(2) > td > div > div:nth-child(1) > table > tbody > tr:nth-child(1) > td > div > div > div:nth-child(1) > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(5) > div > img').click();


        if (e.keyCode === 87) //w for previous
            $('body > table > tbody > tr:nth-child(2) > td > div > div:nth-child(1) > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > button').click();
        if (e.keyCode === 82) {//r for next
            $('body > table > tbody > tr:nth-child(2) > td > div > div:nth-child(1) > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(6) > button').focus();
            $('body > table > tbody > tr:nth-child(2) > td > div > div:nth-child(1) > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(6) > button').click();
        }


        //Submit
        if (e.keyCode === 84) {//t for submit
            $('body > table > tbody > tr:nth-child(2) > td > div > div:nth-child(1) > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(8) > button').click();
            $('body > div.gwt-DialogBox > div > table > tbody > tr.dialogMiddle > td.dialogMiddleCenter > div > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(1) > div > form > button').click();
        }
    }
}

