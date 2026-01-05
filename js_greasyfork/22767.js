// ==UserScript==
// @name             Pixiv Ajax Bookmark Mod
// @namespace        com.SaddestPanda.net.moe
// @version          2.9.2
// @description      Automatically adds artwork tags when you bookmark. ブックマークのタグを自動的につける。
// @match            *://www.pixiv.net/*
// @homepage         https://greasyfork.org/en/scripts/22767-pixiv-ajax-bookmark-mod
// @supportURL       https://greasyfork.org/en/scripts/22767-pixiv-ajax-bookmark-mod/feedback
// @author           qa2 & SaddestPanda
// @require          https://cdn.jsdelivr.net/npm/gm-webext-pref@0.4.2/dist/GM_webextPref.user.js
// @grant            GM.getValue
// @grant            GM.setValue
// @grant            GM.deleteValue
// @grant            GM_addValueChangeListener
// @grant            GM.registerMenuCommand
// @run-at           document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/22767/Pixiv%20Ajax%20Bookmark%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/22767/Pixiv%20Ajax%20Bookmark%20Mod.meta.js
// ==/UserScript==

var tagsArray = [],
    currLocation = "",
    theToken = "",
    restartCheckerInterval = null,
    startingSoonInterval = null;

if (document.querySelector("#meta-global-data")?.content) {
    theToken = JSON.parse(document.querySelector("#meta-global-data").content)?.token || "";
    // console.log("🚀 ~ theToken", theToken);
    //add it to cookies (15 mins)
    let expires = (new Date(Date.now() + 15 * 60 * 1000)).toUTCString();
    document.cookie = "TOKENpixivajaxbm=" + theToken + "; expires=" + expires + ";path=/;";
} else {
    try {
        //get the necessary token
        if (!theToken) {
            getthetoken();
        }
    } catch (e) {
        console.log("PABM token error: ", e);
    }
}

/*
    ❗ You don't have to touch these settings anymore. Use the new settings ui.
    ❗ もうここの設定を手動で変更する必要はあるません。ページ内の新しい設定UIを使用してください。
*/

const pref = GM_webextPref({
    default: {
        givelike: true,
        r18private: true,
        bkm_restrict: false,
        add_all_tags: true
    },
    body: [{
        key: "givelike",
        type: "checkbox",
        label: "Automatically give your bookmarks a like.（ブックマークした作品に自動的に「いいね！」をくれます。）"
    },
    {
        key: "add_all_tags",
        type: "checkbox",
        label: "Automatically add the work's tags as bookmark tags.（作品に登録されているすべてのタグをブックマークタグとして追加します。）"
    },
    {
        key: "r18private",
        type: "checkbox",
        label: "R-18 works are automatically added as private bookmarks.（作品はＲ-１８であった場合、自動的に非公開としてブックマークします。）"
    },
    {
        key: "bkm_restrict",
        type: "checkbox",
        label: "❗ Always add to private bookmarks list.（常に非公開としてブックマークします。）"
    },
    ]
});

//Start running startingSoon if the page is different
function restartChecker() {
    //check for url changes
    if (document.location != currLocation) {
        //Stop restart checker and go for startingSoon instead
        clearInterval(restartCheckerInterval);
        clearInterval(startingSoonInterval);
        startingSoonInterval = setInterval(startingSoon, 150);
    }
}

function startingSoon() {
    try {
        //Check if the main bookmark button exists
        if ((document.querySelectorAll(".gtm-main-bookmark").length == 1) &&
            //Also check if the current url matches /artworks/
            (document.location.toString().match(/^https?:\/\/www.pixiv.net\/.*?artworks\/.*/) != null) &&
            //Also check if we DO NOT have the hover buttons added into the page yet
            (document.querySelector("#pabmButtonsContainer") == null) &&
            //Also check if the bookmark button is enabled
            (document.querySelector(".gtm-main-bookmark").disabled == false)) {

            //Continue if everything above succeeds
            clearInterval(startingSoonInterval);
            try {
                //get the necessary token
                getthetoken();
                setTimeout(startingUp, 150);
            } catch (e) {
                console.log("PABM token error: ", e);
            }
        }
    } catch (e) {
        console.log("PABM startingSoon error: ", e);
    }
}

