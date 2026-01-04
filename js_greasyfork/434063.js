// ==UserScript==
// @name         KU Leuven E-Sources
// @namespace    http://guusleenders.me/
// @version      0.2
// @description  Redirect to KU Leuven E-Sources for scientific articles
// @author       Guus Leenders
// @match        *ieeexplore.ieee.org/abstract/document/*
// @match        *ieeexplore.ieee.org/document/*
// @match        *.sciencedirect.com/science/article/pii*
// @match        *.sciencedirect.com/science/article/abs/pii*
// @match        *avs.scitation.org/doi/abs/*
// @match        *link.springer.com/*
// @match        *iopscience.iop.org/article/*
// @match        *.tandfonline.com/doi/full/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434063/KU%20Leuven%20E-Sources.user.js
// @updateURL https://update.greasyfork.org/scripts/434063/KU%20Leuven%20E-Sources.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var loc = window.location.toString();
    if(loc.includes("ieeexplore.ieee.org")){
        window.location=window.location.toString().replace("ieeexplore.ieee.org",'ieeexplore-ieee-org.kuleuven.e-bronnen.be');
    }
    if(loc.includes("avs.scitation.org")){
        window.location=window.location.toString().replace("avs.scitation.org",'avs-scitation-org.kuleuven.e-bronnen.be');
    }
    if(loc.includes("sciencedirect.com")){
        window.location=window.location.toString().replace("sciencedirect.com",'www-sciencedirect-com.kuleuven.e-bronnen.be').replace("www.","");
    }
    if(loc.includes("link.springer.com")){
        window.location=window.location.toString().replace("link.springer.com",'link-springer-com.kuleuven.e-bronnen.be');
    }
    if(loc.includes("iopscience.iop.org")){
        window.location=window.location.toString().replace("iopscience.iop.org",'iopscience-iop-org.kuleuven.e-bronnen.be');
    }
    if(loc.includes("tandfonline.com")){
        window.location=window.location.toString().replace("tandfonline.com",'www-tandfonline-com.kuleuven.e-bronnen.be').replace("www.","");
    }
})();