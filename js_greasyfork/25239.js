// ==UserScript==
// @name           WME URComments Spanish List
// @description    This script is for Spanish comments to be used with Rick Zabel's script URComments (URC), maintained by cotero2002
// @namespace      RickZabel@gmail.com
// @grant          none
// @grant          GM_info
// @version        0.4.92
// @match          https://beta.waze.com/*editor*
// @match          https://www.waze.com/*editor*
// @author         Cefín E Otero (cotero2002) 11/22/2015  Last Edited 04/28/2017
// @license        MIT/BSD/X11
// @icon			data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAwCAYAAACFUvPfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQyQjZDNjdEODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQyQjZDNjdFODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDJCNkM2N0I4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDJCNkM2N0M4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6++Bk8AAANOElEQVR42tRZ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
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
//AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// @downloadURL https://update.greasyfork.org/scripts/25239/WME%20URComments%20Spanish%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/25239/WME%20URComments%20Spanish%20List.meta.js
// ==/UserScript==
/*jshint multistr: true */
var URCommentSpanishVersion = GM_info.script.version; 
//var URCommentSpanishVersion = "0.4.7"; //manually change this version number to match the script's version 
var URCommentSpanishUpdateMessage = "yes"; // yes alert the user, no has a silent update.
var URCommentSpanishVersionUpdateNotes = "La lista de comentarios en Español para URC ha sido actualizada a la versión: v." + URCommentSpanishVersion;
//remove any lines >1 month old. dont leave \n on last line.
URCommentSpanishVersionUpdateNotes = URCommentSpanishVersionUpdateNotes + "\n" +
"Qué es lo nuevo:\n\
v.0.4.92 2018-07-25 - Cambios menores, mejoras al texto de algunos de los comentarios  (Gasparfox)\n\
v.0.4.91 2017-12-19 - Se agrega comentario por desvío lateral por peajes o TAG,  mejoras al texto de algunos comentarios  (Gasparfox)\n\
v.0.4.8 2017-04-28 - Se agrega comentario restricción horaria, cambios menores, mejoras al texto de algunos de los comentarios  (Gasparfox)\n\
v.0.4.7 2017-03-27 - cambios menores, mejoras al texto de algunos de los comentarios  (Gasparfox)\n\
v.0.4.5 2016-09-06 - Se incluyo comentario sobre Límite de Velocidad Corregido  (cotero2002)\n\
v.0.4.4 2016-09-03 - cambios menores, mejoras al texto de algunos de los comentarios (cotero2002)";


if (URCommentSpanishUpdateMessage === "yes") {
	if (localStorage.getItem('URCommentSpanishVersion') !== URCommentSpanishVersion) {
		alert(URCommentSpanishVersionUpdateNotes);
		localStorage.setItem('URCommentSpanishVersion', URCommentSpanishVersion);
	}
}

/* Changelog
 * 5th update to the format
 * 0.0.1 - initial version
 */
//I will try not to update this file but please keep a external backup of your comments as the main script changes this file might have to be updated. When the Spanish comments file is auto updated you will loose your Spanish comments. By making this a separate script I can try to limit how often this would happen but be warned it will eventually happen.
//if you are using quotes in your titles or comments they must be properly escaped. example "Comment \"Comment\" Comment",
//if you wish to have blank lines in your messages use \n\n. example "Line1\n\nLine2",
//if you wish to have text on the next line with no spaces in your message use \n. example "Line1\nLine2",
//Cotero2002 11/20/15 Configuration: this allows your "reminder", and close as "not identified" messages to be named what ever you would like.
//the position in the list that the reminder message is at. (starting at 0 counting titles, comments, and ur status). in my list this is "4 day Follow-Up"
window.UrcommentsSpanishReminderPosistion = 21;

//this is the note that is added to the the reminder link  option
window.UrcommentsSpanishReplyInstructions = 'To reply, please either use the Waze app or go to '; //followed by the URL - superdave, rickzabel, t0cableguy 3/6/2015

//the position of the close as Not Identified message (starting at 0 counting titles, comments, and ur status). in my list this is "7th day With No Response"
window.UrcommentsSpanishCloseNotIdentifiedPosistion = 24;

//This is the list of Waze's default UR types. edit this list to match the titles used in your area! 
//You must have these titles in your list for the auto text insertion to work!
window.UrcommentsSpanishdef_names = [];
window.UrcommentsSpanishdef_names[6] = "Giro Incorrecto"; //"Incorrect turn";
window.UrcommentsSpanishdef_names[7] = "Dirección Incorrecta"; //"Incorrect address";
window.UrcommentsSpanishdef_names[8] = "Ruta Incorrecta"; //"Incorrect route";
window.UrcommentsSpanishdef_names[9] = "Falta Rotonda"; //"Missing roundabout";
window.UrcommentsSpanishdef_names[10] = "Error General"; //"General error";
window.UrcommentsSpanishdef_names[11] = "Giro no Permitido"; //"Turn not allowed";
window.UrcommentsSpanishdef_names[12] = "Cruce Incorrecto"; //"Incorrect junction";
window.UrcommentsSpanishdef_names[13] = "Falta Paso Elevado (puente)"; //"Missing bridge overpass";
window.UrcommentsSpanishdef_names[14] = "Sentido de Conducción Incorrecto"; //"Wrong driving direction";
window.UrcommentsSpanishdef_names[15] = "Falta Salida"; //"Missing Exit";
window.UrcommentsSpanishdef_names[16] = "Falta Carretera"; //"Missing Road";
window.UrcommentsSpanishdef_names[18] = "Falta Punto de Interés"; //"Missing Landmark";
window.UrcommentsSpanishdef_names[19] = "Carretera Bloqueada"; //"Blocked Road";
window.UrcommentsSpanishdef_names[21] = "Falta Nombre de Carretera"; //"Missing Street Name";
window.UrcommentsSpanishdef_names[22] = "Prefijo o Sufijo de Carretera Incorrecto"; //"Incorrect Street Prefix or Suffix";
window.UrcommentsSpanishdef_names[23] = "Límite de Velocidad falta o es inválido"; //"Speed Limit missing or incorect";

//below is all of the text that is displayed to the user while using the script
window.UrcommentsSpanishURC_Text = [];
window.UrcommentsSpanishURC_Text_tooltip = [];
window.UrcommentsSpanishURC_USER_PROMPT = [];
window.UrcommentsSpanishURC_URL = [];

//zoom out links
window.UrcommentsSpanishURC_Text[0] = "Zoom a 0 & cerrar UR"; //"Zoom Out 0 & Close UR";
window.UrcommentsSpanishURC_Text_tooltip[0] = "Aleja el Zoom completamente y cierra la ventana del UR";

window.UrcommentsSpanishURC_Text[1] = "Zoom a 2 & cerrar UR"; //"Zoom Out 2 & Close UR";	
window.UrcommentsSpanishURC_Text_tooltip[1] = "Aleja el Zoom a nivel 2 y cierra la ventana del UR (aquí es donde encontré que la mayoría de las herramientas del WME Toolbox funcionan)";

window.UrcommentsSpanishURC_Text[2] = "Zoom a 3 & cerrar UR"; //"Zoom Out 3 & Close UR";
window.UrcommentsSpanishURC_Text_tooltip[2] = "Aleja el Zoom a nivel 3 y cierra la ventana del UR (aquí es donde encontré que la mayoría de las herramientas del WME Toolbox funcionan))";

window.UrcommentsSpanishURC_Text_tooltip[3] = "Recargar el mapa"; //"Reload the map";

window.UrcommentsSpanishURC_Text_tooltip[4] = "Número URs Mostrados"; //"Number of URs Shown";

//tab names
window.UrcommentsSpanishURC_Text[5] = "Comentarios"; //"Comments";
window.UrcommentsSpanishURC_Text[6] = "Filtrar URs"; //"UR Filtering";
window.UrcommentsSpanishURC_Text[7] = "Ajustes"; //"Settings";

//Pestaña de Filtrado de URs //UR Filtering Tab
window.UrcommentsSpanishURC_Text[8] = "Dar Clic aquí para Instrucciones"; //"Click here for Instructions"
window.UrcommentsSpanishURC_Text_tooltip[8] = "Instrucciones para el filtrado de URs"; //"Instructions for UR filtering";
window.UrcommentsSpanishURC_URL[8] = "http://docs.google.com/presentation/d/1zwdKAejRbnkUll5YBfFNrlI2I3Owmb5XDIbRAf47TVU/edit#slide-id.p";
		
