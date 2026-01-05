// ==UserScript==
// @name           Pixiv Download Helper
// @name:zh        Pixiv 下载助手
// @name:ja        ダウンロードヘルパー
// @description    Add download button or link for the Pixiv original picture in view page
// @description:zh 为 Pixiv 图片阅览页增加下载原图按钮或链接
// @description:ja Pixiv作品ダウンロードヘルパー
// @namespace      https://github.com/Sg4Dylan/PixivDownloadHelper
// @icon           https://www.pixiv.net/favicon.ico
// @include        http://www.pixiv.net/*
// @include        https://www.pixiv.net/*
// @grant          GM_xmlhttpRequest
// @grant          GM_setValue
// @grant          GM_getValue
// @connect        i.pximg.net
// @connect        i1.pixiv.net
// @connect        i2.pixiv.net
// @connect        i3.pixiv.net
// @connect        i4.pixiv.net
// @connect        i5.pixiv.net
// @version        2018.04.22.0(just merge code & deprecated)
// @downloadURL https://update.greasyfork.org/scripts/29371/Pixiv%20Download%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/29371/Pixiv%20Download%20Helper.meta.js
// ==/UserScript==

//Turn thumbnail titles into direct links (single images) or mode=manga links.  Some kinds of thumbnails aren't covered, and an isolated few (like #17099702) don't work.
var directTitles = false;

//Append direct links below images on mode=manga pages
var directManga = true;

//Force pixiv's 'book view' style for manga sequences to something like the normal view.  Clicking a page won't scroll the window to the next page.
var breakBookView = false;

//Replace the medium thumbnail on mode=medium pages with the full size.  The image will be relinked to the full size regardless of this setting.
var fullSizeMedium = true;

//Disable lazy loading images.  These appear on mode=manga pages, rankings, and the "Recommended" section of the bookmarks page.
var dontSayLazy = true;

//Text for Button & link
var mangaModeLang = [["Right click \"Save As\" to download, file name: "], ["名前をつけて保存、ファイル名："], ["下载请使用右键“链接另存为”保存，文件名："]];
var normalModeLangZero = [["Direct download", "Right click \"Save As\" to download"], ["直接ダウンロード", "名前をつけて保存"], ["直接下载", "使用右键链接另存为"]];
var saveFileNameFormat = [["<tr> <th> Pixiv Download Helper<br>setting<br> <a name=\"saveSetting\" class=\"btn_type01\">Save setting</a> </th> <td> <dl> <dt>format of saving file name</dt> <dd> <label><input type=\"radio\" name=\"pdh0\" value=\"fmt0\" checked>[author name][illustrate name]</label><br> <label><input type=\"radio\" name=\"pdh0\" value=\"fmt1\">[author name][illustrate name][pixiv id]</label><br> <label><input type=\"radio\" name=\"pdh0\" value=\"fmt2\">[author name][pixiv id]</label><br> <label><input type=\"radio\" name=\"pdh0\" value=\"fmt3\">[illustrate name][pixiv id]</label> </dd> <dt>split mode</dt> <dd> <label><input type=\"radio\" name=\"pdh1\" value=\"spl0\" checked>[Name][Name]</label><br> <label><input type=\"radio\" name=\"pdh1\" value=\"spl1\">【Name】【...】</label><br> <label><input type=\"radio\" name=\"pdh1\" value=\"spl2\">Name - Name</label><br> <label><input type=\"radio\" name=\"pdh1\" value=\"spl3\">Name ~ Name</label> </dd> </dl> </td> </tr>","script setting saved"], ["<tr> <th> Pixivダウンロードヘルパー設定<br> <a name=\"saveSetting\" class=\"btn_type01\">設定を保存する</a> </th> <td> <dl> <dt>ファイル名を保存する形式</dt> <dd> <label><input type=\"radio\" name=\"pdh0\" value=\"fmt0\" checked>[author name][illustrate name]</label><br> <label><input type=\"radio\" name=\"pdh0\" value=\"fmt1\">[author name][illustrate name][pixiv id]</label><br> <label><input type=\"radio\" name=\"pdh0\" value=\"fmt2\">[author name][pixiv id]</label><br> <label><input type=\"radio\" name=\"pdh0\" value=\"fmt3\">[illustrate name][pixiv id]</label> </dd> <dt>スプリットモード</dt> <dd> <label><input type=\"radio\" name=\"pdh1\" value=\"spl0\" checked>[Name][Name]</label><br> <label><input type=\"radio\" name=\"pdh1\" value=\"spl1\">【Name】【...】</label><br> <label><input type=\"radio\" name=\"pdh1\" value=\"spl2\">Name - Name</label><br> <label><input type=\"radio\" name=\"pdh1\" value=\"spl3\">Name ~ Name</label> </dd> </dl> </td> </tr>","スクリプト設定が保存されました"], ["<tr> <th> Pixiv 下载助手设置<br> <a name=\"saveSetting\" class=\"btn_type01\">保存插件设置</a> </th> <td> <dl> <dt>设置保存格式</dt> <dd> <label><input type=\"radio\" name=\"pdh0\" value=\"fmt0\" checked>[author name][illustrate name]</label><br> <label><input type=\"radio\" name=\"pdh0\" value=\"fmt1\">[author name][illustrate name][pixiv id]</label><br> <label><input type=\"radio\" name=\"pdh0\" value=\"fmt2\">[author name][pixiv id]</label><br> <label><input type=\"radio\" name=\"pdh0\" value=\"fmt3\">[illustrate name][pixiv id]</label> </dd> <dt>设置分割方式</dt> <dd> <label><input type=\"radio\" name=\"pdh1\" value=\"spl0\" checked>[Name][Name]</label><br> <label><input type=\"radio\" name=\"pdh1\" value=\"spl1\">【Name】【...】</label><br> <label><input type=\"radio\" name=\"pdh1\" value=\"spl2\">Name - Name</label><br> <label><input type=\"radio\" name=\"pdh1\" value=\"spl3\">Name ~ Name</label> </dd> </dl> </td> </tr>","插件设置保存成功"]];

