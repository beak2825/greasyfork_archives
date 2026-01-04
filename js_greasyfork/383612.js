// ==UserScript==
// @name         NZ Herald premium fix
// @namespace    https://greasyfork.org/en/users/814-bunta
// @version      1.7
// @description  try to take over the world!
// @author       Bunta
// @match        https://www.nzherald.co.nz/*
// @license      http://creativecommons.org/licenses/by-nc-sa/3.0/us/
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/383612/NZ%20Herald%20premium%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/383612/NZ%20Herald%20premium%20fix.meta.js
// ==/UserScript==

/* Load jQuery in console
var scr = document.createElement("script");
scr.src = "http://code.jquery.com/jquery-3.4.1.min.js";
document.body.appendChild(scr);
*/

// Check if page is premium
//if ( $(".article__header-premium").length === 0 ) { return; }

// Display premium Content
/* Old Method
$("p.ziKrjEJtYlqnC").removeClass("ziKrjEJtYlqnC").css('display', '');
$(".FeYlbSjIgMr").removeClass("FeYlbSjIgMr").css('display', '');
$("span.FeYlbSjIgMr").append( `<span class="ziKrjEJtYlqnC" style="display:none;">Fake News</span>` );
$("div.article__raw-html__top").after( `<p class="ziKrjEJtYlqnC" style="display:none;"> Fake News</p>
<p class="ziKrjEJtYlqnC" style="display:none;"> Fake News</p>
<p class="ziKrjEJtYlqnC" style="display:none;"> Fake News</p>
<p class="ziKrjEJtYlqnC" style="display:none;"> Fake News</p>
<p class="ziKrjEJtYlqnC" style="display:none;"> Fake News</p>
<p class="ziKrjEJtYlqnC" style="display:none;"> Fake News</p>
<p class="ziKrjEJtYlqnC" style="display:none;"> Fake News</p>
<p class="ziKrjEJtYlqnC" style="display:none;"> Fake News</p>
<p class="ziKrjEJtYlqnC" style="display:none;"> Fake News</p>
<p class="ziKrjEJtYlqnC" style="display:none;"> Fake News</p>
<p class="ziKrjEJtYlqnC" style="display:none;"> Fake News</p>
<p class="ziKrjEJtYlqnC" style="display:none;"> Fake News</p>
<p class="ziKrjEJtYlqnC" style="display:none;"> Fake News</p>
<p class="ziKrjEJtYlqnC" style="display:none;"> Fake News</p>
<p class="ziKrjEJtYlqnC" style="display:none;"> Fake News</p>
<p class="ziKrjEJtYlqnC" style="display:none;"> Fake News</p>` );
*/
setTimeout(function() {
    var paywallClass = jQuery('article:eq(0) p[style*="display: none"]:eq(1)').attr('class');
    console.log("HeraldFix: Found class as " + paywallClass);

    if (paywallClass) {
        $("article:eq(0)").prepend($("article:eq(0) ."+paywallClass+",p[class='']").clone().removeClass(paywallClass).css('display', ''));
    } else {
        $("article:eq(0)").prepend($("article:eq(0) p[class='']").clone());
    }
    //$("article:eq(0)").prepend($("div.author"));
    $("article:eq(0)").prepend($(".article__header"));
    $("article:eq(0) .article-sidebar").before($("article:eq(0) .article__raw-html"));
    $("article:eq(0) .article-sidebar").before($("article:eq(0) .related-articles"));
    $("article:eq(0) .article-sidebar").css('flex-basis', 'auto');
    $("article:eq(0) .article__body").hide();
    $("article:eq(0) .section-iframe").hide();

    // Remove gradient fadeout on text
    GM_addStyle('.pb-f-article-body #article-content.premium-content::before { height: 0px !important; }');

    // Remove XHR injected offer window
    var offerCheck = setInterval(pollVisibility, 100);
    setTimeout(function(){clearInterval(offerCheck);},10000);

    function pollVisibility() {
        if ($("div.article-offer__inner").is(":visible")) {
            $("div.article-offer__inner").remove();
            clearInterval(offerCheck);
        }
    }
}, 1000);
