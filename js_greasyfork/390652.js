// ==UserScript==
// @name         Twitter own tooltip
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Create Twitter tooltips
// @author       aoiZhime
// @match        https://twitter.com/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390652/Twitter%20own%20tooltip.user.js
// @updateURL https://update.greasyfork.org/scripts/390652/Twitter%20own%20tooltip.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

/*
    ------------------------------  Dictionary  ------------------------------

        Variable
        Append Styles & Icon
        Append Footer menu & Search Box
        Sub function
            Download Image Function
            Change Link to Original Size Function
            Check Tweet Type Function
            Add 0 to 1-digit Function
            Generate Date Picker Function
            Extract User Account from Link Function
        Event Handlers
            Interval Function
                Create Tool Box in tweets
                Highlight Tweet type
                Create Tool Box Button
            Click event handlers
                Scroll Button
                    Scroll Down Button
                    Scroll Up Button
                Remove Photo Button
                Open Photo in new tab button
                Count Photo Button
                Download All Images Button
                    Download All Images Profile page
                    Download All Images Search Page
                Count Favorite tweets
                Click all unfavorite Button
                Remove not favorite tweets
                Export All Photo Link to text file
                Download single photo button
                Remove tweet button
                Download all photos in tweet
                Copy tweet link button
                Show / Hide Search Box
                Search Box submit button
                Show / Hide Tooltips Box
                Add favTweet when click like
                Remove favTweet when click unlike
*/


//------------------------------  Variable  ------------------------------//

    var imgLinkList = [];
    var autoRemoveTweet;
    const sty = `
    <style type="text/css" class="modified-twitter-layout">
    .Icon.Icon--bird , .nav.js-global-actions {
        display: none;
    }
    #typeahead-dropdown-1 {
        width: calc(100vw - 10vw);
    }
    li[role="complementary"] {
        display: none;
    }
    .js-stream-item:hover {

    }
    .module.Trends.trends , .flex-module.import-prompt , .Footer.module.roaming-module.Footer--slim.Footer--blankBackground
    {
        display:none;
    }
    .status-tool-btn {
        padding:5px 10px;
    }
    .dlBtnFont {
        font-size:12px;
    }
    .tweet-img-tool-container {
        z-index:1000;
    }
    .sideTooltip {
        position:fixed;
        display: none;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto;
        grid-gap: 5px 5px;
        width: calc(100% - 73%);
        height: auto;
        background-color: rgba(234, 232, 232, 0.9);
        border-radius: 15px;
        border: 1px solid black;
        right: calc(100% - 95%);
        bottom: calc(100% - 61%);
        z-index: 1100;

    }
    .sideMenu {
        display:flex;
        flex-direction:column;
        position:fixed;
        font-size:40px;
        right: calc(100% - 99%);
        bottom: calc(100% - 97%);
        z-index: 1100;
    }
    .sideBtn , button.sideBtn:active , button.sideBtn:focus {
        border: 0;
        outline:none;
        -moz-outline-style: none;
    }
    .fas {
        color: black;
    }
    .fa-heart {
        color:red;
    }
    .fa-play {
        color:green;
    }
    .fa-stop {
        color:red;
    }
    .searchBox {
        width: calc(100% - 60%);
        height: calc(100% - 70%);
        display: none;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        position: fixed;
        background-color: rgba(234, 232, 232, 0.9);
        bottom: calc(100% - 93%);
        right: calc(100% - 95%);
        z-index: 1100;
        border-radius: 25px;
        border: 1px solid black;
    }
    .searchBox-radio {
        width:100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
    .remove-non-media-box {
        display: none;
        grid-template-columns: 1fr 1fr;
        grid-gap: 5px;
        position: fixed;
        background-color: rgba(234, 232, 232, 0.9);
        bottom: 0;
        right: calc(100% - 95%);
        z-index: 1100;
        padding:10px;
        border: 1px solid black;
    }
    .remove-non-media-header {
        grid-column-start: 1;
        grid-column-end: 3;
    }
    input, select {
        border-radius:20px;
    }
    .stream-container .AdaptiveStreamGridImage .grid-tweet-actions-container {
        display:block;
    }
    label {
        color:black;
    }
    .tooltipBtn {
        background-color: #ccd6dd;
        border: 1px solid #000;
        border-radius: 13px;
        color: #66757f;
        cursor: pointer;
        display: inline;
        font-size: 14px;
        font-weight: bold;
        padding: 10px 15px;
    }
    .tooltipBtn:hover {
        color:#000;
    }
    .favTweet {
        border: 3px solid red;
        z-index: 1;
    }
    .videoTweet {
        border: 3px solid green;
        z-index: 1;
    }
    .favVideoTweet {
        border: 3px solid purple;
        z-index: 1;
    }
    </style>
    `

