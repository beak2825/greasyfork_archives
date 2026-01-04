// ==UserScript==
// @name           WME URCom Francais Belgique
// @description    Ce script est la traduction francaise des commentaires de URCom, il doit être utilisé avec ma version du script URCom
// @namespace      https://gitlab.com/WMEScripts
// @grant          none
// @grant          GM_info
// @version        2023.07.03.01
// @match          https://editor-beta.waze.com/*editor*
// @match          https://beta.waze.com/*editor*
// @match          https://www.waze.com/*editor*
// @match          https://editor-beta.waze.com/*editor/*
// @match          https://beta.waze.com/*editor/*
// @match          https://www.waze.com/*editor/*
// @author         tunisiano187 '2018 based on Rick Zabel '2014
// @license        MIT/BSD/X11
// @compatible     chrome firefox
// @supportURL      mailto:incoming+WMEScripts/URComments-French@incoming.gitlab.com
// @contributionURL https://ko-fi.com/tunisiano
// @icon			data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/370207/WME%20URCom%20Francais%20Belgique.user.js
// @updateURL https://update.greasyfork.org/scripts/370207/WME%20URCom%20Francais%20Belgique.meta.js
// ==/UserScript==

/* Changelog/Versionning
 [Versionning/Changelog](https://gitlab.com/WMEScripts/URComments-French/wikis/versionning/urcomments-french)
 */
//Ce script est le complément français orienté pour la belgique. Si nécessaire, n'hésitez pas à me contacter pour faire une autre version.
//Si vous souhaitez inclure des quotes dans vos titres ou commentaires, vous devez les \"échaper" exemple "Comment \"Comment\" Comment",
//Si vous souhaitez faire du multiligne, vous avez deux possibilités, utiliser \n. example "Line1\nLine2",
//ou \r\ en fin de ligne et vous continuez à la ligne (cette technique ne fonctionne pas sur les anciens navigateurs mais est plus propre"
//Si vous souhaitez insérer une ligne vide, utilisez \n\n. example "Line1\n\nLine2",
//
// Afin de ne pas charger l'affichage, je ne change pas les textes qui n'apparaissent que pour l'éditeur.
//
// Nom du traducteur
window.UrcommentsFrancais_BelgiqueTranslatorsName= "<a href=\"mailto:benoit@coignet.be\">@tiniebongoetc</a> ";
// Configuration de la signature
const URCommentCustomSignature = '$SIGNATURE';

const URCommentCustomVersion = GM_info.script.version;
const URCommentCustomUpdateMessage = "yes"; // yes alert the user, no has a silent update.
const URCommentCustomVersionUpdateNotes = "Nouvelle version de URCom Francais_Belgique! v" + URCommentCustomVersion;

if (URCommentCustomUpdateMessage === "yes") {
	if (localStorage.getItem('URCommentCustomVersion') !== URCommentCustomVersion) {
		alert(URCommentCustomVersionUpdateNotes);
		localStorage.setItem('URCommentCustomVersion', URCommentCustomVersion);
	}
}

//Configuration personalisée : ceci permet l'automatisation de vos messages de rappel, ainsi que vos fermeture en "non identifiée" d'être nommées comme vous le souhaitez.
//La position de ces messages est importante, les positions se comtent avec les "," en commencant à 0.
//On compte donc les titres, commentaires, et statut de la demande. Dans cette liste, le rappel suivant est "Rappel"
window.UrcommentsFrancais_BelgiqueReminderPosistion = 48;

//Ceci est le message qui est ajouté à l'option "lien de rappel"(reminder link)
window.UrcommentsFrancais_BelgiqueReplyInstructions = "Pour répondre, veuillez utiliser l'application Waze ou vous rendre à l'adresse suivante "; //suivi par l'URL - tunisiano187 10/7/2018

//La position du message "fermer en "non identifié" (compte identique au rappel). Dans cette liste, le titre est "Aucune réponses"
window.UrcommentsFrancais_BelgiqueCloseNotIdentifiedPosistion = 60;

//Ceci est la liste des type d'UR par défaut de waze. Editez cette liste en tenant compte des termes utilisés dans votre zone!
//Afin que celà fonctionne, ces message doivent correspondre à vos titres de commentaires automatiques!
window.UrcommentsFrancais_Belgiquedef_names = [];
window.UrcommentsFrancais_Belgiquedef_names[6] = "Incorrect turn"; //"Incorrect turn"; A modifier
window.UrcommentsFrancais_Belgiquedef_names[7] = "Adresse incorrecte"; //"Incorrect address";
window.UrcommentsFrancais_Belgiquedef_names[8] = "Route incorrecte"; //"Incorrect route" A vérifier;
window.UrcommentsFrancais_Belgiquedef_names[9] = "Rond-point manquant"; //"Missing roundabout" A vérifier;
window.UrcommentsFrancais_Belgiquedef_names[10] = "Erreur générale"; //"General error";
window.UrcommentsFrancais_Belgiquedef_names[11] = "Interdiction de tourner"; //"Turn not allowed";
window.UrcommentsFrancais_Belgiquedef_names[12] = "Jonction incorrecte"; //"Incorrect junction";
window.UrcommentsFrancais_Belgiquedef_names[13] = "Pont surélevé manquant"; //"Missing bridge overpass" A vérifier;
window.UrcommentsFrancais_Belgiquedef_names[14] = "Mauvais sens de circulation"; //"Wrong driving direction"; A vérifier
window.UrcommentsFrancais_Belgiquedef_names[15] = "Sortie manquante"; //"Missing Exit";
window.UrcommentsFrancais_Belgiquedef_names[16] = "Route manquante"; //"Missing Road";
window.UrcommentsFrancais_Belgiquedef_names[18] = "Point d'intérêt manquant"; //"Missing Landmark" A vérifier;
window.UrcommentsFrancais_Belgiquedef_names[19] = "Route bloquée"; //"Blocked Road" A vérifier;
window.UrcommentsFrancais_Belgiquedef_names[21] = "Nom de rue manquante"; //"Missing Street Name" A vérifier;
window.UrcommentsFrancais_Belgiquedef_names[22] = "Préfixe/Suffixe de rue incorrect"; //"Incorrect Street Prefix or Suffix" A vérifier;
window.UrcommentsFrancais_Belgiquedef_names[23] = "Mauvaise limitation de vitesse"; //"Missing or invalid speed limit"; A vérifier


//below is all of the text that is displayed to the user while using the script
window.UrcommentsFrancais_BelgiqueURC_Text = [];
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip = [];
window.UrcommentsFrancais_BelgiqueURC_USER_PROMPT = [];
window.UrcommentsFrancais_BelgiqueURC_URL = [];

//zoom out links
window.UrcommentsFrancais_BelgiqueURC_Text[0] = "Zoom arrière (0) & fermeture de l'UR"; //"Zoom Out 0 & Close UR";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[0] = "Effectue un zoom arrière et ferme la fenêtre de l'UR"; //"Zooms all the way out and closes the UR window";

window.UrcommentsFrancais_BelgiqueURC_Text[1] = "Zoom arrière (2) & fermeture de l'UR"; //"Zoom Out 2 & Close UR";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[1] = "Zoom au niveau 2 et fermeture de la fenêtre de l'UR"; //"Zooms out to level 2 and closes the UR window (this is where I found most of the toolbox highlighting works)";

