// ==UserScript==
// @name           /ent/ 8chan/Wikieat Enhancer 2
// @include        https://8chan.co/*
// @include        http://h.8chan.co/*
// @include        http://8ch.net/*
// @include        https://8ch.net/*
// @include 	   http://boards.wikieat.org/*
// @description    8chan extender with several functions. Included tripcode checkbox, youtube title loading, relative time and last seen tripnames.
// @version        0.0.35
// @require        https://cdn.jsdelivr.net/jquery.timeago/1.4.1/jquery.timeago.js
// @namespace      https://greasyfork.org/users/2657

// @downloadURL https://update.greasyfork.org/scripts/2289/ent%208chanWikieat%20Enhancer%202.user.js
// @updateURL https://update.greasyfork.org/scripts/2289/ent%208chanWikieat%20Enhancer%202.meta.js
// ==/UserScript==

//Config Vars
var Configs = {linkimgopt:"OFF", arrows:"ON", noko:"OFF", antiflood:"ON", quickreply:"ON", inlinereply:"ON", linkstoview:"ON", nofloat:"OFF", textformat:"ON", centerthread:"OFF", autorefresh:"OFF", namecheck:"ON", lastseen:"ON", yttitles:"ON", relativetime:"ON", bumplimit:"ON", resetbutton:"ON", imgpreviews:"ON", nopedo:"OFF", autoplay:"ON", unspoiler:"OFF", quotenames:"ON"};
var defCon = Configs;
var Description = {linkimgopt:"Links To Images", arrows:"Scroll Arrows", noko:"Noko", antiflood:"Anti-Flood Detection", quickreply:"Quick Reply", inlinereply:"In-Line Reply", linkstoview:"Links To Buttons", nofloat:"Unfix Floating Boards", textformat:"Text-Formation Buttons", centerthread:"Center Threads", autorefresh:"Auto-Refresh", namecheck:"Tripcode Checkbox", lastseen:"Last Seen", yttitles:"Load YT titles", relativetime:"Show Relative Time", bumplimit:"Bump Limit Warning", resetbutton:"Reset Form Button", imgpreviews:"Image Select Previews", nopedo:"No Pedo", autoplay:"AutoPlay Gif/Webm", unspoiler:"Display Spoilered", quotenames:"Show names on quote"};
$('#post-form-inner').addClass( "postboxy" );    

//Load Configs System
if (localStorage.getItem('Configs')){
    var Configs2 = localStorage.getItem('Configs');                                                                               
    Configs = JSON.parse(Configs2);
};

//Configs Saver
function save(){
    localStorage.setItem("Configs", JSON.stringify(Configs));
};
//Update Management
var version = localStorage.getItem('Version');
if (version != "0.0.35"){ localStorage.setItem("Notify", "Yes")};
$( document ).ready(function() {    
    if (localStorage.getItem('Notify')){
        $('.notify').remove();
        $('.subtitle').before('<div class="notify"><center><b><font color="DodgerBlue"><div class="closemsg"><font size="5" color="red" style="cursor: pointer; cursor: hand;">X</font>  Hide this Message.</div><br><img src="https://i.imgur.com/uPSP7HK.jpg"><br>This is the first time running or your script just got updated. Your configurations have been set to default.<br> <font color="red">Script version: 0.0.35</font><br>Latest Updates: Now included option to display tripnames next to the quotes. <br>Fixed issues with 8chan\'s new reply box and fixed issues with previous new functions (unspoiler odd sized pics, no hide pic for webms in autoplay)<br> Minor update: Disabled auto-untick spoiler because it was causing issues, will fix it later. Also, improved the display of auto un-spoilered pics. <br> Enjoy!</font></b></center><br><br><hr></div>');
        if (version != "0.0.35"){
            delete window.localStorage["Configs"]        
            Configs = defCon;
            save();
            renmenu();};
    };
});

$(document).on('click', ".closemsg", function() {
    $('.notify').remove();
    localStorage.removeItem('Notify');
});

