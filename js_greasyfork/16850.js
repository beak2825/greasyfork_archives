// ==UserScript==
// @name        HV - Clean Forum Contents
// @grant       none
// @include     /^https?://forums\.e-hentai\.org\/index\.php\?.*\bshowtopic=.*/
// @include     /^https?://forums\.e-hentai\.org/index\.php\?.*\bresult_type=posts/
// @include     /^https?://forums\.e-hentai\.org\/index\.php\?act=([Pp]ost|ST|Msg)&/
// @include     /^https?://forums\.e-hentai\.org\/index\.php\?showuser=.*/
// @include     /^https?://forums\.e-hentai\.org\/index\.php\?showforum=.*/
// @include     http://hentaiverse.org/?s=Bazaar&ss=mm*
// @include     http://g.e-hentai.org/bounty.php?bid=*
// @version 0.0.1.20180326024547
// @namespace https://greasyfork.org/users/2233
// @description E-H Forums Tweaks
// @downloadURL https://update.greasyfork.org/scripts/16850/HV%20-%20Clean%20Forum%20Contents.user.js
// @updateURL https://update.greasyfork.org/scripts/16850/HV%20-%20Clean%20Forum%20Contents.meta.js
// ==/UserScript==

var wnd = window
var doc = wnd.document
var loc = wnd.location
var href = loc.href

var $  = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelector(css) }
var $$ = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelectorAll(css) }

/*** Settings ***/

// For forums
var hide_pinned_threads = true
var hide_unread_imgs = true
var hide_closed_shops = true
var highlight_auctions = true
var highlight_shop_owners = true
var hide_top_area = true
var hide_bottom_area = true
var hide_last_posts = true
if(typeof wnd.do_not_hide == 'undefined') {
    var do_not_hide = [ // user IDs
        0,
    ]
} else { var do_not_hide = wnd.do_not_hide }
if(typeof wnd.wts_shop_owners_to_highlight == 'undefined') {
    var wts_shop_owners_to_highlight = [ // user IDs
        0,
    ]
} else { var wts_shop_owners_to_highlight = wnd.wts_shop_owners_to_highlight }
if(typeof wnd.wtb_shop_owners_to_highlight == 'undefined') {
    var wtb_shop_owners_to_highlight = [ // user IDs
        0,
    ]
} else { var wtb_shop_owners_to_highlight = wnd.wtb_shop_owners_to_highlight }
if(typeof wnd.wts_thread_blist == 'undefined') {
    var wts_thread_blist = [ // thread IDs
        0,
    ]
} else { var wts_thread_blist = wnd.wts_thread_blist }
if(typeof wnd.wtb_thread_blist == 'undefined') {
    var wtb_thread_blist = [ // thread IDs
        0,
    ]
} else { var wtb_thread_blist = wnd.wtb_thread_blist }
if(typeof wnd.chat_thread_wlist == 'undefined') {
    var chat_thread_wlist = [ // thread IDs
        0,
    ]
} else { var chat_thread_wlist = wnd.chat_thread_wlist }
if(typeof wnd.user_blist == 'undefined') {
    var user_blist = [ // user IDs
        0,
    ]
} else { var user_blist = wnd.user_blist }
if(typeof wnd.user_blist_wts == 'undefined') {
    var user_blist_wts = [ // user IDs
        0,
    ]
} else { var user_blist_wts = wnd.user_blist_wts }
if(typeof wnd.user_blist_wtb == 'undefined') {
    var user_blist_wtb = [ // user IDs
        0,
    ]
} else { var user_blist_wtb = wnd.user_blist_wtb }
if(typeof wnd.uname_blist == 'undefined') {
    var uname_blist = [ // hide quotes by username (string)
        '',
    ]
} else { var uname_blist = wnd.uname_blist }

