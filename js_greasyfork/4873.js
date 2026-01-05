// ==UserScript==
// @name        「ONE·一个」网站增强
// @namespace   https://github.com/jiajunw/one-enhanced
// @description 为「ONE·一个」网站增加方便的功能
// @icon        https://raw.githubusercontent.com/JiajunW/One-Enhanced/master/res/icon.png
// @include     http://wufazhuce.com/one
// @include     http://wufazhuce.com/one/
// @include     http://wufazhuce.com/one/vol*
// @version     1.5.0
// @resource    custom_css https://raw.githubusercontent.com/JiajunW/One-Enhanced/master/style/style.css
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/4873/%E3%80%8CONE%C2%B7%E4%B8%80%E4%B8%AA%E3%80%8D%E7%BD%91%E7%AB%99%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/4873/%E3%80%8CONE%C2%B7%E4%B8%80%E4%B8%AA%E3%80%8D%E7%BD%91%E7%AB%99%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

function add_style() {
    GM_addStyle(GM_getResourceText("custom_css"));
}

function get_today_no() {
    var the_day_before_first = new Date(2012, 10 - 1, 7);
    var today = new Date();

    var diff = new Date(today - the_day_before_first);
    var days = diff / 1000 / 60 / 60 / 24;
    return Math.floor(days);
}

function get_cur_no() {
    var url_path = document.location.pathname;
    var re = /^\/one\/vol\.(\d+)/g;
    var matches = re.exec(url_path);
    if (matches && matches.length > 1) {
        return parseInt(matches[1]);
    }
}

function dom(tag, attr, inner) {
    var tag = document.createElement(tag);
    for (var key in attr) {
        if (attr.hasOwnProperty(key)) {
            tag.setAttribute(key,attr[key]);
        }
    }
    if (inner) {
        tag.innerHTML = inner;
    }
    return tag;
}

function jump_to_page_tab(e) {
    e.preventDefault();

    var tag = e.target.tagName.toLowerCase();
    var url;
    var hash = document.location.hash;
    if (tag == 'span') {
        url = e.target.parentNode.href;
    } else {
        url = e.target.href;
    }

    document.location.href = url + hash;
}

function add_nav() {
    var new_nav = dom('nav', { id : 'enhanced-navbar' });
    document.body.appendChild(new_nav);

    var url = '/one/vol.';
    if (cur < newest) {
        var url_next = url + (cur + 1);
        var new_nav_newer = dom(
            'a',
            { id : 'enhanced-newer', href : url_next },
            '<span class="glyphicon glyphicon-circle-arrow-left"></span>'
        );
        new_nav.appendChild(new_nav_newer);
    }

    if (cur > oldest) {
        var url_prev = url + (cur - 1);
        var new_nav_older = dom(
            'a',
            { id : 'enhanced-older', href : url_prev },
            '<span class="glyphicon glyphicon-circle-arrow-right"></span>'
        );
        new_nav.appendChild(new_nav_older);
    }


    var nodes = document.querySelectorAll('#enhanced-navbar a');
    for (var i = 0; i < nodes.length; ++i) {
        nodes[i].addEventListener('click', jump_to_page_tab, false);
    }

    add_style();
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function add_random_link() {
    var rand = getRandomInt(oldest, newest);
    var rand_url = '/one/vol.' + rand;

    var navbar = document.querySelector('#one-navbar .navbar-right');
    var recent = document.querySelector('#one-navbar .navbar-right > li');
    var rand_link = '<a href="' + rand_url + '"><span class="visible-xs">ONE<br />偶遇</span><span class="hidden-xs">ONE 偶遇</span></a>';
    var rand_item = dom('li', null, rand_link);
    navbar.insertBefore(rand_item, recent);

    rand_item.childNodes[0].addEventListener('click', jump_to_page_tab, false);
}

/**
 * Some questions (e.g. vol 1,3,4,210, etc.) have html code on pages
 * which are ugly. So I decide to remove them.
 */
function strip_html() {
    var question = document.querySelector('.cuestion-contenido').innerHTML;
    var stripped = question.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/<(?:.|\n)*?>/gm, '');
    document.querySelector('.cuestion-contenido').innerHTML = stripped;
}

/**
 * Some old pages does not contain one things!
 * So we can remove the link
 */