//----------------------------------------------------------------//

var fullSizeWidth = "740px";

if( typeof(custom) != "undefined" )
    custom();

if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  };
}

if( location.search.indexOf("mode=manga_big") > 0 || location.search.indexOf("mode=big") > 0 )
{
    //Make the 'big'/'manga_big' image link to itself instead of closing the window
    console.log("Mode=manga_big");
    let image = document.getElementsByTagName("img")[0];
    if( image )
    {
        let link = document.createElement("a");
        link.href = image.src;
        link.appendChild( document.createElement("img") ).src = image.src;
        document.body.innerHTML = "";
        document.body.appendChild( link );
    }
}
else if( location.search.indexOf("mode=manga") > 0 )
{
    console.log("Mode=manga");
    let container = document.getElementsByClassName("full-size-container");
    if( directManga && container.length )
    {
        //Check the mode=manga_big page for the first page, since the sample extension is always "jpg".
        let req = new XMLHttpRequest();
        req.open( "GET", location.href.replace(/page=\d+&?/,'').replace('mode=manga','mode=manga_big&page=0'), true );
        req.onload = function()
        {
            console.log("Pixiv Download Helper Patch ver 0.1 by SgDylan.");
            console.log("Parsing download link...");
            let firstImage = req.responseXML.querySelector("img[src*='_p0.']").src;
            for( let i = 0; i < container.length; i++ )
            {
                console.log("Getting link...");
                var sourcePictureLink = firstImage.replace( "_p0.", "_p"+i+"." );
                var extName = "." + sourcePictureLink.split(".").pop(-1);
                authorName = document.getElementsByClassName("breadcrumbs")[0].children[1].children[0].innerHTML.split(">")[1];
                illustName = document.getElementsByClassName("breadcrumbs")[0].children[2].children[0].children[0].innerHTML;
                FileName = filenameConcater(authorName, illustName, i) + extName;
                console.log("File name: "+FileName);
                console.log("File Link: "+sourcePictureLink);
                console.log("Put download link");
                let link = document.createElement("a");
                link.textContent = multiLang(0, 0)+FileName;
                link.style.display = "block";
                link.href = sourcePictureLink;
                link.download = FileName;
                container[i].parentNode.appendChild( link );
            }
            console.log("All Ready !");
        };
        req.responseType = "document";
        req.send(null);
    }
    else if( breakBookView && document.head.innerHTML.indexOf("pixiv.context.images") > 0 )
    {
        //Book view (e.g. #54139174, #57045668)

        console.log("Mode=bookview");
        let mangaSection = document.createElement("section");
        mangaSection.className = "manga";

        let scripts = document.head.getElementsByTagName("script");
        let hits = 0;
        for( let i = 0; i < scripts.length; i++ )
        {
            let urls = scripts[i].innerHTML.match( /pixiv.context.images[^"]+"([^"]+)".*pixiv.context.originalImages[^"]+"([^"]+)"/ );
            if( urls )
            {
                let full = urls[2].replace( /\\\//g, "/");
                mangaSection.innerHTML += '<div class="item-container"><a href="'+full+'" class="full-size-container"><i class="_icon-20 _icon-full-size"></i></a><img style="width:auto;height:auto;max-width:1200px;max-height:1200px" src="'+full+'" class="image">'+( directManga ? '<a href="'+full+'" style="display:block">direct link</a>' : '' )+'</div>';
                hits++;
            }
        }

        if( hits > 0 )
        {
            let sheet = document.createElement("link");
            sheet.setAttribute("rel","stylesheet");
            sheet.setAttribute("href","http://source.pixiv.net/www/css/member_illust_manga.css");
            document.head.appendChild( sheet );
            document.getElementsByTagName("html")[0].className = "verticaltext no-textcombine no-ie";
            document.body.innerHTML = "";
            document.body.appendChild( mangaSection );
        }
    }
}
else if( window == window.top )//not inside iframe
{
    if( directTitles )
    {
        //Link dem titles.
        linkThumbTitles([document]);
        new MutationObserver( function(mutationSet)
        {
            mutationSet.forEach( function(mutation){ linkThumbTitles( mutation.addedNodes ); } );
        }).observe( document.body, { childList:true, subtree:true } );
    }

    let worksDisplay = document.getElementsByClassName("works_display")[0];
    if( worksDisplay )
    {
        let mainImage, fullsizeSrc = 0, mainLink = worksDisplay.querySelector("a[href*='mode=']");
        if( mainLink )
            mainLink.removeAttribute('target');//Make link open in same window

        let oClass = document.getElementsByClassName("original-image");
        let downloadButton = document.getElementsByClassName("bookmark-container")[0];
        if( oClass.length == 1 )//47235071
        {
            let worksDiv = worksDisplay.getElementsByTagName("div")[0];
            worksDisplay.removeChild( worksDiv );//Need to remove instead of hide to prevent double source search links in other script
            let link = worksDisplay.insertBefore( document.createElement("a"), worksDisplay.firstChild );
            mainImage = link.appendChild( fullSizeMedium ? document.createElement("img") : worksDiv.getElementsByTagName("img")[0] );
            fullsizeSrc = link.href = oClass[0].getAttribute("data-src");
            //Add button to page
            if( fullSizeMedium )
            {
                console.log("Pixiv Download Helper Patch ver 0.1 by SgDylan.");
                console.log("Parsing download link...");
                let dButton0 = downloadButton.insertBefore( document.createElement("a"), downloadButton.firstChild );
                let dButton1 = downloadButton.insertBefore( document.createElement("a"), downloadButton.firstChild );
                console.log("Getting link...");
                let sourcePictureLink = oClass[0].getAttribute("data-src");
                let extName = "." + sourcePictureLink.split(".").pop(-1);
                authorTagList = document.getElementsByClassName("user-name");
                authorName = "";
                for (let index=0; index<authorTagList.length; index++) {
                    if (authorTagList[index].tagName=="A" && authorTagList[index].classList.value=="user-name") {
                        authorName = authorTagList[index].innerHTML;
                    }
                }
                let FileName = filenameConcater(authorName, document.getElementsByClassName("title")[1].innerHTML) + extName;
                console.log("File name: "+FileName);
                console.log("File Link: "+sourcePictureLink);
                console.log("Prepare right click button");
                dButton0.className = "_bookmark-toggle-button add-bookmark";
                dButton0.innerHTML = "<span class=\"description\">"+multiLang(1, 1)+"</span>";
                dButton0.download = FileName;
                dButton0.href = sourcePictureLink;
                console.log("Prepare right click button - Done !");
                // Prepare direct click button
                let retry_count = 0;
                get_blob_obj();
                function get_blob_obj() {
                    console.log("Prepare direct click button");
                    console.log("Preparing download file...");
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: sourcePictureLink,
                        responseType: "blob",
                        timeout: 6000,
                        ontimeout: function() {
                            console.log("Timeout");
                            retry_count++;
                            if(retry_count<6) get_blob_obj();
                        },
                        onerror: function() {
                            console.log("Error");
                            retry_count++;
                            if(retry_count<6) get_blob_obj();
                        },
                        onload: function(response){
                            dButton1.className = "_bookmark-toggle-button add-bookmark";
                            dButton1.innerHTML = "<span class=\"description\">"+multiLang(1, 0)+"</span>";
                            dButton1.download = FileName;
                            dButton1.href = URL.createObjectURL(response.response);
                            console.log("Prepare direct click button - Done !");
                            console.log("All Ready !");
                        }
                    });
                }
            }
        }
        else if( mainLink && mainLink.href.indexOf("mode=big") > 0 && (mainImage = mainLink.getElementsByTagName("img")[0]) !== null )//17099702
        {
            //New thumbnails are always jpg, need to query mode=big page to get the right file extension.
            console.log("Mode=big");
            let req = new XMLHttpRequest();
            req.open( "GET", mainLink.href, true );
            req.onload = function()
            {
                mainLink.href = req.responseXML.getElementsByTagName("img")[0].src;
                if( fullSizeMedium ) {
                    mainImage.src = mainLink.href;
                }
            };
            req.responseType = "document";
            req.send(null);
        }

        if( mainImage && fullSizeMedium )
        {
            if( fullsizeSrc )
                mainImage.src = fullsizeSrc;
            mainImage.setAttribute("style", "max-width: "+fullSizeWidth+"; height: auto; width: auto;");
            worksDisplay.style.width = fullSizeWidth;
        }
    }
}

if( dontSayLazy && unlazyImage() && window == window.top )
{
    //Initial page has lazy images; listen for more images added later
    new MutationObserver( function(mutationSet)
    {
        mutationSet.forEach( function(mutation)
        {
            for( let i = 0; i < mutation.addedNodes; i++ )
                unlazyImage( mutation.addedNodes[i] );
        } );
    }).observe( document.body, { childList:true, subtree:true } );
}

//----------------------------------------------------------------//

if ( location.href.indexOf('setting_user.php') > 0 ) {
    // add some options
    appendSwitchChildren = document.getElementsByTagName('tr');
    appendSwitchParent = appendSwitchChildren[appendSwitchChildren.length-1].parentNode;
    switchOption = document.createElement('tr');
    switchOption.innerHTML = multiLang(2,0);
    appendSwitchParent.insertBefore(switchOption, appendSwitchParent.childNodes[appendSwitchChildren.length-1]);
    // bind button
    document.getElementsByName("saveSetting")[0].addEventListener('click', saveScriptSetting, false);
}

function saveScriptSetting() {
    for(let index=0; index<4; index++) {
        if(document.getElementsByName("pdh0")[index].checked) {
            GM_setValue("concatFmt", index);
            break;
        }
    }
    for(let index=0; index<4; index++) {
        if(document.getElementsByName("pdh1")[index].checked) {
            GM_setValue("splitFmt", index);
            break;
        }
    }
    alert(multiLang(2,1));
}

function filenameConcater(author_name, ill_name, index_num) {
    name_template = "";
    ill_id = "ID:" + getQueryString("illust_id");
    template_two = ["[{0}][{1}]","【{0}】【{1}】","{0} - {1}","{0} ~ {1}"];
    template_three = ["[{0}][{1}][{2}]","【{0}】【{1}】【{2}】","{0} - {1} - {2}","{0} ~ {1} ~ {2}"];
    template_index = ["[{0}]","【{0}】","- {0}","~ {0}"];
    if (GM_getValue("concatFmt", 0)==1) {
        name_template = template_three[GM_getValue("splitFmt", 0)].format(author_name, ill_name, ill_id);
        if (index_num) {
            name_template += template_index[GM_getValue("splitFmt", 0)].format(index_num);
        }
        return name_template;
    }
    switch(GM_getValue("splitFmt", 0)) {
        case 2:
            name_template = template_two[2].format(author_name, ill_id);
            break;
        case 3:
            name_template = template_two[3].format(ill_name, ill_id);
            break;
        default:
            name_template = template_two[0].format(author_name, ill_name);
    }
    if (index_num) {
        name_template += template_index[GM_getValue("splitFmt", 0)].format(index_num);
    }
    return name_template;
}

function getQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);
    if (r !== null) return unescape(r[2]); return null;
}

//----------------------------------------------------------------//

function multiLang(mode, position) {
    lang_mode = 0;
    localUsingLang = navigator.language;
    if(!localUsingLang) {
        localUsingLang = navigator.languages[0];
    }
    if(localUsingLang.indexOf("zh") !== -1) {
        lang_mode = 2;
    } else if(localUsingLang.indexOf("ja") !== -1) {
        lang_mode = 1;
    } else {
        lang_mode = 0;
    }
    switch(mode) {
        case 0:
            return mangaModeLang[lang_mode][position];
        case 1:
            return normalModeLangZero[lang_mode][position];
        case 2:
            return saveFileNameFormat[lang_mode][position];
        default:
            break;
    }
}

function unlazyImage(target)
{
    let images = ( target || document ).querySelectorAll("img[data-src]");
    for( let i = 0; i < images.length; i++ )
        images[i].src = images[i].getAttribute("data-src");
    return images.length;
}

function pushTitleLink(list, link)
{
    let matcher;
    if( link && link.href && (matcher = link.href.match(/illust_id=(\d+)/)) && matcher[1] > 0 )
        list.push({ "id": matcher[1], "link": link });
}

function linkThumbTitles(targets)
{
    let titleList = [];

    for( let i = 0; i < targets.length; i++ )
        if( targets[i] == document || targets[i].nodeType == Node.ELEMENT_NODE )
        {
            //search.php
            let foundTitle = targets[i].querySelectorAll("a[href*='mode=medium'][href*='illust_id='][title]");
            for( let j = 0; j < foundTitle.length; j++ )
                pushTitleLink( titleList, foundTitle[j] );

            //bookmark.php, member_illust.php, new_illust.php, member.php (uploads), mypage.php (new works)
            foundTitle = targets[i].querySelectorAll("a[href*='mode=medium'][href*='illust_id='] > .title");
            for( let j = 0; j < foundTitle.length; j++ )
                pushTitleLink( titleList, foundTitle[j].parentNode );

            //ranking.php
            foundTitle = targets[i].querySelectorAll(".ranking-item a.title[href*='mode=medium'][href*='illust_id=']");
            for( let j = 0; j < foundTitle.length; j++ )
                pushTitleLink( titleList, foundTitle[j] );

            //member_illust.php (what image was responding to)
            foundTitle = targets[i].querySelector(".worksImageresponseInfo a.response-out-work[href*='mode=medium'][href*='illust_id=']");
            if( foundTitle )
                pushTitleLink( titleList, foundTitle );

            //response.php, member_illust.php (before/after thumbnails), ?member.php (bookmarks)?
            let image = targets[i].querySelectorAll("li a[href*='mode=medium'][href*='illust_id='] img");
            for( let j = 0; j < image.length; j++ )
            {
                let page, title;
                for( page = image[j].parentNode; page.tagName != "A"; page = page.parentNode );

                //The prev/next thumbnails on mode=medium pages have text before/after the image.  Text also follows the image on image responses listings.
                if( !(title = page.getElementsByClassName("title")[0]) && (title = page.lastChild).nodeName != '#text' && (title = page.firstChild).nodeName != '#text' )
                    continue;//Can't find title element

                //Start title link at mode=medium and change later.
                let titleLink = document.createElement("a");
                titleLink.href = page.href;
                titleLink.style.color = "#333333";//Style used on some pages

                //Move the title out of the thumbnail link
                page.removeChild(title);
                titleLink.appendChild(title);
                page.parentNode.insertBefore( titleLink, page.nextSibling );

                pushTitleLink( titleList, titleLink );
            }
	}

    for( let i = 0; i < titleList.length; i++ )
        directLinkSingle( titleList[i] );
}

//Query an image's mode=medium page.
function directLinkSingle(title)
{
    let req = new XMLHttpRequest();
    req.open( "GET", location.protocol+"//www.pixiv.net/member_illust.php?mode=medium&illust_id="+title.id, true );
    req.onload = function()
    {
        let select = req.responseXML.getElementsByClassName("original-image");
        if( select.length == 1 )
            title.link.href = select[0].getAttribute("data-src");
        else if( (select = req.responseXML.querySelector(".works_display a[href*='mode=manga']")) !== null )
        {
            title.link.href = select.href;
            let page = req.responseXML.querySelectorAll("ul.meta li")[1].textContent.match(/(\d+)P$/);
            if( page )
                ( title.link.firstChild.nodeName == '#text' ? title.link : title.link.firstChild ).title += " ("+page[1]+" pages)";
        }
    };
    req.responseType = "document";
    req.send(null);
}