window.UrcommentsSpanishURC_Text[9] = "Activar el filtrado de URs de URComments"; //"Enable URComments UR filtering";
window.UrcommentsSpanishURC_Text_tooltip[9] = "Activa o desactiva el filtrado de URComments"; //"Enable or disable URComments filtering";

window.UrcommentsSpanishURC_Text[10] = "Activar las píldoras de conteo en los URs"; //"Enable UR pill counts";
window.UrcommentsSpanishURC_Text_tooltip[10] = "Activa o desactiva las píldoras de conteo en loa URs"; //"Enable or disable the pill with UR counts";

window.UrcommentsSpanishURC_Text[12] = "Ocultar URs en espera"; //"Hide Waiting";
window.UrcommentsSpanishURC_Text_tooltip[12] = "Solo muestra los URs que necesitan ser trabajados (oculta los que están en estados intermedios)"; //"Only show URs that need work (hide in-between states)";

window.UrcommentsSpanishURC_Text[13] = "Mostrar solamente mis URs"; //"Only show my URs";
window.UrcommentsSpanishURC_Text_tooltip[13] = "Oculta los URs donde usted no tiene comentarios"; //"Hide URs where you have no comments";

window.UrcommentsSpanishURC_Text[14] = "Mostrar URs de otros que exeden el periodo de Recordatorio + Cierre"; //"Show others URs past reminder + close";
window.UrcommentsSpanishURC_Text_tooltip[14] = "Muestra los URs en los que otros han comentado y que han sobrepasado el límite de días de espera de recordatorio y cierre sumados"; //"Show URs that other commented on that have gone past the reminder and close day settings added together";

window.UrcommentsSpanishURC_Text[15] = "Ocultar URs que necesitan Recordatorio"; //"Hide URs Reminder needed";
window.UrcommentsSpanishURC_Text_tooltip[15] = "Oculta los URs que necesitan mensaje de recordatorio"; //"Hide URs where reminders are needed";

window.UrcommentsSpanishURC_Text[16] = "Ocultar URs con respuestas de los usuarios"; //"Hide URs user replies";
window.UrcommentsSpanishURC_Text_tooltip[16] = "Oculta los URs que tienen respuestas de los usuarios"; //"Hide UR with user replies";

window.UrcommentsSpanishURC_Text[17] = "Ocultar URs que necesitan ser cerrados"; //"Hide URs close needed";
window.UrcommentsSpanishURC_Text_tooltip[17] = "Oculta los URs que necesitan ser cerrados"; //"Hide URs that need closing";

window.UrcommentsSpanishURC_Text[18] = "Ocultar URs sin comentarios"; //"Hide URs no comments";
window.UrcommentsSpanishURC_Text_tooltip[18] = "Oculta los URs que tienen cero comentarios"; //"Hide URs that have zero comments";

window.UrcommentsSpanishURC_Text[19] = "Ocultar URs 0 comentarios y sin descripción"; //"hide 0 comments without descriptions";
window.UrcommentsSpanishURC_Text_tooltip[19] = "Oculta los URs que no tienen descripción o comentarios"; //"Hide URs that do not have descriptions or comments";

window.UrcommentsSpanishURC_Text[20] = "Ocultar URs 0 comentarios y con descripción"; //"hide 0 comments with descriptions";
window.UrcommentsSpanishURC_Text_tooltip[20] = "Oculta los URs que tienen descripción pero cero (0) comentarios"; //"Hide URs that have descriptions and zero comments";

window.UrcommentsSpanishURC_Text[21] = "Ocultar URs Cerrados"; //"Hide Closed URs";
window.UrcommentsSpanishURC_Text_tooltip[21] = "Oculta los URs cerrados"; //"Hide closed URs";

window.UrcommentsSpanishURC_Text[22] = "Ocultar URs Etiquetados"; //"Hide Tagged URs";
window.UrcommentsSpanishURC_Text_tooltip[22] = "Ocultar URs que están etiquetados con etiquetas de URO+ ej. [NOTA]"; //"Hide URs that are tagged with URO+ style tags ex. [NOTE]";

window.UrcommentsSpanishURC_Text[23] = "Días de espera para Recordatorio: "; //"Reminder days: ";

window.UrcommentsSpanishURC_Text[24] = "Días de espera para Cierre: "; //"Close days: ";

//Pestaña de Ajustes //settings tab
window.UrcommentsSpanishURC_Text[25] = "Auto-envío de comentario a URs nuevos"; //"Auto set new UR comment"
window.UrcommentsSpanishURC_Text_tooltip[25] = "Envía un comentario (UR comment) automáticamente a los URs nuevos que no tienen comentarios todavía"; //"Auto set the UR comment on new URs that do not already have comments"

window.UrcommentsSpanishURC_Text[26] = "Auto-envío de recordatorio a URs "; //"Auto set reminder UR comment"
window.UrcommentsSpanishURC_Text_tooltip[26] = "Envía automáticamente un recordatorio a los URs que exeden los días de espera del recordatorio y tienen un solo comentario"; //"Auto set the UR reminder comment for URs that are older than reminder days setting and have only one comment"

window.UrcommentsSpanishURC_Text[27] = "Realizar Auto Zoom en URs nuevas"; //"Auto zoom in on new UR"
window.UrcommentsSpanishURC_Text_tooltip[27] = "Realiza un Zoom automático cuando los URs no tienen comentarios y se están enviando avisos"; //"Auto zoom in when opening URs with no comments and when sending UR reminders"

window.UrcommentsSpanishURC_Text[28] = "Centrar automáticamente en un UR";  //"Auto center on UR"
window.UrcommentsSpanishURC_Text_tooltip[28] = "Centra el mapa con el zoom actual cuando un UR tiene comentarios y el nivel del zoom es menor de 3"; //"Auto Center the map at the current map zoom when UR has comments and the zoom is less than 3"

window.UrcommentsSpanishURC_Text[29] = "Auto clic Abierto, Arreglado o No Identificado"; //"Auto clic open, solved, not identified"
window.UrcommentsSpanishURC_Text_tooltip[29] = "Suprime el mensaje sobre preguntas pendientes recientes al reportero y luego dependiendo de la elección establecida para ese comentario, clics Abierto, Arreglado, No Identificado"; //"Suppress the message about recent pending questions to the reporter and then depending on the choice set for that comment clics Open, Solved, Not Identified"

window.UrcommentsSpanishURC_Text[30] = "Auto-salvar después de comentario de Arreglado o No identificado"; //"Auto save after a solved or not identified comment"
window.UrcommentsSpanishURC_Text_tooltip[30] = "Si se ingresa un comentario y se selecciona Resuelto o No Identificado, se guarda automáticamente el UR"; //"If Auto clic Open, Solved, Not Identified is also checked, this option will clic the save button after clicing on a UR-Comment and then the send button"

window.UrcommentsSpanishURC_Text[31] = "Cierre automático de la ventana de comentarios"; //" Auto close comment window"
window.UrcommentsSpanishURC_Text_tooltip[31] = "En los UR que no requieren ser salvados esta opción los cerrará al dar clic en UR-Comment y la cerrará"; //"For the user requests that do not require saving this will close the user request after clicing on a UR-Comment and then the send button"

window.UrcommentsSpanishURC_Text[32] = "Recargar mapa automáticamente después de un comentario"; //"Auto reload map after comment"
window.UrcommentsSpanishURC_Text_tooltip[32] = "Permite recargar el mapa después de dar clic en UR-Comment y luego el botón enviar. Esto fuerza al URO+ a refrescar los filtros de URO definidos. No aplica para mensajes que han sido salvados desde que se recargó el mapa."; //"Reloads the map after clicing on a UR-Comment and then send button. This forces URO+ to re-apply the chosen URO filters. Currently this does not apply to any messages that get saved. Since saving automatically reloads the map."

window.UrcommentsSpanishURC_Text[33] = "Alejar (Zoom-Out) después de un comentario"; //"Auto zoom out after comment"
window.UrcommentsSpanishURC_Text_tooltip[33] = "Después de dar clic en un UR-Comment de la lista y dar clic en enviar (Send), el zoom regresará al nivel donde estaba previamente"; //"After clicing on a UR-Comment in the list and clicing send on the UR the map zoom will be set back to your previous zoom"

window.UrcommentsSpanishURC_Text[34] = "Activar automáticamente el tab de UR-Comments"; //"Auto switch to the UrComments tab"
window.UrcommentsSpanishURC_Text_tooltip[34] = "Cambiar automáticamente al tab de UrComments después de cargar la página cuando se abre un UR, cuando la ventana de la UR se cierra y se cambia al tab previo"; //"Auto switch to the URComments tab after page load and when opening a UR, when the UR window is closed you will be switched to your previous tab"

