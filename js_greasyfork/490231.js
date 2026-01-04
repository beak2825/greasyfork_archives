// ==UserScript==
// @name         EZ2Navigation
// @version      1.3
// @description  Replace old links & add new links for easier navigation.
// @author       Misery / bukubanz#9152
// @include      https://fairview.deadfrontier.com/*
// @grant        
// @namespace
// @license MIT
// @namespace https://greasyfork.org/users/1264034
// @downloadURL https://update.greasyfork.org/scripts/490231/EZ2Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/490231/EZ2Navigation.meta.js
// ==/UserScript==

(function() {
    var currentVersion = (/@version/);

    var updateURL = "https://update.greasyfork.org/scripts/490231/EZ2Navigation.user.js";

    var scriptElement = document.createElement('script');
    scriptElement.src = updateURL;

    scriptElement.onload = function() {
        var scriptContent = window.meta || "";
        var match = scriptContent.match(/@version\s+([\d.]+)/);
        if (match) {
            var latestVersion = match[1];
            if (latestVersion !== currentVersion) {
                displayUpdateMessage();
            }
        }
    };

    document.body.appendChild(scriptElement);

    function displayUpdateMessage() {
        var updateMessage = document.createElement('div');
        updateMessage.style.position = 'fixed';
        updateMessage.style.top = '10px';
        updateMessage.style.left = '10px';
        updateMessage.style.padding = '10px';
        updateMessage.style.background = '#f8d7da';
        updateMessage.style.color = '#721c24';
        updateMessage.style.border = '1px solid #f5c6cb';
        updateMessage.style.borderRadius = '5px';
        updateMessage.textContent = 'New version of EZ Navigation is available. Please refresh the page to update.';
        document.body.appendChild(updateMessage);
    }


    var navigationLinks = [
        { name: "Outpost", imgSrc: "https://i.imgur.com/O3oqMPN.png", link: "https://fairview.deadfrontier.com/onlinezombiemmo/index.php" },
        { name: "Credit Shop", imgSrc: "https://i.imgur.com/OI9zSwX.png", link: "https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=28" },
        { name: "Forum", imgSrc: "https://i.imgur.com/vWR4foN.png", link: "https://fairview.deadfrontier.com/onlinezombiemmo/index.php?action=forum" },
        { name: "Market", imgSrc: "https://i.imgur.com/GxniNWY.png", link: "https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35" },
        { name: "Bank", imgSrc: "https://i.imgur.com/ZfFSTkE.png", link: "https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=15" },
        { name: "Storage", imgSrc: "https://i.imgur.com/4Y5Zsiz.png", link: "https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=50" },
        { name: "Logout", imgSrc: "https://i.imgur.com/hRgTcyV.png", link: getLogoutLink() },
        { name: "Profile", imgSrc: "https://i.imgur.com/cTQxxz4.png", link: "https://fairview.deadfrontier.com/onlinezombiemmo/index.php?action=profile" },
        { name: "The Yard", imgSrc: "https://i.imgur.com/ynkDl0H.png", link: "https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=24" }
    ];

    function createLinkElement(linkInfo) {
        var img = document.createElement("img");
        img.src = linkInfo.imgSrc;
        img.height = "60";

        var link = document.createElement("a");
        link.href = linkInfo.link;
        link.appendChild(img);

        return link;
    }

    function getLogoutLink() {
        return $("img[name=logout]").parent()[0].href;
    }

    var navigationContainer = document.createElement("div");
    navigationContainer.id = "navigation_holder";
    navigationContainer.style.overflow = "hidden";

    navigationLinks.forEach(function(linkInfo) {
        var linkElement = createLinkElement(linkInfo);
        linkElement.style.float = linkInfo.name === "Logout" ? "right" : "left";
        linkElement.style.textAlign = "center";
        linkElement.style.marginLeft = linkInfo.name === "Logout" ? "-6px" : "-13px";

        navigationContainer.appendChild(linkElement);
    });

    var table = document.getElementsByTagName("table")[6];
    table.innerHTML = ""; // Clear the table contents
    table.appendChild(navigationContainer);
    table.style.backgroundImage = "url()";
    table.style.transform = "scaleY(1.2)";
    table.style.position = "relative";
    table.style.top = "0px";

    var cookieCrumbleRow = document.getElementsByTagName("tr")[1];
    cookieCrumbleRow.style.height = "220px";
})();