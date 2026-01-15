// ==UserScript==
// @name         MC-Skin
// @namespace    https://viayoo.com/
// @version      4.5
// @description  在网页里添加一个MC小人
// @author       undefined303
// @license      MIT
// @homepageURL  https://greasyfork.org/zh-CN/scripts/537235
// @run-at       document-end
// @match        *
// @include      *
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @require      data:text/javascript,const%20origdef%20%3D%20window.define%3B
// @require      data:text/javascript,window.define%20%3F%20window.define%20%3D%20undefined%3A%20null%3B
// @require      https://fastly.jsdelivr.net/npm/skinview3d@3.4.1/bundles/skinview3d.bundle.min.js
// @require      https://fastly.jsdelivr.net/npm/three@0.128.0/build/three.min.js
// @require      data:text/javascript,window.define%20%3D%20origdef%3B
// @downloadURL https://update.greasyfork.org/scripts/537235/MC-Skin.user.js
// @updateURL https://update.greasyfork.org/scripts/537235/MC-Skin.meta.js
// ==/UserScript==
(function() {
	const key = encodeURIComponent('MC skin：执行判断');
	if (window[key]) {
		return;
	}
	window[key] = true;
	'use strict'
	var skin = GM_getValue("skin", null);

	function rafThrottle(func) {
		let lock = false;
		return function(...args) {
			if (lock) return;
			lock = true;
			window.requestAnimationFrame(() => {
				func.apply(this, args);
				lock = false;
			});
		};
	}

	function getIframeIndex(id, max) {
		var messageListener;
		return new Promise((resolve, reject) => {
			var timeout = setTimeout(() => {
				reject();
			}, 500);
			messageListener = (e) => {
				if (e.data.type == "McSkinIframeIndex") {
					e.stopImmediatePropagation();
					//4.读取index
					if (id == e.data.id) {
						var index = e.data.data;
						if (index <= max) {
							resolve(index);
							clearTimeout(timeout);
						} else {
							reject();
							clearTimeout(timeout);
						}
					}
				}
			}
			window.addEventListener("message", messageListener, {
				passive: true
			})
		}).then((data) => {
			window.removeEventListener("message", messageListener)
			return data;
		}).catch(() => {
			window.removeEventListener("message", messageListener)
			console.error("iframe获取index信息超时");
			return "error";
		})
	}
	window.addEventListener("message", async function(e) {
		if (e.data.type == "McSkinIframeGetPosition") {
			e.stopImmediatePropagation();
			//2.收到获取位置信息请求，发送询问谁需要位置信息
			var iframes = [...document.getElementsByTagName("iframe")]
			var i = -1;
			iframes.forEach((ele) => {
				i++;
				ele.contentWindow.postMessage({
					type: "McSkinIframeGetPositionIndex",
					id: e.data.id,
					index: i
				}, "*")

			})
			var iframeIndex = await getIframeIndex(e.data.id, iframes.length - 1);
			if (iframeIndex == "error") {
				iframes.forEach((ele) => {
					ele.contentWindow.postMessage({
						type: "McSkinIframeGetPositionError",
						id: e.data.id
					}, "*")
				})
				return;
			}
			//使用上一帧布局信息，避免强制同步布局
			requestAnimationFrame(() => {
				var bcr = iframes[iframeIndex].getBoundingClientRect();
				//5.发送位置信息
				iframes[iframeIndex].contentWindow.postMessage({
					type: "McSkinIframePositionData",
					data: {
						x: bcr.left,
						y: bcr.top
					},
					id: e.data.id
				}, "*")
			})
		}
	}, {
		passive: true
	})
	if (self != top) {
		var isGettingPosition = false;

		function messageReceiver(e) {
			if (e.data.type == 'McSkinIframeGetPositionIndex') {
				e.stopImmediatePropagation();
				//3.收到询问信息，如果需要，回答index
				if (isGettingPosition) {
					window.parent.postMessage({
						type: "McSkinIframeIndex",
						data: e.data.index,
						id: e.data.id
					}, '*');
				}
				isGettingPosition = false;
			}
		}

		window.addEventListener('message', messageReceiver, {
			passive: true
		})
		var getIframePosition = function() {
			var id = Date.now() + Math.random();
			//1.发送请求获取位置信息
			window.parent.postMessage({
				type: "McSkinIframeGetPosition",
				id: id
			}, '*');
			return new Promise((resolve, reject) => {
				var timeout = setTimeout(() => {
					window.removeEventListener("message", positionMessageReceiver);
					reject();
				}, 500);
				isGettingPosition = true;

				function positionMessageReceiver(e) {
					if (e.data.type == "McSkinIframePositionData" && e.data.id == id) {
						e.stopImmediatePropagation();
						//6.接受位置信息
						var positionData = e.data.data;
						window.removeEventListener("message", positionMessageReceiver);
						if (positionData == "error") {
							reject();
							clearTimeout(timeout);
							return;
						}
						resolve(positionData);
						clearTimeout(timeout);
					}
					if (e.data.type == "McSkinIframePositionError" && e.data.id == id) {
						window.removeEventListener("message", positionMessageReceiver);
						reject();
						clearTimeout(timeout);
						return;
					}
				}
				window.addEventListener('message', positionMessageReceiver, {
					passive: true
				})
			}).then((data) => {
				return data;
			}).catch(() => {
				console.error("iframe获取位置信息超时");
				return "error";
			})
		}
		var lock = false;

		function getIframePositionDebounceFunction() {
			return new Promise((resolve, reject) => {
				if (!lock) {
					lock = true;
					var timeout = setTimeout(() => {
						reject();
					}, 500)
					requestAnimationFrame(async () => {
						var positionData = await getIframePosition();
						if (positionData) {
							resolve(positionData);
							clearTimeout(timeout);
						}
						lock = false;
					})
				} else {
					reject();
				}
			}).then((data) => {
				return data;
			}).catch(() => {
				//locked or timeout
				return "error"
			})
		}
		async function pushEventMessage(e) {
			if (document.domain.split('.').slice(-2).join(".") == "githubusercontent.com") return;
			let data = {};
			if (e.type == "touchstart" || e.type == "touchmove" || e.type == "mousemove") {
				let lock = false;
				var positionData = await getIframePositionDebounceFunction();
				if (positionData == "error") {
					return;
				}
			}
			positionData = positionData || {};
			var x = positionData.x;
			var y = positionData.y;
			data.type = e.type;
			e.clientX ? data.clientX = e.clientX + x : null;
			e.clientY ? data.clientY = e.clientY + y : null;
			if (e.targetTouches && e.type != "touchend" && e.type != "touchcancel") {
				data.targetTouches = [{
					clientX: e.targetTouches[0].clientX + x,
					clientY: e.targetTouches[0].clientY + y
				}]
			}
			e.wheelDelta ? data.wheelDelta = e.wheelDelta : null;
			e.detail ? data.detail = e.detail : null;
			window.parent.postMessage({
				type: "McSkinIframeEventData",
				data: data
			}, "*");
		}

		window.addEventListener("mousemove", pushEventMessage, {
			passive: true,
			capture: true
		});
		window.addEventListener("touchstart", pushEventMessage, {
			passive: true,
			capture: true
		});
		window.addEventListener("touchmove", pushEventMessage, {
			passive: true,
			capture: true
		});
		window.addEventListener("touchend", pushEventMessage, {
			passive: true,
			capture: true
		});
		window.addEventListener("touchcancel", pushEventMessage, {
			passive: true,
			capture: true
		});
		window.addEventListener("wheel", pushEventMessage, {
			passive: true,
			capture: true
		})
		window.addEventListener("mousedown", pushEventMessage, {
			passive: true,
			capture: true
		})
		document.addEventListener('keydown', pushEventMessage, {
			passive: true,
			capture: true
		});
		window.addEventListener("message", async (e) => {
			if (e.data.type == "McSkinIframeEventData" && e.source != window.parent && e.source != top) {
				e.stopImmediatePropagation();
				let data = {};
				var positionData = await getIframePosition();
				var x = positionData.x;
				var y = positionData.y;
				data.type = e.data.data.type;
				e.data.data.clientX ? data.clientX = e.data.data.clientX + x : null;
				e.data.data.clientY ? data.clientY = e.data.data.clientY + y : null;
				if (e.data.data.targetTouches && data.type != "touchend" && data.type != "touchcancel") {
					data.targetTouches = [{
						clientX: e.data.data.targetTouches[0].clientX + x,
						clientY: e.data.data.targetTouches[0].clientY + y
					}]
				}
				e.data.data.wheelDelta ? data.wheelDelta = e.data.data.wheelDelta : null;
				e.data.data.detail ? data.detail = e.data.data.detail : null;
				window.parent.postMessage({
					type: "McSkinIframeEventData",
					data: data
				}, "*");
			}
		}, {
			passive: true
		})
		return;
	}

	console.log("%cMcSkin.js", "color:orange");
	var defaultRotation = GM_getValue("defaultRotation", -0.25);
	var mouseFollowMode = GM_getValue("mouseFollowMode", "bedrock");
	const box = document.createElement("div");
	document.documentElement.append(box);
	const shadow = box.attachShadow({
		mode: "closed"
	});
	const inner = document.createElement("main");
	shadow.append(inner);
	var dialog = inner.appendChild(document.createElement("dialog"));
	dialog.setAttribute("style", `border:none !important;
border-radius:10px !important;
width:min(70vw,350px) !important;
max-width:100vw !important;
text-align:center !important;
 padding:40px 5px !important;
box-shadow:0px 0px 7px 1px rgba(0,0,0,.3) !important;
backdrop-filter: blur(50px);
-webkit-backdrop-filter: blur(50px);
background-color: rgba(255, 255, 255, 0.8);
outline:none !important;
font-size:0px;
`)
	var span = document.body.appendChild(document.createElement("span"));
	span.setAttribute("style", "font-size:1.2em");
	var fontSize = window.getComputedStyle(span).fontSize;
	document.body.removeChild(span);
	dialog.addEventListener("click", e => {
		const dialogDimensions = dialog.getBoundingClientRect()
		if (
			e.clientX < dialogDimensions.left ||
			e.clientX > dialogDimensions.right ||
			e.clientY < dialogDimensions.top ||
			e.clientY > dialogDimensions.bottom
		) {
			dialog.close()
		}
	}, {
		passive: true
	})
	var removeAllChild = function(node) {
		while (node.hasChildNodes()) {
			node.removeChild(node.lastChild);
		}
	}
	skin = GM_getValue("skin", skin);

	var uploadSkin = function(isSave) {
		return new Promise((resolve, reject) => {
			let input = document.createElement('input');
			input.type = 'file';
			input.accept = 'image/png';
			input.style.display = 'none';
			input.multiple = false;
			input.addEventListener('change', (event) => {
				let file = event.target.files[0];
				if (!file) {
					reject(new Error('No file selected'));
					return;
				}
				if (file.type !== 'image/png') {
					reject(new Error('Only PNG files are allowed'));
					return;
				}
				dialog.close();
				let reader = new FileReader();
				reader.onload = (e) => {
					try {
						const base64 = e.target.result;
						skinViewer.loadSkin(base64);
						skin = base64;
						if (isSave) {
							GM_setValue("skin", base64);
						}
						resolve(base64);
					} catch (error) {
						reject(error);
					}
				};
				reader.onerror = (error) => reject(error);
				reader.readAsDataURL(file);
			});
			document.body.appendChild(input);
			input.click();
			setTimeout(() => {
				document.body.removeChild(input);
			}, 200)
		});
	}

	var createSkinPickerDialog = function(isSave, info) {
		removeAllChild(dialog);
		let span = dialog.appendChild(document.createElement("span"));
		span.style.fontSize = fontSize;
		span.innerText = info;
		span.style.display = "block";
		let wrap = dialog.appendChild(document.createElement("div"));
		wrap.style.display = "block";
		let nameInp = wrap.appendChild(document.createElement("input"));
		nameInp.placeholder = "使用正版ID获取皮肤";
		nameInp.setAttribute("style", `
outline:none;
border:none;
border-radius:0;
border-bottom:2px solid black;
background:transparent;
margin-right:10px;
`)
		let upload;
		nameInp.addEventListener("input", function() {
			if (nameInp.value != "") {
				uploadBtn.innerText = "获取皮肤";
				upload = function() {
					let span1 = dialog.appendChild(document.createElement("span"));
					span1.style.fontSize = fontSize;
					span1.innerText = `获取中 ...`;
					span1.style.display = "block";
					const username = nameInp.value.trim();
					GM_xmlhttpRequest({
						method: 'GET',
						url: `https://api.mojang.com/users/profiles/minecraft/${username}`,
						onload: function(uuidResponse) {
							try {
								const uuidData = JSON.parse(uuidResponse.responseText);
								const uuid = uuidData.id;
								GM_xmlhttpRequest({
									method: 'GET',
									url: `https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`,
									onload: function(profileResponse) {
										try {
											const profileData = JSON.parse(profileResponse.responseText);
											const texturesProp = profileData.properties.find(p => p.name === 'textures');
											if (!texturesProp) {
												alert('未获取到皮肤');
												dialog.close();
											}
											const texturesJson = atob(texturesProp.value);
											const texturesData = JSON.parse(texturesJson);
											const skinUrl = texturesData.textures.SKIN.url;
											GM_xmlhttpRequest({
												method: "GET",
												url: skinUrl,
												responseType: "blob",
												onload: function(response) {
													const reader = new FileReader();
													reader.onloadend = function() {
														skinViewer.loadSkin(reader.result);
														skin = reader.result;
														if (isSave) {
															GM_setValue("skin", reader.result);
														}
														dialog.close();
													}
													reader.readAsDataURL(response.response);
												},
												onerror: function(e) {
													alert("皮肤加载错误")
													dialog.close();
												}
											});
										} catch (e) {
											alert(`${ e.message.includes('default') ? e.message : 'API请求失败，无法获取皮肤信息，请检查ID是否正确，或者检查网络连接'}`);
											dialog.close();
										}
									},
									onerror: function(e) {
										alert(`API请求失败，无法获取皮肤信息，请检查ID是否正确，或者检查网络连接`);
										dialog.close();
									}
								});
							} catch (e) {
								alert(`${e.responseText ? JSON.parse(e.responseText).errorMessage : 'API请求失败，无法获取皮肤信息，请检查ID是否正确，或者检查网络连接'}`);
								dialog.close();
							}
						},
						onerror: function(e) {
							alert(`${e.responseText ? JSON.parse(e.responseText).errorMessage : 'API请求失败无法获取皮肤信息，请检查ID是否正确，或者检查网络连接'}`);
							dialog.close();
						}
					});
				}
				uploadBtn.onclick = upload;
			} else {
				uploadBtn.innerText = "上传皮肤";
				uploadBtn.onclick = function() {
					uploadSkin(isSave);
				};
			}
		})
		let uploadBtn = wrap.appendChild(document.createElement("button"));
		uploadBtn.onclick = () => {
			uploadSkin(isSave)
		};
		uploadBtn.setAttribute("style", `
color:white;
background:#6F8DE1;
border:none;
outline:none;
padding:5px 10px;
border-radius:10px;
margin-top:20px;
`)
		uploadBtn.style.fontSize = fontSize;
		uploadBtn.innerText = "上传皮肤";

		uploadBtn.addEventListener("dragover", (e) => {
			e.preventDefault();
		})

		uploadBtn.addEventListener("dragenter", (e) => {
			e.preventDefault();
			var originalText = uploadBtn.innerText;
			uploadBtn.style.opacity = ".6";
			uploadBtn.style.border = "1px dashed white";
			uploadBtn.innerText = "+";
			uploadBtn.style.width = `calc(4 * ${fontSize} + 20px)`;
			uploadBtn.style.fontWeight = 500;
			uploadBtn.style.fontSize = `calc(1.193 * ${fontSize})`;

			function dragLeaveHandler(e) {
				e.preventDefault();
				uploadBtn.style.opacity = "1";
				uploadBtn.style.border = "none";
				uploadBtn.innerText = originalText;
				uploadBtn.style.fontWeight = "normal";
				uploadBtn.style.fontSize = fontSize;
				uploadBtn.removeEventListener("dragleave", dragLeaveHandler);
				uploadBtn.removeEventListener("drop", dropHandler);
			}

			function dropHandler(e) {
				dragLeaveHandler(e);
				var file;
				if (e.dataTransfer.items) {
					if (e.dataTransfer.items[0].kind === "file") {
						file = e.dataTransfer.items[0].getAsFile();
					}
				} else {
					file = e.dataTransfer.files[0]
				}
				return new Promise((resolve, reject) => {
					if (file.type !== 'image/png') {
						reject(new Error('Only PNG files are allowed'));
						return;
					}
					dialog.close();
					let reader = new FileReader();
					reader.onload = (e) => {
						try {
							const base64 = e.target.result;
							skinViewer.loadSkin(base64);
							skin = base64;
							if (isSave) {
								GM_setValue("skin", base64);
							}
							resolve(base64);
						} catch (error) {
							reject(error);
						}
					};
					reader.onerror = (error) => reject(error);
					reader.readAsDataURL(file);
				});

			}
			uploadBtn.addEventListener("drop", dropHandler)
			uploadBtn.addEventListener("dragleave", dragLeaveHandler);
		})

		nameInp.addEventListener("keydown", function(e) {
			if (e.keyCode == 13) {
				e.preventDefault();
				upload();
			}
		})
	}
	if (!skin) {
		createSkinPickerDialog(true, `[MC Skin] 初次使用需要上传皮肤文件`);
		dialog.showModal();
		dialog.focus();
		dialog.blur();
	}
	var opacity = GM_getValue("opacity", "0.85");
	var positionLeft;
	var positionTop;
	var w = 130;
	var h = 200;
	var positionSetting = {
		top: {
			top: 0
		},
		bottom: {
			top: `calc(100vh - ${h}px)`,
		}
	}
	var position = positionSetting.bottom;
	var canvas = document.createElement("canvas");
	canvas.style.position = "fixed";
	positionLeft = GM_getValue("positionLeft", `calc(100vw - ${w}px)`);
	positionTop = GM_getValue("positionTop", position.top);
	canvas.style.top = positionTop;
	canvas.style.left = positionLeft;
	canvas.style.zIndex = 999999999999;
	canvas.style.pointerEvents = "none";
	canvas.style.opacity = opacity;
	canvas.style.background = "transparent";
	document.body.appendChild(canvas);
	let skinViewer = new skinview3d.SkinViewer({
		canvas: canvas,
		width: w,
		height: h,
		skin: skin
	});
	var addAnimation = function() {}
	var idleAnimation = new skinview3d.FunctionAnimation((player, pr) => {
		if (canvas.style.display != "none") {
			const t = pr * 2;
			// Arm swing
			const basicArmRotationZ = Math.PI * 0.02;
			player.skin.leftArm.rotation.z = Math.cos(t) * 0.03 + basicArmRotationZ;
			player.skin.rightArm.rotation.z = Math.cos(t + Math.PI) * 0.03 - basicArmRotationZ;
			// Always add an angle for cape around the x axis
			const basicCapeRotationX = Math.PI * 0.06;
			player.cape.rotation.x = Math.sin(t) * 0.01 + basicCapeRotationX;
			if (mouseFollowMode != "java") {
				player.rotation.y = defaultRotation;
			}
			addAnimation(player, pr)
		}
	});
	skinViewer.animation = idleAnimation;
	skinViewer.controls.enablePan = false;
	skinViewer.controls.enableZoom = false;
	skinViewer.controls.enableRotate = false;


	const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -10);
	const raycaster = new THREE.Raycaster();
	const mouse = new THREE.Vector2();
	const pointOfIntersection = new THREE.Vector3();
	const head = skinViewer.playerObject.skin.head;
	var isPlayingAfkAnimation;
	var timeout0;
	var AfkAnimation = () => {
		head.rotation.x = 0;
		head.rotation.y = 0;
		head.rotation.z = 0;
		addAnimation = (pl, pr) => {
			var kT = 13.5;
			var sin0 = (x) => {
				var r = Math.pow(Math.abs(Math.sin(x)), 1 / 1.5);
				return Math.sin(x) > 0 ? r : -r;
			}
			var kD = 0.25;
			var t1 = Math.abs(sin0(pr / 2 * kT));
			pl.skin.body.rotation.x = 0.4537860552 * (1 - kD * t1);
			pl.skin.body.position.z = 1.3256181 * (1 - kD * t1) - 3.4500310377 * (1 - kD * t1);
			pl.skin.body.position.y = -6 - 2.103677462 * (1 - kD * t1);
			pl.skin.head.position.y = -3.618325234674 * (1 - kD * t1);
			pl.skin.leftArm.position.z = 3.618325234674 * (1 - kD * t1) - 3.4500310377 * (1 - kD * t1);
			pl.skin.rightArm.position.z = pl.skin.leftArm.position.z;
			pl.skin.leftArm.rotation.x = 0.510367746202 * (1 - kD * t1);
			pl.skin.rightArm.rotation.x = pl.skin.leftArm.rotation.x;
			pl.skin.leftArm.rotation.z = 0.1 * (1 - kD * t1);
			pl.skin.rightArm.rotation.z = -pl.skin.leftArm.rotation.z;
			pl.skin.leftArm.position.y = -2 - 2.53943318 * (1 - kD * t1);
			pl.skin.rightArm.position.y = pl.skin.leftArm.position.y;
			pl.skin.rightLeg.position.z = -3.4500310377 * (1 - kD * t1);
			pl.skin.leftLeg.position.z = pl.skin.rightLeg.position.z;
			var mD = 1.5;
			var t = sin0(pr * kT) * mD;
			pl.skin.leftLeg.rotation.z = -Math.asin((pl.skin.leftLeg.position.x - 1.9) / 12);
			pl.skin.leftLeg.position.x = t + 1.9;
			pl.skin.rightLeg.rotation.z = pl.skin.leftLeg.rotation.z;
			pl.skin.rightLeg.position.x = t - 1.9;
			pl.skin.body.position.x = t / 2;
			pl.skin.leftArm.position.x = t / 2 + 5 - 0.5 * sin0(Math.max(pr - 0.25 / kT, 0) * kT);
			pl.skin.rightArm.position.x = t / 2 - 5 - 0.5 * sin0(Math.max(pr - 0.25 / kT, 0) * kT);
			pl.skin.body.rotation.z = -pl.skin.rightLeg.rotation.z;
			pl.skin.leftArm.rotation.z = Math.asin(sin0(Math.max(pr - 0.25 / kT, 0) * kT) * mD / 12) + Math.PI / 18;
			pl.skin.rightArm.rotation.z = pl.skin.leftArm.rotation.z - 2 * Math.PI / 18;
			pl.skin.leftArm.position.y = -2.5 * Math.sin(pl.skin.leftLeg.rotation.z) - 2 - 2.53943318 * (1 - kD * Math.abs(sin0(pr / 2 * kT)));
			pl.skin.rightArm.position.y = 2.5 * Math.sin(pl.skin.rightLeg.rotation.z) - 2 - 2.53943318 * (1 - kD * Math.abs(sin0(pr / 2 * kT)));
			pl.skin.head.rotation.z = pl.skin.body.rotation.z * 1 / 3;
		}
	}
	isPlayingAfkAnimation = false;
	timeout0 = setTimeout(() => {
		AfkAnimation();
		isPlayingAfkAnimation = true;
	}, 300000)
	var handleAfkAnimation = () => {
		clearTimeout(timeout0);
		if (isPlayingAfkAnimation) {
			addAnimation = () => {}
			var pl = skinViewer.playerObject;
			pl.skin.head.rotation.set(0, 0, 0);
			pl.skin.leftArm.rotation.set(0, 0, 0);
			pl.skin.rightArm.rotation.set(0, 0, 0);
			pl.skin.leftLeg.rotation.set(0, 0, 0);
			pl.skin.rightLeg.rotation.set(0, 0, 0);
			pl.skin.body.rotation.set(0, 0, 0);
			pl.skin.head.position.y = 0;
			pl.skin.body.position.x = 0;
			pl.skin.body.position.y = -6;
			pl.skin.body.position.z = 0;
			pl.skin.rightArm.position.x = -5;
			pl.skin.rightArm.position.y = -2;
			pl.skin.rightArm.position.z = 0;
			pl.skin.leftArm.position.x = 5;
			pl.skin.leftArm.position.y = -2;
			pl.skin.leftArm.position.z = 0;
			pl.skin.rightLeg.position.x = -1.9;
			pl.skin.rightLeg.position.y = -12;
			pl.skin.rightLeg.position.z = -0.1;
			pl.skin.leftLeg.position.x = 1.9;
			pl.skin.leftLeg.position.y = -12;
			pl.skin.leftLeg.position.z = -0.1;
			isPlayingAfkAnimation = false;
		}
		timeout0 = setTimeout(() => {
			AfkAnimation();
			isPlayingAfkAnimation = true;
		}, 300000)
	}

	function clamp(num, min, max) {
		return num <= min ? min : num >= max ? max : num;
	}

	function stopAddedAnimation() {
		_t0 = undefined;
		_t1 = undefined;
		z0 = undefined;
		progress1 = undefined;
		progress2 = undefined;
		progress3 = undefined;
		endRotationX = undefined;
		progress4 = undefined;
		progress5 = undefined;
		endRotationXR = undefined;
		endRotationXL = undefined;
		isTimeoutSetted = true;
		clearTimeout(waveTimeout);
		addAnimation = () => {}
	}
	var waveTimeout;
	var isTimeoutSetted = false;
	var _t0;
	var _t1;
	var z0;

	function handleWaveAnimation() {
		function wave() {
			addAnimation = (player, progress) => {
				_t0 = !_t0 ? progress : _t0;
				const t = (progress - _t0) * 2.1 * Math.PI;
				if (t <= Math.PI * 4) {
					player.skin.leftArm.rotation.x = -2.21;
					player.skin.leftArm.rotation.z = Math.cos(t) * 0.5;
				} else {
					_t1 = _t1 == undefined ? progress : _t1;
					z0 = z0 == undefined ? player.skin.leftArm.rotation.z : z0;
					var t1 = Math.cos((progress - _t1) * 15);
					if (t1 < 0) {
						t1 = 0;
						stopAddedAnimation();
						player.skin.leftArm.rotation.x = 0;
						player.skin.leftArm.rotation.z = 0;
						return;
					}
					player.skin.leftArm.rotation.x = -2.21 * t1
					player.skin.leftArm.rotation.z = z0 * t1;

				}
			}
		}
		if (!isTimeoutSetted) {
			waveTimeout = setTimeout(wave, 800);
		}
		isTimeoutSetted = true;
	}

	var light;
	if (mouseFollowMode == "java") {
		skinViewer.globalLight.intensity = 1;
		skinViewer.cameraLight.intensity = 0;
		light = new THREE.HemisphereLight(0xffffff, 0x000000, 2.9);
	} else {
		skinViewer.globalLight.intensity = 2.5;
		skinViewer.cameraLight.intensity = 0;
		light = new THREE.DirectionalLight(0xffffff, 0.9);
		light.position.set(1, 0, 1);
	}
	skinViewer.scene.add(light);

	function handleMove(x, y) {
		handleAfkAnimation();
		const canvasRect = canvas.getBoundingClientRect();
		mouse.x = (((x - canvasRect.left) / canvasRect.width) * 2 - 1) / (window.innerWidth / canvasRect.width);
		mouse.y = clamp((-((y - canvasRect.top) / canvasRect.height) * 2 + 1) / (window.innerHeight / canvasRect.height) + 0.4 - 0.52 / (window.innerHeight / canvasRect.height), -0.5, 0.9);
		raycaster.setFromCamera(mouse, skinViewer.camera);
		raycaster.ray.intersectPlane(plane, pointOfIntersection);
		head.lookAt(pointOfIntersection);
		if (mouseFollowMode == "java") {
			const plane1 = new THREE.Plane(new THREE.Vector3(0, 0, 1), -25);
			const raycaster1 = new THREE.Raycaster();
			const pointOfIntersection1 = new THREE.Vector3();
			const mouse1 = mouse;
			mouse1.x *= Math.abs(Math.cos(skinViewer.playerObject.skin.rotation.y)); //鼠标平面x对应空间y
			mouse1.y += 1.1;
			mouse1.y *= 0.9;
			raycaster1.setFromCamera(mouse1, skinViewer.camera);
			raycaster1.ray.intersectPlane(plane1, pointOfIntersection1);
			skinViewer.playerObject.skin.lookAt(pointOfIntersection1);
		}
		return canvasRect;
	}

	function moveFunction(e) {
		var x = e.targetTouches ? e.targetTouches[0].clientX : e.clientX;
		var y = e.targetTouches ? e.targetTouches[0].clientY : e.clientY;
		const canvasRect = handleMove(x, y);
		if (x >= canvasRect.left && x <= canvasRect.left + canvasRect.width && y >= canvasRect.top && y <= canvasRect.top + canvasRect.height) {
			handleWaveAnimation();
		} else {
			clearTimeout(waveTimeout);
			isTimeoutSetted = false;
		}
	}
	moveFunction = rafThrottle(moveFunction);
	window.addEventListener("mousemove", moveFunction, {
		passive: true,
		capture: true
	});
	window.addEventListener("touchstart", e => {
		moveFunction
	}, {
		passive: true,
		capture: true
	});

	window.addEventListener("touchmove", moveFunction, {
		passive: true,
		capture: true
	});

	function finishMoveFunction() {
		clearTimeout(waveTimeout);
		isTimeoutSetted = false;
	}
	finishMoveFunction = rafThrottle(finishMoveFunction)
	window.addEventListener("touchend", finishMoveFunction, {
		passive: true,
		capture: true
	});
	window.addEventListener("touchcancel", finishMoveFunction, {
		passive: true,
		capture: true
	});

	var progress1;
	var progress2;
	var progress3;
	var endRotationX;
	var ws;

	function handleMouseWheelEvent(event) {
		handleAfkAnimation();
		try {
			clearTimeout(ws)
		} catch (e) {}
		event = event || window.event;
		let delta = event.wheelDelta || -event.detail;
		var k = Math.pow(Math.abs(delta / 120), 1 / 3);
		if (delta > 0) {
			addAnimation = function(player, progress) {
				if (!progress1) {
					progress1 = progress;
					isTimeoutSetted = true;
					clearTimeout(waveTimeout);
				}
				progress2 = undefined;
				player.skin.rightArm.rotation.x = -0.1 + (Math.floor((progress - progress1) / (Math.PI / (13 * k))) % 2 == 0 ? (-Math.acos(Math.cos((k * 13 * (progress - progress1 - Math.PI / (13 * k))))) * 0.5) : -0.5);
				player.skin.leftArm.rotation.x = 0;
			}
		} else {
			addAnimation = function(player, progress) {
				if (!progress2) {
					progress2 = progress;
					isTimeoutSetted = true;
					clearTimeout(waveTimeout);
				}
				progress1 = undefined;
				player.skin.rightArm.rotation.x = -0.1 + ((Math.floor((progress - progress2) / (Math.PI / (6 * 2 * k))) % 2 == 0) ? (-Math.abs(Math.asin(Math.sin(6 * k * (progress - progress2)))) * 0.8) : 0);
				player.skin.leftArm.rotation.x = 0;
			}
		}
		ws = setTimeout(() => {
			addAnimation = function(player, progress) {
				if (!endRotationX) {
					endRotationX = player.skin.rightArm.rotation.x;
					progress3 = progress;
				}
				player.skin.rightArm.rotation.x = Math.min(4 * (progress - progress3) + endRotationX, 0);
				if (player.skin.rightArm.rotation.x == 0) {
					progress3 = undefined;
					endRotationX = undefined;
					stopAddedAnimation();
				}
			}
			progress1 = undefined;
			progress2 = undefined;
		}, 300)
	}
	window.addEventListener("wheel", handleMouseWheelEvent, {
		passive: true,
		capture: true
	})
	var mousedownFunction = function() {
		handleAfkAnimation();
		var progress0
		addAnimation = function(player, progress) {
			if (!progress0) {
				progress0 = progress;
				isTimeoutSetted = true;
				clearTimeout(waveTimeout);
			}
			if (mouseFollowMode != "java") {
				player.rotation.y = defaultRotation;
			}
			const t = (progress - progress0) * 20;
			player.skin.rightArm.rotation.x = -0.4537860552 * 2 + 2 * Math.sin(t + Math.PI) * 0.3;
			const basicArmRotationZ = 0.01 * Math.PI + 0.06;
			player.skin.rightArm.rotation.z = -Math.cos(t) * 0.403 + basicArmRotationZ;
			player.skin.body.rotation.y = -Math.cos(t) * 0.06;
			player.skin.leftArm.rotation.x = Math.sin(t + Math.PI) * 0.077;
			player.skin.leftArm.rotation.z = -Math.cos(t) * 0.015 + 0.13 - 0.05;
			player.skin.leftArm.position.z = Math.cos(t) * 0.3;
			player.skin.leftArm.position.x = 5 - Math.cos(t) * 0.05;
			if (t >= Math.PI * 2) {
				player.skin.rightArm.rotation.x = 0;
				stopAddedAnimation();
			}
		}
	}
	window.addEventListener("mousedown", mousedownFunction, {
		passive: true,
		capture: true
	})
	var timeout;
	var progress4;
	var progress5;
	var time0 = -1;
	var endRotationXL;
	var endRotationXR;

	function handleInputEvent() {
		try {
			clearTimeout(timeout)
		} catch (e) {}
		var deltaTime;
		if (time0 == -1) {
			time0 = Date.now();
		} else {
			let t = Date.now();
			deltaTime = t - time0;
			time0 = t;
		}
		let k = 5 / Math.pow(deltaTime + 1, 1 / 3.6)
		k = Number.isNaN(k) ? 1 : k;
		addAnimation = function(player, progress) {
			if (!progress4) {
				progress4 = progress;
				isTimeoutSetted = true;
				clearTimeout(waveTimeout);
			}
			var pr = progress - progress4;
			player.skin.leftArm.rotation.z = -0.27;
			player.skin.rightArm.rotation.z = 0.27;
			player.skin.leftArm.rotation.x = -Math.abs(Math.PI / 6 * Math.sin(pr * 5 * k)) - 0.6;
			player.skin.rightArm.rotation.x = -Math.abs(Math.PI / 6 * Math.cos(pr * 5 * k)) - 0.6;
		}
		timeout = setTimeout(() => {
			addAnimation = function(player, progress) {
				if (!progress5) {
					progress5 = progress;
					endRotationXL = player.skin.leftArm.rotation.x;
					endRotationXR = player.skin.rightArm.rotation.x;
				}
				player.skin.leftArm.rotation.z = 0;
				player.skin.rightArm.rotation.z = 0;
				player.skin.rightArm.rotation.x = Math.min(4 * (progress - progress5) + endRotationXR, 0);
				player.skin.leftArm.rotation.x = Math.min(4 * (progress - progress5) + endRotationXL, 0);
				player.skin.rightArm.rotation.z = Math.min(4 * (progress - progress5) + 0.27, 0);
				player.skin.leftArm.rotation.z = Math.max(-4 * (progress - progress5) - 0.27, 0);
				if (player.skin.rightArm.rotation.x == 0 && player.skin.leftArm.rotation.x == 0 && player.skin.rightArm.rotation.z == 0 && player.skin.leftArm.rotation.z == 0) {
					stopAddedAnimation();
				}
			}
			progress4 = undefined;
		}, 600)
	}

	document.addEventListener('keydown', () => {
		handleAfkAnimation();
		handleInputEvent();
	}, {
		passive: true,
		capture: true
	});

	GM_registerMenuCommand("调整透明度", function() {
		removeAllChild(dialog)
		var d1 = dialog.appendChild(document.createElement("div"))
		d1.setAttribute("style", `padding-bottom:15px !important;
font-size:` + fontSize)
		var inp = dialog.appendChild(document.createElement("input"));
		inp.min = 0;
		inp.max = 1;
		inp.step = 0.01;
		inp.type = "range";
		inp.setAttribute("style", `height:5px !important;
  width:85% !important;
  accent-color:#6F8DE1 !important;
  vertical-align:middle !important;
outline:none !important;
margin-left:7.5% !important;
display:block !important;
`)
		inp.addEventListener("input", () => {
			d1.innerHTML = (inp.value * 100).toFixed() + "%";
			canvas.style.opacity = inp.value;
			opacity = inp.value;
		})
		var d2 = dialog.appendChild(document.createElement("div"))
		d2.setAttribute("style", `
margin-top:20px !important;
font-size:` + fontSize.replace(/px/, "") / 1.3 + "px")
		d2.innerText = "设置仅对本次当前网页生效，保存设置请单击菜单中 保存当前设置";
		dialog.showModal();
		dialog.focus();
		dialog.blur();
		inp.value = canvas.style.opacity;
		d1.innerHTML = (inp.value * 100).toFixed() + "%";
	})
	var moveListeners = [];
	var moveMenuId;
	var finishMoveMenuId;
	var isMoving = false;

	function move() {
		isMoving = true;
		GM_unregisterMenuCommand(moveMenuId);
		finishMoveMenuId = GM_registerMenuCommand("完成移动", finishMove);

		function makeDraggable(element) {
			element.style.pointerEvents = "auto";
			var width = getComputedStyle(element).width.replace(/px/, "") * 1;
			var height = getComputedStyle(element).height.replace(/px/, "") * 1;
			let isDragging = false;
			let startX, startY, initialLeft, initialTop;
			const parsePosition = (type) => {
				var originalPosition = (type == "left" ? (getComputedStyle(element).left.replace(/px/, "") / window.innerWidth) * 100 + "vw" : (getComputedStyle(element).top.replace(/px/, "") / window.innerHeight) * 100 + "vh")
				const value = originalPosition;
				const match = value.match(/(-?\d+\.?\d*)v[w|h]/);
				return match ? parseFloat(match[1]) : 0;
			};
			const pxToVW = (px) => (px / window.innerWidth) * 100;
			const pxToVH = (px) => (px / window.innerHeight) * 100;
			const startDrag = (clientX, clientY) => {
				isDragging = true;
				initialLeft = parsePosition('left');
				initialTop = parsePosition('top');
				startX = clientX;
				startY = clientY;
			};
			const handleMove = (clientX, clientY) => {
				if (!isDragging) return;
				const deltaX = clientX - startX;
				const deltaY = clientY - startY;
				var isRightSide = (initialLeft + pxToVW(deltaX)) + pxToVW(0.5 * width) >= 50;
				var isBottomSide = (initialTop + pxToVH(deltaY)) + pxToVH(0.5 * height) >= 50;
				if (isRightSide) {
					defaultRotation = -Math.abs(defaultRotation);
					element.style.left = `calc(${Math.min((initialLeft + pxToVW(deltaX) + width/window.innerWidth*100),(window.innerWidth+width/2)/window.innerWidth*100,(window.innerHeight+width/2)/window.innerHeight*100)}vw - ${width}px)`;
				} else {
					defaultRotation = Math.abs(defaultRotation);
					element.style.left = `${Math.max((initialLeft + pxToVW(deltaX)),-width/2/window.innerWidth*100,-width/2/window.innerHeight*100)}vw`;
				}
				if (isBottomSide) {
					element.style.top = `calc(${Math.min((initialTop + pxToVH(deltaY) + height/window.innerHeight*100),(window.innerHeight+height/2)/window.innerHeight*100,(window.innerWidth+height/2)/window.innerWidth*100)}vh - ${height}px)`;
				} else {
					element.style.top = `${Math.max((initialTop + pxToVH(deltaY)),-height/2/window.innerHeight*100,-height/2/window.innerWidth*100)}vh`;
				}
			};
			var mouseMoveFunction = rafThrottle(e => handleMove(e.clientX, e.clientY));
			var touchMoveFunction = rafThrottle(e => handleMove(e.touches[0].clientX, e.touches[0].clientY));
			const addEvent = (target, type, handler) => {
				moveListeners.push({
					target: target,
					type: type,
					handler: handler
				})
				target.addEventListener(type, handler, {
					passive: true,
					capture: true
				});
			}
			addEvent(element, 'mousedown', e => startDrag(e.clientX, e.clientY));
			addEvent(element, 'touchstart', e => startDrag(e.touches[0].clientX, e.touches[0].clientY));
			addEvent(document, 'mousemove', mouseMoveFunction);
			addEvent(document, 'touchmove', touchMoveFunction);
			['mouseup', 'touchend'].forEach(type => addEvent(document, type, () => isDragging = false));
		}
		makeDraggable(canvas)
		canvas.style.border = "5px solid red";
	}

	function finishMove() {
		isMoving = false;
		moveListeners.forEach((item) => {
			item.target.removeEventListener(item.type, item.handler);
			canvas.style.border = "none";
			positionLeft = canvas.style.left;
			positionTop = canvas.style.top;
		})
		moveMenuId = GM_registerMenuCommand("移动", move);
		GM_unregisterMenuCommand(finishMoveMenuId);
		canvas.style.pointerEvents = "none";
	}
	moveMenuId = GM_registerMenuCommand("移动", move);
	GM_registerMenuCommand("保存当前设置", () => {
		GM_setValue("positionLeft", positionLeft);
		GM_setValue("positionTop", positionTop);
		GM_setValue("opacity", opacity);
		GM_setValue("skin", skin);
		if (!isMoving) {
			GM_setValue("defaultRotation", defaultRotation);
		}
		alert(`[MC Skin]${isMoving?"\n⚠️ 当前移动位置未保存，如需保存应当点击 完成移动 后再保存当前设置":""}
保存成功，当前参数为：
${GM_getValue("positionLeft")?"位置:left "+GM_getValue("positionLeft")+" top:"+GM_getValue("positionTop")+"\n":""}${GM_getValue("opacity")?"透明度"+GM_getValue("opacity")+"\n":""}${GM_getValue("skin")?"皮肤"+GM_getValue("skin"):""}`)
	})
	GM_registerMenuCommand("重置当前设置", () => {
		GM_deleteValue("positionLeft");
		GM_deleteValue("positionTop");
		GM_deleteValue("opacity");
		GM_deleteValue("skin");
		GM_deleteValue("defaultRotation");
		GM_deleteValue("fullscreenAddition");
		GM_deleteValue("mouseFollowMode");
	})
	GM_registerMenuCommand("更换皮肤", function() {
		createSkinPickerDialog(false, `选择皮肤 如需保存请点击菜单中 保存当前设置`)

		dialog.showModal();
		dialog.focus();
		dialog.blur();
	})
	var fullscreenAddition = GM_getValue("fullscreenAddition", false);
	var fc1, fc2;
	var fullscreenListener = () => {
		if (document.fullscreenElement) {
			document.fullscreenElement.append(canvas);
		} else {
			document.body.append(canvas);
		}
	}
	var fc1Click = () => {
		document.addEventListener('fullscreenchange', fullscreenListener, {
			passive: true
		});
		GM_unregisterMenuCommand(fc1);
		fc2 = GM_registerMenuCommand("点击禁用在全屏时显示皮肤", fc2Click);
		GM_setValue("fullscreenAddition", true);
	}
	var fc2Click = () => {
		document.removeEventListener('fullscreenchange', fullscreenListener);
		GM_unregisterMenuCommand(fc2);
		fc1 = GM_registerMenuCommand("点击启用在全屏时显示皮肤", fc1Click);
		GM_setValue("fullscreenAddition", false);
	}
	if (!fullscreenAddition) {
		fc1 = GM_registerMenuCommand("点击启用在全屏时显示皮肤", fc1Click);
	} else {
		document.addEventListener('fullscreenchange', fullscreenListener, {
			passive: true
		});
		fc2 = GM_registerMenuCommand("点击禁用在全屏时显示皮肤", fc2Click);
	}
	var changeMouseModeMenu;
	var changeMouseFollowMode = () => {
		GM_unregisterMenuCommand(changeMouseModeMenu);
		skinViewer.scene.remove(light);
		if (mouseFollowMode == "bedrock") {
			mouseFollowMode = "java";
			changeMouseModeMenu = GM_registerMenuCommand("切换鼠标跟随至基岩版模式", changeMouseFollowMode);
			skinViewer.globalLight.intensity = 1;
			skinViewer.cameraLight.intensity = 0;
			light = new THREE.HemisphereLight(0xffffff, 0x000000, 2.9);
		} else {
			mouseFollowMode = "bedrock";
			changeMouseModeMenu = GM_registerMenuCommand("切换鼠标跟随至java版模式", changeMouseFollowMode);
			skinViewer.playerObject.skin.rotation.y = 0;
			skinViewer.playerObject.skin.rotation.x = 0;
			skinViewer.playerObject.skin.rotation.z = 0;
			skinViewer.globalLight.intensity = 2.5;
			skinViewer.cameraLight.intensity = 0;
			light = new THREE.DirectionalLight(0xffffff, 0.9);
			light.position.set(1, 0, 1);
		}
		GM_setValue("mouseFollowMode", mouseFollowMode);
		skinViewer.scene.add(light);
	}
	if (mouseFollowMode == "bedrock") {
		changeMouseModeMenu = GM_registerMenuCommand("切换鼠标跟随至java版模式", changeMouseFollowMode);
	} else {
		changeMouseModeMenu = GM_registerMenuCommand("切换鼠标跟随至基岩版模式", changeMouseFollowMode);
	}
	var canvasScale = 1;
	var resizeFunction = () => {
		const canvasRect = canvas.getBoundingClientRect();
		if (window.innerHeight <= 1.5 * h) {
			var deltaTop = 0;
			if (/px/.test(canvas.style.top)) {
				deltaTop = h * (1 - canvasScale);
			}
			canvas.style.transformOrigin = `50% ${window.innerHeight/2-canvasRect.top+deltaTop}px`;
			canvasScale = window.innerHeight / (1.5 * h);
			canvas.style.transform = `scale(${canvasScale})`;
		} else {
			canvasScale = 1;
			canvas.style.transform = "scale(1)";
		}
	}
	resizeFunction = rafThrottle(resizeFunction);
	window.addEventListener("resize", resizeFunction, {
		passive: true
	})

	function addIframeEventListener(iframe) {
		function pushEventMessage(e) {
			let data = {};
			var rectObject = iframe.getBoundingClientRect();
			var x = rectObject.left;
			var y = rectObject.top;
			data.type = e.type;
			e.clientX ? data.clientX = e.clientX + x : null;
			e.clientY ? data.clientY = e.clientY + y : null;
			if (e.targetTouches && e.type != "touchend" && e.type != "touchcancel") {
				data.targetTouches = [{
					clientX: e.targetTouches[0].clientX + x,
					clientY: e.targetTouches[0].clientY + y
				}]
			}
			e.wheelDelta ? data.wheelDelta = e.wheelDelta : null;
			e.detail ? data.detail = e.detail : null;
			iframe.contentWindow.parent.postMessage({
				type: "McSkinIframeEventData",
				data: data
			}, "*");
		}
		iframe.contentWindow.addEventListener("mousemove", pushEventMessage, {
			passive: true,
			capture: true
		});
		iframe.contentWindow.addEventListener("touchstart", pushEventMessage, {
			passive: true,
			capture: true
		});
		iframe.contentWindow.addEventListener("touchmove", pushEventMessage, {
			passive: true,
			capture: true
		});
		iframe.contentWindow.addEventListener("touchend", pushEventMessage, {
			passive: true,
			capture: true
		});
		iframe.contentWindow.addEventListener("touchcancel", pushEventMessage, {
			passive: true,
			capture: true
		});
		iframe.contentWindow.addEventListener("wheel", pushEventMessage, {
			passive: true,
			capture: true
		})
		iframe.contentWindow.addEventListener("mousedown", pushEventMessage, {
			passive: true,
			capture: true
		})
		iframe.contentDocument.addEventListener('keydown', pushEventMessage, {
			passive: true,
			capture: true
		});
		createIframeListener(iframe.contentDocument);
		iframe.contentWindow.addEventListener("message", (e) => {
			if (e.data.type == "McSkinIframeEventData" && e.source != iframe.contentWindow.parent && e.source != top) {
				e.stopImmediatePropagation();
				let data = {};
				var rectObject = iframe.getBoundingClientRect();
				var x = rectObject.left;
				var y = rectObject.top;
				data.type = e.data.data.type;
				e.data.data.clientX ? data.clientX = e.data.data.clientX + x : null;
				e.data.data.clientY ? data.clientY = e.data.data.clientY + y : null;
				if (e.data.data.targetTouches && data.type != "touchend" && data.type != "touchcancel") {
					data.targetTouches = [{
						clientX: e.data.data.targetTouches[0].clientX + x,
						clientY: e.data.data.targetTouches[0].clientY + y
					}]
				}
				e.data.data.wheelDelta ? data.wheelDelta = e.data.data.wheelDelta : null;
				e.data.data.detail ? data.detail = e.data.data.detail : null;
				iframe.contentWindow.parent.postMessage({
					type: "McSkinIframeEventData",
					data: data
				}, "*");
			}
		}, {
			passive: true
		})

	}
	var iframeEventHandler = (e) => {
		if (e.data.type == "McSkinIframeEventData") {
			e.stopImmediatePropagation();
			let event = e.data.data;
			switch (event.type) {
				case "mousemove":
				case "touchstart":
				case "touchmove":
					moveFunction(event);
					break;
				case "touchend":
				case "touchcancel":
					finishMoveFunction();
					break;
				case "wheel":
					handleMouseWheelEvent(event);
					break
				case "mousedown":
					mousedownFunction(event);
					break;
				case "keydown":
					handleAfkAnimation();
					handleInputEvent();
					break;
			}
		}
	}
	window.addEventListener("message", iframeEventHandler, {
		passive: true
	});

	function createIframeListener(document) {

		[...document.getElementsByTagName("iframe")].forEach((iframe) => {
			if (iframe.contentDocument && iframe.contentDocument.readyState == "complete") {
				addIframeEventListener(iframe);
			} else {
				iframe.addEventListener("load", () => {
					addIframeEventListener(iframe);
				}, {
					passive: true
				})
			}

		})
		var nativeDCE = document.createElement;
		document.createElement = function(tagName, options) {
			if (typeof tagName != "string") return nativeDCE.call(document, tagName, options);
			var element = options ? nativeDCE.call(document, tagName, options) : nativeDCE.call(document, tagName);
			if (tagName.toLowerCase() == "iframe") {
				if (element.contentDocument && element.contentDocument.readyState == "complete") {
					addIframeEventListener(element);
				} else {
					element.addEventListener("load", () => {
						addIframeEventListener(element);
					}, {
						passive: true
					})
				}
			}
			return element;
		}
	}
	createIframeListener(document);
	document.addEventListener("visibilitychange", () => {
		if (document.hidden) {
			canvas.style.display = "none";
			skinViewer.animation.paused = true;
		} else {
			canvas.style.display = "block";
			skinViewer.animation.paused = false;
		}
	}, {
		passive: true
	});
})();