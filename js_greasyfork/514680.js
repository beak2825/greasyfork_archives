// ==UserScript==
// @name         AB_Mitspieler_Namen_anzeigen
// @namespace    leeSalami.lss
// @version      1.2
// @description  Einsatz-Owner-Name anzeigen und im Einsatzlisten-Suchfeld berücksichtigen. Klick auf Name öffnet das Profil.
// @author       Vaporizer, leeSalami
// @match        https://*.leitstellenspiel.de
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514680/AB_Mitspieler_Namen_anzeigen.user.js
// @updateURL https://update.greasyfork.org/scripts/514680/AB_Mitspieler_Namen_anzeigen.meta.js
// ==/UserScript==

(async function() {
  'use strict';

  let m_all, m_one, n_span, u_id, u_name, u_search;
  const missionMarkerAddOrigin = window.missionMarkerAdd;

  // Daten der Mitspieler abrufen
  let p_all = await fetchMitspieler();

  // Zu jedem Verbands-Einsatz den Namen des Mitspielers anzeigen
  m_all = document.getElementById('mission_list_alliance').querySelectorAll('.missionSideBarEntry');
  m_all.forEach(singleMission => getName(singleMission.attributes.mission_id.value));

  // Zu jedem SiWa-Verbands-Einsatz den Namen des Mitspielers anzeigen
  m_all = document.getElementById('mission_list_sicherheitswache').querySelectorAll('.missionSideBarEntry');
  m_all.forEach(singleMission => getName(singleMission.attributes.mission_id.value));

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function getName(m_id) {

    try {
      // Name des Mitspielers extrahieren und dem Einsatz anhängen
      u_id = window.mission_markers.filter(({mission_id}) => mission_id == m_id)[0].user_id;
      if (u_id == window.user_id) return;
      u_name = (!p_all.hasOwnProperty(u_id) ? "N.N." : p_all[u_id]);
      n_span = document.createElement("a");
      n_span.setAttribute("id", "mission_user_name_" + m_id);
      n_span.setAttribute("class", "label label-default lightbox-open");
      n_span.setAttribute("style", "margin-right: 3px;");
      n_span.setAttribute("href", "/profile/" + u_id);
      n_span.innerText = u_name;
      document.getElementById('mission_caption_' + m_id).before (n_span);
      fillSearchStringWithName(m_id, u_name);
    } catch(e) {
      console.log(new Date().toLocaleTimeString() + " getName: " + e.toString());
    }
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function fillSearchStringWithName(m_id, m_name) {

    // Namen des Mitspielers für Einsatzlisten-Suchfeld findbar machen
    u_search = document.getElementById('mission_' + m_id);
    u_search.attributes.search_attribute.value = u_search.attributes.search_attribute.value + ' ' + m_name;
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  async function fetchMitspieler() {
    let aAllianceUsers = null;
    let aAllianceUsersStored = null;

    if (localStorage.aAllianceUsers) {
      aAllianceUsersStored = JSON.parse(localStorage.aAllianceUsers);
    }

    if (!aAllianceUsersStored || aAllianceUsersStored.lastUpdate < (new Date().getTime() - 60 * 60 * 1000) || aAllianceUsersStored.userId !== user_id) {
      try {
        const alliance = await (await fetch(`${window.location.origin}/api/allianceinfo`)).json();

        if (alliance) {
          const allianceUsers = {};
          alliance.users.forEach(user => allianceUsers[user.id] = user.name);
          localStorage.setItem('aAllianceUsers', JSON.stringify({lastUpdate: new Date().getTime(), value: allianceUsers, userId: user_id}));
          aAllianceUsers = allianceUsers
        }
      } catch(e) {
        if (aAllianceUsersStored && aAllianceUsersStored.userId === user_id) {
          aAllianceUsers = aAllianceUsersStored.value;
        }
      }
    } else {
      aAllianceUsers = aAllianceUsersStored.value;
    }

    return aAllianceUsers;
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // Neuen Einsatz empfangen und verarbeiten
  window.missionMarkerAdd = e => {

    // Original Event weitergeben
    missionMarkerAddOrigin(e);

    m_one = document.getElementById("mission_user_name_" + e.id);

    // Prüfen, dass nur bei neuen Verbands-Einsätzen der Name ermittelt wird; nicht bei eigenen Einsätzen und auch nicht bei Verbands-Event-Einsätzen.
    if (e.user_id != null && e.user_id != window.user_id) {
      if (m_one == null) {
        // Zu jedem neuen Verbands-Einsatz den Namen des Mitspielers anzeigen
        getName(e.id);
      } else {
        // Nach Einsatz-Update die Suche rekonstruieren
        fillSearchStringWithName(e.id, m_one.innerText);
      }
    }
  };
})();