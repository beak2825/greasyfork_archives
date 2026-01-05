// ==UserScript==
// @name           99mh Manga Autoload
// @description    Autoload all images on one page when reading manga on 99mh.com and similar sites.
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          unsafeWindow
// @include        /^http://99mh\.com/comic/[0-9]+/[0-9]+//
// @version 0.0.1.20151229085631
// @namespace https://greasyfork.org/users/2233
// @downloadURL https://update.greasyfork.org/scripts/1728/99mh%20Manga%20Autoload.user.js
// @updateURL https://update.greasyfork.org/scripts/1728/99mh%20Manga%20Autoload.meta.js
// ==/UserScript==

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

// ref
// http://userscripts.org:8080/scripts/show/135690
// http://userscripts.org:8080/scripts/show/96819
// http://userscripts.org:8080/scripts/show/68586
// http://userscripts.org:8080/scripts/show/152192

var start=0
var end=0

// Debugging 選項設定
var PRINT_MATCHED_STRINGS = 0
var PRINT_WND_PROPS = 0

// 滑鼠設定
var USE_MOUSE_TO_TURN_PAGE = 1 // 是否點選最後一張圖片後自動跳下一頁(集)
var CURSOR_STYLE = 'pointer'   // 設定滑鼠游標的圖案

// 熱鍵設定
var GOTO_NEXT_VOLUME_KEYCODE      = 34 // <PageDown>
var NEXT_PAGE_KEYCODE             = 32 // <Space>
var PREV_PAGE_KEYCODE             = 8  // <BS>
var TURN_PAGE_KEYCODE             = 13 // <CR>

// 預讀頁數設定
var AUTOLOAD_PAGE_COUNT = 10 // 一次讀多少頁 (0:全讀)

// Resize Images 設定
var SET_IMG_WIDTH_KEYCODE = 13 // <CR>, should be used with <Shift>
var IMG_WIDTH = GM_getValue('IMG_WIDTH', window.innerWidth)

var $=function(selector, el) { if(!el) { el = document }; return el.querySelector(selector) }

var $$=function(selector, el) { if(!el) { el = document }; return el.querySelectorAll(selector) } // NodeList (can be converted to Array)

var add_first_volume_links = function(imglnks, same_lnks, act_on_response)
{
    if(imglnks.length != 0 && same_lnks.length != 0) {
        for(var i = 0; i < imglnks.length; i++) {
            let imglnk = imglnks[i].parentNode.href
            imglnks[i].parentNode.onclick = function() { goto_first_volume(imglnk, same_lnks, act_on_response); return false }
        }; throw 'exit'
    }
}

var add_key_event_for_navigation = function(next_page, prev_page)
{
    document.addEventListener("keydown",function(evt) {
        if(evt.target.tagName=="INPUT") { return }
        if((evt.keyCode==NEXT_PAGE_KEYCODE) && next_page) {
            evt.preventDefault()
            location.href=next_page
        } else if(evt.keyCode==PREV_PAGE_KEYCODE && prev_page) {
            evt.preventDefault()
            location.href=prev_page
        }
    },false)
}

var add_key_event_for_changing_resizing_factor = function()
{
    document.addEventListener("keydown",function(evt) {
        if(evt.target.tagName=="INPUT") { return }
        if((evt.keyCode==SET_IMG_WIDTH_KEYCODE) && evt.shiftKey) {
            var w = GM_getValue('IMG_WIDTH', IMG_WIDTH)
            var img_width = parseInt(prompt('現在圖片寛度: '+w+'\n設定圖片寬度:'))
            GM_setValue('IMG_WIDTH', img_width)
            resize_imgs()
        }
    },false)
}

var add_mouse_event_for_navigation = function(img, another_volume_link)
{
    if(USE_MOUSE_TO_TURN_PAGE) {
        img.style.cursor = CURSOR_STYLE
        img.addEventListener("click",function() { location.href=another_volume_link },false)
    }
}