//------------------------------  Variable  ------------------------------//


//------------------------------  Append Styles & Icon  ------------------------------//

    $("head").append(sty)
    $("head").append(`<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.css">`)

//------------------------------  Append Styles & Icon  ------------------------------//


//------------------------------  Append Footer menu & Search Box  ------------------------------//

    $(document).ready(function() {

        let moreTooltip = `
        <div class="sideTooltip">
        <button class="tooltipBtn countImgBtn" >Count Images</button>
        <button class="tooltipBtn countLikeBtn" >Count <i class="fas fa-heart"></i></button>
        <button class="tooltipBtn saveAllImgBtn" ><i class="fas fa-download"></i> All Images</button>
        <button class="tooltipBtn unlikeBtn" >Unlike</button>
        <button class="tooltipBtn removenotLikeBtn" >Remove not <i class="fas fa-heart"></i> tweets</button>
        <button class="tooltipBtn filterMediaTweetBtn" >Remove non <i class="fas fa-photo-video"></i> tweets</button>
        <button class="tooltipBtn exportBtn" >Export Text File</button>
        </div>`

        let sideMenu = `<div class="sideMenu">
        <button class="scrollUpBtn sideBtn"><i class="fas fa-arrow-circle-up"></i></button>
        <button class="scrollDownBtn sideBtn"><i class="fas fa-arrow-circle-down"></i></button>
        <button class="toolTipBoxBtn sideBtn"><i class="fas fa-plus-circle"></i></button>
        <button class="searchBoxBtn sideBtn"><i class="fas fa-search"></i></button>
        </div>`

        let searchBoxDiv = `
        <div class="searchBox">
            <input type="text" value="${extractAccount()}" />
            <div class="searchBox-radio">
                <div style="margin-right: 5px">
                    <input type="radio" name="sType" value="images" checked>
                        <label for="sType" style="margin-left:5px">Photo</label>
                </div>
                <div style="margin-left: 5px">
                    <input type="radio" name="sType" value="videos">
                        <label for="sType" style="margin-left:5px">Video</label>
                </div>
            </div>
            <div class="searchBox-datePick">
                <label>Start Date</label>
                    <select class="sDate"></select>
                    <select class="sMonth"></select>
                    <select class="sYear"></select>
                <label>Final Date</label>
                    <select class="fDate"></select>
                    <select class="fMonth"></select>
                    <select class="fYear"></select>
            </div>
            <button class="btn searchBtn">Search</button>
        </div>`

        let removeNonMediaDiv = `
        <div class="remove-non-media-box">
            <div class="remove-non-media-header">Remove non media tweets</div>
            <button class="tooltipBtn startInBtn"><i class="fas fa-play"></i></button>
            <button class="tooltipBtn stopInBtn"><i class="fas fa-stop"></i></button>
        </div>
        `

        $("body").append( moreTooltip );
        $("body").append( sideMenu );
        $("body").append( searchBoxDiv );
        $("body").append( removeNonMediaDiv );
        genDatePicker()

        //testing Area

        //End testing Area
    })

//------------------------------  Append Footer menu & Search Box  ------------------------------//