//Get tags, add hover buttons
function startingUp() {
    //Start restart checker
    currLocation = document.location.href;
    restartCheckerInterval = setInterval(restartChecker, 150);
    //clear tags
    tagsArray = [];
    //get all tags
    document.querySelectorAll("footer li").forEach(thisElement => {
        try {
            let thisTag = decodeURIComponent(thisElement.querySelector("a").href.match(/tags\/(.*)\/artworks/)[1]);
            if (thisTag) {
                tagsArray.push(thisTag);
            }
        } catch (e) { }
    });

    //add css
    AddMyStyle("pabmButtonsStyle", `
        #pabmButtonsContainer {
            position: absolute;
            width: 64px;
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            background-color: rgba(0, 0, 0, .5);
            padding: 3px 8px 2px 8px;
            height: 25px;
            /*! border: 2px black solid; */
            border-radius: 15px;
            margin-left: -26px !important;
            margin-top: -29px;
            z-index: 555;
            filter: opacity(100%);
            /*! left: -55px; */
            display: none
        }

        #pabmButtonsContainer > div {
            filter: drop-shadow(0px 0px 2px #fffc) drop-shadow(0px 0px 2px #fffc);
        }

        #pabmButtonsContainer:hover,
        .gtm-main-bookmark:hover ~ #pabmButtonsContainer {
            display: flex !important
        }

        .pabmButtons:first-of-type {
            margin-left: -2px;
        }

        .pabmButtons > svg:hover {
            filter: contrast(180%);
            stroke: #fff;
            stroke-width: .15em;
            stroke-opacity: 35%
        }

        .pabmButtonSettings {
            margin: 3px 4px 4px 4px;
        }

        .lowOpacity {
            opacity: 0.5;
        }

        `);

    //Set the button action
    var bkmNode = document.querySelector(".gtm-main-bookmark");
    bkmNode.setAttribute("href", "javascript:void(0)");
    bkmNode.addEventListener("click", bkmClickAdd);

    //Set the hover buttons
    var hoverButtons = document.createElement("div");
    bkmNode.after(hoverButtons);
    hoverButtons.outerHTML = `
        <div id="pabmButtonsContainer">
            <div class="pabmButtons pabmButtonPublic">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M21 5.5a7 7 0 017 7c0 5.77-3.703 10.652-10.78 14.61a2.5 2.5 0 01-2.44 0C7.703 23.152 4 18.27 4 12.5a7 7 0 017-7c1.83 0 3.621.914 5 2.328C17.379 6.414 19.17 5.5 21 5.5z" fill="#FF4060"></path>
                </svg>
            </div>
            <div class="pabmButtons pabmButtonPrivate">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M21 5.5a7 7 0 017 7c0 5.77-3.703 10.652-10.78 14.61a2.5 2.5 0 01-2.44 0C7.703 23.152 4 18.27 4 12.5a7 7 0 017-7c1.83 0 3.621.914 5 2.328C17.379 6.414 19.17 5.5 21 5.5z" fill="#FF4060"></path>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M29.98 20.523A3.998 3.998 0 0132 24v4a4 4 0 01-4 4h-7a4 4 0 01-4-4v-4c0-1.489.814-2.788 2.02-3.477a5.5 5.5 0 0110.96 0z" fill="#fff"></path>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M28 22a2 2 0 012 2v4a2 2 0 01-2 2h-7a2 2 0 01-2-2v-4a2 2 0 012-2v-1a3.5 3.5 0 117 0v1zm-5-1a1.5 1.5 0 013 0v1h-3v-1z" fill="#1F1F1F"></path>
                </svg>
            </div>
            <div class="pabmButtons pabmButtonSettings">
                <svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <path fill="#444" d="M16 9v-2l-1.7-0.6c-0.2-0.6-0.4-1.2-0.7-1.8l0.8-1.6-1.4-1.4-1.6 0.8c-0.5-0.3-1.1-0.6-1.8-0.7l-0.6-1.7h-2l-0.6 1.7c-0.6 0.2-1.2 0.4-1.7 0.7l-1.6-0.8-1.5 1.5 0.8 1.6c-0.3 0.5-0.5 1.1-0.7 1.7l-1.7 0.6v2l1.7 0.6c0.2 0.6 0.4 1.2 0.7 1.8l-0.8 1.6 1.4 1.4 1.6-0.8c0.5 0.3 1.1 0.6 1.8 0.7l0.6 1.7h2l0.6-1.7c0.6-0.2 1.2-0.4 1.8-0.7l1.6 0.8 1.4-1.4-0.8-1.6c0.3-0.5 0.6-1.1 0.7-1.8l1.7-0.6zM8 12c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z" />
                    <path fill="#444" d="M10.6 7.9c0 1.381-1.119 2.5-2.5 2.5s-2.5-1.119-2.5-2.5c0-1.381 1.119-2.5 2.5-2.5s2.5 1.119 2.5 2.5z" />
                </svg>
            </div>
        </div>
        `;
    document.querySelector(".pabmButtonPublic").addEventListener("click", function () {
        bkm(0);
        return false;
    });
    document.querySelector(".pabmButtonPrivate").addEventListener("click", function () {
        bkm(1);
        return false;
    });
    document.querySelector(".pabmButtonSettings").addEventListener("click", function () {
        pref.openDialog();
        return false;
    });
}

