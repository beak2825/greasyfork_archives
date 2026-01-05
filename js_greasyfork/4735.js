// ==UserScript==
// @name       eg24_fixer
// @namespace  junkus
// @version    0.6
// @description  remove subpar game authors from eg24
// @match      http://www.escapegames24.com/*
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/4735/eg24_fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/4735/eg24_fixer.meta.js
// ==/UserScript==

if (document.addEventListener){
    document.addEventListener("DOMContentLoaded", durf(), false);
}


function durf() {
    unsafeWindow.removeEventListener('load',unsafeWindow.tryMessage);
    if(typeof unsafeWindow.jQuery == 'undefined'){
        var jq = document.createElement('script');
        jq.src = "//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js";
        document.getElementsByTagName("head")[0].appendChild(jq);
    }
}

var blorp=new RegExp('('+[
    'scary',
    'haunted',
    'hidden object',
    
    '[0-9]escape',
    '[0-9]games',
    '10 gnomes',
    '123bee',
    '143[a-z]',
    '3csgames',
    '5ngames',
    '8bgames',
    'abroy',
    'ainars',
    'ajaz',
    'amajeto',
    'artkivez',
    'avmgames',
    'cabeza',
    'cafecafe',
    'clickingonly',
    'coolbuddy',
    'crazeingames',
    'darakeguma',
    'defygames',
    'detarame',
    'doli\s?doli',
    'don\'t escape',
    'd(r|octor)\.?\s?fou',
    'e333e',
    'eightgames',
    'ena ?games',
    'escapecafe',
    '[a-z]escapegame',
    'the ?escape ?games',
    'escapegames(365|new|today)',
    'escapeisland',
    'esklavos',
    'evillemon',
    '(\'s|my) first',
    'forkids',
    'gamershood',
    'games ?[0-9]',
    'games(bold|novel|perk)',
    'gazzyboy',
    'geniefun',
    'gillygames',
    'girlsgames',
    'girlsonlinegames',
    'girlstand',
    'heartslink',
    'hiddenogames',
    'housecrow',
    'ichimacaf',
    'infoweb',
    'inkagames',
    'itagora',
    'je[wv]el es caper',
    'logicescape',
    'lolescape',
    'lukemaynus',
    'kameotoko',
    'kidsjolly',
    'knf',
    'meltingmindz',
    'mirchi',
    'mixgames1',
    'mougle',
    'mousecity',
    'myhiddengame',
    'nagamochi',
    'ninja(doodle|motion)',
    'nsrgames',
    'olegames',
    'pencilkids',
    'picture completion',
    'pinkygirl',
    'pixelkobo',
    'playitonline',
    'puzzlestudio',
    'primera',
    'seitaiya ?shin',
    'selfdefiant',
    'similar rooms',
    'smileclicker',
    'snapbreak',
    'sniffmouse',
    'sonohigurash?i',
    'tollfreegames',
    'tomolasido',
    'tototoroom',
    'umarooma',
    'umeko',
    'wowescape',
    'xtragamingz',
    'yalgames',
    'yeahgame',
    'yippee',
    'yolk',
    'yonashi',
    'yoopygames',
    'yotreat',
    'youda',
    'youu',
    'zooo',
    'zoozoo',
    'zozel',
    'zxcvbnm'
].join('|')+')','g');

function eg24fix(){
    if(!$.ready){
        setTimeout(eg24fix,10);
        return;
    }
    var html=$('body').html();
    document.getElementsByClassName=false;
    $('.widget-content ul li').eq(11).html('<a href="javascript:feelingLucky();">Random</a>');
    $('ins').remove();
    $('.post').hide();
    $('.post-body').each(
        function(){
            var $this=$(this);
            if($this.text().toLowerCase().match(blorp)){
                $this.closest('.post').remove();
            }
            var t=$this.find('span div');
            t.text(t.text().replace('is another','is a'));
            t=$this.find('span span');
            t.css({float:'left','padding-right':'1em'});
        }
    );
    $('.post-title').each(
        function(){
            var $this=$(this);
            if($this.text().toLowerCase().match(/(shadow kings|ads by google|random game|goodgame|ourworld|escape the museum 2)/g)){
                $this.closest('.post').remove();
            }
        }
    );
    $('.comments-singleblock').each(
        function(){
            var $this=$(this);
            if($this.text().toLowerCase().match('(dazz ley|zazie)')){
                $this.text('[crap comment]');
            }
        }
    );
    $('.post').show();
    var next=$('#blog-pager-older-link');
    next.attr('href',next.attr('href').replace('results=20','results=1000'));
    $('#side-wrapper1,#side-wrapper2').remove();
    $('#main,#main-wrapper').css('width','auto');
    $('#comments').hide().before('<a id="sc">Show/Hide comments</a>');
    $('#sc').on('click',function(){$('#comments').toggle();});
    var pt=$('.post-title');
    if(!pt || pt.length===0){
        feelingLucky();
    }
}

eg24fix();
