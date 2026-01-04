// ==UserScript==
// @name         VideoSync视频同步播放
// @description  远程同步视频播放，在暂停、播放、拖动进度条时会，对方会自动进行同步操作
// @namespace    https://github.com/RiverYale/Userscripts/
// @homepage     https://riveryale.github.io/Userscripts/
// @version      1.3
// @author       RiverYale
// @include      *
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAG6SURBVDhPjZM7z0FBEIZfx6EXEhGFQqHVEAoiCqJSqLT8B71GoxGFQiVRqiQ6lc4lKolLonOJEIkGcd3vzFiCRPI9zdmZs+/OzM4shKRerwu/3y9Wq5X0fLJcLkUwGBTNZlN6hFAg2e126Pf7SKVS0vNJMplEr9fDZrORHkCVX1itVng8HrTbbVSrVVgsFlwuFxiNRsxmMwwGA3i9XthsNqkAdNfrVUSjUY5KG0lwv99hMBhwu92g1+txPp+hqiqv6b9WHhqNBtR8Po/xeIxWqwWHw8ECEmslyfO1CDodFEVh8XQ6RSwWQ6FQAKUqyuXy4wb+SbFYFKFQSCh0GkUiFosFut0ur7/pdDrQOsFrTc9laNkoL3E2m0UkEsF+v2f7yXa7RTgcRi6XY5v2cylsSejkw+GA9XotPQ/m8zmOx+Mr8pMP8el0et32O3SJlCod8M6H2OfzwW63w+l0Ss8Dt9vNcxAIBKTngfLsJUE1U4rf0L1QyplMhu3nDChmsxmTyYSd/2U4HMJkMkFNp9NIJBJcp8vl4pp/Qe0ZjUYolUo8YTpqeq1WQ6VS4cdBKf6CAtDM0+OJx+P4A5YgKxpQJCX1AAAAAElFTkSuQmCC
// @run-at       document-end
// @require      https://lib.baomitu.com/peerjs/1.4.5/peerjs.min.js
// @require      https://lib.baomitu.com/vue/2.7.7/vue.min.js
// @require      https://lib.baomitu.com/clipboard.js/2.0.10/clipboard.min.js
// @compatible   chrome
// @compatible   edge
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/457501/VideoSync%E8%A7%86%E9%A2%91%E5%90%8C%E6%AD%A5%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/457501/VideoSync%E8%A7%86%E9%A2%91%E5%90%8C%E6%AD%A5%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

/*================= 更新脚本前注意保存自己修改的内容！ =================*/

/*================= 更新脚本前注意保存自己修改的内容！ =================*/


const videoSyncCss = `
.sync-app-wrapper {
	display: inline-block;
	position: fixed;
	right: 10px;
	bottom: 20px;
	user-select: none;
	filter: drop-shadow(5px 5px 7px rgb(0 0 0 / 25%));
	z-index: 4000;
	transition: right .2s;
}
.app-off {
	right: -400px;
}
.st0{fill:#FFFFFF;}
.st1{fill:#578C16;}
.st2{fill:#BFC9AD;}
.st3{fill:#F69D65;}
.st4{fill:#F7F6F2;}
.st5{opacity:0.33;}
@keyframes shake {
	0%   {transform: translate(22px, 6px) rotateZ(0deg);}
	25%  {transform: translate(22px, 6px) rotateZ(10deg);}
	50%  {transform: translate(22px, 6px) rotateZ(0deg);}
	75%  {transform: translate(22px, 6px) rotateZ(-10deg);}
	100% {transform: translate(22px, 6px) rotateZ(0deg);}
}
.app-switch {
	display: inline-block;
	vertical-align: bottom;
	width: 100px;
	height: 100px;
	transform: translate(22px, 6px);
	cursor: pointer;
}
.app-switch:hover {
	animation: shake .5s linear;
}
.main-panel {
	display: inline-block;
	width: 400px;
	background-color: white;
}
.panel-header {
	display: flex;
	height: 40px;
}
.panel-header span {
	flex: 1;
	text-align: center;
	cursor: pointer;
	line-height: 40px;
	font-size: 14px;
	text-decoration: none;
	color: rgba(0, 0, 0, 0.7);
}
.panel-header span:hover {
	background-color: rgba(0, 0, 0, 0.05);
}
.panel-header .header-active {
	border-bottom: 2px rgb(63, 81, 181) solid;
	color: rgb(63, 81, 181);
}
.information-panel {
	display: flex;
	flex-direction: column;
	height: 160px;
	justify-content: space-evenly;
	padding: 0 20px 0 10px;
}
.info-row {
	display: flex;
	width: 100%;
	height: 25px;
}
.info-title {
	width: 75px;
	font-weight:700;
	text-align: right;
	font-size: 14px;
	line-height: 25px;
	color: black;
}
.info-value {
	flex: 1;
	font-size: 14px;
	line-height: 25px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	padding: 0 10px 0 5px;
	color: black;
}
.info-btn {
	font-size: 13px;
	width: 50px;
	height: 100%;
	cursor: pointer;
	color: white;
	background-color: rgb(255, 64, 129);
	border: none;
	border-radius: 5px;
	position: relative;
}
.info-btn:hover {
	background-color: rgb(255, 64, 129, 0.8);
}
.info-btn[tip-text]:hover::after {
	content: attr(tip-text);
	word-break:keep-all;
	white-space:nowrap;  
	background-color: rgba(0, 0, 0, 0.8);
	color: #fff;
	border-radius: 6px;
	padding: 5px 10px;
	position: absolute;
	z-index: 1;
	bottom: 30px;
	right: 0px;
	font-size: 10px;
}
.info-btn-disabled {
	pointer-events: none;
	background-color: lightgray;
}
.connections-panel{
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	height: 160px;
	color: black;
}
.connections-panel .conn-row:nth-child(odd){
	background-color: rgba(0, 0, 0, 0.04);
}
.connections-panel .conn-row:nth-child(even){
	background-color: rgba(0, 0, 0, 0.08);
}
.conn-row {
	font-size: 16px;
	height: 40px;
	line-height: 40px;
	text-align: center;
	user-select: text;
}
.no-conn-row {
	font-size: 16px;
	height: 160px;
	line-height: 160px;
	text-align: center;
}
`

