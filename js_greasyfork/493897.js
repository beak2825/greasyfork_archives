// ==UserScript==
// @name         Audiocorso di Medicina tradizionale cinese
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Ascolta da Bibloh
// @author       Flejta
// @include      *https://bibloh.medialibrary.it/media/scheda.aspx?id=150013373
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493897/Audiocorso%20di%20Medicina%20tradizionale%20cinese.user.js
// @updateURL https://update.greasyfork.org/scripts/493897/Audiocorso%20di%20Medicina%20tradizionale%20cinese.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Array of URLs
    const urls = [
        "https://www.ilnarratore.com/samples_download/Medicina_tradizionale_cinese_ENEA_sample.mp3",
        "https://s.medialibrary.it/narratore/ENEA/Medicina_tradizionale_cinese//01_Intro.mp3",
        "https://s.medialibrary.it/narratore/ENEA/Medicina_tradizionale_cinese//02_La_MTC_presentazione.mp3",
        "https://s.medialibrary.it/narratore/ENEA/Medicina_tradizionale_cinese//03_Il_pensiero_cinese_e_l_Occidente.mp3",
        "https://s.medialibrary.it/narratore/ENEA/Medicina_tradizionale_cinese//04_Yin_e_yang.mp3",
        "https://s.medialibrary.it/narratore/ENEA/Medicina_tradizionale_cinese//05_I_cinque_Movimenti.mp3",
        "https://s.medialibrary.it/narratore/ENEA/Medicina_tradizionale_cinese//06_Le_cinque_Sostanze_Preziose.mp3",
        "https://s.medialibrary.it/narratore/ENEA/Medicina_tradizionale_cinese//07_Gli_organi_e_i_visceri.mp3",
        "https://s.medialibrary.it/narratore/ENEA/Medicina_tradizionale_cinese//08_Gli_organi_e_le_loro_funzioni.mp3",
        "https://s.medialibrary.it/narratore/ENEA/Medicina_tradizionale_cinese//09_Gli_organi_e_le_sostanze_preziose.mp3",
        "https://s.medialibrary.it/narratore/ENEA/Medicina_tradizionale_cinese//10_Gli_organi_e_le_manifestazioni_esterne.mp3",
        "https://s.medialibrary.it/narratore/ENEA/Medicina_tradizionale_cinese//11_Gli_organi_e_i_liquidi_corporei.mp3",
        "https://s.medialibrary.it/narratore/ENEA/Medicina_tradizionale_cinese//12_Le_interrelazioni_tra_gli_organi_interni.mp3",
        "https://s.medialibrary.it/narratore/ENEA/Medicina_tradizionale_cinese//13_I_visceri_e_le_loro_funzioni.mp3",
        "https://s.medialibrary.it/narratore/ENEA/Medicina_tradizionale_cinese//14_Le_relazioni_tra_gli_organi_e_i_visceri.mp3",
        "https://s.medialibrary.it/narratore/ENEA/Medicina_tradizionale_cinese//15_I_sei_visceri_curiosi.mp3",
        "https://s.medialibrary.it/narratore/ENEA/Medicina_tradizionale_cinese//16_I_meridiani.mp3",
        "https://s.medialibrary.it/narratore/ENEA/Medicina_tradizionale_cinese//17_I_meridiani_principali.mp3",
        "https://s.medialibrary.it/narratore/ENEA/Medicina_tradizionale_cinese//18_I_meridiani_curiosi.mp3",
        "https://s.medialibrary.it/narratore/ENEA/Medicina_tradizionale_cinese//19_I_meridiani_secondari.mp3",
        "https://s.medialibrary.it/narratore/ENEA/Medicina_tradizionale_cinese//20_Le_cause_della_malattia.mp3",
        "https://s.medialibrary.it/narratore/ENEA/Medicina_tradizionale_cinese//21_Le_cause_interne.mp3",
        "https://s.medialibrary.it/narratore/ENEA/Medicina_tradizionale_cinese//22_Le_cause_esterne.mp3",
        "https://s.medialibrary.it/narratore/ENEA/Medicina_tradizionale_cinese//23_Le_cause_miste.mp3",
        "https://s.medialibrary.it/narratore/ENEA/Medicina_tradizionale_cinese//24_La_diagnosi.mp3",
        "https://s.medialibrary.it/narratore/ENEA/Medicina_tradizionale_cinese//25_L_osservazione.mp3",
        "https://s.medialibrary.it/narratore/ENEA/Medicina_tradizionale_cinese//26_L_interrogatorio.mp3",
        "https://s.medialibrary.it/narratore/ENEA/Medicina_tradizionale_cinese//27_La_palpazione.mp3",
        "https://s.medialibrary.it/narratore/ENEA/Medicina_tradizionale_cinese//28_Ascoltare_e_annusare.mp3",
        "https://s.medialibrary.it/narratore/ENEA/Medicina_tradizionale_cinese//29_Le_Sindromi.mp3",
        "https://s.medialibrary.it/narratore/ENEA/Medicina_tradizionale_cinese//30_Le_sindromi_in_base_alle_otto_regole.mp3",
        "https://s.medialibrary.it/narratore/ENEA/Medicina_tradizionale_cinese//31_Le_sindromi_in_base_a_Qi_Sangue_e_Liquidi_corporei.mp3",
        "https://s.medialibrary.it/narratore/ENEA/Medicina_tradizionale_cinese//32_Le_sindromi_in_base_agli_organi_interni.mp3",
        "https://s.medialibrary.it/narratore/ENEA/Medicina_tradizionale_cinese//33_Reni.mp3",
        "https://s.medialibrary.it/narratore/ENEA/Medicina_tradizionale_cinese//34_Fegato.mp3",
        "https://s.medialibrary.it/narratore/ENEA/Medicina_tradizionale_cinese//35_Polmone.mp3",
        "https://s.medialibrary.it/narratore/ENEA/Medicina_tradizionale_cinese//36_Milza.mp3",
        "https://s.medialibrary.it/narratore/ENEA/Medicina_tradizionale_cinese//37_Cuore.mp3",
        "https://s.medialibrary.it/narratore/ENEA/Medicina_tradizionale_cinese//38_Stomaco.mp3",
        "https://s.medialibrary.it/narratore/ENEA/Medicina_tradizionale_cinese//39_Intestino_Tenue.mp3",
        "https://s.medialibrary.it/narratore/ENEA/Medicina_tradizionale_cinese//40_Intestino_Crasso.mp3",
        "https://s.medialibrary.it/narratore/ENEA/Medicina_tradizionale_cinese//41_Vescica_Biliare.mp3",
        "https://s.medialibrary.it/narratore/ENEA/Medicina_tradizionale_cinese//42_Vescica.mp3",
    ];

    // Create a container for links
    const container = document.createElement('div');
    container.style.padding = '20px';
    container.style.background = 'lightgray';
    container.style.position = 'fixed';
    container.style.bottom = '0';
    container.style.width = '100%';
    container.style.textAlign = 'center';

    // Append container to body
    document.body.appendChild(container);

    // Create and append links to the container
    urls.forEach(url => {
        const link = document.createElement('a');
        link.href = url;
        link.download = url.split('/').pop(); // Suggests the filename to save as
        link.textContent = 'Download ' + url.split('/').pop(); // Display file name as link text
        link.style.margin = '5px';
        container.appendChild(link);
        container.appendChild(document.createElement('br')); // Adds a new line after each link
    });
})();