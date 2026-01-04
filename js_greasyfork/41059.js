// ==UserScript==
// @name    		Google Search - Always Show Image Size
// @description		Forces Google Image Search to display sizes for all the images by default.
// @name:fr			Google Search - Toujours afficher Taille de l'image
// @name:de			Google-Suche - Bildgröße immer anzeigen
// @name:ru			Поиск Google - всегда показывать размер изображения
// @name:es			Google Búsqueda - Mostrar Siempre Tamaño Imagen
// @description:fr	Oblige Google Recherche d'images à afficher par défaut les tailles de toutes les images.
// @description:de	Erzwingt, dass in der Google Bildsuche standardmäßig die Größe aller Bilder angezeigt wird.
// @description:ru	Вынуждает Google Image Search отображать размеры всех изображений по умолчанию.
// @description:es	Obliga a Google Image Search a mostrar tamaños para todas las imágenes de forma predeterminada.
// @namespace		iamMG
// @license			MIT
// @version			2.2
// @icon			https://i.imgur.com/Xy9vHSR.png
// @include         /http(s)?:\/\/(www\.)?google\.(com|ad|ae|com.af|com.ag|com.ai|al|am|co.ao|com.ar|as|at|com.au|az|ba|com.bd|be|bf|bg|com.bh|bi|bj|com.bn|com.bo|com.br|bs|bt|co.bw|by|com.bz|ca|cd|cf|cg|ch|ci|co.ck|cl|cm|cn|com.co|co.cr|com.cu|cv|com.cy|cz|de|dj|dk|dm|com.do|dz|com.ec|ee|com.eg|es|com.et|fi|com.fj|fm|fr|ga|ge|gg|com.gh|com.gi|gl|gm|gp|gr|com.gt|gy|com.hk|hn|hr|ht|hu|co.id|ie|co.il|im|co.in|iq|is|it|je|com.jm|jo|co.jp|co.ke|com.kh|ki|kg|co.kr|com.kw|kz|la|com.lb|li|lk|co.ls|lt|lu|lv|com.ly|co.ma|md|me|mg|mk|ml|com.mm|mn|ms|com.mt|mu|mv|mw|com.mx|com.my|co.mz|com.na|com.nf|com.ng|com.ni|ne|nl|no|com.np|nr|nu|co.nz|com.om|com.pa|com.pe|com.pg|com.ph|com.pk|pl|pn|com.pr|ps|pt|com.py|com.qa|ro|ru|rw|com.sa|com.sb|sc|se|com.sg|sh|si|sk|com.sl|sn|so|sm|sr|st|com.sv|td|tg|co.th|com.tj|tk|tl|tm|tn|to|com.tr|tt|com.tw|co.tz|com.ua|co.ug|co.uk|com.uy|co.uz|com.vc|co.ve|vg|co.vi|com.vn|vu|ws|rs|co.za|co.zm|co.zw|cat)\/.+/
// @author			iamMG
// @run-at			document-start
// @grant			none
// @copyright		2019, iamMG (https://openuserjs.org/users/iamMG)
// @downloadURL https://update.greasyfork.org/scripts/41059/Google%20Search%20-%20Always%20Show%20Image%20Size.user.js
// @updateURL https://update.greasyfork.org/scripts/41059/Google%20Search%20-%20Always%20Show%20Image%20Size.meta.js
// ==/UserScript==

(function() {
    'use strict';
	if (/&tbm=isch/.test(location.search) && !/&tbs=imgo:1/.test(location.search) && !/&tbs=simg:/.test(location.search)) window.location+="&tbs=imgo:1";
})();