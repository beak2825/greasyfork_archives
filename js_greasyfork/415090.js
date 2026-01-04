// ==UserScript==
// @name            WF ToolBox Alpha
// @icon            data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wYBBicLUdqBwAAAA1lJREFUWMPFl0tIVFEYx39nug46qE1DYoWU1KJAKZHEoEVRLhwXQUFGKG6CHpsy7KlEi/BJA7myxyKoGSKDAhfpwoIWQWJgQzNQQTZa9DJKKjTG0dPijDo6984cG6UPLsy9c875/8/3/oSUEl15FITuF8iBIQiNwOiY+u50QP5KKMoH9xZEWaH2kQgdAie9yPZukBHASLI4uqa2HBoPIBz2FAg0dyHrfRqgVjIBTdVwfg9iwQQKzyKDw4CN1GQKCtZC/yVEup04JnEEJibBdRj5+w+LKpnpEGpHuDLnkogjkHVo8cFjSXztQGTE+IVtvtqXChzg9x8oucCcG9tiHS44nCLCpApJItZLgsMKK45AvTd1h3MXw48bcO0IELZYZIN6H4yFYwicvI0kzWKDVDfTeVY51ZbDu8BXm4CEAQ13lRaElBJbFebBOAmXayDPBToJc0MulKyffX/wHPa1gdnlBDDlQxi9AesM5y6Guop/N8nerVC9E7xPTRQbgd4AGD1+pFWmexSEgRCsWaEHmGGH7IzZ99A36OyzNkOPH2kMDFkfGI5A8ZmojTWkugxuH1O/33yCTacgkeUGhsAIjSQ5Nc3chqYOHk1xL9/D5rNgXQGiGhoBY7qkLobcegLjYbj3LDk4qHKuH/kS9peq4mKtArjXpwc+s8Xp0AP3t0DncajZsXgaczrAyM+Bwa+JF77ywMbV0eoqAd16sSyx/+TngKjzSul5aL7AbsBrj2q3puXnuLKzjnz8Adsuqmgyk7oKMMq3IDxd5rmgsnQuOKg4j431RJK7HHYXQLffvHUrL0IkTsUTcP807C2Z/dQ/CG+/aDSbAj58h1O3oqawSsUAJ8rhSo95DtjXBt5aqNquPnX0ws3Hui5uDg5wwh1TDZsOICxruB2qr8D1KOjn0eihOo+w7pwbK9W/My1ZSxfy/J0EPUEEnNkw+sv6VrpNavNBOLdnHoGZTvgDSyoFeRBondXNHALjE5B7FPnrfzWl6Wnwrh2Rlb404KF2NRuYNqXToeHKhC9XEYV5SfL+QgaTPHXz+TMBZi4ngIw0eNmKaD6YuMNNKhHlcIFWpXbxL8PpWBgaOhc2nApD5ZaUh9O4Fi0A3X7kiyF4N388z4GideAuQpQV6CvpLyjrNaUqOdRiAAAAAElFTkSuQmCC
// @namespace       WFTB_ns
// @version         0.2.6.60
// @description:en  When perma is present to offer his version for beta + classic editor and add the profile editor waze and much more
// @description     Quand un perma est présent proposer sa version pour l'éditeur beta + classique et ajout du editor profile waze et bien plus encore
// @author          exolium
// @match           http://*.waze.com/forum/*
// @match           https://*.waze.com/forum/*
// @match           http://waze.com/forum/*
// @match           https://waze.com/forum/*
// @exclude         http://*.waze.com/*user/*
// @exclude         https://*.waze.com/*user/*
// @exclude         http://waze.com/*user/*
// @exclude         https://www.waze.com/forum/ucp.php?i=164
// @exclude         https://waze.com/*user/*
// @require         https://greasyfork.org/scripts/439116-wf-global-lib/code/WF%20Global%20Lib.js
// @require         https://greasyfork.org/scripts/416773-wf-toolbox-lib-i18n-label/code/WF%20ToolBox%20Lib%20i18n%20Label.js
// @require         https://greasyfork.org/scripts/416769-wf-toolbox-lib-alpha/code/WF%20ToolBox%20Lib%20Alpha.js
// @copyright       2015-2022 exolium
// @license         GNU GPL v2
// @grant           GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/415090/WF%20ToolBox%20Alpha.user.js
// @updateURL https://update.greasyfork.org/scripts/415090/WF%20ToolBox%20Alpha.meta.js
// ==/UserScript==