// For posts
var hide_emotes = [
    /\bstyle_emoticons\//,
    /\/folder_post_icons\//,
    /\/ehgt\/cm\//,
]
var hide_cutie_marks = true
var hide_post_count = true
var hide_warn_levels = true
var dup_edit_time = true
if(typeof wnd.uid_blist == 'undefined') {
    var uid_blist = [ // hide posts by uid (integer)
        0,
    ]
} else { var uid_blist = wnd.uid_blist }
if(typeof wnd.dont_clean == 'undefined') {
    var dont_clean = [ // topic id
        0,
    ]
} else { var dont_clean = wnd.dont_clean }
if(typeof wnd.uname_blist_bounty == 'undefined') {
    var uname_blist_bounty = [ // username
        '',
    ]
} else { var uname_blist_bounty = wnd.uname_blist_bounty }

/*** End of Settings ***/

/*** The BWList script ***/

var showforum = href.match(/showforum=(\d+)/)
if(!showforum) { showforum = href.match(/&?\bf=(\d+)/) }
if(showforum) {
    showforum = showforum[1]

    // Hide unread imgs
    if(hide_unread_imgs) {
        var imgs = $$('img[src="style_images/ambience/newpost.gif"]')
        for(var i=0, len=imgs.length; i<len; i++) { imgs[i].style.display = 'none' }
        var imgs = $$('img[src="style_images/fusion/newpost.gif"]')
        for(var i=0, len=imgs.length; i<len; i++) { imgs[i].style.display = 'none' }
    }

    // Hide closed shops
    if(hide_closed_shops) {
        if(showforum == '77' || showforum == '78') {
            var lnks = $$('td.row1 > div > span > a[id^="tid-link-"]')
            //var closed_patterns = /\b(close|closed|complete|(delete|del\b)|done|end|none|nothing|shut|sorry)/i
            var closed_patterns = /\b(close|closed|complete|(delete|del\b)|done|end|none|nothing|shut|sorry|auction|lottery|lotto|event)/i
            for(var i=0, len=lnks.length; i<len; i++) {
                if((!/&st=/.test(href)) || (/&st=0/.test(href))) { // (probably) on the first page
                    if(/\b(auction|lottery|lotto|event)\b/i.test(lnks[i].textContent)) { continue }
                }
                var owner = $(lnks[i].parentNode.parentNode.parentNode.parentNode, 'td.row2 > a[href*="showuser"]')
                if(do_not_hide.indexOf(parseInt(owner.href.match(/showuser=(\d+)/)[1])) != -1){ continue }
                if(closed_patterns.test(lnks[i].textContent)) {
                    lnks[i].parentNode.parentNode.parentNode.parentNode.style.display = 'none'
                    continue
                }
                var desc = $(lnks[i].parentNode.parentNode, 'span#tid-desc-'+lnks[i].id.match(/(\d+)/)[1])
                if(closed_patterns.test(desc.textContent)) {
                    desc.parentNode.parentNode.parentNode.parentNode.style.display = 'none'
                    continue
                }
            }
        }
    }

    // Highlight auctions
    if(highlight_auctions) {
        if(showforum == '77') {
            var lnks = $$('td.row1 > div > span > a[id^="tid-link-"]')
            for(var i=0, len=lnks.length; i<len; i++) {
                if(/\b(auction|lottery|lotto|event)\b/i.test(lnks[i].textContent)) {
                    var owner = $(lnks[i].parentNode.parentNode.parentNode.parentNode, 'td.row2 > a[href*="showuser"]')
                    if(owner.style.color == '') { owner.style.color = 'blue'}
                }
            }
        }
    }

    // Highlight shop owners
    if(highlight_shop_owners) {
        var fav = []
        if(showforum == '77') { fav = wts_shop_owners_to_highlight } // WTS
        else if(showforum == '78') { fav = wtb_shop_owners_to_highlight } // WTB
        var owner = $$('td.row2 > a[href*="showuser"]')
        for(var i=0, len=owner.length; i<len; i++) {
            //if((fav.indexOf(owner[i].textContent) != -1) && (owner[i].style.color == '')) { owner[i].style.color = 'red' }
            for(var j=0, len_j=fav.length; j<len_j; j++) {
                if((new RegExp('showuser='+fav[j]+'\\b').test(owner[i].href)) && (owner[i].style.color == '')) {
                    owner[i].style.color = 'red'
                    break
                }
            }
        }
    }

    // Hide specified forum threads
    var thread_blist = thread_wlist = []
    if(showforum == '76')      { thread_wlist = chat_thread_wlist } // Chat
    else if(showforum == '77') { thread_blist = wts_thread_blist } // WTS
    else if(showforum == '78') { thread_blist = wtb_thread_blist } // WTB
    if(thread_blist.length) {
        for(var i=0, len=thread_blist.length; i<len; i++) {
            try { $('#tid-link-'+thread_blist[i]).parentNode.parentNode.parentNode.parentNode.style.display = 'none' } catch(e) {}
        }
    }
    else if(thread_wlist.length) {
        var lnks = $$('td.row1 > div > span > a[id^="tid-link-"]')
        for(var i=0, len=lnks.length; i<len; i++) {
            if(!/^tid-link-/.test(lnks[i].id)) { continue }
            var tid = parseInt(lnks[i].id.match(/tid-link-(\d+)/)[1])
            if(thread_wlist.indexOf(tid)==-1) {
                try { lnks[i].parentNode.parentNode.parentNode.parentNode.style.display = 'none' } catch(e) {}
            }
        }
    }

    // Hide threads made by specific users on any subforums
    if(user_blist.length) {
        var users = $$('td.row2 > a[href*="showuser"]')
        for(var i=0, len=users.length; i<len; i++) {
            for(var j=0, len_j=user_blist.length; j<len_j; j++) {
                //if((new RegExp('showuser='+user_blist[j]+'\\b').test(users[i].href)) && (users[i].style.color == '')) {
                if(new RegExp('showuser='+user_blist[j]+'\\b').test(users[i].href)) {
                    //if(!/\bauction\b/i.test(users[i].parentNode.parentNode.querySelectorAll('.row1')[2].textContent)) {
                        //users[i].parentNode.parentNode.style.display = 'none'
                    //}
                    users[i].parentNode.parentNode.style.display = 'none'
                    break
                }
            }
        }
    }

    // Hide threads made by specific users on WTS
    if(user_blist_wts.length) {
        if(showforum == '77') {
            var users = $$('td.row2 > a[href*="showuser"]')
            for(var i=0, len=users.length; i<len; i++) {
                for(var j=0, len_j=user_blist_wts.length; j<len_j; j++) {
                    //if((new RegExp('showuser='+user_blist_wts[j]+'\\b').test(users[i].href)) && (users[i].style.color == '')) {
                    if(new RegExp('showuser='+user_blist_wts[j]+'\\b').test(users[i].href)) {
                        if(!/\bauction\b/i.test(users[i].parentNode.parentNode.querySelectorAll('.row1')[2].textContent)) {
                            users[i].parentNode.parentNode.style.display = 'none'
                        }
                        break
                    }
                }
            }
        }
    }

    // Hide threads made by specific users on WTB
    if(user_blist_wtb.length) {
        if(showforum == '78') {
            var users = $$('td.row2 > a[href*="showuser"]')
            for(var i=0, len=users.length; i<len; i++) {
                for(var j=0, len_j=user_blist_wtb.length; j<len_j; j++) {
                    //if((new RegExp('showuser='+user_blist_wtb[j]+'\\b').test(users[i].href)) && (users[i].style.color == '')) {
                    if(new RegExp('showuser='+user_blist_wtb[j]+'\\b').test(users[i].href)) {
                        if(!/\bauction\b/i.test(users[i].parentNode.parentNode.querySelectorAll('.row1')[2].textContent)) {
                            users[i].parentNode.parentNode.style.display = 'none'
                        }
                        break
                    }
                }
            }
        }
    }
}

