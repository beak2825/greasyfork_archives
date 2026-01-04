// ==UserScript==
// @name          NeoExportEBPNew
// @namespace     by_Bigpetroman
// @description   Botones para pasar los datos de la pagina de neobux a un div, listos para copiar y pegar
// @author      Bigpetroman
// @include     http://www.neobux.com/c/
// @include     https://www.neobux.com/c/
// @include     http://www.neobux.com/c/?vl*
// @include     https://www.neobux.com/c/?vl*
// @include     http://www.neobux.com/c/rl/*
// @include     https://www.neobux.com/c/rl/*
// @include     http://www.neobux.com/c/rs/*
// @include     https://www.neobux.com/c/rs/*
// @include     https://www.neobux.com/c/d/*
// @include     http://www.neobux.com/c/h/*
// @include     https://www.neobux.com/c/h/*
// @icon        https://img.neobux.com/imagens/texto_32.png
// @version       3.0.0
// @downloadURL https://update.greasyfork.org/scripts/35570/NeoExportEBPNew.user.js
// @updateURL https://update.greasyfork.org/scripts/35570/NeoExportEBPNew.meta.js
// ==/UserScript==
// Changelog
// version 1 liberada 04 de Enero 2012
// los botones copian la información de la página en que estamos y los colocan en una ventana nueva en forma de texto
// separado por punto y coma (;), listo para copiar y pegar
// version 2 liberada 09 de Febrero 2012
// -- se coloco la opción de elegir un formato de fecha standar como formato de fecha para los diferentes campos de fecha
// la fecha será de la forma yyyy/mm/dd hh:mm, en el caso de el campo ultimo clic, como no lleva hora, se colocara como
// hora las 00:00
// -- el campo media, cuando NO tenga valores (muestra -.--), se regresara el valor 0.000
// -- ahora los datos son pasados a un div y NO a una pestaña nueva, en chrome me dio problemas con las ventanas y por eso
// decidi hacerlo con un div, y se ve mucho mejor
// version 2.1 liberada 29 de Febrero 2012
// se corrigio el script para cuando en el campo "Expira en" salía la palabra expirado
// version 2.2 liberada 04 de Abril 2012
// se agrego la opcion de poder exportar los datos de los referidos directos y rentados al mismo estilo que
// los exporta NeoBux, Nombre de Referido, Referido Desde, Fecha ultimo Clic y Total Clics; la fecha es en el
// mismo formato YYYYMMDD y los datos estan separados por coma
// version 2.3 liberada 06 de Abril 2012
// se corrigieron algunos errores
// version 2.4 liberada 26 de Abril 2012
// se corrigieron algunos errores
// version 2.5 liberada 07 de Mayo 2012
// se corrigieron algunos problemas que no dejaban crear los botones en la página de resumen
// version 2.6 liberada 26 de Julio 2012
// se corrigo un problema con los datos exportados de referidos directos y rentados cuando se usa el script Referrals comments for NeoBux
// version 2.6.1 liberada 20 de Mayo 2013
// se corrigo un problema con los datos exportados de la página resumen, en ocaciones no funcionaba el botón, ya fue corregido
// version 2.6.2 liberada 06 de Julio 2013
// se corrigo un problema con los datos exportados de la página de RR cuando la fecha referido desde estaba en formato relativa
// version 2.6.3 liberada 04 de Octubre 2014
// se realizo la corrección de los datos sobre las renovaciones, motraba el valor de hoy como valor de ayer
// version 2.6.4 liberada 10 de Diciembre 2014
// se corrigio un problema cuando se exportaban los datos el formato estandar y habian referidos 0 clickers, no mostraba los
// datos; igualmente se agregaron los botones Copiar - Pegar en la venta de exportar datos de RD y RR, el botón COPIAR aparece
// en todas las ventanas y permite almacenar la información de cada página en el localStorage, luego en la última ventana con el
// boton PEGAR muestra toda la información en una única ventana
// version 2.6.5 liberada 01 de Marzo 2016, se realizaron unos cambios ya que la pagina de resumen daba errores en unos idiomas
// y se reprogramo la parte que muestra el botón en la página
// version 2.7.0 liberada el 26 de noviembre 2016, se realizaron ajustes en el codigo, se mejoro la aparcienda de la ventana de datos
// se agrego la opcion de copiar toda la información en la utlima ventan de RR (para hacer un solo copy and paste para nuestro archivo)
// version 2.7.1 liberada el 28 de noviembre 2016, se realizaron ajustes para mostrar de forma ordenada los datos de los RR y RD
// version 2.7.2 liberada el 13 de Enero 2017, se realizaron ajustes al código, en ocasiones se borraban las paginas de RR ya cargadas
// version 3.0.0 liberada el 18 de septiembre 2017, se realizaron ajustes grandes, sobre todo la parte del multilenguaje
// los datos de la página de estadisticas cambiaron bastante

/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false */

//***********************************************************************************
//**** Establecemos las Variables Globales						                *****
//***********************************************************************************
"use strict";

//variable para identificar la página; 0 para la de resumen, estadisticas y otras;
//1 para las paginas de referidos directos y rentados
var ebp_Tipo_Pag = 0;
//estas variables son para la pantalla de exportacion de datos
var EBP_AnchoED = 0;
var EBP_AltoED = 0;
//esta variable es para el tipo de formato de fecha a regresar
//si es 1, se regresa la fecha en formato standar, si es 0 se regresa tal cual como esta en la celda
var nFormaFecha = 0;
var opcionesFecha = null;
opcionesFecha = {
	year:      "numeric",
	month:     "short",
	day:       "numeric",
	hour:      "2-digit",
	minute:    "2-digit"
};
var agruparDatosEBP = null;
var fechaStandardEBP = null;
var fechaNeobuxEBP = null;
var BtnLadoDerecho = null;

//variable que indentifica el idioma de la página
var ebp_Idioma = document.body.innerHTML.indexOf("c0 f-") + 5;
ebp_Idioma = document.body.innerHTML.substring(ebp_Idioma, ebp_Idioma + 2);
// Definimos el texto usado por el script según el lenguaje de la página


