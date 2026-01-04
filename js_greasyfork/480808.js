// ==UserScript==
// @name        Weverse Extra
// @namespace   Weverse Enhancements
// @description Enable Picture-in-picture, Livestream notifications, Auto Dismiss Notice
// @match       *://weverse.io/*
// @include     *://weverse.io/*/live*
// @connect     global.apis.naver.com
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_addStyle
// @grant       GM_notification
// @grant       GM_openInTab
// @grant       GM_xmlhttpRequest
// @grant       GM_getResourceURL
// @antifeature ads
// @require     https://cdn.jsdelivr.net/npm/luxon@3.6.1/build/global/luxon.min.js
// @resource    banner https://cdn-contents.weverseshop.io/public/shop/dc3feec0dfa0f1c3a3fa8d93fc0ca9c0.png
// @version     5.0.4
// @author      jho
// @run-at      document-end
// @license     Unlicense
// @icon        https://cdn-v2pstatic.weverse.io/wev_web_fe/assets/1.0.0/icons/logo192.png
// @downloadURL https://update.greasyfork.org/scripts/480808/Weverse%20Extra.user.js
// @updateURL https://update.greasyfork.org/scripts/480808/Weverse%20Extra.meta.js
// ==/UserScript==

/* -------------------------------------------------------------------------- */
/*                                Skip Iframes                                */
/* -------------------------------------------------------------------------- */

if (window.top !== window.self)
{
	console.log("[DEBUG] In iframe, skipping script execution.");
	return;
}

/* -------------------------------------------------------------------------- */
/*                                  Variables                                 */
/* -------------------------------------------------------------------------- */

const DateTime = luxon.DateTime;
const css = String.raw;
const style =
	css`
            :root {
                --color-primary: rgba(252, 146, 205, 1);
                --color-secondary: rgba(33, 225, 255, 1) ;
            }
            .fancy {
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-image: linear-gradient(
                    45deg,
                    var(--color-primary) 17%,
                    var(--color-secondary) 100%
                );
                background-size: 400% auto;
                background-position: 0% 50%;
                animation: animate-gradient 12s linear infinite;
            }

            @keyframes animate-gradient {
                0% {
                    background-position: 0% 50%;
                }
                50% {
                    background-position: 100% 50%;
                }
                100% {
                    background-position: 0% 50%;
                }
            }

        `;

let is_logging_enabled = true;
let auto_remove_landing_promos = GM_getValue("autoRemoveLandingPromos", true);
let auto_dismiss_digital_membership_reminder = GM_getValue("autoDissmissDigitalMembershipReminder", true);
let endorsement_enabled = GM_getValue("toggle5050Endorsement", true);
let cookieAllow = GM_getValue("cookieAllow", true);
const pip_btn_icon = `
                <span class="pzp-pc-ui-button__tooltip pzp-pc-ui-button__tooltip--top">Toggle Picture-in-picture</span>
                <span focusable="false" class="pzp-ui-icon pzp-pc-pip-button__icon pzp-pc-viewmode-button__icon" >
                <svg class="pzp-ui-icon__svg" width="36" height="36" viewBox="0 0 36 36">
                <g id="Layer_1" data-name="Layer 1" focusable="false">
                    <path fill="currentColor" d="M26.8,11.77c-.13-.24-.32-.44-.57-.57-.24-.13-.49-.2-1.16-.2H10.92c-.67,0-.91,.07-1.16,.2-.24,.13-.44,.32-.57,.57-.13,.24-.2,.49-.2,1.16v9.49c0,.67,.07,.91,.2,1.16,.13,.24,.33,.44,.57,.57,.24,.13,.49,.2,3.21,.2h14.15c-1.39,0-1.14-.07-.9-.2,.24-.13,.44-.32,.57-.57,.13-.24,.2-.49,.2-1.16V12.92c0-.67-.07-.91-.2-1.16Zm-1.8,9.53c0,.55-.45,1-1,1h-6.94c-.55,0-1-.45-1-1v-3.5c0-.55,.45-1,1-1h6.94c.55,0,1,.45,1,1v3.5Z" style="fill-rule: evenodd;"/></g>
                </svg>
                </span>
                `;

