// ==UserScript==
// @name           Filter out Transmorpher DDS
// @namespace      dragontamer8740
// @description    Automatically removes the artist "Transmorpher DDS" from searches.
// @version        1.1
// @include        http://g.e-hentai.org/*
// @include        http://e-hentai.org/*
// @include        http://exhentai.org/*
// @include        https://g.e-hentai.org/*
// @include        https://e-hentai.org/*
// @include        https://exhentai.org/*
// @match        http://g.e-hentai.org/*
// @match        http://e-hentai.org/*
// @match        http://exhentai.org/*
// @match        https://g.e-hentai.org/*
// @match        https://e-hentai.org/*
// @match        https://exhentai.org/*
// @downloadURL https://update.greasyfork.org/scripts/30935/Filter%20out%20Transmorpher%20DDS.user.js
// @updateURL https://update.greasyfork.org/scripts/30935/Filter%20out%20Transmorpher%20DDS.meta.js
// ==/UserScript==
if(document.querySelector('input[name="f_search"]')) // only if search bar exists on current page
{
  //puts '-artist:"transmorpher DDS"' in the search field.
  if( document.querySelector('input[name="f_search"]').value=="")
  {
    document.querySelector('input[name="f_search"]').value +="-artist:\"transmorpher DDS\" ";
  }
  //if it's already in the search field (case insensitive), don't do anything. Otherwise, add it to the end.
  else if( !(document.querySelector('input[name="f_search"]').value.toUpperCase().includes("-artist:\"transmorpher DDS\"".toUpperCase())) )
  {
    document.querySelector('input[name="f_search"]').value +=" -artist:\"transmorpher DDS\" ";
  }
}