window.UrcommentsFrancais_BelgiqueURC_Text[2] = "Zoom arrière (3) & fermeture de l'UR"; //"Zoom Out 3 & Close UR";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[2] = "Zoom au niveau 3 et fermeture de la fenêtre de l'UR"; //"Zooms out to level 3 and closes the UR window (this is where I found most of the toolbox highlighting works)";

window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[3] = "Recharger la carte"; //"Reload the map";

window.UrcommentsFrancais_BelgiqueURC_Text[4] = "Nombre d'URs visibles : ";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[4] = "Nombre d'URs visibles sur la carte"; //"Number of URs Shown";

//tab names
window.UrcommentsFrancais_BelgiqueURC_Text[5] = "Commentaires"; //"Comments";
window.UrcommentsFrancais_BelgiqueURC_Text[6] = "Filtrage des URs"
window.UrcommentsFrancais_BelgiqueURC_Text[7] = "Paramètres"; //"Settings";

//UR Filtering Tab
window.UrcommentsFrancais_BelgiqueURC_Text[8] = "Cliquez ici pour plus d'informations"; //"Click here for Instructions";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[8] = "Instructions pour le filtrage des URs"; //"Instructions for UR filtering";
window.UrcommentsFrancais_BelgiqueURC_URL[8] = "https://docs.google.com/presentation/d/1zwdKAejRbnkUll5YBfFNrlI2I3Owmb5XDIbRAf47TVU/edit#slide=id.p";


window.UrcommentsFrancais_BelgiqueURC_Text[9] = "Activer le filtrage des URs"; //"Enable URCom UR filtering";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[9] = "Active ou désactive l'automatisme des URs-Com types."; //"Enable or disable URCom filtering";

window.UrcommentsFrancais_BelgiqueURC_Text[10] = "Activer le compteur des infobulles"; //"Enable UR pill counts";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[10] = "Active ou désactive le compteur des infobulles situées sous les URs"; //"Enable or disable the pill with UR counts";

window.UrcommentsFrancais_BelgiqueURC_Text[12] = "Masquer les URs en cours"; //"Hide Waiting";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[12] = "Montrer seulement les URs à traiter (cache les URs qui sont en cours de traitement)"; //"Only show URs that need work (hide in-between states)";

window.UrcommentsFrancais_BelgiqueURC_Text[13] = "Montrer seulement mes URs"; //"Only show my URs";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[13] = "Cacher les URs sans commentaire de ma part"; //"Hide URs where you have no comments";

window.UrcommentsFrancais_BelgiqueURC_Text[14] = "Montrer les URs devant être clôturés après expiration du rappel"; //"Show others URs past reminder + close";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[14] = "Montrer les URs dont le rappel a expiré et que d'autres éditeurs ont commenté"; //"Show URs that other commented on that have gone past the reminder and close day settings added together"; //

window.UrcommentsFrancais_BelgiqueURC_Text[15] = "Masquer les URs nécessitant un rappel"; //"Hide URs Reminder needed";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[15] = "Masquer les URs où des rappels sont nécessaires"; //"Hide URs where reminders are needed";

window.UrcommentsFrancais_BelgiqueURC_Text[16] = "Masquer les URs qui ont reçu une réponse"; //"Hide URs user replies";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[16] = "Masquer les URs qui ont été commentés par le rapporteur";

window.UrcommentsFrancais_BelgiqueURC_Text[17] = "Masquer les URs à fermer"; //"Hide URs close needed";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[17] = "Masquer les URs nécessitant une fermeture"; //"Hide URs that need closing";

window.UrcommentsFrancais_BelgiqueURC_Text[18] = "Masquer les URs sans commentaire"; //"Hide URs no comments";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[18] = "Masquer les URs qui n'ont reçu aucun commentaire"; //"Hide URs that have zero comments";

window.UrcommentsFrancais_BelgiqueURC_Text[19] = "Masquer les URs sans commentaire ni description"; //"hide 0 comments without descriptions";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[19] = "Masquer les URs qui n'ont pas de description ou de commentaire"; //"Hide URs that do not have descriptions or comments";

window.UrcommentsFrancais_BelgiqueURC_Text[20] = "Masquer les URs sans commentaire mais avec une description"; //"hide 0 comments with descriptions";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[20] = "Masquer les URs qui ont une description mais pas de commentaire"; //"Hide URs that have descriptions and zero comments";

window.UrcommentsFrancais_BelgiqueURC_Text[21] = "Masquer les URs fermés"; //"Hide Closed URs";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[21] = "Masquer les URs qui ont été fermés"; //"Hide closed URs";

window.UrcommentsFrancais_BelgiqueURC_Text[22] = "[URO+] Masquer les URs taggés"; //"Hide Tagged URs";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[22] = "Masquer les URs qui sont marqués avec des tags de style URO+."; //"Hide URs that are tagged with URO+ style tags ex. [NOTE]";

window.UrcommentsFrancais_BelgiqueURC_Text[23] = "Jours avant rappel : "; //"Reminder days: ";

window.UrcommentsFrancais_BelgiqueURC_Text[24] = "Jours avant fermeture : "; //"Close days: ";

//settings tab
window.UrcommentsFrancais_BelgiqueURC_Text[25] = "Définir automatiquement le commentaire adéquat"; //"Auto set new UR comment";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[25] = "Cette option définit automatiquement le commentaire sur les nouveaux URs qui n'ont pas encore reçu de commentaires"; //"Auto set the UR comment on new URs that do not already have comments";

window.UrcommentsFrancais_BelgiqueURC_Text[26] = "Rappel automatique"; //"Auto set reminder UR comment";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[26] = "Cette option définit automatiquement le commentaire de rappel dans les URs dont le nombre de jours avant rappel a expiré et qui ne comportent qu'un seul commentaire"; //"Auto set the UR reminder comment for URs that are older than reminder days setting and have only one comment";

window.UrcommentsFrancais_BelgiqueURC_Text[27] = "Zoom automatique sur les nouveaux URs"; //"Auto zoom in on new UR";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[27] = "Cette option permet d'effectuer un zoom automatique lors de l'ouverture des URs sans commentaires lors de l'envoi du rappel"; //"Auto zoom in when opening URs with no comments and when sending UR reminders";

window.UrcommentsFrancais_BelgiqueURC_Text[28] = "Centrer automatiquement l'UR"; //"Auto center on UR"
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[28] = "Cette option permet de centrer automatiquement la carte sur le zoom actuel lorsque qu'un UR a des commentaires et que le zoom est inférieur à 15"; //"Auto Center the map at the current map zoom when UR has comments and the zoom is less than 3";

window.UrcommentsFrancais_BelgiqueURC_Text[29] = "Clic automatique sur \"ouvert\", \"résolu\", \"non identifé\""; //"Auto click open, solved, not identified";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[29] = "Cette option sélectionne l'option \"résolu\" ou \"non identifié\" correspondant à la réponse automatique"; //"Suppress the message about recent pending questions to the reporter and then depending on the choice set for that comment Clicks Open, Solved, Not Identified";