async function getthetoken(ignoreCookie = false) {
    var gettingCookie = getCookie("TOKENpixivajaxbm");
    if (gettingCookie != "" && !ignoreCookie) {
        theToken = gettingCookie;
        // console.log("🚀 ~ COOKIE ~ theToken", theToken);
        return;
    }
    if (theToken == "" || ignoreCookie) {
        let tryCount = 0;
        let retryLimit = 3;

        function doFetch(url) {
            if (!url) {
                return;
            }

            //Fetch the url and handle the response
            fetch(url, {
                method: "GET",
                credentials: "same-origin",    //same-origin or include
            })
                .then((response) => response.text())
                .then((sss) => {
                    // console.log("🚀 ~ .then ~ sss:", sss);
                    //get token
                    // Convert the HTML string into a document object
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(sss, 'text/html');

                    // Get the token (multiple methods)
                    let data = doc.querySelector("meta#meta-global-data");
                    if (data) {
                        try {
                            theToken = JSON.parse(data?.content)?.token || "";
                        } catch (error) {
                            console.log("🚀 ~ PABM gettoken json parse error:", error);
                        }
                    }
                    let match = doc.head.innerHTML.match(/pixiv\.context\.token = "([^"]+)"/);
                    if (match?.length > 1 && !theToken) {
                        theToken = match[1] || "";
                    }
                    let form = doc.querySelector("form[action^='bookmark_add'] input[name='tt']");
                    if (form && !theToken) {
                        theToken = form?.value || "";
                    }
                    // console.log("🚀 ~ GET ~ theToken", theToken);

                    if (theToken) {
                        //add it to cookies (30 mins)
                        var expires = (new Date(Date.now() + 30 * 60 * 1000)).toUTCString();
                        document.cookie = "TOKENpixivajaxbm=" + theToken + "; expires=" + expires + ";path=/;";
                        console.log("🚀 ~ GET ~ getthetoken SUCCESS!");
                        return;
                    } else {
                        console.error("🚀 PABM ~ doFetch ~ error: Token not found!", { data }, { match }, { form }, { doc });
                    }

                    //Reset the try count
                    tryCount = 0;
                })
                .catch((error) => {
                    console.log("🚀 PABM ~ gettoken doFetch ~ error:", error);
                    //Increment the try count
                    tryCount++;

                    //Check if the try count exceeds the retry limit
                    if (tryCount > retryLimit) {
                        console.log("🚀 PABM ~ gettoken doFetch ~ error: Fetch retry limit exceeded!");
                        return;
                    }

                    //Retry: call the doFetch function again with the current url instead after a delay
                    setTimeout(function () {
                        doFetch(document.location.href);
                    }, 500);
                });
        }
        //Start fetching (use an old version of the bookmark add page, the url and illust id doesn't matter.)
        doFetch("https://www.pixiv.net/bookmark_add.php?type=illust&illust_id=60223956");


    }
}

function bkmClickAdd(e) {
    // console.log("🚀 ~ bkmClickAdd ~ e:", e);
    try {
        e.stopImmediatePropagation();   //Prevent other event handlers
        e.preventDefault();
    } catch (e) {
        console.trace("PABM", e);
    }
    bkm(-1);
    return false;
}

/**
 * asPrivate values: value < 0 means auto detect
 *                   value == 1 means always private
 *                   value == 0 means always public
 *
 */
