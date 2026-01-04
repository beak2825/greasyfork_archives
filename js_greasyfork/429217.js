// ==UserScript==
// @name        Google Meet Attendees & Breakout Rooms
// @namespace   Google Meet Attendees & Breakout Rooms by Daniel & Emrik
// @include     https://meet.google.com/*
// @grant       none
// @version     0.2.5
// @author      Daniel & Emrik <gmeet.attendees@gmail.com>
// @description Get attendees at a google meet and do different things.
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/429217/Google%20Meet%20Attendees%20%20Breakout%20Rooms.user.js
// @updateURL https://update.greasyfork.org/scripts/429217/Google%20Meet%20Attendees%20%20Breakout%20Rooms.meta.js
// ==/UserScript==

// Changelog
/*

0.2.5
Fixed attendees in sidebar mode

0.2.4
Fixed attendees not refreshing and added failsafe for attendees div

0.2.3
Fixed top margin

0.2.2
Fixed bug in old meet

0.2.1
Small bugfix

0.2.0
Now works in the new google meet layout

0.1.18
Fixed attendees not refreshing

0.1.17
Fixed button not appearing

0.1.16
Removed unnecessary premission: tabs

0.1.15
Added better language selector

0.1.14
Fixed Italian and German 

0.1.13
Italian translation by Lorenzo Fabbri

0.1.12
Added support for Google's Grid View
Fixed clean comparison list
Fixed typo in 0.1.11

0.1.11
Fixed include yourself

0.1.10
Added donate button
Disabled link shortener by default.

0.1.9
Added setting for link shortener
Fixed to make sure it work when people have (,) in the name
Fixed save list funciton

0.1.8
Reversed some 0.1.7 changes

0.1.7
Fixed 0.1.6 to make it work consistently

0.1.6
Quick fix for Google meet change

0.1.5
Fixed compatibility with "Meet Attendance"

0.1.4
Fixed layout on 720p monitors
Fixed not on list bug

0.1.3
Added reset meets button

0.1.2
Added option to use comparison list in group generator
Added swap in group generator
Fixed bug if you had an incorrect attendees list

0.1.1
Fixed bug that occurred if grid view loaded after and it was the first time using the extension
Fixed font size
Added force english option
Made group display scrollable

0.1.0
Added breakout/group rooms
Notice when grid view isn't installed

0.0.4
Removed more unnessary characters in clean function
Matches name reversed as well

0.0.3
Dark mode
Now works when "Only show participants with video" is enabled
Added people counter when comparing lists. Ex 2/32 persons here

0.0.2
Fixed Chrome extension localisation

0.0.1
Initial Release

// TODO (ordered by difficulty (easiest first))
Have alternative for lookup links (g-suite only)
Show last name in group generator
Better layout on all screen
Use chrome sync storage instead of localstorage.
Add better pop-up for random person
Save and load groups
Aliases for names
Get attendees in a better way
*/

const T = (untranslatedMsg) => {
  if (forceLanguage && forceLanguage != "auto") {
    if (translations[untranslatedMsg][forceLanguage]) {
      return translations[untranslatedMsg][forceLanguage]
    } else {
      return translations[untranslatedMsg]["en"]
    }
  } else {
    let languages = navigator.languages
    for(let i = 0; i < languages.length; i++){
      let result = translations[untranslatedMsg][languages[i]]
      if(result != null){
        return result
      }
    }
    return translations[untranslatedMsg]["en"] // English is default
  }
}

/* Translation guidelines:
Try to keep the translation short (preferebly not much longer then the english translation).
Make sure to use correct case if applicable */

/* Credits:
  Deutsch: Daniel and Filip
  Italian: Lorenzo Fabbri

  Feel free to submit pull requests with you translation, or send them by email if it seems hard, and I will do it for you :)
*/
const translations = {
  "hide list": {
    en: "▲ Hide list",
    sv: "▲ Göm lista",
    de: "▲ Liste ausblenden",
    it: "▲ Nascondi lista"
  },
  "show list": {
    en: "▼ Show list",
    sv: "▼ Visa lista",
    de: "▼ Liste anzeigen",
    it: "▼ Mostra lista"
  },
  "include yourself": {
    en: "Include yourself",
    sv: "Inkludera dig själv",
    de: "Schließen Sie sich ein",
    it: "Includi te stesso"
  },
  "sort by last name": {
    en: "Sort by last name",
    sv: "Sortera efter efternamn",
    de: "Nach Nachnamen sortieren",
    it: "Ordina per cognome"
  },
  "include not on list": {
    en: "Include people not on comparison list",
    sv: "Inkludera folk som inte är på jämförelselistan",
    de: "Personen einschließen, die nicht auf der Vergleichsliste stehen",
    it: "Includi persone non presenti nell'elenco di confronto"
  },
  "close": {
    en: "Close",
    sv: "Stäng",
    de: "Schließen",
    it: "Chiudi"
  },
  "persons": {
    en: "persons",
    sv: "personer",
    de: "Personen",
    it: "persone"
  },
  "update list": {
    en: "Update list",
    sv: "Uppdatera listan",
    de: "Aktualisieren Liste",
    it: "Aggiorna lista"
  },
  "copy list": {
    en: "Copy list",
    sv: "Kopiera lista",
    de: "Kopieren Liste",
    it: "Copia lista"
  },
  "randomize person": {
    en: "Randomize person",
    sv: "Slumpa person",
    de: "Zufällige Person",
    it: "Persona casuale"
  },
  "show comparison list": {
    en: "◄ Show comparison list",
    sv: "◄ Visa jämföringslista",
    de: "◄ Vergleichsliste anzeigen",
    it: "◄ Mostra lista di confronto"
  },
  "hide comparison list": {
    en: "► Hide comparison list",
    sv: "► Göm jämföringslista",
    de: "► Vergleichsliste ausblenden",
    it: "► Nascondi lista di confronto"
  },
  "show group generator": {
    en: "◄ Show group generator",
    sv: "◄ Visa grupp skapande",
    de: "◄ Gruppenerstellung anzeigen",
    it: "◄ Mostra generatore di gruppi"
  },
  "hide group generator": {
    en: "► Hide group generator",
    sv: "► Göm grupp skapande",
    de: "► Gruppenerstellung ausblenden",
    it: "► Nascondi generatore di gruppi"
  },
  "Insert comparison list": {
    en: "Insert comparison list",
    sv: "Kopiera in jämföringslista",
    de: "Vergleichsliste einfügen",
    it: "Inserisci lista di confronto"
  },
  "clean comparison list": {
    en: "Clean comparison list",
    sv: "Städa jämföringslistan",
    de: "Liste reinigen",
    it: "Pulisci lista"
  },
  "class": {
    en: "Class",
    sv: "Klass",
    de: "Gruppe",
    it: "Classe"
  },
  "save list": {
    en: "Save list",
    sv: "Spara lista",
    de: "Liste speichern",
    it: "Salva lista"
  },
  "load list": {
    en: "Load list",
    sv: "Ladda lista",
    de: "Liste laden",
    it: "Carica lista"
  },
  "remove list": {
    en: "Remove list",
    sv: "Ta bort lista",
    de: "Gruppe entfernen",
    it: "Rimuovi lista"
  },
  "result:": {
    en: "Result:",
    sv: "Resultat:",
    de: "Ergebnis:",
    it: "Risultato"
  },
  "click on compare": {
    en: "Click on compare",
    sv: "Klicka på jämför",
    de: "Klicken Sie auf Vergleichen",
    it: "Clicca su confronta"
  },
  "copy for chat": {
    en: "Copy for chat",
    sv: "Kopiera för chatten",
    de: "Kopie für den Chat",
    it: "Copia per la chat"
  },
  "compare attendees": {
    en: "Compare Attendees",
    sv: "Jämför deltagare",
    de: "Teilnehmer vergleichen",
    it: "Confronta i partecipanti"
  },
  "compare": {
    en: "Compare",
    sv: "Jämför",
    de: "Vergleichen",
    it: "Confronta"
  },
  "attendance": {
    en: "Attendance",
    sv: "Närvaro",
    de: "Anwesenheit",
    it: "Presenza"
  },
  "settings": {
    en: "Settings",
    sv: "Inställningar",
    de: "Einstellung",
    it: "Impostazioni"
  },
  "dark mode": {
    en: "Dark mode",
    sv: "Mörkt läge",
    de: "Dunkles Design",
    it: "Modalità scura"
  },
  "sort compare list by status": {
    en: "Sort compare list by status",
    sv: "Sortera jämföringslistan efter status",
    de: "Sortierliste nach Status sortieren",
    it: "Ordina elenco di confronto per stato"
  },
  "create groups": {
    en: "Create groups",
    sv: "Skapa grupper",
    de: "Gruppen erstellen",
    it: "Crea gruppi"
  },
  "users per group": { 
    en: "Users / group",
    sv: "Användare / grupp",
    de: "Benutzer / Gruppe",
    it: "Utenti / gruppo"
  },
  "number of groups": { 
    en: "Number of groups",
    sv: "Antal grupper",
    de: "Anzahl der Gruppen",
    it: "Numero di gruppi"
  },
  "generate groups": { 
    en: "Generate groups",
    sv: "Generera grupper",
    de: "Gruppen generieren",
    it: "Genera gruppi"
  },
  "copy groups": { 
    en: "Copy groups",
    sv: "Kopiera grupper",
    de: "Gruppen kopieren",
    it: "Copia gruppi"
  },
  "copy meets": { 
    en: "Copy Meets-links",
    sv: "Kopiera Meet-länkarna",
    de: "Meeting-Links kopieren",
    it: "Copia i link-Meet"
  },
  "force language ": {
    en: "Force language (reload required)",
    sv: "Tvinga språk (omladdning krävs)",
    it: "Forza lingua (richiede riavvio)"
  },
  "use comparison list": {
    en: "Use comparison list",
    sv: "Använd jämförelselistan",
    it: "Usa lista di confronto"
  },
  "reset meets":{
    en: "Reset Meet-links",
    sv: "Nollställ Meet-länkarna",
    it: "Resetta i link-Meet"
  },
  "new meet link warning":{
    en: "Press \"Generate groups\" to use the new Meet links",
    sv: "Tryck på \"Generera grupper\" för att använda de nya Meet-länkarna",
    it: "Premi \"Genera gruppi\" per utilizzare i nuovi link-meet"
  },
  "shorten link":{
    en: "Shorten links (g.co)",
    sv: "Förkorta länkar (g.co)",
    it: "Abbrevia i link (g.co)"
  },
  "use built in grid view":{
    en: "Use Google's Grid View",
    sv: "Använd Googles Grid View",
    it: "Usa la vista a griglia di Google"
  }
}

