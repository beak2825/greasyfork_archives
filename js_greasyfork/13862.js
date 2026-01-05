// ==UserScript==
// @name           WME URComments Colombian Spanish List
// @description    This script is for ColombianSpanish comments to be used with URComments 
// @namespace      RickZabel@gmail.com
// @grant          none
// @grant          GM_info
// @version        0.0.2
// @match          https://editor-beta.waze.com/*editor/*
// @match          https://www.waze.com/*editor/*
// @author         Mauricio Otálvaro '2015  mincho77
// @license        MIT/BSD/X11
// @icon			data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAwCAYAAACFUvPfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQyQjZDNjdEODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQyQjZDNjdFODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDJCNkM2N0I4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDJCNkM2N0M4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6++Bk8AAANOElEQVR42tRZCWxU1xW9M39mPB5v431fMLYJdmpjthQUVsdlS9IQQkpIIDRhl5pKQUpbKkAEpakQIhVVRUytQIGwihCaBkgItQELQosxdrDZ7Njjbbx7vM0+f3ruZDz1NmTGhEj59tOb//979553313fl9jtdvqpXbLHRVgikTz0NbdJkyYJERERUp1OJ1Wr1WJLS4tYXFxswzu7s408+XFJ2g1oSUZGhtzf318piqLKx8dHZbPZFFKpVMC9TRAEs8lk0uNe39vbaywvL7eMBP5HAz179myZxWLxxfNg3IZHRkbG5OTkpEPSkQAs1Wq1nQUFBVXt7e2twNSGMdx3yuVyQ2FhofVHBw01kCsUigA8i1m9evXc3Nzc5TExMwindow.UrcommentsColombianSpanishURC_Text10]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
// @downloadURL https://update.greasyfork.org/scripts/13862/WME%20URComments%20Colombian%20Spanish%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/13862/WME%20URComments%20Colombian%20Spanish%20List.meta.js
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

//this is the note that is added to the the reminder link  option
window.UrcommentsColombianSpanishReplyInstructions = 'Para responder, por favor utilice Waze APP '; //'To reply, please either use the Waze app followed by mincho77 ' - followed by the URL - superdave, rickzabel, t0cableguy 3/6/2015

//the position of the close as Not Identified message (starting at 0 counting titles, comments, and ur status). in my list this is "7th day With No Response"
window.UrcommentsColombianSpanishCloseNotIdentifiedPosistion = 6;

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


//below is all of the text that is displayed to the user while using the script this section is new and going to be used in the next version of the script.
window.UrcommentsColombianSpanishURC_Text = [];
window.UrcommentsColombianSpanishURC_Text_tooltip = [];
window.UrcommentsColombianSpanishURC_USER_PROMPT = [];

//zoom out links
window.UrcommentsColombianSpanishURC_Text[0] = "Zoom 0 y Salir de UR"; //"Zoom Out 0 & Close UR"
window.UrcommentsColombianSpanishURC_Text_tooltip[0] = "Realiza un Zoom Out completo y cierra la ventana de UR"; //"Zooms all the way out and closes the UR window"

window.UrcommentsColombianSpanishURC_Text[1] = "Zoom 2 y Salir de UR";	//"Zoom Out 2 & Close UR"	
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

window.UrcommentsColombianSpanishURC_Text[28] = "Centrar automáticamente en una UR";  //"Auto center on UR"
window.UrcommentsColombianSpanishURC_Text_tooltip[28] = "Si el Zoom es menor de 3 centra el mapa con el zoom actual cuando una UR tiene comentarios"; //"Auto Center the map at the current map zoom when UR has comments and the zoom is less than 3"

window.UrcommentsColombianSpanishURC_Text[29] = "Auto seleccionar Abierto, Resuelto o No Identificado"; //"Auto click open, solved, not identified"
window.UrcommentsColombianSpanishURC_Text_tooltip[29] = "Elimina el mensaje de preguntas recientes de reportes, dependiendo de la selección: Abierto, Resuelto o No Identificado"; //"Suppress the message about recent pending questions to the reporter and then depending on the choice set for that comment Clicks Open, Solved, Not Identified"

window.UrcommentsColombianSpanishURC_Text[30] = "Guardar Auto cuando Resuelto o No identificado"; //"Auto save after a solved or not identified comment"
window.UrcommentsColombianSpanishURC_Text_tooltip[30] = "Si se ingresa un comentario y se selecciona Resuelto o No Identificado, se guarda automáticamente el UR"; //"If Auto Click Open, Solved, Not Identified is also checked, this option will click the save button after clicking on a UR-Comment and then the send button"

