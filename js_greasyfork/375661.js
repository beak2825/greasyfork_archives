// ==UserScript==
// @name cinemapress
// @name:ru синемапресс
// @description Button auto-complete movie information in CinemaPress ACMS.
// @description:ru Кнопка автозаполнения информации о фильме в CinemaPress ACMS.
// @author ExtensionsApp
// @homepageURL https://cinemapress.org/
// @supportURL https://enota.club/
// @icon https://avatars3.githubusercontent.com/u/16612433?s=200
// @license MIT
// @version 2019.6
// @run-at document-end
// @include http://*/*/movies?kp_id=*
// @include https://*/*/movies?kp_id=*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/233485
// @downloadURL https://update.greasyfork.org/scripts/375661/cinemapress.user.js
// @updateURL https://update.greasyfork.org/scripts/375661/cinemapress.meta.js
// ==/UserScript==

var tmdb = '';

if (!getCookie('tmdb')) {
    var newInput = document.createElement('input');
    newInput.setAttribute('class', 'form-control');
    newInput.setAttribute('name', 'tmdb');
    newInput.setAttribute('placeholder', 'TMDb api_key');
    var newDiv = document.createElement('div');
    newDiv.setAttribute('class', 'spacer-10');
    var inner = document.querySelector('.window > .inner-padding');
    if (inner) {
        inner.insertBefore(newDiv, inner.firstChild);
        inner.insertBefore(newInput, inner.firstChild);
    }
}
else {
    tmdb = getCookie('tmdb');
}

var newItem = document.createElement('a');
newItem.setAttribute('class', 'btn addInformation');
newItem.setAttribute('href', 'javascript:void(0)');
var newText = document.createTextNode('  Fill in the information');
var newIcon = document.createElement('span');
newIcon.setAttribute('class', 'fa fa-file');
newItem.appendChild(newIcon);
newItem.appendChild(newText);
var right = document.querySelector('.window > .actionbar > .pull-right > a');
if (right) {
    right.parentNode.insertBefore(newItem, right);   
}