const videoSyncHtml = `
<div id="sync-app">
	<div :class="{'app-off': off}" class="sync-app-wrapper" :style="'bottom:'+offsetY+'px'">
		<div @click="off=!off" class="app-switch">
			<svg xml:space="preserve" style="enable-background:new 0 0 500 500;" viewBox="0 0 500 500" y="0px" x="0px" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" id="图层_1" version="1.1">
				<g>
					<g>
						<path d="M331.05,359.71c0,0,27.62,2.15,41.62,33.36c13.99,31.21,17.94,45.2,17.94,45.2s12.56,0.36,13.63,5.02
							s8.25,12.92-23.32,11.84s-47.36,3.23-49.87,5.38c-2.51,2.15-34.44,5.38-41.97,5.74c-7.53,0.36-42.33-8.97-50.94-8.97
							s-65.65-3.59-72.47-7.89c-6.82-4.31-5.74-12.92,1.79-21.17c0,0,14.71-12.2,13.99-24.75c-0.72-12.56,6.82-43.05,8.97-44.49
							c2.15-1.44-46.64-11.84-8.97-47.36c15.79-15.79,38.03,10.4,38.39,19.37c11.12-0.72,38.03-4.66,38.03-4.66s6.1,17.94,17.58,28.7
							c11.48,10.76,10.05,17.22,10.05,17.22S314.91,357.91,331.05,359.71z" class="st0"></path>
					</g>
					<g>
						<g>
							<path d="M328.8,362.83c0,0-16.54-20.52-21.95-20.21c-5.41,0.31-16.95,15.72-16.95,15.72l-3.06,15.72L328.8,362.83z" class="st0"></path>
						</g>
						<g>
							<path d="M190.75,363.51c-0.23,0-0.47-0.03-0.71-0.08c-13.25-2.83-22.86-14.74-22.86-28.31
								c0-15.96,12.99-28.95,28.95-28.95c14.47,0,26.8,10.8,28.69,25.11c0.24,1.85-1.06,3.55-2.91,3.79c-1.85,0.24-3.55-1.06-3.79-2.91
								c-1.45-10.97-10.9-19.24-21.99-19.24c-12.24,0-22.19,9.95-22.19,22.19c0,10.4,7.37,19.52,17.52,21.7
								c1.83,0.39,2.99,2.19,2.6,4.01C193.71,362.42,192.31,363.51,190.75,363.51z" class="st1"></path>
						</g>
						<g>
							<path d="M285.1,472.11c-6.66,0-16.33-3.33-27.03-7.34c-2.11-0.79-3.93-1.47-5.09-1.85
								c-2.69-0.87-9.57-1.07-16.86-1.29c-9.89-0.3-21.1-0.63-29.06-2.66c-7.23-1.84-16.07-2.24-23.87-2.6
								c-6.97-0.32-12.47-0.57-15.97-1.73c-5.84-1.95-9.12-9.48-8.92-15.65c0.14-4.28,2.05-7.31,5.12-8.12
								c3.97-1.04,9.69-13.75,11.56-17.92c1.45-3.22,1.7-7.63,2.02-13.23c0.54-9.49,1.27-22.48,9.05-37.74
								c18.9-41.09,64.04-40.75,72.89-40.26l0.18,0.01c1.87,0,3.33,1.51,3.33,3.38c0,1.87-1.56,3.38-3.43,3.38c-0.06,0-0.21,0-0.46-0.02
								c-8.09-0.44-49.35-0.78-66.41,36.4c-0.02,0.04-0.04,0.09-0.06,0.13c-7.16,14.03-7.82,25.72-8.36,35.12
								c-0.34,6.04-0.64,11.26-2.6,15.62c-5.42,12.05-9.96,19.89-15.74,21.61c-0.33,0.62-0.67,2.76,0.16,5.62
								c0.78,2.69,2.27,4.76,3.79,5.27c2.61,0.87,8.21,1.12,14.14,1.39c8.12,0.37,17.33,0.79,25.23,2.8c7.24,1.84,18.06,2.17,27.6,2.46
								c8.45,0.25,15.12,0.46,18.72,1.61c1.31,0.42,3.11,1.1,5.39,1.95c20.58,7.71,25.69,7.44,26.88,6.54c0.53-1.2,0.44-2.51-0.29-4
								c-1.75-3.55-7.44-8.03-16.22-10.02c-1.82-0.41-2.96-2.22-2.55-4.04c0.41-1.82,2.22-2.97,4.04-2.55
								c9.78,2.21,17.75,7.44,20.79,13.63c1.65,3.37,1.77,6.79,0.33,9.89C292.04,470.9,289.12,472.11,285.1,472.11z" class="st1"></path>
						</g>
						<g>
							<g>
								<path d="M165.72,174.42c0,0,1.28,43.8,11.19,59.78c9.91,15.98,30.37,25.89,33.25,26.53
									c2.88,0.64-9.59,38.36-0.64,62.66c3.52,5.43-6.39,47.63,40.92,41.24c24.94-2.88,42.2-24.94,48.27-26.21
									c6.07-1.28,68.41-11.51,58.5-35.17s-10.23-32.29-11.19-35.8s-12.15-13.11-17.58-5.75l-25.25-14.39c0,0,3.2-16.62-3.2-16.3
									s16.3-21.74,10.87-34.53c-5.43-12.79-15.66-23.98-15.66-23.98s-13.43-25.25-40.6-37.72c0,0-39.96-71.61-60.74-73.53
									c-7.03,4.8-9.59,28.13-9.59,28.13S170.19,68.6,163.48,71.8S149.73,154.92,165.72,174.42z" class="st2"></path>
							</g>
							<g>
								<path d="M195.45,105.95c0,0-1.26-26.87,4.33-27.23c5.59-0.36,22.9,40.75,24.88,45.8s-7.57,9.2-7.57,9.2
									L195.45,105.95z" class="st3"></path>
							</g>
							<g>
								<path d="M168.96,92.98c0,0-6.32-5.75-5.75,3.83c0.57,9.58,7.09,61.29,13.21,66.84c2.3-7.66,6.7-13.02,7.47-13.6
									C184.66,149.47,168.96,92.98,168.96,92.98z" class="st3"></path>
							</g>
							<g>
								<path d="M250.28,135.93c0,0,41.55,31.03,43.98,40.2c2.43,0.54,20.51,24.55,8.36,41.82
									c9.71-22.93,11.33-30.76-8.09-46.95C286.98,156.43,268.63,131.88,250.28,135.93z" class="st4"></path>
							</g>
							<g>
								<path d="M236.76,255.4c0,0,6.1-24.95,18.3-11.09c-4.44-8.87-8.32-15.8-14.42-7.21
									C234.54,245.69,236.76,255.4,236.76,255.4z" class="st4"></path>
							</g>
							<g>
								<path d="M265.03,244.86c0,0-4.16-18.3,6.93-18.85s16.91,7.76,16.91,7.76S266.7,221.3,265.03,244.86z" class="st4"></path>
							</g>
							<g>
								<path d="M230.66,306.13c0,0,14.94-7.26,17.99,8.27s0.03-23.24-10.22-18.52
									C228.16,300.58,230.66,306.13,230.66,306.13z" class="st4"></path>
							</g>
							<g class="st5">
								<path d="M210.14,264.54c0,0,4.31,42.19,8.04,55.45c8.75,31.1,19.59,35.13,48.76,31.74
									c22.24-2.59-50.66,42.21-56.52-23.98C205.91,276.86,210.14,264.54,210.14,264.54z" class="st2"></path>
							</g>
							<g>
								<g>
									<path d="M241.21,367.46c-7.51,0-13.94-2.06-19.17-6.16c-5.73-4.49-12.85-13.79-14.2-32.58
										c0-0.07-0.01-0.13-0.01-0.19c-9.42-22.85-3.83-48.63-1.13-61.07c0.31-1.45,0.65-3.01,0.87-4.19
										c-29.08-9.37-41.47-40.16-40.81-67.13c0.39-15.82-2.37-19.43-3.41-20.78c-0.65-0.85-1.89-2.47-1.17-4.77
										c-9.78-35.72-14.51-84.34-6.24-96.9c1.85-2.8,4.07-3.64,5.61-3.85c4.52-0.62,12.25,2.71,35.16,31.99
										c12.33,15.75,23.38,31.91,23.49,32.07c1.05,1.54,0.66,3.64-0.88,4.7c-1.54,1.05-3.64,0.66-4.7-0.88
										c-0.11-0.16-10.86-15.87-22.92-31.32c-22.8-29.2-28.67-29.82-29.27-29.85c-0.14,0.02-0.48,0.3-0.85,0.86
										c-6.4,9.72-2.65,56.43,7.43,92.55c0.16,0.57,0.16,1.16,0.03,1.72c1.79,2.4,4.9,7.52,4.48,24.63c-0.62,25,10.9,53.56,38.02,61.1
										c0.83,0.16,1.59,0.61,2.14,1.29c1.45,1.79,1.02,3.74-0.38,10.2c-2.57,11.85-7.92,36.5,0.96,57.5c0.12,0.29,0.2,0.59,0.24,0.9
										c0.02,0.17,0.05,0.49,0.08,0.94c1.18,16.32,6.97,24.09,11.63,27.74c5.45,4.28,12.84,5.65,21.94,4.1
										c21.12-3.61,30-10.85,37.14-16.66c5.05-4.12,9.42-7.68,16.3-8.41c10.58-1.13,43.84-9.05,51.74-23.32
										c2.04-3.69,2.06-7.48,0.05-11.6c-0.82-1.68-0.12-3.7,1.56-4.52c1.68-0.82,3.7-0.12,4.52,1.56c2.96,6.07,2.89,12.24-0.21,17.84
										c-10.01,18.09-48.06,25.82-56.94,26.77c-4.88,0.52-8.17,3.21-12.74,6.93c-7.34,5.98-17.39,14.18-40.27,18.09
										C246.47,367.22,243.78,367.46,241.21,367.46z M210.82,264.11C210.82,264.11,210.82,264.11,210.82,264.11
										C210.82,264.11,210.82,264.11,210.82,264.11z M210.81,264.11C210.81,264.11,210.81,264.11,210.81,264.11
										C210.81,264.11,210.81,264.11,210.81,264.11z M210.8,264.11C210.8,264.11,210.8,264.11,210.8,264.11
										C210.8,264.11,210.8,264.11,210.8,264.11z M210.79,264.11C210.79,264.11,210.79,264.11,210.79,264.11
										C210.79,264.11,210.79,264.11,210.79,264.11z M210.77,264.11C210.78,264.11,210.78,264.11,210.77,264.11
										C210.78,264.11,210.78,264.11,210.77,264.11z M210.75,264.11c0.01,0,0.01,0,0.02,0C210.76,264.11,210.76,264.11,210.75,264.11z
											M210.74,264.1c0,0,0.01,0,0.01,0C210.74,264.11,210.74,264.11,210.74,264.1z M210.73,264.1
										C210.73,264.1,210.73,264.1,210.73,264.1C210.73,264.1,210.73,264.1,210.73,264.1z M210.72,264.1
										C210.72,264.1,210.72,264.1,210.72,264.1C210.72,264.1,210.72,264.1,210.72,264.1z M210.71,264.1
										C210.71,264.1,210.71,264.1,210.71,264.1C210.71,264.1,210.71,264.1,210.71,264.1z M210.7,264.1
										C210.7,264.1,210.7,264.1,210.7,264.1C210.7,264.1,210.7,264.1,210.7,264.1z" class="st1"></path>
								</g>
								<g>
									<path d="M180.47,169.56c-1,0-1.99-0.44-2.66-1.29l-3.44-4.38c-0.63-0.8-2.55-3.24-1.06-5.74
										c0.64-1.06,1.54-1.58,2.5-1.79c-0.61-1.35-1.25-3.01-1.75-5.01c-0.77-3.06,1.02-4.59,1.59-4.99c0.74-0.51,1.95-1.36,5.16-0.37
										c-0.82-2.12-1.71-4.63-2.63-7.61c-0.02-0.06-0.04-0.12-0.05-0.18c-5.53-22.13-13.3-44.57-13.38-44.79
										c-0.61-1.76,0.32-3.69,2.08-4.3c1.76-0.61,3.69,0.32,4.3,2.08c0.08,0.23,7.92,22.88,13.52,45.28
										c3.66,11.8,6.47,15.25,6.5,15.29c1.15,1.27,1.15,3.16,0.03,4.46c-1.12,1.29-3.05,1.52-4.47,0.56c-1.5-1.01-3.11-1.98-4.54-2.76
										c0.31,0.64,0.61,1.22,0.9,1.75c0.6,1.13,1.12,2.11,1.34,3.18c0.24,1.2-0.12,2.43-0.96,3.29c-0.36,0.37-0.75,0.63-1.15,0.81
										l0.83,1.05c1.15,1.47,0.9,3.59-0.57,4.75C181.94,169.32,181.2,169.56,180.47,169.56z" class="st1"></path>
								</g>
								<g>
									<path d="M257.8,137.32c-1.13,0-2.24-0.57-2.88-1.61c-10.74-17.41-24.23-35.62-37.03-49.94
										c-15.72-17.6-23.03-21.09-24.63-20.99c-3.62,1.63-5.04,14.37-4.1,25.35c0.16,1.86-1.22,3.5-3.08,3.66
										c-1.86,0.16-3.5-1.22-3.66-3.08c-0.02-0.27-0.57-6.69-0.04-13.65c0.79-10.52,3.54-16.59,8.4-18.57
										c8.46-3.44,24.94,14.78,31.14,21.64c13.16,14.56,27.65,34.01,38.76,52.03c0.98,1.59,0.49,3.67-1.1,4.65
										C259.01,137.15,258.4,137.32,257.8,137.32z" class="st1"></path>
								</g>
								<g>
									<path d="M289.41,238.12c-1.37,0-2.66-0.84-3.17-2.19c-0.66-1.75,0.23-3.7,1.98-4.35
										c3.16-1.18,20.91-19.96,20.04-33.56c-0.67-10.58-5.81-14.32-9.56-17.06c-0.9-0.66-1.76-1.28-2.49-1.95
										c-1.53-1.39-2.46-3.4-3.64-5.95c-2.43-5.26-6.1-13.2-17.78-22.38c-16.02-12.59-24.2-13.05-24.28-13.05
										c-1.87,0-3.35-1.51-3.35-3.38s1.55-3.38,3.41-3.38c1.02,0,10.45,0.41,28.38,14.5c12.96,10.18,17.21,19.37,19.74,24.86
										c0.75,1.63,1.53,3.31,2.05,3.78c0.46,0.42,1.14,0.92,1.92,1.49c4.28,3.12,11.45,8.35,12.32,22.09
										c1.05,16.4-18.15,37.97-24.41,40.32C290.21,238.05,289.81,238.12,289.41,238.12z" class="st1"></path>
								</g>
								<g>
									<path d="M247.46,222.78c-0.39,0-0.8-0.07-1.19-0.22c-1.75-0.66-2.63-2.6-1.98-4.35l2.82-7.51
										c0.34-0.9,1.04-1.61,1.93-1.96c0.89-0.35,1.89-0.31,2.75,0.12l6.26,3.13c1.67,0.83,2.35,2.86,1.51,4.53
										c-0.84,1.67-2.87,2.35-4.54,1.51l-2.9-1.45l-1.5,4C250.12,221.94,248.83,222.78,247.46,222.78z" class="st1"></path>
								</g>
								<g>
									<path d="M266.87,255.03c-1.51,0-2.89-1.03-3.28-2.56c-2.88-11.53-2.7-19.99,0.55-25.16
										c1.74-2.77,4.4-4.59,7.68-5.27c5.66-1.17,11.65,1.64,17.81,8.34c4.2,4.57,6.98,9.36,7.09,9.56c0.93,1.62,0.38,3.68-1.24,4.62
										c-1.62,0.93-3.68,0.38-4.61-1.24l0,0c-2.45-4.24-10.97-16.04-17.68-14.66c-1.5,0.31-2.55,1.02-3.32,2.25
										c-2.14,3.4-2.03,10.66,0.28,19.92c0.45,1.81-0.65,3.65-2.46,4.1C267.42,255,267.14,255.03,266.87,255.03z" class="st1"></path>
								</g>
								<g>
									<path d="M234.94,261.91c-1.73,0-3.2-1.32-3.36-3.07c-0.93-10.23,1.28-18.89,6.05-23.77
										c2.83-2.9,6.42-4.28,10.38-4.01c11.25,0.78,16.01,19.84,16.52,22.01c0.42,1.82-0.71,3.63-2.52,4.06
										c-1.82,0.43-3.63-0.71-4.06-2.52c-2.9-12.36-8.26-16.66-10.4-16.81c-1.97-0.14-3.64,0.52-5.08,1.99
										c-3.29,3.36-4.88,10.43-4.15,18.43c0.17,1.86-1.2,3.5-3.06,3.67C235.14,261.91,235.04,261.91,234.94,261.91z" class="st1"></path>
								</g>
								<g>
									<path d="M329.22,265.64c-0.69,0-1.39-0.21-1.99-0.65c-6.59-4.82-18.61-12.79-22.78-13.67
										c-0.32-0.07-0.63-0.18-0.91-0.34c-0.48-0.26-2.9-1.7-3.22-4.5c-0.14-1.26,0.1-3.12,2.04-4.95c0.18-0.57,0.13-1.66-0.05-2.75
										c-0.72,0.48-1.44,0.73-2.06,0.87c-3.68,0.83-7.01-1.78-7.64-2.32c-1.43-1.2-1.61-3.34-0.4-4.76c1.2-1.42,3.32-1.61,4.75-0.42
										c0.5,0.41,1.28,0.81,1.7,0.89c0.04-0.06,0.1-0.16,0.16-0.3c1.31-2.9,3.5-3.14,4.38-3.1c1.51,0.06,3.6,0.95,4.98,4.82
										c0.91,2.56,1.88,7.76-0.21,10.88c7.73,2.91,21.57,12.94,23.26,14.18c1.51,1.1,1.84,3.22,0.73,4.72
										C331.29,265.16,330.26,265.64,329.22,265.64z M302.57,241.34C302.57,241.34,302.57,241.34,302.57,241.34
										C302.57,241.34,302.57,241.34,302.57,241.34z M298.56,233.16L298.56,233.16L298.56,233.16z" class="st1"></path>
								</g>
								<g>
									<path d="M241.79,356.51c-4.05,0-7.67-1.73-10.5-5.03c-7.33-8.53-7.84-25.56-6.49-32.78
										c1.6-8.55,4.92-26.22,15.41-26.22c0.02,0,0.05,0,0.07,0c1.08-0.12,3.38-0.07,5.9,1.76c4.63,3.36,7.53,10.96,8.61,22.61
										c0.15,1.58,0.29,3.11,0.43,4.58c1.45,15.19,2.42,25.22-2.52,30.85c-2.35,2.68-5.76,4.06-10.42,4.22
										C242.11,356.5,241.95,356.51,241.79,356.51z M240.24,299.24c-1.87,0-5.44,2.77-8.8,20.71c-2.03,10.85,1.52,23.11,4.97,27.13
										c1.63,1.9,3.41,2.74,5.63,2.67c3.59-0.12,4.9-1.16,5.57-1.92c3.01-3.43,2.07-13.28,0.88-25.74c-0.14-1.48-0.29-3.02-0.44-4.6
										c-1.36-14.68-5.45-18.14-6.95-18.27c-0.33,0.12-0.34,0.05-0.78,0.04C240.29,299.24,240.26,299.24,240.24,299.24z
											M241.21,299.16L241.21,299.16z" class="st1"></path>
								</g>
								<g>
									<path d="M337.93,317.97c-1.85,0-4.27-0.64-6.83-3.05c-6.84-6.45-10.66-21.64-9.29-36.95
										c0.93-10.42,3.61-17.05,8.17-20.25c1.84-1.29,4.87-2.6,9-1.66c3.53,0.15,9.52,4.23,14.94,26.35c2.97,12.1,2.35,21.4-1.83,27.63
										c-3.64,5.43-9.08,7.26-12.99,7.84C338.75,317.94,338.36,317.97,337.93,317.97z M336.24,262.5c-0.88,0-1.65,0.25-2.37,0.75
										c-1.57,1.1-4.36,4.56-5.32,15.32c-1.32,14.76,2.72,27.21,7.19,31.43c0.9,0.85,1.76,1.28,2.37,1.19
										c3.74-0.56,6.56-2.21,8.38-4.93c3.04-4.52,3.34-12.22,0.88-22.25c-4.34-17.7-8.42-20.8-9.08-21.21
										c-0.18-0.02-0.36-0.05-0.53-0.1C337.21,262.58,336.71,262.5,336.24,262.5z M339.02,262.8
										C339.02,262.8,339.02,262.8,339.02,262.8C339.02,262.8,339.02,262.8,339.02,262.8z M339.02,262.8
										C339.02,262.8,339.02,262.8,339.02,262.8C339.02,262.8,339.02,262.8,339.02,262.8z M339.03,262.8
										C339.03,262.8,339.03,262.8,339.03,262.8C339.03,262.8,339.03,262.8,339.03,262.8z M339.04,262.8
										C339.04,262.8,339.03,262.8,339.04,262.8C339.03,262.8,339.04,262.8,339.04,262.8z" class="st1"></path>
								</g>
								<g>
									<path d="M222.69,140.91c-1.22,0-2.39-0.66-2.99-1.81c-0.26-0.5-2.53-5.01-1.87-9.37c0.21-1.41,1.09-2.57,2.36-3.12
										c0.83-0.36,1.68-0.42,2.6-0.25c-1.37-3.17-2.83-6.91-4.44-11.03c-4.1-10.47-8.74-22.33-13.66-29.13
										c-1.86-2.58-3.05-3.51-3.6-3.84c-0.42,0.72-0.86,2.26-0.99,3.55c-0.19,1.85-1.85,3.22-3.69,3.03
										c-1.85-0.18-3.21-1.82-3.04-3.68c0.13-1.37,1.03-8.29,5.92-9.62c4.57-1.24,8.4,3.17,10.88,6.6
										c5.43,7.5,10.24,19.79,14.48,30.63c3.12,7.98,6.07,15.51,8.17,18.14c1.21,1.52,3.24,4.05,1.06,6.38
										c-2.18,2.33-4.5,0.71-7.43-1.34c-0.29-0.2-0.64-0.45-1.03-0.71c0.11,0.27,0.22,0.49,0.29,0.65c0.85,1.66,0.2,3.69-1.45,4.55
										C223.75,140.78,223.22,140.91,222.69,140.91z" class="st1"></path>
								</g>
								<g>
									<ellipse ry="8.79" rx="6.62" cy="203.49" cx="207.29" class="st1"></ellipse>
								</g>
								<g>
									
										<ellipse ry="8.13" rx="4.73" cy="186" cx="270.45" class="st1" transform="matrix(0.8857 -0.4642 0.4642 0.8857 -55.4357 146.7912)"></ellipse>
								</g>
							</g>
							<g>
								
									<ellipse ry="5.62" rx="15.75" cy="227.06" cx="207.21" class="st3" transform="matrix(0.9544 -0.2984 0.2984 0.9544 -58.3215 72.1863)"></ellipse>
							</g>
							<g>
								
									<ellipse ry="5.62" rx="15.75" cy="196.5" cx="287.67" class="st3" transform="matrix(0.9544 -0.2984 0.2984 0.9544 -45.5324 94.8065)"></ellipse>
							</g>
						</g>
						<g>
							<path d="M306.66,361.19c0,0-4.26,0.75-4.51-11.28c-0.25-12.03-8.52-72.19-26.82-72.44s-17.55,53.14-15.04,59.16
								s23.31,25.07,24.31,36.6" class="st0"></path>
						</g>
						<g>
							<path d="M290.42,362.1c0.15-0.45-0.15-82.59-20.01-74.53s4.33,65.12,9.41,70.2s5.23,8.51,5.97,8.21
								C286.54,365.68,290.42,362.1,290.42,362.1z" class="st3"></path>
						</g>
						<g>
							<path d="M314.93,357.44c0,0,19.8-55.4,13.03-81.97c-3.26-9.27,11.53-6.27,16.29,7.77
								c4.76,14.04,6.77,31.58,5.01,40.86s-16.29,34.59-15.79,35.84" class="st0"></path>
						</g>
						<g>
							<path d="M290.37,365.83c-1.85,0-3.36-1.49-3.38-3.35c0-0.18-0.21-18.68-2.52-36.91
								c-4.12-32.66-10.88-34.42-12.2-34.44c0.02,0-0.05,0-0.24,0.2c-2.17,2.22-2.98,10.79-2.85,15.89c0.05,1.87-1.43,3.42-3.29,3.47
								c-0.03,0-0.06,0-0.09,0c-1.83,0-3.33-1.46-3.38-3.29c-0.07-2.58-0.15-15.74,4.77-20.78c1.43-1.47,3.2-2.24,5.13-2.24
								c9.43,0.14,15.41,12.97,18.86,40.4c2.35,18.62,2.56,37.45,2.56,37.64c0.02,1.87-1.48,3.39-3.35,3.41
								C290.39,365.83,290.38,365.83,290.37,365.83z" class="st1"></path>
						</g>
						<g>
							<path d="M316.19,354.3c-1.12,0-2.22-0.56-2.86-1.58l0,0c-1.67-2.64-7.11-9.67-12.22-10.5
								c-1.84-0.3-3.1-2.03-2.8-3.88c0.3-1.84,2.02-3.1,3.88-2.8c9.02,1.46,16.09,12.33,16.86,13.57c0.99,1.58,0.52,3.67-1.07,4.66
								C317.43,354.13,316.8,354.3,316.19,354.3z" class="st1"></path>
						</g>
						<g>
							<path d="M302.45,468.68c-4.87,0-9.15-0.45-12.21-1.53c-1.76-0.62-2.68-2.56-2.05-4.32c0.63-1.76,2.56-2.67,4.32-2.05
								c4.38,1.56,13.7,1.52,25.58-0.1c11-1.5,20.48-3.86,23.82-5.33c3.54-1.55,8.36-1.37,13.93-1.16c9.29,0.35,19.81,0.75,27.21-6.23
								c8.22-7.75,0-22.35-4.41-30.19c-1.87-3.31-2.7-4.84-2.89-6.26c-0.4-3.01-8.84-26.97-19.24-38.82c-9.5-10.82-29.79-9.16-30-9.14
								c-1.86,0.16-3.5-1.21-3.67-3.06c-0.17-1.86,1.2-3.5,3.06-3.67c0.97-0.09,23.91-2.01,35.68,11.41
								c11.09,12.64,20.08,37.37,20.84,42.25c0.21,0.62,1.25,2.47,2.1,3.97c4.94,8.78,15.23,27.05,3.16,38.43
								c-9.46,8.92-22.55,8.42-32.1,8.06c-4.55-0.17-8.85-0.33-10.97,0.6C338.1,464.4,317.52,468.68,302.45,468.68z M382.45,410.58
								c0,0.02,0,0.03,0.01,0.05C382.45,410.61,382.45,410.6,382.45,410.58z" class="st1"></path>
						</g>
						<g>
							<path d="M391.8,459.08c-4.07,0-8.28-0.46-11.98-1.05c-1.84-0.29-3.1-2.03-2.81-3.87c0.29-1.84,2.03-3.1,3.87-2.81
								c10.08,1.6,18.11,1.18,20.96-1.1c0.62-0.5,0.91-1.03,0.96-1.79c0.11-1.74-1.91-4.29-12.15-6.62c-1.41-0.32-2-0.45-2.64-0.88
								c-1.55-1.04-1.97-3.13-0.94-4.69c0.91-1.37,2.65-1.86,4.11-1.25c0.22,0.06,0.55,0.13,0.97,0.22c4.92,1.12,18,4.09,17.4,13.63
								c-0.17,2.66-1.37,4.96-3.48,6.64C402.74,458.2,397.41,459.08,391.8,459.08z M391.75,435.33
								C391.75,435.33,391.75,435.33,391.75,435.33C391.75,435.33,391.75,435.33,391.75,435.33z M391.75,435.33L391.75,435.33
								L391.75,435.33z" class="st1"></path>
						</g>
						<g>
							<ellipse ry="9.44" rx="6.49" cy="419.43" cx="310.27" class="st1"></ellipse>
						</g>
						<g>
							<ellipse ry="5.08" rx="3.61" cy="413.36" cx="363.05" class="st1"></ellipse>
							<path d="M363.05,421.82c-3.92,0-6.99-3.72-6.99-8.46s3.07-8.46,6.99-8.46c3.92,0,6.99,3.72,6.99,8.46
								S366.97,421.82,363.05,421.82z M363.05,412.11c-0.12,0.3-0.23,0.72-0.23,1.25s0.1,0.95,0.23,1.25c0.12-0.3,0.23-0.72,0.23-1.25
								S363.17,412.41,363.05,412.11z" class="st1"></path>
						</g>
						<g>
							<path d="M340.6,426.31c0,0,9.67-4.75,13.11-1.64s0.33,9.51-1.97,10.33C349.45,435.82,336.66,436.31,340.6,426.31z" class="st3"></path>
							<path d="M348.41,438.77c-3.23,0-7.22-0.76-9.68-3.31c-1.42-1.47-3.48-4.77-1.27-10.39c0.31-0.78,0.9-1.42,1.65-1.8
								c10.88-5.35,15.67-2.21,16.87-1.11c2.2,1.99,3.09,5.03,2.43,8.34c-0.61,3.05-2.7,6.67-5.53,7.68
								C351.97,438.5,350.32,438.77,348.41,438.77z M343.35,428.77c-0.18,0.77-0.2,1.53,0.2,1.96c1.24,1.35,5.4,1.47,6.91,1.12
								c0.44-0.41,1.31-1.81,1.39-3.27c0.06-0.98-0.29-1.29-0.41-1.4C350.64,426.6,346.96,427.24,343.35,428.77z" class="st1"></path>
						</g>
						<g>
							<path d="M350.27,445.92c-0.19,0-0.38-0.02-0.58-0.05c-1.84-0.32-3.07-2.07-2.76-3.91c0.34-1.99,0.42-4.42,0.18-5.1
								c-0.63-1.74,0.25-3.7,1.99-4.35c1.74-0.65,3.66,0.19,4.32,1.92c1.07,2.78,0.41,7.34,0.18,8.67
								C353.31,444.76,351.88,445.92,350.27,445.92z" class="st1"></path>
						</g>
						<g>
							<ellipse ry="7.21" rx="14.01" cy="437.62" cx="304.29" class="st3"></ellipse>
						</g>
						<g>
							<ellipse ry="6.23" rx="9.26" cy="429.75" cx="376.74" class="st3"></ellipse>
						</g>
						<g>
							<path d="M284.6,376.61c-1.73,0-3.21-1.33-3.36-3.09c-0.56-6.41-9.34-16.82-15.75-24.42
								c-4.62-5.48-7.28-8.69-8.31-11.17c-2.31-5.55-3.5-42.06,6.64-57.03c3.86-5.7,8.42-6.8,11.57-6.8
								c9.54,0.13,17.41,11.68,23.4,34.32c4.52,17.08,6.63,35.41,6.75,41.43c0.12,5.63,1.14,7.5,1.51,7.99
								c1.45,0.16,2.68,1.26,2.95,2.77c0.32,1.84-0.9,3.59-2.74,3.92c-0.54,0.09-2.43,0.28-4.36-1.31c-2.63-2.16-3.97-6.49-4.11-13.23
								c-0.37-17.69-10.1-68.95-23.49-69.13c-0.8-0.02-3.23-0.04-5.84,3.78c-8.71,12.77-7.54,46.99-6.03,50.7
								c0.68,1.63,4.02,5.59,7.24,9.41c7.39,8.75,16.58,19.65,17.32,28.19c0.16,1.86-1.21,3.5-3.07,3.66
								C284.8,376.6,284.7,376.61,284.6,376.61z M306.08,357.87C306.08,357.87,306.08,357.87,306.08,357.87
								C306.08,357.87,306.08,357.87,306.08,357.87z" class="st1"></path>
						</g>
						<g>
							<path d="M333.48,363.32c-1.34,0-2.61-0.8-3.14-2.12c-0.76-1.9-0.25-2.91,4.62-12.6c3.98-7.92,9.99-19.88,10.99-25.13
								c1.68-8.9-0.46-26.09-4.89-39.14c-2.62-7.71-8.12-10.56-10.13-10.8c0.04,0.21,0.11,0.48,0.23,0.82c0.03,0.09,0.06,0.19,0.09,0.29
								c6.94,27.26-12.3,81.64-13.13,83.94c-0.63,1.76-2.56,2.67-4.32,2.04c-1.76-0.63-2.67-2.56-2.04-4.32
								c0.19-0.54,19.31-54.55,12.97-79.86c-1.38-4.08-0.05-6.48,0.87-7.55c1.54-1.79,4.07-2.49,6.92-1.93
								c5.05,0.99,11.88,6.16,14.94,15.2c4.83,14.23,7.03,32.53,5.13,42.57c-1.17,6.18-6.95,17.67-11.59,26.91
								c-1.74,3.47-3.71,7.38-4.16,8.61c-0.11,1.22-0.89,2.34-2.11,2.83C334.33,363.24,333.9,363.32,333.48,363.32z M336.62,358.7
								L336.62,358.7L336.62,358.7z M336.62,358.69L336.62,358.69L336.62,358.69z" class="st1"></path>
						</g>
					</g>
				</g>
				</svg>
		</div>
		<div class="main-panel">
			<div class="panel-header">
				<span @click="setTabIdx(0)" :class="{'header-active': tabIdx == 0}">个人信息</span>
				<span @click="setTabIdx(1)" :class="{'header-active': tabIdx == 1}">连接列表</span>
			</div>
			<div v-show="tabIdx == 0" class="information-panel">
				<div class="info-row">
					<div class="info-title">Peer ID：</div>
					<div class="info-value">{{peerIdStatusText}}</div>
					<button v-show="[100,101,200].indexOf(peerIdStatus) > -1" id="peerInitBtn" class="info-btn" :class="{'info-btn-disabled': peerIdStatus == 200}" tip-text="获取Peer ID用于连接">获取</button>
					<button v-show="[300].indexOf(peerIdStatus) > -1" id="copyBtn" class="info-btn" tip-text="复制Peer ID">复制</button>
				</div>
				<div class="info-row">
					<div class="info-title">连接状态：</div>
					<div class="info-value">{{conStatusText}}</div>
					<button v-show="[100,101,102,103,104].indexOf(connectStatus) > -1" id="peerConnectBtn" class="info-btn" tip-text="输入对方Peer ID连接">连接</button>
					<button v-show="[200,300,301].indexOf(connectStatus) > -1" id="peerCloseBtn" class="info-btn" tip-text="断开Peer ID连接">断开</button>
				</div>
				<div class="info-row">
					<div class="info-title">视频捕获：</div>
					<div class="info-value">{{videoStatusText}}</div>
					<button class="info-btn" id="videoInitBtn" tip-text="捕获正在播放的视频进行同步">捕获</button>
				</div>
			</div>
			<div v-show="tabIdx == 1" class="connections-panel">
				<div v-if="conns.length < 1" class="no-conn-row">暂无连接</div>
				<div v-for="conn in conns" class="conn-row">{{conn.peer}}</div>
			</div>
		</div>
	</div>
</div>
`


