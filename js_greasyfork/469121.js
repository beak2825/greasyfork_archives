// ==UserScript==
// @name         Floating Subs List
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Adds a floating list of subscribed magazines to the left of the page
// @author       raltsm4k
// @match        *://kbin.social/*
// @match        *://fedia.io/*
// @match        *://karab.in/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kbin.social
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469121/Floating%20Subs%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/469121/Floating%20Subs%20List.meta.js
// ==/UserScript==

let user;
let is_populating = false;
let fetch_tries = 3;

(function() {
    'use strict';

    const a_login = document.querySelector("#header a.login");
    user = a_login.getAttribute("href");

    if (user !== "/login") {
        const div_head = document.querySelector('#header');
        const div_subs = document.createElement('div');
        const div_subs_s = document.createElement('section');
        const div_subs_c = document.createElement('div');
        const button_filter = Object.assign(document.createElement("a"), {
            className: "icon sort-button",
            id: "button-filter",
            title: "Filter by name",
        }).appendChild(Object.assign(document.createElement("i"), {
            className: "fa-solid fa-magnifying-glass"
        })).parentNode;
        const button_refresh = Object.assign(document.createElement("a"), {
            className: "icon sort-button",
            id: "button-refresh",
            title: "Refresh list",
        }).appendChild(Object.assign(document.createElement("i"), {
            className: "fa-solid fa-rotate-right"
        })).parentNode;
        const input_filter = Object.assign(document.createElement("input"), {
            id: "subs-filter",
            name: "subs-filter",
            type: "text",
            title: "Filter by name",
            style: "display:none;"
        });
        const button_collapse = Object.assign(document.createElement("button"), {
            id: "subs-sticky-collapse",
            title: "Collapse/expand",
            textContent: "<"
        });

        const ul_main = Object.assign(document.createElement("ul"), {
            id: "subs-sticky-main"
        });
        const ul_pins = Object.assign(document.createElement("ul"), {
            id: "subs-sticky-pins"
        });

        const preloader = Object.assign(document.createElement("div"), {
            className: "fa-3x",
            id: "subs-sticky-preloader"
        }).appendChild(Object.assign(document.createElement("i"), {
            className: "fa-solid fa-sync fa-spin"
        })).parentNode.appendChild(Object.assign(document.createElement("i"), {
            className: "fa-solid fa-circle-exclamation",
            style: "display:none;"
        })).parentNode;


        button_refresh.addEventListener('click', () => { localStorage.removeItem('cached_subs_' + user); populate(); });
        button_filter.addEventListener('click', () => {
            const search_box = $('#subs-filter');
            search_box.toggle();
            if (search_box.is(':visible')) {
                $('#button-filter').addClass('active');
                search_box.focus();
            } else {
                $('#button-filter').removeClass('active');
                search_box.val('');
                filter();
            }
        });
        input_filter.addEventListener('input', function() { filter(); });
        button_collapse.addEventListener('click', async () => { await localStorage.setItem('subs_collapsed', localStorage.getItem('subs_collapsed') !== 'true'); collapse(); });

        const sub_button = document.querySelector('.magazine__subscribe button[data-action="subs#send"]');
        if (sub_button !== null) sub_button.addEventListener('click', () => { localStorage.removeItem('cached_subs_' + user); });

        $('<style>').text(`#subs-sticky { display: none; }
                 @media only screen and (min-width: 1136px) {
                 #middle > .kbin-container {
                     margin: 0 auto 0 max(calc(200px + 1rem), calc(50vw - 720px + 1rem));
                 }
                 #middle > .kbin-container.collapsed-subs {
                     margin: 0 auto;
                 }
                 #subs-sticky {
                    display: block;
                    position: fixed;
                    top: 3.1625rem;
                    left: max(.5rem, calc(50vw - 680px - 200px - 2rem));
                }
                .fixed-navbar #subs-sticky {
                    position: absolute;
                }
                #subs-sticky.collapsed-subs {
                    left: 0;
                }
                #subs-sticky.collapsed-subs .section {
                    width: 0px;
                    padding: 0;
                    border: none;
                }
                #subs-sticky-collapse {
                    cursor: pointer;
                    height: min(200px, 20%);
                    width: .5rem;
                    position: absolute;
                    top: calc(50% - min(200px, 20%));
                    left: 100%;
                    border: var(--kbin-button-primary-border);
                    border-left: none;
                    background: var(--kbin-button-primary-bg);
                    padding: 0;
                    color: var(--kbin-text-muted-color);
                }
                #subs-sticky-collapse:hover {
                    background: var(--kbin-button-primary-hover-bg);
                }
                a.sort-button {
                    position: relative;
                    float: right;
                    padding-left: .5rem;
                }
                a.sort-button:hover {
                    cursor: pointer;
                }
                a.sort-button:not(.active) {
                    opacity: 50%;
                }
                a#button-filter {
                    margin-right: -.25rem;
                    padding-right: .25rem;
                    border-right: var(--kbin-meta-border);
                }
                #subs-sticky a {
                     white-space: nowrap;
                     text-overflow: ellipsis;
                     max-width: 100%;
                     overflow-x: hidden;
                     overflow-y: hidden;
                     display: inherit;
                }
                #subs-sticky h3 {
                     border-bottom: var(--kbin-sidebar-header-border);
                     color: var(--kbin-sidebar-header-text-color);
                     font-size: .8rem;
                     margin: 0 0 .5rem;
                     text-transform: uppercase;
                }
                #subs-sticky .section {
                     padding: .5rem .5rem 1rem;
                     margin: 0;
                     width: 200px;
                     max-height: calc(100vh - 6.325rem);
                     overflow-y: auto;
                }
                .fixed-navbar #subs-sticky .section {
                     max-height: calc(100vh - 3.5rem);
                }
                #subs-sticky .section a {
                    color: var(--kbin-meta-link-color);
                }
                #subs-sticky .section a:hover {
                    color: var(--kbin-meta-link-hover-color);
                }
                #subs-sticky ul {
                    list-style-type: none;
                    padding: 0;
                    margin: 0;
                }
                #subs-sticky ul li small {
                    display: none;
                }
                #subs-sticky ul div {
                    position: relative;
                }
                #subs-sticky ul div .pin-button {
                    position: absolute;
                    top: -2px;
                    left: -2px;
                    cursor: pointer;
                    opacity: 0%;
                    text-shadow: 2px 2px 5px black;
                    z-index: 20;
                }
                a.icon.pin-button i {
                    font-size: small;
                }
                #subs-sticky ul div:hover .pin-button {
                    opacity: 25%;
                }
                #subs-sticky-pins .pin-button {
                    color: #bf5ded!important;
                    opacity: 100%!important;
                }
                #subs-sticky ul div .pin-button:hover {
                    opacity: 100%;
                }
                #subs-sticky-pins .pin-button:hover {
                    color: #df7dff!important;
                }
                #subs-sticky-pins {
                    display: none;
                    border-bottom: var(--kbin-meta-border);
                    margin-bottom: .25rem!important;
                }
                #subs-sticky figure {
                    display: inline-block;
                    vertical-align: middle;
                    margin: 0 4px 4px 0;
                    height: 24px;
                    width: 24px;
                    float: left;
                }
                #subs-sticky figure, #subs-sticky img {
                    border-radius: 100%;
                }
                #subs-sticky span.subs-comp-name {
                    display: block;
                }
                #subs-sticky span.subs-comp-name-mag {
                    margin-top: -.25rem;
                }
                #subs-sticky span.subs-comp-name-instance {
                    font-size: xx-small;
                    margin-top: -.125rem;
                    opacity: 80%;
                    color: #bf5ded;
                }
                #subs-sticky a:hover span.subs-comp-name-instance {
                    opacity: 100%;
                }
                #subs-filter {
                    display: block;
                    padding: .25rem;
                    margin-bottom: .5rem;
                }
                #subs-sticky .section::-webkit-scrollbar {
                    width: 8px;
                }
                #subs-sticky .section::-webkit-scrollbar-track {
                    background: var(--kbin-bg-nth);
                    border-left: var(--kbin-section-border);
                }
                #subs-sticky .section::-webkit-scrollbar-thumb {
                    background: var(--kbin-section-bg);
                    border-left: var(--kbin-section-border);
                }
                #subs-sticky .section::-webkit-scrollbar-thumb:hover {
                    background: var(--kbin-primary-color);
                }
                #subs-sticky .dummy {
                    display: none;
                }
                #subs-sticky-preloader {
                    height: 100px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    opacity: 50%;
                }
                }`).appendTo(document.head);

        div_subs_c.className = 'container';
        div_subs_c.appendChild(ul_pins);
        div_subs_c.appendChild(ul_main);

        div_subs_s.className = 'section';
        div_subs_s.appendChild(button_refresh);
        div_subs_s.appendChild(button_filter);
        div_subs_s.appendChild(Object.assign(document.createElement('h3'), {
            textContent: "Subscribed"
        }));
        div_subs_s.appendChild(input_filter);
        div_subs_s.appendChild(preloader);
        div_subs_s.appendChild(div_subs_c);
        div_subs.appendChild(div_subs_s);
        div_subs.appendChild(button_collapse);

        div_subs.setAttribute('id', 'subs-sticky');
        div_head.appendChild(div_subs);

        // Stop the panel before it collides with the footer when scrolling
        // Not happy with this yet, uncomment if you want to use it
        /*if ($('.fixed-navbar').length == 0) {
            $(window).scroll(function(){
                $('#subs-sticky').css('top', Math.min(rem_to_px(3.1625) + $(window).scrollTop(), $(document).outerHeight() - $('#footer').outerHeight() - $('#subs-sticky').outerHeight() - rem_to_px(3.5)));
            });
        } else {
            $(window).scroll(function(){
                $('#subs-sticky').css('top', Math.min(rem_to_px(3.1625), $(document).outerHeight() - $('#footer').outerHeight() - $('#subs-sticky').outerHeight() - $(window).scrollTop() - rem_to_px(3.5)));
            });
        }*/

        populate();
    }
})();

