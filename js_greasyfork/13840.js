// ==UserScript==
// @name WME URComments Colombian Spanish List
// @description This script is for Colombian Spanish comments to be used with URComments 
// @namespace  RickZabel@gmail.com
// @grant none
// @grant GM_info
// @version 0.5.6
// @match          https://editor-beta.waze.com/*editor*
// @match          https://beta.waze.com/*editor*
// @match          https://www.waze.com/*editor*
// @author Mauricio Otálvaro '2015 mincho77
// @license MIT/BSD/X11
// @icon data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAwCAYAAACFUvPfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQyQjZDNjdEODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQyQjZDNjdFODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDJCNkM2N0I4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDJCNkM2N0M4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6++Bk8AAANOElEQVR42tRZCWxU1xW9M39mPB5v431fMLYJdmpjthQUVsdlS9IQQkpIIDRhl5pKQUpbKkAEpakQIhVVRUytQIGwihCaBkgItQELQosxdrDZ7Njjbbx7vM0+f3ruZDz1NmTGhEj59tOb//979553313fl9jtdvqpXbLHRVgikTz0NbdJkyYJERERUp1OJ1Wr1WJLS4tYXFxswzu7s408+XFJ2g1oSUZGhtzf318piqLKx8dHZbPZFFKpVMC9TRAEs8lk0uNe39vbaywvL7eMBP5HAz179myZxWLxxfNg3IZHRkbG5OTkpEPSkQAs1Wq1nQUFBVXt7e2twNSGMdx3yuVyQ2FhofVHBw01kCsUigA8i1m9evXc3Nzc5TExMwindow.UrcommentsColombianSpanishURC_Text10]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
// @downloadURL https://update.greasyfork.org/scripts/13840/WME%20URComments%20Colombian%20Spanish%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/13840/WME%20URComments%20Colombian%20Spanish%20List.meta.js
// ==/UserScript==
/* Changelog
* 5th update to the format
* 0.0.1 - initial version
*/
//I will try not to update this file but please keep a external backup of your comments as the main script changes this file might have to be updated. When the custom comments file is auto updated you will loose your custom comments. By making this a separate script I can try to limit how often this would happen but be warned it will eventually happen.
//if you are using quotes in your titles or comments they must be properly escaped. example "Comment \"Comment\" Comment",
//if you wish to have blank lines in your messages use \n\n. example "Line1\n\nLine2",
//if you wish to have text on the next line with no spaces in your message use \n. example "Line1\nLine2",
//Custom Configuration: this allows your "reminder", and close as "not identified" messages to be named what ever you would like.
//the position in the list that the reminder message is at. (starting at 0 counting titles, comments, and ur status). in my list this is "4 day Follow-Up"
window.UrcommentsColombianSpanishReminderPosistion = 3;

//this is the note that is added to the the reminder link option
window.UrcommentsColombianSpanishReplyInstructions = 'Para responder, por favor utilice Waze APP '; //'To reply, please either use the Waze app followed by mincho77 ' - followed by the URL - superdave, rickzabel, t0cableguy 3/6/2015

//the position of the close as Not Identified message (starting at 0 counting titles, comments, and ur status). in my list this is "7th day With No Response"
window.UrcommentsColombianSpanishCloseNotIdentifiedPosistion = 6;

/*Tags [ROADWORKS], [CONSTRUCTION], [CLOSURE], [EVENT]*/

//This is the list of Waze's default UR types. edit this list to match the titles used in your area! 
//You must have these titles in your list for the auto text insertion to work!
window.UrcommentsColombianSpanishdef_names = [];
window.UrcommentsColombianSpanishdef_names[6] = "Giro no permitido"; //"Giro no permitido";
window.UrcommentsColombianSpanishdef_names[7] = "Dirección incorrecta"; //"Dirección incorrecta";
window.UrcommentsColombianSpanishdef_names[8] = "Ruta incorrecta"; //"Ruta incorrecta";
window.UrcommentsColombianSpanishdef_names[9] = "Rotonda Faltante"; //"Falta rotonda";
window.UrcommentsColombianSpanishdef_names[10] = "Error general"; //"Error general";
window.UrcommentsColombianSpanishdef_names[11] = "Giro no permitido"; //"Giro no permitido";
window.UrcommentsColombianSpanishdef_names[12] = "Falta paso superior"; //"Falta paso superior";
window.UrcommentsColombianSpanishdef_names[13] = "Falta paso superior"; //"Falta paso superior";
window.UrcommentsColombianSpanishdef_names[14] = "Sentido de conducción incorrecto"; //"Sentido de conducción incorrecto";
window.UrcommentsColombianSpanishdef_names[15] = "Salida Faltante"; //"Falta salida";
window.UrcommentsColombianSpanishdef_names[16] = "Vía faltante"; //"Falta carretera";
window.UrcommentsColombianSpanishdef_names[18] = "Punto de Interés Faltante"; //"Punto de Interés Faltante";
window.UrcommentsColombianSpanishdef_names[19] = "Vía bloqueada"; //"Camino bloqueado";
window.UrcommentsColombianSpanishdef_names[21] = "Nombre de calle faltante"; //"Nombre de calle faltante";
window.UrcommentsColombianSpanishdef_names[22] = "Prefijo o Sufijo incorrecto en calle"; //"Prefijo o Sufijo incorrecto en calle";
window.UrcommentsColombianSpanishdef_names[23] = "Límite de Velocidad"; //Límite de velocidad


//below is all of the text that is displayed to the user while using the script this section is new and going to be used in the next version of the script.
window.UrcommentsColombianSpanishURC_Text = [];
window.UrcommentsColombianSpanishURC_Text_tooltip = [];
window.UrcommentsColombianSpanishURC_USER_PROMPT = [];
//Added 27-15-2015
window.UrcommentsColombianSpanishURC_URL = [];

//zoom out links
window.UrcommentsColombianSpanishURC_Text[0] = "Zoom 0 y Salir de UR"; //"Zoom Out 0 & Close UR"
window.UrcommentsColombianSpanishURC_Text_tooltip[0] = "Realiza un Zoom Out completo y cierra la ventana de UR"; //"Zooms all the way out and closes the UR window"

window.UrcommentsColombianSpanishURC_Text[1] = "Zoom 2 y Salir de UR";  //"Zoom Out 2 & Close UR"  
window.UrcommentsColombianSpanishURC_Text_tooltip[1] = "Realiza un Zoom Out 2 y cierra la ventana de UR"; //"Zooms out to level 2 this closes the UR window"

window.UrcommentsColombianSpanishURC_Text[2] = "Zoom 3 y Salir de UR"; //"Zoom Out 3 & Close UR"
window.UrcommentsColombianSpanishURC_Text_tooltip[2] = "Realiza un Zoom Out 3 y cierra la ventana de UR"; //"Zooms out to level 3 this closes the UR window"

window.UrcommentsColombianSpanishURC_Text_tooltip[3] = "Recarga el Mapa"; //"Reload the map"

window.UrcommentsColombianSpanishURC_Text_tooltip[4] = "Número de URs mostradas en el mapa"; //"Number of UR Shown"

//tab names 
window.UrcommentsColombianSpanishURC_Text[5] = "Comentarios"; //"Comments"
window.UrcommentsColombianSpanishURC_Text[6] = "Filtro de URs"; //"UR Filtering"
window.UrcommentsColombianSpanishURC_Text[7] = "Ajustes"; //"Settings"

//UR Filtering Tab
window.UrcommentsColombianSpanishURC_Text[8] = "Instrucciones"; //"Instructions"
//Added 27-12-2015
window.UrcommentsColombianSpanishURC_Text_tooltip[8] = "Instructions for UR filtering";
window.UrcommentsColombianSpanishURC_URL[8] = "http://docs.google.com/presentation/d/1zwdKAejRbnkUll5YBfFNrlI2I3Owmb5XDIbRAf47TVU/present#slide=id.p";

