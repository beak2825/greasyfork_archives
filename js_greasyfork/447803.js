// ==UserScript==
// @name         ItopColor2
// @version      0.6
// @description  Hightlight text
// @author       jp
// @match        https://itop.ac-nice.fr/itop/pages/UI.php*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://code.jquery.com/ui/1.13.1/jquery-ui.min.js
// @license MIT

// @namespace https://greasyfork.org/users/177745
// @downloadURL https://update.greasyfork.org/scripts/447803/ItopColor2.user.js
// @updateURL https://update.greasyfork.org/scripts/447803/ItopColor2.meta.js
// ==/UserScript==

function itopColor() {
// @require	     https://zeptojs.com/zepto.min.js
    if($('#WelcomeMenuPage').length){
        if ($("#WelcomeMenuPage").find(".tmpClassToCheck").length == 0) {
          //on crée un marqueur pour vérifier si la page est rechargée, si oui on exécutre le reste.
          $('#WelcomeMenuPage .dashboard').addClass('tmpClassToCheck');
          // affiche en titre de page : Verdon et le nombre de nouvelle demande
          var newRequestText = $('#WelcomeMenuPage div:contains("Demandes non traitées") .pagination_objcount #total').text();
          document.title = "Verdon (" + newRequestText + ")";
          $(document).tooltip({
            track: true,
          });
          //dans la table "aperçu des demandes", on cache les catégorie qui contiennent "-" (vide).
          $('.summary-details > table > tbody > tr > td').each(function () {
            if ($(this).text().match('-')) {
              var indexOf = ($(this).index());
              $(this).css("display", "none");
              $(".summary-details > table > tbody > tr > th:eq(" + indexOf + ")").css("display", "none");
            }
          });


          $('img').each(function () {
          	$(this).addClass("imagecolor");
          });
          $('h1').each(function () {
            $(this).next("div").find("img").addClass("imagecool");
            $(this).next("div").find("li:first").append('<span class="fa fa-sliders settings"></span>');
          })

          $('.listResults').parent().addClass("pouBorder");

          resume("Demandes non traitées", "Résumé", "Titre");
          // resume("Demandes non traitées", "Dialogue avec le demandeur", "Demandeur");
          resume("Mes demandes en cours", "Dialogue avec le demandeur", "Demandeur");
          resume("Demandes en cours PAM Cannes", "Dialogue avec le demandeur", "Demandeur");

          dernierRepondu("Demandes non traitées");
          dernierRepondu("Mes demandes en cours");
          dernierRepondu("Demandes en cours PAM Cannes");

          hideColumn("Mes demandes en cours", "Intervenant");
          hideColumn("Demandes non traitées", "Dialogue avec le demandeur");
          hideColumn("Demandes non traitées", "Résumé");
          hideColumn("Mes demandes en cours", "Intervenant");
          hideColumn("Mes demandes en cours", "Dialogue avec le demandeur");
          hideColumn("Demandes en cours PAM Cannes", "Dialogue avec le demandeur");

          SearchAndColor();
          afficheInfo();
        }
      }
  	}


function slugify(text) {
  return text
    .toString()                           // Cast to string (optional)
    .normalize('NFKD')            // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
    .toLowerCase()                  // Convert the string to lowercase letters
    .trim()                                  // Remove whitespace from both sides of a string (optional)
    .replace(/\s+/g, '-')            // Replace spaces with -
    .replace(/[^\w\-]+/g, '')     // Remove all non-word chars
    .replace(/\-\-+/g, '-');        // Replace multiple - with single -
}

function afficheInfo() {
    $('a[href*="Person&"]').each(function () {
        var href = $(this).attr('href');
        
        //ajout de l'icône pour le nouveau listaire
        $(this).parent("span").parent().append('<a class="fa fa-user listaire2 showButtonLeft" href="#" data-lnk="' + href + '"></a>');
    });

    $(".listaire2").click(function () {
        var lien = $(this).attr("data-lnk");
        getMail2(lien);
    });
}

function getMail2(url) {
    $.ajax(
        {
            url: url,
            success: function (data) {
                var html = $.parseHTML(data);
                // on récupère le mail de la personne en ayant au préalable chargé sa page d'info de itop
                var mailto = $(html).find(".mailto");
                var mail = mailto[0].text;
                //ouverture dans un onglet
                //window.open("https://id.ac-nice.fr/listaire2/#/listaire2/annuaire?mail="+mail, "_blank");//,"nom_popup","menubar=no, status=no, scrollbars=yes, menubar=no, width=900, height=900");
                //ouverture dans une nouvelle fenêtre
                window.open("https://id.ac-nice.fr/listaire2/#/listaire2/annuaire?mail=" + mail, "nom_popup", "menubar=no, status=no, scrollbars=yes, menubar=no, width=900, height=900");
            }
        });
}

