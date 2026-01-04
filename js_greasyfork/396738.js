// ==UserScript==
// @name           Eduarte - Rommel organizeren
// @namespace      Met dank aan Cyril de Wit
// @description    Vervang tekst op Eduarte
// @include        http://*
// @include        https://*
// @include        file://*
// @exclude        http://userscripts.org/scripts/review/*
// @exclude        http://userscripts.org/scripts/edit/*
// @exclude        http://userscripts.org/scripts/edit_src/*
// @exclude        https://userscripts.org/scripts/review/*
// @exclude        https://userscripts.org/scripts/edit/*
// @exclude        https://userscripts.org/scripts/edit_src/*
// @copyright      Copyright free
// @version        1.1.0
// @downloadURL https://update.greasyfork.org/scripts/396738/Eduarte%20-%20Rommel%20organizeren.user.js
// @updateURL https://update.greasyfork.org/scripts/396738/Eduarte%20-%20Rommel%20organizeren.meta.js
// ==/UserScript==
 
var lessen = []
lessen["AVD"] = "Audio Visueel"
lessen["VG2"] = "Vormgeving 2"
lessen["VG1"] = "Vormgeving 1"
lessen["ZELF"] = "Zelfstandig"
lessen["MARC"] = "Marketing en Communicatie"
lessen["NED"] = "Nederlands"
lessen["ANI2"] = "Animartie 2"
lessen["ANI1"] = "Animatie 1"
lessen["ENG"] = "Engels"
lessen["SPORT"] = "Sport"
lessen["REK"] = "Rekenen"
lessen["FOTO"] = "Fotografie"
lessen["SKILLS"] = "Skills"
lessen["LLB"] = "Loopbaanbegleiding"
lessen["SKILLS2"] = "Skils 2"
lessen["PBR"] = "Personal Branding"
lessen["3D"] = "3D"
lessen["LLB-I"] = "Loopbaanbegleiding"
lessen["STUDIO"] = "Studio"
lessen["VIDEO"] = "Video"
 
var locaties = []
locaties["DKW002"] = "Disketteweg 2"
locaties["DKW002-FITN"] = "Disketteweg 2 Sporthal"
 
var docenten = []
docenten["anma720"] = "Ana-Maria Marin"
docenten["frde955"] = "Frans Derksen"
docenten["leei715"] = "Leslie"
docenten["resw867"] = "René Swankhuizen"
docenten["mite469"] = "Michiel Teunissen"
 
function transformRow(row) {
    var agendaClass = row.getElementsByClassName('agenda-class')[0]
    var agendaTeacher = row.getElementsByClassName('agenda-teacher')[0]
 
    var agendaClassContent = agendaClass.textContent;
    var agendaTeacherContent = agendaTeacher.textContent;
    // console.log('agenda-class: ' + agendaClassContent);
    // console.log('agenda-teacher: ' + agendaTeacherContent);
 
    var agendaClassContentParts = agendaClassContent.replace(/\s/g, '').split('-')
    var locatie = agendaClassContentParts[0]
    var lokaal = agendaClassContentParts[1]
    var les = agendaClassContentParts[2]
    var klas = agendaClassContentParts[3]
    // console.log('Locatie: ' + locatie);
    // console.log('Lokaal: ' + lokaal);
    // console.log('Les: ' + les);
    // console.log('Klas: ' + klas);
 
    // update information
    console.log(agendaClass);
 
    agendaClass.setAttribute('title', agendaClassContent)
    agendaTeacher.setAttribute('title', agendaTeacherContent)
 
    agendaClass.textContent = lokaal + ' - ' + lessen[les]
    agendaTeacher.textContent = locaties[locatie] + ' - ' + klas + ' - ' + docenten[agendaTeacherContent] + ' (' + agendaTeacherContent +')'
}
 
function updateInformation(agendaList) {
    var rows = agendaList.getElementsByTagName('tr')
 
    for (var i = 0; i < rows.length; i++) {
        transformRow(rows[i])
    }
}
 
(function () {
    var agendaList = document.getElementsByClassName('agenda-list')[0]
 
    if (agendaList !== undefined) {
        updateInformation(agendaList)
    }
}());
 
 
var unaRow = document.getElementById('id29')
transformRow(unaRow)
 
var anotherRow = document.getElementById('updatedVersion')
transformRow(anotherRow)