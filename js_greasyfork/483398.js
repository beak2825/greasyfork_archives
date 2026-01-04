// ==UserScript==
// @name         scrollbars figuccio 2024
// @namespace    https://greasyfork.org/users/237458
// @version      0.1
// @description  scrollbar color
// @icon         data:image/png;base64,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
// @author       figuccio
// @license      MIT
// @match        *://*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/483398/scrollbars%20figuccio%202024.user.js
// @updateURL https://update.greasyfork.org/scripts/483398/scrollbars%20figuccio%202024.meta.js
// ==/UserScript==

(function () {
	'use strict';

	GM_addStyle(`
		::-webkit-scrollbar{
			width: 14px;
			height: 14px;
			display: static;
		}
		/*Definisci il colore della traccia, l'ombra interna e gli angoli arrotondati della barra di scorrimento*/
		::-webkit-scrollbar-track{
			border-radius: 5px;
			-webkit-box-shadow: inset 0 0 12px rgba(0,0,0,1);
			background:linear-gradient(to bottom, #FF567F, #FBEB91,#2EC2FF,#8375FF);
			display:none;
		}
		/*Definisci il colore del cursore, l'ombra interna e gli angoli arrotondati*/
		::-webkit-scrollbar-thumb{
			border-radius: 5px;
			-webkit-box-shadow: inset 0 0 10px rgba(255,255,255,1);
			background: #676767!important;
		}
		/*Definire il colore della traccia, l'ombra interna e gli angoli arrotondati della barra di scorrimento orizzontale*/
		::-webkit-scrollbar-track:horizontal{
			border-radius: 5px;
			-webkit-box-shadow: inset 0 0 12px rgba(0,0,0,1);
			background:linear-gradient(to right, #FF567F, #FBEB91,#2EC2FF,#8375FF);
			display:none;
		}
		/*Definisci il colore del cursore orizzontale, l'ombra interna e gli angoli arrotondati*/
		::-webkit-scrollbar-thumb:horizontal{
			border-radius: 5px;
			-webkit-box-shadow: inset 0 0 10px rgba(255,255,255,1);
			background:linear-gradient(to right, #FF567F, #FBEB91,#2EC2FF,#8375FF);
		}
		/*Definire lo stile dei pulsanti su entrambe le estremità*/
		::-webkit-scrollbar-button {
			background-color:#777777;
			display: ;
		}

                                 /*freccia nera sopra*/
       ::-webkit-scrollbar-button:vertical:decrement {
       background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QgFDgo6IB/FRgAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAc0lEQVQoz+XRoQ2DYBiE4YfUkEDqEfW1TNA5EFUdAM0aTNEpSKqwKAZogkJgmpDUgPkFqFa3py757r1PHP+jEgPqb4ELGizocf0EnHDHO0ALHjhvQ4eNT3BDgSPmcE8RoQ1lOyhHhRgjXpjCtwwdnr864go2lhOp4XYeZgAAAABJRU5ErkJggg==)!important;"
		background-size: cover!important;
		background-repeat: no-repeat!important;
		}
            /*freccia nera sotto*/
       ::-webkit-scrollbar-button:vertical:increment {
       background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QgFDgUlKo/UfAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAaUlEQVQoz+XPsQmDUAAE0NfHFdI7gZ1kEmdI6Q6WTuEUQiZIl8o0CYGAvYUg3+aXitZ6zcFxx91xbOR44oMO78jfqGdLoQQVekwYEPBHictaW4pHNAeMaHDdmlngFUMtbnv/1fjh7iSYAfRHFgTlUa3mAAAAAElFTkSuQmCC)!important;"
		background-size: cover!important;
		background-repeat: no-repeat!important;
		}




/*freccia sinistra destra */
    ::-webkit-scrollbar-button:horizontal:increment {
		    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QgFDhMBChSFegAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAdElEQVQoz83QIQoCUQCE4QmCQa9g9wQ28SSeYaN38CQeYlnwBEaLFmVBsBssn0FBEMN7Sf80YX4GJvkZmGFUK+2wwqRGOuOCDRal0sGTOzo0JdIRN2/6z87gm5dk+Mr7JG3J0glXbLGseW+Nac17c4zzFzwANftoDW4riZUAAAAASUVORK5CYII=)!important;
		    background-size: cover!important;
		    background-repeat: no-repeat!important;
		    background-color:green !important;
		    border-bottom-left-radius: 3px!important;
		    border-top-left-radius: 3px!important;
		}


/*freccia sinistra destra */
::-webkit-scrollbar-button:horizontal:decrement {
		    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QgFDhoaUbP33wAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAdElEQVQoz83SsQ1BARQF0BudsILeBDoxiTns8EtT2OLHBDoVDZFI9BqRo1AQUbxfcet3invzkr8Ihph2AWM02FTBHGtccKiAJbaeuWNXQSevXLH/vOl9cU2SNsktST+JaqcZVjjj2GW9ERbl9d7gAJPffcoD60Zo/GBzO+QAAAAASUVORK5CYII=)!important;
		    background-size: cover!important;
		    background-repeat: no-repeat!important;
		    background-color: green!important;
		    border-bottom-right-radius: 3px!important;
		    border-top-right-radius: 3px!important;
		}


		/*Definisce lo stile della giunzione dell'angolo inferiore destro*/
		::-webkit-scrollbar-corner {
			background:#00000000;
			display: none;
		}
		/* Stile di sfondo della casella di scorrimento */
		::-webkit-scrollbar-track-piece {
			background-color: #343d46;
			/*colore di sfondo */
			display:;
		}




		/*---Stile di visualizzazione predefinito della barra di scorrimento--*/

		/* ::-webkit-scrollbar-thumb {
			background-color: #018EE8;
			height: 50px;
			outline-offset: -2px;
			outline: 2px solid #fff;
			-webkit-border-radius: 4px;
			border: 2px solid #fff;
		} */

		/*---Stile di visualizzazione della barra di scorrimento con clic del mouse--*/
		/* ::-webkit-scrollbar-thumb:hover {
			background-color: #FB4446;
			height: 50px;
			-webkit-border-radius: 4px;
		} */

		/*---dimensione della barra di scorrimento--*/
		/* ::-webkit-scrollbar {
			width: 16px;
			height: 16px;
		} */

		/*---Stile di sfondo della casella di scorrimento--*/
		/* ::-webkit-scrollbar-track-piece {
			background-color: #fff;
			-webkit-border-radius: 0;
		} */
	`);
})();
