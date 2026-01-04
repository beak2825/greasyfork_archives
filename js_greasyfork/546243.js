// ==UserScript==
// @name         Betreuungs-Benennungs-Assistent
// @namespace    http://tampermonkey.net/
// @version      12.2
// @description  (Bibliotheca Culinaria) Automatisiert die Umbenennung von Betreuungs-Fahrzeugen mit über 300 Gerichten.
// @author       Gemini & User-Input
// @match        https://www.leitstellenspiel.de/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      self
// @downloadURL https://update.greasyfork.org/scripts/546243/Betreuungs-Benennungs-Assistent.user.js
// @updateURL https://update.greasyfork.org/scripts/546243/Betreuungs-Benennungs-Assistent.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========================================================================
    // 1. STYLES
    // ========================================================================
    GM_addStyle(`
        #bb-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.7); z-index: 9999; display: flex; justify-content: center; align-items: center; }
        #bb-modal-content { background-color: #282c34; color: #fff; padding: 20px; border-radius: 8px; width: 600px; max-width: 90%; max-height: 80vh; border: 1px solid #444; display: flex; flex-direction: column; }
        #bb-modal-content h3 { margin-top: 0; border-bottom: 1px solid #555; padding-bottom: 10px; }
        #bb-modal-body { flex-grow: 1; white-space: pre-wrap; margin-bottom: 15px; }
        #bb-log-area { width: 100%; height: 200px; background-color: #1e1e1e; color: #d4d4d4; font-family: monospace; font-size: 12px; border: 1px solid #555; border-radius: 4px; padding: 5px; overflow-y: scroll; resize: vertical; }
        #bb-progress-bar-container { width: 100%; background-color: #555; border-radius: 5px; margin-bottom: 10px; }
        #bb-progress-bar { width: 0%; height: 20px; background-color: #007bff; border-radius: 5px; text-align: center; line-height: 20px; color: white; transition: width 0.5s ease-in-out; }
        #bb-modal-buttons { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; flex-wrap: wrap; }
        .bb-modal-btn { padding: 10px 20px; border: none; color: white; border-radius: 5px; cursor: pointer; }
        .btn-start { background-color: #dc3545; }
        .btn-warning { background-color: #ffc107; color: black; }
        .btn-close { background-color: #6c757d; }
    `);

    // ========================================================================
    // 2. KONFIGURATION & DATENBANKEN
    // ========================================================================
    const BATCH_SIZE = 15;
    const MARKER = '\u200B';
    const TARGET_VEHICLE_TYPES = { 130: 'GW-Bt', 131: 'Bt-Kombi', 132: 'FKH', 139: 'GW-Küche', 140: 'MTW-Verpflegung', 141: 'FKH', 142: 'AB-Küche' };
    const gerichte = [
        // Imbiss & Fast Food (40)
        { name: "Currywurst", gender: "f" }, { name: "Bratwurst", gender: "f" }, { name: "Bockwurst", gender: "f" }, { name: "Rostbratwurst", gender: "f" },
        { name: "Käsekrainer", gender: "f" }, { name: "Frikadelle", gender: "f" }, { name: "Bulette", gender: "f" }, { name: "Fleischpflanzerl", gender: "n" },
        { name: "Schaschlik", gender: "n" }, { name: "Pommes Frites", gender: "p" }, { name: "Krakauer", gender: "f" }, { name: "Leberkäse", gender: "m" },
        { name: "Fleischkäse", gender: "m" }, { name: "Hot Dog", gender: "m" }, { name: "Burger", gender: "m" }, { name: "Cheeseburger", gender: "m" },
        { name: "Chicken Nuggets", gender: "p" }, { name: "Pulled Pork", gender: "n" }, { name: "Corn Dog", gender: "m" }, { name: "Onion Rings", gender: "p" },
        { name: "Chicken Wings", gender: "p" }, { name: "Country Potatoes", gender: "p" }, { name: "Wedges", gender: "p" }, { name: "Knoblauchbrot", gender: "n" },
        { name: "Chili-Cheese-Fries", gender: "p" }, { name: "Bosna", gender: "f" }, { name: "Schweinshals", gender: "m" }, { name: "Nackensteak", gender: "n" },
        { name: "Bauchspeck", gender: "m" }, { name: "Veggie-Burger", gender: "m" }, { name: "Halloumi-Burger", gender: "m" }, { name: "Brezel", gender: "f" },
        { name: "Laugenstange", gender: "f" }, { name: "Käsestange", gender: "f" }, { name: "Salamistange", gender: "f" }, { name: "Schinken-Käse-Croissant", gender: "n" },
        { name: "Belegtes Brötchen", gender: "n" }, { name: "Panini", gender: "n" }, { name: "Toast Hawaii", gender: "m" }, { name: "Club Sandwich", gender: "n" },

        // Pizza, Pasta & Italienisch (32)
        { name: "Pizza Margherita", gender: "f" }, { name: "Pizza Salami", gender: "f" }, { name: "Pizza Funghi", gender: "f" }, { name: "Pizza Hawaii", gender: "f" },
        { name: "Pizza Tonno", gender: "f" }, { name: "Pizza Diavolo", gender: "f" }, { name: "Pizza Quattro Stagioni", gender: "f" }, { name: "Pizza Capricciosa", gender: "f" },
        { name: "Pizza Frutti di Mare", gender: "f" }, { name: "Pizza Prosciutto", gender: "f" }, { name: "Pizza Vegetaria", gender: "f" }, { name: "Pizza Calzone", gender: "f" },
        { name: "Pizza Bianca", gender: "f" }, { name: "Pizzabrötchen", gender: "p" }, { name: "Lasagne", gender: "f" }, { name: "Spaghetti Bolognese", gender: "p" },
        { name: "Spaghetti Carbonara", gender: "p" }, { name: "Penne all'Arrabbiata", gender: "p" }, { name: "Gnocchi", gender: "p" }, { name: "Tortellini", gender: "p" },
        { name: "Ravioli", gender: "p" }, { name: "Tagliatelle", gender: "p" }, { name: "Bruschetta", gender: "f" }, { name: "Arancini", gender: "p" },
        { name: "Piadina", gender: "f" }, { name: "Focaccia", gender: "f" }, { name: "Saltimbocca", gender: "n" }, { name: "Vitello Tonnato", gender: "n" },
        { name: "Panna Cotta", gender: "f" }, { name: "Tiramisu", gender: "n" }, { name: "Minestrone", gender: "f" }, { name: "Insalata Caprese", gender: "f" },

        // Döner, Gyros & Mediterran/Orientalisch (23)
        { name: "Döner Kebab", gender: "m" }, { name: "Gyros", gender: "n" }, { name: "Lahmacun", gender: "n" }, { name: "Pide", gender: "f" },
        { name: "Falafel", gender: "p" }, { name: "Halloumi", gender: "m" }, { name: "Bifteki", gender: "n" }, { name: "Souvlaki", gender: "n" },
        { name: "Moussaka", gender: "m" }, { name: "Paella", gender: "f" }, { name: "Tapas", gender: "p" }, { name: "Pita", gender: "f" },
        { name: "Köfte", gender: "p" }, { name: "Tsatsiki", gender: "m" }, { name: "Börek", gender: "m" }, { name: "Hummus", gender: "m" },
        { name: "Baba Ghanoush", gender: "n" }, { name: "Shakshuka", gender: "f" }, { name: "Couscous", gender: "m" }, { name: "Tajine", gender: "f" },
        { name: "Shawarma", gender: "n" }, { name: "Mezze", gender: "p" }, { name: "Taboulé", gender: "n" },

        // Asiatisch (25)
        { name: "Gebratene Nudeln", gender: "p" }, { name: "Gebratener Reis", gender: "m" }, { name: "Frühlingsrolle", gender: "f" }, { name: "Peking-Ente", gender: "f" },
        { name: "Sushi", gender: "n" }, { name: "Maki", gender: "p" }, { name: "Nigiri", gender: "p" }, { name: "Sashimi", gender: "n" },
        { name: "Ramen", gender: "p" }, { name: "Pho", gender: "f" }, { name: "Pad Thai", gender: "n" }, { name: "Saté-Spieß", gender: "m" },
        { name: "Tom Kha Gai", gender: "f" }, { name: "Wan Tan", gender: "p" }, { name: "Dim Sum", gender: "p" }, { name: "Kimchi", gender: "n" },
        { name: "Bibimbap", gender: "n" }, { name: "Bulgogi", gender: "n" }, { name: "Sommerrolle", gender: "f" }, { name: "Curry", gender: "n" },
        { name: "Süß-Sauer", gender: "n" }, { name: "Chicken Korma", gender: "n" }, { name: "Tikka Masala", gender: "n" }, { name: "Samosa", gender: "f" },
        { name: "Pakora", gender: "p" },

        // Tex-Mex & Lateinamerikanisch (11)
        { name: "Taco", gender: "m" }, { name: "Burrito", gender: "m" }, { name: "Quesadilla", gender: "f" }, { name: "Enchilada", gender: "f" },
        { name: "Nachos", gender: "p" }, { name: "Chili con Carne", gender: "n" }, { name: "Empanada", gender: "f" }, { name: "Arepa", gender: "f" },
        { name: "Ceviche", gender: "n" }, { name: "Feijoada", gender: "f" }, { name: "Churros", gender: "p" },

        // Deutsche Hausmannskost & Regionales (74)
        { name: "Schnitzel", gender: "n" }, { name: "Jägerschnitzel", gender: "n" }, { name: "Zigeunerschnitzel", gender: "n" }, { name: "Rahmschnitzel", gender: "n" },
        { name: "Wienerschnitzel", gender: "n" }, { name: "Schweinshaxe", gender: "f" }, { name: "Eisbein", gender: "n" }, { name: "Kassler", gender: "n" },
        { name: "Sauerbraten", gender: "m" }, { name: "Roulade", gender: "f" }, { name: "Kohlroulade", gender: "f" }, { name: "Königsberger Klopse", gender: "p" },
        { name: "Maultaschen", gender: "p" }, { name: "Labskaus", gender: "n" }, { name: "Pfefferpotthast", gender: "m" }, { name: "Grünkohl", gender: "m" },
        { name: "Spießbraten", gender: "m" }, { name: "Zwiebelkuchen", gender: "m" }, { name: "Flammkuchen", gender: "m" }, { name: "Strammer Max", gender: "m" },
        { name: "Mett-Igel", gender: "m" }, { name: "Tote Oma", gender: "f" }, { name: "Halve Hahn", gender: "m" }, { name: "Himmel un Ääd", gender: "n" },
        { name: "Weißwurst", gender: "f" }, { name: "Obatzda", gender: "m" }, { name: "Schweinsbraten", gender: "m" }, { name: "Pannfisch", gender: "m" },
        { name: "Krabbenbrötchen", gender: "n" }, { name: "Leipziger Allerlei", gender: "n" }, { name: "Schäufele", gender: "n" }, { name: "Beamtenstippe", gender: "f" },
        { name: "Jägerschnitzel (Ost)", gender: "n" }, { name: "Hoppelpoppel", gender: "n" }, { name: "Bratkartoffeln", gender: "p" }, { name: "Kartoffelsalat", gender: "m" },
        { name: "Nudelsalat", gender: "m" }, { "name": "Wurstsalat", "gender": "m" }, { name: "Semmelknödel", gender: "m" }, { name: "Kartoffelknödel", gender: "m" },
        { name: "Serviettenknödel", gender: "m" }, { name: "Reibekuchen", gender: "m" }, { name: "Kartoffelpuffer", gender: "m" }, { name: "Rotkohl", gender: "m" },
        { name: "Sauerkraut", gender: "n" }, { name: "Käsespätzle", gender: "p" }, { name: "Schupfnudeln", gender: "p" }, { name: "Spätzlepfanne", gender: "f" },
        { name: "Thüringer Klöße", gender: "p" }, { name: "Senfeier", gender: "p" }, { name: "Linsen mit Spätzle", gender: "p" }, { name: "Zwiebelrostbraten", gender: "m" },
        { name: "Handkäse mit Musik", gender: "m" }, { name: "Grüne Soße", gender: "f" }, { name: "Dibbelabbes", gender: "m" }, { name: "Saumagen", gender: "m" },
        { name: "Haxen", gender: "p" }, { name: "Leberknödel", gender: "m" }, { name: "Fleischküchle", gender: "n" }, { name: "Schlachtplatte", gender: "f" },
        { name: "Ochsenmaulsalat", gender: "m" }, { name: "Wurst-Käse-Salat", gender: "m" }, { name: "Gefillde", gender: "p" }, { name: "Schwenkbraten", gender: "m" },
        { name: "Döppekooche", gender: "m" }, { name: "Saure Nierle", gender: "p" }, { name: "Falscher Hase", gender: "m" }, { name: "Blinder Fisch", gender: "m" },
        { name: "Pellkartoffeln mit Quark", gender: "p" }, { name: "Kartoffelgratin", gender: "n" },

        // Suppen & Eintöpfe (24)
        { name: "Gulaschkanone", gender: "f" }, { name: "Erbsensuppe", gender: "f" }, { name: "Linseneintopf", gender: "m" }, { name: "Kartoffelsuppe", gender: "f" },
        { name: "Soljanka", gender: "f" }, { name: "Hochzeitssuppe", gender: "f" }, { name: "Graupensuppe", gender: "f" }, { name: "Bohneneintopf", gender: "m" },
        { name: "Kürbiscremesuppe", gender: "f" }, { name: "Tomatensuppe", gender: "f" }, { name: "Zwiebelsuppe", gender: "f" }, { name: "Leberknödelsuppe", gender: "f" },
        { name: "Gaisburger Marsch", gender: "m" }, { name: "Borschtsch", gender: "m" }, { name: "Käsesuppe", gender: "f" }, { name: "Brokkolisuppe", gender: "f" },
        { name: "Spargelsuppe", gender: "f" }, { name: "Gyrossuppe", gender: "f" }, { name: "Saure Zipfel", gender: "p" }, { name: "Bouillabaisse", gender: "f" },
        { name: "Gulaschsuppe", gender: "f" }, { name: "Gazpacho", gender: "f" }, { name: "Irish Stew", gender: "n" }, { name: "Gumbo", gender: "m" },

        // Fisch (10)
        { name: "Backfisch", gender: "m" }, { name: "Brathering", gender: "m" }, { name: "Matjes", gender: "m" }, { name: "Bismarckhering", gender: "m" },
        { name: "Seelachsfilet", gender: "n" }, { name: "Fish and Chips", gender: "p" }, { name: "Forelle Müllerin", gender: "f" }, { name: "Zanderfilet", gender: "n" },
        { name: "Garnelenspieß", gender: "m" }, { name: "Calamares", gender: "p" },

        // Osteuropäisch (7)
        { name: "Pierogi", gender: "p" }, { name: "Bigos", gender: "m" }, { name: "Cevapcici", gender: "p" }, { name: "Schaschliktopf", gender: "m" },
        { name: "Gulasch", gender: "n" }, { name: "Letscho", gender: "n" }, { name: "Langos", gender: "m" },

        // Weitere Internationale Gerichte (12)
        { name: "Quiche Lorraine", gender: "f" }, { name: "Boeuf Bourguignon", gender: "n" }, { name: "Coq au Vin", gender: "m" }, { name: "Ratatouille", gender: "f" },
        { name: "Zürcher Geschnetzeltes", gender: "n" }, { name: "Rösti", gender: "n" }, { name: "Käsefondue", gender: "n" }, { name: "Haggis", gender: "m" },
        { name: "Shepherd's Pie", gender: "m" }, { name: "Cornish Pasty", gender: "f" }, { name: "Sausage Roll", gender: "f" }, { name: "Scotch Egg", gender: "n" },

        // Süßspeisen & Desserts (19)
        { name: "Kaiserschmarrn", gender: "m" }, { name: "Milchreis", gender: "m" }, { name: "Grießbrei", gender: "m" }, { name: "Dampfnudel", gender: "f" },
        { name: "Germknödel", gender: "m" }, { name: "Apfelstrudel", gender: "m" }, { name: "Waffel", gender: "f" }, { name: "Crêpe", gender: "n" },
        { name: "Pfannkuchen", gender: "m" }, { name: "Arme Ritter", gender: "p" }, { name: "Quarkkeulchen", gender: "p" }, { name: "Kalter Hund", gender: "m" },
        { name: "Rote Grütze", gender: "f" }, { name: "Schwarzwälder Kirsch", gender: "f" }, { name: "Bienenstich", gender: "m" }, { name: "Mohnkuchen", gender: "m" },
        { name: "Streuselkuchen", gender: "m" }, { name: "Apfelküchle", gender: "n" }, { name: "Berliner", gender: "m" }
    ];
    const praefixe = ["Rollende", "Mobile", "Heisse", "Feldküche", "Zum Goldenen", "Der flotte", "Einsatz-", "Scharfe", "Lecker-", "Feuerwehr-", "Florians", "Rettungs-", "Gourmet-", "Taktische", "Strategische", "Kulinarische", "Herzhafte"];
    const suffixe = ["Bude", "Express", "Grill", "Mobil", "Eck", "Hütte", "Station", "Traum", "Kelle", "Pfanne", "Topf", "Küche", "Dienst", "Versorgung", "Einheit", "Zentrale", "Oase", "Kombüse", "Schmiede", "Theke"];
    const dynamicWords = ["Zum", "Zur", "leckeren", "Heißer", "Heiße", "Heißes", "on", "Tour"];
    const NAMING_WORDS = new Set([...praefixe, ...gerichte.map(g => g.name), ...suffixe, ...dynamicWords]);

    // ========================================================================
    // 3. HILFS- UND KERNFUNKTIONEN
    // ========================================================================
    function generiere_namen(){while(true){const gericht=gerichte[Math.floor(Math.random()*gerichte.length)];const musterTypen=['praefix_kombi','suffix_kombi','tour_kombi','heiss_kombi','lecker_kombi'];const gewaehlterTyp=musterTypen[Math.floor(Math.random()*musterTypen.length)];switch(gewaehlterTyp){case'praefix_kombi':return`${praefixe[Math.floor(Math.random()*praefixe.length)]} ${gericht.name}`;case'suffix_kombi':return`${gericht.name}-${suffixe[Math.floor(Math.random()*suffixe.length)]}`;case'tour_kombi':return`${gericht.name} on Tour`;case'heiss_kombi':if(gericht.gender==='p')continue;switch(gericht.gender){case'm':return`Heißer ${gericht.name}`;case'f':return`Heiße ${gericht.name}`;case'n':return`Heißes ${gericht.name}`}break;case'lecker_kombi':if(gericht.gender==='p')continue;switch(gericht.gender){case'm':case'n':return`Zum leckeren ${gericht.name}`;case'f':return`Zur leckeren ${gericht.name}`}break}}}
    function showModal(config){const oldOverlay=document.getElementById('bb-modal-overlay');if(oldOverlay)document.body.removeChild(oldOverlay);const overlay=document.createElement('div');overlay.id='bb-modal-overlay';const modalContent=document.createElement('div');modalContent.id='bb-modal-content';modalContent.innerHTML=`<h3>${config.title}</h3><div id="bb-modal-body">${config.body||''}</div>`;if(config.progress){modalContent.innerHTML+=`<div id="bb-progress-bar-container"><div id="bb-progress-bar">0%</div></div><textarea id="bb-log-area" readonly></textarea>`}const buttonContainer=document.createElement('div');buttonContainer.id='bb-modal-buttons';if(config.actions){config.actions.forEach(action=>{const button=document.createElement('button');button.className=`bb-modal-btn ${action.className||''}`;button.textContent=action.label;button.addEventListener('click',action.callback);buttonContainer.appendChild(button)})}modalContent.appendChild(buttonContainer);overlay.appendChild(modalContent);document.body.appendChild(overlay);return{overlay,modalContent}}
    function gmFetch(url,options={}){return new Promise((resolve,reject)=>{GM_xmlhttpRequest({method:options.method||'GET',url:`https://www.leitstellenspiel.de${url}`,headers:options.headers||{},data:options.body,timeout:15000,onload:(response)=>{if(response.status>=200&&response.status<300){response.ok=true;response.text=()=>Promise.resolve(response.responseText);resolve(response)}else{reject(new Error(`Server-Fehler: Status ${response.status}`))}},onerror:(error)=>reject(new Error('Netzwerk- oder Skript-Konflikt-Fehler.')),ontimeout:()=>reject(new Error('Zeitüberschreitung der Anfrage.'))})})}
    async function startRenamingProcess(vehicles,buildingCache){showModal({title:'Betreuungs-Benennung läuft...',body:'',progress:true,actions:[{label:'Schließen',className:'btn-close',callback:()=>document.body.removeChild(document.getElementById('bb-modal-overlay'))}]});const progressBar=document.getElementById('bb-progress-bar');const logArea=document.getElementById('bb-log-area');logArea.value='Initialisiere...\n';try{logArea.value+='Besorge Sicherheitstoken...\n';const firstVehicleId=vehicles[0]?.id;if(!firstVehicleId)throw new Error("Keine Fahrzeuge zum Bearbeiten gefunden!");const tokenResponse=await gmFetch(`/vehicles/${firstVehicleId}/edit`);const tokenHtml=await tokenResponse.text();const parser=new DOMParser();const doc=parser.parseFromString(tokenHtml,"text/html");const tokenElement=doc.querySelector('meta[name="csrf-token"]');if(!tokenElement)throw new Error("Sicherheitstoken konnte nicht gefunden werden!");const authToken=tokenElement.getAttribute('content');logArea.value+='Sicherheitstoken erfolgreich erhalten. Starte Batch-Verarbeitung...\n';const jobList=vehicles.map(v=>{const stationName=buildingCache[v.building_id]||"Unbekannte Wache";const vehicleType=TARGET_VEHICLE_TYPES[v.vehicle_type];const imbissName=generiere_namen();const newCaption=`${vehicleType} ${imbissName} [${stationName}]${MARKER}`;return{id:v.id,newCaption:newCaption,oldCaption:v.caption}});let processedCount=0,successCount=0,errorCount=0;for(let i=0;i<jobList.length;i+=BATCH_SIZE){const batch=jobList.slice(i,i+BATCH_SIZE);logArea.value+=`\nVerarbeite Paket ${Math.ceil((i+1)/BATCH_SIZE)} / ${Math.ceil(jobList.length/BATCH_SIZE)}...\n`;const batchPromises=batch.map(job=>{const formData=new URLSearchParams();formData.append('utf8','✓');formData.append('_method','patch');formData.append('authenticity_token',authToken);formData.append('vehicle[caption]',job.newCaption);return gmFetch(`/vehicles/${job.id}`,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:formData.toString()}).then(response=>{if(response.ok){successCount++;logArea.value+=`OK: "${job.oldCaption}" -> "${job.newCaption.slice(0,-1)}"\n`}else{errorCount++;logArea.value+=`FEHLER bei "${job.oldCaption}": Server-Status ${response.status}\n`}}).catch(e=>{errorCount++;logArea.value+=`FEHLER bei "${job.oldCaption}": ${e.message}\n`}).finally(()=>{logArea.scrollTop=logArea.scrollHeight})});await Promise.allSettled(batchPromises);processedCount+=batch.length;const progress=(processedCount/jobList.length)*100;progressBar.style.width=`${progress}%`;progressBar.textContent=`${processedCount} / ${jobList.length} verarbeitet`}progressBar.style.backgroundColor='#28a745';logArea.value+=`\nProzess beendet. Erfolgreich: ${successCount}, Fehler: ${errorCount}.\n`;logArea.scrollTop=logArea.scrollHeight}catch(error){logArea.value+=`\nEin schwerwiegender Fehler ist aufgetreten: ${error.message}\nProzess abgebrochen.`;if(document.getElementById('bb-progress-bar'))document.getElementById('bb-progress-bar').style.backgroundColor='#dc3545'}}
    async function startAnalysis(){showModal({title:'Fahrzeug-Analyse',body:'Lade Fuhrpark- und Gebäudedaten von der API...'});try{const[vehicleResponse,buildingResponse]=await Promise.all([gmFetch('/api/vehicles'),gmFetch('/api/buildings')]);if(!vehicleResponse.ok||!buildingResponse.ok)throw new Error(`API-Fehler! Fahrzeuge: ${vehicleResponse.status}, Gebäude: ${buildingResponse.status}`);const allVehicles=await vehicleResponse.text().then(JSON.parse);const allBuildings=await buildingResponse.text().then(JSON.parse);const buildingCache=Object.fromEntries(allBuildings.map(b=>[b.id,b.caption]));const allTargetTypeVehicles=allVehicles.filter(v=>Object.keys(TARGET_VEHICLE_TYPES).map(Number).includes(v.vehicle_type));const vehiclesToRename=allTargetTypeVehicles.filter(v=>{const caption=v.caption;const realStationName=buildingCache[v.building_id]||null;if(caption.endsWith(MARKER)){const cleanCaption=caption.slice(0,-1);const captionStationMatch=cleanCaption.match(/\[([^\]]+)\]$/);const captionStationName=captionStationMatch?captionStationMatch[1]:null;return(realStationName&&captionStationName!==realStationName)}else{return true}});let resultText=`Insgesamt ${allTargetTypeVehicles.length} relevante Betreuungs-Fahrzeuge gefunden.\n\nDavon müssen ${vehiclesToRename.length} Fahrzeuge neu benannt oder aktualisiert werden.`;const actions=[];if(allTargetTypeVehicles.length>0){actions.push({label:`Alle ${allTargetTypeVehicles.length} überschreiben (erzwingen)`,className:'btn-warning',callback:()=>{if(confirm(`ACHTUNG!\n\nMöchtest du wirklich ALLE ${allTargetTypeVehicles.length} Betreuungs-Fahrzeuge neu benennen?`)){startRenamingProcess(allTargetTypeVehicles,buildingCache)}}})}if(vehiclesToRename.length>0){actions.push({label:`Umbenennung STARTEN (${vehiclesToRename.length})`,className:'btn-start',callback:()=>startRenamingProcess(vehiclesToRename,buildingCache)})}actions.push({label:'Schließen',className:'btn-close',callback:()=>document.body.removeChild(document.getElementById('bb-modal-overlay'))});showModal({title:'Analyse Ergebnis',body:resultText,actions:actions})}catch(error){showModal({title:'Fehler',body:`Ein Fehler ist aufgetreten:\n${error.message}`,actions:[{label:'Schließen',className:'btn-close',callback:()=>document.body.removeChild(document.getElementById('bb-modal-overlay'))}]})}}
    const addGeneratorButton=()=>{const settingsLink=document.querySelector('a.lightbox-open[href="/settings/index"]');if(!settingsLink)return;const settingsListItem=settingsLink.closest('li');if(!settingsListItem)return;const mainMenu=settingsListItem.parentElement;if(!mainMenu||document.getElementById('betreuungs-main-button')){if(mainMenu){observer.disconnect()}return}const newListItem=document.createElement('li');newListItem.setAttribute('role','presentation');const mainButton=document.createElement('a');mainButton.href="#";mainButton.id='betreuungs-main-button';mainButton.innerHTML=`<span style="font-size: 20px; vertical-align: -3px; margin-right: 5px; display: inline-block;">🚚</span> Betreuungs-Benennung`;mainButton.style.cursor="pointer";mainButton.addEventListener('click',(e)=>{e.preventDefault();startAnalysis()});settingsListItem.insertAdjacentElement('afterend',newListItem);newListItem.appendChild(mainButton);observer.disconnect()};

    // ========================================================================
    // 4. SKRIPT-START
    // ========================================================================
    const observer = new MutationObserver(addGeneratorButton);
    observer.observe(document.body, { childList: true, subtree: true });
    addGeneratorButton();

})();