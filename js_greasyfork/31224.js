// ==UserScript==
// @name         Sankaku Complex Enhancer
// @version      0.1
// @description  Adds additional features to SankakuComplex. Includes, infinite scrolling on the results page, option to filter out results with certain tags, automatically sorting results by quality (or other "order:*"), adds buttons next to tags to results page to add them to the current query,
// @author       Qwertanon
// @match        https://*.sankakucomplex.com/*
// @grant GM_notification
// @namespace https://greasyfork.org/users/13708
// @downloadURL https://update.greasyfork.org/scripts/31224/Sankaku%20Complex%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/31224/Sankaku%20Complex%20Enhancer.meta.js
// ==/UserScript==

//TODO:
//have Tooltip appear under every image so you can add or subtract char, show or artist
//Get tag description?
//Find a way to modify the search bar. (Replace it?)
//Link to add a new term but turn all other terms into -* except the order term.
//Change fancy tag names to be displayed as common names.
//Ignore implications
//Ignore aliases
//Add tag search bar
//Add sort by new when finished terms 
//Problem with correctly detecting finished terms



//===================
//== User Settings ==
//===================
//Resizes the image on post pages to fit inside the window.
var ResizeImage = true;
//Automatically adds the Order:____ tag to all tag links.
var AddOrderTag = true;
//If you are on a results page and the Order tag is not one of the currently searched tags, it will automatically redirect to a new results page with the order tag included.
var AutoRedirect = true;
//Tag to add. I suggest leaving Order alone. If you do want to replace order:quality all together, only replace Order and have OrderTag be "".
var Order = "order%3A";
//How you want the results to be ordered
//Check idol/chan . sankakucomplex.com/wiki/show?title=help:_quick_guide for order:* tags
var OrderTag = "quality";
//Show occasional alerts pertaining to the function of the script.
var Alerts = true;
//Changes the selected option on the tag search page. [Name/Count/Date/Popularity/Quality]
var TagPageOrder = "Count";
//Automatically redirects tag search results pages to include the new order type.
var AutoRedirectTagResults = true;
//If you are on a resutls page and the OptionalFilterTag is in the tagsidebar, it will automatically redirect to a new results page with OptionalFilterTag removed from the results
var OptionalFilter = false;
//Tag to remove if it's found as a popular tag in the results.
var OptionalFilterTag = "";
var OptionalFilterTagIdol = "";

//Array of tags that the user has already looked through completly.
var FinishedTerms = [];
//var FinishedTerms = ["Example1","Example2"];

//===================


if(window.location.href.indexOf("?tags=") != -1){
    var CurrentURL = window.location.href.replace("&commit=Search","");
    var regex_multipleplus = new RegExp("\\+{2,}", "g");
    //replace any occurance of "++", "+++", etc. in the URL with +.
    CurrentURL = CurrentURL.replace(regex_multipleplus,"+");
    CurrentURL = CurrentURL.replace("%20","+");
    //Check to see if the user is logged into the site and set the max amount of tags allowed to be searched.
    if(document.getElementById("navbar").childNodes[1].innerHTML.indexOf("My Account") != -1){
        var TagAllowence = 9;
    }else if (document.getElementById("navbar").childNodes[1].innerHTML.indexOf("login") != -1){
        var TagAllowence = 4;
    }
    TagGrabber();
    //Redirects to new results page with the Order tag added if it hasn't been already, the tag allowence hasn't been reached, and the user isn't on a specific page number.
    if(AutoRedirect && CurrentURL.indexOf(Order) == -1 && CurrentURL.indexOf("&page=") == -1 && TagArray.length < TagAllowence){
        location.assign(CurrentURL + "+" + Order + OrderTag);
    }
    if(OptionalFilter) OptionalFilterer();
    ResultsNumberGrabber();
    TitleTrimmer();
    TitleRenamer();
    ResultsPageTagSideBarEditor();
    if(TotalResults > 20){
        Pager();
    }
    InfoBarAdder();
}else if(window.location.href.indexOf("post/show/") != -1){
    AdblockFixer();
    if(AddOrderTag) PostPageTagSideBarEditor();
    if(ResizeImage) ImageResizer();
}else if(window.location.href.indexOf("/wiki/show?title=") != -1){   
    if(AddOrderTag){
        document.getElementsByClassName("title")[0].childNodes[3].href = document.getElementsByClassName("title")[0].childNodes[3].href + "+" + Order + OrderTag;
    }
}else if(window.location.href.indexOf("/tag/index?order=") != -1 || window.location.href.indexOf("/tag?commit=Search")){   
   /* console.log("Current page is a tags page.");
    if(AddOrderTag) TagsPageLinkEditor();
    TagPageSelectBoxModifier();
    if (AutoRedirectTagResults && window.location.href.indexOf(TagPageOrder) == -1){
        location.assign(window.location.href.substring(0,window.location.href.indexOf("&order=")+7) + TagPageOrder);
    }*/
}

