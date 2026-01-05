// ==UserScript==
// @name           Infinitechan+ 8chan enhancer
// @include        https://8chan.co/*
// @include        http://h.8chan.co/*
// @include        http://8ch.net/*
// @include        https://8ch.net/*
// @description    A new re-worked version of my personal 8chan enhancer script, more dynamic and expansible, gorgeous too.
// @version        0.0.2
// @require        https://cdn.jsdelivr.net/jquery.timeago/1.4.1/jquery.timeago.js
// @namespace https://greasyfork.org/users/2657
// @downloadURL https://update.greasyfork.org/scripts/10109/Infinitechan%2B%208chan%20enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/10109/Infinitechan%2B%208chan%20enhancer.meta.js
// ==/UserScript==

//Options Variable
var options = ['Arrows', 'Relative_Time', 'Trip_Checkbox', 'Autoplay', 'Center_Thread', 'Unfloat_Boards', 'Name_Quotes', 'Hide_Fileinfo', 'Hide_Email'];
var activeoptions;
if (localStorage.getItem('activeoptions')){
    var activeoptions = localStorage.getItem('activeoptions');                                                                               
    activeoptions = JSON.parse(activeoptions);
} else {
    activeoptions = ['Arrows', 'Relative_Time', 'Trip_Checkbox', 'Autoplay', 'Center_Thread', 'Unfloat_Boards', 'Name_Quotes', 'Hide_Fileinfo', 'Hide_Email'];
};

var autoplaysize;
if (localStorage.getItem('autoplaysize')){
    var autoplaysize = localStorage.getItem('autoplaysize');                                                                               
} else {
    autoplaysize = 2;
};

//hijack function

location.replace("javascript:function makeIcon(){};");

//custom CSS and functions
$("<style>").text(".agot{padding:10px;} .optitem{cursor: pointer; cursor: hand; color:black;  font-size: 15px; font-family: monospace; font-weight: bold; padding: 7px; background-color: rgb(157, 157, 157); margin-bottom: 2px;} .optitem:hover{background-color:red;} .activeopt{background:orange;}").appendTo("head");

function hidefileinfo(){
    $("<style class='fileinfocss'>").text(".fileinfo{display:none !important;}").appendTo("head");
};

function centerer(){
    $("<style class='centerer'>").text("div.post.reply.post-hover { width:auto;} body {width:70%; margin:auto;} div.post.reply {width:100%;}").appendTo("head"); 
};

function unfixboards() {
    $('html').removeClass("desktop-style");
    $('html').removeClass("mobile-style");
}
function fixboards(){
    $('html').addClass("desktop-style");
    $('html').addClass("mobile-style");
}

function refreshposts(){
    $.get("" + document.location, function (data) {        
        $('form[name="postcontrols"]').replaceWith($(data).filter('form[name="postcontrols"]'));
    }).done(function() {
        loop();
    });
}

$("<style>").text(".post-image{max-width:100%;max-height:100%;}").appendTo("head");

//process replies

function loop(){
    $('.reply').not('.processed').each(function(){
        //timeago
        if (activeoptions.indexOf('Relative_Time') != -1){
            $(this).find('time').each(function(){
                $(this).clone().addClass('agot').insertBefore(this);        
            });
            $(this).addClass('processed');
        };
        //quotenames
        if (activeoptions.indexOf('Name_Quotes') != -1){
            $(this).find('a[onclick*="highlightReply"]').not('.named').not('.post_no').each(function() {
                $(this).addClass('named');
                data = $(this).attr('onclick');
                data = data.split("'")[1]
                naje = $('#'+data+'').parent().find('.name:first').text();
                trip = $('#'+data+'').parent().find('.trip:first').text();
                nametrip = ' - '+ naje + trip +'';
                $(this).append(nametrip);
            });
        };
        //autoplay
        if (activeoptions.indexOf('Autoplay') != -1){
            $(this).find('.file').not('.ap').each(function(){
                var filename = $(this).find('.fileinfo').find('a').text();
                if (filename.indexOf("gif") != -1 || filename.indexOf("webm") != -1){
                    var size = $(this).find('.fileinfo').find('.unimportant').text();
                    var fs
                    if (size.indexOf("MB") != -1) {
                        fs = Number(size.substring(1, 5))
                    };
                    sizelimit = Number(autoplaysize + '.00');
                    if (size.indexOf("KB") != -1 || fs < sizelimit){
                        if (filename.indexOf("gif") != -1){$(this).addClass('ap');$(this).find('.post-image').attr('src', $(this).find('.post-image').parent().attr('href'));}
                        if (filename.indexOf("webm") != -1){$(this).addClass('ap');
                                                            var webm = $(this).find('.post-image').attr('src').replace('thumb', 'src').replace('.jpg','.webm');
                                                            $(this).find('.post-image').replaceWith('<video class="webmp" width="255" height="auto" autoplay muted loop><source src="'+ webm +'" type="video/webm">Your browser does not support the video tag.</video>')
                                                            $(this).append('<div class="hidewebm" style="cursor: pointer; cursor: hand;">[show/hide webm]</div>')
                                                           }
                    };
                };
            });
        };


    });
    $('time.agot').timeago();
};

