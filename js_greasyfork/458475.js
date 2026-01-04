// ==UserScript==
// @name         Twitter remove view ui
// @namespace    http://tampermonkey.net/
// @version      0.27
// @description  Fuck Elon Musk, Remove twitter annoying view count icon
// @author       You
// @match        https://twitter.com/*
// @match        https://*.x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458475/Twitter%20remove%20view%20ui.user.js
// @updateURL https://update.greasyfork.org/scripts/458475/Twitter%20remove%20view%20ui.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const controlClassName = 'r-1kbdv8c';

    var starter = setInterval(() => {
        if(document.getElementsByClassName(controlClassName).length>0){
            console.log("have");
            combine();
            clearInterval(starter);
        }else{
            console.log("class not found");
        }
    }, 200);

    function combine(){
        //ChangeCss('r-1mdbhws','max-width: initial;}.r-1mdbhws>:nth-child(4) { display: none; ');
        ChangeCss(controlClassName,`max-width: initial;}.${controlClassName}>:nth-child(4) { display: none; `);
        //ChangeCssSingle('jcaQle','width','274px;');
    }

    function ChangeCss(classs,css){
        var allstylesheet = document.getElementsByTagName('style');
        //console.log(allstylesheet);
        for (let i = 0; i < allstylesheet.length; i++) {
            console.log(allstylesheet[i].innerHTML.split(classs).length);
            if (allstylesheet[i].innerHTML.split(classs).length >= 2) {
                //console.log('Running1')
                //console.log(allstylesheet[i].innerHTML);
                //console.log(allstylesheet[i].innerHTML.split(classs+'{')[1].split('}')[0]);
                allstylesheet[i].innerHTML=allstylesheet[i].innerHTML.replace(allstylesheet[i].innerHTML.split(classs+'{')[1].split('}')[0],css);
                //console.log('Running2_end')
            }else if(allstylesheet[i].innerHTML.split(classs).length < 2 &&i==allstylesheet.length-1) {
                var newstylesheet = document.createElement('style');
                newstylesheet.innerHTML='.'+classs+'{'+css+'}';
                document.body.appendChild(newstylesheet);
                console.log('Added to new style');
            }

        }

    }

    function ChangeCssSingle(classs,css,value){
        var allstylesheet = document.getElementsByTagName('style');
        //console.log(allstylesheet);
        for (let i = 0; i < allstylesheet.length; i++) {
            //console.log(allstylesheet[i].innerHTML.split('C9gDHb').length);
            if (allstylesheet[i].innerHTML.split(classs).length >= 2) {
                //console.log(allstylesheet[i].innerHTML.split(classs)[1].split('{')[1].split('}')[0].split(css)[1]);
                //console.log(allstylesheet[i].innerHTML.split(classs)[1].split('{')[1].split('}')[0].split(css)[1].split(':')[1]);
                //console.log(allstylesheet[i].innerHTML.split(classs)[1].split('{')[1].split('}')[0].split(css)[1].split(':')[1].split(';')[0]);
                allstylesheet[i].innerHTML=allstylesheet[i].innerHTML.replace(allstylesheet[i].innerHTML.split(classs)[1].split('{')[1].split('}')[0].split(css)[1].split(':')[1].split(';')[0],value);

            }else{
                console.log('class "'+classs+'"not found in this style sheet')
            }

        }
    }



    const class_observer = new MutationObserver(function (callback_eles) {
        console.log('callback_eles', callback_eles);
        for (let i = 0; i < callback_eles.length; i++) {
            const fuckdiv = callback_eles[i].target.querySelectorAll(`[class="css-1dbjc4n r-1kbdv8c r-18u37iz r-h3s6tt r-1wtj0ep r-10m99ii r-1e081e0"]`)[0];
            const fuckdiv2 = callback_eles[i].target.querySelectorAll(`[class="css-1dbjc4n r-1oszu61 r-j5o65s r-rull8r r-qklmqi r-1dgieki r-1efd50x r-5kkj8d r-1kbdv8c r-18u37iz r-h3s6tt r-1wtj0ep r-3qxfft r-s1qlax"]`)[0];

            if (fuckdiv != undefined) {
                console.log('callback_eles_2', fuckdiv);
                fuckdiv.classList.add('RONI_DIV_CONTROLLER');
            }

            if (fuckdiv2 != undefined) {
                console.log('callback_eles_2', fuckdiv2);
                fuckdiv2.classList.add('RONI_DIV_CONTROLLER');
            }

        }
    });

    class_observer.observe(document.querySelector("div"), {
        attributes: true, childList: true, subtree: true
    }
                          );

    const cc = document.createElement('style');
    cc.innerHTML = `.RONI_DIV_CONTROLLER>:nth-child(4) { display: none;}`;
    document.body.appendChild(cc);


    var change_twi_logo = setInterval(() => {
        const find_div = document.getElementsByClassName('r-18jsvk2 r-4qtqp9 r-yyyyoo r-16y2uox r-8kz0gk r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-lrsllp');
        if (find_div.length > 0) {
            console.log("have logo");
            find_div[0].setAttribute('viewBox','0 0 40 40');

            const path_div = find_div[0].getElementsByTagName('path')[0];
            path_div.setAttribute('fill','#03A9F4');
            path_div.setAttribute('d', 'M42,12.429c-1.323,0.586-2.746,0.977-4.247,1.162c1.526-0.906,2.7-2.351,3.251-4.058c-1.428,0.837-3.01,1.452-4.693,1.776C34.967,9.884,33.05,9,30.926,9c-4.08,0-7.387,3.278-7.387,7.32c0,0.572,0.067,1.129,0.193,1.67c-6.138-0.308-11.582-3.226-15.224-7.654c-0.64,1.082-1,2.349-1,3.686c0,2.541,1.301,4.778,3.285,6.096c-1.211-0.037-2.351-0.374-3.349-0.914c0,0.022,0,0.055,0,0.086c0,3.551,2.547,6.508,5.923,7.181c-0.617,0.169-1.269,0.263-1.941,0.263c-0.477,0-0.942-0.054-1.392-0.135c0.94,2.902,3.667,5.023,6.898,5.086c-2.528,1.96-5.712,3.134-9.174,3.134c-0.598,0-1.183-0.034-1.761-0.104C9.268,36.786,13.152,38,17.321,38c13.585,0,21.017-11.156,21.017-20.834c0-0.317-0.01-0.633-0.025-0.945C39.763,15.197,41.013,13.905,42,12.429');

            clearInterval(change_twi_logo);
        } else {
            console.log("class not found");
        }
    }, 200);


    /*var change_twi_logo2 = setInterval(() => {
        const find_div = document.getElementsByClassName('r-1p0dtai r-18jsvk2 r-4qtqp9 r-yyyyoo r-wy61xf r-1d2f490 r-ywje51 r-dnmrzs r-u8s1d r-zchlnj r-1plcrui r-ipm5af r-lrvibr r-1blnp2b');
        if (find_div.length > 0) {
            console.log("have logo");
            find_div[0].setAttribute('viewBox', '0 0 40 40');

            const path_div = find_div[0].getElementsByTagName('path')[0];
            path_div.setAttribute('fill', '#03A9F4');
            path_div.setAttribute('d', 'M42,12.429c-1.323,0.586-2.746,0.977-4.247,1.162c1.526-0.906,2.7-2.351,3.251-4.058c-1.428,0.837-3.01,1.452-4.693,1.776C34.967,9.884,33.05,9,30.926,9c-4.08,0-7.387,3.278-7.387,7.32c0,0.572,0.067,1.129,0.193,1.67c-6.138-0.308-11.582-3.226-15.224-7.654c-0.64,1.082-1,2.349-1,3.686c0,2.541,1.301,4.778,3.285,6.096c-1.211-0.037-2.351-0.374-3.349-0.914c0,0.022,0,0.055,0,0.086c0,3.551,2.547,6.508,5.923,7.181c-0.617,0.169-1.269,0.263-1.941,0.263c-0.477,0-0.942-0.054-1.392-0.135c0.94,2.902,3.667,5.023,6.898,5.086c-2.528,1.96-5.712,3.134-9.174,3.134c-0.598,0-1.183-0.034-1.761-0.104C9.268,36.786,13.152,38,17.321,38c13.585,0,21.017-11.156,21.017-20.834c0-0.317-0.01-0.633-0.025-0.945C39.763,15.197,41.013,13.905,42,12.429');

            clearInterval(change_twi_logo2);
        } else {
            console.log("class not found");
        }
    }, 200);*/

})();