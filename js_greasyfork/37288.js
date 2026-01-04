// ==UserScript==
// @name     Frequency Image Full Size
// @description Twitter bcy.net weibo full Size
// @include     http://*.sinaimg.cn/*
// @include     https://*.sinaimg.cn/*
// @include     https://pbs.twimg.com/media/*
// @include     https://img5.bcyimg.com/coser/*
// @include     https://img9.bcyimg.com/coser/*
// @version  2.2
// @grant    none
// @namespace https://greasyfork.org/users/164357
// @downloadURL https://update.greasyfork.org/scripts/37288/Frequency%20Image%20Full%20Size.user.js
// @updateURL https://update.greasyfork.org/scripts/37288/Frequency%20Image%20Full%20Size.meta.js
// ==/UserScript==
let href = document.location.href;

if(href.includes('twimg')){
    if(href.includes('.jpg') && !href.includes(':orig')){
          document.location.href = href.replace(/.jpg:thumb|.jpg:small|.jpg:large|.jpg/,'?format=jpg&name=orig');
    }
    else if(href.includes('.png') && !href.includes(':orig')){
          document.location.href = href.replace(/.png:thumb|.png:small|.png:large|.png/,'?format=png&name=orig');
    }

    else if(href.includes('?format=') && !href.includes('&name=orig')){
       if(href.search(/900x900|medium|360x360|small/) != -1){
          document.location.href = href.replace(/900x900|medium|360x360|small/,'orig');
        }
       else{
           var adding = '&name=orig';
           document.location.href = href+adding;
       }
    }
}
else if(href.includes('w650')){
  document.location.href = href.replace(/\/w650/,' ');
}
else if(href.includes('imageMogr2')){
    document.location.href = href.substring(0,href.indexOf('?'));
    }
else if(href.includes('mw690')){
  document.location.href = href.replace('mw690','large');
}