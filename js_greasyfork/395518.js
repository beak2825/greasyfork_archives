// ==UserScript==
// @name        danbooru "you may like"
// @name:zh-CN        danbooru "you may like"
// @name:zh-TW        danbooru "you may like"
// @name:ja        danbooru "you may like"
// @namespace   danbooru_preference_push
// @supportURL  https://github.com/zhuzemin
// @description base visit history recommand posts
// @description:ja base visit history recommand posts
// @description:zh-TW  base visit history recommand posts
// @description:zh-CN base visit history recommand posts
// @include     https://danbooru.donmai.us/
// @include     https://danbooru.donmai.us/posts/*
// @version     1.11
// @grant       GM_xmlhttpRequest
// @grant         GM_registerMenuCommand
// @grant         GM_setValue
// @grant         GM_getValue
// @run-at      document-start
// @author      zhuzemin
// @license     Mozilla Public License 2.0; http://www.mozilla.org/MPL/2.0/
// @license     CC Attribution-ShareAlike 4.0 International; http://creativecommons.org/licenses/by-sa/4.0/
// @connect-src danbooru.donmai.us
// @downloadURL https://update.greasyfork.org/scripts/395518/danbooru%20%22you%20may%20like%22.user.js
// @updateURL https://update.greasyfork.org/scripts/395518/danbooru%20%22you%20may%20like%22.meta.js
// ==/UserScript==
var config = {
    'debug': false
}
var debug = config.debug ? console.log.bind(console)  : function () {
};

var hostname;
var ContentPane;
var ContentPaneChildNum;
var FilledChildNum;
var ObjectGalleryPage;
var ObjectGallery;
var VisitTags;
var FavTags;
var VisitLinks;
var BlackTags;
var DivCount;
var TotalPage;
class Gallery{
    constructor(href,other=null) {
        this.method = 'GET';
        this.url = href;
        this.headers = {
            'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
            'Referer': window.location.href,
        };
        this.charset = 'text/plain;charset=utf8';
        this.other=other;
    }
}
class GalleryPage{
    constructor(keyword,other=null) {
        this.method = 'GET';
        this.url = "https://"+hostname+"/posts?page="+keyword;
        this.headers = {
            'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
            'Referer': window.location.href,
        };
        this.charset = 'text/plain;charset=utf8';
        this.other=other;
    }
}

// prepare UserPrefs
setUserPref(
    'BlockTags',
    'multi-work series;translated;original;',
    'Set BlockTags',
    `These Tags will not be factor for recommand. split with ";". Example: multi-work series;translated;original`,
    ','
);

function init() {
    debug("init");
    VisitTags={};
    VisitLinks=[];
    try{
        VisitTags=JSON.parse(GM_getValue("VisitTags"));
        VisitLinks=GM_getValue("VisitLinks").split(",");
            BlackTags=GM_getValue("BlackTags");
    }catch(e){
        debug("Not VisitTags.");
    }
    if(BlackTags==undefined){
        BlackTags="";

    }
    debug("BlackTags: "+BlackTags);
    if(window.location.href.includes("https://danbooru.donmai.us/posts/")){
        if(!VisitLinks.includes(window.location.href)){
            VisitLinks.push(window.location.href);
            GM_setValue("VisitLinks",VisitLinks.toString());
            var taglist = document.querySelector('#sidebar');
            var links=taglist.querySelectorAll("a.search-tag");
            for(var link of links) {
                var tag = link.innerText;
                if(Object.keys(VisitTags).length>0){
                    var count=1;
                    for(var VisitTag of Object.keys(VisitTags)){
                        if(tag==VisitTag){
                            VisitTags[tag]+=1;
                            break;
                        }
                        else if(count==Object.keys(VisitTags).length){
                            VisitTags[tag]=1;
                        }
                        count++;
                    }
                }
                else{
                    VisitTags[tag]=1;
                }
            }
            GM_setValue("VisitTags",JSON.stringify(VisitTags));
        }
        debug("VisitTags: "+JSON.stringify(VisitTags));
    }
    else{
        CreateButton();
    }
}

function CreateButton(){
    var btn=document.createElement("button");
    btn.type="button";
    btn.onclick="";
    btn.innerHTML=`You may like`;
    btn.addEventListener('click',ShowRecommand);
    var p=document.querySelector("#subnav-menu");
    p.insertBefore(btn,null);
}