let videoSyncStyle = document.createElement('style');
videoSyncStyle.innerText = videoSyncCss;

let videoSyncDoc = new DOMParser().parseFromString(videoSyncHtml, 'text/html');
let videoSyncApp = videoSyncDoc.querySelector('#sync-app');
document.body.appendChild(videoSyncStyle);
document.body.appendChild(videoSyncApp);

let iframes = document.querySelectorAll('iframe');
iframes.forEach((item) => {
	item.sandbox.add('allow-scripts');
	item.sandbox.add('allow-same-origin');
	item.src = item.src;
})


/**
 * 	vue.js部分主要代码
 */
 var syncApp = new Vue({
	el: '#sync-app',
	data: {
		off: true,
		offsetY: 20,
		tabIdx: 0,

		peerIdStatus: 100,
		connectStatus: 100,
		videoStatus: 100,
		activeVideoNum: 0,

		conns: [],
	},
	computed: {
		peerIdStatusText() {
			switch(this.peerIdStatus) {
				case 100:
					return '未获取';
				case 101:
					return '获取失败';
				case 200:
					return '获取Peer ID中...';
				case 300:
					return peer.id;
				default:
					return 'Error Status!';
			}
		},
		conStatusText() {
			switch(this.connectStatus) {
				case 100:
					return '未连接';
				case 101:
					return '连接失败';
				case 102:
					return '连接已关闭';
				case 103:
					return '对方已关闭连接';
				case 104:
					return '未获取Peer ID';
				case 200:
					return '连接中...';
				case 300:
					return '已连接（主机）';
				case 301:
					return '已连接（客户机）';
				default:
					return 'Error Status!';
			}
		},
		videoStatusText() {
			switch(this.videoStatus) {
				case 100:
					return '未捕获';
				case 101:
					return '未找到正在播放的视频';
				case 300:
					return `已捕获（序号: ${this.activeVideoNum}）`;
				default:
					return 'Error Status!';
			}
		}
	},
	methods: {
		setTabIdx(idx) {
			this.tabIdx = idx;
		},
		setPeerIdStatus(value) {
			this.peerIdStatus = value;
		},
		setConnectStatus(value) {
			this.connectStatus = value;
		},
		setVideoStatus(value, num = 0) {
			this.videoStatus = value;
			this.activeVideoNum = num;
		},
		setConns(value) {
			this.conns = value;
		},
		addOffsetY(value) {
			this.offsetY += value;
			if(this.offsetY < 0) {
				this.offsetY = 0;
			} else if(this.offsetY > 1000) {
				this.offsetY = 1000;
			}
		}
	},
	mounted() {
		window.setPeerIdStatus = this.setPeerIdStatus;
		window.setConnectStatus = this.setConnectStatus;
		window.setVideoStatus = this.setVideoStatus;
		window.setConns = this.setConns;
	}
})
	