localStorage.setItem("Version", "0.0.35");




//General
$('#body').css({width:"auto", "max-width":"70%"});

$("<style>").text("div.menu, div.optionsmenu, div.qrbg {background-color: grey; color: black;} .quotes {background-color: rgba(255, 102, 0, 1); border: 1px solid grey; color: black;} div.menu a:link, div.menu a:visited {  color: rgba(255, 102, 0, 1); } div.menu a:hover { color: red; } ").appendTo("head");

var UserCSS = localStorage.getItem('user_css');                                                                               

$("<style>").text(UserCSS).appendTo("head");

$('#favicon').remove();
$('head').prepend('<link href="https://i.imgur.com/wBQJqld.png" id="favicon" rel="shortcut icon">');

if (window.location.href.indexOf("res") > -1) {
    //Notifier/Counter
    $(document).on( "new_post", function() {
        count++;
        if (Configs["linkimgopt"] == "ON") {linkimg();};
        if (Configs["inlinereply"] == "ON") {genreply();};
        if (Configs["linkstoview"] == "ON") {linkstoview();};
        if (Configs["nopedo"] == "ON") {nopedo();};
        if (Configs["quotenames"] == "ON") {quotenames();};
    });
    
    
    var count = 0;
    
    
    
    
    
    var title_regex = /^\(\d+\) (.*)$/;
    var original_title = document.title;
    var match = title_regex.exec(document.title);
    if (match != null) {
        original_title = match[1];
    };
    
    setInterval(function() {
        var state2 = document["visibilityState"];
        if (state2 == "visible"){
            count = 0;};
        if (count > 0 && state2 == "hidden") {
            document.title = '('+count+') '+original_title;
            $('#favicon').remove();
            $('head').append('<link href="https://i.imgur.com/lfAW4fq.png" id="favicon" rel="shortcut icon">');
        };
    }, 10000);
    
    var onVisibilityChange = function (args) {
        var state = document["visibilityState"];
        if (state == "visible")
        {
            document.title = original_title;
            count = 0;
            $('#favicon').remove();
            $('head').append('<link href="https://i.imgur.com/wBQJqld.png" id="favicon" rel="shortcut icon">');
        }
    };
    
    document.addEventListener("visibilitychange", onVisibilityChange, false);
    
};
//Image Previews
if (Configs["imgpreviews"] == "ON") {
    $('.postboxy').append('<span class="upload_file"></span><span class="upload_file2"></span><span class="upload_file3"></span><span class="upload_file4"></span><span class="upload_file5"></span>');
    
    $( "form" ).submit(function( event ) {
        $("[class*='upload_file']").html('');
    });
    $(document).on('change', "[id*='upload_file']", function(){  
        if (window.FileReader) {
            var Reader = new FileReader();
            var file = this.files[0];
            window.file2 = file;
            var previewarea = $('.' + $(this).attr('id'));
            if (file.type.indexOf("video") > -1) {
                
                previewarea.html('');
                
                Reader.onload = function (event) {
                    previewarea.append([' <video width="100" height="88" controls><source src="'+ event.target.result +'" type="'+ window.file2.type +'">Your browser does not support the video tag.</video>'].join(''));
                }
                Reader.readAsDataURL(file);
                
                
            }else{
                previewarea.html('');
                Reader.onload = function (event) {
                    previewarea.append(['<img style="max-height:88px;max-width:100px;" src="' + event.target.result + '" alt="">'].join(''));
                }
                Reader.readAsDataURL(file);
            }
        };
    });
    
    
};
//Auto-Refresh Json
if (Configs["autorefresh"] == "ON") {
    $.fn.reverse = [].reverse;
    
    var URL = window.location.pathname;
    var URLs = URL.slice(0, -5);
    var URLf = URLs.split("/");
    var board_name = URLf[1];
    
    setInterval(function () {
        
        $.getJSON(configRoot + board_name + "/0.json", function (j) {
            var new_threads = 0;
            
            j.threads.forEach(function (t) {
                var s_thread = $("#thread_" + t.posts[0].no);
                
                if (s_thread.length) {
                    var my_posts = s_thread.find(".post.reply").length;
                    
                    var omitted_posts = s_thread.find(".omitted");
                    if (omitted_posts.length) {
                        omitted_posts = omitted_posts.html().match("^[^0-9]*([0-9]+)")[1] | 0;
                        my_posts += omitted_posts;
                    }
                    
                    my_posts -= t.posts[0].replies | 0;
                    my_posts *= -1;
                    
                    
                    
                    if (my_posts != 0) {
                        
                        my_posts = 0;
                        
                        $.ajax({
                            url: document.location,
                            success: function(data) {
                                $(data).find('div.post.reply').each(function() {
                                    var id = $(this).attr('id');
                                    if($('#' + id).length == 0) {
                                        $(this).insertAfter($('div.post:last').next()).after('<br class="clear">');
                                        $(document).trigger('new_post', this);
                                    }
                                });
                                
                            }
                        });
                        
                        
                    };
                    
                } else {
                    
                }
            });
            
        });
    }, 10000);
};


