// ==UserScript==
// @name         WME UR responses types
// @description  Add a dropdown list of answers in addition to the UR conversation panel
// @version      2025.12.09.01
// @include      https://www.waze.com/*editor*
// @include      https://beta.waze.com/*editor*
// @exclude      https://www.waze.com/user*
// @exclude      https://www.waze.com/*/user*
// @namespace    https://greasyfork.org/scripts/23274-wme-ur-responses-types
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAtCAYAAAApzaJuAAAABGdBTUEAALGPC/xhBQAAAAZiS0dE AP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB98BCgk4GHZD0qwAAAAdaVRY dENvbW1lbnQAAAAAAENyZWF0ZWQgd2l0aCBHSU1QZC5lBwAAC9RJREFUWMOtmXtwU9edx7/n3Ht1 fSXLlrEtY9W2FOMHOGAbG2PslmBCqBuSttlNs2NItkMytJkwm2x2mvxRdjZO0mlp0hm3ISGFLGQ7 DekwMEnKdtY7CaHIhpbwMATiB8TG+CFbtiVLtmVJvo9z7v6RwJL4gZ3xb+bMnDm636OPfr9zfud3 rggW2WpqakRd1xVCSAqA9IyMDNemTZuKnE5nBuec+v3+8MmTJ6+Pjo4GTNMMAgiYphmWJCnu9XoN ACCLCVReXi5ZLBY7IcS1Y8eOezdv3rzN5XKVUUql259jjBm9vb1tH3zwwf8cO3bs74yxXtM0BzVN i7S0tOhkMT0Ui8WSc3Nz83bv3l3v8Xi+F9MM8tnQKK4HxzE+pQEAkhMsWJaajFWZqbBaRLO1tfXM rl279o2NjbWpqtprtVrHFwuKVlZWJhYUFBS89tprBx2OlOK/9/hxotOHKYPNKEgQBWzKz0K1JxOD gwPXd+7c+YtAIHCRc94rLAZRXl6eJTU11blv377fpaWlVb93pRvN3YMwuDmrxuAmOoPjGIurqMzL WVJWVpbd2Nh4xWKxTCwKVHFxsb2+vv7hVatWPe29Poi/9fjnrfVHYhAoxZqCu1ymaQYuXbrUTRcD SlVVW3l5+U/G4ipOdg0sWH+yy4exuIotW7Z83zRN56JAbdu2zWO324tbfAEYnC9Yb3ATLb4Ali5d 6ikpKXEvClR1dXUpANIVHP/KeKHTgUKnY87+TesMjgEAueeeewoWBcrhcKQDwHhc/cp4XWk+6krz 5+zftLH4FykjLS0tRVwMKNM0GQB8fbMd/rQTMOfu3zSB3MpOxqJAxWKxfgBItSVgQtVujV8bGbtj /6YtscoAgGAw6P86FAFAysvLBV3XLTabTQagEEISCCEJnHMLpVSglFL+hTFKqfbWW28N7tmzh+Wn Jws3QhPf6IcVpDvAOecnTpz49HYoUlNTI6iqKgFQFEVJ5JwnVVVVZdfV1W3OyclZY7fbl8mynEYp tXDONVVVg5FI5Hpra+uV4eHh1opsZ0nT9UGos2Tx2SxBFLAm24nh4eFL7e3t3TehSHl5uajreoKm aYmSJDlqa2sLt2/f/qTL5bqPUirGtSh6RtsRnPRD1acgSwmWtMRMlyd1uWv9+vXrJycnmSIK5gMr 3OT9z7oXBPVgkQcJosAbGxvfppSOiDeBRFFUBEFItlqt6a+++upjFRUVTxFKEi72NqPp2p9xbegS uDk9B1FCUZBRinXuLUKxWIU12U6MT2k40embF9B3C7JRlpWOjo6OowcOHDgZiUTC5Pb6x2q1Zu7f v/8Fj8ezpS/UiT+c/jV6R6/NcwcC30rMxzObf430lAy0D4fw3pVuxHVjxudTrQl4sMiNQmcKfD7f h48//vjzwWCwPz8/P0KKi4ttNpvNQSnNPHTo0Msej+f+T65/hLdP7YbBtIWlBmYCmgU/q/0t7s5b jWNt3TjXN3Lr8+VOBzKTbLhrSRKWpSaBcz7V0dHx1lNPPbU3Ho8P5+bmTh49epSJiYmJNsZYakND w489Hs/9Z7o+xH82vQzTNBe8g7hpwtBVBKIDYLwE7UNhAIBdlvDQylwsz0gBAcx4PO7z+XwfHT58 +J3GxsZr8Xh8oqWlRW1paWEAIJqmmVRbW3t3RUXFT3uDn+Ng86/Av8H5BQAmBwpdJdhQvAXtw2Fk OxJR4HSg1JUGkcA4+8knBw4dOvSny5cv92qaFmWMxe12u/YlzC0viLIsO5544okdhBL5YNMvoeuz h6zU/W1sXPEPKMwshSwpCEYGcannNBqvvIuxaBAwgS1rtoFSipWZqViZmQrOOUZGRkb37t37y+PH j58cHx/vt9lsEy0tLQam5fUvocrKyu7Kzs7ecL77r+gJzLyoRUHCk/e+iMplm74y7kzKQm1xHb5T +ABeP/5ztPVdwO8/egF5zmJYJTvGY2FU5t6H1Z7vOEKh0CilNJ6UlKSfO3eOzwYEAPThhx++j1Iq /LXtfZimOWOrW/f0NKDbzSbb8a/ffQVpSUuhIY72kbO4MPAxOsMtuDj0MZxOp/Doo49+WxRFGYBU U1MzZxlO3W736pg6iY6BizMCJYhWbCx66I7rSbHY8EDpY9P0HQMXEVMn4Xa7VzPGbLIsW3w+35wV L3U4HJ4bgQ4wxmByc1rLSc2HJFjmtdBXuMqn6RljuBHogMPh8EiSlMAYs6Snp89ZMlFFURyBCf+s oVuSmDHv3ScK0oxzBCb8UBTFwTm3ABDtdvucUCKlVFL1OPgseSl/afG8oXqDn884j6rHQSmVOOdU FEWqadqca0pkjOmypEjm1yo0SbDg5w+9jqKsNfOG+vDTIzBnuFbJkgLGmA4AlNI7ZmUajUZDGclZ 01yuGSpabpyCifll9j+fexuf9Z2dMXwZyVmIRqMhQRCYYRjcYrHMOSkdHR3tyXWugEinr4e/XPgj dv3pn9HmuzAn0JEz+/Du6T0zAolUQq5zBUKh0A3OuQbAiEQicx4Z9Nq1a5/KkoISdzVMjmmty9+G w6f3gpscBtPxq/f+Bc//sQ6/OfYzMM7AOMPF7tMzak0OlLirIEsKrl69ehlAnBCiBwKBOaHI1q1b H3vnnXcOtPafl18++uSsD7pS3NCZhsDE/99+M5K/BUIohsb6Z9W98Mg+3J1VoW7fvn1Hd3f3ZQAD sixP3HztM6OnfD6fv7W11VviWYdi97pZU8NAqAcj44NfGRsa88Ef7ptVU+xehxJPFdra2rx9fX1+ QRCisixrXq937vABCDc0NBxRVTWys7YeiXLSrF+ykJYoJ2FnbT1UVY00NDQcARDWdT3q8/n0uc49 ABBycnKUUChkWq3W+LqK6spCVwk51f6/YMz4QvoNmkWQ8e8/egNuZ6F5+PDhfcePH/8EwDCldPzy 5csqgDk9JaSnpwuiKJLz58+Hli1bJq8tqS5a6V6LC11NmNJiC78t21LxH//0exRll6Opqen9V155 5T1CyMDU1FRodHQ0HgqFjDvNIbhcLiiKwhljZlNTU192djZdW1K9omblD8hoZAR9I53zylUEBOuL 7seuH72OrNRcfuLEiaMvvvjiu6Zp9lssloCmaZNtbW3anUIHAEJhYaEJgBuGwQRBMLxe742pqamh 1cVlyzeWPKhULd8MQgiGwv1QtalpoZKoBd8rr8PTD/4CW9ZshaGy0MGDB9984403/ptS6mOMBURR jMiyrPb09MyrpCU3L6EAEhhjdsMw0gRByFiyZEnOM8888/3KysqNiYmJyV3+Njz/dh30L06LW/aT 2l34YeWPEYlEJs6ePXtyz549fwmHw72MsWFRFIOCIEQATHm9XjYfLwGAAAA9PT2mx+Ph0WjUkGVZ 03Vd1TRtsrm5ufPIkSPnli5dKqwtrcqTJQUXr//tlnhtQQ1+WrsLXV1d7Vu3bn3V6/U2x2KxG4Zh +CVJCsZisYgsy+pCgG5B3QTz+/08NzfXiEajGiFENU1zyjRNtbm52bdhw4a8qlUbnZ8PfIaB0R6k 2p14+dEDMDQ+9txzz/02HA5/zjn36bo+rGla2Gq1xs6cOaN9GbIFXY3obWEEAEQiEaYoimoYRoRSOso5H+KcD9TX1x+IRqPj//bQbqQmOvHcP/4GdsXB9+/f/199fX1dpmn6GWNBXdcjiqKotx0lZKHv6wUA5JFHHqGapklZWVkWWZYthBBZFEULY0wkhIiCIEjhcJhGo9HxjRs2ld9b+kPicRbA6/Uef/PNNz/+8p+DCKVUp5SCcy6kpaUJmZmZYlZWFk1OTiaBQGD+4aupqRGHh4dlm81mkyTJTilNNk0zSRTFZEppkiiKdkKIDYD16tWrqsfjUYoK7/b09/f3PPvss0c555OEEI0QQgHIoigqlFIrY0xhjMmMMVEQBJSWlppdXV3zCqUgiqKUlJRklSTJQQhJEUUxRRCEFM55CgAH5zwZQBJjLItz7jx16lRk9erVGS+99NLpYDAIADIhBJRSkVJqI4Qkcs5tnHOFUmqRZVkQBIGrqsqcTif3+/13hPo/njSSFg6nnB8AAAAASUVORK5CYII=
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      wme-response-type.brume.org
// @connect      icons8.com
// @author       Myriades (AFK) & seb-d59 (interim :D) & MatthieuF44
// @copyright    2014-2024 Myriades & seb-d59 & MatthieuF44


// @downloadURL https://update.greasyfork.org/scripts/23274/WME%20UR%20responses%20types.user.js
// @updateURL https://update.greasyfork.org/scripts/23274/WME%20UR%20responses%20types.meta.js
// ==/UserScript==

/***	Remerciements : DummyD2, seb-d59, Yopinet et tous les testeurs :)	***/

//log("Démarrage en cours, version : " + GM_info.script.version);

var wmeSDK;

function startInitialization() {
    if (unsafeWindow.top.UR2T_Started) return;
    unsafeWindow.top.UR2T_Started = true;
    log("Démarrage en cours, version : " + GM_info.script.version);

    if (typeof unsafeWindow.SDK_INITIALIZED !== 'undefined') {
        unsafeWindow.SDK_INITIALIZED.then(() => {
            wmeSDK = getWmeSdk({ scriptId: "WME-UR2T", scriptName: GM_info.script.name });
            wmeSDK.Events.once({ eventName: "wme-ready" }).then(UR2T_init);
        }).catch(console.error);
    } else {
        const checkSDK = setInterval(() => {
            if (typeof unsafeWindow.SDK_INITIALIZED !== 'undefined') {
                clearInterval(checkSDK);
                unsafeWindow.SDK_INITIALIZED.then(() => {
                    wmeSDK = getWmeSdk({ scriptId: "WME-UR2T", scriptName: GM_info.script.name });
                    wmeSDK.Events.once({ eventName: "wme-ready" }).then(UR2T_init);
                });
            }
        }, 100);
    }
}

startInitialization();



var icon_export = "iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wgBFAggT+iJkgAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAADUklEQVR42u2dTWsTURSGn5lOrEoJVYsff0AqUhHEreBW40IR/FiJKze6cV2NuhFdiFgQXLgQf0ARXIk7t3UhLYp/QBTFEksbmibjYk4kxHSMucn96JwXhtAmTU6fOfecc++cuYmwoxIQ459aQMPkDSILRk4CN4EZDwEuAQ+BZTxVCbgH/ACaHh4/gUdykr3UODAvxqaeHkYQY1STwBXg9iAQEwcG14AFYMXBZ1c2ifttiAB3/icmugC4AFwWI1OLoeRlF7waUDaF6ALgihhXd1CydOo5cNUUoqsYmDr63E6I0wKxZhITi5xEGsB9U4hFz8LLMlQHhqhljCFEBWgIUQEaQlSAhhAVoCHEpMCgJoBdspjQrTUpccgptleBapEBHpPpXd6cvJQzYzkMxEUGWAZO9vG6U3klYJEBDpIDWt1/U5Qk0iJbvq8N+42L4oENsmsfMNi1mRjYAM4UFWC7PKkOOOrGgRdF9sBOT3QaRFUKUAEqQAWoUoAKUAH2rW3ADux0km05gBGwBzgnj5ECHGwadR64AUz5BjEEgBGwl2xR87pvEENJIjFwwEeIIWVhLyGOejVmA7jI8DqxOiECPAG+465ZaeQA273Io/JE5xCTnMA9JsZGjkfIPmB7DsQImAO+uYDYC+AYWe9cBTgC7HQIMQH2AwdzPPGaQL4FfLUNMenhedPAXeAE2fVP14km/sdzU8AF+XnWticmPbyvIvCmAsrQZeCseOBjiYlOzm4sw2UiwHn9buAScBqL13q6AbaAz7i5BcFU68Ai8H4Emb9vgE3gNfBOhsFGIPDqwBuJ3R9dxsBUDJjtysKuEsmYZNhDYkcevCrwwfZJTzYpfpeAT/IPuJ4pzQBPgaO+wcsrpFMxxvUQXpfMWvcRXmiLCd7BswGw1+2ur+T3wcML0QO9gmdjNWaYWgXe+gQvJIBrHXWeN/BCAdiUwn7eN3ghAEzJGiOfAV9sTtG2kgf+kiP10bgQAKY+G6e9MQpQASpABahSgApQASpAlQJUgApQAaoUoAIMSC7WA/M2vPFVk2zSseYCYD8b3vimCeB4rxHrAmC/G94EEe4Sn4zRJPK3RrbhjWPVyJo5W6P2QNMNb3zVIvAAaNi6faHE1iqZ/nyNxm/UEhZ+/DhJcwAAAABJRU5ErkJggg==";
var UR2T = {};
var Defaut_UR2T = {};

var wazeRequires = {};
var debug = false;
Defaut_UR2T.UR_Selected = false;
Defaut_UR2T.oldVer = '';
Defaut_UR2T.lastSave = '';
Defaut_UR2T.userSign = '';
Defaut_UR2T.scriptVer = GM_info.script.version;
Defaut_UR2T.GUI = { 'defaultLeft': 350, 'defaultTop': null, 'left': 350, 'top': null };
Defaut_UR2T.autoFilling = { 'active': false, 'delay1': 3, 'delay2': 4 };
Defaut_UR2T.answers = {};

//Defaut_UR2T.answers.UR = {};