var appSwitch = document.getElementsByClassName('app-switch')[0];
var appSwitchDragStart = false;
var appSwitchDrag = false;
appSwitch.addEventListener('mousedown', function(e) {
	appSwitchDragStart = true;
	e.preventDefault();
})
document.addEventListener('mousemove', function(e) {
	if(appSwitchDragStart) {
		if (e.movementY != 0) {
			appSwitchDrag = true;
		}
		syncApp.addOffsetY(-e.movementY);
	}
})
document.addEventListener('mouseup', function(e) {
	appSwitchDragStart = false;
	appSwitchDrag = false;
	e.preventDefault();
})
appSwitch.addEventListener('mouseup', function(e) {
	if(appSwitchDrag) {
		appSwitch.click()
	}
})

document.querySelectorAll("iframe").forEach(function(value, index, array){
	var sandboxV = value.sandbox.value;
	if(sandboxV.indexOf("allow-modals") == -1){
		value.sandbox.value += (sandboxV.length > 0 ? ' ' : '') + 'allow-modals';
	}
	value.src = value.src;
})


/**
 * 	peer.js部分主要代码
 */

var peer = null;
var conns = [];
var asServer = false;
var lastPeerId = null;

var syncVideo = null;
var sync = true;
var videoNum = 0;
var activeVideoNum = 0;