/* **************************************************************************** *
 * Info version : Alpha release      : 0.0.1.1, 0.1.1.1, 1.1.2.1,...
 * Info version : Beta release       :  0.0.1 ,  0.2.1 ,  1.1.1 ,...
 * Info version : Production release :   1.0  ,   1.1  ,   2.0  ,...
 * **************************************************************************** *
 * Thanks to beta tester and script developer who bring innovative ideas to me
 * myriades, sebiseba, d2, laurenthembord, laurenthembprd,....
 * **************************************************************************** */

WFTB_lang=WFTB_lang_fr;

/*
recherche si beta tester
https://www.waze.com/forum/memberlist.php?username=exolium&search_group_id=10

cookies => phpbb3_waze_u id forum
Localstorage =>
_wazewrap_settings login
user
*/

var WFTB_G_SearchEditorLevel = '/html/head/script';
var WFTB_G_ListEditorLevel = Array();
var WFTB_G_URL_UserProfil = 'https://www.waze.com/fr/user/editor/';

//============================== WFTB_Initialise =======================//
function WFTB_Initialise() {
    WFTB_Log('WFTB_Initialise', 4, 'Start');

    /**/
    if(typeof localStorage.user === 'undefined'){
        WFTB_Log('WFTB_Initialise', 5, 'Initialise localstorage WFTB_data');
    } else WFTB_profil = JSON.parse(localStorage.user);

    // Delete old local storage Setting
    if(typeof localStorage.WFTB_setting != 'undefined') {
        localStorage.removeItem('WFTB_setting');
    }

    // Delete old local storage Data
    if(typeof localStorage.WFTB_data != 'undefined') {
        localStorage.removeItem('WFTB_data');
    }

    // Local Storage Setting
    if(typeof localStorage.WFTB_settings === 'undefined') {
        localStorage.setItem('WFTB_settings', '{"app_name":"' + GM_info.script.name + '", "version":"' + GM_info.script.version + '","lang":"' + navigator.language + '"}');

        WFTB_Log('WFTB_Initialise', 5, 'Initialise localstorage WFTB_settings');
    }
    else WFTB_Log('WFTB_Initialise', 5, 'localstorage WFTB_settings already exist... Restaure Settings');
    WFTB_Log('WFTB_Initialise', 5, 'WFTB_setting.length=' + localStorage.WFTB_settings.length);

    WFTB_Settings = JSON.parse(localStorage.WFTB_settings);

    WFTB_Log('WFTB_Initialise', 5, 'WFTB_settings.length=' + typeof localStorage.WFTB_settings);
    WFTB_Log('WFTB_Initialise', 5, 'WFTB_settings app_name ' + WFTB_Settings.app_name);
    WFTB_Log('WFTB_Initialise', 5, 'app_version ' + WFTB_Settings.version);
    WFTB_Log('WFTB_Initialise', 5, 'lang localstorage ' + WFTB_Settings.lang);

    // Local Storage Data
    if(typeof localStorage.WFTB_datas === 'undefined') {
        localStorage.setItem('WFTB_datas', '{}');

        WFTB_Log('WFTB_Initialise', 5, 'Initialise localstorage WFTB_data');
    }
    else WFTB_Log('WFTB_Initialise', 5, 'localstorage WFTB_datas already exist... Restaure Datas');
    WFTB_Log('WFTB_Initialise', 5, 'WFTB_datas.length=' + localStorage.WFTB_datas.length);


    /**/
    WFTB_data = JSON.parse(localStorage.WFTB_datas);
    WFTB_checkupdate();

    if(WFTB_profil.login) WFTB_Log('WFTB_Initialise', 5, 'username : ' + WFTB_profil.message);
    else WFTB_Log('WFTB_Initialise', 'warn', 'username : Anonymous');

    //
    WFTB_is_beta_editor();
    WFTB_AddUserProfil();
    WFTB_settings();
    WFTB_version();
    //WFTB_LoadEditorProfile();
    WFTB_Log('WFTB_Initialise', 4, 'End');
}

