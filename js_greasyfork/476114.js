// ==UserScript==
// @name         Unlock all for Spear game or something
// @namespace    http://yahoo.com
// @version      1.1.69
// @description  Yeah Free stuff, REEEEEE
// @author       Skrylor
// @match        https://stabfish.io/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476114/Unlock%20all%20for%20Spear%20game%20or%20something.user.js
// @updateURL https://update.greasyfork.org/scripts/476114/Unlock%20all%20for%20Spear%20game%20or%20something.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// Create a flag to control the banana rain animation
	let bananaRainActive = true;


	var bananaCanvas = document.createElement('canvas');
	bananaCanvas.id = 'bananaCanvas';
	bananaCanvas.width = 550;
	bananaCanvas.height = 500;
	bananaCanvas.style.position = 'absolute';
	bananaCanvas.style.top = '0';
	bananaCanvas.style.left = '0';
	bananaCanvas.style.pointerEvents = 'none'; // Allow interactions with elements beneath

	var stageCanvas = document.getElementById('stage');

	if (stageCanvas) {
		stageCanvas.parentNode.insertBefore(bananaCanvas, stageCanvas.nextSibling);
	} else {
		document.body.appendChild(bananaCanvas);
	}

	var bananaStage = new createjs.StageGL(bananaCanvas, {
		antialias: true,
		alpha: true,
		transparent: true
	})
	bananaStage.setClearColor("transparent");
	createjs.Ticker.timingMode = createjs.Ticker.RAF;
	createjs.Touch.enable(bananaStage);
	var bananaCont = bananaStage.addChild(new createjs.Container())
		.set({
			mouseEnabled: false,
			mouseChildren: false
		});

	var bananaImg = document.createElement("img");
	bananaImg.crossOrigin = "Anonymous";
	bananaImg.src = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1524180/Banana.png";
	bananaImg.onload = initBananaRain;
	var bananaBmp = new createjs.Bitmap(bananaImg);
	handleResize();

	var MAX_BANANAS = 300;
	var bananas = [];

	function initBananaRain() {
		createjs.Ticker.on("tick", tick);
		for (var i = 0; i < 100; i++) {
			tick();
		}
	}

	var clicked = false;

	function tick(event) {
		addBanana();

		var factor = 1,
			DIST = bananaCanvas.width / 10,
			ADD = 10;
		if (clicked) {
			factor = 5;
			DIST = bananaCanvas.width / 5;
		}

		for (var i = bananas.length - 1; i >= 0; i--) {
			var b = bananas[i];
			b.y += b.speed;
			b.rotation = (b.rotation + b.rotationSpeed) % 360;
			b.speed *= 1.01;

			b.x += b.addX;
			b.y += b.addY;
			b.addX *= 0.9;
			if (b.addY < 0) {
				b.addY *= 0.9;
			}

			var difX = bananaStage.mouseX - b.x,
				difY = bananaStage.mouseY - b.y,
				dist = Math.sqrt(difX * difX + difY * difY);
			if (Math.abs(dist) < DIST) {
				if (clicked) {
					b.rotationSpeed *= -difX / DIST * 10;
				}
				b.addX = -difX / DIST * ADD * (b.scale) * factor;
				b.addY = -difY / DIST * ADD * (b.scale) * factor;
			}

			if (b.y > bananaCanvas.height + 30) {
				addBanana(b, i);
			}
		}
		clicked = false;
		bananaStage.update(event);
	}

	function addBanana(b) {
		if (b) {} else if (bananas.length > MAX_BANANAS) {
			return;
		} else {
			b = new createjs.Bitmap(bananaImg).set({
				regX: bananaImg.naturalWidth / 2,
				regY: bananaImg.naturalHeight / 2
			});
			bananas.push(b);
			bananaCont.addChild(b);
		}

		b.set({
			x: Math.random() * bananaCanvas.width,
			y: -30,
			speed: Math.random() * 6 + 1.5,
			rotation: Math.random() * 360,
			rotationSpeed: Math.random() * 3 - 1.5,
			addX: 0,
			addY: 0,
			power: 0
		});
		b.scale = b.speed / 7.5;
	}

	window.addEventListener("resize", handleResize, false);

	function handleResize(event) {
		var w = window.innerWidth,
			h = window.innerHeight;
		bananaCanvas.width = w;
		bananaCanvas.height = h;
		bananaStage.updateViewport(w, h);
	}

	bananaStage.on("stagemousedown", function() {
		clicked = true;
	});

	const terminalBox = document.createElement('div');
	terminalBox.style.cssText = 'background-color:black;color:lime;border:2px solid lime;border-radius:10px;box-shadow:0px 0px 10px rgba(0,255,0,0.5);position:relative;top:50%;left:50%;transform:translate(-50%,-50%);padding:20px;text-align:left;z-index:9999;overflow:hidden;height:300px;font-family:Courier New,monospace;width:50%;animation:blinkingCursor 1s infinite;';

	const typingAnimation = document.createElement('div');
	typingAnimation.style.cssText = 'font-size:20px;white-space:nowrap;animation:typing 3s steps(30,end),blinkingCursor .75s step-end infinite;';
	terminalBox.appendChild(typingAnimation);

	const style = document.createElement('style');
	style.textContent = `
        @keyframes typing {
            from { width: 0; }
            to { width: 100%; }
        }
        @keyframes blinkingCursor {
            from, to { border-color: transparent; }
            50% { border-color: lime; }
        }`;
	document.head.appendChild(style);

	const progressBar = document.createElement('div');
	progressBar.style.cssText = 'background-color:lime;height:20px;border-radius:10px;box-shadow:0 0 10px lime;transition:width 1s ease-in-out;';

	const progressBarContainer = document.createElement('div');
	progressBarContainer.style.cssText = 'background-color:#222;border-radius:10px;position:relative;bottom:0;left:0;right:0;';

	progressBarContainer.appendChild(progressBar);
	terminalBox.appendChild(progressBarContainer);

	const messages = [
		"Initiating connection to server...",
		"Connection established.",
		"Searching for player...",
		"Player found.",
		"Listing user data...",
		"Attempting to patch...",
		"Access denied. Write only.",
		"Elevating to root...",
		"Searching for root password...",
		"Root password found.",
		"Running hashcat on hashed root password...",
		"Hashcat successful. Root password cracked.",
		"Accessing Player_Unlockables database with root...",
		"Access successful.",
		"Player Data: unlockedSpears",
		"Patching unlockedSpears...",
		"Player Data: unlockedBodies",
		"Patching unlockedBodies...",
		"Player Data: unlockedFaces",
		"Patching unlockedFaces...",
		"Player Data: unlockedHats",
		"Patching unlockedHats...",
		"Searching for additional databases on PC...",
		"No additional databases found.",
		"Sniffing for databases in local network...",
		"Database found: Player Progress",
		"Attempting to access Player Progress database...",
		"Access denied. Login not found.",
		"Sniffing for login in local network...",
		"Login not found.",
		"Attempting to bruteforce password with admin username...",
		"Cracking Password: ",
		"Accessing database with login data...",
		"Access successful.",
		"Finding player...",
		"Player found.",
		"Patching player progress...",
		"Patch successful.",
		"Searching for additional databases on PC...",
		"No additional databases found.",
		"Sniffing for databases in local network...",
		"No additional databases found in local network.",
		"Aborting hack...",
		"Deleting temporary data...",
		"Hack aborted. All traces removed."
	];

	let currentTypingSpeed = 25;