function  ShowRecommand() {
    debug("ShowRecommand");
    //window.location.href+="#E-Hentai_Display_Tag_with_thumb";
    FavTags=[];
    GetFavTag();
    debug(FavTags);
    CreateStyle();
    hostname=getLocation(window.location.href).hostname;
    ContentPane=document.querySelector("#posts-container");
    var articles=ContentPane.querySelectorAll("article");
    TotalPage=parseInt(articles[0].getAttribute("id").split("_")[1]);
    ContentPaneChildNum=articles.length;
    debug("ContentPaneChildNum: " +ContentPaneChildNum);
    FilledChildNum=0;
    //clear ContentPane
    while (ContentPane.firstChild) {
        ContentPane.removeChild(ContentPane.firstChild);
    }
    FillPane(TotalPage);
}

function FillPane(TotalPage){
    debug("FillPane");
    var RandomPage = Math.floor(Math.random() * (1000+1 - 0));
            //var RandomPage = Math.floor(Math.random() * (TotalPage/ContentPaneChildNum+1 - 0));
            ObjectGalleryPage=new GalleryPage(RandomPage);
    debug(ObjectGalleryPage.url);
    request(ObjectGalleryPage,SearchGallery);
}

function SearchGallery(responseDetails) {
    debug("SearchGallery");
    var responseText=responseDetails.responseText;
    var dom = new DOMParser().parseFromString(responseText, "text/html");
    var CurrentContentPane=dom.querySelector('#posts-container');
    var divs = CurrentContentPane.querySelectorAll('article');
    debug("divs.length: "+divs.length);
    DivCount=0;
    var href = divs[DivCount].querySelector('a').href;
    ObjectGallery = new Gallery(href,divs);
    //request(ObjectGallery,GetGalleryTag);
    GetGalleryTag(null,divs);
}

function GetGalleryTag(responseDetails,divs) {
    debug("GetGalleryTag");
    try{
        var div=divs[DivCount];
        //var responseText=responseDetails.responseText;
        //var dom = new DOMParser().parseFromString(responseText, "text/html");
        //var taglist = dom.querySelector('#tag-list');
        //var links=taglist.querySelectorAll("a.search-tag");
    //shuffle array
    var shuffle=function (sourceArray) {
        for (var i = 0; i < sourceArray.length - 1; i++) {
            var j = i + Math.floor(Math.random() * (sourceArray.length - i));

            var temp = sourceArray[j];
            sourceArray[j] = sourceArray[i];
            sourceArray[i] = temp;
        }
        return sourceArray;
    }
    
        var FavCount=parseInt(div.getAttribute("data-fav-count"));
        if(FavCount>=30){
        var links=div.getAttribute("data-tags").split(/\s/);
        var href=div.querySelector("a").href;
        var count=0;
        var Break;
    FavTags=shuffle(FavTags);
    debug("FavTags: "+FavTags);
        for(var link of links){
            if(FavTags==0){
                break;
            }
            var tag=link;
            //var tag=link.innerText;
            for(var FavTag of FavTags) {
                if(count>=12||count==FavTags.length){
                    if(!VisitLinks.includes(href) ){
                        ContentPane.insertBefore(div,null);
                        debug("Insert div");
                        debug("FilledChildNum: "+FilledChildNum);
                        count=0;
                        FilledChildNum++;
                        Break=true;
                        break;

                    }
                }
                else if (tag == FavTag.trim()) {
                    //debug("FavTag: " + FavTag);
                    //link.parentNode.className +=" glowbox";
                    count++;
                }
            }
            if(Break){break;}

        }
            
        }

    }
    catch(e){
        debug("Error: "+e);
    }
    if(FilledChildNum<=ContentPaneChildNum) {
        if (DivCount < divs.length-1) {
            if (FilledChildNum == ContentPaneChildNum) {
                debug("finish");
                return;
            }
            else if (FavTags.length == 0) {
                debug("Insert divs");
                for(div of divs){
                    ContentPane.insertBefore(div, null);
                    FilledChildNum++;

                }
            }
            else {
                debug("DivCount: " + DivCount);
                DivCount++;
                GetGalleryTag(null,divs);
            }
        }
        else {
            FillPane(TotalPage);
        }
    }
}

