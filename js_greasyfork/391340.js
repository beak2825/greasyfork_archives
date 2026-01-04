// ==UserScript==
// @name         Auto Click to First Link
// @version      0.1
// @description  Works only on jcink and proboards-hosted forums. Automatically goes to the First Link boards of roleplay forums.
// @author       AyBeCee
// @match        *.jcink.net/*
// @match        *.b1.jcink.com*
// @match        *.boards.net/*
// @match        *.proboards.com/*
// @match        *.freeforums.net/*
// @match        http://*.b1.jcink.com/*
// @match        *.freeforums.net*
// @grant        none
// @namespace https://greasyfork.org/users/145271
// @downloadURL https://update.greasyfork.org/scripts/391340/Auto%20Click%20to%20First%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/391340/Auto%20Click%20to%20First%20Link.meta.js
// ==/UserScript==



if (document.body.innerHTML.indexOf("FAIRY TAIL") == -1){
    if (document.body.innerHTML.indexOf("Fairy Tail") == -1){
        if (document.body.innerHTML.indexOf("fairy tail") == -1){

            // JCINK VERSION

            // if the content restricted page turns up, automatically set the birthday and click the 'I understand' bit
            if($("*:contains('Content Restricted')").length > 0) {
                $("select[name=day]").val("1");
                $("select[name=month]").val("1");
                $("select[name=year]").val("1990");

                // click the 'I understand' bit
                $(".pformstrip .forminput:first-child").each(function(){
                    $(this).click();
                });

            };


            // if document isn't already a 'posting new topic' page
            if ( document.URL.indexOf("index.php?act=Post&CODE=00&f=") < 0 ) {

                $('a[href*="showforum="]').each(function(){

                    // get text only from the 'a'
                    var totext = $(this).text();
                    // convert the text to lowercase
                    var tolowercase = totext.toLowerCase();

                    // if the 'a' contains the word 'proboards'
                    if(tolowercase.indexOf('first') != -1) {

                        // get the first link href
                        var pbhref = $(this).attr('href');

                        // if the document doesn't already match the first link href, then go to the first link href
                        if ( document.URL.indexOf(pbhref) < 0 ) {
                            location.href = pbhref;
                        }

                    } else if(tolowercase.indexOf('first') != -1) {
                        // if the 'a' contains the word 'first'

                        // get the first link href
                        var href = $(this).attr('href');

                        // if the document doesn't already match the first link href, then go to the first link href
                        if ( document.URL.indexOf(href) < 0 ) {
                            location.href = href;
                        }

                    } else if(tolowercase.indexOf('advert') != -1) {
                        // if the 'a' contains the word 'advert'

                        // get the first link href
                        var adverthref = $(this).attr('href');

                        // if the document doesn't already match the first link href, then go to the first link href
                        if ( document.URL.indexOf(adverthref) < 0 ) {
                            location.href = adverthref;
                        }

                    } else if(tolowercase.indexOf('[center]') != -1) {
                        // if the 'a' contains the word '[center]'

                        // get the first link href
                        var centerhref = $(this).attr('href');

                        // if the document doesn't already match the first link href, then go to the first link href
                        if ( document.URL.indexOf(centerhref) < 0 ) {
                            location.href = centerhref;
                        }

                    }

                });



                // if the #navstrip (or nav tree) contains the word 'first', then click the 'new topic' button
                $('#navstrip').each(function(){

                    // get text only from the 'a'
                    var totext = $(this).text();
                    // convert the text to lowercase
                    var tolowercase = totext.toLowerCase();

                    // if the 'a' contains the word 'first'
                    if(tolowercase.indexOf('first') != -1) {
                        $('a[href*="index.php?act=Post&CODE=00&f="]').each(function(){
                            location.href = this;
                        });

                    }

                });
            }

            // PROBOARDS VERSION
            // if document isn't already a 'CREATE THREAD' page
            if ( document.URL.indexOf("/thread/new/") < 0 ) {
                $('a[href*="/board/"]').each(function(){

                    // get text only from the 'a'
                    var totext = $(this).text();
                    // convert the text to lowercase
                    var tolowercase = totext.toLowerCase();

                    // if the 'a' contains the word 'proboards'
                    if(tolowercase.indexOf('first') != -1) {

                        // get the first link href
                        var pbhref = $(this).attr('href');

                        // if the document doesn't already match the first link href, then go to the first link href
                        if ( document.URL.indexOf(pbhref) < 0 ) {
                            location.href = pbhref;
                        }

                    } else if(tolowercase.indexOf('first') != -1) {
                        // if the 'a' contains the word 'first'

                        // get the first link href
                        var href = $(this).attr('href');

                        // if the document doesn't already match the first link href, then go to the first link href
                        if ( document.URL.indexOf(href) < 0 ) {
                            location.href = href;
                        }

                    } else if(tolowercase.indexOf('advert') != -1) {
                        // if the 'a' contains the word 'advert'

                        // get the first link href
                        var adverthref = $(this).attr('href');

                        // if the document doesn't already match the first link href, then go to the first link href
                        if ( document.URL.indexOf(adverthref) < 0 ) {
                            location.href = adverthref;
                        }

                    } else if(tolowercase.indexOf('[center]') != -1) {
                        // if the 'a' contains the word '[center]'

                        // get the first link href
                        var centerhref = $(this).attr('href');

                        // if the document doesn't already match the first link href, then go to the first link href
                        if ( document.URL.indexOf(centerhref) < 0 ) {
                            location.href = centerhref;
                        }

                    }

                });

                // if the #navstrip (or nav tree) contains the word 'first', then click the 'new topic' button
                $('#navigation-tree').each(function(){

                    // get text only from the 'a'
                    var totext = $(this).text();
                    // convert the text to lowercase
                    var tolowercase = totext.toLowerCase();

                    // if the 'a' contains the word 'first'
                    if(tolowercase.indexOf('first') != -1) {

                        $('a[href*="/thread/new/"]').each(function(){
                            location.href = this;
                        });

                    }

                });
            }
        };
    };
};