Defaut_UR2T.answers.UR = {
    'outils': {
        'name': 'Outils',
        'objects': {
            0: { 'question': 'Éffacer la zone de texte', 'answer': '', 'isPerso': false },
            1: { 'question': 'Insérer ma signature', 'answer': 'UR2T_insertSign', 'isPerso': false },
            2: { 'question': 'Éditer ma signature', 'answer': 'UR2T_EditSigns', 'isPerso': false },
            3: { 'question': 'Éditer les réponses', 'answer': 'UR2T_EditResponses', 'isPerso': false },
            4: { 'question': 'Nouvelle réponse', 'answer': 'UR2T_AddResponses', 'isPerso': false },
            5: { 'question': 'Supprimer réponse', 'answer': 'UR2T_DelResponses', 'isPerso': false },
            6: { 'question': 'Import / export - local', 'answer': 'UR2T_importExport_local', 'isPerso': false },
            7: { 'question': 'Import / export - serveur', 'answer': 'UR2T_importExport_serveur', 'isPerso': false },
            8: { 'question': 'Reset des variables locales', 'answer': 'UR2T_resetLocalValue', 'isPerso': false },
            9: { 'question': 'Réglage de l\'autofilling', 'answer': 'UR2T_autofilling_settings', 'isPerso': false },
            10: { 'question': 'À propos', 'answer': 'UR2T_apropos', 'isPerso': false }
        }
    },
    'divers': {
        'name': 'Divers',
        'objects': {
            0: {
                'question': 'Décrochage GPS (général)',
                'answer': 'Bonjour,\nil semble que vous ayez eu un problème de décrochage GPS. Vous pouvez améliorer les performances GPS de votre mobile en vous rendant sur "Paramètres", "Localisation" et en désactivant "Service de localisation" et "Localisation et recherche". Je clôture donc cette demande. Merci pour votre contribution à l\'amélioration de Waze.',
                'isPerso': false
            },
            1: {
                'question': 'Mise à jour sur mobile',
                'answer': 'Bonjour,\nla carte sur votre mobile ne doit plus être à jour.\nJe vous suggère de forcer la mise à jour sur Waze dans "Paramètres -> Général -> Actualiser la carte de ma zone".\nMerci pour votre contribution à l\'amélioration de Waze.',
                'isPerso': false
            },
            2: {
                'question': 'Mise à jour POI',
                'answer': 'Bonjour,\nNous vous invitons à créer l\'établissement par le biais de l\'application mobile (Onglet signalement --> Lieu).\nEn procédant ainsi, vous pourrez enrichir le profil de l\'établissement avec des informations précises que vous êtes le mieux placé pour fournir.\nDe plus, cette action permettra d\'activer sa création et son apparition sur la carte.\nNous vous remercions par avance pour votre contribution.',
                'isPerso': false
            },
            3: {
                'question': 'Relance (après 3 ou 4 jours)',
                'answer': 'Bonjour,\ntoujours pas d\'informations supplémentaires?\nPour info, après 7 jours sans réponses, les demandes sont considérées comme sans objet et clôturées.\nCordialement.',
                'isPerso': false
            },
            4: {
                'question': 'UR Résolu',
                'answer': 'Bonjour,\nle problème est corrigé et la modification sera effective sur votre mobile d\'ici quelques jours.\nVous pourrez si nécessaire forcer la mise à jour sur Waze dans "Paramètres -> Général -> Actualiser la carte de ma zone".\nMerci pour votre contribution à l\'amélioration de Waze.', 'special': 'ur_solved',
                'isPerso': false
            },
            5: {
                'question': 'UR sans réponse après une relance',
                'answer': 'Bonjour,\nNous n\'avons plus de vos nouvelles pour cette demande de mise à jour depuis plus de 7 jours. Nous considérons donc ce problème comme abandonné.\nCette demande de mise à jour est close, merci d\'en faire une nouvelle si nécessaire.\nA bientôt sur Waze', 'special': 'ur_unsolved',
                'isPerso': false
            }
        }
    },
    6: {
        'name': 'Guidage incorrecte',
        'objects': {
            0: {
                'question': 'Guidage incorrect',
                'answer': 'Bonjour,\nVous nous avez fait part d\'un guidage incorrect lors de votre navigation. Pourriez-vous nous décrire les raisons qui vous ont conduit à effectuer ce signalement? Au mieux, un point de départ et une destination afin d\'essayer de reproduire les instructions d\'itinéraire? Merci d\'avance.',
                'isPerso': false
            }
        }
    },
    7: {
        'name': 'Adresse incorrecte',
        'objects': {
            0: {
                'question': 'Adresse incorrecte',
                'answer': 'Bonjour,\nVotre signalement nous est très utile ! Pour finaliser la correction de cette adresse, nous avons besoin de votre aide.\nQuelle est l\'adresse exacte qui devrait apparaître à cet endroit ?Merci pour votre contribution à l\'amélioration de Waze.',
                'isPerso': false
            }
        }
    },
    8: {
        'name': 'Itinéraire incorrect',
        'objects': {
            0: {
                'question': 'Itinéraire incorrect',
                'answer': 'Bonjour,\nVous avez signalé un itinéraire incorrect.\nSerait-il possible de préciser le problème ?\nMerci pour votre contribution à l\'amélioration de Waze.',
                'isPerso': false
            }
        }
    },
    9: {
        'name': 'Rond-point manquant',
        'objects': {
            0: {
                'question': 'Rond-point manquant',
                'answer': 'Bonjour,\nMerci pour votre signalement ! Pour mieux comprendre, pourriez-vous décrire plus précisément l\'endroit où vous avez remarqué l\'absence de rond-point ?"',
                'isPerso': false
            }
        }
    },
    10: {
        'name': 'Erreur générale',
        'objects': {
            0: {
                'question': 'Erreur générale: pas systématique',
                'answer': 'Bonjour,\nVous avez signalé une "erreur générale" sur votre parcours.\nLa carte ne faisant apparaître aucun problème dans ce secteur, pouvez-vous être plus précis?\nMerci pour votre contribution à l\'amélioration de Waze.',
                'isPerso': false
            },
            1: {
                'question': 'Ponts non affichés sur la carte',
                'answer': 'Bonjour,\nEn fonction de votre vitesse les éléments inutiles sont automatiquement masqués, donc ceci est une situation normale.\nMerci pour votre contribution à l\'amélioration de Waze.',
                'isPerso': false
            },
            2: {
                'question': 'Trajet inhabituel - carte OK',
                'answer': 'Bonjour,\nNous avons bien pris en compte votre signalement concernant l\'itinéraire proposé lors de votre trajet.\nAprès une vérification approfondie de la carte, nous n\'avons pas identifié d\'erreur à cet endroit.\nIl est possible que l\'itinéraire ait été influencé par :\n- Des ralentissements importants, des travaux ou un accident sur votre trajet\n- Une petite erreur lors de la saisie de votre destination\nDes paramètres de navigation différents de votre habitude (autoroute, péage...)\nPour optimiser votre prochaine navigation, n\'hésitez pas à vérifier et mettre à jour les paramètres de votre application, notamment en ce qui concerne la carte. Si vous rencontrez à nouveau ce problème, merci de nous en informer. Votre retour est précieux pour améliorer Waze.',
                'isPerso': false
            }
        }
    },
    11: {
        'name': 'Interdiction de tourner',
        'objects': {
            0: {
                'question': 'Interdiction / Autorisation de tourner',
                'answer': 'Bonjour,\nMerci pour votre signalement.\nPouvez-vous préciser :\n- s\'il s\'agit d\'une interdiction de tourner à établir ou à supprimer sur Waze;\n- quelle est l\'intersection concernée (nom des voies);\n- quel est le sens de l\'interdiction à traiter (exemple : interdit de tourner voie A vers voie B en tournant à gauche).\nMerci pour votre contribution à l\'amélioration de Waze.',
                'isPerso': false
            },
            1: {
                'question': 'Travaux',
                'answer': 'Bonjour,\nSi les travaux ne sont pas de nature à interdire complètement la circulation (dans un sens ou dans l\'autre) pour une période donnée, il suffit de les signaler simplement en circulant.\nPar contre, dans le cas contraire, merci de bien vouloir indiquer le tronçon concerné, l\'interdiction exacte (par exemple interdit de rue A vers rue B en tournant à gauche) et si possible la période.\nMerci pour votre contribution à l\'amélioration de Waze.',
                'isPerso': false
            }
        }
    },
    12: {
        'name': 'Carrefour incorrect',
        'objects': {
            0: {
                'question': 'Carrefour incorrect',
                'answer': 'Bonjour,\nVous avez signalé une jonction incorrecte sur votre parcours, pouvez-vous être plus précis afin que nous puissions traiter ce désagrément. Merci pour votre contribution à l\'amélioration de Waze.',
                'isPerso': false
            }
        }
    },
    13: {
        'name': 'Viaduc ou pont manquant',
        'objects': {
            0: {
                'question': 'Viaduc ou pont manquant',
                'answer': 'Bonjour,\nVous signalez "viaduc ou pont manquant".\nPouvez-vous nous donner des précisions concernant votre signalement? (lieu ou autre cause ou erreur).\nMerci pour votre contribution à l\'amélioration de Waze.',
                'isPerso': false
            }
        }
    },
    14: {
        'name': 'Mauvaise instruction de navigation',
        'objects': {
            0: {
                'question': 'Mauvaise instruction de navigation',
                'answer': 'Bonjour,\nSuite à votre signalement, pouvez-vous préciser quel tronçon de voie est à corriger.\nSi vous le pouvez, préciser également le sens de circulation et les limites.\nPar exemple : la voie A est en sens unique nord-sud entre la voie B et la voie C.\nMerci pour votre contribution à l\'amélioration de Waze.',
                'isPerso': false
            },
            1: {
                'question': 'Travaux',
                'answer': 'Bonjour,\nSi les travaux ne sont pas de nature à interdire complètement la circulation (dans un sens ou dans l\'autre) pour une période donnée, il suffit de les signaler simplement en circulant.\nPar contre, dans le cas contraire, merci de bien vouloir indiquer le tronçon concerné, l\'interdiction exacte (par exemple interdit de rue A vers rue B en tournant à gauche) et si possible la période.\nMerci pour votre contribution à l\'amélioration de Waze.',
                'isPerso': false
            }

        }
    },
    15: {
        'name': 'Sortie manquante',
        'objects': {
            0: {
                'question': 'Sortie manquante',
                'answer': 'Bonjour,\nMerci de votre signalement. Vous nous indiquez qu\'une sortie est manquante. Pouvez-vous nous donner son emplacement s\'il vous plaît ?\nMerci pour votre contribution à l\'amélioration de Waze.',
                'isPerso': false
            },
            1: {
                'question': 'Nom de rue introuvable',
                'answer': 'Bonjour,\nMerci pour votre signalement. Toutefois, pouvez-vous me dire où se trouve la rue concernée ?',
                'isPerso': false
            }

        }
    },
    16: {
        'name': 'Route manquante',
        'objects': {
            0: {
                'question': 'Route manquante',
                'answer': 'Bonjour,\nMerci de votre signalement.\nVous nous indiquez qu\'une route est manquante. Pouvez-vous nous donner son nom et son emplacement s\'il vous plaît?\n(Par exemple entre la rue A et la rue B.)\nMerci pour votre contribution à l\'amélioration de Waze.',
                'isPerso': false
            },
            1: {
                'question': 'Nom de rue introuvable',
                'answer': 'Bonjour,\nVous avez signalé un mauvais nom de rue. Notre base de données n’étant pas suffisamment à jour pour traiter cet incident, pourriez-vous nous communiquer le nom correct afin que nous puissions la mettre à jour?\nMerci pour votre contribution à l\'amélioration de Waze."',
                'isPerso': false
            },
            2: {
                'question': 'Route manquante mais présente.',
                'answer': 'Bonjour,\nvous nous signalez une route manquante sur la carte Waze. Or la route désignée à l\'emplacement est pourtant présente sur la carte.\nJe vous suggère de forcer la mise à jour sur Waze dans "Paramètres -> Général -> Actualiser la carte de ma zone".\nMerci pour votre contribution à l\'amélioration de Waze.',
                'isPerso': false
            }
        }
    },
    18: {
        'name': 'POI manquant',
        'objects': {
            0: {
                'question': 'POI manquant',
                'answer': 'Bonjour,\nNous vous invitons à créer l\'établissement par le biais de l\'application mobile (Onglet signalement --> Lieu).\nEn procédant ainsi, vous pourrez enrichir le profil de l\'établissement avec des informations précises que vous êtes le mieux placé pour fournir.\nDe plus, cette action permettra d\'activer sa création et son apparition sur la carte.\nNous vous remercions par avance pour votre contribution.',
                'isPerso': false
            },
        }
    },
    19: {
        'name': 'Route bloquée',
        'objects': {
            0: {
                'question': 'Route bloquée',
                'answer': 'Bonjour,\nNous vous remercions d\'avoir signalé cette fermeture de route.\nAfin de mettre à jour nos informations au plus vite, pourriez-vous nous préciser :\n\n- La durée prévue de cette fermeture\n- La raison de cette fermeture (travaux, accident...)\n- L\'emplacement exact (rue, ville)\n\nVous pouvez également contacter la Team Closure (@WazeTCFrance) sur Twitter pour une assistance personnalisée.\nMerci pour votre contribution à l\'amélioration de Waze.',
                'isPerso': false
            },
        }
    },
    23: {
        'name': 'Vitesse incorrecte',
        'objects': {
            0: {
                'question': 'Vitesse incorrecte',
                'answer': 'Bonjour,\nVous avez signalé une "Limitation de vitesse incorrecte" sur votre parcours. \nPouvez-vous être plus précis?\nMerci pour votre contribution à l\'amélioration de Waze.',
                'isPerso': false
            }
        }
    }
};


/* helper functions */
function UpdateLS() {
    var myJSON = new exportJSON();
    localStorage.UR2T = myJSON.escape(JSON.stringify(UR2T));
}

function getId(node) {
    if (node !== '') return document.getElementById(node);
    return false;
}

