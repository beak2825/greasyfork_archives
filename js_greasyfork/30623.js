// ==UserScript==
// @name        TW Classic Translation
// @namespace   fktext.bplaced.net/classic_translation
// @description Translates the content of the TW Classic version into German.
// @include     *classic.the*west.net*
// @exclude     *classic.the-west.net/help.php*
// @exclude     *classic.the-west.net/?page=error*
// @run-at      document-end
// @version     1.16
// @grant       none
// @author      stayawayknight
// @downloadURL https://update.greasyfork.org/scripts/30623/TW%20Classic%20Translation.user.js
// @updateURL https://update.greasyfork.org/scripts/30623/TW%20Classic%20Translation.meta.js
// ==/UserScript==
function contentEval(source) {
    if ('function' == typeof source) {
        source = '(' + source + ')();'
    }
    var script = document.createElement('script');
    script.setAttribute('type', 'application/javascript');
    script.textContent = source;
    document.body.appendChild(script);
    document.body.removeChild(script);
};
TWCT = function () {
    TWCT = {
        initialized: false
    };
    TWCT.locale = 'de';
    TWCT.res = {
        button: {
            left: 'https://media.innogamescdn.com/com_WEST_DE/classic/button/button_left.png',
            middle: 'https://media.innogamescdn.com/com_WEST_DE/classic/button/button_middle.png',
            right: 'https://media.innogamescdn.com/com_WEST_DE/classic/button/button_right.png'
        },
        menu_image: 'https://media.innogamescdn.com/com_WEST_DE/classic/classic_menu_' + TWCT.locale + '.png'
    };
    TWCT.lang = {
        //Attribute names
        attribute_names: {
            strength: 'Stärke',
            flexibility: 'Beweglichkeit',
            dexterity: 'Geschicklichkeit',
            charisma: 'Charisma'
        },
        //Skill names
        skill_names: {
            aim: 'Zielen',
            animal: 'Mit Tieren umgehen',
            appearance: 'Auftreten',
            build: 'Errichten',
            dodge: 'Ausweichen',
            endurance: 'Ausdauer',
            finger_dexterity: 'Fingerfertigkeit',
            health: 'Lebenspunkte',
            hide: 'Verstecken',
            leadership: 'Leiten',
            pitfall: 'Fallen stellen',
            punch: 'Schlagkraft',
            reflex: 'Reflex',
            repair: 'Reparieren',
            ride: 'Reiten',
            shot: 'Schießen',
            swim: 'Schwimmen',
            tactic: 'Taktik',
            tough: 'Zähigkeit',
            trade: 'Handeln'
        },
        items: null, //will be loaded dynamically later
        item_slots: {
            head: 'Kopfbedeckung',
            neck: 'Halsband',
            left_arm: 'Nebenhand',
            right_arm: 'Duellwaffe',
            body: 'Bekleidung',
            foot: 'Schuhe',
            animal: 'Reittier',
            yield: 'Produkt'
        },
        //Job names and descriptions
        jobs: [
            {
                name: 'Schweine hüten',
                desc: 'Ein Bauer bietet dir an, dass du auf seine Schweine aufpasst und ihnen Futter gibst.'
            },
            {
                name: 'Vögel vom Feld vertreiben',
                desc: 'Ein Bauer bittet dich, die Krähen von seinem frisch gesäten Feld zu vertreiben.'
            },
            {
                name: 'Plakate anbringen',
                desc: 'Der örtliche Sheriff bittet dich darum, ein paar Plakate von Verbrechern in der Gegend' +
                ' zu verteilen.'
            },
            {
                name: 'Tabak pflücken',
                desc: 'Der Tabak reifte in diesem Jahr sehr gut. Du kannst jederzeit anfangen, Tabakblätter' +
                ' zu pflücken.'
            },
            {
                name: 'Baumwolle pflücken',
                desc: 'Ein großes Schild dieser Baumwollplantage weist darauf hin, dass noch Baumwollpflücker' +
                ' gesucht werden.'
            },
            {
                name: 'Zuckerrohr schlagen',
                desc: 'Ein süßlicher Geruch von frisch geschlagenem Zuckerrohr verbreitet sich über die Felder.'
            },
            {
                name: 'Angeln',
                desc: 'Ein großer Schwarm Fische verrät dir, dass du hier deine Angel herausholen solltest.'
            },
            {
                name: 'Getreide ernten',
                desc: 'Es ist Erntezeit. Eine helfende Hand wird auf diesem Getreidefeld jederzeit benötigt.'
            },
            {
                name: 'Beeren pflücken',
                desc: 'Der Wald ist voll von Sträuchern. Du wirst hier einige Beeren finden.'
            },
            {
                name: 'Schafe hüten',
                desc: 'Einige Schafe laufen dir vor die Füße. Der Hirtenjunge ist merklich überfordert. Hilf ihm die ' +
                'Schafe wieder einzutreiben.'
            },
            {
                name: 'Zeitung verkaufen',
                desc: '"Zeitung zu verkaufen! Zeitung zu verkaufen!" Ein Junge drückt dir einen Stapel Zeitungen' +
                ' in die Arme und bittet dich sie weiter zu verkaufen.'
            },
            {
                name: 'Keine Arbeit',
                desc: ''
            },
            {
                name: 'Keine Arbeit',
                desc: ''
            },
            {
                name: 'Mais pflücken',
                desc: 'Aus diesem Mais wird der bekannteste Whiskey des Landes hergestellt.'
            },
            {
                name: 'Bohnen pflücken',
                desc: 'Auf diesem Feld kannst du Bohnen pflücken.'
            },
            {
                name: 'Fort bewachen',
                desc: 'Es werden wachsame Leute gesucht, die dieses Fort bewachen.'
            },
            {
                name: 'Gerben',
                desc: 'Ein Jäger hat einige Tiere geschossen. Hilf ihm, die Felle zu gerben, um so Leder zu gewinnen.'
            },
            {
                name: 'Gold schürfen',
                desc: 'Die zahlreichen siebenden Leute verraten dir, dass du an diesem Bach reich werden kannst.'
            },
            {
                name: 'Gräber ausheben',
                desc: 'An dieser Stelle sollen die gefallenen Söhne unseres Landes begraben werden.'
            },
            {
                name: 'Truthähne jagen',
                desc: 'Ein Truthahn läuft dir direkt vor die Füße. Im Wald wirst du noch mehr finden.'
            },
            {
                name: 'Gleise verlegen',
                desc: 'Eine Bahn vom Atlantik zum Pazifik. Hilf diesen Traum zu verwirklichen.'
            },
            {
                name: 'Kühe treiben',
                desc: 'Eine Herde Kühe soll zu den Schlachthäusern von Chicago getrieben werden. Der leitende' +
                ' Cowboy stellt dir dafür ein Pferd zur Verfügung.'
            },
            {
                name: 'Zäune reparieren',
                desc: 'Einige Rinder scheinen an dieser Stelle durch den Zaun gebrochen zu sein. Repariere' +
                ' ihn schnell, bevor noch weitere Tiere ausbrechen.'
            },
            {
                name: 'Keine Arbeit',
                desc: ''
            },
            {
                name: 'Steinabbau',
                desc: 'Ein Grollen vom Berg hallt durch die Prärie. An diesem Steinbruch werden sich ein paar' +
                ' Dollar verdienen lassen.'
            },
            {
                name: 'Keine Arbeit',
                desc: ''
            },
            {
                name: 'Bäume fällen',
                desc: 'Eine neue Siedlung ist ganz in der Nähe des Waldes gegründet worden. Hier werden Holz und' +
                ' kräftige Axthiebe benötigt.'
            },
            {
                name: 'Keine Arbeit',
                desc: ''
            },
            {
                name: 'Rinder branden',
                desc: 'Ein Farmer bittet dich seine neue Kuhherde für ihn zu branden.'
            },
            {
                name: 'Stacheldrahtzaun aufstellen',
                desc: 'Eine Rinderherde soll in diesem Gebiet weiden. Umzäune das Gebiet.'
            },
            {
                name: 'Keine Arbeit',
                desc: ''
            },
            {
                name: 'Edelsteine schürfen',
                desc: 'Einige Halbedelsteine blitzen am Boden des Wassers. Schürfe nach ihnen.'
            },
            {
                name: 'Claim abstecken',
                desc: 'Gold wurde an diesem Fluss gefunden. Stecke Claims ab und sorge dafür, dass du das' +
                ' beste Stück bekommst.'
            },
            {
                name: 'Planwagen reparieren',
                desc: 'Eine verzweifelte Familie steckt mit ihrem kaputten Planwagen fest. Hilf der Familie,' +
                ' vielleicht haben sie eine Belohnung für dich.'
            },
            {
                name: 'Pferde einreiten',
                desc: 'Ein Farmer bittet dich, seine gerade gefangenen Wildpferde einzureiten.'
            },
            {
                name: 'Handeln',
                desc: 'Die Goldschürfer an diesem Gewässer zeigen stolz ihre dicken Goldklumpen. Es ist Zeit,' +
                ' ihnen Alkohol und Tabak zu verkaufen.'
            },
            {
                name: 'Telegraphenmasten aufstellen',
                desc: 'Die Telegrammverbindung zwischen zwei großen Städten soll endlich ausgebaut werden.'
            },
            {
                name: 'Keine Arbeit',
                desc: ''
            },
            {
                name: 'Biberjagd',
                desc: 'Einige Bäume am Waldrand sind angenagt. Das Aufstellen von Biberfallen wird sich lohnen.'
            },
            {
                name: 'Kohleabbau',
                desc: 'Die verrußten Gesichter der Männer am Fuße des Berges deuten auf eine ertragreiche Kohlemine hin.'
            },
            {
                name: 'Keine Arbeit',
                desc: ''
            },
            {
                name: 'Fischen',
                desc: 'Im klaren Wasser kannst du viele Fische sehen. Wirf das Netz aus!'
            },
            {
                name: 'Bahnhof bauen',
                desc: 'Die Eisenbahn wird schon in drei Tagen hier ankommen. Baue schnell einen Bahnhof auf.'
            },
            {
                name: 'Windräder bauen',
                desc: 'An dieser Stelle wird gerade ein neues Windrad errichtet. Hilf den Siedlern.'
            },
            {
                name: 'Auf Erkundung gehen',
                desc: 'Tritt in die Fußstapfen von Lewis und Clark und erkunde dieses bislang unbekannte Stück Land.'
            },
            {
                name: 'Holz flößen',
                desc: 'Männer versuchen Baumstämme flussabwärts zu lenken. Hilfe können sie gut gebrauchen,' +
                ' doch ein unfreiwilliges Bad solltest du einplanen.'
            },
            {
                name: 'Brücke bauen',
                desc: 'Eine Brücke für die Bahn soll hier gebaut werden.'
            },
            {
                name: 'Pferde fangen',
                desc: 'Die Staubwolke am Horizont kommt näher. Es ist Zeit, dass du dein Können auf dem Pferd' +
                ' und mit dem Lasso unter Beweis stellst.'
            },
            {
                name: 'Särge zimmern',
                desc: 'Nach einer Schießerei werden hier viele Särge benötigt.'
            },
            {
                name: 'Munition transportieren',
                desc: 'Die Armee braucht dringend Nachschub. Transportiere dieses hochexplosive Zeug' +
                ' sofort zum nächsten Fort.'
            },
            {
                name: 'Kojoten jagen',
                desc: 'Ein Kojote treibt einen Bauern in den Ruin. Er ist bereit dir sein gesamtes Erspartes' +
                ' für den Kopf dieses Kojoten zu geben.'
            },
            {
                name: 'Büffel jagen',
                desc: 'Ein Reiter mustert dich kurz und meint, dass du genau der Richtige wärst, um mit ihm ' +
                'und seinen Jungs eine Herde Büffel zu jagen.'
            },
            {
                name: 'Keine Arbeit',
                desc: ''
            },
            {
                name: 'Mit Indianern handeln',
                desc: 'Ein Stamm der Sioux hat einige wertvolle Gegenstände. Sei vorsichtig, wenn du versuchst' +
                ' sie gegen Alkohol oder wertlose Perlen zu tauschen.'
            },
            {
                name: 'Wald roden',
                desc: 'Gold wurde in der Nähe gefunden. Die Goldgräberstadt braucht viel Holz und die Preise sind gut.'
            },
            {
                name: 'Silberabbau',
                desc: 'Ein Silbervorkommen wurde an diesem Berg entdeckt. Verdiene schnell gutes Geld.'
            },
            {
                name: 'Postkutsche bewachen',
                desc: 'Die Postkutsche wurde in den letzten Wochen häufig ausgeraubt. Du bekommst einen anständigen' +
                ' Lohn, wenn du den Kutscher auf seiner Fahrt begleitest.'
            },
            {
                name: 'Wölfe jagen',
                desc: 'Ein Rudel Wölfe reißt die Herde der hier wohnenden Farmer. Hilf den verzweifelten Familien.'
            },
            {
                name: 'Siedlertreck beschützen',
                desc: 'Ein Siedlertreck bittet dich um Hilfe, sie durch dieses Territorium der Indianer zu begleiten.'
            },
            {
                name: 'Pferde stehlen',
                desc: 'Der Großgrundbesitzer hat einige Zuchtpferde im Stall. Stiehl die Pferde und verkaufe sie.'
            },
            {
                name: 'Gefängniswächter',
                desc: 'Mitten in der Prärie siehst du eine große Festungsanlage. Beweise deine Autorität und achte' +
                ' darauf, dass niemand entkommt.'
            },
            {
                name: 'Missionieren',
                desc: 'Der Pastor bittet dich, einen Indianerstamm vom wahren Glauben zu überzeugen.'
            },
            {
                name: 'Ponyexpress',
                desc: 'Diese Nachricht muss so schnell es geht einen Empfänger erreichen. Nur die besten' +
                ' Reiter können diese Aufgabe erledigen.'
            },
            {
                name: 'Gewehre an Indianer verkaufen',
                desc: 'Verkaufe dem Indianerstamm Gewehre, damit der Stamm sich gegen den Weißen Mann wehren kann.'
            },
            {
                name: 'Leichen plündern',
                desc: 'Einige Geier kreisen weit entfernt über der Wüste. Vielleicht hatte das Opfer ein Paar' +
                ' gute Schuhe bei sich.'
            },
            {
                name: 'Grizzlybären jagen',
                desc: 'Ausgewachsene Grizzlybären treiben in diesem Wald ihr Unwesen. Der Kopf eines Bären' +
                ' sollte einen guten Preis bringen.'
            },
            {
                name: 'Nach Öl bohren',
                desc: 'Die schwarze Flüssigkeit, die aus dem Boden sprudelt, ist ein guter Rohstoff' +
                ' zur Petroleumgewinnung.'
            },
            {
                name: 'Schatzsuche',
                desc: 'In dieser Wüste soll es einen riesigen Indianerschatz geben. Geh ihn suchen!'
            },
            {
                name: 'Der Armee dienen',
                desc: '"WE WANT YOU" liest du auf einem Plakat. Es wird dir ein guter Sold geboten, ' +
                'der wohl auch ein hohes Risiko mit sich trägt.'
            },
            {
                name: 'Leute bestehlen',
                desc: 'Viele Leute passieren täglich diese Straßenkreuzung. Mit etwas Geschick dürften' +
                ' sich ihre Taschen leeren und deine Taschen füllen.'
            },
            {
                name: 'Als Söldner arbeiten',
                desc: 'Ein Bandenkrieg zwischen zwei Familien sollte dir eine gute Gelegenheit bieten,' +
                ' dir eine Handvoll Dollar zu verdienen.'
            },
            {
                name: 'Banditen jagen',
                desc: 'Eine Gruppe Banditen überfällt seit Monaten die Kutschen und Trecks. Wenn du' +
                ' sie findest, solltest du gute Gegenstände und viel Geld bei ihnen finden. Vorausgesetzt du überlebst.'
            },
            {
                name: 'Überfall',
                desc: 'Die Kutschen und Trecks, die von hier aus nach Westen wollen, müssen durch einen engen Pass.' +
                ' Ein guter Ort für einen Überfall.'
            },
            {
                name: 'Postkutsche überfallen',
                desc: 'Im Saloon triffst du auf zwei zähe Burschen. Sie brauchen noch einen dritten Mann.'
            },
            {
                name: 'Kopfgeldjäger',
                desc: '"Dead or Alive". Du prägst dir den Namen und das Gesicht des Mannes ein und ziehst los.'
            },
            {
                name: 'Gefangenentransport',
                desc: 'Einige Schwerverbrecher sollen ins Gefängnis gebracht werden. Vielleicht haben sie noch einige' +
                ' wertvolle Gegenstände für dich.'
            },
            {
                name: 'Zug überfallen',
                desc: 'Das wird dein größter Deal. Stoppe den Zug und raube die Fahrgäste komplett aus.'
            },
            {
                name: 'Einbruch',
                desc: 'Die erfolgreichen Goldschürfer vergnügen sich gerade im Saloon. In ihren Hütten wird' +
                ' vielleicht noch etwas zu holen sein.'
            }
        ],
        accept_agb: 'Ich akzeptiere die AGB.',
        accept_quest: 'Quest annehmen',
        assign_attributes_and_skills: 'Attribute und Fertigkeiten vergeben',
        at_least_one_labor_point: 'Um eine Arbeit machen zu können brauchst du mindestens einen Arbeitspunkt.',
        attributes: 'Attribute',
        automation_advert: 'Mit dem Premiumbonus <i>Automatisierung</i> kannst du vier Arbeiten in die' +
        'Arbeitsschleife einstellen, die nacheinander abgearbeitet werden.',
        backpack: 'Gepäck',
        bank_account_description: '<b>Konto</b>. Das Geld auf deinem Konto ist sicher. Es wird automatisch' +
        ' abgebucht, wenn dein Bargeld zum Bezahlen nicht reicht.',
        begin_work: 'Arbeit beginnen',
        cash_description: '<b>Bargeld</b>. Dein Bargeld ist nicht gesichert. Dieses kann dir z.B. im' +
        ' Duell abgenommen werden.',
        cancel: 'Abbrechen',
        cancel_quest: 'Quest abbrechen',
        center_character: 'Karte auf deinen Charakter zentrieren',
        center_map: 'Karte auf deine Stadt zentrieren',
        change: 'Ändern',
        change_attributes_and_skills: 'Attribute und Fertigkeiten ändern',
        change_password: 'Passwort ändern',
        character_name: 'Charaktername:',
        character_stats: ['Stufe', 'Erfahrungspunkte', 'Lebenspunkte', 'Erholung', 'Geschwindigkeit', 'Duellstufe',
                          'Duelle gewonnen', 'Duelle verloren'],
        completed_quests: 'Abgeschlossene Quests',
        confirm: 'Bestätigen',
        confirm_password: 'Passwort bestätigen:',
        contact: 'Impressum',
        costs_attributes: 'Kosten Attributpunkt',
        costs_skills: 'Kosten Fertigkeitspunkt',
        current_assignments: 'Eingestellte Arbeiten',
        costs_current: 'Derzeitige Kosten',
        damage: 'Schaden',
        danger_description: '<strong>Gefahr:</strong> Die Gefahr gibt das Verletzungsrisiko der Arbeit an.' +
        ' Je höher die Gefahr, desto schlimmere Verletzungen können entstehen. Je mehr Arbeitspunkte du einbringst,' +
        ' desto geringer ist die Verletzungsgefahr.',
        delete_login_cookies: 'Login-Cookies löschen',
        description: 'Beschreibung',
        difficulty: 'Schwierigkeit',
        difficulty_description: '<strong>Schwierigkeit der Arbeit:</strong> Jede Arbeit besitzt' +
        ' einen Schwierigkeitsgrad. Die Schwierigkeit wird von den eingebrachten Fertigkeitspunkten abgezogen.',
        discover_new_land: 'Erkunde neues Land und erlebe spannende Abenteuer und Duelle!<br/>The West erwartet' +
        ' dich!',
        distance: 'Hinweg:',
        done: 'Fertig',
        duration: 'Dauer:',
        employers: {
            barkeeper: {
                name: 'Barkeeper Henry Walker',
                text: '<p>Hinter dem Tresen steht Henry Walker, der Barkeeper und Besitzer des Saloons. ' +
                'Er ist ein leicht beleibter Mann, der etwa 50 Jahre alt ist.</p>\n<p>Du ' +
                'erkennst, dass er am ganzen Körper viele kleine Narben hat. Besonders seine Hände ' +
                'deuten darauf hin, dass er in seiner Vergangenheit viele Abenteuer erlebt haben muss.' +
                ' Henry Walker hat ein freundliches Gesicht und eine beruhigende Stimme.</p>'
            }, lady: {
                name: 'Maria Roalstad', text: '<p>Maria ist Tänzerin und Bedienung in Henry Walkers Saloon.' +
                ' Sie hat ein sehr selbstbewusstes Auftreten und hat eindeutig das Sagen unter den Tänzerinnen.</p>'
            },
            sheriff: {
                name: 'Sheriff John Fitzburn', text: '<p>Ein etwa 40 Jahre alter Mann sitzt dir gegenüber.' +
                ' An seinem goldenen Stern auf der Brust erkennst du ihn als den örtlichen Sheriff.</p>\n<p>Der Mann' +
                ' stellt sich dir als John Fitzburn vor. Beim ersten Wort riechst du, dass es nicht sein erstes Glas' +
                ' Whiskey am heutigen Tag war. Dennoch nimmt er dich vollkommen wahr und spricht noch' +
                ' sehr kontrolliert.</p>'
            }, indian: {
                name: 'Waupee (White Hawk)',
                text: '<p>Es ist leicht zu erkennen, dass Waupee ein Ureinwohner Amerikas ist.' +
                ' Es ist ungewöhnlich einen Indianer in einem Saloon zu finden.' +
                ' Im Gegensatz zu anderen Indianern raucht er seine Pfeife nicht als rituelles Zeichen,' +
                ' sondern aus Genuss.</p>\n<p>Waupee versucht keinen Kontakt zu anderen Gästen im Saloon aufzunehmen,' +
                ' er wirkt emotionslos. Eine enge Freundschaft zwischen ihm und Henry Walker scheint der Grund' +
                ' für seine Anwesenheit zu sein.</p>'
            }
        },
        energy: 'Erholung',
        errors: {
            mail_already_taken: 'Die E-Mail wird bereits verwendet',
            mail_invalid: 'Die E-Mail ist ungültig',
            name_already_taken: 'Der Name ist bereits belegt',
            name_has_double_spaces: 'Doppelte Leerzeichen sind nicht erlaubt',
            name_has_invalid_signs: 'Der Name enthält Zeichen, die für diese Sprachversion nicht erlaubt sind',
            name_has_spaces: 'Der Name darf am Anfang und am Ende keine Leerzeichen enthalten',
            name_too_long: 'Der Name darf maximal 20 Zeichen lang sein',
            name_too_short: 'Der Name muss mindestens 3 Zeichen lang sein',
            oid_already_taken: 'Der OpenID wird bereits verwendet',
            password_has_spaces: 'Der Name darf am Anfang und am Ende keine Leerzeichen enthalten',
            password_too_short: 'Das Passwort muss mindestens 5 Zeichen lang sein'
        },
        experience: 'Erfahrung',
        experience_description: '<strong>Erfahrung:</strong> Die Erfahrung gibt an wie viele Erfahrungspunkte' +
        ' du für die Arbeit bekommst.',
        experience_point: 'Erfahrungspunkt',
        experience_points: 'Erfahrungspunkte',
        finish_quest: 'Quest abschließen',
        forum: 'The-West-Forum',
        forum_link: 'https://forum.the-west.de',
        found_town: 'Stadt gründen',
        ghost_town: 'Geisterstadt',
        health: 'Lebenspunkte',
        help: 'Hilfe',
        hint: 'Hinweis',
        labor_points: 'Arbeitspunkte',
        labor_points_description: '<strong>Arbeitspunkte:</strong> Die eingebrachten ' +
        'Fertigkeitspunkte abzüglich der Schwierigkeit ergeben die Arbeitspunkte. Du benötigst mindestens' +
        ' einen Arbeitspunkt, um eine Arbeit auszuführen. Je mehr Arbeitspunkte du besitzt, desto höher ist ' +
        'der Lohn und die Gefahr sinkt.',
        level: 'Stufe',
        login_permanently: 'Dauerhaft einloggen',
        logout: 'Logout',
        luck_description: '<strong>Glück:</strong> Mit etwas Glück bekommst oder findest du bei der Arbeit' +
        ' einen Gegenstand. Mit höherem Glück kannst du bessere Gegenstände finden. Durch den Premiumbonus' +
        ' bekommst du 30% wertvollere Gegenstände.',
        minimap: 'Minimap',
        minimap_legend: ['Hier befindest du dich', 'Eigene Stadt', 'Fremde Städte', 'Geisterstädte'],
        missing_labor_points: 'Dir fehlen für diese Arbeit noch %1 Arbeitspunkte.',
        motivation_description: '<strong>Motivation:</strong> Die Motivation gibt an wie hoch deine' +
        ' Leistungsbereitschaft für die Arbeit ist und verringert so den Lohn, die Erfahrung und das Glück.' +
        ' Wenn du eine Arbeit häufiger ausführst sinkt die Motivation. Mit der Zeit steigt sie wieder.',
        number_of_players: 'Spieleranzahl',
        ok: 'Ok',
        open_quests: 'Offene Quests',
        password: 'Passwort:',
        player: 'Spieler',
        players: 'Spieler',
        player_not_exist: 'Dieser Spieler existiert nicht',
        praying: 'Beten',
        product_find_chance: 'Die Wahrscheinlichkeit den Gegenstand<br/>in 30 Minuten zu finden liegt bei ',
        purchase_price: 'Einkaufswert',
        questbook: 'Questbuch',
        //will be loaded dynamically later
        quests: null,
        recommended: 'empfohlen',
        requires: 'Benötigt',
        requires_level: 'Benötigt Stufe',
        reward: 'Belohnung',
        sales_price: 'Verkaufswert',
        saloon: 'Saloon',
        screenshot_labels: [
            'Gründe zusammen mit anderen Spielern eine Stadt und errichte neue Gebäude.',
            'In der großen Welt erwarten dich viele verschiedene Abenteuer und Aufgaben.',
            'Bist du ein Goldsucher, ein Falschspieler oder ein Kopfgeldjäger? Du entscheidest welchen Weg du gehst!'
        ],
        select_job: '-- Job wählen --',
        select_world: 'Bitte wähle deine Spielwelt:',
        select_world_2: 'Wähle eine Welt!',
        show: 'anzeigen',
        sign_up: 'Anmelden',
        sign_up_at: 'Anmelden auf',
        skill_sum_description: '<strong>Summe der 5 Fertigkeiten:</strong> Dieses sind die Punkte, die dein Charakter in die Arbeit einbringt. Ziehst du die Schwierigkeit ab, so erhältst du die für diese Arbeit eingebrachten Arbeitspunkte.',
        skilled_attributes: 'vergebene Attributpunkte',
        skilled_skills: 'vergebene Fertigkeitspunkte',
        skills: 'Fertigkeiten',
        sleeping: 'Schlafen',
        speed: 'Geschwindigkeit',
        start_date: 'Startdatum',
        //Task names
        tasks: {
            nothing: 'Du machst gerade nichts.',
            job: 'Arbeit',
            duel: 'Du duellierst dich gerade.',
            sleep: 'Du schläfst gerade.',
            pray: 'Du betest gerade.',
            found: 'Du gründest eine Stadt.',
            refound: 'Du besetzt eine Geisterstadt.',
            build: 'Du baust deine Stadt aus.',
            walk: 'Du gehst gerade.',
            way: 'Du gehst gerade.'
        },
        target: 'Ziel',
        translation_in_progress: 'Übersetze.',
        used_skill_points: 'Verwendete Fertigkeiten',
        user_name: 'Name:',
        wage_description: '<strong>Lohn:</strong> Der Lohn gibt an wie viele Dollar du für die Arbeit bekommst.' +
        ' Je mehr Arbeitspunkte du einbringst, desto höher ist der Lohn. Durch den Premiumbonus bekommst du 50%' +
        ' mehr Lohn.',
        weapon_types: {
            shot: 'Schusswaffe',
            hand: 'Schlagwaffe'
        },
        work_time: ['10 Minuten', '30 Minuten', '1 Stunde', '2 Stunden'],
        world: 'Welt',
        wrong_password: 'Das Passwort ist falsch',
        you_are_here: 'Hier befindest du dich!'
    };

    var basic = {
        buttonHideChanged: false,
        //Replaces an image button element with an javascript button with dynamic text, given in the text parameter
        replaceWestButton: function (image_element, text) {

            if (!this.buttonHideChanged) {
                //Change the way how buttons are hidden and made visible again (inline-block instead of block):
                Button.prototype.setVisible = function (visible) {
                    this.el.style.display = visible ? 'inline-block' : 'none';
                }
                this.buttonHideChanged = true;
            }

            //Create the button itself
            var button = document.createElement('div');
            button.style['cursor'] = 'pointer';
            button.style['height'] = '25px';
            button.style['display'] = 'inline-block';
            button.style['margin'] = '0 10px 10px 0';

            //Create the left part of the button
            var button_left = document.createElement('div');
            button_left.style['background-image'] = 'url(' + TWCT.res.button.left + ')';
            button_left.style['width'] = '16px';
            button_left.style['height'] = '25px';
            button_left.style['display'] = 'inline-block';

            //Create the right part of the button
            var button_right = document.createElement('div');
            button_right.style['background-image'] = 'url(' + TWCT.res.button.right + ')';
            button_right.style['width'] = '16px';
            button_right.style['height'] = '25px';
            button_right.style['display'] = 'inline-block';

            //Create middle part of the button
            var button_middle = document.createElement('div');
            button_middle.style['background-image'] = 'url(' + TWCT.res.button.middle + ')';
            button_middle.style['height'] = '25px';
            button_middle.style['display'] = 'inline-block';
            button_middle.style['vertical-align'] = 'top';

            //Create the button text
            var button_text = document.createElement('span');
            button_text.style['color'] = 'white',
                button_text.style['font-family'] = 'Arial,Verdana,sans-serif';
            button_text.style['font-weight'] = 'bold';
            button_text.style['font-size'] = '15px';
            button_text.style['position'] = 'relative';
            button_text.style['top'] = '2px';

            //Make text non-selectable
            button_text.style['-webkit-user-select'] = 'none';
            button_text.style['-khtml-user-select'] = 'none';
            button_text.style['-moz-user-select'] = 'none';
            button_text.style['-ms-user-select'] = 'none';
            button_text.style['-o-user-select'] = 'none';
            button_text.style['user-select'] = 'none';

            button_text.innerHTML = text;

            //Add text to the middle part of the button
            button_middle.appendChild(button_text);

            //Build the button
            button.appendChild(button_left);
            button.appendChild(button_middle);
            button.appendChild(button_right);

            //Copy ID from old element
            button.id = image_element.id;
            //Copy events from old element
            button.cloneEvents(image_element);

            //Finally replace image button with javascript button
            if (image_element.parentElement) {
                image_element.parentElement.replaceChild(button, image_element);
            } else {
                image_element.parent.replaceChild(button, image_element);
            }
        },

        //Finds the matching item translation for a given item id using binary search; will return null if not found
        findItemTranslationByID: function (id) {
            var minIndex = 0;
            var maxIndex = TWCT.lang.items.length - 1;
            var currentIndex = 0;
            var currentItemID = 0;
            while (minIndex <= maxIndex) {
                currentIndex = (minIndex + maxIndex) / 2 | 0;
                currentItemID = TWCT.lang.items[currentIndex].item_id;
                if (currentItemID < id) {
                    minIndex = currentIndex + 1;
                } else if (currentItemID > id) {
                    maxIndex = currentIndex - 1;
                } else {
                    return TWCT.lang.items[currentIndex];
                }
            }
            return null;
        },

        //Finds the matching quest translation for a given quest id using binary search; will return null if not found
        findQuestTranslationByID: function (id) {
            var minIndex = 0;
            var maxIndex = TWCT.lang.quests.length - 1;
            var currentIndex = 0;
            var currentItemID = 0;
            while (minIndex <= maxIndex) {
                currentIndex = (minIndex + maxIndex) / 2 | 0;
                currentItemID = TWCT.lang.quests[currentIndex].quest_id;
                if (currentItemID < id) {
                    minIndex = currentIndex + 1;
                } else if (currentItemID > id) {
                    maxIndex = currentIndex - 1;
                } else {
                    return TWCT.lang.quests[currentIndex];
                }
            }
            return null;
        }
    };

    //Define a throbber which can be shown while the translation process is going on
    var throbber = {
        container: null,
        //Shows the throbber
        show: function () {
            if (this.container == null) {
                this.container = document.createElement('div');
                this.container.style.position = 'absolute';
                this.container.style.left = '0px';
                this.container.style.top = '0px';
                this.container.style.width = '100%';
                this.container.style.height = '100%';
                //this.container.style['background-color'] = 'rgba(0, 0, 0, 0.8)';

                this.container.innerHTML = '<div style="position: absolute; left:0px; right:0px; top: 0px; ' +
                    'bottom: 0px; margin: auto; width: 100px; height: 50px; border: 3px solid saddlebrown; ' +
                    'background-color: beige; z-index: 10; text-align: center;">' + TWCT.lang.translation_in_progress
                    + '<br/><img src="images/throbber.gif"/></div>';

                document.body.appendChild(this.container);
            }
            this.container.style.display = '';
        },
        //Hides the throbber
        hide: function () {
            if (this.container == null) {
                return;
            }
            this.container.style.display = 'none';
        }
    };

    //Load translations from web server
    var load_translations = function (callback) {
        function getScript(src, callback) {
            var s = document.createElement('script');
            s.src = src;
            s.async = true;
            s.onreadystatechange = s.onload = function () {
                if (!callback.done && (!s.readyState || /loaded|complete/.test(s.readyState))) {
                    callback.done = true;
                    callback();
                }
            };
            //Modify loaded script by append and prepend strings to the source
            s.innerHTML = s.innerHTML;
            document.querySelector('head').appendChild(s);
        }

        getScript('https://stayawknt.safe-ws.de/translation.php?lang=' + TWCT.locale, callback);
    };


    //Perform absolute basic operations at start
    var init = function () {
        //Sort item object array, so a binary search can be performed on it
        TWCT.lang.items.sort(function (a, b) {
            return a.item_id - b.item_id
        });
    };

    //Define translations modules
    //Translate general start page strings, shown on every page, before the player logs in
    var translate_startpage = function () {
        //Translate player counter
        document.getElementById('stat').innerHTML = document.getElementById('stat').innerHTML.replace('Players', TWCT.lang.players);
        //Contact link
        document.getElementById('imprint').getChildren()[0].innerHTML = TWCT.lang.contact;
    };
    //Translate the login (main) page, before the player logs in
    var translate_loginpage = function () {
        //Translate description
        document.getElementById('desc').innerHTML = TWCT.lang.discover_new_land;
        //Exchange register button
        document.getElementById('register').style['background-image'] = 'url("images/index/' + TWCT.locale + '/register.jpg")';

        //Translate login form
        //Check whether normal login or cookie login
        if (document.getElementById("howdy") == null) {
            //Normal login
            document.getElementById('name_area').getChildren() [0].innerHTML = TWCT.lang.character_name;
            document.getElementById('password_area').getChildren() [0].innerHTML = TWCT.lang.password;
            document.getElementsByClassName('set_cookie') [0].getChildren() [0].innerHTML = '<input name="set_cookie_checkbox" id="set_cookie_checkbox" type="checkbox">' + TWCT.lang.login_permanently;
            document.getElementById('lost_pw').getChildren() [0].innerHTML = TWCT.lang.change_password;
        } else {
            //Cookie login
            document.getElementById('del_cookies').getChildren()[0].innerHTML = TWCT.lang.delete_login_cookies;
        }


        //Translate screenshots
        document.getElementById('screenshot_text_1').innerHTML = TWCT.lang.screenshot_labels[0];
        document.getElementById('screenshot_text_2').innerHTML = TWCT.lang.screenshot_labels[1];
        document.getElementById('screenshot_text_3').innerHTML = TWCT.lang.screenshot_labels[2];
        //World select message
        document.getElementById('select_world_text').innerHTML = TWCT.lang.select_world;
        //Error login messages, therefore override login check function
        check_login = function () {
            var url = 'index.php?ajax=check_login';
            var jSonRequest = new Json.Remote(url, {
                method: 'post', onComplete: function (data) {
                    if (typeof data == 'string') {
                        //Inject translation
                        data = data.replace('The player does not exist', TWCT.lang.player_not_exist)
                            .replace('The password is wrong', TWCT.lang.wrong_password);
                        alert(data);
                    } else {
                        var el;
                        for (var i = 0; i < data.worlds.length; i++) {
                            el = $E('.world_button_passive_' + data.worlds[i]);
                            if (el != null) {
                                el.removeClass('world_button_passive_' + data.worlds[i]);
                                el.addClass('world_button_' + data.worlds[i]);
                            }
                        }

                        show_login(data.player_id, data.password, $('set_cookie_checkbox').checked);
                    }
                }
            }).send({name: $('name').value, password: $('password').value});

            return false;
        };
    };
    //Translate the choose world page, before the player logs in
    var translate_chooseworldpage = function () {
        document.getElementsByTagName('h2')[0].innerHTML = TWCT.lang.select_world_2;
        var table_headers = document.getElementsByTagName('th');
        table_headers[0].innerHTML = TWCT.lang.world;
        table_headers[1].innerHTML = TWCT.lang.start_date;
        table_headers[2].innerHTML = TWCT.lang.number_of_players;
        table_headers[3].innerHTML = TWCT.lang.description;

        var cells = document.getElementsByTagName('td');
        for (var i = 0; i < cells.length; i++)[
            cells[i].innerHTML = cells[i].innerHTML.replace('(Recommended)', '(' +
                                                            TWCT.lang.recommended + ')')
        ]
    };
    //Translate the register page, before the player logs in
    var translate_registerpage = function () {
        //Caption
        document.getElementById('caption').innerHTML = document.getElementById('caption')
            .innerHTML.replace('Sign up', TWCT.lang.sign_up_at).replace('change', TWCT.lang.change);

        //Register form
        document.getElementsByClassName('register_name_area') [0].innerHTML = TWCT.lang.user_name +
            '<br><input class="confirm_input" name="name" value=""' +
            ' onchange="checkInput(\'name\', this.value)" type="text">';
        document.getElementById('register_password_area').innerHTML = TWCT.lang.password +
            '<br><input class="confirm_input" id="password" ' +
            'name="password" value="" onchange="checkInput(\'password\', this.value)" type="password">';
        document.getElementById('register_password_confirm_area').innerHTML = TWCT.lang.confirm_password +
            '<br><input id="password_confirm" class="confirm_input" ' +
            'name="password_confirm" value="" onchange="checkPasswordConfirm(this.value)" type="password">';
        document.getElementById('register_agb_area').getChildren()[0].innerHTML = '<input name="agb" type="checkbox">'
            + TWCT.lang.accept_agb;
        document.getElementById('register_agb_area').getChildren()[1].innerHTML = '» ' + TWCT.lang.show;
        document.getElementsByClassName('register_submit_area')[0].getChildren()[0].value = TWCT.lang.sign_up;
        //Error messages, therefore overwrite check function
        checkInput = function (type, value) {
            var url = 'index.php?page=register&ajax=check_input';
            var jSonRequest = new Json.Remote(url, {
                method: 'post', onComplete: function (data) {
                    data = data.replace('The E-Mail is connected to another account already',
                                        TWCT.lang.errors.mail_already_taken)
                        .replace('Invalid E-Mail', TWCT.lang.errors.mail_invalid)
                        .replace('This name is already taken by another player',
                                 TWCT.lang.errors.name_already_taken)
                        .replace('Two consecutive spaces are not allowed', TWCT.lang.errors.name_has_double_spaces)
                        .replace('The name contains signs that are not allowed in this language version',
                                 TWCT.lang.errors.name_has_invalid_signs)
                        .replace('The name may not end or begin with a space', TWCT.lang.errors.name_has_spaces)
                        .replace('The user name must not be longer than 20 characters',
                                 TWCT.lang.errors.name_too_long)
                        .replace('The user name has to be at least 3 characters long',
                                 TWCT.lang.errors.name_too_short)
                        .replace('The OpenID is already in use', TWCT.lang.errors.oid_already_taken)
                        .replace('The password must not begin or end with a space',
                                 TWCT.lang.errors.password_has_spaces)
                        .replace('The password has to be at least 5 characters long',
                                 TWCT.lang.errors.password_too_short);
                    $(type + '_error').setText(data == 'OK' ? '' : data);
                }
            }).send({type: type, value: value});
        };
    };
    //Translate the change password page, before the player logs in
    var translate_changepwpage = function () {
        //TODO
    };
    //Translate the town forum
    var translate_townforum = function () {
        //TODO
    };
    //Translate the help
    var translate_help = function () {
        //TODO
    };

    //Translate general strings which do not belong to a specific ui element
    var translate_general = function () {
        //Apply attribute translations
        Character.attribute_titles = TWCT.lang.attribute_names;
        //Apply skill translations
        Character.skill_titles = TWCT.lang.skill_names;
        //Apply job translations
        for (var i = 1; i <= TWCT.lang.jobs.length; i++) {
            if (typeof JobList[i] === 'undefined') {
                continue;
            }
            JobList[i].name = TWCT.lang.jobs[i - 1].name;
        }
    };
    //Translate the game map
    var translate_map = function () {
        //Translate "You are here" on the map
        WMap.self_popup = new MousePopup(TWCT.lang.you_are_here, 250, {
            opacity: 0.9
        });
        //Redefine map marker drawer
        WMap.recalcMarker = function () {
            var coords;
            var area;
            var map_mc_pos = {
                x: parseInt(fast$('map_move_container').style.left, 10),
                y: parseInt(fast$('map_move_container').style.top, 10)
            };
            var pos_and_visarea_pos = function (tile) {
                tile_pos.x = parseInt(tile.style.left, 10);
                tile_pos.y = parseInt(tile.style.top, 10);
                tile_visarea_pos.x = tile_pos.x + map_mc_pos.x;
                tile_visarea_pos.y = tile_pos.y + map_mc_pos.y;
                return (tile_visarea_pos.x - 108 > WMap.xSize || tile_visarea_pos.x + 108 < 0 || tile_visarea_pos.y - 54 > WMap.ySize || tile_visarea_pos.y + 54 < 0);
            }.bind(WMap);
            var map_marker_imagemap = $('map_marker');
            map_marker_imagemap.empty();
            WMap.mapData.people.each(function (ppl) {
                tile = WMap.$(ppl.x, ppl.y, true);
                if (tile === null) {
                    return;
                }
                tile_pos = {};
                tile_visarea_pos = {};
                if (pos_and_visarea_pos(tile)) {
                    return;
                }
                coords = [
                    tile_visarea_pos.x + 84,
                    tile_visarea_pos.y + 26,
                    10
                ];
                area = new Element('area', {
                    'shape': 'circle',
                    'coords': coords.join(',')
                });
                if (ppl.popup === undefined) {
                    var popup_text = ppl.count + ' ' + TWCT.lang.players;
                    if (ppl.count == 1) {
                        popup_text = '1 ' + TWCT.lang.player;
                    }
                    ppl.popup = new MousePopup('<b>' + popup_text + '</b>', 250, {
                        opacity: 0.7
                    });
                }
                area.addMousePopup(ppl.popup);
                area.addEvent('mouseover', function (x, y) {
                    WMap.people_timer = WMap.loadPeople.delay(250, WMap, [
                        x,
                        y
                    ])
                }.pass([ppl.x,
                        ppl.y]));
                area.addEvent('mouseout', function (event) {
                    $clear(WMap.people_timer);
                });
                map_marker_imagemap.appendChild(area);
            }.bind(WMap));
            var tile = WMap.$(pos.x, pos.y);
            var tile_pos = {};
            var tile_visarea_pos = {};
            if (tile && !pos_and_visarea_pos(tile)) {
                var coords = [
                    tile_visarea_pos.x + 21,
                    tile_visarea_pos.y + 26,
                    10
                ];
                var area = new Element('area', {
                    'shape': 'circle',
                    'coords': coords.join(',')
                });
                area.style.border = '1px solid #f00';
                area.addMousePopup(WMap.self_popup);
                map_marker_imagemap.appendChild(area);
            }
            var insert_marker;
            for (var x in WMap.marker) {
                for (var y in WMap.marker[x]) {
                    for (var type in WMap.marker[x][y]) {
                        insert_marker = true;
                        var marker = WMap.marker[x][y][type];
                        var tile = WMap.$(x, y, true);
                        if (tile === null) {
                            continue;
                        }
                        tile_pos = {};
                        tile_visarea_pos = {};
                        if (pos_and_visarea_pos(tile)) {
                            continue;
                        }
                        switch (type) {
                            case 'tile':
                                break;
                            case 'job':
                                if (marker.data.visible) {
                                    coords = [
                                        tile_visarea_pos.x + 53,
                                        tile_visarea_pos.y + 27,
                                        20
                                    ];
                                    area = new Element('area', {
                                        'shape': 'circle',
                                        'coords': coords.join(','),
                                        'href': '#'
                                    });
                                    if (marker.data.popup === undefined) {
                                        if (typeof TWCT.lang.jobs[marker.data.job_id - 1].name !== 'undefined') {
                                            marker.data.popup = new MousePopup(TWCT.lang.jobs[marker.data.job_id - 1].name, 250, {
                                                opacity: 0.9
                                            });
                                        } else {
                                            marker.data.popup = new MousePopup(JobList[marker.data.job_id].name, 250, {
                                                opacity: 0.9
                                            });
                                        }
                                    }
                                    area.addMousePopup(marker.data.popup);
                                    area.addEvent('click', AjaxWindow.show.bind(AjaxWindow, 'job', {
                                        x: x,
                                        y: y
                                    }, x + '_' + y));
                                } else {
                                    insert_marker = false;
                                }
                                break;
                            case 'people':
                                break;
                            case 'town':
                                if (marker.data.town || Character.get_home_town() == null) {
                                    if (marker.data.town) {
                                        coords = [
                                            tile_visarea_pos.x + 53,
                                            tile_visarea_pos.y,
                                            tile_visarea_pos.x + 159,
                                            tile_visarea_pos.y + 54,
                                            tile_visarea_pos.x + 53,
                                            tile_visarea_pos.y + 108,
                                            tile_visarea_pos.x - 53,
                                            tile_visarea_pos.y + 54
                                        ];
                                    } else {
                                        coords = [
                                            tile_visarea_pos.x + 53,
                                            tile_visarea_pos.y + 53,
                                            20
                                        ];
                                    }
                                    area = new Element('area', {
                                        'shape': marker.data.town ? 'polygon' : 'circle',
                                        'coords': coords.join(','),
                                        'href': '#'
                                    });
                                    var popupTitle = TWCT.lang.found_town;
                                    if (marker.data.town) {
                                        if (marker.data.town.member || marker.data.town.npctown)
                                            popupTitle = marker.data.town.name;
                                        else
                                            popupTitle = TWCT.lang.ghost_town
                                    }
                                    if (marker.data.popup === undefined) {
                                        marker.data.popup = new MousePopup(popupTitle, 250, {
                                            opacity: 0.9
                                        });
                                    }
                                    area.addMousePopup(marker.data.popup);
                                    area.addEvent('click', AjaxWindow.show.bind(AjaxWindow, 'town', {
                                        x: x,
                                        y: y
                                    }, x + '_' + y));
                                } else {
                                    insert_marker = false;
                                }
                                break;
                        }
                        if (insert_marker) {
                            map_marker_imagemap.appendChild(area);
                        }
                    }
                }
            }
        };
        //Redefine map people name loader
        WMap.loadPeople = function (x, y) {
            WMap.people_request = new XHR({
                method: 'get'
            });
            WMap.people_request.addEvent('onSuccess', function (data) {
                var players_string = TWCT.lang.players;
                if (data.count == 1) {
                    players_string = TWCT.lang.player;
                }
                var ppl = WMap.mapData.people.getByXy(x, y);
                data = Json.evaluate(data);
                var ppl_xhtml = '<b>' + data.count + ' ' + players_string + ':</b><ul class="people_popup_list">';
                for (var i = 0; i < data.people.length; i++) {
                    ppl_xhtml += '<li>' + data.people[i] + '</li>';
                }
                if (data.count > 3) {
                    ppl_xhtml += '<li class="people_popup_list_more">' + 'Mehr...</li>';
                }
                ppl_xhtml += '</ul>';
                ppl.popup.setXHTML(ppl_xhtml);
            }.bind(WMap));
            WMap.people_request.send('game.php', 'window=map&ajax=get_people&x=' + x + '&y=' + y);
        };

        //Retrieve minimap legend
        var minimap_list = document.getElementById('minimap_list').getChildren();
        //Translate legend
        for (var i = 0; i < TWCT.lang.minimap_legend.length; i++) {
            minimap_list[i].getChildren()[0].innerHTML = TWCT.lang.minimap_legend[i];
        }

        //Update the minimap jobs
        WMinimap.updateJobs();

        //Translate first minimap select element
        document.getElementById('minimap_job_id').getChildren()[0].innerHTML = TWCT.lang.select_job;

        //Update map content to translations
        WMap.recalcMarker();
    };
    //Translate main game interface
    var translate_main_window = function () {
        //Translate money popups
        $('cash').addMousePopup(new MousePopup(TWCT.lang.cash_description, 250, {
            opacity: 0.9,
            width: '250px'
        }));
        $('deposit').addMousePopup(new MousePopup(TWCT.lang.bank_account_description, 250, {
            opacity: 0.9,
            width: '250px'
        }));
        //Translate map buttons
        $('footer_scroll_map_to_char').addMousePopup(new MousePopup(TWCT.lang.center_character));
        $('footer_scroll_map_to_home_town').addMousePopup(new MousePopup(TWCT.lang.center_map));
        $('footer_minimap_icon').addMousePopup(new MousePopup(TWCT.lang.minimap));
        $('footer_forum').addMousePopup(new MousePopup(TWCT.lang.forum));
        $('footer_help').addMousePopup(new MousePopup(TWCT.lang.help));
        $('footer_logout').addMousePopup(new MousePopup(TWCT.lang.logout));

        //Add own forum link
        document.getElementById('footer_forum').parentElement.href = TWCT.lang.forum_link;

        //Redefine energy redraw:
        Character.redraw_energy = function () {
            if (PremiumBoni.hasBonus('regen')) {
                $('energy_filler').setStyle('backgroundImage', 'url(images/character_bars/filler_bonus.png)');
                $('energy_bar').setStyle('backgroundImage', 'url(../images/character_bars/bars_bonus.png)');
            }
            $('energy_filler').setStyle('width', Character.calc_width(Character.energy, Character.max_energy));
            WEvent.trigger('energy', [
                Character.energy,
                Character.max_energy
            ]);
            if (Character.barPopups.energy === null) {
                Character.barPopups.energy = new MousePopup('', 250, {
                    opacity: 0.9
                });
                $('energy_bar').addMousePopup(Character.barPopups.energy);
            }
            Character.barPopups.energy.setXHTML('<b>' + TWCT.lang.energy + ':' + '</b> ' + Math.floor(Character.energy) + '/' + Character.max_energy);
        };
        //Redefine health redraw:
        Character.redraw_health = function () {
            $('health_filler').setStyle('width', Character.calc_width(Character.get_health(), Character.get_max_health()));
            WEvent.trigger('health', [
                Character.get_health(),
                Character.get_max_health()
            ]);
            if (Character.barPopups.health === null) {
                Character.barPopups.health = new MousePopup('', 250, {
                    opacity: 0.9
                });
                $('health_bar').addMousePopup(Chracter.barPopups.health);
            }
            Character.barPopups.health.setXHTML('<b>' + TWCT.lang.health + ':' + '</b> ' + Math.floor(Character.get_health()) + '/' + Character.get_max_health())
        };
        //Redefine experience redraw:
        Character.redraw_experience = function () {
            $('experience_filler').setStyle('width', Character.calc_width(Character.experience - Character.min_experience, Character.max_experience - Character.min_experience));
            WEvent.trigger('experience', [
                Character.experience - Character.min_experience,
                Character.max_experience - Character.min_experience
            ]);
            if (Character.barPopups.experience === null) {
                Character.barPopups.experience = new MousePopup('', 250, {
                    opacity: 0.9
                });
                $('experience_bar').addMousePopup(Character.barPopups.experience);
            }
            Character.barPopups.experience.setXHTML('<b>' + TWCT.lang.experience + ':' + '</b> ' + (Character.experience - Character.min_experience) + '/' + (Character.max_experience - Character.min_experience) + ' (<b>' + TWCT.lang.level + ' ' + Character.level + '</b>)');
        } //Redefine status refresh:

        Character.set_status = function (task) {
            if (!task) {
                $('current_task').setStyle('background-image', 'url(images/tasks/idle.png)');
                $('task_time').setStyle('display', 'none');
                $('current_task').innerHTML = 'Du machst gerade nichts.';
                return;
            }
            $('task_time').setStyle('display', 'block');
            var desc;
            if (task.type == 'job') {
                if (typeof TWCT.lang.jobs[task.data_obj.job_id - 1].name !== 'undefined') {
                    desc = TWCT.lang.tasks.job + ': ' + TWCT.lang.jobs[task.data_obj.job_id - 1].name + '.';
                } else {
                    desc = TWCT.lang.tasks[task.type] + ': ' + task.data_obj.title + '.';
                }
            } else {
                desc = TWCT.lang.tasks[task.type];
            }
            $('current_task').setStyle('background-image', 'url(images/tasks/' + task.type + '.png)');
            $('current_task').innerHTML = desc;
        };
        //Refresh bars
        Character.redraw_energy();
        Character.redraw_health();
        Character.redraw_experience();
        //Update status to translations
        Tasks.update_all_info();
    };

    //Translate graphical main menu by exchanging the picture
    var translate_main_menu = function () {
        //Retrieve all menu items
        var menu_items = document.getElementById('menus').getElementsByTagName('a');
        //Stores the fader element of each menu item
        var fader_element = null;
        //Exchange the graphics of all menu items
        var menus = ['character','skill','inventory','saloon','town','townforum','duel','ranking','premium','messages','reports','work','settings'];
        for (var i = 0; i < menu_items.length; i++) {
            if (!menus.includes(menu_items[i].parentElement.id.slice(5))){
                continue;
            }

            menu_items[i].style['background-image'] = 'url(' + TWCT.res.menu_image + ')';
            //Check for activated fader
            fader_element = menu_items[i].children[0];
            if (fader_element.style['background-image'] !== '') {
                //Fader activated, replace background image with translated image
                fader_element.style['background-image'] = 'url(' + TWCT.res.menu_image + ')';
            }
        }

        //Overwrite Fader in order to translate also the blue fader function
        Fader.init = function () {
            Fader.stopAll();
            for (var i = 0, len = Fader.buttons.length; i < len; ++i) {
                var el = $$('#menu_' + Fader.buttons[i] + ' span') [0];
                el.innerHTML = '';
                el.setStyle('display', 'block');
                el.style.background = 'url(' + TWCT.res.menu_image + ') ' + Fader.getPosition(Fader.buttons[i]);
                Fader.elements.push(el);
            }
            Fader.startAll();
        };
    };

    //Translate task queue
    var translate_task_queue = function () {
        //Redefine task queue html generation
        Tasks.generate_queue_xhtml = function (options) {
            if (Tasks.tasks.length == 0) {
                return false;
            }
            var now = new ServerDate();
            var table = new Element('table');
            var tbody = new Element('tbody');
            var first_row = new Element('tr');
            var second_row = new Element('tr');
            var seconds = 0;
            var first = true;
            Tasks.last_pos = pos;
            for (var i = 0; i < Tasks.tasks.length; i++) {
                var obj = Tasks.tasks[i];
                seconds += (obj.date_done.getTime() - obj.date_start.getTime()) / 1000;
                if (obj.type == 'way') {
                    continue;
                }
                var image_div = new Element('div', {
                    styles: {
                        position: 'relative',
                        'height': '63px',
                        'width': '87px'
                    }
                });
                var image = new Element('img', {
                    title: '',
                    src: obj.data_obj.task_image,
                    styles: {
                        position: 'absolute',
                        left: 0,
                        top: 0
                    }
                });
                //Translate task popup
                var popup_title = obj.data_obj.title;
                switch (obj.type) {
                    case 'job':
                        popup_title = TWCT.lang.jobs[obj.data_obj.job_id - 1].name;
                        break;
                    case 'pray':
                        popup_title = TWCT.lang.praying;
                        break;
                    case 'sleep':
                        popup_title = TWCT.lang.sleeping;
                        break;
                }
                image.addMousePopup(new MousePopup(popup_title, 250, {
                    opacity: 0.9
                }));
                var cancel = new Element('img', {
                    title: '',
                    src: 'images/icons/cancel.png',
                    styles: {
                        position: 'absolute',
                        top: '36px',
                        left: '60px',
                        cursor: 'pointer'
                    }
                });
                cancel.addMousePopup(new MousePopup(TWCT.lang.cancel, 100, {
                    opacity: 0.9
                }));
                cancel.addEvent('click', Tasks.cancel_task.bind(Tasks, obj.queue_id, obj.data_obj));
                image.injectInside(image_div);
                cancel.injectInside(image_div);
                var td = new Element('td');
                image_div.injectInside(td);
                td.injectInside(first_row);
                var td = new Element('td');
                if (first) {
                    seconds = (obj.date_done.getTime() - now.getTime()) / 1000;
                    first = false;
                }
                seconds = seconds < 0 ? 0 : seconds;
                seconds = seconds.formatDuration();
                td.innerHTML = seconds;
                seconds = 0;
                td.injectInside(second_row);
            }
            if (Tasks.need_automation() && !options.hide_info_full) {
                var hasAutomation = (PremiumBoni.hasBonus('automation'));
                var full_text = new Element('td', {
                    rowspan: '2',
                    styles: {
                        'font-size': '13px',
                        'font-weight': 'bold',
                        'color': 'green',
                        'width': '300px'
                    }
                });
                full_text.innerHTML = TWCT.lang.automation_advert;
                full_text.injectInside(first_row);
            }
            first_row.injectInside(tbody);
            second_row.injectInside(tbody);
            tbody.injectInside(table);
            return table;
        } //Redefine task points calculation

        Tasks.reload_task_points = function (task_skills, malus, window) {
            var popups = [];
            return function () {
                var skills = Character.skills;
                var bonus_total = Character.bonus.skills_total;
                var sum = 0;
                var xhtml;
                for (var i = 0; i < 5; i++) {
                    var skill = task_skills[i];
                    xhtml = Character.skill_titles[skill].bold();
                    var val;
                    if (bonus_total[skill]) {
                        val = skills[skill] + bonus_total[skill];
                        xhtml += ': ' + val;
                        xhtml += ' (' + skills[skill] + ' + <span style="color:#00d;">' + bonus_total[skill] + '</span>)';
                    } else {
                        val = skills[skill];
                        xhtml += ': ' + val;
                    }
                    if (popups[i] == undefined) {
                        popups[i] = new MousePopup(xhtml, 250, {
                            opacity: 0.9
                        });
                        $E('.task_skill_' + i, window).addMousePopup(popups[i]);
                    } else {
                        popups[i].setXHTML(xhtml);
                    }
                    $E('.task_skill_' + i, window).setAttribute('src', skill_box_src(skill, val, bonus_total[skill]));
                    sum += val;
                }
                $E('.task_sum', window).setAttribute('src', 'img.php?type=task_points&subtype=plus&value=' + sum);
                $E('.task_task_points', window).setAttribute('src', 'img.php?type=task_points&subtype=equal&value=' + (sum - malus));
                $E('.task_control', window).setStyle('display', (sum - malus) > 0 ? 'block' : 'none');
                $E('.task_low_points', window).setStyle('display', (sum - malus) > 0 ? 'none' : 'block');
                $E('.missing_task_point_notice', window).innerHTML = s(TWCT.lang.missing_labor_points, Math.abs((sum - malus) - 1));
            };
        }
    };

    var translate_employer_window = function () {
        Saloon.request_employer_update = function (employer) {
            new Ajax('game.php?window=building_saloon&ajax=get_saloon_employer', {
                method: 'post',
                data: {
                    employer: employer
                },
                onComplete: function (data) {
                    data = Json.evaluate(data);

                    var page = document.createElement('div');
                    page.innerHTML = data;

                    //Translate employer name and text
                    page.getElementsByTagName('h2')[0].parentNode.innerHTML = '<h2>' +
                        TWCT.lang.employers[employer].name + '</h2>' + TWCT.lang.employers[employer].text;

                    //Translate table headers
                    var headers = page.getElementsByClassName('questlog_header');

                    //Translate only when exsts
                    for (var i = 0; i < headers.length; i++) {
                        headers[i].innerHTML = headers[i].innerHTML.replace('Open quests', TWCT.lang.open_quests)
                            .replace('Completed quests', TWCT.lang.completed_quests);
                    }

                    //Iterate through all quests and translate them
                    var quest_entries = page.getElementsByClassName('questlog_entrie');

                    for (var i = 0; i < quest_entries.length; i++) {
                        //Get quest link
                        var quest_link = quest_entries[i].getChildren()[0];
                        //Retrieve quest id
                        var quest_id = parseInt((/\{quest_id:(\d+)\}/g).exec(quest_link.href)[1]);
                        //Get quest translation from id
                        var quest_translation = basic.findQuestTranslationByID(quest_id);
                        //Check whether translation available
                        if (quest_translation == null) {
                            continue;
                        }
                        quest_link.innerHTML = quest_translation.questline + ' (' + quest_translation.name + ')';
                    }


                    $('tab_saloon').innerHTML = page.innerHTML;
                }.bind(this)
            }).request();
        };
    };

    //Translate all game items
    var translate_items = function () {
        //Redefine item popup
        ItemPopup.prototype.getXHTML = function () {
            var item = this.item_obj;
            //Retrieve item translation object for item
            var item_translation = basic.findItemTranslationByID(item.item_id);
            //Check whether a translation was found
            if (item_translation == null) {
                //Translation not found, take original strings into translation object
                item_translation = {
                    item_id: item.id,
                    name: item.name,
                    description: item.description
                };
            }
            var xhtml = '<table class="item_popup"><tr>';
            xhtml += '<td style="padding-right:10px;"><div class="';
            var type_class;
            switch (item.type) {
                case 'right_arm':
                case 'left_arm':
                case 'body':
                    type_class = 'item_popup_arms_bg';
                    break;
                case 'head':
                case 'foot':
                case 'animal':
                    type_class = 'item_popup_head';
                    break;
                case 'neck':
                case 'yield':
                    type_class = 'item_popup_yield';
                    break;
                default:
                    throw new Error('no such type');
                    break;
            }
            xhtml += type_class;
            xhtml += '"><img src="' + item.image + '" alt="" />';
            xhtml += '</div></td>';
            xhtml += '<td><span class="item_popup_title">';
            xhtml += item_translation.name;
            xhtml += '</span>';
            xhtml += '<span class="item_popup_type">';
            var item_type_title = TWCT.lang.item_slots;
            var item_sub_title = TWCT.lang.weapon_types;
            xhtml += item_translation.description ? item_translation.description : item_type_title[item.type] + ((item.sub_type !== undefined) ? ' (' + item_sub_title[item.sub_type] + ')' : '');
            xhtml += '</span>';
            if (item.damage) {
                xhtml += '<span class="item_popup_damage">' + item.damage.damage_min + '-' + item.damage.damage_max + ' ' + TWCT.lang.damage + '<br /></span><br />';
            }
            if ($type(item.bonus.attributes) == 'object') {
                xhtml += '<span class="item_popup_bonus_attr">';
                for (var attr in item.bonus.attributes) {
                    var attr_title = Character.attribute_titles[attr];
                    xhtml += (item.bonus.attributes[attr] > 0 ? '+' : '') + item.bonus.attributes[attr] + ' ' + attr_title + '<br />';
                }
                xhtml += '</span><br />';
            }
            if ($type(item.bonus.skills) == 'object') {
                xhtml += '<span class="item_popup_bonus_skill">';
                for (var skill in item.bonus.skills) {
                    var skill_title = Character.skill_titles[skill];
                    xhtml += (item.bonus.skills[skill] > 0 ? '+' : '') + item.bonus.skills[skill] + ' ' + skill_title + '<br />';
                }
                xhtml += '</span><br />';
            }
            if (item.speed) {
                xhtml += '<span class="item_popup_bonus">';
                xhtml += TWCT.lang.speed + ': ' + (item.speed <= 1 ? '+' : '') + Math.round(Character.default_speed / (Character.default_speed * item.speed) * 100 - 100) + '%<br />';
                xhtml += '</span><br />';
            }
            xhtml += '<span class="item_popup_trader_price">' + TWCT.lang.purchase_price + ':' + ' ' + item.price + ' $</span><br />';
            xhtml += '<span class="item_popup_trader_price">' + TWCT.lang.sales_price + ':' + ' ' + item.sell_price + ' $</span>';
            if (item.level)
                xhtml += '<span class="item_popup_level' + (Character.level < item.level ? ' item_popup_level_too_low' : '') + '">' + TWCT.lang.requires_level + ' ' + item.level + '</span>';
            else
                xhtml += '<br />';
            xhtml += '<br /></td></tr></table>';
            return xhtml;
        };
    };

    //Translate the character window
    var translate_character_window = function (params, data) {

        //Fetch and wrap page content
        var page = document.createElement('div');
        page.innerHTML = data.page;

        var stats = page.getElementsByTagName('th');

        //Translate stats
        for (var i = 0; i < stats.length; i++) {
            stats[i].innerHTML = TWCT.lang.character_stats[i];
        }

        return {
            page: page.innerHTML,
            js: data.js
        };
    };

    //Translate the skill window
    var translate_skill_window = function (params, data) {
        //Fetch and wrap page content
        var page = document.createElement('div');
        page.innerHTML = data.page;

        //Translate reskill overview
        page.getElementsByClassName('skill_content_reskill_title')[0].innerHTML =
            TWCT.lang.change_attributes_and_skills;
        page.getElementsByClassName('skill_icon_reskill_current')[0].innerHTML =
            TWCT.lang.costs_current + ':';
        page.getElementsByClassName('skill_icon_reskill_attribute')[0].innerHTML =
            TWCT.lang.costs_attributes + ':';
        page.getElementsByClassName('skill_icon_reskill_skill')[0].innerHTML =
            TWCT.lang.costs_skills + ':';

        //Translate skill overview
        page.getElementsByClassName('skill_content_reskill_title')[1].innerHTML =
            TWCT.lang.assign_attributes_and_skills;
        page.getElementsByClassName('skill_icon_reskill_attribute')[1].innerHTML =
            TWCT.lang.skilled_attributes + ':';
        page.getElementsByClassName('skill_icon_reskill_skill')[1].innerHTML =
            TWCT.lang.skilled_skills + ':';

        //Skill button labels
        var label_cells = page.getElementsByTagName('td');
        label_cells[2].innerHTML = TWCT.lang.attributes;
        label_cells[3].innerHTML = TWCT.lang.skills;

        //Buttons
        var all_images = page.getElementsByTagName('img');
        for (var i = all_images.length - 1; i >= 0; i--) {
            if (all_images[i].id == 'skill_reskill_confirm_button') {
                basic.replaceWestButton(all_images[i], TWCT.lang.confirm);
            } else if (all_images[i].id == 'skill_reskill_cancel_button') {
                basic.replaceWestButton(all_images[i], TWCT.lang.cancel);
            }
        }

        //Translate attributes
        var table_cells = page.getElementsByClassName('skill_attribute_skills')[0].getElementsByTagName('td');
        table_cells[1].innerHTML = TWCT.lang.attribute_names['strength'];
        table_cells[3].innerHTML = TWCT.lang.attribute_names['flexibility'];
        table_cells[5].innerHTML = TWCT.lang.attribute_names['dexterity'];
        table_cells[7].innerHTML = TWCT.lang.attribute_names['charisma'];

        return {
            page: page.innerHTML,
            js: data.js
        };
    };

    //Translate the inventory window
    var translate_inventory_window = function (params, data) {
        //Fetch and wrap page content
        var page = document.createElement('div');
        page.innerHTML = data.page;

        //Translate heading
        page.getElementsByTagName('h2')[0].innerHTML = TWCT.lang.backpack;

        return {
            page: page.innerHTML,
            js: data.js
        };
    };

    //Translate the job window
    var translate_job_window = function (params, data) {

        //Retrieve job id
        var job = WMap.mapData.jobs.obj[params.x][params.y].job_id;

        //Fetch and wrap page content
        var page = document.createElement('div');
        page.innerHTML = data.page;

        //Job name
        page.getElementsByTagName('h2') [0].innerHTML = TWCT.lang.jobs[job - 1].name;
        //Job description
        page.getElementsByClassName('jobDescription') [0].innerHTML = TWCT.lang.jobs[job - 1].desc;
        //Retrieve skill display headings to translate them afterwards
        var skill_display_headings = page.getElementsByClassName('job_points_div') [0].getElementsByTagName('th');
        //Used skill points
        skill_display_headings[0].innerHTML = TWCT.lang.used_skill_points;
        //Difficulty
        skill_display_headings[1].innerHTML = TWCT.lang.difficulty;
        //Labor points
        skill_display_headings[2].innerHTML = TWCT.lang.labor_points;
        //Current assignments
        page.getElementsByClassName('task_queue_container') [0].children[0].innerHTML = TWCT.lang.current_assignments;
        //Translate notice that labor points are missing
        //Retrieve labor points
        var labor_points = parseInt(page.getElementsByClassName('task_task_points') [0].getAttribute('alt'));
        //Translate job warning (not enough labor points)
        page.getElementsByClassName('missing_task_point_notice') [0].innerHTML = TWCT.lang.missing_labor_points.replace('%1', (labor_points) * ( -1) + 1);
        var small_warning = page.getElementsByClassName('missing_task_point_notice') [0].parentElement;
        small_warning.innerHTML = small_warning.innerHTML.replace('To work on a job you need at least' +
                                                                  ' one labor point.', TWCT.lang.at_least_one_labor_point);
        //Translate job attributes in javascript using regex
        //Wages
        data.js = data.js.replace(/MousePopup\('<strong>Wages:.*'/g, 'MousePopup(\'' +
                                  TWCT.lang.wage_description + '\'');
        //Experience
        data.js = data.js.replace(/MousePopup\('<strong>Experience:.*'/g, 'MousePopup(\'' +
                                  TWCT.lang.experience_description + '\'');
        //Luck
        data.js = data.js.replace(/MousePopup\('<strong>Luck:.*'/g, 'MousePopup(\'' +
                                  TWCT.lang.luck_description + '\'');
        //Danger
        data.js = data.js.replace(/MousePopup\('<strong>Danger:.*'/g, 'MousePopup(\'' +
                                  TWCT.lang.danger_description + '\'');
        //Motivation
        data.js = data.js.replace(/MousePopup\('<strong>Motivation:.*'/g, 'MousePopup(\'' +
                                  TWCT.lang.motivation_description + '\'');

        //Sum of the 5 Skills
        data.js = data.js.replace(/MousePopup\('<strong>Sum of the 5 Skills:.*'/g, 'MousePopup(\'' +
                                  TWCT.lang.skill_sum_description + '\'');
        //Difficulty
        data.js = data.js.replace(/MousePopup\('<strong>Difficulty of the job:.*'/g, 'MousePopup(\'' +
                                  TWCT.lang.difficulty_description + '\'');
        //Labor points
        data.js = data.js.replace(/MousePopup\('<strong>Labor points:.*'/g, 'MousePopup(\'' +
                                  TWCT.lang.labor_points_description + '\'');

        //Product find chance
        data.js = data.js.replace(/MousePopup\('The probability to find the item\<br \/\>within 30 minutes of work is\D*/g, 'MousePopup(\'' +
                                  TWCT.lang.product_find_chance);


        //Container for starting job
        var begin_work_elements = page.getElementsByClassName('start_div')[0].getChildren();
        //Begin work
        begin_work_elements[0].innerHTML = TWCT.lang.begin_work;
        //Table elements for starting job
        var begin_work_table_elements = begin_work_elements[3].getElementsByTagName('td');
        //Distance
        begin_work_table_elements[0].innerHTML = TWCT.lang.distance;
        //Duration
        begin_work_table_elements[3].innerHTML = TWCT.lang.duration;

        //Work time
        if (page.getElementsByTagName('select').length > 0) {
            var work_time_options = page.getElementsByTagName('select')[0].getChildren();
            for (var i = 0; i < work_time_options.length; i++) {
                work_time_options[i].innerHTML = TWCT.lang.work_time[i];
                work_time_options[i].label = TWCT.lang.work_time[i];
            }
        }


        //Start button
        var imgs = page.getElementsByTagName('img');
        for (var i = 0; i < imgs.length; i++) {
            //Look for the image with the concerning id
            if (imgs[i].id == 'button_start_task') {
                basic.replaceWestButton(imgs[i], TWCT.lang.ok);
            }
        }

        return {
            page: page.innerHTML,
            js: data.js
        };
    };


    //Translate saloon window
    var translate_saloon_window = function (params, data) {
        //Fetch and wrap page content
        var page = document.createElement('div');
        page.innerHTML = data.page;

        //Translate side bar
        page.getElementsByTagName('a')[0].innerHTML = TWCT.lang.saloon;
        page.getElementsByTagName('a')[1].innerHTML = TWCT.lang.questbook;

        return {
            page: page.innerHTML,
            js: data.js
        };
    };
    //Translate quest window
    var translate_quest_window = function (params, data) {
        //Fetch and wrap page content
        var page = document.createElement('div');
        page.innerHTML = data.page;

        //Translate buttons
        var images = page.getElementsByTagName('img');
        for (var i = images.length - 1; i >= 0; i--) {
            switch (images[i].id) {
                case 'button_quest_accept':
                    basic.replaceWestButton(images[i], TWCT.lang.accept_quest);
                    break;
                case 'button_quest_finish':
                    basic.replaceWestButton(images[i], TWCT.lang.finish_quest);
                    break;
                case 'button_quest_cancel':
                    basic.replaceWestButton(images[i], TWCT.lang.cancel_quest);
                    break;
            }
        }

        //Look up the regarding quest
        var quest = basic.findQuestTranslationByID(params.quest_id);

        //Check for null (quest not found) - if so, don't change anything

        if (quest == null) {
            return {
                page: page.innerHTML,
                js: data.js
            }
        }

        //Quest found, continue with the translation
        //Retrieve quest content
        var quest_content = page.getElementsByTagName('div')[0];
        //Get employer's image source
        var employer_src = page.getElementsByClassName('shadow_content')[0].getChildren()[0].src;
        //Retrieve employer name
        quest.employer = employer_src.substring(employer_src.lastIndexOf("/") + 1, employer_src.lastIndexOf(".png"));

        //Change title
        page.getElementsByTagName('h3')[0].innerHTML = quest.questline + ' (' + quest.name + ')';
        //Build up quest sring
        var quest_string = '<strong>' + TWCT.lang.employers[quest.employer].name + ':<\/strong> ';
        quest_string += quest.text;
        quest_string += '<br\/><br\/><strong>' + TWCT.lang.target + ':<\/strong> ';
        quest_string += quest.target;

        //Check whether there is a hint
        if (quest.hint != null && quest.hint != '') {
            quest_string += '<br\/><br\/><strong>' + TWCT.lang.hint + ':<\/strong> ';
            quest_string += '<i>' + quest.hint + '</i>';
        }

        quest_string += '<br\/><br\/><strong>' + TWCT.lang.requires + ':';

        //Replace quest text with translation
        quest_content.innerHTML = quest_content.innerHTML.replace(/<strong>(.|\n)*<strong>Requires\:/g, quest_string);

        //Perform further translations:
        quest_content.innerHTML = quest_content.innerHTML.replace('(Done)', '(' + TWCT.lang.done + ')')
            .replace('Reward:', TWCT.lang.reward + ':');

        //Translate finish text
        data.js = data.js.replace(/\.completion_text = \'.+\'\;/g, '.completion_text = \'' + quest.finish_text + '\';');

        return {
            page: page.innerHTML,
            js: data.js
        };
    };


    //Performs AjaxWindow injection for handling AjaxWindow events
    var inject_ajax_window = function (handler_character_window, handler_skill_window, handler_inventory_window, handler_job_window, handler_saloon_window, handler_quest_window) {
        //Called when Ajax window has to be opened. Manages the request and calls a matching user function given as
        //parameter in order to manipulate the html or javascript data for translation purposes
        var inject_handler = function (name, params, data) {
            //data.page contains the html page
            //data.js contains the javascript
            if (typeof data.page === 'undefined') {
                return data;
            }
            switch (name) {
                case 'character':
                    if (handler_character_window == null) {
                        return data;
                    }
                    return handler_character_window(params, data);
                case 'skill':
                    if (handler_skill_window == null) {
                        return data;
                    }
                    return handler_skill_window(params, data);
                case 'inventory':
                    if (handler_inventory_window == null) {
                        return data;
                    }
                    return handler_inventory_window(params, data);
                case 'job':
                    if (handler_job_window == null) {
                        return data;
                    }
                    return handler_job_window(params, data);
                case 'building_saloon':
                    if (handler_saloon_window == null) {
                        return data;
                    }
                    return handler_saloon_window(params, data);
                case 'quest':
                    if (handler_quest_window == null) {
                        return data;
                    }
                    return handler_quest_window(params, data);
                default:
                    return data;
            }
            return data;
        };
        AjaxWindow.show = function (name, params, appendName) {
            var extendeName = name + ($defined(appendName) ? ('_' + appendName) : '');
            var params_str = '';
            if ($defined(params)) {
                for (var param in params) {
                    params_str += '&' + param + '=' + params[param];
                }
            }
            if (!AjaxWindow.windows[extendeName]) {
                var window_div = new Element('div', {
                    'id': 'window_' + extendeName,
                    'class': 'window'
                });
                AjaxWindow.windows[extendeName] = window_div;
                var xhtml = '<div class="window_borders">';
                xhtml += '<h2 id="window_' + extendeName + '_title" class="window_title" style="background-image:url(img.php?type=window_title&value=' + name + ');"><span>' + extendeName + '</span></h2>';
                xhtml += '<a href="javascript:AjaxWindow.closeAll();" class="window_closeall"></a><a href="javascript:AjaxWindow.toggleSize(\'' + extendeName + '\');" class="window_minimize"></a><a href="javascript:AjaxWindow.close(\'' + extendeName + '\');" class="window_close"></a>';
                xhtml += '<div id="window_' + extendeName + '_content" class="window_content"></div>';
                xhtml += '</div>';
                window_div.setHTML(xhtml);
                window_div.bringToTop();
                window_div.injectInside('windows');
                window_div.centerLeft();
                var window_title_div = $('window_' + extendeName + '_title');
                window_title_div.addEvent('dblclick', function () {
                    window_div.centerLeft();
                    window_div.setStyle('top', 133);
                });
                window_div.makeDraggable({
                    handle: window_title_div,
                    onStart: function () {
                    },
                    onComplete: function () {
                    }.bind(this)
                });
                window_div.addEvent('mousedown', window_div.bringToTop.bind(window_div, []));
                window_title_div.addEvent('mousedown', window_div.bringToTop.bind(window_div, []));
            } else {
                AjaxWindow.maximize(extendeName);
                AjaxWindow.windows[extendeName].bringToTop();
            }
            AjaxWindow.setThrobber(extendeName);
            new Ajax('game.php?window=' + name + params_str, {
                method: 'post',
                data: {},
                onComplete: function (data) {
                    data = Json.evaluate(data);
                    var modified = inject_handler(name, params, data);
                    if (modified.page != undefined) {
                        AjaxWindow.setJSHTML($('window_' + extendeName + '_content'), modified.page);
                    }
                    if (modified.js != undefined) {
                        eval(modified.js);
                    }
                }.bind(this)
            }).request();
        }
    };
    //Main function that performs all translations in row
    TWCT.run = function () {

        function translate_outgame() {
            //Check whether in forum
            if (document.location.pathname.indexOf('forum.php') !== -1) {
                //In forum
                translate_townforum();
            } else if (document.location.pathname.indexOf('help.php') !== -1) {
                translate_help();
            }
            else {

                //Not ingame and not in forum, translate general start page strings
                translate_startpage();

                // Check for current page for further translation
                if (document.location.search.indexOf('page=register&mode=choose_world') !== -1) {
                    //Choose world page
                    translate_chooseworldpage();
                }
                else if (document.location.search.indexOf('page=register') !== -1) {
                    //Register page
                    translate_registerpage();
                } else if (document.location.search.indexOf('page=change_password') !== -1) {
                    //Change password page
                    translate_changepwpage();
                }
                else {
                    //Login page
                    translate_loginpage();
                }
            }
        }

        function translate_ingame() {
            //Initialize ingame basics
            init();

            var handler_character_window = translate_character_window;
            var handler_skill_window = translate_skill_window;
            var handler_inventory_window = translate_inventory_window;
            var handler_job_window = translate_job_window;
            var handler_saloon_window = translate_saloon_window;
            var handler_quest_window = translate_quest_window;

            //Perform ajax window inject
            inject_ajax_window(handler_character_window, handler_skill_window, handler_inventory_window, handler_job_window, handler_saloon_window, handler_quest_window);
            //Perform translations
            translate_general();
            translate_map();
            translate_main_window();
            translate_main_menu();
            translate_task_queue();
            translate_employer_window();
            translate_items();
        }


        //Show throbber
        throbber.show();

        //Load translations from web server and wait until everything is loaded, then call back
        load_translations(function () {
            //Check whether ingame
            if (document.location.pathname.indexOf('game.php') == -1) {
                //Not ingame, start translation of start page etc.
                translate_outgame();
            } else {
                //Ingame, start ingame translation
                translate_ingame();
            }

            //Hide throbber
            window.setTimeout(function () {
                throbber.hide()
            }, 1000);
        });
    };
    //Finally execute the whole translation process, execute main function
    TWCT.run();
}
;
//Wait until DOM is ready and inject script
window.onload = function () {
    contentEval(TWCT);
};
