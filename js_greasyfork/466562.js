// ==UserScript==
// @name         Dim Kemono Usertag if not updated today
// @namespace
// @version      1.0
// @description  Will dim all usertags on the "Fav" page if they have not been updated today (Uses date from first usertag)
// @author       Barrett
// @match        *://kemono.party/favorites
// @match        *://coomer.party/*/user/*/post/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kemono.party
// @grant        none
// @license      Unlicense
// @namespace https://greasyfork.org/users/232210
// @downloadURL https://update.greasyfork.org/scripts/466562/Dim%20Kemono%20Usertag%20if%20not%20updated%20today.user.js
// @updateURL https://update.greasyfork.org/scripts/466562/Dim%20Kemono%20Usertag%20if%20not%20updated%20today.meta.js
// ==/UserScript==


(function()
{
	'use strict';																							//
	var jQuery = window.jQuery;																				//
	var favTimer = setInterval(favFunction, 100);															//Repeats func until it runs (Waiting for jQuery to load in)
	var firstDateOnPage;																					//Holds date from today
    var userName;																							//Temp username holder
    var timeStamp;																							//Temp timestamp holder
    var dataArray = new Array();																						//Holds above info

	function favFunction()
	{
		if ($().jquery.length > 0)																			//Wait till jQuery loaded in
		{

            //$(".user-card").css("max-width","300px");														//Just makes things more compact

            if (!getCookie("usersVisitedToday"))															//Deals with the cookie which holds items from the last 15 hours
            {																								//
                console.log("Cookie expired - setting new cookie...");										//
                setCookie('usersVisitedToday',);															//
            }																								//
            else																							//
            {																								//
                console.log("Cookie exists already, current value = " + getCookie("usersVisitedToday"));	//
                dataArray.push(getCookie("usersVisitedToday"));												//
            }																								//


			firstDateOnPage = $(".timestamp").eq(0).text().split(" ")[6];											//Deals with lowering opacity of items from yesterday
			for (let i = 0; i < $(".timestamp").length; i++)														//
			{																										//
				if ($(".timestamp").eq(i).text().indexOf(firstDateOnPage) >= 0)										//If item has today's date
				{																									//
					userName = $(".timestamp").eq(i).parents().eq(1).children().eq(1).text();						//Get username
                    timeStamp = $(".timestamp").eq(i).text().split(" ")[7].slice(0,-1);								//Get timestamp (If timestamp changes, it means updates were made and it should be set to 100% opacity again)



                    if (getCookie("usersVisitedToday").indexOf(timeStamp) > -1)										//If timestamp already stored from earlier
                    {
                        $(".timestamp").eq(i).closest(".user-card").css("opacity", "20%");		//Set opacity low
                    }
                    else
                    {
                        dataArray.push([userName,timeStamp]);													//Store timestamp as seen, so it's opacity is lowered next time you visit

                    }

                    //if (getCookie("usersVisitedToday"))
                    //setCookie('usersVisitedToday',getCookie("usersVisitedToday") + ",['"+userName+"','"+timeStamp+"']");//Put information into the cookie
				}																									//
				else																								//If item does not have today's date
				{																									//
					$(".timestamp").eq(i).closest(".user-card").css("opacity", "20%");								//Lower its opacity to make it clearer what the latest items are
				}																									//
			}																										//

if (dataArray.length > 0)
{
setCookie('usersVisitedToday',dataArray);
}


		}
        //console.log("dataArray = " + dataArray);
        //console.log("dataArray = " + dataArray[0]);
		console.log("getCookie('usersVisitedToday') = " + getCookie("usersVisitedToday"));
        clearInterval(favTimer);																			//Stop running after you're through
	}


function setCookie(key, value) {
    var expires = new Date();
    expires.setTime(expires.getTime() + 54000000); //(54000000 == 15 hours / 60000 == 1 minute) Cookie set to expire every *15 hours* from initial setting (https://www.unitjuggler.com/convert-time-from-min-to-ms.html)
    document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
}

function getCookie(key) {
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
}


})();