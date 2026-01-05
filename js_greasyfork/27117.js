// ==UserScript==
// @name        GetRec'd: AO3 
// @namespace   http://archiveofourown.org
// @description adds recommendations to archiveofourown.org
// @include     http://archiveofourown.org/works/*
// @exclude     http://archiveofourown.org/works/search*
// @version     1.4
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/27117/GetRec%27d%3A%20AO3.user.js
// @updateURL https://update.greasyfork.org/scripts/27117/GetRec%27d%3A%20AO3.meta.js
// ==/UserScript==
/***** 

  A note on privacy: This script sends data about the AO3 work you are veiwing to a web server where it is stored in a database. 
  This process is anoymous and no information about you or your habits are collected. 

  Project blog: get-recd.tumblr.com

 *****/

(function() {
    'use strict';

    $(document).ready(function(){
        var usersAll = [];
        var users;
        var tags = {
            character: [],
            additional: []
        };
        var category = [];
        var workData = {};
        var title = $('#workskin .preface h2.title').text();

        $('#workskin')
            .append('<div id="rec-box"><hr><br></div>')
            .find('#rec-box')
            .toggle(false);
        $('#feedback ul.actions:nth-of-type(1)')
            .prepend('<a id="rec-button">You might also like...</a>')
            .on('click', '#rec-button', function(){
            console.log('click!');
            $('#rec-box').toggle();
        });

        fillArr('.kudos  a:not(#kudos_summary, #kudos_collapser)', usersAll);
        fillArr('.meta .fandom ul li a.tag', category);
        fillArr('dd.character.tags ul li a.tag', tags.character);
        fillArr('dd.relationship.tags ul li a.tag', tags.character);
        fillArr('dd.freeform.tags ul li a.tag', tags.additional);

        if (usersAll.length > 5000) {
            users = usersAll.slice(0, 5000);              
        } else {
            users = usersAll;
        }

        workData.users = users;
        workData.title = title;
        workData.category = category;
        workData.tags = tags;

        $.post('https://intense-reef-64978.herokuapp.com/', workData).done(function(res) {
            var data = JSON.parse(res);
            var message = data.fail;

            if (data.fail && !message) {
                $('#rec-box')
                    .append('<p>Oops! Something went wrong :( </p><br><a href="http//:get-recd.tumblr.com">Report a problem</a>');  
            } else if (message){
                $('#rec-box')
                    .append('<p>Oops! ' + message + '</p><br><a href="http://get-recd.tumblr.com">Report a problem</a>');
            } else {
                $(data.data).each(function() {
                    var recID = this._id;
                    var recTitle = this.name;
                    var recCategory = this.category;

                    $('#rec-box')
                        .append('<h4><a href="http://archiveofourown.org/works/' + recID  + '">' + recTitle + '</a></h4><h5>' + recCategory +'</h5><br>'); 
                });
            }
        });

    });


    function fillArr(selector, arr) {
        $(selector).each(function () {
            arr.push($(this).text());
        });   
    }

})();