//------------------------------  Sub function  ------------------------------//

    //-----  Download Image Function  -----//
        function downloadImage(imageLink){
            let fileName = imageLink.substring(imageLink.indexOf("media/")+6,imageLink.indexOf("?"))
            if(imageLink.indexOf('jpg') != -1){
                saveAs(imageLink,`${fileName}.jpg`)
            }
            else if(imageLink.indexOf('png') != -1){
                saveAs(imageLink,`${fileName}.png`)
            }
        }

    //-----  Change Link to Original Size Function  -----//
        function changeToOrigin(imageLink){
            //assign variable
            let link =""
            let pre = ""
            const extener = "?format=jpg&name=orig"
            const extener2 = "?format=png&name=orig"
            //end

            //change image to original size
            if(imageLink.indexOf(".jpg") >= 0){
                pre = imageLink.substring(0,imageLink.indexOf(".jpg"));
                link = pre + extener;
                }
            else if(imageLink.indexOf(".png")>=0){
                pre = imageLink.substring(0,imageLink.indexOf(".png"));
                link = pre + extener2;
            }
            return link;
        }

    //-----  Check Tweet Type Function  -----//
        function checkAll(parent,statusLink){
            let checkVideo = $(parent).find("div.AdaptiveMedia-videoContainer")
            let checkPhotos = $(parent).find("div.AdaptiveMedia-photoContainer")
            let checkQPhotos = $(parent).find("div.QuoteMedia-photoContainer")
            if(checkVideo.is(":visible") === true){
                return `
                <a href="http://twittervideodownloader.com" target="_blank">
                    <button class="btn download-video-site-btn status-tool-btn copyLinkBtn" data-url="${statusLink}">DL-Site</button>
                </a>`
            }
            if(checkPhotos.is(":visible") === true || checkQPhotos.is(":visible") === true){
                return `<button class="btn dl-img-in-this-tweet-btn  status-tool-btn"><i class="fas fa-download"></i> All</button>`
            }
            if (checkPhotos.is(":visible") === false && checkQPhotos.is(":visible") === false){
                return ``
            }
        }

    //-----  Add 0 to 1-digit Function -----//
        function pad(d){
            return (d < 10) ? '0' + d.toString() : d.toString();
        }

    //-----  Generate Date Picker Function  -----//
        function genDatePicker(){
            const month = [["01","01 Jan"],["02","02 Feb"],["03","03 Mar"],["04","04 Apr"],["05","05 May"],["06","06 Jun"],["07","07 Jul"],["08","08 Aug"],["09","09 Sep"],["10","10 Oct"],["11","11 Nov"],["12","12 Dec"]]
            for(let i = 1; i <= 31;i++){
                $("select.sDate").append(`<option value="${pad(i)}">${pad(i)}</option>`)
                $("select.fDate").append(`<option value="${pad(i)}">${pad(i)}</option>`)
            }
            for(let i = 0; i <12;i++){
                $("select.sMonth").append(`<option value="${month[i][0]}">${month[i][1]}</option>`)
                $("select.fMonth").append(`<option value="${month[i][0]}">${month[i][1]}</option>`)
            }
            for(let i = 2020; i >= 2006;i--){
                $("select.sYear").append(`<option value="${i}">${i}</option>`)
                $("select.fYear").append(`<option value="${i}">${i}</option>`)
            }
        }

    //-----  Extract User Account from Link Function  -----//
        function extractAccount() {
            let link = window.location.href
            if(link.indexOf("search") != -1){
                let newLink = link.substring(link.indexOf("from")+7,link.indexOf("since")-3)
                return newLink
            }
            else if(link.indexOf("media") == -1){
                return link.substring(link.indexOf("com/")+4)
            }
            else if(link.indexOf("media") != -1){
                return link.substring(link.indexOf("com/")+4,link.indexOf("media")-1)
            }
        }

//------------------------------  Sub function  ------------------------------//

