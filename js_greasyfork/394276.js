// ==UserScript==
// @name         Anti Wuxia World Co
// @namespace    es.csnv.anti-wuxia-world-co
// @version      1.6.3
// @description  mememe
// @author       You
// @match        https://m.wuxiaworld.co/reincarnation-of-the-strongest-sword-god/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394276/Anti%20Wuxia%20World%20Co.user.js
// @updateURL https://update.greasyfork.org/scripts/394276/Anti%20Wuxia%20World%20Co.meta.js
// ==/UserScript==

(function() {
    'use strict';
console.log("Anti Wuxia World Co loaded");

    function main() {
		const chapterContent = document.querySelector("#chaptercontent");
		const prev = document.querySelector("#pt_prev").href;
		const next = document.querySelector("#pt_next").href;
		const index = document.querySelector("#pt_mulu").href;
		const title = document.querySelector("span.title").innerText;

		const chapter = chapterContent.innerText
        	.replace(/\n\n\n\n/g, "\n\n")
        	.replace(/\n/g, "<br/>")
			.replace("You will love this Android App, no dvertising, faster update, offline reading and free. Click here to download>>>", "")
        	.split("* * *")[0];

		document.write(`
			<html>
				<head>
					<style>
						body {
							font-family: Helvetica, Arial, sans-serif;
							color: #eeeeee;
							background-color: #222;
							font-size: 1.1em !important;
							line-height: 1.6em;
							padding-top: 20px;
						}
						#container {
							max-width: 60em;
							margin: 0 auto;
						}
						#title {
							font-size: 1.7em;
							font-weight: bold;
							line-height: 1.35em;
							width: 100%;
							margin: 40px 0px 20px;
							padding: 0;
						}
						nav {
						display: flex;
						}
						nav a {
							display: block;
							flex-grow: 1;
							width: 33em;
							color: white;
							text-align: center;
						}

						@media screen and (max-device-width: 1200px) {
							body {
								background-color: #222;
								color: #dadada;
							}
							#container {
								max-width: 100%;
								margin: 0 10px;
							}
							#title {
								font-size: 1.2em;
							}
						}
					</style>
				</head>
				<body>
					<div id="container">
						<header>
							<nav>
								<a href="${prev}">PREV</a>
								<a href="${index}">INDEX</a>
								<a href="${next}">NEXT</a>
							</nav>
							<div id="title">
								${title}
							</div>
						<header>
						<hr/>
						<section id="content">
							${chapter}
						</section>
						<hr/>
						<footer>
							<nav>
								<a id="prev" href="${prev}">PREV</a>
								<a href="${index}">INDEX</a>
								<a id="next" href="${next}">NEXT</a>
							</nav>
						<footer>
					</div>
				</body>
			</html>
		`);

        // Keyboard arrows
        document.addEventListener("keyup", function(e) {
            const keyCodes = {
                "39": "next",
                "37": "prev"
            };
            const button = keyCodes[e.keyCode];
            if (button) {
                document.getElementById(button).click();
            }
        });

        // Swipe
        document.addEventListener("touchstart", function(e) {
            const initialX = e.touches[0].pageX;
            const initialTop = document.body.scrollTop;
            let endX;

            const onMove = function(e) {
                endX = e.touches[0].pageX;
            };
            
            const onEnd = function(e) {
                document.removeEventListener("touchend", onEnd);
                document.removeEventListener("touchmove", onMove);
                
                const actionX = endX - initialX;
                const actionY = document.body.scrollTop - initialTop;
                // Don't swipe if vertial scroll is greater than horizontal
                if (Math.abs(actionY) * 2 > Math.abs(actionX)) {
                    return;
                }

                const actionWidth = document.documentElement.clientWidth / 2.5;
                if (actionWidth < Math.abs(actionX)) {
                    /* swipe to the left -> previous. Swipe to the right -> next */
                    document.getElementById(Math.sign(actionX) > 0 ? "prev" : "next").click();
                }
            };

            document.addEventListener("touchend", onEnd);
            document.addEventListener("touchmove", onMove);

        });

        window.stop();
    }

	main();
})();