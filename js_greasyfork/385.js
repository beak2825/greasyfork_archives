// ==UserScript==
// @name       		Swefilmer
// @namespace  		http://use.i.E.your.homepage/

// @version    		0.952000
// @description  	Wide player, and store layout to next time you change. Navigate faster to Next TV-Series or the previous one. Easy to see where you are. (colored) 

// @match      		http://www.swefilmer.com/*
// @require    		http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js

// @run-at     		document-end

// @grant      		GM_getValue
// @grant      		GM_setValue
// @grant      		GM_deleteValue
// @grant      		GM_log

// @created			2014-04-01
// @released		2014-00-00
// @updated			2014-00-00

// @history         @version v0.95200 							2015-02-20 - Check maximum Screen width
// @history         @version v0.95100 							2015-02-12 - FullPlayer button added. XtraWide has been widen. Code update
// @history         @version v0.95000 							2014-11-21 - FullPlayer added. layout correction. Code reorderd and some redesign.
// @history         @version v0.92421 							2014-06-01 
// @history         @version v0.9242 							2014-06-01
// @history         @version v0.902 							2014-04-14 - Added Description
// @history         @version v0.901 							2014-04-14 
// @history         @version v0.800 							2014-04-04 - first official version

// @compatible		Greasemonkey, Tampermonkey
// @license         GNU GPL v3 (http://www.gnu.org/copyleft/gpl.html) 
// @copyright		2014+, Magnus Fohlström
// @downloadURL https://update.greasyfork.org/scripts/385/Swefilmer.user.js
// @updateURL https://update.greasyfork.org/scripts/385/Swefilmer.meta.js
// ==/UserScript==

/*global $, jQuery*/

/*jshint -W014*/
// -W014, laxbreak, Bad line breaking before '+'

(function ($) { 
    $.fn.waitUntilExists	= function (handler, shouldRunHandlerOnce, isChild) {
        var found	= 'found';
        var $this	= $(this.selector);
        var $elements	= $this.not(function () { return $(this).data(found); }).each(handler).data(found, true);   
        if (!isChild) {
            (window.waitUntilExists_Intervals = window.waitUntilExists_Intervals || {})[this.selector] =
                window.setInterval(function () { $this.waitUntilExists(handler, shouldRunHandlerOnce,     
        true); }, 500);
        } else if (shouldRunHandlerOnce && $elements.length) {
            window.clearInterval(window.waitUntilExists_Intervals[this.selector]);
        }
		return $this;
	};
}(jQuery));

String.prototype.formatString = function(){ 
    return this.toString()
                .split(/\s+/g).join(' ')
                .split('{').join('{\n\t')
                .split('; ').join(';')
                .split(';').join(';\n\t')
                .split('*/').join('*/\n')
                .split('}').join('}\n'); 
};

function l(name,fn){ console.log( name, fn !== undefined ? fn : '' ); }

$( '<style id="navMenue"></style>'
 + '<style id="widePlayer"></style>'
 + '<style id="XtraWidePlayer"></style>'
 + '<style id="fullplayer"></style>'
 + '<style id="lightning"></style>').appendTo('head');