// Add you in your language
let youArray = ["You","Du"]

// localstorage test
try {
  localStorage.setItem("test", "hello")
  localStorage.removeItem("test")
} catch(e) {
  alert("localStorage is required for the extension to function correctly")
}

// Declare all global variables
let resultHeader = null
let settingsMenu = null
let peopleList = null
let peopleCounter = null
let yourName = null
let savedClasses = null
if (localStorage.getItem("gma-class-options") && localStorage.getItem("gma-class-options") != "[object Object]") {
  try {
    savedClasses = JSON.parse(localStorage.getItem("gma-class-options"))
  } catch(e) {
    console.log(e)
    savedClasses = JSON.parse("{}")
    localStorage.removeItem("gma-class-options")
  }
} else {
  savedClasses = JSON.parse("{}")
}
let pos1, pos2, pos3, pos4 = 0

let forceLanguage = "auto"
if (localStorage.getItem("gma-force-language") !== null) {
  forceLanguage = localStorage.getItem("gma-force-language")
}


if (localStorage.getItem("gmca-attendees-list") && (localStorage.getItem("gmca-attendees-list")[0] != "[")) {
  localStorage.setItem("gmca-attendees-list", JSON.stringify(localStorage.getItem("gmca-attendees-list").split(",")))
}

// Css for our project because we couldn't use a seperate css file.
const s = document.createElement("style")
s.innerText = `
.__gma-old-meet:hover {
  z-index: 8;
  background-color: var(--gm-neutral-highlight-color)
}

.__gma-button {
  overflow: visible
}

.__gma-old-meet:hover>#attendees-list-gma {
  display: flex
}

.__gma-new-meet {
  padding: 12px;
}

.__gma-new-meet:hover {
  z-index: 8;
  background-color: #28292C
}

#attendees-list-gma label {
  display: block;
  line-height: 24px;
  color: #999
}

#attendees-list-gma label:not(.disabled) {
  cursor: pointer;
  color: #000
}

#attendees-list-gma label small {
  display: block;
  line-height: 12px;
  font-weight: 400
}

#attendees-list-gma hr {
  border: 0;
  height: 1px;
  background: #f1f3f4
}

#attendees-list-gma a {
  box-shadow: -3px -3px 3px 0 rgba(255, 255, 255, 0.384), 3px 3px 3px 0 rgba(0, 0, 0, .09);
  display: inline-block;
  border-radius: 2rem;
  color: var(--gm-body-text-color);
  cursor: pointer;
  background-color: gainsboro;
  padding: 0 10px;
  margin: 5px 2px;
  height: 34px
}

#attendees-list-gma #update {
  display: inline-block;
  width: 34px;
  height: 34px;
  border-radius: 2rem 0 0 2rem;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="-244 -244 956 956"><path d="M67 288H0v160l47-44a256 256 0 0 0 209 108c131 0 238-98 254-224h-65a192 192 0 0 1-350 73l79-73zM256 0C125 0 18 98 2 224h65a192 192 0 0 1 353-68l-68 68h160V64l-46 46A256 256 0 0 0 256 0zm0 0"/></svg>');
  background-repeat: no-repeat;
  background-position: center center;
  background-color: gainsboro
}

#attendees-list-gma #update:hover, #attendees-list-gma #show-list:hover, #attendees-list-gma a:hover {
  background-color: #f1f3f4
}

#attendees-list-gma textarea, #generated-groups {
  width: calc(258px - 15px); /* this seems to break the layout?*/ 
  resize: none;
  border: 3px gainsboro solid;
  border-radius: 6px
}

#attendees-list-gma textarea {
  height: 20vh;
  max-height: 300px;
}

#attendees-div textarea {
  height: 35vh;
  max-height: 525px;
}

#classSave, #cleanCompareList {
  float: right;
}

#removeClass {
  position: absolute;
  right: 20px;
}

#chooseClass {
  height: 21px;
}

#classInput , #chooseClass{
  width: 50%;
  margin: 10px 0;
}

#attendees-list-gma #show-list {
  display: inline-flex;
  border-radius: 0 2rem 2rem 0;
  height: 34px;
  position: absolute;
  background-color: gainsboro;
  padding: 0 9px;
  line-height: 34px
}

#attendees-list-gma #settingsButton {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -4 32 32"><path d="M13.85 22.25h-3.7c-.74 0-1.36-.54-1.45-1.27l-.27-1.89c-.27-.14-.53-.29-.79-.46l-1.8.72c-.7.26-1.47-.03-1.81-.65L2.2 15.53c-.35-.66-.2-1.44.36-1.88l1.53-1.19c-.01-.15-.02-.3-.02-.46 0-.15.01-.31.02-.46l-1.52-1.19c-.59-.45-.74-1.26-.37-1.88l1.85-3.19c.34-.62 1.11-.9 1.79-.63l1.81.73c.26-.17.52-.32.78-.46l.27-1.91c.09-.7.71-1.25 1.44-1.25h3.7c.74 0 1.36.54 1.45 1.27l.27 1.89c.27.14.53.29.79.46l1.8-.72c.71-.26 1.48.03 1.82.65l1.84 3.18c.36.66.2 1.44-.36 1.88l-1.52 1.19c.01.15.02.3.02.46s-.01.31-.02.46l1.52 1.19c.56.45.72 1.23.37 1.86l-1.86 3.22c-.34.62-1.11.9-1.8.63l-1.8-.72c-.26.17-.52.32-.78.46l-.27 1.91c-.1.68-.72 1.22-1.46 1.22zm-3.23-2h2.76l.37-2.55.53-.22c.44-.18.88-.44 1.34-.78l.45-.34 2.38.96 1.38-2.4-2.03-1.58.07-.56c.03-.26.06-.51.06-.78s-.03-.53-.06-.78l-.07-.56 2.03-1.58-1.39-2.4-2.39.96-.45-.35c-.42-.32-.87-.58-1.33-.77l-.52-.22-.37-2.55h-2.76l-.37 2.55-.53.21c-.44.19-.88.44-1.34.79l-.45.33-2.38-.95-1.39 2.39 2.03 1.58-.07.56a7 7 0 0 0-.06.79c0 .26.02.53.06.78l.07.56-2.03 1.58 1.38 2.4 2.39-.96.45.35c.43.33.86.58 1.33.77l.53.22.38 2.55z"></path><circle cx="12" cy="12" r="3.5"></circle></svg>');
  display: inline-block;
  position: absolute;
  text-align: center;
  right: 0;
  padding: 5px;
  height: auto;
  width: 24px;
  height: 24px;
}

#settingsButton svg {
  display: flex;
  justify-content: center;
  align-items: center
}

#attendees-list-gma #settingsMenu {
  position: absolute;
  text-align: center;
  top: 100px;
  left: -100px;
  background-color: white;
  z-index: 3;
  border: 3px #2196F3 solid;
  border-radius: 8px;
}

#attendees-list-gma #settingsMenu label {
  text-align: left;
  margin: 2px 4px 0 4px;
}

#attendees-list-gma #settingsHeader {
  padding: 5px;
  cursor: move;
  background-color: #2196F3;
  color: white
}

#attendees-list-gma {
  box-sizing: border-box;
  display: none;
  padding: 15px 20px 20px 0;
  background: white;
  text-align: left;
  cursor: auto;
  line-height: 36px;
  flex-direction: row-reverse;
  position: absolute;
  right: -232px;
  border-radius: 0 0 8px 8px;
  z-index: 7;
  top: 48px;
  max-height: 80vh;
  white-space: pre-wrap;
}

#attendees-list-gma > * {
  position: relative;
  width: 258px
}

.__gma-new-meet > div#attendees-list-gma {
  top: calc(-40vh - 320px);
  right: -210px;
  color: black;
  border-radius: 8px 0 0 8px;
}

#compare-div, #create-groups-div {
  padding: 0 20px 5px 20px;
  border-right: 3px dashed gainsboro
}

#compare-result-list {
  display: block;
}

#create-groups-grid {
  display: grid;
  grid-template-columns: repeat(2,1fr);
  grid-template-areas: 
  "type-of-group group-number-selector"
  "make-group-button make-group-button"
  "use-comp-list use-comp-list"
  "generated-groups generated-groups"
  "copy-generated-groups copy-generated-groups"
  "copy-generated-meets copy-generated-meets"
  "reset-meets reset-meets";
  grid-template-rows: auto auto auto auto;
}

#type-of-group {
  grid-area: type-of-group;
  border-radius: 1.1rem;
  background-color: #efefef;
}

#type-of-group > * {
  text-align: center;
  border-radius: 2rem;
  font-size: 0.8rem;
  padding: 0 7px 0 7px;
}

#create-groups-grid .selected {
  background-color: #2196F3;
  color: white;
}

#group-number-selector {
  width: 50%;
  height: 50%;
  display: flex;
  justify-self: center;
  align-self: center;
  grid-area: group-number-selector;
}

#make-group-button {
  grid-area: make-group-button;
  text-align: center;
  width: fit-content;
  justify-self: center;
}

#generated-groups {
  grid-area: generated-groups;
  width: auto;
  height: 35vh;
  max-height: 400px;
  overflow-y: scroll;
  display: block;
  border-collapse: collapse;
}
/*
#generated-groups tr > *:not(:first-child) {
  border-left: gainsboro 1px solid;
}
*/
#generated-groups tr th {
  text-align: center;
  font-size: 1.2rem;
}

#generated-groups tr td {
  text-align: center;
}

#generated-groups tr th a {
  padding: 0;
  width: 2.3rem;
  height: 2.3rem;
}

#copy-generated-groups, #copy-generated-meets, #use-comp-list, #reset-meets {
  text-align: center;
  width: fit-content;
  justify-self: center;
}

#copy-generated-groups {
  grid-area: copy-generated-groups;
}

#copy-generated-meets {
  grid-area: copy-generated-meets;
}

#use-comp-list {
  grid-area: use-comp-list;
}

#reset-meets {
  grid-area: reset-meets;
}

#attendees-div {
  padding-left: 20px
}

#attendees-list-gma h1 {
  font-size: 1.75rem;
}

#attendees-list-gma h2 {
  font-size: 1.3rem;
}

#attendees-list-gma h3 {
  font-size: 1rem;
}

h1, h2, h3, #attendees-list-gma p {
  margin: 0
}
.rKOYsc {
  z-index: 0 !important;
}

#attendees-list-gma.dark_mode, #attendees-list-gma.dark_mode #settingsMenu, #attendees-list-gma.dark_mode #settingsMenu label {
  background-color: #181e23;
  color: white;
}

#attendees-list-gma.dark_mode #settingsMenu {
  border-color: #2196f324;
}

#attendees-list-gma.dark_mode #settingsHeader {
  background-color: #2196f324;
}

#attendees-list-gma.dark_mode #update {
  background-image: url('data:image/svg+xml;utf8,<svg fill="%23FFFFFF" xmlns="http://www.w3.org/2000/svg" viewBox="-244 -244 956 956"><path d="M67 288H0v160l47-44a256 256 0 0 0 209 108c131 0 238-98 254-224h-65a192 192 0 0 1-350 73l79-73zM256 0C125 0 18 98 2 224h65a192 192 0 0 1 353-68l-68 68h160V64l-46 46A256 256 0 0 0 256 0zm0 0"/></svg>');
}

#attendees-list-gma.dark_mode #settingsButton {
  background-image: url('data:image/svg+xml;utf8,<svg fill="%23FFFFFF" xmlns="http://www.w3.org/2000/svg" viewBox="-4 -4 32 32"><path d="M13.85 22.25h-3.7c-.74 0-1.36-.54-1.45-1.27l-.27-1.89c-.27-.14-.53-.29-.79-.46l-1.8.72c-.7.26-1.47-.03-1.81-.65L2.2 15.53c-.35-.66-.2-1.44.36-1.88l1.53-1.19c-.01-.15-.02-.3-.02-.46 0-.15.01-.31.02-.46l-1.52-1.19c-.59-.45-.74-1.26-.37-1.88l1.85-3.19c.34-.62 1.11-.9 1.79-.63l1.81.73c.26-.17.52-.32.78-.46l.27-1.91c.09-.7.71-1.25 1.44-1.25h3.7c.74 0 1.36.54 1.45 1.27l.27 1.89c.27.14.53.29.79.46l1.8-.72c.71-.26 1.48.03 1.82.65l1.84 3.18c.36.66.2 1.44-.36 1.88l-1.52 1.19c.01.15.02.3.02.46s-.01.31-.02.46l1.52 1.19c.56.45.72 1.23.37 1.86l-1.86 3.22c-.34.62-1.11.9-1.8.63l-1.8-.72c-.26.17-.52.32-.78.46l-.27 1.91c-.1.68-.72 1.22-1.46 1.22zm-3.23-2h2.76l.37-2.55.53-.22c.44-.18.88-.44 1.34-.78l.45-.34 2.38.96 1.38-2.4-2.03-1.58.07-.56c.03-.26.06-.51.06-.78s-.03-.53-.06-.78l-.07-.56 2.03-1.58-1.39-2.4-2.39.96-.45-.35c-.42-.32-.87-.58-1.33-.77l-.52-.22-.37-2.55h-2.76l-.37 2.55-.53.21c-.44.19-.88.44-1.34.79l-.45.33-2.38-.95-1.39 2.39 2.03 1.58-.07.56a7 7 0 0 0-.06.79c0 .26.02.53.06.78l.07.56-2.03 1.58 1.38 2.4 2.39-.96.45.35c.43.33.86.58 1.33.77l.53.22.38 2.55z"></path><circle cx="12" cy="12" r="3.5"></circle></svg>')
}

#attendees-list-gma.dark_mode > * {
  border-color: #0000006b;
}

#attendees-list-gma.dark_mode a, #attendees-list-gma.dark_mode #update, #attendees-list-gma.dark_mode #show-list {
  background-color: #38393f;
  color: white;
  box-shadow: none;
}

#attendees-list-gma.dark_mode textarea, #attendees-list-gma.dark_mode input, #attendees-list-gma.dark_mode select, #attendees-list-gma.dark_mode select option {
  color: white;
  background-color: #181e23;
  border-color: #0000003d;
}

#attendees-list-gma.dark_mode #type-of-group {
  background-color: #38393f;
}

#attendees-list-gma.dark_mode #generated-groups {
  border: 3px #0000003d solid;
}

#attendees-list-gma.dark_mode #create-groups-grid .selected {
  background-color: #ffffff70;
}

::placeholder { 
  color: lightgrey;
  opacity: 1; 
}
`
document.body.append(s)
var newmeet = false
var useOldClassSelector = true

