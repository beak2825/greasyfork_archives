// ==UserScript==
// @name         yande & konachan direct copy large image url
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       mousoug
// @license      MIT
// @match        https://konachan.com/post*
// @match        https://yande.re/post*
// @grant        GM_setClipboard
// @grant        GM_download
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/39313/yande%20%20konachan%20direct%20copy%20large%20image%20url.user.js
// @updateURL https://update.greasyfork.org/scripts/39313/yande%20%20konachan%20direct%20copy%20large%20image%20url.meta.js
// ==/UserScript==
(function() {
    'use strict';
    try{
        //    $(function(){
        var urls = [];
        $('iframe').css({
            position: 'fixed',
            'z-index': '-9999',
            'opacity': 0
        });
        $('body').css({
            'padding': '1em'
        });
        $('ul#post-list-posts li').css({
            width: '300px'
        });
        $('ul#post-list-posts li .inner').css({
            overflow: 'visible',
        });
        $('ul#post-list-posts li .inner').css({
            width: '290px',
            height: '300px'
        });
        $('.preview').attr('width','').attr('height','');
        $('#image')[0] && $('#image').replaceWith(document.getElementById('image').outerHTML);
        $('head').append('<style type="text/css">.direct-download{outline:2px solid #03a9f4!important;outline-offset: -3px;}.thumb:hover{transform:scale(1.1); outline: 10px solid #ffeb3b;outline-offset:-5px;}img.preview{max-width: 100%;max-height: 100%;box-sizing: border-box}a.thumb{background: #232322}a:visited{background-color: #00ff00;}#image{max-width: 100%;max-height: 100%;margin-left: 50%;transform: translateX(-50%);height: auto;}a.directlink{font-size: 20px!important;line-height: 30px;height: auto !important;}</style>');
        //$('body').append('<button id="download-button" style="position: fixed;font-size: 20px;background-color: #0277BD;bottom: 60px;right: 30%;color: #222222;font-weight: bolder;border-radius: 2.5px;border: none;box-shadow: 1px 1px 3px 1px black;">复制 <span id="download-size">0</span></button>');
        $('<button style="position: fixed;font-size: 20px;background-color: #0277BD;bottom: 60px;right: calc(30% - 70px);color: #222222;font-weight: bolder;border-radius: 2.5px;border: none;box-shadow: 1px 1px 3px 1px black;">←→</button>').appendTo('body')
            .on('click', function(){
            $('div.sidebar').toggle();
            if($('div.content')[0].style.cssText){
                $('div.content')[0].style.cssText="";
            }
            else {
                $('div.content').css({
                    width: "100%"
                });
            }
        }).click();
        $('<button style="position: fixed;font-size: 20px;background-color: #0277BD;bottom: 100px;right: calc(30%);color: #222222;font-weight: bolder;border-radius: 2.5px;border: none;box-shadow: 1px 1px 3px 1px black;">open</button>').appendTo('body')
            .on('click', function(){
            $('.direct-download').prev().children().each(function(){
               window.open(this.href);
            });
            $('.direct-download').removeClass('direct-download');
        });
        var $download = $('<button style="position: fixed;font-size: 20px;background-color: #0277BD;bottom: 100px;right: calc(30% - 50px);color: #222222;font-weight: bolder;border-radius: 2.5px;border: none;box-shadow: 1px 1px 3px 1px black;">↓↓<span id="downloadNum"><span></button>').appendTo('body')
        .on('click', function(){
            var target = $('#png');
            if(target.length === 0){target = $('#highres');}
            if(target.length ==1){
                var href = target[0].href,
                    name = decodeURI(href.split('/').pop());
                // GM_download({
                //     url:href,
                //     name: name,
                //     saveAs:true,
                //     onprogress: function(){console.log(arguments);}
                // });
                $('#add-to-favs>a')[0].click();
                setTimeout(function(){
                    GM_download(href,name);
                    window.close();
                }, 100);
            }
        });
    }catch(e){};
    $('<button style="position: fixed;font-size: 20px;background-color: #0277BD;bottom: 100px;right: calc(30% - 100px);color: #222222;font-weight: bolder;border-radius: 2.5px;border: none;box-shadow: 1px 1px 3px 1px black;">XX</button>').appendTo('body')
        .on('click', function(){
        window.close();
    });
    //$('#download-button').click(function(){
    // GM_setClipboard(urls.join('\n'), 'text');
    //$('#download-size').text('0');
    //$('.direct-download').removeClass('direct-download');
    //});
    $('.directlink').each(function(){
        var url = this.href,
            url1 = url.replace('/jpeg/', '/image/').replace(/\.jpg$/g, '.png'),
            url2 = url.replace('/jpeg/', '/image/');
        $(this).attr({
            'onclick': 'return false;',
            'download-url': url1+'\n'+url2
        }).click(function(e){
            var $this = $(this),
                url = $this.attr('download-url');
            //$btn = $('#download-button');
            $this.toggleClass('direct-download');
            var $selected = $('.direct-download');
            urls=[];
            //$('#download-size').text($selected.length);
            $selected.each(function(){
                urls.push($(this).attr('download-url'));
            });
        });
    });
    document.addEventListener('keydown', function(evt){
        var code = evt.keyCode;
        var temp=/(?<=page\=)\d*(?=\s*)/.exec(location.href);
        var c=/\?/.test(location.href)?'&':'?';
        if(code==37){
            if(temp && (temp[0]/1-1)){
                location.href = location.href.split('page='+temp[0]).join('page='+(temp[0]/1-1))
            }
        }
        else if(code==39){
            if(temp){
                location.href = location.href.split('page='+temp[0]).join('page='+(temp[0]/1+1))
            }
            else{
                this.location.href=location.href+c+'page=2&';

            }
        }
        else if(code == 38){
            window.close();
        }
        else if(code == 40){
            $download.triggerHandler('click');
        }
    })

 /*   function copyLargeImg(e) {
        if(document.visibilityState=='visible') {
            var target = $('#highres');
            if(target[0]){
                console.log(target[0].href) ;
                GM_setClipboard(target[0].href);
            };
        }
    }
    window.addEventListener('focus',copyLargeImg);
    document.addEventListener('visibilitychange', copyLargeImg);
*/
    //});
})();