function OptionalFilterer(){
    var TagSidebar = document.getElementById("tag-sidebar");
    if(window.location.href.indexOf("idol.sankakucomplex.com") !== -1){
        if(window.location.href.indexOf(OptionalFilterTagIdol) == -1){
            var TagLinks = TagSidebar.querySelectorAll('*[itemprop^="keywords"]');
            //var FilterURL = "idol.sankakucomplex.com/?tags=";
            for (i = 0; i < TagLinks.length; i++) {
                var CurrentIndexTag = TagLinks[i].href.substring(TagLinks[i].href.indexOf("?tags=")+6);
                if(CurrentIndexTag == OptionalFilterTagIdol){
                    if(TagArray.length < TagAllowence){
                        location.assign(CurrentURL + "+-" + OptionalFilterTagIdol);
                    }
                    break;
                }
            }
        }
    }else if(window.location.href.indexOf("chan.sankakucomplex.com") !== -1){
        if(window.location.href.indexOf(OptionalFilterTag) == -1){
            var TagLinks = TagSidebar.querySelectorAll('*[id^="tag_"]');
            //var FilterURL = "chan.sankakucomplex.com/?tags=";
            for (i = 0; i < TagLinks.length; i++) {
                var CurrentIndexTag = TagLinks[i].href.substring(TagLinks[i].href.indexOf("?tags=")+6);
                if(CurrentIndexTag == OptionalFilterTag){
                    if(TagArray.length < TagAllowence){
                        location.assign(CurrentURL + "+-" + OptionalFilterTag);
                    }
                    break;
                }
            }
        }
    }
}

function InfoBarAdder(){
    var UnderSearchBarElem = document.getElementById("ad_s_e_all");
    var EnabledOptionsButton = document.createElement("p");
    EnabledOptionsButton.innerHTML = "Enabled Settings [Hover]";
    UnderSearchBarElem.appendChild(EnabledOptionsButton);
    EnabledOptionsButton.onmouseover=function(){
        //GM_notification("AutoRedirect = "+AutoRedirect+"\n"+"AddOrderTag = "+AddOrderTag+"\n"+"Alerts = "+Alerts+"\n"+"OptionalFilter = "+OptionalFilter);
        EnabledOptionsButton.innerHTML = "Enabled Settings [Hover]"+"<br>"+"AutoRedirect = "+AutoRedirect+"<br>"+"AddOrderTag = "+AddOrderTag+"<br>"+"Alerts = "+Alerts+"<br>"+"OptionalFilter = "+OptionalFilter;
    };
    EnabledOptionsButton.onmouseout=function(){
        EnabledOptionsButton.innerHTML = "Enabled Settings [Hover]";
    }
}

function AdblockFixer(){
    var PostContentElem = document.getElementById("post-content");
    PostContentElem.style.paddingTop = "0px";
}

