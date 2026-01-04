// ==UserScript==
// @name         Rolocate Restore Classic Terms All Languages
// @namespace    https://oqarshi.github.io/
// @version      1.03
// @description  Classic Terms In All Languages For RoLocate To Use
// @author       Oqarshi
// @grant        none
// ==/UserScript==

// classicTerms.js
const classicTerms = {
    en: [
        { from: /\bCommunities\b/g, to: "Groups" },
        { from: /\bcommunities\b/g, to: "groups" },
        { from: /\bCommunity\b/g, to: "Group" },
        { from: /\bcommunity\b/g, to: "group" },
        { from: /\bConnections\b/g, to: "Friends" },
        { from: /\bconnections\b/g, to: "friends" },
        { from: /\bConnection\b/g, to: "Friend" },
        { from: /\bconnection\b/g, to: "friend" },
        { from: /\bConnect\b/g, to: "Friends" },
        { from: /\bconnect\b/g, to: "friends" },
        { from: /\bexperience\b/g, to: "game" },
        { from: /\bexperiences\b/g, to: "games" },
        { from: /\bExperience\b/g, to: "Game" },
        { from: /\bExperiences\b/g, to: "Games" },
        { from: /\bCharts\b/g, to: "Games" },
        { from: /\bChart\b/g, to: "Game" },
        { from: /\bchart\b/g, to: "game" },
        { from: /\bcharts\b/g, to: "games" },
        { from: /\bMarketplace\b/g, to: "Catalog" },
        { from: /\bmarketplace\b/g, to: "catalog" }
    ],
    fr: [
        { from: /\bCommunautés\b/g, to: "Groupes" },
        { from: /\bcommunautés\b/g, to: "groupes" },
        { from: /\bCommunauté\b/g, to: "Groupe" },
        { from: /\bcommunauté\b/g, to: "groupe" },
        { from: /\bConnexions\b/g, to: "Amis" },
        { from: /\bconnexions\b/g, to: "amis" },
        { from: /\bConnexion\b/g, to: "Ami" },
        { from: /\bconnexion\b/g, to: "ami" },
        { from: /\bConnecter\b/g, to: "Amis" },
        { from: /\bconnecter\b/g, to: "amis" }
    ],
    es: [
        { from: /\bComunidades\b/g, to: "Grupos" },
        { from: /\bcomunidades\b/g, to: "grupos" },
        { from: /\bComunidad\b/g, to: "Grupo" },
        { from: /\bcomunidad\b/g, to: "grupo" },
        { from: /\bConexiones\b/g, to: "Amigos" },
        { from: /\bconexiones\b/g, to: "amigos" },
        { from: /\bConexión\b/g, to: "Amigo" },
        { from: /\bconexión\b/g, to: "amigo" },
        { from: /\bConectar\b/g, to: "Amigos" },
        { from: /\bconectar\b/g, to: "amigos" }
    ],
};