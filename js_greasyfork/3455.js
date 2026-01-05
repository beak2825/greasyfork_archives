// ==UserScript==
// @name            forums.bgdev.org
// @author          TNT
// @description     Add ajax functionality to mark forums as read.
// @icon            https://raw.github.com/sizzlemctwizzle/GM_config/master/gm_config_icon_large.png
// @include         http://forums.bgdev.org/
// @include         http://forums.bgdev.org/index.php?
// @include         http://forums.bgdev.org/index.php?showforum*
// @include         http://forums.bgdev.org/index.php?act=idx
// @include         http://forums.bgdev.org/index.php?showtopic*
// @require         http://code.jquery.com/jquery-1.11.1.min.js
// @require         https://greasyfork.org/scripts/3465-jquery-timers/code/jQuerytimers.js?version=10415
// @resource        0 http://tnt-soft.net/GreaseMonkey/img/numbers/0.gif
// @resource        1 http://tnt-soft.net/GreaseMonkey/img/numbers/1.gif
// @resource        2 http://tnt-soft.net/GreaseMonkey/img/numbers/2.gif
// @resource        3 http://tnt-soft.net/GreaseMonkey/img/numbers/3.gif
// @resource        4 http://tnt-soft.net/GreaseMonkey/img/numbers/4.gif
// @resource        5 http://tnt-soft.net/GreaseMonkey/img/numbers/5.gif
// @resource        6 http://tnt-soft.net/GreaseMonkey/img/numbers/6.gif
// @resource        7 http://tnt-soft.net/GreaseMonkey/img/numbers/7.gif
// @resource        8 http://tnt-soft.net/GreaseMonkey/img/numbers/8.gif
// @resource        9 http://tnt-soft.net/GreaseMonkey/img/numbers/9.gif
// @resource        left  http://tnt-soft.net/GreaseMonkey/img/numbers/left.gif
// @resource        right http://tnt-soft.net/GreaseMonkey/img/numbers/right.gif
// @resource        loading http://tnt-soft.net/GreaseMonkey/img/loading.gif
// @resource        settings http://tnt-soft.net/GreaseMonkey/img/icon-settings-small.png
// @resource        pin http://tnt-soft.net/GreaseMonkey/img/pins/pin.png
// @resource        pin1 http://tnt-soft.net/GreaseMonkey/img/pins/pin1.png
// @grant           GM_getResourceURL
// @version         1.0.5
// @run-at          document-end
// @namespace https://greasyfork.org/users/3669
// @downloadURL https://update.greasyfork.org/scripts/3455/forumsbgdevorg.user.js
// @updateURL https://update.greasyfork.org/scripts/3455/forumsbgdevorg.meta.js
// ==/UserScript==

forums = [];
title = '';
new_title = '';
selector = '#ipbwrapper > form > div.tableborder > table > tbody > tr > td.row4:nth-child(3) > a[href$="getnewpost"]';
forum_url = '';
match = '';
load_index = 0;
process_index = 0;
cnt = 0;
cnt_str = '';
timeout = 250; // minimum is 250
links = $('table[id^="cat_"] > tbody > tr > td:first-child.row4 > a:first-child');

// check for new messages
$(document.body).oneTime(500, 'check_messages', checkMessages);

function checkMessages(){
    _parent = $('#userlinks');
    link = $('#userlinks > tbody > tr:first-child > td:last-child > a').eq(2);
    if(link.length > 0){
        txt = link.text();
        tmp = txt.split(' ');
        if(parseInt(tmp[0]) > 0){
            _parent.css({
                'background-color': '#ff9260'
            });
            link.css({
                'color': 'red',
                'font-weight': 'bold'
            });
        }
        else{
            _parent.removeAttr('style');
            link.removeAttr('style');
        }
    }
}

// -- start: cache
loading_icon = $('<img />');
loading_icon.attr('width', 28);
loading_icon.attr('height', 28);
loading_icon.attr('src', GM_getResourceURL('loading'));
loading_icon.css('display', 'none');
$(document.body).prepend(loading_icon);
// -- end: cache

if(links.length > 0){
    links.each(function(index, el){
        // mark forum as read
        $(el).on('click', click_handler);
        title = $(el).attr('title');
        new_title = title + ' (via AJAX)';
        $(el).attr('title', new_title);

        // badges
        forum_url = $(el).parent('td.row4').next('td.row4').find('b:first-child > a').attr('href');
        match = forum_url.match(/showforum=([\d]+)$/m);
        forum_url += '&rand='+Math.random();
        if (match != null) {
            forums[forums.length] = {
                id: match[1],
                url: forum_url
            };
            $(el).attr('link', match[1]);
        }
    });

    if(forums.length > 0){
        // start processing badges
        $(document.body).everyTime(timeout, 'load', load_results);
    }
}

