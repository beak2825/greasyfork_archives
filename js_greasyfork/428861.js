// ==UserScript==
// @name        Paramount+ Links
// @include     https://www.paramountplus.com/shows/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version     1.1.0
// @grant       GM_addStyle
// @description Adds an "Episode Links" button to Paramount+ shows pages to quickly obtain links for each season. These links can be used for downloading the episodes or other purposes.
// @namespace https://greasyfork.org/users/700756
// @downloadURL https://update.greasyfork.org/scripts/428861/Paramount%2B%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/428861/Paramount%2B%20Links.meta.js
// ==/UserScript==

GM_addStyle(
    ".modal {" +
    "display: none;" +
    "position: fixed;" +
    "z-index: 1;" +
    "left: 0;" +
    "top: 0;" +
    "width: 100%;" +
    "height: 100%;" +
    "overflow: auto;" +
    "background-color: rgb(0,0,0);" +
    "background-color: rgba(0,0,0,0.4);" +
    "}" +

    ".modal-content {" +
    "background-color: #fefefe;" +
    "margin: 15% auto;" +
    "padding: 20px;" +
    "border: 1px solid #888;" +
    "width: 80%;" +
    "}" +

    ".linksBox {"+
    "width: 100%;" +
    "height: 300px" +
    "}" +

    ".close {" +
    "color: #aaa;" +
    "float: right;" +
    "font-size: 28px;" +
    "font-weight: bold;" +
    "}" +

    ".close:hover," +
    ".close:focus {" +
    "color: black;" +
    "text-decoration: none;" +
    "cursor: pointer;" +
    "}" +

    ".links-button {" +
    "top: 5px;" +
    "display: none;" +
    "}" +

    ".disabled-button {" +
    "background-image: none;" +
    "background-color: gray;" +
    "}" +

    ".disabled-button:hover {" +
    "background-image: none;" +
    "background-color: gray;" +
    "}"
);

function getLinks(){
    let $videos = $(".link.vilynx-redirect");
    let links = "";
    $videos.each( (index,element) => {
        links += $(element).prop("href");
        links += "\n";
    });
    return links;
}

function modifyUI(){
    $(document.body).append('<div id="myModal" class="modal">' +
                            '<div class="modal-content">' +
                            '<span class="close">&times;</span>' +
                            '<textarea id="linksTxt" class="linksBox" readonly="readonly"></textarea>' +
                            '</div>' +
                            '</div>');
    $(".cta-box").append('<a id="linksBtn" class="links-button button">' +
                         '<div class="button__text">Episode Links</div>' +
                         '</a>');
    $(document).on('keyup', e => {
        if (e.key == "Escape"){
            $("#myModal").css("display", "none");
        }
    });

    let linksGenerated = false;
    let buttonDisabled = false;
    function displayLinks(){
        $("#myModal").css("display", "block");
    }

    $("#linksBtn").click(() => {
        if (!buttonDisabled){
            console.log("click");
            if (!linksGenerated){
                buttonDisabled = true;
                $("#linksBtn").addClass("disabled-button");

                let $seasons = $(".pv-h > .content > li > a");
                let currentIndex = 0;
                let videoContainer = $("#latest-episodes > .grid-view-container.grid").get(0);
                let links = "";
                let firstRun = true;

                let iterateSeasonsFunc = function iterateSeasons(){
                    if (firstRun){
                        firstRun = false;
                        $seasons.get(currentIndex).click();
                        setTimeout(iterateSeasonsFunc, 3000);
                    }
                    else if (currentIndex >= $seasons.size()){
                        links += getLinks();
                        $("#linksTxt").val(links);
                        linksGenerated = true;
                        displayLinks();
                        buttonDisabled = false;
                        $("#linksBtn").removeClass("disabled-button");
                    }
                    else {
                        links += getLinks();
                        $seasons.get(currentIndex).click();
                        currentIndex++;
                        setTimeout(iterateSeasonsFunc, 3000);
                    }
                }
                iterateSeasonsFunc();
            }
            else {
                displayLinks();
            }
        }
    });

    $(".links-button").hover( () => {
        console.log("hover");
    });

    $(".close").click(() => {
        $("#myModal").css("display", "none");
    });
}

$(document).ready(() => {
    let mutationObserver = new MutationObserver( (mutations, me) => {
        let $showMoreButton = $(".load-more-container-show > .load-more-button");
        if ($showMoreButton.length){
            $showMoreButton.get(0).click();
        }
        else {
            $("#linksBtn").css("display", "block");
            me.disconnect();
        }
    });
    mutationObserver.observe(document, {
        childList : true,
        subtree : true
    });
    modifyUI();
});