/*** End of the BWList script ***/

if(/act=post/i.test(href)) {
    var ids = $$('.row2:first-child')
    for(var i=0, len=ids.length; i<len; i++) {
        if(uname_blist.indexOf(ids[i].textContent) != -1) {
            ids[i].parentNode.style.display = 'none'
            try { ids[i].parentNode.nextSibling.style.display = 'none' } catch(e) {}
            try { ids[i].parentNode.nextSibling.nextSibling.style.display = 'none' } catch(e) {}
        }
    }
}
else if(/:\/\/forums\./.test(href)) {
    if(/(showtopic=\d+)|(\bresult_type=posts)/.test(href)) {
        // Hide posts
        var hide_this = true
        if(/showtopic=\d+/.test(href) && (dont_clean.indexOf(parseInt(href.match(/showtopic=(\d+)/)[1])) != -1)) { hide_this = false }
        if(hide_this) {
            var borderwrap = $$('.borderwrap')
            for(var i=0, len=borderwrap.length; i<len; i++) {
                var is_post = ($(borderwrap[i], '.postcolor') != null)
                if(is_post) {
                    var uid = $(borderwrap[i], 'a[href^="http://forums.e-hentai.org/index.php?showuser="], a[href^="https://forums.e-hentai.org/index.php?showuser="]')
                    if(uid) {
                        uid = parseInt(uid.href.match(/\?showuser=(\d+)/)[1])
                        if(uid_blist.indexOf(uid) != -1) {
                            borderwrap[i].style.display = 'none'
                            try {
                                if(/(BR|TABLE)/.test(borderwrap[i].previousSibling.previousSibling.tagName)) {
                                    borderwrap[i].previousSibling.previousSibling.style.display = 'none'
                                }
                            } catch(e) {}
                            try {
                                if(borderwrap[i].previousSibling.previousSibling.previousSibling.tagName == 'BR') {
                                    borderwrap[i].previousSibling.previousSibling.previousSibling.style.display = 'none'
                                }
                            } catch(e) {}
                            try {
                                if(/(BR|TABLE)/.test(borderwrap[i].nextSibling.nextSibling.tagName)) {
                                    borderwrap[i].nextSibling.nextSibling.style.display = 'none'
                                }
                            } catch(e) {}
                            try {
                                if(borderwrap[i].nextSibling.nextSibling.nextSibling.tagName == 'BR') {
                                    borderwrap[i].nextSibling.nextSibling.nextSibling.style.display = 'none'
                                }
                            } catch(e) {}
                        }
                    }
                }
            }
        }
    }
    else if(/showforum=\d+/.test(href)) {
        if(hide_pinned_threads) {
            var divs = document.querySelectorAll('tr>td.row1>div')
            if(divs) {
                for(var i=divs.length-1; i>=0; i--) { if(/Pinned:/.test(divs[i].textContent)) { divs[i].parentNode.parentNode.style.display = 'none' } }
            }
        }
    }
}
else if(/&ss=mm$/.test(href) || /&filter=inbox/.test(href)) {
    var letters = $$('#mainpane tr[onclick]')
    for(var i=0, len=letters.length; i<len; i++) {
        if(uname_blist.indexOf(letters[i].querySelector('td').textContent) != -1) {
            letters[i].style.display = 'none'
        }
    }
}
else if(/\/bounty\.php\?bid=/.test(href)) {
    var unames = $$('.brw a')
    for(var i=0, len=unames.length; i<len; i++) {
        if(uname_blist_bounty.indexOf(unames[i].textContent) != -1) {
            unames[i].parentNode.parentNode.style.display = 'none'
        }
    }
}