var el = document.querySelector('.addInformation');
if (!el) return;
el.addEventListener('click', () => {
    document.querySelector('.addInformation > span').setAttribute('class', 'fa fa-spinner fa-spin');
    var e = document.querySelector('[name="movie.type"]');
    if (e) e.setAttribute('style', '');
    var type = e 
        ? e.options[e.selectedIndex].value 
        : '0';
    tmdb = (tmdb) ? tmdb : document.querySelector('[name="tmdb"]').value; 
    if (tmdb) {
        setCookie('tmdb', tmdb, {expires: 3600000});
    }
    var kp_id = document.querySelector('[name="movie.kp_id"]') 
        ? document.querySelector('[name="movie.kp_id"]').value
        : '';
    var tmdb_id = document.querySelector('[name="movie.tmdb_id"]') 
        ? document.querySelector('[name="movie.tmdb_id"]').value
        : '';
    var douban_id = document.querySelector('[name="movie.douban_id"]') 
        ? document.querySelector('[name="movie.douban_id"]').value
        : '';
    if (!kp_id && !tmdb_id && !douban_id) {
        document.querySelector('.addInformation > span').setAttribute('class', 'fa fa-bug');
        console.log('ID KinoPoisk and ID TMDb not filled!');
        return;
    }
    var lang = document.querySelector('[name="lang"]') 
        ? document.querySelector('[name="lang"]').value 
        : 'en';
    var url = tmdb_id && tmdb
    ? 'https://api.themoviedb.org/3/' + (type === '1' ? 'tv' : 'movie') + '/' + tmdb_id + '?language=' + lang + '&append_to_response=credits&api_key=' + tmdb
    : douban_id 
        ? 'http://api.douban.com/v2/movie/subject/' + douban_id
        : 'https://streamguard.cc/api/videos.json?&api_token=6eb82f15e2d7c6cbb2fdcebd05a197a2&kinopoisk_id=' + kp_id

    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload: function (response) {
            if (response.readyState === 4 && response.status === 200) {
                var res = (response && response.responseText) ? JSON.parse(response.responseText) : {};

                if (!res || res.error) {
                    document.querySelector('.addInformation > span').setAttribute('class', 'fa fa-bug');
                    console.log('No information about the movie or error!');
                    return;
                }
                
                var src = document.querySelector('[data-poster="src"]');

                var m = {};

                if (res && (res.alt && res.title)) {
                    m.title_ru = res.title || '';
                    m.title_en = res.original_title || '';
                    m.type = res.subtype === 'rv' ? '1' : '0';
                    m.genre = (res.genres 
                        ? res.genres.map(function(g){return g}) 
                        : []).join(',');
                    m.country = (res.countries 
                        ? res.countries.map(function(c){return c}) 
                        : []).join(',');
                    m.year = m.year || '';
                    m.actor = (res.casts
                        ? res.casts.map(function(a, i){return i < 10 ? a.name : null}) 
                        : [])
                        .filter(Boolean).join(',');
                    m.director = (res.directors
                        ? res.directors.map(function(a, i){return i < 10 ? a.name : null}) 
                        : [])
                        .filter(Boolean).join(',');
                    m.description = res.summary || '';
                    m.poster = (res.images && res.images.medium) 
                        ? res.images.medium
                        : '';
                    m.imdb_rating = res.rating && res.rating.average
                            ? '' + parseInt(res.rating.average*10)
                            : '0';
                    m.imdb_vote = res.ratings_count || '0';
                    if (src && m.poster) src.src = m.poster;
                }
                else if (res && !res.alt && (res.name || res.title)) {
                    m.title_ru = res.title || res.name || '';
                    m.title_en = res.original_title || res.original_name || '';
                    m.type = res.number_of_seasons ? '1' : '0';
                    m.genre = (res.genres 
                        ? res.genres.map(function(g){return g.name}) 
                        : []).join(',');
                    m.country = (res.production_countries 
                        ? res.production_countries.map(function(c){return c.name}) 
                        : res.origin_country 
                        ? res.origin_country.map(function(c){return c}) 
                        : []).join(',');
                    m.premiere = res.release_date || res.first_air_date || '';
                    m.year = m.premiere 
                        ? m.premiere.substring(0,4) 
                        : '';
                    m.actor = (res.credits && res.credits.cast 
                        ? res.credits.cast.map(function(a, i){return i < 10 ? a.name : null}) 
                        : [])
                        .filter(Boolean).join(',');
                    m.director = (res.created_by 
                        ? res.created_by.map(function(d, i){return i < 10 ? d.name : null}) 
                        : res.credits && res.credits.crew 
                        ? res.credits.crew.map(function(d){return d.job === 'Director' ? d.name : null})
                        : [])
                        .filter(Boolean).join(',');
                    m.description = res.overview || '';
                    m.pictures = res.backdrop_path || '';
                    m.poster = res.poster_path || '';
                    m.imdb_rating = res.vote_average
                            ? '' + parseInt(res.vote_average*10)
                            : '0';
                    m.imdb_vote = res.vote_count || '0';
                    m.imdb_id = res.imdb_id ? res.imdb_id.replace(/[^0-9]/g, '') : '';
                    if (src && m.poster) src.src = 'https://image.cinemapress.org/t/p/w185' + m.poster;
                }
                else if (res.length) {
                    for (var i = 0; i < res.length; i++) {
                        if (res[i].material_data && !(/укр/i.test(res[i].translator || '')) && !m.title_ru) {
                            m.title_ru = res[i].title_ru || '';
                            m.title_en = res[i].title_en || '';
                            m.year = res[i].material_data.year || '';
                            m.description = res[i].material_data.description || '';
                            m.country = res[i].material_data.countries && res[i].material_data.countries.length 
                                ? res[i].material_data.countries.join(',') 
                                : '';
                            m.genre = res[i].material_data.genres && res[i].material_data.genres.length 
                                ? res[i].material_data.genres.join(',') 
                                : '';
                            m.actor = res[i].material_data.actors && res[i].material_data.actors.length 
                                ? res[i].material_data.actors.join(',') 
                                : '';
                            m.director = res[i].material_data.directors && res[i].material_data.directors.length 
                                ? res[i].material_data.directors.join(',') 
                                : '';
                            m.kp_rating = res[i].material_data.kinopoisk_rating 
                                ? '' + parseInt(res[i].material_data.kinopoisk_rating*10) 
                                : '0';
                            m.imdb_rating = res[i].material_data.imdb_rating
                                ? '' + parseInt(res[i].material_data.imdb_rating*10)
                                : '0';
                            m.kp_vote = res[i].material_data.kinopoisk_votes || '0';
                            m.imdb_vote = res[i].material_data.imdb_votes || '0';
                            m.type = res[i].type === 'serial' ? '1' : '0';
                            m.translate = res[i].translator || '';
                            m.quality = res[i].source_type || '';
                            m.poster = res[i].material_data.poster ? '1' : '0';
                            if (src && res[i].material_data.poster) src.src = res[i].material_data.poster;
                        }
                    }
                }
                
                if (!m.title_ru && !m.title_en) {
                    document.querySelector('.addInformation > span').setAttribute('class', 'fa fa-bug');
                    console.log('No information about the movie!');
                    return;
                }

                if (m.title_ru) {
                    document.querySelector('[name="movie.title_ru"]').value = m.title_ru;
                }
                if (m.title_en) {
                    document.querySelector('[name="movie.title_en"]').value = m.title_en;
                }
                if (m.title_ru && m.title_ru.indexOf('(видео)')+1) {
                    document.querySelector('[name="movie.type"]').value = 2;
                    document.querySelector('[name="movie.title_ru"]').value = (m.title_ru.split('(')[0]).trim();
                }
                else if (m.title_ru && m.title_ru.indexOf('(ТВ)')+1) {
                    document.querySelector('[name="movie.type"]').value = 3;
                    document.querySelector('[name="movie.title_ru"]').value = (m.title_ru.split('(')[0]).trim();
                }
                else if (m.type) {
                    document.querySelector('[name="movie.type"]').value = m.type;
                }
                if (m.premiere) {
                    document.querySelector('[name="movie.premiere"]').value = m.premiere;
                }
                if (m.poster) {
                    document.querySelector('[name="movie.poster"]').value = m.poster;
                }
                if (m.pictures) {
                    document.querySelector('[name="movie.pictures"]').value = m.pictures;
                }
                if (m.translate) {
                    document.querySelector('[name="movie.translate"]').value = m.translate;
                }
                if (m.quality) {
                    document.querySelector('[name="movie.quality"]').value = m.quality;
                }
                if (m.year) {
                    document.querySelector('[name="movie.year"]').value = m.year;
                }
                if (m.country) {
                    document.querySelector('[name="movie.country"]').value = m.country;
                }
                if (m.genre) {
                    document.querySelector('[name="movie.genre"]').value = m.genre;
                }
                if (m.actor) {
                    document.querySelector('[name="movie.actor"]').value = m.actor;
                }
                if (m.director) {
                    document.querySelector('[name="movie.director"]').value = m.director;
                }
                if (m.kp_rating) {
                    document.querySelector('[name="movie.kp_rating"]').value = m.kp_rating;
                }
                if (m.kp_vote) {
                    document.querySelector('[name="movie.kp_vote"]').value = m.kp_vote;
                }
                if (m.imdb_rating) {
                    document.querySelector('[name="movie.imdb_rating"]').value = m.imdb_rating;
                }
                if (m.imdb_vote) {
                    document.querySelector('[name="movie.imdb_vote"]').value = m.imdb_vote;
                }
                if (m.imdb_id) {
                    document.querySelector('[name="movie.imdb_id"]').value = m.imdb_id;
                }
                if (m.description &&
                    document.querySelector('[name="movie.description"]').value.length < 900) {
                    document.querySelector('[name="movie.description"]').value = m.description;
                }

                document.querySelector('.addInformation > span').setAttribute('class', 'fa fa-file');
            }
            else {
                if (response.status === 404) {
                    var res = (response && response.responseText) ? JSON.parse(response.responseText) : {};
                    if (res.status_code && e && e.options[e.selectedIndex].value === '') {
                        e.setAttribute('style', 'background:#351a1a');
                        console.log(res.status_message);
                    }
                }
                document.querySelector('.addInformation > span').setAttribute('class', 'fa fa-bug');
                console.log('No information about the movie!');
            }
        }
    });
}, false);

function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options) {
  options = options || {};

  var expires = options.expires;

  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires * 1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
  }

  value = encodeURIComponent(value);

  var updatedCookie = name + "=" + value;

  for (var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];
    if (propValue !== true) {
      updatedCookie += "=" + propValue;
    }
  }

  document.cookie = updatedCookie;
}