/* -------------------------------------------------------------------------- */
/*                                  Functions                                 */
/* -------------------------------------------------------------------------- */

GM_addStyle(style);

function log(...args)
{
	if (is_logging_enabled && args && args.length > 0)
	{
		console.log(...args);
	}
}

/* ---------------------------------- Menus --------------------------------- */

const menuCommands = [
	{
		label: () => `Auto Remove Landing Promos: ${auto_remove_landing_promos ? "ON" : "OFF"}`,
		toggle: function toggleAutoRemoveLandingPromos()
		{
			auto_remove_landing_promos = !auto_remove_landing_promos;
			GM_setValue("autoRemoveLandingPromos", auto_remove_landing_promos);
			updateMenuCommands();
			window.location.reload();
		},
		id: undefined,
	},
	{
		label: () => `Auto Dismiss Membership Notice On Live: ${auto_dismiss_digital_membership_reminder ? "ON" : "OFF"}`,
		toggle: function toggleAutoDismissDigitalMembershipReminder()
		{
			auto_dismiss_digital_membership_reminder = !auto_dismiss_digital_membership_reminder;
			GM_setValue("autoDissmissDigitalMembershipReminder", auto_dismiss_digital_membership_reminder);
			updateMenuCommands();
			window.location.reload();
		},
		id: undefined,
	},
	{
		label: () => `Auto Allow Cookie Banner: ${cookieAllow ? "ON" : "OFF"}`,
		toggle: function autoRemoveCookieBanner()
		{
			cookieAllow = !cookieAllow;
			GM_setValue("cookieAllow", cookieAllow);
			updateMenuCommands();
			window.location.reload();
		},
		id: undefined,
	},
	{
		label: () => `💖 5050 Endorsement: ${endorsement_enabled ? "ON" : "OFF"}`,
		toggle: function toggle5050Endorsement()
		{
			endorsement_enabled = !endorsement_enabled;
			GM_setValue("toggle5050Endorsement", endorsement_enabled);
			updateMenuCommands();
			window.location.reload();
		},
		id: undefined,
	},
];

function registerMenuCommands()
{
	for (const command of menuCommands)
	{
		command.id = GM_registerMenuCommand(command.label(), command.toggle);
	}
}

function updateMenuCommands()
{
	for (const command of menuCommands)
	{
		if (command.id)
		{
			GM_unregisterMenuCommand(command.id);
		}
		command.id = GM_registerMenuCommand(command.label(), command.toggle);
	}
}

function toggleAutoRemoveLandingPromos()
{
	auto_remove_landing_promos = !auto_remove_landing_promos;
	GM_setValue("autoRemoveLandingPromos", auto_remove_landing_promos);
	updateMenuCommands();
	window.location.reload();
}

function toggleAutoDissmissDigitalMembershipReminder()
{
	auto_dismiss_digital_membership_reminder = !auto_dismiss_digital_membership_reminder;
	GM_setValue("autoDissmissDigitalMembershipReminder", auto_dismiss_digital_membership_reminder);
	updateMenuCommands();
	window.location.reload();
}

function autoRemoveCookieBanner()
{
	cookieAllow = !cookieAllow;
	GM_setValue("cookieAllow", cookieAllow);
	updateMenuCommands();
	window.location.reload();
}

function toggle5050Endorsement()
{
	endorsement_enabled = !endorsement_enabled;
	GM_setValue("toggle5050Endorsement", endorsement_enabled);
	updateMenuCommands();
	window.location.reload();
}

registerMenuCommands();

/* -------------------------------- Menus End ------------------------------- */

/* --------------------------------- Onload --------------------------------- */

