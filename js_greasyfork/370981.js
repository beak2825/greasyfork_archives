// ==UserScript==
// @name         maven仓库加序号
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       InoriHimea
// @match        *://repo2.maven.org/maven2/*
// @match        *://repo1.maven.org/maven2/*
// @match        *://repo.maven.apache.org/maven2/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/1.7.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/370981/maven%E4%BB%93%E5%BA%93%E5%8A%A0%E5%BA%8F%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/370981/maven%E4%BB%93%E5%BA%93%E5%8A%A0%E5%BA%8F%E5%8F%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('a').each(function(index) {

       var aTagText = $(this).text();
       $(this).text((index + 1) + ":" + aTagText);
    });
})();