window.UrcommentsFrancais_BelgiqueURC_Text[30] = "Sauvegarde automatique après un commentaire résolu ou non identifié"; //"Auto save after a solved or not identified comment";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[30] = "Si le clic automatique \"ouvert\", \"résolu\", \"non identifé\" est également coché, cette option cliquera sur le bouton de sauvegarde (après avoir cliqué sur un commentaire d'UR et ensuite sur le bouton d'envoi)."; //"If Auto Click Open, Solved, Not Identified is also checked, this option will click the save button after clicking on a UR-Comment and then the send button";

window.UrcommentsFrancais_BelgiqueURC_Text[31] = "Fermeture automatique de la fenêtre \"commentaire\""; //"Auto close comment window";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[31] = "Pour les demandes ne nécessitant pas d'enregistrement, cette option fermera la requête de l'utilisateur après avoir cliqué sur un commentaire et sur le bouton d'envoi"; //"For the user requests that do not require saving this will close the user request after clicking on a UR-Comment and then the send button";

window.UrcommentsFrancais_BelgiqueURC_Text[32] = "Recharger la carte automatiquement après un commentaire"; //"Auto reload map after comment"
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[32] = "Cette option recharge la carte automatiquement après avoir choisi un \"UR-Comment\" puis sur \"Envoyer\". Ceci ne s'applique pas aux messages qui doivent être sauvegardés car la sauvegarde recharge automatiquement la carte. Actuellement cette option n'est pas nécessaire mais laissée en cas de modifications"; //"Reloads the map after clicking on a UR-Comment and then send button. This does not apply to any messages that needs to be saved, since saving automatically reloads the map. Currently this is not needed but I am leaving it in encase Waze makes changes";

window.UrcommentsFrancais_BelgiqueURC_Text[33] = "Zoom arrière automatique après commentaire"; //"Auto zoom out after comment";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[33] = "Après avoir cliqué sur un UR-commentaire dans la liste et cliqué sur (envoyer), le zoom de la carte sera rétabli à votre zoom précédent"; //"After clicking on a UR-Comment in the list and clicking send on the UR the map zoom will be set back to your previous zoom";

window.UrcommentsFrancais_BelgiqueURC_Text[34] = "Passer automatiquement à l'onglet \"Commentaires\""; //"Auto switch to the UrComments tab";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[34] = "Cette option passe automatiquement à l'onglet \"Commentaires\" lors de l'ouverture d'un UR. Lorsque la fenêtre de l'UR est fermée, vous passerez directement à l'onglet précédent"; //"Auto switch to the URComments tab when opening a UR, when the UR window is closed you will be switched to your previous tab";

window.UrcommentsFrancais_BelgiqueURC_Text[35] = "Double-clic pour envoi automatique"; //"Close message - double click link (auto send)";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[35] = "Cette option permet en double-cliquant sur un UR-Commentaire d'ajouter le texte dans l'UR et de l'envoyer automatiquement"; //"Add an extra link to the close comment when double clicked will auto send the comment to the UR windows and click send, and then will launch all of the other options that are enabled";

window.UrcommentsFrancais_BelgiqueURC_Text[36] = "Tous les commentaires - Double-clic sur le lien (envoi automatique)"; //"All comments - double click link (auto send)";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[36] = "(à développer) Ajoute un lien supplémentaire à chaque commentaire de la liste qui, en double-cliquant, enverra automatiquement le commentaire aux fenêtres UR et cliquera sur envoyer. Puis toutes les autres options activées seront lancées"; //Add an extra link to each comment in the list that when double clicked will auto send the comment to the UR windows and click send, and then will launch all of the other options that are enabled";

window.UrcommentsFrancais_BelgiqueURC_Text[37] = "Choix de la langue :"; //"Comment List";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[37] = "Ce choix multiple permet de choisir votre langue. Si vous souhaitez que votre liste de commentaires soit intégrée dans ce script ou que vous avez des suggestions à faire, veuillez me contacter sur Waze (@tunisiano187)."; //This shows the selected comment list. There is support for a custom list. If you would like your comment list built into this script or have suggestions on the Comments team’s list, please contact me at rickzabel @waze or @gmail";

window.UrcommentsFrancais_BelgiqueURC_Text[38] = "Désactiver les boutons \"Résolu\" et \"Suivant\""; //"Disable done / next buttons";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[38] = "Cette option permet de désactiver les boutons \"Résolu\" et \"Suivant\" au bas de la nouvelle fenêtre"; //"Disable the done / next buttons at the bottom of the new UR window";

window.UrcommentsFrancais_BelgiqueURC_Text[39] = "Ne plus suivre l'UR après l'envoi"; //"Unfollow UR after send";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[39] = "Cette option permet de ne plus suivre un UR après avoir envoyé un commentaire"; //"Unfollow UR after sending comment";

window.UrcommentsFrancais_BelgiqueURC_Text[40] = "Envoi automatique de rappels"; //"Auto send reminders";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[40] = "Cette option permet d'envoyer automatiquement des rappels à tous mes URs suivis au délai expiré"; //"Auto send reminders to my UR as they are on screen";

window.UrcommentsFrancais_BelgiqueURC_Text[41] = "Infobulle / Nom de l'éditeur"; //"Replace tag name with editor name";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[41] = "Cette option permet de remplacer le nombre de commentaires de l'infobulle par le nom du dernier éditeur"; //"When a UR has the logged in editors name in the description or any of the comments of the UR (not the name Waze automatically add when commenting) replace the tag type with the editors name";

window.UrcommentsFrancais_BelgiqueURC_Text[42] = "(Double-cliquer pour fermer les liens)"; //double click to close links
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[42] = "Double-cliquez ici pour un envoi automatique"; //"Double click here to auto send - ";

window.UrcommentsFrancais_BelgiqueURC_Text[43] = "[URO+] Ne pas afficher l'infobulle sous les URs"; //"Dont show tag name on pill";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[43] = "Cette option permet de ne pas montrer l'infobulle sous les URs où il y a une étiquette URO"; //"Dont show tag name on pill where there is a URO tag";

window.UrcommentsFrancais_BelgiqueURC_Text[44] = "Signature"; //"Signature";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[44] = "Cette option vous permet de définir une signature personnalisée qui sera automatiquement affichée sous les textes des UR-Commentaire. Après avoir apporté une modification, veuillez actualiser votre page pour mettre à jour votre nouveau texte"; //"Here you can set your signature, after making a change, please refresh your page to update the texts";

window.UrcommentsFrancais_BelgiqueURC_Text[45] = "c";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[45] = "Commentaires sur cette demande";

window.UrcommentsFrancais_BelgiqueURC_Text[46] = "j";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[46] = "Jours depuis le dernier commentaire";

window.UrcommentsFrancais_BelgiqueURC_Text[47] = "Pour tout contact";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[47] = "Pour tout contact";

window.UrcommentsFrancais_BelgiqueURC_Text[48] = "Développement";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[48] = "Développeur";

window.UrcommentsFrancais_BelgiqueURC_Text[49] = "Textes et commentaires";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[49] = "Traduction et commentaires";

window.UrcommentsFrancais_BelgiqueURC_Text[50] = "Inclure un Post-scriptum";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[50] = "Cette option vous permet d'inclure un Post-scriptum sous vos réponses";

window.UrcommentsFrancais_BelgiqueURC_Text[51] = "PS";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[51] = "Post-scriptum";

window.UrcommentsFrancais_BelgiqueURC_Text[52] = "Ces options sont actuellement en test";

