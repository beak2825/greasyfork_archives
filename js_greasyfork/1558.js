// ==UserScript==
// @namespace  sc-user-script
// @name       SC User Script
// @version    2.06
// @require    https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @match      http://www.senscritique.com/*
// @description Script utilisateur pour SensCritique
// @copyright  2014 Emilien Wauquier
// @downloadURL https://update.greasyfork.org/scripts/1558/SC%20User%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/1558/SC%20User%20Script.meta.js
// ==/UserScript==

var VERSION = "2.06";
var CHECKED = false;

//Variables produits
var PRODUCT_TITLE;

if(getProductType() != "" && $('h1.pvi-product-title').length > 0) 
{
    
    if($('li.pvi-specs-item a span').html() != undefined && $('div.pvi-hero-product h1').html() != undefined)
    {
        PRODUCT_TITLE = $('div.pvi-hero-product h1').html() + " " + $('li.pvi-specs-item a span').html();
    }
    else if($('li.pvi-specs-item a span').html() == undefined && $('div.pvi-hero-product h1').html() != undefined)
    {
        PRODUCT_TITLE = $('div.pvi-hero-product h1').html();
    }

    PRODUCT_TITLE = PRODUCT_TITLE.replace(/'/g, "");
    PRODUCT_TITLE = PRODUCT_TITLE.replace(/:/g, "");
    PRODUCT_TITLE = PRODUCT_TITLE.replace(/,/g, "");
	PRODUCT_TITLE = PRODUCT_TITLE.replace(/\s+/g, "+");
}
   
//Fonctions
function addStyle(style) 
{
    var head = document.getElementsByTagName("HEAD")[0];
    var newElement = head.appendChild(window.document.createElement('style'));
    newElement.innerHTML = style;
    return newElement;
}

function getProductType()
{
	return $('body').attr('data-sc-page-type-id');
}

function getProductID()
{
	return $('body').attr('data-sc-page-object-id');
}

$(document).ready(function() 
{
    //Ajout du CSS Custom
    addStyle('@import "http://kazaam.net/upload/sc/sc-user.css";');
    
    //Liens admins
    $('div.ead-admin-content a').removeAttr('class');
    $('div.ead-admin-content a:contains("Effacer les notes")').addClass('sc-user-important');
    $('div.ead-admin-content').prepend('<a href="http://admin.senscritique.com/products/add">Créer une nouvelle fiche</a>');
    
    //Ajout des liens speciaux
    if(getProductType() == "1" || getProductType() == "4")
    {
        $('ul.d-menu-list').append('<li class="pco-menu-social"><a class="pco-social-action" href="http://www.imdb.com/find?q=' + PRODUCT_TITLE + '&s=tt">imdb</a></li>');
    }
    else if(getProductType() == "3")
    {
        $('ul.d-menu-list').append('<li class="pco-menu-social"><a class="pco-social-action" href="http://www.giantbomb.com/search/?q=' + PRODUCT_TITLE + '">giantbomb</a></li>');
    }    
    else if(getProductType() == "2" || getProductType() == "5")
    {
        $('ul.d-menu-list').append('<li class="pco-menu-social"><a class="pco-social-action" href="http://www.amazon.fr/s/ref=nb_sb_noss?url=field-keywords=' + PRODUCT_TITLE + '">amazon</a></li>');
        
    }
    else if(getProductType() == "6")
    {
        $('ul.d-menu-list').append('<li class="pco-menu-social"><a class="pco-social-action" href="https://what.cd/torrents.php?searchstr='+ PRODUCT_TITLE +'">what.cd</a></li>');
    	$('ul.d-menu-list').append('<li class="pco-menu-social"><a class="pco-social-action" href="http://musicbrainz.org/search?query='+ PRODUCT_TITLE +'&type=release_group&method=indexed">musicbrainz</a></li>');
    	$('ul.d-menu-list').append('<li class="pco-menu-social"><a class="pco-social-action" href="http://www.lastfm.fr/search?q='+ PRODUCT_TITLE + '">last.fm</a></li>');
    }




        
    //Ajouter le label vérifié
    
    if(CHECKED)
    {


    	if($('div.pvi-hero-product').length > 0)
        {
            $.get("http://82.238.1.101/sc/checked-products.php?id="+ getProductID() +"&a=check", function(data) {
    			if(data == "already checked")
                {
                    $('div.pvi-hero-product small').after('<label>vérifié</label>');
                }
            });
        }
        
        if($('li.lahe-breadcrumb-item:contains("Sorties cinéma")').length > 0 || $('ul.lahe-breadcrumb-content li:contains("Jeux vidéo")').length > 0)
        {        
            $('h2.elco-title').each(function(index) 
            {          
                
                if($('li.elpr-item figure').length)
                {
                    var url = "http://82.238.1.101/sc/checked-products.php?id="+ $('li.elpr-item figure:eq('+index+')').attr('data-sc-product-id') +"&a=check";
                }
                else if($('li.pvi-item figure').length) 
                {
                    var url = "http://82.238.1.101/sc/checked-products.php?id="+ $('li.pvi-item figure:eq('+index+')').attr('data-sc-product-id') +"&a=check";
                }
                
                $.get(url, function(data) 
                {
                    if(data == "already checked")
                    {
                        $('h2.elco-title:eq('+index+')').append('<label>vérifié</label>');
                    }
                    else
                    {
                        $('h2.elco-title:eq('+index+')').append('<label class="warning">non vérifié</label>');
                    }
            	});            
                
            });
        }
        

    }



	$('span.lafo-copyright').append("<span>sc-user.js chargé - <code>version " + VERSION + "</code></span>");
});
