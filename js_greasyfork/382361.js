// ==UserScript==
// @name     _Override banner_url styles
// @include  https://tengaged.com/settings/avatar
// @grant    GM_addStyle
// @description tengaged
// @run-at   document-start
// @version 0.0.1.20190429080022
// @namespace https://greasyfork.org/users/296243
// @downloadURL https://update.greasyfork.org/scripts/382361/_Override%20banner_url%20styles.user.js
// @updateURL https://update.greasyfork.org/scripts/382361/_Override%20banner_url%20styles.meta.js
// ==/UserScript==

GM_addStyle ( `
    h1.full {
       visibility: hidden;
       position: relative;
}

    h1.full:after {
        content: "Welcome to your wardrobe.";
        position: absolute;
        visibility: visible;
        text-align: left;
        color: black;

}

   body {
      background-image: url("https://media1.tenor.com/images/29af7418fec54484257afee05365b948/tenor.gif?itemid=3568154");
}

   h2 {
      color:black;
}


` );