function bkm(asPrivate = -1) {
    let illustid = "";
    try {
        illustid = document.querySelector("link[rel=canonical]")?.href.split("artworks/")[1] || document.location.href.match(/artworks\/(\d+)/)[1];
    } catch (error) {
        console.error("🚀 PABM ~ bkm ~ error ERROR when finding illustid:", error, document.location.href);
    }

    if (!illustid) {
        console.error("🚀 PABM ~ bkm ~ error ILLUSTid is invalid", document.location.href);
        return;
    }

    if (!pref.get("add_all_tags")) {
        //don't add the tags
        tagsArray = [];
    }
    //var illusttype = "illust";

    //Get bkm_restrict as number (As we use it in the post request)
    let restrict_value = Number(pref.get("bkm_restrict"));
    if (asPrivate >= 0) {
        restrict_value = asPrivate;
    } else {
        //Auto-detect privacy
        try {
            if (document.querySelector("footer li:first-of-type").innerText == "R-18" && pref.get("r18private")) {
                restrict_value = 1;
            }
        } catch (e) { }
    }

    let like = pref.get("givelike");
    if (like) {
        //Use parent-sibling relationships to avoid using randomized names
        let likeButton = document.querySelector(".gtm-main-bookmark").parentNode.nextElementSibling.firstElementChild;
        if (likeButton && likeButton.disabled == false) {
            likeButton.classList.add("lowOpacity");
            likeButton.click();
        }
    }

    let fetchBody = {
        illust_id: illustid,
        comment: "",
        restrict: restrict_value,
        tags: tagsArray,
    };

    //Send bkm request
    bookmarkRequest(fetchBody);
}