//Menu

$('body').append("<div class='menu' style='position:fixed; right:10%; bottom:20%; width:49px;'></div>")

//Config Menu    
$("body").append("<div class='optionslink' style='cursor: pointer; cursor: hand; width:auto;'>[Script Options]</div>")
$("body").append("<div class='optionsmenu' style='display:none; position:fixed; right:10%; top:5%; width:200px; padding:5px;'></div>")
$(document).on('click', ".optionslink", function() {
    $(".optionsmenu").css("display","inline");
    $('.optionslink').html("[Close Script Options]");
    $('.optionslink').attr('class', 'optionslinkclose');
    
});
$(document).on('click', ".optionslinkclose", function() {
    $(".optionsmenu").css("display","none");
    $('.optionslinkclose').html("[Script Options]");
    $('.optionslinkclose').attr('class', 'optionslink');
});



function renmenu(){
    if (localStorage.getItem('Configs')){
        var Configs2 = localStorage.getItem('Configs');                                                                               
        Configs = JSON.parse(Configs2);
    };
    
    rendermenu = '';
    $.each(Configs, function(i, key) {
        rendermenu += '<div alt="' + i + '" class="menubutton" style="cursor: pointer; cursor: hand; width:auto;">' + Description[i] + ' [' + Configs[i] + ']</div>';
        
    });
    var bgurl2;
    if (localStorage.getItem('bgurl')){
        bgurl2 = localStorage.getItem('bgurl');
    };
    rendermenu += '<div class="reset" style="cursor: pointer; cursor: hand; width:auto;">[Reset Configurations]</div>'
    rendermenu += '<div class="backbround" style="cursor: pointer; cursor: hand; width:auto;">BG URL:<input type="text" name="bgurl" class="bgurl" size="10" autocomplete="off" value="' + bgurl2 + '"></div>'
    
    $(".optionsmenu").html(rendermenu);        
};

renmenu();

$(document).on('click', ".reset", function() { 
    delete window.localStorage["Configs"]        
    Configs = defCon;
    save();
    renmenu();
});

var bgstore = $('body').css('background');
//    localStorage.setItem("bgurl", "derp");
$( ".bgurl" ).change(function() {
    bgurl = $('.bgurl').val();
    localStorage.setItem("bgurl", bgurl);        
    if (bgurl.match(/\.(jpg|png|gif)/g)){
        $('body').css('background', 'url("' + bgurl + '")');
    } else { $('body').css('background', bgstore)};
});
if (localStorage.getItem('bgurl')){
    if (localStorage.getItem('bgurl').match(/\.(jpg|png|gif)/g)){
        $("<style>").text("body {background:url('" + localStorage.getItem('bgurl') + "');}").appendTo("head"); 
    };};

