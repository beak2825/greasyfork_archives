// ==UserScript==
// @name         iqdb.org移动版
// @name:en      iqdb.org for mobile
// @namespace    pikashi
// @version      0.10
// @description  make iqdb.org uses more easier on your phones
// @description:en make iqdb.org uses more easier on your phones
// @author       pks
// @match        http://iqdb.org/*
// @match        https://iqdb.org/*
// @match        http://*.iqdb.org/*
// @match        https://*.iqdb.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30852/iqdborg%E7%A7%BB%E5%8A%A8%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/30852/iqdborg%E7%A7%BB%E5%8A%A8%E7%89%88.meta.js
// ==/UserScript==

(function() {
    var meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0';
    document.head.appendChild(meta);

    var css = document.createElement('style');
    css.textContent = `
@media screen and (max-width: 768px) {
body {
font-size: 16px;
}

h1 {
font-size: 1.75rem;
}

p {
font-size: 0.8rem;
}

table {
font-size: 0.75rem !important;
}

#url {
min-width: 55vw;
max-width: 60vw;
}

#file {
max-width: 55vw;
}

form table:last-of-type,form table:last-of-type input {
font-size: 1.25rem !important;
}

form table:first-of-type {
max-height: 38vh;
overflow-y: auto;
display: block;
width: 90vw;
}

form table:first-of-type th {
white-space: normal;
width: 61vw;
}

input[type="submit"] {
width: 27vw;
}

input[type="submit"], input[type="file"], input[type="text"] {
height: 35px;
}

#pages a {
font-size: 1.3rem;
}
}
`;
    document.head.appendChild(css);
})();