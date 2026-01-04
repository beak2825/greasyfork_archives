// ==UserScript==
// @name         使用済み下着販売
// @namespace    https://greasyfork.org/morca
// @version      0.5
// @description  Price and seller filter
// @author       morca
// @match        https://langel.jp/*
// @match        https://www.w-moon.net/*
// @exclude      https://www.w-moon.net/iframe.html*
// @match        http://crotches.jp/*
// @match        https://crotches2.jp/*
// @match        http://43pan.jp/*
// @match        https://www.galsmarket.com/*
// @match        https://pure-jewel.com/*
// @match        https://www.galscollection.net/*
// @match        https://pantiescollection.net/*
// @match        http://ange-lique.net/*
// @match        https://www.luscio.jp/*
// @no-frames
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391729/%E4%BD%BF%E7%94%A8%E6%B8%88%E3%81%BF%E4%B8%8B%E7%9D%80%E8%B2%A9%E5%A3%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/391729/%E4%BD%BF%E7%94%A8%E6%B8%88%E3%81%BF%E4%B8%8B%E7%9D%80%E8%B2%A9%E5%A3%B2.meta.js
// ==/UserScript==

if (typeof jQuery == "undefined" || $().jquery < "1.8.0") {
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js";
    script.onload = code;
    document.getElementsByTagName("head")[0].appendChild(script);
} else {
    code();
}
function code() {
    'use strict';
    const sites = {
        "langel": {
            priceClass: ".item-list-box__price",
            priceText: n => n,
            priceShow: (n, hit) => n.parentNode.parentNode.parentNode.style.display = hit ? "" : "none",
            priceInputOuter: () => $(".hd-search")[0],
            priceInputStyle: n => n.setAttribute("style", "width:90px"),
            userClass: ".item-list-box__name",
            userText: n => {
                let user = $(n).parent().parent().parent().find("a[value]").attr("value");
                return user;
            },
            userShow: (n, show) => {
                n.parentNode.parentNode.parentNode.children[0].children[1].children[0].children[0].style.display = show ? "" : "none";//category
                n.parentNode.parentNode.parentNode.children[0].children[1].children[0].children[1].style.display = show ? "none" : "";//user-text
                n.parentNode.parentNode.style.display = show ? "" : "none";//content
            },
            userSwitchAppend: (n, c, user, a) => {
                n.parentNode.parentNode.parentNode.children[0].children[1].appendChild(c);
                n.parentNode.parentNode.parentNode.children[0].children[1].style.textAlign = "right";
                let alt = $(n).parent().parent().find("div.item-list-box__img > img").attr("alt");
                if (alt) $(n).prev().find("a").text(alt);
                let item = $(n).parent().find("a").attr("href");
                a.setAttribute("value", ":" + n.innerHTML.trim());
                getHtml(item, html => {
                    let href = findSrcs(html, ".item-seller__name > a", "href");
                    a.setAttribute("value", href.replace(site.reUser, "$1") + ":" + n.innerHTML.trim());
                    let src = site.getItemDesc(html);
                    $(n).parent().parent().find("div.item-list-box__img > img").parent().addClass("preview").attr("src", src).each((i, e) => { imagePreviewSetEvents(e); });
                    n.style.display = "none";//下の名前1
                    $(n).parent().append(`<a style='font-size: 15px; font-weight: bold; color: #ff0086;'>${n.innerHTML.trim()}</a>`);//下の名前2
                    $(n).parent().find("a").last().addClass("preview").attr("href", href).each((i, e) => { imagePreviewSetEvents(e); });
                    $(n).parent().parent().parent().find("a").first().addClass("preview").attr("href", href).each((i, e) => { imagePreviewSetEvents(e); });
                    filterUsers();
                });
            },
            reUser: /^(?:^\/seller\/)?detail\.html\?ac=([0-9]+)$/,
            reItem: /^\/goods\/detail\.html\?id=([0-9]+)$/,
            setup: () => {
                $("nav.breadcrumbs > ul > li > a[href^='/seller/detail.html?ac=']").each((i, e) => {
                    dic[e.children[0].innerHTML.replace(/さんのショップ$/, "")] = e.getAttribute("href");
                });
                $(".item-seller__name > a[href^='/seller/detail.html?ac=']").each((i, e) => {
                    dic[e.innerHTML.trim()] = e.getAttribute("href");
                });
                setPreview("a.js-popup-link", "href", null, "src");
                setPreview("a[href*='detail.html?ac=']", "href", site.reUser);
                setPreview("li.pickup-thumb-list__item > a[href^='/images/sys/db/']", "href", null, "src");
            },
            getUserDesc: html => {
                let age = $(html).find(".girl-profile-list__body").first().html();
                let prof = $(html).find(".girl-profile-list__body:eq(1)").html();//TODO in case of ""
                let text = $(html).find(".girl-profile-body").text();
                let src = $(html).find(".girl-profile-img img").attr("src");
                return { title: `自称${age} 自称${prof} ${judgeBmi(text) || ""}`, src: src };
            },
            getItemDesc: html => findSrcs(html, ".item-box__img .js-popup-link", "href")
        },
        "wmoon": {
            priceClass: ".itemBoxHeader",
            priceText: n => $(n).find(".price")[0],
            priceShow: (n, hit) => n.parentNode.style.display = hit ? "" : "none",
            priceInputOuter: () => $("#main div:eq(1) div form").parent()[0],
            priceInputStyle: n => n.setAttribute("style", "width:45px"),
            userClass: ".itemBoxHeader",
            userText: n => $(n).find("a").first().attr("href").replace(site.reUser, "$1"),
            userShow: (n, show) => n.parentNode.children[1].style.display = show ? "" : "none",
            userSwitchAppend: (n, c) => n.children[2].appendChild(c),
            reUser: /^shop_([a-z0-9]+)\.html$/,
            reItem: /^item_([a-z0-9]+)-[a-z]+([0-9]+)\.html$/,
            setup: () => {
                setPreview("a[href^='shop_']", "href", site.reUser, (n, attr, re) => {
                    let src = attr.replace(re, "/img/photo/$1.jpg");
                    $(n).attr("src", src);
                });
                setPreview("a[href^='item_']", "href", site.reItem, (n, attr, re) => {
                    let src = attr.replace(re, "img/item/$1-$2-1.jpg");
                    src = src.replace(/-.\.jpg/, "-1.jpg") + ";" + src.replace(/-.\.jpg/, "-2.jpg") + ";" + src.replace(/-.\.jpg/, "-3.jpg");
                    $(n).attr("src", src);
                });
                setPreview("a > img[src^='img/thumb/item/']", "src", /^img\/thumb\/item\/(.+)_(......)_(.)_..._..._..........\.jpg$/, (n, attr, re) => {
                    let src = attr.replace(re, "img/item/$1-$2-$3.jpg");
                    if ($(n).parent()[0].nodeName != "DIV") {
                        src = src.replace(/-(.)\./, "-1.") + ";" + src.replace(/-(.)\./, "-2.") + ";" + src.replace(/-(.)\./, "-3.");
                    }
                    $(n).attr("src", src);
                }, true);
                setPreview("a > img[src^='img/thumb/daily/'], a > img[src^='img/thumb/album/']", "src", /^img\/thumb\/(daily|album)\/.+_(.+)_..._..._..........\.jpg$/, (n, attr, re) => {
                    let src = attr.replace(re, "img/$1/$2.jpg");
                    $(n).attr("src", src);
                }, true);
            },
            getUserDesc: html => {
                let name = $(html).find("div.shopPhoto > a > img").attr("alt");
                let age = $(html).find("img[alt='年齢']").parent().next().html();
                let prof = $(html).find("img[alt='職業']").parent().next().html();
                let text = $(html).find("div.shopApeal > p").text();
                return { title: `${name} 自称${age} 自称${prof} ${judgeBmi(text) || ""}` };
            }
        },
        "crotches": {
            priceClass: ".price",
            priceText: n => n,
            priceShow: (n, hit) => n.parentNode.parentNode.style.display = hit ? "" : "none",
            priceInputOuter: () => $("#main table:eq(2) td form").parent()[0],//TODO
            priceInputStyle: n => n.setAttribute("style", "width:45px"),//TODO
            userClass: "div.each_all > ul > li.user > a[href], div.eachtop > ul > li.user > a[href]",
            userText: n => $(n).attr("href").replace(site.reUser, "$1"),
            userShow: (n, show) => {
                $(n).parent().parent().find("li.pics")[0].style.display = show ? "" : "none";
                $(n).parent().parent().find("li.ttl")[0].style.display = show ? "" : "none";
                $(n).parent().parent().find("li.haita")[0].style.display = show ? "" : "none";
                $(n).parent().parent().find("li.price")[0].style.display = show ? "" : "none";
                $(n).parent().parent().find("li.cate")[0].style.display = show ? "" : "none";
            },
            userSwitchAppend: (n, c) => n.parentNode.appendChild(c),
            reUser: /^profile\.php\?user_id=([0-9]+)$/,
            reItem: /^goods2\.php\?post_id=[0-9]+$/,
            setup: () => {
                $('.pics img').css("object-fit", "cover");
                setPreview("a[href^='profile.php?user_id=']", "href", site.reUser);
                setPreview("a[href^='goods2.php?post_id=']", "href", site.reItem);
                setPreview("div.photo > img.inner_pic, div.thumbnail > ul > li > a > img", "src", /^http:\/\/crotches\.jp\/up_file\//);
            },
            getUserDesc: html => {
                let age = $(html).find("div.prof_top_box > h2.name > span.age").html().slice(1, -1);
                let prof = $(html).find("div.prof_top_box > h2.name > span.work").html();
                let src = findSrcs(html, "div.thumbnail > ul > li > a > img", "src");
                return { title: `自称${age} 自称${prof}`, src: src };
            },
            getItemDesc: html => findSrcs(html, "div.thumbnail > ul > li > a > img", "src")
        },
        "crotches2": {
            priceClass: ".price",
            priceText: n => n,
            priceShow: (n, hit) => n.parentNode.parentNode.style.display = hit ? "" : "none",
            priceInputOuter: () => $("#main table:eq(2) td form").parent()[0],//TODO
            priceInputStyle: n => n.setAttribute("style", "width:45px"),//TODO
            userClass: "div.each_all > ul > li.user > a[href], div.eachtop > ul > li.user > a[href]",
            userText: n => $(n).attr("href").replace(site.reUser, "$1"),
            userShow: (n, show) => {
                $(n).parent().parent().find("li.pics")[0].style.display = show ? "" : "none";
                $(n).parent().parent().find("li.ttl")[0].style.display = show ? "" : "none";
                $(n).parent().parent().find("li.haita")[0].style.display = show ? "" : "none";
                $(n).parent().parent().find("li.price")[0].style.display = show ? "" : "none";
                $(n).parent().parent().find("li.cate")[0].style.display = show ? "" : "none";
            },
            userSwitchAppend: (n, c) => n.parentNode.appendChild(c),
            reUser: /^https:\/\/crotches2\.jp\/user\/([0-9]+)$/,
            reItem: /^https:\/\/crotches2\.jp\/item\/([0-9]+)$/,
            setup: () => {
                $('.pics img').css("object-fit", "cover");
                setPreview("a[href^='https://crotches2.jp/user/']", "href", site.reUser);
                setPreview("a[href^='https://crotches2.jp/item/']", "href", site.reItem);
                setPreview("div.photo > img.inner_pic, div.thumbnail > ul > li > a > img", "src", /^https:\/\/crotches2\.jp\/uploads\//);
            },
            getUserDesc: html => {
                let age = $(html).find("div.prof_top_box > h2.name > span.age").html().slice(1, -1);
                let prof = $(html).find("div.prof_top_box > h2.name > span.work").html();
                let src = findSrcs(html, "div.thumbnail > ul > li > a > img", "src");
                return { title: `自称${age} 自称${prof}`, src: src };
            },
            getItemDesc: html => findSrcs(html, "div.thumbnail > ul > li > a > img", "src")
        },
        "shunka": {
            priceClass: ".price",
            priceText: n => n,
            priceShow: (n, hit) => n.parentNode.parentNode.style.display = hit ? "" : "none",
            priceInputOuter: () => $("#main table:eq(2) td form").parent()[0],//TODO
            priceInputStyle: n => n.setAttribute("style", "width:45px"),//TODO
            userClass: "div.each_all > ul > li.user > a[href], div.eachtop > ul > li.user > a[href]",
            userText: n => $(n).attr("href").replace(site.reUser, "$1"),
            userShow: (n, show) => {
                $(n).parent().parent().find("li.pics")[0].style.display = show ? "" : "none";
                $(n).parent().parent().find("li.ttl")[0].style.display = show ? "" : "none";
                $(n).parent().parent().find("li.haita")[0].style.display = show ? "" : "none";
                $(n).parent().parent().find("li.price")[0].style.display = show ? "" : "none";
                $(n).parent().parent().find("li.cate")[0].style.display = show ? "" : "none";
            },
            userSwitchAppend: (n, c) => n.parentNode.appendChild(c),
            reUser: /^http:\/\/43pan\.jp\/user\/([0-9]+)$/,
            reItem: /^http:\/\/43pan\.jp\/item\/([0-9]+)$/,
            setup: () => {
                $('.pics img').css("object-fit", "cover");
                setPreview("a[href^='http://43pan.jp/user/']", "href", site.reUser);
                setPreview("a[href^='http://43pan.jp/item/']", "href", site.reItem);
                setPreview("div.photo > img.inner_pic, div.thumbnail > ul > li > a > img", "src", /^http:\/\/43pan\.jp\/uploads\//);
            },
            getUserDesc: html => {
                let age = $(html).find("div.prof_top_box > h2.name > span.age").html().slice(1, -1);
                let prof = $(html).find("div.prof_top_box > h2.name > span.work").html();
                let src = findSrcs(html, "div.thumbnail > ul > li > a > img", "src");
                return { title: `自称${age} 自称${prof}`, src: src };
            },
            getItemDesc: html => findSrcs(html, "div.thumbnail > ul > li > a > img", "src")
        },
        "galma": {
            priceClass: ".price",//TODO
            priceText: n => n,//TODO
            priceShow: (n, hit) => n.parentNode.parentNode.style.display = hit ? "" : "none",//TODO
            priceInputOuter: () => $("#main table:eq(2) td form").parent()[0],//TODO
            priceInputStyle: n => n.setAttribute("style", "width:45px"),//TODO
            userClass: "div.goodsbox > div.o_name",
            userText: n => {
                let user = $(n).find("a[href^='./view.php?i=']").attr("href");
                if (!user) return null;
                return user.replace(site.reUser, "$1");
            },
            userShow: (n, show) => {
                $(n).parent().find("div.goodsph")[0].style.display = show ? "" : "none";
                $(n).parent().find("div.o_goods")[0].style.display = show ? "" : "none";
                $(n).parent().find("div.category")[0].style.display = show ? "" : "none";
            },
            userSwitchAppend: (n, c, user, a) => {
                $(n).prepend(c);
                if (!user) $(n).parent().append(`<div class='category'></div>`);
                let item = n.parentNode.children[0].children[0].getAttribute("href");
                getHtml(item, html => {
                    let price = $(html).find("span[itemprop='price']").html();
                    $(n.children[2]).after(`　<span style='color: #505050; font-weight: bold;'>${price}</span>`);
                    if (!user) {
                        let date = $(html).find("small[itemprop='releaseDate']").html();
                        $(n.children[2]).html(date);
                        let user = $(html).find("div#rightbox > p#headback > a[href^='./view.php?i=']").attr("href");
                        a.setAttribute("value", user.replace(site.reUser, "$1"));
                        let src = user.replace(site.reUser, "/img/girls/m$1.jpg");
                        $(n.children[1]).before(`<a href="${user}" class='preview' src='${src}'>${$(n.children[1]).html()}</a>`);
                        $(n.children[2]).remove();
                        imagePreviewSetEvents(n.children[1]);
                        $(n).next().html($(n).next().html().trim().replace(/\n/gm, "<br />\n"));
                        let cat = $(html).find("span[itemprop='category']").html();
                        $(n).next().next().html(cat);
                        filterUsers();
                    }
                });
            },
            setup: () => {
                setPreview("a[href*='view.php?i=']", "href", site.reUser, (n, attr, re) => {
                    let src = attr.replace(re, "/img/girls/m$1.jpg");
                    $(n).attr("src", src);
                    $(n).attr("title", null);
                });
                setPreview("a[href*='view.php?g=']", "href", site.reItem, (n, attr, re) => {
                    let src = attr.replace(re, "/goods/$1.jpg");
                    src = src + ";" + src.replace(/\.jpg/, "-1.jpg") + ";" + src.replace(/\.jpg/, "-2.jpg");
                    $(n).attr("src", src);
                });
                setPreview("a[target='PH'] > img[src^='./goods/m/']", "src", /^.\/goods\/m\//, (n, attr, re) => {
                    let src = attr.replace(re, "./goods/");
                    $(n).attr("src", src);
                }, true);
                setPreview("img[src^='img/girls/s']", "src", /^img\/girls\/s/, (n, attr, re) => {
                    let src = attr.replace(re, "img/girls/m");
                    $(n).attr("src", src);
                });
                setPreview("a[href^='./gallery/g']", "href", "src");
            },
            reUser: /^(?:\.\.?\/)?view\.php\?i=([0-9]+)$/,
            reItem: /^(?:\.\.?\/)?view\.php\?g=([0-9]+)$/,
            getUserDesc: html => {
                let prof = $(html).find("p#shop_pr > strong").html();
                return { title: `${prof}` };
            }
        },
        "pure": {
            priceClass: ".price",//TODO
            priceText: n => n,//TODO
            priceShow: (n, hit) => n.parentNode.parentNode.style.display = hit ? "" : "none",//TODO
            priceInputOuter: () => $("#main table:eq(2) td form").parent()[0],//TODO
            priceInputStyle: n => n.setAttribute("style", "width:45px"),//TODO
            userClass: "a.products-list-seller",
            userText: n => $(n).attr("href").replace(site.reUser, "$1"),
            userShow: (n, show) => {
                $(n).parent().prev()[0].children[0].style.display = show ? "" : "none";
                n.parentNode.children[4].style.display = show ? "" : "none";
                n.parentNode.children[5].style.display = show ? "" : "none";
            },
            userSwitchAppend: (n, c) => $(n).after(c),
            reUser: /^(?:https:\/\/pure-jewel\.com)?\/seller\/([a-zA-Z0-9]+)$/,
            reItem: /^(?:https:\/\/pure-jewel\.com)?\/product\/[0-9]+$/,
            setup: () => {
                setPreview("a[href*='/seller/']", "href", site.reUser);
                setPreview("a[href*='/product/']", "href", site.reItem);
                setPreview("ul.slides > li > img")
            },
            getUserDesc: html => {
                let age = $(html).find("article.article-product-detail span[itemprop='birthDate']").html();
                let prof = $(html).find("article.article-product-detail dd[itemprop='jobTitle']").html();
                let src = findSrcs(html, "ul.slides > li > img", "src");
                return { title: `自称${age} 自称${prof}`, src: src };
            },
            getItemDesc: html => findSrcs(html, "ul.slides > li > img", "src")
        },
        "galcole": {
            priceClass: ".price",//TODO
            priceText: n => n,//TODO
            priceShow: (n, hit) => n.parentNode.parentNode.style.display = hit ? "" : "none",//TODO
            priceInputOuter: () => $("#main table:eq(2) td form").parent()[0],//TODO
            priceInputStyle: n => n.setAttribute("style", "width:45px"),//TODO
            userClass: "div.item_data > ul > li > a[href*='shop.php?UserId=']",
            userText: n => $(n).attr("href").replace(site.reUser, "$1"),
            userShow: (n, show) => {
                $(n).parent().parent().parent().parent().prev().find("a").each((i, e) => { e.style.display = show ? "" : "none"; });
                $(n).parent().parent().find("li:gt(0)").each((i, e) => { e.style.display = show ? "" : "none"; });
            },
            userSwitchAppend: (n, c) => n.parentNode.appendChild(c),
            reUser: /^(?:\.\.\/)?shop\.php\?UserId=([a-zA-Z0-9]+)$/,
            reItem: /^(?:https:\/\/www\.galscollection\.net\/pc\/|\.\.\/|)(reserve|order_item)\.php\?UserId=([a-zA-Z0-9]+)&RecId=([0-9]+)$/,
            setup: () => {
                $('.girls_img, .list3_img, .slide_img, .list4_img, .new_girls_img, .newitem_img, .categorylist_img').css("object-fit", "cover");
                setPreview("a[href*='shop.php?UserId=']", "href", site.reUser);
                setPreview("a[href*='&RecId=']", "href", site.reItem);
                setPreview("a[href^='../photo/']", "href", null, "src");
            },
            getUserDesc: html => {
                let age = $(html).find("div#shop_data_right > ul > li:eq(2)").text();
                let prof = $(html).find("div#shop_data_right > ul > li:eq(1)").text();
                let src = $(html).find("img.shop_img").attr("src").replace(/^\.\.\//, "/");
                return { title: `自称${age} 自称${prof}`, src: src };
            },
            getItemDesc: html => findSrcs(html, "img.itemlist_img, img.itemlist_img_left, img.itemlist_img_right, img.orderlist_img, img.orderlist_img_left, img.orderlist_img_right", "src").replace(/^\.\.\//, "/")
        },
        "pancole": {
            priceClass: ".price",//TODO
            priceText: n => n,//TODO
            priceShow: (n, hit) => n.parentNode.parentNode.style.display = hit ? "" : "none",//TODO
            priceInputOuter: () => $("#main table:eq(2) td form").parent()[0],//TODO
            priceInputStyle: n => n.setAttribute("style", "width:45px"),//TODO
            userClass: "a.product_list_girl_link",
            userText: n => $(n).attr("href").replace(site.reUser, "$1"),
            userShow: (n, show) => {
                $(n).parent().parent().find("div.left_block")[0].style.display = show ? "" : "none";
                $(n).parent().parent().find("div.center_block")[0].style.display = show ? "" : "none";
            },
            userSwitchAppend: (n, c) => {
                n.parentNode.style.float = "right";
                let href = $(n).attr("href");
                let span = $(`<span><a href='${href}' class='preview'></span></span>`)[0];
                span.appendChild(c);
                $(n).parent().prepend(span);
                let user = href.replace(site.reUser, "$1");
                if (!dic[user]) {
                    if (dic[user] === undefined) {
                        dic[user] = null;
                        getHtml(href, html => {
                            dic[user] = site.getUserDesc(html);
                            let name = $(html).find("div.girls_item_profile_text:eq(0)").html();
                            dic[user].name = name;
                            $(`a[value='${user}']`).each((i, e) => { $(e).parent().prev().html(`${name} `) });
                        });
                    }
                } else {
                    if (dic[user].name) $(n).html(dic[user].name);
                }
            },
            reUser: /^(?:https:\/\/pantiescollection\.net)?\/products\/list\.php\?category_id=([0-9]+)(?:&.+)?$/,
            reItem: /^(?:https:\/\/pantiescollection\.net)?\/products\/detail\.php\?product_id=([0-9]+)$/,
            setup: () => {
                document.addEventListener('contextmenu', function(e) { e.stopPropagation(); }, true);
                $("a[href^='http://pantiescollection.net/']").each((i, n) => {
                    $(n).attr("href", $(n).attr("href").replace(/^http:/, "https:"));
                });
                setPreview("a[href*='/products/list.php?category_id=']", "href", site.reUser);
                setPreview("a[href*='/products/detail.php?product_id=']", "href", site.reItem);
                setPreview("a > img[src^='/upload/save_image/']", "src", /^(\/upload\/save_image\/[A-Z][0-9]+-[0-9]+)_([2357])\.jpg$/, (n, attr, re) => {
                    let num = attr.replace(re, "$2") - 1;
                    if (num == 2) num = 1;
                    let src = attr.replace(re, `$1_${num}.jpg`);
                    $(n).attr("src", src);
                }, true);
                setPreview("img[src^='https://pantiescollection.net/girls_images/']", "src");
            },
            getUserDesc: html => {
                let name = $(html).find("div.girls_item_profile_text:eq(0)").html();
                let age = $(html).find("div.girls_item_profile_text:eq(1)").html();
                let prof = $(html).find("div.girls_item_profile_text:eq(2)").html();
                let src = findSrcs(html, "a.cat_girl_thum", "href");
                return { title: `${name} 自称${age} 自称${prof}`, src: src };
            },
            getItemDesc: html => findSrcs(html, "div.photo_each > a", "href")
        },
        "ange": {
            priceClass: ".price",//TODO
            priceText: n => n,//TODO
            priceShow: (n, hit) => n.parentNode.parentNode.style.display = hit ? "" : "none",//TODO
            priceInputOuter: () => $("#main table:eq(2) td form").parent()[0],//TODO
            priceInputStyle: n => n.setAttribute("style", "width:45px"),//TODO
            userClass: "dl.product_code > dd > span#product_code_default",
            userText: n => {
                let user = $(n).parent().parent().parent().parent().find("a[href*='/products/list.php?category_id=']").attr("href");
                if (!user) return null;
                return user.replace(site.reUser, "$1");
            },
            userShow: (n, show) => {
                $(n).parent().parent().parent().prev()[0].style.display = show ? "" : "none";
                $(n).parent().parent().parent().children("div, h3").each((i, e) => { e.style.display = show ? "" : "none"; });
            },
            userSwitchAppend: (n, c, user, a) => {
                let item = $(n).parent().parent().parent().find("h3 > a")[0];
                if (!item) return;
                item.getAttribute("href");
                getHtml(item, html => {
                    let date = $(html).find("div#detailrightbloc > p.date").html();
                    $(n).parent().parent().next().html(date);
                    let name = $(html).find("dl.relative_cat > div > div > a[href*='/products/list.php?category_id=']").prev().html().slice(3);
                    let user = $(html).find("dl.relative_cat > div > div > a[href*='/products/list.php?category_id=']").attr("href");
                    a.setAttribute("value", user.replace(site.reUser, "$1"));
                    let src = user.replace(site.reUser, "/user_data/list_girl/images/image$1.jpg");
                    let p = $(`<p>出品者：<a href="${user}" class='preview' src='${src}'>${name}</a> </p>`)[0];
                    imagePreviewSetEvents(p.children[0]);
                    p.appendChild(c);
                    $(n).parent().parent().prepend(p);
                    filterUsers();
                });
            },
            reUser: /^(?:http:\/\/ange-lique\.net)?\/products\/list\.php\?category_id=([0-9]+)(?:&.+)?$/,
            reItem: /^(?:http:\/\/ange-lique\.net)?\/products\/detail([0-9]+)\.html$/,
            setup: () => {
                setCookie("over18", "Yes");
                setPreview("a[href*='/products/list.php?category_id=']", "href", site.reUser, (n, attr, re) => {
                    let src = attr.replace(re, "/user_data/list_girl/images/image$1.jpg");
                    $(n).attr("src", src);
                });
                setPreview("a[href*='/products/detail']", "href", site.reItem);
                setPreview("img[src^='/upload/save_image/'], img[src^='/user_data/list_girl/images/image']", "src");
            },
            getUserDesc: html => {
                let name = $(html).find("ul#topicpath > li:eq(1)").html();
                let age = $(html).find("div#profile > div.text > ul > li:eq(0) > strong > span").html();
                let prof = $(html).find("div#profile > div.text > ul > li:eq(1) > strong > span").html();
                return { title: `${name} 自称${age}歳 自称${prof}` };
            },
            getItemDesc: html => {
                let src = "";
                $(html).find("div#detailphotobloc a.expansion > img").each((i, n) => {
                    if (src) src += ";";
                    let s1 = $(n).parent().attr("href");
                    let s2 = $(n).attr("src");
                    src += /\.jpg$/.test(s1) ? s1 : s2;
                });
                return src;
            }
        },
        "luscio": {
            priceClass: ".price",//TODO
            priceText: n => n,//TODO
            priceShow: (n, hit) => n.parentNode.parentNode.style.display = hit ? "" : "none",//TODO
            priceInputOuter: () => $("#main table:eq(2) td form").parent()[0],//TODO
            priceInputStyle: n => n.setAttribute("style", "width:45px"),//TODO
            userClass: "a.mini-product",
            userText: n => {
                let user = $(n).find("a[href*='/seller/']").attr("href");
                if (!user) return;
                return user.replace(site.reUser, "$1");
            },
            userShow: (n, show) => {
                n.style.display = show ? "" : "none";
            },
            userSwitchAppend: (n, c, user, a) => {
                let item = n.getAttribute("href");
                getHtml(item, html => {
                    let date = (new Date(Date.parse($(html).find("time").attr("datetime")))).toLocaleString("ja-JP");
                    let name = $(html).find("a.nickname").html();
                    let user = $(html).find("a.nickname").attr("href");
                    a.setAttribute("value", user.replace(site.reUser, "$1"));
                    let src = "";
                    $(html).find("div.ambient-occlusion > div.picture.photo > img[srcset]").each((i, n) => {
                        if (src) src += ";";
                        let s = $(n).attr("srcset").split(", ");
                        s = s[s.length - 1].split(" ");
                        src += s[0];
                    });
                    $(html).find("div.photo > div.picture.img > img[srcset]").each((i, n) => {
                        if (i < 1) return;
                        if (src) src += ";";
                        let s = $(n).attr("srcset").split(", ");
                        s = s[s.length - 1].split(" ");
                        src += s[0];
                    });
                    $(n).find("div.detail > div.photo").each((i, n) => {
                        $(n).addClass("preview").attr("src", src);
                        imagePreviewSetEvents(n);
                    });
                    let p = $(`<p style='font-size: .625rem; margin-block-start: 0em; margin-block-end: 0em;'><a href="${user}" class='preview'>${name}</a> ${date} </p>`)[0];
                    imagePreviewSetEvents(p.children[0]);
                    p.appendChild(c);
                    $(n).prepend(p);
                    n.children[1].style.padding = "0rem";
                    filterUsers();
                });
            },
            reUser: /^\/seller\/([0-9]+)\/$/,
            reItem: /^\/product\/([0-9]+)\/$/,
            setup: () => {
                setPreview("a[href^='/seller/']", "href", site.reUser);
                setPreview("a[href^='/product/']", "href", site.reItem);
                setPreview("img[srcset]", "srcset", null, (n, attr, re) => {
                    let src = $(n).attr("src");
                    src = src ? src + ";" : "";
                    let s = attr.split(", ");
                    s = s[s.length - 1].split(" ");
//                    $(n).attr("src", src + s[0]);
                });
            },
            getUserDesc: html => {
                let name = $(html).find("div.nickname").html();
                let age = $(html).find("div.bio > ul.figure > li:eq(0)").text();
                let w = $(html).find("div.bio > ul.figure > li:eq(1)").text();
                let h = $(html).find("div.bio > ul.figure > li:eq(2)").text();
                let w2 = Number(w.slice(2, -3));
                let h2 = Number(h.slice(2, -3));
                let fat = "判定不能";
                if (w2 > 0 && h2 > 0) {
                    let bmi = w2 / ((h2 / 100) * (h2 / 100));
                    fat =
                        bmi < 16 ? "すごいガリガリ" :
                        bmi < 17 ? "ガリガリ" :
                        bmi < 18.5 ? "ややガリガリ" :
                        bmi < 25 ? "普通" :
                        bmi < 30 ? "ややデブ" :
                        bmi < 35 ? "デブ" :
                        bmi < 40 ? "すごいデブ" :
                        "ものすごいデブ";
                }
                let src = "";
                $(html).find("div.avatar > div.picture.img > img[srcset], div.portrait > div.picture.photo > img[srcset]").each((i, n) => {
                    if (src) src += ";";
                    let srcset = $(n).attr("srcset");
                    let s = srcset.split(", ");
                    s = s[s.length - 1].split(" ");
                    src += s[0];
                });
                return { title: `${name} 自称${age} 自称${w} 自称${h} ${fat}`, src: src };
            },
            getItemDesc: html => {
                let src = "";
                $(html).find("div#detailphotobloc a.expansion > img").each((i, n) => {
                    if (src) src += ";";
                    let s1 = $(n).parent().attr("href");
                    let s2 = $(n).attr("src");
                    src += /\.jpg$/.test(s1) ? s1 : s2;
                });
                return src;
            }
        }
    };
    const langel = /^https:\/\/langel\.jp\//.test(location.href) === true;
    const wmoon = /^https:\/\/www\.w-moon\.net\//.test(location.href) === true;
    const crotches = /^http:\/\/crotches\.jp\//.test(location.href) === true;
    const crotches2 = /^https:\/\/crotches2\.jp\//.test(location.href) === true;
    const shunka = /^http:\/\/43pan\.jp\//.test(location.href) === true;
    const galma = /^https:\/\/www\.galsmarket\.com\//.test(location.href) === true;
    const pure = /^https:\/\/pure-jewel\.com\//.test(location.href) === true;
    const galcole = /^https:\/\/www\.galscollection\.net\//.test(location.href) === true;
    const pancole = /^https:\/\/pantiescollection\.net\//.test(location.href) === true;
    const ange = /^http:\/\/ange-lique\.net\//.test(location.href) === true;
    const luscio = /^https:\/\/www\.luscio\.jp\//.test(location.href) === true;
    const site = sites[langel ? "langel" : wmoon ? "wmoon" : crotches ? "crotches" : crotches2 ? "crotches2" : shunka ? "shunka" : galma ? "galma" : pure ? "pure" : galcole ? "galcole" : pancole ? "pancole" : ange ? "ange" : luscio ? "luscio" : null];
    function getCookie(name, dfl) {
        name += "=";
        let found = document.cookie.split("; ").find(c => c.indexOf(name) === 0);
        if (found) return decodeURIComponent(found.substr(name.length));
        return dfl;
    }
    function setCookie(name, value) {
        //TODO max-age
        document.cookie = name + "=" + encodeURIComponent(value) + "; path=/; max-age=5184000";
    }
    function filterPrice() {
        let input = document.getElementById("priceInput");
        if (!input) return;
        let max = Number(input.value);
        $(site.priceClass).each((i, n) => {
            let price = Number(site.priceText(n).textContent.replace(/[^0-9]+/g, ""));
            site.priceShow(n, max === 0 || price <= max);
        });
    }
    function onChangePrice(input) {
        input.value = Number(input.value.replace(/[Ａ-Ｚａ-ｚ０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0)));
        setCookie("filterPrice", input.value);
        filterPrice();
    }
    function appendPriceInput() {
        let outer = site.priceInputOuter();
        if (!outer) return;
        let input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("value", getCookie("filterPrice", "0"));
        input.setAttribute("maxlength", "10");
        input.setAttribute("id", "priceInput");
        site.priceInputStyle(input);
        input.addEventListener("change", function() { onChangePrice(this); }, false);
        let span = document.createElement("span");
        span.innerHTML = "価格絞り込み ¥";
        span.appendChild(input);
        outer.appendChild(span);
    }
    appendPriceInput();
    function filterUsers() {
        let names = getCookie("hiddenNames", "");
        let modified = false;
        $(site.userClass).each((i, n) => {
            let target = site.userText(n);
            if (target) {
                if (langel) {
                    let id = target.replace(/^(\d*):(.*)$/, "$1");
                    let name = target.replace(/^(\d*):(.*)$/, "$2");
                    if (id) {
                        let index = names.indexOf("\t" + id + ":");
                        site.userShow(n, index < 0);
                        if (index >= 0) {
                            let name0 = names.slice(index + ("\t" + id + ":").length).replace(/\t.*$/, "");
                            if (name0 != name) {
                                console.log(name0 + "\n" + name);
                                names = names.replace("\t" + id + ":" + name0 + "\t", "\t" + id + ":" + name + "\t");
                                modified = true;
                            }
                        }
                    } else {
                        site.userShow(n, names.indexOf(":" + name + "\t") < 0);
                    }
                } else {
                    site.userShow(n, names.indexOf( "\t" + target + "\t") < 0);
                }
            }
        });
        if (modified) setCookie("hiddenNames", names);
    }
    function onClickUser(node) {
        let user = node.getAttribute("value");
        user = "\t" + user + "\t";
        let names = getCookie("hiddenNames", "\t");
        let index = names.indexOf(user);
        if (index >= 0) {
            names = names.substr(0, index) + "\t" + names.substr(index + user.length);
        } else {
            names = names + user.substr(1);
        }
        setCookie("hiddenNames", names);
        filterUsers();
    }
    function getHtml(url, success, error, charset) {
        let opt = { type: "get", url: url, dataType: "html" };
        if (charset) opt.beforeSend = function(xhr) { xhr.overrideMimeType(`text/plain; charset=${charset}`); };
        $.ajax(opt).done(data => {
            success($.parseHTML(data));
        }).fail(() => {
            console.log("error", url);
            if (error) error();
        });
    }
    function setPreview(sel, getAttr, re, setAttr, setParent) {
        $(sel).each((i, n) => {
            if ($(n).parent().hasClass("preview")) return;//avoid p > img
            let dst = setParent ? n.parentNode : n
            let attr = null;
            if (getAttr) attr = $(n).attr(getAttr);
            if (re && (!attr || !re.test(attr))) return;
            if ($(dst).hasClass("preview")) return;
            $(dst).addClass("preview");
            if (typeof setAttr === "string" && attr) $(dst).attr(setAttr, attr);
            if (typeof setAttr === "function" && attr) setAttr(dst, attr, re);
        });
    }
    function findSrcs(html, sel, attr) {
        let src = "";
        $(html).find(sel).each((i, n) => {
            if (src) src += ";";
            src += $(n).attr(attr);
        });
        return src;
    }
    function judgeBmi(text) {
        //console.log(text);
        text = text.replace(/[Ａ-Ｚａ-ｚ０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 65248));
        let m = /体重[^0-9]*([0-9]+(?:\.[0-9]*)?)/g.exec(text);
        if (!m) m = /([0-9]+(?:\.[0-9]*)?) *(?:kg|キロ|ｷﾛ|㎏|㌔)/g.exec(text);
        let w = m ? Number(m[1]) : 0;
        m = /身長[^0-9]*([0-9]+(?:\.[0-9]*)?)/g.exec(text);
        if (!m) m = /([0-9]+(?:\.[0-9]*)?) *(?:cm|センチ|ｾﾝﾁ|㎝|㌢)/g.exec(text);
        let h = m ? Number(m[1]) : 0;
        //console.log(w, h);
        let fat = null;
        if (w > 0 && h > 0) {
            let bmi = w / ((h / 100) * (h / 100));
            fat =
                bmi < 16 ? "すごいガリガリ" :
                bmi < 17 ? "ガリガリ" :
                bmi < 18.5 ? "ややガリガリ" :
                bmi < 25 ? "普通" :
                bmi < 30 ? "ややデブ" :
                bmi < 35 ? "デブ" :
                bmi < 40 ? "すごいデブ" :
                "ものすごいデブ";
        }
        return fat;
    }
    var dic = {};
    function appendUserSwitch() {
        site.setup();
        $(site.userClass).each((i, n) => {
            if ($(n).find(".userSwitch").length) return;
            let user = site.userText(n);
            let span = document.createElement("span");
            if (langel) {
                //add user tag into item header
                let text = $(n).parent().parent().parent().find(".item-list-head__category").html().trim();
                $(n).parent().parent().parent().find(".item-list-head__category").html("");
                $(span).append(`<span>${text}</span>`);//上のカテゴリ
                $(span).append(`<a style='color: #ffffff; display: none;'>${n.innerHTML.trim()}</a>`);//上の名前
                //TOOD overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 10em;
            }
            let a = $(`<a>▼</a>`)[0];
            if (user) a.setAttribute("value", user);
            a.addEventListener("click", function() { onClickUser(this); }, false);
            span.appendChild(a);
            $(span).addClass("userSwitch");
            site.userSwitchAppend(n, span, user, a);
        });
    }
    appendUserSwitch();
    filterUsers();
    filterPrice();
    var imagePreviewSetEvents;
    (function(resolve) {
        /*
         * Image preview script
         * original is written by Alen Grakalic (http://cssglobe.com)
         */
        var cursor;
        function move(ev) {
            if (!ev) ev = cursor; else cursor = ev;
            if (!ev) return;
            const margin = 10;
            const xOffset = 10;
            const yOffset = -30;
            let p = $("#preview");
            let x = ev.clientX + xOffset;
            let y = ev.clientY + yOffset;
            if (x + p.outerWidth(true) > $(window).width() - margin && x >= margin) x = $(window).width() - margin - p.outerWidth(true);
            if (y + p.outerHeight(true) > $(window).height() - margin && y >= margin) y = $(window).height() - margin - p.outerHeight(true);
            if (x < margin & x + p.outerWidth(true) <= $(window).width() - margin) x = margin;
            if (y < margin & y + p.outerHeight(true) <= $(window).height() - margin) y = margin;
            p.css("left", x + "px").css("top", y + "px");
        }
        var timer = setInterval(() => {
            $("#preview > img[srcs*=';']").each((i, e) => {
                if (!e.loaded) return;
                let src = e.getAttribute("src");
                let srcs = $(e).attr("srcs").split(";");
                if (srcs.length >= 2) {
                    if (e.second) {
                        e.loaded = false;
                        e.setAttribute("src", srcs[(srcs.indexOf(src) + 1) % srcs.length]);
                    } else {
                        e.second = true;//skip first trigger
                    }
                }
            });
        }, 2000);
        function create(ev, t) {
            if (!t.focus) return;//check focus still on
            if (resolve && !resolve(t, create, ev)) return;
            let src = t.getAttribute("src");
            if (!src) return;
            t.t = t.getAttribute("title");
            t.title = "";
            let style = "display: none;"//fadeIn
                + " position: fixed;"//clientX/Y
                + " z-index: 1000;"//foreground
                + "pointer-events: none;"//avoid hover flicker
                + " *width: auto;"//wrap
                + " line-height: 120%; box-sizing: content-box; padding: 5px; border: 3px solid #333; background: #444; color: #fff;";//design
            let c = (t.t) ? `<span style='font-size: 95%; font-family: 'メイリオ'; text-align: center;'>${t.t}</span>` : "";
            let srcs = src.split(";");
            let img = `<img src='${srcs[0]}' srcs='${src}' srcs0='${src}' style='display: none;' />`;
            let div = $(`<div id='preview' style='${style}'>${c}${img}</div>`);
            $("body").append(div);
            let onerror = function(t) {
                    $(div).hide();
                    let src = t.getAttribute("src");
                    console.log("fail", src);
                    let srcs = t.getAttribute("srcs").split(";");
                    let srcs2 = srcs.filter((e, i, a) => { return a[i] != src });//TODO remove it and after
                    t.setAttribute("srcs", srcs2.join(";"));
                    if (srcs2.length > 0) t.setAttribute("src", srcs2[0]);
            };
            $(div).find("img:last")[0].addEventListener('load', function(e) {//last is to exclude emoji img
                if (this.naturalWidth <= 1) {
                    onerror(this);
                    return;
                }
                this.loaded = true;
                if (this.naturalHeight > document.documentElement.clientHeight * 0.9) {
                    this.width = this.naturalWidth * document.documentElement.clientHeight / this.naturalHeight * 0.9;
                }
                this.parentNode.style.width = this.width + "px";
                this.style.display = "block";
                move(null);
                $(div).fadeIn();//to show hidden img
            }, false);
            $(div).find("img:last")[0].addEventListener('error', function(e) {//last is to exclude emoji img
                onerror(this);
            }, false);
            move(ev);//just save
            $(div).fadeIn();//to response hover
        }
        imagePreviewSetEvents = function(node, unbind) {
            if (!node.classList.contains("preview")) return;
            if (unbind) {
                $(node).removeClass("preview");
                $(node).unbind("mouseenter mouseleave mousemove");
                return;
            }
            let events = jQuery._data($(node).get(0)).events;
            if (events && (events.mouseenter || events.mouseleave || events.mousemove)) return;
            $(node).hover(function(ev) {
                this.focus = true;
                create(ev, this);
            }, function() {
                this.focus = false;
                if (this.t) this.title = this.t;
                $("#preview > img[srcs0*=';']").each((i, e) => {//update shrunk srcs
                    let srcs = e.getAttribute("srcs");
                    let srcs0 = e.getAttribute("srcs0");
                    if (srcs != srcs0) $(`.preview[src="${srcs0}"]`).attr("src", srcs);
                });
                $("#preview").remove();
            }).mousemove(function(ev) {
                if (!$("#preview")[0]) {
                    create(ev, this);//for src added afterward
                    return;
                }
                move(ev);
            });
        }
    })(function(t, create, ev) {
        function getHtmlOnce(url, t, success, flag, charset) {
            if (!flag) flag = "creating";
            if (t[flag]) return;
            t[flag] = true;
            getHtml(url, html => {
                t[flag] = false;
                success(html);
            }, () => {
                t[flag] = false;
            }, charset);
        }
        let href = t.getAttribute("href");
        if (site.getUserDesc && site.reUser.test(href) && (!t.getAttribute("src") || (langel || wmoon || galma || ange || luscio) && !t.getAttribute("title"))) {
            let user = href.replace(site.reUser, "$1");
            if (!dic[user]) {
                if (dic[user] === undefined) {
                    dic[user] = null;
                    getHtmlOnce(href, t, html => {
                        dic[user] = site.getUserDesc(html);
                        create(ev, t);
                    }, null, galcole ? "shift_jis" : null);
                }
                return false;
            }
            if (dic[user].title) t.setAttribute("title", dic[user].title);
            if (!t.getAttribute("src")) {
                if (dic[user].src) {
                    t.setAttribute("src", dic[user].src);
                } else {
                    $(t).removeClass("preview");
                }
            }
        }
        if (site.getItemDesc && site.reItem.test(href) && !t.getAttribute("src")) {
            if (!dic[href]) {
                if (dic[href] === undefined) {
                    dic[href] = null;
                    getHtmlOnce(href, t, html => {
                        dic[href] = site.getItemDesc(html);
                        create(ev, t);
                    });
                    return false;
                }
            }
            if (dic[href]) {
                t.setAttribute("src", dic[href]);
            } else {
                $(t).removeClass("preview");
            }
        }
        return true;
    });
    $(".preview").each((i, e) => { imagePreviewSetEvents(e); });
    function watchAutoPager(holder, load) {
        $(holder).each((i, e) => {
            var countDefer = 0;
            var timerDefer;
            e.addEventListener('DOMNodeInserted', function(e) {
                countDefer = 0;
                if (!timerDefer) timerDefer = setInterval(() => {
                    if (countDefer < 2) {
                        countDefer++;
                        return;
                    }
                    clearInterval(timerDefer);
                    timerDefer = null;
                    if (load) load();
                }, 1000);
            });
        });
    }
    watchAutoPager("#pugHolder", () => {
        appendUserSwitch();
        $(".preview").each((i, e) => { imagePreviewSetEvents(e); });
    });
}