// Hide quotes
if(/:\/\/forums\./.test(href)) {
    var p = new RegExp('^QUOTE\\((' + uname_blist.join('|') + ') @', 'i')
    var postcolor = $$('.postcolor')
    for(var i=0, len=postcolor.length; i<len; i++) {
        var quotetop = $$(postcolor[i], '.quotetop')
        for(var j=0, len2=quotetop.length; j<len2; j++) {
            if(p.test(quotetop[j].textContent)) {
                quotetop[j].style.display = 'none'
                try { quotetop[j].nextSibling.style.display = 'none' } catch(e) {}
                try { if(quotetop[j].nextSibling.nextSibling.tagName == 'BR') { quotetop[j].nextSibling.nextSibling.style.display = 'none' } } catch(e) {}
                try { if(quotetop[j].nextSibling.nextSibling.nextSibling.tagName == 'BR') { quotetop[j].nextSibling.nextSibling.nextSibling.style.display = 'none' } } catch(e) {}
                try { if(quotetop[j].nextSibling.nextSibling.nextSibling.nextSibling.tagName == 'BR') { quotetop[j].nextSibling.nextSibling.nextSibling.nextSibling.style.display = 'none' } } catch(e) {}
                try { if(quotetop[j].nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.tagName == 'BR') { quotetop[j].nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.style.display = 'none' } } catch(e) {}
            }
        }
    }
}