$(document).on('click', ".menubutton", function() {
    buttonid = $(this).attr('alt');
    changevar = Configs[buttonid];
    if (changevar === "ON") {changevar = "OFF";} else {changevar = "ON";};
    Configs[buttonid] = changevar;
    save();
    renmenu();        
});

// Disable Index Stuff

if (window.location.href.indexOf("res") > -1) {}else{
    
    $.each(Configs, function(i, key) {
        
        if (['quickreply', 'inlinereply', 'autorefresh', 'bumplimit', 'lastseen'].indexOf(i) >= 0) {
            Configs[i] = "OFF";
        }
        
    });
    
};



//Arrows
if (Configs["arrows"] == "ON") {
    $('.menu').append("<center><font size='30'><a alt='Scroll Up' style='text-decoration: none' href='javascript:window.scrollTo(0,0);'>▲</a><br><a style='text-decoration: none' href='javascript:window.scrollTo(0,900000000);'>▼</a>")
};

//ImageFilters


function imagefilter() {
    if (Configs["autoplay"] == "ON" || Configs["unspoiler"] == "ON") {
        $('.file').not('.ap').each(function(){
            
            if (Configs["unspoiler"] == "ON"){
            if ($(this).find('.post-image').attr('src') == "/static/spoiler.png") {
			fullimg = $(this).find('.post-image').parent().attr('href')
            $(this).find('.post-image').attr('src', fullimg).attr('style', 'width:auto;height:auto;').wrap( "<div class='hold' style='max-width:255px;max-height:255px;'></div>" );;
            }
            };
            
            if (Configs["autoplay"] == "ON"){
                var filename = $(this).find('.fileinfo').find('a').text();
                if (filename.indexOf("gif") != -1 || filename.indexOf("webm") != -1){
                    var size = $(this).find('.fileinfo').find('.unimportant').text();
                    var fs
                    if (size.indexOf("MB") != -1) {
                        fs = Number(size.substring(1, 5))
                    };
                    if (size.indexOf("KB") != -1 || fs < 2.00){
                        if (filename.indexOf("gif") != -1){$(this).addClass('ap');$(this).find('.post-image').attr('src', $(this).find('.post-image').parent().attr('href'));}
                        if (filename.indexOf("webm") != -1){$(this).addClass('ap');
                                                            var webm = $(this).find('.post-image').attr('src').replace('thumb', 'src').replace('.jpg','.webm');
                                                            $(this).find('.post-image').replaceWith('<video class="webmp" width="255" height="auto" autoplay muted loop><source src="'+ webm +'" type="video/webm">Your browser does not support the video tag.</video>')
                                                            $(this).append('<div class="hidewebm" style="cursor: pointer; cursor: hand;">[show/hide webm]</div>')
                                                           }
                    };
                };
            }     
        });
            
    };
};


if (Configs["autoplay"] == "ON" || Configs["unspoiler"] == "ON") {
imagefilter();
    $("<style>").text(".post-image{max-width:100%;max-height:100%;}").appendTo("head");
$(document).on( "new_post", function() {imagefilter();});
$(document).on('click', ".hidewebm", function() {
        $(this).parent().find('.webmp').toggle();
   
});
};



//quote names

if (Configs["quotenames"] == "ON") {
    function quotenames(){
    $('a[onclick*="highlightReply"]').not('.named').not('.post_no').each(function() {
    $(this).addClass('named');
    data = $(this).attr('onclick');
    data = data.split("'")[1]
    naje = $('#'+data+'').parent().find('.name').text();
    trip = $('#'+data+'').parent().find('.trip').text();
    nametrip = ' - '+ naje + trip +'';
    $(this).append(nametrip);
    });
    
    };
    quotenames();
};