function ImageResizer(){
    var ImgElem = document.getElementById("image");
    ImgElem.style.height = "auto";
    ImgElem.style.width = ImgElem.width + "px";
    var ImgElemOrigWidth =  ImgElem.width;
    var SidebarElem = document.getElementsByClassName("sidebar")[0];
    if(window.innerWidth - SidebarElem.offsetWidth < ImgElemOrigWidth){
    ImgElem.style.width = window.innerWidth - SidebarElem.offsetWidth - 35 + "px";
    }
    window.addEventListener("resize", function(){
        //var ImgElemStyleWidthNoPx = ImgElem.style.width.replace("px","");
        //var ImgStyleWidth = parseInt(ImgElemStyleWidthNoPx);
        if(window.innerWidth - SidebarElem.offsetWidth <= ImgElemOrigWidth){
            ImgElem.style.width = window.innerWidth - SidebarElem.offsetWidth - 35 + "px";
        } 
    }, true);
}

function TagPageSelectBoxModifier(){
    var OrderBox = document.getElementById("order");
    switch (TagPageOrder) {
        case "Name":
            OrderBox.selectedIndex = 0;
            break;
        case "Count":
            OrderBox.selectedIndex = 1;
            break;
        case "Date":
            OrderBox.selectedIndex = 2;
            break;
        case "Popularity":
            OrderBox.selectedIndex = 3;
            break;
        case "Quality":
            OrderBox.selectedIndex = 4;
            break;
    }
}

//Add amount of results viewed out of total results.
function Pager(){
    (function(open) {
        XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
            this.addEventListener("readystatechange", function() {
                if(this.readyState == 1){
                    ContentElement = document.getElementById("post-list").childNodes[5];
                    ContentPages = ContentElement.getElementsByClassName("content-page");
                    var LastPage = parseInt(ContentPages[ContentPages.length - 1].getAttribute("next-page-url").slice(ContentPages[ContentPages.length - 1].getAttribute("next-page-url").indexOf("&page=")+6) - 1);
                    var PageSeperator = document.createElement("p");
                    PageSeperator.innerHTML = "<center><b><br>( " + LastPage * 20 + " / " + TotalResults + " )</b><br><br></center>";
                    var lastpagecontentpage = document.getElementById("content-page-" + LastPage);
                    lastpagecontentpage.childNodes[lastpagecontentpage.childNodes.length-1].appendChild(PageSeperator);
                }
            }, false);
            open.call(this, method, url, async, user, pass);
        };
    })(XMLHttpRequest.prototype.open);
}

function TagsPageLinkEditor(){
    var HighlightableClasses = document.getElementsByClassName("highlightable");
    var TagLinks = HighlightableClasses[0].getElementsByTagName('a');
    for (i = 0; i < TagLinks.length; i++) {
        if(TagLinks[i].href.indexOf("?tags=") != -1){
            TagLinks[i].href = TagLinks[i].href + "+" + Order + OrderTag;
        }
    }
}

