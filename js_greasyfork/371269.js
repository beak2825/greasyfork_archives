// ==UserScript==
// @name         Youtube watched hider
// @namespace    http://joshuaarus.fr
// @version      0.7
// @description  Hide already watched (progress bar at 100%) video on user's, channel's and subscriptions' pages
// @author       Arus Joshua
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371269/Youtube%20watched%20hider.user.js
// @updateURL https://update.greasyfork.org/scripts/371269/Youtube%20watched%20hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CONSTANTS

    var IMG_GRAY = "data:image/png;base64,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";
    var IMG_WHITE = "data:image/png;base64,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";
    var IMG_RED = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTCtCgrAAAAE6ElEQVR4Xu2dQXLTMBhGs2ySZtEZd9Ftp+UiWXNGbsGSW3AFhm4owwy0ocyU73elNnHk2o5kO7Hem3lAYll2kg/9QnbJDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACmxvNsVsg1Rlu4t/R0sRdReVFBv11ff727vf3xno+LxZPaPmOcm7Ozf3c3N/fV99c+A20Pfj5y3DDaCdiJ+KDYi9Dj4AvE09H+UlfCN0zQ7EA/P3z49LBabfzJ4HTdzOdPvYbMOrXOf11cfLcDYn66zz5dwKyj31dXn/0BMG9dFuLCZR0QKqwaHS7tbENfsHPM3rWLSTe0Y6G6elfpDLHUzbm6jVq2AyUQm+xcEtWYEohtbVcS1dBKIMsK2MrWJVGNGK2wq82jlltpDe2MGLRx1LKNXPfDA60ftew6YGAHxEat0rkY7aKNBReX8VAfl8u/+n2/HOpJJu0Y6345ZNKOsQbLod3gFWqM2FbLkIvTC3qysJu6qg0Ru+hWFN7mWXrA/ApT+TbPYn6FqdyZZzG/wlS+zrP0oHg4P7c1iGBDxC66LBXMr7AP11kE689ySakf1jyCJT9yR+ygZhMse438bORwrnNZanhdW9GfCVjPlksOmSw17F0c1XPlfxfgrsqH9sEDLZcc9Mt9aOPErL0JTdv4iaTE2l/WWSZ3jNYGy9B2ymNi7U0NbpiY7wbLo3aUx0QSrABqT3mMlGDVoH0ojxESrAa0L+XxAAlWS9QH5bGDBKsD6ofy2FKCdQDqj/LYIMGKQP1SHmskWJGob8pjQIKVCB2D8rglwUqMjkV5lASrB3S87MsjweoRHTfb8kiwBkDHz648EqyB0DlkVR4J1sDoXMryOPWf5SRYI6FzmnR5JFgjovOabHkkWEeAzm9y5ZFgHRE6z8mUR4J1ROg8CdaJSSkcWII1IjovJu8n7tEFS+fEcsMEPJpg6VxYIJ2QowdL58AlnQk6arB0fC5CT9RRgqXjZlH2QhKsHtDxuNEv9OQEHSxYOlZ2ZS8kwUqEjpFt2QtJsCJR39mXvZAEKwL1S9mrkWAdgPpjlGqQYHVA/RColhKslqgPyl4HCVYD2pdR6gAJVg3ah0BFSLACqD1lL1KCtYXaMUolki8QENpOoBLLV55Q9pJrl7Wy/pIme55RKr3llzTl9rVyhh4zSvVo+bVy+kMWX4TpA2V3IPDfOfZuPl/dKyl7w5lHsB4uL7+EnsfezGbEwmEtg1Vw1yOm0mWpKP+VlMmSAw5gudTgyWTJAQewXGrw6AnmWZjKtzVDPSg28/lTpQFiJ12GXuZXHuZZGOvO/MrDPAtj3ZlfebSBeRbGun8XiZ4sHlarTaUhYitddnbnVx67QFvdAbGNlh0Xo33UoMjkjlJMqMtMeLTyMInHrgYn7VXUkEk8dnV/0l5FjQruW8K2uqy8XwY9asiohW1tHq08asw94dioy0i70cpjO1ASsc5OJbCKdqQkYp3tS2AV7UxJxD0PKoFVrAPChd4kofJYR5Ifn8pY99nb1ChNqLaxTq1zW2nlxsA8tIvL7hpy+kCFsAPJMmR2gxfXGE9f+wzts3SX9Wx06meE6oKdwNbJ7OjDV+fjYsHoF6G9f6H3ddtKWOocN0SpsRdUeYHYzWkFAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABms9l/iFivcr0NvBMAAAAASUVORK5CYII=";

    var IMG_GRAY_ALL = "data:image/png;base64,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";
    var IMG_WHITE_ALL = "data:image/png;base64,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";
    var IMG_RED_ALL = "data:image/png;base64,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";

    var IMG_TO_UPDATE = null;
    var IMG_ALL_TO_UPDATE = null;

    var COOKIE_NAME = "";
    var COOKIE_NAME_ALL = "youtubeWatchedHider_ALL";
    var HIDE = false;
    var HIDE_ALL = false;
    var CURRENT_URL = null;
    var CURRENT_PAGE = null;
    var PAGES = [
        {
            regex: /https:\/\/www\.youtube\.com\/(?:user|channel)\/([^\/]*)(\/.*)?/g,
            displayStyle: "inline-block",
            querySelector: "ytd-grid-video-renderer"
        },
        {
            regex: /https:\/\/www\.youtube\.com\/feed\/history/g,
            displayStyle: "flex",
            cookieName: "history",
            querySelector: "ytd-video-renderer"
        },
        {
            regex: /https:\/\/www\.youtube\.com\/feed\/trending/g,
            displayStyle: "block",
            cookieName: "trending",
            querySelector: "ytd-video-renderer"
        },
        {
            regex: /https:\/\/www\.youtube\.com\/feed\/subscriptions/g,
            displayStyle: "inline-block",
            cookieName: "subscriptions",
            querySelector: "ytd-grid-video-renderer"
        },
        {
            regex: /https:\/\/www\.youtube\.com\/?$/g,
            displayStyle: "inline-block",
            cookieName: "home",
            querySelector: "ytd-grid-video-renderer"
        },
        {
            regex: /https:\/\/www\.youtube\.com\/playlist\?list=(.*)/g,
            displayStyle: "flex",
            querySelector: "ytd-playlist-video-renderer"
        },
        {
            regex: /https:\/\/www\.youtube\.com\/results\?search_query=(.*)/g,
            displayStyle: "bloc",
            querySelector: "ytd-video-renderer"
        },
        {
            regex: /https:\/\/www\.youtube\.com\/watch\?.*/g,
            displayStyle: "inline-block",
            cookieName: "watch",
            querySelector: "ytd-compact-video-renderer"
        }
    ];



    // FUNCTIONS

    var setCookie = function(cname, cvalue) {
        var d = new Date();
        d.setTime(d.getTime() + (60 * 24 * 60 * 60 * 1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    var getCookie = function(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    var isTheaterMode = function(){
        var masthead = document.querySelector("ytd-masthead");
        var res = masthead.hasAttribute("dark");
        return res;
    }

    var getButtonIconAll = function() {
        return HIDE_ALL ? IMG_RED_ALL : (isTheaterMode() ? IMG_WHITE_ALL : IMG_GRAY_ALL);
    }

    var getButtonIcon = function() {
        return HIDE ? IMG_RED : (isTheaterMode() ? IMG_WHITE : IMG_GRAY);
    }

    var displayOrHide = function() {
        if (CURRENT_PAGE === null) {
            return;
        }

        document.querySelectorAll(CURRENT_PAGE.querySelector).forEach(function(element){
            var progressBar = element.getElementsByClassName("ytd-thumbnail-overlay-resume-playback-renderer");
            if (progressBar.length > 0)
            {
                var avancement = progressBar[0].style.width;
                if ((HIDE_ALL || HIDE) && avancement == "100%")
                {
                    element.style.display = "none";
                } else {
                    element.style.display = CURRENT_PAGE.displayStyle;
                }
            }
        });
    };

    var addClass = function(element, classes) {
    	classes.forEach(function(classe) {
    		element.classList.add(classe);
    	});
    }

    var createYtIcon = function() {
        var ytIcon = document.createElement("yt-icon");
        addClass(ytIcon, ["guide-icon", "style-scope", "ytd-guide-entry-renderer"]);
        return ytIcon;
    }

    var createYtIconButton = function() {
    	var ytIconButton = document.createElement("yt-icon-button");
        addClass(ytIconButton, ["style-scope", "ytd-topbar-menu-button-renderer", "style-default"]);
        return ytIconButton;
    }
    
	var createDivHide = function() {
		var divHide = document.createElement("ytd-topbar-menu-button-renderer");
        addClass(divHide, ["style-scope", "ytd-masthead", "style-default"]);
        return divHide;
	}

	var addButtonToButtonBar = function(divHide, aImg, ytIconButton, ytIcon, img) {
		var buttonBar = document.getElementById("buttons");

        buttonBar.insertBefore(divHide, buttonBar.firstChild);
        divHide.querySelector("div").appendChild(aImg);
        aImg.appendChild(ytIconButton);
        ytIconButton.querySelector("button").appendChild(ytIcon);
        ytIcon.appendChild(img);
	}

    var addButton = function() {
        var img = document.createElement('img');
        img.id = "youtubeWatchedHiderImg";
        img.src = getButtonIcon();
        img.width = "20";
        img.height = "20";
        IMG_TO_UPDATE = img;

        var ytIcon = createYtIcon();
        var ytIconButton = createYtIconButton();

        var aImg = document.createElement("a");
        aImg.href = "";
        aImg.onclick = function() {
            HIDE = !HIDE;
            setCookie(COOKIE_NAME, HIDE ? "true" : "false");
            displayOrHide();
            img.src = getButtonIcon();
            return false;
        }

        var divHide = createDivHide();
        divHide.id = "youtubeWatchedHiderDiv";

        addButtonToButtonBar(divHide, aImg, ytIconButton, ytIcon, img);
    };

    var addButtonAll = function() {
        var img = document.createElement('img');
        img.id = "youtubeWatchedHiderImgAll";
        img.src = getButtonIconAll();
        img.width = "20";
        img.height = "20";
        IMG_ALL_TO_UPDATE = img;

        var ytIcon = createYtIcon();
        var ytIconButton = createYtIconButton();


        var aImg = document.createElement("a");
        aImg.href = "";
        aImg.onclick = function() {
            HIDE_ALL = !HIDE_ALL;
            setCookie(COOKIE_NAME_ALL, HIDE_ALL ? "true" : "false");
            displayOrHide();
            img.src = getButtonIconAll();
            return false;
        }

		var divHide = createDivHide();
		divHide.id = "youtubeWatchedHiderDivAll";
		addButtonToButtonBar(divHide, aImg, ytIconButton, ytIcon, img);
    };

    var init = function() {
        CURRENT_URL = window.location.href;
        CURRENT_PAGE = null;
        PAGES.some(function(page) {
            if (CURRENT_URL.match(page.regex)) {
                CURRENT_PAGE = page;
                return true;
            }
        });

        if (CURRENT_PAGE === null) {
            return;
        }

        COOKIE_NAME = "youtubeWatchedHiderCookie_" + (CURRENT_PAGE.cookieName !== undefined ? CURRENT_PAGE.cookieName : CURRENT_PAGE.regex.exec(CURRENT_URL)[1]);
        HIDE = getCookie(COOKIE_NAME) === "true";
        HIDE_ALL = getCookie(COOKIE_NAME_ALL) === "true";

        addButton();
        addButtonAll();
    }


    // FUNCTION TO HANDLE THE CHANGE IN THEATER MODE IN WATCH PAGE

    setTimeout(function(){
        // Select the node that will be observed for mutations
        var targetNode = document.querySelector("ytd-masthead");
        // Options for the observer (which mutations to observe)
        var config = { attributes: true };

        // Callback function to execute when mutations are observed
        var callback = function(mutationsList) {
            IMG_TO_UPDATE.src = getButtonIcon();
            IMG_ALL_TO_UPDATE.src = getButtonIconAll();
        };

        // Create an observer instance linked to the callback function
        var observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);
    }, 1000);


	// AUTOMATIC UPDATE OF THE PAGE

    setInterval(function(){
        if (document.getElementById("youtubeWatchedHiderImg") == null) {
            init();
        }
        displayOrHide();
    }, 1000);

})();