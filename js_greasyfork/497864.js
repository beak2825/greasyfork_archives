// ==UserScript==
// @name           Pluxee Delivery Auto-Complete
// @author         Ivan
// @namespace      https://greasyfork.org/users/1145671-hipercubo
// @description    Rellena los campos de Instrucciones y Celular con valores predefinidos
// @include        *sodexodelivery.com/checkout*
// @require        http://code.jquery.com/jquery-latest.min.js
// @run-at         document-end
// @license        MIT
// @version        0.1.1
// @downloadURL https://update.greasyfork.org/scripts/497864/Pluxee%20Delivery%20Auto-Complete.user.js
// @updateURL https://update.greasyfork.org/scripts/497864/Pluxee%20Delivery%20Auto-Complete.meta.js
// ==/UserScript==

// Poner el texto a rellenar en el campo Instrucciones dentro
// de las siguientes comillas

var instrucciones = 'Tus instrucciones acá';

// Poner el número a rellenar en el campo Celular dentro
// de las siguientes comillas

var celular = 'Tu celular acá';

$("textarea[name='notas']").val(instrucciones);
$("input[name='celular']").val(celular);