function populate() {
    if (!is_populating) {
        is_populating = true;
        const cached = JSON.parse(localStorage.getItem('cached_subs_' + user));
        if (cached === null || Date.now() >= cached.expire) { regen(); }
        else { set_preloader(true); $('#subs-sticky-main').html(cached.html); $('#subs-sticky-pins').html(''); console.log("Fetched from cache"); post_populate(); }
    }
}

function post_populate() {
    sort();
    collapse();
    assign_pins();
    set_preloader(false);
    is_populating = false;
}

function regen() {
    set_preloader(true);
    $('#subs-sticky li').remove();
    fetch_next(1);
}

function fetch_next(p) {
    $.ajax({
        url: window.location.origin + user + "/subscriptions?p=" + p,
        success: function(data) {
            const dom = $($.parseHTML(data));
            const ul = dom.find('#content .magazines ul');
            if (!ul.length) {
                if (fetch_tries > 0) {
                    console.log("Failed to get page " + p + " of subs, retrying...");
                    fetch_tries--;
                    fetch_next(p);
                } else {
                    console.log("Failed to get page " + p + " of subs. Out of tries, stopping...");
                }
            } else {
                const els = ul.children('li');
                els.each(function() {
                    const div = $(this).find('div');
                    const a = $(this).find('a');
                    const fig = $(this).find('figure');
                    $(this).find('small').remove();

                    const a_parts = a.text().split('@');
                    if (a_parts.length === 2) {
                        a.html("<span class='subs-comp-name subs-comp-name-mag'>" + a_parts[0] + "</span><span class='subs-comp-name subs-comp-name-instance'>@" + a_parts[1] + "</span>");
                    }

                    if (fig.length > 0) {
                        fig.find('img').css({'height': '24px', 'width': '24px'});
                        a.prepend(fig);
                    } else {
                        a.prepend(`<figure style="background-color: rgba(128, 128, 128, 0.5); text-align: center;">
                              <i class="fa-solid fa-newspaper" style="opacity:50%;"></i></figure>`);
                    }
                    a.removeClass();
                    div.prepend(`<a class="icon pin-button" title="Pin magazine" aria-label="Pin magazine"><i class="fa-solid fa-thumbtack"></i></a>`);
                    $('#subs-sticky-main').append($(this));
                });
                fetch_tries = 3;

                const pg = dom.find('#content .pagination__item--next-page:not(.pagination__item--disabled)');
                if (pg.length) {
                    fetch_next(p+1);
                } else {
                    localStorage.setItem('cached_subs_' + user, JSON.stringify({html: $('#subs-sticky-main').html(), expire: Date.now() + 15 * 60 * 1000}));
                    post_populate();
                }
            }
        },
        error: function() {
            post_populate();
            set_preloader(true, true);
        }
    });
}

