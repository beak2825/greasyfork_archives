// ==UserScript==
// @name        e-hentai base history recommand gallerys
// @name:ja        e-hentai base history recommand gallerys
// @name:zh-TW         e-hentai base history recommand gallerys
// @name:zh-CN        e-hentai base history recommand gallerys
// @namespace   e-hentai_preference_push
// @supportURL  https://github.com/zhuzemin
// @description record your favorite tags, use to search gallerys
// @description:zh-CN record your favorite tags, use to search gallerys
// @description:zh-TW  record your favorite tags, use to search gallerys
// @description:ja record your favorite tags, use to search gallerys
// @include     https://exhentai.org/
// @include     https://e-hentai.org/
// @include     https://exhentai.org/?*
// @include     https://e-hentai.org/?*
// @include     https://exhentai.org/tag/*
// @include     https://e-hentai.org/tag/*
// @include     https://exhentai.org/g/*
// @include     https://e-hentai.org/g/*
// @version     1.42
// @grant       GM_xmlhttpRequest
// @grant         GM_registerMenuCommand
// @grant         GM_setValue
// @grant         GM_getValue
// @run-at      document-start
// @author      zhuzemin
// @license     Mozilla Public License 2.0; http://www.mozilla.org/MPL/2.0/
// @license     CC Attribution-ShareAlike 4.0 International; http://creativecommons.org/licenses/by-sa/4.0/
// @connect-src e-hentai.org
// @connect-src exhentai.org
// @downloadURL https://update.greasyfork.org/scripts/394998/e-hentai%20base%20history%20recommand%20gallerys.user.js
// @updateURL https://update.greasyfork.org/scripts/394998/e-hentai%20base%20history%20recommand%20gallerys.meta.js
// ==/UserScript==
var config = {
    'debug': false
}
var debug = config.debug ? console.log.bind(console)  : function () {
};

//default matching tags number
var defaultMatchTagNum=8;
var defaultBlockTags='multi-work series;translated;original;chinese;english;mosaic censorship;anthology';
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
var btn;
class Gallery{
    constructor(href,other=null) {
        this.method = 'GET';
        this.url = href;
        this.headers = {
            'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
            'Accept': 'application/atom+xml,application/xml,text/xml',
            'Referer': window.location.href,
        };
        this.charset = 'text/plain;charset=utf8';
        this.other=other;
    }
}
class GalleryPage{
    constructor(keyword) {
        this.method = 'GET';
        this.url = window.location.href.replace(/&page=\d*/,'').replace(/$|(\?|page=\d*)/,"?page="+keyword);
        this.headers = {
            'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
            'Accept': 'application/atom+xml,application/xml,text/xml',
            'Referer': window.location.href,
        };
        this.charset = 'text/plain;charset=utf8';
        this.other=null;
    }
}

// prepare UserPrefs
setUserPref(
    'BlockTags',
    defaultBlockTags,
    "Tags that won't be fctor for reacommand",
    `These Tags will not be factor for recommand. split with ";". Example: multi-work series;translated;original`,
    ','
);

// prepare UserPrefs
setUserPref(
    'matchTagsNum',
    defaultMatchTagNum,
    'How many tags has be matching',
    `Number more bigger then result will be more precise, but more slower.`,
    ','
);

