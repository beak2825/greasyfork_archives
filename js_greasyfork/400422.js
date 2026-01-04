// ==UserScript==
// @name         Poker turn reminder
// @namespace    http://tampermonkey.net/
// @version      0.1.8
// @description  You will never miss your turn.
// @author       Jamop[2493903]
// @match        https://www.torn.com/loader.php?sid=holdem*
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@9
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/400422/Poker%20turn%20reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/400422/Poker%20turn%20reminder.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.counter=0;
    function misclick_protect(){
        document.querySelector('[class*="buttonsWrap___"]').style.setProperty("pointer-events","none");
        //$(document.querySelector('[class*="panel___"]')).click(false);
        //console.log('[poker]misclick_protect');
        var timeout = document.hasFocus() ? 700 : 1500;
        setTimeout(rp, timeout);
        function rp(){
            document.querySelector('[class*="buttonsWrap___"]').style.removeProperty("pointer-events");
            document.querySelector('[class*="buttonsWrap___"]').style.setProperty("pointer-events","auto");
            //$( document.querySelector('[class*="panel___"]') ).on( 'click' );
            //console.log('[poker]misclick_protect removed');

        }

    };
    var buttonsNode = document.querySelector('[class*="buttonsWrap"]');

    let buttons_observer = new MutationObserver(mutationRecords => {
        for (let i = 0; i < mutationRecords.length; i++) {
            //console.log(mutationRecords[i]);
            if (mutationRecords[i].type == 'attributes'
                && mutationRecords[i].target.className.includes('default')
                && !mutationRecords[i].target.className.includes('pressed')


               ){
                //console.log('misclick pr '+mutationRecords[i].target.innerText);
                //console.log('misclick pr '+mutationRecords[i].target.innerText);
                misclick_protect();
            }
        }
    });
    buttons_observer.observe(buttonsNode, {
        attributes: true,
        childList: true,
        subtree: true
    });
    document.addEventListener( 'visibilitychange' , function() {
        if (document.hidden) {
            //console.log('tab is inactive');
            // document.body.style.setProperty('background-image', "url('https://wallpaperaccess.com/download/poker-1219583')", 'important');
            //document.body.style.removeProperty('background-Image');
        } else {
            //console.log('tab is active');
            //Swal.close();
            //click_protect();
        }
    }, false );

    //var targetNode = document.evaluate('//*[@id="react-root"]/div/main/div[2]/div/div[2]/div[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    var targetNode = document.querySelector('[class^="buttonsWrap__"]');

    let observer = new MutationObserver(mutationRecords => {
        //var circle_img=new Image();circle_img.src="https://www.iconsdb.com/icons/download/color/FFF700/circle-24.png";
        //document.querySelector('[class^="dealer__"]').style = 'background:url(https://imgur.com/download/00ehOES) top no-repeat;';
        if ($("[class^=playerMe]") && $("[class^=playerMe]").find("[class^=state]")[0].innerText=='Sitting out'){
            //console.log('sitout');
            GM_notification ( {title: 'sitout', highlight: true} );
            Swal.fire('You are sitting out');
        }

        window.prev_focus = window.focus;
        for (let i = 0; i < mutationRecords.length; i++) {
            //console.log(mutationRecords[i]);
            if (mutationRecords[i].type == 'attributes')
            {
                //console.log(mutationRecords[i].target.className);
                if (mutationRecords[i].target.className.includes('pressed')==true) {
                    //do not focus
                    //window.counter=0;
                    //window.focus=0;
                    GM_setValue("pressed",1);
                    break;
                }
                else {
                    GM_setValue("pressed",0);
                    //window.focus=1;
                }
            }else if (mutationRecords[i].type == 'childList')
            {
                if (mutationRecords[i].addedNodes.length > 0) {
                    //focus
                    //window.focus=1;
                    //window.prev_focus=1;
                    GM_setValue("pressed",0);
                    break;
                }
                //else window.focus=0;
            }
        }
        //if (document.querySelector('[class^="playerMe__"][class*="active"]')!==null){
        //    click_protect();
        //}
        //console.log('pressed - '+GM_getValue("pressed"));
    });

    var target = document.evaluate('/html/head/title', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    var title_observer = new MutationObserver(function(mutations) {
        //console.log('Tittle change ');console.log('window.focus '+window.focus);console.log('window.prev_focus '+window.prev_focus);console.log('window.counter '+window.counter);
        //console.log('pressed - '+GM_getValue("pressed"));//console.log('window.counter '+window.counter);
        if (GM_getValue("pressed")==0 && document.querySelector('[class^="playerMe__"][class*="active"]')!==null) {
            //if (GM_getValue("pressed")==0 || window.counter==4) {
            //Swal.fire('Accidental click protection');
            GM_notification ( {title: 'turn', highlight: true} );
            //window.counter=0;

            //window.focus=0;
            //window.prev_focus=0;
        }
        if (document.querySelector('[class^="playerMe__"][class*="active"]')!==null){
            //window.counter++;
            //console.log('!! Your turn');
        }
    });
    var config = { childList: true, characterData: true}
    title_observer.observe(target, config);

    observer.observe(targetNode, {
        attributes: true,
        childList: true,
        subtree: true
    });
})();