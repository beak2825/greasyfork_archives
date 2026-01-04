// ==UserScript==
// @name WF Tags Change the World
// @namespace github.com/openstyles/stylus
// @version 0.6.6.20241126
// @description 通过#tags标签改变Workflowy世界！
// @author YYYYang
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.workflowy.com/*
// @downloadURL https://update.greasyfork.org/scripts/516707/WF%20Tags%20Change%20the%20World.user.js
// @updateURL https://update.greasyfork.org/scripts/516707/WF%20Tags%20Change%20the%20World.meta.js
// ==/UserScript==

(function() {
let css = "";
if ((location.hostname === "workflowy.com" || location.hostname.endsWith(".workflowy.com"))) {
		css += `

			/* 标签隐藏 */
			/* .name  .contentTag[title="Filter #expand"] */
			[title="Filter #col-2"],
			[title="Filter #col-3"],
			[title="Filter #col-4"],
			[title="Filter #col-5"],
			[title="Filter #col-6"],
			[title="Filter #expand"],
			[title="Filter #expand1"],
			[title="Filter #expand2"],
			[title="Filter #expand3"],
			[title="Filter #expand4"],
			[title="Filter #expand5"],
			[title="Filter #expand6"],
			[title="Filter #expand7"],
			[title="Filter #expand8"],
			[title="Filter #expand9"],
			[title="Filter #expand10"],
			[title="Filter #open"],
			[title="Filter #openx"],
			[title="Filter #red"],
			[title="Filter #yellow"],
			[title="Filter #green"],
			[title="Filter #blue"],
			[title="Filter #pink"] {
				opacity: 0;
			}

			.name:hover .contentTag[title="Filter #col-2"],
			.name:hover .contentTag[title="Filter #col-3"],
			.name:hover .contentTag[title="Filter #col-4"],
			.name:hover .contentTag[title="Filter #col-5"],
			.name:hover .contentTag[title="Filter #col-6"],
			.name:hover .contentTag[title="Filter #expand"],
			.name:hover .contentTag[title="Filter #expand1"],
			.name:hover .contentTag[title="Filter #expand2"],
			.name:hover .contentTag[title="Filter #expand3"],
			.name:hover .contentTag[title="Filter #expand4"],
			.name:hover .contentTag[title="Filter #expand5"],
			.name:hover .contentTag[title="Filter #expand6"],
			.name:hover .contentTag[title="Filter #expand7"],
			.name:hover .contentTag[title="Filter #expand8"],
			.name:hover .contentTag[title="Filter #expand9"],
			.name:hover .contentTag[title="Filter #expand10"],
			.name:hover .contentTag[title="Filter #open"],
			.name:hover .contentTag[title="Filter #openx"],
			.name:hover .contentTag[title="Filter #red"],
			.name:hover .contentTag[title="Filter #yellow"],
			.name:hover .contentTag[title="Filter #green"],
			.name:hover .contentTag[title="Filter #blue"],
			.name:hover .contentTag[title="Filter #pink"],

			.notes:hover .contentTag[title="Filter #expand"],
			.notes:hover .contentTag[title="Filter #expand1"],
			.notes:hover .contentTag[title="Filter #expand2"],
			.notes:hover .contentTag[title="Filter #expand3"],
			.notes:hover .contentTag[title="Filter #expand4"],
			.notes:hover .contentTag[title="Filter #expand5"],
			.notes:hover .contentTag[title="Filter #expand6"],
			.notes:hover .contentTag[title="Filter #expand7"],
			.notes:hover .contentTag[title="Filter #expand8"],
			.notes:hover .contentTag[title="Filter #expand9"],
			.notes:hover .contentTag[title="Filter #expand10"],
			.notes:hover .contentTag[title="Filter #open"],
			.notes:hover .contentTag[title="Filter #openx"] {
				opacity: 1;
				color: #178B96 !important;
			}
		`;
}
if ((location.hostname === "workflowy.com" || location.hostname.endsWith(".workflowy.com"))) {
		css += `

			/* 强制让带有#expand标签的节点  看板宽度变宽 */
			.dashboard-card:has(.contentTag[title="Filter #expand"]),
			.board .boardColumn:has(.contentTag[title="Filter #expand"]) {
				flex-grow: 0 !important;
				flex-basis: 500px !important;
				max-width: inherit !important;
			}

			.dashboard-card:has(.contentTag[title="Filter #expand1"]),
			.board .boardColumn:has(.contentTag[title="Filter #expand1"]) {
				flex-grow: 0 !important;
				flex-basis: 10% !important;
				max-width: inherit !important;
			}

			.dashboard-card:has(.contentTag[title="Filter #expand2"]),
			.board .boardColumn:has(.contentTag[title="Filter #expand2"]) {
				flex-grow: 0 !important;
				flex-basis: 20% !important;
				max-width: inherit !important;
			}

			.dashboard-card:has(.contentTag[title="Filter #expand3"]),
			.board .boardColumn:has(.contentTag[title="Filter #expand3"]) {
				flex-grow: 0 !important;
				flex-basis: 30% !important;
				max-width: inherit !important;
			}

			.dashboard-card:has(.contentTag[title="Filter #expand4"]),
			.board .boardColumn:has(.contentTag[title="Filter #expand4"]) {
				flex-grow: 0 !important;
				flex-basis: 40% !important;
				max-width: inherit !important;
			}

			.dashboard-card:has(.contentTag[title="Filter #expand5"]),
			.board .boardColumn:has(.contentTag[title="Filter #expand5"]) {
				flex-grow: 0 !important;
				flex-basis: 50% !important;
				max-width: inherit !important;
			}

			.dashboard-card:has(.contentTag[title="Filter #expand6"]),
			.board .boardColumn:has(.contentTag[title="Filter #expand6"]) {
				flex-grow: 0 !important;
				flex-basis: 60% !important;
				max-width: inherit !important;
			}

			.dashboard-card:has(.contentTag[title="Filter #expand7"]),
			.board .boardColumn:has(.contentTag[title="Filter #expand7"]) {
				flex-grow: 0 !important;
				flex-basis: 70% !important;
				max-width: inherit !important;
			}

			.dashboard-card:has(.contentTag[title="Filter #expand8"]),
			.board .boardColumn:has(.contentTag[title="Filter #expand8"]) {
				flex-grow: 0 !important;
				flex-basis: 80% !important;
				max-width: inherit !important;
			}

			.dashboard-card:has(.contentTag[title="Filter #expand9"]),
			.board .boardColumn:has(.contentTag[title="Filter #expand9"]) {
				flex-grow: 0 !important;
				flex-basis: 90% !important;
				max-width: inherit !important;
			}

			.dashboard-card:has(.contentTag[title="Filter #expand10"]),
			.board .boardColumn:has(.contentTag[title="Filter #expand10"]) {
				flex-grow: 0 !important;
				flex-basis: 100% !important;
				max-width: inherit !important;
			}
		`;
}
if ((location.hostname === "workflowy.com" || location.hostname.endsWith(".workflowy.com"))) {
		css += `

			/* 强制让带有#open标签的节点 其note注释全展开状态	 */
			.content:has(> .innerContentContainer > .contentTag[title="Filter #open"]),
			div:has(>.content > .innerContentContainer > .contentTag[title="Filter #open"])+div .content {
				display: block !important;
				max-height: none !important;
				/* 		height: auto !important; */
				/* 		-webkit-line-clamp: none !important; */
			}

			/* 强制让带有#openx标签的节点 子项note全打开 */
			.project:has(> .notes > .content > .innerContentContainer > .contentTag[title="Filter #openx"]) .content {
				display: block !important;
				max-height: none !important;
			}
		`;
}
if ((location.hostname === "workflowy.com" || location.hostname.endsWith(".workflowy.com"))) {
		css += `

			/* WF List Table 列表表格功能 #col-2,3,4,5,6	 */
			.root:not(.board) {

				.project:has(>.name > .content > .innerContentContainer .contentTag[title="Filter #col-2"])>.children,
				.project:has(>.name > .content > .innerContentContainer .contentTag[title="Filter #col-3"])>.children,
				.project:has(>.name > .content > .innerContentContainer .contentTag[title="Filter #col-4"])>.children,
				.project:has(>.name > .content > .innerContentContainer .contentTag[title="Filter #col-5"])>.children,
				.project:has(>.name > .content > .innerContentContainer .contentTag[title="Filter #col-6"])>.children {
					width: 100%;
					display: table;
					table-layout: fixed;
					border-collapse: collapse;

					>.project {
						float: left !important;
						display: table-cell;
						/* 	border: 1px solid pink; */

						.name {
							margin-left: 30px;
							padding-left: 0px;
							position: relative;

							a.bullet {
								left: -30px;
							}

							a.expand {
								left: -50px;
								z-index: 10;
							}

							div.menu.itemMenu {
								position: absolute;
								left: -66px;

								svg {
									position: relative;

									top: 3px;
									width: 20px;
									height: 16px;
									transform: rotateZ(90deg);
									color: rgb(5, 98, 174);
									background-color: rgba(110, 158, 188, .22);
								}
							}


							div.menu.itemMenu svg:hover {
								background-color: rgba(110, 158, 188, .4);
							}
						}
					}

					>.project:hover {
						padding-left: -30px;
						background-color: rgba(110, 158, 188, .08);
						border-radius: 6px;
					}

					.addSiblingButton {
						/* 	隐藏添加末尾节点按钮（+号）*/
						display: none;
					}
				}

				.project:has(>.name > .content > .innerContentContainer .contentTag[title="Filter #col-2"])>.children>.project {
					width: 48% !important;
				}

				.project:has(>.name > .content > .innerContentContainer .contentTag[title="Filter #col-3"])>.children>.project {
					width: 31% !important;
				}

				.project:has(>.name > .content > .innerContentContainer .contentTag[title="Filter #col-4"])>.children>.project {
					width: 22% !important;
				}

				.project:has(>.name > .content > .innerContentContainer .contentTag[title="Filter #col-5"])>.children>.project {
					width: 17.2% !important;
				}

				.project:has(>.name > .content > .innerContentContainer .contentTag[title="Filter #col-6"])>.children>.project {
					width: 15% !important;
				}
			}
		`;
}
if ((location.hostname === "workflowy.com" || location.hostname.endsWith(".workflowy.com"))) {
		css += `
			/* 通过颜色标签让node符点变色 */

			.project:has(> .name > .content > .innerContentContainer .contentTag[title="Filter #blue"]) .bullet {
				color: #005BE4;
			}

			.project:has(> .name > .content > .innerContentContainer .contentTag[title="Filter #red"]) .bullet {
				color: #C5021F;
			}

			.project:has(> .name > .content > .innerContentContainer .contentTag[title="Filter #green"]) .bullet {
				color: #0B9E2E;
			}

			.project:has(> .name > .content > .innerContentContainer .contentTag[title="Filter #yellow"]) .bullet {
				color: #E5B80A;
			}

			.project:has(> .name > .content > .innerContentContainer .contentTag[title="Filter #pink"]) .bullet {
				color: #A51979;
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
