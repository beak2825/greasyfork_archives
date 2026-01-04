// ==UserScript==
// @name         Archduke Server Module
// @version      3.0.5
// @description  Zorgt voor een ondetecteerbare verbinding tussen Grepolis en de server
// @author       archdukeDaan
// @match        https://*.grepolis.com/game/*
// @match        https://grepolis.dlnvt.nl/
// @match        https://grepolis.dlnvt.nl/index/
// @match        https://local.dlnvt.nl/
// @match        https://local.dlnvt.nl/index/
// @license      MIT
// @namespace    https://dlnvt.nl
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/525098/Archduke%20Server%20Module.user.js
// @updateURL https://update.greasyfork.org/scripts/525098/Archduke%20Server%20Module.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var buffer = []
    // check op website site je nu bent
    var url = window.location.hostname

    // externe bevelen
    var external_commands = []

    // wacht tot document is geladen
    $(document).ready(function () {
        setTimeout(console.log(`Archduke script: ${GM_info.script.name} is geladen`), 5000);

        // al deze code in de IF statement runt alleen op de companion site ( path )
        if (url.includes('dlnvt.nl')) {
            var path = "https://grepolis.dlnvt.nl/api/"

            document.getElementById("script_versie").innerHTML = GM_info.script.version

            // check of er al data is om te versturen naar de server
            setTimeout(function check() {
                var path_bevel = path+'bevel'
                var path_spreuk = path+'spreuk'
                var path_trip = path+"trip"
                var path_inc_lf = path+"inc_lf"
                var path_wwlevel = path+"wwlevel"
                var path_realtime = path+"realtime"

                // bevelen
                var data_bevel = GM_getValue('bevel')
                if (data_bevel == null){
                    data_bevel = []
                }
                GM_setValue("bevel",[])
                if (data_bevel.length>0){
                    for (let i=0;i<data_bevel.length;i++){
                        var data = data_bevel[i]
                        sendToServer(path_bevel,data)
                        addToConsole(`${data['type']} bevel gedetecteerd op ${data['stad_naam']}`,'grepo')
                    }
                }
                // spreuken
                var data_spreuk = GM_getValue('spreuk')
                if (data_spreuk == null){
                    data_spreuk = []
                }
                GM_setValue("spreuk",[])
                if (data_spreuk.length>0){
                    for (let i=0;i<data_spreuk.length;i++){
                        var data = data_spreuk[i]
                        sendToServer(path_spreuk,data)
                        addToConsole(`${data['spreuk']} gedetecteerd op ${data['stad_naam']} door speler ${data['spreuk_zetter']}`,'grepo')
                    }
                }
                // trip down
                var data_trip = GM_getValue('trip')
                if (data_trip == null){
                    data_trip = []
                }
                GM_setValue("trip",[])
                if (data_trip.length>0){
                    for (let i=0;i<data_trip.length;i++){
                        var data = data_trip[i]
                        sendToServer(path_trip,data)
                        addToConsole(`Trip down gedetecteerd op ${data['stad']} door speler ${data['aanvaller']}`,'grepo')
                    }
                }

                // inc op livefeeds
                var data_inc_lf = GM_getValue('inc_lf')
                if (data_inc_lf == null){
                    data_inc_lf = []
                }
                GM_setValue("inc_lf",[])
                if (data_inc_lf.length>0){
                    for (let i=0;i<data_inc_lf.length;i++){
                        var data = data_inc_lf[i]
                        sendToServer(path_inc_lf,data)
                        addToConsole(`Inc gedetecteerd op de livefeed voor stad ${data.stad_id}`,'grepo')
                    }
                }

                // test data
                var data_test = GM_getValue('test')
                if (data_test == null){
                    data_test = []
                }
                GM_setValue("test",[])
                if (data_test.length>0){
                    for (let i=0;i<data_test.length;i++){
                        var data = data_test[i]
                        addToConsole(`TEST data [${data['type']}]: ${data['data']}`,'grepo')
                    }
                }

                // wwlevel data
                var data_wwlevel = GM_getValue('wwlevel')
                if (data_wwlevel == null){
                    data_wwlevel = false
                }
                GM_setValue("wwlevel",false)
                if (data_wwlevel != false){
                    sendToServer(path_wwlevel,data_wwlevel)
                }

                // realtime data
                var data_realtime = GM_getValue('realtime')
                if (data_realtime == null){
                    data_realtime = []
                }
                GM_setValue("realtime",[])
                console.log(data_realtime)
                sendToServer(path_realtime,data_realtime, false)

                setTimeout(check, 6000);
            }, 6000);

            setTimeout( function captcha(){
                // captcha
                var botcheck = GM_getValue('botcheck')
                if (botcheck == true){
                    addToConsole("CAPTCHA GEVONDEN!", 'grepo')
                    socket.emit("botcheck", true)
                } else {
                    socket.emit("botcheck", false)
                }
                setTimeout(captcha, 6000)
            }, 60000)

            // check link met de grepo site
            // 1 = grepo
            // 2 = companion
            var missed_pings = 0
            setTimeout( function checkLink(){
                var link = getLinkStatus()
                //console.log(link)
                if (link == 1){
                    var el = document.getElementById("grepo_link")

                    if (el.innerHTML != 'Actief'){
                        socket.emit("grepo_link_status", true)
                    }
                    el.innerHTML = 'Actief'
                    el.style.color = 'green'


                    missed_pings = 0
                    setLinkStatus(2)
                } else {
                    missed_pings = missed_pings + 1

                    if (missed_pings > 5){
                        var el = document.getElementById("grepo_link")
                        if (el.innerHTML != 'Niet actief'){
                            socket.emit("grepo_link_status", false)
                        }
                        el.innerHTML = 'Niet actief'
                        el.style.color = 'red'
                    }
                }

                setTimeout(checkLink, 1000);
            },1000)

            // socket ontvangers

            socket.on("connect", function(){
                // verbonden met de websocket
                addToConsole("Verbonden met de websocket!",'server')
                document.getElementById("server_link").innerHTML = "Actief"
                document.getElementById("server_link").style.color = 'green'
            })
            socket.on("disconnect", function(){
                addToConsole("Verbinding met de websocket is verbroken!",'server')
                document.getElementById("server_link").innerHTML = "Niet actief"
                document.getElementById("server_link").style.color = 'red'
                document.getElementById("auth").innerHTML = "Verlopen"
                document.getElementById("auth").style.color = 'red'
                document.getElementById("websocket_connected").innerHTML = ""
            })
            
            socket.on("connection_response", function(d){
                document.getElementById("websocket_connected").innerHTML = d.sid
                document.getElementById("auth").innerHTML = "Ja"
                document.getElementById("auth").style.color = 'green'
                addToConsole(`Authenticatie succesvol voor gebruiker: ${d.naam} !`,'server')
            })

            socket.on("user_connected", function(d){
                var container = document.getElementById("user_list")
                container.innerHTML = ""
                d.forEach( (user) => {
                    console.log(user)
                    var div = document.createElement("div")
                    div.setAttribute("class", 'p_info')
                    var conn_c = 'red'
                    var conn = 'Niet verbonden'
                    var link = 'Niet ingelogd'
                    var link_c = 'red'
                    if (user.con != false){
                        conn_c = 'green'
                        conn = 'Verbonden'
                    } 
                    if (user.link != false){
                        link_c = 'green'
                        link = 'Ingelogd'
                    }
                    if (user.botcheck == true){
                        link = 'Captcha botcheck!'
                        link_c = 'purple'
                    }
                    var div2 = document.createElement("div")
                    div2.style.width = "30%"
                    div2.innerHTML = user.naam
                    var div3 = document.createElement("div")
                    div3.style.width = "50%"
                    div3.innerHTML = `Verbinding: <span class='right' style='color:${conn_c}'>${conn}</span> <br> Grepo: <span class='right' style='color:${link_c}'>${link}</span> `

                    div.appendChild(div2)
                    div.appendChild(div3)
                    container.appendChild(div)
                })
            })

            socket.on('sync_grepo_data', function(d){
                GM_setValue('sync_grepo_data',true)
                addToConsole("Commando ontvangen om te syncen met GrepoData","server")
            });

            setTimeout( function getrealtime(){
                socket.emit("realtime", true)
                setTimeout(getrealtime, 5000)
            }, 5000)

            socket.on("realtime_response", (data) => {
                GM_setValue("r_data", data)
                //console.log(data)
            });

        } else {

            // maak de knoppen om naar het menu te gaan
            maakMenuKnop()
            setTimeout(function check() {
                if (document.getElementById("overviews_link_hover_menu") == null) {setTimeout(check,500)}
                else { addToBevelOverzicht() }
            }, 500);

            var settings = laadSettings()
            if (settings.algemeen_module){
                // deze code runt op de grepolis site
                setTimeout(function check() {
                    var settings = laadSettings()
                    if (settings.algemeen_read == false){
                        verkrijgGrepolisData()
                    }
                    setTimeout(check, 5000);
                }, 5000);

                setTimeout(function checkLF() {
                    var settings = laadSettings()
                    if (settings.algemeen_read == false){
                        getIncOpLF()
                    }
                    setTimeout(checkLF, 10000);
                }, 10000);

                // check link met de companion site
                // 1 = grepo
                // 2 = companion
                var missed_pings = 0
                setTimeout( function checkLink(){
                    var link = getLinkStatus()
                    //console.log(link)
                    if (link == 2){
                        if (document.getElementById("grepo_link") != null){
                            document.getElementById("grepo_link").style.backgroundColor = 'green'
                        }

                        missed_pings = 0
                        setLinkStatus(1)
                    } else {
                        missed_pings = missed_pings + 1
                        if (missed_pings > 5){
                            if (document.getElementById("grepo_link") != null){
                                document.getElementById("grepo_link").style.backgroundColor = 'red'
                            }
                        }
                    }

                    setTimeout(checkLink, 1000);
                },1000)

                // check voor grepoData sync commando
                setTimeout( function checkSyncCommando(){
                    var settings = laadSettings()
                    if (settings.algemeen_write == false){
                        if (settings.grepodata_module == true){
                            var commando = GM_getValue("sync_grepo_data")
                            //console.log(commando)
                            if (commando == null){
                                GM_setValue("sync_grepo_data",false)
                            } else if (commando == true){
                                syncGrepoData()
                                GM_setValue("sync_grepo_data",false)
                            }
                        }
                    }
                    setTimeout( checkSyncCommando,1000 )
                } )

                // maak de buffer schoon
                setTimeout( function clearBuffer(){
                    var time = laadSettings().algemeen_buffer
                    buffer = []
                    setTimeout(clearBuffer, time*60000);
                },60000)

                // kijk of er aan captcha open staat
                setTimeout( function checkCaptcha(){
                    var botcheck = document.getElementById("recaptcha_window")
                    var botcheck2 = document.querySelector(".botcheck")
                    if (botcheck != null || botcheck2 != null){
                        GM_setValue("botcheck",true)
                    } else {
                        GM_setValue("botcheck",false)
                    }
                    setTimeout(checkCaptcha, 5000);
                },5000)

                // check de ww levels
                setTimeout( function checkwwlevels(){
                    var timeout = (Math.random() + 1 ) * 60000;
                    var settings = laadSettings()
                    if (document.getElementById("ranking-wonder_allianceall") != null){
                        if (settings.wwlevel_auto == true){
                            document.getElementById("ranking-wonder_allianceall").click()
                            setTimeout(function (){
                                if (settings.wwlevel_module == true){
                                    wwlevel(timeout)
                                }
                            }, 3000)
                        } else {
                            if (settings.wwlevel_module == true){
                                wwlevel(timeout)
                            }
                        }
                    }
                    setTimeout(checkwwlevels, timeout);
                },2000)

                // update de realtime commandos
                setTimeout( function updaterealtime(){
                    if (laadSettings().algemeen2_module == true){
                        external_commands = GM_getValue("r_data")
                        if (external_commands == null) { external_commands = [] }
                        //console.log(external_commands)
                    }
                    setTimeout(updaterealtime, 5000);
                },5000)
            }
        }
    })

    /////////////////////////////////////////////////////////////////////////////
    // alle functies hieronder zijn voor de companion site
    /////////////////////////////////////////////////////////////////////////////

    function sendToServer(path,data, verbose=true){
        // veiligheids check, alleen HTTP request als je NIET op de grepolis website zit ivm detectie.
        if (window.location.host.includes("dlnvt.nl") == true){
            data.tijd = new Date().toLocaleString("NL").replace(',','')
            if (verbose){ console.log(data)}
            fetch(path, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(response => response).then(r => { //format naar json en log de reponse van de server
                //console.log(r)
            })
        }
    }

    function addToConsole(data,console_type){
        var dom = document.getElementById(`console_content_${console_type}`)
        var div = document.createElement("div")
        div.setAttribute("class",'.c_text')
        var d = new Date()
        function nice_format(i) {
            if (i < 10) {i = "0" + i}
            return i;
        }
        div.innerHTML = `${nice_format(d.getHours())}:${nice_format(d.getMinutes())}:${nice_format(d.getSeconds())}| ${data}`
        dom.prepend(div)
    }

    /////////////////////////////////////////////////////////////////////////////
    // alle functies hieronder zijn voor beide sites
    /////////////////////////////////////////////////////////////////////////////

    // 1 = grepo
    // 2 = companion
    function getLinkStatus(){
        var link = GM_getValue("grepo_link")
        if (link == null){
            link = 2
            setLinkStatus(2)
        }
        return link
    }

    function setLinkStatus(sender){
        GM_setValue("grepo_link", sender)
    }


    /////////////////////////////////////////////////////////////////////////////
    // alle functies hieronder zijn voor de grepo site
    /////////////////////////////////////////////////////////////////////////////

    function verkrijgGrepolisData(){

        // inkomende aanvallen en OS
        var bevel = getTroepBewegingen()
        var data_bevel = GM_getValue("bevel")
        if (data_bevel == null){
            data_bevel = []
        }
        console.log("bevel data gevonden:"+JSON.stringify(data_bevel.concat(bevel)))
        GM_setValue("bevel",data_bevel.concat(bevel))

        // notificatie data
        var data_notificaties = getNotificaties()

        // spreuk
        var spreuken = data_notificaties[0]
        var data_spreuk = GM_getValue("spreuk")
        if (data_spreuk == null){
            data_spreuk = []
        }
        console.log("spreuk data gevonden:"+JSON.stringify(data_spreuk.concat(spreuken)))
        GM_setValue("spreuk",data_spreuk.concat(spreuken))

        // trip
        var trip = data_notificaties[1]
        var data_trip = GM_getValue("trip")
        if (data_trip == null){
            data_trip = []
        }
        console.log("trip data gevonden:"+JSON.stringify(data_trip.concat(trip)))
        GM_setValue("trip",data_trip.concat(trip))

        // realtime
        var realtime = getAllTroepBewegingen()
        var data_realtime = GM_getValue("realtime")
        if (data_realtime == null){
            data_realtime = []
        }
        //console.log("Realtime data gevonden:"+JSON.stringify(data_realtime.concat(realtime)))
        GM_setValue("realtime",data_realtime.concat(realtime))
    }

    function getTroepBewegingen(){
        var os_threshold_count = laadSettings().os_threshold_count
        var data_bevel = []
        var os_count = {}
        var lf = getLF()

        var bevelen_troepen = MM.getModels().MovementsUnits
        if (bevelen_troepen == null){
            return data_bevel
        }
        Object.keys(bevelen_troepen).forEach((key) => {
            var bevel = bevelen_troepen[key].attributes;
            var id = bevel.command_id
            var settings = laadSettings()
            //console.log(bevel)

            if (bevel.type == 'abort'){
                return
            }

            if (bevel.command_name == "Teruggekeerd"){
                return
            }

            if (lf.includes(bevel.target_town_id) == true){
                return
            }

            if (getEigenTowns().includes(bevel.home_town_id) == true){
                if (settings.algemeen_own_command == false){
                    return
                }
            }
            
            if (bevel.type == 'support'){
                if (settings.os_module){
                    var obj = generateBevelObject(bevel)
                    var stad_id = obj['stad_id']
                    if (stad_id in os_count){
                        os_count[stad_id].push(obj)
                    } else {
                        os_count[stad_id] = [obj]
                    }
                }
            } else if (bevel.type == 'attack') {
                if (settings.inc_module){
                    if (buffer.includes(id) == false){
                        buffer.push(id)
                        var obj = generateBevelObject(bevel)
                        data_bevel.push(obj)
                    }
                }
            }
        })

        Object.keys(os_count).forEach( (stad_id) => {
            var count = os_count[stad_id].length
            if (count > os_threshold_count - 1){
                var data = {
                    "bevel_id":os_count[stad_id][0]['bevel_id'],
                    "stad_id": os_count[stad_id][0]['stad_id'],
                    "stad_naam": os_count[stad_id][0]['stad_naam'],
                    "stuurder": [],
                    "type": "support",
                    "aankomst_human": [],
                    "aankomst": [],
                    "stuurder_stad_id": [],
                    "stuurder_stad_naam": []
                }
                
                os_count[stad_id].forEach( (obj) => {
                    buffer.push(obj['bevel_id'])
                    data['aankomst'].push(obj['aankomst'])
                    data['stuurder'].push(obj['stuurder'])
                    data['aankomst_human'].push(obj['aankomst_human'])  
                    data['stuurder_stad_id'].push(obj['stuurder_stad_id']) 
                    data['stuurder_stad_naam'].push(obj['stuurder_stad_naam']) 
                })
                data_bevel.push(data)
            }
        })

        return data_bevel
    }

    function getNotificaties(){
        var data_spreuken = []
        var data_trip = []
        var settings = laadSettings()

        var notificaties = document.getElementById("notification_area").querySelectorAll(".notification")
        for (let i=0;i<notificaties.length;i++){
            var notificatie = notificaties[i]
            if (notificatie.classList.contains("newreport")){
                var id = notificatie.querySelector(".notification_date").innerHTML
                if (buffer.includes(notificatie) == false){
                    var obj = generateNotificationObject(notificatie)
                    if (obj == false){
                        continue
                    } else{
                        var notifi_type = obj.type
                        if (notifi_type == 'spreuk'){
                            if (settings.spreuk_module){
                                data_spreuken.push(obj)
                                buffer.push(notificatie)
                            }
                        } else if (notifi_type == 'trip'){
                            if (settings.trip_down_module){
                                data_trip.push(obj)
                                buffer.push(notificatie)
                            }
                        }
                    }
                }
            }
        }
        return [data_spreuken,data_trip]
    }

    function getIncOpLF(){
        var data_lf = []
        var feeds = getLiveFeeds()

        var aanvallen = MM.getCollections().Attack[0].models
        aanvallen.forEach( (el) => {
            var aanval = el.attributes
            if (aanval.incoming > 0){
                if (feeds.includes(aanval.town_id) == true){
                    var data = {
                        "stad_id": aanval.town_id,
                        "incoming": aanval.incoming
                    }
                    data_lf.push(data)
                }
            }
        })

        // inc op livefeeds
        var data_inc_lf = GM_getValue("inc_lf")
        if (data_inc_lf == null){
            data_inc_lf = []
        }
        console.log("inc lf data gevonden:"+JSON.stringify(data_inc_lf.concat(data_lf)))
        GM_setValue("inc_lf",data_inc_lf.concat(data_lf))
    }

    function getLiveFeeds(){
        var data_lf = []
        MM.getCollections().Takeover[0].models.forEach((element) => {
            var lf = element.attributes;
            if(!lf.command.is_returning && lf.command.own_command) {
                data_lf.push(lf.destination_town.id);
            }
        });
        return data_lf
    }

    function getLF(){
        var data_lf = []
        MM.getCollections().Takeover[0].models.forEach((element) => {
            var lf = element.attributes;
            if( (lf.command.is_returning==false) && (lf.command.own_command == false)) {
                data_lf.push(lf.destination_town.id);
            }
        });
        return data_lf
    }

    function getHuidigeSpeler(){
        var playerObj = MM.getModels().Player
        var player = Object.values(playerObj)[0].attributes;
        var huidigeSpeler = player
        return huidigeSpeler
    }

    function generateNotificationObject(notificatie){
        var beschrijving = notificatie.querySelector(".notify_subjectlink").innerHTML
        var tijd = notificatie.querySelector(".notification_date").innerHTML.split("|")[1]

        // spreuk
        if ( (beschrijving.includes("heeft")== true) & (beschrijving.includes("tegen je stad") == true)){
            var speler = beschrijving.split("heeft")[0].trim()
            var stad_naam = beschrijving.split("tegen je stad")[1].split("ingezet")[0].trim()
            var spreuk = beschrijving.split("heeft")[1].split("tegen je stad")[0].trim()

            var data = {
                "type":"spreuk",
                "spreuk_tijd":tijd,
                "stad_naam": stad_naam,
                "spreuk_zetter": speler,
                "spreuk":spreuk
            }
            return data
        // trip down
        } else if (beschrijving.includes("valt je ondersteunende troepen in") == true) {
            var aanvaller_stad = beschrijving.split("(")[0].trim()
            var aanvaller = beschrijving.split("(")[1].split(")")[0].trim()
            var stad = beschrijving.split("valt je ondersteunende troepen in")[1].split("(")[0].trim()
            var speler = beschrijving.split("valt je ondersteunende troepen in")[1].split("(")[1].split(")")[0].trim()

            var data = {
                "type":"trip",
                "trip_tijd":tijd,
                "stad": stad,
                "speler": speler,
                "aanvaller":aanvaller,
                "aanvaller_stad":aanvaller_stad,
            }
            return data
        } else {
            return false
        }
    }

    function generateBevelObject(bevel){
        var data = {
            "bevel_id":bevel.command_id,
            "stad_id": bevel.target_town_id,
            "stad_naam": bevel.town_name_destination,
            "stad_link": bevel.link_destination,
            "stuurder": bevel.player_id,
            "type": bevel.type,
            "aankomst_human": bevel.arrived_human,
            "aankomst": bevel.arrival_at,
            "stuurder_stad_id": bevel.home_town_id,
            "stuurder_stad_naam": bevel.town_name_origin,
            "stuurder_stad_link": bevel.link_origin
        }
        return data
    }

    function syncGrepoData(){
        // klik op de sync knoppen
        var syncknop = document.getElementById("gd_cmd_vrvw_share")
        if (syncknop == null){
            return false
        }
        //console.log(syncknop)
        syncknop.click()
        var checkExist = setInterval(function() {
            if (document.getElementById('gd_cmd_do_upload') != null) {
                document.getElementById("gd_cmd_do_upload").click()
                clearInterval(checkExist);
            }
        }, 100);
        return true
    }

    function getEigenTowns(){
        var townObj = MM.getModels().TownIdList
        var townlist = Object.values(townObj)[0].attributes;
        return townlist.town_ids
    }

    // verkrijg de voorkeuren
    function laadSettings(){
        var algemeen_module = GM_getValue('archduke_menu_algemeen_module')
        if (algemeen_module == null){
            algemeen_module = true
        }
        var algemeen2_module = GM_getValue('archduke_menu_algemeen2_module')
        if (algemeen2_module == null){
            algemeen2_module = true
        }
        var algemeen2_kaart = GM_getValue('archduke_menu_algemeen2_kaart')
        if (algemeen2_kaart == null){
            algemeen2_kaart = true
        }
        var algemeen_write = GM_getValue('archduke_menu_algemeen_write')
        if (algemeen_write == null){
            algemeen_write = false
        }
        var algemeen_read = GM_getValue('archduke_menu_algemeen_read')
        if (algemeen_read == null){
            algemeen_read = false
        }
        var os_module = GM_getValue('archduke_menu_os_module')
        if (os_module == null){
            os_module = true
        }
        var inc_module = GM_getValue('archduke_menu_inc_module')
        if (inc_module == null){
            inc_module = true
        }
        var spreuk_module = GM_getValue('archduke_menu_spreuk_module')
        if (spreuk_module == null){
            spreuk_module = true
        }
        var trip_down_module = GM_getValue('archduke_menu_trip_down_module')
        if (trip_down_module == null){
            trip_down_module = true
        }
        var os_threshold_count = GM_getValue('archduke_menu_os_threshold_count')
        if (os_threshold_count == null){
            os_threshold_count = 5
        }
        var algemeen_buffer = GM_getValue('archduke_menu_algemeen_buffer')
        if (algemeen_buffer == null){
            algemeen_buffer = 60
        }
        var lf_module = GM_getValue('archduke_menu_lf_module')
        if (lf_module == null){
            lf_module = true
        }
        var grepodata_module = GM_getValue('archduke_menu_grepodata_module')
        if (grepodata_module == null){
            grepodata_module = false
        }
        var algemeen_own_command = GM_getValue('archduke_menu_algemeen_own_command')
        if (algemeen_own_command == null){
            algemeen_own_command = false
        }
        var wwlevel_module = GM_getValue('archduke_menu_wwlevel_module')
        if (wwlevel_module == null){
            wwlevel_module = false
        }
        var wwlevel_auto = GM_getValue('archduke_menu_wwlevel_auto')
        if (wwlevel_auto == null){
            wwlevel_auto = false
        }
        var settings = {
            "algemeen_module": algemeen_module,
            "algemeen_write": algemeen_write,
            "algemeen_read": algemeen_read,
            "os_module": os_module,
            "inc_module": inc_module,
            "spreuk_module": spreuk_module,
            "trip_down_module": trip_down_module,
            "os_threshold_count":os_threshold_count,
            "algemeen_buffer":algemeen_buffer,
            "lf_module": lf_module,
            "grepodata_module":grepodata_module,
            "algemeen_own_command":algemeen_own_command,
            "wwlevel_module":wwlevel_module,
            "wwlevel_auto":wwlevel_auto,
            "algemeen2_module":algemeen2_module,
            "algemeen2_kaart": algemeen2_kaart,

        }
        return settings
        
    }

    function simuleerData(type, data){
        var test_data = GM_getValue("test")
        if (test_data == null){
            test_data = []
        }
        var test = {"type":type,"data":data}
        GM_setValue("test",test_data.concat(test))
    }

    function wwlevel(timeout){
        var arr = []

        if (document.querySelector(".wonder_ranking") == null) return

        var wwtabel = document.getElementById("ranking_inner").children
        var counter = -1;
        for (let i =0; i< wwtabel.length; i++){
            var row = wwtabel[i]
            if (row.children[1].innerHTML != ""){
                counter += 1
                var name_as_str = row.children[1].children[0].outerHTML;
                var allyID = name_as_str.split("Layout.allianceProfile.open")[1].split(",")[1].split(")")[0]
                arr.push( [allyID] )
            } else {
                if (row.children[3].children[0] != null && row.children[4] != null) {
                    var wonder = row.children[3].children[0].innerHTML;
                    var level = row.children[4].innerHTML;
                    arr[counter].push( {"wonder":wonder, "level":level} )
                }
            }
        }
        var data = {
            "data":arr,
            "timeout": timeout/1000
        }
        console.log(data)
        GM_setValue("wwlevel", data)
    }

    function getAllTroepBewegingen(){
        var data_bevel = []
        var lf = getLF()

        var bevelen_troepen = MM.getModels().MovementsUnits
        if (bevelen_troepen == null){
            return data_bevel
        }

        Object.keys(bevelen_troepen).forEach((key) => {
            var bevel = bevelen_troepen[key].attributes;
            var id = bevel.command_id
            var settings = laadSettings()
            //console.log(bevel)

            if (lf.includes(bevel.target_town_id) == true){
                return
            }

            if (bevel.type == 'abort'){
                return
            }

            if (bevel.command_name == "Teruggekeerd"){
                return
            }
            
            var obj = generateBevelObject(bevel)
            data_bevel.push(obj)
        })

        return data_bevel
    }

    /////////////////////////////////////////////////////////////////////////////
    // menu 
    /////////////////////////////////////////////////////////////////////////////

    function maakMenu(){
        var titel = "Archduke Menu"
        var menu = new ArchdukeMenu(titel)

        menu.addItemMenuSelection("Archduke Server Algemeen", maakAlgemeen)
        menu.clickMenu("Archduke Server Algemeen")
        menu.addItemMenuSelection("Realtime TeamOps", maakAlgemeen2)
        menu.addItemMenuSelection("Aanvallen detector", maakInc)
        menu.addItemMenuSelection("OS detector", maakOS)
        menu.addItemMenuSelection("Spreuk detector", maakSpreuk)
        menu.addItemMenuSelection("TripDown detector", maakTrip)
        menu.addItemMenuSelection("LiveFeed Bekijker", maakLF)
        menu.addItemMenuSelection("GrepoData Syncer", maakGrepoData) 
        menu.addItemMenuSelection("WW level bekijker", maakWW) 
    }

    function maakAlgemeen(){
        // maak instellingen
        var instelling = new Instellingen("algemeen","Voorkeuren","Pas het gedrag aan van het Archduke Server Portaal userscript.")

        // maak alle knopjes
        instelling.createCheckBox(" Activeer de link module ( vereist refresh van de pagina ) ","algemeen_module")
        instelling.createCheckBox(" Read Only Modus: Blokkeer het versturen van data naar de server ","algemeen_read")
        instelling.createCheckBox(" Write Only Modus: Blokkeer het ontvangen van data vanuit de server ","algemeen_write")
        instelling.createCheckBox(" Detecteer eigen troepen bevelen ","algemeen_own_command")
        instelling.createTextBox("Bepaal na hoeveel minuten de buffer/cache geleegd moet worden.")
        instelling.createInputBox(60,"algemeen_buffer")
        // opslaan knop
        instelling.createKnop("Opslaan",null)

        // info 
        instelling.createTextBox("","userscript_versie").innerHTML = "Userscript versie: "+GM_info.script.version
        
        // voeg aan menu
        var menu_right = document.getElementById("archduke_menu_right")
        menu_right.appendChild(instelling.instelling)

        // check settings in de local storage
        var settings = laadSettings()
        if (settings.algemeen_module){ document.getElementById("archduke_menu_algemeen_module").classList.add('checked') }
        if (settings.algemeen_read){ document.getElementById("archduke_menu_algemeen_read").classList.add('checked') }
        if (settings.algemeen_write){ document.getElementById("archduke_menu_algemeen_write").classList.add('checked') }
        if (settings.algemeen_own_command){ document.getElementById("archduke_menu_algemeen_own_command").classList.add('checked') }
        document.getElementById("archduke_menu_algemeen_buffer").value = settings.algemeen_buffer
    }

    function maakAlgemeen2(){
        // maak instellingen
        var instelling = new Instellingen("algemeen2","Voorkeuren","Pas het gedrag aan van het Archduke Server Portaal userscript.")

        // maak alle knopjes
        instelling.createTextBox(" Deze optie zorgt ervoor dat INC/OS van andere spelers zichtbaar worden in jouw Grepolis tabblad.")
        instelling.createCheckBox(" Activeer de Syncer module ","algemeen2_module")
        instelling.createCheckBox(" Weergeef externe bevelen op de kaart ","algemeen2_kaart")
        // opslaan knop
        instelling.createKnop("Opslaan",null)

        
        // voeg aan menu
        var menu_right = document.getElementById("archduke_menu_right")
        menu_right.appendChild(instelling.instelling)

        // check settings in de local storage
        var settings = laadSettings()
        if (settings.algemeen2_module){ document.getElementById("archduke_menu_algemeen2_module").classList.add('checked') }
        if (settings.algemeen2_kaart){ document.getElementById("archduke_menu_algemeen2_kaart").classList.add('checked') }
    }

    function maakOS(){
        // maak instellingen
        var instelling = new Instellingen("os","Voorkeuren","Pas het gedrag aan van de OS detector.")
    
        // maak alle knopjes
        instelling.createCheckBox(" Activeer het versturen van OS data naar de server ","os_module")
        instelling.createTextBox("Minimaal aantal OS dat op dezelfde stad moet komen voordat de data wordt verstuurd")
        instelling.createInputBox(5,"os_threshold_count")
        // opslaan knop
        instelling.createKnop("Opslaan",null)

        instelling.createTextBox("Stuur een test os naar de server.")
        instelling.createKnop("Simuleer OS", function (){
            simuleerData("os","Je krijgt inkomende OS op je stad!")
        } )
        
        // voeg aan menu
        var menu_right = document.getElementById("archduke_menu_right")
        menu_right.appendChild(instelling.instelling)
    
        // check settings in de local storage
        var settings = laadSettings()
        if (settings.os_module){ document.getElementById("archduke_menu_os_module").classList.add('checked') }
        document.getElementById("archduke_menu_os_threshold_count").value = settings.os_threshold_count
    }

    function maakInc(){
        // maak instellingen
        var instelling = new Instellingen("inc","Voorkeuren","Pas het gedrag aan van de Aanvallen detector.")
    
        // maak alle knopjes
        instelling.createCheckBox(" Activeer het versturen van inkomende aanval data naar de server ","inc_module")
        // opslaan knop
        instelling.createKnop("Opslaan",null)

        instelling.createTextBox("Stuur een test aanval naar de server.")
        instelling.createKnop("Simuleer inc", function (){
            simuleerData("inc","Je stad wordt aangevallen!")
        } )
        
        // voeg aan menu
        var menu_right = document.getElementById("archduke_menu_right")
        menu_right.appendChild(instelling.instelling)
    
        // check settings in de local storage
        var settings = laadSettings()
        if (settings.inc_module){ document.getElementById("archduke_menu_inc_module").classList.add('checked') }
    }

    function maakSpreuk(){
        // maak instellingen
        var instelling = new Instellingen("spreuk","Voorkeuren","Pas het gedrag aan van de Spreuk detector.")
    
        // maak alle knopjes
        instelling.createCheckBox(" Activeer het versturen van Spreuk data naar de server ","spreuk_module")
        // opslaan knop
        instelling.createKnop("Opslaan",null)

        instelling.createTextBox("Stuur een test spreuk naar de server.")
        instelling.createKnop("Simuleer narc", function (){
            simuleerData("spreuk","Er is narc gedetecteerd op je stad!")
        } )
        
        // voeg aan menu
        var menu_right = document.getElementById("archduke_menu_right")
        menu_right.appendChild(instelling.instelling)
    
        // check settings in de local storage
        var settings = laadSettings()
        if (settings.spreuk_module){ document.getElementById("archduke_menu_spreuk_module").classList.add('checked') }
    }

    function maakTrip(){
        // maak instellingen
        var instelling = new Instellingen("trip","Voorkeuren","Pas het gedrag aan van de Trip Down detector.")
    
        // maak alle knopjes
        instelling.createCheckBox(" Activeer het versturen van trip down data naar de server ","trip_down_module")
        // opslaan knop
        instelling.createKnop("Opslaan",null)

        instelling.createTextBox("Stuur een test trip down naar de server.")
        instelling.createKnop("Simuleer trip down", function (){
            simuleerData("trip","Je hebt een trip down gemeld bij een speler!")
        } )
        
        // voeg aan menu
        var menu_right = document.getElementById("archduke_menu_right")
        menu_right.appendChild(instelling.instelling)
    
        // check settings in de local storage
        var settings = laadSettings()
        if (settings.trip_down_module){ document.getElementById("archduke_menu_trip_down_module").classList.add('checked') }
    }

    function maakLF(){
        // maak instellingen
        var instelling = new Instellingen("lf","Voorkeuren","Pas het gedrag aan van de LiveFeed bekijker.")
    
        // maak alle knopjes
        instelling.createCheckBox(" Activeer het versturen van inc data op je eigen livefeeds naar de server ","lf_module")
        // opslaan knop
        instelling.createKnop("Opslaan",null)

        instelling.createTextBox("Stuur een test inc op lf naar de server.")
        instelling.createKnop("Simuleer inc", function (){
            simuleerData("lf","Je liggende kolo wordt aangevallen!")
        } )
        
        // voeg aan menu
        var menu_right = document.getElementById("archduke_menu_right")
        menu_right.appendChild(instelling.instelling)
    
        // check settings in de local storage
        var settings = laadSettings()
        if (settings.lf_module){ document.getElementById("archduke_menu_lf_module").classList.add('checked') }
    }

    function maakGrepoData(){
        // maak instellingen
        var instelling = new Instellingen("grepodata","Voorkeuren","Pas het gedrag aan van de GrepoData Syncer.")
    
        // maak alle knopjes
        instelling.createCheckBox(" Activeer het automatisch syncen naar de GrepoData Team Ops ","grepodata_module")
        instelling.createTextBox("LET OP! Dit script upload alleen je beveloverzicht nadat iemand het commando op de discord server heeft geplaatst. Dit script werkt alleen als de GrepoData addon is geinstalleerd!")
        
        // opslaan knop
        instelling.createKnop("Opslaan",null)
        
        // voeg aan menu
        var menu_right = document.getElementById("archduke_menu_right")
        menu_right.appendChild(instelling.instelling)
    
        // check settings in de local storage
        var settings = laadSettings()
        if (settings.grepodata_module){ document.getElementById("archduke_menu_grepodata_module").classList.add('checked') }
    }

    function maakWW(){
        // maak instellingen
        var instelling = new Instellingen("wwlevel","Voorkeuren","Pas het gedrag aan van de WW level bekijker.")
    
        // maak alle knopjes
        instelling.createCheckBox(" Activeer het automatisch bekijken van de WW levels ","wwlevel_module")
        instelling.createCheckBox(" Activeer het automatisch refreshen van de WW ranglijst ","wwlevel_auto")
        instelling.createTextBox("LET OP! Het automatisch refreshen van de ranglijst is DETECTEERBAAR. Zet deze optie alleen aan met toestemming!")

        // opslaan knop
        instelling.createKnop("Opslaan",null)
        
        // voeg aan menu
        var menu_right = document.getElementById("archduke_menu_right")
        menu_right.appendChild(instelling.instelling)
    
        // check settings in de local storage
        var settings = laadSettings()
        if (settings.wwlevel_module){ document.getElementById("archduke_menu_wwlevel_module").classList.add('checked') }
        if (settings.wwlevel_auto){ document.getElementById("archduke_menu_wwlevel_auto").classList.add('checked') }
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

        // link indicator
        var elem = document.getElementById("archduke_menu").children[0]
        var btn = document.createElement("div")
        btn.style.width = "6px"
        btn.style.height = "6px"
        btn.style.borderRadius = "50%"
        btn.style.backgroundColor = 'red'
        btn.style.alignSelf = 'flex-end'
        btn.setAttribute("id","grepo_link")
        elem.appendChild(btn)
        var btn = document.createElement("div")
        btn.style.width = "5px"
        btn.style.height = "5px"
        btn.style.borderRadius = "50%"
        elem.appendChild(btn)
        elem.style.display = 'flex'
        elem.style.flexDirection = 'row'
        elem.style.justifyContent = 'space-evenly'

    }

    function getImageData() {
        return "data:image/png;base64,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LyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgeG1wTU06RG9jdW1lbnRJRD0iZ2ltcDpkb2NpZDpnaW1wOjFhZDRlODM2LTBkNzAtNGFiNy05ZjNmLTMyNTMxMGI1NzBiZCIKICAgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3YjIyNThkNi04MGM3LTQ5ZWYtYmE1NS00NzliMWZlOTZjNzIiCiAgIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpiNmQxNjU3ZC0zMWQ2LTQ5NTctODlmMi1mNWQzYTZiZDM3NzMiCiAgIGRjOkZvcm1hdD0iaW1hZ2UvcG5nIgogICBHSU1QOkFQST0iMi4wIgogICBHSU1QOlBsYXRmb3JtPSJMaW51eCIKICAgR0lNUDpUaW1lU3RhbXA9IjE3MzgwNzQ4NzczODQzNTAiCiAgIEdJTVA6VmVyc2lvbj0iMi4xMC4zMCIKICAgdGlmZjpPcmllbnRhdGlvbj0iMSIKICAgeG1wOkNyZWF0b3JUb29sPSJHSU1QIDIuMTAiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJzYXZlZCIKICAgICAgc3RFdnQ6Y2hhbmdlZD0iLyIKICAgICAgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo5YTY4MGRjNS00OWI2LTQwN2MtOGFkMi1hNzI5NmYwYjQ5NjEiCiAgICAgIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkdpbXAgMi4xMCAoTGludXgpIgogICAgICBzdEV2dDp3aGVuPSIyMDI1LTAxLTI4VDE1OjI0OjI5KzAxOjAwIi8+CiAgICAgPHJkZjpsaQogICAgICBzdEV2dDphY3Rpb249InNhdmVkIgogICAgICBzdEV2dDpjaGFuZ2VkPSIvIgogICAgICBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjgxMzhkOTNiLTUyYWYtNDA4ZC1hYzNkLTAzOGM0N2Q2YTZlOCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iR2ltcCAyLjEwIChMaW51eCkiCiAgICAgIHN0RXZ0OndoZW49IjIwMjUtMDEtMjhUMTU6MzQ6MzcrMDE6MDAiLz4KICAgIDwvcmRmOlNlcT4KICAgPC94bXBNTTpIaXN0b3J5PgogIDwvcmRmOkRlc2NyaXB0aW9uPgogPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+/2YlgAAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAAd0SU1FB+kBHA4iJTwYnhAAAA0MSURBVFjDvZnJjx3XdYe/e2uuekO/brLZ7JkUSZESyaaoOYIoyTIcwxEEeJEgWQQJEMQGsslfEGSR7LIKbDiAIQNR4EXiTRQBiawoiiU71mSKFEVzbLKb7Hl881DjvVm85mu2REsWLfEAD4V67776nfvVOfecuiXYMtvvG0VjxJ3qzdHRQT02spsgcAkCF8+xieOYSi1kc6NC3jMoFAMV5HwaTeTKyhydMEWgkVIihKDe6KAB05BkmUZrBYCUEikEWoAAslShtEZrEAKkECitkUIgDYmUAoEgVRlZptBKoTVIKbBMA9e10AgEGo3Ac02GhsbJ51CtZpt6rSUbnYyBXSVKRRfbtulEMa1WSKsVMr+4zsLCmrC9vgkEWdyuLkDXtx128sShZM9A0fz2i48iDYkhJVGS4bkujm2xsVbnp2+eo91uUegrcHl2k6GiotmOiKOEJE0BaDQjlFK4joGUEr0lJoSg33FYbXUQgFIaIUBrjVa6O0jDbt9jIwxBdOGA7o7RGpUplAYhBf3FHLZjEUcJtmOR8x1WapLD+waoV+v4fsA3n59i12CBKE7ohCGOZZAphcoU//7qr1jdrKVn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"
    }

    function getImage2Data() {
        return "data:image/jpeg;base64,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cy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNC40LjAtRXhpdjIiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpHSU1QPSJodHRwOi8vd3d3LmdpbXAub3JnL3htcC8iIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06RG9jdW1lbnRJRD0iZ2ltcDpkb2NpZDpnaW1wOmU1YTRlZGU2LWQ2NzAtNDliOC04NDE4LTU1NzlmODRmNDIwZCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4NmMxYWNlYS04NWI4LTRlMTMtOGJhYS0wM2ExMjE2ZDRmZDciIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpiNjI1OGIzNy0wNWY3LTQwYTAtOTU0ZS1jY2M3NjliZTgxYzIiIGRjOkZvcm1hdD0iaW1hZ2UvanBlZyIgR0lNUDpBUEk9IjIuMCIgR0lNUDpQbGF0Zm9ybT0iTGludXgiIEdJTVA6VGltZVN0YW1wPSIxNzM4MDczMjQyMTQ2NjI0IiBHSU1QOlZlcnNpb249IjIuMTAuMzAiIHhtcDpDcmVhdG9yVG9vbD0iR0lNUCAyLjEwIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0OmNoYW5nZWQ9Ii8iIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZDA3NjI0NWItYmY2Ni00MTBkLTk1OTEtNDFlNzlmY2YwOGViIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJHaW1wIDIuMTAgKExpbnV4KSIgc3RFdnQ6d2hlbj0iMjAyNS0wMS0yOFQxNTowNzoyMiswMTowMCIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0idyI/Pv/iArBJQ0NfUFJPRklMRQABAQAAAqBsY21zBDAAAG1udHJSR0IgWFlaIAfpAAEAHAAOAAYACGFjc3BBUFBMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD21gABAAAAANMtbGNtcwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADWRlc2MAAAEgAAAAQGNwcnQAAAFgAAAANnd0cHQAAAGYAAAAFGNoYWQAAAGsAAAALHJYWVoAAAHYAAAAFGJYWVoAAAHsAAAAFGdYWVoAAAIAAAAAFHJUUkMAAAIUAAAAIGdUUkMAAAIUAAAAIGJUUkMAAAIUAAAAIGNocm0AAAI0AAAAJGRtbmQAAAJYAAAAJGRtZGQAAAJ8AAAAJG1sdWMAAAAAAAAAAQAAAAxlblVTAAAAJAAAABwARwBJAE0AUAAgAGIAdQBpAGwAdAAtAGkAbgAgAHMAUgBHAEJtbHVjAAAAAAAAAAEAAAAMZW5VUwAAABoAAAAcAFAAdQBiAGwAaQBjACAARABvAG0AYQBpAG4AAFhZWiAAAAAAAAD21gABAAAAANMtc2YzMgAAAAAAAQxCAAAF3v//8yUAAAeTAAD9kP//+6H///2iAAAD3AAAwG5YWVogAAAAAAAAb6AAADj1AAADkFhZWiAAAAAAAAAknwAAD4QAALbEWFlaIAAAAAAAAGKXAAC3hwAAGNlwYXJhAAAAAAADAAAAAmZmAADypwAADVkAABPQAAAKW2Nocm0AAAAAAAMAAAAAo9cAAFR8AABMzQAAmZoAACZnAAAPXG1sdWMAAAAAAAAAAQAAAAxlblVTAAAACAAAABwARwBJAE0AUG1sdWMAAAAAAAAAAQAAAAxlblVTAAAACAAAABwAcwBSAEcAQv/bAEMAAwICAwICAwMDAwQDAwQFCAUFBAQFCgcHBggMCgwMCwoLCw0OEhANDhEOCwsQFhARExQVFRUMDxcYFhQYEhQVFP/bAEMBAwQEBQQFCQUFCRQNCw0UFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFP/CABEIABwAHAMBEQACEQEDEQH/xAAaAAACAgMAAAAAAAAAAAAAAAAGBwAIAQQF/8QAGQEAAgMBAAAAAAAAAAAAAAAAAwQAAQIF/9oADAMBAAIQAxAAAAGzVXXpV44IJuHVXYG0ap1Nu82Mf4ouMqPWdlx2MonGxYk5taJtj//EAB4QAAIDAAEFAAAAAAAAAAAAAAQFAgMGAAEQEiY1/9oACAEBAAEFAjjalwkde5InjtVJrfzdy8UK5zNZHO2+wUvA7+u++DQhPJvWVFDmJc5fEdiuoaDjrBxSKc4AP2//xAAjEQEAAgECBQUAAAAAAAAAAAABAAIDERMEECEx4RIiMpGh/9oACAEDAQE/AQ9ToTbxneZcegNeXCtTJ7zWXOGv3o/fiZrYdpK0/fEapMHzm5U6y6IjL3F6StmrqRsppHJZ15f/xAAfEQACAgEEAwAAAAAAAAAAAAAAAQIREgMQIUExMlH/2gAIAQIBAT8Bbrkzl0Qnbp7at48EZTj2Qyz5ZaZq+pgyNppkY/Rq/JRitv/EACcQAAIBAwMDAwUAAAAAAAAAAAEDAgAEERIhMRMiMxAUUSMyQYPB/9oACAEBAAY/AmXDjhaxk1ONsZ6Yzz4tXJ2GcU1N3I9dh1ryMDjjHofgsjUwtcJiW/fvg/IqzljuLeaaIt8cys5H5Fftj/aelduZMR5BqG1WVwlPUlNn0gT9xFNneEKc1smGEd8ZroXEda85xnFXD1wwx+Ne9WuhRHtpGS+47E+n/8QAIBABAAEEAgIDAAAAAAAAAAAAAREAITFRQWEQkbHB8P/aAAgBAQABPyHEMgy6DtbU7q22eGZSnVtVruEMATwxPvxELoSDnL9Uk+SBssaHuphIFMt5+av4JymyvwdUjRNZb8Zb44onlk4HEmbZKQIZcLVp91L3BiVx2UzpqckYILcZrmAGbkTvB68f/9oADAMBAAIAAwAAABC/RpRKZJT/xAAeEQEAAwEAAgMBAAAAAAAAAAABABExIRBBUWGBof/aAAgBAwEBPxBw0Ys9Wj6gGueArQp4Nf2mOiKvidlg1zdfkU1m9mERCeMSrNhAyFT2IgBYToHd8f/EAB0RAQACAgIDAAAAAAAAAAAAAAEAERAxIeFBgZH/2gAIAQIBAT8QAKgvMMm3FztUDQHzuGps9dwuVgFUDUAAjAuzBNQEVPMDqjWP/8QAHxABAQADAAICAwAAAAAAAAAAAREAITFBUWFxgZHR/9oACAEBAAE/EFPqtslAXlAD2mEbaTBGkAKCGRlIsghOMiwcva/vLgQfEf0D+MtFKqEkUjdbTxK0pZmHdpoE3X7xYYCxpaa2b7nDIZ0BHQ12EoXTzG1Qgmi6MIVncA49IvQFLThdJu3FSzWy2mg+U+nEIGOxoJnTnvN65XQIunyheR83P//Z"
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

    function addToBevelOverzicht(){
        var parent = document.getElementById("overviews_link_hover_menu").children[1].children[0].children[0].children[0]

        var li = document.createElement("li")
        li.setAttribute("class","enabled subsection")
        
        var a = document.createElement("a")
        a.setAttribute("class","adviser")
        a.setAttribute("type","advisor")
        var span = document.createElement("span")
        span.setAttribute("class","advisors22x22")
        span.style.backgroundImage = `url(${getImage2Data()})`
        span.style.width= "100%";
        span.style.height = "100%";
        span.style.backgroundSize = 'fit'
        a.appendChild(span)


        var ul = document.createElement("ul")
        var li2 = document.createElement("li")
        li2.setAttribute("class","command_overview")
        ul.appendChild(li2)
        var a2 = document.createElement("a")
        a2.innerHTML = "Realtime TeamOps"
        a2.removeAttribute("onclick"); 
        a2.onclick = null
        a2.addEventListener("click", (e)=>{
            e.preventDefault()
            var w = new ArchdukeBevelen("Archduke Bevelen")
        })

        li2.appendChild(a2)

        li.appendChild(a)
        li.appendChild(ul)
        parent.appendChild(li)
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
            return div
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
            return div
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
            //console.log(find)
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

    class ArchdukeBevelen {
    
        constructor(titel){
            this.titel = titel
            this.window = this.createWindow()
            this.frame = this.window.parentElement.parentElement.children[1].children[4]
            this.game_list = this.createContent()
            this.updateList()
            this.incfilter = true
            this.osfilter = true

            var updateTimeStamps = setInterval( ()=>{
                var [find,dom] = this.checkMenuOpen()
                if (find == false) {
                    clearInterval(updateTimeStamps);
                } else {
                    this.updateTime()
                }
            }, 500);

            var updateGameList = setInterval(() => {
                setTimeout()
                var [find,dom] = this.checkMenuOpen()
                if (find == false) {
                    clearInterval(updateGameList);
                } else {
                    this.updateList()
                }
            }, 4000);
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
            //console.log(find)
            return dom_element
        }

        createContent(){
            var t = document.createElement("div")
            t.setAttribute("class","game_inner_box")
            this.frame.appendChild(t)

            var header = document.createElement("div")
            header.setAttribute("class","game_list_header")
            header.style.marginBottom = "20px"
            t.appendChild(header)

            var searchSpeler = document.createElement("div")
            searchSpeler.setAttribute("class","textbox initial-message")
            searchSpeler.setAttribute("id", "txt_zoek_speler")
            header.appendChild(searchSpeler)
            var left = document.createElement("div")
            left.setAttribute("class","left")
            searchSpeler.appendChild(left)
            var right = document.createElement("div")
            right.setAttribute("class","right")
            searchSpeler.appendChild(right)
            var middle = document.createElement("div")
            middle.setAttribute("class","middle")
            searchSpeler.appendChild(middle)
            var input = document.createElement("input")
            input.setAttribute("type","text")
            input.setAttribute("id","speler-filter")
            input.setAttribute("placeholder","Zoeken naar spelers")
            input.addEventListener("input", () => {
                this.updateList()
            })
            middle.appendChild(input)

            var searchStad = document.createElement("div")
            searchStad.setAttribute("class","textbox initial-message")
            searchStad.setAttribute("id", "txt_zoek_stad")
            header.appendChild(searchStad)
            var left = document.createElement("div")
            left.setAttribute("class","left")
            searchStad.appendChild(left)
            var right = document.createElement("div")
            right.setAttribute("class","right")
            searchStad.appendChild(right)
            var middle = document.createElement("div")
            middle.setAttribute("class","middle")
            searchStad.appendChild(middle)
            var input = document.createElement("input")
            input.setAttribute("type","text")
            input.setAttribute("id","stad-filter")
            input.setAttribute("placeholder","Zoeken naar steden")
            input.addEventListener("input", () => {
                this.updateList()
            })
            middle.appendChild(input)

            var inc = document.createElement("div")
            inc.setAttribute("class","support_filter attack_land")
            inc.addEventListener("click", () => {
                inc.classList.toggle("inactive")
                if (this.incfilter == true) { this.incfilter = false}
                else { this.incfilter = true }
                this.updateList()
            })
            header.appendChild(inc)
            var os = document.createElement("div")
            os.setAttribute("class","support_filter support")
            os.addEventListener("click", () => {
                os.classList.toggle("inactive")
                if (this.osfilter == true) { this.osfilter = false}
                else { this.osfilter = true }
                this.updateList()
            })
            header.appendChild(os)

            var gameborder = document.createElement("div")
            gameborder.setAttribute("class","game_border")
            t.appendChild(gameborder)
            gameborder.innerHTML = `
            <div class="game_border_top"></div>
            <div class="game_border_bottom"></div>
            <div class="game_border_left"></div>
            <div class="game_border_right"></div>
            <div class="game_border_corner corner1"></div>
            <div class="game_border_corner corner2"></div>
            <div class="game_border_corner corner3"></div>
            <div class="game_border_corner corner4"></div>
            `
            var header = document.createElement("div")
            header.setAttribute("class","game_header bold")
            header.innerHTML = "Realtime TeamOps bevelen"
            gameborder.appendChild(header)

            var div = document.createElement("div")
            div.style.overflowY = 'auto'
            var div2 = document.createElement("div")
            div2.style.overflowY = 'auto'
            div.appendChild(div2)
            gameborder.appendChild(div)

            var ul = document.createElement("ul")
            ul.setAttribute("class","game_list")
            ul.style.overflowY = 'auto'
            ul.style.height = document.body.scrollHeight/2 - document.body.scrollHeight/6 + "px"
            ul.setAttribute("id","external_commands")
            div2.appendChild(ul)            
            
            return ul
        }

        createUnit(command){
            var li = document.createElement("li")
            if (this.game_list.children.length % 2 == 0){
                li.setAttribute("class","even js-command-row place_command")
            } else {
                li.setAttribute("class","odd js-command-row place_command")
            }
            
            li.setAttribute("data-command_type",command.type)
            this.game_list.appendChild(li)

            var info = document.createElement("div")
            info.setAttribute("class","cmd_info_box")
            li.appendChild(info)

            var a = document.createElement("a")
            var div = document.createElement("div")
            div.setAttribute("class", `cmd_img command_type attack_type32x32 ${command.type}`)
            a.appendChild(div)
            info.appendChild(a)

            var bevel_info = document.createElement("span")
            bevel_info.setAttribute("class","cmd_span")
            info.appendChild(bevel_info)

            if (command.stad_link != null){
                bevel_info.innerHTML += command.stad_link + " ("
            } else {
                bevel_info.innerHTML += `<a href="#" class="gp_town_link">${command.stuurder_stad_naam}</a> (`
            }
            bevel_info.innerHTML += `<a href="#" class="gp_player_link">${command.stuurder_naam}</a> )`
            bevel_info.innerHTML += `<span class="overview_outgoing icon"></span>`
            if (command.stuurder_stad_link != null) {
                bevel_info.innerHTML += command.stuurder_stad_link + " ("
            } else {
                bevel_info.innerHTML += `<a href="#" class="gp_town_link">${command.stad_naam}</a> (`
            }
            bevel_info.innerHTML += `<a href="#" class="gp_player_link">${command.speler}</a> )`
            
            var countdown = document.createElement("span")
            countdown.setAttribute("class",`countdown archduke-eta`)
            countdown.setAttribute("id",command.aankomst)
            countdown.innerHTML = this.formatTime(command.aankomst)

            countdown.style.float = 'left'
            var arr = document.createElement("span")
            arr.setAttribute("class","troops_arrive_at")
            arr.innerHTML = `( Aankomst ${command.aankomst_human}:${String(new Date(command.aankomst * 1000).getUTCSeconds()).padStart(2, '0')} )`
            info.appendChild(document.createElement("br"))
            info.appendChild(countdown)
            info.appendChild(arr)

            var last = document.createElement("div")
            last.style.clear = 'both'
            li.appendChild(last)
        }

        updateTime(){
            var elements = this.game_list.children

            for ( let i=0; i<elements.length; i++){
                var element = elements[i]
                if (element.id == "no-eta"){ return }
                var eta_find = element.querySelector(".archduke-eta")
                var eta = eta_find.id
                eta_find.innerHTML = this.formatTime(eta)
            }
        }

        formatTime(eta){
            var now = Math.floor(Date.now() / 1000)
            var diff = eta - now;
            var hours = Math.floor(diff / (60 * 60));
            var minutes = Math.floor((diff % (60 * 60)) / (60));
            var seconds = Math.floor((diff % 60));

            var format = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
            return format
        }

        updateList(){
            if (external_commands.length < 1){
                this.game_list.innerHTML = "<span id='no-eta' class='italic'>Er zijn momenteel geen troepenbewegingen</span>"
            } else {
                this.game_list.innerHTML = ""
                for ( let i = 0; i < external_commands.length; i++){
                    var command = external_commands[i]
                    if (this.osfilter == false){
                        if (command.type == "support") {
                            continue
                        }
                    }
                    if (this.incfilter == false){
                        if (command.type == 'attack' || command.type == 'attack_sea') {
                            continue
                        }
                    }
                    var stadfilter = document.getElementById("stad-filter").value.replaceAll(" ", "").toLowerCase()
                    if (stadfilter != ""){
                        if (command.stad_naam.replaceAll(" ", "").toLowerCase().includes(stadfilter) == false) {
                            continue
                        }
                    }
                    var spelerfilter = document.getElementById("speler-filter").value.replaceAll(" ", "").toLowerCase()
                    if (spelerfilter != ""){
                        if (command.speler.replaceAll(" ", "").toLowerCase().includes(spelerfilter) == false) {
                            continue
                        }
                    }
                    this.createUnit(command)
                }
            }
        }
    }

})();