var scriptLangStrings = {
// Language Strings used by the script
// List of country codes: http://www.iso.org/iso/english_country_names_and_code_elements
	us: {
// English = US
		//Datos usados por NeoBux para indicar: Hoy, Ayer, Mañana, Expirado y Sin Clics aún
		"EBP_DirectText":		"Direct;Rented;You",
		"EBP_isToday":			"Today",
		"EBP_isYesterday":		"Yesterday",
		"EBP_isTomorrow":		"Tomorrow",
		"EBP_isExpired":		"Expired ...",
		"EBP_noClick":			"No Clicks Yet",
		//Datos usados por Neobux para indicar el tipo de fecha en la pagina de RR
		"EBP_ffRelativa":		"Relative",
		"EBP_ffExacta":			"Real",
		//Datos para el cuadro de exportación de datos y de configuración
		"EBP_TextConfig":             "Settings",
		"EBP_TextDatos":              "Data",
		"EBP_TextGuarda":			  "Save",
		"EBP_TextSalir":              "Close",
		"EBP_TextCopiar":			  "Copy",
		"EBP_TextPegar":			   "Paste",
		"EBP_TextMensL1":			  "Export Dates in Standard Format?",
		"EBP_TextMensL2":			  "The data is exported in the format YYYY/MM/DD HH:MM",
		"EBP_TextMensL3":			  'in the data "last click", the hours are placed at 00:00',
		"EBP_TextMensL4":			  "Exporta Data in NeoBux format?",
		"EBP_TextMensL5":			  "This is only for the data of direct referrals and rented",
		"EBP_TextMensL6":             "Group and Show all data on the last page?",
		"EBP_TextMensL7":             "The Copy button is enabled on all pages, and all data is pasted in the last window, separating the groups with a few dashes -",
		"EBP_TextMensL8": 			 '"ExportEBP" button on the right side of the page?',
		"EBP_LastUpdate":             "Last update",
		"EBP_MensLU":                 "Not updated",
		"EBP_TextNOLocalStorgae":     "LocalStorage not supported by your browser",
		"EBP_TextOnlyRDRR":           "Just to page Direct and Rented Referrals!",
		"EBP_TextLastPage":           "Use only on last page"
    },

	//ESPAÑOL
    es: {
		//Datos usados por NeoBux para indicar: Hoy, Ayer, Mañana, Expirado y Sin Clics aún
		"EBP_DirectText":     "Directos;Alquilados;Usted",
		"EBP_isToday":        "Hoy",
        "EBP_isYesterday":    "Ayer",
		"EBP_isTomorrow":     "Mañana",
		"EBP_isExpired":      "Expirado...",
        "EBP_noClick":        "Sin clics aún",
		//Datos usados por Neobux para indicar el tipo de fecha en la pagina de RR
		"EBP_ffRelativa":     "Relativas",
		"EBP_ffExacta":       "Exactas",
		//Datos para el cuadro de exportación de datos y de configuración
		"EBP_TextConfig":         "Configuración",
		"EBP_TextDatos":          "Datos",
		"EBP_TextGuarda":         "Guardar",
		"EBP_TextSalir":          "Cerrar",
		"EBP_TextCopiar":         "Copiar",
		"EBP_TextPegar":          "Pegar",
		"EBP_TextMensL1":         "Exportar las Fechas en Formato Standard?",
		"EBP_TextMensL2":         "La Fecha se Exporta en el formato AAAA/MM/DD HH:MM",
		"EBP_TextMensL3":         "las horas del campo \"último Clic\" se colocan en 00:00",
		"EBP_TextMensL4":         "Exporta datos en formato de NeoBux?",
		"EBP_TextMensL5":         "Esto es solamente para los datos de referidos directos y rentados",
		"EBP_TextMensL6":         "Agrupar y Mostrar todos los datos en la última página?",
		"EBP_TextMensL7":         "Se habilita el botón Copiar en todas las páginas, y se pegan todos los datos en la ultima ventana, separando los grupos con unos guiones --",
		"EBP_TextMensL8": 		  'Botón "ExportEBP" en el lado derecho de la página?',
		"EBP_LastUpdate":         "Ultima actualización",
		"EBP_MensLU":             "Sin actualizar",
		"EBP_TextNOLocalStorgae": "El navegador NO soporta Local Storage!",
		"EBP_TextOnlyRDRR":       "Solo para página de Referidos Directos y Rentados!",
		"EBP_TextLastPage":       "Usar solo en última página"
    },
	//Portugués
    pt: {
		//Datos usados por NeoBux para indicar: Hoy, Ayer, Mañana, Expirado y Sin Clics aún
		"EBP_DirectText":             "Directos;Alugados;Você",
		"EBP_isToday":                "Hoje",
		"EBP_isYesterday":            "Ontem",
		"EBP_isTomorrow":             "Amanhã",
		"EBP_isExpired":              "Expirado ...",
		"EBP_noClick":                "Sem cliques",
		//Datos usados por Neobux para indicar el tipo de fecha en la pagina de RR
		"EBP_ffRelativa":             "Relativas",
		"EBP_ffExacta":               "Reails",
		//Datos para el cuadro de exportación de datos y de configuración
		"EBP_TextConfig":             "configurações",
		"EBP_TextDatos":              "dados",
		"EBP_TextGuarda":             "Salvar",
		"EBP_TextSalir":              "fechar",
		"EBP_TextCopiar":             "cópia",
		"EBP_TextPegar":              "colar",
		"EBP_TextMensL1":             "Exportação datas no formato padrão?",
		"EBP_TextMensL2":             "Exportar como data AAAA / MM / DD HH: MM",
		"EBP_TextMensL3":             "horas de campo \"último clique\" Colocado em 00:00",
		"EBP_TextMensL4":             "Exporta formato de dados em NeoBux?",
		"EBP_TextMensL5":             "Esta informação é apenas para referências diretas e alugados",
		"EBP_TextMensL6":             "Grupo e Mostrar todos os dados na última página?",
		"EBP_TextMensL7":             "O botão Copiar é habilitado em todas as páginas, e todos os dados são colados na última janela, separando os grupos com poucos traços -",
		"EBP_TextMensL8": 			  'Botão "ExportEBP" no lado direito da página?',
		"EBP_LastUpdate":             "Última atualização",
		"EBP_MensLU":                 "Não atualizado",
		"EBP_TextNOLocalStorgae":     "Não LocalStorage suportado pelo seu navegador",
		"EBP_TextOnlyRDRR":           "Só para página direta e referidos alugados!",
		"EBP_TextLastPage":           "Use somente na última página"
    },
	//Griego - Greek
    gr: {
		//Datos usados por NeoBux para indicar: Hoy, Ayer, Mañana, Expirado y Sin Clics aún
		"EBP_DirectText":         "Άμεσοι;Νοικιασμένοι;Εσείς",
		"EBP_isToday":            "σήμερα",
		"EBP_isYesterday":        "χτες",
		"EBP_isTomorrow":         "πρωί",
		"EBP_isExpired":          "Έληξε ...",
		"EBP_noClick":            "Χωρίς κλικ",
		//Datos usados por Neobux para indicar el tipo de fecha en la pagina de RR
		"EBP_ffRelativa":         "Σχετικές",
		"EBP_ffExacta":           "Ακριβείς",
		//Datos para el cuadro de exportación de datos y de configuración
		"EBP_TextConfig":         "Ρυθμίσεις",
		"EBP_TextDatos":          "δεδομένα",
		"EBP_TextGuarda":         "εκτός",
		"EBP_TextSalir":          "κοντά",
		"EBP_TextCopiar":         "αντίτυπο",
		"EBP_TextPegar":          "πάστα",
		"EBP_TextMensL1":         "Ημερομηνίες Εξαγωγή σε τυποποιημένη μορφή;",
		"EBP_TextMensL2":         "Τα δεδομένα που εξάγονται με τη μορφή YYYY/MM/DD HH:MM",
		"EBP_TextMensL3":         "δεδομένα στο \"τελευταίο κλικ\", οι ώρες που διατίθενται στις 00:00",
		"EBP_TextMensL4":         "Εξαγωγή δεδομένων σε μορφή Neobux?",
		"EBP_TextMensL5":         "Αυτό είναι μόνο για τα δεδομένα της άμεσης παραπομπής και ενοικιαζόμενα παραπομπές",
		"EBP_TextMensL6":         "Ομαδοποίηση και Εμφάνιση όλων των δεδομένων στην τελευταία σελίδα",
		"EBP_TextMensL7":         "Το κουμπί Αντιγραφή είναι ενεργοποιημένο σε όλες τις σελίδες και όλα τα δεδομένα είναι επικολλημένα στο τελευταίο παράθυρο, χωρίζοντας τις ομάδες με μερικές παύλες -",
		"EBP_TextMensL8": 		  '"ExportEBP" κουμπί στη δεξιά πλευρά της σελίδας?',
		"EBP_LastUpdate":         "Τελευταία ενημέρωση",
		"EBP_MensLU":             "Δεν ενημερώθηκε",
		"EBP_TextNOLocalStorgae": "Δεν localStorage υποστηρίζεται από τον φυλλομετρητή σας",
		"EBP_TextOnlyRDRR":       "Ακριβώς στη σελίδα Άμεση και Ενοικιαζόμενα Παραπομπές!",
		"EBP_TextLastPage":       "Χρησιμοποιήστε μόνο στην τελευταία σελίδα"
    },
     //indonesio
	id: {
		//Datos usados por NeoBux para indicar: Hoy, Ayer, Mañana, Expirado y Sin Clics aún
		"EBP_DirectText":             "Langsung;Sewa;Anda",
		"EBP_isToday":                "hari ini",
		"EBP_isYesterday":            "kemarin",
		"EBP_isTomorrow":             "Besok",
		"EBP_isExpired":              "Kadaluarsa…",
		"EBP_noClick":                "Belum ada klik",
		//Datos usados por Neobux para indicar el tipo de fecha en la pagina de RR
		"EBP_ffRelativa":             "Relatif",
		"EBP_ffExacta":               "Sebenarnya",
		//Datos para el cuadro de exportación de datos y de configuración
		"EBP_TextConfig":             "pengaturan",
		"EBP_TextDatos":              "Data",
		"EBP_TextGuarda":             "menyimpan",
		"EBP_TextSalir":              "menutup",
		"EBP_TextCopiar":             "salinan",
		"EBP_TextPegar":              "pasta",
		"EBP_TextMensL1":             "Ekspor Tanggal Format Standar?",
		"EBP_TextMensL2":             "Data tersebut diekspor dalam format YYYY/MM/DD HH:MM",
		"EBP_TextMensL3":             'dalam \"klik terakhir\" data, jam ditempatkan pada jam 00:00',
		"EBP_TextMensL4":             "Ekspor data dalam format neobux?",
		"EBP_TextMensL5":             "Ini hanya untuk data dari arahan langsung dan arahan disewa",
		"EBP_TextMensL6":             "Group dan Tampilkan semua data pada halaman terakhir?",
		"EBP_TextMensL7":             "Tombol Copy diaktifkan pada semua halaman, dan semua data yang disisipkan di jendela terakhir, memisahkan kelompok dengan beberapa strip -",
		"EBP_TextMensL8": 			  'Tombol "ExportEBP" di sisi kanan halaman?',
		"EBP_LastUpdate":             "Pembaharuan Terakhir",
		"EBP_MensLU":                 "tidak diperbarui",
		"EBP_TextNOLocalStorgae":     "Tidak localStorage didukung oleh browser Anda",
		"EBP_TextOnlyRDRR":           "Hanya untuk halaman langsung dan Menyewa Arahan!",
		"EBP_TextLastPage":           "Gunakan hanya pada halaman terakhir"
    },
    //finlandés
	fi: {
		//Datos usados por NeoBux para indicar: Hoy, Ayer, Mañana, Expirado y Sin Clics aún
		"EBP_DirectText":             "Suorat;Vuokratut;Sinä",
		"EBP_isToday":                "Tänään",
		"EBP_isYesterday":            "Eilen",
		"EBP_isTomorrow":             "Huomenna",
		"EBP_isExpired":              "Erääntynyt...",
		"EBP_noClick":                "Ei klikkejä",
		//Datos usados por Neobux para indicar el tipo de fecha en la pagina de RR
		"EBP_ffRelativa":         "Suhteelliset",
		"EBP_ffExacta":           "Reaaliset",
		//Datos para el cuadro de exportación de datos y de configuración
		"EBP_TextConfig":         "Asetukset",
		"EBP_TextDatos":          "tiedot",
		"EBP_TextGuarda":         "säästää",
		"EBP_TextSalir":          "lähellä",
		"EBP_TextCopiar":         "kopio",
		"EBP_TextPegar":          "tahna",
		"EBP_TextMensL1":         "Vie päivämäärät Standard Format?",
		"EBP_TextMensL2":         "Data viedään muodossa YYYY/MM/DD HH:MM",
		"EBP_TextMensL3":         'in data \"viimeinen klikkaa\" tunnit sijoitetaan klo 00:00',
		"EBP_TextMensL4":         "Vie Dataa NeoBux muodossa?",
		"EBP_TextMensL5":         "Tämä on vain tiedot suoraan lähetteet ja vuokra lähetteitä",
		"EBP_TextMensL6":         "Ryhmä ja Näytä kaikki tiedot viimeisellä sivulla?",
		"EBP_TextMensL7":         "Kopioi-painiketta on käytössä kaikilla sivuilla, ja kaikki data liitetään viimeisessä ikkunassa, erottamalla ryhmät muutamia viivoja -",
		"EBP_TextMensL8": 		  '"ExportEBP" -painike sivun oikealla puolella?',
		"EBP_LastUpdate":         "Viimeisin päivitys",
		"EBP_MensLU":             "ei ole päivitetty",
		"EBP_TextNOLocalStorgae": "LocalStorage ei tue selaimesi",
		"EBP_TextOnlyRDRR":       "Vain sivulle Suora ja Vuokra siirto!",
		"EBP_TextLastPage":       "Käytä vain viimeiselle sivulle"
    },
    //Sueco
	se: {
		//Datos usados por NeoBux para indicar: Hoy, Ayer, Mañana, Expirado y Sin Clics aún
		"EBP_DirectText":         "Direkta;Hyrda;Du",
		"EBP_isToday":            "Idag",
        "EBP_isYesterday":        "Igår",
		"EBP_isTomorrow":         "I morgon",
		"EBP_isExpired":          "Utgången...",
		"EBP_noClick":            "Inga klick",
		//Datos usados por Neobux para indicar el tipo de fecha en la pagina de RR
		"EBP_ffRelativa":     "Relativa",
		"EBP_ffExacta":       "Reella",
		//Datos para el cuadro de exportación de datos y de configuración
		"EBP_TextConfig":             "inställningar",
		"EBP_TextDatos":              "data som",
		"EBP_TextGuarda":             "Spara",
		"EBP_TextSalir":              "stänga",
		"EBP_TextCopiar":             "kopia",
		"EBP_TextPegar":              "pasta",
		"EBP_TextMensL1":             "Exportera datum i standardformat?",
		"EBP_TextMensL2":             "Uppgifterna exporteras i formatet YYYY/MM/DD HH:MM",
		"EBP_TextMensL3":             'i data \"Klick senast\", är timmarna placerade vid 00:00',
		"EBP_TextMensL4":             "Exportera data i NeoBux format?",
		"EBP_TextMensL5":             "Detta är bara för uppgifter från direkta remisser och hyrda hänvisningar",
		"EBP_TextMensL6":             "Grupp och Visa all data på sista sidan?",
		"EBP_TextMensL7":             "Knappen Kopiera är aktiverad på alla sidor, och alla data klistras in det sista fönstret, separera grupper med några streck -",
		"EBP_TextMensL8": 			  '"ExportEBP" -knappen på höger sida av sidan?',
		"EBP_LastUpdate":             "Senaste uppdateringen",
		"EBP_MensLU":                 "uppdateras inte",
		"EBP_TextNOLocalStorgae":     "Local inte stöds av din webbläsare",
		"EBP_TextOnlyRDRR":           "Bara för att sidan direkt och Hyrda hänvisningar!",
		"EBP_TextLastPage":           "Använd endast på sista sidan"
    },
    //Aleman
	de: {
		//Datos usados por NeoBux para indicar: Hoy, Ayer, Mañana, Expirado y Sin Clics aún
		"EBP_DirectText":         "Direkte;Gemietete;Sie",
		"EBP_isToday":            "Heute",
		"EBP_isYesterday":        "Gestern",
		"EBP_isTomorrow":         "Morgen",
		"EBP_isExpired":          "Abgelaufen...",
		"EBP_noClick":            "Keine Klicks",
		//Datos usados por Neobux para indicar el tipo de fecha en la pagina de RR
		"EBP_ffRelativa":     "Relativ",
		"EBP_ffExacta":       "Echt",
		//Datos para el cuadro de exportación de datos y de configuración
		"EBP_TextConfig":             "Einstellungen",
		"EBP_TextDatos":              "Daten",
		"EBP_TextGuarda":             "sparen",
		"EBP_TextSalir":              "schließen",
		"EBP_TextCopiar":             "Kopie",
		"EBP_TextPegar":              "Paste",
		"EBP_TextMensL1":             "Exportieren Sie Daten im Standard-Format?",
		"EBP_TextMensL2":             "Die Daten werden im Format YYYY/MM/DD HH:MM exportiert",
		"EBP_TextMensL3":			  "Daten in der \"letzter Klick\" werden die Stunden um 00:00 Uhr platziert",
		"EBP_TextMensL4":             "Exportieren von Daten in NeoBux-Format?",
		"EBP_TextMensL5":             "Dies ist nur für die Daten der direkte Verweise und Verweise vermietet",
		"EBP_TextMensL6":             "Gruppe und alle Daten auf der letzten Seite anzeigen?",
		"EBP_TextMensL7":             "Die Copy-Taste wird auf allen Seiten aktiviert und alle Daten werden im letzten Fenster eingefügt, um die Gruppen mit wenigen Strichen zu trennen -",
		"EBP_TextMensL8": 			  '"ExportEBP" -Taste auf der rechten Seite der Seite?',
		"EBP_LastUpdate":             "Letztes Update",
		"EBP_MensLU":                 "Nicht aktualisiert",
		"EBP_TextNOLocalStorgae":     "Localstorage von Ihrem Browser nicht unterstützt",
		"EBP_TextOnlyRDRR":           "Nur um Seite Direkter und mietete erstellten!",
		"EBP_TextLastPage":           "Verwenden Sie nur auf der letzten Seite"
    },
	//Frances
    fr: {
		//Datos usados por NeoBux para indicar: Hoy, Ayer, Mañana, Expirado y Sin Clics aún
		"EBP_DirectTex":          "Directs;Loués;Vous",
		"EBP_isToday":            "Aujourd'hui",
		"EBP_isYesterday":        "Hier",
		"EBP_isTomorrow":         "Demain",
		"EBP_isExpired":          "Expiré...",
		"EBP_noClick":            "Pas de clics",
		//Datos usados por Neobux para indicar el tipo de fecha en la pagina de RR
		"EBP_ffRelativa":         "Relatives",
		"EBP_ffExacta":           "Réelles ",
		//Datos para el cuadro de exportación de datos y de configuración
		"EBP_TextConfig":         "Paramètres",
		"EBP_TextDatos":          "données",
		"EBP_TextGuarda":         "sauver",
		"EBP_TextSalir":          "fermer",
		"EBP_TextCopiar":         "copie",
		"EBP_TextPegar":          "pâte",
		"EBP_TextMensL1":         "Exporter des dates dans un format standard?",
		"EBP_TextMensL2":         "Les données sont exportées dans le format YYYY/MM/DD HH:MM",
		"EBP_TextMensL3":         'dans les données \"Dernier clic\", les heures sont placés à 00:00',
		"EBP_TextMensL4":         "Exporter des données dans le format NeoBux?",
		"EBP_TextMensL5":         "C'est seulement pour les données de références et de renvois directs loués",
		"EBP_TextMensL6":         "Gruppe und alle Daten auf der letzten Seite anzeigen?",
		"EBP_TextMensL7":         "Die Copy-Taste wird auf allen Seiten aktiviert und alle Daten werden im letzten Fenster eingefügt, um die Gruppen mit wenigen Strichen Trennung -",
		"EBP_TextMensL8": 		  'Le bouton "ExportEBP" sur le côté droit de la page?',
		"EBP_LastUpdate":         "Dernière mise à jour",
		"EBP_MensLU":             "Pas à jour",
		"EBP_TextNOLocalStorgae": "LocalStorage pas supporté par votre navigateur",
		"EBP_TextOnlyRDRR":       "Juste à la page directe et Parrainages loués!",
		"EBP_TextLastPage":       "Utiliser uniquement sur la dernière page"
    }
};


//***********************************************************************************
//**** INICIO DE FUNCIONES AUXILIARES											*****
//***********************************************************************************

//***********************************************************************************
//**** Función para regresar el campo indicado en el lenguaje seleccionado      *****
//***********************************************************************************
function localString(key, text) {
    var string, language;
    
    language = ebp_Idioma;
    if ("undefined" !== typeof scriptLangStrings[language]) {
        string = scriptLangStrings[language][key];
    } else if ("undefined" !== typeof scriptLangStrings["US"]) {
        string = scriptLangStrings["US"][key];
    } else {
        return key;
    }
    if (text) {
        string = string.replace("%s", text);
    }
    return string;
}

//***********************************************************************************
//****	función llamada trim() en la clase String								*****
//****	Elimina los espacios antes y despues del texto							*****
//***********************************************************************************
String.prototype.trim = function () {
	var elReemplazo;
    
    elReemplazo = "";
	elReemplazo = this.replace(/^\s+|\s+$/g, "");
	return elReemplazo;
};

//***********************************************************************************
//****funcion para eliminar cualquier codigo html de una cadena de texto		*****
//***********************************************************************************
function stripHTML(cadena) {
	return cadena.replace(/<[^>]+>/g, '');
}


//***********************************************************************************
//****función, que nos permite mostrar un número con dos carácteres en vez de uno****
//***********************************************************************************
Number.prototype.double = function () {
	var nm = String(this);
	if (nm === '0') {
		return nm;
	} else {
		if (nm.length < 2) {
			return '0' + nm;
		} else {
			return nm;
		}
	}
};

//***********************************************************************************
//**** Creamos la Cookie(la copie de NeoBuxOX)									*****
//**** Arguments:																*****
//**** c_name																	*****
//**** value																	*****
//**** exdays																	*****
//**** Cookie value: Option //este valor puede ser 0 para fecha Standar			*****
//**** o 1 para fecha normal													*****
//***********************************************************************************
function setCookie(c_name, value, exdays) {
    // declaramos las variables
	var exdate, fechaVacia, c_value;
	// establecemos la fecha de hoy
	exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
	// establecemos la fecha como vacia para cuando NO se indique la fecha de finalización
	fechaVacia = "";
	if (!exdays) {
		//c_value = escape(value) + "";
		c_value = encodeURIComponent(value) + fechaVacia;
	} else {
		//c_value = escape(value) + "; expires=" + exdate.toUTCString();
		c_value = encodeURIComponent(value) + "; expires=" + exdate.toUTCString();
	}
	//c_value = escape(value) + ((exdays == null) ? "" :"; expires=" + exdate.toUTCString());
    c_value = c_value + "; path=/";
    document.cookie = c_name + "=" + c_value;
}

//***********************************************************************************
//**** función para obtener valores de una Cookie								*****
//**** Get cookie value (la copie de NeoBuxOX)									*****
//***********************************************************************************
function getCookie(c_name) {
    var i, x, y, ARRcookies;
	ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i += 1) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x === c_name) {
            //return unescape(y);
			return decodeURIComponent(y);
        }
    }
    return null;
}

