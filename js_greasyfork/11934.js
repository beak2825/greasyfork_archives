// ==UserScript==
// @name         Justifeed
// @namespace    http://flowbooks.fr/
// @version      12.91
// @description  n userscript vraiment leger pour justifier les données des sites d'infos français et d'augmenter un peu la taille de lecture.
// @author       Antoine Tagah
// @include        http://*.lemonde.fr/*
// @include        http://*.*.lemonde.fr/*
// @include        http://*.nextinpact.com/*
// @include        http://*.slate.fr/*
// @include        http://lareclame.fr/*
// @include        http://*.petitweb.fr/*
// @include        http://*futura-sciences.com/*
// @include        http://*.esperanto-france.org/*
// @include        https://reflets.info/*
// @include        http://www.angersmag.info/*
// @include        http://*.francetvinfo.fr/* 
// @include        http://rue89.nouvelobs.com/* 
// @include        https://www.instapaper.com/* 
// @include        http://v2.wallabag.org/* 
// @include        http://www.arretsurimages.net/*
// @include        http://www.presse-citron.net/*
// @include        http://www.ozap.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11934/Justifeed.user.js
// @updateURL https://update.greasyfork.org/scripts/11934/Justifeed.meta.js
// ==/UserScript==


 url= document.URL;

if (/blog.lemonde.fr/.test(url)) {
      var ele = document.getElementsByClassName("entry-content");
    var nb= 0;
    while(ele[nb] !== "")
    {
        var el = ele[nb];
        el.style.fontSize="19px";
        el.style.fontFamily="'Slabo 27px'";
        el.style.TextIndent="10px";
        el.style.wordSpacing="2px";
        el.style.textAlign="justify";
        el.style.textIndent="15px";
        nb = ++nb;
    }
}
else if (/petitweb.fr/.test(url)) {
      var ele = document.getElementsByClassName("entry-content");
    var nb= 0;
    while(ele[nb] !== "")
    {
        var el = ele[nb];
        el.style.fontSize="19px";
        el.style.fontFamily="'Slabo 27px', Bookerly, Arvo";
        el.style.TextIndent="10px";
        el.style.wordSpacing="2px";
        el.style.textAlign="justify";
        el.style.textIndent="15px";
        nb = ++nb;
    }
}
else if (/lareclame.fr/.test(url)) {
      var ele = document.querySelectorAll(".single-post-wrapper .post-text p");
    var nb= 0;
    while(ele[nb] !== "")
    {
        var el = ele[nb];
        el.style.fontSize="19px";
        el.style.fontFamily="'Slabo 27px', Bookerly, Arvo";
        el.style.TextIndent="10px";
        el.style.wordSpacing="2px";
        el.style.textAlign="justify";
        el.style.textIndent="15px";
        nb = ++nb;
    }
}else if (/presse-citron.net/.test(url)) {
      var ele = document.querySelectorAll(".post-content");
    var nb= 0;
    while(ele[nb] !== "")
    {
        var el = ele[nb];
        el.style.fontSize="19px";
        el.style.fontFamily="'Slabo 27px', Bookerly, Arvo";
        el.style.TextIndent="10px";
        el.style.wordSpacing="2px";
        el.style.textAlign="justify";
        el.style.textIndent="15px";
        nb = ++nb;
    }
}
else if (/futura-sciences.com/.test(url)) {
      var ele = document.querySelectorAll(".article-column .zeta");
    var nb= 0;
    while(ele[nb] !== "")
    {
        var el = ele[nb];
        el.style.fontSize="19px";
        el.style.fontFamily="'Slabo 27px', Bookerly, Arvo";
        el.style.TextIndent="10px";
        el.style.wordSpacing="2px";
        el.style.textAlign="justify";
        el.style.textIndent="15px";
        nb = ++nb;
    }
}

else if (/lemonde.fr\/afrique/.test(url)) {
    var ele = document.getElementsByClassName("content-article-body");
var el = ele[0];
}

