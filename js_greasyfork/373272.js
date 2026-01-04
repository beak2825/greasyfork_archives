// ==UserScript==
// @name                [ALPHA] WME Validator
// @version             2019.02.02
// @description         This script validates a map area in Waze Map Editor, highlights issues and generates a very detailed report with wiki references and solutions
// @match               https://beta.waze.com/*editor*
// @match               https://www.waze.com/*editor*
// @exclude             https://www.waze.com/*user/*editor/*
// @grant               none
// @icon                https://raw.githubusercontent.com/WMEValidator/release/master/img/WV-icon96.png
// @namespace           a
// @homepage            https://www.waze.com/forum/viewtopic.php?f=819&t=76488
// @author              Andriy Berestovskyy <berestovskyy@gmail.com>
// @copyright           2013-2018 Andriy Berestovskyy
// @license             GPLv3
// @contributor         justins83
// @contributor         davidakachaos
// @downloadURL https://update.greasyfork.org/scripts/373272/%5BALPHA%5D%20WME%20Validator.user.js
// @updateURL https://update.greasyfork.org/scripts/373272/%5BALPHA%5D%20WME%20Validator.meta.js
// ==/UserScript==
/*
 * WME Validator uses Open Source GPLv3 license, i.e. you may copy,
 * distribute and modify the software as long as you track changes/dates
 * in source files. Any modifications to or software including
 * (via compiler) GPL-licensed code must also be made available under
 * the GPL along with build & install instructions.
 *
 * WME Validator source code is available on GitHub:
 * https://github.com/WMEValidator/
 *
 * For questions please use official forum:
 * https://www.waze.com/forum/viewtopic.php?f=819&t=76488
 *
 * Report bugs on GitHub Issues Tracker:
 * https://github.com/WMEValidator/validator/issues
 */

(function() {
var WV_VERSION = '2019.02.02';
var AS_PASSWORD = 'v1';
var WV_WHATSNEW = '' +
	'\nv2019.02.02:' +
	'\n- davidakachaos: new checks for venues' +
	'\n- davidakachaos: enabled/adjusted some checks for NL' +
	'\nv2018.11.01:' +
	'\n- davidakachaos: Added check for category OTHER' +
	'\n- davidakachaos: Added check for brand name in Gas Station name' +
	'\n- davidakachaos: Added check for phone number and URL' +
	'\n- davidakachaos: Added check for point vs area places' +
	'\n- davidakachaos: Added check for lock level for certain places' +
	'\n- davidakachaos: Monitor venue changes like segments' +
	'\n- davidakachaos: Added Dutch translations' +
	'\n' +
	'\nv2018.10.17:' +
	'\n- berestovskyy: minor fixes' +
	'\n' +
	'\nv2018.09.15:' +
	'\n- berestovskyy: add custom check variables: speedLimit,' +
	'\n  speedLimitAB, speedLimitBA and checkSpeedLimit' +
	'\n- berestovskyy: ignore speed limits issues on streets and ramps.' +
	'\n  Please use custom checks instead.' +
	'\n' +
	'\nv2018.09.13:' +
	'\n- davidakachaos: new checks for unverified/unset/wrong speed limit' +
	'\n- davidakachaos: enabled/adjusted some checks for NL';
var WV_LICENSE_VERSION = '1';
var WV_LICENSE = '' +
	'\nLICENSE:' +
	'\nWME Validator uses Open Source GPLv3 license,' +
	'\ni.e. you may copy, distribute and modify the software' +
	'\nas long as you track changes/dates in source files.' +
	'\nAny modifications to or software including (via compiler)' +
	'\nGPL-licensed code must also be made available' +
	'\nunder the GPL along with build & install instructions.' +
	'\n' +
	'\nWME Validator source code is available on GitHub:' +
	'\nhttps://github.com/WMEValidator/' +
	'\n' +
	'\nFor questions please use official forum:' +
	'\nhttps://www.waze.com/forum/viewtopic.php?f=819&t=76488' +
	'\n' +
	'\nReport bugs on GitHub Issues Tracker:' +
	'\nhttps://github.com/WMEValidator/validator/issues' +
	'\n' +
	'\nNote: WME Validator uses local storage to remember' +
	'\nyour choices and preferences.';
var GA_FORLEVEL = 1;
var GA_FORUSER = '!Dekis,*';
var GA_FORCOUNTRY = '';
var GA_FORCITY = '!Kraków,*';
var LIMIT_TOTAL = 2E4;
var MAX_CHECKS = 310;
var PFX_WIKI = 'https://www.waze.com/wiki/';
var PFX_PEDIA = 'https://wazeopedia.waze.com/wiki/';
var PFX_FORUM = 'https://www.waze.com/forum/viewtopic.php?';
var FORUM_HOME = 't=76488';
var FORUM_FAQ = 't=76488&p=666476#p666476';
var FORUM_LOCAL = 't=76488&p=661300#p661185';
var FORUM_CUSTOM = 't=76488&p=749456#p749456';
var _translations = {
  'US': {
	'.codeISO': 'US',
	'.country': 'United States',
	'27.enabled': true,
	'90.enabled': true,
	'106.enabled': true,
	'112.enabled': false,
	'150.enabled': true,
	'150.params': {'n': 2},
	'170.enabled': true,
	'170.params': {'regexp': '/^(?!(to) [^a-z])((S|N|W|E) )?[a-z]/'},
	'171.enabled': true,
	'171.solutionLink': 'W:Abbreviations_and_acronyms/USA#Standard_suffix_abbreviations',
	'171.params': {
	  'regexp':
		  '/((?!(\\bPhila|\\bPenna|.(\\bWash|\\bCmdr|\\bProf|\\bPres)|..(\\bAdm|\\bSte|\\bCpl|\\bMaj|\\bSgt|\\bRe[vc]|\\bR\\.R|\\bGov|\\bGen|\\bHon|\\bCpl)|...(\\bSt|\\b[JSD]r|\\bLt|\\bFt)|...(#| )[NEWSR])).{5}\\.|((?!(hila|enna|(\\bWash|\\bCmdr|\\bProf|\\bPres)|.(\\bAdm|\\bSte|\\bCpl|\\bMaj|\\bSgt|\\bRe[vc]|\\bR\\.R|\\bGov|\\bGen|\\bHon|\\bCpl)|..(\\bSt|\\b[JSD]r|\\bLt|\\bFt)|..(#| )[NEWSR])).{4}|(\\bhila|\\benna))\\.|((?!(ila|nna|(ash|mdr|rof|res)|(\\bAdm|\\bSte|\\bCpl|\\bMaj|\\bSgt|\\bRe[vc]|\\bR\\.R|\\bGov|\\bGen|\\bHon|\\bCpl)|.(\\bSt|\\b[JSD]r|\\bLt|\\bFt)|.(#| )[NEWSR])).{3}|\\b(ila|nna|ash|mdr|rof|res))\\.|((?!(la|na|(sh|dr|of|es)|(dm|te|pl|aj|gt|e[vc]|\\.R|ov|en|on|pl)|(\\bSt|\\b[JSD]r|\\bLt|\\bFt)|(#| )[NEWSR])).{2}|\\b(la|na|sh|dr|of|es|dm|te|pl|aj|gt|e[vc]|\\.R|ov|en|on|pl))\\.|(#|^)[^NEWSR]?\\.)|(((?!\\b(D|O|L)).|#|^)\'(?![sl]\\b)|(#|^)\'s|(?!\\b(In|Na)t).{3}\'l|(#|^).{0,2}\'l)|(Dr|St)\\.(#|$)|,|;|\\\\|((?!\\.( |#|$|R))\\..|(?!\\.( .|#.|$|R\\.))\\..{2}|\\.R(#|$|\\.R))|[Ee]x(p|w)y\\b|\\b[Ee]x[dn]\\b|Tunl\\b|Long Is\\b|Brg\\b/',
	  'problemEN': 'The street name has incorrect abbreviation, or character',
	  'solutionEN': 'Check upper/lower case, a space before/after the abbreviation and the accordance with the abbreviation table. Remove any comma (,), backslash (\\), or semicolon (;)'
	}
  },
  'UK': {'.codeISO': 'UK', '.country': 'United Kingdom', '1.enabled': false, '200.enabled': false},
  'SK': {
	'.codeISO': 'SK',
	'.country': 'Slovakia',
	'27.enabled': true,
	'52.enabled': true,
	'73.enabled': true,
	'90.enabled': true,
	'150.enabled': true,
	'150.problemLink': 'F:t=64980&p=572847#p572847',
	'150.params': {'n': 2},
	'151.enabled': true,
	'151.problemLink': 'F:t=64980&p=572847#p572847',
	'151.params': {'n': 2},
	'152.enabled': true,
	'152.problemLink': 'F:t=64980&p=572847#p572847',
	'152.params': {'n': 2},
	'170.enabled': true,
	'170.params': {'regexp': '/^(?!(exit) [^a-z])[a-z]/'}
  },
  'SG': {
	'.codeISO': 'SG',
	'.country': 'Singapore',
	'69.enabled': true,
	'73.enabled': true,
	'150.enabled': true,
	'150.params': {'n': 2},
	'151.enabled': true,
	'151.params': {'n': 2},
	'152.enabled': true,
	'152.params': {'n': 2}
  },
  'RU': {'.codeISO': 'RU', '.country': 'Russia', '77.enabled': false, '190.enabled': false},
  'PL': {
	'.codeISO': 'PL',
	'.country': 'Poland',
	'.author': 'Zniwek',
	'.updated': '2014-10-01',
	'.lng': 'PL',
	'city.consider': 'rozważ tę nazwę miasta:',
	'city.1': 'nazwa miasta jest za krótka',
	'city.2': 'rozwiń skrót',
	'city.3': 'uzupełnij skróconą nazwę',
	'city.4': 'uzupełnij nazwę miasta',
	'city.5': 'popraw wielkość liter',
	'city.6': 'sprawdź kolejność słów',
	'city.7': 'sprawdź skróty',
	'city.8a': 'dodaj nazwę państwa',
	'city.8r': 'usuń nazwę państwa',
	'city.9': 'sprawdź nazwę państwa',
	'city.10a': 'dodaj słowo',
	'city.10r': 'usuń słowo',
	'city.11': 'dodaj kod państwa',
	'city.12': 'identyczne nazwy, ale inne ID miasta',
	'city.13a': 'dodaj spację',
	'city.13r': 'usuń spację',
	'city.14': 'sprawdź numer',
	'props.skipped.title': 'Segment nie jest sprawdzony',
	'props.skipped.problem': 'Segment jest zmodyfikowany po 2014-05-01 I zablokowany dla Ciebie, więc Validator go nie sprawdził',
	'err.regexp': 'Błąd podczas parsowania opcji dla sprawdzenia #${n}:',
	'props.disabled': 'WME Validator jest wyłączony',
	'props.limit.title': 'Zgłoszono zbyt wiele problemów',
	'props.limit.problem': 'Zgłoszono zbyt wiele problemów, więc niektóre z nich mogą nie być pokazane',
	'props.limit.solution': 'Odznacz segment i zatrzymaj skanowanie. Następnie kliknij czerwony \'✘\', przycisk (Wyczyść raport)',
	'props.reports': 'raporty',
	'props.noneditable': 'Nie możesz edytować tego segmentu',
	'report.save': 'Zapisz ten raport',
	'report.list.andUp': 'i wyższe',
	'report.list.severity': 'Ważność:',
	'report.list.reportOnly': 'tylko w raporcie',
	'report.list.forEditors': 'Dla edytorów poziomu:',
	'report.list.forCountries': 'Dla państw:',
	'report.list.forStates': 'Dla stanów:',
	'report.list.forCities': 'Dla miast:',
	'report.list.params': 'Parametry do skonfigurowania w paczce językowej:',
	'report.list.params.set': 'Aktualna konfiguracja dla ${country}:',
	'report.list.enabled': '${n} sprawdzenia włączone dla',
	'report.list.disabled': '${n} sprawdzenia wyłączone dla',
	'report.list.total': 'There are ${n} sprawdzenia dostępne',
	'report.list.title': 'Pełna lista Sprawdzeń dla',
	'report.list.see': 'Zobacz',
	'report.list.checks': 'Ustawienia->O->Dostępne sprawdzenia',
	'report.list.fallback': 'Zasady Cofnięcia Lokalizacji:',
	'report.and': 'i',
	'report.segments': 'Liczba sprawdzonych segmentów:',
	'report.customs': 'Własne zaznaczone sprawdzenia (zielone/niebieskie):',
	'report.reported': 'Zaraportowane',
	'report.errors': 'błędy',
	'report.warnings': 'ostrzeżenia',
	'report.notes': 'notki',
	'report.contents': 'Zawartość:',
	'report.summary': 'Podsumowanie',
	'report.title': 'WME Validator - Raport',
	'report.share': 'by się Podzielić',
	'report.generated.by': 'wygenerowane przez',
	'report.generated.on': 'na',
	'report.source': 'Źródło raportu:',
	'report.filter.duplicate': 'duplikowane segmenty',
	'report.filter.streets': 'Ulice i Drogi Serwisowe',
	'report.filter.other': 'Pozostałe przejezdne/nieprzejezdne',
	'report.filter.noneditable': 'segmenty bez możliwości edycji',
	'report.filter.notes': 'notki',
	'report.filter.title': 'Filtruj:',
	'report.filter.excluded': 'są wyłączone z tego raportu.',
	'report.search.updated.by': 'zaktualizowane przez',
	'report.search.updated.since': 'zaktualizowane od',
	'report.search.city': 'z',
	'report.search.reported': 'zaraportowane jako',
	'report.search.title': 'Szukaj:',
	'report.search.only': 'tylko segmenty',
	'report.search.included': 'są zawarte w tym raporcie.',
	'report.beta.warning': 'Ostrzeżenie WME Beta!',
	'report.beta.text': 'Ten raport jest wygenerowany w wersji beta WME z permalinkami beta.',
	'report.beta.share': 'Proszę, nie dziel się raportem z tymi permalinkami!',
	'report.size.warning':
		'<b>Uwaga!</b><br>Ten raport ma ${n} znaków, więc <b>nie zmieści się</b> w jeden post na forum lub wiadomość prywatną.\n<br>Proszę dodaj <b>więcej filtrów</b>, żeby zmniejszyć długość raportu.',
	'report.note.limit': '* Info: było zbyt wiele zgłoszonych problemów, więc niektóre z nich nie są policzone w podsumowaniu.',
	'report.forum': 'Żeby zmotywować mnie do pracy nad skrpytem, zostaw komentarz w',
	'report.thanks': 'Dziękuję za używanie WME Validator!',
	'msg.limit.segments': 'Zbyt wiele segmentów.\n\nKliknij \'Pokaż raport\' żeby go przejrzeć, a potem\n',
	'msg.limit.segments.continue': 'kliknij \'▶\' (Start) by kontynuować.',
	'msg.limit.segments.clear': 'kliknij \'✘\' (Wyczyść) by wyczyścić raport.',
	'msg.pan.text': 'Przesuwaj mapę, by ją sprawdzić',
	'msg.zoomout.text': 'Oddal widok, by uruchomić WME Validator',
	'msg.click.text': 'Kliknij \'▶\' (Start), by sprawdzić widoczny obszar mapy',
	'msg.autopaused': 'autopauza',
	'msg.autopaused.text': 'Spauzowano automatycznie! Kliknij \'▶\' (Start) by kontynuować.',
	'msg.autopaused.tip': 'WME Validator wstrzymany automatycznie przy przesunięciu mapy lub skalowaniu okna',
	'msg.finished.text': 'Kliknij <b>\'Pokaż raport\'</b> by przejrzeć błędy',
	'msg.finished.tip': 'Kliknij przycisk \'✉\' (Podziel się), żeby umieścić raport na\nforum lub w prywatnej wiadomości',
	'msg.noissues.text': 'Ukończono! Nie znaleziono błędów!',
	'msg.noissues.tip': 'Spróbuj odznaczyć niektóre opcje filtrowania lub odpal WME Validator na innym obszarze!',
	'msg.scanning.text': 'Skanowanie! Koniec za ~ ${n} min',
	'msg.scanning.text.soon': 'Skanowanie! Koniec w ciągu minuty!',
	'msg.scanning.tip': 'Kliknij przycisk \'Pauza\' by wstrzymać lub \'■\' (Stop) by zatrzymać',
	'msg.starting.text': 'Start! Warstwy są wyłączone, by skanować szybciej!',
	'msg.starting.tip': 'Użyj przycisku \'Pauza\' by wstrzymać lub przycisku \'■\' by zatrzymać',
	'msg.paused.text': 'Wstrzymane! Kliknij przycisk \'▶\' (Start) by kontynuować.',
	'msg.paused.tip': 'Żeby zobaczyć raport, kliknij przycisk \'Pokaż raport\' (jeżeli dostępne)',
	'msg.continuing.text': 'Kontynuowanie!',
	'msg.continuing.tip': 'WME Validator zacznie ponownie z miejsca, gdzie włączono pauzę',
	'msg.settings.text': 'Kliknij <b>\'Wstecz\'</b>, by powrócić do głównego widoku',
	'msg.settings.tip': 'Kliknij przycisk \'Resetuj domyślne\' aby zresetować wszystkie ustawienia za jednym zamachem!',
	'msg.reset.text': 'Wszystkie opcje filtrowania i ustawienia zostały zresetowane do domyślnych',
	'msg.reset.tip': 'Kliknij przycisk \'Wstecz\', by powrócić do głównego widoku',
	'msg.textarea.pack':
		'To jest skrypt Greasemonkey/Tampermonkey. Tekst poniżej możesz skopiować i wkleić do <b>nowego pliku .user.js</b><br>lub <b>wkleić bezpośrednio</b> do Greasemonkey/Tampermonkey',
	'msg.textarea': 'Skopiuj proszę tekst poniżej, a następnie wklej do posta lub wiadomości prywatnej',
	'noaccess.text':
		'<b>Sorki,</b><br>Nie możesz tutaj użyć WME Validatora.<br>Sprawdź proszę <a target=\'_blank\' href=\'https://www.waze.com/forum/viewtopic.php?t=76488\'>wątek na forum</a><br> po więcej informacji.',
	'noaccess.tip': 'Sprawdź proszę wątek na forum po więcej informacji!',
	'tab.switch.tip.on': 'Kliknij by włączyć podświetlanie (Alt+V)',
	'tab.switch.tip.off': 'Kliknij by wyłączyć podświetlanie (Alt+V)',
	'tab.filter.text': 'filtruj',
	'tab.filter.tip': 'Opcje filtrowania raportu i podświetlonych segmentów',
	'tab.search.text': 'szukaj',
	'tab.search.tip': 'Zaawansowane opcje filtrowania, żeby załączyć tylko specyficzne segmenty',
	'tab.help.text': 'pomoc',
	'tab.help.tip': 'Potrzebujesz pomocy?',
	'filter.noneditables.text': 'Wyklucz <b>nieedytowalne</b> segmenty',
	'filter.noneditables.tip': 'Nie raportuj zablokowanych segmentów lub\nsegmentów poza Twoim obszarem edycji',
	'filter.duplicates.text': 'Wyklucz <b>duplikowane</b> segmenty',
	'filter.duplicates.tip': 'Nie pokazuj tego samego segmentu w różnych\nczęściach raportu\n* Info: ta opcja NIE WPŁYWA na podświetlanie',
	'filter.streets.text': 'Wyklucz <b>Ulice i Drogi Serwisowe</b>',
	'filter.streets.tip': 'Nie raportuj Ulic i Dróg Serwisowych',
	'filter.other.text': 'Wyklucz <b>Pozostałe przejezdne i nieprzejezdne</b>',
	'filter.other.tip': 'Nie raportuj Gruntowych, Wewnętrznych, Prywatnych Dróg\ni nieprzejezdnych segmentów',
	'filter.notes.text': 'Wyklucz <b>notki</b>',
	'filter.notes.tip': 'Raportuj tylko ostrzeżenia i błędy',
	'search.youredits.text': 'Załącz <b>tylko Twoje edycje</b>',
	'search.youredits.tip': 'Załącz tylko segmenty edytowane przez Ciebie',
	'search.updatedby.text': '<b>Zaktualizowane przez*:</b>',
	'search.updatedby.tip':
		'Załącz tylko segmenty edytowane przez ustalonego edytora\n* Info: ta opcja jest dostępna tylko dla CM\nTo pole wspiera:\n - lists: me, otherEditor\n - wildcards: world*\n - negation: !me, *\n* Info: możesz użyć \'me\' dla siebie samego',
	'search.updatedby.example': 'Przykład: me',
	'search.updatedsince.text': '<b>Zaktualizowane od:</b>',
	'search.updatedsince.tip': 'Załącz tylko segmenty edytowane od ustalonej daty\nformat daty Firefox: RRRR-MM-DD',
	'search.updatedsince.example': 'RRRR-MM-DD',
	'search.city.text': '<b>Nazwa miasta:</b>',
	'search.city.tip': 'Załącz tylko segmenty z ustaloną nazwą miasta\nTo pole wspiera:\n - lists: Paris, Meudon\n - wildcards: Greater * Area\n - negation: !Paris, *',
	'search.city.example': 'Przykład: !Paris, *',
	'search.checks.text': '<b>Zaraportowane jako:</b>',
	'search.checks.tip':
		'Załącz tylko segmenty zgłoszone jako ustalone\nTo pole zawiera:\n - severities: errors\n - check names: New road\n - check IDs: 200\nTo pole wspiera:\n - lists: 36, 37\n - wildcards: *roundabout*\n - negation: !unconfirmed*, *',
	'search.checks.example': 'Przykład: reverse*',
	'help.text':
		'<b>Tematy Pomocy:</b><br><a target="_blank" href="https://www.waze.com/forum/viewtopic.php?t=76488&p=666476#p666476">F.A.Q.</a><br><a target="_blank" href="https://www.waze.com/forum/viewtopic.php?t=76488">Zadaj swoje pytanie na forum</a><br><a target="_blank" href="https://www.waze.com/forum/viewtopic.php?t=76488&p=661300#p661185">Jak dopasować Validator pod swoje państwo</a><br><a target="_blank" href="https://www.waze.com/forum/viewtopic.php?t=76488&p=663286#p663286">Więcej o "Prawdopodobnie błędna nazwa miasta"</a>',
	'help.tip': 'Otwórz w nowej karcie przeglądarki',
	'button.scan.tip': 'Zacznij skanowanie aktualnego obszaru\n* Info: to może zająć kilka minut',
	'button.scan.tip.NA': 'Oddal widok by zacząć skanować aktualny obszar',
	'button.pause.tip': 'Wstrzymaj skanowanie',
	'button.continue.tip': 'Kontynuuj skanowanie obszaru mapy',
	'button.stop.tip': 'Zatrzymaj skanowanie i powróć do pozycji startowej',
	'button.clear.tip': 'Wyczyść raport i cache segmentu',
	'button.clear.tip.red': 'Zbyt wiele zgłoszonych segmentów:\n 1. Kliknij \'Pokaż raport\' by go wygenerować.\n 2. Kliknij ten przycisk by wyczyścić raport i zacząć od nowa.',
	'button.report.text': 'Pokaż raport',
	'button.report.tip': 'Zatwierdź filtr i wygeneruj raport HTML w nowej karcie',
	'button.BBreport.tip': 'Podziel się raportem na forum Waze lub w prywatnej wiadomości',
	'button.settings.tip': 'Konfiguruj ustawienia',
	'tab.custom.text': 'własne',
	'tab.custom.tip': 'Ustawienia sprawdzeń zdefiniowanych przez użytkownika',
	'tab.settings.text': 'Ustawienia',
	'tab.scanner.text': 'skaner',
	'tab.scanner.tip': 'Ustawienia skanera mapy',
	'tab.about.text': 'o</span>',
	'tab.about.tip': 'Info o WME Validator',
	'scanner.sounds.text': 'Włącz dźwięki',
	'scanner.sounds.tip': 'Pikanie podczas skanowania',
	'scanner.sounds.NA': 'Twoja przeglądarka nie wspiera AudioContext',
	'scanner.highlight.text': 'Podświetl błędy na mapie',
	'scanner.highlight.tip': 'Podświetl zaraportowane błędy na mapie',
	'scanner.slow.text': 'Włącz sprawdzenia "slow"',
	'scanner.slow.tip': 'Włącza głęboką analizę mapy\n* Info: ta opcja może spowolnić proces skanowania',
	'scanner.ext.text': 'Raportuj zewnętrzne podświetlenia',
	'scanner.ext.tip': 'Raportuj segmenty podświetlone przez WME Toolbox lub WME Color Highlights',
	'custom.template.text': '<a target=\'_blank\' href=\'https://www.waze.com/forum/viewtopic.php?t=76488&p=749456#p749456\'>Własny szablon</a>',
	'custom.template.tip':
		'Rozszerzalny szablon zdefiniowanych sprawdzeń użytkownika.\n\nMożesz użyć następujących zmiennych:\nAdres:\n ${country}, ${state}, ${city}, ${street},\n ${altCity[index or delimeter]}, ${altStreet[index or delimeter]}\nWłasności segmentu:\n ${type}, ${typeRank}, ${toll}, ${direction}, ${elevation}, ${lock},\n     ${length}, ${ID}\nPomocniki:\n        ${drivable}, ${roundabout}, ${hasHNs},\n        ${Uturn}, ${deadEnd}, ${softTurns},\n     ${deadEndA}, ${partialA},\n ${deadEndB}, ${partialB}\nŁączność:\n     ${segmentsA}, ${inA}, ${outA}, ${UturnA},\n ${segmentsB}, ${inB}, ${outB}, ${UturnB}',
	'custom.template.example': 'Przykład ${street}',
	'custom.regexp.text': 'Własne <a target=\'_blank\' href=\'https://www.waze.com/forum/viewtopic.php?t=76488&p=749456#p749456\'>RegExp</a>',
	'custom.regexp.tip':
		'Wyrażenie regularne zdefiniowane przez użytkownika, by pasowało do szablonu.\n\nNiewrażliwe na wielkość liter: /regexp/i\nNegacja (nie pasujące): !/regexp/\nZapisz informacje debugowania w konsoli: D/regexp/',
	'custom.regexp.example': 'Przykład: !/.+/',
	'about.tip': 'Otwórz link w nowej karcie',
	'button.reset.text': 'Resetuj domyślne',
	'button.reset.tip': 'Przywróć opcje filtrowania i ustawienia na domyślne',
	'button.list.text': 'Dostępne sprawdzenia...',
	'button.list.tip': 'Wyświetl listę sprawdzeń dostępnych w WME Validatorze',
	'button.wizard.tip': 'Stwórz paczkę językową',
	'button.back.text': 'Powrót',
	'button.back.tip': 'Zamknij ustawienia i wróć do głównego widoku',
	'1.title': 'WME Toolbox: Rondo może powodować problemy',
	'1.problem': 'ID węzłów ronda nie są w kolejności',
	'1.solution': 'Stwórz rondo na nowo',
	'2.title': 'WME Toolbox: Pojedynczy segment',
	'2.problem': 'Segment ma niepotrzebne węzły',
	'2.solution': 'Uprość geometrię segmentu przez najechanie myszką i naciśnięcie przycisku "d"',
	'3.title': 'WME Toolbox: Blokada na 2 poziom',
	'3.problem': 'Segment jest podświetlony przez WME Toolbox. To nie jest problem',
	'4.title': 'WME Toolbox: Blokada na 3 poziom',
	'4.problem': 'Segment jest podświetlony przez WME Toolbox. To nie jest problem',
	'5.title': 'WME Toolbox: Blokada na 4 poziom',
	'5.problem': 'Segment jest podświetlony przez WME Toolbox. To nie jest problem',
	'6.title': 'WME Toolbox: Blokada na 5 poziom',
	'6.problem': 'Segment jest podświetlony przez WME Toolbox. To nie jest problem',
	'7.title': 'WME Toolbox: Blokada na 6 poziom',
	'7.problem': 'Segment jest podświetlony przez WME Toolbox. To nie jest problem',
	'8.title': 'WME Toolbox: Numery domów',
	'8.problem': 'Segment jest podświetlony przez WME Toolbox. To nie jest problem',
	'9.title': 'WME Toolbox: Segment z ograniczeniami czasowymi',
	'9.problem': 'Segment jest podświetlony przez WME Toolbox. To nie jest problem',
	'13.title': 'WME Color Highlights: Blokada edytora',
	'13.problem': 'Segment jest podświetlony przez WME Color Highlights. To nie jest problem',
	'14.title': 'WME Color Highlights: Płatna / Jednokierunkowa',
	'14.problem': 'Segment jest podświetlony przez WME Color Highlights. To nie jest problem',
	'15.title': 'WME Color Highlights: Ostatnio edytowane',
	'15.problem': 'Segment jest podświetlony przez WME Color Highlights. To nie jest problem',
	'16.title': 'WME Color Highlights: Ranga drogi',
	'16.problem': 'Segment jest podświetlony przez WME Color Highlights. To nie jest problem',
	'17.title': 'WME Color Highlights: Brak miasta',
	'17.problem': 'Segment jest podświetlony przez WME Color Highlights. To nie jest problem',
	'18.title': 'WME Color Highlights: Ograniczenie czasowe / Podświetlony typ drogi',
	'18.problem': 'Segment jest podświetlony przez WME Color Highlights. To nie jest problem',
	'19.title': 'WME Color Highlights: Brak nazwy',
	'19.problem': 'Segment jest podświetlony przez WME Color Highlights. To nie jest problem',
	'20.title': 'WME Color Highlights: Filtruj po mieście',
	'20.problem': 'Segment jest podświetlony przez WME Color Highlights. To nie jest problem',
	'21.title': 'WME Color Highlights: Filtruj po mieście (alt. miasto)',
	'21.problem': 'Segment jest podświetlony przez WME Color Highlights. To nie jest problem',
	'22.title': 'WME Color Highlights: Filtruj po edytorzer',
	'22.problem': 'Segment jest podświetlony przez WME Color Highlights. To nie jest problem',
	'23.solutionLink': 'W:Drogi',
	'23.title': 'Niepotwierdzona droga',
	'23.problem': 'Każdy segment musi mieć przynajmniej Państwo i Stan',
	'23.solution': 'Potwierdź drogę, aktualizując jej szczegóły',
	'24.title': 'Prawdopodobnie błędna nazwa miasta (tylko w raporcie)',
	'24.problem': 'Segment może zawierać błędną nazwę miasta',
	'24.solution': 'Rozważ zaproponowaną nazwę i użyj tego formularza do zmiany nazwy miasta',
	'25.title': 'Nieznana kierunkowość przejezdnej drogi',
	'25.problem': '\'Nieznana\' kierunkowość drogi, nie zapobiegnie wyznaczaniu tędy trasy',
	'25.solution': 'Ustaw kierunkowość drogi',
	'27.enabled': true,
	'27.problemLink': 'W:Drogi#Tory.2C_szyny',
	'27.title': 'Nazwa miasta na Torach',
	'27.problem': 'Nazwa miasta na Torach, szynach',
	'27.solution': 'Zaznacz pole \'brak\' przy nazwie miasta',
	'28.problemLink': 'W:Drogi#Wjazd.2Fzjazd_bezkolizyjny',
	'28.title': 'Nazwa ulicy na dwukierunkowym zjeździe',
	'28.problem': 'Jeśli zjazd jest nienazwany, wyświetli się nazwa docelowej drogi',
	'28.solution': 'Zmień nazwę ulicy na \'brak\'',
	'29.problemLink': 'W:Drogi#Rondo',
	'29.title': 'Nazwa ulicy na rondzie',
	'29.problem': 'W Waze nie nazywamy segmentów ronda',
	'29.solution': 'Zmień nazwę ulicy na \'brak\', a następnie dodaj punkt orientacyjny \'Węzeł drogowy\', żeby nazwać rondo',
	'34.title': 'Pusta nazwa alternatywna',
	'34.problem': 'Alternatywna nazwa ulicy jest pusta',
	'34.solution': 'Usuń pustą nazwę alternatywną ulicy',
	'35.title': 'Niezakończona droga',
	'35.problem': 'Waze nie poprowadzi z niezakończonego segmentu',
	'35.solution': 'Przesuń trochę segment, żeby pojawił się kończący węzeł',
	'36.title': 'Węzeł A: Niepotrzebny (slow)',
	'36.problem': 'Segmenty spotykające się w węźle A są identyczne',
	'36.solution': 'Wybierz węzeł A i naciśnij przycisk Delete, by połączyć segmenty',
	'37.title': 'Węzeł B: Niepotrzebny (slow)',
	'37.problem': 'Segmenty spotykające się w węźle B są identyczne',
	'37.solution': 'Wybierz węzeł B i naciśnij przycisk Delete, by połączyć segmenty',
	'38.title': 'Upłynął czas ograniczenia segmentu (slow)',
	'38.problem': 'Segment zawiera wygasłe ograniczenie',
	'38.solution': 'Kliknij \'Edytuj ograniczenia\' i usuń wygasłe ograniczenie',
	'39.title': 'Wygasłe ograniczenie skrętu (slow)',
	'39.problem': 'Segment ma skręt z wygasłym ograniczeniem',
	'39.solution': 'Kliknij ikonę zegara obok żółtej strzałki i usuń wygasłe ograniczenie',
	'41.title': 'Węzeł A: Odwrócona łączność przejezdnej drogi',
	'41.problem': 'Jeden ze skrętów prowadzi naprzeciw kierunkowi segmentu, w węźle A',
	'41.solution': 'Ustaw segment \'Dwukierunkowy\', zablokuj wszystkie skręty w węźle A i ponownie ustaw \'Jednokierunkowa (A→B)\'',
	'42.title': 'Węzeł B: Odwrócona łączność przejezdnej drogi',
	'42.problem': 'Jeden ze skrętów prowadzi naprzeciw kierunkowi segmentu, w węźle B',
	'42.solution': 'Ustaw segment \'Dwukierunkowy\', zablokuj wszystkie skręty w węźle A i ponownie ustaw \'Jednokierunkowa (B→A)\'',
	'43.title': 'Połączenie ze sobą',
	'43.problem': 'Segment łączy się sam ze sobą',
	'43.solution': 'Podziel segment na TRZY części',
	'46.title': 'SLOW: Brak wjazdu na węźle A',
	'46.problem': 'Przejezdny segment nie ma wjazdu na węźle A',
	'46.solution': 'Rozważ możliwość wjazdu na węźle A',
	'47.title': 'SLOW: Brak wjazdu na węźle B',
	'47.problem': 'Przejezdny segment nie ma wjazdu na węźle A',
	'47.solution': 'Rozważ możliwość wjazdu na węźle A',
	'48.solutionLink': 'W:Ronda#Poprawianie_rond_naniesionych_r.C4.99cznie',
	'48.title': 'Dwukierunkowy segment ronda',
	'48.problem': 'Segment ronda jest dwukierunkowy',
	'48.solution': 'Stwórz rondo od nowa',
	'50.solutionLink': 'W:Ronda#Poprawianie_rond_naniesionych_r.C4.99cznie',
	'52.enabled': true,
	'52.solutionLink': 'W:Tabela_skrótów',
	'52.title': 'Za długa nazwa ulicy',
	'52.problem': 'Nazwa przejezdnego segmentu jest dłuższa niż ${n} liter i nie jest Rampą',
	'52.solution': 'Consider an abbreviation for the street name according to this table',
	'52.params': {'n': 35},
	'57.enabled': true,
	'57.problemLink': 'W:Drogi#Wjazd.2Fzjazd_bezkolizyjny',
	'57.title': 'Nazwa miasta na nazwanym zjeździe',
	'57.problem': 'Nazwa miasta na nazwanym zjeździe może wpłynąć na wyniki wyszukiwania',
	'57.solution': 'Zmień nazwę miasta na \'brak\'',
	'59.enabled': true,
	'59.problemLink': 'W:Drogi#Autostrada_.2F_Droga_ekspresowa',
	'59.title': 'Nazwa miasta na Autostradzie',
	'59.problem': 'Nazwa miasta na Autostradzie, może spowodować że obszar miasta się rozciągnie',
	'59.solution': 'W danych adresowych ustaw \'Brak\' obok nazwy miasta i kliknij \'Zatwierdź\'',
	'73.enabled': true,
	'73.title': 'Za krótka nazwa ulicy',
	'73.problem': 'Nazwa ulicy jest krótsza niż ${n} liter i nie jest autostradą',
	'73.solution': 'Popraw nazwę ulicy',
	'74.solutionLink': 'W:Ronda#Poprawianie_rond_naniesionych_r.C4.99cznie',
	'78.title': 'SLOW: Takie same punkty końcowe segmentów',
	'78.problem': 'Dwa przejezdne segmenty mają takie same punkty końcowe',
	'78.solution': 'Podziel segment. Możesz także usunąć segment, jeśli są identyczne',
	'79.problemLink': 'W:Skrzyżowania#Najlepsze_praktyki_dla_r.C3.B3.C5.BCnych_typ.C3.B3w_skrzy.C5.BCowa.C5.84',
	'87.problemLink': 'W:Drogi#Rondo',
	'87.solutionLink': 'W:Ronda#Poprawianie_rond_naniesionych_r.C4.99cznie',
	'87.title': 'Więcej niż jeden segment wychodzący z węzła A na rondzie',
	'87.problem': 'Węzeł A na rondzie ma podłączony więcej niż jeden segment wychodzący',
	'87.solution': 'Utwórz rondo ponownie',
	'99.title': 'Nawrót na wjeździe na rondo (slow)',
	'99.problem': 'Segment wjazdu na rondo ma włączoną możliwość zawracania',
	'99.solution': 'Wyłącz nawrót',
	'101.params': {'regexp': '/(^|\\b)remont(\\b|$)/i'},
	'101.title': 'Droga zamknięta (dostępne tylko w raporcie)',
	'101.problem': 'Segment jest oznaczony jako zamknięty',
	'101.solution': 'Gdy remont się skończy, przywróć połączenia segmentu i usuń przyrostek',
	'102.title': 'SLOW: Brak wyjazdu na węźle A',
	'102.problem': 'Przejezdny segment nie ma wyjazdu na węźle A',
	'102.solution': 'Rozważ możliwość wyjazdu na węźle A',
	'103.title': 'SLOW: Brak wyjazdu na węźle B',
	'103.problem': 'Przejezdny segment nie ma wyjazdu na węźle B',
	'103.solution': 'Rozważ możliwość wyjazdu na węźle B',
	'104.title': 'Tory użyte dla komentarzy',
	'104.problem': 'Tory są prawdopodobnie użyte do komentarzy na mapie',
	'104.solution': 'Usuń komentarze, ponieważ Tory będą wyświetlane w aplikacji',
	'105.enabled': true,
	'105.title': 'Ścieżka zamiast Torów',
	'105.problem': 'Ścieżka o wysokości -5 jest zapewne użyta zamiast Torów',
	'105.solution': 'Zmień typ drogi na Tory, by wyświetliły się w aplikacji',
	'107.title': 'SLOW: Brak połączenia w węźle A',
	'107.problem': 'Węzeł A segmentu jest w odległości od innego, również przejezdnego segmentu, ale nie są połączone skrzyżowaniem',
	'107.solution': 'Przeciągnij węzeł A na najbliższy segment, by się dotykały, lub odsuń go dalej',
	'108.title': 'SLOW: Brak połączenia w węźle B',
	'108.problem': 'Węzeł B segmentu jest w odległości od innego, również przejezdnego segmentu, ale nie są połączone skrzyżowaniem',
	'108.solution': 'Przeciągnij węzeł B na najbliższy segment, by się dotykały, lub odsuń go dalej',
	'109.title': 'Za krótki segment',
	'109.problem': 'Przejezdny, niekońcowy segment jest krótszy niż ${n}m, więc ciężko zobaczyć go na mapie i może powodować problemy z routingiem',
	'109.solution': 'Zwiększ długość, usuń segment lub połącz go z jednym z przyległych segmentów',
	'112.title': 'Za długa nazwa Rampy',
	'112.problem': 'Nazwa Rampy jest dłuższa niż ${n} liter',
	'112.solution': 'Skróć nazwę Rampy',
	'114.title': 'Węzeł A: Nieprzejezdna połączona z przejezdną (slow)',
	'114.problem': 'Nieprzejezdny segment tworzy skrzyżowanie z przejezdnym na węźle A',
	'114.solution': 'Odłącz węzeł A od wszystkich przejezdnych segmentów',
	'115.title': 'Węzeł B: Nieprzejezdna połączona z przejezdną (slow)',
	'115.problem': 'Nieprzejezdny segment tworzy skrzyżowanie z przejezdnym na węźle B',
	'115.solution': 'Odłącz węzeł B od wszystkich przejezdnych segmentów',
	'116.title': 'Poza skalą poziomu/wysokości',
	'116.problem': 'Poziom/wysokość segmentu są poza skalą',
	'116.solution': 'Popraw poziom/wysokość',
	'117.title': 'Przestarzały znacznik CONST ZN',
	'117.problem': 'Segmeny jest oznaczony przestarzałym przyrostkiem CONST ZN',
	'117.solution': 'Zmień CONST ZN na (zamknięte)',
	'118.title': 'Węzeł A: Nakładające się segmenty (slow)',
	'118.problem': 'Segment pokrywa się z sąsiadującym, w węźle A',
	'118.solution': 'Rozszerz segmenty do 2°, usuń niepotrzebny punkt geometrii lub cały podwójny segment w węźle A',
	'119.title': 'Węzeł B: Nakładające się segmenty (slow)',
	'119.problem': 'Segment pokrywa się z sąsiadującym, w węźle B',
	'119.solution': 'Rozszerz segmenty do 2°, usuń niepotrzebny punkt geometrii lub cały podwójny segment w węźle B',
	'120.title': 'Węzeł A: Za ostry skręt (slow)',
	'120.problem': 'Przejezdny segment ma bardzo ostry skręt na węźle A',
	'120.solution': 'Wyłącz ostry skręt na węźle A lub rozszerz segmenty do 30°',
	'121.title': 'Węzeł B: Za ostry skręt (slow)',
	'121.problem': 'Przejezdny segment ma bardzo ostry skręt na węźle B',
	'121.solution': 'Wyłącz ostry skręt na węźle B lub rozszerz segmenty do 30°',
	'128.title': 'Własne sprawdzenie (zielone)',
	'128.problem': 'Niektóre właściwości segmentu są przeciwko ustawionemu przez użytkownika wyrażeniu regularnemu (Ustawienia→Własne)',
	'128.solution': 'Rozwiąż ten problem',
	'129.title': 'Własne sprawdzenie (niebieskie)',
	'129.problem': 'Niektóre właściwości segmentu są przeciwko ustawionemu przez użytkownika wyrażeniu regularnemu (Ustawienia→Własne)',
	'129.solution': 'Rozwiąż ten problem',
	'161.enabled': true,
	'161.params': {'titleEN': 'DKnum in street name', 'problemEN': 'The street name contains DKnum', 'solutionEN': 'Remove the DK prefix from the street name', 'regexp': '/DK\\-?[0-9]+/i'},
	'161.problemLink': 'W:Drogi#Droga_krajowa',
	'161.title': 'Numer DK w nazwie ulicy',
	'161.problem': 'Nazwa ulicy zawiera numer DK',
	'161.solution': 'Usuń przedrostek z nazwy ulicy',
	'162.enabled': true,
	'162.params': {'titleEN': 'DWnum in street name', 'problemEN': 'The street name contains DWnum', 'solutionEN': 'Remove the DW prefix from the street name', 'regexp': '/DW\\-?[0-9]+/i'},
	'162.problemLink': 'W:Drogi#Droga_wojew.C3.B3dzka',
	'162.title': 'Numer DW w nazwie ulicy',
	'162.problem': 'Nazwa ulicy zawiera numer DW',
	'162.solution': 'Usuń przedrostek z nazwy ulicy',
	'163.enabled': true,
	'163.params':
		{'titleEN': '\'Węzel\' in Ramp name', 'problemEN': 'The Ramp name contains word \'węzel\'', 'solutionEN': 'Rename the Ramp in accordance with the guidelines', 'regexp': '/węze[lł]/i'},
	'163.solutionLink': 'W:Drogi#Wjazd.2Fzjazd_bezkolizyjny',
	'163.title': '\'Węzel\' w nazwie zjazdu',
	'163.problem': 'Zjazd zawiera w nazwie słowo \'węzel\'',
	'163.solution': 'Zmień nazwę zjazdu zgodnie z wytycznymi',
	'167.enabled': true,
	'167.params': {
	  'titleEN': 'Incorrect Railroad name',
	  'problemEN': 'The Railroad name is not \'PKP\', \'SKM\' or \'MPK\'',
	  'solutionEN': 'In the address properties set the street name to \'PKP\', \'SKM\' or \'MPK\', check the \'None\' box next to the city name and then click \'Apply\'',
	  'regexp': '!/^(PKP|MPK|SKM|Tramwaje Śląskie)$/'
	},
	'167.solutionLink': 'W:Drogi#Tory.2C_szyny',
	'167.title': 'Nieprawidłowa nazwa Torów',
	'167.problem': 'Segment Torów ma nieprawidłową nazwę',
	'167.solution': 'Zmień nazwę segmentu zgodnie z wytycznymi',
	'169.enabled': true,
	'169.params': {
	  'titleEN': '\'Rondo\' or \'ulica\' in street name',
	  'problemEN': 'The street name contains word \'rondo\' or \'ulica\'',
	  'solutionEN': 'In the address properties check the \'None\' box next to the street name, click \'Apply\' and then add \'Junction\' landmark to name the roundabout or remove word \'ulica\'',
	  'regexp': '/rondo |ulica/i'
	},
	'169.solutionLink': 'W:Drogi#Rondo',
	'169.title': '\'Rondo\' lub \'ulica\' w nazwie ulicy',
	'169.problem': 'Nazwa ulicy zawiera słowo \'rondo\' lub \'ulica\'',
	'169.solution': 'Zmień nazwę ulicy na \'Brak\', a następnie dodaj punkt orientacyjny \'Węzeł drogowy\', żeby nazwać rondo lub usuń słowo \'ulica\' z nazwy ulicy',
	'171.enabled': true,
	'171.params': {'regexp': '/(^| )(?!(adm|abp|bp|bł|dr|gen|bryg|pil|dyw|hetm|hr|im|inż|kard|ks|kmr|kadm|mjr|marsz|o|os|pl|ppor|ppłk|por|pn|pd|prof|płk|rtm|św|śwj|śś|wsch|zach)\\. |r\\.)[^ ]+\\./'},
	'171.solutionLink': 'W:Tabela_skrótów',
	'171.title': 'Nieprawidłowy skrót w nazwie ulicy',
	'171.problem': 'Nazwa ulicy zawiera nieprawidłowy skrót',
	'171.solution': 'Sprawdź wielkie/małe litery, przerwę przed/po skrócie i zgodność z tą tabelą',
	'172.title': 'Niepotrzebne spacje w nazwie ulicy',
	'172.problem': 'Spacja na początku, końcu lub podwójna w nazwie ulicy',
	'172.solution': 'Usuń niepotrzebne spacje z nazwy ulicy',
	'173.title': 'Nazwa ulicy bez spacji przed lub po skrócie',
	'173.problem': 'Brak spacji przed (\'1943r.\') lub po (\'st.Jan\') skrócie w nazwie ulicy',
	'173.solution': 'Dodaj spację przed/po skrócie',
	'175.title': 'Nazwa ulicy złożona z samych spacji',
	'175.problem': 'Nazwa ulicy zawiera tylko spacje',
	'175.solution': 'Zmień nazwę ulicy na \'Brak\' lub nazwij odpowiednio ulicę',
	'190.title': 'Nazwa miasta małą literą',
	'190.problem': 'Nazwa miasta zaczyna się od małej litery',
	'190.solution': 'Użyj tego formularza, by zmienić nazwę miasta',
	'192.title': 'Niepotrzebne spacje w nazwie miasta',
	'192.problem': 'Spacja na początku, końcu lub podwójna w nazwie miasta',
	'192.solution': 'Użyj tego formularza, by zmienić nazwę miasta',
	'193.title': 'Brak spacji przed/po skrócie miasta',
	'193.problem': 'Brak spacji przed (\'1943r.\') lub po (\'st.Jan\') skrócie w nazwie miasta',
	'193.solution': 'Użyj tej formy, by zmienić nazwę miasta',
	'200.problemLink': 'W:Skrzyżowania#Ograniczenia_skr.C4.99t.C3.B3w',
	'200.title': 'Węzeł A: Wstępnie dopuszczony lub zakazany skręt na przejezdnej drodze',
	'200.problem': 'Segment ma niepotwierdzony skręt na węźle A',
	'200.solution': 'Kliknij na strzałkę z purpurowym znakiem zapytania, by potwierdzić skręt. Zauważ: być może będziesz musiał zmienić segment na dwukierunkowy by dostrzec te',
	'201.title': 'Węzeł A: Niepotwierdzony skręt na głównej drodze',
	'201.problem': 'Segment drogi głównej ma niepotwierdzony skręt na węźle A',
	'201.solution': 'Kliknij skręt z fioletowym znakiem zapytania by go zatwierdzić. Info: możliwe, że będziesz musiał ustawić \'Dwukierunkowy\' żeby zobaczyć te skręty'
  },
  'NZ': {'.codeISO': 'NZ', '.country': 'New Zealand'},
  'NL': {
	'.codeISO': 'NL',
	'.country': 'Netherlands',
	'.author': 'davidakachaos',
	'.updated': '2018-08-01',
	'.fallbackCode': 'BE',
	'.lng': 'NL',
	'city.consider.en': 'consider this city name:',
	'city.consider': 'overweeg deze plaatsnaam:',
	'city.1.en': 'city name is too short',
	'city.1': 'plaatsnaam te kort',
	'city.2.en': 'expand the abbreviation',
	'city.2': 'De afkorting uitbreiden',
	'city.3.en': 'complete short name',
	'city.3': 'maak de korte naam compleet',
	'city.4.en': 'complete city name',
	'city.4': 'plaatsnaam aanvullen',
	'city.5.en': 'correct letter case',
	'city.5': 'juist hoofdlettergebruik',
	'city.6.en': 'check word order',
	'city.6': 'controleer woord volgorde',
	'city.7.en': 'check abbreviations',
	'city.7': 'controleer afkortingen',
	'city.8a.en': 'add county name',
	'city.8a': 'land naam toevoegen',
	'city.8r.en': 'remove county name',
	'city.8r': 'land naam verwijderen',
	'city.9.en': 'check county name',
	'city.9': 'controleer land naam',
	'city.10a.en': 'add a word',
	'city.10a': 'woord toevoegen',
	'city.10r.en': 'remove a word',
	'city.10r': 'woord verwijderen',
	'city.11.en': 'add county code',
	'city.11': 'landcode toevoegen',
	'city.12.en': 'identical names, but different city IDs',
	'city.12': 'identieke namen, maar verschillende plaats IDs',
	'city.13a.en': 'add a space',
	'city.13a': 'spatie invoegen',
	'city.13r.en': 'remove a space',
	'city.13r': 'spatie verwijderen',
	'city.14.en': 'check the number',
	'city.14': 'controleer het nummer',
	'props.skipped.title.en': 'The segment is not checked',
	'props.skipped.title': 'Dit segment is niet gecontroleerd',
	'props.skipped.problem.en': 'The segment is modified after 2014-05-01 AND locked for you, so Validator did not check it',
	'props.skipped.problem': 'Dit segment is na 2014-05-01 aangepast EN voor jou gelockt, Validator heeft dit niet gecontroleerd',
	'err.regexp.en': 'Error parsing option for check #${n}:',
	'err.regexp': 'Fout bij het verwerken van de opties voor de controle #${n}:',
	'props.disabled.en': 'WME Validator is disabled',
	'props.disabled': 'WME Validator is uitgeschakeld',
	'props.limit.title.en': 'Too many issues reported',
	'props.limit.title': 'Te veel problemen gevonden',
	'props.limit.problem.en': 'There are too many issues reported, so some of them might not be shown',
	'props.limit.problem': 'Er zijn te veel problemen gemeld, daarom wordt een aantal van hen niet getoond',
	'props.limit.solution.en': 'Deselect the segment and stop scanning process. Then click red \'✘\' (Clear report) button',
	'props.limit.solution': 'Deselecteer het segment en stop het scanproces. Klik dan op de rode \'✘\' (Clear report) knop',
	'props.reports.en': 'reports',
	'props.reports': 'meldingen',
	'props.noneditable.en': 'You cannot edit this segment',
	'props.noneditable': 'Je kunt dit segment niet bewerken',
	'report.save.en': 'Save this report',
	'report.save': 'Sla dit rapport op',
	'report.list.andUp.en': 'and up',
	'report.list.andUp': 'en meer',
	'report.list.severity.en': 'Severity:',
	'report.list.severity': 'Hevigheid:',
	'report.list.reportOnly.en': 'only in report',
	'report.list.reportOnly': 'alleen in rapportage',
	'report.list.forEditors.en': 'For editors level:',
	'report.list.forEditors': 'Voor bewerkers niveau:',
	'report.list.forCountries.en': 'For countries:',
	'report.list.forCountries': 'Voor landen:',
	'report.list.forStates.en': 'For states:',
	'report.list.forStates': 'Voor provincies:',
	'report.list.forCities.en': 'For cities:',
	'report.list.forCities': 'Voor steden:',
	'report.list.params.en': 'Params to configure in localization pack:',
	'report.list.params': 'Parameters om te configureren in lokalisatie:',
	'report.list.params.set.en': 'Current configuration for ${country}:',
	'report.list.params.set': 'Huidige configuratie voor ${country}:',
	'report.list.enabled.en': '${n} checks are enabled for',
	'report.list.enabled': '${n} controles zijn actief voor',
	'report.list.disabled.en': '${n} checks are disabled for',
	'report.list.disabled': '${n} controles zijn uitgeschakeld voor',
	'report.list.total.en': 'There are ${n} checks available',
	'report.list.total': 'Er zijn ${n} controles beschikbaar',
	'report.list.title.en': 'Complete List of Checks for',
	'report.list.title': 'Complete lijst met controles voor',
	'report.list.see.en': 'See',
	'report.list.see': 'Zie',
	'report.list.checks.en': 'Settings->About->Available checks',
	'report.list.checks': 'Instellingen->Over->Beschikbare controles',
	'report.list.fallback.en': 'Localization Fallback Rules:',
	'report.list.fallback': 'Lokalisatie terugval regels:',
	'report.and.en': 'and',
	'report.and': 'en',
	'report.segments.en': 'Total number of segments checked:',
	'report.segments': 'Totaal aantal gecontroleerde segmenten:',
	'report.customs.en': 'Custom checks matched (green/blue):',
	'report.customs': 'Er is een match aangepaste controles (groen/blauw):',
	'report.reported.en': 'Reported',
	'report.reported': 'Gerapporteerd',
	'report.errors.en': 'errors',
	'report.errors': 'fouten',
	'report.warnings.en': 'warnings',
	'report.warnings': 'waarschuwingen',
	'report.notes.en': 'notes',
	'report.notes': 'notities',
	'report.link.wiki.en': 'wiki',
	'report.link.wiki': 'wiki',
	'report.link.forum.en': 'forum',
	'report.link.forum': 'forum',
	'report.link.other.en': 'link',
	'report.link.other': 'link',
	'report.contents.en': 'Contents:',
	'report.contents': 'Inhoud:',
	'report.summary.en': 'Summary',
	'report.summary': 'Samenvatting',
	'report.title.en': 'WME Validator Report',
	'report.title': 'WME Validator Rapport',
	'report.share.en': 'to Share',
	'report.share': 'om te delen',
	'report.generated.by.en': 'generated by',
	'report.generated.by': 'gegenereerd door',
	'report.generated.on.en': 'on',
	'report.generated.on': 'op',
	'report.source.en': 'Report source:',
	'report.source': 'Rapportbron:',
	'report.filter.duplicate.en': 'duplicate segments',
	'report.filter.duplicate': 'dubbele segmenten',
	'report.filter.streets.en': 'Streets and Service Roads',
	'report.filter.streets': 'Straten en dienstwegen',
	'report.filter.other.en': 'Other drivable and Non-drivable',
	'report.filter.other': 'Andere berijdbare en niet berijdbare',
	'report.filter.noneditable.en': 'non-editable segments',
	'report.filter.noneditable': 'niet-bewerkbare segmenten',
	'report.filter.notes.en': 'notes',
	'report.filter.notes': 'notities',
	'report.filter.title.en': 'Filter:',
	'report.filter.title': 'Filter:',
	'report.filter.excluded.en': 'are excluded from this report.',
	'report.filter.excluded': 'zijn uitgezonderd van dit rapport.',
	'report.search.updated.by.en': 'updated by',
	'report.search.updated.by': 'bijgewerkt door',
	'report.search.updated.since.en': 'updated since',
	'report.search.updated.since': 'bijgewerkt sinds',
	'report.search.city.en': 'from',
	'report.search.city': 'van',
	'report.search.reported.en': 'reported as',
	'report.search.reported': 'gemeld',
	'report.search.title.en': 'Search:',
	'report.search.title': 'Zoeken:',
	'report.search.only.en': 'only segments',
	'report.search.only': 'alleen segmenten',
	'report.search.included.en': 'are included into the report.',
	'report.search.included': 'zijn opgenomen in het rapport.',
	'report.beta.warning.en': 'WME Beta Warning!',
	'report.beta.warning': 'WME Beta Waarschuwing!',
	'report.beta.text.en': 'This report is generated in beta WME with beta permalinks.',
	'report.beta.text': 'Dit rapport is gegenereerd in beta WME met bèta permalinks.',
	'report.beta.share.en': 'Please do not share those permalinks!',
	'report.beta.share': 'Gelieve deze permalinks niet te delen!',
	'report.size.warning.en':
		'<b>Warning!</b><br>The report is ${n} characters long so <b>it will not fit</b> into a single forum or private message.\n<br>Please add <b>more filters</b> to reduce the size of the report.',
	'report.size.warning':
		'<b>Waarschuwing!</b><br>Het rapport is ${n} tekens lang dus <b>het zal niet passen</b> in één forum of privé bericht.\n<br>Voeg aub <b>meer filters</b> toe om de grootte van het rapport te beperken.',
	'report.note.limit.en': '* Note: there were too many issues reported, so some of them are not counted in the summary.',
	'report.note.limit': '* Let op: er waren te veel problemen gemeld, zodat een aantal van hen worden niet meegeteld in de samenvatting.',
	'report.forum.en': 'To motivate further development please leave your comment on the',
	'report.forum': 'Om verdere ontwikkeling te motiveren laat dan je commentaar achter op de',
	'report.forum.link.en': 'Waze forum thread.',
	'report.forum.link': 'Waze forum thread.',
	'report.thanks.en': 'Thank you for using WME Validator!',
	'report.thanks': 'Dank u voor het gebruik van de WME Validator!',
	'msg.limit.segments.en': 'There are too many segments.\n\nClick \'Show report\' to review the report, then\n',
	'msg.limit.segments': 'Er zijn te veel segmenten.\n\nKlik op \'Toon rapport\' om het rapport door te nemen, vervolgens\n',
	'msg.limit.segments.continue.en': 'click \'▶\' (Play) to continue.',
	'msg.limit.segments.continue': 'klik \'▶\' (Play) om verder te gaan.',
	'msg.limit.segments.clear.en': 'click \'✘\' (Clear) to clear the report.',
	'msg.limit.segments.clear': 'klik \'✘\' (Löschen) om het rapport te verwijderen.',
	'msg.pan.text.en': 'Pan around to validate the map',
	'msg.pan.text': 'Schuif de kaart rond om de kaart te valideren',
	'msg.zoomout.text.en': 'Zoom out to start WME Validator',
	'msg.zoomout.text': 'Uitzoomen om WME Validator te beginnen',
	'msg.click.text.en': 'Click \'▶\' (Play) to validate visible map area',
	'msg.click.text': 'Klik \'▶\' (Play), om het zichtbare gebied op de kaart te valideren',
	'msg.autopaused.en': 'autopaused',
	'msg.autopaused': 'automatisch gepauzeerd',
	'msg.autopaused.text.en': 'Auto paused! Click \'▶\' (Play) to continue.',
	'msg.autopaused.text': 'Automatisch gepauzeerd! Om door te gaan klik op \'▶\' (Play).',
	'msg.autopaused.tip.en': 'WME Validator automatically paused on map drag or window size change',
	'msg.autopaused.tip': 'WME Validator is automatisch onderbroken wegen het verschuiven van de kaart of door een aanpassing van de venstergrootte',
	'msg.finished.text.en': 'Click <b>\'Show report\'</b> to review map issues',
	'msg.finished.text': 'Klik <b>\'Toon rapport\'</b> om kaart problemen te beoordelen',
	'msg.finished.tip.en': 'Click \'✉\' (Share) button to post report on a\nforum or in a private message',
	'msg.finished.tip': 'Klik op \'✉\' (Delen) om het rapport op een\nforum of privebericht te plaatsen',
	'msg.noissues.text.en': 'Finished! No issues found!',
	'msg.noissues.text': 'Klaar! Geen problemen gevonden!',
	'msg.noissues.tip.en': 'Try to uncheck some filter options or start WME Validator over another map area!',
	'msg.noissues.tip': 'Probeer een aantal filteropties uit te vinken of start WME Validator over een ander gebied op de kaart!',
	'msg.scanning.text.en': 'Scanning! Finishing in ~ ${n} min',
	'msg.scanning.text': 'Scannen! Klaar over ~ ${n} min',
	'msg.scanning.text.soon.en': 'Scanning! Finishing in a minute!',
	'msg.scanning.text.soon': 'Scannen! Klaar binnen een minuut!',
	'msg.scanning.tip.en': 'Click \'Pause\' button to pause or \'■\' (Stop) to stop',
	'msg.scanning.tip': 'Klik op \'pauze\' knop om te pauzeren of \'■\' (Stop) om te stoppen',
	'msg.starting.text.en': 'Starting! Layers are off to scan faster!',
	'msg.starting.text': 'Begonnen! Layers zijn uitgeschakeld om sneller te scannen!',
	'msg.starting.tip.en': 'Use \'Pause\' button to pause or \'■\' button to stop',
	'msg.starting.tip': 'Gebruik de \'Pause\' knop om te pauzeren of \'■\' knop om te stoppen',
	'msg.paused.text.en': 'On pause! Click \'▶\' (Play) button to continue.',
	'msg.paused.text': 'Gepauzeerd! Klik op \'▶\' (Play) knop om door te gaan.',
	'msg.paused.tip.en': 'To view the report click \'Show report\' button (if available)',
	'msg.paused.tip': 'Om het rapport te bekijken klik je op de \'Toon rapport\' knop (indien beschikbaar)',
	'msg.continuing.text.en': 'Continuing!',
	'msg.continuing.text': 'Doorgaan!',
	'msg.continuing.tip.en': 'WME Validator will continue from the location it was paused',
	'msg.continuing.tip': 'WME Validator zal doorgaan van de locatie waar het werd onderbroken',
	'msg.settings.text.en': 'Click <b>\'Back\'</b> to return to main view',
	'msg.settings.text': 'Klik <b>\'Terug\'</b> om terug te keren naar hoofdweergave',
	'msg.settings.tip.en': 'Click \'Reset defaults\' button to reset all settings in one click!',
	'msg.settings.tip': 'Klik op \'Herstel standaardinstellingen\' knop om alle instellingen in één klik resetten!',
	'msg.reset.text.en': 'All filter options and settings have been reset to their defaults',
	'msg.reset.text': 'Alle filter opties en instellingen zijn terug gezet naar de standaardwaarden',
	'msg.reset.tip.en': 'Click \'Back\' button to return to main view',
	'msg.reset.tip': 'Klik <b>\'Terug\'</b> om terug te keren naar de hoofdweergave',
	'msg.textarea.pack.en':
		'This is a Greasemonkey/Tampermonkey script. You can copy and paste the text below into a <b>new .user.js file</b><br>or <b>paste it directly</b> into the Greasemonkey/Tampermonkey',
	'msg.textarea.pack':
		'Dit is een Greasemonkey/Tampermonkey script. Je kunt onderstaande tekst kopieren en plakken in een <b>nieuw .user.js</b>of <b>plak het direct</b> in Greasemonkey/Tampermonkey',
	'msg.textarea.en': 'Please copy the text below and then paste it into your forum post or private message',
	'msg.textarea': 'Kopieer de onderstaande tekst en plak deze in je forum post of privebericht',
	'noaccess.text.en':
		'<b>Sorry,</b><br>You cannot use WME Validator over here.<br>Please check <a target=\'_blank\' href=\'https://www.waze.com/forum/viewtopic.php?t=76488\'>the forum thread</a><br>for more information.',
	'noaccess.text':
		'<b>Sorry,</b><br>Hier kan je de WME Validator niet gebruiken.<brMeer informatie vind je <a target="_blank" href="https://www.waze.com/forum/viewtopic.php?t=76488">deze forum thread</a><br>.',
	'noaccess.tip.en': 'Please check the forum thread for more information!',
	'noaccess.tip': 'Controleer de forum thread voor meer informatie!',
	'tab.switch.tip.on.en': 'Click to switch highlighting on (Alt+V)',
	'tab.switch.tip.on': 'Klik om het markeren aan te schakelen (Alt + V)',
	'tab.switch.tip.off.en': 'Click to switch highlighting off (Alt+V)',
	'tab.switch.tip.off': 'Klik om het markeren uit te schakelen (Alt+V)',
	'tab.filter.text.en': 'filter',
	'tab.filter.text': 'filter',
	'tab.filter.tip.en': 'Options to filter the report and highlighted segments',
	'tab.filter.tip': 'Opties om het rapport te filteren en gemarkeerd segmenten',
	'tab.search.text.en': 'search',
	'tab.search.text': 'zoeken',
	'tab.search.tip.en': 'Advanced filter options to include only specific segments',
	'tab.search.tip': 'Geavanceerde filteropties om alleen specifieke segmenten op te nemen',
	'tab.help.text.en': 'help',
	'tab.help.text': 'help',
	'tab.help.tip.en': 'Need help?',
	'tab.help.tip': 'Hulp nodig?',
	'filter.noneditables.text.en': 'Exclude <b>non-editable</b> segments',
	'filter.noneditables.text': 'Negeer <b>niet-bewerkbare</b> segmenten',
	'filter.noneditables.tip.en': 'Do not report locked segments or\nsegments outside of your editable areas',
	'filter.noneditables.tip': 'Rapporteer geen beveiligde segmenten of\nsegmenten buiten het gebied waar je mag bewerken',
	'filter.duplicates.text.en': 'Exclude <b>duplicate</b> segments',
	'filter.duplicates.text': '<b>Dubbele</b> segmenten uitsluiten',
	'filter.duplicates.tip.en': 'Do not show the same segment in different\nparts of report\n* Note: this option DOES NOT affect highlighting',
	'filter.duplicates.tip': 'Toon hetzelfde segment niet in verschillende\ndelen van het rapport\n* Opmerking: deze optie HEEFT GEEN invloed op het markeren',
	'filter.streets.text.en': 'Exclude <b>Streets and Service Roads</b>',
	'filter.streets.text': 'Negeer <b>wegen en dienstwegen</b>',
	'filter.streets.tip.en': 'Do not report Streets and Service Roads',
	'filter.streets.tip': 'Neem wegen en dienstwegen niet op in het rapport',
	'filter.other.text.en': 'Exclude <b>Other drivable and Non-drivable</b>',
	'filter.other.text': 'Negeer <b>Andere berijdbare en niet-berijdbare</b> segmenten',
	'filter.other.tip.en': 'Do not report Dirt, Parking Lot, Private Roads\nand non-drivable segments',
	'filter.other.tip': 'Niet melden van onverharde, parkeerplaats, privéwegen\n en niet-berijdbare segmenten',
	'filter.notes.text.en': 'Exclude <b>notes</b>',
	'filter.notes.text': 'Negeer <b>opmerkingen</b>',
	'filter.notes.tip.en': 'Report only warnings and errors',
	'filter.notes.tip': 'Rapporteer alleen waarschuwingen en fouten',
	'search.youredits.text.en': 'Include <b>only your edits</b>',
	'search.youredits.text': 'Toon <b>enkel eigen aanpassingen</b>',
	'search.youredits.tip.en': 'Include only segments edited by you',
	'search.youredits.tip': 'Omvat slechts segmenten bewerkt door u',
	'search.updatedby.text.en': '<b>Updated by*:</b>',
	'search.updatedby.text': '<b>Aangepast door*:</b>',
	'search.updatedby.tip.en':
		'Include only segments updated by the specified editor\n* Note: this option is available for country managers only\nThis field supports:\n - lists: me, otherEditor\n - wildcards: world*\n - negation: !me, *\n* Note: you may use \'me\' to match yourself',
	'search.updatedby.tip':
		'Omvat slechts segmenten bijgewerkt door de opgegeven editor\n * Opmerking: deze optie is alleen beschikbaar voor country managers\n Dit veld ondersteunt:\n - lijsten: me, otherEditor\n - wildcards: wereld *\n - negatie:! Me, *\n * Opmerking: je kunt gebruik maken van \'me\' om jezelf te vinden',
	'search.updatedby.example.en': 'Example: me',
	'search.updatedby.example': 'Voorbeeld: me',
	'search.updatedsince.text.en': '<b>Updated since:</b>',
	'search.updatedsince.text': '<b>Aangepast sinds:</b>',
	'search.updatedsince.tip.en': 'Include only segments edited since the date specified\nFirefox date format: YYYY-MM-DD',
	'search.updatedsince.tip': 'Toon enkel de segmenten die zijn gewijzigd sinds de opgegeven datum\nFirefox datum formaat: YYYY-MM-DD',
	'search.updatedsince.example.en': 'YYYY-MM-DD',
	'search.updatedsince.example': 'YYYY-MM-DD',
	'search.city.text.en': '<b>City name:</b>',
	'search.city.text': '<b>plaatsnaam:</b>',
	'search.city.tip.en': 'Include only segments with specified city name\nThis field supports:\n - lists: Paris, Meudon\n - wildcards: Greater * Area\n - negation: !Paris, *',
	'search.city.tip': 'Neem alleen segmenten op met opgegeven plaatsnaam\nDit veld ondersteunt:\n - lijsten: Amsterdam, Potsdam\n - wildcards: Den * \n - Negation: !Amsterdam, *',
	'search.city.example.en': 'Example: !Paris, *',
	'search.city.example': 'Voorbeeld: !Amsterdam, *',
	'search.checks.text.en': '<b>Reported as:</b>',
	'search.checks.text': '<b>Rapporteer als:</b>',
	'search.checks.tip.en':
		'Include only segments reported as specified\nThis field matches:\n - severities: errors\n - check names: New road\n - check IDs: 200\nThis field supports:\n - lists: 36, 37\n - wildcards: *roundabout*\n - negation: !unconfirmed*, *',
	'search.checks.tip':
		'Inclusief enkel de segmenten gerapporteerd als\nDit veld kom overeen met:\n - Foutmelding-rubriek: Fout\n - naam controle: Nieuwe straat\n - ID-Check: 200\nDit veld ondersteunt:\n - lijsten: 36, 37\n - wildcards: *rotonde*\n - negatie: !Soft-Turn*, *',
	'search.checks.example.en': 'Example: reverse*',
	'search.checks.example': 'Voorbeeld: autoweg*',
	'help.text.en':
		'<b>Help Topics:</b><br><a target="_blank" href="https://www.waze.com/forum/viewtopic.php?t=76488&p=666476#p666476">F.A.Q.</a><br><a target="_blank" href="https://www.waze.com/forum/viewtopic.php?t=76488">Ask your question on the forum</a><br><a target="_blank" href="https://www.waze.com/forum/viewtopic.php?t=76488&p=661300#p661185">How to adjust Validator for your country</a><br><a target="_blank" href="https://www.waze.com/forum/viewtopic.php?t=76488&p=663286#p663286">About the "Might be Incorrect City Name"</a>',
	'help.text':
		'<b>Hulp onderwerpen:</b><br><a target="_blank" href="https://www.waze.com/forum/viewtopic.php?t=76488&p=666476#p666476">F.A.Q.</a><br><a target="_blank" href="https://www.waze.com/forum/viewtopic.php?t=76488">Stel je vraag op het forum</a><br><a target="_blank" href="https://www.waze.com/forum/viewtopic.php?t=76488&p=661300#p661185">Hoe Validator aan te passen voor uw land</a><br><a target="_blank" href="https://www.waze.com/forum/viewtopic.php?t=76488&p=663286#p663286">Over de "Eventuele verkeerde plaatsnaam"</a>',
	'help.tip.en': 'Open in a new browser tab',
	'help.tip': 'Open in een nieuw tabblad',
	'button.scan.tip.en': 'Start scanning current map area\n* Note: this might take few minutes',
	'button.scan.tip': 'Start het scannen van het huidige gebied op de kaart\n* Opmerking: dit kan een aantal minuten duren',
	'button.scan.tip.NA.en': 'Zoom out to start scanning current map area',
	'button.scan.tip.NA': 'Zoom uit om te beginnen met het scannen van het huidige gebied op de kaart',
	'button.pause.tip.en': 'Pause scanning',
	'button.pause.tip': 'Scannen pauzeren',
	'button.continue.tip.en': 'Continue scanning the map area',
	'button.continue.tip': 'Doorgaan met scannen van het gebied op de kaart',
	'button.stop.tip.en': 'Stop scanning and return to the start position',
	'button.stop.tip': 'Stop het scannen en keer terug naar de beginpositie',
	'button.clear.tip.en': 'Clear report and segment cache',
	'button.clear.tip': 'Wissen rapport en segment cache',
	'button.clear.tip.red.en': 'There are too many reported segments:\n 1. Click \'Show report\' to generate the report.\n 2. Click this button to clear the report and start over.',
	'button.clear.tip.red':
		'Er zijn te veel gerapporteerde segmenten:\n 1. Klik op \'Toon rapport\' om het rapport te genereren.\n 2. Klik op deze knop om het rapport te wissen en opnieuw te beginnen.',
	'button.report.text.en': 'Show report',
	'button.report.text': 'Toon rapport',
	'button.report.tip.en': 'Apply the filter and generate HTML report in a new tab',
	'button.report.tip': 'Pas het filter toe en genereer het HTML-rapport in een nieuw tabblad',
	'button.BBreport.tip.en': 'Share the report on Waze forum or in a private message',
	'button.BBreport.tip': 'Deel het rapport op het Waze forum of in een privé-bericht',
	'button.settings.tip.en': 'Configure settings',
	'button.settings.tip': 'Instellingen aanpassen',
	'tab.custom.text.en': 'custom',
	'tab.custom.text': 'eigen instelling',
	'tab.custom.tip.en': 'User-defined custom checks settings',
	'tab.custom.tip': 'Door gebruiker aangepaste controle instellingen',
	'tab.settings.text.en': 'Settings',
	'tab.settings.text': 'Instellingen',
	'tab.scanner.text.en': 'scanner',
	'tab.scanner.text': 'scanner',
	'tab.scanner.tip.en': 'Map scanner settings',
	'tab.scanner.tip': 'Instellingen Kaartscanner',
	'tab.about.text.en': 'about</span>',
	'tab.about.text': 'over</span>',
	'tab.about.tip.en': 'About WME Validator',
	'tab.about.tip': 'Over WME Validator',
	'scanner.sounds.text.en': 'Enable sounds',
	'scanner.sounds.text': 'Gebruik geluiden',
	'scanner.sounds.tip.en': 'Bleeps and the bloops while scanning',
	'scanner.sounds.tip': 'Activeer de geluiden tijden het scannen',
	'scanner.sounds.NA.en': 'Your browser does not support AudioContext',
	'scanner.sounds.NA': 'Je browser ondersteunt geen AudioContext',
	'scanner.highlight.text.en': 'Highlight issues on the map',
	'scanner.highlight.text': 'Markeer problemen op de kaart',
	'scanner.highlight.tip.en': 'Highlight reported issues on the map',
	'scanner.highlight.tip': 'Markeer gevonden problemen op de kaart',
	'scanner.slow.text.en': 'Enable "slow" checks',
	'scanner.slow.text': '"Langzame" controles activeren',
	'scanner.slow.tip.en': 'Enables deep map analysis\n* Note: this option might slow down the scanning process',
	'scanner.slow.tip': 'Activeert diepe kaartanalyse\n* Opmerking: deze optie zou het scanproces kunnen vertragen',
	'scanner.ext.text.en': 'Report external highlights',
	'scanner.ext.text': 'Meld externe markeringen',
	'scanner.ext.tip.en': 'Report segments highlighted by WME Toolbox or WME Color Highlights',
	'scanner.ext.tip': 'Rapporteer segmenten gemarkeerd door WME Toolbox of WME Color Highlights',
	'advanced.twoway.text.en': 'WME: Two-way segments by default',
	'advanced.twoway.text': 'WME: Nieuwe segmenten tweerichtingsverkeer standaard',
	'advanced.twoway.tip.en': 'Newly created streets in WME are bidirectional by default',
	'advanced.twoway.tip': 'Nieuwe segmenten zijn standaard tweerichtingsverkeer',
	'custom.template.text.en': '<a target=\'_blank\' href=\'https://www.waze.com/forum/viewtopic.php?t=76488&p=749456#p749456\'>Custom template</a>',
	'custom.template.text': '<a target=\'_blank\' href=\'https://www.waze.com/forum/viewtopic.php?t=76488&p=749456#p749456\'>Aangepast sjabloon</a>',
	'custom.template.tip.en':
		'User-defined custom check expandable template.\n\nYou may use the following expandable variables:\nAddress:\n  ${country}, ${state}, ${city}, ${street},\n  ${altCity[index or delimeter]}, ${altStreet[index or delimeter]}\nSegment properties:\n  ${type}, ${typeRank}, ${toll}, ${direction}, ${elevation}, ${lock},\n  ${length}, ${ID}\nHelpers:\n  ${drivable}, ${roundabout}, ${hasHNs},\n  ${Uturn}, ${deadEnd}, ${softTurns},\n  ${deadEndA}, ${partialA},\n  ${deadEndB}, ${partialB}\nConnectivity:\n  ${segmentsA}, ${inA}, ${outA}, ${UturnA},\n  ${segmentsB}, ${inB}, ${outB}, ${UturnB}',
	'custom.template.tip':
		'Door de gebruiker gedefinieerde aangepaste controle uitbreidbaar sjabloon.\n\nDe volgende variabelen zijn te gebruiken:\n${country}, ${state}, ${city}, ${street},\n${altCity[Index of onderscheidingsteken]}, ${altStreet[Index of onderscheidingsteken]}\nSegment-Eigenschaften:\n${type}, ${typeRank}, ${toll}, ${direction}, ${elevation}, ${lock},\n  ${length}, ${ID}\nHelpers:\n  ${drivable}, ${roundabout}, ${hasHNs},\n  ${Uturn}, ${deadEnd}, ${softTurns}\n  ${deadEndA}, ${partialA},\n  ${deadEndB}, ${partialB}\nVerbindungen:\n  ${segmentsA}, ${inA}, ${outB}, ${UturnA},\n  ${segmentsB}, ${inB}, ${outB}, ${UturnB}',
	'custom.template.example.en': 'Example: ${street}',
	'custom.template.example': 'Voorbeeld: ${street}',
	'custom.regexp.text.en': 'Custom <a target=\'_blank\' href=\'https://www.waze.com/forum/viewtopic.php?t=76488&p=749456#p749456\'>RegExp</a>',
	'custom.regexp.text': '<a target=\'_blank\' href=\'https://www.waze.com/forum/viewtopic.php?t=76488&p=749456#p749456\'>Eigen RegExp</a>',
	'custom.regexp.tip.en':
		'User-defined custom check regular expression to match the template.\n\nCase-insensitive match: /regexp/i\nNegation (do not match): !/regexp/\nLog debug information on console: D/regexp/',
	'custom.regexp.tip':
		'Door de gebruiker gedefinieerde RegExp die overeenkomen met het template.\n\nNiet hoofdlettergevoelig match: /regexp/i\nNegatie van een uitdrukking: !/regexp/\nLog debug informatie op de console: D/regexp/',
	'custom.regexp.example.en': 'Example: !/.+/',
	'custom.regexp.example': 'Voorbeeld: !/.+/',
	'about.tip.en': 'Open link in a new tab',
	'about.tip': 'Link in nieuw tabblad openen',
	'button.reset.text.en': 'Reset defaults',
	'button.reset.text': 'Herstel standaardinstellingen',
	'button.reset.tip.en': 'Revert filter options and settings to their defaults',
	'button.reset.tip': 'Filter opties en instellingen herstellen naar de standaardwaarden',
	'button.list.text.en': 'Available checks...',
	'button.list.text': 'Beschikbare controles...',
	'button.list.tip.en': 'Show a list of checks available in WME Validator',
	'button.list.tip': 'Toon een lijst met beschikbare controles in WME Validator',
	'button.wizard.tip.en': 'Create localization package',
	'button.wizard.tip': 'Maak lokalisatie pakket aan',
	'button.back.text.en': 'Back',
	'button.back.text': 'Terug',
	'button.back.tip.en': 'Close settings and return to main view',
	'button.back.tip': 'Sluit de instellingen en keer terug naar de hoofdweergave',
	'1.title.en': 'WME Toolbox: Roundabout which may cause issues',
	'1.title': 'WME Toolbox: Rotonde die problemen kan veroorzaken (rotonde verkeer problematisch)',
	'1.problem.en': 'Junction IDs of the roundabout segments are not consecutive',
	'1.problem': 'Knooppunt-ID\'s van de rotonde segmenten zijn niet opeenvolgend',
	'1.solution.en': 'Redo the roundabout',
	'1.solution': 'Rotonde opnieuw doen',
	'2.title.en': 'WME Toolbox: Simple segment',
	'2.title': 'WME Toolbox: Moeilijk segment (Te veel geometrie knooppunten)',
	'2.problem.en': 'The segment has unneeded geometry nodes',
	'2.problem': 'Het segment heeft onnodige geometrie knooppunten',
	'2.solution.en': 'Simplify segment geometry by hovering mouse pointer and pressing "d" key',
	'2.solution': 'Vereenvoudig segment geometrie door de muisaanwijzing boven het punt te brengen en de "d" toets in te drukken',
	'3.title.en': 'WME Toolbox: Lvl 2 lock',
	'3.title': 'WME Toolbox: Lvl 2 Lock',
	'3.problem.en': 'The segment is highlighted by WME Toolbox. It is not a problem',
	'3.problem': 'Het segment wordt gemarkeerd door WME Toolbox. Het is geen probleem',
	'4.title.en': 'WME Toolbox: Lvl 3 lock',
	'4.title': 'WME Toolbox: Lvl 3 Lock',
	'4.problem.en': 'The segment is highlighted by WME Toolbox. It is not a problem',
	'4.problem': 'Het segment wordt gemarkeerd door WME Toolbox. Het is geen probleem.',
	'5.title.en': 'WME Toolbox: Lvl 4 lock',
	'5.title': 'WME Toolbox: Lvl 4 Lock',
	'5.problem.en': 'The segment is highlighted by WME Toolbox. It is not a problem',
	'5.problem': 'Het segment wordt gemarkeerd door WME Toolbox. Het is geen probleem',
	'6.title.en': 'WME Toolbox: Lvl 5 lock',
	'6.title': 'WME Toolbox: Lvl 5 Lock',
	'6.problem.en': 'The segment is highlighted by WME Toolbox. It is not a problem',
	'6.problem': 'Het segment wordt gemarkeerd door WME Toolbox. Het is geen probleem',
	'7.title.en': 'WME Toolbox: Lvl 6 lock',
	'7.title': 'WME Toolbox: Lvl 6 Lock',
	'7.problem.en': 'The segment is highlighted by WME Toolbox. It is not a problem',
	'7.problem': 'Het segment wordt gemarkeerd door WME Toolbox. Het is geen probleem',
	'8.title.en': 'WME Toolbox: House numbers',
	'8.title': 'WME Toolbox: Huisnummers',
	'8.problem.en': 'The segment is highlighted by WME Toolbox. It is not a problem',
	'8.problem': 'Het segment wordt gemarkeerd door WME Toolbox. Het is geen probleem',
	'9.title.en': 'WME Toolbox: Segment with time restrictions',
	'9.title': 'WME Toolbox: Segment met tijdsrestricties',
	'9.problem.en': 'The segment is highlighted by WME Toolbox. It is not a problem',
	'9.problem': 'Het segment wordt gemarkeerd door WME Toolbox. Het is geen probleem',
	'13.title.en': 'WME Color Highlights: Editor lock',
	'13.title': 'WME Color Highlights: Editor lock',
	'13.problem.en': 'The segment is highlighted by WME Color Highlights. It is not a problem',
	'13.problem': 'Het segment wordt gemarkeerd door WME Color Highlights. Het is geen probleem',
	'14.title.en': 'WME Color Highlights: Toll road / One way road',
	'14.title': 'WME Color Highlights: Toll road / One way road (Tol- / Eenrichtings-straat)',
	'14.problem.en': 'The segment is highlighted by WME Color Highlights. It is not a problem',
	'14.problem': 'Het segment wordt gemarkeerd door WME Color Highlights. Het is geen probleem',
	'15.title.en': 'WME Color Highlights: Recently edited',
	'15.title': 'WME Color Highlights: Recently edited (Kürzlich editiert)',
	'15.problem.en': 'The segment is highlighted by WME Color Highlights. It is not a problem',
	'15.problem': 'Het segment wordt gemarkeerd door WME Color Highlights. Het is geen probleem',
	'16.title.en': 'WME Color Highlights: Road rank',
	'16.title': 'WME Color Highlights: Road type',
	'16.problem.en': 'The segment is highlighted by WME Color Highlights. It is not a problem',
	'16.problem': 'Het segment wordt gemarkeerd door WME Color Highlights. Het is geen probleem',
	'17.title.en': 'WME Color Highlights: No city',
	'17.title': 'WME Color Highlights: No city (Keine Stadt)',
	'17.problem.en': 'The segment is highlighted by WME Color Highlights. It is not a problem',
	'17.problem': 'Het segment wordt gemarkeerd door WME Color Highlights. Het is geen probleem',
	'18.title.en': 'WME Color Highlights: Time restriction / Highlighted road type',
	'18.title': 'WME Color Highlights: Time restriction / Highlighted road type',
	'18.problem.en': 'The segment is highlighted by WME Color Highlights. It is not a problem',
	'18.problem': 'Het segment wordt gemarkeerd door WME Color Highlights. Het is geen probleem',
	'19.title.en': 'WME Color Highlights: No name',
	'19.title': 'WME Color Highlights: No name (Kein Straßenname)',
	'19.problem.en': 'The segment is highlighted by WME Color Highlights. It is not a problem',
	'19.problem': 'Het segment wordt gemarkeerd door WME Color Highlights. Het is geen probleem',
	'20.title.en': 'WME Color Highlights: Filter by city',
	'20.title': 'WME Color Highlights: Filter by city (Stadt-Filter)',
	'20.problem.en': 'The segment is highlighted by WME Color Highlights. It is not a problem',
	'20.problem': 'Het segment wordt gemarkeerd door WME Color Highlights. Het is geen probleem',
	'21.title.en': 'WME Color Highlights: Filter by city (alt. city)',
	'21.title': 'WME Color Highlights: Filter by city (alt. city)',
	'21.problem.en': 'The segment is highlighted by WME Color Highlights. It is not a problem',
	'21.problem': 'Het segment wordt gemarkeerd door WME Color Highlights. Het is geen probleem',
	'22.title.en': 'WME Color Highlights: Filter by editor',
	'22.title': 'WME Color Highlights: Filter by editor (Editor-Filter)',
	'22.problem.en': 'The segment is highlighted by WME Color Highlights. It is not a problem',
	'22.problem': 'Het segment wordt gemarkeerd door WME Color Highlights. Het is geen probleem',
	'23.title.en': 'Unconfirmed road',
	'23.title': 'Onbevestigde straat',
	'23.problem.en': 'Each segment must minimally have the Country and State information',
	'23.problem': 'Elk segment moet minimaal informatie hebben over het land en plaats',
	'23.solution.en': 'Confirm the road by updating its details',
	'23.solution': 'Bevestig de straat door ofwel de plaats danwel de straatnaam in te voeren.',
	'24.title.en': 'Might be incorrect city name (only available in the report)',
	'24.title': 'Eventueel verkeerde plaatsnaam (alleen beschikbaar in het rapport)',
	'24.problem.en': 'The segment might have incorrect city name',
	'24.problem': 'Het segment heeft misschien een verkeerde plaatsnaam',
	'24.solution.en': 'Consider suggested city name and use this form to rename the city',
	'24.solution': 'Overweeg de voorgestelde plaatsnaam en gebruik dit formulier om de naam te wijzigen',
	'25.title.en': 'Unknown direction of drivable road',
	'25.title': 'Onbekende rijrichting van berijdbare weg',
	'25.problem.en': '\'Unknown\' road direction will not prevent routing on the road',
	'25.problem': '\'Onbekende\' rijrichting zal niet voorkomen dat er genavigeerd wordt over de weg',
	'25.solution.en': 'Set the road direction',
	'25.solution': 'Stel de rijrichting in',
	'28.title.en': 'Street name on two-way Ramp',
	'28.title': 'Straatnaam op tweebaans voegstrook',
	'28.problem.en': 'If Ramp is unnamed, the name of a subsequent road will propagate backwards',
	'28.problem': 'Als de op/afrit geen naam heeft, zal de naam van de volgende straat worden overgenomen',
	'28.solution.en': 'In the address properties check the \'None\' box next to the street name and then click \'Apply\'',
	'28.solution': 'In de adreseigenschappen vink \'Geen\' aan naast de straatnaam en klik op \'Toepassen\'',
	'29.title.en': 'Street name on roundabout',
	'29.title': 'Straatnaam op rotonde',
	'29.problem.en': 'In Waze, we do not name roundabout segments',
	'29.problem': 'In Waze geven we rotondes geen straatnamen',
	'29.solution.en': 'In the address properties check the \'None\' box next to the street name, click \'Apply\' and then add \'Junction\' landmark to name the roundabout',
	'29.solution': 'In de adreseigenschappen vink \'Geen\' aan naast de straatnaam en klik op \'Toepassen\' en voeg eventueel een \'Kruispunt/Knooppunt\' toe met de naam van de rotonde',
	'33.enabled': false,
	'34.title.en': 'Empty alternate street',
	'34.title': 'Lege alternatieve straatnaam',
	'34.problem.en': 'Alternate street name is empty',
	'34.problem': 'De alternatieve straatnaam is leeg',
	'34.solution.en': 'Remove empty alternate street name',
	'34.solution': 'Verwijder de lege alternatieve straatnaam',
	'35.title.en': 'Unterminated drivable road',
	'35.title': 'Geen eindnode op berijdbare weg',
	'35.problem.en': 'Waze will not route from the unterminated segment',
	'35.problem': 'Waze zal niet routeren vanaf segmenten zonder eindnode',
	'35.solution.en': 'Move the segment a bit so the terminating node will be added automatically',
	'35.solution': 'Verplaats het segment een beetje zodat de eindnode automatisch zal worden toegevoegd',
	'36.enabled': true,
	'36.title.en': 'Node A: Unneeded (slow)',
	'36.title': 'Node A: Onnodig (langzaam)',
	'36.problem.en': 'Adjacent segments at node A are identical',
	'36.problem': 'De segmenten naast node A zijn identiek',
	'36.solution.en': 'Select node A and press Delete key to join the segments',
	'36.solution': 'Selecteer node A en druk op Delete om de segmenten samen te voegen',
	'37.enabled': true,
	'37.title.en': 'Node B: Unneeded (slow)',
	'37.title': 'Node B: Onnodig (langzaam)',
	'37.problem.en': 'Adjacent segments at node B are identical',
	'37.problem': 'De segmenten naast node B zijn identiek',
	'37.solution.en': 'Select node B and press Delete key to join the segments',
	'37.solution': 'Selecteer node B en druk op Delete om de segmenten samen te voegen',
	'38.title.en': 'Expired segment restriction (slow)',
	'38.title': 'Verlopen segment beperking (langzaam)',
	'38.problem.en': 'The segment has an expired restriction',
	'38.problem': 'Het segment heeft een verlopen beperking',
	'38.solution.en': 'Click \'Edit restrictions\' and delete the expired restriction',
	'38.solution': 'Klik op \'Bewerken restricties\' en verwijder de verstreken beperking',
	'39.title.en': 'Expired turn restriction (slow)',
	'39.title': 'Verlopen beperking op afslag (langzaam)',
	'39.problem.en': 'The segment has a turn with an expired restriction',
	'39.problem': 'Het segment heeft een afslag met een verlopen beperking',
	'39.solution.en': 'Click clock icon next to the yellow arrow and delete the expired restriction',
	'39.solution': 'Klik klok pictogram naast de gele pijl en verwijder de verlopen beperking',
	'41.title.en': 'Node A: Reverse connectivity of drivable road',
	'41.title': 'Node A: Omgekeerde connectiviteit van berijdbare weg',
	'41.problem.en': 'There is a turn which goes against the directionality of the segment at node A',
	'41.problem': 'Er is een afslag die indruist tegen de rijrichting van het segment op knooppunt A',
	'41.solution.en': 'Make the segment \'Two-way\', restrict all the turns at node A and then make the segment \'One way (A→B)\' again',
	'41.solution': 'Verander het segment in twee-richting, verbied de afslag bij node A en verander het segment weer in \'1-richting\', of verander het segment weer in \'One way (A→B)\'',
	'42.title.en': 'Node B: Reverse connectivity of drivable road',
	'42.title': 'Node B: Omgekeerde connectiviteit van berijdbare weg',
	'42.problem.en': 'There is a turn which goes against the directionality of the segment at node B',
	'42.problem': 'Er is een afslag die indruist tegen de rijrichting van het segment op knooppunt B',
	'42.solution.en': 'Make the segment \'Two-way\', restrict all the turns at node B and then make the segment \'One way (B→A)\' again',
	'42.solution': 'Verander het segment in twee-richting, verbied de afslag bij node B en verander het segment weer in \'1-richting\', Of verander het segment weer in \'One way (B→A)\'',
	'43.title.en': 'Self connectivity',
	'43.title': 'Zelf verbinding',
	'43.problem.en': 'The segment is connected back to itself',
	'43.problem': 'Het segment is met zichzelf verbonden',
	'43.solution.en': 'Split the segment into THREE pieces',
	'43.solution': 'Verdeel het segment in DRIE stukken',
	'44.title.en': 'No outward connectivity',
	'44.title': 'Geen verbinding naar buiten',
	'44.problem.en': 'The drivable segment has no single outward turn enabled',
	'44.problem': 'Het berijdbare segment heeft geen enkele verbinding naar buiten',
	'44.solution.en': 'Enable at least one outward turn from the segment',
	'44.solution': 'Verbind het segment minstens eenmaal met het verkeersnet',
	'45.title.en': 'No inward connectivity',
	'45.title': 'Geen verbinding naar binnen',
	'45.problem.en': 'The drivable non-private segment has no single inward turn enabled',
	'45.problem': 'Het berijdbare niet-privé segment heeft geen enkele verbinding naar het segment toe',
	'45.solution.en': 'Select an adjacent segment and enable at least one turn to the segment',
	'45.solution': 'Selecteer het segment en sta minstens één inwaartse verbinding toe',
	'46.title.en': 'Node A: No inward connectivity of drivable road (slow)',
	'46.title': 'Node A: Geen naar binnen connectiviteit van berijdbare weg (langzaam)',
	'46.problem.en': 'The drivable non-private segment has no single inward turn enabled at node A',
	'46.problem': 'De berijdbare niet-particuliere segment heeft geen enkele naar binnen wijzende verbinding ingeschakeld op knooppunt A',
	'46.solution.en': 'Select an adjacent segment and enable at least one turn to the segment at node A',
	'46.solution': 'Selecteer een aangrenzend segment en stel tenminste één verbinding naar segment bij knooppunt A in',
	'47.title.en': 'Node B: No inward connectivity of drivable road (slow)',
	'47.title': 'Node B: Het berijdbare segment heeft geen enkele verbinding naar het segment toe (langzaam)',
	'47.problem.en': 'The drivable non-private segment has no single inward turn enabled at node B',
	'47.problem': 'Het berijdbare (niet prive) segment heeft geen enkele verbinding naar het segment toe bij node B',
	'47.solution.en': 'Select an adjacent segment and enable at least one turn to the segment at node B',
	'47.solution': 'Selecteer een aangrenzend segment en stel tenminste één verbinding naar segment bij node B',
	'48.title.en': 'Two-way drivable roundabout segment',
	'48.title': 'Berijdbare rotonde segment is niet eenrichtingsverkeer',
	'48.problem.en': 'The drivable roundabout segment is bidirectional',
	'48.problem': 'Berijdbare rotonde segment is niet eenrichtingsverkeer',
	'48.solution.en': 'Redo the roundabout',
	'48.solution': 'Maak de rotonde opnieuw',
	'59.title.en': 'City name on Freeway',
	'59.title': 'Plaatsnaam op snelweg',
	'59.problem.en': 'City name on the Freeway may cause a city smudge',
	'59.problem': 'Plaatsnaam op de snelweg kan het uitsmeren van een stad veroorzaken',
	'59.problemLink': 'W:Benelux/Freeway',
	'59.solution.en': 'In the address properties check the \'None\' box next to the city name and then click \'Apply\'',
	'59.solution': 'In de adreseigenschappen stel de plaatsnaam in op \'Geen\' en klik op \'toepassen\'',
	'59.solutionLink': 'W:Creating_and_Editing_street_segments#Address_Properties',
	'71.enabled': true,
	'71.problemLink': 'W:Benelux/Major_Highway',
	'71.title.en': 'Must be a Major Highway',
	'71.title': 'Moet een Major Highway zijn',
	'71.problem.en': 'This segment must be a Major Highway',
	'71.problem': 'Dit segment moet een Major Highway zijn',
	'71.solution.en': 'Set the road type to Major Highway or change the road name',
	'71.solution': 'Stel het wegtype in op Major Highway of verander de straatnaam',
	'72.enabled': true,
	'72.problemLink': 'W:Benelux/Minor_Highway',
	'72.title.en': 'Must be a Minor Highway',
	'72.title': 'Dit moet een Minor Highway zijn',
	'72.problem.en': 'This segment must be a Minor Highway',
	'72.problem': 'Dit segment moet een Minor Highway zijn',
	'72.solution.en': 'Set the road type to Minor Highway or change the road name',
	'72.solution': 'Stel het wegtype in op Minor Highway of verander de straatnaam',
	'78.title.en': 'Same endpoints drivable segments (slow)',
	'78.title': 'Dezelfde eindpunten voor berijdbare segmenten (langzaam)',
	'78.problem.en': 'Two drivable segments share the same two endpoints',
	'78.problem': 'Twee berijdbare segmenten delen dezelfde twee eindpunten',
	'78.solution.en': 'Split the segment. You might also remove one of the segments if they are identical',
	'78.solution': 'Splits het segment. Je zou ook een segment kunnen verwijderen als ze identiek zijn',
	'87.title.en': 'Node A: Multiple outgoing segments at roundabout',
	'87.title': 'Node A: Meerdere uitgaande segmenten voor rotonde',
	'87.problem.en': 'The drivable roundabout node A has more than one outgoing segment connected',
	'87.problem': 'De berijdbare rotonde knooppunt A heeft meerdere uitgaande segmenten verbonden',
	'87.solution.en': 'Redo the roundabout',
	'87.solution': 'Maak de rotonde opnieuw',
	'99.title.en': 'U-turn at roundabout entrance (slow)',
	'99.title': 'U-bocht op rotonde (langzaam)',
	'99.problem.en': 'The roundabout entrance segment has a U-turn enabled',
	'99.problem': 'De berijdbare rotondenode heeft een U-bocht toegestaan',
	'99.solution.en': 'Disable U-turn',
	'99.solution': 'Zet de U-bocht uit',
	'101.title.en': 'Closed road (only available in the report)',
	'101.title': 'Afgesloten weg (enkel beschikbaar in het rapport)',
	'101.problem.en': 'The segment is marked as closed',
	'101.problem': 'Het segment is gemarkeerd als afgesloten',
	'101.solution.en': 'If the construction is done, restore the segment connectivity and remove the suffix',
	'101.solution': 'Als de wegwerkzaamheden klaar zijn, herstel dan de verbinding van het segment en verwijder de aanvulling',
	'101.params': {'regexp': '/(^|\\b)afgesloten(\\b|$)/i'},
	'102.title.en': 'Node A: No outward connectivity of drivable road (slow)',
	'102.title': 'Node A: Geen uitgaande verbinding van berijdbare weg (langzaam)',
	'102.problem.en': 'The drivable segment has no single outward turn enabled at node A',
	'102.problem': 'Het berijdbare segment heeft geen enkele uitgaande verbinding aan staan bij node A',
	'102.solution.en': 'Enable at least one outward turn from the segment at node A',
	'102.solution': 'Zet minstens 1 uitgaande verbinding aan bij node A',
	'103.title.en': 'Node B: No outward connectivity of drivable road (slow)',
	'103.title': 'Node B: Geen uitgaande verbinding van berijdbare weg (langzaam)',
	'103.problem.en': 'The drivable segment has no single outward turn enabled at node B',
	'103.problem': 'Het berijdbare segment heeft geen enkele uitgaande verbinding aan staan bij node B',
	'103.solution.en': 'Enable at least one outward turn from the segment at node B',
	'103.solution': 'Zet minstens 1 uitgaande verbinding aan bij node B',
	'104.title.en': 'Railroad used for comments',
	'104.title': 'Spoorweg gebruikt als commentaar',
	'104.problem.en': 'The Railroad segment is probably used as a map comment',
	'104.problem': 'Het spoorweg segment wordt waarschijnelijk gebruikt als kaartopmerking',
	'104.solution.en': 'Remove the comment as Railroads will be added to the client display',
	'104.solution': 'Verwijder het commentaar, spoorwegen worden weergegeven in de client',
	'107.title.en': 'Node A: No connection (slow)',
	'107.title': 'Node A: Geen verbinding (langzaam)',
	'107.problem.en': 'The node A of the drivable segment is within 5m from another drivable segment but not connected by a junction',
	'107.problem': 'De node A van een berijdbaar segment is binnen 5 meter van een ander berijdbaar segment, maar is niet verbonden via een kruising',
	'107.solution.en': 'Drag the node A to the nearby segment so that it touches or move it a bit further away',
	'107.solution': 'Sleep de node A naar het dichtbij gelegen segment zodat deze verbonden worden, of sleep de node iets verder weg van het andere segment',
	'108.title.en': 'Node B: No connection (slow)',
	'108.title': 'Node B: Geen verbinding (langzaam)',
	'108.problem.en': 'The node B of the drivable segment is within 5m from another drivable segment but not connected by a junction',
	'108.problem': 'De node B van een berijdbaar segment is binnen 5 meter van een ander berijdbaar segment, maar is niet verbonden via een kruising',
	'108.solution.en': 'Drag the node B to the nearby segment so that it touches or move it a bit further away',
	'108.solution': 'Sleep de node B naar het dichtbij gelegen segment zodat deze verbonden worden, of sleep de node iets verder weg van het andere segment',
	'109.title.en': 'Too short segment',
	'109.title': 'Te kort segment',
	'109.problem.en': 'The drivable non-terminal segment is less than ${n}m long so it is hard to see it on the map and it can cause routing problems',
	'109.problem': 'Het berijdbaar, niet doodlopend, segment is korter dan ${n}m, dit is moeilijk te zien op de kaart en kan voor routerings problemen zorgen',
	'109.solution.en': 'Increase the length, or remove the segment, or join it with one of the adjacent segments',
	'109.solution': 'Verleng het segment, of verwijder het segment, of voeg het segment samen met een van de omliggende segmenten',
	'112.title.en': 'Too long Ramp name',
	'112.title': 'Op/afrit naam te lang',
	'112.problem.en': 'The Ramp name is more than ${n} letters long',
	'112.problem': 'Op/afrit naam is langer dan ${n} tekens lang',
	'112.solution.en': 'Shorten the Ramp name',
	'112.solution': 'Verkort de naam',
	'114.enabled': false,
	'114.title.en': 'Node A: Non-drivable connected to drivable (slow)',
	'114.title': 'Node A: Niet-berijdbaar verbonden met berijdbaar (langzaam)',
	'114.problem.en': 'The non-drivable segment makes a junction with a drivable at node A',
	'114.problem': 'Het niet-berijdbare segment maakt verbinding met een berijdbaar segment bij node A',
	'114.solution.en': 'Disconnect node A from all of the drivable segments',
	'114.solution': 'Verbreek de vervinding van alle berijdbare segmenten bij node A',
	'115.enabled': false,
	'115.title.en': 'Node B: Non-drivable connected to drivable (slow)',
	'115.title': 'Node B: Niet-berijdbaar verbonden met berijdbaar (langzaam)',
	'115.problem.en': 'The non-drivable segment makes a junction with a drivable at node B',
	'115.problem': 'Het niet-berijdbare segment maakt verbinding met een berijdbaar segment bij node B',
	'115.solution.en': 'Disconnect node B from all of the drivable segments',
	'115.solution': 'Verbreek de vervinding van alle berijdbare segmenten bij node B',
	'116.title.en': 'Out of range elevation',
	'116.title': 'Hoogte buiten bereik',
	'116.problem.en': 'The segment elevation is out of range',
	'116.problem': 'De elevatie van het segment is buiten bereik',
	'116.solution.en': 'Correct the elevation',
	'116.solution': 'Corrigeer de hoogte',
	'117.title.en': 'Obsolete CONST ZN marker',
	'117.title': 'CONST ZN markering verouderd',
	'117.problem.en': 'The segment is marked with obsolete CONST ZN suffix',
	'117.problem': 'Het segment is gemarkeerd met een verouderde CONST ZN toevoeging',
	'117.solution.en': 'Change CONST ZN to (closed)',
	'117.solution': 'Verander CONST ZN naar (afgesloten)',
	'118.title.en': 'Node A: Overlapping segments (slow)',
	'118.title': 'Node A: Overlappende segmenten (langzaam)',
	'118.problem.en': 'The segment is overlapping with the adjacent segment at node A',
	'118.problem': 'Het segment overlapt het aangrenzende segment bij node A',
	'118.solution.en': 'Spread the segments at 2° or delete unneeded geometry point or delete the duplicate segment at node A',
	'118.solution': 'Verdeel de segmenten bij 2° of verwijder overbodige geometriepunt of verwijder het duplicaat-segment bij node A',
	'119.title.en': 'Node B: Overlapping segments (slow)',
	'119.title': 'Node B: Overlappende segmenten (langzaam)',
	'119.problem.en': 'The segment is overlapping with the adjacent segment at node B',
	'119.problem': 'Het segment overlapt het aangrenzende segment bij node B',
	'119.solution.en': 'Spread the segments at 2° or delete unneeded geometry point or delete the duplicate segment at node B',
	'119.solution': 'Verdeel de segmenten bij 2° of verwijder overbodige geometriepunt of verwijder het duplicaat-segment bij node B',
	'120.title.en': 'Node A: Too sharp turn (slow)',
	'120.title': 'Node A: Te scherpe bocht (langzaam)',
	'120.problem.en': 'The drivable segment has a very acute turn at node A',
	'120.problem': 'Het berijdbare segment heeft een zeer scherpe bocht bij node A',
	'120.solution.en': 'Disable the sharp turn at node A or spread the segments at 30°',
	'120.solution': 'Sta de scherpe bocht bij node A niet toe of maak de hoek groter dan 30°',
	'121.title.en': 'Node B: Too sharp turn (slow)',
	'121.title': 'Node B: Te scherpe bocht (langzaam)',
	'121.problem.en': 'The drivable segment has a very acute turn at node B',
	'121.problem': 'Het berijdbare segment heeft een zeer scherpe bocht bij B',
	'121.solution.en': 'Disable the sharp turn at node B or spread the segments at 30°',
	'121.solution': 'Sta de scherpe bocht bij node B niet toe of maak de hoek groter dan 30°',
	'128.title.en': 'User-defined custom check (green)',
	'128.title': 'Door de gebruiker gedefinieerde aangepaste controle (groen)',
	'128.problem.en': 'Some of the segment properties matched against the user-defined regular expression (see Settings→Custom)',
	'128.problem': 'Sommige segmenteigenschappen komen overeen met door gebruiker gedefinieerde opgave (zie Instellingen→Aangepast)',
	'128.solution.en': 'Solve the issue',
	'128.solution': 'Los het probleem op',
	'129.title.en': 'User-defined custom check (blue)',
	'129.title': 'Door de gebruiker gedefinieerde aangepaste controle (blauw)',
	'129.problem.en': 'Some of the segment properties matched against the user-defined regular expression (see Settings→Custom)',
	'129.problem': 'Sommige segmenteigenschappen komen overeen met door gebruiker gedefinieerde opgave (zie Instellingen→Aangepast)',
	'129.solution.en': 'Solve the issue',
	'129.solution': 'Los het probleem op',
	'150.enabled': true,
	'150.problemLink': 'W:Benelux/Freeway',
	'150.title.en': 'No lock on Freeway',
	'150.title': 'Geen lock op snelweg',
	'150.problem.en': 'The Freeway segment should be locked at least to Lvl ${n}',
	'150.problem': 'De snelweg moet op tenminste Lvl ${n} gelockt zijn',
	'150.solution.en': 'Lock the segment',
	'150.solution': 'Lock het segment',
	'151.enabled': true,
	'151.problemLink': 'W:Benelux/Major_Highway',
	'151.title.en': 'No lock on Major Highway',
	'151.title': 'Geen lock op Major Highway',
	'151.problem.en': 'The Major Highway segment should be locked at least to Lvl ${n}',
	'151.problem': 'Het Major Highway segment moet gelockt zijn op Lvl ${n}',
	'151.solution.en': 'Lock the segment',
	'151.solution': 'Lock het segment',
	'152.enabled': true,
	'152.problemLink': 'W:Benelux/Minor_Highway',
	'152.title.en': 'No lock on Minor Highway',
	'152.title': 'Geen lock op Minor Highway',
	'152.problem.en': 'The Minor Highway segment should be locked at least to Lvl ${n}',
	'152.problem': 'Het Minor Highway segment moet gelockt zijn op Lvl ${n}',
	'152.solution.en': 'Lock the segment',
	'152.solution': 'Lock het segment',
	'153.enabled': true,
	'153.problemLink': 'W:Benelux/Ramp',
	'153.title.en': 'No lock on Ramp',
	'153.title': 'Geen lock op op/afrit',
	'153.problem.en': 'The Ramp segment should be locked at least to Lvl ${n}',
	'153.problem': 'De op/afrit zou minimaal gelockt moeten zijn op Lvl ${n}',
	'153.params': {'n': 4},
	'154.enabled': true,
	'154.problemLink': 'W:Benelux/Primary_Street',
	'154.title.en': 'No lock on Primary Street',
	'154.title': 'Geen lock op hoofdweg',
	'154.problem.en': 'The Primary Street segment should be locked at least to Lvl ${n}',
	'154.problem': 'De hoofdweg zou minimaal gelockt moeten zijn op Lvl ${n}',
	'154.solution.en': 'Lock the segment',
	'154.solution': 'Lock het segment',
	'160.enabled': false,
	'161.enabled': true,
	'161.params': {
	  'solutionEN': 'Rename the Major Highway to \'Nnum[ - Nnum]\' or \'Nnum - streetname\' or \'Nnum ri Dir1 / Dir2\'',
	  'regexp': '!/^N([0-9]|[0-9][0-9]|[123][0-9][0-9])( - [NS][0-9]+)?(( ri [^\\/]+( \\/ [^\\/]+)*)|( - .+))?$/'
	},
	'161.problemLink': 'W:Benelux/Major_Highway',
	'161.title.en': 'Incorrect Major Highway name',
	'161.title': 'Verkeerde  Major Highway naam',
	'161.problem.en': 'The Major Highway segment has incorrect street name',
	'161.problem': 'Het Major Highway segment heeft een verkeerde  straatnaam',
	'161.solution.en': 'Rename the segment in accordance with the guidelines',
	'161.solution': 'Hernoem het segment volgens de richtlijnen',
	'162.enabled': true,
	'162.params': {
	  'solutionEN': 'Rename the Minor Highway to \'Nnum[ - Nnum]\' or \'Nnum - streetname\' or \'Nnum ri Dir1 / Dir2\'',
	  'regexp': '!/^(N[4-9][0-9][0-9]|[SU][0-9]+)( - [NS][0-9]+)?(( ri [^\\/]+( \\/ [^\\/]+)*)|( - .+))?$/'
	},
	'162.problemLink': 'W:Benelux/Minor_Highway',
	'162.title.en': 'Incorrect Minor Highway name',
	'162.title': 'Verkeerde Minor Highway naam',
	'162.problem.en': 'The Minor Highway segment has incorrect street name',
	'162.problem': 'Het Minor Highway segment heeft een verkeerde straatnaam',
	'162.solution.en': 'Rename the segment in accordance with the guidelines',
	'162.solution': 'Hernoem het segment volgens de richtlijnen. LET OP! Er zijn uitzonderingen voor bepaalde belangrijke regionale wegen. In geval van twijfel, eerst overleggen!',
	'172.title.en': 'Unneeded spaces in street name',
	'172.title': 'Onnodige spaties in de straatnaam',
	'172.problem.en': 'Leading/trailing/double space in the street name',
	'172.problem': 'Overbodige spaties voor/achter/in de straatnaam',
	'172.solution.en': 'Remove unneeded spaces from the street name',
	'172.solution': 'Verwijder de overbodige spaties in de straatnaam',
	'173.title.en': 'No space before/after street abbreviation',
	'173.title': 'Geen spatie voor/achter de straat afkorting',
	'173.problem.en': 'No space before (\'1943r.\') or after (\'st.Jan\') an abbreviation in the street name',
	'173.problem': 'Geen spatie voor (\'1943r.\') of achter (\'st.Jan\') een afkorting in de straatnaam',
	'173.solution.en': 'Add a space before/after the abbreviation',
	'173.solution': 'Voeg een spatie voor/achter de afkorting toe',
	'175.title.en': 'Empty street name',
	'175.title': 'Lege straatnaam',
	'175.problem.en': 'The street name has only space characters or a dot',
	'175.problem': 'De straatnaam heeft alleen spaties of punt(en)',
	'175.solution.en': 'In the address properties check the \'None\' box next to the street name, click \'Apply\' OR set a proper street name',
	'175.solution': 'In de adreseigenschappen vink de \'Geen\' optie aan naast de straatnaam, klik op \'Toepassen\' OF vul de juiste straatnaam in',
	'190.title.en': 'Lowercase city name',
	'190.title': 'Plaatsnaam in kleine letters',
	'190.problem.en': 'The city name starts with a lowercase letter',
	'190.problem': 'De plaatsnaam begint met een kleine letter',
	'190.solution.en': 'Use this form to rename the city',
	'190.solution': 'Gebruik dit formulier om de plaatsnaam te hernoemen',
	'192.title.en': 'Unneeded spaces in city name',
	'192.title': 'Onnodige spaties in de plaatsnaam',
	'192.problem.en': 'Leading/trailing/double space in the city name',
	'192.problem': 'Overbodige spaties voor/achter/in de plaatsnaam',
	'192.solution.en': 'Use this form to rename the city',
	'192.solution': 'Gebruik dit formulier om de plaatsnaam te hernoemen',
	'193.title.en': 'No space before/after city abbreviation',
	'193.title': 'Geen spatie voor/achter de afkorting in de plaatsnaam',
	'193.problem.en': 'No space before (\'1943r.\') or after (\'st.Jan\') an abbreviation in the city name',
	'193.problem': 'Geen spatie voor (\'1943r.\') of achter (\'st.Jan\') een afkorting in de plaatsnaam',
	'193.solution.en': 'Use this form to rename the city',
	'193.solution': 'Gebruik dit formulier om de plaatsnaam te hernoemen',
	'200.title.en': 'Node A: Unconfirmed turn on minor road',
	'200.title': 'Node A: Onbevestigde verbinding op weg',
	'200.problem.en': 'The minor drivable segment has an unconfirmed (soft) turn at node A',
	'200.problem': 'Het berijdbare segment heeft een onbevestigd (zachte) bocht op node A',
	'200.solution.en': 'Click the turn indicated with a purple question mark to confirm it. Note: you may need to make the segment \'Two-way\' in order to see those turns',
	'200.solution': 'Klik op de aangegeven verbinding met een paarse vraagteken om het te bevestigen. Opmerking: het kan nodig zijn om het segment 2-richtingen te maken om die verbindingen te zien',
	'201.title.en': 'Node A: Unconfirmed turn on primary road',
	'201.title': 'Node A: Onbevestigde verbinding op hoofdweg',
	'201.problem.en': 'The primary segment has an unconfirmed (soft) turn at node A',
	'201.problem': 'Het hoofdweg segment heeft een onbevestigde (zachte) verbinding bij node A',
	'201.solution.en': 'Click the turn indicated with a purple question mark to confirm it. Note: you may need to make the segment \'Two-way\' in order to see those turns',
	'201.solution': 'Klik op de aangegeven verbinding met een paarse vraagteken om het te bevestigen. Opmerking: het kan nodig zijn om het segment 2-richtingen te maken om die verbindingen te zien',
	'202.title.en': 'BETA: No public connection for public segment (slow)',
	'202.title': 'BETA: Routeerbaar segment lijkt geisoleerd (langzaam)',
	'202.problem.en': 'The public segement is not connected to any other public segment',
	'202.problem': 'Het segment lijkt een publiek toegankelijk segment in het midden van niet publieke segmenten te zijn',
	'202.solution.en': 'Verify if the segment is meant to be a public accessible segment, or it should be changed to a private segment',
	'202.solution': 'Controleer of dit segment wel publiek toegankelijk moet zijn, of van type moet wijzigen',
	'214.params': {'regexp': '/^5|15|25|.+0$/'},
	'215.params': {'regexp': '/^5|15|25|.+0$/'},
	'250.enabled': true,
	'250.title': 'Plaats heeft geen plaatsnaam ingesteld',
	'250.problem': 'Deze plaats heeft geen plaatsnaam ingesteld. Elke plaats zou een plaatsnaam gegesteld moeten hebben',
	'250.solution': 'Stel de plaatsnaam in voor deze plaats',
	'251.problem': 'De plaats was automatisch aangepast door Waze',
	'251.solution': 'Controleer de plaats details en pas deze aan als het nodig is',
	'251.params': {
	  'regexp.title': '{string} regular expression to match bot names and ids',
	  'regexp': '/^waze-maint|^105774162$|^waze3rdparty$|^361008095$|^WazeParking1$|^338475699$|^admin$|^-1$|^avsus$|^107668852$/i'
	},
	'252.title': 'Geen type ingesteld voor parkeerplaats',
	'252.problem': 'Het type is niet ingesteld voor de parkeerplaats',
	'252.solution': 'Stel het type in op Openbaar, Beperkt of Privé',
	'253.title': 'Geen kosten ingesteld voor parkeerplaats',
	'253.problem': 'De kosten voor de parkeerplaats is niet ingesteld',
	'253.solution': 'Stel de kosten in op Gratis, Laag, Gemiddeld of Hoog',
	'254.title': 'Geen betaalmogelijkheden ingesteld voor parkeerplaats',
	'254.problem': 'De betaalmogelijkheden zijn niet ingesteld voor de parkeerplaats',
	'254.solution': 'Stel de juiste betaalmogelijkheden in',
	'255.title': 'Geen niveau ingesteld voor parkeerplaats',
	'255.problem': 'De hoogte is niet ingesteld voor de parkeerplaats',
	'255.solution': 'Stel de juiste hoogte in voor de parkeerplaats',
	'256.title': 'Geen in-/uitgang punt ingesteld voor plaats',
	'256.problem': 'Er is geen in-/uitgang punt ingesteld voor de plaats',
	'256.solution': 'Stel de juiste in-/uitgang punt in voor de plaats',
	'257.title': 'Geen in-/uitgang punt ingesteld voor parkeerplaats',
	'257.problem': 'De parkeerplaats heeft geen in-/uitgang ingesteld',
	'257.solution': 'Stel de juiste in-/uitgang in voor de parkeerplaats',
	'258.title': 'Geen plaatsnaam ingesteld voor park',
	'258.problem': 'Het park heeft geen plaatsnaam ingesteld',
	'258.solution': 'Stel de juiste plaatsnaam in of verander de categorie naar Bos/Bomen',
	'259.title': 'Geen merk in naam van benzinepomp',
	'259.problem': 'Het merk van de benzinepomp komt niet voor in de naam',
	'259.solution': 'Voeg het merk toe in de naam van de benzinepomp',
	'260.title': 'Missend lock op benzinepomp',
	'260.problem': 'Een benzinepomp moet minimaal gelockt zijn op Lvl ${n}',
	'260.solution': 'Lock de benzinepomp naar het juiste level',
	'260.params': {'n.title': '{number} minimum lock level', 'n': 3},
	'261.enabled': false,
	'261.title': 'Categorie \'OVERIGE\' kan beter niet gebruikt worden',
	'261.problem': 'De categorie \'OVERIGE\' is niet nuttig. Gebruikers kunnen zoeken op een categorie en OVERIGE bied geen houvast',
	'261.solution': 'Selecteer de juiste categorie voor de plaats',
	'262.title': 'Fout telefoon nummer',
	'262.problem': 'De plaats heeft een fout telefoon nummer',
	'262.solution': 'In Nederland gebruiken we +31 AA BBBBBBBB, of +31 AAA BBBBBBB voor vaste lijnen en +31 6 CBBBBBBB voor mobiele nummers. Corrigeer het telefoon nummer volgens die formaten',
	'262.solutionLink': 'P:Benelux/Places#More_Info_tab',
	'262.params': {'regexp.title': '{string} regular expression to match a correct phone number', 'regexp': '/\\+31(?: \\d{2} \\d{8}| \\d{3} \\d{6}|\\s6 \\d{8})/'},
	'263.title': 'Onjuiste URL',
	'263.problem': 'De plaats heeft een onjuiste URL',
	'263.solution': 'Controleer de URL. Binnen Nederland geven we de URL het format www.adress.extension en laten we de http(s):// vervallen',
	'263.solutionLink': 'P:Benelux/Places#More_Info_tab',
	'263.params': {'regexp.title': '{string} regular expression to match a correct URL', 'regexp': '/^([da-z.-]+.[a-z.]{2,6}|[d.]+)([/:?=&#]{1}[da-z.-]+)*[/?]?$/i'},
	'264.enabled': true,
	'264.title': 'Plaats moet een gebied zijn',
	'264.problem': 'Plaats is ingesteld als een punt, maar moet een gebied zijn',
	'264.solution': 'Converteer de plaats naar een gebied',
	'264.solutionLink': 'P:Benelux/Place_categories',
	'264.params': {
	  'regexp.title': '{string} regular expression to match categories that should be a area',
	  'regexp':
		  '/^(GAS_STATION|PARKING_LOT|FERRY_PIER|BUS_STATION|AIRPORT|BRIDGE|JUNCTION_INTERCHANGE|TRAIN_STATION|CITY_HALL|SEAPORT_MARINA_HARBOR|TUNNEL|CEMETERY|COLLEGE_UNIVERSITY|COURTHOUSE|CONVENTIONS_EVENT_CENTER|FIRE_DEPARTMENT|FACTORY_INDUSTRIAL|HOSPITAL_URGENT_CARE|MILITARY|POLICE_STATION|PRISON_CORRECTIONAL_FACILITY|SCHOOL|SHOPPING_CENTER|CASINO|RACING_TRACK|STADIUM_ARENA|THEME_PARK|ZOO_AQUARIUM|SPORTS_COURT|CONSTRUCTION_SITE|BEACH|GOLF_COURSE|PARK|SKI_AREA|FOREST_GROVE|ISLAND|FURNITURE_HOME_STORE|SEA_LAKE_POOL|RIVER_STREAM|MARKET|CANAL|SWAMP_MARSH|DAM)$/'
	},
	'265.enabled': true,
	'265.title': 'Plaats moet een punt zijn',
	'265.problem': 'Plaats is ingesteld als een gebied, maar zou een punt moeten zijn',
	'265.solution': 'Converteer de plaats naar een punt',
	'265.solutionLink': 'P:Benelux/Place_categories',
	'265.params': {
	  'regexp.title': '{string} regular expression to match categories that should be a point',
	  'regexp':
		  '/^(GARAGE_AUTOMOTIVE_SHOP|CAR_WASH|CHARGING_STATION|SUBWAY_STATION|TAXI_STATION|REST_AREAS|GOVERNMENT|LIBRARY|ORGANIZATION_OR_ASSOCIATION|DOCTOR_CLINIC|OFFICES|POST_OFFICE|RELIGIOUS_CENTER|KINDERGARDEN|EMBASSY_CONSULATE|INFORMATION_POINT|EMERGENCY_SHELTER|TRASH_AND_RECYCLING_FACILITIES|ARTS_AND_CRAFTS|BANK_FINANCIAL|SPORTING_GOODS|BOOKSTORE|PHOTOGRAPHY|CAR_DEALERSHIP|FASHION_AND_CLOTHING|CONVENIENCE_STORE|PERSONAL_CARE|DEPARTMENT_STORE|PHARMACY|ELECTRONICS|FLOWERS|GIFTS|GYM_FITNESS|SWIMMING_POOL|HARDWARE_STORE|SUPERMARKET_GROCERY|JEWELRY|LAUNDRY_DRY_CLEAN|MUSIC_STORE|PET_STORE_VETERINARIAN_SERVICES|TOY_STORE|TRAVEL_AGENCY|ATM|CURRENCY_EXCHANGE|CAR_RENTAL|TELECOM|RESTAURANT|BAKERY|DESSERT|CAFE|FAST_FOOD|FOOD_COURT|BAR|ICE_CREAM|ART_GALLERY|CLUB|TOURIST_ATTRACTION_HISTORIC_SITE|MOVIE_THEATER|MUSEUM|MUSIC_VENUE|PERFORMING_ARTS_VENUE|GAME_CLUB|THEATER|HOTEL|HOSTEL|COTTAGE_CABIN|BED_AND_BREAKFAST|PLAYGROUND|PLAZA|PROMENADE|POOL|SCENIC_LOOKOUT_VIEWPOINT)$/'
	},
	'266.enabled': true,
	'266.title': 'Geen lock op plaats',
	'266.problem': 'Volgens de categorie zou de plaats minimaal gelockt moeten zijn op Lvl ${n}',
	'266.solution': 'Lock de plaats',
	'266.solutionLink': 'P:Benelux/Place_categories',
	'266.params': {
	  'n.title': '{number} minimum lock level',
	  'n': 2,
	  'regexp.title': '{string} regular expression to match categories that should be locked to {number}',
	  'regexp': '/^(PARKING_LOT|CHARGING_STATION)$/'
	},
	'267.enabled': true,
	'267.title': 'Geen lock op plaats',
	'267.problem': 'Volgens de categorie zou de plaats minimaal gelockt moeten zijn op Lvl ${n}',
	'267.solution': 'Lock de plaats',
	'267.solutionLink': 'P:Benelux/Place_categories',
	'267.params': {'n.title': '{number} minimum lock level', 'n': 3, 'regexp.title': '{string} regular expression to match categories that should be locked to {number}', 'regexp': '/(AIRPORT)/'},
	'268.title': 'Plaats heeft geen straat ingesteld',
	'268.problem': 'Deze plaats heeft geen straat ingesteld. Elke plaats zou een straat ingesteld moeten hebben',
	'268.solution': 'Stel de straat in voor deze plaats'
  },
  'MY': {
	'.codeISO': 'MY',
	'.country': 'Malaysia',
	'69.enabled': true,
	'73.enabled': true,
	'150.enabled': true,
	'150.params': {'n': 2},
	'151.enabled': true,
	'151.params': {'n': 2},
	'152.enabled': true,
	'152.params': {'n': 2}
  },
  'MX': {
	'.codeISO': 'MX',
	'.country': 'Mexico',
	'.updated': '2018-09-19',
	'.author': 'carloslaso',
	'.fallbackCode': 'ES',
	'.lng': ['ES-419'],
	'city.consider': 'Considera el siguiente nombre de ciudad:',
	'city.1': 'El nombre de la ciudad es muy corto',
	'city.2': 'Poner la Abreviación con palabra completa',
	'city.3': 'Escribir el nombre corto',
	'city.4': 'Escribir el Nombre de Ciudad',
	'city.5': 'Corregir Mayúsculas / Minúsculas',
	'city.6': 'Checar el orden de las palabras',
	'city.7': 'Checar Abreviación',
	'city.8r': 'Quitar nombre de País',
	'city.9': 'Verificar nombre de País',
	'city.10r': 'Quitar palabra',
	'city.12': 'Existen nombres iguales con distinto número de Identificador de Ciudad',
	'city.13a': 'Añadir un espacio',
	'city.13r': 'Quitar un espacio',
	'city.14': 'Verificar el número',
	'props.skipped.problem': 'El segmento ha sido modificado después del 01-05-2014 y bloqueado por Ud., por lo que el Validator no lo verificó',
	'err.regexp': 'Error analizando la opción #${n}:',
	'props.disabled': 'WME Validator está desactivado',
	'props.limit.title': 'Demasiados problemas reportados',
	'props.limit.problem': 'Hay demasiados problemas reportados por lo que algunos de ellos pueden no mostrarse',
	'props.limit.solution': 'Deje de seleccionar el segmento y pare el proceso de análisis. Luego presione el botón con la \'✘\' de color rojo (Borrar Reporte)',
	'props.reports': 'Reportes',
	'report.save': 'Almacena el reporte',
	'report.list.andUp': 'y más',
	'report.list.reportOnly': 'Sólo en el reporte',
	'report.list.forCountries': 'Para Países:',
	'report.list.params': 'Parámetros pare configurar en el Paquete de localización:',
	'report.list.params.set': 'Configuración Actual para ${country}:',
	'report.list.enabled': 'Hay ${n} parámetros activados para',
	'report.list.disabled': 'Hay ${n} parámetros desactivados para',
	'report.list.total': 'Hay ${n} parámetros disponibles',
	'report.list.title': 'Complete la lista de parámetros para',
	'report.list.checks': 'Ajustes->Acerca de->Parámetros disponibles',
	'report.segments': 'Segmentos totales revisados:',
	'report.reported': 'Reportado(s)',
	'report.warnings': 'avisos',
	'report.link.forum': 'foro',
	'report.link.other': 'enlace',
	'report.title': 'Reporte del WME Validator',
	'report.source': 'Fuente del reporte:',
	'report.filter.streets': 'Calles y vías de Servicio',
	'report.filter.other': 'Otras vías transitables y no transitables',
	'report.filter.noneditable': 'segmentos no editables',
	'report.filter.excluded': 'están excluidas de este reporte',
	'report.search.updated.since': 'actualizado desde el',
	'report.search.title': 'Buscar:',
	'report.search.included': 'están incluidos en el reporte.',
	'report.beta.warning': 'Advertencia del WME Beta!',
	'report.beta.text': 'Este reporte está generado en el WME Beta con permalinks beta.',
	'report.beta.share': 'Por favor, no comparta estos permalinks!',
	'report.size.warning':
		'<b>Advertencia!</b><br>Este reporte tiene ${n} caracteres por lo que <b>no cabrá</b> en un solo mensaje privado o del foro.\n<br>Por favor añada<b>más filtros</b> para reducir el tamaño del reporte.',
	'report.note.limit': '* Nota: Existieron muchas irregularidades en el reporte, por lo que algunas no están tomadas en cuenta en el resumen.',
	'report.forum': 'Para motivar mayor desarrollo, por favor deje su comentario en el',
	'report.forum.link': 'Hilo del foro de Waze.',
	'report.thanks': 'Gracias por usar el WME Validator!',
	'msg.limit.segments': 'Existen demasiados segmentos.\n\nPulse\'Show report\'para revisar el reporte, luego\n',
	'msg.limit.segments.continue': 'pulse \'▶\' (Play) para continuar.',
	'msg.limit.segments.clear': 'pulse \'✘\' (Clear) para borrar el reporte.',
	'msg.pan.text': 'Mueva el mapa para validarlo',
	'msg.zoomout.text': 'Aleje el zoom para comenzar el WME Validator',
	'msg.click.text': 'Pulse \'▶\' (Play) para validar el área visible del mapa',
	'msg.autopaused': 'paro automático',
	'msg.autopaused.text': '¡Paro automático! Pulse \'▶\' (Play) para continuar.',
	'msg.finished.text': 'Pulse <b>\'Show report\'</b> para revisar los problemas en el mapa',
	'msg.finished.tip': 'Pulse \'✉\' (Share) button para hacer un reporte en el\nforo o en un mensaje privado',
	'msg.noissues.tip': 'Trata de quitar algunas opciones de filtrado o inicia el WME Validator sobre otra área del mapa',
	'msg.scanning.text': '¡Analizando! Terminando en ~ ${n} min',
	'msg.scanning.text.soon': '¡Analizando! Terminando en un minuto!',
	'msg.scanning.tip': 'Pulse el botón de \'Pause\' para pausar o \'■\' (Stop) para detener el análisis',
	'msg.starting.text': '¡Comenzando! Las capas se han deshabilitado para analizar más rápido!',
	'msg.starting.tip': 'Utilice el botón\'Pause\' para pausar o el botón \'■\' para parar',
	'msg.paused.text': '¡En Pausa! pulse el botón de \'▶\' (Play) para continuar.',
	'msg.paused.tip': 'Para ver el reporte pulse el botón de \'Show report\' (si está disponible) ',
	'msg.continuing.tip': 'El WME Validator continuará desde la localización donde fue pausado',
	'msg.settings.text': 'Pulse <b>\'Back\'</b> para regresar a la vista principal',
	'msg.settings.tip': '¡Pulse el botón de \'Reset defaults\' para resetear todos los ajustes en un click!',
	'msg.reset.text': 'Todas las opciones y ajustes han sido devueltos a su estado original',
	'msg.reset.tip': 'Pulse el botón de \'Back\' para regresar a la vista principal',
	'msg.textarea.pack':
		'Este es un Script alojado enGreasemonkey/Tampermonkey. Puedes copiar y pegar el texto en un <b>nuevo archivo .user.js</b><br>o <b>pegarlo directamente</b> en Greasemonkey/Tampermonkey',
	'msg.textarea': 'Por favor copia el texto de abajo y pegalo en el foro o en un mensaje privado',
	'noaccess.text':
		'<b>Lo sentimos,</b><br>No puedes usar el WME Validator aquí.<br>Por favor revisa <a target=\'_blank\' href=\'https://www.waze.com/forum/viewtopic.php?t=76488\'>este hilo en el foro</a><br>para mayor información.',
	'noaccess.tip': '¡Por favor revisa el hilo del foro para mayor información',
	'tab.switch.tip.on': 'Para encender el resaltado pulsa (Alt+V)',
	'tab.switch.tip.off': 'Para apagar el resaltado pulsa (Alt+V)',
	'tab.filter.tip': 'Opciones para filtrar el reporte y los segmentos resaltados',
	'tab.search.text': 'búsqueda',
	'tab.search.tip': 'Opciones avanzadas de filtrado para inculír segmentos específicos solamente',
	'tab.help.tip': '¿Necesita ayuda?',
	'filter.noneditables.text': 'Excluir los segmentos <b>no editables</b>',
	'filter.noneditables.tip': 'No reportar los segmentos bloqueados o\nsegmentos fuera de mis áreas de edción',
	'filter.duplicates.text': 'No incluir segmentos <b>duplicados</b>',
	'filter.duplicates.tip': 'No mostrar el mismo segmento en distintas\npartes del reporte\n* Nota: Esta opción NO afecta el resaltado',
	'filter.streets.text': 'No incluir <b>Calles y Vías de Servicio</b>',
	'filter.other.text': 'No incluir <b>Otras vías conducibles y no conducibles</b>',
	'filter.other.tip': 'No reportar Vías de Tierra, Vías de estacionamiento, Vías privadas ni \nsegmentos no conducibles',
	'filter.notes.text': 'No incluir <b>notas</b>',
	'filter.notes.tip': 'Reportar solamente advertencias y errores',
	'search.youredits.text': 'Incluir <b>sólo mis ediciones</b>',
	'search.youredits.tip': 'Incluir sólo los segmentos editados por mí',
	'search.updatedby.text': '<b>Actualizados por*:</b>',
	'search.updatedby.tip':
		'Incluir solamente los segmentos actualizados por el editor especificado\n* Nota: Esta opción está disponible sólo para Country Managers\nEste campo soporta:\n - Lists: Mías, de otro editor\n - wildcards: pal*bra\n - negation: !me *\n* Nota: puedes usar \'me\' para encontrar coincidencias de ti mismo',
	'search.updatedsince.tip': 'Incluir segmentos editados desde el día epecificado\nFormato de fecha de Firefox: AAAA-MM-DD',
	'search.city.tip': 'Incluir sólo segmentos con el Nombre de ciudad especificado\nEste campo soporta:\n - lists: Paris, Meudon\n - wildcards: Greater * Area\n - negation: !Paris, *',
	'search.checks.tip':
		'Incluir sólo segmentos reportados como se especifica\nEste campo puede buscar:\n - severities: errores\n - check names: Nuevo Camino\n - check IDs: 200\nEste campo soporta:\n - listas: 36, 37\n - comodines: *rotonda*\n - negación: !unconfirmed*, *',
	'search.checks.example': 'Ejempo: revertir*',
	'help.text':
		'<b>Tópicos de Ayuda:</b><br><a target="_blank" href="https://www.waze.com/forum/viewtopic.php?t=76488&p=666476#p666476">F.A.Q.</a><br><a target="_blank" href="https://www.waze.com/forum/viewtopic.php?t=76488">Haz tu pregunta en el foro</a><br><a target="_blank" href="https://www.waze.com/forum/viewtopic.php?t=76488&p=661300#p661185">Cómo ajustar Validator para tu País</a><br><a target="_blank" href="https://www.waze.com/forum/viewtopic.php?t=76488&p=663286#p663286">Acerca de"Puede estar incorrecto el Nombre de Ciudad"</a>',
	'help.tip': 'Abrir en una nueva pestaña en el navegador',
	'button.scan.tip': 'Comenzar escaneando el área actual del mapa\n* Nota: Esto puede tomar algunos minutos',
	'button.scan.tip.NA': 'Aleje para comenzar a escanear el área actual del mapa',
	'button.stop.tip': 'Parar escaneo y regresar a la posición de inicio',
	'button.clear.tip': 'Borrar reporte y caché de segmento',
	'button.clear.tip.red': 'Existen demasiados segmentos reportados:\n 1. Pulse \'Muestre reporte\' para generar el reporte.\n 2. Pulse este boton para borrar el reporte y comenzar de nuevo.',
	'button.report.text': 'Muestra reporte',
	'button.report.tip': 'Aplicar el filtro y generar un reporte en HTML en una nueva pestaña',
	'button.BBreport.tip': 'Compartir el reporte en el Foro de Waze o en un Mensaje Privado',
	'tab.custom.text': 'Ajustes predefinidos',
	'tab.custom.tip': 'Ajustes predefinidos por el usuario',
	'tab.scanner.tip': 'Ajustes de escaneado del mapa',
	'tab.about.tip': 'Acerca del WME Validator',
	'scanner.sounds.NA': 'Su navegador no soporta AudioContext',
	'scanner.highlight.text': 'Resaltar problemas en el mapa',
	'scanner.highlight.tip': 'Resaltar problemas reportados en el mapa',
	'scanner.slow.text': 'Habilitar"chequeos" lentos',
	'scanner.slow.tip': 'Habilita análisis profundo del mapa\n* Nota: esta opción puede hacer lento el proceso de escaneo',
	'scanner.ext.text': 'Reportar resaltados externos',
	'scanner.ext.tip': 'Reportar segmentos resaltados por WME Toolbox o WME Color Highlights',
	'advanced.atbottom.text': 'Hasta abajo',
	'advanced.atbottom.tip': 'Poner WME Validator en la parte de abajo de la página',
	'custom.template.text': '<a target=\'_blank\' href=\'https://www.waze.com/forum/viewtopic.php?t=76488&p=749456#p749456\'>Planilla Propia</a>',
	'custom.template.tip':
		'Checar con planilla expandible definida por el usuario.\n\nPuedes usar las siguientes variables de expansión:\nDirección:\n${country}, ${state}, ${city}, ${street},\n${altCity[index or delimeter]}, ${altStreet[index or delimeter]}\nPropiedades de segmentos:\n${type}, ${typeRank}, ${toll}, ${direction}, ${elevation}, ${lock},\n${length}, ${ID}\nAyudantes:\n${drivable}, ${roundabout}, ${hasHNs},\n${Uturn}, ${deadEnd}, ${softTurns},\n${deadEndA}, ${partialA},\n${deadEndB}, ${partialB}\nConnectivity:\n${segmentsA}, ${inA}, ${outA}, ${UturnA},\n${segmentsB}, ${inB}, ${outB}, ${UturnB}',
	'about.tip': 'Abrir liga en una pestaña nueva',
	'button.reset.text': 'Regresar a los ajustes originales',
	'button.reset.tip': 'Revertir las opciones de filtrado y ajustes a los originales',
	'button.list.text': 'Revisiones disponibles...',
	'button.list.tip': 'Mostrar una lista de revisiones disponibles en WME Validator',
	'button.wizard.tip': 'Crear un paquete de localización',
	'button.back.text': 'Regresar',
	'button.back.tip': 'Cerrar ajustes y regresar a la vista principal',
	'1.problem': 'Los números de salida de los segmentos de la rotonda no son consecutivos',
	'2.problem': 'El segmento tiene nodos geométricos innecesarios',
	'2.solution': 'Simplificar la geometría del segmento pasando el puntero encima del segmento y presionando la letra "d"',
	'3.problem': 'El segmento está resaltado por el WME Toolbox. No representa un problema',
	'4.problem': 'El segmento está resaltado por el WME Toolbox. No representa un problema',
	'5.problem': 'El segmento está resaltado por el WME Toolbox. No representa un problema',
	'6.problem': 'El segmento está resaltado por el WME Toolbox. No representa un problema',
	'7.problem': 'El segmento está resaltado por el WME Toolbox. No representa un problema',
	'8.title': 'WME Toolbox: Numeración de Casas',
	'8.problem': 'El segmento está resaltado por el WME Toolbox. No representa un problema',
	'9.problem': 'El segmento está resaltado por el WME Toolbox. No representa un problema',
	'13.title': 'WME Color Highlights: Bloqueo de un editor',
	'13.problem': 'El segmento está resaltado por el WME Color Highlights. No representa un problema',
	'14.title': 'WME Color Highlights: Vía de peaje / Vía de un sólo sentido',
	'14.problem': 'El segmento está resaltado por el WME Color Highlights. No representa un problema',
	'15.title': 'WME Color Highlights: Recientemente editado',
	'15.problem': 'El segmento está resaltado por elWME Color Highlights. No representa un problema',
	'16.title': 'WME Color Highlights: Rango de v',
	'16.problem': 'El segmento está resaltado por el WME Color Highlights. No representa un problema',
	'17.title': 'WME Color Highlights: Sin Ciudad',
	'17.problem': 'El segmento está resaltado por el WME Color Highlights. No representa un problema',
	'18.title': 'WME Color Highlights: Restricción de tiempo / Tipo de camino resaltado',
	'18.problem': 'El segmento está resaltado por el WME Color Highlights. No representa un problema',
	'19.title': 'WME Color Highlights: Sin nombre',
	'19.problem': 'El segmento está resaltado por el WME Color Highlights. No representa un problema',
	'20.title': 'WME Color Highlights: Filtrar por Ciudad',
	'20.problem': 'El segmento está resaltado por el WME Color Highlights. No representa un problema',
	'21.title': 'WME Color Highlights: Filtrar por nombre alterno de Ciudad (alt. city)',
	'21.problem': 'El segmento está resaltado por el WME Color Highlights. No representa un problema',
	'22.title': 'WME Color Highlights: Filtrar por editor',
	'22.problem': 'El segmento está resaltado por el WME Color Highlights. No representa un problema',
	'23.title': 'Camino sin confirmar',
	'23.problem': 'Cada segmento debe contener como mínimo Información de Estado y País',
	'23.solution': 'Actualice el camino actualizando sus datos',
	'24.enabled': false,
	'24.title': 'Puede contener un nombre de ciudad incorrecto (sólo disponible en el reporte)',
	'24.problem': 'El segmento puede contener el nombre de ciudad incorrecto',
	'24.solution': 'Considere el nombre de ciudad Sugerido y use esta forma para renombrar la ciudad',
	'25.title': 'Sentido desconocido en un camino conducible',
	'25.problem': 'El sentido desconocido del segmento no prevendrá el ruteo por el mismo',
	'25.solution': 'Coloque la dirección del segmento',
	'28.title': 'Nombre de calle en una Rampa de doble sentido',
	'28.problem': 'Si una rampa no tiene nombre, se aplicará el nombre del siguiente camino que lo tenga',
	'28.solution': 'En las propiedades de dirección, active la casilla de \'Ninguno\' seguida del nombre de calle y entonces pulse \'Aplicar\'',
	'29.problem': 'En Waze no se nombran los segmentos de las rotondas',
	'29.solution':
		'En las propiedades de dirección, seleccione la opción \'Ninguno\' en seguida del nombre de calle, pulse \'Aplicar\' y entonces añada un \'lugar\' de tipo \'distribuidor vial\' y escriba el nombre de la glorieta',
	'34.title': 'Vaciar el nombre alterno de calle',
	'34.problem': 'El nombre alterno de calle está vacío',
	'34.solution': 'Quitar los nombres alternos de calle vacíos',
	'35.title': 'Camino conducible no terminado',
	'35.problem': 'Waze no otorgará rutas por segmentos sin terminar',
	'35.solution': 'Mueva un poco el segmento para que el nodo se añada de manera automática',
	'38.title': 'Restricción de segmento vencida (no grave)',
	'38.problem': 'El segmento tiene una restricción que ya venció',
	'38.solution': 'Pulsar \'Editar restricciones\' y borrar las restricciones vencidas',
	'39.title': 'Restricción de giro vencida (no grave)',
	'39.problem': 'El segmento tiene un giro con restricció vencida',
	'39.solution': 'Pulsar la figura del reloj en seguida de la flecha amarilla y borre las restricciones vencidas',
	'41.enabled': false,
	'41.title': 'Conectividad reversible en un segmento conducible',
	'41.problem': 'Existe un giro que va contra la dirección del segmento en el nodo A',
	'41.solution': 'Haga el segmento de \'doble sentido\', restrinja todos los giros en el nodo A y luego haga el segmento de \'Un sólo sentido (A-B) de nuevo',
	'42.enabled': false,
	'42.title': 'Nodo B: Conectividad reversible en segmento conducible',
	'42.problem': 'Existe un giro que va en contra de la dirección del segmento en el nodo B',
	'42.solution': 'Haga el segmento de \'doble sentido\', restrinja todos los giros en el nodo A y luego haga el segmento de \'Un sólo sentido (A-B) de nuevo',
	'43.problem': 'El segmento está conectado en sí mismo',
	'43.solution': 'Divida el segmento en tres',
	'46.title': 'Nodo A: No existe conectividad hacia adentro del camino conducible',
	'46.problem': 'El segmento conducible no privado no tiene ningún giro permitido en el nodo A',
	'46.solution': 'Seleccione un segmento adyacente y active por lo menos un giro al segmento en el nodo A',
	'47.title': 'Nodo B: No existe conectividad hacia adentro del camino conducible (no grave) ',
	'47.problem': 'El segmento conducible no privado no tiene ningún giro permitido en el nodo B',
	'47.solution': 'Seleccione un segmento adyacente y active por lo menos un giro al segmento en el nodo B',
	'48.title': 'Segmento de glorieta de doble sentido',
	'48.problem': 'El segmento de la glorieta es bidireccional',
	'48.solution': 'Rehacer la glorieta',
	'78.title': 'El segmento que creó comienza y termina en un mismo segmento',
	'78.problem': 'Los dos segmentos comparten los mismos puntos finales',
	'78.solution': 'Parta el segmento. Puede también remover uno de ellos si son idénticos',
	'87.title': 'Múltiples segmentos de salida de la glorieta en el nodo A',
	'87.problem': 'El nodo A en la glorieta tiene más de un segmento de salida conectado',
	'87.solution': 'Re hacer la glorieta',
	'99.title': 'Vuelta en U habilitada en segmento de entrada a la glorieta (no grave)',
	'99.problem': 'El segmento de entrada a la glorieta tiene una vuelta en U habilitada',
	'99.solution': 'Deshabilite la vuelta en U',
	'101.title': 'Camino Cerrado (Sólo disponible en el reporte)',
	'101.problem': 'El segmento está marcado como Cerrado',
	'101.solution': 'Si la construcción ya terminó, reactive la conectividad del segmento y remueva el sufijo',
	'102.title': 'No existe conectividad hacia afuera del segmento en el nodo A (no grave)',
	'102.problem': 'El segmento no tiene habilitado ningún giro hacia afuera en el nodo A',
	'102.solution': 'Permita por lo menos un giro hacia el segmento en el nodo A',
	'103.title': 'No existe conectividad hacia afuera en el nodo B (no grave))',
	'103.problem': 'El segmento no tiene habilitado ningún giro hacia afuera en el nodo B',
	'103.solution': 'Permita por lo menos un giro desde el segmento en el nodo B',
	'104.enabled': false,
	'104.title': 'Segmento tipo ferrocarril usado para comentarios',
	'104.problem': 'El segmentotipo ferrocarril etá siendo usado probablemente para comentarios del mapa',
	'104.solution': 'Remover los comentarios ya que las vías férreas se verán en la aplicación',
	'107.title': 'No hay conexion del Nodo A (no grave)',
	'107.problem': 'El Nodo A del segmento está a dentro del rango de 5m de otro segmento pero no está conectado por una intersección',
	'107.solution': 'Arrastre el nodo A al segmento más cercano de modo que se junten, o muévalo un poco más lejos.',
	'108.title': 'No hay conexión en el nodo B (no grave)',
	'108.problem': 'El nodo B del segmento está dentro del rango de 5m de otro segmento pero no está conectado por una intersección',
	'108.solution': 'Arrastre el nodo B al segmento más cercano de modo que lo toque o muévalo un poco más lejos',
	'109.problem': 'El segmento es de menos de ${n}m de largo, por lo que es difícil verlo en el mapa y puede causar problemas de ruteo',
	'109.solution': 'Aumente el largo del segmento, remuévalo o llévelo al nodo del segmento adyacente',
	'112.title': 'Nombre de rampa demasiado largo',
	'112.problem': 'El nombre de la rampa tiene más de ${n} letras',
	'112.solution': 'Acorte el nombre de la rampa',
	'116.solution': 'Corrija la elevación',
	'117.title': 'Marcador de Zona de Construcción obsoleto',
	'117.problem': 'El segmento está marcado con un sufijo de Zona de Construcción obsoleto',
	'117.solution': 'Cambie el CONST ZN a (cerrado)',
	'118.title': 'En el Nodo A: Segmentos encimados (no grave)',
	'118.problem': 'El segmento está encimado con el segmento adyacente en el nodo A',
	'118.solution': 'Abra los segmentos a 2°, borre el punto geométrico o el segmento duplicado en el nodo A',
	'119.title': 'Nodo B: Segmentos encimados',
	'119.problem': 'El segmento está encimado con el segmento adyacente en el nodoB',
	'119.solution': 'Abra los segmentos a 2°, borre el punto geométrico o el segmento duplicado en el nodo B',
	'120.title': 'Nodo A: Giro demasiado cerrado (no grave)',
	'120.problem': 'El segmento conducible tiene un ángulo de giro muy cerrado en el nodo A',
	'120.solution': 'Prohíba la vuelta cerrada en el nodo A o abra los segmentos a 30°',
	'121.title': 'Nodo B: Giro demasiado cerrado (no grave)',
	'121.problem': 'El segmento conducible tiene un ángulo de giro muy cerrado en el nodo B',
	'121.solution': 'Prohíba la vuelta cerrada en el nodo B o abra los segmentos a 30°',
	'128.title': 'Revisión definida por el usuario (verde)',
	'128.problem': 'Algunas propiedades del segmento van en contra de la expresión regular definida por el usuario (ver Settings→Custom)',
	'128.solution': 'Resuelva el problema',
	'129.title': 'Revisión definida por el usuario (azúl)',
	'129.problem': 'Algunas propiedades del segmento van en contra de la expresión regular definida por el usuario (ver Settings→Custom)',
	'129.solution': 'Resuelva el problema',
	'150.enabled': false,
	'151.enabled': false,
	'152.enabled': false,
	'172.title': 'Espacios innecesarios en el nombre de calle',
	'172.solution': 'Eliminar espacios innecesarios del nombre de la calle',
	'173.title': 'No hay espacio antes/después de la abreviatura en el nombre de calle',
	'173.problem': 'No hay espacio antes de (\'1943r.\') o después (\'Sn.Juan\') de una abreviatura en el nombre de calle',
	'173.solution': 'Añadir un espacio antes/después de la abreviatura',
	'175.title': 'Nombre de calle vacío',
	'175.problem': 'El nombre de la calle tiene solamente espacios o un punto',
	'175.solution': 'En las propiedades de la dirección, elija la casilla \'Ninguno\' enseguida de \'nombre\' o escriba el nombre de la Calle. Presione \'Aplicar\'',
	'190.enabled': false,
	'190.title': 'Nombre de ciudad en minúsculas',
	'190.solution': 'Use esta forma para renombrar la ciudad',
	'192.enabled': false,
	'192.title': 'Espacios innecesarios en el nombre de ciudad',
	'192.solution': 'Use esta forma para renombrar la ciudad',
	'193.title': 'No hay espacios antes/después de la abreviatura de la Ciudad',
	'193.problem': 'No hay espacio antes (\'1943r.\') o después (\'Sn.Juan\') de una abreviatura en el nombre de ciudad',
	'193.solution': 'Use esta forma para renombrar la ciudad',
	'200.enabled': false,
	'200.title': 'En el nodo A: Giro no confirmado en un camino menor',
	'200.problem': 'El segmento del camino menor tiene un giro no confirmado (suave) en el nodo A',
	'200.solution':
		'Pulse en la flecha de giro indicada con un signo de interrogación morado para confirmarla. Nota: Puede ser necesario hacer el segmento de doble sentido para poder ver dichos giros',
	'201.enabled': false,
	'201.title': 'En el nodo A: Giro no confirmado en una vía primaria',
	'201.problem': 'El segmento de vía primaria tiene un giro no confirmado (suave) en el nodo A',
	'201.solution':
		'Pulse en la flecha de giro indicada con un signo de interrogación morado para confirmarla. Nota: Puede ser necesario hacer el segmento de doble sentido para poder ver dichos giros',
	'202.enabled': false
  },
  'LU': {'.codeISO': 'LU', '.country': 'Luxembourg', '.fallbackCode': 'BE', '160.enabled': false},
  'IT': {
	'.codeISO': 'IT',
	'.country': 'Italy',
	'57.enabled': true,
	'59.enabled': true,
	'90.enabled': true,
	'95.enabled': true,
	'150.enabled': true,
	'151.enabled': true,
	'151.params': {'n': 5},
	'152.enabled': true,
	'152.params': {'n': 4},
	'163.enabled': true,
	'163.params': {'titleEN': 'Ramp name starts with an \'A\'', 'problemEN': 'The Ramp name starts with an \'A\'', 'solutionEN': 'Replace \'A\' with \'Dir.\'', 'regexp': '/^A /i'},
	'170.enabled': true
  },
  'IL': {
	'.codeISO': 'IL',
	'.country': 'Israel',
	'.author': 'gad_m',
	'.updated': '2014-06-30',
	'.lng': 'HE',
	'.dir': 'rtl',
	'city.consider': 'בדוק את שם העיר:',
	'city.1': 'שם העיר קצר מדי',
	'city.2': 'אל תשתמש בשם מקוצר',
	'city.3': 'השלם את השם הקצר',
	'city.4': 'השלם את שם העיר',
	'city.5': 'תקן אותיות רישיות',
	'city.6': 'בדוק סדר המילה',
	'city.7': 'בדוק סימני קיצור',
	'city.8a': 'הוסף מדינה',
	'city.8r': 'מחק מדינה',
	'city.9': 'בדוק מדינה',
	'city.10a': 'הוסף מילה',
	'city.10r': 'הורד מילה',
	'city.11': 'הוסף קוד מדינה',
	'city.12': 'שמות זהים, אבל קוד זיהוי עיר שונה',
	'city.13a': 'הוסף רווח',
	'city.13r': 'הורד רווח',
	'city.14': 'בדוק את המספר',
	'props.skipped.title': 'המקטע לא נבדק',
	'props.skipped.problem': 'הקטע נערך לאחר 2014/5/1 ונעול לעריכה עבורך, אז Validator לא יכול לבדוק אותו',
	'err.regexp': 'אירעה שגיאה עבור בדיקה #${n}:',
	'props.disabled': 'התוסף אינו מופעל',
	'props.limit.title': 'יותר מדי בעיות דווחו',
	'props.limit.problem': 'ישנם בעיות רבות מדי שדווחו, כך שחלק מהם אולי לא יראו',
	'props.limit.solution': 'בטל את הבחירה של המקטע והפסק את תהליך סריקה. לאחר מכן לחץ על הכפתור האדום \'✘\' (מחק הדו"ח)',
	'props.reports': 'בעיות שנמצאו ע"י ',
	'props.noneditable': 'אינך יכול לערוך מקטע זה',
	'report.save': 'שמור את הדו"ח',
	'report.list.andUp': 'ולמעלה',
	'report.list.severity': 'חומרה',
	'report.list.reportOnly': 'רק בדיווח',
	'report.list.forEditors': 'לרמת עורכים',
	'report.list.forCountries': 'לארצות',
	'report.list.forStates': 'למדינות',
	'report.list.forCities': 'לערים',
	'report.list.params': 'משתנים להגדרת חבילת לוקליזציה',
	'report.list.params.set': 'תצורה נוכחית עבור ${country}:',
	'report.list.enabled': '${n} בדיקות מאופשרות עבור',
	'report.list.disabled': '${n} בדיקות כבויות עבור',
	'report.list.total': 'יש ${n} בדיקות זמינות',
	'report.list.title': 'רשימה מלאה של בדיקות עבור',
	'report.list.see': 'ראה',
	'report.list.checks': 'הגדרות->אודות->בדיקות זמינות',
	'report.list.fallback': 'כללי עתודה של תמיכת הלוקליזציה:',
	'report.and': 'וגם',
	'report.segments': 'סה"כ מקטעים שנבדקו:',
	'report.customs': 'בדיקות מותאמות אישית תואמים (#1/#2):',
	'report.reported': 'דווחו',
	'report.errors': 'טעויות',
	'report.warnings': 'אזהרות',
	'report.notes': 'הערות',
	'report.contents': 'תוכן:',
	'report.summary': 'סיכום',
	'report.title': 'דו"ח WME Validator',
	'report.share': 'לשתף',
	'report.generated.by': 'נוצר ע"י',
	'report.generated.on': 'ב',
	'report.source': 'מקור הדו"ח:',
	'report.filter.duplicate': 'מקטעים כפולים',
	'report.filter.streets': 'רחובות וכבישי שרות',
	'report.filter.other': 'אחרים - מותרים ואסורים לנהיגה',
	'report.filter.noneditable': 'מקטעים שלא ניתנים לעריכה',
	'report.filter.notes': 'הערות',
	'report.filter.title': 'מסננים:',
	'report.filter.excluded': 'אינם נכללים בדו"ח זה.',
	'report.search.updated.by': 'עודכן ע"י',
	'report.search.updated.since': 'עודכן ב',
	'report.search.city': 'מ',
	'report.search.reported': 'דווח כ',
	'report.search.title': 'חפש:',
	'report.search.only': 'מקטעים בלבד',
	'report.search.included': 'נכללים בדו"ח זה.',
	'report.beta.warning': 'אזהרות עורך בטא:',
	'report.beta.text': 'דו"ח זה חולל ע"י עורך גירסת בטא וכולל קישורים קבועים לבטא.',
	'report.beta.share': 'אנא אל תשתף את הפרמלינקים האלה!',
	'report.size.warning': '<b>אזהרה!</b><br>אורך הדו"ח הוא ${n} תווים<b>הוא לא מתאים להכנס</b> להודעה פרטית אחת בפורום\n<br>אנא הוסף<b>מסננים נוספים</b> על מנת להקטין את גודל הדו"ח',
	'report.note.limit': '* הערה: היו בעיות רבות מדי שדווחו, כך שחלק מהם אינם נספר בסיכום.',
	'report.forum': 'לעידוד פיתוח נוסף, אנא השאר משוב ב',
	'report.thanks': 'תודה שהשתמשת ב WME Validator!',
	'msg.limit.segments': 'יש יותר מדי מקטעים.\n\nלחץ \'צפה בדו"ח\' בכדי לצפות בדו"ח, אח"כ לחץ \'▶\' כדי להמשיך.',
	'msg.limit.segments.continue': 'לחץ \'▶\' (בצע) כדי להמשיך',
	'msg.limit.segments.clear': 'לחץ \'✘\' (מחק) כדי למחוק את הדו"ח.',
	'msg.pan.text': 'הזז מעט את המפה כדי להתחיל בבדיקה',
	'msg.zoomout.text': 'הקטן את התצוגה כדי להתחיל את יצירת הדו"ח ע"י WME Validator',
	'msg.click.text': 'לניתוח שטח המפה הגלוי לחץ על \'▶\' ',
	'msg.autopaused': 'עצירה אוטומטית',
	'msg.autopaused.text': 'עצירה אוטומטית! לחץ על \'▶\' כדי להמשיך',
	'msg.autopaused.tip': 'כלי זה עוצר אוטומטית כשמזיזים את המפה או כשמשנים את גודל החלון',
	'msg.finished.text': 'לחץ <b>\'צפה בדו"ח\'</b> כדי לצפות בבעיות במפה',
	'msg.finished.tip': 'לחץ על \'✉\' (שתף) כדי לדווח בפורום\nאו כהודעה פרטית',
	'msg.noissues.text': 'הסריקה הסתיימה! לא נמצאו בעיות!',
	'msg.noissues.tip': 'נסה לכבות חלק מהמסננים או התחל מחדש את הסריקה',
	'msg.scanning.text': 'סורק! יסיים בעוד כ ${n} דקות לערך',
	'msg.scanning.text.soon': 'סורק! יסיים בעוד כדקה!',
	'msg.scanning.tip': 'לחץ על \'השהה\' כדי לעצור או על \'■\' כדי לעצור',
	'msg.starting.text': 'מכין את הדו"ח! השכבות מוסתרות כדי לסרוק מהר יותר',
	'msg.starting.tip': 'לחץ על \'השהה\' או על \'■\' כדי לעצור',
	'msg.paused.text': 'בהשהייה! לחץ \'▶\' כדי להמשיך',
	'msg.paused.tip': 'לצפיה בדו"ח לחץ על \'צפה בדו"ח\' (אם זמין)',
	'msg.continuing.text': 'ממשיך!',
	'msg.continuing.tip': 'WME Validator ימשיך מהמקום בו הפסיק',
	'msg.settings.text': 'לחץ <b>\'חזרה\'</b> לחזרה למסך הראשי',
	'msg.settings.tip': 'לחץ \'אפס לברירת מחדל\' כדי לאפס את כל ההגדרות',
	'msg.reset.text': 'כל אפשרויות הסינון וההגדרות אופסו לברירת המחדל שלהם',
	'msg.reset.tip': 'לחץ על \'חזרה\' כדי לחזור לתצוגה הראשית',
	'msg.textarea.pack': 'אנא העתק את הטקסט שלהלן ולאחר מכן הדבק אותו בקובץ <b>.user.js</b> חדש',
	'msg.textarea': 'אנא העתק את הטקסט שלהלן ולאחר מכן הדבק אותו בשרשור בפורום או כהודעה פרטית',
	'noaccess.text':
		'<b>מצטער,</b><br>אינך יכול להשתמש ב WME Validator כאן.<br>אנא בדוק <a target="_blank" href="https://www.waze.com/forum/viewtopic.php?t=76488">את השרשור בפורום</a><br>למידע נוסף.',
	'noaccess.tip': 'אנא בדוק את השרשור בפורום למידע נוסף!',
	'tab.switch.tip.on': 'לחץ להפעלה (Alt+V)',
	'tab.switch.tip.off': 'לחץ לכיבוי (Alt+V)',
	'tab.filter.text': 'מסננים',
	'tab.filter.tip': 'אפשרויות סינון הדו"ח והדגשות בעורך המפה',
	'tab.search.text': 'חיפוש',
	'tab.search.tip': 'אפשרויות סינון מתקדמות כדי לכלול מקטעים ספציפיים בלבד',
	'tab.help.text': 'עזרה',
	'tab.help.tip': 'צריך עזרה?',
	'filter.noneditables.text': 'הסתר מקטעים <b>שאינם ניתנים לעריכה</b>',
	'filter.noneditables.tip': 'אל תדווח על מקטעים נעולים או\nמקטעים מחוץ לאיזור העריכה שלך',
	'filter.duplicates.text': 'הסתר <b>כפילויות</b> במקטעים',
	'filter.duplicates.tip': 'אל תראה את אותו המקטע בחלקים\nשונים של הדו"ח\n* שים לב: אפשרות זו אינה משפיעה על ההדגשות',
	'filter.streets.text': 'הסתר <b>רחוב</b> ו<b>כביש שרות</b>',
	'filter.streets.tip': 'אל תכלול בדו"ח מקטעים מסוג רחוב וכביש שרות',
	'filter.other.text': 'הסתר אחרים ש<b>מותרים לנהיגה</b> וכל ה<b>אסורים לנהיגה</b>',
	'filter.other.tip': 'אל תכלול בדו"ח מקטעים מסוג דרך עפר, מגרש חניה, כביש פרטי\nומקטעים שאסורים לנהיגה',
	'filter.notes.text': 'הסתר <b>הערות</b>',
	'filter.notes.tip': 'דווח רק על אזהרות ושגיאות',
	'search.youredits.text': 'כלול <b>רק עריכות שלך</b>',
	'search.youredits.tip': 'כלול רק מקטעים שערכת בעצמך',
	'search.updatedby.text': '<b>עודכן על ידי:</b>',
	'search.updatedby.tip': 'כלול סיגמנטים שנערכו ע"י עורך מסויים\nשדה זה תומך ב:\n- רשימות: me, otherEditorName\n- תווים חופשיים: world*\n- שלילה: !me, *\nשים לב: ניתן להשתמש ב me כהתאמה לעצמך',
	'search.updatedby.example': 'דוגמה: אני',
	'search.updatedsince.text': '<b>עודכן ב:</b>',
	'search.updatedsince.tip': 'כלול מקטעים שנערכו מאז תאריך מסויים\nפורמט תאריך: YYYY-MM-DD',
	'search.updatedsince.example': 'YYYY-MM-DD',
	'search.city.text': '<b>שם העיר:</b>',
	'search.city.tip': 'כלול מקטעים בעלי שם עיר מסויימת\nשדה זה תומך ב:\nרשימות: ירושלים, אשקלון\nתווים כלליים: תל *\nשלילה: !ירושלים, *',
	'search.city.example': 'דוגמה: !ירושלים, *',
	'search.checks.text': '<b>דווח כ:</b>',
	'search.checks.tip':
		'כלול רק מקטעים שדווחו לגביהם:\nשדה זה תואם:\n- חומרת הבעיה: errors\n- שמות קבועים: New road\n- מספרים מזהים: 40\nשדה זה תומך ב:\n- רשימות: 36,37\n- תווים כלליים: *roundabout*\n- שלילה: !soft turns*, *\n',
	'search.checks.example': 'דוגמה: *הפוך*',
	'help.text':
		'<b>נושאי עזרה:</b><br><a target="_blank" href="https://www.waze.com/forum/viewtopic.php?t=76488&p=666476#p666476">שאלות נפוצות</a><br><a target="_blank" href="https://www.waze.com/forum/viewtopic.php?t=76488">שאל את שאלתך בפורום</a><br><a target="_blank" href="https://www.waze.com/forum/viewtopic.php?t=76488&p=661300#p661185">כיצד להתאים את ה Validator למדינה שלך</a><br><a target="_blank" href="https://www.waze.com/forum/viewtopic.php?f=819&t=76488&p=663286#p663286">אודות "יתכן ששם העיר שגוי"</a>',
	'help.tip': 'פתח בכרטיסיית דפדפן חדשה',
	'button.scan.tip': 'התחל לסרוק את המפה הנוכחית\nשים לב: פעולה זו יכולה לקחת מספר דקות',
	'button.scan.tip.NA': 'הקטן את התצוגה כדי להתחיל את יצירת הדו"ח באיזור המפה הנוכחי',
	'button.pause.tip': 'עצור את הסריקה',
	'button.continue.tip': 'המשך לסרוק את המפה',
	'button.stop.tip': 'עצור את הסריקה וחזור להתחלה',
	'button.clear.tip': 'מחק הדו"ח ומקטעים מהזיכרון',
	'button.clear.tip.red': 'יותר מדי דיווחים על בעיות במקטעים:\n1. לחץ \'צפה בדו"ח להפיק את הדו"ח\'.\n2. לחץ על כפתור זה כדי למחוק את הדו"ח ולהתחיל מחדש.',
	'button.report.text': 'צפה בדו"ח',
	'button.report.tip': 'השתמש בהגדרות המסננים והפק דו"ח HTML שיפתח בכרטיסיית דפדפן חדשה',
	'button.BBreport.tip': 'שתף את הדו"ח בפורום של וייז או בהודעה פרטית',
	'button.settings.tip': 'הגדרות',
	'tab.custom.text': 'מותאם',
	'tab.custom.tip': 'הגדרת בדיקות מותאמות אישית לפי הגדרות המשתמש',
	'tab.settings.text': 'הגדרות',
	'tab.scanner.text': 'סורק',
	'tab.scanner.tip': 'הגדרות סריקה',
	'tab.about.text': 'אודות</span>',
	'tab.about.tip': 'אודות WME Validator',
	'scanner.sounds.text': 'אפשר צלילים',
	'scanner.sounds.tip': 'ציפצופים וביפים בזמן סריקה',
	'scanner.sounds.NA': 'הדפדפן שלך אינו תומך ב AudioContext',
	'scanner.highlight.text': 'הדגש בעיות על גבי המפה',
	'scanner.highlight.tip': 'הדגר בעיות מדווחות על גבי המפה',
	'scanner.slow.text': 'אפשר בדיקות המוגדרות כ"איטי"',
	'scanner.slow.tip': 'מאפשר ניתוח מעמיק של המפה\n* שים לב: אפשרות זו עלולה להאט את תהליך הסריקה',
	'scanner.ext.text': 'דווח על הדגשות ממקורות אחרים',
	'scanner.ext.tip': 'דווח על מקטעים שהודגשו ע"י WME Toolbox או WME Color Highlights',
	'custom.template.text': '<a target=\'_blank\' href=\'https://www.waze.com/forum/viewtopic.php?t=76488&p=749456#p749456\'>תבנית מותאמת אישית</a>',
	'custom.template.tip':
		'תבנית להרחבת בדיקות מותאמת אישית המוגדרת על ידי משתמש.\n\nניתן להשתמש במשתנים הבאים\n${country}, ${state}, ${city}, ${street},\n${type}, ${typeRank}, ${toll}, ${direction}, ${elevation}, ${lock},\n${length}, ${ID}, ${roundabout}, ${hasHNs},\n${drivable}, ${softTurns}, ${Uturn}, ${deadEnd},\n${segmentsA}, ${inA}, ${outB}, ${UturnA},\n${segmentsB}, ${inB}, ${outB}, ${UturnB}',
	'custom.template.example': 'דוגמה: ${city}',
	'custom.regexp.text': '<a target="_blank" href="https://developer.mozilla.org/docs/JavaScript/Guide/Regular_Expressions">ביטוי רגולרי</a> מותאם אישית',
	'custom.regexp.tip': 'ביטוי רגולרי מותאם אישית ע"י המשתמש התואם את התבנית\nהתאמה: /regexp/\nשלילה: !/regexp/\nכתוב מידע של התוכנית לקונסולה (debug)\n',
	'custom.regexp.example': 'דוגמה: /גבעת שמואל/',
	'about.tip': 'פתח קישור בכרטיסיית דפדפן חדשה',
	'button.reset.text': 'אפס לברירת מחדל',
	'button.reset.tip': 'אפס אפשרויות סינון והגדרות לברירת המחדל',
	'button.list.text': 'בדיקות זמינות...',
	'button.list.tip': 'הראה את רשימ הבדיקות הזמינות של WME Validator',
	'button.wizard.tip': 'צור קבצי לוקליזציה',
	'button.back.text': 'חזרה',
	'button.back.tip': 'סגור הגדרות וחזור לחלון ראשי',
	'1.enabled': false,
	'1.title': 'WME Toolbox: כיכר שעלול ליצור בעיות',
	'1.problem': 'מספרים מזהים של צמתים של מקטעים בכיכר אינם רצופים',
	'1.solution': 'בנה מחדש את הכיכר',
	'2.title': 'WME Toolbox: מקטע פשוט',
	'2.problem': 'למקטע יש מפרקים מיותרים',
	'2.solution': 'פשט את מפרקי המקטע ע"י מעבר עם העכבר מעל המקטע ולחיצה על מקש "d"',
	'3.title': 'WME Toolbox: נעילה ברמה 2',
	'3.problem': 'המקטע מודגש ע"י WME Toolbox. זו אינה שגיאה',
	'4.title': 'WME Toolbox: נעילה ברמה 3',
	'4.problem': 'המקטע מודגש ע"י WME Toolbox. זו אינה שגיאה',
	'5.title': 'WME Toolbox: נעילה ברמה 4',
	'5.problem': 'המקטע מודגש ע"י WME Toolbox. זו אינה שגיאה',
	'6.title': 'WME Toolbox: נעילה ברמה 5',
	'6.problem': 'המקטע מודגש ע"י WME Toolbox. זו אינה שגיאה',
	'7.title': 'WME Toolbox: נעילה ברמה 6',
	'7.problem': 'המקטע מודגש ע"י WME Toolbox. זו אינה שגיאה',
	'8.title': 'WME Toolbox: מספרי בתים',
	'8.problem': 'המקטע מודגש ע"י WME Toolbox. זו אינה שגיאה',
	'9.title': 'WME Toolbox: מקטע עם הגבלות לפי שעות',
	'9.problem': 'המקטע מודגש ע"י WME Toolbox. זו אינה שגיאה',
	'13.title': 'WME Color Highlights: נעילת עורך',
	'13.problem': 'המקטע מודגש ע"י WME Color Highlights. זו אינה שגיאה',
	'14.title': 'WME Color Highlights: כביש אגרה / כביש חד סיטרי',
	'14.problem': 'המקטע מודגש ע"י WME Color Highlights. זו אינה שגיאה',
	'15.title': 'WME Color Highlights: נערך לאחרונה',
	'15.problem': 'המקטע מודגש ע"י WME Color Highlights. זו אינה שגיאה',
	'16.title': 'WME Color Highlights: דרגה של כביש',
	'16.problem': 'המקטע מודגש ע"י WME Color Highlights. זו אינה שגיאה',
	'17.title': 'WME Color Highlights: ללא עיר',
	'17.problem': 'המקטע מודגש ע"י WME Color Highlights. זו אינה שגיאה',
	'18.title': 'WME Color Highlights: הגבלות לפי שעות / סוג כביש מודגש',
	'18.problem': 'המקטע מודגש ע"י WME Color Highlights. זו אינה שגיאה',
	'19.title': 'WME Color Highlights: ללא שם',
	'19.problem': 'המקטע מודגש ע"י WME Color Highlights. זו אינה שגיאה',
	'20.title': 'WME Color Highlights: מסנן לפי עיר',
	'20.problem': 'המקטע מודגש ע"י WME Color Highlights. זו אינה שגיאה',
	'21.title': 'WME Color Highlights: מסנן לפי עיר',
	'21.problem': 'המקטע מודגש ע"י WME Color Highlights. זו אינה שגיאה',
	'22.title': 'WME Color Highlights: מסנן לפי עורך',
	'22.problem': 'המקטע מודגש ע"י WME Color Highlights. זו אינה שגיאה',
	'23.title': 'מקטע ללא שם',
	'23.problem': 'כל מקטע חייב לפחות הגדרת מדינה',
	'23.solution': 'אשר את הכביש ע"י עריכת הפרטים שלו',
	'24.title': 'יתכן ששם העיר שגוי (זמין רק בדו"ח)',
	'24.problem': 'יתכן ששם העיר של המקטע שגוי (זמין רק בדו"ח)',
	'24.solution': 'שקול להשתמש בשם העיר שמוצע והשתמש בטופס זה כדי לשנות שם עיר',
	'25.title': 'כיוון לא ידוע של כביש מותר בנהיגה',
	'25.problem': 'כיוון "לא ידוע" של כביש לא מונע ניווט דרכו',
	'25.solution': 'קבע את כיוון הנסיעה של הכביש',
	'27.enabled': true,
	'27.title': 'שם עיר על מסילת רכבת',
	'27.problem': 'שם עיר על מסילת רכבת עלול לטשטש את גבולות העיר',
	'27.solution': 'בשדה \'עיר\' הדלק את האפשרות \'אין\' ואז \'החל\'',
	'28.enabled': false,
	'28.title': 'שם רחוב למחבר דו כיווני',
	'28.problem': 'כשהמחבר ללא שם, הוא יקבל את שמו מהכביש אליו הוא מוביל',
	'28.solution': 'בשדה \'רחוב\' הדלק את האפשרות \'אין\' ואז \'החל\'',
	'29.title': 'לכיכר יש שם רחוב',
	'29.problem': 'בווויז לא נותנים שמות למקטעים השייכים לכיכר',
	'29.solution': 'בשדה \'רחוב\' הדלק את האפשרות \'אין\', לחץ \'החל\'. כדי לתת שם לכיכר הוסף \'מקום\' עם קטגורית \'צומת\' ותן לו את שם הכיכר',
	'34.title': '\'שם חלופי\' ריק',
	'34.problem': 'שדה \'שם חלופי\' של הרחוב ריק',
	'34.solution': 'הסר את ה\'שם חלופי\' של הרחוב',
	'35.title': 'כביש מותר לנהיגה קטוע',
	'35.problem': 'וייז לא ינווט מכביש קטוע',
	'35.solution': 'הזז מעט את המקטע כך שיתווסף אוטומטית צומת המסיים את המקטע',
	'36.title': 'צומת A: מיותר (איטי)',
	'36.problem': 'מקטעים סמוכים בצומת A זהים',
	'36.solution': 'בחר את צומת A ולחץ על \'מחיקה\' כדי לאחד את המקטעים',
	'37.title': 'צומת B: מיותר (איטי)',
	'37.problem': 'מקטעים סמוכים בצומת B זהים',
	'37.solution': 'בחר את צומת B ולחץ על \'מחיקה\' כדי לאחד את המקטעים',
	'38.title': 'פג תוקף של מגבלה על מקטע (איטי)',
	'38.problem': 'למקטע יש מגבלות שפג תוקפם',
	'38.solution': 'לחץ על "הוסף הגבלות" ומחק מגבלות שפג תוקפם',
	'39.title': 'פג תוקף של מגבלה על פניה (איטי)',
	'39.problem': 'במקטע יש פניה עם מגבלה שפג תוקפה',
	'39.solution': 'לחץ על סימון השעון שליד החץ הצהוב של הפניה ומחק הגבלות שפג תוקפן',
	'41.enabled': false,
	'41.title': 'צומת A: קישוריות הפוכה של כביש מותר לנהיגה',
	'41.problem': 'יש פניה הפוכה לכיוון הנסיעה של המקטע בצומת A',
	'41.solution': 'הפוך את המקטע לדו כיווני, אסור את כל הפניות בצומת A ואחר כך הפוך חזרה את המקטע ל"חד כיווני (A→B)"',
	'42.enabled': false,
	'42.title': 'צומת B: קישוריות הפוכה של כביש מותר לנהיגה',
	'42.problem': 'יש פניה הפוכה לכיוון הנסיעה של המקטע בצומת B',
	'42.solution': 'הפוך את המקטע לדו כיווני, אסור את כל הפניות בצומת B ואחר כך הפוך חזרה את המקטע ל"חד כיווני (B→A)"',
	'43.title': 'קישור לעצמי',
	'43.problem': 'המקטע יוצר צומת עם המקטע עצמו',
	'43.solution': 'פצל את המקטע לשלושה מקטעים',
	'44.title': 'אין חיבור ביציאה',
	'44.problem': 'מקטע מותר בנהיגה ללא אף פניה מאופשרת ביציאה ממנו',
	'44.solution': 'אפשר לפחות פניה אחת ביציאה מהמקטע',
	'45.title': 'אין חיבור בכניסה',
	'45.problem': 'אין אף פניה מאופשרת בכניסה למקטע המותר בנהיגה',
	'45.solution': 'בחר מקטע סמוך ואפשר פניה למקטע זה',
	'46.title': 'צומת A: אין מקטע מותר לנהיגה המוביל לצומת זו (איטי)',
	'46.problem': 'לכביש מותר לנהיגה אין מקטע סמוך עם פניה מאופשרת המובילה אליו בצומת A',
	'46.solution': 'בחר מקטע סמוך, אפשר פניה אל המקטע בצומת A',
	'47.title': 'צומת B: אין מקטע מותר לנהיגה המוביל לצומת זו (איטי)',
	'47.problem': 'לכביש מותר לנהיגה אין מקטע סמוך עם פניה מאופשרת המובילה אליו בצומת B',
	'47.solution': 'בחר מקטע סמוך, אפשר פניה אל המקטע בצומת B',
	'48.title': 'מקטע דו כיווני בכיכר',
	'48.problem': 'מקטע מותר לנהיגה בכיכר הוא דו כיווני',
	'48.solution': 'צור מחדש את הכיכר',
	'50.title': 'אין חיבור לכיכר (איטי)',
	'50.problem': 'למקטע מותר לנהיגה בכיכר אין חיבור למקטע סמוך בכיכר',
	'50.solution': 'אפשר פניה במקטע סמוך או צור מחדש את הכיכר',
	'57.enabled': true,
	'57.title': 'שם עיר במחבר עם שם רחוב',
	'57.problem': 'שם עיר במחבר עם שם רחוב עלול להשפיע על תוצאות החיפוש',
	'57.solution': 'בשדה \'עיר\' הדלק את האפשרות \'אין\' ואז \'החל\'',
	'59.enabled': true,
	'59.title': 'שם עיר בכביש מהיר',
	'59.problem': 'שם עיר בכביש מהיר עלול לטשטש את גבולות העיר',
	'59.solution': 'בשדה \'עיר\' הדלק את האפשרות \'אין\' ואז \'החל\'',
	'77.enabled': false,
	'77.title': 'פניית פרסה ברחוב ללא מוצא',
	'77.problem': 'מאופשרת פניית פרסה במקטע מותר לנהיגה ללא מוצא',
	'77.solution': 'אל תאפשר פניית פרסה',
	'78.title': 'שני מקטעים המותרים לנהיגה מסתיימים באותן נקודות (איטי)',
	'78.problem': 'שני מקטעים המותרים לנהיגה בעלי אותן נקודות קצה',
	'78.solution': 'פצל את המקטע לשני מקטעים. יתכן ויש צורך למחוק את אחד המקטעים אם הם זהים',
	'87.title': 'מקטעים מרובים יוצאים מצומת A',
	'87.problem': 'לצומת A בכיכר מחובר יותר ממקטע יציאה אחד',
	'87.solution': 'צור מחדש את הכיכר',
	'90.enabled': true,
	'90.title': 'כביש מהיר דו סיטרי',
	'90.problem': 'רוב הכבישים המהירים מפוצלים לשני מקטעים חד סיטריים כך שיתכן שיש טעות במקטע',
	'90.solution': 'בדוק את כיוון הנסיעה של הכביש המהיר',
	'91.title': 'מחבר דו כיווני',
	'91.problem': 'רוב המחברים הם חד סיטריים, כך שיתכן שזו שגיאה שמחבר זה מוגדר כדו-סיטרי',
	'91.solution': 'בדוק כיווני נסיעה במחבר',
	'99.title': 'פניית פרסה מאופשרת בכניסה לכיכר (איטי)',
	'99.problem': 'פניית פרסה מאופשרת במקטע הנכנס לכיכר',
	'99.solution': 'אל תאפשר פניית פרסה',
	'101.title': 'כביש סגור (זמין רק בדו"ח)',
	'101.problem': 'המקטע מסומן כסגור',
	'101.solution': 'אם הבנייה הסתיימה, שחזר את קישוריות המקטע והסר את הסיומת',
	'102.title': 'צומת A: אין חיבור ביציאה של כביש מותר בנהיגה (איטי)',
	'102.problem': 'מקטע מותר בנהיגה ללא אף יציאה מאופשרת בצומת A',
	'102.solution': 'אפשר לפחות יציאה אחת מהמקטע בצומת A',
	'103.title': 'צומת B: אין חיבור ביציאה של כביש מותר בנהיגה (איטי)',
	'103.problem': 'מקטע מותר בנהיגה ללא אף יציאה מאופשרת בצומת B',
	'103.solution': 'אפשר לפחות יציאה אחת מהמקטע בצומת B',
	'104.title': 'מסילת רכבת משמשת כהערה',
	'104.problem': 'נראה שמקטע מסוג מסילת רכבת משמש כהערה',
	'104.solution': 'הסר את המקטע כיוון שמסילת רכבת תיראה במסך של משתמש הקצה',
	'107.title': 'צומת A: אין חיבור (איטי)',
	'107.problem': 'צומת A של מקטע מותר לנהיגה נמצאת במרחק של 5 מטרים ממקטע אחר מותר לנהיגה שאינו מחובר',
	'107.solution': 'חבר את צומת A למקטע הקרוב ביותר או הרחק אותו מעט',
	'108.title': 'צומת B: אין חיבור (איטי)',
	'108.problem': 'צומת B של מקטע מותר לנהיגה נמצאת במרחק של 5 מטרים ממקטע אחר מותר לנהיגה שאינו מחובר',
	'108.solution': 'חבר את צומת B למקטע הקרוב ביותר או הרחק אותו מעט',
	'109.enabled': false,
	'109.title': 'מקטע קצר מדי',
	'109.problem': 'מקטע מותר לנהיגה ללא קצה הוא פחות מ 2 מטר. וקשה לראות זאת במפה',
	'109.solution': 'הארך את המקטע, מחק אותו או חבר אותו למקטע סמוך',
	'112.title': 'לשם המחבר יש יותר מ ${n} אותיות',
	'112.problem': 'שם המחבר ארוך מדי',
	'112.solution': 'קצר את שם המחבר',
	'114.enabled': false,
	'114.title': 'צומת A: מקטע אסור לנהיגה מחובר למקטע מותר לנהיגה (איטי)',
	'114.problem': 'מקטע אסור לנהיגה יוצר צומת עם מקטע מותר לנהיגה בצומת A',
	'114.solution': 'נתק את צומת A ממקטעים מותרים לנהיגה',
	'115.enabled': false,
	'115.title': 'צומת B: מקטע אסור לנהיגה מחובר למקטע מותר לנהיגה (איטי)',
	'115.problem': 'מקטע אסור לנהיגה יוצר צומת עם מקטע מותר לנהיגה בצומת B',
	'115.solution': 'נתק את צומת B ממקטעים מותרים לנהיגה',
	'116.title': 'גובה לא בטווח המותר',
	'116.problem': 'גובה המקטע לא בטווח המותר',
	'116.solution': 'תקן את הגובה',
	'117.title': 'סימון של קבוע ישן ZN',
	'117.problem': 'המקטע מסומן בסימון של קבוע שלא בתוקף: ZN',
	'117.solution': 'שנה את הקבוע ZN ל: (סגור)',
	'118.title': 'צומת A: מקטעים חופפים (איטי)',
	'118.problem': 'המקטע חופף למקטע סמוך בצומת A',
	'118.solution': 'הזז את המקטע ב 2° או מחק מפרקים או מחק את המקטע הכפול בצומת A',
	'119.title': 'צומת B: מקטעים חופפים (איטי)',
	'119.problem': 'המקטע חופף למקטע סמוך בצומת B',
	'119.solution': 'הזז את המקטע ב 2° או מחק מפרקים או מחק את המקטע הכפול בצומת B',
	'120.title': 'צומת A: פנייה חדה מדי (איטי)',
	'120.problem': 'במקטע מותר לנהיגה יש פנייה מאד חדה בצומת A',
	'120.solution': 'אסור את הפנייה החדה בצומת A או שנה את זווית הפניה ל 30°',
	'121.title': 'צומת B: פנייה חדה מדי (איטי)',
	'121.problem': 'במקטע מותר לנהיגה יש פנייה מאד חדה בצומת B',
	'121.solution': 'אסור את הפנייה החדה בצומת B או שנה את זווית הפניה ל 30°',
	'128.title': 'בדיקה מותאמת אישית ע"י המשתמש (ירוק)',
	'128.problem': 'חלק ממאפייני המקטע תואמים לביטוי רגולרי שהוגדר ע"י המשתמש (ראה הגדרות->תבנית מותאמת אישית)',
	'128.solution': 'פתור את הבעיה (מי שהגדיר בדיקה מותאמת אישית אמור לדעת כיצד לפתור את הבעיה)',
	'129.title': 'בדיקה מותאמת אישית ע"י המשתמש (כחול)',
	'129.problem': 'חלק ממאפייני המקטע תואמים לביטוי רגולרי שהוגדר ע"י המשתמש (ראה הגדרות->תבנית מותאמת אישית)',
	'129.solution': 'פתור את הבעיה (מי שהגדיר בדיקה מותאמת אישית אמור לדעת כיצד לפתור את הבעיה)',
	'171.enabled': false,
	'171.title': 'שם רחוב מקוצר באופן שגוי',
	'171.problem': 'בשם הרחוב יש קיצור שגוי',
	'171.solution': 'בדוק אותיות קטנות / גדולות, רווח לפני / אחרי הקיצור ובהתאם לטבלת הקיצורים',
	'172.title': 'מרווחים מיותרים בשם של רחוב',
	'172.problem': 'מרווח כפול/לפני/אחרי שם של רחוב',
	'172.solution': 'מחק מרווחים מיותרים בשם של הרחוב',
	'173.enabled': false,
	'173.title': 'אין רווח לפני/אחרי שם קיצור של רחוב',
	'173.problem': 'חסר מרווח לפני או אחרי שימוש בקיצור בשם של רחוב',
	'173.solution': 'הוסף רווח לפני/אחרי הקיצור',
	'175.title': 'שם רחוב ריק',
	'175.problem': 'שם הרחוב מכיל רק מרווחים או נקודות',
	'175.solution': 'במאפייני הכתובת, סמן את תיבת \'אין\' ליד שם הרחוב, לחץ \'החל\', או תן שם תקין לרחוב',
	'190.enabled': false,
	'190.title': 'שם העיר באותיות קטנות',
	'190.problem': 'שם העיר מתחיל באות קטנה',
	'190.solution': 'השתמש בטופס זה כדי לשנות שם עיר',
	'192.title': 'מרווחים מיותרים בשם של עיר',
	'192.problem': 'מרווח כפול/לפני/אחרי שם של עיר',
	'192.solution': 'השתמש בטופס זה כדי לשנות שם עיר',
	'193.enabled': false,
	'193.title': 'מרווחים לפני/אחרי קיצור של שם עיר',
	'193.problem': 'מרווחים אסורים לפני או אחרי שימוש בקיצור בשם של עיר',
	'193.solution': 'השתמש בטופס זה כדי לשנות שם עיר',
	'200.enabled': false,
	'200.title': 'צומת A: פניה שלא אושרה ברחוב משני',
	'200.problem': 'במקטע המשני יש פניה שלא אושרה בצומת A',
	'200.solution': 'לחץ על הפניה שלידה סימן שאלה סגול כדי לאשר אותה. הערה: ייתכן שתצטרך להפוך את המקטע ל\'דו כיווני\' כדי לראות פניה זו',
	'201.title': 'צומת A: פניה שלא אושרה ברחוב ראשי',
	'201.problem': 'במקטע הראשי יש פניה שלא אושרה בצומת A',
	'201.solution': 'לחץ על הפניה שלידה סימן שאלה סגול כדי לאשר אותה. הערה: ייתכן שתצטרך להפוך את המקטע ל\'דו כיווני\' כדי לראות פניה זו'
  },
  'IE': {
	'.codeISO': 'IE',
	'.country': 'Ireland',
	'70.enabled': true,
	'70.problemLink': 'W:How_to_label_and_name_roads_(Ireland)#Road_Types',
	'71.enabled': true,
	'71.problemLink': 'W:How_to_label_and_name_roads_(Ireland)#Road_Types',
	'72.enabled': true,
	'72.problemLink': 'W:How_to_label_and_name_roads_(Ireland)#Road_Types',
	'160.enabled': true,
	'160.problemLink': 'W:How_to_label_and_name_roads_(Ireland)#Road_Types',
	'160.params': {'solutionEN': 'Rename the street to \'Mxx\' or \'Mxx N/S/W/E\' or change the road type', 'regexp': '!/^M[0-9]+( [NSWE])?$/'},
	'161.enabled': true,
	'161.problemLink': 'W:How_to_label_and_name_roads_(Ireland)#Road_Types',
	'161.params': {'solutionEN': 'Rename the street to \'Nxx\' or \'Nxx Local Name\' or change the road type', 'regexp': '!/^N[0-9]+( .*)?$/'},
	'162.enabled': true,
	'162.problemLink': 'W:How_to_label_and_name_roads_(Ireland)#Road_Types',
	'162.params': {'solutionEN': 'Rename the street to \'Rxxx\' or \'Rxxx Local Name\' or change the road type', 'regexp': '!/^R[0-9]+( .*)?$/'}
  },
  'FR': {
	'.codeISO': 'FR',
	'.country': ['France', 'French Guiana', 'New Caledonia', 'Reunion'],
	'.author': 'arbaot and ClementH44',
	'.updated': '2014-03-27',
	'.lng': 'FR',
	'err.regexp': 'Erreur d\'interprétation pour la vérification #${n}:',
	'props.disabled': 'WME Validator est désactivé',
	'props.limit.title': 'Trop de problèmes signalés',
	'props.limit.problem': 'Il y a trop de problèmes signalés, de sorte que certains d\'entre eux pourraient ne pas être affichés',
	'props.limit.solution': 'Désélectionnez le segment et arrêtez le scan. Ensuite, cliquez sur le bouton rouge «✘» (Effacer le rapport)',
	'props.reports': 'Rapports',
	'props.noneditable': 'Vous ne pouvez éditer ce segment',
	'report.list.andUp': 'et jusqu\'à',
	'report.list.severity': 'Gravité :',
	'report.list.reportOnly': 'seulement dans le rapport',
	'report.list.forEditors': 'Pour le niveau d\'édition :',
	'report.list.forCountries': 'Pour les pays :',
	'report.list.forStates': 'Pour les états :',
	'report.list.forCities': 'Pour les villes :',
	'report.list.params': 'Paramètres à configurer dans le pack de localisation :',
	'report.list.enabled': '${n} vérifications sont activés pour',
	'report.list.disabled': '${n} vérifications sont désactivés pour',
	'report.list.total': 'Il y a ${n} points de contôles activés',
	'report.list.title': 'Liste complète des vérifications pour',
	'report.list.see': 'Voir',
	'report.list.checks': 'Paramètres->À propos->Les vérifications',
	'report.list.fallback': 'Règles de regroupement géographique :',
	'report.and': 'et',
	'report.segments': 'Nombre total de segments vérifiés :',
	'report.customs': 'Les vérifications personnalisés adaptés (vert/bleu):',
	'report.reported': 'Signalement',
	'report.errors': 'd\'erreurs',
	'report.warnings': 'd\'avertissements',
	'report.notes': 'de remarques',
	'report.contents': 'Contenus :',
	'report.summary': 'Récapitulatif',
	'report.title': 'Rapport de WME Validator',
	'report.share': 'à partager',
	'report.generated.by': 'généré par',
	'report.generated.on': 'le',
	'report.source': 'Source du rapport :',
	'report.filter.duplicate': 'les segments doublons',
	'report.filter.streets': 'Rue et Routes de service',
	'report.filter.other': 'Autres',
	'report.filter.noneditable': 'segments non modifiables',
	'report.filter.notes': 'notes',
	'report.filter.title': 'Filtre :',
	'report.filter.excluded': 'sont exclues de ce rapport.',
	'report.search.updated.by': 'mis à jour par',
	'report.search.updated.since': 'mis à jour depuis',
	'report.search.city': 'à partir de',
	'report.search.reported': 'signalé comme',
	'report.search.title': 'Rechercher:',
	'report.search.only': 'seulement les segments',
	'report.search.included': 'sont inclus dans le rapport.',
	'report.beta.warning': 'avertissement WME Beta !',
	'report.beta.text': 'Ce rapport est généré pour WME beta avec des permaliens en beta.',
	'report.beta.share': 'Ne pas partager ces permaliens !',
	'report.size.warning':
		'<b>Avertissement !</b><br>Le rapport est trop long de ${n} charactères de sorte qu\'<b>il ne passe pas</b> dans un seul forum ou message privé.\n<br>Ajoutez <b>des filtres</b> pour réduire la taille du rapport.',
	'report.note.limit': '* Remarque: il y avait trop de problèmes signalés, de sorte que certains d\'entre eux ne sont pas pris en compte dans le récapitulatif.',
	'report.forum': 'Pour soutenir le développement, merci de laisser un commentaire sur',
	'report.thanks': 'Merci d\'utiliser WME Validator !',
	'msg.limit.segments': 'Il y a trop de segments.\n\nCliquez sur \'Le rapport\' pour examiner le rapport, ensuite\n',
	'msg.limit.segments.continue': 'cliquez sur \'▶\' pour continuer.',
	'msg.pan.text': 'Déplacez-vous sur pour valider la carte',
	'msg.zoomout.text': 'Effectuer un zoom arrière pour démarrer WME Validator',
	'msg.click.text': 'Cliquez sur \'▶\' pour valider la zone visible de la carte',
	'msg.autopaused': 'Pause automatique',
	'msg.autopaused.text': 'Pause automatique ! Cliquez sur \'▶\' pour continuer.',
	'msg.autopaused.tip': 'WME Validator est automatiquement suspendu si la carte est déplacée ou si la taille de la fenêtre change',
	'msg.finished.text': 'Cliquez sur <b>\'Le rapport\'</b> pour examiner les problèmes de carte',
	'msg.finished.tip': 'Cliquez sur \'✉\' (Partager) pour poster un rapport sur un\nforum ou par message privé',
	'msg.noissues.text': 'Terminé ! Aucun problème trouvé !',
	'msg.noissues.tip': 'Essayez de désactiver quelques filtres ou démarrez WME Validator sur une autre zone de la carte !',
	'msg.scanning.text': 'Scan en cours ! Terminé dans ~ ${n} min',
	'msg.scanning.text.soon': 'Scan en cours ! Terminé dans une minute !',
	'msg.scanning.tip': 'Cliquez sur \'Pause\' pour suspendre ou \'■\' pour stopper',
	'msg.starting.text': 'Lancement ! Les calques ne peuvent scanner plus vite !',
	'msg.starting.tip': 'Utilisez le bouton \'Pause\' pour suspendre ou le bouton \'■\' pour stopper',
	'msg.paused.text': 'En pause ! Cliquez sur \'▶\' pour continuer.',
	'msg.paused.tip': 'Pour voirla raport, cliquez sur \'Le rapport\' (si disponible)',
	'msg.continuing.text': 'En cours !',
	'msg.continuing.tip': 'WME Validator continuera à l\'endroit où il a été suspendu',
	'msg.settings.text': 'Cliquez sur <b>\'Retour\'</b> pour retourner sur la vue principale',
	'msg.settings.tip': 'Cliquez sur \'Par défaut\' pour réinitialiser tous les réglages en un clic !',
	'msg.reset.text': 'Toutes les options de filtrage et les paramètres ont été remis à leurs valeurs par défaut',
	'msg.reset.tip': 'Cliquez sur \'Retour\' pour retourner sur la vue principale',
	'msg.textarea.pack': 'Merci de copier le texte ci-dessous et de le coller dans un nouveau fichier <b>.user.js</b>',
	'msg.textarea': 'Merci de copier le texte ci-dessous et de le coller dans votre forum pour par message privé',
	'noaccess.text':
		'<b>Désolé,</b><br>Vous ne pouvez utiliser WME Validator ici.<br>Merci de visiter (en anglais) <a target=\'_blank\' href=\'https://www.waze.com/forum/viewtopic.php?t=76488\'>ce forum</a><br>pour plus d\'informations.',
	'noaccess.tip': 'Merci de visiter le forum du programme pour plus d\'informations !',
	'tab.switch.tip.on': 'Cliquez pour activer la surbrillance',
	'tab.switch.tip.off': 'Cliquez pour désactiver la surbrillance',
	'tab.filter.text': 'filtre',
	'tab.filter.tip': 'Options pour filtrer le rapport et les segments à mettre en évidence',
	'tab.search.text': 'cherche',
	'tab.search.tip': 'Options avancées de filtrage pour inclure uniquement des segments spécifiques',
	'tab.help.text': 'aide',
	'tab.help.tip': 'Besoins d\'aide ?',
	'filter.noneditables.text': 'Exclure les segments <b>non modifiables</b>',
	'filter.noneditables.tip': 'Ne pas éxaminer les segments verrouillés ou en dehors de vos zones modifiables',
	'filter.duplicates.text': 'Exclure les segments <b>doublons</b>',
	'filter.duplicates.tip': 'Ne pas éxaminer le même segment dans différentes\nparties du rapport\n* Remarque: cette option n\'affecte pas la surbrillance',
	'filter.streets.text': 'Exclure les <b>Rues et Routes de service</b>',
	'filter.streets.tip': 'Ne pas éxaminer les rues et routes/chemins de service',
	'filter.other.text': 'Exclure les <b>autres rues carrossables</b>',
	'filter.other.tip': 'Ne pas éxaminer les chemins de terres, les parkings, les routes privées\net les segments non carrossables',
	'filter.notes.text': 'Exclure les <b>remarques</b>',
	'filter.notes.tip': 'Rapporte uniquement les avertissements et les erreurs',
	'search.youredits.text': 'Inclure <b>uniquement vos modifications</b>',
	'search.youredits.tip': 'Inclure uniquement les segments modifiés par vous',
	'search.updatedby.text': '<b>Mis à jour par:</b>',
	'search.updatedby.tip':
		'Inclure uniquement les segments mis à jour par un éditeur déterminé\nCe champ prend en charge:\n - les listes: me, otherEditor\n - les métacaractères: world*\n - la négation: !me, *\n* Remarque: vous pouvez utiliser \'me\' pour vous désigner',
	'search.updatedby.example': 'Example: me',
	'search.updatedsince.text': '<b>Mis à jour depuis:</b>',
	'search.updatedsince.tip': 'Inclure uniquement les segments modifiés depuis la date spécifiée\nFormat de date Firefox: AAAA-MM-JJ',
	'search.updatedsince.example': 'AAAA-MM-JJ',
	'search.city.text': '<b>Nom de Ville:</b>',
	'search.city.tip':
		'Inclure uniquement les segments d\'une ville spécifiée\nCe champ prend en charge:\n - les listes: Paris, Meudon\n - les métacaractères (wildcards): Greater * Area\n - la négaction: !Paris, *',
	'search.city.example': 'Example: !Paris, *',
	'search.checks.text': '<b>Signalé comme:</b>',
	'search.checks.tip':
		'Inclure uniquement les segments \nCe champ correspond:\n - aux gravités: erreur\n - aux noms: Nouvelle route\n - aux identifiants (IDs): 40\nCe champ prend en charge:\n - les listes: 36, 37\n - les métacaractères (wildcards): *roundabout*\n - la négation: !unconfirmed*, *',
	'search.checks.example': 'Example: reverse*',
	'help.text':
		'<b>Rubriques d\'aide (en anglais):</b><br><a target=\'_blank\' href=\'https://www.waze.com/forum/viewtopic.php?t=76488&p=666476#p666476\'>F.A.Q.</a><br><a target=\'_blank\' href=\'https://www.waze.com/forum/viewtopic.php?t=76488\'>Posez votre question sur le forum</a><br><a target=\'_blank\' href=\'https://www.waze.com/forum/viewtopic.php?t=76488&p=661300#p661185\'>Comment ajuster Validator à votre pays</a><br><a target=\'_blank\' href=\'https://www.waze.com/forum/viewtopic.php?f=819&t=76488&p=663286#p663286\'>À propos de \'Might be Incorrect City Name\'</a>',
	'help.tip': 'S\'ouvre dans un nouvel onglet du navigateur',
	'button.scan.tip': 'Commencer à scanner la zone actuelle de la carte\n* Remarque: cela peut prendre quelques minutes',
	'button.scan.tip.NA': 'Dézoomez pour commencer à scanner la zone actuelle de la carte',
	'button.pause.tip': 'Scan en pause',
	'button.continue.tip': 'Continuer à scanner la zone de la carte',
	'button.stop.tip': 'Arrêter le scan et retourner à la position de départ',
	'button.clear.tip': 'Effacer la mémoire cache des rapports et segments',
	'button.clear.tip.red': 'Il y a trop de segments signalés:\n 1. Cliquez sur \'Le rapport\' pour générer le rapport.\n 2. Cliquez sur ce bouton pour effacer le rapport et recommencer.',
	'button.report.text': 'Le rapport',
	'button.report.tip': 'Appliquer le filtre et générer un rapport HTML dans un nouvel onglet.',
	'button.BBreport.tip': 'Partagez le rapport sur le forum Waze ou dans un message privé.',
	'button.settings.tip': 'Configurer les paramètres',
	'tab.custom.text': 'perso',
	'tab.custom.tip': 'Paramètres de vérification personnalisés définis par l\'utilisateur',
	'tab.settings.text': 'Params',
	'tab.scanner.text': 'scan',
	'tab.scanner.tip': 'Paramètres du scan de la carte',
	'tab.about.text': 'à propos</span>',
	'tab.about.tip': 'À propos de WME Validator',
	'scanner.sounds.text': 'Activer les sons',
	'scanner.sounds.tip': 'Joue un \'bip\' pendant le scan',
	'scanner.sounds.NA': 'Votre navigateur ne supporte pas AudioContext',
	'scanner.highlight.text': 'Mettre en surbrillance sur la carte',
	'scanner.highlight.tip': 'Mettre en surbrillance les problèmes repérés sur la carte',
	'scanner.slow.text': 'Activer le mode \'lent\'',
	'scanner.slow.tip': 'Permet un scan plus poussé et précis de la carte\n* Remarque: cette option peut ralentir le processus de scan',
	'scanner.ext.text': 'Signaler des surbrillances externes',
	'scanner.ext.tip': 'Signaler des segments mis en évidence par WME Toolbox ou WME Color Highlights',
	'custom.template.text': 'Modèle perso',
	'custom.template.tip': 'Modèle de contrôle personnalisé définis par l\'utilisateur.\n\nVous pouvez utiliser les variables suivantes:\n${country}, ${state}, ${city}, ${street},' +
		'\n${altCity[index or delimeter]} Example: ${altCity[0]},' +
		'\n${altStreet[index or delimeter]} Example: ${altStreet[##]},' +
		'\n${type}, ${typeRank}, ${toll}, ${direction}, ${elevation}, ${lock},\n${length}, ${ID}, ${roundabout}, ${hasHNs},\n${drivable}, ${softTurns}, ${Uturn}, ${deadEnd},\n${segmentsA}, ${inA}, ${outB}, ${UturnA},\n${segmentsB}, ${inB}, ${outB}, ${UturnB}',
	'custom.template.example': 'Example: ${street}',
	'custom.regexp.text': '<a target=\'_blank\' href=\'https://developer.mozilla.org/docs/JavaScript/Guide/Regular_Expressions\'>RegExp</a> perso',
	'custom.regexp.tip':
		'Modèle de contrôle personnalisé définis par l\'utilisateur (en utilisant le Regular Expressions).\n\nInsensible à la casse: /regexp/i\nNegation (ne fonctionne pas): !/regexp/\nInformation en mode debug des log sur la console: D/regexp/',
	'custom.regexp.example': 'Example: !/.+/',
	'about.tip': 'Ouvre le lien dans un nouvel onglet',
	'button.reset.text': 'Par défaut',
	'button.reset.tip': 'Rétablir les options de filtrage et les paramètres par défaut',
	'button.list.text': 'Les vérifications...',
	'button.list.tip': 'Montre une liste des vérifications possibles dans WME Validator',
	'button.wizard.tip': 'Créer un pack géographique',
	'button.back.text': 'Ret.',
	'button.back.tip': 'Fermer les paramètres et revenir à l\'ecran principal',
	'1.solutionLink': 'W:Tout_sur_les_ronds-points',
	'1.title': 'WME Toolbox: Rond-point pouvant causer des problèmes',
	'1.problem': 'Les ID des segments du rond-point ne sont pas consécutif',
	'1.solution': 'Refaire le rond-point',
	'2.title': 'WME Toolbox: Simple segment (une voie)',
	'2.problem': 'Ce segments a des nœuds de géométrie inutile',
	'2.solution': 'Simplifier le tracé du segment sélectionné en survolant les nœuds en trop en appuyant sur le \'d\' du clavier',
	'3.title': 'WME Toolbox: Verrouillage de niveau 2',
	'3.problem': 'Segment surligné par WME Toolbox. Pas un problème',
	'4.title': 'WME Toolbox: Verrouillage de niveau 3',
	'4.problem': 'Segment surligné par WME Toolbox. Pas un problème',
	'5.title': 'WME Toolbox: Verrouillage de niveau 4',
	'5.problem': 'Segment surligné par WME Toolbox. Pas un problème',
	'6.title': 'WME Toolbox: Verrouillage de niveau 5',
	'6.problem': 'Segment surligné par WME Toolbox. Pas un problème',
	'7.title': 'WME Toolbox: Verrouillage de niveau 6',
	'7.problem': 'Segment surligné par WME Toolbox. Pas un problème',
	'8.title': 'WME Toolbox: Numéros de maison',
	'8.problem': 'Segment surligné par WME Toolbox. Pas un problème',
	'9.title': 'WME Toolbox: Segment avec une restriction programmée',
	'9.problem': 'Segment surligné par WME Toolbox. Pas un problème',
	'13.title': 'WME Color Highlights: Verrouillage de l\'éditeur',
	'13.problem': 'Segment surligné par WME Color Highlights. Pas un problème',
	'14.title': 'WME Color Highlights: Péage / Route à sens unique',
	'14.problem': 'Segment surligné par WME Color Highlights. Pas un problème',
	'15.title': 'WME Color Highlights: Récemment modifié',
	'15.problem': 'Segment surligné par WME Color Highlights. Pas un problème',
	'16.title': 'WME Color Highlights: Rang de la route',
	'16.problem': 'Segment surligné par WME Color Highlights. Pas un problème',
	'17.title': 'WME Color Highlights: Pas de ville',
	'17.problem': 'Segment surligné par WME Color Highlights. Pas un problème',
	'18.title': 'WME Color Highlights: Restriction programmée / Type de route mis en évidence',
	'18.problem': 'Segment surligné par WME Color Highlights. Pas un problème',
	'19.title': 'WME Color Highlights: Pas de nom',
	'19.problem': 'Segment surligné par WME Color Highlights. Pas un problème',
	'20.title': 'WME Color Highlights: Filtrer par ville',
	'20.problem': 'Segment surligné par WME Color Highlights. Pas un problème',
	'21.title': 'WME Color Highlights: Filtrer par ville (ville alt.)',
	'21.problem': 'Segment surligné par WME Color Highlights. Pas un problème',
	'22.title': 'WME Color Highlights: Filtrer par éditeur',
	'22.problem': 'Segment surligné par WME Color Highlights. Pas un problème',
	'23.problemLink': 'W:Nommage_France#R.C3.A8gles_de_nommage',
	'23.solutionLink': 'W:Nommage_France',
	'23.title': 'Route non confirmée',
	'23.problem': 'Création de segment incomplète ville et nom de rue non renseigné',
	'23.solution': 'Terminer la création en complétant les propriétés',
	'24.problemLink': 'W:Comment_nommer_les_routes_et_les_villes#Nommage_des_villes_et_villages',
	'24.solutionLink': 'F:t=29403',
	'24.title': 'Nom de ville peut-être erroné (uniquement disponible dans le rapport)',
	'24.problem': 'Le nom de la ville est peut-être incorrecte',
	'24.solution': 'Comparer le nom avec celui proposé et éventuellement signaler le problème sur le forum',
	'25.title': 'Direction inconnue de la route carrossable',
	'25.problem': 'Un sens de circulation \'Inconnu\' n\'empêchera Waze de faire emprunter le segment',
	'25.solution': 'Régler le sens de circulation du segment',
	'27.enabled': true,
	'27.title': 'Nom de ville sur une voie ferrée',
	'27.problem': 'Un nom de ville sur les segment voie ferré provoque des incohérence des polygones Ville',
	'27.solution': 'Régler le nom de ville à \'Sans\' ou signaler le problème sur le Forum ',
	'28.problemLink': 'W:Guide_des_intersections#Noms_3',
	'28.title': 'Nom de rue sur une rampe',
	'28.problem': 'Une rampe sans nom \'hérite\' du nom du segment suivant',
	'28.solution': 'Régler le nom du segment à \'Sans\'',
	'29.problemLink': 'W:Tout_sur_les_ronds-points#A_retenir',
	'29.solutionLink': 'W:Tout_sur_les_ronds-points',
	'29.title': 'Nom de rue sur rond-point',
	'29.problem': 'Dans Waze pas de nom de rue sur les rond-point',
	'29.solution': 'Régler le nom des segment du RP à \'Sans\' et créer un POI Jonction/ échangeur avec le nom du RP',
	'34.title': 'Nom de rue alternatif vide',
	'34.problem': 'Le nom de rue alternatif vide',
	'34.solution': 'Supprimer le nom alternatif',
	'35.title': 'Route carrossable non terminé',
	'35.problem': 'Waze ne propose pas de guidage vers/dans les segment non terminés',
	'35.solution': 'Déplacer légèrement l\'extrémité libre du segment pour afin que le nœuds de terminaison soit ajouté',
	'36.title': 'Noeud A: inutil (mode lent)',
	'36.problem': 'Les segments de part et d\'autres du nœud A ont les mêmes propriétés',
	'36.solution': 'Sélectionner le nœud A et appuyer sur Suppr pour fusionner les 2 segments',
	'37.title': 'Noeud B: inutil (mode lent)',
	'37.problem': 'Les segments de part et d\'autres du nœud B ont les mêmes propriétés',
	'37.solution': 'Sélectionner le nœud B et appuyer sur Suppr pour fusionner les 2 segments',
	'38.problemLink': 'W:Les_fermetures_programmées#Segments',
	'38.title': 'Fermetures programmées périmées (mode lent)',
	'38.problem': 'Il y a des fermetures programmées périmées sur ce segment',
	'38.solution': 'Cliquer \'Modifier les restrictions\' et supprimer les restrictions périmées',
	'39.problemLink': 'W:Les_fermetures_programmées#Restriction_de_tourner',
	'39.title': 'Restrictions de tourner périmés (mode lent)',
	'39.problem': 'Il y a des restrictions de tourner périmées sur ce nœud de jonction',
	'39.solution': 'Cliquer l\'icône horloge accolée à la flèche jaune et supprimer les restrictions périmées',
	'41.title': 'Noeud A: Autorisation en sens interdit',
	'41.problem': 'Au nœud A il y a une autorisation de tourner qui va à l\'encontre du sens unique',
	'41.solution': 'Passer le segment à double sens, corriger la flèche au nœud A puis repasser en sens unique',
	'42.title': 'Noeud B: Autorisation en sens interdit',
	'42.problem': 'Au nœud B il y a une autorisation de tourner qui va à l\'encontre du sens unique',
	'42.solution': 'Passer le segment à double sens, corriger la flèche au nœud B puis repasser en sens unique',
	'43.title': 'Connecté à lui-même',
	'43.problem': 'Le segment est connecté à lui même',
	'43.solution': 'Couper le segment en deux',
	'44.title': 'Pas ne connexion sortante',
	'44.problem': 'Le segment carrossable n\'a pas de connexion sortante',
	'44.solution': 'Activer au moins une connexion sortante = une flèche verte',
	'45.title': 'Pas de connexion entrante',
	'45.problem': 'Le segment carrossable (non privé) n\'a pas de connexion entrante',
	'45.solution': 'Sélectionner un segment adjacent et autoriser au moins un accès (flèche rouge → verte)',
	'46.title': 'Noeud A: Pas de connexion entrante pour le segment (mode lent)',
	'46.problem': 'Le segment carrossable (non privé) n\'a pas de connexion entrante au nœud A',
	'46.solution': 'Sélectionner un segment adjacent et autoriser au moins un accès (flèche rouge → verte) au nœud A',
	'47.title': 'Noeud B: Pas de connexion entrante pour le segment (mode lent)',
	'47.problem': 'Le segment carrossable (non privé) n\'a pas de connexion entrante au nœud B',
	'47.solution': 'Sélectionner un segment adjacent et autoriser au moins un accès (flèche rouge → verte) au nœud B',
	'48.solutionLink': 'W:Tout_sur_les_ronds-points#Remplacer_.2F_Editer_un_rond-point',
	'48.title': 'Segment de rond-point à double sens',
	'48.problem': 'Segment de rond-point à double sens de circulation',
	'48.solution': 'Refaire le rond-point',
	'50.solutionLink': 'W:Tout_sur_les_ronds-points#A_retenir',
	'50.title': 'Pas de connectivité sur le rond-point (mode lent)',
	'50.problem': 'Le segment du rond-point n\'a pas de connectivité avec le segment adjacent',
	'50.solution': 'Autoriser un virage vers le segment adjacent = Corriger la flèche rouge',
	'57.enabled': true,
	'57.title': 'Nom de ville sur une rampe',
	'57.problem': 'Un Nom de ville sur une rampe peu affecter la recherche dans Waze',
	'57.solution': 'Cocher la case \'Sans\' pour ville',
	'59.enabled': true,
	'59.title': 'Nom de ville sur Freeway',
	'59.problem': 'Un nom de ville sur les segment Freeway provoque des incohérence des polygones Ville',
	'59.solution': 'Régler le nom de ville à \'Sans\' ou signaler le problème sur le Forum',
	'74.problemLink': 'W:Tout_sur_les_ronds-points#A_retenir',
	'74.solutionLink': 'W:Tout_sur_les_ronds-points#Remplacer_.2F_Editer_un_rond-point',
	'74.title': 'Noeud A: Plusieurs segments connectés',
	'74.problem': 'La jonction A du rond-point est connectée à plusieurs segments',
	'74.solution': 'Refaire le rond-point',
	'77.title': 'Demi-tour autorisé',
	'77.problem': 'L\'impasse carrossable à un demi-tour autorisé à son extrémité',
	'77.solution': 'Éventuellement Interdire le demi-tour',
	'78.title': 'Mêmes extrémités des segments carrossables (mode lent)',
	'78.problem': 'Deux segments carrossables partagent les deux mêmes extrémités',
	'78.solution': 'Diviser le segment. Vous pouvez également supprimer l\'un des segments si ils sont identiques',
	'79.title': 'Demi-tour trop court (mode lent)',
	'79.problem': 'Le segment fait moins de 15m si nécessaire Waze ne proposera pas de demi-tour',
	'79.solution': 'Agrandisseur le segment à 15m mini (si le demi-tour est autorisé)',
	'87.problemLink': 'W:Tout_sur_les_ronds-points#A_retenir',
	'87.solutionLink': 'W:Tout_sur_les_ronds-points#Remplacer_.2F_Editer_un_rond-point',
	'87.title': 'Noeud A: Plusieurs sorties au rond-point',
	'87.problem': 'La jonction A du rond-point est connectée à plusieurs segments sortant',
	'87.solution': 'Refaire le rond-point',
	'99.title': 'Demi-tour à l\'entrée du rond-point (mode lent)',
	'99.problem': 'Le segment d\'entrée du rond-point à un demi-tour autorisé',
	'99.solution': 'Désactiver le demi-tour',
	'101.title': 'Route fermée (seulement disponible dans le rapport)',
	'101.problem': 'Le segment est marqué comme étant fermé',
	'101.solution': 'Si la construction est terminée, restaurez la connectivité du segment et supprimez le suffixe',
	'101.params': {'regexp': '/(^|\\b)travaux(\\b|$)/i'},
	'102.title': 'Noeud A: Pas de connexion sortante (mode lent)',
	'102.problem': 'Le segment carrossable n\'a pas de connexion sortante au nœud A',
	'102.solution': 'Activer au moins une connexion sortante = une flèche verte au nœud A',
	'103.title': 'Noeud B: Pas de connexion sortante (mode lent)',
	'103.problem': 'Le segment carrossable n\'a pas de connexion sortante au nœud B',
	'103.solution': 'Activer au moins une connexion sortante = une flèche verte au nœud B',
	'104.title': 'Voie ferré utilisée pour des commentaires',
	'104.problem': 'Le segment de voie ferré est probablement utilisé pour mettre un commentaire',
	'104.solution': 'Supprimez le commentaire car les voies ferrée sont affichées pour le client',
	'107.title': 'Noeud A: Pas de connexion (mode lent)',
	'107.problem': 'Le noeud A du segment carrossable est à moins de 5m d\'un autre secteur carrossable mais n\'y est pas connecté',
	'107.solution': 'Connectez le noeud A à un segment à proximité ou le déplacer un peu plus loin',
	'108.title': 'Noeud B: pas de connexion (mode lent)',
	'108.problem': 'Le noeud B du segment carrossable est à moins de 5m d\'un autre secteur carrossable mais n\'y est pas connecté',
	'108.solution': 'Connectez le noeud B à un segment à proximité ou le déplacer un peu plus loin',
	'109.title': 'Segment trop court',
	'109.problem': 'Le segment carrossables non-terminal est de moins de 2m de long, il est difficile de le voir sur la carte',
	'109.solution': 'Augmentez sa taille, supprimez le ou connectez le à un segment adjacent',
	'112.title': 'Plus de ${n} lettres en trop pour le nom de la rampe',
	'112.problem': 'Le nom de la rampe est trop long',
	'112.solution': 'Renommez de façon plus courte le nom de la rampe',
	'114.title': 'Noeud A: non carrossable connecté à un carrossable (mode lent)',
	'114.problem': 'Le segment non carrossable a une jonction avec un segment carrossable au noeud A',
	'114.solution': 'Déconnectez le noeud A de tous les segments carrossables',
	'115.title': 'Noeud B: non carrossable connecté à un carrossable (mode lent)',
	'115.problem': 'Le segment non carrossable a une jonction avec un segment carrossable au noeud B',
	'115.solution': 'Déconnectez le noeud B de tous les segments carrossables',
	'116.title': 'Élévation hors de portée',
	'116.problem': 'L\'élévation est en dehors des limites habituelle',
	'116.solution': 'Corrigez l\'élévation',
	'117.title': 'Obsolete CONST ZN marker',
	'117.problem': 'The segment is marked with obsolete CONST ZN suffix',
	'117.solution': 'Change CONST ZN to (closed)',
	'118.title': 'Noeud A: Chevauchement des segments (mode lent)',
	'118.problem': 'Le segment se chevauche avec le segment adjacent au noeud A',
	'118.solution': 'Divisez les segments à 2° ou supprimez le point de la géométrie inutile ou supprimez le segment double au noeud A',
	'119.title': 'Noeud B: Chevauchement des segments (mode lent)',
	'119.problem': 'Le segment se chevauche avec le segment adjacent au noeud B',
	'119.solution': 'Divisez les segments à 2° ou supprimez le point de la géométrie inutile ou supprimez le segment double au noeud B',
	'120.title': 'Noeud A: Virage trop fort (mode lent)',
	'120.problem': 'Le segment carrossable a un virage très fort au noeud A',
	'120.solution': 'Désactiver le virage au noeud A ou écarter les segments à 30°',
	'121.title': 'Noeud B: Virage trop fort (mode lent)',
	'121.problem': 'Le segment carrossable a un virage très fort au noeud B',
	'121.solution': 'Désactiver le virage au noeud A ou écarter les segments à 30°',
	'128.title': 'Vérification personnalisée définie par l\'utilisateur (vert)',
	'128.problem': 'Certaines des propriétés du segment sont à l\'encontre de la Regular Expression définie par l\'utilisateur (voir Paramètres→Personnaliser)',
	'128.solution': 'Résoudre le problème',
	'129.title': 'Vérification personnalisée définie par l\'utilisateur (bleu)',
	'129.problem': 'Certaines des propriétés du segment sont à l\'encontre de la Regular Expression définie par l\'utilisateur (voir Paramètres→Personnaliser)',
	'129.solution': 'Résoudre le problème',
	'163.enabled': true,
	'163.title': '\'Vers\' dans le nom de la rue',
	'163.problem': 'Nom de rue contenant \'vers\'',
	'163.solution': 'Renommer le segment selon les règles du wiki ou signaler sur le forum',
	'163.solutionLink': 'W:Nommage_France#Nommage_des_entr.C3.A9es.2C_sorties_et_des_embranchements_d.27autoroutes',
	'163.params':
		{'titleEN': '\'Vers\' in Ramp name', 'problemEN': 'The Ramp name contains word \'vers\'', 'solutionEN': 'Rename the Ramp in accordance with the guidelines', 'regexp': '/(^|\\b)vers\\b/i'},
	'170.enabled': true,
	'170.solutionLink': 'W:Nommage_France#R.C3.A8gles_de_nommage',
	'170.title': 'Majuscule dans le nom de rue',
	'170.problem': 'Le nom de la rue commence par une miniscule',
	'170.solution': 'Passer la première lettre en majuscule',
	'171.enabled': true,
	'171.title': 'Abréviation dans le nom de rue',
	'171.problem': 'Abréviation indésirable dans le nom de rue',
	'171.solution': 'Écrire le mot abréger en toute lettre',
	'171.params': {
	  'regexp':
		  '/((^| )([Ss]t-|[Ss]te-))|((^| )([Ss]t|[Ss]te|[Mm]al(?! Assis)|[Gg]al|[Aa]v|[Bb]lvd|[Ii]mp|[Pp]l|[Ss]q|[Aa]ll|[Bb][Dd])($| ))|((^| )(?!(Z\\.I|Z\\.A|Z\\.A\\.C|C\\.C|S\\.N\\.C\\.F|R\\.E\\.R)\\.)[^ ]+\\.)/'
	},
	'172.title': 'Nom de rue avec des espaces inutiles',
	'172.problem': 'Double espace dans le nom de rue',
	'172.problemLink': 'W:Comment_nommer_les_routes_et_les_villes',
	'172.solution': 'Supprimer les espaces inutiles',
	'173.enabled': false,
	'173.title': 'Nom de rue sans espace avant ou après une abrévation',
	'173.problem': 'Pas d\'espace avant (\'1943r.\') ou après (\'st.Jan\') une abrévation dans le nom de rue',
	'173.solution': 'Ajouter un espace avant/après l\'abrévation',
	'174.enabled': true,
	'174.title': 'Mauvais orthographe',
	'174.problem': 'Mauvais orthographe qui provoque une mauvaise prononciation',
	'174.solution': 'Corriger l\'orthographe (É = Alt-144 etc)',
	'174.solutionLink': 'W:Nommage_France#R.C3.A8gles_de_nommage',
	'174.params': {
	  'regexp':
		  '/(^|\\b)(allee|acces|chateau|ecole|egalit[eé]|[eé]galite|eglise|etang|gen[eé]ral|g[eé]neral|hotel|hopital|marechal|president|republique|ocean|ev[eê]ch[eé]|[eé]vech[eé]|[eé]v[eê]che|periphérique|elodie|etienne|eric|emile|emilie|edouard|elisabeth)/i'
	},
	'175.title': 'Nom de rue avec uniquement des espaces',
	'175.problem': 'Le nom de la rue n\'a que des espaces',
	'175.solution': 'Dans les propriétés de l\'adresse, cocher \'Sans\' pour le nom de la rue et cliquer sur \'Appliquer\' OU entrer un nom de rue approprié',
	'190.title': 'Minuscule dans le nom de ville',
	'190.problem': 'Le nom de ville commence avec une lettre en majuscule',
	'190.solution': 'Utilisé ce formulaire pour renommer la ville',
	'192.problemLink': 'W:Comment_nommer_les_routes_et_les_villes#Nommage_des_villes_et_villages',
	'192.solutionLink': 'F:t=29403',
	'192.title': 'Nom de ville avec des espaces inutiles',
	'192.problem': 'Double espace dans le nom de ville',
	'192.solution': 'Utiliser le formulaire suivant pour faire une demande de modification',
	'193.enabled': false,
	'193.title': 'Nom de bille sans espace avant ou après une abrévation',
	'193.problem': 'Pas d\'espace avant (\'1943r.\') ou après (\'st.Jana\') une abrévation dans le nom de rue',
	'193.solution': 'Utiliser ce formulaire pour renommer la ville',
	'200.problemLink': 'W:Soft_et_hard_turns',
	'200.solutionLink': 'W:Soft_et_hard_turns#Bonnes_pratiques',
	'200.title': 'Noeud A: Autorisation de tourner non confirmée',
	'200.problem': 'Le segment carrossable à une autorisation de tourner non confirmée au noeud A',
	'200.solution': 'Cliquer l\'autorisation de tourner avec un ? violet pour la confirmer. Il peut être nécessaire de passer les sens unique à double sens pour afficher des flèches cachées'
  },
  'ES': {
	'.codeISO': 'ES',
	'.country': [
	  'Spain', 'Andorra', 'Bolivia', 'Costa Rica', 'Colombia', 'Cuba', 'Dominican Republic', 'Ecuador', 'Equatorial Guinea', 'Guatemala', 'Honduras', 'Nicaragua', 'Panama', 'Peru', 'Paraguay',
	  'El Salvador', 'Uruguay', 'Venezuela'
	],
	'.author': 'robindlc and fernandoanguita',
	'.updated': '2014-08-30',
	'.lng': ['ES', 'ES-419', 'GL'],
	'city.consider': 'considerar este nombre de ciudad:',
	'city.1': 'nombre de ciudad demasiado corto',
	'city.2': 'expandir la abreviación',
	'city.3': 'completar nombre corto',
	'city.4': 'completar nombre de ciudad',
	'city.5': 'corregir mayúsculas',
	'city.6': 'comprobar orden de palabras',
	'city.7': 'comprobar abreviaciones',
	'city.8a': 'añadir nombre de país',
	'city.8r': 'eliminar nombre de país',
	'city.9': 'comprobar nombre de país',
	'city.10a': 'añadir palabra',
	'city.10r': 'eliminar palabra',
	'city.11': 'añadir código de país',
	'city.12': 'nombres idénticos, pero ciudades con diferentes IDs',
	'city.13a': 'añadir espacio',
	'city.13r': 'eliminar espacio',
	'city.14': 'revisar el número',
	'props.skipped.title': 'El segmento no está revisado',
	'props.skipped.problem': 'El    segmento se modificó después del 01-05-2014 Y está bloqueado por ti, por lo que Validator no lo revisó',
	'err.regexp': 'Error al analizar la opción de revisión #${n}:',
	'props.disabled': 'WME Validator deshabilitado',
	'props.limit.title': 'Demasiados problemas notificados',
	'props.limit.problem': 'Hay demasiados problemas notificados, puede que no se muestren todos',
	'props.limit.solution': 'Deselecciona el segmento y detiene el proceso de escaneo. Luego pincha el botón con la \'✘\' roja (Limpiar Reporte)',
	'props.reports': 'informes',
	'props.noneditable': 'No puedes editar este segmento',
	'report.save': 'Guardar este informe',
	'report.list.andUp': 'y subiendo',
	'report.list.severity': 'Severidad:',
	'report.list.reportOnly': 'sólo en el informe',
	'report.list.forEditors': 'Para editores nivel:',
	'report.list.forCountries': 'Para paises:',
	'report.list.forStates': 'Para estados:',
	'report.list.forCities': 'Para ciudades:',
	'report.list.params': 'Parámetros para configurar en el paquete de localización:',
	'report.list.params.set': 'Parámetros ajustados en el paquete de localización:',
	'report.list.enabled': '${n} revisiones están habilitadas para',
	'report.list.disabled': '${n} revisiones están deshabilitadas para',
	'report.list.total': 'Hay ${n} revisiones disponibles',
	'report.list.title': 'Lista Completa de Revisiones para',
	'report.list.see': 'Ver',
	'report.list.checks': 'Configuración>Acerca>Revisiones disponibles',
	'report.list.fallback': 'Reglas de Localización de respaldo:',
	'report.and': 'y',
	'report.segments': 'Número total de segmentos revisados:',
	'report.customs': 'Revisiones personalizadas combinadas (verde/azul):',
	'report.reported': 'Reportados',
	'report.errors': 'errores',
	'report.warnings': 'advertencias',
	'report.notes': 'notas',
	'report.contents': 'Contenidos:',
	'report.summary': 'Resumen',
	'report.title': 'Informe de WME Validator',
	'report.share': 'para Compartir',
	'report.generated.by': 'generado por',
	'report.generated.on': 'activo',
	'report.source': 'Fuente del informe:',
	'report.filter.duplicate': 'segmentos duplicados',
	'report.filter.streets': 'Calles y Calles de Servicio',
	'report.filter.other': 'Otros conducibles y no conducibles',
	'report.filter.noneditable': 'segmentos no-editables',
	'report.filter.notes': 'notas',
	'report.filter.title': 'Filtro:',
	'report.filter.excluded': 'están excluidos de este informe.',
	'report.search.updated.by': 'actualizado por',
	'report.search.updated.since': 'actualizado desde',
	'report.search.city': 'desde',
	'report.search.reported': 'reportado como',
	'report.search.title': 'Búsqueda:',
	'report.search.only': 'sólo segmentos',
	'report.search.included': 'están incluídos en el informe.',
	'report.beta.warning': '¡Advertencia WME Beta!',
	'report.beta.text': 'Este informe se genera en WME Beta con permalinks beta.',
	'report.beta.share': 'Por favor no comparta estos permalinks!',
	'report.size.warning':
		'<b>¡Advertencia!</b><br> El informe tiene ${n} caracteres, por lo que <b>no cabrá</b> en un mensaje de foro o privado.\n<br>Por favor agrega <b>más filtros</b> para reducir el tamaño del informe.',
	'report.note.limit': '* Nota: había demasiados problemas reportados, por lo que algunos de ellos no se incluyen en el resumen.',
	'report.forum': 'Para motivar futuros desarrollos, por favor deje su mensaje en el',
	'report.thanks': 'Gracias por usar WME Validator!',
	'msg.limit.segments': 'Hay demasiados segmentos.\n\nPincha \'Mostrar informe\' para revisar el informe, luego\n',
	'msg.limit.segments.continue': 'pincha \'▶\' para continuar.',
	'msg.limit.segments.clear': 'pulsa \'✘\' para borrar el informe.',
	'msg.pan.text': 'Desplaza el mapa para validarlo',
	'msg.zoomout.text': 'Aleja el zoom\tpara iniciar WME Validator',
	'msg.click.text': 'Pincha \'▶\' para validar el área visible del mapa',
	'msg.autopaused': 'autopausado',
	'msg.autopaused.text': '¡Autopausado! Pincha \'▶\' para continuar.',
	'msg.autopaused.tip': 'WME Validator automáticamente pausó al arrastrar el mapa o cambiar el tamaño de la ventana',
	'msg.finished.text': 'Pincha <b>\'Mostrar informe\'</b> para ver los problemas del mapa',
	'msg.finished.tip': 'Pincha el botón \'✉\' (Compartir) para publicar el informe en un \nforo o en un mensaje privado',
	'msg.noissues.text': '¡Terminado! ¡No se encontraron problemas!',
	'msg.noissues.tip': '¡Trata de deseleccionar algunas opciones de filtro o inicia WME Validator sobre otra zona del mapa!',
	'msg.scanning.text': '¡Escaneando! Finalizando en ~ ${n} minutos',
	'msg.scanning.text.soon': '¡Escaneando! ¡Finalizando en un minuto!',
	'msg.scanning.tip': 'Pincha el botón \'Pausa\' para pausar o \'■\' para detener',
	'msg.starting.text': '¡Comenzando! ¡Las capas están desactivadas para escanear más rápido!',
	'msg.starting.tip': 'Usa el botón \'Pausa\' para pausar o el botón \'■\' para detener',
	'msg.paused.text': '¡En pausa! Pincha el botón \'▶\' para continuar.',
	'msg.paused.tip': 'Para ver el informe pincha el botón \'Mostrar informe\' (si está disponible)',
	'msg.continuing.text': '¡Continuando!',
	'msg.continuing.tip': 'WME Validator continuará desde la ubicación en que fue pausado',
	'msg.settings.text': 'Pincha <b>\'Atrás\'</b> para retornar a la vista principal',
	'msg.settings.tip': 'Pincha el botón \'Restaurar valores predeterminados\' para resetear todos los parámetros en un clic!',
	'msg.reset.text': 'Todas las opciones de filtro y configuración han sido reseteadas a sus valores por defecto',
	'msg.reset.tip': 'Pincha el botón \'Atrás\' para retornar a la vista principal',
	'msg.textarea.pack': 'Por favor copia el texto abajo y luego pégalo en el nuevo archivo <b>.user.js</b>',
	'msg.textarea': 'Por favor copia el texto abajo y luego pégalo en tu publicación del foro o mensaje privado',
	'noaccess.text':
		'<b>Lo sentimos,</b><br> No puedes usar WME Validator\taquí.<br>Por favor revisa <a target=\'_blank\' href=\'https://www.waze.com/forum/viewtopic.php?t=76488\'>el hilo del foro</a><br>para más información.',
	'noaccess.tip': 'Por favor revisa el hilo del foro para más información!',
	'tab.switch.tip.on': 'Pincha para activar el resaltado',
	'tab.switch.tip.off': 'Pincha para desactivar el resaltado',
	'tab.filter.text': 'filtro',
	'tab.filter.tip': 'Opciones para filtrar el informe y los segmentos resaltados',
	'tab.search.text': 'buscar',
	'tab.search.tip': 'Opciones de filtro avanzadas para incluir sólo segmentos específicos',
	'tab.help.text': 'ayuda',
	'tab.help.tip': '¿Necesitas ayuda?',
	'filter.noneditables.text': 'Excluir segmentos <b>no-editables</b>',
	'filter.noneditables.tip': 'No reportar segmentos bloqueados o \nsegmentos fuera de su área de edición',
	'filter.duplicates.text': 'Excluir segmentos <b>duplicados</b>',
	'filter.duplicates.tip': 'No mostrar el mismo segmento en diferentes \npartes del reporte\n* Nota: esta opción NO AFECTA el resaltado',
	'filter.streets.text': 'Excluir <b>Calles y Vías de Servicio</b>',
	'filter.streets.tip': 'No reportar Calles y Vías de Servicio',
	'filter.other.text': 'Excluir <b>otros conducibles y no-conducibles</b>',
	'filter.other.tip': 'No reportar Caminos de Tierra, Vías de Estacionamiento y Caminos Privados\ny no-conducibles',
	'filter.notes.text': 'Excluir <b>notas</b>',
	'filter.notes.tip': 'Reportar sólo advertencias y errores',
	'search.youredits.text': 'Incluir <b>sólo tus ediciones</b>',
	'search.youredits.tip': 'Incluir sólo los segmentos editados por ti',
	'search.updatedby.text': '<b>Actualizado por:</b>',
	'search.updatedby.tip':
		'Incluir sólo segmentos actualizados por el editor especificado\nEste campo soporta:\n - listas: yo, OtrosEditores\n - comodines: palabra*\n - negación: !yo, *\n* Nota: puedes usar \'me\' para indicarte a ti mismo',
	'search.updatedby.example': 'Ejemplo: me',
	'search.updatedsince.text': '<b>Actualizado desde:</b>',
	'search.updatedsince.tip': 'Incluir sólo segmentos editados desde la fecha especificada formato de fecha\nFirefox: AAAA-MM-DD',
	'search.updatedsince.example': 'AAAA-MM-DD',
	'search.city.text': '<b>Nombre de ciudad:</b>',
	'search.city.tip': 'Incluir sólo segmentos con el nombre de ciudad especificado\nEste campo soporta:\n - listas: Paris, Meudon\n - comodines: Área * Mayor\n - negación: !Paris, *',
	'search.city.example': 'Ejemplo: !Paris, *',
	'search.checks.text': '<b>Reportado como:</b>',
	'search.checks.tip':
		'Incluir sólo segmentos reportados como específicos\nEste campo empareja:\n - severidades: errores\n - revisar nombres: Calle nueva\n - revisar IDs: 40\nEste campo soporta:\n - listas: 36, 37\n - comodines: *rotonda*\n - negación: !giros suaves*, *',
	'search.checks.example': 'Ejemplo: inverso*',
	'help.text':
		' <b>Hilos de Ayuda:</b><br><a target=\'_blank\' href=\'https://www.waze.com/forum/viewtopic.php?f=819&t=76488&p=666476#p666476\'>F.A.Q.</a><br><a target=\'_blank\' href=\'https://www.waze.com/forum/viewtopic.php?t=76488\'>Consulta tu duda en el foro</a><br><a target=\'_blank\' href=\'https://www.waze.com/forum/viewtopic.php?f=819&t=76488&p=661300#p661185\'>Como ajustar Validator para tu país</a><br><a target=\'_blank\' href=\'https://www.waze.com/forum/viewtopic.php?f=819&t=76488&p=663286#p663286\'>Acerca de \'Puede ser un nombre de Ciudad incorrecto\'</a>',
	'help.tip': 'Abrir en una nueva pestaña del explorador',
	'button.scan.tip': 'Comenzar escaneo del área del mapa actual \n* Nota: esto puede tomar unos minutos',
	'button.scan.tip.NA': 'Aleja el zoom para comenzar a escanear el área del mapa actual',
	'button.pause.tip': 'Pausar escaneo',
	'button.continue.tip': 'Continuar escaneando el área del mapa',
	'button.stop.tip': 'Detener el escaneo y volver a la posición de inicio',
	'button.clear.tip': 'Borrar informe y caché de segmentos',
	'button.clear.tip.red': 'Hay demasiados segmentos reportados:\n 1. Pincha \'Mostrar informe\' para generar informe.\n 2. Pincha este botón para borrar el informe y comenzar de nuevo.',
	'button.report.text': 'Mostrar informe',
	'button.report.tip': 'Aplicar el filtro y generar informe HTML en una nueva pestaña',
	'button.BBreport.tip': 'Compartir el informe en el foro Waze o en un mensaje privado',
	'button.settings.tip': 'Configurar ajustes',
	'tab.custom.text': 'personalizado',
	'tab.custom.tip': 'Ajustes de revisión personalizados definidos por el usuario',
	'tab.settings.text': 'Ajustes',
	'tab.scanner.text': 'escanear',
	'tab.scanner.tip': 'Ajustes de escaneo de mapa',
	'tab.about.text': 'acerca de</span>',
	'tab.about.tip': 'Acerca de WME Validator',
	'scanner.sounds.text': 'Habilitar sonidos',
	'scanner.sounds.tip': 'Pitidos y sonidos mientras escanea',
	'scanner.sounds.NA': 'Su navegador no admite AudioContext',
	'scanner.highlight.text': 'Resalta problemas en el mapa',
	'scanner.highlight.tip': 'Resalta problemas reportados en el mapa',
	'scanner.slow.text': 'Activa \'slow\' verificaciones',
	'scanner.slow.tip': 'Activa análisis profundo del mapa\n* Nota: esta opción puede ralentizar el proceso de escaneo',
	'scanner.ext.text': 'Informa de resaltados externos',
	'scanner.ext.tip': 'Informa de segmentos resaltados por WME Toolbox o WME Color Highlights',
	'custom.template.text': 'Plantilla personalizada',
	'custom.template.tip':
		'Plantilla para comprobaciones definidas por el usuario.\n\nPuede usar las siguientes variables expandibles:\n${country}, ${state}, ${city}, ${street},\n${country}, ${state}, ${city}, ${street},\n${altCity[index or delimeter]} Example: ${altCity[0]},\n${altStreet[index or delimeter]} Example: ${altStreet[##]},\n${type}, ${typeRank}, ${toll}, ${direction}, ${elevation}, ${lock},\n${length}, ${ID}, ${roundabout}, ${hasHNs},\n${drivable}, ${softTurns}, ${Uturn}, ${deadEnd},\n${segmentsA}, ${inA}, ${outB}, ${UturnA},\n${segmentsB}, ${inB}, ${outB}, ${UturnB}',
	'custom.template.example': 'Ejemplo: ${street}',
	'custom.regexp.text': 'Personalizado <a target=\'_blank\' href=\'https://developer.mozilla.org/docs/JavaScript/Guide/Regular_Expressions\'>RegExp</a>',
	'custom.regexp.tip':
		'Expresión regular de comprobación personalizada definida por el usuario para que coincida con la plantilla.\n\nCase-insensitive match: /regexp/i\nNegation (do not match): !/regexp/\nLog debug information on console: D/regexp/',
	'custom.regexp.example': 'Ejemplo: !/.+/',
	'about.tip': 'Pincha \'actualizar\' para abrir el hilo del foro en una pestaña nueva',
	'button.reset.text': 'Restablecer predeterminados',
	'button.reset.tip': 'Revertir opciones de filtro y ajustes a sus valores predeterminados',
	'button.list.text': 'Comprobaciones disponibles...',
	'button.list.tip': 'Muestra una lista de las comprobaciones disponibles en WME Validator',
	'button.wizard.tip': 'Crear paquete de localización',
	'button.back.text': 'Atrás',
	'button.back.tip': 'Cerrar configuración y volver a la vista principal',
	'1.solutionLink': 'W:Crear_y_editar_rotondas#Arreglar_rotondas_editadas_manualmente',
	'1.title': 'WME Toolbox: Rotonda que puede causar problemas',
	'1.problem': 'Los números de identificación de los puntos de unión de los segmentos de la rotonda no son consecutivos',
	'1.solution': 'Rehacer la rotonda',
	'2.title': 'WME Toolbox: Segmento Simple',
	'2.problem': 'El segmento tiene nodos de geometría innecesarios',
	'2.solution': 'Simplifica la geometría del segmento pasando el puntero del ratón por encima y pulsando la tecla \'d\'',
	'3.title': 'WME Toolbox: Bloqueo nivel 2',
	'3.problem': 'El segmento está resaltado por WME Toolbox. No es un problema',
	'4.title': 'WME Toolbox: Bloqueo nivel 3',
	'4.problem': 'El segmento está resaltado por WME Toolbox. No es un problema',
	'5.title': 'WME Toolbox: Bloqueo nivel 4',
	'5.problem': 'El segmento está resaltado por WME Toolbox. No es un problema',
	'6.title': 'WME Toolbox: Bloqueo nivel 5',
	'6.problem': 'El segmento está resaltado por WME Toolbox. No es un problema',
	'7.title': 'WME Toolbox: Bloqueo nivel 6',
	'7.problem': 'El segmento está resaltado por WME Toolbox. No es un problema',
	'8.title': 'WME Toolbox: Numeros de casas',
	'8.problem': 'El segmento está resaltado por WME Toolbox. No es un problema',
	'9.title': 'WME Toolbox: Segmento con restricciones de tiempo',
	'9.problem': 'El segmento está resaltado por WME Toolbox. No es un problema',
	'13.title': 'WME Colour Highlights: Bloqueo de editor',
	'13.problem': 'El segmento está resaltado por WME Colour Highlights. No es un problema',
	'14.title': 'WME Colour Highlights: Peaje / Vía de sentido único',
	'14.problem': 'El segmento está resaltado por WME Colour Highlights. No es un problema',
	'15.title': 'WME Colour Highlights: Editado recientemente',
	'15.problem': 'El segmento está resaltado por WME Colour Highlights. No es un problema',
	'16.title': 'WME Colour Highlights: Rango de vías',
	'16.problem': 'El segmento está resaltado por WME Colour Highlights. No es un problema',
	'17.title': 'WME Colour Highlights: Sin ciudad',
	'17.problem': 'El segmento está resaltado por WME Colour Highlights. No es un problema',
	'18.title': 'WME Colour Highlights: Restricción horaria / Tipo de vía resaltado',
	'18.problem': 'El segmento está resaltado por WME Colour Highlights. No es un problema',
	'19.title': 'WME Colour Highlights: Sin nombre',
	'19.problem': 'El segmento está resaltado por WME Colour Highlights. No es un problema',
	'20.title': 'WME Colour Highlights: Filtro por ciudad',
	'20.problem': 'El segmento está resaltado por WME Colour Highlights. No es un problema',
	'21.title': 'WME Colour Highlights: Filtro por ciudad (alt. ciudad)',
	'21.problem': 'El segmento está resaltado por WME Colour Highlights. No es un problema',
	'22.title': 'WME Colour Highlights: Filtro por editor',
	'22.problem': 'El segmento está resaltado por WME Colour Highlights. No es un problema',
	'23.title': 'Segmento no confirmado',
	'23.problem': 'Cada segmento debe tener al menos el nombre del país o estado',
	'23.solution': 'Confirma la vía actualizando sus detalles',
	'24.problemLink': 'W:Corrigiendo_ciudades_"manchadas"',
	'24.title': 'Puede haber nombre incorrecto de ciudad (sólo disponible en el informe)',
	'24.problem': 'El segmento puede tener un nombre de ciudad incorrecto',
	'24.solution': 'Considera el nombre de ciudad sugerido y use este formulario para renombrar la ciudad',
	'25.title': 'Dirección del segmento marcada como desconocida',
	'25.problem': 'La dirección del segmento \'Desconocida\' no impedirá enrutar por la vía',
	'25.solution': 'Fijar la dirección de la vía',
	'27.enabled': true,
	'27.problemLink': 'W:Corrigiendo_ciudades_"manchadas"',
	'27.solutionLink': 'W:Crear_y_editar_segmentos_de_vías#Address_Properties',
	'27.title': 'Nombre de ciudad en vía férrea',
	'27.problem': 'Poner nombres de ciudad en la vía férrea puede generar ciudades manchadas',
	'27.solution': 'En las propiedades de dirección seleccione la casilla \'Ninguno\' cerca del nombre de ciudad, haz clic en \'Aplicar\'',
	'28.problemLink': 'W:Puntos_de_Unión._Guía_de_estilo#Bifurcaciones_de_rampas',
	'28.solutionLink': 'W:Crear_y_editar_segmentos_de_vías#Address_Properties',
	'28.title': 'Nombre de calle en una rampa bidireccional',
	'28.problem': 'Si la rampa no tiene nombre, el nombre del segmento siguiente se propagará hacia atrás',
	'28.solution': 'En la caja de propiedades de la dirección, marca la casilla \'Ninguno\' en el nombre de la calle y haz clic en \'Aplicar\'',
	'29.problemLink': 'W:Crear_y_editar_rotondas#Creaci.C3.B3n_de_una_rotonda_a_partir_de_una_intersecci.C3.B3n',
	'29.solutionLink': 'W:Crear_y_editar_segmentos_de_vías#Address_Properties',
	'29.title': 'Nombre de calle en rotonda',
	'29.problem': 'En Waze, no nombramos los segmentos de las rotondas',
	'29.solution':
		'En la caja de propiedades de la dirección, marca la casilla \'Ninguno\' en el nombre de la calle y haz clic en \'Aplicar\' y después crea un punto de interés tipo \'intersección / intercambio\' para nombrar la rotonda',
	'34.title': 'Nombre de calle alternativo vacío',
	'34.problem': 'El nombre de calle alternativo está vacío',
	'34.solution': 'Borrar el nombre alternativo de calle vacío',
	'35.title': 'Segmento de vía sin terminar',
	'35.problem': 'Waze no enrutará desde un segmento sin terminar',
	'35.solution': 'Mover un poco el segmento para que el extremo sin terminar sea añadido automáticamente al punto de unión',
	'36.title': 'Punto de unión A innecesario (slow)',
	'36.problem': 'Los segmentos adyacentes al punto de unión A son idénticos',
	'36.solution': 'Selecciona el punto de unión A y pulsa la tecla borrar para unir los dos segmentos',
	'37.title': 'Punto de unión B innecesario (slow)',
	'37.problem': 'Los segmentos adyacentes al punto de unión B son idénticos',
	'37.solution': 'Selecciona el punto de unión B y pulsa la tecla borrar para unir los dos segmentos',
	'38.problemLink': 'W:Restricciones_horarias#En_segmentos',
	'38.title': 'Restricción de segmento caducada (slow)',
	'38.problem': 'El segmento tiene una restricción caducada',
	'38.solution': 'Hacer clic en \'Editar restricciones\' y borrar la restricción caducada',
	'39.problemLink': 'W:Restricciones_horarias#En_giros',
	'39.title': 'Restricción de giro caducada (slow)',
	'39.problem': 'El segmento tiene un giro con una restricción caducada',
	'39.solution': 'Hacer clic en el icono de reloj cerca de la flecha amarilla y borrar la restricción caducada',
	'41.title': 'Conectividad inversa en punto de unión A del segmento',
	'41.problem': 'Hay un giro que va contra la dirección del segmento en el punto de unión A del segmento',
	'41.solution': 'Hacer el segmento \'bidireccional\', restringir todos los giros en el punto de unión A y luego hacer el segmento \'Unidireccional (A→B)\' nuevamente',
	'42.title': 'Conectividad inversa en punto de unión B del segmento',
	'42.problem': 'Hay un giro que va contra la dirección del segmento en el punto de unión B del segmento',
	'42.solution': 'Hacer el segmento \'bidireccional\', restringir todos los giros en el punto de unión B y luego hacer el segmento \'Unidireccional (B→A)\' nuevamente',
	'43.solutionLink': 'W:Guía_rápida_de_edición_de_mapas#Dividir_un_segmento',
	'43.title': 'Auto conectividad',
	'43.problem': 'El segmento está conectado a si mismo',
	'43.solution': 'Divide el segmento en TRES partes',
	'44.solutionLink': 'W:Crear_y_editar_segmentos_de_vías#Establecer_giros_permitidos_.28conexiones.29',
	'44.title': 'Sin conexión de salida',
	'44.problem': 'El segmento no tiene ningún giro de salida permitido',
	'44.solution': 'Activa al menos un giro de salida desde el segmento',
	'45.solutionLink': 'W:Crear_y_editar_segmentos_de_vías#Establecer_giros_permitidos_.28conexiones.29',
	'45.title': 'Sin conexión de entrada',
	'45.problem': 'El segmento no privado no tiene ningún giro de entrada permitido',
	'45.solution': 'Selecciona un segmento adyacente y activa por lo menos un giro hacia el segmento',
	'46.solutionLink': 'W:Crear_y_editar_segmentos_de_vías#Establecer_giros_permitidos_.28conexiones.29',
	'46.title': 'Sin entrada en A (slow)',
	'46.problem': 'El segmento no-privado no tiene ningún giro de entrada habilitado en el punto de unión A',
	'46.solution': 'Selecciona un segmento adyacente y habilita al menos un giro hacia el segmento en el punto de unión A',
	'47.solutionLink': 'W:Crear_y_editar_segmentos_de_vías#Establecer_giros_permitidos_.28conexiones.29',
	'47.title': 'Sin entrada en B (slow)',
	'47.problem': 'El segmento no-privado no tiene ningún giro de entrada habilitado en el punto de unión B',
	'47.solution': 'Selecciona un segmento adyacente y habilita al menos un giro hacia el segmento en el punto de unión B',
	'48.solutionLink': 'W:Crear_y_editar_rotondas#Arreglar_rotondas_editadas_manualmente',
	'48.title': 'Segmento de rotonda bidireccional',
	'48.problem': 'El segmento de rotonda es bidireccional',
	'48.solution': 'Rehacer la rotonda',
	'50.solutionLink': 'W:Crear_y_editar_rotondas#Arreglar_rotondas_editadas_manualmente',
	'50.title': 'No hay conectividad en la rotonda (slow)',
	'50.problem': 'El segmento de la rotonda no tiene conectividad con el segmento de rotonda siguiente',
	'50.solution': 'Permitir un giro al segmento adyacente o rehacer la rotonda',
	'57.enabled': true,
	'57.solutionLink': 'W:Crear_y_editar_segmentos_de_vías#Address_Properties',
	'57.title': 'Nombre de ciudad en rampa con nombre',
	'57.problem': 'Poner el nombre de ciudad en las rampas puede afectar a los resultados de búsqueda',
	'57.solution': 'En las propiedades de dirección seleccione la casilla \'Ninguno\' cerca del nombre de ciudad, haz clic en \'Aplicar\'',
	'59.enabled': true,
	'59.problemLink': 'W:Corrigiendo_ciudades_\'manchadas\'',
	'59.solutionLink': 'W:Crear_y_editar_segmentos_de_vías#Address_Properties',
	'59.title': 'Nombre de Ciudad en Autopista',
	'59.problem': 'Poner nombres de ciudad en la Autopista puede generar ciudades manchadas',
	'59.solution': 'En las propiedades de dirección seleccione la casilla \'Ninguno\' cerca del nombre de ciudad, haz clic en \'Aplicar\'',
	'73.enabled': true,
	'73.title': 'Menos de 3 caracteres de longitud en el nombre de la calle',
	'73.problem': 'El nombre de la calle tiene una longitud de menos de 3 caracteres',
	'73.solution': 'Corrige el nombre de la calle',
	'74.problemLink': 'W:Crear_y_editar_rotondas',
	'74.solutionLink': 'W:Crear_y_editar_rotondas#Arreglar_rotondas_editadas_manualmente',
	'74.title': 'Varios segmentos en el punto de unión A de la rotonda',
	'74.problem': 'La rotonda tiene en el punto de unión A más de un segmento conectado',
	'74.solution': 'Rehacer la rotonda',
	'77.title': 'Calle sin salida con giro en U',
	'77.problem': 'La calle sin salida tiene un giro en U habilitado',
	'77.solution': 'Deshabilitar el giro en U',
	'78.solutionLink': 'W:Guía_rápida_de_edición_de_mapas#Dividir_un_segmento',
	'78.title': 'Segmentos con los mismos puntos de inicio y final (slow)',
	'78.problem': 'Dos segmentos comparten los puntos de inicio y final',
	'78.solution': 'Divide el segmento. También puedes borrar uno de los segmentos si son idénticos',
	'79.title': 'Conector para giros en U demasiado corto (slow)',
	'79.problem': 'La longitud del segmento es menor de 15 metros por lo que el giro en U no es posible',
	'79.solution': 'Aumente la longitud del segmento',
	'87.problemLink': 'W:Crear_y_editar_rotondas',
	'87.solutionLink': 'W:Crear_y_editar_rotondas#Arreglar_rotondas_editadas_manualmente',
	'87.title': 'Más de un segmento de salida en el punto de unión A de la rotonda',
	'87.problem': 'La rotonda tiene en el punto de unión A más de un segmento de salida conectado',
	'87.solution': 'Rehacer la rotonda',
	'90.enabled': true,
	'90.title': 'Segmento de Autopista bidireccional',
	'90.problem': 'La mayoría de las Autopistas están separadas en dos vías de un sentido, por lo que este segmento bidireccional puede ser un error',
	'90.solution': 'Revisar dirección de Autopista',
	'99.title': 'Giro en U en la entrada de rotonda (slow)',
	'99.problem': 'El segmento de entrada a la rotonda tiene un giro en U habilitado',
	'99.solution': 'Deshabilitar el giro en U',
	'101.enabled': false,
	'101.title': 'Zona en construcción (sólo disponible en el informe)',
	'101.problem': 'El segmento está marcado como zona de construcción',
	'101.solution': 'Si la construcción está terminada, volver a conectar el segmento y borrar el sufijo',
	'102.solutionLink': 'W:Crear_y_editar_segmentos_de_vías#Establecer_giros_permitidos_.28conexiones.29',
	'102.title': 'Sin salida en A (slow)',
	'102.problem': 'El segmento no tiene ningún giro de salida habilitado en el punto de unión A',
	'102.solution': 'Habilita al menos un giro de salida desde el segmento en el punto de unión A',
	'103.solutionLink': 'W:Crear_y_editar_segmentos_de_vías#Establecer_giros_permitidos_.28conexiones.29',
	'103.title': 'Sin salida en B (slow)',
	'103.problem': 'El segmento no tiene ningún giro de salida habilitado en el punto de unión B',
	'103.solution': 'Habilita al menos un giro de salida desde el segmento en el punto de unión B',
	'104.title': 'Vía férrea usada para comentarios',
	'104.problem': 'El segmento de vía férrea es probablemente usado como comentario de mapa',
	'104.solution': 'Borrar el comentario ya que las vías férreas serán añadidas al mapa del cliente',
	'107.title': 'Sin conexión en punto de unión A (slow)',
	'107.problem': 'El punto de unión A del segmento está a menos de 5 metros de otro segmento pero no está conectado',
	'107.solution': 'Conectar el punto de unión A a un segmento cercano o separarlos un poco más',
	'108.title': 'Sin conexión en punto de unión B (slow)',
	'108.problem': 'El punto de unión B del segmento está a menos de 5 metros de otro segmento pero no está conectado',
	'108.solution': 'Conectar el punto de unión B a un segmento cercano o separarlos un poco más',
	'109.solutionLink': 'W:Guía_rápida_de_edición_de_mapas#Eliminar_un_punto_de_uni.C3.B3n',
	'109.title': 'Segmento muy corto',
	'109.problem': 'El segmento tiene menos de 2 metros de longitud, así que es difícil de ver en el mapa',
	'109.solution': 'Aumentar la longitud, borrar el segmento, o unirlo a un segmento adyacente',
	'112.title': 'Más de 55 caracteres en el nombre de la Rampa',
	'112.problem': 'El nombre de la Rampa tiene más de 55 caracteres',
	'112.solution': 'Acorta el nombre de la Rampa',
	'114.enabled': false,
	'114.title': 'No transitable conectada a transitable en el punto de unión A (slow)',
	'114.problem': 'El segmento no transitable tiene un punto de unión con un segmento transitable en el extremo A',
	'114.solution': 'Desconecta el extremo A de todos los segmentos transitables',
	'115.enabled': false,
	'115.title': 'No transitable conectada a transitable en el punto de unión B (slow)',
	'115.problem': 'El segmento no transitable tiene un punto de unión con un segmento transitable en el extremo B',
	'115.solution': 'Desconecta el extremo B de todos los segmentos transitables',
	'116.title': 'Elevación fuera de rango',
	'116.problem': 'La elevación del segmento está fuera de rango',
	'116.solution': 'Corrige la elevación',
	'117.enabled': false,
	'117.title': 'Marcado obsoleto: CONST ZN',
	'117.problem': 'El segmento está marcado con el sufijo obsoleto CONST ZN',
	'117.solution': 'Cambiar CONST ZN a (closed)',
	'118.title': 'Segmentos superpuestos en A (slow)',
	'118.problem': 'El segmento se solapa con el segmento adyacente en el punto de unión A',
	'118.solution': 'Separa los dos segmentos al menos 2º o elimina el nodo de geometría innecesario o borra el segmento duplicado en el punto de unión A',
	'119.title': 'Segmentos superpuestos en B (slow)',
	'119.problem': 'El segmento se solapa con el segmento adyacente en el punto de unión B',
	'119.solution': 'Separa los dos segmentos al menos 2º o elimina el nodo de geometría innecesario o borra el segmento duplicado en el punto de unión B',
	'120.title': 'Giro demasiado cerrado en A (slow)',
	'120.problem': 'El segmento tiene un giro demasiado cerrado en el punto de unión A',
	'120.solution': 'Desactiva el giro cerrado en el punto de unión A o considera separar los segmentos hasta un ángulo de 30°',
	'121.title': 'Giro demasiado cerrado en B (slow)',
	'121.problem': 'El segmento tiene un giro demasiado cerrado en el punto de unión B',
	'121.solution': 'Desactiva el giro cerrado en el punto de unión B o considera separar los segmentos hasta un ángulo de 30°',
	'128.title': 'Comprobación personalizada por el usuario 1',
	'128.problem': 'Alguna de las propiedades del segmento coinciden con la expresión regular definida por el usuario (ver Ajustes→Personalización)',
	'128.solution': 'Resolver el problema',
	'129.title': 'Comprobación personalizada por el usuario 2',
	'129.problem': 'Alguna de las propiedades del segmento coinciden con la expresión regular definida por el usuario (ver Ajustes→Personalización)',
	'129.solution': 'Resolver el problema',
	'130.enabled': true,
	'130.severity': 'N',
	'130.title': 'Nivel de bloqueo de Autopista incorrecto',
	'130.problem': 'El segmento de Autopista no está bloqueado a nivel 4',
	'130.problemLink': 'W:Dudas_frecuentes_editando_mapas#.C2.BFDebo_.22bloquear.22_mis_ediciones.3F',
	'130.solution': 'Bloquear el segmento de Autopista a nivel 4',
	'130.params':
		{'titleEN': 'No lock on Freeway', 'problemEN': 'The Freeway segment should be locked to Lvl 4', 'solutionEN': 'Lock the segment', 'template': '${type}:${lock}', 'regexp': '/^3:[^4]/'},
	'131.enabled': true,
	'131.severity': 'N',
	'131.title': 'No lock on Major Highway',
	'131.problem': 'The Major Highway segment should be locked to Lvl 3',
	'131.problemLink': 'W:Dudas_frecuentes_editando_mapas#.C2.BFDebo_.22bloquear.22_mis_ediciones.3F',
	'131.solution': 'Lock the segment',
	'131.params': {
	  'titleEN': 'No lock on Major Highway',
	  'problemEN': 'The Major Highway segment should be locked to Lvl 3',
	  'solutionEN': 'Lock the segment',
	  'template': '${type}:${lock}:${street}',
	  'regexp': '/^6:[^3]:N-/'
	},
	'133.enabled': true,
	'133.severity': 'N',
	'133.title': 'No lock on Ramp',
	'133.problem': 'The Ramp segment should be locked to Lvl 3',
	'133.problemLink': 'W:Dudas_frecuentes_editando_mapas#.C2.BFDebo_.22bloquear.22_mis_ediciones.3F',
	'133.solution': 'Lock the segment',
	'133.params': {'titleEN': 'No lock on Ramp', 'problemEN': 'The Ramp segment should be locked to Lvl 3', 'solutionEN': 'Lock the segment', 'template': '${type}:${lock}', 'regexp': '/^4:[^3]/'},
	'150.title': 'Nivel de bloqueo de Autopista incorrecto',
	'150.problem': 'El segmento de Autopista no está bloqueado a nivel ${n}',
	'150.solution': 'Bloquear el segmento de Autopista a nivel ${n}',
	'169.title': 'Calle nombrada incorrectamente',
	'169.problem': 'La calle tiene el nombre incorrecto, usando caracteres o palabras ilegales',
	'169.solution': 'Renombre la calle de acuerdo a los criterios establecidos',
	'170.enabled': true,
	'170.title': 'Nombre de calle comienza con minúscula',
	'170.problem': 'El nombre de la calle comienza con minúscula',
	'170.solution': 'Escribir en mayúscula la primera letra del nombre',
	'172.title': 'Nombre de calle con espacios innecesarios',
	'172.problem': 'Espacio en blanco inicial/final o doble en el nombre de la calle',
	'172.solution': 'Borrar los espacios innecesarios del nombre de Calle',
	'173.enabled': false,
	'173.title': 'Nombre de segmento sin espacio antes o después de una abreviación',
	'173.problem': 'Sin espacio antes (\'1943r.\') o después (\'St.Jan\') de una abreviación en el nombre del segmento',
	'173.solution': 'Agregar un espacio antes/después de la abreviación',
	'175.solutionLink': 'W:Crear_y_editar_segmentos_de_vías#Address_Properties',
	'175.title': 'Nombre del segmento sólo con espacios',
	'175.problem': 'El nombre del segmento sólo tiene espacios en blanco en el nombre',
	'175.solution': 'En la caja de propiedades de la dirección, marca la casilla \'Ninguno\' en el nombre de la calle y haz clic en \'Aplicar\' o escribe un nombre de calle correcto',
	'190.title': 'Nombre de ciudad con minúscula',
	'190.problem': 'El nombre de la ciudad comienza con minúscula',
	'190.solution': 'Utiliza este formulario para renombrar la ciudad',
	'192.title': 'Nombre de Ciudad con espacios innecesarios',
	'192.problem': 'Espacio en blanco inicial/final o doble en el nombre de la ciudad',
	'192.solution': 'Use este formulario para renombrar la Ciudad',
	'193.enabled': false,
	'193.title': 'Nombre de Ciudad sin espacio delante o atrás de una abreviación',
	'193.problem': 'Sin espacio antes (\'1943r.\') o después (\'St.Jean\') de una abreviación en el nombre de la ciudad',
	'193.solution': 'Use este formulario para renombrar la Ciudad',
	'200.problemLink': 'W:Giros_implícitos_y_explícitos',
	'200.solutionLink': 'W:Giros_implícitos_y_explícitos#Mejores_pr.C3.A1cticas',
	'200.title': 'Unión A: Giro suave (implícito) en segmento',
	'200.problem': 'El segmento tiene un giro no confirmado',
	'200.solution': 'Haz clic en el giro indicado con un signo de interrogación color púrpura para confirmarlo. Nota: es posible que debas hacer el segmento bidireccional para ver todos los giros',
	'201.problemLink': 'W:Giros_implícitos_y_explícitos',
	'201.solutionLink': 'W:Giros_implícitos_y_explícitos#Mejores_pr.C3.A1cticas',
	'201.title': 'Unión A: Giro suave (implícito) en segmento principal',
	'201.problem': 'El segmento principal tiene un giro no confirmado',
	'201.solution': 'Haz clic en el giro indicado con un signo de interrogación color púrpura para confirmarlo. Nota: es posible que debas hacer el segmento bidireccional para ver todos los giros'
  },
  'DE': {
	'.codeISO': 'DE',
	'.country': 'Germany',
	'59.enabled': true,
	'59.problemLink': 'W:How_to_label_and_name_roads_(Austria)#Autobahnen_and_Schnellstra.C3.9Fen_.28A_.26_S.29',
	'90.enabled': true,
	'110.enabled': true,
	'150.enabled': true,
	'150.problemLink': 'W:Die_beste_Vorgehensweise_beim_Bearbeiten_der_Karte#Richtung_und_Sperren_von_Stra.C3.9Fen',
	'214.params': {'regexp': '/^7|.+0$/'},
	'215.params': {'regexp': '/^7|.+0$/'}
  },
  'EN': {
	'.codeISO': 'EN',
	'city.consider': 'consider this city name:',
	'city.1': 'city name is too short',
	'city.2': 'expand the abbreviation',
	'city.3': 'complete short name',
	'city.4': 'complete city name',
	'city.5': 'correct letter case',
	'city.6': 'check word order',
	'city.7': 'check abbreviations',
	'city.8a': 'add county name',
	'city.8r': 'remove county name',
	'city.9': 'check county name',
	'city.10a': 'add a word',
	'city.10r': 'remove a word',
	'city.11': 'add county code',
	'city.12': 'identical names, but different city IDs',
	'city.13a': 'add a space',
	'city.13r': 'remove a space',
	'city.14': 'check the number',
	'props.skipped.title': 'The segment is not checked',
	'props.skipped.problem': 'The segment is modified after 2014-05-01 AND locked for you, so Validator did not check it',
	'err.regexp': 'Error parsing option for check #${n}:',
	'props.disabled': 'WME Validator is disabled',
	'props.limit.title': 'Too many issues reported',
	'props.limit.problem': 'There are too many issues reported, so some of them might not be shown',
	'props.limit.solution': 'Deselect the segment and stop scanning process. Then click red \'✘\' (Clear report) button',
	'props.reports': 'reports',
	'props.noneditable': 'You cannot edit this segment',
	'report.save': 'Save this report',
	'report.list.andUp': 'and up',
	'report.list.severity': 'Severity:',
	'report.list.reportOnly': 'only in report',
	'report.list.forEditors': 'For editors level:',
	'report.list.forCountries': 'For countries:',
	'report.list.forStates': 'For states:',
	'report.list.forCities': 'For cities:',
	'report.list.params': 'Params to configure in localization pack:',
	'report.list.params.set': 'Current configuration for ${country}:',
	'report.list.enabled': '${n} checks are enabled for',
	'report.list.disabled': '${n} checks are disabled for',
	'report.list.total': 'There are ${n} checks available',
	'report.list.title': 'Complete List of Checks for',
	'report.list.see': 'See',
	'report.list.checks': 'Settings->About->Available checks',
	'report.list.fallback': 'Localization Fallback Rules:',
	'report.and': 'and',
	'report.segments': 'Total number of segments checked:',
	'report.customs': 'Custom checks matched (green/blue):',
	'report.reported': 'Reported',
	'report.errors': 'errors',
	'report.warnings': 'warnings',
	'report.notes': 'notes',
	'report.link.wiki': 'wiki',
	'report.link.forum': 'forum',
	'report.link.other': 'link',
	'report.contents': 'Contents:',
	'report.summary': 'Summary',
	'report.title': 'WME Validator Report',
	'report.share': 'to Share',
	'report.generated.by': 'generated by',
	'report.generated.on': 'on',
	'report.source': 'Report source:',
	'report.filter.duplicate': 'duplicate segments',
	'report.filter.venue': 'venues',
	'report.filter.streets': 'Streets and Service Roads',
	'report.filter.other': 'Other drivable and Non-drivable',
	'report.filter.noneditable': 'non-editable segments',
	'report.filter.notes': 'notes',
	'report.filter.title': 'Filter:',
	'report.filter.excluded': 'are excluded from this report.',
	'report.search.updated.by': 'updated by',
	'report.search.updated.since': 'updated since',
	'report.search.city': 'from',
	'report.search.reported': 'reported as',
	'report.search.title': 'Search:',
	'report.search.only': 'only segments',
	'report.search.included': 'are included into the report.',
	'report.beta.warning': 'WME Beta Warning!',
	'report.beta.text': 'This report is generated in beta WME with beta permalinks.',
	'report.beta.share': 'Please do not share those permalinks!',
	'report.size.warning': '<b>Warning!</b><br>The report is ${n}' +
		' characters long' +
		' so <b>it will not fit</b> into a single forum or private message.' +
		'\n<br>Please add <b>more filters</b> to reduce the size of the report.',
	'report.note.limit': '* Note: there were too many issues reported, so some of them are not counted in the summary.',
	'report.forum': 'To motivate further development please leave your comment on the',
	'report.forum.link': 'Waze forum thread.',
	'report.thanks': 'Thank you for using WME Validator!',
	'msg.limit.segments': 'There are too many segments.\n\nClick \'Show report\' to review the report, then\n',
	'msg.limit.segments.continue': 'click \'▶\' (Play) to continue.',
	'msg.limit.segments.clear': 'click \'✘\' (Clear) to clear the report.',
	'msg.pan.text': 'Pan around to validate the map',
	'msg.zoomout.text': 'Zoom out to start WME Validator',
	'msg.click.text': 'Click \'▶\' (Play) to validate visible map area',
	'msg.autopaused': 'autopaused',
	'msg.autopaused.text': 'Auto paused! Click \'▶\' (Play) to continue.',
	'msg.autopaused.tip': 'WME Validator automatically paused on map drag or window size change',
	'msg.finished.text': 'Click <b>\'Show report\'</b> to review map issues',
	'msg.finished.tip': 'Click \'✉\' (Share) button to post report on a\nforum or in a private message',
	'msg.noissues.text': 'Finished! No issues found!',
	'msg.noissues.tip': 'Try to uncheck some filter options or start WME Validator over another map area!',
	'msg.scanning.text': 'Scanning! Finishing in ~ ${n} min',
	'msg.scanning.text.soon': 'Scanning! Finishing in a minute!',
	'msg.scanning.tip': 'Click \'Pause\' button to pause or \'■\' (Stop) to stop',
	'msg.starting.text': 'Starting! Layers are off to scan faster!',
	'msg.starting.tip': 'Use \'Pause\' button to pause or \'■\' button to stop',
	'msg.paused.text': 'On pause! Click \'▶\' (Play) button to continue.',
	'msg.paused.tip': 'To view the report click \'Show report\' button (if available)',
	'msg.continuing.text': 'Continuing!',
	'msg.continuing.tip': 'WME Validator will continue from the location it was paused',
	'msg.settings.text': 'Click <b>\'Back\'</b> to return to main view',
	'msg.settings.tip': 'Click \'Reset defaults\' button to reset all settings in one click!',
	'msg.reset.text': 'All filter options and settings have been reset to their defaults',
	'msg.reset.tip': 'Click \'Back\' button to return to main view',
	'msg.textarea.pack':
		'This is a Greasemonkey/Tampermonkey script. You can copy and paste the text below into a <b>new .user.js file</b><br>or <b>paste it directly</b> into the Greasemonkey/Tampermonkey',
	'msg.textarea': 'Please copy the text below and then paste it into your forum post or private message',
	'noaccess.text':
		'<b>Sorry,</b><br>You cannot use WME Validator over here.<br>Please check <a target=\'_blank\' href=\'' + PFX_FORUM + FORUM_HOME + '\'>the forum thread</a><br>for more information.',
	'noaccess.tip': 'Please check the forum thread for more information!',
	'tab.switch.tip.on': 'Click to switch highlighting on (Alt+V)',
	'tab.switch.tip.off': 'Click to switch highlighting off (Alt+V)',
	'tab.filter.text': 'filter',
	'tab.filter.tip': 'Options to filter the report and highlighted segments',
	'tab.search.text': 'search',
	'tab.search.tip': 'Advanced filter options to include only specific segments',
	'tab.help.text': 'help',
	'tab.help.tip': 'Need help?',
	'filter.noneditables.text': 'Exclude <b>non-editable</b> objects',
	'filter.noneditables.tip': 'Do not report locked objects or\nobjects outside of your editable areas',
	'filter.duplicates.text': 'Exclude <b>duplicate</b> objects',
	'filter.duplicates.tip': 'Do not show the same object in different\nparts of report\n* Note: this option DOES NOT affect highlighting',
	'filter.venues.text': 'Exclude venues',
	'filter.venues.tip': 'Do not report venues',
	'filter.streets.text': 'Exclude <b>Streets and Service Roads</b>',
	'filter.streets.tip': 'Do not report Streets and Service Roads',
	'filter.other.text': 'Exclude <b>Other drivable and Non-drivable</b>',
	'filter.other.tip': 'Do not report Dirt, Parking Lot, Private Roads\nand non-drivable segments',
	'filter.notes.text': 'Exclude <b>notes</b>',
	'filter.notes.tip': 'Report only warnings and errors',
	'search.youredits.text': 'Include <b>only your edits</b>',
	'search.youredits.tip': 'Include only segments edited by you',
	'search.updatedby.text': '<b>Updated by*:</b>',
	'search.updatedby.tip': 'Include only segments updated by the specified editor' +
		'\n* Note: this option is available for country managers only' +
		'\nThis field supports:' +
		'\n - lists: me, otherEditor' +
		'\n - wildcards: world*' +
		'\n - negation: !me, *' +
		'\n* Note: you may use \'me\' to match yourself',
	'search.updatedby.example': 'Example: me',
	'search.updatedsince.text': '<b>Updated since:</b>',
	'search.updatedsince.tip': 'Include only segments edited since the date specified' +
		'\nFirefox date format: YYYY-MM-DD',
	'search.updatedsince.example': 'YYYY-MM-DD',
	'search.city.text': '<b>City name:</b>',
	'search.city.tip': 'Include only segments with specified city name' +
		'\nThis field supports:' +
		'\n - lists: Paris, Meudon' +
		'\n - wildcards: Greater * Area' +
		'\n - negation: !Paris, *',
	'search.city.example': 'Example: !Paris, *',
	'search.checks.text': '<b>Reported as:</b>',
	'search.checks.tip': 'Include only segments reported as specified' +
		'\nThis field matches:' +
		'\n - severities: errors' +
		'\n - check names: New road' +
		'\n - check IDs: 200' +
		'\nThis field supports:' +
		'\n - lists: 36, 37' +
		'\n - wildcards: *roundabout*' +
		'\n - negation: !unconfirmed*, *',
	'search.checks.example': 'Example: reverse*',
	'help.text': '<b>Help Topics:</b>' +
		'<br><a target="_blank" href="' + PFX_FORUM + FORUM_FAQ + '">F.A.Q.</a>' +
		'<br><a target="_blank" href="' + PFX_FORUM + FORUM_HOME + '">Ask your question on the forum</a>' +
		'<br><a target="_blank" href="' + PFX_FORUM + FORUM_LOCAL + '">How to adjust Validator for your country</a>' +
		'<br><a target="_blank" href="' + PFX_FORUM + 't=76488&p=663286#p663286">About the "Might be Incorrect City Name"</a>',
	'help.tip': 'Open in a new browser tab',
	'button.scan.tip': 'Start scanning current map area\n* Note: this might take few minutes',
	'button.scan.tip.NA': 'Zoom out to start scanning current map area',
	'button.pause.tip': 'Pause scanning',
	'button.continue.tip': 'Continue scanning the map area',
	'button.stop.tip': 'Stop scanning and return to the start position',
	'button.clear.tip': 'Clear report and segment cache',
	'button.clear.tip.red': 'There are too many reported segments:\n 1. Click \'Show report\' to generate the report.\n 2. Click this button to clear the report and start over.',
	'button.report.text': 'Show report',
	'button.report.tip': 'Apply the filter and generate HTML report in a new tab',
	'button.BBreport.tip': 'Share the report on Waze forum or in a private message',
	'button.settings.tip': 'Configure settings',
	'tab.custom.text': 'custom',
	'tab.custom.tip': 'User-defined custom checks settings',
	'tab.settings.text': 'Settings',
	'tab.scanner.text': 'scanner',
	'tab.scanner.tip': 'Map scanner settings',
	'tab.about.text': 'about</span>',
	'tab.about.tip': 'About WME Validator',
	'scanner.sounds.text': 'Enable sounds',
	'scanner.sounds.tip': 'Bleeps and the bloops while scanning',
	'scanner.sounds.NA': 'Your browser does not support AudioContext',
	'scanner.highlight.text': 'Highlight issues on the map',
	'scanner.highlight.tip': 'Highlight reported issues on the map',
	'scanner.slow.text': 'Enable "slow" checks',
	'scanner.slow.tip': 'Enables deep map analysis\n* Note: this option might slow down the scanning process',
	'scanner.ext.text': 'Report external highlights',
	'scanner.ext.tip': 'Report segments highlighted by WME Toolbox or WME Color Highlights',
	'advanced.atbottom.text': 'At the bottom',
	'advanced.atbottom.tip': 'Put WME Validator at the bottom of the page',
	'custom.template.text': '<a target=\'_blank\' href=\'' + PFX_FORUM + FORUM_CUSTOM + '\'>Custom template</a>',
	'custom.template.tip': 'User-defined custom check expandable template.' +
		'\n\nYou may use the following expandable variables:' +
		'\nAddress:' +
		'\n  ${country}, ${state}, ${city}, ${street},' +
		'\n  ${altCity[index or delimeter]}, ${altStreet[index or delimeter]}' +
		'\nSegment properties:' +
		'\n  ${type}, ${typeRank}, ${toll}, ${direction}, ${elevation}, ${lock},' +
		'\n  ${length}, ${ID}' +
		'\nHelpers:' +
		'\n  ${drivable}, ${roundabout}, ${hasHNs},' +
		'\n  ${Uturn}, ${deadEnd}, ${softTurns},' +
		'\n  ${deadEndA}, ${partialA},' +
		'\n  ${deadEndB}, ${partialB}' +
		'\nConnectivity:' +
		'\n  ${segmentsA}, ${inA}, ${outA}, ${UturnA},' +
		'\n  ${segmentsB}, ${inB}, ${outB}, ${UturnB}',
	'custom.template.example': 'Example: ${street}',
	'custom.regexp.text': 'Custom <a target=\'_blank\' href=\'' + PFX_FORUM + FORUM_CUSTOM + '\'>RegExp</a>',
	'custom.regexp.tip': 'User-defined custom check regular expression to match the template.' +
		'\n\nCase-insensitive match: /regexp/i' +
		'\nNegation (do not match): !/regexp/' +
		'\nLog debug information on console: D/regexp/',
	'custom.regexp.example': 'Example: !/.+/',
	'about.tip': 'Open link in a new tab',
	'button.reset.text': 'Reset defaults',
	'button.reset.tip': 'Revert filter options and settings to their defaults',
	'button.list.text': 'Available checks...',
	'button.list.tip': 'Show a list of checks available in WME Validator',
	'button.wizard.tip': 'Create localization package',
	'button.back.text': 'Back',
	'button.back.tip': 'Close settings and return to main view',
	'23.enabled': true,
	'23.title': 'Unconfirmed road',
	'23.problem': 'Each segment must minimally have the Country and State information',
	'23.problemLink': 'W:Map_Editing_Quick-start_Guide#Create_a_Road',
	'23.solution': 'Confirm the road by updating its details',
	'23.solutionLink': 'W:How_to_label_and_name_roads',
	'24.enabled': true,
	'24.severity': 'W',
	'24.reportOnly': true,
	'24.title': 'Might be incorrect city name (only available in the report)',
	'24.problem': 'The segment might have incorrect city name',
	'24.problemLink': 'W:Fixing_"smudged"_cities',
	'24.solution': 'Consider suggested city name and use this form to rename the city',
	'24.solutionLink': 'F:t=50314#p450378',
	'25.enabled': true,
	'25.severity': 'W',
	'25.title': 'Unknown direction of drivable road',
	'25.problem': '\'Unknown\' road direction will not prevent routing on the road',
	'25.problemLink': 'W:How_to_handle_road_closures#NOTES_for_all_durations',
	'25.solution': 'Set the road direction',
	'27.title': 'City name on Railroad',
	'27.problem': 'City name on the Railroad may cause a city smudge',
	'27.problemLink': 'W:Fixing_"smudged"_cities',
	'27.solution': 'In the address properties check the \'None\' box next to the city name and then click \'Apply\'',
	'27.solutionLink': 'W:Creating_and_Editing_street_segments#Address_Properties',
	'28.enabled': true,
	'28.severity': 'W',
	'28.title': 'Street name on two-way Ramp',
	'28.problem': 'If Ramp is unnamed, the name of a subsequent road will propagate backwards',
	'28.problemLink': 'W:Junction_Style_Guide#Ramp_to_Ramp_Splits',
	'28.solution': 'In the address properties check the \'None\' box next to the street name and then click \'Apply\'',
	'28.solutionLink': 'W:Creating_and_Editing_street_segments#Address_Properties',
	'29.enabled': true,
	'29.severity': 'W',
	'29.title': 'Street name on roundabout',
	'29.problem': 'In Waze, we do not name roundabout segments',
	'29.problemLink': 'W:Creating_and_Editing_a_roundabout#Creating_a_roundabout_from_an_intersection',
	'29.solution': 'In the address properties check the \'None\' box next to the street name, click \'Apply\' and then add \'Junction\' landmark to name the roundabout',
	'29.solutionLink': 'W:Creating_and_Editing_street_segments#Address_Properties',
	'34.enabled': true,
	'34.title': 'Empty alternate street',
	'34.problem': 'Alternate street name is empty',
	'34.solution': 'Remove empty alternate street name',
	'35.enabled': true,
	'35.severity': 'W',
	'35.title': 'Unterminated drivable road',
	'35.problem': 'Waze will not route from the unterminated segment',
	'35.solution': 'Move the segment a bit so the terminating node will be added automatically',
	'36.enabled': false,
	'36.title': 'Node A: Unneeded (slow)',
	'36.problem': 'Adjacent segments at node A are identical',
	'36.problemLink': 'W:Creating_and_Editing_street_segments#Removing_junctions_with_only_two_segments',
	'36.solution': 'Select node A and press Delete key to join the segments',
	'36.solutionLink': 'W:Map_Editing_Quick-start_Guide#Delete_a_Junction',
	'37.enabled': false,
	'37.title': 'Node B: Unneeded (slow)',
	'37.problem': 'Adjacent segments at node B are identical',
	'37.problemLink': 'W:Creating_and_Editing_street_segments#Removing_junctions_with_only_two_segments',
	'37.solution': 'Select node B and press Delete key to join the segments',
	'37.solutionLink': 'W:Map_Editing_Quick-start_Guide#Delete_a_Junction',
	'38.enabled': true,
	'38.title': 'Expired segment restriction (slow)',
	'38.problem': 'The segment has an expired restriction',
	'38.problemLink': 'W:Scheduled_Restrictions#Segments',
	'38.solution': 'Click \'Edit restrictions\' and delete the expired restriction',
	'39.enabled': true,
	'39.title': 'Expired turn restriction (slow)',
	'39.problem': 'The segment has a turn with an expired restriction',
	'39.problemLink': 'W:Scheduled_Restrictions#Turns',
	'39.solution': 'Click clock icon next to the yellow arrow and delete the expired restriction',
	'41.enabled': true,
	'41.title': 'Node A: Reverse connectivity of drivable road',
	'41.problem': 'There is a turn which goes against the directionality of the segment at node A',
	'41.problemLink': 'W:Glossary#Reverse_Connectivity',
	'41.solution': 'Make the segment \'Two-way\', restrict all the turns at node A and then make the segment \'One way (A→B)\' again',
	'42.enabled': true,
	'42.title': 'Node B: Reverse connectivity of drivable road',
	'42.problem': 'There is a turn which goes against the directionality of the segment at node B',
	'42.problemLink': 'W:Glossary#Reverse_Connectivity',
	'42.solution': 'Make the segment \'Two-way\', restrict all the turns at node B and then make the segment \'One way (B→A)\' again',
	'43.enabled': true,
	'43.severity': 'E',
	'43.title': 'Self connectivity',
	'43.problem': 'The segment is connected back to itself',
	'43.problemLink': 'W:Glossary#Self_Connectivity',
	'43.solution': 'Split the segment into THREE pieces',
	'43.solutionLink': 'W:Map_Editing_Quick-start_Guide#Splitting_a_segment',
	'44.enabled': false,
	'44.severity': 'E',
	'44.title': 'No outward connectivity',
	'44.problem': 'The drivable segment has no single outward turn enabled',
	'44.solution': 'Enable at least one outward turn from the segment',
	'44.solutionLink': 'W:Creating_and_Editing_street_segments#Set_allowed_turns_.28connections.29',
	'45.enabled': false,
	'45.severity': 'E',
	'45.title': 'No inward connectivity',
	'45.problem': 'The drivable non-private segment has no single inward turn enabled',
	'45.solution': 'Select an adjacent segment and enable at least one turn to the segment',
	'45.solutionLink': 'W:Creating_and_Editing_street_segments#Set_allowed_turns_.28connections.29',
	'46.enabled': true,
	'46.severity': 'W',
	'46.title': 'Node A: No inward connectivity of drivable road (slow)',
	'46.problem': 'The drivable non-private segment has no single inward turn enabled at node A',
	'46.solution': 'Select an adjacent segment and enable at least one turn to the segment at node A',
	'46.solutionLink': 'W:Creating_and_Editing_street_segments#Set_allowed_turns_.28connections.29',
	'47.enabled': true,
	'47.severity': 'W',
	'47.title': 'Node B: No inward connectivity of drivable road (slow)',
	'47.problem': 'The drivable non-private segment has no single inward turn enabled at node B',
	'47.solution': 'Select an adjacent segment and enable at least one turn to the segment at node B',
	'47.solutionLink': 'W:Creating_and_Editing_street_segments#Set_allowed_turns_.28connections.29',
	'48.enabled': true,
	'48.severity': 'E',
	'48.title': 'Two-way drivable roundabout segment',
	'48.problem': 'The drivable roundabout segment is bidirectional',
	'48.solution': 'Redo the roundabout',
	'48.solutionLink': 'W:Creating_and_Editing_a_roundabout#Improving_manually_drawn_roundabouts',
	'50.enabled': false,
	'50.severity': 'E',
	'50.title': 'No connectivity on roundabout (slow)',
	'50.problem': 'The drivable roundabout segment has no connectivity with adjacent roundabout segment',
	'50.solution': 'Enable a turn to the adjacent segment or redo the roundabout',
	'50.solutionLink': 'W:Creating_and_Editing_a_roundabout#Improving_manually_drawn_roundabouts',
	'52.title': 'Too long street name',
	'52.problem': 'The name of the drivable segment is more than ${n} letters long and it is not a Ramp',
	'52.solution': 'Consider an abbreviation for the street name',
	'52.params': {'n.title': '{number} maximum street name length', 'n': 30},
	'57.severity': 'W',
	'57.title': 'City name on named Ramp',
	'57.problem': 'City name on the named Ramp may affect search results',
	'57.problemLink': 'F:t=68015',
	'57.solution': 'In the address properties check the \'None\' box next to the city name and then click \'Apply\'',
	'57.solutionLink': 'W:Creating_and_Editing_street_segments#Address_Properties',
	'59.title': 'City name on Freeway',
	'59.problem': 'City name on the Freeway may cause a city smudge',
	'59.problemLink': 'W:Fixing_"smudged"_cities',
	'59.solution': 'In the address properties check the \'None\' box next to the city name and then click \'Apply\'',
	'59.solutionLink': 'W:Creating_and_Editing_street_segments#Address_Properties',
	'69.title': 'No city name on Freeway',
	'69.problem': 'The Freeway has no city name set',
	'69.solution': 'Set the city name',
	'73.title': 'Too short street name',
	'73.problem': 'The street name is less than ${n} letters long and it is not a highway',
	'73.solution': 'Correct the street name',
	'73.params': {'n.title': '{number} minimum street name length', 'n': 3},
	'74.enabled': false,
	'74.severity': 'W',
	'74.title': 'Node A: Multiple segments connected at roundabout',
	'74.problem': 'The drivable roundabout node A has more than one segment connected',
	'74.problemLink': 'W:Map_Legend#Types_of_segments_.28Roundabouts.29',
	'74.solution': 'Redo the roundabout',
	'74.solutionLink': 'W:Creating_and_Editing_a_roundabout#Improving_manually_drawn_roundabouts',
	'77.enabled': false,
	'77.severity': 'W',
	'77.title': 'Dead-end U-turn',
	'77.problem': 'The drivable dead-end road has a U-turn enabled',
	'77.problemLink': 'W:Map_Editing_Quick-start_Guide#U-Turns_at_the_end_of_dead-end-streets',
	'77.solution': 'Disable U-turn',
	'78.enabled': true,
	'78.severity': 'W',
	'78.title': 'Same endpoints drivable segments (slow)',
	'78.problem': 'Two drivable segments share the same two endpoints',
	'78.problemLink': 'W:Junction_Style_Guide#Two-segment_loops',
	'78.solution': 'Split the segment. You might also remove one of the segments if they are identical',
	'78.solutionLink': 'W:Map_Editing_Quick-start_Guide#Splitting_a_segment',
	'79.enabled': false,
	'79.severity': 'W',
	'79.title': 'Too short U-turn connector (slow)',
	'79.problem': 'The length of the segment is less than 15m long so U-turn is not possible here',
	'79.problemLink': 'W:Classification_of_crossings',
	'79.solution': 'Increase the length of the segment',
	'87.enabled': true,
	'87.severity': 'E',
	'87.title': 'Node A: Multiple outgoing segments at roundabout',
	'87.problem': 'The drivable roundabout node A has more than one outgoing segment connected',
	'87.problemLink': 'W:Map_Legend#Types_of_segments_.28Roundabouts.29',
	'87.solution': 'Redo the roundabout',
	'87.solutionLink': 'W:Creating_and_Editing_a_roundabout#Improving_manually_drawn_roundabouts',
	'90.severity': 'W',
	'90.title': 'Two-way Freeway segment',
	'90.problem': 'Most of the Freeways are split into two one-way roads, so this two-way segment might be a mistake',
	'90.solution': 'Check Freeway direction',
	'91.severity': 'W',
	'91.title': 'Two-way Ramp segment',
	'91.problem': 'Most of the Ramps are one-way roads, so this two-way segment might be a mistake',
	'91.solution': 'Check Ramp direction',
	'95.severity': 'W',
	'95.title': 'Street name with a dot',
	'95.problem': 'There is a dot in the street name (excluding Ramps)',
	'95.solution': 'Expand the abbreviation or remove the dot',
	'99.enabled': true,
	'99.severity': 'W',
	'99.title': 'U-turn at roundabout entrance (slow)',
	'99.problem': 'The roundabout entrance segment has a U-turn enabled',
	'99.problemLink': 'W:Map_Editing_Quick-start_Guide#U-Turns_at_the_end_of_dead-end-streets',
	'99.solution': 'Disable U-turn',
	'101.enabled': true,
	'101.severity': 'E',
	'101.reportOnly': true,
	'101.title': 'Closed road (only available in the report)',
	'101.problem': 'The segment is marked as closed',
	'101.problemLink': 'W:How_to_handle_road_closures',
	'101.solution': 'If the construction is done, restore the segment connectivity and remove the suffix',
	'101.solutionLink': 'W:Road_Naming_(USA)#Construction_zones_and_closed_roads',
	'101.params': {'regexp.title': '{string} regular expression to match closed road', 'regexp': '/(^|\\b)closed(\\b|$)/i'},
	'102.enabled': true,
	'102.severity': 'W',
	'102.title': 'Node A: No outward connectivity of drivable road (slow)',
	'102.problem': 'The drivable segment has no single outward turn enabled at node A',
	'102.solution': 'Enable at least one outward turn from the segment at node A',
	'102.solutionLink': 'W:Creating_and_Editing_street_segments#Set_allowed_turns_.28connections.29',
	'103.enabled': true,
	'103.severity': 'W',
	'103.title': 'Node B: No outward connectivity of drivable road (slow)',
	'103.problem': 'The drivable segment has no single outward turn enabled at node B',
	'103.solution': 'Enable at least one outward turn from the segment at node B',
	'103.solutionLink': 'W:Creating_and_Editing_street_segments#Set_allowed_turns_.28connections.29',
	'104.enabled': true,
	'104.title': 'Railroad used for comments',
	'104.problem': 'The Railroad segment is probably used as a map comment',
	'104.problemLink': 'F:t=61546',
	'104.solution': 'Remove the comment as Railroads will be added to the client display',
	'105.title': 'Walking Trail instead of a Railroad',
	'105.problem': 'The Walking Trail segment with elevation -5 is probably used instead of a Railroad',
	'105.problemLink': 'F:t=61546',
	'105.solution': 'Change road type to Railroad as Railroads will be added to the client display',
	'106.title': 'No state name selected',
	'106.problem': 'The segment has no state name selected',
	'106.solution': 'Select a state for the segment and apply the changes',
	'106.solutionLink': 'W:Creating_and_Editing_street_segments#Confirm_the_road_by_updating_details',
	'107.enabled': true,
	'107.severity': 'E',
	'107.title': 'Node A: No connection (slow)',
	'107.problem': 'The node A of the drivable segment is within 5m from another drivable segment but not connected by a junction',
	'107.solution': 'Drag the node A to the nearby segment so that it touches or move it a bit further away',
	'108.enabled': true,
	'108.severity': 'E',
	'108.title': 'Node B: No connection (slow)',
	'108.problem': 'The node B of the drivable segment is within 5m from another drivable segment but not connected by a junction',
	'108.solution': 'Drag the node B to the nearby segment so that it touches or move it a bit further away',
	'109.enabled': true,
	'109.severity': 'W',
	'109.title': 'Too short segment',
	'109.problem': 'The drivable non-terminal segment is less than ${n}m long so it is hard to see it on the map and it can cause routing problems',
	'109.problemLink': 'W:Segment_length',
	'109.solution': 'Increase the length, or remove the segment, or join it with one of the adjacent segments',
	'109.solutionLink': 'W:Map_Editing_Quick-start_Guide#Delete_a_Junction',
	'109.params': {'n.title': '{number} minimum segment length', 'n': 5},
	'110.title': 'Incorrect Freeway elevation',
	'110.problem': 'The elevation of the Freeway segment is not a ground',
	'110.problemLink': 'W:Die_beste_Vorgehensweise_beim_Bearbeiten_der_Karte#.C3.9Cber-_und_Unterf.C3.BChrungen',
	'110.solution': 'Set the Freeway elevation to ground',
	'112.enabled': true,
	'112.severity': 'W',
	'112.title': 'Too long Ramp name',
	'112.problem': 'The Ramp name is more than ${n} letters long',
	'112.solution': 'Shorten the Ramp name',
	'112.params': {'n.title': '{number} maximum Ramp name length', 'n': 55},
	'114.enabled': false,
	'114.severity': 'W',
	'114.title': 'Node A: Non-drivable connected to drivable (slow)',
	'114.problem': 'The non-drivable segment makes a junction with a drivable at node A',
	'114.problemLink': 'W:Road_Types_(USA)#Non-drivable_roads',
	'114.solution': 'Disconnect node A from all of the drivable segments',
	'115.enabled': false,
	'115.severity': 'W',
	'115.title': 'Node B: Non-drivable connected to drivable (slow)',
	'115.problem': 'The non-drivable segment makes a junction with a drivable at node B',
	'115.problemLink': 'W:Road_Types_(USA)#Non-drivable_roads',
	'115.solution': 'Disconnect node B from all of the drivable segments',
	'116.enabled': true,
	'116.severity': 'W',
	'116.title': 'Out of range elevation',
	'116.problem': 'The segment elevation is out of range',
	'116.solution': 'Correct the elevation',
	'117.enabled': true,
	'117.severity': 'W',
	'117.title': 'Obsolete CONST ZN marker',
	'117.problem': 'The segment is marked with obsolete CONST ZN suffix',
	'117.solution': 'Change CONST ZN to (closed)',
	'117.solutionLink': 'W:Road_Naming_(USA)#Construction_zones_and_closed_roads',
	'118.enabled': true,
	'118.severity': 'E',
	'118.title': 'Node A: Overlapping segments (slow)',
	'118.problem': 'The segment is overlapping with the adjacent segment at node A',
	'118.solution': 'Spread the segments at 2° or delete unneeded geometry point or delete the duplicate segment at node A',
	'119.enabled': true,
	'119.severity': 'E',
	'119.title': 'Node B: Overlapping segments (slow)',
	'119.problem': 'The segment is overlapping with the adjacent segment at node B',
	'119.solution': 'Spread the segments at 2° or delete unneeded geometry point or delete the duplicate segment at node B',
	'120.enabled': true,
	'120.severity': 'W',
	'120.title': 'Node A: Too sharp turn (slow)',
	'120.problem': 'The drivable segment has a very acute turn at node A',
	'120.solution': 'Disable the sharp turn at node A or spread the segments at 30°',
	'121.enabled': true,
	'121.severity': 'W',
	'121.title': 'Node B: Too sharp turn (slow)',
	'121.problem': 'The drivable segment has a very acute turn at node B',
	'121.solution': 'Disable the sharp turn at node B or spread the segments at 30°',
	'128.enabled': true,
	'128.severity': '1',
	'128.title': 'User-defined custom check (green)',
	'128.problem': 'Some of the segment properties matched against the user-defined regular expression (see Settings→Custom)',
	'128.problemLink': 'https://developer.mozilla.org/docs/Web/JavaScript/Guide/Regular_Expressions',
	'128.solution': 'Solve the issue',
	'128.params': {},
	'129.enabled': true,
	'129.severity': '2',
	'129.title': 'User-defined custom check (blue)',
	'129.problem': 'Some of the segment properties matched against the user-defined regular expression (see Settings→Custom)',
	'129.problemLink': 'https://developer.mozilla.org/docs/Web/JavaScript/Guide/Regular_Expressions',
	'129.solution': 'Solve the issue',
	'129.params': {},
	'169.severity': 'W',
	'169.title': 'Incorrectly named street',
	'169.problem': 'The street named incorrectly, illegal chars or words used',
	'169.solution': 'Rename the segment in accordance with the guidelines',
	'169.params': {'regexp.title': '{string} regular expression to match incorrect street name', 'regexp': '!/^[a-zA-Z0-9\\. :"\'(/)-]+$/'},
	'170.severity': 'W',
	'170.title': 'Lowercase street name',
	'170.problem': 'The street name starts with a lowercase word',
	'170.solution': 'Correct lettercase in the street name',
	'170.params': {'regexp.title': '{string} regular expression to match a lowercase name', 'regexp': '/^[a-zа-яёіїєґ]/'},
	'171.severity': 'W',
	'171.title': 'Incorrectly abbreviated street name',
	'171.problem': 'The street name has incorrect abbreviation',
	'171.solution': 'Check upper/lower case, a space before/after the abbreviation and the accordance with the abbreviation table',
	'171.params': {'regexp.title': '{string} regular expression to match incorrect abbreviations', 'regexp': '/\\.$/'},
	'172.enabled': true,
	'172.title': 'Unneeded spaces in street name',
	'172.problem': 'Leading/trailing/double space in the street name',
	'172.solution': 'Remove unneeded spaces from the street name',
	'172.params': {'regexp': '/^\\s|\\s$|\\s\\s/'},
	'173.enabled': true,
	'173.severity': 'W',
	'173.title': 'No space before/after street abbreviation',
	'173.problem': 'No space before (\'1943r.\') or after (\'st.Jan\') an abbreviation in the street name',
	'173.solution': 'Add a space before/after the abbreviation',
	'173.params': {'regexp': '/([^\\s]\\.[^\\s0-9-][^\\s0-9\\.])|([0-9][^\\s0-9]+\\.[^0-9-])/'},
	'174.severity': 'W',
	'174.title': 'Street name spelling mistake',
	'174.problem': 'The is a spelling mistake in the street name',
	'174.solution': 'Add/correct the mistake, check accented letters',
	'174.params': {
	  'regexp.title': '{string} regular expression to match spelling mistakes',
	  'regexp': '/(^|\\b)(accross|cemetary|fourty|foward|goverment|independant|liason|pavillion|portugese|posession|prefered|shcool|wat|wich)($|\\b)/i'
	},
	'175.enabled': true,
	'175.severity': 'W',
	'175.title': 'Empty street name',
	'175.problem': 'The street name has only space characters or a dot',
	'175.solution': 'In the address properties check the \'None\' box next to the street name, click \'Apply\' OR set a proper street name',
	'175.solutionLink': 'W:Creating_and_Editing_street_segments#Confirm_the_road_by_updating_details',
	'175.params': {'regexp': '/^[\\s\\.]*$/'},
	'190.severity': 'W',
	'190.enabled': true,
	'190.title': 'Lowercase city name',
	'190.problem': 'The city name starts with a lowercase letter',
	'190.solution': 'Use this form to rename the city',
	'190.solutionLink': 'F:t=50314#p450378',
	'190.params': {'regexp.title': '{string} regular expression to match a lowercase city name', 'regexp': '/^[a-zа-яёіїєґ]/'},
	'191.severity': 'W',
	'191.title': 'Incorrectly abbreviated city name',
	'191.problem': 'The city name has incorrect abbreviation',
	'191.solution': 'Use this form to rename the city',
	'191.solutionLink': 'F:t=50314#p450378',
	'191.params': {'regexp.title': '{string} regular expression to match incorrect abbreviations', 'regexp': '/\\./'},
	'192.enabled': true,
	'192.title': 'Unneeded spaces in city name',
	'192.problem': 'Leading/trailing/double space in the city name',
	'192.solution': 'Use this form to rename the city',
	'192.solutionLink': 'F:t=50314#p450378',
	'192.params': {'regexp': '/^\\s|\\s$|\\s\\s/'},
	'193.enabled': true,
	'193.title': 'No space before/after city abbreviation',
	'193.problem': 'No space before (\'1943r.\') or after (\'st.Jan\') an abbreviation in the city name',
	'193.solution': 'Use this form to rename the city',
	'193.solutionLink': 'F:t=50314#p450378',
	'193.params': {'regexp': '/([^\\s]\\.[^\\s0-9-][^\\s0-9\\.])|([0-9][^\\s0-9]+\\.[^0-9-])/'},
	'200.enabled': true,
	'200.title': 'Node A: Unconfirmed turn on minor road',
	'200.problem': 'The minor drivable segment has an unconfirmed (soft) turn at node A',
	'200.problemLink': 'W:Soft_and_hard_turns',
	'200.solution': 'Click the turn indicated with a purple question mark to confirm it. Note: you may need to make the segment \'Two-way\' in order to see those turns',
	'200.solutionLink': 'W:Soft_and_hard_turns#Best_practices',
	'201.enabled': true,
	'201.severity': 'W',
	'201.title': 'Node A: Unconfirmed turn on primary road',
	'201.problem': 'The primary segment has an unconfirmed (soft) turn at node A',
	'201.problemLink': 'W:Soft_and_hard_turns',
	'201.solution': 'Click the turn indicated with a purple question mark to confirm it. Note: you may need to make the segment \'Two-way\' in order to see those turns',
	'201.solutionLink': 'W:Soft_and_hard_turns#Best_practices',
	'202.enabled': true,
	'202.severity': 'W',
	'202.title': 'BETA: No public connection for public segment (slow)',
	'202.problem': 'The public segement is not connected to any other public segment',
	'202.solution': 'Verify if the segment is meant to be a public accessible segment, or it should be changed to a private segment',
	'210.enabled': true,
	'210.title': 'Segment has unverified speed limits from A to B',
	'210.problem': 'Segment has speed limit set from A to B that is unverified',
	'210.solution': 'Verify the speed limit on the segment and confirm or correct it',
	'210.solutionLink': 'W:Global/Creating_and_editing_road_segments#Speed_limit',
	'211.enabled': true,
	'211.title': 'Segment has unverified speed limits from B to A',
	'211.problem': 'Segment has speed limit set from B to A that is unverified',
	'211.solution': 'Verify the speed limit on the segment and confirm or correct it',
	'211.solutionLink': 'W:Global/Creating_and_editing_road_segments#Speed_limit',
	'212.enabled': true,
	'212.title': 'Segment has no speed limit set from A to B',
	'212.problem': 'Segment has no speed limit set from A to B',
	'212.solution': 'Verify the speed limit on the segment and set it',
	'212.solutionLink': 'W:Global/Creating_and_editing_road_segments#Speed_limit',
	'213.enabled': true,
	'213.title': 'Segment has no speed limit set from B to A',
	'213.problem': 'Segment has no speed limit set from B to A',
	'213.solution': 'Verify the speed limit on the segment and set it',
	'213.solutionLink': 'W:Global/Creating_and_editing_road_segments#Speed_limit',
	'214.enabled': true,
	'214.title': 'Segment has possibly wrong speed limit from A to B',
	'214.problem': 'Segment has a speed limit that seems to be incorrect',
	'214.solution': 'Verify the speed limit on the segment and correct it if needed',
	'214.params': {'regexp.title': '{string} regular expression to match valid speed limits', 'regexp': '/^.+[05]$/'},
	'215.enabled': true,
	'215.title': 'Segment has possibly wrong speed limit from B to A',
	'215.problem': 'Segment has a speed limit that seems to be incorrect',
	'215.params': {'regexp.title': '{string} regular expression to match valid speed limits', 'regexp': '/^.+[05]$/'},
	'215.solution': 'Verify the speed limit on the segment and correct it if needed',
	'250.enabled': true,
	'250.title': 'Venue has no city set',
	'250.problem': 'This venue has no city set. Every venue should have a city',
	'250.solution': 'Set the city for the venue',
	'251.enabled': true,
	'251.title': 'Venue has last been updated by a bot',
	'251.serverty': 'N',
	'251.problem': 'The last updater was a automated system. Please verify the information to be accurate',
	'251.solution': 'Validate the information of the venue and update where needed',
	'251.params': {
	  'regexp.title': '{string} regular expression to match bot names and ids',
	  'regexp': '/^waze-maint|^105774162$|^waze3rdparty$|^361008095$|^WazeParking1$|^338475699$|^admin$|^-1$|^avsus$|^107668852$/i'
	},
	'252.enabled': true,
	'252.title': 'Parking lot is missing type',
	'252.problem': 'This parking lot is not set to either PUBLIC, RESTRICTED or PRIVATE',
	'252.solution': 'Set type of the parking lot',
	'253.enabled': true,
	'253.title': 'Parking lot is missing cost type',
	'253.problem': 'This parking lot costs are not set to either Free, Low, Moderate or Expensive',
	'253.solution': 'Set the costs of the parking lot',
	'254.enabled': true,
	'254.title': 'Parking lot is missing payment type',
	'254.problem': 'This parking lot is missing payment type(s)',
	'254.solution': 'Set the payment type(s) of the parking lot',
	'255.enabled': true,
	'255.title': 'No lot elevation',
	'255.problem': 'This parking lot has no elevation. Is it street level?',
	'255.solution': 'Set the elevation of the parking lot',
	'256.enabled': true,
	'256.title': 'Entry/exit point has not been moved',
	'256.problem': 'Entry/exit point has not been moved from its initial position',
	'256.solution': 'Set the correct entry/exit point to this venue',
	'257.enabled': true,
	'257.title': 'Parking lot has no entry/exit point',
	'257.problem': 'The parking lot has no entry/exit point set',
	'257.solution': 'Set a correct entry/exit point to this parking lot',
	'258.enabled': true,
	'258.title': 'Park is possibly better categorized as Forest/Trees',
	'258.serverty': 'N',
	'258.problem': 'This park has no name and no city set. This indicates that in fact a better category is Forest/Trees',
	'258.solution': 'Validate this is in fact a park (with a name and city set) or it should be in the Forest/Trees category',
	'259.enabled': true,
	'259.title': 'Brand missing in name of gas station',
	'259.problem': 'The brand of a gas station should be in the name of the station',
	'259.solution': 'Add/replace the brand in the name of the gas station',
	'260.enabled': true,
	'260.title': 'Gas station locked to the wrong level',
	'260.severity': 'W',
	'260.params': {'n.title': '{number} minimum level', 'n': 3},
	'260.problem': 'A gas station should be locked to at least 3',
	'260.solution': 'Lock the gas station to at least level 3',
	'261.enabled': true,
	'261.title': 'Category \'OTHER\' should not be used',
	'261.problem': 'The \'OTHER\' category isn\'t very useful. Users can search on category, other doesn\'t give enough information',
	'261.solution': 'Please select the correct category',
	'262.enabled': true,
	'262.title': 'Invalid phone number',
	'262.problem': 'The Venue has a invalid phone number',
	'262.solution': 'Verify and update Venue phone number',
	'262.params': {'regexp.title': '{string} regular expression to match a correct phone number', 'regexp': '/.+/'},
	'263.enabled': true,
	'263.title': 'Invalid URL',
	'263.problem': 'The Venue has a invalid URL',
	'263.solution': 'Verify and update Venue URL',
	'263.params': {'regexp.title': '{string} regular expression to match a correct URL', 'regexp': '/^(https?://)?([da-z.-]+.[a-z.]{2,6}|[d.]+)([/:?=&#]{1}[da-z.-]+)*[/?]?$/i'},
	'264.enabled': true,
	'264.title': 'Place should be a area place',
	'264.problem': 'The Venue is set as a point place, but should be a area',
	'264.solution': 'Convert the Venue to a area place',
	'264.params': {
	  'regexp.title': '{string} regular expression to match categories that should be a area',
	  'regexp':
		  '/^(GAS_STATION|PARKING_LOT|AIRPORT|BRIDGE|JUNCTION_INTERCHANGE|SEAPORT_MARINA_HARBOR|TUNNEL|CEMETERY|COLLEGE_UNIVERSITY|CONVENTIONS_EVENT_CENTER|EMBASSY_CONSULATE|FIRE_DEPARTMENT|HOSPITAL_URGENT_CARE|MILITARY|POLICE_STATION|PRISON_CORRECTIONAL_FACILITY|SCHOOL|SHOPPING_CENTER|CASINO|RACING_TRACK|STADIUM_ARENA|THEME_PARK|ZOO_AQUARIUM|CONSTRUCTION_SITE|BEACH|GOLF_COURSE|PARK|SKI_AREA|FOREST_GROVE|ISLAND|SEA_LAKE_POOL|RIVER_STREAM|CANAL|SWAMP_MARSH|DAM)$/'
	},
	'265.enabled': true,
	'265.title': 'Place should be a point place',
	'265.problem': 'The Venue is set as a area place, but should be a point',
	'265.solution': 'Convert the Venue to a point place',
	'265.params': {
	  'regexp.title': '{string} regular expression to match categories that should be a point',
	  'regexp':
		  '/^(GARAGE_AUTOMOTIVE_SHOP|CAR_WASH|CHARGING_STATION|BUS_STATION|FERRY_PIER|SUBWAY_STATION|TRAIN_STATION|TAXI_STATION|REST_AREAS|GOVERNMENT|LIBRARY|CITY_HALL|ORGANIZATION_OR_ASSOCIATION|COURTHOUSE|DOCTOR_CLINIC|OFFICES|POST_OFFICE|RELIGIOUS_CENTER|KINDERGARDEN|FACTORY_INDUSTRIAL|INFORMATION_POINT|EMERGENCY_SHELTER|TRASH_AND_RECYCLING_FACILITIES|ARTS_AND_CRAFTS|BANK_FINANCIAL|SPORTING_GOODS|BOOKSTORE|PHOTOGRAPHY|CAR_DEALERSHIP|FASHION_AND_CLOTHING|CONVENIENCE_STORE|PERSONAL_CARE|DEPARTMENT_STORE|PHARMACY|ELECTRONICS|FLOWERS|FURNITURE_HOME_STORE|GIFTS|GYM_FITNESS|SWIMMING_POOL|HARDWARE_STORE|MARKET|SUPERMARKET_GROCERY|JEWELRY|LAUNDRY_DRY_CLEAN|MUSIC_STORE|PET_STORE_VETERINARIAN_SERVICES|TOY_STORE|TRAVEL_AGENCY|ATM|CURRENCY_EXCHANGE|CAR_RENTAL|TELECOM|RESTAURANT|BAKERY|DESSERT|CAFE|FAST_FOOD|FOOD_COURT|BAR|ICE_CREAM|ART_GALLERY|CLUB|TOURIST_ATTRACTION_HISTORIC_SITE|MOVIE_THEATER|MUSEUM|MUSIC_VENUE|PERFORMING_ARTS_VENUE|GAME_CLUB|THEATER|HOTEL|HOSTEL|COTTAGE_CABIN|BED_AND_BREAKFAST|PLAYGROUND|SPORTS_COURT|PLAZA|PROMENADE|POOL|SCENIC_LOOKOUT_VIEWPOINT)$/'
	},
	'266.enabled': true,
	'266.title': 'No lock on Venue',
	'266.problem': 'According to the category, the Venue should be locked at least to Lvl ${n}',
	'266.solution': 'Lock the Venue',
	'266.params': {
	  'n.title': '{number} minimum lock level',
	  'n': 2,
	  'regexp.title': '{string} regular expression to match categories that should be locked to {number}',
	  'regexp': '/^(PARKING_LOT|CHARGING_STATION)$/'
	},
	'267.enabled': true,
	'267.title': 'No lock on Venue',
	'267.problem': 'According to the category, the Venue should be locked at least to Lvl ${n}',
	'267.solution': 'Lock the Venue',
	'267.params': {'n.title': '{number} minimum lock level', 'n': 3, 'regexp.title': '{string} regular expression to match categories that should be locked to {number}', 'regexp': '/(AIRPORT)/'},
	'268.enabled': true,
	'268.title': 'Venue has no street set',
	'268.problem': 'This venue has no street set. Every venue should have a street',
	'268.solution': 'Set the street for the venue'
  },
  'CZ': {
	'.codeISO': 'CZ',
	'.country': 'Czech Republic',
	'27.enabled': true,
	'52.enabled': true,
	'73.enabled': true,
	'90.enabled': true,
	'105.enabled': true,
	'150.enabled': true,
	'150.problemLink': 'F:t=64980&p=572847#p572847',
	'150.params': {'n': 4},
	'151.enabled': true,
	'151.problemLink': 'F:t=64980&p=572847#p572847',
	'151.params': {'n': 4},
	'152.enabled': true,
	'152.problemLink': 'F:t=64980&p=572847#p572847',
	'152.params': {'n': 4},
	'153.enabled': true,
	'153.problemLink': 'F:t=64980&p=572847#p572847',
	'153.params': {'n': 4},
	'154.enabled': true,
	'154.problemLink': 'F:t=64980&p=572847#p572847',
	'154.params': {'n': 3},
	'170.enabled': true,
	'170.params': {
	  'regexp':
		  '/^(?!(alej|bratranců|bratří|bří|dr\\.|gen\\.|generála|kapitána|kpt\\.|krále|majora|mjr\\.|most|nábř\\.|nábřeží|nám\\.|náměstí|park|plk\\.|plukovníka|podplukovníka|por\\.|poručíka|pplk\\.|prap\\.|praporčíka|prof\\.|promenáda|sad|sady|sídl\\.|sídliště|tř\\.|třída|tunel|ul\\.|ulice|zahrada) [^a-z])[a-z]/'
	}
  },
  'CL': {'.codeISO': 'CL', '.country': 'Chile', '.fallbackCode': 'ES', '59.enabled': true, '150.enabled': true, '170.enabled': true, '200.enabled': false},
  'CH': {
	'.codeISO': 'CH',
	'.country': 'Switzerland',
	'59.enabled': true,
	'59.problemLink': 'W:How_to_label_and_name_roads_(Austria)#Autobahnen_and_Schnellstra.C3.9Fen_.28A_.26_S.29',
	'90.enabled': true,
	'110.enabled': true,
	'150.enabled': true,
	'150.problemLink': 'W:Die_beste_Vorgehensweise_beim_Bearbeiten_der_Karte#Richtung_und_Sperren_von_Stra.C3.9Fen'
  },
  'BN': {
	'.codeISO': 'BN',
	'.country': 'Brunei',
	'69.enabled': true,
	'73.enabled': true,
	'150.enabled': true,
	'150.params': {'n': 2},
	'151.enabled': true,
	'151.params': {'n': 2},
	'152.enabled': true,
	'152.params': {'n': 2}
  },
  'BG': {'.codeISO': 'BG', '.country': 'Bulgaria', '27.enabled': true},
  'BE': {
	'.codeISO': 'BE',
	'.country': 'Belgium',
	'109.params': {'n': 6},
	'150.enabled': true,
	'150.problemLink': 'W:Benelux_Freeway',
	'151.enabled': true,
	'151.problemLink': 'W:Benelux_Major_Highway',
	'152.enabled': true,
	'152.problemLink': 'W:Benelux_Minor_Highway',
	'154.enabled': true,
	'154.problemLink': 'W:Benelux_Primary_Street',
	'160.enabled': true,
	'160.problemLink': 'W:Benelux_Freeway',
	'160.params':
		{'solutionEN': 'Rename the Freeway segment to a \'Anum\' or \'Anum - Enum\' or \'Anum ri Dir1 / Dir2\'', 'regexp': '!/^(A|B|E)[0-9]+( - (A|E)[0-9]+)*( ri [^\\/]+( \\/ [^\\/]+)*)?$/'},
	'163.enabled': true,
	'163.problemLink': 'W:Benelux_Roads#Highways',
	'163.solutionLink': 'W:Benelux_Ramp',
	'163.params':
		{'titleEN': 'Ramp name starts with a number', 'problemEN': 'The Ramp name starts with a number', 'solutionEN': 'Rename the Ramp in accordance with the guidelines', 'regexp': '/^([0-9]+)/'},
	'171.enabled': true,
	'171.problemLink': 'W:Benelux_Ramp#Text_To_Speech_.28TTS.29_-_ri_-_di',
	'171.params': {'problemEN': 'The street name contains incorrect \'ri.\' abbreviation', 'solutionEN': 'Change the \'ri.\' abbreviation to \'ri\' (no dot)', 'regexp': '/(^|\\b)ri\\./i'}
  },
  'AU': {
	'.codeISO': 'AU',
	'.country': 'Australia',
	'27.enabled': true,
	'59.enabled': true,
	'59.problemLink': 'W:How_to_label_and_name_roads_(Australia)#Freeway',
	'112.enabled': false,
	'150.enabled': true,
	'150.problemLink': 'W:How_to_label_and_name_roads_(Australia)#Freeway',
	'151.enabled': true,
	'151.problemLink': 'W:How_to_label_and_name_roads_(Australia)#Major_Highway',
	'151.params': {'n': 3},
	'152.enabled': true,
	'152.problemLink': 'W:How_to_label_and_name_roads_(Australia)#Minor_Highway'
  },
  'AT': {
	'.codeISO': 'AT',
	'.country': 'Austria',
	'59.enabled': true,
	'59.problemLink': 'W:How_to_label_and_name_roads_(Austria)#Autobahnen_and_Schnellstra.C3.9Fen_.28A_.26_S.29',
	'90.enabled': true,
	'110.enabled': true,
	'150.enabled': true,
	'150.problemLink': 'W:Die_beste_Vorgehensweise_beim_Bearbeiten_der_Karte#Richtung_und_Sperren_von_Stra.C3.9Fen'
  },
  'AR': {
	'.codeISO': 'AR',
	'.country': 'Argentina',
	'.fallbackCode': 'ES',
	'150.enabled': true,
	'169.enabled': true,
	'169.solutionLink': 'W:Como_categorizar_y_nombrar_calles_(Argentina)#Calles',
	'169.params': {'regexp': '/(^|\\b)[Cc]alle(?! [0-9]+( ([A-Z]|bis))?$)/'}
  }
};
var CC_UNDEFINED = 48;
var CC_NULL = 34;
var CC_BOOL = 46;
var CC_NUMBER = 44;
var CC_STRING = 58;
var CC_GLOBAL = 5;
var CC_FUNCTION = 37;
var CC_ARRAY = 32;
var CC_OBJECT = 42;
var CC_REGEXP = 23;
var CC_DATE = 33;
function classOf(val) {
  return {}.toString.call(val).slice(8, -1)
}
function classCode(obj) {
  return {}.toString.call(obj).charCodeAt(8) ^ {}.toString.call(obj).charCodeAt(11)
}
function classCodeIs(obj, cc) {
  return cc === classCode(obj)
}
function classCodeDefined(obj) {
  return CC_UNDEFINED !== classCode(obj)
}
function isEmpty(obj) {
  for (var k in obj)
	if (obj.hasOwnProperty(k)) return false;
  return true
}
function deepCopy(obj) {
  switch (classCode(obj)) {
	case CC_ARRAY:
	  var cpy = [];
	  for (var i = 0, len = obj.length; i < len; i++) cpy[i] = deepCopy(obj[i]);
	  return cpy;
	case CC_OBJECT:
	  var cpy = {};
	  for (var attr in obj)
		if (obj.hasOwnProperty(attr)) cpy[attr] = deepCopy(obj[attr]);
	  return cpy
  }
  return obj
}
function deepCompare(obj1, obj2) {
  if (obj1 === obj2) return true;
  if (classCode(obj1) !== classCode(obj2)) return false;
  switch (classCode(obj1)) {
	case CC_ARRAY:
	  if (obj1.length != obj2.length) return false;
	  for (var i = 0; i < obj1.length; i++)
		if (!deepCompare(obj1[i], obj2[i])) return false;
	  return true;
	case CC_OBJECT:
	  for (var k in obj1) {
		if (!obj1.hasOwnProperty(k)) continue;
		if (!obj2.hasOwnProperty(k)) return false;
		if (!deepCompare(obj1[k], obj2[k])) return false
	  }
	  return true
  }
  return false
}
function getDirection(seg) {
  return (seg.attributes.fwdDirection ? 1 : 0) + (seg.attributes.revDirection ? 2 : 0)
}
function getLocalizedValue(val) {
  var ipu = OpenLayers.INCHES_PER_UNIT;
  return W.model.isImperial ? Math.round(val * ipu['km'] / ipu['mi']) : val
};
var DEF_DEBUG = false;
var _THUI = {};
_THUI.NONE = 1;
_THUI.DIV = 2;
_THUI.NUMBER = 3;
_THUI.RADIO = 4;
_THUI.CHECKBOX = 5;
_THUI.BUTTON = 6;
_THUI.TEXT = 7;
_THUI.PASSWORD = 8;
_THUI.DATE = 9;
var _WV = {};
var WME_BETA = false;
_WV.$loggedIn = 0;
_WV.$functions = [];
var _UI = {};
var _RT = {};
var _REP = {};
var GL_SHOWLAYERS = false;
var GL_LAYERNAME = 'WME Validator';
var GL_LAYERUNAME = 'WMEValidator';
var GL_LAYERACCEL = 'toggleWMEValidator';
var GL_LAYERSHORTCUT = 'A+v';
var GL_TBCOLOR = 'WMETB_color';
var GL_TBPREFIX = 'WMETB';
var GL_WMECHCOLOR = 'WMECH_color';
var GL_NOTECOLOR = '#30E';
var GL_NOTEBGCOLOR = '#EEF';
var GL_WARNINGCOLOR = '#DA0';
var GL_WARNINGBGCOLOR = '#FFE';
var GL_ERRORCOLOR = '#E00';
var GL_ERRORBGCOLOR = '#FEE';
var GL_CUSTOM1COLOR = '#0A0';
var GL_CUSTOM1BGCOLOR = '#EFE';
var GL_CUSTOM2COLOR = '#09E';
var GL_CUSTOM2BGCOLOR = '#EFF';
var GL_VISITEDCOLOR = '#0E0';
var GL_VISITEDBGCOLOR = '#EFE';
var GL_NOID = 'No ID';
var GL_GRAYCOLOR = '#AAA';
var GL_TODOMARKER = 'TODO: ';
var RT_RUNWAY = 19;
var RR_RUNWAY = 1;
var RT_RAILROAD = 18;
var RR_RAILROAD = 2;
var RT_STAIRWAY = 16;
var RR_STAIRWAY = 3;
var RT_BOARDWALK = 10;
var RR_BOARDWALK = 4;
var RT_TRAIL = 5;
var RR_TRAIL = 5;
var RT_PRIVATE = 17;
var RR_PRIVATE = 6;
var RT_PARKING = 20;
var RR_PARKING = 7;
var RT_DIRT = 8;
var RR_DIRT = 8;
var RT_SERVICE = 21;
var RR_SERVICE = 9;
var RT_STREET = 1;
var RR_STREET = 10;
var RT_PRIMARY = 2;
var RR_PRIMARY = 11;
var RT_RAMP = 4;
var RR_RAMP = 12;
var RT_MINOR = 7;
var RR_MINOR = 13;
var RT_MAJOR = 6;
var RR_MAJOR = 14;
var RT_FREEWAY = 3;
var RR_FREEWAY = 15;
var DIR_UNKNOWN = 0;
var DIR_AB = 1;
var DIR_BA = 2;
var DIR_TWO = 3;
var ST_STOP = 1116352408;
var ST_RUN = 1899447441;
var ST_PAUSE = 3049323471;
var ST_CONTINUE = 3921009573;
var DIR_L2R = 961987163;
var DIR_R2L = -961987163;
var RF_HTML = 1508970993;
var RF_BB = 2453635748;
var RF_LIST = 2870763221;
var RF_UPDATEMAXSEVERITY = 1;
var RF_CREATEPACK = 2;
var RT_STOP = 1;
var RT_NEXTCHECK = 2;
var RS_NOTE = 1;
var RS_WARNING = 2;
var RS_ERROR = 3;
var RS_CUSTOM2 = 4;
var RS_CUSTOM1 = 5;
var RS_MAX = 6;
var LIMIT_PERCHECK = 300;
var LIMIT_TOLERANCE = 6;
var LIMIT_DEBUG = 20;
var CK_TBFIRST = 1;
var CK_TBLAST = 9;
var CK_WMECHFIRST = 13;
var CK_WMECHLAST = 22;
var CK_TYPEFIRST = 70;
var CK_TYPELAST = 72;
var CK_MATCHFIRST = 128;
var CK_MATCHLAST = 139;
var CK_CUSTOMFIRST = 130;
var CK_CUSTOMLAST = 139;
var CK_LOCKFIRST = 150;
var CK_LOCKLAST = 154;
var CK_STREETTNFIRST = 160;
var CK_STREETTNLAST = 167;
var CK_STREETNAMEFIRST = 170;
var CK_STREETNAMELAST = 175;
var CK_CITYNAMEFIRST = 190;
var CK_CITYNAMELAST = 193;
var CK_MIRRORFIRST = 200;
var CK_MIRRORLAST = 201;
var CL_UI = 2821834349 - 1;
var ID_PREFIX = 2554220882;
var CL_TABS = 2821834349;
var CL_PANEL = 2952996808;
var CL_BUTTONS = 3210313671;
var CL_MSG = 3336571891;
var CL_MSGY = 3584528711;
var CL_TRANSLATETIP = 3584528711 + 1;
var AS_LICENSE = 'license';
var AS_VERSION = 'version';
var AS_NONEDITABLES = 'non_editables';
var AS_DUPLICATES = 'duplicates';
var AS_VENUES = 'venues';
var AS_STREETS = 'streets';
var AS_OTHERS = 'others';
var AS_NOTES = 'notes';
var AS_YOUREDITS = 'your_edits';
var AS_UPDATEDSINCE = 'updated_since';
var AS_CITYNAME = 'city_name';
var AS_CHECKS = 'checks';
var AS_UPDATEDBY = 'updated_by';
var AS_SOUNDS = 'sounds';
var AS_HLISSUES = 'hl_issues';
var AS_SLOWCHECKS = 'slow_checks';
var AS_CUSTOM1TEMPLATE = 'custom1_template';
var AS_CUSTOM1REGEXP = 'custom1_regexp';
var AS_CUSTOM2TEMPLATE = 'custom2_template';
var AS_CUSTOM2REGEXP = 'custom2_regexp';
var AS_REPORTEXT = 'report_ext';
var ID_PROPERTY = 3835390401;
var ID_PROPERTY_DISABLED = 3835390401 + 1;
var CL_COLLAPSE = 4022224774;
var CL_NOTE = 264347078;
var CL_WARNING = 604807628;
var CL_ERROR = 770255983;
var CL_CUSTOM1 = 770255983 + 1;
var CL_CUSTOM2 = 770255983 + 2;
var CL_RIGHTTIP = 1249150122;
var CL_RIGHTTIPPOPUP = 1249150122 + 1;
var CL_RIGHTTIPDESCR = 1249150122 + 2;
var AS_NAME = 'WME_Validator';
var SZ_PANEL_HEIGHT = 190;
var SCAN_ZOOM = 5;
var SCAN_STEP = 100;
var HL_WIDTH = 30;
var HL_OPACITY = 0.4;
var I_SEVERITY = 0;
var I_OBJECTCOPY = 1;
var I_ISTBCOLOR = 2;
var I_ISWMECHCOLOR = 3;
var I_ISPARTIAL = 4;
var I_CITYID = 5;
var I_VENUECOPY = 6;
var CO_MIN = 0;
var CO_REGEXP = 0;
var CO_STRING = 1;
var CO_NUMBER = 2;
var CO_BOOL = 3;
var CO_MAX = 3;
var WD_SHORT = 5;
var WD_LONG = 1E4;
var Wa = null;
var nW = null;
var WM = null;
var WLM = null;
var WSM = null;
var WMo = null;
var WC = null;
var UW = null;
var R = null;
function esc(msg) {
  return msg.split('"').join('\\"').split('\n').join('\\n')
}
function escRE(e) {
  return e.split('\\')
	  .join('\\\\')
	  .split('^')
	  .join('\\^')
	  .split('$')
	  .join('\\$')
	  .split('+')
	  .join('\\+')
	  .split('?')
	  .join('\\?')
	  .split(':')
	  .join('\\:')
	  .split('!')
	  .join('\\!')
	  .split('.')
	  .join('\\.')
	  .split('-')
	  .join('\\-')
	  .split('*')
	  .join('.*')
	  .split('(')
	  .join('\\(')
	  .split(')')
	  .join('\\)')
	  .split('[')
	  .join('\\[')
	  .split(']')
	  .join('\\]')
	  .split('{')
	  .join('\\{')
	  .split('}')
	  .join('\\}')
}
function getMsg(mType, msg, newLine) {
  return 'WME Validator v' + WV_VERSION + (mType ? ' ' + mType : '') + (msg ? ':' + (newLine ? '\n' : ' ') + msg : '')
}
function log(msg) {
  window.console.log(getMsg('', msg))
}
function error(msg) {
  var s = getMsg('error', msg, true);
  log(s);
  if (!isErrorFlag()) {
	setErrorFlag();
	alert(s)
  }
  async(F_PAUSE);
  return -1
}
function warning(msg) {
  var s = getMsg('warning', msg, true);
  log(s);
  alert(s);
  return -1
}
function info(msg) {
  var s = getMsg('', msg, true);
  alert(s);
  return -1
}
function sync(func, param) {
  return func(param)
}
function async(func, param, inter) {
  var i = 0;
  if (inter) i = inter;
  window.setTimeout(func, i, param)
}
function clearWD() {
  window.clearTimeout(_RT.$WDmoveID);
  window.clearTimeout(_RT.$WDloadID);
  _RT.$WDmoveID = -1;
  _RT.$WDloadID = -1
}
function updateTimer(nstate) {
  var csec = Date.now() / 1E3;
  if (RTStateIs(ST_RUN)) _RT.$timer.$secInRun += csec - _RT.$timer.$lastUpdate;
  if (RTStateIs(ST_STOP)) _RT.$timer.$secInRun = 0;
  _RT.$timer.$lastUpdate = csec
}
function setRTState(nstate) {
  if (RTStateIs(ST_STOP) && ST_PAUSE === nstate) nstate = ST_STOP;
  updateTimer(nstate);
  _RT.$state = nstate;
  async(F_UPDATEUI)
}
function clearReport() {
  _RT.$seen = {};
  _RT.$seenVenues = {};
  _RT.$revalidate = {};
  _RT.$revalidateVenues = {};
  _REP = {
	$debugCounter: LIMIT_DEBUG,
	$isLimitPerCheck: false,
	$isEditableFound: false,
	$counterTotal: 0,
	$maxSeverity: 0,
	$incompleteIDs: {},
	$users: {},
	$reportCounters: {},
	$cityCounters: {},
	$countries: {},
	$cities: {},
	$streets: {},
	$cityIDs: {},
	$unsortedCityIDs: [],
	$sortedCityIDs: []
  };
  _RT.$reportEditableNotFound = false
}
function beep(dur, oscType) {
  try {
	if (_UI.pSettings.pScanner.oSounds.CHECKED) _AUDIO.beep(dur, oscType)
  } catch (e) {
  }
}
function setErrorFlag() {
  _RT.$error = true
}
function isErrorFlag() {
  return _RT.$error
}
function clearErrorFlag() {
  _RT.$error = false
}
function RTStateIs(st) {
  return getRTState() === st
}
function getRTState() {
  return _RT.$state
}
function HLAllSegments() {
  if (RTStateIs(ST_STOP) || RTStateIs(ST_PAUSE))
	if (_UI.pSettings.pScanner.oHLReported.CHECKED)
	  sync(F_VALIDATE, false);
	else
	  sync(F_VALIDATE, true);
  async(F_UPDATEUI)
}
function ForceHLAllSegments() {
  _RT.$isMapChanged = true;
  HLAllSegments()
}
function resetDefaults() {
  _UI.pMain.pFilter.oExcludeNonEditables.CHECKED = true;
  _UI.pMain.pFilter.oExcludeDuplicates.CHECKED = true;
  _UI.pMain.pFilter.oExcludeVenues.CHECKED = false;
  _UI.pMain.pFilter.oExcludeStreets.CHECKED = false;
  _UI.pMain.pFilter.oExcludeOther.CHECKED = false;
  _UI.pMain.pFilter.oExcludeNotes.CHECKED = false;
  _UI.pMain.pSearch.oIncludeYourEdits.CHECKED = false;
  _UI.pMain.pSearch.oIncludeUpdatedBy.VALUE = '';
  _RT.$includeUpdatedByCache = {};
  _UI.pMain.pSearch.oIncludeUpdatedSince.VALUE = '';
  _RT.$includeUpdatedSinceTime = 0;
  _UI.pMain.pSearch.oIncludeCityName.VALUE = '';
  _RT.$includeCityNameCache = {};
  _UI.pMain.pSearch.oIncludeChecks.VALUE = '';
  _RT.$includeChecksCache = {};
  _UI.pSettings.pScanner.oSlowChecks.CHECKED = true;
  _UI.pSettings.pScanner.oReportExt.CHECKED = true;
  _UI.pSettings.pScanner.oHLReported.CHECKED = true;
  _UI.pSettings.pScanner.oSounds.CHECKED = false;
  _UI.pSettings.pCustom.oTemplate1.VALUE = '';
  _UI.pSettings.pCustom.oRegExp1.VALUE = '';
  _UI.pSettings.pCustom.oTemplate2.VALUE = '';
  _UI.pSettings.pCustom.oRegExp2.VALUE = ''
}
function cmpCheckIDs(a, b) {
  var checkA = _RT.$checks[a], checkB = _RT.$checks[b];
  if (checkA.SEVERITY !== checkB.SEVERITY) return checkB.SEVERITY - checkA.SEVERITY;
  var cmp = checkA.TITLE.localeCompare(checkB.TITLE);
  if (!cmp) return a - b;
  return cmp
}
function checkNoCity(str) {
  return str ? str : 'No City'
}
function checkNoStreet(str) {
  return str ? str : 'No Street'
}
function getFilteredSeverity(oldSeverity, checkID, checkToHL) {
  if (!_UI.pMain.pSearch.oIncludeChecks.VALUE) return oldSeverity;
  var check = _RT.$checks[checkID];
  if (checkToHL && check.REPORTONLY) return 0;
  var textSeverity = getTextSeverity(check.SEVERITY).toUpperCase();
  var cache = _RT.$includeChecksCache;
  var hash = checkID;
  if (hash in cache) {
	if (cache[hash]) return check.SEVERITY
  } else {
	var forChecks = _UI.pMain.pSearch.oIncludeChecks.VALUE;
	var ccode = _RT.$cachedTopCCode;
	var options = trO(check.OPTIONS, ccode);
	var curTitle = exSOS(check.TITLE, options, 'titleEN');
	try {
	  cache[hash] = false;
	  if (_WV.checkAccessFor(forChecks, function(e) {
			if (/^#?\d+$/.test(e)) {
			  if ('#' === e.charAt(0)) e = e.slice(1);
			  return +checkID === +e
			}
			if (e.toUpperCase() === textSeverity) return true;
			e = escRE(e);
			var r = new RegExp('^' + e + '$', 'i');
			return r.test(curTitle)
		  })) {
		cache[hash] = true;
		return check.SEVERITY
	  }
	} catch (e) {
	}
  }
  return 0
}
function getFilteredSeverityObj(oldSeverity, checkIDs, checkToHL) {
  if (!_UI.pMain.pSearch.oIncludeChecks.VALUE) return oldSeverity;
  var ret = 0;
  for (var cid in checkIDs) {
	if (!checkIDs.hasOwnProperty(cid)) continue;
	var check = _RT.$checks[cid];
	if (getFilteredSeverity(check.SEVERITY, cid, checkToHL))
	  if (ret < check.SEVERITY) {
		ret = check.SEVERITY;
		if (_RT.$curMaxSeverity === ret) return ret
	  }
  }
  return ret
}
function checkFilter(severity, objectCopy, seenObjects) {
  if (seenObjects) {
	if (objectCopy.$objectID in seenObjects && _UI.pMain.pFilter.oExcludeDuplicates.CHECKED) return false;
	seenObjects[objectCopy.$objectID] = null
  }
  if ((RR_STREET === objectCopy.$typeRank || RR_SERVICE === objectCopy.$typeRank) && _UI.pMain.pFilter.oExcludeStreets.CHECKED) return false;
  if (RR_SERVICE > objectCopy.$typeRank && _UI.pMain.pFilter.oExcludeOther.CHECKED) return false;
  if (!objectCopy.$isEditable && _UI.pMain.pFilter.oExcludeNonEditables.CHECKED) return false;
  if (RS_NOTE === severity && _UI.pMain.pFilter.oExcludeNotes.CHECKED) return false;
  if (objectCopy.$userID !== _RT.$topUser.$userID && !_UI.pMain.pSearch.oIncludeYourEdits.NODISPLAY && _UI.pMain.pSearch.oIncludeYourEdits.CHECKED) return false;
  if (!_UI.pMain.pSearch.oIncludeUpdatedBy.NODISPLAY && _UI.pMain.pSearch.oIncludeUpdatedBy.VALUE) {
	var cache = _RT.$includeUpdatedByCache;
	var hash = objectCopy.$userID;
	if (hash in cache) {
	  if (!cache[hash]) return false
	} else {
	  var forUser = _UI.pMain.pSearch.oIncludeUpdatedBy.VALUE;
	  var curUser = _REP.$users[objectCopy.$userID];
	  try {
		cache[hash] = false;
		if (curUser !== _RT.$topUser.$userName && !_RT.$topUser.$isCM) return false;
		if (_RT.$topUser.$isCM && -1 === _RT.$topUser.$countryIDs.indexOf(objectCopy.$countryID)) return false;
		if (!_WV.checkAccessFor(forUser, function(e) {
			  e = escRE(e);
			  e = e.replace(/(^|\b)(me|i)($|\b)/gi, _RT.$topUser.$userName);
			  var r = new RegExp('^' + e + '$', 'i');
			  return r.test(curUser)
			}))
		  return false;
		cache[hash] = true
	  } catch (e) {
	  }
	}
  }
  if (objectCopy.$updated && _UI.pMain.pSearch.oIncludeUpdatedSince.VALUE) try {
	  if (!_RT.$includeUpdatedSinceTime) _RT.$includeUpdatedSinceTime = (new Date(_UI.pMain.pSearch.oIncludeUpdatedSince.VALUE)).getTime();
	  if (objectCopy.$updated < _RT.$includeUpdatedSinceTime) return false
	} catch (e) {
	}
  if (_UI.pMain.pSearch.oIncludeCityName.VALUE) {
	if (!objectCopy.$cityID) return false;
	var cache = _RT.$includeCityNameCache;
	var hash = objectCopy.$cityID;
	if (hash in cache) {
	  if (!cache[hash]) return false
	} else {
	  var forCity = _UI.pMain.pSearch.oIncludeCityName.VALUE;
	  var curCity = _REP.$cities[objectCopy.$cityID];
	  try {
		cache[hash] = false;
		if (!_WV.checkAccessFor(forCity, function(e) {
			  e = escRE(e);
			  var r = new RegExp('^' + e + '$', 'i');
			  return r.test(curCity)
			}))
		  return false;
		cache[hash] = true
	  } catch (e) {
	  }
	}
  }
  return true
}
function trO(obj, ccode) {
  if (obj) return _I18n.getValueOC(obj, ccode)
}
function getCheckOptions(checkID, ccode) {
  return _I18n.getValueOC(_RT.$checks[checkID].OPTIONS, ccode)
}
function trLeft(dir) {
  if ('ltr' === dir)
	return 'left';
  else
	return 'right'
}
function trRight(dir) {
  if ('ltr' === dir)
	return 'right';
  else
	return 'left'
}
function trS(label) {
  return _I18n.getString(label)
}
function trSO(label, options) {
  return _I18n.expandSO(_I18n.getString(label), options)
}
function exSOS(str, options, subst) {
  if (options && _I18n.$defLng === _RT.$lng && options[subst])
	return _I18n.expandSO(options[subst], options);
  else
	return _I18n.expandSO(str, options)
}
function getTextSeverity(sev) {
  switch (sev) {
	case RS_WARNING:
	  return 'warning';
	case RS_ERROR:
	  return 'error';
	case RS_CUSTOM1:
	  return 'custom1';
	case RS_CUSTOM2:
	  return 'custom2'
  }
  return 'note'
}
function onUpdateUI(e) {
  async(F_UPDATEUI, e)
}
function onShowChecks(e) {
  sync(F_SHOWREPORT, RF_LIST)
}
function onCreatePack(e) {
  sync(F_SHOWREPORT, RF_CREATEPACK)
}
function onShowReport(e) {
  sync(F_SHOWREPORT, RF_HTML)
}
function onShareReport(e) {
  sync(F_SHOWREPORT, RF_BB)
}
function onWarning(e) {
  async(F_ONWARNING, e)
}
function onLogin() {
  async(F_ONLOGIN)
}
function onMergeEnd() {
  _RT.$isMapChanged = true;
  window.clearTimeout(_RT.$WDmoveID);
  window.clearTimeout(_RT.$WDloadID);
  async(F_ONMERGEEND)
}
function onMoveEnd() {
  if (RTStateIs(ST_RUN) || RTStateIs(ST_CONTINUE))
	async(F_ONMOVEEND);
  else
	ForceHLAllSegments()
}
function onLoadStart() {
  async(F_ONLOADSTART)
}
function onChangeLayer(e) {
  sync(F_ONCHANGELAYER, e)
}
function onSegmentsChanged(e) {
  _RT.$isMapChanged = true;
  sync(F_ONSEGMENTSCHANGED, e)
}
function onSegmentsRemoved(e) {
  _RT.$isMapChanged = true;
  if (1 === e.length)
	if (RTStateIs(ST_STOP) || RTStateIs(ST_PAUSE)) sync(F_ONSEGMENTSCHANGED, e)
}
function onSegmentsAdded(e) {
  _RT.$isMapChanged = true
}
function onNodesChanged(e) {
  _RT.$isMapChanged = true;
  sync(F_ONNODESCHANGED, e)
}
function onNodesRemoved(e) {
  _RT.$isMapChanged = true;
  if (1 === e.length)
	if (RTStateIs(ST_STOP) || RTStateIs(ST_PAUSE)) sync(F_ONNODESCHANGED, e)
}
function onVenuesAdded(e) {
  _RT.$isMapChanged = true
}
function onVenuesChanged(e) {
  _RT.$isMapChanged = true;
  sync(F_ONVENUESCHANGED, e)
}
function onVenuesRemoved(e) {
  _RT.$isMapChanged = true;
  if (1 === e.length)
	if (RTStateIs(ST_STOP) || RTStateIs(ST_PAUSE)) sync(F_ONVENUESCHANGED, e)
};
function F_SHOWREPORT(reportFormat) {
  var _now = new Date;
  var _nowISO = _now.toISOString().slice(0, 10);
  var _repU = _REP.$users;
  var _repC = _REP.$cities;
  var _repCC = _REP.$cityCounters;
  var _repRC = _REP.$reportCounters;
  var _repS = _REP.$streets;
  var isBeta = -1 !== window.location.href.indexOf('beta');
  var noFilters = true;
  var FR = '';
  var FRheader = '';
  var FRfooter = '';
  var newWin = null;
  var Bh1, Eh1;
  var Bh2, Eh2;
  var Bsmall, Esmall;
  var Bbig, Ebig;
  var Ba, Ca, Ea;
  var BaV;
  var Bcolor, Ccolor, Ecolor;
  var Bb, Eb;
  var Bp, Ep;
  var Br;
  var Bol, Eol;
  var Bul, Eul;
  var Bli, Eli;
  var Bcode, Ecode;
  var Mdash, Nbsp;
  var curFormat;
  function setFormat(fmt) {
	curFormat = fmt;
	switch (fmt) {
	  case RF_HTML:
		Bh1 = '\n<h1>', Eh1 = '</h1>\n<hr>\n';
		Bh2 = '\n\n<h2>', Eh2 = '</h2>\n';
		Bsmall = '<small>', Esmall = '</small>';
		Bbig = '<big>', Ebig = '</big>';
		Ba = '<a target="_blank" href="', Ca = '">', Ea = '</a>';
		BaV = '<a target="Validator" href="';
		Bcolor = '<span style="color:', Ccolor = '">', Ecolor = '</span>';
		Bb = '<b>', Eb = '</b>';
		Bp = '<p>', Ep = '</p>';
		Br = '<br>\n';
		Bul = '\n<ul>\n', Eul = '\n</ul>\n';
		Bcode = '\n<div style="text-align:left" dir="ltr" class="code" onclick="selectAll(this)">', Ecode = '</div>\n';
		Bol = '\n<ol>\n', Eol = '\n</ol>\n';
		Bli = '\n<li>', Eli = '</li>\n';
		Mdash = ' &mdash; ';
		Nbsp = '&nbsp;';
		break;
	  case RF_BB:
		Bh1 = '\n[size=200]', Eh1 = '[/size]\n';
		Bh2 = '\n[size=150]', Eh2 = '[/size]\n';
		Bsmall = '[size=85]', Esmall = '[/size]';
		Bbig = '[size=120]', Ebig = '[/size]';
		Ba = '[url=', Ca = ']', Ea = '[/url]';
		BaV = Ba;
		Bcolor = '[color=', Ccolor = ']', Ecolor = '[/color]';
		Bb = '[b]', Eb = '[/b]';
		Bp = '\n', Ep = '\n';
		Br = '\n';
		Bul = '\n[list]', Eul = '[/list]\n';
		Bcode = '\n[code]', Ecode = '\n[/code]';
		Bol = '\n[list=1]', Eol = '[/list]\n';
		Bli = '\n[*]', Eli = '[/*]\n';
		Mdash = ' - ';
		Nbsp = ' ';
		break
	}
	return ''
  }
  function getReportSource() {
	var m = 0;
	var n = '';
	for (var cid in _repCC)
	  if (_repCC.hasOwnProperty(cid) && m < _repCC[cid] && _repC[cid]) {
		m = _repCC[cid];
		n = _repC[cid]
	  }
	return n
  }
  function getTopPermalink() {
	var center, zoom;
	if (_RT.$startCenter) {
	  center = _RT.$startCenter;
	  zoom = _RT.$startZoom
	} else {
	  center = WM.getCenter();
	  zoom = WM.getZoom()
	}
	var c = center.clone().transform(WM.projection, WM.displayProjection);
	return window.location.origin + window.location.pathname + '?zoom=' + zoom + '&lat=' + Math.round(c.lat * 1E5) / 1E5 + '&lon=' + Math.round(c.lon * 1E5) / 1E5 + '&env=' + nW.app.getAppRegionCode()
  }
  function getHTMLHeader(strTitle) {
	var dir = _I18n.getDir();
	var dirLeft = trLeft(dir);
	var dirRight = trRight(dir);
	return '<html dir="' + dir + '"><head><style>' +
		'\na{background-color:white}' +
		'\na:visited{background-color:' + GL_VISITEDBGCOLOR + ' !important;color:' + GL_VISITEDCOLOR + ' !important}' +
		'\n.note a{background-color:' + GL_NOTEBGCOLOR + ';color:' + GL_NOTECOLOR + '}' +
		'\n.warning a{background-color:' + GL_WARNINGBGCOLOR + ';color:' + GL_WARNINGCOLOR + '}' +
		'\n.error a{background-color:' + GL_ERRORBGCOLOR + ';color:' + GL_ERRORCOLOR + '}' +
		'\n.custom1 a{background-color:' + GL_CUSTOM1BGCOLOR + ';color:' + GL_CUSTOM1COLOR + '}' +
		'\n.custom2 a{background-color:' + GL_CUSTOM2BGCOLOR + ';color:' + GL_CUSTOM2COLOR + '}' +
		'\ndiv.note{background-color:' + GL_NOTEBGCOLOR + ';padding:1em;margin-top:0.5em}' +
		'\ndiv.warning{background-color:' + GL_WARNINGBGCOLOR + ';padding:1em;margin-top:0.5em}' +
		'\ndiv.error{background-color:' + GL_ERRORBGCOLOR + ';padding:1em;margin-top:0.5em}' +
		'\nh2+ul>li{margin-bottom:1em}' +
		'\nul{margin-top:0}' +
		'\nh1,h2{margin-bottom:4px;font-family:Georgia,Times,"Times New Roman",serif}' +
		'\nbody{margin:2em;font-family:"Lucida Grande","Lucida Sans Unicode","DejaVu Sans",Lucida,Arial,Helvetica,sans-serif}' +
		'\ndiv#contents{display:inline-block;margin:1em 0;padding:1em;background-color:#f9f9f9;border:1px solid #aaa}' +
		'\ndiv#contents li{margin-bottom:0.1em}' +
		'\ndiv.code::before{content: "CODE: SELECT ALL";display:block;border-bottom:1px solid #ccc;font:bold 1em "Lucida Grande","Trebuchet MS",Verdana,Helvetica,Arial,sans-serif;color:#105289;margin-bottom:5px;}' +
		'\ndiv.code{margin-top:0.5em;display:block;width:650px;overflow:auto;padding:0.5em;border:1px solid #ccc;background-color:#f4fff4;white-space:pre;font:0.9em Monaco,"Andale Mono","Courier New",Courier,mono;line-height:1.3em;color:#2E8B57;cursor:pointer}' +
		'\n</style>' +
		'\n<script>' +
		'\nfunction selectAll(e){' +
		'if(window.getSelection){' +
		'var s = window.getSelection();' +
		'var r = document.createRange();' +
		'r.selectNodeContents(e);' +
		's.removeAllRanges();' +
		's.addRange(r);' +
		'}}' +
		'\n\x3c/script>' +
		'\n<title>' + strTitle + ' ' + _nowISO + '</title>' +
		'\n<meta http-equiv="Content-Type" content="text/html;charset=UTF-8"/>' +
		'\n</head><body>'
  }
  function getNaturalList(arr) {
	if (1 === arr.length) return arr[0];
	var ret = '';
	arr.forEach(function(e, i) {
	  if (arr.length - 1 === i)
		ret += ' ' + trS('report.and') + ' ';
	  else if (0 !== i)
		ret += ', ';
	  ret += e
	});
	return ret
  }
  function getHeader(strTitle) {
	var ret = Bh1 + strTitle + Eh1;
	if (RF_LIST !== reportFormat && RF_CREATEPACK !== reportFormat) {
	  ret += Bsmall + trS('report.generated.by') + ' ' + _RT.$curUserName + ' ' + trS('report.generated.on') + ' ' + _nowISO + Esmall + Br + Br + Bb + trS('report.source') + ' ' + Eb + Ba +
		  getTopPermalink() + Ca + checkNoCity(getReportSource()) + Ea + Br;
	  var filters = [];
	  if (_UI.pMain.pFilter.oExcludeDuplicates.CHECKED) filters.push(trS('report.filter.duplicate'));
	  if (_UI.pMain.pFilter.oExcludeVenues.CHECKED) filters.push(trS('report.filter.venue'));
	  if (_UI.pMain.pFilter.oExcludeStreets.CHECKED) filters.push(trS('report.filter.streets'));
	  if (_UI.pMain.pFilter.oExcludeOther.CHECKED) filters.push(trS('report.filter.other'));
	  if (_UI.pMain.pFilter.oExcludeNonEditables.CHECKED) filters.push(trS('report.filter.noneditable'));
	  if (_UI.pMain.pFilter.oExcludeNotes.CHECKED) filters.push(trS('report.filter.notes'));
	  if (filters.length) {
		noFilters = false;
		ret += Bb + trS('report.filter.title') + ' ' + Eb + getNaturalList(filters) + ' ' + trS('report.filter.excluded') + Br
	  }
	  filters = [];
	  if (!_UI.pMain.pSearch.oIncludeYourEdits.NODISPLAY && _UI.pMain.pSearch.oIncludeYourEdits.CHECKED) filters.push(trS('report.search.updated.by') + ' ' + _RT.$curUserName);
	  if (!_UI.pMain.pSearch.oIncludeUpdatedBy.NODISPLAY && _UI.pMain.pSearch.oIncludeUpdatedBy.VALUE) filters.push(trS('report.search.updated.by') + ' ' + _UI.pMain.pSearch.oIncludeUpdatedBy.VALUE);
	  if (_UI.pMain.pSearch.oIncludeUpdatedSince.VALUE) filters.push(trS('report.search.updated.since') + ' ' + _UI.pMain.pSearch.oIncludeUpdatedSince.VALUE);
	  if (_UI.pMain.pSearch.oIncludeCityName.VALUE) filters.push(trS('report.search.city') + ' ' + _UI.pMain.pSearch.oIncludeCityName.VALUE);
	  if (_UI.pMain.pSearch.oIncludeChecks.VALUE) filters.push(trS('report.search.reported') + ' ' + _UI.pMain.pSearch.oIncludeChecks.VALUE);
	  if (filters.length) {
		noFilters = false;
		ret += Bb + trS('report.search.title') + Eb + ' ' + trS('report.search.only') + ' ' + getNaturalList(filters) + ' ' + trS('report.search.included') + Br
	  }
	  if (isBeta) ret += Br + Bb + trS('report.beta.warning') + Eb + Br + trS('report.beta.text') + Br + Bb + trS('report.beta.share') + Eb + Br
	}
	return ret
  }
  function getSubHeader(strTitle) {
	return Bh2 + strTitle + Eh2
  }
  function getTextACL(acl) {
	if (acl)
	  return acl.split(',').join(', ');
	else
	  return '*'
  }
  function getCheckProperties(checkID, ccode, showSeverity, showCountry) {
	var check = _RT.$checks[checkID];
	var ret = '';
	if (showSeverity && check.SEVERITY && RS_MAX > check.SEVERITY)
	  ret += Bb + trS('report.list.severity') + ' ' + Eb + getTextSeverity(check.SEVERITY) + (check.REPORTONLY ? ' (' + trS('report.list.reportOnly') + ')' : '') + Br;
	if (1 < check.FORLEVEL) ret += Bb + trS('report.list.forEditors') + ' ' + Eb + check.FORLEVEL + ' ' + trS('report.list.andUp') + Br;
	if (showCountry) ret += Bb + trS('report.list.forCountries') + ' ' + Eb + getTextACL(check.FORCOUNTRY) + Br;
	if (check.FORCITY) ret += Bb + trS('report.list.forCities') + ' ' + Eb + getTextACL(check.FORCITY) + Br;
	var options;
	if (check.OPTIONS && (options = getCheckOptions(checkID, ccode))) {
	  var defParams = ccode === _I18n.$defLng;
	  var arrParams = [];
	  for (var optionName in options) {
		if (!/^[a-z]+$/i.test(optionName)) continue;
		var optionTitle = options[optionName + '.title'];
		if (defParams && !optionTitle) continue;
		arrParams.push({$name: optionName, $title: optionTitle, $value: options[optionName]})
	  }
	  if (arrParams.length) {
		ret += Bb;
		var country = _I18n.getCapitalizedCountry(ccode) || ccode;
		if (defParams)
		  ret += trS('report.list.params');
		else
		  ret += trSO('report.list.params.set', {'country': country});
		ret += Eb + Bcode + '"' + checkID + '.params": {\n';
		for (var i = 0; i < arrParams.length; i++) {
		  var param = arrParams[i];
		  if (defParams) ret += '  // ' + param.$title + '\n';
		  ret += '  "' + param.$name + '": ' + JSON.stringify(param.$value) + ',' +
			  '\n'
		}
		ret += '},' + Ecode
	  }
	}
	return ret
  }
  function addTextLabels(pack, label, defSet, oldPack) {
	var defData = (defSet[label] || '').replace(new RegExp('^W:'), PFX_WIKI).replace(new RegExp('^P:'), PFX_PEDIA).replace(new RegExp('^F:'), PFX_FORUM);
	var origData = oldPack[label] || '';
	if (origData) {
	  var oldData = origData.replace(new RegExp('^' + GL_TODOMARKER), '').replace(new RegExp('^W:'), PFX_WIKI).replace(new RegExp('^P:'), PFX_PEDIA).replace(new RegExp('^F:'), PFX_FORUM);
	  var oldDataEN = (oldPack[label + '.en'] || '').replace(new RegExp('^W:'), PFX_WIKI).replace(new RegExp('^P:'), PFX_PEDIA).replace(new RegExp('^F:'), PFX_FORUM);
	  if (oldDataEN)
		if (oldDataEN === defData) {
		  pack[label + '.en'] = defData;
		  pack[label] = origData
		} else {
		  pack[label + '.en'] = defData;
		  pack[label] = GL_TODOMARKER + oldData
		}
	  else {
		pack[label + '.en'] = defData;
		pack[label] = origData
	  }
	} else {
	  pack[label + '.en'] = defData;
	  pack[label] = GL_TODOMARKER + defData
	}
  }
  function getPackHeader(country, lng) {
	return '// ==UserScript==' + Br + '// @name                WME Validator Localization for ' + country + Br + '// @version             ' + WV_VERSION + Br +
		'// @description         This script localizes WME Validator for ' + country + '. You also need main package (WME Validator) installed.' + Br +
		'// @match               https://beta.waze.com/*editor*' + Br + '// @match               https://www.waze.com/*editor*' + Br + '// @exclude             https://www.waze.com/*user/*editor/*' +
		Br + '// @grant               none' + Br + '// @run-at              document-start' + Br + '// ==/UserScript==' + Br + '//' + Br + '/*' + Br +
		(lng ? '  Please translate all the lines marked with "' + GL_TODOMARKER + '"' + Br + '  Please DO NOT change ".en" properties. To override english text use "titleEN",' + Br +
				 '  "problemEN" and "solutionEN" properties (see an example below).' + Br + Br :
			   '') +
		'  See Settings->About->Available checks for complete list of checks and their params.' + Br + Br + '  Examples:' + Br + Br +
		'  Enable #170 "Lowercase street name" but allow lowercase "exit" and "to":' + Br + '    "170.enabled": true,' + Br + '    "170.params": {' + Br +
		'        "regexp": "/^((exit|to) )?[a-z]/",' + Br + '    "},' + Br + Br + '  Enable #130 "Custom check" to find a dot in street names, but allow dots at Ramps:' + Br +
		'    "130.enabled": true,' + Br + '    "130.params": {' + Br + '        "titleEN": "Street name with a dot",' + Br +
		'        "problemEN": "There is a dot in the street name (excluding Ramps)",' + Br + '        "solutionEN": "Expand the abbreviation or remove the dot",' + Br +
		'        "template": "${type}:${street}",' + Br + '        "regexp": "D/^[^4][0-9]?:.*\\\\./",' + Br + '    },' + Br +
		'    *Note: use D at the beginning of RegExp to enable debugging on JS console.' + Br + '    *Note: do not forget to escape backslashes in strings, i.e. use "\\\\" instead of "\\".' + Br +
		'*/' + Br
  }
  function getPack(country, ccode, lng) {
	var ucountry = country.toUpperCase();
	var _country = country.split(' ').join('_');
	var oldPack = _I18n.$translations[ccode] || {};
	var ret = '' + Br + 'window.WME_Validator_' + _country + ' = ';
	var newCountries = [];
	for (var k in _I18n.$country2code)
	  if (ccode === _I18n.$country2code[k] && ucountry !== k) newCountries.push(_I18n.capitalize(k));
	newCountries.unshift(country);
	var newAuthor = oldPack['.author'] || _RT.$topUser.$userName;
	if (-1 === newAuthor.indexOf(_RT.$topUser.$userName)) newAuthor += ' and ' + _RT.$topUser.$userName;
	var newLink = oldPack['.link'] || GL_TODOMARKER;
	var pack = {'.country': 1 === newCountries.length ? newCountries[0] : newCountries, '.codeISO': ccode, '.author': newAuthor, '.updated': _nowISO, '.link': newLink};
	if (ccode in _I18n.$code2code) pack['.fallbackCode'] = _I18n.$code2code[ccode];
	if (lng) {
	  if (ccode in _I18n.$code2dir) pack['.dir'] = _I18n.$code2dir[ccode];
	  var newLngs = [];
	  for (var k in _I18n.$lng2code)
		if (ccode === _I18n.$lng2code[k] && k !== lng) newLngs.push(k);
	  newLngs.unshift(lng);
	  pack['.lng'] = 1 === newLngs.length ? newLngs[0] : newLngs
	}
	if (lng)
	  for (var label in _I18n.$defSet) {
		if (/^\./.test(label) || /^[0-9]/.test(label)) continue;
		addTextLabels(pack, label, _I18n.$defSet, oldPack)
	  }
	var allLabels = _RT.$otherLabels.concat(_RT.$textLabels);
	var arrDepCodes = _I18n.getDependantCodes(ccode);
	for (var i = 1; i < MAX_CHECKS; i++) {
	  if (CK_MIRRORFIRST + 100 <= i && CK_MIRRORLAST + 100 >= i) continue;
	  var label = i + '.enabled';
	  var checkEnabled = false;
	  if (_I18n.$defSet[label] || oldPack[label]) checkEnabled = true;
	  if (!checkEnabled)
		for (var depC = 0; depC < arrDepCodes.length; depC++) {
		  var depCode = arrDepCodes[depC];
		  if (_I18n.$translations[depCode] && _I18n.$translations[depCode][label]) checkEnabled = true
		}
	  if (checkEnabled && !(i + '.title' in _I18n.$defSet)) {
		pack[i + '.note'] = GL_TODOMARKER + 'The check #' + i + ' is no longer exist. See the forum thread for more details.';
		continue
	  }
	  for (var j = 0; j < allLabels.length; j++) {
		var labelSfx = allLabels[j];
		label = i + '.' + labelSfx;
		var defData = _I18n.$defSet[label];
		var oldData = oldPack[label];
		if (classCodeDefined(defData) || classCodeDefined(oldData))
		  if (-1 !== _RT.$textLabels.indexOf(labelSfx)) {
			if (lng && checkEnabled) addTextLabels(pack, label, _I18n.$defSet, oldPack)
		  } else {
			if ('params' === labelSfx) {
			  if (!classCodeDefined(oldData)) continue;
			  defData = deepCopy(defData || {});
			  oldData = deepCopy(oldData);
			  for (var k = CO_MIN; k <= CO_MAX; k++) {
				delete defData[k];
				delete oldData[k]
			  }
			  for (var k in defData) {
				if (!defData.hasOwnProperty(k)) continue;
				if (/\.title$/.test(k)) delete defData[k]
			  }
			}
			if (!deepCompare(defData, oldData)) pack[label] = oldData
		  }
	  }
	}
	ret += JSON.stringify(pack, null, '  ') + ';\n';
	return ret
  }
  function getListOfChecks(countryID, country) {
	var ucountry = country.toUpperCase();
	var ccode = '';
	if (countryID) ccode = _I18n.getCountryCode(ucountry);
	var ret = trS('report.list.see') + ' ' + Bb + trS('report.list.checks') + Eb + Br + Br;
	var fallbacks = '';
	if (ccode)
	  for (var i in _I18n.$country2code) {
		if (!_I18n.$country2code.hasOwnProperty(i)) continue;
		if (i === ucountry) continue;
		var acode = _I18n.$country2code[i];
		if (ccode && acode !== ccode) continue;
		fallbacks += _I18n.capitalize(i) + ' → ' + country + Br
	  }
	for (var i in _I18n.$code2code) {
	  if (!_I18n.$code2code.hasOwnProperty(i)) continue;
	  var countryFrom = _I18n.getCapitalizedCountry(i);
	  var countryTo = _I18n.getCapitalizedCountry(_I18n.$code2code[i]);
	  if (ccode && i !== ccode && _I18n.$code2code[i] !== ccode) continue;
	  if (country && countryFrom !== country && countryTo !== country) continue;
	  fallbacks += countryFrom + ' (' + i + ') → ' + countryTo + ' (' + _I18n.$code2code[i] + ')' + Br
	}
	if (fallbacks) ret += Bb + trS('report.list.fallback') + Eb + Br + fallbacks;
	var sortedIDs = getSortedCheckIDs();
	if (ccode) {
	  var enabledIDs = [];
	  var disabledIDs = [];
	  sortedIDs.forEach(function(cid) {
		var c = _RT.$checks[cid];
		if (!c) return;
		if (RS_MAX === c.SEVERITY) return;
		var en = true;
		var forCountry = c.FORCOUNTRY;
		if (forCountry)
		  if (!_WV.checkAccessFor(forCountry, function(e) {
				if (e in _I18n.$code2country) return _I18n.$code2country[e] === ucountry;
				error('Please report: fc=' + e);
				return false
			  }))
			en = false;
		if (en)
		  enabledIDs.push(cid);
		else
		  disabledIDs.push(cid)
	  });
	  ret += Bh2 + trSO('report.list.enabled', {'n': enabledIDs.length}) + ' ' + country + ':' + Eh2 + Bul;
	  enabledIDs.forEach(function(cid) {
		ret += Bli + getCheckDescription(cid, countryID, Bb, Eb + Br) + Bsmall;
		ret += getCheckProperties(cid, ccode, false, false);
		ret += Esmall + Eli
	  });
	  ret += Eul;
	  ret += Bh2 + trSO('report.list.disabled', {'n': disabledIDs.length}) + ' ' + country + ':' + Eh2 + Bul;
	  disabledIDs.forEach(function(cid) {
		ret += Bli + getCheckDescription(cid, 0, Bb, Eb + Br) + Bsmall;
		ret += getCheckProperties(cid, _I18n.$defLng, false, true);
		ret += Esmall + Eli
	  });
	  ret += Eul
	} else {
	  ret += Bh2 + trSO('report.list.total', {'n': sortedIDs.length}) + ':' + Eh2 + Bul;
	  sortedIDs.forEach(function(cid) {
		var c = _RT.$checks[cid];
		if (!c) return;
		if (RS_MAX === c.SEVERITY) return;
		ret += Bli + getCheckDescription(cid, 0, Bb, Eb + Br) + Bsmall;
		ret += getCheckProperties(cid, _I18n.$defLng, false, true);
		ret += Esmall + Eli
	  });
	  ret += Eul
	}
	return ret
  }
  function getHTMLFooter() {
	return '\n<hr>' +
		'\n<center dir="ltr"><small>WME Validator v' + WV_VERSION + '<br>&copy; 2013-2018 Andriy Berestovskyy</small></center>' +
		'\n</body></html>'
  }
  function getTAHeader(h) {
	var ret = '\n<p>' + (RF_CREATEPACK === reportFormat ? trS('msg.textarea.pack') : trS('msg.textarea')) + ':</p>' +
		'\n<p><textarea style="resize:vertical;width:100%;height:' + h + '">';
	setFormat(RF_BB);
	return ret
  }
  function getTAFooter() {
	setFormat(RF_HTML);
	return '\n</textarea></p>'
  }
  function getSizeWarning(size) {
	return 5E4 < size ? '\n<p style="color:#e00">' + trSO('report.size.warning', {'n': size}) + '</p>' : ''
  }
  function openWindow(data) {
	var nw = UW.open('', '_blank');
	nw.document.write(data)
  }
  function openWindowFR(title) {
	var encFR = 'data:text/html;charset=UTF-8,';
	if (newWin)
	  if (reportFormat === RF_HTML) {
		title = title.split(' ').join('_');
		newWin.document.write(FRheader);
		var saveRep = FRheader;
		saveRep += FR;
		saveRep += FRfooter;
		saveRep = encodeURIComponent(saveRep);
		var saveLink = '<br><a download="';
		saveLink += title;
		saveLink += '_';
		saveLink += _nowISO;
		saveLink += '.html" href="data:text/html;charset=UTF-8,';
		saveLink += saveRep;
		saveRep = '';
		saveLink += '"><button>';
		saveLink += trS('report.save');
		saveLink += '</button></a><br>';
		newWin.document.write(saveLink);
		newWin.document.write(FR);
		newWin.document.write(saveLink);
		newWin.document.write(FRfooter)
	  } else
		newWin.document.write(FR);
	else {
	  encFR += encodeURIComponent(FRheader);
	  FRheader = '';
	  encFR += encodeURIComponent(FR);
	  FR = '';
	  encFR += encodeURIComponent(FRfooter);
	  FRfooter = '';
	  UW.open(encFR, '_blank')
	}
  }
  var seenObjects = {};
  var lastCheckID = -1;
  var lastCityID = -1;
  var lastStreetID = -1;
  var counterNotes = 0;
  var counterWarnings = 0;
  var counterErrors = 0;
  var counterCustoms1 = 0;
  var counterCustoms2 = 0;
  function resetFilter() {
	seenObjects = {};
	lastCheckID = -1;
	lastCityID = -1;
	lastStreetID = -1;
	counterNotes = 0;
	counterWarnings = 0;
	counterErrors = 0;
	counterCustoms1 = 0;
	counterCustoms2 = 0
  }
  function getTOC() {
	resetFilter();
	FR += '\n<br><div id="contents">';
	FR += '\n<big><b>';
	FR += trS('report.contents');
	FR += '</b></big>';
	FR += '\n<ol>';
	traverseReport(function(obj) {
	  if (checkFilter(0, obj.$objectCopy, seenObjects) && getFilteredSeverity(obj.$check.SEVERITY, obj.$checkID, false))
		if (obj.$checkID !== lastCheckID) {
		  lastCheckID = obj.$checkID;
		  var check = obj.$check;
		  var strCountry = _REP.$countries[obj.$objectCopy.$countryID];
		  var ccode = '';
		  if (strCountry)
			ccode = _I18n.getCountryCode(strCountry.toUpperCase());
		  else
			ccode = _RT.$cachedTopCCode;
		  var options = trO(check.OPTIONS, ccode);
		  FR += '\n<li class="';
		  FR += getTextSeverity(obj.$check.SEVERITY);
		  FR += '"><a href="#a';
		  FR += lastCheckID;
		  FR += '">';
		  FR += exSOS(check.TITLE, options, 'titleEN');
		  FR += '</a></li>'
		}
	});
	FR += '\n<li><a href="#a">';
	FR += trS('report.summary');
	FR += '</a></li>';
	FR += '\n</ol>\n</div>'
  }
  function getSortedCheckIDs() {
	return _RT.$sortedCheckIDs ? _RT.$sortedCheckIDs : _RT.$sortedCheckIDs = Object.keys(_RT.$checks).sort(cmpCheckIDs)
  }
  function traverseReport(handler) {
	var mapCenter = WM.getCenter();
	function getSortedCities() {
	  var ret = _REP.$sortedCityIDs;
	  if (!ret || ret.length != _REP.$unsortedCityIDs.length)
		return _REP.$sortedCityIDs = [].concat(_REP.$unsortedCityIDs).sort(function(a, b) {
		  return _repC[a].localeCompare(_repC[b])
		});
	  return ret
	}
	function getSortedStreets(repC) {
	  var ret = repC.$sortedStreetIDs;
	  if (!ret || ret.length != repC.$unsortedStreetIDs.length)
		return repC.$sortedStreetIDs = [].concat(repC.$unsortedStreetIDs).sort(function(a, b) {
		  return _repS[a].localeCompare(_repS[b])
		});
	  return ret
	}
	function getHypot(c1, c2) {
	  return Math.sqrt(c1 * c1 + c2 * c2)
	}
	function getSortedObjects(repS) {
	  var ret = repS.$sortedObjectIDs;
	  var repSeg = repS.$objectIDs;
	  if (!ret || ret.length != repS.$unsortedObjectIDs.length)
		return repS.$sortedSegmentIDs = [].concat(repS.$unsortedObjectIDs).sort(function(a, b) {
		  var segA = repSeg[a], segB = repSeg[b];
		  if (segA.$typeRank !== segB.$typeRank) return segB.$typeRank - segA.$typeRank;
		  var distAB = getHypot(segA.$center.lat - segB.$center.lat, segA.$center.lon - segB.$center.lon);
		  if (0.002 > distAB) return 0;
		  var distA = getHypot(mapCenter.lat - segA.$center.lat, mapCenter.lon - segA.$center.lon);
		  var distB = getHypot(mapCenter.lat - segB.$center.lat, mapCenter.lon - segB.$center.lon);
		  return distA - distB
		});
	  return ret
	}
	var checkIDs = getSortedCheckIDs();
	nextCheck: for (var i = 1; i < checkIDs.length; i++) {
	  var checkID = checkIDs[i];
	  var check = _RT.$checks[checkID];
	  if (!check) continue;
	  if (_UI.pMain.pFilter.oExcludeNotes.CHECKED && RS_NOTE === check.SEVERITY) continue;
	  var sortedCities = getSortedCities();
	  for (var sorcid = 0; sorcid < sortedCities.length; sorcid++) {
		var cid = sortedCities[sorcid];
		var repC = _REP.$cityIDs[cid];
		var sortedStreets = getSortedStreets(repC);
		for (var sorsid = 0; sorsid < sortedStreets.length; sorsid++) {
		  var sid = sortedStreets[sorsid];
		  var repS = repC.$streetIDs[sid];
		  if (repS.$unsortedObjectIDs) {
			var sortedObjects = getSortedObjects(repS);
			for (var sorscid = 0; sorscid < sortedObjects.length; sorscid++) {
			  var scid = sortedObjects[sorscid];
			  var sc = repS.$objectIDs[scid];
			  if (checkID in sc.$reportIDs) {
				var obj = {$checkID: checkID, $check: check, $param: sc.$reportIDs[checkID], $cityParam: repC.$params[checkID], $streetParam: repS.$params[checkID], $objectCopy: sc};
				switch (handler(obj)) {
				  case RT_STOP:
					return;
				  case RT_NEXTCHECK:
					continue nextCheck
				}
			  }
			}
		  }
		}
	  }
	}
  }
  function closeReportStreet() {
	if (0 <= lastStreetID || 0 <= lastCityID) {
	  lastStreetID = -1;
	  FR += Eli
	}
  }
  function closeReportCity() {
	if (0 <= lastCityID) {
	  lastCityID = -1;
	  closeReportStreet();
	  FR += Eul
	}
  }
  function closeReportCheck() {
	if (0 <= lastCheckID) {
	  if (LIMIT_PERCHECK < _repRC[lastCheckID])
		if (1 === _repRC[lastCheckID] - LIMIT_PERCHECK)
		  FR += '[and more...]';
		else {
		  FR += '[and ';
		  FR += _repRC[lastCheckID] - LIMIT_PERCHECK;
		  FR += ' objects more...]'
		}
	  lastCheckID = -1;
	  closeReportCity()
	}
	if (RF_HTML === curFormat) FR += '</div>'
  }
  function getCheckDescription(checkID, countryID, headB, headE) {
	var check = _RT.$checks[checkID];
	var ret = headB;
	var strCountry = _REP.$countries[countryID];
	var ccode = '';
	if (strCountry)
	  ccode = _I18n.getCountryCode(strCountry.toUpperCase());
	else
	  ccode = _RT.$cachedTopCCode;
	var options = trO(check.OPTIONS, ccode);
	if (check.COLOR) ret += Bcolor + check.COLOR + Ccolor + '██ ' + Ecolor;
	ret += '' + (countryID ? exSOS(check.TITLE, options, 'titleEN') : check.TITLE) + ' (#' + checkID + ')' + headE;
	var sevColor = GL_NOTECOLOR;
	switch (check.SEVERITY) {
	  case RS_WARNING:
		sevColor = GL_WARNINGCOLOR;
		break;
	  case RS_ERROR:
		sevColor = GL_ERRORCOLOR;
		break;
	  case RS_CUSTOM1:
		sevColor = GL_CUSTOM1COLOR;
		break;
	  case RS_CUSTOM2:
		sevColor = GL_CUSTOM2COLOR;
		break
	}
	if (check.PROBLEM) {
	  ret += Bcolor + sevColor + Ccolor + (countryID ? exSOS(check.PROBLEM, options, 'problemEN') : check.PROBLEM);
	  var pl = trO(check.PROBLEMLINK, ccode);
	  if (pl)
		ret += ': ' + Ba + pl + Ca + trO(check.PROBLEMLINKTEXT, ccode) + Ea;
	  else
		ret += '.';
	  ret += Ecolor + Br
	}
	if (check.SOLUTION) {
	  ret += countryID ? exSOS(check.SOLUTION, options, 'solutionEN') : check.SOLUTION;
	  var sl = trO(check.SOLUTIONLINK, ccode);
	  if (sl)
		ret += ': ' + Ba + sl + Ca + trO(check.SOLUTIONLINKTEXT, ccode) + Ea;
	  else
		ret += '.';
	  ret += Br
	}
	return ret
  }
  function getReportCheck(obj) {
	closeReportCheck();
	if (RF_HTML === curFormat) {
	  FR += '<div class="';
	  FR += getTextSeverity(obj.$check.SEVERITY);
	  FR += '"><a name="a';
	  FR += obj.$checkID;
	  FR += '"></a>'
	}
	FR += getCheckDescription(obj.$checkID, obj.$objectCopy.$countryID, Bh2, Eh2);
	FR += Br
  }
  function getReportCity(obj) {
	closeReportCity();
	FR += Bbig;
	FR += Bb;
	FR += checkNoCity(_repC[obj.$objectCopy.$cityID]);
	FR += Eb;
	FR += Ebig;
	if (obj.$cityParam) {
	  FR += Mdash;
	  FR += obj.$cityParam
	}
	FR += Bul
  }
  function getReportStreet(obj) {
	closeReportStreet();
	FR += Bli;
	FR += checkNoStreet(_repS[obj.$objectCopy.$streetID]);
	FR += ', ';
	FR += checkNoCity(_repC[obj.$objectCopy.$cityID]);
	if (obj.$streetParam) {
	  FR += Mdash;
	  FR += obj.$streetParam
	}
	FR += Br
  }
  function getPermalink(obj) {
	var z = SCAN_ZOOM;
	if (obj.$objectCopy)
	  if (50 > obj.$objectCopy.$length)
		z = 7;
	  else if (500 > obj.$objectCopy.$length) {
		if (6 > z) z += 1
	  } else
		z = 4;
	else
	  z = 4;
	FR += window.location.origin;
	FR += window.location.pathname;
	FR += '?zoom=';
	FR += z;
	FR += '&lat=';
	FR += obj.$objectCopy.$center.lat;
	FR += '&lon=';
	FR += obj.$objectCopy.$center.lon;
	FR += '&env=';
	FR += nW.app.getAppRegionCode();
	FR += '&' + obj.$objectCopy.$model.name + '=';
	FR += obj.$objectCopy.$objectID
  }
  function getReportItem(obj) {
	if (!checkFilter(0, obj.$objectCopy, seenObjects) || !getFilteredSeverity(obj.$check.SEVERITY, obj.$checkID, false)) return;
	if (_REP.$maxSeverity < obj.$check.SEVERITY) _REP.$maxSeverity = obj.$check.SEVERITY;
	if (obj.$checkID !== lastCheckID) {
	  getReportCheck(obj);
	  if (noFilters) {
		var c = _repRC[obj.$checkID];
		switch (obj.$check.SEVERITY) {
		  case RS_NOTE:
			counterNotes += c;
			break;
		  case RS_WARNING:
			counterWarnings += c;
			break;
		  case RS_ERROR:
			counterErrors += c;
			break;
		  case RS_CUSTOM1:
			counterCustoms1 += c;
			break;
		  case RS_CUSTOM2:
			counterCustoms2 += c;
			break
		}
	  }
	}
	if (obj.$objectCopy.$cityID !== lastCityID) getReportCity(obj);
	if (obj.$objectCopy.$streetID !== lastStreetID) getReportStreet(obj);
	lastCityID = obj.$objectCopy.$cityID;
	lastStreetID = obj.$objectCopy.$streetID;
	lastCheckID = obj.$checkID;
	if (!noFilters) switch (obj.$check.SEVERITY) {
		case RS_NOTE:
		  counterNotes++;
		  break;
		case RS_WARNING:
		  counterWarnings++;
		  break;
		case RS_ERROR:
		  counterErrors++;
		  break;
		case RS_CUSTOM1:
		  counterCustoms1++;
		  break;
		case RS_CUSTOM2:
		  counterCustoms2++;
		  break
	  }
	FR += BaV;
	getPermalink(obj);
	FR += Ca;
	if (isBeta) FR += 'B:';
	if (obj.$objectCopy.$model === WMo.segments)
	  FR += obj.$objectCopy.$objectID;
	else if (obj.$objectCopy.$name !== '')
	  FR += obj.$objectCopy.$name;
	else
	  FR += obj.$objectCopy.$objectID;
	FR += Ea;
	FR += ' '
  }
  function getSummary() {
	if (RF_HTML === curFormat) FR += '<a name="a"></a>';
	FR += Bh2;
	FR += trS('report.summary');
	FR += Eh2;
	FR += Bb;
	FR += trS('report.segments');
	FR += Eb;
	FR += ' ';
	FR += _REP.$counterTotal;
	FR += Br;
	if (counterCustoms1 || counterCustoms2) {
	  FR += Bb;
	  FR += trS('report.customs');
	  FR += Eb;
	  FR += ' ';
	  FR += counterCustoms1;
	  FR += '/';
	  FR += counterCustoms2;
	  if (_REP.$isLimitPerCheck) FR += '*';
	  FR += Br
	}
	FR += Bb;
	FR += trS('report.reported');
	FR += Eb;
	FR += ' ';
	var summary = [];
	if (counterErrors)
	  summary.push(Bb + trS('report.errors') + Mdash + Eb + ' ' + counterErrors + (_REP.$isLimitPerCheck ? '*' : '') + ' (' + Math.round(counterErrors * 1E3 / _REP.$counterTotal) + '‰)');
	if (counterWarnings)
	  summary.push(Bb + trS('report.warnings') + Mdash + Eb + ' ' + counterWarnings + (_REP.$isLimitPerCheck ? '*' : '') + ' (' + Math.round(counterWarnings * 1E3 / _REP.$counterTotal) + '‰)');
	if (counterNotes) summary.push(Bb + trS('report.notes') + Mdash + Eb + ' ' + counterNotes + (_REP.$isLimitPerCheck ? '*' : ''));
	FR += getNaturalList(summary);
	FR += Br;
	if (_REP.$isLimitPerCheck) {
	  FR += trS('report.note.limit');
	  FR += Br
	}
	FR += Br;
	FR += trS('report.forum');
	FR += ' ';
	FR += Ba;
	FR += PFX_FORUM;
	FR += FORUM_HOME;
	FR += Ca;
	FR += trS('report.forum.link');
	FR += Ea;
	FR += Br;
	FR += Br;
	FR += trS('report.thanks');
	FR += Br
  }
  function getReport(fmt) {
	var oldFormat = curFormat;
	setFormat(fmt);
	resetFilter();
	_REP.$maxSeverity = 0;
	traverseReport(function(e) {
	  getReportItem(e)
	});
	closeReportCheck();
	getSummary();
	setFormat(oldFormat)
  }
  function updateMaxSeverity() {
	resetFilter();
	_REP.$maxSeverity = 0;
	traverseReport(function(obj) {
	  if (checkFilter(0, obj.$objectCopy, seenObjects) && getFilteredSeverity(obj.$check.SEVERITY, obj.$checkID, false)) {
		if (_REP.$maxSeverity < obj.$check.SEVERITY) _REP.$maxSeverity = obj.$check.SEVERITY;
		if (_RT.$curMaxSeverity === _REP.$maxSeverity) return RT_STOP
	  }
	})
  }
  setFormat(RF_HTML);
  var t = trS('report.title');
  switch (reportFormat) {
	case RF_UPDATEMAXSEVERITY:
	  updateMaxSeverity();
	  break;
	case RF_CREATEPACK:
	  var wType = 'Localization Package Wizard';
	  if (!window.confirm(getMsg(
			  wType,
			  '\nBefore starting the Wizard:' +
				  '\n\n1. Position WME over your country' +
				  '\n   so the Wizard will know your country name' +
				  '\n\n2. Switch WME to your language' +
				  '\n   so the Wizard will add translations into the package' +
				  '\n\n3. Enable any previous version of localization pack' +
				  '\n   so the Wizard will preserve already translated text',
			  true)))
		break;
	  var country = _RT.$topCity && _RT.$topCity.$country ? _RT.$topCity.$country : window.prompt(getMsg(wType, '\nWME country name (example: United Kingdom):', true));
	  if (!country) break;
	  var ucountry = country.toUpperCase();
	  var ccode = _I18n.getCountryCode(ucountry) ? _I18n.getCountryCode(ucountry) : window.prompt(getMsg(wType, '\nISO 3166-1 Alpha-2 country code (example: UK):', true));
	  if (!ccode) break;
	  ccode = ccode.toUpperCase();
	  var lng = window.prompt(
		  getMsg(
			  wType,
			  '\nPlease confirm the WME language code:' +
				  '\n\nfor "EN" no translations will be included into the package' +
				  '\nfor any other code the translations will be included',
			  true),
		  _RT.$lng);
	  if (!lng) break;
	  lng = lng.toUpperCase();
	  if (_I18n.$defLng === lng)
		t = 'Minimal Localization for ' + country;
	  else
		t = 'Localization and Translation for ' + country;
	  if (_I18n.$defLng === lng) lng = '';
	  var lPack = getHTMLHeader(t) + getHeader(t) + getTAHeader('400px') + getPackHeader(country, lng) + getPack(country, ccode, lng);
	  var arrDepCodes = _I18n.getDependantCodes(ccode);
	  for (var i = 0; i < arrDepCodes.length; i++) {
		var depCode = arrDepCodes[i];
		var depCountry = _I18n.getCapitalizedCountry(depCode);
		if (depCountry && depCode) {
		  lPack += '\n// Dependant package:';
		  lPack += getPack(depCountry, depCode, '')
		}
	  }
	  openWindow(lPack + getTAFooter() + getHTMLFooter());
	  break;
	case RF_LIST:
	  var countryID = 0;
	  var country = '';
	  t = trS('report.list.title') + ' ';
	  if (_RT.$topCity && _RT.$topCity.$country) {
		countryID = _RT.$topCity.$countryID;
		country = _RT.$topCity.$country;
		t += country + ' (v' + WV_VERSION + ')'
	  } else
		t += 'v' + WV_VERSION;
	  openWindow(getHTMLHeader(t) + getHeader(t) + getListOfChecks(countryID, country) + getTAHeader('200px') + getHeader(t) + getListOfChecks(countryID, country) + getTAFooter() + getHTMLFooter());
	  break;
	case RF_HTML:
	  newWin = UW.open('', '_blank');
	  FR += getHTMLHeader(t);
	  FR += getHeader(t);
	  FRheader = FR;
	  FR = '';
	  getTOC();
	  getReport(RF_HTML);
	  if (0 === counterNotes + counterWarnings + counterErrors + counterCustoms1 + counterCustoms2) {
		if (newWin) newWin.close();
		async(F_UPDATEUI);
		break
	  }
	  FRfooter += getHTMLFooter();
	  openWindowFR(t);
	  break;
	case RF_BB:
	  newWin = UW.open('', '_blank');
	  var tf = t + ' ' + trS('report.share');
	  FR += getHTMLHeader(tf);
	  FR += getHeader(tf);
	  FR += getTAHeader('200px');
	  var beforeShareLen = FR.length;
	  FR += getHeader(t);
	  getReport(RF_BB);
	  var shareLen = FR.length - beforeShareLen;
	  if (0 === counterNotes + counterWarnings + counterErrors + counterCustoms1 + counterCustoms2) {
		if (newWin) newWin.close();
		async(F_UPDATEUI);
		break
	  }
	  FR += getTAFooter();
	  FR += getSizeWarning(shareLen);
	  FR += getHTMLFooter();
	  openWindowFR();
	  break
  }
  resetFilter()
};
function F_VALIDATE(disabledHL) {
  if (!_RT.$isMapChanged) return;
  _RT.$isMapChanged = false;
  var bUpdateMaxSeverity = false;
  if (RTStateIs(ST_RUN)) beep(10);
  var options;
  var skippedObject = false;
  if (disabledHL) {
	updateObjectProperties([], true);
	return
  }
  if (LIMIT_TOTAL < _REP.$counterTotal && !isErrorFlag()) {
	setErrorFlag();
	if (RTStateIs(ST_RUN)) {
	  window.alert(getMsg(trS('msg.autopaused'), '\n' + trS('msg.limit.segments') + trS('msg.limit.segments.continue'), true));
	  sync(F_PAUSE)
	} else
	  warning(trS('msg.limit.segments') + trS('msg.limit.segments.clear'));
	return
  }
  _RT.$topCenter = WM.getCenter();
  if (_UI.pSettings.pScanner.oReportExt.CHECKED && _RT.oReportWMECH.CHECKED) {
	var el = document.getElementById(_RT.oReportWMECH.FORID);
	if (el) {
	  var ev = new CustomEvent('click');
	  el.dispatchEvent(ev)
	}
  }
  var _repC = _REP.$cities;
  var _repCC = _REP.$cityCounters;
  var _repRC = _REP.$reportCounters;
  var _repS = _REP.$streets;
  var _repU = _REP.$users;
  function isLimitOk(id) {
	if (DEF_DEBUG)
	  return true;
	else
	  return !(LIMIT_PERCHECK < _repRC[id])
  }
  function formatDate(d) {
	var n = new Date(d);
	return n.toISOString().substr(0, 10)
  }
  function getUserName(objID) {
	var u = WMo.users.getObjectById(objID);
	return u ? u.userName : objID.toString()
  }
  function getUserLevel(objID) {
	var u = WMo.users.getObjectById(objID);
	return u ? u.normalizedLevel : 0
  }
  function SimpleNODE(objID, segID) {
	this.$rawNode = null;
	this.$nodeID = objID;
	this._center = null;
	this.$center = null;
	this.$isUturn = false;
	this.$isEditable = true;
	this.$isPartial = true;
	this._rawRestrictions = [];
	this._rawRestrictionIDs = [];
	this._restrictions = null;
	this.$restrictions = null;
	this._rawOtherSegments = [];
	this._otherSegments = null;
	this.$otherSegments = null;
	this._rawOutConnections = [];
	this._outConnections = null;
	this.$outConnections = null;
	this._rawInConnections = [];
	this._inConnections = null;
	this.$inConnections = null;
	this.$restrictionsLen = 0;
	this.$otherSegmentsLen = 0;
	this.$outConnectionsLen = 0;
	this.$inConnectionsLen = 0;
	var n = WMo.nodes.getObjectById(objID);
	this.$rawNode = n;
	if (n) {
	  this.$isPartial = n.attributes.partial;
	  this.$isEditable = n.areConnectionsEditable();
	  var co = n.attributes.restrictions;
	  for (var k in co) {
		if (!co[k]) continue;
		var _con = k.split(',');
		var con0 = +_con[0];
		if (+segID === con0) {
		  var con1 = +_con[1];
		  var cok = co[k];
		  for (var j = 0, l = cok.length; j < l; j++) {
			this._rawRestrictions.push(cok[j]);
			this._rawRestrictionIDs.push(con1)
		  }
		}
	  }
	  this.$restrictionsLen = this._rawRestrictions.length;
	  for (var i = 0; i < n.attributes.segIDs.length; i++) {
		var si = n.attributes.segIDs[i];
		if (+segID === +si || !WMo.segments.getObjectById(si)) continue;
		this._rawOtherSegments.push(si)
	  }
	  this.$otherSegmentsLen = this._rawOtherSegments.length;
	  co = n.attributes.connections;
	  for (var k in co) {
		if (!co[k]) continue;
		var _con = k.split(',');
		var con0 = +_con[0];
		var con1 = +_con[1];
		if (+segID === con0 && +segID === con1) {
		  this.$isUturn = true;
		  continue
		}
		if (+segID === con0) this._rawOutConnections.push(con1);
		if (+segID === con1) this._rawInConnections.push(con0)
	  }
	}
	this.$outConnectionsLen = this._rawOutConnections.length;
	this.$inConnectionsLen = this._rawInConnections.length;
	Object.defineProperties(this, {
	  $rawNode: {enumerable: false},
	  $nodeID: {writable: false},
	  _center: {enumerable: false},
	  $center: {get: this.getCenter},
	  $isUturn: {writable: false},
	  $isEditable: {writable: false},
	  $isPartial: {writable: false},
	  _rawRestrictions: {enumerable: false},
	  _rawRestrictionIDs: {enumerable: false},
	  _restrictions: {enumerable: false},
	  $restrictions: {get: this.getRestrictions},
	  _rawOtherSegments: {enumerable: false},
	  _otherSegments: {enumerable: false},
	  $otherSegments: {get: this.getOtherSegments},
	  _rawOutConnections: {enumerable: false},
	  _outConnections: {enumerable: false},
	  $outConnections: {get: this.getOutConnections},
	  _rawInConnections: {enumerable: false},
	  _inConnections: {enumerable: false},
	  $inConnections: {get: this.getInConnections},
	  $restrictionsLen: {writable: false},
	  $otherSegmentsLen: {writable: false},
	  $outConnectionsLen: {writable: false},
	  $inConnectionsLen: {writable: false}
	})
  }
  SimpleNODE.prototype.getCenter = function() {
	if (this._center) return this._center;
	if (!this.$rawNode) return null;
	var bounds = this.$rawNode.geometry.bounds;
	this._center = (new OpenLayers.LonLat(bounds.left, bounds.bottom)).transform(WM.projection, WM.displayProjection);
	this._center.lon = Math.round(this._center.lon * 1E5) / 1E5;
	this._center.lat = Math.round(this._center.lat * 1E5) / 1E5;
	return this._center
  };
  SimpleNODE.prototype.getRestrictions = function() {
	var t;
	return this._restrictions ? this._restrictions : (t = this, this._restrictions = this._rawRestrictions.map(function(e, i) {
	  return new SimpleRESTRICTION(e, t._rawRestrictionIDs[i])
	}))
  };
  SimpleNODE.prototype.getOutConnections = function() {
	return this._outConnections ? this._outConnections : this._outConnections = this._rawOutConnections.map(function(e) {
	  return new SimpleOBJECT(e, WMo.segments)
	})
  };
  SimpleNODE.prototype.getInConnections = function() {
	return this._inConnections ? this._inConnections : this._inConnections = this._rawInConnections.map(function(e) {
	  return new SimpleOBJECT(e, WMo.segments)
	})
  };
  SimpleNODE.prototype.getOtherSegments = function() {
	return this._otherSegments ? this._otherSegments : this._otherSegments = this._rawOtherSegments.map(function(e) {
	  return new SimpleOBJECT(e, WMo.segments)
	})
  };
  function SimpleRESTRICTION(obj, segID) {
	var timeFrame = obj.getTimeFrame();
	this._to = null;
	this.$to = null;
	this.$toID = segID;
	this.$allDay = timeFrame.isAllDay() || false;
	this.$days = timeFrame.getWeekdays();
	this.$description = obj.getDescription() || '';
	this.$isInThePast = false;
	if (timeFrame.getEndDate() === null)
	  this.$isInThePast = false;
	else if (timeFrame.getEndDate() > new Date)
	  this.$isInThePast = false;
	else
	  this.$isInThePast = true;
	this.$isEnabled = true;
	this.$fromDate = timeFrame.getStartDate() || '';
	this.$fromTime = timeFrame.getFromTime() || '';
	this.$toDate = timeFrame.getEndDate() || '';
	this.$toTime = timeFrame.getToTime() || '';
	Object.defineProperties(this, {
	  _to: {enumerable: false},
	  $to: {get: this.getTo},
	  $toID: {writable: false},
	  $allDay: {writable: false},
	  $days: {writable: false},
	  $description: {writable: false},
	  $isInThePast: {writable: false},
	  $isEnabled: {writable: false},
	  $fromDate: {writable: false},
	  $fromTime: {writable: false},
	  $toDate: {writable: false},
	  $toTime: {writable: false}
	})
  }
  SimpleRESTRICTION.prototype.getTo = function() {
	return this._to ? this._to : this._to = new SimpleOBJECT('' + this.$toID, WMo.segments)
  };
  function SimpleOBJECT(objID, model) {
	this.$model = model;
	var raw = this.$model.getObjectById(objID);
	this.$rawObject = raw;
	this._nodeA = null;
	this.$nodeA = null;
	this.$nodeAID = 0;
	this._nodeB = null;
	this.$nodeB = null;
	this.$nodeBID = 0;
	this._center = null;
	this.$center = null;
	this._restrictions = null;
	this.$restrictions = null;
	this.$name = '';
	this.$brand = '';
	this.$objectID = objID;
	this.$address = null;
	this.$isPoint = false;
	this.$isTurnALocked = false;
	this.$isTurnBLocked = false;
	this.$isRoundabout = false;
	this.$hasHNs = false;
	this.$isEditable = false;
	this.$forceNonEditable = false;
	this.$mainCategory = '';
	this.$categories = [];
	this.$openingHours = [];
	this.$phone = '';
	this.$url = '';
	this.$services = [];
	this.$externalProviders = [];
	this.$type = 0;
	this.$typeRank = 0;
	this.$direction = 0;
	this.$isToll = false;
	this.$elevation = 0;
	this.$lock = 0;
	this.$rank = 0;
	this.$length = 0;
	this.$updatedOn = '';
	this.$updatedBy = '';
	this.$updatedByID = 0;
	this.$updatedByLevel = 0;
	this.$createdOn = '';
	this.$createdBy = '';
	this.$createdByID = 0;
	this.$createdByLevel = 0;
	this.$alts = [];
	this.restrictionsLen = 0;
	this.$fwdMaxSpeed = 0;
	this.$fwdMaxSpeedUnverified = true;
	this.$revMaxSpeed = 0;
	this.$revMaxSpeedUnverified = false;
	if (classCodeIs(raw, CC_UNDEFINED) || classCodeIs(raw, CC_NULL)) return;
	var attrs = raw.attributes;
	if (this.$model === WMo.segments) {
	  this.$nodeAID = attrs.fromNodeID;
	  this.$nodeBID = attrs.toNodeID;
	  this.$isRoutable = this.$rawObject.isRoutable();
	  this.$isTurnALocked = attrs.revTurnsLocked;
	  this.$isTurnBLocked = attrs.fwdTurnsLocked;
	  this.$isRoundabout = classCodeDefined(attrs.junctionID) && null !== attrs.junctionID;
	  this.$hasHNs = attrs.hasHNs;
	  this.$hasRestrictions = raw.hasRestrictions();
	  this.$restrictions = attrs.restrictions;
	  this.$type = attrs.roadType;
	  this.$typeRank = this.getTypeRank(attrs.roadType);
	  this.$direction = getDirection(raw);
	  this.$elevation = attrs.level;
	  if ('length' in attrs)
		this.$length = attrs.length;
	  else
		this.$length = Math.round(raw.geometry.getGeodesicLength(WM.projection));
	  this.$restrictionsLen = attrs.restrictions.length;
	  this.$fwdMaxSpeed = getLocalizedValue(+attrs.fwdMaxSpeed);
	  this.$fwdMaxSpeedUnverified = attrs.fwdMaxSpeedUnverified;
	  this.$revMaxSpeed = getLocalizedValue(+attrs.revMaxSpeed);
	  this.$revMaxSpeedUnverified = attrs.revMaxSpeedUnverified;
	  this.$alts = attrs.streetIDs.map(function(objID) {
		return new _WV.SimpleADDRESS(objID)
	  });
	  this.$address = new _WV.SimpleADDRESS(attrs.primaryStreetID)
	} else {
	  this.$name = attrs.name;
	  this.$brand = attrs.brand;
	  if (this.$brand === null) this.$brand = '';
	  this.$isApproved = attrs.approved;
	  this.$mainCategory = raw.getMainCategory();
	  this.$categories = attrs.categories;
	  this.$categoryAttributes = attrs.categoryAttributes;
	  this.$openingHours = attrs.openingHours;
	  this.$services = attrs.services;
	  this.$externalProviders = attrs.externalProviderIDs;
	  this.$entryExitPoints = attrs.entryExitPoints;
	  this.$alts = attrs.aliases;
	  this.$address = new _WV.SimpleADDRESS(attrs.streetID);
	  this.$geometry = attrs.geometry;
	  this.$phone = attrs.phone;
	  this.$url = attrs.url;
	  this.$isPoint = raw.isPoint()
	}
	this.$isEditable = raw.arePropertiesEditable();
	this.$lock = attrs.lockRank + 1;
	this.$rank = attrs.rank + 1;
	if (attrs.updatedOn) this.$updatedOn = formatDate(attrs.updatedOn);
	if (0 < attrs.updatedBy) {
	  this.$updatedByID = attrs.updatedBy;
	  this.$updatedBy = getUserName(attrs.updatedBy);
	  this.$updatedByLevel = getUserLevel(attrs.updatedBy)
	}
	if (attrs.createdOn) this.$createdOn = formatDate(attrs.createdOn);
	if (attrs.createdBy) {
	  this.$createdByID = attrs.createdBy;
	  this.$createdBy = getUserName(attrs.createdBy);
	  this.$createdByLevel = getUserLevel(attrs.createdBy)
	}
	Object.defineProperties(this, {
	  $rawSegment: {enumerable: false},
	  _nodeA: {enumerable: false},
	  $nodeA: {get: this.getNodeA},
	  $nodeAID: {writable: false},
	  _nodeB: {enumerable: false},
	  $nodeB: {get: this.getNodeB},
	  $nodeBID: {writable: false},
	  _center: {enumerable: false},
	  $center: {get: this.getCenter},
	  _restrictions: {enumerable: false},
	  $restrictions: {get: this.getRestrictions},
	  $segmentID: {writable: false},
	  $isRoutable: {writable: false},
	  $isPoint: {writable: false},
	  $isTurnALocked: {writable: false},
	  $isTurnBLocked: {writable: false},
	  $isRoundabout: {writable: false},
	  $hasHNs: {writable: false},
	  $typeRank: {writable: false},
	  $isEditable: {writable: false},
	  $rank: {writable: false},
	  $length: {writable: false},
	  $mainCategory: {writable: false},
	  $updatedOn: {writable: false},
	  $updatedBy: {writable: false},
	  $updatedByID: {writable: false},
	  $updatedByLevel: {writable: false},
	  $createdOn: {writable: false},
	  $createdBy: {writable: false},
	  $createdByID: {writable: false},
	  $createdByLevel: {writable: false},
	  $restrictionsLen: {writable: false}
	})
  }
  SimpleOBJECT.prototype.getTypeRank = function(typeID) {
	return {19: 1, 18: 2, 16: 3, 10: 4, 5: 5, 17: 6, 20: 7, 8: 8, 21: 9, 1: 10, 2: 11, 4: 12, 7: 13, 6: 14, 3: 15}[typeID]
  };
  SimpleOBJECT.prototype.getNodeA = function() {
	return this._nodeA ? this._nodeA : this._nodeA = new SimpleNODE(this.$nodeAID, this.$objectID)
  };
  SimpleOBJECT.prototype.getNodeB = function() {
	return this._nodeB ? this._nodeB : this._nodeB = new SimpleNODE(this.$nodeBID, this.$objectID)
  };
  SimpleOBJECT.prototype.getCenter = function() {
	if (this._center) return this._center;
	this._center = this.$rawObject.geometry.bounds.getCenterLonLat().clone().transform(WM.projection, WM.displayProjection);
	this._center.lon = Math.round(this._center.lon * 1E5) / 1E5;
	this._center.lat = Math.round(this._center.lat * 1E5) / 1E5;
	return this._center
  };
  SimpleOBJECT.prototype.getRestrictions = function() {
	var t;
	return this._restrictions ? this._restrictions : this._restrictions = this.$model == WMo.venues ? [] : (t = this, this.$rawObject.attributes.restrictions.map(function(e) {
													   return new SimpleRESTRICTION(e, t.$objectID)
													 }))
  };
  SimpleOBJECT.prototype.report = function(params) {
	if (classCodeIs(params, CC_NUMBER)) params = {$checkID: params};
	var id = params.$checkID;
	if (!id || !isLimitOk(id)) return;
	function getObjectCopy(ss) {
	  return {
		$objectID: ss.$objectID, $model: ss.$model, $name: ss.$name, $countryID: +ss.$address.$countryID, $cityID: +ss.$address.$cityID, $streetID: +ss.$address.$streetID, $reportIDs: {},
			$updated: ss.$updatedOn ? ss.$rawObject.attributes.updatedOn : ss.$createdOn ? ss.$rawObject.attributes.createdOn : 0,
			$userID: ss.$updatedByID ? +ss.$updatedByID : ss.$createdByID ? +ss.$createdByID : 0,
			$isEditable: ss.$isEditable && (ss.$nodeA.$isEditable || ss.$nodeA.$isPartial) && (ss.$nodeB.$isEditable || ss.$nodeB.$isPartial), $typeRank: +ss.$typeRank, $center: ss.$center,
			$length: +ss.$length
	  }
	}
	var rep = _REP.$cityIDs[this.$address.$cityID];
	var check = _RT.$checks[id];
	if (_repRC[id])
	  _repRC[id]++;
	else
	  _repRC[id] = 1;
	if (LIMIT_PERCHECK < _repRC[id]) {
	  _REP.$isLimitPerCheck = true;
	  return
	}
	if (params.$cityParam) rep.$params[id] = params.$cityParam;
	var sid = this.$address.$streetID;
	if (!(sid in rep.$streetIDs)) {
	  rep.$unsortedStreetIDs.push(sid);
	  _repS[sid] = this.$address.$street;
	  rep.$streetIDs[sid] = {};
	  rep.$streetIDs[sid].$params = {};
	  rep.$streetIDs[sid].$objectIDs = {};
	  rep.$streetIDs[sid].$unsortedObjectIDs = [];
	  rep.$streetIDs[sid].$sortedObjectIDs = []
	}
	rep = rep.$streetIDs[sid];
	if (params.$streetParam) rep.$params[id] = params.$streetParam;
	if (!(this.$objectID in rep.$objectIDs)) {
	  rep.$unsortedObjectIDs.push(this.$objectID);
	  rep.$objectIDs[this.$objectID] = getObjectCopy(this)
	}
	var objectCopy = rep.$objectIDs[this.$objectID];
	var uid = objectCopy.$userID;
	if (!(uid in _repU)) {
	  var n = '';
	  if (uid === this.$createdByID)
		n = this.$createdBy;
	  else if (uid === this.$updatedByID)
		n = this.$updatedBy;
	  _repU[uid] = n
	}
	var seenObj = _RT.$seen[this.$objectID];
	if (this.$forceNonEditable) {
	  this.$forceNonEditable = false;
	  objectCopy.$isEditable = false;
	  if (_REP.$maxSeverity <= seenObj[I_SEVERITY] || _REP.$maxSeverity <= check.SEVERITY) bUpdateMaxSeverity = true
	}
	objectCopy.$reportIDs[id] = params.$param;
	if (_REP.$maxSeverity < check.SEVERITY)
	  if (checkFilter(check.SEVERITY, objectCopy, null) && getFilteredSeverity(check.SEVERITY, id, true)) _REP.$maxSeverity = check.SEVERITY;
	if (!check.REPORTONLY && seenObj[I_SEVERITY] < check.SEVERITY) seenObj[I_SEVERITY] = check.SEVERITY;
	seenObj[I_OBJECTCOPY] = objectCopy
  };
  SimpleOBJECT.prototype.incCityCounter = function() {
	var rep = _REP.$cityIDs;
	var cid = this.$address.$cityID;
	if (!(cid in rep)) {
	  _REP.$countries[this.$address.$countryID] = this.$address.$country;
	  _REP.$unsortedCityIDs.push(cid);
	  _repC[cid] = this.$address.$city;
	  _repCC[cid] = 0;
	  rep[cid] = {};
	  rep[cid].$params = {};
	  rep[cid].$streetIDs = {};
	  rep[cid].$unsortedStreetIDs = [];
	  rep[cid].$sortedStreetIDs = []
	}
	_repCC[cid]++;
	_REP.$counterTotal++
  };
  function deleteCityCheck(cityID, checkID) {
	var repS = _REP.$cityIDs[cityID].$streetIDs;
	for (var sid in repS) {
	  if (!repS.hasOwnProperty(sid)) continue;
	  var repSG = repS[sid].$objectIDs;
	  for (var sgid in repSG) {
		if (!repSG.hasOwnProperty(sgid)) continue;
		var reportIDs = repSG[sgid].$reportIDs;
		if (!(checkID in reportIDs)) continue;
		var seen = _RT.$seen[sgid];
		var maxSev = 0;
		var filSev = 0;
		delete reportIDs[checkID];
		for (var repID in reportIDs) {
		  if (!reportIDs.hasOwnProperty(repID)) continue;
		  var check = _RT.$checks[repID];
		  if (!check) continue;
		  if (filSev < check.SEVERITY && getFilteredSeverity(check.SEVERITY, repID, true)) filSev = check.SEVERITY;
		  if (maxSev < check.SEVERITY) {
			maxSev = check.SEVERITY;
			if (_RT.$curMaxSeverity === maxSev) break
		  }
		}
		seen[I_SEVERITY] = maxSev;
		reHLObjectID(+sgid, filSev)
	  }
	}
  }
  function getCityCmpObj(cityID, city, otherCity) {
	var obj = {
	  $cityID: cityID,
	  $counterReported: 0,
	  $limit: 0,
	  $city: city,
	  $otherCity: otherCity,
	  $CITY: city.toUpperCase(),
	  $noCountyCity: '',
	  $noAbbreviationCity: '',
	  $sortedCity: '',
	  $noSpaceCity: '',
	  $reason: ''
	};
	obj.$noCountyCity = obj.$CITY.replace(/ *\([^\)]+\) */g, '').replace(/ *\,.*/g, '');
	obj.$noAbbreviationCity = obj.$noCountyCity.replace(/ *[^\. ]+ *\. */g, '');
	obj.$noDigitsCity = obj.$noCountyCity.replace(/ *\d+ */g, ' ');
	obj.$sortedCity = obj.$noAbbreviationCity.split(' ').sort().join(' ');
	obj.$noSpaceCity = obj.$noAbbreviationCity.split(' ').join('');
	return obj
  }
  function setCmpObjLimits(obj1, obj2) {
	var curCase = '';
	if (obj1.$city === obj2.$city) {
	  curCase = trS('city.12') + ' ' + obj1.$cityID + ' & ' + obj2.$cityID;
	  obj1.$reason = obj2.$reason = curCase;
	  obj1.$limit = obj2.$limit = 100;
	  return
	}
	if (obj1.$noSpaceCity !== obj1.$noAbbreviationCity && obj1.$noSpaceCity === obj2.$noAbbreviationCity) {
	  obj1.$reason = trS('city.13r');
	  obj2.$reason = trS('city.13a');
	  obj1.$limit = 10;
	  obj2.$limit = 1E3;
	  return
	}
	if ((new RegExp('(^| )' + obj1.$sortedCity)).test(obj2.$sortedCity)) {
	  if (obj1.$noCountyCity.length !== obj1.$noAbbreviationCity.length) {
		curCase = trS('city.2');
		obj1.$reason = obj2.$reason = curCase;
		obj1.$limit = 1E3;
		obj2.$limit = 10;
		return
	  }
	  if (3 > obj1.$city.length) {
		curCase = trS('city.3');
		obj1.$reason = obj2.$reason = curCase;
		obj1.$limit = 1E3;
		obj2.$limit = 0;
		return
	  }
	  if (obj1.$CITY === obj2.$CITY) {
		curCase = trS('city.5');
		obj1.$reason = obj2.$reason = curCase;
		if (obj1.$city.charAt(0) !== obj1.$CITY.charAt(0)) {
		  obj1.$limit = 1E3;
		  obj2.$limit = 10
		} else {
		  obj1.$limit = 10;
		  obj2.$limit = 1E3
		}
		return
	  }
	  if (obj1.$sortedCity === obj2.$sortedCity) {
		if (obj1.$noSpaceCity !== obj1.$noAbbreviationCity) {
		  curCase = trS('city.6');
		  obj1.$reason = obj2.$reason = curCase;
		  obj1.$limit = obj2.$limit = 1E3;
		  return
		}
		if (obj1.$city.length === obj1.$noCountyCity.length) {
		  if (obj2.$city.length === obj2.$noCountyCity.length) {
			curCase = trS('city.7');
			obj1.$reason = obj2.$reason = curCase;
			obj1.$limit = obj2.$limit = 1E3
		  } else {
			obj1.$reason = trS('city.8a');
			obj2.$reason = trS('city.8r');
			obj1.$limit = 1E3;
			obj2.$limit = 10
		  }
		  return
		}
		if (obj2.$city.length === obj2.$noCountyCity.length) {
		  obj1.$reason = trS('city.8r');
		  obj2.$reason = trS('city.8a');
		  obj1.$limit = 10;
		  obj2.$limit = 1E3
		} else {
		  curCase = trS('city.9');
		  obj1.$reason = obj2.$reason = curCase;
		  obj1.$limit = obj2.$limit = 1E3
		}
		return
	  }
	  if ((new RegExp(obj1.$sortedCity + '( |$)')).test(obj2.$sortedCity)) {
		if (4 < obj2.$sortedCity.length - obj1.$sortedCity.length) {
		  obj1.$reason = trS('city.10a');
		  obj2.$reason = trS('city.10r');
		  obj1.$limit = obj2.$limit = 10;
		  return
		}
		if (obj1.$noDigitsCity === obj2.$noDigitsCity) {
		  curCase = trS('city.14');
		  obj1.$reason = obj2.$reason = curCase;
		  obj1.$limit = obj2.$limit = 1;
		  return
		}
		curCase = trS('city.11');
		obj1.$reason = obj2.$reason = curCase;
		obj1.$limit = 1E3;
		obj2.$limit = 10;
		return
	  }
	  curCase = trS('city.4');
	  obj1.$reason = obj2.$reason = curCase;
	  obj1.$limit = 1E3;
	  obj2.$limit = 10;
	  return
	}
  }
  function addHLedObjects() {
	if (RTStateIs(ST_RUN) || RTStateIs(ST_CONTINUE)) return;
	var features = [];
	for (var i in _RT.$HLedObjects) {
	  if (!_RT.$HLedObjects.hasOwnProperty(i)) continue;
	  var obj = _RT.$HLedObjects[i];
	  if (obj.$severity) features.push(new OpenLayers.Feature.Vector(obj.$geometry.clone(), {'0': obj.$severity}))
	}
	_RT.$HLlayer.destroyFeatures();
	_RT.$HLlayer.addFeatures(features)
  }
  function HLObject(rawObject) {
	if (RTStateIs(ST_RUN) || RTStateIs(ST_CONTINUE)) return;
	var objectID = rawObject.getID();
	var seenObj = _RT.$seen[objectID];
	var severity = seenObj[I_SEVERITY];
	var objectCopy = seenObj[I_OBJECTCOPY];
	if (!severity || !objectCopy || !checkFilter(severity, objectCopy, null)) return;
	var filteredSeverity = getFilteredSeverityObj(severity, objectCopy.$reportIDs, true);
	if (!filteredSeverity) return;
	var obj = {$severity: filteredSeverity, $geometry: rawObject.geometry};
	_RT.$HLedObjects[objectID] = obj
  }
  function reHLObjectID(objectID, newSeverity) {
	if (RTStateIs(ST_RUN) || RTStateIs(ST_CONTINUE)) return;
	if (_REP.$maxSeverity !== newSeverity) bUpdateMaxSeverity = true;
	if (oExcludeNotes && RS_NOTE === newSeverity) newSeverity = 0;
	if (objectID in _RT.$HLedObjects) {
	  var hlObj = _RT.$HLedObjects[objectID];
	  hlObj.$severity = newSeverity
	}
  }
  function deleteSeenObject(objectID) {
	reHLObjectID(objectID, 0);
	var seen = null;
	if (objectID in _RT.$seen) seen = _RT.$seen[objectID];
	if (!seen) return;
	if (_REP.$maxSeverity <= seen[I_SEVERITY]) bUpdateMaxSeverity = true;
	var objectCopy = seen[I_OBJECTCOPY];
	var cityID = seen[I_CITYID];
	delete _RT.$seen[objectID];
	if (0 < _REP.$counterTotal) _REP.$counterTotal--;
	if (0 < _repCC[cityID]) _repCC[cityID]--;
	if (!objectCopy) return;
	var repC = _REP.$cityIDs;
	for (var cid in repC) {
	  if (!repC.hasOwnProperty(cid)) continue;
	  var repS = repC[cid].$streetIDs;
	  for (var sid in repS) {
		if (!repS.hasOwnProperty(sid)) continue;
		var repSG = repS[sid].$objectIDs;
		for (var sgid in repSG) {
		  if (!repSG.hasOwnProperty(sgid) || sgid !== objectID) continue;
		  var reportIDs = repSG[sgid].$reportIDs;
		  for (var repID in reportIDs) {
			if (!reportIDs.hasOwnProperty(repID)) continue;
			if (0 < _repRC[repID]) _repRC[repID]--
		  }
		  delete repSG[sgid];
		  var repUSG = repS[sid].$unsortedObjectIDs;
		  repUSG.splice(repUSG.indexOf(sgid), 1);
		  repS[sid].$sortedObjectIDs = [];
		  return
		}
	  }
	}
  }
  function updateObjectProperties(selectedObjects, disabledHL) {
	if (RTStateIs(ST_RUN) || RTStateIs(ST_CONTINUE)) return;
	var prop = document.getElementById('i' + ID_PROPERTY);
	var propDis = document.getElementById('i' + ID_PROPERTY_DISABLED);
	var defID = ID_PROPERTY;
	var defHTML = '';
	if (disabledHL) {
	  defID = ID_PROPERTY_DISABLED;
	  defHTML = '<div class="direction-message">' +
		  '<i class="fa fa-info-circle" aria-hidden="true"></i> ' + trS('props.disabled') + '</div> ';
	  if (prop) prop.parentNode.removeChild(prop);
	  prop = propDis
	} else if (propDis)
	  propDis.parentNode.removeChild(propDis);
	if (prop)
	  prop.innerHTML = defHTML;
	else {
	  var objectProperties = document.getElementsByClassName('selection-icon')[0];
	  if (!objectProperties) objectProperties = document.getElementsByClassName('landmark')[0];
	  if (objectProperties) {
		var d = document.createElement('div');
		d.innerHTML = defHTML;
		d.id = 'i' + defID;
		d.style.cssText = 'text-transform: none; padding: 5px;';
		prop = objectProperties.appendChild(d)
	  }
	}
	if (disabledHL) return;
	if (!selectedObjects.length) return;
	var selectedIssues = [];
	for (var i = 0; i < selectedObjects.length; i++) {
	  var objectID = selectedObjects[i];
	  if (objectID in _RT.$seen) {
		var objectCopy = _RT.$seen[objectID][I_OBJECTCOPY];
		if (!objectCopy) continue;
		for (var cid in objectCopy.$reportIDs)
		  if (objectCopy.$reportIDs.hasOwnProperty(cid)) {
			var check = _RT.$checks[cid];
			if (check.REPORTONLY) continue;
			selectedIssues.push([check, objectCopy, cid])
		  }
	  }
	}
	var newProp = '<b style="display:block"><a target="_blank" href="' + PFX_FORUM + FORUM_HOME + '">WME Validator</a> ' + trS('props.reports') + ':</b>';
	if (_REP.$isLimitPerCheck)
	  newProp += '<div class="c' + CL_RIGHTTIP + ' c' + CL_NOTE + '">' +
		  '<span><i class="fa fa-info-circle" aria-hidden="true"></i>' +
		  ' <a class="c' + CL_NOTE + '" href="#">' + trS('props.limit.title') + '</a></span>' +
		  '<div class="c' + CL_RIGHTTIPPOPUP + '">' +
		  '<i class="fa fa-times-circle fa-lg fa-pull-left" style="margin-top:0.3em" aria-hidden="true"></i>' +
		  '<div class="c' + CL_RIGHTTIPDESCR + '">' + trS('props.limit.problem') + '.</div>' +
		  '<i class="fa fa-check-square-o fa-lg fa-pull-left" style="color:black;margin-top:0.8em" aria-hidden="true"></i>' +
		  '<div class="c' + CL_RIGHTTIPDESCR + '">' +
		  '<p>' + trS('props.limit.solution') + '.</p>' +
		  '</div></div><br></div>';
	if (skippedObject)
	  newProp += '<div class="c' + CL_RIGHTTIP + ' c' + CL_NOTE + '">' +
		  '<span><i class="fa fa-info-circle" aria-hidden="true"></i>' +
		  ' <a class="c' + CL_NOTE + '" href="#">' + trS('props.skipped.title') + '</a></span>' +
		  '<div class="c' + CL_RIGHTTIPPOPUP + '">' +
		  '<i class="fa fa-times-circle fa-lg fa-pull-left" style="margin-top:0.3em" aria-hidden="true"></i>' +
		  '<div class="c' + CL_RIGHTTIPDESCR + '">' + trS('props.skipped.problem') + '.</div>' +
		  '</div><br></div>';
	if (!selectedIssues.length) {
	  if (prop && (_REP.$isLimitPerCheck || skippedObject)) prop.innerHTML = newProp;
	  return
	}
	selectedIssues.sort(function(a, b) {
	  return cmpCheckIDs(a[2], b[2])
	});
	var selectedCounters = {};
	selectedIssues = selectedIssues.filter(function(e, i, arr) {
	  var checkID = e[2];
	  if (i && arr[i - 1][2] === checkID) {
		selectedCounters[checkID]++;
		return false
	  }
	  selectedCounters[checkID] = 1;
	  return true
	});
	selectedIssues.forEach(function(e) {
	  var check = e[0];
	  var objectCopy = e[1];
	  var checkID = e[2];
	  var checkCounter = selectedCounters[checkID];
	  var sevClass = 0;
	  var sevIcon = '';
	  var sevBG = '';
	  var strCountry = _REP.$countries[objectCopy.$countryID];
	  var ccode = '';
	  if (strCountry)
		ccode = _I18n.getCountryCode(strCountry.toUpperCase());
	  else
		ccode = _RT.$cachedTopCCode;
	  options = trO(check.OPTIONS, ccode);
	  switch (check.SEVERITY) {
		case RS_NOTE:
		  sevClass = CL_NOTE;
		  sevIcon = 'info-circle';
		  sevBG = GL_NOTEBGCOLOR;
		  break;
		case RS_WARNING:
		  sevClass = CL_WARNING;
		  sevIcon = 'exclamation-triangle';
		  sevBG = GL_WARNINGBGCOLOR;
		  break;
		case RS_ERROR:
		  sevClass = CL_ERROR;
		  sevIcon = 'times-circle';
		  sevBG = GL_ERRORBGCOLOR;
		  break;
		case RS_CUSTOM1:
		  sevClass = CL_CUSTOM1;
		  sevIcon = 'user';
		  sevBG = GL_CUSTOM1BGCOLOR;
		  break;
		case RS_CUSTOM2:
		  sevClass = CL_CUSTOM2;
		  sevIcon = 'user';
		  sevBG = GL_CUSTOM2BGCOLOR;
		  break
	  }
	  var shortTitle = exSOS(check.TITLE, options, 'titleEN').replace('WME Color Highlights', 'WMECH').replace('WME Toolbox', 'WMETB');
	  newProp += '<div class="c' + CL_RIGHTTIP + ' c' + sevClass + '">' +
		  '<span><i class="fa fa-' + sevIcon + '" aria-hidden="true"></i>' +
		  ' <a class="c' + sevClass + '" href="#">' + shortTitle + (1 < checkCounter ? ' (' + checkCounter + ')' : '') + '</a></span>' +
		  '<div class="c' + CL_RIGHTTIPPOPUP + '">' +
		  '<i class="fa fa-' + sevIcon + ' fa-lg fa-pull-left" style="margin-top:0.3em" aria-hidden="true"></i>' +
		  '<div class="c' + CL_RIGHTTIPDESCR + '">' +
		  '#' + checkID + ' ' + exSOS(check.PROBLEM, options, 'problemEN');
	  var pl = trO(check.PROBLEMLINK, ccode);
	  if (pl)
		newProp += ': <a target="_blank" href="' + pl + '">' + trO(check.PROBLEMLINKTEXT, ccode) + '</a>';
	  else
		newProp += '.';
	  newProp += '</div>';
	  if (objectCopy.$isEditable) {
		newProp += '<i class="fa fa-check-square-o fa-pull-left fa-lg" style="color:black;margin-top:0.8em" aria-hidden="true"></i>' +
			'<div class="c' + CL_RIGHTTIPDESCR + '">';
		if (check.SOLUTION) {
		  newProp += '<p>' + exSOS(check.SOLUTION, options, 'solutionEN');
		  var sl = trO(check.SOLUTIONLINK, ccode);
		  if (sl)
			newProp += ': <a target="_blank" href="' + sl + '">' + trO(check.SOLUTIONLINKTEXT, ccode) + '</a>';
		  else
			newProp += '.';
		  newProp += '</p>'
		}
	  } else
		newProp += '<i class="fa fa-ban fa-pull-left fa-lg" style="color:black;margin-top:0.8em" aria-hidden="true"></i>' +
			'<div class="c' + CL_RIGHTTIPDESCR + '">' +
			'<p>' + trS('props.noneditable') + '.</p>';
	  var cityID = objectCopy.$cityID;
	  var cityParam = _REP.$cityIDs[cityID].$params[checkID];
	  if (cityParam) newProp += '<p>' + cityParam + '</p>';
	  var streetID = objectCopy.$streetID;
	  var streetParam = _REP.$cityIDs[cityID].$streetIDs[streetID].$params[checkID];
	  if (streetParam) newProp += '<p>' + streetParam + '</p>';
	  newProp += '</div></div><br></div>'
	});
	if (prop) prop.innerHTML = newProp
  }
  function matchRegExp(checkID, objectID, expandedString, options) {
	var optRegExp = options[CO_REGEXP];
	if (!optRegExp) return false;
	var optString = options[CO_STRING];
	var optBool = options[CO_BOOL];
	if (options[CO_NUMBER] && 0 < _REP.$debugCounter) {
	  var checkTitle = '';
	  if (_RT.$checks[checkID] && _RT.$checks[checkID].TITLE) checkTitle = _RT.$checks[checkID].TITLE;
	  var reported = optRegExp.test(expandedString) ? optBool ? false : true : optBool ? true : false;
	  _REP.$debugCounter--;
	  log(getMsg(
		  'debug log for segment ' + objectID + ', check #' + checkID,
		  '\n1. ' + (optString ? 'Expand template: ' + optString + ' -> ' : 'String: ') + expandedString + '\n2. Match RegExp: ' + (optBool ? 'not ' : '') + optRegExp + ' -> ' +
			  JSON.stringify(expandedString.match(optRegExp)) + '\n=> ' + (reported ? 'REPORT the segment as #' + checkID + ' \'' + checkTitle + '\'' : 'skip the segment') +
			  (0 < _REP.$debugCounter ? '' : '\nEnd of debug log. Click \'✘\' (Clear report) button to start debug over.')))
	}
	if (optRegExp.test(expandedString)) {
	  if (!optBool) return true
	} else if (optBool)
	  return true;
	return false
  }
  var reportWMECH = _UI.pSettings.pScanner.oReportExt.CHECKED && _RT.oReportWMECH.CHECKED;
  var reportToolbox = _UI.pSettings.pScanner.oReportExt.CHECKED && _RT.oReportToolbox.CHECKED;
  var currentZoom = WM.getZoom();
  var slowChecks = _UI.pSettings.pScanner.oSlowChecks.CHECKED && 3 < currentZoom;
  var oExcludeNotes = _UI.pMain.pFilter.oExcludeNotes.CHECKED;
  var selectedObjects = [];
  _RT.$HLedObjects = {};
  for (var segmentKey in WMo.segments.objects) {
	var rawSegment = WMo.segments.objects[segmentKey];
	var segmentID = rawSegment.getID();
	if (_RT.$topUser.$userLevel <= rawSegment.attributes.lockRank && rawSegment.attributes.updatedOn && 13989024E5 < rawSegment.attributes.updatedOn) {
	  if (rawSegment.selected) {
		skippedObject = true;
		if (!DEF_DEBUG) selectedObjects.push(segmentID)
	  }
	  if (!DEF_DEBUG) continue
	}
	if (rawSegment.layer && rawSegment.id in rawSegment.layer.unrenderedFeatures) continue;
	if ('Delete' === rawSegment.state) continue;
	var seen = null;
	if (segmentID in _RT.$seen) seen = _RT.$seen[segmentID];
	if (rawSegment.selected) {
	  selectedObjects.push(segmentID);
	  _RT.$revalidate[segmentID] = true;
	  if (seen && !seen[I_ISWMECHCOLOR]) {
		deleteSeenObject(segmentID);
		seen = null
	  }
	} else if (segmentID in _RT.$revalidate) {
	  deleteSeenObject(segmentID);
	  seen = null;
	  delete _RT.$revalidate[segmentID];
	  delete rawSegment[GL_WMECHCOLOR]
	}
	var segmentGeometry = document.getElementById(rawSegment.geometry.id);
	if (segmentGeometry) {
	  var strokeColor = segmentGeometry.getAttribute('stroke').toUpperCase();
	  if (4 === strokeColor.length) strokeColor = '#' + strokeColor.charAt(1) + strokeColor.charAt(1) + strokeColor.charAt(2) + strokeColor.charAt(2) + strokeColor.charAt(3) + strokeColor.charAt(3);
	  if (strokeColor in _RT.$WMECHcolors) rawSegment[GL_WMECHCOLOR] = strokeColor
	}
	if (seen) {
	  var isTBColor = GL_TBCOLOR in rawSegment;
	  var isWMECHColor = GL_WMECHCOLOR in rawSegment;
	  if (!seen[I_ISPARTIAL] && isTBColor === seen[I_ISTBCOLOR] && isWMECHColor === seen[I_ISWMECHCOLOR]) {
		HLObject(rawSegment);
		continue
	  }
	}
	var segment = new SimpleOBJECT(segmentID, WMo.segments);
	Object.seal(segment);
	var address = segment.$address;
	var country = address.$country;
	var countryLen = country.length;
	var countryCode = country ? _I18n.getCountryCode(country.toUpperCase()) : _RT.$cachedTopCCode;
	var city = address.$city;
	var cityLen = city.length;
	var cityID = address.$cityID;
	var street = address.$street;
	var state = address.$state;
	var streetLen = street.length;
	var alts = segment.$alts;
	var roadType = segment.$type;
	var typeRank = segment.$typeRank;
	var isToll = segment.$isToll;
	var direction = segment.$direction;
	var elevation = segment.$elevation;
	var lock = Math.max(segment.$lock, segment.$rank);
	var segmentLen = segment.$length;
	var isRoundabout = segment.$isRoundabout;
	var hasHNs = segment.$hasHNs;
	var isDrivable = RR_TRAIL < typeRank;
	var nodeA = segment.$nodeA;
	var nodeB = segment.$nodeB;
	var nodeAID = segment.$nodeAID;
	var nodeBID = segment.$nodeBID;
	var isPartial = nodeA.$isPartial || nodeB.$isPartial;
	var forwardSpeed = segment.$fwdMaxSpeed;
	var reverseSpeed = segment.$revMaxSpeed;
	var forwardSpeedUnverified = segment.$fwdMaxSpeedUnverified;
	var reverseSpeedUnverified = segment.$fwdMaxSpeedUnverified;
	var hasRestrictions = segment.$hasRestrictions;
	var now = Date.now();
	if (seen) {
	  if (seen[I_ISPARTIAL] && isPartial) {
		HLObject(rawSegment);
		continue
	  }
	  deleteSeenObject(segmentID);
	  seen = null
	}
	_RT.$seen[segmentID] = seen = [0, null, GL_TBCOLOR in rawSegment, GL_WMECHCOLOR in rawSegment, isPartial || 4 > currentZoom, cityID];
	segment.incCityCounter();
	if (segment.$isEditable) _REP.$isEditableFound = true;
	if (GL_NOID === street) {
	  deleteSeenObject(segmentID);
	  continue
	}
	_RT.$isGlobalAccess = true;
	if (!address.isOkFor(0)) {
	  _RT.$isGlobalAccess = false;
	  continue
	}
	if (slowChecks && RT_RAILROAD !== roadType) {
	  if (nodeA.$otherSegmentsLen && isLimitOk(118)) {
		var rawNode = nodeA.$rawNode;
		var baseAngle = rawNode.getAngleToSegment(rawSegment);
		for (var i = 0; i < nodeA.$otherSegmentsLen; i++) {
		  var otherSegment = nodeA.$otherSegments[i];
		  if (!otherSegment.$rawSegment) continue;
		  var curAngle = rawNode.getAngleToSegment(otherSegment.$rawSegment);
		  var angle = Math.abs(baseAngle - curAngle);
		  if (angle > 180) angle = 360 - angle;
		  if (2 > angle && address.isOkFor(118)) {
			segment.report(118);
			break
		  }
		}
	  }
	  if (nodeB.$otherSegmentsLen && isLimitOk(119)) {
		var rawNode = nodeB.$rawNode;
		var baseAngle = rawNode.getAngleToSegment(rawSegment);
		for (var i = 0; i < nodeB.$otherSegmentsLen; i++) {
		  var otherSegment = nodeB.$otherSegments[i];
		  if (!otherSegment.$rawSegment) continue;
		  var curAngle = rawNode.getAngleToSegment(otherSegment.$rawSegment);
		  var angle = Math.abs(baseAngle - curAngle);
		  if (angle > 180) angle = 360 - angle;
		  if (2 > angle && address.isOkFor(119)) {
			segment.report(119);
			break
		  }
		}
	  }
	}
	if (!countryLen && isLimitOk(23)) {
	  seen[I_ISPARTIAL] = false;
	  if (address.isOkFor(23)) {
		segment.report(23);
		HLObject(rawSegment)
	  }
	  continue
	}
	if (streetLen && address.isOkFor(101)) {
	  options = getCheckOptions(101, countryCode);
	  if (options[CO_REGEXP].test(street)) {
		segment.report(101);
		HLObject(rawSegment);
		continue
	  }
	}
	if (!state && address.isOkFor(106)) segment.report(106);
	if (reportToolbox && address.isOkFor(CK_TBFIRST)) {
	  var col = rawSegment[GL_TBCOLOR];
	  if (col) {
		col = col.toUpperCase();
		for (var i = CK_TBFIRST; i <= CK_TBLAST; i++) {
		  var check = _RT.$checks[i];
		  if (check.COLOR === col) {
			segment.report(i);
			break
		  }
		}
	  }
	}
	if (reportWMECH && address.isOkFor(CK_WMECHFIRST)) {
	  var col = rawSegment[GL_WMECHCOLOR];
	  if (col)
		for (var i = CK_WMECHFIRST; i <= CK_WMECHLAST; i++) {
		  var check = _RT.$checks[i];
		  if (check && check.COLOR === col) {
			segment.report(i);
			break
		  }
		}
	}
	if (alts.length && address.isOkFor(34))
	  for (var i = 0; i < alts.length; i++)
		if (!alts[i].$street) {
		  segment.report(34);
		  break
		}
	if (slowChecks && segment.$restrictionsLen && isLimitOk(38) && address.isOkFor(38)) {
	  var restrictions = segment.$restrictions;
	  for (var i = 0; i < restrictions.length; i++)
		if (restrictions[i].$isInThePast) {
		  segment.report(38);
		  break
		}
	}
	if (slowChecks && (nodeA.$restrictionsLen || nodeB.$restrictionsLen) && isLimitOk(39) && address.isOkFor(39)) {
	  var restrictions = nodeA.$restrictions.concat(nodeB.$restrictions);
	  for (var i = 0; i < restrictions.length; i++) {
		var restriction = restrictions[i];
		if (restriction.$isInThePast) {
		  var param = '';
		  if (restriction.$to.$address && restriction.$to.$address.$street) param = 'turn to ' + restriction.$to.$address.$street;
		  segment.report({$checkID: 39, $streetParam: param});
		  break
		}
	  }
	}
	if (nodeAID && nodeAID === nodeBID && address.isOkFor(43)) segment.report(43);
	if (RT_RAILROAD === roadType && 100 > segmentLen && !isPartial && !nodeA.$otherSegmentsLen && !nodeB.$otherSegmentsLen && address.isOkFor(104)) segment.report(104);
	if (RT_TRAIL === roadType && -5 === elevation && address.isOkFor(105)) segment.report(105);
	if ((9 < elevation || -5 > elevation) && address.isOkFor(116)) segment.report(116);
	var expandOptions = {
	  'country': country,
	  'state': state,
	  'city': city,
	  'street': street,
	  'altStreet': alts.map(function(e) {
		return e.$street
	  }),
	  'altCity': alts.map(function(e) {
		return e.$city
	  }),
	  'type': roadType,
	  'typeRank': typeRank,
	  'toll': +isToll,
	  'direction': direction,
	  'elevation': elevation,
	  'lock': lock,
	  'length': segmentLen,
	  'ID': segmentID,
	  'roundabout': +isRoundabout,
	  'hasHNs': +hasHNs,
	  'drivable': +isDrivable,
	  'Uturn': +(nodeA.$isUturn || nodeB.$isUturn),
	  'deadEnd': +!(isPartial || nodeA.$otherSegmentsLen && nodeB.$otherSegmentsLen),
	  'partialA': +nodeA.$isPartial,
	  'deadEndA': +!(nodeA.$isPartial || nodeA.$otherSegmentsLen),
	  'segmentsA': nodeA.$otherSegmentsLen,
	  'inA': nodeA.$inConnectionsLen,
	  'outA': nodeA.$outConnectionsLen,
	  'UturnA': +nodeA.$isUturn,
	  'partialB': +nodeB.$isPartial,
	  'deadEndB': +!(nodeB.$isPartial || nodeB.$otherSegmentsLen),
	  'segmentsB': nodeB.$otherSegmentsLen,
	  'inB': nodeB.$inConnectionsLen,
	  'outB': nodeB.$outConnectionsLen,
	  'UturnB': +nodeB.$isUturn,
	  'softTurns': +!(segment.$isTurnALocked && segment.$isTurnBLocked),
	  'speedLimit': forwardSpeed || reverseSpeed,
	  'speedLimitAB': forwardSpeed,
	  'speedLimitBA': reverseSpeed,
	  'checkSpeedLimit': isDrivable && (reverseSpeedUnverified || forwardSpeedUnverified)
	};
	for (var i = CK_MATCHFIRST; i <= CK_MATCHLAST; i++) {
	  if (!isLimitOk(i) || !address.isOkFor(i)) continue;
	  options = getCheckOptions(i, countryCode);
	  var optString = options[CO_STRING];
	  var optRegExp = options[CO_REGEXP];
	  if (!optString || !optRegExp) continue;
	  var expandedString = _I18n.expandSO(optString, expandOptions);
	  if (matchRegExp(i, segmentID, expandedString, options)) segment.report(i)
	}
	if (!cityLen && RT_FREEWAY === roadType && isLimitOk(69) && address.isOkFor(69)) segment.report(69);
	if (slowChecks) {
	  if (1 === nodeA.$otherSegmentsLen && DIR_UNKNOWN !== direction && !nodeA.$isPartial && !nodeA.$isUturn && !nodeA.$restrictionsLen && !segment.$restrictionsLen && isLimitOk(36) &&
		  address.isOkFor(36)) {
		var otherSegment = nodeA.$otherSegments[0];
		var otherNode, nextNode;
		if (otherSegment.$nodeAID === nodeAID) {
		  otherNode = otherSegment.$nodeA;
		  nextNode = otherSegment.$nodeB
		} else {
		  otherNode = otherSegment.$nodeB;
		  nextNode = otherSegment.$nodeA
		}
		if ((!nodeB.$isPartial || !nextNode.$isPartial) && otherSegment.$segmentID !== segmentID && otherSegment.$rawSegment && (1E4 > otherSegment.$length + segmentLen || 1E3 > segmentLen) &&
			otherSegment.$address.$street === street && otherSegment.$address.$city === city && otherSegment.$address.$state === state && otherSegment.$address.$country === country &&
			otherSegment.$fwdMaxSpeed === forwardSpeed && otherSegment.$revMaxSpeed === reverseSpeed && otherSegment.$fwdMaxSpeedUnverified === forwardSpeedUnverified &&
			otherSegment.$revMaxSpeedUnverified === reverseSpeedUnverified && otherSegment.$type === roadType && otherSegment.$isToll === isToll && otherSegment.$hasRestrictions === hasRestrictions &&
			(DIR_TWO === otherSegment.$direction && DIR_TWO === direction || DIR_TWO !== otherSegment.$direction && DIR_TWO !== direction) && otherSegment.$elevation === elevation &&
			otherSegment.$nodeAID !== nodeBID && otherSegment.$nodeBID !== nodeBID && !otherSegment.$restrictionsLen && !otherNode.$restrictionsLen && deepCompare(otherSegment.$alts, alts)) {
		  var loopFound = false;
		  for (var i = 0; i < nextNode.$otherSegmentsLen; i++) {
			var thirdSegment = nextNode.$otherSegments[i];
			if (thirdSegment.$nodeAID === nodeBID || thirdSegment.$nodeBID === nodeBID) {
			  loopFound = true;
			  break
			}
		  }
		  if (!loopFound) segment.report(36)
		}
	  }
	  if (DIR_UNKNOWN !== direction && !nodeB.$isPartial && 1 === nodeB.$otherSegmentsLen && !nodeB.$isUturn && !nodeB.$restrictionsLen && !segment.$restrictionsLen && isLimitOk(37) &&
		  address.isOkFor(37)) {
		var otherSegment = nodeB.$otherSegments[0];
		var otherNode, nextNode;
		if (otherSegment.$nodeAID === nodeBID) {
		  otherNode = otherSegment.$nodeA;
		  nextNode = otherSegment.$nodeB
		} else {
		  otherNode = otherSegment.$nodeB;
		  nextNode = otherSegment.$nodeA
		}
		if ((!nodeA.$isPartial || !nextNode.$isPartial) && otherSegment.$segmentID !== segmentID && otherSegment.$rawSegment && 1E4 > otherSegment.$length + segmentLen &&
			otherSegment.$address.$street === street && otherSegment.$address.$city === city && otherSegment.$address.$state === state && otherSegment.$address.$country === country &&
			otherSegment.$fwdMaxSpeed === forwardSpeed && otherSegment.$revMaxSpeed === reverseSpeed && otherSegment.$fwdMaxSpeedUnverified === forwardSpeedUnverified &&
			otherSegment.$revMaxSpeedUnverified === reverseSpeedUnverified && otherSegment.$type === roadType && otherSegment.$isToll === isToll && otherSegment.$hasRestrictions === hasRestrictions &&
			(DIR_TWO === otherSegment.$direction && DIR_TWO === direction || DIR_TWO !== otherSegment.$direction && DIR_TWO !== direction) && otherSegment.$elevation === elevation &&
			otherSegment.$nodeAID !== nodeAID && otherSegment.$nodeBID !== nodeAID && !otherSegment.$restrictionsLen && !otherNode.$restrictionsLen && deepCompare(otherSegment.$alts, alts)) {
		  var loopFound = false;
		  for (var i = 0; i < nextNode.$otherSegmentsLen; i++) {
			var thirdSegment = nextNode.$otherSegments[i];
			if (thirdSegment.$nodeAID === nodeAID || thirdSegment.$nodeBID === nodeAID) {
			  loopFound = true;
			  break
			}
		  }
		  if (!loopFound) segment.report(37)
		}
	  }
	}
	if (cityLen) {
	  for (var i = CK_CITYNAMEFIRST; i <= CK_CITYNAMELAST; i++) {
		if (!address.isOkFor(i) || !isLimitOk(i)) continue;
		if (matchRegExp(i, segmentID, city, getCheckOptions(i, countryCode))) segment.report(i)
	  }
	  if (isLimitOk(24) && address.isOkFor(24)) {
		var param = trS('city.1');
		var r = 3 > cityLen ? true : false;
		var cityCounter = _repCC[cityID];
		if (1 === cityCounter || cityID in _REP.$incompleteIDs && !_REP.$incompleteIDs[cityID].$counterReported)
		  for (var i = 0, len = _REP.$unsortedCityIDs.length; i < len; i++) {
			var cid = _REP.$unsortedCityIDs[i];
			if (cid === cityID) continue;
			var c = _repC[cid];
			var cLen = c.length;
			if (1 > cLen) continue;
			var cityObj = getCityCmpObj(cityID, city, c);
			var cObj = getCityCmpObj(cid, c, city);
			setCmpObjLimits(cityObj, cObj);
			setCmpObjLimits(cObj, cityObj);
			if (cityObj.$limit) _REP.$incompleteIDs[cityID] = cityObj;
			if (cObj.$limit && !_REP.$incompleteIDs[cid]) _REP.$incompleteIDs[cid] = cObj;
			if (cityObj.$limit || cObj.$limit) break
		  }
		if (cityID in _REP.$incompleteIDs) {
		  var incompleteCity = _REP.$incompleteIDs[cityID];
		  incompleteCity.$counterReported++;
		  if (incompleteCity.$limit < cityCounter) {
			r = false;
			deleteCityCheck(cityID, 24);
			delete _REP.$incompleteIDs[cityID]
		  } else {
			r = true;
			param = trS('city.consider') + ' ' + incompleteCity.$otherCity + ' [' + incompleteCity.$reason + ']'
		  }
		}
		if (r) segment.report({$checkID: 24, $cityParam: param})
	  }
	  if (RT_RAILROAD === roadType && isLimitOk(24) && address.isOkFor(27)) segment.report(27);
	  if (RT_FREEWAY === roadType && isLimitOk(59) && address.isOkFor(59)) segment.report(59)
	}
	if (isDrivable) {
	  if (slowChecks) {
		if (nodeA.$outConnectionsLen && (DIR_TWO === direction || DIR_BA === direction) && isLimitOk(120)) {
		  var rawNode = nodeA.$rawNode;
		  var baseAngle = rawNode.getAngleToSegment(rawSegment);
		  for (var i = 0; i < nodeA.$outConnectionsLen; i++) {
			var otherSegment = nodeA.$outConnections[i];
			if (!otherSegment.$rawSegment) continue;
			var curAngle = rawNode.getAngleToSegment(otherSegment.$rawSegment);
			var angle = Math.abs(baseAngle - curAngle);
			if (angle > 180) angle = 360 - angle;
			if (30 > angle && 2 <= angle && address.isOkFor(120))
			  if (10 > angle) {
				segment.report(120);
				break
			  } else if (!nodeA.$isPartial && 3 > nodeA.$otherSegmentsLen && RR_STREET < typeRank) {
				segment.report(120);
				break
			  }
		  }
		}
		if (nodeB.$outConnectionsLen && (DIR_TWO === direction || DIR_AB === direction) && isLimitOk(121)) {
		  var rawNode = nodeB.$rawNode;
		  var baseAngle = rawNode.getAngleToSegment(rawSegment);
		  for (var i = 0; i < nodeB.$outConnectionsLen; i++) {
			var otherSegment = nodeB.$outConnections[i];
			if (!otherSegment.$rawSegment) continue;
			var curAngle = rawNode.getAngleToSegment(otherSegment.$rawSegment);
			var angle = Math.abs(baseAngle - curAngle);
			if (angle > 180) angle = 360 - angle;
			if (30 > angle && 2 <= angle && address.isOkFor(121))
			  if (10 > angle) {
				segment.report(121);
				break
			  } else if (!nodeB.$isPartial && 3 > nodeB.$otherSegmentsLen && RR_STREET < typeRank) {
				segment.report(121);
				break
			  }
		  }
		}
	  }
	  if (RT_PRIVATE !== roadType && isLimitOk(45) && address.isOkFor(45))
		if (!nodeA.$isPartial && !nodeA.$inConnectionsLen)
		  if (DIR_AB === direction)
			segment.report(45);
		  else if (!nodeB.$isPartial && !nodeB.$inConnectionsLen)
			segment.report(45);
		  else {
			if (slowChecks && DIR_TWO === direction && nodeA.$otherSegmentsLen && isLimitOk(46))
			  for (var i = 0; i < nodeA.$otherSegmentsLen; i++) {
				var otherSegment = nodeA.$otherSegments[i];
				if (!otherSegment.$rawSegment) continue;
				if (RR_TRAIL < otherSegment.$typeRank &&
					(DIR_TWO === otherSegment.$direction || DIR_AB === otherSegment.$direction && nodeAID === otherSegment.$nodeBID ||
					 DIR_BA === otherSegment.$direction && nodeAID === otherSegment.$nodeAID)) {
				  segment.report(46);
				  break
				}
			  }
		  }
		else if (!nodeB.$isPartial && !nodeB.$inConnectionsLen)
		  if (DIR_BA === direction)
			segment.report(45);
		  else if (slowChecks && DIR_TWO === direction && nodeB.$otherSegmentsLen && isLimitOk(47))
			for (var i = 0; i < nodeB.$otherSegmentsLen; i++) {
			  var otherSegment = nodeB.$otherSegments[i];
			  if (!otherSegment.$rawSegment) continue;
			  if (RR_TRAIL < otherSegment.$typeRank &&
				  (DIR_TWO === otherSegment.$direction || DIR_AB === otherSegment.$direction && nodeBID === otherSegment.$nodeBID ||
				   DIR_BA === otherSegment.$direction && nodeBID === otherSegment.$nodeAID)) {
				segment.report(47);
				break
			  }
			}
	  if (5 < segmentLen && isLimitOk(44) && address.isOkFor(44))
		if (!nodeA.$isPartial && !nodeA.$outConnectionsLen)
		  if (DIR_BA === direction)
			segment.report(44);
		  else if (!nodeB.$isPartial && !nodeB.$outConnectionsLen)
			segment.report(44);
		  else {
			if (slowChecks && DIR_TWO === direction && nodeA.$otherSegmentsLen && isLimitOk(102))
			  for (var i = 0; i < nodeA.$otherSegmentsLen; i++) {
				var otherSegment = nodeA.$otherSegments[i];
				if (!otherSegment.$rawSegment) continue;
				if (RR_TRAIL < otherSegment.$typeRank && RT_PRIVATE !== otherSegment.$type &&
					(DIR_TWO === otherSegment.$direction || DIR_BA === otherSegment.$direction && nodeAID === otherSegment.$nodeBID ||
					 DIR_AB === otherSegment.$direction && nodeAID === otherSegment.$nodeAID)) {
				  segment.report(102);
				  break
				}
			  }
		  }
		else if (!nodeB.$isPartial && !nodeB.$outConnectionsLen)
		  if (DIR_AB === direction)
			segment.report(44);
		  else if (slowChecks && DIR_TWO === direction && nodeB.$otherSegmentsLen && isLimitOk(103))
			for (var i = 0; i < nodeB.$otherSegmentsLen; i++) {
			  var otherSegment = nodeB.$otherSegments[i];
			  if (!otherSegment.$rawSegment) continue;
			  if (RR_TRAIL < otherSegment.$typeRank && RT_PRIVATE !== otherSegment.$type &&
				  (DIR_TWO === otherSegment.$direction || DIR_BA === otherSegment.$direction && nodeBID === otherSegment.$nodeBID ||
				   DIR_AB === otherSegment.$direction && nodeBID === otherSegment.$nodeAID)) {
				segment.report(103);
				break
			  }
			}
	  if (slowChecks && segment.$isRoutable && !nodeA.$isPartial && !nodeB.$isPartial && nodeA.$otherSegmentsLen > 0 && nodeB.$otherSegmentsLen > 0 && isLimitOk(202) && address.isOkFor(202)) {
		var foundPublicConnection = false;
		for (var i = 0; i < nodeA.$otherSegmentsLen; i++) {
		  var otherSegment = nodeA.$otherSegments[i];
		  if (otherSegment.$rawObject.isRoutable()) {
			foundPublicConnection = true;
			break
		  }
		}
		if (!foundPublicConnection)
		  for (var i = 0; i < nodeB.$otherSegmentsLen; i++) {
			var otherSegment = nodeB.$otherSegments[i];
			if (otherSegment.$rawObject.isRoutable()) {
			  foundPublicConnection = true;
			  break
			}
		  }
		if (!foundPublicConnection) segment.report(202)
	  }
	  if (RR_STREET < typeRank && RT_RAMP !== roadType && !segment.$isRoundabout && segmentLen > 5) {
		if (DIR_AB === direction || DIR_TWO === direction) {
		  if (forwardSpeedUnverified && isLimitOk(210) && address.isOkFor(210)) segment.report(210);
		  if (!forwardSpeed && isLimitOk(212) && address.isOkFor(212)) segment.report(212);
		  if (forwardSpeed) {
			options = getCheckOptions(214, countryCode);
			if (!options[CO_REGEXP].test(forwardSpeed) && isLimitOk(214) && address.isOkFor(214)) segment.report(214)
		  }
		}
		if (DIR_BA === direction || DIR_TWO == direction) {
		  if (reverseSpeedUnverified && isLimitOk(211) && address.isOkFor(211)) segment.report(211);
		  if (!reverseSpeed && isLimitOk(213) && address.isOkFor(213)) segment.report(213);
		  if (reverseSpeed) {
			options = getCheckOptions(215, countryCode);
			if (!options[CO_REGEXP].test(reverseSpeed) && isLimitOk(215) && address.isOkFor(215)) segment.report(215)
		  }
		}
	  }
	  if (DIR_UNKNOWN === direction && isLimitOk(25) && address.isOkFor(25)) segment.report(25);
	  if (!(nodeAID && nodeBID) && isLimitOk(35) && address.isOkFor(35)) segment.report(35);
	  if (RR_PRIMARY > typeRank) {
		if (nodeAID && nodeBID && address.isOkFor(200)) {
		  if (!segment.$isTurnALocked && nodeA.$otherSegmentsLen && isLimitOk(200)) segment.report(200);
		  if (!segment.$isTurnBLocked && nodeB.$otherSegmentsLen && isLimitOk(300)) segment.report(300)
		}
	  } else if (nodeAID && nodeBID && address.isOkFor(201)) {
		if (!segment.$isTurnALocked && nodeA.$otherSegmentsLen && isLimitOk(201)) segment.report(201);
		if (!segment.$isTurnBLocked && nodeB.$otherSegmentsLen && isLimitOk(301)) segment.report(301)
	  }
	  if ((DIR_AB === direction && nodeA.$outConnectionsLen || DIR_BA === direction && nodeA.$inConnectionsLen) && isLimitOk(41) && address.isOkFor(41)) segment.report(41);
	  if ((DIR_BA === direction && nodeB.$outConnectionsLen || DIR_AB === direction && nodeB.$inConnectionsLen) && isLimitOk(42) && address.isOkFor(42)) segment.report(42);
	  if (!nodeA.$isPartial) {
		if (slowChecks && 5 < segmentLen && !nodeA.$otherSegmentsLen && nodeA.$rawNode.geometry.bounds && isLimitOk(107) && address.isOkFor(107)) {
		  var IDs = nodeA.$rawNode.attributes.segIDs;
		  var pt = new OpenLayers.Geometry.Point(nodeA.$rawNode.geometry.bounds.left, nodeA.$rawNode.geometry.bounds.bottom);
		  for (var segKey in WMo.segments.objects) {
			var seg = WMo.segments.objects[segKey];
			if (segmentID === seg.getID()) continue;
			if (!seg.geometry) continue;
			if (elevation !== seg.attributes.level) continue;
			if ('Delete' === seg.state) continue;
			if (RR_TRAIL >= SimpleOBJECT.prototype.getTypeRank(seg.attributes.roadType)) continue;
			if (LIMIT_TOLERANCE > seg.geometry.distanceTo(pt, null)) {
			  if (!seg.arePropertiesEditable()) segment.$forceNonEditable = true;
			  segment.report(107);
			  break
			}
		  }
		}
		if (nodeA.$isUturn)
		  if (slowChecks && 1 === nodeA.$outConnectionsLen && isLimitOk(99) && address.isOkFor(99) && nodeA.$outConnections[0].$isRoundabout) segment.report(99);
		if (slowChecks && nodeA.$otherSegmentsLen && !isRoundabout && isLimitOk(78) && address.isOkFor(78))
		  for (var i = 0; i < nodeA.$otherSegmentsLen; i++) {
			var otherSegment = nodeA.$otherSegments[i];
			if (!otherSegment.$rawSegment) continue;
			if (RR_TRAIL < otherSegment.$typeRank && nodeAID && nodeBID &&
				(otherSegment.$nodeAID === nodeAID && otherSegment.$nodeBID === nodeBID || otherSegment.$nodeAID === nodeBID && otherSegment.$nodeBID === nodeAID))
			  if (otherSegment.$typeRank > typeRank || otherSegment.$length < segmentLen && otherSegment.$typeRank === typeRank ||
				  otherSegment.$segmentID < segmentID && otherSegment.$length === segmentLen && otherSegment.$typeRank === typeRank) {
				segment.report(78);
				break
			  }
		  }
		if (!nodeB.$isPartial) {
		  options = getCheckOptions(109, countryCode);
		  if (options[CO_NUMBER] > segmentLen && nodeA.$otherSegmentsLen && nodeB.$otherSegmentsLen && !isRoundabout && address.isOkFor(109)) segment.report(109);
		  if (slowChecks && 15 > segmentLen && !streetLen && 2 === nodeA.$otherSegmentsLen && 2 === nodeB.$otherSegmentsLen && isLimitOk(79) && address.isOkFor(79) &&
			  nodeA.$otherSegments[0].$rawSegment && nodeA.$otherSegments[1].$rawSegment && nodeB.$otherSegments[0].$rawSegment && nodeB.$otherSegments[1].$rawSegment &&
			  nodeA.$otherSegments[0].$address.$street && nodeA.$otherSegments[0].$type === nodeA.$otherSegments[1].$type && nodeB.$otherSegments[0].$type === nodeB.$otherSegments[1].$type &&
			  nodeA.$otherSegments[0].$address.$street === nodeA.$otherSegments[1].$address.$street && nodeB.$otherSegments[0].$address.$street === nodeB.$otherSegments[1].$address.$street &&
			  nodeA.$otherSegments[0].$address.$street === nodeB.$otherSegments[0].$address.$street) {
			if ((DIR_TWO === direction || DIR_BA === direction) && 1 === nodeA.$outConnectionsLen && 2 > nodeA.$inConnectionsLen && 1 === nodeB.$inConnectionsLen && 2 > nodeB.$outConnectionsLen)
			  segment.report(79);
			if ((DIR_TWO === direction || DIR_AB === direction) && 1 === nodeB.$outConnectionsLen && 2 > nodeB.$inConnectionsLen && 1 === nodeA.$inConnectionsLen && 2 > nodeA.$outConnectionsLen)
			  segment.report(79)
		  }
		}
	  }
	  if (!nodeB.$isPartial) {
		if (slowChecks && 5 < segmentLen && !nodeB.$otherSegmentsLen && nodeB.$rawNode.geometry.bounds && isLimitOk(108) && address.isOkFor(108)) {
		  var IDs = nodeB.$rawNode.attributes.segIDs;
		  var pt = new OpenLayers.Geometry.Point(nodeB.$rawNode.geometry.bounds.left, nodeB.$rawNode.geometry.bounds.bottom);
		  for (var segKey in WMo.segments.objects) {
			var seg = WMo.segments.objects[segKey];
			if (segmentID === seg.getID()) continue;
			if (!seg.geometry) continue;
			if (elevation !== seg.attributes.level) continue;
			if ('Delete' === seg.state) continue;
			if (RR_TRAIL >= SimpleOBJECT.prototype.getTypeRank(seg.attributes.roadType)) continue;
			if (LIMIT_TOLERANCE > seg.geometry.distanceTo(pt, null)) {
			  if (!seg.arePropertiesEditable()) segment.$forceNonEditable = true;
			  segment.report(108);
			  break
			}
		  }
		}
		if (nodeB.$isUturn) {
		  if (!nodeB.$otherSegmentsLen && isLimitOk(77) && address.isOkFor(77)) segment.report(77);
		  if (slowChecks && 1 === nodeB.$outConnectionsLen && isLimitOk(99) && address.isOkFor(99) && nodeB.$outConnections[0].$isRoundabout) segment.report(99)
		}
	  }
	  if (RT_FREEWAY === roadType) {
		if (0 !== elevation && isLimitOk(110) && address.isOkFor(110)) segment.report(110);
		options = getCheckOptions(150, countryCode);
		if (options[CO_NUMBER] > lock && isLimitOk(150) && address.isOkFor(150)) segment.report(150);
		if (DIR_TWO === direction && address.isOkFor(90)) segment.report(90)
	  }
	  if (RT_MAJOR === roadType) {
		options = getCheckOptions(151, countryCode);
		if (options[CO_NUMBER] > lock && isLimitOk(151) && address.isOkFor(151)) segment.report(151)
	  }
	  if (RT_MINOR === roadType) {
		options = getCheckOptions(152, countryCode);
		if (options[CO_NUMBER] > lock && isLimitOk(152) && address.isOkFor(152)) segment.report(152)
	  }
	  if (RT_RAMP === roadType) {
		if (DIR_TWO === direction && isLimitOk(91) && address.isOkFor(91)) segment.report(91);
		options = getCheckOptions(153, countryCode);
		if (options[CO_NUMBER] > lock && isLimitOk(153) && address.isOkFor(153)) segment.report(153)
	  }
	  if (RT_PRIMARY === roadType) {
		options = getCheckOptions(154, countryCode);
		if (options[CO_NUMBER] > lock && isLimitOk(154) && address.isOkFor(154)) segment.report(154)
	  }
	} else if (slowChecks && !hasHNs && RT_RAILROAD !== roadType) {
	  if (nodeA.$otherSegmentsLen && (nodeB.$otherSegmentsLen || 300 < segmentLen) && isLimitOk(114) && address.isOkFor(114))
		for (var i = 0; i < nodeA.$otherSegmentsLen; i++) {
		  var otherSegment = nodeA.$otherSegments[i];
		  if (!otherSegment.$rawSegment) continue;
		  if (RR_TRAIL < otherSegment.$typeRank) {
			segment.report(114);
			break
		  }
		}
	  if (nodeB.$otherSegmentsLen && (nodeA.$otherSegmentsLen || 300 < segmentLen) && isLimitOk(115) && address.isOkFor(115))
		for (var i = 0; i < nodeB.$otherSegmentsLen; i++) {
		  var otherSegment = nodeB.$otherSegments[i];
		  if (!otherSegment.$rawSegment) continue;
		  if (RR_TRAIL < otherSegment.$typeRank) {
			segment.report(115);
			break
		  }
		}
	}
	if (streetLen) {
	  var checkIDType = {160: RT_FREEWAY, 161: RT_MAJOR, 162: RT_MINOR, 163: RT_RAMP, 164: RT_PRIMARY, 165: RT_STREET, 166: RT_PARKING, 167: RT_RAILROAD, 169: 0};
	  var checkIDID = {160: 70, 161: 71, 162: 72};
	  for (var i in checkIDType) {
		i = +i;
		if (!address.isOkFor(i) || !isLimitOk(i)) continue;
		var rType = checkIDType[i];
		options = getCheckOptions(i, countryCode);
		if (rType === roadType || !rType) {
		  if (matchRegExp(i, segmentID, street, options)) segment.report(i)
		} else {
		  var mi = checkIDID[i];
		  if (mi && address.isOkFor(mi) && !matchRegExp(i, segmentID, street, options)) segment.report(mi)
		}
	  }
	  for (var i = CK_STREETNAMEFIRST; i <= CK_STREETNAMELAST; i++) {
		if (!address.isOkFor(i) || !isLimitOk(i)) continue;
		if (matchRegExp(i, segmentID, street, getCheckOptions(i, countryCode))) segment.report(i)
	  }
	  if (cityLen && RT_RAMP === roadType && isLimitOk(57) && address.isOkFor(57)) segment.report(57);
	  if (-1 !== street.indexOf('CONST ZN') && isLimitOk(117) && address.isOkFor(117)) segment.report(117);
	  if (RT_RAMP !== roadType && -1 !== street.indexOf('.') && isLimitOk(95) && address.isOkFor(95)) segment.report(95);
	  if (RT_RAMP === roadType)
		if (DIR_TWO === direction)
		  if (isLimitOk(28) && address.isOkFor(28)) segment.report(28);
	  if (RR_RAMP > typeRank) {
		options = getCheckOptions(73, countryCode);
		if (options[CO_NUMBER] > streetLen && isLimitOk(73) && address.isOkFor(73)) segment.report(73)
	  }
	  if (isDrivable)
		if (RT_RAMP === roadType) {
		  options = getCheckOptions(112, countryCode);
		  if (options[CO_NUMBER] < streetLen && isLimitOk(112) && address.isOkFor(112)) segment.report(112)
		} else {
		  options = getCheckOptions(52, countryCode);
		  if (options[CO_NUMBER] < streetLen && isLimitOk(52) && address.isOkFor(52)) segment.report(52)
		}
	}
	if (isRoundabout && isDrivable) {
	  if (streetLen && isLimitOk(29) && address.isOkFor(29)) segment.report(29);
	  if (DIR_TWO === direction && address.isOkFor(48)) segment.report(48);
	  if (!nodeA.$isPartial && 2 < nodeA.$otherSegmentsLen)
		if (2 < nodeA.$outConnectionsLen) {
		  if (address.isOkFor(87)) segment.report(87)
		} else if (address.isOkFor(74))
		  segment.report(74);
	  if (slowChecks && !isPartial && (DIR_AB === direction || DIR_BA === direction)) {
		var okA = false;
		var okB = false;
		var anode, bnode;
		if (DIR_AB === direction)
		  anode = nodeA, bnode = nodeB;
		else
		  anode = nodeB, bnode = nodeA;
		for (var i = 0; i < bnode.$outConnectionsLen; i++) {
		  var otherSegment = bnode.$outConnections[i];
		  if (otherSegment.$isRoundabout) {
			okB = true;
			break
		  }
		}
		if (okB)
		  for (var i = 0; i < anode.$inConnectionsLen; i++) {
			var otherSegment = anode.$inConnections[i];
			if (otherSegment.$isRoundabout) {
			  okA = true;
			  break
			}
		  }
		if ((!okB || !okA) && address.isOkFor(50)) segment.report(50)
	  }
	}
	HLObject(rawSegment)
  }
  if (!_UI.pMain.pFilter.oExcludeVenues.CHECKED)
	for (var venueKey in WMo.venues.objects) {
	  var rawVenue = WMo.venues.objects[venueKey];
	  var venueID = rawVenue.getID();
	  if (rawVenue.layer && rawVenue.id in rawVenue.layer.unrenderedFeatures) continue;
	  if ('Delete' === rawVenue.state) continue;
	  if (rawVenue.outOfScope) continue;
	  var seen = null;
	  if (venueID in _RT.$seen) seen = _RT.$seen[venueID];
	  if (rawVenue.selected) {
		selectedObjects.push(venueID);
		_RT.$revalidate[venueID] = true;
		if (seen) {
		  deleteSeenObject(venueID);
		  seen = null
		}
	  } else if (segmentID in _RT.$revalidate) {
		deleteSeenObject(venueID);
		seen = null;
		delete _RT.$revalidate[segmentID]
	  }
	  if (seen) {
		HLObject(rawVenue);
		continue
	  }
	  var venue = new SimpleOBJECT(venueID, WMo.venues);
	  Object.seal(venue);
	  _RT.$seen[venueID] = seen = [0, null, false, false, 4 > currentZoom, cityID];
	  venue.incCityCounter();
	  var address = venue.$address;
	  var country = address.$country;
	  var countryLen = country.length;
	  var countryCode = country ? _I18n.getCountryCode(country.toUpperCase()) : _RT.$cachedTopCCode;
	  var city = address.$city;
	  var cityLen = city.length;
	  var cityID = address.$cityID;
	  var street = address.$street;
	  var streetLen = street.length;
	  var state = address.$state;
	  var streetLen = street.length;
	  var alts = venue.$alts;
	  var lock = venue.$lock;
	  var exceptedCategories = 'NATURAL_FEATURES|BRIDGE|ISLAND|FOREST_GROVE|SEA_LAKE_POOL|RIVER_STREAM|CANAL|DAM|TUNNEL|JUNCTION_INTERCHANGE'.split('|');
	  if (!cityLen && exceptedCategories.indexOf(venue.$categories[0]) === -1 && isLimitOk(250)) venue.report(250);
	  if (!streetLen && exceptedCategories.indexOf(venue.$categories[0]) === -1 && isLimitOk(268)) venue.report(268);
	  if (!venue.$name.length)
		if (venue.$categories[0] === 'PARK' && !cityLen && isLimitOk(258)) venue.report(258);
	  if (venue.$categories.indexOf('OTHER') > -1 && isLimitOk(261)) venue.report(261);
	  options = getCheckOptions(251, countryCode);
	  if (options[CO_REGEXP].test(venue.$updatedByID.toString()) || options[CO_REGEXP].test(venue.$updatedBy.toString()) && isLimitOk(251)) venue.report(251);
	  if (venue.$rawObject.isParkingLot()) {
		var catAttr = venue.$categoryAttributes;
		var parkAttr = catAttr ? catAttr.PARKING_LOT : undefined;
		if ((!parkAttr || !parkAttr.parkingType) && address.isOkFor(252)) venue.report(252);
		if ((!parkAttr || !parkAttr.costType || parkAttr.costType === 'UNKNOWN') && address.isOkFor(253)) venue.report(253);
		if (parkAttr && (parkAttr.costType && parkAttr.costType !== 'FREE' && parkAttr.costType !== 'UNKNOWN' && (!parkAttr.paymentType || !parkAttr.paymentType.length)) && address.isOkFor(254))
		  venue.report(254);
		if ((!parkAttr || !parkAttr.lotType || parkAttr.lotType.length === 0) && address.isOkFor(255)) venue.report(255);
		if ((!venue.$entryExitPoints || !venue.$entryExitPoints.length) && address.isOkFor(257)) venue.report(257)
	  }
	  if (venue.$rawObject.isGasStation()) {
		if (venue.$name.toLowerCase().indexOf(venue.$brand.toLowerCase()) === -1 && address.isOkFor(259)) venue.report(259);
		options = getCheckOptions(260, countryCode);
		if (options[CO_NUMBER] > lock && address.isOkFor(260)) venue.report(260)
	  }
	  if (venue.$entryExitPoints && venue.$entryExitPoints.length) {
		var stopPoint = venue.$entryExitPoints[0].getPoint();
		var areaCenter = venue.$geometry.getCentroid();
		if (stopPoint.equals(areaCenter) && address.isOkFor(256)) venue.report(256)
	  }
	  options = getCheckOptions(262, countryCode);
	  if (venue.$phone && !options[CO_REGEXP].test(venue.$phone) && isLimitOk(262)) venue.report(262);
	  options = getCheckOptions(263, countryCode);
	  if (venue.$url && !options[CO_REGEXP].test(venue.$url) && isLimitOk(263)) venue.report(263);
	  if (venue.$isPoint) {
		options = getCheckOptions(264, countryCode);
		if (options[CO_REGEXP].test(venue.$categories[0]) && address.isOkFor(264)) venue.report(264)
	  } else {
		options = getCheckOptions(265, countryCode);
		if (options[CO_REGEXP].test(venue.$categories[0]) && address.isOkFor(265)) venue.report(265)
	  }
	  options = getCheckOptions(266, countryCode);
	  if (options[CO_REGEXP].test(venue.$categories[0]) && options[CO_NUMBER] > lock && address.isOkFor(266)) venue.report(266);
	  options = getCheckOptions(267, countryCode);
	  if (options[CO_REGEXP].test(venue.$categories[0]) && options[CO_NUMBER] > lock && address.isOkFor(267)) venue.report(267)
	}
  if (bUpdateMaxSeverity && (RTStateIs(ST_STOP) || RTStateIs(ST_PAUSE))) async(F_SHOWREPORT, RF_UPDATEMAXSEVERITY);
  updateObjectProperties(selectedObjects, false);
  addHLedObjects()
};
function F_LOGIN() {
  log('login ' + WLM.user.userName);
  _WV.parseAccessList = function(s) {
	var a = s.split(/\s*,\s*/);
	var res = [];
	a.forEach(function(r, i) {
	  var n = false;
	  if ('!' === r.charAt(0)) n = true, r = r.slice(1);
	  res[i] = { $id: r, $not: n }
	});
	return res
  };
  _WV.checkAccessFor = function(forStr, cmpFunc) {
	if (!forStr) return true;
	var l = _WV.parseAccessList(forStr);
	if (!l.length) return true;
	for (var i = 0; i < l.length; i++) {
	  var r = l[i];
	  if ('*' === r.$id || cmpFunc(r.$id))
		if (r.$not)
		  return false;
		else
		  return true
	}
	return false
  };
  function mirrorChecks(defTranslation) {
	var allLabels = _RT.$otherLabels.concat(_RT.$textLabels);
	for (var i = CK_MIRRORFIRST; i <= CK_MIRRORLAST; i++)
	  allLabels.forEach(function(l) {
		var label = i + '.' + l;
		if (!(label in defTranslation)) return;
		var value = defTranslation[label];
		var mLabel = i + 100 + '.' + l;
		switch (l) {
		  case 'title':
		  case 'problem':
		  case 'solution':
			defTranslation[mLabel] = value.replace(/ A($|\b)/g, ' B');
			break;
		  case 'params':
			defTranslation[mLabel] = deepCopy(value);
			break;
		  default:
			defTranslation[mLabel] = value;
			break
		}
	  })
  }
  _RT = {
	$textLabels: ['title', 'problem', 'solution'],
	$otherLabels: ['enabled', 'color', 'severity', 'reportOnly', 'params', 'problemLink', 'solutionLink'],
	$curMaxSeverity: RS_ERROR,
	$RegExp1: '',
	$RegExp2: '',
	oReportWMECH: {FORID: '_cbHighlightLocked', CHECKED: false, NA: true},
	oReportToolbox: {FORID: 'WMETB_NavBar', CHECKED: false, NA: true},
	$isMapChanged: false,
	$lng: I18n.locale.toUpperCase(),
	$includeUpdatedByCache: {},
	$includeUpdatedSinceTime: 0,
	$includeCityNameCache: {},
	$includeChecksCache: {},
	$switchValidator: false,
	$HLlayer: null,
	$HLedObjects: {},
	$HLedVenues: {},
	$isGlobalAccess: false,
	$timer: {$secInRun: 0, $lastUpdate: 0},
	$curMessage: {TEXT: '', TITLE: '', CLASS: CL_MSG},
	$topCity: null,
	$cachedTopCCode: '',
	$topUser: {
	  $userID: WLM.user.id,
	  $userName: WLM.user.userName,
	  $userLevel: WLM.user.normalizedLevel,
	  $isCM: WLM.user.editableCountryIDs ? 0 !== WLM.user.editableCountryIDs.length : false,
	  $countryIDs: WLM.user.editableCountryIDs ? WLM.user.editableCountryIDs : []
	},
	$topCenter: null,
	$WDmoveID: -1,
	$WDloadID: -1,
	$layersVisibility: '',
	$state: ST_STOP,
	$direction: DIR_L2R,
	$firstStep: true,
	$startExtent: null,
	$startCenter: null,
	$startZoom: null,
	$nextCenter: null,
	$moveEndCenter: null,
	$seen: {},
	$seenVenues: {},
	$revalidate: {},
	$revalidateVenues: {},
	$curUserName: WLM.user.userName,
	$error: false,
	$reportEditableNotFound: false,
	$checks: {},
	$sortedCheckIDs: null,
	$WMECHcolors: {},
	$untranslatedLngs: ['IT']
  };
  _RT.$checks = {
	'0': {
	  SEVERITY: RS_MAX,
	  REPORTONLY: false,
	  TITLE: 'Global access list to test before any of the checks below',
	  FORCOUNTRY: GA_FORCOUNTRY,
	  FORCITY: GA_FORCITY,
	  FORUSER: GA_FORUSER,
	  FORLEVEL: GA_FORLEVEL,
	  OPTIONS: {},
	  COLOR: '',
	  PROBLEM: '',
	  PROBLEMLINK: '',
	  PROBLEMLINKTEXT: '',
	  SOLUTION: '',
	  SOLUTIONLINK: '',
	  SOLUTIONLINKTEXT: ''
	}
  };
  _I18n.init({$lng: _RT.$lng});
  var defTranslation = _translations[_I18n.$defLng];
  var defTBProblem = 'The segment is highlighted by WME Toolbox. It is not a problem';
  var defTBProblemLink = 'W:Community_Plugins,_Extensions_and_Tools#WME_Toolbox';
  var TBchecks = [
	[
	  '#3030FF', 'W', , 'Roundabout which may cause issues', 'Junction IDs of the roundabout segments are not consecutive', '', 'Redo the roundabout',
	  'W:Creating_and_Editing_a_roundabout#Improving_manually_drawn_roundabouts'
	],
	[
	  '#FF30FF', , , 'Simple segment', 'The segment has unneeded geometry nodes', , 'Simplify segment geometry by hovering mouse pointer and pressing "d" key',
	  'W:Creating_and_Editing_street_segments#Adjusting_road_geometry_.28nodes.29'
	],
	['#11F247', , true, 'Lvl 2 lock'], ['#71F211', , true, 'Lvl 3 lock'], ['#E2F211', , true, 'Lvl 4 lock'], ['#F29011', , true, 'Lvl 5 lock'], ['#F22011', , true, 'Lvl 6 lock'],
	['#00A8FF', , true, 'House numbers'], ['#F7B020', , true, 'Segment with time restrictions']
  ];
  for (var i = CK_TBFIRST; i <= CK_TBLAST; i++) {
	var cc = TBchecks[i - CK_TBFIRST];
	var cp = cc[4] || defTBProblem;
	var cpl = cc[5];
	if (!classCodeDefined(cpl)) cpl = defTBProblemLink;
	defTranslation[i + '.enabled'] = true;
	defTranslation[i + '.color'] = cc[0];
	if (cc[1]) defTranslation[i + '.severity'] = cc[1];
	if (cc[2]) defTranslation[i + '.reportOnly'] = cc[2];
	defTranslation[i + '.title'] = 'WME Toolbox: ' + cc[3];
	defTranslation[i + '.problem'] = cp;
	if (cpl) defTranslation[i + '.problemLink'] = cpl;
	if (cc[6]) defTranslation[i + '.solution'] = cc[6];
	if (cc[7]) defTranslation[i + '.solutionLink'] = cc[7]
  }
  var defWMECHProblem = 'The segment is highlighted by WME Color Highlights. It is not a problem';
  var defWMECHProblemLink = 'W:Community_Plugins,_Extensions_and_Tools#WME_Color_Highlights_.28WMECH.29';
  var WMECHchecks = [
	['#000000', , true, 'Editor lock'], ['#0000FF', , true, 'Toll road / One way road'], ['#00FF00', , true, 'Recently edited'], ['#880000', , true, 'Road rank'], ['#888888', , true, 'No city'],
	['#990099', , true, 'Time restriction / Highlighted road type'], ['#FFBB00', , true, 'No name'], ['#FFFF00', , true, 'Filter by city'], ['#FFFF01', , true, 'Filter by city (alt. city)'],
	['#00FF00', , true, 'Filter by editor']
  ];
  for (var i = CK_WMECHFIRST; i <= CK_WMECHLAST; i++) {
	var cc = WMECHchecks[i - CK_WMECHFIRST];
	var cp = defWMECHProblem;
	var cpl = defWMECHProblemLink;
	defTranslation[i + '.enabled'] = true;
	defTranslation[i + '.color'] = cc[0];
	if (cc[1]) defTranslation[i + '.severity'] = cc[1];
	if (cc[2]) defTranslation[i + '.reportOnly'] = cc[2];
	defTranslation[i + '.title'] = 'WME Color Highlights: ' + cc[3];
	defTranslation[i + '.problem'] = cp;
	if (cpl) defTranslation[i + '.problemLink'] = cpl
  }
  var streetNames = ['Freeway', 'Major Highway', 'Minor Highway', 'Ramp', 'Primary Street', 'Street', 'Parking Lot Road', 'Railroad'];
  for (var i = CK_TYPEFIRST; i <= CK_TYPELAST; i++) {
	var streetName = streetNames[i - CK_TYPEFIRST];
	defTranslation[i + '.severity'] = 'W';
	defTranslation[i + '.title'] = 'Must be a ' + streetName;
	defTranslation[i + '.problem'] = 'This segment must be a ' + streetName;
	defTranslation[i + '.solution'] = 'Set the road type to ' + streetName + ' or change the road name'
  }
  for (var i = CK_CUSTOMFIRST; i <= CK_CUSTOMLAST; i++) {
	defTranslation[i + '.title'] = 'Custom check';
	defTranslation[i + '.severity'] = 'W';
	defTranslation[i + '.problem'] = 'The segment matched custom conditions';
	defTranslation[i + '.solution'] = 'Solve the issue';
	defTranslation[i + '.params'] = {
	  'template.title': '{string} expandable template',
	  'template': '${street}',
	  'regexp.title': '{string} regular expression to match the template',
	  'regexp': '!/.+/',
	  'titleEN.title': '{string} check title in English',
	  'titleEN': '',
	  'problemEN.title': '{string} problem description in English',
	  'problemEN': '',
	  'solutionEN.title': '{string} solution instructions in English',
	  'solutionEN': ''
	}
  }
  var lockLevels = {150: 5, 151: 4, 152: 3, 153: 4, 154: 2};
  for (var i = CK_LOCKFIRST; i <= CK_LOCKLAST; i++) {
	var lockName = streetNames[i - CK_LOCKFIRST];
	var lockLevel = lockLevels[i];
	defTranslation[i + '.title'] = 'No lock on ' + lockName;
	defTranslation[i + '.problem'] = 'The ' + lockName + ' segment should be locked at least to Lvl ${n}';
	defTranslation[i + '.solution'] = 'Lock the segment';
	defTranslation[i + '.params'] = { 'n.title': '{number} minimum lock level', 'n': lockLevel }
  }
  var streetRegExps = {160: '!/^[AS][0-9]{1,2}/', 161: '!/^[0-9]{1,2}/', 162: '!/^[0-9]{1,3}/', 163: '!/^[AS]?[0-9]* ?> /'};
  var streetDefRegExp = '!/.?/';
  for (var i = CK_STREETTNFIRST; i <= CK_STREETTNLAST; i++) {
	var streetName = streetNames[i - CK_STREETTNFIRST];
	var streetRegExp = streetRegExps[CK_STREETTNFIRST] || streetDefRegExp;
	if (i < 165 || i > 167) defTranslation[i + '.severity'] = 'W';
	defTranslation[i + '.title'] = 'Incorrect ' + streetName + ' name';
	defTranslation[i + '.problem'] = 'The ' + streetName + ' segment has incorrect street name';
	defTranslation[i + '.solution'] = 'Rename the segment in accordance with the guidelines';
	defTranslation[i + '.params'] = { 'regexp.title': '{string} regular expression to match incorrect ' + streetName + ' name', 'regexp': streetRegExp }
  }
  mirrorChecks(defTranslation);
  var listOfIntPacks = '';
  for (var translationsKey in _translations) {
	var translation = _translations[translationsKey];
	mirrorChecks(translation);
	_I18n.addTranslation(translation);
	var country = translation['.country'];
	if (!country) continue;
	if (classCodeIs(country, CC_ARRAY)) country = country[0];
	country = country.split(' ').join('&nbsp;');
	if (listOfIntPacks) listOfIntPacks += ', ';
	if ('.lng' in translation)
	  listOfIntPacks += '<b>' + country + '*';
	else
	  listOfIntPacks += country;
	if ('.author' in translation) listOfIntPacks += ' by&nbsp;' + translation['.author'];
	if ('.lng' in translation) listOfIntPacks += '</b>';
	if ('.updated' in translation) listOfIntPacks += ' (' + translation['.updated'] + ')'
  }
  listOfIntPacks += '.';
  listOfIntPacks += '<br>* localization pack with translations';
  var listOfPacks = '';
  for (var gObject in window) {
	if (!window.hasOwnProperty(gObject)) continue;
	if (-1 !== gObject.indexOf('WME_Validator')) {
	  var translation = window[gObject];
	  log('found localization pack: ' + gObject.replace('WME_Validator_', ''));
	  mirrorChecks(translation);
	  _I18n.addTranslation(translation);
	  if ('.country' in translation) {
		var country = translation['.country'];
		if (classCodeIs(country, CC_ARRAY)) country = country[0];
		listOfPacks += '<b>' + country;
		if ('.author' in translation) listOfPacks += ' by&nbsp;' + translation['.author'];
		listOfPacks += '</b>';
		if (!('.lng' in translation)) listOfPacks += '<br>(does not include translations)';
		if ('.updated' in translation) {
		  listOfPacks += '<br>Updated: ' + translation['.updated'];
		  if ('.link' in translation && translation['.link']) listOfPacks += ' <a target="_blank" href="' + translation['.link'] + '">check&nbsp;for&nbsp;updates</a>'
		}
		listOfPacks += '<br>'
	  }
	}
  }
  listOfPacks = listOfPacks ? listOfPacks : 'No external localization packs found';
  listOfPacks += '<br><b>See</b> <a target="_blank" href="' + PFX_FORUM + FORUM_LOCAL + '">' +
	  'how to create a localization pack</a>';
  for (var i = 1; i < MAX_CHECKS; i++) {
	var check = {ENABLED: {}, PROBLEMLINK: {}, PROBLEMLINKTEXT: {}, SOLUTIONLINK: {}, SOLUTIONLINKTEXT: {}};
	var label = i + '.title';
	if (!_I18n.isLabelExist(label)) continue;
	check.TITLE = trS(label);
	label = i + '.color';
	if (_I18n.isLabelExist(label)) {
	  var col = trS(label).toUpperCase();
	  check.COLOR = col;
	  if (CK_WMECHFIRST <= i && CK_WMECHLAST >= i) _RT.$WMECHcolors[col] = true
	}
	label = i + '.problem';
	if (_I18n.isLabelExist(label)) check.PROBLEM = trS(label);
	label = i + '.solution';
	if (_I18n.isLabelExist(label)) check.SOLUTION = trS(label);
	label = i + '.reportOnly';
	if (_I18n.isLabelExist(label)) check.REPORTONLY = trS(label);
	label = i + '.severity';
	var s = 'N';
	if (_I18n.isLabelExist(label)) s = trS(label);
	if (s) switch (s.charAt(0)) {
		case 'w':
		case 'W':
		  check.SEVERITY = RS_WARNING;
		  break;
		case 'e':
		case 'E':
		  check.SEVERITY = RS_ERROR;
		  break;
		case '1':
		  check.SEVERITY = RS_CUSTOM1;
		  break;
		case '2':
		  check.SEVERITY = RS_CUSTOM2;
		  break;
		default:
		  check.SEVERITY = RS_NOTE;
		  break
	  }
	else
	  check.SEVERITY = RS_NOTE;
	label = i + '.enabled';
	var labelP = i + '.params';
	var labelPL = i + '.problemLink';
	var labelSL = i + '.solutionLink';
	var defEnabled = false;
	var arrCodes = [];
	for (var ccode in _I18n.$translations) {
	  var translation = _I18n.$translations[ccode];
	  if (label in translation) {
		var e = translation[label];
		check.ENABLED[ccode] = e;
		if (_I18n.$defLng === ccode) {
		  if (e) defEnabled = true
		} else if (e)
		  arrCodes.push(ccode);
		else
		  arrCodes.push('!' + ccode)
	  }
	  if (labelPL in translation) {
		var l = translation[labelPL].replace('W:', PFX_WIKI).replace('P:', PFX_PEDIA).replace('F:', PFX_FORUM);
		check.PROBLEMLINK[ccode] = encodeURI(l);
		if (-1 !== l.indexOf(PFX_WIKI) || -1 !== l.indexOf(PFX_PEDIA))
		  check.PROBLEMLINKTEXT[ccode] = trS('report.link.wiki');
		else if (-1 !== l.indexOf(PFX_FORUM))
		  check.PROBLEMLINKTEXT[ccode] = trS('report.link.forum');
		else
		  check.PROBLEMLINKTEXT[ccode] = trS('report.link.other')
	  }
	  if (labelSL in translation) {
		var l = translation[labelSL].replace('W:', PFX_WIKI).replace('P:', PFX_PEDIA).replace('F:', PFX_FORUM);
		check.SOLUTIONLINK[ccode] = encodeURI(l);
		if (-1 !== l.indexOf(PFX_WIKI || -1 !== l.indexOf(PFX_PEDIA)))
		  check.SOLUTIONLINKTEXT[ccode] = trS('report.link.wiki');
		else if (-1 !== l.indexOf(PFX_FORUM))
		  check.SOLUTIONLINKTEXT[ccode] = trS('report.link.forum');
		else
		  check.SOLUTIONLINKTEXT[ccode] = trS('report.link.other')
	  }
	  if (labelP in translation) {
		var params = translation[labelP];
		if (!check.OPTIONS) check.OPTIONS = {};
		if (!(ccode in check.OPTIONS)) check.OPTIONS[ccode] = params;
		if (params['template']) check.OPTIONS[ccode][CO_STRING] = params['template'];
		if (params['regexp']) _WV.buildRegExp(i, check.OPTIONS[ccode], params['regexp']);
		if (params['n']) check.OPTIONS[ccode][CO_NUMBER] = +params['n']
	  }
	}
	if (defEnabled) {
	  if (arrCodes.length) check.FORCOUNTRY = arrCodes.join(',') + ',*'
	} else if (arrCodes.length)
	  check.FORCOUNTRY = arrCodes.join(',');
	else
	  check.FORCOUNTRY = '!*';
	_RT.$checks[i] = check
  }
  var dir = _I18n.getDir();
  var dirLeft = trLeft(dir);
  var dirRight = trRight(dir);
  var cssRules, cssRules2, cssRulesA = '>a{text-decoration:underline;cursor:pointer;pointer-events:auto}';
  _THUI.addElemetClassStyle('div', CL_TABS, '{border-bottom:2px solid #ddd;height:29px}');
  _THUI.addElemetClassStyle('div', CL_TABS, '>input{display:none}');
  _THUI.addElemetClassStyle(
	  'div', CL_TABS,
	  '>label{white-space:nowrap;overflow:hidden;max-width:100px;text-overflow:ellipsis;cursor:pointer;display:inline-block;margin:0px;margin-' + dirRight +
		  ':3px;padding:4px 12px;border-radius:4px 4px 0 0;background-color:#dadbdc}');
  _THUI.addElemetClassStyle(
	  'div', CL_TABS,
	  '>input:checked+label{font-weight:normal;margin:-2px;min-height:31px;margin-' + dirRight + ':2px;cursor:default;border:2px solid #ddd;border-bottom-color:#fff;background-color:#fff}');
  _THUI.addElemetClassStyle('div', CL_TABS, '>input:disabled+label{font-weight:bold !important;padding-' + dirLeft + ':0px;color:#333;cursor:default;background-color:transparent}');
  _THUI.addElemetClassStyle('div', CL_TABS, '>input:enabled+label:hover{background-color:#fff}');
  _THUI.addElemetClassStyle('div', CL_TABS, '>input:checked+label:hover{background-color:#fff}');
  _THUI.addElemetClassStyle('div', CL_TABS, '>input:enabled+label>span>span.c' + CL_COLLAPSE + '{display:none}');
  _THUI.addElemetClassStyle('div', CL_TABS, '>input:checked+label>span>span.c' + CL_COLLAPSE + '{display:inline}');
  _THUI.addElemetClassStyle(
	  'div', CL_PANEL,
	  '{background-color:#fff;padding:4px;margin:0;margin-bottom:4px;border-bottom:2px solid #ddd;white-space:nowrap;overflow-x:hidden;overflow-y:auto;text-overflow:ellipsis;width:100%;height:' +
		  SZ_PANEL_HEIGHT + 'px}');
  _THUI.addElemetClassStyle('div', CL_PANEL, '>span' + cssRulesA);
  _THUI.addElemetClassStyle('div', CL_PANEL, '>label>span' + cssRulesA);
  _THUI.addElemetClassStyle('div', CL_PANEL, '>span>p' + cssRulesA);
  cssRules = '>span{border-radius:5px;background-color:';
  _THUI.addElemetClassStyle('label', 'c1', cssRules + GL_CUSTOM1COLOR + ';color:' + GL_CUSTOM1BGCOLOR + '}');
  _THUI.addElemetClassStyle('label', 'c2', cssRules + GL_CUSTOM2COLOR + ';color:' + GL_CUSTOM2BGCOLOR + '}');
  cssRules = '>span>a{color:white}';
  _THUI.addElemetClassStyle('label', 'c1', cssRules);
  _THUI.addElemetClassStyle('label', 'c2', cssRules);
  _THUI.addElemetClassStyle('div', CL_BUTTONS, '{overflow:hidden;margin-bottom:1em}');
  _THUI.addElemetClassStyle('div', CL_BUTTONS, '>button{font-weight:normal;padding:4px 12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}');
  _THUI.addElemetClassStyle('div', CL_BUTTONS, '>button>i{pointer-events:none}');
  _THUI.addElemetClassStyle('div', CL_BUTTONS, '>button:disabled{background-color:#eee;border-bottom:0px;cursor:default;pointer-events:auto}');
  _THUI.addElemetClassStyle('div', CL_PANEL, '>label.checkbox{display:block;height:24px;font-weight:normal;margin:0}');
  _THUI.addElemetClassStyle('div', CL_PANEL, '>label.checkbox>span{display:inline-block;height:20px;width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}');
  _THUI.addElemetClassStyle('div', CL_PANEL, '>label.date{display:block;height:32px;font-weight:normal;margin:0;padding-' + dirRight + ':155px}');
  _THUI.addElemetClassStyle('div', CL_PANEL, '>label.date>span{display:inline-block;line-height:28px;vertical-align:middle;width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}');
  _THUI.addElemetClassStyle(
	  'div', CL_PANEL,
	  '>label.date>input[type=date]{box-sizing:border-box;height:28px;padding:2px 10px;padding-' + dirRight + ':2px;float:' + dirRight + ';margin-' + dirRight + ':-155px;width:150px}');
  _THUI.addElemetClassStyle('div', CL_PANEL, '>label.text{display:block;height:30px;font-weight:normal;margin:0;padding-' + dirRight + ':155px}');
  _THUI.addElemetClassStyle('div', CL_PANEL, '>label.text>span{display:inline-block;line-height:28px;vertical-align:middle;width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}');
  _THUI.addElemetClassStyle('div', CL_PANEL, '>label.text>input[type=text]{box-sizing:border-box;height:28px;padding:2px 10px;float:' + dirRight + ';margin-' + dirRight + ':-155px;width:150px}');
  cssRules = '{position:relative;height:2em;width:100%;margin-bottom:';
  cssRules2 = '>span{position:absolute;' + dirLeft + ':0;bottom:0;display:inline-block;padding:4px 12px;margin:0px;border-radius:8px;border-bottom-' + dirLeft +
	  '-radius:0;box-shadow:3px 3px 3px #aaa;border:1px solid ';
  _THUI.addElemetClassStyle('div', CL_TRANSLATETIP, cssRules + '12px}');
  _THUI.addElemetClassStyle('div', CL_TRANSLATETIP, cssRules2 + '#aea;background-color:#cfc;' + dirLeft + ':auto;' + dirRight + ':0;border-radius:8px;border-bottom-' + dirRight + '-radius:0}');
  _THUI.addElemetClassStyle('div', CL_TRANSLATETIP, '>span' + cssRulesA);
  _THUI.addElemetClassStyle('div', CL_MSG, cssRules + '1em}');
  _THUI.addElemetClassStyle('div', CL_MSG, cssRules2 + '#ded;background-color:#efe}');
  _THUI.addElemetClassStyle('div', CL_MSGY, cssRules + '1em}');
  _THUI.addElemetClassStyle('div', CL_MSGY, cssRules2 + '#ee9;background-color:#ffa}');
  _THUI.addElemetIdStyle('div', ID_PROPERTY, '{padding-bottom:5px}');
  _THUI.addElemetIdStyle('div', ID_PROPERTY, '>b' + cssRulesA);
  cssRules = '{color:' + GL_NOTECOLOR + '}';
  _THUI.addElemetClassStyle('div', CL_NOTE, cssRules);
  _THUI.addElemetClassStyle('a', CL_NOTE, cssRules);
  cssRules = '{color:' + GL_WARNINGCOLOR + '}';
  _THUI.addElemetClassStyle('div', CL_WARNING, cssRules);
  _THUI.addElemetClassStyle('a', CL_WARNING, cssRules);
  cssRules = '{color:' + GL_ERRORCOLOR + '}';
  _THUI.addElemetClassStyle('div', CL_ERROR, cssRules);
  _THUI.addElemetClassStyle('a', CL_ERROR, cssRules);
  cssRules = '{color:' + GL_CUSTOM1COLOR + '}';
  _THUI.addElemetClassStyle('div', CL_CUSTOM1, cssRules);
  _THUI.addElemetClassStyle('a', CL_CUSTOM1, cssRules);
  cssRules = '{color:' + GL_CUSTOM2COLOR + '}';
  _THUI.addElemetClassStyle('div', CL_CUSTOM2, cssRules);
  _THUI.addElemetClassStyle('a', CL_CUSTOM2, cssRules);
  _THUI.addElemetClassStyle('div', CL_RIGHTTIP, '{white-space:nowrap;position:relative;cursor:help}');
  _THUI.addElemetClassStyle('div', CL_RIGHTTIP, '>span{display:inline-block;overflow:hidden;text-overflow:ellipsis;width:279px}');
  _THUI.addElemetClassStyle('div', CL_RIGHTTIP, '>span' + cssRulesA);
  cssRules = ';z-index:1000000;position:absolute;visibility:hidden;opacity:0;transition:0.1s ease;' + dirLeft + ':30px;top:-1.7em;cursor:default}';
  _THUI.addElemetClassStyle(
	  'div', CL_RIGHTTIP, ':before{content:"";position:absolute;border:1em solid transparent;border-' + dirRight + '-color:#ddd;margin-' + dirLeft + ':-2em;margin-top:1.5em' + cssRules);
  _THUI.addElemetClassStyle(
	  'div', CL_RIGHTTIPPOPUP, '{white-space:normal;background-color:#fafafa;padding:1em;width:230px;box-shadow:3px 3px 3px #aaa;border-radius:1em;border:1px solid #ddd' + cssRules);
  _THUI.addElemetClassStyle('div', CL_RIGHTTIPDESCR, '{margin-' + dirLeft + ':2em}');
  _THUI.addElemetClassStyle('div', CL_RIGHTTIPDESCR, cssRulesA);
  _THUI.addElemetClassStyle('div', CL_RIGHTTIPDESCR, '>p{color:black;margin-top:0.5em;margin-bottom:0.5em !important}');
  _THUI.addElemetClassStyle('div', CL_RIGHTTIPDESCR, '>p' + cssRulesA);
  cssRules = '{visibility:visible;opacity:1}';
  _THUI.addElemetClassStyle('div', CL_RIGHTTIP, ':hover:before' + cssRules);
  _THUI.addElemetClassStyle('div', CL_RIGHTTIP, ':hover>div' + cssRules);
  _UI = {
	_DISABLED: undefined,
	_NODISPLAY: undefined,
	MAXLENGTH: undefined,
	REVERSE: undefined,
	WARNING: undefined,
	TYPE: undefined,
	FORUSER: undefined,
	FORCITY: undefined,
	FORCOUNTRY: undefined,
	FORLEVEL: undefined,
	ACCESSKEY: undefined,
	STYLEI: '',
	DISCLOSE: 0,
	_NAME: '',
	READONLY: 0,
	_STYLE: '',
	ONWARNING: null,
	ONCHANGE: null,
	_ONCHANGE: undefined,
	ONCLICKO: undefined,
	MIN: undefined,
	MAX: undefined,
	STEP: undefined,
	CLASS: CL_UI,
	_TYPE: _THUI.DIV,
	_ONWARNING: onWarning,
	pTips: {},
	pTranslateBanner: {
	  CLASS: CL_TRANSLATETIP,
	  TEXT: 'Please help to ' +
		  '<a target="_blank" href="' + PFX_FORUM + FORUM_LOCAL + '">' +
		  'translate Validator!</a>',
	  TITLE: trS('about.tip')
	},
	pNoAccess: {CLASS: CL_PANEL, NODISPLAY: 1, STYLE: 'text-align:center', TEXT: trS('noaccess.text'), TITLE: trS('noaccess.tip')},
	pMain: {
	  pTabs: {
		CLASS: CL_TABS,
		_DISCLOSE: 1,
		_TYPE: _THUI.RADIO,
		_ONCLICK: onUpdateUI,
		tMain: {TEXT: '', TITLE: '', DISABLED: 1, STYLEO: 'cursor:pointer;max-width:97px', ONCLICKO: onUpdateUI},
		tFilter: {
		  TEXT: '<i class="fa fa-filter" aria-hidden="true"></i>' +
			  '<span class=\'c' + CL_COLLAPSE + '\'> ' + trS('tab.filter.text') + '</span>',
		  TITLE: trS('tab.filter.tip'),
		  CHECKED: 1
		},
		tSearch: {
		  TEXT: '<i class="fa fa-search" aria-hidden="true"></i>' +
			  '<span class=\'c' + CL_COLLAPSE + '\'> ' + trS('tab.search.text') + '</span>',
		  TITLE: trS('tab.search.tip')
		},
		tHelp: {
		  TEXT: '<i class="fa fa-question-circle" aria-hidden="true"></i>' +
			  '<span class=\'c' + CL_COLLAPSE + '\'> ' + trS('tab.help.text') + '</span>',
		  TITLE: trS('tab.help.tip'),
		  STYLEO: 'float:' + dirRight
		}
	  },
	  pFilter: {
		CLASS: CL_PANEL,
		_CLASS: 'checkbox',
		_TYPE: _THUI.CHECKBOX,
		_REVERSE: 1,
		_ONCHANGE: onUpdateUI,
		oExcludeNonEditables: {TEXT: trS('filter.noneditables.text'), TITLE: trS('filter.noneditables.tip'), AUTOSAVE: AS_NONEDITABLES},
		oExcludeDuplicates: {TEXT: trS('filter.duplicates.text'), TITLE: trS('filter.duplicates.tip'), AUTOSAVE: AS_DUPLICATES},
		oExcludeVenues: {TEXT: trS('filter.venues.text'), TITLE: trS('filter.venues.tip'), AUTOSAVE: AS_VENUES},
		oExcludeStreets: {TEXT: trS('filter.streets.text'), TITLE: trS('filter.streets.tip'), AUTOSAVE: AS_STREETS},
		oExcludeOther: {TEXT: trS('filter.other.text'), TITLE: trS('filter.other.tip'), AUTOSAVE: AS_OTHERS},
		oExcludeNotes: {TEXT: trS('filter.notes.text'), TITLE: trS('filter.notes.tip'), AUTOSAVE: AS_NOTES}
	  },
	  pSearch: {
		CLASS: CL_PANEL,
		NODISPLAY: 1,
		_REVERSE: 1,
		_ONCHANGE: onUpdateUI,
		oIncludeYourEdits: {NODISPLAY: 1, TYPE: _THUI.CHECKBOX, TEXT: trS('search.youredits.text'), TITLE: trS('search.youredits.tip'), CLASS: 'checkbox', AUTOSAVE: AS_YOUREDITS},
		oIncludeUpdatedBy: {
		  TYPE: _THUI.TEXT,
		  TEXT: trS('search.updatedby.text'),
		  TITLE: trS('search.updatedby.tip'),
		  PLACEHOLDER: trS('search.updatedby.example'),
		  CLASS: 'form-label text',
		  CLASSI: 'form-control',
		  AUTOSAVE: AS_UPDATEDBY
		},
		oIncludeUpdatedSince: {
		  TYPE: _THUI.DATE,
		  TEXT: trS('search.updatedsince.text'),
		  TITLE: trS('search.updatedsince.tip'),
		  PLACEHOLDER: trS('search.updatedsince.example'),
		  CLASS: 'form-label date',
		  CLASSI: 'form-control',
		  AUTOSAVE: AS_UPDATEDSINCE
		},
		oIncludeCityName: {
		  TYPE: _THUI.TEXT,
		  TEXT: trS('search.city.text'),
		  TITLE: trS('search.city.tip'),
		  PLACEHOLDER: trS('search.city.example'),
		  CLASS: 'form-label text',
		  CLASSI: 'form-control',
		  AUTOSAVE: AS_CITYNAME
		},
		oIncludeChecks: {
		  TYPE: _THUI.TEXT,
		  TEXT: trS('search.checks.text'),
		  TITLE: trS('search.checks.tip'),
		  PLACEHOLDER: trS('search.checks.example'),
		  CLASS: 'form-label text',
		  CLASSI: 'form-control',
		  AUTOSAVE: AS_CHECKS
		}
	  },
	  pHelp: {CLASS: CL_PANEL, NODISPLAY: 1, TEXT: trS('help.text'), TITLE: trS('help.tip')},
	  pButtons: {
		CLASS: CL_BUTTONS,
		_CLASS: 'btn btn-default',
		_TYPE: _THUI.BUTTON,
		_ONCLICK: onUpdateUI,
		bScan: {TEXT: '', TITLE: '', STYLE: 'float:' + dirLeft + ';width:38px;font-family:FontAwesome'},
		bPause: {NODISPLAY: 1, TEXT: '', TITLE: trS('button.pause.tip'), STYLE: 'float:' + dirLeft + ';width:38px;font-family:FontAwesome'},
		bContinue: {TEXT: '', TITLE: trS('button.continue.tip'), NODISPLAY: 1, STYLE: 'float:' + dirLeft + ';width:38px;font-family:FontAwesome'},
		bStop: {TEXT: '', TITLE: trS('button.stop.tip'), STYLE: 'float:' + dirLeft + ';width:38px;font-family:FontAwesome;margin-' + dirRight + ':10px'},
		bClear: {TEXT: '✘', TITLE: '', NODISPLAY: 1, DISABLED: 1, STYLE: 'float:' + dirLeft + ';width:38px;margin-' + dirRight + ':10px'},
		bReport: {TEXT: trS('button.report.text'), TITLE: trS('button.report.tip'), STYLE: 'float:' + dirLeft + ';max-width:110px', ONCLICK: onShowReport},
		bReportBB: {TEXT: '', TITLE: trS('button.BBreport.tip'), ONCLICK: onShareReport, STYLE: 'float:' + dirLeft + ';width:38px;font-family:FontAwesome'},
		bSettings: {TEXT: '', TITLE: trS('button.settings.tip'), STYLE: 'float:' + dirRight + ';width:38px;font-family:FontAwesome'}
	  }
	},
	pSettings: {
	  NODISPLAY: 1,
	  pTabs: {
		CLASS: CL_TABS,
		_DISCLOSE: 1,
		_TYPE: _THUI.RADIO,
		_ONCLICK: onUpdateUI,
		tMain: {TEXT: trS('tab.settings.text') + ':', TITLE: 'WME Validator Version ' + WV_VERSION, STYLEO: 'max-width:85px', DISABLED: 1},
		tCustom: {
		  TEXT: '<i class="fa fa-user" aria-hidden="true"></i>' +
			  '<span class=\'c' + CL_COLLAPSE + '\'> ' + trS('tab.custom.text') + '</span>',
		  STYLEO: 'max-width:110px',
		  TITLE: trS('tab.custom.tip'),
		  CHECKED: 1
		},
		tScanner: {
		  TEXT: '<i class="fa fa-wrench" aria-hidden="true"></i>' +
			  '<span class=\'c' + CL_COLLAPSE + '\'> ' + trS('tab.scanner.text') + '</span>',
		  TITLE: trS('tab.scanner.tip'),
		  STYLEO: 'max-width:110px'
		},
		tAbout: {
		  TEXT: '<i class="fa fa-question-circle" aria-hidden="true"></i>' +
			  '<span class=\'c' + CL_COLLAPSE + '\'> ' + trS('tab.about.text') + '</span>',
		  TITLE: trS('tab.about.tip'),
		  STYLEO: 'float:' + dirRight + ';max-width:110px'
		}
	  },
	  pCustom: {
		CLASS: CL_PANEL,
		_CLASS: 'form-label text',
		_REVERSE: 1,
		_ONCHANGE: onUpdateUI,
		oTemplate1: {
		  TYPE: _THUI.TEXT,
		  TEXT: '&nbsp;' + trS('custom.template.text'),
		  TITLE: trS('custom.template.tip'),
		  PLACEHOLDER: trS('custom.template.example'),
		  CLASS: 'form-label text c1',
		  CLASSI: 'form-control',
		  AUTOSAVE: AS_CUSTOM1TEMPLATE
		},
		oRegExp1: {
		  TYPE: _THUI.TEXT,
		  TEXT: '&nbsp;' + trS('custom.regexp.text'),
		  TITLE: trS('custom.regexp.tip'),
		  PLACEHOLDER: trS('custom.regexp.example'),
		  CLASSI: 'form-control',
		  AUTOSAVE: AS_CUSTOM1REGEXP
		},
		oTemplate2: {
		  TYPE: _THUI.TEXT,
		  TEXT: '&nbsp;' + trS('custom.template.text'),
		  TITLE: trS('custom.template.tip'),
		  PLACEHOLDER: trS('custom.template.example'),
		  CLASS: 'form-label text c2',
		  CLASSI: 'form-control',
		  AUTOSAVE: AS_CUSTOM2TEMPLATE
		},
		oRegExp2: {
		  TYPE: _THUI.TEXT,
		  TEXT: '&nbsp;' + trS('custom.regexp.text'),
		  TITLE: trS('custom.regexp.tip'),
		  PLACEHOLDER: trS('custom.regexp.example'),
		  CLASSI: 'form-control',
		  AUTOSAVE: AS_CUSTOM2REGEXP
		}
	  },
	  pScanner: {
		NODISPLAY: 1,
		CLASS: CL_PANEL,
		_CLASS: 'checkbox',
		_TYPE: _THUI.CHECKBOX,
		_REVERSE: 1,
		_ONCHANGE: onUpdateUI,
		oSlowChecks: {TEXT: trS('scanner.slow.text'), TITLE: trS('scanner.slow.tip'), AUTOSAVE: AS_SLOWCHECKS},
		oReportExt: {TEXT: trS('scanner.ext.text'), TITLE: trS('scanner.ext.tip'), AUTOSAVE: AS_REPORTEXT},
		oHLReported: {TEXT: trS('scanner.highlight.text'), TITLE: trS('scanner.highlight.tip'), AUTOSAVE: AS_HLISSUES},
		oSounds: {TEXT: trS('scanner.sounds.text'), TITLE: trS('scanner.sounds.tip'), NATITLE: trS('scanner.sounds.NA'), AUTOSAVE: AS_SOUNDS}
	  },
	  pAbout: {
		CLASS: CL_PANEL,
		NODISPLAY: 1,
		TEXT: '<p><b>WME Validator</b>' +
			'<br>Version ' + WV_VERSION + ' <a target="_blank" href="' + PFX_FORUM + FORUM_HOME + '">check for updates</a>' +
			'<br>&copy; 2013-2018 Andriy Berestovskyy</p>' +
			'<p><b>Built-in localization packs for:</b><br>' + listOfIntPacks + '<p><b>External localization packs for:</b><br>' + listOfPacks + '</p>' +
			'<p><b>Special thanks to:</b><br>OyyoDams, Timbones, paulkok_my, petervdveen, MdSyah, sketch, AlanOfTheBerg, arbaot, Zniwek, orbitc, robindlc, fernandoanguita, BellHouse, vidalnit, Manzareck, gad_m, Zirland and <b>YOU!</b></p>',
		TITLE: trS('about.tip'),
		STYLE: 'direction:ltr;text-align:center;white-space:normal'
	  },
	  pButtons: {
		CLASS: CL_BUTTONS,
		_CLASS: 'btn btn-default',
		_TYPE: _THUI.BUTTON,
		_ONCLICK: onUpdateUI,
		bReset: {TEXT: '<i class="fa fa-undo" aria-hidden="true"></i> ' + trS('button.reset.text'), TITLE: trS('button.reset.tip'), STYLE: 'float:' + dirLeft + ';max-width:165px'},
		bList: {
		  NODISPLAY: 1,
		  TEXT: '<i class="fa fa-list" aria-hidden="true"></i> ' + trS('button.list.text'),
		  TITLE: trS('button.list.tip'),
		  STYLE: 'float:' + dirLeft + ';max-width:165px',
		  ONCLICK: onShowChecks
		},
		bWizard: {
		  NODISPLAY: 1,
		  TEXT: '<i class="fa fa-magic" aria-hidden="true"></i>',
		  TITLE: trS('button.wizard.tip'),
		  STYLE: 'float:' + dirLeft + ';margin-' + dirLeft + ':6px;width:38px',
		  ONCLICK: onCreatePack
		},
		bBack: {
		  TEXT: '<i class="fa fa-angle-double-' + dirLeft + '" aria-hidden="true"></i> ' + trS('button.back.text'),
		  TITLE: trS('button.back.tip'),
		  STYLE: 'float:' + dirRight + ';max-width:70px'
		}
	  }
	}
  };
  clearReport();
  if (_RT.$topUser.$isCM) {
	_UI.pMain.pSearch.oIncludeYourEdits.NODISPLAY = 1;
	_UI.pMain.pSearch.oIncludeUpdatedBy.NODISPLAY = 0
  } else {
	_UI.pMain.pSearch.oIncludeYourEdits.NODISPLAY = 0;
	_UI.pMain.pSearch.oIncludeUpdatedBy.NODISPLAY = 1
  }
  if (-1 !== _RT.$untranslatedLngs.indexOf(_RT.$lng.split('-')[0]))
	_UI.pTranslateBanner.NODISPLAY = 0;
  else
	_UI.pTranslateBanner.NODISPLAY = 1;
  if (!classCodeDefined(UW.AudioContext) && !classCodeDefined(UW.webkitAudioContext)) {
	_UI.pSettings.pScanner.oSounds.CHECKED = false;
	_UI.pSettings.pScanner.oSounds.NA = true
  }
  resetDefaults();
  var storageObj = null;
  var s = null;
  try {
	s = window.localStorage.getItem(AS_NAME);
	storageObj = s ? JSON.parse(s) : null;
	if (!(AS_PASSWORD in storageObj)) storageObj = null
  } catch (e) {
  }
  if (!storageObj || WV_LICENSE_VERSION !== storageObj[AS_LICENSE])
	if (!confirm(WV_LICENSE)) {
	  _UI = {};
	  WLM.events.un({'afterloginchanged': onLogin, 'login': onLogin});
	  return
	}
  var showWhatsNew = false;
  if (s && !storageObj) {
	warning('\nDue to the major changes in Validator, all filter options\nand settings have been RESET to their DEFAULTS.');
	showWhatsNew = true
  }
  if (storageObj && WV_VERSION !== storageObj[AS_VERSION]) showWhatsNew = true;
  if (showWhatsNew) info(WV_WHATSNEW);
  _THUI.loadValues(_UI, storageObj);
  var styleMap = new OpenLayers.StyleMap({strokeWidth: HL_WIDTH});
  var lookup = {};
  lookup[RS_NOTE] = {strokeColor: GL_NOTECOLOR, graphicZIndex: 10};
  lookup[RS_WARNING] = {strokeColor: GL_WARNINGCOLOR, graphicZIndex: 20};
  lookup[RS_ERROR] = {strokeColor: GL_ERRORCOLOR, graphicZIndex: 30};
  lookup[RS_CUSTOM2] = {strokeColor: GL_CUSTOM2COLOR, graphicZIndex: 40};
  lookup[RS_CUSTOM1] = {strokeColor: GL_CUSTOM1COLOR, graphicZIndex: 50};
  styleMap.addUniqueValueRules('default', 0, lookup);
  _RT.$HLlayer = new OpenLayers.Layer.Vector(GL_LAYERNAME, {
	uniqueName: GL_LAYERUNAME,
	shortcutKey: GL_LAYERSHORTCUT,
	accelerator: GL_LAYERACCEL,
	units: 'm',
	styleMap: styleMap,
	projection: new OpenLayers.Projection('EPSG:4326'),
	visibility: _UI.pSettings.pScanner.oHLReported.CHECKED
  });
  I18n.translations[I18n.currentLocale()].layers.name[GL_LAYERUNAME] = GL_LAYERNAME;
  _RT.$HLlayer.setOpacity(HL_OPACITY);
  WM.addLayer(_RT.$HLlayer);
  _RT.$HLlayer.setVisibility(_UI.pSettings.pScanner.oHLReported.CHECKED);
  WM.raiseLayer(_RT.$HLlayer, 99);
  $('#user-tabs ul')
	  .append(
		  '<li>' +
		  '<a data-toggle="tab" href="#sidepanel-' + ID_PREFIX + '">' +
		  '<span class="fa fa-check-square-o"></span>' +
		  ' Validator' +
		  '</a></li>');
  $('#user-tabs+div.tab-content').append('<div class="tab-pane" id="sidepanel-' + ID_PREFIX + '"></div>');
  _THUI.appendUI(document.getElementById('sidepanel-' + ID_PREFIX), _UI, 'i' + ID_PREFIX);
  async(F_UPDATEUI);
  async(ForceHLAllSegments, null, 700);
  WMo.events.on({'mergeend': onMergeEnd});
  WM.events.on({'moveend': onMoveEnd, 'zoomend': HLAllSegments, 'changelayer': onChangeLayer});
  WSM.events.on({'selectionchanged': ForceHLAllSegments});
  WC.events.on({'loadstart': onLoadStart});
  WMo.segments.on({'objectsadded': onSegmentsAdded, 'objectschanged': onSegmentsChanged, 'objectsremoved': onSegmentsRemoved});
  WMo.venues.on({'objectsadded': onVenuesAdded, 'objectschanged': onVenuesChanged, 'objectsremoved': onVenuesRemoved});
  WMo.nodes.on({'objectschanged': onNodesChanged, 'objectsremoved': onNodesRemoved})
};
function F_ONSEGMENTSCHANGED(e) {
  var changedNodes = [];
  for (var i = 0; i < e.length; i++) {
	var nodeIDs = [e[i].attributes.fromNodeID, e[i].attributes.toNodeID];
	for (var j = 0; j < nodeIDs.length; j++) {
	  var nodeID = nodeIDs[j];
	  if (!nodeID) continue;
	  var node = WMo.nodes.getObjectById(nodeID);
	  if (node) changedNodes.push(node)
	}
  }
  if (changedNodes.length) sync(F_ONNODESCHANGED, changedNodes)
}
function F_ONNODESCHANGED(e) {
  var reHL = false;
  for (var i = 0; i < e.length; i++) {
	var ids = e[i].attributes.segIDs;
	for (var j = 0; j < ids.length; j++) _RT.$revalidate[ids[j]] = true, reHL = true
  }
  if (reHL) HLAllSegments()
}
function F_ONVENUESCHANGED(e) {
  var reHL = false;
  for (var i = e.length - 1; i >= 0; i--) {
	var id = e[i].attributes.id;
	_RT.$revalidate[id] = true;
	reHL = true
  }
  if (reHL) HLAllSegments()
}
function F_ONCHANGELAYER(e) {
  if (-1 !== e.layer.id.indexOf(GL_TBPREFIX)) {
	if (!e.layer.visibility)
	  for (var segmentID in WMo.segments.objects) {
		if (!WMo.segments.objects.hasOwnProperty(segmentID)) continue;
		delete WMo.segments.objects[segmentID][GL_TBCOLOR]
	  }
	ForceHLAllSegments()
  } else if (GL_LAYERUNAME === e.layer.uniqueName && e.layer.visibility !== _UI.pSettings.pScanner.oHLReported.CHECKED) {
	_RT.$switchValidator = true;
	async(F_UPDATEUI)
  }
}
function F_ONMOVEEND() {
  var c = WM.getCenter();
  if (-1 === _RT.$WDmoveID && -1 === _RT.$WDloadID && c.equals(_RT.$nextCenter))
	_RT.$WDmoveID = window.setTimeout(onMergeEnd, WD_SHORT);
  else if (RTStateIs(ST_RUN) && !_RT.$firstStep && !c.equals(_RT.$nextCenter) && !c.equals(_RT.$startCenter)) {
	_RT.$curMessage = {TEXT: trS('msg.autopaused.text'), TITLE: trS('msg.autopaused.tip')};
	async(F_PAUSE)
  }
  _RT.$moveEndCenter = c
}
function F_ONLOADSTART() {
  var c = WM.getCenter();
  window.clearTimeout(_RT.$WDmoveID);
  if (-1 === _RT.$WDloadID && c.equals(_RT.$nextCenter)) _RT.$WDloadID = window.setTimeout(onMergeEnd, WD_LONG);
  _RT.$WDmoveID = -1
}
function F_LAYERSOFF() {
  _RT.$HLlayer.destroyFeatures();
  if (_RT.$layersVisibility || GL_SHOWLAYERS) return;
  WM.layers.forEach(function(el) {
	if (el.displayInLayerSwitcher && GL_LAYERUNAME !== el.uniqueName) {
	  if (el.getVisibility())
		_RT.$layersVisibility += 'T';
	  else
		_RT.$layersVisibility += 'F';
	  el.setVisibility(false)
	}
  })
}
function F_LAYERSON() {
  if (!_RT.$layersVisibility || GL_SHOWLAYERS) return;
  var j = 0;
  WM.layers.forEach(function(el) {
	if (el.displayInLayerSwitcher && GL_LAYERUNAME !== el.uniqueName)
	  if (_RT.$layersVisibility.length > j) {
		el.setVisibility('T' === _RT.$layersVisibility.charAt(j));
		j++
	  }
  });
  _RT.$layersVisibility = ''
}
function F_PAUSE() {
  if (!RTStateIs(ST_RUN)) return;
  beep(50, 'square');
  sync(F_SHOWREPORT, RF_UPDATEMAXSEVERITY);
  setRTState(ST_PAUSE);
  async(F_LAYERSON)
}
function F_STOP() {
  if (!RTStateIs(ST_STOP)) {
	beep(100, 'square');
	if (_RT.$startCenter) {
	  WM.panTo(_RT.$startCenter);
	  WM.zoomTo(_RT.$startZoom)
	}
	if (!_REP.$maxSeverity) _RT.$curMessage = { TEXT: trS('msg.noissues.text'), TITLE: trS('msg.noissues.tip') }
  }
  sync(F_SHOWREPORT, RF_UPDATEMAXSEVERITY);
  setRTState(ST_STOP);
  async(F_LAYERSON)
}
function F_ONMERGEEND() {
  var c = WM.getCenter();
  if (RTStateIs(ST_RUN) && _RT.$nextCenter && !c.equals(_RT.$nextCenter)) return;
  var e = WM.getExtent();
  var ew = e.getWidth();
  var eh = e.getHeight();
  var ew2 = ew / 2;
  var eh2 = eh / 2;
  var s = _RT.$startExtent;
  if (!s) s = new UW.OpenLayers.Bounds;
  var cx = c.lon;
  var cy = c.lat;
  var dir = Math.round(_RT.$direction / Math.abs(_RT.$direction));
  var sw = s.getWidth();
  var sh = s.getHeight();
  var kxMax = Math.ceil(sw / (ew * SCAN_STEP / 100));
  var stepX = sw / kxMax;
  var kyMax = Math.ceil(sh / (eh * SCAN_STEP / 100));
  var stepY = sh / kyMax;
  if (RTStateIs(ST_CONTINUE)) {
	if (_RT.$nextCenter) {
	  setRTState(ST_RUN);
	  WM.zoomTo(SCAN_ZOOM);
	  WM.panTo(_RT.$nextCenter);
	  clearWD();
	  return
	}
	async(F_ONRUN);
	return
  }
  if (!RTStateIs(ST_RUN)) {
	HLAllSegments();
	return
  }
  async(F_UPDATEUI);
  if (_RT.$firstStep) {
	_RT.$firstStep = false;
	var newX = s.left + ew2;
	var newY = s.top - eh2;
	_RT.$nextCenter = new UW.OpenLayers.LonLat(newX, newY);
	WM.zoomTo(SCAN_ZOOM);
	WM.panTo(_RT.$nextCenter);
	clearWD();
	return
  }
  sync(F_VALIDATE, false);
  var deltaX = Number.MAX_VALUE;
  var deltaY = Number.MAX_VALUE;
  var kx = 0;
  var ky = 0;
  for (var i = 0;; i++) {
	var x = s.left + ew2 + i * stepX;
	var y = s.top - eh2 - i * stepY;
	if (x > s.right && y < s.bottom) break;
	var cd = Math.abs(x - cx);
	if (cd < deltaX) deltaX = cd, kx = i;
	cd = Math.abs(y - cy);
	if (cd < deltaY) deltaY = cd, ky = i
  }
  updateTimer(ST_RUN);
  var curStep = ky * kxMax + (0 < dir ? kx : kxMax - kx);
  if (4 < curStep)
	if (0 === curStep % 5) {
	  var maxStep = kyMax * kxMax;
	  var minETA = (maxStep / curStep - 1) * _RT.$timer.$secInRun / 60;
	  var strMsg = 1 > minETA ? trS('msg.scanning.text.soon') : trSO('msg.scanning.text', {'n': Math.round(minETA)});
	  _RT.$curMessage = { TEXT: strMsg, TITLE: trS('msg.scanning.tip') }
	}
  kx = kx + dir;
  var newX = s.left + ew2 + kx * stepX;
  if (newX < s.left || newX > s.right || Math.abs(newX - s.left) < Math.abs(newX - ew2 - s.left) || Math.abs(newX - s.right) < Math.abs(newX + ew2 - s.right)) {
	newX = s.left + ew2 + (kx - dir) * stepX;
	_RT.$direction = -_RT.$direction;
	ky++
  }
  var newY = s.top - eh2 - ky * stepY;
  if (newY < s.bottom || Math.abs(newY - s.bottom) < Math.abs(newY - eh2 - s.bottom)) {
	if (!_REP.$isEditableFound && _UI.pMain.pFilter.oExcludeNonEditables.CHECKED) _RT.$reportEditableNotFound = true;
	async(F_STOP);
	return
  }
  _RT.$nextCenter = new UW.OpenLayers.LonLat(newX, newY);
  WM.zoomTo(SCAN_ZOOM);
  WM.panTo(_RT.$nextCenter);
  clearWD()
}
function F_ONRUN() {
  clearErrorFlag();
  if (RTStateIs(ST_RUN)) return;
  async(F_LAYERSOFF);
  _RT.$curMessage = {TEXT: trS('msg.starting.text'), TITLE: trS('msg.starting.tip')};
  setRTState(ST_RUN);
  clearWD();
  _RT.$direction = DIR_L2R;
  _RT.$firstStep = true;
  var e = WM.getExtent();
  _RT.$startExtent = e;
  _RT.$startCenter = WM.getCenter();
  _RT.$startZoom = WM.getZoom();
  _RT.$nextCenter = null;
  _RT.$moveEndCenter = null;
  _RT.$nextCenter = new UW.OpenLayers.LonLat(e.left, e.top);
  WM.panTo(_RT.$nextCenter);
  WM.zoomTo(SCAN_ZOOM)
}
function F_ONLOGIN() {
  if (WLM.user) {
	if (!_WV.$loggedIn) {
	  _WV.$loggedIn = true;
	  async(F_LOGIN)
	}
  } else if (_WV.$loggedIn) {
	_WV.$loggedIn = false;
	async(F_LOGOUT)
  } else
	log('waiting for login...')
}
function F_INIT() {
  UW = window;
  Wa = UW.W;
  nW = UW.W;
  WLM = nW.loginManager;
  WSM = nW.selectionManager;
  WM = nW.map;
  WMo = nW.model;
  WC = nW.controller;
  if (!Wa || !WLM || !WSM || !WM || !WMo || !WC || !$('#user-tabs')) {
	log('waiting for WME...');
	async(F_INIT, null, 1E3);
	return
  }
  if (classCodeDefined(UW.require)) {
	R = UW.require;
	WME_BETA = /beta/.test(location.href)
  }
  var _gaq = UW['_gaq'];
  if (_gaq) {
	_gaq.push(['WME_Validator._setAccount', 'UA-46853768-3']);
	_gaq.push(['WME_Validator._setDomainName', 'waze.com']);
	_gaq.push(['WME_Validator._trackPageview'])
  }
  _WV.$loggedIn = false;
  WLM.events.on({'loginStatus': onLogin, 'login': onLogin});
  W.app.modeController.model.bind('change:mode', F_INIT);
  async(F_ONLOGIN);
  _WV.buildRegExp = function(checkID, options, strRegExp) {
	try {
	  while (strRegExp && ' ' === strRegExp.charAt(0)) strRegExp = strRegExp.substr(1);
	  if (strRegExp) {
		if ('D' === strRegExp.charAt(0)) {
		  strRegExp = strRegExp.substr(1);
		  options[CO_NUMBER] = 1
		} else
		  options[CO_NUMBER] = 0;
		if ('!' === strRegExp.charAt(0)) {
		  strRegExp = strRegExp.substr(1);
		  options[CO_BOOL] = true
		} else
		  options[CO_BOOL] = false;
		if ('/' === strRegExp.charAt(0)) strRegExp = strRegExp.substr(1);
		var strRegExpOptions = '';
		var arrMatch = strRegExp.match(/\/([igmy]*)$/);
		if (arrMatch) {
		  strRegExpOptions = arrMatch[1];
		  strRegExp = strRegExp.slice(0, -arrMatch[0].length)
		}
		options[CO_REGEXP] = new RegExp(strRegExp, strRegExpOptions)
	  } else {
		options[CO_BOOL] = false;
		options[CO_NUMBER] = 0;
		options[CO_REGEXP] = null
	  }
	} catch (e) {
	  error(trSO('err.regexp', {'n': checkID}) + '\n\n' + e);
	  options[CO_BOOL] = false;
	  options[CO_NUMBER] = 0;
	  options[CO_REGEXP] = null
	}
  };
  _WV.SimpleCITY = function(objID) {
	this.$hash = 0;
	this.$cityID = 0;
	this.$city = '';
	this.$state = '';
	this.$countryID = 0;
	this.$country = '';
	if (objID) {
	  this.$cityID = objID;
	  var oc = WMo.cities.getObjectById(objID);
	  if (oc) {
		this.$city = oc.attributes.isEmpty ? '' : oc.attributes.name;
		var o = WMo.states.getObjectById(oc.attributes.stateID);
		if (o) this.$state = o.name;
		this.$countryID = oc.attributes.countryID;
		o = WMo.countries.getObjectById(oc.attributes.countryID);
		if (o) this.$country = o.name
	  }
	  this.$hash = this.$cityID + this.$countryID;
	  Object.defineProperties(this, {$hash: {writable: false}, $cityID: {writable: false}, $state: {writable: false}, $countryID: {writable: false}, $country: {writable: false}})
	}
  };
  _WV.SimpleCITY.prototype.isOkFor = function(checkID) {
	if (!_RT.$isGlobalAccess) return false;
	var rep = _RT.$checks[checkID];
	if (!rep.$cache) rep.$cache = {};
	var cache = rep.$cache;
	var forCity = rep.FORCITY;
	var hash = forCity ? this.$hash : this.$countryID;
	if (hash in cache) return cache[hash];
	cache[hash] = false;
	var forLevel = rep.FORLEVEL;
	if (forLevel && forLevel > _RT.$topUser.$userLevel) return false;
	if (forCity) {
	  var curCity = this.$city.toUpperCase();
	  if (!_WV.checkAccessFor(forCity, function(e) {
			return e.toUpperCase() === curCity
		  }))
		return false
	}
	var forUser = rep.FORUSER;
	if (forUser) {
	  var curUser = _RT.$topUser.$userName.toUpperCase();
	  if (!_WV.checkAccessFor(forUser, function(e) {
			return e.toUpperCase() === curUser
		  }))
		return false
	}
	var forCountry = rep.FORCOUNTRY;
	if (forCountry) {
	  var curCountry = this.$country.toUpperCase();
	  if (!_WV.checkAccessFor(forCountry, function(e) {
			if (e in _I18n.$code2country) return _I18n.$code2country[e] === curCountry;
			error('Please report: fc=' + e);
			return false
		  }))
		return false
	}
	cache[hash] = true;
	return true
  };
  _WV.SimpleADDRESS = function(objID) {
	this.$streetID = 0;
	this.$street = '';
	if (objID) {
	  this.$streetID = objID;
	  var o = WMo.streets.getObjectById(objID);
	  if (o) {
		this.$street = o.isEmpty ? '' : o.name;
		_WV.SimpleCITY.call(this, o.cityID)
	  } else {
		this.$street = GL_NOID;
		_WV.SimpleCITY.call(this, 0)
	  }
	}
	Object.defineProperties(this, {$streetID: {writable: false}})
  };
  _WV.SimpleADDRESS.prototype = new _WV.SimpleCITY;
  _WV.SimpleADDRESS.prototype.constructor = _WV.SimpleADDRESS
}
function F_ONWARNING(e) {
  _THUI.viewToDoc(_UI);
  var target = _THUI.getByDOM(_UI, e.target);
  if (target && target.CHECKED && target.WARNING) warning(target.WARNING);
  async(F_UPDATEUI)
}
function F_UPDATEUI(e) {
  function destroyHLs() {
	_RT.$HLedObjects = {};
	_RT.$HLlayer.destroyFeatures()
  }
  function updateReportButtons() {
	if (RTStateIs(ST_RUN) || RTStateIs(ST_CONTINUE)) {
	  btns.bReport.CLASS = 'btn btn-default';
	  btns.bReport.DISABLED = true;
	  btns.bReportBB.DISABLED = true;
	  return
	}
	if (!_REP.$maxSeverity) {
	  btns.bReport.CLASS = 'btn btn-default';
	  btns.bReport.DISABLED = true;
	  btns.bReportBB.DISABLED = true
	} else {
	  switch (_REP.$maxSeverity) {
		case RS_NOTE:
		  btns.bReport.CLASS = 'btn btn-info';
		  break;
		case RS_WARNING:
		  btns.bReport.CLASS = 'btn btn-warning';
		  break;
		case RS_ERROR:
		  btns.bReport.CLASS = 'btn btn-danger';
		  break;
		case RS_CUSTOM1:
		  btns.bReport.CLASS = 'btn btn-success';
		  break;
		case RS_CUSTOM2:
		  btns.bReport.CLASS = 'btn btn-primary';
		  break
	  }
	  btns.bReport.DISABLED = false;
	  btns.bReportBB.DISABLED = false
	}
	if (3 < WM.getZoom()) {
	  btns.bScan.CLASS = 'btn btn-default';
	  btns.bScan.DISABLED = true;
	  btns.bScan.TITLE = trS('button.scan.tip.NA')
	} else {
	  btns.bScan.CLASS = 'btn btn-success';
	  btns.bScan.DISABLED = false;
	  btns.bScan.TITLE = trS('button.scan.tip')
	}
	if (_REP.$isLimitPerCheck) {
	  btns.bClear.CLASS = 'btn btn-danger';
	  btns.bClear.TITLE = trS('button.clear.tip.red')
	} else {
	  btns.bClear.CLASS = 'btn btn-default';
	  btns.bClear.TITLE = trS('button.clear.tip')
	}
	if (_UI.pSettings.pScanner.oHLReported.CHECKED) {
	  _UI.pMain.pTabs.tMain.TEXT = '<i class="fa fa-check-square-o" aria-hidden="true"></i> ' +
		  'Validator:';
	  _UI.pMain.pTabs.tMain.TITLE = trS('tab.switch.tip.off')
	} else {
	  _UI.pMain.pTabs.tMain.TEXT = '<font color="#ccc"><i class="fa fa-power-off" aria-hidden="true"></i> ' +
		  'Validator:</font>';
	  _UI.pMain.pTabs.tMain.TITLE = trS('tab.switch.tip.on')
	}
	_UI.pMain.pTabs.tMain.TITLE += '\nWME Validator Version ' + WV_VERSION
  }
  function getTopCity() {
	var i = WMo.segments.topCityID;
	if (i) return new _WV.SimpleCITY(i);
	return new _WV.SimpleCITY(0)
  }
  _RT.$topCity = getTopCity();
  if (_RT.$topCity.$country) _RT.$cachedTopCCode = _I18n.getCountryCode(_RT.$topCity.$country.toUpperCase());
  _THUI.viewToDoc(_UI);
  _RT.$isGlobalAccess = true;
  if (!_RT.$topCity.isOkFor(0)) _RT.$isGlobalAccess = false;
  if (!_RT.$isGlobalAccess) {
	_UI.pMain.NODISPLAY = 1;
	_UI.pSettings.NODISPLAY = 1;
	_UI.pTips.NODISPLAY = 1;
	_UI.pNoAccess.NODISPLAY = 0;
	_THUI.docToView(_UI);
	return
  } else if (!_UI.pNoAccess.NODISPLAY) {
	_UI.pMain.NODISPLAY = 0;
	_UI.pTips.NODISPLAY = 0;
	_UI.pNoAccess.NODISPLAY = 1
  }
  if (_RT.oReportToolbox.NA && null !== document.getElementById(_RT.oReportToolbox.FORID)) {
	_RT.oReportToolbox.CHECKED = true;
	_RT.oReportToolbox.NA = false;
	clearReport();
	async(ForceHLAllSegments, null, 1E3)
  }
  if (_RT.oReportWMECH.NA && null !== document.getElementById(_RT.oReportWMECH.FORID)) {
	_RT.oReportWMECH.CHECKED = true;
	_RT.oReportWMECH.NA = false;
	clearReport();
	async(ForceHLAllSegments, null, 1E3)
  }
  var customOptions = _RT.$checks[128].OPTIONS[_I18n.$defLng];
  if (customOptions[CO_STRING] !== _UI.pSettings.pCustom.oTemplate1.VALUE || _RT.$RegExp1 !== _UI.pSettings.pCustom.oRegExp1.VALUE) {
	customOptions[CO_STRING] = _UI.pSettings.pCustom.oTemplate1.VALUE;
	if (customOptions[CO_STRING]) {
	  clearErrorFlag();
	  _RT.$RegExp1 = _UI.pSettings.pCustom.oRegExp1.VALUE;
	  _WV.buildRegExp(128, customOptions, _UI.pSettings.pCustom.oRegExp1.VALUE)
	} else
	  customOptions[CO_REGEXP] = null
  }
  customOptions = _RT.$checks[129].OPTIONS[_I18n.$defLng];
  if (customOptions[CO_STRING] !== _UI.pSettings.pCustom.oTemplate2.VALUE || _RT.$RegExp2 !== _UI.pSettings.pCustom.oRegExp2.VALUE) {
	customOptions[CO_STRING] = _UI.pSettings.pCustom.oTemplate2.VALUE;
	if (customOptions[CO_STRING]) {
	  clearErrorFlag();
	  _RT.$RegExp2 = _UI.pSettings.pCustom.oRegExp2.VALUE;
	  _WV.buildRegExp(128, customOptions, _UI.pSettings.pCustom.oRegExp2.VALUE)
	} else
	  customOptions[CO_REGEXP] = null
  }
  if (_RT.$checks[128].OPTIONS[_I18n.$defLng][CO_REGEXP])
	_RT.$curMaxSeverity = RS_CUSTOM1;
  else if (_RT.$checks[129].OPTIONS[_I18n.$defLng][CO_REGEXP])
	_RT.$curMaxSeverity = RS_CUSTOM2;
  else
	_RT.$curMaxSeverity = RS_ERROR;
  if (e) {
	switch (_THUI.getByDOM(_UI, e.target)) {
	  case _UI.pMain.pTabs.tMain:
		_RT.$switchValidator = true;
		break;
	  case _UI.pSettings.pCustom.oTemplate1:
	  case _UI.pSettings.pCustom.oRegExp1:
	  case _UI.pSettings.pCustom.oTemplate2:
	  case _UI.pSettings.pCustom.oRegExp2:
		_RT.$isMapChanged = true;
		clearReport();
		async(ForceHLAllSegments);
		break;
	  case _UI.pMain.pFilter.oExcludeNonEditables:
	  case _UI.pMain.pFilter.oExcludeDuplicates:
	  case _UI.pMain.pFilter.oExcludeVenues:
	  case _UI.pMain.pFilter.oExcludeStreets:
	  case _UI.pMain.pFilter.oExcludeOther:
	  case _UI.pMain.pFilter.oExcludeNotes:
	  case _UI.pMain.pSearch.oIncludeYourEdits:
	  case _UI.pMain.pSearch.oIncludeUpdatedBy:
	  case _UI.pMain.pSearch.oIncludeUpdatedSince:
	  case _UI.pMain.pSearch.oIncludeCityName:
	  case _UI.pMain.pSearch.oIncludeChecks:
		_RT.$includeUpdatedByCache = {};
		_RT.$includeUpdatedSinceTime = 0;
		_RT.$includeCityNameCache = {};
		_RT.$includeChecksCache = {};
		async(F_SHOWREPORT, RF_UPDATEMAXSEVERITY);
		async(ForceHLAllSegments);
		break;
	  case _UI.pMain.pButtons.bScan:
		async(F_ONRUN);
		break;
	  case _UI.pMain.pButtons.bStop:
		async(F_STOP);
		break;
	  case _UI.pMain.pButtons.bClear:
		_RT.$isMapChanged = true;
		clearErrorFlag();
		clearReport();
		destroyHLs();
		break;
	  case _UI.pMain.pButtons.bPause:
		_RT.$curMessage = {TEXT: trS('msg.paused.text'), TITLE: trS('msg.paused.tip')};
		async(F_PAUSE);
		break;
	  case _UI.pMain.pButtons.bContinue:
		clearErrorFlag();
		if (!RTStateIs(ST_PAUSE)) break;
		if (LIMIT_TOTAL < _REP.$counterTotal) clearReport();
		async(F_LAYERSOFF);
		_RT.$curMessage = {TEXT: trS('msg.continuing.text'), TITLE: trS('msg.continuing.tip')};
		setRTState(ST_CONTINUE);
		if (_RT.$startCenter) {
		  WM.zoomTo(_RT.$startZoom);
		  WM.panTo(_RT.$startCenter)
		}
		clearWD();
		break;
	  case _UI.pMain.pButtons.bSettings:
		_UI.pMain.NODISPLAY = true;
		_UI.pSettings.NODISPLAY = false;
		_RT.$curMessage = {TEXT: trS('msg.settings.text'), TITLE: trS('msg.settings.tip')};
		break;
	  case _UI.pSettings.pButtons.bReset:
		resetDefaults();
		_RT.$curMessage = {TEXT: trS('msg.reset.text'), TITLE: trS('msg.reset.tip')};
		sync(F_SHOWREPORT, RF_UPDATEMAXSEVERITY);
		async(ForceHLAllSegments);
		break;
	  case _UI.pSettings.pButtons.bBack:
		_UI.pMain.NODISPLAY = false;
		_UI.pSettings.NODISPLAY = true;
		break;
	  case _UI.pSettings.pScanner.oHLReported:
		_UI.pSettings.pScanner.oHLReported.CHECKED = !_UI.pSettings.pScanner.oHLReported.CHECKED;
		_RT.$switchValidator = true;
		break
	}
	async(F_ONWARNING, e)
  }
  if (_RT.$switchValidator) {
	_UI.pSettings.pScanner.oHLReported.CHECKED = !_UI.pSettings.pScanner.oHLReported.CHECKED;
	if (_UI.pSettings.pScanner.oHLReported.CHECKED) {
	  ForceHLAllSegments();
	  _RT.$HLlayer.setVisibility(true)
	} else {
	  ForceHLAllSegments();
	  destroyHLs();
	  _RT.$HLlayer.setVisibility(false)
	}
	_RT.$switchValidator = false
  }
  if (_RT.$reportEditableNotFound) {
	_RT.$reportEditableNotFound = false;
	_UI.pMain.pFilter.oExcludeNonEditables.CHECKED = false;
	info('\'Exclude non-editable segments\' filter option has been removed because the area you just scanned has no editable segments.\n\nNow just click \'Show report\' to view the report!')
  }
  _UI.pMain.pHelp.NODISPLAY = !_UI.pMain.pTabs.tHelp.CHECKED;
  _UI.pMain.pFilter.NODISPLAY = !_UI.pMain.pTabs.tFilter.CHECKED;
  _UI.pMain.pSearch.NODISPLAY = !_UI.pMain.pTabs.tSearch.CHECKED;
  _UI.pSettings.pScanner.NODISPLAY = !_UI.pSettings.pTabs.tScanner.CHECKED;
  _UI.pSettings.pCustom.NODISPLAY = !_UI.pSettings.pTabs.tCustom.CHECKED;
  _UI.pSettings.pAbout.NODISPLAY = !_UI.pSettings.pTabs.tAbout.CHECKED;
  if (_UI.pSettings.pTabs.tAbout.CHECKED) {
	_UI.pSettings.pButtons.bReset.NODISPLAY = 1;
	_UI.pSettings.pButtons.bList.NODISPLAY = 0;
	_UI.pSettings.pButtons.bWizard.NODISPLAY = 0
  } else {
	_UI.pSettings.pButtons.bReset.NODISPLAY = 0;
	_UI.pSettings.pButtons.bList.NODISPLAY = 1;
	_UI.pSettings.pButtons.bWizard.NODISPLAY = 1
  }
  var btns = _UI.pMain.pButtons;
  switch (getRTState()) {
	case ST_CONTINUE:
	case ST_RUN:
	  btns.bScan.NODISPLAY = true;
	  btns.bPause.NODISPLAY = false;
	  btns.bContinue.NODISPLAY = true;
	  btns.bStop.NODISPLAY = false;
	  btns.bClear.NODISPLAY = true;
	  updateReportButtons();
	  btns.bSettings.DISABLED = true;
	  _UI.pMain.pFilter._DISABLED = true;
	  _UI.pMain.pSearch._DISABLED = true;
	  break;
	case ST_STOP:
	  btns.bScan.NODISPLAY = false;
	  btns.bPause.NODISPLAY = true;
	  btns.bContinue.NODISPLAY = true;
	  btns.bStop.NODISPLAY = true;
	  btns.bClear.NODISPLAY = false;
	  if (isEmpty(_RT.$seen))
		btns.bClear.DISABLED = true;
	  else
		btns.bClear.DISABLED = false;
	  updateReportButtons();
	  if (_REP.$maxSeverity && !_UI.pMain.NODISPLAY) _RT.$curMessage = {TEXT: trS('msg.finished.text'), TITLE: trS('msg.finished.tip'), CLASS: CL_MSGY};
	  btns.bSettings.DISABLED = false;
	  _UI.pMain.pFilter._DISABLED = false;
	  _UI.pMain.pSearch._DISABLED = false;
	  break;
	case ST_PAUSE:
	  btns.bScan.NODISPLAY = true;
	  btns.bPause.NODISPLAY = true;
	  btns.bContinue.NODISPLAY = false;
	  btns.bContinue.DISABLED = false;
	  btns.bStop.NODISPLAY = false;
	  btns.bClear.NODISPLAY = true;
	  updateReportButtons();
	  btns.bSettings.DISABLED = false;
	  _UI.pMain.pFilter._DISABLED = false;
	  _UI.pMain.pSearch._DISABLED = false;
	  break
  }
  if (RTStateIs(ST_STOP) && !_REP.$maxSeverity)
	if (!_UI.pMain.NODISPLAY)
	  if (3 < WM.getZoom())
		_RT.$curMessage = {TEXT: _UI.pSettings.pScanner.oHLReported.CHECKED ? trS('msg.pan.text') : trS('msg.zoomout.text'), TITLE: '', CLASS: CL_MSGY};
	  else
		_RT.$curMessage = {TEXT: trS('msg.click.text'), TITLE: '', CLASS: CL_MSGY};
  _UI.pTips.TEXT = _RT.$curMessage.TEXT;
  if (_RT.$curMessage.TITLE)
	_UI.pTips.TITLE = _RT.$curMessage.TITLE;
  else
	_UI.pTips.TITLE = '';
  if (_RT.$curMessage.CLASS)
	_UI.pTips.CLASS = _RT.$curMessage.CLASS;
  else
	_UI.pTips.CLASS = CL_MSG;
  var storageObj = _THUI.saveValues(_UI);
  storageObj[AS_VERSION] = WV_VERSION;
  storageObj[AS_LICENSE] = WV_LICENSE_VERSION;
  storageObj[AS_PASSWORD] = 1;
  try {
	window.localStorage.setItem(AS_NAME, JSON.stringify(storageObj))
  } catch (err) {
  }
  _THUI.docToView(_UI)
}
function F_LOGOUT() {
  log('logout');
  _UI = {};
  WMo.events.un({'mergeend': onMergeEnd});
  WM.events.un({'moveend': onMoveEnd, 'zoomend': HLAllSegments, 'changelayer': onChangeLayer});
  WSM.events.un({'selectionchanged': ForceHLAllSegments});
  WC.events.un({'loadstart': onLoadStart});
  WMo.segments.events.un({'objectsadded': onSegmentsAdded, 'objectschanged': onSegmentsChanged, 'objectsremoved': onSegmentsRemoved});
  WMo.venues.events.un({'objectsadded': onVenuesAdded, 'objectschanged': onVenuesChanged, 'objectsremoved': onVenuesRemoved});
  WMo.nodes.events.un({'objectschanged': onNodesChanged, 'objectsremoved': onNodesRemoved})
}
async(F_INIT, 0, 1);
var _I18n = {
  $defLng: 'EN',
  $lng: '',
  $translations: null,
  $curSet: null,
  $curCode: '',
  $fallbackSet: null,
  $fallbackCode: '',
  $defSet: null,
  $country2code: null,
  $code2country: null,
  $code2code: null,
  $lng2code: null,
  $code2dir: null
};
_I18n.init = function(options) {
  _I18n.$lng = options.$lng || _I18n.$defLng;
  _I18n.$translations = options.$translations || {};
  _I18n.$country2code = options.$country2code || {};
  _I18n.$code2country = options.$code2country || {};
  _I18n.$code2code = options.$code2code || {};
  _I18n.$lng2code = options.$lng2code || {};
  _I18n.$code2dir = options.$code2dir || {}
};
_I18n.addTranslation = function(translation) {
  var ccode = translation['.codeISO'];
  if (!ccode) return;
  ccode = ccode.toUpperCase();
  _I18n.$translations[ccode] = translation;
  if (_I18n.$defLng !== ccode) {
	var country = translation['.country'];
	if (country) {
	  if (!classCodeIs(country, CC_ARRAY)) country = [country];
	  for (var i = 0; i < country.length; i++) {
		var ucountry = country[i].toUpperCase();
		_I18n.$country2code[ucountry] = ccode;
		if (!(ccode in _I18n.$code2country)) _I18n.$code2country[ccode] = ucountry
	  }
	}
	var lng = translation['.lng'];
	if (lng) {
	  if (!classCodeIs(lng, CC_ARRAY)) lng = [lng];
	  for (var i = 0; i < lng.length; i++) {
		var ulng = lng[i].toUpperCase();
		_I18n.$lng2code[ulng] = ccode
	  }
	}
	var dir = translation['.dir'];
	if (dir) _I18n.$code2dir[ccode] = dir.toLowerCase();
	var fcode = translation['.fallbackCode'];
	if (fcode) {
	  fcode = fcode.toUpperCase();
	  if (_I18n.$defLng !== fcode) _I18n.$code2code[ccode] = fcode
	}
  }
  _I18n.$curCode = _I18n.getCodeOL(_I18n.$translations, _I18n.$lng);
  _I18n.$curSet = _I18n.getValueOC(_I18n.$translations, _I18n.$curCode);
  _I18n.$fallbackCode = _I18n.getFallbackCodeOC(_I18n.$translations, _I18n.$curCode);
  _I18n.$fallbackSet = _I18n.getValueOC(_I18n.$translations, _I18n.$fallbackCode);
  _I18n.$defSet = _I18n.$translations[_I18n.$defLng]
};
_I18n.getDependantCodes = function(uc) {
  var ret = [];
  for (var depCode in _I18n.$code2code)
	if (_I18n.$code2code[depCode] === uc) ret.push(depCode);
  return ret
};
_I18n.getCountryCode = function(uc) {
  if (uc in _I18n.$country2code) return _I18n.$country2code[uc];
  return ''
};
_I18n.getCountry = function(ucc) {
  if (ucc in _I18n.$code2country) return _I18n.$code2country[ucc];
  return ''
};
_I18n.getCapitalizedCountry = function(ucc) {
  return _I18n.capitalize(_I18n.getCountry(ucc)).toLowerCase().replace(/\b./g, function(c) {
	return c.toUpperCase()
  })
};
_I18n.capitalize = function(str) {
  return str.toLowerCase().replace(/\b./g, function(c) {
	return c.toUpperCase()
  })
};
_I18n.getDir = function() {
  if (_I18n.$curCode in _I18n.$code2dir) return _I18n.$code2dir[_I18n.$curCode];
  if (_I18n.$fallbackCode in _I18n.$code2dir) return _I18n.$code2dir[_I18n.$fallbackCode];
  return 'ltr'
};
_I18n.getString = function(label) {
  if (label in _I18n.$curSet) return _I18n.$curSet[label];
  if (label in _I18n.$fallbackSet) return _I18n.$fallbackSet[label];
  if (label in _I18n.$defSet) return _I18n.$defSet[label];
  var ret = '[missing ' + label + ']';
  return ret
};
_I18n.isLabelExist = function(label) {
  if (label in _I18n.$curSet) return true;
  if (label in _I18n.$fallbackSet) return true;
  if (label in _I18n.$defSet) return true;
  return false
};
_I18n.getCodeOL = function(obj, lng) {
  var ccode = _I18n.$lng2code[lng];
  if (ccode)
	if (ccode in obj)
	  return ccode;
	else
	  return _I18n.getFallbackCodeOC(obj, ccode);
  else
	return _I18n.$defLng
};
_I18n.getFallbackCodeOC = function(obj, ccode) {
  var fcode = _I18n.$code2code[ccode];
  if (fcode && fcode in obj) return fcode;
  return _I18n.$defLng
};
_I18n.getValueOL = function(obj, lng) {
  return _I18n.getValueOC(obj, _I18n.getCodeOL(obj, lng))
};
_I18n.getValueOC = function(obj, ccode) {
  if (ccode in obj)
	return obj[ccode];
  else if (ccode in _I18n.$code2code) {
	var fcode = _I18n.$code2code[ccode];
	if (fcode in obj) return obj[fcode]
  }
  return obj[_I18n.$defLng]
};
_I18n.expandSO = function(str, options) {
  if (!options) return str;
  return str.replace(/\$\{(\w+)(\[(\d+)\]|\[(\W*)\])?\}/g, function(all, name, arr, idx, delims) {
	if (arr) {
	  if (idx) return options[name][idx] || '';
	  return options[name].join(delims)
	} else
	  return options[name]
  })
};
_I18n.t = function(obj, ccode, options) {
  return _I18n.expandSO(_I18n.getValueOC(obj, ccode), options)
};
_I18n.tL = function(obj, options) {
  return _I18n.expandSO(_I18n.getValueOL(obj, _I18n.$lng), options)
};
var _AUDIO = {};
try {
  _AUDIO._context = new (window.AudioContext || window.webkitAudioContext);
  _AUDIO.beep = function(dur, oscType) {
	var osc = _AUDIO._context.createOscillator();
	osc.connect(_AUDIO._context.destination);
	osc.type = oscType || 'sine';
	osc.start(0);
	setTimeout(function() {
	  osc.stop(0)
	}, dur)
  }
} catch (e) {
  _AUDIO._context = null;
  _AUDIO.beep = function(dur, oscType) {
	log('beep!')
  }
};
_THUI.$def = {
  _class: '',
  _disclose: 0,
  _name: '',
  _nodisplay: 0,
  _disabled: 0,
  _reverse: 0,
  _style: '',
  _type: '',
  _onclick: null,
  _onwarning: null,
  _onchange: null
};
_THUI.loadValues = function(uiObj, storageObj) {
  if (!storageObj) return;
  if (uiObj.AUTOSAVE && uiObj.AUTOSAVE in storageObj) {
	switch (uiObj.TYPE) {
	  case _THUI.TEXT:
	  case _THUI.DATE:
		uiObj.VALUE = storageObj[uiObj.AUTOSAVE];
		break;
	  default:
		uiObj.CHECKED = storageObj[uiObj.AUTOSAVE];
		break
	}
	return
  }
  for (var i in uiObj) {
	if (!uiObj.hasOwnProperty(i)) continue;
	var o = uiObj[i];
	switch (classCode(o)) {
	  case CC_OBJECT:
		_THUI.loadValues(o, storageObj);
		break;
	  case CC_ARRAY:
		for (var j = 0; j < o.length; j++) _THUI.loadValues(o[j], storageObj);
		break
	}
  }
};
_THUI.saveValues = function(uiObj, storageObj) {
  if (!storageObj) storageObj = {};
  if (uiObj.AUTOSAVE) {
	switch (uiObj.TYPE) {
	  case _THUI.TEXT:
	  case _THUI.DATE:
		storageObj[uiObj.AUTOSAVE] = uiObj.VALUE;
		break;
	  default:
		storageObj[uiObj.AUTOSAVE] = uiObj.CHECKED;
		break
	}
	return storageObj
  }
  for (var i in uiObj) {
	if (!uiObj.hasOwnProperty(i)) continue;
	var o = uiObj[i];
	switch (classCode(o)) {
	  case CC_OBJECT:
		_THUI.saveValues(o, storageObj);
		break;
	  case CC_ARRAY:
		for (var j = 0; j < o.length; j++) _THUI.saveValues(o[j], storageObj);
		break
	}
  }
  return storageObj
};
_THUI.storage = {
  get: function(name) {
	try {
	  var s = window.localStorage.getItem(name);
	  return s ? JSON.parse(s) : null
	} catch (e) {
	  return null
	}
  },
  set: function(name, obj) {
	try {
	  var s = JSON.stringify(obj);
	  window.localStorage.setItem(name, s);
	  return true
	} catch (e) {
	  return false
	}
  }
};
_THUI.addElemetClassStyle = function(elem, cl, newStyle) {
  if (classCodeIs(cl, CC_NUMBER)) cl = 'c' + cl;
  return _THUI.addStyle(elem + '.' + cl + newStyle)
};
_THUI.addElemetIdStyle = function(elem, id, newStyle) {
  if (classCodeIs(id, CC_NUMBER)) id = 'i' + id;
  return _THUI.addStyle(elem + '#' + id + newStyle)
};
_THUI.addStyle = function(newStyle) {
  for (var i = 0; i < 10; i++) {
	var sheet = document.styleSheets[i];
	try {
	  if ('cssRules' in sheet) return sheet.insertRule(newStyle, sheet.cssRules.length)
	} catch (e) {
	}
  }
};
_THUI.getByDOM = function(uiObj, elem) {
  if (uiObj.IDOM == elem || uiObj.ODOM == elem) return uiObj;
  var ret = null;
  for (var i in uiObj) {
	if (!uiObj.hasOwnProperty(i)) continue;
	var o = uiObj[i];
	switch (classCode(o)) {
	  case CC_OBJECT:
		if (ret = _THUI.getByDOM(o, elem)) return ret;
		break;
	  case CC_ARRAY:
		for (var j = 0; j < o.length; j++)
		  if (ret = _THUI.getByDOM(o[j], elem)) return ret;
		break
	}
  }
  return null
};
_THUI.getById = function(uiObj, id) {
  if (uiObj.ID && uiObj.ID == id) return uiObj;
  var ret = null;
  for (var i in uiObj) {
	if (!uiObj.hasOwnProperty(i)) continue;
	var o = uiObj[i];
	switch (classCode(o)) {
	  case CC_OBJECT:
		if (ret = _THUI.getById(o, id)) return ret;
		break;
	  case CC_ARRAY:
		for (var j = 0; j < o.length; j++)
		  if (ret = _THUI.getById(o[j], id)) return ret;
		break
	}
  }
  return null
};
_THUI.docToView = function(uiObj) {
  _THUI.appendUI(null, uiObj)
};
_THUI.viewToDoc = function(uiObj) {
  if (uiObj.IDOM) {
	if (classCodeDefined(uiObj.IDOM.value)) {
	  var val = uiObj.IDOM.value;
	  if (classCodeDefined(uiObj.MAX) && val > uiObj.MAX) val = uiObj.MAX;
	  if (classCodeDefined(uiObj.MIN) && val < uiObj.MIN) val = uiObj.MIN;
	  uiObj.VALUE = val
	}
	if (classCodeDefined(uiObj.IDOM.checked)) uiObj.CHECKED = uiObj.IDOM.checked
  }
  for (var i in uiObj) {
	if (!uiObj.hasOwnProperty(i)) continue;
	var o = uiObj[i];
	switch (classCode(o)) {
	  case CC_OBJECT:
		_THUI.viewToDoc(o);
		break;
	  case CC_ARRAY:
		o.forEach(_THUI.viewToDoc);
		break
	}
  }
};
_THUI.appendUI = function(parent, uiObj, uiPrefix, uiName) {
  uiPrefix = uiPrefix || '';
  uiName = uiName || '';
  var id = uiObj.ID;
  if (!classCodeDefined(id)) id = '';
  var NA = uiObj.NA || false;
  var NAti = uiObj.NATITLE || '';
  var ch = uiObj.CHECKED || false;
  var cl = classCodeDefined(uiObj.CLASS) ? uiObj.CLASS : _THUI.$def._class;
  var cli = uiObj.CLASSI;
  var _cl = uiObj._CLASS;
  var va = uiObj.VALUE;
  var disc = classCodeDefined(uiObj.DISCLOSE) ? uiObj.DISCLOSE : _THUI.$def._disclose;
  var _disc = uiObj._DISCLOSE;
  var di = NA ? NA : classCodeDefined(uiObj.DISABLED) ? uiObj.DISABLED : _THUI.$def._disabled;
  var _di = uiObj._DISABLED;
  var no = classCodeDefined(uiObj.NODISPLAY) ? uiObj.NODISPLAY : _THUI.$def._nodisplay;
  var _no = uiObj._NODISPLAY;
  var ma = uiObj.MAX;
  var mal = uiObj.MAXLENGTH;
  var plh = uiObj.PLACEHOLDER;
  var mi = uiObj.MIN;
  var name = classCodeDefined(uiObj.NAME) ? uiObj.NAME : _THUI.$def._name;
  var _name = uiObj._NAME;
  var ro = uiObj.READONLY || false;
  var re = classCodeDefined(uiObj.REVERSE) ? uiObj.REVERSE : _THUI.$def._reverse;
  var _re = uiObj._REVERSE;
  var step = uiObj.STEP;
  var st = classCodeDefined(uiObj.STYLE) ? uiObj.STYLE : _THUI.$def._style;
  var _st = uiObj._STYLE;
  var sti = classCodeDefined(uiObj.STYLEI) ? uiObj.STYLEI : '';
  var sto = classCodeDefined(uiObj.STYLEO) ? uiObj.STYLEO : '';
  var te = uiObj.TEXT || '';
  var ti = NA ? NAti ? NAti : 'Not available' : uiObj.TITLE;
  var ty = classCodeDefined(uiObj.TYPE) ? uiObj.TYPE : _THUI.$def._type;
  var _ty = uiObj._TYPE;
  var accK = uiObj.ACCESSKEY || '';
  var oncl = uiObj.ONCLICK || _THUI.$def._onclick;
  var onclo = uiObj.ONCLICKO;
  var _oncl = uiObj._ONCLICK;
  var onwa = uiObj.ONWARNING || _THUI.$def._onwarning;
  var _onwa = uiObj._ONWARNING;
  var onch = uiObj.ONCHANGE || _THUI.$def._onchange;
  var _onch = uiObj._ONCHANGE;
  var els = [];
  var iel = document.createElement('input');
  var oel = document.createElement('label');
  var ote = te;
  if (classCodeIs(uiPrefix, CC_NUMBER)) uiPrefix = 'p' + uiPrefix;
  if (classCodeIs(id, CC_NUMBER)) id = 'i' + id;
  if (classCodeIs(cl, CC_NUMBER)) cl = 'c' + cl;
  if (classCodeIs(cli, CC_NUMBER)) cli = 'c' + cli;
  if (classCodeIs(name, CC_NUMBER)) name = 'n' + name;
  switch (ty) {
	case _THUI.NONE:
	  iel = oel = null;
	  ote = '';
	  break;
	case _THUI.NUMBER:
	  iel.type = 'number';
	  break;
	case _THUI.RADIO:
	  if (disc && !id) id = uiPrefix + uiName + 'i';
	  if (!name) name = uiPrefix + 'n';
	  iel.type = 'radio';
	  if (disc) oel.htmlFor = id;
	  break;
	case _THUI.CHECKBOX:
	  if (disc && !id) id = uiPrefix + uiName + 'i';
	  iel.type = 'checkbox';
	  if (disc) oel.htmlFor = id;
	  break;
	case _THUI.BUTTON:
	  iel = document.createElement('button');
	  if (te) iel.innerHTML = te;
	  oel = null;
	  ote = '';
	  break;
	case _THUI.TEXT:
	  iel.type = 'text';
	  break;
	case _THUI.PASSWORD:
	  iel.type = 'password';
	  break;
	case _THUI.DATE:
	  iel.type = 'date';
	  break;
	default:
	  iel = null;
	  oel = document.createElement('div');
	  break
  }
  if (oel && iel && !disc)
	if (re)
	  oel.appendChild(iel);
	else
	  oel.insertBefore(iel, oel.firstChild);
  if (classCodeDefined(uiObj.ODOM)) oel = uiObj.ODOM;
  if (classCodeDefined(uiObj.IDOM)) iel = uiObj.IDOM;
  if (ote) {
	var spanEl = document.createElement('span');
	spanEl.innerHTML = ote;
	spanEl.style.pointerEvents = 'none';
	var oldSpans = oel.getElementsByTagName('span');
	var bInserted = false;
	for (var i = 0; i < oldSpans.length; i++) oel.removeChild(oldSpans[i]);
	oel.insertBefore(spanEl, oel.firstChild)
  }
  if (oel && iel)
	if (disc)
	  if (re)
		els.push(oel, iel);
	  else
		els.push(iel, oel);
	else
	  els.push(oel);
  else {
	if (oel) els.push(oel);
	if (iel) els.push(iel)
  }
  if (id) {
	if (iel)
	  iel.id = id;
	else if (oel)
	  oel.id = id;
	uiObj.ID = id
  }
  if (name) uiObj.NAME = name;
  if (iel) {
	if (cli) iel.className = cli;
	if (accK) iel.accessKey = accK;
	if (classCodeDefined(ch)) iel.checked = ch;
	iel.disabled = di;
	if (classCodeDefined(ma)) iel.max = ma;
	if (classCodeDefined(mal)) iel.maxLength = mal;
	if (classCodeDefined(mi)) iel.min = mi;
	if (plh) iel.placeholder = plh;
	if (name) iel.name = name;
	if (classCodeDefined(ro)) iel.readonly = ro;
	if (classCodeDefined(step)) iel.step = step;
	if (classCodeDefined(va)) iel.value = va;
	if (classCodeDefined(oncl)) iel.onclick = oncl;
	if (classCodeDefined(onch)) iel.onchange = onch;
	if (classCodeDefined(onwa) && uiObj.WARNING) iel.onchange = onwa;
	if (sti) iel.style.cssText = sti
  }
  if (oel) {
	if (classCodeDefined(onclo)) oel.onclick = onclo;
	if (sto) oel.style.cssText = sto
  }
  var fel = els[0];
  if (fel) {
	if (cl) fel.className = cl;
	if (st) fel.style.cssText = st
  } else
	fel = parent;
  var oldDef = deepCopy(_THUI.$def);
  if (classCodeDefined(_cl)) _THUI.$def._class = _cl;
  if (classCodeDefined(_disc)) _THUI.$def._disclose = _disc;
  if (classCodeDefined(_name)) _THUI.$def._name = _name;
  if (classCodeDefined(_di)) _THUI.$def._disabled = _di;
  if (classCodeDefined(_no)) _THUI.$def._nodisplay = _no;
  if (classCodeDefined(_re)) _THUI.$def._reverse = _re;
  if (classCodeDefined(_st)) _THUI.$def._style = _st;
  if (classCodeDefined(_ty)) _THUI.$def._type = _ty;
  if (_oncl) _THUI.$def._onclick = _oncl;
  if (_onch) _THUI.$def._onchange = _onch;
  if (_onwa) _THUI.$def._onwarning = _onwa;
  for (var i in uiObj) {
	if (!uiObj.hasOwnProperty(i)) continue;
	var o = uiObj[i];
	switch (classCode(o)) {
	  case CC_OBJECT:
		fel = _THUI.appendUI(fel, o, uiPrefix + uiName, i);
		break;
	  case CC_ARRAY:
		for (var j = 0; j < o.length; j++)
		  if (classCodeIs(o[j], CC_OBJECT)) fel = _THUI.appendUI(fel, o[j], uiPrefix + uiName, i);
		break
	}
  }
  _THUI.$def = oldDef;
  els.forEach(function(e) {
	if (no)
	  e.style.display = 'none';
	else
	  e.style.display = '';
	if (classCodeDefined(ti)) e.title = ti;
	if (e !== uiObj.IDOM && e !== uiObj.ODOM) parent.appendChild(e)
  });
  uiObj.IDOM = iel;
  uiObj.ODOM = oel;
  Object.defineProperties(uiObj, {IDOM: {enumerable: false}, ODOM: {enumerable: false}});
  return parent
};
})()