function init() {
    debug("init");
    VisitTags;
    VisitLinks;
    try{
        VisitTags=JSON.parse(GM_getValue("VisitTags"));
        VisitLinks=GM_getValue("VisitLinks").split(",");
        BlackTags=GM_getValue("BlockTags");
    }catch(e){
        debug("Not VisitTags.");
    }
    if(BlackTags==undefined||BlackTags.length ==0){
        BlackTags=defaultBlockTags;

    }
    if(VisitTags==undefined||VisitTags.length ==0){
        VisitTags={};

    }
    if(VisitLinks==undefined||VisitLinks.length ==0){
        VisitLinks=[];

    }
    debug("BlackTags: "+BlackTags);
    if(window.location.href.match(/(https:\/\/e(-|x)hentai\.org\/g\/[\d\w]*\/[\d\w]*\/)/)!=null){
        if(!VisitLinks.includes(window.location.href)){
            VisitLinks.push(window.location.href);
            GM_setValue("VisitLinks",VisitLinks.toString());
            var taglist = document.querySelector('#taglist');
            var links=taglist.querySelectorAll("a");
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
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
[data-tooltip]:before {
    /* needed - do not touch */
    content: attr(data-tooltip);
    position: absolute;
    opacity: 0;
    
    /* customizable */
    transition: all 0.15s ease;
    padding: 10px;
    color: #333;
    border-radius: 10px;
    box-shadow: 2px 2px 1px silver;    
}

[data-tooltip]:hover:before {
    /* needed - do not touch */
    opacity: 1;
    
    /* customizable */
    background: yellow;
    margin-top: -50px;
    margin-left: 20px;    
}
    `;
    document.getElementsByTagName('head')[0].appendChild(style);
    btn=document.createElement("button");
    btn.type="button";
    btn.onclick="";
    btn.setAttribute('data-tooltip','Also you can use the filter')
    btn.innerHTML=`You may like`;
    btn.addEventListener('click',ShowRecommand);
    var p=document.querySelector("p.nopm");
    p.insertBefore(btn,null);
}
function SetExtended(){
    hostname=getLocation(window.location.href).hostname;
    var select=document.querySelector("select");
    var options=select.querySelectorAll("option");
    for(var option of options){
        var value=option.getAttribute("value");
        var selected=option.getAttribute("selected");
        if(value=="e"){
            if(selected=="selected"){
                break;
            }
            else{
                alert("Page will set to Extended view, After refresh click button again.")
                window.location.href="https://"+hostname+"/?inline_set=dm_"+value;
            }
        }
    }

}
function ShowRecommand(e) {
    e.target.innerHTML="Searching...";
    matchTagNum=GM_getValue('matchTagsNum')||defaultMatchTagNum;
    debug('matchTagNum: '+matchTagNum)
    debug("ShowRecommand");
    //window.location.href+="#E-Hentai_Display_Tag_with_thumb";
    FavTags=[];
    GetFavTag();
    debug('FavTag: '+FavTags);
    if(FavTags.length==0){
        alert('Current record tags number: 0, so will just recommand ramdom gallery.')
    }
    CreateStyle();
    SetExtended();
    var div=document.querySelector("div.ido");
    div.style="max-width:1370px";
    var table=document.querySelector("table.itg.glte");
    var tbody=table.querySelector("tbody");
    tbody.className="itg gld";
    tbody.style="width:1323px";
    ContentPane=tbody;
    ContentPaneChildNum=ContentPane.childNodes.length;
    FilledChildNum=0;
    //clear ContentPane
    while (ContentPane.firstChild) {
        ContentPane.removeChild(ContentPane.firstChild);
    }
    FillPane();
}

function FillPane(TotalPage){
    var table=document.querySelector("table.ptt");
    var tds=table.querySelectorAll("td");
    var TotalPage=parseInt(tds[tds.length-2].firstChild.innerText);
    debug('TotalPage: '+TotalPage)
    var RandomPage = Math.floor(Math.random() * (TotalPage+1 - 0));
    ObjectGalleryPage=new GalleryPage(RandomPage);
    debug("RandomPage: "+ObjectGalleryPage.url);
    request(ObjectGalleryPage,SearchGallery);
}

function GetGalleryTag(responseDetails,divs) {
    debug("GetGalleryTag");
    try{
        var tr=divs[DivCount];
        var count=0;
        var Break;
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
        var div = tr.querySelector("div.gl4e.glname");
        table = div.childNodes[1].querySelector("table");
        var href=tr.querySelector("a").href;
        debug("href: "+href);
        if (table != null) {
            FavTags=shuffle(FavTags);
            //debug("FavTags: "+FavTags);
            var links = table.querySelectorAll("div");
            for (var link of links) {
                if (FavTags == 0) {
                    break;
                }
                var tag = link.innerText;
                for (var FavTag of FavTags) {
                    if (count >= parseInt(matchTagNum) || count == FavTags.length) {
                        if (!VisitLinks.includes(href)) {
                            tr.className = "gl1t";
                            tr.style = "min-width:250px !important;width:263px !important;";
                            var detail = tr.querySelector("div.gl3e");
                            detail.className = "gl3t";
                            var star = detail.querySelector("div.ir");
                            star.style.margin = "auto";
                            var thumb = tr.querySelector("td.gl1e");
                            thumb.firstChild.style = "height:340px;";
                            thumb.insertBefore(detail, null);
                            ContentPane.insertBefore(tr, null);
                            debug("Insert div");
                            count = 0;
                            FilledChildNum++;
                            Break = true;
                            break;
                        }
                    }
                    else if (tag == FavTag.trim()) {
                        //debug("FavTag: " + FavTag);
                        link.className += " glowbox";
                        count++;
                    }
                }
                if (Break) {
                    break;
                }
            }
        }
    }
    catch(e){
        debug("Error: "+e);
    }
    if(FilledChildNum<=ContentPaneChildNum) {
        if (DivCount < divs.length-1) {
            //for (var i = 0; i < divs.length; ++i) {
            //var div=divs[i];
            if (FilledChildNum == ContentPaneChildNum) {
                btn.innerHTML="You may like";
                debug("finish");
                return;
            }
            else if (FavTags.length == 0) {
                debug("Insert divs");
                for(div of divs){
                    ContentPane.insertBefore(div, null);

                }
                btn.innerHTML="You may like";
                debug("finish");
                return;

            }
            else {
                debug("DivCount: " + DivCount);
                DivCount++;
                GetGalleryTag(null,divs);
            }
        }
        else {
            FillPane();
        }
    }
}

function GetFavTag(){
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

    //convert array to object
    var ArrayToObj=function (sortable){
        VisitTags={};
        sortable.forEach(function(item){
            VisitTags[item[0]]=item[1]
        })
        return VisitTags;
    }

    VisitTags=ArrayToObj(sortable);
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
                    VisitTags=ArrayToObj(shuffle(sortable));
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

function SearchGallery(responseDetails) {
    debug("SearchGallery");
    var responseText=responseDetails.responseText;
    //var href=responseText.match(/(https:\/\/e(-|x)hentai\.org\/g\/[\d\w]*\/[\d\w]*\/)/)[1];
    //debug("href: "+href);
    var dom = new DOMParser().parseFromString(responseText, "text/html");
    var table=dom.querySelector("table.itg.glte");
    var tbody=table.querySelector("tbody");
    var CurrentContentPane=tbody;
    var divs = CurrentContentPane.childNodes;
    debug('CurrentContentPane.childNodes.length: '+CurrentContentPane.childNodes.length)
    for(var div of divs){
        debug("tr.innerHTML: "+div.innerHTML)
        var ir=div.querySelector("div.ir");
        if(ir!=null){
            var backgroundPosition=ir.style.backgroundPosition;
            if(!["0px -21px","0px -1px"].includes(backgroundPosition)){
                CurrentContentPane.removeChild(div);
            }

        }
    }
    divs = CurrentContentPane.childNodes;
    debug("divs.length: "+divs.length);
    DivCount=0;
    GetGalleryTag(null,divs);
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

window.addEventListener('load', init);