function ResultsPageTagSideBarEditor(){
    var TagSidebar = document.getElementById("tag-sidebar");
    if(window.location.href.indexOf("idol.sankakucomplex.com") !== -1){
        var TagLinks = TagSidebar.querySelectorAll('*[itemprop^="keywords"]');
    }else if(window.location.href.indexOf("chan.sankakucomplex.com") !== -1){
        var TagLinks = TagSidebar.querySelectorAll('*[id^="tag_"]');
    }
    if(TagArray.length < TagAllowence){
        for (i = 0; i < TagLinks.length; i++) {
            var AddLink = document.createElement("a");
            var AddLinkText = document.createTextNode("+ ");
            var MinusLink = document.createElement("a");
            var MinusLinkText = document.createTextNode("- ");
            var ORLink = document.createElement("a");
            var ORLinkText = document.createTextNode("~ ");
            AddLink.appendChild(AddLinkText);
            MinusLink.appendChild(MinusLinkText);
            ORLink.appendChild(ORLinkText);
            var CurrentIndexTag = TagLinks[i].href.substring(TagLinks[i].href.indexOf("?tags=")+6);
            if(CurrentURL.indexOf(CurrentIndexTag) == -1){
                if(CurrentURL.indexOf(Order) == -1){
                    if(AddOrderTag && TagArray.length < TagAllowence - 1){
                        TagSidebar.childNodes[i+1].insertBefore(MinusLink,TagSidebar.childNodes[i+1].childNodes[0]);
                        TagSidebar.childNodes[i+1].insertBefore(AddLink,TagSidebar.childNodes[i+1].childNodes[0]);
                        TagSidebar.childNodes[i+1].insertBefore(ORLink,TagSidebar.childNodes[i+1].childNodes[0]);
                        if(AddOrderTag){
                            AddLink.href = CurrentURL + "+" + CurrentIndexTag + "+" + Order + OrderTag;
                            AddLink.href = AddLink.href.replace(/\++/g, "+");
                            MinusLink.href = CurrentURL + "+-" + CurrentIndexTag + "+" + Order + OrderTag;
                            MinusLink.href = MinusLink.href.replace(/\++/g, "+");
                            ORLink.href = CurrentURL + "+~" + CurrentIndexTag + "+" + Order + OrderTag;
                            ORLink.href = ORLink.href.replace(/\++/g, "+");
                        }else{
                            AddLink.href = CurrentURL + "+" + CurrentIndexTag;
                            AddLink.href = AddLink.href.replace(/\++/g, "+");
                            MinusLink.href = CurrentURL + "+-" + CurrentIndexTag;
                            MinusLink.href = MinusLink.href.replace(/\++/g, "+");
                            ORLink.href = CurrentURL + "+~" + CurrentIndexTag;
                            ORLink.href = ORLink.href.replace(/\++/g, "+");
                        }
                    }else{
                        TagSidebar.childNodes[i+1].insertBefore(MinusLink,TagSidebar.childNodes[i+1].childNodes[0]);
                        TagSidebar.childNodes[i+1].insertBefore(AddLink,TagSidebar.childNodes[i+1].childNodes[0]);
                        TagSidebar.childNodes[i+1].insertBefore(ORLink,TagSidebar.childNodes[i+1].childNodes[0]);
                        AddLink.href = CurrentURL + "+" + CurrentIndexTag;
                        AddLink.href = AddLink.href.replace(/\++/g, "+");
                        MinusLink.href = CurrentURL + "+-" + CurrentIndexTag;
                        MinusLink.href = MinusLink.href.replace(/\++/g, "+");
                        ORLink.href = CurrentURL + "+~" + CurrentIndexTag;
                        ORLink.href = ORLink.href.replace(/\++/g, "+");
                    }
                }else{
                    if(TagArray.length < TagAllowence){
                        TagSidebar.childNodes[i+1].insertBefore(MinusLink,TagSidebar.childNodes[i+1].childNodes[0]);
                        TagSidebar.childNodes[i+1].insertBefore(AddLink,TagSidebar.childNodes[i+1].childNodes[0]);
                        TagSidebar.childNodes[i+1].insertBefore(ORLink,TagSidebar.childNodes[i+1].childNodes[0]);
                        var NewURL = CurrentURL.replace(Order+OrderTag,"");
                        AddLink.href =  NewURL + "+" + CurrentIndexTag + "+" + Order + OrderTag;
                        AddLink.href = AddLink.href.replace(/\++/g, "+");
                        MinusLink.href =  NewURL + "+-" + CurrentIndexTag + "+" + Order + OrderTag;
                        MinusLink.href = MinusLink.href.replace(/\++/g, "+");
                        ORLink.href =  NewURL + "+~" + CurrentIndexTag + "+" + Order + OrderTag;
                        ORLink.href = ORLink.href.replace(/\++/g, "+");
                    }
                }
            }
            if(AddOrderTag){
                TagLinks[i].href = TagLinks[i].href + "+" + Order + OrderTag;
            }
        }
    }else if(TagArray.length >= TagAllowence && AddOrderTag){
        for (i = 0; i < TagLinks.length; i++) {
            TagLinks[i].href = TagLinks[i].href + "+" + Order + OrderTag;
        }
    }
}