new ClipboardJS('#copyBtn', {
	text: function(trigger) {
		document.getElementById('copyBtn').getAttributeNode('tip-text').value = "已复制";
		setTimeout(function() {
			document.getElementById('copyBtn').getAttributeNode('tip-text').value = "复制Peer ID";
		}, 1000)
		return peer.id;
	}
});

function peerInit() {
	setPeerIdStatus(200)	// 获取Peer ID中...
	// Create own peer object with connection to shared PeerJS server
	peer = new Peer(null, {
		debug: 2
	});

	peer.on('open', function (id) {
		// Workaround for peer.reconnect deleting previous id
		if (peer.id === null) {
			console.log('Received null id from PeerServer');
			peer.id = lastPeerId;
		} else {
			lastPeerId = peer.id;
		}

		console.log('Peer ID: ' + peer.id);
		setPeerIdStatus(300)	// 显示Peer ID
	});

	peer.on('connection', function(c) { readyAsServer(c); });

	peer.on('disconnected', function () {
		console.log('PeerServer connection lost. Please reconnect');
		// Workaround for peer.reconnect deleting previous id
		peer.id = lastPeerId;
		peer._lastServerId = lastPeerId;
		peer.reconnect();
	});

	peer.on('close', function() {
		console.log('PeerServer connection destroyed');
		conns = [];
		setConns(conns);
	});

	peer.on('error', function (err) {
		console.log('PeerServer error: ', err);
		setPeerIdStatus(101)	// 获取失败
	});
};

