// ==UserScript==
// @name  Manga OnlineViewer Fluid Mode + Lewd Extender
// @description  Extension for Manga OnlineViewer Fluid Mode + for 18+ sites, allowing double-page spread viewing for halved images. Sites: Fakku, HBrowse, doujin-moe, hentai2read, luscious, wondersluts,hentaimangaonline, exhentai/g.e-hentai, pururin, hentai4manga, doujinshihentai, hitomi, nhentai, hentaihere, 8muses, Tsumino etc.
// @version 11.17b6
// @date 2015-11-15
// @author  Tago & sneezemonkey
// @namespace https://greasyfork.org/users/1849-tago
// @require http://code.jquery.com/jquery-2.1.1.min.js
// @require https://greasyfork.org/scripts/10000-manga-onlineviewer-fluid-mode/code/Manga%20OnlineViewer%20Fluid%20Mode%20+.user.js
// @grant  GM_getValue
// @grant  GM_setValue
// @include /https?://www.fakku.net/.+/.+/
// @include /http://www.hbrowse.com/.+/
// @include /http://www.doujin-moe.us/.+/
// @include /http://hentai2read.com/.+/.+//
// @include /http://luscious.net/c/.+/
// @include /http://www.wondersluts.com/.+/
// @include /http://hentaimangaonline.com/image/.+//
// @include /http://exhentai.org/s/.+/.+/
// @include /http://g.e-hentai.org/s/.+/.+/
// @include /http://pururin.com/view/.+/.+/.+/
// @include /http://hentai4manga.com/hentai_manga/.+/.+/
// @include /http://doujinshihentai.com/manga/index.php/.+/
// @include /http://hitomi.la/reader/.+/
// @include /http://nhentai.net/g/.+/.+/
// @include /http://www.8muses.com/picture/.+/.+/.+/.+/
// @include /http://hentaihere.com/m/.+/.+/.+/
// @include /http://tsumino.com/Home/Read/.+/
// @history 11.17 Initial Split with 11.17
// @downloadURL https://update.greasyfork.org/scripts/11953/Manga%20OnlineViewer%20Fluid%20Mode%20%2B%20Lewd%20Extender.user.js
// @updateURL https://update.greasyfork.org/scripts/11953/Manga%20OnlineViewer%20Fluid%20Mode%20%2B%20Lewd%20Extender.meta.js
// ==/UserScript==