function onLoadCleanUp()
{
	console.log("Removing old notifications.");
	let processedNotifications = GM_getValue('processedNotifications', []);
	console.log("Stored Notification Items:", processedNotifications);

	const now = DateTime.now();

	function isRecent(item)
	{
		const from = DateTime.fromMillis(item.timestamp);
		const hoursDifference = now.diff(from, 'hours').hours;
		console.log("From:", from.toISO());
		console.log("To:", now.toISO());
		console.log("Hours Diff:", hoursDifference);
		console.log("Older than 168 hours?", Math.floor(hoursDifference) > 168);
		console.log("----------------------------------------------------------------------");

		return Math.floor(hoursDifference) <= 168;
		// Keep only items not older than a week as debug info.
		// Most livestream will not be here as any notification older than 2 hours is skipped.
	}

	processedNotifications = processedNotifications.filter(isRecent);

	console.log("Cleaned Notification Items:", processedNotifications);
	GM_setValue('processedNotifications', processedNotifications);
}

onLoadCleanUp();

/* -------------------------------- Onload End ----------------------------- */

/* ------------------------------- Dom Changes ------------------------------ */

function domManipulator(changes, observer)
{
	const videoPlayer = document.querySelector(".webplayer-internal-video");
	const isFirefox = /firefox/i.test(navigator.userAgent);
	const page = document.location.href;
	const togglePictureInPicture = () =>
	{
		if (!videoPlayer) return;

		if (document.pictureInPictureElement)
		{
			document.exitPictureInPicture().catch(log);
		}
		else
		{
			videoPlayer.requestPictureInPicture().catch(log);
		}
	};

	if (videoPlayer)
	{
		if (videoPlayer.hasAttribute("disablepictureinpicture"))
		{
			videoPlayer.removeAttribute("disablepictureinpicture");
			log(" Picture-in-picture is re-enabled.");
		}

		// Firefox does not support requestPictureInPicture(). Removing the attribute is enough. User can use built in pip button.
		// Chromium (at least edge) has also added their own pip button on video player that has no disablepictureinpicture attribute.
		// Thus, the following still works, but it's now redundant and can be removed if you want.
		if (!isFirefox)
		{

			const locations = document.querySelectorAll(".pzp-pc__bottom-buttons-right, .pzp-mobile-bottom.pzp-mobile__bottom");
			if (locations.length > 0)
			{
				const pipButtonExist = Array.from(locations).some(location => location.querySelector(".pzp-button-pip"));
				if (!pipButtonExist)
				{
					const button = document.createElement("button");
					button.setAttribute("aria-label", "Toggle Picture-in-picture");
					const btn_class_names = locations[0].classList.contains("pzp-mobile-bottom")
						? ["pzp-button", "pzp-setting-button", "pzp-mobile__setting-button", "pzp-button-pip"]
						: ["pzp-button", "pzp-button-pip", "pzp-pc-viewmode-button", "pzp-pc__viewmode-button", "pzp-pc-ui-button"];
					btn_class_names.forEach(item => button.classList.add(item));
					button.innerHTML = pip_btn_icon;
					button.addEventListener("click", () => togglePictureInPicture());
					locations[0].insertBefore(button, locations[0].lastChild);
				}
			}
		}
	}

	if (auto_dismiss_digital_membership_reminder)
	{
		const elems = document.querySelectorAll("div#custom_flash_message");
		//Only while watching livestream because of 1 min preview. VOD doesn't count as you need membership to get ai-subtitles.
		const isLive = document.querySelector("em.LiveBadgeView_badge__o2vFt.LiveBadgeView_-live__4P2PU span.blind")?.innerText === "live";
		if (elems && isLive)
		{
			elems.forEach(elem =>
			{
				const elems_to_find = elem.querySelectorAll('div');
				const matchedElements = Array.from(elems_to_find).filter(element =>
				{
					const matched = /Digital Membership/.test(element.innerText);
					return matched;
				});

				if (matchedElements.length === 0) return;
				log(matchedElements);

				matchedElements.forEach(matchedElement =>
				{
					const buttons = matchedElement.parentElement.querySelectorAll('button:has(span.blind)');
					log(buttons);
					buttons.forEach(button =>
					{
						if (button && button.innerText === "close")
						{
							log("👇 Autoclicking membership notice.", button);
							button.dispatchEvent(new MouseEvent("click", {
								view: document.defaultView,
								bubbles: true,
								cancelable: true
							}));
						}
					});
				});
			});
		}
	}

	if (page === "https://weverse.io/")
	{
		const modalButtons = document.querySelector("button.BaseModalView_bottom_button__XNhOi");
		const cookieButtons = document.querySelector("button.w_button_allow");
		// w_button_allow : allow cookie usage
		// w_button_continue : reject and continue
		{

			if (auto_remove_landing_promos && modalButtons)
			{
				if (modalButtons.innerText === "Don't show again for 3 days" || modalButtons.innerText === "Don't show again" || modalButtons.innerText.startsWith("Don't show"))
				{
					log("👇 Autoclicking landing promo.");
					log(modalButtons, modalButtons.innerText);
					queueMicrotask(() =>
					{
						modalButtons.dispatchEvent(new MouseEvent("click", {
							view: document.defaultView,
							bubbles: true,
							cancelable: true
						}));
						document.body.style.overflow = '';
					});

				}
			}

			if (cookieAllow && cookieButtons)
			{
				log("👇 Autoclicking cookie notice");
				queueMicrotask(() =>
				{
					cookieButtons.dispatchEvent(new MouseEvent("click", {
						view: document.defaultView,
						bubbles: true,
						cancelable: true
					}));
				});
			}
		}
	}

	// -- THIS SCRIPT IS BROUGHT TO YOU BY FIFTY FIFTY SUPPORT GROUP --
	if (endorsement_enabled)
	{
		if (page === "https://weverse.io/")
		{
			const titles = document.querySelectorAll("div.MarqueeView_content__2Qs2H:not(.fancy),span.MarqueeView_content__2Qs2H:not(.fancy)");
			titles.forEach(title =>
			{
				const parentOnlyText = Array.from(title.childNodes)
					.filter(node => node.nodeType === Node.TEXT_NODE)
					.map(node => node.textContent.trim())
					.join('');
				if (parentOnlyText === "FIFTY FIFTY")
				{
					title.classList.add("fancy");
				}
			});
		}

		if (page.startsWith("https://weverse.io/fiftyfifty/"))
		{
			const titles = document.querySelectorAll("span.HeaderCommunityDropdownWrapperView_name__FZXsx:not(.fancy)");
			titles.forEach(title =>
			{
				const parentOnlyText = Array.from(title.childNodes)
					.filter(node => node.nodeType === Node.TEXT_NODE)
					.map(node => node.textContent.trim())
					.join('');
				if (parentOnlyText === "FIFTY FIFTY")
				{
					title.classList.add("fancy");
				}
			});
		}
	}

	// -- THIS SCRIPT IS BROUGHT TO YOU BY FIFTY FIFTY SUPPORT GROUP --
}

