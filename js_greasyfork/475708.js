// ==UserScript==
// @name         baidu and google search switch
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  baidu 和 google搜索切换
// @author       You
// @match        https://www.google.com/*
// @match        https://www.google.com.*
// @match        https://www.baidu.com/s*
// @require	 https://code.jquery.com/jquery-1.11.2.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475708/baidu%20and%20google%20search%20switch.user.js
// @updateURL https://update.greasyfork.org/scripts/475708/baidu%20and%20google%20search%20switch.meta.js
// ==/UserScript==

if (location.href.startsWith('https://www.google.com')) {
  console.log($('button[type="submit"]').length)
    var image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAeFBMVEX////P4v+oxf+cw/8Ae/8jgv89kP+Nuv/x+P8ziP91q/8Zf/8vhv8bgP9anP+yzv+/1/+81P+tyf9Pl//v9v/g7f/I3v97sP8Lff80jP8phP9iov/o8f+Yv//4/P+OuP+GtP8AeP+xzP83jv/Z6f/U5f92rP8Acf9+o+6nAAABdUlEQVR4AazS1aLDIAwA0HQD1iykTpG5//8f3sJcn25eKjloAv8a2Sj7mR8LKcbpRU0+5XOBiCIHmJLm4gMo5QBkCRUNT6rfQZNAA60ennr6HRB+AJ0B6NPUPeg4Az8vYYVrO/ABgweYDUDjU75yiEFB54XvAObELA3k3R0U+jw55JcBFUArXDBXQHje3kMs4o7dEs4h7sDU59tOZ+XyApSOoAboWseEcWYfx4TVBZQOURPAUkepaX4B8laS9UZ4AzALGEN7AJXA9qWajMxp6iks4qQif847ZNMnIdew2O3a7Pk2SQ9D9oxxH+69IQpJ7axYHlh5jV7RazVVoD4+DwhbyQacfG6ZY5ANlF5H0Eg+gMOgnruNOtigeABI1R1kfAYugpGkBML6Dg6MXIHdnCI4eNy/glSuVP/9Zh4fCYwewDQg0nHbNJPAk6ZpthJRmAewVByCZBKC2ZGUQ97Zl0LMhliV2eFQrZQg4Zu/4c2FIiTkaACw8Ro1SK8bXQAAAABJRU5ErkJggg=='
    $('button[type="submit"]').before($('<img>', {src:image, css:{width:'22px', height:'22px', margin:'auto 14px auto 8px', cursor:'pointer',}, click:function() {
     location.href = 'https://www.baidu.com/s?ie=utf-8&wd=' + encodeURI($('textarea')[0].value)
  }}))
}

if (location.href.startsWith('https://www.baidu.com/s')) {
    $('input[type="submit"]').val('Google一下')
    $('input[type="submit"]').off('click')
    $('input[type="submit"]').on('click', function() {
      location.href = 'https://www.google.com.hk/search?q=' + encodeURI($('#kw').val())
    })
}