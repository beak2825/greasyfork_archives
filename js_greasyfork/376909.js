// ==UserScript==
// @name         add_search
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://web.kosenctf.com:8400/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376909/add_search.user.js
// @updateURL https://update.greasyfork.org/scripts/376909/add_search.meta.js
// ==/UserScript==

(function() {
    'use strict';
var a = `<form class="text-light" enctype="multipart/form-data" action="/index.php" method="POST">
    <input type="hidden" id="search" name="search" value="true">
    <div class="form-group">
        <label for="image">Image</label>
        <input type="file" class="form-control-file" id="image" name="image">
    </div>
    <button type="submit" class="btn btn-primary">Search</button>
</form>`
$('form').after(a);
    // Your code here...
})();