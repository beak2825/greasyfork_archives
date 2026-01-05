// ==UserScript==
// @name            TW-Collections-GR Translation
// @description     Greek Translation - TW-Collections - see below 
// @include         http*://*.the-west.*/game.php*
// @version         1.1.1
// @grant       none 
// @namespace https://greasyfork.org/users/2196
// @downloadURL https://update.greasyfork.org/scripts/10995/TW-Collections-GR%20Translation.user.js
// @updateURL https://update.greasyfork.org/scripts/10995/TW-Collections-GR%20Translation.meta.js
// ==/UserScript==
// To add a new language to the TW Collections script :
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
					translator : 't66chris',
					idscript : '10995',
					version : '1.1.1',
					short_name : 'El-Gr',
					name : 'Ελληνικά',
					translation : {
						description : "<center><BR /><b>TW Collections</b><br><b>Italian Traduction - Tips and reporting missing items collections <br>list of collection needed items<BR> Bank fees on mouseover <br> Various shortcuts"
								+ "<br>All reports deletion<br> <Bank Fees <BR>Duplicates in Inventory<BR>etc ...</b>",
						Options : {
							tab : {
								setting : 'Ρυθμίσεις'
							},
							lang : 'Γλώσσα :',
							checkbox_text : {
								box : {
									title : 'Λειτουργίες / Μενού',
									options : {
										goHome : 'Κίνηση στην πόλη',
										goToDaily1 : 'Πόλη Φάντασμα',
										goToDaily2 : 'Ινδιάνικο χωριό του Waupee',
										ownSaloon : 'Σαλούν',
										openMarket : 'Αγορά',
										mobileTrader : 'Έμπορος',
										listNeeded : 'Αντικείμενα για συλλογες'
									}
								},
								collection : {
									title : 'Συλλογές',
									options : {
										patchsell : 'Σύμβολο για αντικείμενα που λείπουν στα Αποθέματα',
							      patchtrader : 'Σύμβολο για αντικείμενα που λείπουν στον Έμπορο',
							      patchmarket : 'Σύμβολο για αντικείμενα που λείπουν στην Αγορά',
							      showmiss : 'Δείξε λίστα από τα αντικείμενα που λείπουν πάνω στο σύμβολο',
							      filterMarket : 'Φίλτρο Αγοράς : Εμφάνισε μόνο τα αντικείμενα που σου λείπουν (συλλογές)'
									}
								},
								inventory : {
										title : 'Κουμπιά στα Αποθέματα',
						doublons : 'Επιπρόσθετα κουμπιά στα Αποθέματα (διπλά αντικείμενα, χρησιμοποιήσιμα, συνταγές, σετάκια)',
						options : {
							doublons : 'Πρόσθεσε κουμπί για αναζήτηση των διπλών αντικειμένων',
							useables : 'Πρόσθεσε κουμπί για αναζήτηση των χρησιμοποιήσιμων',
							recipe : 'Πρόσθεσε κουμπί για αναζήτηση των συνταγών',
							sets : 'Πρόσθεσε κουμπί για λίστα από τα Σετ',
							sum : 'Εμφάνισε το συνολικό κέρδος της τιμής πώλησης των αντικειμένων'

									}
								},
								miscellaneous : {
									title : 'Διάφορα',
									options : {
										lang : 'Γλώσσα :',
										logout : 'Πρόσθεσε κουμπί Αποσύνδεσης',
										deleteAllReports : 'Πρόσθεσε επιλογή για διαγραφή όλων των αναφορών',
										showFees : 'Πρόσθεσε τραπεζικά έξοδα με το πέρασμα του ποντικιού'
									}
								},
								twdbadds : {
									title : 'Πρόσθετο του Clothcalc',
									options : {
										filterBuyMarket : 'Φίλτρο Αγοράς : Εμφάνισε μόνο τα αντικείμενα που σου λείπουν (twdb add)'
									}
								}
							},
							message : {
								title : 'Πληροφορίες',
								message : 'Οι αλλαγές αποθηκεύτηκαν',
					      reloadButton : 'Ανανέωση σελίδας',
					      gameButton : 'Επιστροφή στο παιχνίδι',
					      indispo : 'Ρύθμιση μη διαθέσιμη (Ολοκληρωμένες συλλογές ή το script δεν είναι διαθέσιμο)'
							},
							update : {
								title : ' Ενημέρωση του script',
								upddaily : 'Κάθε μέρα',
								updweek : 'Κάθε βδομάδα',
								updnever : 'Ποτέ',
								checknow : 'Έλεγχος για ενημερώσεις τώρα;',
							},
							saveButton : 'Αποθήκευση'
						},
						ToolBox : {
							title : 'Λειτουργίες',
							list : {
								openOptions : 'Ρυθμίσεις'
							}
						},
						Doublons : {
							tip : 'Εμφάνιση μόνο διπλών αντικειμένων',
							tipuse : 'Εμφάνιση μόνο χρησιμοποιήσιμων',
							tiprecipe : 'Εμφάνιση μόνο συνταγών',
							tipsets : 'Εμφάνιση αντικειμένων από σετ',
							sellGain : '$ συνολική τιμή πώλησης'
						},
						Logout : {
							title : 'Αποσύνδεση'
						},
						AllReportsDelete : {
							button : 'Διαγραφή όλων',
							title : 'Διαγραφή όλων των αναφορών',
							work : 'Εργασία',
							progress : 'Πρόοδος Εργασιών',
							userConfirm : 'Επιβεβαίωση',
							loadPage : 'Φόρτωμα σελίδα',
							deleteReports : 'Διαγραφή αναφορών',
							confirmText : 'Διαγραφή όλων - Είσαι σίγουρος;',
							deleteYes : 'Ναι, διαγραφή',
							deleteNo : 'Όχι, μην τις διαγράφεις',
							status : {
								title : 'Κατάσταση',
								wait : 'Αναμονή',
								successful : 'Επιτυχής',
								fail : 'Αποτυχία',
								error : 'Σφάλμα'
							}
						},
						fees : {
							tipText : '%1 % Φόρος: $%2'

						},
						twdbadds : {
							buyFilterTip : 'Εμφάνισε μόνο τα αντικείμενα που λείπουν',
							buyFilterLabel : 'Αυτά που λείπουν'
						},
						collection : {
							miss : "Λείπουν: ",
							thText : '%1 Αντικέιμενα που λείπουν%2',
							thEncours : 'Έχεις προσφορά γι αυτό το αντικείμενο',
							thFetch : 'Μπορείτε να ανακτήσετε αυτό το αντικείμενο στην αγορά της πόλης %1',
							allOpt : 'Όλα',
							collectionFilterTip : 'Εμφάνισε μόνο αντικείμενα για Συλλογές',
							collectionFilterLabel : 'Μόνο για Συλλογές',
							select : 'Επιλογή Κατηγορίας >>',
							listText : 'Αντικείμενα για Συλλογή',
							patchsell : {
								title : "Αντικείμενα που χρειάζοντε για τη συμπλήρωση των συλλογών",
								style : "position:relative;top:0px;left:0px;width:12px;height:12px;padding:0px;border:0px;margin:0px;",
								styleT : "position:absolute;top:4px;left:3px;width:15px;height:15px;padding:0px;border:0px;margin:0px;"
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