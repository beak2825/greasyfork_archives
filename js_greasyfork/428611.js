// ==UserScript==
// @name         How many times does this character show up in this fic?
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  count instances of a term or terms in works from AO3 search pages
// @author       exuvia
// @match        https://archiveofourown.org/tags/*/works*
// @match        https://archiveofourown.org/works?*
// @icon         http://archiveofourown.org/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428611/How%20many%20times%20does%20this%20character%20show%20up%20in%20this%20fic.user.js
// @updateURL https://update.greasyfork.org/scripts/428611/How%20many%20times%20does%20this%20character%20show%20up%20in%20this%20fic.meta.js
// ==/UserScript==

(function() {

	//OPTIONS: Edit these!

	const matchstrings = ["Term1","Term2","Term3"] //Change this to the term(s) you want to search for, ["term"] for one term
	const matchcase = false; //Case sensitivity
	const autocount = true; //Might get you "Retry Later"-temporary locked out of AO3 for sending too many requests. Change to false if it causes problems, or you want to click the count links manually.

	//END OPTIONS

	Array.from(document.querySelectorAll(".stats")).forEach((statblock,i) => {
		let workID = statblock.parentElement.id.replace("work_","");
		let ele = document.createElement("a");
		ele.innerText = "Count";
		ele.style.fontWeight = "bold";
		ele.onclick = () => {
			ele.innerText = "Working...";
			ele.style.borderBottom = "initial";
			ele.style.fontWeight = "";
			let xhr = new XMLHttpRequest(); //send a request to AO3 for the fic's information, most of the 2 seconds of 'WORKING' wait time is for AO3 to respond
			//start_time = new Date().getTime();
			xhr.responseType = "document";
			xhr.open("GET", "/works/" + workID + "?view_full_work=true", true);
			xhr.onload = function() {

				ele.innerText = ""

				matchstrings.forEach(matchstring => {
					const myPromise = new Promise((resolve, reject) => {
						if (this.readyState == 4 && xhr.status === 200){
							let matchreg = (matchcase) ? new RegExp(matchstring,'g') : new RegExp(matchstring,'gi');
							const length = (xhr.responseXML.querySelectorAll("#chapters")[0].innerText.match(matchreg)|| []).length;
							resolve(length);
							//console.log('This request took '+(new Date().getTime() - start_time)+' ms')
						}
						else reject();
					}).then((resolve) =>{
						let ddcontainer = document.createElement("dd");
						ddcontainer.innerText = " " + matchstring + ": " + resolve
						ele.appendChild(ddcontainer)
						ele.onclick = ""
					}).catch((err) =>{
						console.log(err)
						ele.innerText += "REQUEST FAILED"
					});
				})
			};
			xhr.send();
		}
		let ddcontainer = document.createElement("dd");
		statblock.appendChild(ddcontainer);
		ddcontainer.appendChild(ele);
		setTimeout(()=>ele.click(),3000*i) //clicks Count every 3 seconds. Decrease to have it autoclick faster (but might get you locked out with "Retry Later" faster)
	})

})();