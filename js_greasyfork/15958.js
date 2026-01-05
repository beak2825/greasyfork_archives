// ==UserScript==
// @name            TW-Collections-PL Translation
// @description     Polish Translation - TW-Collections - Dun from Darius II mod & Azbestka mod
// @include         http*://*.the-west.*/game.php*
// @version         1.2.0
// @grant           none 
// @namespace       https://greasyfork.org/users/26244
// @downloadURL https://update.greasyfork.org/scripts/15958/TW-Collections-PL%20Translation.user.js
// @updateURL https://update.greasyfork.org/scripts/15958/TW-Collections-PL%20Translation.meta.js
// ==/UserScript==
// To add a new language to the TW Collections script:
// Copy / paste this content into a new script
// Replace  translator by your name
//			idscript by the id of the script (last part of the url of your script)
//			short_name by the short name for your language
//			name by the long name of your language
// Replace all lines with your translation
// 
//
// Use with TW Collection script :
// Install this script (and of course TW Collections script), the new language appears in the settings.
//
(function(e) {
	var t = document.createElement("script");
	t.type = "application/javascript";
	t.textContent = "(" + e + ")();";
	document.body.appendChild(t);
	t.parentNode.removeChild(t);
})
		(function() {
			if (window.location.href.indexOf(".the-west.") > 0) {

				TWT_ADDLANG = {
					translator : 'Dun / Darius II / Azbestka',
					idscript : '15958/',
					version : '1.2.0',
					short_name : 'pl',
					name : 'Polski',
					translation : {
                        "title" : "Kolekcje-TW",
                        "description" : "<center><b>Skrypt Kolekcje-TW zawiera między innymi:</b>"
                                      + "<ul style=\"text-align: left; width: 500px;\">"
                                      + "  <li>porady i raporty brakujących elementów kolekcji i zestawów,</li>"
                                      + "  <li>listę potrzebnych przedmiotów do kolekcji,</li>"
                                      + "  <li>opłaty bankowe po najechaniu myszą,</li>"
                                      + "  <li>zbiór różnych przydatnych skrótów,</li>"
                                      + "  <li>opcję usuwania wszystkich raportów,</li>"
                                      + "  <li>dodatkowe przyciski w ekwipunku (duplikaty, do użycia, receptury, zestawy),</li>"
                                      + "  <li>itp...</li>"
                                      + "</ul></center>",
						"translation" : {
                              "title" : 'Tłumaczenia Kolekcje-TW',
                              "desc" : '<div style="width:650px;margin-left:15px;margin-top:20px;height:250px;font-size:16px;text-align:justify;padding-bottom:50px;">'
									 + '<h4 style="margin-bottom:20px;"><center>Zmiany w systemie wersji językowych do skryptu Kolekcje-TW</center></h4>'
									 + "Skrypt Kolekcje-TW zawiera dwie wersje językowe Francuską i Angielską. W celu dodania innej wersji językowej, należy zainstalować jeden z poniższych skryptów, a następnie odświerzyć stronę z grą The-West.<br><br>"
									 + "<div style='text-align: center;overflow: auto; height: 165px;font-size:15px;'>%1</div><br>"
                            		 + "Jeśli chcesz stworzyć własne tłumaczenie, więcej informacji znajdziesz na <a target=\'_blanck\' href=\'https://greasyfork.org/fr/scripts/1670-tw-collections\'>stronie skryptu Kolekcje-TW</a>.</div>"
                            },"Options" : {
							"tab" : {
								"setting" : "Ustawienia",
                                "settingDesc" : "Przejdź do Ustawień",
                                "translation" : "Tłumaczenia",
                                "translationDesc" : "Przejdź do Tłumaczeń"
							},
							"lang" : "Język :",
							"checkbox_text" : {
								"box" : {
									"title" : "Właściwości Menu",
									"options" : {
										"goHome" : "Do miasta",
										"goToDaily1" : "Do Miasta Widma",
										"goToDaily2" : "Do Wioski Wauppe",
										"ownSaloon" : "Saloon",
										"openMarket" : "Targ",
										"mobileTrader" : "Handlarz",
                                        "forum" : "Forum",
										"listNeeded" : "Braki w kolekcji"
									}
								},
								"collection" : {
									"title" : "Kolekcje",
									"options" : {
                                        "gereNewItems" : "Zarządzaj nowymi przedmiotami z osiągnięć",
										"patchsell" : "Oznacz brakujące przedmioty w ekwipunku",
										"patchtrader" : "Oznacz brakujące przedmioty u Handlarza",
										"patchmarket" : "Oznacz brakujące przedmioty na Targu",
										"showmiss" : "Lista brakujących przedmiotów",
										"filterMarket" : "Filtr Targu: Pokaż opcję \"Tylko kolekcje\""
									}
								},
								"inventory" : {
									"title" : "Przyciski w ekwipunku",
									"doublons" : "Duplikaty",
									"options" : {
										"doublons" : "Duplikaty",
										"useables" : "Do spożycia",
										"recipe" : "Receptury",
										"sets" : "Zestawy",
										"sum" : "Pokaż w wyszukiwarce cenę sprzedaży Handlarza"
									}
								},
								"miscellaneous" : {
									"title" : "Różne",
									"options" : {
										"lang" : "Język",
										"logout" : "Włącz przycisk \"Wyloguj \"",
                                        "deleteAllReports" : "Raporty: Dodaj opcję \"Usuń wszystkie raporty\"",
                                        "showFees" : "Bank: Pokaż chmurkę z wysokością opłat po najechaniu myszą na wpłacaną kwotę",
										"popupTWT" : "Otwórz menu \"Narzędzia-TW\" po najechaniu myszą"
									}
								},
                                "craft" : {
										"title" : "Ikony w oknie Rzemiosło",
										"options" : {
											"filterMarket" : "Wyszukiwanie przedmiotów do rzemiosła na Targu",
											"filterMiniMap" : "Wyszukiwanie prac z przedmiotami do rzemiosła na Minimapie"
										}
								},
								"twdbadds" : {
									"title" : "Dodatek TW-DB Clothcalc",
									"options" : {
										"filterBuyMarket" : "Filtr Targu: Pokaż tylko zaznaczone brakujące przedmioty <a target='_blanck' href=\"http://tw-db.info/?strana=userscript\">(TW-DB dodatek)</a>"
									}
								}
							},
							"message" : {
								"title" : "Informacje",
								"message" : "Ustawienia zostały zapisane",
								"reloadButton" : "Odswież stronę",
								"gameButton" : "Powrót do gry",
								"more" : "Więcej...",
								"moreTip" : "Otwórz zakładkę tłumaczenia",
								"indispo" : "Ustawienie niedostępne (Kolekcja zakończona lub skrypt jest niedostępny)"
							},
							"update" : {
                                "title" : "Aktualizuj",
								"upddaily" : "Codziennie",
								"updweek" : "Tygodniowo",
								"updnever" : "Nigdy",
								"checknow" : "Sprawdź aktualizacje teraz",
								"updok" : "Skrypt Kolekcje-TW jest aktualny",
								"updlangmaj" : "Aktualizacja jest dostępna dla jednego lub większej liczby języków skryptu Kolekcje-TW.<br/>Kliknij na linki, aby zaktualizować.",
								"updscript" : " Aktualizacja jest dostępna dla skryptu Kolekcje-TW<br/>Aktualizować?",
								"upderror" : "Nie można uaktualnić, należy zainstalować ręcznie skrypt lub język"
							},
							"saveButton" : "Zapisz"
						},
						"Craft" : {
								"titleMarket" : "Szukaj na Targu",
								"titleMinimap" : "Odnajdź pracę na Minimapie"
							},
						"ToolBox" : {
							"title" : "Narzędzia-TW",
							"list" : {
								"openOptions" : "Ustawienia",
								"errorLog" : "Błąd konsoli"
							}
						},
						"Doublons" : {
							"tip" : "Duplikaty",
							"tipuse" : "Do użycia",
							"tiprecipe" : "Receptury",
							"tipsets" : "Zestawy",
							"current" : "Ta wyszukiwarka",
							"noset" : "Bez zestawów",
							"sellable" : "Chodliwy", //"Można sprzedać"
							"auctionable" : "Chodliwy na aukcji", //"Można wystawić na aukcję"
							"sellGain" : "$ od Handlarza" 
						},
						"Logout" : {
							"title" : "Wyloguj"
						},
						"AllReportsDelete" : {
							"button" : "Usuń wszystkie raporty",
							"title" : "Usuwanie raportów",
							"work" : "Praca",
							"progress" : "Postęp",
							"userConfirm" : "Potwierdzenie użytkownika",
							"loadPage" : "Ładowanie strony",
							"deleteReports" : "Usunięto raporty",
							"confirmText" : "Czy napewno usunąć raporty?",
							"deleteYes" : "Usuń",
							"deleteNo" : "Anuluj",
							"status" : {
								"title" : "Status",
								"wait" : "Czekaj",
								"successful" : "Pomyślnie",
								"fail" : "Niepowodzenie",
								"error" : "Błąd"
							}
						},
						"fees" : {
							"tipText" : "%1 % Prowizja : $%2"
						},
						"twdbadds" : {
							"buyFilterTip" : "Pokaż tylko brakujące przedmioty",
							"buyFilterLabel" : "Tylko brakujące"
						},
						"collection" : {
							"colTabTitle" : "Kolekcje",
							"setTabTitle" : "Zestawy",
                            "setType" : {
                                    "body" : "Zestawy Ubrań",
                                    "guns" : "Zestawy Broni",
                                    "animal" : "Zestawy Zwierząt"
                                },
                            "miss" : "Brakuje: ",
							"thText" : "Liczba brakujących przedmiotów: %1",
							"thEncours" : "Bierzesz udział w licytacji tego produktu",
							"thFetch" : "Możesz odebrać ten przedmiot z targu w mieście %1",
							"allOpt" : "- wszystko -",
							"collectionFilterTip" : "Pokaż tylko brakujące przedmioty do kolekcji", //chmurka na targu
							"collectionFilterLabel" : "Tylko kolekcje",
							"select" : "Wybierz...",
							"listText" : "Brakujące przedmioty do kolekcji",
                            "listSetText" : "Brakujące przedmioty w zestawach",
                            "filters" : "Filtry",
                            "filtersType" : 'Pokaż / Ukryj przedmioty wymagane, aby otrzymać ',
							"atTrader" : "U Handlarza",
							"atBid" : "Licytowane",
							"atCurBid" : "Kupione",
							"atTraderTitle" : "Pokaż przedmioty dostępne u Handlarza",
							"atBidTitle" : "Pokaż przednioty które licytujesz na Targu",
							"atCurBidTitle" : "Pokaż przedmioty kupione na Targu",
							"searchMarket" : "Szukaj na Targu",
							"patchsell" : {
								"title" : "Lista brakujących przedmiotów"
							}
						}
					},
					// DO NOT CHANGE BELOW THIS LIGNE
					init : function() {
						var that = this;
						if (typeof window.TWT == 'undefined'
								|| window.TWT == null) {
							EventHandler.listen('twt.init', function() {
								TWT.addPatchLang(that);
								return EventHandler.ONE_TIME_EVENT; // Unique
							});
						} else {
							EventHandler.signal('twt_lang_started_'
									+ that.short_name);
							TWT.addPatchLang(that);

						}
					}

				}.init();
			}
		});