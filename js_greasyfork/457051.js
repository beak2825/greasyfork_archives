// ==UserScript==
// @name         FAUCET
// @namespace    AUTOROTATORFAUCET
// @version      1.0
// @description  Script to claim faucets
// @author       Saputra
// @match        https://claimbits.net/*
// @match        https://earnbitmoon.club/*
// @match        https://earnbitmoon.club*
// @match        https://macrobits.io*
// @match        https://macrobits.io/*
// @match        https://qashbits.com*
// @match        https://claimfreebits.xyz/*
// @match        https://coinadster.com/*
// @match        https://faucetsfly.com/*
// @match        https://bitdaddy.cash/*
// @connect      bitdaddy.cash
// @connect      claimbits.net
// @connect      earnbitmoon.club
// @connect      macrobits.io
// @connect      qashbits.com
// @connect      claimfreebits.xyz
// @connect      coinadster.com
// @connect      faucetsfly.com
// @grant        GM_xmlhttpRequest
// @license MIT

// ==/UserScript==
(function() {
    'use strict';
    const valdelay = 5 ; // Change the number from 5 to 10 or 20 if you have issues like Your action marked Suspicious,Don't try to bypass ,Don't use Speedster, etc
    const valbwall = 5 ; // if you have any other problem apart from bitswall , please leave your feedback
    const RexBp = new RegExp(/^\?([^&]+)/);
    const bp = query => document.querySelector(query);
    const elementExists = query => bp(query) !== null;
    const domainCheck = domains => new RegExp(domains).test(location.host);
    function click(query) {bp(query).click();}
    function submit(query) {bp(query).submit();}
    function clickIfElementExists(query, timeInSec = 1, funcName = 'setTimeout') {if (elementExists(query)) {window[funcName](function() {click(query);}, timeInSec * 1000);}}
    function Captchasub(query, act = 'submit', timeInSec = 0.5) {if (elementExists(query)) {var timer = setInterval(function() {if (window.grecaptcha && !!window.grecaptcha.getResponse?.()) {bp(query)[act](); clearInterval(timer);}}, timeInSec * 1000);}}
    function Captchaklik(query, act = 'click', timeInSec = 1) {if (elementExists(query)) {var timer = setInterval(function() {if (window.grecaptcha && !!window.grecaptcha.getResponse?.()) {bp(query)[act](); clearInterval(timer);}}, timeInSec * 1000);}}


    //Block All Pop ups
unsafeWindow.open = function(){};

    //List of the faucet websites
    //Comment the lines of url if you don't use them
    var websiteData = [

        {url : "https://claimbits.net/faucet.html"},
        {url : "https://earnbitmoon.club/"},
        {url : "https://macrobits.io/claims.html"},
        {url : "https://qashbits.com/"},
        {url : "https://claimfreebits.xyz/"},
        {url : "https://coinadster.com/faucetz.html"},
        {url : "https://faucetsfly.com/roll.html"},
        {url : "https://bitdaddy.cash/"},
    ];

    //Message selectors are for success or failure to move on to the next website
    //Add only domain name in website as mentioned below. Follow the same pattern.
    //Use arrays wherever it is required
    var websiteMap = [

       {website : ["claimbits.net","earnbitmoon.club"],
         defaultButtonSelectors: ["#claimFaucet > button"],
         toggleCaptchaSelector:["#toggleCaptcha"],
         toggleCaptchaSelectorIndex: 1,
         captchaButtonSubmitSelector: "#rollFaucet > button",
         allMessageSelectors: [".alert.alert-success",".alert.alert-danger"],
         messagesToCheckBeforeMovingToNextUrl: ["can claim again","you won"],
         timeoutbeforeMovingToNextUrl: 140000},

       {website : ["faucetsfly.com","bitdaddy.cash"],
         defaultButtonSelectors: ["#claimFaucet > button"],
         toggleCaptchaSelector:[".form-control.form-control-sm.custom-select.mb-1"],
         toggleCaptchaSelectorIndex: 0,
         captchaButtonSubmitSelector: "#claimFaucet .btn.btn-danger.btn-md.w-100.mt-2",
         allMessageSelectors: [".alert.alert-success",".alert.alert-danger"],
         messagesToCheckBeforeMovingToNextUrl: ["can claim again","you won"],
         timeoutbeforeMovingToNextUrl: 140000},

       {website : ["coinadster.com"],
         defaultButtonSelectors: ["#claymFaucet > button"],
         toggleCaptchaSelector:["#toggle22Captcha"],
         toggleCaptchaSelectorIndex: 1,
         captchaButtonSubmitSelector: "#rollFaucet > button",
         allMessageSelectors: [".alert.alert-success",".alert.alert-danger"],
         messagesToCheckBeforeMovingToNextUrl: ["can claim again","you won"],
         timeoutbeforeMovingToNextUrl: 140000},

        {website : ["macrobits.io"],
         defaultButtonSelectors: ["#claimFaucet > button"],
         toggleCaptchaSelector:[".form-control.form-control-sm.custom-select.mb-1"],
         toggleCaptchaSelectorIndex: 1,
         captchaButtonSubmitSelector: "#captchaModal div.modal-body > div button",
         allMessageSelectors: [".alert.alert-success",".alert.alert-danger"],
         messagesToCheckBeforeMovingToNextUrl: ["can claim again","you won"],
         timeoutbeforeMovingToNextUrl: 140000},

        {website : ["claimfreebits.xyz"],
         toggleCaptchaSelector:[".form-control.form-control-sm.custom-select.mb-1"],
         toggleCaptchaSelectorIndex: 1,
         captchaButtonSubmitSelector: ".btn.btn-danger.btn-md.w-100.mt-2",
         allMessageSelectors: [".alert.alert-success",".alert.alert-danger"],
         messagesToCheckBeforeMovingToNextUrl: ["can claim again","you won"],
         timeoutbeforeMovingToNextUrl: 140000},

        {website : "qashbits.com",
         defaultButtonSelectors: [".btn.btn-danger.btn-md.w-100.mt-2"],
         captchaButtonSubmitSelector: ".btn.btn-danger.btn-md.w-100.mt-2",
         allMessageSelectors: [".alert.alert-success",".alert.alert-danger","script",".text-center"],
         messagesToCheckBeforeMovingToNextUrl: ["claim again in","you won","You reached the maximum"],
         additionalFunctions: qashbit,
         timeoutbeforeMovingToNextUrl: 140000},

        {website: "ptcbits.com",
         defaultButtonSelectors: [".form-group.text-center .btn.shadow-hover.btn-lg.btn-gradient-03.next-button.ripples"],
         timeoutbeforeMovingToNextUrl: 50000},

    ];

    //HtmlEvents dispatcher
    function triggerEvent(el, type) {
        try{
            var e = document.createEvent('HTMLEvents');
            e.initEvent(type, false, true);
            el.dispatchEvent(e);
        }catch(exception){
            console.log(exception);
        }
    }

    function toggleCaptcha(selector, index){
        if( document.querySelector(selector)){
            document.querySelector(selector).selectedIndex = index;
            var targetNode = document.querySelector(selector);
            if (targetNode) {
                setTimeout(function() {
                    triggerEvent(targetNode, 'change');
                }, 5000);
            }
        }
    }

    //Check if a string is present in Array
    String.prototype.includesOneOf = function(arrayOfStrings) {

        //If this is not an Array, compare it as a String
        if (!Array.isArray(arrayOfStrings)) {
            return this.toLowerCase().includes(arrayOfStrings.toLowerCase());
        }

        for (var i = 0; i < arrayOfStrings.length; i++) {
            if (this.toLowerCase().includes(arrayOfStrings[i].toLowerCase())) {
                return true;
            }
        }
        return false;
    }

    var websiteDataValues = {};
    var clicked = false;

    //Get selector details from the websiteMap
    for (let value of Object.values(websiteMap)) {
        if(window.location.href.includesOneOf(value.website)){
            websiteDataValues.inputTextSelector= value.inputTextSelector;
            websiteDataValues.inputTextSelectorButton = value.inputTextSelectorButton;
            websiteDataValues.defaultButtonSelectors = value.defaultButtonSelectors;
            websiteDataValues.claimButtonSelector = value.claimButtonSelector;
            websiteDataValues.captchaButtonSubmitSelector = value.captchaButtonSubmitSelector;
            websiteDataValues.loginSelectors = value.loginSelectors;
            websiteDataValues.allMessageSelectors = value.allMessageSelectors;
            websiteDataValues.messagesToCheckBeforeMovingToNextUrl = value.messagesToCheckBeforeMovingToNextUrl;
            websiteDataValues.withdrawPageUrl = value.withdrawPageUrl;
            websiteDataValues.withdrawEnabled = value.withdrawEnabled;
            websiteDataValues.balanceSelector = value.balanceSelector;
            websiteDataValues.withdrawMinAmount = value.withdrawMinAmount;
            websiteDataValues.successMessageSelectors = value.successMessageSelectors;
            websiteDataValues.toggleCaptchaSelector = value.toggleCaptchaSelector;
            websiteDataValues.toggleCaptchaSelectorIndex = value.toggleCaptchaSelectorIndex;
            websiteDataValues.timeoutbeforeMovingToNextUrl = value.timeoutbeforeMovingToNextUrl;
            websiteDataValues.additionalFunctions = value.additionalFunctions;
            break;
        }
    }

    //Identify which coin to input, based on the url input
    //If the URL does not contain the coin, then use the default from the domain name
    var count = 0;
    var addressAssigned = false;
    for (let value of Object.values(websiteData)) {
        count = count + 1;
        if(window.location.href.includes("/" + value.regex)){
            addressAssigned = true;
            break;
        }
    }

    //If URL does not have coin, check the default from the domain name
    if(!addressAssigned){
        count = 0;
        for (let value of Object.values(websiteData)) {
            count = count + 1;
            if(value.url.includes(window.location.hostname)){
                break;
            }
        }
    }


    //Get the next Url from the website data map
    async function getNextUrl(){

        //Go to the beginning if the end of the array is reached
        if(count >= websiteData.length){
            count = 0;
            websiteDataValues.nextUrl = websiteData[count].url;
        }else{
            websiteDataValues.nextUrl = websiteData[count].url;
        }

        //Ping Test to check if a website is up before proceeding to next url
        pingTest(websiteDataValues.nextUrl);
    }

    var isNextUrlReachable = false;
    //Get the next Url from the website
    function pingTest(websiteUrl) {
        console.log(websiteUrl);
        GM_xmlhttpRequest({
            method: "GET",
            url: websiteUrl,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            timeout: 5000,
            onload: function(response) {
                //Website is reachable
                isNextUrlReachable = true;
            },
            onerror: function(e) {
                count=count+1;
                getNextUrl();
            },
            ontimeout: function() {
                count=count+1;
                getNextUrl();
            },
        });

    }


    async function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }


    var movingToNextUrl = false;
    async function goToNextUrl() {
        console.log("Going to next Url");
        if(!movingToNextUrl){
            movingToNextUrl = true;
            getNextUrl();
            while (!isNextUrlReachable) {
                await delay(3000);
            }
            window.location.href = websiteDataValues.nextUrl;
        }
    }

    async function goToWithdrawPage() {
        if(!movingToNextUrl){
            movingToNextUrl = true;
            window.location.href = websiteDataValues.withdrawPageUrl;
        }

    }


    //Default Setting: After 180 seconds go to next Url
    var delayBeforeMovingToNextUrl = 180000;
    if(websiteDataValues.timeoutbeforeMovingToNextUrl){
        delayBeforeMovingToNextUrl = websiteDataValues.timeoutbeforeMovingToNextUrl;
    }

    setTimeout(function(){
        goToNextUrl();
    },delayBeforeMovingToNextUrl);


    //Returns true if message selectors are present
    function messageSelectorsPresent(){
        if(websiteDataValues.allMessageSelectors){
            for(var j=0;j<websiteDataValues.allMessageSelectors.length;j++){
                for(var k=0; k< document.querySelectorAll(websiteDataValues.allMessageSelectors[j]).length;k++){
                    if(document.querySelectorAll(websiteDataValues.allMessageSelectors[j])[k] &&
                       (document.querySelectorAll(websiteDataValues.allMessageSelectors[j])[k].innerText.includesOneOf(websiteDataValues.messagesToCheckBeforeMovingToNextUrl) ||
                        (document.querySelectorAll(websiteDataValues.allMessageSelectors[j])[k].value &&
                         document.querySelectorAll(websiteDataValues.allMessageSelectors[j])[k].value.includesOneOf(websiteDataValues.messagesToCheckBeforeMovingToNextUrl)))){
                        return true;
                    }
                }
            }
        }
        return false;
    }

    //Returns true if message selectors are present
    function successMessageSelectorsPresent(){
        if(websiteDataValues.successMessageSelectors){
            for(var j=0;j<websiteDataValues.successMessageSelectors.length;j++){
                for(var k=0; k< document.querySelectorAll(websiteDataValues.successMessageSelectors[j]).length;k++){
                    if(document.querySelectorAll(websiteDataValues.successMessageSelectors[j])[k] && document.querySelectorAll(websiteDataValues.successMessageSelectors[j])[k].innerText.includesOneOf(websiteDataValues.messagesToCheckBeforeMovingToNextUrl)){
                        return true;
                    }
                }
            }
        }
        return false;
    }


    function minijobwork(){
        if( document.querySelector("#count") && document.querySelector("#count").style.display != 'none') {
            websiteDataValues.messagesToCheckBeforeMovingToNextUrl = [":"];
        }

    }


    function qashbit(){
        if(document.querySelector("#dropdownList")){
            document.querySelector("#dropdownList").click();
        }
        if(document.querySelector("#claim div.modal-body > div.ad_box center li > a") &&
           document.querySelector("#claim div.modal-body > div.ad_box center li > a").innerText == "reCAPTCHA"){
            document.querySelector("#claim div.modal-body > div.ad_box center li > a").click()
        }
    }


    setTimeout(function(){

        if( websiteDataValues.additionalFunctions){
            websiteDataValues.additionalFunctions();
        }


        if(websiteDataValues.withdrawEnabled){
            if(websiteDataValues.balanceSelector && document.querySelector(websiteDataValues.balanceSelector)){
                var currentBalance = document.querySelector(websiteDataValues.balanceSelector).innerText;
                if(currentBalance > websiteDataValues.withdrawMinAmount && !window.location.href.includes(websiteDataValues.withdrawPageUrl)) {
                    goToWithdrawPage();
                }

            }else{
                if(successMessageSelectorsPresent()){
                    goToWithdrawPage();
                }
            }
        }

        //Look for all the default messages or errors before proceeding to next url
        //For other languages difference in the length of the strings can be compared or visibility of the style element
        if(!movingToNextUrl && messageSelectorsPresent()){
            goToNextUrl();
        }
        //Check for all the default button selectors and click
        //This will only click the first selector found, so mention the selectors with parent element wherever required
        if(!movingToNextUrl && websiteDataValues.defaultButtonSelectors){
            for(var i=0;i<websiteDataValues.defaultButtonSelectors.length ;i++){
                if(document.querySelector(websiteDataValues.defaultButtonSelectors[i])){
                    triggerEvent(document.querySelector(websiteDataValues.defaultButtonSelectors[i]), 'mousedown');
                    triggerEvent(document.querySelector(websiteDataValues.defaultButtonSelectors[i]), 'mouseup');
                    document.querySelector(websiteDataValues.defaultButtonSelectors[i]).click();
                    break;
                }
            }
        }

        if(!movingToNextUrl && websiteDataValues.toggleCaptchaSelector && Number.isInteger(websiteDataValues.toggleCaptchaSelectorIndex)){
            toggleCaptcha(websiteDataValues.toggleCaptchaSelector,websiteDataValues.toggleCaptchaSelectorIndex);
        }


        //Input the address and click the login button
        if(!movingToNextUrl && document.querySelector(websiteDataValues.inputTextSelector)){
            document.querySelector(websiteDataValues.inputTextSelector).value = websiteDataValues.address;
            setTimeout(function(){
                if(websiteDataValues.inputTextSelectorButton && document.querySelector(websiteDataValues.inputTextSelectorButton)){
                    document.querySelector(websiteDataValues.inputTextSelectorButton).click();
                }

            },5000);
        }

        // Captcha Mode
    // ============================================
    let captchaMode = ['#_mform', '#userForm', '#link-view', '#frmprotect', '#ShortLinkId', '#captcha', '#submit-form', '#lview > form', '#file-captcha', '#btget > form', 'div#login form', 'F1', '#short-captcha-form', '#wpsafelink-landing', '.col-12 > form:nth-child(1)', '.col-md-4 > form:nth-child(1)', '.col-md-6 > form:nth-child(4)', '.contenido > form:nth-child(2)', '#main > div:nth-child(4) > form:nth-child(1)', 'div.col-md-12:nth-child(3) > form:nth-child(1)', '.content > div:nth-child(4) > form:nth-child(1)', '#showMe > center:nth-child(4) > form:nth-child(1)', '.sect > div:nth-child(1) > center:nth-child(7) > form:nth-child(1)', '#showMe > center:nth-child(1) > center:nth-child(4) > form:nth-child(1)', '#adb-not-enabled > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(5) > form:nth-child(1)', 'button#continue.btn.btn-primary.btn-captcha', '.m-2.btn-captcha.btn-outline-primary.btn', '#yuidea-btn-before.yu-btn.yu-blue', '#yuidea-btn-after.yu-blue.yu-btn', '#fauform'];
    for (let i = 0; i < captchaMode.length; i++) {Captchasub(captchaMode[i]);}
    let klikMode = ['button#continue.btn.btn-primary.btn-captcha', '.m-2.btn-captcha.btn-outline-primary.btn', '#yuidea-btn-before.yu-btn.yu-blue', '#yuidea-btn-after.yu-blue.yu-btn', '#submitBtn'];
    for (let i = 0; i < klikMode.length; i++) {Captchaklik(klikMode[i]);}

        //Click the form button after solving captcha
        //Works for both recaptcha and hcaptcha

        var captchaInterval = setInterval(function(){
            try{
                if(!clicked && unsafeWindow.grecaptcha && unsafeWindow.grecaptcha.getResponse().length > 0){
                    document.querySelector(websiteDataValues.captchaButtonSubmitSelector).click();
                    clicked = true;

                    clearInterval(captchaInterval);
                    setTimeout(function(){
                        if(messageSelectorsPresent()){
                            goToNextUrl();
                        }
                    },5000);
                }
            }catch(e){

            }

            for(var hc=0; hc < document.querySelectorAll("iframe").length; hc++){
                if(! clicked && document.querySelectorAll("iframe")[hc] &&
                   document.querySelectorAll("iframe")[hc].hasAttribute("data-hcaptcha-response") &&
                   document.querySelectorAll("iframe")[hc].getAttribute("data-hcaptcha-response").length > 0) {
                    document.querySelector(websiteDataValues.captchaButtonSubmitSelector).click();
                    clicked = true;
                    clearInterval(captchaInterval);
                    setTimeout(function(){
                        if(messageSelectorsPresent()){
                            goToNextUrl();
                        }
                    },5000);
                }
            }

        },5000);


    },7000);

    if (window.location.hostname==('solvemedia.com') != -1 ){let PHRASES=["1.21 gigawatts","4 8 15 16 23 42","5 dollar shake","6 feet of snow","8th chevron","a wild captcha appears","abelian grape","abide with me","abracadabra","absent without leave","absolute zero","accidentally on purpose","ace of spades","across the board","adapt improve","adapt improve succeed","against the grain","agree to disagree","al capone","all dancing","all grown up","all of the above","all singing","all your base","allergic reaction","almost got it","always there","am i happy","anchors away","and that's the way it is","angel food","another castle","anti dentite","apple juice","apple pie","apple sauce","april may","april showers","are we there yet","are you ready","are you the keymaster","army training","army training sir","around here","as i see it","as you wish","ask questions","attila the hun","auto driving","awesome dude","awesome sauce","azgoths of kria","babel fish","baby blues","baby boomer","baby steps","back to basics","back track","background noise","bacon and eggs","bad books","bad egg","bait the line","baked in a pie","bald eagle","ball of confusion","banana bread","banana split","banana stand","bangers and mash","barber chair","barking mad","basket case","bated breath","bath towel","bath water","battle royale","bazinga","be careful","be mine","be my friend","be nice","be nimble be quick","be serious now","beach ball","bean town","beans and rice","beautiful friendship","bee line","been there","beer in a bottle","beer in the bottle","bees knees","beg the question","believe me","belt up","berlin wall","best fit line","best seller","better call saul","better half","better next time","beyond me","big brother","big kahuna burger","big nose","big screen","bigger in texas","bike rider","bird cage","birthday boy","birthday girl","bizarro jerry","black and white","black coffee","black gold","black jack","black monday","blahblahblah","blaze a trail","bless you","blinded by science","blog this","blood type","blue cheese","blue ribbon","blue sky","bob loblaw","body surfing","boiled cabbage","bon voyage","bond james bond","bone dry","bonus points","bonus round","book reading","book worm","boomerang","born to run","bots are bad m'kay","bottled water","bowties are cool","box jelly fish","box kitty","box of chocolates","braaains","brand spanking new","bread of life","break the ice","brick house","broken heart","broken record","bruce lee","brush your teeth","buckle your shoe","buffalo wing","bunny rabbit","burger with fries","burning oil","burnt sienna","butler did it","butter side down","button fly","buy some time","by and large","by the board","by the book","by the seashore","cabbage borsht","cabbage stew","caesar salad","call me","call me maybe","can i love","can you see","candy apple","candy cane","capital gain","captcha in the rye","car trouble","carbon copy","carbon footprint","card sharp","card-sharp","carpe diem","carry a towel","carry on","cary grant","case closed","cat got your tongue","catch the man","cats and dogs","cats pajamas","chaise lounge","challenge accepted","change the world","change yourself","channel surfing","charley horse","charlie bit me","charm offensive","charmed life","check your coat","check your work","cheese burger","cheese fries","cheese steak","cherry on top","chicken feed","chicken noodle","chicken salad","chicken soup","chin boy","chit chat","choco lazer boom","chocolate cookie","chocolate milk","chow down","chuck norris","circle of life","civil war","clean and shiny","clean hands","clear blue water","clear sailing","click, click, click","cliff hanger","clod hopper","close quarters","cloud nine","clown around","coffee can","cold comfort","cold feet","cold hat","cold shoulder","cold turkey","coleslaw","collaborate and listen","colored paper","come along","come along pond","come back","come clean","come on down","come what may","comfort zone","comma comma","common law","complex number","construction ahead","cookie cutter","cool heads prevail","cop an attitude","cor blimey","cordon bleu","corned beef","cotton on","count your change","counting sheep","covered bridge","crab cake","crayola","cream and sugar","create new things","creative process","creative vision","creepy crawler","crime of passion","crocodile tears","crop up","cross the road","cross the rubicon","cubic spline","cucumber sandwich","cup cake","cupid's arrow","curate's egg","curry favour","cut and run","cut the mustard","dalek asylum","dallas texas","dance all night","danish robot dancers","dark horse","das oontz","david after dentist","dead battery","dead ringer","deal me in","dear cookie","dear mr vernon","dear sir","deep thought","deep waters","dharma initiative","diced onion","diddly squat","digital clock","ding a ling","dinner bell","dinosaur spaceship","dish water","do a little dance","do be do be do","do it now","do more situps","do not touch","do or do not","do unto others","do wah ditty","do you believe in miracles","do you love me","doctor caligari","doctor who","doctor who?","doe a deer","dog days","dog's breakfast","dog's dinner","dogapus","dogs and cats living together","dollar bill","dollar signs","dollars to donuts","domestic spying","don't be late","don't count on it","don't dawdle","don't stop","don't waste time","done that","donkey's years","doodah man","double cross","double crossed","double dutch","double jump","double rainbow","double time","double whammy","down the hatch","down the rabbit hole","downward slope","drag race","dragon with matches","dragonfly","dramatic chipmunk","draw a blank","drawing board","dream big","drink milk","drive me to firenze","drop table users","drumhead","drummer boy","dry clean only","dueling banjos","dusk till dawn","dust bunny","dust up","duvet day","dynamo clock","ear candy","ear mark","ear muffs","easy as cake","easy as pie","easy peasy","easy street","eat cous cous","eat out","eat your dinner","eat your veggies","eat your vitamins","ecks why zee","edgar degas","egg on","eggs ter minate","eighty six","electro head","elevator going up","emperor's clothes","empire state of mind","end of story","english muffin","enjoy life","ermahgerd capcher","evil eye","evil genius","exceedingly well read","exclamation","exercise more","extra cheese","face the music","face to face","fade away","fair and square","fair play","fairy godmother","fairy tale","fait accompli","fall guy","falling pianos","fancy free","fancy pants","far away","farsical aquatic ceremony","fashion victim","fast and loose","fast asleep","father time","father uncle","fathom out","fava beans","feeding frenzy","feeling blue","fellow traveller","fezes are cool","field day","fifth column","fill it up","filthy dirty mess","filthy rich","finagle's law","final answer","finger lickin good","fire brim stone","firecracker","first contact","first post","first water","first world","fish and chips","fish on","fishy smell","flag day","flat foot","flat out","flat tire","flipadelphia","flipflops","flux capacitor","follow me","folsom prison","fool's paradise","fools gold","for keeps","for sure","for the birds","for the gripper","forbidden fruit","foregone conclusion","forget this","forget you","fork knife spoon","forty two","foul play","four by two","frabjous day","france","frankly my dear","free hat","freezing temperatures","french fried","french fries","french phrases","fresh water","fried ices","fried rice","friend zone","frozen peas","fruit salad","fuddy duddy","full house","full monty","full of stars","full stop","full tilt","fun with flags","funny farm","fusilli jerry","fuzzy wuzzy","gadzooks","game is up","gangnam style","garden of eden","garlic yum","gathers moss","gee louise","gee whiz","geez louise","gene parmesan","general tso","generation x","genghis khan","george washington","get out","get over it","get well","get your goat","giant bunny rabbit","giant panda","giddy goat","gift horse","gimme pizza","ginger bread","give or take","glass ceiling","glazed donut","global warming","go berserk","go further","go gadget go","goes to eleven","gold medal","gold record","golly jeepers","gone dolally","gone fishing","good afternoon","good as gold","good buddy","good day","good evening","good for nothing","good grief","good job","good luck","good morning","good night","good night and good luck","good riddance","good samaritan","good work","goody goody gumdrops","goody gumdrop","goody two shoes","goosebumps","gordon bennett","got my mojo","gotham city","gothic arch","gothic church","grain of salt","grand slam","grape soda","grass up","graveyard shift","gravy train","grease the skids","greased lightning","great scott","great unwashed","gregory peck","gridlock","grilled cheese","groundhog day","grumpy cat","guinea pig","guitar player","gum shoe","gung ho","habsons choice","had a great fall","had me at hello","hairy eyeball","halcyon days","half done","half empty","half full","half inch","hallowed ground","halp meh","ham and cheese","hamburger bun","hammer time","hand over fist","hands down","hangers and mash","happy anniversary","happy blessings","happy clappy","happy retirement","happy trails","hard captcha is hard","hard cheese","hard lines","hard sharp","hardened prestoopnicks","harp on","haste makes waste","hat head","hat trick","have a purpose","have an inkling","have courage","have fun","he loves her","head case","head honcho","head over heels","heads up","health food","healthy food","hear hear","hear me roar","heart break","heart strings","heart's content","heartache","heat up","heated debate","heavens to betsy","heavy metal","heebie jeebies","hello newman","hello sweetie","hello watson","hello world","here or there","here's johnny","hey brother","higgledy piggledy","higgs boson","high def","high five","high flyer","high horse","high sleeper","high time","him with her","hissy fit","history repeats itself","hit the hay","hit the sack","hoagie roll","hobby horse","hobson's choice","hocus pocus","hoi polloi","hoity-toity","hold your horses","hold your tongue","home james","honey mustard","hooray henry","hops a daisy","horse and cart","horse's mouth","hot blooded","hot diggity dog","hot dog roll","hot pola","hot sauce","hover hand","how about lunch","how about that","how are you","how interesting","how now, brown cow","how quaint","how sweet","how's it going","howdy partner","hug me","huggle muggle","hulk smash","hunky-dory","hush puppies","i am captcha","i am fine","i am here","i can do this","i can fix it","i have fallen","i know nothing","i like humans","i like people","i like turtles","i like you","i love deadlines","i love lamp","i love you","i made tea","i moustache you why","i saw that","i see","i think i am","i think i can","i think so","i want control","i'll make tea","i'm batman","i'm blessed","i'm blushing","i'm cold brr","i'm only human","i'm so cold","i'm sorry","i'm sorry dave","i'm yours","ice to meet you","idk my bff jill","if it fits","im cold. brr","imagine inspire create","in a box","in limbo","in over my head","in spades","in stitches","in the air","in the box","in the cart","in the club","in the doldrums","in the limelight","industrial revolution","infra dig","inside out","is it enough","is it hot","is it hot?","is it hot in here","is it plugged in","is low","it doesn't count","it happens","it hurts","it is certain","it is enough","it will pass","it's over","it's super effective","ivory tower","jabber wocky","jack be nimble","jam tomorrow","jay gatsby","jerk store","jerry built","jimmy cricket","jimmy horner","john lennon","john steinbeck","jump higher","jump over","jump the candlestick","jump the gun","jumping jack","june july","just dance","just deserts","just drive","just friends","just in time","kangaroo count","karma points","keep calm","keyboard","keyboard cat","khyber pass","kick the can","kick your heels","kindness of strangers","king arthur","kiss me","kitten mittens","kitty kat","klatu berada nikto","knick knack","knock at the door","knock back","knock knock knock penny","knock off","knock on wood","know the ropes","know thy self","know your paradoxes","know your rights","knuckle down","kosher dill","kundalini express","labour of love","ladies first","lager frenzy","lame duck","lardy-dardy","lark about","laser beams","last straw","later gator","laugh at me","law of sines","lawn giland","lazy sunday","leap higher","leaps and bounds","learn challenge improve","learn from mistakes","learn succeed","learn the ropes","learn, advance","leave britney alone","leave me alone","left or right","left right","lefty loosey","less is more","let go","let it be","let me know","let me out","lets eat","level playing field","liberty bell","library book","lickety split","lie low","light sleeper","like a boss","like the dickens","linear algebra","little bird told me","little bobby tables","little did he know","little sister","live free","live in the moment","live in the now","live life","live long + prosper","live love internet","live love type","live transmission","live with purpose","live your dream","living daylights","living things","lizard poisons spock","lo and behold","loaf of bread","local derby","lol cat","lollerskates","lolly pop","london calling","long division","long in the tooth","look away","look before crossing","look both ways","looking glass","lose face","lost love","loud music","love is automatic","love is blind","love life","love me","love you","love-hate","lovey dovey","lucille 2","lucky you","ludwig van","lumpy gravy","lunatic fridge","lunch time","lunch tuesday","mad hatter","mad science","magic decoder ring","magic eight ball","magical realism","magnetic monopole","main chance","major intersection","make a bee line","make haste","make it so","make my day","many happy returns","many wishes","maple syrup","marble rye","marcia marcia marcia","mare's nest","margin of error","mark it zero","market forces","marry me","mars rover","math test","mayan ruins","mea culpa","meat and drink","meat with gravy","meddling kids","media frenzy","melody pond","men in suits","mend fences","meow meow","metropolis","mexican wave","mickey finn","miles to go","milk was a bad choice","milkshake","million dollars","miloko plus","miloko plus vellocet","mimsy borogoves","minced oaths","mind the gap","minty fresh","mish-mash","miss you","mister wilson","modern love","moe's tavern","mom and dad","money lender","moo shoo pork","moon cheese","moot point","more better","more chocolate","more coffee","more cow bell","more internets","morning person","most interesting man","most likely","mother country","mother earth","motley crew","mouth watering","move along","move mountains","move over","moveable feast","movers and shakers","movie star","mrs robinson","muffled rap music","multi pass","mum's the word","mumbo jumbo","murphy's law","mushy peas","music machine","mustachioed","my bad","my beating heart","my better half","my dear watson","my friends can't dance","my mind's eye","my sources say no","naise cain","namby-pamby","name drop","nanoo nanoo","nap time","narrow minded","nautical phrases","ne regrets","near tannhauser gate","neart strings","neckbeard","need a bigger boat","needs must","nercolas cerg","nest egg","never give up","never gonna give you up","never mind","never quit","new york city","nice job","nice marmot","nice to meet you","night owl","nip and tuck","nitty gritty","no brainer","no crying in baseball","no dice","no friend of mine","no holds barred","no means no","no regrets","no soup for you","no spoon","no stinking badges","no time to explain","no way","nobody home","none of the above","nope chuck testa","nose bleed","nosy parker","not a bot","not in kansas","not yet","now and forever","now look here","nth degree","nul points","numa numa","nut case","nutrition","nyan cat","nyquist rate","of course","off the record","oh brother","oh em gee","oh hai","oh sigh","oh so close","oh yes","oh you","oh,you","oh, wait","okey dokey","old hat","old man winter","old shoe","om nom nom","on a boat","on cloud nine","on the ball","on the qt","on-off","once again","once upon a time","one day more","one fell swoop","one hit wonder","one small step for man","one stop shop","one way","one way street","one, two, three","only way to be sure","oontz oontz","oops a daisy","open season","open sesame","orange juice","other worldly","out of sorts","out of toner","outlook good","over the hill","over the moon","over the top","over there","oxford university","oxo cube","paint it red","pandora's box","pants on the ground","paper jam","paper plate","partial derivative","partly cloudy","party on garth","passing lane","patch of grass","path less taken","patience child","patty cake","pay the ferryman","pea brain","pearly whites","peg out","pell mell","penny loafer","people like me","pepe silvia","pepper pot","pepperoni pizza","peppers and onions","perfect world","pester power","peter out","philadelphia","phone home","pick me","pick up sticks","pickle juice","pickled peppers","picture perfect","pie are round","pie are squared","pie chart","piece of cake","pig's ear","piggyback","pin money","pipe down","pipe dream","piping hot","pitter patter","pizza topping","plain sailing","play a game","play again","play ball","play hookey","play it again sam","pleased as punch","plenty of time","plugged nickel","plus or minus","pocket sized","pod bay doors","poetic justice","point blank","point to point","points dont matter","points font matter","poison apple","political party","politicaly correct","poly's cracker","pond life","pool boy","pool hall","pool house","poor house","pork pies","pound cake","power dressing","power tool","practice makes perfect","press into service","prime time","primrose path","print out","print paper","printer paper","propane accessories","public good","pudding pops","puffy shirt","pumpkin pie","puppy dog","puppy love","push harder","push on","push the edge","push the envelope","pyrrhic victory","quality time","queen nefertiti","queen of hearts","queen's yacht","question everything","question mark","quid pro quo","quotations","rack and ruin","rack your brains","rain go away","rain tonight","rainy days","raise cain","raspberry tart","reach higher","read all over","read me, write me","read my mail","ready set go","real hoopy frood","real mccoy","red herring","red tape","red white and blue","red-handed","reduplicated phrases","remain calm","rent-a-swag","respect me","return to sender","reverse the polarity","rhino beetle","rhodeisland","rhyme nor reason","rhyming slang","rice and beans","rice job","ride the subway","riff-raff","right hand turn","right left","righty tighty","ring fencing","ring fenring","rinky-dink","rise and shine","river song","river styx","road apples","road less travelled","roast beef","robe of saffron","rocket science","rodents of unusual size","roflcopter","roll again","roll over","roller skates","rolling stone","rooftop","room for activities","roommate agreement","root beer float","rope burn","rosebud","rosie lea","rough diamond","round one","round robin","round tab1e","route one","row boat","roy g biv","royal flush","rubicon crossed","rule of chomio","rule of thumb","rum do","run amok","run away","run farther","run the gauntlet","run through","runny nose","saber tooth","sacred cow","safe streets","safer streets","safety first","salad days","salt and pepper","salty cheese","same same","sandy beach","saturday detention","saucy","sauer kraut","sausages","save face","save it","save our bluths","savoir faire","sax and violins","say cheese","school is cool","science class","science fair","science it works","science project","scot free","screw driver","sea change","sea shell","sea shore","seattle","see red","see ya","see-saw","seek beauty","seems legit","seize the day","select from table","send packing","senior citizen","seven ate nine","seven signs","seze the day","shake a leg","shaken not stirred","shakers and movers","shane come back","sharp pencil","sharp stick","she loves him","she sells","she sells seashells","she's a witch","sheldon alpha five","shilly-shally","ship shape","shoe shine","shoes shine","shoot through","shoulder of orion","show down","shuffle the deck","sick puppy","signal your turns","signs point to yes","silence is golden","silver bells","silver bullet","silver hoing","silver lining","silver spoon","sin cos tan","since when","sing a song","sixes and sevens","sixteen point turn","skidrow","skip a turn","sky's the limit","skynet is watching","skynet knows","skynet watches","sleep tight","sleepy hollow","slimy goop","slippery slope","sloane ranger","slow down","slow milenky lizards","slush fund","slythy toves","small fries","small fry","smart casual","smart phone","smashed potato","smell that","smelling salt","smoked salmon","snake eyes","snapshot","snare drum","sneezing baby panda","snoop lion","snow drift","snow flurry","snow shovel","so far away","so life like","so so","sod's law","soft kitty warm kitty","soft kitty, warm kitty","somebody that i used to know","sonic screw driver","sorry dave","sorry sight","souffle girl","sound bite","sound of sirens","sound out","sour grapes","space is big","space plumber","spangled banner","speeding bullet","spelling bee","spend time","spick and span","spicy","spicy hot","spin doctor","spitting feathers","spitting image","spoilers","spread the net","spring water","spruce up","square meal","square one","squeaky clean","squirrel friend","st johns bay","stalla stella","stand and deliver","stand by me","stand up guy","star spangled","star wars kid","start from scratch","stay safe","steak and eggs","steam punk","steering wheel","step back","step over","steve holt","steve jobs","sticky wicket","sting like a bee","stinking rich","stinky feet","stone soup","stone's throw","stony hearted","stool pigeon","stop waisting time","stranger danger","streams of oceanus","strike a match","strike three","string along","string cheese","stuck in mud","stump up","sudo make sandwich","sulphur smell","summon inglip","sun tzu says","sunday","sunshine","super star","surf and turf","surface integral","swan song","sweet dreams","sweety pie","swirling vortex of entropy","taco tuesday","take a look","take an umbrella","take care","take it all","take out food","take potluck","take the cake","take umbrage","take wrong turns","taken aback","talk the talk","talk to strangers","talk turkey","tall building","tall story","tastes good","tastes like chicken","tea earl gray hot","tea leaf","tea with jam","tea with milk","tear us apart","technicolor yawn","teflon president","teh inter webs","ten four","tesla coil","thank you","thank you, come again","that escalated quickly","that hurts","that will not work","that's a fact jack","that's all folks","that's enough","that's hot","that's it","that's my spot","that's right","the bee's knees","the bible","the big apple","the big cheese","the big easy","the cat lady","the cats cradle","the dennis system","the dude abides","the extra mile","the next level","the nightman cometh","the one eyed man is a king","the other side","the tribe has spoken","the yellow king","there is no spoon","there is only zul","there once was","these parts","they are watching","they ate it","thick and thin","thin air","think create do","think green","think hard","think twice","thinking cap","third degree","thirty one days","this is it","this is not fake","this is sparta","this or that","this statement is false","three short words","three strikes","through the grapevine","thumbs up","thunder storm","ticked off","tickle the ivories","tickled ivories","tickled pink","tide over","tight lipped","time and paper","time circuits","time flies","time is an illusion","time lord","time machine","time will tell","times square","tinker's dam","to boot","toast points","toe the line","toe-curling","together again","too bad","too late","too many cooks","too many secrets","too salty","toodle oo","top dog","top drawer","top notch","top ten","topsy turvy","topsy-turvy","total shamble","towel dry","tower of strength","toy soldier","traffic jam","traffic light","train surfing","travel size","treat yoself","trick or treat","trickle down","trolololol","true blue","true life","trust me","tuckered out","tuna fish","tune in","turkey sandwich","turn signal","turn the tables","turn up trumps","twenty eight days","twenty four seven","twenty one","twenty three","two cents worth","two hands","two left feet","two tone","u jelly","umbrella corporation","uncharted island","uncle leo","under the sea","underpants","union jack","unlimited wishes","untied laces","until next time","until tomorrow","until tonight","up and away","up or down","upper crust","upper hand","ups a daisy","upside down","upvote this","upward slope","urban myth","usual suspects","uu dd lr lr ba","van surfing","vanilla ice cream","veg out","vegan diet","vegan zombie wants grains","vegetarian","very doubtful","very nice","vice versa","vicious cycle","video tape","vienna calling","virtue of necessity","vis a vis","vocal minority","vogon poetry","voigt kampf","vorpal sword","vote pancakes","wake of the flood","walk free","walk the plank","walk the walk","want more","warp speed","wash whites separately","watch c-beams glitter","watch me","watch out","water gate","wax poetic","way to go","way to go donny","we go forwards","we like the moon","weakest link","weasel words","welcome to earth","well done","well heeled","well isn't that special","well now","well read","weylan yutani","what even","what ever","what for","what if","what is for dinner","what is your quest","what should we call me","what to see","what's that","wheel group","when where","where to go","whet your appetite","whistle and flute","white as snow","white bread","white elephant","white rabbit","who am i","who are you","who is it","who you gonna call","who, what, where","whoa there","whole nine yards","whole shebang","whoopee cushion","whoops a daisy","wicked witch","wide berth","wild and crazy guys","wild and woolly","wild goose chase","wild west","willy nilly","win hands down","window dressing","wing it","winning","winter is coming","winter snow","wisdom of inglip","wisdom teeth","wishy-washy","with bells on","without a doubt","woof woof","word for word","words of wisdom","work out","would you believe","wright flyer","writing desk","x all the y","xylophone","yada yada","yadda yadda yadda","yeah right","year dot","yee haw","yelling goat","yellow belly","yes definitely","yes ma'am","yes sir","yes this is dog","you are happy","you are here","you can do this","you don't say","you first","you good","you have my stapler","you rock","you the man","you win","you're in my spot","you're not listening","you're welcome","zig zag","zombie attack","zombie prom","who what where",];
    function solvemed(b){var a=document.createElement("datalist");a.setAttribute("id","adcopy_phrases");for(var c=0;c<PHRASES.length;++c)a.appendChild(document.createElement("option")).appendChild(document.createTextNode(PHRASES[c]));b.parentNode.insertBefore(a,b.nextSibling);b.setAttribute("list",a.id);}for(var scripts=document.getElementsByTagName("script"),i=0;i<scripts.length;++i)if(scripts[i].src.indexOf("solvemedia.com")> -1){document.body.addEventListener("keydown",function c(a){if(/^adcopy_response/.test(a.target.id)){this.removeEventListener(a.type,c);var b=a.target;solvemed(b);b.blur();b.focus();}});break;}}

 })();