//nopedo
if (Configs["nopedo"] == "ON") {
    function nopedo(){$('.files, .video-container').before("<div class='showimgbutton' style='cursor: pointer; cursor: hand;display:inline-block;'>[Show Image]</div>").wrap( "<div class='hidecontain' style='display:none;'></div>" );
                      
                     };
    nopedo();
    
    $(document).on('click', ".showimgbutton", function() {
        $(this).next().toggle();
    });
    
};
//linkimg
function linkimg(){
    $('a[href$=".png"][rel="nofollow"], a[href$=".jpg"][rel="nofollow"], a[href$=".gif"][rel="nofollow"]').each(function(){
        $(this).replaceWith('<div class="linkedimg2" style="width:100px;display:inline-block;"><img class="linkedimg2" style="max-width: 100%;" src="' + $(this).attr('href') + '" /></div>');
    });
    
    $(document).on('click', ".linkedimg2", function() {
        $(this).css('width', 'auto');
        $(this).attr('class', 'clicked');
    });
    
    $(document).on('click', ".clicked", function() {
        $(this).css('width', '100px');
        $(this).attr('class', 'linkedimg2');
    });
    
};

// Tripcode Checkbox
if (Configs["namecheck"] == "ON") {
    $("tr th:contains('Name')").append(' <input type="checkbox" name="Nom" class="checkname" value="Nom" checked>');
    var checker = localStorage.getItem('check');
    if (checker == "OFF"){ $('.checkname').prop('checked', false) 
    $("[name='name']").prop('disabled', true)}
    
    $(".checkname").change(function() {
        if(this.checked) { localStorage.setItem("check", "ON")
        $("[name='name']").prop('disabled', false)
                         } else { localStorage.setItem("check", "OFF")
                         $("[name='name']").prop('disabled', true)};
    });
};

if (Configs["linkimgopt"] == "ON") {linkimg();};

// No Floating Boards

if (Configs["nofloat"] == "ON") {$(document).ready(function(){ $('html').removeClass("desktop-style"); $('html').removeClass("mobile-style");});};


//linkstoview
function linkstoview(){
    $('a[href$=".png"][rel="nofollow"], a[href$=".jpg"][rel="nofollow"], a[href$=".gif"][rel="nofollow"]').each(function(){
        var linkURL = $(this).attr('href');
        $(this).replaceWith('<div class="viewbutton" id="' + $(this).attr('href') + '"><b>[Click to View Image]</b> <br>' + $(this).attr('href') + '</a></div>')
    });
    
    
    $(document).on('click', ".viewbutton", function() {
        $(this).replaceWith('<br><div class="linkedimg2" style="width:100px;display:inline-block;"><img class="linkedimg2" style="max-width: 100%;" src="' + $(this).attr('id') + '" /></div>');
    });
    
    $(document).on('click', ".linkedimg2", function() {
        $(this).css('width', 'auto');
        $(this).attr('class', 'clicked');
    });
    
    $(document).on('click', ".clicked", function() {
        $(this).css('width', '100px');
        $(this).attr('class', 'linkedimg2');
    });
    
};

if (Configs["linkstoview"] == "ON") {linkstoview();};


