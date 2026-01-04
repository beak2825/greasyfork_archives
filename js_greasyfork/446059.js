// ==UserScript==
// @name         ToastPro
// @namespace    https://toastpro.herokuapp.com/
// @version      0.1.5
// @description  A script to go with your EggPro
// @author       Electro
// @match        *://*.koalabeast.com/*
// @require      https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.js
// @require      https://unpkg.com/animejs@3.2.1/lib/anime.min.js
// @icon         https://toastpro.subaverage.site/toast.png
// @supportURL   https://www.reddit.com/message/compose/?to=-Electron-
// @website      https://toastpro.subaverage.site
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/446059/ToastPro.user.js
// @updateURL https://update.greasyfork.org/scripts/446059/ToastPro.meta.js
// ==/UserScript==

(function() {
	'use strict';
	console.log('START: ' + GM_info.script.name + ' (v' + GM_info.script.version + ' by ' + GM_info.script.author + ')');

	const TOAST_SERVER_HOST = window.TOAST_SERVER_HOST || "toastpro.subaverage.site";
	let wsocket = null;

	const CONSTANTS = {
		EMOTE_COUNT: 32,
		PING_LIFETIME: 2500,
		PING_IN_OUT_LIFETIME: 250,
		AUTHENTICATION_TIMEOUT: 30 * 24 * 60 * 60 * 1000,
		WEBSOCKET_TIMEOUT: 10000,
		EMOTES: {
			SIZE: 24,
			CROP_SIZE: 32
		}
	};
	const EVENTS = {
		AUTHENTICATE: 1,
		AUTHENTICATE_SUCCESS: 2,
		AUTHENTICATE_FAIL: 3,
		ENDORSEMENT: 4,
		POSITION_PING: 5,
		EMOTE: 6
	};
	let TOASTPRO_DATA = localStorage.getItem('TOASTPRO_DATA') || '{}';
	let TOASTPRO_AUTHENTICATED = false;
	TOASTPRO_DATA = JSON.parse(TOASTPRO_DATA);
	TOASTPRO_DATA = {
		LAST_PROFILE_RETRIEVAL: 0,
		EMOTES: [0, 0, 0, 0, 0, 0, 0, 0],
		PING_SOUND_VOLUME: 0.6,
		EMOTE_SOUND_VOLUME: 0.6,
		POSITION_PING_OPACITY: 0.85,
		EMOTE_OPACITY: 0.85,
		PING_FLAIR_SCALE: 1,
		...TOASTPRO_DATA
	};

	if(location.pathname.startsWith('/profile/')) {
		domReady(() => {
			$('head').append(`
<style>
#toastProModal p {
	margin: 0;
}

#selectableEmotes {
	width: 100%;
	padding: 0.5rem;
}

#selectableEmotes .emote {
	display: inline-block;
}

#selectableEmotes {
	display: inline-block;
}

#equippedEmotes .emote {
	transition: 0.25s all ease-in-out;
	position: relative;
	bottom: 0px;
}

.emote {
	width: 32px;
	height: 32px;
	/* background-size: 1264px 16px; */
	cursor: pointer;
	background-image: url(${'https://' + TOAST_SERVER_HOST}/emotes.png);
}

.emote.selected-emote {
	position: relative;
	bottom: 8px !important;
}

.emote-list {
	display: inline-flex;
}

#toastProModal .settings-table {
	width: 100%;
}
</style>
`);
			$(`
<div class="form-group">
	<label class="col-sm-4 control-label">ToastPro</label>
	<div class="col-sm-8 form-link">
		<a href="#" data-toggle="modal" data-target="#toastProModal">Configure your Toaster 🍞</a>
	</div>
</div>`).insertAfter($('#settings form .form-group').eq(6));
			$('body').append(`
<div class="modal fade" id="toastProModal" tabindex="-1" role="dialog" aria-labelledby="toastProModalLabel" style="display: none;">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="btn btn-default close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
				<h4 class="modal-title" id="toastProModalLabel">ToastPro 🍞</h4>
			</div>
			<div class="modal-body">
				<div class="row">
					<div class="col text-center">
						<p class="m-0">Authentication Status: <span id="authenticationStatus">Loading...</span></p>
					</div>
				</div>
				<hr>

				<div class="row">
					<div class="col-sm-6">
						<p style="margin-bottom: 0.5rem;">Equipped Emotes:</p>
						<div id="equippedEmotes" class="emote-list">
							<div class="emote selected-emote" data-id="${TOASTPRO_DATA.EMOTES[0]}" data-index="0"></div>
							<div class="emote" data-id="${TOASTPRO_DATA.EMOTES[1]}" data-index="1"></div>
							<div class="emote" data-id="${TOASTPRO_DATA.EMOTES[2]}" data-index="2"></div>
							<div class="emote" data-id="${TOASTPRO_DATA.EMOTES[3]}" data-index="3"></div>
							<div class="emote" data-id="${TOASTPRO_DATA.EMOTES[4]}" data-index="4"></div>
							<div class="emote" data-id="${TOASTPRO_DATA.EMOTES[5]}" data-index="5"></div>
							<div class="emote" data-id="${TOASTPRO_DATA.EMOTES[6]}" data-index="6"></div>
							<div class="emote" data-id="${TOASTPRO_DATA.EMOTES[7]}" data-index="7"></div>
						</div>
					</div>
					<div class="col-sm-6">
						<div id="selectableEmotes" class="emote-list"></div>
					</div>
				</div>
				<hr>
				<div class="row">
					<div class="col-sm-12">
						<table class="settings-table">
							<tbody>
								<tr>
									<td data-label="PING_SOUND_VOLUME">Ping SFX Volume (<span>0</span>): </td>
									<td><input type="range" class="toast-setting" name="PING_SOUND_VOLUME" min="0" max="1" step="0.05"></td>
								</tr>
								<tr>
									<td data-label="EMOTE_SOUND_VOLUME">Emote SFX Volume (<span>0</span>): </td>
									<td><input type="range" class="toast-setting" name="EMOTE_SOUND_VOLUME" min="0" max="1" step="0.05"></td>
								</tr>
								<tr>
									<td data-label="POSITION_PING_OPACITY">Position Ping Opacity (<span>0</span>): </td>
									<td><input type="range" class="toast-setting" name="POSITION_PING_OPACITY" min="0" max="1" step="0.05"></td>
								</tr>
								<tr>
									<td data-label="EMOTE_OPACITY">Emote Opacity (<span>0</span>): </td>
									<td><input type="range" class="toast-setting" name="EMOTE_OPACITY" min="0" max="1" step="0.05"></td>
								</tr>
								<tr>
									<td data-label="PING_FLAIR_SCALE">Ping Flair Scale (<span>0</span>): </td>
									<td><input type="range" class="toast-setting" name="PING_FLAIR_SCALE" min="0.8" max="1.5" step="0.05"></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<p class="status-message" style="display: none;"></p>
				<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
				<!-- <button type="button" class="btn btn-primary" id="saveToastProSettings">Save changes</button> -->
			</div>
		</div>
	</div>
</div>
`);

			authenticate().then(() => {
				if(TOASTPRO_AUTHENTICATED) {
					$("#authenticationStatus").text("Authenticated!");
				} else {
					$("#authenticationStatus").text("Not Authenticated!");
				}
			});

			$('#saveToastProSettings').click(() => {
				$('#toastProModal .status-message').text("Saved settings!");
				$('#toastProModal .status-message').slideDown();
				setTimeout(() => $('#toastProModal .status-message').slideUp(), 2000);
			});

			$("#equippedEmotes .emote").click(function(e){
				$("#equippedEmotes .emote").removeClass("selected-emote");
				$(this).addClass("selected-emote");
			});

			$('#toastProModal .toast-setting').each(function(){
				if(this.type === 'range') {
					this.value = TOASTPRO_DATA[this.name];
					$(`[data-label="${this.name}"] span`).text(this.value);
				}
			});

			$('#toastProModal .toast-setting').on('input change', function(e) {
				let settingName = e.currentTarget.name;

				if(e.currentTarget.type === 'range') {
					TOASTPRO_DATA[settingName] = Number(e.currentTarget.value);
					$(`[data-label="${settingName}"] span`).text(TOASTPRO_DATA[settingName]);
				}

				saveToastProData();
			});

			for (let i = 0; i < CONSTANTS.EMOTE_COUNT; i++) {
				$("#selectableEmotes").append(`
				<div class="emote" data-id="${i}"></div>
			`);
			}

			$("#selectableEmotes .emote").click(function(e){
				if($(".selected-emote").length === 0) return;

				$(".selected-emote").attr("data-id", $(this).attr("data-id"));

				TOASTPRO_DATA.EMOTES[Number($(".selected-emote").attr("data-index"))] = Number($(".selected-emote").attr("data-id"));
				saveToastProData();

				updateEmoteIcons();
			});

			updateEmoteIcons();
		});
	} else if(location.pathname.startsWith('/groups/')) {
		authenticate().then(() => {
			if(TOASTPRO_AUTHENTICATED) {
				$("#authenticationStatus").text("Authenticated!");
			} else {
				$("#authenticationStatus").text("Not Authenticated!");
			}
		});
	} else if(location.pathname.startsWith('/game') && !location.pathname.startsWith('/games')) {
		let startedToast = false;
		domReady(() => tagpro.ready(() => {
			tagpro.socket.on('map', function(data) {
				if (data.info.name === "eggball"){
					startToastIngame();
				}
			});

			tagpro.socket.on("eggBall", function(data) {
				startToastIngame();
			});
		}));

		async function startToastIngame() {
			if(startedToast) return;
			startedToast = true;

			$('head').append(`<style>
		.game #mapInfo {
			margin-bottom: 0;
		}

		#toastInfo {
			margin-bottom: 10px;
		}

		#emoteWheel {
			width: 25vw;
			height: 25vh;
			position: absolute;
			left: 50%;
			top: 56%;
			-webkit-transform: translate(-50%, -50%);
			transform: translate(-50%, -50%);
			pointer-events: none;
		}
		#emoteWheel table {
			margin: 0 auto;
			border-collapse: inherit;
		}

		#emoteWheel td {
			width: 40px;
			height: 40px;
			border: 2px solid rgba(0, 0, 0, 0.8);
			border-radius: 50%;
			background-color: rgba(0, 0, 0, 0.3);
		}

		.emote-wheel-crop {
			width: 32px;
			height: 32px;
			margin: 0 auto;
			background-image: url(${'https://' + TOAST_SERVER_HOST}/emotes.png);
		}

		td.selected-emote {
			border: 2px solid rgba(139, 195, 74, 0.7) !important;
			background-color: rgba(139, 195, 74, 0.2) !important;
		}

		.mid-wheel {
			opacity: 0;
		}
		</style>`);

			$(`<div id="toastInfo">🍞 Toast Connecting...</div>`).insertAfter('#mapInfo');
			$('body').append(`
<div id="emoteWheel">
	<table>
		<tbody>
			<tr>
				<td><div class="emote-wheel-crop" data-id="${TOASTPRO_DATA.EMOTES[0]}"></div></td>
				<td><div class="emote-wheel-crop" data-id="${TOASTPRO_DATA.EMOTES[1]}"></div></td>
				<td><div class="emote-wheel-crop" data-id="${TOASTPRO_DATA.EMOTES[2]}"></div></td>
			</tr>
			<tr>
				<td><div class="emote-wheel-crop" data-id="${TOASTPRO_DATA.EMOTES[3]}"></div></td>
				<td class="mid-wheel"></td>
				<td><div class="emote-wheel-crop" data-id="${TOASTPRO_DATA.EMOTES[4]}"></div></td>
			</tr>
			<tr>
				<td><div class="emote-wheel-crop" data-id="${TOASTPRO_DATA.EMOTES[5]}"></div></td>
				<td><div class="emote-wheel-crop" data-id="${TOASTPRO_DATA.EMOTES[6]}"></div></td>
				<td><div class="emote-wheel-crop" data-id="${TOASTPRO_DATA.EMOTES[7]}"></div></td>
			</tr>
		</tbody>
	</table>
</div>
`);

			$("#emoteWheel").hide();
			$(".emote-wheel-crop").each(function(idx){
				let xPos = $(this).attr("data-id") * 32;
				$(this).css("background-position", "-" + xPos + "px 0px");

				let cropParent = $(this).parent();
				cropParent.css("position", "relative");

				if(idx === 1){
					cropParent.css("top", "-20px");
				} else if(idx === 3){
					cropParent.css("left", "-20px");
				} else if(idx === 4){
					cropParent.css("right", "-20px");
				} else if(idx === 6){
					cropParent.css("bottom", "-20px");
				}
			});

			await new Promise(resolve => {
				let interval = setInterval(() => {
					if(tagpro.players[tagpro.playerId] || tagpro.spectator) {
						clearInterval(interval);
						resolve();
					}
				}, 250);
			});

			wsocket = new WebSocket('wss://' + TOAST_SERVER_HOST);
			const clientPlayer = tagpro.spectator ? null : tagpro.players[tagpro.playerId];
			let authFailed = false;
			let rightMouseDown = false;
			let rightMouseDownPoint = {x: 0, y: 0};
			let mousePos = {x: 0, y: 0};
			let endorsementInterval;
			let lastPingTime = Date.now();
			let positionPings = new Map();
			let selectedEmote = 0;
			let emoteBaseTexture = null;
			let pingSoundEffect = () => {
				let audio = new Audio('https://' + TOAST_SERVER_HOST + '/posping.mp3');
				audio.volume = TOASTPRO_DATA.PING_SOUND_VOLUME;
				return audio;
			}

			let emoteSoundEffect = () => {
				let audio = new Audio('https://' + TOAST_SERVER_HOST + '/select_emote.mp3');
				audio.volume = TOASTPRO_DATA.EMOTE_SOUND_VOLUME;
				return audio;
			}

			PIXI.Loader.shared.onComplete.once(function() {
				emoteBaseTexture = new PIXI.BaseTexture(PIXI.Loader.shared.resources.emotes.data);
			});

			PIXI.Loader.shared
				.add('ping-target', 'https://' + TOAST_SERVER_HOST + '/target.png')
				.add('emotes', 'https://' + TOAST_SERVER_HOST + '/emotes.png').load();

			wsocket.addEventListener('open', function() {
				if(clientPlayer) {
					wsocket.send(makePacket({
						event: EVENTS.AUTHENTICATE,
						data: { name: clientPlayer.name, token: Cookies.get('nekotizer') || "meow", gameID: tagproConfig.gameId }
					}));
				} else {
					wsocket.send(makePacket({
						event: EVENTS.AUTHENTICATE,
						data: { spectator: true, gameID: tagproConfig.gameId }
					}));
				}
			});

			wsocket.addEventListener('message', eventPacket => {
				const { event, data } = parse(eventPacket.data);

				if(event === EVENTS.AUTHENTICATE_SUCCESS) {
					$('#toastInfo').text('🍞 Toast Connected!');

					endorsementTick();
					endorsementInterval = setInterval(endorsementTick, 4000);
				} else if(event === EVENTS.AUTHENTICATE_FAIL) {
					$('#toastInfo').text('🍞 Toast Disconnected! ERRCODE: ' + data);
					authFailed = true;
				} else if(event === EVENTS.POSITION_PING) {
					createPositionalPing(getPlayerFromName(data[0]), data[1], data[2]);
				} else if(event === EVENTS.EMOTE) {
					showEmote(getPlayerFromName(data[0]), data[1]);
				}
			});

			wsocket.addEventListener('ping', heartbeat);
			wsocket.addEventListener('close', function clear() {
				clearTimeout(wsocket.pingTimeout);
				clearInterval(endorsementInterval);
				if(!authFailed) $('#toastInfo').text('🍞 Toast Disconnected! ERRCODE: TIMEOUT');
			});

			$('#viewport').on('mousemove', function(e) {
				mousePos = {x: e.offsetX, y: e.offsetY}
			});

			$('#viewport').on('mousedown contextmenu', function(e) {
				if(tagpro.spectator) return;
				if(e.type === "contextmenu"){
					e.preventDefault();
					return;
				}

				let isRightMB;
				e = e || window.event;
				if ("which" in e) { // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
					isRightMB = e.which == 3;
				} else if ("button" in e) { // IE, Opera
					isRightMB = e.button == 2;
				}

				if(isRightMB) {
					e.preventDefault();

					const pos = {
						x: tagpro.players[tagpro.playerId].x + (mousePos.x - ($('#viewport').width() / 2)),
						y: tagpro.players[tagpro.playerId].y + (mousePos.y - ($('#viewport').height() / 2))
					};
					wsocket.send(makePacket({event: EVENTS.POSITION_PING, data: [Math.floor(pos.x), Math.floor(pos.y)]}));
				}
			});

			$('#viewport').on('mouseup', function(e) {
				if(tagpro.spectator) return;
				if(e.which === 3) {
					e.preventDefault();
					rightMouseDown = false;
					// $("#emoteWheel").hide();
				}
			});

			$(document).on('keydown', function(e) {
				if(tagpro.spectator) return;
				let emoteKeys = [49, 50, 51, 52, 53, 54, 55, 56];
				let selectedEmote = emoteKeys.indexOf(e.keyCode);

				if(selectedEmote !== -1) {
					wsocket.send(makePacket({event: EVENTS.EMOTE, data: TOASTPRO_DATA.EMOTES[selectedEmote]}));
				}
			});

			function endorsementTick() {
				const endorsementObject = makePlayerEndorsements();
				wsocket.send(makePacket({event: EVENTS.ENDORSEMENT, data: endorsementObject}));
			}

			function createPositionalPing(player, x, y) {
				if(!player) return;
				if(player.dead) return;

				let oldPosPing = positionPings.get(player.name);
				if(oldPosPing) {
					oldPosPing.tween.pause();
					oldPosPing.tween.seek(CONSTANTS.PING_LIFETIME + (CONSTANTS.PING_IN_OUT_LIFETIME * 2));
					oldPosPing.tween.play();
					positionPings.delete(player.name);
				}

				let pingContainer = new PIXI.Container();
				let pingOutlineSprite = new PIXI.Sprite.fromImage(PIXI.Loader.shared.resources['ping-target'].texture);
				let flairSprite = new PIXI.Sprite(player.sprites.flair.texture);

				pingContainer.addChild(pingOutlineSprite);
				pingContainer.addChild(flairSprite);

				flairSprite.x = 16;
				flairSprite.y = 16;
				flairSprite.anchor.x = 0.5;
				flairSprite.anchor.y = 0.5;
				flairSprite.width *= TOASTPRO_DATA.PING_FLAIR_SCALE;
				flairSprite.height *= TOASTPRO_DATA.PING_FLAIR_SCALE;

				pingOutlineSprite.tint = player.team === 1 ? 0xFF0000 : 0x0000FF;

				pingContainer.x = x + 19;
				pingContainer.y = y + 19;
				pingContainer.alpha = 0;
				pingContainer.pivot.x = pingContainer.width / 2
				pingContainer.pivot.y = pingContainer.height / 2
				pingContainer.rotation = Math.PI * 0.25;

				tagpro.renderer.layers.foreground.addChild(pingContainer);
				pingContainer.pingID = Math.floor(Math.random() * 1000);

				let tween = anime({
					targets: pingContainer,
					keyframes: [
						{ alpha: TOASTPRO_DATA.POSITION_PING_OPACITY, rotation: 0, easing: 'easeOutQuint', duration: CONSTANTS.PING_IN_OUT_LIFETIME },
						{ alpha: TOASTPRO_DATA.POSITION_PING_OPACITY, rotation: 0, delay: CONSTANTS.PING_LIFETIME },
						{ alpha: 0,    rotation: -Math.PI * 0.25, easing: 'easeOutQuint', delay: CONSTANTS.PING_IN_OUT_LIFETIME, duration: CONSTANTS.PING_IN_OUT_LIFETIME }
					],
					complete: (anim) => {
						let currentPosPing = positionPings.get(player.name);
						pingContainer.destroy({
							children: true
						});

						if(currentPosPing && currentPosPing.pingID === pingContainer.pingID) {
							positionPings.delete(player.name);
						}
					}
				});

				pingContainer.tween = tween;

				if(typeof player.pingSound === 'undefined') {
					player.pingSound = pingSoundEffect();
				}

				player.pingSound.play();

				positionPings.set(player.name, pingContainer);
			}

			function showEmote(player, emoteID) {
				if(!player) return;
				if(!emoteBaseTexture) return;
				if(player.dead) return;

				if(typeof player.sprites.emote === 'undefined') {
					player.sprites.emote = new PIXI.Sprite();
					player.sprites.ball.addChild(player.sprites.emote);
					player.sprites.emote.width = CONSTANTS.EMOTES.SIZE;
					player.sprites.emote.height = CONSTANTS.EMOTES.SIZE;
					player.sprites.emote.anchor.x = 0.5;
					player.sprites.emote.anchor.y = 0.5;
					player.sprites.emote.x = player.sprites.actualBall.width / 2;
					player.sprites.emote.y = player.sprites.actualBall.height / 2;
					player.sprites.emote.alpha = TOASTPRO_DATA.EMOTE_OPACITY;
				} else {
					player.sprites.emote.tween.pause();
					player.sprites.emote.tween = null;
				}

				let emoteTexture = new PIXI.Texture(
					emoteBaseTexture,
					new PIXI.Rectangle(
						emoteID * CONSTANTS.EMOTES.CROP_SIZE,
						0,
						CONSTANTS.EMOTES.CROP_SIZE,
						CONSTANTS.EMOTES.CROP_SIZE
					)
				);

				player.sprites.emote.texture = emoteTexture;

				player.sprites.emote.width = 0;
				player.sprites.emote.height = 0;

				player.sprites.emote.tween = anime({
					targets: player.sprites.emote,
					keyframes: [
						{ width: CONSTANTS.EMOTES.SIZE, height: CONSTANTS.EMOTES.SIZE, easing: 'easeOutBounce', duration: 200 },
						{ width: CONSTANTS.EMOTES.SIZE, height: CONSTANTS.EMOTES.SIZE, delay: 2000 },
						{ width: 0, height: 0, easing: 'easeOutBounce', duration: 200 }
					]
				});

				if(typeof player.emoteSound === 'undefined') {
					player.emoteSound = emoteSoundEffect();
				}

				player.emoteSound.play();
			}

			animate();
			function animate() {
				requestAnimationFrame(animate);

				if(rightMouseDown) {
					const angleSubDivision = (Math.PI * 2) / 8;
					const centerPoint = {x: $('#viewport').width() / 2, y: $('#viewport').height() / 2};
					const angle = angleFromPoints(centerPoint.x, centerPoint.y, mousePos.x, mousePos.y) + (angleSubDivision / 2);
					selectedEmote = (Math.floor(angle / angleSubDivision) + 4) % 8;

					$(".emote-wheel-crop").parent().removeClass("selected-emote");
					$(".emote-wheel-crop").eq(selectedEmote).parent().addClass("selected-emote");
				}
			}
		}
	}

	function getPlayerFromName(name) {
		let playerKeys = Object.keys(tagpro.players);

		for(const key of playerKeys) {
			if(tagpro.players[key].name.toUpperCase() === name.toUpperCase() && tagpro.players[key].auth) return tagpro.players[key];
		}

		return null;
	}

	function makePlayerEndorsements() {
		return Object.keys(tagpro.players).reduce((acc, playerID) => {
			const player = tagpro.players[playerID];
			if(!player.auth) return acc;
			acc[player.name] = {team: player.team};
			return acc;
		}, {});
	}

	function domReady(callback){
		// in case the document is already rendered
		if (document.readyState !== 'loading') callback();
		// modern browsers
		else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
		// IE <= 8
		else document.attachEvent('onreadystatechange', function(){
			if (document.readyState === 'complete') callback();
		});
	}

	function saveToastProData() {
		localStorage.setItem('TOASTPRO_DATA', JSON.stringify(TOASTPRO_DATA));
	}

	function makePacket({event, data}) {
		return JSON.stringify([event, data]);
	}

	function parse(data) {
		try {
			let parsed = JSON.parse(data);
			if(!Array.isArray(parsed)) throw new Error("Packet is not an array.");
			return {event: parsed[0], data: parsed[1]};
		} catch(e) {
			console.error("PACKET PARSE ERROR:", e);
			return {event: null, data: null};
		}
	}

	function updateEmoteIcons(){
		$(".emote").each(function(idx){
			let xPos = $(this).attr("data-id") * 32;
			$(this).css("background-position", "-" + xPos + "px 0px");
		});
	}

	function angleFromPoints(cx, cy, ex, ey) {
		let dy = ey - cy;
		let dx = ex - cx;
		let theta = Math.atan2(dy, dx); // range (-PI, PI]
		return theta;
	}

	async function authenticate() {
		if(Date.now() - TOASTPRO_DATA.LAST_PROFILE_RETRIEVAL > 0.0001 * 60000) {
			const tagproName = await getTagProName();
			let token = Cookies.get('nekotizer');

			TOASTPRO_DATA.LAST_PROFILE_RETRIEVAL = Date.now();
			saveToastProData();

			const isAuthJSON = await fetch('https://' + TOAST_SERVER_HOST + '/is_auth', {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: tagproName,
					token: token || "meow"
				})
			}).then(r => r.json());
			if(isAuthJSON.error) return console.error("TOASTPRO: Failed to authenticate", isAuthJSON.error) || false;
			if(isAuthJSON.authenticated) {
				TOASTPRO_AUTHENTICATED = true;
				return true;
			}

			const response = await fetch('https://' + TOAST_SERVER_HOST + '/auth', {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: tagproName,
					token: token || "bark"
				})
			}).then(r => r.json());

			if(response.error) return console.error("TOASTPRO: Failed to authenticate", response.error) || false;

			Cookies.set('nekotizer', response.token, {
				expires: new Date(Date.now() + CONSTANTS.AUTHENTICATION_TIMEOUT),
				domain: '.koalabeast.com'
			});
			TOASTPRO_AUTHENTICATED = true;
		}
	}

	async function getTagProName() {
		const profileID = $('#profile-btn').attr('href').split('/').at(-1);
		const tagproProfile = await fetch('https://' + location.host + '/profiles/' + profileID).then(r => r.json());
		return tagproProfile[0].reservedName;
	}

	async function getTagProNameDEBUG() {
		return "Electro";
	}

	function heartbeat() {
		if(!wsocket) return;
		clearTimeout(wsocket.pingTimeout);

		// Use `WebSocket#terminate()`, which immediately destroys the connection,
		// instead of `WebSocket#close()`, which waits for the close timer.
		// Delay should be equal to the interval at which your server
		// sends out pings plus a conservative assumption of the latency.
		wsocket.pingTimeout = setTimeout(() => {
			if(!wsocket) return;
			wsocket.close();
		}, 10000 + 1000);
	}
})();