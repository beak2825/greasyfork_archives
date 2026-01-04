// ==UserScript==
// @name         Wanikani Add Context To Review
// @namespace    http://wanikani.com
// @version      0.1
// @description  Adds context sentences to vocab and example words to kanji
// @author       You
// @match        https://www.wanikani.com/review/session
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/375368/Wanikani%20Add%20Context%20To%20Review.user.js
// @updateURL https://update.greasyfork.org/scripts/375368/Wanikani%20Add%20Context%20To%20Review.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var Types = Object.freeze({ "kanji": "kanji", "vocab": "vocabulary", "radical": "radical"});
    var Colors = Object.freeze({
        vocab: "rgb(161, 0, 241)",
        kanji: "rgb(241, 0, 161)",
        radical: "rgb(0, 161, 241)"
    })

    var ContextCache = (() => {
        return {
            get: (text, type) => {
                return $.jStorage.get(`${text}-${type}`);
            },
            set(text, type, contexts) {
                $.jStorage.set(`${text}-${type}`, contexts);
            }
        }

    })();

    var ContextNode = function(text){
        var node = document.createElement("span");
        node.id = "context-info";
        node.innerText = text;
        node.style.fontSize = "20px";
        return node;
    }
    var WaniKaniTestPage = (() => {
        return {
            updateWithContext: (contexts) => {
                let randomIndex = Math.floor(Math.random() * contexts.length);
                let context = contexts[randomIndex];
                let text =  document.getElementById("character").firstElementChild.innerText;
                let char = document.getElementById("character");
                let contextText =  context.replace(new RegExp(`${text}`, 'g'), `[[${text}]]`).trim().split(" ")[0].trim();
                let contextNode = document.getElementById("context-info");
                if(contextNode == null){
                    contextNode = ContextNode(contextText);
                    char.appendChild(ContextNode(contextText));
                } else {
                    contextNode.innerText = contextText;
                }
            },
            getCharacterOnPage: () => {
                return document.getElementById("character");
            },
        }
    })();

    var WaniKaniInfoPage = (item) => {
        const strats = {};
        strats[Types.vocab] = function (page) {
            return Array.from(page.getElementsByClassName("context-sentence-group"))
            .map((e) => { return e.innerText; })
        };

        strats[Types.kanji] = function (page) {
            return Array.from(page.getElementsByClassName("character-item"))
                .filter((e) => { return e.className.includes(Types.vocab) })
                .map((e) => { return e.innerText; })
                .filter((e)=>{ 
                    
                    return e.includes(item.text)}
                )
        };
        return {
            getContext: function (item, cb) {
                let contexts = ContextCache.get(item.text, item.type);
                if(contexts != undefined){
                    console.debug("Hit the cache")
                    return cb(contexts);
                }
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://www.wanikani.com/${item.type}/${item.text}`,
                    onload: (event) => {
                        let doc = event.response;
                        let page = document.createElement("html");
                        page.innerHTML = doc;
                        let contexts = strats[item.type](page);
                        console.debug(contexts);
                        console.debug("writing to cache")
                        ContextCache.set(item.text, item.type, contexts);
                        cb(contexts);
                    }
                })
            }
        }
    }


    function search(cb){
        setTimeout(()=>{
            let node = WaniKaniTestPage.getCharacterOnPage();
            let testItem = {
                text: node.firstElementChild.innerText
            };
            let style = window.getComputedStyle(node).backgroundColor;
            
            switch (style) {
                case Colors.vocab: 
                    testItem.type = Types.vocab; 
                    break;
                case Colors.kanji: 
                    testItem.type =  Types.kanji;
                    break;
                case Colors.radical: 
                    testItem.type = Types.radical;
                    break;
                default: testItem.type = "";
            }   
            console.debug(testItem);
            if(testItem.text.trim() == "" || testItem.type == undefined ||testItem.type.trim() == ""){
                search(cb)
            } else {
                if(testItem.type != Types.radical)
                    cb(testItem)
            }
        }, 300)
    }


    let ContextObserver = (() => {
        let watchMain = (mutationsList, observer)=>{
            for(var mutation of mutationsList) {
                if (mutation.type == 'childList') {
                    search((testItem)=>{
                        let pageWithContext = WaniKaniInfoPage(testItem);
                        let context = pageWithContext.getContext(testItem, (contexts) => {
                            WaniKaniTestPage.updateWithContext(contexts);
                        })
                    })
                }
            }
            mutationsList.map((e)=>{ console.debug(e.type); });
        }

        let node = WaniKaniTestPage.getCharacterOnPage().firstElementChild;

        // Options for the observer (which mutations to observe)
        let config = {
            childList: true
         };

        // Create an observer instance linked to the callback function
        let observer = new MutationObserver(watchMain);

        observer.observe(node, config);
    })();


})();

