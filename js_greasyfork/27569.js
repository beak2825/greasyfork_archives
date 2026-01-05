// ==UserScript==
// @name        new ZT
// @description liens en clair pour ZT
// @namespace   https://greasyfork.org/fr/users/30595-deicide
// @include     http*://*zone-telechargement1.ws/*
// @include     http*://*zone-telechargement1.com/*
// @include     http*://*zone-telechargement.ws/*
// @include     http*://*zone-telechargement1.org/*
// @include     http*://*annuaire-telechargement.com/*
// @include     http*://*zone-telechargement.net/*
// @include /http(|s)://(|.*\.)zone\-annuaire.(|ws|com|org|net)/.*/.*/
// @connect     zt-protect.com
// @version     7.8
// @grant       GM.xmlHttpRequest
// @grant       GM_openInTab
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @icon        data:image/jpeg;base64,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
// @run-at      document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/27569/new%20ZT.user.js
// @updateURL https://update.greasyfork.org/scripts/27569/new%20ZT.meta.js
// ==/UserScript==
$('a[href*="zone-telechargement.ws/free"]').remove();
$('a[href*="zone-telechargement.ws/ddl/"]').remove();
$('a[href*="boncoin-annonce"]').remove();
$('a[href*="iptv-iron.pro"]').remove();
$('a[href*="friendlyduck.com"]').remove();
$('a[href*="/xyz00/"]').remove();
$('a[href*="admeerkat"]').remove();
$('a[href*="shop.spyoff.com"]').remove();
$('a[href*="lienusnet.php"]').remove();
$('.corps > center:nth-child(1) > span:nth-child(1) > h1:nth-child(1)').remove();
$('h2:contains("ANONYME&ILLIMITÉ")').remove();
$('h2:contains("ANONYME & RAPIDE")').remove();
$('b:contains("PLUS RAPIDE")').remove();
$('b:contains("PLUS RAPIDE")').remove();
$('b:contains("ANONYME&ILLIMITÉ")').remove();
$('b:contains("ANONYME & RAPIDE")').remove();
//$('.masha_index').remove();
$('.rightside').remove();
$('.centerside').css("width", "84%");
$("#dle-content").css("padding", "0px");
$('.cover_global').css("margin", "8px 20px");
$('.cover_global').css("width", "auto");
$('iframe').remove();
$('.alert').remove();
$('div.wrapper:nth-child(2) > center:nth-child(4)').remove();
$('.corps > center:nth-child(1) > a:nth-child(1)').remove();
$('.tophead').remove();
$('center:contains("tenteront de vous arnaquer.")').remove();

$("#dle-content").find("a").each(function() {
	if ($(this).text().indexOf('[COMPLETE]') > -1) {
        $(this).closest('.cover_global').css('background-color', "lightgray");
    }
});

var titre =  document.title;
titre = titre.replace(" Zone Telechargement Original Site de Telechargement gratuit", "");
titre = titre.replace(/..Annuaire.*/, '');
titre = titre.replace(/...Saison.*/, '');
titre = titre.replace(/...Zone Telechargement.*/, '');
titre = titre.replace("Telecharger ", "");
titre = titre.replace(" Annuaire Telechargement (Zone Telechargement) - Site de Téléchargement Gratuit", "");
titre = titre.replace("COMPLETE", "");
document.title = titre;


// Div flottant
$("<div style='height: 35px;'><div class='header' id='myHeader'></div></div>").insertBefore(".maincont");
$("#myHeader").css("z-index", "99999");

window.onscroll = function() {myFunction()};
var header = document.getElementById("myHeader");
var sticky = header.offsetTop;
var large = $(".corps").width();
function myFunction() {
  if (window.pageYOffset >= sticky) {
      $("#myHeader").addClass("sticky");
      $(".sticky").css({"position": "fixed", "top": "0", "width": large});
  } else {
      $('#myHeader').removeClass('sticky');
      $('#myHeader').css("position", "");
  }
}


// Send to pyLoad
$("<button id='pyload' class='button_subcat'>Afficher les liens</button>").appendTo( "#myHeader" );
$("#pyload").click( function() {
	$("#dle-content").find(".btnToLink").each(function() {
		var b64 = $(this).attr('href');
        var ep = $(this).text();
		if (b64.length > 40) {
            b64 = b64.replace('/to/', '/link/');
            GM.xmlHttpRequest({
                method: "GET",
                url: b64+'}?_token='+'a'*40,
                onload: function(response) {
                    // get href from response
                    var upt = response.responseText.match(/https:\/\/uptobox\.com\/(\w{8,18})/);
                    b64 = b64.replace('/link/', '/to/');
                    if (upt) {
                        upt = upt[0];
                        $("[href='"+b64+"']").replaceWith( "<a href="+upt+" target='_blank'>"+ep+"</a><br>" );
                    }
                    var unf = response.responseText.match(/https:\/\/1fichier\.com\/\?(\w{10,22})/);
                    if (unf) {
                        unf = unf[0];
                        $("[href='"+b64+"']").parent().replaceWith( "<a href="+unf+" target='_blank'>"+ep+"</a><br>" );
                    }
                }
            });

		}
	});
});
