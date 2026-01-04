// ==UserScript==
// @name        WaniKani Autofill Radicals
// @namespace   https://alsanchez.es/
// @include     /^https?://(www\.)?wanikani\.com/review/session/?$/
// @version     2
// @grant       none
// @description Automatically fill in the answer for radicals during reviews
// @downloadURL https://update.greasyfork.org/scripts/39370/WaniKani%20Autofill%20Radicals.user.js
// @updateURL https://update.greasyfork.org/scripts/39370/WaniKani%20Autofill%20Radicals.meta.js
// ==/UserScript==

(function()
{
    var container = document.querySelector("#character");
    var character = container.querySelector("span");
    var userResponse = document.querySelector("#user-response");

    var observer = new MutationObserver(function(mutations)
    {
        mutations.forEach(function(mutation)
        {
            if(mutation.target.classList.contains("radical"))
            {
                autofillRadical();
            }
        });
    });

    observer.observe(container, {
        attributes: true
    });

    function autofillRadical()
    {
        var answer;
        if(answer = findAnswerByImage())
        {
            userResponse.value = answer;
            return;
        }

        const customFontName = getRadicalCustomFontName();
        if(customFontName === null)
        {
            const radical = getRadical();
            userResponse.value = findAnswerByRadical(radical);
        }
        else
        {
            userResponse.value = findAnswerByCustomFontName(customFontName);
        }
    }

    /**
     * @returns {string}
     */
    function getRadical()
    {
        return character.innerHTML;
    }

    /**
     * @returns {(string|null)}
     */
    function getRadicalCustomFontName()
    {
        const icon = character.querySelector("i");

        if(icon === null)
        {
            return null;
        }

        if(icon.classList.length === 0)
        {
            return null;
        }

        const className = icon.classList[0];

        if(className.indexOf("radical-") !== 0)
        {
            return null;
        }

        return className.replace("radical-", "");
    }

    /**
     * @param {string} radical
     * @returns {string}
     */
    function findAnswerByRadical(radical)
    {
        for(let item of $.jStorage.get("activeQueue"))
        {
            if(
                typeof item.rad !== "undefined" &&
                item.rad === radical &&
                typeof item.en !== "undefined" &&
                Array.isArray(item.en) &&
                item.en.length > 0)
            {
                return item.en[0];
            }
        }

        return "";
    }

    /**
     * @returns {(string|null)}
     */
    function findAnswerByImage()
    {
        const image = character.querySelector("img");

        if(image === null)
        {
            return null;
        }

        const urlComponents = image.src.split("/");
        const imageName = urlComponents[urlComponents.length - 1];

        for(let item of $.jStorage.get("activeQueue"))
        {
            if(
                typeof item.rad !== "undefined" &&
                item.rad === imageName &&
                typeof item.en !== "undefined" &&
                Array.isArray(item.en) &&
                item.en.length > 0)
            {
                return item.en[0];
            }
        }

        return null;
    }

    /**
     * @param {string} customFontName
     * @returns {string}
     */
    function findAnswerByCustomFontName(customFontName)
    {
        for(let item of $.jStorage.get("activeQueue"))
        {
            if(
                typeof item.rad !== "undefined" &&
                item.custom_font_name === customFontName &&
                typeof item.en !== "undefined" &&
                Array.isArray(item.en) &&
                item.en.length > 0)
            {
                return item.en[0];
            }
        }

        return "";
    }

})();