function navMenue()
{    
    var newRule_navMenue = ' '
    +	'.navMenue {'
    +		'border-color: rgb(117, 98, 69);'
    +		'border-radius: 10px;'
    +		'border-width: 2px;'
    +		'border-style: solid;'
    +		'background-color: rgb(146, 133, 117);'
    +		'color: #505050;'
    +		'padding: 3px 16px;'
    +		'margin-right: 6px;'
    +		'top: 1px;'
    +		'position: relative;'
    +		'z-index:1000;'
    +		'}'
    +	'#myConfigButton {'
    +		'float: left;'
    +		'font-size: 17px;'
    +		'margin-left: 2px;'
    +		'margin-top: 5px;'
    +		'}'
    +	'#myConfigButton img {'
    +		'margin-right: 5px;'
    +		'height: 29px;'
    +		'border-radius: 10px;'
    +		'}'
    +	'#lightHolder:hover, .navMenue:hover {'
    +		'cursor: pointer;'
    +		'}'
    
    +	'a:focus, .navMenue:hover, a:active {'
    +		'text-decoration: none;'
    +		'color: aliceblue;'
    +		'}'
    
    
    +	'.navMenue .titles {'
    +		'display:none !important;'
    +		'margin: -50px 105px;'
	+		'padding: 0 30px;'
    +		'}'
    +	'.navMenue:hover .titles {'
    +		'display:table !important;'
    +		'z-index:200000;'
    +		'position: absolute;'
    +		'}'
    
    +	'#tabCtrl iframe {'
    +		'border-style: none;'
    +		'}';
    $("style#navMenue").empty().html( newRule_navMenue.formatString() );
    
    var newHtml_navMenue =
        '<span id="myConfigButton" style="float:left">'
    +		'<span id="lightHolder"></span>'
    +		'<span id="prevMenue" class="navMenue">  Previous <span class="titles">  </span>  </span>'
    +		'<span id="nextMenue" class="navMenue">  Next     <span class="titles">  </span>  </span>'
    +		'<span id="fullMenue" class="navMenue sizeing"><span> FullBrowser </span></span>'    
    +		'<span id="XwideMenue" class="navMenue sizeing"><span> xtraWide </span></span>'
    +		'<span id="wideMenue" class="navMenue sizeing"><span> Wide </span></span>'
    +		'<span id="orginMenue" class="navMenue sizeing"><span> Orginal </span></span>'
    //+		'<span id="playMenue" class="navMenue"><span href="#"> Play </span></span>'
    +	'</span>';
    $( newHtml_navMenue ).insertAfter( ".fsol" );
    $( "#lightHolder" ).prepend( $( "#lightningOff" ) );
}

function widePlayer()
{    
    var newRule_widePlayer = ' '
    +	'#content > div.filmborder {'
    +		'margin-left: 0px;'
    +		'width: 975px;'
    +		'}'
    +	'#content > div.filmborder > div.filmcontent {'
    +		' width: 975px;'
    +		'}'
    +	'.filmicerik object, .filmicerik embed, .filmicerik iframe, .filmicerik {'
    +		'width: 958px;'
    +		'}'
    +	'.filmcontent {'
    +		'width: 732px;'
    +		'}'
    +	'.filmicerik object, .filmicerik embed, .filmicerik iframe {'
    +		'height: 714px;'
    +		'}';
    $("style#widePlayer").empty().html( newRule_widePlayer.formatString()  ); 
}

function XtraWidePlayer()
{    
    var TargetWidth = 1400,
        screenW = window.screen.width,
        Scorr = screenW < TargetWidth ? screenW - 40 : TargetWidth,
        multi = Scorr/980,
        newRule_XtraWidePlayer = 
    	'body {'
    +		'background-size: calc(1818px*'+multi+');'
    +		'}'
    +	'#wrap, #content, #header, #topnavbar {'
    +		'width: calc(980px*'+multi+');'
    +		'}'
    +	'#navbarborder, #navbar {'
    +		'width: calc(976px*'+multi+');'
    +		'}'
    +	'.filmicerik object, .filmicerik embed, .filmicerik iframe, .filmicerik {'
    +		'width: calc(964px*'+multi+');'
    +		'}'
    +	'.filmicerik object, .filmicerik embed, .filmicerik iframe {'
    +		'height: calc(714px*'+multi+');'
    +		'}'
    +	'div.leftC {'
    +		'width: calc(722px*'+multi+');'
    +		'}'
    +	'div.filmborder,  div.filmcontent {'
    +		'width: calc(975px*'+multi+') !important;'
    +		'}'
    +	'.leftC div.filmcontent {'
    +		' width: calc(100% - 323px) !important;'
    +		'}'
    +	'div#fastdizidata {'
    +		'width: calc(720px*'+multi+');'
    +		'padding-left: 35px;'
    +		'}'
    +	'div.alt {'
    +		'width: inherit;'
    +		'background-size: calc(138%);'
    +		'}'
    +	'.alt .fsag {'
    +		'margin: 5px 29px 0px 0px;'
    +		'}'
    +	'div.filmalti {'
    +		'padding-left: 25px;'
    +		'}'
    +	'div.filmaltiimg {'
    +		'padding-bottom: 21px;'
    +		'}'
    +	'div#respond {'
    +		'padding-left: 25px;'
    +		'}'
    +	'div.moviefilm {'
    +		'margin: 0 32px 25px 34px;'
    +		'}'
    +	'#sidebar {'
    +		'width: 317px;'
    +		'margin-top: -2px;'
    +		'}'
    +	'#content .sidebarborder {'
    +		'width: 315px !important;'
    +		'}'
    +	'#content .sidebar-right {'
    +		'width: 310px !important;'
    +		'}'
    +	'#content .sidebar-right h2 {'
    +		'width: 302px;'
    +		'background-size: cover;'
    +		'}'
    +	'div.filmana {'
    +		'width: 99%;'
    +		'}'
    +	'div.arama {'
    +		'margin-left: 175px;'
    +		'}'
    +	'#movies {'
    +		'margin-left: 0px !important;'
    +		'}';
    
    $("style#widePlayer").empty().html( newRule_XtraWidePlayer.formatString() );	
}