//============================== Popup Settings Manager ========================//
function WFTB_ChangeBGColor(){
    document.body.bgColor = '#000000';
}

//============================== Popup Settings Manager ========================//
function WFTB_settings() {
    WFTB_Log('WFTB_Settings', 4, 'Start');

    var WFTB_L_SettingsName = 'WF Toolbox Settings';
    var WFTB_L_text = WFTB_Settings.app_name + ' ' + WFTB_Settings.version + ' - ' + WFTB_label_setting_manager [WFTB_lang];
    var WFTB_L_title = WFTB_L_text + WFTB_help_oc_setting[WFTB_lang];
    var WFTB_L_sbm = document.createElement('div');
    var WFTB_L_sbm_title = document.createElement('div');
    var WFTB_L_sbm_content = document.createElement('div');
    var WFTB_L_sbm_footer = document.createElement('div');
    var WFTB_L_sbm_footer_a_close = document.createElement('a');
    var WFTB_L_sbm_open_link_tab = document.createElement('li');
    var WFTB_L_sbm_open_link_tab_a = document.createElement('a');
    var WFTB_L_sbm_open_link_tab_a_span = document.createElement('span');
    var WFTB_L_sbm_open_link_listlink = document.createElement('a');
    var WFTB_L_sbm_style = '';
    var WFTB_L_sbm_height = '80%';
    var WFTB_L_sbm_width = '80%';
    var WFTB_L_LinkList = '';
    var WFTB_L_setting_tab = document.createElement('table'); //wftb_settings_box_content

    //
    WFTB_L_sbm.id = 'wftb_settings_box';
    WFTB_L_sbm.setAttribute('style','border: 2px solid #333;z-index: 10;');
    WFTB_L_sbm.style.display = 'none';
    WFTB_L_sbm.style.position = 'absolute';
    if(window.innerWidth > 960) WFTB_L_sbm.style.left = (window.innerWidth / 2 - 430) + 'px';
    else WFTB_L_sbm.style.left = '50px';
    WFTB_L_sbm.style.top = '150px';
    WFTB_L_sbm.style.height = '420px';
    WFTB_L_sbm.style.width = '860px';
    WFTB_L_sbm.style.textAlign = 'center';
    WFTB_L_sbm.style.backgroundColor = '#FFFFFF';

    //
    WFTB_L_sbm_title.id = 'wftb_settings_title';
    WFTB_L_sbm_title.setAttribute('style','height: 20px; background-color: #0177b3; border-bottom: 1px solid #666; vertical-align: middle; font-weight: bold; font-size: 12px; line-height: 1.7;');
    WFTB_L_sbm_title.style.color = '#ffffff';
    WFTB_L_sbm_title.innerHTML = WFTB_L_text;

    //
    WFTB_L_sbm_content.id = 'wftb_settings_box_content';
    WFTB_L_sbm_content.style.height = '378px';
    WFTB_L_sbm_content.style.backgroundColor = '#e1ebf2';
    WFTB_L_sbm_content.appendChild(document.createTextNode('Comming Sooooon ' + WFTB_version()));
    WFTB_L_sbm_content.appendChild(document.createElement('br'));
    WFTB_L_sbm_content.appendChild(document.createTextNode('Width : ' + window.innerWidth));
    WFTB_L_sbm_content.appendChild(document.createElement('br'));
    WFTB_L_sbm_content.appendChild(document.createTextNode('Height : ' + window.innerHeight));

    //
    WFTB_L_sbm_footer.id = 'wftb_settings_box_footer';
    WFTB_L_sbm_footer.setAttribute('style','height: 20px; border-top: 1px solid #666; font-weight: bold; font-size: 12px; line-height: 1.7;');
    WFTB_L_sbm_footer.style.height = '20px';
    WFTB_L_sbm_footer.style.backgroundColor = 'rgb(126, 167, 187)';

    //
    WFTB_L_sbm_footer_a_close.id='wftb_settings_close';
    WFTB_L_sbm_footer_a_close.setAttribute('accesskey','q');
    WFTB_L_sbm_footer_a_close.href = 'javascript:void(0)';
    WFTB_L_sbm_footer_a_close.title = WFTB_L_title;
    WFTB_L_sbm_footer_a_close.innerHTML = WFTB_label_close[WFTB_lang];

    //
    WFTB_L_sbm_footer.appendChild(WFTB_L_sbm_footer_a_close);

    //
    WFTB_L_sbm_open_link_listlink.id = 'wftb_settings_open_ll';
    WFTB_L_sbm_open_link_listlink.href = 'javascript:void(0)';
    WFTB_L_sbm_open_link_listlink.setAttribute('accesskey','w');
    WFTB_L_sbm_open_link_listlink.title = WFTB_L_title;
    WFTB_L_sbm_open_link_listlink.innerHTML = WFTB_L_SettingsName;

    //
    WFTB_L_setting_tab.id = 'wftb_settings_box_tab';
    WFTB_L_setting_tab.id = 'wftb_settings_box_tab';
    WFTB_L_setting_tab.id = 'wftb_settings_box_tab';
    WFTB_L_setting_tab.id = 'wftb_settings_box_tab';
    WFTB_L_setting_tab.id = 'wftb_settings_box_tab';
    WFTB_L_setting_tab.id = 'wftb_settings_box_tab';
    WFTB_L_sbm_content.appendChild(WFTB_L_setting_tab);
    //
    WFTB_L_sbm.appendChild(WFTB_L_sbm_title);
    WFTB_L_sbm.appendChild(WFTB_L_sbm_content);
    WFTB_L_sbm.appendChild(WFTB_L_sbm_footer);

    //
    WFTB_Log('WFTB_Settings', 5, '************************');
    WFTB_Log('WFTB_Settings', 5, document.getElementsByTagName('style')[0].innerHTML);
    WFTB_Log('WFTB_Settings', 5, '************************');
    document.getElementsByTagName('style')[0].innerHTML = document.getElementsByTagName('style')[0].innerHTML + WFTB_L_sbm_style;
    WFTB_Log('WFTB_Settings', 5, document.getElementsByTagName('style')[0].innerHTML);
    WFTB_Log('WFTB_Settings', 5, '************************');

    //
    document.body.appendChild(WFTB_L_sbm);

    //
    WFTB_L_sbm_open_link_tab_a.id = 'wftb_settings_open_lt';
    WFTB_L_sbm_open_link_tab_a.title = WFTB_L_title;
    WFTB_L_sbm_open_link_tab_a.href = 'javascript:void(0)';

    //
    WFTB_L_sbm_open_link_tab_a_span.innerHTML = WFTB_L_SettingsName;

    //
    WFTB_L_sbm_open_link_tab_a.appendChild(WFTB_L_sbm_open_link_tab_a_span);
    WFTB_L_sbm_open_link_tab.appendChild(WFTB_L_sbm_open_link_tab_a);

    // Add "WF Toolbox Settings" link on tab to User Control Panel
    WFTB_Log('WFTB_Settings', 5, document.getElementById('tabs'));
    if(document.getElementById('tabs') !== null) document.getElementById('tabs').getElementsByTagName('ul')[0].appendChild(WFTB_L_sbm_open_link_tab);

    // Search ListLink
    WFTB_L_LinkList = WFTB_xpath(WFTB_search_linklist, document);
    WFTB_Log('WFTB_Settings', 5, 'xpath linklist ' + WFTB_L_LinkList.length);

    // Add "WF Toolbox Settings" link on linklist
    if(WFTB_L_LinkList.length == 1) {
        WFTB_L_LinkList[0].appendChild(document.createTextNode(" • "));
        WFTB_L_LinkList[0].appendChild(WFTB_L_sbm_open_link_listlink);
    }

    // Add event onclic to "Close" link
    document.getElementById('wftb_settings_close').onclick = function() {
        document.getElementById('wftb_settings_box').style.display = 'none';
    };

    // Add event onclic to "WF Toolbox Settings" link on tab to User Control Panel
    if(document.getElementById('tabs') !== null) {
        document.getElementById('wftb_settings_open_lt').onclick = function() {
            document.getElementById('wftb_settings_box').style.display = 'block';
        };
    }

    // Add event onclic to "WF Toolbox Settings" link on Link List
    if(WFTB_L_LinkList.length == 1) {
        document.getElementById('wftb_settings_open_ll').onclick = function() {
            document.getElementById('wftb_settings_box').style.display = 'block';
        };
    }
    unsafeWindow.onkeyup = function(WFTB_L_evt) {
        WFTB_L_evt = WFTB_L_evt || window.event;

        //
        if (WFTB_L_evt.keyCode == 27) {
            document.getElementById('wftb_settings_box').style.display = 'none';
            WFTB_Log('WFTB_Settings', 5, 'unsafeWindow.onkeyup : ' + WFTB_L_evt.keyCode + ' (Escape / Echap)');
        } else {
            WFTB_Log('WFTB_Settings', 5, 'unsafeWindow.onkeyup : ' + WFTB_L_evt.keyCode);
        }
    };

    unsafeWindow.onkeypress = function(WFTB_L_evt) {
        WFTB_L_evt = WFTB_L_evt || window.event;

        //
        if (WFTB_L_evt.keyCode == 27) {
            document.getElementById('wftb_settings_box').style.display = 'none';
            WFTB_Log('WFTB_Settings', 5, 'unsafeWindow.onkeypress : ' + WFTB_L_evt.keyCode + ' (Escape / Echap)');
        } else {
            WFTB_Log('WFTB_Settings', 5, 'unsafeWindow.onkeypress : ' + WFTB_L_evt.keyCode);
        }
    };

    unsafeWindow.onresize = function() {
        WFTB_Log('WFTB_Settings', 5, 'onresize even');
        WFTB_settings_update();
    };

    WFTB_Log('WFTB_Settings', 4, 'End');
}

