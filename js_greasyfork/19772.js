// ==UserScript==
// @name         Set up a community report page
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Selects the "wrong category" option from the list and starts the explanation text
// @author       Sarah King
// @match        http://www.trademe.co.nz/Browse/CommunityWatch.aspx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19772/Set%20up%20a%20community%20report%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/19772/Set%20up%20a%20community%20report%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var splitUrl = function() {
        var vars = [], hash;
        var url = document.URL.split('?')[0];
        var p = document.URL.split('?')[1];
        if(p !== undefined){
            p = p.split('&');
            for(var i = 0; i < p.length; i++){
                hash = p[i].split('=');
                vars.push(hash[1]);
                vars[hash[0]] = hash[1];
            }
        }
        vars['url'] = url;
        return vars;
    };

    var rptpath = splitUrl().rptpath;

    //console.log( 'mobile-phones%2Fmobile-phones'.length);

    $( "select[name*='complaint_subject_id']" ).val(19);
    var comment = $( "textarea[name*='body']" );

    if (rptpath !== undefined){
        if (rptpath == '341-887-1099-'){
            comment.text('Belongs in Sewing Machine Accessories');
        }
        else if (rptpath.substr(0,29) == 'mobile-phones%2Fmobile-phones' || rptpath.substr(0,11) == '344-422-430'){
            comment.text('Belongs in Mobile Phones | Accessories or one of the subcategories.');
        }
        else if (rptpath == 'jewellery-watches%2Fearrings%2Fdiamond'){
            comment.text('Belongs in the Crystal or Cubic Zirconia sections. These earrings are not diamond');
        }
        else if (rptpath == 'jewellery-watches%2Fearrings%2Fplain-gold'){
            comment.text('These earrings are not plain gold and should be listed in another section');
        }
        else if (rptpath == '595' || rptpath == '5-380-595-'){
            comment.text('This item is either a component/part of a bike, clothing or it is a kids bike. None of these should be listed as a BMX bike.');
        }
        else if (rptpath == '341-4408-4413-'){
            comment.text('This item is not a cross stitch kit and should be listed elsewhere');
        }
    }
    //mobile-phones/accessories
})();