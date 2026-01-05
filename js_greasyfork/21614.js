// ==UserScript==
// @name           KissCartoon Clean 
// @include        http://kisscartoon.me/Cartoon/*
// @include        https://kisscartoon.me/Cartoon/*
// @include        http://kissanime.to/Anime/*
// @include        https://kissanime.to/Anime/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// ==/UserScript==

var	DOM = {
    // main containers
    $body : $('body'),
    $containerRoot : $('#containerRoot'),
    $container : $('#container'),
    $adsIfrme : $('#adsIfrme'),
    $barContent : $('.barContent').first(),

    // single elements
    $epSelect : $('#selectEpisode'),
    $epPrev : $('#btnPrevious'),
    $epNext : $('#btnNext'),
    $selectPlayerParent : $('#selectPlayer').parent().parent(),
    $lightSwitch : $('#switch'),
    $video : $('#centerDivVideo'),
    $videoJS : $('.video-js').first(),
    $download : $('#divDownload'),
    $filename : $('#divFileName'),
    $clsTempMSg : $('.clsTempMSg').first(),
    $profileLinkParent : $('a[href="/Profile"]').parent().parent(),

    // multiple elements
    $ads : $('*[id*="adsIfrme"]').not('.bigBarContainer'),
    $clears : $('div[class*="clear"]'),
    $hide : $('.divCloseBut')
},

    // some variables
    title = $('title').text(),
    prevHref = DOM.$epPrev.parent().attr('href'),
    nextHref = DOM.$epNext.parent().attr('href'),

    strContains = function(haystack, needle){
        return (haystack.indexOf(needle) >= 0) ? true : false;
    },

    smartHide = function(elem){
        elem.css({
            'height' : 0,
            'overflow' : 'hidden',
            'padding' : 0,
            'margin' : 0
        });
    },

    restructurePage = function(){
        // hide unnecessary elements
        DOM.$selectPlayerParent.parent().prevAll('span').hide();
        DOM.$video.prev().prev('span').hide();
        DOM.$filename.hide();
        DOM.$ads.hide();
        DOM.$hide.hide();
        DOM.$lightSwitch.hide();
        DOM.$clsTempMSg.hide();
        DOM.$profileLinkParent.hide();

        smartHide(DOM.$container.siblings());
        smartHide(DOM.$containerRoot.siblings());
        smartHide(DOM.$clears);

        // adjust sizes and spacings
        DOM.$adsIfrme.css({
            'padding' : 0,
            'margin' : 0
        });
        DOM.$barContent.css({
            'background' : 'none',
            'line-height' : 'normal',
            'padding' : 0,
            'margin' : 0
        });
        DOM.$selectPlayerParent.css({
            'float' : 'none',
            'width' : 'auto',
            'text-align' : 'center'
        });
        DOM.$epSelect.parent().parent().css('padding', 0);
        DOM.$download.css('padding', 0);

        // recolor
        DOM.$containerRoot.css('background-color', '#fff');
        DOM.$adsIfrme.css('background-color', '#fff');
        DOM.$videoJS.css('background-color', '#000');
        DOM.$adsIfrme.css('border', 'none');
    },

    openEpisode = function(linkHref, linkTarget){
        if(linkHref === null){
            alert('EPISODE NOT FOUND');
        }else{
            window.open(linkHref, linkTarget);
        }
    },

    bindHotkeys = function(){
        $(document).keydown(function(e){
            if(e.ctrlKey && e.shiftKey && e.keyCode == 221){ // ctrl + shift + ]
                openEpisode(nextHref, '_blank');
            }else if(e.ctrlKey && e.keyCode == 221){ // ctrl + ]
                openEpisode(nextHref, '_self');
            }

            if(e.ctrlKey && e.shiftKey && e.keyCode == 219){ // ctrl + shift + [
                openEpisode(prevHref, '_blank');
            }else if(e.ctrlKey && e.keyCode == 219){ // ctrl + [
                openEpisode(prevHref, '_self');
            }
        });
    };

restructurePage();
bindHotkeys();
$('#videoAd').remove();
//$('#adsIfrme > div > div > div:nth-child(1)').hide();
$('#adsIfrme > div > div > div:nth-child(1)').css('background','#ccc').css('color','#222');
$('#adsIfrme > div > div > div:nth-child(13)').hide();
$('#divDownload').hide();