window.UrcommentsColombianSpanishURC_Text[9] = "Habilitar herramienta URComments"; //"Enable URComments UR filtering"
window.UrcommentsColombianSpanishURC_Text_tooltip[9] = "Habilita / deshabilita el filtro de URComments"; //"Enable or disable URComments filtering"

window.UrcommentsColombianSpanishURC_Text[10] = "Habilitar los globos de URs"; //"Enable UR pill counts"
window.UrcommentsColombianSpanishURC_Text_tooltip[10] = "Habilita / deshabilita los globos de URs"; //"Enable or disable the pill with UR counts"

window.UrcommentsColombianSpanishURC_Text[12] = "Ocultar URs pendientes"; //"Hide Waiting"
window.UrcommentsColombianSpanishURC_Text_tooltip[12] = "Solo se presentaran las URs que requieren atención(comentarios iniciales, vencimiento de fechas)"; //"Only show UR that need work (hide inbetween states)"

window.UrcommentsColombianSpanishURC_Text[13] = "Mostrar solo mis URs"; //"Only show my UR"
window.UrcommentsColombianSpanishURC_Text_tooltip[13] = "Oculta todas las URs que no pertenecen al editor 'loggeado'"; //"Hide UR where there are zero comments from the logged in editor"

window.UrcommentsColombianSpanishURC_Text[14] = "Mostrar URs vencidas"; //"Show others UR past reminder + close"
window.UrcommentsColombianSpanishURC_Text_tooltip[14] = "Muestra las URs cuyas fechas han superado el umbral definido como límite de caducidad"; //"Show UR that have gone past the reminder and close day settings added together"

window.UrcommentsColombianSpanishURC_Text[15] = "Ocultar URs con pendientes de respuesta"; //"Hide UR Reminders needed"
window.UrcommentsColombianSpanishURC_Text_tooltip[15] = "Oculta las URs que requieren respuesta de los usuario"; //"Hide UR where reminders are needed"

window.UrcommentsColombianSpanishURC_Text[16] = "Ocultar URs que contienen respuestas"; //"Hide user replies"
window.UrcommentsColombianSpanishURC_Text_tooltip[16] = "Oculta todas las UR que contienen respuestas de usuarios"; //"Hide UR with user replies"

window.UrcommentsColombianSpanishURC_Text[17] = "Ocultar las URs que requieren cierre"; //"Hide UR close needed"
window.UrcommentsColombianSpanishURC_Text_tooltip[17] = "Oculta URs vencidas que requieren ser cerradas"; //"Hide UR that need closing"

window.UrcommentsColombianSpanishURC_Text[18] = "Ocultar URs sin comentarios"; //"Hide UR no comments"
window.UrcommentsColombianSpanishURC_Text_tooltip[18] = "Oculta las URs que no poseen ningún comentario"; //"Hide UR that have zero comments"

window.UrcommentsColombianSpanishURC_Text[19] = "Ocultar URs sin descripciones"; //"hide 0 comments without descriptions"
window.UrcommentsColombianSpanishURC_Text_tooltip[19] = "Oculta las URs que no tienen descripciones por parte de usuarios "; //"Hide UR that do not have descriptions or comments"

window.UrcommentsColombianSpanishURC_Text[20] = "Ocultar URs con descripciones y sin comentarios"; //"hide 0 comments with descriptions"
window.UrcommentsColombianSpanishURC_Text_tooltip[20] = "Oculta las URs que no tienen comentarios pero que si poseen descripciones"; //"Hide UR that have descriptions and zero comments"

window.UrcommentsColombianSpanishURC_Text[21] = "Ocultar URs cerradas"; //"Hide Closed UR"
window.UrcommentsColombianSpanishURC_Text_tooltip[21] = "Oculta las URs que se encuentran cerradas"; //"Hide closed UR"

window.UrcommentsColombianSpanishURC_Text[22] = "Ocultar URs que contienen tags técnicas"; //"Hide Tagged UR"
window.UrcommentsColombianSpanishURC_Text_tooltip[22] = "Oculta las URs que tengan tags de estilo de URO, por ejemplo [NOTE]"; //"Hide UR that are tagged with URO stle tags ex. [NOTE]"

window.UrcommentsColombianSpanishURC_Text[23] = "Días Aviso Caducidad: "; //"Reminder days: "

window.UrcommentsColombianSpanishURC_Text[24] = "Días restantes para cierre: "; //"Close days: "

//settings tab 
window.UrcommentsColombianSpanishURC_Text[25] = "Comentar automáticamente una UR nueva"; //"Auto set new UR comment"
window.UrcommentsColombianSpanishURC_Text_tooltip[25] = "Envía un comentario (UR comment) automáticamente a las UR que no han sido comentadas"; //"Auto set the UR comment on new URs that do not already have comments"

window.UrcommentsColombianSpanishURC_Text[26] = "Enviar automáticamente un recordatorio a una UR vencida"; //"Auto set reminder UR comment"
window.UrcommentsColombianSpanishURC_Text_tooltip[26] = "Envía automáticamente un recordatorio para las URs que cumplen con el tiempo del recordatorio y tienen un solo comentario"; //"Auto set the UR reminder comment for URs that are older than reminder days setting and have only one comment"

window.UrcommentsColombianSpanishURC_Text[27] = "Realizar AutoZoom en URs nuevas"; //"Auto zoom in on new UR"
window.UrcommentsColombianSpanishURC_Text_tooltip[27] = "Realiza un Zoom automático cuando las URs no tienen comentarios y se están enviando avisos"; //"Auto zoom in when opening URs with no comments and when sending UR reminders"

window.UrcommentsColombianSpanishURC_Text[28] = "Centrar automáticamente en la UR seleccionada"; //"Auto center on UR"
window.UrcommentsColombianSpanishURC_Text_tooltip[28] = "Si el Zoom es menor de 3 centra el mapa con el zoom actual cuando una UR tiene comentarios"; //"Auto Center the map at the current map zoom when UR has comments and the zoom is less than 3"

window.UrcommentsColombianSpanishURC_Text[29] = "Clic Automático en Abierto, Resuelto o No Identificado"; //"Auto clic open, solved, not identified"
window.UrcommentsColombianSpanishURC_Text_tooltip[29] = "Selecciona automáticamente tipo de respuesta dependiendo del mensaje"; //"Suppress the message about recent pending questions to the reporter and then depending on the choice set for that comment clics Open, Solved, Not Identified"

window.UrcommentsColombianSpanishURC_Text[30] = "Guardar Auto cuando Resuelto o No identificado"; //"Auto save after a solved or not identified comment"
window.UrcommentsColombianSpanishURC_Text_tooltip[30] = "Si se ingresa un comentario y se selecciona Resuelto o No Identificado, se guarda automáticamente el UR"; //"If Auto clic Open, Solved, Not Identified is also checked, this option will clic the save button after clicing on a UR-Comment and then the send button"

window.UrcommentsColombianSpanishURC_Text[31] = "Cierre automáticamente la ventana de comentarios"; //" Auto close comment window"
window.UrcommentsColombianSpanishURC_Text_tooltip[31] = "En las UR que no requieren ser salvadas esta opción las cerrará al dar clic en UR-Comment y la cerrará"; //"For the user requests that do not require saving this will close the user request after clicing on a UR-Comment and then the send button"

