// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-gray; icon-glyph: magic;
// ==UserScript==
// @name          Twitter Extra Bold Font with Font Size, Larger Avatars, Extra Bold Time, and Custom Element Styling
// @namespace     github.com/openstyles/stylus
// @match         *://twitter.com/*
// @description   A new userstyle for extra bold font on Twitter with custom font size, larger avatars, extra bold time, and custom element styling
// @author        You
// @version       1.4
// @downloadURL https://update.greasyfork.org/scripts/490364/Twitter%20Extra%20Bold%20Font%20with%20Font%20Size%2C%20Larger%20Avatars%2C%20Extra%20Bold%20Time%2C%20and%20Custom%20Element%20Styling.user.js
// @updateURL https://update.greasyfork.org/scripts/490364/Twitter%20Extra%20Bold%20Font%20with%20Font%20Size%2C%20Larger%20Avatars%2C%20Extra%20Bold%20Time%2C%20and%20Custom%20Element%20Styling.meta.js
// ==/UserScript==

(function() {
    var css = `

        :root {
           --twitter-font-weight: 800;
            --twitter-font-size: 100%;
            
            --custom-element-size-r9aemit: 13px;
          
            --time-font-weight: 800;
        }

        body, p, span, div {
            font-weight: var(--twitter-font-weight) !important;
            font-size: var(--twitter-font-size) !important;
        }

        time {
            font-weight: var(--time-font-weight) !important;
            font-size: 14px !important;
        }

        .r-9aemit,
        .r-9aemit span,
        .r-9aemit p {
            font-size: var(--custom-element-size-r9aemit) !important;
            /* Add any other styling you want for the text inside this element */
        }



        /* Less Transparent Border */
        .r-1igl3o0 {
            border-bottom-color: rgb(18, 22, 34);
          
        }

        .r-1janqcz {
            font-size: 12px !important;
            transform: scale(.9)
        }

        .r-172uzmj {
            border: 3px
        }

         div.css-1dbjc4n.r-1adg3ll.r-1a8r3js {
            font-size: 13px !important;
        }

        .r-1kqtdi0 {
            border-color: rgb(18, 31, 39)
        }

        .r-2sztyj {
            border-top-color: rgb(18, 31, 39)
        
        }

        .r-kemksi {
            background-color: rgb(6, 12, 17)
        }

       .r-1vr29t4 {
            font-size: 20px !important
        }

        /*search*/
     

        .r-13rk5gd::placeholder {
            font-weight: 800;
            font-size: 16.4px;
        }

        .r-1dqbpge {
            height: 100% !important;
        }


        .r-30o5oe {
            font-weight: 800; 
            color: rgb(214, 216, 218);
            height: 2.5em;
        }

        .r-1bnu78o {
            background-color: rgb(18, 31, 39) }
        

           

    }
    `;

    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
})();