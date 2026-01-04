// ==UserScript==
// @name         TripTag Enhancer
// @version      2.3
// @description  Laat zien welke steden wel/geen trip hebben.
// @author       archdukeDaan
// @match        https://*.grepolis.com/game/*
// @license      MIT
// @namespace    https://dlnvt.nl
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/524244/TripTag%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/524244/TripTag%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // wacht tot document is geladen
    $(document).ready(function () {
        setTimeout(console.log(`Archduke script: ${GM_info.script.name} is geladen`), 5000);
    
        // maak de knop om naar het menu te gaan
        maakMenuKnop()

        // laadt de trip detector module aan de hand van de voorkeuren
        if (laadSettings().trip_module == true){
            // maak een wrapper function over de createTownDiv function
            // voordat een stad wordt gemaakt op de kaart, run eerst mijn functie en dan pas de grepo functie
            if (laadSettings().auto_trip_kaart == true){
                var wrapper = function(originalFunc) {
                    return function() {
                        var wrapper = originalFunc.apply(this, arguments);
                        return generateTripjesOpKaart(wrapper, arguments);
                    };
                };
                MapTiles.createTownDiv = wrapper(MapTiles.createTownDiv);
            }

            // timer om te checken of de knop moet worden geplaatst
            // er kan maar maximaal 1 profiel tegelijk open staan
            setTimeout(function checkProfielWindowOpen() {
                if (document.getElementById("player_towns") != null) {
                    if (document.getElementById("tripknopProfiel") == null){
                        addTripKnop('profiel')
                    }
                }
                setTimeout(checkProfielWindowOpen, 500);
            }, 500);

            // timer om te checken of de knop moet worden geplaatst
            // er kunnen meerdere eilanden vensters tegelijk open staan
            setTimeout(function checkEilandWindowOpen() {
                if (document.getElementsByClassName("island_info_wrapper") != null) {
                    // verkrijg alle openstaande eiland vensters
                    var vensters = getAllOpenEilandVensters()
                    for(let i=0;i<vensters.length;i++){
                        var venster = vensters[i]
                        // check of dit eiland venster al een knop heeft
                        if (venster.querySelector("#tripknopEiland") == null){
                            addTripKnop('eiland',venster)
                        }
                    }
                }
                setTimeout(checkEilandWindowOpen, 500);
            }, 500);
        }
        
    });

    function resetSettings(){
        GM_setValue("archduke_menu_auto_trip_kaart", true)
        GM_setValue("archduke_menu_auto_trip_eiland", true)
        GM_setValue("archduke_menu_auto_trip_profiel", false)
        GM_setValue("archduke_menu_trip_allianties", [])
        GM_setValue("archduke_menu_trip_spelers", [])
        GM_setValue("archduke_menu_trip_eigen_stad", false)
        GM_setValue("archduke_menu_trip_pos_x", 70)
        GM_setValue("archduke_menu_trip_pos_y", 60)
        GM_setValue("archduke_menu_trip_module", true)
    }

    // verkrijg de voorkeuren
    function laadSettings(){
        var auto_trip_kaart = GM_getValue('archduke_menu_auto_trip_kaart')
        if (auto_trip_kaart == null){
            auto_trip_kaart = true
        }
        var auto_trip_eiland = GM_getValue('archduke_menu_auto_trip_eiland')
        if (auto_trip_eiland == null){
            auto_trip_eiland = true
        }
        var auto_trip_profiel = GM_getValue('archduke_menu_auto_trip_profiel')
        if (auto_trip_profiel == null){
            auto_trip_profiel = false
        }
        var trip_allianties = GM_getValue('archduke_menu_trip_allianties')
        if (trip_allianties == null){
            trip_allianties = []
        }
        var trip_eigen_stad = GM_getValue('archduke_menu_trip_eigen_stad')
        if (trip_eigen_stad == null){
            trip_eigen_stad = false
        }
        var trip_module = GM_getValue('archduke_menu_trip_module')
        if (trip_module == null){
            trip_module = true
        }
        var trip_spelers = GM_getValue('archduke_menu_trip_spelers')
        if (trip_spelers == null){
            trip_spelers = []
        }
        var trip_pos_x = GM_getValue("archduke_menu_trip_pos_x")
        if (trip_pos_x == null) {
            trip_pos_x = 70
        }
        var trip_pos_y = GM_getValue("archduke_menu_trip_pos_y")
        if (trip_pos_y == null) {
            trip_pos_y = 60
        }
        var settings = {
            "trip_module": trip_module,
            'auto_trip_kaart': auto_trip_kaart,
            'auto_trip_eiland': auto_trip_eiland,
            'auto_trip_profiel': auto_trip_profiel,
            "trip_allianties" : trip_allianties,
            "trip_eigen_stad" : trip_eigen_stad,
            "trip_spelers": trip_spelers,
            "trip_pos_x": trip_pos_x,
            "trip_pos_y": trip_pos_y,
        }
        return settings
        
    }

    function addTripKnop(knop_type,venster) {
        var button = document.createElement('span');
        button.textContent = 'Tripjes';
        button.style.zIndex = 1000;
        button.style.width = '50px'
        button.style.padding = '4px';
        button.style.marginTop = '4px'
        button.style.marginBottom = '4px'
        button.style.color = 'white';
        button.style.border = '1px solid black';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.marginLeft = '15px';

        var settings = laadSettings()

        if (knop_type == 'profiel'){
            button.addEventListener('click', function(){
                generateTripjesOpProfiel();
            }, false);
            button.setAttribute('id', 'tripknopProfiel');

            // voeg de knop als tweede element toe aan de game_header van de stedenlijst op het profiel
            var profiel = document.getElementById("player_towns")
            var element = profiel.children[0].querySelector('.game_header');
            element.insertBefore(button,element.children[0]);

            var bool = settings.auto_trip_profiel
            if (bool == true){
                button.click()
            }

        } else if (knop_type == 'eiland'){
            button.addEventListener('click', function(){
                generateTripjesOpEiland(venster);
            }, false);
            button.setAttribute('id', `tripknopEiland`);
            button.style.backgroundColor = 'blue';

            var eiland_controls = venster.querySelector("#island_towns_controls")
            eiland_controls.appendChild(button)
            var bool = settings.auto_trip_eiland
            if (bool == true){
                button.click()
            }
        }
        console.log("Trip knop toegevoegd!")
    }

    function getHuidigeSpeler(){
        var playerObj = MM.getModels().Player
        var player = Object.values(playerObj)[0].attributes;
        var huidigeSpeler = player.name
        return huidigeSpeler
    }

    function getTripLijst(){
        // verkrijg alle tripjes en stop ze in een lijst
        const steden_met_troepen_buiten = ITowns.all_supporting_units.fragments

        var triplijst = []

        Object.values(steden_met_troepen_buiten).forEach((stad) => {
            var tripjes = stad.models
            tripjes.forEach((trip) => {
                var trip_info = trip.attributes

                var stad_naam = trip_info.current_town_name
                var stad_speler = trip_info.current_town_player_name
                var stad_id = trip_info.current_town_id
                //var trip_stad_herkomst = trip_info.home_town_name

                var row = {"stad_naam":stad_naam,"stad_speler":stad_speler,"stad_id":stad_id}
                triplijst.push( row )
            });
        });
        //console.log(triplijst)
        return triplijst
    }

    function getProfileName(){
        // verkrijg speler naam van het huidige profiel dat open staat
        var profiel = document.getElementById("player_info").children
        var naam = ""
        for(let i=0;i<profiel.length;i++){
            var el = profiel[i]
            if (el.tagName == "H3"){
                naam = el.innerHTML
                break
            }
        }
        return naam
    }

    function getStedenLijstOpProfiel(){
        // verkrijg stedenlijst dom element van een speler zn profiel
        var profiel_steden = document.getElementById("player_towns").children[0].children
        var steden = false
        for(let i=0;i<profiel_steden.length;i++){
            var el2 = profiel_steden[i]
            if (el2.tagName == "UL"){
                steden = el2.children
                break
            }
        }
        //console.log(steden)
        return steden
    }

    function getStedenLijstOpEiland(venster){
        // verkrijg stedenlijst dom element van een eiland
        var eiland_steden = venster.querySelector("#island_info_towns_left_sorted_by_name").children
        //console.log(steden)
        return eiland_steden
    }

    function getAlliantieFromLink(stad_obj){
        // verkrijg de alliantie van de eigenaar van een stad vanuit de GP link DOM element
        // als speler geen alliantie heeft, return -1
        if (stad_obj.querySelector('.gp_alliance_link') != null){
            var link_as_str = stad_obj.querySelector('.gp_alliance_link').outerHTML;
            var alliantie = link_as_str.split("Layout.allianceProfile.open")[1].split(",")[1].split(")")[0]
            return parseInt(alliantie)
        } else {
            return -1
        }
    }

    function getAllOpenEilandVensters(){
        var vensters = document.getElementsByClassName("island_info_wrapper")
        return vensters
    }

    function generateTripjesOpEiland(venster){
        // indien van toepassing, verwijder de oude tags op het eiland informatie scherm
        venster.querySelector("#island_info_towns_left_sorted_by_name").querySelectorAll('.tripTag').forEach(e => e.remove());

        // verkrijg stedenlijst op het eiland
        var steden = getStedenLijstOpEiland(venster)

        // verkrijg de triplijst
        var triplijst = getTripLijst()

        // loop over de steden en voeg tag 'geen trip' toe als de stadsnaam niet in triplijst staat
        for (let k=0; k < steden.length; k++){
            var stad_obj = steden[k]
            var stad_naam = stad_obj.querySelector(".gp_town_link").innerHTML;
            var stad_eigenaar_dom = stad_obj.querySelector(".gp_player_link")
            var stad_eigenaar = "Spookstad"
            if (stad_eigenaar_dom != null){
                stad_eigenaar = stad_eigenaar_dom.innerHTML;
            }
            var stad_alliantie = getAlliantieFromLink(stad_obj);

            // plaats geen tag als de stad van de huidige speler is
            // plaats geen tag als de alliantie van de eigenaar van de stad niet in de alliantie lijst staat
            var settings = laadSettings()
            var allianties = settings.trip_allianties
            if ( allianties.includes(stad_alliantie) == true ){
                // filter eigen stad weg
                var eigen_stad_bool = settings.trip_eigen_stad
                if (eigen_stad_bool == false){
                    if (stad_eigenaar == getHuidigeSpeler()){
                        continue
                    }
                }
                //filter spelers weg waar geen tag bij hoeft
                if (settings.trip_spelers.includes(stad_eigenaar) == true){
                    continue
                }
                
                var tag = document.createElement('div');
                tag.style.zIndex = 1000;
                tag.style.cursor = 'pointer';
                tag.setAttribute('class','tripTag')
                tag.style.fontWeight = 'bold';
                tag.style.marginLeft = '10px';
                // kijk of er een trip in de stad ligt
                var j = triplijst.findIndex( e => (e.stad_naam == stad_naam) && (e.stad_speler == stad_eigenaar) )
                if (j>-1){
                    tag.textContent = "Wel trip";
                    tag.style.color = 'green'
                } else {
                    tag.textContent = "Geen trip";
                    tag.style.color = 'red'
                }
                // voeg de tag toe aan de DOM
                steden[k].appendChild(tag);
            }
        }
    }

    function generateTripjesOpProfiel(){
        // indien van toepassing, verwijder de oude tags op het profiel
        document.getElementById("player_towns").querySelectorAll('.tripTag').forEach(e => e.remove());

        // verkrijg naam op het profiel
        var naam = getProfileName()

        // verkrijg de triplijst
        var triplijst = getTripLijst()

        // verkrijg stedenlijst op het profiel
        var steden = getStedenLijstOpProfiel()

        // loop over de steden en voeg tag 'geen trip' of 'wel trip' toe
        for (let k=0; k < steden.length; k++){
            var stad = steden[k].children[1]
            var stad_naam = stad.innerHTML

            var tag = document.createElement('span');
            tag.style.zIndex = 1000;
            tag.style.cursor = 'pointer';
            tag.setAttribute('class','tripTag')
            tag.style.fontWeight = 'bold';

            // kijk of er een trip in de stad ligt
            var j = triplijst.findIndex( e => (e.stad_naam == stad_naam) & (e.stad_speler == naam) )
            if (j>-1){
                tag.textContent = "Wel trip";
                tag.style.color = 'green'
            } else {
                tag.textContent = "Geen trip";
                tag.style.color = 'red'
            }
            // voeg de tag toe aan de DOM
            steden[k].appendChild(tag)
        }

    }

    function generateTripjesOpKaart(originalFunc, args){
        var stad = args[0]
        //console.log(stad)
        // check of stad een speler heeft, dus of het geen spookstad is
        if(stad.player_id != null){
            // createTownDiv 2 keer geroepen per stad, eens voor de stad en eens voor de stad vlag
            for (let i=0;i<originalFunc.length;i++){
                // maak tag alleen op de stadsvlag ivm dubbele tags per stad
                var dom_element = originalFunc[i]
                var class_list = dom_element.classList
                //console.log(class_list)
                if (class_list.contains("flag")){
                    // verkrijg de triplijst
                    var triplijst = getTripLijst()

                    var stad_id = stad.id
                    var stad_alliantie = stad.alliance_id
                    var stad_eigenaar = stad.player_name

                    var settings = laadSettings()
                    var allianties = settings.trip_allianties
                    var eigen_stad = settings.trip_eigen_stad
                    if ((allianties.includes(stad_alliantie) == true)){
                        if(eigen_stad == false){
                            if(stad_eigenaar == getHuidigeSpeler()){
                                return originalFunc
                            }
                        }
                        if (settings.trip_spelers.includes(stad_eigenaar) == true){
                            return originalFunc
                        }
                        // tag
                        var tag = document.createElement('div');
                        tag.style.zIndex = 2000;
                        tag.style.cursor = 'pointer';
                        tag.setAttribute('class','tripTag')
                        tag.style.fontWeight = 'bold';
                        tag.style.width = '15px';
                        tag.style.height = '15px';
                        tag.style.borderRadius = '50%'
                        tag.style.position = 'relative';
                        tag.style.top = settings.trip_pos_y+"%";
                        tag.style.left = settings.trip_pos_x+"%";
                        tag.style.border = '2px solid black'

                        // kijk of er een trip in de stad ligt
                        var j = triplijst.findIndex( e => (e.stad_id == stad_id) )
                        if (j>-1){
                            tag.style.backgroundColor = 'green'
                        } else {
                            tag.style.backgroundColor = 'red'
                        }
                        $(originalFunc[i]).append(tag);
                    }
                }
            }
        }
        return originalFunc
    }

    /////////////////////////////////////////////////////////////////////////////
    // menu 
    /////////////////////////////////////////////////////////////////////////////

    function maakMenu(){
        var titel = "Archduke Menu"
        var menu = new ArchdukeMenu(titel)

        menu.addItemMenuSelection("TripTag Enhancer", maakTripInstellingen)
        menu.clickMenu("TripTag Enhancer")
    }

    function maakTripInstellingen(){       
        // maak instellingen
        var instelling = new Instellingen("tripenhancer","Voorkeuren","Bepaal het gedrag van de tripjes detector door de checkboxen aan te vinken.")

        // maak alle knopjes
        instelling.createCheckBox("Activeer de trip detector ( vereist refresh van de pagina )","trip_module")
        instelling.createCheckBox("Weergeef automatisch de trip tags op de kaart ( vereist refresh van de pagina )","auto_trip_kaart")
        instelling.createCheckBox("Weergeef automatisch de trip tags op het eiland scherm","auto_trip_eiland")
        instelling.createCheckBox("Weergeef automatisch de trip tags op het profiel van een speler","auto_trip_profiel")
        instelling.createCheckBox("Weergeef trip tags bij je eigen steden","trip_eigen_stad")
        instelling.createTextBox("Bepaal de x-positie van de TripTag op de kaart ten opzichten van de stadsvlag.")
        instelling.createInputBox(70,"trip_pos_x")
        instelling.createTextBox("Bepaal de y-positie van de TripTag op de kaart ten opzichten van de stadsvlag.")
        instelling.createInputBox(60,"trip_pos_y")
        // opslaan knop
        instelling.createKnop("Opslaan",null)

        instelling.createInnerBox("archduke_menu_trip_allianties","Alleen voor onderstaande allianties zullen trip tag worden getoond.","Alliantie ID","Opslaan","input_ally_id",saveInstellingenAllianties)

        instelling.createInnerBox("archduke_menu_trip_spelers","Onderstaande spelers zullen geen trip tag krijgen.","Grepolis Naam","Opslaan","input_speler_id",saveInstellingenSpelers)

        instelling.createKnop("Reset instellingen", resetSettings)

        // voeg aan menu
        var menu_right = document.getElementById("archduke_menu_right")
        menu_right.appendChild(instelling.instelling)

        // check settings in de local storage
        var settings = laadSettings()
        if (settings.auto_trip_eiland){ document.getElementById("archduke_menu_auto_trip_eiland").classList.add('checked') }
        if (settings.auto_trip_kaart){ document.getElementById("archduke_menu_auto_trip_kaart").classList.add('checked') }
        if (settings.auto_trip_profiel){ document.getElementById("archduke_menu_auto_trip_profiel").classList.add('checked') }
        if (settings.trip_eigen_stad){ document.getElementById("archduke_menu_trip_eigen_stad").classList.add('checked') }
        if (settings.trip_module){ document.getElementById("archduke_menu_trip_module").classList.add('checked') }
        for (let i=0; i < settings.trip_allianties.length;i++){
            var ally_id = settings.trip_allianties[i]
            addRowToInnerBox(ally_id,"archduke_menu_trip_allianties",saveInstellingenAllianties)
        }
        for (let i=0; i < settings.trip_spelers.length;i++){
            var speler_id = settings.trip_spelers[i]
            addRowToInnerBox(speler_id,"archduke_menu_trip_spelers",saveInstellingenSpelers)
        }
        document.getElementById("archduke_menu_trip_pos_x").value = settings.trip_pos_x
        document.getElementById("archduke_menu_trip_pos_y").value = settings.trip_pos_y
    }

    function saveInstellingenAllianties(){
        var entries = document.body.querySelectorAll(".archduke_menu_trip_allianties")
        var allianties = []
        for (let i=0;i<entries.length;i++){
            var ally = entries[i]
            var ally_id = parseInt(ally.id.substring(30))
            allianties.push(ally_id)
        }
        GM_setValue("archduke_menu_trip_allianties",allianties)
    }

    function saveInstellingenSpelers(){
        var entries = document.body.querySelectorAll(".archduke_menu_trip_spelers")
        var spelers = []
        for (let i=0;i<entries.length;i++){
            var speler = entries[i]
            var speler_naam = speler.id.substring(27).trim()
            spelers.push(speler_naam)
        }
        GM_setValue("archduke_menu_trip_spelers",spelers)
    }

    /////////////////////////////////////////////////////////////////////////////
    // menu classes en knop
    /////////////////////////////////////////////////////////////////////////////
    function maakMenuKnop(){
        if (document.getElementById("archduke_menu") == null){
            var knop = document.createElement("div")
            knop.setAttribute("id","archduke_menu")
            knop.addEventListener('click', maakMenu)
            knop.style.position = 'absolute'
            knop.style.top = '3px'
            knop.style.height = '27px'
            knop.style.left = "35%"
            knop.style.width = '70px'
            knop.style.cursor = 'pointer'
            knop.style.zIndex = '2000'

            var icon = document.createElement("div")
            icon.setAttribute("class",'icon')
            icon.style.position = 'relative'
            icon.style.width = '100%'
            icon.style.height = '100%'
            icon.style.backgroundImage = `url(${getImageData()})`
            knop.appendChild(icon)

            document.body.appendChild(knop)
        }
        document.getElementById("archduke_menu").addEventListener('click', maakMenu)
    }

    function getImageData() {
        return "data:image/png;base64,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LyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgeG1wTU06RG9jdW1lbnRJRD0iZ2ltcDpkb2NpZDpnaW1wOjFhZDRlODM2LTBkNzAtNGFiNy05ZjNmLTMyNTMxMGI1NzBiZCIKICAgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3YjIyNThkNi04MGM3LTQ5ZWYtYmE1NS00NzliMWZlOTZjNzIiCiAgIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpiNmQxNjU3ZC0zMWQ2LTQ5NTctODlmMi1mNWQzYTZiZDM3NzMiCiAgIGRjOkZvcm1hdD0iaW1hZ2UvcG5nIgogICBHSU1QOkFQST0iMi4wIgogICBHSU1QOlBsYXRmb3JtPSJMaW51eCIKICAgR0lNUDpUaW1lU3RhbXA9IjE3MzgwNzQ4NzczODQzNTAiCiAgIEdJTVA6VmVyc2lvbj0iMi4xMC4zMCIKICAgdGlmZjpPcmllbnRhdGlvbj0iMSIKICAgeG1wOkNyZWF0b3JUb29sPSJHSU1QIDIuMTAiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJzYXZlZCIKICAgICAgc3RFdnQ6Y2hhbmdlZD0iLyIKICAgICAgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo5YTY4MGRjNS00OWI2LTQwN2MtOGFkMi1hNzI5NmYwYjQ5NjEiCiAgICAgIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkdpbXAgMi4xMCAoTGludXgpIgogICAgICBzdEV2dDp3aGVuPSIyMDI1LTAxLTI4VDE1OjI0OjI5KzAxOjAwIi8+CiAgICAgPHJkZjpsaQogICAgICBzdEV2dDphY3Rpb249InNhdmVkIgogICAgICBzdEV2dDpjaGFuZ2VkPSIvIgogICAgICBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjgxMzhkOTNiLTUyYWYtNDA4ZC1hYzNkLTAzOGM0N2Q2YTZlOCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iR2ltcCAyLjEwIChMaW51eCkiCiAgICAgIHN0RXZ0OndoZW49IjIwMjUtMDEtMjhUMTU6MzQ6MzcrMDE6MDAiLz4KICAgIDwvcmRmOlNlcT4KICAgPC94bXBNTTpIaXN0b3J5PgogIDwvcmRmOkRlc2NyaXB0aW9uPgogPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+/2YlgAAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAAd0SU1FB+kBHA4iJTwYnhAAAA0MSURBVFjDvZnJjx3XdYe/e2uuekO/brLZ7JkUSZESyaaoOYIoyTIcwxEEeJEgWQQJEMQGsslfEGSR7LIKbDiAIQNR4EXiTRQBiawoiiU71mSKFEVzbLKb7Hl881DjvVm85mu2REsWLfEAD4V67776nfvVOfecuiXYMtvvG0VjxJ3qzdHRQT02spsgcAkCF8+xieOYSi1kc6NC3jMoFAMV5HwaTeTKyhydMEWgkVIihKDe6KAB05BkmUZrBYCUEikEWoAAslShtEZrEAKkECitkUIgDYmUAoEgVRlZptBKoTVIKbBMA9e10AgEGo3Ac02GhsbJ51CtZpt6rSUbnYyBXSVKRRfbtulEMa1WSKsVMr+4zsLCmrC9vgkEWdyuLkDXtx128sShZM9A0fz2i48iDYkhJVGS4bkujm2xsVbnp2+eo91uUegrcHl2k6GiotmOiKOEJE0BaDQjlFK4joGUEr0lJoSg33FYbXUQgFIaIUBrjVa6O0jDbt9jIwxBdOGA7o7RGpUplAYhBf3FHLZjEUcJtmOR8x1WapLD+waoV+v4fsA3n59i12CBKE7ohCGOZZAphcoU//7qr1jdrKVn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"
    }

    function addRowToInnerBox(input_txt,name,save_function){
        var li = document.createElement("li")
        li.style.listStyleType = 'square'
        li.setAttribute("class",name)
        li.setAttribute('id',name+"_"+input_txt)

        var a = document.createElement("a")
        a.innerHTML = input_txt
        li.appendChild(a)

        var a = document.createElement("a")
        a.setAttribute("class",'cancel')
        a.addEventListener('click', function(){
            li.remove()
            save_function()
        })
        li.appendChild(a)
        document.getElementById(`${name}_list`).appendChild(li)
    }

    class Instellingen {
        constructor (naam, titel, beschrijving){
            this.naam = naam
            this.instelling = this.createWrapper()
            this.parent = this.createParent()
            this.section = this.createSection(titel)
            this.group = this.createGroup(beschrijving)
            this.inner_box_add_row = this.addRowToInnerBox
        }
    
        createWrapper(){
            if (document.getElementById("archduke_menu_right") != null){
                document.getElementById("archduke_menu_right").innerHTML = ""
            }
            var el = document.createElement("div")
            el.setAttribute('id',"archduke_menu_instellingen")
            return el
        };
    
        createParent(){
            var form = document.createElement("form")
            this.instelling.appendChild(form)
            return form
        };
    
        createSection(titel){
            var section = document.createElement("div")
            section.setAttribute("class",'section')
            section.style.display = 'block'
    
            var section_titel = document.createElement("div")
            section_titel.innerHTML = titel
            section_titel.setAttribute("class",'game_header bold')
            section.appendChild(section_titel)
    
            this.parent.appendChild(section)
    
            return section
        };
    
        createGroup(beschrijving){
            var group = document.createElement("div")
            group.setAttribute("class",'group')
    
            var group_text = document.createElement("p")
            group_text.innerHTML = beschrijving
            group.appendChild(group_text)
    
            this.section.appendChild(group)
    
            return group
        };
    
        createCheckBox(beschrijving,id){
            var checkbox = document.createElement("div")
            checkbox.setAttribute('class',"checkbox_new large archduke_menu_checkbox")
            checkbox.setAttribute('id', `archduke_menu_${id}`)
    
            var btn = document.createElement("div")
            btn.setAttribute("class","cbx_icon")
            checkbox.appendChild(btn)
    
            var text = document.createElement("div")
            text.setAttribute("class","cbx_caption")
            text.innerHTML = beschrijving
            checkbox.appendChild(text)
    
            checkbox.addEventListener('click', function(){
                this.classList.toggle('checked')
            })
    
            this.group.appendChild(checkbox)
            var breakline = document.createElement("br")
            this.group.appendChild(breakline)
    
            return checkbox
        };

        createTextBox(text,id=null){
            var div = document.createElement("p")
            if (id != null){
                div.setAttribute("id",id)
            }
            div.innerHTML = text

            this.group.appendChild(div)
        }

        createInputBox(default_value,id){
            var div = document.createElement("div")
            div.setAttribute("class","windowmgr_max_concurrent_input textbox")

            var left = document.createElement("div")
            left.setAttribute("class","left")
            div.appendChild(left)

            var right = document.createElement("div")
            right.setAttribute("class","right")
            div.appendChild(right)

            var middle = document.createElement("div")
            middle.setAttribute("class","middle")
            div.appendChild(middle)

            var input = document.createElement("input")
            input.type = 'text'
            input.tabIndex = 1
            input.placeholder = default_value
            input.pattern = "^\d+$"
            input.setAttribute('id', `archduke_menu_${id}`)
            input.setAttribute('class',"archduke_menu_checkbox")
            middle.appendChild(input)

            var breakline = document.createElement("br")

            this.group.appendChild(div)
            this.group.appendChild(breakline)
        }
    
        createKnop(text, f){
            var el = document.createElement("div")
            el.setAttribute("class",'button_new')
            el.style.marginTop = "10px"
    
            var el2 = document.createElement("div")
            el2.setAttribute("class",'left')
    
            var el3 = document.createElement("div")
            el3.setAttribute("class",'right')
    
            var btn = document.createElement("div")
            btn.setAttribute("class",'caption js-caption')
    
            var btn_txt = document.createElement("span")
            btn_txt.innerHTML = text
    
            var btn_ef = document.createElement("div")
            btn_ef.setAttribute('class',"effect js-effect")
    
            el.appendChild(el2)
            el.appendChild(el3)
            btn.appendChild(btn_txt)
            btn.appendChild(btn_ef)
            el.appendChild(btn)
            
            if (f == null){
                btn.addEventListener('click', this.save_instellingen)
            } else {
                btn.addEventListener('click', f )
            }
            
    
            this.group.appendChild(el)
            return el
        };
    
        save_instellingen(){
            var instel = document.body.querySelectorAll(".archduke_menu_checkbox")
            for (let i=0;i<instel.length;i++){
                var box = instel[i]
                var id = box.id
                var tag = box.tagName

                if (tag == "INPUT"){
                    var checked = box.value
                } else {
                    var checked = false
                    if (box.classList.contains('checked')){
                        checked = true
                    }
                }
                
                GM_setValue(id,checked)
                console.log(id,GM_getValue(id))
            }
        };
    
        createInnerBox(name,box_title,label_text,button_text,input_id,save_function){
            var el = document.createElement("div")
            el.setAttribute("class",'game_inner_box')
            el.style.marginTop = '20px'
    
            var child = document.createElement('div')
            child.setAttribute('class',"game_border")
            el.appendChild(child)
    
            var e = document.createElement('div')
            e.setAttribute('class',"game_border_top")
            child.appendChild(e)
    
            var e = document.createElement('div')
            e.setAttribute('class',"game_border_bottom")
            child.appendChild(e)
    
            var e = document.createElement('div')
            e.setAttribute('class',"game_border_left")
            child.appendChild(e)
    
            var e = document.createElement('div')
            e.setAttribute('class',"game_border_right")
            child.appendChild(e)
    
            var e = document.createElement('div')
            e.setAttribute('class',"game_border_corner corner1")
            child.appendChild(e)
    
            var e = document.createElement('div')
            e.setAttribute('class',"game_border_corner corner2")
            child.appendChild(e)
    
            var e = document.createElement('div')
            e.setAttribute('class',"game_border_corner corner3")
            child.appendChild(e)
    
            var e = document.createElement('div')
            e.setAttribute('class',"game_border_corner corner4")
            child.appendChild(e)
    
            var title = document.createElement('div')
            title.setAttribute('class',"game_header bold")
            title.style.margin = '5px 0 5px 0'
            title.innerHTML = box_title
            child.appendChild(title)
    
            var list = document.createElement("div")
            var list_ul = document.createElement("ul")
            list_ul.setAttribute("class",'game_list')
            list_ul.setAttribute("id",`${name}_list`)
            list_ul.style.listStyle = 'disc'
            list_ul.style.width = '490px'
            list_ul.style.margin = '5px 0px 15px 35px'
            list.appendChild(list_ul)
            child.appendChild(list)
    
            var list_text = document.createElement('div')
            list_text.style.float = 'left'
            child.appendChild(list_text)
    
            var label = document.createElement("label")
            label.setAttribute("class","bold")
            label.style.marginLeft = '5px'
            label.innerHTML = label_text+" : "
            list_text.appendChild(label)
    
            var span = document.createElement("span")
            span.setAttribute("class","grepo_input")
            list_text.appendChild(span)
    
            var span_left = document.createElement("span")
            span_left.setAttribute("class","left")
            span.appendChild(span_left)
    
            var span_right = document.createElement("span")
            span_right.setAttribute("class","right")
            span_left.appendChild(span_right)
    
            var input = document.createElement("input")
            input.setAttribute("class", 'ac_input')
            input.setAttribute("id",input_id)
            input.type = 'text'
            input.value = ''
            input.autocomplete = 'off'
            span_right.appendChild(input)
    
            var btn = this.createKnop(button_text)
            child.appendChild(btn)
            btn.addEventListener('click', function(){
                var input_txt = document.getElementById(input_id).value
                if (input_txt != ""){
                    input_txt = input_txt.trim()
                    document.getElementById(input_id).value = ''
                    var li = document.createElement("li")
                    li.style.listStyleType = 'square'
                    li.setAttribute("class",name)
                    li.setAttribute('id',name+"_"+input_txt)
            
                    var a = document.createElement("a")
                    a.innerHTML = input_txt
                    li.appendChild(a)
            
                    var a = document.createElement("a")
                    a.setAttribute("class",'cancel')
                    a.addEventListener('click', function(){
                        li.remove()
                        save_function()
                    })
                    li.appendChild(a)
                    list_ul.appendChild(li)
                    save_function()
                }
            })
    
            this.group.appendChild(el)
        };
    
    }
    
    class ArchdukeMenu {
    
        constructor(titel){
            this.titel = titel
            this.window = this.createWindow()
            this.frame = this.window.parentElement.parentElement.children[1].children[4]
            this.menu_selection = this.createMenuSelectorContainer()
            this.instelling = this.createMenuContentContainer()
        }
    
        checkMenuOpen(){
            var find = false
            var dom_element = null
            for(let i of document.getElementsByClassName('ui-dialog-title')){
                if(i.innerHTML == this.titel){
                    find = true;
                    dom_element = i
                }
            }
            return [find,dom_element]
        }
    
        createWindow(){
            var [find,dom_element] = this.checkMenuOpen()
            if (find == false){
                var window = Layout.wnd.Create(Layout.wnd.TYPE_DIALOG, this.titel);
                // zet window size
                window.setHeight(document.body.scrollHeight/2);
                window.setWidth('800');
                window.setContent(''); // clear window
                for(let i of document.getElementsByClassName('ui-dialog-title')){ 
                    if(i.innerHTML == this.titel){
                        dom_element = i;
                    }
                }
            }
            console.log(find)
            return dom_element
        }
    
        createMenuSelectorContainer(){
            var container_left = document.getElementById("archduke_menu_left")
            var list = document.getElementById("archduke_menu_module_list")
            if ( container_left == null){
    
                var container_left = document.createElement("div")
                container_left.setAttribute("id","archduke_menu_left")
                container_left.setAttribute("class",'settings_menu')
    
                var el = document.createElement("b")
                el.innerHTML = 'Scripts'
                container_left.appendChild(el)
    
                list = document.createElement("ul")
                list.setAttribute("id","archduke_menu_module_list")
                container_left.appendChild(list)
    
                this.frame.appendChild(container_left)
            }
            return list
        }
    
        createMenuContentContainer(){
            var container_right = document.getElementById("archduke_menu_right")
            if (container_right == null){
                var container_right = document.createElement("div")
                container_right.setAttribute("id","archduke_menu_right")
                container_right.setAttribute("class",'settings-container')
                this.frame.appendChild(container_right)
            }
            return container_right
        }
    
        addItemMenuSelection(naam,f){
            if (document.getElementById(`archduke_menu_selection_${naam}`) == null){
                var el = document.createElement("li")
                el.style.marginBottom = '10px'
                var a = document.createElement('a')
                a.innerHTML = naam
                a.setAttribute("class",`settings-link`)
                a.setAttribute("id",`archduke_menu_selection_${naam}`)
                a.addEventListener('click', function(){
                    f()
                })
                el.appendChild(a)
                this.menu_selection.appendChild(el)
            }
        }

        clickMenu(naam){
            var btn = document.getElementById(`archduke_menu_selection_${naam}`)
            if (btn != null){
                btn.click()
            }
        }
    }

})();