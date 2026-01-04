// ==UserScript==
// @name            WF ToolBox Lib i18n Label
// @namespace       WFTB_ns
// @version         0.1.11
// @description:en  When perma is present to offer his version for beta + classic editor and add the profile editor waze and much more
// @description:fr  Quand un perma est présent proposer sa version pour l'éditeur beta + classique et ajout du editor profile waze et bien plus encore
// @author          exolium
// @copyright       2015-2020 exolium
// @licence         GNU GPL v2
// @grant           GM_xmlhttpRequest
// @description When perma is present to offer his version for beta + classic editor and add the profile editor waze
// ==/UserScript==

//============================== Options ================================//

//============================== Lang ================================//
var WFTB_lang_en = 0;
var WFTB_lang_fr = 1;

var WFTB_lang = WFTB_lang_fr;

var WFTB_label_setting_manager = ['Settings Manager', 'Gestionnaire de Paramètres'];
var WFTB_label_close = ['Close', 'Fermer'];
var WFTB_label_OiBE = ['Open in beta editor', 'Ouvrir dans l\'éditeur beta'];
var WFTB_label_OiPE = ['Open in public editor', 'Ouvrir dans l\'éditeur public'];

var WFTB_help_oc_setting = ['\nFirefox : [Alt] [Shift] + AccessKey\nChrome : [Alt] + AccessKey\nAccessKey :\n - W : Open Settings Manager \n - Q : Close Settings Manager ', '\nFirefox : [Alt] [Shift] + Touche d\'accès\nChrome : [Alt] + Touche d\'accès\nTouches d\'accès :\n - W : Ouvrir la Fenêtre de Configuration \n - Q : Fermer la Fenêtre de Configuration '];
