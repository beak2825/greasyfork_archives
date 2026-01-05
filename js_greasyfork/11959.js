// ==UserScript==
// @name        HG-Optimierung
// @namespace   hgtools
// @include     http://www.hartgeld.com/*
// @include     https://hartgeld.com/*
// @version     4.4
// @grant       none
// @description Vereinfachte Navigation auf Hartgeld.com
// @downloadURL https://update.greasyfork.org/scripts/11959/HG-Optimierung.user.js
// @updateURL https://update.greasyfork.org/scripts/11959/HG-Optimierung.meta.js
// ==/UserScript==

(function ($) { 

   ///////////////////////////////////////////////////////////////////////////////////
   // Startseite
   if (self == top) {
      
      // CSS
      var cssstring = (function () {/*
         <style>
         .werbebox2,
         .moduletable_wb_home,
			.bannergroup,
			#content-top			
			{
            display:none;
         }
			.navbar {
				margin-top:0 !important;
			}
         #heute {
            padding-top: 2px;
         }
			.gestern {
				color: #999;
			}
			.infolinks.gestern a {
				font-weight:normal;
			}
			.infolinks:hover {
				cursor:pointer;
			}
         #olframe {
            display:none;
            height:100%;
            position:fixed;
            top:0;
            right:0;
            z-index:10000;
         }
         #dragbar,
         #dragbarex {
            position: absolute;
            left: -12px;
            height:100%;
            width:10px;
            cursor: col-resize;
         }
         #closeborder {
             border: 1px solid #666;
             // opacity: 0.8;
             float:left;
             position: absolute;
             left:-31px;
             background:#fff;
             border-radius:25px;
				width: 30px;
				height: 30px;
         }
         #close {
             top: -6px;
             left: 1px;
             position: relative;
             height:20px;
             width:20px;
             padding:4px;
             font-size:22px;
             display:block;
             text-decoration:none;
         }
         #lesefenster,
         #iframeph {
            box-shadow: -10px 10px 13px -3px #333;
            width:100%;
            height:100%;
            background:#fff;
            overflow:auto;
            border:none;
         }
         #iframeph {
            box-shadow: none;
            position:absolute;
            display:none;
         }
         #extframe {
            box-shadow: -10px 10px 13px -3px #333;
            height:100%;
            position:fixed;
            top:0;
            right:0;
            z-index:11000;
            background:#fff;
            display:none;
         }
         #externfenster {
            overflow:auto;
            width:100%;
            height:100%;
            border:none;
         }
         #externcloseborder {
             border: 1px solid #666;
             // opacity: 0.8;
             position: absolute;
             left:-42px;
             background:#fff;
             border-radius:30px;
				width: 40px;
				height: 40px;
         }
         #externclose {
             top: -26px;
             left: -13px;
             position: relative;
             height:20px;
             width:20px;
             padding:17px;
             font-size:37px;
             display:block;
             text-decoration:none;
         }
         .markierterubrik {
            background: #CCC7AD;
            color: #000 !important;
            font-weight:bold;
         }
			.infolinks a {
				font-weight:bold;
			}
			.infolinks a:visited {
				color:#8f0505;
			}
         #wartebild {
            -moz-animation: spin 1s infinite linear;
            -webkit-animation: spin 1s infinite linear;  
            position: absolute;
            left: 45%;
            top: 45%;
         }
         @-moz-keyframes spin {
             0% {-moz-transform: rotate(0deg);}
             100% {-moz-transform: rotate(360deg);};
         }
         @-webkit-keyframes spin {
             0% {-webkit-transform: rotate(0deg);}
             100% {-webkit-transform: rotate(360deg);};
         }
         #rubrikenaktualisieren {
            margin-bottom: 20px;
         }
         #rubrikenaktualisieren a {
            text-decoration: none;
            color: #3D728C;
         }
         #rubrikenaktualisieren a:hover {
            color: #00F;
         }
         #neueinhaltesymbol {
            font-size:1px;
            color:#DE0000;
            display:none;
				vertical-align: middle;
				transform: rotate(90deg);
				margin: -8px 12px 0 6px;
				width: 12px;
				float: left;
         }
         </style>
         
         */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];
      $('head').append(cssstring);

      // Links umbauen
      $('.tab-content .infolinks a').each(function() {
        var value = $(this).attr('href');
        $(this).attr('url', value);
        $(this).attr('href', '');
      });
		
		// Datum für Einträge von gestern auf "gestern" umbauen
      $('#aktuell .infolinks').each(function() {
			var gestern = $(this).text().match(/20[0-9][0-9]\-[0-1][0-9]\-[0-3][0-9]/);
			if (gestern != null) {
				$(this).html($(this).html().replace(gestern, '<span class="gestern" title="' + gestern + '">gestern</span>'));
				$(this).addClass('gestern');
			}
      });


      // von auto auf fixe Position ändern
      function AutoZentrierungInMargin() {
         $('#wrap').css("position", "absolute");
         var left = ($(window).width() - $('#wrap').width()) / 2 - 14 + "px";
         return left;
      }

      // In Abhängigkeit der Fenstergröße die Overlays einstellen
      function Fenstergroesse(schmal, breit) {
         if ($(window).width() > 1600) {
            return breit;
         }
         return schmal;
      }

      
      // Iframe für externe URLs
      $('body').append('<div id="extframe" style="width:' + Fenstergroesse("90%", "50%") + ';"><div id="dragbarex"></div><div id="externcloseborder"><a id="externclose" href="##">&#10006;</a></div><iframe id="externfenster" allowFullScreen="true"></iframe></div>');
      
      $('body').on('click', '#externclose', function() {
         $('#extframe').hide();
         $('#externfenster').attr('src', '');
      });

      window.ExterneURL = function(url) {
         $('#externfenster').attr('src', url);
         $('#extframe').fadeIn(200);
      }

      window.ExterneHTML = function(html) {
         $('#externfenster').contents().find('body').html(html);
         $('#extframe').fadeIn(200);
      }

		
      // Rubrikenlinks-Funktionalität
      var neu = 0;
      var letzterubrik;
      
      // Für Iframe-Abfrage, welche Rubrikenseite gerade offen ist:
      window.AktuelleRubrik = function() {
         return $('a', letzterubrik).text().replace(/^\s+/g, '');
      }

      // $('#wrap').on('click', '.infolinks', function(event) {
			// KlickSeite(event, this);
		// });
		
      // $('#wrap').on('click', '.infolinks a', function(event) {
			// KlickSeite(event, this);
		// });
		
		// function KlickSeite(event, element) {
		$('#wrap').on('click', '.infolinks', function(event) {
         event.preventDefault();
         if (neu == 0) {
            // margin: 0 auto in 0 x umwandeln
            $('#wrap').css({"margin-left": AutoZentrierungInMargin()});
            $('#wrap').animate({'marginLeft': '0'}, 300);
            
            $('#wrap').prepend('<div id="olframe" style="width:' + Fenstergroesse("60%", "85%") + ';"><div id="dragbar"></div><div id="closeborder"><a id="close" href="##">&#10006;</a></div><div id="iframeph"><img id="wartebild" src="http://www.hartgeld.com/images/seiten/Logo-HG_kl.jpg"></div><iframe id="lesefenster"  allowFullScreen="true"></iframe></div>');

            $('#olframe').fadeIn(300);
         }
         
         // Klick auf dieselbe Rubrik nochmal?
			// alert($('a', this).text() + ' --- '  + $('a', letzterubrik).text());
         if ($('a', this).text() != $('a', letzterubrik).text()) {
            $(this).addClass('markierterubrik');
            MarkiertenBereichAufheben();
         }
         
         $('#iframeph').fadeIn(200); 
         $('#lesefenster').focus(); 

         var url = $('a', this).attr('url');
         $('#lesefenster').attr('src', url);

         letzterubrik = $(this);
         neu = 1;
      });

      function MarkiertenBereichAufheben() {
         if (neu) {
            $(letzterubrik).removeClass('markierterubrik');
            
            // Wenn Rubrik als neu, rot markiert war, diese Markierung aufheben
            var rubrikeneintrag = $(letzterubrik).html();
            rubrikeneintrag = rubrikeneintrag.replace('<span class="label label-important">Neu', '<em class="icon-file"> </em>');
            rubrikeneintrag = rubrikeneintrag.replace('</span> ', ' ');
            $(letzterubrik).html(rubrikeneintrag);
         }
      }

      $('#wrap').on('click', '#close', function() {
         $('#lesefenster').fadeOut(300, function(){ $('#olframe').remove();});
         $('#wrap').animate({'marginLeft': AutoZentrierungInMargin()}, 300);
         MarkiertenBereichAufheben();
         neu = 0;
      });
      
      
      // Breite Rubriken-Overlay ändern
      $('#wrap').on('mouseover', '#dragbar', function() {
         $('#dragbar').css({"border-right": "3px dashed #666"});
      });
      $('#wrap').on('mouseout', '#dragbar', function() {
         $('#dragbar').css({"border-right": "none"});
      });
      
      var i = 0;
      var dragging = false;
      $(document).on('mousedown', '#dragbar', function(e) {
         e.preventDefault();

         dragging = true;
         var main = $('#olframe');
         var ghostbar = $('<div>',
            { id:'ghostbar', css: 
               {
                  borderRightWidth: '3px',
                  borderRightColor: '#666',
                  borderRightStyle: 'dashed',
                  position: 'absolute',
                  cursor: 'col-resize',
                  zIndex: '10001',
                  height: main.outerHeight(),
                  top: main.offset().top,
                  left: main.offset().left-2
               }
            }).appendTo('body');
         $('#lesefenster').css({"pointer-events": "none"});
         
         $(document).mousemove(function(e) {
            ghostbar.css("left", e.pageX);
            $('#olframe').css(
               {  "left": e.pageX,
                  "width": $(document).width() - e.pageX
               });
         });
      });

      $(document).mouseup(function(e) {
         if (dragging) {
            $('#lesefenster').css({"pointer-events": "initial"});
            $('#ghostbar').remove();
            $(document).unbind('mousemove');
            dragging = false;
         }
      });

      $(window).on('resize', function(event) {
         $('#extframe').css({"width": Fenstergroesse('90%', '50%'), "right": "0", "left": "unset"});
         $('#olframe').css({"width": Fenstergroesse('60%', '85%'), "right": "0", "left": "unset"});
      });    
      
      // Breite Externerlink-Overlay ändern
      $('body').on('mouseover', '#dragbarex', function() {
         $('#dragbarex').css({"border-right": "3px dashed #666"});
      });
      $('body').on('mouseout', '#dragbarex', function() {
         $('#dragbarex').css({"border-right": "none"});
      });
      
      var i = 0;
      var draggingex = false;
      $(document).on('mousedown', '#dragbarex', function(e) {
         e.preventDefault();

         draggingex = true;
         var main = $('#extframe');
         var ghostbar = $('<div>',
            { id:'ghostbar', css: 
               {
                  borderRightWidth: '3px',
                  borderRightColor: '#666',
                  borderRightStyle: 'dashed',
                  position: 'absolute',
                  cursor: 'col-resize',
                  zIndex: '10001',
                  height: main.outerHeight(),
                  top: main.offset().top,
                  left: main.offset().left-2
               }
            }).appendTo('body');
         $('#externfenster').css({"pointer-events": "none"});
         $('#lesefenster').css({"pointer-events": "none"});
         
         $(document).mousemove(function(e) {
            ghostbar.css("left", e.pageX);
            $('#extframe').css(
               {  "left": e.pageX,
                  "width": $(document).width() - e.pageX
               });
         });
      });

      $(document).mouseup(function(e) {
         if (draggingex) {
            $('#externfenster').css({"pointer-events": "initial"});
            $('#lesefenster').css({"pointer-events": "initial"});
            $('#ghostbar').remove();
            $(document).unbind('mousemove');
            draggingex = false;
         }
      });


      /////////////////////////////////////////
      // Aktualisierungsfunktionen
		
		// Neuladen Button
      function AktualisierungsButtonanzeigen() {
         $('#aktuell').prepend('<div id="rubrikenaktualisieren"><div title="Neue Inhalte vorhanden" id="neueinhaltesymbol">&#128259; </div><a id="aktualisieren" class="bodyText_fett" href="##">Rubriken aktualisieren <span id="autoaktualisierungscd" title="Minuten bis zur automatischen Hintergrundüberprüfung"></span>&raquo;</a></div>');
      }
      AktualisierungsButtonanzeigen();

      
      // RSS-Feed manuell lesen

      $('#aktuell').on('click', '#aktualisieren', function(event) {
         event.preventDefault();

         var datum = new Date();
         var infolinks = '';

         $('#aktuell').animate({'opacity': '0.01'}, 100, function() {
         
            $.get('https://hartgeld.com/index.php', function(data) {
               var $xml = $(data);
               $xml.find("#aktuell .infolinks").each(function() {
                  var $this = $(this),
                     item = {
                        title: $this.find("a").text(),
                        link: $this.find("a").attr('href'),
								hour: $this.text().match(/([0-2][0-9])\:([0-5][0-9])/)[1],
								minute: $this.text().match(/([0-2][0-9])\:([0-5][0-9])/)[2],
                        yesterday: $this.text().match(/20[0-9][0-9]\-[0-1][0-9]\-[0-3][0-9]/),
                  }
                     
						var zeit = parseInt(item.hour) * 60 + parseInt(item.minute);
						if ((zeit > neuestezeit) && (!item.yesterday)) {
							infolinks += '<p class="infolinks"><span class="label label-important">Neu ' + item.hour + ':' + item.minute + '</span> <a url="' + item.link + '" href="" title="' + item.link + '" url="' + item.link + '">' + item.title + '</a></p>';
						} else if (item.yesterday) {
							infolinks += '<p class="infolinks gestern"><em class="icon-file"> </em> <span class="gestern" title="' + item.yesterday + '">gestern</span> ' + item.hour + ':' + item.minute + '<a href="" title="' + item.link + '" url="' + item.link + '">  ' + item.title + '</a></p>';
						} else {
							infolinks += '<p class="infolinks"><em class="icon-file"> </em> ' + item.hour + ':' + item.minute + '<a href="" title="' + item.link + '" url="' + item.link + '">  ' + item.title + '</a></p>';
						}
               });

               $('#aktuell').empty();
               $('#aktuell').prepend(infolinks);
               $('#aktuell').animate({'opacity': '1'}, 100);
               AktualisierungsButtonanzeigen();
               ZeitNeuesteRubrik();
               ZuletztaktiveRubrikmarkieren();

               autosuche = 0;
               TimerAutoAktualisierung();
            });
         });
      });
      
      // Automatische Überprüfung auf neue Inhalte
      function SucheNachAktualisierungen() {
         autosuche = 0;
         
         $.ajax({
            async: false,
            type: 'GET',
            url: 'https://hartgeld.com/index.php',
            success: function(data) {

               var datum = new Date();
               var $xml = $(data);
               var ersteselement = $xml.find("#aktuell .infolinks").first();
               var item = {
							hour: $(ersteselement).text().match(/([0-2][0-9])\:([0-5][0-9])/)[1],
							minute: $(ersteselement).text().match(/([0-2][0-9])\:([0-5][0-9])/)[2],
							yesterday: $(ersteselement).text().match(/20[0-9][0-9]\-[0-1][0-9]\-[0-3][0-9]/),
               }
                  
					var zeit = parseInt(item.hour) * 60 + parseInt(item.minute);
					var zeitstring = $('#aktuell p').first().text().match(/([0-2][0-9])\:([0-5][0-9])/);
					var zuletzt = parseInt(zeitstring[1]) * 60 + parseInt(zeitstring[2]);
					
					if (zeit > zuletzt) {
						$('#neueinhaltesymbol').show().animate({fontSize: "30px"}, 500).animate({fontSize: "22px"}, 300);
						autosuche = 2;
					}
            }
         });         
      }
      
      
      var autosuche = 0; // 0 = Neustart, 1 = Countdown läuft, 2 = Aktualisierungen gefunden
      var zeitbiszurAktualisierung = 0;
      var aktualisierungsinterval = 840; // Sekunden (Dauer minus 1 Minute)
      var aktualisierungscountdowninterval = 60; // Sekunden
      var autoaktualisierungstimer;

      function TimerAutoAktualisierung() {
         var datum = new Date();
         var stunde = datum.getHours();

         // Für den Fall, dass manuell geprüft wurde, läuft noch ein Timer
         clearTimeout(autoaktualisierungstimer);

         if (autosuche == 1) {
            zeitbiszurAktualisierung -= aktualisierungscountdowninterval;
            
            // Nicht bis 0 zählen, damit am Ende nicht 0min, sondern 1min steht
            if (zeitbiszurAktualisierung <= 0) {
               SucheNachAktualisierungen();
            }

         // Neustart Countdown
         } else if (autosuche == 0) {
            zeitbiszurAktualisierung = aktualisierungsinterval;
            autosuche = 1;
         }

         if ((stunde >= 7) && (stunde < 21) && (autosuche != 2)) {
            autoaktualisierungstimer = window.setTimeout(TimerAutoAktualisierung, aktualisierungscountdowninterval * 1000);
            $('#autoaktualisierungscd').text('(' + parseInt((zeitbiszurAktualisierung + aktualisierungscountdowninterval) / aktualisierungscountdowninterval) + ' min) ');
            
         } else {
            $('#autoaktualisierungscd').text('');
         }
      }
      TimerAutoAktualisierung();
      
      
      
      // Letzte Rubrik abenfalls wieder als aktiv markieren
      function ZuletztaktiveRubrikmarkieren() {
         $('#aktuell p a').each(function() {
				var letzte_r = $('a', letzterubrik).text().replace(/^\s+/g, ''); 
            if ($(this).text().replace(/^\s+/g, '') == letzte_r) {
               letzterubrik = $(this).parent();
               $(this).parent().addClass('markierterubrik');
            }
         });
      }

      // Zeitpunkt zuletzt geänderter Rubrik prüfen, um die neu geänderten Rubriken nach der Aktualisierung zu markieren
      var neuestezeit = 0;
      function ZeitNeuesteRubrik() {
         var zeitstring = $('#aktuell p').first().text().match(/([0-2][0-9])\:([0-5][0-9])/);
         neuestezeit = parseInt(zeitstring[1]) * 60 + parseInt(zeitstring[2]);
      }
      ZeitNeuesteRubrik();
      
      // Tabs korrigieren, da nach Aktualisierung die neu geladenen Rubriken nicht mehr ausgeblendet werden
      $('.nav-tabs a').on('click', function() {
         var tab = $(this).attr('href');
         if (tab != '#aktuell') {
            $('#aktuell').css("display", "none");
         } else {
            $('#aktuell').css("display", "block");
         }
      })
      
      
      // Wenn iframe geladen wurde, iframe-Ladeseite ausblenden
      window.IframeGeladen = function() {
         $('#iframeph').fadeOut(200); 
      }
      
   }
   
   ///////////////////////////////////////////////////////////////////////////////////
   // Inhaltsseite
   else {
      
      // CSS
      var cssstring = (function () {/*
         <style>
         @media screen and (min-width: 1300px) {
            .item-page {
               // max-width:400px;
            }
         }
         body {
            padding: 0;
         }
         
         #content .moduletable,
         #sidebar-2 .moduletable,
         #top, 
         .footer,
         #wrap #main #sidebar-2,
         .werbebox2,
			#header,
			#content-top,
			.back-to-top,
			#copy,
			#bottom
			{
            display:none !important;
         }
         
         #wrap {
            width:100%;
				max-width:100% !important;
         }
         .row-fluid [class*="span"] {
            float: left !important;
         }
         .span2 {
            width: 120px !important;
         }         
         .span4 {
            width: 35% !important;
         }         
         .row-fluid .span8 {
            float:right !important;
            width:60% !important;
         }
         .span10 {
            width: 60% !important;
         }
         #wrap {
            margin:5px 0 0;
            max-width: 650px;
         }
         
         
         .header-fixed,
         .werbebox3 p { 
            display: none;
         }
         hr {
            margin: 50px 0;
				border:none;
         }
         #main {
            margin-top: 0px !important;
         }
			.col-md-4 {
				float:left;
			}
			.btn-group a {
				font-size:12px;
			}
         p a {
            padding-left: 20px;
         }
         .bodyText_fett_gruen {
            background: #5a5;
            color: #fff;
            padding: 2px 5px 2px;
            display: inline-block;
            line-height: 16px;
         }
         td.bodyText_fett_gruen {
            background:#fff;
            color:#5a5;
            display:table-cell;
            padding:0;
         }
         .tagesdatum {
            // display: inline !important;
            padding:0px 8px 0px;
            background: #CCC7AD;
            color: #fff;
         }
			.alteinhalte .tagesdatum,
			.alteinhalte .cdate,
			.tagesdatum .bodyText_fett_blau {
				color: #000;
			}
         .datumheute {
				background: #DE0000;
				background: #4e93b6;
         }
         .datumheute .cdate,
         .datumheute .bodyText_fett_blau {
				color:#fff;
				padding: 0 5px 0 0;
			}
			.cdate {
				color:#fff;
			}
         .leerzeile {
            margin-bottom: 15px;
            width:100%;
            height:1px;
         }
         .blase {
            visibility: hidden;
            display: none;
            text-decoration:none !important;
            font-size: 20px;
            position: relative;
            left:3px;
            top:2px;
            z-index:10;
            transition-property: visibility, opacity;
            transition-duration: 0.2s;
            transition-delay: 0.5s;
            transition-timing-function: ease;
            color:#fff !important;
            text-shadow: 0 -1px #333, 1px 0 #333, 0 1px #333, -1px 0 #333;
            line-height: 1px;
            padding-left: 0;
            opacity:0;
         }
         .blasehover {
            transition-delay: 0.7s;
            transition-duration: 0.5s;
            opacity:1;
            top: px;
            visibility: visible;
				display:inline;
         }
         .blasehover:hover {
            color: #000 !important; 
         }
         #mailsenden {
            display:none;
            position: absolute; 
            padding: 5px 10px 10px; 
            font-size: 20px;
            text-decoration:none;
            color:#fff;
            text-shadow: 0 -1px #333, 1px 0 #333, 0 1px #333, -1px 0 #333;
         }
         #mailsenden:hover {
            color: #000; 
         }
         #urloverlay {
            display:none;
            box-shadow: 0px 0px 10px 1px  rgba(158,158,158,1); 
            border-radius:3px;
            position: absolute; 
            padding: 0px 6px 0px; 
            background: #ebe8dd; 
            color: #000; 
            z-index:1000;
         }
         .kommentarwe {
            background: #eeeeff;
            padding: 0px 5px 2px;
         }
         .bodyText_blau + br,
         .bodyText_blau br,
         .bodyText_fett br {
            // display:none;
         }
         .alteinhalte {
            display:none;
         }
         #alteinhalteschalter {
            display:block;
            margin-top: 30px;
            margin-bottom: 0px;
            text-decoration: none;
            background: #CCC7AD;
            color: #000;
				padding: 0 10px;
         }
         #alteinhalteschalter:hover {
            color: #666;
         }
         .exneuesfenster {
            text-decoration:none !important;
            cursor:pointer;
            color: #666;
            padding-left:0;
            font-weight:bold;
         }
         .exneuesfenster:visited {
            color: #999 !important;
         }
         .pubzeiten {
            background: #696552;
            color: #FFF;
            display: inline-block;
            padding: 2px 5px 2px;
            float: left;
            margin: 0px 8px 0 0;
            font-weight:bold;
            line-height: 15px;
            min-width: 41px;
            text-align: center;
         }
         .kommentarwe .pubzeiten {
             background:#79f;
             margin-left:-5px;
          }
         .bodyText_fett_rot .pubzeiten {
             background:#F00;
          }
         .bodyText_blau .pubzeiten {
             background:#79f;
          }
         </style>
         
         */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];
      $('head').append(cssstring);
      
      var mtext = '';
      var seitenrubrik = encodeURIComponent(parent.AktuelleRubrik());
      
      // Fehlerhafte Seiten nicht konvertieren
      var seiten_ohne_umwandlung = ["Stammtische", "Team/Codenamen"];
      var rubrik_check = parent.AktuelleRubrik().replace(/(\s*[0-2]?[0-9]\:[0-5][0-9])(\s*)(.*)/, '$3');
      var seite_umwandeln = 0;
      if ($.inArray(rubrik_check, seiten_ohne_umwandlung) == -1) {
         var seite_umwandeln = 1;
      }

      // Mailoverlay
      $('#main-box').prepend('<a title="Diesen Absatz kommentieren" id="mailsenden" href="##">&#128172;</a>');
            
      // URLoverlay
      $('#main-box').prepend('<div id="urloverlay"></div>');
      


      /////////////////////////////////////////////////////////////////////
      // Angezeigte Elemente anpassen, versteckte erst nach Einblendung
      function BearbeiteElemente(klasse) {

         // Externe Seitenlinks umwandeln für Overlay-Anzeige
         $(klasse + ' p a').not('#mailsenden').each(function() {
            // Links ohne anklickbaren Text löschen
            if ($(this).text() == '') {
					if (!$(this).find('img')) {
						$(this).remove();
					}
            } else {
               // Links ohne href korrigieren
               if (typeof($(this).attr('href')) === 'undefined') {
                  $(this).attr('href', $(this).text());
               }
					
					// Nur SSL-Link als Overlay anzeigen, andere gehen nicht weil HG selbst https -> neuen Tab:
					var link = $(this).attr('href').split('//');
					if (link[0] == 'https:') {
						// Linkklasse setzen
						$(this).addClass('extern');
						$(this).after('&nbsp;<a target="_blank" class="exneuesfenster" title="Link in neuem Fenster öffnen">&#10093;&#10093;&#10093;</a>');
					} else {
						$(this).attr('target', '_extern');
					}
               $(this).css({
                  "background": "transparent url(http://www.google.com/s2/favicons?domain=" + $(this).attr('href').split('/')[2] + ") center left no-repeat"
               });
            }
         });

         // Style-Korrekturen, wenn z.B. p = bodyText_blau, aber darin ein span = bodyText_fett
         $(klasse + ' .bodyText_blau, ' + klasse + ' .bodyText_fett_gruen').has('.bodyText_fett').each(function() {
            $(this).removeClass('bodyText_blau bodyText_fett_gruen');
         });
        
         // Überflüssige Leerzeilen am Ende blauer Kommentare löschen, da der Hintergrund ja blau wird und das seltsam aussieht
         $(klasse + ' .bodyText_blau + br, ' + klasse + ' .bodyText_blau br, ' + klasse + ' .bodyText_fett br').parent().each(function() {
            $(this).html($(this).html().replace(/<br>&nbsp;/, ''));
         });
         
         // HTML-Korrekturen, wenn zwei grüne Überschriften direkt hintereinander kommen
         $('.bodyText_fett_gruen + .bodyText_fett_gruen').each(function() {
            $(this).prev().after('<br>');
         });
         
         // WE-Kommentare anders färben
         // muss vor Auto-Kommentar-Sprechblasen kommen
         $(klasse + ' p.bodyText_blau, ' + klasse + ' p.bodyText_fett_blau').not(':has(.cdate)').add($(klasse + ' p').has('.bodyText_blau, .bodyText_fett_blau')).each(function() {
            if ($(this).text().match(/(WE\.|PS: )/)) {
               $(this).addClass('kommentarwe');
            }
            KommentarKlasseeinfuegen(this);
            $(this).addClass('blauerkommentar');
         });
        
         // Auto-Kommentar-Links
         $(klasse + ' p.bodyText_fett, ' + klasse + ' p.bodyText_fett_rot').add($(klasse + ' p').has('.bodyText_fett, strong, .bodyText_fett_rot')).each(function() {
            KommentarKlasseeinfuegen(this);
         });
         
         // Datumsblöcke Klasse einfügen
         // $(klasse + ' p.bodyText_fett_blau .cdate, ' + klasse + ' p.bodytext_fett_blau .cdate').each(function() {
         $(klasse + ' p.bodyText_fett_blau .cdate, ' + klasse + ' p.bodytext_fett_blau .cdate, ' + klasse + ' .bodyText_fett_blau + .cdate').each(function() {
            $(this).parent().addClass('tagesdatum');
            $(this).parent().after('<div class="leerzeile"></div>');
         });
         
         // Alle Zeitangaben in eckigen Klammern hervorheben
         $(klasse + ' p').each(function() {
            PublikationszeitenHervorheben(this);
         });

         // Datum des Tages umstellen
         monate = new Array(); monate['01'] = 'Januar'; monate['02'] = 'Februar'; monate['03'] = 'März'; monate['04'] = 'April'; monate['05'] = 'Mai'; monate['06'] = 'Juni'; monate['07'] = 'Juli'; monate['08'] = 'August'; monate['09'] = 'September'; monate['10'] = 'Oktober'; monate['11'] = 'November'; monate['12'] = 'Dezember';
         
         $(klasse + ' .cdate').each(function() {
            if ($(this).length > 0) {
               // Nur auf ein Datum reagieren, falls cdate-Klasse auch woanders verwendet wurde
               if ($(this).text().match(/[0-9]*-[0-9]*-[0-9]*:/)) {

						var datumsteile = $(this).text().split('-');

                  var tag = datumsteile[2].replace(':', '');
                  if (tag[0] == '0') {
                     tag = tag[1];
                  }
                  
                  var monat;
                  if (datumsteile[1][0] == '0') {
                     monat = datumsteile[1][1];
                  } else {
                     monat = datumsteile[1];
                  }
                  
                  var datum = new Date();
                  var heute = '';
                  if ((tag == datum.getDate()) && (monat == datum.getMonth() + 1)) {
                     heute = 'Heute, ';
                     $(this).parent().addClass('datumheute');
                  }
                  $(this).text(heute + tag + '. ' + monate[datumsteile[1]] + ' ' + datumsteile[0]);
               }
            }
         });
      }
            

      // Linke Position von Inline-Link bei Zeilenumbruch errechnen
      $.fn.LinkePositionvonLink = function() {
         var el = $('<i/>').css('display', 'inline').insertBefore(this[0]);
         var pos = el.offset();
         el.remove();
         return pos;
      };
      
      // Kommentarblase in Block einfügen
      function KommentarKlasseeinfuegen(block) {
         $(block).addClass('kommentarhover');
         // $(block).append('<a title="Diesen Absatz kommentieren" href="##" class="blase">&#128172;</a>');
      }

      // Uhrzeiten hervorheben
      function PublikationszeitenHervorheben(element) {
         $(element).html($(element).html().replace(/\[(\<span.*?\>)?([0-2]?[0-9]\:[0-5][0-9])(\<\/span\>)?\]/, '<span class="pubzeiten">$2</span>'));
      }
      
      function SchliessePopup() {
         $('#mailsenden').hide('fast');

         if (window.getSelection) {
            window.getSelection().removeAllRanges();
         } else if (document.selection) {
            document.selection.empty();
         }
      }
      
      function Textkuerzen(text) {
         var maxtextlaenge = 500;
         // Blase und >>> Pfeile enfernen
         text = text.replace(/?|❭|➚|↗/g, '');
         if (text.length > maxtextlaenge) {
            var trimmedString = text.substr(0, maxtextlaenge);
            trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")));
            return trimmedString + ' [...]';
         } else {
            return text;
         }
      }
      
      function Mailinhalt(zitat, blauerkommentar) {
         var bk = 'zu folgendem Eintrag';
         if (blauerkommentar) {
            bk = 'zu Ihrem blauen Kommentar';
         }
         window.location.href = "mailto:info@hartgeld.com?subject=Neuer Leserkommentar zu Seite \"" + seitenrubrik + "\"&body=Sehr geehrtes Hartgeld-Team,%0A%0A" + bk + " auf der Seite \"" + seitenrubrik + "\" möchte ich gerne wie untenstehend kommentieren:%0A%0A%0A* Ihr Eintrag:%0A" + encodeURIComponent(Textkuerzen(zitat)) + "%0A%0A%0A* Mein Kommentar dazu:%0A%0A";
      }
      
      // Bestimmte Seiten nicht umwandeln
      if (seite_umwandeln) {

			$('.item-page div').addClass('aktuelleinhalte');
			
         // Ältere Inhalte ausblenden
         var endeaktuell = $('.aktuelleinhalte hr').first();
         if (endeaktuell.length > 0) {
            $(endeaktuell).before('<a id="alteinhalteschalter" class="bodyText_fett" href="##">Ausgeblendete Inhalte anzeigen &raquo;</a>');
            $('.aktuelleinhalte').after('<div class="alteinhalte"></div>');
            
            $(endeaktuell).nextAll().each(function() {
               $('.alteinhalte').append(this);
            });
            $('.alteinhalte').prepend(endeaktuell);

            // Nach Klick ältere Inhalte anzeigen
            $('.aktuelleinhalte').on('click', '#alteinhalteschalter', function(event) {
               event.preventDefault();
               $('#alteinhalteschalter').css({"display": "none"});
               BearbeiteElemente('.alteinhalte');
               $('.alteinhalte').slideDown('slow');
            });
         }
         
         // Neuesten Tag bearbeiten
         BearbeiteElemente('.aktuelleinhalte');
      }      

      // Textmarkierungs-Mailzitat Events
      $('.item-page').on('mouseup', function(event) {
         var temp = document.getSelection().toString();
         if (temp != '') {
            mtext = temp;
            $('#mailsenden').css({
               left: event.pageX+15,
               top: event.pageY-35
            }).show('fast');
         }
      });
		// Auf Blase des markierten Texts geklickt
      $('#mailsenden').on('mousedown', function(event) {
         if (event.target.id == 'mailsenden') {
            Mailinhalt(mtext, 0);
            event.preventDefault();
         }
         SchliessePopup();
      });
      // Woanders geklickt, als markiert war
      $('.item-page').on('mousedown', function(event) {
         $('#mailsenden').hide('fast');
		});
		
      
      
      // Externe Links Events
      $('.item-page').on('click', '.extern', function(event) {
         event.preventDefault();
         var url = $(this).attr('href');

         if (url.match(/((www|m)\.)?(youtube|youtu)\.(com|be)/)) {
            if (url.match(/\/\/youtu\.be/)) {
               var video_id = url.split('/')[3];
            } else {
               var video_id = url.split('v=')[1];
               var ampersandPosition = video_id.indexOf('&');
               if (ampersandPosition != -1) {
                  video_id = video_id.substring(0, ampersandPosition);
               } else {
                  video_id = video_id.substring(0);
               }
            }
            parent.ExterneHTML('<html><head><style>body { background:#000; } .tabelle {width: 100%;height:100%;padding: 0 2%;}.zelle { vertical-align: middle;text-align:center;} .ytoverlay { position:relative;padding-bottom:56.25%;height:0;overflow:hidden; } .ytoverlay iframe, .ytoverlay object, .video-container embed { position:absolute;top:0;left:0;width:100%;height:100%;}</style></head><body><table class="tabelle"><tr><td class="zelle"><div class="ytoverlay"><iframe id="ytiframe" src="https://www.youtube.com/embed/' + video_id + '?autoplay=1&autohide=1&border=0&wmode=opaque&enablejsapi=1&showinfo=1&modestbranding=0&rel=0&theme=dark&fs=1" frameborder="0" allowfullscreen="true"></iframe></td></tr></table></body></html>');
         } else {
            parent.ExterneURL(url);
         }
      });

      $('.item-page').on('click', '.exneuesfenster', function() {
         $(this).attr('href', $(this).prev().attr('href'));
      });
      
      
      // URL Hover Events
      $('.item-page').on('mouseenter', 'p a:not(#mailsenden, .exneuesfenster, .blase)', function() {
         clearTimeout($(this).data('timeout'));
         $('#urloverlay').text($(this).attr('href').split('/')[2]);
         var position = $(this).position();
         $('#urloverlay').css({
            top: position.top-25,
            left: $(this).LinkePositionvonLink().left + 22
            // Left: position.left
            // top: event.pageY-40,
            // left: event.pageX-50
         }).show();
      });
      $('.item-page').on('mouseleave', 'p a:not(#mailsenden, .exneuesfenster, .blase)', function() {
         var t = setTimeout(function() {
            $('#urloverlay').hide();
         }, 100);
         $(this).data('timeout', t);
      });
      
      
      // Zitat Events Überschriften und blaue Kommentare
/*      $('.item-page').on('mouseenter', '.kommentarhover', function(event) {
			var position = $(this).position();
			$('#mailsenden').css({
				top: position.top-10,
				left: event.pageX+20
				// top: event.pageY-40,
				// left: event.pageX-50
			}).show();
         // $(this).children('.blase').toggleClass('blasehover');
      });
      $('.item-page').on('mouseleave', '.kommentarhover', function() {
			$('#mailsenden').hide('fast');
         // $(this).children('.blase').toggleClass('blasehover');
      });
*/
      $('.item-page .kommentarhover').on('click', '.blase', function(event) {
         event.preventDefault();
         if ($(this).parent().hasClass('blauerkommentar')) {
            Mailinhalt($(this).parent().text(), 1);
         } else {
            Mailinhalt($(this).parent().text(), 0);
         }
      });
      
      // Werbung anpassen
      $('._wb_home .werbebox2').css({"display": "inline-block", "margin-bottom": "-10px", "max-width": $('.row-fluid').width()});

      
      // Meldung an Parent Window, sobald Seite fertig geladen wurde
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.text  = "parent.IframeGeladen();";
      document.body.appendChild(script);
   }
   
}(jQuery));

