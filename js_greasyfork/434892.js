// ==UserScript==
// @name         RebateKey - Show & Sort by Release Time and Show Reminders
// @namespace    https://rebatekey.com/
// @version      0.12
// @description  Always shows rebate release time instead of in a tooltip, sorts list of rebate cards on the Favorites page by the nearest release times, hides the share button on cards, and displays browser notification or alert when a fave rebate releases in 1 minute.
// @author       Koolstr
// @match        https://rebatekey.com/*
// @icon         https://www.google.com/s2/favicons?domain=rebatekey.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/434892/RebateKey%20-%20Show%20%20Sort%20by%20Release%20Time%20and%20Show%20Reminders.user.js
// @updateURL https://update.greasyfork.org/scripts/434892/RebateKey%20-%20Show%20%20Sort%20by%20Release%20Time%20and%20Show%20Reminders.meta.js
// ==/UserScript==

(function() {
    'use strict';

	//Converts an "xx:xx xm" timestamp to a Date object for comparison later
	function getDateObj(time) {
		const date = new Date()
		const split = /(\d+):(\d+)(.+)/.exec(time); //Break up via regex
		const isPm = (split[3].trim() === "pm")
		date.setHours((isPm ? 12 : 0) + parseInt(split[1] == 12 ? 0 : split[1], 10));
		date.setMinutes(parseInt(split[2], 10));
		return date
	}

	//Removes all the annoying share icons cluttering the card headers
	document.querySelectorAll('.share').forEach(e => {
		e.remove()
	})

	//Replaces tooltips with their rebate release time text
	document.querySelectorAll('.release i').forEach(info => {
		 info.outerHTML = info.title.split('@')[1].slice(1, -4) //Removes timezone with space, e.g., ' EST'
	})

	//Only on Favorites page, sorts cards by their release time, starting from the nearest time, and check for nearing releases for creating notifications or alerts
	if (document.location.pathname.includes('favorites')) {
		//Sort by time
		const sortedArr = [...document.querySelectorAll('.page .listing-card')].sort((a, b) => {
			if (a.getElementsByClassName('listing-item')[0].dataset.type === 'coupon') return false //Skip cards that are coupons not rebates as they don't have timestamps
			if (b.getElementsByClassName('listing-item')[0].dataset.type === 'coupon') return true

			const dateA = getDateObj(a.getElementsByClassName('release')[0].innerText)
			const dateB = getDateObj(b.getElementsByClassName('release')[0].innerText)
			return dateA - dateB
		})

		//Then sort by nearest time
		const now = new Date();
		const sortedNearestArr = []
		const couponsArr = [] //To be appended to the end of the list after sorting
		let spliceCount = 0 //Tracking where to insert next nearest card
		sortedArr.forEach(card =>	{
			if (card.getElementsByClassName('listing-item')[0].dataset.type === 'coupon') {
				//Skip cards that are coupons not rebates as they don't have timestamps
				couponsArr.push(card) //Just insert them at the end
				return
			}
			const release = getDateObj(card.getElementsByClassName('release')[0].innerText)
			if (now - release < 60000) { //If time has not yet passed (within the last minute)
				sortedNearestArr.splice(spliceCount, 0, card) //Insert as the next nearest time
				spliceCount++
			} else sortedNearestArr.push(card) //Append to end of list if its time has already passed today
		})
		//After sorting rebates, append coupon cards to end of the list
		sortedNearestArr.push(...couponsArr)

		//Then re-arrange the cards' actual DOM elements by sorted dates
		sortedNearestArr.forEach(card => document.querySelector('.page > .row').append(card))


		//Set up reminder notifications & browser alerts for rebates releasing in the next minute
		function showReminderNotification() {
			var title = "RebateKey Alert";
			var icon = "/favicon.ico"
			var body = "New rebate releasing in 1 minute";
			var notification = new Notification(title, { body, icon });
			notification.onclick = () => {
				notification.close();
				window.parent.focus();
			}
		}
		function requestPermissionAndShow() {
			Notification.requestPermission(function (permission) {
				if (permission === "granted") {
					showReminderNotification();
				}
			});
		}
		function checkForNearingRelease() {
			const now = new Date()
			for (const card of sortedNearestArr) {
				const upcomingTime = getDateObj(card.getElementsByClassName('release')[0].innerText)
				if (upcomingTime < now) continue //Skip if time already passed
				const timeDiff = Math.ceil((upcomingTime.getTime() - now.getTime()) / 60000) //In minutes
				if (timeDiff !== 1) continue //Only trigger notification when 1 minute left
				if(document.visibilityState === "visible") {
					alert("New rebate releasing in 1 minute")
				}
				else if (Notification.permission === "granted") showReminderNotification()
				else if (Notification.permission === "default") requestPermissionAndShow()
				break //Only trigger for one upcoming release per minute, no need for duplicate notifications
			}
		}

		//Register interval check for rebate times coming in 1 minute
		const setReleaseReminder = (expr, ...rest) => setTimeout(() => (expr(...rest), setInterval(expr, 60000, ...rest)), 60000 - new Date().getTime() % (60 * 1000)) //Triggers every minute on the minute
		setReleaseReminder(() => checkForNearingRelease())
	}
})();