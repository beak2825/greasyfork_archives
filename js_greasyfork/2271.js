// ==UserScript==
// @name        Netflix Ratings
// @namespace   lecapitan
// @description View various website ratings while in netflix
// @include     https://*.netflix.com/*
// @version     2.0.0.0
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/2271/Netflix%20Ratings.user.js
// @updateURL https://update.greasyfork.org/scripts/2271/Netflix%20Ratings.meta.js
// ==/UserScript==

document.netflixRatingsObject = 
{
    debug: true,
    typeRottenTomatoes: 'RottenTomatoes',
    classLoading: 'nr-loading',
    classLoaded: 'nr-loaded',
    load: function()
    {
        try {
            var mdpOverview = document.getElementById("mdp-overview");
            if (mdpOverview)
            {
                var title = this.getNetflixTitle(mdpOverview);
                var year = this.getNetflixYear(mdpOverview);
                if (title) {

                    var dataElement = this.createRatingContainerElement("nrRottenTomatoesContainer", "Rotten Tomatoes");
                    if (!this.hasClass(dataElement, this.classLoading) && !this.hasClass(dataElement, this.classLoaded))
                    {
                        this.getRatings(this.typeRottenTomatoes, title, year, dataElement);
                    }
                }
                /*// Get IMDb ratings
                dataElement = this.createRatingContainerElement("nrIMDbContainer", "IMDb");
                if (titleElement && dataElement)
                {
                    // Load ratings
                    if (!this.hasClass(dataElement, "nr-loading") && !this.hasClass(dataElement, "nr-loaded"))
                    {
                        // Start the search
                        this.getRatings("IMDb", this.getTitle(titleElement), this.getYear(mdpOverview), dataElement);
                    }
                }
                // Get metacritic ratings
                dataElement = this.createRatingContainerElement("nrmetacriticContainer", "metacritic");
                if (titleElement && dataElement)
                {
                    // Load ratings
                    if (!this.hasClass(dataElement, "nr-loading") && !this.hasClass(dataElement, "nr-loaded"))
                    {
                        // Start the search
                        this.getRatings("metacritic", this.getTitle(titleElement), this.getYear(mdpOverview), dataElement);
                    }
                }*/
            }
        }
        catch (error) {
            console.log(error);
        }
    },
    
    getNetflixTitle: function(element) {
        var titleElements = element.getElementsByClassName("title");
        if (titleElements && titleElements.length > 0) {
            return titleElements[0].innerHTML;
        }
        if (this.debug) console.log("debug: could not find the movie title from the netflix page");
        return null;
    },

    getNetflixYear: function(element) {
        var yearElements = element.getElementsByClassName("year");
        if (yearElements && yearElements.length > 0)
        {
            return yearElements[0].innerHTML;
        }
        if (this.debug) console.log("debug: could not find the movie year from the netflix page");
        return null;
    },

    createRatingContainerElement: function(id, website) {
        try {
            var pageElement = document.getElementById("mdp-subdata-container");
            if (!pageElement) {
                console.log("error: could not find the container element on the page. maybe the page structure has changed. please contact the creator.");
            }
            var containerDiv = document.createElement("div");
            containerDiv.className = "nr-ratings-container";
            var descriptionElement = document.createElement("span");
            descriptionElement.innerHTML = website + ": ";
            var linkElement = document.createElement("a");
            linkElement.id = id;
            containerDiv.appendChild(descriptionElement);
            containerDiv.appendChild(linkElement);
            this.insertAfter(pageElement, containerDiv);
            return linkElement;
        }
        catch (error) {
            console.log(error);   
        }
    },
    
    getRatings: function(type, title, year, dataElement) {
        dataElement.innerHTML = '...';
        this.addClass(dataElement, this.classLoading);
        if (type == this.typeRottenTomatoes) {
            this.fetchRating(type, this.getRottenTomatoesUrl(title), title, year, dataElement);
        }
        else if (type == 'IMDb') {
            this.fetchRating(type, this.getIMDbUrl(title), title, year, dataElement);
        }
        else if (type == 'metacritic') {
            this.fetchRating(type, this.getmetacriticUrl(title), title, year, dataElement);
        }
    },
    
    getRottenTomatoesUrl: function(title) {
        return "http://www.rottentomatoes.com/search/?search=" + this.encodeTitle(title);
    },
    
    getIMDbUrl: function(title) {
        return "http://www.imdb.com/find?q=" + this.encodeTitle(title).replace(/&amp;/g, "%26") + "&s=all";
    },
    
    getmetacriticUrl: function(title) {
        return "http://www.metacritic.com/search/movie/" + this.encodeTitle(title) + "/results";
    },

    encodeTitle: function(title) {
        return title.replace(/-/g, " ").replace(/ /g, "+");
    },
    
    fetchRating: function(type, url, title, year, dataElement) {
        // Set the link
        dataElement.href = url;
        // Check for a cached rating
        var cachedRating = this.getCachedRating(type, title);
        if (cachedRating) {
            dataElement.innerHTML = cachedRating[0];
            dataElement.href = cachedRating[1];
            this.addClass(dataElement, this.classLoaded);
            return;
        }
        // Make a cross-domain request for this url
        if (type == this.typeRottenTomatoes) {
            GM_xmlhttpRequest({
                method: 'get',
                url: url,
                onload: function(response) {
                    document.netflixRatingsObject.parseRottenTomatoesResponse(response.responseText, url, title, year, dataElement);
                },
                onerror: function(response) {
                    console.log('failed to get a response from rotten tomatoes for ' + url);
                }
            });
        }
        else if (type == "IMDb")
        {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(responseDetails)
                {
                    var responseDoc = document.netflixRatingsObject.getDom(responseDetails.responseText);
                    document.netflixRatingsObject.parseIMDbResponse(responseDoc, title, year, dataElement);
                },
                onerror: function(responseDetails)
                {
                    console.log('failed to get a response from imdb for ' + url);
                }
            });
        }
        else if (type == "metacritic")
        {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(responseDetails)
                {
                    var responseDoc = document.netflixRatingsObject.getDom(responseDetails.responseText);
                    document.netflixRatingsObject.parsemetacriticResponse(responseDoc, title, year, dataElement);
                },
                onerror: function(responseDetails)
                {
                    console.log("failure");
                }
            });
        }
    },

    // -----------------------------------
    // Caching functions
    // -----------------------------------
    getCachedRating: function(type, title) {
        try {
            var valueKey = type + "_" + this.encodeTitle(title);
            var urlKey = valueKey + '_url';
            var timeKey = valueKey + "_time";
            var value = GM_getValue(valueKey);
            if (!value) {
                return null;
            }
            var url = GM_getValue(urlKey);
            if (!url) {
                return null;
            }
            var time = new Date(GM_getValue(timeKey));
            if (!time) {
                return null;
            }
            var now = new Date();
            if (this.debug) console.log('time ' + time.toString() + ' < now ' + now.toString());
            if (time < now) {
                return null;
            }
            if (this.debug) console.log('found cached rating [' + valueKey + ', ' + time + ']: ' + value + ', ' + url);
            return [value, url];
        }
        catch (error) {
            console.log(error);
        }
    },

    saveCachedRating: function(type, title, value, url) {
        try {
            var valueKey = type + '_' + this.encodeTitle(title);
            var urlKey = valueKey + '_url';
            var timeKey = valueKey + '_time';
            GM_setValue(valueKey, value);
            GM_setValue(urlKey, url);
            var expireDate = new Date();
            expireDate.setMinutes(expireDate.getMinutes() + 30);
            if (this.debug) console.log('caching ' + valueKey + ' until ' + expireDate.toString());
            GM_setValue(timeKey, expireDate);
        }
        catch (error) {
            console.log(error);
        }
    },
    
    // -----------------------------------
    // Parsing functions
    // -----------------------------------
    parseRottenTomatoesResponse: function(responseText, url, title, year, dataElement) {
        try {
            // Check for no results
            if (responseText.match(/Sorry, no results found for/))
            {
                dataElement.innerHTML = "no results";
                this.addClass(dataElement, this.classLoaded);
                this.saveCachedRating(this.typeRottenTomatoes, title, text, url);
                return;
            }
            // Check for multiple results
            var regex = /{.*"movies":(\[.*\]),"tvCount".*}/;
            var match = regex.exec(responseText);
            if (match) {
                if (this.debug) console.log('debug: matched multiple results regex\r\nmatch: ' + match[0] + '\r\ncapture: ' + match[1]);
                var movieItems = JSON.parse(match[1]);
                if (movieItems.length > 0) {
                    // Look for a full match
                    for (var i = 0; i < movieItems.length; i++)
                    {
                        var parsedTitle = movieItems[i].name;
                        var parsedYear = movieItems[i].year;
                        var parsedUrl = "http://www.rottentomatoes.com" + movieItems[i].url;
                        // Check the title and year
                        if (parsedTitle.toLowerCase().replace(/[^a-z0-9]/g, "") == title.toLowerCase().replace(/[^a-z0-9]/g, "") && parsedYear == year)
                        {
                            document.netflixRatingsObject.fetchRating(this.typeRottenTomatoes, parsedUrl, title, year, dataElement);
                            return;
                        }
                    }
                    // Did not find a full match, check search results for just a title match
                    for (var i = 0; i < movieItems.length; i++)
                    {
                        var parsedTitle = movieItems[i].name;
                        var parsedYear = movieItems[i].year;
                        var parsedUrl = "http://www.rottentomatoes.com" + movieItems[i].url;
                        // Similar title
                        if (parsedTitle.toLowerCase().replace(/[^a-z0-9]/g, "") == title.toLowerCase().replace(/[^a-z0-9]/g, ""))
                        {
                            document.netflixRatingsObject.fetchRating(this.typeRottenTomatoes, parsedUrl, title, year, dataElement);
                            return;
                        }
                    }
                    // Did not find a title match, check search results for just a year match
                    for (var i = 0; i < movieItems.length; i++)
                    {
                        var parsedTitle = movieItems[i].name;
                        var parsedYear = movieItems[i].year;
                        var parsedUrl = "http://www.rottentomatoes.com" + movieItems[i].url;
                        // Same year
                        if (parsedYear == year)
                        {
                            document.netflixRatingsObject.fetchRating(this.typeRottenTomatoes, parsedUrl, title, year, dataElement);
                            return;
                        }
                    }
                    // Did not find any matches
                    dataElement.innerHTML = "..?";
                    // Set the loaded flag
                    this.addClass(dataElement, this.classLoaded);
                }
                return;
            }
            // Got a movie's page
            var responseDoc = this.getDom(responseText);
            var text = "";
            // Set the element text, if we cannot parse critic or user ratings
            dataElement.innerHTML = "..?";
            // Set the loaded flag
            this.addClass(dataElement, this.classLoaded);
            // Get the critics rating
            var criticsRating = responseDoc.getElementsByClassName("meter critic-score");
            if (criticsRating && criticsRating.length > 0) {
                var meterElement = criticsRating[0].getElementsByClassName("meter-value");
                if (meterElement && meterElement.length > 0) {
                    text = meterElement[0].childNodes[0].innerHTML + "%";
                }
            }
            // Get the users rating
            var usersRating = responseDoc.getElementsByClassName('meter media');
            if (usersRating && usersRating.length > 0) {
                var meterElement = usersRating[0].getElementsByClassName("meter-value");
                if (meterElement && meterElement.length > 0) {
                    text += " | " + meterElement[0].childNodes[1].innerHTML;
                }
            }
            // Assign to element
            dataElement.innerHTML = text;
            // Save in cache
            this.saveCachedRating(this.typeRottenTomatoes, title, text, url);
        }
        catch (error) {
            console.log(error);
        }
    },
    
    parseIMDbResponse: function(responseDoc, title, year, dataElement)
    {
        // Check for no results - IMDb seems to always provide some results...
        if (responseDoc.getElementsByClassName("noresults").length > 0)
        {
            dataElement.innerHTML = "no results";
            // Set the loaded flag
            dataElement.className = "nrIMDbMainData nrLoaded";
        }
        // Check for search results list
        else if (responseDoc.getElementsByClassName("findList").length > 0)
        {
            // Get all list items
            var movieItems = responseDoc.getElementsByClassName("result_text");
            // Check search results for a full match (title and year)
            for (var i = 0; i < movieItems.length; i++)
            {
                var parsedTitle;
                var parsedYear;
                var newUrl;
                // Get the title and url
                var linkList = movieItems[i].getElementsByTagName("a");
                for (var ii = 0; ii < linkList.length; ii++)
                {
                    if (linkList[ii].href.indexOf("/title/") >= 0)
                    {
                        parsedTitle = linkList[ii].innerHTML;
                        newUrl = "http://www.imdb.com" + linkList[ii].href;
                    }
                }
                // Get the year
                var yearMatch = movieItems[i].innerHTML.match(/\(([0-9]*)\)/);
                if (yearMatch.length > 0)
                {
                    parsedYear = yearMatch[1];
                }
                // Same title and year
                if (parsedTitle.toLowerCase().replace(/[^a-z0-9]/g, "") == title.toLowerCase().replace(/[^a-z0-9]/g, "") && parsedYear == year)
                {
                    document.netflixRatingsObject.fetchRating("IMDb", newUrl, title, year, dataElement);
                    return;
                }
            }
            // Did not find a full match, check search results for just a title match
            for (var i = 0; i < movieItems.length; i++)
            {
                var parsedTitle;
                var newUrl;
                // Get the title and url
                var linkList = movieItems[i].getElementsByTagName("a");
                for (var ii = 0; ii < linkList.length; ii++)
                {
                    if (linkList[ii].href.indexOf("/title/") >= 0)
                    {
                        parsedTitle = linkList[ii].innerHTML;
                        newUrl = "http://www.imdb.com" + linkList[ii].href;
                    }
                }
                // Same title
                if (parsedTitle.toLowerCase().replace(/[^a-z0-9]/g, "") == title.toLowerCase().replace(/[^a-z0-9]/g, ""))
                {
                    document.netflixRatingsObject.fetchRating("IMDb", newUrl, title, year, dataElement);
                    return;
                }
            }
            // Did not find a title match, check search results for just a year match
            for (var i = 0; i < movieItems.length; i++)
            {
                var parsedYear;
                var newUrl;
                // Get the title and url
                var linkList = movieItems[i].getElementsByTagName("a");
                for (var ii = 0; ii < linkList.length; ii++)
                {
                    if (linkList[ii].href.indexOf("/title/") >= 0)
                    {
                        newUrl = "http://www.imdb.com" + linkList[ii].href;
                    }
                }
                // Get the year
                var yearMatch = movieItems[i].innerHTML.match(/\(([0-9]*)\)/);
                if (yearMatch.length > 0)
                {
                    parsedYear = yearMatch[1];
                }
                // Same year
                if (parsedYear == year)
                {
                    document.netflixRatingsObject.fetchRating("IMDb", newUrl, title, year, dataElement);
                    return;
                }
            }
            // Did not find a match
            dataElement.innerHTML = "..?";
            // Set the loaded flag
            dataElement.className = "nrIMDbMainData nrLoaded";
        }
        else
        {
            // Set the element text, if we cannot parse ratings
            dataElement.innerHTML = "..?";
            // Set the loaded flag
            dataElement.className = "nrIMDbMainData nrLoaded";
            // Get the IMDb rating
            var elementList = responseDoc.getElementsByClassName("star-box-giga-star");
            if (elementList.length >= 0)
            {
                dataElement.innerHTML = elementList[0].innerHTML;
            }
        }
    },
    
    parsemetacriticResponse: function(responseDoc, title, year, dataElement)
    {
        // Check for no results - IMDb seems to always provide some results...
        if (responseDoc.getElementsByClassName("noresults").length > 0)
        {
            dataElement.innerHTML = "no results";
            // Set the loaded flag
            dataElement.className = "nrmetacriticMainData nrLoaded";
        }
        // Check for search results list
        else if (responseDoc.getElementsByClassName("search_results").length > 0)
        {
            // Get all list items
            var movieItems = responseDoc.getElementsByClassName("result");
            // Check search results for a full match (title and year)
            for (var i = 0; i < movieItems.length; i++)
            {
                // Check the result type
                var resultTypeElements = movieItems[0].getElementsByClassName("result_type");
                if (resultTypeElements.length <= 0 || resultTypeElements[0].childNodes[1].innerHTML != "Movie")
                {
                    continue; // Not a movie result type
                }
                var parsedTitle;
                var parsedYear;
                var newUrl;
                // Get the title and url
                var linkList = movieItems[i].getElementsByTagName("a");
                for (var ii = 0; ii < linkList.length; ii++)
                {
                    if (linkList[ii].href.indexOf("/movie/") >= 0)
                    {
                        parsedTitle = linkList[ii].innerHTML;
                        newUrl = "http://www.metacritic.com" + linkList[ii].href;
                    }
                }
                // Get the year
                var releaseDateElements = movieItems[i].getElementsByClassName("release_date");
                if (releaseDateElements.length > 0)
                {
                    var yearMatches = releaseDateElements[0].childNodes[3].innerHTML.match(/[A-Za-z0-9 ]*[,][ ]([0-9][0-9][0-9][0-9])/);
                    if (yearMatches)
                    {
                        parsedYear = yearMatches[1];
                    }
                }
                // Same title and year
                if (parsedTitle.toLowerCase().replace(/[^a-z0-9]/g, "") == title.toLowerCase().replace(/[^a-z0-9]/g, "") && parsedYear == year)
                {
                    document.netflixRatingsObject.fetchRating("metacritic", newUrl, title, year, dataElement);
                    return;
                }
            }
            // Did not find a full match, check search results for just a title match
            for (var i = 0; i < movieItems.length; i++)
            {
                // Check the result type
                var resultTypeElements = movieItems[0].getElementsByClassName("result_type");
                if (resultTypeElements.length <= 0 || resultTypeElements[0].childNodes[1].innerHTML != "Movie")
                {
                    continue; // Not a movie result type
                }
                var parsedTitle;
                var newUrl;
                // Get the title and url
                var linkList = movieItems[i].getElementsByTagName("a");
                for (var ii = 0; ii < linkList.length; ii++)
                {
                    if (linkList[ii].href.indexOf("/movie/") >= 0)
                    {
                        parsedTitle = linkList[ii].innerHTML;
                        newUrl = "http://www.metacritic.com" + linkList[ii].href;
                    }
                }
                // Same title
                if (parsedTitle.toLowerCase().replace(/[^a-z0-9]/g, "") == title.toLowerCase().replace(/[^a-z0-9]/g, ""))
                {
                    document.netflixRatingsObject.fetchRating("metacritic", newUrl, title, year, dataElement);
                    return;
                }
            }
            // Did not find a title match, check search results for just a year match
            for (var i = 0; i < movieItems.length; i++)
            {
                // Check the result type
                var resultTypeElements = movieItems[0].getElementsByClassName("result_type");
                if (resultTypeElements.length <= 0 || resultTypeElements[0].childNodes[1].innerHTML != "Movie")
                {
                    continue; // Not a movie result type
                }
                var parsedYear;
                var newUrl;
                // Get the title and url
                var linkList = movieItems[i].getElementsByTagName("a");
                for (var ii = 0; ii < linkList.length; ii++)
                {
                    if (linkList[ii].href.indexOf("/movie/") >= 0)
                    {
                        newUrl = "http://www.metacritic.com" + linkList[ii].href;
                    }
                }
                // Get the year
                var releaseDateElements = movieItems[i].getElementsByClassName("release_date");
                if (releaseDateElements.length > 0)
                {
                    var yearMatches = releaseDateElements[0].childNodes[3].innerHTML.match(/[A-Za-z0-9 ]*[,][ ]([0-9][0-9][0-9][0-9])/);
                    if (yearMatches)
                    {
                        parsedYear = yearMatches[1];
                    }
                }
                // Same title and year
                if (parsedYear == year)
                {
                    document.netflixRatingsObject.fetchRating("metacritic", newUrl, title, year, dataElement);
                    return;
                }
            }
            // Did not find a match
            dataElement.innerHTML = "..?";
            // Set the loaded flag
            dataElement.className = "nrmetacriticMainData nrLoaded";
        }
        else
        {
            // Set the element text, if we cannot parse ratings
            dataElement.innerHTML = "..?";
            // Set the loaded flag
            dataElement.className = "nrmetacriticMainData nrLoaded";
            // Get the metacritic rating
            var criticsRating, usersRating;
            var elementList = responseDoc.getElementsByClassName("score_value");
            if (elementList.length >= 0)
            {
                for (var i = 0; i < elementList.length; i++)
                {
                    if (elementList[i].parentNode.tagName.toLowerCase() == "a" && elementList[i].parentNode.href.indexOf("critic-reviews") >= 0)
                    {
                        criticsRating =  elementList[i].innerHTML;
                    }
                    if (elementList[i].parentNode.tagName.toLowerCase() == "a" && elementList[i].parentNode.href.indexOf("user-reviews") >= 0)
                    {
                        usersRating = elementList[i].innerHTML;
                    }
                }
                if (criticsRating)
                {
                    dataElement.innerHTML = criticsRating;
                }
                if (usersRating)
                {
                    dataElement.innerHTML += " | " + usersRating;
                }
            }
        }
    },
    
    // -----------------------------------
    // Helper functions
    // -----------------------------------
    hasClass: function(element, cls) {
        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
    },

    addClass: function(element, cls) {
        if (!this.hasClass(element, cls)) {
            element.className += ' ' + cls;
        }
    },

    insertAfter: function(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    },
    
    getDom: function(responseText) {
        var parser = new DOMParser();
        return parser.parseFromString(responseText, 'text/html');
    }
};

// Inject CSS
var styleElement = document.createElement('style');
styleElement.type = 'text/css';
styleElement.innerHTML =  '.nr-ratings-container { margin-top: 8px; color: #666666; }';
document.head.appendChild(styleElement);

// Load ratings
document.netflixRatingsObject.load();