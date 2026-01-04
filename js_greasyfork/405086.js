// ==UserScript==
// @namespace   	PCC
// @name     		PCC New Diagnosis Rank Code Secondary
// @description         Automatically changes the rank code to secondary in new diagnosis window
// @include     	https://www4.pointclickcare.com/care/chart/cp/clientdiag.jsp*
// @author 				CV
// @version  5
// @grant    none
// @downloadURL https://update.greasyfork.org/scripts/405086/PCC%20New%20Diagnosis%20Rank%20Code%20Secondary.user.js
// @updateURL https://update.greasyfork.org/scripts/405086/PCC%20New%20Diagnosis%20Rank%20Code%20Secondary.meta.js
// ==/UserScript==


document.getElementsByName("rank_id")[0].value=501;

//ttttttt