setInterval(() => {
  newmeet = false
  useOldClassSelector = true
  let screencast = document.querySelectorAll("[data-fps-request-screencast-cap]")
  var buttons
  if (!(screencast.length == 0)){
    buttons = screencast[screencast.length-1].parentElement.parentElement.parentElement
  } else if(document.getElementsByClassName("NzPR9b").length != 0) {
    screencast = document.getElementsByClassName("NzPR9b")
    buttons = screencast[0]
    useOldClassSelector = false
  } else {
    newmeet = true
    buttons = document.querySelector("div.SGP0hd.kunNie")
  }
  
  if ((buttons) && (document.getElementsByClassName("__gma-button").length == 0)) {
    console.log("%c Initialized Attendees Script", "background: #FFFFFF; color: #242424")
    
    if (useOldClassSelector) {
      buttons.prepend(buttons.children[3].cloneNode())
    } else {
      buttons.prepend(buttons.children[1].cloneNode())
    }
    
    const toggleButton = document.createElement("div")
    toggleButton.classList = buttons.children[3].classList
    toggleButton.classList.add("__gma-button")

    if (newmeet) {
      toggleButton.classList.add("__gma-new-meet")
    } else {
      toggleButton.classList.add("__gma-old-meet")
    }

    if (toggleButton.classList.contains("__gmgv-button")) {
      toggleButton.classList.remove("__gmgv-button")
    }
    toggleButton.style.display = "flex"
    toggleButton.onclick = () => {
      let elem = document.getElementById("attendees-list-gma")
      if (elem.__pinned) {
        elem.style.display = null
        elem.__pinned = false
      } else {
        elem.style.display = "flex"
        elem.__pinned = true
        document.firstElementChild.onclick = (event) => {
          if (event.target.innerText == "Hide Participant") {
            let elem = document.getElementById("attendees-list-gma")
            elem.style.display = null
            elem.__pinned = false
            document.firstElementChild.onclick = ""
          }
        }
      }
    }
    buttons.prepend(toggleButton)
    
    // Adds a icon to item bar 
    const toggleButtonSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    toggleButtonSVG.id = "icon"
    toggleButtonSVG.style.width = "24px"
    toggleButtonSVG.style.height = "24px"
    toggleButtonSVG.setAttribute("viewBox", "0 0 24 24")
    toggleButtonSVG.innerHTML = "<path fill=\"currentColor\" d=\"M11.41 3.76c-.8.04-1.6.31-2.27.86-1.5 1.22-1.89 3.52-.59 5.06 1.06 1.24 3.02 1.55 4.3.4.98-.88 1.21-2.5.2-3.52a2.05 2.05 0 00-1.34-.6c-.5-.02-1.05.17-1.42.61-.23.29-.35.64-.33 1.01.01.38.23.82.65 1.01.32.14.52.1.78-.01a.7.7 0 00.39-.37.74.74 0 00-.07-.65l-.84.54a.41.41 0 01-.01-.3c.05-.11.12-.13.13-.14l.04.02c-.07-.03-.07-.04-.07-.14s.05-.27.1-.33a.67.67 0 01.6-.25c.24.02.51.13.69.3.56.57.41 1.55-.18 2.08-.82.74-2.14.53-2.85-.3-.92-1.09-.63-2.76.45-3.64 1.34-1.09 3.37-.73 4.42.6 1.25 1.6.82 3.98-.77 5.2l.61.79a4.73 4.73 0 00.94-6.6 4.31 4.31 0 00-3.56-1.63zm.44 9.55c-1.42 0-3.45.34-5.19 1.04-.87.35-1.67.79-2.28 1.35a2.9 2.9 0 00-1.03 2.11v3.5h17v-3.5a2.9 2.9 0 00-1.04-2.11c-.6-.56-1.4-1-2.27-1.35a15.08 15.08 0 00-5.2-1.04zm0 1c1.25 0 3.22.33 4.81.97.8.32 1.5.72 1.97 1.15.48.44.72.89.72 1.38v2.5h-15v-2.5c0-.5.24-.94.71-1.38a6.57 6.57 0 011.97-1.15c1.6-.64 3.57-.97 4.82-.97zm0 1c-1.43 0-2.92.34-4.11.77-.6.21-1.11.45-1.51.7-.4.25-.74.45-.86.9l-.02.08v1.55h13v-1.57l-.02-.06c-.13-.47-.46-.66-.87-.9-.4-.25-.91-.49-1.5-.7a12.56 12.56 0 00-4.11-.77zm0 1c1.27 0 2.68.31 3.77.7.54.2 1 .42 1.32.62.3.19.42.38.4.3v.38h-11v-.37c0 .07.1-.12.41-.3.32-.2.79-.42 1.33-.62 1.09-.4 2.5-.7 3.77-.7z\"></path>"
    toggleButton.appendChild(toggleButtonSVG)
    
    // Creates the main div for every element
    const additionalOptions = addElement("div",toggleButton,"attendees-list-gma",null)
    additionalOptions.onclick = e => e.stopPropagation()
    
    const seeAttendeesDiv = addElement("div",additionalOptions,"attendees-div",null)
    additionalOptions.onmouseout = () => {
      // Change to screencast const variable
      document.getElementsByClassName("NzPR9b")[0].style.borderBottomLeftRadius = "8px"
    }
    
    additionalOptions.onmouseover = () => {
      if (compare.style.display !== "none") {
        document.getElementsByClassName("NzPR9b")[0].style.borderBottomLeftRadius = "0"
      }
    }
    
    addElement("h1",seeAttendeesDiv,null,T("attendance"))
    
    const updateListI = addElement("a",seeAttendeesDiv,"update",null)
    updateListI.onclick = getAllAttendees
    
    const showListI = addElement("a",seeAttendeesDiv,"show-list",T("hide list"))
    showListI.onclick = (e) => {
      if (peopleList.style.display === "none") {
        peopleList.style.display = "flex"
        e.target.innerText = T("hide list")
      } else {
        peopleList.style.display = "none"
        e.target.innerText = T("show list")
      }
    }
    
    const settings = addElement("a",seeAttendeesDiv,"settingsButton",null)
    settings.onclick = () => {
      showElement(document.getElementById("settingsMenu"))
    }
    
    settingsMenu = addElement("div",seeAttendeesDiv,"settingsMenu",null)
    settingsMenu.style.display = "none"
    
    const settingsHeader = addElement("div",settingsMenu,"settingsHeader",T("settings"))
    
    settingsHeader.style.display = "block"
    settingsHeader.onmousedown = (even) => {
      movableDiv(even, "settingsMenu")
    }
    
    // Calls addSetting function
    addSetting("gma-include-yourself", T("include yourself"))
    addSetting("gma-sort-by-last-name",T("sort by last name"))
    addSetting("gma-add-not-on-list",T("include not on list"))
    // addSetting("gma-more-letters",T("maximize letters"))
    addSetting("gma-sort-on-compare",T("sort compare list by status"))
    addSetting("gma-shorten-link",T("shorten link"))
    addSetting("gma-original-grid-view",T("use built in grid view"))

    let forceLanguageParent = addElement("label", settingsMenu, null, T("force language "))
    let forceLanguageElem = document.createElement("select")

    let forceLanguageOptions = ["Auto","English","Swedish","Italian","German"]
    let forceLanguageValue = ["auto","en","sv","it","de"]

    for(let i = 0; i < forceLanguageOptions.length; i++) {
      let el = document.createElement("option")
      el.textContent = forceLanguageOptions[i]
      el.value = forceLanguageValue[i]
      forceLanguageElem.appendChild(el)
    }
    forceLanguageElem.value = forceLanguage

    forceLanguageElem.onchange = e => {
      localStorage.setItem("gma-force-language", e.target.value)
      forceLanguage = e.target.value
    }
    forceLanguageParent.prepend(forceLanguageElem)

    const darkModeParent = addElement("label", settingsMenu, null,T("dark mode"))
    const darkMode = document.createElement("input")
    darkMode.type = "checkbox"
    if (localStorage.getItem("gma-dark-mode") === "true") {
      darkMode.checked = true
      additionalOptions.className = "dark_mode"
    }
    darkMode.onchange = e => {
      localStorage.setItem("gma-dark-mode", e.target.checked)
      additionalOptions.classList.toggle("dark_mode")
    }
    darkModeParent.prepend(darkMode)
    
    const closeSettings = addElement("a",settingsMenu,null,T("close"))
    closeSettings.onclick = () => {
      showElement(document.getElementById("settingsMenu"))
    }
    
    peopleCounter = document.createElement("p")
    peopleList = document.createElement("textarea")
    peopleList.readOnly = true
    // peopleList.rows = 20
    let attendees = localStorage.getItem("gmca-attendees-list")
    if (attendees) {
      // peopleList.value = attendees.replace(/,/g, String.fromCharCode(13, 10))
      peopleList.value = JSON.parse(attendees).join(String.fromCharCode(13, 10))
      peopleCounter.innerText = (attendees.length - attendees.replace(/,/g, "").length + 1) + " " + T("persons")
    } else {
      peopleList.value = T("update list")
      peopleCounter.innerText = "0 " + T("persons")
    }
    peopleList.style.display = "block"
    seeAttendeesDiv.appendChild(peopleList)
    seeAttendeesDiv.appendChild(peopleCounter)
    
    const copyList = addElement("a",seeAttendeesDiv,null,T("copy list"))
    copyList.onclick = () => {
      navigator.clipboard.writeText(JSON.parse(localStorage.getItem("gmca-attendees-list")).join("\n"))
    }
    
    const randomPerson = addElement("a",seeAttendeesDiv,null,T("randomize person"))
    randomPerson.onclick = () => {
      let attendees = JSON.parse(localStorage.getItem("gmca-attendees-list"))
      setTimeout(() => { // to make it async
        alert(attendees[Math.floor(Math.random() * attendees.length)])
      }, 1)
    }
    
    const showCompareList = addElement("a",seeAttendeesDiv,null,T("show comparison list"))
    showCompareList.onclick = (e) => {
      if (compare.style.display === "none") {
        compare.style.display = "block"
        e.target.innerText = T("hide comparison list")
        additionalOptions.style.borderRadius = "8px 0 8px 8px"
        document.getElementsByClassName("NzPR9b")[0].style.borderBottomLeftRadius = "0"
      } else {
        compare.style.display = "none"
        e.target.innerText = T("show comparison list")
        additionalOptions.style.borderRadius = "0 0 8px 8px"
        document.getElementsByClassName("NzPR9b")[0].style.borderBottomLeftRadius = "8px"
      }
    }
    
    const showCreateGroups = addElement("a",seeAttendeesDiv,null,T("show group generator"))
    showCreateGroups.onclick = (e) => {
      if (createGroups.style.display === "none") {
        createGroups.style.display = "block"
        e.target.innerText = T("hide group generator")
        additionalOptions.style.borderRadius = "8px 0 8px 8px"
        document.getElementsByClassName("NzPR9b")[0].style.borderBottomLeftRadius = "0"
      } else {
        createGroups.style.display = "none"
        e.target.innerText = T("show group generator")
        additionalOptions.style.borderRadius = "0 0 8px 8px"
        document.getElementsByClassName("NzPR9b")[0].style.borderBottomLeftRadius = "8px"
      }
    }
    
    const compare = addElement("div",additionalOptions,"compare-div",null)
    compare.style.display = "none"
    
    addElement("h2",compare,null,T("compare attendees"))
    
    const compareList = addElement("textarea",compare,"compare-list",null)
    // compareList.rows = 10
    compareList.placeholder = T("Insert comparison list")
    compareList.style.display = "block"
    
    const compareButton = addElement("a",compare,null,T("compare"))
    compareButton.onclick = compareLists
    
    const cleanCompare = addElement("a",compare,"cleanCompareList",T("clean comparison list"))
    cleanCompare.onclick = cleanCompareLists
    
    const classInput = addElement("input",compare,"classInput",null)
    classInput.attributes["type"] = "text"
    classInput.placeholder = T("class")
    classInput.autocomplete = "off"
    
    const saveButton = addElement("a",compare,"classSave",T("save list"))
    saveButton.onclick = saveClass
    
    const chooseClass = addElement("select",compare,"chooseClass",null)
    
    const defaultClassOption = addElement("option",chooseClass,null,T("load list"))
    
    chooseClass.onchange = (selectedClass) => {
      Object.entries(savedClasses).forEach(className => {
        if (className[0] == selectedClass.target.selectedOptions[0].value){
          document.getElementById("compare-list").value = className[1].join(String.fromCharCode(13, 10))
        }
        if (defaultClassOption.selected) {
          document.getElementById("compare-list").value = ""
        }
      })
    }
    
    if (savedClasses) {
      Object.keys(savedClasses).forEach(className => {
        let chooseClassOptions = document.createElement("option")
        chooseClassOptions.innerText = className
        chooseClass.appendChild(chooseClassOptions)
      })
    }
    
    const removeClass = addElement("a",compare,"removeClass",T("remove list"))
    removeClass.onclick = () => {
      let classElement = document.getElementById("chooseClass")
      let className = classElement.selectedOptions[0].value
      if (className != T("load list")) {
        classElement.removeChild(classElement.selectedOptions[0])
      }
      classElement.firstChild.selected = true
      document.getElementById("compare-list").value = null
      removeClassName(className)
    }
    
    resultHeader = addElement("h3",compare,"resultHeader",T("result:"))
    
    const compareResultList = addElement("textarea",compare,"compare-result-list",null)
    // compareResultList.rows = 10
    compareResultList.readOnly = true
    compareResultList.value = T("click on compare")
    
    const copyCompareList = addElement("a",compare,null,T("copy list"))
    copyCompareList.onclick = () => {
      navigator.clipboard.writeText(compare.children[compare.childElementCount-3].value)
    }
    
    const copyCompareListForChat = addElement("a",compare,null,T("copy for chat"))
    copyCompareListForChat.onclick = () => {
      let toCopy = compare.children[compare.childElementCount-3].value
      
      if (toCopy.length > 500) {
        toCopy = getShortName(toCopy.split("\n"), true).join("\n")

        if (toCopy.length > 500) {
          toCopy = toCopy.split("\n").map(elem => elem.slice(0, -1)).join("\n")
          if (toCopy.length > 500) {
            toCopy = toCopy.replace(/\./g, "")
          }  
        }

        // if (localStorage.getItem("gma-more-letters") === "true") {
        //   while (toCopy.length > 500) {
        //     toCopy = toCopy.split("\n").map(elem => elem.split(" ").concat("").concat("").slice(0, 3).join(" ").slice(0, -1)).join("\n")
        //   }
        // } else {
        //   toCopy = toCopy.split("\n").map((elem) => {
        //     let spacePosition = elem.indexOf(" ", 3)
        //     if (spacePosition > 0) {
        //       return elem.substring(0, spacePosition+2)
        //     } else {
        //       return elem
        //     }
        //   }).join("\n")
        // }
        
        while (toCopy.length > 500) {
          toCopy = toCopy.split("\n").map(elem => elem.slice(0, -1)).join("\n")
        }
      }
      
      navigator.clipboard.writeText(toCopy)
    }

    // group generator
    const createGroups = addElement("div",additionalOptions,"create-groups-div",null)
    createGroups.style.display = "none"
    
    // Lägg till översättning
    addElement("h2",createGroups,null,T("create groups"))

    const createGroupsGrid = addElement("div",createGroups,"create-groups-grid",null)
    
    // Choose to generate groups by number of people or number of groups
    const numberOfGroups = addElement("div",createGroupsGrid,"type-of-group",null)
    const groupsWithPeople = addElement("div",numberOfGroups,"group-members",T("users per group"))
    groupsWithPeople.onclick = (e) => {
      document.getElementById("group-number").className = ""
      e.target.className = "selected"
    }
    const groupsWithNumber = addElement("div",numberOfGroups,"group-number",T("number of groups"))
    groupsWithNumber.className = "selected"
    groupsWithNumber.onclick = (e) => {
      document.getElementById("group-members").className = ""
      e.target.className = "selected"
    }
    
    // Creates the dropdown menu
    const groupNumberSelector = addElement("select",createGroupsGrid,"group-number-selector",null)
    for (let i = 1; i < 15; i++) {
      addElement("option",groupNumberSelector,null,i)
    }

    const generateGroupsButton = addElement("a",createGroupsGrid,"make-group-button",T("generate groups"))
    generateGroupsButton.onclick = generateGroups

    let parent = addElement("label", createGroupsGrid, "use-comp-list", T("use comparison list"))
    let elem = document.createElement("input")
    elem.type = "checkbox"
    elem.checked = localStorage.getItem("gma-use-comp-list-group") === "true"
    elem.onchange = e => {
      localStorage.setItem("gma-use-comp-list-group", e.target.checked)
    }
    parent.prepend(elem)
    
    // addElement("textarea",createGroupsGrid,"generated-groups",null)
    addElement("table",createGroupsGrid,"generated-groups",null)

    if (localStorage.getItem("gma-groups") !== null) {
      printOutGroups(JSON.parse(localStorage.getItem("gma-groups")))
    }

    addElement("a",createGroupsGrid,"copy-generated-groups",T("copy groups")).onclick = () => {
      copyGroups(JSON.parse(localStorage.getItem("gma-groups")))
    }
    
    addElement("a",createGroupsGrid,"copy-generated-meets",T("copy meets")).onclick = () => {
      copyMeets(JSON.parse(localStorage.getItem("gma-group-meets")), JSON.parse(localStorage.getItem("gma-groups")).length)
    }

    addElement("a",createGroupsGrid,"reset-meets",T("reset meets")).onclick = () => {
      localStorage.removeItem("gma-group-meets")
      alert(T("new meet link warning"))
    }
  }
}, 250)