function sort() {
    const ul_pins = $('#subs-sticky-pins');
    ul_pins.hide();
    ul_pins.children('li').appendTo($('#subs-sticky-main'));
    ul_pins.children('li').remove();

    const elems = $('#subs-sticky-main').children('li').detach().sort(function (a, b) {
        return ($(a).text().trim().toLowerCase() < $(b).text().trim().toLowerCase() ? -1
                : $(a).text().trim().toLowerCase() > $(b).text().trim().toLowerCase() ? 1 : 0);
    });
    $('#subs-sticky-main').append(elems);

    // Keep pins from versions < 0.8
    const legacy_pins = localStorage.getItem('pinned_subs');
    if (legacy_pins !== null) {
        localStorage.setItem('pinned_subs_' + user, legacy_pins)
        localStorage.removeItem('pinned_subs');
    }

    let pins = localStorage.getItem('pinned_subs_' + user);
    if (pins !== null && (pins = JSON.parse(pins)).length > 0) {
        $('#subs-sticky-main > li').each(function() {
            if (pins.includes($(this).find('a:nth-child(2)').attr('href'))) {
                $(this).appendTo($('#subs-sticky-pins'));
            }
        });
        ul_pins.show();
    }
    filter();
}

function filter() {
    const filter = $('#subs-filter').val();
    const elems = $('#subs-sticky li');
    elems.each(function() {
        $(this).show();
        if ($(this).text().trim().toLowerCase().indexOf(filter.trim().toLowerCase()) == -1) $(this).hide();
    });
}

