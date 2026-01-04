// ==UserScript==
// @name 2019 Roblox Avatar Editor(RLOT Addon)
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description Brings Back The 2019 Avatar Editor code is by Vue2016 https://userstyles.world/user/Vue2016
// @author Vue2016
// @grant GM_addStyle
// @run-at document-start
// @match https://www.roblox.com/my/avatar*
// @downloadURL https://update.greasyfork.org/scripts/513157/2019%20Roblox%20Avatar%20Editor%28RLOT%20Addon%29.user.js
// @updateURL https://update.greasyfork.org/scripts/513157/2019%20Roblox%20Avatar%20Editor%28RLOT%20Addon%29.meta.js
// ==/UserScript==

(function() {
let css = `


    #costumes-dropdown .icon-down {
					display: none;
				}
				.rbx-tab.six-tab:nth-child(3) .text-lead {
					font-size: 0;
					height: 16px;
				}
				.rbx-tab.six-tab:nth-child(3) .text-lead:before {
					content: 'Costumes';
					font-size: 18px;
					font-weight: 400;
					display: inline-block;
				}
				.right-wrapper-placeholder:has(.rbx-tab.six-tab:nth-child(3).active) + .tab-content .breadcrumb-container li:nth-child(1) {
					font-size: 0;
					height: 20.8px;
					}
				
				.right-wrapper-placeholder:has(.rbx-tab.six-tab:nth-child(3).active) + .tab-content .breadcrumb-container li:nth-child(1):after {
					content: 'Costumes';
					font-size: 16px;
					font-weight: 300;
					line-height: 1.3em;
					cursor: text;
				}

				


				
			

.nav-tabs {
display: flex;
}
.rbx-tab.six-tab:nth-child(2) {
	display: none;
		}
		.rbx-tab.six-tab:nth-child(3).ng-hide {
			display: block !important;
			order: 6;
		}
		.rbx-tab.six-tab:nth-child(6) .text-lead {
			font-size: 0;
			height: 16px
		}
		.rbx-tab.six-tab:nth-child(6) .text-lead:before {
			content: 'Body';
			font-size: 18px;
			font-weight: 400;
			display: inline-block
		}
		.rbx-tab.six-tab:nth-child(6) .text-lead .icon-down {
			margin-top: -8px
		}

.ropro-changes .tab-content>.scaling-tab, .ropro-changes .tab-content>.scaling-tab .pill-toggle {
			z-index: 2!important;
		}


.nav-tabs {
			display: flex;
		}
		
		
		.tab-content>.tab-pane:not(.active).scaling-tab {
			display: revert;
			width: max-content;
			top: 190px;
			margin-left: -110px;
			height: 30.39px;
            position: relative;
		}

.pinned .tab-content>.active.scaling-tab .pill-toggle {
			position: fixed;
			top: 62px;
			left: unset;
			margin-left: -118px;
		}



	.tab-content>.tab-pane:not(.active).scaling-tab {
			display: grid;
			position: absolute;
			margin-left: -110px;
			width: 86px;
			height: 30.39px;
		}
		.tab-content>.tab-pane:not(.active).scaling-tab .section-content,.tab-content>.tab-pane:not(.active).scaling-tab [avatar-scaling] {
			display: grid;
			width: 86px;
			height: 30.39px;
		}
		.pinned .tab-content>.tab-pane:not(.active).scaling-tab {
			position: fixed;
			top: 60px
		}
		.tab-content>.active.scaling-tab .pill-toggle {
			position: absolute;
			left: -170px;
			top: -70px;
		}
		
		
		.tab-content>.tab-pane:not(.active).scaling-tab .section-content {
			background: transparent;
			padding: 0;
			box-shadow: none;
			}
		
		.tab-content>.tab-pane:not(.active).scaling-tab .section-content .avatar-type-container div:not(.pill-toggle), .tab-content>.tab-pane:not(.active).scaling-tab .section-sliders, .avatar-type-container .text-label, .avatar-type-container .avatar-type-message-banner {
			display: none;
		}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
