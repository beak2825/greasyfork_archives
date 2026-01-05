// ==UserScript==
// @name         block list
// @namespace    https://greasyfork.org/en/users/9054
// @version      0.1
// @description  enter something useful
// @author       ikarma
// @icon         http://www.mturkgrind.com/data/avatars/l/2/2601.jpg?1442882630
// @include      *google.com*
// @include      *bing.com*
// @grant        none
// @require      https://code.jquery.com/jquery-2.1.4.min.js

// @downloadURL https://update.greasyfork.org/scripts/13011/block%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/13011/block%20list.meta.js
// ==/UserScript==


var blockedURLs = [
    '123contractorquotes.com'
    ,'192.com'
    ,'411.com'
    ,'about-fl.com'
    ,'amfibi.company'
    ,'angieslist.com'
    ,'arizona-businessdirectory.com'
    ,'auto-glass-shops.cmac.ws'
    ,'bbb.org'
    ,'bestbusinessuk.com'
    ,'bloomberg.com'
    ,'bizapedia.com'
    ,'bizdb.co.uk'
    ,'british-companies.com'
    ,'builderquotes.com'
    ,'buildzoom.com'
    ,'checkcompany.co.uk'
    ,'corporationwiki.com'
    ,'companies-arizona.com'
    ,'companyplus.co.uk'
    ,'companycheck.co.uk'
    ,'companiesintheuk.co.uk'
    ,'datalog.co.uk'
    ,'duzlo.com'
    ,'duedil.com'
    ,'ehardhat.com'
    ,'endole.co.uk'
    ,'facebook.com'
    ,'findbusinessuk.com'
    ,'free-usinfo.com'
    ,'homeadvisor.com'
    ,'indeed.com'
    ,'indeed.co.uk'
    ,'jobsinracine.com'
    ,'jresume.com'
    ,'kompany.co.uk'
    ,'kompany.at'
    ,'kompany.it'
    ,'largepro.com'
    ,'linkedin.com'
    ,'localbusiness.nwfdailynews.com'
    ,'local.com'
    ,'loopnet.com'
    ,'louisianadirectory.co'
    ,'manta.com'
    ,'mapquest.com'
    ,'merchantcircle.com'
    ,'milwaukeejobs.com'
    ,'missouridirectory.co'
    ,'nexhit.com'
    ,'pennsylvania-businessdirectory.com'
    ,'pennsylvaniadirectory.co'
    ,'porch.com'
    ,'p-o.co.uk'
    ,'postcodefinder.guide'
    ,'profile.infofree.com'
    ,'rooferbids.com'
    ,'searchcandy.uk'
    ,'sphinxaur.com'
    ,'spokeo.com'
    ,'srw-engineering-inc.bonita-springs.fl.amfibi.company'
    ,'start.cortera.com'
    ,'standard.co.uk'
    ,'superpages.com'
    ,'theyellowpages.com'
    ,'towncontractors.com'
    ,'ukcompanydb.com'
    ,'ukcompanylist.com'
    ,'ukcorporatelist.com'
    ,'us-wi.bizdirlib.com'
    ,'us-open.biz'
    ,'usbizs.com'
    ,'whereorg.com'
    ,'whitepages.com'
    ,'yahoo.com'
    ,'yellow-pages.me'
    ,'yellowbook.com'
    ,'yellowpages.ca'
    ,'yellowpages.com'
    ,'yelp.com'
    ,'yell.com'

];



for (a = 0; a < blockedURLs.length; a++) {
    // google
    $("div[class='g']").has(":contains("+blockedURLs[a]+")").remove();
    $("div[class='_Xhb']").remove();                                         // removes google maps 
    $("#imagebox_bigimages").remove();                                       // removes image searches
    $("#extrares").remove();                                                 // removes related searches
    $("#appbar").remove();                                                   // removes top stuff
    // $(".crl , .st").hide();
    $(".crl , ._Bs , .mn-dwn-arw , .st , ._Rm").hide();
    $("#rcnt").click(function() {    
        $(".crl , ._Bs , .mn-dwn-arw , .st , ._Rm").show();
    });
    $("#hdtb-msb").click(function() {    
        $(".crl , ._Bs , .mn-dwn-arw , .st , ._Rm, G_URL").hide();
    });

    // bing
    $("li[class='b_algo']").has(":contains("+blockedURLs[a]+")").remove();
    $("ul[class='b_vList']").remove();                                       // removes yelp reviews on bing
    $("li[class='b_ans']").remove();                                         // removes suggested search results on bing
    $("li[class='b_ans b_top']").remove();                                   // removes suggested maps on bing
    $("div[class='b_vlist2col b_deep']").remove();                           // removes suggested maps on bing
    $("li[class='b_ad']").remove();                                          // removes top ad
    $("li[class='b_ad b_adBottom']").remove();                               // removes bottom ad



}




