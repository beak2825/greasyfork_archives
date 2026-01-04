// ==UserScript==
// @name               QuickAssist | Updated by Marentdev
// @namespace          https://realitygaming.fr/
// @version            3
// @description        Permet la gestion des phrases des assistants !
// @include         https://realitygaming.fr/threads/*
// @include         https://realitygaming.fr/conversations/*
// @include         https://realitygaming.fr/conversations/add?to=*
// @downloadURL https://update.greasyfork.org/scripts/39868/QuickAssist%20%7C%20Updated%20by%20Marentdev.user.js
// @updateURL https://update.greasyfork.org/scripts/39868/QuickAssist%20%7C%20Updated%20by%20Marentdev.meta.js
// ==/UserScript==

$(document).ready(function(){
    // some var & function
    function reply(txt){
        $('.js-editor').froalaEditor('html.set', txt, true);
    }
    function reply_bye(){
        var rl = '<br/>\n';

        // heure by JB ou Fabien :^)
        var signature = "";
        var d = new Date();
        var heure = d.getHours();
        if (heure >= 0 && heure < 5) {
            signature = 'Bonne fin de nuit,' + rl + '<i>{username}</i>';
        }
        else if (heure >= 5 && heure < 12) {
            signature = 'Bonne journée,' + rl + '<i>{username}</i>';
        }
        else if (heure >= 12 && heure < 15) {
            signature = 'Bonne après-midi,' + rl + '<i>{username}</i>';
        }
        else if (heure >= 15 && heure < 18) {
            signature = 'Bonne fin d\'après-midi,' + rl + '<i>{username}</i>';
        }
        else if (heure >= 18 && heure < 21) {
            signature = 'Bonne soirée,' + rl + '<i>{username}</i>';
        }
        else if (heure >= 21 && heure < 24) {
            signature = 'Bonne fin de soirée,' + rl + '<i>{username}</i>';
        }
        else {
            signature = 'A bientôt !' + rl + '<i>{username}</i>';
        }

        var username = $('span.p-navgroup-linkText').eq(0).text();
        var actual_txt = $('.js-editor').froalaEditor('html.get', true);
        reply(actual_txt + rl + signature.replace('{username}', username));
    }

    var style= '<style>#barre{text-align:center;border-radius:5px;border:1px solid rgb(210,210,210);padding:10px;}#barre a{margin-right:8px;margin-left:8px;}</style>';
    var bye = '<a href="javascript:void(0);" style="color:#3c5365;text-decoration:none;" data-action="bye" data-message=""><i class="fa fa-child"></i> Bye</a>';
    var resolu = '<a href="javascript:void(0);" style="color:#3c5365;text-decoration:none;" data-action="normal" data-message="Salut,<br />Ta demande est-elle [COLOR=#006d80][B]résolue[/B] [size=5][FA]fa-check-circle-o[/FA][/size][/COLOR] ?<br /><br />Si oui, je t\'invite à cliquer sur [COLOR=#006d80][b]Cette réponse a répondu à ma question[/b][/COLOR] sur le message qui t\'a aidé pour rajouter le préfixe [COLOR=#006d80][b]résolu[/b][/COLOR] à la discussion. :)"><i class="fa fa-check-square-o"></i> Résolu ?</a>';
    var deplacement_resolu = '<a href="javascript:void(0);" style="color:#3c5365;text-decoration:none;" data-action="normal" data-message="Salut,<br/>J\'ai [COLOR=rgb(0, 109, 128)][B]déplacé[/B][/COLOR] [FA]fa-forward[/FA] ta discussion en  section [COLOR=rgb(0, 109, 128)][B]Résolu[/B][/COLOR]. [SIZE=5][FA]fa-check-circle-o[/FA][/SIZE]"><i class="fa fa-check-square"></i> Déplacement résolu</a>';
    var deplacement_resolu2 = '<a href="javascript:void(0);" style="color:#3c5365;text-decoration:none;" data-action="normal" data-message="Salut,<br />J\'ai [COLOR=rgb(0, 109, 128)][B]déplacé[/B][/COLOR] [FA]fa-forward[/FA] ta discussion en section [COLOR=rgb(0, 109, 128)][B]Résolu[/B][/COLOR]. [SIZE=5][FA]fa-check-circle-o[/FA]<br /><br />[/SIZE]Pour les prochaines fois, tu peux cliquer sur [COLOR=rgb(0, 109, 128)][B]Cette réponse a répondu à ma question[/B][/COLOR] sous le message qui t\'a aidé pour rajouter le préfixe [COLOR=rgb(0, 109, 128)][B]résolu[/B][/COLOR] [FA]fa-check-circle-o[/FA] à la discussion. :)"><i class="fa fa-check-square"></i> Déplacement résolu v2</a>';
    var deplacement_resolu3 = '<a href="javascript:void(0);" style="color:#3c5365;text-decoration:none;" data-action="normal" data-message="Salut,<br/>J\'ai [COLOR=#006d80][b]déplacé[/b][/COLOR] [FA]fa-forward[/FA] la discussion en  section [COLOR=#006d80][b]Résolu[/b][/COLOR] [FA]fa-check-circle-o[/FA] avec l\'autorisation de l\'auteur de la discussion. [size=5][COLOR=#006d80][FA]fa-graduation-cap[/FA][/COLOR][/size]"><i class="fa fa-check-square"></i> Déplacement résolu v3</a>';
    var doublon = '<a href="javascript:void(0);" style="color:#3c5365;text-decoration:none;" data-action="normal" data-message="Salut,<br/>Une discussion [COLOR=#006d80][B]très similaire[/B][/COLOR] [FA]fa-exchange[/FA] existe déjà sur le forum.<br/><br/>Je [COLOR=#006d80][B]déplace[/B][/COLOR] [FA]fa-trash[/FA] donc celle-ci pour cause de [COLOR=#006d80][B]doublon[/B].[/COLOR] [FA]fa-files-o[/FA] :modo:"><i class="fa fa-clipboard"></i> Doublon</a>';
    var titre = '<a href="javascript:void(0);" style="color:#3c5365;text-decoration:none;" data-action="normal" data-message="Salut,<br/>J\'ai [COLOR=#006d80][b]édité[/b][/COLOR] [FA]fa-pencil-square-o[/FA] le titre de ta discussion pour  que celle-ci soit plus [COLOR=#006d80][b]compréhensible[/b][/COLOR].<br/><br/>A l\'avenir essaie de faire des titres plus longs et détaillés, plus le titre est [COLOR=#006d80][b]long[/b][/COLOR] et [COLOR=#006d80][b]détaillé[/b][/COLOR], plus tu  obtiendras de [COLOR=#006d80][b]vues[/b][/COLOR] [FA]fa-eye[/FA] ainsi que des [COLOR=#006d80][b]réponses[/b][/COLOR] [FA]fa-comments[/FA]."><i class="fa fa-header"></i> Titre</a>';
    var deplacement = '<a href="javascript:void(0);" style="color:#3c5365;text-decoration:none;" data-action="normal" data-message="Salut,<br/>Ton topic se trouvait dans la [COLOR=#006d80][b]mauvaise section[/b][/COLOR] [FA]fa-exchange[/FA], je l\'ai donc déplacé dans la [COLOR=#006d80][b]bonne section[/b][/COLOR] [FA]fa-forward[/FA] :modo:"><i class="fa fa-arrows-h"></i> Déplacement</a>';
    var conditions = '<a href="javascript:void(0);" style="color:#3c5365;text-decoration:none;" data-action="normal" data-message="Salut,<br/>Tu n\'as pas les [COLOR=#006d80][B]conditions requises[/B][/COLOR] pour proposer une [COLOR=#006d80][B]vente[/B][/COLOR], un [COLOR=#006d80][B]échange[/B][/COLOR] ou un [COLOR=#006d80][B]service  payant[/B][/COLOR]. [FA]fa-shopping-cart[/FA]<br/><br/>Voici les conditions :<br/>[LIST]<br/>[*][B]750 messages [FA]fa-envelope-o[/FA][/B]<br/>[*][B]250 j\'aimes [FA]fa-thumbs-o-up[/FA][/B]<br/>[*][B]5 mois d’ancienneté [FA]fa-calendar-o[/FA][/B]<br/>[/LIST]"><i class="fa fa-certificate"></i> Conditions</a>';
    var conditions_premium = '<a href="javascript:void(0);" style="color:#3c5365;text-decoration:none;" data-action="normal" data-message="Salut,<br/>Tu n\'as pas les [COLOR=#006d80][B]conditions requises[/B][/COLOR] pour proposer une [COLOR=#006d80][B]vente[/B][/COLOR], un [COLOR=#006d80][B]échange[/B][/COLOR] ou un [COLOR=#006d80][B]service  payant[/B][/COLOR]. [FA]fa-shopping-cart[/FA]<br/><br/>Voici les conditions :<br/>[LIST]<br/>[*][B]600 messages [FA]fa-envelope-o[/FA][/B]<br/>[*][B]200 j\'aimes [FA]fa-thumbs-o-up[/FA][/B]<br/>[*][B]3 mois d’ancienneté [FA]fa-calendar-o[/FA][/B]<br/>[/LIST]"><i class="fa fa-certificate"></i> Conditions premium</a>';
    var conditions_echange = '<a href="javascript:void(0);" style="color:#3c5365;text-decoration:none;" data-action="normal" data-message="Salut,<br/>Tu n\'as pas les [COLOR=#006d80][B]conditions requises[/B][/COLOR] pour effectuer un [COLOR=#006d80][B]échange[/B][/COLOR]. [FA]fa-shopping-cart[/FA]<br/><br/>Voici les conditions :<br/>[LIST]<br/>[*][B]500 messages [FA]fa-envelope-o[/FA][/B]<br/>[*][B]200 j\'aimes [FA]fa-thumbs-o-up[/FA][/B]<br/>[*][B]3 mois d’ancienneté [FA]fa-calendar-o[/FA][/B]<br/>[/LIST]"><i class="fa fa-exchange"></i> Conditions échange</a>';
    var warez = '<a href="javascript:void(0);" style="color:#3c5365;text-decoration:none;" data-action="normal" data-message="Salut,<br/>Les discussions encourageant [COLOR=#006d80][b]l\'utilisation de la piraterie[/b][/COLOR] [FA]fa-user-secret[/FA] et les [COLOR=#006d80][b]distributions de contenu de type warez[/b][/COLOR] [FA]fa-unlock-alt[/FA], ou tout contenu autrement illégal sont interdites. [FA]fa-lock[/FA]<br/><br/>Je [COLOR=#006d80][b]déplace[/b][/COLOR] [FA]fa-forward[/FA] donc ton sujet. [FA]trash[/FA]"><i class="fa fa-ban"></i> Warez</a>';
    var scan = '<a href="javascript:void(0);" style="color:#3c5365;text-decoration:none;" data-action="normal" data-message="Salut,<br/>Ton sujet ne comporte pas de [COLOR=#006d80][B]virus scan[/B][/COLOR] [FA]fa-bug[/FA].<br/><br/>Pour faire un virus scan, rend toi sur [B][URL=\'https://virustotal.com\']ce site[/URL][/B], transfère le fichier mit en téléchargement et envoie moi le résultat en [COLOR=#006d80][B]MP[/B][/COLOR].<br/><br/>Je supprime donc le lien inséré en attendant que [COLOR=#006d80][B]tu me contactes[/B][/COLOR]. [FA]fa-comments[/FA]<br/><br/>Si des [COLOR=#006d80][B]résultats négatifs[/B][/COLOR] [FA]fa-times[/FA] sont  obtenus tu devras les justifier, si tu n\'es pas en mesure de le faire ton sujet sera [COLOR=#006d80][B]supprimé[/B][/COLOR]. [FA]fa-trash[/FA]"><i class="fa fa-exclamation-triangle"></i> Virus Scan</a>';
    var shop = '<a href="javascript:void(0);" style="color:#3c5365;text-decoration:none;" data-action="normal" data-message="Salut,<br/>Souhaites-tu que je [B][COLOR=#006d80]vérifie[/COLOR] [FA]fa-check[/FA][/B] tes services  ? <br/><br/>Faire vérifier ses services montre que tes services sont [COLOR=#006d80][B]fiables [/B][/COLOR] [FA]fa-users[/FA] à la communauté, pour te permettre  ainsi d\'augmenter le nombre de [COLOR=#006d80][B]clients[/B][/COLOR]. [FA]fa-users[/FA]<br/><br/>Il suffit de me contacter en [COLOR=#006d80][B]MP[/B][/COLOR] [FA]fa-envelope-o[/FA],  de faire ce que tu proposes, j\'ajouterais ensuite la balise [COLOR=#006d80][B]Vérifié[/B][/COLOR] à ton sujet."><i class="fa fa-shopping-cart"></i> Shop</a>';
    var pub = '<a href="javascript:void(0);" style="color:#3c5365;text-decoration:none;" data-action="normal" data-message="Salut,<br/>La [COLOR=#006d80][B]publicité[/B][/COLOR] [FA]fa-bullhorn[/FA] n\'est pas autorisée sur le  forum. [FA]fa-times[/FA] [I](en dehors de la signature)[/I]<br/><br/>Je [COLOR=#006d80][B]déplace[/B][/COLOR] donc ton sujet. [FA]fa-trash[/FA]"><i class="fa fa-thumbs-down"></i> Pub</a>';
    var spam = '<a href="javascript:void(0);" style="color:#3c5365;text-decoration:none;" data-action="normal" data-message="Salut,<br/>Le [COLOR=#006d80][B]spam[/B][/COLOR] n\'est pas autorisé sur le forum. [FA]fa-ban[/FA]<br/><br/>Je [COLOR=#006d80][B]déplace[/B][/COLOR] [FA]fa-forward[/FA] donc ton sujet. [FA]trash[/FA]"><i class="fa fa-comment"></i> Spam</a>';
    var pres = '<a href="javascript:void(0);" style="color:#3c5365;text-decoration:none;" data-action="normal" data-message="Bienvenue sur [B][COLOR=#006d80]RealityGaming[/COLOR][/B]. :RG: <br/> N\'hésite-pas à me [B][COLOR=#006d80]solliciter[/COLOR][/B] si tu as une question ! [FA]fa-lg fa-question[/FA]"><i class="fa fa-hand-o-up"></i> Présentation</a>';
    var virus = '<a href="javascript:void(0);" style="color:#3c5365;text-decoration:none;" data-action="normal" data-message="Salut,<br/>Je te conseille de faire [COLOR=#006d80][b]un scan[/b][/COLOR] [FA]fa-chevron-circle-down[/FA] de ton ordinateur avec les logiciels suivants, ils vont te permettre de faire des scans [B][COLOR=#006d80]approfondis[/COLOR][/B] de ton système:<br/>[LIST][*][COLOR=#006d80][b]ADW Cleaner[/b][/COLOR] [*][COLOR=#006d80][b]MalwareBytes[/b][/COLOR] [*][COLOR=#006d80][b]CCleaner[/b][/COLOR][/LIST]"><i class="fa fa-bug"></i> Virus</a>';
    var staff = '<a href="javascript:void(0);" style="color:#3c5365;text-decoration:none;" data-action="normal" data-message="Salut,<br/>La règle d\'or est de ne pas parler de promotions en [B][COLOR=#006d80]publique[/COLOR][/B], ceci baisse considérablement vos chances ! <br /><br />Contentez-vous de rester [B][COLOR=#006d80]vous-même[/COLOR][/B], cela ne sert à rien de se montrer super-actif uniquement dans le but d\'obtenir une promotion, croyez-en notre expérience, les personnes qui ont pour seul but d\'être promu y sont [B][COLOR=#006d80]rarement[/COLOR][/B] ou n\'y reste pas [B][COLOR=#006d80]longtemps[/COLOR][/B]. (n) <br /><br />Montrez-vous volontaire, aidez les personnes dans le besoin, partagez vos connaissances, signalez des [B][COLOR=#006d80]infractions potentielles[/COLOR][/B] au staff grâce à l\'option [B][COLOR=#006d80]Signaler[/B][/COLOR]. [FA]fa-lg fa-thumbs-o-up[/FA]"><i class="fa fa-user-plus"></i> Demande STAFF</a>';
    var ras = '<a href="javascript:void(0);" style="color:#3c5365;text-decoration:none;" data-action="RAS" data-message="RAS [color=#006d80][FA]fa-check[/FA][/color]"><i class="fa fa-check"></i> RAS</a>';

    $('.formButtonGroup').after('<br />' + style + '<div class="barre" id="barre">' + bye + resolu + deplacement_resolu + deplacement_resolu2 + deplacement_resolu3 + doublon + titre + deplacement + conditions + conditions_premium +  conditions_echange + warez + scan + shop + pub + spam + pres + virus + staff + ras +'</div><br />'); // UI

    $('#barre a').on('click', function(){
        if($(this).data('action') == "RAS"){
            reply($(this).data('message'));
        }
        else if($(this).data('action') == "normal"){
            reply($(this).data('message') + "<br />");
            reply_bye();
        }
        else if($(this).data('action') == "bye"){
            reply_bye();
        }
    });
});