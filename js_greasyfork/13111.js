// ==UserScript==
// @name         XamvlMedia
// @version      1.0
// @description  XamVL Image Gallery and Video Player
// @namespace    XamVL Media Player
// @author       Deface
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/fancybox/2.1.5/jquery.fancybox.min.js
// @resource     lazyload-any https://raw.githubusercontent.com/emn178/jquery-lazyload-any/master/src/jquery.lazyload-any.js
// @resource     masonry https://cdnjs.cloudflare.com/ajax/libs/masonry/3.2.3/masonry.pkgd.min.js
// @resource     imagesloaded https://cdnjs.cloudflare.com/ajax/libs/jquery.imagesloaded/3.1.8/imagesloaded.min.js
// @resource     play http://emn178.github.io/jquery-lazyload-any/samples/youtube/play.png
// @resource     play-hover http://emn178.github.io/jquery-lazyload-any/samples/youtube/play-hover.png
// @resource     iconURL https://cdn2.iconfinder.com/data/icons/ballicons-2-vol-2/100/picture-48.png
// @icon         http://i.imgur.com/c6eKIFI.png
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        unsafeWindow
// @include      /^http?://xamvl\.com/.*$/
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/13111/XamvlMedia.user.js
// @updateURL https://update.greasyfork.org/scripts/13111/XamvlMedia.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
// Do not run on frames or iframes
if (window.top !== window.self) {
    return;
}
// MAIN

