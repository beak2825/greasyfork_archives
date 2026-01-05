// ==UserScript==
// @name        sup/tg/ Archive Quote Functions 
// @namespace   https://greasyfork.org/users/2457-meganega 
// @description Inline Quoting ~ Quote Preview ~ Backlinks ~ Inline Image Expansion ~ Filter (Name/Tripcode) for suptg archives
// @include     http://suptg.thisisnotatrueending.com/archive/* 
// @require     http://code.jquery.com/jquery-latest.min.js 
// @version     1.31
// @grant       none 
// @downloadURL https://update.greasyfork.org/scripts/2065/suptg%20Archive%20Quote%20Functions.user.js
// @updateURL https://update.greasyfork.org/scripts/2065/suptg%20Archive%20Quote%20Functions.meta.js
// ==/UserScript==
$(document) .ready(function () {
    /* Create Backlinks */
    $('blockquote a.quotelink') .each(function () {
        var t = $(this) .attr('href') .replace(/#p/, '');
        if(t.match(/\/[a-z]{1,4}\//)) { return true; }
        var q = $(this) .parents("blockquote") .eq(0) .attr('id') .replace(/m/, '');
        if ($('#bl' + t) .length == 0) {
            $('#pi' + t + ' span.postNum.desktop') .after($('<div>') .attr('id', 'bl' + t) .addClass('backlink_'));
        }
        $('#bl' + t) .append($('<span>') .attr('id', 's' + t) .append($('<a>') .attr('href', '#p' + q) .addClass('quotelink') .append('>>' + q)));
    });
    /* Backlink Inline Quote */
    $('div.backlink_ a.quotelink') .click(function (event) {
        if (event.shiftKey) {
            event.preventDefault();
            window.location = this;
            return ;
        }
        event.preventDefault();
        var q = $(this) .attr('href') .replace(/#p/, '');
        var t = $(this) .parent() .attr('id') .replace(/s/, '');
        if ($(this) .parents('#pi' + t) .siblings('blockquote#m' + t) .children('[id^=f' + q + ']') .length) {
            $(this) .parents('#pi' + t) .siblings('blockquote#m' + t) .children('[id^=f' + q + ']') .remove();
            $(this) .removeClass('qLinkOpen');
        } else {
            $(this) .parents('#pi' + t) .siblings('blockquote#m' + t) .prepend($('#p' + q) .clone(true) .attr('id', 'f' + q + 't' + t));
            $(this) .addClass('qLinkOpen');
            $(this) .parents('#pi' + t) .siblings('blockquote#m' + t) .children('[id^=f' + q + ']') .find('[id$=t' + q + ']') .remove();
        }
    });
    /* Backlink Quote Preview */
    $('div.backlink_ a.quotelink') .hover(function (event) {
        var q = $(this) .attr('href') .replace(/#p/, '');
        var t = $(this) .parent() .attr('id') .replace(/s/, '');
        $(this) .parent() .after($('#p' + q) .clone() .addClass('qPreview') .attr('id', '') .css('margin-top', $(this) .height() * 1.6 + 'px'));
        $(this) .parent() .siblings('.qPreview') .find('[id$=t' + q + ']') .remove();
        var o = $('#p' + q) .width(),
        p = $(this) .parent() .siblings('.qPreview') .width(),
        po = $(this) .parent() .siblings('.qPreview') .offset() .left,
        w = $(window) .width();
        if (po / w > 0.7 || p / o < 0.4) {
            $('.qPreview') .css('margin-left', '-' + (parseInt(o) + $(this) .width() * 1.2) + 'px');
        }
        if ($('.qPreview') .offset() .left < 0) {
            $('.qPreview') .css({
                'margin-left': '0',
                'left': '0'
            });
        }
        var pb = ($(window).height() + $(window).scrollTop()) - ($('.qPreview').offset().top + $('.qPreview').height());
        if(pb < 0){
            $(".qPreview").css("margin-top", (parseInt(pb) + 10) +"px");
        }
    }, function (event) {
        $('.qPreview') .remove();
    });
    /* Name - Tripcode Filter */
    $("body").append( $("<div>").attr("class","filterWrap") );
    $(".filterWrap").append( $("<input class='filter' type='text' placeholder='Filter (Press enter to submit)'>") );
    $(".filter").after("<input id='fnormal' type='radio' name='filtType' value='normal' checked>", "<input id='fmark' type='radio' name='filtType' value='mark'>");
    $(".filter").after("<br>");
    $("#fnormal").after($("<label for='fnormal'>").text("Normal"));
    $("#fmark").after($("<label for='fmark'>").text("Mark"));
    $(".filter").after( $("<input id='fname' type='radio' name='filt' value='name' checked>") );
    $("#fname").after( $("<input id='ftrip' type='radio' name='filt' value='trip'>") );
    $(".filter").after("<br>");
    $("#fname").after( $("<label for='fname'>").text("Name") );
    $("#ftrip").after( $("<label for='ftrip'>").text("Tripcode") );
    $(".filter").before( $("<span>").attr("id","freport").html("") ).before("<br>");
    $("hr.abovePostForm").after( $("<div>").attr("class","clones") );

    $(".filter").keydown(function(event){
        if(event.which != 13){
            return;
        }
        
        if($("#fmark").is(":checked")){
            $(".marked").removeClass("marked");
            var ty = $("#ftrip").is(":checked") ? ".postertrip" : ".name";
            var m = $(".post").filter(function(){console.log(".postInfo .nameBlock " + ty); return $(this).find(".postInfo .nameBlock " + ty).text() == $(".filter").val().replace(/^\s+/,"").replace(/\s+$/,""); }).addClass("marked");
            $("#freport").html(m.filter(function(){ return !$(this).closest(".clones").length }).length + " post(s) were marked.");
            return;
        }
        $(".clones").children().remove();
        var filter = $(".filter").val().replace(/^\s+/,"").replace(/\s+$/,"");
        if(filter.length == 0){
            return $("#freport").html(0 + " post(s) were filtered");
        }
        var ftype, p, n, c=0;
        if($("#fname").is(":checked")) {ftype = "name"} else if($("#ftrip").is(":checked")) {ftype = "tripcode"}
            else {return $("#freport").html("Choose \"Name\" or \"Tripcode\"")}
        switch(ftype){
            case "name":
                $("div[id^=pc]").each(function(){
                    p = $(this).attr("id").replace(/pc/,"");
                    n = $(this).children("#p"+p).children("#pi"+p).find("span.name").html();
                    if(filter === n){
                        $(".clones").append( $(this).clone(true).addClass("clone") );
                        c++;
                        $(".clone").find("[id$=t"+p+"]").remove();
                        $(".clone").find("a[class*=qLinkOpen]").removeClass("qLinkOpen");
                    }
                });            
                break;
            case "tripcode":
                $("div[id^=pc]").each(function(){
                    p = $(this).attr("id").replace(/pc/,"");
                    n = $(this).children("#p"+p).children("#pi"+p).find("span.postertrip").html();
                    if(filter === n){
                        $(".clones").append( $(this).clone(true).addClass("clone") );
                        c++;
                        $(".clone").find("[id$=t"+p+"]").remove();
                        $(".clone").find("a[class*=qLinkOpen]").removeClass("qLinkOpen");
                    }
                });            
                break;
            default:
                return $("#freport").html("Ran into a problem.\nFilter could not be executed.");
        }
        $("#freport").html(c + " post(s) were filtered");
    });
});
/* Inline Quote */
$('blockquote a.quotelink') .click(function (event) {
    if (event.shiftKey) {
        event.preventDefault();
        window.location = this;
        return ;
    }
    event.preventDefault();
    var qPost = $(this) .attr('href') .replace('#p', '');
    var tPost = $(this) .parents("blockquote") .attr('id') .replace(/[a-z]/, '');
    if ($(this) .next('[id^=f' + qPost + ']') .length) {
        $(this) .next('[id^=f' + qPost + ']') .remove();
        $(this) .removeClass('qLinkOpen');
    } else {
        if ($('#p' + qPost) .hasClass('op')) {
            $(this) .after($('#p' + qPost) .clone(true) .attr('id', 'f' + qPost + 't' + tPost) .addClass('reply'));
            $(this) .addClass('qLinkOpen');
            $(this) .next('[id^=f' + qPost + ']') .find('[id$=t' + qPost + ']') .remove();
        } else {
            $(this) .after($('#p' + qPost) .clone(true) .attr('id', 'f' + qPost + 't' + tPost));
            $(this) .addClass('qLinkOpen');
            $(this) .next('[id^=f' + qPost + ']') .find('[id$=t' + qPost + ']') .remove();
        }
    }
});
/* Quote Preview */
$('blockquote a.quotelink') .hover(function (event) {
    var qPost = $(this) .attr('href') .replace('#p', '');
    var tPost = $(this) .parents("blockquote") .attr('id') .replace(/[a-z]/, '');
    var linkOffset = $(this) .offset() .left + 10 + $(this).width();
    if ($('#p' + qPost) .hasClass('op')) {
        $(this) .before($('#p' + qPost) .clone() .addClass('qPreview reply') .attr('id', ''));
        $(this) .siblings('.qPreview') .find('[id$=t' + qPost + ']') .remove();
    } else {
        $(this) .before($('#p' + qPost) .clone() .addClass('qPreview') .attr('id', ''));
        $(this) .siblings('.qPreview') .find('[id$=t' + qPost + ']') .remove();
    }
    var qpheight = $('.qPreview') .height();
    $('.qPreview') .attr('style', 'margin-top: -' + qpheight / 2 + 'px !important; margin-left: ' + linkOffset + 'px !important');
    var pb = ($(window) .height() + $(window) .scrollTop()) - ($('.qPreview') .offset() .top + qpheight);
    var pt = $('.qPreview') .offset() .top - $(window) .scrollTop();
    qpheight = $('.qPreview') .height();
    if (pb < 0) {
        var pos = qpheight / 2 - pb + 10;
        $('.qPreview') .attr('style', 'margin-top: -' + pos + 'px !important; margin-left: ' + linkOffset + 'px !important;');
    } else if (pt < 0) {
        var pos = qpheight / 2 + pt - 10;
        $('.qPreview') .attr('style', 'margin-top: -' + pos + 'px !important; margin-left: ' + linkOffset + 'px !important;');
    }
    $(".qPreview").css("left", "0");
}, function (event) {
    $('.qPreview') .remove();
});
/* Inline Image Expansion */
$('a.fileThumb') .click(function (event) {
    event.preventDefault();
    if ($(this) .hasClass('image_expanded')) {
        $(this) .find('.expImage') .remove();
        $(this) .children('img:first') .css('display', 'block');
        $(this) .removeClass('image_expanded');
    } else {
        var imgLink = $(this) .attr('href');
        var imgDim = $(this) .siblings('.fileText') .html() .replace(/<a.*a>/, '') .match(/[0-9]{1,6}x[0-9]{1,6}/);
        var imgW = imgDim[0].replace(/x[0-9]{1,6}/, '');
        var imgH = imgDim[0].replace(/[0-9]{1,6}x/, '');
        if (imgW > $(window) .width()) {
            imgH = (($(window) .width() - ($(this) .offset() .left * 2)) / imgW) * imgH;
            imgW = $(window) .width() - ($(this) .offset() .left * 2);
        }
        $(this) .children('img:first') .css('display', 'none');
        $(this) .addClass('image_expanded') .children('img:first') .after($('<img>') .attr({
            'src': imgLink,
            'href': imgLink
        }) .css({
            'width': imgW + 'px',
            'height': imgH + 'px'
        }) .addClass('expImage'));
    }
});
var css = $('<link>') .attr({
    'rel': 'stylesheet',
    'type': 'text/css',
    'href': 'data:text/css,' +
    '.qPreview { position: absolute; font-size: 10pt; display: inline-block !important;}' +
    '.postContainer, .postInfo:after { content: \'\'; display: block; clear: both; }' +
    '.backlink_ > span { font-size: 80%; margin: 0 0.4em 0 0; }' +
    '.backlink_ { display: inline; margin-left: 0.2em; }' +
    'a.qLinkOpen{ opacity: 0.5; }' +
    'div.reply{ border-style: solid; border-width: 1px; border-color: rgb(180,180,180) !important; }' +
    'a.quotelink{ color: rgb(20,80,100) !important; }' +
    '.backlink_ span{ display: inline-block; }' +
    '.filterWrap{position:absolute;top: 105px;right: 5px;}' +
    '.filterWrap input{position: relative;margin: 2px;padding: 3px;}' +
    '.filter{width: 170px;}' +
    '.clones{background-color:rgba(220,0,110,.1)}' +
    '.post.marked{border-left: 2px solid orange !important}'
}) .appendTo('head');