window.UrcommentsSpanishURC_Text[35] = "Cerrar mensaje - doble clic (Auto-envío)"; //"Close message - double clic link (auto send)"
window.UrcommentsSpanishURC_Text_tooltip[35] = "Crea un enlace adicional para cerrar el comentario cuando se dé doble clic en auto-enviar el comentario de en la ventana de UR"; //"Add an extra link to the close comment when double clicked will auto send the comment to the UR windows and clic send, and then will launch all of the other options that are enabled"

window.UrcommentsSpanishURC_Text[36] = "Todos los comentarios - doble clic (Auto-envío)"; //"All comments - double clic link (auto send)"
window.UrcommentsSpanishURC_Text_tooltip[36] = "Crea un enlace adicional para cada comentario de la lista cuando se dé doble clic en auto-enviar el comentario de en la ventana de UR"; //"Add an extra link to each comment in the list that when double cliced will auto send the comment to the UR windows and clic send, and then will launch all of the other options that are enabled"

window.UrcommentsSpanishURC_Text[37] = "Lista de comentarios"; //"Comment List"
window.UrcommentsSpanishURC_Text_tooltip[37] = "Muestra la lista de comentarios seleccionada"; //"This is shows the selected comment list

window.UrcommentsSpanishURC_Text[38] = "Deshabilitar botones de Terminado/Done y Siguiente/Next"; //"Disable done / next buttons"
window.UrcommentsSpanishURC_Text_tooltip[38] = "Deshabilita los botones Terminado/Done y Siguiente/Next localizados en la parte inferior de la ventana de URs nuevos"; //"Disable the done / next buttons at the bottom of the new UR window"

window.UrcommentsSpanishURC_Text[39] = "Dejar de seguir UR después de enviar comentario"; //"Unfollow UR after send"
window.UrcommentsSpanishURC_Text_tooltip[39] = "Dejar de seguir un UR después de enviar comentario"; //"Unfollow UR after sending comment"

window.UrcommentsSpanishURC_Text[40] = "Auto-envío de Recordatorios"; //"Auto send reminders"
window.UrcommentsSpanishURC_Text_tooltip[40] = "Envía automáticamente los recordatorios a sus propios URs, que estén visibles en la pantalla"; //"Auto send reminders to my UR as they are on screen"

window.UrcommentsSpanishURC_Text[41] = "Cambiar el tag [Name] (Nombre) por el nombre del Editor"; //"Replace tag name with editor names"
window.UrcommentsSpanishURC_Text_tooltip[41] = "Cuando un UR tiene el nombre del Editor (por lo general cuando es enviada por el mismo editor) los datos son cambiados por el nombre del editor"; //"When a UR has the logged in editors name in it replace the tag type with the editors name"

window.UrcommentsSpanishURC_Text[42] = "(Doble Clic)"; //double clic to close links
window.UrcommentsSpanishURC_Text_tooltip[42] = "Doble Clic para Auto-envío de mensajes"; //"Double clic here to auto send - "

window.UrcommentsSpanishURC_Text[43] = "No mostrar nombre de la etiqueta en la píldora"; //"Dont show tag name on pill"
window.UrcommentsSpanishURC_Text_tooltip[43] = "No mostrar nombre de la etiqueta en la píldora , donde hay una etiqueta de URO"; //Dont show tag name on pill where there is a URO tag";

window.UrcommentsSpanishURC_USER_PROMPT[0] = "URComments - Usted tiene una versión obsoleta del archivo de comentarios en español o un error de sintaxis que impide que la lista en Español cargue."; //"UR Comments - You either have a older version of the Spanish comments file or a syntax error either will keep the Spanish list from loading. Missing: ";

window.UrcommentsSpanishURC_USER_PROMPT[1] = "URComments - Te estás perdiendo los siguientes artículos de la lista de comentarios en Español:"; //"UR Comments - You are missing the following items from your Spanish comment list: ";

window.UrcommentsSpanishURC_USER_PROMPT[2] = "URComments - La lista no pudo ser encontrada, usted puede encontrar la lista y las instrucciones en https://wiki.waze.com/wiki/User:Rickzabel/UrComments/"; //"List can not be found you can find the list and instructions at https://wiki.waze.com/wiki/User:Rickzabel/UrComments/";

window.UrcommentsSpanishURC_USER_PROMPT[3] = "URComments - Usted no puede establecer los días de espera para cierre a cero (0)"; //"URComments you can not set close days to zero"

window.UrcommentsSpanishURC_USER_PROMPT[4] = "URComments - Para usar los enlaces con Doble Clic debe tener habilitada la opción de auto ajuste (Autoset) de URs"; //"URComments to use the double clic links you must have the autoset UR status option enabled"

window.UrcommentsSpanishURC_USER_PROMPT[5] = "Abortando FilterURs2 porque ambos filtros, conteos y auto-avisos están deshabilitados"; //"aborting FilterURs2 because both filtering, counts, and auto reminders are disabled"

window.UrcommentsSpanishURC_USER_PROMPT[6] = "URComments - El tiempo de espera para la carga de los UR ha terminado, intente nuevamente."; //"URComments: Loading UR data has timed out, retrying." - this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsSpanishURC_USER_PROMPT[7] = "URComments - Agregando avisos a URs: "; // "URComments: Adding reminder message to UR: " - this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsSpanishURC_USER_PROMPT[8] = "URComments - El filtrado de URs ha sido desactivado pues el filtro del script URO está activo"; //"URComment's UR Filtering has been disabled because URO\'s UR filters are active." - this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsSpanishURC_USER_PROMPT[9] = "UrComments -  ¡Detectó que tiene cambios no guardados!, con la opción de Auto Guardar activada y con cambios no guardados no es posible enviar comentarios que requieran que el script guarde. Por favor guarde los cambios y de clic nuevamente en el comentario que desea enviar"; //"UrComments has detected that you have unsaved changes!\n\nWith the Auto Save option enabled and with unsaved changes you cannot send comments that would require the script to save. Please save your changes and then re-clic the comment you wish to send."

window.UrcommentsSpanishURC_USER_PROMPT[10] = "URComments - ¡No ha podido encontrar la ventana de comentarios!. Para el funcionamiento correcto del sript es necesario tener la ventana de la UR abierta"; //"URComments: Can not find the comment box! In order for this script to work you need to have a user request open." - this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsSpanishURC_USER_PROMPT[11] = "URComments - Se enviarán recordatorios de acuerdo a los días configurados para ello. Esto solo ocurre cuando estos son visibles en el área que muestra la pantalla. NOTA: Cuando se utilice esta opción no se deben dejar UR abiertos a menos que tenga preguntas que requieran una respuesta del Wazer, ya que este script enviará dichos avisos"; //"URComments This will send reminders at the reminder days setting. This only happens when they are in your visible area. NOTE: when using this feature you should not leave any UR open unless you had a question that needed an answer from the Wazer as this script will send those reminders. " - conformation message/ question



//The comment array should follow the following format,
// "Title",     * is what will show up in the URComment tab
// "comment",   * is the comment that will be sent to the user currently 
// "URStatus"   * this is action to take when the option "Auto Click Open, Solved, Not Identified" is on. after clicking send it will click one of those choices. usage is. "Open", or "Solved",or "NotIdentified",
// to have a blank line in between comments on the list add the following without the comment marks // there is an example below after "Thanks for the reply"
// "<br>",
// "",
// "",

