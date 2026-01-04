// ==UserScript==
// @name        Instagram full-size media scroll wall
// @author      deltabravozulu + driver8
// @description Creates a scrollable wall of full-size images from any user's instagram page. Just click the "Load Images" button at the top.
// @include     /^https?://www\.instagram\.com/[\s\S\w\W\d\D]+$/
// @exclude     https://www.instagram.com/p/*
// @exclude     https://instagram.com/p/*
// @exclude     https://www.instagram.com/
// @exclude     https://instagram.com/
// @version     0.2.0[deltabravozulu]
// @grant       none
// @namespace https://greasyfork.org/users/774364
// @downloadURL https://update.greasyfork.org/scripts/426804/Instagram%20full-size%20media%20scroll%20wall.user.js
// @updateURL https://update.greasyfork.org/scripts/426804/Instagram%20full-size%20media%20scroll%20wall.meta.js
// ==/UserScript==

//readd to user script later after generating feed wall
// @match       *://*.instagram.com/*


(function () {
	"use strict";

	console.log("hi insta scroll");
	// https://www.instagram.com/graphql/query/?query_hash=<hash>&variables={%22shortcode%22:%22<shortcode>%22}

	const IMAGES_PER_QUERY = 12;
	const NTH_TO_LAST_IMAGE = 3;
	const HEIGHT_PCT = 0.8;
	const WIDTH_PCT = 0.49;
	const VID_VOLUME = 0.02;
	let m = document.body.innerHTML.match(/profilePage_(\d+)/);
	var userId = m && m[1];
	var notLoaded = true;

	function getQueryHash() {
		let allScripts = Array.from(document.getElementsByTagName("script"));
		let PostPageContainer = allScripts.find(
			(el) => el.src && el.src.match(/ProfilePageContainer.js/)
		);
		let FeedPageContainer = allScripts.find(
			(el) => el.src && el.src.match(/FeedPageContainer.js/)
		);
		let ConsumerLibCommons = allScripts.find(
			(el) => el.src && el.src.match(/ConsumerLibCommons.js/)
		);
		let Consumer = allScripts.find(
			(el) => el.src && el.src.match(/Consumer.js/)
		);
		//NotificationLandingPage.js


		var query_hash = false,
			query_id = false;

		if (typeof ConsumerLibCommons !== "undefined") {
			console.log("ConsumerLibCommons is defined");
			fetch(ConsumerLibCommons.src)
				.then((resp) => {
					console.log("resp 1", resp);
					return resp.text();
				})
				.then((text) => {
					let m = text.match(
						/profilePosts\.byUserId\.get.*?queryId:"([a-f0-9]+)"/
						//profilePosts.byUserId.get(n))||void 0===s?void 0:s.pagination},queryId:"e5555555555555555555555555555508"
					); 
					console.log("queryId m", m);
					query_id = m && m[1];
					query_id && notLoaded && loadImages(query_id, query_hash);
					// query_id && query_hash && loadImages(query_id, query_hash);
				});
		}

		if (typeof PostPageContainer !== "undefined") {
			console.log("PostPageContainer is defined");

			fetch(PostPageContainer.src)
				.then((resp) => {
					console.log("resp 1", resp);
					return resp.text();
				})
				.then((text) => {
					let m = text.match(
						/profilePosts\.byUserId\.get.*?queryId:"([a-f0-9]+)"/
					); //profilePosts.byUserId.get(n))||void 0===s?void 0:s.pagination},queryId:"e5555555555555555555555555555508"
					console.log("queryId m", m);
					query_id = m && m[1];
					query_id && notLoaded && loadImages(query_id, query_hash);
					// query_id && query_hash && loadImages(query_id, query_hash);
				});
		}

		if (typeof FeedPageContainer !== "undefined") {
			console.log("FeedPageContainer is defined");
			fetch(FeedPageContainer.src)
				.then((resp) => {
					console.log("resp 1", resp);
					return resp.text();
				})
				.then((text) => {
					let m = text.match(
						/profilePosts\.byUserId\.get.*?queryId:"([a-f0-9]+)"/
					); //profilePosts.byUserId.get(n))||void 0===s?void 0:s.pagination},queryId:"e5555555555555555555555555555508"
					console.log("queryId m", m);
					query_id = m && m[1];
					query_id && notLoaded && loadImages(query_id, query_hash);
					// query_id && query_hash && loadImages(query_id, query_hash);
				});
		}

		// l.pagination},queryId:"15b55555555555555555555555555551"
		if (typeof Consumer !== "undefined") {
			console.log("Consumer is defined");
			fetch(Consumer.src)
				.then((resp) => {
					console.log("resp 1", resp);
					return resp.text();
				})
				.then((text) => {
					//let m = text.match(/l\.pagination\},queryId:"([a-f0-9]+)"/); //const s="05555555555555555555555555555554",E="
					let m = text.match(
						/profilePosts\.byUserId\.get[^;]+queryId:\s*"([a-f0-9]+)"/
					);
					console.log("queryId m", m);
					query_id = m && m[1];
					query_id && notLoaded && loadImages(query_id, query_hash);
				});
		}
	}

	//         fetch(Consumer.src)
	//         .then(resp => {
	//             console.log('resp 1', resp);
	//             return resp.text();
	//         })
	//         .then(text => {
	//             let m = text.match(/const s="([a-f0-9]+)",E="/); //const s="05555555555555555555555555555554",E="
	//             m = m || text.match(/var u="([a-f0-9]+)",s="/);
	//             console.log('query_hash m', m);
	//             query_hash = m && m[1];
	//             query_hash && query_id && loadImages(query_id, query_hash);
	//         });

	// https://www.instagram.com/graphql/query/?query_hash=<queryhash>&variables=%7B%22id%22%3A%22<profle_id>%22%2C%22first%22%3A12%2C%22after%22%3A%22<after_code>%3D%3D%22%7D
	function loadImages(query_id, query_hash, after) {
		notLoaded = false;
		console.log("id", query_id, "hash", query_hash);

		// let userIdMetaTag = document.querySelector('head > meta[property="instapp:owner_user_id"]');
		// let userId = userIdMetaTag && userIdMetaTag.content;
		let m = document.body.innerHTML.match(/profilePage_(\d+)/);
		userId = userId || (m && m[1]);
		if (!userId) return;
		let queryVariables = { id: userId, first: IMAGES_PER_QUERY };
		//et queryVariables = { "id":"123456789","first":12 };

		if (after) queryVariables.after = after;
		let queryVariablesString = encodeURIComponent(
			JSON.stringify(queryVariables)
		);
		let imageListQueryUrl = `https://www.instagram.com/graphql/query/?query_hash=${query_id}&variables=${queryVariablesString}`;

		fetch(imageListQueryUrl, { responseType: "json" })
			.then((resp) => {
				console.log("resp 1", resp);
				return resp.json();
			})
			.then((json) => {
				console.log("json", json);

				let timelineMedia = json.data.user.edge_owner_to_timeline_media;
				let end_cursor = timelineMedia.page_info.end_cursor;
				let mediaList = timelineMedia.edges.map((n) => n.node);
				console.log("media list", mediaList);

				let bigContainer = document.querySelector("#igBigContainer");
				// Create the main container if it doesn't exist
				if (!bigContainer) {
					let tempDiv = document.createElement("div");
					tempDiv.innerHTML = `<div id="igBigContainer" style="background-color: #112;width: 100%;height: 100%;z-index: 999;position: fixed;top: 0;left: 0;overflow: scroll;">
                    <div id="igAllImages" style="display:block; text-align:center;"></div></div>`;
					bigContainer = tempDiv.firstElementChild;
					document.body.innerHTML = "";
					document.body.appendChild(bigContainer);

					let imgStyle = document.createElement("style");
					imgStyle.type = "text/css";
					setMaxSize(imgStyle);
					document.body.appendChild(imgStyle);
					window.addEventListener("resize", (evt) =>
						setMaxSize(imgStyle)
					);
					styleIt();
				}
				let innerContainer = bigContainer.firstElementChild;

				for (let media of mediaList) {
					addMedia(media, innerContainer);
				}

				if (end_cursor) {
					console.log("end_cursor", end_cursor);
					let triggerImage = document.querySelector(
						"#igAllImages a:nth-last-of-type(3)"
					);
					bigContainer.onscroll = (evt) => {
						let vh =
							document.documentElement.clientHeight ||
							window.innerHeight ||
							0;
						if (
							triggerImage.getBoundingClientRect().top - 800 <
							vh
						) {
							bigContainer.onscroll = null;
							console.log("loading next set of images");
							loadImages(query_id, query_hash, end_cursor);
						}
					};
				}
			});
	}

	function getBestImage(media) {
		return media.display_resources.reduce((a, b) =>
			a.width > b.width ? a : b
		).src;
	}

	function addMedia(media, container) {
		let shortcode = media.shortcode;
		let medias = media.edge_sidecar_to_children
			? media.edge_sidecar_to_children.edges.map((n) => n.node)
			: [media];
		for (let m of medias) {
			let a = document.createElement("a");
			a.href = `https://www.instagram.com/p/${shortcode}/`;
			if (m.is_video) {
				let vid = document.createElement("video");
				vid.src = m.video_url;
				vid.controls = true;
				vid.volume = VID_VOLUME;
				a.textContent = "Link";
				container.appendChild(vid);
				container.appendChild(a);
			} else {
				a.innerHTML += `<img src="${getBestImage(m)}">`;
				container.appendChild(a);
			}
		}
	}

	function setMaxSize(userStyle) {
		let vw = document.documentElement.clientWidth || window.innerWidth || 0;
		let vh =
			document.documentElement.clientHeight || window.innerHeight || 0;
		userStyle.innerHTML = `
#igAllImages img, #igAllImages video {
  max-height: ${vh * HEIGHT_PCT}px;
  max-width: ${vw * WIDTH_PCT}px;
}
`;
	}

	function styleIt() {
		let userStyle = document.createElement("style");
		userStyle.type = "text/css";
		userStyle.innerHTML = `
#igAllImages video {
  border: green solid 2px;
`;
		document.body.appendChild(userStyle);
	}

	function startUp() {
		"use strict";
		var svgImageWallBtn = `<img height="24" width="24" src="data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNDAwIDQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtMTc4LjcgMGMxMS45IDMuOCAxNS4zIDEyLjMgMTUuMyAyNC4zLS4zIDEwMi43LS4yIDIwNS41LS4yIDMwOC4yIDAgMTQuMi03LjQgMjEuNy0yMS41IDIxLjdoLTE1MC45Yy0xNCAwLTIxLjQtNy40LTIxLjQtMjEuNHYtMjQ1LjgtNC42aDEyLjd2MjE3LjhjMi0xLjUgMy41LTIuNCA0LjYtMy41IDI0LjktMjQuNiA0OS43LTQ5LjIgNzQuNi03My44IDExLjgtMTEuNiAyMy43LTIzLjEgMzUuNS0zNC44IDYuNi02LjUgOS42LTYuNiAxNi4zLjEgMTEuMSAxMSAyMi4yIDIyLjEgMzMuMiAzMy4zLjcuNyAxLjIgMS43IDIuOCAyIC4xLTEuMi4yLTIuNC4yLTMuNiAwLTY2IDAtMTMyIC4xLTE5OCAwLTcuMS0yLjEtOS4xLTkuMi05LjFoLTE0OC45Yy03IDAtOS4yIDIuMy05LjIgOS4zdjIyaC0xMi4yYy4yLTEwLjEtLjUtMjAuNC41LTMwLjQuNy03LjMgNi45LTExLjEgMTMuMy0xMy43em0xLjQgMjQ2LjJjLTE1LjctMTctMjkuOC0zMi40LTQ0LjEtNDcuOC00MS42IDQwLjktODIuMyA4MC45LTEyMy4yIDEyMS4xdjEzLjZjMCA1LjcgMi40IDguMyA4LjIgOC4zIDUwLjUuMSAxMDEuMSAwIDE1MS42IDAgNC44IDAgNy40LTIuNSA3LjQtNy4zLjItMzAuNC4xLTYwLjcuMS04Ny45em0zOSA4LjNjOS41IDEwLjggMTcuNCAxOS44IDI1LjMgMjguOCAxLjEtLjggMS41LTEuMSAxLjktMS40IDEzLTEyLjcgMjUuOS0yNS40IDM4LjktMzguMSAxOC44LTE4LjUgMzcuNi0zNy4xIDU2LjUtNTUuNyA0LjUtNC41IDguNi00LjUgMTMuMi4xIDEwLjMgMTAuMiAyMC41IDIwLjQgMzEuMyAzMS4xdi05MS4yaDEzLjh2MjUyYzAgMTEuNC04LjUgMTkuOC0xOS45IDE5LjhoLTE1NC44Yy0xMC44IDAtMTktOC4yLTE5LTE5di0zMTYuNWMwLTEwLjYgOC4yLTE4LjggMTguNy0xOC44aDE1NS4yYzExLjIgMCAxOS43IDguNSAxOS44IDE5LjYuMSA4LjEgMCAxNi4zIDAgMjQuNmgtMTMuN3YtMjIuOWMwLTYuMy0yLjItOC41LTguNi04LjVoLTE1MC4xYy01LjkgMC04LjYgMi4yLTguNiA3LjMgMCA2NC4yLjEgMTI4LjIuMSAxODguOHptMzYuMyAzN2MxNy4zIDE4LjEgMzQuMyAzNS45IDUxIDUzLjQtMi43IDIuOS01LjQgNS44LTguMyA5LTI2LjItMjUuNy01Mi4yLTUxLjItNzkuMS03Ny42djEwMS4xYzAgNy45IDEuOCA5LjggOS43IDkuOGgxNDguNWM3IDAgOS4xLTIuMSA5LjEtOS4ydi04Ni41LTQ5LjhjLTEzLjktMTUuMS0yNS45LTI4LjMtMzgtNDEuNC0zMS43IDMxLjEtNjIuNiA2MS41LTkyLjkgOTEuMnoiLz48cGF0aCBkPSJtNzcuOCAzMS41YzIzLjQtLjMgNDQuMiAxOS40IDQ1IDQxLjUuOSAyNi45LTE4LjggNDYuNi00My45IDQ3LjItMjUuNC42LTQ2LjMtMTguNi00Ni41LTQyLjItLjItMjYuOSAxOC42LTQ2LjIgNDUuNC00Ni41em0tMzIuNSA0NC43Yy4xIDE2LjkgMTQuOCAzMS40IDMyLjIgMzEgMTcuMy0uNCAzMi4xLTEyLjYgMzIuMS0zMS40IDAtMTkuMS0xNS45LTMxLjEtMzIuMy0zMS4zLTE3LjUtLjEtMzIuMSAxNC42LTMyIDMxLjd6bTMwMi40LTV2MTIuNGgtODkuOXYtMTIuNHptMzguOSAzMS42aDEzLjF2MTIuNGgtMTMuMXptLTM4Ni40LTMzLjV2LTEyLjJoMTIuNHYxMi4yem0zNzMuNSAxNC40aC0xMi40di0xMi40aDEyLjR6Ii8+PC9zdmc+"></img>`;

		var checkExistTimer = setInterval(function () {
			let homeSelector = "nav span img";
			let menuAndStorySelector = "header button > span";
			let profileSelector = "header section svg circle";

			// check profile
			if (document.getElementsByClassName("imagewall-btn").length === 0) {
				if (document.querySelector(profileSelector)) {
					addCustomBtnProfile(
						document.querySelector(profileSelector),
						"black",
						append2Header
					);
				} else if (document.querySelector(menuAndStorySelector)) {
				} else if (document.querySelector(homeSelector)) {
					addCustomBtnHome(
						document.querySelector(homeSelector),
						"black",
						append2Header
					);
				}
			}
		}, 500);

		function append2Header(node, btn) {
			node.parentNode.parentNode.parentNode.appendChild(
				btn,
				node.parentNode.parentNode
			);
		}

		function addCustomBtnProfile(node, iconColor, appendNode) {
			// add button and set onclick handler
			let imageWallBtn = createCustomBtn(
				svgImageWallBtn,
				iconColor,
				"imagewall-btn",
				"16px",
				"8px"
			);
			appendNode(node, imageWallBtn);
		}
		function addCustomBtnHome(node, iconColor, appendNode) {
			// add button and set onclick handler
			let imageWallBtn = createCustomBtn(
				svgImageWallBtn,
				iconColor,
				"imagewall-btn Fifk5",
				"16px",
				"inherit"
			);
			appendNode(node, imageWallBtn);
		}

		function createCustomBtn(
			svg,
			iconColor,
			className,
			marginLeft,
			marginTop
		) {
			let newBtn = document.createElement("div");
			newBtn.innerHTML = svg.replace("%color", iconColor);
			newBtn.setAttribute("class", "custom-btn " + className);
			newBtn.setAttribute("target", "_blank");
			newBtn.setAttribute(
				"style",
				"cursor: pointer;margin-left: " +
					marginLeft +
					";margin-top: " +
					marginTop +
					";"
			);
			newBtn.onclick = getQueryHash;
			if (className.includes("imagewall-btn")) {
				newBtn.setAttribute("title", "Load Image Wall");
			}
			return newBtn;
		}
	}
	startUp();
})();