var add_key_event_for_turning_to_specific_page = function(exp_page)
{
    document.addEventListener("keydown",function(evt) {
        if(evt.target.tagName=="INPUT") { return }
        if((evt.keyCode==TURN_PAGE_KEYCODE) && !evt.shiftKey) {
            evt.preventDefault()
            var page_start_index = prompt('已看完第['+end+']頁(共'+num_pages+'頁)，要到第幾頁？')
            if(page_start_index == '' || page_start_index == null) { return }
            if(page_start_index.toString().toLowerCase()=='n') { location.href=get_another_volume_link(1) }
            else if(page_start_index.toString().toLowerCase()=='p') { location.href=get_another_volume_link(-1) }
            else
            {
                page_start_index=parseInt(page_start_index)
                if(isNaN(page_start_index)) { return }
                else
                {
                    if(page_start_index<1) { page_start_index = 1 }
                    else if(page_start_index > num_pages) { page_start_index = num_pages }
                    location.href = location.href.replace(exp_page,'$1'+page_start_index)
                }
            }
        }
    },false)
}

var add_pics = function(exp_page, pics)
{
    // Remove all elements
    document.documentElement.innerHTML=''

    num_pages = pics.length
    if(num_pages==0) { alert('Error: pics.length is zero'); throw 'exit' }
    AUTOLOAD_PAGE_COUNT = (AUTOLOAD_PAGE_COUNT!=0?AUTOLOAD_PAGE_COUNT:num_pages)
    start = current_page
    end = start + AUTOLOAD_PAGE_COUNT - 1
    end = (end<=num_pages?end:num_pages)
    try {
        next_page = end + 1
        next_page = (end==num_pages?get_another_volume_link(1):location.href.replace(exp_page,'$1'+next_page))
    } catch(err) { next_page = 'javascript:alert("Cannot find next_page")' }
    try {
        prev_page = start - AUTOLOAD_PAGE_COUNT
        prev_page = (prev_page<=0?get_another_volume_link(-1):location.href.replace(exp_page,'$1'+prev_page))
    } catch(err) { prev_page = 'javascript:alert("Cannot find prev_page")' }

    // Generate results
    var newChild = document.createElement('div')
    var d=document.createDocumentFragment()
    for(start = start - 1; start < end; start++)
    {
        var img = new Image()
        img.src = pics[start]
        if(start==end-1) // last img
        {
            add_mouse_event_for_navigation(img, next_page)
            d.appendChild(img)
        }
        else
        {
            d.appendChild(img)
            d.appendChild(document.createElement('hr'))
        }
    }

    var prevlink_node = document.createElement('A')
    prevlink_node.appendChild(document.createTextNode('Prev'))
    prevlink_node.href = prev_page
    d.appendChild(prevlink_node)

    var nextlink_node = document.createElement('A')
    nextlink_node.appendChild(document.createTextNode('Next'))
    nextlink_node.href = next_page
    d.appendChild(nextlink_node)

    newChild.appendChild(d)

    document.body.appendChild(newChild) // replacing body with head breaks the script, but why?
}

var reload_pics = function()
{
    // Save start_el.value before removing all elements
    var start_el_value
    try { start_el_value = document.getElementById('start_el').value }
    catch(e) { start_el_value = 0 }

    // Remove all elements
    document.documentElement.innerHTML = ''

    // Restore start_el.value
    var start_el = document.createElement('INPUT')
    start_el.id = 'start_el'
    start_el.value = start_el_value
    document.head.appendChild(start_el)

    // Calculate indices
    var start = document.getElementById('start_el').value
    if(start < 0) { start = 0 }
    else if(start >= pics.length) { start = pics.length }
    alert(start)

    var end = start + AUTOLOAD_PAGE_COUNT - 1
    if(end < 0) { end = 0 }
    else if(end >= pics.length) { end = pics.length - 1 }

    var next_start = end + 1
    if(next_start < 0) { next_start = 0 }
    else if(next_start >= pics.length) { next_start = pics.length - 1 }
    alert(end)

    start_el.value = next_start
    document.body.addEventListener('keydown', function(evt) { if(evt.keyCode == 13) { reload_pics() } }, true)
    alert(next_start)

    // Generate results
    var d = document.createDocumentFragment()
    for(var i=start; i<=end; i++)
    {
        var img = new Image()
        img.src = pics[i]
        d.appendChild(img)
        d.appendChild(document.createElement('HR'))
    }
    document.body.appendChild(d) // replacing body with head breaks the script, but why?
}