function fullplayer(corr)
{
    corr = corr !== undefined ? corr : 0;
    var newWindowWidth = $( window ).width() - 18 + corr,
        newRule_fullplayer =
		'div#topnavbar, div#header, div#navbarborder, .clear.h10, .clear, '
    +	'#wrap div[align=center], .leftC, div#sidebar, .footborder, div#footer, '
    +	'h1.yazitip, .fast_part, .fast_rating, .alt {'
    +		'display: none;'
    +		'}'
    +	'div#wrap, div#content, div#movies, div.filmcontent, .filmicerik {'
    +		'width: 100% !important;'
    +		'}'
    +	'.filmicerik object, .filmicerik embed, .filmicerik iframe, .filmicerik {'
    +		'height: '+( $( window ).height() - 18 + corr )+'px !important;'
    +		'}'
    +	'.filmicerik object, .filmicerik embed, .filmicerik iframe, .filmicerik {'
    +		'width: '+newWindowWidth+'px !important;'
    +		'}'
    +	'body {'
    +		'overflow: hidden;'
    +		'}'
    +	'#wrap {'
    +		'margin: 0;'
    +		'}'
    +	'#content {'
    +		'padding: 0px 0px 0px 0px !important;'
    +		'}'
    +	'#movies {'
    +		'margin-left: 0px !important;'
    +		'}'
    +	'.filmcontent, .filmicerik {'
    +		'padding-bottom: 10px;'
    +		'}';
    
    $("style#fullplayer").empty().html( newRule_fullplayer );
    $(".filmcontent").css('cssText','width: calc(100% - 2px) !important;');
    
    scrollIt(0);
}

$( window ).resize(function() { 
    if( $('html').hasClass('fullplayer') ) fullplayer(); 
});

function lightning()
{   
    var newRule_lightning = ' '
    +	'div#sidebar, .filmborder, .alt2, .alt .fsol, .facebok, .facepaylas, .alt .fsag, .center, .yazitip, .fast_part, .fast_rating, #topnavbar, #header, #navbarborder, .navMenue {'
    +		'opacity: 0.0;'
    +		'}'
    +	'body, div.alt {'
    +		'background: #191919;'
    +		'}'
    +	'body {'
    +		'background: rgb(18, 18, 18);'
    +		'}';
    $("style#lightning").empty().html( newRule_lightning.formatString()  );
}

function ScrollZoomTune(selection,zomms,tune,ani)
{    
    var position = $( selection ).position(); 
    $('body').css('zoom',zomms);
    
    if( position == "undefined" )
    {
        console.log('is undis');
    } else {
        position = position.top;
        position = position + tune;
        if( ani == 1 ){
            $('body').animate({ scrollTop: position * zomms });}
        else{
            $('body').scrollTop( position * zomms);
        }
    }
}