function assign_pins() {
    $('.pin-button').on('click', function() {
        const href = $(this).parent().children('a').eq(1).attr('href');
        let pins = localStorage.getItem('pinned_subs_' + user);
        if (pins !== null && (pins = JSON.parse(pins)).length > 0) {
            if (pins.includes(href)) {
                pins.splice(pins.indexOf(href), 1);
            } else {
                pins.push(href);
            }
        } else {
            pins = [href];
        }
        localStorage.setItem('pinned_subs_' + user, JSON.stringify(pins));
        sort();
    });
}

function collapse() {
    const is_collapsed = localStorage.getItem('subs_collapsed');
    if (is_collapsed === 'true') {
        $('#middle .kbin-container').addClass('collapsed-subs');
        $('#subs-sticky').addClass('collapsed-subs');
        $('#subs-sticky-collapse').text('>');
    } else {
        $('#middle .kbin-container').removeClass('collapsed-subs');
        $('#subs-sticky').removeClass('collapsed-subs');
        $('#subs-sticky-collapse').text('<');
    }
}

function set_preloader(vis, error = false) {
    const pre = $('#subs-sticky-preloader');
    const cont = $('#subs-sticky .container');
    const i_spin = pre.find(".fa-spin");
    const i_err = pre.find(".fa-circle-exclamation");

    if (vis) {
        pre.show();
        cont.hide();
    } else {
        pre.hide();
        cont.show();
    }

    if (error) {
        i_err.show();
        i_spin.hide();
    } else {
        i_err.hide();
        i_spin.show();
    }
}

function rem_to_px(rem) {
    return parseFloat(rem) * parseFloat(getComputedStyle(document.documentElement).fontSize);
}