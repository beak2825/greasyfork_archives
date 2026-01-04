// ==UserScript==
// @name    	  TMDB
// @include   	/^https://www\.themoviedb\.org/movie/[0-9a-z-]+$/
// @include   	/^https://www\.themoviedb\.org/tv/[0-9a-z-]+$/
// @require     https://cdn.jsdelivr.net/npm/clipboard@2/dist/clipboard.min.js
// @version   	1.0.5
// @namespace https://github.com/tomyangsh/userscrips
// @description TMDB PTGEN信息
// @downloadURL https://update.greasyfork.org/scripts/469831/TMDB.user.js
// @updateURL https://update.greasyfork.org/scripts/469831/TMDB.meta.js
// ==/UserScript==

(function() {
    'use strict'

    var trakt_url = 'https://trakt.tv/search/tmdb?query='+/\d+/.exec(document.baseURI)[0];
    var social_links = document.getElementsByClassName("social_links")[0];
    var trakt_link = social_links.appendChild(document.createElement("a"));
    trakt_link.href = trakt_url;
    trakt_link.target = "_blank";
    var img = trakt_link.appendChild(document.createElement("img"));
    img.src = "https://tomyangsh.pw/trakt-icon.svg";
    img.width = 30;

    let m = location.pathname.match(/\/(\w+)\/(\d+)/);
    let cat = m[1];
    let id = m[2];
    let url = 'https://tomyangsh.pw/api/tmdb?cat=' + cat + '&id=' + id;
    let xhttp  = new XMLHttpRequest();
    xhttp.open("GET", url, false);
    xhttp.send();
    let result = JSON.parse(xhttp.responseText);

    let zh_names = result.zh_names;

    if (zh_names) {
      var zh_names_span = document.createElement('span');
      zh_names_span.innerText = zh_names;
      zh_names_span.style = "font-size: 30px;";
      document.querySelector('h2 a').replaceWith(zh_names_span);
    }

    let imdb = result.imdb;

    if (imdb) {
      let imdb_link = social_links.appendChild(document.createElement("a"));
      imdb_link.href = `https://www.imdb.com/title/${imdb}/`;
      imdb_link.target = "_blank";
      var icon = imdb_link.appendChild(document.createElement("img"));
      icon.src = "https://tomyangsh.pw/imdb.svg";
      icon.width = 30;
    }

    let web_date = result.web_date

    if (web_date) {
      let web_date_span = document.querySelector('div.facts').appendChild(document.createElement("span"));
      web_date_span.innerText = 'WEB: ' + web_date;
    }

    let next_episode = result.next_episode

    if (next_episode) {
      let next_episode_span = document.querySelector('div.facts').appendChild(document.createElement("span"));
      next_episode_span.innerText = '下一集：' + next_episode;
    }

    let trailer = result.trailer

    if (!document.getElementsByClassName('video').length && trailer) {
      let youtube_id = /v=(.+)/.exec(trailer)[1]
      let trailer_li = document.querySelector('ul.actions').appendChild(document.createElement("li"));
      trailer_li.setAttribute("class", "video none");
      let trailer_a = trailer_li.appendChild(document.createElement("a"));
      trailer_a.setAttribute("class", "no_click play_trailer");
      trailer_a.setAttribute("data-site", "YouTube");
      trailer_a.setAttribute("data-id", youtube_id);
      trailer_a.setAttribute("data-title", "预告片");
      trailer_a.href = '#';
      trailer_a.innerText = '播放预告片';
      trailer_a.prepend(document.createElement("span"));
      trailer_a.childNodes[0].setAttribute("class", "glyphicons_v2 play");
    }

    var castinfo = [];
    var i;
    for (i of result.cast) {
     if (i.character) {
       castinfo.push(`${i.name} 饰 ${i.character}`);
     } else {
       castinfo.push(i.name);
     }
    }

    var ptinfo;
    if (result.cat == 'movie') {
        ptinfo = `[img]${result.poster}[/img]

        ◎译　　名   ${result.name} / ${result.ori_name}
        ◎产　　地   ${result.country}
        ◎类　　别   ${result.genres}
        ◎语　　言   ${result.lang}
        ◎上映日期   ${result.date}
        ◎IMDb链接   https://www.imdb.com/title/${result.imdb}/
        ◎导　　演   ${result.director}
        ◎片　　长   ${result.runtime} 分钟
        ◎主　　演   ${castinfo.join('\n\t\t\xa0\xa0\xa0\xa0')}

        ◎简　　介
            ${result.des}
`
    } else {
      ptinfo = `[img]${result.poster[0].path}[/img]

      ◎译　　名   ${result.name} / ${result.ori_name}
      ◎产　　地   ${result.country}
      ◎类　　别   ${result.genres}
      ◎语　　言   ${result.lang}
      ◎上映日期   ${result.date}
      ◎IMDb链接   https://www.imdb.com/title/${result.imdb}/
      ◎导　　演   ${result.director}
      ◎片　　长   ${result.runtime} 分钟
      ◎主　　演   ${castinfo.join('\n\t\t\xa0\xa0')}

      ◎简　　介
           ${result.des}
    `
    }

    var ptinfo_button = document.querySelector('h2').appendChild(document.createElement("button"))
    ptinfo_button.innerText = '复制ptinfo'
    ptinfo_button.setAttribute("class", "copy");
    ptinfo_button.style = "font-size: 15px; cursor: pointer; color: black; font-weight: normal;"

    unsafeWindow.ptinfo = ptinfo;
    var clipboard = new ClipboardJS('.copy', {
      text: function () {
        return ptinfo;
      },
    });

    clipboard.on('success', function () {
      document.querySelector('button.copy').innerText = '已复制';
    });

  })()