var alphanum = function(a, b) { // natural sorting algorithm from http://my.opera.com/GreyWyvern/blog/show.dml/1671288
    function chunkify(t) {
        var tz = [], x = 0, y = -1, n = 0, i, j
        while(i = (j = t.charAt(x++)).charCodeAt(0)) {
            var m = (i == 46 || (i >=48 && i <= 57))
            if(m != n) {
                tz[++y] = ""
                n = m
            }
            tz[y] += j
        }
        return tz
    }
    var aa = chunkify(a)
    var bb = chunkify(b)
    for(x = 0; aa[x] && bb[x]; x++) {
        if(aa[x] != bb[x]) {
            var c = Number(aa[x]), d = Number(bb[x])
            if(c == aa[x] && d == bb[x]) {
                return c - d
            } else return (aa[x] > bb[x]) ? 1 : -1
        }
    }
    return aa.length - bb.length
}

var get_another_volume_link = function(offset)
{
    var xmlhttp=new XMLHttpRequest()
    xmlhttp.onreadystatechange=function() { if(xmlhttp.readyState==4 && xmlhttp.status==200) { act_on_response(xmlhttp.responseText, offset) } }
    xmlhttp.open("GET", comic_home_url, false)
    xmlhttp.send()
    if(!another_volume_link) { alert('another_volume_link is null'); return }
    return another_volume_link
}

var get_matched_strings = function(exp_vol_lnks, groups, response)
{
    var a = new Array(), p
    if(PRINT_MATCHED_STRINGS == 1) { var tmp = ''; while(p = exp_vol_lnks.exec(response)) { tmp += p + '\n------\n' }; alert(tmp); return }
    while(p = exp_vol_lnks.exec(response)) { if(p != null) { for(var i=0; i<groups.length; i++) { if(typeof p[groups[i]] != 'undefined') { a.push(p[groups[i]]); break } } } }
    if(a.length == 0) { alert('Error on parsing response'); return }
    a.sort(function(a,b) {return alphanum(a, b)})
    for(var i=a.length-1; i>0; i--) { if(a[i] == a[i-1]) { a.splice(i, 1) } } // remove duplicates
    return a
}

var get_origin = function(url) { var m=url.match(/^https?:\/\/[^\/]+/); return m?m[0]:null; }