// Hide emotes
if(hide_emotes.length >= 1) {
    var imgs = $$('IMG')
    for(var i=imgs.length-1; i>=0; i--) {
        for(var a=0, len=hide_emotes.length; a<len; a++) {
            if(hide_emotes[a].test(imgs[i].src)) {
                imgs[i].style.display = 'none'
                break
            }
        }
    }
}

// Hide cutie marks
if(hide_cutie_marks) {
    if(/:\/\/forums\./.test(href)) {
        var div = $$('DIV[style*="url(http://forums.e-hentai.org/ehgt/cm/"], DIV[style*="url(https://forums.e-hentai.org/ehgt/cm/"]')
        for(var i=0, len=div.length; i<len; i++) { div[i].style.display = 'none' }
    }
}

// Hide post counts
if(hide_post_count) {
    if(/:\/\/forums\./.test(href)) {
        var a = $$('a[onclick^="link_to_post("]')
        for(var i=0, len=a.length; i<len; i++) { a[i].text = '#' }
    }
}

// Hide warn levels
if(hide_warn_levels) {
    if(/:\/\/forums\./.test(href)) {
        var w = $$('img[src*="style_images/ambience/warn"]')
        for(var i=0, len=w.length; i<len; i++) {
            w[i].style.display = 'none'
            try { w[i].previousSibling.textContent = '' } catch(e) {}
            try { w[i].previousSibling.previousSibling.textContent = '' } catch(e) {}
            try { w[i].previousSibling.previousSibling.previousSibling.textContent = '' } catch(e) {}
            try {
                var spacer = w[i].parentNode.parentNode.querySelectorAll('img[src*="style_images/ambience/spacer."]')
                for(var j=0, len2=spacer.length; j<len2; j++) {
                    spacer[j].style.display = 'none'
                }
            } catch(e) {}
        }
    }
}

// Duplicate last edit time to the top of a post
if(dup_edit_time) {
    if(/showtopic=\d+/.test(href) && !/&st=/.test(href)) {
        var posts = $$('*[id^="post-main-"]')
        for(var i=0, len=posts.length; i<len; i++) {
            var last_edit_time = 'N/A'
            var edit = $(posts[i], '.edit')
            if(edit) { last_edit_time = edit.textContent.match(/^This post has been edited by .*: (.*)/)[1] }
            posts[i].innerHTML = '<p>Last Edited: ' + last_edit_time + '</p><br>' + posts[i].innerHTML
        }
    }
}

