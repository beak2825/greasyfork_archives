// ==UserScript==
// @name         Reward History Collector
// @author       Saiful Islam
// @version      0.1
// @description  Collect Users Review Data for Reward
// @namespace    https://github.com/AN0NIM07
// @match        https://wayfarer.nianticlabs.com/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/460410/Reward%20History%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/460410/Reward%20History%20Collector.meta.js
// ==/UserScript==

/* eslint-env es6 */
/* eslint no-var: "error" */
/* eslint indent: ['error', 2] */

(function() {
    let tryNumber = 15;
	let candidate;
    let sheetData;
    (function (open) {
		XMLHttpRequest.prototype.open = function (method, url) {
			if (url == '/api/v1/vault/review') {
				if (method == 'GET') {
					this.addEventListener('load', parseCandidate, false);
				}
			}
			open.apply(this, arguments);
		};
	})(XMLHttpRequest.prototype.open);

    function parseCandidate(e) {
		try {
			const response = this.response;
			const json = JSON.parse(response);
            //console.log(json);
			if (!json) {
				console.log(response);
				//alert('Failed to parse response from Wayfarer');
				return;
			}
			// ignore if it's related to captchas
			if (json.captcha) {
                //alert('-----Alert: Capcha Encountered-----\n\nSolve the Capcha Manually');
				return;
            }

			if (json.code != 'OK') {
                //alert('Failed to parse response from Wayfarer');
				return;
            }

			candidate = json.result;
			if (!candidate) {
				console.log(json);
				//alert('Wayfarer\'s response didn\'t include a candidate.');
				return;
			}
			doTheMagic();

		} catch (e)	{
			console.log(e); // eslint-disable-line no-console
		}

	}

    function doTheMagic() {
        const ref = document.querySelector('wf-page-header');

		if (!ref) {
			if (tryNumber === 0) {
				document.querySelector('body')
					.insertAdjacentHTML('afterBegin', '<div class="alert alert-danger"><strong><span class="glyphicon glyphicon-remove"></span> Wayfarer Translate initialization failed, refresh page</strong></div>');
				return;
			}
			setTimeout(doTheMagic, 1000);
			tryNumber--;
			return;
		}



        let subtitle = '';
        let titleandlocation = 'ekane nam ache nam onujayi decision';
        let locationcord = '';
		let nominationDescription = '';
        let nominationSupportingInformation = '';
        let nominationMainImage = '';
        let nominationSupportingImage = '';
		let sheetversion = 'v3.1';
		let getsheetversion = 'someVersion';
        if (candidate.type == 'NEW') {
            subtitle = candidate.title;
            locationcord = candidate.lat.toString() + ',' + candidate.lng.toString()
            titleandlocation = subtitle + ' ' + locationcord;
			nominationDescription = candidate.description;
            nominationSupportingInformation = candidate.statement;
            nominationMainImage = candidate.imageUrl + "=s0";
            nominationSupportingImage = candidate.supportingImageUrl + "=s0";
            if (localStorage.getItem("ReviewerInfo") === null)
            {
                let person = prompt("To Get Review Reward:\nPlease Enter Your Name-Email.\n\nExample: Alex-alex123@gmail.com\n\nCaution: You cannot change this later. So Check Twice.\n\nAll Your Reviews will be counted under this name.If You are reviewing from multiple device, Use same Name-Email.", "");
                if (person != null) {
                    localStorage.setItem("ReviewerInfo", person);
                }
            }


			var today = new Date();

            var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

            var dateTime = date+' '+time;

            let timeInfo = dateTime.toString();

            let historyData = titleandlocation;

            if (localStorage.getItem("RewardHistorySaved") === null || localStorage.getItem("RewardHistorySaved") != titleandlocation) {
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                var raw = JSON.stringify({
                    "NameEmail": localStorage.getItem("ReviewerInfo").toString(),
                    "Time": timeInfo,
                    "Details": titleandlocation
                });

                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    mode: 'no-cors',
                    redirect: 'follow'
                };

                fetch("https://script.google.com/macros/s/AKfycbwUsLDe1pXe2BmbL30Hom7jUrTitdISZx54uNLs0zcmzG5GIEHoC917QEsM1j1bk0S0/exec?action=addUser", requestOptions)
                    .then(response => response.text())
                    .then(result => console.log(result))
                    .catch(error => console.log('error', error));

				window.localStorage.removeItem("RewardHistorySaved");
                localStorage.setItem("RewardHistorySaved", titleandlocation);
            }
		}


    }






})();