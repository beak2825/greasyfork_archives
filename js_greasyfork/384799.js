// ==UserScript==
// @name        Smite God Randomizer
// @namespace    localhost
// @version      0.2
// @description  Selects a God at random
// @author       Jack W
// @include      *https://www.google.com/search?*
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/384799/Smite%20God%20Randomizer.user.js
// @updateURL https://update.greasyfork.org/scripts/384799/Smite%20God%20Randomizer.meta.js
// ==/UserScript==

'use strict';

var googleSearchBar = $("#tsf > div:nth-child(2) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input");

var allGods = [ "Achilles", "Agni", "Ah Muzen Cab", "Ah Puch", "Amaterasu", "Anhur", "Anubis", "Ao Kuang", "Aphrodite", "Apollo", "Arachne",
               "Ares", "Artemis", "Artio", "Athena", "Awilix", "Bacchus", "Bakasura", "Baron Samedi", "Bastet", "Bellona", "Cabrakan", "Camazotz",
               "Cerberus", "Cernunnos", "Chaac", "Chang'e", "Chernobog", "Chiron", "Chronos", "Cu Chulainn", "Cupid", "Da Ji", "Discordia",
               "Erlang Shen", "Fafnir", "Fenrir", "Freya", "Ganesha", "Geb", "Guan Yu", "Hachiman", "Hades", "He Bo", "Hel", "Hera", "Hercules",
               "Horus", "Hou Yi", "Hun Batz", "Isis", "Izanami", "Janus", "Jing Wei", "Jormungandr", "Kali", "Khepri", "King Arthur", "Kukulkan",
               "Kumbhakarna", "Kuzenbo", "Loki", "Medusa", "Mercury", "Merlin", "Ne Zha", "Neith", "Nemesis", "Nike", "Nox", "Nu Wa", "Odin",
               "Osiris", "Pele", "Poseidon", "Ra", "Raijin", "Rama", "Ratatoskr", "Ravana", "Scylla", "Serqet", "Set", "Skadi", "Sobek", "Sol",
               "Sun Wukong", "Susano", "Sylvanus", "Terra", "Thanatos", "The Morrigan", "Thor", "Thoth", "Tyr", "Ullr", "Vamana", "Vulcan",
               "Xbalanque", "Xing Tian", "Ymir", "Zeus", "Zhong Kui"];

var guardianGods = ["Ares", "Artio", "Athena", "Bacchus", "Cabrakan", "Cerberus", "Fafnir", "Ganesha", "Geb", "Jormungandr", "Khepri",
                    "Kumbhakarna", "Kuzenbo", "Sobek", "Sylvanus", "Terra", "Xing Tian", "Ymir"];

var mageGods = ["Agni", "Ah Puch", "Anubis", "Ao Kuang", "Aphrodite", "Baron Samedi", "Chang'e", "Chronos", "Discordia", "Freya", "Hades",
                "He Bo", "Hel", "Hera", "Isis", "Janus", "Kukulkan", "Merlin", "Nox", "Nu Wa", "Poseidon", "Ra", "Raijin", "Scylla", "Sol",
                "The Morrigan", "Thoth", "Vulcan", "Zeus", "Zhong Kui"];

var warriorGods = ["Achilles", "Amaterasu", "Bellona", "Chaac", "Cu Chulainn", "Erlang Shen", "Guan Yu", "Hercules", "Horus", "King Arthur",
                   "Nike", "Odin", "Osiris", "Sun Wukong", "Tyr", "Vamana"];

var assassinGods = ["Arachne", "Awilix", "Bakasura", "Bastet", "Camazotz", "Da Ji", "Fenrir", "Hun Batz", "Kali", "Loki", "Mercury", "Ne Zha",
                    "Nemesis", "Pele", "Ratatoskr", "Ravana", "Serqet", "Set", "Susano", "Thanatos", "Thor"];

var hunterGods = ["Ah Muzen Cab", "Anhur", "Apollo", "Artemis", "Cernunnos", "Chernobog", "Chiron", "Cupid", "Hachiman", "Hou Yi", "Izanami",
                  "Jing Wei", "Medusa", "Neith", "Rama", "Skadi", "Ullr", "Xbalanque"];



function RandomGod() {
    //random all
    if (googleSearchBar.val().toLowerCase() == "random god") {
        var randomAll = allGods[Math.floor(Math.random() * allGods.length)];
        alert(randomAll);
    }

    //random guardian
     if (googleSearchBar.val().toLowerCase() == "random guardian") {
        var randomGuardian = guardianGods[Math.floor(Math.random() * guardianGods.length)];
        alert(randomGuardian);
    }

    //random mage
     if (googleSearchBar.val().toLowerCase() == "random mage") {
        var randomMage = mageGods[Math.floor(Math.random() * mageGods.length)];
        alert(randomMage);
    }

    //random warrior
     if (googleSearchBar.val().toLowerCase() == "random warrior") {
        var randomWarrior = warriorGods[Math.floor(Math.random() * warriorGods.length)];
        alert(randomWarrior);
    }

    //random assassin
     if (googleSearchBar.val().toLowerCase() == "random assassin") {
        var randomAssassin = assassinGods[Math.floor(Math.random() * assassinGods.length)];
        alert(randomAssassin);
    }

    //random hunter
     if (googleSearchBar.val().toLowerCase() == "random hunter") {
        var randomHunter = hunterGods[Math.floor(Math.random() * hunterGods.length)];
        alert(randomHunter);
    }
}
RandomGod();


