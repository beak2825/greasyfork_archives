// ==UserScript==
// @name         LingQ Azure TTS Generator
// @namespace    https://gquito.com/
// @version      1.1
// @description  Add the ability to generate Azure Text-to-Speech (TTS) to LingQ.
// @author       Kevin Quito
// @match        *://*.lingq.com/*/learn/*/web/editor/*0
// @match        *://*.lingq.com/*/learn/*/web/editor/*1
// @match        *://*.lingq.com/*/learn/*/web/editor/*2
// @match        *://*.lingq.com/*/learn/*/web/editor/*3
// @match        *://*.lingq.com/*/learn/*/web/editor/*4
// @match        *://*.lingq.com/*/learn/*/web/editor/*5
// @match        *://*.lingq.com/*/learn/*/web/editor/*6
// @match        *://*.lingq.com/*/learn/*/web/editor/*7
// @match        *://*.lingq.com/*/learn/*/web/editor/*8
// @match        *://*.lingq.com/*/learn/*/web/editor/*9
// @grant        none
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @downloadURL https://update.greasyfork.org/scripts/464302/LingQ%20Azure%20TTS%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/464302/LingQ%20Azure%20TTS%20Generator.meta.js
// ==/UserScript==

(function waitForContent() {
  'use strict';

  const loadedContent = document.querySelector('.nav--left');
  if (loadedContent !== null) {
    const navBox = document.querySelector(".nav--left");
    if (navBox === null) {
			throw "Could not find navigation box.";
    }

    const dividerElement = document.createElement('hr');
    dividerElement.className = 'divider';

    const navItemElement = document.createElement('nav-item');
    navItemElement.innerHTML = `
	  <div class="field is-grouped">
	    <div class="control">
	  	<button id="genAudioButton" class="button" tabindex="0">
					<span class="text-wrapper has-text-overflow">Generate Audio</span>
	  	  </button>
	      </div>
	    </div>
    `;

    navBox.append(dividerElement);
    navBox.append(navItemElement);

    loadMain();
    console.log('LingQ Azure TTS Generator script has been loaded.');
  } else {
    setTimeout(waitForContent, 100);
  }

	async function loadMain() {
		try {
			async function loadScript(url) {
				return new Promise((resolve, reject) => {
				const script = document.createElement('script');
				script.src = url;
				script.onload = () => resolve(script);
				script.onerror = reject;
				document.head.appendChild(script);
				});
			}

			await Promise.all([
				loadScript('https://aka.ms/csspeech/jsbrowserpackageraw'),
				loadScript('https://cdnjs.cloudflare.com/ajax/libs/lamejs/1.2.1/lame.min.js'),
			]);

			const textToSpeech = (inputText, accessToken, voiceName, serviceRegion) => new Promise((resolve, reject) => {
				const speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(accessToken, serviceRegion);
				speechConfig.speechSynthesisOutputFormat = SpeechSDK.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;
				speechConfig.speechSynthesisVoiceName = voiceName;

				const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, null);

				synthesizer.speakTextAsync(inputText, result => {
					if (result) {
						resolve(new Uint8Array(result.audioData));
					} else {
						reject(new Error('No audio data'));
					}
					synthesizer.close();
				}, error => {
					reject(error);
					synthesizer.close();
				});
			});

			const fetchSpeechToken = async (subscriptionKey, serviceRegion) => {
				const tokenUrl = `https://${serviceRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`;
				const response = await fetch(tokenUrl, {
					method: 'POST',
					headers: {
						'Ocp-Apim-Subscription-Key': subscriptionKey
					}
				});

				if (!response.ok) {
					let message = 'An error occurred while fetching the speech token.';
					if (response.status === 401 || response.status === 403) {
						message = 'Invalid subscription key or region. Please check your input and try again.';
					}
					throw new Error(message);
				}

				return { data: { accessToken: await response.text() } };
			};

			const processTextArray = async (textArray, accessToken, voiceName, serviceRegion, progressBar) => {
				let currentTime = 0;

				// Fetch audio data concurrently
				const audioDataPromises = textArray.map(text => textToSpeech(text, accessToken, voiceName, serviceRegion));
				let completeCount = 0;
				const audioDataArray = await Promise.all(audioDataPromises.map(p => p.then(result => {
					completeCount++;
					document.querySelector('.splash-screen .text').textContent = `Generating audio data (${completeCount}/${textArray.length})...`;
					progressBar.style.width = `${5 + ((completeCount / textArray.length) * 85)}%`;
					return result;
				})));

				// Calculate timestamps sequentially to maintain the order
				const timestamps = audioDataArray.map((audioData) => {
				const duration = (audioData.length / 16000) * 4;
				const timestamp = {
					text: textArray[audioDataArray.indexOf(audioData)],
					start: currentTime,
					end: currentTime + duration,
				};
				currentTime += duration;
				return timestamp;
				});

				return { audioDataArray, timestamps };
			};

			const concatenateAudio = async (textArray, accessToken, voiceName, serviceRegion, progressBar) => {
				const {audioDataArray, timestamps} = await processTextArray(textArray, accessToken, voiceName, serviceRegion, progressBar);
				const concatenatedAudio = new Uint8Array(audioDataArray.reduce((acc, curr) => acc + curr.length, 0));

				let offset = 0;
				audioDataArray.forEach(audioData => {
					concatenatedAudio.set(audioData, offset);
					offset += audioData.length;
				});

				return {concatenatedAudio, timestamps};
			}

			const sendAudioData = async (url, audioData, duration, language) => {
				const formData = new FormData();
				formData.append('audio', new Blob([audioData], {
					type: 'audio/mpeg'
				}), 'output.mp3');
				formData.append('duration', duration);
				formData.append('external_audio', '');
				formData.append('language', language);

				const response = await fetch(url, {
					method: 'PATCH',
					body: formData,
				});

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				return await response.json(); // Assuming the response is in JSON format
			}

			async function generateAudio(voiceName, subscriptionKey, serviceRegion) {
				try {
					// Add a style tag for the spin keyframes
					const styleTag = document.createElement('style');
					styleTag.innerHTML = `
						@keyframes spin {
							0% { transform: rotate(0deg); }
							100% { transform: rotate(360deg); }
						}
					`;
					document.head.appendChild(styleTag);
					const splashScreen = document.createElement('div');
					// Update the splashScreen innerHTML
					splashScreen.innerHTML = `
						<div class="splash-screen" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(10, 12, 14, 0.9); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 9999;">
							<div class="spinner" style="border: 8px solid #1A1C1E; border-top: 8px solid #086CBB; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite;"></div>
							<div class="text" style="color: #fff; margin: 10px;">Fetching sentences...</div>
							<div class="progress-bar" style="width: 70%; background-color: #1A1C1E; margin: 10px; height: 24px; position: relative; border-radius: 12px;"><div class="progress" style="width: 0%; height: 100%; background-color: #086CBB; position: absolute; border-radius: 12px;"></div></div>
						</div>
					`;

					document.body.appendChild(splashScreen);
					const progressBar = splashScreen.querySelector('.progress');

					window.onbeforeunload = function() {
						return "Are you sure you want to exit?";
					};

					// Account for 2.5% progress
					splashScreen.querySelector('.text').textContent = 'Fetching access token...';
					const tokenResponse = await fetchSpeechToken(subscriptionKey, serviceRegion);
					const accessToken = tokenResponse.data.accessToken;
					progressBar.style.width = `2.5%`;

					const path = window.location.pathname;
					const segments = path.split('/');
					const lessonID = segments[segments.length - 1];
					const language = segments[segments.length - 4];

					const response = await fetch(`https://www.lingq.com/api/v3/${language}/lessons/${lessonID}/sentences/`, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json'
						}
					});

					if (!response.ok) {
						throw new Error(`${response.status} ${response.statusText}`);
					}

					// Account for 2.5% progress
					splashScreen.querySelector('.text').textContent = 'Fetching data...';
					const data = await response.json();
					const numSentences = data.length;
					progressBar.style.width = `5%`;

					// Account for 85% progress
					const inputTextArray = data.map(item => item['text']);
					const {concatenatedAudio, timestamps} = await concatenateAudio(inputTextArray, accessToken, voiceName, serviceRegion, progressBar);

					if (concatenatedAudio.length <= 0) {
						throw new Error(`No audio detected. Please ensure the Speech Voice setting is accurate.`);
					}

					// Account for 5% progress
					splashScreen.querySelector('.text').textContent = 'Uploading audio...';
					await sendAudioData(`https://www.lingq.com/api/v3/${language}/lessons/${lessonID}/`, concatenatedAudio, 0, language);
					progressBar.style.width = `95%`;

                    splashScreen.querySelector('.text').textContent = `Updating timestamps...`;

                    let jsonData = [];
                    for (const [index, {start, end}] of timestamps.entries()) {
                        jsonData.push({
                            'index': index + 1,
                            'timestamp': [start, end]
                        });
                    }

                    const updateTimestampResponse = await fetch(`https://www.lingq.com/api/v3/${language}/lessons/${lessonID}/timestamps/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(jsonData)
                    });

                    if (!updateTimestampResponse.ok) {
                        throw new Error(`Could not update timestamp. ${updateTimestampResponse.status} ${updateTimestampResponse.statusText}`);
                    }

                    progressBar.style.width = `100%`;
					splashScreen.querySelector('.text').textContent = 'Done! Refreshing Page.';

					// Refresh the page to reflect changes
					window.onbeforeunload = null;
					location.reload();
				} catch (error) {
					window.onbeforeunload = null;
					const splashScreen = document.querySelector('.splash-screen');

					splashScreen.querySelector('.text').textContent = error;
					splashScreen.querySelector('.text').style.color = '#FF0000';

					setTimeout(function () {document.body.removeChild(splashScreen.parentElement);}, 5000);
				}
			}

			// Add HTML for button and prompt box
			const genAudioButton = document.querySelector("#genAudioButton");
			genAudioButton.addEventListener("click", function () {
				showPrompt();
			});

			function showPrompt() {
				document.body.appendChild(promptBox);
				promptBox.style.display = 'flex';

				const voiceName = localStorage.getItem('voiceName');
				const subscriptionKey = localStorage.getItem('subscriptionKey');
				const serviceRegion = localStorage.getItem('serviceRegion');

				if (voiceName) {
					promptBox.querySelector('.voice-select').value = voiceName;
				}
				if (subscriptionKey) {
					promptBox.querySelector('.subscription-key').value = subscriptionKey;
				}
				if (serviceRegion) {
					promptBox.querySelector('.region-select').value = serviceRegion;
				}
			}

			function closePrompt() {
				promptBox.style.display = 'none';
			}

			const styleTag = document.createElement('style');
			styleTag.innerHTML = `
				.generate-btn { background-color: #FF382E; }
				.cancel-btn { background-color: #292E32; }
				.voice-info:hover, .subscription-info:hover, .region-info:hover, .generate-btn:hover, .cancel-btn:hover, .close-btn:hover { opacity: 0.8; cursor: pointer; }
				.voice-info:active, .subscription-info:active, .region-info:active, .generate-btn:active, .cancel-btn:active, .close-btn:active { opacity: 0.6; }
				.voice-select, .subscription-key, .region-select { font-size: 18px; height: 40px; width: 100px; }
				.warning-box { width: 70%; }
			`;
			document.head.appendChild(styleTag);

			const promptBox = document.createElement('div');
			promptBox.innerHTML = `
				<div class="prompt-box" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(5, 13, 24, 0.9); display: flex; align-items: center; justify-content: center; z-index: 9999;">
					<div class="warning-box" style="background-color: #050D18; padding: 30px; border-radius: 20px; text-align: center; position: relative; border: 2px solid #1C2D3A; max-width: 600px;">
						<button class="close-btn" style="position: absolute; top: 10px; right: 10px; background: #1C2D3A; border: none; font-size: 20px; color: #FFF; width: 30px; height: 30px; line-height: 0; border-radius: 50%; text-align: center;">X</button>
						<div class="text" style="color: #fff; margin: 10px;">Input Azure Speech Service details to create audio. This will overwrite the current audio and timestamps.</div>
						<div style="display: flex; justify-content: space-between; align-items: center;">
							<input type="text" class="voice-select" placeholder="Input Speech Voice, for example: en-US-NancyNeural" style="width: 90%; margin-bottom: 10px; padding-left: 10px; padding-right: 10px;">
							<button class="voice-info" style="background: #1C2D3A; border: none; font-size: 20px; color: #FFF; width: 30px; height: 30px; line-height: 0; border-radius: 50%; text-align: center;">?</button>
						</div>
						<div style="display: flex; justify-content: space-between; align-items: center;">
							<input type="text" class="subscription-key" placeholder="Input Subscription Key" style="width: 90%; margin-bottom: 10px; padding-left: 10px; padding-right: 10px;">
							<button class="subscription-info" style="background: #1C2D3A; border: none; font-size: 20px; color: #FFF; width: 30px; height: 30px; line-height: 0; border-radius: 50%; text-align: center;">?</button>
						</div>
						<div style="display: flex; justify-content: space-between; align-items: center;">
							<select class="region-select" style="width: 90%; margin-bottom: 10px; padding-left: 10px; padding-right: 10px;">
								<option value="eastus">eastus</option>
								<option value="eastus2">eastus2</option>
								<option value="northcentralus">northcentralus</option>
								<option value="southcentralus">southcentralus</option>
								<option value="westcentralus">westcentralus</option>
								<option value="westus">westus</option>
								<option value="westus2">westus2</option>
								<option value="westus3">westus3</option>
								<option value="southafricanorth">southafricanorth</option>
								<option value="eastasia">eastasia</option>
								<option value="southeastasia">southeastasia</option>
								<option value="australiaeast">australiaeast</option>
								<option value="centralindia">centralindia</option>
								<option value="japaneast">japaneast</option>
								<option value="japanwest">japanwest</option>
								<option value="koreacentral">koreacentral</option>
								<option value="canadacentral">canadacentral</option>
								<option value="northeurope">northeurope</option>
								<option value="westeurope">westeurope</option>
								<option value="francecentral">francecentral</option>
								<option value="germanywestcentral">germanywestcentral</option>
								<option value="norwayeast">norwayeast</option>
								<option value="switzerlandnorth">switzerlandnorth</option>
								<option value="switzerlandwest">switzerlandwest</option>
								<option value="uksouth">uksouth</option>
								<option value="uaenorth">uaenorth</option>
								<option value="brazilsouth">brazilsouth</option>
								<option value="centralus">centralus</option>
							</select>
						</div>
						<button class="generate-btn" style="padding: 10px 20px; border: none; color: #fff; font-size: 16px; border-radius: 5px; margin-right: 10px;">Generate</button>
						<button class="cancel-btn" style="padding: 10px 20px; border: none; color: #fff; font-size: 16px; border-radius: 5px;">Cancel</button>
					</div>
				</div>
			`;
			// Add event listeners for the buttons
			promptBox.querySelector('.voice-info').addEventListener('click', () => {
				window.open('https://learn.microsoft.com/en-us/azure/cognitive-services/speech-service/language-support?tabs=tts', '_blank');
			});

			promptBox.querySelector('.subscription-info').addEventListener('click', () => {
				alert('To create a Microsoft Azure account and get a speech service key, follow these steps:\n\n1. Visit https://portal.azure.com and sign up for a new account or sign in with your existing Microsoft account.\n2. Click on "Create a resource" in the left-hand menu.\n3. Search for "Speech" in the search box and select "Speech" from the results.\n4. Click the "Create" button and fill in the required information, including subscription, resource group, name, and region.\n5. Click "Review + create" and then click "Create" again.\n6. After the deployment is complete, navigate to the "Resource Management" section of your Speech service.\n7. Copy the "Key1" value from the "Keys and Endpoint" section – this is your subscription key.\n8. Also, note the "Location" value in the same section – this is your region.');
			});

			const generateBtn = promptBox.querySelector('.generate-btn');
			const cancelBtn = promptBox.querySelector('.cancel-btn');
			const closeBtn = promptBox.querySelector('.close-btn');

			generateBtn.addEventListener('click', () => {
				const voiceName = promptBox.querySelector('.voice-select').value;
				const subscriptionKey = promptBox.querySelector('.subscription-key').value;
				const serviceRegion = promptBox.querySelector('.region-select').value;

				localStorage.setItem('voiceName', voiceName);
				localStorage.setItem('subscriptionKey', subscriptionKey);
				localStorage.setItem('serviceRegion', serviceRegion);

				generateAudio(voiceName, subscriptionKey, serviceRegion);
				closePrompt();
			});

			cancelBtn.addEventListener('click', closePrompt);
			closeBtn.addEventListener('click', closePrompt);
		} catch (error) {
			console.error('Error loading scripts:', error);
		}
	}
})();