// ==UserScript==
// @name         Warosu Images
// @namespace    http://tampermonkey.net/
// @version      0.2.5
// @description  Add images to your posts
// @author       ECHibiki-/qa/
// @match http://warosu.org/*
// @match https://warosu.org/*
// @include http://warosu.org/*
// @include https://warosu.org/*
// @run-at document-body
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_xmlhttpRequest
// @connect https://danbooru.donmai.us/
// @connect http://danbooru.donmai.us/
// @downloadURL https://update.greasyfork.org/scripts/30826/Warosu%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/30826/Warosu%20Images.meta.js
// ==/UserScript==

/**
Hold Control and Shift to hide images, but keep threads open.
Doesn't interfere with 4chanx and you can still see images it if you mouse over them.
Hidden images reapear in 48 hours.
*/

(function() {
    var bowser;
    var finished = false;
    var addedImages = [];

    function getDataUri(url) {
        /*try{
            GM_xmlhttpRequest ( {
                method:         'GET',
                url:            url,
                onload:         function (responseDetails) {

                }
            } );
        }
        catch(e){
        }*/
        return url;
    }

    function modifyDOM(){
        //var later = Date.now();
        if(finished) {
            var start = document.getElementById("postform");
            if (start === null) start = document.body;
            else start = start.firstChild;
            if(!secondObserverSet){
                //console.log(start);
                observer.disconnect();
                observeDynamicMutation(start);
                secondObserverSet = true;
            }
        }
        else {
            var start = document;
        }
        if(start === null) return;
        var itterator = document.createTreeWalker(start, NodeFilter.SHOW_ELEMENTS, NodeFilter.SHOW_ELEMENTS);
        var node = "";

        //console.log(start);
        while((node = itterator.nextNode())){
            var tag = node.tagName;
            //console.log(tag);
            if(tag == "BLOCKQUOTE"){   
                while((localNode = itterator.nextNode()) && (localTag = localNode.tagName) !== "TABLE"){
                    var localHREF = localNode.href;
                    //console.log(localTag);
                    if(localTag == "A" && (new RegExp("^http(|s):\/\/.+\.(jpg|png|gif|webm|mp4).*$", "g")).test(localHREF)){
                        //console.log("pass3");
                        //console.log(localNode);
                        //console.log(node);
                        /*var zeroIndex = localHREF.indexOf("http");
                        var endIndex = localHREF.indexOf(".jpg") + 4;
                        if(endIndex == (-1 + 4)) endIndex = localHREF.indexOf(".png") + 4;
                        if(endIndex == (-1 + 4)) endIndex = localHREF.indexOf(".gif") + 4;
                        if (endIndex == (-1 + 4))endIndex = localHREF.indexOf(".webm") + 5;
                        var urlLink = localHREF.substring(zeroIndex, endIndex);
                        var breakVar = false;
                        addedImages.forEach(function(url){
                            if(url === urlLink){
                                breakVar = true;
                            }
                        });*/
                        //if(breakVar) break;

                        var parent = node.parentNode;

                        if(localHREF.indexOf(".webm") != -1 | localHREF.indexOf(".mp4") != -1){
                            var vid = document.createElement("VIDEO");
                            vid.setAttribute("src",getDataUri(localHREF));
                            vid.setAttribute("type",getDataUri(localHREF));
                            vid.setAttribute("controls", "true");
                            //console.log(vid);
                            //img.setAttribute("id","fl" + parent.id.substring(1));
                            vid.addEventListener("load", function(i){
                                //console.log(this);
                                this.setAttribute("height",this.height * 0.5);
                                if(this.height < 200) this.height = 200;
                                else if (this.height > 1000)this.height = 1000;
                                else if(this.height == 0){
                                    this.setAttribute("src", "https://cs.sankakucomplex.com/data/e8/a4/e8a46437c6ebd2350ac354446a5043c8.webm?4741543");
                                }
                            });
                            vid.addEventListener("error", function(){
                                this.setAttribute("src", "https://cs.sankakucomplex.com/data/e8/a4/e8a46437c6ebd2350ac354446a5043c8.webm?4741543");
                            });

                            parent.insertBefore(vid, node);                        

                            //addedImages.push(urlLink); 
                        }
                        else{
                            var aLink = document.createElement("A");
                            //aLink.setAttribute("class", "fileThumb");
                            //aLink.setAttribute("href", "javascript:void(0);");
                            aLink.setAttribute("href", localHREF);
                            //aLink.setAttribute("target", "_blank");

                            var img = document.createElement("IMG");
                            /*img.setAttribute("onclick",            
                                        "console.log(\"ets\");\
                            var metaRedirect = document.createElement(\"META\");\
                            metaRedirect.setAttribute(\"http-equiv\",\"refresh\");\
metaRedirect.setAttribute(\"id\", \"redir\"); \
                            metaRedirect.setAttribute(\"content\",\"0;" + localHREF + "\");"  + 
                            "document.head.appendChild(metaRedirect);"
                        );*/
                            //console.log(urlLink);
                            img.setAttribute("src",getDataUri(localHREF));
                            //img.setAttribute("id","fl" + parent.id.substring(1));
                            img.addEventListener("load", function(i){
                                //console.log(this);
                                this.setAttribute("height",this.height * 0.5);
                                if(this.height < 200) this.height = 200;
                                else if (this.height > 1000)this.height = 1000;
                                else if(this.height == 0){                       
                                    this.setAttribute("src", "http://orig01.deviantart.net/a920/f/2010/095/9/b/konata_error_404_by_zarkfx.png");
                                    this.width = 200;
                                    this.height = 200;
                                }
                            });
                            img.addEventListener("error", function(){
                                this.setAttribute("src", "http://orig01.deviantart.net/a920/f/2010/095/9/b/konata_error_404_by_zarkfx.png");
                            });

                            aLink.appendChild(img);
                            //console.log(node);
                            parent.insertBefore(aLink, node);                        

                            //addedImages.push(urlLink); 
                        }
                        break;
                    }
                    else if(localTag == "HR"){

                        break;
                    }
                    else continue;
                }
            }            
        }
    }

    //initial onload setup
    function swapListener(){
        modifyDOM()  ;
        //observeDynamicMutation();
    }

    //detect page changes
    function observeDynamicMutation(){
        var node = document;
        var observer = new MutationObserver(function callBack(mutations){
            var breakVar = false;

            mutations.forEach(function(mutation){if(mutation.addedNodes[0] !== undefined && mutation.addedNodes[0].className !== undefined  && mutation.addedNodes[0].className == "ImageSwap"){breakVar = true;}});
            if(breakVar) return;
            var later = Date.now();
            modifyDOM();
            //console.log("Hide: " + (Date.now() - later));
        });
        var config = {subtree: true, childList:true};
        observer.observe(node, config);
    }

    if (window.top != window.self)  //-- Don't run on frames or iframes
        return;

    
    window.addEventListener("load", function(event){
        console.log("start");
        swapListener();
        console.log("Script loaded: Swap Images");
    });

})();