function Colorize(thisnode)
{
    var nextText, prevText;    
    $('#nextMenue, #prevMenue').hide();
    
    $(thisnode).prevAll().css('color','').attr('id','');
    $(thisnode).prev().css('color','lightblue').attr('id','next');

    prevText = $(thisnode).prev().text();
    if( prevText.search('S') > 1 ) 
    {
        $('#nextMenue .titles').text( prevText );
        $('#nextMenue').show();
    }
    
    $(thisnode).css('color','rgb(246, 120, 120)').attr('id','');
    $(thisnode).nextAll().css('color','').attr('id','');
    $(thisnode).next().css('color','rgb(146, 218, 146)').attr('id','prev'); 

	nextText = $(thisnode).next().text();    
    if( nextText.search('S') > 1 ) 
    {
        $('#prevMenue .titles').text( nextText ).show();
        $('#prevMenue').show(); 
    }    
}

$('#lightsoff').waitUntilExists(function()
{   
    $( "#lightsoff img" ).attr('id','lightningOff');
    $('#lightning').addClass('on');
    navMenue();
    
    $('#prevMenue, #nextMenue, #OrginMenue, #wideMenue, #XwideMenue').hide();
    //$('#' + GM_setValue( "swefiler_state" ) + 'Menue').show();
    
    $('#content > div.leftC > div:nth-child(1)').attr('id','movies');
    
    $( "#lightningOff" ).on('click',function(){	
        
        l('light',$('#lightning').hasClass('on'));  

        if( $('#lightning').hasClass('on') ) {
            $('#lightning').removeClass('on');
            lightning();
            
            $('.yazitip').css('opacity','0.4');
            $('#movies').css('opacity','1');
            $('#lightHolder').css('opacity','0.5');
            $('#fullMenue, #XwideMenue, #wideMenue, #orginMenue, #prevMenue, #nextMenue, #lightningOff').css('opacity','0.05');
            $('#lightningOff').css('opacity','1');
            
            $('#fullMenue, #XwideMenue, #wideMenue, #orginMenue, #prevMenue, #nextMenue, #lightningOff').on('mouseenter', function(){
                $(this).css('opacity','0.75');
            }).on('mouseleave', function(){
                $(this).css('opacity','0.05');
            });
            
            $('#lightHolder').on('mouseenter', function(){
                $(this).css('opacity','0.95');
            }).on('mouseleave', function(){
                $(this).css('opacity','0.5');
            });
            
        } else {
            $('#lightning').addClass('on');
            $("style#lightning").empty();
            
            $('#fullMenue, #XwideMenue, #wideMenue, #orginMenue, #prevMenue, #nextMenue, #lightningOff, .yazitip, #lightHolder').css('opacity','1');
            $('#fullMenue, #XwideMenue, #wideMenue, #orginMenue, #prevMenue, #nextMenue, #lightningOff, #lightHolder').on('mouseenter', function(){
                $(this).css('opacity','1');
            }).on('mouseleave', function(){
                $(this).css('opacity','1');
            });
        }
    });
    
    function removeHeadplayerCss()
    {
        $("style#widePlayer").empty(); 
        $("style#XtraWidePlayer").empty(); 
    } 
    
    $('#fullMenue').on('click',function(){
        if( $('html').hasClass('fullplayer') ) return false;
        $('html').addClass('fullplayer');
        $('#wideMenue').click();
        fullplayer(15);
        $("#lightningOff").click().css('opacity', $('#nextMenue').css('opacity') );
    });
    
    $('#XwideMenue').on('click',function(){
        removeHeadplayerCss();
        $( "#content" ).prepend( $( "#movies" ) );
        widePlayer();
        XtraWidePlayer();
		$('.sizeing').hide();
        $('#orginMenue').show();
        $('#wideMenue').show();
        $('#fullMenue').show();

        GM_setValue( "swefiler_state", "Xwide" );
    });
    
    $('#wideMenue').on('click',function(){
        removeHeadplayerCss();
        $( "#content" ).prepend( $( "#movies" ) );
        widePlayer();
		$('.sizeing').hide();
        $('#XwideMenue').show();
        $('#orginMenue').show();
        $('#fullMenue').show();

        GM_setValue( "swefiler_state", "wide" );
    });
    
    $('#orginMenue').on('click',function(){	
        
        $( ".leftC" ).prepend( $( "#movies" ) );  
        removeHeadplayerCss(); 
		$('.sizeing').hide();
        $('#XwideMenue').show();
        $('#wideMenue').show(); 
        $('#fullMenue').show();
        
        GM_setValue( "swefiler_state", "orgin" );         
    });
    
    //GM_deleteValue( "swefiler_state" );     
    function state()
    {
        $('#' + GM_getValue( 'swefiler_state' ) + 'Menue' ).click().addClass('gotGM');
        
        if( $('.gotGM').size() === 0 ) {
            setTimeout(function() {
                GM_setValue( "swefiler_state", "orgin" );
                state();
            }, 50);
        }
    }    
    state();
    
    document.addEventListener('keydown', function(e) {
        GM_log(e.keyCode);
        if (e.keyCode == 27) { //esc
            if( $('html').hasClass('fullplayer') === false ) return false;
            $("style#fullplayer").empty();
            $(".filmcontent, .filmcontent").css('cssText','');
            $('html').removeClass('fullplayer');
            $("#lightningOff").click().css('opacity', $('#nextMenue').css('opacity') );
        }
        if (e.keyCode == 109) { //-
            $("#prev").click();
        }
        if (e.keyCode == 66) { //b
            $('#fullMenue').click();
        }
        if (e.keyCode == 107) { //+
            $("#next").click();
        }
        if (e.keyCode == 76) { //L
            $("#lightningOff").click().css('opacity', $('#nextMenue').css('opacity') );
        }
        if (e.keyCode == 88) { //x
            $('#XwideMenue').click();
        }
        if (e.keyCode == 87) { //w
            $('#wideMenue').click();
        }
        if (e.keyCode == 79) { //O
            $('#orginMenue').click();
        }
    }, false);    
});