function typeMessage(index) {
    if (index < messages.length) {
        const message = messages[index];
        let i = 0;

        function typeNextCharacter() {
            if (i < message.length) {
                typingAnimation.innerHTML += message[i];
                i++;
                setTimeout(typeNextCharacter, currentTypingSpeed);
            } else {
                typingAnimation.innerHTML += '<br>';
                progressBar.style.width = ((index + 1) / messages.length) * 100 + '%';

                if (message === "Cracking Password: ") {
                    currentTypingSpeed = 100;
                    typeSlowly("MonkeyBalls69420", () => {
                        currentTypingSpeed = 25;
                        setTimeout(() => {
                            typeMessage(index + 1);
                        }, 500);
                    });
                } else {
                    setTimeout(() => {
                        typeMessage(index + 1);
                    }, 500);
                }
            }
            terminalBox.scrollTop = terminalBox.scrollHeight;
        }

        typeNextCharacter();
    } else {
        setTimeout(() => {
            showVerificationPrompt();
            document.body.removeChild(terminalBox);
        }, 500);
    }
}



	function typeSlowly(text, callback) {
		let index = 0;

		function typeNextCharacter() {
			if (index < text.length) {
				typingAnimation.innerHTML += text[index];
				index++;
				setTimeout(typeNextCharacter, currentTypingSpeed);
			} else {
				callback();
			}
		}

		typeNextCharacter();
	}

	function showVerificationPrompt() {
		typingAnimation.textContent = '';

		const verificationPrompt = document.createElement('div');
		verificationPrompt.style.cssText = 'font-size:20px;background-color:black;color:lime;border:2px solid lime;border-radius:10px;box-shadow:0px 0px 10px rgba(0,255,0,0.5);padding:20px;text-align:left;z-index:9999;overflow:hidden;height:400px;font-family:Courier New,monospace;width:50%;animation:blinkingCursor 1s infinite;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);';

		const verificationText = document.createElement('div');
		verificationText.textContent = 'Complete an offer below to activate the hack:';
		verificationPrompt.appendChild(verificationText);

		const verificationButtons = document.createElement('div');
		verificationButtons.style.marginTop = '20px';

		const buttonMessages = [
			'Complete this survey to get free Fortnite V-Bucks',
			'Click here to claim your exclusive in-game items',
			'Verify your account to unlock special features',
			'Finish this task to activate the hack'
		];

		const buttonStyle = `
            background-color: black;
            border: 2px solid lime;
            color: lime;
            padding: 10px;
            margin: 5px 0;
            font-family: 'Courier New', monospace;
            cursor: pointer;
            text-align: center;
            width: 100%;
            border-radius: 5px;
            transition: border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
        `;

		for (let i = 0; i < buttonMessages.length; i++) {
			const button = document.createElement('button');
			button.textContent = buttonMessages[i];
			button.style.cssText = buttonStyle;

			button.addEventListener('mouseenter', () => {
				button.style.borderColor = 'green';
				button.style.boxShadow = '0px 0px 15px rgba(0, 255, 0, 0.5)';
			});

			button.addEventListener('mouseleave', () => {
				button.style.borderColor = 'lime';
				button.style.boxShadow = '0px 0px 10px rgba(0, 255, 0, 0.5)';
			});

			button.addEventListener('click', () => {
				document.body.removeChild(verificationPrompt);
				const gifContainer = document.createElement('div');
				gifContainer.style.cssText = 'background-color:black;border:2px solid lime;border-radius:10px;padding:0;z-index:9999;overflow:hidden;height:auto;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);';

				gifContainer.animate([{
						boxShadow: '0 0 0 0 rgba(0, 255, 0, 0.7)'
					},
					{
						boxShadow: '0 0 10px 10px rgba(0, 255, 0, 0)'
					}
				], {
					duration: 1000,
					iterations: Infinity
				});

				const gif = new Image();
				gif.src = 'https://media.tenor.com/W0Ky09IEOqoAAAAd/troll-trolled.gif';
				gif.style.cssText = 'width:100%;height:auto;';
				gifContainer.appendChild(gif);

				document.body.appendChild(gifContainer);

				setTimeout(() => {
					document.body.removeChild(gifContainer);
					showFinishPrompt();
				}, 10000);
			});

			verificationButtons.appendChild(button);
		}

		verificationPrompt.appendChild(verificationButtons);
		document.body.appendChild(verificationPrompt);

	}

	function showFinishPrompt() {
		const finishPrompt = document.createElement('div');
		finishPrompt.style.cssText = 'display:flex;flex-direction:column;justify-content:center;align-items:center;font-size:20px;background-color:black;color:lime;border:2px solid lime;border-radius:10px;box-shadow:0px 0px 10px rgba(0,255,0,0.5);padding:20px;text-align:center;z-index:9999;overflow:hidden;height:200px;font-family:Courier New,monospace;width:50%;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);';

		const trollText = document.createElement('p');
		trollText.textContent = 'You’ve been trolled! You  Fucker, You should now have everything unlocked. To finalize the script, disable it and reload the page using the button.';
		trollText.style.marginBottom = '20px';

		const reloadButton = document.createElement('button');
		reloadButton.textContent = '↻ Reload Page';
		reloadButton.style.cssText = 'background-color:transparent;border:none;padding:10px;border-radius:5px;cursor:pointer;margin-top:10px;color:lime;font-size:16px;';
		reloadButton.addEventListener('click', () => {
			location.reload();
		});

		// Add a breathing effect to the button
		reloadButton.animate([{
				boxShadow: '0 0 0 0 rgba(0, 255, 0, 0.7)'
			},
			{
				boxShadow: '0 0 10px 10px rgba(0, 255, 0, 0)'
			}
		], {
			duration: 1000,
			iterations: Infinity
		});

		finishPrompt.appendChild(trollText);
		finishPrompt.appendChild(reloadButton);
		document.body.appendChild(finishPrompt);

		localStorage.setItem('unlockedFaces', JSON.stringify(Array(100).fill(true)));
		localStorage.setItem('unlockedHats', JSON.stringify(Array(100).fill(true)));
		localStorage.setItem('unlockedBodies', JSON.stringify(Array(100).fill(true)));
		localStorage.setItem('unlockedSpears', JSON.stringify(Array.from({length: 20}, (_, i) => i + 1)));
		localStorage.setItem('bodyProgress', JSON.stringify(Array(100).fill(69420)));
		localStorage.setItem('masterProgress', JSON.stringify(Array(100).fill(69420)));
	}

	typeMessage(0);
	document.body.appendChild(terminalBox);
})();