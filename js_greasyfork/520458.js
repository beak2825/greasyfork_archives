// ==UserScript==
// @name         Tinkercad INFO Text
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Brings up handy conversions & notes every time you login to TinkerCad
// @include     *tinkercad.com/*
// @license      MIT
// @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/520458/Tinkercad%20INFO%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/520458/Tinkercad%20INFO%20Text.meta.js
// ==/UserScript==

//        1/32 =  .031         = 0.787 mm
//        2/32 =  .063 (1/16)  = 1.600 mm
//        3/32 =  .094         = 2.387 mm
//        4/32 =  .125 (1/8)   = 3.175 mm
//        5/32 =  .156         = 3.962 mm
//        6/32 =  .188 (3/16)  = 4.775 mm
//        7/32 =  .219         = 5.562 mm
//        8/32 =  .25 (1/4)    = 6.35  mm
//        9/32 =  .281         = 7.137 mm
//       10/32 =  .313 (5/16)  = 7.950 mm
//       11/32 =  .344         = 8.737 mm
//       12/32 =  .375 (3/8)   = 9.525 mm
//       13/32 =  .406         = 10.312 mm
//       14/32 =  .438 (7/16)  = 11.125 mm
//       15/32 =  .469         = 11.912 mm
//       16/32 =  .5 (1/2)     = 12.7   mm
//       17/32 =  .531         = 13.487 mm
//       18/32 =  .563 (9/16)  = 14.300 mm
//       19/32 =  .594         = 15.087 mm
//       20/32 =  .625 (5/8)   = 15.875 mm
//       21/32 =  .656         = 16.662 mm
//       22/32 =  .688 (11/16) = 17.475 mm
//       23/32 =  .719         = 18.262 mm    => Minimum ID for 1/2" EMT slip-over. Very tight.
//       24/32 =  .75 (3/4)    = 19.05  mm
//       25/32 =  .781         = 19.837 mm
//       26/32 =  .813 (13/16) = 20.650 mm
//       27/32 =  .844         = 21.437 mm
//       28/32 =  .875 (7/8)   = 22.225 mm
//       29/32 =  .906         = 23.012 mm
//       30/32 =  .938 (15/16) = 23.825 mm
//       31/32 =  .969         = 24.612 mm
//       1     =  1.0          = 25.4   mm

/*  EMT  ID       OD
1/2"	15.8     17.9
3/4"	20.9     23.4
  1"	26.6     29.5

  Sch 40 Pipe
 Nominal size [inches] 	Outside diameter [inches] 	Outside diameter [mm]
1/8 inches 	                0.406 inches 	     	 	10.3 MM
1/4 inches  	 	 		0.539 inches 	 	 	 	13.7 MM
3/8 inches  	 	 		0.675 inches 	 	 	 	17.145 MM
1/2 inches 	 	 	 	 	0.840 inches 	 	 	 	21.336 MM
3/4 inches  	 	 		1.050 inches  	 	 		26.67 MM
1 inches  	 	 	 		1.32 inches  	 	 		33.401 MM
1 1/4 inches  	 	 		1.660 inches  	 	 		42.164 MM
1 1/2 inches  	 	 		1.900 inches  	 	 		48.26 MM
2 inches  	 	 	 		2.38 inches  	 	 		60.325 MM
2 1/2 inches 	 	 	 	2.88 inches 	 	 	 	73.025 MM
3 inches  	 	 	 		3.500 inches  	 	 		88.9 MM
3 1/2 inches  	 	 		4.000 inches 	 	 	 	101.6 MM
4 inches 	 	 	 	 	4.500 inches  	 	 		114.3 MM

 Nominal size [inches] 	 Inside diameter [inches] 	 Inside diameter [mm]
1/8 inches 	                0.27  inches 	     	 	 6.846 MM
1/4 inches  	 	 		0.363 inches 	 	 	 	 9.23 MM
3/8 inches 	 	 	 	 	0.493 inches 	 	 	 	12.523 MM
1/2 inches 	 	 	 	 	0.622 inches 	 	 	 	15.798 MM
3/4 inches  	 	 		0.824 inches  	 	 		20.93 MM
1 inches  	 	 	 		1.05 inches  	 	 		26.645 MM
1 1/4 inches  	 	 		1.38 inches  	 	 		35.052 MM
1 1/2 inches  	 	 		1.61 inches  	 	 		40.894 MM
2 inches  	 	 	 		2.07 inches  	 	 		52.501 MM
2 1/2 inches 	 	 	 	2.47 inches 	 	 	 	62.713 MM
3 inches  	 	 	 		3.07 inches  	 	 		77.928 MM
3 1/2 inches  	 	 		3.55 inches 	 	 	 	90.12 MM
4 inches 	 	 	 	 	4.03 inches  	 	 		102.26 MM


CHART: https://www.engineeringtoolbox.com/asme-steel-pipes-sizes-d_42.html

608 Bearing [mm] 22 OD x 8 iD (shaft) x 7 thick

*/

