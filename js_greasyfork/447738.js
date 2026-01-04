// ==UserScript==
// @name        doramy.club
// @author      mixer
// @license     MIT
// @namespace   all
// @match       https://doramy.club/*
// @version     1.0.6
// @description show movie in bookmarks
// @require     http://code.jquery.com/jquery-3.4.1.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/447738/doramyclub.user.js
// @updateURL https://update.greasyfork.org/scripts/447738/doramyclub.meta.js
// ==/UserScript==

/* globals jQuery, $, favs */

let button_name = 'Перечитать';
var glot;
var favs=[
    {'url':'regs-favorit','badge':'в избранном','bg':'#F8961E'},
    {'url':'regs-budu','badge':'на потом','bg':'#F94144'},
    {'url':'regs-view','badge':'смотрю','bg':'#43AA8B'},
    {'url':'regs-zakl','badge':'в закладках','bg':'#75c71b'},
];
var $ = jQuery;

$(document).ready(function () {
    // if user autorized
    if ($('ul.profile-block>li>a')[1].href !== 'undefined'){
        if (!$('ul.profile-block>li>a')[1].href.match(/regs-register/gi)) {
            $('ul.profile-block').append('<li><a href="#" class="rereadfavs">'+button_name+'</a></li>');
            $(".rereadfavs").click(function() {
                RefreshFavorites();
            });
            // read button texts
            let css_text='';
            for (let i=0;i<favs.length;i++){
                let regex = new RegExp( favs[i].url, 'ig' );
                if ($('ul.profile-block>li>a')[i].href.match(regex)) {
                    favs[i].name = $('ul.profile-block>li>a')[i].text;
                }
                css_text = css_text+' p.'+favs[i].url+'>p { background-color: '+favs[i].bg+'; color: #fff; margin-left:4px;padding: 5px 8px; font-size: 13px; font-weight: bold; border-radius: 2px; box-shadow: 1px 0 1px 1px rgb(0 0 0 / 20%); font-style: normal; }';
            }

            GM_addStyle('div.np { float:right; position: relative; }');
            GM_addStyle(css_text);
            GM_addValueChangeListener('update', (name, oldVal, newVal, remote) => {
                Update();
            });

            AddPanes();
            Update();

            $('span.del-all, span.del-all-budu, span.del-all-viewed, span.del-all-zakl, span.del-link, span.del-link-budu, span.del-link-viewed, span.del-link-zakl, a.fav-linkhome, a.budu-link, a.viewed-link, a.zakl-link').click(function() {
                setTimeout(function(){
                    RefreshFavorites();
                }, 1000);
            });
        }
    }
});

function AddPanes() {
    for (let i=0;i<favs.length;i++){
        $('.post-home').each(function() {
            let href = $(this).find('a').attr('href');
            $(this).prepend('<div class="np"><p class="'+favs[i].url+'"></p></div>');
        });
    }
}

function Update() {
    console.log('Update badges');
    for (let i=0;i<favs.length;i++) {
        let favorites = GM_getValue(favs[i].url, []);
        let x = $('ul.profile-block>li>a');
        $(x[i]).html(favs[i].name + ' (' + favorites.length + ')');
        $('.post-home').each(function() {
            let href = $(this).find('a').attr('href');
            let p = $(this).find('p.'+favs[i].url);
            p.html('');
            if (favorites.includes(href)) {
                p.html('<p>'+favs[i].badge+'</p>');
            }
        });
    }
}


function RefreshFavorites() {
    let all=favs.length;
    for (let i=0;i<favs.length;i++) {
        GM_setValue(favs[i].url, []);
        $.get('https://doramy.club/'+favs[i].url+'/?preview=true&page=1', function( data ) {
            let last_page = 1;
            let matches = data.match(/'><b>(.*)<\/b><\/a><a class='nav-link/i);
            if ( matches !== null){
                last_page = parseInt(matches[1]);
            }
            favs[i].last_page = last_page;
            all--;
            if (all == 0) {
                RefreshPages();
            }
        });
    }
}

function RefreshPages() {
    let all=0;
    for (let i=0;i<favs.length;i++) {
        all = all + favs[i].last_page;
    }

    for (let i=0;i<favs.length;i++) {
        GM_setValue(favs[i].url, []);
        for(let page = 1; page < favs[i].last_page + 1; page++) {
            $.get('https://doramy.club/'+favs[i].url+'/?preview=true&page=' + page, function(data) {
                let block = data.match(/fav-list">([\s\S]*?)<\/ul>/ig);
                if (block !== null) {
                    let ul = block[0];
                    let matches = ul.match(/.*href="(.*)">/ig);
                    const regex = /.*href="(.*)">/ig;
                    let m;
                    let fav_array = GM_getValue(favs[i].url, []);
                    while ((m = regex.exec(ul)) !== null) {
                        if (m.index === regex.lastIndex) {
                            regex.lastIndex++;
                        }
                        m.forEach((match, groupIndex) => {
                            if (groupIndex == 1){
                                fav_array.push(match);
                            }
                        });
                    }
                    GM_setValue(favs[i].url, fav_array);
                }
                all--;
                if (all == 0){
                    GM_setValue('update', new Date().toLocaleString().replace(',',''));
                }
            });
        }
    }
}