//------------------------------  Event Handlers  ------------------------------//

    //-----  Interval Function  -----//

        //-----  Create Tool Box in tweets  -----//js-stream-
            setInterval(() => {
                $("div.tweet-tool-btn").remove();
                let timeStamp = $("small.time")
                $(".tweet").each(function(){
                    //filter media tweet
                    let videoChild = $(this).find(".AdaptiveMedia-video")
                    let photoChild = $(this).find("div.AdaptiveMedia-photoContainer")
                    let qoutePhotoChild = $(this).find("div.QuoteMedia-photoContainer")
                    let qouteVideoChild = $(this).find(".QuoteMedia-videoPreview")
                    //create tool box only for tweet with media
                    if($(photoChild).is(":visible") === true || $(videoChild).is(":visible") === true || $(qoutePhotoChild).is(":visible") === true || $(qouteVideoChild).is(":visible") === true){
                        let tweetStatusLink = "https://twitter.com" + $(this).find(timeStamp).find("a").attr("href")
                        let checkContent = checkAll($(this),tweetStatusLink)
                        $(this).find("div.js-tweet-text-container").after(`
                        <div class="tweet-tool-btn">
                        <button class="btn copyLinkBtn status-tool-btn" data-url="${tweetStatusLink}"><i class="far fa-clipboard"></i></button>
                        <button class="btn removeThisTweet status-tool-btn"><i class="far fa-trash-alt"></i></button>
                        ${checkContent}
                        </div>`);
                        let dropHere = $(this).find("div.tweet-tool-btn")
                        let parent = $(this).find("div.AdaptiveMedia-photoContainer")
                        let qParent = $(this).find("div.QuoteMedia-photoContainer")
                        $(parent).each(function(index,value) {
                                let imgLink = $(this).children("img").attr("src")
                                let originImg = changeToOrigin(imgLink)
                                $(dropHere).append(`
                                <button class="btn downloadImgBtn status-tool-btn" data-url="${originImg}">
                                    <font class="dlBtnFont">IMG ${index+1}</font>
                                </button>`)
                        })
                        $(qParent).each(function(index,value) {
                                let imgLink = $(this).children("img").attr("src")
                                let originImg = changeToOrigin(imgLink)
                                $(dropHere).append(`
                                <button class="btn downloadImgBtn status-tool-btn" data-url="${originImg}">
                                    <font class="dlBtnFont">IMG ${index+1}</font>
                                </button>`)
                        })
                    }

                })
            }, 5000);

        //-----  Highlight Tweet type  -----//
            setInterval(() => {
                let grandparent = $("li.js-stream-item")
                $(grandparent).each(function(){
                    let heartChild = $(this).find(".ProfileTweet-actionButton.js-actionButton.js-actionFavorite")
                    let videoChild = $(this).find(".AdaptiveMedia-video")
                    //-----  Liked Video Tweet  -----//
                    if($(heartChild).is(":hidden") === true && $(videoChild).is(":visible") === true){
                        $(this).find(".tweet").addClass("favVideoTweet")
                    }
                    //-----  Liked Tweet  -----//
                    else if($(heartChild).is(":hidden")=== true && $(videoChild).is(":visible") === false){
                        $(this).find(".tweet").addClass( "favTweet")
                    }
                    //-----  Video Tweet -----//
                    else if($(heartChild).is(":hidden") === false && $(videoChild).is(":visible") === true){
                        $(this).find(".tweet").addClass( "videoTweet")
                    }
                })
            }, 3000);

        //-----  Create Tool Box Button  -----//
        //$("body").on('click', '.createBtn', function(event) {
            setInterval(() => {
                $("div.button-img").remove();
                $("span.AdaptiveStreamGridImage").each(function(){
                    //assign variable
                    let imgUrl=$(this).attr("data-url");
                    let link ="";
                    const extener = "?format=jpg&name=orig";
                    const extener2 = "?format=png&name=orig";
                    //end

                    //change image to original size
                    if(imgUrl.indexOf(".jpg") >= 0){
                        let a = imgUrl.substring(0,imgUrl.indexOf(".jpg"));
                        link = a+extener;
                        }
                    else if(imgUrl.indexOf(".png")>=0){
                        let a2 = imgUrl.substring(0,imgUrl.indexOf(".png"));
                        link = a2+extener2;
                    }
                    //End
                    $(this).append(`
                    <div class="button-img">
                        <a href="`+link+`" target="_blank"><button class="btn openThisImg"><i class="fas fa-external-link-alt"></i></button></a>
                        <button class="btn removeThisImg"><i class="far fa-trash-alt"></i></button>
                        <button class="btn downloadImgBtn" data-url="${link}"><i class="fas fa-download"></i></button>
                    </div>`);
                });

            }, 3000);
        //});//Create Button


    //-----  Click event handlers  -----//

        //-----  Scroll Button  -----//
            //-----  Scroll Down Button  -----//
                $("body").on('click', '.scrollDownBtn', function(event) {
                    //window.scrollTo(0,document.body.scrollHeight);
                    window.scrollTo({
                        top: document.body.scrollHeight,
                        left: 0,
                        behavior: 'smooth'
                    })
                })

            //-----  Scroll Up Button -----//
                $("body").on('click', '.scrollUpBtn', function(event) {
                    //window.scrollTo(0,0);
                    window.scrollTo({
                        top: 0,
                        left: 0,
                        behavior: 'smooth'
                    })
                })

        //-----  Remove Photo Button  -----//
            $("body").on('click', '.removeThisImg', function(event) {
                $(this).parents('span.AdaptiveStreamGridImage').remove();
            })

        //-----  Open Photo in new tab button  -----//
            $("body").on('click', '.openbtn', function(event) {
                $("span.AdaptiveStreamGridImage").each(function(){
                    var url=$(this).attr("data-url")
                    window.open(url,"_blank")
                })
            })

        //-----  Count Photo Button  -----//
            $("body").on('click', '.countImgBtn', function(event) {
                let i = 0
                $("span.AdaptiveStreamGridImage").each(function(){
                    i=i+1
                });
                $("div[class*='photoContainer']").each(function(){
                    i=i+1
                })
                alert(`${i} Images in tweets in this page`)
            })

        //-----  Download All Images Button  -----//
            $("body").on('click', '.saveAllImgBtn', function(event){
                let parent = $("div.tweet div.AdaptiveMedia-photoContainer")
                let offset = 0;
                if(confirm("Want to download all images")){
                    //-----  Download All Images Profile page  -----//
                    if (window.location.href.indexOf("search")==-1) {
                        $(parent).each(function(){
                            setTimeout(() => {
                                let link = changeToOrigin( $(this).attr("data-image-url") )
                                downloadImage(link)
                            }, 500 + offset)
                            offset+=500;
                        })
                    }
                    //-----  Download All Images Search Page -----//
                    else {
                        $("span.AdaptiveStreamGridImage img").each(function(){
                            setTimeout(() => {
                                    let link = changeToOrigin($(this).attr("src"))
                                    downloadImage(link)
                            }, 500 + offset);
                            offset+=500;
                        })
                    }
                }
            })

        //-----  Count Favorite tweets  -----//
            $("body").on('click', '.countLikeBtn', function(event) {
                let heart = $(".ProfileTweet-actionButton.js-actionButton.js-actionFavorite")
                let unfavorite = $("a.unfavorite.js-tooltip")
                let i = 0;
                let mode = 1;

                //-----  count in search page  -----//
                if(window.location.href.indexOf("search")!= -1){
                    mode = 2;
                    $(unfavorite).each(function(){
                        if($(this).is(":visible")){
                            i++;
                        }
                    })
                    alert(`${i} Hearts`)
                }
                //-----  count in profile page  -----//
                else{
                    $(heart).each(function(){
                        if($(this).is(":hidden")){
                            i=i+1;
                        }
                    })
                    alert(`${i} Like Tweets`)
                }
            });

        //-----  Click all unfavorite Button  -----//
            $("body").on("click", ".unlikeBtn", function(event){
                let i = 0;
                let offset = 1000;
                //-----  unfavorite in profile page -----//
                if(window.location.href.indexOf("search")== -1){
                    if(confirm("Want to unfavorite?")){
                        setTimeout(() => {
                            var elems = $(".ProfileTweet-actionButton.js-actionButton.js-actionFavorite");
                            $(elems).each(function(){
                                if($(this).is(":visible")){
                                    $(this).parent().remove(); //Remove favorite buttons
                                }
                            })
                            let unlikeButton = $(".ProfileTweet-actionButton.js-actionButton.js-actionFavorite")
                            $(unlikeButton).each(function(){
                                $(this).trigger("click") //click on unfavorite buttons
                                $(this).closest(".js-stream-item").removeAttr( 'style' )
                                i=i+1;
                            })
                            alert(`Click ${i} unlike Tweets`);
                        }, 1000 + offset);
                        offset += 1000;
                    }
                }
                //-----  unfavorite in search page  -----//
                else {
                    if(confirm("Want to unfavorite?")){
                        setTimeout(() => {
                            $("a.favorite").each(function(){
                                if($(this).is(":visible")){
                                    $(this).remove(); //remove favorite buttons
                                }
                            })
                            $("a.unfavorite.js-tooltip").each(function(){
                                if($(this).is(":visible")){
                                    i++;
                                    $(this).trigger("click") //click on unfavorite buttons
                                }
                            })
                            alert(`unfavorite button ${i}`)
                        }, 1000 + offset);
                        offset += 1000;
                    }
                }
            });

        //-----  Remove not favorite tweets  -----//
            $("body").on('click', '.removenotLikeBtn', function(event) {
                window.scrollTo({
                    top: 0,
                    left: 0,
                    //behavior: 'smooth'
                });
                let offset = 0;
                    let heart = $(".ProfileTweet-actionButton.js-actionButton.js-actionFavorite")
                    $(heart).each(function(){
                        setTimeout(() => {
                            if($(this).is(":visible")){
                                $(this).closest(".js-stream-item").remove();
                            }
                        }, 200 + offset);
                        offset+=200;
                    })
            });

        //-----  Export All Photo Link to text file  -----//
            $("body").on("click", ".exportBtn", function(event){
                $("span.AdaptiveStreamGridImage").each(function(){
                    var url=$(this).attr("data-url");
                    imgLinkList.push(url+"\r\n");
                });
                console.log(imgLinkList);
                var blob = new Blob(imgLinkList,{ type: "text/plain;charset=utf-8" });
                saveAs(blob, "export.txt");
            });

        //-----  Download single photo button  -----//
            $("body").on("click",".downloadImgBtn", function(event){
                let dlLink = $(this).attr("data-url");
                let fileName = dlLink.substring(dlLink.indexOf("media/")+6,dlLink.indexOf("?"))
                if(dlLink.indexOf('jpg') != -1){
                    saveAs(dlLink,`${fileName}.jpg`)
                }
                else if(dlLink.indexOf('png') != -1){
                    saveAs(dlLink,`${fileName}.png`)
                }
            })

        //-----  Remove tweet button -----//
            $("body").on("click",".removeThisTweet", function(event){
                $(this).closest(".js-stream-item").remove();
            })

        //-----  Download all photos in tweet  -----//
            $("body").on("click",".dl-img-in-this-tweet-btn",function(event){
                let grandparent = $(this).closest(".tweet")
                //for tweet and retweet
                let parent = $(grandparent).find("div.AdaptiveMedia-photoContainer")
                //for qoute tweet
                let qParent = $(grandparent).find("div.QuoteMedia-photoContainer")
                //console.log(parent);
                let offset = 500;

                //For tweet and retweet
                $(parent).each(function() {
                    setTimeout(() => {
                        let imgLink = $(this).children("img").attr("src")
                        let originImg = changeToOrigin(imgLink)
                        downloadImage(originImg)
                    }, 0 + offset);
                    offset+=500;
                })

                //For qoute tweet
                $(qParent).each(function() {
                    setTimeout(() => {
                        let imgLink = $(this).children("img").attr("src")
                        let originImg = changeToOrigin(imgLink)
                        downloadImage(originImg)
                }, 0 + offset);
                offset+=500;
                })
            })

        //-----  Copy tweet link button  -----//
            $("body").on("click", ".copyLinkBtn", function(event){
                // Create new element
                var temp_input = document.createElement('textarea');
                // Set value (string to be copied)
                temp_input.value = $(this).attr("data-url");
                // Set non-editable to avoid focus and move outside of view
                temp_input.setAttribute('readonly', '');
                temp_input.style = {position: 'absolute', left: '-9999px'};
                document.body.appendChild(temp_input);
                // Select text inside element
                temp_input.select();
                // Copy text to clipboard
                document.execCommand('copy');
                // Remove temporary element
                document.body.removeChild(temp_input);
            })//Copy tweet link button

        //-----  Show / Hide Search Box  -----//
            $("body").on("click",".searchBoxBtn",function(event){
                if($(".searchBox").css("display") == "none"){
                    $(".searchBox").css("display", "flex");
                }
                else{$(".searchBox").css("display", "none");}
            })

        //-----  Search Box submit button  -----//
            $("body").on("click",".searchBtn",function(event){
                let name =  $("div.searchBox input").val()
                let searchType = $("input[name='sType']:checked").val();
                let sDate = $("select.sDate").children("option:selected").val();
                let sMonth = $("select.sMonth").children("option:selected").val();
                let sYear = $("select.sYear").children("option:selected").val();
                let fDate = $("select.fDate").children("option:selected").val();
                let fMonth = $("select.fMonth").children("option:selected").val();
                let fYear =$("select.fYear").children("option:selected").val();
                let link =`https://twitter.com/search?f=${searchType}&q=from%3A${name} since%3A${sYear}-${sMonth}-${sDate} until%3A${fYear}-${fMonth}-${fDate}&src=typd`
                window.location.href = link;
            })

        //----- Show / Hide Tooltips Box -----//
            $("body").on("click",".toolTipBoxBtn",function(event){
                if($(".sideTooltip").css("display") == "none"){
                    $(".sideTooltip").css("display", "grid");
                }
                else{$(".sideTooltip").css("display", "none");}
            })

        //----- Add favTweet when click like -----//
            $("body").on("click",".ProfileTweet-actionButton.js-actionButton.js-actionFavorite",function(event){
                let grandparent = $(this).parents(".js-stream-tweet")
                let videoChild = $(grandparent).find(".AdaptiveMedia-video")
                //-----  Click like video  -----//
                if($(videoChild).is(":visible")){
                    $(this).closest(grandparent).addClass( "favVideoTweet")
                }
                //-----  Click like tweet  -----//
                else{ $(this).closest(grandparent).addClass( "favTweet") }
            })

        //----- Remove favTweet when click unlike -----//
            $("body").on("click",".ProfileTweet-actionButtonUndo.ProfileTweet-action--unfavorite.u-linkClean.js-actionButton.js-actionFavorite",function(event){
                let parent = $(this).parents(".js-stream-tweet")
                //-----  remove fav Tweet class  -----//
                $(this).closest(".tweet").removeClass( "favTweet")
                //-----  remove fav video Tweet class  -----//
                $(this).closest(".tweet").removeClass( "favVideoTweet")
                //-----  add video tweet class  -----//
                if($(parent).find(".AdaptiveMedia-video").is(":visible")){$(this).closest(".tweet").addClass( "videoTweet")}
            })

        //----- Remove non media tweets automatic -----//
            $("body").on("click",".filterMediaTweetBtn",function(event){
                if(confirm("Want to Start?")){
                    alert("start operation");
                    let offset = 200;
                    let parent = $(".js-stream-item")
                        $(parent).each(function(){
                            setTimeout(() => {
                                let videoChild = $(this).find(".AdaptiveMedia-video")
                                let photoChild = $(this).find("div.content div.AdaptiveMediaOuterContainer div.AdaptiveMedia-photoContainer")
                                let qoutePhotoChild = $(this).find("div.content div.QuoteTweet div.QuoteMedia-container div.QuoteMedia-photoContainer")
                                let qouteVideoChild = $(this).find(".QuoteMedia-videoPreview")
                                if($(photoChild).is(":visible") === false && $(videoChild).is(":visible") === false && $(qoutePhotoChild).is(":visible") === false && $(qouteVideoChild).is(":visible") === false){
                                    $(this).remove();
                                }
                            }, 0 + offset);
                            offset+=200;
                        })

                }
                else{
                    alert("Cancel operation");
                }
            })
        //----- archive section -----//
        // $("body").on("click",".filterMediaTweetBtn",function(event){
        //     if($(".remove-non-media-box").css("display") == "none"){
        //         $(".remove-non-media-box").css("display", "grid");
        //     }
        //     else{$(".remove-non-media-box").css("display", "none");}
        // })
        // $("body").on("click",".startInBtn",function(event){
        //     if(confirm("Want to Start?")){
        //         alert("start operation");

        //         let parent = $(".js-stream-item")
        //         autoRemoveTweet = setInterval(() => {
        //             $(parent).each(function(){
        //                 let videoChild = $(this).find(".AdaptiveMedia-video")
        //                 let photoChild = $(this).find("div.content div.AdaptiveMediaOuterContainer div.AdaptiveMedia-photoContainer")
        //                 let qoutePhotoChild = $(this).find("div.content div.QuoteTweet div.QuoteMedia-container div.QuoteMedia-photoContainer")
        //                 let qouteVideoChild = $(this).find(".QuoteMedia-videoPreview")
        //                 if($(photoChild).is(":visible") === false && $(videoChild).is(":visible") === false && $(qoutePhotoChild).is(":visible") === false && $(qouteVideoChild).is(":visible") === false){
        //                     $(this).remove();
        //                 }
        //             })
        //         }, 3000);
        //     }
        //     else{
        //         alert("Cancel operation");
        //     }
        // })

        // $("body").on("click",".stopInBtn",function(event){
        //     clearInterval(autoRemoveTweet)
        //     alert("stop operation");
        // })
        //----- archive section -----//

//------------------------------  Event Handlers  ------------------------------//


//------------------------------  Junk function ------------------------------//
            $(document).ready(function(){
                $("h1.Icon--bird").css("display","none")
                $("form.form-search").attr("style","width: calc(100vw - 10vw);")
            })

    // End my Code
})();