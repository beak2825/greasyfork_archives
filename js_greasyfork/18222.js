// ==UserScript==
// @name        quick_links
// @namespace   gt
// @description quick articles preview for sportdog.gr
// @include     http://www.sportdog.gr/*
// @version     1.0
// @grant       none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/js/bootstrap.min.js
// @downloadURL https://update.greasyfork.org/scripts/18222/quick_links.user.js
// @updateURL https://update.greasyfork.org/scripts/18222/quick_links.meta.js
// ==/UserScript==

jQuery(window).load(function(){

    jQuery('head').append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/css/bootstrap.min.css" type="text/css" />');
    jQuery('head').append('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css" type="text/css" />');

    createModalBox();
    var title = jQuery(".view-content .views-field-title")
    jQuery.each(title, function(){
        var element = jQuery(this);
        var url = element.find("a").attr("href");

        var modalButtonHTML = '' +
            '<button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#myModal"><span class="fa fa-search"></span></button>';

        element.html(modalButtonHTML+element.html());


        element.find("button").attr("style", 'width: 20px; float: left;height: 20px;font-size: 12px;margin-left: -2px;padding: 0px;margin-right: 4px;')
        element.find("button").click(function(){
            preview(url);
        })

    })

    function preview(url){
        var finalURL = url + " .node-content";
        var modalContent = jQuery('.modal-body');
        modalContent.html("<span class='fa fa-spinner fa-spin'></span>");
        modalContent.load(finalURL)
    }

    function createModalBox(html){

        var boxHTML = '' +
            '<div class="modal fade" id="myModal" role="dialog">' +
            '   <div class="modal-dialog">' +
            '   <!-- Modal content-->' +
            '       <div class="modal-content">' +
                '       <div class="modal-header">' +
                '           <button type="button" class="close"data-dismiss="modal">&times;</button>' +
                '           <h4 class="modal-title"></h4>' +
                '       </div>' +
                    '   <div class="modal-body">' +
                    '   </div>' +
                    '   <div class="modal-footer">' +
                    '       <button type="button" class="btnbtn-default"data-dismiss="modal">Κλείσιμο</button>' +
                    '   </div>' +
                   '</div>' +
               '</div>' +
            '</div>';
        var div = jQuery("<div>");
        div.html(boxHTML);
        div.appendTo(jQuery('body'));
    }

})