function videoInit() {
	let videos = document.querySelectorAll('video, bwp-video');
	let playing = false;
	for(v of videos) {
		if(!v.paused) {
			syncVideo = v;
			playing = true;
			break;
		}
	}
	if(!playing) {
		setVideoStatus(101)	// 未找到正在播放的视频
		setTimeout(() => {
			setVideoStatus(activeVideoNum > 0 ? 300 : 100, activeVideoNum);
		}, 2000);
		return;
	}
	// console.log(syncVideo);
	if(syncVideo.videoNum != undefined) {
		activeVideoNum = syncVideo.videoNum;
		setVideoStatus(300, activeVideoNum)	// 已捕获
		return;
	}
	
	sync = true;
	videoNum++;
	activeVideoNum = videoNum;
	syncVideo.videoNum = videoNum;
	setVideoStatus(300, activeVideoNum);	// 已捕获
	syncVideo.addEventListener('play', function(event){
		// console.log('play', sync, conns.length)
		if(sync && conns.length > 0 && activeVideoNum == event.target.videoNum) {
			sendData(conns, {
				command: 'play',
				currentTime: syncVideo.currentTime
			});
		}
	});

	syncVideo.addEventListener('pause', function(event){
		// console.log('pause', sync, conns.length)
		if(sync && conns.length > 0 && activeVideoNum == event.target.videoNum) {
			sendData(conns, {
				command: 'pause',
				currentTime: syncVideo.currentTime
			});
		}
	});

	syncVideo.addEventListener('seeked', function(event){
		// console.log('seeked', sync, conns.length)
		if(sync && conns.length > 0 && activeVideoNum == event.target.videoNum) {
			sendData(conns, {
				command: 'seeked',
				currentTime: syncVideo.currentTime
			});
		}
	});
}

