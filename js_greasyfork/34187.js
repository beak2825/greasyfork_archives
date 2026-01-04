// ==UserScript==
// @name        imageresizer
// @namespace   https://greasyfork.org/en/users/23401-theigno
// @description Script to resize images on various sites
// @include     *//pbs.twimg.com/media/*
// @include     *//images-na.ssl-images-amazon.com/*
// @include     *//shopping.toei-anim.co.jp/system-img/*
// @include     *//bandai-a.akamaihd.net/*
// @include     *.media.tumblr.com/*
// @include     *i.ebayimg.com/*
// @include     *whstatic.com/*
// @include     *wikimon.net/*
// @include     *wikihow.com/*
// @include     *i.pinimg.com/*
// @version     1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/34187/imageresizer.user.js
// @updateURL https://update.greasyfork.org/scripts/34187/imageresizer.meta.js
// ==/UserScript==
if (window.location.href.match(/(pbs\.twimg\.com\/media\/[^.]+\.(jpg|png|gif))(:large)?(?!:orig)/)) {
  window.location.href = window.location.href.replace(/(pbs\.twimg\.com\/media\/[^.]+\.(jpg|png|gif))(:large)?(?!:orig)/, "$1:orig")
}
if (window.location.href.match(/images-na\.ssl-images-amazon\.com\/images\/(.+)\._[A-z][A-z][0-9]+_\.(.+)$/)) {
  window.location.href = window.location.href.replace(/images-na\.ssl-images-amazon\.com\/images\/(.+)\._[A-z][A-z][0-9]+_\.(.+)$/, "images-na\.ssl-images-amazon\.com\/images\/$1\.$2")
}
if (!window.location.href.match(/shopping\.toei-anim\.co\.jp\/system-img\/0\/0(\/.+$)/)) {
  if (window.location.href.match(/shopping\.toei-anim\.co\.jp\/system-img\/[0-9]+\/[0-9]+(\/.+$)/)) {
    window.location.href = window.location.href.replace(/shopping\.toei-anim\.co\.jp\/system-img\/[0-9]+\/[0-9]+(\/.+$)/, "shopping.toei-anim.co.jp/system-img/0/0$1")
  }
}
if (!window.location.href.match(/bandai-a\.akamaihd\.net\/bc\/img\/model\/xl\//)) {
  if (window.location.href.match(/bandai-a\.akamaihd\.net\/bc\/img\/model\/[A-z][A-z]?\//)) {
    window.location.href = window.location.href.replace(/bandai-a\.akamaihd\.net\/bc\/img\/model\/[A-z][A-z]?\//, "bandai-a.akamaihd.net/bc/img/model/xl/")
  }
}
if (!window.location.href.match(/media\.tumblr\.com\/([^\/]+)\/?([^\.]+_)1280/)) {
  if (window.location.href.match(/media\.tumblr\.com\/[^\/]+\/?[^\.]+_[0-9]+(\.jpg|.\png|\.gif)/)) {
    window.location.href = window.location.href.replace(/media\.tumblr\.com\/([^\/]+\/?[^\.]+_)[0-9]+(\.jpg|.\png|\.gif)/, "media.tumblr.com/$11280$2")
  }
}
if (!window.location.href.match(/i\.ebayimg\.com\/images\/[a-z]\/[^\/]+\/s-l9999\.png/)) {
  if (window.location.href.match(/i\.ebayimg\.com\/images\/[a-z]\/[^\/]+\/s-l[0-9]+/)) {
    window.location.href = window.location.href.replace(/s-l[0-9]+\.jpg/, "s-l9999.png")
  }
}
if ((window.location.href.match(/whstatic\.com/) || window.location.href.match(/wikimon\.net/) || window.location.href.match(/wikihow\.com/)) && window.location.href.match(/thumb/)) {
  window.location.href = window.location.href.replace(/\/[^\/]+$/, "").replace(/thumb\//, "")
}
if (window.location.href.match(/i\.pinimg\.com/)) {
  if (!window.location.href.match(/\/originals\//)) {
    window.location.href = window.location.href.replace(/\.com\/[^\/]*\//, ".com/originals/")
    localStorage.setItem("attempt", 0)
  }
  else if (document.getElementsByTagName("Error").length !== 0) {
    if (localStorage.getItem("attempt") === 0) {
      window.location.href = window.location.href.replace(/(jpg|png)$/, "gif")
      localStorage.setItem("attempt", 1)
    }
    else {
      if (window.location.href.match(/(png|gif)$/)) {
        window.location.href = window.location.href.replace(/(png|gif)$/, "jpg")
        localStorage.setItem("attempt", 0)
      }
      if (window.location.href.match(/(jpg|gif)$/)) {
        window.location.href = window.location.href.replace(/(jpg|gif)$/, "png")
        localstorage.setItem("attempt", 0)
      }
    }
  }
  else {
    localStorage.setItem("attempt", 1)
  }
}