loop();

$(document).on('ajax_after_post, new_post', function (e, post) {
    loop();
});

$(document).on('new_post', function (e, post) {
    notify();
});

setInterval(function () {
    $('time.agot').timeago();
}, 6000);

$(document).on('click', ".hidewebm", function() {
    $(this).parent().find('.webmp').toggle();
});

$(document).on('mouseenter', ".post-image, .webmp", function() {
    $(this).parent().parent().parent().find('.fileinfo').attr('class', 'vfileinfo');
    clearTimeout( postimagetimer )
});

var postimagetimer;

$(document).on('mouseleave', ".post-image, .webmp", function() {
    var targarian = $(this).parent().parent().parent().find('.vfileinfo');

    postimagetimer = window.setTimeout(function(){
        $(targarian).attr('class', 'fileinfo');
    }, 1000);
});

//hide email
function hidemail(){
$('input[name="email"]').hide();
$('th:contains("Email")').hide();
}
function showmail(){
$('input[name="email"]').show();
$('th:contains("Email")').show();
}
// Tripcode Checkbox
boardu = ''+ document.location +'';
boardu = boardu.split('/')[3];

function tripcheck(){
    $('input[name="name"]').before('<div class="cbox"><input type="checkbox" name="Nom" class="checkname" value="Nom" checked> Tripcode <br></div>');
}
var checker = localStorage.getItem('check|'+boardu+'');
console.log(checker);



$(document).on('change', ".checkname", function() {
    if(this.checked) { localStorage.setItem("check|"+boardu+"", "ON")
    $("input[name='name']").prop('disabled', false)
                     } else { localStorage.setItem("check|"+boardu+"", "OFF")
                     $("input[name='name']").prop('disabled', true)};
});

//NewArrows
darkarrow = 'data:image/png;base64,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';
lightarrow = 'data:image/png;base64,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';

function newarrows(){
    $('body').append("<div class='circle' style='position:fixed;right:15%;bottom:10%;'><font size='30'><a class='upa' alt='Scroll Up' style='text-decoration: none;display:block;color:black;' href='javascript:window.scrollTo(0,0);'><img class='uparrow arr' src='"+darkarrow+"'></a><a class='downa' style='text-decoration: none;color:black !important;' href='javascript:window.scrollTo(0,900000000);'><img class='downarrow arr' style='-moz-transform: scaleY(-1);-o-transform: scaleY(-1);-webkit-transform: scaleY(-1);transform: scaleY(-1);filter: FlipV;-ms-filter: \"FlipV\";' src='"+darkarrow+"'></a></div>");
};

$(document).on('mouseenter', ".arr", function() {
    $(this).attr('src', lightarrow);
});

$(document).on('mouseleave', ".arr", function() {
    $(this).attr('src', darkarrow);
});

$(window).scroll(function() {
    if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
        $('.downa').hide();
    } else {$('.downa').show();};

    if ($(window).scrollTop() - 100 <= 0) {
        $('.upa').hide();
    } else {$('.upa').show();};
});

//options
gear = 'data:image/png;base64,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'
litgear = 'data:image/png;base64,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'

$(document).on('mouseenter', ".optm", function() {
    $(this).attr('src', litgear);
});

$(document).on('mouseleave', ".optm", function() {
    $(this).attr('src', gear);
});

$('body').append("<div class='optens' style='position:fixed;right:15%;top:2%;cursor: pointer; cursor: hand;'><img class='optm' src='"+gear+"'></div>");
$('body').append("<div class='smenu' style='position:fixed;right:5%;top:0px;width:150px;height:100%;background:grey;display:none;'></div>");

for (i = 0; i < options.length; i++) {
    clean = options[i].replace('_',' ');
    $('.smenu').append('<div class="optitem" id="'+options[i]+'">'+clean+'</div>');
};
for (i = 0; i < activeoptions.length; i++) {
    $('#'+activeoptions[i]+'').addClass('activeopt');
};

