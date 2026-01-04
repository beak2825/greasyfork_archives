// ==UserScript==
// @name            TW-Collections-GR Translation
// @description     Greek Translation - TW-Collections - see below 
// @include         http://*.the-west.*/game.php*
// @include         http://userscripts.org/scripts/source/178803*
// @version         1.4.0.1
// @grant       none 
// @namespace https://greasyfork.org/users/2196
// @downloadURL https://update.greasyfork.org/scripts/395476/TW-Collections-GR%20Translation.user.js
// @updateURL https://update.greasyfork.org/scripts/395476/TW-Collections-GR%20Translation.meta.js
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
	t.parentNode.removeChild(t)
})
		(function() {
			if (window.location.href.indexOf(".the-west.") > 0) {

				TWT_ADDLANG = {
					translator : 'Μάταιος Φρουρός',
					idscript : '1673',
					version : '1.4.0.1',
					short_name : 'el-GR',
					name : 'Greek',
					translation : {
					   // START OF LANGUAGE VARS
						
						
							description : "<center><BR /><b>TW-Collections</b><br>Συμβουλές και ειδοποίηση για υπολοιπόμενες συλλογές αντικειμένων <br>λίστα υπολοιπόμενων αντικειμένων συλλογών<BR> Τραπεζικό τέλος με mouseover <br> Διάφορες συντομεύσεις"
									+ "<br>Διαγραφή όλων των αναφορών<br> Τραπεζικά τέλη <br> Επιπλέον επιλογές στα αποθέματα (διπλά, χρησιμοποιήσιμα, συνταγές, σετ) <br>κλπ ...",
							Options : {
								tab : {
									setting : 'Ρυθμίσεις'
								},
								checkbox_text : {
									box : {
										title : 'Λειτουργίες / Μενού',
										options : {
											goHome : 'Πήγαινε στην πόλη',
											goToDaily1 : 'Πόλη Φάντασμα',
											goToDaily2 : 'Ινδιάνικο Χωριό Waupee',
											ownSaloon : 'Άνοιξε το Σαλούν',
											openMarket : 'Άνοιξε την Αγορά',
											mobileTrader : 'Άνοιξε τον Πλανόδιο Πωλητή',
											forum : 'Άνοιξε το Φόρουμ',
											listNeeded : 'απαιτούμενα αντικείμενα για συλλογές'

										}
									},
									collection : {
										title : 'Συλλογές',
										options : {
											gereNewItems : 'Διαχείρηση νέων αντικειμένων σε ολοκληρωμένες συλλογές',
											patchsell : 'Ένδειξη υπολοιπώμενων αντικειμένων στα αποθέματα',
											patchtrader : 'Ένδειξη υπολοιπώμενων αντικειμένων στα καταστήματα',
											patchmarket : 'Ένδειξη υπολοιπώμενων αντικειμένων στην αγορά',
											showmiss : 'Λίστα υπολοιπώμενων αντικειμένων στην άκρη',
											filterMarket : 'Φίλτρο Αγοράς : δείξε μόνο τα υπολοιπόμενα αντικείμενα (συλλογές)'

										}
									},
									inventory : {
										title : 'Κουμπιά στα αποθέματα',
										options : {
											doublons : 'Προσθήκη κουμπιού αναζήτησης διπλότυπων',
											useables : 'Προσθήκη κουμπιού αναζήτησης χρησιμοποιήσιμων',
											recipe : 'Προσθήκη κουμπιού αναζήτησης συνταγών',
											sets : 'Προσθήκη κουμπιού λίστας σετ',
											sum : 'Εμφάνιση συνολικού ποσού σε τιμή πώλησης της αναζήτησης'

										}
									},
									miscellaneous : {
										title : 'Διάφορα',
										options : {
											lang : 'Γλώσσα',
											logout : 'Προσθήκη κουμπιού αποσύνδεσης',
											deleteAllReports : 'Προσθήκη επιλογής για απόκρυψη όλων των αναφορών',
											showFees : 'Προσθήκη ένδειξης των τραπεζικών τελών με το πέρασμα του ποντικιού',
											popupTWT : 'Άνοιγμα μενού του TW Collections με το πέρασμα του ποντικιού'
										}
									},craft : {
										title : 'Δημιουργία',
										options : {
										   filterMarket : 'Εικονίδιο για αναζήτηση αντικειμένου στην αγορά',
										   filterMiniMap : 'Εικονίδιο για αναζήτηση αντικειμένου στον χάρτη'
										}
									}, 
									twdbadds : {
										title : 'Clothcalc Add-on',
										options : {
											filterBuyMarket : 'Φίλτρο αγοράς : εμφάνισε μόνο τα μαρκαρισμένα αντικείμενα <a target=\'_blanck\' href="http://tw-db.info/?strana=userscript">(twdb add)</a>'
										
										}
									}
								},
								message : {
									title : 'Πληροφορίες',
									message : 'Οι προτιμήσεις εφαρμόστηκαν.',
									reloadButton : 'Επαναφόρτωση αυτής της σελίδας',
									gameButton : 'Επιστροφή στο παιχνίδι',
									indispo : 'Μη διαθέσιμη επιλογή (Συλλογές ολοκληρωμένες ή το σκριπτ δεν είναι διαθέσιμο)',
									more : 'Περισσότερα ?',
									moreTip : 'Άνοιγμα σελίδας μεταφράσεων'
								},
								update : {
									title : 'Ενημέρωση',
									upddaily : 'Κάθε μέρα',
									updweek : 'Κάθε εβδομάδα',
									updnever : 'Ποτέ',
									checknow : 'Έλεγχος ενημερώσεων τώρα ?',
									updok : "Το σκριπτ TW Collections είναι ενημερωμένο",
									updlangmaj : 'Μία ενημέρωση ή μία γλώσσα για το TW Collections είναι διαθέσιμη.<BR>Κλικ στους συνδέσμους παρακάτω για ενημέρωση.',
									updscript : 'Μία ενημέρωση είναι διθέσιμη για το TW Collections<br/>Ενημέρωση ?',
									upderror : 'Δεν είναι δυνατή η ενημέρωση, πρέπει να εγκαταστήσετε το σκριπτ ή τη γλώσσα με μη αυτόματο τρόπο'
								},
								saveButton : 'Αποθήκευση'

							},
							Craft : {
								titleMarket : 'Αναζήτηση αντικειμένου στην αγορά',
								titleMinimap : 'Εύρεση δουλειάς στο χάρτη'
							},
							ToolBox : {
								title : 'Λειτουργίες',
								list : {
									openOptions : 'Ρυθμίσεις'
								}
							},
							Doublons : {
								tip : 'Εμφάνιση μόνο διπλότυπων',
								current : 'Τρέχουσα αναζήτση',
								noset : 'Χωρίς αντικείμενα σετ',
								sellable : 'Με δυνατότητα πώλησης',
								auctionable : 'Με δυνατότητα δημοπρασίας',
								tipuse : 'Εμφάνιση μόνο χρησιμοποιήσιμων',
								tiprecipe : 'Εμφάνιση μόνο συνταγών',
								tipsets : 'Εμφάνιση μόνο αντικείμεων σετ',
								sellGain : '$ από πώληση στον έμπορο'
							},
							Logout : {
								title : 'Απόσυνδεση'
							},
							AllReportsDelete : {
								button : 'Απόκρυψη όλων',
								title : 'Απόκρυψη όλων των αναφορών',
								work : 'Δουλειά',
								progress : 'Πρόοδος',
								userConfirm : 'Επιβεβαίωση Χρήστη',
								loadPage : 'Φόρτωση σελίδας',
								deleteReports : 'Διαγραφή αναφορών',
								confirmText : 'Απόκρυψη όλων των αναφορών - Σίγουρα ?',
								deleteYes : 'Ναι, διαγραφή',
								deleteNo : 'Όχι, μην τα διαγράψεις',
								status : {
									title : 'Κατάσταση',
									wait : 'Περίμενε',
									successful : 'Επιτυχία',
									fail : 'Άποτυχία',
									error : 'Σφάμλα'
								}
							},
							fees : {
								tipText : '%1% Τέλη: $%2'

							},
							twdbadds : {
								buyFilterTip : 'Εμφάνιση μόνο υπολειπόμενων αντικειμένων',
								buyFilterLabel : 'Υπολειπόμενα αντικείμενα'
							},
							collection : {
								miss : "Λείπουν : ",
								colTabTitle :"Συλλογές",
								setTabTitle :"Σετ",
								thText : '%1 missing item%2',
								thEncours : 'Έχεις κάνει προσφορά για αυτό το αντικείμενο',
								thFetch: 'Μπορείς να το αποκτήσεις στην αγορά του%1',
								allOpt : 'Όλα',
								collectionFilterTip : 'Εμφάνιση μόνο αντικειμένων συλλογών',
								collectionFilterLabel : 'Συλλογές μόνο',
								select : 'Επιλογή ...',
								listText : 'απαιτούμενα αντικείμενα για συλλογές',
								listSetText : 'απαιτούμενα αντικείμενα για σετ',
								filters : 'Φίλτρα',
								atTrader : 'Πωλήθηκαν στον Πλανόδιο Πωλητή',
								atBid : 'Τρέχουσες προσφορές',
								atCurBid : 'Ολοκληρωμένες δημοπρασίες',
								atTraderTitle : 'Εμφάνιση αντικειμένων που πωλούνται στον Πλανόδιο',
								atBidTitle : 'Εμφάνιση τρέχουσων προσφορών',
								atCurBidTitle : 'Εμφάνιση διαθέσιμων αντικειμένων στην αγορά',
								searchMarket : 'Αναζήτηση στην αγορά',
								patchsell : {
									title : "Απαιτούμενα αντικείμενα για ολοκλήρωση συλλογών"
								}
							}
						
						
						// END OF LANGUAGE VARS
					},
					// DO NOT CHANGE BELOW THIS LIGNE
					init : function() {
						var that = this;
						if (typeof window.TWT == 'undefined'
								|| window.TWT == null) {
							EventHandler.listen('twt.init', function() {
								TWT.addPatchLang(that);
								return EventHandler.ONE_TIME_EVENT;
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