window.UrcommentsColombianSpanishURC_Text[32] = "Recargar mapa automáticamente después de un comentario"; //"Auto reload map after comment"
window.UrcommentsColombianSpanishURC_Text_tooltip[32] = "Permite recargar el mapa después de dar clic en UR-Comment y luego el botón enviar. Esto fuerza al URO+ a refrescar los filtros de URO definidos. No aplica para mensajes que han sido salvados desde que se recargó el mapa."; //"Reloads the map after clicing on a UR-Comment and then send button. This forces URO+ to re-apply the chosen URO filters. Currently this does not apply to any messages that get saved. Since saving automatically reloads the map."

window.UrcommentsColombianSpanishURC_Text[33] = "Alejar (ZoomOut) después de un comentario"; //"Auto zoom out after comment"
window.UrcommentsColombianSpanishURC_Text_tooltip[33] = "Después de dar clic en un UR-Comment de la lista y dar clic en enviar, automáticamente se aleja del punto donde estaba"; //"After clicing on a UR-Comment in the list and clicing send on the UR the map zoom will be set back to your previous zoom"

window.UrcommentsColombianSpanishURC_Text[34] = "Activar automáticamente el tab de UR-Comments"; //"Auto switch to the UrComments tab"
window.UrcommentsColombianSpanishURC_Text_tooltip[34] = "Cambiar automáticamente al tab de UrComments después de cargar la página cuando se abre una UR, cuando la ventana de la UR se cierra y se cambia al tab previo"; //"Auto switch to the URComments tab after page load and when opening a UR, when the UR window is closed you will be switched to your previous tab"

window.UrcommentsColombianSpanishURC_Text[35] = "Cerrar mensaje - doble clic (Auto enviar)"; //"Close message - double clic link (auto send)"
window.UrcommentsColombianSpanishURC_Text_tooltip[35] = "Crea un enlace adicional para cerrar el comentario cuando se de doble clic en autoenviar el comentario de en la ventana de UR"; //"Add an extra link to the close comment when double cliced will auto send the comment to the UR windows and clic send, and then will launch all of the other options that are enabled"

window.UrcommentsColombianSpanishURC_Text[36] = "Todos comentários - doble clic (Auto enviar)"; //"All comments - double clic link (auto send)"
window.UrcommentsColombianSpanishURC_Text_tooltip[36] = "Crea un enlace adicional para cada comentario de la lista cuando se de doble clic en autoenviar el comentario de en la ventana de UR"; //"Add an extra link to each comment in the list that when double cliced will auto send the comment to the UR windows and clic send, and then will launch all of the other options that are enabled"

window.UrcommentsColombianSpanishURC_Text[37] = "Lista de comentarios"; //"Comment List"
window.UrcommentsColombianSpanishURC_Text_tooltip[37] = "Presenta la lista de comentarios"; //"This is shows the selected comment list

window.UrcommentsColombianSpanishURC_Text[38] = "Deshabilitar el botón \"Concluído\" (\"Done\")"; //"Disable done button"
window.UrcommentsColombianSpanishURC_Text_tooltip[38] = "Deshabilita el botón \"Concluído\" (\"Done\") localizado en la parte inferior de la ventana de URs"; //"Disable the done button at the bottom of the new UR window"

window.UrcommentsColombianSpanishURC_Text[39] = "Dejar de seguir una UR después de enviada"; //"Unfollow UR after send"
window.UrcommentsColombianSpanishURC_Text_tooltip[39] = "Dejar de seguir una UR después de seleccionar enviar comentario"; //"Unfollow UR after sending comment"

window.UrcommentsColombianSpanishURC_Text[40] = "Auto envío de avisos"; //"Auto send reminders"
window.UrcommentsColombianSpanishURC_Text_tooltip[40] = "Envía automáticamente avisos para URs propias, que esten en la pantalla"; //"Auto send reminders to my UR as they are on screen"

window.UrcommentsColombianSpanishURC_Text[41] = "Cambiar el tag \[Name\] (Nombre) con el nombre del Editor"; //"Replace tag name with editor names"
window.UrcommentsColombianSpanishURC_Text_tooltip[41] = "Cuando una UR tiene el nombre del Editor (por lo general cuando es enviada por el mismo editor) los datos son cambiados por el nombre del editor"; //"When a UR has the logged in editors name in it replace the tag type with the editors name"

window.UrcommentsColombianSpanishURC_Text[42] = "(Doble clic) para cerrar enlaces"; //double clic to close links
window.UrcommentsColombianSpanishURC_Text_tooltip[42] = "Doble clic para enviar Automáticamente los mensajes"; //"Double clic here to auto send - "

//Added 27-15-2015
window.UrcommentsColombianSpanishURC_Text[43] = "No mostrar nombre de usuario en globos";
window.UrcommentsColombianSpanishURC_Text_tooltip[43] = "No mostrar el nombre de usuario en los globos de URs comentadas";

window.UrcommentsColombianSpanishURC_USER_PROMPT[0] = "URComments - Usted tiene una versión antigua con los comentarios personalizados para Colombia o un error de sintaxis en los propios. Faltante: "; //"UR Comments - You either have a older version of the custom comments file or a syntax error either will keep the custom list from loading. Missing: "

window.UrcommentsColombianSpanishURC_USER_PROMPT[1] = "URComments - Los siguientes datos hacen falta en los mensajes personalizados: "; //"UR Comments - you are missing the following items from your custom comment list: "

window.UrcommentsColombianSpanishURC_USER_PROMPT[2] = "La lista de mensajes no se ha podido encontrar. Puede obtener la lista e instrucciones de cómo descargarla en https://wiki.waze.com/wiki/User:Rickzabel/UrComments/"; //" List can not be found you can find the list and instructions at https://wiki.waze.com/wiki/User:Rickzabel/UrComments/ PENDIENTE"

window.UrcommentsColombianSpanishURC_USER_PROMPT[3] = "URComments - Los días de vencimiento no se pueden ser \"0\""; //"URComments you can not set close days to zero"

window.UrcommentsColombianSpanishURC_USER_PROMPT[4] = "URComments - Para usar los enlaces con Doble clic debe tener habilitada la opción de auto ajuste (Autoset) de URs"; //"URComments to use the double clic links you must have the autoset UR status option enabled"

window.UrcommentsColombianSpanishURC_USER_PROMPT[5] = "Saliendo de FilterURs2 pues los dos filtros (cuenta y auto avisos) estan deshabilitados"; //"aborting FilterURs2 because both filtering, counts, and auto reminders are disabled"

window.UrcommentsColombianSpanishURC_USER_PROMPT[6] = "URComments: El tiempo de espera para la carga de los UR ha terminado, intente nuevamente."; //"URComments: Loading UR data has timed out, retrying." - this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsColombianSpanishURC_USER_PROMPT[7] = "URComments: Agregando avisos a URs: "; // "URComments: Adding reminder message to UR: " - this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsColombianSpanishURC_USER_PROMPT[8] = "URComments: El filtrado de URs ha sido desactivado pues el filtro del script URO+ está activo"; //"URComment's UR Filtering has been disabled because URO\'s UR filters are active." - this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsColombianSpanishURC_USER_PROMPT[9] = "UrComments: ¡Detectó que tiene cambios no guardados!, con la opción de Auto Guardar activada y con cambios no guardados no es posible enviar comentarios que requieran que el script guarde. Por favor guarde los cambios y de clic nuevamente en el comentario que desea enviar"; //"UrComments has detected that you have unsaved changes!\n\nWith the Auto Save option enabled and with unsaved changes you cannot send comments that would require the script to save. Please save your changes and then re-clic the comment you wish to send."