function peerConnect() {
	if(!peer || peer.id === null) {
		setConnectStatus(104)		// 未获取Peer ID
		return;
	}
	if(!asServer) {
		let id = prompt('请输入对方ID');
		if(id) {
			readyAsClient(id);
		}
	}
}

function peerClose() {
	for(let conn of conns) {
		conn.close();
	}
	conns = [];
	setConns(conns);
	asServer = false;
	setConnectStatus(102)	// 连接已关闭
}

function sendData(_conns, data) {
	if(!Array.isArray(_conns)) {
		_conns = [_conns];
	}
	for(let conn of _conns) {
		data.senderId = peer.id;
		data.receiverId = conn.peer;
		conn.send(data)
		// console.log('Send data: ', data)
	}
}

function handleData(type, data) {
	// console.log('Receive data: ', data);
	if(type == 'server') {
		let _conns = []
		for(let c of conns) {
			if(c.peer != data.senderId) {
				_conns.push(c);
			}
		}
		sendData(_conns, data);
	}

	sync = false;
	if(data.currentTime) {
		syncVideo.currentTime = data.currentTime;
	}
	switch (data.command) {
		case 'play':
			syncVideo.play();
			break;
		case 'pause':
			syncVideo.pause();
			break;
		case 'text':
			alert(data.content);
			break;
	}
}