//Edits the tag sidebar to add the order tag to all tag links.
function PostPageTagSideBarEditor(){
    var TagSidebar = document.getElementById("tag-sidebar");
    if(window.location.href.indexOf("idol.sankakucomplex.com") !== -1){
        var TagLinks = TagSidebar.querySelectorAll('*[itemprop^="keywords"]');
    }else if(window.location.href.indexOf("chan.sankakucomplex.com") !== -1){
        var TagLinks = TagSidebar.querySelectorAll('*[id^="tag_"]');
    }
    for (i = 0; i < TagLinks.length; i++) {
        TagLinks[i].href = TagLinks[i].href + "+" + Order + OrderTag;
    }
}

//Grabs all the tags in the URL an puts them in an array. 
function TagGrabber(){
    TagArray = CurrentURL.slice(CurrentURL.indexOf("?tags=")+6).split("+");
    if (Alerts && TagArray.length == TagAllowence) GM_notification("Maximum number of tags allowed to be searched has been reached.");
    for (var i = 0; i < TagArray.length; i++) {
        if (TagArray[i] === FinishedTerms[i]) {
            document.getElementById("header").innerHTML = document.getElementById("header").innerHTML+"<center><b><p style='font-size:40px'>TAG ALREADY COMPLETLY SEARCHED.</p></b></center>";
        }
    }
}

//Grabs the total number of results from the title.
function ResultsNumberGrabber(){ 
    var TitleElement = document.getElementById("site-title");
    var TagTypeNoneClasses = TitleElement.getElementsByClassName("tag-type-none");
    if(TagTypeNoneClasses.length > 0){
        //Grab the number at the end of the title.
        var Num = TagTypeNoneClasses[0].title.substring(12);
        //Remove any commas that may be in the number and convert it from a string to a integer.
        TotalResults = 1*Num.replace(/,/g, "");
        return;
    }else{
        var TagCountClasses = TitleElement.getElementsByClassName("tag-count");
        if(TagCountClasses.length == 1){
            //Grab the number at the end of the title.
            var Num = TagCountClasses[0].title.substring(12);
            //Remove any commas that may be in the number and convert it from a string to a integer.
            TotalResults = 1*Num.replace(/,/g, "");
            return;
        }
    }
    return;
}

function TitleTrimmer(){
    if(window.location.href.indexOf("idol.sankakucomplex.com") !== -1){
        document.title = document.title.substring(0,document.title.indexOf(' | Idol Complex'));
    }else if(window.location.href.indexOf("chan.sankakucomplex.com") !== -1){
        document.title = document.title.substring(0,document.title.indexOf(' | Sankaku'));
    }
}

//Renames the page title to add the number of results.
function TitleRenamer(){
    if(window.location.href.indexOf("&page=") != -1){
        var PageNum = 1*window.location.href.substring(window.location.href.indexOf("&page=")+6);
        var RemainingPosts = TotalResults - PageNum*20;
        if(RemainingPosts > 999){
            var TrimmedRemainingPosts = Math.floor(RemainingPosts / 1000);
            var TrimmedRemainingPostsString = TrimmedRemainingPosts.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            document.title = "(" + TrimmedRemainingPostsString + "k*)" + " " + document.title;
            return;
        }else{
            var RemainingPostsString = RemainingPosts.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            document.title = "(" + RemainingPostsString + "*)" + " " + document.title;
            return;
        }
    }else{
        if(TotalResults > 999){
            var TrimmedTotalResults = Math.floor(TotalResults / 1000);
            var TrimmedTotalResultsString = TrimmedTotalResults.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            document.title = "(" + TrimmedTotalResultsString + "k)" + " " + document.title;
            return;
        }else{
            var TotalResultsString = TotalResults.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            document.title = "(" + TotalResultsString + ")" + " " + document.title;
            return;
        }
    }
    return;
}

