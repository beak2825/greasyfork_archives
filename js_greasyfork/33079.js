// ==UserScript==
// @name        Sukebei nyaa video previews
// @namespace   https://greasyfork.org/scripts/33079
// @description Facilitates access to video previews
// @include     https://sukebei.nyaa.si/*
// @version     2017.09.11
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/33079/Sukebei%20nyaa%20video%20previews.user.js
// @updateURL https://update.greasyfork.org/scripts/33079/Sukebei%20nyaa%20video%20previews.meta.js
// ==/UserScript==

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function loadHosts() {
  var hosts = [
    {r:/Caribbeancom(pr)?[ _]{1}([0-9]{6}_[0-9]{3})/, i:[2], u:'https://www.caribbeancompr.com/moviepages/{0}/index.html'},
    {r:/加勒比PPV動畫 ([0-9]{6}_[0-9]{3})/, i:[1], u:'https://www.caribbeancompr.com/moviepages/{0}/index.html'},
    {r:/Caribbeancom[ _]{1}([0-9]{6}-[0-9]{3})/, i:[1], u:'https://www.caribbeancom.com/moviepages/{0}/index.html'},
    {r:/カリビアンコム ([0-9]{6}-[0-9]{3})/, i:[1], u:'https://www.caribbeancom.com/moviepages/{0}/index.html'},
    {r:/HEYZO[ _]{1}([0-9]{4})/, i:[1], u:'http://www.heyzo.com/moviepages/{0}/index.html'},
    {r:/Heyzo[ _]{1}([0-9]{4})/, i:[1], u:'http://www.heyzo.com/moviepages/{0}/index.html'},
    {r:/HEY-([0-9]{3})/, i:[1], u:''},
    {r:/Tokyo Hot (RED-[0-9]{3})/, i:[1], u:'http://my.tokyo-hot.com/product/{0}/'},
    {r:/Tokyo[ _]{1}Hot[ _]{1}(th[0-9]{3}-[0-9]{3}-[0-9]{6})/, i:[1], u:'http://my.tokyo-hot.com/product/{0}/'},
    {r:/Tokyo Hot (SE[0-9]{3})/, i:[1], u:'http://my.tokyo-hot.com/product/{0}/'},
    {r:/Tokyo Hot (kb[0-9]{4})/, i:[1], u:'http://my.tokyo-hot.com/product/{0}/'},
    {r:/Tokyo Hot (CZ[0-9]{3})/, i:[1], u:'http://my.tokyo-hot.com/product/{0}/'},
    {r:/Tokyo[ -_]{1}Hot[ -_]{1}([kn]{1}[0-9]{4})/, i:[1], u:'http://my.tokyo-hot.com/product/{0}/'},
    {r:/Tokyo Hot (gedo[0-9]{2})/, i:[1], u:'http://my.tokyo-hot.com/product/{0}/'},
    {r:/Tokyo Hot ([bs]{1}[0-9]{3})/, i:[1], u:'http://my.tokyo-hot.com/product/{0}/'},
    {r:/Tokyo Hot (bouga[0-9]{2})/, i:[1], u:'http://my.tokyo-hot.com/product/{0}/'},
    {r:/1[pP]{1}ondo[ _]{1}([0-9]{6}_[0-9]{3})/, i:[1], u:'https://en.1pondo.tv/movies/{0}/'},
    {r:/一本道 ([0-9]{6}_[0-9]{3})/, i:[1], u:'https://en.1pondo.tv/movies/{0}/'},
    {r:/[pP]{1}acopacomama[ _]{1}([0-9]{6}_[0-9]{3})/, i:[1], u:'http://en.pacopacomama.com/eng/moviepages/{0}/index.html'},
    {r:/パコパコママ ([0-9]{6}_[0-9]{3})/, i:[1], u:'http://en.pacopacomama.com/eng/moviepages/{0}/index.html'},
    {r:/10musume[ _]{1}([0-9]{6}_[0-9]{2})/, i:[1], u:'http://en.10musume.com/eng/moviepages/{0}/index.html'},
    {r:/天然むすめ ([0-9]{6}_[0-9]{2})/, i:[1], u:'http://en.10musume.com/eng/moviepages/{0}/index.html'},
    {r:/[kK]{1}in8tengoku[ -]{1}([0-9]{4})/, i:[1], u:'http://en.kin8tengoku.com/moviepages/{0}/index.html'},
    {r:/JVRPorn ([0-9]{6})/, i:[1], u:'https://jvrporn.com/video/{0}/'},
		{r:/Hey[Dd]{1}ouga ([0-9]{4})-([0-9]{3,4})/, i:[1,2], u:'http://en.heydouga.com/moviepages/{0}/{1}/index.html'},
    {r:/(SMD-[0-9]{3})/, i:[1], u:'http://www.aventertainments.com/search_Products.aspx?languageID=1&dept_id=29&keyword={0}&searchby=keyword'},
    {r:/S-[cC]{1}ute[ -]{1}([0-9]{3})[ -]{1}([a-zA-Z]{2,})[ -]{1}#?([0-9]{1})/, i:[1,2,3], u:'http://www.s-cute.com/contents/{0}_{1}_{2}/', t:function(item, index) {if (index == 1) { return item; } else if (index == 2) { return item.toLowerCase(); } else if (index == 3) { return pad(item, 2); }}},
    {r:/[rR]{1}oselip(-fetish)?[ -]{1}([0-9]{4})/, i:[2], u:'http://www.roselip-fetish.com/movie/?num={0}'},
    {r:/[sS]{1}[mM]{1}[-_]{1}[mM]{1}iracle[ -]{1}e?([0-9]{4})/, i:[1], u:'http://sm-miracle.com/movie3.php?num=e{0}'},
    {r:/H4610[ -]{1}(ki[0-9]{6})/, i:[1], u:'http://www.h4610.com/moviepages/{0}/index.html'},
    {r:/H4610[ -]{1}(ori[0-9]{4})/, i:[1], u:'http://www.h4610.com/moviepages/{0}/index.html'},
    {r:/H4610[ -]{1}(pla[0-9]{4})/, i:[1], u:'http://www.h4610.com/moviepages/{0}/index.html'},
    {r:/H4610[ -]{1}(gol[0-9]{3,4})/, i:[1], u:'http://www.h4610.com/moviepages/{0}/index.html'},
    {r:/H0930[ -]{1}(ki[0-9]{6})/, i:[1], u:'http://www.h0930.com/moviepages/{0}/index.html'},
    {r:/H0930[ -]{1}(ori[0-9]{4})/, i:[1], u:'http://www.h0930.com/moviepages/{0}/index.html'},
    {r:/H0930[ -]{1}(pla[0-9]{4})/, i:[1], u:'http://www.h0930.com/moviepages/{0}/index.html'},
    {r:/H0930[ -]{1}(gol[0-9]{3,4})/, i:[1], u:'http://www.h0930.com/moviepages/{0}/index.html'},
    {r:/C0930[ -]{1}(ki[0-9]{6})/, i:[1], u:'http://www.c0930.com/moviepages/{0}/index.html'},
    {r:/C0930[ -]{1}(ori[0-9]{4})/, i:[1], u:'http://www.c0930.com/moviepages/{0}/index.html'},
    {r:/C0930[ -]{1}(pla[0-9]{4})/, i:[1], u:'http://www.c0930.com/moviepages/{0}/index.html'},
    {r:/C0930[ -]{1}(gol[0-9]{3,4})/, i:[1], u:'http://www.c0930.com/moviepages/{0}/index.html'},
    {r:/GirlsDelta ([0-9]{4})/, i:[1], u:'https://girlsdelta.com/product/{0}'},
    {r:/([a-zA-Z]{2,5}-[0-9]{2,5})/, i:[1], u:'http://www.javlibrary.com/en/vl_searchbyid.php?keyword={0}'},
  ];
  return hosts;
}

function isAV(jQueryObject) {
  var a = jQueryObject.find('td:nth-child(1) > a').first();
  return (a.attr('href') == '/?c=2_2');
}

function getTitle(jQueryObject) {
  var a = jQueryObject.find('td:nth-child(2) > a:last').first();
  return a.attr('title');
}

function matchHost(title, regex) {
  var match = regex.exec(title);
  if (match) {
    return match;
  }
  return undefined;
}

function setLink(jQueryObject, matched, link, indexes, transform) {
  var t = transform;
  if (t == undefined) {
    t = function(item, index) { return item; }
  }
  var td = jQueryObject.find('td:nth-child(3)').first();
	var finalLink = link.replace("{0}", t(matched[indexes[0]], 1));
	for(var i = 1; i < indexes.length; i++) {
		finalLink = finalLink.replace("{"+i+"}", t(matched[indexes[i]], i+1));
	}
  td.append($('<a href="' + finalLink + '"><i class="fa fa-fw fa-picture-o"></i></a>'))
}

function addLink(jQueryObject) {
  var title = getTitle(jQueryObject);
  var hosts = loadHosts();
  for(var i = 0; i < hosts.length; i++) {
    var matched = matchHost(title, hosts[i].r);
    if (matched != undefined) {
      setLink(jQueryObject, matched, hosts[i].u, hosts[i].i, hosts[i].t);
      break;
    }
  }
}

$('.default,.success').each(function (index, value) {
  var jQueryObject = $(this);
  if (isAV(jQueryObject)) {
    addLink(jQueryObject);
  }
}
)
