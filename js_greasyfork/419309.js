// ==UserScript==
// @name         epic hax
// @description  does super cool stuff
// @match        artofproblemsolving.com/*
// @version      1.0
// @namespace https://greasyfork.org/users/721929
// @downloadURL https://update.greasyfork.org/scripts/419309/epic%20hax.user.js
// @updateURL https://update.greasyfork.org/scripts/419309/epic%20hax.meta.js
// ==/UserScript==

(function() {
    //Creates some localStorage vars
    localStorage.setItem('autoposting',"false");
    localStorage.setItem("windowlocation","null");

    //Creates CSS for style
    var cssinject = `.HIDDEN {
display: none;
}
#autoposttxt {
margin: 0px;
padding-left: 2px;
}
#autopostelmt {
display: inline-flex;
border-top: 2px solid rgb(83,83,83);
width: 220px;
}
#topicspamelmt {
display: inline-flex;
border-top: 2px solid rgb(83,83,83);
width: 220px;
}
.debugcolor {
background-color: red !important;
color: blue !important;
}
.namecolor {
background-color: green !important;
}
.cmty-page-topic.cmty-page-has-tag-filter .cmty-topics-list {
height: -webkit-calc(100% - 120px)
}`;

    //Injects that CSS
    var head=document.getElementsByTagName('head')[0];
    if (document.getElementById("cssinject")===null){
        var elmnttheme=document.createElement('style');
        elmnttheme.id="cssinject";
        head.appendChild(elmnttheme);
    }
    else{
        head.appendChild(document.getElementById("cssinject"));
    }
    document.getElementById("cssinject").innerHTML=cssinject;

    var checked = 0;

    //The main code
    for (let i = 0; i < 20000; i++) {
        //Slows down checks
        setTimeout(function timer(){
            if (window.location.href.indexOf("community/c")!==-1) {
                //Creates the auto-posting button
                if (document.getElementById("autoposting")===null&&document.getElementsByClassName('cmty-tag-filter').length>0) {
                    var toAdd = `<label><input type="checkbox" id="autoposting" onclick="localStorage.setItem('autoposting', JSON.stringify(this.checked));"/> Autoposting</label>`;

                    var ap=document.createElement('div');
                    ap.id = "autopostelmt";
                    ap.innerHTML=toAdd;
                    document.getElementsByClassName('cmty-tag-filter')[1].appendChild(ap);

                    ap.addEventListener('click',function() {
                        if (document.getElementsByClassName("cmty-cancel-posting-x").length>0) {
                            document.getElementsByClassName("cmty-cancel-posting-x")[0].click();
                        }
                    });
                }
                if (document.getElementById("autoposting")!==null) {
                    //Makes sure it only posts on the thread you want
                    if (localStorage.getItem('windowlocation')==="null"&&localStorage.getItem('autoposting')==='true') {
                        localStorage.setItem("windowlocation",JSON.stringify(window.location.href));
                    }
                    else if (localStorage.getItem('autoposting')==='false') {
                        localStorage.setItem("windowlocation","null");
                    }

                    //Makes sure it updates when you click the button
                    document.getElementById('autoposting').value=localStorage.getItem('autoposting');

                    //re-adds the quick reply when you turn off autoposting
                    var txt = `<span class="aops-font">N</span>
Quick Reply`;
                    //Deals with style when you turn on/off autoposting
                    var message = document.getElementsByClassName("cmty-topic-mini-reply")[0];
                    if (localStorage.getItem('autoposting')==='false') {
                        message.innerHTML = txt;
                        document.getElementById("feed-wrapper").classList.replace("HIDDEN","NOTHIDDEN");
                        document.getElementsByClassName("cmty-topic-reply")[0].classList.replace("HIDDEN","NOTHIDDEN");
                    }
                    else if (message.innerHTML.indexOf("Autoposting")===-1) {
                        document.getElementsByClassName("cmty-topic-reply")[0].classList.add("HIDDEN");
                        document.getElementById("feed-wrapper").classList.add("HIDDEN");
                        message.innerHTML += " - Autoposting on";
                        message.addEventListener('click', function() {
                            setTimeout(function(){
                                if (localStorage.getItem('autoposting')==='true') {
                                    document.getElementsByClassName("cmty-cancel-posting-x")[0].click();
                                    alert('Turn autoposting off first.');
                                }
                            },50);
                        });
                    }
                    var quotes = document.getElementsByClassName("cmty-post-quote");
                    for (let t=0;t<quotes.length;t++) {
                        quotes[t].addEventListener('click', function() {
                            setTimeout(function(){
                                if (localStorage.getItem('autoposting')==='true') {
                                    document.getElementsByClassName("cmty-cancel-posting-x")[0].click();
                                    document.getElementsByClassName("aops-modal-btn btn btn-primary")[0].click();
                                    alert('Turn autoposting off first.');
                                }
                            },50);
                        });
                    }
                }
                if(document.getElementById('topicspamming')===null&&document.getElementById('autoposting')!==null){
                    var toAdd2 = `<label><input type="checkbox" id="topicspamming" onclick="localStorage.setItem('topicspamming', JSON.stringify(this.checked));"/> Topicspamming</label>`;

                    var ap2=document.createElement('div');
                    ap2.id = "topicspamelmt";
                    ap2.innerHTML=toAdd2;
                    document.getElementsByClassName('cmty-tag-filter')[1].appendChild(ap2);

                    ap2.addEventListener('click',function() {
                        if (document.getElementsByClassName("cmty-cancel-posting-x").length>0) {
                            document.getElementsByClassName("cmty-cancel-posting-x")[0].click();
                        }
                    });
                }
                if(document.getElementById('topicspamming')!==null){
                    if (localStorage.getItem('windowlocation')==="null"&&localStorage.getItem('topicspamming')==='true') {
                        localStorage.setItem("windowlocation",JSON.stringify(window.location.href));
                    }
                    else if (localStorage.getItem('topicspamming')==='false') {
                        localStorage.setItem("windowlocation","null");
                    }

                    //Makes sure it updates when you click the button
                    document.getElementById('autoposting').value=localStorage.getItem('topicspamming');

                    //re-adds the quick reply when you turn off autoposting
                    var txt = `<span class="aops-font">N</span>
Quick Reply`;
                    //Deals with style when you turn on/off autoposting
                    var message = document.getElementsByClassName("cmty-topic-mini-reply")[0];
                    if (localStorage.getItem('topicspamming')==='false') {
                        message.innerHTML = txt;
                        document.getElementById("feed-wrapper").classList.replace("HIDDEN","NOTHIDDEN");
                        document.getElementsByClassName("cmty-topic-reply")[0].classList.replace("HIDDEN","NOTHIDDEN");
                    }
                    else if (message.innerHTML.indexOf("Topicspamming")===-1) {
                        document.getElementsByClassName("cmty-topic-reply")[0].classList.add("HIDDEN");
                        document.getElementById("feed-wrapper").classList.add("HIDDEN");
                        message.innerHTML += " - Topicspamming on";
                        message.addEventListener('click', function() {
                            setTimeout(function(){
                                if (localStorage.getItem('topicspamming')==='true') {
                                    document.getElementsByClassName("cmty-cancel-posting-x")[0].click();
                                    alert('Turn topicspamming off first.');
                                }
                            },50);
                        });
                    }
                    var quotes = document.getElementsByClassName("cmty-post-quote");
                    for (let t=0;t<quotes.length;t++) {
                        quotes[t].addEventListener('click', function() {
                            setTimeout(function(){
                                if (localStorage.getItem('topicspamming')==='true') {
                                    document.getElementsByClassName("cmty-cancel-posting-x")[0].click();
                                    document.getElementsByClassName("aops-modal-btn btn btn-primary")[0].click();
                                    alert('Turn topicspamming off first.');
                                }
                            },50);
                        });
                    }
                }
            }
        },i*1000);
    }

    var randomReply = function(l,botcheck) {
        var outputs = ['','','','','',''];
        var botcheckreplies = [''];

        //Random Letters
        var letterz = 'oawhegozxnvmahrtiahjashdjfhasdnjsdhgahwegaosdhgasijdi';
        for (let i = 0; i < l; i++) {outputs[0]+=letterz[Math.floor(Math.random()*letterz.length)];}

        //Random Dots
        for (let i = 0; i < l; i++) {outputs[1]+='..';}

        //Never gonna give you up
        var replies = [
            "We're no strangers to love","You know the rules and so do I","A full commitment's what I'm thinking of","You wouldn't get this from any other guy","I just wanna tell you how I'm feeling","Gotta make you understand","Never gonna give you up","Never gonna let you down","Never gonna run around and desert you","Never gonna make you cry","Never gonna say goodby","Never gonna say a lie and hurt you","We've known eachother for so long","You heart's been aching but","You're too shy to say it","Inside we both know what's been goin' on","We know the game and we're gonna play it","And if you ask me how I'm feelin'","Don't tell you're too blind to see","Never gonna give you up","Never gonna let you down","Never gonna run around and desert you","Never gonna make you cry","Never gonna say goodby","Never gonna say a lie and hurt you","Never gonna give you up","Never gonna let you down","Never gonna run around and desert you","Never gonna make you cry","Never gonna say goodby","Never gonna say a lie and hurt you"];
        outputs[2] = replies[Math.floor(Math.random()*replies.length)];

        //Random 8 letter word
        var replies = [
            "absolute", "abstract", "academic", "accepted", "accident", "accuracy", "accurate", "achieved", "acquired", "activity", "actually", "addition", "adequate", "adjacent", "adjusted", "advanced", "advisory", "advocate", "affected", "aircraft", "alliance", "although", "aluminum", "analysis", "announce", "anything", "anywhere", "apparent", "appendix", "approach", "approval", "argument", "artistic", "assembly", "assuming", "athletic", "attached", "attitude", "attorney", "audience", "autonomy", "aviation", "bachelor", "bacteria", "baseball", "bathroom", "becoming", "benjamin", "birthday", "boundary", "breaking", "breeding", "building", "bulletin", "business", "calendar", "campaign", "capacity", "casualty", "catching", "category", "Catholic", "cautious", "cellular", "ceremony", "chairman", "champion", "chemical", "children", "circular", "civilian", "clearing", "clinical", "clothing", "collapse", "colonial", "colorful", "commence", "commerce", "complain", "complete", "composed", "compound", "comprise", "computer", "conclude", "concrete", "conflict", "confused", "congress", "consider", "constant", "consumer", "continue", "contract", "contrary", "contrast", "convince", "corridor", "coverage", "covering", "creation", "creative", "criminal", "critical", "crossing", "cultural", "currency", "customer", "database", "daughter", "daylight", "deadline", "deciding", "decision", "decrease", "deferred", "definite", "delicate", "delivery", "describe", "designer", "detailed", "diabetes", "dialogue", "diameter", "directly", "director", "disabled", "disaster", "disclose", "discount", "discover", "disorder", "disposal", "distance", "distinct", "district", "dividend", "division", "doctrine", "document", "domestic", "dominant", "dominate", "doubtful", "dramatic", "dressing", "dropping", "duration", "dynamics", "earnings", "economic", "educated", "efficacy", "eighteen", "election", "electric", "eligible", "emerging", "emphasis", "employee", "endeavor", "engaging", "engineer", "enormous", "entirely", "entrance", "envelope", "equality", "equation", "estimate", "evaluate", "eventual", "everyday", "everyone", "evidence", "exchange", "exciting", "exercise", "explicit", "exposure", "extended", "external", "facility", "familiar", "featured", "feedback", "festival", "finished", "firewall", "flagship", "flexible", "floating", "football", "foothill", "forecast", "foremost", "formerly", "fourteen", "fraction", "franklin", "frequent", "friendly", "frontier", "function", "generate", "generous", "genomics", "goodwill", "governor", "graduate", "graphics", "grateful", "guardian", "guidance", "handling", "hardware", "heritage", "highland", "historic", "homeless", "homepage", "hospital", "humanity", "identify", "identity", "ideology", "imperial", "incident", "included", "increase", "indicate", "indirect", "industry", "informal", "informed", "inherent", "initiate", "innocent", "inspired", "instance", "integral", "intended", "interact", "interest", "interior", "internal", "interval", "intimate", "intranet", "invasion", "involved", "isolated", "judgment", "judicial", "junction", "keyboard", "landlord", "language", "laughter", "learning", "leverage", "lifetime", "lighting", "likewise", "limiting", "literary", "location", "magazine", "magnetic", "maintain", "majority", "marginal", "marriage", "material", "maturity", "maximize", "meantime", "measured", "medicine", "medieval", "memorial", "merchant", "midnight", "military", "minimize", "minister", "ministry", "minority", "mobility", "modeling", "moderate", "momentum", "monetary", "moreover", "mortgage", "mountain", "mounting", "movement", "multiple", "national", "negative", "nineteen", "northern", "notebook", "numerous", "observer", "occasion", "offering", "official", "offshore", "operator", "opponent", "opposite", "optimism", "optional", "ordinary", "organize", "original", "overcome", "overhead", "overseas", "overview", "painting", "parallel", "parental", "patented", "patience", "peaceful", "periodic", "personal", "persuade", "petition", "physical", "pipeline", "platform", "pleasant", "pleasure", "politics", "portable", "portrait", "position", "positive", "possible", "powerful", "practice", "precious", "pregnant", "presence", "preserve", "pressing", "pressure", "previous", "princess", "printing", "priority", "probable", "probably", "producer", "profound", "progress", "property", "proposal", "prospect", "protocol", "provided", "provider", "province", "publicly", "purchase", "pursuant", "quantity", "question", "rational", "reaction", "received", "receiver", "recovery", "regional", "register", "relation", "relative", "relevant", "reliable", "reliance", "religion", "remember", "renowned", "repeated", "reporter", "republic", "required", "research", "reserved", "resident", "resigned", "resource", "response", "restrict", "revision", "rigorous", "romantic", "sampling", "scenario", "schedule", "scrutiny", "seasonal", "secondly", "security", "sensible", "sentence", "separate", "sequence", "sergeant", "shipping", "shortage", "shoulder", "simplify", "situated", "slightly", "software", "solution", "somebody", "somewhat", "southern", "speaking", "specific", "spectrum", "sporting", "standard", "standing", "standout", "sterling", "straight", "strategy", "strength", "striking", "struggle", "stunning", "suburban", "suitable", "superior", "supposed", "surgical", "surprise", "survival", "sweeping", "swimming", "symbolic", "sympathy", "syndrome", "tactical", "tailored", "takeover", "tangible", "taxation", "taxpayer", "teaching", "tendency", "terminal", "terrible", "thinking", "thirteen", "thorough", "thousand", "together", "tomorrow", "touching", "tracking", "training", "transfer", "traveled", "treasury", "triangle", "tropical", "turnover", "ultimate", "umbrella", "universe", "unlawful", "unlikely", "valuable", "variable", "vertical", "victoria", "violence", "volatile", "warranty", "weakness", "weighted", "whatever", "whenever", "wherever", "wildlife", "wireless", "withdraw", "woodland", "workshop", "yourself"];
        outputs[3] = replies[Math.floor(Math.random()*replies.length)];

        for (let i = 0; i < 3; i++) {outputs[4]+='spammspmsapm';}

        var replies = ["nonononono","asdfasdfafsd","harapharp","heheheheh","hahahahaha","lolololololl","hhahhahaaahahah","someone bot check me","qwertyuiop"];
        outputs[5] = replies[Math.floor(Math.random()*replies.length)];

        var replies = ["im not botting XD","nope not using a bot","not post botting","Im not botting","h not botting"];
        botcheckreplies[0]+=replies[Math.floor(Math.random()*replies.length)];

        if (botcheck) {return botcheckreplies[Math.floor(Math.random()*botcheckreplies.length)]+" ";}
        else {return outputs[Math.floor(Math.random()*outputs.length)];}
    }

    var newRandomDelay = function(v) {
        return (29*v)+Math.random()*(3*v);
    }

    //Autoposts
    localStorage.setItem('randomDelay',newRandomDelay(1000));
    for (let i=0; i<20000; i++) {
        setTimeout(function timer(){
            if (localStorage.getItem('autoposting')==='true'&&window.location.href.indexOf("community/c")!==-1&&localStorage.getItem('windowlocation').indexOf(window.location.href)!==-1) {
                var newDelay = newRandomDelay(1000);
                localStorage.setItem('randomDelay',newDelay);

                var terms = ["b0t","are you using a bot","Bot","BOt","BOT","BoT","bot check","Bot check","Bot Check"];

                var lastpost = 0;
                while (document.getElementsByClassName("cmty-post-quote aops-font")[lastpost] != undefined) {
                    lastpost++;
                }

                var a=document.getElementsByClassName("cmty-topic-reply")[0];
                a.click();
                var b = document.getElementsByClassName("cmty-post-textarea")[0];
                var l = Math.floor(8+Math.random()*10);

                //Find your username
                var botcheck=false;
                var yourusername = JSON.stringify(document.getElementsByClassName("username no-select")[0].innerHTML);
                for (var j = lastpost-1; j > lastpost-11; j--) {
                    var un = document.getElementsByClassName('cmty-post-username')[j];
                    if (yourusername.indexOf(un.children[0].innerHTML)===-1) {
                        for (var h = 0; h < terms.length; h++) {
                            if (document.getElementsByClassName('cmty-post-html')[j].innerHTML.indexOf(terms[h])!==-1&&document.getElementsByClassName('cmty-post-html')[j].classList.contains("alreadychecked")===false) {
                                alert("warning!");
                                botcheck=true;
                                document.getElementsByClassName('cmty-post-html')[j].classList.add("alreadychecked");
                            }
                        }
                    }
                }

                if (botcheck) {b.value+=randomReply(0,true);}
                b.value += randomReply(l);
                var c = document.getElementsByClassName("cmty-submit-button")[0];
                c.click();

                document.getElementsByClassName("cmty-topic-mini-reply")[0].innerHTML = "Next post in "+Math.floor(newDelay/1000)+" seconds";

                document.getElementsByClassName("cmty-cancel-posting-x")[0].click();
                if (document.getElementsByClassName("aops-modal-btn btn btn-primary").length>0) {
                    document.getElementsByClassName("aops-modal-btn btn btn-primary")[0].click();
                    document.getElementsByClassName("aops-modal-btn btn btn-primary")[0].click();
                }
            }
            if(localStorage.getItem('topicspamming')==='true'&&window.location.href.indexOf("community/c")!==-1&&localStorage.getItem('windowlocation').indexOf(window.location.href)!==-1){
                var a = document.getElementsByClassName("cmty-new-topic-button cmty-new-topic-target cmty-icon-w-text ")[0];
                a.click();
                var b = document.getElementsByClassName("cmty-post-textarea")[0];
                b.value = "mwahahahahaha";
                var c = document.getElementsByClassName("cmty-subject-input")[0];
                c.value = "heh this is fun";
                var d = document.getElementsByClassName("cmty-submit-button")[0];
                d.click();
                var e = document.getElementsByClassName("aops-modal-btn btn btn-primary")[0];
                e.click();
            }
        }, i*localStorage.getItem('randomDelay'));
    }
}());