window.UrcommentsFrancais_BelgiqueURC_Text[53] = "Mainteneur";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[53] = "Entretenu par";

window.UrcommentsFrancais_BelgiqueURC_Text[54] = "Salutation";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[54] = "Définissez un message d'accueil personnalisé, celui-ci sera placé avant la réponse configurée";

window.UrcommentsFrancais_BelgiqueURC_Text[55] = "Masquer la description d'AndroidAuto";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[55] = "Masque la description 'Reported from AAOS'";

window.UrcommentsFrancais_BelgiqueURC_Text[56] = "+ Nouvelle liste";

window.UrcommentsFrancais_BelgiqueURC_Text[57] = "Liste de réponses";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[57] = "Utiliser une liste de réponses personnalisée";

window.UrcommentsFrancais_BelgiqueURC_Text[58] = "Résponses";

window.UrcommentsFrancais_BelgiqueURC_Text[59] = "Modifier la réponse personnalisée";
window.UrcommentsFrancais_BelgiqueURC_Text[60] = "Ajouter une réponse personnalisée";

window.UrcommentsFrancais_BelgiqueURC_Text[61] = "Titre";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[61] = "Entrez le titre de l'option, pour le remplissage automatique, cela doit correspondre à UR type";

window.UrcommentsFrancais_BelgiqueURC_Text[62] = "Réponse";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[62] = "Entrez le message pour répondre à l'UR";

window.UrcommentsFrancais_BelgiqueURC_Text[63] = "Statut de l'UR";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[63] = "Sélectionnez le statut à appliquer lorsque vous cliquez sur cette option";

window.UrcommentsFrancais_BelgiqueURC_Text[64] = "Signature";
window.UrcommentsFrancais_BelgiqueURC_Text_tooltip[64] = "Ajoutez votre signature à la réponse";

window.UrcommentsFrancais_BelgiqueURC_Text[65] = "Sauvegarder";
window.UrcommentsFrancais_BelgiqueURC_Text[66] = "Annuler";

window.UrcommentsFrancais_BelgiqueURC_Text[67] = "Options de liste personnalisées";
window.UrcommentsFrancais_BelgiqueURC_Text[68] = "Ajouter une réponse";
window.UrcommentsFrancais_BelgiqueURC_Text[69] = "Modifier une réponse";
window.UrcommentsFrancais_BelgiqueURC_Text[70] = "Modifier le nom de la liste";
window.UrcommentsFrancais_BelgiqueURC_Text[71] = "ZONE DANGEREUSE";
window.UrcommentsFrancais_BelgiqueURC_Text[72] = "Supprimer cette liste";
window.UrcommentsFrancais_BelgiqueURC_Text[73] = "Annuler la suppression";
window.UrcommentsFrancais_BelgiqueURC_Text[74] = "Supprimer une réponse";

window.UrcommentsFrancais_BelgiqueURC_USER_PROMPT[0] = "UR-Commentaires - Vous avez une ancienne version ou votre fichier de traduction est corrompu. Une erreur de syntaxe peut également être à l'origine de l'erreur. Disparu : ";

window.UrcommentsFrancais_BelgiqueURC_USER_PROMPT[1] = "UR-Commentaires - Il vous manque les éléments suivants de votre liste de commentaires personnalisée : "; //"UR Comments - You are missing the following items from your custom comment list: ";

window.UrcommentsFrancais_BelgiqueURC_USER_PROMPT[2] = "La liste ne peut pas être trouvée, vous pouvez trouver la liste et les instructions en contactant : @tunisiano187"; //"List can not be found you can find the list and instructions at https://wiki.waze.com/wiki/User:Rickzabel/UrComments/";

window.UrcommentsFrancais_BelgiqueURC_USER_PROMPT[3] = "UR-Commentaires - Vous ne pouvez pas régler la fermeture à zéro jours !";

window.UrcommentsFrancais_BelgiqueURC_USER_PROMPT[4] = "UR-Commentaires - Pour utiliser les liens de double-clic, vous devez avoir l'option Auto-clic \"ouvert\", \"résolu\", \"non identifé\"."; //"URComments - To use the double click links you must have the Auto click open, solved, not identified option enabled";

window.UrcommentsFrancais_BelgiqueURC_USER_PROMPT[5] = "UR-Commentaires - Abandonner \"FilterURs2\" car les filtrages, les comptages et les rappels automatiques sont désactivés."; //"URComments - Aborting FilterURs2 because both filtering, counts, and auto reminders are disabled";

window.UrcommentsFrancais_BelgiqueURC_USER_PROMPT[6] = "UR-Commentaires : Le chargement des informations de l'UR à expiré - Nouvelle tentative."; //this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsFrancais_BelgiqueURC_USER_PROMPT[7] = "UR-Commentaires: Ajout du message de rappel à l'UR :"; //this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsFrancais_BelgiqueURC_USER_PROMPT[8] = "Le filtrage des UR-Commentaires a été désactivé car les filtres UR de URO+ sont actifs."; // "URComment's UR Filtering has been disabled because URO+\'s UR filters are active."; //this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsFrancais_BelgiqueURC_USER_PROMPT[9] = "UR-Commentaires a détecté que vous avez des modifications non enregistrées!\n\nAvec l'option sauvegarde automatique activée et avec les modifications non enregistrées, vous ne pouvez pas envoyer de commentaires nécessitant l'enregistrement du script. Enregistrez vos modifications puis cliquez à nouveau sur le commentaire que vous souhaitez envoyer."; //"UrComments has detected that you have unsaved edits!\n\nWith the Auto Save option enabled and with unsaved edits you cannot send comments that would require the script to save. Please save your edits and then re-click the comment you wish to send.";

window.UrcommentsFrancais_BelgiqueURC_USER_PROMPT[10] = "UR-Commentaires : Impossible de trouver la boîte de commentaire ! Pour que ce script fonctionne, vous devez avoir un UR d'ouvert."; //"URComments: Can not find the comment box! In order for this script to work you need to have a UR open."; //this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsFrancais_BelgiqueURC_USER_PROMPT[11] = "UR-Commentaires - Ceci enverra des rappels lors du réglage des jours de rappel. Ceci ne se produit que lorsqu'ils sont dans votre zone visible.\n\nREMARQUE : Lorsque vous utilisez cette fonction, vous ne devez pas laisser d'UR ouvert à moins que vous ayez une question nécessitant une réponse du rapporteur. Ce script enverra ces rappels. "; //"URComments - This will send reminders at the reminder days setting. This only happens when they are in your visible area. NOTE: when using this feature you should not leave any UR open unless you had a question that needed an answer from the wazer as this script will send those reminders."; //conformation message/ question

window.UrcommentsFrancais_BelgiqueURC_USER_PROMPT[12] = "URCom - Votre liste personnalisée configurée n'existe plus!";

window.UrcommentsFrancais_BelgiqueURC_USER_PROMPT[13] = "Ce nom existe déjà!";

window.UrcommentsFrancais_BelgiqueURC_USER_PROMPT[14] = "Nouvelle liste ajoutée avec succès";

window.UrcommentsFrancais_BelgiqueURC_USER_PROMPT[15] = "Échec de l'ajout d'une nouvelle liste!";

