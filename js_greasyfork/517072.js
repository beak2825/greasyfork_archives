// ==UserScript==
// @name         BloodWars - Explication des missions Moria S9
// @author       Pok Marvel
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Ajoute des réponses aux missions spécifiques sur les pages BloodWars (Moria S9, r8 et r3)
// @copyright    06.12.2024, Pok Marvel
// @license      GPL version 3 ou suivantes; http://www.gnu.org/copyleft/gpl.html
// @homepageURL  https://github.com/akhlan/Bloodwars/blob/main/BloodWarsAideMission.js
// @supportURL   https://github.com/Akhlan/BloodWarsAideMission/issues
// @match        https://r8.fr.bloodwars.net/?a=settings&do=acc
// @match        https://r8.fr.bloodwars.net/?a=tasks&do=zone
// @match        https://r3.fr.bloodwars.net/?a=settings&do=acc
// @match        https://r3.fr.bloodwars.net/?a=tasks&do=zone
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517072/BloodWars%20-%20Explication%20des%20missions%20Moria%20S9.user.js
// @updateURL https://update.greasyfork.org/scripts/517072/BloodWars%20-%20Explication%20des%20missions%20Moria%20S9.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Liste des URLs des pages de préférences
    const settingsPageUrls = [
        "https://r8.fr.bloodwars.net/?a=settings&do=acc",
        "https://r3.fr.bloodwars.net/?a=settings&do=acc"
    ];

    // URL actuelle
    const currentPage = window.location.href;

    // Fonction pour savoir si la page actuelle est une page de préférences
    function isSettingsPage(url) {
        return settingsPageUrls.includes(url);
    }

    // Liste des questions et réponses
    const questionReponses = [
        // Missions à accomplir en Zone 5
        {
            question: "Ta situation financière nous inquiète, Acolyte. Développe La Maison Close jusqu’au niveau 3.",
            reponse: "Pour la valider : Construire le niveau 3 ou supérieur de la Maison Close."
        },
        {
            question: "Le sang est la source de notre force. Bâtis 5 niveaux de La Boucherie sur ton quartier.",
            reponse: "Pour la valider : Construire le niveau 3 ou supérieur de la Boucherie."
        },
        {
            question: "Atteints le 10-ième niveau d’expérience.",
            reponse: "Pour la valider : Gagner un niveau qui fait atteindre le niveau 10."
        },
        {
            question: "Un dangereux mutant a pénétré jusqu’à la zone extérieure de La Cité, il doit être arrêté avant qu’il ne cause plus de dégâts. Il a été repéré récemment dans les environs de La Cité.",
            reponse: "Pour la valider : Vaincre un monstre en un contre un pendant une quête dans Les environs de la Cité."
        },
        {
            question: "Examines soigneusement les environs de La Cité.",
            reponse: "Pour la valider : Réussir pour chaque caractéristique une quête dans les environs de La Cité."
        },
        {
            question: "Chaque vampire qui se respecte doit posséder une collection d’artefacts. Accomplis toutes les quêtes lointaines.",
            reponse: "Pour la valider : Réussir pour chaque caractéristique une quête dans Une quête lointaine."
        },
        {
            question: "Il n’y a que les meilleurs de tous qui valent cette mission et qui possèdent des objets puissants. Accomplis un Pèlerinage vers l’Inconnu.",
            reponse: "Pour la valider : Réussir un pèlerinage, le premier étant l'agilité."
        },
        {
            question: "Une bande de loups-garous rode dans les parages. Il faut l’éliminer en menant une offensive sur ton quartier.",
            reponse: "Pour la valider : Lancer un siège sur son propre quartier. Siège simple avec l`aide de son clan."
        },
        {
            question: "L’argent et le trafique d’armes c’est les facteurs, qui te permettront de survivre. Pour stabiliser ta situation développe La Maison Close jusqu’au niveau 8 et l’Arrêt Taxi jusqu’au niveau 2.",
            reponse: "Pour la valider : Construire le niveau 8 de la Maison Close et le niveau 2 de l’Arrêt Taxi. Si l`un des deux est déjà construit, il suffit de construire l`autre. Si les deux sont déjà construits, il suffit de monter le niveau de l`un d`eux."
        },
        {
            question: "Tu es né pour avancer. Prouve-le en joignant la IV zone.",
            reponse: "Pour la valider : Passer en Zone 4. Pour ce faire, vous devez avoir atteint le niveau 20."
        },
        {
            question: "Augmente ton pouvoir dans le monde de l’obscurité en recrutant un vassal (tu peux le faire en utilisant le lien de reference qui se trouve dans la salle du trone).",
            reponse: "Pour la valider : Demander à quelqu`un de s`inscrire sur le jeu en utilisant le lien de référence ou de s'inscrire sur un autre serveur à partir de ce même lien."
        },
        //Missions à accomplir en Zone 4
        {
            question: "Il y a quelques solutions pour acquérir du respect dans le monde des morts-vivants. L’une d’elles c’est de posséder de puissants artefacts. Accomplis 4 Pèlerinages vers l’Inconnu.",
            reponse: "Pour la valider : Réussir votre 4ème pèlerinage en Z4. Dans le cas où vous auriez déjà complété ces 4 pèlerinages en Z5, il suffit de réussir un seul pèlerinage en Z4."
        },
        {
            question: "Tu as l’argent et tu sais comment le gagner. Maintenant tu dois gagner le respect auprès de la foule. Développe L’Agence d’Emploi jusqu’au 15-ième niveau.",
            reponse: "Pour la valider : Construire le niveau 15 ou supérieur de L`Agence d`Emploi."
        },
        {
            question: "Le chefs d’une meute de loups-garous a juré de venger la bande que tu as achevé sur ton quartier. Tu trouvera sa cachette quelque part loin de la Cité si tu veux terminer sa misérable existence.",
            reponse: "Pour la valider : Vaincre des monstres pendant une quête dans une quête lointaine."
        },
        {
            question: "Tu as remarqué une chaîne de contaminations d’une étrange maladie parmi la population de ton quartier. Tes espions suggèrent de chercher la cause dans les environs de La Cité.",
            reponse: "Pour la valider : Vaincre des monstres sur 3 combats consécutifs pendant une quête dans Les environs de la Cité: un groupe de goules puis un mutant et enfin le Chimiste Fou. Pensez à avoir assez de sang pour tenir jusqu'au bout!"
        },
        {
            question: "Atteints le 35-ième niveau d’expérience.",
            reponse: "Pour la valider : Gagner un niveau qui fait atteindre le niveau 35 ou supérieur."
        },
        {
            question: "Pendant que tu menais ta dernière quête, un vampire-usurpateur a pris de force ton siège général. Avec l’aide de ton clan regagne ta place.",
            reponse: "Pour la valider : Lancer un siège sur son propre quartier."
        },
        {
            question: "Fais bâtir toutes les constructions de la quatrième zone.",
            reponse: "Pour la valider : Construire la Garnison, le Trafiquant d`Armes, les Urgences et le Mont de Piété. Si certains d`entre d`eux sont déjà construits, il suffit de construire les autres. S`ils sont tous déjà construits, il suffit de monter le niveau de l`un d`eux."
        },
        {
            question: "Le Pouvoir!! Avance jusqu’à la troisième zone et prends part au Cercle Intérieur.",
            reponse: "Pour la valider : Passer en Zone 3."
        },
        {
            question: "La tradition veut que chaque nouveaux Inquisiteur fait un festin auquel il invite tous les habitants de la ville. Le vampire avec ta rang doit montrer sa richesse et être généreux. Accumule sur ton compte 5 000 000 et faire le sacrifice de 10% de cette somme.",
            reponse: "Pour la valider : Cliquer sur «Cliquez ici pour donnez les ressources» une fois les 5 000 000 LOL sur soi. N'oubliez pas de re-ferrailler juste après."
        },
        {
            question: "Tes éclaireurs t’ont informé des phénomènes étranges sur une Grande Steppe. Ils suggerent que tu devrais verifier la situation avant qu’il soit trop tard.",
            reponse: "Pour la valider : Lancer une expédition sur le site de la Grande Steppe, vous aurez une chance de tomber contre l`Esprit de l`Inquisitrice (% inconnu). il n'est pas nécessaire de lui porter le coup de grâce pour valider la mission"
        },
        {
            question: "Les personnages importants ont toujours beaucoup plus d’ennemis ce pourquoi tu as besoin d’avoir de la protection supplémentaire. Développe le Poste de Police et la Maison de Refuge jusqu’au niveau 18.",
            reponse: "Pour la valider : Construire le Poste de Police au niveau 18 et la Maison de Refuge au niveau 14 (le texte de la quête n`est pas à jour). Si l`un des deux est déjà construit à un niveau suffisant, il suffit de construire l`autre au niveau requis. Si les deux sont déjà construits aux niveaux requis, il suffit de monter le niveau de l`un d`eux."
        },
        {
            question: "Soirée, quand tu t’es réveillé, tu as trouvé une lettre étrange sur ton bureau. Barbouillé de sang il n’a contenu que les trois mots: \"Sauve\", \"Emprisonnée\", \"Loin\" - écrits sur le parchemin avec précipitation, en désordre. Qu’est-ce que cela peut signifier?",
            reponse: "Pour la valider : Réussir une quête lointaine avec comme test ??? qui est une moyenne entre votre intelligence et votre agilité."
        },
        {
	    question: "Fait preuve de courage. Seulement cela attirera sous ton drapeau les meilleurs chasseurs.",
            reponse: "Pour la valider : Réussir une quête lointaine."
        },
        {
	    question: "Les corps massacrés sans les têtes, sans les entrailles. Qu’est-ce qu’il se passe? Envoie les espions vers ton quartier et verifie qui est derriere ça.",
	    reponse: "Pour la valider : Espionner son propre quartier. Quel que soit le stuff utilisé et le nombre d`espions envoyés, il y aura toujours 1% de chance de réussir cet espionnage. Cette mission mettra votre patience à rude épreuve car l'espion a une fâcheuse tendance à se suicider..."
        },
        {
            question: "Les informations obtenues d’un jeune homme vous dirigent vers une auberge au dehors de la ville. Avec la groupe des autres vampires vérifiez ce qui se passe.",
            reponse: "Pour la valider : Lancer un siège sur son propre quartier. Attention, il y aura beaucoup d'adversaires: environ 25."
        },
		//Missions à accomplir en Zone 3
        {
            question: "Accomplis tous les Pèlerinages vers L’Inconnu.",
            reponse: "Pour la valider : Réussir le dernier des 9 pèlerinages à accomplir dans l`ordre. Dans le cas où vous les auriez déjà complétés, il suffit de réussir un pèlerinage."
        },
        {
            question: "Dans un coin inconnu du désert le Roi Des Loups rassemble des troupes pour régler ton compte. Trouve sa demeure et épargne-lui cette peine en l’achevant. La légende dit qu’il ne peut être tué seulement à l’aide de balles en argent...",
            reponse: "Pour la valider : Vaincre des monstres pendant une quête dans un pèlerinage vers l'inconnu."
        },
        {
            question: "Atteints le 50-ième niveau d’expérience.",
            reponse: "Pour la valider : Gagner un niveau qui fait atteindre le niveau 50 ou supérieur."
        },
        {
            question: "Fais bâtir toutes les constructions de la troisième zone.",
            reponse: "Pour la valider : Construire le Quotidien local \"Danse Macabre\" et l`Hôpital. Si l`un des deux est déjà construit, il suffit de construire l`autre. Si les deux sont déjà construits, il suffit de monter le niveau de l`un d`eux."
        },
        {
            question: "Depuis toujours, les règles de guerre disent que la meilleur forme de défense c’est l’attaque. Développe le Magasin D’Armes jusqu’au niveau 5.",
            reponse: "Pour la valider : Construire le niveau 5 ou supérieur du Trafiquant d`Armes."
        },
        {
            question: "Dernièrement, tes rivaux ont toujours une longueur d’avance sur toi. Développe le Quotidien Local jusqu’au niveau 4 pour mieux réagir aux activités des espions adverses.",
            reponse: "Pour la valider : Construire le niveau 4 ou supérieur du Quotidien local \"Danse Macabre\"."
        },
        {
            question: "Tes agents de sécurité ont découvert une clique d’espions. Ils occupent un des immeubles dans ton quartier. Organise un siège et extermine les comme des termites.",
            reponse: "Pour la valider : Lancer un siège sur son propre quartier. Petite remarque : en plus de Hans Kloss, 007 et Mata Hari, il y aura autant d'espions que de joueurs."
        },
        {
            question: "Depuis toujours, tu étais sûr que ce jour arriverait bien à un moment ou un autre... Passe à la Deuxième Zone et deviens l’un des membres du Conseil!",
            reponse: "Pour la valider : Passer en zone 2."
        },
        {
            question: "Chaque vampire étant au premier rang doit envoyer les gens pour servir dans une Cathédrale. Rassemble 500 000 esclaves et fait en le sacrifice de 10% au Maitre.",
            reponse: "Pour la valider : Cliquer sur «Cliquez ici pour donnez les ressources» une fois les 500 000 de population sur soi."
        },
        {
            question: "Beaucoup de jours ce sont écouler depuis que ton fils est parti en expédition vers l’inconnu et tu n’as reçu aucune nouvelle de lui. Plein d’inquiétude, tu as décidé de commencer les recherches.",
            reponse: "Pour la valider : Réussir un pèlerinage avec comme test ??? qui est une moyenne entre votre intelligence et votre perception."
        },
        {
            question: "Le prestige, le pouvoir, la splendeur ... pour maintenir tout cela tu as besoin d’argents. Tu dois agrandir tes revenus.",
            reponse: "Pour la valider : Construire le niveau 14 ou supérieur de la Maison Close."
        },
        {
            question: "Ton pouvoir et ta réputation t’ont permis de devenir l’un des vampires le plus influent de la ville. Un des membres du Conseil t’a demandé de l’aider pour détruire la bande de mutants qui ravage les routes commerciales.",
            reponse: "Pour la valider : Vaincre un monstre en un contre un pendant une quête dans une quête de lointaine."
        },
        {
            question: "Fait un acte héroïque. Seul cet acte attirera sous ton drapeau les vampires puissants.",
            reponse: "Pour la valider : Réussir le dernier des 9 pèlerinages à accomplir dans l`ordre. Dans le cas où vous les auriez déjà complétés, il suffit de réussir un pèlerinage."
        },
        //Missions à accomplir en Zone 2
        {
            question: "Atteints le 80-ième niveau d’expérience.",
            reponse: "Pour la valider : Gagner un niveau qui fait atteindre le niveau 80 ou supérieur."
        },
        {
            question: "Prouve ton talent pour les affaires. Fais bâtir Le Cimetière et La Banque de Sang.",
            reponse: "Pour la valider : Construire le Cimetière et la Banque de Sang. Si l`un des deux est déjà construit, il suffit de construire l`autre. Si les deux sont déjà construits, il suffit de monter le niveau de l`un d`eux."
        },
        {
            question: "Conquiers les cours et les esprits de la foule. Acquis 50 points de charisme",
            reponse: "Pour la valider : Monter le charisme à 50 ou plus."
        },
        {
            question: "L’Ordre de Saint Benoît a envoyé un assassin à ta trousse. Trouve le dans les environs de La Cité.",
            reponse: "Pour la valider : Vaincre un monstre en un contre un pendant une quête dans Les environs de la Cité."
        },
        {
            question: "Deviens le maître des plus obscures coins de La Cité. Acquis 55 points de réputation.",
            reponse: "Pour la valider : Monter la réputation à 55 ou plus."
        },
        {
            question: "Ton quartier a été assailli par les paladins de l’Ordre de Saint Benoît. Prépare-toi à l’ultime bataille entre les deux forces opposées...",
            reponse: "Pour la valider : Lancer un siège sur son propre quartier. Petite remarque: tous les ennemis utilisent l`arcane absorption de force."
        },
        {
            question: "Le Seigneur de l’Obscurité veut que dans sa Cathédrale on ne manque pas de sang. Etant un membre de Cercle Intérieur tu es obligé de faire un sacrifice. Accumule 800 000 litres de sang et sacrifie 10% de cette réserve au Seigneur.",
            reponse: "Pour la valider : Cliquer sur «Cliquez ici pour donnez les ressources» une fois les 800 000 litres de sang sur soi."
        },
        {
            question: "Une véritable expérience ne peut s’acquérir qu’en parcourant les voies dangereuse. Fait au moins 15 pèlerinages (réussis) vers l’inconnu.",
            reponse: "Pour la valider : Réussir 15 pèlerinages en Z2. Le jeu conserve en mémoire le nombre de pèlerinage réussis même si on change de zone entre deux sessions d`essais."
        },
        {
            question: "Tu as été informé d’une anomalie étrange située quelque part dans le désert. Trouve et explique ce phénomène mystérieux.",
            reponse: "Pour la valider : Réussir un pèlerinage avec comme paramètre une moyenne entre votre intelligence et votre savoir."
        },
        {
            question: "Tes agents t’ont signalé que près d’un pillard tué aux alentours d’une ville ils ont trouvés une lettre. Cette lettre indique que ton arrière-petite-fille, Anhala est emprisonnée sur les Champs de Couvoirs. Organise une expédition de secours.",
            reponse: "Pour la valider : Lancer n`importe quelle expédition (map1 sûre, map2 sujette à débats). Il y aura 1 gargouille de plus que de participants avec au minimum 3 gargouilles. Le % de chance de tomber sur des gargouilles en lançant l'expédition dépend du site, les 100% étant atteints sur le dernier site de la map1 (Le Cercle de Cronos)."
        },
        {
            question: "La ville entière observe les membres du Conseil. Montre ta puissance et assure le sang pour tes protégés. Développe l’Hôpital jusqu’au niveau 7 et la Boucherie jusqu’au niveau 22.",
            reponse: "Pour la valider : Construire l`Hôpital au niveau 7 et la Boucherie au niveau 22. Si l`un des deux est déjà construit à un niveau suffisant, il suffit de construire l`autre au niveau requis. Si les deux sont déjà construits aux niveaux requis, il suffit de monter le niveau de l`un d`eux."
        },
        {
            question: "La réputation ce n’est pas tout, les vampires ne suivent que les plus puissants. Atteins le 84-ième niveau d’expérience.",
            reponse: "Pour la valider : Gagner un niveau qui fait atteindre le niveau 84 ou supérieur."
        },
        {
            question: "Ton quartier a été assailli par les paladins de l`Ordre de Saint Benoît. Prépare-toi à l`ultime bataille entre les deux forces opposées....",
            reponse: "Pour la valider : Lancer un siège sur son propre quartier. Petite remarque: tous les ennemis utilisent l`arcane absorption de force."
        },
        {
            question: "Le Grand Maître de l’Ordre a échappé à la mort pendant la dernière bataille. Tu le trouvera quelque part dans l’impitoyable désert. Vas-y et offre-lui l’opportunité de rencontrer son dieu...",
            reponse: "Pour la valider : Vaincre 2 monstres pendant une quête dans un pèlerinage vers l'inconnu."
        },
        {
            question: "Deviens Le Maître de la Cité. Là et maintenant.",
            reponse: "Pour la valider : Passer en zone 1."
        },
        //Missions à accomplir en Zone 1
        {
            question: "Le prestige entre les vampires, ce n’est pas seulement la richesse et le pouvoir. Seul un grand guerrier inspire le respect. Gagne 15 embuscades consécutives. Les défenses ne comptent pas.",
            reponse: "Pour la valider : Réussir 15 attaques consécutives."
        },
        {
            question: "Malgré les avertissements donnés par tes conseillers, de temps en temps tu te promènes seul aux alentours de la ville. Tu te remémore les jours où tu étais un novice dans le monde des vampires, un novice qui rêvait de gloire et de pouvoir.",
            reponse: "Pour la valider : Vaincre un monstre en un contre un pendant une quête dans Les environs de la Cité."
        },
        {
           question: "Atteints le 89-ième niveau d’expérience.",
            reponse: "Pour la valider : Gagner un niveau qui fait atteindre le niveau 110 ou supérieur."
        },
        {
           question: "Atteints le 110-ième niveau d’expérience.",
            reponse: "Pour la valider : Gagner un niveau qui fait atteindre le niveau 110 ou supérieur."
        },
        {
           question: "Toutes les sombres et mystérieuses histoires sont soudain devenues claires. À la porte de la ville une armée de puissants sorciers n’ayant qu’un but, la destruction totale de la ville et la \"libération\" des esclaves opprimés par les vampires, s’apprêtait à donner l’assaut. Le temps est venu pour tous les vampires de se liguer contre l’ennemi commun.",
           reponse: "Pour la valider : Lancer un siège sur son propre quartier. Petite remarque: les ennemis sont très nombreux."
        }
    ];

    // Fonction pour récupérer le thème actif depuis la page des Préférences
    function extractThemeFromPreferences() {
        const checkedInput = document.querySelector('input[name="layout"]:checked'); // Trouve l'input radio sélectionné
        if (checkedInput) {
            const themeLabel = checkedInput.nextElementSibling; // Le label associé
            if (themeLabel) {
                const themeName = themeLabel.textContent.trim(); // Récupère le texte du label
                const storedTheme = localStorage.getItem('bw_activeTheme');

                // Si le thème actuel est différent de celui enregistré, on met à jour localStorage
                if (storedTheme !== themeName) {
                    localStorage.setItem('bw_activeTheme', themeName); // Sauvegarde dans localStorage
                    alert(`Thème mis à jour : ${themeName}`);
                } else {
                    console.log("Le thème actuel est déjà celui enregistré.");
                }
            } else {
                alert("Impossible de récupérer le nom du thème. Réessayez.");
            }
        } else {
            alert("Aucun thème sélectionné trouvé sur cette page.");
        }
    }

    // Fonction pour définir var_theme en fonction du thème actif
    function getVarTheme(theme) {
        let var_theme;
        switch (theme) {
            case "Classique":
            case "Nanorobot":
            case "C2k7":
            case "Gothic":
            case "Bloodsoul":
            case "Lite":
                var_theme = "td"; // Pour ces thèmes
                break;
            case "Awakening":
                var_theme = ".tasks_tasksDesc"; // Pour le thème Awakening
                break;
            default:
                var_theme = "td"; // Valeur par défaut
                break;
        }
        return var_theme;
    }

    // Fonction pour insérer les réponses sous les questions correspondantes
    questionReponses.forEach(item => {
        const activeTheme = localStorage.getItem('bw_activeTheme');
        if (!activeTheme) {
            // Affiche une seule popup si elle n'a pas déjà été montrée lors du chargement
            if (!sessionStorage.getItem('bw_themeWarningShown')) {
                alert("Le thème n'est pas configuré. Veuillez vous rendre sur la page des Préférences.");
                sessionStorage.setItem('bw_themeWarningShown', true);
            }
        } else {
            const var_theme = getVarTheme(activeTheme);
            const allElements = document.querySelectorAll(var_theme);
            allElements.forEach(element => {
                // Si l'élément contient la question, on insère la réponse
                if (element.textContent.includes(item.question)) {
                    const reponseElement = document.createElement('div');
                    reponseElement.style.marginTop = '10px'; // Un peu d'espace avant la réponse
                    reponseElement.style.color = 'red'; // Texte en rouge pour plus de visibilité
                    reponseElement.textContent = item.reponse;
                    element.appendChild(reponseElement);
                }
            });
        }
    });

    // Si on est sur une page des Préférences, extraire le thème
    if (isSettingsPage(currentPage)) {
        sessionStorage.removeItem('bw_themeWarningShown'); // Réinitialise l'avertissement pour la prochaine utilisation
        extractThemeFromPreferences();
    }
})();