window.UrcommentsColombianSpanishURC_Text[31] = "Cierre automáticamente la ventana de comentarios"; //" Auto close comment window"
window.UrcommentsColombianSpanishURC_Text_tooltip[31] = "En las UR que no requieren ser salvadas esta opción las cerrará al dar click en UR-Comment y la cerrará"; //"For the user requests that do not require saving this will close the user request after clicking on a UR-Comment and then the send button"

window.UrcommentsColombianSpanishURC_Text[32] = "Recargar mapa automáticamente después de un comentario"; //"Auto reload map after comment"
window.UrcommentsColombianSpanishURC_Text_tooltip[32] = "Permite recargar el mapa después de dar click en UR-Comment y luego el botón enviar. Esto fuerza al URO+ a refrescar los filtros de URO definidos. No aplica para mensajes que han sido salvados desde que se recargó el mapa."; //"Reloads the map after clicking on a UR-Comment and then send button. This forces URO+ to re-apply the chosen URO filters. Currently this does not apply to any messages that get saved. Since saving automatically reloads the map."

window.UrcommentsColombianSpanishURC_Text[33] = "Alejar (ZoomOut) después de un comentario"; //"Auto zoom out after comment"
window.UrcommentsColombianSpanishURC_Text_tooltip[33] = "Después de dar click en un UR-Comment de la lista y dar click en enviar, automáticamente se aleja del punto donde estaba"; //"After clicking on a UR-Comment in the list and clicking send on the UR the map zoom will be set back to your previous zoom"

window.UrcommentsColombianSpanishURC_Text[34] = "Activar automáticamente el tab de UR-Comments"; //"Auto switch to the UrComments tab"
window.UrcommentsColombianSpanishURC_Text_tooltip[34] = "Cambiar automáticamente al tab de UrComments después de cargar la página cuando se abre una UR, cuando la ventana de la UR se cierra y se cambia al tab previo"; //"Auto switch to the URComments tab after page load and when opening a UR, when the UR window is closed you will be switched to your previous tab"

window.UrcommentsColombianSpanishURC_Text[35] = "Cerrar mensaje - doble click (Auto nviar)"; //"Close message - double click link (auto send)"
window.UrcommentsColombianSpanishURC_Text_tooltip[35] = "Crea un enlace adicional para cerrar el comentario cuando se de doble click en autoenviar el comentario de en la ventana de UR"; //"Add an extra link to the close comment when double clicked will auto send the comment to the UR windows and click send, and then will launch all of the other options that are enabled"

window.UrcommentsColombianSpanishURC_Text[36] = "Todos comentários - doble click (Auto enviar)"; //"All comments - double click link (auto send)"
window.UrcommentsColombianSpanishURC_Text_tooltip[36] = "Crea un enlace adicional para cada comentario de la lista cuando se de doble click en autoenviar el comentario de en la ventana de UR"; //"Add an extra link to each comment in the list that when double clicked will auto send the comment to the UR windows and click send, and then will launch all of the other options that are enabled"

window.UrcommentsColombianSpanishURC_Text[37] = "Lista de comentarios"; //"Comment List"
window.UrcommentsColombianSpanishURC_Text_tooltip[37] = "Presenta la lista de comentarios"; //"This is shows the selected comment list

window.UrcommentsColombianSpanishURC_Text[38] = "Deshabilitar el botón \"Concluído\" (\"Done\")"; //"Disable done button"
window.UrcommentsColombianSpanishURC_Text_tooltip[38] = "Deshabilita el botón \"Concluído\" (\"Done\") localizado en la parte inferior de la ventana de URs"; //"Disable the done button at the bottom of the new UR window"

window.UrcommentsColombianSpanishURC_Text[39] = "Dejar de seguir una UR después de enviada"; //"Unfollow UR after send"
window.UrcommentsColombianSpanishURC_Text_tooltip[39] = "Dejar de seguir una UR después de seleccionar enviar comentario"; //"Unfollow UR after sending comment"

window.UrcommentsColombianSpanishURC_Text[40] = "Auto envío de avisos"; //"Auto send reminders"
window.UrcommentsColombianSpanishURC_Text_tooltip[40] = "Envia automáticamente avisos para URs propias, que esten en la pantalla"; //"Auto send reminders to my UR as they are on screen"

