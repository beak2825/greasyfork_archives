// ==UserScript==
// @name        Opencaching.de Map Link in Geocaching.com Map
// @description Inserts a link to the map of opencaching.de into geocaching.com's map.
// @namespace   http://flopp.net/
// @version     1.0.0
// @include     https://www.geocaching.com/map*
// @grant       none
// @author      Flopp <mail@flopp.net>   (Original author)
// @author      Kristian Thy <thy@42.dk> (Maintainer)
// @downloadURL https://update.greasyfork.org/scripts/39977/Opencachingde%20Map%20Link%20in%20Geocachingcom%20Map.user.js
// @updateURL https://update.greasyfork.org/scripts/39977/Opencachingde%20Map%20Link%20in%20Geocachingcom%20Map.meta.js
// ==/UserScript==

if( document.location.href.match( /^https:\/\/www.geocaching\.com\/map/ ) )
{
    var de = document.getElementById( "lnkMapPreferences" ).innerHTML.trim() === "Karten-Einstellungen";
    var ref_link = document.getElementById( "map_linkto" );
    if( ref_link )
    {
        function open_ocde()
        {
            var s = ref_link.value;
            var coordinates = s.match( /ll=([-0-9]*\.[0-9]*),([-0-9]*\.[0-9]*)/ );
            var zoom = s.match( /z=([0-9]*)/ );
            if( coordinates != null && zoom != null ) 
            {
                var ocde_map_url = "https://www.opencaching.de/map2.php" + "?lat=" + coordinates[1] + "&lon=" + coordinates[2] + "&zoom=" + zoom[1];
                window.open( ocde_map_url );
            }
            else 
            {
                alert( de ? "Diese Karte enthält leider keine Koordinatenangabe :(" : "This map does not contain any coordinates :(" );
            }
        }
        
        var permalink = ref_link.parentNode;
        var footer = permalink.parentNode;
        footer.style.height = "12em";

        var ocde_image = document.createElement( "img" );
        ocde_image.setAttribute( "src", "https://www.opencaching.de/resource2/ocstyle/images/oclogo/16x16-oc_logo.png" );
        ocde_image.style.marginRight = "4px";
        
        var ocde_text = document.createElement( "span" );
        ocde_text.innerHTML = de ? "Zeige bei Opencaching.de" : "Show @ Opencaching.de";
        
        var link = document.createElement( "a" );
        link.setAttribute( "class", "button" );
        link.setAttribute( "title", de ? "Zeige Gebiet bei opencaching.de" : "Open map extent on Opencaching.de");
        link.setAttribute( "href", "#" );
        link.setAttribute( "id", "ocde_lnk" );
        link.style.marginBottom =  "1em";

        link.appendChild( ocde_image );
        link.appendChild( ocde_text );
        
        permalink.parentNode.insertBefore( link, permalink );

        document.getElementById( 'ocde_lnk' ).addEventListener( "click", open_ocde, false );
    }
}
