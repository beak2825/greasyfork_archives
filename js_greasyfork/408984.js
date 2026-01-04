// ==UserScript==
// @name        LostFilm download links
// @namespace   lostfilm_links
// @description Create download links directly in lists on LostFilm.TV
// @icon        https://www.lostfilmtv5.site/favicon.ico
// @match       *://*.lostfilm.tv/*
// @match       *://*.lostfilm.run/*
// @match       *://*.lostfilmtv.site/*
// @match       *://*.lostfilmtv1.site/*
// @match       *://*.lostfilmtv2.site/*
// @match       *://*.lostfilmtv3.site/*
// @match       *://*.lostfilmtv4.site/*
// @match       *://*.lostfilmtv5.site/*
// @version     1.0.4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/408984/LostFilm%20download%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/408984/LostFilm%20download%20links.meta.js
// ==/UserScript==

// make links for NEW series list
var i, j, s_href, div_ch, S, S1;
var atag = document.getElementsByTagName('a');
for (i = 0; i<atag.length; i++)
{
  S = /\/series\/[^\/]+\/season_\d+\/episode_\d+\/$/i.exec(atag[i].href);
  if (!(S===null))
  {
    s_href = S;
    var a_ch = atag[i].children;
    div_ch = a_ch;
    for (j = 0; j<a_ch.length; j++)
      if ((a_ch[j].tagName.toLowerCase()=='div') && (a_ch[j].className.toLowerCase()=='picture-box'))
      {
        div_ch = a_ch[j].children;
        break;
      };
    S = '';
    for (j = 0; j<div_ch.length; j++)
      if (div_ch[j].tagName.toLowerCase()=='img')
      {
        S = /images\/\d+\/posters/i.exec(div_ch[j].src);
        if (!(S===null)) break;
      };
    if (S.length==0) continue;
    S = '/v_search.php?c=' + /\d+/.exec(S);
    S1 = /\/season_\d+\//.exec(s_href);
    S += '&s=' + /\d+/.exec(S1);
    S1 = /\/episode_\d+\//.exec(s_href);
    S += '&e=' + /\d+/.exec(S1);
    for (j = 0; j<div_ch.length; j++)
      if (div_ch[j].tagName.toLowerCase()=='div')
        div_ch[j].innerHTML = '<a target="_blank" href="' + S + '">' + div_ch[j].innerHTML + '</a>';
  };
};

// make links for other lists
var k, tmp, trows, tcols, arr;
var tabtag = document.getElementsByTagName('table');
for (i = 0; i<tabtag.length; i++)
{
  if (tabtag[i].className.toLowerCase()!='movie-parts-list') continue;
  tmp = tabtag[i].children[0];
  if (tmp===null || tmp.tagName.toLowerCase()!='tbody') continue;
  trows = tmp.children;
  for (j = 0; j<trows.length; j++)
  {
    tmp = trows[j];
    if (tmp.tagName.toLowerCase()!='tr' || tmp.className.toLowerCase()=='not-available') continue;
    tcols = tmp.children;
    S = '';
    for (k = 0; k<tcols.length; k++)
    {
      tmp = tcols[k];
      if (tmp.tagName.toLowerCase()!='td') continue;
      if (tmp.className.toLowerCase()=='alpha') S = tmp.children[0].getAttribute('data-code');
      if (tmp.className.toLowerCase()=='beta')
      {
        if (S===null || S.length==0) continue;
        tmp.onclick = '';
        tmp.title = 'Скачать серию';
        arr = S.split('-');
        tmp.innerHTML = '<a target="_blank" href="/v_search.php?c=' + arr[0] + '&s=' + arr[1] + '&e=' + arr[2] + '" style="text-decoration: underline; font-weight: bold; color: blue; ">' + tmp.innerHTML + '</a>'
      };
    };
  };
};