function readyAsServer(conn) {
	conn.on('open', function() {
		console.log(asServer, conns.length)
		if(!asServer && conns.length > 0) {
			sendData(conn, {
				command: 'text',
				content: 'Target has already connected to another server'
			});
			setTimeout(function() { conn.close(); }, 500);
			return;
		}
		asServer = true;
		conns.push(conn)
		setConns(conns);
		console.log("A client connected: ", conn.peer);
		setConnectStatus(300)		// 已连接（主机）

		conn.on('data', function(data) {
			handleData('server', data)
		})
	
		conn.on('close', function (data) {
			console.log("Client closed", conn.peer);
			conns = conns.filter(c => c.peer != conn.peer)
			setConns(conns);
			if(conns.length < 1){
				asServer = false;
				setConnectStatus(103)		// 对方已关闭连接
			}
		});
	
		conn.on('error', function (err) {
			console.log("Connect error: ", err);
		});
	});
}

function readyAsClient(serverId) {
	setConnectStatus(200)		// 连接中...

	var conn = peer.connect(serverId, {
		reliable: true
	});
	
	conn.on('open', function () {
		console.log("Connected to server: ", conn.peer);
		setConnectStatus(301)		// 已连接（客户机）
	});

	conn.on('data', function(data) {
		handleData('client', data)
	})

	conn.on('close', function () {
		console.log("Server closed");
		conns = [];
		setConns(conns);
		setConnectStatus(103)		// 对方已关闭连接
	});

	conn.on('error', function (err) {
		console.log("Connect error: ", err);
		setConnectStatus(101)		// 连接失败
	});

	conns.push(conn);
	console.log(conn)
	setConns(conns);
}

var onKeyDown = function (e) {
	sync = true;
}
var onMouseDown = function(e) {
	sync = true;
}
document.addEventListener("keydown", onKeyDown);
document.addEventListener("mousedown", onMouseDown);

document.getElementById("peerInitBtn").addEventListener("click", peerInit);
document.getElementById("peerConnectBtn").addEventListener("click", peerConnect);
document.getElementById("peerCloseBtn").addEventListener("click", peerClose);
document.getElementById("videoInitBtn").addEventListener("click", videoInit);