const movableDiv = (even, moveID) => {
  let elmnt = document.getElementById(moveID)
  even = even || window.event
  even.preventDefault()
  pos3 = even.clientX
  pos4 = even.clientY
  
  document.onmouseup = () => {
    document.onmouseup = null
    document.onmousemove = null
  }
  
  document.onmousemove = (ev) => {
    ev = ev || window.event
    ev.preventDefault()
    pos1 = pos3 - ev.clientX
    pos2 = pos4 - ev.clientY
    pos3 = ev.clientX
    pos4 = ev.clientY
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px"
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px"
  }
}

// Removes double spaces, dots, numbers, numbers followed by a letter, empty new row and new row with space.
// This is used to clean input textarea from unnecessary signs.
const cleanCompareLists = () => {
  document.getElementById("compare-list").value = document.getElementById("compare-list").value.replace(/ {2,}|, /g, " ").replace(/\. {0,}|[0-9][a-zA-Z]|[0-9]|\n$| $|^ |\t/g, "").replace(/\n{2,}|\n | \n/g, "\n")
}

// Takes an element for input and displays it if its not ready displayed.
const showElement = (elem) => {
  if (elem.style.display === "none") {
    elem.style.display = "block"
  } else {
    elem.style.display = "none"
  }
}

const reverseName = (name) => {
  let words = name.split(" ").reverse()
  let string = ""
  for(let word in words)
    string += (word > 0 ? " " : "") + words[word]
  return string
}

