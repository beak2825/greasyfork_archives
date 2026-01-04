// ==UserScript==
// @name         TW Chat Alert
// @namespace    http://tampermonkey.net/
// @version      1.25.3.20.2338
// @description  Notification with sound and highlighted background when a keyword appears in the chat (with GUI for management)
// @author       qtMety (in game Annienta Montagne)
// @include https://*.the-west.*/game.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530383/TW%20Chat%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/530383/TW%20Chat%20Alert.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let settings = JSON.parse(localStorage.getItem("TWCAchatKeywordAlertSettings")) || {
        keywords: [
            "word", "two words", "three words?", "another keyword", "ward",
            "wod", "wor",
        ],
        checkInterval: 15000,
        enableSound: true,
        highlightBgColor: "#000000", // Default: sfondo nero
        highlightTextColor: "#FFFFFF" // Default: testo bianco
    };

    let languageStorage = localStorage.getItem("TWCALanguage") || "en";

    let chatCheckInterval;

    let seenMessages = new Set();
    const alertSound = new Audio("https://www.myinstants.com/media/sounds/tindeck_1.mp3");

    const translations = {
    br: {
        saveSettings: "Salvar Configurações",
        resetDefaults: "Restaurar Padrões",
        keywordsTitle: "Palavras-chave ativas:",
        enableSound: "Ativar Som",
        checkInterval: "Intervalo de Verificação",
        volume: "Volume",
        highlightBgColor: "Cor de Fundo Destacada:",
        highlightTextColor: "Cor do Texto Destacado:",
        selectLanguage: "Selecionar Idioma",
        settingsSavedSuccess: "Configurações salvas com sucesso!",
        settingsDefaultSuccess: "Configurações restauradas",
        language: "Português (Brasil)",
        informationText: "Informações",
        informationsContentText: "Este script tem como objetivo destacar palavras-chave no chat do jogo e receber um som de alerta! <br> Você pode usá-lo, por exemplo, para seu apelido no jogo ou para compra e venda de itens!",
        languageText: "Idioma",
        contactText: "Contato",
        contactInfosText: "Você pode me enviar uma mensagem privada (escrevendo para Annienta Montagne) no mundo 1 do the-west: it1.the-west.it",
        donationText: "Ajude-me a continuar o desenvolvimento com uma pequena doação!",
        versionText: "Versão"
    },
    cs: {
        saveSettings: "Uložit nastavení",
        resetDefaults: "Obnovit výchozí",
        keywordsTitle: "Aktivní klíčová slova:",
        enableSound: "Povolit zvuk",
        checkInterval: "Interval kontroly",
        volume: "Hlasitost",
        highlightBgColor: "Zvýrazněná barva pozadí:",
        highlightTextColor: "Zvýrazněná barva textu:",
        selectLanguage: "Vybrat jazyk",
        settingsSavedSuccess: "Nastavení bylo úspěšně uloženo!",
        settingsDefaultSuccess: "Nastavení bylo obnoveno",
        language:"Čeština",
        informationText: "Informace",
        informationsContentText: "Tento skript má za cíl zvýraznit klíčová slova v herním chatu a upozornit vás zvukem! <br> Můžete jej využít například pro svou herní přezdívku nebo pro obchodování s předměty!",
        languageText: "Jazyk",
        contactText: "Kontakt",
        contactInfosText: "Můžete mi poslat soukromou zprávu (napsat Annienta Montagne) na světě 1 v the-west: it1.the-west.it",
        donationText: "Podpořte další vývoj malým příspěvkem!",
        versionText: "Verze"
    },
    de: {
        saveSettings: "Einstellungen speichern",
        resetDefaults: "Auf Standard zurücksetzen",
        keywordsTitle: "Aktive Schlüsselwörter:",
        enableSound: "Ton aktivieren",
        checkInterval: "Prüfintervall",
        volume: "Lautstärke",
        highlightBgColor: "Hervorgehobene Hintergrundfarbe:",
        highlightTextColor: "Hervorgehobene Textfarbe:",
        selectLanguage: "Sprache auswählen",
        settingsSavedSuccess: "Einstellungen erfolgreich gespeichert!",
        settingsDefaultSuccess: "Einstellungen zurückgesetzt",
        language:"Deutsch",
        informationText: "Informationen",
        informationsContentText: "Dieses Skript hebt Schlüsselwörter im Spielchat hervor und benachrichtigt dich per Ton! <br> Nutze es beispielsweise für deinen Spielnamen oder für den Kauf und Verkauf von Gegenständen!",
        languageText: "Sprache",
        contactText: "Kontakt",
        contactInfosText: "Du kannst mir eine private Nachricht senden (schreibe an Annienta Montagne) auf Welt 1 von the-west: it1.the-west.it",
        donationText: "Hilf mir, die Entwicklung mit einer kleinen Spende fortzusetzen!",
        versionText: "Version"
    },
    el: {
        saveSettings: "Αποθήκευση ρυθμίσεων",
        resetDefaults: "Επαναφορά προεπιλογών",
        keywordsTitle: "Ενεργές λέξεις-κλειδιά:",
        enableSound: "Ενεργοποίηση ήχου",
        checkInterval: "Διάστημα ελέγχου",
        volume: "Ένταση",
        highlightBgColor: "Χρώμα επισημασμένου φόντου:",
        highlightTextColor: "Χρώμα επισημασμένου κειμένου:",
        selectLanguage: "Επιλογή γλώσσας",
        settingsSavedSuccess: "Οι ρυθμίσεις αποθηκεύτηκαν με επιτυχία!",
        settingsDefaultSuccess: "Οι ρυθμίσεις επαναφέρθηκαν",
        language:"Ελληνικά",
        informationText: "Πληροφορίες",
        informationsContentText: "Αυτό το σενάριο έχει σκοπό να επισημάνει λέξεις-κλειδιά στη συνομιλία του παιχνιδιού και να σε ειδοποιήσει με ήχο! <br> Μπορείς να το χρησιμοποιήσεις, π.χ. για το όνομα του χαρακτήρα σου ή για αγορές και πωλήσεις αντικειμένων!",
        languageText: "Γλώσσα",
        contactText: "Επικοινωνία",
        contactInfosText: "Μπορείς να μου στείλεις προσωπικό μήνυμα (γράψε στον Annienta Montagne) στον κόσμο 1 του the-west: it1.the-west.it",
        donationText: "Βοήθησέ με να συνεχίσω την ανάπτυξη με μια μικρή δωρεά!",
        versionText: "Έκδοση"
    },
    en: {
        saveSettings: "Save Settings",
        resetDefaults: "Reset Defaults",
        keywordsTitle: "Active Keywords:",
        enableSound: "Enable Sound",
        checkInterval: "Check Interval",
        volume: "Volume",
        highlightBgColor: "Highlighted Background Color:",
        highlightTextColor: "Highlighted Text Color:",
        selectLanguage: "Select Language",
        settingsSavedSuccess: "Settings saved successfully!",
        settingsDefaultSuccess: "Settings restored",
        language:"English",
        informationText: "Information",
        informationsContentText: "This script aims to highlight keywords in the game chat and notify you with a sound! <br> You can use it, for example, for your in-game nickname or for buying and selling items!",
        languageText: "Language",
        contactText: "Contact",
        contactInfosText: "You can send me a private message (write to Annienta Montagne) on world 1 of the-west: it1.the-west.it",
        donationText: "Help me continue development with a small donation!",
        versionText: "Version"
    },
    es: {
        saveSettings: "Guardar Configuración",
        resetDefaults: "Restablecer Predeterminados",
        keywordsTitle: "Palabras clave activas:",
        enableSound: "Habilitar Sonido",
        checkInterval: "Intervalo de Comprobación",
        volume: "Volumen",
        highlightBgColor: "Color de fondo resaltado:",
        highlightTextColor: "Color del texto resaltado:",
        selectLanguage: "Seleccionar Idioma",
        settingsSavedSuccess: "¡Configuración guardada con éxito!",
        settingsDefaultSuccess: "Configuración restablecida",
        language:"Español",
        informationText: "Información",
        informationsContentText: "Este script destaca palabras clave en el chat del juego y te avisa con un sonido! <br> Puedes usarlo, por ejemplo, para tu apodo en el juego o para comprar y vender objetos!",
        languageText: "Idioma",
        contactText: "Contacto",
        contactInfosText: "Puedes enviarme un mensaje privado (escribe a Annienta Montagne) en el mundo 1 de the-west: it1.the-west.it",
        donationText: "¡Ayúdame a seguir desarrollando con una pequeña donación!",
        versionText: "Versión"
    },
    fr: {
        saveSettings: "Enregistrer les paramètres",
        resetDefaults: "Réinitialiser les paramètres",
        keywordsTitle: "Mots-clés actifs :",
        enableSound: "Activer le son",
        checkInterval: "Intervalle de vérification",
        volume: "Volume",
        highlightBgColor: "Couleur de fond mise en évidence :",
        highlightTextColor: "Couleur du texte mise en évidence :",
        selectLanguage: "Sélectionner la langue",
        settingsSavedSuccess: "Paramètres enregistrés avec succès!",
        settingsDefaultSuccess: "Paramètres réinitialisés",
        language:"Français",
        informationText: "Informations",
        informationsContentText: "Ce script met en évidence des mots-clés dans le chat du jeu et t'avertit par un son ! <br> Tu peux l'utiliser, par exemple, pour ton pseudo en jeu ou pour l'achat et la vente d'objets !",
        languageText: "Langue",
        contactText: "Contact",
        contactInfosText: "Tu peux m'envoyer un message privé (écrire à Annienta Montagne) sur le monde 1 de the-west : it1.the-west.it",
        donationText: "Aide-moi à poursuivre le développement avec une petite donation !",
        versionText: "Version"
    },
    hu: {
        saveSettings: "Beállítások mentése",
        resetDefaults: "Alapértelmezés visszaállítása",
        keywordsTitle: "Aktív kulcsszavak:",
        enableSound: "Hang bekapcsolása",
        checkInterval: "Ellenőrzési időköz",
        volume: "Hangerő",
        highlightBgColor: "Kiemelt háttérszín:",
        highlightTextColor: "Kiemelt szövegszín:",
        selectLanguage: "Nyelv kiválasztása",
        settingsSavedSuccess: "Beállítások sikeresen mentve!",
        settingsDefaultSuccess: "Beállítások visszaállítva",
        language:"Magyar",
        informationText: "Információk",
        informationsContentText: "Ez a szkript kulcsszavakat emel ki a játék chatjében, és hanggal értesít téged! <br> Használhatod például a játékbeli nevedhez vagy tárgyak adás-vételéhez!",
        languageText: "Nyelv",
        contactText: "Kapcsolat",
        contactInfosText: "Küldhetsz nekem privát üzenetet (írj Annienta Montagne-nek) a the-west 1-es világán: it1.the-west.it",
        donationText: "Támogass egy kis adománnyal a további fejlesztésekhez!",
        versionText: "Verzió"
    },
    it: {
        saveSettings: "Salva Impostazioni",
        resetDefaults: "Ripristina Predefiniti",
        keywordsTitle: "Parole chiave attive:",
        enableSound: "Abilita Suono",
        checkInterval: "Intervallo di Controllo",
        volume: "Volume",
        highlightBgColor: "Colore sfondo evidenziato:",
        highlightTextColor: "Colore testo evidenziato:",
        selectLanguage: "Seleziona Lingua",
        settingsSavedSuccess: "Impostazioni salvate con successo!",
        settingsDefaultSuccess: "Impostazioni ripristinate",
        language:"Italiano",
        informationText: "Informazioni",
        informationsContentText: "Questo script ha lo scopo di evidenziare delle parole chiave all'interno della chat di gioco e ricevere un suono per essere avvisato! <br> Puoi usarlo, ad esempio, per il tuo nickname in gioco, oppure per la compravendita di oggetti!",
        languageText: "Linguaggio",
        contactText: "Contatti",
        contactInfosText: "Puoi mandarmi un messaggio privato (scrivendo ad Annienta Montagne) su world 1 di the-west: it1.the-west.it",
        donationText: "Aiutami a continuare con lo sviluppo con una piccola donazione!",
        versionText: "Versione"
    },
    nl: {
        saveSettings: "Instellingen opslaan",
        resetDefaults: "Standaardwaarden herstellen",
        keywordsTitle: "Actieve zoekwoorden:",
        enableSound: "Geluid inschakelen",
        checkInterval: "Controle-interval",
        volume: "Volume",
        highlightBgColor: "Gemarkeerde achtergrondkleur:",
        highlightTextColor: "Gemarkeerde tekstkleur:",
        selectLanguage: "Selecteer Taal",
        settingsSavedSuccess: "Instellingen succesvol opgeslagen!",
        settingsDefaultSuccess: "Instellingen hersteld",
        language:"Dutch",
        informationText: "Informatie",
        informationsContentText: "Dit script markeert trefwoorden in de gamechat en waarschuwt je met een geluid! <br> Je kunt het bijvoorbeeld gebruiken voor je in-game bijnaam of voor de handel in items!",
        languageText: "Taal",
        contactText: "Contact",
        contactInfosText: "Je kunt me een privébericht sturen (schrijf naar Annienta Montagne) op wereld 1 van the-west: it1.the-west.it",
        donationText: "Help me de ontwikkeling voort te zetten met een kleine donatie!",
        versionText: "Versie"
    },
    pl: {
        saveSettings: "Zapisz ustawienia",
        resetDefaults: "Przywróć domyślne",
        keywordsTitle: "Aktywne słowa kluczowe:",
        enableSound: "Włącz dźwięk",
        checkInterval: "Interwał sprawdzania",
        volume: "Głośność",
        highlightBgColor: "Podświetlony kolor tła:",
        highlightTextColor: "Podświetlony kolor tekstu:",
        selectLanguage: "Wybierz język",
        settingsSavedSuccess: "Ustawienia zapisane pomyślnie!",
        settingsDefaultSuccess: "Ustawienia przywrócone",
        language:"Polski",
        informationText: "Informacje",
        informationsContentText: "Ten skrypt podkreśla słowa kluczowe na czacie gry i powiadamia cię dźwiękiem! <br> Możesz go użyć np. dla swojego pseudonimu w grze lub do handlu przedmiotami!",
        languageText: "Język",
        contactText: "Kontakt",
        contactInfosText: "Możesz wysłać mi prywatną wiadomość (napisz do Annienta Montagne) na świecie 1 the-west: it1.the-west.it",
        donationText: "Pomóż mi kontynuować rozwój dzięki drobnej darowiźnie!",
        versionText: "Wersja"
    },
    pt: {
        saveSettings: "Salvar Configurações",
        resetDefaults: "Restaurar Padrões",
        keywordsTitle: "Palavras-chave ativas:",
        enableSound: "Ativar Som",
        checkInterval: "Intervalo de Verificação",
        volume: "Volume",
        highlightBgColor: "Cor de Fundo Destacada:",
        highlightTextColor: "Cor do Texto Destacado:",
        selectLanguage: "Selecionar Idioma",
        settingsSavedSuccess: "Configurações salvas com sucesso!",
        settingsDefaultSuccess: "Configurações restauradas",
        language:"Português",
        informationText: "Informações",
        informationsContentText: "Este script tem como objetivo destacar palavras-chave no chat do jogo e alertá-lo com um som! <br> Você pode usá-lo, por exemplo, para o seu apelido no jogo ou para compra e venda de itens!",
        languageText: "Idioma",
        contactText: "Contato",
        contactInfosText: "Você pode me enviar uma mensagem privada (escrevendo para Annienta Montagne) no mundo 1 do the-west: it1.the-west.it",
        donationText: "Ajude-me a continuar o desenvolvimento com uma pequena doação!",
        versionText: "Versão"
    },
    ro: {
        saveSettings: "Salvare setări",
        resetDefaults: "Resetare implicită",
        keywordsTitle: "Cuvinte cheie active:",
        enableSound: "Activare sunet",
        checkInterval: "Interval de verificare",
        volume: "Volum",
        highlightBgColor: "Culoare de fundal evidențiată:",
        highlightTextColor: "Culoare text evidențiat:",
        selectLanguage: "Selectare limbă",
        settingsSavedSuccess: "Setări salvate cu succes!",
        settingsDefaultSuccess: "Setările au fost restaurate",
        language:"Română",
        informationText: "Informații",
        informationsContentText: "Acest script evidențiază cuvintele cheie din chatul jocului și te notifică printr-un sunet! <br> Îl poți folosi, de exemplu, pentru porecla ta din joc sau pentru cumpărarea și vânzarea de obiecte!",
        languageText: "Limbă",
        contactText: "Contact",
        contactInfosText: "Îmi poți trimite un mesaj privat (scrie la Annienta Montagne) pe world 1 din the-west: it1.the-west.it",
        donationText: "Ajută-mă să continui dezvoltarea cu o mică donație!",
        versionText: "Versiune"
    },
    sk: {
        saveSettings: "Uložiť nastavenia",
        resetDefaults: "Obnoviť predvolené",
        keywordsTitle: "Aktívne kľúčové slová:",
        enableSound: "Povoliť zvuk",
        checkInterval: "Interval kontroly",
        volume: "Hlasitosť",
        highlightBgColor: "Zvýraznená farba pozadia:",
        highlightTextColor: "Zvýraznená farba textu:",
        selectLanguage: "Vybrať jazyk",
        settingsSavedSuccess: "Nastavenia boli úspešne uložené!",
        settingsDefaultSuccess: "Nastavenia boli obnovené",
        language:"Slovenčina",
        informationText: "Informácie",
        informationsContentText: "Tento skript zvýrazňuje kľúčové slová v hernom chate a upozorňuje ťa zvukom! <br> Môžeš ho použiť napríklad pre svoju prezývku v hre alebo na nákup a predaj predmetov!",
        languageText: "Jazyk",
        contactText: "Kontakt",
        contactInfosText: "Môžeš mi poslať súkromnú správu (napíš Annienta Montagne) na svete 1 v the-west: it1.the-west.it",
        donationText: "Pomôž mi pokračovať vo vývoji malým príspevkom!",
        versionText: "Verzia"
    },
    tr: {
        saveSettings: "Ayarları Kaydet",
        resetDefaults: "Varsayılanları Sıfırla",
        keywordsTitle: "Aktif Anahtar Kelimeler:",
        enableSound: "Sesi Etkinleştir",
        checkInterval: "Kontrol Aralığı",
        volume: "Ses",
        highlightBgColor: "Vurgulanan Arka Plan Rengi:",
        highlightTextColor: "Vurgulanan Metin Rengi:",
        selectLanguage: "Dil Seçin",
        settingsSavedSuccess: "Ayarlar başarıyla kaydedildi!",
        settingsDefaultSuccess: "Ayarlar geri yüklendi",
        language:"Türkçe",
        informationText: "Bilgi",
        informationsContentText: "Bu komut dosyası, oyun sohbetinde anahtar kelimeleri vurgular ve sizi bir ses ile uyarır! <br> Örneğin, oyun içi takma adınız veya eşya alım satımı için kullanabilirsiniz!",
        languageText: "Dil",
        contactText: "İletişim",
        contactInfosText: "Bana özel mesaj gönderebilirsiniz (Annienta Montagne yazın) world 1 of the-west: it1.the-west.it",
        donationText: "Geliştirmeye devam etmem için küçük bir bağış yap!",
        versionText: "Sürüm"
    }
};



     const TWCA = {
        name: "The-West Chat Alert",
        versionShort: "2.0",
        versionLong: "1.25.3.20.2338",
        author: "qtMety (aka Annienta Montagne, the-west.it w1)",
        website: "",
        language: languageStorage
    }

     var TWCA_api = TheWestApi.register('TWCA', TWCA.name, TWCA.versionShort, Game.version.toString(), TWCA.author);
        var TWCAT = translations[TWCA.language]
        var TWCA_versionInfo = '<b>'+TWCAT.versionText+': </b><i>'+TWCA.name+' '+TWCA.versionLong+'</i><br>'
        var TWCA_registerTitle = '<b><h1>'+TWCAT.informationText+'</h1></b>'+TWCA_versionInfo+'<b>'+TWCAT.languageText+': </b><i>'+TWCAT.language+'</i><br>';
        var TWCA_registerInformation = TWCAT.informationsContentText+'<br>'
        var TWCA_registerContact = '<br><h1><b>'+TWCAT.contactText+'</b></h1>'+TWCAT.contactInfosText+'<br>'
        var TWCA_donationText = '<b>'+TWCAT.donationText+'</b>'
        var TWCA_donationImg = '<h3>'+TWCA_donationText+'</h3><div style="text-align: left;"><a href="https://ko-fi.com/qtmety" target="_blank"><img src="http://inurse.app/imgs/buyMeACoffee.webp" alt="Kofi Donation" width="100"></a><a href="https://ko-fi.com/qtmety" target="_blank"><img src="http://inurse.app/imgs/paypalDonations.webp" alt="Kofi Donations" width="100"></a></div>'
        var TWCA_registerContent = '<br>';
        TWCA_api.setGui(TWCA_registerTitle+''+TWCA_registerInformation+''+TWCA_registerContact+''+TWCA_donationImg+''+TWCA_registerContent);


    var B = 0;

    alertSound.volume = 0.8;

    function checkChat() {
        let messages = document.querySelectorAll(".chat_text");
        messages.forEach((td, index) => {
            let text = td.innerText.trim().toLowerCase();
            let messageId = `${index}_${text}`;

            let foundKeyword = settings.keywords.find(keyword => {
                let regex = new RegExp(`\\b${keyword}\\b`, "gi");
                return regex.test(text);
            });

            if (foundKeyword && !seenMessages.has(messageId)) {
                seenMessages.add(messageId);

                if (settings.enableSound && alertSound.paused) {
                    alertSound.volume = settings.volume; // Assicura che il volume sia aggiornato prima di riprodurre
                    alertSound.play().catch(() => {});
                }

                td.style.backgroundColor = settings.highlightBgColor;
                td.style.color = settings.highlightTextColor;
                td.style.fontWeight = "bold";
                td.style.padding = "5px";
                td.style.borderRadius = "5px";
            }
        });
    }

    setTimeout(() => {
        chatCheckInterval = setInterval(checkChat, settings.checkInterval);
    }, 3000);

    function saveSettings() {
        localStorage.setItem("TWCAchatKeywordAlertSettings", JSON.stringify(settings));
    }

    function openSettingsWindow() {
    let win = wman.open("chatAlertWindow", "TW Chat Alert", "noreload");
    if (!win) return;

    win.setSize(700, 450).setMiniTitle("Chat Alert");
        // Aggiunge dinamicamente lo stile per lo slider
        let style = document.createElement('style');
        style.innerHTML = `
    .slidecontainer {
      width: 100%;
    }

    .slider {
  -webkit-appearance: none;
  width: 100%;
  height: 10px;
  border-radius: 5px;
  background: url('https://westit.innogamescdn.com/images/interface/dock.png') repeat-x;
  background-size: 100% 100%;
  outline: none;
  opacity: 0.7;
  -webkit-transition: .2s;
  transition: opacity .2s;
    }

    .slider:hover {
      opacity: 1;
    }

    .slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 35px;
      height: 28px;
      border: 0;
      background: url('https://www.inurse.app/imgs/twoGuns.gif');
      cursor: pointer;
    }

    .slider::-moz-range-thumb {
      width: 23px;
      height: 24px;
      border: 0;
      background: url('https://www.inurse.app/imgs/twoGuns.gif');
      cursor: pointer;
    }


/* Stile generale del menu a tendina */
.dropdown {
    position: relative;
    display: inline-block;
}

.dropdown-btn {
    background-color: #e4c8a2;
    color: black;
    padding: 5px 10px;
    border: none;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 125px;
}

.dropdown-btn:hover {
    background-color: #e4c59b;
}

.dropdown-content {
    display: none;
    position: absolute;
    background-color: white;
    min-width: 220px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    max-height: 250px;
    overflow-y: auto;
    border: 1px solid #ccc;
    padding: 5px;
}

.show {
    display: block;
}

#flagDropdown {
    display: flex;
    align-items: center; /* Allinea verticalmente */
    justify-content: space-between; /* Spazia gli elementi */
    width: auto; /* Adatta la larghezza */
}

`;
        document.head.appendChild(style);


    let content = $(`
    <div class="tw2gui_groupframe_content_pane">
    <p><b id="keywordTitle">${TWCAT.keywordsTitle}</b></p>
    <textarea id="keywordList" style="width: 95%; height: 100px;"></textarea>
    <ul style="list-style-type: none;">
        <li style="margin: 5px 0;">
            <div id="enableSoundDiv" class="tw2gui_checkbox undefined tw2gui_checkbox_labeled hasMousePopup">
                ${TWCAT.enableSound}
            </div>
        </li>
        <li style="margin: 5px 0;">
            <span class="tw2gui_textfield_wrapper">
                <span id="checkIntervalLabel" class="tw2gui_textfield_label">${TWCAT.checkInterval}</span>
                <span class="tw2gui_textfield">
                    <span><input type="number" id="checkInterval" min="5" max="60" step="1" style="width: 80px;"></span>
                </span>
            </span>
        </li>
    </ul>
    <p>
        <label id="highlightBgColorLabel" for="highlightBgColor">${TWCAT.highlightBgColor}:</label>
        <input class="tw2gui_textfield" type="color" id="highlightBgColor" value="${settings.highlightBgColor || '#000000'}">
    </p>
    <p>
        <label id="highlightTextColorLabel" for="highlightTextColor">${TWCAT.highlightTextColor}:</label>
        <input class="tw2gui_textfield" type="color" id="highlightTextColor" value="${settings.highlightTextColor || '#FFFFFF'}">
    </p>
    <p>
        <label id="volumeLabel" for="volumeControl">${TWCAT.volume}:</label>
        <input type="range" id="volumeControl" min="0" max="1" step="0.1" class="slider" style="width: 80%;">
        <span id="volumeValue"></span>
    </p>
</div>


            <div class="tw2gui_groupframe ">

            <div class="tw2gui_groupframe_background bg0"></div>
            <div class="tw2gui_groupframe_background bg1"></div>
            <div class="tw2gui_groupframe_background bg2"></div>
            <div class="tw2gui_groupframe_background bg3"></div>
            <div class="tw2gui_groupframe_background bg4"></div>
            <div class="tw2gui_groupframe_frame tw2gui_bg_tl"></div>
            <div class="tw2gui_groupframe_frame tw2gui_bg_tr"></div>
            <div class="tw2gui_groupframe_frame tw2gui_bg_bl"></div>
            <div class="tw2gui_groupframe_frame tw2gui_bg_br"></div>

            <div class="tw2gui_groupframe_content_pane" style="display: flex; justify-content: space-between; align-items: center;">

    <div class="tw2gui_button">
        <div class="tw2gui_button_right_cap"></div>
        <div class="tw2gui_button_left_cap"></div>
        <div class="tw2gui_button_middle_bg"></div>
        <div id="cancelSettings" class="textart_title">${TWCAT.resetDefaults}</div>
    </div>

    <div id="flagDropdown"></div>


    <div class="tw2gui_button">
        <div class="tw2gui_button_right_cap"></div>
        <div class="tw2gui_button_left_cap"></div>
        <div class="tw2gui_button_middle_bg"></div>
        <div id="saveSettings" class="textart_title">${TWCAT.saveSettings}</div>
    </div>

</div>


            </div>
        </div>



        </div>
    `);

    win.appendToContentPane(content);
    setTimeout(initDropdown, 10);


        // Imposta lo stato iniziale del checkbox div
        if (settings.enableSound) {
            $("#enableSoundDiv").addClass("tw2gui_checkbox_checked");
        } else {
            $("#enableSoundDiv").removeClass("tw2gui_checkbox_checked");
        }

    // Carica le impostazioni salvate
        $("#keywordList").val(settings.keywords.join("\n"));
        //$("#enableSound").prop("checked", settings.enableSound);
        $("#volumeControl").val(settings.volume || 0.8);
        $("#volumeValue").text((settings.volume || 0.8) * 100 + "%");
        alertSound.volume = settings.volume || 0.8; // Imposta il volume quando la finestra si apre
    $("#checkInterval").val((settings.checkInterval || 15000) / 1000);

    // Aggiornamento visualizzazione volume
    $("#volumeControl").on("input", function() {
        $("#volumeValue").text($(this).val() * 100 + "%");
    });

        // Gestisce il click sul checkbox div
        $("#enableSoundDiv").on("click", function() {
            $(this).toggleClass("tw2gui_checkbox_checked");
            settings.enableSound = $(this).hasClass("tw2gui_checkbox_checked");
        });

        $("#cancelSettings").on("click", function() {
            settings = {
                keywords: [
            "word", "two words", "three words boh", "another keyword", "ward",
            "wod", "wor",
                ],
                checkInterval: 15000,
                enableSound: true,
                volume: 0.8,
                highlightBgColor: "#000000", //Reset sfondo nero
                highlightTextColor: "#FFFFFF" // Reset testo bianco
            };

            $("#keywordList").val(settings.keywords.join("\n"));
            $("#enableSoundDiv").addClass("tw2gui_checkbox_checked");
            $("#volumeControl").val(settings.volume);
            $("#volumeValue").text(settings.volume * 100 + "%");
            $("#checkInterval").val(settings.checkInterval / 1000);
            $("#highlightBgColor").val(settings.highlightBgColor);
            $("#highlightTextColor").val(settings.highlightTextColor);

            alertSound.volume = settings.volume; //Aggiorna il volume immediatamente
            saveSettings();
            //Annulla il vecchio setInterval e avvia il nuovo con il nuovo valore
            clearInterval(chatCheckInterval);
            chatCheckInterval = setInterval(checkChat, settings.checkInterval);
            new UserMessage(''+TWCAT.settingsDefaultSuccess+'', 'success').show();
        });

        // Salvataggio delle impostazioni
        $("#saveSettings").on("click", function() {
            settings.keywords = $("#keywordList").val().split("\n").map(k => k.trim()).filter(k => k);
            settings.enableSound = $("#enableSoundDiv").hasClass("tw2gui_checkbox_checked");
            settings.volume = parseFloat($("#volumeControl").val());
            settings.checkInterval = parseInt($("#checkInterval").val()) * 1000;
            settings.highlightBgColor = $("#highlightBgColor").val();
            settings.highlightTextColor = $("#highlightTextColor").val();

            alertSound.volume = settings.volume; // Aggiorna il volume immediatamente
            saveSettings();
            //Annulla il vecchio setInterval e avvia il nuovo con il nuovo valore
            clearInterval(chatCheckInterval);
            chatCheckInterval = setInterval(checkChat, settings.checkInterval);
            new UserMessage(''+TWCAT.settingsSavedSuccess+'', 'success').show();
        });
    }