const mutation_config = { childList: true, subtree: true };
const elem_appender_observer = new MutationObserver(domManipulator);
elem_appender_observer.observe(document, mutation_config);

/* -------------------------------------------------------------------------- */
/*                            Notification Listener                           */
/* -------------------------------------------------------------------------- */

//listen to weverse-fired api calls and only fetch more detail notification api endpoint if needed
//since this is fired by weverse, we are not creating unecessary api calls
const originalOpen = XMLHttpRequest.prototype.open;

function getCookie(name)
{
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
	return null;
}

async function generateWeverseUrl(targetUrl, targetPath, queryParamsData)
{
	const baseUrl = targetUrl;
	const encoder = new TextEncoder();
	const queryParams = queryParamsData;
	const wmsgpad = DateTime.now().ts;

	const apiPath = `${targetPath}${queryParams.toString()}`;
	const truncatedPath = apiPath.substring(0, 255);

	const keyStr = '1b9cb6378d959b45714bec49971ade22e6e24e42';
	const cryptoKey = await crypto.subtle.importKey(
		'raw',
		encoder.encode(keyStr),
		{ name: 'HMAC', hash: 'SHA-1' },
		false,
		['sign']
	);

	const dataStr = truncatedPath + wmsgpad.toString();
	const signature = await crypto.subtle.sign(
		'HMAC',
		cryptoKey,
		encoder.encode(dataStr)
	);

	const byteArray = new Uint8Array(signature);
	let binary = '';
	byteArray.forEach(byte => binary += String.fromCharCode(byte));
	const wmd = btoa(binary);

	const finalParams = new URLSearchParams(queryParams);
	finalParams.append('wmsgpad', wmsgpad);
	finalParams.append('wmd', wmd);

	return `${baseUrl}${targetPath}${finalParams.toString()}`;
}