function clicking(x,y){

    var ev = document.createEvent("MouseEvent");
    var el = document.elementFromPoint(x,y);
    ev.initMouseEvent(
        "click",
        true /* bubble */, true /* cancelable */,
        window, null,
        x, y, 0, 0, /* coordinates */
        false, false, false, false, /* modifier keys */
        0 /*left*/, null
    );
    el.dispatchEvent(ev);
}

function scrollIt(time)
{
    setTimeout(function() {
        if( $(window).height() <= 866 ){
            ScrollZoomTune('#movies',1,100,1);
        } else {
            ScrollZoomTune('#movies',1,1,1);
        }
    }, time);
}

//while ( $('#fastdizidata > a:nth-child(1)').size() != 1 )
$('#fastdizidata > a:nth-child(1)').waitUntilExists(function()
{
    $('#prevMenue, #nextMenue').show();
    
    $('#fastdizidata > a:contains(' + $('#yazibasligi').text() + ')').each(function(){
        Colorize(this);
    });

    $('#fastdizidata > a').on('click',function(){
        Colorize(this);
        scrollIt(500);
    });
    
    $('#prevMenue').on('click',function(){
        $('#prev').click();
        $('#movies').focus();
    });
    
    $('#nextMenue').on('click',function(){
        $('#next').click();
        $('#movies').focus();
    });    
    
    $('.yazitip.cpointer').click();
});

$(document).ready(function(){

    if( $('#header .headerleft a').size() > 0 && $('.yazitip.cpointer').size() > 0 )
    {
        $('.yazitip.cpointer').click();
    }
    
    $('#movies').focus();
    
    scrollIt(1000);
    
    $('body').on('click',function(e){
        if( e.target == this && e.which == 1 ){ 
        	scrollIt(50);
            //clicking(750,350);
        }
    });
    
    function checkNumber( num, div )
    {
        return ( num % div === 0 ) ? true : false;
    }
    
    var div = 21, rof = div * 30;
    for ( var i=1; i <= rof; i++ ) 
    {
        if( checkNumber( i, div ) === true )
        {
            console.info( i / div + ' * ' +  div + ' = ' + i ); 
            //console.log('check number:',i + ' if divided by: ' + div + ' is an interger: ' + checkNumber( i, div ) );
        }
    }
});
