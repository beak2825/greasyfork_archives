// ==UserScript==
// @name         Dribbble Extender
// @description  Shows who follows you on your following list
// @author       Kos
// @namespace    http://tampermonkey.net/
// @version      0.5
// @license      CC BY-SA 2.0
// @homepage     https://greasyfork.org/scripts/22003-dribbble-extender
// @include      https://dribbble.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/22003/Dribbble%20Extender.user.js
// @updateURL https://update.greasyfork.org/scripts/22003/Dribbble%20Extender.meta.js
// ==/UserScript==

;(function() {
    'use strict';
    
    // styles for checkmark
    GM_addStyle(
        '.us-follows-you-mark {color:#b3e3bd;font-weight:200}\
        .us-fetch-ready {color:#2cff5a;font-weight:900}'
    );

    var ACCESS_TOKEN = '9eafaa85aba0e22cdd7b7ddaa23181b59c29989dbd27000c78db21f5609110f4',
        followers = [],
        // username
        username = $('.has-sub .profile-name').parent().attr('href').replace('/', ''),
        cacheKey = username,
        curPage = 1,
        perPage = 100,
        repaintDelay = 500,
        waitForAllFetch = false,
        requestPerIteration = 15,
        requestsResponseLeftCount = 0,
        mainIntervalStopped = true,
        lastIntervalFoundFollowers = null,
        justCache = false;

    // if not recognized logged in user, exit
    if (username == '')
    {
        return;
    }
    
    // functions for working with localStorage

    function lsTest()
    {
        var test = 'test';
        try
        {
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        }
        catch(e)
        {
            return false;
        }
    }

    function getLocalStorageArray(name)
    {
        var list = localStorage.getItem(name);
        if (!list)
        {
            return [];
        }
        return JSON.parse(list);
    }

    function saveUpdatedFollowersList(list)
    {
        localStorage.setItem(cacheKey+'_followers_latest', JSON.stringify(list));
    }

    function addFollowerLocalStorage(id)
    {
        var list = getLocalStorageArray(cacheKey+'_followers_latest');

        if (list.indexOf(id) == -1)
        {
            list.push(id);
        }

        saveUpdatedFollowersList(list);
    }

    function saveFinishedAmountOfFollowers()
    {
        var list = getLocalStorageArray(cacheKey+'_followers_latest');

        localStorage.setItem(cacheKey+'_followers', JSON.stringify(list));
        saveUpdatedFollowersList([]);

        // update on page
        followers = list;
        paintFollowed();
    }

    var localStorageAvailable = lsTest();

    $(document).ready(function(){

        if (localStorageAvailable)
        {
            followers = getLocalStorageArray(cacheKey+'_followers');

            // if have previously saved followers, increase delay,
            // update on page only when all users parsed
            if (followers.length)
            {
                waitForAllFetch = true;
                
                // cache results for 5 minutes
                if (localStorageAvailable)
                {
                    var lastFetchTime = localStorage.getItem(cacheKey+'_last_followers_fetch');
                    if (lastFetchTime && new Date().getTime() - lastFetchTime < 5*60*1000)
                    {
                        justCache = true;
                        waitForAllFetch = false;
                    }
                }
            }

            // clear previously parsed data, to parse all new
            saveUpdatedFollowersList([]);
        }

        function finishParse()
        {
            if (mainIntervalStopped)
            {
                return;
            }

            clearInterval(mainInterval);
            mainIntervalStopped = true;
            
            if (localStorageAvailable)
            {
                localStorage.setItem(cacheKey+'_last_followers_fetch', new Date().getTime());
            }
        }
        
        if (!justCache)
        {
            mainIntervalStopped = false;
            
            var mainInterval = setInterval(function(){
                // if there are request we wait to finish, exit
                if (requestsResponseLeftCount > 0)
                {
                    return;
                }
                // if not found any users on last interval
                if (lastIntervalFoundFollowers !== null && lastIntervalFoundFollowers === 0)
                {
                    finishParse();
                    return;
                }
                requestsResponseLeftCount = requestPerIteration;
                lastIntervalFoundFollowers = 0;
                for (var i = 0; i < requestPerIteration; i++)
                {
                    $.ajax({
                        type: 'GET',
                        url: 'https://api.dribbble.com/v1/users/'+username+'/followers/?page='+(curPage++)+'&per_page='+perPage,
                        beforeSend: function(jqxhr)
                        {
                            jqxhr.setRequestHeader('Authorization', 'Bearer ' + ACCESS_TOKEN);
                        },
                        success: function(res)
                        {
                            if (res.length === 0)
                            {
                                finishParse();
                                return;
                            }

                            for (var i = 0; i < res.length; i++)
                            {
                                setFollowed(res[i].follower.id);
                                lastIntervalFoundFollowers++;
                            }

                            // if not full page, assume it last one
                            if (res.length < perPage)
                            {
                                finishParse();
                            }
                        },
                        complete: function(){
                            requestsResponseLeftCount--;
                            // if this is last response of last iteration, save ids for page
                            // in this 'if' fetch ends
                            if (requestsResponseLeftCount === 0 && mainIntervalStopped)
                            {
                                if (localStorageAvailable)
                                {
                                    saveFinishedAmountOfFollowers();
                                }
                            }
                        }
                    });
                }
            }, 100);
        }

        // paint then set repaint with delay
        paintFollowed();
        setInterval(paintFollowed, repaintDelay);
    });
    
    function setFollowed(id)
    {
        id = Math.round(id);

        if (!waitForAllFetch && followers.indexOf(id) == -1)
        {
            followers.push(id);
        }

        if (localStorageAvailable)
        {
            addFollowerLocalStorage(id);
        }
    }

    function paintFollowed()
    {
        paintOnFollowingPage();
        paintOnShotPage();
        paintOnShotsListPage();
        paintOnCommentsPage();
        paintOnUserPage();
    }
    
    function paintOnFollowingPage()
    {
        var following = $('ol.list-of-scrolling-rows').find('.scrolling-row');
        
        if (following.length == 0)
        {
            return;
        }

        for (var i = 0; i < following.length; i++)
        {
            var userId = parseInt(following[i].className.match(/.*?user-row-(\d+).*/)[1]),
                userBlock = $(following[i]),
                title = userBlock.find('.hover-card-parent');

            // if not followed, remove mark if has one
            if (followers.indexOf(userId) == -1)
            {
                userBlock.removeClass('us-follows-you');
                userBlock.find('.us-follows-you-mark').remove();
                continue;
            }

            // if already marked as follower do nothing until all fetched
            if (userBlock.hasClass('us-follows-you'))
            {
                if (mainIntervalStopped)
                {
                    userBlock.find('.us-follows-you-mark').addClass('us-fetch-ready');
                }
                continue;
            }

            // set mark of follower
            userBlock.addClass('us-follows-you');
            title.html('<span title="Follows you" class="us-follows-you-mark'+(mainIntervalStopped ? ' us-fetch-ready' : '')+'">✓ </span>'+title.html());
        }
    }
    
    function paintOnShotsListPage()
    {
        var dribbbles = $('ol.dribbbles > li');
        
        if (dribbbles.length == 0)
        {
            return;
        }

        for (var i = 0; i < dribbbles.length; i++)
        {
            var userBlock = $(dribbbles[i]);
            if (userBlock.find('.attribution-team').length)
            {
                continue;
            }
            
            var avatar = userBlock.find('.attribution-user img');

            // avatar is not loaded yet
            if (!avatar || !avatar.attr('src'))
            {
                return;
            }
            
            
            var userId = parseInt(avatar.attr('src').match(/users\/(\d+)/)[1]),
                title = userBlock.find('.attribution-user a').first();

            // if not followed, remove mark if has one
            if (followers.indexOf(userId) == -1)
            {
                userBlock.removeClass('us-follows-you');
                userBlock.find('.us-follows-you-mark').remove();
                continue;
            }

            // if already marked as follower do nothing until all fetched
            if (userBlock.hasClass('us-follows-you'))
            {
                if (mainIntervalStopped)
                {
                    userBlock.find('.us-follows-you-mark').addClass('us-fetch-ready');
                }
                continue;
            }

            // set mark of follower
            userBlock.addClass('us-follows-you');
            title.html('<span title="Follows you" class="us-follows-you-mark'+(mainIntervalStopped ? ' us-fetch-ready' : '')+'">✓ </span>'+title.html());
        }
    }
    
    function paintOnCommentsPage()
    {
        var dribbbles = $('ol.comments > li');
        
        if (dribbbles.length == 0)
        {
            return;
        }

        for (var i = 0; i < dribbbles.length; i++)
        {
            var userBlock = $(dribbbles[i]),
                userId = parseInt(userBlock.attr('data-user-id')),
                title = userBlock.find('h2');

            // if not followed, remove mark if has one
            if (followers.indexOf(userId) == -1)
            {
                userBlock.removeClass('us-follows-you');
                userBlock.find('.us-follows-you-mark').remove();
                continue;
            }

            // if already marked as follower do nothing until all fetched
            if (userBlock.hasClass('us-follows-you'))
            {
                if (mainIntervalStopped)
                {
                    userBlock.find('.us-follows-you-mark').addClass('us-fetch-ready');
                }
                continue;
            }

            // set mark of follower
            userBlock.addClass('us-follows-you');
            title.html('<span title="Follows you" class="us-follows-you-mark'+(mainIntervalStopped ? ' us-fetch-ready' : '')+'">✓ </span>'+title.html());
        }
    }
    
    function paintOnShotPage()
    {
        var userBlock = $('.user');
        
        if (userBlock.length == 0)
        {
            return;
        }

        var userId = parseInt($('.user > a[rel=contact] img.photo').attr('src').replace(/.*users\/(\d+).*/, '$1')),
            title = userBlock.find('.shot-byline-user a');

        // if not followed, remove mark if has one
        if (followers.indexOf(userId) == -1)
        {
            userBlock.removeClass('us-follows-you');
            userBlock.find('.us-follows-you-mark').remove();
            return;
        }

        // if already marked as follower do nothing until all fetched
        if (userBlock.hasClass('us-follows-you'))
        {
            if (mainIntervalStopped)
            {
                userBlock.find('.us-follows-you-mark').addClass('us-fetch-ready');
            }
            return;
        }

        // set mark of follower
        userBlock.addClass('us-follows-you');
        title.html('<span title="Follows you" class="us-follows-you-mark'+(mainIntervalStopped ? ' us-fetch-ready' : '')+'">✓ </span>'+title.html());
    }
    
    function paintOnUserPage()
    {
        var userBlock = $('.profile-head');
        
        if (userBlock.length == 0)
        {
            return;
        }

        var avatar = $($('.profile-head img.photo')[0]);
        
        // avatar is not loaded yet
        if (!avatar || !avatar.attr('src'))
        {
            return;
        }
        
        var userId = parseInt(avatar.attr('src').replace(/.*users\/(\d+).*/, '$1')),
            title = userBlock.find('.profile-name a');

        // if not followed, remove mark if has one
        if (followers.indexOf(userId) == -1)
        {
            userBlock.removeClass('us-follows-you');
            userBlock.find('.us-follows-you-mark').remove();
            return;
        }

        // if already marked as follower do nothing until all fetched
        if (userBlock.hasClass('us-follows-you'))
        {
            if (mainIntervalStopped)
            {
                userBlock.find('.us-follows-you-mark').addClass('us-fetch-ready');
            }
            return;
        }

        // set mark of follower
        userBlock.addClass('us-follows-you');
        title.html('<span title="Follows you" class="us-follows-you-mark'+(mainIntervalStopped ? ' us-fetch-ready' : '')+'">✓ </span>'+title.html());
    }
})();