// This function compares the attendees to a class list and then outputs who is present and who is not.
// Present people are marked by a green checkmark and not present people is marked by a red cross.
// People that was found in the meet but not in the class list is marked by a questionmark.   
const compareLists = () => {  
  let current = JSON.parse(localStorage.getItem("gmca-attendees-list"))
  let currentLowerCase = current.map((x) => x.toLowerCase())
  let listToCompare = document.getElementById("compare-list").value.split("\n")
  let count = 0

  let out = []
  if (listToCompare[0] != "") {
    listToCompare.forEach(listItem => {
      let lowercaseName = listItem.toLowerCase()
      if (currentLowerCase.includes(lowercaseName)) {
        out.push("✔️ " + listItem)
        count += 1
      } else if (currentLowerCase.includes(reverseName(lowercaseName))) {
        out.push("✔️ " + listItem)
        count += 1
      } else {
        out.push("❌ " + listItem)
      }
    })
  }
  
  if (current[0] != "" && localStorage.getItem("gma-add-not-on-list") === "true") {
    current.forEach(listItem => {
      if (!listToCompare.includes(listItem)) {
        out.push("❔ " + listItem)
      }
    })
  }
  if (localStorage.getItem("gma-sort-on-compare") === "true") {
    out.sort()
  }
  if (out.length > 0) {
    document.getElementById("compare-result-list").value = out.join(String.fromCharCode(13, 10))
  }
  
  let compareListPeoples = document.getElementById("compare-list").value.split("\n").length
  if (compareListPeoples > 1) {
    resultHeader.innerText = T("result:") + " " + count + "/" + compareListPeoples
  } else {
    resultHeader.innerText = T("result:")
  }
}

