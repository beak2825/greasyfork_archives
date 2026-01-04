// ==UserScript==
// @name		Melvor Idle - Offline Farming
// @namespace   http://tampermonkey.net/
// @version		1.0.5.7
// @description	Goes back in time to plant seeds when your previous crop was grown, with minimal downtime.
// @author		Xander#8896
// @match		https://*.melvoridle.com/*
// @exclude		https://wiki.melvoridle.com/*
// @noframes
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/449482/Melvor%20Idle%20-%20Offline%20Farming.user.js
// @updateURL https://update.greasyfork.org/scripts/449482/Melvor%20Idle%20-%20Offline%20Farming.meta.js
// ==/UserScript==
 
function script() {
    
    let farmingBtnsContainer =  document.querySelector("#farming-container .col-12.col-md-4 .ml-2.mr-2.text-right");
    
    const btn = document.createElement("button");
    btn.id = "offlineFarming";
    btn.classList.add(...["btn", "btn-sm", "btn-warning", "m-1"]);
    btn.innerText = "Farm Offline";
    btn.addEventListener("click", () => {
        // Set startTime for logging
        let startTime = new Date().getTime()
        
        // Disable item notifications to fix lag
        let showItemNotifications = toggleSettingsData[5].value;
        //toggleSettingsData[5].value = false;
        
        // Loop through farming areas
        for (let areaID	= 0; areaID < newFarmingAreas.length; areaID++) {
        	const area = newFarmingAreas[areaID];
        	
        	// If the selected crop is the same for every patch, use plantAllSelected
        	if (plantAllSelected[areaID].every((val, i, arr) => val === arr[0])) {
        		loadFarmingArea(areaID);
        		
        		// Select the time when last patch was grown
        		let maxTimeGrown = 0;
        		for (let patchID = 0; patchID < area.patches.length; patchID++) {
        			const patch = area.patches[patchID];
        			if (patch.seedID !== 0 && patch.timePlanted !== 0 && patch.setInterval !== 0) {
        				let timeGrown = patch.timePlanted + patch.setInterval * 1000;
        				if (timeGrown > maxTimeGrown) {
        					maxTimeGrown = timeGrown;
        				}
        			}
        		}
        		
        		if (maxTimeGrown <= new Date().getTime()) {
        			// Harvest, Gloop and Plant
        			harvestAll();
        			gloopAll();
        			plantAllSelectedCrops();
        			
        			// Set plant time equal to when the last patch was grown
        			for (let patchID = 0; patchID < area.patches.length; patchID++) {
        				const patch = area.patches[patchID];
        				if (patch.seedID !== 0 && patch.timePlanted !== 0 && patch.setInterval !== 0) {
        					patch.timePlanted = maxTimeGrown;
        				}
        			}
        			
        			// Set maxTimeGrown for the next iteration of the loop & some logging
        			maxTimeGrown = area.patches[0].timePlanted + area.patches[0].setInterval * 1000;
        			console.log(`areaID: ${areaID} patchID: all - Planted ${items[items[area.patches[0].seedID].grownItemID].name} at ${new Date(area.patches[0].timePlanted).toLocaleString()}`);
        	    }
        	} else {
        		// Plant selected isn't the same for every patch, so loop through each patch individually
        		selectedPatch[0] = areaID;
        		
        		for (let patchID = 0; patchID < area.patches.length; patchID++) {
        			const patch = area.patches[patchID];
        			selectedPatch[1] = patchID;
        			
        			if (patch.seedID !== 0 && patch.timePlanted !== 0 && patch.setInterval !== 0) {
        				// Get time when the patch was grown
        				let timeGrown = patch.timePlanted + patch.setInterval * 1000;
        				// As long as it finished growing keep harvesting and planting in the patch
        				if (timeGrown <= new Date().getTime()) {
        					// Harvest, Gloop and Plant
        					harvestSeed(areaID, patchID);
        					addGloop(areaID, patchID);
        					selectSeed(plantAllSelected[areaID][patchID]);
        					plantSeed();
        					
        					// Adjust timePlanted to when the previous crop was grown
        					patch.timePlanted = timeGrown;

        					// Set timeGrown for the next iteration of the loop & some logging
        					timeGrown = patch.timePlanted + patch.setInterval * 1000;
        					console.log(`areaID: ${areaID} patchID: ${patchID} - Planted ${items[items[patch.seedID].grownItemID].name} at ${new Date(patch.timePlanted).toLocaleString()}`);
        				}
        			}
        		}
        	}
        	
        }
        
        // Set item notifications back to initial value & load first area
        toggleSettingsData[5].value = showItemNotifications;
        loadFarmingArea(0);

        // End Time
        console.log(`Offline farming took ${new Date().getTime() - startTime}ms`);
    });
 
    farmingBtnsContainer.appendChild(btn);
    tippy("#offlineFarming", {
        content: `
            Click to perform these actions on all farming plots:
            <br>
            -> Harvest
            <br>
            -> Apply Weird Gloop
            <br>
            -> Plant Selected Crop
            <br><br>
            Caution: May take a while to run`,
        allowHTML: true,
    });
 
}
 
function loadScript() {
	if (typeof confirmedLoaded !== typeof undefined && confirmedLoaded) {
		clearInterval(scriptLoader);
		const scriptElement = document.createElement('script');
		scriptElement.textContent = `try {(${script})();} catch (e) {console.log(e);}`;
		document.body.appendChild(scriptElement).parentNode.removeChild(scriptElement);
	}
}
 
const scriptLoader = setInterval(loadScript, 200);