async function fetchNotifications()
{
	// bearer token for api call.
	const accessToken = getCookie('we2_access_token');
	const deviceId = getCookie('we2_device_id');

	if (!accessToken || !deviceId) return;

	const queryParams = new URLSearchParams({
		appId: 'be4d79eb8fc7bd008ee82c8ec4ff6fd4',
		excludeGroup: 'COLLECTION,CO_HOST_LIVE,PARTY',
		language: 'en',
		os: 'WEB',
		platform: 'WEB',
		seen: 'true',
		wpf: 'pc',
	});

	const notificationUrl = await generateWeverseUrl('https://global.apis.naver.com/weverse/wevweb', '/noti/feed/v2.0/activities?', queryParams);

	log(notificationUrl);
	//return;
	GM_xmlhttpRequest({
		method: "GET",
		url: notificationUrl,
		headers: {
			"Authorization": `Bearer ${accessToken}`,
			"User-Agent": navigator.userAgent,
			"Accept": "application/json, text/plain, */*",
			"Accept-Language": "en-GB,en;q=0.5",
			"Referer": "https://weverse.io/",
			"Origin": "https://weverse.io",
			"DNT": "1",
			"WEV-device-Id": deviceId,
			"WEV-open-community": "A"
		},
		onload: function (response)
		{
			if (response.status === 200)
			{
				try
				{
					//log("API Response:", response);
					const data = JSON.parse(response.responseText);
					checkForLivestream(data);
				} catch (e)
				{
					log("Error parsing response:", e);
				}
			} else
			{
				log(response);
				log(`Failed to fetch data. Status: ${response}`);
			}
		},
		onerror: function (error)
		{
			log("Request failed:", error);
		}
	});
}