keyword = 'rvc';
trs = $('body > div#ipbwrapper > div.tableborder > div.maintitle + div.postlinksbar ~ table[border=0] > tbody > tr:nth-child(2)');
tds = trs.find('td:nth-child(2).post1, td:nth-child(2).post2');
elements = tds.find("div.postcolor:not(table,tbody,tr,td#QUOTE,span.edit):contains('"+keyword+"')");
console.log(elements);
if(elements.length > 0){
    elements.each(function(index, el){
        cont = $(el).html();
        re = new RegExp("("+keyword+")", "i");
        // wrap keywords
        r = cont.replace(re, "<span style='position: relative;' rel='keyword_wrapper'>$1</span>");
        //console.log(r);
        $(el).html(r);
    });
}
wrapers = $('span[rel="keyword_wrapper"]');
wrapers_cnt = 0;
if(wrapers.length > 0){
    // check if wraper is in last "edited container"
    wrapers.each(function(index, el){
        // if wraper is not in last "edited container"
        if($(el).parents('span.edit').length == 0){
            wrapers_cnt++;
            wraper_width = parseInt($(el).css('width'));
            var img = $('<img />');
            img.attr('id', 'pin_'+wrapers_cnt);
            img.attr('src', GM_getResourceURL('pin1'));
            img.attr('rel', 'keyword_pin');
            img.css({
                'position': 'absolute',
                'top': '-35px',
                'left': ((wraper_width / 2) - 15)+'px',
                'cursor': 'pointer'
            });
            $(el).append(img);
        }
    });
}

if(wrapers_cnt > 0){
    for(i=1; i<=wrapers_cnt; i++){
        var span = $('<span />'),
            i_str = i.toString();
        for(j=0; j<i_str.length; j++){
            img = $('<img />');
            img.attr('src', GM_getResourceURL(i_str.charAt(j)));
            span.append(img);
        }
        span.attr('rel', 'clicker');
        span.attr('pin', 'pin_'+i);
        span.css({
            'display': 'inline-block',
            'position': 'fixed',
            'top': (i*22)+'px',
            'left': '0px',
            'padding': '5px',
            'background-color': '#660000',
            'cursor': 'pointer'
        });
        $(document.body).append(span);
    }
}

$('span[rel="clicker"]').on('click', function(e){
    pin = '#'+$(this).attr('pin');
    ofs = $(pin).offset();
    console.log(ofs.top);
    $('html').animate({
        scrollTop: ofs.top-20
    }, 1000);
});

$('img[rel="keyword_pin"]').on('click', function(e){
    pin = $(this).attr('id');
    $(this).remove();
    $('span[rel="clicker"][pin="'+pin+'"]').animate({
        'left': '-=20px'
    }, 1000);
});

function click_handler(e){
    var this_el,
        url,
        img,
        img_url,
        match,
        loader;

    e.preventDefault();
    this_el = $(this);
    url = this_el.attr('href');
    img = this_el.children('img');
    img_url = img.attr('src');
    match = img_url.match(/^(.+\/)([\w]+)_(\w+\.\w+)$/m);
    if(match != null){
        loader = $('<img />');
        loader.attr('id', 'loader');
        loader.attr('width', 28);
        loader.attr('height', 28);
        loader.attr('src', GM_getResourceURL('loading'));
        this_el.css('display', 'none').after(loader);
        $.ajax({
            url: url,
            type: 'GET',
            global: false,
            success: function(){
                this_el.remove();
                loader.attr('border', 0);
                loader.attr('alt', 'No New Posts');
                loader.attr('src', match[1]+match[2]+'_no'+match[3]);
            },
            error: function(){
                loader.remove();
                this_el.css('display', 'inline').removeAttr('style');
            }
        });
    }
}

function load_results(){
    var result_div;

    if(forums[load_index] != undefined){
        result_div = $('<div />');
        result_div.attr('id', 'result_div_'+forums[load_index]['id']);
        result_div.css('display', 'none');
        $(document.body).append(result_div);
        // load page fragment
        result_div.load(forums[load_index]['url']+' '+selector);
        load_index++;
    }
    else{
        // stop processing badges
        $(document.body).stopTime('load', load_results);
        // start processing results
        $(document.body).everyTime(timeout, 'process', process_results);
    }
}

function process_results(){
    var result_div,
        counter,
        tmp_img;

    if(forums[process_index] != undefined){
        result_div = $('#result_div_'+forums[process_index]['id']);
        cnt = result_div.children('a').length;
        if(cnt > 0){
            cnt_str = cnt.toString();
            if(typeof cnt_str == 'string'){
                counter = $('<div />');
                counter.css({
                    'position': 'absolute',
                    'top': '-6px',
                    'left': '0px'
                });
                tmp_img = $('<img />');
                tmp_img.attr('src', GM_getResourceURL('left'));
                counter.append(tmp_img);
                for(i=0; i<cnt_str.length; i++){
                    tmp_img = $('<img />');
                    tmp_img.attr('src', GM_getResourceURL(cnt_str.charAt(i)));
                    counter.append(tmp_img);
                }
                tmp_img = $('<img />');
                tmp_img.attr('src', GM_getResourceURL('right'));
                counter.append(tmp_img);
                $('a[link="'+forums[process_index]['id']+'"]').css('position', 'relative').append(counter);
            }
        }
        process_index++;
    }
    else{
        // stop processing results
        $(document.body).stopTime('process', process_results);
        // start cleanup process
        process_index = 0;
        $(document.body).everyTime(timeout, 'cleanup', cleanup);
    }
}

function cleanup(){
    var _div;

    if(forums[process_index] != undefined){
        _div = $('#result_div_'+forums[process_index]['id']);
        _div.remove();
        forums[process_index] = null;
        process_index++;
    }
    else{
        $(document.body).stopTime('cleanup', cleanup);
    }
}