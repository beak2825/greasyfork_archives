// ==UserScript==
// @name         Izberg Enhancer for Pixmania
// @namespace    https://greasyfork.org/fr/scripts/375177-izberg-enhancer-for-pixmania
// @version      0.1
// @description  Improve Izberg interface for a better management of Pixmania
// @author       g.barreto
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @match        *operator-prod.izberg-marketplace.com/*
// @match        *pixmania.izberg-marketplace.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375177/Izberg%20Enhancer%20for%20Pixmania.user.js
// @updateURL https://update.greasyfork.org/scripts/375177/Izberg%20Enhancer%20for%20Pixmania.meta.js
// ==/UserScript==


// == CONFIG ==
var izberg_marketplace_url = "operator-prod.izberg-marketplace.com";
var izberg_pixmania_url = "pixmania.izberg-marketplace.com";
var pixtrade_url = 'https://admin.pix-trade.com/';
var list_lang_enable = ['fr','es','pt'];
// == FIN CONFIG ==


var site_izberg = siteEnCours(izberg_marketplace_url);
var site_pixmania = siteEnCours(izberg_pixmania_url);

$(document).ready(function()
{
    'use strict';

    var css = '';

    if((site_izberg && pageEnCours("products")) || site_pixmania && pageEnCours("offers")) {
        css += ' .badge {margin:2px; font-size: 11px; overflow-x: hidden;}'; // Badges plus gros et espacés dans les tableaux
        css += ' .grid_placeholder.table-responsive.table-messages {overflow-x: hidden}'; // Pas de scroll horizontal dans les tableaux
        css += ' .algolia-stock-status-cell ul.list-unstyled {text-align:center}'; // Listes de badges centrée dans les tableaux
        css += ' .algolia-stock-status-cell ul.list-unstyled li span.badge {font-size:12px}'; // Badges indiquant les stocks plus visibles
        css += ' .table > tbody > tr > td.mp-select-row-cell {vertical-align:middle}'; // Centrage des cases permettant de sélectionner une ligne
    }

    addGlobalStyle(css);

    init();
    startObserver();

    // initElement("a.btn.btn-subsidebar", getIzbergBearer);
});

function pageEnCours(nom_page, end_only)
{
    if(end_only==undefined) {
        end_only = false;
    }
    var trouve = false;
    var url_split = window.location.pathname.split("/");
    if(end_only) {
        if(url_split[url_split.length-1]=="") {
            return url_split[url_split.length-2]==nom_page;
        } else {
            return url_split[url_split.length-1]==nom_page;
        }
    } else {
        url_split.some(function (item) {
            var item2 = item.split("-");
            if (item === nom_page || item2[0] === nom_page) {
                trouve = true;
            }
        });
    }
    return trouve;
}

function siteEnCours(nom_site)
{
    return window.location.hostname.indexOf(nom_site)!=-1;
}

function addGlobalStyle(css)
{
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if(!head) {
        return;
    }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

function init()
{
    $(document).on("click", "#main_menu li", function(event) {

        var page_details_mappers = pageEnCours("offers") && pageEnCours("mapper") && pageEnCours("details");
        var css = '';

        // Pages communes aux 2 sites :
        if((site_izberg && pageEnCours("products")) || (site_pixmania && pageEnCours("offers"))) {
            css += ' .badge {margin:2px; font-size: 11px; overflow-x: hidden;}'; // Badges plus gros et espacés dans les tableaux
            css += ' .grid_placeholder.table-responsive.table-messages {overflow-x: hidden}'; // Pas de scroll horizontal dans les tableaux
            css += ' .algolia-stock-status-cell ul.list-unstyled {text-align:center}'; // Listes de badges centrée dans les tableaux
            css += ' .algolia-stock-status-cell ul.list-unstyled li span.badge {font-size:12px}'; // Badges indiquant les stocks plus visibles
            css += ' .table > tbody > tr > td.mp-select-row-cell {vertical-align:middle}'; // Centrage des cases permettant de sélectionner une ligne
            initElement(".algolia-stock-status-cell", styleBadgesAvance);
        }

        // Site Izberg :
        if(site_izberg && pageEnCours("products")) {
            if(pageEnCours("edit")) {
                initElement(".textarea-v1_product-description_field.horizontal", addLienEditeurHtml);
                initElement(".related_tree-v1_product-application_categories_field", addLienEditeurCategories);
            }
        }

        // Site Pixmania :
        if(site_pixmania && page_details_mappers) {
            initElement("td.string-cell.renderable.id", addLienExportImportLog);
        }

        if(css!='') {
            addGlobalStyle(css);
        }
    });
}

function initElement(targetElement, targetFunction, reloadRate, maxTry)
{

    // Frequence de tentatives d'initialisation :
    if(reloadRate==undefined) {
        reloadRate = 300;
    }

    // Nombre maximum de tentatives d'initialisation :
    maxTry = maxTry==undefined ? 30 : maxTry-1;
    if(maxTry<=0) {
        return;
    }

    if($(targetElement).length>0) {
        targetFunction();
    }
    else {
        setTimeout( function() { initElement(targetElement, targetFunction, reloadRate, maxTry); }, reloadRate);
    }
};


var observerEnable = true;
var startObserver = function(){

    if($('#content-placeholder').length>0) {


        // Create an observer instance linked to the callback function
        var observer = new MutationObserver(function(mutationsList, observer) {
            if(observerEnable) {

                // Pour le site Izberg :
                if(site_izberg) {
                    var page_product = pageEnCours("products");
                    for(var mutation of mutationsList) {
                        if (page_product && mutation.target.className == 'product_infos_general_placeholder') {
                            observerEnable = false;
                            initElement(".textarea-v1_product-description_field.horizontal", addLienEditeurHtml);
                            initElement(".related_tree-v1_product-application_categories_field", addLienEditeurCategories);
                            observerEnable = true;
                            return;
                        }
                        else if (page_product && mutation.target.className == 'grid_placeholder table-responsive table-messages') {
                            observerEnable = false;
                            initElement(".algolia-stock-status-cell", styleBadgesAvance); // Amélioration des badges des stocks et statuts
                            observerEnable = true;
                            return;
                        }
                    }
                } // Pour le site Pixmania :
                else if(site_pixmania) {
                    var page_offers = pageEnCours("offers");
                    var page_details_mappers = page_offers && pageEnCours("mapper") && pageEnCours("details");
                    var page_balance = pageEnCours("balances", true);
                    for(var mutation of mutationsList) {
                        if (page_details_mappers && mutation.target.className == 'grid_placeholder table-responsive table-messages') {
                            observerEnable = false;
                            initElement("td.string-cell.renderable.id", addLienExportImportLog); // Lien d'export des logs de l'import
                            observerEnable = true;
                            return;
                        }
                        else if (page_offers && mutation.target.className == 'grid_placeholder table-responsive table-messages') {
                            observerEnable = false;
                            initElement(".algolia-stock-status-cell", styleBadgesAvance); // Amélioration des badges des stocks et statuts
                            observerEnable = true;
                            return;
                        }
                        else if (page_balance && mutation.target.className == 'grid_placeholder table-responsive table-messages') {
                            observerEnable = false;
                            initElement("td.renderable.id", addLienExportBalance); // Lien d'export d'une balance
                            observerEnable = true;
                            return;
                        }
                    }
                }

            }
        });

        // Start observing the target node for configured mutations
        observer.observe($('#content-placeholder').get(0), { childList: true, subtree: true });
    }
    else {
        setTimeout(startObserver, 300);
    }

}

var catch_refresh_button_catalog = false;
var styleBadgesAvance = function()
{
    if(!catch_refresh_button_catalog) {
        $(document).on("click", ".refreshbtn_placeholder a.btn.refresh_data_cta", function() {
            setTimeout(function() { initElement(".algolia-stock-status-cell", styleBadgesAvance); }, 1000);
            catch_refresh_button_catalog = true;
        });
    }

    // Badges "offre active" :
    $("ul.list-unstyled .badge.status-active.offer-status").each(function(index, el) {
        $(this).html($(this).html().replace('active', 'Active'));
    });
    // Badges "offre inactive" :
    $("ul.list-unstyled .badge.status-inactive.offer-status").each(function(index, el) {
        $(this).html($(this).html().replace('inactive', 'Inactive'));
    });
    // Badges "brouillon" :
    $("ul.list-unstyled .badge.status-draft.offer-status").each(function(index, el) {
        $(this).html($(this).html().replace('draft', 'Brouillon'));
    });

    // Badges affichant l'état du stock :
    var rxEnStock = new RegExp('in_stock \\(([0-9]+)\\)', 'gi');
    var rxRuptureStock = new RegExp('out_of_stock \\(0\\)', 'gi');
    $("ul.list-unstyled .badge.status-orange, ul.list-unstyled .badge.status-blue").each(function(index, el) {
        var leBadge = $(this);
        // Encore en stock :
        leBadge.html(leBadge.html().replace(rxEnStock, 'En stock : <strong>$1</strong>'));
        // En rupture de stock :
        leBadge.html(leBadge.html().replace(rxRuptureStock, function() { leBadge.removeClass('status-orange').addClass('status-red'); return '<strong>En rupture de stock</strong>'; } ));
    });
};

var addLienEditeurHtml = function()
{
    if($("#lienEditeurHtml").length>0) {
        return;
    }

    // Récupération du texte d'aide :
    var texteHelp = $(".textarea_placeholder + .error + .help-text").html();
    $(".textarea_placeholder + .error + .help-text").remove();

    // Mise en forme du nouveau texte :
    var texteSousTextarea = '<div style="display: flex;justify-content: space-between;">';
        if(texteHelp != undefined && texteHelp!='') {
            texteSousTextarea += '<span class="help-text">'+texteHelp+'</span>';
        }
        texteSousTextarea += '<a href="'+pixtrade_url+'IzbergTools/'+getProductId()+'/editProduct/?locale='+getLocale()+'" id="lienEditeurHtml" target="_blank">Editeur html</a>';
    texteSousTextarea += '</div>';
    $(".textarea_placeholder + .error").after(texteSousTextarea);

}

var addLienEditeurCategories = function()
{
    if($("#lienEditeurCategories").length>0) {
        return;
    }
    $(".related_tree-v1_product-application_categories_field select").before('<div style="text-align:right;"><a href="'+pixtrade_url+'IzbergTools/'+getProductId()+'/editProduct/?locale='+getLocale()+'" id="lienEditeurCategories" target="_blank">Chercher parmi les catégories</a></div>');

}

var getProductId = function()
{
    var regex_product_id = new RegExp('([0-9]+)', 'gi');
    return $("h2.card-header").html().match(regex_product_id)[0];
}

var getLocale = function()
{
    var current_locale = $(".lang_switcher_select select.form-control").val();
    return $.inArray(current_locale, list_lang_enable)!==-1 ? current_locale : 'fr';
}

var getIzbergBearer = function()
{
    $("a.btn.btn-subsidebar").trigger('click');
    var bearerToken = $("#composeModal .well samp").html();
    console.log("Bearer token: "+bearerToken);
}

var catch_refresh_button_history_logs = false;
var addLienExportImportLog = function()
{
    if($(".lienExportImportLog").length>0) {
        return;
    }

    if(!catch_refresh_button_history_logs) {
        $(document).on("click", ".refreshbtn_placeholder a.btn.refresh_data_cta", function() {
            setTimeout(function() { initElement("td.string-cell.renderable.id", addLienExportImportLog); }, 1000);
            catch_refresh_button_history_logs = true;
        });
    }

    var mapper_id = getMapperID();
    if(mapper_id!==false) {
        $("td.string-cell.renderable.id").each(function() {
            var flux_id = $(this).html();
            // Bouton pour télécharger le fichier d'origine :
            $(this).parent().children('td.trigger_type').append('<div style="margin-top: 5px;"><a href="'+pixtrade_url+'IzbergTools/'+mapper_id+'/getCsvFileImport/?flux_id='+flux_id+'" class="btn pointer btn-default btn-sm lienExportImportLog" title="Exporter fichier csv d\'origine" onclick="event.stopPropagation();" target="_blank">CSV d\'origine <i class="mdz_icon-download"></i></a></div>');
            // Bouton pour télécharger le log d'erreurs :
            if(
                $(this).parent().children('td.invalid_count').html()!=0 // s'il y a des erreurs de type "invalide"
                || $(this).parent().children('td.error_count').html()!=0 // ou s'il y a des erreurs
                || $(this).parent().children('td.warning_count').html()!=0 // ou s'il y a des warnings
                || $(this).parent().children('td.not_modified_count').html()!=0 // ou s'il y a des éléments qui n'ont pas pu être modifiés
                ) {
                $(this).parent().children('td.trigger_type').append('<div style="margin-top: 5px;"><a href="'+pixtrade_url+'IzbergTools/'+flux_id+'/getErrorsLogImport/" class="btn pointer btn-default btn-sm lienExportErrorsLog" title="Exporter log d\'erreurs" onclick="event.stopPropagation();" target="_blank">Log d\'erreurs <i class="mdz_icon-download"></i></a></div>');
            } else {
                $(this).parent().children('td.trigger_type').append('<div style="margin-top: 5px;"><button class="btn btn-default btn-sm" title="Exporter log d\'erreurs" onclick="event.stopPropagation();" disabled="disabled">Pas d\'erreurs</button></div>');
            }
            // Bouton pour corriger automatiquement les produits manquants :
            if($(this).parent().children('td.error_count').html()!=0) {
                $(this).parent().children('td.trigger_type').append('<div style="margin-top: 5px;"><a href="'+pixtrade_url+'IzbergTools/'+flux_id+'/pushRepairProductsInQueue/" class="btn pointer btn-default btn-sm lienRepairProducts" title="Réparer les erreurs automatiquement" target="_blank">Réparer les erreurs <i class="fa fa-screwdriver"></i></a></div>');
            }
        });
    }
}

$(document).on('click', '.lienRepairProducts', function(event) {
    event.stopPropagation();
    $(this).attr('disabled','disabled').addClass('disabled').html('Création en cours...');
});

var getMapperID = function(nom_page)
{
    var url_explode = window.location.pathname.split("/");
    var regex_flux_id = new RegExp('([0-9]+)', 'gi');
    if(url_explode[url_explode.length-2]!=undefined && url_explode[url_explode.length-2].match(regex_flux_id)) {
        return url_explode[url_explode.length-2];
    }
    return false;
}

var addLienExportBalance = function()
{
    if($(".lienExportBalance").length>0) {
        return;
    }

    $("td.renderable.id").each(function() {
        $(this).append('<div style="margin-top: 5px;"><a href="'+pixtrade_url+'IzbergTools/'+$(this).html()+'/getAllTransactionsFromBalance/" class="btn pointer btn-default btn-sm lienExportBalance" title="Exporter les transactions" onclick="event.stopPropagation();" target="_blank">Transactions <i class="mdz_icon-download"></i></a></div>');
    });
}