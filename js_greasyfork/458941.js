// ==UserScript==
// @name         Gmail Swithcing
// @author       Saiful Islam
// @version      0.7
// @description  Changes Gmail from Login Page
// @namespace    https://github.com/AN0NIM07
// @match        https://accounts.google.com/o/*
// @downloadURL https://update.greasyfork.org/scripts/458941/Gmail%20Swithcing.user.js
// @updateURL https://update.greasyfork.org/scripts/458941/Gmail%20Swithcing.meta.js
// ==/UserScript==

/* eslint-env es6 */
/* eslint no-var: "error" */
/* eslint indent: ['error', 2] */
(function() {

    //window.localStorage.removeItem("RowNumber");
    //localStorage.setItem("RowNumber", 0);
   // return;

    if(localStorage.getItem("EmailChangeBasedOnRange") === null || parseInt(localStorage.getItem("EmailChangeBasedOnRange")) == 0)
    {
         var i = 0;

        if (localStorage.getItem("GmailNumber") === null || parseInt(localStorage.getItem("GmailNumber")) < 1 || parseInt(localStorage.getItem("GmailNumber")) > 10 || parseInt(localStorage.getItem("GmailNumber")) === 10) {
            localStorage.setItem("GmailNumber", 1);
            i = 1;
        }
        else if (parseInt(localStorage.getItem("GmailNumber")) > 0 && parseInt(localStorage.getItem("GmailNumber")) < 10) {
            i = parseInt(localStorage.getItem("GmailNumber"));
            i = i+1;
            localStorage.setItem("GmailNumber", i);
        }


        console.log("Email No in Regular Change: "+ i);
        var j= i;
        j = j+1;
		let info = '';
		try
		{
			info = document.querySelector("#view_container > div > div > div.pwWryf.bxPAYd > div > div.WEQkZc > div > form > span > section > div > div > div > div > ul > li:nth-child("+ j + ") > div").textContent;
		}
		catch (e)
		{
			info = document.querySelector("#yDmH0d > div.gfM9Zd > div.tTmh9.NQ5OL > div.SQNfcc.WbALBb > div > div > div.Anixxd > div > div > div.HvrJge > form > span > section > div > div > div > div > ul > li:nth-child("+ j +") > div").textContent;
		}
        

        if(info != "Use another account")
        {
            sleep(120000)
                .then(() => clickOnMail(i))
        }
        else
        {
            localStorage.setItem("GmailNumber", 0);
            sleep(120000)
                .then(() => clickOnMail(i))
        }
    }
    else if(parseInt(localStorage.getItem("EmailChangeBasedOnRange")) == 1)
    {
        var startFrom = parseInt(localStorage.getItem("StartingNumberOfRange"));
        var EndAt = parseInt(localStorage.getItem("EndingNumberOfRange"));
        var n = 0;

        if(localStorage.getItem("gmailCounterInRange") === null || parseInt(localStorage.getItem("gmailCounterInRange")) >= EndAt || parseInt(localStorage.getItem("gmailCounterInRange")) < startFrom)
        {
            localStorage.setItem("gmailCounterInRange", startFrom);
            n = startFrom;
        }
        else if(parseInt(localStorage.getItem("gmailCounterInRange")) >= startFrom && parseInt(localStorage.getItem("gmailCounterInRange")) < EndAt )
        {
            n = parseInt(localStorage.getItem("gmailCounterInRange"));
            n = n+1;
            localStorage.setItem("gmailCounterInRange", n);
        }

        console.log("Email No in Range Changing: "+ n);

        if(n!= EndAt)
        {
            sleep(120000)
                .then(() => document.querySelector("#view_container > div > div > div.pwWryf.bxPAYd > div > div.WEQkZc > div > form > span > section > div > div > div > div > ul > li:nth-child("+ n + ") > div").click())
        }
        else if( n == EndAt)
        {
            startFrom = startFrom - 1;
            localStorage.setItem("gmailCounterInRange", startFrom);
            sleep(120000)
                .then(() => document.querySelector("#view_container > div > div > div.pwWryf.bxPAYd > div > div.WEQkZc > div > form > span > section > div > div > div > div > ul > li:nth-child("+ n + ") > div").click())
        }

    }
    return;


    function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function clickOnMail(i)
{
    try
    {
        document.querySelector("#view_container > div > div > div.pwWryf.bxPAYd > div > div.WEQkZc > div > form > span > section > div > div > div > div > ul > li:nth-child("+ i + ") > div").click();
    }
    catch (e)
    {
        document.querySelector("#yDmH0d > div.gfM9Zd > div.tTmh9.NQ5OL > div.SQNfcc.WbALBb > div > div > div.Anixxd > div > div > div.HvrJge > form > span > section > div > div > div > div > ul > li:nth-child("+ i + ") > div").click();
    }
}



})();