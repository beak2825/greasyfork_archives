// ==UserScript==
// @name TW Battle Stars
// @namespace TomRobert
// @author Dun (updated by Tom Robert)
// @description Who was the best fighter?
// @include https://*.the-west.*/game.php*
// @exclude https://classic.the-west.net*
// @version 1.0.14
//
// @history 1.0.14 Greek added
// @history 1.0.13 Czech and Slovak added, better updater
// @history 1.0.12 Polish added
// @history 1.0.11 Spanish added, compatibility with TW-Toolkit
// @history 1.0.10 English & German added, update function, many little improvements, ready for TW v2.33+
// @history 1.0.9 correction
// @history 1.0.8 formatage pour forum
// @history 1.0.7 ajout fenetre de resultat et compatibilité 2.0.5
// @history 1.0.6 passage en 2.0.4
// @history 1.0.5 compatibilite Chrome
// @history 1.0.4 bug maj
// @history 1.0.3 corrections
// @history 1.0.2 ajout stats globales
// @history 1.0.1 debut correction bugs
// @history 1.0.0 initial
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/16299/TW%20Battle%20Stars.user.js
// @updateURL https://update.greasyfork.org/scripts/16299/TW%20Battle%20Stars.meta.js
// ==/UserScript==
// translation:Dun(French),Tom Robert(English&German),pepe100(Spanish),Wojcieszy(Polish),Jamza(Czech&Slovak),Timemod Herkumo(Greek)
(function (fn) {
  var script = document.createElement('script');
  script.type = 'application/javascript';
  script.textContent = '(' + fn + ')();';
  document.body.appendChild(script);
  script.parentNode.removeChild(script);
})(function () {
  BS = {
    version: '1.0.14',
    name: 'Battle Stars',
    author: 'Dun (updated by Tom Robert)',
    minGame: '2.02',
    maxGame: Game.version.toString(),
    website: 'https://greasyfork.org/scripts/16299',
    langs: {
      fr: {
        language: 'French (français)',
        ApiGui: '',
        contact: 'Contact',
        hero: 'HÉROS',
        heroT: 'Taux du nombre de tirs ciblés (évités + reçus) par rapport aux PV de départ',
        rate: 'Taux',
        hitsTaken: 'Coups réçus',
        dodgedShots: 'Tirs esquivés',
        startHP: 'PV Début',
        survivor: 'SURVIVANT',
        survivorT: 'Celui qui finit avec le moins de pv',
        endHP: 'PV Fin',
        sniper: 'TIREUR D\'ÉLITE',
        sniperT: 'Pourcentage de tirs réussis par rapport aux total de tirs effectués',
        rateP: 'Taux(%)',
        hitCount: 'Coups réussis',
        missedShots: 'Tirs ratés',
        matrix: 'MATRIX',
        matrixT: 'Pourcentage de tirs évités par rapport aux total de tirs ciblés',
        terminator: 'TERMINATOR',
        terminatorT: 'Pourcentage du nombre de ko par rapport aux total des tirs touchés',
        KOs: 'Ko effectués',
        ranking: 'Classement',
        statsTitle: 'Statistiques de la bataille',
        designation: 'Désignation',
        attack: 'Attaque',
        defense: 'Défense',
        difference: 'Différence',
        statistics: 'Statistique',
        code: 'Code',
        goBack: 'Retour',
        starsTitle: 'Les Stars de la bataille',
        title: 'Titre',
        name: 'Nom',
        details: 'Détails',
        start: ' PV - Début: ',
        end: ' - Fin: ',
        damageTaken: ' - Dégâts reçus: ',
        avgHP: ' - Moy PV: ',
        total: 'Total ',
        average: 'Moyenne ',
        HP: 'PV',
        damage: 'Dégats',
        avgDamage: 'Dommages moyen',
        avgDamageMax: 'Dommages max moyen',
        avgWeaponDamage: 'Dommages arme moyen',
        avgWeaponDamageMax: 'Dommages arme max',
      },
      en: {
        language: 'None (English)',
        ApiGui: '',
        contact: 'Contact',
        hero: 'HERO',
        heroT: 'Number of shots (taken & dodged) per 1000 HPs',
        rate: 'Rate',
        hitsTaken: 'Hits taken',
        dodgedShots: 'Dodged shots',
        startHP: 'Start HP',
        survivor: 'SURVIVOR',
        survivorT: 'Survivor with the fewest HPs at the end of the fort battle',
        endHP: 'End HP',
        sniper: 'SNIPER',
        sniperT: 'Number of successful hits (percentage) in relation to all shots fired',
        rateP: 'Rate(%)',
        hitCount: 'Hit count',
        missedShots: 'Missed shots',
        matrix: 'MATRIX',
        matrixT: 'Number of doged shots (percentage) in relation to all shots (taken & dodged)',
        terminator: 'TERMINATOR',
        terminatorT: 'Number of KOs (percentage) in relation to the successful hits',
        KOs: 'KOs',
        ranking: 'Ranking',
        statsTitle: 'Fort battle statistics',
        designation: 'Designation',
        attack: 'Attack',
        defense: 'Defense',
        difference: 'Difference',
        statistics: 'Statistics',
        code: 'Code',
        goBack: 'Go back',
        starsTitle: 'The stars of the battle',
        title: 'Title',
        name: 'Name',
        details: 'Details',
        start: ' HP - Start: ',
        end: ' - End: ',
        damageTaken: ' - Damage taken: ',
        avgHP: ' - HP per fighter: ',
        total: 'Total ',
        average: 'Average ',
        HP: 'HP',
        damage: 'Damage',
        avgDamage: 'Average damage',
        avgDamageMax: 'Average max damage',
        avgWeaponDamage: 'Average weapon damage',
        avgWeaponDamageMax: 'Weapon damage max',
      },
      de: {
        language: 'German (Deutsch)',
        ApiGui: '',
        contact: 'Kontakt',
        hero: 'HERO',
        heroT: 'Anzahl Schüsse (eingesteckt & ausgewichen) pro 1000 LPs',
        rate: 'Quote',
        hitsTaken: 'Eingesteckte Treffer',
        dodgedShots: 'Schüssen ausgewichen',
        startHP: 'Anfangs-LP',
        survivor: 'SURVIVOR',
        survivorT: 'Überlebender mit den wenigsten LPs am Ende des Fortkampfes',
        endHP: 'LPs am Ende',
        sniper: 'SNIPER',
        sniperT: 'Anzahl erfolgreicher Treffer (in Prozent) im Verhältnis zu allen abgegebenen Schüssen',
        rateP: 'Quote(%)',
        hitCount: 'Trefferanzahl',
        missedShots: 'Fehlschüsse',
        matrix: 'MATRIX',
        matrixT: 'Anzahl Ausweicher (in Prozent) im Verhältnis zu allen Schüssen (eingesteckt & ausgewichen)',
        terminator: 'TERMINATOR',
        terminatorT: 'Anzahl erzielter KOs (in Prozent) im Verhältnis zu den erfolgreichen Treffern',
        KOs: 'KOs',
        ranking: 'Rangliste',
        statsTitle: 'Fortkampfstatistik',
        designation: 'Bezeichnung',
        attack: 'Angriff',
        defense: 'Verteidigung',
        difference: 'Differenz',
        statistics: 'Statistik',
        code: 'Code',
        goBack: 'Zurück',
        starsTitle: 'Die Stars des Kampfes',
        title: 'Titel',
        name: 'Name',
        details: 'Details',
        start: ' LP - Start: ',
        end: ' - Ende: ',
        damageTaken: ' - Unterschied: ',
        avgHP: ' - LP pro Mann: ',
        total: 'Total ',
        average: 'Durchschn. ',
        HP: 'LP',
        damage: 'Schaden',
        avgDamage: 'Durchschn. Schaden',
        avgDamageMax: 'Max Schaden',
        avgWeaponDamage: 'Durchschn Waffenschaden',
        avgWeaponDamageMax: 'Max Schaden der Waffe',
      },
      es: {
        language: 'Spanish (español)',
        ApiGui: 'Script Estadísticas de Batallas de Fuertes',
        contact: 'Contacto',
        hero: 'HÉROE',
        heroT: 'Tasa de tiros absorbidos (recibidos + eludidos) sobre los PV inicial',
        rate: 'Tasa',
        hitsTaken: 'Nº Aciertos recibidos',
        dodgedShots: 'Nº Eludidos',
        startHP: 'Vida Inicial',
        survivor: 'SUPERVIVIENTE',
        survivorT: 'El que termina con menos puntos de vida final',
        endHP: 'Vida Final',
        sniper: 'FRANCOTIRADOR',
        sniperT: 'Porcentaje de aciertos realizados sobre el total de tiros realizados (aciertos + fallos)',
        rateP: 'Tasa(%)',
        hitCount: 'Nº Aciertos',
        missedShots: 'Nº Fallos',
        matrix: 'MATRIX',
        matrixT: 'Porcentaje de tiros eludidos sobre el total de tiros recibidos',
        terminator: 'TERMINATOR',
        terminatorT: 'Porcentaje de Kos conseguidos sobre aciertos realizados',
        KOs: 'Kos efectuados',
        ranking: 'Classement',
        statsTitle: 'Estadísticas de la Batalla',
        designation: 'Estadística',
        attack: 'Ataque',
        defense: 'Defensa',
        difference: 'Diferencia',
        statistics: 'Estadística',
        code: 'Formato Foro',
        goBack: 'Volver',
        starsTitle: 'Las Estrellas de la Batalla',
        title: 'Titre',
        name: 'Nombre',
        details: 'Detalles',
        start: ' PV - Inicial: ',
        end: ' - Final: ',
        damageTaken: ' - Daño recibido: ',
        avgHP: ' - PV por luchador: ',
        total: 'Total ',
        average: 'Promedio ',
        HP: 'PV',
        damage: 'daño',
        avgDamage: 'Daño medio',
        avgDamageMax: 'Daño max. medio',
        avgWeaponDamage: 'Daño por arma medio',
        avgWeaponDamageMax: 'Daño por arma max. medio',
      },
      pl: {
        language: 'Polish (polski)',
        ApiGui: '',
        contact: 'Kontakt',
        hero: 'HERO',
        heroT: 'Liczba strzałów (przyjętych i unikniętych) na 1000HP',
        rate: 'Średnia',
        hitsTaken: 'Otrzymane ciosy',
        dodgedShots: 'Zadane ciosy',
        startHP: 'Start HP',
        survivor: 'SURVIVOR',
        survivorT: 'Osoba z największą ilością HP pod koniec bitwy',
        endHP: 'Końcowe HP',
        sniper: 'SNIPER',
        sniperT: 'Liczba celnych trafień (w procentach) w porównaniu do wszystkich',
        rateP: 'Średnia(%)',
        hitCount: 'Trafione strzały',
        missedShots: 'Chybione strzały',
        matrix: 'MATRIX',
        matrixT: 'Liczba uników (w procentach) w porównaniu do wszystkich otrzymanych strzałów',
        terminator: 'TERMINATOR',
        terminatorT: 'Liczba omdleń (w procentach) w porównaniu do trafionych strzałów',
        KOs: 'KOs',
        ranking: 'Ranking',
        statsTitle: 'Statystyki bitwy',
        designation: 'Nazwa',
        attack: 'Atak',
        defense: 'Obrona',
        difference: 'Różnica',
        statistics: 'Statystyki',
        code: 'Kod',
        goBack: 'Wróć',
        starsTitle: 'Gwiazdy podczas bitwy',
        title: 'Tytuł',
        name: 'Nick',
        details: 'Sczegóły',
        start: ' HP - Start: ',
        end: ' - Końcowe: ',
        damageTaken: ' - Obrażenia zadane: ',
        avgHP: ' - Średnie zadane obrażenia: ',
        total: 'Całkowity ',
        average: 'Średni ',
        HP: 'HP',
        damage: 'Obrażenia',
        avgDamage: 'Średnie obrażenia',
        avgDamageMax: 'Największe obrażenia',
        avgWeaponDamage: 'Średnia obrażeń broni',
        avgWeaponDamageMax: 'Największe obrażenia broni',
      },
      cs: {
        language: 'Czech (čeština)',
        ApiGui: '',
        contact: 'Kontakt',
        hero: 'HRDINA',
        heroT: 'Počet zásahů (obdržené & vyhnuté) na každých 1000 HP',
        rate: 'Rate',
        hitsTaken: 'Obdržené zásahy',
        dodgedShots: 'Vyhnuto zásahům',
        startHP: 'Zdraví na začátku',
        survivor: 'PŘEŽIVŠÍ',
        survivorT: 'Přežívší s nejnižším HP na konci bitvy',
        endHP: 'Zdraví na konci',
        sniper: 'SNIPER',
        sniperT: 'Počet úspěšných zásahů (v procentách) v porovnání ke všem výstřelům',
        rateP: 'Rate(%)',
        hitCount: 'Úspěšné zásahy',
        missedShots: 'Neúspěšné zásahy',
        matrix: 'MATRIX',
        matrixT: 'Počet vyhnutých zásahů (v procentách) v porovnání ku všem zásahům (obdrženým & vyhnutým)',
        terminator: 'TERMINATOR',
        terminatorT: 'Počet KO (v procentách) v porovnaní ke všem úspěšným zásahům',
        KOs: 'KO',
        ranking: 'Žebríček',
        statsTitle: 'Bitevní štatistiky',
        designation: 'Designace',
        attack: 'Útok',
        defense: 'Obrana',
        difference: 'Rozdíl',
        statistics: 'Štatistiky',
        code: 'Kód',
        goBack: 'Jdi spět',
        starsTitle: 'Hvězdy téhle bitvy',
        title: 'Název',
        name: 'Jméno',
        details: 'Detaily',
        start: ' HP - Začátek: ',
        end: ' - Konec: ',
        damageTaken: ' - Obdržené poškození: ',
        avgHP: ' - HP na jednoho útočníka: ',
        total: 'Celkově ',
        average: 'Průměr ',
        HP: 'HP',
        damage: 'Poškození',
        avgDamage: 'Průměrné poškození',
        avgDamageMax: 'Průměrné max poškození',
        avgWeaponDamage: 'Průměrné poškození zbraně',
        avgWeaponDamageMax: 'Max poškození zbraně',
      },
      sk: {
        language: 'Slovak (slovenčina)',
        ApiGui: '',
        contact: 'Kontakt',
        hero: 'HRDINA',
        heroT: 'Počet zásahov (obdržané a vyhnuté) na každých 1000 HP',
        rate: 'Rate',
        hitsTaken: 'Obdržané zásahy',
        dodgedShots: 'Vyhnuté zásahy',
        startHP: 'Zdravie na začiatku',
        survivor: 'PREŽIVŠÍ',
        survivorT: 'Preživší s najnižším hp na konci boja',
        endHP: 'Zdravie na konci',
        sniper: 'SNIPER',
        sniperT: 'Počet úspešných zásahov (v percentách) v porovnaní ku všetkým výstrelom',
        rateP: 'Rate(%)',
        hitCount: 'Úspešné zásahy',
        missedShots: 'Neúspešné zásahy',
        matrix: 'MATRIX',
        matrixT: 'Počet vyhnutých zásahov (v percentách) v porovnaní ku všetkým zásahom (obrdžaným & vyhnutým)',
        terminator: 'TERMINATOR',
        terminatorT: 'Počet KO (v percentách) v porovnaní ku všetkým úspešným hitom',
        KOs: 'KO',
        ranking: 'Rebríček',
        statsTitle: 'Štatistiky tohto boja',
        designation: 'Designácia',
        attack: 'Útok',
        defense: 'Obrana',
        difference: 'Rozdiel',
        statistics: 'Štatistiky',
        code: 'Kód',
        goBack: 'Choď späť',
        starsTitle: 'Hviezdy tohto boja',
        title: 'Názov',
        name: 'Meno',
        details: 'Detaily',
        start: ' HP - Začiatok: ',
        end: ' - Konec: ',
        damageTaken: ' - Obdržané poškodenie: ',
        avgHP: ' - HP na jedného útočníka: ',
        total: 'Celkové ',
        average: 'Priemer ',
        HP: 'HP',
        damage: 'Poškodenie',
        avgDamage: 'Priemerné poškodenie',
        avgDamageMax: 'Priemerné max poškodenie',
        avgWeaponDamage: 'Priemerné poškodenie zbrane',
        avgWeaponDamageMax: 'Max poškodenie zbrane',
      },
      el: {
        language: 'Greek (ελληνικά)',
        ApiGui: '',
        contact: 'Επικοινωνία',
        hero: 'HERO',
        heroT: 'Αριθμός βολών (ληφθείσες & αποφεύχθηκαν) ανά 1000 Ζωή',
        rate: 'Ποσοστό',
        hitsTaken: 'Λαμβανόμενα χτυπήματα',
        dodgedShots: 'Αποφυγή βολών',
        startHP: 'Αρχική ζωή',
        survivor: 'SURVIVOR',
        survivorT: 'Επιζών με την λιγότερη ζωή στο τέλος της μάχης του οχυρού',
        endHP: 'Ζωή στο τέλος της μάχης',
        sniper: 'SNIPER',
        sniperT: 'Αριθμός επιτυχημένων βολών (ποσοστό) σε σχέση με όλες τις βολές',
        rateP: 'Ποσοστό(%)',
        hitCount: 'Αριθμός χτυπημάτων',
        missedShots: 'Άστοχες βολές',
        matrix: 'MATRIX',
        matrixT: 'Αριθμός βολών (ποσοστό) σε σχέση με όλες τις βολές (ληφθείσες & αποφεύχθηκαν)',
        terminator: 'TERMINATOR',
        terminatorT: 'Αριθμός K.O. (ποσοστό) σε σχέση με τις επιτυχημένες βολές',
        KOs: 'K.O.',
        ranking: 'Κατάταξη',
        statsTitle: 'Στατιστικά μάχης οχυρού',
        designation: 'Περιγραφή',
        attack: 'Επίθεση',
        defense: 'Άμυνα',
        difference: 'Διαφορά',
        statistics: 'Στατιστικές',
        code: 'Κώδικας',
        goBack: 'Πίσω',
        starsTitle: 'Τα αστέρια της μάχης',
        title: 'Τίτλος',
        name: 'Όνομα παίκτη',
        details: 'Λεπτομέρειες',
        start: ' Ζωή - Αρχή: ',
        end: ' - Τέλος: ',
        damageTaken: ' - Λαμβάνουσα ζημιά: ',
        avgHP: ' - Ζωή ανά Παίκτη: ',
        total: 'Σύνολο ',
        average: 'Μέσος όρος ',
        HP: 'Ζωή',
        damage: 'Ζημιά',
        avgDamage: 'Μέση ζημιά',
        avgDamageMax: 'Μέση μέγιστη ζημία',
        avgWeaponDamage: 'Μέση ζημιά από όπλα',
        avgWeaponDamageMax: 'Μέγιστη ζημιά όπλου',
      },
    },
    tauxLim: {},
    formules: [],
    stars: [],
    attaquants: {},
    defenseurs: {},
  };
  var lg = BS.langs;
  BS.lang = lg[localStorage.getItem('scriptsLang')] ? localStorage.getItem('scriptsLang') : lg[Game.locale.substr(0, 2)] ? Game.locale.substr(0, 2) : 'en';
  BSlang = lg[BS.lang];
  function calcul(pType, pLibelle, pTexte, pForm, pHead, pVariables, pConstr, pTError, pCompare, pSort, pPos, pNull, pFloat) {
    this.globalHeader = new Array('#', BSlang.name);
    this.help = pTexte;
    this.type = pType;
    this.formule = pForm;
    this.header = pHead;
    this.libelle = pLibelle;
    this.variables = pVariables;
    this.sort = pSort;
    this.compare = pCompare;
    this.shouldBePos = pPos;
    this.shouldBeNull = pNull;
    this.contrainte = pConstr;
    this.isFloating = pFloat;
    this.testError = pTError;
    if (this.compare.indexOf('>') >  - 1) {
      this.limite = '0';
    } else {
      this.limite = '9999999999';
    }
  }
  calcul.prototype.init = function () {
    this.type = '';
    this.help = '';
    this.formule = '';
    this.header = '';
    this.libelle = '';
    this.variables = {};
    this.sort = true;
    this.shouldBePos = false;
    this.shouldBeNull = true;
    this.contrainte = '';
  };
  calcul.prototype.getLigne = function (val) {
    var cellules = {};
    var css = 'tw_blue';
    if (val.battle_type == 'attacker') {
      css = 'tw_red';
    }
    if ((!this.shouldBePos) || (this.shouldBePos && val[this.type] > 0)) {
      cellules.battle_num = val.ind;
      cellules.battle_nam = val.name;
      $.each(this.variables, function (ind, td) {
        var det;
        if (td.indexOf('.') > 0) {
          arTd = td.split('.');
          var cible = val;
          $.each(arTd, function (ind, value) {
            cible = cible[value];
          });
          det = cible;
        } else
          det = val[td];
        cellules['battle_cls' + ind] = det;
      });
      BS.tableClassement.buildRow('battlestat ' + css, cellules, withMod(this, val));
    }
  };
  calcul.prototype.getShortLigne = function (val) {
    try {
      var header = this.header;
      var lig = '';
      $.each(this.variables, function (ind, td) {
        var det;
        if (td.indexOf('.') > 0) {
          arTd = td.split('.');
          var cible = val;
          $.each(arTd, function (ind, value) {
            cible = cible[value];
          });
          det = cible; // val[arTd[0]][arTd[1]]
        } else {
          det = val[td];
        }
        // console.log( det );
        lig += header[ind] + ': ' + det + '|';
      });
      return lig;
    } catch (execption) {
      console.log(execption);
      return '';
    }
  };
  calcul.prototype.getHeader = function () {
    var title = '';
    var header = this.globalHeader.concat(this.header);
    var wdth = Math.round((74) / (this.header.length));
    $('#battle_stat', CemeteryWindow.DOM).attr('id', 'battle_statStar');
    $('#battle_statStar', CemeteryWindow.DOM).remove();
    $('#battle_stat', CemeteryWindow.DOM).text('details');
    BS.tableClassement = new west.gui.Table(false).setId('battle_stat');
    BS.tableClassement.createEmptyMessage('Battle Stars').addColumn('battle_num', {
      sortBy: 'name'
    }).addColumn('battle_nam', {
      sortBy: 'name'
    }).appendToThCell('head', 'battle_num', header[0], header[0]).appendToThCell('head', 'battle_nam', header[1], header[1]);
    $.each(this.header, function (ind, th) {
      BS.tableClassement.addColumn('battle_cls' + ind, {
        sortBy: th
      }).appendToThCell('head', 'battle_cls' + ind, th, th);
      BS.tableClassement.getCell('head', 'battle_cls' + ind).css('width', wdth + '%');
    });
    $('div.cemetery-content', CemeteryWindow.DOM).append(BS.tableClassement.getMainDiv());
    return title;
  };
  calcul.prototype.sortArray = function (arr) {
    var type = this.type;
    var sortable = this.sort;
    arr.sort(function (a, b) {
      var x = a[type];
      var y = b[type];
      if ($.isNumeric(x) && $.isNumeric(y)) {
        if (sortable) {
          return ((x < y) ?  - 1 : ((x > y) ? 1 : 0));
        } else {
          return ((x > y) ?  - 1 : ((x < y) ? 1 : 0));
        }
      } else {
        throw ('Tri impossible sur du non numerique');
      }
    });
    return arr;
  };
  calcul.prototype.getTaux = function (val) {
    if (eval(this.contrainte)) {
      taux = eval(this.formule);
    } else {
      taux = eval(this.testError);
    }
    if (this.isFloating) {
      taux = parseFloat(taux.toFixed(2));
    }
    return taux; // .toFixed(2);
  };
  var withMod = function (calc, val) {
    return function (row) {
      var wdth = Math.round((74) / (calc.header.length));
      $.each(calc.header, function (ind, td) {
        $('.battle_cls' + ind, row).css('width', wdth + '%');
      });
      row.attr('title', val.townname + ' - ' + val.weaponname + ' (' + val.weaponmindmg + '-' + val.weaponmaxdmg + ')');
      return row;
    };
  };
  var modifStarsRow = function (val) {
    return function (row) {
      $('.battle_tow', row).css('cursor', 'pointer').attr('title', BS.getFormule(val.type).help);
      $('.battle_nam', row).attr('title', val.obj.townname + ' - ' + val.obj.weaponname + ' (' + val.obj.weaponmindmg + '-' + val.obj.weaponmaxdmg + ')');
      $('.stat_dtl', row).attr('title', cellules.stat_dtl).css({
        'width': '62%',
        'text-align': 'left'
      });
      return row;
    };
  };
  BS.init = function () {
    BS.stars = [];
    BS.attaquants = {};
    BS.initFormule();
    BS.defenseurs = {};
  };
  BS.initFormule = function () {
    try {
      BS.formules = [];
      // pType, pForm, pHead, pLibelle, pVariables, pSort,
      // pPos,
      // pNull,pConstr, pTError,
      // pFloat
      BS.formules.push(new calcul('heros', BSlang.hero, BSlang.heroT, '(((val.takenhits + val.dodgecount) *1000) / (val.starthp))', [
            /* 'Rang', 'Nom', 'Taux', */
            BSlang.rate,
            BSlang.hitsTaken,
            BSlang.dodgedShots,
            BSlang.startHP
          ], [
            /* 'val.ind', 'val.obj.name', */
            'heros',
            'takenhits',
            'dodgecount',
            'starthp'
          ], '$.isNumeric( val.starthp) && ( val.starthp) > 0', '0', '>', false, false, false, true));
      /*
       * BS.formules.push(new calcul('roger', 'Roger
       * Rabbit', 'val.takenhits + val.dodgecount', [ 'Tirs',
       * 'Tirs reçus', 'Tir évité' ], [
       * 'roger','takenhits','dodgecount' ], ' val.takenhits +
       * val.dodgecount > 0', '0', '>', false, false, false,
       * true));
       */
      BS.formules.push(new calcul('survivant', BSlang.survivor, BSlang.survivorT, 'val.finishedhp', [
            BSlang.endHP
          ], [
            'finishedhp'
          ], '  val.finishedhp  > 0', '0', '<', true, true, false, false));
      BS.formules.push(new calcul('sniper', BSlang.sniper, BSlang.sniperT, '(val.hitcount / (val.hitcount + val.misscount))*100', [
            BSlang.rateP,
            BSlang.hitCount,
            BSlang.missedShots
          ], [
            'sniper',
            'hitcount',
            'misscount'
          ], '$.isNumeric(val.hitcount + val.misscount) && (val.hitcount + val.misscount) > 0', '0', '>', false, false, false, true));
      // Tirs esquivé / (Tirs esquivés + tirs reçus)
      BS.formules.push(new calcul('matrix', BSlang.matrix, BSlang.matrixT, 'parseFloat((( val.dodgecount / (val.takenhits + val.dodgecount))*100))', [
            BSlang.rateP,
            BSlang.dodgedShots,
            BSlang.hitsTaken
          ], [
            'matrix',
            'dodgecount',
            'takenhits'
          ], '$.isNumeric(val.dodgecount + val.takenhits) &&  (val.takenhits + val.dodgecount) > 0 &&   val.dodgecount  > 0', '0', '>', false, false, false, true));
      BS.formules.push(new calcul('headshot', BSlang.terminator, BSlang.terminatorT, '(val.ko_shots.length / val.hitcount)*100', [
            BSlang.rateP,
            BSlang.KOs,
            BSlang.hitCount
          ], [
            'headshot',
            'ko_shots.length',
            'hitcount'
          ], '$.isNumeric(val.hitcount) && val.hitcount > 0', '0', '>', false, false, false, true));
    } catch (e) {
      console.log(e);
    }
  };
  BS.getFormule = function (type) {
    for (var s = 0; s < this.formules.length; s++) {
      calc = this.formules[s];
      if (type == calc.type) {
        return calc;
      }
    }
    throw ('Aucune formule correspondante à ' + type);
  };
  BS.getAll = function (type) {
    var ligTot = '';
    $('#route', CemeteryWindow.DOM).text('details');
    var calc = this.getFormule(type);
    $('.info', CemeteryWindow.DOM).text('');
    $('.info', CemeteryWindow.DOM).append('<span>' + BSlang.ranking + ' ' + calc.libelle + '</span><span style="font-size:12px;"><BR/><i>' + calc.help + '</i></span>');
    var stars = calc.sortArray(CemeteryWindow.currentStats);
    var header = calc.getHeader();
    var shunt = 0;
    $.each(stars, function (ind, stat) {
      if (calc.shouldBePos && stat[type] <= 0) {
        shunt++;
      }
      stat.ind = (ind + 1) - shunt;
      calc.getLigne(stat);
    });
  };
  BS.getStatByPerso = function (name) {
    for (var s = 0; s < this.stars.length; s++) {
      val = this.stars[s];
      if (name == val.name) {
        return val;
      }
    }
  };
  BS.getLigne = function (stat, index) {
    if (!isDefined(stat)) {
      return '';
    }
    var type = stat.type;
    var nom = stat.name;
    var val = stat.obj;
    var calc = this.getFormule(type);
    var css = 'tw_blue';
    if (val.battle_type == 'attacker') {
      css = 'tw_red';
    }
    cellules = {};
    cellules.battle_tow = '<span onclick="javascript:BS.getAll(\'' + type + '\')">' + calc.libelle + '</span>';
    cellules.battle_nam = nom;
    cellules.stat_dtl = calc.getShortLigne(val);
    BS.table.buildRow('battlestat ' + css, cellules, modifStarsRow(stat));
  };
  BS.addStyle = function () {
    var css = '.window_Stats .window_inside { width:630px;height:380 position:absolute; left:5px; top:2px;-webkit-user-select: text !important; -khtml-user-select: text !important; -moz-user-select: text !important; -ms-user-select: text !important; user-select: text !important;height:270px; }' +
      '.window_Stats .window_footer { text-align:right;} ' +
      '.window_Stats .cell_stat { width:200px;font-weight:800;text-shadow:1px 0 0 white; } ' +
      '.window_Stats .cell_att { width:120px; text-align:center;} ' +
      '.window_Stats .cell_def { width:120px;text-align:center; } ' +
      '.window_Stats .cell_dif { width:120px; text-align:center;} ' +
      '.window_Stats .tbody .cell_stat { padding-left:6px; text-align:left;width:200px;font-weight:800;text-shadow:1px 0 0 white; } .window_Stats .tbody .row { left:0px; }' +
      '.window_Stats .tbody .cell_att { text-align:center; color:#8A0000;width:120px;font-weight:800;text-shadow:1px 0 0 white; }' +
      '.window_Stats .tbody .cell_def { text-align:center; color:#00008A;width:120px;font-weight:800;text-shadow:1px 0 0 white; }' +
      '.window_Stats .tbody .cell_dif { text-align:center;width:120px;font-weight:800;text-shadow:1px 0 0 white; }' +
      '.zone {-webkit-user-select: text !important; -khtml-user-select: text !important; -moz-user-select: text !important; -ms-user-select: text !important; user-select: text !important;height:270px; }';
    if (!$('#STAT_BDF_CSS').length) {
      $('<style id="STAT_BDF_CSS" type="text/css" >' + css + '</style>').appendTo('head');
    }
  };
  BS.openWindow = function (original) {
    var statWindow = wman.open('window_Stats', BSlang.statsTitle).setSize(700, 400);
    $('.window_Stats').css('left', '10px').css('top', '25px');
    var table_window = new west.gui.Table();
    table_window.appendTo($('<div class="window_inside"></div>').appendTo(statWindow.getContentPane())).addColumns(['cell_stat',
        'cell_att',
        'cell_def',
        'cell_dif']).appendToCell('head', 'cell_stat', BSlang.designation).appendToCell('head', 'cell_att', BSlang.attack).appendToCell('head', 'cell_def', BSlang.defense).appendToCell('head', 'cell_dif', BSlang.difference).appendRow();
    var verif = '<form><textarea style=\'height: 250px;width: 650px;\'>[code]' + BSlang.statistics + '\t\t\t' + BSlang.attack + '\t\t' + BSlang.defense + '\t\t' + BSlang.difference + '\n--------------------------------------------------------------------------\n';
    $.each(BS.results, function (ind, val) {
      try {
        var cssStr = '';
        var dif = 0;
        var att = parseFloat(val.attack);
        var def = parseFloat(val.defend);
        if (att > val.defend) {
          cssStr = '#8A0000';
          dif = (att - def).toFixed(2);
        } else {
          cssStr = '#00008A';
          dif = (def - att).toFixed(2);
        }
        verif += val.titre + att + '\t\t' + def + '\t\t' + dif + '\n';
        table_window.appendToCell( - 1, 'cell_stat', val.titre.trim()).appendToCell( - 1, 'cell_att', '<div>' + att + '</div>').appendToCell( - 1, 'cell_def', '<div>' + def + '</div>').appendToCell( - 1, 'cell_dif', '<div style="color:' + cssStr + ';">' + dif + '</div>').appendRow();
      } catch (e) {
        console.log(val);
        console.log(e);
      }
    });
    verif += '[/code]</textarea></form>';
    var affButton = new west.gui.Button(BSlang.code, function () {
        var cur = $('.window_inside').html();
        if (cur.indexOf('[code]') >  - 1) {
          BS.openWindow();
        } else {
          $('.window_inside').html(verif);
          BS.current = cur;
          affButton.setCaption(BSlang.goBack);
        }
      });
    $('<div class="window_footer"></div>').appendTo(statWindow.getContentPane()).append(affButton.getMainDiv());
    // 	$('.window_footer').css('text-align:right;')
    //statWindow.getContentPane().append(table_window.getMainDiv());
  };
  BS.createStarsTable = function () {
    $('.info', CemeteryWindow.DOM).text(BSlang.starsTitle);
    BS.table = new west.gui.Table(false).setId('battle_stat');
    BS.table.createEmptyMessage('BattleStars').addColumn('battle_tow', {
      sortBy: 'name'
    }).addColumn('battle_nam', {
      sortBy: 'name'
    }).addColumn('stat_dtl', {
      sortBy: 'starthp'
    }).appendToThCell('head', 'battle_tow', BSlang.title, BSlang.title).appendToThCell('head', 'battle_nam', BSlang.name, BSlang.name).appendToThCell('head', 'stat_dtl', BSlang.details, BSlang.details);
    BS.table.getCell('head', 'stat_dtl').css({
      'width': '62%',
      'text-align': 'left'
    });
    $('#route', CemeteryWindow.DOM).remove();
    $('.cemetery-content', CemeteryWindow.DOM).append('<div id="route" style="display:none">global</div>').append(BS.table.getMainDiv());
    $('.footer', CemeteryWindow.DOM).empty();
    var titleAtt = BSlang.attack + BSlang.start +
      BS.original.startAttPV +
      BSlang.end +
      BS.original.finishedAttPV +
      BSlang.damageTaken +
      (BS.original.startAttPV - BS.original.finishedAttPV) + BSlang.avgHP + BS.original.moyatt.toFixed(2);
    var titleDef = BSlang.defense + BSlang.start +
      BS.original.startDefPV +
      BSlang.end +
      BS.original.finishedDefPV +
      BSlang.damageTaken +
      (BS.original.startDefPV - BS.original.finishedDefPV) + BSlang.avgHP + BS.original.moydef.toFixed(2);
    $('.footer', CemeteryWindow.DOM).append('<span title="' + titleAtt + '" class="tw_red text_bold">' + titleAtt + '</span>');
    $('.footer', CemeteryWindow.DOM).append('<br><span title="' + titleDef + '" class="tw_blue text_bold">' + titleDef + '</span>');
    $('.footer', CemeteryWindow.DOM).addClass('zone');
    $('.cemetery-content', CemeteryWindow.DOM).addClass('zone');
  };
  BS.calculStars = function () {
    var attaquer = {};
    var defenseurs = {};
    BS.results = [
    ];
    BS.original.countAtt = 0;
    BS.original.countDef = 0;
    BS.original.startDefPV = 0;
    BS.original.finishedDefPV = 0;
    BS.original.startAttPV = 0;
    BS.original.finishedAttPV = 0;
    BS.original.degAtt = 0;
    BS.original.degDef = 0;
    BS.original.moyatt = 0;
    BS.original.moydef = 0;
    BS.original.att = {};
    BS.original.def = {};
    BS.original.att.dodgecount = 0;
    BS.original.att.hitcount = 0;
    BS.original.att.maxdamage = 0;
    BS.original.att.avg_damage = 0;
    BS.original.att.misscount = 0;
    BS.original.att.takenhits = 0;
    BS.original.att.weaponmaxdmg = 0;
    BS.original.att.weaponmindmg = 0;
    BS.original.def.dodgecount = 0;
    BS.original.def.hitcount = 0;
    BS.original.def.maxdamage = 0;
    BS.original.def.avg_damage = 0;
    BS.original.def.misscount = 0;
    BS.original.def.takenhits = 0;
    BS.original.def.weaponmaxdmg = 0;
    BS.original.def.weaponmindmg = 0;
    var countDef = 0;
    $.each(CemeteryWindow.currentStats, function (ind, val) {
      if (val.battle_type == 'attacker') {
        BS.original.startAttPV += val.starthp;
        BS.original.finishedAttPV += val.finishedhp;
        BS.original.degAtt += val.totalcauseddamage;
        BS.original.att.dodgecount += val.dodgecount;
        BS.original.att.hitcount += val.hitcount;
        BS.original.att.avg_damage += val.avg_damage;
        BS.original.att.maxdamage += val.maxdamage;
        BS.original.att.misscount += val.misscount;
        BS.original.att.takenhits += val.takenhits;
        BS.original.att.weaponmaxdmg += val.weaponmaxdmg;
        BS.original.att.weaponmindmg += val.weaponmindmg;
        BS.original.countAtt++;
      } else {
        BS.original.startDefPV += val.starthp;
        BS.original.finishedDefPV += val.finishedhp;
        BS.original.degDef += val.totalcauseddamage;
        BS.original.countDef++;
        BS.original.def.dodgecount += val.dodgecount;
        BS.original.def.hitcount += val.hitcount;
        BS.original.def.avg_damage += val.avg_damage;
        BS.original.def.maxdamage += val.maxdamage;
        BS.original.def.misscount += val.misscount;
        BS.original.def.takenhits += val.takenhits;
        BS.original.def.weaponmaxdmg += val.weaponmaxdmg;
        BS.original.def.weaponmindmg += val.weaponmindmg;
      }
      $.each(BS.formules, function (indStac, calc) {
        val[calc.type] = calc.getTaux(val);
        if (!calc.shouldBePos || (calc.shouldBePos && val[calc.type] > 0)) {
          if (val.battle_type == 'attacker') {
            if (!isDefined(attaquer[calc.type])) {
              attaquer[calc.type] = calc.limite;
            }
            if (eval(val[calc.type] + calc.compare + attaquer[calc.type])) {
              attaquer[calc.type] = val[calc.type];
              BS.attaquants[calc.type] = {
                'type': calc.type,
                'name': val.name,
                'obj': val
              };
            }
          } else {
            if (!isDefined(defenseurs[calc.type])) {
              defenseurs[calc.type] = calc.limite;
            }
            if (eval(val[calc.type] + calc.compare + defenseurs[calc.type])) {
              defenseurs[calc.type] = val[calc.type];
              BS.defenseurs[calc.type] = {
                'type': calc.type,
                'name': val.name,
                'obj': val
              };
            }
          }
        }
      });
    });
    BS.original.moyatt = BS.original.startAttPV / BS.original.countAtt;
    BS.original.moydef = BS.original.startDefPV / BS.original.countDef;
    BS.original.degAtt = BS.original.degAtt / BS.original.countAtt;
    BS.original.degDef = BS.original.degDef / BS.original.countDef;
    var fort = CemeteryWindow.fortId;
    BS.results.push({
      titre: BSlang.total + BSlang.startHP + '\t\t\t',
      attack: BS.original.startAttPV,
      defend: BS.original.startDefPV
    });
    BS.results.push({
      titre: BSlang.total + BSlang.endHP + '\t\t\t',
      attack: BS.original.finishedAttPV,
      defend: BS.original.finishedDefPV
    });
    BS.results.push({
      titre: BSlang.HP + ' ' + BSlang.difference + '\t\t\t',
      attack: (BS.original.startAttPV - BS.original.finishedAttPV),
      defend: (BS.original.startDefPV - BS.original.finishedDefPV)
    });
    BS.results.push({
      titre: BSlang.average + BSlang.HP + '\t\t\t',
      attack: BS.original.moyatt.toFixed(2),
      defend: BS.original.moydef.toFixed(2)
    });
    BS.results.push({
      titre: BSlang.average + BSlang.damage + '\t\t\t',
      attack: (BS.original.degAtt).toFixed(2),
      defend: (BS.original.degDef).toFixed(2)
    });
    BS.results.push({
      titre: BSlang.average + BSlang.dodgedShots + '\t\t\t',
      attack: (BS.original.att.dodgecount / BS.original.countAtt).toFixed(2),
      defend: (BS.original.def.dodgecount / BS.original.countDef).toFixed(2)
    });
    BS.results.push({
      titre: BSlang.average + BSlang.hitCount + '\t\t\t',
      attack: (BS.original.att.hitcount / BS.original.countAtt).toFixed(2),
      defend: (BS.original.def.hitcount / BS.original.countDef).toFixed(2)
    });
    BS.results.push({
      titre: BSlang.average + BSlang.missedShots + '\t\t\t',
      attack: (BS.original.att.misscount / BS.original.countAtt).toFixed(2),
      defend: (BS.original.def.misscount / BS.original.countDef).toFixed(2)
    });
    BS.results.push({
      titre: BSlang.average + BSlang.hitsTaken + '\t\t\t',
      attack: (BS.original.att.takenhits / BS.original.countAtt).toFixed(2),
      defend: (BS.original.def.takenhits / BS.original.countDef).toFixed(2)
    });
    BS.results.push({
      titre: BSlang.avgDamage + '\t\t\t',
      attack: (BS.original.att.avg_damage / BS.original.countAtt).toFixed(2),
      defend: (BS.original.def.avg_damage / BS.original.countDef).toFixed(2)
    });
    BS.results.push({
      titre: BSlang.avgDamageMax + '\t\t\t',
      attack: (BS.original.att.maxdamage / BS.original.countAtt).toFixed(2),
      defend: (BS.original.def.maxdamage / BS.original.countDef).toFixed(2)
    });
    BS.results.push({
      titre: BSlang.avgWeaponDamage + '\t\t\t',
      attack: ((BS.original.att.weaponmaxdmg + BS.original.att.weaponmindmg) / 2 / BS.original.countAtt).toFixed(2),
      defend: ((BS.original.def.weaponmaxdmg + BS.original.def.weaponmindmg) / 2 / BS.original.countDef).toFixed(2)
    });
    BS.results.push({
      titre: BSlang.avgWeaponDamageMax + '\t\t\t',
      attack: (BS.original.att.weaponmaxdmg / BS.original.countAtt).toFixed(2),
      defend: (BS.original.def.weaponmaxdmg / BS.original.countDef).toFixed(2)
    });
  };
  BS.launch = function () {
    BS.interval = setInterval(function () {
        try {
          var loading = false;
          if (!isDefined(CemeteryWindow)) {
            loading = false;
          } else {
            loading = true;
          }
          if (loading) {
            clearInterval(BS.interval);
            BS.inject();
          }
        } catch (e) {
          console.log(e);
          clearInterval(BS.interval);
        }
      }, 5000);
  };
  BS.inject = function () {
    BS.init();
    CemeteryWindow.showStatInit = function (battle_id, data) {
      var newfunction = CemeteryWindow.showStatInit;
      return function (battle_id, data) {
        try {
          newfunction.bind(this)(battle_id, data);
          $(this.window.getMainDiv()).children().find('.TWTStatButton').remove();
          $(this.window.getMainDiv()).find('div.tw2gui_window_content_pane').append('<span title="Battle Stars" onclick=\'BS.vasy()\'  class="TWTStatButton"><img ' +
            'style="position:absolute;top:15px;left:672px;width:15px;height:15px;padding:0px;border:0px;margin:0px;cursor:pointer;"' +
            ' src="/images/icons/achv_points.png" /></span>');
        } catch (e) {
          console.log(e);
        }
      };
    }
    ();
  };
  BS.vasy = function () {
    var route = $('#route', CemeteryWindow.DOM);
    if (route.length === 0 || (route.text() != 'global')) {
      if (route.length === 0) {
        BS.original = {};
        BS.original.saveTitle = $('.info', CemeteryWindow.DOM).text();
        BS.original.saveFoot = $('.footer', CemeteryWindow.DOM).html();
        $('#battle_stat', CemeteryWindow.DOM).attr('id', 'battle_statOri');
        $('#battle_statOri', CemeteryWindow.DOM).css('display', 'none');
        BS.calculStars();
        BS.openWindow();
      } else {
        if (route.text() == 'original') {
          $('#battle_stat', CemeteryWindow.DOM).attr('id', 'battle_statOri');
          $('#battle_statOri', CemeteryWindow.DOM).css('display', 'none');
          BS.openWindow();
        } else {
          $('#battle_stat', CemeteryWindow.DOM).attr('id', 'battle_statDetail');
          $('#battle_statDetail', CemeteryWindow.DOM).remove();
        }
      }
      BS.createStarsTable();
      $.each(BS.defenseurs, function (ind, star) {
        BS.getLigne(star, ind);
      });
      $.each(BS.attaquants, function (ind, star) {
        BS.getLigne(star, ind);
      });
    } else {
      route.text('original');
      $('.info', CemeteryWindow.DOM).text(BS.original.saveTitle);
      $('.footer', CemeteryWindow.DOM).html(BS.original.saveFoot);
      $('#battle_stat', CemeteryWindow.DOM).attr('id', 'battle_statStats');
      $('#battle_statStats', CemeteryWindow.DOM).remove();
      $('#battle_statOri', CemeteryWindow.DOM).attr('id', 'battle_stat');
      $('#battle_stat', CemeteryWindow.DOM).css('display', 'block');
    }
  };
  BS.addStyle();
  $(document).ready(function () {
    BS.launch();
  });
});
