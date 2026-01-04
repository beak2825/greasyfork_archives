// ==UserScript==
// @name         XBOOKS BETTER
// @namespace    https://greasyfork.org/ja/scripts/376240-xbooks-better
// @version      1.1
// @description  make it easier to read books!
// @author       badfalcon
// @match        http://xbooks.to/*
// @grant GM_setValue
// @grant GM_getValue
/* load jQuery */
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @require https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js
// @downloadURL https://update.greasyfork.org/scripts/376240/XBOOKS%20BETTER.user.js
// @updateURL https://update.greasyfork.org/scripts/376240/XBOOKS%20BETTER.meta.js
// ==/UserScript==

(function () {
    'use strict';


    //remove ads
    $('#main2col center,#ad_tsuibi, #ad_tsuibi2,#wrap > div[style = "margin: -15px auto 15px; width: 920px;"],#wrap > div[style = "width:900px; height:250px; margin: -15px auto 15px auto;"] ,#sidebar .box:nth-child(n+4) , #one_col > center > div > iframe,#wrap > iframe,#wrap > h2,#wrap > div.content_line.markerbox,#bookpreview > center > div > iframe,div.movie-in-ad, .adbox.left, .adbox.right,#wrap > div > h2,#wrap > div > div.content_line.markerbox,#one_col > center > div,#bookpreview > center').hide();

    //add cookie
    Cookies.set("pop", "open", {expires: 7, path: "/"});

    var loc = $(location).attr('pathname').match(/(?:\/)([^\/]+)(?:\/)/);

    //todo インチキ修正
    if (loc == null) {
        loc = ['tops', 'tops'];
    }

    var listPages = ['tops', 'Tops', 'search', 'Search', 'mybook'];
    if ($.inArray(loc[1], listPages) != -1) {
        //------------------------------top page------------------------------

        // Your code here...
        var modal = false;
        var scrollPos;

        var bookLink = $('#main2col > div.content_list > .list > a');
        bookLink.attr('target', 'bookFrame');
        bookLink.on('click', function (event) {
            //        event.preventDefault();
            openModal();
        });

        $('body').css({});
        var modalContent = $('<div>').attr('id', 'modalWindow')
            .css({
                'position': 'fixed',
                'z-index': '110',
                'background-color': 'rgba(0,0,0,0.8)',
                'width': '100%',
                'height': '100%',
                'display': 'flex',
                'justify-content': 'center',
                'align-items': 'center',
            });

        var frame = $('<iframe>')
            .attr({
                'id': 'modalFrame',
                'name': 'bookFrame',
                'scrolling': 'no',
                'frameborder': 'no',
            })
            .css({
                'width': '90%',
                'height': '100%',
                'border': 'outset 3px #fff',
            });
        modalContent.append(frame);
        $('body').prepend(modalContent);
        modalContent.hide();

        function openModal() {
            modalContent.show();
            scrollPos = $(window).scrollTop();
            $('#container').css({
                'position': 'fixed',
                'top': -scrollPos + 'px',
            });
            modal = true;
        }

        function closeModal() {
            modalContent.hide();
            $('#container').css({
                'position': '',
                'top': '',
            });
            $(window).scrollTop(scrollPos);
            modal = false;
        }

        $('#modalWindow').on('click', function (e) {
            if (!$(e.target).closest('#modalFrame').length) {
                // フェードやスライドなどの処理方法を記述;
                closeModal();
            }
        });
        var keywordLink = $('.keyword_list > li > a');
        keywordLink.attr('target', '_blank');

        $(window).on('keydown', function (e) {
            var keycode = e.keyCode;
            switch (keycode) {
                case 27:
                    // esc
                    if (modal) {
                        closeModal();
                    }
                    break;
                default:
                    break;
            }
        });

        var start_pos = 0;

        $(window).on('scroll', function (e) {
            var current_pos = $(this).scrollTop();
            if (current_pos > start_pos) {
                //                console.log('down');
            } else {
                //                console.log('up');
            }
            start_pos = current_pos;
            var bottom = $(document).innerHeight() - $(window).innerHeight(); //ページ全体の高さ - ウィンドウの高さ = ページの最下部トップ位置
            if (current_pos <= 0) {
            } else if (bottom <= current_pos) {
                //一番下までスクロールした時に実行
                $('#nextPage')[0].click();
            } else {

            }
        });

    } else if (loc[1] == 'detail') {
        //------------------------------detail page------------------------------

        var fullscreen = true;
        var slideshow = false;
        var expandSidemenu = GM_getValue('expandSidemenu', false);
        console.log(expandSidemenu);

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
        var calledPages = 0;
        var finishedPages = 0;
        var preloadNum = 100;
        var intervalTime = 100; // millisec
        var slideshowInterval = GM_getValue('slideshowInterval', 1.5); // sec
        var interval = false;
        var resizeTimer;
        var imageWidth = 0;
        var imageHeight = 0;
        var imageRatio = 0;
        var windowWidth = 0;
        var windowHeight = 0;
        var windowRatio = 0;
        var showTags = GM_getValue('showTags', true);
        resizeTimer = false;

        var debug = false;


        $('#wrap > div:nth-child(1)').remove();
        $('.movie-in-ad').remove();
        $('#main2col > iframe').remove();


        var modalWindow = $('<div>').attr('id', 'modalWindow')
            .css({
                'position': 'fixed',
                'z-index': '100',
                'background-color': 'rgba(0,0,0,0.8)',
                'width': '100%',
                'height': '100%',
            });

        var mainBlock = $('<div>').attr('id', 'mainBlock')
            .css({
                'display': 'flex',
                'justify-content': 'center',
                'width': '100%',
                'height': '100%',
            });

        var statusBlock = $('<div>').attr('id', 'statusBlock')
            .css({
                'color': 'white',
                'width': '100%',
                'background-color': 'rgba(0,0,0,0.6)',
                'display': 'flex',
                'flex-direction': 'column',
                'justify-content': 'center',
            });

        function getSerfaceText(selector) {
            var elem = $(selector[0].outerHTML);
            elem.children().empty();
            return elem.text();
        }

        var rawTitle = getSerfaceText($('#one_col > h2')).trim();
        var titleReg = rawTitle.match(/([^\[\]【】]*)?([\[【]([^\[\]【】]+)[\]】])?(.+)$/);

        var titleBlock = $('<div>').attr('id', 'titleBlock');

        var circleLink = $('<a>').attr({
            'target': '_blank',
            'id': 'circleSearchLink',
            'href': 'http://xbooks.to/search/index/word:' + titleReg[3]
        }).text(titleReg[2]);
        var bookTitle = $('<span>').text(titleReg[4]);

        titleBlock.append($('<span>').text(titleReg[1])).append(circleLink).append($('<span>').text(titleReg[4]));

        var popupBlock = $('<div>').attr('id', 'popupBlock')
            .css({
                'color': 'white',
                'position': 'fixed',
                'background-color': 'rgba(0,0,0,0.6)',
                'display': 'flex',
                'justify-content': 'center',
                'border-radius': '0px 0px 5px 5px',
            });
        var statusPopup = $('<div>').attr('id', 'statusPopup')
            .css({
                'color': 'white',
                'padding': '5px',
            });
        var statusTimeoutID = null;

        function showStatus(str, timer) {
            statusPopup.text(str);
            popupBlock.css('left', (windowWidth - statusPopup.width()) / 2);
            popupBlock.slideDown("fast", function () {
                if (statusTimeoutID !== null) {
                    clearTimeout(statusTimeoutID);
                }
                if (timer) {
                    statusTimeoutID = setTimeout(function () {
                        popupBlock.slideUp('normal', function () {
                        });
                    }, 2000);
                } else {

                }
            });
        }

        function hideOverlay() {
            fullscreen = false;
            if (slideshow) {
                slideshowButton.click();
            }
            modalWindow.hide();
        }

        function showOverlay() {
            fullscreen = true;
            modalWindow.show();
        }

        var openButton = $('<button>').text('fullscreen');
        openButton.on('click', function () {
            showOverlay();
        });
        $('#one_col > h2:nth-child(1) > span').after(openButton);

        var sideMenu = $('<div>').attr('id', 'sideMenu').css({
            "display": "flex",
            "flex-direction": "row",
            "position": "fixed",
        });

        var sideList = $('<div>').attr('id', 'sideList').css({
            "display": "flex",
            "flex-direction": "column",
            "width": "80px",
            "height": "100%",
            "background-color": "rgba(0,0,0,0.5)",
        });

        var toggleButton = $('<button>').attr('id', 'toggleButton').text('<');
        toggleButton.on('click', function () {
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
            GM_setValue('expandSidemenu', expandSidemenu);
        });

        var status = $('<div>').attr('id', 'statusText').html('C(' + currentPage + '/' + calledPages + ':' + totalPages + ')').css('color', 'white');

        function updateStatus() {
            var slideshowStatus = slideshow ? 'playing ' : '';
            status.html(slideshowStatus + 'C(' + currentPage + '/' + calledPages + ':' + totalPages + ')');
        }

        var reloadButton = $('<button>').attr('id', 'reloadButton').text('reload');
        reloadButton.on('click', function () {
            reloadImages();
        });

        var oldTimeValue = null;
        var slideshowTime = $('<input>', {
            id: 'slideshowTime',
            type: "text",
            pattern: "^[0-9]+\.[0-9]+$",
            value: slideshowInterval
        }).css('text-align', 'center');
        slideshowTime.on('focus', function () {
            console.log("focus");
            oldTimeValue = $(this).val();
            console.log("recorded : " + oldTimeValue);
        });
        slideshowTime.on("change paste", function () {
            console.log("paste");
            var timeVal = $(this).val();
            if (timeVal.match(/^[0-9]+.[0-9]+$/)) {
                console.log("matched");
                slideshowInterval = timeVal;
                GM_setValue('slideshowInterval', timeVal);
            } else {
                console.log("unmatched");
                console.log($(this).eq(0));
                $(this).eq(0).val(oldTimeValue);
            }
        });

        var slideshowTimeoutID = null;
        var slideshowButton = $('<button>').attr('id', 'slideshowButton').text('play');
        slideshowButton.on('click', function () {
            slideshow = !slideshow;
            updateStatus();
            if (slideshow) {
                slideshowTime.prop('disabled', true);
                slideshowButton.text('stop');
                slideshowTimeoutID = setInterval(function () {
                    thumbNext(totalPages);
                    //                showStatus("play (" + currentPage + "/" + totalPages + ")",true);
                }, slideshowInterval * 1000);
            } else {
                slideshowTime.prop('disabled', false);
                slideshowButton.text('play');
                clearInterval(slideshowTimeoutID);
            }
        });


        var closeButton = $('<button>').attr('id', 'closeButton').text('×');
        closeButton.on('click', function () {
            hideOverlay();
        });

        var downloadButton = $('<button>').attr('id', 'downloadButton').text('dlZip');
        downloadButton.on('click', function () {
            $('#download > li:nth-child(2) > a')[0].click();
        });

        var favoriteButton;
        var t = $('#download > li.bookshelf > a > img').attr('src');
        if (t != null) {
            var favorited = $('#download > li.bookshelf > a > img').attr('src').includes('set');

            favoriteButton = $('<button>').attr('id', 'favoriteButton').text('fav');

            function updateFavButton() {
                if (favorited) {
                    favoriteButton.text('unfav');
                } else {
                    favoriteButton.text('fav');
                }
            }

            favoriteButton.on('click', function () {
                $('#download > li.bookshelf > a')[0].click();
                favorited = !favorited;
                updateFavButton();
            });
            updateFavButton();
        }

        var loadAllButton = $('<button>').attr('id', 'loadAllButton').text('loadAll');
        loadAllButton.on('click', function () {
            loadImages(calledPages, totalPages);
        });

        var tags = $('<div>').attr('id', 'tags').text('△tags').css({'color': 'white', 'cursor': 'pointer'});
        var tagList = $('#detail > ul.tag_list').clone(true).css({
            'color': 'white',
            'display': 'flex',
            'flex-direction': 'column'
        });
        tags.on('click', function () {
            showTags = !showTags;
            GM_setValue('showTags', showTags);
            updateTags();
        });

        function updateTags() {
            if (showTags) {
                tags.text('△tags');
                tagList.show();
            } else {
                tags.text('▽tags');
                tagList.hide();
            }
        }

        updateTags();

        statusBlock.append(titleBlock);
        statusBlock.append(status);
        modalWindow.append(statusBlock);
        popupBlock.append(statusPopup);
        modalWindow.append(popupBlock);
        popupBlock.hide();

        //    sideList.append(status);
        sideList.append(closeButton);
        sideList.append(loadAllButton);
        sideList.append(slideshowTime);
        sideList.append(slideshowButton);
        sideList.append(downloadButton);
        if (t != null) {
            sideList.append(favoriteButton);
        }
        sideList.append(tags);
        sideList.append(tagList);

        sideMenu.append(sideList).append(toggleButton);

        if (!expandSidemenu) {
            sideList.hide();
            toggleButton.text('>');
        }

        var mainImage = $('<div>')
        //    .attr({'':'',
        //          })
            .css({
                'display': 'flex',
                'justify-content': 'center',
                //          'align-items':'center',
                '': '',
            });
        mainImage.append($('#thumbnail1').clone(true));
        mainBlock.append(mainImage);

        modalWindow.append(sideMenu).append(mainBlock);

        $('#container').before(modalWindow);
        //    $('#container').before($('#thumbnail1').clone(true));

        //    toggleButton.click();

        if (!debug) {

            //            preload();
            loadImages(0, preloadNum);
        }

        function loadImages(start, num) {
            if (!loading) {
                loadAllButton.prop('disabled', true);
                if (finishedPages == totalPages) {
                    reloadImages();
                } else {
                    console.log("load start:" + (finishedPages + 1) + "～" + (finishedPages + num));
                    loading = true;
                    var url = $('#thumbnail1').attr('src');
                    var match = url.match(/(http.+\/)(\d{5})\.(jpg|jpeg|gif|png)/i);
                    var index = parseInt(match[2]);
                    var finished = 0;
                    if (interval) {
                        var i = 1;
                        var id = setInterval(function () {
                            if (calledPages + 1 > totalPages) {
                                clearInterval(id);　//idをclearIntervalで指定している
                                console.log("preload finished to " + calledPages + " pages");
                            } else {
                                calledPages++;
                            }
                            $('<img>').attr('src', match[1] + ("0000" + calledPages).slice(-5) + "." + match[3]).on('load', function () {
                                finished++;
                                finishedPages++;
                                if (finished == num || finishedPages == totalPages) {
                                    loading = false;
                                    loadAllButton.prop('disabled', false);
                                    showStatus("load finished", true);
                                } else {
                                    showStatus('Loading (' + finishedPages + '/' + totalPages + ')', true);
                                }
                                updateStatus();
                            });
                            if (i < num) {
                                i++;
                            } else {
                                clearInterval(id);　//idをclearIntervalで指定している
                                console.log("preload finished to " + calledPages + " pages");
                            }
                        }, intervalTime);
                    } else {
                        for (var i = start + 1; i <= num; i++) {
                            if (calledPages + 1 > totalPages) {
                                break;
                            } else {
                                calledPages++;
                            }
                            $('<img>').attr('src', match[1] + ("0000" + calledPages).slice(-5) + "." + match[3]).on('load', function () {
                                finished++;
                                finishedPages++;
                                if (finished == num || finishedPages == totalPages) {
                                    loading = false;
                                    loadAllButton.prop('disabled', false);
                                    if (finishedPages == totalPages) {
                                        showStatus("all loaded", true);
                                        loadAllButton.text("reload");
                                    } else {
                                        showStatus("load finished", true);
                                    }
                                } else {
                                    showStatus('Loading (' + finishedPages + '/' + totalPages + ')', true);
                                }
                                updateStatus();
                            });
                        }
                    }
                }
            }
        }

        function reloadImages() {
            if (!loading) {
                loadAllButton.prop('disabled', true);
                loading = true;
                var currentTotal = calledPages;
                calledPages = 0;
                var finished = 0;
                finishedPages = 0;
                var url = $('#thumbnail1').attr('src');
                var match = url.match(/(http.+\/)(\d{5})\.(jpg|jpeg|gif|png)/i);
                var index = parseInt(match[2]);
                if (interval) {
                    var i = 1;
                    var id = setInterval(function () {
                        if (calledPages + 1 > totalPages) {
                            clearInterval(id);　//idをclearIntervalで指定している
                        } else {
                            calledPages++;
                        }
                        $('<img>').attr('src', match[1] + ("0000" + calledPages).slice(-5) + "." + match[3]).on('load', function () {
                            finished++;
                            finishedPages++;
                            if (finishedPages == currentTotal) {
                                loading = false;
                                loadAllButton.prop('disabled', false);
                                console.log("reload finished:" + "～" + currentTotal);
                                showStatus("reload finished", true);
                            } else {
                                showStatus('Reloading (' + finishedPages + '/' + currentTotal + ')', true);
                            }
                            updateStatus();
                        });
                        if (i < currentTotal) {
                            i++;
                        } else {
                            clearInterval(id);　//idをclearIntervalで指定している
                        }
                    }, intervalTime);
                } else {
                    for (var i = 1; i <= currentTotal; i++) {
                        if (calledPages + 1 > totalPages) {
                            break;
                        } else {
                            calledPages++;
                        }
                        $('<img>').attr('src', match[1] + ("0000" + calledPages).slice(-5) + "." + match[3]).on('load', function () {
                            finished++;
                            finishedPages++;
                            if (finishedPages == currentTotal) {
                                loading = false;
                                loadAllButton.prop('disabled', false);
                                console.log("reload finished:" + "～" + currentTotal);
                                showStatus("reload finished", true);
                            } else {
                                showStatus('Reloading (' + finishedPages + '/' + currentTotal + ')', true);
                            }
                            updateStatus();
                        });
                    }
                }
            }

        }


        // Your code here...
        $(window).on('scroll', function (e) {
            e.stopPropagation();
            e.preventDefault();
            if ($(window).scrollLeft() > 0) {
                $(window).scrollLeft(0);
            }

        });

        function initSize() {
            imageWidth = $('#thumbnail1').width();
            imageHeight = $('#thumbnail1').height();
            imageRatio = imageWidth / imageHeight;
            onResize();
        }


        function onResize() {
            if (resizeTimer !== false) {
                clearTimeout(resizeTimer);
            }
            resizeTimer = setTimeout(function () {
                // 何らかの処理
                windowWidth = $(window).outerWidth(true);
                windowHeight = $(window).outerHeight(true) - $('#statusBlock').height();
                modalWindow.css('width', '100%').css('height', '100%');
                popupBlock.css('left', (windowWidth - statusPopup.width()) / 2);
                windowRatio = windowWidth / windowHeight;
                if (windowRatio >= imageRatio) {
                    $('#thumbnail1').css('width', windowHeight * imageRatio);
                    $('#thumbnail1').css('height', windowHeight);
                } else {
                    $('#thumbnail1').css('width', windowWidth);
                    $('#thumbnail1').css('height', windowWidth / imageRatio);
                }
                //            statusBar.css('left',(windowWidth-statusBar.width())/2);
            }, 200);
        }

        initSize();

        window.addEventListener('resize', onResize);

        $(window).on('keydown', function (e) {
            var keycode = e.keyCode;
            switch (keycode) {
                case 27:
                    // esc
                    if (fullscreen) {
                        hideOverlay();
                    } else {
                        showOverlay();
                    }
                    break;
                default:
                    break;
            }
            if (fullscreen) {
                switch (keycode) {
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
                        loadAllButton.click();
                        return false;
                    default:
                        break;
                }
            }
        });

        function thumbPre(pages) {
            var url = $('#thumbnail1').attr('src');
            var match = url.match(/(http.+\/)(\d{5})\.(jpg|jpeg|gif|png)/i);
            var num = parseInt(match[2]) - 1;
            if (num == 0 && totalPages == finishedPages) {
                num = totalPages;
            }
            if (num > 0) {
                num = ('0000' + num).slice(-5);
                $('#thumbnail1').attr('src', match[1] + num + '.' + match[3]);

            }
            page_nation(pages);
        }

        var mousewheelevent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
        $(document).on(mousewheelevent, function (e) {
            var num = parseInt($('.wheel').text());
            if (fullscreen) {
                e.preventDefault();
                var delta = e.originalEvent.deltaY ? -(e.originalEvent.deltaY) : e.originalEvent.wheelDelta ? e.originalEvent.wheelDelta : -(e.originalEvent.detail);
                if (delta < 0) {
                    thumbNext(totalPages);
                    return false;
                } else {
                    thumbPre(totalPages);
                    return false;
                }
            }
        });

        $('#page_num').on('DOMSubtreeModified propertychange', kd);

        function kd() {
            var pageMatch = $('#page_num').text().match(/\((.+)\/(.+)\)/i);
            if (pageMatch != null) {
                if (currentPage != pageMatch[1]) {
                    currentPage = pageMatch[1];
                    updateStatus();
                    if (currentPage >= calledPages - (preloadNum / 2) && calledPages !== totalPages) {
                        loadImages(0, preloadNum);
                    }
                }
            }
        }


    } else {
        console.log('unknown page :' + loc[1]);
    }

})();