// Saves inputted class students in a array with the class name.
// Then stores it in localStorage to be accessed later.
const saveClass = () => {
  let className = document.getElementById("classInput").value
  let chooseClassOptions = document.createElement("option")
  chooseClassOptions.innerText = className
  let newList = savedClasses[className] == null
  if (newList) {
    document.getElementById("chooseClass").appendChild(chooseClassOptions)
  }
  savedClasses[className] = document.getElementById("compare-list").value.split("\n")
  localStorage.setItem("gma-class-options", JSON.stringify(savedClasses))
  if (newList) {
    document.getElementById("chooseClass").lastChild.selected = true
  } else {
    for (const elem of document.getElementById("chooseClass").children) {
      if (elem.text == className) {
        elem.selected = true
      }
    }
  }
}

// Removes a class that you selected in localStorage
const removeClassName = (className) => {
  savedClasses[className] = null
  delete savedClasses[className]
  localStorage.setItem("gma-class-options", JSON.stringify(savedClasses))
}

// The main function used to create elements.
// If there is no id or innertext supplied the function skips that.
const addElement = (element, parent, id, innertext) => {
  let elem = document.createElement(element)
  if (id) {
    elem.id = id
  }
  if (innertext) {
    elem.innerText = innertext
  }
  parent.appendChild(elem)
  return elem
}