function strip_things() {
    var thing_title = document.querySelector('#tab-cosas .cosas-titulo').innerHTML.trim();
    if (!thing_title) {
        var navbar = document.querySelector('#one-navbar ul');
        var link = navbar.querySelector('li:last-child');
        navbar.removeChild(link);
    }
}

function detail_page() {
    var header = document.querySelector('.page-header > h1');
    if (header && header.innerHTML.trim() === '404 Not Found') {
        // this is a 404 page
    } else {
        add_nav();
        add_random_link();
        strip_html();
        strip_things();
    }
}

function list_page() {
    add_style();
    var row = dom('div', { class : 'row' }, '<hr />'),
        btn = dom('button', { id : 'loadmore', class : 'btn btn-primary center-block' }, '载入更多');
    row.appendChild(btn);
    document.querySelector('.one-indice > .col-lg-8').appendChild(row);

    btn.addEventListener('click', function(e) {
        // first disable the button
        var btn = document.querySelector('#loadmore');
        btn.setAttribute("disabled", "true");
        btn.innerHTML = '<span class="glyphicon glyphicon-refresh"></span> 拼命加载中...';

        // we should load 9 more items every click
        var pic_urls = {};

        var items = document.querySelectorAll('.pasado');
        var last_item = items[items.length - 1];
        var last_link = last_item.children[1].href;
        var matches = /\/one\/vol\.(\d+)$/.exec(last_link);
        var last_no = parseInt(matches[1]);

        for (var i = last_no - 1; i > last_no - 10; --i) {
            var url = '/one/vol.' + i;
            GM_xmlhttpRequest({
                url: url,
                method: "GET",
                onload: function(response) {
                    if (response.status == 200) {
                        var re = /\/one\/vol\.(\d+)/g;
                        var matches = re.exec(response.finalUrl);
                        var vol = parseInt(matches[1]);

                        var tmp = dom('div');
                        tmp.innerHTML = response.responseText;
                        var pic = tmp.querySelector('.one-imagen').children[0].src;

                        var date = tmp.querySelector('.one-pubdate');
                        var day = date.children[0].innerHTML,
                            month = date.children[1].innerHTML.split(' ')[0],
                            year = date.children[1].innerHTML.split(' ')[1];
                        var date_str = month + ' ' + day + ', ' + year;

                        pic_urls[vol] = { pic: pic, date: date_str }
                    }

                    var count = 0;
                    var i;
                    for (i in pic_urls) {
                        if (pic_urls.hasOwnProperty(i)) {
                            count++;
                        }
                    }
                    if (count == 9){
                        // finish loading!
                        for (i = last_no - 1; i > last_no - 10; --i) {
                            var new_url = '/one/vol.' + i;
                            var block = dom('div', { class : 'col-sm-4 pasado' }, '<hr />');
                            var img_link = dom('a', { href: new_url });
                            var img = dom('img', { class : 'one-imagen', src : pic_urls[i].pic });
                            var p = dom('p');
                            var p_link = dom('a', { href: new_url }, '<span class="pull-right">' + pic_urls[i].date + '</span>VOL.' + i + '</a>');
                            p.appendChild(p_link);
                            img_link.appendChild(img);
                            block.appendChild(img_link);
                            block.appendChild(p);

                            var posts_row = document.querySelector('.one-indice .row');
                            posts_row.appendChild(block);
                        }

                        // enable the button again.
                        btn.removeAttribute("disabled");
                        btn.innerHTML = '加载更多';
                    }
                } // onload
            }); // xhr
        } // for loop
    }, false); // addEventListener

    window.addEventListener("scroll", function(evt) {
        var btn = document.querySelector('#loadmore');
        var page_height = window.innerHeight,
            btn_to_top = btn.getBoundingClientRect().top;

        if (btn_to_top - page_height < 50) {
            btn.click();
        }
    });
}

var path = document.location.pathname;

if (/^\/one\/?$/.test(path)) {
    list_page();
} else if (/^\/one\/vol\.(\d+)$/.test(path)) {
    var newest = get_today_no(),
        oldest = 1,
        cur    = get_cur_no();
    var tomorrow_url = '/one/vol.' + (newest + 1);

    GM_xmlhttpRequest({
        url: tomorrow_url,
        method: "HEAD",
        onload: function(response) {
            if (response.status == 200) {
                // has already published
                // so plus 1 to newest
                newest += 1;
            } else if (response.status == 404) {
                // not published yet.
            }
            detail_page();
        }
    });
}
