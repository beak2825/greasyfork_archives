// ==UserScript==
// @name               [DEPRECATED] SNIR Touchard - Compagnon
// @namespace          https://greasyfork.org/en/users/105361-randomusername404
// @description        Modification graphique du site de la section SNIR de Touchard.
// @include            http://172.18.58.14/siteweb/public/*
// @include            http://195.221.61.190/siteweb/public/*
// @include            http://bts-snir.ddns.net/siteweb/public/*
// @version            1.67
// @run-at             document-start
// @require            https://code.jquery.com/jquery-3.2.1.min.js
// @require            https://cdnjs.cloudflare.com/ajax/libs/JQuery-Snowfall/1.7.4/snowfall.jquery.min.js
// @author             RandomUsername404
// @grant              none
// @icon               https://i.imgur.com/iFzhYPF.png
// @downloadURL https://update.greasyfork.org/scripts/33319/%5BDEPRECATED%5D%20SNIR%20Touchard%20-%20Compagnon.user.js
// @updateURL https://update.greasyfork.org/scripts/33319/%5BDEPRECATED%5D%20SNIR%20Touchard%20-%20Compagnon.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
$(document).ready(function () {
  
  /////////// CITATIONS & IMAGES /////////////
    
    if((document.location.href.indexOf('navigation') === -1) && (document.location.href.indexOf('recherche?textRecherche=') === -1))
    {
        // Tirage au sort. Citation ou image ?
        var tirage = Math.floor(100*(Math.random())+1);
        
        // Si tirage = citation (67% de chance d'avoir une citation)
        if(tirage > 33)
        {
            var citations = [
                "Tu ne peux pas faire semblant d'être une bonne personne simplement pour excuser tes mauvaises actions. <hr/> - Rich Stephenson, <i>Community</i>", //0
                "Cookie : Anciennement petit gâteau sucré, qu'on acceptait avec plaisir. <br/> Aujourd'hui : petit fichier informatique drôlement salé, qu'il faut refuser avec véhémence. <hr/> - Luc Fayard",
                "Nous autres, mordus d'informatique, préférons par-dessus tout passer notre temps à bidouiller nos ordinateurs, plutôt que les utiliser pour faire quelque chose de productif. <hr/> - Dave Barry",
                "Si j'étais échoué sur une île déserte et pouvait avoir en abondance une seule et unique variété de pomme, je me demanderais &quot;Mais comment j'ai pu me retrouver dans cette situation ?&quot; <hr/> - Randall Munroe, xkcd 1766",
                "L’ordinateur vous permet de faire plus d’erreurs plus vite que n’importe quelle autre invention de l’histoire de l’humanité, à l’exception possible des armes à feu et de la téquila. <hr/> - Mitch Ratcliffe",
                 "Les obscénités sur Internet ne sont même pas utilisées à bon escient. <hr/> - Karl Kleinpaste", //5
                "Le logiciel, c’est comme le sexe, c’est meilleur quand c’est gratuit. <hr/> - Linus Torvalds",
                "Il y a 10 types de personnes dans le monde : celles qui comprennent le binaire, et celles qui ne le comprennent pas. <hr/> - Anonyme",
                "Si vous ne réussissez pas du premier coup, appelez ça &quot;version 1.0&quot;. <hr/> - Anonyme",
                "Votez Jean-Luc ! <hr/> - Luigi Guilmin",
                "$! v0u$ p0uv32 1!r3 c3c!, v0u$ 4v32 vr4!m3n7 83$0!n d3 n!qu3r", //10
                "Je ne suis pas asocial, Je ne suis juste pas orienté utilisateur. <hr/> - Anonyme",
                "Mes logiciels n’ont jamais de bug. Ils développent juste certaines fonctions aléatoires. <hr/> - Anonyme",
                "Un programme informatique fait ce que vous lui avez dit de faire, pas ce que vous voulez qu'il fasse. <hr/> - Troisième loi de Greer de la Loi de Murphy",
                "J'ai une erreur dans ton programme. <hr/> - Algin Toshi, voleur de programme",
                "TRACTEUUUUR ! <hr/> - Valentin Bourdais", //15
                "Ce qui est paradoxal, c'est qu'en théorie, ça n'aurait pas dû fonctionner... mais Jimmy Wales est parti du principe que les gens sont honnêtes. <hr/> - Régis Barondeau à propos de Wikipédia",
                "Nous ne savons pas où nous allons, mais du moins il nous reste bien des choses à faire. <hr/> - Alan Turing",
                "MeowMeowBeenz capture l'essence des interactions humaines et la réduit en d'explicites, objectifs nombres.<br/>Je ne me suis jamais senti aussi vivant. <hr/> - Abed Nadir, <i>Community</i>",
                "Plus un ordinateur possède de RAM, plus vite il peut générer un message d’erreur. <hr/> - Dave Barry",
                "Un lapin ! <hr/> - Paul Ambrois", //20
                "Il y existe deux manières de concevoir un logiciel. La première, c’est de le faire si simple qu’il est évident qu’il ne présente aucun problème. <br/>La seconde, c’est de le faire si compliqué qu’il ne présente aucun problème évident. <br/>La première méthode est de loin la plus complexe. <hr/> - C.A.R. Hoare",
                "Les amis c'est comme les pommes de terre, quand tu les manges y'en a plus. <hr/> - Anonyme",
                "Lorsque vous dites &quot;le droit à la vie privée ne me préoccupe pas, parce que je n'ai rien à cacher&quot;, cela ne fait aucune différence avec le fait de dire &quot;Je me moque du droit à la liberté d'expression parce que je n'ai rien à dire&quot;, ou &quot;de la liberté de la presse parce que je n'ai rien à écrire&quot;. <hr/> - Edward Snowden",
                "[Les daemons] agissent sans aucune interaction. Ils contrôlent, surveillent, notifient.<br/>Besoins primaires, souvenirs refoulés, habitudes inconscientes, ils sont toujours là, toujours actifs.<br/>On peut essayer de bien agir, de faire la différence mais c'est des foutaises.<br/>Les intentions ne valent rien.<br/>Elles ne nous dirigent pas, les daemons, si. <hr/> - Elliot Alderson, <i>Mr. Robot</i>",
                "C'est fou ce qu'on fait avec des pixels. <hr/> - Baptiste Bourge", //25
                "Le commerce est notre seul but chez Tyrell. Plus humain que l'humain est notre devise. <hr/> - Eldon Tyrell, <i>Blade Runner</i>",
                "F̶̶̘̤̣͓̗̜͕͠͠A̸̮͎͇̗̼̫̳͎͍͈̰͕̯͉̠͖̰͢͠͝T͈̠̙̲̘̝͇͎̖̫͎͍̟̪̪̟̟̖͟A҉̡͉̟̙̲̻̱͇̻̤̱̙͍̯̙̯̬͝L̸̸̢̹̘̖̥͖̜̬͈̝͎ ҉̸̛̜̱̟͚̲̞͍̥̭̙͈̼͕̰̫̝̜́E̲̱͕͓̝̱̤̩̖͈̮̭̰̟͔̲̣̪͝ͅR̕͏̸̬͔͈͙͖́͜R͠҉̘̗̺̟̙͖̻̲̙̥͖O̷̵҉͍̳̲̠̭̪͍̭͎͈̕R̷̴̞̗̰͙̙͔̘̖̭̬:̷̸̢͎͚̰̖̜̭͢͡ ̷͢҉͈̬̫̱̫̰̬͙͔̱̙͙ͅͅP̀҉̷̱̰͍͉̤̜̤̫̹̝͙̤͍̜͓̟͔́͡R̵̶̶̯͍͚̳̰͇͚̬̪̙O̵̜̫͉̣̣̬͝͝G͏̧̳̤͍̝̞̟͔͇̩̹R̶̨͇̼̲̯̥̼͎͜͡ͅA̶̶̧̱͉͕̻̼͕̼̩͎̖̦̫̭͘͞M̧̞̗͖̠͎̀́M̱͙͚͔̥̳̪͕̥̙͓͘E̷̛̞̼̺͇̖͓͉̙̥̥͈͞ ̷̴̛͔͍̹̬̣̠Ç̦̜̠̺̼̰̩̤͎̩̲͠ͅO͝͏̻̳͍͟ͅṞ̨̝̼̜̻̫̯Ṛ͚͎̱̝̩̜͉̮̼͙̟̤̕͟͝ͅO͏̷҉̵̮͈̤̱̜͈͕̖̜̬͈̻̘̯̩ͅͅM̵̫͉̜̳͇̯̣͓̞̠̰̹̼͘ͅP̜̣̼̙͔̭͉͓̘͓̹̥̣̝͚̟̻̮̱͟U̸̠̠͎̖̺̫̪̞̼̱̤͘͞ͅ",
                "La technologie est une chose fabuleuse qui rend la personne ennuyeuse. <hr/> - Daniel Godin",
                "Tout ce qui existe dans le monde à votre naissance est normal et ordinaire (...).<br/>Tout ce qui est inventé entre vos 15 et 35 ans est nouveau, excitant et révolutionnaire.<br/>Tout ce qui est inventé après vos 35 ans va à l'encontre de l'ordre naturel des choses. <hr/> - Douglas Adams",
                "I'm CEO... Bitch. <hr/> - Ancienne carte de visite de Mark Zuckerberg", //30
                "Si ça compile, c'est bien. Si ça s'exécute, c'est mieux. <hr/> - Linus Torvalds",
                "<i>for(i=0;i<=orgasme;i++) {<br/>input();<br/>output();<br/>}</i>",
                "&quot;Compatibilité ascendante&quot; signifie que toutes les erreurs de conception originelles sont conservées.",
                "Dans ce futur nouveau, vous n'êtes jamais perdu. Nous connaîtrons votre position au mètre près et bientôt au centimètre près. <hr/> - Eric Schmidt",
                "<i>#titanic {<br/>float:none;<br/>}</i>", //35
                "En tenant compte du taux de croissance du site et de la répartition des âges de ses utilisateurs, il y a probablement 10 à 20 millions de personnes qui ont créé un compte Facebook et qui sont mortes depuis. <hr/> - Randall Munroe",
                "Tu vois, le monde se divise en deux catégories : ceux qui ont un pistolet chargé et ceux qui creusent.<br/>Toi, tu creuses. <hr/> - Blondin, <i>Le Bon, la Brute et le Truand</i>",
                "- 2,21 gigowatts !!! 2,21 gigowatts !!! Mon Dieu !!!<br/>- Mais enfin c'est quoi un gigowatt ? <hr/> Emmett Brown & Marty McFly, <i>Retour vers le Futur</i>",
                "Une recherche sur Google consomme l'équivalent d'une ampoule à économie d'énergie pendant une heure... <hr/> - Philippe Lacassaigne",
                "Dans mon domaine, Wikipédia est plus fiable que les manuels. <hr/> - Harold Kroto, Prix Nobel de Chimie 1996", //40
                "1. Un robot ne peut porter atteinte à un être humain, ni, en restant passif, permettre qu'un être humain soit exposé au danger.<br/>2. Un robot doit obéir aux ordres qui lui sont donnés par un être humain, sauf si de tels ordres entrent en conflit avec la première loi.<br/>3. Un robot doit protéger son existence tant que cette protection n'entre pas en conflit avec la première ou la deuxième loi. <hr/> - Isaac Asimov",
                "Faire simple est probablement l’objectif le plus sophistiqué du monde. <hr/> - Steve Jobs",
                "Sur les logiciels… sur l’affaire des logiciels libres, évidemment les logiciels libres, quand on achète, évidemment des logiciels, par exemple le pack Microsoft (ça c’est pas du logiciel libre) : Word, Excel, Powerpoint, il y a évidemment des pare-feux, je viens de le dire, il y a des logiciels de sécurisation.<br/>Mais sur les logiciels libres vous pouvez également avoir des pare-feux, qui d’ailleurs, mais évidemment.<br/>Par exemple, nous au ministère, nous avons un logiciel libre, qui s’appelle OpenOffice et il y a effectivement un logiciel de sécurisation qui empêche en effet le ministère à la Culture d’avoir accès, bien sûr, et les éditeurs de logiciels libres fournissent des pares-feux, et fournissent même des pare-feux gratuits. Donc cet argument est sans fondement. Voilà ce que je voulais dire. <hr/> - Christine Albanel, ministre de la Culture",
                "Je vais créer une interface graphique avec Visual Basic... Voir si je peux traquer son adresse IP. <hr/> - Lindsay Monroe, <i>Les Experts : Manhattan</i>",
                "Il n'y a aucune chance pour que l'iPhone arrive à avoir une part de marché significative. <hr/> - Steve Ballmer", //45
                "Les jeux vidéo n'ont pas de répercutions sur la santé des enfants, je veux dire si Pacman nous avait affecté étant gosses, on serait tous en train de courir dans une salle obscure, en bouffant des comprimés et en écoutant de la musique répétitive... <hr/> - Marcus Brigstocke",
                "Un biscuit tu me diras ça n'a pas de spirit, c'est juste un biscuit. Mais avant, c'était du lait, des oeufs. Et dans les oeufs, il y a la vie potentielle... <hr/> - Jean-Claude Van Damme",
                "L'Espace. On pourrait croire qu'il est infini, mais lorsque vous atteignez la fin un gorille commence à vous balancer des tonneaux. <hr/> - Philip J. Fry, <i>Futurama</i>",
                "Moi je veux bien ne pas rire du malheur des autres, mais il faudrait alors que les autres fassent un petit effort pour ne pas être ridicules. <hr/> - Philippe Geluck",
                "Mais pourquoi vous avez retiré la bite ?! <hr/> - Théo Fouyet", //50
                "Recherche : Quelqu'un avec qui voyager dans le temps. Ce n'est pas une blague. [...] Vous serez payé à notre retour. Amenez vos propres armes. Sécurité non assurée. Je ne l'ai fait qu'une fois auparavant. <hr/> - Petite annonce, <i>Backwoods Home</i> (Sept./Oct. 1997)",
                "<i>Cham à l'eau</i> rentre sur le chat<hr/><font color='aquamarine'>Cham à l'eau :</font> PUTAIN LES GARS C'EST QUI QUI A MIS UN MAGASINE DE PR0N GAY DANS MA BOITE AUX LETTRES A MON NOM !!! MA MERE M'A DECHIRE !!! JE SAIS QUE CEST VOUS !!!<br/><font color='chartreuse'>Moi :</font> C'est lui.<br/><font color='black'>Lui :</font> Hein ??? Arretez les gars c'est pas moi !!<br/><font color='chartreuse'>Moi :</font> Je sais que c'est pas moi mais là c'est toi qu'on accuse !<br/><font color='yellow'>Toi :</font> Mais j'ai rien fait !<br/><font color='aquamarine'>Cham à l'eau :</font> Nan mais sérieux dénoncez-vous !<br/><font color='violet'>Vous :</font> J'y suis pour rien !!<br/><font color='violet'>Vous :</font> De toute manière personne connait ton adresse !<br/><font color='#ffa443'>Personne :</font> Oui mais j'ai rien fait.<br/><font color='yellow'>Toi :</font> Bon j'avoue c'est moi !<br/><font color='chartreuse'>Moi :</font> Putain mais m'accuse pas ! C'est pas moi !<br/><font color='black'>Lui :</font> Ou sinon c'est tout simplement personne.<br/><font color='#ffa443'>Personne :</font> Mais c'est pas moi ! C'est toi !<br/><font color='yellow'>Toi :</font> Mais je sais pas où il habite, moi !<br/><font color='chartreuse'>Moi :</font> C'est pas le sujet !<br/><font color='violet'>Vous :</font> Bon, on va t'avouer, c'est nous !<br/><font color='deepskyblue'>Nous :</font> Traîtres..<hr/><i>Cham à l'eau</i> a quitté le chat",
                "Le problème n'est pas le problème. Le problème, c'est ton attitude face au problème. Tu comprends ? <hr/> - <b>Capitaine</b> Jack Sparrow, <i>Pirates des Caraïbes</i>",
                "<center><i>Journal de Rorschach, 12 octobre 1985.</i></center><hr/>Chien crevé dans ruelle ce matin, traces de pneus sur ventre éclaté. Cette ville a peur de moi. J'ai vu son vrai visage.<br/>Les rues sont des caniveaux géants et les caniveaux sont pleins de sang. Quand le sang figé bouchera les égouts, toute la vermine se noiera.<br/>La fange accumulée de leur sexe et de leurs crimes débordera et toutes les putes et les politiciens hurleront : &quot;Sauvez-nous !&quot;<br/>Et dans un murmure je répondrai... &quot;Non.&quot;<hr/> - Rorschach, <i>Watchmen</i>",
                "La vie est une maladie sexuellement transmissible dont le taux de mortalité est de cent pour cent. <hr/> - R. D. Laing", //55
                "Les humains ont créé la conversation pour cacher la réalité. On s'en sert pour enjôler la sélection naturelle. Tu sais qui a de vraies conversations ? Les fourmis. Pour parler, elles se vomissent dans la bouche. Elles vont droit à l'essentiel.<br/><i>Bwarf</i> &quot;Le pique-nique, c'est où ?&quot;<br/><i>Bwarf</i> &quot;Par là.&quot;<br/>Les humains sont plus évolués. On ment.<hr/> - Jeff Winger, <i>Community</i>",
                "Moi, lorsque je n’ai rien à dire, je veux qu’on le sache ! <hr/> - Raymond Devos",
                "Un conducteur dangereux, c’est celui qui vous dépasse malgré tous vos efforts pour l’en empêcher... <hr/> - Woody Allen",
                "Je suis aveugle, mais on trouve toujours plus malheureux que soi... J'aurais pu être noir. <hr/> - Ray Charles",
                "J'ai horreur des gens qui parlent pendant que je les interromps. <hr/> - Guy Bedos", //60 
                "Nous savons où vous êtes. Nous savons où vous avez été. A peu de chose près, nous savons à quoi vous pensez. <hr/> - Eric Schmidt",
                "L'homme est un animal assez effrayant pour faire fuir ou se terrer les autres bêtes à son approche. <hr/> - Maurice Toesca",
                "Ce qui est bien [avec Yves Klein], c'est que ce n'est pas un truc que votre petit frère peut faire dans votre garage. <hr/> - Jean-Philippe G. <center><br/><img src='https://i.imgur.com/WKz7kyX.jpg' alt='TableauKlein' width='100%' style='margin:5px 0px 5px -2px;border:2px solid #5a4d4d'><br/><i>La grande Anthropométrie bleue (ANT 105)</i><br/>Yves Klein (circa 1960)</center>",
                "Écoutez, comme ça a priori, ça m'évoque rien, mais honnêtement c'est possible. Ce serait assez le genre de la maison, en tout cas !<br/>De l'autre côté, voyez un peu l'ironie, si j'avais pas fomenté une attaque par l'ouest, vous seriez allés vous écraser contre les Romains à l'est !<br/>Oui, alors, pourquoi ? Pourquoi trahir sans arrêt les gens avec qui je collabore ?<br/>Je dirais que c'est probablement une réponse compulsive à une crainte de m'attacher. Briser une relation plutôt que la cultiver pour ne pas se retrouver démuni face au bonheur.<br/>Oui, pour répondre à votre question : j'ai peur d'aimer ! <hr/> - Roi Loth, <i>Kaamelott</i>",
                "<b>#NoHomo</b> <hr/> - Relation de Mathieu Médard & Killian Housseau", //65
                "Le voyage en chemin de fer à grande vitesse n'est pas possible, car les passagers, incapables de respirer, mourraient par asphyxie. <hr/> - Dionysius Lardner (1830)",
                "[Lorsque] vous cherchez un titre [en peer-to-peer], Dieu merci, il est pas très loin de chez vous. Parce que si vous allez le télécharger au Japon, avant que vous atteigniez le Japon et qu'il revienne, vous allez mettre trois jours avant de le télécharger.<br/>Et clairement on l'a vu nous, quand à un moment donné, on a fait fermer un certain nombre de serveurs sur Emule, on a vu que pendant une semaine, c'était beaucoup plus long pour télécharger et beaucoup plus compliqué. Donc voilà. <hr/> - Pascal Nègre",
                "Je ne veux pas &quot;aller bien&quot;. Je veux avoir 25 ans et découvrir le monde. Je veux m'endormir sur la plage et être capable de marcher le lendemain, ou veiller toute la nuit sans faire attention. Je veux pouvoir porter un t-shirt sans avoir l'air de quelqu'un qui a oublié de s'habiller.<br/>Je veux être terrifié du sida, je veux avoir une opinion sur ces... films Marvel ennuyeux à mourir. Et je veux que ces opinions intéressent ceux qui en sont responsables. <hr/> - Jeff Winger, <i>Community</i>",
                "Je veux pouvoir vivre au même endroit plus d'un an, commander du vin sans me sentir nerveuse, avoir un CV bourré d'erreurs plutôt que de mensonges. Je veux des histoires et de la sagesse, un sens de la perspective.<br/>Je veux avoir tellement accompli que je n'ai pas peur de ce qui m'attend, surtout pas de ces... films Marvel insipides. <hr/> - Annie Edison, <i>Community</i>",
                "Rien ne nous hante plus que les choses que l'on tait. <hr/> - Mitch Albom", //70
                "C'EST L'HEURE, DU...<br><font size='1'>DU-</font><br><font size='2'>DU-</font><br><font size='3'>DU-</font><br><font size='4'>DU-</font><br><font size='5'>DU...</font><br><b><font size='6'>DULCOLAX !</font></b> <hr> - Paul Ambrois",
                "Personne n'a jamais changé le monde en faisant ce que le monde attendait d'eux. <hr/> - Eddy Zhong",
                "Je suis celui qui émerge des ténèbres. Tout en trench-coat, cigarette et arrogance, prêt à s'occuper de la folie ambiante.<br/>Oh, j'ai déjà tout sous contrôle. Je peux te sauver. Même si cela te draine de ton sang jusqu'à la dernière goutte, je repousserai tes démons. Je les frapperai dans les couilles et leur cracherai dessus une fois à terre, et puis je retournerai dans les ténèbres. Ne faisant qu'un mouvement de tête, un clin d'œil et une vanne.<br/>Je fais mon chemin seul... qui voudrait marcher à mes côtés ? <hr/> - John Constantine, <i>Hellblazer</i>",
                "Certaines personnes détestent Apple. Du genre à avoir les yeux injectés de sang lorsque l'on mentionne les produits Apple.<br/>Je pige pas pourquoi, mais ils te crieront dessus sur internet s'ils apprennent que tu en as acheté un.<br/>Ma recommandation est de les ignorer. <hr/> - Brad Colbow",
                "Je suis la vie brisée de Jack. <hr/> - Narrateur, <i>Fight Club</i>", //75
                "La publicité nous fait courir après des voitures et des fringues, nous faire choisir un boulot qu'on déteste rien que pour pouvoir acheter des conneries dont on a pas besoin. <hr/> - Tyler Durden, <i>Fight Club</i>",
                "Dans le Monde Onirique, la puissance et l'aventure reviennent aux Rêveurs Lucides, tandis que les Terreurs Nocturnes hantent les âmes troublées et vulnérables.<br/><br/>Certains élus sont protégés par de mystérieux gardiens.<br/><br/>Les protecteurs de nos vies inconscientes sont connus sous le nom de...<br/><br/><div align='right'>Dream Walkers.</div>",
                "N'importe quel code que vous avez créé et n'avez pas consultez depuis au moins six mois ou plus pourrait aussi bien avoir été écrit par quelqu'un d'autre. <hr/> - Loi d'Eagleson",
                "[Lorsque l'on a] demandé avec insistance [à Shigeru Miyamoto d'améliorer la vitesse de <i>Super Mario Bros.</i>] avant sa sortie, le père du plombier s'était amusé à accélérer les mouvements de jambes de Mario, donnant l'impression d'une course plus rapide, plutôt que de changer d'un iota sa véritable vitesse de déplacement. <hr/> - William Andureau, <i>La Guerre des Mascottes</i>",
                "Il reste <i>toujours</i> un bug. <hr/> - Loi de l'entomologie cybernétique de Lubarsky", //80
                "Sais-tu quel genre de personne devient psychologue, Britta ? Ceux qui souhaitent, au plus profond d'eux-mêmes, que tous ceux qui sont meilleurs qu'eux soient malades. <hr/> - &quot;Evil&quot; Abed Nadir, <i>Community</i>",
                "Débugger un programme est deux fois plus dure qu'en écrire le code. De ce fait, si vous écrivez un code aussi intelligemment que possible, vous ne serez, par définition, pas assez intelligent pour le débugger. <hr/> - Brian Kernighan",
                "La vie est belle parce-que nous mourrons. <hr/> - Jean d'Ormesson",
                "[Dieu est] comme moi avec la grosse fourmilière du jardin, j'ai passé des jours entiers à regarder les fourmis, et essayer de faire la différence entre les bonnes et les mauvaises, mais tout ce que je voyais c'était des insectes. Alors j'ai commencé à les punir. [...]<br/>Je les ai punies avec le tuyau d’arrosage, avec de l’essence, avec la tondeuse à gazon, et pour être tout à fait honnête j’ai perdu les pédales avec la grosse pelle.<br/>Et si ça se trouve les fourmis priaient pour moi tout le temps, et j’entendais rien. Quoiqu’elles fassent elles étaient impuissantes. Je crois que c’est pareil pour nous, on ne peut rien changer à ce qui nous attend, alors pourquoi se prendre la tête. [...]<br/>Je crois que tout ce qu'on peut faire, c'est vivre en étant le plus gentil possible. Et en essayant de ne pas attirer l'attention de Dieu et de sa grosse pelle. Au revoir. <hr/> - Dewey, <i>Malcolm in the Middle</i>",
                "<u>Trivia</u> :<br/>En 10 mois, la Nintendo Switch a vendu plus d'unités sur le territoire japonais que la Wii U en 6 ans d'existence.", //85
                "Reviens-moi. Même si ce n'est qu'en ombre, même si ce n'est qu'en rêve. <hr/> - Héraclès, <i>Grief Lessons: Four Plays by Euripides</i> par Anne Carson",
                "Ta gueule, c'est magique ! <hr/> - Théo Fouyet",
                "etc..."
            ];
            
            var nombreAleatoire = Math.floor((citations.length-1)*Math.random());
            
            $(".fortune").html(citations[nombreAleatoire]); // Place la citation dans la zone de texte
        }
        
        // Si tirage = image (33% de chance d'avoir une image)
        else
        {
            $(".fortune").hide();
            
            var images = [
                "https://imgs.xkcd.com/comics/abstraction.png", //0
                "https://imgs.xkcd.com/comics/app.png",
                "https://imgs.xkcd.com/comics/arcane_bullshit.png",
                "https://imgs.xkcd.com/comics/aspect_ratio.png",
                "https://imgs.xkcd.com/comics/wisdom_of_the_ancients.png",
                "https://imgs.xkcd.com/comics/automation.png", //5
                "https://imgs.xkcd.com/comics/charity.png",
                "https://i.imgur.com/KrUILNT.png",
                "https://imgs.xkcd.com/comics/climbing.png",
                "https://imgs.xkcd.com/comics/devotion_to_duty.png",
                "https://imgs.xkcd.com/comics/estimation.png", //10
                "https://imgs.xkcd.com/comics/compiling.png",
                "https://imgs.xkcd.com/comics/free_speech.png",
                "http://78.media.tumblr.com/9039f34915c3428d04adf66a8d1a4663/tumblr_nvv725wdJB1qiuiebo1_540.jpg",
                "https://imgs.xkcd.com/comics/future_self.png",
                "https://imgs.xkcd.com/comics/game_theory.png", //15
                "https://imgs.xkcd.com/comics/isolation.png",
                "https://imgs.xkcd.com/comics/let_go.png",
                "https://imgs.xkcd.com/comics/hell.png",
                "https://imgs.xkcd.com/comics/like_im_five.png",
                "https://imgs.xkcd.com/comics/logic_boat.png", //20
                "https://imgs.xkcd.com/comics/old_files.png",
                "https://imgs.xkcd.com/comics/porn.png",
                "http://78.media.tumblr.com/e4d9d704b8807a24d0bc562590f188d5/tumblr_mhyp3j1BIS1qiuiebo1_540.jpg",
                "https://imgs.xkcd.com/comics/profile_info.png",
                "https://imgs.xkcd.com/comics/regrets.png", //25
                "https://media.giphy.com/media/SWjCswum5dc0E/giphy.gif",
                "https://imgs.xkcd.com/comics/server_attention_span.png",
                "https://imgs.xkcd.com/comics/sheeple.png",
                "https://imgs.xkcd.com/comics/social_media.png",
                "http://78.media.tumblr.com/ac580aa66741fb879dfb564b2a730a05/tumblr_o5c9fpphqr1qiuiebo1_540.jpg", //30
                "https://imgs.xkcd.com/comics/spirit.png",
                "https://imgs.xkcd.com/comics/standards.png",
                "https://i.imgur.com/Eb9RU8l.png", // Gold Nugget
                "https://imgs.xkcd.com/comics/random_number.png",
                "http://assets.amuniversal.com/e1996ea0c0af0132d64a005056a9545d", //35
                "https://imgs.xkcd.com/comics/time_travel.png",
                "https://imgs.xkcd.com/comics/workaround.png",
                "https://imgs.xkcd.com/comics/blame.png",
                "https://imgs.xkcd.com/comics/settling.png",
                "https://imgs.xkcd.com/comics/ui_change.png", //40
                "https://imgs.xkcd.com/comics/sad.png",
                "http://78.media.tumblr.com/6904d5b731f95c0f76ac9398f81510dc/tumblr_o6s2xveb8e1qiuiebo1_540.jpg",
                "https://imgs.xkcd.com/comics/borrow_your_laptop.png",
                "https://imgs.xkcd.com/comics/listening.png",
                "https://imgs.xkcd.com/comics/chat_systems.png", //45
                "https://imgs.xkcd.com/comics/existence_proof.png",
                "https://imgs.xkcd.com/comics/computers_vs_humans.png",
                "https://media.giphy.com/media/3ov9jUgqgxniaDjLI4/giphy.gif",
                "https://imgs.xkcd.com/comics/second.png",
                "https://imgs.xkcd.com/comics/digital_resource_lifespan.png", //50
                "http://78.media.tumblr.com/236239107a2dcd6f6ecb198efe17e3de/tumblr_o08pivehOt1qiuiebo1_540.jpg",
                "https://imgs.xkcd.com/comics/phone.png",
                "https://imgs.xkcd.com/comics/defensive_profile.png",
                "http://78.media.tumblr.com/5793d191d0385559310998b6bf5f6adc/tumblr_o4m536drI91qiuiebo1_1280.jpg",
                "https://imgs.xkcd.com/comics/president.png", //55
                "https://imgs.xkcd.com/comics/manual_override.png",
                "https://78.media.tumblr.com/5099a38cab8de74b89dd266ffd610b3e/tumblr_nisvagNi2C1qiuiebo1_540.jpg",
                "http://78.media.tumblr.com/55b83225e94e408ea13cf5a8464ace88/tumblr_o4eob6adra1qiuiebo1_540.jpg",
                "https://imgs.xkcd.com/comics/nightmare_email_feature.png",
                "https://i.imgur.com/NFU1DV3.jpg", //60
                "http://78.media.tumblr.com/0df80a9742c165cc3c6323286bccb302/tumblr_p1lrw1ovFt1qiuiebo1_540.jpg",
                "etc..."
                ];
            
            var imgAleatoire = Math.floor((images.length-1)*Math.random());

            var image = document.createElement("img");
            image.src = images[imgAleatoire];
            $("#corps").append(image);
            $(image).css("margin-top","40px");

            if (images[imgAleatoire] == "https://i.imgur.com/Eb9RU8l.png")
            {
                image.onclick = function() { window.location = "https://philippes.ddns.net/"; };
            }
        }
    }
    
  /////////// FIN CITATIONS & IMAGES /////////////



 /////////// MENU /////////////

    // Création de la barre de menu
    $('<div class="topnavBis" id="myTopnav"> <a href="javascript:void(0);" class="icon" onclick="myFunction()">&#9776;</a></div>').insertBefore('#head');

    // Récupération des liens de l'ancienne barre de menu
    $('.topnav').find('a').each(function() {  $(".topnavBis").append(this);  });

    // Descendre le reste du site sous le menu
    var hauteurtopnavBis = $('.topnavBis').height();
    $("#head").css("margin-top", (hauteurtopnavBis*2.5) + "px");

    // Ainsi que les images ajoutées (site externe)
    $('body').find('img').each(function() {
        if( ($(this).css('position')) == 'fixed')
        {
            $(this).css("margin-top", (hauteurtopnavBis*2) + "px");
        }
    });

    $(".topnavBis").append('<a class="trigger" style="outline:none;" href="javascript:void(0);">|</a>');

    //Ajout menu dropdown
    $(".topnavBis").append('<div class="dropdown"> <span class="dropbtn">Outils <b>&#x25BE;</b></span> <div class="dropdown-content"></div></div>');

    // Ajout Calculatrice IP au menu dropdown
    $(".dropdown-content").append('<a href="http://ceipam.eu/fr/ipcalculator.php">Calculatrice IP</a>');
    // Ajout Cisco au menu dropdown
    $(".dropdown-content").append('<a href="https://www.netacad.com/fr/">Cisco</a>');
    // Ajout Developpez.com au menu dropdown
    $(".dropdown-content").append('<a href="https://programmation.developpez.com/">Developpez.com</a>');
    // Ajout France-IOI au menu dropdown
    $(".dropdown-content").append('<a href="http://www.france-ioi.org/algo/chapters.php">France-IOI</a>');
    // Ajout Open Classroom au menu dropdown
    $(".dropdown-content").append('<a href="https://openclassrooms.com/courses">Open Classroom</a>');
    // Ajout Programiz au menu dropdown
    $(".dropdown-content").append('<a href="https://www.programiz.com/">Programiz</a>');
    // Ajout Référence C++ au menu dropdown
    $(".dropdown-content").append('<a href="http://fr.cppreference.com/w/Accueil">Référence C++</a>');
    // Ajout W3School au menu dropdown
    $(".dropdown-content").append('<a href="https://www.w3schools.com/">W3School</a>');

    // Ajout de 50 Nuances de STI2D
    $(".topnavBis").append('<a href="https://50nuancesdesti2d.fr">50 Nuances</a>');

    //Style de la barre
    $(".topnavBis").css( {"background-color":"rgba(0, 0, 0, 0.760784)","overflow":"hidden","position":"fixed", "top":"0px","left":"0px","width":"100%","font-family":"sans-serif, verdana, arial, times"} );

    // Style des liens du menu
    $(".topnavBis a").css( {"float":"left","display":"block","color":"rgb(218, 213, 213)","text-align":"center","padding":"14px 16px","text-decoration":"none","font-size":"17px","outline":"none"} );

    // Style du dropdown
    $(".dropdown").css( {"float":"left","overflow":"hidden"} );
    $(".dropdown .dropbtn").css( {"border":"none","outline":"none","color":"rgb(218, 213, 213)","background-color":"transparent","font-size":"inherit","padding":"14px 16px","font-family":"inherit","display":"inherit"} );
    $(".dropdown-content").css( {"display":"none","position":"fixed","min-width":"160px","background-color":"rgba(0, 0, 0, 0.760784)","box-shadow":"0px 8px 16px 0px rgba(0,0,0,0.2)","z-index":"1"} );

    // Style des liens du dropdown
    $(".dropdown-content a").css( {"float":"none","color":"rgb(218, 213, 213)","padding":"12px 16px","text-decoration":"none","display":"block","text-align":"justify"} );

    // Affiche le menu dropdown au survol du bouton
    $(".dropdown").hover(function() {
        $(".dropdown-content").css("display","block");
        }, function() {
        $(".dropdown-content").css("display","none");
    });

    // Change la couleur des liens au survol
    $(".topnavBis a, .dropdown .dropbtn, .dropdown-content a").hover(function() {
        $(this).css( {"background-color":"#ddd","color":"black"} );
        }, function() {
        $(this).css( {"background-color":"transparent","color":"rgb(218, 213, 213)"} );
    });

    $(".topnavBis .icon").css("display","none"); // "icon" est le menu hamburger pour mobile. WORK IN PROGRESS


 /////////// FIN MENU /////////////



 /////// MODIF STYLE DU SITE //////////

  // Header
  $("#head").css("background-image","url(https://preview.ibb.co/h8qYab/image_Fond2modi.png)"); // Montage par Djellaly

  // Tux vs Cat
  var date = new Date();
  var chatDjellaly = document.createElement("img");

  if(date.getDate() == 13 && date.getDay() == 5) { // Vendredi 13
      chatDjellaly.src = "https://media.giphy.com/media/wzNK2naRd6NKo/giphy.gif";
      $(chatDjellaly).css( {"position":"fixed","height":"160px","bottom":"0px","right":"0px"} );
      chatDjellaly.onclick = function() { window.location = "https://www.youtube.com/watch?v=6VMRAGxjOoA"; };
      $("body").css( {"background-image":"url(https://i.imgur.com/s2LbjLR.jpg)","background-size":"cover","background-attachment":"fixed","background-position":"top"} );
      $("#head").css( {"background-image":"url(https://i.imgur.com/26zmUok.png)", "background-size":"445px", "margin-bottom":"-50px" } );}

  else if(date.getDate() == 17 && (date.getMonth() + 1) == 3) { // Saint Patrick
      chatDjellaly.src = "https://i.imgur.com/wdfn34T.png";
      $(chatDjellaly).css( {"position":"fixed","height":"125px","bottom":"0px","right":"3px"} );
      $("body").css( {"background-image":"url(https://i.imgur.com/uEoylE3.jpg)","background-size":"cover","background-attachment":"fixed","background-position":"top"} );
      chatDjellaly.onclick = function() { window.location = "https://www.youtube.com/watch?v=QrU1hZxSEXQ"; }; }

  else if(date.getDate() == 1 && (date.getMonth() + 1) == 4) { // 1er avril
      chatDjellaly.src = "https://i.imgur.com/HfYVFAK.png";
      $(chatDjellaly).css( {"position":"fixed","height":"110px","bottom":"4px","right":"3px"} );
      $("body").css( {"background-image":"url(https://i.imgur.com/7pAmzLB.jpg)","background-size":"cover","background-attachment":"fixed","background-position":"middle"} );
      chatDjellaly.onclick = function() { window.location = "https://www.youtube.com/watch?v=XrFegNHpHfc&list=PLPt8EM4KxGEVdozTFQ_taOdS6OFlNU7ki"; }; }

  else if((date.getDate() == 4 || date.getDate() == 25) && (date.getMonth() + 1) == 5) { // Star Wars
      chatDjellaly.src = "https://media.giphy.com/media/3ohs7OTPZcEPv9BmP6/giphy.gif";
      $(chatDjellaly).css( {"position":"fixed","height":"220px","bottom":"-3px","right":"0px"} );
      chatDjellaly.onclick = function() { window.location = "https://www.youtube.com/watch?v=mIm-SHopU8A"; };
      $("body").css( {"background-image":"url(https://i.imgur.com/zOAbPaF.jpg)","background-size":"cover","background-attachment":"fixed"} );
      //$("#head").css( {"background-image":"url(https://i.imgur.com/u05BakC.png)", "background-size":"390px", "margin-bottom":"-40px" } ); }
      $("#head").css( {"background-image":"url(https://i.imgur.com/on8J3KB.png)", "background-size":"390px", "margin-bottom":"-40px" } ); }

  else if(date.getDate() == 3 && (date.getMonth() + 1) == 7) { // Back to the Future
      chatDjellaly.src = "https://zippy.gfycat.com/AdeptNeatBird.gif";
      $(chatDjellaly).css( {"position":"fixed","height":"165px","bottom":"0px","left":"30px"} );
      chatDjellaly.onclick = function() { window.location = "https://www.youtube.com/watch?v=S1i5coU-0_Q"; };
      $("body").css( {"background-image":"url(https://i.imgur.com/L6TJjO5.jpg)","background-size":"cover","background-attachment":"fixed"} );
      $("#head").css( {"background-image":"url(https://i.imgur.com/hfsV3Bl.png)", "background-size":"400px", "margin-top":"40px", "margin-bottom":"-50px" } ); }

  else if(date.getDate() > 19 && (date.getMonth() + 1) == 10) { // Halloween
      chatDjellaly.src = "https://i.imgur.com/JPiUZ5c.png";
      $(chatDjellaly).css( {"position":"fixed","height":"110px","bottom":"-3px","right":"0px"} );
      chatDjellaly.onclick = function() { window.location = "https://www.youtube.com/watch?v=av78r69-w64"; };
      $("body").css( {"background-image":"url(https://i.imgur.com/e9bYCCy.jpg)","background-size":"cover","background-attachment":"fixed"} );
      $("#head").css( {"background-image":"url(https://i.imgur.com/jTh8Evt.png)", "background-size":"530px", "margin-bottom":"-30px" } ); }

  else if(date.getDate() == 23 && (date.getMonth() + 1) == 11) { // Doctor Who
      chatDjellaly.src = "https://media.giphy.com/media/3oFzmjbbrGmg4T9JDO/giphy.gif";
      $(chatDjellaly).css( {"position":"fixed","height":"230px","bottom":"-1px","left":"0px"} );
      chatDjellaly.onclick = function() { window.location = "https://dalekhack.microbit.org/"; };
      $("body").css( {"background-image":"url(https://i.imgur.com/apu8IwW.jpg)","background-size":"cover","background-attachment":"fixed","background-position":"right bottom"} );
      $("#head").css( {"background-image":"url(https://i.imgur.com/toM5RkL.png)", "background-size":"213px", "margin-bottom":"-13px", "margin-top":"42px" } ); }

  else if(date.getDate() > 9 && (date.getMonth() + 1) == 12) { // Noel
      chatDjellaly.src = "https://media.giphy.com/media/3o6fJ0Vd0iGYIXCVl6/giphy.gif";
      $("html").snowfall({minSize : 30, image :"https://cdn.rawgit.com/RandomUsername404/968b06caeede1bbd963c4ab74dbc331f/raw/f55dcb0689dd7814c379c7a37c5406b660e4834f/Flocon.svg"});
      $(chatDjellaly).css( {"position":"fixed","height":"250px","bottom":"11px","right":"0px"} );
      chatDjellaly.onclick = function() { window.location = "https://www.youtube.com/watch?v=E8gmARGvPlI"; };
      $("body").css( {"background-image":"url(https://i.imgur.com/Co3qp4c.jpg)","overflow":"hidden","overflow-y":"scroll","background-size":"cover","background-attachment":"fixed","background-position":"top"} );
      $("#head").css( {"background-image":"url(https://i.imgur.com/TkNbOYH.png)", "background-size":"425px", "margin-bottom":"-20px"} );

      if(date.getDate() < 25) {
          var calendrierImg = document.createElement("img");
          calendrierImg.src = "https://cdn.rawgit.com/RandomUsername404/968b06caeede1bbd963c4ab74dbc331f/raw/f55dcb0689dd7814c379c7a37c5406b660e4834f/Calendrier.svg";
          $(calendrierImg).css( {"position":"fixed","height":"170px","bottom":"5px","left":"5px"} );
          $("html").append(calendrierImg);

          var calendrierDiv = document.createElement("div");
          $(calendrierDiv).css( {"position":"fixed","height":"85px","width":"170px","bottom":"5px","left":"5px","text-align":"center","font-family":"monospace",
                                 "font-size":"40px","font-weight":"bold","color":"rgba(231, 76, 60, 1)"} );
          calendrierDiv.appendChild(document.createTextNode("J-" + (25-date.getDate())));
          $("html").append(calendrierDiv);

          var calendrierGui = document.createElement("img");
          calendrierGui.src = "https://cdn.rawgit.com/RandomUsername404/968b06caeede1bbd963c4ab74dbc331f/raw/f55dcb0689dd7814c379c7a37c5406b660e4834f/Gui.svg";
          $(calendrierGui).css( {"position":"fixed","height":"100px","bottom":"78px","left":"40px"} );
          $("html").append(calendrierGui);
      } }

  else {
      chatDjellaly.src = "https://media.giphy.com/media/3ohhwnPJJ233cjcj0A/giphy.gif";
      $(chatDjellaly).css( {"position":"fixed","height":"250px","bottom":"11px","right":"0px"} );
      $("body").css( {"background-image":"url(https://i.imgur.com/9XQEMhJ.jpg)","background-attachment":"fixed"} );
      chatDjellaly.onclick = function() { window.location = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; };}

  $("html").append(chatDjellaly);

  // Rajout du lien vers le site de l'année dernière
    var dateActuelle = date.getFullYear();
    if((date.getMonth() + 1) >= 9 && (date.getMonth() + 1) <= 12) {
        dateActuelle++;
    }

    if(window.location.pathname === "/siteweb/public/index/navigation/idRubrique/2") {
        var nouveauLien = document.createElement("div");
        $(nouveauLien).addClass("lien");
        $(nouveauLien).html('<a class="a" target="OpenBlank" href="/siteweb' + (dateActuelle-2) + (dateActuelle-1) + '/"><img src="/siteweb/public/images/con-lilac.gif" alt="fichiers"> Site de l&apos;année dernière</a>');
        $(nouveauLien).insertAfter(".lien:last");
    }

  // Modifs sur l'affichage de la liste des fichiers/dossiers
  $(".lien").css({"width":"97%","text-indent":"7px","background-color":"rgba(82, 82, 75, 0.53)"});

  if($("#corps > .lien:last-child").is("#corps > .lien:nth-child(2)"))
     {
         $("#corps > .lien:last-child").css("border-radius","7px 7px 7px 7px");
         $(".a").css("border-radius","7px 7px 7px 7px");
     }
  else
  {
         $("#corps > .lien:nth-child(2)").css("border-radius","7px 7px 0px 0px");
         $("#corps > div:nth-child(2) > a").css("border-radius","7px 7px 0px 0px");
         $("#corps > .lien:last-child").css("border-radius","0px 0px 7px 7px");
         $("#corps > div:last-child > a").css("border-radius","0px 0px 7px 7px");
  }

  // CSS général
  $(".fortune").css( {"background-color":"rgba(82, 82, 75, 0.53)","color":"#ffffff","background-image":"none","text-align":"justify","border-radius":"5px","margin-top":"50px"} );
  $("#corps").css( {"background-image":"none","background-color":"transparent","padding-top":"0px","padding-bottom":"0px"} );  
  $(".a").css({"color":"white","outline":"none"});
  $("#head a").css("outline","none");
  $("ul li a").css("color","rgb(218, 213, 213)");
  $("#foot").hide();
  $(".recherche").hide();
  $("#menu").hide();

  // Séparateur header/citations
  $("body").append('<div><span class="sexy_line"></span></div>');
  $('.sexy_line').insertAfter('#head');
  $('.sexy_line').css({ "display":"block","border":"none","width":"50%","height":"1px",
                       "background":"-webkit-gradient(radial, 50% 50%, 0, 50% 50%, 350, from(black), to(transparent))","margin-left":"25%","margin-top":"35px"});

  // Changer la couleur de surlignage des liens
  $(".a").hover(
    function() {
        //mouse over
        $(this).css('background-color', 'rgba(0, 0, 0, 0.76)');
    }, function() {
        //mouse out
        $(this).css('background-color', 'transparent');
    });
    
  /////// FIN MODIF STYLE DU SITE //////////
  
    
    
  /////////// SEARCHBAR /////////////

  // Positionnement du logo
  var searchIco = document.createElement("img");
  searchIco.src = "https://i.imgur.com/vgnVOHT.png";
  $(searchIco).css( {"height":"30px","position":"fixed","right":"0px","z-index":"1","margin":"9px 19px 0px 0px"} );
  $(".topnavBis").append(searchIco); // Positionne le logo
  
  // Création zone de recherche
  var zoneSearch = $("<form method='get' id='searchform' action=''style='display: inline;'>   <input type='text' id='ceQuonRecherche' class='mousetrap' placeholder='Rechercher&hellip;'/>   <input type='submit'  style='visibility: hidden;'/></form>").appendTo(".topnavBis");
  $("#ceQuonRecherche").css( {"position":"fixed","right":"52px","height":"43px","width":"175px","text-indent":"7px","background":"transparent","color":"white","font-size":"medium","border":"none","outline":"none"} );
  $(zoneSearch).toggle();

    
  // Fonction de recherche
  $(zoneSearch).on( 'submit', function() { window.location = location.origin+"/siteweb/public/index/recherche?textRecherche="+encodeURIComponent($(this).find('#ceQuonRecherche').val() ); return false; });
    
  // Toggle l'affichage de la zone
  searchIco.onclick = function() { 
      $(zoneSearch).toggle();
      $("#ceQuonRecherche").focus();
      
      if(searchIco.src == "https://i.imgur.com/vgnVOHT.png")
          {
              $(searchIco).attr("src","https://i.imgur.com/BlrcxcW.png");
          }
      else
          {
              $(searchIco).attr("src","https://i.imgur.com/vgnVOHT.png");
              $("#searchform")[0].reset();            
          }
  };

  /////////// FIN SEARCHBAR /////////////
    
    
    
  ///////////REMPLACEMENT ICONES /////////////
  
  // Dossier
  $('img[src="/siteweb/public/images/bluered.gif"]').attr('src', 'https://i.imgur.com/fLW4g9F.png');
  
  // Fichier
  $('img[src="/siteweb/public/images/con-lilac.gif"]').attr('src', 'https://i.imgur.com/iZeupN9.png');
  
  // Favicon
  $('link[rel="shortcut icon"]').attr( {'type':'image/x-icon','href':'http://www.iconj.com/ico/1/v/1vrnax3sov.ico'} );
    
 ///////////FIN REMPLACEMENT ICONES /////////////
 
 
 
 /////////// REMPLACEMENT BOUTONS /////////////   
    
  $("ul.breadcrumb li").css("background","url(https://i.imgur.com/bWYVmPV.png) 0 0 no-repeat");
  $("ul.breadcrumb li a, ul.breadcrumb li span").css("background","url(https://i.imgur.com/UqWeE8k.jpg) 0 0 repeat-x");
  $("ul.breadcrumb li span.end").css("background","url(https://i.imgur.com/xDjuwml.png) 0 0 no-repeat");
  
  $(".breadcrumb").css("margin-left","-30px"); // Code Val'
    
 /////////// FIN REMPLACEMENT BOUTONS /////////////
 
     
    
 /////////// DEBUT CHAT - SYNTAXE MARKDOWN /////////////

    var iframe = document.createElement("iframe");
    $("html").append(iframe);
    $(iframe).attr({"src":"http://embed.tlk.io/snir?theme=theme--night#","allowtransparency":"false"});
    $(iframe).css( {"position":"fixed","left":"0px","bottom":"0px","height": "95%","width":"400px","top":"49px","border":"none"} );
     $(iframe).toggle();

    //https://learn.jquery.com/events/event-delegation/;
    $(".topnavBis").on("click", "a.trigger", function(event) {
        event.preventDefault();
        $(iframe).toggle();
    });

    // Afficher/cacher chat via ALT + x   |   http://jsfiddle.net/gFcuU/
	$(document).keyup(function(e) {
	    if(e.which == 18) {
	        isAlt = false; }
	});
	$(document).keydown(function(e) {
		if(e.which == 18) {
            isAlt = true; }
		if(e.which == 88 && isAlt) { 
			$(iframe).toggle(); } 
	});
    
 /////////// FIN CHAT /////////////

});
