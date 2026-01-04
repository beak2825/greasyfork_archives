// ==UserScript==
// @name         variable set -Email Range Selection
// @author       Saiful Islam
// @version      0.3
// @description  variable set for Email Range Selection
// @namespace    https://github.com/AN0NIM07
// @match        https://accounts.google.com/o/*
// @downloadURL https://update.greasyfork.org/scripts/481442/variable%20set%20-Email%20Range%20Selection.user.js
// @updateURL https://update.greasyfork.org/scripts/481442/variable%20set%20-Email%20Range%20Selection.meta.js
// ==/UserScript==

/* eslint-env es6 */
/* eslint no-var: "error" */
/* eslint indent: ['error', 2] */

(function() {
	
	variableSet();
	return;
	
	function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
	
	async function variableSet()
	{
		await sleep(1000);
		window.localStorage.removeItem("gmailCounterInRange");
		var activateRangeChange = Number(window.prompt("---Email Active Range Review---\n\nType 1 to active\nType 0 to Remove", ""));
		if(activateRangeChange == 1)
		{
			await sleep(2000);
			localStorage.setItem("EmailChangeBasedOnRange", activateRangeChange);

			var startFromNumber = Number(window.prompt("---Email Starts From---\n\nType any value from 1-10", ""));

			if(startFromNumber >= 1 && startFromNumber<=10)
			{
				await sleep(2000);
				localStorage.setItem("StartingNumberOfRange", startFromNumber);

				var EndingAtNumber = Number(window.prompt("---Email End at---\n\nType any value from 1-10\n\nNote:\n1.The Number should be larger than Start From.\n2.If it is same,then The bot will keep reviewing same email.\n", ""));
				if(EndingAtNumber >= startFromNumber && EndingAtNumber<=10 )
				{
					localStorage.setItem("EndingNumberOfRange", EndingAtNumber);
					alert('Email Range Set Completed');
				}
				else
				{
					console.log('Wrong value inputted.\n\nReload the page to start again');
				}
			}
		}
		else if(activateRangeChange == 0)
		{
			localStorage.setItem("EmailChangeBasedOnRange", activateRangeChange);
			alert('Email Range Change Deactivated');
		}
		return;
	
	}
})();