function JsonSort(VisitTags,Method){
    //convert object to array
    var sortable = [];
    for (var VisitTag in VisitTags) {
        if(VisitTag.match(/^\d*$/)==null){
        sortable.push([VisitTag, VisitTags[VisitTag]]);
            
        }
    }
    //sort by reverse
    sortable.sort(function(a, b) {
        return a[1] - b[1];
    }).reverse();
var array;
if(Method=="shuffle"){
    //shuffle array
    var shuffle=function (sourceArray) {
        for (var i = 0; i < sourceArray.length - 1; i++) {
            var j = i + Math.floor(Math.random() * (sourceArray.length - i));

            var temp = sourceArray[j];
            sourceArray[j] = sourceArray[i];
            sourceArray[i] = temp;
        }
        return sourceArray;
    }
    array=shuffle;
    
}
    else if (Method=="sort"){
        array=sortable;
    }

    //convert array to object
    var ArrayToObj=function (sortable){
        VisitTags={};
        sortable.forEach(function(item){
            VisitTags[item[0]]=item[1]
        })
        return VisitTags;
    }
    
    return ArrayToObj(array);
}

function GetFavTag(){

    VisitTags=JsonSort(VisitTags,"sort");
        debug("VisitTags: "+JSON.stringify(VisitTags));
    var count=0;
    for(var VisitTag of Object.keys(VisitTags)){
        if(VisitTags[VisitTag]==1){
            return;
        }
        else if(!BlackTags.includes(VisitTag.trim())){
            FavTags.push(VisitTag);
            if(count==Math.floor(Object.keys(VisitTags).length/3)) {
                //VisitTags too many, need shuffling
                if(VisitTags[VisitTag]>=Math.floor(Object.keys(VisitTags).length/3)){
                    VisitTags=JsonSort(VisitTags,"shuffle");
                    GM_setValue("VisitTags",JSON.stringify(VisitTags));
                }
                return;
            }
        }
        count++;
    }
}



function getLocation(href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
}


function request(object,func) {
    var retries = 10;
    GM_xmlhttpRequest({
        method: object.method,
        url: object.url,
        headers: object.headers,
        overrideMimeType: object.charset,
        //synchronous: true
        onload: function (responseDetails) {
            if (responseDetails.status != 200) {
                // retry
                if (retries--) {          // *** Recurse if we still have retries
                    setTimeout(request,2000);
                    return;
                }
            }
            //debug(responseDetails);
            //Dowork
            func(responseDetails,object.other);
        }
    })
}
function CreateStyle(){
    debug("Start: CreateStyle");
    var style=document.createElement("style");
    style.setAttribute("type","text/css");
    style.innerHTML=`
.glowbox {
     background: #4c4c4c; 
    //width: 400px;
    margin: 40px 0 0 40px;
    padding: 10px;
    -moz-box-shadow: 0 0 5px 5px #FFFF00;
    -webkit-box-shadow: 0 0 5px 5px #FFFF00;
    box-shadow: 0 0 5px 5px #FFFF00;
}
`;
    debug("Processing: CreateStyle");
    var head=document.querySelector("head");
    head.insertBefore(style,null);
    debug("End: CreateStyle");
}

// setting User Preferences
function setUserPref(varName, defaultVal, menuText, promtText, sep){
    GM_registerMenuCommand(menuText, function() {
        var val = prompt(promtText, GM_getValue(varName, defaultVal));
        if (val === null)  { return; }  // end execution if clicked CANCEL
        // prepare string of variables separated by the separator
        if (sep && val){
            var pat1 = new RegExp('\\s*' + sep + '+\\s*', 'g'); // trim space/s around separator & trim repeated separator
            var pat2 = new RegExp('(?:^' + sep + '+|' + sep + '+$)', 'g'); // trim starting & trailing separator
            //val = val.replace(pat1, sep).replace(pat2, '');
        }
        //val = val.replace(/\s{2,}/g, ' ').trim();    // remove multiple spaces and trim
        GM_setValue(varName, val);
        // Apply changes (immediately if there are no existing highlights, or upon reload to clear the old ones)
        //if(!document.body.querySelector(".THmo")) THmo_doHighlight(document.body);
        //else location.reload();
    });
}

if (document.body) init();
else window.addEventListener('DOMContentLoaded', init);

