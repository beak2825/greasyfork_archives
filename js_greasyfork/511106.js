// ==UserScript==
// @name          Redditold
// @namespace     github.com/openstyles/stylus
// @match         *://old.reddit.com/*
// @description   Moves the Reddit post thumbnail to the right and scales it
// @author        You
// @version       1.1

// @downloadURL https://update.greasyfork.org/scripts/511106/Redditold.user.js
// @updateURL https://update.greasyfork.org/scripts/511106/Redditold.meta.js
// ==/UserScript==
(function() {
    var css = `
    .hidesidebar {
        text-orientation: sideways;
    }
    
    .listing-chooser {
        display: none !important;
    }

    .thumbnail {
    float: right; /* or use flexbox/grid to reorder the elements */
    margin-left: 8px; /* adds spacing between the thumbnail and the post content */
    margin-right: 10px;
    transform: scale(1.2);
                border-radius: 5px; /* Adds rounded corners */

    }
    .link {
        margin-left: -15px; /* Move entire posts to the left */
       padding-bottom:11px; 
    }
    .link .title{
    color: #eef1f3;
}
.link .title {
        font-weight: bold; /* Change font weight to bold */
    }
    .ore-new-comments {
    color:#d93900;
}
.tagline, .search-result-meta{
    color:#b7cad4
}
.tagline a, .search-result-meta a {
color:#b7cad4;
}

.domain  {
    color: #b7cad4;
    
} 
.domain a {
        color: #b7cad4;

}
 .entry .buttons li a{
    
          color:#b7cad4!important;

}
body{
background-color:black;
}
.thing .title:visited {
    color:#1a6bbb;
}

.thing .title.ore-visited {
     color:#1a6bbb;
    
}

.thumbnail.self{
     filter: invert(1);
}
.expando-button{
        filter: invert(1);
 
}

    `;

    // Create a new style element
    var style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));

    // Append the style element to the head of the document
    document.head.appendChild(style);
})();