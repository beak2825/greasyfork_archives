// ==UserScript==
// @name         Asana Updates - WF
// @namespace    http://
// @description  Updates elements of Asana to make it better. Configurable (turn options on/off) within the code. Custom background, bigger sidebar, and more!
// @author       Wes Foster | WesFoster.com
// @match        https://app.asana.com/*
// @grant        GM_addStyle
// @version      2.1.8
// @history      2.1.8: Added option (default=TRUE) to move the notification to bottom-right. Added option to hide notifications (default=FALSE)
// @history      2.1.7: Updated removal of portfolios/goals
// @history      2.1.6: Updated the background image changer
// @history      2.1.5: Renamed the script
// @history      2.1.4: Made the features all optional. And added script description
// @history      2.1.3: Fixed syntax error
// @history      2.1.2: Enforced hidden harvest icon
// @downloadURL https://update.greasyfork.org/scripts/389800/Asana%20Updates%20-%20WF.user.js
// @updateURL https://update.greasyfork.org/scripts/389800/Asana%20Updates%20-%20WF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var options = {
			"resizeSidebar"		: true,
			"moveNotifications"	: true,		// If true, this will move Asana notifications to the BOTTOM-RIGHT instead of the bottom-left
			"autoShowProjects"	: true,
			"customBackground"	: false, 	// Set an image URL if you want this turned on.
			"hideHarvest"		: true,
			"hidePremiumNags"	: false, 	// If true, this will remove some of the upgrade nags (buttons, banners, etc.)
			"hidePortfolios"	: false,	// If true, this will remove the portfolios link
			"hideNotifications"	: false,	// If true, this will hide the Asana notifications that pop into view (for example, when duplicating a project)
			"hideGoals"		: false 	// If true, this will remove the goals link
    };


    // Remove Premium Elements
    if ( options.hidePremiumNags ) {
	    GM_addStyle("#topbar, .TopbarPageHeaderGlobalActions-upgradeButton, .TaskPremiumFeaturesSection { display: none !important; }");
    }
    if ( options.hidePortfolios ) {
	    GM_addStyle(".SidebarTopNavLinks-myPortfoliosbutton { display: none !important; }");
	  }
    if ( options.hideGoals ) {
	    GM_addStyle(".SidebarTopNavLinks-goalsButton { display: none !important; }");
	  }

    // Custom Background image
    if ( options.customBackground !== false ) {
	    GM_addStyle(".ThemeSetter-themeBackground {background-image:url('" + options.customBackground + "') !important}");
	  }    

    // Resize the left sidebar
    if ( options.resizeSidebar ) {
	    var asanaSidebarWidth = 350;
	    GM_addStyle(".AsanaMain-sidebar {width: " + asanaSidebarWidth + "px !important;}");
	    GM_addStyle(".AsanaMain-sidebar.AsanaMain-sidebar--isCollapsed {margin-left: " + asanaSidebarWidth*-1 + "px !important;}");
    }

    // Hide harvest time-tracker icon
    if ( options.hideHarvest ) {
	    GM_addStyle(".HarvestButton-timerIcon, .HarvestButton, .harvest-timer {display: none !important;}");
	  }

    // Hide Notifications
    if ( options.hideNotifications ) {
	    GM_addStyle(".ToastManager {display: none !important;}");
    }

    // Move Notifications
    if ( options.moveNotifications ) {
	    GM_addStyle(".ToastManager {right: 0 !important; left: unset !important;}");
    }

    // Recurring Interval to show projects in Asana
    if ( options.autoShowProjects ) {
	    var timerID = setInterval(performIntervalActions, 1000);
	    function performIntervalActions() {
	        var i;

	        // Expand "Show More Projects"
	        var projectLink = document.getElementsByClassName("SidebarTeamDetailsProjectsList-showMoreProjectsLink");
	        for (i = 0; i < projectLink.length; i++) {
	            projectLink[i].click();
	        }

	        // Expand Project Description
	        var projectDescBox = document.getElementsByClassName('ql-editor');
	        var sidebarHeightRestriction = 137; // Roughly the height of the header toolbar and margins
	        for (i = 0; i < projectDescBox.length; i++) {
	            projectDescBox[i].style.maxHeight = (document.getElementsByClassName('ProjectPageView')[0].clientHeight - sidebarHeightRestriction) + "px";
	        }
	    }
	    setTimeout(function(){ clearInterval(timerID);} , 30000);
	  }

})();