async function checkForLivestream(data)
{
	const cleanTitle = (title) => title.replace(/##ARTISTMARK##/g, '').replace(/##(.*?)##/g, '$1');
	const cleanPostId = (id) => id.replace(/:(.*?):/g, '');
	const now = DateTime.now();

	if (!data) return;
	log("Notification Data:", data);

	for (const notification of data?.data || [])
	{
		const apiId = notification?.messageId;
		const apiPostId = cleanPostId(apiId);
		const apiCommunityId = notification?.community.communityId;
		const apiActivityType = notification?.activityType; // "ARTIST_LIVE_ON_AIR".
		const apiArtistName = notification?.title;
		const apiNotificationTitle = cleanTitle(notification?.message?.values?.en ?? '');
		const apiNotificationImage = notification?.imageUrl ??
			notification?.logoUrl ??
			'';
		const apiNotificationUrl = "https://weverse.io" + notification?.webUrl;
		const apiTimestamp = notification?.time;

		const apiNotificationObject = {
			id: apiPostId,
			communityId: apiCommunityId,
			type: apiActivityType,
			artistName: apiArtistName,
			title: apiNotificationTitle,
			image: apiNotificationImage,
			url: apiNotificationUrl,
			timestamp: apiTimestamp
		};

		// Check if the notification is a livestream.
		if (apiActivityType === "ARTIST_LIVE_ON_AIR")
		{
			log("Livestream found:", notification);
			let processedNotification = GM_getValue('processedNotifications', []);
			const exist = processedNotification.some((item) => item.id === apiPostId);

			const from = DateTime.fromMillis(apiTimestamp);
			const diffs = now.diff(from, "hours");
			const hoursDiffs = diffs.toObject().hours;

			//log("From: ", from);
			//log("To: ", now);
			//log("Hours Diff: ", hoursDiffs);
			//log("Older than 1 hour ago? ", Math.floor(hoursDiffs) > 1);

			if (Math.floor(hoursDiffs) < 2)
			{
				// Most livestream is less than 1 hour long, and at best less than 2 hours.
				log(`Livestream is less than 2 hour ago [${Math.floor(hoursDiffs)} hour(s)]. Fetching livestream status...`);
				if (!exist)
				{
					log("Notification is not yet processed: ", exist);
					log("Checking live status now...");
					processedNotification.push(apiNotificationObject);
					GM_setValue('processedNotifications', processedNotification);

					const accessToken = getCookie('we2_access_token');
					const deviceId = getCookie('we2_device_id');
					const queryParamsHasOnAirLivePost = new URLSearchParams({
						appId: 'be4d79eb8fc7bd008ee82c8ec4ff6fd4',
						language: 'en',
						os: 'WEB',
						platform: 'WEB',
						wpf: 'pc',
						fields: 'hasOnAirLivePost'
					});

					const queryParamsPostId = new URLSearchParams({
						appId: 'be4d79eb8fc7bd008ee82c8ec4ff6fd4',
						language: 'en',
						os: 'WEB',
						platform: 'WEB',
						wpf: 'pc',
						fieldSet: 'postV1'
					});

					//// Checking via post details
					//const livestreamStatusUrlPostId = await generateWeverseUrl('https://global.apis.naver.com/weverse/wevweb', `/post/v1.0/post-${apiPostId}?`, queryParamsPostId);
					// data.extension.video.type === "LIVE"
					// data.extension.video.status === "ONAIR"

					//// Checking via community tab status
					const livestreamStatusUrlHasOnAirLivePost = await generateWeverseUrl('https://global.apis.naver.com/weverse/wevweb', `/community/v1.0/community-${apiCommunityId}?`, queryParamsHasOnAirLivePost);

					GM_xmlhttpRequest({
						method: "GET",
						url: livestreamStatusUrlHasOnAirLivePost,
						headers: {
							"Authorization": `Bearer ${accessToken}`,
							"User-Agent": navigator.userAgent,
							"Accept": "application/json, text/plain, */*",
							"Accept-Language": "en-GB,en;q=0.5",
							"Referer": "https://weverse.io/",
							"Origin": "https://weverse.io",
							"DNT": "1",
							"WEV-device-Id": deviceId,
							"WEV-open-community": "A"
						},
						onload: function (response)
						{
							// livestreamStatusUrlPostId
							//     if (response.status === 200)
							//     {
							//         try
							//         {
							//             const data = JSON.parse(response.responseText);
							//             if (data?.extension?.video?.type === "LIVE" && data?.extension?.video?.status === "ONAIR")
							//             {
							//                 GM_notification({
							//                     text: apiNotificationTitle,
							//                     title: apiArtistName,
							//                     image: apiNotificationImage,
							//                     onClick: () =>
							//                     {
							//                         GM_openInTab(apiNotificationUrl);
							//                     }
							//                 });
							//             }
							//         } catch (e)
							//         {
							//             log("Error parsing response:", e);
							//         }
							//     } else
							//     {
							//         try
							//         {
							//             const data = JSON.parse(response.responseText);
							//             if (data.errorCode === "digital_membership_710")
							//             {
							//                 GM_notification({
							//                     text: apiNotificationTitle,
							//                     title: apiArtistName,
							//                     image: apiNotificationImage,
							//                     onClick: function ()
							//                         {
							//                             GM_openInTab(apiNotificationUrl, { active: true, insert: true });
							//                         }
							//                 });
							//             } else
							//             {
							//                 log(response);
							//                 log(`Failed to fetch data. Status: ${response}`);
							//             }
							//         } catch (e)
							//         {
							//             log("Error parsing response:", e);
							//         }
							//     }
							//     console.timeEnd('API Request Time'); // End the timer and log the time
							// },
							// onerror: function (error)
							// {
							//     log("Request failed:", error);
							//     console.timeEnd('API Request Time'); // End the timer in case of error
							// }
							// livestreamStatusUrlPostId End
							if (response.status === 200)
							{
								log(response);
								try
								{
									const data = JSON.parse(response.responseText);
									if (data?.hasOnAirLivePost === true)
									{
										GM_notification({
											text: apiNotificationTitle,
											title: apiArtistName,
											image: apiNotificationImage,
											onclick: function ()
											{
												log("Opening Livestream...", apiNotificationUrl);
												GM_openInTab(apiNotificationUrl, { active: true, insert: true });
											}
										});
									}
								} catch (e)
								{
									log("Error parsing response:", e);
								}
							} else
							{
								log(`Failed to fetch data. Status: ${response}`);
							}
						},
						onerror: function (error)
						{
							log("Request failed:", error);
						}
					});
				} else
				{
					log(`Livestream has been processed. Skipping status check...`);
					log("----------------------------------------------------------------------");
				}
			} else
			{
				log(`Livestream is more than 2 hour ago [${Math.floor(hoursDiffs)} hour(s)]. Skipping...`);
				log("----------------------------------------------------------------------");
			}
		}
	}
}

XMLHttpRequest.prototype.open = function (method, url, ...rest)
{

	const shouldIntercept = url.includes('https://global.apis.naver.com/weverse/wevweb/noti/feed/v2.0/activities/community');
	const shouldIntercept2 = url.includes('https://global.apis.naver.com/weverse/wevweb/home/v1.0/home/pc');

	if (shouldIntercept)
	{
		const originalOnLoad = this.onload;
		this.addEventListener('load', async function ()
		{
			try
			{
				const toCompare = await GM_getValue('lastNotiV2ActivitiesCommunity');
				const timestamp = DateTime.now().toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);
				const data = JSON.parse(this.responseText);
				const newData = data?.data;

				if (JSON.stringify(newData) === JSON.stringify(toCompare))
				{
					console.log(`⚠️ No new Notification(s) available - ${timestamp}`);
				} else
				{
					console.log(`🚨 New Notification(s) available - ${timestamp}`);
					await GM_setValue('lastNotiV2ActivitiesCommunity', newData);
					try
					{
						fetchNotifications();
					} catch (e)
					{
						log("🚨 fetchNotifications error:", e);
					}
				}
			} catch (e)
			{
				log('🚨 Failed to parse response:', e);
			}

			if (originalOnLoad) originalOnLoad.apply(this, arguments);
		}, { once: true });
	}

	const now = DateTime.now();
	const expiryDate = DateTime.fromISO('2025-12-31');

	if (shouldIntercept2 && endorsement_enabled && (now < expiryDate))
	{
		let bannerImageUrl = GM_getResourceURL("banner") || "https://i.postimg.cc/L84gDf2X/dc3feec0dfa0f1c3a3fa8d93fc0ca9c0.png";
		const originalOnLoad = this.onload;
		this.addEventListener('load', function ()
		{
			try
			{
				let data = JSON.parse(this.responseText);

				const toPush = {
					"bannerId": 5050,
					"startDate": 0,
					"endDate": 97195420800000,
					"contentType": "IMAGE_TITLE_SUBTITLE",
					"content": {
						"imageUrl": bannerImageUrl,
						"firstTitle": "3rd Mini Album",
						"secondTitle": "Day & Night",
						"subTitle": "Official album & merch",
						"secondSubTitle": "now on Weverse Shop 💖",
						"textColor": "#000000"
					},
					"landingUrl": "https://shop.weverse.io/en/shop/USD/artists/233",
					"landingUrlType": "EXTERNAL_WEBLINK",
					"communityName": "FIFTY FIFTY"
				};

				data.mainBanners.splice(1, 0, toPush);

				const modifiedResponseText = JSON.stringify(data);

				Object.defineProperty(this, 'responseText', {
					value: modifiedResponseText,
					writable: true,
					configurable: true
				});

				this.responseXML = new DOMParser().parseFromString('<root></root>', 'application/xml');
			} catch (e)
			{
				console.error('🚨 Failed to parse response:', e);
			}

			if (originalOnLoad) originalOnLoad.apply(this, arguments);
		}, { once: true });
	}

	return originalOpen.apply(this, [method, url, ...rest]);
};