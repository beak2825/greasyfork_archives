// ==UserScript==
// @name Yasashii for WF
// @namespace github.com/openstyles/stylus
// @version 1.5
// @description 官方缺美工，咱就自己上！比WF官方主题好看亿点点~
// @author YYYYang
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.workflowy.com/*
// @include /^(?:workflowy.com)$/
// @downloadURL https://update.greasyfork.org/scripts/519149/Yasashii%20for%20WF.user.js
// @updateURL https://update.greasyfork.org/scripts/519149/Yasashii%20for%20WF.meta.js
// ==/UserScript==

(function() {
let css = "";
if (new RegExp("^(?:workflowy.com)\$").test(location.href)) {
		css += `
			/*------------ BODY ------------- */
			:root {
				--bg-in: hsla(35, 36%, 96%, 1);
				/* 	内板色 */
				--bg-edge: hsla(34, 34%, 90%, 1);
				/* 边缘色 */
			}


			._theme-default {

				.pageContainer {
					background: var(--bg-edge);
				}

				.pageContainer .page {
					background: var(--bg-in);
				}

				.header {
					background: var(--bg-edge);
					border-image: linear-gradient(to right, hsla(36, 38%, 73%, 1), rgba(66, 72, 75, 0) 65%) 1;
				}

				.leftBar > div {
					background: var(--bg-edge);
				}
			}


			._theme-dark {

				.header {
					/*------------ Header 渐进色底线 ------------- */
					border-image: linear-gradient(to right, rgb(66, 72, 75), 40%, rgba(66, 72, 75, 0) 65%) 1;
				}
			}
		`;
}
if ((location.hostname === "workflowy.com" || location.hostname.endsWith(".workflowy.com"))) {
		css += `
			/*------------ TODO Checkbox ------------- */
			/* 让todo方块节点与bullet普通节点 竖直对齐 */
			.checkmark:not(.boardColumn):not(.boardCard):not(.dashboard-card) > .name {
				a.bullet {
					opacity: 0;
				}

				> .prefix,
				> .content {
					left: -22px;
				}
			}

			.checkmark:not(.boardColumn):not(.boardCard):not(.dashboard-card) > .name:hover {
				a.bullet {
					opacity: 1;
					transition: opacity 3s ease-in-out;
				}

				> .prefix,
				> .content {
					-webkit-animation: slide-right 1.2s 1.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
					animation: slide-right 0.2s 1.2s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
				}

				> .prefix label:hover {
					-webkit-animation: shake-bottom 1s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
					animation: shake-bottom 1s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
				}
			}


			/* * ----------------------------------------
		    /* * animation slide-right
		    /* * ---------------------------------------- */
			@-webkit-keyframes slide-right {
				0% {
					-webkit-transform: translateX(0);
					transform: translateX(0);
				}

				100% {
					-webkit-transform: translateX(22px);
					transform: translateX(22px);
				}
			}

			@keyframes slide-right {
				0% {
					-webkit-transform: translateX(0);
					transform: translateX(0);
				}

				100% {
					-webkit-transform: translateX(22px);
					transform: translateX(22px);
				}
			}


			/* * ----------------------------------------
		    /* * animation shake-bottom
		    /* * ---------------------------------------- */
			@-webkit-keyframes shake-bottom {

				0%,
				100% {
					-webkit-transform: rotate(0deg);
					transform: rotate(0deg);
					-webkit-transform-origin: 50% 100%;
					transform-origin: 50% 100%;
				}

				10% {
					-webkit-transform: rotate(2deg);
					transform: rotate(2deg);
				}

				20%,
				40%,
				60% {
					-webkit-transform: rotate(-4deg);
					transform: rotate(-4deg);
				}

				30%,
				50%,
				70% {
					-webkit-transform: rotate(4deg);
					transform: rotate(4deg);
				}

				80% {
					-webkit-transform: rotate(-2deg);
					transform: rotate(-2deg);
				}

				90% {
					-webkit-transform: rotate(2deg);
					transform: rotate(2deg);
				}
			}

			@keyframes shake-bottom {

				0%,
				100% {
					-webkit-transform: rotate(0deg);
					transform: rotate(0deg);
					-webkit-transform-origin: 50% 100%;
					transform-origin: 50% 100%;
				}

				10% {
					-webkit-transform: rotate(2deg);
					transform: rotate(2deg);
				}

				20%,
				40%,
				60% {
					-webkit-transform: rotate(-4deg);
					transform: rotate(-4deg);
				}

				30%,
				50%,
				70% {
					-webkit-transform: rotate(4deg);
					transform: rotate(4deg);
				}

				80% {
					-webkit-transform: rotate(-2deg);
					transform: rotate(-2deg);
				}

				90% {
					-webkit-transform: rotate(2deg);
					transform: rotate(2deg);
				}
			}
		`;
}
if ((location.hostname === "workflowy.com" || location.hostname.endsWith(".workflowy.com"))) {
		css += `
			/*------------ 字体 IBM Plex Mono ------------- */
			@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap');

			.dialog-box,
			.breadcrumbs,
			.content,
			.MobileBreadcrumbs {
				font-family: 'IBM Plex Mono', monospace !important;
			}
		`;
}
if ((location.hostname === "workflowy.com" || location.hostname.endsWith(".workflowy.com"))) {
		css += `
			/*------------ Backlink 双链索引 ------------- */
			:root {
				--referencesBG: hsla(201, 13%, 15%, 1.00);
			}

			.references.boardCard {
				padding-top: 1px;
				border-radius: 10px;
			}

			._theme-dark .references.boardCard {
				background: var(--referencesBG);
				border: 1px solid hsla(203, 5%, 28%, 1.00);
			}
		`;
}
if ((location.hostname === "workflowy.com" || location.hostname.endsWith(".workflowy.com"))) {
		css += `
			/*------------ Board Kanban 看板视图 放大视野 ------------- */
			.board {
				/* 	zoom: 0.8; */
				zoom: 0.94;
			}
		`;
}
if ((location.hostname === "workflowy.com" || location.hostname.endsWith(".workflowy.com"))) {
		css += `
			/*------------ Hover Cursor 鼠标悬停在链接跳转时的光标样式  ↔ + ↗ ------------- */
			/* 	cursor: cell; */
			/* 外站超链接 */
			.contentLink:hover {
				cursor: alias;
				/* ↗  */
			}

			/* 站内链接 */
			.contentLink[href^="https://beta.workflowy.com"]:hover,
			.contentLink[href^="https://workflowy.com"]:hover {
				cursor: ne-resize;
				/* ↔  */
			}
		`;
}
if ((location.hostname === "workflowy.com" || location.hostname.endsWith(".workflowy.com"))) {
		css += `
			/*------------ Underline 下划线 黄线 ------------- */
			u {
				text-decoration: none !important;
				background: linear-gradient(#ffffff00 70%, #FFCF02 5%);
				/* 		padding-bottom: 2px; */
				transition: background-color 0.5s ease-in-out, height 0.5s ease-in-out;
			}

			/* 鼠标悬停阴影 */
			u:hover {
				background-color: #8686865e;
				border-radius: 4px 4px 0 0;
			}
		`;
}
if (new RegExp("^(?:workflowy.com)\$").test(location.href)) {
		css += `
			/*------------ HyperLink 超链接 ------------- */
			.innerContentContainer:has( a.contentLink) {
				/* 		display: flex; */
				/* 		flex-wrap: wrap; */
				/* 				align-items: center; */
				position: relative;
			}

			a.contentLink {

				font-size: 12px;
				cursor: pointer;
				text-decoration: none !important;
				padding: 0 8px 0 0px;
				opacity: 0.7;

				max-width: 300px;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				/* 	position: relative; */
				/* 	color: #4B71FA; */
				/* 	margin: 0 0px; */
				/* 	background: linear-gradient(#ffffff00 95%, #92C0F6 10%); */
				/* 			border-radius: 6px; */
				/* 	flex-shrink: 1; */
				/*  line-height: 1.5; */
				/* 根据实际设计调整，确保垂直居中 */
				/* 	display: inline-block; */
				/* 	display: block; */
				/* 保证元素是块级或行内块状，支持溢出处理 */
			}

			a.contentLink:hover {
				color: #5DA7FD;
				opacity: 1;
				/* 				border: 1px solid #92C0F6; */
				/* 				border: 1px solid transparent; */
				border-bottom: 1px solid transparent;
				/* 		padding-bottom: 4px; */
				/* 		margin-bottom: 4px; */
				background: linear-gradient(#ffffff00 90%, #92C0F6 5%);
				transition: opacity 0.5s ease-in-out, background 0.3s ease-in-out;
			}

			a.contentLink:before {
				content: '[🔗';
				/* 						position: absolute; */
				/* 			left: -23px; */
			}

			a.contentLink:after {
				content: ' ]';
				/* 		position: absolute; */
				/* 		right: 0; */
				/* 				margin-left: 4px; */
				/* 				padding-left: 4px; */
			}
		`;
}
if ((location.hostname === "workflowy.com" || location.hostname.endsWith(".workflowy.com"))) {
		css += `
			/*------------ 代码块 ------------- */
			:root {
				--background-alt-light: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23000000' fill-opacity='0.16' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
				--background-alt-dark: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23ffffff' fill-opacity='0.16' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");

				--code-background-light: var(--background-alt-light);
				--code-background-dark: var(--background-alt-dark);

				--background-light-border: #E0E0E0;
				--background-dark-border: #767272;
			}

			._theme-default .code-block > .name > .content {
				background: var(--code-background-light);
				border: 2px dashed var(--background-light-border);
			}

			._theme-dark .code-block > .name > .content {
				background: var(--code-background-dark);
				border: 2px dashed var(--background-dark-border);
			}
		`;
}
if ((location.hostname === "workflowy.com" || location.hostname.endsWith(".workflowy.com"))) {
		css += `
			/*------------ Quote 引用块 ------------- */
			:root {
				/* 			--quote-bg-light: 	 */
				/* 		--quote-bg-dark: #767272; */
			}

			._theme-default {

				.quote-block > .name > .content {

					/* 			border-left-width: 4px; */
					/* padding: unset; */
					padding: 1px;
					/* 		padding-top: 0px; */
					background: #086DDD21;
					background: linear-gradient(135deg, #086DDD21, #FFFFFF);
					border-top-left-radius: 8px;
					border-bottom-left-radius: 8px;


					> .innerContentContainer {
						border-width: 3px;
						border-radius: 4px;
						border-left-color: #086DDD;
						/* 			border-left: none; */
					}
				}

				.quote-block > .name > .content:after {
					content: "";
					position: absolute;
					top: auto;
					right: 0;
					bottom: 0;
					left: auto;
					width: 1.5em;
					height: 1.5em;
					background: linear-gradient(to bottom right, #086DDD21, 50%, #FFFFFF 50%);
					-webkit-backdrop-filter: blur(2.5px);
					backdrop-filter: blur(2.5px);
					transition: all 0.2s ease-in-out;
					box-shadow: -4px -1px 2px 0px rgba(0, 0, 0, 0.2);
				}

				.quote-block > .name > .content:hover:after {
					width: 0;
					height: 0;
				}
			}

			._theme-dark .quote-block > .name > .content {
				/* 		background: var(--quote-bg-dark); */
				/* 		border: 2px dashed var(--background-dark-border); */
			}
		`;
}
if ((location.hostname === "workflowy.com" || location.hostname.endsWith(".workflowy.com"))) {
		css += `
			/*------------ Tag 标签 ------------- */
			.contentTag {
				padding: 0 6px !important;
				border-radius: 12px !important;
				font-size: 0.8em;
				border: 0.1em solid #FFFFFF8C;
				/* 				font-style: italic; */
				/* 				line-height: 10px; */
				/* 修正添加tag后 多出来的细微1px行高差 */
				span.contentTagText {
					text-decoration: none !important;
					/* 			color: #2D27279C; */
					/* 			color: var(--wf-yellow-200); */
				}

				> .contentTagNub {
					/* 			position: absolute;
					left: -15px; */
					/* 			display: none; */
				}
			}

			.contentTag:hover {
				/* 				filter: brightness(125%) !important; */
				transition: 200ms ease-in-out;
				/* 				cursor: cell; */
				font-size: 1em;
				/* 		padding-right: 16px; */
			}

			/*tag 标签颜色  */
			/* 	.contentTag[data-val="#purple"] */
		`;
}
if ((location.hostname === "workflowy.com" || location.hostname.endsWith(".workflowy.com"))) {
		css += `
			/*------------ Highlight 高亮配色 ------------- */
			:root {
				--hl-t-color-red: #CD0F2F;
				--hl-bg-color-red: #FFE9E9;

				--hl-t-color-orange: #D16C0F;
				--hl-bg-color-orange: #FFEDCF;

				--hl-t-color-yellow: #7E5308;
				--hl-bg-color-yellow: #FEF189;

				--hl-t-color-green: #146540;
				--hl-bg-color-green: #E4F3ED;

				--hl-t-color-teal: #06627D;
				--hl-bg-color-teal: #DCF3FE;

				--hl-t-color-sky: #15AAF9;
				--hl-bg-color-sky: #EAF8FF;

				--hl-t-color-blue: #0452B7;
				--hl-bg-color-blue: #EBEFFE;

				--hl-t-color-purple: #5E3AC6;
				--hl-bg-color-purple: #F5EEFF;

				--hl-t-color-pink: #F671C1;
				--hl-bg-color-pink: #FEEBF7;

				--hl-t-color-gray: #A4A4A4;
				--hl-bg-color-gray: #F1F1F1;
			}

			.colored {
				padding: 0 4px !important;
				margin: 0 1px;
				border-radius: 2px;
			}

			.colored.bc-red {
				color: var(--hl-t-color-red);
				background-color: var(--hl-bg-color-red);
				border-left: 1px solid var(--hl-t-color-red);
				border-right: 1px solid var(--hl-t-color-red);
			}

			.colored.bc-orange {
				color: var(--hl-t-color-orange);
				background-color: var(--hl-bg-color-orange);
				border-left: 1px solid var(--hl-t-color-orange);
				border-right: 1px solid var(--hl-t-color-orange);
			}

			.colored.bc-yellow {
				color: var(--hl-t-color-yellow);
				background-color: var(--hl-bg-color-yellow);
				border-left: 1px solid var(--hl-t-color-yellow);
				border-right: 1px solid var(--hl-t-color-yellow);
			}

			.colored.bc-green {
				color: var(--hl-t-color-green);
				background-color: var(--hl-bg-color-green);
				border-left: 1px solid var(--hl-t-color-green);
				border-right: 1px solid var(--hl-t-color-green);
			}

			.colored.bc-teal {
				color: var(--hl-t-color-teal);
				background-color: var(--hl-bg-color-teal);
				border-left: 1px solid var(--hl-t-color-teal);
				border-right: 1px solid var(--hl-t-color-teal);
			}

			.colored.bc-sky {
				color: var(--hl-t-color-sky);
				background-color: var(--hl-bg-color-sky);
				border-left: 1px solid var(--hl-t-color-sky);
				border-right: 1px solid var(--hl-t-color-sky);
			}

			.colored.bc-blue {
				color: var(--hl-t-color-blue);
				background-color: var(--hl-bg-color-blue);
				border-left: 1px solid var(--hl-t-color-blue);
				border-right: 1px solid var(--hl-t-color-blue);
			}

			.colored.bc-purple {
				color: var(--hl-t-color-purple);
				background-color: var(--hl-bg-color-purple);
				border-left: 1px solid var(--hl-t-color-purple);
				border-right: 1px solid var(--hl-t-color-purple);
			}

			.colored.bc-pink {
				color: var(--hl-t-color-pink);
				background-color: var(--hl-bg-color-pink);
				border-left: 1px solid var(--hl-t-color-pink);
				border-right: 1px solid var(--hl-t-color-pink);
			}

			.colored.bc-gray {
				color: var(--hl-t-color-gray);
				background-color: var(--hl-bg-color-gray);
				border-left: 1px solid var(--hl-t-color-gray);
				border-right: 1px solid var(--hl-t-color-gray);
			}
		`;
}
if ((location.hostname === "workflowy.com" || location.hostname.endsWith(".workflowy.com"))) {
		css += `
			/*------------ Kanban 看板视图 ------------- */
			/* 看板边距微调 视野更宽 */
			._theme-default .page:has( > .root.board) {

				padding-top: 20px;
				padding-left: 40px;

				.board {

					/* 			padding: 20px 0; */
					> .children {

						/* 	padding: 10px; */
						/* border-radius: 5%; */
						.boardColumn {

							/* overflow: hidden; */
							background-color: #F8F9FB;
							margin-right: 10px;
							/* padding-top: 14px; */
							border-radius: 12px;


							> .name {
								background-color: #FFFFFF;
								border: 1px solid #C7CDD7;
								border-radius: 8px;
								margin: 12px 9px;
								padding: 0px 0px 6px 20px;
								font-size: 20px;
								font-weight: normal;
								box-shadow: 3px 3px 6px 0px rgba(0, 0, 0, .1);
								position: relative;
								> .content {
									line-height: 26px;
								}

								a.bullet {
									/* 	⊙ Zoom指示器 */
									top: 9px !important;
									left: calc(100% - 56px) !important;
								}
								a.bullet:hover {
									color: rgba(5, 98, 174, 0.8);
								}
								> a.bullet::before {
									/* 大圈 */
									zoom: 0.86;
								}
								> a.bullet::after {
									/* 中圈 */
								}
								> a.bullet svg {
									/* 小点 */
								}


								/* 看板标题的折叠箭头 */
								> a.expand > div > svg {
									position: relative;
									left: -21px;
									top: -10px;
									color: rgb(86, 156, 214);
									/* 	width: 28px; */
									/* 	height: 28px; */
								}
								> a.expand > div > svg:hover {
									width: 36px;
									height: 36px;
									transition: width 0.2s ease-in-out;
								}


								/* 汉堡菜单按钮 ⁝ */
								> .itemMenu svg {
									/* 														position: relative; */
									position: absolute;
									right: 22px;
									top: -7px;
									width: 32px;
									height: 17px;
									transform: rotateZ(90deg);
									color: rgb(5, 98, 174);
									background-color: rgba(110, 158, 188, .12);
								}
							}

							/* 看板卡片 */
							/* .children .boardColumn.header2 */
							.children .boardCard {

								background-color: #FFFFFF;
								/* 	border-radius: 0 10px 10px 0; */
								border-radius: 10px;

								/* BUG 后面的(…) 会被遮挡 */
								margin-left: -1px !important;
								margin-right: 9px !important;

								/* 	看板文字内容边距尽量缩小??? */
								> .name {
									> .content {
										padding-top: 0px;
										/* padding-right: 0px; */
										/* border-radius: 4px; */
									}

									> a.expand > div > svg {
										position: relative;
										left: 12px;
										top: -4px;
										color: rgb(86, 156, 214);
									}
									> a.expand > div > svg:hover {
										width: 32px;
										height: 32px;
										transition: width 0.2s ease-in-out;
									}
								}
							}

							::-webkit-scrollbar {
								display: none;
							}
						}
					}
				}
			}

			/* 修复看板下 H1 H2 看板标题头 按钮偏移问题	 */
			.boardColumn.header1 > .name > a.expand,
			.boardColumn.header2 > .name > a.expand {
				top: 1em;
			}

			.boardColumn.header1 > .name > .itemMenu,
			.boardColumn.header2 > .name > .itemMenu {
				top: 18px;
			}

			/* 	Bullet视图下的 mini看板 */
			.page .root:not(.board) .board {
				.children {
					padding-bottom: 10px;
				}

				::-webkit-scrollbar {
					display: none;
				}
			}

			/* nameButtons  */
			/* 看板新增节点按钮 */
			/* 	.vertical-scrollable-container > div:not(.boardCard):last-child */
			/* 	.board .children > div.boardColumn + div:last-child:has( > div > svg[data-icon="plus"]) > div, */
			/* 	.boardColumn div:last-child:has( > svg[data-icon="plus"]) { */
			.boardColumn div:has( > svg[data-icon="plus"]) {
				font-weight: 550;
				text-transform: capitalize;
				color: #7D654873;
				/* 				background: #F2EDE6; */
				padding: 6px 8px calc(6px + 2px) 14px;
				border-radius: calc(8px * 0.8);
				margin: 0 10px 12px 0;
				/* 		margin-left: 10px; */
				/* 				box-shadow: inset 0px 1px 0px 0px rgba(255, 255, 255, 0.09), inset 0px 0px 0px 1px rgba(0, 0, 0, 0.15), inset 0px calc(-1 * 2px) 0px 2px rgba(0, 0, 0, 0.15), inset 0px -2px 4px 0px rgba(0, 0, 0, 0.2), 0px 4px 4px -5.6px rgba(0, 0, 0, 0.52), 0px 2px 4px -2.7px rgba(0, 0, 0, 0.22), 0px 2px 4px -1px rgba(0, 0, 0, 0.19); */
				box-shadow: inset 0px 0px 0px 1px rgba(0, 0, 0, 0.09), inset 0px calc(-1 * 2px) 0px 2px rgba(0, 0, 0, 0.07), 0px 2px 3px 0px rgba(0, 0, 0, 0.05);
				transition: 140ms cubic-bezier(0.68, -0.55, 0.27, 1.55);
				transition: background 140ms cubic-bezier(0.45, 0.05, 0.55, 0.95);
				/* 		opacity: 0.5; */
			}

			.board .children > div.boardColumn + div:last-child:has( > div > svg[data-icon="plus"]) > div:hover,
			.boardColumn div:has( > svg[data-icon="plus"]):hover {
				color: hsla(36, 38%, 98%, 1);
				background: hsl( calc(31 - 3), calc(23% * 1.33), calc(50% * 1.19));
				box-shadow: inset 0px 1px 0px 0px rgba(255, 255, 255, 0.12), inset 0px 0px 0px 1px rgba(0, 0, 0, 0.19), inset 0px calc(-1 * 2px) 0px 2px rgba(0, 0, 0, 0.15), inset 0px -2px 4px 0px rgba(0, 0, 0, 0.2), 0px 4px 4px -5.6px rgba(0, 0, 0, 0.52), 0px 2px 4px -2.7px rgba(0, 0, 0, 0.27), 0px 2px 6px -1px rgba(0, 0, 0, 0.24);
			}

			.board .children > div.boardColumn + div:last-child:has( > div > svg[data-icon="plus"]) > div:active,
			.boardColumn div:has( > svg[data-icon="plus"]):active {
				color: hsla(36, 38%, 98%, 1);
				background: hsl( calc(31 - 3), calc(23% * 1.33), calc(50% * 1.19));
				/* 		padding: calc(4px + 2px) 8px 6px 6px; */
				box-shadow: inset 0px 0px 0px 1px rgba(0, 0, 0, 0.15), inset 0px 0px 0px calc(1px + 2px) rgba(0, 0, 0, 0.09), inset 0px 2px 8px 0px rgba(0, 0, 0, 0.2), 0px 0px 0px 1px rgba(255, 255, 255, 0.6);
				transition: 140ms cubic-bezier(0.68, -0.55, 0.27, 1.55);
			}

			.boardColumn div:has( > svg[data-icon="plus"]):after {
				content: '+ 〔 新 增 节 点 〕';
				/* 		display: block; */
				position: relative;
				left: 5px;
			}

			.boardColumn div > svg[data-icon="plus"] {
				display: none;
			}

			.boardColumn > div.drop-line + div:not(.vertical-scrollable-container):last-child {
				margin-left: 10px;
			}

			.board .children > div.boardColumn + div:last-child:has( > div > svg[data-icon="plus"]) > div {
				/* 		color: #7D6548; */
				/* 		background: #F2EDE6; */
				/* 		padding: 6px 8px calc(6px + 2px) 14px; */
				border-radius: calc(8px * 0.8);
				box-shadow: inset 0px 0px 0px 1px rgba(0, 0, 0, 0.09), inset 0px calc(-1 * 2px) 0px 2px rgba(0, 0, 0, 0.07), 0px 2px 3px 0px rgba(0, 0, 0, 0.05);
				transition: 140ms cubic-bezier(0.68, -0.55, 0.27, 1.55);
				transition: background 140ms cubic-bezier(0.45, 0.05, 0.55, 0.95);
			}

			.contentEditablePlaceholder {
				/* Untitled 标题占位符 */
				top: 8px;
			}
		}

		.addChildButton {
			/* 			font-weight: 550; */
			/* 		text-transform: capitalize; */
			/* 		color: #7D6548; */
			/* 		background: #F2EDE6; */
			/* 		padding: 6px 8px calc(6px + 2px) 14px; */
			padding: 2px 0px 4px 0px;
			/* 		padding-bottom: 30px; */
			/* 		width: 16px; */
			/* 		height: 19px; */
			border-radius: calc(8px * 0.8);
			/* 		margin: 0 10px 12px 0; */
			/* 		margin-left: 10px; */
			/* 		box-shadow: inset 0px 1px 0px 0px rgba(255, 255, 255, 0.09), inset 0px 0px 0px 1px rgba(0, 0, 0, 0.15), inset 0px calc(-1 * 2px) 0px 2px rgba(0, 0, 0, 0.15), inset 0px -2px 4px 0px rgba(0, 0, 0, 0.2), 0px 4px 4px -5.6px rgba(0, 0, 0, 0.52), 0px 2px 4px -2.7px rgba(0, 0, 0, 0.22), 0px 2px 4px -1px rgba(0, 0, 0, 0.19); */
			box-shadow: inset 0px 0px 0px 1px rgba(0, 0, 0, 0.09), inset 0px calc(-1 * 2px) 0px 2px rgba(0, 0, 0, 0.07), 0px 2px 3px 0px rgba(0, 0, 0, 0.05);
			/* 		transition: 140ms cubic-bezier(0.68, -0.55, 0.27, 1.55); */
			/* 		transition: background 140ms cubic-bezier(0.45, 0.05, 0.55, 0.95); */
			circle {
				display: none;
			}
		}


		/*  +++++++  */
		.addChildButton:hover {
			/* 			color: hsla(36, 38%, 98%, 1); */
			/* 		background: hsl( calc(31 - 3), calc(23% * 1.33), calc(50% * 1.19)); */
			box-shadow: inset 0px 1px 0px 0px rgba(255, 255, 255, 0.12), inset 0px 0px 0px 1px rgba(0, 0, 0, 0.19), inset 0px calc(-1 * 2px) 0px 2px rgba(0, 0, 0, 0.15), inset 0px -2px 4px 0px rgba(0, 0, 0, 0.2), 0px 4px 4px -5.6px rgba(0, 0, 0, 0.52), 0px 2px 4px -2.7px rgba(0, 0, 0, 0.27), 0px 2px 6px -1px rgba(0, 0, 0, 0.24);
		}

		.addChildButton:active {
			/* 		opacity: 0.5; */
			/* 			color: hsla(36, 38%, 98%, 1); */
			background: hsl( calc(31 - 3), calc(23% * 1.33), calc(50% * 1.19));
			/* 		padding: calc(4px + 2px) 8px 6px 6px; */
			box-shadow: inset 0px 0px 0px 1px rgba(0, 0, 0, 0.15), inset 0px 0px 0px calc(1px + 2px) rgba(0, 0, 0, 0.09), inset 0px 2px 8px 0px rgba(0, 0, 0, 0.2), 0px 0px 0px 1px rgba(255, 255, 255, 0.6);
			/* 		transition: 140ms cubic-bezier(0.68, -0.55, 0.27, 1.55); */
			box-shadow: inset 0px 1px 0px 0px rgba(255, 255, 255, 0.09), inset 0px 0px 0px 1px rgba(0, 0, 0, 0.15), inset 0px calc(-1 * 2px) 0px 2px rgba(0, 0, 0, 0.15), inset 0px -2px 4px 0px rgba(0, 0, 0, 0.2), 0px 4px 4px -5.6px rgba(0, 0, 0, 0.52), 0px 2px 4px -2.7px rgba(0, 0, 0, 0.22), 0px 2px 4px -1px rgba(0, 0, 0, 0.19);
			/* 						color: #7D6548 !important; */
			background: #F2EDE6;
		}






		@-moz-document domain("workflowy.com") {
			/*------------ 🥚小彩蛋🥚 ------------- */
			/* 当节点数用量超额时 忽视并屏蔽超额提示板 以此获得无限量的节点额度 */
			div#app > .pageContainer > div:last-child:not(.page):has( > div > button > span) {
				display: none;
			}

			div#app > div.dialog-backdrop:has( > div.dialog-box > button.primary) {
				display: none;
			}
		`;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
