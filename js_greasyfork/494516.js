// ==UserScript==
// @name         Hejto - Next notification
// @version      1.0
// @description  A faster way to read your notifications!
// @author       Vakarian
// @match        https://www.hejto.pl/*
// @icon         https://www.hejto.pl/favicon.ico
// @license      MIT
// @namespace https://greasyfork.org/users/30602
// @downloadURL https://update.greasyfork.org/scripts/494516/Hejto%20-%20Next%20notification.user.js
// @updateURL https://update.greasyfork.org/scripts/494516/Hejto%20-%20Next%20notification.meta.js
// ==/UserScript==

var notificationsButtonClass = "w-full h-full flex items-center justify-center rounded-xl relative text-grey-800 dark:text-grey-500 hover:text-primary-main focus:text-primary-main";
var notificationClass = "block text-left text-grey-800 dark:text-textPrimary-dark outline-none w-full"
var newNotificationMarkerClass = "w-2 h-2 rounded-full absolute top-1 right-1 bg-primary-main";
var buttonClass = "py-1 px-2 text-xs rounded-md border border-grey-700 text-grey-800 dark:text-textPrimary-dark"
var tabClass = "flex-1 text-center p-2 rounded-md"

var nextNotification = null;
var notificationBoxObserver = new MutationObserver(notificationBoxCheck);

function startObserve()
{
    notificationBoxObserver.disconnect();
    notificationBoxObserver.observe(document, {childList: true, subtree: true});
}

function notificationBoxCheck(records, observer)
{
    if (document.querySelector('#user-messages'))
    {
        nextNotification = null;
        var notifications = document.getElementsByClassName(notificationClass);
        for (var i = 0; i < notifications.length; i++)
        {
            var notif = notifications[i];
            if (notif.getElementsByClassName(newNotificationMarkerClass).length > 0)
            {
                nextNotification = notif;
            }
        }

        var buttons = document.getElementsByClassName(buttonClass);
        if (!!nextNotification)
        {
            if (buttons.length == 1)
            {
                var newButton = document.createElement("button");
                newButton.innerHTML = "Następne";
                newButton.onclick = nextClicked;
                buttonClass.split(" ").forEach((element) => newButton.classList.add(element));
                buttons[0].parentElement.insertBefore(newButton, buttons[0]);
            }
            observer.disconnect();
        }
        else if (buttons.length == 2)
        {
            buttons[0].remove();
        }

        var tabs = document.getElementsByClassName(tabClass);
        for (var j = 0; j < tabs.length; j++)
        {
            tabs[j].addEventListener("click", startObserve);
        }
    }
}

function nextClicked()
{
    if (!!nextNotification)
    {
        nextNotification.click()
    }
}

var notificationsButtons = document.getElementsByClassName(notificationsButtonClass);

for (var i = 0; i < notificationsButtons.length; i++)
{
    notificationsButtons[i].addEventListener("click", startObserve);
}