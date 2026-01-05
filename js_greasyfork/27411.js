// ==UserScript==
// @name          4chan Plus Minus
// @version       1.0.0
// @description   A simpler Image Viewer & Hider. Adds a cute plus or minus.
// @include       http://boards.4chan.org/*
// @include       https://boards.4chan.org/*
// @namespace     https://greasyfork.org/users/3159
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/27411/4chan%20Plus%20Minus.user.js
// @updateURL https://update.greasyfork.org/scripts/27411/4chan%20Plus%20Minus.meta.js
// ==/UserScript==
window.addEventListener('load', function () {

	var path = document.location.pathname.split("/");

	if (path[2] == "thread") {

		c = 0;

		function xc(q, r) {
			a = document.getElementsByClassName("boardList");
			a[0].insertAdjacentHTML(q, r);
			a[1].insertAdjacentHTML(q, r);
			b = document.getElementsByClassName("customBoardList");
			if (b[0]) {
				b[0].insertAdjacentHTML(q, r);
				b[1].insertAdjacentHTML(q, r);
			}
		}

		function hide() {
			if (document.getElementsByClassName('expanded-thumb').length) {
				disable = document.getElementsByClassName('expanded-thumb')[0];
				disable.remove();
				setTimeout(hide, 10);
			}
		}

		function hide2() {
			if (document.getElementsByClassName('collapseWebm').length) {
				disable2 = document.getElementsByClassName('collapseWebm')[0].children[0];
				disable2.remove();
				setTimeout(hide2, 10);
			}
		}

		function tigger() {

			c = c ? 0 : 1;

			if (c) {
				pics = document.getElementsByClassName('fileThumb');
				for (i = 0; i < pics.length; i++) {
					pics[i].children[0].click();
				}
				for (i = 0; i < s2.length; i++) {
					s2[i].innerText = "-";
				}
			} else {
				hide();
				hide2();
				s1 = document.getElementsByClassName("3pm");
				for (i = 0; i < s1.length; i++) {
					s1[i].remove();
				}
			}
		}

		xc("beforeend", "<span class=3pm>[<a class=4pm href=javascript:void(0)>+</a>] </span>");
		s2 = document.getElementsByClassName("4pm");
		for (i = 0; i < s2.length; i++) {
			s2[i].onclick = tigger;
		}

		document.addEventListener("keydown", function (e) {
			console.log(e.which);
			switch (e.which) {
			case 187:
				tigger();
				break;
			case 189:
				tigger();
				tigger();
				break;
			}
		});

	}
});