window.UrcommentsColombianSpanishURC_USER_PROMPT[10] = "URComments: ¡No ha podido encontrar la ventana de comentarios! Para el funcionamiento correcto del script es necesario tener la ventana de la UR abierta"; //"URComments: Can not find the comment box! In order for this script to work you need to have a user request open." - this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsColombianSpanishURC_USER_PROMPT[11] = "URComments: Se enviarán avisos de acuerdo a los días configurados. Esto solo ocurre cuando son visibles en tu área. NOTA: Cuando se utilice ésta opción no se deben dejar UR abiertas a menos que tenga preguntas que requieran una respuesta del Wazer, esto pues los avisos continuarán enviandose"; //"URComments This will send reminders at the reminder days setting. This only happens when they are in your visible area. NOTE: when using this feature you should not leave any UR open unless you had a question that needed an answer from the Wazer as this script will send those reminders. " - conformation message/ question




//The comment array should follow the following format,
// "Title", * is what will show up in the URComment tab
// "comment", * is the comment that will be sent to the user currently 
// "URStatus" * this is action to take when the option "Auto clic Open, Solved, Not Identified" is on. after clicing send it will clic one of those choices. usage is. "Open", or "Solved",or "NotIdentified",
// to have a blank line in between comments on the list add the following without the comment marks // there is an example below after "Thanks for the reply"
// "<br>",
// "",
// "",