async function bookmarkRequest(fetchBody, retries = 0) {
    let restrict_value = fetchBody.restrict;
    let illustid = fetchBody.illust_id;
    let fetchData = JSON.stringify(fetchBody);
    console.log("PABM Fetch data (fetchData, token)", { fetchData }, { theToken });

    //Dim the bookmark button
    let bkmButton = document.querySelector(".gtm-main-bookmark");
    let bkmButtonSvg = bkmButton.querySelector(".gtm-main-bookmark svg");
    bkmButtonSvg.style.opacity = 0.4;

    //Add to bookmarks
    fetch("https://www.pixiv.net/ajax/illusts/bookmarks/add", {
        "headers": {
            "accept": "application/json",
            "content-type": "application/json; charset=utf-8",
            "x-csrf-token": theToken
        },
        "body": fetchData,
        "method": "POST",
        "credentials": "same-origin"    //same-origin or include
    })
        .then(async (response) => {
            // console.log("PABM", response);
            if (!response.ok) {
                throw Error(response);
            }
            return response.json();
        })
        .then(async (response_json) => {
            // console.log("PABM", response_json);
            //Only continue if the response doesn't give an error
            if (!response_json.error) {
                if (restrict_value) {
                    //INSERT THE LOCKED HEART (PRIVATE BOOKMARK) SVG        https://yoksel.github.io/url-encoder/
                    bkmButtonSvg.outerHTML = decodeURIComponent("%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' class='j89e3c-1 kcOjCr' style='color: rgb(255, 64, 96); fill: rgb(255, 64, 96);'%3E%3Cdefs%3E%3Cmask id='uid-mask-2'%3E%3Crect x='0' y='0' width='32' height='32' fill='white'%3E%3C/rect%3E%3Cpath d='M16,11.3317089 C15.0857201,9.28334665 13.0491506,7.5 11,7.5%0AC8.23857625,7.5 6,9.73857647 6,12.5 C6,17.4386065 9.2519779,21.7268174 15.7559337,25.3646328%0AC15.9076021,25.4494645 16.092439,25.4494644 16.2441073,25.3646326 C22.7480325,21.7268037 26,17.4385986 26,12.5%0AC26,9.73857625 23.7614237,7.5 21,7.5 C18.9508494,7.5 16.9142799,9.28334665 16,11.3317089 Z' class='j89e3c-0 kBfARi'%3E%3C/path%3E%3C/mask%3E%3C/defs%3E%3Cg mask='url(%23uid-mask-2)'%3E%3Cpath d='%0AM21,5.5 C24.8659932,5.5 28,8.63400675 28,12.5 C28,18.2694439 24.2975093,23.1517313 17.2206059,27.1100183%0AC16.4622493,27.5342993 15.5379984,27.5343235 14.779626,27.110148 C7.70250208,23.1517462 4,18.2694529 4,12.5%0AC4,8.63400691 7.13400681,5.5 11,5.5 C12.829814,5.5 14.6210123,6.4144028 16,7.8282366%0AC17.3789877,6.4144028 19.170186,5.5 21,5.5 Z'%3E%3C/path%3E%3Cpath d='M16,11.3317089 C15.0857201,9.28334665 13.0491506,7.5 11,7.5%0AC8.23857625,7.5 6,9.73857647 6,12.5 C6,17.4386065 9.2519779,21.7268174 15.7559337,25.3646328%0AC15.9076021,25.4494645 16.092439,25.4494644 16.2441073,25.3646326 C22.7480325,21.7268037 26,17.4385986 26,12.5%0AC26,9.73857625 23.7614237,7.5 21,7.5 C18.9508494,7.5 16.9142799,9.28334665 16,11.3317089 Z' class='j89e3c-0 kBfARi'%3E%3C/path%3E%3C/g%3E%3Cpath d='M29.9796 20.5234C31.1865 21.2121 32 22.511 32 24V28%0AC32 30.2091 30.2091 32 28 32H21C18.7909 32 17 30.2091 17 28V24C17 22.511 17.8135 21.2121 19.0204 20.5234%0AC19.2619 17.709 21.623 15.5 24.5 15.5C27.377 15.5 29.7381 17.709 29.9796 20.5234Z' class='j89e3c-2 jTfVcI' style='fill: rgb(255, 255, 255); fill-rule: evenodd; clip-rule: evenodd;'%3E%3C/path%3E%3Cpath d='M28 22C29.1046 22 30 22.8954 30 24V28C30 29.1046 29.1046 30 28 30H21%0AC19.8954 30 19 29.1046 19 28V24C19 22.8954 19.8954 22 21 22V21C21 19.067 22.567 17.5 24.5 17.5%0AC26.433 17.5 28 19.067 28 21V22ZM23 21C23 20.1716 23.6716 19.5 24.5 19.5C25.3284 19.5 26 20.1716 26 21V22H23%0AV21Z' class='j89e3c-3 fZVtyd' style='fill: rgb(31, 31, 31); fill-rule: evenodd; clip-rule: evenodd;'%3E%3C/path%3E%3C/svg%3E");
                }
                //Set bookmark button style
                bkmButtonSvg.style.opacity = 1.0;
                bkmButtonSvg.style.fill = "#ff4060";
                bkmButtonSvg.querySelector("path").style.fill = "white";
                bkmButton.href = "https://www.pixiv.net/bookmark_add.php?type=illust&illust_id=" + illustid;
                bkmButton.removeEventListener("click", bkmClickAdd);
                bkmButton.addEventListener("click", function (e) {
                    e.stopImmediatePropagation();   //Prevent other event handlers
                    e.preventDefault();
                    //Open in a new tab
                    window.open("https://www.pixiv.net/bookmark_add.php?type=illust&illust_id=" + illustid);
                    return false;
                });
                document.querySelector("#pabmButtonsContainer").style.visibility = "hidden";
            } else {
                //Bookmark failure. Retry once after updating the token.
                console.error("PABM Bookmark failure 1", response_json, retries);
                if (retries == 0) {
                    //Update token, ignore the cookie
                    await getthetoken(true);
                    bookmarkRequest(fetchBody, 1);
                } else {
                    bkmButtonSvg.style.opacity = 1.0;
                }
            }
        }).catch(async function (erroredResponse) {
            //Bookmark failure. Retry once after updating the token.
            console.error("PABM Bookmark failure 2", erroredResponse, erroredResponse?.statusText, retries);
            if (retries == 0) {
                //Update token, ignore the cookie
                await getthetoken(true);
                bookmarkRequest(fetchBody, 1);
            } else {
                bkmButtonSvg.style.opacity = 1.0;
            }
        });

}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function AddMyStyle(styleID, styleCSS) {
    var myStyle = document.createElement('style');
    //myStyle.type = 'text/css';
    myStyle.id = styleID;
    myStyle.textContent = styleCSS;
    document.querySelector("head").appendChild(myStyle);
}

startingSoonInterval = setInterval(startingSoon, 150);