function applyTranslations(language) {
    if (!translations[language]) language = "en"; // Se manca, usa l'italiano di default

    document.getElementById("saveSettings").textContent = translations[language].saveSettings;
    document.getElementById("cancelSettings").textContent = translations[language].resetDefaults;
    document.getElementById("keywordTitle").textContent = translations[language].keywordsTitle;
    document.getElementById("enableSoundDiv").textContent = translations[language].enableSound;
    document.getElementById("checkIntervalLabel").textContent = translations[language].checkInterval;
    document.getElementById("volumeLabel").textContent = translations[language].volume;
    document.getElementById("highlightBgColorLabel").textContent = translations[language].highlightBgColor;
    document.getElementById("highlightTextColorLabel").textContent = translations[language].highlightTextColor;
    document.getElementById("dropdown-btn").textContent = translations[language].selectLanguage;
}



function initDropdown() {

    // Aspettiamo che il sistema west.gui sia disponibile
    if (typeof west === "undefined" || typeof west.gui === "undefined") {
        console.error("west.gui non è definito. Riprovo...");
        setTimeout(initDropdown, 500);
        return;
    }

        //Definizione delle lingue e posizione delle bandiere
        var languages = {
            br: { lang: "Português (pt-br)", bg_pos: "0px -1008px", locale: "pt_BR" },
            cs: { lang: "Čeština (cs)", bg_pos: "0px -784px", locale: "cs_CZ" },
            de: { lang: "Deutsch (de)", bg_pos: "0px -1103px", locale: "de_DE" },
            el: { lang: "Ελληνικά (el)", bg_pos: "0px -752px", locale: "el_GR" },
            en: { lang: "English (en)", bg_pos: "0px -1488px", locale: "en_EN" },
            es: { lang: "Español (es)", bg_pos: "0px -1392px", locale: "es_ES" },
            fr: { lang: "Français (fr)", bg_pos: "0px -1360px", locale: "fr_FR" },
            hu: { lang: "Magyar (hu)", bg_pos: "0px -1136px", locale: "hu_HU" },
            it: { lang: "Italiano (it)", bg_pos: "0px -1296px", locale: "it_IT" },
            nl: { lang: "Dutch (nl)", bg_pos: "0px -687px", locale: "nl_NL" },
            pl: { lang: "Polski (pl)", bg_pos: "0px -1616px", locale: "pl_PL" },
            pt: { lang: "Português (pt)", bg_pos: "0px -848px", locale: "pt_PT" },
            ro: { lang: "Română (ro)", bg_pos: "0px -976px", locale: "ro_RO" },
            sk: { lang: "Slovenčina (sk)", bg_pos: "0px -815px", locale: "sk_SK" },
            tr: { lang: "Türkçe (tr)", bg_pos: "0px -1328px", locale: "tr_TR" }
        };

    const flagDropdown = document.getElementById("flagDropdown");

    if (!flagDropdown) {
        console.error(" Elemento flagDropdown non trovato!");
        return;
    }

    var langCombo = new west.gui.Combobox();
    langCombo.setWidth(180);

    Object.entries(languages)
        .sort((a, b) => a[1].lang.localeCompare(b[1].lang))
        .forEach(([key, value]) => {
            langCombo.addItem(
                key,
                `<span style="background: url(//portal-bar.innogamescdn.com/images/west-sprite_01.newRuFlag.1661155041.png) no-repeat left center; background-position: ${value.bg_pos}; padding-left: 30px;">${value.lang}</span>`
            );
        });

    // Seleziona la lingua attuale
    const savedLanguage = localStorage.getItem("TWCALanguage") || "en";
    langCombo.select(savedLanguage);

    // Listener per il cambio lingua
    langCombo.addListener(function(selectedKey) {
        localStorage.setItem("TWCALanguage", selectedKey);
        applyTranslations(selectedKey); // Applica la traduzione immediatamente
    });

    // Inserisce il combobox direttamente nel flagDropdown
    $(flagDropdown).empty().append(langCombo.getMainDiv());
}


    function addSettingsButton() {
        let menuContainer = document.querySelector("#ui_menubar");
        if (!menuContainer) return;

        //  Crea il contenitore per il pulsante
        let menuDiv = document.createElement("div");
        menuDiv.className = "ui_menucontainer";
        menuDiv.style.marginBottom = "7px";

        let settingsButton = document.createElement("div");
        settingsButton.id = "chatAlertMenuButton";
        settingsButton.className = "menulink hasMousePopup";
        settingsButton.style.backgroundImage = "url(http://inurse.app/imgs/voiceMessageIcon.webp)";
        settingsButton.style.backgroundSize = "contain"; // Adatta l'immagine alla dimensione del pulsante
        settingsButton.style.backgroundRepeat = "no-repeat";
        settingsButton.style.backgroundPosition = "0px 0px";
        settingsButton.style.width = "26px";
        settingsButton.style.height = "26px";
        settingsButton.style.cursor = "pointer";

        settingsButton.title = "Impostazioni Chat Alert";
        settingsButton.addEventListener("click", openSettingsWindow);

        // Effetto hover
        settingsButton.addEventListener("mouseenter", () => {
            settingsButton.style.backgroundPosition = "0px 0px";
        });
        settingsButton.addEventListener("mouseleave", () => {
            settingsButton.style.backgroundPosition = "0px 0px";
        });

        let bottomDiv = document.createElement("div");
        bottomDiv.className = "menucontainer_bottom";

        menuDiv.appendChild(settingsButton);
        menuDiv.appendChild(bottomDiv);

        menuContainer.appendChild(menuDiv);
    }

    setTimeout(addSettingsButton, 1000);

})();
