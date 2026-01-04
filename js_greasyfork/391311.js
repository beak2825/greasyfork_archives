// ==UserScript==
// @name               QuickAssist | Updated by KORSiRO
// @namespace          https://induste.com/
// @version            4.2
// @description        Permet la gestion des phrases des assistants !
// @include         https://induste.com/threads/*
// @include         https://induste.com/conversations/*
// @include         https://induste.com/conversations/add?to=*
// @downloadURL https://update.greasyfork.org/scripts/391311/QuickAssist%20%7C%20Updated%20by%20KORSiRO.user.js
// @updateURL https://update.greasyfork.org/scripts/391311/QuickAssist%20%7C%20Updated%20by%20KORSiRO.meta.js
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
	var reglements = '<a href="javascript:void(0);" style="color:#3c5365;text-decoration:none;" data-action="normal" data-message="Salut,<br/>Je t\'invite à aller voir les [COLOR=#FBA026][B]règlements du Forum[/B][/COLOR] [COLOR=#2969B0][FA]fa-users[/FA][/COLOR] et de la [COLOR=#FBA026][B]Shoutbox[/B][/COLOR] [COLOR=#2969B0][FA]fa-comment[/FA][/COLOR].<br /><br /> [B][URL=\'https://induste.com/threads/reglement-du-forum.74714\'][COLOR=#FBA026]Règlement du Forum[/URL][/B][/COLOR] [COLOR=#2969B0][FA]fa-mouse-pointer faa-shake[/FA][/COLOR]<br /><br /> [B][URL=\'https://induste.com/threads/reglement-de-la-shoutbox.168302\'][COLOR=#FBA026]Règlement de la Shoutbox[/URL][/B][/COLOR] [COLOR=#2969B0][FA]fa-mouse-pointer faa-shake[/FA][/COLOR]"><i class="fa fa-file-alt"></i> Règlements</a>';
    var resolu = '<a href="javascript:void(0);" style="color:#3c5365;text-decoration:none;" data-action="normal" data-message="Salut,<br />Ta demande est-elle [COLOR=rgb(251, 160, 38)][B]résolue[/B][/COLOR] [COLOR=#2969B0][size=5][FA]fa-check-circle[/FA][/size][/COLOR] ?<br /><br />Si oui, je t\'invite à cliquer sur [COLOR=#FBA026][b]Cette réponse a répondu à ma question[/b][/COLOR] sur le message qui t\'a aidé pour rajouter le préfixe [COLOR=#FBA026][b]résolu[/b][/COLOR] à la discussion. :)"><i class="fa fa-check-circle"></i> Résolu ?</a>';
    var deplacement_resolu = '<a href="javascript:void(0);" style="color:#3c5365;text-decoration:none;" data-action="normal" data-message="Salut,<br/>J\'ai [COLOR=#FBA026][B]déplacé[/B][/COLOR] [COLOR=#2969B0][FA]fa-forward[/FA][/COLOR] ta discussion en  section [COLOR=#FBA026][B]Résolu[/B][/COLOR]. [SIZE=5][COLOR=#2969B0][FA]fa-check-circle[/FA][/COLOR][/SIZE]"><i class="fa fa-check-circle"></i> Déplacement résolu</a>';
    var deplacement_resolu2 = '<a href="javascript:void(0);" style="color:#3c5365;text-decoration:none;" data-action="normal" data-message="Salut,<br />J\'ai [COLOR=#FBA026][B]déplacé[/B][/COLOR] [COLOR=#2969B0][FA]fa-forward[/FA][/COLOR] ta discussion en section [COLOR=#FBA026][B]Résolu[/B][/COLOR]. [COLOR=#2969B0][SIZE=5][FA]fa-check-circle[/FA][/COLOR]<br /><br />[/SIZE]Pour les prochaines fois, tu peux cliquer sur [COLOR=#FBA026][B]Cette réponse a répondu à ma question[/B][/COLOR] sous le message qui t\'a aidé pour rajouter le préfixe [COLOR=#FBA026][B]résolu[/B][/COLOR] [COLOR=#2969B0][FA]fa-check-circle[/FA][/COLOR] à la discussion. :)"><i class="fa fa-check-square"></i> Déplacement résolu v2</a>';
    var deplacement_resolu3 = '<a href="javascript:void(0);" style="color:#3c5365;text-decoration:none;" data-action="normal" data-message="Salut,<br/>J\'ai [COLOR=#FBA026][b]déplacé[/b][/COLOR] [COLOR=#2969B0][FA]fa-forward[/FA][/COLOR] la discussion en  section [COLOR=#FBA026][b]Résolu[/b][/COLOR] [COLOR=#2969B0][FA]fa-check-circle[/FA][/COLOR] avec l\'autorisation de l\'auteur de la discussion. [size=5][COLOR=#2969B0][FA]fa-graduation-cap[/FA][/COLOR][/size]"><i class="fa fa-check-square"></i> Déplacement résolu v3</a>';
    var doublon = '<a href="javascript:void(0);" style="color:#3c5365;text-decoration:none;" data-action="normal" data-message="Salut,<br/>Une discussion [COLOR=#FBA026][B]très similaire[/B][/COLOR] [COLOR=#2969B0][FA]fa-exchange[/FA][/COLOR] existe déjà sur le forum.<br/><br/>Je [COLOR=#FBA026][B]déplace[/B][/COLOR] [COLOR=#2969B0][FA]fa-trash[/FA][/COLOR] donc celle-ci pour cause de [COLOR=#FBA026][B]doublon[/B].[/COLOR] [COLOR=#2969B0][FA]fa-files-o[/FA][/COLOR] :modo:"><i class="fa fa-clipboard"></i> Doublon</a>';
    var titre = '<a href="javascript:void(0);" style="color:#3c5365;text-decoration:none;" data-action="normal" data-message="Salut,<br/>J\'ai [COLOR=#FBA026][b]édité[/b][/COLOR] [COLOR=#2969B0][FA]fa-pencil-square-o[/FA][/COLOR] le titre de ta discussion pour  que celle-ci soit plus [COLOR=#FBA026][b]compréhensible[/b][/COLOR].<br/><br/>A l\'avenir essaie de faire des titres plus longs et détaillés, plus le titre est [COLOR=#FBA026][b]long[/b][/COLOR] et [COLOR=#FBA026][b]détaillé[/b][/COLOR], plus tu  obtiendras de [COLOR=#FBA026][b]vues[/b][/COLOR] [COLOR=#2969B0][FA]fa-eye[/FA][/COLOR] ainsi que des [COLOR=#FBA026][b]réponses[/b][/COLOR] [COLOR=#2969B0][FA]fa-comments[/FA][/COLOR]."><i class="fa fa-header"></i> Titre</a>';
    var deplacement = '<a href="javascript:void(0);" style="color:#3c5365;text-decoration:none;" data-action="normal" data-message="Salut,<br/>Ton topic se trouvait dans la [COLOR=#FBA026][b]mauvaise section[/b][/COLOR] [COLOR=#2969B0][FA]fa-exchange[/FA][/COLOR], je l\'ai donc déplacé dans la [COLOR=#FBA026][b]bonne section[/b][/COLOR] [COLOR=#2969B0][FA]fa-forward[/FA][/COLOR] :modo:"><i class="fa fa-arrows-h"></i> Déplacement</a>';
    var conditions = '<a href="javascript:void(0);" style="color:#3c5365;text-decoration:none;" data-action="normal" data-message="Salut,<br/>Tu n\'as pas les [COLOR=#FBA026][B]conditions requises[/B][/COLOR] pour proposer une [COLOR=#FBA026][B]vente[/B][/COLOR], un [COLOR=#FBA026][B]échange[/B][/COLOR] ou un [COLOR=#FBA026][B]service  payant[/B][/COLOR]. [COLOR=#2969B0][FA]fa-shopping-cart[/FA][/COLOR]<br/><br/>Voici les conditions :<br/>[LIST]<br/>[*][B]750 messages  [COLOR=#2969B0][FA]fa-envelope[/FA][/B][/COLOR]<br/>[*][B]250 j\'aimes  [COLOR=#2969B0][FA]fa-thumbs-up[/FA][/B][/COLOR]<br/>[*][B]5 mois d’ancienneté [COLOR=#2969B0][FA]fa-calendar-o[/FA][/B][/COLOR]<br/>[/LIST]"><i class="fa fa-certificate"></i> Conditions</a>';
    var conditions_premium = '<a href="javascript:void(0);" style="color:#3c5365;text-decoration:none;" data-action="normal" data-message="Salut,<br/>Tu n\'as pas les [COLOR=#FBA026][B]conditions requises[/B][/COLOR] pour proposer une [COLOR=#FBA026][B]vente[/B][/COLOR], un [COLOR=#FBA026][B]échange[/B][/COLOR] ou un [COLOR=#FBA026][B]service  payant[/B][/COLOR]. [COLOR=#2969B0][FA]fa-shopping-cart[/FA][/COLOR]<br/><br/>Voici les conditions :<br/>[LIST]<br/>[*][B]600 messages [COLOR=#2969B0][FA]fa-envelope[/FA][/B][/COLOR]<br/>[*][B]200 j\'aimes [COLOR=#2969B0][FA]fa-thumbs-up[/FA][/B][/COLOR]<br/>[*][B]3 mois d’ancienneté [COLOR=#2969B0][FA]fa-calendar-o[/FA][/B][/COLOR]<br/>[/LIST]"><i class="fa fa-user-plus"></i> Conditions premium</a>';
    var conditions_echange = '<a href="javascript:void(0);" style="color:#3c5365;text-decoration:none;" data-action="normal" data-message="Salut,<br/>Tu n\'as pas les [COLOR=#FBA026][B]conditions requises[/B][/COLOR] pour effectuer un [COLOR=#FBA026][B]échange[/B][/COLOR]. [COLOR=#2969B0][FA]fa-shopping-cart[/FA][/COLOR]<br/><br/>Voici les conditions :<br/>[LIST]<br/>[*][B]500 messages [COLOR=#2969B0][FA]fa-envelope[/FA][/B][/COLOR]<br/>[*][B]200 j\'aimes [COLOR=#2969B0][FA]fa-thumbs-up[/FA][/B][/COLOR]<br/>[*][B]3 mois d’ancienneté [COLOR=#2969B0][FA]fa-calendar-o[/FA][/B][/COLOR]<br/>[/LIST]"><i class="fa fa-exchange"></i> Conditions échange</a>';
    var warez = '<a href="javascript:void(0);" style="color:#3c5365;text-decoration:none;" data-action="normal" data-message="Salut,<br/>Les discussions encourageant [COLOR=#FBA026][b]l\'utilisation de la piraterie[/b][/COLOR] [COLOR=#2969B0][FA]fa-user-secret[/FA][/COLOR] et les [COLOR=#FBA026][b]distributions de contenu de type warez[/b][/COLOR] [COLOR=#2969B0][FA]fa-unlock-alt[/FA][/COLOR], ou tout contenu autrement illégal sont interdites. [COLOR=#2969B0][FA]fa-lock[/FA][/COLOR]<br/><br/>Je [COLOR=#FBA026][b]déplace[/b][/COLOR] [COLOR=#2969B0][FA]fa-forward[/FA][/COLOR] donc ton sujet. [COLOR=#2969B0][FA]trash[/FA][/COLOR]"><i class="fa fa-ban"></i> Warez</a>';
    var scan = '<a href="javascript:void(0);" style="color:#3c5365;text-decoration:none;" data-action="normal" data-message="Salut,<br/>Ton sujet ne comporte pas de [COLOR=#FBA026][B]virus scan[/B][/COLOR] [COLOR=#2969B0][FA]fa-bug[/FA][/COLOR].<br/><br/>Pour faire un virus scan, rend toi sur [B][URL=\'https://virustotal.com\']ce site[/URL][/B], transfère le fichier mit en téléchargement et envoie moi le résultat en [COLOR=#FBA026][B]MP[/B][/COLOR].<br/><br/>Je supprime donc le lien inséré en attendant que [COLOR=#FBA026][B]tu me contactes[/B][/COLOR]. [COLOR=#2969B0][FA]fa-comments[/FA][/COLOR]<br/><br/>Si des [COLOR=#FBA026][B]résultats négatifs[/B][/COLOR] [COLOR=#2969B0][FA]fa-times[/FA][/COLOR] sont  obtenus tu devras les justifier, si tu n\'es pas en mesure de le faire ton sujet sera [COLOR=#FBA026][B]supprimé[/B][/COLOR]. [COLOR=#2969B0][FA]fa-trash[/FA][/COLOR]"><i class="fa fa-exclamation-triangle"></i> Virus Scan</a>';
    var shop = '<a href="javascript:void(0);" style="color:#3c5365;text-decoration:none;" data-action="normal" data-message="Salut,<br/>Souhaites-tu que je [B][COLOR=#FBA026]vérifie[/COLOR] [COLOR=#2969B0][FA]fa-check[/FA][/B][/COLOR] tes services  ? <br/><br/>Faire vérifier ses services montre que tes services sont [COLOR=#FBA026][B]fiables [/B][/COLOR] [COLOR=#2969B0][FA]fa-users[/FA][/COLOR] à la communauté, pour te permettre  ainsi d\'augmenter le nombre de [COLOR=#FBA026][B]clients[/B][/COLOR]. [COLOR=#2969B0][FA]fa-users[/FA][/COLOR]<br/><br/>Il suffit de me contacter en [COLOR=#FBA026][B]MP[/B][/COLOR] [COLOR=#2969B0][FA]fa-envelope-o[/FA][/COLOR],  de faire ce que tu proposes, j\'ajouterais ensuite la balise [COLOR=#FBA026][B]Vérifié[/B][/COLOR] à ton sujet."><i class="fa fa-shopping-cart"></i> Shop</a>';
    var pub = '<a href="javascript:void(0);" style="color:#3c5365;text-decoration:none;" data-action="normal" data-message="Salut,<br/>La [COLOR=#FBA026][B]publicité[/B][/COLOR] [COLOR=#2969B0][FA]fa-bullhorn[/FA][/COLOR] n\'est pas autorisée sur le  forum. [COLOR=#2969B0][FA]fa-times[/FA][/COLOR] [I](en dehors de la signature)[/I]<br/><br/>Je [COLOR=#FBA026][B]déplace[/B][/COLOR] donc ton sujet. [COLOR=#2969B0][FA]fa-trash[/FA][/COLOR]"><i class="fa fa-thumbs-down"></i> Pub</a>';
    var spam = '<a href="javascript:void(0);" style="color:#3c5365;text-decoration:none;" data-action="normal" data-message="Salut,<br/>Le [COLOR=#FBA026][B]spam[/B][/COLOR] n\'est pas autorisé sur le forum. [COLOR=#2969B0][FA]fa-ban[/FA][/COLOR]<br/><br/>Je [COLOR=#FBA026][B]déplace[/B][/COLOR] [COLOR=#2969B0][FA]fa-forward[/FA][/COLOR] donc ton sujet. [COLOR=#2969B0][FA]trash[/FA][/COLOR]"><i class="fa fa-comment"></i> Spam</a>';
    var pres = '<a href="javascript:void(0);" style="color:#3c5365;text-decoration:none;" data-action="normal" data-message="Bienvenue sur [B][COLOR=#FBA026]Induste[/COLOR][/B]. :Induste: <br/> N\'hésite-pas à me [B][COLOR=#FBA026]solliciter[/COLOR][/B] si tu as une question ! [COLOR=#2969B0][FA]fa-lg fa-question[/FA][/COLOR]"><i class="fa fa-hand-o-up"></i> Présentation</a>';
    var virus = '<a href="javascript:void(0);" style="color:#3c5365;text-decoration:none;" data-action="normal" data-message="Salut,<br/>Je te conseille de faire [COLOR=#FBA026][b]un scan[/b][/COLOR] [COLOR=#2969B0][FA]fa-chevron-circle-down[/FA][/COLOR] de ton ordinateur avec les logiciels suivants, ils vont te permettre de faire des scans [B][COLOR=#FBA026]approfondis[/COLOR][/B] de ton système:<br/>[LIST][*][COLOR=#FBA026][b]ADW Cleaner[/b][/COLOR] [*][COLOR=#FBA026][b]MalwareBytes[/b][/COLOR] [*][COLOR=#FBA026][b]CCleaner[/b][/COLOR][/LIST]"><i class="fa fa-bug"></i> Virus</a>';
    var staff = '<a href="javascript:void(0);" style="color:#3c5365;text-decoration:none;" data-action="normal" data-message="Salut,<br/>La règle d\'or est de ne pas parler de promotions en [B][COLOR=#FBA026]publique[/COLOR][/B], ceci baisse considérablement vos chances ! <br /><br />Contentez-vous de rester [B][COLOR=#FBA026]vous-même[/COLOR][/B], cela ne sert à rien de se montrer super-actif uniquement dans le but d\'obtenir une promotion, croyez-en notre expérience, les personnes qui ont pour seul but d\'être promu y sont [B][COLOR=#FBA026]rarement[/COLOR][/B] ou n\'y reste pas [B][COLOR=#FBA026]longtemps[/COLOR][/B]. (n) <br /><br />Montrez-vous volontaire, aidez les personnes dans le besoin, partagez vos connaissances, signalez des [B][COLOR=#FBA026]infractions potentielles[/COLOR][/B] au staff grâce à l\'option [B][COLOR=#FBA026]Signaler[/B][/COLOR]. [COLOR=#2969B0][FA]fa-lg fa-thumbs-o-up[/FA][/COLOR]"><i class="fa fa-user-plus"></i> Demande STAFF</a>';
    var ras = '<a href="javascript:void(0);" style="color:#3c5365;text-decoration:none;" data-action="RAS" data-message="RAS [COLOR=#2969B0][FA]fa-check[/FA][/COLOR]"><i class="fa fa-check"></i> RAS</a>';

    $('.formButtonGroup').after('<br />' + style + '<div class="barre" id="barre">' + bye + reglements + resolu + deplacement_resolu + deplacement_resolu2 + deplacement_resolu3 + doublon + titre + deplacement + conditions + conditions_premium +  conditions_echange + warez + scan + shop + pub + spam + pres + virus + staff + ras +'</div><br />'); // UI

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