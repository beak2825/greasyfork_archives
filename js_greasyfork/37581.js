// ==UserScript==
// @name         Failed ImageBoard Viewer/Downloader
// @version      20
// @description  A simple quick and dirty image viewer various imageboard sites
// @author       Mixed
// @include      *gelbooru.com*
// @include      *rule34.xxx*
// @include      *danbooru.donmai.us/*
// @include      *chan.sankakucomplex.com*
// @include      *idol.sankakucomplex.com*
// @connect      sankakucomplex.com
// @grant        GM_xmlhttpRequest

// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// @grant none

// @namespace https://greasyfork.org/en/users/161228
// @downloadURL https://update.greasyfork.org/scripts/37581/Failed%20ImageBoard%20ViewerDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/37581/Failed%20ImageBoard%20ViewerDownloader.meta.js
// ==/UserScript==


(function () {

    //Settings
    var StartImageHeight = 954;
    var AutoShowImageView = false;
    var DisableImageLinks = true;

    var urlChecks = {};
    var GetSrcForImg;
    var siteObj, defaultSiteObject;
    siteObj = siteObj;
    SetUpSiteSwitchObjs();

    //this group of vars is to be set by SetVars() and depends on the current website
    var buttonInsertionPoint, imgList, tagEntry, tagTypeLookup, postsJson, tagArray, postSources;


    var tagDictionary = {};

    siteObj.SetVars();
    siteObj.Startup();

    var imgIndex = 0;
    var imgOpened = false;

    var imgViewBtn = document.createElement("button");
    imgViewBtn.innerHTML = "Image View";
    imgViewBtn.onclick = ImgView;
    var dlAllBtn = document.createElement("button");
    dlAllBtn.innerHTML = "Download All";
    dlAllBtn.onclick = dlAll;

    //imgViewBtn.setAttribute("class", "active");
    buttonInsertionPoint.insertBefore(dlAllBtn, buttonInsertionPoint.childNodes[0]);
    buttonInsertionPoint.insertBefore(imgViewBtn, buttonInsertionPoint.childNodes[0]);

    var imgViewImg, videoImg, preloadImg1, preloadImg2, preloadImg3, preloadImg4;

    function ImgView() {
        if (imgOpened)
            return;

        var holdDiv = document.createElement("div");
        holdDiv.setAttribute("align", "center");
        buttonInsertionPoint.insertBefore(holdDiv, buttonInsertionPoint.childNodes[2]);

        imgViewImg = document.createElement("img");
        imgViewImg.setAttribute("height", StartImageHeight);
        holdDiv.appendChild(imgViewImg);
        videoImg = document.createElement("video");
        videoImg.setAttribute("height", StartImageHeight);
        videoImg.setAttribute("autoplay", true);
        videoImg.setAttribute("controls", true);
        videoImg.setAttribute("loop", true);
        videoImg.setAttribute("hidden", true);
        holdDiv.appendChild(videoImg);

        preloadImg1 = document.createElement("img");
        preloadImg2 = document.createElement("img");
        preloadImg1.setAttribute("hidden", true);
        preloadImg2.setAttribute("hidden", true);
        holdDiv.appendChild(preloadImg1);
        holdDiv.appendChild(preloadImg2);

        preloadImg3 = document.createElement("img");
        preloadImg4 = document.createElement("img");
        preloadImg3.setAttribute("hidden", true);
        preloadImg4.setAttribute("hidden", true);
        holdDiv.appendChild(preloadImg3);
        holdDiv.appendChild(preloadImg4);

        imgViewImg.addEventListener('load', DoPreload);

        imgViewImg.addEventListener('mousedown', ImageMouseDown);
        imgViewImg.addEventListener('mouseup', ImageMouseUp);
        imgViewImg.addEventListener('mousemove', ImageMouseMove);
        imgViewImg.addEventListener('mouseleave', ImageMouseLeave);

        videoImg.addEventListener('mousedown', ImageMouseDown);
        videoImg.addEventListener('mouseup', ImageMouseUp);
        videoImg.addEventListener('mousemove', ImageMouseMove);
        videoImg.addEventListener('mouseleave', ImageMouseLeave);

        prevBtn = document.createElement("button");
        prevBtn.innerHTML = "Prev";
        prevBtn.onclick = PrevImg;
        nextBtn = document.createElement("button");
        nextBtn.innerHTML = "Next";
        nextBtn.onclick = NextImg;
        dlBtn = document.createElement("button");
        dlBtn.innerHTML = "Download";
        dlBtn.onclick = DownloadCurrent;
        opBtn = document.createElement("button");
        opBtn.innerHTML = "Open Src";
        opBtn.onclick = OpenSrc;
        favBtn = document.createElement("button");
        favBtn.innerHTML = "Fav";
        favBtn.onclick = FavImg;
        unFavBtn = document.createElement("button");
        unFavBtn.innerHTML = "UnFav";
        unFavBtn.onclick = UnFav;
        spacer = document.createElement("img");
        spacer.setAttribute("width", 30);
        spacer2 = document.createElement("img");
        spacer2.setAttribute("width", 30);
        spacer3 = document.createElement("img");
        spacer3.setAttribute("width", 30);
        spacer4 = document.createElement("img");
        spacer5.setAttribute("width", 30);
        spacer5 = document.createElement("img");
        spacer4.setAttribute("width", 30);
        holdDiv.appendChild(document.createElement("br"));
        holdDiv.appendChild(prevBtn);
        holdDiv.appendChild(spacer);
        holdDiv.appendChild(favBtn);
        holdDiv.appendChild(spacer2);
        holdDiv.appendChild(unFavBtn);
        holdDiv.appendChild(spacer3);
        holdDiv.appendChild(dlBtn);
        holdDiv.appendChild(spacer4);
        holdDiv.appendChild(opBtn);
        holdDiv.appendChild(spacer5);
        holdDiv.appendChild(nextBtn);

        siteObj.posts.OnImgView();

        imgOpened = true;
        let header = document.getElementById("header");
        if (header)
            header.remove();
        header = document.getElementsByClassName("header")[0];
        if (header)
            header.remove();

        document.addEventListener("keydown", keyInput);
        SetImg();
    }

    if (AutoShowImageView)
        ImgView();

    function TagRequest(tagRequest) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let tagPageJson = xmlToJson(this.responseXML);

                siteObj.tags.TagDictionarySetup(tagPageJson);

                if (imgOpened)
                    SetNewTags();
            }
        };
        xhttp.open("GET", tagRequest, true);
        xhttp.send();
    }


    function OpenSrc() {
        window.open(imgList[imgIndex].getAttribute("openRef"));
    }

    function FavImg() {
        Danbooru.Favorite.create(/\/posts\/\d+/.exec(imgList[imgIndex].getAttribute("openRef"))[0].substr(7));
    }

    function UnFavImg() {
        Danbooru.Favorite.destroy(/\/posts\/\d+/.exec(imgList[imgIndex].getAttribute("openRef"))[0].substr(7));
    }

    function ImgClick(e) {
        if (!imgOpened)
            ImgView();

        var parentchildObj = {};
        siteObj.ImgClickGetChildAndParent(parentchildObj, e);

        // The equivalent of parent.children.indexOf(child)
        imgIndex = Array.prototype.indexOf.call(parentchildObj.parent, parentchildObj.child);
        SetImg();
        imgViewBtn.scrollIntoView();
    }

    function SetCurrentSrc() {
        currentSrc = GetSrcForImg(imgIndex);
        //console.log(currentSrc);
    }


    if (GetSrcForImg == undefined) {
        GetSrcForImg = function (getIndex) {
            if (postSources[getIndex]) {
                return postSources[getIndex];
            } else {
                var postReq = siteObj.posts.SinglePostSrc(getIndex);
                if (postReq == undefined)
                    return "";
                return postReq;
            }
        };
    }

    SetNewTags = function () {
        if (!tagArray)
            return;

        siteObj.tags.RemoveTags();
        siteObj.tags.AddTags();
        siteObj.tags.RemoveEmptyTags();
    };


    function SetImg() {
        SetCurrentSrc();
        if (currentSrc == "" || currentSrc == undefined) {
            imgViewImg.setAttribute("src", "");
            videoImg.setAttribute("src", "");
            return;
        }


        let dI = currentSrc.lastIndexOf(".");
        let fileExt = currentSrc.substring(dI + 1).split("?")[0];

        if (fileExt.toLowerCase() == "webm" || fileExt.toLowerCase() == "mp4") {
            videoImg.setAttribute("src", currentSrc);
            videoImg.removeAttribute("hidden");
            videoImg.play();
            imgViewImg.setAttribute("hidden", true);
            setTimeout(DoPreload, 200);
        } else {
            imgViewImg.setAttribute("src", "");
            imgViewImg.removeAttribute("hidden");
            videoImg.setAttribute("hidden", true);
            videoImg.pause();

            setTimeout(SetImageAfterTimeout, 1);
        }

        SetNewTags();
    }

    function SetImageAfterTimeout() {
        imgViewImg.setAttribute("src", currentSrc);
    }


    function DoPreload() {
        var preIndex = imgIndex + 1;
        if (preIndex >= imgList.length)
            preIndex = 0;
        preloadImg1.src = GetSrcForImg(preIndex);

        preIndex++;
        if (preIndex >= imgList.length)
            preIndex = 0;
        preloadImg2.src = GetSrcForImg(preIndex);

        preIndex = imgIndex - 1;
        if (preIndex < 0)
            preIndex = imgList.length - 1;
        preloadImg3.src = GetSrcForImg(preIndex);

        //preIndex--;
        //if(preIndex < 0)
        //    preIndex = imgList.length - 1;
        //preloadImg4.src = GetSrcForImg(preIndex);
    }

    function DownloadCurrent() {
        SetCurrentSrc();
        var dI = currentSrc.lastIndexOf(".");
        var uI = currentSrc.lastIndexOf("/") + 5;
        var fileExt = currentSrc.substring(dI);
        var imgName = "tags-" + tagEntry.value + " ";
        if (tagEntry.value === "") {
            imgName = currentSrc.substring(uI, dI);
        } else {
            imgName += currentSrc.substring(uI, dI);
        }
        imgName += " id-" + imgList[imgIndex].childNodes[0].getAttribute("id");
        imgName += fileExt;
        //console.log(imgName);
        var dl = document.createElement("a");
        dl.setAttribute("href", currentSrc);
        dl.setAttribute("download", imgName);
        dl.click();
        dl.remove();

        document.body.focus();
    }

    function dlAll() {
        var prevIndex = imgIndex;
        for (imgIndex = 0; imgIndex < imgList.length;) {
            try {
                DownloadCurrent();
                imgIndex++;
            } catch (ex) {
                console.log(ex);
                imgIndex++;
                //imgList[imgIndex].remove();
            }
        }

        imgIndex = prevIndex;
    }

    function exec(fn) {
        var tempScript = document.createElement('script');
        tempScript.setAttribute("type", "application/javascript");
        v.textContent = '(' + fn + ')();';
        document.body.appendChild(tempScript); // run the script
        document.body.removeChild(tempScript); // clean up
    }

    function keyInput(e) {
        if (document.activeElement != tagEntry) {
            if (e.keyCode === 32) {
                e.preventDefault();
                return false;
            }
            if (e.keyCode === 65) {
                e.preventDefault();
                PrevImg();
                return false;
            }
            if (e.keyCode === 68) {
                e.preventDefault();
                NextImg();
                return false;
            }
            if (e.keyCode === 221) {
                e.preventDefault();
                DownloadCurrent();
                return false;
            }
            if (e.keyCode === 70) {
                e.preventDefault();
                FavImg();
                return false;
            }
            if (e.keyCode === 71) {
                e.preventDefault();
                UnFavImg();
                return false;
            }
            if (e.keyCode === 83) {
                e.preventDefault();
                OpenSrc();
                return false;
            }
            if (e.keyCode === 86) {
                e.preventDefault();
                ImgView();
                return false;
            }
        }
    }

    function SetUpSiteSwitchObjs() {
        ///this is the object that controls what should be done for each individual website supported
        defaultSiteObject = {
            //the default here serves as a master obj so that code bits can be reused if certain websites
            //use similar layouts in areas. it is based on the gelbooru design.

            SetVars: function () {
                buttonInsertionPoint = document.getElementsByClassName("contain-push")[0];
                imgList = document.getElementsByClassName("thumb");
                tagEntry = document.getElementById("tags-search");
                postSources = Array(imgList.length);
                siteObj.posts.RemoveTextFillerElements();


                tagTypeLookup = {
                    0: "tag-type-general",
                    1: "tag-type-artist",
                    2: "tag-type-copyright",
                    3: "tag-type-copyright",
                    4: "tag-type-character"
                };
            },
            ImgClickGetChildAndParent: function (obj, e) {
                obj.child = e.target.parentNode.parentNode;
                obj.parent = imgList;
            },
            GetObjectProperty: function (obj, propName) {
                return obj["@attributes"][propName];
            },
            Startup: function () {
                siteObj.posts.DisableImageLinks();
                siteObj.posts.BatchPostApiCall();
            },
            posts: {
                postIdReplaceChar: "s",
                postLimit: 42,
                postPageIdName: "pid",
                postLimitName: "limit",
                postTagsName: "tags",
                postIdName: "id",
                postFileUrlName: "file_url",
                postApiEndpoint: "/index.php?page=dapi&s=post&q=index",
                addSiteNameToFileUrl: false,
                OnImgView: function () {

                },
                DisableImageLinks: function () {
                    for (let i = 0; i < imgList.length;) {
                        try {
                            if (!imgList[i].getAttribute("openRef")) {
                                let tmpAnchor = imgList[i].childNodes[0];
                                imgList[i].setAttribute("openRef", tmpAnchor.getAttribute("href"));
                                if (DisableImageLinks) {
                                    tmpAnchor.onclick = null;
                                    tmpAnchor.removeAttribute("onclick");
                                    tmpAnchor.removeAttribute("href");
                                    tmpAnchor.addEventListener("click", ImgClick);
                                }
                            }
                            i++;
                        } catch (ex) {
                            imgList[i].remove();
                        }
                    }
                },
                RemoveTextFillerElements: function () {
                    for (let i = 0; i < imgList.length;) {
                        if (imgList[i].tagName === undefined) {
                            imgList[i].remove();
                        } else {
                            i++;
                        }
                    }
                },
                BatchPostApiCall: function () {
                    var apiCallObj = getJsonFromUrl();
                    siteObj.posts.PostApiSelector(apiCallObj);

                    var xhttp = new XMLHttpRequest();

                    xhttp.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                            postsJson = xmlToJson(this.responseXML);

                            siteObj.posts.PostSourcesSelector(apiCallObj);

                            siteObj.tags.CreateTagBase();
                        }
                    };
                    xhttp.open("GET", apiCallObj.request, true);
                    xhttp.send();
                },
                HandlePageId: function (value) {
                    return value / this.postLimit;
                },
                PostApiSelector: function (apiObj) {
                    let pid = 0;
                    apiObj.postLimit = this.postLimit;
                    if (apiObj[this.postPageIdName]) {
                        pid = this.HandlePageId(apiObj[this.postPageIdName]);
                    }
                    let tags = encodeUriSpecial(tagEntry.value);
                    apiObj.request = this.postApiEndpoint + "&" + this.postLimitName + "=" + apiObj.postLimit
                    + "&" + this.postTagsName + "=" + tags + "&" + this.postPageIdName + "=" + pid;
                },
                PostsJsonGetPost: function (index) {
                    let tmpPost = postsJson.posts.post[index];
                    return tmpPost;
                },
                PostMismatch: function (apiObj, index) {
                    imgList[index].remove();
                    imgList[imgList.length - 1].remove();
                    apiObj.postLimit -= 2;
                    console.log("removed 1: " + apiObj.postLimit + " : " + imgList.length);
                },
                PostSourcesSelector: function (apiObj) {
                    apiObj.postOffset = 0;
                    for (let i = 0; i < apiObj.postLimit;) {
                        let tmpPost = siteObj.posts.PostsJsonGetPost(i + apiObj.postOffset);
                        if (!tmpPost)
                            break;
                        let tmpId = imgList[i].id;
                        tmpId = tmpId.replace(this.postIdReplaceChar, "");

                        if (siteObj.GetObjectProperty(tmpPost, "id") != tmpId) {
                            siteObj.posts.PostMismatch(apiObj, i);
                        } else {
                            postSources[i] = siteObj.GetObjectProperty(tmpPost, this.postFileUrlName);
                            if (siteObj.posts.addSiteNameToFileUrl)
                                postSources[i] = window.location.hostname + postSources[i];
                            i++;
                        }
                    }
                },
                GetSinglePostApiRequest: function (tmpId) {
                    let request = JsonHttpRequest(this.postApiEndpoint + "&" + this.postIdName + "=" + tmpId.toString());
                    return siteObj.GetObjectProperty(request, this.postFileUrlName);
                },
                SinglePostSrc: function (getIndex) {
                    var tmpId = imgList[getIndex][this.postIdName];
                    tmpId = tmpId.replace(this.postIdReplaceChar, "");
                    var tmpSrc = siteObj.posts.GetSinglePostApiRequest(tmpId);

                    postSources[getIndex] = tmpSrc;
                    return tmpSrc;
                }
            },
            tags: {
                tagApiEndpoint: "/index.php?page=dapi&s=tag&q=index&names=",
                maxTagApiCount: 99,
                logTagErrors: true,
                tagApiSplitChar: " ",
                tagsSplitChar: " ",
                tagsPropertyName: "tags",
                tagCategoryPropertyName: "type",
                tagCountPropertyName: "count",
                tagNamePropertyName: "name",
                GetTagSidebarElement: function () {
                    return document.getElementById("searchTags");
                },
                CreateTagBase: function () {
                    let uniqueTagList = [];
                    siteObj.tags.GetSplitTagsPerPost(uniqueTagList);
                    uniqueTagList = mergeDedupe(uniqueTagList);

                    siteObj.tags.TagApiSelector(uniqueTagList);
                },
                GetSplitTagsPerPost: function (uniqueTagList) {
                    for (var i = 0; i < imgList.length; i++) {
                        var currentPost = siteObj.posts.PostsJsonGetPost(i);
                        var tags = siteObj.GetObjectProperty(currentPost, this.tagsPropertyName).toLowerCase();
                        var splitTags = tags.split(this.tagsSplitChar);

                        uniqueTagList.push(splitTags);
                    }
                },

                TagApiSelector: function (uniqueTagList) {
                    var uniqueTagString = "";
                    var uniqueStringArray = [];
                    var usCount = 0;
                    for (i = 0; i < uniqueTagList.length; i++) {
                        if (usCount === 0) {
                            uniqueTagString += uniqueTagList[i];
                        } else {
                            uniqueTagString += this.tagApiSplitChar + uniqueTagList[i];
                        }
                        usCount++;
                        if (usCount > this.maxTagApiCount || i == uniqueTagList.length - 1) {
                            usCount = 0;
                            uniqueStringArray.push(uniqueTagString);
                            uniqueTagString = "";
                        }
                    }

                    for (i = 0; i < uniqueStringArray.length; i++) {
                        let request = this.tagApiEndpoint + encodeUriSpecial(uniqueStringArray[i]);
                        TagRequest(request);
                    }
                },
                GetTagJsonArray: function (tagJson) {
                    return tagJson.tags.tag;
                },
                TagDictionarySetup: function (tagsJson) {
                    let tmpArray = siteObj.tags.GetTagJsonArray(tagsJson);
                    if (!tagArray)
                        tagArray = tmpArray;
                    else {
                        tagArray = tagArray.concat(tmpArray);
                    }

                    for (i = 0; i < tmpArray.length; i++) {
                        tagDictionary[siteObj.GetObjectProperty(tmpArray[i], this.tagNamePropertyName).toLowerCase()] = tmpArray[i];
                    }
                },
                GetNodeIndex: function () {
                    return (window.location.hostname == "rule34.xxx") ? 4 : 7;
                },
                TagCountFormatter: function (count) {
                    var nCount = Number(count);
                    return nCount;
                },
                TagCloneNameSetter: function (tagClone, tagName) {
                    let nodeIndex = siteObj.tags.GetNodeIndex();
                    tagClone.childNodes[nodeIndex].innerHTML = tagName.replace(/_/g, " ");
                },
                TagCloneCountSetter: function (tagClone, tagCount) {
                    let nodeIndex = siteObj.tags.GetNodeIndex();
                    tagClone.childNodes[nodeIndex + 2].innerHTML = siteObj.tags.TagCountFormatter(tagCount);
                },
                AddTag: function (tagName, tagParent, tagToClone, stringToReplace) {
                    try {
                        var clonedTag = tagToClone.cloneNode(true);
                        tagParent.appendChild(clonedTag);
                        clonedTag.innerHTML = clonedTag.innerHTML.replaceAll("class=", "cla$$=");
                        clonedTag.innerHTML = clonedTag.innerHTML.replaceAll(stringToReplace, encodeUriSpecial(tagName));
                        clonedTag.innerHTML = clonedTag.innerHTML.replaceAll("cla$$=", "class=");

                        siteObj.tags.TagCloneNameSetter(clonedTag, tagName);

                        var jsonTag = tagDictionary[tagName];
                        var tagType = siteObj.GetObjectProperty(jsonTag, this.tagCategoryPropertyName);
                        var tagCount = siteObj.GetObjectProperty(jsonTag, this.tagCountPropertyName);

                        clonedTag.setAttribute("class", tagTypeLookup[tagType]);
                        siteObj.tags.TagCloneCountSetter(clonedTag, tagCount);
                    } catch (ex) {
                        if (this.logTagErrors) {
                            console.log("Failed tag: " + tagName);
                            console.log(ex);
                            console.log(tagDictionary);
                        }
                    }
                },
                FindStringToReplace: function (tag) {
                    let nodeIndex = siteObj.tags.GetNodeIndex();
                    return encodeUriSpecial(tag.childNodes[nodeIndex].innerHTML);
                },
                AddTags: function () {
                    let currentPost = siteObj.posts.PostsJsonGetPost(imgIndex);
                    let tags = siteObj.GetObjectProperty(currentPost, this.tagsPropertyName);
                    let splitTags = tags.split(this.tagsSplitChar);

                    let tagBar = siteObj.tags.GetTagSidebarElement();

                    let firstTag = tagBar.childNodes[0];

                    //let stringToReplace = firstTag.innerHTML.substring(firstTag.innerHTML.lastIndexOf("tags=") + 5, firstTag.innerHTML.lastIndexOf('</a>') - 3);
                    let stringToReplace = siteObj.tags.FindStringToReplace(firstTag).replace("%20", "_");

                    for (let i = 0; i < splitTags.length; i++) {
                        siteObj.tags.AddTag(splitTags[i], tagBar, firstTag, stringToReplace);
                    }

                    firstTag.remove();
                },
                RemoveTags: function () {
                    let tagBar = siteObj.tags.GetTagSidebarElement();
                    if (tagBar.childNodes[0].innerHTML === undefined) {
                        tagBar.childNodes[0].remove();
                    }
                    for (let i = tagBar.childNodes.length - 1; i >= 1; i--) {
                        tagBar.childNodes[i].remove();
                    }
                },
                RemoveEmptyTags: function () {
                    let tagBar = siteObj.tags.GetTagSidebarElement();
                    for (let i = tagBar.childNodes.length - 1; i >= 0; i--) {
                        let tAg = tagBar.childNodes[i];
                        try {
                            if (tAg.childNodes[4].innerHTML === "" || tAg.childNodes[7].innerHTML === "") {
                                tAg.remove();
                            }
                        } catch (ex) {

                        }
                    }
                }
            }
        };

        siteObj = cloneObject(defaultSiteObject);

        let hostName = window.location.hostname;
        //console.log(hostName + " : " + ());
        if (hostName.startsWith("danbooru.donmai"))
            hostName = "danbooru.donmai";
        if (hostName == "idol.sankakucomplex.com")
            hostName = "chan.sankakucomplex.com";

        //console.log(hostName);

        switch (hostName) {

            case "gelbooru.com":
                let tagBar = siteObj.tags.GetTagSidebarElement();
                let tagParent = tagBar.parentNode;

                tagParent.insertBefore(tagBar.childNodes[0], tagBar);
                tagParent.insertBefore(tagBar.childNodes[0], tagBar);
                tagParent.insertBefore(tagBar.childNodes[0], tagBar);
                tagParent.insertBefore(tagBar.childNodes[0], tagBar);
                tagParent.insertBefore(tagBar.childNodes[0], tagBar);

                break;

            case "rule34.xxx":
                siteObj.tags.logTagErrors = false;

                siteObj.tags.GetTagSidebarElement = function () {
                    return document.getElementById("tag-sidebar");
                };

                siteObj.SetVars = function () {
                    buttonInsertionPoint = document.getElementsByClassName("content")[0];
                    imgList = document.getElementsByClassName("thumb");
                    tagEntry = document.getElementById("tags");
                    postSources = Array(imgList.length);
                    siteObj.posts.RemoveTextFillerElements();

                    tagTypeLookup = {
                        0: "tag-type-general",
                        1: "tag-type-artist",
                        2: "tag-type-copyright",
                        3: "tag-type-copyright",
                        4: "tag-type-character"
                    };
                };

                break;


            case "danbooru.donmai":
                siteObj.SetVars = function () {
                    buttonInsertionPoint = document.getElementById("post-sections");
                    var postList = document.getElementById("posts");
                    imgList = postList.childNodes[1].childNodes;
                    tagEntry = document.getElementById("tags");
                    postSources = Array(imgList.length);
                    siteObj.posts.RemoveTextFillerElements();

                    tagTypeLookup = {
                        0: "category-0",
                        1: "category-1",
                        2: "category-2",
                        3: "category-3",
                        4: "category-4"
                    };
                };

                //danbooru post stuff
                siteObj.posts.postPageIdName = "page";
                siteObj.posts.postIdReplaceChar = "post_";
                siteObj.posts.postFileUrlName = "large-file-url";
                siteObj.posts.postApiEndpoint = "/posts.xml?";
                siteObj.posts.postLimit = 20;
                siteObj.posts.HandlePageId = function (value) {
                    return Number(value);
                };
                siteObj.GetObjectProperty = function (obj, propName) {
                    return obj[propName]["#text"];
                };
                siteObj.posts.GetSinglePostApiRequest = function (tmpId) {
                    let request = JsonHttpRequest("/posts/" + tmpId.toString() + ".xml?");
                    return siteObj.GetObjectProperty(request, siteObj.posts.postFileUrlName);
                };
                siteObj.posts.PostMismatch = function (apiObj, index) {
                    console.log(postsJson);
                    //imgList[index].remove();
                    apiObj.postLimit--;
                    apiObj.postOffset++;
                    console.log("removed 1: " + apiObj.postLimit + " : " + imgList.length);
                };

                //danbooru tag stuff
                siteObj.tags.tagApiEndpoint = "/tags.xml?search[name]=";
                siteObj.tags.tagApiSplitChar = ",";
                siteObj.tags.tagsPropertyName = "tag-string";
                siteObj.tags.tagCategoryPropertyName = "category";
                siteObj.tags.tagCountPropertyName = "post-count";
                siteObj.tags.maxTagApiCount = 19;
                siteObj.tags.GetTagSidebarElement = function () {
                    return document.getElementById("tag-box").childNodes[3];
                };
                siteObj.tags.FindStringToReplace = function (tag) {
                    let tmpStr = tag.childNodes[2].innerHTML.replace(/ /g, "_");
                    return encodeUriSpecial(tmpStr);
                };
                siteObj.tags.TagCloneNameSetter = function (tagClone, tagName) {
                    tagClone.childNodes[2].innerHTML = tagName.replace(/_/g, " ");
                };
                siteObj.tags.TagCountFormatter = function (count) {
                    var nCount = Number(count);
                    if (nCount < 1000) {
                        return nCount.toString();
                    } else if (nCount < 10000) {
                        return (nCount / 1000).toPrecision(2).toString() + "k";
                    } else {
                        nCount /= 1000;
                        return Math.round(nCount).toString() + "k";
                    }
                };
                siteObj.tags.TagCloneCountSetter = function (tagClone, tagCount) {
                    tagClone.childNodes[4].innerHTML = siteObj.tags.TagCountFormatter(tagCount);
                };

                break;


            case "chan.sankakucomplex.com":
                //sankaku posts stuff

                document.addEventListener("mousemove", function () {
                    siteObj.posts.BatchPostApiCall();
                });

                siteObj.SetVars = function () {
                    buttonInsertionPoint = document.getElementsByClassName("content")[0];
                    imgList = document.getElementsByClassName("thumb");
                    tagEntry = document.getElementById("tags");
                    postSources = Array(imgList.length);
                    siteObj.posts.RemoveTextFillerElements();

                    tagTypeLookup = {
                        0: "tag-type-general",
                        1: "tag-type-artist",
                        2: "tag-type-copyright",
                        3: "tag-type-copyright",
                        4: "tag-type-character"
                    };

                    postSources = {};
                    if (document.getElementById("recommended"))
                        buttonInsertionPoint = document.getElementById("recommended");
                };

                GetSrcForImg = function (getIndex) {
                    let tmpImg = imgList[getIndex].childNodes[0].childNodes[0];
                    let srcIndex = tmpImg.src;

                    if (postSources[srcIndex]) {
                        return postSources[srcIndex];
                    } else {
                        var postReq = siteObj.posts.SinglePostSrc(getIndex);
                        if (postReq == undefined)
                            return "";
                        return postReq;
                    }
                };

                let redirectCheck = function (response) {
                    //console.log("rdc: " + response.finalUrl);
                    return !response.finalUrl.includes("redirect.png");
                };

                siteObj.posts.SinglePostSrc = function (index) {
                    let tmpImg = imgList[index].childNodes[0].childNodes[0];
                    let srcIndex = tmpImg.src;

                    if (postSources[srcIndex] === undefined) {
                        let tmpUrl = tmpImg.src;
                        tmpUrl = tmpUrl.replace("/preview/", "/").replace("c.sank", "cs.sank").replace("i.sank", "is.sank");
                        tmpUrl = tmpUrl.substring(0, tmpUrl.lastIndexOf("."));
                        let tmpId = "?" + imgList[index].id.substring(1);
                        let tmpTags = tmpImg.getAttribute("title");
                        tmpTags = tmpTags.substring(0, tmpTags.lastIndexOf("Rating:"));

                        if (tmpTags.includes("animated") || tmpTags.includes("video") || tmpTags.includes("mp4") || tmpTags.includes("webm") || tmpTags.includes("animated_gif")) {
                            if (tmpTags.includes("mp4")) {
                                //AsyncUrlCheck(tmpUrl + ".mp4", index, redirectCheck);
                                postSources[srcIndex] = tmpUrl + ".mp4" + tmpId;
                            } else if (tmpTags.includes("webm")) {
                                //AsyncUrlCheck(tmpUrl + ".webm", index, redirectCheck);
                                postSources[srcIndex] = tmpUrl + ".webm" + tmpId;
                            } else if (tmpTags.includes("animated_gif")) {
                                //AsyncUrlCheck(tmpUrl + ".gif", index, redirectCheck);
                                postSources[srcIndex] = tmpUrl + ".gif" + tmpId;
                            } else {
                                NoApiFindUrlAsync(index, srcIndex, tmpUrl, true, tmpId, redirectCheck);
                            }
                            return postSources[srcIndex];
                        } else {
                            NoApiFindUrlAsync(index, srcIndex, tmpUrl, false, tmpId, redirectCheck);
                        }
                    } else {
                        return postSources[srcIndex];
                    }
                };

                siteObj.posts.BatchPostApiCall = function () {
                    siteObj.posts.DisableImageLinks();
                    //let tCount = 0;
                    //for (let i = 0; i < imgList.length; i++) {
                    //    let tSrc = siteObj.posts.SinglePostSrc(i);
                    //    if(tSrc !== undefined){
                    //        tCount++;
                    //    }
                    //}
                    //console.log(tCount + "/" + imgList.length);
                };

                break;

        }

        //end switch setup
    }


    //----------everything below here is either utility or is pretty set in stone-------------------

    function encodeUriSpecial(str) {
        return encodeURIComponent(str).replace(/\(/g, "%28").replace(/\)/g, "%29");
    }

    Element.prototype.remove = function () {
        if (this)
            this.parentElement.removeChild(this);
    };

    //String.prototype.replaceAll = function (search, replacement) {
    //    var target = this;
    //    return target.replace(new RegExp(search, 'g'), replacement);
    //};

    String.prototype.replaceAll = function (search, replacement) {
        var target = this;
        return target.split(search).join(replacement);
    };


    function mergeDedupe(arr) {
        return [...new Set([].concat(...arr))];
    }

    function PrevImg() {
        imgIndex--;
        if (imgIndex < 0)
            imgIndex = imgList.length - 1;
        SetImg();
    }

    function NextImg() {
        imgIndex++;
        if (imgIndex >= imgList.length)
            imgIndex = 0;
        SetImg();
    }

    var imgMouseDown = false;
    var imgDownPosX, imgDownPosY, imgDownHeight = 0;

    function ImageMouseDown(e) {
        e.preventDefault();
        imgMouseDown = true;
        imgDownPosX = e.screenX;
        imgDownPosY = e.screenY;
        imgDownHeight = Number(imgViewImg.getAttribute("height"));
        return false;
    }

    function ImageMouseUp(e) {
        e.preventDefault();
        imgMouseDown = false;
        return false;
    }

    function ImageMouseMove(e) {
        if (imgMouseDown) {
            e.preventDefault();
            var moveDist = e.screenY - Number(imgDownPosY);
            imgViewImg.setAttribute("height", imgDownHeight + moveDist * 2);
            videoImg.setAttribute("height", imgDownHeight + moveDist * 2);
            return false;
        }
    }

    function ImageMouseLeave(e) {
        e.preventDefault();
        imgMouseDown = false;
        return false;
    }

    function getJsonFromUrl() {
        var query = location.search.substr(1);
        var result = {};
        query.split("&").forEach(function (part) {
            var item = part.split("=");
            result[item[0]] = decodeURIComponent(item[1]);
        });
        return result;
    }

    function cloneObject(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        let temp = obj.constructor(); // give temp the original obj's constructor
        for (let key in obj) {
            temp[key] = cloneObject(obj[key]);
        }

        return temp;
    }

    function AsyncHtmlDocHandler(index, callback) {
        try {
            let url = imgList[index].getAttribute("openRef");

            var xhr = new XMLHttpRequest();

            xhr.onload = function () {
                if (this.status === 200 && this.readyState == 4 && callback && typeof( callback ) === 'function') {
                    callback(this.response);
                }
            };

            xhr.open('GET', url);
            xhr.responseType = 'document';
            xhr.send();
        } catch (ex) {

        }
    }

    function NoApiFindUrlAsync(index, srcIndex, url, checkAnimated = false, append = "", extraCheck = function (r) {
        return true;
    }) {
        if (urlChecks[url])
            return;
        urlChecks[url] = {
            jpg: null,
            jpeg: null,
            png: null,
            gif: null,
            mp4: null,
            webm: null,
            abortAll: function () {
                if (this.jpg)
                    this.jpg.abort();
                if (this.jpeg)
                    this.jpeg.abort();
                if (this.png)
                    this.png.abort();
                if (this.gif)
                    this.gif.abort();
                if (this.mp4)
                    this.mp4.abort();
                if (this.webm)
                    this.webm.abort();

                jpg = null;
                jpeg = null;
                png = null;
                gif = null;
                mp4 = null;
                webm = null;
            }
        };
        if (!checkAnimated) {
            AsyncUrlCheck(url, append, index, srcIndex, "jpg", extraCheck);
            AsyncUrlCheck(url, append, index, srcIndex, "jpeg", extraCheck);
            AsyncUrlCheck(url, append, index, srcIndex, "png", extraCheck);
        } else {
            AsyncUrlCheck(url, append, index, srcIndex, "mp4", extraCheck);
            AsyncUrlCheck(url, append, index, srcIndex, "gif", extraCheck);
            AsyncUrlCheck(url, append, index, srcIndex, "webm", extraCheck);
        }
    }

    function AsyncUrlCheck(url, append, index, srcIndex, ext, extraCheck) {
        let modUrl = url + "." + ext + append;
        try {
            urlChecks[url][ext] = GM_xmlhttpRequest({
                method: "HEAD",
                url: modUrl,
                onreadystatechange: function (response) {
                    if (response.status == 0)
                        return;

                    if (response.status == 200 && extraCheck(response)) {
                        //urlChecks[url] = false;
                        //console.log(response.readyState +" : " + response.status + " : " + response.finalUrl);
                        console.log("got: " + modUrl);
                        postSources[srcIndex] = modUrl;
                        if (imgOpened && imgIndex == index) {
                            SetImg();
                        }
                        urlChecks[url].abortAll();
                    } else if (response.status == 404) {
                        console.log("not found: " + modUrl);
                        urlChecks[url][ext].abort();
                    } else {
                        console.log("something else: " + response.status + " : " + response.readyState + " : " + response.finalUrl);
                        urlChecks[url] = null;
                    }
                }
            });
        } catch (ex) {
            console.log(ex);
            urlChecks[url] = null;
        }
    }

    function JsonHttpRequest(urlRequest) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", urlRequest, false);
        xhr.send();
        return xmlToJson(xhr.responseXML);
    }

    // Changes XML to JSON
    function xmlToJson(xml) {

        // Create the return object
        var obj = {};

        if (xml.nodeType == 1) { // element
            // do attributes
            if (xml.attributes.length > 0) {
                obj["@attributes"] = {};
                for (var j = 0; j < xml.attributes.length; j++) {
                    var attribute = xml.attributes.item(j);
                    obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                }
            }
        } else if (xml.nodeType == 3) { // text
            obj = xml.nodeValue;
        }

        // do children
        if (xml.hasChildNodes()) {
            for (var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                var nodeName = item.nodeName;
                if (typeof(obj[nodeName]) == "undefined") {
                    obj[nodeName] = xmlToJson(item);
                } else {
                    if (typeof(obj[nodeName].push) == "undefined") {
                        var old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(xmlToJson(item));
                }
            }
        }
        return obj;
    }


})
();