//OnlineViewer
(function ($) {
    var m = [
// == Fakku =======================================================================================================================================
        {
            name: "Fakku",
            url: /fakku.net/,
            run: function () {
                return {
                    title: $(".chapter a:eq(1)").text().trim(),
                    series: $("a.a-series-title:first").attr("href"),
                    quant: $(".drop option:last").val(),
                    prev: "#",
                    next: "#",
                    data: $("#thumbs img, .current-page").attr("src").replace("thumbs", "images").replace(/[0-9]+(\.thumb)?\.jpg$/, ""),
                    page: function (i, addImg, addAltImg) {
						var str = '' + i;
						while (str.length < 3) str = '0' + str;
						addImg(i, this.data + str + ".jpg");
                    }
                };
            }
        },
        // == HBrowser ====================================================================================================================================
        {
            name: "HBrowser",
            url: /hbrowse/,
            run: function () {
                return {
                    title: $('.listTable td.listLong:first').text().trim(),
                    series: window.location.href.match(/.+\/[0-9]+\//),
                    quant: $('td.pageList a, td.pageList strong').length - 1,
                    prev: $("#chapters + table a.listLink").eq($("#chapters + table a.listLink").index($("#chapters + table a.listLink[href='" + window.location.href + "']")) - 1).attr("href"),
                    next: $("#chapters + table a.listLink").eq($("#chapters + table a.listLink").index($("#chapters + table a.listLink[href='" + window.location.href + "']")) + 1).attr("href"),
                    url: function (i) {
                        var str = '' + i;
                        while (str.length < 4) str = '0' + str;
                        return window.location.href + (window.location.href.slice(-1) == "/" ? "": "/") + str;
                    },
                    img: 'td.pageImage a img',
                    before: function () {
                        $('html > head').append($('<style>#main a:visited, #pageMain a:visited { color: darkred !important; }</style>'));
                    }
                };
            }
        },
        // == Doujin-Moe Non-members ========================================================================================================================
        {
            name: "DoujinMoeNM",
            url: /doujin-moe.us/,
            run: function () {
                return {
                    title: $(".title").text(),
                    series: $(".title a").eq(-2).attr("href"),
                    quant: $("#gallery > :not(.thumbs)").length,
                    prev: "#",
                    next: "#",
                    data: $("#gallery > djm:not(.thumbs)"),
                    page: function (i, addImg, addAltImg) {
                        addImg(i, this.data.eq(i - 1).attr("file"));
                    }
                };
            }
        },
        // == Luscious ========================================================================================================================
        {
            name: "Luscious",
            url: /(luscious|wondersluts)/,
            run: function () {
                return {
                    title: $("#main .center h1:first").text().split("|")[0].trim(),
                    series: "#",
                    quant: $(".image > a > img").length,
                    prev: "#",
                    next: $(".next").attr("href"),
                    data: $(".image > a > img"),
                    page: function (i, addImg, addAltImg) {
						addImg(i, this.data.eq(i - 1).attr('src').replace(".640x0", ""));
                    },
                    before: function () {
                        var url = window.location.href;
                        if (url.match("style=blog") && !url.match("position")) {
                            window.location = url.replace(/page\/[0-9]+.+/, "sorted/position/page/1/?style=blog");
                        } else if (url.match("/(pictures/album/.*)/id")) {
                            window.location = url.replace(/(id.*)/, "sorted/position/page/1/?style=blog");
                        } else {
                            $('a.cover').each(function () {
                                var href = $(this).attr('href');
                                if (href.match("/(pictures/album/.*)/id")) {
                                    $(this).attr('href', href.replace(/(id.*)/, "sorted/position/page/1/?style=blog"));
                                }
                            });
                        }
                    }
                };
            }
        },
        // == HentaiMangaOnline ========================================================================================================================
        {
            name: "HentaiMangaOnline",
            url: /hentaimangaonline/,
            run: function () {
                return {
                    title: $(".breadcrumb li:eq(2)").text().trim(),
                    series: $("ul.breadcrumb li a:eq(2)").attr("href"),
                    quant: $("select option").length,
                    prev: "#",
                    next: "#",
                    data: $("select").html(),
                    img: 'a img'
                };
            }
        },
        // == ExHentai ========================================================================================================================
        {
            name: "ExHentai",
            url: /(exhentai|e-hentai)/,
            run: function () {
                return {
                    title: $("#il h1").text().trim(),
                    series: $("div#i5 div.sb a").attr("href"),
                    quant: $(".sn div span:last").text(),
                    prev: "#",
                    next: "#",
                    url: window.location.href,
                    timer: 3000,
                    page: function (i, addImg, addAltImg) {
                        var self = this;
                        $.ajax({
                            type: "GET",
                            url: self.url,
                            dataType: "html",
                            async: false,
                            success: function (html) {				
                                var ref = $(html).find("div#i7 a, #img");
								var src = ref.attr(ref.is("img")?"src":"href");
                                addImg(i,src);
                                addAltImg(i, src+" ?nl=1");
                                self.url = $(html).find("#img").parent().attr("href");
                            }
                        });
                    }
                };
            }
        },
        // == Pururin ========================================================================================================================
        {
            name: "Pururin",
            url: /pururin/,
            run: function () {
                return {
                    title: $(".header-breadcrumbs a:eq(3)").text().trim(),
                    series: $(".header-breadcrumbs a:eq(3)").attr("href"),
                    quant: $(".image-pageSelect option").length,
                    prev: "#",
                    next: "#",
                    data: $(".image-pageSelect").html(),
                    img: "img.b"
                };
            }
        },
        // == hentai4manga ========================================================================================================================
        {
            name: "hentai4manga",
            url: /hentai4manga/,
            run: function () {
                return {
                    title: $(".category-label").text().trim(),
                    series: location.href.replace(/\/\d+\//, '/'),
                    quant: $('select#sl option').size(),
                    prev: "#",
                    next: "#",
                    url: function (i) {
                        return "../" + i + "/";
                    },
                    img: '#textboxContent img'
                };
            }
        },
        // == DoujinshiHentai ========================================================================================================================
        {
            name: "DoujinshiHentai",
            url: /doujinshihentai/,
            run: function () {
                return {
                    title: $(".category-label").text().trim(),
                    series: "http://doujinshihentai.com/series.html",
                    quant: $('#page_last').attr("href").match(/[0-9]+\./),
                    prev: "#",
                    next: "#",
                    data: location.href,
                    url: function (i) {
                        var str = '' + i;
                        while (str.length < 3) str = '0' + str;
                        return this.data.replace("001.",str+".");
                    },
                    img: '.weatimages_bigimage'
                };
            }
        },
		// == hitomi ========================================================================================================================
        {
            name: "hitomi",
            url: /hitomi.la/,
            run: function () {
                return {
                    title: $("title").text().replace("| Hitomi.la","").trim(),
                    series: $(".brand").attr("href"),
                    quant: $("#single-page-select option").length,
                    prev: "#",
                    next: "#",
					data:$(".img-url"),
					page: function (i,addImg, addAltImg) {
                            console.log("Page " + i);
                            addImg(i, this.data.eq(i - 1).text());

                    },
                };
            }
        },
        // == nHentai ========================================================================================================================
        {
            name: "nHentai",
            url: /nhentai/,
            run: function () {
                return {
                    title: $('title').text().split('- Page')[0].trim(),
                    series: $("div#page-container div a").attr("href"),
                    quant: $(".num-pages:first").html(),
                    prev: "#",
                    next: "#",
                    url: function (i) {
                        return "../" + i + "/";
                    },
                    img: '#page-container img'
                };
            }
        },
        // == 8muses ========================================================================================================================
        {
            name: "8muses",
            url: /8muses/,
            run: function () {
                return {
                    title: $('.breadcrumbs li:eq(2) span a').text().trim(),
                    series: $('.breadcrumbs li:eq(2) span a').attr("href"),
                    quant: $(".sel:first option").length,
                    prev: "#",
                    next: "#",
                    data: $(".sel:first option"),
                    img: '#image'
                };
            }
        },
        // == Tsumino ========================================================================================================================
        {
            name: "Tsumino",
            url: /tsumino/,
            run: function () {
                return {
                    title: $('title').text().split('/')[0].trim(),
                    series: $("a:contains('RETURN')").attr("href"),
                    quant: (parseInt($("h1").text().split("of")[1].trim())),
                    prev: "#",
                    next: "#",
                    url: function (i) {
                        var url = window.location.pathname.split('/');
                        return "/Image/Page/"+ url[3] + "/" + i;
                    },
                    page: function(i,addImg,addAltImg) {
                        var self = this;
                        addImg(i, self.url(i))
                    }
                };
            }
        },
        // == hentaihere ========================================================================================================================
        {
            name: "hentaihere",
            url: /hentaihere/,
            run: function () {
                return {
                    title: $('title').text().split('|')[1].trim(),
                    series: $('ul.nav-pills:first li:first a').attr("href"),
                    quant: $("#pageDropdown:first ul li").length,
                    prev: "#",
                    next: "#",
                    url: function(i) {
                        var pathname = window.location.pathname.split('/');
                        return "/" + pathname[1] + "/" + pathname[2] + "/" + pathname[3] + "/" + i + "/";
                    },
                    img: 'img#arf-reader-img'
                };
            }
        }
    ];

    
    if ($(".startbutton").length > 0) {
    $(".startbutton").on("click", function(){
                $.MangaOnlineViewer.start(m);
        $(".startbutton").remove();})
                         } else { 
                $.MangaOnlineViewer.start(m);}

})(jQuery);