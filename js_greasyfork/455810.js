// ==UserScript==
// @name         Wayfarer Auto Add Data From Contributions
// @version      2.8
// @description  Add Streetview to selected nomination
// @namespace    https://github.com/
// @homepageURL  https://github.com/
// @match        https://wayfarer.nianticlabs.com/*
// @downloadURL https://update.greasyfork.org/scripts/455810/Wayfarer%20Auto%20Add%20Data%20From%20Contributions.user.js
// @updateURL https://update.greasyfork.org/scripts/455810/Wayfarer%20Auto%20Add%20Data%20From%20Contributions.meta.js
// ==/UserScript==
 
 
 
/* eslint-env es6 */
/* eslint no-var: "error" */

(function() {
	let tryNumber = 10;
    const nomCache = {};
    let intelLink = null;
    let pendingNominationlist = [];
    var allNominationList;
    var decisionSheetData;

	/**
	 * Overwrite the open method of the XMLHttpRequest.prototype to intercept the server calls
	 */
	(function (open) {
		XMLHttpRequest.prototype.open = function (method, url) {
			if (url == '/api/v1/vault/manage' && method == 'GET') {
                this.addEventListener('load', parseNominations, false);
			}
			open.apply(this, arguments);
		};
	})(XMLHttpRequest.prototype.open);

    function parseNominations() {
        tryNumber = 10;
        const response = this.response;
        const json = JSON.parse(response);
        if (!json) {
            console.log('Failed to parse response from Wayfarer');
            return;
        }
        // ignore if it's related to captchas
        if (json.captcha) return;

        if (!json.result) {
            console.log('Wayfarer\'s response didn\'t include candidates.');
            return;
        }

        allNominationList = json.result.nominations;
        //console.log(allNominationList);
        addNominationToDecisionSheet(allNominationList);

        json.result.nominations.forEach(nomination => { nomCache[nomination.imageUrl] = nomination; })

        const list = document.getElementsByTagName('app-nominations-list')[0];
        list.addEventListener('click', handleNominationClick);
    }

    const awaitElement = get => new Promise((resolve, reject) => {
        let triesLeft = 10;
        const queryLoop = () => {
            const ref = get();
            if (ref) resolve(ref);
            else if (!triesLeft) reject();
            else setTimeout(queryLoop, 100);
            triesLeft--;
        }
        queryLoop();
    });

    async function addNominationToDecisionSheet(allNominationList)
    {
        const url2 = 'https://script.google.com/macros/s/AKfycbxjrZskRgTuDCc57uV6V6MYxs35aJ6vlvjXeQG5xHdvKRbDI2k1PraU0hZkzPb9oTqeug/exec';
        fetch(url2)
            .then(res2 => res2.json())
            .then(data2 =>{
            decisionSheetData = data2;
        })
        await sleep(10000);

            var nominationListLength = Object.keys(allNominationList).length;
            var objectLength = Object.keys(decisionSheetData).length;
        console.log(allNominationList);
            for(var i=0 ; i< nominationListLength ; i++)
            {
                if(allNominationList[i].status == "HELD" || allNominationList[i].status == "NOMINATED")
                {
                        var found = 0;
                        let nomTitleandLocation = allNominationList[i].title + " " + allNominationList[i].lat.toString() + "," + allNominationList[i].lng.toString();
                        for(var j=0; j< objectLength; j++)
                        {
                            if(`${decisionSheetData[j].NominationName}`.toLowerCase() == nomTitleandLocation.toLowerCase())
                            {
                                found = 1;
                                break;
                            }
                        }
                        if(found == 0)
                        {
                            await sleep(3000);
                            console.log("Sheet Decision Added: \nNomination Serial: "+i+"\n Info: " + nomTitleandLocation);
                            var myHeaders = new Headers();
                            myHeaders.append("Content-Type", "application/json");
                            var raw = JSON.stringify({
                                "NominationName": nomTitleandLocation,
                                "Decision": "ACCEPT",
                                "Actions": "Accept: Random"
                            });
                            var requestOptions = {
                                method: 'POST',
                                headers: myHeaders,
                                body: raw,
                                mode: 'no-cors',
                                redirect: 'follow'
                            };

                            fetch("https://script.google.com/macros/s/AKfycbxjrZskRgTuDCc57uV6V6MYxs35aJ6vlvjXeQG5xHdvKRbDI2k1PraU0hZkzPb9oTqeug/exec?action=addUser", requestOptions)
                                .then(response => response.text())
                                .then(result => console.log(result))
                                .catch(error => console.log('error', error));
                        }

                }

            }
        alert("---ALL NOMINATION ADDED---");
    }

        function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    function handleNominationClick(e) {
        awaitElement(() => e.target.closest('app-nominations-list-item'))
            .then((ref) => {
                const nom = nomCache[ref.querySelector('img').src];
                addStreetView(nom);
                addCoordinates(nom);
                const matCnt = document.querySelector('mat-sidenav-content');
                const evtFunc= () => {
                    document.querySelector('.wf-page-header__title > div:nth-child(1)').scrollIntoView();
                    matCnt.removeEventListener('scroll',evtFunc);
                };
                matCnt.addEventListener('scroll', evtFunc);
            });
    }

	function addCoordinates(selected) {
        const { lat, lng, city, state } = selected;
        awaitElement(() => document.querySelector("app-nominations app-details-pane p"))
            .then((locationP) => {
				let nomName = document.querySelector("body > app-root > app-wayfarer > div > mat-sidenav-container > mat-sidenav-content > div > app-nominations > div > app-details-pane > div > div > div > div.details-header > div > h4").textContent;
                const coordinates = `${lat},${lng}`;
                const newText = `${city} ${state} (${coordinates})`;
                locationP.innerText = newText;
                locationP.style.cursor = 'pointer';
                locationP.title = 'Copy coordinates to clipboard';
                locationP.onclick = function() {
                    navigator.clipboard.writeText(nomName + ' ' +coordinates);
                }
            });

        awaitElement(() => document.querySelector("app-nominations app-details-pane h4"))
            .then((titleP) => {
                if (intelLink === null) {
                intelLink = document.createElement('a');
                intelLink.id = 'intelLink';
                intelLink.className = 'anchor-link';
                intelLink.target = "_blank";
                intelLink.title = 'Open in Intel';
                intelLink.style['font-size'] = "1.25rem";
            }

            intelLink.href = `https://intel.ingress.com/?ll=${lat},${lng}&z=16`;
            intelLink.innerText = titleP.innerText;
            
            insertAfter(intelLink, titleP);
            titleP.style.display = "none";
        });     
	}

    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

	function addStreetView(selected) {
		if (typeof(google) === 'undefined') {
            setTimeout(addStreetView, 100, selected);
            return;
        }

        const ref = document.querySelector('wf-page-header');
		if (!ref) {
			if (tryNumber === 0) {
                alert('Nomination Street View initialization failed, please refresh the page');
				return;
			}
			setTimeout(addStreetView, 300, selected);
			tryNumber--;
			return;
		}
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

		if (document.getElementById("pano") === null){
            let lastPane = document.getElementsByClassName("details-pane__map")[0];
            if (lastPane === undefined){
                console.err("[WF-NSV] Failed to find attach elem");
                return;
            }
            let SVMapElement = document.createElement("div");
            SVMapElement.id = "pano";
            SVMapElement.style.height = "480px";
            SVMapElement.style.marginTop = "10px";
            lastPane.parentElement.insertBefore(SVMapElement, lastPane.nextSibling);
        }

        const { lat, lng, title } = selected;
        const SVMap = new google.maps.Map(document.getElementById("pano"), {
            center: { lat, lng },
            mapTypeId: "hybrid",
            zoom: 17,
            scaleControl: true,
            scrollwheel: true,
            gestureHandling: 'greedy',
            mapTypeControl: false
        });
        const marker = new google.maps.Marker({
            map: SVMap,
            position: { lat, lng },
            title
        });
        const client = new google.maps.StreetViewService;
        client.getPanoramaByLocation({ lat, lng }, 50, function(result, status) {
            if (status === "OK") {
                const nomLocation = new google.maps.LatLng(lat, lng);
                const svLocation = result.location.latLng;
                const heading = google.maps.geometry.spherical.computeHeading(svLocation, nomLocation);
                const panorama = SVMap.getStreetView();
                panorama.setPosition(svLocation);
                panorama.setPov({ heading, pitch: 0, zoom: 1 });
                panorama.setMotionTracking(false);
                panorama.setVisible(true);
            }
        });
	}
})();