$('#Autoplay').after('<div style="color:black;font-weight:bold;">Size(MBs):<input type="text" class="playsize" name="autoplaysize" maxlength="3" autocomplete="off" style="width: 50px;" value="'+autoplaysize+'"></div>');

$(document).on('change', ".playsize", function() {
    autoplaysize = $(this).val(); 
    localStorage.setItem("autoplaysize", autoplaysize);    
});


$(document).on('click', ".optm", function() {
    $('.smenu').toggle();
});

$(document).on('click', ".optitem", function() {
    $(this).toggleClass('activeopt');
    id = $(this).attr('id');

    if (activeoptions.indexOf(id) != -1){        
        activeoptions = jQuery.grep(activeoptions, function(value) {
            return value != id;           
        });
        localStorage.setItem("activeoptions", JSON.stringify(activeoptions));
    }else{
        activeoptions.push(id)
        localStorage.setItem("activeoptions", JSON.stringify(activeoptions));
    };

    //dyn functions
    if (id == "Center_Thread"){
        if (activeoptions.indexOf(id) != -1){
            centerer();
        }else{
            $('.centerer').remove();
        };
    };

    if (id == "Unfloat_Boards"){
        if (activeoptions.indexOf(id) != -1){
            unfixboards();
        }else{
            fixboards();
        };
    };

    if (id == "Arrows"){
        if (activeoptions.indexOf(id) != -1){
            newarrows();
        }else{
            $('.circle').remove();
        };
    };

    if (id == "Hide_Fileinfo"){
        if (activeoptions.indexOf(id) != -1){
            hidefileinfo();
        }else{
            $('.fileinfocss').remove();
        };
    };

    if (id == "Name_Quotes"){
        if (activeoptions.indexOf(id) != -1){
            refreshposts();
        }else{
            refreshposts();
        };
    };

    if (id == "Autoplay"){
        if (activeoptions.indexOf(id) != -1){
            refreshposts();
        }else{
            refreshposts();
        };
    };

    if (id == "Relative_Time"){
        if (activeoptions.indexOf(id) != -1){
            refreshposts();
        }else{
            refreshposts();
        };
    };

    if (id == "Trip_Checkbox"){
        if (activeoptions.indexOf(id) != -1){
            tripcheck();
        }else{
            $('.cbox').remove();
        };
    };
    
     if (id == "Hide_Email"){
        if (activeoptions.indexOf(id) != -1){
            hidemail();
        }else{
            showmail();
        };
    };
});

if (activeoptions.indexOf('Center_Thread') != -1){centerer();};
if (activeoptions.indexOf('Unfloat_Boards') != -1){unfixboards();};
if (activeoptions.indexOf('Arrows') != -1){newarrows();};
if (activeoptions.indexOf('Hide_Fileinfo') != -1){hidefileinfo();};
if (activeoptions.indexOf('Trip_Checkbox') != -1){tripcheck();};

if (checker == "OFF"){ 
    $('.checkname').prop('checked', false);
    $("input[name='name']").prop('disabled', true);}
;

//Favicon Notify
darkent = 'data:image/png;base64,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';
lightent = 'data:image/png;base64,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'


$('#favicon').remove();
$('head').append('<link href="'+darkent+'" class="cfav" id="favicon" rel="shortcut icon">');

function notify(){
    var state = document["visibilityState"]; 
    if (state == "hidden")
    {  

        $('.cfav').remove();
        $('link[rel="shortcut icon"]').remove();
        $('head').append('<link href="'+lightent+'" class="cfav" id="favicon" rel="shortcut icon">');
    } else if (state == "visible") {
        $('.cfav').remove();
        $('link[rel="shortcut icon"]').remove();
        $('head').append('<link href="'+lightent+'" class="cfav" id="favicon" rel="shortcut icon">');
        setTimeout(function(){
            $('.cfav').remove();
            $('head').append('<link href="'+darkent+'" class="cfav" id="favicon" rel="shortcut icon">');
        },5000)
    }
};

var onVisibilityChange = function (args) {
    var state = document["visibilityState"];    
    if (state == "visible")
    {       
        $('.cfav').remove();
        $('head').append('<link href="'+darkent+'" class="cfav" id="favicon" rel="shortcut icon">');
    }
};


document.addEventListener("visibilitychange", onVisibilityChange, false);

//Index Stuff Later

if (window.location.href.indexOf("res") > -1) { } else {

};