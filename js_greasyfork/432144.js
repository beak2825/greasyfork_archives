// ==UserScript==
// @name         ADictionary Blocker
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  A Ad-changer
// @author       Thomas Thy Train
// @match        *://dictionary.cambridge.org/*
// @match        https://*/*
// @grant        GM_addStyle
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.9.1/underscore-min.js
// @grant        GM.setValue
// @grant        GM.getValue
// @icon         data:image/png;base64,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
// @CrossOrigin("*")
// @downloadURL https://update.greasyfork.org/scripts/432144/ADictionary%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/432144/ADictionary%20Blocker.meta.js
// ==/UserScript==

// this is from https://dictionary.cambridge.org/external/scripts/dblclick.js?version=5.0.175
function setupExtDoubleClick(websiteUrl, dictionary, showFirstEntry, areaClass, maxAllowedWords, target) {
    setupDoubleClick(websiteUrl, dictionary, areaClass, maxAllowedWords, target,
        function(websiteUrl, dictionary, showFirstEntry, lookup) { return websiteUrl + "search/" + (dictionary ? dictionary + "/" : "") + (showFirstEntry ? "direct/" : "") + "?q=" + lookup; });
}
function setupDoubleClick(websiteUrl, dictionary, showFirstEntry, areaClass, maxAllowedWords, target, urlCallback) {
    //warning message for developers
    if (!websiteUrl || !dictionary) {
        alert("Please specify required parameters (websiteUrl and dictionary) to setupDoubleClick()")
        return;
    }

    //shows the definition layer
    var showLayer = function(e) {
        var translateDictionary = dictionary;
        var node = e.target || e.srcElement;
        while (node != null) {
            var lang = node.getAttribute("dict");
            if (lang) {
                translateDictionary = lang;
                break;
            }
            if (node.parentNode == node.ownerDocument) {
                break;
            }
            node = node.parentNode;
        }
        e.preventDefault();
        var lookup = getSelectedText();
        // original space, but shitty api ont allow
        lookup = lookup.replace(/[\.\*\?;!()\+,\[:\]<>^_`\[\]{}~\\\/\"\'=]/g, "");
        lookup = lookup.replace(/\s+/g, "");
        if (lookup != null && lookup.replace("/\s/g", "").length > 0) {
            //disable the double-click feature if the lookup string
            //exceeds the maximum number of allowable words
            if (maxAllowedWords && lookup.split(/[ -]/).length > maxAllowedWords)
                return;
            // i give up on showing the meaning
            //I DID IT!!!!!!!
            let request = new XMLHttpRequest();
            request.open("GET","https://api.dictionaryapi.dev/api/v2/entries/en/"+lookup);
            request.responseType="json";
            // add a popup to show define
            // word is correct
            // new,store things
            let word="<h3 style='font-style:italic;font-weight:bold;'>power by Cambridge Dictionary</h3><h1 id='word_adb_explain'style='font-style:italic;font-weight:bold;'>"+lookup+"</h1>";
            // test zone
            if(!localStorage.getItem('wordlist')){
                localStorage.setItem("wordlist","");
            }
            let cur_wl=localStorage.getItem('wordlist').split(":");
            //unique
            cur_wl=Array.from(new Set(cur_wl));
            localStorage.setItem("wordlist",cur_wl.join(":"));
            let color="grey";
            if(cur_wl.includes(lookup)){
                color="green"
            }
            request.onload=()=>{
                //localStorage.clear();

                request.response[0].meanings.forEach((e)=>{word+="<p>"+e.definitions[0].definition+"</p>";word+="<span style='font-style:italic;opacity:0.5;'>"+e.partOfSpeech+"</span>"});
                $("#adb_explain").remove();
                $("body").append("<div id='adb_explain'style='position:fixed;background-color:#fff;border:2px solid #000;width:450px;'><button id='delete_block' style='border-radius: 50%;border-width:0px;'>X</button><button id='adb_addword' style='border-radius: 50%;background-color:"+color+";border-width:0px;'>&#10004;</button>"+word+"</div>");

            // test end
                let block=document.querySelector("#adb_explain");
                const size=block.getBoundingClientRect();
                block.style.left=(1420-size.width).toString()+"px";
                block.style.top=(740-size.height).toString()+"px";
                $("#delete_block").click(()=>{$("#adb_explain").remove()});
            }
            $("#adb_addword").click((e)=>{
                lookup=$("#word_adb_explain").text();
                    if(cur_wl.includes(lookup)){
                        $("#adb_addword").css("background-color","grey");
                        const index=cur_wl.findIndex((e)=>e===lookup);
                        delete cur_wl[index];
                        localStorage.setItem('wordlist', cur_wl.join(":"));
                    }else{
                        $("#adb_addword").css("background-color","green");
                        localStorage.setItem('wordlist', cur_wl.join(":")+":"+lookup);
                    }
                });
            request.send();

            //append the layer to the DOM only once
            // modify this part
            if ($("#definition_layer").length == 0) {
                var imageUrl = websiteUrl + "external/images/doubleclick/definition-layer.gif";
                $("body").append("<div id='definition_layer' style='position:absolute; cursor:pointer;'><img src='" + imageUrl + "' alt='' title=''/></div>");
                //$("body").append("<div id='definition_layer' style='position:absolute; cursor:pointer;'>" + word + "</div>");
            }

            //move the layer at the cursor position
            $("#definition_layer").map(function() {
                $(this).css({'left' : e.pageX-30, 'top' : e.pageY-40});
            });

            //open the definition popup clicking on the layer
            $("#definition_layer").mouseup(function(e) {
                e.stopPropagation();
                openPopup(lookup, translateDictionary);
            });
        } else {
            $("#definition_layer").remove();
        }
    };

    //opens the definition popup
    var openPopup = function(lookup, translateDictionary) {
        var searchUrl;
        if (urlCallback)
            searchUrl = urlCallback(websiteUrl, translateDictionary, showFirstEntry, lookup);
        else
            searchUrl = websiteUrl + "search/" + (translateDictionary ? translateDictionary + "/" : "") + (showFirstEntry ? "direct/" : "") + "?q=" + lookup;
        if(lookup.replace(/[a-zA-Z0-9]/g, '')!=""){
            searchUrl="https://www.collinsdictionary.com/dictionary/chinese-english/"+lookup;
        }
        if (target) {
            if (target == "self") {
                window.location.href = searchUrl;
                return;
            }
            var popup = window.open(searchUrl, target, "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=no,copyhistory=no,width=915,height=760,top=300,left=300");
            if (popup)
                popup.focus();
        } else {
            window.open(searchUrl, 'cup_lookup');
        }
        /*window.location.href = searchUrl;*/
    };

    var area = areaClass ? "." + areaClass : "body";
    $(area).mouseup(showLayer);
}

/*
 * Cross-browser function to get selected text
 */
function getSelectedText(){
    if(window.getSelection)
        return window.getSelection().toString();
    else if(document.getSelection)
        return document.getSelection();
    else if(document.selection)
        return document.selection.createRange().text;
    return "";
}
(function() {
    'use strict';
    //setup clicker dictionary
    // problem, it only give you the link
    setupDoubleClick( 'https://dictionary.cambridge.org/', 'english-chinese-traditional', true, null, 5, 'popup' );
    let adtype=["iframe","ytd-display-ad-renderer","ins","div"];
    let adfinder=["google_ads","aswift","mys-wrapper","midcontentadcontainer"];

    // let interval = null;

    // let hostname = document.location.hostname;
    //make this the explain page,but not every go ad
    // new
    function cleanup() {

        //if(!localStorage.getItem('wordlist')){
        //    localStorage.setItem("wordlist",".");
        //}
        let request = new XMLHttpRequest();
        let word="Loading"
        try{
            let cur_wl=localStorage.getItem('wordlist').split(":").slice(1);
            let lookup= new String(_.sample(cur_wl));
            //let lookup="cat";
            request.open("GET","https://api.dictionaryapi.dev/api/v2/entries/en/"+lookup);
            request.responseType="json";
            word="<h6 style='font-style:italic;font-weight:bold;'>power by Dictionary API</h6><h5 style='font-style:italic;font-weight:bold;'>"+lookup+"</h5>";
        }catch(err){
            let lookup="Loading";
            request.open("GET","https://api.dictionaryapi.dev/api/v2/entries/en/"+lookup);
            request.responseType="json";
            word="Loading";
        }
        request.onload=()=>{
            request.response[0].meanings.forEach((e)=>{
                word+="<p>"+e.definitions[0].definition+"</p>";
                word+="<span style='font-style:italic;opacity:0.5;'>"+e.partOfSpeech+"</span>";
            });
            // clear ad
            adtype.forEach((i)=>{
                try{
                    document.querySelectorAll(i).forEach((elem)=>{
                        adfinder.forEach((adid)=>{
                            if(elem.id.slice(0,adid.length)==adid){
                                console.log(word);
                                elem.style.overflow="auto";
                                elem.innerHTML=word;
                                //elem.style.visibility = 'hidden';
                                //elem.style.width = '1px';
                                //elem.style.height = '1px';
                                //elem.style.overflow = 'hidden';
                                //elem.style.opacity = 0;
                                //elem.remove();
                            }
                        });


                    });}
                catch(err){console.log(err);
                          }
            }
                          );
        }
        request.send();
        document.body.dispatchEvent(new MouseEvent('mousemove'));
        // modify this part
        // if(sites[hostname].background) {
        //     document.body.style.background = sites[hostname].background;
        //     document.body.style.overflow = 'scroll';
        //     document.body.style.position = 'static';
        // }


    }
    let interval=null;

    cleanup();
    if(interval === null) {
        interval = window.setInterval(function(){
        cleanup();
    }, 5000);
    }

})();
//"ytd-display-ad-renderer"