// ==UserScript==
// @name        TM `My Products` width Expander
// @namespace   http://none.com
// @include     *sell.trademe.co.nz/*
// @version     1
// @description  Trademe `My products` Page width Expander
// @grant       GM_addStyle

/*
>> Description:

If you use trademe`s own cloud based `my products` auction listing software built into their
website, you will likely have been annoyed by the fact that only around 26 characters of your
auction title can fit into the column before being truncated by `...`

Most of this is due to trademe`s web developers thinking we still live in the stone age with
15 inch CRT monitors and as such they fix the website page width to around 950 pixels.

This script will widen the `my products` page and then use that extra space to expand your
action titles column so that more of the full text can be displayed.

the amount of increase is dependent on the horizontal resolution of your monitor and the
largest amount it will expand pages to is 1500 pixels.

The expansion amount can also be manually chosen using the manual expansion instructions in the code below.

*/
// @downloadURL https://update.greasyfork.org/scripts/10411/TM%20%60My%20Products%60%20width%20Expander.user.js
// @updateURL https://update.greasyfork.org/scripts/10411/TM%20%60My%20Products%60%20width%20Expander.meta.js
// ==/UserScript==

function main()
{
	var p1; var t1; var t2; var c1; var c2; var col; var temp;
	var x = window.screen.availWidth; var rResult;

/*
   
     -------------------- Manual expansion amount setting ----------------------

     There are 3 different levels of width adjustment: min , med and max.
     if you want to set the level manually instead of it being auto detected by your monitors 
     resolution, you can select the level below by editing the line below the end of these instructions

     (1) if you want to leave the expansion as auto detected, the line below should show as:
     	 var manualWidth = 0
    	
     (2) otherwise enter the level number as 1 to 3 (1 being minimum, 2 for medium level
         and 3 being the maximum level. eg:

         var manualWidth = 1 
         or
         var manualWidth = 2
         or
         var manualWidth = 3

         IMPORTANT: the line must be entered EXACT, including spaces, the lowercase `m` & the Uppercase `W`

    	 Note that if you select too high a level for your monitor, the trademe page will go off the
    	 right hand edge of your screen and you need to use the horizontal scroll bar to view the entire page.

     --------------------------- End of Instructions -----------------------------
	*/
//  adjust the number in the line below for manual width setting: (0=Auto width, 1=min level, 2=med level, 3=max level)
	var manualWidth = 0


	if (manualWidth == 3) 
	{ 
 		p1 = 1500; t1 = 450; t2 = 540; c1 = 40; c2 = 40;
	}

	if (manualWidth == 2)  
	{ 
		p1 = 1300; t1 = 390; t2 = 470; c1 = 30; c2 = 40;
	}

	if (manualWidth == 1)  
	{ 
		p1 = 1150; t1 = 300; t2 = 400; c1 = 30; c2 = 40;
	}


	if (manualWidth == 0 && x > 1670) 
	{ 
 		p1 = 1500; t1 = 450; t2 = 540; c1 = 40; c2 = 40;
	}

	if (manualWidth == 0 && x > 1399 && x < 1671)  
	{ 
		p1 = 1300; t1 = 390; t2 = 470; c1 = 30; c2 = 40;
	}

	if (manualWidth == 0 && x < 1400)  
	{ 
		p1 = 1150; t1 = 300; t2 = 400; c1 = 30; c2 = 40;
	}

	/// Body Page 

	GM_addStyle(".header row collapse {width:" + p1 + "px !important}");
	GM_addStyle(".inner include-foundation {width:" + p1 + "px !important}");

	// Top bar

	document.getElementById('content').setAttribute("style","width:" + p1 + "px");
	document.getElementById('organisation-nav').setAttribute("style","width:" + p1 + "px");


	// My products body
	document.getElementById('user-bar').setAttribute("style", "width:" + p1 + "px");
	document.getElementById('header').setAttribute("style","width:" + p1 + "px");
	document.getElementById('content-main').setAttribute("style", "width:" + p1 + "px");
	document.getElementById('content-body').setAttribute("style", "width:" + p1 + "px");

	GM_addStyle(".inner {width:" + p1 + "px !important}");
	GM_addStyle("table {width:" + p1 + "px !important}");

	GM_addStyle("table .col-29 {width" + t1 + "px !important}");  // expand title column
	GM_addStyle(".myproducts .product-info {width:" + t2 + "px !important}");
	GM_addStyle("table .col-5 {width:" + c1 + "px !important}");  // Shrink Stock Qty Column width
	GM_addStyle("table .col-6 {width:" + c1 + "px !important}");  // Shrink status Column width
	GM_addStyle("table .col-7 {width:" + c2 + "px !important}");  // Shrink promotions Column width
	GM_addStyle("table .col-3 {width:20px !important}");
	
}	

main()