function DOMDataFilter(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function getSelectedValue(node) {
    var t = getId(node);
    return t.options[t.selectedIndex].value;
}

function getSelectedText(node) {
    var t = getId(node);
    return t.options[t.selectedIndex].text;
}
function cloneObj(obj) {
    var copy = JSON.parse(JSON.stringify(obj));
    return copy;
}
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
function getFunctionWithArgs(func, args) {
    return (
        function () {
            var json_args = JSON.stringify(args);
            return function () {
                var args = JSON.parse(json_args);
                func.apply(this, args);
            };
        }
    )();
}
function getActualDate() {
    var d = new Date();
    d = d.getFullYear() + "/" + (parseInt(d.getMonth()) + 1) + "/" + d.getDate();
    return d;
}

function getElementsByClassName(classname, node) {
    node || (node = document.getElementsByTagName("body")[0]);
    for (var a = [], re = new RegExp("\\b" + classname + "\\b"), els = node.getElementsByTagName("*"), i = 0, j = els.length; i < j; i++) {
        re.test(els[i].className) && a.push(els[i]);
    }
    return a;
}


// Fonction log avec affichage du nom du script
function log(msg, obj) {
    if (typeof msg === 'string' && obj == null) {
        console.log(`%c${GM_info.script.name + ': ' + msg}`, "color: #1b7596; font-weight: bold;");
    }
    else if (debug || obj) {
        console.log(`%c${GM_info.script.name + ' : ' + msg + ' '}`, "color: #1b7596; font-weight: bold;", obj,);
    }
    else {
        console.log(GM_info.script.name + ': ', msg);
    }
}

function UR2T_css() {
    var Scss = document.createElement("style");
    Scss.type = "text/css";
    var css = "#UR2T_msgs+.dropdown-menu li:hover, #UR2T_msgs+.dropdown-menu li:active, #UR2T_msgs+.dropdown-menu li:focus { cursor: pointer; background-color: #f0f0f5; outline: #3B99FC dotted 1px; }";
    css += "#UR2T_msgs+.dropdown-menu li {text-align: left; margin-left:10px; margin-right:10px; }";
    css += "#UR2T_msgs.btn { vertical-align: middle; box-shadow: inset 0px -1px 0px rgba(0,0,0,0.2); border-radius: 4px; border: 1px solid rgba(0,0,0,0.25); height:30px; width:280px;}";
    css += "#dropdownCat {vertical-align: middle; position: relative; width:280px; display: inline-block;}";
    css += "#dropdownCatBtn+.dropdown-menu li:hover, #dropdownCatBtn+.dropdown-menu li:active, #dropdownCatBtn+.dropdown-menu li:focus { cursor: pointer; background-color: #f0f0f5; outline: #3B99FC dotted 1px; }";
    css += "#dropdownCatBtn+.dropdown-menu li { text-align: left; margin-left:10px; margin-right:10px; }";
    css += "#dropdownCatBtn+.dropdown-menu { width: 280px;}";
    css += "#dropdownCatBtn.btn { vertical-align: middle; box-shadow: inset 0px -1px 0px rgba(0,0,0,0.2); border-radius: 4px; border: 1px solid rgba(0,0,0,0.25); height:30px; width:280px;}";
    css += "#dropdownQuestion {vertical-align: middle; position: relative; width:280px; display: inline-block;}";
    css += "#dropdownQuestionBtn+.dropdown-menu li:hover, #dropdownQuestionBtn+.dropdown-menu li:active, #dropdownQuestionBtn+.dropdown-menu li:focus { cursor: pointer; background-color: #f0f0f5; outline: #3B99FC dotted 1px; }";
    css += "#dropdownQuestionBtn+.dropdown-menu li { text-align: left; margin-left:10px; margin-right:10px; }";
    css += "#dropdownQuestionBtn+.dropdown-menu { width: 280px;}";
    css += ".textarea-alert-message {width: 100%;color: red;font-weight: bold;text-align:center;}";
    css += ".textarea-sidebar {display: contents;}";
    css += "#dropdownQuestionBtn.btn { vertical-align: middle; box-shadow: inset 0px -1px 0px rgba(0,0,0,0.2); border-radius: 4px; border: 1px solid rgba(0,0,0,0.25); height:30px; width:280px;}";
    css += ".strike { text-decoration: line-through };"


    Scss.innerHTML = css;
    document.body.appendChild(Scss);
    UR2T_Main();
}

function UR2T_init() {
    UR2T_Waze = W;
    UR2T_Waze_SDK = wmeSDK;
    UR2T_Waze_map = UR2T_Waze.map;
    UR2T_updateRequestLayer = UR2T_Waze_map.getLayerByName("update_requests");
    UR2T_Waze_model = UR2T_Waze.model;
    UR2T_model_updateRequestSessions = UR2T_Waze_model.updateRequestSessions;
    UR2T_model_mapUpdateRequests = UR2T_Waze_model.mapUpdateRequests;
    UR2T_Waze_loginManager = UR2T_Waze.loginManager;
    //log("UR2T_Waze_loginManager = ",UR2T_Waze_loginManager);

    log("Defaut_UR2T = ", Defaut_UR2T);

    if (typeof (localStorage.UR2T) !== "undefined" && IsJsonString(localStorage.getItem('UR2T'))) {
        var myJSON = new exportJSON();
        UR2T = JSON.parse(myJSON.unescape(localStorage.UR2T));
        //UR2T = JSON.parse(localStorage.UR2T);

        //	Ajout/modification des objets V2024.02.05.01 -> V2024.02.25.01
        if (typeof (UR2T.autoFilling) == 'undefined') UR2T.autoFilling = Defaut_UR2T.autoFilling;
        //	Ajout/modification des objets V2024.03.03.01 -> V2024.03.10.01
        if (typeof (UR2T.autoFilling.delay1) == 'undefined' || typeof (UR2T.autoFilling.delay2) == 'undefined') UR2T.autoFilling = Defaut_UR2T.autoFilling;

        //	Ajout/modification des objets V1.1 -> V1.2
        if (typeof (UR2T.GUI) == 'undefined') UR2T.GUI = Defaut_UR2T.GUI;
        if (isNaN(UR2T.GUI.defaultLeft)) UR2T.GUI.defaultLeft = Defaut_UR2T.GUI.defaultLeft;
        if (isNaN(UR2T.GUI.defaultTop)) UR2T.GUI.defaultTop = Defaut_UR2T.GUI.defaultTop;
        if (isNaN(UR2T.GUI.left)) UR2T.GUI.left = Defaut_UR2T.GUI.left;
        if (isNaN(UR2T.GUI.top)) UR2T.GUI.top = Defaut_UR2T.GUI.top;
        if (isNaN(UR2T.GUI.top)) UR2T.GUI.top = Defaut_UR2T.GUI.top;
        if (typeof (UR2T.lastSave) == 'undefined') UR2T.lastSave = getActualDate();
        //	Ajout/modification des objets V0.6 -> V1.1
        UR2T.scriptVer = GM_info.script.version;
        if (typeof (UR2T.debug_level) != 'undefined') delete UR2T.debug_level;

        var def_URs = Defaut_UR2T.answers.UR;
        var URs = UR2T.answers.UR;
        URs.outils = cloneObj(def_URs.outils);
        for (var URType in def_URs) {
            if (typeof (URs[URType]) == 'undefined') URs[URType] = cloneObj(def_URs[URType]);
            for (var URId in def_URs[URType].objects) {
                if (typeof (URs[URType].objects[URId]) == 'undefined') URs[URType].objects[URId] = cloneObj(def_URs[URType].objects[URId]);
            }
        }
        for (var URType in URs) {
            for (var URId in URs[URType].objects) {
                if (typeof (URs[URType].objects[URId].isperso) != 'undefined') {
                    URs[URType].objects[URId].isPerso = URs[URType].objects[URId].isperso;
                    delete URs[URType].objects[URId].isperso;
                }
                if (typeof (URs[URType].objects[URId].isPerso) == 'undefined') URs[URType].objects[URId].isPerso = false;
            }
        }
        UpdateLS();
        log('UR2T = ', UR2T);
        Defaut_UR2T = {};
    }
    else {
        UR2T = cloneObj(Defaut_UR2T);
        //UR2T.oldVer = GM_info.script.version;
        //	Mise à jour du LS
        var d = getActualDate();
        UpdateLS();
    }
    UR2T_css();
    //UR2T_Main()
}


function UR2T_Main() {
    UR2T_Waze = W;
    UR2T_Waze_loginManager = UR2T_Waze.loginManager;
    UR2T_Waze_user = UR2T_Waze_loginManager.user;
    log('GVars done');
    lastURfid = null;
    UR2T.UR_Selected = null;
    //	Test
    // var test = UR2T_Waze_loginManager.getLoggedInUser();
    // console.dir(test);
    //	HTML
    _UR2T_Html = new UR2T_Html();
    _UR2T_Html.UR2T_Html();
    log('Html renderer done');
    //	UR parser
    _UR2T_URparser = new UR2T_URparser();
    _UR2T_URparser.init();
    log('UR parser in progress');
    //	Bibliothèque d'images
    _imgs = new UR2T_imgs();
    //	Periodic updates
    unsafeWindow.setInterval(_UR2T_Html.checkVisibility, 250);	//	pas d'event de sélection sur les UR :/
    log('Periodic uptdates done');
    //	Events
    log('Events done');
    // UR2T_RR_HTML();
    //	Données externes
    // UR2T_GetUserResponses();

    //	Init finished
    //log("UR2T",UR2T);
    log('Init done');
}

function UR2T_imgs() {
    this.arrowShowWhite = "<span class='fa fa-chevron-down' style='padding-right: 5px;'></span>";
    this.arrowHideWhite = "<span class='fa fa-chevron-up' style='padding-right: 5px;'></span>";
}

function UR2T_URparser() {
    var _htmlURs = null;

    this.init = function () {
        var layerActive = UR2T_updateRequestLayer.getVisibility();
        if (!layerActive) UR2T_updateRequestLayer.setVisibility(true);
        _htmlURs = getId(UR2T_updateRequestLayer.id);
    };

    this.getSelURId = function () {
        //Test fonction ID

        if (W.app.attributes.selectedMarkers != null) {
            if (W.app.attributes.selectedMarkers[0] != null) return W.app.attributes.selectedMarkers[0];
        }
        else {
            return false
        }

        // Fin test
    };
}

function UR2T_Html() {
    var _moveEl = false;
    var _UR2T_overlay = null;
    var _URId = null;
    var _URType = null;
    var _lastURId = '';
    var _panelsExpanded = false;
    var WME_map = getId('map');
    var WME_panel_container = getId('panel-container');
    var _UR2T_editor = new UR2T_editor();
    var _showHidePanel = new showHidePanel();
    var _UR2T_editorId = null;
    var _UR2T_importExportId = null;

    this.UR2T_Html = function () {
        // Menu de droite (UR2T_overlay)
        var UR2T_overlay = document.createElement('div');
        UR2T_overlay.id = 'UR2T-overlay';
        UR2T_overlay.style.borderRadius = '5px';
        UR2T_overlay.style.zIndex = 998;
        UR2T_overlay.style.backgroundColor = 'white';
        UR2T_overlay.style.textAlign = 'center';
        UR2T_overlay.style.border = 'solid 1px';
        UR2T_overlay.style.padding = '10px';
        UR2T_overlay.style.display = 'none';
        UR2T_overlay.style.position = 'absolute';
        //UR2T_overlay.style.height = '90px';
        UR2T_overlay.style.width = '305px';
        var defaultTop = parseInt(getId('toolbar').clientHeight + 10);
        UR2T.GUI.defaultTop = defaultTop;
        UpdateLS();
        if (UR2T.GUI.top !== null) defaultTop = UR2T.GUI.top;
        else UR2T.GUI.top = defaultTop;
        UR2T_overlay.style.top = defaultTop + 'px';
        var defaultLeft = UR2T.GUI.defaultLeft;
        if (UR2T.GUI.left !== null) defaultLeft = UR2T.GUI.left;
        UR2T_overlay.style.left = defaultLeft + 'px';
        /***	le titre du plugins		***/
        UR2T_container = document.createElement('div');
        UR2T_content = document.createElement('h4');
        UR2T_content.id = 'UR2T-overlay-titre';
        UR2T_content.innerHTML = GM_info.script.name;
        //UR2T_content.innerHTML += '<br/>'+GM_info.script.version;
        UR2T_container.appendChild(UR2T_content);
        //	le contenue des réponses
        UR2T_container2 = document.createElement('div');
        UR2T_container2.id = "UR2T-overlay-responses";
        UR2T_container2.style.marginTop = '10px';
        UR2T_container.appendChild(UR2T_container2);
        //	on insère la zone de réponse
        UR2T_overlay.appendChild(UR2T_container);
        //	On insère le tout
        WME_map.appendChild(UR2T_overlay);
        _UR2T_overlay = getId('UR2T-overlay');
        // log('UR2T_Html init finished', _UR2T_overlay);
        //	events
        var _moveDiv = new moveDiv();
        getId('UR2T-overlay-titre').onmousedown = _moveDiv.set;
        getId('UR2T-overlay-titre').onmouseup = _moveDiv.reset;
        getId('UR2T-overlay-titre').ondblclick = _moveDiv.resetPos;
        WME_map.onmousemove = _moveDiv.moveEl;
    };

    this.checkVisibility = function () {
        if (WME_panel_container.innerHTML === '' ||
            WME_panel_container.getElementsByClassName('notification-detail panel')[0] !== undefined ||
            WME_panel_container.getElementsByClassName('archive-panel')[0] !== undefined ||
            WME_panel_container.getElementsByClassName('place-update-edit panel')[0] !== undefined) {
            getId('UR2T-overlay-responses').innerHTML = '';
            _lastURId = '';
            resetPlug('none');
            _panelsExpanded = false;
            return;
        }

        // Vérifier si le panneau de conversation est présent avant d'essayer de l'étendre
        var conversationPanel = document.getElementsByClassName('new-comment-form')[0];
        if (!conversationPanel || conversationPanel.parentElement.className != "conversation-view") {
            _lastURId = '';
            return;
        }


        _URId = _UR2T_URparser.getSelURId();

        // UR selectionnée
        if (_URId !== false) {
            //console.info("UR Sélectionnée : " + _URId);
            //	Fast UR change
            if (_URId != _lastURId) {
                _URType = UR2T_model_mapUpdateRequests.getObjectById(_URId).attributes.type;
                _lastURId = _URId;
                getId('UR2T-overlay-responses').innerHTML = '';
                _panelsExpanded = false;

                //	post traitements
                var img = document.createElement("img");
                img.src = "https://img.icons8.com/ios-glyphs/30/erase.png";
                img.width = 25;
                img.classList.add("textarea-sidebar-erase");
                img.addEventListener("click", function () { AutoComment("outils-0"); });

                var img2 = document.createElement("img");
                img2.src = "https://img.icons8.com/ios-glyphs/50/signature.png"
                img2.width = 25;
                img2.classList.add("textarea-sidebar-sign");
                img2.addEventListener("click", function () { AutoComment("outils-1"); });

                var img3 = document.createElement("p");
                img3.innerText = "AUTO"
                if (!UR2T.autoFilling.active) { img3.classList.add("strike"); }
                img3.classList.add("textarea-sidebar-auto");
                img3.addEventListener("click", function () {
                    if (UR2T.autoFilling.active) {
                        UR2T.autoFilling.active = false;
                        img3.classList.add("strike");
                    }
                    else {
                        UR2T.autoFilling.active = true;
                        img3.classList.remove("strike");
                    }
                    UR2T.lastSave = getActualDate();
                    UpdateLS();
                });


                var UR_sidebar = document.createElement("div");
                UR_sidebar.classList.add("textarea-sidebar");

                var alert_message = document.createElement("div");
                alert_message.classList.add("textarea-alert-message");

                //Ajout d'un message d'alerte si besoin : UR contenant une description ou mode de navigation différent de "particulier"
                if (UR2T_model_mapUpdateRequests.getObjectById(_URId).attributes.description && UR2T_model_mapUpdateRequests.getObjectById(_URId).attributes.description != null && UR2T_model_mapUpdateRequests.getObjectById(_URId).attributes.description != "Reported map issue") {
                    alert_message.innerHTML += "L'UR contient une description !<br />";
                }
                if (UR2T_model_mapUpdateRequests.getObjectById(_URId).attributes.vehicleType != "PRIVATE") {
                    alert_message.innerHTML += "Le type de véhicule est différent de 'Particulier'<br />";
                }


                if (document.getElementsByClassName('new-comment-form')[0] == null || document.getElementsByClassName('new-comment-form')[0].parentElement.className != "conversation-view") {
                    _lastURId = '';
                    return;
                }
                else {
                    document.getElementsByClassName('new-comment-form')[0].prepend(UR_sidebar);
                    document.getElementsByClassName('textarea-sidebar')[0].prepend(img2);
                    document.getElementsByClassName('textarea-sidebar')[0].prepend(img3);
                    document.getElementsByClassName('textarea-sidebar')[0].prepend(img);
                    document.getElementsByClassName('new-comment-form')[0].prepend(alert_message);
                }
                expandPanels();
                fixTextArea();
                if (UR2T_model_mapUpdateRequests.getObjectById(_URId).attributes.permissions != 0 && UR2T.autoFilling.active) {
                    unsafeWindow.setTimeout(autoFilling, 300);
                }
                unsafeWindow.setTimeout(ScrollDown, 300);
                populateURResponses();
                _showHidePanel.init();
                resetPlug('block');
            }

            //	Update _lastURId
            _lastURId = _URId;

        }
        // MP selectionnée
        else if (_URId === false) {
            console.info("MP Sélectionnée : " + _URId);
            if (getId('UR2T-showHidePanels') !== null) return;
            _showHidePanel.init();
        }

    };

    function eraseTextarea() {
        document.getElementsByClassName('new-comment-text')[document.getElementsByClassName('new-comment-text').length - 1].value = "";
    }

    function autoFilling() {
        const indexAfter3days = "divers-3"; // ID de la relance
        const indexAfter7days = "divers-5"; // ID de la clôture

        let timestampCreated = Date.parse(W.model.mapUpdateRequests.objects[_URId].attributes.localDriveTime) / 1000;
        let diffTimestampCreated = Math.trunc(((Date.now() / 1000) - timestampCreated) / 3600 / 24);

        if (W.model.updateRequestSessions.objects[_URId].attributes.comments.length >= 1) {
            let diffTimestampCreated = Math.trunc(((Date.now() / 1000) - W.model.updateRequestSessions.objects[_URId].attributes.comments[W.model.updateRequestSessions.objects[_URId].attributes.comments.length - 1].createdOn / 1000) / 3600 / 24);
            // Relance
            if (W.model.updateRequestSessions.objects[_URId].attributes.comments.length == 1 && W.model.updateRequestSessions.objects[_URId].attributes.comments[0].userID != -1 && diffTimestampCreated >= UR2T.autoFilling.delay1) {
                AutoComment(indexAfter3days);
            }
            //Clôture
            else if (W.model.updateRequestSessions.objects[_URId].attributes.comments.length >= 2 && W.model.updateRequestSessions.objects[_URId].attributes.comments[W.model.updateRequestSessions.objects[_URId].attributes.comments.length - 1].userID != -1 && diffTimestampCreated >= UR2T.autoFilling.delay2) {
                AutoComment(indexAfter7days);
                document.getElementById('state-not-identified').click();
            }
        }
        // Nouvelle UR
        else if (W.model.updateRequestSessions.objects[_URId].attributes.comments.length == 0) {
            AutoComment(_URType + "-0");
            //AutoComment("divers-7");
        }
    }

    function moveDiv() {
        var _mapBox, _ur2tBox;
        var _offsets = {};
        var _moveEl = false;
        var _top, _left;

        this.init = function () {
        };

        this.set = function (e1) {
            getId('UR2T-overlay-titre').style.cursor = 'move';
            _mapBox = WME_map.getBoundingClientRect();
            _ur2tBox = _UR2T_overlay.getBoundingClientRect();
            //Memorisation des offsets curseur / _UR2T_overlay
            _offsets.X = e1.clientX - _ur2tBox.left;
            _offsets.Y = e1.clientY - _ur2tBox.top;
            _offsets.nX = _ur2tBox.right - e1.clientX;
            _offsets.nY = _ur2tBox.bottom - e1.clientY;
            _moveEl = true;
        };

        this.reset = function () {
            getId('UR2T-overlay-titre').style.cursor = 'default';
            _offsets.X = null;
            _offsets.nX = null;
            _offsets.Y = null;
            _offsets.nY = null;
            UR2T.GUI.left = _left;
            UR2T.GUI.top = _top;
            UR2T.lastSave = getActualDate();
            UpdateLS();
            _moveEl = false;
        };

        this.resetPos = function () {
            UR2T.GUI.left = UR2T.GUI.defaultLeft;
            UR2T.GUI.top = UR2T.GUI.defaultTop;
            UR2T.lastSave = getActualDate();
            UpdateLS();
            _UR2T_overlay.style.left = UR2T.GUI.left + 'px';
            _UR2T_overlay.style.top = UR2T.GUI.top + 'px';
        };

        this.moveEl = function (e2) {
            if (_moveEl) {
                _left = e2.clientX - _offsets.X - _mapBox.left;
                _top = e2.clientY - _offsets.Y - _mapBox.top;
                if (_left <= 0) _left = 0;
                else if ((e2.clientX + _offsets.nX) >= _mapBox.right) _left = _mapBox.width - _ur2tBox.width;
                if (_top <= 0) _top = 0;
                else if ((e2.clientY + _offsets.nY) >= _mapBox.bottom) _top = _mapBox.height - _ur2tBox.height;
                // console.info(_left + ' ' + _top);
                _UR2T_overlay.style.left = parseInt(_left) + 'px';
                _UR2T_overlay.style.top = parseInt(_top) + 'px';
            }
        };
    }

    function resetPlug(displayType) {
        _UR2T_overlay.style.display = displayType;
        if (_UR2T_editorId !== null) _UR2T_editor.hide();
    }

    function expandPanels() {
        if (_panelsExpanded) return;

        var bodyElement = WME_panel_container.getElementsByClassName('body')[0];
        if (!bodyElement) return; // Ajout d'une vérification

        var bodyDivs = bodyElement.getElementsByTagName('div');
        for (var el in bodyDivs) {
            var theEl = bodyDivs[el];
            if (typeof (theEl.className) != 'string') continue;
            var patt = new RegExp('collapsed');
            if (patt.test(theEl.className)) theEl.className = theEl.className.replace(/ ?collapsed ?/, '');
            patt = new RegExp(/actions section/);
            if (patt.test(theEl.className)) theEl.className = theEl.className + ' collapsed';
        }
        _panelsExpanded = true;
    }

    function hideUselessSections() {
        console.info('hideUselessSections called');
        var _section = WME_panel_container.getElementsByClassName('body')[0].getElementsByClassName('more-info section')[0];
        var noInfo = _section.getElementsByClassName('not-available')[0];
        if (noInfo.style.display == 'none') return;
        _section.style.display = 'none';

    }

    function fixTextArea() {
        //console.info('fixTextArea called');
        var _body = WME_panel_container.getElementsByClassName('body')[0];
        if (!_body) return; // Vérification ajoutée
        var _body = WME_panel_container.getElementsByClassName('body')[0];
        if (typeof (_body) != 'undefined') {
            var _section = _body.getElementsByClassName('conversation section')[0];
            var _textarea = _section.getElementsByClassName('new-comment-text')[0];
        }
        if (typeof (_textarea) == 'undefined') {
            unsafeWindow.setTimeout(fixTextArea, 250);
            return;
        }
        _textarea.style.height = '120px';
        //hideUselessSections();
    }

    function showHidePanel() {
        var _body = null;
        var _texte = null;
        var _newContainer = null;
        var _actions = null;


        this.init = function () {
            _body = WME_panel_container.getElementsByClassName('body')[0];
            _actions = WME_panel_container.getElementsByClassName('actions')[0];
            var reported = WME_panel_container.getElementsByClassName('reported')[0];
            // Vérifier si l'élément existe
            if (!reported) return; // Ajout de cette vérification
            _texte = reported.innerHTML;
            reported.innerHTML = '';
            var container = document.createElement('span');
            container.id = 'UR2T-showHidePanels';
            container.style.cursor = 'pointer';
            container.innerHTML = _imgs.arrowHideWhite + _texte;
            reported.appendChild(container);
            _newContainer = getId('UR2T-showHidePanels');
            _newContainer.onclick = checkState;
        };

        function show() {
            _newContainer.innerHTML = _imgs.arrowHideWhite + _texte;
            _body.style.display = 'block';
            _actions.style.display = 'block';
            if (_URId !== false) resetPlug('block');
        }
        function hide() {
            if (_UR2T_editorId !== null) _UR2T_editor.hide();
            _newContainer.innerHTML = _imgs.arrowShowWhite + _texte;
            _body.style.display = 'none';
            _actions.style.display = 'none';
            if (_URId !== false) resetPlug('none');
        }
        function checkState() {
            if (_body.style.display == 'block' || _body.style.display === '') hide();
            else show();
        }
    }

    function populateURResponses() {
        var UR2T_overlay_responses = getId('UR2T-overlay-responses');
        if (UR2T_overlay_responses.innerHTML !== "") return;
        var content = "<div class='dropdown' style='text-align:left;'>";
        content += "<button id = 'UR2T_msgs' class='btn dropdown-toggle' type='button' data-toggle='dropdown'>Choisissez une réponse type</button>";
        content += "<ul class='dropdown-menu' style='height: 300px; overflow: auto; margin: 0; padding: 0; width: 303px;'>";

        log("_URType", _URType);

        if (_URType != -1) {
            if (_URType > 5 && _URType < 17 || _URType == 18 || _URType == 19 || _URType == 23) {
                var cat_name = UR2T.answers.UR[_URType].name;
                content += "<optgroup style='background-color:#FFCC00;' label=" + JSON.stringify(UR2T.answers.UR[_URType].name) + "></optgroup>";
                var objects = UR2T.answers.UR[_URType].objects;
                for (var index in objects) {
                    if (isNaN(index)) continue;
                    content += "<li style='cursor:pointer;' id=" + _URType + "-" + index + ">   - " + UR2T.answers.UR[_URType].objects[index].question.slice(0, 45) + "</li>";
                }
            }
            else {	//	author alert
                content += "<optgroup label = 'Please alert: seb-d59 or MatthieuF44' style='background-color:red;' ></optgroup>";
                content += "<optgroup label = 'Unknow request type : " + _URType + "' style='background-color:red;' ></optgroup>";
            }
        }
        //	Divers
        content += "<optgroup label = " + UR2T.answers.UR.divers.name + " style='background-color:#44B9EC;' ></optgroup>";
        var answers = UR2T.answers.UR.divers.objects;
        for (var index in answers) {
            if (isNaN(index)) continue;
            content += "<li style='cursor:pointer;' id=divers-" + index + ">   - " + UR2T.answers.UR.divers.objects[index].question + "</li>";
        }
        //	Outils
        content += "<optgroup label=" + UR2T.answers.UR.outils.name + " style='background-color:#33CC33;' ></optgroup>";
        var answers = UR2T.answers.UR.outils.objects;
        for (var index in answers) {
            if (isNaN(index)) continue;
            content += "<li style='cursor:pointer;' id=outils-" + index + ">   - " + UR2T.answers.UR.outils.objects[index].question + "</li>";
        }
        content += "</ul>";
        UR2T_overlay_responses.innerHTML += content;

        UR2T_setupHandler_rep();
    }

    function UR2T_setupHandler_rep() {
        var _UR2T_msgs = getId("UR2T-overlay-responses");
        var liste = _UR2T_msgs.getElementsByTagName("li");
        for (var i = 0; i < liste.length; i++) {
            var target = liste[i];
            var index = target.id;
            target.onclick = getFunctionWithArgs(AutoComment, [index]);
        }
    }
    function ScrollDown() {
        document.getElementsByClassName('comment-list')[0].scrollTop = document.getElementsByClassName('comment-list')[0].scrollHeight;
        document.getElementsByClassName('content--_7aTH body')[0].scrollTop = document.getElementsByClassName('content--_7aTH body')[0].scrollHeight;
    }

    function AutoComment(valeur) {
        var myTextArea = document.getElementsByClassName('new-comment-text')[document.getElementsByClassName('new-comment-text').length - 1];
        _UR2T_editor.init();
        _UR2T_editor.hide();
        var indexes = valeur.split('-');
        var le_texte = UR2T.answers.UR[indexes[0]].objects[indexes[1]].answer;
        if (le_texte.indexOf('UR2T_') === 0) {
            switch (le_texte) {
                case 'UR2T_EditResponses':
                    _UR2T_editor.editResponses();
                    _UR2T_editor.show();
                    break;
                case 'UR2T_autofilling_settings':
                    _UR2T_editor.autofilling_settings();
                    _UR2T_editor.show();
                    break;
                case 'UR2T_apropos':
                    _UR2T_editor.apropos();
                    _UR2T_editor.show();
                    break;
                case 'UR2T_EditSigns':
                    _UR2T_editor.editSigns();
                    _UR2T_editor.show();
                    break;
                case 'UR2T_insertSign':
                    myTextArea.value = myTextArea.value + '\n' + UR2T.userSign;
                    break;
                case 'UR2T_resetLocalValue':
                    localStorage.UR2T = '';
                    break;
                case 'UR2T_AddResponses':
                    _UR2T_editor.addResponse();
                    _UR2T_editor.show();
                    break;
                case 'UR2T_DelResponses':
                    _UR2T_editor.delResponse();
                    _UR2T_editor.show();
                    break;
                case 'UR2T_importExport_local':
                    _UR2T_editor.importExportLocal();
                    _UR2T_editor.show();
                    break;
                case 'UR2T_importExport_serveur':
                    _UR2T_editor.importExportServeur();
                    _UR2T_editor.show();
                    break;
            }
        }
        else {
            if (le_texte.length > 0) {
                le_texte = bonJourSoir(le_texte);
                if (UR2T.userSign.length > 0) le_texte = le_texte + '\n' + UR2T.userSign;
            }
            myTextArea.focus();
            myTextArea.value = le_texte;
            //UR2T_Waze_map.panelRegion.currentView.conversationView.viewModel.attributes.commentText = le_texte;
        }

        function bonJourSoir(leTexte) {
            var recherche = new RegExp('^(bon(jou|soi)r)', 'i');
            if (leTexte.match(recherche) === null) {
                return leTexte;
            }
            //	Vérification de l'heure du jour
            var UR2T_date = new Date();
            var heure = UR2T_date.getHours();
            var UR2T_replace = 'Bonjour';
            if (heure > 17 || heure < 4) UR2T_replace = 'Bonsoir';
            return leTexte.replace(recherche, UR2T_replace);
        }

    }

    function UR2T_editor() {
        var _UR2T_container = null;

        this.init = function () {
            // log('UR2T_editor called');
            if (_UR2T_editorId !== null) return;
            /***	le conteneur	***/
            var UR2T_editor = document.createElement('div');
            UR2T_editor.id = 'UR2T-editor';
            UR2T_editor.style.borderRadius = '5px';
            UR2T_editor.style.border = 'solid 1px';
            UR2T_editor.style.zIndex = 999;
            UR2T_editor.style.backgroundColor = 'white';
            UR2T_editor.style.textAlign = 'center';
            UR2T_editor.style.padding = '10px';
            UR2T_editor.style.display = 'none';
            UR2T_editor.style.position = 'absolute';
            UR2T_editor.style.height = '350px';
            UR2T_editor.style.width = '500px';
            UR2T_editor.style.top = UR2T.GUI.top + 'px';
            UR2T_editor.style.left = UR2T.GUI.left + 'px';
            //UR2T_editor.style.top = Number(getId('toolbar').clientHeith + 60) + 'px';
            //UR2T_editor.style.left = Number(getId('panel').style.left + getId('panel').style.width + 60) + 'px';

            /***	Les boutons		***/
            var UR2T_container = document.createElement('div');
            UR2T_container.id = 'UR2T-editor-btn';
            UR2T_container.style.position = 'absolute';
            UR2T_container.style.bottom = '10px';
            UR2T_container.style.right = '10px';
            UR2T_editor.appendChild(UR2T_container);
            // Le bouton 1
            var UR2T_btn_1 = document.createElement('button');
            UR2T_btn_1.id = 'UR2T-editor-btn-1';
            UR2T_btn_1.className = 'btn';
            UR2T_btn_1.style.visibility = 'hidden';
            UR2T_btn_1.innerHTML = 'Enregistrer';
            UR2T_container.appendChild(UR2T_btn_1);
            // Le bouton 0
            var UR2T_btn_0 = document.createElement('button');
            UR2T_btn_0.id = 'UR2T-editor-btn-0';
            UR2T_btn_0.className = 'btn';
            UR2T_btn_0.style.marginLeft = '10px';
            UR2T_btn_0.style.visibility = 'hidden';
            UR2T_btn_0.innerHTML = 'Fermer';
            UR2T_container.appendChild(UR2T_btn_0);
            /***	La zone de log	***/
            /***	log --> Error	***
            UR2T_container = document.createElement('div');
            UR2T_container.id = 'UR2T-editor-log-Error';
            UR2T_container.style.position = 'absolute';
            UR2T_container.style.bottom = '10px';
            UR2T_container.style.left = '10px';
            UR2T_container.style.color = 'red';
            UR2T_container.style.fontWeight = 'bold';
            UR2T_editor.appendChild(UR2T_container);
            /***	log --> Ok	***/
            UR2T_container = document.createElement('div');
            UR2T_container.id = 'UR2T-editor-log';
            UR2T_container.style.position = 'absolute';
            UR2T_container.style.bottom = '10px';
            UR2T_container.style.left = '10px';
            UR2T_container.style.textAlign = 'left';
            UR2T_container.style.fontWeight = 'bold';
            UR2T_editor.appendChild(UR2T_container);
            /***	la zone de contenu	***/
            UR2T_container = document.createElement('div');
            UR2T_container.id = 'UR2T-editor-content';
            UR2T_editor.appendChild(UR2T_container);
            /***	On insère le tout	***/
            WME_map.appendChild(UR2T_editor);
            _UR2T_editorId = getId('UR2T-editor');
            _UR2T_container = getId('UR2T-editor-content');
        };

        this.show = function () {
            _UR2T_editorId.style.display = 'block';
        };

        this.hide = function () {
            if (getId('UR2T_titre') !== null) getId('UR2T_titre').innerHTML = '';
            _UR2T_editorId.style.display = 'none';
        };

        this.apropos = function () {
            fixBox('210');

            //	Les boutons
            showBtns('Fermer');
            //	le contenant
            _UR2T_container.innerHTML = '';
            /***	Le contenu	***/
            var UR2T_content = document.createElement('h2');
            UR2T_content.id = "UR2T_titre";
            UR2T_content.innerHTML = 'À propos';
            _UR2T_container.appendChild(UR2T_content);
            //	script name
            UR2T_content = document.createElement('h4');
            UR2T_content.style.marginTop = '10px';
            UR2T_content.innerHTML = GM_info.script.name;
            _UR2T_container.appendChild(UR2T_content);
            //	script version
            UR2T_content = document.createElement('div');
            UR2T_content.style.marginTop = '10px';
            UR2T_content.innerHTML = 'Script version : ' + GM_info.script.version;
            _UR2T_container.appendChild(UR2T_content);
            //	Forum
            UR2T_content = document.createElement('div');
            UR2T_content.style.marginTop = '10px';
            UR2T_content.innerHTML = 'Related forum : <a href="https://www.waze.com/forum/viewtopic.php?f=1316&t=110502" target="_blank">Français</a>';
            _UR2T_container.appendChild(UR2T_content);
            //	Contact author
            UR2T_content = document.createElement('div');
            UR2T_content.style.marginTop = '10px';
            UR2T_content.innerHTML = 'Contact authors : ';
            UR2T_content.innerHTML = '<a href="https://www.waze.com/forum/memberlist.php?mode=viewprofile&u=15115123" target="_blank">Myriades (afk)</a> & ';
            UR2T_content.innerHTML += '<a href="https://www.waze.com/forum/memberlist.php?mode=viewprofile&u=16863068" target="_blank">seb-d59</a> & ';
            UR2T_content.innerHTML += '<a href="https://www.waze.com/forum/memberlist.php?mode=viewprofile&u=17102975" target="_blank">MatthieuF44</a>';
            _UR2T_container.appendChild(UR2T_content);
            /***	events	***/
            getId('UR2T-editor-btn-0').onclick = this.hide;
        };

        this.autofilling_settings = function () {
            fixBox('250');

            //	Les boutons
            showBtns('Fermer');
            //	le contenant
            _UR2T_container.innerHTML = '';
            /***	Le contenu	***/
            var UR2T_content = document.createElement('h2');
            UR2T_content.id = "UR2T_titre";
            UR2T_content.innerHTML = 'Réglage de l\'autofilling';
            _UR2T_container.appendChild(UR2T_content);

            //	Relance par défaut J+3
            UR2T_content = document.createElement('div');
            UR2T_content.id = "UR2T-delay1";
            UR2T_content.style.marginTop = '10px';
            UR2T_content.innerHTML = '<b>Réglage du délai pour la relance :</b><br /><i>Par défaut J+3</i>';
            _UR2T_container.appendChild(UR2T_content);
            //	Select relance par défaut J+3
            var selectListDelay1 = document.createElement("select");
            selectListDelay1.setAttribute("id", "delay1");
            _UR2T_container.appendChild(selectListDelay1);
            for (var i = 1; i <= 10; i++) {
                var option = document.createElement("option");
                option.setAttribute("value", i);
                if (i == UR2T.autoFilling.delay1) {
                    option.selected = true;
                }
                option.text = i;
                selectListDelay1.appendChild(option);
            }
            selectListDelay1.addEventListener("change", function () {
                if (UR2T.autoFilling.delay1 != this.value) {
                    UR2T.autoFilling.delay1 = this.value;
                    UR2T.lastSave = getActualDate();
                    UpdateLS();
                }
            });

            //	Clôture par défaut relance+4
            UR2T_content = document.createElement('div');
            UR2T_content.id = "UR2T-delay2";
            UR2T_content.style.marginTop = '10px';
            UR2T_content.innerHTML = '<b>Réglage du délai pour la clôture :</b><br /><i>Par défaut relance+4</i>';
            _UR2T_container.appendChild(UR2T_content);
            //	Select clôture par défaut relance+4
            var selectListDelay2 = document.createElement("select");
            selectListDelay2.setAttribute("id", "delay2");
            _UR2T_container.appendChild(selectListDelay2);
            for (var i = 1; i <= 10; i++) {
                var option = document.createElement("option");
                option.setAttribute("value", i);
                if (i == UR2T.autoFilling.delay2) {
                    option.selected = true;
                }
                option.text = i;
                selectListDelay2.appendChild(option);
            }
            selectListDelay2.addEventListener("change", function () {
                if (UR2T.autoFilling.delay2 != this.value) {
                    UR2T.autoFilling.delay2 = this.value;
                    UR2T.lastSave = getActualDate();
                    UpdateLS();
                }
            });

            /***	events	***/
            getId('UR2T-editor-btn-0').onclick = this.hide;
        };

        this.editSigns = function () {
            var _oldSign = UR2T.userSign;
            fixBox('155');
            //	Les boutons
            showBtns('Fermer');
            //	le contenant
            _UR2T_container.innerHTML = '';
            /***	Le contenu	***/
            var UR2T_content = document.createElement('h2');
            UR2T_content.id = "UR2T_titre";
            UR2T_content.innerHTML = 'Éditeur de signature';
            _UR2T_container.appendChild(UR2T_content);
            //	La zone de texte
            UR2T_content = document.createElement('textarea');
            UR2T_content.id = 'UR2T-editor-userSign';
            UR2T_content.setAttribute('placeholder', 'Inscrivez votre signature ici.');
            UR2T_content.style.width = '100%';
            UR2T_content.style.height = '55px';
            UR2T_content.style.marginTop = '10px';
            UR2T_content.value = _oldSign;
            _UR2T_container.appendChild(UR2T_content);
            /***	Events	***/
            getId('UR2T-editor-userSign').oninput = function () { showBtns('Annuler|Enregistrer'); };
            getId('UR2T-editor-btn-1').onclick = saveDatas;
            getId('UR2T-editor-btn-0').onclick = this.hide;

        };

        this.addResponse = function () {
            var _ErrMsg = '';
            fixBox('370');
            //	Les boutons
            showBtns('Fermer');
            //	le contenant
            _UR2T_container.innerHTML = '';
            /***	Le titre	***/
            UR2T_container2 = document.createElement('div');
            UR2T_content = document.createElement('h2');
            UR2T_content.id = "UR2T_titre";
            UR2T_content.innerHTML = 'Ajouter une réponse automatique';
            UR2T_container2.appendChild(UR2T_content);
            _UR2T_container.appendChild(UR2T_container2);

            /***	Le dropdown de catégorie	***/
            UR2T_container2 = document.createElement('div');
            UR2T_container2.style.marginTop = '10px';
            var content = "<div id='dropdownCat' class='dropdown'>";
            content += "<button id = 'dropdownCatBtn' class='btn dropdown-toggle' type='button' data-toggle='dropdown'>Choisissez une section</button>";
            content += "<ul class='dropdown-menu'>";
            //	Populate the dropdown
            var UR2T_options = [];
            for (var URIndex in UR2T.answers.UR) {
                UR2T_options.push(UR2T.answers.UR[URIndex].name);
            }
            UR2T_options.sort();
            //	Get the indexes
            var UR2T_options_index = [];
            for (var URDesc in UR2T_options) {
                for (var URIndex in UR2T.answers.UR) {
                    if (UR2T_options[URDesc] == UR2T.answers.UR[URIndex].name) {
                        UR2T_options_index.push(URIndex);
                        break;
                    }
                }
            }
            for (var i = 0; i < UR2T_options.length; i++) {
                if (UR2T_options[i] == 'Outils') continue;
                content += "<li  id=" + UR2T_options_index[i] + ">" + UR2T_options[i] + "</li>";
            }
            content += "</ul></div>";
            UR2T_container2.innerHTML += content;
            _UR2T_container.appendChild(UR2T_container2);

            /***	L'intitulé	***/
            UR2T_container2 = document.createElement('div');
            UR2T_container2.style.marginTop = '10px';
            UR2T_content = document.createElement('label');
            UR2T_content.setAttribute('for', 'UR2T-editor-question');
            UR2T_content.style.marginRight = '10px';
            UR2T_content.innerHTML = 'Intitulé';
            UR2T_container2.appendChild(UR2T_content);
            //	Les id invisibles
            UR2T_input = document.createElement('input');
            UR2T_input.id = 'UR2T-editor-cat-id';
            UR2T_input.value = 0;
            UR2T_input.style.display = 'none';
            UR2T_container2.appendChild(UR2T_input);
            UR2T_input = document.createElement('input');
            UR2T_input.id = 'UR2T-editor-question-id';
            UR2T_input.value = 0;
            UR2T_input.style.display = 'none';
            UR2T_container2.appendChild(UR2T_input);
            _UR2T_container.appendChild(UR2T_container2);
            //	la zone de texte
            var UR2T_input = document.createElement('input');
            UR2T_input.setAttribute('placeholder', '40 caractères maximum...');
            UR2T_input.setAttribute('maxlength', '40');
            UR2T_input.id = 'UR2T-editor-question';
            UR2T_input.disabled = true;
            UR2T_container2.appendChild(UR2T_input);
            /***	La zone de réponse	***/
            UR2T_container2 = document.createElement('div');
            UR2T_container2.style.marginTop = '10px';
            UR2T_content = document.createElement('label');
            // UR2T_content.setAttribute('for', 'UR2T-editor-response');
            UR2T_content.style.marginRight = '10px';
            UR2T_content.innerHTML = 'Le texte de réponse automatique';
            UR2T_container2.appendChild(UR2T_content);
            _UR2T_container.appendChild(UR2T_container2);
            /***	Le contenu 4	***/
            UR2T_container2 = document.createElement('div');
            // UR2T_container2.style.marginTop = '10px';
            var UR2T_textarea = document.createElement('textarea');
            UR2T_textarea.id = 'UR2T-editor-response';
            UR2T_textarea.setAttribute('placeholder', 'Inscrivez votre réponse ici.');
            UR2T_textarea.style.width = '100%';
            UR2T_textarea.style.height = '150px';
            UR2T_container2.appendChild(UR2T_textarea);
            _UR2T_container.appendChild(UR2T_container2);
            /***	events	***/
            getId('UR2T-editor-question').oninput = function () { showBtns('Annuler|Enregistrer'); };
            getId('UR2T-editor-response').oninput = function () { showBtns('Annuler|Enregistrer'); };
            getId('UR2T-editor-btn-1').onclick = saveDatas;
            getId('UR2T-editor-btn-0').onclick = this.hide;


            UR2T_setupHandler_dropDownCatAdd();

        };


        this.editResponses = function () {
            fixBox('370');
            //	Les boutons
            showBtns('Fermer');
            //	le contenant
            _UR2T_container.innerHTML = '';
            /***	Le contenu	***/
            var UR2T_container2 = document.createElement('div');
            var UR2T_content = document.createElement('h2');
            UR2T_content.id = "UR2T_titre";
            UR2T_content.innerHTML = 'Éditeur de réponses automatiques';
            UR2T_container2.appendChild(UR2T_content);
            _UR2T_container.appendChild(UR2T_container2);

            /***	Le contenu 1	***/
            /***	Le dropdown de catégorie	***/
            UR2T_container2 = document.createElement('div');
            UR2T_container2.style.marginTop = '10px';
            _UR2T_container.appendChild(UR2T_container2);

            var content = "<div id='dropdownCat' class='dropdown'>";
            content += "<button id = 'dropdownCatBtn' class='btn dropdown-toggle' type='button' data-toggle='dropdown'>Choisissez une section</button>";
            content += "<ul class='dropdown-menu'>";
            //	Populate the dropdown
            var UR2T_options = [];
            for (var URIndex in UR2T.answers.UR) {
                UR2T_options.push(UR2T.answers.UR[URIndex].name);
            }
            UR2T_options.sort();
            //	Get the indexes
            var UR2T_options_index = [];
            for (var URDesc in UR2T_options) {
                for (var URIndex in UR2T.answers.UR) {
                    if (UR2T_options[URDesc] == UR2T.answers.UR[URIndex].name) {
                        UR2T_options_index.push(URIndex);
                        break;
                    }
                }
            }
            for (var i = 0; i < UR2T_options.length; i++) {
                if (UR2T_options[i] == 'Outils') continue;
                content += "<li  id=" + UR2T_options_index[i] + ">" + UR2T_options[i] + "</li>";
            }
            content += "</ul></div>";
            UR2T_container2.innerHTML += content;
            /***	Le contenu 2	***/
            /***	Le dropdown Question***/
            UR2T_container2 = document.createElement('div');
            UR2T_container2.style.marginTop = '10px';
            content = "<div id='dropdownQuestion' class='dropdown'>";
            content += "<button id = 'dropdownQuestionBtn' class='btn dropdown-toggle' type='button' disabled='true' data-toggle='dropdown'>Choisissez une question</button>";
            content += "</div>";
            UR2T_container2.innerHTML += content;
            //	L'id invisible
            UR2T_input = document.createElement('input');
            UR2T_input.id = 'UR2T-editor-cat-id';
            UR2T_input.value = 0;
            UR2T_input.style.display = 'none';
            UR2T_container2.appendChild(UR2T_input);
            UR2T_input = document.createElement('input');
            UR2T_input.id = 'UR2T-editor-question-id';
            UR2T_input.value = 0;
            UR2T_input.style.display = 'none';
            UR2T_container2.appendChild(UR2T_input);
            _UR2T_container.appendChild(UR2T_container2);
            /***	Le contenu 3	***/
            UR2T_container2 = document.createElement('div');
            UR2T_container2.style.marginTop = '10px';
            UR2T_content = document.createElement('label');
            // UR2T_content.setAttribute('for', 'UR2T-editor-response');
            UR2T_content.style.marginRight = '10px';
            UR2T_content.innerHTML = 'Le texte de réponse automatique';
            UR2T_container2.appendChild(UR2T_content);
            _UR2T_container.appendChild(UR2T_container2);
            /***	Le contenu 4	***/
            UR2T_container2 = document.createElement('div');
            // UR2T_container2.style.marginTop = '10px';
            var UR2T_textarea = document.createElement('textarea');
            UR2T_textarea.id = 'UR2T-editor-response';
            UR2T_textarea.setAttribute('placeholder', 'Inscrivez votre réponse ici.');
            UR2T_textarea.style.width = '100%';
            UR2T_textarea.style.height = '150px';
            UR2T_container2.appendChild(UR2T_textarea);
            /***	On insère le tout	***/
            _UR2T_container.appendChild(UR2T_container2);

            /***	Events	***/
            getId('UR2T-editor-response').oninput = function () { showBtns('Annuler|Enregistrer'); };
            getId('UR2T-editor-btn-0').onclick = this.hide;
            getId('UR2T-editor-btn-1').onclick = saveDatas;

            UR2T_setupHandler_dropdownCat();



        };

        this.delResponse = function () {
            fixBox('370');
            //	Les boutons
            showBtns('Fermer');
            //	le contenant
            _UR2T_container.innerHTML = '';
            /***	Le contenu	***/
            var UR2T_container2 = document.createElement('div');
            UR2T_content = document.createElement('h2');
            UR2T_content.id = "UR2T_titre";
            UR2T_content.innerHTML = 'Supprimer une réponse';
            UR2T_container2.appendChild(UR2T_content);
            _UR2T_container.appendChild(UR2T_container2);

            /***	Le dropdown de catégorie	***/
            UR2T_container2 = document.createElement('div');
            UR2T_container2.style.marginTop = '10px';
            _UR2T_container.appendChild(UR2T_container2);

            var content = "<div id='dropdownCat' class='dropdown'>";
            content += "<button id = 'dropdownCatBtn' class='btn dropdown-toggle' type='button' data-toggle='dropdown'>Choisissez une section</button>";
            content += "<ul class='dropdown-menu'>";
            //	Populate the dropdown
            var UR2T_options = [];
            for (var URIndex in UR2T.answers.UR) {
                UR2T_options.push(UR2T.answers.UR[URIndex].name);
            }
            UR2T_options.sort();
            //	Get the indexes
            var UR2T_options_index = [];
            for (var URDesc in UR2T_options) {
                for (var URIndex in UR2T.answers.UR) {
                    if (UR2T_options[URDesc] == UR2T.answers.UR[URIndex].name) {
                        UR2T_options_index.push(URIndex);
                        break;
                    }
                }
            }
            for (var i = 0; i < UR2T_options.length; i++) {
                if (UR2T_options[i] == 'Outils') continue;
                content += "<li  id=" + UR2T_options_index[i] + ">" + UR2T_options[i] + "</li>";
            }
            content += "</ul></div>";
            UR2T_container2.innerHTML += content;
            /***	Le dropdown Question***/
            UR2T_container2 = document.createElement('div');
            UR2T_container2.style.marginTop = '10px';
            content = "<div id='dropdownQuestion' class='dropdown'>";
            content += "<button id = 'dropdownQuestionBtn' class='btn dropdown-toggle' type='button' disabled='true' data-toggle='dropdown'>Choisissez une question</button>";
            content += "</div>";
            UR2T_container2.innerHTML += content;
            //	L'id invisible
            UR2T_input = document.createElement('input');
            UR2T_input.id = 'UR2T-editor-cat-id';
            UR2T_input.value = 0;
            UR2T_input.style.display = 'none';
            UR2T_container2.appendChild(UR2T_input);
            UR2T_input = document.createElement('input');
            UR2T_input.id = 'UR2T-editor-question-id';
            UR2T_input.value = 0;
            UR2T_input.style.display = 'none';
            UR2T_container2.appendChild(UR2T_input);
            _UR2T_container.appendChild(UR2T_container2);

            UR2T_container2 = document.createElement('div');
            UR2T_container2.style.marginTop = '10px';
            _UR2T_container.appendChild(UR2T_container2);
            var UR2T_textarea = document.createElement('textarea');
            UR2T_textarea.id = 'UR2T-editor-response';
            UR2T_textarea.setAttribute('readOnly', 'true');
            UR2T_textarea.style.width = '100%';
            UR2T_textarea.style.height = '150px';
            UR2T_container2.appendChild(UR2T_textarea);
            /***	On insère le tout	***/
            _UR2T_container.appendChild(UR2T_container2);
            /***	Events	***/
            //getId('UR2T-editor-cat').onchange = PopulateQuestions;
            //getId('UR2T-editor-question').onchange = PopulateAnswers;
            //getId('UR2T-editor-response').oninput = function(){;};
            getId('UR2T-editor-btn-0').onclick = this.hide;
            getId('UR2T-editor-btn-1').onclick = saveDatas;

            UR2T_setupHandler_dropdownCat();

        };

        this.importExportLocal = function () {
            log('importExportLocal called');
            if (_UR2T_importExportId != null) return;
            fixBox('500');
            //	Les boutons
            showBtns('Fermer');
            //	le contenant
            _UR2T_container.innerHTML = '';
            /***	Le contenu	***/
            /***	Le titre	***/
            var UR2T_container2 = document.createElement('div');
            UR2T_content = document.createElement('h2');
            UR2T_content.id = "UR2T_titre";
            UR2T_content.innerHTML = 'Local Import / Export';
            UR2T_container2.appendChild(UR2T_content);
            // on insère
            _UR2T_container.appendChild(UR2T_container2);
            /***	Les cases à cocher et le type	***/
            UR2T_container2 = document.createElement('div');
            UR2T_container2.style.marginTop = '10px';
            //	La case import
            UR2T_content = document.createElement('input');
            UR2T_content.setAttribute('type', 'radio');
            UR2T_content.setAttribute('name', 'UR2T_IE');
            UR2T_content.setAttribute('checked', '');
            UR2T_content.id = "UR2T_import_chk";
            //UR2T_content.onclick = function(){showBtns('Fermer|Import');};
            UR2T_container2.appendChild(UR2T_content);
            // le label import
            UR2T_content = document.createElement('label');
            UR2T_content.setAttribute('for', 'UR2T_import_chk');
            UR2T_content.style.marginLeft = '10px';
            UR2T_content.innerHTML = 'Import';
            UR2T_container2.appendChild(UR2T_content);
            // La case export
            UR2T_content = document.createElement('input');
            UR2T_content.style.marginLeft = '10px';
            UR2T_content.setAttribute('type', 'radio');
            UR2T_content.setAttribute('name', 'UR2T_IE');
            UR2T_content.id = "UR2T_export_chk";
            //UR2T_content.onclick = function(){showBtns('Fermer');};
            UR2T_container2.appendChild(UR2T_content);
            // le label export
            UR2T_content = document.createElement('label');
            UR2T_content.setAttribute('for', 'UR2T_export_chk');
            UR2T_content.style.marginLeft = '10px';
            UR2T_content.innerHTML = 'Export';
            UR2T_container2.appendChild(UR2T_content);
            _UR2T_container.appendChild(UR2T_container2);
            /***	Le type	***/
            UR2T_container2 = document.createElement('div');
            //UR2T_container2.style.height = '60px';
            //UR2T_container2.style.marginLeft = '30px';
            UR2T_container2.style.marginBottom = '10px';
            UR2T_content = document.createElement('label');
            UR2T_content.id = 'UR2T_label_select';
            UR2T_content.setAttribute('for', 'UR2T_type_select');
            UR2T_content.style.visibility = 'hidden';
            UR2T_content.innerHTML = 'Format';
            UR2T_container2.appendChild(UR2T_content);
            var UR2T_select = document.createElement('select');
            UR2T_select.id = "UR2T_type_select";
            UR2T_select.style.visibility = 'hidden';
            UR2T_select.style.marginLeft = '10px';
            UR2T_select.innerHTML = '<option value="none">Choisisez un format</option>';
            UR2T_select.innerHTML += '<option value="CSV">CSV</option>';
            UR2T_select.innerHTML += '<option value="JSON">JSON</option>';
            UR2T_select.innerHTML += '<option value="XML">XML</option>';
            //UR2T_select.onchange = checkFormat;
            UR2T_container2.appendChild(UR2T_select);
            // Le bouton Import
            var UR2T_import_file = document.createElement('input');
            UR2T_import_file.id = 'UR2T_import_file';
            UR2T_import_file.type = 'file';
            UR2T_import_file.name = 'files[]';
            UR2T_import_file.className = 'btn';
            UR2T_import_file.style.paddingBottom = '0px';
            UR2T_import_file.style.paddingTop = '0px';
            UR2T_import_file.style.visibility = 'visible';
            //UR2T_import_file.innerHTML = 'Import';
            UR2T_import_file.accept = '.csv, .JSON';
            //UR2T_import_file.accept = '.csv, .xml, .JSON';
            UR2T_import_file.onchange = openFile;
            UR2T_container2.appendChild(UR2T_import_file);
            _UR2T_container.appendChild(UR2T_container2);
            /***	Le Texte	***/
            UR2T_container2 = document.createElement('div');
            var UR2T_textarea = document.createElement('textarea');
            UR2T_textarea.id = 'UR2T-import-export-txt';
            UR2T_textarea.setAttribute('placeholder', 'Le resultat encodé apparaîtra ici.');
            UR2T_textarea.style.width = '100%';
            UR2T_textarea.style.height = '250px';
            UR2T_textarea.style.overflow = 'auto';
            UR2T_container2.appendChild(UR2T_textarea);
            _UR2T_container.appendChild(UR2T_container2);
            UR2T_container2 = document.createElement('div');
            UR2T_container2.style = 'clear:both; padding-top:10px;';
            _UR2T_container.appendChild(UR2T_container2);
            UR2T_container2 = document.createElement('div');
            UR2T_container2.style.float = 'left';
            var UR2T_download = document.createElement('a');
            UR2T_download.id = 'UR2T_download';
            UR2T_download.style.width = '20px';
            UR2T_download.style.height = '20px';
            UR2T_download.href = '#';
            UR2T_download.style.visibility = 'hidden';
            var UR2T_link = document.createElement('img');
            UR2T_link.style.width = '20px';
            UR2T_link.title = 'Export';
            UR2T_link.src = 'data:image/png;base64,' + icon_export;
            //UR2T_link.style.visibility = 'hidden';
            UR2T_download.appendChild(UR2T_link);
            UR2T_container2.appendChild(UR2T_download);
            _UR2T_container.appendChild(UR2T_container2);
            UR2T_container2 = document.createElement('div');
            UR2T_container2.style.float = 'left';
            // le label import
            //var UR2T_span = document.createElement('span');
            UR2T_span = document.createElement('label');
            UR2T_span.setAttribute('for', 'UR2T_import_file');
            UR2T_span.id = 'UR2T_nomFichier';
            UR2T_span.style.marginLeft = '20px';
            UR2T_span.style.height = '20px';
            UR2T_span.style.textAlign = 'left';
            UR2T_span.innerHTML = 'Aucun fichier selectionné...';
            //UR2T_span.style.visibility = 'visible';
            //UR2T_span.innerHTML = 'UR2T_nomFichier';
            UR2T_container2.appendChild(UR2T_span);
            _UR2T_container.appendChild(UR2T_container2);
            //	Events import/export radio btn
            getId('UR2T_import_chk').onclick = function () {
                showBtns('Fermer');
                getId('UR2T_import_file').style.visibility = 'visible';
                getId('UR2T_import_file').value = "";
                getId('UR2T_download').style.visibility = 'hidden';
                getId('UR2T_nomFichier').innerHTML = '';
                getId('UR2T_type_select').style.visibility = 'hidden';
                getId('UR2T_label_select').style.visibility = 'hidden';
                var myTextarea = getId('UR2T-import-export-txt');
                myTextarea.value = "";
            };

            getId('UR2T_export_chk').onclick = function () {
                showBtns('Fermer');
                var myTextarea = getId('UR2T-import-export-txt');
                myTextarea.value = "";
                getId('UR2T_import_file').style.visibility = 'hidden';
                getId('UR2T_label_select').style.visibility = 'visible';
                getId('UR2T_download').style.visibility = 'visible';
                getId('UR2T_type_select').style.visibility = 'visible';
                getId('UR2T_type_select').onclick = checkFormat;
            };

            getId('UR2T-editor-btn-0').onclick = this.hide;
            getId('UR2T-editor-btn-1').onclick = function () { updateLogZone('Error', 'Fonction non activée...  Comming soon ;)', 5000); };

        };
        this.importExportServeur = function () {
            log('importExportServeur called');
            if (_UR2T_importExportId != null) return;
            fixBox('150');
            //	Les boutons
            showBtns('Fermer');
            //	le contenant
            _UR2T_container.innerHTML = '';
            /***	Le contenu	***/
            /***	Le titre	***/
            var UR2T_container2 = document.createElement('div');
            UR2T_content = document.createElement('h2');
            UR2T_content.id = "UR2T_titre";
            UR2T_content.innerHTML = 'Import / Export Serveur';
            UR2T_container2.appendChild(UR2T_content);
            // on insère
            _UR2T_container.appendChild(UR2T_container2);
            /***	Les cases à cocher et le type	***/
            UR2T_container2 = document.createElement('div');
            UR2T_container2.style.marginTop = '10px';
            //	La case import
            UR2T_content = document.createElement('input');
            UR2T_content.setAttribute('type', 'radio');
            UR2T_content.setAttribute('name', 'UR2T_IE');
            UR2T_content.setAttribute('checked', '');
            UR2T_content.id = "UR2T_import_chk";
            //UR2T_content.onclick = function(){showBtns('Fermer|Import');};
            UR2T_container2.appendChild(UR2T_content);
            // le label import
            UR2T_content = document.createElement('label');
            UR2T_content.setAttribute('for', 'UR2T_import_chk');
            UR2T_content.style.marginLeft = '10px';
            UR2T_content.innerHTML = 'Import';
            UR2T_container2.appendChild(UR2T_content);
            // La case export
            UR2T_content = document.createElement('input');
            UR2T_content.style.marginLeft = '10px';
            UR2T_content.setAttribute('type', 'radio');
            UR2T_content.setAttribute('name', 'UR2T_IE');
            UR2T_content.id = "UR2T_export_chk";
            //UR2T_content.onclick = function(){showBtns('Fermer');};
            UR2T_container2.appendChild(UR2T_content);
            // le label export
            UR2T_content = document.createElement('label');
            UR2T_content.setAttribute('for', 'UR2T_export_chk');
            UR2T_content.style.marginLeft = '10px';
            UR2T_content.innerHTML = 'Export';
            UR2T_container2.appendChild(UR2T_content);
            _UR2T_container.appendChild(UR2T_container2);

            //	Events import/export radio btn
            getId('UR2T_import_chk').onclick = function () {
                showBtns('Fermer|Import');
            };

            getId('UR2T_export_chk').onclick = function () {
                showBtns('Fermer|Export');
            };
            showBtns('Fermer|Import');
            getId('UR2T-editor-btn-0').onclick = this.hide;
            getId('UR2T-editor-btn-1').onclick = function () {
                if (getId('UR2T-editor-btn-1').innerHTML == 'Export') externalSave();
                if (getId('UR2T-editor-btn-1').innerHTML == 'Import') UR2T_GetUserResponses();
            };

            /*var e = null;
            e=getId('UR2T_import_file');
            e.style.visibility = 'visible';
                if (e)  e.addEventListener('change', openFile);
                */
            //e.addEventListener('change', fileChanged);
            /*if (getId('UR2T-editor-btn-1').innerHTML='Import') updateLogZone('Error', 'Fonction non activée...  Comming soon ;)', 5000);
            if (getId('UR2T-editor-btn-1').innerHTML='Générer') checkFormat
            };*/
        };
    }
    function fixBox(boxHeight) {
        updateLogZone('Ok', '', 0);
        _UR2T_editorId.style.height = boxHeight + 'px';
        _UR2T_editorId.style.top = UR2T.GUI.top + 'px';
        _UR2T_editorId.style.left = UR2T.GUI.left + 'px';
    }

}




function UR2T_setupHandler_dropDownCatAdd() {
    var UR2T_dropDownCat = getId("dropdownCat");
    var liste = UR2T_dropDownCat.getElementsByTagName("li");
    console.debug(liste);
    for (var i = 0; i < liste.length; i++) {
        var target = liste[i];
        var index = target.id;
        target.onclick = getFunctionWithArgs(getQId, [index]);
    }
}

function getQId(catId) {
    var UR2T_dropDownCat = getId("dropdownCatBtn");
    var QId = 0;
    var t = UR2T.answers.UR[catId].objects;
    while (t[QId] !== undefined) {
        QId++;
    }
    // console.info(QId);
    UR2T_dropDownCat.innerHTML = UR2T.answers.UR[catId].name;
    getId('UR2T-editor-cat-id').value = catId;
    getId('UR2T-editor-question-id').value = QId;
    getId('UR2T-editor-question').disabled = false;
    log('cat-id: ' + catId + '; question-id: ' + QId);
    showBtns('Annuler|Enregistrer');
}

function UR2T_setupHandler_dropdownCat() {
    var UR2T_dropDownCat = getId("dropdownCat");
    var liste = UR2T_dropDownCat.getElementsByTagName("li");
    console.debug(liste);
    for (var i = 0; i < liste.length; i++) {
        var target = liste[i];
        var index = target.id;
        target.onclick = getFunctionWithArgs(Populate_dropdownQuestion, [index]);
    }
}

function Populate_dropdownQuestion(catId) {
    getId('UR2T-editor-response').value = "";
    var UR2T_dropdownCatBtn = getId("dropdownCatBtn");
    var UR2T_dropdownQuestionBtn = getId('dropdownQuestionBtn');
    var UR2T_dropdownQuestion = getId('dropdownQuestion');

    UR2T_dropdownCatBtn.innerHTML = UR2T.answers.UR[catId].name;
    getId('UR2T-editor-cat-id').value = catId;
    var URObjects = UR2T.answers.UR[catId].objects;
    var UR2T_questions = [];
    for (var QId in URObjects) {
        UR2T_questions.push(URObjects[QId].question);
    }
    UR2T_questions.sort();
    //	Get the indexes
    var UR2T_questions_index = [];
    for (var URQuestion in UR2T_questions) {
        for (var URIndex in URObjects) {
            if (UR2T_questions[URQuestion] == URObjects[URIndex].question) {
                UR2T_questions_index.push(URIndex);
                break;
            }
        }
    }
    var content = "<div id='dropdownQuestion' class='dropdown'>";
    content += "<button id = 'dropdownQuestionBtn' class='btn dropdown-toggle' type='button' data-toggle='dropdown'>Choisissez une question</button>";
    content += "<ul class='dropdown-menu'>";
    for (var i = 0; i < UR2T_questions.length; i++) {
        content += "<li  id=" + UR2T_questions_index[i] + ">" + UR2T_questions[i] + "</li>";
    }
    content += "</ul></div>";
    UR2T_dropdownQuestion.innerHTML = content;

    UR2T_setupHandler_dropdownQuestion();
}

function UR2T_setupHandler_dropdownQuestion() {
    var UR2T_dropdownQuestion = getId("dropdownQuestion");
    var liste = UR2T_dropdownQuestion.getElementsByTagName("li");
    console.debug(liste);
    for (var i = 0; i < liste.length; i++) {
        var target = liste[i];
        var index = target.id;
        target.onclick = getFunctionWithArgs(PopulateAnswers, [index]);
    }
}

/*
function PopulateAnswers(){
    getId('UR2T-editor-response').value = "";
    var theCat = getId('UR2T-editor-cat');
    var theCatValue = theCat.options[theCat.selectedIndex].value;
    if(theCat.selectedIndex > 0){
        var theQuestion = getId('UR2T-editor-question');
        var theQuestionValue = theQuestion.options[theQuestion.selectedIndex].value;
        if(theQuestion.selectedIndex > 0){
            var UR2T_OR = getId('UR2T-editor-response');
            UR2T_OR.value = UR2T.answers.UR[theCatValue].objects[theQuestionValue].answer;
            showBtns('Annuler|Supprimer');
            return;
        }
    }
 
}
*/

function PopulateAnswers(QId) {
    var UR2T_dropdownQuestionBtn = getId("dropdownQuestionBtn");
    getId('UR2T-editor-question-id').value = QId;
    var catId = getId('UR2T-editor-cat-id').value;
    log('cat-id: ' + catId + '; question-id: ' + QId);

    var UR2T_OR = getId('UR2T-editor-response');
    UR2T_OR.value = UR2T.answers.UR[catId].objects[QId].answer;
    UR2T_dropdownQuestionBtn.innerHTML = UR2T.answers.UR[catId].objects[QId].question;
    if (getId('UR2T_titre').innerHTML == 'Supprimer une réponse')
        showBtns('Annuler|Supprimer');
}

function saveDatas() {
    switch (getId('UR2T_titre').innerHTML) {
        case 'Éditeur de signature':
            UR2T.userSign = getId('UR2T-editor-userSign').value;
            break;
        case 'Éditeur de réponses automatiques':
            try {
                //if(getId('UR2T-editor-cat-id').value == 0)throw 'Pas de catégorie sélectionnée';
                //if(getId('UR2T-editor-question-id').value == 0)throw 'Pas de question sélectionnée';
                if (getId('UR2T-editor-response').value == '') throw 'Réponse vide';
            }
            catch (e) {
                showBtns('Fermer');
                updateLogZone('Error', e, 5000);
                return;
            }
            UR2T.answers.UR[getId('UR2T-editor-cat-id').value].objects[getId('UR2T-editor-question-id').value].answer = getId('UR2T-editor-response').value;
            break;
        case 'Ajouter une réponse automatique':
            try {
                if (getId('UR2T-editor-cat-id').value == 0) throw 'Sélectionnez une categorie';
                if (getId('UR2T-editor-question').value.length < 4) throw 'Définissez l\'intitulé (4 caractères minimum)';
                if (getId('UR2T-editor-response').value.length < 20) throw 'Remplissez la réponse (20 caractères minimum)';
            }
            catch (e) {
                showBtns('Fermer');
                updateLogZone('Error', e, 5000);
                return;
            }
            UR2T.answers.UR[getId('UR2T-editor-cat-id').value].objects[getId('UR2T-editor-question-id').value] = { 'question': getId('UR2T-editor-question').value, 'answer': getId('UR2T-editor-response').value, 'isPerso': true };
            // console.dir(UR2T.answers.UR[getId('UR2T-editor-cat-id').value].objects);
            break;
        case 'Supprimer une réponse':
            delete UR2T.answers.UR[getId('UR2T-editor-cat-id').value].objects[getId('UR2T-editor-question-id').value];
            break;
        case 'Import / Export Serveur':
            break;
    }
    UR2T.lastSave = getActualDate();
    UpdateLS();
    externalSave();
}

function externalSave() {
    var UR2T_export = {};
    UR2T_export.script = "UR2T";
    UR2T_export.user = {};
    UR2T_export.user.id = UR2T_Waze_user.attributes.id;
    UR2T_export.user.rank = UR2T_Waze_user.attributes.rank + 1;
    UR2T_export.user.userName = UR2T_Waze_user.attributes.userName;
    UR2T_export.user.userSign = UR2T.userSign;
    UR2T_export.user.scriptVer = UR2T.scriptVer;
    UR2T_export.user.GUI = UR2T.GUI;
    UR2T_export.user.lastSave = UR2T.lastSave;
    UR2T_export.action = "w";
    UR2T_export.datas = {};
    //	Sauvegarde partielle
    switch (getId('UR2T_titre').innerHTML) {
        case 'Éditeur de signature':
            //if(getId('UR2T-editor-userSign').value == "") return;
            UR2T_export.user.userSign = UR2T.userSign;
            break;
        case 'Éditeur de réponses automatiques':
            UR2T_export.datas[getId('UR2T-editor-cat-id').value] = { 'name': getId('dropdownCatBtn').textContent, 'objects': {} };
            UR2T_export.datas[getId('UR2T-editor-cat-id').value].objects[getId('UR2T-editor-question-id').value] = { 'question': getId('dropdownQuestionBtn').textContent, 'answer': getId('UR2T-editor-response').value };
            break;
        case 'Ajouter une réponse automatique':
            //if(getId('UR2T-editor-cat-id').value == 0)return;
            UR2T_export.datas[getId('UR2T-editor-cat-id').value] = { 'name': getId('dropdownCatBtn').textContent, 'objects': {} };
            UR2T_export.datas[getId('UR2T-editor-cat-id').value].objects[getId('UR2T-editor-question-id').value] = { 'question': getId('UR2T-editor-question').value, 'answer': getId('UR2T-editor-response').value };
            //console.dir(UR2T_export);
            break;
        case 'Supprimer une réponse':
            UR2T_export.datas[getId('UR2T-editor-cat-id').value] = { 'name': getId('dropdownCatBtn').textContent, 'objects': {} };
            UR2T_export.datas[getId('UR2T-editor-cat-id').value].objects[getId('UR2T-editor-question-id').value] = { 'question': getId('dropdownQuestionBtn').textContent, 'answer': 'delete' };
            break;
        case 'Import / Export Serveur':
            UR2T.lastSave = getActualDate();
            UR2T_export.user.lastSave = UR2T.lastSave;
            for (var cat in UR2T.answers.UR) {
                if (cat == 'outils') continue;
                UR2T_export.datas[cat] = { 'name': UR2T.answers.UR[cat].name, 'objects': {} };
                for (var scat in UR2T.answers.UR[cat].objects) {
                    UR2T_export.datas[cat].objects[scat] = { 'question': UR2T.answers.UR[cat].objects[scat].question, 'answer': UR2T.answers.UR[cat].objects[scat].answer };
                }
            }
            break;
    }
    transmitDatas();

    function transmitDatas() {
        //console.log("WME UR2T: UR2T_export: ", UR2T_export);
        var myJSON = new exportJSON();
        var UR2T_export_JSON = myJSON.escape(JSON.stringify(UR2T_export));
        //console.log("WME UR2T: UR2T_export_JSON: ", UR2T_export_JSON);
        var ret = GM_xmlhttpRequest({
            method: "POST",
            url: "https://wme-response-type.brume.org/UR2T/manageDatas.php",
            data: "JSONdatas=" + UR2T_export_JSON,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            onload: function (r) {
                showBtns('Fermer');
                updateLogZone('Ok', "Sauvegarde Locale Ok.", 2000);
                console.log(r.response);
                if (r.responseText.search("Erreur serveur") != -1) {
                    unsafeWindow.setTimeout(function () { updateLogZone('Error', "Erreur Sauvegarde Serveur", 3000) }, 3000);
                    console.log("WME UR2T: " + r.responseText);
                } else {
                    unsafeWindow.setTimeout(function () { updateLogZone('Ok', r.responseText, 3000) }, 3000);
                }
            },
            onerror: function (r) {
                showBtns('Fermer');
                updateLogZone('Error', "Erreur serveur.", 2000);
                unsafeWindow.setTimeout(function () { updateLogZone('Ok', "Sauvegarde Locale Ok.", 3000) }, 3000);
                console.log("WME UR2T: Error: " + r.responseText);
            }
        });
    }
}



function checkFormat() {
    if (getId('UR2T_import_chk').checked) return;
    var fill = false;
    var nomFichier = "";

    var d = new Date();

    var n = d.toJSON();
    //n = ((n.replace(/-|:/g, "")).replace(/T/g, "-")).split(".");
    n = (n.replace(/-/g, "")).split("T");
    var exportDate = n[0] + "-" + (d.toLocaleTimeString()).replace(/:/g, "");
    //log('exportDate= ' + exportDate);

    switch (getSelectedValue('UR2T_type_select')) {
        case 'JSON':
            var UR2T_export = {};
            for (var cat in UR2T.answers.UR) {
                if (cat == 'outils') continue;
                UR2T_export[cat] = UR2T.answers.UR[cat];
            }
            UR2T_export = JSON.stringify(UR2T_export);

            //nomFichier = 'Export_' + GM_info.script.name + '_' + exportDate + '.txt';
            nomFichier = 'Export_UR2T_' + exportDate + '.JSON';
            fill = true;
            break;
        case 'CSV':
            var myCSV = new CSV();
            var UR2T_export = '"Cat_Id";"Cat_Name";"Q_Id";"question";"réponse"\n';
            for (var cat in UR2T.answers.UR) {
                if (cat == 'outils') continue;
                for (var scat in UR2T.answers.UR[cat].objects) {
                    UR2T_export += '"' + cat + '";"' + UR2T.answers.UR[cat].name + '";"' + scat + '";"' + myCSV.escape(UR2T.answers.UR[cat].objects[scat].question) + '";"' + myCSV.escape(UR2T.answers.UR[cat].objects[scat].answer) + '"\n';
                }
            }
            UR2T_export = UR2T_export.slice(0, UR2T_export.lastIndexOf('\n'));
            nomFichier = 'Export_UR2T_' + exportDate + '.csv';
            fill = true;
            break;
        case 'XML':
            var UR2T_export = '<?xml version="1.0" encoding="UTF-8"?>\n<UR2T>\n';
            for (var cat in UR2T.answers.UR) {
                if (cat == 'outils') continue;
                UR2T_export += '<categorie>\n<id>' + cat + '</id>\n<name>' + UR2T.answers.UR[cat].name + '</name>\n<objects>\n';
                for (var scat in UR2T.answers.UR[cat].objects) {
                    UR2T_export += '<subCat>\n';
                    UR2T_export += '<id>' + scat + '</id>\n';
                    UR2T_export += '<question>' + UR2T.answers.UR[cat].objects[scat].question + '</question>\n';
                    UR2T_export += '<answer>' + UR2T.answers.UR[cat].objects[scat].answer + '</answer>\n';
                    UR2T_export += '</subCat>\n';
                }
                UR2T_export += '</objects>\n</categorie>\n';
            }
            UR2T_export += '</UR2T>';
            nomFichier = 'Export_UR2T_' + exportDate + '.xml';
            fill = true;

            break;
    }
    if (fill) {
        getId('UR2T_nomFichier').innerHTML = nomFichier;
        getId('UR2T_download').style.visibility = 'visible';
        //getId('UR2T_link').style.visibility = 'visible';
        getId('UR2T_download').setAttribute('download', nomFichier);
        getId('UR2T_download').href = 'data:Application/octet-stream,' + encodeURIComponent(UR2T_export);
        getId('UR2T_download').onclick = function () { updateLogZone('Ok', 'Le Fichier ce trouve dans le dossier téléchagement.', 8000); };
        var myTextarea = getId('UR2T-import-export-txt');
        myTextarea.value = UR2T_export;
        myTextarea.focus();
    }
}

function CSV() {
    this.escape = function (texte) {
        // console.info('CSV.escape called : ' + texte);
        texte = texte.replace(/\n/gm, "0x0D");
        texte = texte.replace(/"/gm, "0x22");
        // texte = texte.replace(/'/gm, "0x27");
        //texte = texte.replace(/,/gm, "0x2C");
        texte = texte.replace(/;/gm, "0x3B");
        return texte;
    };
    this.unescape = function (texte) {
        texte = unquote(texte);
        texte = texte.replace(/0x0D/gm, "\n");
        texte = texte.replace(/0x22/gm, "\"");
        // texte = texte.replace(/0x27/gm, "'");
        //texte = texte.replace(/0x2C/gm, ",");
        texte = texte.replace(/0x3B/gm, ";");
        return texte;
    };
    function unquote(texte) {
        texte = texte.replace(/^"|"$/gm, '');
        return texte;
    };
    // console.info('CSV called');
}

function exportJSON() {
    this.escape = function (texte) {
        // console.info('CSV.escape called : ' + texte);
        texte = texte.replace(/&/gm, "0x26");
        return texte;
    };
    this.unescape = function (texte) {
        texte = texte.replace(/0x26/gm, "&");
        return texte;
    };
}

function htmlTools() {
    this.decode = function (texte) {
        texte = texte.replace(/&gt;/gm, ">");
        texte = texte.replace(/&lt;/gm, "<");
        texte = texte.replace(/&amp;/gm, "&");
        texte = texte.replace(/&nbsp;/gm, " ");
        texte = texte.replace(/&quot;/gm, "\"");
        return texte;
    };
    this.encode = function (texte) {
        texte = texte.replace(/>/gi, "&gt;");
        texte = texte.replace(/</gi, "&lt;");
        texte = texte.replace(/&/gi, "&amp;");
        texte = texte.replace(/ /gi, "&nbsp;");
        texte = texte.replace(/"/gi, "&quot;");
        return texte;
    };
}

function showBtns(btnList) {
    var btnsArr = btnList.split('|');
    for (var i = 0; i < 2; i++) {
        if (i < btnsArr.length) {
            getId('UR2T-editor-btn-' + i).style.visibility = 'visible';
            getId('UR2T-editor-btn-' + i).innerHTML = btnsArr[i];
        }
        else
            getId('UR2T-editor-btn-' + i).style.visibility = 'hidden';
    }
}

function updateLogZone(state, text, timeBefore) {
    if (typeof (timeOut) != 'undefined') {
        // console.info(timeOut);
        clearTimeout(timeOut);
    }
    //log('state= ', state);
    var textZone = getId('UR2T-editor-log');
    if (state == "Ok") {
        textZone.style.color = 'green';
    }
    if (state == "Error") {
        textZone.style.color = 'red';
    }
    if (timeBefore > 0) {
        textZone.innerHTML = text;
        timeOut = unsafeWindow.setTimeout(function () { textZone.innerHTML = ''; }, timeBefore);
    }
    else textZone.innerHTML = '';
}

function UR2T_GetUserResponses() {
    var UR2T_import = {};
    UR2T_import.script = "UR2T";
    UR2T_import.user = {};
    UR2T_import.user.id = UR2T_Waze_user.attributes.id;
    UR2T_import.user.rank = UR2T_Waze_user.attributes.rank + 1;
    UR2T_import.user.userName = UR2T_Waze_user.attributes.userName;
    UR2T_import.user.lastSave = UR2T.lastSave;
    UR2T_import.action = "r";
    var UR2T_import_JSON = JSON.stringify(UR2T_import);
    //console.log("JSONdatas=" + UR2T_import_JSON)
    var ret = GM_xmlhttpRequest({
        method: "POST",
        url: "https://wme-response-type.brume.org/UR2T/manageDatas.php",
        data: "JSONdatas=" + UR2T_import_JSON,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        onload: function (r) {
            if (r.responseText.search("Erreur serveur") != -1) {
                if (getId('UR2T-editor') !== null) updateLogZone('Error', "Erreur Import Serveur.", 3000);
                console.log("WME UR2T: Erreur Import Serveur: ", r.responseText);
            } else {
                if (getId('UR2T-editor') !== null) updateLogZone('Ok', "Import Serveur Ok.", 3000);
                console.log("WME UR2T: Import Serveur Ok.");
            }
            UR2T_convertResponses(r.responseText);
            //console.log(r.responseText)
            //console.log("WME UR2T: Debug : ", r.responseText);
        },
        onerror: function (r) { console.log("WME UR2T: Error: ", r.responseText); }
    });
}

function UR2T_convertResponses(jsonText) {
    //console.log("WME UR2T: resultat import jsonText: ", jsonText);
    try {
        var myJSON = new exportJSON();
        var datas = JSON.parse(myJSON.unescape(jsonText));
        console.log("WME UR2T: resultat import: ", datas);
        //	Les UR
        var UR2T_import = datas.UR;
        for (var cat in UR2T_import) {
            //	Protect object
            if (typeof (UR2T.answers.UR[cat]) == 'undefined') continue;
            //	Update object
            for (var scat in UR2T_import[cat].objects) {
                scat = Number(scat);
                if (typeof (UR2T.answers.UR[cat].objects[scat]) == 'undefined') {
                    UR2T.answers.UR[cat].objects[scat] = {};
                    UR2T.answers.UR[cat].objects[scat].question = UR2T_import[cat].objects[scat].question;
                    UR2T.answers.UR[cat].objects[scat].answer = UR2T_import[cat].objects[scat].answer;
                    UR2T.answers.UR[cat].objects[scat].isPerso = true;
                }
                else {
                    if (UR2T.answers.UR[cat].objects[scat].question != UR2T_import[cat].objects[scat].question || UR2T.answers.UR[cat].objects[scat].answer != UR2T_import[cat].objects[scat].answer) {
                        UR2T.answers.UR[cat].objects[scat].question = UR2T_import[cat].objects[scat].question;
                        UR2T.answers.UR[cat].objects[scat].answer = UR2T_import[cat].objects[scat].answer;
                        UR2T.answers.UR[cat].objects[scat].isPerso = true;
                    }
                }
            }
        }
        //	La signature
        UR2T.userSign = datas.userSign;
        UR2T.lastSave = getActualDate();
        UpdateLS();
        if (getId('UR2T-editor') !== null) {
            showBtns('Fermer');
            unsafeWindow.setTimeout(function () { updateLogZone('Ok', "Sauvegarde Locale Ok.", 2000) }, 3000);
        }
    } catch (e) {
        if (getId('UR2T-editor') !== null) {
            showBtns('Fermer');
            unsafeWindow.setTimeout(function () { updateLogZone('Error', "Erreur Sauvegarde Locale.", 2000) }, 3000);
        }
        console.log("WME UR2T: Error: ", e);
    }

}

/*function csvHandlers()
{
    var e = null;
 
    e=getId('UR2T_file');
    if (e)
        e.addEventListener('change', fileChanged);
 
}*/
function parseFile(nomFichier, stringFile) {
    if (stringFile != null) {
        log('affichage file');
        var myTextarea = getId('UR2T-import-export-txt');
        //getId('UR2T_import_file').value = "";
        nomFichier = nomFichier.split('.');
        var ext = (nomFichier[nomFichier.length - 1]).toUpperCase();
        if (ext == "CSV" || ext == "JSON") { // || ext =="XML"){
            updateLogZone('Ok', 'Fichier .' + ext + ' est pret a être sauvegarder.', 5000);
            showBtns('Fermer|Sauvegarder');
            myTextarea.value = stringFile;
            getId('UR2T_nomFichier').innerHTML = nomFichier;
            getId('UR2T-editor-btn-1').onclick = function () { imports(stringFile, ext); };
        } else {
            myTextarea.value = '';
            getId('UR2T_nomFichier').innerHTML = "Aucun fichier selectionné...";
            getId('UR2T_import_file').value = "";
            updateLogZone('Error', 'Fichier .' + ext + ' non pris en charge.\nVeuillez selectionner une ficher de type csv JSON ou xml.', 6000);
        }

    }
}


var openFile = function (event) {
    var f = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
        var contents = e.target.result;
        var fileName = f.name;
        log('file = ', fileName);
        parseFile(fileName, contents);
    };
    reader.readAsText(f);
};



function imports(stringFile, ext) {
    //log('file =');
    //log(stringFile);

    //var myTextarea = getId('UR2T_text');
    //var leTexte = myTextarea.value;
    var UR2T_import = {};
    var myImport = false;
    var identical = false;
    switch (ext) {
        case 'JSON':
            try {
                UR2T_import = JSON.parse(stringFile);
            }
            catch (e) {
                updateLogZone('Error', 'Erreur de syntaxe JSON : @char ' + (e.message.match(/column ([0-9]+)/)[1] - 1), 15000);
                return;
            }
            for (var cat in UR2T_import) {
                //	Protect object
                if (typeof (UR2T.answers.UR[cat]) == 'undefined') continue;
                //	Update object
                for (var scat in UR2T_import[cat].objects) {
                    if (typeof (UR2T.answers.UR[cat].objects[scat]) == 'undefined') {
                        UR2T.answers.UR[cat].objects[scat] = {};
                        UR2T.answers.UR[cat].objects[scat].question = UR2T_import[cat].objects[scat].question;
                        UR2T.answers.UR[cat].objects[scat].answer = UR2T_import[cat].objects[scat].answer;
                        UR2T.answers.UR[cat].objects[scat].isPerso = true;
                        myImport = true;
                    }
                    else {
                        if (UR2T.answers.UR[cat].objects[scat].question != UR2T_import[cat].objects[scat].question || UR2T.answers.UR[cat].objects[scat].answer != UR2T_import[cat].objects[scat].answer) {
                            UR2T.answers.UR[cat].objects[scat].question = UR2T_import[cat].objects[scat].question;
                            UR2T.answers.UR[cat].objects[scat].answer = UR2T_import[cat].objects[scat].answer;
                            UR2T.answers.UR[cat].objects[scat].isPerso = true;
                            myImport = true;
                        }
                        else identical = true;
                    }
                }
            }
            updateLogZone('Ok', 'Import Ok', 5000);
            UR2T.lastSave = getActualDate();
            UpdateLS();
            break;
        case 'CSV':
            var myCSV = new CSV();
            var CSVarray = stringFile.split('\n');
            //console.dir(CSVarray);
            //***	Check CSV datas		**
            if (CSVarray.length < 2) {
                updateLogZone('Error', 'Erreur de syntaxe CSV : @line 1', 15000);
                return;
            }
            var error = false;
            for (var line = 0; line < CSVarray.length; line++) {
                var datas = (CSVarray[line]).split(';');
                log('CSV line N° ' + line);
                if (datas.length > 2 && datas.length != 5) {
                    error = true;
                }
                if (line == 0 && !error) {
                    if (myCSV.unescape(datas[0]) != 'Cat_Id') {
                        error = true;
                        if (myCSV.unescape(datas[1]) != 'Cat_Name' && !error) {
                            error = true;
                            if (myCSV.unescape(datas[2]) != 'Q_Id' && !error) {
                                error = true;
                                if (myCSV.unescape(datas[3]) != 'question' && !error) {
                                    error = true;
                                    if (myCSV.unescape(datas[4]) != 'réponse' && !error) {
                                        error = true;
                                    }
                                }
                            }
                        }
                    }
                }
                if (error) {
                    updateLogZone('Error', 'Erreur de syntaxe CSV : @line ' + Number(line + 1), 15000);
                    //log('Erreur de syntaxe CSV datas = ', datas);
                    return;
                }
                console.info(line);
                console.dir(datas);
                if (datas.length == 5) {
                    var cat = myCSV.unescape(datas[0]);
                    var scat = myCSV.unescape(datas[2]);
                    var question = myCSV.unescape(datas[3]);
                    var answer = myCSV.unescape(datas[4]);
                    //console.log(cat + ' ' + scat + '\n' + question + '\n' + answer);
                    //	Protect object
                    if (typeof (UR2T.answers.UR[cat]) == 'undefined') continue;
                    if (typeof (UR2T.answers.UR[cat].objects[scat]) == 'undefined') {
                        UR2T.answers.UR[cat].objects[scat] = {};
                        UR2T.answers.UR[cat].objects[scat].question = question;
                        UR2T.answers.UR[cat].objects[scat].answer = answer;
                        UR2T.answers.UR[cat].objects[scat].isPerso = true;
                        myImport = true;
                    }
                    else {
                        if (UR2T.answers.UR[cat].objects[scat].question != question || UR2T.answers.UR[cat].objects[scat].answer != answer) {
                            UR2T.answers.UR[cat].objects[scat].question = question;
                            UR2T.answers.UR[cat].objects[scat].answer = answer;
                            UR2T.answers.UR[cat].objects[scat].isPerso = true;
                            myImport = true;
                        }
                        else identical = true;
                    }
                }
            }
            updateLogZone('Ok', 'Import Ok', 5000);
            UR2T.lastSave = getActualDate();
            UpdateLS();
            break;
        case 'XML':
            if (unsafeWindow.DOMParser) {
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(stringFile, "text/xml");
                // console.info(xmlDoc);
                if (typeof (xmlDoc.getElementsByTagName("parsererror")[0]) != 'undefined') {
                    var error = xmlDoc.getElementsByTagName("parsererror")[0];
                    textError = error.innerHTML;
                    // console.info(textError);
                    updateLogZone('Error', 'Erreur de syntaxe XML : @line ' + textError.match(/ligne ([0-9]+)/)[1], 15000);
                    return;
                }
                var base = xmlDoc.getElementsByTagName("UR2T")[0];
                for (var catIndex in base.getElementsByTagName("categorie")) {
                    var cat = base.getElementsByTagName("categorie")[catIndex];
                    if (typeof (cat) != 'object') continue;
                    var CId = cat.getElementsByTagName("id")[0].innerHTML;
                    // Protect objects
                    if (typeof (UR2T.answers.UR[CId]) == 'undefined') continue;
                    // console.info('Catégorie : ' + UR2T.answers.UR[CId].name);
                    var objects = cat.getElementsByTagName("objects")[0];
                    for (var childScat in objects.getElementsByTagName("subCat")) {
                        var myHtml = new htmlTools();
                        var scat = objects.getElementsByTagName("subCat")[childScat];
                        if (typeof (scat) != 'object') continue;
                        var sCId = scat.getElementsByTagName("id")[0].innerHTML;
                        // console.info(CId + " " + sCId);
                        var SCQuestion = myHtml.decode(scat.getElementsByTagName("question")[0].innerHTML);
                        // console.info(typeof(SCQuestion));
                        var SCAnswer = myHtml.decode(scat.getElementsByTagName("answer")[0].innerHTML);
                        // console.info(typeof(SCAnswer));
                        //	update object
                        var UR2T_object = UR2T.answers.UR[CId].objects[sCId];
                        // console.dir(UR2T_object);
                        if (typeof (UR2T_object) == 'undefined') {
                            // console.info('new element');
                            UR2T_object = {};
                            UR2T_object.question = SCQuestion;
                            UR2T_object.answer = SCAnswer;
                            // console.dir(UR2T);
                            myImport = true;
                        }
                        else {
                            // console.info('updating element');
                            if (UR2T_object.question != SCQuestion || UR2T_object.answer != SCAnswer) {
                                UR2T_object.question = SCQuestion;
                                UR2T_object.answer = SCAnswer;
                                myImport = true;
                                // console.info('elements are different');
                            }
                            else {
                                identical = true;
                                // console.info('elements are similar');
                            }
                        }
                    }
                }
            }
            updateLogZone('Ok', 'Import Ok', 5000);
            UR2T.lastSave = getActualDate();
            UpdateLS();
            break;
    }


}