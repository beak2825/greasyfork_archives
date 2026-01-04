// ==UserScript==
// @name         Remove Bad SA Posts
// @namespace    LWPDWyfub
// @version      0.3
// @description  Hides bad SA posts
// @author       LWPDWyfub
// @match        https://forums.somethingawful.com/*
// @grant        none
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/456019/Remove%20Bad%20SA%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/456019/Remove%20Bad%20SA%20Posts.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //Delete posts containing tweets from these accounts
    const badTweeters=["realDonaldTrump","elonmusk","StephenM", "djbaskin","tedcruz","DineshDSouza", "SenTedCruz", "RudyGiuliani","OhNoSheTwitnt","TeamTrump",
                       "timcast","mtracey","DonaldJTrumpJr","SebGorka","mtgreenee","prageru", "ggreenwald","disclosetv","CawthorneforNC", "HawleyMO","schmoyoho",
                       "parlertakes","erictrump","IvankaTrump","LLinWood","NilesGApol","USA_Polling","lwriteOK","deanna4congress","PpollingNumbers","Politics_Polls",
                       "seanhannity","mattgaetz","LindseyGrahamSC","benshapiro","ddale8","charliekirk11","FirstSquawk","stella_immanuel","stillgray","raheemkassam",
                       "parscale","mikepompeo","MrAndyNgo","RealAlexRubi","fitterhappierAJ","Jim_Jordan","TrumpWarRoom","HouseGOP","seanspicer","demswatchdog","jimmy_dore",
                       "RepMTG","themaxburns","EricTopol","PolicemanMeme","joerogan",
                       "RonnyJacksonTX","JackPosobiec","RNCResearch","FalconryFinance","GregAbbott_TX","RealCandaceO","newtgingrich","ScottAdamsSays","FoxNews",
                       "Deltaone","thehill","DrEricDing","patriottakes","FxHedgers","CawthornforNC","nypost"]
    //Delete posts containing these words or [combination of words]
    const badWords=["succdem","Greenwald", "NFT",
                    ["shark","smooth"],
                    ["battery","ocean"],
                    ["batteries","ocean"],
                    ["kids","cages"],
                    ["go","brandon"],
                    ["children", "border","camps"],
                    "Tara Reade",
                    "Trump",
                    "Musk","elon",
                    "shitlib","cuck"," simp "," simping "," GME ","Gamestop", "MTG"," succ "]
    //Delete these words or posts by these posters only in certain threads
    const inconsistentWords= [ {threadid: 1234567, word: "PosterName"}
        ]
    const targetNodes=document.getElementsByClassName("postbody")
    console.log("Found "+targetNodes.lenght+" posts")
    const url = new URL(document.URL);
    const urlsp = url.searchParams;
    const badPosts=[
        {text:"Deleted white noise post ",test:function(e){
            for(let obj of badWords.concat(inconsistentWords)){
                if(typeof obj=="string" && e.includes(obj.toLowerCase()))
                {
                    console.log("Deleted post with "+obj);
                    return obj
                }
                else if(typeof obj=="object")
                {
                    if(obj instanceof Array)
                    {
                        var found=[]
                        for(let o of obj)
                        {
                            if(e.includes(o.toLowerCase()))
                            {
                                found.push(o)
                            }
                        }
                        //Only return true if all words found
                        if(found.length==obj.length)
                        {
                            console.log("Deleting post containing "+found.join(" "))
                            return found.join("+")
                        }
                    }
                    else if('threadid' in obj && urlsp.get("threadid")==obj.threadid && e.includes(obj.word.toLowerCase())){
                        console.log("Deleting post containing "+obj.word+" in thread "+urlsp.get("threadid"))
                        return obj.word
                    }
                    else{
                        console.log("Skipping post not containing "+obj.word+" in thread "+urlsp.get("threadid")+" not in "+obj.threadid)
                    }
                }
            }
            return false
        }}
    ]

    const config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                if(mutation.target.className==="tweet")
                {
                    var tweetObj=mutation.target.children[0].children[1]
                    if(tweetObj)
                    {
                        for(let badTweeter of badTweeters)
                        {
                            if(tweetObj.href.toLowerCase().includes(badTweeter.toLowerCase()))
                            {
                                console.log("Removing bad tweet from idiot named "+badTweeter)
                                mutation.target.innerText="--->Removed bad tweet from idiot named "+badTweeter+"<---"
                            }
                        }
                    }
                }

            }
        }
    };
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    for(var i=0;i<targetNodes.length;i++)
    {
        var targetNode=targetNodes[i]
        var tval=targetNode.innerText.toLowerCase()
        for(let testCase of badPosts)
        {
            var res=testCase.test(tval)
            if(res != false)
            {
                targetNode.innerText=testCase.text
            }
        }

        observer.observe(targetNode, config);
    }


})();