//============================== WFTB_EditorLevel ==============================//
function WFTB_EditorLevel(EditorName) {
    WFTB_Log('WFTB_EditorLevel', 4, 'Start');
    var WFTB_L_cpt = 0;
    var WFTB_L_EditorLevel;
    var WFTB_L_Script = WFTB_xpath('/html/head/script[1]', document)[0];
    var WFTB_L_UpDateNow = true;
    var WFTB_L_EditorProfilExtract = false;
    /**/
    var WFTB_l_data;

    WFTB_G_ListEditorLevel = JSON.parse(localStorage.WFTB_datas);

    WFTB_Log('WFTB_EditorLevel', 5, ' profil ' + EditorName + ' is array ? ' +  WFTB_G_ListEditorLevel[EditorName]);

    /*try {
        WFTB_Log('WFTB_EditorLevel', 4, EditorName + ' diffdate ' + (Date.now() - WFTB_G_ListEditorLevel[EditorName]['updatetime']));
        if((WFTB_G_ListEditorLevel[EditorName]['updatetime'] + 3600000 - Date.now()) > 0) {
            WFTB_L_UpDateNow = false;
        } else WFTB_L_UpDateNow = false;
    }
    catch(e) {
        WFTB_L_UpDateNow = true;
        WFTB_Log('WFTB_AddUserProfil', 2, 'Le profil' + EditorName + ' n\'existe pas');
    }*/


    if(WFTB_L_UpDateNow) {
        GM_xmlhttpRequest({
            method: "GET",
            url: WFTB_G_URL_UserProfil+EditorName,
            headers: {
                "User-Agent": "Mozilla/5.0",
            },
            onload: function(responseDetails) {
                var WFTB_UP = document.createElement('div');
                var WFTB_UF_JsonDatas_serialized = document.createElement('script');
                var WFTB_UF_JsonDatas;

                WFTB_Log('WFTB_EditorLevel', 5, 'GM_xmlhttpRequest localstorage WFTB_data already exist... Restaure Settings');
                WFTB_Log('WFTB_EditorLevel', 5, 'GM_xmlhttpRequest WFTB_datas.length=' + localStorage.WFTB_datas.length);
                /**/
                WFTB_l_data = JSON.parse(localStorage.WFTB_datas);

                WFTB_Log('WFTB_EditorLevel', 5, 'GM_xmlhttpRequest Load Userpage ' + WFTB_G_URL_UserProfil + EditorName);
                var WFTB_L_UserEditor = document.createElement('div');
                WFTB_L_UserEditor.innerHTML = responseDetails.responseText;
                //WFTB_L_EditorLevel = WFTB_single_xpath(WFTB_G_SearchEditorLevel, WFTB_L_UserEditor);
                WFTB_L_EditorLevel = WFTB_single_xpath(WFTB_G_SearchEditorLevel, WFTB_L_UserEditor);
                WFTB_UP.innerHTML = WFTB_L_UserEditor.innerHTML;
                WFTB_UF_JsonDatas = WFTB_xpath('//script', WFTB_UP)[1].innerHTML;
                eval(WFTB_UF_JsonDatas);

                if(gon.data['username']!==undefined) {
                    WFTB_Log('WFTB_EditorLevel', 5, 'GM_xmlhttpRequest Level GON ' + gon['data']['rank']);
                    //WFTB_l_data[EditorName]['userdata'] = JSON.parse(JSON.stringify(gon));
                    WFTB_l_data[EditorName] = JSON.parse(JSON.stringify(gon));
                    WFTB_Log('WFTB_EditorLevel', 5, 'GM_xmlhttpRequest Level ' + EditorName + ' : ' + (parseInt(WFTB_l_data[EditorName]['data']['rank']) + 1));
                    WFTB_l_data[EditorName]['updatetime'] = Date.now();
                    WFTB_Log('WFTB_EditorLevel', 5, 'GM_xmlhttpRequest to string ' + JSON.stringify(WFTB_l_data[EditorName]));
                }
                localStorage.WFTB_datas = JSON.stringify(WFTB_l_data);
                WFTB_Log('WFTB_EditorLevel', 5, 'GM_xmlhttpRequest' + JSON.stringify(gon));
                //
            }
        });
        return true;
    } else {
        return false;
    }
    WFTB_Log('WFTB_EditorLevel', 4, 'End');
}