//Cotero2002 09/06/2016 list
window.UrcommentsSpanishArray2 = [	
"Sin Comunicación Adicional", //"No further communication",
//No further information was received and the request is being closed. As you travel, please feel welcome to report any map issues you encounter. Thanks!
"Estimado usuario - La descripción del problema no fue clara y los editores voluntarios no recibimos una respuesta, por lo que estamos cerrando este reporte. Mientras viaja, por favor siéntase bienvenido a informar de cualquier problema que encuentre en el mapa. ¡Gracias!", //Cotero2002
"NotIdentified",

"Arreglado", //"Fixed",
//"Thanks to your report we have found and fixed a problem with the map. The fix should reach mobile devices within a few days. On rare occasions it can take closer to a week.", //GizmoGuy 4/13/15
"Gracias a su reporte hemos encontrado y corregido un problema en el mapa. La corrección debe llegar a los dispositivos móviles dentro de unos pocos días. En raras ocasiones puede tomar cerca de una semana. ¡Gracias!", //Cotero2002 11/11/15
"Solved", 

"Ajustes en la dirección", //"Address Adjustments",
//"Thanks! The address has been adjusted. This should reach mobile devices within a few days. On rare occasions it can take closer to a week.", //GizmoGuy, t0cableguy, rickzabel 1/14/2015
"Gracias! La dirección ha sido ajustada. La corrección debe llegar a los dispositivos móviles dentro de unos pocos días. En raras ocasiones puede tomar cerca de una semana.", //Cotero2002 11/20/15
"Solved",

"Dirección en el sitio correcto", //"Address in correct spot",
//"The live map is currently showing your address in the correct spot. Please remove any instance of this address from your history and favorites by tapping the 'i' within the blue circle and then 'remove from history'. Then search for the address. If you don't remove the old results from your navigation or favorites, you will continue to be routed to the old coordinates. Please submit another report if this does not resolve your issue. Thanks!",
"El mapa en vivo está mostrando su dirección en el sitio correcto. Por favor remueva cualquier instancia de esta dirección de su historial y favoritos tocando en la 'i' en el círculo azul y luego 'remover de la historia'. Entonces, busque la dirección. Si no se remueven los viejos resultados de su navegación o favoritos, usted continuará siendo conducido a las viejas coordenadas. Por favor, someta otro reporte si esto no resuelve su problema. Gracias!", //Cotero2002 09/03/16
"Solved", //karlcr9911 rickzabel 4/3/2015

"La carretera ha sido cerrada", //"The road has been closed",
//"Volunteer responding - Thank you for your report. The road has been closed.",  //GizmoGuy, t0cableguy, rickzabel 1/14/2015
"Estimado usuario - Gracias por tu reporte. La carretera o calle ha sido cerrada.", //Cotero2002 11/20/15
"Solved", //requested by SkiDooGuy //changed to NotIdentified by karlcr9911 4/3/2015 //7/22/2015 changed to Solved by karlcr9911

"Buscando dirección", //"Address fishing",
//"Waze does not tell us your starting or ending destinations. Would you tell us your destination as you entered it into Waze? Thanks!", //rickzabel i use this one after i sent a message with Volunteer responding 1
"Estimado usuario - Waze no nos indica su punto de partida o destino final. ¿Podría decirnos el nombre del destino y la dirección con la que está teniendo problemas? ¡Gracias!", //Cotero2002 11/20/15
"Open",

"Errores sin Descripción", //"Errors with no text",
//"Volunteer responding - Waze did not send us enough information to fix your request. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!", //rickzabel 12/8/14
"Estimado usuario - Waze no nos envió información suficiente para arreglar su petición. ¿Podría por favor dejarnos saber qué salió mal con la ruta que Waze le dió? ¡Gracias!", //Cotero2002 11/20/15
"Open",

"Mensaje de Recordatorio", //"Reminder message", //do not change (rickzabel)
//"Just a reminder: We have not received a response on your report. If we don't hear back from you soon, we will infer everything is okay and close the report. Thanks!",//GizmoGuy, t0cableguy, rickzabel 1/14/2015
"Sólo un recordatorio: No hemos recibido una respuesta en su reporte. Si no recibimos respuesta de usted pronto, vamos a inferir que todo está bien y cerraremos el reporte. ¡Gracias!", //Cotero2002 11/20/15
"Open", 

"Desvío lateral por peaje o TAG", //"No reply close message",
//"The problem was unclear and volunteers didn't receive a response, so we are closing this report. As you travel, please feel welcome to report any map issues you encounter. Thanks!",//GizmoGuy, t0cableguy, rickzabel 1/14/2015
"Waze revisa si el tiempo que te ahorras pasando por el TAG es significativo en comparación con pasar por la caletera u otra vía lateral, si ese tiempo es muy bajo, a pesar de no tener seleccionado Evitar peajes te dirigirá por la vía alternativa ahorrando el peaje o TAG. Si no quieres pasar por la vía alternativa, simplemente sigue por la autopista y espera a que Waze enrute nuevamente, o puedes revisar las rutas alternativas. Gracias por reportar!!!", //Gasparfox 12/19/17
"Open", 

"Cierre de Reporte Duplicado",
"Estimado usuario - Este reporte se está cerrando porque es un duplicado. Por favor proveanos su retroalimentación mediante alguno otro de los reportes que aún continuan abiertos sobre el mismo problema. Gracias!", //cotero2002 09/03/16
"NotIdentified",

"Límite de Velocidad Añadido",
"Estimado usuario - Gracias por su reporte, el límite de velocidad ha sido añadido al mapa. Este reporte será cerrado ahora. Siéntase bienvenido a reportar cualquier otro letrero de velocidad o problema que encuentre en sus viajes pero siempre con precaución, no textee mientras conduce.", //cotero2002 09/03/16
"Solved",

"Límite de Velocidad Corregido",
"Estimado usuario - Gracias por su reporte, el límite de velocidad ha sido corregido en el mapa. Este reporte será cerrado ahora. Siéntase bienvenido a reportar cualquier otro letrero de velocidad o problema que encuentre en sus viajes pero siempre con precaución, no textee mientras conduce.", //cotero2002 09/06/16
"Solved",

"Límite de Velocidad Existente",
"Estimado usuario - Gracias por su reporte, el límite de velocidad ya fue añadido al mapa anteriormente. Sin embargo, los límites de velocidad solo se muestran en el App cuando se exede el limite de velocidad establecido o si el app esta configurado para mostrar el velocímetro todo el tiempo. Tenga presente que cuando se cambia de una carretera a otra, puede tomar unos segundos al app. Mostrar el límite de velocidad correcto, por tanto, espere unos segundos antes de someter un reporte.  Este reporte será cerrado ahora. Siéntase bienvenido a reportar cualquier otro letrero de velocidad o problema que encuentre en sus viajes pero siempre con precaución, no textee mientras conduce.", //cotero2002 09/03/16
"NotIdentified",

"Error de la aplicación", //"App Bug", 
//"Unfortunately, In this situation, there is nothing wrong with the map that we can adjust to prevent issues with the app. Please report this to  https://support.google.com/waze/answer/6276841",
"Estimado usuario - Desafortunadamente, en esta situación, no hay nada malo con el mapa que se pueda ajustar para evitar problemas con la aplicación. Por favor repórtelo a  https://support.google.com/waze/answer/6276841", //cotero2002 09/03/16
"NotIdentified", //twintiggrz, t0cableguy, rickzabel 3/15/2015


"Mala señal de GPS", //"Bad GPS",
//"Volunteer responding - It appears that your device was having GPS trouble. GPS signals do not travel through vehicles or tall buildings. Please make sure your device is somewhere with a clear view of the sky.",//rickzabel 12/18/2014
"Estimado usuario - Al parecer su dispositivo tuvo problemas de GPS. Las señales GPS no viajan a través de vehículos o edificios altos. Por favor, asegúrese de que su dispositivo está en algún lugar con una vista despejada del cielo.", //Carlos Laso, Spanish 11/20/2015
"NotIdentified",

"Ruta Válida", //"Valid Route",
//"Volunteer responding - We reviewed the issue and did not find any map errors. It looks like Waze provided you with a valid route. Try the Waze suggested route a few times, as it may turn out to actually be faster. If not you'll be teaching Waze that that route is slower, and the faster route will become preferred.",  //GizmoGuy, t0cableguy, rickzabel 1/14/2015
"Estimado usuario - Revisamos el problema y no encontramos ningún error de mapa. Parece que Waze le proporcionó una ruta válida. Trate la ruta que Waze le sugiere unas pocas veces ya que pudiera resultar que efectivamente sea más rápida. Si no lo es, usted le estará enseñando a Waze que esa ruta es más lenta y la ruta más rápida se convertirá en la preferida. ¡Gracias!", //Cotero2002 11/20/15 11/25/2015
"NotIdentified",

"CERRADOR DE UR", 
"Editor Voluntario Respondiendo - Hola editor, favor leer el punto 2 del siguiente link en foro de editores de Chile https://goo.gl/VvzY71 ", 
"NotIdentified",

"Giros válidos hacia la Izquierda 2", //"Valid Left turns 2",
//"Volunteer responding – We cannot disable legal turns only because they are difficult. If you wait and complete the left turn, it may actually be faster than the alternative. If it’s not faster, your wait time will contribute to Waze’s database, thus helping to discourage the routing server from suggesting left turns at that intersection. We also suggest if you do not feel comfortable making such left turns, you can always go another route and let Waze recalculate.", //karlcr9911 4/4/15 //rickzabel 4/5/15
"Estimado usuario - No podemos desactivar giros legales sólo porque son difíciles Si espera y completa el giro a la izquierda, en realidad puede ser más rápido que la alternativa Si no es más rápido, su tiempo de espera contribuirá a la base de datos de Waze, ayudando así a desalentar al servidor de enrutamiento de sugerir giros a la izquierda en esa intersección. También le sugerimos que si usted no se siente cómodo para realizar dichos giros a la izquierda, siempre se puede ir por otra ruta y dejar que Waze recalcule. ", // Cotero2002 11/20/15
"NotIdentified",

"Ruta Válida pero Difícil", //"Valid but Difficult Route",
//"Volunteer responding – We cannot disable legal routes only because they are difficult. If you wait and complete the route, it may actually be faster than the alternative. If it’s not faster, your wait time will contribute to Waze’s database, thus helping to discourage the routing server from suggesting the route. We also suggest if you do not feel comfortable, you can always go another route and let Waze recalculate.", //karlcr9911 4/4/15 //rickzabel 4/5/15
"Estimado usuario - No podemos desactivar rutas legales sólo porque son difíciles. Si espera y completa la ruta, en realidad puede ser más rápido que la alternativa Si no es más rápido, su tiempo de espera contribuirá a la base de datos de Waze, lo que ayuda a desalentar el servidor de enrutamiento de sugerir la ruta. También le sugerimos si usted no se siente cómodo, siempre se puede ir por otra ruta y dejar que Waze recalcule. ", // Cotero2002 11/20/15
"NotIdentified",

"Falta lugar", //"Missing place", 
//"Volunteer responding - Thank you for reporting a missing place.  Anytime you find a place that is missing from the waze app you can add it from the app by tapping the Pin icon > Place. After taking a picture of the place please add as many details as you can. Thanks!",
"Estimado usuario - Gracias por informar de un lugar faltante. En cualquier momento que encuentres algún lugar que falte en la aplicación waze, lo puedes añadir desde la aplicación tocando el icono Pin> Lugar. Después de tomar una fotografía del lugar por favor añada tantos detalles como puedas. ¡Gracias!", //Cotero2002 11/20/15
"NotIdentified",

"Desvíos / Enrutamiento extraño", //"Detours / Odd-Routing",
//"Volunteer responding - We can't find anything on the map to explain the route Waze gave you. Waze will route complex detours to save a few seconds. We are very sorry to say that map editors cannot be helpful in this situation. Thanks!", //rickzabel 4/18/20115
"Estimado usuario - No pudimos encontrar nada en el mapa que explique la ruta que Waze le dió. Waze intenta ahorrar tiempo de todas las formas posibles y algunas veces sugiere desviaciones complejas sólo para ahorrar unos segundos en tu viaje. Lo sentimos mucho, pero los editores no podemos ser de mucha ayuda aquí, pues el mapa se encuentra bien. ¡Gracias!", //Carlos Laso
"NotIdentified",

"Queja general de Waze", //"Overall Waze complaint",
//"Volunteer responding - You can help make Waze better by reporting problems as you find them. Please include as many details as possible? Thanks!",
"Estimado usuario - Usted puede ayudarnos a mejorar los mapas de Waze reportando de manera lo más detallada posible los problemas que encuentre en el mapa, ¡Gracias!", //Carlos Laso
"NotIdentified", //rickzabel Pesach 12/22/14

"Reporte al municipio local", //"Report to local municipality",
//"Volunteer responding - We are only able to help with map issues. This should be reported to the local municipality. Please feel welcome to report any map issues you encounter. Thanks!", //GizmoGuy, t0cableguy, rickzabel 1/14/2015
"Estimado usuario - Nosotros sólo somos capaces de ayudar con los problemas de mapa, deberá informar al departamento de tránsito local. Por favor, siéntase bienvenido a reportar cualquier problema que encuentre em el mapa. ¡Gracias!", //Carlos Laso
"NotIdentified", 

"Usuario sin TAG (evitar peajes)", //"No user transponder (avoid tolls)",
//"Volunteer responding - Waze is about getting you to your destination via the fastest route. However, it does not know if you have a toll transponder. To avoid tolls, there is an option under Settings > Navigation or after clicking GO tap Routes and select one without gold coins (iphone) or toll (android). Thanks!", //a version of this was suggested by subs5 4/12/2015 //rickzabel 4/17/2015
"Estimado usuario -  El objetivo de Waze es llevarlo a su destino por la ruta más rápida posible; sin embargo, no sabe si usted tiene un TAG para el pago de peaje. Por lo tanto, si usted prefiere no tener vías de peaje sugeridas, hay un ajuste en: Configuración> Navegación para evitar carreteras de peaje. ¡Gracias!", //Carlos Laso
"NotIdentified",

"RESTRICCIONES HORARIAS", //"No user transponder",
//"Volunteer responding - While Waze attempts to route you to your destination efficiently, it does not know if you have a toll transponder.  We are very sorry to say that the volunteer map editors cannot be much help here. As you travel, please feel welcome to report any map issues you encounter. Thanks!", //rickzabel karlcr9911 4/18/2015
"Estimado usuario - La restricción horaria ya estaba puesta. Favor revisar que la configuración horaria de su dispositivo sea Zona horaria UTM -3 (lo que corresponde al horario de Chile) ¡Gracias!", //Gasparfox 04/28/2017
"NotIdentified", 

"Problemas con HOV", //"Not Using HOV",
//"Waze does not have the ability to know you meet the HOV criteria. Driving into the HOV lane should force Waze to recalculate your route. Afterwards you should be allowed to stay in the HOV lane. Thanks!", //rickzabel 12/14/14
"Estimado usuario - Waze no tiene la habilidad de saber si usted cumple con los criterios para usar un carril HOV. Conducir dentro del carril HOV deberá forzar a Waze a recalcular la ruta. Posteriormente se le debe permitir permanecer en el carril HOV. ¡Gracias!", //Carlos Laso, Cotero2002 11/20/15
"NotIdentified",

"Vuelta en U", //"U-turns",
//"Volunteer responding - Currently Waze will not tell you to make a \"U-turn\". It will route you in several left/right turns to effectively create a U-turn. This is a programming issue that cannot be changed by the volunteer map editors. We understand that Waze is working on a fix. Thanks!", //GizmoGuy, t0cableguy, rickzabel 1/14/2015
"Estimado usuario - En la actualidad Waze no le dirá que haga una \"Vuelta en U\". Se le ofrecerán varios giros a la izquierda o a la derecha para crear efectivamente una vuelta en U. Este es un problema de programación que no puede ser cambiado por los editores voluntarios del mapa, pero sabemos que Waze está trabajando en una solución. ¡Gracias!", //Carlos Laso, Cotero2002 11/20/15
"NotIdentified", 

"Tráfico - Información obsoleta", //"Traffic - Stale Information",
//"Map editors are unable to remove traffic jams. You can help clear traffic reports by tapping \"not there\" when prompted or by traveling through the intersection at normal speed.", // rickzabel 7/22/2015 //t0cableguy 7/22/2015
"Estimado usuario - Los editores de mapa no pueden eliminar los reportes de condiciones de tráfico. Usted puede ayudar a eliminar los informes de tráfico obsoletos pulsando \"not there\" cuando se le solicite o viajando a través de la intersección a una velocidad normal.", //Cotero2002 11/20/15
"NotIdentified",

"Tráfico - Congestión / Embotellamientos",
//"To report a traffic jams please use the Waze app by clicking the pin in the lower right and then clicking Traffic Jam. Traffic Jam reports can help route you and other Wazers around traffic problems in real-time. Thanks!", // reworded - rickzabel 12/7/2014, karlcr9911 12/8/14
"Estimado usuario - Para reportar congestiones/embotellamientos de tráfico por favor utilice la aplicación Waze haciendo clic en el círculo de color naranja en la parte inferior derecha y haciendo clic en \"Tráfico\" (Traffic Jam).  Los reportes de Tráfico pueden ayudarle a usted y a otros Wazers a obtener rutas alrededor de los problemas de tráfico en tiempo real. ¡Gracias!", // Cotero2002 11/15/2015
"NotIdentified",

"Problema de evasión de señalización", //"Signal Avoidance Bug",
//"There are no issues with the intersection’s turn restrictions. Waze's developers are working on a fix for this issue. We do not have an ETA. Please feel free to use the turn until the issue is resolved. Thanks!",  //GizmoGuy, t0cableguy, rickzabel 1/14/2015
"Estimado usuario - No hay problemas con restricciones de giro de la intersección. Los desarrolladores de Waze están trabajando en una solución para este problema, pero no tenemos un tiempo estimado de solución. Por favor, siéntase libre usando el giro señalado hasta que se resuelva el problema. ¡Gracias!", //Carlos Laso
"NotIdentified",

"Restricciones ya incluidas", //"Already included restrictions",
//"This restriction is already included in the map, Waze should not route through this illegal turn. If Waze ever gives you a route through a restricted turn, please send another Map Issue report at that time. Thanks!",
"Estimado usuario - Esta restricción ya está incluida en el mapa, Waze no debe enrutar a través de este giro ilegal. Si Waze siempre te da una ruta a través de un giro restringido, por favor, envíe otro reporte de problema en el mapa en ese momento. ¡Gracias!", //Carlos Laso
"NotIdentified",  //rickzabel Pesach 12/27/14

"Límite de 1000 millas", //"1000 mile limit",
//"The search and navigation capabilities of Waze are limited to 1000 miles. When driving further than that distance you will need to select a target under that distance as your temporary destination.",//rz 2/26/15
"Estimado usuario - Las capacidades de búsqueda y navegación de Waze se limitan a 1000 millas. Cuando se conduce más allá de esa distancia tendrá que seleccionar un destino a menos de 1000 millas como su destino temporal.", // Cotero2002 11/20/15
"NotIdentified", 

"Bloqueo temporal de carretera", //"Temporary road blockage",
//"Volunteer responding - if the road is completely blocked use the Report > Closure feature for you and others to be rerouted around it, otherwise please use Report > Traffic. At a minimum Waze is learning that that route is slower, and a faster route will become preferred.", //rickzabel Pesach 12/22/14
"Estimado usuario - Si la carretera o calle está completamente bloqueada, use la función de Reportar (Report) > Cierre (Closure) para que a usted y a otros Wazers se le ofrezca una ruta alterna, de lo contrario por favor use Reportar > Trafico. Poco a poco Waze aprenderá que esa ruta es más lenta y la ruta más rápida se convertirá en la preferida.", //Carlos Laso
"NotIdentified",

"Cierre temporal de carretera", //"Temporary Road Closure",
//"Volunteer responding - For closures that last only a few days, the volunteer map editors cannot be much help. It takes at least that long for our edits to make it to the live map! When you encounter road closures in the future, please use the Report > Closure feature built into the Waze app. Thanks!",
"Estimado usuario - Para cierres que duran sólo unos pocos días, los editores de mapa voluntarios no somos de mucha ayuda. Se necesita al menos ese tiempo para que nuestras ediciones se reflejen en el mapa. Cuando se encuentre con cierres de carreteras o calles en el futuro, por favor, utilice Reporte (Report) > función de cierre (Closure) integrado en la aplicación Waze. ¡Gracias! ", //Cotero2002 11/20/15
"NotIdentified",

"Cierre temporal de carretera", //"Temporary Road Closure",
//"Do you know how long the road is going to be closed? For closures that last only a few days, the volunteer map editors cannot be much help. It takes at least that long for our edits to make it to the live map! When you encounter short-term road closures in the future, please use the Report > Closure feature built into the Waze app. If this is a long-term closure please respond and let us know as much as you can. Thanks!", // reworded - rickzabel 12/7/2014, karlcr9911 12/8/14
"Estimado usuario - Sabes cuánto tiempo estará cerrada la calle o carretera? Cuando encuentres cierres de corto plazo en el futuro, por favor utiliza la función de Reportar —> Cierres (Closure) dentro de la misma.  Si es un cierre de largo plazo, por favor infórmanos lo más que puedas para cerrarlo de manera precisa. Gracias por tu reporte!", //Carlos Laso
"Open",	

"Limpieza de Cierres", //"Closure clean-up",
//"Due to daily changing closures we are closing out the old requests to concentrate on the newest ones. For closures that last only a few days, the volunteer map editors cannot be much help. It takes at least that long for our edits to make it to the live map! When you encounter short-term road closures in the future, please use the Report > Closure feature built into the Waze app. Thanks!",//rickzabel 12/28/14
"Estimado usuario - Debido a que los cierres cambian diariamente, estamos cerrando los reportes antiguos para concentrarnos en los más recientes. Para cierres que duran sólo unos días, los editores voluntarios del mapa no pueden ayudar mucho. Se necesita al menos algo de tiempo para que nuestras ediciones se reflejen en el mapa! Cuando se encuentre con los cierres de carreteras a corto plazo en el futuro, por favor, utilice el Reportar > Cierre en la aplicación Waze. ¡Gracias!", //Carlos Laso
"NotIdentified",

"Gracias por su respuesta", //"Thanks for the reply",
//"Thank you for the reply! This request will be closed. As you travel, please feel welcome to report any map issues you encounter.",
"Estimado usuario - Gracias por su respuesta! Este reporte será cerrado. Mientras use Waze, por favor siéntase bienvenido a reportar cualquier problema que encuentre en el mapa.", //Carlo laso
"NotIdentified", //rickzabel 12/27/14			

"RUTA YA EXISTE", //"No further communication",
//"No further information was received and the request is being closed. As you travel, please feel welcome to report any map issues you encounter. Thanks!", //t0cableguy 12/8/14 //rickzabel 12/8/14 , karlcr9911 12/8/14
"Editor Voluntario Respondiendo - Hola! La ruta que indicas ya existe en el mapa de Waze. Recuerda que depende de tu velocidad, el zoom del mapa cambia no mostrando algunas calles menores a alta velocidad. También depende de la calidad de tu conexión a internet móvil para poder bajar las nuevas rutas del mapa. Por favor, actualiza manualmente el mapa en tu teléfono para contar con las actualizaciones. Configuración - Pantalla y mapa - Transferencia de datos - Refrescar mapa de mi Área. Gracias.", //Carlos Laso
"NotIdentified", // same comment different action based off UR status rickzabel 12/7/14, karlcr9911 12/7/14 // one sentence? rickzabel 12/7/14 t0cableguy 12/8/14

"Cuerpo de agua no-editable", //"water non-editable",
//"This particular water feature is not editable by the volunteer editors, feel free to report this to support at https://support.google.com/waze/",
"Esta característica del agua en particular no es editable por los editores voluntarios. Se está trabajando para mejorar este problema, por ahora solo hay que esperar", //Cotero2002 11/20/15
"NotIdentified",

"Limpiar Cache de TTS (Text To Speech)", //"Clear TTS Cache",
//"Please clear your Text-to-Speech cache. In the navigate search box type cc@tts in the search field and press search. You will get a message that the TTS file has been cleared. Your TTS cache we be re-populated as you use routing.. Thanks!", //GizmoGuy411  t0cableguy rickzabel 2015-04-04
"Estimado usuario - Por favor, borre la memoria caché del texto-a-voz (TTS). En la pantalla de navegación, escriba cc@tts en el campo de búsqueda y pulse Buscar. Usted recibirá un mensaje que el caché TTS ha sido borrado. Su caché TTS será repoblada a medida que utiliza enrutamiento ... ¡Gracias!", //Cotero2002 11/20/15
"NotIdentified", //t0cableguy This should be a last chance option for fixing the issue.04-04-2015  //rickzabel 04-04-2015 

"Cámara Reportada", //"Camera report",
//"Volunteer responding, cameras must be reported from the app at / near the actual location using the Report > Camera option. Thank you!", //karlcr9911 rickzabel 4/17/2015
"Estimado usuario - Las cámaras deben ser reportadas desde la aplicación en o cerca de la ubicación actual utilizando el Reporte> opción Cámara. ¡Gracias!", //Cotero2002 11/20/2015
"NotIdentified",

"<br>",
"",
"",

"Problema aparentemente arreglado", //"Problem appears corrected",
//"Just a reminder: The problem appears to be corrected. Please let us know if you are continuing to have the issue. If we do not hear from you in a few days we will close this report. Thanks!",
"Estimado usuario - Sólo un recordatorio: El problema aparenta estar corregido. Por favor, háganos saber si continúa con el problema. Si no tenemos noticias de usted en pocos días vamos a cerrar este reporte. ¡Gracias!", //Cotero2002 11/20/15
"Open", //karlcr9911 12/7/14 t0cableguy 12/8/14 //rickzabel 12/8/14

"Eliminar comentario y cambiar status a abierto", //"Clears comment & sets UR status to Open",
"",
"Open",

"Incluir descripción del Usuario", //"Include Users Description",
//"Volunteer responding - You reported \"$URD\" and Waze did not send us enough information to fix your request. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!",
"Estimado usuario - Has reportado \"$URD\" y Waze no nos ha enviado la información suficiente para arreglar su petición. ¿Podría por favor hacernos saber lo que salió mal con la ruta Waze te dio? ¿Podría contarnos su destino como la introdujo en Waze? ¡Gracias!", //Carlos Laso
"Open",

//selected segments requires the use of https://greasyfork.org/en/scripts/9232-wme-panel-swap
"Incluir nombres segs. seleccionados", //"Include selected segments names",
//"Volunteer responding - You reported a problem near $SELSEGS, Waze did not send us enough information to fix your request. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!",
"Estimado usuario - Usted reportó un problema cerca de $ SELSEGS, Waze no nos envió información suficiente para arreglar su petición ¿Podría por favor dejarnos saber lo que salió mal en la ruta Waze te dio ¿Podría contarnos su destino tal y como lo introdujo en Waze? ¡Gracias!", //Cotero2002 11/20/15 11/20/2015
"Open",

"Nombre de calle incorrecto", //"Wrong Street Name",
//"Volunteer responding - Waze did not send us enough information to fix your request. Would you please let us know which street name you think is wrong and what it should be? Thanks",
"Estimado usuario - Waze no nos envió información suficiente para arreglar su petición. ¿Podría por favor dejarnos saber cuál nombre de la calle usted piensa que está mal y lo que debería ser?, ¡Gracias!", //Cotero2002 11/20/15
"Open", //rickzabel Pesach 12/22/14


"<br>",
"",
"",

//Default URs  6 through 22 are all the different types of UR that a user can submit do not change them thanks
"Giro Incorrecto", //"Incorrect turn", //6
//"Volunteer responding - Would you please let us know what turn you are having a problem with? Would you tell us your destination as you entered it into Waze? Thanks!", //rickzabel 12/9/14
"Estimado usuario - ¿Podría dejarnos saber con qué giro está teniendo problemas? ¡Gracias!", //cotero2002
"Open",

"Dirección Incorrecta", //"Incorrect address", //7
//"Volunteer responding - Waze did not send us enough information to fix your request. Would you tell us your destination as you entered it into Waze? What is the problem you are having with this address? Thanks!", //rickzabel 12/8/14
"Estimado usuario - Waze no nos envió la información suficiente para arreglar su reporte. ¿Cuál es la dirección que buscaba y dónde debiera estar? ¡Gracias!", //Gasparfox 25/07/2018
"Open",

"Ruta Incorrecta", //"Incorrect route", //8
//"Volunteer responding - Waze did not send us enough information to fix your request. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!", //rickzabel 12/9/14
"Estimado usuario - Waze no nos envió la información suficiente para arreglar su reporte. ¿Podría por favor hacernos saber lo que salió mal con la ruta Waze te dio? ¿Podría decirnos su destino tal como lo introdujo en Waze? ¡Gracias!", //Carlos Laso
"Open",

"Falta Rotonda", //"Missing roundabout", //9
//"Volunteer responding - Would you tell us as much as possible about the roundabout you believe is missing? Thanks!",
"Estimado usuario - ¿Pudiera decirnos tanto como sea posible acerca de la rotonda que usted considera que falta? ¡Gracias!", //Cotero2002 09/03/2016
"Open",

"Error General", //"General error", //10
//"Volunteer responding - Waze did not send us enough information to fix your request. Would you please let us know what went wrong? Would you tell us your destination as you entered it into Waze? Thanks!", //rickzabel 12/9/14
"Estimado usuario - Waze no nos envió la información suficiente para arreglar su reporte. ¿Podría por favor decirnos lo que salió mal? ¡Gracias!", //Carlos Laso
"Open",

"Giro no Permitido", //"Turn not allowed", //11
//"Volunteer responding - Would you please let us know which turn was or should not be allowed and why? Please specify the street names at the intersection. Thanks!",//rickzabel 2/26/15
"Estimado usuario - ¿Pudiera por favor dejarnos saber que giro debe o no debe ser permitido y por qué? Por favor, especifique los nombres de las calles en la intersección. ¡Gracias!", // Cotero2002 11/20/15
"Open",

"Cruce Incorrecto",//"Incorrect junction", //12
//"Volunteer responding - Waze did not send us enough information to fix your request. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!", //rickzabel 12/9/14
"Estimado usuario - Waze no nos envió la información suficiente para arreglar su reporte relacionado a alguna intersección incorrecta. ¿Podría por favor hacernos saber lo que salió mal con la ruta Waze te dio? ¡Gracias!", //Carlos Laso
"Open",

"PEAJES, PUENTES, SEMÁFORO, PARE O CEDA EL PASO", //"Missing bridge overpass", //13
//"Volunteer responding - Would you please let us know what overpass you believe is missing? When moving at highway speeds, Waze deliberately chooses not to display some nearby features to avoid cluttering the screen. Would you tell us as much as possible about the missing overpass. Thanks!", //rickzabel 12/9/14
"Hola! Por ahora, los peajes, puentes, túneles, cruces de tren, nombres de villas, pasos sobre y bajo nivel, semáforos, discos Pare o Ceda el Paso, curvas cerradas, paraderos de bus, Lomos de Toro, no se destacan de forma especial en Waze. Gracias", //Carlos Laso
"NotIdentified",

"Sentido de Conducción Incorrecto", //"Wrong driving direction", //14
//"Volunteer responding - Waze did not send us enough information to fix your request. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!", //rickzabel 12/9/14
"Estimado usuario - Waze no nos envió la información suficiente para arreglar su reporte relacionado al Sentido de Conducción Incorrecto. ¿Podría por favor hacernos saber lo que salió mal con la ruta Waze te dio? ¿Podría decirnos su destino tal como lo introdujo en Waze? ¡Gracias!", //Carlos Laso
"Open",


"Falta Salida", //"Missing Exit", //15
//"Volunteer responding - Waze did not send us enough information to fix your request. Would you please let us know as much as possible about the missing exit? Thanks!", //rickzabel 12/9/14
"Estimado usuario - Waze no nos envió información suficiente para arreglar su reporte relacionado a una salida/rampa que falta. ¿Podría por favor dejarnos saber lo más posible acerca de la salida/rampa que falta? ¡Gracias!", //Cotero2002 11/20/15
"Open",

"Falta Carretera", //"Missing Road", //16
//"Volunteer responding - Would you tell us as much as possible about the road you believe is missing? Thanks!", //rickzabel 12/9/14
"Estimado usuario - ¿Podría decirnos lo más detallado posible sobre la carretera o calle que considera que falta? ¡Gracias!", //Cotero2002 09/03/16
"Open",


"Falta Punto de Interés", //"Missing Landmark", //18
//"Volunteer responding - Would you tell us as much as possible about the landmark you believe is missing? Thanks!",
"Estimado usuario - ¿Podría decirnos tanto como sea posible acerca del punto de interés que usted considera que falta? ¡Gracias!", //Cotero2002 09/03/16
"Open",

/*
"Carretera Bloqueada". //"Blocked Road", //19
"Volunteer responding -",
"Open",

"Falta nombre de Carretera", //"Missing Street Name", //21
"Volunteer responding -",
"Open",

"Prefijo o Sufijo de Carretera Incorrecto". //"Incorrect Street Prefix or Suffix", //22
"Volunteer responding -",
"Open",


*/

"Límite de Velocidad falta o es inválido", //23
"Estimado usuario - Waze no nos envió la información suficiente para completar y/o arreglar su solicitud. ¿Podría por favor decirnos tanto como sea posible acerca del límite de velocidad que falta o está incorrecto en el mapa? En el futuro, por favor, envíenos los reportes cerca del punto en el que cambia el límite de velocidad. Si el cambio de límite de velocidad es temporal debido a construcción u otra razón, por favor, avísenos y proporcione detalles adicionales. Si desea ver los límites de velocidad en todo momento durante el uso de la aplicación, por favor vaya a Configuración > Velocímetro > Mostrar límite de velocidad. ¡Gracias!", //cotero2002 09/03/16
"Open",

"<br>",
"",
"",
//End of Default URs  

"Usuario siguió la ruta de Waze", //"User Followed Waze's route",
//"Volunteer responding - It appears that you followed the route Waze suggested. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!", //reworded rickzabel 12/7/2014
"Estimado usuario - Parece que usted ha seguido la ruta que Waze le sugirió. ¿Podría por favor dejarnos saber lo que salió mal con la ruta Waze le dió? ¿Podría contarnos su destino tal y como lo introdujo en Waze? ¡Gracias!", //Cotero2002 11/20/2015
"Open",

"Interferencia de Calles Aledañas", //"Alley Interference",
//"Volunteer responding - Waze does not let the us know where you were going, although it was probably adjacent to the alley. Would you tell us your destination as you entered it into Waze? Thanks!", //rickzabel 12/9/14
"Estimado usuario - Waze no permite el que nosotros sepamos hacia dónde se dirigía, aunque probablemente fue al lado de un callejón o calle privada. ¿Podría contarnos su destino tal y como lo introdujo en Waze? ¡Gracias!", // Cotero2002 11/20/15
"Open",

"Carretera Cerrada", //"Road Closed",
//"Volunteer responding - Would you please let us know the following; What road is closed?; between which intersections is this road closed; Do you know how long this road is scheduled to be closed? Thanks!", //rickzabel 12/9/14
"Estimado usuario - ¿Podría por favor dejarnos saber lo siguiente: ¿Qué carretera o calle está cerrada? ¿Entre qué intersecciones está la carretera o calle cerrada? ¿Sabes cuánto tiempo está previsto el cierre de esta carretera o calle? ¡Gracias!", //Carlos Laso, Cotero2002 11/20/2015
"Open",

"Entrada a Áreas", //"Area Entrances",
//"We have had problems with Google pins being placed in the center of large landmarks. Delete your previous search and do a new search for the location. Go to the bottom of the auto fill list to see more results and make sure you pick the Waze search engine.",
"Estimado usuario - Hemos tenido problemas con destinos ofrecidos por Google que se colocan en el centro de grandes áreas o puntos de referencia. Borre su búsqueda anterior y haga una nueva búsqueda de la ubicación. En la parte inferior de la lista de resultados automáticos, asegúrese de elegir el motor de búsqueda de Waze.", //Carlos Laso
"Open",

"Respuesta de 48hr de espera", //"48 Hour Reply",
//"We made some changes to the map, please allow up to 48 hours for the changes to be reflected on the live map.", //rickzabel 12/7/14 //t0cableguy 12/8/14, karlcr9911 12/8/14
"Estimado usuario - Hemos hecho algunos cambios en el mapa. Por favor, espere 48 horas para que los cambios se reflejen en el mapa.", //Carlos Laso, Cotero2002 11/20/15
"Open",

"Eliminar Localizaciones Guardadas en Memoria", //"Clear Saved Locations",
//"To get an updated result, remove the location from your navigation history and then search for the location again.", //t0cableguy 12/8/14, karlcr9911 12/8/14
"Estimado usuario - Para obtener un resultado actualizado, remueva las localizaciones de su historial de navegación y luego busque la localización nuevamente.", //Cotero2002 11/20/15
"Open",

"Dirección - Posición Incorrecta", //"Address - Incorrect Position",
//"Can you tell us the address or if you can revisit visit the location, please show us the correct position by using the Report > Places feature. Before you save move as close as possible to the entrance. Please do not submit pictures containing faces, license plates, or personal details. Thanks!",  //rickzabel t0cableguy 04-04-2015
"Estimado usuario - Si puede volver a visitar el lugar, por favor, muéstranos la posición correcta usando la función de Reporte> Lugar . Antes de guardar, muévase lo más cerca posible a la entrada. Por favor, no envíe imágenes que contengan caras, matrículas o detalles personales. ¡Gracias!", // rickzabel t0cableguy 04/04/2015
"NotIdentified",

"Dirección - Inexistente en el Mapa", //"Address - Missing from Map",
//"Volunteer responding - Would you let us know the address that is missing? The available resources do not have the address available for your location. You can use the Report > Places feature in Waze to mark the location. Before you save move close as possible to the entrance. Do not submit pictures containing faces, license plates, or personal details. Thanks!", //rickzabel 4/5/2015 //t0cableguy 4/5/2015
"Estimado usuario - ¿Podrías dejarnos saber la dirección que falta? Los recursos disponibles no tienen la dirección disponible para su ubicación. Puedes usar la función Reporte > Lugar en Waze para marcar la ubicación. Antes de guardar, muévase lo más cerca posible a la entrada. No envíe imágenes que contengan caras, placas de matrícula, o detalles personales. ¡Gracias!", //Cotero2002 11/20/15
"Open",

"Dirección - Malos Resultados", //"Address - Bad Results",
//"Search results in Waze are retrieved from numerous sources. After tapping search, Scroll to the bottom and you will see options for other search engines. Please try a different option as another search engine might have the address you are looking for", //rickzabel 12/9/14
"Estimado usuario - La búsqueda de resultados en Waze se obtienen de numerosas fuentes. En el campo de búsqueda, en la parte inferior verá las opciones para otros motores de búsqueda. Por favor, intente una opción diferente con otro motor de búsqueda y pudiera obtener la dirección que está buscando.", //Cotero2002 11/20/15
"Open",

"Ajuste de Número de Casa", //"House Number Adjustment",
//"I've forced Waze to re-register the house number for your destination. I believe this should correct your issue. Please allow up to 48 hours for changes to be reflected in the live map. If you have the location in your saved searches or favorites, please remove them and re-add the destination. Please let me know if you continue to experience this problem by submitting another error report. Thanks!", //rickzabel 12/7/14 //karlcr9911 12/8/14
"Estimado usuario - He forzado a Waze para que actualice el registro del número de casa que proporciona y con esto debe quedar corregido el problema.  Por favor espere 48 horas a que sea actualizado el mapa. Si el lugar está guardado en sus favoritos o búsquedas, bórrelas y busque de nuevo para que reflejen el cambio en el mapa.  Háganos saber si continúa experimentando el problema.  Gracias por reportar!", //Carlos Laso
"Open",

"Puentes o Carreteras Inexistentes",//"Missing Bridges or Roads",
//"The roads for this area are thoroughly mapped and the volunteer editors cannot find anything missing from the map. When you are moving, Waze deliberately chooses not to display some nearby features to avoid cluttering the screen. If you are certain a feature is missing from the map, please reply and tell us as much as possible about it. Thanks!", //rickzabel karlcr9911 4/18/2015
"Estimado usuario - Las carreteras o calles de esta área fueron creadas exhaustivamente y los editores voluntarios no pueden encontrar nada faltante en el mapa. Cuando maneja, Waze deliberadamente decide no mostrar algunas características cercanas para evitar saturar la pantalla. Si está seguro que cierta característica no aparece en el mapa, por favor, responda y díganos con el mayor detalle como sea posible sobre el tema. Gracias!", //Carlos Laso, Cotero2002 11/20/15
"Open",

"Actualización Manual", //"Manual Refresh",
//"Please try doing these options. Tap the Wazer icon > Settings > Advanced > Data transfer > Refresh Map Of My Area. Secondly, you can try clearing Waze's app cache in your phone’s app manager. The final option is to reset the app by going to the navigation screen and type ##@resetapp in search field and hit search.", //GizmoGuy rickzabel 2/26/15
"Estimado usuario - Por favor, intente estas opciones: Presione icono Waze> Configuración> Opciones avanzadas> Transferencia de datos> Actualizar Mapa De Mi área. Otra opción que usted puede intentar es borrar la memoria caché de aplicaciones de Waze en el gestor de aplicaciones de su teléfono. La última opción es restablecer la aplicación, vaya a la pantalla de navegación y escriba ##@resetapp en el campo de búsqueda y presione búsqueda.", //Carlos Laso
"Open",

"Pavimentar Carretera", //"Pave Road",
//"Volunteer responding - You can pave the road from the app by tapping the Pin icon > Map Issue > Pave Road tab. After leaving the paved road, tap Start paving. Once done, tap the Steamroller > Stop paving. You can provide information about the new road such as its name by tapping on the Pin icon > Map Issue > Missing Road. Thanks!", //karlcr9911 4/5/15 //rickzabel 4/5/15 removed single quotes
"Estimado usuario - Tú puedes crear la carretera o calle desde la aplicación pulsando el icono Pin> Error Mapa > Pavimentar > pulse pavimentar. Una vez hecho esto, pulse > Detener pavimentación. Usted puede proporcionar información acerca de la nueva carretera o calle, tales como su nombre pulsando en el icono del Pin> Error Mapa > Falta calle. ¡Gracias! ", // Cotero2002 11/20/15
"Open",

//"Blank Screen.",
//"Please follow these instructions in the app. Tap the Wazer icon > Settings > Advanced > Data transfer > Refresh map of my area. Second you can try clearing Waze's app cache in your phone’s app manager. The final option is  to Uninstall and Reinstall the app.",
//"Open", //requested by t0cableguy 12/7/14 in map refresh now t0cableguy 12/8/14

"Petición de Desbloqueo", //"Unlock request",
//"I have started the process to get this issue fixed. Thanks for your report!",  //GizmoGuy, t0cableguy, rickzabel 1/14/2015
"Hemos comenzado el proceso para tener este reporte arreglado. Gracias por tu reporte!", //cotero2002 09/03/2016
"Open"
];
//end Spanish list
// editado por cotero2002. 09/06/2016