// ==UserScript==
// @name         muahahaha animeflv / jkanime / monoschinos / animebum
// @namespace    muahahaha
// @version      1.8.5
// @description  links de descarga sin intermediarios y campo de texto con auto-selección para las direcciones de descarga y titulo
// @match        https://animeflv.net/ver/*
// @match        https://*.animeflv.net/ver/*
// @match        https://jkanime.net/*/*/
// @match        https://jkanime.net/*/
// @match        https://monoschinos.com/ver/*
// @match        https://animebum.net/v/*
// @downloadURL https://update.greasyfork.org/scripts/370838/muahahaha%20animeflv%20%20jkanime%20%20monoschinos%20%20animebum.user.js
// @updateURL https://update.greasyfork.org/scripts/370838/muahahaha%20animeflv%20%20jkanime%20%20monoschinos%20%20animebum.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var icons={
        'mediafire' :'https://www.mediafire.com/favicon.ico',
        'zippyshare':'https://www.zippyshare.com/images/favicon.ico',
        'openload'  :'https://openload.co/favicon.ico',
        'streamango':'https://streamango.com/favicon.ico',
        'mega'      :'https://mega.nz/favicon.ico',
        'uptobox'   :'https://uptobox.com/assets/images/utb.png',
        'anonfile'  :'https://anonfile.com/favicon.ico',
        'bayfiles'  :'https://bayfiles.com/favicon.ico',
        '1fichier'  :'https://1fichier.com/favicon.ico',
        'solidfiles':'https://solidfilescdn.com/static/icons/favicon.7bce66cc0baa.ico',
    };
    var ficon=function($url){
        let o=' src="" alt="?⃝"'
        for(let i in icons){
            if($url.indexOf(i)!=-1){
                o=' src="'+icons[i]+'" alt="'+i+'"';
                break;
            }
        }
        return o;
    };
    var chtit=function($tit){
        $tit = $tit.replace(/^Ver\s+/,'');
        $tit = $tit.replace(/\s+Sub\s+Español$/,'');
        $tit = $tit.replace(/\s+Episodio\s+/,' ');
        $tit = $tit.replace(/\s+Capítulo\s+/,' ');
        $tit = $tit.replace(/\s+-\s+([0-9]+)$/,' $1');
        $tit = $tit.replace(/\s+([0-9]+)$/,' (ep$1)');
        $tit = $tit.replace(/(\s*)[\\/|:*?_%"'`^<>+~!¡¿](\s*)/g,'$1-$2');
        $tit = $tit.replace(/\s+/g,' ');
        return $tit;
    };

    var $,t,v,d=location.host.split('.').slice(-2).join('.');

    switch(d){
        case 'animeflv.net':
            if(typeof(unsafeWindow.$)==='function'){

                $=unsafeWindow.$;

                t=$('h1.Title');
                v=chtit(t.html());
                t.parent().css({'padding-right':0})
                t.html('<input type="text" value="'+v+'" title="'+v+'" onclick="this.select();"/>');

                $('span.fa-download').click();

                $('#DwsldCn a.fa-download').each(function($i,$e){
                    var a=$($e).closest('a');
                    var d=a
                        .attr('href')
                        .replace(/^[^?]+\?/,'')
                        .split('&')
                        .map(function($v){return decodeURIComponent($v.replace(/^[^=]+=/,''));})
                        .filter(function($v){return /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/.test($v);})
                    ;
                    if(d.length){
                        d=d.shift();
                        a.attr('href',d).attr('target','');
                        a.closest('td').after('<td><img style="width:2em;vertical-align:0em;"'+ficon(d)+'/><input style="width:calc(100% - 2em);display:inline-block;height:2em;" type="text" value="'+d+'" onclick="this.select();"/></td>');
                    }
                });

            }
        break;
        case 'jkanime.net':
            if(typeof(unsafeWindow.$)==='function'){

                $=unsafeWindow.$;

                var isEpisode=location.pathname.slice(1,-1).indexOf('/')>-1;

                if(isEpisode){
                    t=$('.video-header>h1');
                    v=chtit(t.html());
                    t.css({width:'100%'})
                    t.html('<input type="text" value="'+v+'" title="'+v+'" style="width:100%;margin:0.25em auto;" onclick="this.select();"/>');

                    $('#dwld')
                        .off('click')
                        .on('click',function($ev){$ev.preventDefault();$ev.stopPropagation();})
                        .after($('#basic-modal-content').detach().css('display','block'))
                    ;

                    $('#basic-modal-content a').each(function($i,$e){
                        var a=$($e).closest('a');
                        var d=a
                        .attr('href')
                        .replace(/^[^?]+\?/,'')
                        .split('&')
                        .map(function($v){return decodeURIComponent($v.replace(/^[^=]+=/,''));})
                        .filter(function($v){return /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/.test($v);})
                        ;
                        if(d.length){
                            d=d.shift();
                            a.attr('href',d).attr('target','');
                            a.closest('td').after('<td><img style="width:1em;"'+ficon(d)+'/><input style="width:calc(100% - 1em);" type="text" value="'+d+'" onclick="this.select();"/></td>');
                        }
                    });
                }
                else{
                    setTimeout(function(){
                        if($('a.numbers').length>1){
                            $('a.numbers').last().trigger('click');
                            setTimeout(function(){
                                $('#inverso').trigger('click');
                            },1000);
                        }
                        else{
                            $('#inverso').trigger('click');
                        }
                    },500);
                }

            }
        break;
        case 'monoschinos.com':
            if(typeof(unsafeWindow.$)==='function'){

                $=unsafeWindow.$;

                t=$('h1.Title-epi');
                v=chtit(t.html());
                t.html('<input type="text" value="'+v+'" style="width:100%;" title="'+v+'" onclick="this.select();"/>');

                $('#downloads a.btnWeb').each(function($i,$e){
                    var a=$($e).closest('a');
                    var d=a.attr('href');
                    a.attr('target','');
                    a.closest('td').next().after('<td><img style="width:1.5em;"'+ficon(d)+'/><input type="text" value="'+d+'" onclick="this.select();"/></td>');
                });

            }
        break;
        case 'animebum.net':
            if(typeof(unsafeWindow.$)==='function'){

                $=unsafeWindow.$;

                t=$('h1.title-h1-serie');
                v=chtit(t.html());
                t.html('<input type="text" value="'+v+'" style="width:100%;" title="'+v+'" onclick="this.select();"/>');

                $('div.enlaces .table-head th:nth-child(5)').css({width:'25%'})

                $('div.enlaces a.btn-secondary.btn-s').each(function($i,$e){
                    var a=$($e).closest('a');
                    var c=a.closest('td');
                    var d=a.attr('href');
                    var i=c.prev().find('img').attr('src');
                    c.prev().html('<a href="'+d+'"><img src="'+i+'"></a>')
                    c.html('<input type="text" value="'+d+'" onclick="this.select();"/>');
                });

            }
        break;
    }

})();
