// ==UserScript==
// @name         Zone telechargement / Annuaire telechargement  Direct Link
// @name:en      Zone telechargement / Annuaire telechargement  Direct Link
// @namespace    https://www.zone-telechargement1.com/
// @version      3.04
// @description  Show direct link (Uptobox,Uploaded,1fichier ...) on Zone-Telechargement and avoid dl-protect!
// @description:en  Show direct link (Uptobox,Uploaded,1fichier ...) on Zone-Telechargement and avoid dl-protect!
// @author       Thibault
// @icon https://www.annuaire-telechargement.com/templates/Default/images/favicon.ico
// @include /http(|s)://(|(|w|v)*\.)annuaire-telechargement.com/
// @include /http(|s)://(|www\.)zone\-telechargement1\.com/.*/
// @include /http(|s)://(|(|w|v)*\.)zone-annuaire.com/
// @include /http(|s)://(|(|w|0|1|2|3|4|5|6|7|8|9)*w(|w|0|1|2|3|4|5|6|7|8|9)*\.)zone\-telechargement(||1|2|3|4|5|6|7|8|9).(|ws|com|org|net)/.*/
// @include /http(|s)://(|(|w|0|1|2|3|4|5|6|7|8|9)*w(|w|0|1|2|3|4|5|6|7|8|9)*\.)zone\-annuaire(||1|2|3|4|5|6|7|8|9).(|ws|com|org|net)/.*/
// @include /http(|s)://(|(|w|0|1|2|3|4|5|6|7|8|9)*w(|w|0|1|2|3|4|5|6|7|8|9)*\.)annuaire-telechargement.(|ws|com|org|net)/.*/
// @include /http(|s)://(|(|w|v)*\.)zone-telechargement.(|ws|com|org|net)/.*/
// @include /http(|s)://(|(|w|v)*\.)zone-annuaire.(|ws|com|org|net)/.*/
// @include /http(|s)://(|(|w|v)*\.)zt\-protect\.(|ws|com|org|net)/.*/
// @include /http(|s)://(|(|w|v)*\.)zt\-za\.(|ws|com|org|net)/.*/
// @require      http://code.jquery.com/jquery-latest.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/30424/Zone%20telechargement%20%20Annuaire%20telechargement%20%20Direct%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/30424/Zone%20telechargement%20%20Annuaire%20telechargement%20%20Direct%20Link.meta.js
// ==/UserScript==
    var $head = $('head');


    $head.append($('<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">'));


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

        function bindEvent(element, eventName, eventHandler) {
            if (element.addEventListener){
                element.addEventListener(eventName, eventHandler, false);
            } else if (element.attachEvent) {
                element.attachEvent('on' + eventName, eventHandler);
            }
        }