window.UrcommentsColombianSpanishURC_Text[41] = "Cambiar el tag \[Name\] (Nombre) con el nombre del Editor"; //"Replace tag name with editor names"
window.UrcommentsColombianSpanishURC_Text_tooltip[41] = "Cuando una UR tiene el nombre del Editor (por lo general cuando es enviada por el mismo editor) los datos son cambiados por el nombre del editor"; //"When a UR has the logged in editors name in it replace the tag type with the editors name"

window.UrcommentsColombianSpanishURC_Text[42] = "(Doble Click) para cerrar enlaces"; //double click to close links
window.UrcommentsColombianSpanishURC_Text_tooltip[42] = "Doble Click para enviar Automáticamente los mensajes"; //"Double click here to auto send - "

window.UrcommentsColombianSpanishURC_USER_PROMPT[0] = "URComments - Usted tiene una versión antigua con los comentarios personalizados para Colombia o un error de sintaxis en los propios. Faltante: "; //"UR Comments - You either have a older version of the custom comments file or a syntax error either will keep the custom list from loading. Missing: "

window.UrcommentsColombianSpanishURC_USER_PROMPT[1] = "URComments - Los siguientes datos hacen falta en los mensajes personalizados: "; //"UR Comments - you are missing the following items from your custom comment list: "

window.UrcommentsColombianSpanishURC_USER_PROMPT[2] = " La lista de mensajes se ha podido encontrar. Puede obtener la lista e instrucciones de cómo obtenerla en https://wiki.waze.com/wiki/User:Rickzabel/UrComments/"; //" List can not be found you can find the list and instructions at https://wiki.waze.com/wiki/User:Rickzabel/UrComments/ PENDIENTE"

window.UrcommentsColombianSpanishURC_USER_PROMPT[3] = "URComments - Los días de vencimiento no se pueden poner en \"0\""; //"URComments you can not set close days to zero"

window.UrcommentsColombianSpanishURC_USER_PROMPT[4] = "URComments - Para usar los enlaces con Doble Click debe tener habilitada la opción de auto ajuste (Autoset) de URs"; //"URComments to use the double click links you must have the autoset UR status option enabled"

window.UrcommentsColombianSpanishURC_USER_PROMPT[5] = "Saliendo de FilterURs2 pues los dos filtros, cuenta y auto avisos estan deshabilitados"; //"aborting FilterURs2 because both filtering, counts, and auto reminders are disabled"

window.UrcommentsColombianSpanishURC_USER_PROMPT[6] = "URComments: El tiempo de espera para la carga de los UR ha terminado, intente nuevamente."; //"URComments: Loading UR data has timed out, retrying." - this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsColombianSpanishURC_USER_PROMPT[7] = "URComments: Agregando avisos a URs: "; // "URComments: Adding reminder message to UR: " - this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsColombianSpanishURC_USER_PROMPT[8] = "URComments: El filtrado de URs ha sido desactivado pues el filtro del script URO está activo"; //"URComment's UR Filtering has been disabled because URO\'s UR filters are active." - this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsColombianSpanishURC_USER_PROMPT[9] = "UrComments: ¡Detectó que tiene cambios no guardados!, con la opción de Auto Guardar activada y con cambios no guardados no es posible enviar comentarios que requieran que el script guarde. Por favor guarde los cambios y de click nuevamente en el comentario que desea enviar"; //"UrComments has detected that you have unsaved changes!\n\nWith the Auto Save option enabled and with unsaved changes you cannot send comments that would require the script to save. Please save your changes and then re-click the comment you wish to send."

window.UrcommentsColombianSpanishURC_USER_PROMPT[10] = "URComments: ¡No ha podido encontrar la ventana de comentarios!. Para el funcionamiento correcto del sript es necesario tener la ventana de la UR abierta"; //"URComments: Can not find the comment box! In order for this script to work you need to have a user request open." - this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsColombianSpanishURC_USER_PROMPT[11] = "URComments: Se enviarán avisos de acuerdo a los días configurados. Esto solo ocurre cuando estos son visibles en tu área. NOTA: Cuando se utilice esta opción no se deben dejar UR abiertas a menos que tenga preguntas que requieran una respuesta del Wazer, esto pues los avisos continuarán enviandose"; //"URComments This will send reminders at the reminder days setting. This only happens when they are in your visible area. NOTE: when using this feature you should not leave any UR open unless you had a question that needed an answer from the Wazer as this script will send those reminders. " - conformation message/ question