document.addEventListener('DOMContentLoaded', function() {
    ngamgai();
    render('youtube');
    render('webm');
});
/*
/









/
Scroll down to see the functions.
/









/
*/
// Functions --->
function ngamgai() {
    var withoutLZL = (typeof $('body').attr('data-XamvlMedia') === "undefined");
    
    var findIMG = withoutLZL? $('td[id^="td_post_"] img:not([src^="images/"]):not([src^="/images/"]):not([src^="http://xamvl.com/images/"]):not([src^="http://xamvl.com/images/"])') : $('td[id^="td_post_"] div.XamvlMedia.data-img');
    
    var havePicture = findIMG.length ? 1 : 0;
    var gallery = {
        play: [],
        download: []
    };
    var page = {
        play: [],
        download: []
    };

    if (!withoutLZL) setTimeout(function() {
        nginx_lazyload();
    }, 500);
    
    findIMG.each(function() {
        var img = withoutLZL ? $(this).attr('src') : $(this).attr('data-src');
        var post = $(this).closest('td[id^="td_post_"]').attr('id').replace('td_post_', '');
        
        if (withoutLZL) {
            $(this).attr('title','Click vào để xem size lớn hơn').attr('alt','Loading...').attr('onload','').addClass('XamvlMedia src');
        }
        
        if (img.indexOf('attachment.php?attachmentid=') === 0) {
            img = img.replace('thumb=1', 'thumb=0');
        }
        $(this)[0].outerHTML = '<a class="XamvlMedia onebyone" rel="group" href="' + img + '" post="' + post + '">' + $(this)[0].outerHTML + '</a>';
    });
    
    if (havePicture) {
        var galleryW = 1203;
        $('head').append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/fancybox/2.1.5/jquery.fancybox.css" type="text/css" media="screen" />');
        $('head').append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/fancybox/2.1.5/helpers/jquery.fancybox-thumbs.css" type="text/css" media="screen" />');
        $('head').append('<style>a#XamvlMedia, a.XamvlMedia.single {color: #ffffff; cursor: pointer;} a#XamvlMedia {display:block; bottom:5px; right:5px; position: fixed; opacity:0.5; transition: opacity 0.5s;} a#XamvlMedia:hover {opacity:1;} </style>');
        $('head').append('<script type="text/javascript">' + GM_getResourceText('masonry') + '</script>');
        $('head').append('<script type="text/javascript">' + GM_getResourceText('imagesloaded') + '</script>');
        var script;
        script = '<script type="text/javascript">';
        script += 'function refresh_div_gallery() {';
        script += 'container = document.querySelector("#gallery");';
        script += 'msnry = new Masonry(container, {columnWidth: 300, gutter: 1, itemSelector: ".XamvlMedia.item"});';
        script += 'imagesLoaded(container, function() {window.postMessage("XamvlMedia;loaded","http://xamvl.com"); msnry.layout();});';
        script += '};';
        script += 'function download(from,to) {window.postMessage("XamvlMedia;download;"+from+";"+to+"","http://xamvl.com");};';
        script += '</script>';
        $('head').append(script);
        $('body').append('<a id="XamvlMedia" accesskey="a" title="Phím tắt:\n Chrome: Alt+A \n Firefox: Alt+Shift+A"><img src="' + GM_getResourceURL('iconURL') + '" /></a>');
        // click vào ảnh trên trang --->
        $('a.XamvlMedia.onebyone').fancybox({
            'type': 'image',
            afterLoad: function() {
                this.title = '(Ảnh ' + (this.index + 1) + '/' + this.group.length + ') ';
                this.title += '<a class="XamvlMedia single" href="#" post="' + $(this.element).attr('post') + '"> Đến bài viết.</a> ';
                $('body').on('click', 'a.XamvlMedia.single', function() {
                    var post = $(this).attr('post');
                    $.fancybox.close();
                    $('html,body').animate({
                        scrollTop: $('table#post' + post).offset().top
                    });
                });
            },
            padding: 0,
            helpers: {
                title: {
                    type: 'outside'
                },
                overlay: {
                    css: {
                        'background': 'rgba(0, 0, 0, 0.9)'
                    }
                }
            }
        });
        //  <--- click vào ảnh trên trang
        // Xem ảnh nhanh --->
        $('body').on('click', 'a#XamvlMedia', function() {
            var div_gallery = '<div id="gallery" style="min-width:' + galleryW + 'px; background:#201F25"></div>';
            var loading;
            $.fancybox($(div_gallery), {
                padding: 0,
                ooverlay: {
                    css: {
                        'type': 'html',
                        'background': 'rgba(0, 0, 0, 0.9)'
                    }
                },
                helpers: {
                    title: {
                        type: 'outside'
                    },
                    overlay: {
                        css: {
                            'background': 'rgba(0, 0, 0, 0.9)'
                        }
                    }
                },
                beforeShow: function() {
                    $('.fancybox-inner').css('background', '#201F25');
                },
                afterShow: function() {
                    loading = 0;
                    update_gallery($('body'), 'append');
                    this.title = 'test';
                    // cuộn để lấy thêm ảnh --->
                    page.play = {
                        nav: $('div.pagenav')
                    };
                    if (page.play.nav.length) {
                        page.play.back = page.play.next = Number(page.play.nav.find('strong:not(:contains("«")):not(:contains("»"))').html());
                        page.play.url = page.play.nav.find('a:first').attr('href') + '&page=';
                        $('.fancybox-inner').on('scroll', function() {
                            if (loading === 0) {
                                // scroll up
                                if ($(this).scrollTop() === 0) {
                                    if (1) {
                                        loadMore(page.play.url + (page.play.next + 1), 'prepend');
                                        page.play.next++;
                                    }
                                }
                                // scroll down

                                if ($(this).scrollTop() + $(this).innerHeight() >= this.scrollHeight) {
                                    if (page.play.back > 0) {
                                        loadMore(page.play.url + (page.play.back - 1), 'append');
                                        page.play.back--;
                                    }
                                }
                            }
                        });
                    }
                    // <--- cuộn để lấy thêm ảnh

                },
                afterClose: function() {
                    gallery.play = [];
                    loading = 0;
                    $.fancybox.hideLoading();
                }
            });
            // click vào ảnh trong gallery --->
            $('body').on('click', 'a.XamvlMedia.gallery', function() {
                var post = $(this).attr('post');
                var src = $(this).find('img').attr('src');
                var inCurrentPage = withoutLZL ? $('a.XamvlMedia.onebyone img').filter('[src="' + src + '"]') : $('div.XamvlMedia.data-img').filter('[data-src="' + src + '"]');
                
                if (inCurrentPage.length) {
                    inCurrentPage.parent().click();    
                } else {
                    $.fancybox(src, {
                        'type': 'image',
                        afterLoad: function() {
                            this.title += '<a class="XamvlMedia single" href="http://xamvl.com/showpost.php?p=' + post + '"> Đến bài viết.</a> ';
                        },
                        padding: 0,
                        helpers: {
                            title: {
                                type: 'outside'
                            },
                            overlay: {
                                css: {
                                    'background': 'rgba(0, 0, 0, 0.9)'
                                }
                            }
                        }
                    });
                }
            });
            // <--- click vào ảnh trong gallery
        });
        // <--- xem ảnh nhanh
    }
    window.addEventListener('message', waitLoading, false);

    function update_gallery(html, type) {
        var ignoreList = [
            'http://togif.com/wp-content/uploads/2012/04/doggy.gif'
        ];
        var newContent = '';
        var store = (type === 'download') ? 'download' : 'play';
        html.find(withoutLZL? 'td[id^="td_post_"] img:not([src^="images/"]):not([src^="/images/"]):not([src^="http://xamvl.com/images/"]):not([src^="http://xamvl.com/images/"])' : 'td[id^="td_post_"] div.XamvlMedia.data-img').each(function() {
            var img = withoutLZL ? $(this).attr('src') : $(this).attr('data-src');
            
            var post = $(this).closest('td[id^="td_post_"]').attr('id').replace('td_post_', '');
            if (img.indexOf('attachment.php?attachmentid=') === 0) {
                img = img.replace('thumb=1', '');
            }
            if (gallery[store].indexOf(img) === -1 && ignoreList.indexOf(img) === -1) {
                gallery[store][gallery[store].length] = img;
                newContent = '<div class="XamvlMedia item">' + '<a class="XamvlMedia gallery" href="#" post="' + post + '">' + '<img src="' + img + '" style="width:300px; height:auto; max-width:300px; max-height:1000px;"/></a></div>' + newContent;
            }
        });
        if (type !== 'download') {
            if (type === 'prepend') {
                $('#gallery').prepend(newContent);
            } else {
                $('#gallery').append(newContent);
            }
            $.fancybox.showLoading();
            loading = 1;
            unsafeWindow.refresh_div_gallery();
        }
    }

    function loadMore(url, type) {
        $.fancybox.showLoading();
        $.ajax({
            type: 'GET',
            async: type !== 'download',
            url: url,
            success: function(html) {
                update_gallery($(html), type);
            }
        });
    }

    function waitLoading(event) {
        var data = [];
        data = event.data.split(';');
        if (data[0] === 'XamvlMedia') {
            if (data[1] === 'loaded') {
                loading = 0;
                $.fancybox.hideLoading();
            } else if (data[1] === 'download') {
                download(data[2], data[3]);
            }
        }
    }

    function download(from, to) {
        page.download = {
            nav: $('div.pagenav:first'),
            url: window.location.href
        };
        page.download.url = (page.download.nav.length) ? page.download.nav.find('a:first').attr('href') + '&page=' : page.download.url;
        $('html').html('<div class="XamvlMedia download"><h2>Đang tạo link ảnh...</h2><img src="https://1.bp.blogspot.com/-hdHnzbTmU-4/U7l9JZVybkI/AAAAAAAAAuM/u5c9SgVF730/s1600/4.png"></div>');
        
        for (i = from; i <= to; i++) {
            console.log('Getting page: ' + i + '/' + to);
            loadMore(page.download.url + i, 'download');
        }
        var download_link = '';
        for (i = 0; i < gallery.download.length; i++) {
            download_link += '<li><a target="_blank" href="' + gallery.download[i] + '">' + gallery.download[i] + '</a></li>';
        }
        
        setTimeout(function() {
            $('html').html('<div class="XamvlMedia download"><h2>Xong! Dùng IDM hoặc app tương tự để down.<br>Tổng cộng: ' + gallery.download.length + ' ảnh</h2><ul>' + download_link + '</ul></div>');
        }, 2000);
    }
}

