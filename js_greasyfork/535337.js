// ==UserScript==
// @name         Enhancement and assistance script for LeakedMaster
// @namespace    https://leakedmaster.com/
// @version      1.4
// @description  Tailored enhancements for XenForo 2.3.3 on leakedmaster.com: dark mode, infinite scroll, highlighting, quick search, back-to-top, hide ads, keyboard nav, code-copy, inline images, collapse signatures, plus auto-refresh threads, relative timestamps, spoiler toggle, attachment collapse, user-filter, subforum jumper, quick-reply.
// @author       GinMan32
// @match        https://leakedmaster.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      leakedmaster.com
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535337/Enhancement%20and%20assistance%20script%20for%20LeakedMaster.user.js
// @updateURL https://update.greasyfork.org/scripts/535337/Enhancement%20and%20assistance%20script%20for%20LeakedMaster.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const $ = window.jQuery;
    if (!$) return;

    /* ---- Custom CSS ---- */
    GM_addStyle(`
        body { background: #121212 !important; color: #e0e0e0 !important; }
        a { color: #BB86FC !important; }
        .p-body { background: #1e1e1e !important; }
        .xf-enhance-highlight { background: #ffeb3b; color: #000; padding:0 2px; border-radius:2px; }
        .block--sidebar, .block--ad { display: none !important; }
        #xf-enhance-top { position: fixed; bottom: 20px; right: 20px; background: #BB86FC; color: #121212; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-weight: bold; z-index:99999; }
        .xf-copy-btn { margin-left: 8px; cursor: pointer; font-size: 0.9em; color: #ccc; }
        .xf-copy-btn:hover { color: #fff; }
        .xf-toggle-sig { display: block; cursor: pointer; margin-bottom: 8px; color: #888; }
        .xf-signature { overflow: hidden; max-height: 0; transition: max-height 0.3s ease; }
        .xf-signature.open { max-height: 500px; }
        .xf-collapsed { display: none !important; }
        .xf-spoiler { background: #333; color: #333; cursor: pointer; padding: 2px 4px; border-radius: 3px; }
        .xf-spoiler.revealed { color: #e0e0e0; }
        #xf-forum-jump { position: fixed; bottom: 20px; left: 20px; z-index: 99999; padding: 6px; background: #1e1e1e; border:1px solid #444; border-radius:4px; color:#e0e0e0; }
    `);

    /* Back to Top Button */
    const topBtn = $('<div id="xf-enhance-top">⇧ Top</div>').hide();
    $('body').append(topBtn);
    $(window).on('scroll', () => ($(window).scrollTop()>200)?topBtn.fadeIn():topBtn.fadeOut());
    topBtn.on('click', () => $('html,body').animate({scrollTop:0},300));

    /* Keyword Highlighting */
    const params = new URLSearchParams(window.location.search);
    const kw = params.get('keywords');
    if (kw) {
        const terms = kw.split(/\s+/).map(t=>t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
        const regex = new RegExp('('+terms.join('|')+')','gi');
        $('.structItem-title, .message-content').each(function(){
            $(this).html((_,html)=> html.replace(regex,'<span class="xf-enhance-highlight">$1</span>'));
        });
    }

    /* Infinite Scroll */
    const forumList = $('.structItem--thread').closest('.block-body');
    if (forumList.length) {
        let nextPage = $('.PageNav a:contains(Next)').attr('href');
        const loadMore = () => {
            if (!nextPage) return;
            GM_xmlhttpRequest({ method:'GET', url: nextPage, onload: res => {
                const temp = document.createElement('div'); temp.innerHTML = res.responseText;
                $(temp).find('.structItem--thread').appendTo(forumList);
                nextPage = $(temp).find('.PageNav a:contains(Next)').attr('href') || null;
                if (nextPage) $(window).on('scroll', scrollHandler);
            }});
        };
        const scrollHandler = () => { if ($(window).scrollTop()+$(window).height() > $(document).height()-200) { $(window).off('scroll', scrollHandler); loadMore(); }};
        $(window).on('scroll', scrollHandler);
    }

    /* Floating Quick Search */
    const searchBox = $(
        '<div style="position:fixed;top:10px;right:10px;z-index:99998;">'
      + '<input id="xf-enhance-search" placeholder="Search site..." style="padding:6px;border-radius:4px;border:1px solid #444;width:180px;background:#1e1e1e;color:#e0e0e0;"/>'
      + '</div>'
    );
    $('body').append(searchBox);
    $('#xf-enhance-search').on('keypress', e => {
        if (e.key==='Enter') {
            const q = $(e.target).val().trim();
            if (q) window.location.href = `/search/search?keywords=${encodeURIComponent(q)}&type=post`;
        }
    });

    /* Dark/Light Toggle */
    const toggle = $('<button title="Toggle Light/Dark" style="position:fixed;top:10px;right:200px;padding:6px;border:none;border-radius:4px;cursor:pointer;z-index:99998;">🌓</button>');
    $('body').append(toggle);
    let dark = true;
    toggle.on('click', () => { dark = !dark; if (dark) location.reload(); else GM_addStyle('body{background:#fff!important;color:#000!important;}a{color:#0066cc!important;}'); });

    /* Keyboard Navigation & Quick Reply (r) */
    $(document).on('keydown', e => {
        if (['INPUT','TEXTAREA'].includes(e.target.tagName)) return;
        const next = $('.PageNav-next a').attr('href');
        const prev = $('.PageNav-prev a').attr('href');
        if (e.key==='n' && next) window.location.href = next;
        if (e.key==='p' && prev) window.location.href = prev;
        if (e.key==='j') {
            const sel = $('.message--post.is-unread').first();
            if (sel.length) $('html,body').animate({scrollTop:sel.offset().top-60},200);
        }
        if (e.key==='k') {
            const sel = $('.message--post.is-unread').last();
            if (sel.length) $('html,body').animate({scrollTop:sel.offset().top-60},200);
        }
        if (e.key==='r') {
            const reply = $('#QuickReply');
            if (reply.length) reply.find('textarea').focus();
        }
    });

    /* Copy Code Blocks */
    $('pre code').each(function(){
        const btn = $('<span class="xf-copy-btn">Copy</span>');
        $(this).before(btn);
        btn.on('click', () => GM_setClipboard($(this).text()));
    });

    /* Inline Image Expansion */
    $('a.thumbnail').each(function(){
        $(this).css('cursor','zoom-in').on('click', e => {
            e.preventDefault();
            const src = $(this).attr('href');
            const img = $('<img>').attr('src',src).css({position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',maxWidth:'90%',maxHeight:'90%',zIndex:99999,boxShadow:'0 0 20px rgba(0,0,0,0.8)'});
            const overlay = $('<div>').css({position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'rgba(0,0,0,0.8)',zIndex:99998});
            overlay.on('click',()=>{overlay.remove(); img.remove();});
            $('body').append(overlay).append(img);
        });
    });

    /* Collapse Signatures */
    $('.message-signature').each(function(){
        const sig = $(this);
        const toggle = $('<span class="xf-toggle-sig">Show Signature</span>');
        sig.before(toggle);
        sig.addClass('xf-signature');
        toggle.on('click', ()=> {
            const open = sig.toggleClass('open').hasClass('open');
            toggle.text(open ? 'Hide Signature' : 'Show Signature');
        });
    });

    /* Spoiler Toggle */
    $('div.bbCodeBlock--spoiler').each(function(){
        const block = $(this);
        block.addClass('xf-spoiler').off('click').on('click', () => {
            block.toggleClass('revealed');
            block.css('color', block.hasClass('revealed') ? '#e0e0e0' : '#333');
        });
    });

    /* Collapse Attachments */
    $('.attachment').each(function(){
        const att = $(this);
        const btn = $('<span class="xf-toggle-sig">Toggle Attachment</span>');
        att.before(btn);
        btn.on('click', () => att.toggleClass('xf-collapsed'));
        att.addClass('xf-collapsed');
    });

    /* Filter Posts by User */
    $('.message-user').each(function(){
        const user = $(this).find('a.username').text();
        const btn = $(`<span style="margin-left:8px;cursor:pointer;color:#ff5555;">[Hide ${user}]</span>`);
        $(this).append(btn);
        btn.on('click', ()=>{
            $(this).closest('.message--post').hide();
        });
    });

    /* Auto-Refresh Thread */
    if (/\/threads\//.test(window.location.pathname)) {
        const interval = GM_getValue('refreshInterval', 60000);
        setInterval(() => {
            GM_xmlhttpRequest({
                method: 'GET', url: location.href, onload: res => {
                    const tmp = document.createElement('div'); tmp.innerHTML = res.responseText;
                    $(tmp).find('.js-post--message').each(function(){
                        if (!document.getElementById(this.id)) {
                            $('#messageList').append($(this));
                        }
                    });
                }
            });
        }, interval);
    }

    /* Subforum Jump Dropdown */
    const crumbs = $('.p-breadcrumb-item--forum a');
    if (crumbs.length>1) {
        const select = $('<select id="xf-forum-jump"></select>');
        crumbs.each(function(){ select.append(`<option value="${this.href}">${$(this).text()}</option>`); });
        select.on('change', ()=> window.location.href = select.val());
        $('body').append(select);
    }

    /* Relative Timestamps */
    $('.u-dt').each(function(){
        const el = $(this);
        const iso = el.attr('datetime');
        if (iso) {
            const diff = Math.floor((new Date() - new Date(iso)) / 1000);
            let disp;
            if (diff<60) disp = `${diff}s ago`;
            else if(diff<3600) disp = `${Math.floor(diff/60)}m ago`;
            else if(diff<86400) disp = `${Math.floor(diff/3600)}h ago`;
            else disp = `${Math.floor(diff/86400)}d ago`;
            el.text(disp).attr('title', iso);
        }
    });
})();