//ColombianSpanish list
window.UrcommentsColombianSpanishArray2 = [  




    "<br>",
    "",
    "",
    "Generales",
    "",
    "",   

    " 1. Agradecimiento por reportar",
    "¡Muchas gracias Wazer! continúa reportando con el mayor detalle posible para así corregir más facilmente.\n\n ",
    "Solved",

    " 2. Conversación con usuario",
    "¡Hola Wazer! gracias por contestar, \n\n Quedamos atentos a tu respuesta.",
    "Open",

    " 3. Complementar info de Usuario",
    "¡Hola Wazer! gracias por escribir, \n\n Quedamos atentos a tus comentarios.",
    "Open",

    " 4. Incluir descripción del Usuario",
    "¡Hola Wazer! Buen día, \n tu reporte contiene el siguiente texto: \"$URD\" sin embargo, no es suficiente para identificar el problema. Requerimos mayor información con el objetivo de resolverlo. \n\n Quedamos atentos a tu respuesta.",
    "Open",

    " 5. Complementar Pregunta Editor",
    "¡Hola Wazer! para complementar la información de mi compañero, podrías por favor  \n\nQuedamos atentos a tus comentarios.",
    "Open",

    " 6. Resuelto esperar actualización",
    "¡Hola Wazer! Buen día,\n el problema fue solucionado y se verá reflejado en la aplicación en la próxima actualización del mapa, esta tomará entre 3 y 8 días, verifica la fecha de última actualización en: http://status.waze.com/ \n\n ",
    "Solved",

    " 7. Resuelto en línea",
    "¡Hola Wazer! Buen día,\n el reporte que hiciste ha sido resuelto, puedes ver el cambio reflejado en el mapa en este momento. \n\n ",
    "Solved",

    " 8. Restricciones ya incluidas",
    "¡Hola Wazer! Buen día,\n la restricción que reportaste ya está incluida en el mapa. Espera la actualización del mapa internacional (INTL), esta tomará entre 3 y 8 días. ¡Gracias por reportar!\n ",
    "Solved",


    " 9. Reporte al municipio local",
    "¡Hola Wazer! Buen día,\n los reportes que acá haces son para corregir problemas en el mapa de Waze, deberás informar a la secretaría de movilidad de tu ciudad el inconveniente que te ocurrió. ¡Gracias por reportar!\n\n ",
    "Solved",

    "10. Agradecer reporte sentido vial",
    "¡Hola Wazer! Buen día,\n  reportaste un error en el sentido de la vía, con tu ayuda pudimos corregirlo. ¡Muchas gracias por tu información!. Espera la actualización del mapa Internacional (INTL), tomará entre 3 y 8 días, verifica la fecha de última actualización en: http://status.waze.com/ ",
    "Solved",

    "11. Eliminar reportes vencidos",
    "¡Hola Wazer! Buen día,\n  nos informaste que uno de los reportes que encontraste en Waze ya no existe, informaremos al municipio local quien nos entregó esta información y lo eliminaremos del mapa, con tu ayuda pudimos corregirlo. ¡Muchas gracias por tu información!. En unos cuantos minutos dejará de verse en Waze: http://status.waze.com/ ",
    "Solved",

    "12. Reportes CCP mal ubicados",
    "¡Hola Wazer! Buen día,\n  nos informaste que uno de los reportes que encontraste en Waze se encuentra mal ubicado, informaremos al municipio local quien suministró la novedad y lo corregiremos en el mapa. ¡Muchas gracias por tu información!. En unos cuantos minutos dejará de verse en Waze: http://status.waze.com/ ",
    "Solved",
    
     "13. Reportes CCP NO claros",
    "¡Hola Wazer! Buen día,\n  nos informaste que uno de los reportes que encontraste en Waze se encuentra mal ubicado o no está creado, pero requerimos más detalle para poderlo crear o corregir. ¡Muchas gracias por tu información!. En unos cuantos minutos dejará de verse en Waze: http://status.waze.com/ ",
    "Solved",
    
    "<br>",
    "",
    "",
    "Seguimiento",
    "",
    "",   

    " 1. Solicitud de información General",
    "¡Hola Wazer! Buen día,\n con la información que entregaste no podemos identificar el error reportado. Necesitamos un poco más de detalle para corregirlo. \n\n Quedamos atentos a tu respuesta.",
    "Open",

    " 2. Cierre UR Info insuficiente",
    "¡Hola Wazer! Buen día,\n Lamentablemente no pudimos solucionar el error en esta ocasión. Por favor, déjanos más datos la próxima vez. Gracias por reportar. \n\n ",
    "NotIdentified",

    " 3. Aviso cierre UR(>=10 días Sin Respuesta)",
    "¡Hola Wazer! Buen día,\n el reporte fue cerrado por tener más de 10 días sin respuesta de tu parte para corregirlo, esperamos contar con más detalle en tu próximo reporte. \n\n ",
    "NotIdentified",




    "<br>",
    "",
    "",
    "Direcciones, Nombres y Estado de Vías",
    "",
    "",

    " 1. Problemas con dirección - Ubicación",
    "¡Hola Wazer! Buen día,\n envíanos la dirección con la que tienes problemas con el mayor detalle posible.\n\n Quedamos atentos a tu respuesta.",
    "Open",

    " 2. Problemas con dirección - Busqueda",
    "¡Hola Wazer! Buen día,\n requerimos el punto de partida y destino en la ruta para identificar el problema y/o los nombres de puntos de interés o dirección que ingresaste para encontrarlos.\n\n Quedamos atentos a tu respuesta.",
    "Open",
    //Modidicado 12-01-2017
    " 3. Busquedas con LUPAP",
    "¡Hola Wazer! Buen día,\n estamos trabajando por solucionar este inconveniente, por el momento te podemos dar una solución alternativa, cuando no encuentres una dirección facilmente, te recomendamos utilizar el aplicativo LUPAP que encuentra la dirección que ingresas y luego te ayuda a llegar por medio de Waze, está disponible para Android e iOS y es completamente gratis.\n\n Quedamos atentos a tu respuesta.",
    "Open",

    " 4. Nombre de vía incorrecto",
    "¡Hola Wazer! Buen día,\n escríbenos el nombre de la calle que encontraste errado y cuál debería ser el correcto. ¡Gracias por reportar!\n\n Quedamos atentos a tu respuesta.",
    "Open",

    

    " 5. Falta Rotonda", //9
    "¡Hola Wazer! Buen día,\n necesitamos más detalle sobre la rotonda o complejo vial que nos mencionas hace falta. Lamentablemente la información que nos diste no es suficiente.\n\n Quedamos atentos a tu respuesta.",
    "Open",

    " 6. Falta Calle", //9
    "¡Hola Wazer! Buen día,\n necesitamos más detalle sobre la vía que nos mencionas hace falta, con el fin de construirla. Lamentablemente la información que nos diste no es suficiente.\n\n Quedamos atentos a tu respuesta.",
    "Open",

    " 7. Falta vía pavimentar", //9
    "¡Hola Wazer! Buen día,\n en Waze tu mismo puedes crear las vías que hagan falta, pavimentandolas. Selecciona reportar errores y busca la imágen de la aplanadora.\n\n ",
    "Open",

    " 8. Falta paso superior", //12
    "¡Hola Wazer! Buen día,\n no tenemos información suficiente para agregar el paso elevado que reportas, necesitamos más datos para incluirlo.\n\n Quedamos atentos a tu respuesta.",
    "Open",

    " 9. Falta puente", //12
    "¡Hola Wazer! Buen día,\n no tenemos información suficiente para agregar el puente que informas, ¿Podrías darnos nombre y ubicación para incluirlo?.\n\n Quedamos atentos a tu respuesta.",
    "Open",

    "10. Falta salida", //15
    "¡Hola Wazer! Buen día,\n no tenemos información suficiente para agregar la salida que mencionas hace falta, necesitamos más detalle para incluirla.\n\n Quedamos atentos a tu respuesta.",
    "Open",

    "11. Intersec incorrecta",
    "¡Hola Wazer! Buen día,\n no tenemos información suficiente para agregar la intersección que no existe o se encuentra mal creada, necesitamos más detalle. \n\n Quedamos atentos a tu respuesta.",
    "Open",

    "12. Sentido vial incorrecto",
    "¡Hola Wazer! Buen día,\n podrías por favor darnos un poco más de detalle, sobre ¿Cuál fué el error de sentido vial que encontraste (trayectoria de conducción y/o intersecciones afectadas), con el objetivo de realizar las debidas correcciones en mapa?. \n\n Quedamos atentos a tu respuesta.",
    "Open",

    "13.  Instruc de Conducción incorrecta", //8
    "¡Hola Wazer! Buen día,\n necesitamos más detalle del problema que tuviste con el fin de corregirlo; ten en cuenta que Waze te informa siempre con distancias dónde debes hacer el giro (100mts, 800mts, 500mts) y el sentido (Girar a la Izquierda, Derecha, Mantenerse a la Izquierda, Salir), si en un lugar no te indica que debes girar se debe a que es el único sentido en el que se puede ir, recuerda tener en cuenta también la ruta que te indica el mapa para que te ayudes más facilmente.\n\n Quedamos atentos a tu respuesta.",
    "Open",

    "14. Sin Señal para pavimentar vía", 
    "¡Hola Wazer! Buen día,\n en Waze tu mismo puedes crear las vías que hagan falta, pavimentandolas..\n\n Quedamos atentos a tu respuesta.",
    "Open",

	"15. Giro no permitido",
    "¡Hola Wazer! Buen día,\n dinos ¿Qué giro no estaba permitido en tu ruta o debería estarlo con el fin de corregirlo?\n\n Quedamos atentos a tu respuesta.",
    "Open",


    "16. Ubicar Giro no permitido",
    "¡Hola Wazer! Buen día,\n con la información que nos diste, no es suficiente identificar el sitio en el que no se permite el giro ¿Podrías darnos más detalle con el fin de corregirlo?\n\n Quedamos atentos a tu respuesta.",
    "Open",

    "17. Giro en U permitido",
    "¡Hola Wazer! Buen día,\n en este sitio tenemos reportes de que el giro en U es permitido, ¿Encontraste alguna señal que lo prohiba con el fin de corregirlo?\n\n Quedamos atentos a tu respuesta.",
    "Open",

    "18. Giro en U NO permitido",
    "¡Hola Wazer! Buen día,\n en este sitio tenemos reportes de que el giro en U NO es permitido, ¿Encontraste alguna señal que lo permita con el fin de corregirlo?\n\n Quedamos atentos a tu respuesta.",
    "Open",

    "19. Indicar ubicación de Giro en U",
    "¡Hola Wazer! Buen día,\n con la información que nos diste, no es suficiente identificar el sitio en el que se permite el giro en U ¿Podrías darnos más detalle con el fin de corregirlo?\n\n Quedamos atentos a tu respuesta.",
    "Open",
	
	"20. Corrección Nomenclatura",
    "¡Hola Wazer! Buen día,\n\n el error que reportaste de nomenclatura fué solucionado, debes tener presente eliminar cualquier instancia existente del destino en la lista de recientes o tus favoritos y posteriormente buscar nuevamente el lugar desde cero. Espera la actualización del mapa Internacional (INTL), tomará entre 3 y 8 días, verifica la fecha de última actualización en: http://status.waze.com/ \n\n ",
    "Solved",
	
	
    "<br>",
    "",
    "",
    "Cámaras y Semáforos",
    "",
    "",   
    " 1. Cámara faltante",
    "¡Hola Wazer! Buen día,\n\n reportaste que hace falta una cámara de fotodetección, tu puedes agregarlas desde el aplicativo y luego serán aprobadas, utiliza la función de Reportar > Cámara en el Globo naranja y luego selecciona el tipo.\n ",
    "Solved",

    " 2. Cámara no alertada",
    "¡Hola Wazer! Buen día,\n\n reportaste un error con una cámara de fotodetección, sin embargo la cámara está configurada correctamente en Waze en ese sitio. Las cámaras, presentarán una alerta visual que te indica su ubicación pero solo serás informado por Waze con la voz que tengas configurada si superas la velocidad de la vía.\n ",
    "Solved",

    " 3. Cámaras móviles o de seguridad",
    "¡Hola Wazer! Buen día,\n las cámaras de fotodetección móviles no pueden ser identificadas dentro del aplicativo por su naturaleza, así mismo las camaras de vigilancia no son elementos para dentro de Waze . ¡Gracias por reportar!\n\n ",
    "Solved",  


    " 4. Reporte de semáforo",
    "¡Hola Wazer! Buen día,\n los semáforos no son elementos que se tengan definidos en Waze, existen unos similares a un semáforo y son cámaras de fotomultas de semáforos. ¡Gracias por reportar!\n\n ",
    "Solved",  


    "<br>",
    "",
    "",
    "Cierres o Restricciones",
    "",
    "",   
    " 1. Bloqueo temporal de una vía",
    "¡Hola Wazer! Buen día,\n si no ves en Waze el cierre de la vía, puedes crearlo tu mismo. Utiliza la función de Reportar > Cierre (en el Globo naranja) y luego la Valla Naranja con Blanco, escoge la razón y un tiempo estimado.\n\n ",
    "Solved",

    " 2. Reporte de cierre por largo plazo",
    "¡Hola Wazer! Buen día,\n ¿Tienes el tiempo estimado del cierre?, ¿Podrías darnos mayor detalle?.\n\n Quedamos atentos a tu respuesta.",
    "Open",

    " 3. Informar Cierre Inexistente",
    "¡Hola Wazer! Buen día,\n según tu comentario y tu reporte realizaremos la eliminación del cierre. Gracias por tu valiosa información. \n\n ",
    "Solved",

    " 4. Ruteos por cierres",
    "¡Hola Wazer! Buen día,\n al parecer Waze te llevó por una ruta donde existía un cierre, ¿Podrías informarnos si era temporal o a largo plazo? \n\n Quedamos atentos a tu respuesta.",
    "Open",

    " 5. Cierres Ciclovías",
    "¡Hola Wazer! Buen día, si no ves en Waze el cierre por la ciclovía, puedes crearlo tu mismo. Los cierres para ciclovías, en días festivos son complejos de crear pues no siempre se realizan y es una tarea que se debe programar con tiempo, algunas alcaldías colaboran con la información otras no. Utiliza la función de Reportar > Cierre (en el Globo naranja) y luego la Valla Naranja con Blanco, escoge la razón y un tiempo estimado.\n\n ",
    "Solved",

    //Adicionado 12-01-2017
    " 6. Cierres Sin Horarios fijos",
    "¡Hola Wazer! Buen día, algunos organismos de movilidad no tienen un horario específico para este tipo de cierres, por tanto es difícil para nosotros conocer los intervalos, si conoces los horarios escríbenos para programarlos.\n\n  Temporalmente utiliza la función de Reportar > Cierre (en el Globo naranja) y luego la Valla Naranja con Blanco, escoge la razón y un tiempo estimado.",
    "Not Identified",


    " 7. Verificar si existe un cierre",
    "¡Hola Wazer! Buen día,\n necesitamos un poco de claridad en tu reporte, la ruta que seguiste se dió por un cierre en la vía o porque está prohibido un giro, ¿Podrías informarnos si es temporal o a largo plazo?.\n\n Quedamos atentos a tu respuesta.",
    "Open",

    /*Tags [ROADWORKS], [CONSTRUCTION], [CLOSURE], [EVENT]*/

    " 6. Marcar Cierre por Obras Viales",
    "¡Hola Wazer!!Gracias por tu reporte!,\n mientras nos das respuesta a este cierre, lo marcaremos como un cierre por OBRAS VIALES para facilitar su seguimiento.\n\n  [ROADWORKS]",
    "Open",

    " 7. Marcar Cierre por Construcción",
    "¡Hola Wazer! ¡Gracias por tu reporte!,\n mientras nos das respuesta a este cierre, lo marcaremos como un cierre por CONSTRUCCIÓN para facilitar su seguimiento.\n\n  [CONSTRUCTION]",
    "Open",

    " 8. Marcar Cierre por Evento",
    "¡Hola Wazer! ¡Gracias por tu reporte!,\n mientras nos das respuesta a este cierre, lo marcaremos como un cierre por EVENTO para facilitar su seguimiento.\n\n  [EVENT]",
    "Open",

    " 9. Marcar Cierre General",
    "¡Hola Wazer! ¡Gracias por tu reporte!,\n mientras nos das respuesta a este cierre, lo marcaremos como un cierre GENERAL para facilitar su seguimiento.\n\n  [CLOSURE]",
    "Open",

    "<br>",
    "",
    "",
    "GPS, TTS(Voz Guía) y Técnicos",
    "",
    "",   


    " 1. Mala señal de GPS (Error proximidad)",
    "¡Hola Wazer! Buen día,\n al parecer te encontrabas en un lugar o vía que no fue identificada correctamente por Waze. Las señales y dispositivos GPS tienen cierto grado de precisión, son bastante sensibles a obstáculos y dependen en gran medida de la marca, estado del mismo y la visibilidad de los satélites.\n\n ",
    "Solved",

    " 2. Mala señal de GPS (Error proximidad) 2",
    "¡Hola Wazer! Buen día,\n al parecer te encontrabas en un lugar o vía que no fue identificada correctamente por Waze. Las señales y dispositivos GPS tienen cierto grado de precisión, cuando te encuentras en una vía con varias calzadas si el GPS te ubica en la calzada contraria a la que estas podrá darte indicaciones equivocadas, ten esto muy presente verificando en cual vía te encuentras en la barra inferior del aplicativo.\n\n ",
    "Solved",

    " 3. Mejorar Precisión de Ubicación",
    "¡Hola Wazer! Buen día,\n al parecer el dispositivo que usas tuvo problemas con el GPS. Ten en cuenta que si activas la WiFi de tu dispositivo puedes mejorar la precisión de tu ubicación.\n\n ",
    "Solved",

    " 4. Mala señal de GPS (Error del Aplicativo)",
    "¡Hola Wazer! Buen día,\n al parecer tu dispositivo móvil presentó problemas con la señal GPS. Te recomendamos reiniciarlo o reinstalar Waze e intentar nuevamente.\n\n ",
    "Solved",

    " 5. Problemas con texto-a-voz TTS(Text to Speech)",  
    "¡Hola Wazer! Buen día,\n por favor, limpia la memoria caché del texto-a-voz (TTS). En la pantalla de navegación, escribe cc@tts en el campo de búsqueda y pulsa Buscar. Recibiras un mensaje indicando que el caché TTS ha sido borrado. Luego se cargaran las voces nuevamente. ¡Gracias!\n ", 
    "Solved", //t0cableguy This should be a last chance option for fixing the issue.04-04-2015 //rickzabel 04-04-2015 

    " 6. Actualización Manual", //"Manual Refresh",
    //"Please try doing these options. Tap the Wazer icon > Settings > Advanced > Data transfer > Refresh Map Of My Area. Secondly, you can try clearing Waze's app cache in your phone’s app manager. The final option is to reset the app by going to the navigation screen and type ##@resetapp in search field and hit search.", //GizmoGuy rickzabel 2/26/15
    "¡Hola Wazer! Buen día, \n\n por favor, intenta estas opciones:  Presiona el Icono inferior Izquierdo> Configuración> Visualización y Mapa> Transferencia de datos> Actualizar Mapa De Mi área. Otra opción que puedes intentar en caso de no funcionar la anterior, es borrar la memoria caché de la aplicación en el gestor de aplicaciones del teléfono (Android) ó puedes restablecer la aplicación; ve a la pantalla de navegación e ingresa ##@resetapp en el campo de búsqueda y presiona buscar. ¡Gracias por reportar!",
    "Solved",

    " 7. Problemas con Android",
     "¡Hola Wazer! Buen día, \n\n por favor, intenta lo siguiente: busca en tu teléfono Android Ajustes> Aplicaciones> Waze> Almacenamiento> Eliminar Caché. Reinicia el aplicativo y prueba de nuevo. ¡Gracias por confiar en nosotros! ",
    "Not Identified",

    "<br>",
    "",
    "",
    "Lugares (Places)",
    "",
    "",

    " 1. Mal ubicado Reportado a (GoogleMaps)",
    "¡Hola Wazer! Buen día,\n el sitio que reportaste se encuentra creado correctamente en Waze; al buscar, Waze entrega resultados de ubicaciones creadas en otros aplicativos aumentando las probabilidades de encontrar el sitio que buscas, en este caso fue de Google Maps, ya realizamos el debido reporte a Google Maps, recuerda preferir los resultados de Waze o Foursquare en las búsquedas.\n\n ",
    "Solved",

    " 2. Creado en (GoogleMaps) pero NO en Waze ", 
    "¡Hola Wazer! Buen día,\n el sitio que reportaste no se encontraba creado en Waze pero si en Google Maps y con tu ayuda pudimos agregarlo. ¡Muchas gracias por tu información!. Espera la actualización del mapa Internacional (INTL), tomará entre 3 y 8 días, verifica la fecha de última actualización en: http://status.waze.com/ ",
    "Solved",

    " 3. Falta en Waze y mal ubicado en (GoogleMaps) ", 
    "¡Hola Wazer! Buen día,\n el sitio que reportaste no se encontraba creado en Waze, los resultados que encontraste eran de GoogleMaps donde estaba mal ubicado, con tu ayuda pudimos agregarlo y solicitar la corrección en GoogleMaps. ¡Muchas gracias por tu información!. Espera la actualización del mapa Internacional (INTL), tomará entre 3 y 8 días, verifica la fecha de última actualización en: http://status.waze.com/ ",
    "Solved",

    " 4. Reporte de lugar nuevo",
    "¡Hola Wazer! Buen día,\n cuando veas que un lugar no se encuentra registrado, utiliza la opción Reportar > Lugar e ingresa la información del nuevo sitio.\n\n ",
    "Solved",

    " 5. Lugar duplicado en Waze",
    "¡Hola Wazer! Buen día,\n el sitio que reportaste está creado correctamente en Waze pero hay otro con un nombre igual, recuerda buscar el lugar antes de solicitar su creación. ¡Gracias por tu reporte!\n\n ",
    "Solved",

    " 6. Lugar mal creado en Waze", //Sitios mal creados en Waze,
    "¡Hola Wazer! Buen día,\n el sitio que reportaste se encontraba mal identificado en Waze y con tu ayuda pudimos corregirlo. ¡Muchas gracias por tu información!. Espera la actualización del mapa Internacional (INTL), tomará entre 3 y 8 días, verifica la fecha de última actualización en: http://status.waze.com/ ",
    "Solved",
	
	" 7. Corrección Place",
    "¡Hola Wazer! Buen día,\n\n el error que reportaste un lugar erroneo fué solucionado, debes tener presente eliminar cualquier instancia existente del destino en la lista de recientes o tus favoritos y posteriormente buscar nuevamente el lugar desde cero. Espera la actualización del mapa Internacional (INTL), tomará entre 3 y 8 días, verifica la fecha de última actualización en: http://status.waze.com/ \n\n ",
    "Solved",

    " 8. Lugar Reportado NO es Claro",
    "¡Hola Wazer! Buen día,\n podemos ayudarte a crear o modificar el sitio, pero requerimos más detalles del mismo.\n\n Quedamos atentos a tu respuesta.",
    "Open",
    //Adicionado 12-01-2017
    " 9. Error de lugar no encontrado",
    "¡Hola Wazer! Buen día,\n no encontramos errores en la ubicación que mencionas, esta se encuentra creada correctamente en Waze y en Google Maps; requerimos un poco más de detalle para encontrar el problema, ¿Cómo lo ingresaste en el aplicativo y qué resultado te retornó? si es posible podrías enviarnos una captura de pantalla del resultado en el aplicativo a  .\n\n Quedamos atentos a tu respuesta.",
    "Open",

    //Adicionado 12-01-2017
    "10. Lugar no especificado",
    "¡Hola Wazer! Buen día,\n con la información que nos das no sabemos cuál es el lugar que buscas o con el que tuviste problemas; requerimos un poco más de detalle para encontrar el inconveniente.\n\n Quedamos atentos a tu respuesta.",
    "Open",
    
    //Adicionado 12-01-2017
    "11. Solo dirección del place",
    "¡Hola Wazer! Buen día,\n con la información que nos das podemos agregar o modificar el sitio que requieres o con el que tienes problemas, pero adicionalmente necesitamos el nombre o descripción del mismo.\n\n Quedamos atentos a tu respuesta.",
    "Open",


    "<br>",
    "",
    "",
 //Adicionado 10-06-2017
 "Nuevos Editores",
    "",
    "",

    " 1. Invitación a Nuevo editor",
    "¡Hola Wazer! Buen día,\n ¿Quieres pertenecer a la comunidad de editores? pues eres bienvenido, únete al grupo y mejoremos esta herramienta que nos ayuda a todos. Ingresa tus datos en el Formulario de acceso al Slack Waze Colombia http://goo.gl/cDtlTt y empieza a ser parte de la Comunidad. ¡Te esperamos!",
    "Solved",

    " 2. Editor con dudas ", 
    "¡Hola Wazer! Buen día,\n Cuéntanos, ¿Ya perteneces a la comundiad? podemos ayudarte con todas tus dudas pero además puedes unirte al equipo y seguir colaborando. Ingresa tus datos en el Formulario de acceso al Slack Waze Colombia http://goo.gl/cDtlTt y empieza a ser parte de la Comunidad. Quedamos atentos a tus comentarios",
    "Open",




    "<br>",
    "",
    "",
    "Ruteo y Tráfico",
    "",
    "",   

    " 1. Ruta Válida",
    "¡Hola Wazer! Buen día,\n no encontramos ningún error en la ruta con tu reporte. Vemos que Waze te proporcionó una ruta válida. Si no la consideras correcta, proporciónanos más detalle para revisar y corregir.\n\n Quedamos atentos a tu respuesta.",
    "Open",

    " 2. Ruta Inválida", //8
    "¡Hola Wazer! Buen día,\n necesitamos más detalle del problema de ruta que tuviste. Informarnos tu destino, hora y cómo lo ingresaste en el aplicativo.\n\n Quedamos atentos a tu respuesta.",
    "Open",

    " 3. Recorrer una vía en contravía", //8
    "¡Hola Wazer! Buen día,\n necesitamos detalle de cual es la vía que tiene el inconveniente y que recorriste en contravía. Recuerda que antes que nada las señales de transito y las indicaciones de las autoridades prevalecen sobre la guía de un aplicativo .\n\n Quedamos atentos a tu respuesta.",
    "Open",

    " 4. Reportes de Tráfico",
    "¡Hola Wazer! Buen día,\n utiliza la opción en la aplicación para reportar tráfico, seleccionando el pin en la parte inferior derecha y haciendo clic en el botón Reportar tráfico. ¡Gracias por reportar!\n\n ",
    "Solved",


    " 5. Desvío con posible error en ruta",
    "¡Hola Wazer! Buen día,\n no encontramos nada que explique la ruta que Waze te dió. Si sabes de algún error en el sitio, por favor informalo para corregirlo de inmediato.\n\n Quedamos atentos a tu respuesta.",
    "Open",


    " 6. Desvío reportado aún siguiendo la ruta",
    "¡Hola Wazer! Buen día,\n vemos que seguiste la ruta entregada por Waze a pesar de reportarla como no válida, ¿Podrías informarnos si hay algún error en ella?, ¿Nos podrías dar más detalle?.\n\n Quedamos atentos a tu respuesta.",
    "Open",

    " 7. Ruteo basado en datos históricos",
    "¡Hola Wazer! Buen día, no encontramos errores en la ruta que Waze te dió. Waze siempre intentará ahorrarte tiempo llevandote por vías que encuentra despejadas en el momento o evitando algúna donde históricamente en la hora y día que vas se presenta un flujo alto de vehículos. ¡Gracias por reportar!\n\n ",
    "Solved",

    " 8. Límite de 1000 kilómetros para ruta", //"1000 Km limit",
    //"The search and navigation capabilities of Waze are limited to 1000 kilometers. When driving further than that distance you will need to select a target under that distance as your temporary destination.",//rz 2/26/15
    "¡Hola Wazer! Buen día,\n\n Las capacidades de búsqueda y navegación de Waze se limitan a 1000 kilómetros. Cuando se conduce más allá de esa distancia tendrá que seleccionar un destino intermedio como su destino temporal.\n ", 
    "NotIdentified", 

    " 9. Ruteo por vías destapadas", 
    "¡Hola Wazer! Buen día, \n\n por favor revisa en el menú Ajustes>Navegación>Caminos de Tierra, si tienes activa la opción de Permitir, No Permitir o Evitar Largos, si es así selecciona No Permitir.\n ", 
    "NotIdentified", 

    "10. Reportes con Información antigua",
    "¡Hola Wazer! Buen día,\n Waze se apoya en datos promedio y reportes de Wazers para informar velocidades en las vías, a más usuarios y mayor tiempo de uso, más exacto será. Si detecta una situación de tráfico lo presentará por algún tiempo, tal vez más o menos del real, así que se pueden encontrar reportes antiguos con minutos de más sin que ya existan. ¡Gracias por reportar!\n\n ",
    "Solved",

    "11. Desvíos Complejos",
    "¡Hola Wazer! Buen día,\n no encontramos errores en la ruta que Waze te dió. Waze siempre intentará ahorrarte tiempo o distancia sugiriendo desviaciones complejas. ¡Gracias por reportar!\n\n ",
    "NotIdentified",

    "12. Desvíos Complejos ¿Pregunta?",
    "¡Hola Wazer! Buen día,\n no encontramos errores en la ruta que Waze te dió. Aparentemente Waze intentó ahorrarte tiempo o distancia sugiriendo desviaciones complejas. Si por el contrario ves que es un error por favor envíanos más detalle para intentar corregirlo. \n\n Quedamos atentos a tu respuesta.",
    "Open",

    "<br>",
    "",
    "",
    "Velocidades",
    "",
    "",

    " 1. Actualización de Velocidad exitosa",
    "¡Hola Wazer! Buen día,\n fue realizado el cambio de velocidad que reportaste \"$URD\" en el sentido vial sugerido. Gracias por tu colaboración.\n\n",
    "Solved",

    " 2. Velocidad NO coincide con señales",
    "¡Hola Wazer! Buen día,\n vemos que la velocidad que nos informas \"$URD\" no coincide con las señales de la vía, ¿Podrías confirmarnos si el valor que dices está identificado en la vía o cambió?.\n\n Quedamos atentos a tu respuesta.",
    "Open",

    " 3. Cambio de velocidad por obras",
    "¡Hola Wazer! Buen día,\n durante la ejecución de obras viales los límites de velocidad cambian, es por esto que en este caso la velocidad es menor a la reportada \"$URD\".\n\n ",
    "Solved",

    " 4. Cambio de Velocidad sin Justificación",
    "¡Hola Wazer! Buen día,\n agradecemos tu comentario, sin embargo las señales físicas que se tienen en las vías se dan bajo regulaciones del Mintransporte y las Alcaldías (entes competentes). Waze es de todos y para todos, recuerda que el uso indebido de los reportes genera bloqueo permanente del usuario.\n\n ",
    "Solved",

    " 5. Reporte de velocidad sin sentido",
    "¡Hola Wazer! Buen día,\n agradecemos tu comentario, sin embargo este no tiene justificación por las condiciones del lugar de donde reportaste. En una próxima oportunidad asegúrate de informarlo desde el sitio exacto de la novedad y verifica que la velocidad esté debidamente señalizada. Waze es de todos y para todos, recuerda que el uso indebido de los reportes genera bloqueo permanente del usuario.\n\n ",
    "Solved",


    " 6. Cambio de Velocidad ",
    "¡Hola Wazer! Buen día,\n agradecemos tu comentario, sin embargo las señales físicas que se tienen en las vías se dan bajo regulaciones del Mintransporte y las Alcaldías (entes competentes). Waze es de todos y para todos, recuerda que el uso indebido de los reportes genera bloqueo permanente del usuario.\n\n ",
    "Solved",


    " 7. Vel No Válida por ZE, ZR, ZM o ZH (30)",
    "¡Hola Wazer! Buen día,\n gracias por tu reporte, recuerda que según la regulación Colombiana, Zonas Escolares, Zonas Residenciales, Zonas Militares, Hospitales y algunos cruces o rampas tienen un límite de 30Km/h, reportaste \"$URD\", sin embargo el sector tiene al menos una de las características antes mencionadas.\n\n  ",
    "Solved",    

    " 8. Vel No Válida para Zona Rural (30)",
    "¡Hola Wazer! Buen día,\n gracias por tu reporte, para las Zonas Rurales se estipulan velocidades entre 30 y 40Km/h, reportaste \"$URD\", sin embargo la Zona es Rural, la velocidad no puede ser modificada.\n\n  ",
    "Solved",    

    " 9. Velocidades Vías Privadas (10)",
    "¡Hola Wazer! Buen día,\n gracias por tu reporte, para las vías privadas se tienen estipuladas velocidades entre 5,10 y 15Km/h, reportaste \"$URD\" y a menos que se tenga una señal física lo máximo puede ser 10Km/h, la velocidad no puede ser modificada.\n\n  ",
    "Solved",    

    "10. Velocidad Intraurbana (60)",
    "¡Hola Wazer! Buen día,\n según la regulación Colombiana y las definiciones de la Alcaldía Local, en avenidas urbanas la velocidad tiene un límite de 60Km/h balance entre movilidad y seguridad, es por ello que la vía tiene estos límites.\n\n  ",
    "Solved",

    "11. Velocidad vías intermunicipales",
    "¡Hola Wazer! Buen día,\n según la regulación Colombiana, en carreteras intermunicipales la velocidad tiene un límite máximo entre 80 y 90Km/h y en Autopistas Doble Calzada más de 90Km/h hasta 120Km/h a menos que se indique lo contrario, es por ello que la vía tiene el límite actual y no el que reportaste \"$URD\".\n\n ",
    "Solved",

    "12. Velocidad específica en la vía",
    "¡Hola Wazer! Buen día,\n gracias por tu reporte, es claro que la vía en la que reportas la velocidad tiene el límite que mencionas, sin embargo, existen sitios en ella donde se pide disminuir la velocidad, es por esto que para el lugar en el que haces el reporte la velocidad baja.\n\n ",
    "Solved",

    "13. Velocidad ya incluida, pregunta",
    "¡Hola Wazer! Buen día,\n gracias por tu reporte, \"$URD\", sin embargo la vía ya tenía esta velocidad actualizada. ¿Encontraste algún error adicional?. \n\n Quedamos atentos a tu respuesta.",
    "Open",

    "14. Velocidad ya incluida",
    "¡Hola Wazer! Buen día,\n gracias por tu reporte, \"$URD\", sin embargo la vía ya tenía esta velocidad actualizada. Continúa reportando para mantener actualizados los mapas. \n\n ",
    "Solved",

    "<br>",
    "",
    "",
    "Peajes y Combustible",
    "",
    "",   

    " 1. Precio faltante o erróneo en Peaje",
    "¡Hola Wazer! Buen día,\n los precios informados en los peajes depende en un 60% de tu ayuda, ¿Podrías informarnos el precio real del mismo?.\n\n Quedamos atentos a tu respuesta.",
    "Open",  

    " 2. Precio Corregido en Peaje",
    "¡Hola Wazer! Buen día,\n gracias a tu reporte pudimos corregir el precio del Peaje, así entre todos ayudamos otros Wazers.\n\n ",
    "Solved",   

    " 3. Precio Peaje corregido esperar actuali.",
    "¡Hola Wazer! Buen día,\n el precio que reportaste ya está incluido, sin embargo debemos esperar la actualización del mapa internacional (INTL), esta tomará entre 3 y 8 días. ¡Gracias por reportar! ",
    "Solved",  

    " 4. Precio faltante o erróneo Combustible",
    "¡Hola Wazer! Buen día,\n los precios de los combustibles en las Estaciones de Servicio (EDS) son ingresados por usuarios como tu, la próxima vez puedes actualizar los valores seleccionando el Globo Naranja-Icono de Combustible-Seleccionas la Estación-Ingresas el valor y Oprimes Listo.\n\n ",
    "Solved",  

    " 5. Peaje Movido o Eliminado",
    "¡Hola Wazer! Buen día,\n en el momento no tenemos información de que este peaje hubiese sido trasladado o eliminado, ¿Podrías informarnos qué ocurrió y la fecha y ubicación del mismo en caso de su traslado?.\n\n Quedamos atentos a tu respuesta.",
    "Open",  

    //End of Default URs 
];
//end ColombianSpanish list