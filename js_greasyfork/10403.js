// ==UserScript==
// @name         Dropbox convert to direct link
// @namespace    http://greasyfork.org/de/users/7597
// @version      0.1
// @description  Removes www and change https to http and dl=0 to dl=1
// @author       Djamana
// @match        *://*.dropbox.com/*
// @-match        *://*.dropbox.com/sm/share_link/*
// @grant        none
// @icon         https://cf.dropboxstatic.com/static/images/icons/blue_dropbox_glyph-vflJ8-C5d.png
// @downloadURL https://update.greasyfork.org/scripts/10403/Dropbox%20convert%20to%20direct%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/10403/Dropbox%20convert%20to%20direct%20link.meta.js
// ==/UserScript==


    function applyBeautifyDirectlink () {
        
        // Get
        var El     = document.querySelector('.text-input-input[value]')
        if (El) {


            // Transform
            var ElVal = El.value
            var NewVal = ElVal.replace(/(http)s?(:\/\/)www\.(.*dl=)0/, "$1$2$31")
            
            if (ElVal != NewVal) {
                
                // Set
                El.value = NewVal
            }
        }

        //var El = document.querySelector('.text-input-input[value]');El.value = El.value.replace(/(http)s?(:\/\/)www\.(.*dl=)0/, "$1$2$31")
    }
    
    setInterval (applyBeautifyDirectlink, 1000)