// ==UserScript==
// @name         DLBOOKS BETTER
// @namespace    https://greasyfork.org/ja/scripts/40309-dlbooks-better
// @version      1.05
// @description  make it easier to read books!
// @author       badfalcon
// @match        http://dlbooks.to/detail/*
// @grant GM_setValue
// @grant GM_getValue
/* load jQuery */
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/40309/DLBOOKS%20BETTER.user.js
// @updateURL https://update.greasyfork.org/scripts/40309/DLBOOKS%20BETTER.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var fullscreen = true;
    var slideshow = false;
    var expandSidemenu = false;

    /*
    function getSettings(){
        fullscreen = GM_getValue('fullscreen',true);
        GM_setValue('fullscreen',false);
        console.log(fullscreen);
    }
    getSettings();
    */

    var loading = false;

    var totalPages = parseInt($('#page_num').text().match(/\((.+)\/(.+)\)/i)[2]);

    var currentPage = 1;
    var loadedPages = 0;
    var finishedPages = 0;
    var preloadNum = 100;
    var intervalTime = 100; // millisec
    var slideshowInterval = 3000; // millisec
    var interval = false;
    var timer;
    var imageWidth = 0;
    var imageHeight = 0;
    var imageRatio = 0;
    var windowWidth = 0;
    var windowHeight = 0;
    var windowRatio = 0;

    timer = false;

    var debug = false;

    if(!debug){
        preload();
    }

    $('.movie-in-ad').remove();

    var modalWindow = $('<div>').attr('id','modalWindow')
    .css({'position':'fixed',
          'z-index':'100',
          'background-color':'rgba(0,0,0,0.8)',
          'width':'100%',
          'height':'100%',
         });

    var mainBlock = $('<div>').attr('id','mainBlock')
    .css({'display':'flex',
          'justify-content': 'center',
          'width':'100%',
          'height':'100%',
         });

    var statusBar = $('<div>').attr('id','statusBar')
    .css({'color':'white',
          'position':'fixed',
          'z-index':'100',
          'background-color':'rgba(0,0,0,0.6)',
          //          'top':'0',
          //        'left':windowWidth/2,
          'padding':'5px',
          'border-radius':'0px 0px 5px 5px',
          '-webkit-border-radius':'0px 0px 5px 5px',
          '-moz-border-radius':'0px 0px 5px 5px',
          'display':'flex',
          'flex-direction':'column',
         });

    var statusPopup = $('<div>').attr('id','statusPopup')
    .css({'color':'white',
         });

    var statusTimeoutID = null;
    function showStatus(str,timer){
        //        statusBar.css('left',(windowWidth-statusPopup.width())/2);
        statusPopup.text(str).slideDown("fast",function(){
            //     statusBar.css('left',(windowWidth-statusBar.width())/2);
            if(statusTimeoutID !== null){
                clearTimeout(statusTimeoutID);
            }
            if(timer){
                statusTimeoutID = setTimeout(function(){
                    statusPopup.slideUp('normal',function(){
                        //              statusBar.css('left',(windowWidth-statusBar.width())/2);
                    });
                },2000);
            }else{

            }
        });
    }

    function hideOverlay(){
        fullscreen = false;
        if(slideshow){slideshowButton.click();}
        modalWindow.hide();
    }

    function showOverlay(){
        fullscreen = true;
        modalWindow.show();
    }

    var openButton = $('<button>').text('fullscreen');
    openButton.on('click',function(){
        showOverlay();
    });
    $('#one_col > h2:nth-child(1) > span').after(openButton);

    var sideMenu = $('<div>').css({
        "display":"flex",
        "flex-direction":"row",
        "position":"fixed",
    });

    var sideList = $('<div>').css({
        "display":"flex",
        "flex-direction":"column",
        "width":"80px",
        "height":"100%",
        "background-color":"rgba(0,0,0,0.5)",
    });

    var toggleButton = $('<button>').text('>');
    toggleButton.on('click',function(){
        if (sideList.is(':visible')) {
            // 表示されている場合の処理
            sideList.hide();
            $(this).text('>');
            expandSidemenu = false;
        } else {
            // 非表示の場合の処理
            sideList.show();
            $(this).text('<');
            expandSidemenu = true;
        }
    });

    var status = $('<div>').attr('class','statusText').html('C('+currentPage+'/'+totalPages+')<br>L('+loadedPages+ '/' + totalPages + ')').css('color','white');
    function updateStatus(){
        var slideshowStatus = slideshow ? 'playing ' : '';
        status.html(slideshowStatus + 'C('+currentPage+'/'+loadedPages+':'+totalPages+')');
    }

    var reloadButton = $('<button>').text('reload');
    reloadButton.on('click',function(){
        reloadImages();
    });

    var slideshowTimeoutID = null;
    var slideshowButton = $('<button>').text('play');
    slideshowButton.on('click',function(){
        slideshow = !slideshow;
        if(slideshow){
            slideshowButton.text('stop');
            slideshowTimeoutID = setInterval(function(){
                thumbNext(totalPages);
//                showStatus("play (" + currentPage + "/" + totalPages + ")",true);
            },slideshowInterval);
        }else{
            slideshowButton.text('play');
            clearInterval(slideshowTimeoutID);
        }
    });


    var closeButton = $('<button>').text('×');
    closeButton.on('click',function(){
        hideOverlay();
    });

    var downloadButton = $('<button>').text('dlZip');
    downloadButton.on('click',function(){
        $('#download > li:nth-child(2) > a')[0].click();
    });

    var favoriteButton;
    var t = $('#download > li.bookshelf > a > img').attr('src');
    if(t != null){
        var favorited = $('#download > li.bookshelf > a > img').attr('src').includes('set');

        favoriteButton = $('<button>').text('fav');
        function updateFavButton(){
            if(favorited){
                favoriteButton.text('unfav');
            }else{
                favoriteButton.text('fav');
            }
        }
        favoriteButton.on('click',function(){
            $('#download > li.bookshelf > a')[0].click();
            favorited = !favorited;
            updateFavButton();
        });
        updateFavButton();
    }

    var tags = $('<div>').text('△tags').css('color','white');
    var showTags = true;
    var tagList = $('#detail > ul.tag_list').clone(true).css({
        'color':'white',
        'display':'flex',
        'flex-direction':'column'
    });
    tags.on('click',function(){
        showTags = !showTags;
        if(showTags){
            tags.text('△tags');
            tagList.show();
        }else{
            tags.text('▽tags');
            tagList.hide();
        }
    });
    statusBar.append(status);
    statusBar.append(statusPopup);
    mainBlock.append(statusBar);
    statusPopup.hide();

    //    sideList.append(status);
    sideList.append(closeButton);
    sideList.append(reloadButton);
    sideList.append(slideshowButton);
    sideList.append(downloadButton);
    if(t != null){
        sideList.append(favoriteButton);
    }
    sideList.append(tags);
    sideList.append(tagList);

    sideMenu.append(sideList).append(toggleButton);

    sideList.hide();

    var mainImage = $('<div>')
    //    .attr({'':'',
    //          })
    .css({'display':'flex',
          'justify-content':'center',
          'align-items':'center',
          '':'',
         });
    mainImage.append($('#thumbnail1').clone(true));
    mainBlock.append(mainImage);

    modalWindow.append(sideMenu).append(mainBlock);

    $('#container').before(modalWindow);
    //    $('#container').before($('#thumbnail1').clone(true));

    //    toggleButton.click();

    function preload(){
        if(!loading){
            console.log("load start:"+(finishedPages+1) + "～" + (finishedPages + preloadNum));
            loading = true;
            var url = $('#thumbnail1').attr('src');
            var match = url.match(/(http.+\/)(\d{5})\.(jpg|jpeg|gif|png)/i);
            var index = parseInt(match[2]);
            var finished = 0;
            if(interval){
                var i = 1;
                var id = setInterval(function(){
                    if(loadedPages+1 > totalPages){
                        clearInterval(id);　//idをclearIntervalで指定している
                        console.log("preload finished to " + loadedPages + " pages");
                    }else{
                        loadedPages++;
                    }
                    $('<img>').attr('src',match[1]+("0000"+loadedPages).slice(-5) + "." + match[3]).on('load',function(){
                        finished++;
                        finishedPages++;
                        if(finished == preloadNum || finishedPages == totalPages){
                            loading = false;
                            showStatus("load finished",true);
                        }else{
                            showStatus('Loading ('+finishedPages+ '/' + totalPages + ')',true);
                        }
                        updateStatus();
                    });
                    if(i < preloadNum){
                        i++;
                    }else{
                        clearInterval(id);　//idをclearIntervalで指定している
                        console.log("preload finished to " + loadedPages + " pages");
                    }
                }, intervalTime);
            }else{
                for(var i = 1;i <= preloadNum;i++){
                    if(loadedPages+1 > totalPages){
                        break;
                    }else{
                        loadedPages++;
                    }
                    $('<img>').attr('src',match[1]+("0000"+loadedPages).slice(-5) + "." + match[3]).on('load',function(){
                        finished++;
                        finishedPages++;
                        if(finished == preloadNum|| finishedPages == totalPages){
                            loading = false;
                            showStatus("load finished",true);                        }else{
                                showStatus('Loading ('+finishedPages+ '/' + totalPages + ')',true);
                            }
                        updateStatus();
                    });
                }
            }
        }

    }

    function reloadImages(){
        if(!loading){
            loading = true;
            var currentTotal = loadedPages;
            loadedPages = 0;
            var finished = 0;
            finishedPages = 0;
            var url = $('#thumbnail1').attr('src');
            var match = url.match(/(http.+\/)(\d{5})\.(jpg|jpeg|gif|png)/i);
            var index = parseInt(match[2]);
            if(interval){
                var i = 1;
                var id = setInterval(function(){
                    if(loadedPages+1 > totalPages){
                        clearInterval(id);　//idをclearIntervalで指定している
                    }else{
                        loadedPages++;
                    }
                    $('<img>').attr('src',match[1]+("0000"+loadedPages).slice(-5) + "." + match[3]).on('load',function(){
                        finished++;                        finishedPages++;
                        if(finishedPages == currentTotal){
                            loading = false;
                            console.log("reload finished:" + "～" + currentTotal);
                            showStatus("reload finished",true);
                        }else{
                            showStatus('Reloading ('+finishedPages+ '/' + currentTotal + ')',true);
                        }
                        updateStatus();
                    });
                    if(i < currentTotal){
                        i++;
                    }else{
                        clearInterval(id);　//idをclearIntervalで指定している
                    }
                }, intervalTime);
            }else{
                for(var i = 1;i <= currentTotal;i++){
                    if(loadedPages+1 > totalPages){
                        break;
                    }else{
                        loadedPages++;
                    }
                    $('<img>').attr('src',match[1]+("0000"+loadedPages).slice(-5) + "." + match[3]).on('load',function(){
                        finished++;                        finishedPages++;
                        if(finishedPages == currentTotal){
                            loading = false;
                            console.log("reload finished:" + "～" + currentTotal);
                            showStatus("reload finished",true);
                        }else{
                            showStatus('Reloading ('+finishedPages+ '/' + currentTotal + ')',true);
                        }
                        updateStatus();
                    });
                }
            }
        }

    }


    // Your code here...
    $(window).on('scroll',function(e) {
        e.stopPropagation();
        e.preventDefault();
        if($(window).scrollLeft() > 0){
            $(window).scrollLeft(0);
        }

    });

    function initSize(){
        imageWidth = $('#thumbnail1').width();
        imageHeight = $('#thumbnail1').height();
        imageRatio = imageWidth/imageHeight;
        onResize();
    }



    function onResize() {
        if (timer !== false) {
            clearTimeout(timer);
        }
        timer = setTimeout(function () {
            // 何らかの処理
            windowWidth = $(window).outerWidth(true);
            windowHeight = $(window).outerHeight(true);
            modalWindow.css('width','100%').css('height','100%');
            windowRatio = windowWidth/windowHeight;
            if(windowRatio >= imageRatio){
                $('#thumbnail1').css('width',windowHeight*imageRatio);
                $('#thumbnail1').css('height',windowHeight);
            }else{
                $('#thumbnail1').css('width',windowWidth);
                $('#thumbnail1').css('height',windowWidth/imageRatio);
            }
            //            statusBar.css('left',(windowWidth-statusBar.width())/2);
        }, 200);
    }

    initSize();

    window.addEventListener('resize',onResize);

    $(window).on('keydown',function(e){
        var keycode = e.keyCode;
        switch(keycode){
            case 27:
                // esc
                if(fullscreen){
                    hideOverlay();
                }else{
                    showOverlay();
                }
                break;
            default:
                break;
        }
        if(fullscreen){
            switch(keycode){
                case 38:
                    // ↑
                    thumbPre(totalPages);
                    return false;
                case 40:
                    // ↓
                    thumbNext(totalPages);
                    return false;
                case 116:
                    // F5
                    reloadImages();
                    return false;
                default:
                    break;
            }
        }
    });

    var mousewheelevent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
    $(document).on(mousewheelevent,function(e){
        var num = parseInt($('.wheel').text());
        if(fullscreen){
            e.preventDefault();
            var delta = e.originalEvent.deltaY ? -(e.originalEvent.deltaY) : e.originalEvent.wheelDelta ? e.originalEvent.wheelDelta : -(e.originalEvent.detail);
            if (delta < 0){
                thumbNext(totalPages);
                return false;
            } else {
                thumbPre(totalPages);
                return false;
            }
        }
    });

    $('#page_num').on('DOMSubtreeModified propertychange',kd);

    function kd(){
        var pageMatch = $('#page_num').text().match(/\((.+)\/(.+)\)/i);
        if(pageMatch != null){
            if(currentPage != pageMatch[1]){
                currentPage = pageMatch[1];
                updateStatus();
                if(currentPage >= loadedPages-(preloadNum/2) && loadedPages !== totalPages){
                    preload();
                }
            }
        }
    }

})();