function SearchAndColor() {
  $('h1').each(function () {
    const slugText = slugify($(this).text());
    $(this).next("div").find(".listResults:first").attr('id', slugText);
  });
}

function hideColumn(TexteRechercheDiv, TexteRechercheColonneACacher) {
    var getToHideColumn = $('#WelcomeMenuPage div:contains(' + TexteRechercheDiv + ') .listResults  th:contains(' + TexteRechercheColonneACacher + ')').index();
    $('#WelcomeMenuPage div:contains(' + TexteRechercheDiv + ') .listResults > tbody > tr').each(function () {
        $(this).children("td").eq(getToHideColumn).hide();
    });
    $('#WelcomeMenuPage div:contains(' + TexteRechercheDiv + ') .listResults  th:contains(' + TexteRechercheColonneACacher + ')').hide();
}


//prend le texte d'un element pour l'injecter dans le titre d'un autre ce qui a pour effet d'afficher une info bulle
function resume(TexteRechercheDiv, TexteRechercheColonneACacher, TexteRechercheColonneAInjecter) {
    var getToHideIndex = $('#WelcomeMenuPage div:contains(' + TexteRechercheDiv + ') .listResults  th:contains(' + TexteRechercheColonneACacher + ')').index();
    var getToInjectIndex = $('#WelcomeMenuPage div:contains(' + TexteRechercheDiv + ') .listResults  th:contains(' + TexteRechercheColonneAInjecter + ')').index();
    $('#WelcomeMenuPage div:contains(' + TexteRechercheDiv + ') .listResults > tbody > tr').each(function () {
        var resumeText = $(this).children("td").eq(getToHideIndex).children("div").text();
        //$(this).children("td").eq(getToInjectIndex).attr("title", resumeText);
      
        /*$(this).children("td").eq(getToInjectIndex).append('<span class="fa fa-eye showButton"></span>');
        $(this).find(".showButton").attr("title", resumeText);*/
     	 $(this).children("td").eq(getToInjectIndex).append('<a class="showButton" />');
   		 $(this).find(".showButton").attr("data-tooltip", resumeText).append('<i class="fa fa-eye" />');
       //$(this).find(".showButton").attr("data-tooltip", resumeText).addClass("fa fa-eye");
        //$(this).children("td").eq(getToHideIndex).hide();
    });
    //$('#WelcomeMenuPage div:contains(' + TexteRechercheDiv + ') .listResults  th:contains(' + TexteRechercheColonneACacher + ')').hide();
}

// vois qui à répondu en dernier dans "dialogue demandeur", et met le nom du demandeur en gras si c'est lui qui a répondu en dernier.
function dernierRepondu(TexteRechercheDiv) {
    var dialogueIndex = $('#WelcomeMenuPage div:contains(' + TexteRechercheDiv + ') .listResults  th:contains("Dialogue avec le demandeur")').index();
    var demandeurIndex = $('#WelcomeMenuPage div:contains(' + TexteRechercheDiv + ') .listResults  th:contains("Demandeur")').index();
    var intervenantIndex = $('#WelcomeMenuPage div:contains(' + TexteRechercheDiv + ') .listResults  th:contains("Intervenant")').index();
    $('#WelcomeMenuPage  div:contains(' + TexteRechercheDiv + ') .listResults > tbody > tr').each(function () {
        var getNameLast = $(this).children("td").eq(dialogueIndex).find("div").find("div").eq(0).text();
        var getNameDemandeur = $(this).children("td").eq(demandeurIndex).text();
        var getIntervenant = $(this).children("td").eq(intervenantIndex).text();
        if (getNameLast.toUpperCase().indexOf(getNameDemandeur.toUpperCase()) >= 0 && getNameLast.length !== 0) {
            $(this).children("td").eq(demandeurIndex).find("a").css({ "font-size": "105%", "font-weight": "bold" });
            //var getDemandeUrl = $(this).children("td").eq(0).find("a").attr('href');
            $(this).children("td").eq(demandeurIndex).append('<span class="fa fa-comment-o commentButton"><span/>');
        } else if (getNameLast.toUpperCase().indexOf(getIntervenant.toUpperCase()) == -1 && getNameLast.length !== 0 && getNameLast.toUpperCase().indexOf("verdon".toUpperCase()) == -1) {
            $(this).children("td").eq(demandeurIndex).find("a").css({ "font-size": "105%", "font-weight": "bold" });
            //var getDemandeUrl = $(this).children("td").eq(0).find("a").attr('href');
            $(this).children("td").eq(demandeurIndex).append('<span class="fa fa-exclamation commentButton"><span/>');
        }
    });
}

itopColor();
if( ! $('#WelcomeMenuPage').length){
  $("body").addClass("pagedemande");
  afficheInfo();
}else{
	setInterval(itopColor, 1000);
}