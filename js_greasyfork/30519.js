// ==UserScript==
// @name         Block LibertyBallers.com Trolls (aka the HellsBells70 blocker)
// @namespace    http://tampermonkey.net/
// @version      0.60
// @description  a script to block trolls on libertyballers.com (Thanks to Boschee4three for his code contributions)
// @author       armyofda12mnkeys-aka-hallsballs70-aka-howlsbowels70
// @include      http://www.libertyballers.com/*
// @include      http://libertyballers.com/*
// @include      https://www.libertyballers.com/*
// @include      https://libertyballers.com/*
// @grant        none
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/30519/Block%20LibertyBallerscom%20Trolls%20%28aka%20the%20HellsBells70%20blocker%29.user.js
// @updateURL https://update.greasyfork.org/scripts/30519/Block%20LibertyBallerscom%20Trolls%20%28aka%20the%20HellsBells70%20blocker%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(function(){
        console.log("LibertyBallers.com Troll Blocker starting!!!");

        //HEY YOU! READ BELOW!!!
        //VVV--- EDIT BELOW WITH USERNAMES separated by comma's. Make sure to put single or double quotes to surround the usernames as well.---VVV
        var usernames_to_block = ['HellsBells70', 'put_another_username_here', 'and_put_another_username_here'];
        var sentencing_level = 'spanking'; //use 'death' or 'block' to remove their stuff entirely, or
                                                // 'spanking' or 'hide' to grey it out, or
                                                // 'pic' to use a fun background image, or
                                                // 'early-release' or 'none' to stop blocking people
        var pic_to_use = 'https://s3.amazonaws.com/iknow_images/large_v1/3734210_large_v1_210eb95a1811334c10a641f444a4e99b.jpeg'; //if you use the pic setting above, use this image to replace that person's posts with...
                          //some suggestions if using the pic settings:
                          //iverson: https://s3.amazonaws.com/iknow_images/large_v1/3734210_large_v1_210eb95a1811334c10a641f444a4e99b.jpeg
                          //embiid:  https://pbs.twimg.com/profile_images/679359132143591424/0Ei-_mxB.jpg
        //^^^--- EDIT ABOVE WITH USERNAMES you'd like to block---^^^

        if(!(sentencing_level==='none'||sentencing_level==='early-release')) {
            //remove fanposts
            for(let i = 0; i < usernames_to_block.length; i++) {
                var username_to_block = usernames_to_block[i];
                console.log('Checking '+ username_to_block);

                //remove fanposts on main homepage in right sidebar
                var username_fanposts_by = $('.l-col__sidebar span.c-byline__item a:contains("'+ username_to_block +'")');
                var username_fanposts = username_fanposts_by.closest('li');
                if( sentencing_level=='death' || sentencing_level=='block') {
                    username_fanposts.remove();
                } else if (sentencing_level=='pic'){
                    username_fanposts.empty().css('height', '100px').css('background-image','url('+ pic_to_use +')').css('background-repeat', 'repeat');
                } else {
                    username_fanposts.css('background', '#EFEFEF').css('opacity', '.1').find('a').css('color','#999');
                }
                console.log('Removing #'+ username_fanposts_by.length +' fanposts by '+ username_to_block +' on homepage right sidebar.');

                //remove in the standalone fanposts section of site
                var username_fanposts_by2 = $('.m-fanpost__index-table .m-fanpost__table-subject em a:contains("'+ username_to_block +'")');
                var username_fanposts2 = username_fanposts_by2.closest('tr');
                if( sentencing_level=='death' || sentencing_level=='block') {
                    username_fanposts2.remove();
                } else if (sentencing_level=='pic'){
                    username_fanposts2.empty().css('height', '100px').css('background-image','url('+ pic_to_use +')').css('background-repeat', 'repeat');
                } else {
                    username_fanposts2.css('background', '#EFEFEF').css('opacity', '.2'); //.find('a').css('color','#999');
                }
                console.log('Removing #'+ username_fanposts_by2.length +' fanposts by '+ username_to_block +'in standalone fanpost section.');
            }


            //remove comments
            var comments = $("#comments");
            if(comments.length > 0) {
                var observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        var entry = {
                            mutation: mutation,
                            el: mutation.target,
                            value: mutation.target.textContent,
                            oldValue: mutation.oldValue
                        };

                        $(usernames_to_block).each(function () {
                            console.log('Looking at removing comments by '+ this);
                            var comment_to_remove_in_articles = $('.c-comments__date a:contains("'+ this +'")').closest('.c-comments__comment');
                            if(comment_to_remove_in_articles.length > 0 ) {
                                console.log('Removing '+ comment_to_remove_in_articles.length +' comments by '+ this);

                                if( sentencing_level=='death' || sentencing_level=='block') {
                                    comment_to_remove_in_articles.remove();
                                } else if (sentencing_level=='pic'){
                                    comment_to_remove_in_articles.empty().css('height', '150px').css('background-image','url('+ pic_to_use +')').css('background-repeat', 'repeat');
                                } else {
                                    comment_to_remove_in_articles.css('background', '#EFEFEF').css('opacity', '.2'); //not needed .find('a').css('color','#999');
                                }
                            }

                            var comment_to_remove_in_fanposts = $('.meta a.poster:contains("'+ this +'")').closest('.citem');
                            if(comment_to_remove_in_fanposts.length > 0 ) {
                                console.log('Removing '+ comment_to_remove_in_fanposts.length +' comments by '+ this);

                                if( sentencing_level=='death' || sentencing_level=='block') {
                                    comment_to_remove_in_fanposts.remove();
                                } else if (sentencing_level=='pic'){
                                    comment_to_remove_in_fanposts.empty().css('height', '150px').css('background-image','url('+ pic_to_use +')').css('background-repeat', 'repeat');
                                } else {
                                    comment_to_remove_in_fanposts.css('background', '#EFEFEF').css('opacity', '.2'); //not needed .find('a').css('color','#999');
                                }
                            }

                        });
                    });
                });
                observer.observe(comments[0], {
                    childList: true,
                    subtree: true
                });
            }


        }
    });
})();
