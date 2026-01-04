// ==UserScript==
// @name           PH | Excluded Usernames 2
// @version        2.9
// @namespace      cam4_goes_droopy
// @description    cam4 cleanup
// @include        https://www.pornhub.com/gayporn
// @include        https://www.pornhub.com/gay/*
// @include        https://www.pornhub.com/gay/video
// @include        https://www.pornhub.com/gay/video*
// @include        https://www.pornhub.com/gay/video/*
// @require        https://code.jquery.com/jquery-latest.min.js
// @grant          GM_getValue
// @grant          GM_setValue
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/473980/PH%20%7C%20Excluded%20Usernames%202.user.js
// @updateURL https://update.greasyfork.org/scripts/473980/PH%20%7C%20Excluded%20Usernames%202.meta.js
// ==/UserScript==

/*
https://greasyfork.org/scripts/473980-ph-excluded-usernames-2/code/PH%20%7C%20Excluded%20Usernames%202.user.js?=2.9
*/




$(function(){


    console.log('=============||||| RUNNING PH EXCLUDE 2.9 |||||==============');


    var favesList, blockList;






    $('.videoBox').each(function() {
        $(this).find('.imageLink').prepend('<div class="block-button" style="position: absolute; top: 10px; right: 10px; width: 40px; height: 40px; display: block; z-index: 100; background: #ccc; border: thin solid transparent; border-radius: 6px; opacity: .5;"><img class="blockUser" src="data:image/png;base64,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" style="width: 100%;"></div>');
        $(this).find('.underThumb').append('<div class="fave-button"><svg class="faveUser" id="Layer_1" x="0px" y="0px" viewBox="0 0 200 200" width="30" height="30" style="enable-background:new 0 0 100 100;"><path class="faveUser" d="M77.28,73.93l-52.27,7.58l-0.93,0.19c-1.4,0.37-2.68,1.11-3.7,2.14c-1.02,1.03-1.76,2.31-2.12,3.71c-0.37,1.4-0.35,2.88,0.04,4.27c0.39,1.4,1.14,2.66,2.18,3.67l37.86,36.86l-8.93,52.06l-0.11,0.9c-0.09,1.45,0.22,2.9,0.87,4.19c0.66,1.29,1.65,2.39,2.87,3.18s2.63,1.24,4.08,1.3c1.45,0.06,2.89-0.26,4.18-0.93l46.74-24.58l46.64,24.58l0.82,0.38c1.35,0.53,2.82,0.7,4.26,0.47c1.44-0.22,2.79-0.82,3.91-1.74c1.13-0.92,1.99-2.12,2.5-3.48c0.51-1.36,0.65-2.83,0.4-4.27l-8.94-52.06l37.88-36.86l0.64-0.7c0.91-1.12,1.51-2.47,1.73-3.9c0.22-1.43,0.06-2.9-0.46-4.24c-0.53-1.35-1.4-2.53-2.54-3.43c-1.13-0.9-2.49-1.48-3.92-1.69l-52.27-7.59l-23.36-47.35c-0.68-1.37-1.72-2.53-3.02-3.34c-1.3-0.81-2.8-1.24-4.33-1.24s-3.03,0.43-4.33,1.24c-1.3,0.81-2.35,1.96-3.02,3.34L77.28,73.93z" /></svg></div>');
    });




    function fireUpdate(favesList) {

        database.ref('faves/' + favesList).update({
        }, (error) => {
          if (error) {
            console.log("Failed to update firebase.");
          } else {
            console.log("Updated firebase successfully!");
          }
        });


    }







    function hightlightFaves() {
        console.log("hightlightFaves() FIRED");

        $('.favedUser').removeClass('favedUser');

        $('.videoBox').each(function() {
            var username = $(this).find('.uploaderLink').text();

            var i;
            for (i = 0; i < favesList.length; i++) {
                if(username === favesList[i].username) {
                    $(this).addClass('favedUser');
                    $(this).find(".faveUser").addClass('favedUser');
                }
            }
        });

    }


    $('.faveUser').click(function() {

        if( $(this).parents('.videoBox').hasClass("favedUser") ) {
            console.log("unfave btn clicked");

            var usernameToUnfave = $(this).parents('.underThumb').find('.uploaderLink').text();

            favesList.splice( $.inArray(usernameToUnfave, favesList), 1 );


            fireUpdate(favesList);

        } else {
            console.log("fave btn clicked");

            var usernameToFave = $(this).parents('.underThumb').find('.uploaderLink').text();
            favesList.push(usernameToFave);

            GM_setValue('favesList', favesList);
        }

        hightlightFaves();
    });











    function blockUsers() {
        console.log("blockUsers() FIRED");

        $('.videoBox').each(function() {
            var username = $(this).find('.uploaderLink').text();

            var i;
            for (i = 0; i < blockList.length; i++) {
                if(username === blockList[i].username) {
                    $(this).remove();
                }
            }

            var title = $(this).find('.title > a').text();
            var chubb = title.indexOf("chub");
            //console.log({chubb});

            if (chubb != -1) {
                $(this).remove();
            }
        });
    }




/*

    $('.blockUser').click(function() {
        console.log("block btn clicked");

        $(this).parents('.add-to-playlist-icon').toggleClass('active');
        var usernameToBlock = $(this).parents('.wrap').find('.username').text();

        var blockList = GM_getValue('blockList');
        blockList.push(usernameToBlock);

        GM_setValue('blockList', blockList);

        blockUsers();
    });


*/







    // =================================== STARTEnd FIREBASE ===================================

    var script = document.createElement('script');
    script.src = 'https://www.gstatic.com/firebasejs/8.2.1/firebase-app.js';
    script.setAttribute("id", "firebaseJQuery");
    document.body.appendChild(script);

    var script2 = document.createElement('script');
    script2.src = 'https://www.gstatic.com/firebasejs/8.2.1/firebase-database.js';
    script2.setAttribute("id", "firebaseJQuery");
    document.body.appendChild(script2);


    setTimeout(function(){

        // Set the configuration for your app
        // TODO: Replace with your project's config object
        var config = {
            apiKey: "AIzaSyCSpCKBemfcAEAMVoQB26ldKHAIjrTaDy4",
            authDomain: "ph-excludefaves.firebaseapp.com",
            databaseURL: "https://ph-excludefaves-default-rtdb.firebaseio.com/",
            storageBucket: "ph-excludefaves.appspot.com",
        };


        firebase.initializeApp(config);

        // Get a reference to the database service
        var database = firebase.database();


        var dbRefObject = database.ref().child('blocks');
        dbRefObject.on('value', snap => {
            blockList = snap.val();
            console.log(blockList);
        });


        var dbRefObject2 = database.ref().child('faves');
        dbRefObject2.on('value', snap => {
            favesList = snap.val();
            console.log(favesList);
        });


        setTimeout(function(){
            blockUsers();
            hightlightFaves();
        }, 1500);

    }, 1500);


// =================================== END FIREBASE ===================================
/*
https://console.firebase.google.com/u/0/project/ph-excludefaves/database/ph-excludefaves-default-rtdb/data/~2F
*/







    function timestamp() {
        // https://jsbin.com/yipuhat/edit?html,js,console
        $('.videoBox').each(function() {
            var hours, mins, secs, total;
            var duration = $(this).find('.time').text();

            var x = duration.split(':')[0];
            var y = duration.split(':')[1];
            var z = duration.split(':')[2];

            if(z === undefined) {
                mins = parseInt(x);
                secs = parseInt(y);

                total = (mins * 60) + secs;
            } else {
                hours = parseInt(x);
                mins = parseInt(y);
                secs = parseInt(z);

                total = ((hours * 60) * 60) + (mins * 60) + secs;
            }

            $(this).find('.duration').attr('title', total);

            if(total > 600) {
                $(this).addClass('long');
            } else if(total > 300) {
                $(this).addClass('decent');
            } else if(total > 120) {
                $(this).addClass('short');
            } else if(total > 60) {
                $(this).addClass('superShort');
            } else {
                $(this).addClass('underOne');
            }
        });
    }

    setTimeout(function(){
        timestamp();
    }, 1700);


});
