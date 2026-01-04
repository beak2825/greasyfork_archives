// ==UserScript==
// @author   Jimmy Chin
// @name     Twitter Original Images Extractor
// @version  1.0.11
// @include       https://twitter.com*
// @description Extract original size images for Twitter.
// @namespace https://greasyfork.org/users/241557
// @downloadURL https://update.greasyfork.org/scripts/403090/Twitter%20Original%20Images%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/403090/Twitter%20Original%20Images%20Extractor.meta.js
// ==/UserScript==

javascript:(function(){
    const SELECTOR = {
        ARTICLE_CLASS: "css-1dbjc4n r-18u37iz r-1ny4l3l r-1udh08x r-1qhn6m8 r-i023vh",
        BUTTON_BAR_CLASS_ON_TIMELINE: ".css-1dbjc4n.r-1kbdv8c.r-18u37iz.r-1wtj0ep.r-1s2bzr4.r-hzcoqn",
        BUTTON_BAR_CLASS_ON_ARTICLE_IN_DIM_BACKGROUND: ".css-1dbjc4n.r-1oszu61.r-1ila09b.r-rull8r.r-qklmqi.r-1kfrmmb.r-1efd50x.r-5kkj8d.r-1kbdv8c.r-18u37iz.r-h3s6tt.r-1wtj0ep.r-3qxfft.r-s1qlax",
        BUTTON_BAR_CLASS_ON_ARTICLE_IN_DEFAULT_BACKGROUND: ".css-1dbjc4n.r-1oszu61.r-j5o65s.r-rull8r.r-qklmqi.r-1dgieki.r-1efd50x.r-5kkj8d.r-1kbdv8c.r-18u37iz.r-h3s6tt.r-1wtj0ep.r-3qxfft.r-s1qlax",
        BUTTON_BAR_CLASS_ON_ARTICLE_IN_LIGHT_OUT_BACKGROUND: ".css-1dbjc4n.r-1oszu61.r-1igl3o0.r-rull8r.r-qklmqi.r-2sztyj.r-1efd50x.r-5kkj8d.r-1kbdv8c.r-18u37iz.r-h3s6tt.r-1wtj0ep.r-3qxfft.r-s1qlax",
        TIME_CLASS_ON_ARTICLE: "css-4rbku5.css-18t94o4.css-901oao.css-16my406.r-111h2gw.r-1loqt21.r-poiln3.r-bcqeeo.r-qvutc0"
    }
    const ATTRIBUTE = {
        BUTTON_CLASS: "css-1dbjc4n r-18u37iz r-1h0z5md r-3qxfft r-h4g966 r-rjfia"
    }
    const BACKGROUND_COLOR = {
        DEFAULT: "rgb(255, 255, 255)",
        DIM: "rgb(21, 32, 43)",
        LIGHTS_OUT: "rgb(0, 0, 0)"
    }
    const PATTERN = {
        IMG: /^https:\/\/pbs.twimg.com\/media\//
    }

    init();

    function init() {
        getTweetData();
        setDOMObserver();
    }

    function setDOMObserver() {
        const DOMObserver = new MutationObserver(() => getTweetData());

        DOMObserver.observe(document.body, {
            attributes: true,
            childList: true,
            subtree: true
        });
    }

    function getTweetData() {
        const tweets = document.querySelectorAll("article");
        if (!isEmpty(tweets)) {
            tweets.forEach(tweet => {
                setTimeout(() => {
                    if (!hasButtonBeenCreated(tweet)) {
                        if (isArticle(tweet)) {
                            createButtonForArticle(tweet);
                        } else {
                            createButtonForTimeline(tweet);
                        }
                    }
                }, 300);
            });
        }
    }

    function isArticle(tweet) {
        if (!isEmpty(tweet)) {
            return tweet.getAttribute("class") == SELECTOR.ARTICLE_CLASS;
        }
    }

    function hasButtonBeenCreated(tweet) {
        if (isArticle(tweet)) {
            return document.querySelector("#buttonForArticle");
        } else {
            return document.querySelector(`#button${getTweetIdFromTweet(tweet)}`);
        }
    }

    function createButtonForArticle(tweet) {
        if (!isEmpty(tweet)) {
            const buttonBar = document.querySelector(getButtonBarClassOnArticle());
            if (!isEmpty(buttonBar)) {
                const button = document.createElement("div");
                const lastButton = buttonBar.lastChild;
                const buttonWidth = lastButton.clientWidth;
                const buttonHeight = lastButton.clientHeight;
                button.setAttribute("class", ATTRIBUTE.BUTTON_CLASS);
                button.innerHTML = getButtonInnerHtml(buttonWidth, buttonHeight);
                button.id = "buttonForArticle";
                buttonBar.appendChild(button);

                button.addEventListener("click", () => {
                    const imgs = getImageFromTweet(tweet);
                    if (!isEmpty(imgs)) {
                        imgs.forEach(url => window.open(url));
                    }
                });
            }
        }
    }

    function createButtonForTimeline(tweet) {
        if (!isEmpty(tweet)) {
            const buttonBar = tweet.querySelector(SELECTOR.BUTTON_BAR_CLASS_ON_TIMELINE);
            if (!isEmpty(buttonBar)) {
                const button = document.createElement("div");
                const buttonCss = buttonBar.firstChild.getAttribute("class");
                const lastButton = buttonBar.lastChild;
                const buttonWidth = lastButton.clientWidth;
                const buttonHeight = lastButton.clientHeight;
                lastButton.setAttribute("class", buttonCss)
                button.setAttribute("class", buttonCss);
                button.innerHTML = getButtonInnerHtml(buttonWidth, buttonHeight);
                button.id = `button${getTweetIdFromTweet(tweet)}`;
                buttonBar.appendChild(button);

                button.addEventListener("click", () => {
                    const imgs = getImageFromTweet(tweet);
                    if (!isEmpty(imgs)) {
                        imgs.forEach(url => window.open(url));
                    }
                });
            }
        }
    }

    function getTweetIdFromTweet(tweet) {
        let result = null;
        if (!isEmpty(tweet)) {
            const timeObj = tweet.querySelector("time");
            if (!isEmpty(timeObj)) {
                const href = timeObj.parentNode.href;
                const lastSlashIndex = href.lastIndexOf("/");
                result = href.substr(lastSlashIndex + 1);
            }
        }
        return result;
    }

    function getImageFromTweet(tweet) {
        let result = null;
        if (!isEmpty(tweet)) {
            const imgs = [...tweet.querySelectorAll("img")];

            if (!isEmpty(imgs)) {
                const srcArray = [];

                imgs.filter(img => img.src.match(PATTERN.IMG))
                    .forEach(img => srcArray.push(img.src));
                result = transImageUrlToOrig(srcArray);
            }
        }

        return result;
    }

    function transImageUrlToOrig(imgs) {
        const result = [];
        if (!isEmpty(imgs)) {
            imgs.forEach(img => {
                /* get the "name" param index of the query string*/
                const nameParamKeyOfQueryString = img.indexOf("name=");
                const origImageUrl = img.substr(0, nameParamKeyOfQueryString) + "name=orig";
                result.push(origImageUrl);
            });
        }
        return result;
    }

    function isEmpty(data) {
        let result = false;
        if (data != undefined && data != null) {
            if (Array.isArray(data)) {
                if (data.length == 0) {
                    result = true;
                }
            } else if (typeof data == "string") {
                if (data.trim() == "") {
                    result = true;
                }
            }
        } else {
            result = true;
        }

        return result;
    }

    function getBGColor() {
        return document.body.style.backgroundColor;
    }

    function getButtonInnerHtml(buttonWidth, buttonHeight) {
        let result = null;
        switch (getBGColor()) {
            case BACKGROUND_COLOR.DEFAULT:
                result = getDefaultButtonInnerHtml(buttonWidth, buttonHeight);
                break;
            case BACKGROUND_COLOR.DIM:
                result = getDimButtonInnerHtml(buttonWidth, buttonHeight);
                break;
            case BACKGROUND_COLOR.LIGHTS_OUT:
                result = getLightsOutButtonInnerHtml(buttonWidth, buttonHeight);
                break;
        }
        return result;
    }

    function getButtonBarClassOnArticle() {
        let result = null;
        switch (getBGColor()) {
            case BACKGROUND_COLOR.DEFAULT:
                result = SELECTOR.BUTTON_BAR_CLASS_ON_ARTICLE_IN_DEFAULT_BACKGROUND;
                break;
            case BACKGROUND_COLOR.DIM:
                result = SELECTOR.BUTTON_BAR_CLASS_ON_ARTICLE_IN_DIM_BACKGROUND;
                break;
            case BACKGROUND_COLOR.LIGHTS_OUT:
                result = SELECTOR.BUTTON_BAR_CLASS_ON_ARTICLE_IN_LIGHT_OUT_BACKGROUND;
                break;
        }
        return result;
    }

    function getDefaultButtonInnerHtml(buttonWidth, buttonHeight) {
        return `<a>
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                        width="${buttonWidth}" height="${buttonHeight}"
                        viewBox="0 0 172 172"
                        style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#657786"><path d="M99.33,37.84c-1.73344,0.215 -3.02344,1.69313 -3.01,3.44v24.295c-39.60031,1.20938 -60.9525,22.17188 -71.4875,43c-10.68281,21.11031 -11.05906,41.69656 -11.0725,42.355v0.215v0.215c-0.05375,1.89469 1.43781,3.49375 3.3325,3.5475c1.89469,0.05375 3.49375,-1.43781 3.5475,-3.3325v-0.215c0.02688,-0.3225 0.79281,-10.73656 10.6425,-21.8225c9.675,-10.87094 28.55469,-21.83594 65.0375,-22.575v23.7575c0,1.31688 0.7525,2.52625 1.94844,3.10406c1.19594,0.57781 2.60688,0.41656 3.64156,-0.41656l55.04,-44.72c0.81969,-0.65844 1.29,-1.63937 1.29,-2.6875c0,-1.04812 -0.47031,-2.02906 -1.29,-2.6875l-55.04,-44.72c-0.72562,-0.59125 -1.65281,-0.86 -2.58,-0.7525zM103.2,48.4825l46.1175,37.5175l-46.1175,37.5175v-20.3175c0,-1.89469 -1.54531,-3.44 -3.44,-3.44c-40.43344,0 -62.22906,12.42969 -73.6375,25.2625c-0.43,0.48375 -0.67187,0.91375 -1.075,1.3975c1.45125,-4.73 3.35938,-9.7825 5.9125,-14.835c10.03781,-19.83375 29.19969,-39.345 68.8,-39.345c1.89469,0 3.44,-1.54531 3.44,-3.44z"></path></g></g>
                    </svg>
                    <div class="css-1dbjc4n r-sdzlij r-1p0dtai r-xoduu5 r-1d2f490 r-xf4iuw r-1ny4l3l r-u8s1d r-zchlnj r-ipm5af r-o7ynqc r-6416eg"></div>
                <a>`;
    }

    function getDimButtonInnerHtml(buttonWidth, buttonHeight) {
        return `<a>
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                        width="${buttonWidth}" height="${buttonHeight}"
                        viewBox="0 0 172 172"
                        style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#8899a6"><path d="M99.33,37.84c-1.73344,0.215 -3.02344,1.69313 -3.01,3.44v24.295c-39.60031,1.20938 -60.9525,22.17188 -71.4875,43c-10.68281,21.11031 -11.05906,41.69656 -11.0725,42.355v0.215v0.215c-0.05375,1.89469 1.43781,3.49375 3.3325,3.5475c1.89469,0.05375 3.49375,-1.43781 3.5475,-3.3325v-0.215c0.02688,-0.3225 0.79281,-10.73656 10.6425,-21.8225c9.675,-10.87094 28.55469,-21.83594 65.0375,-22.575v23.7575c0,1.31688 0.7525,2.52625 1.94844,3.10406c1.19594,0.57781 2.60688,0.41656 3.64156,-0.41656l55.04,-44.72c0.81969,-0.65844 1.29,-1.63937 1.29,-2.6875c0,-1.04812 -0.47031,-2.02906 -1.29,-2.6875l-55.04,-44.72c-0.72562,-0.59125 -1.65281,-0.86 -2.58,-0.7525zM103.2,48.4825l46.1175,37.5175l-46.1175,37.5175v-20.3175c0,-1.89469 -1.54531,-3.44 -3.44,-3.44c-40.43344,0 -62.22906,12.42969 -73.6375,25.2625c-0.43,0.48375 -0.67187,0.91375 -1.075,1.3975c1.45125,-4.73 3.35938,-9.7825 5.9125,-14.835c10.03781,-19.83375 29.19969,-39.345 68.8,-39.345c1.89469,0 3.44,-1.54531 3.44,-3.44z"></path></g></g>
                    </svg>
                    <div class="css-1dbjc4n r-sdzlij r-1p0dtai r-xoduu5 r-1d2f490 r-xf4iuw r-1ny4l3l r-u8s1d r-zchlnj r-ipm5af r-o7ynqc r-6416eg"></div>
                <a>`;
    }

    function getLightsOutButtonInnerHtml(buttonWidth, buttonHeight) {
        return `<a>
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                        width="${buttonWidth}" height="${buttonHeight}"
                        viewBox="0 0 172 172"
                        style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#6e767d"><path d="M99.33,37.84c-1.73344,0.215 -3.02344,1.69313 -3.01,3.44v24.295c-39.60031,1.20938 -60.9525,22.17188 -71.4875,43c-10.68281,21.11031 -11.05906,41.69656 -11.0725,42.355v0.215v0.215c-0.05375,1.89469 1.43781,3.49375 3.3325,3.5475c1.89469,0.05375 3.49375,-1.43781 3.5475,-3.3325v-0.215c0.02688,-0.3225 0.79281,-10.73656 10.6425,-21.8225c9.675,-10.87094 28.55469,-21.83594 65.0375,-22.575v23.7575c0,1.31688 0.7525,2.52625 1.94844,3.10406c1.19594,0.57781 2.60688,0.41656 3.64156,-0.41656l55.04,-44.72c0.81969,-0.65844 1.29,-1.63937 1.29,-2.6875c0,-1.04812 -0.47031,-2.02906 -1.29,-2.6875l-55.04,-44.72c-0.72562,-0.59125 -1.65281,-0.86 -2.58,-0.7525zM103.2,48.4825l46.1175,37.5175l-46.1175,37.5175v-20.3175c0,-1.89469 -1.54531,-3.44 -3.44,-3.44c-40.43344,0 -62.22906,12.42969 -73.6375,25.2625c-0.43,0.48375 -0.67187,0.91375 -1.075,1.3975c1.45125,-4.73 3.35938,-9.7825 5.9125,-14.835c10.03781,-19.83375 29.19969,-39.345 68.8,-39.345c1.89469,0 3.44,-1.54531 3.44,-3.44z"></path></g></g>
                    </svg>
                    <div class="css-1dbjc4n r-sdzlij r-1p0dtai r-xoduu5 r-1d2f490 r-xf4iuw r-1ny4l3l r-u8s1d r-zchlnj r-ipm5af r-o7ynqc r-6416eg"></div>
                <a>`;
    }
})();