//============================== Waze Userprofil ==========================//
function WFTB_AddUserProfil() {
    WFTB_Log('WFTB_AddUserProfil', 4, 'Start');

    // Insert UserProfil
    var WFTB_L_LST_A = document.getElementsByTagName('a');
    var WFTB_L_LST_UserA = Array();
    var WFTB_L_cpt = 0;
    var WFTB_L_patt_vp = new RegExp('mode=viewprofile');
    var WFTB_L_patt_nologin = new RegExp('waze\.com\/');
    var WFTB_L_LinkList = Array();
    var WFTB_L_Profil;
    var WFTB_L_Level = document.getElementsByTagName('div');

    if(WFTB_L_patt_vp.test(window.location.href)) {
        WFTB_L_LinkList = WFTB_xpath('//*[@id="viewprofile"]/div[1]/div/dl/dd[1]/span', document);
        WFTB_Log('WFTB_AddUserProfil', 5, 'xpath linklist ' + WFTB_L_LinkList.length);

        // Add
        if(WFTB_L_LinkList.length == 1) {
            WFTB_Log('WFTB_AddUserProfil', 5, 'xpath pseudo ' + WFTB_L_LinkList[0].innerHTML);
            WFTB_insertAfter(WFTB_Profil(WFTB_L_LinkList[0].innerHTML, WFTB_L_LinkList[0].style.color, 'fr'), WFTB_L_LinkList[0]);
        }
    } else {
        // Extract Userprofil login
        WFTB_Log('WFTB_AddUserProfil', 5, 'url de la page ' + window.location.href);

        if(WFTB_L_LST_A.length > 0) {
            for(WFTB_L_cpt = 0; WFTB_L_cpt < WFTB_L_LST_A.length; WFTB_L_cpt++) {
                try {
                    if(!WFTB_L_patt_nologin.test(WFTB_L_LST_A[WFTB_L_cpt].innerHTML))if(WFTB_L_patt_vp.test(WFTB_L_LST_A[WFTB_L_cpt].href)) WFTB_L_LST_UserA.push(WFTB_L_LST_A[WFTB_L_cpt]);
                }
                catch(e) {
                    WFTB_Log('WFTB_AddUserProfil', 2, 'Vive les tag A sans href');
                }
            }
        }

        // Add Editor Userprofil
        if(WFTB_L_LST_UserA.length > 0) {
            for(WFTB_L_cpt = 1; WFTB_L_cpt <= WFTB_L_LST_UserA.length; WFTB_L_cpt++) {
                try {
                    // Add Level Editor in user profile
                    if(WFTB_EditorLevel(WFTB_L_LST_UserA[WFTB_L_cpt].innerHTML)) {
                        WFTB_Log('WFTB_AddUserProfil', 2, 'pseudo ' + WFTB_L_LST_UserA[WFTB_L_cpt].innerHTML + ' rechargement des données');
                        // Restaure data from localstorage WFTB_datas
                        WFTB_G_EditorsInformations = JSON.parse(localStorage.WFTB_datas);
                    }
                    else WFTB_Log('WFTB_AddUserProfil', 2, 'pseudo ' + WFTB_L_LST_UserA[WFTB_L_cpt].innerHTML + ' données déjà chargées');

                        WFTB_Log('WFTB_AddUserProfil', 2, 'pseudo ' + WFTB_L_LST_UserA[WFTB_L_cpt].innerHTML + ' add level editor');
                        WFTB_L_Profil = WFTB_Profil(WFTB_L_LST_UserA[WFTB_L_cpt].innerHTML, WFTB_L_LST_UserA[WFTB_L_cpt].style.color, 'fr');
                        WFTB_Log('WFTB_AddUserProfil', 2, 'href=' + WFTB_L_Profil.href + ' et InnerHTML=' + WFTB_L_Profil.innerHTML + ' WFTB_L_Profil ' + WFTB_L_LST_UserA[WFTB_L_cpt]);
                        WFTB_insertAfter(WFTB_L_Profil, WFTB_L_LST_UserA[WFTB_L_cpt]);
                        WFTB_Log('WFTB_AddUserProfil', 2, 'pseudo ' + WFTB_L_LST_UserA[WFTB_L_cpt].innerHTML);
                    //WFTB_Log('WFTB_AddUserProfil', 5, 'to string ' + JSON.stringify(WFTB_G_EditorsInformations[WFTB_L_LST_UserA[WFTB_L_cpt].innerHTML]));
                    try {
                        //WFTB_insertAfter(document.createTextNode(' (level ' + (WFTB_G_EditorsInformations[WFTB_L_LST_UserA[WFTB_L_cpt].innerHTML]['data']['rank'] + 1) + ')'), WFTB_L_LST_UserA[WFTB_L_cpt]);
                        WFTB_L_LST_UserA[WFTB_L_cpt].innerHTML = WFTB_L_LST_UserA[WFTB_L_cpt].innerHTML + ' (level ' + (WFTB_G_EditorsInformations[WFTB_L_LST_UserA[WFTB_L_cpt].innerHTML]['data']['rank'] + 1) + ')';
                    }
                    catch(e) {
                        WFTB_Log('WFTB_AddUserProfil', 2, 'Pas de profil éditeur');
                        WFTB_insertAfter(document.createTextNode(' (Pas de profil éditeur)'), WFTB_L_LST_UserA[WFTB_L_cpt]);
                    }
                }
                catch(e)
                {
                    WFTB_Log('WFTB_AddUserProfil', 2, 'Pas de profil éditeur');
                    WFTB_insertAfter(document.createTextNode(' (Pas de profil éditeur)'), WFTB_L_LST_UserA[WFTB_L_cpt]);
                }
            }
        }
    }
    WFTB_Log('WFTB_AddUserProfil', 4, 'End');
}

//============================== WFTB_settings_update ==========================//
function WFTB_settings_update() {
    var WFTB_L_sbm;

    WFTB_Log('WFTB_settings_update', 4, 'Start');
    WFTB_Log('WFTB_settings_update', 4, 'WFTB_URL_usergroups=' + WFTB_URL_usergroups);

    WFTB_L_sbm = document.getElementById('wftb_settings_box');
    if(WFTB_L_sbm === null) return;

    if(window.innerWidth > 960) WFTB_L_sbm.style.left = (window.innerWidth / 2 - 430) + 'px';
    else WFTB_L_sbm.style.left = '50px';

    setTimeout(WFTB_ChangeBGColor(),1000);

    WFTB_Log('WFTB_settings_update', 4, 'End');
}

//============================== Start WFTB ============================//
WFTB_Bootstrap();
//============================== End ====================================//