// ==UserScript==
// @name           Memrise (CSS) Dashboard Condensed View
// @description    Personal CSS preferences for Dashboard, display in Cards
// @match          http://*.memrise.com/home/*
// @match          https://*.memrise.com/home/*
// @run-at         document-end
// @version        1.1
// @grant          none
// @namespace      https://greasyfork.org/users/213706
// @downloadURL https://update.greasyfork.org/scripts/372348/Memrise%20%28CSS%29%20Dashboard%20Condensed%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/372348/Memrise%20%28CSS%29%20Dashboard%20Condensed%20View.meta.js
// ==/UserScript==

if(typeof unsafeWindow == "undefined") {
  unsafeWindow = window;
}

// Custom CSS
const css = document.createElement('style');

css.textContent = `
.container {
    width: 100%;
    padding: 0 20px;
}
.courses-filter-container .title-container {
		margin-left: 0;
}
.tabbed-main {
    width: calc(100% - 195px);
    padding-left: 25px;
    box-sizing: border-box;
}
.courses-filter-container {
		margin-right: 50px;
}

.course-card-container {
    width: 220px;
}
div.courses-filter-container + div {
    display: flex;
    flex-wrap: wrap;
}
.course-card-container {
    margin-right: 15px;
}
.course-card-container .course-progress-box .card-top .card-main-container {
    width: 100%;
}
.course-card-container .course-progress-box .card-top .card-main-container .detail.wide {
    width: 100%;
}
.course-card-container .course-progress-box .card-top .card-image-col {
    display: block;
    margin: 0 auto;
}
.course-card-container .course-progress-box .card-top .card-main-container .detail {
		width: 100%;
		max-width: 290px;
}
.course-card-container .course-progress-box .card-top .card-main-container .detail .title {
    height: 40px;
    margin-top: 5px;
		margin-bottom: 10px;
    font-size: 18px;
    line-height: 20px;
		padding: 0 10px;
}
.course-card-container .course-progress-box .card-top .card-main-container .detail .title a {
		color: #3E3E3E;
}
.course-card-container .course-progress-box .card-top {
		padding: 40px 10px 10px;
}

/* Actions set goal, quit course... */
.course-card-container .course-progress-box .card-top .wrapper {
		position: static;
}
.course-card-container .course-progress-box .card-top .card-main-container .pull-right {
    position: absolute;
		top: 0;
		left: 0;
		width: 100%;
    text-align: center;
    padding: 5px;
    box-sizing: border-box;
}
.course-card-container .course-progress-box .card-top .card-main-container .pull-right a { /* hide link to leaderbord */
		display: none;
}
.course-card-container .course-progress-box .card-top .card-main-container .goal-setter-btn {
    padding: 0;
		background: white;
		box-shadow: none;
}
.course-card-container .course-progress-box .onoff, .course-card-container .course-progress-box .points {
		color: #7a7a7a;
		font-weight: 500;
}
.course-card-container .course-progress-box .card-top .card-main-container .course-progress .left {
		position: absolute;
		top: 0;
		left: 0;
		padding: 7px;
    width: 100% !important;
    text-align: center;
    pointer-events: none;
		text-transform: uppercase;
}
.course-card-container .course-progress-box .card-top .card-main-container .ctrl-btn {
		position: absolute;
		right: 0;
}

/* Actions review/learn... */
.single-continue-button {
    display: none;
}
.mode-selector-button-label {
    display: none;
}
.mode-selector-button {
    min-width: unset;
}

/* Goal progress */
.course-card-container .goal-setter .streak-edit {
		width: 84px;
		vertical-align: bottom;
		border-right: 0;
}
.course-card-container .goal-setter .streak-row {
		width: calc(100% - 84px);
		box-sizing: border-box;
		padding-left: 0;
}
.course-card-container .goal-setter .streak-row .streak .streak-bubbles .streak-bubble,
.course-card-container .goal-setter .streak-row .streak .streak-bubbles .streak-bubble.current {
		width: 22px;
}
.course-card-container .goal-setter .streak-row .streak,
.course-card-container .goal-setter .streak-row .streak .streak-bubbles .streak-bubble span {
		width: 100%;
}
.course-card-container .goal-setter .streak-row .streak .streak-bubbles {
		display: flex;
		justify-content: space-around;
}
.course-card-container .goal-setter .streak-row .streak .streak-bubbles .streak-bubble span {
		left: 0;
}
.course-card-container .goal-setter .streak-row .streak .streak-bubbles .streak-bubble {
		background-size: 90px 32px;
		background-position: -7px 0; /* -5px 0px; */
}
.course-card-container .goal-setter .streak-row .streak .streak-bubbles .streak-bubble.current {
		background-size: 90px 32px;
		background-position: -37px 0; /* -40px 0px; */
}
.course-card-container .goal-setter .goal-setter-progress {
		width: calc(100% - 15px);
		margin-left: 10px;
}
.course-card-container .goal-setter .streak-row .streak-fake-btn {
		position: absolute;
		left: 7px;
}
.course-card-container .goal-setter .streak-edit .level,
.course-card-container .goal-setter .streak-edit .duration {
		display: none;
}
.course-card-container .goal-setter .streak-edit .edit-goal-btn {
		height: 1.6em;
		overflow: hidden;
		margin-left: 5px;
    background: transparent;
    box-shadow: none !important;
    color: rgba(0,0,0,0.25);
		white-space: nowrap;
		top: 10px;
		margin-left: 9px;
}
.course-card-container .goal-setter .streak-edit .edit-goal-btn::before {
		content: "• • •";
}
.course-card-container .goal-setter .streak-edit .edit-goal-btn span {
		display: none;
}
.course-card-container .goal-setter .streak-edit .edit-goal-btn:hover {
		background: #eee;
}

/* Placeholder when loading */
.loading-item {
  width: 232px;
    box-sizing: border-box;
    overflow: hidden;
    min-height: 309px;

    background-image: url("https://static.memrise.com/img/icons/loader@2x.gif");
    background-position: center center;
    background-size: 32px 32px;
    background-repeat: no-repeat;
}
.loading-item .loading-animation {
		display: none;
}

/* Smaller screens */
#content .container.container-main {
		min-width: unset;
}

@media (max-width: 768px) { /* col-md */
		#content .container.container-main {
				min-width: unset;
		}
		.tabbed-sidebar,
		.tabbed-main {
				width: 100%;
				padding-left: 0;
		}
		.sidebar-box,
    #m-sidebar-leaderboard,
		.course-card-container {
      	width: calc(100% - 40px);
    }
		.courses-filter-container {
        position: fixed;
        z-index: 999;
        left: 0;
        top: 145px;
        padding-top: 10px;
        background: white;
        width: 100%;
    }
    h1.title {
      	padding-left: 15px;
    }
    .course-card-container .goal-setter .streak-row .streak .streak-bubbles .streak-bubble span {
        left: -2px;
    }
}
`;

document.head.appendChild(css);

// Automatically load more courses (to fill up the view)
var i = 0;

function loadMoreCourses() {
    if(!unsafeWindow.MEMRISE.dashboard.cardsComponent.vm.hasMoreCourses()) {
      return;
    }
  	if(!unsafeWindow.MEMRISE.dashboard.cardsComponent.vm.isLoading()) {
				unsafeWindow.MEMRISE.dashboard.cardsComponent.loadMoreCourses();

        if(++i == 1) return;
    }
  	setTimeout(loadMoreCourses, 500);
}
window.addEventListener('load', function(){
  setTimeout(loadMoreCourses, 500);
}, false);