window.UrcommentsFrancais_BelgiqueURC_USER_PROMPT[16] = "Entrez un nouveau nom pour la liste";

window.UrcommentsFrancais_BelgiqueURC_USER_PROMPT[17] = "Nom mis à jour avec succès";

window.UrcommentsFrancais_BelgiqueURC_USER_PROMPT[18] = "Tous les champs obligatoires ne sont pas définis!";

window.UrcommentsFrancais_BelgiqueURC_USER_PROMPT[19] = "Échec de l'enregistrement du texte personnalisé!";

window.UrcommentsFrancais_BelgiqueURC_USER_PROMPT[20] = "Voulez-vous vraiment supprimer cette liste?";

window.UrcommentsFrancais_BelgiqueURC_USER_PROMPT[21] = "Échec de la suppression de la liste!";

window.UrcommentsFrancais_BelgiqueURC_USER_PROMPT[22] = "Cliquez sur l'option de texte pour supprimer";

window.UrcommentsFrancais_BelgiqueURC_USER_PROMPT[23] = "Échec de la suppression de l'élément!";

window.UrcommentsFrancais_BelgiqueURC_USER_PROMPT[24] = "Cliquez sur l'option de texte pour modifier";

//Le format des commentaires doit correspondre à ceci,
// "Titre",     * ce que vous verrez dans la liste des messages dans WME (doit correspondre aux textes des types d'UR Waze par défaut)
// "comment",   * ce qui sera envoyé au Wazer
// "URStatus"   * cette section correspond à l'état de votre UR après le clic "Ouvert, Résolu, Non identifié". Après avoir cliqué sur Envoyer, l'état sera mis automatiquement. les possibilités sont : "Open", "Solved",ou "NotIdentified",
// Si vous souhaitez laisser une ligne vide entre les commentaires (menu), entrez les lignes suivantes :
// "<br>",
// "",
// "",

