// ==UserScript==
// @name         Lien direct hébergeurs Zone-Telechargement & Annuaire-Telechargement
// @name:en      Direct link host Zone-Telechargement & Annuaire-Telechargement 
// @namespace    https://www.annuaire-telechargement.com/
// @version      2.042
// @description  Voir les liens directs (Uptobox,Uploaded,1fichier ...) sur Zone-Telechargement !
// @description:en  Show direct link (Uptobox,Uploaded,1fichier ...) on Zone-Telechargement !
// @author       HookDonn_
// @icon https://w1w.zone-telechargement1.org/templates/Default/images/favicon.ico
// @include /http(|s)://(|(|w|vv|0|1|2|3|4|5|6|7|8|9)*w(|w|vv|0|1|2|3|4|5|6|7|8|9)*\.)zone\-telechargement(||1|2|3|4|5|6|7|8|9).(|ws|com|org)/.*/
// @include /http(|s)://(|(|w|vv|0|1|2|3|4|5|6|7|8|9)*w(|w|vv|0|1|2|3|4|5|6|7|8|9)*\.)annuaire-telechargement.(|ws|com|org)/.*/
// @require      http://code.jquery.com/jquery-latest.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/375996/Lien%20direct%20h%C3%A9bergeurs%20Zone-Telechargement%20%20Annuaire-Telechargement.user.js
// @updateURL https://update.greasyfork.org/scripts/375996/Lien%20direct%20h%C3%A9bergeurs%20Zone-Telechargement%20%20Annuaire-Telechargement.meta.js
// ==/UserScript==

(function() {
    $(document).ready(function() {
     function replaceArray (string, find, replace, bAddSpace)
        {
            replaceString = string;

            for (var i = 0; i < find.length; i++)
            {
                replaceString = replaceString.replace(new RegExp(find[i], 'g'), replace[i]);
            }

            if (bAddSpace)
            {
                string = replaceString;
                replaceString ="";
                for (var z = 0; z < string.length; z++)
                {
                    replaceString += string.charAt(z);
                    if (z%2 == 1)
                    {
                        replaceString += " ";
                    }
                }
                return replaceString;
            }
            else
            {
                return replaceString.replace(/\s+/g, '');
            }
        }
        
        var findSpecialChar = ["062","063","064","066","067"];
        var replaceSpecialChar = [": ",". ","? ","- " ,"/ "]

        var find = ["0036","0037","0038","0039","0040","0041","0042","0043","0044","0045","0046","0047","0048","0049","0050","0051","0052","0053","0054","0055","0056","0057","0058","0059","0060","0061","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59","60","61","0f","0l","0r","0k","0z","0x","0h","0o","0m","0n","00"];
        var replace =["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9",""];

        $(".postinfo a").each(function (i)
        {
            var $originalLink = $(this).attr("href");
            var $pathname = this.pathname.substring(1);
            
            $pathname = replaceArray( replaceArray($pathname , findSpecialChar, replaceSpecialChar, true), find, replace, false);
            
            var $value = $(this).html();
            if ($value.indexOf("Episode") >= 0)
            {
                $value = $value+" : ";
            }
            else
            {
                $value = "";
            }
            
            $(this).attr("href", $pathname).html($value+$pathname);
            $("<b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>").insertBefore($(this));
            $("<b>&nbsp;&nbsp;&nbsp;<a target='_blank' href="+$originalLink+">Lien original</a></b>").insertAfter($(this));
            
         });

        $("div.corps > center:eq(1) strong:last").next().after('<strong><a href="http://www.allocine.fr/recherche/?q='+escape($($('div.corps div')[2]).text())+'" target="_blank"><u><span class="selection_index"></span>Allocine</u> :  Lien</a></strong><br/>');
  
    });
})();
