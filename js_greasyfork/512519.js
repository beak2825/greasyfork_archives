// ==UserScript==
// @name         New Old Notifications - Neopets
// @namespace    https://greasyfork.org/en/scripts/512519-new-old-notifications-neopets
// @version      1.1.1
// @description  Displays notifications on the new layout's nav bar. Based on the script by JustDownloadin
// @author       GrarrlMunch
// @match        *://*.neopets.com/*
// @icon         https://files.catbox.moe/rciqco.png
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/512519/New%20Old%20Notifications%20-%20Neopets.user.js
// @updateURL https://update.greasyfork.org/scripts/512519/New%20Old%20Notifications%20-%20Neopets.meta.js
// ==/UserScript==

/*
    Based on the "Neopets - Old Notifications" script
    by JustDownloadin: https://greasyfork.org/en/scripts/503653-neopets-old-notifications
    This script was developed with permission from the original developer
*/

/* globals jQuery, $, waitForKeyElements */

var index = 0;
var elementsArray = Array.from(document.querySelectorAll('#alerts li'));
var closeList = Array.from(document.querySelectorAll('#alertstab__2020 ul .alert-x'));
var notFired = true;

function displayBarEl () { setTimeout(() => { notifBarEl(); }, 1000); }

function notifBarEl() {
    const iconEl = elementsArray[index].querySelector(':scope > a > div');
    const alertsTabComputedStyle = document.querySelector('#alertstab__2020 ul li');
    const alertsh4ComputedStyle = document.querySelector('#alertstab__2020 h4');
    const alertspComputedStyle = document.querySelector('#alertstab__2020 p');
    const aEle = document.querySelector('a');


    const HTMLEl = `
<div class="navBarNotif">
	<style>
    @media screen and (max-width: 1569px) {
		.navBarNotif {
			width: 260px;
		}
    }
    @media screen and (min-width: 1570px) {
		.navBarNotif {
			width: 320px;
		}
    }
    @media screen and (min-width: 1570px) {
		.navBarNotif {
			width: 435px;
		}
    }
    @media screen and (min-width: 1860px) {
		.navBarNotif {
			width: 600px;
		}
    }
	.navBarNotif {
	    box-sizing: content-box;
	    position: absolute;
	    left: 210px;
	    z-index: 99;
	    height: 60px;
	    padding: 0 10px;
	    font-family: 'MuseoSansRounded700', 'Arial', sans-serif;
	    border: ${window.getComputedStyle(alertsTabComputedStyle).getPropertyValue('border')};
	    border-radius: 10px;
	    box-shadow: ${window.getComputedStyle(alertsTabComputedStyle).getPropertyValue('box-shadow')};
	    -webkit-box-shadow: ${window.getComputedStyle(alertsTabComputedStyle).getPropertyValue('box-shadow')};
	    -moz-box-shadow: ${window.getComputedStyle(alertsTabComputedStyle).getPropertyValue('box-shadow')};
	    background-color: ${window.getComputedStyle(alertsTabComputedStyle).getPropertyValue('background-color')};
	}
	.navBarNotif h4 {
	    color: ${window.getComputedStyle(alertsh4ComputedStyle).getPropertyValue('color')};
	    margin-top: 3px;
	    margin-bottom: 0;
	}
	.navBarNotif h5 {
	    margin: 0;
	}
	.navBarNotif p {
        color: ${window.getComputedStyle(alertspComputedStyle).getPropertyValue('color')};
	    margin: 2px 15px 5px auto;
	    max-width: 555px;
	    max-height: 15px;
	    font-size: 10pt;
	    overflow: hidden;
	    white-space: nowrap;
	    text-overflow: "...";
	}
	.navBarNotif .alert-x {
	    position: absolute;
	    top: 5px;
	    right: 5px;
	    width: 15px;
	    height: 15px;
	    background: url(https://images.neopets.com/themes/h5/basic/images/x-icon.svg) center center no-repeat;
	    background-size: auto;
	    background-size: 100%;
	    cursor: pointer;
	}
	.navBarNotif > a > div {
	    float: left;
	    width: 50px;
	    height: 50px;
	    margin: 5px 10px 5px 0;
	    background-image: ${window.getComputedStyle(iconEl).getPropertyValue('background-image')};
	    background-size: 100%;
	    background-repeat: no-repeat;
	    background-position: center;
	    cursor: pointer;
	}
    .hideIfSmall {
	    cursor: pointer;
	    color: ${window.getComputedStyle(aEle).getPropertyValue('color')};
    }
	</style>
${elementsArray[index].innerHTML}
</div>
`;

    const seeAllAlerts = `<b> - <span class="hideIfSmall">See all alerts</span></b>`;

    /*Leaving the function as-is just in case I want to re-use it...*/
    $.fn.extend({
        toggleText: function(a, b){
            return this.text(this.text() == b ? a : b);
        }
    });

    $('.nav-top-grid__2020').prepend(HTMLEl);
    $('.navBarNotif h5').append(seeAllAlerts);
    $('.hideIfSmall').click(function(e){
        $('.nav-bell-icon__2020').click();
        $('.hideIfSmall').toggleText('See all alerts', 'Hide all alerts');
        e.stopPropagation();
    });
    document.querySelector('.navBarNotif .alert-x').addEventListener('click', function () {
        closeList[index].click();
    });

    closeList[index].addEventListener('click', function() {
        $('.navBarNotif').remove();
        index = index + 1;
        ((elementsArray[index] !== undefined) && notFired) && (displayBarEl());
    });
};

$(document).ready(function () {
    const viewAllComputedStyle = document.querySelector('.alerts-tab-viewall__2020');

    const DelHTML = `
<style type="text/css">
	.alerts-tab-deleteall__2020 {
	    position: relative;
	    width: 100%;
	    height: 40px;
	    background: ${window.getComputedStyle(viewAllComputedStyle).getPropertyValue('background')};
	}
</style>
<div class="alerts-tab-deleteall__2020">
	<div class="alerts-tab-viewclick__2020">
		<div class="alerts-tab-icon__2020" style="background-image: url(https://images.neopets.com/themes/046_ff_sep2017/events/warning.png);"></div>
		<div id="DelAllButton" class="news-dropdown-text__2020">Delete All</div>
	</div>
</div>`;

    $(DelHTML).insertBefore($('#alerts'));

    document.getElementById('DelAllButton').addEventListener('click', function () {
      let delAllEle = document.getElementById('DelAllButton');
      if ((elementsArray[index] !== undefined) && notFired) {
          notFired = false;
          delAllEle.innerHTML = "Deleting...";
          for (let i = 0; i < closeList.length; i++) {
              setTimeout (() => {
                  closeList[i].click();
                  console.log("Closed alert " + (i + 1) + "/" + closeList.length)
              }, 1000 * i);
              var timeOutExternal = (1000 * i) + 1000;
          }
          setTimeout(() => {
              delAllEle.innerHTML = "Deleted!";
              document.querySelector('.alerts-none__2020').style.display = '';
              setTimeout (() => { delAllEle.innerHTML = "Delete All" }, 2500);
          }, timeOutExternal);
     } else {
          delAllEle.innerHTML = "No alerts to delete!";
          setTimeout (() => { delAllEle.innerHTML = "Delete All" }, 2500);
     }
    });
});

((elementsArray[index] !== undefined) && notFired) && (displayBarEl());