// The main function for adding new options.
// It takes a path to localStorage as input and saves if the user has checked the box or not.
// "name" is a variable name.
const addSetting = (localStoragePath, name) => {
  let parent = addElement("label", settingsMenu, null, name)
  let elem = document.createElement("input")
  elem.type = "checkbox"
  elem.checked = localStorage.getItem(localStoragePath) === "true"
  elem.onchange = e => {
    localStorage.setItem(localStoragePath, e.target.checked)
  }
  parent.prepend(elem)
}

// const fetchMeet = (callback) => {
//   fetch("https://meet.google.com/new")
//     .then(res => res.text())
//     .then(body => {
//       callback(body.match(/"https:\/\/meet.google.com\/([a-z]*-[a-z]*-[a-z]*)"/)[1])
//     })
//     .catch(err => {throw(err)})
// }

const httpGet = (responseCallback) => {
  let xhr = new XMLHttpRequest()
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      responseCallback(xhr.responseText, xhr.status)
    }
  }
  xhr.open('GET', 'https://meet.google.com/new', true)
  xhr.send()
}

const generateMeets = (numberOfMeets, responseCallback) => {
  let meets = []
  let done = 0
  let linkShortener = localStorage.getItem("gma-shorten-link") === "true"

  for (let i = 0; i < numberOfMeets; i++) {
    httpGet(function (response, statusCode) {
      if (statusCode === 200) {
        if(linkShortener) {
          meets.push("https://g.co/meet/" + (response.match(/"https:\/\/meet.google.com\/([a-z]*-[a-z]*-[a-z]*)"/)[1]))
        } else {
          meets.push("https://meet.google.com/" + (response.match(/"https:\/\/meet.google.com\/([a-z]*-[a-z]*-[a-z]*)"/)[1]))
        }
        if (++done == numberOfMeets) {
          responseCallback(meets, true)
        }
      } else {
        responseCallback(null, false)
      }
    })
  }
}

const getShortName = (names, skipFirstName = false) => {
  function generateSignature(name, numberOfLetters = 1) {
    let parts = name.split(' ')
    if (skipFirstName) {
      if (parts.length <= 2) return name
      return parts.shift() + ' ' + parts.shift() + ' ' + parts.map(n => n.substring(0, numberOfLetters)).join('.') + '.'
    } else {
      if (parts.length <= 1) return name
      return parts.shift() + ' ' + parts.map(n => n.substring(0, numberOfLetters)).join('.') + '.'
    }
  }
  
  let nameSignatures = names.map(name => generateSignature(name))
  
  for(let j = 2; j < 20; j++) { // 20 letters is the limit for last names
    let temp = Array.from(nameSignatures)
    let done = true
    for (let i = 0; i < names.length; i++) {
      if (temp.includes(temp.shift())) {
        done = false
        let k = i + 1 + temp.indexOf(nameSignatures[i])
        nameSignatures[i] = generateSignature(names[i], j)
        nameSignatures[k] = generateSignature(names[k], j)
      }
    }
    if (done) break
  }
  
  return(nameSignatures)
}

// From: https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return(a)
}

const groupGenerator = (number, specifyPeople) => {
  let attendees
  if (localStorage.getItem("gma-use-comp-list-group") === "true") {
    attendees = shuffle(document.getElementById("compare-list").value.split("\n"))
  } else {
    attendees = shuffle(JSON.parse(localStorage.getItem("gmca-attendees-list")))
  }
  attendees = getShortName(attendees)
  
  if (specifyPeople){
    number = Math.floor((attendees.length) / number)
  }
  
  let groups = []
  for(let i = 0; i < number; i++) {
    groups.push([])
  }

  for (let i = 0; i < attendees.length; i++) {
    groups[i % number].push(attendees[i])
  }

  localStorage.setItem("gma-groups", JSON.stringify(groups))
  return(groups)
}

const generateGroups = () => {
  let number = document.getElementById("group-number-selector").value
  let groupsByPeople = document.getElementById("group-members").className
  let groupsByNumber = document.getElementById("group-number").className
  let groups

  switch("selected") {
  case groupsByPeople:
    groups = groupGenerator(number, true)
    printOutGroups(groups)

    break

  case groupsByNumber:
    groups = groupGenerator(number, false)
    printOutGroups(groups)
    break

  default:
    console.log("Group switch failed")
    break
  }
}

const printOutGroups = (groups) => {
  document.getElementById("generated-groups").innerText = ""
  var meets

  if (localStorage.getItem("gma-group-meets") != null && JSON.parse(localStorage.getItem("gma-group-meets")).length >= groups.length ) {
    meets = JSON.parse(localStorage.getItem("gma-group-meets"))
    printOutGroupsPart2(groups,meets)
  } else {
    let numberOfMeetsToGen = 0
    if (localStorage.getItem("gma-group-meets") == null) {
      numberOfMeetsToGen = groups.length
    } else {
      numberOfMeetsToGen = groups.length - JSON.parse(localStorage.getItem("gma-group-meets")).length
    }
    generateMeets(numberOfMeetsToGen, function (meetsArr, successful) {
      if (successful) {
        if (localStorage.getItem("gma-group-meets") == null) {
          meets = meetsArr
        } else {
          meets = JSON.parse(localStorage.getItem("gma-group-meets")).concat(meetsArr)
        }
        
        localStorage.setItem("gma-group-meets", JSON.stringify(meets))
        printOutGroupsPart2(groups,meets)
      }
    })
  }
}

