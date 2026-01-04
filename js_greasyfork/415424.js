// ==UserScript==
// @name         9anime Bingewatcher+ Prime
// @namespace    https://greasyfork.org/en/users/10118-drhouse
// @version      1.6
// @description  AutoPlay and auto-fullscreen 9anime videos
// @include      http*://9anime.to/*
// @include      http*://hydrax.net/*
// @include      https://streamtape.com/*
// @include      https://www*.mp4upload.com:*/*
// @include      https://www*.mp4upload.com*/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @author       drhouse
// @icon         https://www.google.com/s2/favicons?domain=9anime.to
// @downloadURL https://update.greasyfork.org/scripts/415424/9anime%20Bingewatcher%2B%20Prime.user.js
// @updateURL https://update.greasyfork.org/scripts/415424/9anime%20Bingewatcher%2B%20Prime.meta.js
// ==/UserScript==

(function($){

    var garbgarb2 = setTimeout(function(){ //title
        var aniName = $("#main > div > div.widget.player > div.widget-title > h1").text()
        if (aniName){
            localStorage['aniName'] = aniName;
            console.log(`%caniName = ${aniName}`, 'color: orange;');
            GM_setValue("aniName", aniName);
            clearInterval(garbgarb2);
        }
    }, 1000);

var garbgarba = setTimeout(function(){ //clicks
        $('#servers-container > div > div.widget-body > div > ul').find('a').attr('onclick',"javascript:window.open(this.getAttribute('href'),'_self')")
    }, 1000);
    var garbgarbb = setTimeout(function(){
        $("#main > div > div:nth-child(10) > div.widget-body > div > div").find('a').attr('onclick',"javascript:window.open(this.getAttribute('href'),'_self')")
    }, 1000);
    var garbgarbc = setTimeout(function(){
        $("#sidebar > div.widget.simple-film-list > div.widget-body").find('a').attr('onclick',"javascript:window.open(this.getAttribute('href'),'_self')")
    }, 1000);

    var garbgarb = setTimeout(function(){ //next
        var server = $("#servers-container > div > div.widget-title > span.tabs").find('.active').text();
        GM_setValue("server", server);
        localStorage['server'] = server;
        console.log(`%cserver = ${server}`, 'color: orange;');

        if (server === "MyCloud"){
            var xox = $("#servers-container > div > div.widget-body > div:nth-child(1) > ul").find('.active').parent().next().html();
        } else if (server === "Hydrax"){
            xox = $("#servers-container > div > div.widget-body > div:nth-child(2) > ul").find('.active').parent().next().html();
        } else if (server === "Mp4upload"){
            xox = $("#servers-container > div > div.widget-body > div:nth-child(3) > ul").find('.active').parent().next().html();
        }

        var garb = $.parseHTML(xox)[1]
        garb = $(garb).attr('href');
        garb = 'https://9anime.to' + garb;
        console.log(`%cgarbNext = ${garb}`,"color: orange;");
        GM_setValue("btnNext", garb);
        clearInterval(garbgarb);
    }, 1000);

    var garbgarbprev = setTimeout(function(){ //prev
        var server = $("#servers-container > div > div.widget-title > span.tabs").find('.active').text();
        if (server === "MyCloud"){
            var xox = $("#servers-container > div > div.widget-body > div:nth-child(1) > ul").find('.active').parent().prev().html();
        } else if (server === "Hydrax"){
            xox = $("#servers-container > div > div.widget-body > div:nth-child(2) > ul").find('.active').parent().prev().html();
        } else if (server === "Mp4upload"){
            xox = $("#servers-container > div > div.widget-body > div:nth-child(3) > ul").find('.active').parent().prev().html();
        }
        var garb = $.parseHTML(xox)[1]
        garb = $(garb).attr('href');
        garb = 'https://9anime.to' + garb;
        console.log(`%cgarbPrev = ${garb}`, 'color: orange;');
        GM_setValue("btnPrev", garb);
        //         clearInterval(garbgarb);
    }, 1000);

    var garbgarbo = setTimeout(function(){ //last
        if ($("#controls > div.prevnext.control.tip.disabled").hasClass("disabled")) {
            GM_setValue("garbgarb2disabled", "true");
            console.log(`%cgarbgarb2disabled = true`, 'color: orange;');
        } else {
            GM_setValue("garbgarb2disabled", "false");
            console.log(`%cgarbgarb2disabled = false`, 'color: orange;');
        }
    }, 1000);



    function waitForElementToDisplay(selector, time) {
        if(document.querySelector(selector)!=null) {
            return;
        }
        else {
            setTimeout(function() {
                waitForElementToDisplay(selector, time);
            }, time);
        }
    }

    $("#MALSyncResume").click();
    waitForElementToDisplay('MALSyncResume', 1000)

    const getClosestTop = () => {
        let oFrame = window,
            bException = false;

        try {
            while (oFrame.parent.document !== oFrame.document) {
                if (oFrame.parent.document) {
                    oFrame = oFrame.parent;
                } else {
                    //chrome/ff set exception here
                    bException = true;
                    break;
                }
            }
        } catch(e){
            // Safari needs try/catch so sets exception here
            bException = true;
        }

        return {
            'topFrame': oFrame,
            'err': bException
        };
    };

    // get best page URL using info from getClosestTop
    const getBestPageUrl = ({err:crossDomainError, topFrame}) => {
        let sBestPageUrl = '';

        if (!crossDomainError) {
            // easy case- we can get top frame location
            sBestPageUrl = topFrame.location.href;
        } else {
            try {
                try {
                    // If friendly iframe
                    sBestPageUrl = window.top.location.href;
                } catch (e) {
                    //If chrome use ancestor origin array
                    let aOrigins = window.location.ancestorOrigins;
                    //Get last origin which is top-domain (chrome only):
                    sBestPageUrl = aOrigins[aOrigins.length - 1];
                }
            } catch (e) {
                sBestPageUrl = topFrame.document.referrer;
            }
        }

        return sBestPageUrl;
    };

    const TOPFRAMEOBJ = getClosestTop();
    const PAGE_URL = getBestPageUrl(TOPFRAMEOBJ);

    console.log(`PAGE_URL = ${PAGE_URL}`);



    //9anime
    if (PAGE_URL.indexOf('9anime') !== -1){

        var link = document.querySelector("body"); //next|prev key body
        link.addEventListener("keydown", function(event) {
            var x = event.key;
            if (x == 'n') { // N skip to next episode
                $("#controls > div:nth-child(5)").click();
            };
            if (x == 'p') { // P skip to previous episode
                $("#controls > div:nth-child(4)").click();
            };
        });

        function openFullscreen(elem) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.mozRequestFullScreen) { /* Firefox */
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { /* IE / Edge */
                elem.msRequestFullscreen();
            }
        }

        //         $(document).ready(() => {
        //         });

        //loop
        function waitForElementToDisplay(selector, time) {
            if(document.querySelector(selector)!=null) {

                console.log(`%cmain loop entered = ${selector}`, 'color: red;');

                var player = $('video').get(0);
                setTimeout(function(){
                    player.play();
                }, 1000);

                var aniName = GM_getValue('aniName');
                localStorage['aniName'] = aniName;

                //                 var server = GM_getValue("server");
                //                 setTimeout(function(){
                //                     server = GM_getValue('server');
                //                     console.log(`%cserver = ${server}`, 'color: red;');



                //                 }, 1000);
                //var elem = $('video').parent().parent().get(0);

                //                 var elem = $('video').parent().parent().get(0);
                //var elem = $('video').parent().get(0); Beta server fullscreen

                //$("#slcQualix").val('option:nth-child(1)').change(); //Beta server 720p
                //                 var player = $("video:nth-of-type(1)").get(0); //Mp4upload

                var rewr = localStorage['aniName']
                //                 console.log('aniName2 = ' + rewr);
                console.log('%caniName2 = ' + rewr, 'color: red;');
                /*                 var aniNameEp = document.referrer.split("/")[5];

                if (localStorage[aniName+'/'+aniNameEp+'&currentTime']){
                    player.currentTime = localStorage[aniName+'/'+aniNameEp+'&currentTime'];
                }
                else if (localStorage[aniName+'&set_start'] && localStorage[aniName+'&set_start'] > 0){
                    player.currentTime = localStorage[aniName+'&set_start']
                } */

                const url = new URL(window.location.href);//'embed/41x8ok'
                console.log(`%curl = ${url}`, 'color: red;');

                var server = url.hostname;
                console.log(`%chost = ${server}`, 'color: red;');

                console.log(`%curl.pathname = ${url.pathname}`, 'color: red;');
                var str = url.pathname;
                var res = str.replace("/embed/", "");
                res = res + '.time';//'41x8ok'

                if (server === "mcloud.to"){
                    var elem = $('video').parent().parent().parent().get(0);
                } else if (server === "hydrax.net"){
                    elem = $('video').parent().get(0);
                } else if (server === "www.mp4upload.com"){
                    elem = $('video').parent().get(0);
                }

                openFullscreen(elem);
                $(elem).focus();

                if ( !localStorage[res] && localStorage[aniName+'&set_start'] ){ //unwatched + custom start exists
                    player.currentTime = localStorage[aniName+'&set_start'] //play custom start
                }

                var newYearCountdown = setInterval(function(){
                    var duration = player.duration;
                    var current = player.currentTime;
                    GM_setValue("GM_current", current);
                    var aniName = GM_getValue('aniName');
                    localStorage['aniName'] = aniName;

                    var link = document.querySelector("body");
                    link.addEventListener("keydown", function(event) {
                        var aniName = GM_getValue('aniName');

                        var x = event.key;
                        var z = event.keyCode;
                        if (x == 'n') { // N skip to next episode
                            var garbNext = GM_getValue("btnNext");
                            //                             alert(`garbNext = ${garbNext}`);
                            window.open(garbNext,'_top')
                        };
                        if (x == 'p') { // N skip to next episode
                            var garbPrev = GM_getValue("btnPrev");
                            window.open(garbPrev,'_top')
                        };
                        if (x == 'k') { // K key rewind 90s
                            player.currentTime = current - 90;
                        }
                        if (x == 'l') { // L key skip 90s
                            player.currentTime = current + 90;
                        }
                        if (x == ';') { // ; key rewind 1s
                            player.currentTime = current - 1;
                        }
                        if (x == "'") { // ' key skip 1s
                            player.currentTime = current + 1;
                        }
                        if (x == '\\') { // \ clear start&end
                            localStorage[aniName+'&set_start'] = 0
                            localStorage[aniName+'&set_end'] = duration;
                        }
                        if (x == '[') { // [ mark start
                            localStorage[aniName+'&set_start'] = GM_getValue("GM_current");
                        }
                        if (x == ']') { // ] mark end
                            localStorage[aniName+'&set_end'] = GM_getValue("GM_current");
                        }
//                         event.ctrlKey && event.key === 'z'
                       // if (event.shiftKey && x === '{') { // +[ clear start
                        if (event.shiftKey && x == 219) {
                            console.log(`%c+[ clear start = 1`, 'color: purple;');
                            localStorage[aniName+'&set_start'] = 0
                        }
//                         if (event.shiftKey && x === ']') { // +] clear end
                        if (event.shiftKey && x == 221) {
                            localStorage[aniName+'&set_end'] = duration;
                        }
                    });

                    var warning1 = duration - 10;
                    var warning2 = localStorage[aniName+'&set_end'] - 10;

                    if ( duration > 0 && current >= warning1 || duration > 0 && current > warning2 && !player.paused){
                        snd.play();
                    }

                    if ( duration > 0 && current >= duration || duration > 0 && current > localStorage[aniName+'&set_end'] ){
                        var garbNext = GM_getValue("btnNext");
                        var isgarbgarb2disabled = GM_getValue("garbgarb2disabled");
                        if (isgarbgarb2disabled === true){
                            toBeRunOnce();
                        }
                        else {
                            top.window.location.href = garbNext;
                        }

                        clearInterval(newYearCountdown);
                    };
                }, 1000);
            }
            else {
                setTimeout(function() {
                    waitForElementToDisplay(selector, time);
                }, time);
            }
        }

        function toBeRunOnce(){
            alert(`toBeRunOnce = toBeRunOnce`);
            var imagex = 'https://staticf.akacdn.ru/assets/favicons/favicon-32x32.png';
            GM_notification({title: "End of " + localStorage['aniName'], image: imagex, text: "Hope you enjoyed 9anime Bingewatcher+ &#128515;", onclick: "https://greasyfork.org/en/scripts/392628-kissanime-bingewatcher/feedback"});
            console.log('toBeRunOnce has completed');
            toBeRunOnce = function() {};
        }

        var wav = 'data:audio/wav;base64,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'+
            'ScqRhwGuWbZ8f8B7bOhyW2ytARbF+GFSLr6r9lTciC8cHafQWSgIUADQ0ZInTY1e6NtFnWJItam5YEnZ0fGeDekUn8jhgqf5Sb+Uf9f1IjWA0IA2mDyVQ///1n/'+
            'kceWJmBQAWP/9UwKPTgL5YMqsXzMktiDsBRo4QRoGUpkp0uiA8gfri2ayQxd4u1Az6l/kwnGvxmGbDhC47Uts5U2cpUNhUSrZ1aWzWHQF45XXs6y7KRhbbarWtomrDGEutbKMkjohU3d1osovGTpKJoc4ixfAQVAy+4kRyRo'+
            'GpMhxIOLmX//1OOoHCi8kTRExuAAiwUIkVNlMYmrUkv//////////9NvUn////zFItySNBxttkAU2eVbL9wLTUwpWUMksfNC+OADQhgWFGqX0v1qGbNq/MyHW+mLEv8yJFX7t/Z//9RKgXUa2lktf//9L6R527FlWySNIgX8qd9M'+
            'psEPOqFRhYgq4b08+//ugAK6AApxDSmsUouCsT5mfZxRvCIkNIazSC4HWoac1jNF3Mxm+AV0EjXWncodjUO6kWXcv736EaQq87h+/gEeMdFJanYgQIlRdSXs4NAo30zz9QiRWv6hWCt/X7s45oGsahdg5gdsmSOCZkAIkUUFv//1'+
            'jOCgkVUjMEA8PdEBICTWbgHSSAkbrOtmtwFk4DEE860B9gYBKCgIiJsj/7umg36j3+Vb+jf////8oCpKakv/////////////////////////////////////////////////////////////////////////////////////////'+
            '////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////'+
            '/////////+TNDihCrW2OEAdwp2ZZV0EqJ0bXgIyg1p37Fi2/B9MRKs5f3Hvym7rL9dzoFJ5d3/NbjjVXdWmoWsOWRb4pp9NvkOQQS+bNd9ToOttSIe0Bu1hCnScdQdURY1///kcNlu4nkcQAMJAAQv/'+
            'AdAR9wjv/////8qZNXVJJJHGgP5W73r6yi/BiqwPaI8wKa//uiAMSAB+U0x+KUUtBjCFlPZxRdQkAlJWCoRKEloaS1mkVwA+wAGIFhwyJPIpM9Jv0yKfqSFxN+PkhHb5G7ft/W3/9aQ+QB6WlJs4+RRW///uXfmJ8yAQAARo'+
            '3///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////'+
            '////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////'+
            '////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////'+
            '////////////////////////////8QXe7ASSCNAdHMTxsRw5YBUoupLMCXCv/7oADagAzwAMmgIAAKMUapPVIKWgAAAS4AAAAgVoUkrBQ0lIF2k8z//0/6kv8hGv9W/////5QAk/xr/636QBJZoACBfmuFCJtZgAJRRf//////Kv'+
            '////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////'+
            '////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////'+
            '////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////'+
            '/////////////////////////////////////////////////////////////////////7ogDbAA8UAEuAAAAIBYAYxAAAAQAAAS4AAAAgAAAlwAAABP////////////////////////////////////////////////////////'+
            '//8AAEAAeW//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////'+
            '////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////'+
            '////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////'+
            '//////////////////////////////////////////////////////////////////////////////+6AA2oAPKABLgAAACAAACXAAAAEAAAEuAAAAIAAAJcAAAAT///////////////////////////////////////////////'+
            '////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
            'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
            'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
            'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';

        var snd = new Audio(wav);


        function fancyTimeFormat(time)
        {
            // Hours, minutes and seconds
            var hrs = ~~(time / 3600);
            var mins = ~~((time % 3600) / 60);
            var secs = ~~time % 60;

            // Output like "1:01" or "4:03:59" or "123:03:59"
            var ret = "";

            if (hrs > 0) {
                ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
            }

            ret += "" + mins + ":" + (secs < 10 ? "0" : "");
            ret += "" + secs;
            return ret;
        }

        /* main */
        //         $('body').click();
        //         var zerg = $('body').find('video');
        waitForElementToDisplay('video', 500);
        //         waitForElementToDisplay("#vid_html5_api", 500);

        /*         setTimeout(function(){
            var server = GM_getValue('server');
            console.log(`%cserver = ${server}`, 'color: red;');
            GM_setValue('server', server);

            if (server === "MyCloud"){
                waitForElementToDisplay('#jw > div.jw-wrapper.jw-reset > div.jw-media.jw-reset > video', 1000, server);
            } else if (server === "Hydrax"){
                waitForElementToDisplay('#player > div.jw-media.jw-reset > video', 1000, server);
            } else if (server === "Mp4upload"){
                waitForElementToDisplay("#vid_html5_api", 1000, server)
            }
        }, 1000); */



        link = document.querySelector("body");
        link.addEventListener("keydown", function(event) {
            var imagex = 'https://staticf.akacdn.ru/assets/favicons/favicon-32x32.png';
            var msg;
            var aniName = localStorage['aniName'];
            var x = event.keyCode;
            if (x == 78) { // N skip to next episode
                snd.play();
            };
            if (x == 75) { // K key rewind 90s
                snd.play();
            }
            if (x == 76) { // L key skip 90s
                snd.play();
            }
            if (x == 186) { // ; key rewind 1s
                snd.play();
            }
            if (x == 222) { // ' key skip 1s
                snd.play();
            }
            if (x == 220) { // \ clear start&end
                msg = new SpeechSynthesisUtterance('marks cleared');
                window.speechSynthesis.speak(msg);
                GM_notification('Kissanime Bingewatcher+', "marks cleared", imagex);
            }
            if (!event.shiftKey && !event.altKey && !event.ctrlKey && x == 219) { // [ mark start
                msg = new SpeechSynthesisUtterance('start set');
                window.speechSynthesis.speak(msg);
                GM_notification('Kissanime Bingewatcher+', "start set [" + fancyTimeFormat(GM_getValue("GM_current")) + "]", imagex);
            }
            if (!event.shiftKey && !event.altKey && !event.ctrlKey && x == 221) { // ] mark end
                msg = new SpeechSynthesisUtterance('end set');
                window.speechSynthesis.speak(msg);
                GM_notification('Kissanime Bingewatcher+', "end set [" + fancyTimeFormat(GM_getValue("GM_current")) + "]", imagex);
            }
            if (event.shiftKey && x == 219) { // +[ clear start
                msg = new SpeechSynthesisUtterance('start cleared');
                window.speechSynthesis.speak(msg);
                GM_notification('Kissanime Bingewatcher+', "start cleared", imagex);
                console.log(`%c+[ clear start =`, 'color: blue;');
            }
            if (event.shiftKey && x == 221) { // +] clear end
                msg = new SpeechSynthesisUtterance('end cleared');
                window.speechSynthesis.speak(msg);
                GM_notification('Kissanime Bingewatcher+', "end cleared", imagex);
            }
            if (x == 190) { // . stored time settings
                msg = new SpeechSynthesisUtterance('stored, time settings');
                window.speechSynthesis.speak(msg);
                GM_notification(`start time: ${fancyTimeFormat(localStorage[aniName+'&set_start'])} \n end time: ${fancyTimeFormat(localStorage[aniName+'&set_end'])}`, "stored time settings", imagex);
            }
        })
    }
})(jQuery);