function copyToClipboard(text) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}
        var findSpecialChar = ["062","063","064","066","067"];
        var replaceSpecialChar = [": ",". ","? ","- " ,"/ "]

        var find = ["0036","0037","0038","0039","0040","0041","0042","0043","0044","0045","0046","0047","0048","0049","0050","0051","0052","0053","0054","0055","0056","0057","0058","0059","0060","0061","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59","60","61","0f","0l","0r","0k","0z","0x","0h","0o","0m","0n","00"];
        var replace =["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9",""];

        if (location.hostname == "zt-protect.com" || location.hostname == "zt-protect.net")
        {
            if ($('.showURL').html()) {
                getUrl = $(".showURL").parent("a").attr("href");
                //var postUrl = 'https://zone-telechargement.net';
                var postUrl = location.ancestorOrigins[0];
                parent.window.postMessage(getUrl, postUrl);
            }
            else
            {
                if ($(".magic input")[1])
                {
                    $(".bgSlider .Slider").attr("class","Slider ui-draggable ui-draggable-disabled ui-state-disabled");
                    $.post( "https://www.protect-lien.com/php/Qaptcha.jquery.php", { action : "qaptcha", qaptcha_key: $(".QapTcha input").attr("name") } );
                    $(".QapTcha input").val("");
                    {
                        $(".magic input")[1].click();
                        $("#h237").hide();
                    }
                }
                if ($(".lienet a").attr("href") != undefined)
                {
                    $("body").html('<div style="width:100%;text-align: center;"><a href='+$(".lienet a").attr("href")+'>'+$(".lienet a").attr("href")+'</a></div>');
                    //alert($(".lienet a").attr("href"));
                }
                else if($(".continuer").length > 0)
                {
                    $(".continuer").click();
                }
                else if($('button[type="submit"]').length > 0)
                {
                    $('button[type="submit"]').click();
                }
            }
        }
        else{
          /*  $(".postinfo a").each(function (i)
                                  {
                var $originalLink = $(this).attr("href");
                var $pathname = this.pathname.substring(1);

                $pathname = replaceArray( replaceArray($pathname , findSpecialChar, replaceSpecialChar, true), find, replace, false);
         */       /*
            //uptobox //        123455600123455602123455610123455615
            if ($pathname.indexOf("123455600123455602123455610123455615") >=0 )
            {
                $pathname = "http://uptobox.com"+$pathname.replace("123455600123455602123455610123455615","");
            }

            if ($pathname.indexOf("123455601123455602123455610123455615") >=0 )
            {
                $pathname = "http://uptobox.com"+$pathname.replace("123455601123455602123455610123455615","");
            }

            //uploaded 123455600123455605123455615
            if ($pathname.indexOf("123455600123455605123455615") >=0 )
            {
                $pathname = "http://ul.to"+$pathname.replace("123455600123455605123455615","");
            }

            //turbobit // 123455600123455607123455611123455615
            if ($pathname.indexOf("123455600123455607123455611123455615") >=0 )
            {
                $pathname = "http://turbobit.net"+$pathname.replace("123455600123455607123455611123455615","");
            }

            //1fichier //123455601123455603123455610123455615123455617
            if ($pathname.indexOf("123455601123455603123455610123455615123455617") >=0 )
            {
                $pathname = "http://1fichier.com"+$pathname.replace("123455601123455603123455610123455615123455617","?");
            }

            //uplea 123455600123455609123455610123455615dl123455615
            if ($pathname.indexOf("123455600123455609123455610123455615dl123455615") >=0 )
            {
                $pathname = "http://uplea.com/dl"+$pathname.replace("123455600123455609123455610123455615dl123455615","");
            }

            //rapidgator // 123455600123455606123455611123455615file
            if ($pathname.indexOf("file123455615") >=0 )
            {
                $pathname = "http://rapidgator.net/file/"+$pathname.split("file123455615").pop();
                $pathname = $pathname.replace("123455615","/");
            }

            //Nitroflare //123455600123455608123455610123455615view123455615
            if ($pathname.indexOf("123455600123455608123455610123455615view123455615") >=0 )
            {
                $pathname = "http://nitroflare.com"+$pathname.replace("123455600123455608123455610123455615view123455615","view/");
                $pathname = $pathname.replace("123455615","/");
            }

            //Streaming //123455600123455609123455610123455615
            if ($pathname.indexOf("123455600123455609123455610123455615") >=0 )
            {
                $pathname = "http://streaming.zone-telechargement1.com"+$pathname.replace("123455600123455609123455610123455615","");
            }*/

           /*     var $value = $(this).html();
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
                $("<b>&nbsp;&nbsp;&nbsp;<a target='_blank' href="+$originalLink+">Original Link</a></b>").insertAfter($(this));

            });*/



            //// NEW VERSION

            formId = 0;
            $('.postinfo').find('a').each(function (index) {
                $(this).attr('target', 'my_frame');
                $(this).attr('id', 'form-link-' + formId);
                $(this).after('  <button type="button" class="btn-analyser " style=" background-color: #2fdf2f;  border-color: #2fdf2f; curosr:pointer;" data-id="' + formId + '" id="form-analyser-' + formId + '" > <img src="https://image.flaticon.com/icons/png/512/125/125868.png" style="width:14px"> </button>' + ' <a id="urlDecode-' + formId + '" class="urlDecode" href="#"></a> ' + ' <button type="button" id="form-copy-' + formId + '" class="copyUrl" style="display:none; background-color: cornflowerblue;border-color: cornflowerblue;" data-title="Copier le lien" data-clipboard-text=""> <img src="https://image.flaticon.com/icons/png/512/70/70527.png" style="width:14px"> </button>');
                formId++;
            });

            $("body").append("<div><iframe id='my_frame' name='my_frame' src='about:blank' style='width:0px; height:0px'></iframe></div>");

            $('.postinfo').on('click', '.btn-analyser', function (e)
            {
                e.preventDefault();
                e.stopPropagation();
                id = $(this).attr("data-id");
                $('[id^="urlDecode-"] .fa-spinner').hide();
                $("#urlDecode-"+id).html('<i class="fa fa-spinner fa-spin" style="font-size:24px"></i>');

													 
																 
											   

                $('#my_frame').attr('data-id', id);
                /*$('#form-link-' + id).attr('target', 'my_frame');
                $('#form-link-' + id).submit();*/
                window.open($('#form-link-'+id).attr('href'), 'my_frame');

                bindEvent(window, 'message', function (e) {
                    if (e.origin == "https://zt-protect.com" || e.origin == "https://zt-protect.net")
                    {
                        $("#urlDecode-"+id).attr("href",e.data);
                        $("#urlDecode-"+id).html(e.data);
                        $("#form-copy-"+id).attr("data-clipboard-text", e.data.trim());
                        $("#form-copy-"+id).show();
                    }
                });
            })

            $('.postinfo').on('click', '.copyUrl', function ()
            {
                copyToClipboard($(this).attr("data-clipboard-text"));
            })
        }
        $("div.corps > center:eq(1) strong:last").next().after('<strong><a href="http://www.allocine.fr/recherche/?q='+escape($($('div.corps div')[2]).text())+'" target="_blank"><u><span class="selection_index"></span>Allocine</u> :  Lien</a></strong><br/>');

    });
})();
