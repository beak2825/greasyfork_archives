// ==UserScript==
// @name         ExCSS
// @author       Hauffen
// @description  Modify EH/X layout to emulate legacy.
// @version      1.0
// @include      /https?:\/\/(e-|ex)hentai\.org\/.*/
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @namespace https://greasyfork.org/users/285675
// @downloadURL https://update.greasyfork.org/scripts/381391/ExCSS.user.js
// @updateURL https://update.greasyfork.org/scripts/381391/ExCSS.meta.js
// ==/UserScript==

(function() {
    var s = `<style data-jqstyle="ExCSS">body {
    background: #1e272e;
    font-family: Arial, Symbola;
}

a {
    cursor:pointer;
}

div.ido {
    background: #485460;
    border: 1px solid rgba(0, 0, 0, 0.5);
    padding-bottom: 20px;
}

div.idi {
    background: #1e272e50;
}

div.cs {
    text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
}

input[type="text"],
input[type="password"],
select,
textarea {
    border: 1px solid #485460;
}

input,
select,
option,
optgroup,
textarea {
    background-color: #1e272e;
}

input[type="button"],
input[type="submit"] {
    border: 2px solid #485460;
}

table.ptt td {
    background: #48546050;
    border: 1.5px solid #000000;
    border-bottom: 1.5px solid #000000;
    padding: 3px;
}

td.ptds {
    background: #1e272ed0 !important;
}

td.ptds:hover {
    color: #DDD !important;
    background: #1e272e50 !important;
}

td.ptdd {
    color: #1e272e !important;
}

td.ptdd:hover {
    color: #DDD !important;
    background: #1e272e50 !important;
}

table.ptt td:hover {
    background: #1e272e50;
}

table.ptb {
    font-size: 12pt;
}

table.ptb td {
    background: #48546050;
    border: 1px solid #000000;
    border-top: 1px solid #000000;
    padding: 3px;
}

table.ptb td:hover {
    background: #1e272e50;
}

div.itg {
    max-width: none;
    border-top: none;
    border-bottom: none;
    margin-bottom: 10px;
}

.gld {
    border-left: none;
}

.gl1t {
    background: #1e272e50 !important;
    border: 1px solid rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.5);
    border-right: 1px solid rgba(0, 0, 0, 0.5);
    position: relative;
    margin: 10px;
    min-height: 445px;
    max-width:250px;
}

.gl4t {
    font-weight: bold;
    text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
}

.gl3t {
    border-radius: 0px;
}

.gl5t {
    position: absolute;
    bottom: 18px;
    left: 20px;
}

div.gm,
div#gd2,
div#gright,
div#gmid {
    background: #485460;
}

div#gdt {
    background: #485460;
}

div.c2 {
    background: #1e272e;
}

div.thd,
div.tha {
    border: 1px solid #444;
    color: #444;
}

div.ths {
    background: #485460;
    border: 1px solid black;
}

div.gt {
    background: #485460;
    border: 1px solid #DDD;
}

div.gtl {
    background: #485460;
    border: 1px dashed #DDD;
}

div.gtw {
    background: #485460;
    border: 1px dotted #DDD;
}

div.gl3t {
    position: absolute;
    top: 38px;
    left: -1px;
}

div.gl4t {
    max-height: none;
    height: 32px;
}

div.gl4t:hover {
    overflow: visible;
    z-index: 1;
    background: rgba(0, 0, 0, 0.5);
    height: auto;
}

input[type="text"]:enabled:hover,
input[type="password"]:enabled:hover,
select:enabled:hover,
textarea:enabled:hover,
input[type="text"]:enabled:focus,
input[type="password"]:enabled:focus,
select:enabled:focus,
textarea:enabled:focus {
    background-color: rgba(255, 255, 255, 0.1);
}

input[type="button"]:enabled:hover,
input[type="submit"]:enabled:hover,
input[type="button"]:enabled:focus,
input[type="submit"]:enabled:focus {
    background-color: rgba(255, 255, 255, 0.1) !important;
    border-color: #DDD !important;
}

.lc:hover input:enabled ~ span,
.lr:hover input:enabled ~ span,
.lc input:enabled:focus ~ span,
.lr input:enabled:focus ~ span,
div.fp:hover {
    background-color: rgba(255, 255, 255, 0.1) !important;
    border-color: #DDD !important;
}

.glname a:visited,
.glname a:active {
    color: #DDD;
}

table.mt,
tr.gtr1,
.stuffbox,
div.sni {
    background: #485460;
}

table.itg > tbody > tr:nth-child(2n+1),
table.itg > tbody > tr > th {
    background: #1e272e50;
}

table.itg > tbody > tr:nth-child(2n+2) {
    background: #485460;
}

tr.gtr,
tr.gtr0 {
    background: #1e272e50;
}

div[id^="cell_"] {
    background: #1e272e50;
}

div#db {
    background: #485460;
}

.lr > span,
.lc > span {
    background: #1e272e;
}

div.fps {
    background: #1e272e;
    border: 1px solid #000;
    padding-top: 6px !important;
}

div.fp {
    border-radius: 0px;
}

.gl5t > div:nth-child(1) > div:nth-child(2),
.gl5t > div:nth-child(2) > div:nth-child(2) {
    border: none !important;
    background-color: rgba(0, 0, 0, 0) !important;
    top: 29px;
}

div#torrentinfo > div:last-child {
    border: none !important;
}

div#torrentinfo form > div {
    border: 1px solid #000 !important;
}

div#torrentinfo form:last-child > div {
    border: none !important;
}

table.itg {
    border: 2px solid transparent;
}</style>`;

    $(s).appendTo("head");
})();