//***********************************************************************************
//**** función Check if a cookie exists and, if not, ask for data				*****
//**** Get cookie value (la copie de NeoBuxOX)									*****
//**** Return data entered														*****
//***********************************************************************************
function checkCookie() {
    // establecemos las variasbles
	var data, DataActual, fechaHoy;
    // leemos la cookie
	data = getCookie("ebp_NeoExport");
	//revisamos si existe la cookie, sino creamos una nueva cookie
    if (data !== null && data !== "") {
		DataActual = data.split("-");
		//Check for malformed cookie
		if (DataActual.length > 1) {
			return data;
        }
    }
    //la cookie no está o está mala, eliminamos la que este y creamos una nueva
    fechaHoy = new Date();
    document.cookie = "ebp_NeoExport=0-0-0;expires=" + fechaHoy.toGMTString() + ";" + ";";
    //Create a new one
	setCookie("ebp_NeoExport", "0-0-0-0", 365);
	return "0-0-0-0";
}

//***********************************************************************************
//*** Funcion redimensionar la página											*****
//***********************************************************************************
function resizeEntirePage() {
    var nbo_divToResize, pixeles, posicion, stexto, nuevopixel, elStyle;
    try {
    	
        //2 divs
        nbo_divToResize = document.evaluate("//div[@style='width:902px;margin:0 auto;margin-left:auto;margin-right:auto;']", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        elStyle = nbo_divToResize.snapshotItem(0).getAttribute('style');
        posicion = elStyle.indexOf('width');
		stexto = elStyle.substring(posicion, 20);
		posicion = stexto.indexOf('px');
		stexto = stexto.substring(0, posicion);
		pixeles = stexto.replace('width:','');
		nuevopixel = (pixeles * 1) + 100;
		
		//2 divs
       	nbo_divToResize.snapshotItem(0).setAttribute('style',nbo_divToResize.snapshotItem(0).getAttribute('style').replace("width:"+pixeles+"px;","width:"+nuevopixel+"px;"));
       	nbo_divToResize.snapshotItem(1).setAttribute('style',nbo_divToResize.snapshotItem(1).getAttribute('style').replace("width:"+pixeles+"px;","width:"+nuevopixel+"px;"));
      	//1 div (font-color is different)
        nbo_divToResize = document.evaluate("//div[@style='width:902px;margin:0 auto;margin-left:auto;margin-right:auto;background-color:#fff;']", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        nbo_divToResize.snapshotItem(0).setAttribute('style',nbo_divToResize.snapshotItem(0).getAttribute('style').replace("width:"+pixeles+"px;","width:"+nuevopixel+"px;"));
        
        //Footer
        nbo_divToResize = document.evaluate("//div[@style='clear:both;background-color:#fff;border:1px solid #888;width:900px;margin-bottom:8px;']", document, null,XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        nbo_divToResize.setAttribute('style',nbo_divToResize.getAttribute('style').replace("width:"+pixeles+"px;","width:"+nuevopixel+"px;"));

    }catch(e){}
}
//***********************************************************************************
//*** Funcion para leer las opciones guardadas en la cookie						*****
//***********************************************************************************
function opcionesSeteoEBP() {
	var opcionesGuardadasEBP;
	// leemos las opciones guardadas en la cookie
	opcionesGuardadasEBP = getCookie("ebp_NeoExport").split("-");
	if (opcionesGuardadasEBP[0] == 1) {
		fechaStandardEBP = true;
	} else {
		fechaStandardEBP = false;
	}
	if (opcionesGuardadasEBP[1] == 1) {
		fechaNeobuxEBP = true;
	} else {
		fechaNeobuxEBP = false;
	}
	if (opcionesGuardadasEBP[2] == 1) {
		agruparDatosEBP = true;
	} else {
		agruparDatosEBP = false;
	}
	if (opcionesGuardadasEBP[3] == 1) {
		BtnLadoDerecho = true;
	} else {
		BtnLadoDerecho = false;
	}
}
//***********************************************************************************
//****esta función deselecciona las opciones del cuadro según corresponda		*****
//***********************************************************************************
function ebpOpcionesCheckBox() {
	var botonoOpcionesFechaEBP;
	
	botonoOpcionesFechaEBP = document.getElementById("opcionesFechaStandardEBP");
	//si el botón de fechas standard es seleccionado, deseleccionamos el boton de exportar datos en el
	//formato de neobux
	if (botonoOpcionesFechaEBP.checked) {
		document.getElementById("opcionesFechaNeobuxEBP").checked = 0;
	}
}
function ebpOpcionesCheckBox_2() {
	var botonoOpcionesFechaEBP;
	
	botonoOpcionesFechaEBP = document.getElementById("opcionesFechaNeobuxEBP");
	//si el botón de exportar datos en formato de neobux es seleccionado, deseleccionamos el boton de 
	//fechas standard
	if (botonoOpcionesFechaEBP.checked) {
		document.getElementById("opcionesFechaStandardEBP").checked = 0;
	}
}


//***********************************************************************************
//**** función para sumar/restar horas y minutos a la fecha actual				*****
//***********************************************************************************
function xDateTime(cnf) {
	//establecemos las variables
	var dte, tme, nDte, dteD, dteM, dteY, tmeH, tmeM, tmeS, msecPerMinute, msecPerHour, msecPerDay, intervaloHrs, intervaloMin, rtn, rtnD, rtnT, rtnNeo;
	//si NO se paso el parámetro cnf, lo establecemos como vacio
	if (!cnf) {
		cnf = {};
	}
	// establecemos los valors en miliisegundos.
	msecPerMinute = 1000 * 60;
	msecPerHour = msecPerMinute * 60;
	msecPerDay = msecPerHour * 24;
	// asignamos los valores a la variable para manejar la fecha, dte = Fecha del día, tme es la hora
	dte = new Date();
	tme = dte.getTime();
	// calculamos los el tiempo en horas y minutos a sumar/restar
	intervaloHrs = 0;
	if (cnf.hours) {
		intervaloHrs = parseInt(cnf.hours * msecPerHour, 10);
	}
	intervaloMin = 0;
	if (cnf.minutes) {
		intervaloMin = parseInt(cnf.minutes * msecPerMinute, 10);
	}
	//seteamos la nueva fecha (nDte) sumando las horas y los minutos pasados como parámetros
	nDte = dte.setTime(parseInt(tme + intervaloHrs + intervaloMin, 10));
	// separamos dia, mes, año y hora, dteD es el DIA, dteM es el MES, dteY es el AÑO, tme es la hora
	dteD = dte.getDate().double();
	dteM = (dte.getMonth() + 1).double();
	dteY = dte.getFullYear();
	// separamos hora, minutos, segundos, tmeH es la hora, tmeM son los minutos, tmeS son los segundos
	tmeH = dte.getHours().double();
	tmeM = dte.getMinutes().double();
	tmeS = dte.getSeconds().double();

	/* creamos ahora las posibles combinaciones de fecha a retornar;
	rtn = Valor a retornar
	rtnD = AÑO / MES / DIA
	rtnT = HORA:MINUTOS
	rtnNeo = AÑOMESDIA (sin la barra separadora /)
	*/
	rtn = '';
	rtnD = dteY + '/' + dteM + '/' + dteD;
	rtnT = tmeH + ':' + tmeM;
	//rtnNeo = dteY + '' + dteM + '' + dteD;
	rtnNeo = dteY.toString() + dteM.toString() + dteD.toString();
	//regresemaos la fecha según los parámetros de cnf
	switch (cnf.type) {
	case 'd':
		rtn = rtnD;
		break;
	case 't':
		rtn = rtnT;
		break;
	case 'dt':
		rtn = rtnD + ' ' + rtnT;
		break;
	case 'td':
		rtn = rtnT + ' ' + rtnD;
		break;
	case 'n':
		rtn = rtnNeo;
		break;
	default:
		rtn = rtnD + ' ' + rtnT;
	}
	return rtn;
}


//***********************************************************************************
//****esta función oculta o muestra la ventana de EBP							*****
//***********************************************************************************
function ocultaMuestraFormulario() {
	var formularioExporta;
	//obtenemos el formulario de Exportación, si está oculto lo mostramos o sino lo ocultamos
	formularioExporta = document.getElementById("EBPformularioExporta");
	if (formularioExporta.style.display == "none") {
		formularioExporta.style.display = "block";
	} else {
		formularioExporta.style.display = "none";
	}
}

//***********************************************************************************
//****esta función guarda los datos del cuadro de opciones						*****
//***********************************************************************************
function opcionarGuardarEBP() {
	var botonoOpFechaStandardEBP, botonoOpFechaNeobuxEBP, botonoOpAgruparEBP, sDatosCheckBox, botonoOpDerecha;
	
	botonoOpFechaStandardEBP = 0;
	botonoOpFechaNeobuxEBP = 0;
	botonoOpAgruparEBP = 0;
	botonoOpDerecha = 0;
	fechaStandardEBP = false;
	fechaNeobuxEBP = false;
	agruparDatosEBP = false;
	BtnLadoDerecho = false;

	if (document.getElementById('opcionesFechaStandardEBP').checked) {
		botonoOpFechaStandardEBP = 1;
		fechaStandardEBP = true;
	}
	
	if (document.getElementById('opcionesFechaNeobuxEBP').checked) {
		botonoOpFechaNeobuxEBP = 1;
		fechaNeobuxEBP = true;
	}
	
	if (document.getElementById('opcionesAgruparDatosEBP').checked) {
		botonoOpAgruparEBP = 1;
		agruparDatosEBP = true;
	}
	
	if (document.getElementById('opcionesBtnDerecha').checked) {
		botonoOpDerecha = 1;
		BtnLadoDerecho = true;
	}
	

	sDatosCheckBox = botonoOpFechaStandardEBP + "-" + botonoOpFechaNeobuxEBP + "-" + botonoOpAgruparEBP + "-" + botonoOpDerecha;
	setCookie("ebp_NeoExport", sDatosCheckBox, 365);
	ocultaMuestraFormulario();
}

//***********************************************************************************
//**** esta función copia los datos del TextArea en localStorage				*****
//**** se crea el registro de la forma CLAVE, VALOR								*****
//**** donde CLAVE sera la propia clave mas la fecha en formato (DDMMYYHHMM)	*****
//***********************************************************************************
function copiarTextAreaEBP() {
	// declaramos las variables
	var sEBPKey, ebp_NumPagina, iIndice, ElTexto, indicePagina, botonCopiar, fechaGuarda, textoFecha, textoClave, numeroPagina, textoMostrar, lineaMensaje, sCodigo, textoCompara;
			
	fechaGuarda = new Date();
	textoFecha = fechaGuarda.getDate().double() + "" + (fechaGuarda.getMonth() + 1).double() + "" + fechaGuarda.getFullYear() + "" + fechaGuarda.getHours().double() + "" + fechaGuarda.getMinutes().double();
	
	//si el tipo de página es 1 (referidos rentados) o 2 (referidos directos),
	if (ebp_Tipo_Pag === 1 || ebp_Tipo_Pag === 2) {
		if (ebp_Tipo_Pag === 1) {
			sEBPKey = "EBPPAGERR";
		} else {
			sEBPKey = "EBPPAGERD";
		}
		
		// validamos si funicona el localstorage
		if (localStorage) {
			//obtenemos el número de la página para guardar el texto
			ebp_NumPagina = document.getElementById("pagina");
			//obtenemos el texto del textarea
			ElTexto = document.getElementById("ventanaEBPtextArea").value;
			ElTexto = ElTexto.replace(/&nbsp;/gi, "");
			
			// Guardar datos en el almacén de la sesión actual
			if (ebp_NumPagina === null) {
				indicePagina = sEBPKey + "001";
				numeroPagina = "001";
			} else {
				numeroPagina = (ebp_NumPagina.selectedIndex + 1);
				if (numeroPagina < 10) {
					numeroPagina = "00" + numeroPagina;
				} else {
					if (numeroPagina < 100) {
						numeroPagina = "0" + numeroPagina;
					}
				}
				indicePagina = sEBPKey + numeroPagina;
			}
			//antes de guardar, borramos cualquier valor de RD o RR si la página es la primera
			if (parseInt(numeroPagina, 10) === 1) {
				for (iIndice = window.localStorage.length - 1; iIndice >= 0; iIndice -= 1) {
					sCodigo = window.localStorage.key(iIndice);
					if (sCodigo.substring(0, 9) == sEBPKey) {
						window.localStorage.removeItem(sCodigo);
					}
				}
			} else {
				//antes de guardar, borramos cualquier valor anterior de dicha pagina
				for (iIndice = 0; iIndice < window.localStorage.length; iIndice += 1) {
					sCodigo = window.localStorage.key(iIndice);
					if (sCodigo.substring(0, 12) == indicePagina) {
						window.localStorage.removeItem(sCodigo);
						break;
					}
				}
			}
			//guardamos los datos nuevos
			window.localStorage.setItem(indicePagina + textoFecha, ElTexto);
			
			//al copiar los datos, colocamos el botón en verde
			botonCopiar = document.getElementById("ventanaEBPBtnCopiar");
			botonCopiar.setAttribute("class", "button medium green");
			
			if (ebp_Idioma === "es") {
				textoMostrar = localString("EBP_LastUpdate") + ":" + fechaGuarda.toLocaleDateString("es-ES", opcionesFecha);
			} else {
				textoMostrar = localString("EBP_LastUpdate") + ":" + fechaGuarda.toLocaleDateString("en-US", opcionesFecha);
			}
	
			lineaMensaje = document.getElementById('EBPformularioExporta').getElementsByTagName('table')[1].getElementsByTagName('td')[0];
			lineaMensaje.textContent = textoMostrar;
		
		} else {
			alert("El navegador NO soporta Local Storage!");
		}
	} else {
		if (ebp_Tipo_Pag === 0) {
			sEBPKey = "EBPPAGERES";
		} else {
			sEBPKey = "EBPPAGEEST";
		}
		if (localStorage) {
			//Si es la pagina de resumen, borramos el localstorage
			if (sEBPKey === "EBPPAGERES") {
				//como es la primera página de resumen, borramos del localstorage toda nuestra informacion
				for (iIndice = window.localStorage.length - 1; iIndice >= 0; iIndice -= 1) {
					sCodigo = window.localStorage.key(iIndice);
					if (sCodigo.indexOf("EBPPAGE") !== -1) {
						window.localStorage.removeItem(sCodigo);
					}
				}
			} else {
				//antes de guardar, borramos cualquier valor anterior de dicha pagina
				for (iIndice = 0; iIndice < window.localStorage.length; iIndice += 1) {
					sCodigo = window.localStorage.key(iIndice);
					if (sCodigo.indexOf("EBPPAGEEST") !== -1) {
						window.localStorage.removeItem(sCodigo);
						break;
					}
				}
			}
			//obtenemos el texto del textarea
			ElTexto = document.getElementById("ventanaEBPtextArea").value;
			ElTexto = ElTexto.replace(/&nbsp;/gi, "");
			
			// Guardar datos en el almacén de la sesión actual
			window.localStorage.setItem(sEBPKey + textoFecha, ElTexto);
			
			//al copiar los datos, colocamos el botón en verde
			botonCopiar = document.getElementById("ventanaEBPBtnCopiar");
			botonCopiar.setAttribute("class", "button medium green");
			
			if (ebp_Idioma === "es") {
				textoMostrar = localString("EBP_LastUpdate") + ":" + fechaGuarda.toLocaleDateString("es-ES", opcionesFecha);
			} else {
				textoMostrar = localString("EBP_LastUpdate") + ":" + fechaGuarda.toLocaleDateString("en-US", opcionesFecha);
			}
	
			lineaMensaje = document.getElementById('EBPformularioExporta').getElementsByTagName('table')[1].getElementsByTagName('td')[0];
			lineaMensaje.textContent = textoMostrar;
		} else {
			alert('El navegador NO soporta Local Storage!');
		}
	}
}

//***********************************************************************************
//**** funcion para leer en orden secuencial los datos de RD o RR				*****
//***********************************************************************************
function LeerRDyRR(sCodigoRef, ultPagDat) {
	var iIndice, iIndicePag, datosReferidos, numeroPagina, sEBPKey, sCodigoCompara;
	
	datosReferidos = "";
	//Leemos las páginas de los RR
	for (iIndicePag = 1; iIndicePag <= ultPagDat; iIndicePag += 1) {
		numeroPagina = iIndicePag;
		if (iIndicePag < 10) {
			numeroPagina = "00" + iIndicePag;
		} else {
			if (iIndicePag < 100) {
				numeroPagina = "0" + iIndicePag;
			}
		}
		for (iIndice = 0; iIndice < window.localStorage.length; iIndice += 1) {
			sEBPKey = window.localStorage.key(iIndice);
			sCodigoCompara = sCodigoRef + numeroPagina;
			if (sEBPKey.substring(0, 12) === sCodigoCompara) {
				datosReferidos =  datosReferidos + window.localStorage.getItem(sEBPKey) + "\n";
			}
		}
	}
	return datosReferidos;
}

//***********************************************************************************
//****esta función pasa los datos del localStorage al textarea					*****
//***********************************************************************************
function pegarAlTextAreaEBP() {
	//declaramos las variables;
	var sEBPKey, ebp_NumPagina, iIndice, ElTexto, indicePagina, botonPegar, paginaActual, cajaDeTexto, textoBase, elTextoRD, sCodigo, ultPagRD, ultPagRR, pagTempo, iIndicePag, numeroPagina;
	ultPagRD = 0;
	ultPagRR = 0;
	//si el tipo de página es 1 (referidos rentados) o 2 (referidos directos)
	if (ebp_Tipo_Pag === 1 || ebp_Tipo_Pag === 2) {
		//obtenemos el número de la última página
		ebp_NumPagina = document.getElementById("pagina");
		// Guardar datos en el almacén de la sesión actual
		if (ebp_NumPagina === null) {
			numeroPagina = 1;
		} else {
			numeroPagina = (ebp_NumPagina.selectedIndex + 1);
		}
		//si es la pagina de RR, verificamos si está activa la opcion de agrupar datos
		if (ebp_Tipo_Pag === 1) {
			sEBPKey = "EBPPAGERR";
			//SI está activa la opción de agrupar datos, los agrupamos, sino solamente pegamos los datos de los RR
			if (agruparDatosEBP === true) {
				textoBase = "********************************************************************************" + "\n";
				textoBase = textoBase + "* Summary" + "\n";
				textoBase = textoBase + "********************************************************************************" + "\n";
				textoBase = textoBase + "SummaryTexto" + "\n";
				textoBase = textoBase + "********************************************************************************" + "\n";
				textoBase = textoBase + "* Statistics" + "\n";
				textoBase = textoBase + "********************************************************************************" + "\n";
				textoBase = textoBase + "StatisticsTexto" + "\n";
				textoBase = textoBase + "********************************************************************************" + "\n";
				textoBase = textoBase + "* Direct referrals" + "\n";
				textoBase = textoBase + "********************************************************************************" + "\n";
				textoBase = textoBase + "DirectreferralsTexto" + "\n";
				textoBase = textoBase + "********************************************************************************" + "\n";
				textoBase = textoBase + "* Rented referrals" + "\n";
				textoBase = textoBase + "********************************************************************************" + "\n";
				textoBase = textoBase + "RentedreferralsTexto" + "\n";
				textoBase = textoBase + "********************************************************************************";
				elTextoRD = "";
				ElTexto = "";
				//para el resumen y estadisticas, sustituimos la clave con el texto
				for (iIndice = 0; iIndice < window.localStorage.length; iIndice += 1) {
					sEBPKey = window.localStorage.key(iIndice);
					switch (sEBPKey.substring(0, 9)) {
					case "EBPPAGERE": //pagina Resumen
						textoBase = textoBase.replace("SummaryTexto", window.localStorage.getItem(sEBPKey));
						break;
					case "EBPPAGEES": //pagina estadisticas
						textoBase = textoBase.replace("StatisticsTexto", window.localStorage.getItem(sEBPKey));
						break;
					case "EBPPAGERR": //Referidos rentados
						pagTempo = parseInt(sEBPKey.substring(10, 12), 10);
						if (pagTempo > ultPagRR) {
							ultPagRR = pagTempo;
						}
						break;
					case "EBPPAGERD": //Referidos directos
						pagTempo = parseInt(sEBPKey.substring(10, 12), 10);
						if (pagTempo > ultPagRD) {
							ultPagRD = pagTempo;
						}
						break;
					default:
						break;
					}
				}
				//Leemos las páginas de los RD
				elTextoRD = LeerRDyRR("EBPPAGERD", ultPagRD);
				//Leemos las páginas de los RR
				ElTexto = LeerRDyRR("EBPPAGERR", ultPagRR);
				
				textoBase = textoBase.replace("DirectreferralsTexto", elTextoRD);
				textoBase = textoBase.replace("RentedreferralsTexto", ElTexto);
				ElTexto = textoBase;
			} else {
				ultPagRR = numeroPagina;
				//procesamos los datos ya que estamos en la última o unica página
				//buscamos todos los datos almacenados con el texto EBPPAGERR* y lo copiamos en el textarea
				ElTexto = LeerRDyRR("EBPPAGERR", ultPagRR);
			}
		} else {
			ultPagRD = numeroPagina;
			//procesamos los datos ya que estamos en la última o unica página
			//buscamos todos los datos almacenados con el texto EBPPAGERD y lo copiamos en el textarea
			ElTexto = LeerRDyRR("EBPPAGERD", ultPagRD);
		}
		
		// Copiamos la información en el cuadro de texto
		cajaDeTexto = document.getElementById("ventanaEBPtextArea");
		cajaDeTexto.value = "";
		cajaDeTexto.value = ElTexto;
		
		//al copiar los datos, colocamos el botón en verde
		botonPegar = document.getElementById("ventanaEBPBtnPegar");
		botonPegar.setAttribute("class", "button medium green");
		
	} else {
		alert("No Disponible!");
	}
}

//***********************************************************************************
//**** Creamos el Botón de NeoEstadisticas BigPetorman							*****
//***********************************************************************************
function crearBotonEBP(btnNombre, btnFuncion) {
	var botonEBP, botonImagen, bontonImgImagen, botonTexto, sOpcCheckBox, botonEBPNew, tableNeobux, colEspacio, colDiv;
	
	//verificamos en la cookie cual es el tipo de formato para exportar los datos
	sOpcCheckBox = checkCookie();
	sOpcCheckBox = sOpcCheckBox.split("-");
	if (sOpcCheckBox[3] == 1) {
		BtnLadoDerecho = true;
	} else {
		BtnLadoDerecho = false;
	}
	
	//creamos el boton
	botonEBP = document.createElement("table");
	botonEBP.setAttribute("id", "NeoExportEBP");	
	botonEBP.setAttribute("style","width:100px");	

	botonImagen = document.createElement("td");
	botonImagen.setAttribute("style", "padding-right:1px;");
	botonImagen.setAttribute("align", "left");

	bontonImgImagen = document.createElement("img");
	bontonImgImagen.setAttribute("src", "https://img.neobux.com/imagens/texto_32.png");
	bontonImgImagen.setAttribute("height", "20");
	bontonImgImagen.setAttribute("border", "0");
	bontonImgImagen.setAttribute("width", "20");
	botonImagen.appendChild(bontonImgImagen);

	botonTexto = document.createElement("td");
	botonTexto.innerHTML = btnNombre;

	botonEBP.appendChild(botonImagen);
	botonEBP.appendChild(botonTexto);

	botonEBP.addEventListener('click', btnFuncion, false);
	botonEBP.style.textAlign = "center";
	botonEBP.style.padding = "2px";
	botonEBP.style.display = "block";
	botonEBP.style.cursor = "pointer";


	if (BtnLadoDerecho === true) {
        
        //Obtain table
        //tableNeobux = document.evaluate("//table[@style='width:100%;height:100%;']", document, null,XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        tableNeobux = document.evaluate("//table[@style='width:100%;']", document, null,XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        
        //Create a new column and set up properties
        colDiv = document.createElement("td");
        colDiv.setAttribute("style","width:100px");
        colDiv.setAttribute("valign","top");
        colDiv.setAttribute("rowspan","2");
        colDiv.setAttribute("nowrap","nowrap");
        //colDiv.setAttribute("style","text-align:left;");
        colDiv.appendChild(botonEBP);	

		//Add a column to separate columns because of NeoBux design
        colEspacio = document.createElement("td");
        colEspacio.setAttribute("style","width:6px");
        colEspacio.setAttribute("rowspan","2");
        colEspacio.innerHTML = "&nbsp;";
        tableNeobux.rows[0].appendChild(colEspacio);
        //Add the new column to the table
        tableNeobux.rows[0].appendChild(colDiv);
        
        resizeEntirePage();

	} else {
		document.getElementById("menu_w").appendChild(botonEBP);	
	}
	
}

//***********************************************************************************
//****esta Crea el div para los datos y/o opciones								*****
//***********************************************************************************
function crearFormularioEBP(nTipo) {
	//declaramos las variables
	var numeroPagina, opcionBtnPegar, opcionBtnCopiar, ventanaEBP, subTablaEBP, subFilaEBP, subColumnaEBP, subImagenEBP, subParrafoEBP, subSpanEBP, textAreaEBP, textoDiv, checkbox;
	
	// leemos las opciones guardadas en la cookie
	opcionesSeteoEBP();	
	// Creamos la Ventana para los Datos a Exportar
	if (nTipo === 2) {
		// Si la página es la última, se activa el botón de PEGAR, de lo contrario NO (RR)
		if (ebp_Tipo_Pag === 1) {
			opcionBtnCopiar = "visible";
			numeroPagina = document.getElementById("pagina");
			if (numeroPagina === null) {
				// si es nulo el numero de pagina igualmente habilitamos el botón
				opcionBtnPegar = "visible";
			} else {
				//verificamos si la página actual es igual a la última página
				if ((numeroPagina.selectedIndex + 1) === numeroPagina.length) {
					opcionBtnPegar = "visible";
				} else {
					opcionBtnPegar = "hidden";
				}
			}
			
		} else {
			// Si la página es la última, se activa el botón de PEGAR, de lo contrario NO (RD)
			if (ebp_Tipo_Pag === 2) {
				opcionBtnCopiar = "visible";
				numeroPagina = document.getElementById("pagina");
				if (numeroPagina === null) {
					// si es nulo el numero de pagina igualmente habilitamos el botón
					opcionBtnPegar = "visible";
				} else {
					//verificamos si la página actual es igual a la última página
					if ((numeroPagina.selectedIndex + 1) === numeroPagina.length) {
						opcionBtnPegar = "visible";
					} else {
						opcionBtnPegar = "hidden";
					}
				}
				//si está activa la opcion de agrupardatos, deshabilitamos el botón de pegar en lo RD
				if (agruparDatosEBP === true) {
					opcionBtnPegar = "hidden";
				}
			} else {
			
				opcionBtnPegar = "hidden";
				opcionBtnCopiar = "hidden";

				// si está activa la opción de agrupar datos, activamos el botón copiar
				if (agruparDatosEBP === true) {
					opcionBtnCopiar = "visible";
				}
			}
		}
		
		// ahora si creamos el DIV contenedor y establecemos su tamaño
		// ahora si creamos el DIV contenedor y establecemos su tamaño
		ventanaEBP = document.createElement("div");
		ventanaEBP.setAttribute("id", "EBPformularioExporta");
		ventanaEBP.style.position = "absolute";
		ventanaEBP.style.top = 0;
		ventanaEBP.style.bottom = 0;
		ventanaEBP.style.right = 0;
		ventanaEBP.style.left = 0;
		ventanaEBP.style.margin = "auto";
		ventanaEBP.style.width = ebp_AnchoED + "px";
		ventanaEBP.style.height = ebp_AltoED + "px";
		ventanaEBP.style.background = "#FFF";
		ventanaEBP.style.border = "1px solid #333";
		ventanaEBP.style.padding = "10px";
		ventanaEBP.style.display = "none";
		
		textoDiv = '<table style="width: 100%;"><tr style="width: 100%;"><td style="width: 26px; text-align: left;"><img src="https://img.neobux.com/imagens/texto_32.png" style="border: 0px;">';
		textoDiv = textoDiv + '</td><td style="font-size: 14px; font-weight: bold; padding-left: 5px; font-family: Arial; text-align: left;">NeoExportEBP ' + localString("EBP_TextDatos") + '</td>';
		textoDiv = textoDiv + '<td style="text-align: right;"><a id="ventanaEBPBtnCerrar" class="button medium black" onselectstart="return false;"><span>' + localString("EBP_TextSalir") + '</span></a></td></tr></table>';
		textoDiv = textoDiv + '<textarea id="ventanaEBPtextArea" onmouseover="this.select();" onmouseup="this.select();" onmousedown="this.select();" style="width: ' + (ebp_AnchoED - 5) + 'px; height: ' + (ebp_AltoED - 70) + 'px; resize: none;"></textarea>';
		textoDiv = textoDiv + '<tr style="width: 100%; height: 4px;"></tr><table style="width: 100%;"><tr style="width: 100%;"><td style="width: 80%; font-size: 12px; font-weight: bold; padding-left: 5px; font-family: Arial; text-align: left;"></td>';
		textoDiv = textoDiv + '<td style="width: 10%; visibility: ' + opcionBtnPegar + ';"><a id="ventanaEBPBtnPegar" class="button medium grey" onselectstart="return false;"><span>' + localString("EBP_TextPegar") + '</span></a></td>';
		textoDiv = textoDiv + '<td style="width: 10%; visibility: ' + opcionBtnCopiar + ';"><a id="ventanaEBPBtnCopiar" class="button medium grey" onselectstart="return false;"><span>' + localString("EBP_TextCopiar") + '</span></a></td></tr></table>';
		ventanaEBP.innerHTML = textoDiv;
		// Lo insertas al final del body
		document.body.appendChild(ventanaEBP);
		//asignamos las funciones a los botones Cerrar, Copiar y Pegar
		document.getElementById("ventanaEBPBtnCerrar").onclick = function () {ocultaMuestraFormulario()};
		document.getElementById("ventanaEBPBtnPegar").onclick = function () {pegarAlTextAreaEBP()};
		document.getElementById("ventanaEBPBtnCopiar").onclick = function () {copiarTextAreaEBP()};
		
	// Creamos la Ventana para las opciones
	} else {
		// ahora si creamos el DIV contenedor para las opciones
		ventanaEBP = document.createElement("div");
		ventanaEBP.setAttribute("id", "EBPformularioExporta");
		ventanaEBP.style.display = "none";
		ventanaEBP.style.position = "absolute";
		ventanaEBP.style.top = 0;
		ventanaEBP.style.bottom = 0;
		ventanaEBP.style.right = 0;
		ventanaEBP.style.left = 0;
		ventanaEBP.style.margin = "auto";
		ventanaEBP.style.width = ebp_AnchoED + "px";
		ventanaEBP.style.height = ebp_AltoED + "px";
		ventanaEBP.style.background = "#FFF";
		ventanaEBP.style.border = "1px solid #333";
		ventanaEBP.style.padding = "10px";
		
		textoDiv = '<table style="width: 100%;"><tr style="width: 100%;"><td style="width: 26px; text-align: left;"><img src="https://img.neobux.com/imagens/texto_32.png" style="border: 0px;"></td>';
		textoDiv = textoDiv + '<td style="font-size: 14px; font-weight: bold; padding-left: 5px; font-family: Arial; text-align: left;">NeoExportEBP ' + localString("EBP_TextConfig") + '</td><td style="text-align: right; width: 10%;">';
		textoDiv = textoDiv + '<a id="ventanaEBPBtnGuardar" class="button medium black" onselectstart="return false;"><span>' + localString("EBP_TextGuarda") + '</span></a></td><td style="text-align: right; width: 10%;">';
		textoDiv = textoDiv + '<a id="ventanaEBPBtnCerrar" class="button medium black" onselectstart="return false;"><span>' + localString("EBP_TextSalir") + '</span></a></td></tr></table>';
		textoDiv = textoDiv + '<table style="width: ' + (ebp_AnchoED - 5) + 'px; border: 1px solid rgb(51, 51, 51);"><tr style="width: 100%;"><td><label style="font-size: 12px; padding: 10px;">' + localString("EBP_TextMensL1") + '</label>';
		textoDiv = textoDiv + '<input id="opcionesFechaStandardEBP" type="checkbox" name="opcionesFechaNeobuxEBP" value="' + fechaStandardEBP + '" style="padding: 4px;"></td></tr><tr style="width: 100%; height: 4px;"><td></td></tr>';
		textoDiv = textoDiv + '<tr style="width: 100%;"><td><span style="padding: 4px; font-size: 10px;">' + localString("EBP_TextMensL2") + ' <br />' + localString("EBP_TextMensL3") + '</span></td></tr>';
		textoDiv = textoDiv + '<tr style="width: 100%; height: 4px;"><td></td></tr><tr style="width: 100%;"><td><label style="padding: 10px; font-size: 12px;">' + localString("EBP_TextMensL4") + '</label>';
		textoDiv = textoDiv + '<input id="opcionesFechaNeobuxEBP" type="checkbox" name="opcionesFechaNeobuxEBP" value="' + fechaNeobuxEBP + '" style="padding: 4px;"></td></tr><tr style="width: 100%; height: 4px;"><td></td></tr></table>';
		textoDiv = textoDiv + '<table style="width: 495px;"><tr style="width: 100%;"><td><span style="padding: 4px; font-size: 10px; width: 100%;">' + localString("EBP_TextMensL5") + '</span></td></tr>';
		textoDiv = textoDiv + '<tr style="width: 100%; height: 8px;"><td></td></tr></table><table style="width: 495px; border: 1px solid rgb(51, 51, 51);"><tr style="width: 100%;"><td><label style="font-size: 12px; padding: 10px;">' + localString("EBP_TextMensL6") + '</label>';
		textoDiv = textoDiv + '<input id="opcionesAgruparDatosEBP" type="checkbox" name="opcionesAgruparDatosEBP" value= "'+agruparDatosEBP+'" style="padding: 4px;"></td></tr><tr style="width: 100%; height: 4px;"><td></td></tr>';
		textoDiv = textoDiv + '<tr style="width: 100%;"><td><span style="padding: 4px; font-size: 10px;">' + localString("EBP_TextMensL7") + '</span></td></tr></table>';
		textoDiv = textoDiv + '<table style="width: 495px;"><tr style="width: 100%; height: 8px;"><td></td></tr></table>';
		textoDiv = textoDiv + '<table style="width: 495px; border: 1px solid rgb(51, 51, 51);"><tr style="width: 100%;"><td><label style="font-size: 12px; padding: 10px;">' + localString("EBP_TextMensL8") + '</label>';
		textoDiv = textoDiv + '<input id="opcionesBtnDerecha" type="checkbox" name="opcionesBtnDerecha" value= "'+BtnLadoDerecho+'" style="padding: 4px;"></td></tr><tr style="width: 100%; height: 4px;"><td></td></tr></table>';

		ventanaEBP.innerHTML = textoDiv;
		
		// Lo insertas al final del body
		document.body.appendChild(ventanaEBP);
		//asignamos las funciones a los botones Cerrar, guardar y a las checkbox
		document.getElementById("ventanaEBPBtnCerrar").onclick = function () {ocultaMuestraFormulario()};
		document.getElementById("ventanaEBPBtnGuardar").onclick = function () {opcionarGuardarEBP()};
		document.getElementById("opcionesFechaStandardEBP").onclick = function () {ebpOpcionesCheckBox()};
		document.getElementById("opcionesFechaNeobuxEBP").onclick = function () {ebpOpcionesCheckBox_2()};
		
		checkbox = document.getElementById('opcionesBtnDerecha');
        checkbox.checked = BtnLadoDerecho;
        checkbox = document.getElementById('opcionesAgruparDatosEBP');
        checkbox.checked = agruparDatosEBP;
		
	}
}

//***********************************************************************************
//****	función para mostrar la fecha de la última actualizacion de datos		*****
//***********************************************************************************
function mostrarUltAct(tipoVentana) {
	var numeroPagina, sEBPKey, ultimaFecha, iIndice, sClave, lineaMensaje, fechaHoy, msecPerMinute, msecPerHour, msecPerDay, intervaloHrs, intervaloMin,  textoMostrar;
	
	opcionesSeteoEBP();
	//obtenemos el texto a buscar en el localstorage
	if (tipoVentana === "EBPPAGERR" || tipoVentana === "EBPPAGERD") {
		numeroPagina = document.getElementById("pagina");
		if (numeroPagina === null) {
			numeroPagina = 1;
		} else {
			numeroPagina = numeroPagina.selectedIndex + 1;
		}
		
		if (numeroPagina < 10) {
			numeroPagina = "00" + numeroPagina;
		} else {
			if (numeroPagina < 100) {
				numeroPagina = "0" + numeroPagina;
			}
		}
		sClave = tipoVentana + numeroPagina;
	} else {
		if (agruparDatosEBP !== true){
			lineaMensaje = document.getElementById('EBPformularioExporta').getElementsByTagName('table')[1].getElementsByTagName('td')[0];
			lineaMensaje.textContent = "";
			return;	
		}
		sClave = tipoVentana;
	}
	ultimaFecha = "";
	for (iIndice = 0; iIndice < window.localStorage.length; iIndice += 1) {
		sEBPKey = window.localStorage.key(iIndice);
		if (sEBPKey.indexOf(sClave) !== -1) {
			ultimaFecha = sEBPKey.substring(sClave.length);
			break;
		}
	}
	
	//si no hay fecha, colocamos el mensaje, de lo contario colocamos la fecha
	if (ultimaFecha === "") {
		textoMostrar = localString("EBP_LastUpdate") + ":" + localString("EBP_MensLU");
	} else {
		//seteamos la nueva fecha
		fechaHoy = new Date(ultimaFecha.substring(4, 8), ultimaFecha.substring(2, 4) - 1, ultimaFecha.substring(0, 2), ultimaFecha.substring(8, 10), ultimaFecha.substring(10, 12), '00');
		
		if (ebp_Idioma === "es") {
			textoMostrar = localString("EBP_LastUpdate") + ":" + fechaHoy.toLocaleDateString("es-ES", opcionesFecha);
		} else {
			textoMostrar = localString("EBP_LastUpdate") + ":" + fechaHoy.toLocaleDateString("en-US", opcionesFecha);
		}
	}
	
	lineaMensaje = document.getElementById('EBPformularioExporta').getElementsByTagName('table')[1].getElementsByTagName('td')[0];
	lineaMensaje.textContent = textoMostrar;
	
}

//***********************************************************************************
//****	función para mostrar la ventana con los datos							*****
//***********************************************************************************
function mostrarVentana(elTexto, tipoVentana) {
	// declaramos las variables 
	var ebpTextAreaDatos;
	
	//obtenemos el campo de los datos y le pasamos los mismos
	ebpTextAreaDatos = document.getElementById("ventanaEBPtextArea");
	ebpTextAreaDatos.value = elTexto;
	mostrarUltAct(tipoVentana);
	ocultaMuestraFormulario();
}

//***********************************************************************************
//**** Para la página de Opciones Personales									*****
//***********************************************************************************
function mostrarVentanaOpciones() {
	var formularioOpciones, formularioSetting;
	
	//obtenemos el formulario de Opciones, si está oculto lo mostramos o sino lo ocultamos
	formularioOpciones = document.getElementById('EBPformularioExporta');
	if (formularioOpciones.style.display === 'none') {
		formularioOpciones.style.display = 'block';
	} else {
		formularioOpciones.style.display = 'none';
	}
}

//***********************************************************************************
//****esta función retorna un array con los valores de la gráfica				*****
//****este código lo tome del nebuxox de proxen									*****
//***********************************************************************************
function obtainChartValues(arg,nidchart,especial){
    var script, chartId, temp, values, temp02, sNombTrend;

    script = window.atob(arg);
	chartId = script.split("'")[1];
    temp = "";
    values = new Array();

    //decodeURIComponent(escape
	
    temp = script.split("data:[")[nidchart];
    temp = temp.substring(0,temp.indexOf(']')).split(',');
    
    temp02 = script.split("data:[")[nidchart - 1];
    temp02 = temp02.split("escape");
    if(especial == 0){
    	sNombTrend = jQuery('<div />').html(decodeURIComponent(escape(temp02[temp02.length-1]))).text();
    	sNombTrend = sNombTrend.replace("'))).text(),","");
    	sNombTrend = sNombTrend.replace("('","");
    	sNombTrend = sNombTrend.trim ();
    } else {
    	sNombTrend = decodeURIComponent(escape(temp02[temp02.length-1]));
    	sNombTrend = sNombTrend.split("'")[1];
    }

    values[0] = sNombTrend;
    values[1] = chartId;

    return values.concat(temp);
}


//***********************************************************************************
//**** esta función es para pasar los campos de fecha a un formato standard		*****
//**** de la forma yyyy/mm/dd hh:mm												*****
//**** los parámetros son:														*****
//**** dFechaOrg: fecha a validar												*****
//**** neoebp_today: fecha del día para comparar								*****
//**** dTipo: indica fecha referidos desde (1), expira en (2) o ultimo clic (3)	*****
//**** nTipoFecha: 0 indica que es fecha exacta, 1 que es relativa				*****
//**** nTipoExporta: 0 indica que es normal, 1 exportar datos al estilo neobux	*****
//***********************************************************************************
function obtieneFechaStandard(dFechaOrg, neoebp_today, dTipo, nTipFecha, nTipoExporta) {
	//creamos las variables a usar en la funcion, NeoEBP_Fecha es el valor a retornar
	var fechaNueva, fechaHoy, dFechaTempo, stringHora, horaFechaValidar, minuntosFechaValidar, stringFecha, DiasFechaValidar, NeoEBP_Fecha;
	var ebp_isToday, ebp_isYesterday, ebp_isTomorrow, ebp_isExpired;
	//*****************************************************************************************************
	//ahora, verificamos si el campo dFechaOrg contiene la palabra sin clics aún, si es así
	//simplemente regresamos el mismo valor ya que no sería necesario hacer mas nada
	//*****************************************************************************************************
	if (dFechaOrg.indexOf(localString("EBP_noClick")) !== -1) {
		//si se exportan los datos al estilo neobux y no se han echo clics, se regresa el valor de 20990101
		if (dTipo === 3 && nTipoExporta === 1) {
			return "20990101";
		} else {
			return "0";
		}
	}
	
	//*****************************************************************************************************
	//Eliminamos el caracter - de la la fecha (en caso de que lo tenga)
	//si la variable contien datos entre parentesis, estos datos son colocados por algún script, 
	//procedemos a eliminarlos para dejar solamente los datos originales
	//*****************************************************************************************************
	dFechaOrg = dFechaOrg.replace('-', '');
	if (dFechaOrg.indexOf('(') !== -1) {
		dFechaOrg = dFechaOrg.substring(0, dFechaOrg.indexOf('('));
	}
	
	//*****************************************************************************************************
	//verificamos la fecha, y normalizamos lo siguiente
	//Hoy, lo cambiamos por la fecha de hoy
	//Ayer, lo cambiamos por la fecha de hoy - 1
	//Mañana, lo cambiamos por la fecha de hoy + 1 
	//Expirado, lo cambiamos por la fecha de hoy + la hora actual
	//*****************************************************************************************************
	//obtenemos la fecha actual, con formato YYYY/MM/DD
	ebp_isToday = localString("EBP_isToday");
	ebp_isYesterday = localString("EBP_isYesterday");
	ebp_isTomorrow = localString("EBP_isTomorrow");
	ebp_isExpired = localString("EBP_isExpired");

	fechaHoy = xDateTime({ type: 'd'});
	if (dFechaOrg.indexOf(ebp_isToday) !== -1) {
		//reemplazamos el texto hoy; si la fecha es relativa, colocamos 0, sino, colocamos la fecha
		if (nTipFecha === 1) {
			dFechaOrg = dFechaOrg.replace(ebp_isToday, 0);
		} else {
			dFechaOrg = dFechaOrg.replace(ebp_isToday, fechaHoy);
		}
	} else if (dFechaOrg.indexOf(ebp_isYesterday) !== -1) {
		// reemplazamos el texto ayer; si la fecha es relativa, colocamos 1, sino, colocamos la fecha - 1
		// Obtenemos la fecha actual - 1 dia (dFechaTempo)
		dFechaTempo = xDateTime({ type: 'd', hours: -24});
		if (nTipFecha === 1) {
			dFechaOrg = dFechaOrg.replace(ebp_isYesterday, 1);
		} else {
			dFechaOrg = dFechaOrg.replace(ebp_isYesterday, dFechaTempo);
		}
	} else if (dFechaOrg.indexOf(ebp_isTomorrow) !== -1) {
		// reemplazamos el texto Mañana; si la fecha es relativa, colocamos 1, sino, colocamos la fecha + 1
		// Obtenemos la fecha actual + 1 dia (dFechaTempo)
		dFechaTempo = xDateTime({ type: 'd', hours: 24});
		if (nTipFecha === 1) {
			dFechaOrg = dFechaOrg.replace(ebp_isTomorrow, 1);
		} else {
			dFechaOrg = dFechaOrg.replace(ebp_isTomorrow, dFechaTempo);
		}
	} else if (dFechaOrg.indexOf(ebp_isExpired) !== -1) {
		//reemplazamos el texto Expirado; si la fecha es relativa, colocamos 0, sino, colocamos la fecha de hoy
		if (nTipFecha === 1) {
			dFechaOrg = dFechaOrg.replace(ebp_isExpired, 0);
		} else {
			dFechaOrg = dFechaOrg.replace(ebp_isExpired, fechaHoy);
		}
	}
	//*****************************************************************************************************
	//si la fecha es relativa, obtenemos los dias, horas y minutos a agregar o restar a la fecha
	//*****************************************************************************************************
	if (nTipFecha === 1) {
		if (dFechaOrg.indexOf(":") !== -1) {
			stringHora = dFechaOrg.split(":");
			horaFechaValidar = parseInt(stringHora[0].substring(stringHora[0].length - 2), 10);
			minuntosFechaValidar = parseInt(stringHora[1].replace("&nbsp;", ""), 10);
		} else {
			horaFechaValidar = 0;
			minuntosFechaValidar = 0;
		}
		stringFecha = dFechaOrg.split(" ");
		DiasFechaValidar = stringFecha[0];
		//convertimos los días a horas
		DiasFechaValidar = parseInt(DiasFechaValidar * 24, 10);
		horaFechaValidar = (horaFechaValidar + DiasFechaValidar);
		//si dTipo es (1) referidos desde o (3) ultimo clic; le restamos a la fecha actual
		//la fecha dFechaOrg; si es (2) expira en, se la sumamos
		if (dTipo !== 2) {
			horaFechaValidar = horaFechaValidar * -1;
			minuntosFechaValidar = minuntosFechaValidar * -1;
			//si dTipo es (3) ultimo clic regresamos la fecha sin horas, sino, con horas
			if (dTipo === 3) {
				//si nTipoExporta = 0 regresamos la fecha normal sino al estilo neobux
				if (nTipoExporta === 0) {
					NeoEBP_Fecha = xDateTime({ type: 'd', hours: horaFechaValidar, minutes: minuntosFechaValidar });
				} else {
					NeoEBP_Fecha = xDateTime({ type: 'n', hours: horaFechaValidar, minutes: minuntosFechaValidar });
				}
			} else {
				//si nTipoExporta = 0 regresamos la fecha normal sino al estilo neobux
				if (nTipoExporta === 0) {
					NeoEBP_Fecha = xDateTime({ type: 'dt', hours: horaFechaValidar, minutes: minuntosFechaValidar });
				} else {
					NeoEBP_Fecha = xDateTime({ type: 'n', hours: horaFechaValidar, minutes: minuntosFechaValidar });
				}
			}
		} else {
			//si nTipoExporta = 0 regresamos la fecha normal sino al estilo neobux
			if (nTipoExporta === 0) {
				NeoEBP_Fecha = xDateTime({ type: 'dt', hours: horaFechaValidar, minutes: minuntosFechaValidar });
			} else {
				NeoEBP_Fecha = xDateTime({ type: 'n', hours: horaFechaValidar, minutes: minuntosFechaValidar });
			}
		}
		return NeoEBP_Fecha;
	} else {
		//al ser una fecha exacta, regresamos la fecha tal cual, le quitamos la palabra a las
		stringFecha = dFechaOrg.split(" ");
		NeoEBP_Fecha = stringFecha[0];
		//si nTipoExporta = 0 regresamos la fecha normal sino al estilo neobux
		if (nTipoExporta === 0) {
			//si tiene hora, la agregamos a NeoEBP_Fecha
			if (dFechaOrg.indexOf(":") !== -1) {
				stringHora = dFechaOrg.split(":");
				horaFechaValidar = parseInt(stringHora[0].substring(stringHora[0].length - 2), 10);
				minuntosFechaValidar = parseInt(stringHora[1].replace("&nbsp;", ""), 10);
				NeoEBP_Fecha = NeoEBP_Fecha + ' ' + horaFechaValidar.double() + ':' + minuntosFechaValidar.double();
			}
		} else {
			NeoEBP_Fecha = NeoEBP_Fecha.replace(/\//g, '');
		}
		return NeoEBP_Fecha;
	}
}


//***********************************************************************************
//**** FIN DE FUNCIONES AUXILIARES											*****
//***********************************************************************************

//***********************************************************************************
//**** INICIO DE FUNCIONES DE PROCEDIMIENTOS									*****
//***********************************************************************************
//***********************************************************************************
//**** EXPORTAR DATOS DE USUARIO**** TOMADO DEL SCRIPT DE CoAzNeoExporter		*****
//**** Resumen de Cuenta, leemos la información actual							*****
//***********************************************************************************
function EBP_Copia_Resumen() {
	// Declaramos las variables a usar en la funcion
	var i, n, mitexto, EBP_Matrix_Item, datosMatrix, puntoCorte, totalNodos, totalAdPrizes, EBP_scharts, valorXPathResult, chartValores, EBPtotalClicks;
	
	// obtenemos la información general de la cuenta, obtenemos la matrix con la información línea x linea 
	// del cuadro con los datos del resumen de cuenta
	mitexto = "";
	EBP_Matrix_Item = document.getElementById("c_dir").getElementsByClassName("mbx")[0].childNodes[1].rows;
	//recorremos cada línea
	for (i = 0; i <= EBP_Matrix_Item.length - 1; i += 1) {
		datosMatrix = EBP_Matrix_Item[i].textContent;
		//eliminar espacios en blanco
		if (datosMatrix.indexOf(":") !== -1) {
			//eliminar sobrantes de mk_tt que vienen de botones
			if (datosMatrix.indexOf("mk_tt") !== -1) {
				puntoCorte = datosMatrix.indexOf("mk_tt") - 1;
				datosMatrix = datosMatrix.substring(0, puntoCorte);
			}
			//eliminar "=" innecesarios
			if (datosMatrix.indexOf("=") !== -1) {
				datosMatrix = datosMatrix.substring(0, datosMatrix.indexOf("="));
			}
			//eliminar doble espacios "  " innecesarios
			datosMatrix = datosMatrix.replace(/\s+/gi, ' ');
			//eliminar el simbolo de $
			datosMatrix = datosMatrix.replace("$", "");
			
			//eliminar espacios blancos al principio y fin del string
			datosMatrix = datosMatrix.trim();
			mitexto = mitexto + datosMatrix + String.fromCharCode(13, 10);
		}
	}
   
   //Obtenemos información sobre si hay Adprize Ganados el día de hoy, es el antepenultimo nodo
	totalNodos = document.getElementById("c_dir").getElementsByClassName("mbx").length;
	EBP_Matrix_Item = document.getElementById("c_dir").getElementsByClassName("mbx")[totalNodos - 2].childNodes[1].rows;
	// obtenemos los Adprize ganados en el día
	totalAdPrizes = 0;
	for (i = 0; i < (EBP_Matrix_Item.length - 1); i += 1) {
		datosMatrix = EBP_Matrix_Item[i].textContent;
		//eliminar espacios en blanco; eliminar sobrantes de mk_tt que vienen de botones
		if (datosMatrix.indexOf("mk_tt") !== -1) {
			puntoCorte = datosMatrix.indexOf("mk_tt") - 1;
			datosMatrix = datosMatrix.substring(0, puntoCorte);
		}
		//eliminar "=" innecesarios
		if (datosMatrix.indexOf("=") !== -1) {
			datosMatrix = datosMatrix.substring(0, datosMatrix.indexOf("="));
		}
		//eliminar espacios blancos al principio y fin del string
		datosMatrix = datosMatrix.trim();

		//si conseguimos el texto AdPrize y el texto hoy, sumamos para el total de AdPrizes del día
		//campos antes del total de referidos directos que no es necesario obtenerlos
		if (datosMatrix.indexOf('AdPrize') !== -1) {
			if (datosMatrix.indexOf(localString("EBP_isToday")) !== -1) {
				totalAdPrizes = Number(totalAdPrizes) + 1;
			}
		}
	}
	
	mitexto = mitexto + "AdPrize" + ":" + totalAdPrizes + String.fromCharCode(13, 10);
	
	//mostramos los datos
	mostrarVentana(mitexto, "EBPPAGERES");
}

//***********************************************************************************
//**** para las página de estadísticas de la Cuenta								*****
//***********************************************************************************
function EBP_Copia_Estadisticas() {
	// declaramos las variables
	var i, n, mitexto, EBPtotalClicks, EBP_scharts, chartValores, valorXPathResult, valorOriginal, sNombGraf, sDatos, sRenovaProg, EBP_chartValues, EBP_TotRRRenova;	
	var tipoFecha, sTitulo, XPathResultPPRR, nRROD, nRR15D, nRR30D, nRR60D, nRR9OD, nRR150D, nRR240D, sNombTrend, sSeparador, script; 

	nRROD = 0;
	nRR15D = 0;
	nRR30D = 0;
	nRR60D = 0;
	nRR9OD = 0;
	nRR150D = 0;
	nRR240D = 0;
	sSeparador = "--------------------------------------------------------------------------------";
	//Obtenemos los nombres para cada una de las gráficas
	valorXPathResult = document.evaluate("//div[@class='f_b']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	XPathResultPPRR	= document.evaluate("//td[@class='f_b']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	
	//Obtenemos la data de las gráficas para obtener el valor del día actual
	//este código lo tome del nebuxox de proxen
    EBP_scharts = document.evaluate("//script[contains(.,'eval(w(')]", document, null,XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent.split(" ");
	sDatos ="";
	sRenovaProg = "";
	mitexto = "";
	for(i=0; i<EBP_scharts.length-1; i++){
		//Se toman los datos de las graficas y se muestran los datos diarios separados por ;
		EBP_chartValues = obtainChartValues(EBP_scharts[i].split("'")[1],1,1);
		sNombGraf = EBP_chartValues[1];
		switch(EBP_chartValues[1])
            {
			case "ch_cliques": //gráfica de clics propios
				sNombTrend = EBP_chartValues[0];
				mitexto = mitexto + sSeparador +  "\n" + "-" + valorXPathResult.snapshotItem(0).textContent + "\n" + sSeparador +  "\n";
				EBP_chartValues = EBP_chartValues.reverse();
				sDatos = EBP_chartValues.join(";");
				sDatos = sDatos.replace(";" + sNombTrend,"");
				sDatos = sDatos.replace(";" + sNombGraf,"");
				mitexto = mitexto + sNombTrend + ":" +  sDatos + "\n";
				
				EBP_chartValues = obtainChartValues(EBP_scharts[i].split("'")[1],2,1);
				sNombTrend = EBP_chartValues[0];
				EBP_chartValues = EBP_chartValues.reverse();
				sDatos = EBP_chartValues.join(";");
				sDatos = sDatos.replace(";" + sNombTrend,"");
				sDatos = sDatos.replace(";" + sNombGraf,"");
				mitexto = mitexto + sNombTrend + ":" +  sDatos + "\n";
				
				EBP_chartValues = obtainChartValues(EBP_scharts[i].split("'")[1],3,1);
				sNombTrend = EBP_chartValues[0];
				EBP_chartValues = EBP_chartValues.reverse();
				sDatos = EBP_chartValues.join(";");
				sDatos = sDatos.replace(";" + sNombTrend,"");
				sDatos = sDatos.replace(";" + sNombGraf,"");
				mitexto = mitexto + sNombTrend + ":" +  sDatos + "\n";
				
				EBP_chartValues = obtainChartValues(EBP_scharts[i].split("'")[1],4,1);
				sNombTrend = EBP_chartValues[0];
				EBP_chartValues = EBP_chartValues.reverse();
				sDatos = EBP_chartValues.join(";");
				sDatos = sDatos.replace(";" + sNombTrend,"");
				sDatos = sDatos.replace(";" + sNombGraf,"");
				mitexto = mitexto + sNombTrend + ":" +  sDatos + "\n";
				
				EBP_chartValues = obtainChartValues(EBP_scharts[i].split("'")[1],5,1);
				sNombTrend = EBP_chartValues[0];
				EBP_chartValues = EBP_chartValues.reverse();
				sDatos = EBP_chartValues.join(";");
				sDatos = sDatos.replace(";" + sNombTrend,"");
				sDatos = sDatos.replace(";" + sNombGraf,"");
				mitexto = mitexto + sNombTrend + ":" +  sDatos + "\n";
				//mitexto = mitexto + localString("EBP_HistCPProlong") +  sDatos + "\n";
				
				EBP_chartValues = obtainChartValues(EBP_scharts[i].split("'")[1],6,1);
				sNombTrend = EBP_chartValues[0];
				EBP_chartValues = EBP_chartValues.reverse();
				sDatos = EBP_chartValues.join(";");
				sDatos = sDatos.replace(";" + sNombTrend,"");
				sDatos = sDatos.replace(";" + sNombGraf,"");
				mitexto = mitexto + sNombTrend + ":" +  sDatos + "\n";
				
				EBP_chartValues = obtainChartValues(EBP_scharts[i].split("'")[1],7,1);
				sNombTrend = EBP_chartValues[0];
				EBP_chartValues = EBP_chartValues.reverse();
				sDatos = EBP_chartValues.join(";");
				sDatos = sDatos.replace(";" + sNombTrend,"");
				sDatos = sDatos.replace(";" + sNombGraf,"");
				mitexto = mitexto + sNombTrend + ":" +  sDatos + "\n";
            break;
			case "ch_cdd": //gráfica de referidos directos
				sNombTrend = EBP_chartValues[0];
				mitexto = mitexto + sSeparador +  "\n" + "-" + valorXPathResult.snapshotItem(1).textContent + "\n" + sSeparador +  "\n";
				EBP_chartValues = EBP_chartValues.reverse();
                sDatos = EBP_chartValues.join(";");
				sDatos = sDatos.replace(";" + sNombTrend,"");
				sDatos = sDatos.replace(";" + sNombGraf,"");
				mitexto = mitexto + sNombTrend + ":" +  sDatos + "\n";
            break;
            case "ch_cr": //Gráfica de referidos rentados
            	sNombTrend = EBP_chartValues[0];
            	mitexto = mitexto + sSeparador +  "\n" + "-" + valorXPathResult.snapshotItem(2).textContent + "\n" + sSeparador +  "\n";
				EBP_chartValues = EBP_chartValues.reverse();
				sDatos = EBP_chartValues.join(";");
				sDatos = sDatos.replace(";" + sNombTrend,"");
				sDatos = sDatos.replace(";" + sNombGraf,"");
				mitexto = mitexto + sNombTrend + ":" +  sDatos + "\n";
            break;
            case "ch_recycle": //Gráfica Costo de Reciclaje
            	sNombTrend = EBP_chartValues[0];
            	mitexto = mitexto + sSeparador +  "\n" + "-" + valorXPathResult.snapshotItem(3).textContent + "\n" + sSeparador +  "\n";
				EBP_chartValues = EBP_chartValues.reverse();
                sDatos = EBP_chartValues.join(";");
				sDatos = sDatos.replace(";" + sNombTrend,"");
				sDatos = sDatos.replace(";" + sNombGraf,"");
				mitexto = mitexto + sNombTrend + ":" +  sDatos + "\n";
            break;
			case "ch_trar": //Gráfica Reciclajes Automáticos
				sNombTrend = EBP_chartValues[0];
				mitexto = mitexto + sSeparador +  "\n" + "-" + valorXPathResult.snapshotItem(4).textContent + "\n" + sSeparador +  "\n";
				EBP_chartValues = EBP_chartValues.reverse();
				sDatos = EBP_chartValues.join(";");
				sDatos = sDatos.replace(";" + sNombTrend,"");
				sDatos = sDatos.replace(";" + sNombGraf,"");
				mitexto = mitexto + sNombTrend + ":" +  sDatos + "\n";
            break;
			//ch_extensions; ch_extensions_all; ch_extensions_man; ch_extensions_aut
            case "ch_extensions_all": //Gráfica de renovaciones
				//total renovaciones
				sNombTrend = EBP_chartValues[0];
				mitexto = mitexto + sSeparador +  "\n" + "-" + valorXPathResult.snapshotItem(5).textContent + "\n" + sSeparador +  "\n";
				EBP_chartValues = EBP_chartValues.reverse();
                sDatos = EBP_chartValues.join(";");
				sDatos = sDatos.replace(";" + sNombTrend,"");
				sDatos = sDatos.replace(";" + sNombGraf,"");
				mitexto = mitexto + sNombTrend + ":" +  sDatos + "\n";
				
				//renovaciones manual
				mitexto = mitexto + sSeparador +  "\n" + "-" + valorXPathResult.snapshotItem(6).textContent + "\n" + sSeparador +  "\n";
				EBP_chartValues = obtainChartValues(EBP_scharts[i].split("'")[1],2,1);
				sNombTrend = EBP_chartValues[0];
				EBP_chartValues = EBP_chartValues.reverse();
                sDatos = EBP_chartValues.join(";");
				sDatos = sDatos.replace(";" + sNombTrend,"");
				sDatos = sDatos.replace(";" + sNombGraf,"");
				mitexto = mitexto + sNombTrend + ":" +  sDatos + "\n";
				
				//renovaciones automáticas
				mitexto = mitexto + sSeparador +  "\n" + "-" + valorXPathResult.snapshotItem(7).textContent + "\n" + sSeparador +  "\n";
				EBP_chartValues = obtainChartValues(EBP_scharts[i].split("'")[1],3,1);
				sNombTrend = EBP_chartValues[0];
				EBP_chartValues = EBP_chartValues.reverse();
                sDatos = EBP_chartValues.join(";");
				sDatos = sDatos.replace(";" + sNombTrend,"");
				sDatos = sDatos.replace(";" + sNombGraf,"");
				mitexto = mitexto + sNombTrend + ":" +  sDatos + "\n";
            break;
            case "ch_autopay": //Gráfica de Autopago
            	sNombTrend = EBP_chartValues[0];
            	mitexto = mitexto + sSeparador +  "\n" + "-" + valorXPathResult.snapshotItem(8).textContent + "\n" + sSeparador +  "\n";
				EBP_chartValues = EBP_chartValues.reverse();
                sDatos = EBP_chartValues.join(";");
				sDatos = sDatos.replace(";" + sNombTrend,"");
				sDatos = sDatos.replace(";" + sNombGraf,"");
				mitexto = mitexto + sNombTrend + ":" +  sDatos + "\n";
            break;
			case "ch_trrb": //Gráfica de transferencia a saldo de alquiler
				sNombTrend = EBP_chartValues[0];
				mitexto = mitexto + sSeparador +  "\n" + "-" + valorXPathResult.snapshotItem(9).textContent + "\n" + sSeparador +  "\n";
				EBP_chartValues = EBP_chartValues.reverse();
                sDatos = EBP_chartValues.join(";");
				sDatos = sDatos.replace(";" + sNombTrend,"");
				sDatos = sDatos.replace(";" + sNombGraf,"");
				mitexto = mitexto + sNombTrend + ":" +  sDatos + "\n";
            break;
			case "ch_trpb": //Gráfica de transferencia a saldo de paquete golden
				sNombTrend = EBP_chartValues[0];
				mitexto = mitexto + sSeparador +  "\n" + "-" + valorXPathResult.snapshotItem(10).textContent + "\n" + sSeparador +  "\n";
                EBP_chartValues = EBP_chartValues.reverse();
                sDatos = EBP_chartValues.join(";");
				sDatos = sDatos.replace(";" + sNombTrend,"");
				sDatos = sDatos.replace(";" + sNombGraf,"");
				mitexto = mitexto + sNombTrend + ":" +  sDatos + "\n";
            break;
			case "lastDays": //Gráfica de Ganancias MiniTrabajos
				// ultimos 30 días
				EBP_chartValues = obtainChartValues(EBP_scharts[i].split("'")[1],1,0);
				sNombTrend = EBP_chartValues[0];
				mitexto = mitexto + sSeparador +  "\n" + "-" + valorXPathResult.snapshotItem(11).textContent + "\n" + sSeparador +  "\n";
				EBP_chartValues = EBP_chartValues.reverse();
                sDatos = EBP_chartValues.join(";");
				sDatos = sDatos.replace(";" + sNombTrend,"");
				sDatos = sDatos.replace(";" + sNombGraf,"");
				mitexto = mitexto + sNombTrend + ":" +  sDatos + "\n";
				
				//ultimos 24 meses
				mitexto = mitexto + sSeparador +  "\n" + "-" + valorXPathResult.snapshotItem(12).textContent + "\n" + sSeparador +  "\n";
				EBP_chartValues = obtainChartValues(EBP_scharts[i].split("'")[1],2,0);
				sNombTrend = EBP_chartValues[0];
				EBP_chartValues = EBP_chartValues.reverse();
                sDatos = EBP_chartValues.join(";");
				sDatos = sDatos.replace(";" + sNombTrend,"");
				sDatos = sDatos.replace(";" + sNombGraf,"");
				mitexto = mitexto + sNombTrend + ":" +  sDatos + "\n";
            break;
			case "ch_ext_schedule1": //Gráfica de RR con alquiler de 0-90 días
				EBP_TotRRRenova = 0;
				sNombTrend = EBP_chartValues[0];
                for(n=2;n<91;n++)
                {
                    EBP_TotRRRenova = Number(EBP_TotRRRenova) + Number(EBP_chartValues[n]);
                    if(n==16){
						nRROD = sNombTrend + ":" + EBP_TotRRRenova + ";";
						EBP_TotRRRenova = 0;
					}
					if(n==31){
						nRR15D = EBP_TotRRRenova + ";";
						EBP_TotRRRenova = 0;
					}
					if(n==61){
						nRR30D = EBP_TotRRRenova + ";";
						EBP_TotRRRenova = 0;
					}
                }
				nRR60D = EBP_TotRRRenova + ";";
            break;
			case "ch_ext_schedule2": //Gráfica de RR con alquiler de 91-180 días
                EBP_TotRRRenova = 0;
                for(n=2;n<91;n++)
                {
                    EBP_TotRRRenova = Number(EBP_TotRRRenova) + Number(EBP_chartValues[n]);
					if(n==31){
						nRR9OD = EBP_TotRRRenova + ";";
						EBP_TotRRRenova = 0;
					}
                }
				nRR150D = EBP_TotRRRenova + ";";
            break;
			case "ch_ext_schedule3": //Gráfica de RR con alquiler de 181-270 días
                EBP_TotRRRenova = 0;
                for(n=2;n<91;n++)
                {
                    EBP_TotRRRenova = Number(EBP_TotRRRenova) + Number(EBP_chartValues[n]);
                }
				nRR240D = EBP_TotRRRenova;
				
            break;
			
			default:
            break;
        }
    }
	
	sTitulo = XPathResultPPRR.snapshotItem(0).textContent;
	sTitulo = sTitulo.replace(90, "");
	sTitulo = sTitulo.replace("  ", " ");
	sTitulo = sSeparador +  "\n" + "-" + sTitulo + "\n" + sSeparador;
	mitexto = mitexto + sTitulo + "\n" + nRROD+nRR15D+nRR30D+nRR60D+nRR9OD+nRR150D+nRR240D + "\n";
	
	mitexto = mitexto.replace(/:;/gi,":");
	//mostramos los datos
	mostrarVentana(mitexto, "EBPPAGEEST");
}

//***********************************************************************************
//**** para la página de los referidos directos									*****
//***********************************************************************************
function EBP_Copia_RD() {
	// establecemos las variables a usar en la funcion
	var i, sOpcCheckBox, valorXPathResult, EBP_TablaRD, tipoFecha, subTipoFecha, refDesdeTipo, ultClickTipo, mitexto;
	var largoTexto, textoTemporal, fechaHoy, numeroRD, nombreRD, origenRD, fechaDesdeRD, fechaUltClick, puntoCorte;
	var ebp_ffRelativa, ClicsRD, valorMediaRD;
	
	//verificamos en la cookie cual es el tipo de formato para exportar los datos
	sOpcCheckBox = checkCookie();
	sOpcCheckBox = sOpcCheckBox.split("-");
	nFormaFecha = sOpcCheckBox[0];
	if (sOpcCheckBox[1] == 1) {
		nFormaFecha = 2;
	}
	
    //Obtenemos la tabla de referidos directos
	EBP_TablaRD = document.getElementById('tblprp').getElementsByTagName('table')[2].childNodes[0];
	//Obtenemos el formato para los campos de fecha, Relativas o Exactas; referidos desde (2), ultimo clic (3)
	valorXPathResult = document.evaluate("//div[@class='f_r']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	tipoFecha = stripHTML(valorXPathResult.snapshotItem(0).innerHTML);
	tipoFecha = tipoFecha.split("·");
	//variables para el formato del tipo de fecha; 0 = exactas, 1=relativas
	refDesdeTipo = 0;
	ultClickTipo = 0;
	//vemos el tipo de fecha para referido desde y ultimo clic
	subTipoFecha = tipoFecha[0].split(":");
	ebp_ffRelativa = localString("EBP_ffRelativa");
	if (subTipoFecha[2].trim == ebp_ffRelativa){
		refDesdeTipo = 1;
	}
	subTipoFecha = tipoFecha[1].split(":");
	if (subTipoFecha[1].trim == ebp_ffRelativa){
		ultClickTipo = 1;
	}
	
	mitexto = "";
	largoTexto = 10;
	textoTemporal = "";
	fechaHoy = new Date();
	
	//Recorremos toda la tabla
    //Iniciamos el la tercera fila (la primera es el encabezado y la segunda es una línea azul)
	//luego leemos cada dos lineas
    for (i = 2; i < EBP_TablaRD.rows.length - 3; i = i + 2) {
		//Obtenemos el número del referido
		numeroRD = EBP_TablaRD.rows[i].cells[0].innerHTML.replace(/&nbsp;/gi, "");
		//Obtenemos el nombre del referido
		nombreRD = stripHTML(EBP_TablaRD.rows[i].cells[1].innerHTML);
		nombreRD = nombreRD.replace(/&nbsp;/gi, "");
		//Obtenemos el sitio de donde vino el referido
		origenRD = EBP_TablaRD.rows[i].cells[2].innerHTML.replace(/&nbsp;/gi, "");
		//Obtenemos la fecha desde que es referido
		fechaDesdeRD = EBP_TablaRD.rows[i].cells[3].innerHTML.replace(/&nbsp;/gi, "");
		fechaDesdeRD = stripHTML(fechaDesdeRD);
		//Obtenemos la fecha del último clic
		fechaUltClick = EBP_TablaRD.rows[i].cells[4].innerHTML.replace(/&nbsp;/gi, "");
		fechaUltClick = stripHTML(fechaUltClick);
		//Obtenemos el total de clics
		ClicsRD = EBP_TablaRD.rows[i].cells[5].innerHTML.replace(/&nbsp;/gi, "");
		//Obtenemos el valor de la media
		valorMediaRD = EBP_TablaRD.rows[i].cells[6].innerHTML.replace(/&nbsp;/gi, "");
		valorMediaRD = stripHTML(valorMediaRD);
		
		//normalizamos la fecha Referidos Desde
		if (nFormaFecha === 1) {
			fechaDesdeRD = obtieneFechaStandard(fechaDesdeRD, fechaHoy, 1, refDesdeTipo, 0);
		} else {
			if (nFormaFecha === 2) {
				fechaDesdeRD = obtieneFechaStandard(fechaDesdeRD, fechaHoy, 1, refDesdeTipo, 1);
			} else {
				//virificamos si la variable contien datos entre parentesis,
				//estos datos son colocados por algún script, procedemos a eliminarlos para dejar solamente
				//los datos originales
				if (fechaDesdeRD.indexOf('(') !== -1) {
					puntoCorte = fechaDesdeRD.indexOf('(');
					fechaDesdeRD = fechaDesdeRD.substring(0, puntoCorte);
				}
			}
		}
		
		//normalizamos la fecha de Ultimo Click
		if (nFormaFecha === 1) {
			fechaUltClick = obtieneFechaStandard(fechaUltClick, fechaHoy, 3, ultClickTipo, 0);
		} else {
			if (nFormaFecha === 2) {
				fechaUltClick = obtieneFechaStandard(fechaUltClick, fechaHoy, 3, ultClickTipo, 1);
			} else {
				//verificamos si la variable contien datos entre parentesis o corchetes,
				//estos datos son colocados por algún script, procedemos a eliminarlos para dejar solamente
				//los datos originales
				if (fechaUltClick.indexOf('(') !== -1 || fechaUltClick.indexOf('[') !== -1) {
					puntoCorte = fechaUltClick.indexOf('(');
                    if (puntoCorte === -1) {
						puntoCorte = fechaUltClick.indexOf('[');
                    }
					fechaUltClick = fechaUltClick.substring(0, puntoCorte);
				}
			}
		}
		
        //verificamos si el valor de la Media contiene datos entre parentesis o corchetes,
        //estos datos son colocados por algún script, procedemos a eliminarlos para dejar solamente
        //los datos originales
        if (valorMediaRD.indexOf("(") !== -1 || valorMediaRD.indexOf("|") !== -1) {
            puntoCorte = valorMediaRD.indexOf("(");
            if (puntoCorte === -1) {
                puntoCorte = valorMediaRD.indexOf("|");
            }
			valorMediaRD = valorMediaRD.substring(0, puntoCorte);
		}
		//Verificamos si es un numero el valor de la media, sino regresamo el valor 0.000
		if (isNaN(valorMediaRD)) {
			valorMediaRD = "0.000";
		}
		
		//creamos el string de salida final
		if (nFormaFecha === 2) {
			textoTemporal = nombreRD.trim() + "," + fechaDesdeRD.trim() + "," + fechaUltClick.trim() + "," + ClicsRD.trim() + "\n";
		} else {
			textoTemporal = numeroRD.trim() + ";" + nombreRD.trim() + ";" + origenRD.trim() + ";" + fechaDesdeRD.trim() + ";" + fechaUltClick.trim() + ";" + ClicsRD.trim() + ";" + valorMediaRD.trim() + "\n";
		}
		
		if (textoTemporal.length > largoTexto) {
			largoTexto = textoTemporal.length;
		}
		mitexto = mitexto + textoTemporal;
	}
	
	//mostramos los datos
	mostrarVentana(mitexto.substring(0, mitexto.length - 1), "EBPPAGERD");
}

//***********************************************************************************
//**** para la página de los referidos rentados									*****
//***********************************************************************************
function EBP_Copia_RR() {
	// establecemos las variables a usar en la funcion
	var i, sOpcCheckBox, valorXPathResult, EBP_TablaRR, tipoFecha, subTipoFecha, refDesdeTipo, refExpiraEnTipo, ultClickTipo, mitexto;
	var largoTexto, textoTemporal, fechaHoy, numeroRR, nombreRR, origenRR, fechaDesdeRR, fechaExpiraEn, fechaUltClick, puntoCorte, ClicsRR;
	var valorMediaRR, ebp_ffRelativa;
	
	//verificamos en la cookie cual es el tipo de formato para exportar los datos
	sOpcCheckBox = checkCookie();
	sOpcCheckBox = sOpcCheckBox.split("-");
	nFormaFecha = sOpcCheckBox[0];
	if (sOpcCheckBox[1] == 1) {
		nFormaFecha = 2;
	}
	
	 //Obtenemos la tabla de referidos rentados
	EBP_TablaRR = document.getElementById('tblprp').getElementsByTagName('table')[2].childNodes[0];
	
	//Obtenemos el formato para los campos de fecha, Relativas o Exactas; referidos desde (2), ultimo clic (3)
	valorXPathResult = document.evaluate("//div[@class='f_r']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	tipoFecha = stripHTML(valorXPathResult.snapshotItem(0).innerHTML);
	tipoFecha = tipoFecha.split("·");
	//variables para el formato del tipo de fecha; 0 = exactas, 1=relativas
	refDesdeTipo = 0;
	ultClickTipo = 0;
	refExpiraEnTipo = 0;
	ebp_ffRelativa = localString("EBP_ffRelativa");
	//vemos el tipo de fecha para referido desde y ultimo clic
	subTipoFecha = tipoFecha[0].split(":");
	if (subTipoFecha[2].trim == ebp_ffRelativa){
		refDesdeTipo = 1;
	}
	subTipoFecha = tipoFecha[1].split(":");
	if (subTipoFecha[1].trim == ebp_ffRelativa){
		refExpiraEnTipo = 1;
	}
	subTipoFecha = tipoFecha[2].split(":");
	if (subTipoFecha[1].trim == ebp_ffRelativa) {
		ultClickTipo = 1;
	}
	
	mitexto = "";
	largoTexto = 10;
	textoTemporal = "";
	fechaHoy = new Date();
	
	//Recorremos toda la tabla; Iniciamos el la tercera fila (la primera es el encabezado y la segunda es una línea azul)
	//luego leemos de dos en dos ya que hay una linea vacia entre referidos
    for (i = 2; i < EBP_TablaRR.rows.length - 2; i = i + 2) {
		//Obtenemos el número del referido
		numeroRR = EBP_TablaRR.rows[i].cells[0].innerHTML.replace(/&nbsp;/gi, "");
		//Obtenemos el nombre del referido
		nombreRR = stripHTML(EBP_TablaRR.rows[i].cells[2].innerHTML);
		nombreRR = nombreRR.replace(/&nbsp;/gi, "");
		//Obtenemos la fecha desde que es referido
		fechaDesdeRR = EBP_TablaRR.rows[i].cells[3].innerHTML.replace(/&nbsp;/gi, "");
		fechaDesdeRR = stripHTML(fechaDesdeRR);
		//Obtenemos la fecha de expiración
		fechaExpiraEn = EBP_TablaRR.rows[i].cells[4].innerHTML.replace(/&nbsp;/gi, "");
		fechaExpiraEn = stripHTML(fechaExpiraEn);
		//Obtenemos la fecha del último clic
		fechaUltClick = EBP_TablaRR.rows[i].cells[5].innerHTML.replace(/&nbsp;/gi, "");
		fechaUltClick = stripHTML(fechaUltClick);
		//Obtenemos el total de clics
		ClicsRR = EBP_TablaRR.rows[i].cells[6].innerHTML.replace(/&nbsp;/gi, "");
		//Obtenemos el valor de la media
		valorMediaRR = EBP_TablaRR.rows[i].cells[7].innerHTML.replace(/&nbsp;/gi, "");
		valorMediaRR = stripHTML(valorMediaRR);
		
		// Normalizamos la fecha referidos desde
		if (nFormaFecha === 1) {
			fechaDesdeRR = obtieneFechaStandard(fechaDesdeRR, fechaHoy, 1, refDesdeTipo, 0);
		} else {
			if (nFormaFecha === 2) {
				fechaDesdeRR = obtieneFechaStandard(fechaDesdeRR, fechaHoy, 1, refDesdeTipo, 1);
			} else {
				//virificamos si la variable contien datos entre parentesis,
				//estos datos son colocados por algún script, procedemos a eliminarlos para dejar solamente
				//los datos originales
				if (fechaDesdeRR.indexOf('(') !== -1) {
					puntoCorte = fechaDesdeRR.indexOf('(');
					fechaDesdeRR = fechaDesdeRR.substring(0, puntoCorte);
				}
			}
		}
		
		//Normalizamos la fecha Expira en
		if (nFormaFecha === 1) {
			fechaExpiraEn = obtieneFechaStandard(fechaExpiraEn, fechaHoy, 2, refExpiraEnTipo, 0);
		} else {
			//virificamos si la variable contien datos entre parentesis,
			//estos datos son colocados por algún script, procedemos a eliminarlos para dejar solamente
			//los datos originales
			if (fechaExpiraEn.indexOf('(') !== -1) {
				puntoCorte = fechaExpiraEn.indexOf('(');
				fechaExpiraEn = fechaExpiraEn.substring(0, puntoCorte);
			}
		}
		
		//Normalizamos la fecha del último click
		if (nFormaFecha === 1) {
			fechaUltClick = obtieneFechaStandard(fechaUltClick, fechaHoy, 3, ultClickTipo, 0);
		} else {
			if (nFormaFecha === 2) {
				fechaUltClick = obtieneFechaStandard(fechaUltClick, fechaHoy, 3, ultClickTipo, 1);
			} else {
				//verificamos si la variable contien datos entre parentesis o corchetes,
				//estos datos son colocados por algún script, procedemos a eliminarlos para dejar solamente
				//los datos originales
				if (fechaUltClick.indexOf('(') !== -1 || fechaUltClick.indexOf('[') !== -1) {
					puntoCorte = fechaUltClick.indexOf('(');
                    if (puntoCorte === -1) {
						puntoCorte = fechaUltClick.indexOf('[');
                    }
					fechaUltClick = fechaUltClick.substring(0, puntoCorte);
				}
			}
		}
		
        //verificamos si el valor de la Media contiene datos entre parentesis o corchetes,
        //estos datos son colocados por algún script, procedemos a eliminarlos para dejar solamente
        //los datos originales
        if (valorMediaRR.indexOf('(') !== -1 || valorMediaRR.indexOf('|') !== -1) {
            puntoCorte = valorMediaRR.indexOf('(');
            if (puntoCorte === -1) {
                puntoCorte = valorMediaRR.indexOf('|');
            }
			valorMediaRR = valorMediaRR.substring(0, puntoCorte);
		}
		
		//Verificamos si es un numero el valor de la media, sino regresamo el valor 0.000
		if (isNaN(valorMediaRR)) {
			valorMediaRR = '0.000';
		}
				
		//creamos el string de salida final
		if (nFormaFecha === 2) {
			textoTemporal = nombreRR.trim() + "," + fechaDesdeRR.trim() + "," + fechaUltClick.trim() + "," + ClicsRR.trim() + "\n";
		} else {
			textoTemporal = numeroRR.trim() + ";" + nombreRR.trim() + ";" + fechaDesdeRR.trim() + ";" + fechaExpiraEn.trim() + ";" + fechaUltClick.trim() + ";" + ClicsRR.trim() + ";" + valorMediaRR.trim() + "\n";
		}
		
		if (textoTemporal.length > largoTexto) {
			largoTexto = textoTemporal.length;
		}
		mitexto = mitexto + textoTemporal;
	}
	
	// mostramso el resultado
	mostrarVentana(mitexto.substring(0, mitexto.length - 1), "EBPPAGERR");
}


//***********************************************************************************
//**** para la página del Historial												*****
//**** PENDIENTE REVISAR CODIGO DE ESTA FUNCION 								*****
//***********************************************************************************
function EBP_Copia_Historial()
{
	//verificamos en la cookie cual es el tipo de formato para exportar los datos
	var sOpcCheckBox = checkCookie();
	sOpcCheckBox = sOpcCheckBox.split("-");
	nFormaFecha = sOpcCheckBox[0];
	if(sOpcCheckBox[1] == 1)
	{
		nFormaFecha = 2;
	}
    //Obtenemos la tabla de Historial
    var EBP_Historial= document.evaluate("//table[contains(@style,'border-right:1px')]", document, null,XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	
	//style="border-right:1px solid #777;"
	var mitexto = "";
	var largotexto = 10;
	var textoTemporal = "";
	var ebp_Fechahoy = new Date();
	//Recorremos toda la tabla
    //Iniciamos el la tercera fila (la primera es el encabezado y la segunda es una línea azul)
    for (var i=2; i<(EBP_Historial.rows.length-1); i++) {
	
		if(EBP_Historial.rows[i].cells[0].getAttribute('colspan') != null) continue;//continue if intermediate row
		
		//Obtenemos la fecha del evento
		var EBP_HistFecha = EBP_Historial.rows[i].cells[0].innerHTML.replace(/&nbsp;/gi,"");
		
		EBP_HistFecha = stripHTML(EBP_HistFecha);
		if (nFormaFecha == 1)
		{
			EBP_HistFecha = obtieneFechaStandard(EBP_HistFecha, ebp_Fechahoy, 1, ebp_RefDesde,0)
		}else{
			if (nFormaFecha == 2)
			{
				EBP_HistFecha = obtieneFechaStandard(EBP_HistFecha, ebp_Fechahoy, 1, ebp_RefDesde,1)
			}else{
				//virificamos si la variable contien datos entre parentesis,
				//estos datos son colocados por algún script, procedemos a eliminarlos para dejar solamente
				//los datos originales
				if(EBP_HistFecha.indexOf('(') != -1)
				{
					var posicion1 = EBP_HistFecha.indexOf('(');
					EBP_HistFecha = EBP_HistFecha.substring(0,posicion1);
				}
			}
		}
		
		//Obtenemos el Evento
		var EBP_HistEvento = EBP_Historial.rows[i].cells[1].innerHTML.replace(/&nbsp;/gi,"");
		EBP_HistEvento = stripHTML(EBP_HistEvento);
		//virificamos si la variable contien datos entre parentesis,
		//estos datos son colocados por algún script, procedemos a eliminarlos para dejar solamente
		//los datos originales
		if(EBP_HistEvento.indexOf('(') != -1)
		{
			var posicion1 = EBP_HistEvento.indexOf('(');
			EBP_HistEvento = EBP_HistEvento.substring(0,posicion1);
		}
		
		EBP_HistEvento = EBP_HistEvento.trim();
		EBP_HistFecha = EBP_HistFecha.trim();

		textoTemporal = EBP_HistFecha + ";" + EBP_HistEvento + "\n";
		
		if(textoTemporal.length > largotexto)
		{
			largotexto = textoTemporal.length;
		}
		mitexto = mitexto + textoTemporal;
	}
	
	// mostramso el resultado
	mostrarVentana(mitexto, "EBPPAGEHIS");
}

//para la página de estadísticas
if (location.href.indexOf("www.neobux.com/c/rs/") != -1) {
	ebp_Tipo_Pag = 3;
	crearBotonEBP("ExportEBP", EBP_Copia_Estadisticas);

	ebp_AnchoED = 800;
	ebp_AltoED = 400;
	crearFormularioEBP(2);
} else {
	//para la página de referidos directos
	if ( location.href.indexOf("www.neobux.com/c/rl") != -1 && location.href.indexOf("ss3=1") != -1) {
		ebp_Tipo_Pag = 2;
		crearBotonEBP("ExportEBP", EBP_Copia_RD);

		ebp_AnchoED = 700;
		ebp_AltoED = 400;
		crearFormularioEBP(2);
	} else {
		//para la página de referidos rentados
		if ( location.href.indexOf("www.neobux.com/c/rl") != -1 && location.href.indexOf("ss3=2") != -1) {
			ebp_Tipo_Pag = 1;
			crearBotonEBP("ExportEBP", EBP_Copia_RR);
				
			ebp_AnchoED = 700;
			ebp_AltoED = 400;
			crearFormularioEBP(2);
		} else {
			//para la página de Opciones Personales
			if (location.href.indexOf("www.neobux.com/c/d/") != -1) {
				ebp_Tipo_Pag = 4;
				crearBotonEBP("ExportEBP Opt", mostrarVentanaOpciones);
					
				ebp_AnchoED = 500;
				ebp_AltoED = 285;
				crearFormularioEBP(1);
			} else {
				//para la página de Historial
				if (location.href.indexOf("www.neobux.com/c/h/") != -1) {
					ebp_Tipo_Pag = 0;
					crearBotonEBP("ExportEBP", EBP_Copia_Historial);

					ebp_AnchoED = 800;
					ebp_AltoED = 400;
					crearFormularioEBP(2);
				} else {
					//para la página resumen
					if (location.href.indexOf("www.neobux.com/c/") != -1 || location.href.indexOf("www.neobux.com/c/?vl") != -1) {

						ebp_Tipo_Pag = 0;
						crearBotonEBP("ExportEBP", EBP_Copia_Resumen);

						var ebp_AnchoED = 400;
						var ebp_AltoED = 330;
						crearFormularioEBP(2);
					}
				}
			}
		}
	}
}