var goto_first_volume = function(comic_home_url, same_lnks, act_on_response)
{
    // change the text color of same_lnks to indicate it's been visited
    for(var i=0; i<same_lnks.length; i++) { if(same_lnks[i].href==comic_home_url) { same_lnks[i].style = "color: #39f" } }

    // get the url of the first volume of comic_home_url, and open that url in a new tab
    var xmlhttp=new XMLHttpRequest()
    xmlhttp.onreadystatechange=function() { if(xmlhttp.readyState==4 && xmlhttp.status==200) { act_on_response(xmlhttp.responseText) } }
    xmlhttp.open("GET", comic_home_url, false)
    xmlhttp.send()

    if(!first_volume_page) { alert('first_volume_page is null'); return }
    var first_volume_link = (/^https?:\/\//.test(first_volume_page)?first_volume_page:get_origin(comic_home_url)+(first_volume_page.indexOf('/')==0?'':'/')+first_volume_page)
    window.open(first_volume_link, '_blank')
}

var nocss = function() {
    for(var i=css=0;css=document.styleSheets[i];++i) { css.disabled=true; }
    var all=document.getElementsByTagName('*')
    for(var i=all.length;i>0;i--) {
        var e=all[i-1]
        e.style.cssText=''
        if(e.nodeName=='STYLE'&&e.parentNode) {
            e.parentNode.removeChild(e)
        }
        else {
            e.style=''
        }
    }
}

var print_wnd_props = function(wnd)
{
    if(PRINT_WND_PROPS)
    {
        var all=''
        for(var prop in wnd) {
            if(wnd.hasOwnProperty(prop)) {
                all = all + prop + ' <br> '+ wnd[prop] + '<br><br><br>' + Array(340).join("-") + '<br><br><br>'
            }
        }
        document.documentElement.innerHTML = all
        throw 'exit'
    }
}

var pretty_alert = function(arr) { var t = ''; for(var i=0; i<arr.length; i++) { t = t + arr[i].toString() + '\n'; }; alert(t) }

var resize_imgs = function() {
    var w = GM_getValue('IMG_WIDTH', IMG_WIDTH)
    if(w>=16) { for(var i=(imgs=document.getElementsByTagName('IMG')).length;i>0;i--) { imgs[i-1].width=w } }
    else { for(var i=(imgs=document.getElementsByTagName('IMG')).length;i>0;i--) { imgs[i-1].width*=w } }
}

var origin = get_origin(location.href)

// 8comic and the likes
if( /\b(((2|6|8)comic)|comicvip)\b/.test(location.href) )
{
    var exp_vol_lnks = new RegExp("cview\\(.*?\\)", "g")
    var groups = [0]

    var cview = function cview(url,catid) // adapted from http://www.8comic.com/js/comicview.js
    {
        var baseurl=""
        if( catid==4  || catid==6  || catid==12 || catid==22                           ) baseurl="http://new.comicvip.com/show/cool-"
        if( catid==1  || catid==17 || catid==19 || catid==21                           ) baseurl="http://new.comicvip.com/show/cool-"
        if( catid==2  || catid==5  || catid==7  || catid==9                            ) baseurl="http://new.comicvip.com/show/cool-"
        if( catid==10 || catid==11 || catid==13 || catid==14                           ) baseurl="http://new.comicvip.com/show/best-manga-"
        if( catid==3  || catid==8  || catid==15 || catid==16 || catid==18 || catid==20 ) baseurl="http://new.comicvip.com/show/best-manga-"
        url=url.replace(".html","").replace("-",".html?ch=")
        return baseurl + url
    }

    if(location.href == (origin + '/'))
    {
        if(/\b2comic\b/.test(location.href)) { throw 'exit' }

        var act_on_response = function(response)
        {
            var comiclist = get_matched_strings(exp_vol_lnks, groups, response)
            if(!comiclist) { alert('Error on parsing comiclist'); return }
            first_volume_page = eval(comiclist[0])
        }
        var imglnks = $$('table#hotcomicpic_dl>tbody>tr>td>a>img.imgbordery'), same_lnks = $$('table#hotcomicpic_dl>tbody>tr>td>a:not(:first-child)')
        add_first_volume_links(imglnks, same_lnks, act_on_response)

        var exp_vol_lnks = new RegExp("href=['\"](/comic/readmanga_.*?)['\"]", "g")
        var groups = [1]
        var act_on_response = function(response)
        {
            var comiclist = get_matched_strings(exp_vol_lnks, groups, response)
            if(!comiclist) { alert('Error on parsing comiclist'); return }
            first_volume_page = comiclist[0]
        }
        var imglnks = $$('table#update_dl>tbody>tr>td>a>img.ibg'), same_lnks = $$('a.comic')
        add_first_volume_links(imglnks, same_lnks, act_on_response)

        throw 'exit'
    }

    var wnd = typeof unsafeWindow == 'undefined' ? window : unsafeWindow
    print_wnd_props(wnd)

    var current_url=location.href
    if(!/-\d+$/.test(current_url)) { current_url+='-1' }
    if(location.href!=current_url) { location.href=current_url; throw 'exit' }
    var current_page = parseInt(/-(\d+)$/.exec(location.href)[1])

    var comic_home_url = /(\d+\.html)/.exec(location.href)[1]
    comic_home_url = 'http://www.8comic.com/html/' + comic_home_url

    var pics = []
    if(typeof wnd.ch != 'undefined' && typeof wnd.chs != 'undefined' && typeof wnd.itemid != 'undefined') {
        var p = 1
        var ch = wnd.ch
        var codes
        if(typeof wnd.allcodes != 'undefined') { codes = wnd.allcodes.split('|') }
        else
        {
            var act_on_response = function(response)
            {
                var exp_codes = new RegExp('var codes ?=(.*?);', 'g')
                codes = eval(get_matched_strings(exp_codes, [1], response)[0])
            }
            var xmlhttp=new XMLHttpRequest()
            xmlhttp.onreadystatechange=function() { if(xmlhttp.readyState==4 && xmlhttp.status==200) { act_on_response(xmlhttp.responseText) } }
            xmlhttp.open("GET", location.href, false)
            xmlhttp.send()
        }
        var chs = wnd.chs
        var itemid = wnd.itemid
        var host = wnd.location.host.split(".").slice(-2).join(".")
        host = host.replace('2comic','8comic').replace('6comic','8comic').replace('comicvip','8comic')
        var code = ""
        var cid = 0
        for(var i = 0, len = codes.length; i < len; i++) {
            if(codes[i].indexOf(ch + " ") == 0) {
                cid = i
                code = codes[i]
                break
            }
        }
        if(code == "") {
            for(var i = 0, len = codes.length; i < len; i++) {
                if(parseInt(codes[i].split(" ")[0], 10) > ch) {
                    cid = i
                    code = codes[i]
                    ch = parseInt(codes[i].split(" ")[0], 10)
                    break
                }
            }
        }
        if(code == "") {
            cid = codes.length - 1
            code = codes[cid]
            ch = chs
        }

        var code_ = code.split(" ")
        var num = code_[0], sid = code_[1], did = code_[2], page = code_[3], code = code_[4]

        //var newChild = document.createElement("div")
        for(; p <= page; p++) {
            var m = (parseInt((p - 1) / 10, 10) % 10) + (((p - 1) % 10) * 3)
            var img_name = ("00" + p).substr(-3) + "_" + code.substring(m, m + 3)
            //var img = new Image()
            pics.push("http://img" + sid + "." + host + "/" + did + "/" + itemid + "/" + num + "/" + img_name + ".jpg")
        }
    }
    else
    {
        // http://userscripts.org:8080/scripts/review/135690
        var ti = wnd.ti
        var f = wnd.f
        var pi = wnd.pi
        var ni = wnd.ni
        var c = wnd.c
        var ci = wnd.ci
        var ps = wnd.ps
        var ss = wnd.ss
        var nn = wnd.nn
        var mm = wnd.mm
        var si = function(c, p) { return 'http://img' + ss(c, 4, 2) + '.8comic.com/' + ss(c, 6, 1) + '/' + ti + '/' + ss(c, 0, 4) + '/' + nn(p) + '_' + ss(c, mm(p) + 10, 3, f) + '.jpg'; }
        for( var p = 1; p <= ps; ++p ) { pics[p - 1] = si(c, p); }
    }

    // re-define get_another_volume_link() to prevent it from using act_on_response
    // as XMLHttpRequest doesn't not work due to same origin policy (www.(2|6|8)comic.com != new.comicvip.com)
    var get_another_volume_link = function(offset)
    {
        var another_volume_id = (parseInt(location.href.replace(/.*ch=(-?\d+).*/,'$1')) + parseInt(offset)).toString()
        var another_volume_link = location.href.replace(/(.*ch=)-?\d+.*/,'$1'+another_volume_id+'-1')
        return another_volume_link
    }

    add_pics(/(\?ch=-?\d+-)\d+/, pics)
    add_key_event_for_turning_to_specific_page(/(\?ch=-?\d+-)\d+/)
    add_key_event_for_navigation(next_page, prev_page)
    add_key_event_for_changing_resizing_factor()
    nocss()
    resize_imgs()
}

else if( /\bdmzj\b/.test(location.href) )
{
    var exp_vol_lnks = new RegExp('<li><a +title="[^"]*" +href="(/[^/]+?/[^/]+?.shtml)".*</a></li>', "g")
    var groups = [1]

    if(location.href == (origin + '/'))
    {
        var act_on_response = function(response)
        {
            var comiclist = get_matched_strings(exp_vol_lnks, groups, response)
            if(!comiclist) { alert('Error on parsing comiclist'); return }
            first_volume_page = comiclist[0]
        }
        var imglnks = $$('div.tcaricature_block.tcaricature_block2>ul>li>a>img'), same_lnks = $$('div.tcaricature_block.tcaricature_block2>ul>li>a')
        add_first_volume_links(imglnks, same_lnks, act_on_response)

        throw 'exit'
    }

    var wnd = typeof unsafeWindow == 'undefined' ? window : unsafeWindow
    print_wnd_props(wnd)

    var current_url=location.href
    if(!/-(\d+)\.shtml/.exec(current_url)) { current_url = current_url.replace(/(.*)\.shtml/,'$1-1.shtml') }
    if(location.href != current_url) { location.href = current_url; throw 'exit' }
    var current_page = parseInt(/-(\d+)\.shtml/.exec(current_url)[1])

    var comic_home_url = /(.*\/)[^\/]+\.shtml/.exec(location.href)[1]

    var pics = []
    for(var i = 0; i<wnd.arr_pages.length; i++) { pics.push(wnd.img_prefix + wnd.arr_pages[i]) }

    var act_on_response = function(response, offset)
    {
        var comiclist = get_matched_strings(exp_vol_lnks, groups, response)
        if(!comiclist) { alert('Error on parsing comiclist'); return }

        if(!/^https?:\/\//.test(comiclist[0])) { for(var i=0; i<comiclist.length; i++) { comiclist[i] = origin + comiclist[i]; } }
        var tmp_current_url = location.href
        tmp_current_url = (comiclist[0].indexOf('-')==-1?tmp_current_url.replace(/-\d+/,''):tmp_current_url)
        comiclist.push(tmp_current_url)
        comiclist.sort(function(a,b) {return alphanum(a, b)})
        for(var i=comiclist.length-1; i>0; i--) { if(comiclist[i] == comiclist[i-1]) { comiclist.splice(i, 1) } } // remove duplicates

        another_volume_link = comiclist[comiclist.indexOf(tmp_current_url) + parseInt(offset)]
        if(typeof another_volume_link == 'undefined') { another_volume_link = 'javascript:alert("指定的話數不存在")' }
    }

    add_pics(/(-)\d+/, pics)
    add_key_event_for_turning_to_specific_page(/(-)\d+/)
    add_key_event_for_navigation(next_page, prev_page)
    add_key_event_for_changing_resizing_factor()
    nocss()
    resize_imgs()
}

else // 99 and the likes
{
    var p1 = /href=['"](http:\/\/[^'"]+\/[^'"]+\/\d+\/\d+\/)['"]/g
    var p2 = /href=(\/[^\/]+\/[^\/]*\d+\/[^\/]*\d+\.htm\?s=\d+)/g
    var p3 = /href=['"](\/[^'"]+\/\d+[a-zA-Z]\d+\/)['"]/g

    if(/\b1mh\./.test(origin)) // the domain is currently not related to manga
    {
        throw 'exit'
    }
    else if(/\b3gmanhua\./.test(origin)) // can't find the manga resources
    {
        throw 'exit'
    }
    else if(/\bmh\.99770\./.test(origin)) // href='http://mh.99770.cc/comic/19907/138793/'
    {
        var exp_vol_lnks = p1, groups = [1]
        var imglnks = $$('a.image_link>img'), same_lnks = $$('div.cTitle>a')
    }
    else if(/\b99770\./.test(origin)) // href=/manhua/18107/138801.htm?s=7
    {
        var exp_vol_lnks = p2, groups = [1]
        var imglnks = $$('div#in11>a>img'), same_lnks = $$('a.link01')
    }
    else if(/\bwww\.99comic\./.test(origin)) // href='/comics/2779o138098/'
    {
        var exp_vol_lnks = p3, groups = [1]
        var imglnks = $$('a.image_link>img'), same_lnks = $$('div.cTitle>a')
    }
    else if(/\b99comic\./.test(origin)) // href=/manhua/993902/list_91215.htm?s=2
    {
        var exp_vol_lnks = p2, groups = [1]
        var imglnks = $$('div#in11>a>img'), same_lnks = $$('a.link01')
    }
    else if(/\bdm\.99manga\./.test(origin)) // href='http://dm.99manga.com/comic/19915/138815/'
    {
        var exp_vol_lnks = p1, groups = [1]
        var imglnks = $$('a.image_link>img'), same_lnks = $$('dt.cCDL2>a')
    }
    else if(/\b99manga\./.test(origin)) // href=/page/18107/138801.htm?s=7
    {
        var exp_vol_lnks = p2, groups = [1]
        var imglnks = $$('div[class^="repl"]>table>tbody>tr>td>a>img'), same_lnks = $$('a.link01')
    }
    else if(/\b99mh\./.test(origin)) // href='http://99mh.com/comic/15488/120147/'
    {
        var exp_vol_lnks = p1, groups = [1]
        var imglnks = $$('a.image_link>img'), same_lnks = $$('dt.cCDL2>a')
    }
    else if(/\bwww\.cococomic\./.test(origin)) // href='http://www.cococomic.com/comic/19009/134387/'
    {
        var exp_vol_lnks = p1, groups = [1]
        var imglnks = $$('a.image_link>img'), same_lnks = $$('div.cTitle>a')
    }
    else if(/\bcococomic\./.test(origin)) // href=/coco/18107/138751.htm?s=7
    {
        var exp_vol_lnks = p2, groups = [1]
        var imglnks = $$('ul#hots1.bl>li>div>a>img:last-child'), same_lnks = $$('a')
    }
    else if(/\bdmeden\./.test(origin)) // href='/comic/checkview.aspx?ID=130223&s=7'
    {
        throw 'exit' // 無法取得圖像的網址資料
    }
    else if(/\bwww\.hhcomic\./.test(origin)) // href=/page/1819912/138812.htm?s=3
    {
        var exp_vol_lnks = p2, groups = [1]
        var imglnks = $$('div#in11>a>img'), same_lnks = $$('a.link01')
    }
    else if(/\bhhcomic\./.test(origin)) // href=/hhpage/1812452/hh138823.htm?s=8
    {
        var exp_vol_lnks = p2, groups = [1]
        var imglnks = $$('div#in11>a>img'), same_lnks = $$('a.link01')
    }
    else if(/\bhhmanhua\./.test(origin)) // href=/hhpage/hu17188/138836.htm?s=10
    {
        var exp_vol_lnks = p2, groups = [1]
        var imglnks = $$('div#in11>a>img'), same_lnks = $$('a.link01')
    }
    else if(/\bjmydm\./.test(origin)) // href='/comicdir/219622/'
    {
        var exp_vol_lnks = /href=['"](\/comicdir\/\d+\/)['"]/g, groups = [1]
        var imglnks = $$('a.image_link>img'), same_lnks = $$('a')
    }
    else if(/\bjmymh\./.test(origin)) // href='/jmymhcomic/jmDCCD106941AF0B72/jv290C6F4FB76CF949/'
    {
        throw 'exit' // too lazy to fix the website
    }
    else
    {
        var exp_vol_lnks = new RegExp("href=['\"]?((/[^'\" ]*?((/\\d+[/a-zA-Z][^'\" ]*?\\d+[^'\" ]*?)|(\\?ID=\\d+[^'\" ]*?)))|(https?://.*?/\\d+/\\d+/))['\" ]", "g")
        var groups = [2, 6]
    }

    //var exp_vol_lnks = new RegExp("2779o", "g")
    //var groups = [0]
    //var PRINT_MATCHED_STRINGS = 1

    if( location.href == (origin + '/') || /\blist\b\/0\/?/.test(location.href) )
    {
        var act_on_response = function(response)
        {
            var comiclist = get_matched_strings(exp_vol_lnks, groups, response)
            if(!comiclist) { alert('Error on parsing comiclist'); return }
            first_volume_page = comiclist[0]
        }
        add_first_volume_links(imglnks, same_lnks, act_on_response)
        throw 'exit'
    }

    var wnd = typeof unsafeWindow == 'undefined' ? window : unsafeWindow
    print_wnd_props(wnd)

    // s, v/p
    // 1. add if it doesn't exist
    // 2. move v or p to the end of the url
    var current_url=location.href
    if(!/\b[s]=([^&\*]+)/.exec(current_url)) { current_url = current_url + '?s=' + (typeof wnd.server!='undefined'?wnd.server:wnd.cuD) }
    var vp = /\b[vp]=([^&\*]+)/.exec(current_url)
    if(vp) { if(/\?.*\b[vp]=[^&\*]+[&\*]s=[^&\*]+/.test(current_url)) { current_url=current_url.replace(/(\?.*)(\b[vp]=[^&\*]+)([&\*])(s=[^&\*]+)/,'$1$4$3$2') } }
    else { if(current_url.indexOf("?") != -1) { if(typeof wnd.server!='undefined' && !/https?:\/\/www\.cococomic\.com\b/.test(current_url)) { current_url=current_url+'*v=1' } else { current_url=current_url+'&p=1' } } }
    if(location.href != current_url) { location.href = current_url; throw 'exit' }
    var current_page = parseInt(vp[1])

    var exp_comic_id = /[^\/]\/[a-zA-Z]*?(\d+)/
    var comic_id = exp_comic_id.exec(location.href); if(comic_id == null) { alert('Error on parsing comic_id'); throw 'exit' }; comic_id=comic_id[1]
    var comic_dir = '/comic/'
    if(/^https?:\/\/1mh\.com\b/.test(origin))
    {
        comic_dir='/mh/'
        comic_id='mh'+comic_id
    }
    else if(/\bwww\.99comic\.com\b/.test(origin))
    {
        comic_id='99'+comic_id
    }
    else if(/\bhhmanhua\.com\b/.test(origin))
    {
        comic_dir='/manhua/'
        comic_id='hu'+comic_id
    }
    else if(/\bjmydm\.com\b/.test(origin))
    {
        comic_dir=''
        comic_id=''
        try
        {
            comic_dir=/href=['"](\/manhua-[^\/]+\/)['"]><span/.exec(document.documentElement.innerHTML)[1]
        }
        catch(err)
        {
            alert('Cannot find comic_dir')
        }
    }
    var comic_home_url = origin + comic_dir + comic_id + '/'

    var pics = []
    if( typeof wnd.arrPicListUrls != 'undefined' ) { pics = wnd.arrPicListUrls }
    else if( typeof wnd.arrPicListUrl != 'undefined' ) { pics = wnd.arrPicListUrl }
    else if( typeof wnd.arrFiles != 'undefined' ) { pics = wnd.arrFiles }
    else if( typeof wnd.arrPicListUrl != 'undefined' ) { pics = wnd.arrPicListUrl }
    else if( typeof wnd.arrFiles != 'undefined' ) { pics = wnd.arrFiles }
    else if( typeof wnd.arrImgListUrl != 'undefined' ) { pics = wnd.arrImgListUrl }
    else if( typeof wnd.arrPicListUsl != 'undefined' ) { pics = wnd.arrPicListUsl }
    else if( typeof wnd.arrPicListVrl != 'undefined' ) { pics = wnd.arrPicListVrl }
    else if( typeof wnd.arrPicLlstUrl != 'undefined' ) { pics = wnd.arrPicLlstUrl }
    else { alert( "無法取得圖像的網址資料" ); throw 'exit' }
    var server; if(wnd.server) { server=wnd.ServerList[wnd.server-1] } else { server=wnd.getSLUrl(wnd.cuD) }
    for(var i=0; i<pics.length; i++)
    {
        if(/\b99mh\.com\b/.test(origin) || /\bjmydm\.com\b/.test(origin) || /\bdm\.99manga\b/.test(origin))
        {
            pics[i] = server + (typeof wnd.sPath != 'undefined'?wnd.sPath:'') + pics[i]
        }
        else
        {
            pics[i] = server + pics[i]
        }
    }

    var act_on_response = function(response, offset)
    {
        var comiclist = get_matched_strings(exp_vol_lnks, groups, response)
        if(!comiclist) { alert('Error on parsing comiclist'); return }
        if(!/^https?:\/\//.test(comiclist[0])) { for(var i=0; i<comiclist.length; i++) { comiclist[i] = origin + comiclist[i]; } }

        var tmp_current_url = location.href
        tmp_current_url = (comiclist[0].indexOf('?')==-1?tmp_current_url.replace(/\?.*/,''):tmp_current_url)
        tmp_current_url = (comiclist[0].indexOf('*v')==-1?tmp_current_url.replace(/\*v.*/,''):tmp_current_url)
        tmp_current_url = (comiclist[0].indexOf('&p')==-1?tmp_current_url.replace(/&p.*/,''):tmp_current_url)
        comiclist.push(tmp_current_url)
        comiclist.sort(function(a,b) {return alphanum(a, b)})
        for(var i=comiclist.length-1; i>0; i--) { if(comiclist[i] == comiclist[i-1]) { comiclist.splice(i, 1) } } // remove duplicates
        another_volume_link = comiclist[comiclist.indexOf(tmp_current_url) + parseInt(offset)]
        if(typeof another_volume_link == 'undefined') { another_volume_link = 'javascript:alert("指定的話數不存在")' }
    }

    add_pics(/\b([vp]=)[^&\*]+/, pics)
    add_key_event_for_turning_to_specific_page(/\b([vp]=)[^&\*]+/)
    add_key_event_for_navigation(next_page, prev_page)
    add_key_event_for_changing_resizing_factor()
    nocss()
    resize_imgs()
}
