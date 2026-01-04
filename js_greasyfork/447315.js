// ==UserScript==
// @name         7s Unachieved trophies
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A script that will dynamically compare achieved trophies to the current available trophies
// @author       Claws
// @include      https://*.se7ensins.com/*
// @icon         https://www.se7ensins.com/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447315/7s%20Unachieved%20trophies.user.js
// @updateURL https://update.greasyfork.org/scripts/447315/7s%20Unachieved%20trophies.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    /**
    * Trophies is a container that holds the information
    * of the user running the script as well as their
    * trophies. It also contains the required getters
    * and setters/adders to easily store their trophy
    * information.
    * @constructor
    */
    class Trophies {
        constructor(username) {
            this.trophies = [];
            this.username = username;
        }

        addTrophy(trophy) {
            this.trophies.push(trophy);
        }

        getTrophies() {
            return this.trophies;
        }

        toJSON(){
            return {
                username: this.username,
                trophies: this.trophies
            }
        }
    }

    /**
    * The trophy class contains all of the information
    * required for a given trophy to then display it
    * in the HTML.
    * @constructor
    */
    class Trophy {
        constructor(title, description, points, dateRecieved) {
            this.title = title;
            this.description = description;
            this.points = points;
            this.dateRecieved = dateRecieved;
        }

        getTitle(){
            return this.title;
        }
        getDescription(){
            return this.description;
        }
        getPoints(){
            return this.points;
        }
        toJSON(){
            return {
                title: this.title,
                description: this.description,
                points: this.points,
                dateRecieved: this.dateRecieved
            }
        }
    }

    /**
    * Parses a trophy based on the given li item
    * that contains the trophy information. The
    * expected information is parsed from the child
    * elements containing the text.
    */
    function parseTrophy(trophyLi) {
        let points = trophyLi.querySelector("span.contentRow-figure").innerText;
        let name = trophyLi.querySelector("h2.contentRow-header").innerText;
        let desc = trophyLi.querySelector("div.contentRow-minor").innerText;
        let dateRecieved;

        // Specific users 7s trophies page will have "time" for when they
        // got the trophy, but the main 7s trophies page will not.
        if (trophyLi.querySelector("time")) {
            dateRecieved = trophyLi.querySelector("time").innerText;
        } else {
            dateRecieved = "N/A";
        }

        return new Trophy(name, desc, points, dateRecieved);
    }

    /**
    *
    */
    function generateHeader(message) {
        let innerTextHtml = `
        <div class="p-body-header">
			<div class="p-title ">
				<h1 class="p-title-value">${message}</h1>
			</div>
		</div>
		`;

        return innerTextHtml;
    }

    /**
    * This method will generate the text-form of
    * the divs with class "p-body-content" or "p-body-main"
    * which holds all of the trophies. Content is the 7s
    * trophies page because of the sidebar while main
    * is the user-specific trophies.
    */
    function generatePBodyDiv(trophies) {
        //let containerElement = document.createElement("div");
        //containerElement.classList.add(containerClass);

        let innerTextHtml = `
        <div class="p-body-content">
        	<div class="p-body-pageContent">
        		<div class="block">
        			<div class="block-container">
        				<ol class="block-body">
                        	${generateTrophyLi(trophies)}
						</ol>
					</div>
				</div>
			</div>
        </div>
        `;
        return innerTextHtml;
    }

    /**
    * Will generate the required text-format of the li
    * elements for each of the trophies. needs to be
    * added into the main container div HTML to be
    * valid.
    */
    function generateTrophyLi(trophies) {
        let innerLiHtml = "";

        trophies.getTrophies().forEach((item) => {
            innerLiHtml += `
            <li class="block-row block-row--separated">
				<div class="contentRow">
					<span class="contentRow-figure contentRow-figure--text contentRow-figure--fixedSmall">${item.getPoints()}</span>
					<div class="contentRow-main">
						<h2 class="contentRow-header">${item.getTitle()}</h2>
						<div class="contentRow-minor">${item.getDescription()}</div>
					</div>
				</div>
            </li>
            `;
        });

        return innerLiHtml;
    }

    /**
    * Will compare the two lists of trophies, one
    * being trophies the user has recieved and the
    * other being a list of all available trophies
    * and will return a Trophies object containing
    * all trophies the user has not received
    */
    function getUnrecieved(recieved, all) {
        let unrecievedTrophies = new Trophies("Trophies Not Recieved");

        all.getTrophies().forEach((allValue) => {
            let isRecieved = false;
            recieved.getTrophies().forEach((myValue) => {
                if (myValue.getTitle() == allValue.getTitle()) {
                    isRecieved = true;
                    return false;
                }
            });

            if (!isRecieved) {
                unrecievedTrophies.addTrophy(allValue);
            }
        });

        return unrecievedTrophies;
    }

    /**
    * Depending on what page the user is viewing
    * their recieved trophies from (trophy points
    * popup window vs actual trophies page of the
    * user), different html elements will need to
    * be used. This method allows an easy way for
    * the code to check whether the viewing page
    * is the direct trophies page link or the
    * popup.
    */
    function isTrophiesPage() {
        let url = window.location.href;

        if (url.includes("trophies")) {
            return true;
        } else {
            return false;
        }
    }

    async function getAllTrophies() {
        return $.ajax({
            type: "GET",
            url: "https://www.se7ensins.com/help/trophies/"
        });
    }

    function parseTrophiesHtml(trophiesHtml, user) {
        let allTrophies = new Trophies(user);
        let allHtmlTrophies = $(trophiesHtml).find("ol.block-body li.block-row.block-row--separated");

        allHtmlTrophies.each(function(index, value) {
            allTrophies.addTrophy(parseTrophy(value));
        });

        return allTrophies;
    }

    function createContainerBefore(containerType, containerClass, bottomDivElement) {
        let containerElement = document.createElement(containerType);
        containerElement.classList.add(containerClass);

        bottomDivElement.parentNode.insertBefore(containerElement, bottomDivElement);
        return containerElement;
    }

    function generateElementsFromString(htmlString) {
        // intentionally not a oneliner in case future functionality wants to be added
        // it will make it easier (barely lol)
        let domParser = new DOMParser();
        let domElement = domParser.parseFromString(htmlString, "text/html");
        //let allElements = domElement.querySelector("div.p-body-content");
        let allElements = domElement.querySelectorAll("body > *");

        return allElements;
    }

    var $ = window.jQuery;
    let username = document.querySelector("span[class='p-navgroup-linkText']").innerText;

    // setup the page with listeners if we are not on the trophies page itself
    if (!isTrophiesPage()) {
        $(document).on("DOMNodeInserted", "div.block-container div.block-footer.block-footer--split", async function(e) {

        });

        $(document).on("click", "a[href$='/trophies'][href*='members']", async function() {
            console.log("clicked");

            // Upgrade to a mutation Observer at some point, don't wanna right now
            setTimeout(async function() {
                console.log($("div.block-container div.block-footer.block-footer--split"));
                let bottomDivElement = document.querySelector("div.block-container div.block-footer.block-footer--split");

                let allTrophies = await getAllTrophies();
                let myTrophies = parseTrophiesHtml(document, username);
                let unrecievedTrophies = getUnrecieved(myTrophies, parseTrophiesHtml(allTrophies));

                let blockContainer = document.createElement("ol");
                blockContainer.classList.add("block-body");
                bottomDivElement.parentNode.append(blockContainer);

                let trophiesElements = generateElementsFromString(generateTrophyLi(unrecievedTrophies));

                blockContainer.append(...trophiesElements);
            }, 300);
        });
    } else {
        // add the unachieved trophies and header to an additional body container
        let bottomDivElement = document.querySelector("div[class$='p-breadcrumbs--bottom']");

        let myTrophies = parseTrophiesHtml(document, username);
        let allTrophies = await getAllTrophies();
        let unrecievedTrophies = getUnrecieved(myTrophies, parseTrophiesHtml(allTrophies));

        let headerContainer = createContainerBefore("div", "p-body-header", bottomDivElement);
        let trophiesContainer = createContainerBefore("div", "p-body-main", bottomDivElement);

        let headerElements = generateElementsFromString(generateHeader("Trophies still to go!"));
        let trophiesElements = generateElementsFromString(generatePBodyDiv(unrecievedTrophies));

        headerContainer.append(...headerElements);
        trophiesContainer.append(...trophiesElements);
    }
})();