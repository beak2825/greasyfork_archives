// ==UserScript==
// @name           THISVID CUSTOMIZATIONS
// @version        2.4
// @namespace      thisvid.com personal customizations
// @description    Blah
// @inject-into    content
// @match          https://thisvid.com/*
// @require        https://code.jquery.com/jquery-latest.min.js
// @grant          GM_xmlhttpRequest
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          unsafeWindow
// @icon           https://www.google.com/s2/favicons?domain=thisvid.com
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/520290/THISVID%20CUSTOMIZATIONS.user.js
// @updateURL https://update.greasyfork.org/scripts/520290/THISVID%20CUSTOMIZATIONS.meta.js
// ==/UserScript==


(function() {

    console.log('=============||||| US | RUNNING THISVID CUSTOMIZATIONS |||||==============');
    $('body').addClass('tampered');
    
    var url = window.location.href;
    
        setTimeout(function(){
 
            if (url == "https://thisvid.com/categories/#tab2") {
                console.log("Categories Page");
                $('#tab1').remove();
                $('.thumbs-categories > a').attr('target', '_blank');
            }
            
        }, 2000);
    
    
    

    
    // setTimeout(function(){
        
    //     var sidebarBtn = "<div class='sidebarBtn'><span class='material-icons'>menu</span></div>";
    //     $('.header-bottom').append(sidebarBtn);
    //     $('.sidebar').addClass('drawerRight');
    //     $('.sidebarBtn').find('span').addClass('sidebarInactive');
    //     $('.sidebarBtn').click(function() {
    //         $(this).find('span').toggleClass('sidebarInactive');
    //         $('.sidebar').toggleClass('drawerRight');
    //     });
        
    //     $('.sidebarInactive').click(function() {
    //         setTimeout(function(){
    //             $("div.tabset > a:nth-child(2)").addClass('active');
    //         }, 800);
    //     });
        
    //     $(".thumbs-items a").attr('target', '_blank');

    // }, 2000);
    
    
    
    
    
    
    
    setTimeout(function(){
        console.log('lazy-load');
        
        $('img.lazy-load').each(function() {
            var thumbSrcOrig = $(this).attr('data-original');
            $(this).attr('src', thumbSrcOrig);
            $(this).removeAttr('data-original');
            $(this).removeClass("lazy-load");
        });
        
    }, 2000);






/*
    // ========= setInterval COUNTER =========
    setInterval(function () {
        count++;
        console.log(count);
    }, 1000);



    $(".XYZ > div[class*='zzz']").find('span').each(function() {

        var xxx = $(this).text().indexOf("xyz");

        if (xxx) {
            $(this).parents("div[class*='LatestContent__xyz']").remove();
        }
    });







    // ======= COMPARE FAVESLIST =======
    var gmStorage_faves = GM_getValue('favesList');

    var i;
    for (i = 0; i < gmStorage_faves.length; i++) {
        if( username === gmStorage_faves[i].trim().toLowerCase() ) {
            console.log('fave match: '+username);
            $(this).addClass('fave');
            $(this).addClass('flagged');
        }
    }

    // ============== FAVE BUTTONS ==============
    $('.faveBtnOFF').click(function(){
        console.log("faveBtnOFF clicked");
        var faveUser = $(this).parents('.userInfo').find('.user').text();

        var favesList = GM_getValue('favesList');
        favesList.push(faveUser);

        GM_setValue('favesList', favesList);

        faves();
    });

*/
    
    
    
    
    
    function timestamp() {
        // https://jsbin.com/yipuhat/edit?html,js,console
        $('.tumbpu').each(function() {
            $(this).removeAttr('title');
            var hours, mins, secs, total;
            var duration = $(this).find('.duration').text();

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
            
            $(this).attr('target', '_blank');
        });
    }

    setTimeout(function(){
        timestamp();
    }, 1700);
    
    
 

    setTimeout(function(){
        $('.search-form #autocomplete').blur();
    }, 3000);

    setTimeout(function(){
        $('.search-form #autocomplete').blur();
    }, 4000);


    
    
    setTimeout(function(){
        $('.tumbpu').each(function() {
            var thumbClasses = $(this).find('.thumb').attr('class').indexOf("private");
            
            if (thumbClasses !== -1) {
                $(this).addClass('privateHide');
            }
            
            $(this).removeAttr('title');
        });


        $('.search-form #autocomplete').blur();

    }, 2000);
    
    
    setTimeout(function(){
        $('.privateHide').remove();
        
        $('.tumbpu').appendTo('#list_videos_common_videos_list_items');
        
        $('#list_videos_common_videos_list > .container').remove();
        
        
        
        $('.nav-header a').each(function() {
            var profileLink = $(this).text();
            
            if (profileLink !== -1) {
                $(this).addClass('profileLink');
                $(this).attr('target', '_blank');
            }
        });
        
        $('.tumbpu').removeAttr('title');
        
    }, 2600);
    
    
    
    


    $(document).on("click", function(e) {
        console.log(e.target);
    });



})();