else if (/lemonde.fr/.test(url)) {
    var el = document.getElementById('articleBody');
}
else if (/ozap.com/.test(url)) {
    var el = document.getElementById('fullpage');
}
else if (/esperanto-france.org/.test(url)) {
    var el = document.getElementById('texte-article');
}
else if (/rue89.nouvelobs.com/.test(url)) {
    var ele = document.getElementsByClassName("article__content");
var el = ele[0];
}
else if (/slate.fr/.test(url)) {
    var ele = document.getElementsByClassName("article_content");
var el = ele[0];
}
else if (/reflets.info/.test(url)) {
    var ele = document.getElementsByClassName("entry-content");
var el = ele[0];
}
else if (/angersmag.info/.test(url)) {
    var ele = document.getElementsByClassName("access");
    var nb= 0;
    while(ele[nb] !== "")
    {
        var el = ele[nb];
        el.style.fontSize="19px";
        el.style.fontFamily="'Slabo 27px', Bookerly, Arvo";
        el.style.TextIndent="10px";
        el.style.wordSpacing="2px";
        el.style.textAlign="justify";
        el.style.textIndent="15px";
        nb = ++nb;
    }
}
else if (/geopolis.francetvinfo.fr\/bureau-londres/.test(url)) {
      var ele = document.querySelectorAll("article p, article>.text, article>.left-wrapper>.text");
    var nb= 0;
    while(ele[nb] !== "")
    {
        var el = ele[nb];
        el.style.fontSize="19px";
        el.style.fontFamily="'Slabo 27px', Bookerly, Arvo";
        el.style.TextIndent="10px";
        el.style.wordSpacing="2px";
        el.style.textAlign="justify";
        el.style.textIndent="15px";
        nb = ++nb;
    }
}
else if (/geopolis.francetvinfo.fr\/bureau-londres/.test(url)) {
      var ele = document.querySelectorAll("article p, article>.text, article>.left-wrapper>.text");
    var nb= 0;
    while(ele[nb] !== "")
    {
        var el = ele[nb];
        el.style.fontSize="19px";
        el.style.fontFamily="'Slabo 27px', Bookerly, Arvo";
        el.style.TextIndent="10px";
        el.style.wordSpacing="2px";
        el.style.textAlign="justify";
        el.style.textIndent="15px";
        nb = ++nb;
    }
}
else if (/v2.wallabag.org/.test(url)) {
     var ele = document.querySelectorAll("#article");
    var nb= 0;
    while(ele[nb] !== "")
    {
        var el = ele[nb];
        el.style.fontSize="19px";
        el.style.fontFamily="'Slabo 27px', Bookerly, Arvo";
        el.style.TextIndent="10px";
        el.style.wordSpacing="2px";
        el.style.textAlign="justify";
        el.style.textIndent="15px";
        nb = ++nb;
    }
}else if (/zestedesavoir.com/.test(url)) {
    var ele = document.getElementsByClassName("article-content");
var el = ele[0];
}
else if (/www.arretsurimages.net/.test(url)) {
    var ele = document.getElementsByClassName("contenu-html");
var el = ele[0];
}
else if (/francetvinfo.fr/.test(url)) {
          var ele = document.querySelectorAll("article p, article>.text, article>.left-wrapper>.text");
    var nb= 0;
    while(ele[nb] !== "")
    {
        var el = ele[nb];
        el.style.fontSize="19px";
        el.style.fontFamily="'Slabo 27px', Bookerly, Arvo";
        el.style.TextIndent="10px";
        el.style.wordSpacing="2px";
        el.style.textAlign="justify";
        el.style.textIndent="15px";
        nb = ++nb;
    }
}
else if (/nextinpact.com/.test(url)) {
    var ele =  document.querySelectorAll(".article_content p");
     var nb= 0;
    while(ele[nb] !== "")
{
var el = ele[nb];
el.style.fontSize="19px";
el.style.fontFamily="'Slabo 27px', Bookerly, Arvo";
el.style.TextIndent="10px";
el.style.wordSpacing="2px";
el.style.textAlign="justify";
el.style.textIndent="15px";
nb = ++nb;
}
}
else{
    var ele = document.getElementsByTagName("article");
var el = ele[0];
}

//el.setAttribute('style', 'text-align: justify; word-spacing: 2px;');
el.style.fontSize="19px";
el.style.fontFamily="'Slabo 27px', Bookerly, Arvo";
el.style.TextIndent="10px";
el.style.wordSpacing="2px";
el.style.textAlign="justify";
el.style.textIndent="15px";

if(document.createElement){
  head=document.getElementsByTagName('head').item(0);
  script=document.createElement('script');
  script.src='http://sd-g1.archive-host.com/membres/up/3cae4e4a561c71fb9af9e0fe3052acfc9ed06627/Hyphenator.js?bm=true';
  script.type='text/javascript';
  head.appendChild(script);
}
