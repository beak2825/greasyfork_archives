// ==UserScript==
// @name        mydramalist.com item highlighter
// @namespace   luckz
// @author      luckz
// @match       https://mydramalist.com/people/*
// @match       https://mydramalist.com/*-*
// @grant       none
// @version     1.0.2
// @description QoL for mydramalist logged in users: colours shows/movies based on their status in the default lists & 'liked' actors/crew. refresh after changing theme.
// @downloadURL https://update.greasyfork.org/scripts/414922/mydramalistcom%20item%20highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/414922/mydramalistcom%20item%20highlighter.meta.js
// ==/UserScript==

const colours = {
    1: '#e6ccff', // currently watching
    2: '#bdf5bd', // completed
    3: '#c4e4ed', // plan to watch
    4: 'Pink', // on hold
    5: '#F3E0BE', // dropped
    6: 'LightGrey', // not interested
}

const colours_dark = {
    1: '#440066', // currently watching
    2: '#0e580e', // completed
    3: '#032e49', // plan to watch
    4: '#5b0b1f', // on hold
    5: '#6c4b14', // dropped
    6: '#4d4d4d', // not interested
}

// unused, a 'bright' colour scheme for dark mode
const colours_dark_lite = {
    1: '#d580ff', // currently watching
    2: '#65e765', // completed
    3: 'LightSkyBlue', // plan to watch
    4: '#ee5d82', // on hold
    5: '#e3b668', // dropped
    6: '#a6a6a6', // not interested
}

const liked = '#bdf5bd';
const liked_dark = '#0a430a';

// https://davidwalsh.name/cookiestore - 2fancy & new? also of course async.
/*
let token;
cookieStore.get('jl_sess').then(r => token = r.value);
*/

const token = getCookie('jl_sess');
// https://stackoverflow.com/questions/10730362/get-cookie-by-name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

const darkMode = $("html").hasClass("dark-mode");

if (token) { // hotfix for MDL changes; request itself does not need token or t=z but they're staying for now since they don't hurt.
    $.ajaxSetup({
      headers : {   
        'authorization': `Bearer ${token}`,
      }
    });
}

const split1 = window.location.href.split('/');
const split2 = split1[3].split('-');
if (token && split1[3] === 'people') {
    //const person = window.location.href.split('/')[4].split('-')[0];
    let list = $('table.film-list > tbody > tr[class]').map(function () {
        for (let x of this.classList) {
            const y = x.split('-');
            if (y.length === 2 && y[0] === 'mdl')
                return y[1];
        }
    }).get();

    while (list.length > 0) {
        const chunk = list.splice(0,40).join('-');
        $.getJSON(`/v1/users/data?token=${token}&lang=en-US&mylist=${chunk}&t=z`, function(json) {
            for (let movie of json.mylist) {
                // {rid: 5947, status: 2, episode_seen: 1, rating: 5}
                if (movie.status >= 1 && movie.status <= 6) { // sanity check
                    $(`tr.mdl-${movie.rid}`).css('background-color',!darkMode ? colours[movie.status] : colours_dark[movie.status]);
                }
            }
        });
    }
}
else if (token && split2.length > 1 && Number.isInteger(parseInt(split2[0]))) { // assume movie/show
    if (split1.length === 4 || split1[4] === 'cast') {
        let mySet = new Set();
        $('.list-item.col-sm-6,.list-item.col-sm-4').each(function() {
            mySet.add($(this).find('a').first().attr('href').split('people/')[1].split('-')[0]);
        });
        let list = [...mySet]
        while (list.length > 0) {
            const chunk = list.splice(0,40).join('-');
            $.getJSON(`/v1/users/data?token=${token}&lang=en-US&people=${chunk}`, function(json) {
                $('.list-item.col-sm-6,.list-item.col-sm-4').each(function() {
                    const el = $(this);
                    const person = el.find('a').first().attr('href').split('people/')[1].split('-')[0];
                    for (let pal of json.people) {
                        if (pal.id === parseInt(person))
                            el.css('background-color',!darkMode ? liked : liked_dark);
                    }
                })
            });
        }
    }
}