function render(what) {
    var data = {
        'youtube': {
            'selector': 'a[href*="youtube.com"], a[href*="youtu.be"]',
            'tpl': '<div class="XamvlMedia youtube" style="width:560px; height:315px; margin:5px auto; text-align:center; position:relative;">' +
                '<div class="lazyload-thumbnail"><!--<div style="with:100%; height:100%; background-image:url(http://img.youtube.com/vi/{yid}/0.jpg); background-repeat:no-repeat; background-attachment:scroll; background-position:center;"></div><span class="play"></span>--></div>' +
                '<!--<div class="XamvlMedia youtube" style="margin:5px; text-align:center; position:relative;"><iframe width="560" height="315" src="https://www.youtube.com/embed/{yid}?autoplay=1" frameborder="0" allowfullscreen></iframe></div>-->' +
                '</div><center>{yurl}</center>',
            'out': function(str, url) {
                url = url.replace(/&.*$/, '');
                var yid = url.replace(/^.+((watch\?v=)|(youtu.be\/))/i, '');
                var isIgnored = (/(\.com|\.be|\/|testtube|html5)+$/i).test(url);
                var embed = str.replace('{yid}', yid).replace('{yid}', yid);
                url = '<a href="' + url + '" target="blank">' + url + '</a>';
                embed = embed.replace('{yurl}', url);
                return isIgnored ? url : embed;
            },
            'afterOut': function() {
                function load(img) {
                    img.fadeOut(0, function() {
                        img.fadeIn(1000);
                    });
                }
                eval(GM_getResourceText('lazyload-any'));
                $('.lazyload-thumbnail').lazyload({
                    load: load
                });
                $('.XamvlMedia.youtube').lazyload({
                    trigger: 'click'
                });
                $('head').append('<style>.XamvlMedia .play {position: absolute; width: 64px; height: 64px; top: 50%; left: 50%; margin: -32px 0 0 -32px; ' +
                    'background-image: url(' + GM_getResourceURL('play') + '); -moz-opacity: 0.70; opacity: 0.70; -ms-filter:"progid:DXImageTransform.Microsoft.Alpha"(Opacity=70);}' +
                    '.XamvlMedia.youtube:hover .play {background-image: url(' + GM_getResourceURL('play-hover') + '); -moz-opacity: 1; opacity: 1; -ms-filter:"progid:DXImageTransform.Microsoft.Alpha"(Opacity=100);}' +
                    '</style>');
            }
        },
        'webm': {
            'selector': 'a[href*=".webm"]',
            'tpl': '<div class="XamvlMedia html5"><div style="cursor:default; font-weight:bold; font-size:25px; color:#2c3e50; margin:5px;">web<div style="display:inline; color:#2980b9;">▶</div>m<div style="display:inline-block; color:#7f8c8d; font-size:10px; margin-left:5px;">hover <br>to play</div></div><!--<video style="display:block; max-width:900px; max-height:600px; margin:5px auto;" src="{url}" controls></video><center><a href="{url}" target="blank">{url}</a></center>--></div>',
            'out': function(str, url) {
                return str.replace(/{url}/g, url);
            },
            'afterOut': function() {
                
                eval(GM_getResourceText('lazyload-any'));
                $('.XamvlMedia.html5').lazyload({
                    trigger: 'mouseenter'
                });
               
            }              
        }
    };

    function rr(url) {
        url = unescape(url);
        var redirect = /[?=]http/i;
        if (redirect.test(url)) {
            url = url.replace(/^.+[?=]http/i, 'http');
        }
        return url;
    }
    $(data[what].selector).each(function(i) {
        var url = rr($(this).attr('href'));
        $(this)[0].outerHTML = data[what].out(data[what].tpl, url);
    });
    if (Object.keys(data[what]).indexOf('afterOut') !== -1) data[what].afterOut();
}

function nginx_lazyload() {
    eval(GM_getResourceText('lazyload-any'));
    $('.XamvlMedia.lzWrapper').lazyload({
        threshold: 0,
        load: function(img) {
            img.css("opacity",0).animate({opacity:1},500);
        }
    });
}
// END MAIN