//The comment array should follow the following format,
// "Title",     * is what will show up in the URComment tab
// "comment",   * is the comment that will be sent to the user currently 
// "URStatus"   * this is action to take when the option "Auto Click Open, Solved, Not Identified" is on. after clicking send it will click one of those choices. usage is. "Open", or "Solved",or "NotIdentified",
// to have a blank line in between comments on the list add the following without the comment marks // there is an example below after "Thanks for the reply"
// "<br>",
// "",
// "",

//ColombianSpanish list
window.UrcommentsColombianSpanishArray2 = [			    
				"-Resuelto",
                "!Hola Wazer! Buen día,\nel problema que reportaste ha sido resuelto. Espera la actualización del mapa internacional (INTL), que toma entre 3 y 8 días, puedes verificar la fecha de última actualización en: http://status.waze.com/. \nRecuerda que los mapas son mantenidos y creados por usuarios de Waze como tu https://wiki.waze.com/wiki/Colombia. También puedes seguirnos en Twitter @WazeCo y en facebook/wazeco",
                "Solved",
    
                "-1ª Aviso cierre UR(3-10 días Sin Respuesta)",
                "!Hola Wazer! Buen día,\nrequerimos una respuesta a la consulta realizada para identificar el problema que reportaste, de no obtenerla no nos será posible ayudarte con la misma.",
                "Open",

                "-2° Aviso cierre UR(>10 días Sin Respuesta)",
                "!Hola Wazer! Buen día,\nEl reporte que realizaste fue cerrado por tener más de 10 días sin una respuesta con información suficiente para corregirlo, esperamos contar con más detalle en tu próximo reporte. \nRecuerda que los mapas son mantenidos y creados por usuarios de Waze como tu https://wiki.waze.com/wiki/Colombia. También puedes seguirnos en Twitter @WazeCo y en facebook/wazeco",
                "NotIdentified",
            
				"-No Identificado - Enfático tipo 1",
				"!Hola Wazer! Buen día,\ntu reporte será cerrado por falta de información. Recuerda que el mapa de Waze se construye con la ayuda de los mismos usuarios y no hay una mejor fuente de información que quienes conocen el lugar. No sobra decir que el uso inadecuado de Alertas puede generar la pérdida total de los puntos o bloqueo del usuario.\nSi deseas saber más acerca de cómo ayudar a tu región con actualizaciones de mapas ingresa a https://wiki.waze.com/wiki/Colombia o también puedes seguirnos en Twitter @WazeCo y en facebook/wazeco",
				"NotIdentified",

				"-No Identificado - Enfático tipo 2",
				"!Hola Wazer! Buen día,\ngeneraste un reporte de error del mapa, éste inmediatamente dispara la solicitud a una red de editores que también son usuarios como tu, ellos actúan de manera voluntaria para hacer el mapa lo más fiel y actualizado posible. Desafortunadamente, con la información que nos diste para este reporte no nos fué posible identificar el problema. Tu colaboración es muy importante por tanto te solicitamos darnos más detalle la próxima vez.\nRecuerda que los mapas son mantenidos y creados por usuarios de Waze como tu https://wiki.waze.com/wiki/Colombia. También puedes seguirnos en Twitter @WazeCo y en facebook/wazeco",
				"NotIdentified",
       
	   			"-Incluir descripción del Usuario",
				"!Hola Wazer! Buen día, \nen tu reporte nos informaste lo siguiente: \"$URD\" sin embargo, no tenemos la suficiente información para arreglar tu petición. ¿Podrías por favor decirnos qué salió mal con la ruta que Waze te dio o el inconveniente que tuviste? \nRecuerda que los mapas son mantenidos y creados por usuarios de Waze como tu https://wiki.waze.com/wiki/Colombia. También puedes seguirnos en Twitter @WazeCo y en facebook/wazeco",
                "Open",
               
    			"-Reporte de semáforo",
    			"!Hola Wazer! Buen día,\nten en cuenta que los semáforos no son elementos que se tengan definidos en Waze, sin embargo en el aplicativo existen unos elementos similares a un semáforo, estos son cámaras de fotomultas de semáforos. !Gracias por reportar!\nRecuerda que los mapas son mantenidos y creados por usuarios de Waze como tu https://wiki.waze.com/wiki/Colombia. También puedes seguirnos en Twitter @WazeCo y en facebook/wazeco",
    			"NotIdentified",
    
    			"-Reporte al municipio local",
				"!Hola Wazer! Buen día,\nLos reportes que acá haces son para corregir problemas en el mapa, deberás informar a la secretaría de movilidad el inconveniente que te ocurrió. !Gracias por reportar!\nRecuerda que los mapas son mantenidos y creados por usuarios de Waze como tu https://wiki.waze.com/wiki/Colombia. También puedes seguirnos en Twitter @WazeCo y en facebook/wazeco",
				"NotIdentified",
    
			    "-Mala señal de GPS (Error del dispositivo)",
                "!Hola Wazer! Buen día,\nAl parecer el dispositivo que usas tuvo problemas con el GPS. Las señales GPS no viajan a través de vehículos o edificios altos. Por favor, asegurate que tu dispositivo está en algún lugar con una vista despejada del cielo.\nRecuerda que los mapas son mantenidos y creados por usuarios de Waze como tu https://wiki.waze.com/wiki/Colombia. También puedes seguirnos en Twitter @WazeCo y en facebook/wazeco",
                "NotIdentified",
				
				"-Mala señal de GPS (Error proximidad)",
                "!Hola Wazer! Buen día,\nal parecer te encontrabas en un lugar o vía que no fue identificada correctamente dentro del aplicativo. Recuerda que las señales GPS tienen cierto grado de precisión y esta depende en gran medida de la marca o estado del dispositivo que tienes.\nRecuerda que los mapas son mantenidos y creados por usuarios de Waze como tu https://wiki.waze.com/wiki/Colombia. También puedes seguirnos en Twitter @WazeCo y en facebook/wazeco",
                "NotIdentified",
				
				
				"-Mala señal de GPS (Error del Aplicativo)",
                "!Hola Wazer! Buen día,\nal parecer tu dispositivo presentó problemas con la señal de GPS. Te recomendamos reiniciarlo o reinstalar Waze e intentar nuevamente.\nRecuerda que los mapas son mantenidos y creados por usuarios de Waze como tu https://wiki.waze.com/wiki/Colombia. También puedes seguirnos en Twitter @WazeCo y en facebook/wazeco",
                "NotIdentified",
				
				"-Ruta Valida",
                "!Hola Wazer! Buen día,\nRevisamos el problema y no encontramos ningún error en el mapa. Podemos ver que Waze te proporcionó una ruta válida, sin embargo si sabes que no es la correcta, dános un poco más de detalle para verificar nuevamente y de ser el caso corregir.\nRecuerda que los mapas son mantenidos y creados por usuarios de Waze como tu https://wiki.waze.com/wiki/Colombia. También puedes seguirnos en Twitter @WazeCo y en facebook/wazeco",
                "Open",

				"-Desvíos / Enrutamiento extraño",
                "!Hola Wazer! Buen día,\nNo pudimos encontrar nada anormal en el mapa que explique la ruta que Waze te dió.  Sin embargo recuerda que si la opción que tienes es la de una ruta más rápida, Waze intenta ahorrarte tiempo de todas las formas posibles, así las cosas algunas veces sugiere desviaciones complejas sólo para ahorrar unos segundos en tu viaje. !Muchas gracias por reportar!\nRecuerda que los mapas son mantenidos y creados por usuarios de Waze como tu https://wiki.waze.com/wiki/Colombia. También puedes seguirnos en Twitter @WazeCo y en facebook/wazeco",
                "NotIdentified",
				
				"-Precio faltante o erróneo en Peaje",
				"!Hola Wazer! Buen día,\nRecuerda que la información de precios de los peajes depende en un 60% de tu ayuda, ¿Podrías informarnos el precio real del mismo?.\nRecuerda que los mapas son mantenidos y creados por usuarios de Waze como tu https://wiki.waze.com/wiki/Colombia. También puedes seguirnos en Twitter @WazeCo y en facebook/wazeco",
				"Open",	
				
				
				"-Precio faltante o erróneo Combustible",
				"!Hola Wazer! Buen día,\nRecuerda que la información de precios de las Estaciones de Servicio (EDS) son ingresados por usuarios como tu, la proxima vez puedes actualizar los valores seleccionando el Globo Naranja-Icono de Combustible-Seleccionas la estación-Ingresas el valor-Oprimes Listo.\nRecuerda que los mapas son mantenidos y creados por usuarios de Waze como tu https://wiki.waze.com/wiki/Colombia. También puedes seguirnos en Twitter @WazeCo y en facebook/wazeco",
				"Open",	
				
				
				"-Reportes con Información antigua",
                "!Hola Wazer! Buen día,\nWaze se apoya en datos promedio y reportes de Wazers para establecer e informar velocidades lentas en las vías, entre más usuarios tengamos y más tiempo lo utilicen, más exactos seran estos tiempos y velocidades. Una vez Waze ha detectado una situación de tráfico, éste puede recordarlo por algún tiempo, incluso quizás un poco más tiempo del que dure el accidente o situación reportada, por ello puedes encontrar algunos reportes antiguos con unos minutos de más sin que ya estén ocurriendo.\nRecuerda que los mapas son mantenidos y creados por usuarios de Waze como tu https://wiki.waze.com/wiki/Colombia. También puedes seguirnos en Twitter @WazeCo y en facebook/wazeco",
                "NotIdentified",

                "-Tráfico",
                "!Hola Wazer! Buen día,\nPara reportar tráfico lento en la vía, por favor utiliza la opción en la aplicación, seleccionando el pin en la parte inferior derecha y haciendo click en el botón Reportar tráfico. !Gracias!\nRecuerda que los mapas son mantenidos y creados por usuarios de Waze como tu https://wiki.waze.com/wiki/Colombia. También puedes seguirnos en Twitter @WazeCo y en facebook/wazeco",
                "NotIdentified",

                "-Giro no permitido / Giro Permitido",
                "!Hola Wazer! Buen día,\n ¿Podrías por favor decirnos qué giro no estaba permitido en tu ruta o cual debería estarlo? o ¿Es alguna restricción temporal?\nRecuerda que los mapas son mantenidos y creados por usuarios de Waze como tu https://wiki.waze.com/wiki/Colombia. También puedes seguirnos en Twitter @WazeCo y en facebook/wazeco",
                "Open",
				
				"-Restricciones ya incluidas",
				"!Hola Wazer! Buen día,\nLa restricción que reportaste ya está incluida en el mapa, Waze no deberá enrutar a través de este giro la próxima vez.Espera la actualización del mapa internacional (INTL), que toma entre 3 y 8 días. !Gracias por reportar!\nRecuerda que los mapas son mantenidos y creados por usuarios de Waze como tu https://wiki.waze.com/wiki/Colombia. También puedes seguirnos en Twitter @WazeCo y en facebook/wazeco",
				"NotIdentified",
				
				"-Bloqueo temporal de una vía",
				"!Hola Wazer! Buen día,\nSi la vía está completamente bloqueada, tu mismo puedes ayudarnos a cerrarla, solo usa la función de Reportar > Cierre en el Globo naranja y luego la Valla Naranja con Blanco, puedes escoger el por qué y el tiempo estimado del cierre para que a ti y otros Wazers se le ofrezca una ruta alterna, de lo contrario utiliza Reportar > Tráfico, poco a poco Waze aprenderá que esa ruta es más lenta y una ruta más rápida se convertirá en la preferida.\nRecuerda que los mapas son mantenidos y creados por usuarios de Waze como tu https://wiki.waze.com/wiki/Colombia. También puedes seguirnos en Twitter @WazeCo y en facebook/wazeco",
				"NotIdentified",

                			
				"-Eliminar cierres",
				"!Hola Wazer! Buen día,\nDebido a que los cierres cambian diariamente, estamos cerrando los reportes antiguos para concentrarnos en los más recientes. Se necesita al menos algo de tiempo para que nuestras ediciones se reflejen en el mapa. Cuando te encuentres con los cierres de carreteras a corto plazo en el futuro, por favor, utiliza Reportar > Cierre en el Globo naranja y luego la Valla Naranja con Blanco, puedes escoger el por qué y el tiempo estimado del cierre.\nRecuerda que los mapas son mantenidos y creados por usuarios de Waze como tu https://wiki.waze.com/wiki/Colombia. También puedes seguirnos en Twitter @WazeCo y en facebook/wazeco",
				"NotIdentified",
				  
    
				"<br>",
                "",
                "",
				
	            "-Problemas con dirección",
                "!Hola Wazer! Buen día,\ncon la información que tenemos no podrémos solucionar tu reporte pues no contamos con un punto de partida o destino  en la ruta. ¿Podrías darnos la dirección con la cual estas teniendo problemas?\nRecuerda que los mapas son mantenidos y creados por usuarios de Waze como tu https://wiki.waze.com/wiki/Colombia. También puedes seguirnos en Twitter @WazeCo y en facebook/wazeco",
                "Open",

						
				"-Nombre de vía incorrecto",
				"!Hola Wazer! Buen día,\n¿Podrías por favor informarnos qué nombre de calle encontraste errado y el que debería tener? ¡Gracias!\nRecuerda que los mapas son mantenidos y creados por usuarios de Waze como tu https://wiki.waze.com/wiki/Colombia. También puedes seguirnos en Twitter @WazeCo y en facebook/wazeco",
				"Open",
				


				"<br>",
                "",
                "",

                //Default URs  6 through 22 are all the different types of UR that a user can submit do not change them thanks
                

                "-Ruta incorrecta", //8
                "!Hola Wazer! Buen día,\n¿Podrías darnos un poco más de detalle con el problema de ruta que tuviste? ¿O Informarnos tu destino y cómo lo ingresaste en el aplicativo?\nRecuerda que los mapas son mantenidos y creados por usuarios de Waze como tu https://wiki.waze.com/wiki/Colombia. También puedes seguirnos en Twitter @WazeCo y en facebook/wazeco",
                "Open",

                
                "-Falta rotonda o vía", //9
                "!Hola Wazer! Buen día,\n¿Podrías darnos un poco más de detalle sobre la vía que hace falta?, pues la información que tenemos no es suficiente para poderte ayudar.\nRecuerda que los mapas son mantenidos y creados por usuarios de Waze como tu https://wiki.waze.com/wiki/Colombia. También puedes seguirnos en Twitter @WazeCo y en facebook/wazeco",
                "Open",
                
                "-Falta paso superior", //12
                "!Hola Wazer! Buen día,\nno contamos con información suficiente para agregar el paso elevado que nos mencionas, ¿Podrías darnos un poco más de detalle para agregarlo?\nRecuerda que los mapas son mantenidos y creados por usuarios de Waze como tu https://wiki.waze.com/wiki/Colombia. También puedes seguirnos en Twitter @WazeCo y en facebook/wazeco",
                "Open",

          
                "-Falta salida", //15
                "!Hola Wazer! Buen día,\nno contamos con información suficiente para agregar la salida que mencionas hace falta. ¿Podrías darnos un poco más de detalle para agregarla?\nRecuerda que los mapas son mantenidos y creados por usuarios de Waze como tu https://wiki.waze.com/wiki/Colombia. También puedes seguirnos en Twitter @WazeCo y en facebook/wazeco",
                "Open",
   	   
	   
				"-Lugares mal ubicados (Google Maps)",
				"!Hola Wazer! Buen día,\nel sitio que reportaste se encuentra creado correctamente en Waze; al realizar una búsqueda, Waze te entrega resultados de ubicaciones creadas en otros aplicativos para aumentar las probabilidades de encontrar el sitio que buscas en este caso fue de Google Maps, por tanto te recomendamos reportarlo en Google Maps y preferir los resultados de Waze o Foursquare en las búsquedas pues son más precisos en este momento.\nRecuerda que los mapas son mantenidos y creados por usuarios de Waze como tu https://wiki.waze.com/wiki/Colombia. También puedes seguirnos en Twitter @WazeCo y en facebook/wazeco",
				"NotIdentified",

				"-Camaras de fotodetección",
                "!Hola Wazer! Buen día,\nnos reportaste que hace falta una cámara de fotodetección en la vía, recuerda que tu mismo puedes agregarlas desde el aplicativo y posteriormente nosotros las aprobaremos, simplemente usa la función de Reportar > Camara en el Globo naranja y luego selecciona si es una camara para semáforos o de velocidad.\nRecuerda que los mapas son mantenidos y creados por usuarios de Waze como tu https://wiki.waze.com/wiki/Colombia. También puedes seguirnos en Twitter @WazeCo y en facebook/wazeco",
                "NotIdentified",
							

				
//End of Default URs 
];
//end ColombianSpanish list