// Quick Reply
if (Configs["quickreply"] == "ON") {
    
    
    $( document ).ready(function() {
        $(".close-btn").click();
    });
    $('.post_no').on('click', function(){ 
        $(".close-btn").click();     
    });    
    
    $('.menu').append("<center><font size='30'><a style='text-decoration: none' class='QR'><img style='cursor: pointer; cursor: hand;' src='https://i.imgur.com/f8L6S1O.png'></a><a style='text-decoration:none;display:none;cursor: pointer; cursor: hand;' class='QR2'>X</a><br>");
    //$("<style>").text(".postboxy { resize:horizontal; overflow:auto; padding:5px; max-width:80%;}").appendTo("head");
    $('body').on('click', '.QR, .post_no', function() {
        $('.close-btn').click();
        $('.postboxy').after("<div class='dummytext' style='height:350px;'></div>");
        $('.postboxy').css({position:"fixed", top:"1%", right:"calc(10% + 49px)"});
        $( ".postboxy" ).addClass( "qrbg" );
        $(".posttable").css("margin","auto");
        $(".QR").css("display","none");
        $(".QR2").css("display","inline");
        wii = screen.width / 2;
        hii = screen.height / 2;
        $('#body').css({width:"100%", "max-width":"100%", resize:"vertical", "max-height":hii});
        //$('.posttable').css({width:"100%",  resize:"none"});
        //$(".posttable").css("margin","inherit");
        $('.dummytext:not(:last-child)').remove();
        
        
        
    });
    $('body').on('click', '.QR2', function() {
        $( ".dummytext" ).remove();
        $('.postboxy').css({position:"", top:"", right:""});
        $( ".postboxy" ).removeClass( "qrbg" );
        $('.postboxy').insertAfter($('.banner'));
        $(".posttable").css("margin","auto");
        $(".QR").css("display","inline");
        $(".QR2").css("display","none");
        $('#body').css({width:"", height:"", resize:""});
        $('.posttable').css({width:"auto",  resize:"none"});
        
    });
};

// In-Line Reply
if (Configs["inlinereply"] == "ON") {
    $('table:first-of-type').addClass( "posttable" );
    function quotador(id){
        $("textarea[id*='body']")[0].value += '>>' + id + '\n';
        reply_id = 'reply_' + id;
        $( ".dummytext" ).remove();
        $('.banner').after("<div class='dummytext' style='height:301px;'></div>");
        $('.postboxy').insertAfter("#" + reply_id);   
        $(".posttable").css("margin","inherit");
        
        $(".QR").css("display","none");
        $(".QR2").css("display","inline");
    };
    
    function genreply(){
        $("iframe").removeAttr('style');
        if(window.location.href.indexOf("res") > -1) {
            $('.quotes').remove();
            $( "div[id^='reply_']" ).each(function() {
                var replyid = $(this).attr("id")
                replyid = replyid.replace("reply_", "");
                $(this).find('> .intro').append('<div class="quotes" id="'+ replyid +'" style="display:inline-block; float:right; margin: 3px; padding: 3px; cursor: pointer; cursor: hand;">Reply</div></div>');
                
            })};
    };
    
    genreply();
    
    $('body').on('click', 'div.quotes', function() {
        var currentId = $(this).attr('id');
        
        $( ".postboxy" ).removeClass( "qrbg" );
        $(".postboxy").removeAttr('style');
        $('#body').css({width:"", height:"", resize:""});
        quotador(currentId);
    });
    
};



//Text Formatting
if (Configs["textformat"] == "ON") {
    jQuery.fn.extend({
        insertAtCaret: function(myValue, myValueE){
            return this.each(function(i) {
                if (document.selection) {
                    //For browsers like Internet Explorer
                    this.focus();
                    sel = document.selection.createRange();
                    sel.text = myValue + myValueE;
                    this.focus();
                }
                else if (this.selectionStart || this.selectionStart == '0') {
                    //For browsers like Firefox and Webkit based
                    var startPos = this.selectionStart;
                    var endPos = this.selectionEnd;
                    var scrollTop = this.scrollTop;
                    this.value = this.value.substring(0,     startPos)+myValue+this.value.substring(startPos,endPos)+myValueE+this.value.substring(endPos,this.value.length);
                    this.focus();
                    this.selectionStart = startPos + myValue.length;
                    this.selectionEnd = ((startPos + myValue.length) + this.value.substring(startPos,endPos).length);
                    this.scrollTop = scrollTop;
                } else {
                    this.value += myValue;
                    this.focus();
                }
            })
        }
    });
    $('#body').after('<br class="stylebar">');
    
    $('.stylebar').after('<input class="formbutton_SS" type="button" value="Spoiler" /><input class="formbutton_B" type="button" value="B" /><input class="formbutton_R" type="button" value="R" /><input class="formbutton_S" type="button" value="S" /><input class="formbutton_I" type="button" value="I" /><input class="formbutton_C" type="button" value="Code" />');
    $('.formbutton_I').css('font-style', 'italic');
    $('.formbutton_S').css('text-decoration', 'line-through');
    $('.formbutton_R').css('color', 'red');
    $('.formbutton_B').css('font-weight', 'bold');
    $('.formbutton_SS').css('font-weight', 'bold');
    
    $('.formbutton_C').on('click', function(){ 
        $("textarea[id*='body']").insertAtCaret("[code]", "[/code]");
    });
    $('.formbutton_I').on('click', function(){ 
        $("textarea[id*='body']").insertAtCaret("''", "''");
    });
    $('.formbutton_S').on('click', function(){ 
        $("textarea[id*='body']").insertAtCaret("~~", "~~");
    });
    $('.formbutton_R').on('click', function(){ 
        $("textarea[id*='body']").insertAtCaret("==", "==");
    });
    $('.formbutton_B').on('click', function(){ 
        $("textarea[id*='body']").insertAtCaret("'''", "'''");
    });
    $('.formbutton_SS').on('click', function(){ 
        $("textarea[id*='body']").insertAtCaret("**", "**");
    });
};
// Last Seen