// Hide top area
if(hide_top_area) {
    if(/(showtopic=\d+)|(\bresult_type=posts)/.test(href) && !/act=Msg/i.test(href)) {
        var hide_this = true
        var topic_id = href.match(/showtopic=(\d+)/)
        if(topic_id) { if(dont_clean.indexOf(parseInt(topic_id[1])) != -1) { hide_this = false } }
        if($('h3')) { hide_this = false }
        if(hide_this) {
            if(!/&st=/.test(href)) {
                try {
                    var e = $('.pagecurrent')
                    var e2 = e.parentNode.parentNode.parentNode.parentNode.parentNode
                    if(e2 && e2.className == 'ipbtable') { e2.style.display = 'none' }
                    else { e.parentNode.style.display = 'none' }
                } catch(e) {}
                try { $$('img[src$="style_images/ambience/cat_top_ls.gif"]')[1].parentNode.parentNode.parentNode.parentNode.parentNode.style.display = 'none' } catch(e) {}
                try { $('.subtitle').parentNode.style.display = 'none' } catch(e) {}
            }
            try { $('td[style*="background-image:url(style_images/ambience/header_eh_textbarbg.jpg)"]').parentNode.parentNode.parentNode.style.display = 'none' } catch(e) {}
            try { $('table.mainnav').style.display = 'none' } catch(e) {}
            try { $('img[src$="style_images/ambience/cat_top_ls.gif"]').parentNode.parentNode.parentNode.parentNode.parentNode.style.display = 'none' } catch(e) {}
            try { $('#userlinks').style.display = 'none' } catch(e) {}
            try { $('img[src$="style_images/ambience/ls_main_table_bottom.gif"]').parentNode.parentNode.parentNode.parentNode.parentNode.style.display = 'none' } catch(e) {}
            try { $('#navstrip').parentNode.style.display = 'none' } catch(e) {}
            try { $('img[src$="style_images/ambience/nav_m.gif"]').parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display = 'none' } catch(e) {}
        }
    }
}

// Hide bottom area
if(hide_bottom_area) {
    if(/:\/\/forums\./.test(href) && !/act=Msg/i.test(href)) {
        try { $('.borderwrap .formsubtitle').parentNode.style.display = 'none' } catch(e) {}
        try { $('.borderwrap .dropdown').parentNode.parentNode.parentNode.parentNode.style.display = 'none' } catch(e) {}
        try { $('.copyright').style.display = 'none' } catch(e) {}
        try { $$('img[src*="style_images/ambience/expand_main_table."]')[0].parentNode.parentNode.style.display = 'none' } catch(e) {}
        try { $$('img[src*="style_images/ambience/expand_main_table."]')[1].parentNode.parentNode.style.display = 'none' } catch(e) {}
    }
}

// Hide last posts
if(hide_last_posts) {
    if(/showforum=/.test(href)) {
        var f_hide_last_posts = function() {
            //var a = $$('span.lastaction a[href^="http://forums.e-hentai.org/index.php?showuser="], span.lastaction a[href^="https://forums.e-hentai.org/index.php?showuser="]')
            var a = $$('span.lastaction a[href$="&view=getlastpost"]')
            for(var i=0, len=a.length; i<len; i++) {
                var e = doc.createElement('a')
                e.text = 'Last'
                e.href = a[i].href
                a[i].parentNode.parentNode.appendChild(e)
                a[i].parentNode.parentNode.removeChild(a[i].parentNode)
            }
        }
        f_hide_last_posts()
        //setTimeout(f_hide_last_posts, 1000)
        //setTimeout(f_hide_last_posts, 2000)
        //setTimeout(f_hide_last_posts, 3000)
        //setTimeout(f_hide_last_posts, 4000)
        //setTimeout(f_hide_last_posts, 5000)
    }
}

// Hide user links in the "fo_fid" div
if(/showforum=/.test(href)) {
    var fid = ''
    try { var fid = href.match(/showforum=(\d+)/)[1] } catch(e) {}
    var e = $('#fo_' + fid)
    if(e) {
        var a = $$(e, 'a[href*="showuser="]')
        for(var i=0, len=a.length; i<len; i++) {
            a[i].style.display = 'none'
            //var uid = a[i].href.match(/showuser=(\d+)/)[1]
            //if((uname_blist.indexOf(a[i].text)!=-1) || (user_blist.indexOf(uid)!=-1)) {
                //a[i].style.display = 'none'
            //}
        }
    }
}