const printOutGroupsPart2 = (groups, meets) => {
  let table = document.getElementById("generated-groups")

  for (let i = 0; i < groups.length; i += 3) {
    let tableRow = addElement("tr",table,null,null)
    for (let j = i; j < Math.min(i + 3,groups.length); j++) {
      let tableHeader = addElement("th",tableRow,null,null)
      let meetLink = addElement("a",tableHeader,null,j+1)
      meetLink.href = meets[j]
      meetLink.target = "_blank"
      meetLink.rel = "noopener noreferrer"
    }
    for (let k = 0; k < groups[i].length; k++) {
      let tableRowGroupNames = addElement("tr",table,null,null)
      for (let l = i; l < Math.min(i + 3,groups.length); l++) {
        let tableData = addElement("td", tableRowGroupNames, null, (groups[l] ?? [])[k] ?? "")
        tableData.dataset.groupnum = l
        if (tableData.innerText != "") {
          tableData.draggable = true
        }
        createTableDataExtras(tableData)
      }
    }
    addElement("tr",table,null,null)
  }
}

const createTableDataExtras = (tableData) => {
  tableData.ondragstart = (ev => {
    ev.dataTransfer.setData("text", ev.target.innerText)
  })
  tableData.style.cursor = "grab"
  tableData.ondragover = (ev => ev.preventDefault())
  tableData.ondrop = (ev => {
    ev.preventDefault()
    let groups = localStorage.getItem("gma-groups")
    let toSwap = ev.target.innerText
    let newName = ev.dataTransfer.getData("text")
    for (const elem of document.querySelectorAll("td")) {
      if (elem.innerText == newName) {
        elem.innerText = toSwap
        if (toSwap == "") {
          elem.draggable = false
          let parsedGroup = JSON.parse(groups)
          parsedGroup[elem.dataset.groupnum] = parsedGroup[elem.dataset.groupnum].filter(e => e != newName)
          parsedGroup[ev.target.dataset.groupnum].push(newName)
          localStorage.setItem("gma-groups", JSON.stringify(parsedGroup))
        } else {
          elem.draggable = true
          // This one should maybe be reworked to look more like then one above
          localStorage.setItem("gma-groups", localStorage.getItem("gma-groups").replace(toSwap, "🎗 PENDING SWAP 🎗").replace(newName,toSwap).replace("🎗 PENDING SWAP 🎗", newName))
        }
        // var oldElement = elem
        break
      }
    }
    ev.target.innerText = newName
    ev.target.draggable = true
  })
}

const copyGroups = (groups) => {
  var stringToCopy = ""
  for (let i = 0; i < groups.length; i++) {
    stringToCopy += (i+1) + ": " + groups[i].join(" ") + "\n"
  }
  navigator.clipboard.writeText(stringToCopy)
}

const copyMeets = (meets, groupLength) => {
  var stringToCopy = ""
  for (let i = 0; i < groupLength; i++) {
    stringToCopy += (i+1) + ": " + meets[i] + "\n"
  }
  navigator.clipboard.writeText(stringToCopy)
}

const getAllAttendees = () => {
  /*  This is the function that should be reworked
  currently it forces grid view and then take
  all the names which is really inefficent and
  stupid but I don't know how to do it in a 
  better way. :(                                  */

  //  Removes duplicate students in an Array
  function removeDups(names) {
    let unique = {}
    names.forEach(function(i) {
      if(!unique[i]) {
        unique[i] = true
      }
    })
    return Object.keys(unique)
  }
  
  // START This section turns on grid view for 3 seconds and grabs all the names. Then it turns itself off.
  let waitTime = 0
  let toChange = [false, false]
  let checkboxes
  var buttons
  if (!newmeet) {
    let screencast = document.querySelectorAll("[data-fps-request-screencast-cap]")                                        
    if (!(screencast.length == 0)){
      buttons = screencast[screencast.length-1].parentElement.parentElement.parentElement
    } else {
      screencast = document.getElementsByClassName("NzPR9b")
      buttons = screencast[0]
      useOldClassSelector = false
    }
    let buttonChildren = buttons.children
    if (localStorage.getItem("gma-original-grid-view") !== "true") {
      for (let i = 0; i < buttonChildren.length; i++) {
        if (buttonChildren[i].classList.contains("__gmgv-button")) {
          var theButton = buttonChildren[i]
          break
        } else if (i == buttonChildren.length - 1) {
          alert("Grid View NOT detected, make sure you have Google Meet Grid View installed if you want to use that function. It will now use the built-in grid view from now on (change this anytime in settings)")
          localStorage.setItem("gma-original-grid-view", true)
          document.querySelector("#settingsMenu > label:nth-child(7) > input[type=checkbox]").checked = true
        }
      }

      checkboxes = theButton.lastElementChild.children
      let showOnlyVideo = checkboxes[0].firstChild.checked
  
      let gridtoggle = false
      if (theButton.firstElementChild.innerHTML.substring(30, 31) == "1") {
        gridtoggle = true
      }

      if (!gridtoggle) {
        theButton.click()
        toChange[0] = true
        waitTime += 3000
      }
      if (showOnlyVideo) {
        checkboxes[0].firstChild.click()
        toChange[1] = true
        waitTime += 1000
      }
    }
  }
  // END
  
  
  setTimeout(() => {
    let nameSelector = "epqixc"
    let divList
    let people = []

    if (newmeet) {
      divList = document.querySelector("div[style='inset: 72px 16px 80px;']")
      if (divList == null) {
        divList = document.querySelector("#ow3 > div.T4LgNb > div > div:nth-child(9) > div.crqnQb > div.OKJMXc.xYDeBf > div.zWfAib.c32Trc.eFmLfc.nrxduf.a1pVef")
      }
      if (divList == null) {
        divList = document.querySelector("div[style='inset: 16px 16px 80px;']")
      }
      divList = divList.children
    } else {
      divList = document.getElementsByClassName(nameSelector)
    }

    for (let item of divList) {
      var ppl = item.innerText
      if (!ppl.endsWith("close_fullscreen") && !youArray.includes(ppl) && ppl != "") {
        people.push(ppl)
      }
    }
    
    if (people.length == 1 && people[0] == buttons.lastChild.firstChild.children[2].innerText) {
      people = []
    }
    if (localStorage.getItem("gma-include-yourself") === "true") {
      if (yourName == null) {
        document.querySelectorAll("#yDmH0d > script").forEach( (elements) => { //Locked id may break later
          let text = elements.innerText
          if (text.includes('ds:8')) {
            people.push(text.split(",")[9].slice(1,-1))
          }
        })
      } else {
        people.push(yourName)
      }
    }
    
    people = people.map((name) => {
      if (/[0-9a-zA-Z ]{1,} \([0-9a-zA-Z ]{1,}\)$/.test(name)) {
        return name.substring(name.indexOf("(") + 1, name.length - 1)
      } else {
        return name
      }
    })
    
    let attendees = removeDups(people)
    if (localStorage.getItem("gma-sort-by-last-name") === "true") {
      attendees = attendees.sort((a, b) => {
        if (a.split(" ").concat("")[1] > b.split(" ").concat("")[1]) {
          return 1
        } else if (a.split(" ").concat("")[1] < b.split(" ").concat("")[1]){
          return -1
        } else if (a.split(" ")[0] > b.split(" ")[0]) {
          return 1
        } else if (a.split(" ")[0] < b.split(" ")[0]) {
          return -1
        } else {
          return 0
        }
      })
      // attendees = attendees.sort((a, b) => a.split(" ").pop()[0] < b.split(" ").pop()[0] ? -1 : 1)
    } else {
      attendees = attendees.sort()
    }

    localStorage.setItem("gmca-attendees-list", JSON.stringify(attendees))
    peopleList.value = attendees.join(String.fromCharCode(13, 10))
    peopleCounter.innerText = attendees.length + " " + T("persons")
    if (localStorage.getItem("gma-original-grid-view") !== "true") {
      setTimeout(() => {
        if (toChange[0]) {
          theButton.click()
        }
        if (toChange[1]) {
          checkboxes[0].firstChild.click()
        }
      }, 1000)
    }
  }, waitTime)
}