if (Configs["lastseen"] == "ON") {
    function LS(){    
        var ago = [];        
        var blacklist = [];
        var nametimes = [];
        $($(".intro").get().reverse()).each(function() {
            var $this = $(this);
            mn = $this.find('.name').text() + $this.find('.trip').text();            
            if (! blacklist[mn] == 1) {
                ago += $this.find('.name').text() + $this.find('.trip').text() + ' - <font color="DeepSkyBlue "> ' + $this.find('time').text() + '</font><br>';                       
            };
            blacklist[mn] = 1;                
        });
        $('.uselist').remove();
        $('.subtitle').after('<div class="uselist"><center><font color="DodgerBlue"><b><br><br>Users last seen: <br>' + ago + '</b></center></font></div>');
    };
    
    $(document).on( "new_post", function() {
        LS(0);
    });
    
    $(document).on( "timedone", function() {
        LS(0);
    });
    setInterval(function () {
        LS(0);
    }, 6000);
    
};


//Youtube Titles

function yttitle(me){
    var myregexp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
    var src = $(me).attr("href"); 
    $(me).append(" - Loading Title...");
    var id = src.match(myregexp)[1];
    var link = me;
    $.ajax({
        url: "https://gdata.youtube.com/feeds/api/videos/" + id + "?v=2&alt=jsonc",
        
        dataType: "json",
        success: function(data) {
            parseresults(link,data)
        }
    });
    
    function parseresults(link,result) {
        var linktitle = result.data.title;
        $(link).text(linktitle); //setting title from extracted id
        $(link).addClass( "titled" );
    };
    
    
    
};

if (Configs["yttitles"] == "ON") {
    $( document ).ready(function() {
        
        $('.body').find('a[href*="youtube.com/watch?v="]').not( ".titled" ).each(function() {
            yttitle(this);
        });
        
    });
    
    $(document).on( "new_post", function() {
        
        
        $('.body').find('a[href*="youtube.com/watch?v="]').not( ".titled" ).each(function() {
            yttitle(this);
        });
    });
    
};

/************************************************************************
RELATIVE TIME (Taken from 8chanX, all credits due~)
*************************************************************************/
if (Configs["relativetime"] == "ON") {
    $(document).ready(function() {  
        $("time").timeago();
        $(document).trigger('timedone', this);
    });
    
    // Show the relative time for new posts
    $(document).on('new_post', function (e, post) {  
        $("time").timeago();
    });
};