//Custom list
window.UrcommentsFrancais_BelgiqueArray2 = [

        // 0 (0)
    "Message(s) pour signaler un UR corrigé",
    "#Title",
    "Open",

    //1 (3) - Corrigé
    "Corrigé !",
    "Bonjour, \r\
\r\
Merci beaucoup pour votre collaboration ! 🙂\r\
\r\
Le problème relaté est à présent corrigé. La modification sera effective dès la prochaine mise à jour de la carte qui devrait avoir lieu d’ici 48 à 72 heures, merci de votre patience.\r\
\r\
Grâce à votre participation, le réseau routier peut sans cesse être mis à jour en temps réel et permettre un guidage toujours plus performant.\r\
\r\
N’hésitez jamais à nous signaler vos remarques et toutes les erreurs que vous pourriez rencontrer sur vos trajets :\r\
\r\
    - Route fermée (travaux) ;\r\
    - Mauvaise signalisation de limitation de vitesse ;\r\
    - Changement de sens de circulation ;\r\
    - Interdiction de tourner ;\r\
    - Route manquante ;\r\
    - Restictions de circulation ;\r\
    - Etc.\r\
\r\
Ensemble, tentons continuellement de rendre l’application toujours plus agréable et la plus fonctionnelle possible !\r\
\r\
Bonne journée et bonne route avec Waze ! 🙂\r\
" + URCommentCustomSignature,
    "Solved", // tunisiano187 10/7/18

// 2 (6)
    "<br>",
    "",
    "",

// 3 (9)
    "Messages pour les nouveaux URs ouverts",
    "#Title",
    "Open",

// 4 (12)
    "Vous avez signalé (...)", //7
    "Bonjour, \r\
\r\
Merci pour votre signalement. \r\
\r\
Vous avez signalé \"$URD\". Pourriez-vous développer plus précisément le problème que vous avez rencontré afin que les modifications nécessaires puissent être apportées ?\r\
\r\
N’hésitez pas à vous aider de la carte afin d’énoncer le plus clairement possible le problème rencontré : https://www.waze.com/fr/livemap (noms de rue, estimation de la durée des travaux, etc.)\r\
\r\
Merci pour votre contribution à l’amélioration de la carte.\r\
\r\
Bonne route avec Waze ! 🙂\r\
\r\
" + URCommentCustomSignature,
    "Open",

// 5 (15)
    "Adresse incorrecte", //7
    "Bonjour, \r\
\r\
Merci pour votre signalement. \r\
\r\
Vous avez signalé une adresse incorrecte. Par souci de confidentialité, Waze ne nous communique ni votre point de départ, ni l'arrivée.\r\
\r\
Afin de résoudre votre souci, pourriez-vous développer plus précisément le problème que vous avez rencontré ?\r\
\r\
Quelle est l'adresse incorrecte que vous souhaitez signaler ?\r\
\r\
L'emplacement de votre signalement est-il l'emplacement exact de l'adresse à corriger ?\r\
\r\
Vous pouvez également nous rejoindre pour en discuter : https://sites.google.com/view/wazertowazer/resources-for-everyone/join-community-channels \r\
\r\
Merci pour votre contribution à l’amélioration de la carte.\r\
" + URCommentCustomSignature,
    "Open",

// 6 (18)
    "Route manquante", //7
    "Bonjour, \r\
\r\
Merci pour votre signalement. \r\
\r\
Vous avez signalé une route manquante, pourriez-vous développer plus précisément le problème que vous avez rencontré ?\r\
\r\
Vous pouvez également nous rejoindre pour en discuter : https://sites.google.com/view/wazertowazer/resources-for-everyone/join-community-channels \r\
\r\
Merci.\r\
\r\
Bonne route avec Waze ! 🙂\r\
" + URCommentCustomSignature,
    "Open",

// 7 (21)
    "Jonction incorrecte", //7
    "Bonjour, \r\
\r\
Merci pour votre signalement. \r\
\r\
Vous avez signalé une jonction incorrecte, pourriez-vous développer plus précisément le problème que vous avez rencontré afin que les modifications nécessaires puissent être apportées ?\r\
\r\
N’hésitez pas à vous aider de la carte afin d’énoncer le plus clairement possible le problème rencontré : https://www.waze.com/fr/livemap (noms de rue, estimation de la durée des travaux, etc.)\r\
\r\
Vous pouvez également nous rejoindre pour en discuter : https://sites.google.com/view/wazertowazer/resources-for-everyone/join-community-channels \r\
\r\
Merci pour votre contribution à l’amélioration de la carte.\r\
\r\
Bonne route avec Waze ! 🙂\r\
\r\
" + URCommentCustomSignature,
    "Open",

// 8 (24)
    "Interdiction de tourner", //7
    "Bonjour, \r\
\r\
Merci pour votre signalement. \r\
\r\
Vous avez signalé une interdiction de tourner, pourriez-vous développer plus précisément le problème ? Est-ce dû à des travaux, à une route en sens unique, etc. ? \r\
\r\
Bonne route avec Waze ! 🙂\r\
" + URCommentCustomSignature,
    "Open",

// 9 (27)
    "Mauvais sens de circulation", //8
    "Bonjour, \r\
\r\
Merci pour votre signalement. \r\
\r\
Vous avez signalé un mauvais sens de circulation, pourriez-vous développer plus précisément le problème que vous avez rencontré (route concernée, ...) ? Est-ce permanent ? \r\
\r\
Vous pouvez également nous rejoindre pour en discuter : https://sites.google.com/view/wazertowazer/resources-for-everyone/join-community-channels \r\
\r\
Bonne route avec Waze ! 🙂\r\
" + URCommentCustomSignature,
    "Open",

// 10 (30)
    "Protection d'adresse",
    "Bonjour, \r\
\r\
Merci pour votre signalement. \r\
\r\
Pour des raisons de confidentialité, Waze ne nous communique pas vos points de départ et d'arrivée. Afin de régler votre souci, pourriez-vous nous communiquer l'adresse de destination ? \r\
\r\
Vous pouvez également nous rejoindre pour en discuter : https://sites.google.com/view/wazertowazer/resources-for-everyone/join-community-channels \r\
\r\
Bonne route avec Waze ! 🙂\r\
    " + URCommentCustomSignature,
    "Open",


// 11 (33) ajouter le e pour rétablir
    "Mauvaise limitation de vitesse",
    "Bonjour, \r\
\r\
Merci pour votre signalement. \r\
\r\
Vous avez signalé une mauvaise limitation de vitesse , pourriez-vous développer plus précisément l'erreur que vous avez rencontrée sur votre trajet afin que les modifications nécessaires puissent être apportées à la carte ? Est-ce permanent ou lié à des travaux, par exemple ?\r\
\r\
S'il s'agit d'un radar-tronçon, vous devriez poster un premier signalement « Erreur carte » à l’endroit exact où commence la zone à modifier et un second où celle-ci se termine. A chaque signalement correctement placé là où se trouvent les panneaux de signalisation, n’oubliez pas d’ajouter un commentaire avec ces informations.\r\
\r\
Bonne route avec Waze ! 🙂\r\
" + URCommentCustomSignature,
    "Open",

// 12 (36)
    "Sortie manquante",
    "Bonjour, \r\
\r\
Merci pour votre signalement. \r\
\r\
Vous avez signalé une sortie manquante, pourriez-vous développer plus précisément le problème que vous avez rencontré afin que les modifications nécessaires puissent être apportées ?\r\
\r\
N’hésitez pas à vous aider de la carte afin d’énoncer le plus clairement possible le problème rencontré : https://www.waze.com/fr/livemap (nom des rues, bretelles, etc.)\r\
\r\
Merci pour votre contribution à l’amélioration de la carte.\r\
\r\
Bonne route avec Waze ! 🙂\r\
\r\
" + URCommentCustomSignature,
   "Open",

// 13 (39)
    "Fermeture temporaire de la route",
    "Bonjour, \r\
\r\
Merci pour votre signalement. \r\
\r\
Savez-vous combien de temps la route va être fermée ? Pour les fermetures qui ne durent que quelques heures, veuillez utiliser la fonctionnalité Rapport > Fermeture intégrée à l'application Waze. Si cette fermeture est à long terme, veuillez nous en informer le plus possible.\r\
\r\
Bonne route avec Waze ! 🙂\r\
" + URCommentCustomSignature,
    "Open",

// 14 (42)
    "Erreur générale",
    "Bonjour, \r\
\r\
Merci pour votre signalement. \r\
\r\
Vous avez signalé une erreur générale, pourriez-vous développer plus précisément le problème que vous avez rencontré afin que les modifications nécessaires puissent être apportées ?\r\
\r\
N’hésitez pas à vous aider de la carte afin d’énoncer le plus clairement possible le problème rencontré : https://www.waze.com/fr/livemap (noms de rue, estimation de la durée des travaux, etc.)\r\
\r\
Merci pour votre contribution à l’amélioration de la carte.\r\
\r\
Bonne route avec Waze ! 🙂\r\
\r\
" + URCommentCustomSignature,
    "Open",

// 15 (45)
    "Le problème semble corrigé !",
    "Bonjour, \r\
\r\
Le problème semble à présent corrigé. Veuillez nous faire savoir si vous continuez à rencontrer le même problème. Sans nouvelle de votre part dans quelques jours, cette demande de mise à jour (UR – Update request) sera fermée.\r\
\r\
Bonne route avec Waze ! 🙂\r\
" + URCommentCustomSignature,
    "Open",

// 16 (48)
    "Rappel.",
    "Bonjour,\r\
\r\
PETIT RAPPEL : sans réponse de votre part, nous nous verrons contraints de clôturer ce problème sans avoir pu effectuer les corrections nécessaires ; ce qui serait fort dommage !\r\
\r\
Si d’aventure, ce signalement avait été la conséquence d’une fausse manœuvre de votre part ou que vous ne vous souvenez plus précisement du problème rencontré, veuillez juste nous le signaler ici même afin que nous puissions fermer cette boîte de discussion. La communauté ne vous en voudra pas ! 😉\r\
\r\
Merci pour votre collaboration.\r\
\r\
Bonne route avec Waze ! 🙂\r\
" + URCommentCustomSignature,
    "Open",


// 17 (51)
    "Deuxième rappel",
    "Bonjour, \r\
\r\
Pour votre information, sachez que le fait de signaler une « Erreur carte » via l’application alerte tous les éditeurs qui travaillent bénévolement pour vous offrir une application la plus performante qui soit.\r\
Sachez qu'en postant un signalement, un avertissement s’affiche sur le Waze Map Editor (WME) avec une faible précision géographique. L’erreur peut parfois être flagrante et corrigée grâce au commentaire laissé par le rapporteur mais la plupart du temps cette demande de mise à jour (UR - Update Request) requiert votre collaboration pour apporter davantage de précisions quant au problème rencontré.\r\
Sans commentaire posté ni réponse de votre part aux messages envoyés, il est souvent impossible de corriger la carte afin que les autres utilisateurs puissent ne plus rencontrer le même problème. Par conséquent, votre intervention restera vaine et n’aura eu que comme conséquence de nous avoir fait perdre notre temps.\r\
Cordialement,\r\
" + URCommentCustomSignature,
    "Open",


// 18 (54)
    "<br>",
    "",
    "",

// 19 (57)
    "Messages pour clôturer un UR fermé",
    "#Title",
    "Open",

// 20 (60)
    "Cloture sans réponses.",
    "Bonjour, \r\
\r\
N'ayant pas de réponse de votre part, nous allons clôturer cette demande.\r\
\r\
A l'avenir, n’hésitez jamais à nous communiquer vos remarques et tous les problèmes que vous pourriez rencontrer sur vos trajets mais rappelez-vous que sans participation ni échange, il est souvent impossible de corriger l'erreur signalée :\r\
\r\
    - Route barrée (travaux) ;\r\
    - Mauvaise signalisation de limitation de vitesse ;\r\
    - Changement de sens de circulation ;\r\
    - Interdiction de tourner ;\r\
    - Route manquante ;\r\
    - Etc.\r\
\r\
Ensemble, tentons continuellement de rendre l’application toujours plus agréable et la plus fonctionnelle possible !\r\
\r\
Bonne route avec Waze ! 🙂\r\
\r\
\r\
" + URCommentCustomSignature,
    "NotIdentified",

// 21 (63)
    "Problème de l’application",
    "Bonjour, \r\
\r\
Merci pour votre signalement. \r\
\r\
Malheureusement, dans cette situation, il n'y a aucune correction de carte que nous pouvons ajuster pour éviter ces problèmes avec l'application. Veuillez le signaler au support : https://support.google.com/waze/answer/6276841 \r\
\r\
Bonne route avec Waze ! 🙂\r\
\r\
\r\
" + URCommentCustomSignature,
    "NotIdentified",


// 22 (66)
    "Mauvaise réception GPS",
    "Bonjour, \r\
\r\
Merci pour votre signalement. \r\
\r\
Il semble que votre GPS rencontre des problèmes de localisation. Les signaux GPS passent parfois difficilement à travers certains véhicules ou au cœur de bâtiments. Assurez-vous que votre appareil se trouve dans un endroit dégagé avec vue sur le ciel. \r\
\r\
Bonne route avec Waze ! 🙂\r\
\r\
\r\
" + URCommentCustomSignature,
    "NotIdentified",


// 23 (69)
    "Route correcte",
    "Bonjour, \r\
\r\
Merci pour votre signalement. \r\
\r\
Nous avons examiné votre problème et nous n'avons trouvé aucune erreur de carte. Il semble que Waze vous ait proposé un itinéraire correct. Si vous pensez que le vôtre est meilleur, continuez à l’emprunter. Si c'est en effet plus rapide, Waze apprendra de votre expérience et guidera à l’avenir les autres utilisateurs sur ce chemin plus rapide. Merci ! \r\
\r\
Bonne route avec Waze ! 🙂\r\
\r\
\r\
" + URCommentCustomSignature,
    "NotIdentified",


// 24 (72)
    "Virage à gauche autorisé",
    "Bonjour, \r\
\r\
Merci pour votre signalement. \r\
\r\
Si vous attendez et dessinez le virage à gauche, il se peut que ce soit plus rapide que l'alternative. Si ce n'est pas plus rapide, votre temps d'attente contribuera à la base de données de Waze en décourageant le serveur de routage de suggérer des virages à gauche. Nous suggérons également que si vous ne vous sentez pas à l'aise de faire de tels virages à gauche, vous pouvez toujours emprunter une autre route et laisser Waze recalculer le trajet. \r\
\r\
Bonne route avec Waze ! 🙂\r\
\r\
\r\
" + URCommentCustomSignature,
    "NotIdentified",


// 25 (75)
    "Virage à gauche autorisé (2)",
    "Bonjour, \r\
\r\
Merci pour votre signalement. \r\
\r\
Nous ne pouvons pas désactiver les virages officiels uniquement parce qu'ils sont difficiles. Si vous attendez et dessinez le virage à gauche, cela peut être plus rapide que l'alternative. Si ce n'est pas plus rapide, votre temps d'attente contribuera à la base de données de Waze, décourageant ainsi le serveur de routage de suggérer des virages à gauche à cette intersection. Nous suggérons également que si vous ne vous sentez pas à l'aise de faire de tels virages à gauche, vous pouvez toujours emprunter une autre route et laisser Waze recalculer le trajet. \r\
\r\
Bonne route avec Waze ! 🙂\r\
\r\
\r\
" + URCommentCustomSignature,
    "NotIdentified",


// 26 (78)
    "Itinéraire correct mais difficile",
    "Bonjour, \r\
\r\
Merci pour votre signalement. \r\
\r\
Nous ne désactivons pas les routes officielles uniquement parce qu'elles sont difficiles. Si vous essayez l'itinéraire, il peut être plus rapide que l'alternatif. Si ce n'est pas plus rapide, le temps d'attente contribuera à la base de données de Waze ; ce qui aidera le serveur de routage à ne plus suggérer cet itinéraire. Nous suggérons également que si vous ne vous sentez pas à l'aise, vous pouvez toujours emprunter une autre route et laisser Waze recalculer. \r\
\r\
Bonne route avec Waze ! 🙂\r\
\r\
\r\
" + URCommentCustomSignature,
    "NotIdentified",


// 27 (81)
    "POI manquant.",
    "Bonjour, \r\
\r\
Merci d'avoir signalé un lieu (POI) manquant. A chaque fois que vous trouvez un endroit manquant dans l'application Waze, vous pouvez l'ajouter à partir de l'application en appuyant sur l'icône (lieu). Après avoir pris une photo de l'endroit, veuillez s'il vous plaît ajouter autant de détails que vous le pouvez. \r\
\r\
Bonne route avec Waze ! 🙂\r\
\r\
\r\
" + URCommentCustomSignature,
    "NotIdentified",


// 28 (84)
    "Détours et mauvais guidage",
    "Bonjour, \r\
\r\
Merci pour votre signalement. \r\
\r\
Nous ne trouvons aucune erreur sur la carte pour expliquer l’itinéraire que Waze vous a proposé.\r\
\r\
Ceci étant, il arrive parfois que Waze vous guide vers des déviations complexes uniquement pour vous faire gagner quelques secondes. Nous sommes désolés de vous annoncer que les éditeurs de carte bénévoles sont impuissants pour corriger cette situation. \r\
\r\
Bonne route avec Waze ! 🙂\r\
\r\
\r\
" + URCommentCustomSignature,
    "NotIdentified",


// 29 (87)
    "Plainte globale Waze",
    "Bonjour, \r\
\r\
Merci pour votre signalement. \r\
\r\
Vous pouvez aider à améliorer la carte de Waze en signalant les problèmes que vous rencontrez. Veuillez communiquer le plus de détails possible. \r\
\r\
Bonne route avec Waze ! 🙂\r\
\r\
\r\
" + URCommentCustomSignature,
    "NotIdentified",


// 30 (90)
    "Rapport à la communauté locale",
    "Bonjour, \r\
\r\
Merci pour votre signalement. \r\
\r\
Nous ne pouvons vous aider que pour résoudre des problèmes de carte communiqués à la communauté d’éditeurs locaux. N’hésitez jamais à nous signaler tout problème de carte que vous pourriez rencontrer. \r\
\r\
Bonne route avec Waze ! 🙂\r\
\r\
\r\
" + URCommentCustomSignature,
    "NotIdentified",


// 31 (93)
    "Eviter les routes à péage",
    "Bonjour, \r\
\r\
Merci pour votre signalement. \r\
\r\
Waze vous permet toujours de vous rendre à votre destination le plus rapidement possible. Ceci étant, vous souhaitez peut-être ne pas payer pour gagner ce temps ? Si vous préférez ne pas utiliser les tronçons à péage, veuillez paramétrer votre application afin de les éviter.\r\
(Cliquez sur la loupe en bas à gauche de votre application puis sur le petit engrenage en haut à gauche et ensuite cochez - Eviter les routes à péage – \r\
\r\
Bonne route avec Waze ! 🙂\r\
\r\
\r\
" + URCommentCustomSignature,
    "NotIdentified",


// 32 (96)
    "Demi-tours",
    "Bonjour, \r\
\r\
Merci pour votre signalement. \r\
\r\
Actuellement, Waze ne vous dira jamais de faire demi-tour. Il vous guidera afin de faire une boucle et revenir sur vos pas. Cette lacune est issue d’un problème de programmation qui ne peut pas être résolu par les éditeurs bénévoles. Waze travaille actuellement pour trouver une solution, merci pour votre compréhension. \r\
\r\
Bonne route avec Waze ! 🙂\r\
\r\
\r\
" + URCommentCustomSignature,
    "NotIdentified",


// 33 (99)
    "Trafic - Informations périmées",
    "Bonjour, \r\
\r\
Merci pour votre signalement. \r\
\r\
Waze s'appuie sur les données (vitesse moyenne sur chaque tronçon de route) des utilisateurs comme vous pour évaluer la fluidité du trafic. Les éditeurs de cartes ne peuvent pas supprimer ce signalement d’embouteillages affiché dans l'application. Dès que Waze détecte un embouteillage, celui-ci reste actif jusqu'à ce que suffisamment d'utilisateurs l'aient exclu de la carte ou que ceux-ci se déplacent sur la voie à une vitesse normale. Vous pouvez participer à la suppression de ces rapports d'embouteillage en appuyant sur \"l'icône de localisation rouge barrée\" dans l'application lorsque l’avertissement apparait. \r\
\r\
Bonne route avec Waze ! 🙂\r\
\r\
\r\
" + URCommentCustomSignature,
    "NotIdentified",


// 34 (102)
    "Bouchons",
    "Bonjour, \r\
\r\
Merci pour votre signalement. \r\
\r\
Pour signaler un embouteillage, veuillez utiliser l'application en cliquant sur le bouton orange situé en bas à droite de l’écran puis en cliquant sur (Circulation). Les rapports sur les embouteillages peuvent vous aider à contourner les problèmes de circulation en temps réel. \r\
\r\
Bonne route avec Waze ! 🙂\r\
\r\
\r\
" + URCommentCustomSignature,
    "NotIdentified",


// 35 (105)
    "Déviation erronée",
    "Bonjour, \r\
\r\
Merci pour votre signalement. \r\
\r\
Il n'y a aucun problème avec ces restrictions de virage sur ce tronçon. Les développeurs de Waze travaillent en ce moment pour trouver une solution au problème. Nous n'avons pas encore d’information à ce sujet. N'hésitez pas à utiliser cet itinéraire jusqu'à ce que le problème soit résolu. Merci ! \r\
\r\
Bonne route avec Waze ! 🙂\r\
\r\
\r\
" + URCommentCustomSignature,
    "NotIdentified",


// 36 (108)
    "Restriction déjà corrigée",
    "Bonjour, \r\
\r\
Merci pour votre signalement. \r\
\r\
Cette restriction est déjà corrigée sur la carte. A l’avenir, Waze ne devrait plus vous y faire passer. Si Waze continue à vous proposer cet itinéraire interdit, veuillez nous envoyer un autre rapport. Merci ! \r\
\r\
Bonne route avec Waze ! 🙂\r\
\r\
\r\
" + URCommentCustomSignature,
    "NotIdentified",


// 37 (112)
    "Limite de 500 Km",
    "Bonjour, \r\
\r\
Les capacités de recherche et de navigation de Waze sont limitées à plus ou moins 500 Km. Pour vous rendre vers une destination plus éloignée, veuillez diviser votre trajet en plusieurs étapes. \r\
\r\
Bonne route avec Waze ! 🙂\r\
\r\
\r\
" + URCommentCustomSignature,
    "NotIdentified",


// 38 (114)
    "Blocage temporaire de la route.",
    "Bonjour, \r\
\r\
Merci pour votre signalement. \r\
\r\
Si une route est complètement bloquée à la circulation (pour cause de travaux ou de festivités par exemple), cliquez sur le bouton orange (en bas à droite) de l’application puis sur (fermeture) pour aider les autres utilisateurs à contourner le problème. Si cette route est seulement ralentie, veuillez cliquer sur le bouton (circulation) afin de communiquer à Waze que cette route est plus lente qu’à l’accoutumée pour qu’un itinéraire plus rapide puisse être proposé. \r\
\r\
Bonne route avec Waze ! 🙂\r\
\r\
\r\
" + URCommentCustomSignature,
    "NotIdentified",

// 39 (117)
    "Suppression de fermeture",
    "Bonjour, \r\
\r\
Merci pour votre signalement. \r\
\r\
Pour les fermetures à long terme, nous pouvons supprimer les anciennes afin de nous concentrer sur les plus récentes. Par contre, pour les fermetures qui ne durent que quelques heures voire quelques jours, les éditeurs bénévoles ne peuvent pas vous aider. Si vous rencontrez des fermetures de route à court terme dans le futur, merci d'utiliser la fonction de fermeture intégrée à l’application ! \r\
\r\
Bonne route avec Waze ! 🙂\r\
\r\
\r\
" + URCommentCustomSignature,
    "NotIdentified",


// 40 (120)
    "Merci pour votre réponse",
    "Bonjour, \r\
\r\
Merci pour votre réponse ! La demande de mise à jour (UR – Update Request) va être fermée. Lors de vos trajets, veuillez ne pas hésiter à signaler tous les problèmes de carte que vous pourriez rencontrer. \r\
\r\
Bonne route avec Waze ! 🙂\r\
\r\
\r\
" + URCommentCustomSignature,
    "NotIdentified",


// 41 (123)
    "Zone non modifiable",
    "Bonjour, \r\
\r\
Merci pour votre signalement. \r\
\r\
Cette zone n'est pas modifiable par les éditeurs bénévoles, n'hésitez pas à la signaler à l'adresse https://support.google.com/waze/ \r\
\r\
Bonne route avec Waze ! 🙂\r\
\r\
\r\
" + URCommentCustomSignature,
    "NotIdentified",


// 42 (126)
    "Effacer le cache TTS",
    "Bonjour, \r\
\r\
Merci pour votre signalement. \r\
\r\
Veuillez effacer votre cache Text-to-Speech (TTS). Dans la zone de recherche de navigation de l’application, veuillez taper (cc@tts) dans le champ de recherche et appuyez ensuite sur (Recherche). Vous recevrez alors un message indiquant que le fichier TTS a été effacé. \r\
\r\
Bonne route avec Waze ! 🙂\r\
\r\
\r\
" + URCommentCustomSignature,
    "NotIdentified",


// 43 (129)
    "Signalement de radar",
    "Bonjour, \r\
\r\
Merci pour votre signalement. \r\
\r\
Les radars pédagogiques peuvent être signalés depuis l'application. Veuillez placer votre signalement à l’endroit exact où se trouve le radar. \r\
\r\
Bonne route avec Waze ! 🙂\r\
\r\
\r\
" + URCommentCustomSignature,
    "NotIdentified",


// Space 44 (132)
    "Mauvaise limitation de vitesse, Desactive",
    "Bonjour, \r\
\r\
Merci pour votre signalement. \r\
\r\
Les signalements de limitation de vitesse ont rencontré des soucis jusqu'à présent. De ce fait, nous ne pouvons utiliser les informations disponibles correctement. \r\
\r\
Nous allons ignorer ce signalement, mais n'hésitez pas à nous signaler d'autres modifications de vitesse ultérieurement.\r\
\r\
Seules les modifications permanentes peuvent être prises en compte ; les modifications liées à des travaux ou événements ne peuvent être appliquées sur la carte.\r\
\r\
Bonne route avec Waze ! 🙂\r\
\r\
" + URCommentCustomSignature,
    "NotIdentified",


// Space 45 (135)
    "<br>",
    "",
    "",


// base (xx)
    "<br>",
    "",
    "",


// last
    "<br>",
    "",
    ""
// Les messages non traduits sont déplacés dans le fichier atraduire.txt
];
//end Custom list