//Bump Limit Warning
if (Configs["bumplimit"] == "ON") {
    var split = window.location.pathname.split(/[\/+.]/g);
    var board_name = split[1], threadno = split[3];
    
    $('#thread_stats').append('<span class="bumplimit"></span>');
    $('#thread_stats').prepend('<span class="total"></span>');
    function bumplimit(){
        $.getJSON( "https://8chan.co/" + board_name + "/0.json", function( data ) { 
            for (i = 0; i < data.threads.length; i++) { 
                if (data.threads[i].posts[0].no == threadno) { replies = data.threads[i].posts[0].replies;
                                                              $('.total').html(replies + " total | ");
                                                              if (replies > 250){$('.bumplimit').html(' | <span style="color:#ff0000;"><strong>Bump Limit Reached.</strong></span></p>');};
                                                              
                                                              break;};
            }   
        });
    };
    bumplimit();
    $(document).on('new_post', function (e, post) {  
        bumplimit();
    });
};
//smaller functions

if (Configs["centerthread"] == "ON") {
    
    
    $("<style>").text("div.post.reply.post-hover { width:auto;} body {width:70%; margin:auto;} div.post.reply {width:100%;}").appendTo("head"); 
    
    
};



if (Configs["resetbutton"] == "ON") {
    var form = $('form[name="post"]');
    $('.stylebar').after('<input class="resetpost" type="button" value="Reset">');
    $('.resetpost').css('color', 'red');
    
    $('.resetpost').on('click', function(){ 
        $(form).find('input[type="submit"]').val('Reseted');
        $('input[name="embed"]').val('');
        $(form).find('input[type="submit"]').removeAttr('disabled');
        $(form).find('input[name="subject"],input[name="file_url"],\
textarea[name="body"],input[type="file"]').val('').change();
        
    });
    
    //var $form = $('form[name="post"]');
    //setTimeout(function(){ $form.submit(function() {$('#spoiler').prop('checked', false); $('input[name="embed"]').val('');}); }, 2000);

};

if (Configs["antiflood"] == "ON") {
    
    
    var subjects=['Maisie','Lauren','Khaleesi','Chloë','Kiki','Elle','Cara', 'Gracie', 'Alice', 'Sophie', 'Joey', 'Hotwheels', 'Ronaldo', 'Maddie', 'Laneya', 'Jordyn', 'Victoria', 'Isabelle', 'Hailee', 'Barbara', 'Brighton', 'Katheryn'];
    var verbs=['killed','will get','will find','attained','found','will marry','will accept','accepted', 'wants', 'released', 'bought', 'will eat', 'will think of', 'may have', 'can stop', 'is uglier than', 'is prettier than', 'waifus'];
    var objects=['Juno','everyone','super powers','her dragons','my feels', 'Chloë', 'Elle', 'your death', 'new boobs', 'Alice', 'Sophie', 'Joey'];
    var endings=['.',', right?','.',', like I said.','.',', just like your momma!', ', it is known.', ', biatch.', ', literally', ];
                 
                 var wawah= "";
                 
                 for(x=0;x<Math.round(Math.random()*10);x++){
                 var _JuNk=Math.random();
                 }
                 
                 window.onload=Math.random;
                 document.onmouseover=Math.random;
                 document.onmouseout=Math.random;
                 document.onmousedown=Math.random;
                 
                 function mumuz(){
                 var mumu
                 mumu = '[' + subjects[Math.round(Math.random()*(subjects.length-1))]+' '+verbs[Math.round(Math.random()*(verbs.length-1))]+' '+objects[Math.round(Math.random()*(objects.length-1))]+endings[Math.round(Math.random()*(endings.length-1))]+' - Anti Flood]\n';
    return mumu;
}


function makeid(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";    
    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));    
    return text;
};

$("tr th:contains('Comment')").append('<br><br><input class="antiflood" type="checkbox">AntiFlood');
$("input[name='post']").click(function(){
    
    var checked = $(".antiflood:checked").length;
    if(checked == 1) {
        bodytext = $("#body").val();
        $("#body").val(mumuz() + bodytext);
    };});

};


//autonoko
if (Configs["noko"] == "ON") {
    function noko(){
        document.getElementsByName("email", "input")[0].value = "noko";
    };
    
    
};