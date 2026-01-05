// ==UserScript==
// @name           MZScript© | por cCc vAdEr & Serbini Ini
// @namespace	     https://greasyfork.org/scripts/1752-mzscript-por-ccc-vader-serbini-ini
// @description    Características y funcionalidades extras para el sitio de ManagerZone
// @include        http*://*managerzone.*
// @grant          none
// @version        3.3.r
// @copyright      Copyleft(c) 2010-2018, c_c - serbocapo
// @authors        c_c (c_c_managerzone@yahoo.com) | serbocapo (serbocapo@managerzone.com)
// @credits	       some icons are by Yusuke Kamiyamane [http://p.yusukekamiyamane.com/]
// @downloadURL https://update.greasyfork.org/scripts/1752/MZScript%C2%A9%20%7C%20por%20cCc%20vAdEr%20%20Serbini%20Ini.user.js
// @updateURL https://update.greasyfork.org/scripts/1752/MZScript%C2%A9%20%7C%20por%20cCc%20vAdEr%20%20Serbini%20Ini.meta.js
// ==/UserScript==

function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
  script.addEventListener('load', function () {
    var script = document.createElement("script");
    script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}
addJQuery(mzscript);

function mzscript() {
  (function () {
    var dominios = ['ar', 'at', 'biz', 'bo', 'br', 'ch', 'cl', 'co', 'com', 'cr', 'cz', 'de', 'dk', 'do', 'ec', 'edu', 'es', 'eu', 'fm', 'fr', 'gb', 'gov', 'gr', 'gt', 'hn', 'hr', 'ie', 'info', 'int', 'it', 'jobs', 'lt', 'lv', 'ly', 'mx', 'mz', 'net', 'ni', 'org', 'pa', 'pe', 'pl', 'pr', 'pt', 'py', 'ro', 'ru', 'sv', 'se', 'th', 'tk', 'tn', 'to', 'tr', 'tv', 'tz', 'uk', 'us', 'uy', 've', 'vg', 'xxx', 'yu', 'zw'];
    var etiqOut = ['a', 'applet', 'area', 'embed', 'frame', 'frameset', 'head', 'iframe', 'img', 'map', 'meta', 'noscript', 'object', 'option', 'param', 'script', 'select', 'style', 'textarea', 'title'];
    var inArray = function (value, items) {
      for (var i = 0; items[i] && value != items[i]; i++)
        ;
      return value == items[i];
    }
    var regExp = /(^|[\s()\[\]_:~+@*"'>])((?:https?|ftp|irc):\/\/)?([-a-z\d;:&=+$,%_.!~*'()]+@)?((?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:(www|irc|ftp)\.)?(?:(?:[a-z\d]|[a-z\d][a-z\d-]*[a-z\d])\.)+([a-z]{2,6}))(:\d+)?(\/(?:[-\w.!~*'()%:@&=+$,;\/]*[\w~*%@&=+$\/])?(?:\?(?:[-\w;\/?:@&=+$,.!~*'()%\[\]|]*[\w\/@&=+$~*%])?)?(?:#(?:[-\w;\/?:@&=+$,.!~*'()%]*[\w\/@&=+$~*%])?)?|\b)/i
    var conteadorL = 0;
    var docAct = document.body;
    while (docAct) {
      if (docAct.nodeName == '#text' && (match = docAct.nodeValue.match(regExp)) && inArray(match[6], dominios)) {
        var url;
        if (match[3] && !match[2] && !match[5] && !match[8] && (match[3].indexOf(':') == -1 || match[3].indexOf('mailto:') == 0)) {
          url = (match[3].indexOf('mailto:') == -1 ? 'mailto:' : '') + match[3] + match[4];
        } else {
          url = (match[2] ? match[2] : (!match[5] || match[5] == 'www' ? 'http' : match[5]) + '://') + (match[3] ? match[3] : '') + match[4] + (match[7] ? match[7] : '') + (match[8] ? match[8] : '');
        }
        if (url) {
          var range = document.createRange();
          range.setStart(docAct, match.index + match[1].length);
          range.setEnd(docAct, match.index + match[0].length);
          var a = document.createElement('a');
          a.setAttribute('href', url);
          a.appendChild(range.extractContents());
          range.insertNode(a);
          range.detach();
          conteadorL++;
        }
      }
      if (docAct.tagName && !inArray(docAct.tagName.toLowerCase(), etiqOut) && docAct.firstChild) {
        docAct = docAct.firstChild;
      } else if (docAct.nextSibling) {
        docAct = docAct.nextSibling;
      } else {
        do {
          docAct = docAct.parentNode;
        } while (!docAct.nextSibling && docAct.parentNode);
        docAct = docAct.nextSibling;
      }
    }
  })();
  (function () {
    var css = "#body.body_mz,div.win_back,#win_bg,div.news_item,.odd{background-image:url(http://static.managerzone.com/img/windowbg.gif)!important;}.subnavhr{height:2px!important;}.even{background-color:#c0c0c0!important;}.age_restricted_game{background-color:#d6db93!important;border-top:solid 1px #000015!important;border-bottom:solid 1px #000015!important;}.age_restricted_game_secondary{background-color:#8ecf8b!important;border-top:solid 1px #000015!important;border-bottom:solid 1px #000015!important;}.mPoint{float:left;height:6px;margin-right:3px;margin-top:5px;width:6px;}.amar{background-color:#FF0}.black{background-color:#000}a.ctooltip span {display:none; padding:2px 3px; margin-left:8px; width:290px;}a.ctooltip:hover span{display:inline; position:absolute; z-index:1000; margin-top:-190px; border:1px solid #000000; background:#C4D1E4; color:#6c6c6c; border-radius:6px;}a.ctooltip2 span {/*display:none;*/ padding:2px 3px; margin-left:120px;margin-top:-33px;width:290px;}.divVisible{display:block;}.divHidden {display:none;}.cursor{cursor:pointer;}#link, #pe, #error {display: none}.forum_topic_last_post a{color:#990000!important;}.tdStyle{color:#FFF;font-weight:bold}.buttondiv{position:static}.fbtn{width:188px}.cursor{cursor:pointer}#jugador{width:20px}#jugador img{display:block;margin:auto}#jug{padding:15px}#close{padding:3px}.impTabla td {color:#FFF;font-weight:bold;padding:5px}.impTabla td input[type='radio']{float:right}.cuadros{display:none;color:#FFF;padding:8px 0;width:100%}.mzs{border:0;padding:3px;border-radius:2px;color:#FFF;font-weight:bold;cursor:pointer}.tJug{float:right}.cInput{margin-top:-2px;float:left}#notifications-wrapper > a{width:17px!important;margin: 0 3px -4px;}#header-stats-wrapper{width:370px}#stripes{margin: -8px auto 10px;padding: 5px 0}#fluid-menu-opener > div.sport-line, #top-wrapper-sport-line{background: #5d5b5f none repeat scroll 0 0}.quicklink{background-color:#4A4A4A;border-radius:4px;box-shadow:0 0 1px 0 #000;color:#FFF;display:inline-block;margin-left:4px;padding:2px 4px;text-decoration:none;}.quicklink:hover{background-color: #000000;box-shadow: 0 0 2px 0 #000000;color: #FFFFFF;text-decoration: none;}.quicklinks{padding:0 4px 8px;text-align:center}#notifications-wrapper{bottom: -2px}.atajoExtInt{padding-top:10px}#pt-wrapper{bottom:5.4em!important}.externalSc{margin-top:-10px;margin-bottom:2px}#contImpuestos{clear:both}table.playerTableC td{background-color: transparent!important;border: 0 none!important};";
    if (typeof GM_addStyle != "undefined") {
      GM_addStyle(css);
    } else if (typeof PRO_addStyle != "undefined") {
      PRO_addStyle(css);
    } else if (typeof addStyle != "undefined") {
      addStyle(css);
    } else {
      var heads = document.getElementsByTagName("head");
      if (heads.length > 0) {
        var node = document.createElement("style");
        node.type = "text/css";
        node.appendChild(document.createTextNode(css));
        heads[0].appendChild(node);
      }
    }
  })();
  function collapseExpand(divs) {
    var divObject = document.getElementById(divs);
    if (divObject.className == "divVisible") {
      divObject.className = "divHidden";
    } else {
      divObject.className = "divVisible";
    }
  }
  atajoForo('p=forum&sub=topics&forum_id=254&sport=soccer', 'MER', 'Ir a Mercado', 0);
  atajoForo('p=forum&sub=topics&forum_id=249&sport=soccer', 'AMI', 'Ir a Amistosos', 1);
  atajoForo('p=forum&sub=topics&forum_id=253&sport=soccer', 'MZH', 'Ir a MZ Habla', 1);
  atajoForo('p=forum&sub=topics&forum_id=255&sport=soccer', 'PYR', 'Ir a Preguntas y Respuestas', 1);
  atajoForo('p=forum&sub=topics&forum_id=250&sport=soccer', 'DA', 'Ir a Discusión Abierta', 1);
  atajoForo('p=forum&sub=topics&forum_id=251&sport=soccer', 'FED', 'Ir a Federaciones', 1);
  atajoExtInt('http://i.imgur.com/7Uttzyv.gif', '?p=transfer&sub=yourplayers', 'Ir al Monitoreo', 0);
  atajoExtInt('http://i.imgur.com/DRf7WGm.gif', '?p=shortlist', 'Ir a Seguimiento', 1);
  atajoExtInt('http://i.imgur.com/LhtVqWQ.gif', '?p=players&sub=alt', 'Ver Vista Alternativa', 1);
  atajoExtInt('http://i.imgur.com/gG2hhct.gif', 'http://www.mzplus.info/p', 'Ir al Skiller', 1);
  atajoExtInt('http://i.imgur.com/G40I9gQ.gif', 'http://imgur.com/', 'Ir a Imgur', 1);
  atajoExtInt('http://i.imgur.com/V1vgq9d.gif', '?p=economy', 'Ver Finanzas', 1);
  atajoExtInt('http://i.imgur.com/jzbCTLE.gif', '?p=transfer', 'Ver Mercado', 1);
  atajoExtInt('http://i.imgur.com/eqx7dq1.gif', 'http://www.mzplus.info/tax', 'Calcular Impuestos', 1);
  atajoExtInt('http://i.imgur.com/TzYBzYW.gif', '?p=match&sub=played', 'Ver los Partidos Jugados', 1);
  atajoExtInt('http://i.imgur.com/p7ZMKSw.gif', '?p=match&sub=scheduled', 'Ver los Próximos Partidos', 1);
  atajoExtInt('http://i.imgur.com/1hvSw7g.gif', '?p=tactics&myTactic=1', 'Ir a Tácticas', 1);
  atajoExtInt('http://i.imgur.com/v3RoRU6.gif', '?p=players&sub=unavailable', 'Ver Lesionados/Sancionados', 1);
  atajoExtInt('http://i.imgur.com/K3PXtyE.gif', '?p=training_report', 'Ver el Reporte de Entrenamiento', 1);
  atajoExtInt('http://i.imgur.com/1qQmgOp.gif', '?p=training', 'Ir al Entrenamiento General', 1);
  var url = window.location.href.split("=");
  var cid = url[3];
  if (url[1] == "private_cup&sub" || url[1] == "cup&sub" || (url[2] == "u18" || url[2] == "u21" || url[2] == "u23" || url[2] == "world" || url[2] == "u18_world")) {
    var cp = (url[1] == "private_cup&sub") ? 1 : 0;
    var extraMundial = (url[2] == "u18" || url[2] == "u21" || url[2] == "u23" || url[2] == "world" || url[2] == "u18_world") ? 1 : 0;
    var id = cp ? 'mostrarTabla3' : extraMundial ? 'mostrarTabla2' : 'mostrarTabla';
    var setterCountry;
    $('#ui-id-4').click(function () {
      setterCountry = setInterval(function () {
        divCountry();
        verProgMatch(cid, cp);
        addBtnMostrarTabla(id);
      }, 1000);
    });
    if (extraMundial) {
      setterCountry = setInterval(function () {
        addBtnMostrarTabla(id);
      }, 1000);
    }
  }
  function addBtnMostrarTabla(id) {
    var groupContainer = $(".nice_table thead tr.seriesHeader")[0];
    if (typeof groupContainer !== 'undefined') {
      clearInterval(setterCountry);
      var iconMostrarTabla = "<img src='http://i.imgur.com/B69WEGD.png' id='" + id + "' class='cursor' title='Compartir tabla' />";
      var thContainer = groupContainer.childNodes[1];
      thContainer.innerHTML = iconMostrarTabla;
    }
  }
  function verProgMatch(cid, cp) {
    var equipos = $(".nice_table tbody > tr");
    var filas = equipos.length;
    var tid = 0, fila, i, hrefN;
    for (i = 0; i < filas; i++) {
      fila = equipos[i].cells[1];
      tid = fila.childNodes[0].href.split("&")[1].replace("tid=", "");
      if (cp)
        hrefN = "?p=private_cup&sub=schedule&cid=" + cid.toString() + "&tid=" + tid.toString() + "&cuptype=partner";
      else
        hrefN = "?p=cup&sub=schedule&cid=" + cid.toString() + "&tid=" + tid.toString();
      var fixt = document.createElement("span");
      fixt.setAttribute('style', 'float:right');
      fixt.innerHTML = '<a href="' + hrefN + '" target="_blank" title="Ver Programa de Partidos"><img src="http://i.imgur.com/ECRix0U.png" /></a>';
      fila.appendChild(fixt);
    }
  }
  function divCountry() {
    var groupContainer = $('#group-stages');
    if (typeof groupContainer !== 'undefined') {
      clearInterval(setterCountry);
      var tablaHeader = $(".nice_table thead tr.seriesHeader")[0];
      var icon = tablaHeader.childNodes[3];
      var addIcon = document.createElement("img");
      addIcon.setAttribute('src', 'http://i.imgur.com/IwaQRmF.png');
      addIcon.setAttribute('style', 'float:right;cursor:pointer');
      addIcon.setAttribute('title', 'Ver división y país');
      addIcon.setAttribute('id', 'divCountry');
      icon.appendChild(addIcon);
      var flag = false;
      $("#divCountry").click(function () {
        if (!flag) {
          flag = true;
          $(".team_link").parent().width("35%");
          $(".nice_table").css('border-right', '1px solid #BBBBBB');
          $(".nice_table").css('border-bottom', '1px solid #BBBBBB');
          var header = tablaHeader.childNodes[4];
          var headerNew = document.createElement("th");
          headerNew.setAttribute('id', 'divCountryC');
          headerNew.innerHTML = "Div - País";
          header.parentNode.insertBefore(headerNew, header);
          var equipos = $(".nice_table tbody > tr");
          var filas = equipos.length;
          var equipoId = 0, fila, i;
          for (i = 0; i < filas; i++) {
            fila = equipos[i];
            equipoId = fila.cells[1].childNodes[0].href.split("&")[1].replace("tid=", "");
            xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", "/xml/manager_data.php?sport_id=1&team_id=" + equipoId.toString(), false);
            xmlhttp.send();
            xmlDoc = xmlhttp.responseXML;
            var divNum = xmlDoc.getElementsByTagName("Team")[0].getAttribute('seriesName');
            var country = xmlDoc.getElementsByTagName("UserData")[0].getAttribute('countryShortname');
            var newCell = document.createElement("td");
            newCell.innerHTML = divNum + " - " + country;
            var place = fila.cells[2];
            place.parentNode.insertBefore(newCell, place);
          }
        }
      });
    }
  }
  var url = window.location.href.split('=');
  if (url[1] == "training_report") {
    var flag = 1;
    if (flag) {
      var setter = setInterval(function () {
        trainingBalls();
      }, 1000);
    }
    function trainingBalls() {
      var container = document.getElementById("training_report");
      if (container == null) {
        clearInterval(setter);
      }
      if (container.childElementCount > 0 && flag) {
        flag = 0;
        var tbody = container.childNodes[2].childNodes[3];
        var I, totalP = tbody.rows.length;
        for (I = 0; I < totalP; I++) {
          // if (container.childNodes[I].innerHTML != undefined) {
          var finalContainer = tbody.rows[I].cells[4].childNodes[0];
          var numBalls = document.createElement('span');
          numBalls.setAttribute("style", "float:right; font-weight: bold");
          numBalls.innerHTML = '(' + finalContainer.childElementCount + ')';
          finalContainer.appendChild(numBalls);
          finalContainer.style.width = '125px';
          //  }
        }
      }
    }
  }
  var url = window.location.href.split('=');
  if (url[1] == "transfer") {
    var stats = document.getElementById("transfer_stats");
    var general = document.getElementById("general_search");
    var atri = document.getElementById("attributes_search");
    var filter = document.getElementById("filters_search");
    stats.style.display = "none";
    general.style.display = "none";
    atri.style.display = "none";
    filter.style.display = "none";
  }
  var url2 = window.location.href.split('&');
  if (url2[1] == "sub=players") {
    var stats = document.getElementById("transfer_stats");
    var search = document.getElementById("transfer_search");
    stats.style.display = "none";
    search.style.display = "none";
  }
  function crearFirma() {
    var guardando = document.getElementById("areaFirma").value;
    guardando = guardando.replace(/^(\s|\&nbsp;)*|(\s|\&nbsp;)*$/g, "");
    if (guardando == '' || guardando == null || guardando.lenght == 0) {
      alert("No ha ingresado firma");
      return false;
    } else {
      var armando = '\n\n\n\n\n\n\n' + '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬' + '\n' + guardando;
      localStorage.setItem('firmaMZ', armando);
      alert("Su firma se ha creado exitosamente");
    }
  }
  function mostrarFirma() {
    var cFirma = localStorage.getItem('firmaMZ');
    if (cFirma == null || cFirma == '') {
      alert("No tiene ninguna firma creada");
      return false;
    }
    var url = window.location.href.split('=');
    var area = "message"
    obj = document.getElementsByName(area)[0];
    var textoActual = obj.value;
    obj.value = textoActual + cFirma;
  }
  function firmaSiempre() {
    var firmasi = document.getElementById('mostrarY').checked;
    localStorage.setItem('mostrar', firmasi);
  }
  function firmaCont(tabla) {
    var filaFirma = tabla.insertRow(5);
    var firmaBar = "<td></td><td><div class='mzbtn buttondiv button_account' title='Crear Firma'><span class='buttonClassMiddle'><span style='white-space: nowrap' id='boton3'>Crear Firma</span></span><span class='buttonClassRight'>&nbsp;</span></div>&nbsp;";
    firmaBar += "<div class='mzbtn buttondiv button_account' title='Crear Firma'><span class='buttonClassMiddle'><span style='white-space: nowrap' id='btnMostrar'>Mostrar Firma</span></span><span class='buttonClassRight'>&nbsp;</span></div>&nbsp;";
    firmaBar += "<b>Mostrar firma siempre?</b> <input type='checkbox' title='Mostrar Firma Siempre' alt='Mostrar Firma' id='mostrarY'><br />";
    firmaBar += "<div id='divFirma' class='divHidden'><img src='http://i915.photobucket.com/albums/ac355/ccc_vader/botones/imagen2_btn2.png' title='Insertar imagen' alt='Insertar img' id='btni'/>&nbsp;";
    firmaBar += "<img src='http://i915.photobucket.com/albums/ac355/ccc_vader/botones/negrita_btn2.png' title='Negrita' alt='Negrita' id='btnn'/>&nbsp;";
    firmaBar += "<img src='http://i915.photobucket.com/albums/ac355/ccc_vader/botones/cursiva_btn2.png' title='Cursiva' alt='Cursiva' id='btnc'/>&nbsp;";
    firmaBar += "<img src='http://i915.photobucket.com/albums/ac355/ccc_vader/botones/subra_btn2.png' title='Subrayado' alt='Subrayado' id='btns'/><br />";
    firmaBar += "<textarea id='areaFirma' name='areaFirma' rows='5' cols='50'></textarea><br />";
    firmaBar += "<img src='http://i915.photobucket.com/albums/ac355/ccc_vader/bot/btn_save.gif' title='Guardar Firma' alt='Guardar firma' id='btnFirma' class='cursor' /></div></td>";
    filaFirma.innerHTML = filaFirma.innerHTML + firmaBar;
  }
  function firmaFija() {
    var mostrarsi = localStorage.getItem('mostrar');
    if (mostrarsi == 'true') {
      var area = "forum_form_message";
      var posteo = document.getElementById(area);
      posteo.innerHTML = posteo.innerHTML + mostrarFirma();
    }
  }
  function upload(file) {
    if (!file || !file.type.match(/image.*/)) {
      document.getElementById("error").style.display = "block";
      document.getElementById("pe").style.display = "none";
      document.getElementById("link").style.display = "none";
    } else {
      document.getElementById("pe").style.display = "block";
      document.getElementById("link").style.display = "none";
      document.getElementById("error").style.display = "none";
      var fd = new FormData();
      fd.append("image", file);
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "https://api.imgur.com/3/upload.json");
      if (ext != null) {
        var ext = document.getElementById("subidor").value;
        var parte = ext.split(".");
      } else {
        var ext = file.name;
        var parte = ext.split(".");
      }
      xhr.onload = function () {
        document.getElementById("error").style.display = "none";
        document.getElementById("pe").style.display = "none";
        document.getElementById("link").style.display = "block";
        var xts = parte[1];
        if (xts == 'bmp' || xts == 'tiff')
          xts = 'png';
        var parseresp = JSON.parse(xhr.responseText);
        var imgUrl = parseresp.data.link;
        document.querySelector("#link").innerHTML = "<a href='" + imgUrl + "'>" + imgUrl + "</a>";
      }
      xhr.setRequestHeader('Authorization', 'Client-ID 4306d20a28c0e7a');
      xhr.send(fd);
    }
  }
  function preventDef(event) {
    event.preventDefault();
  }
  function uploadImage(event) {
    upload(event.dataTransfer.files[0]);
  }
  function subirImagen() {
    var estilo = document.getElementById("contenedor").style.display;
    if (estilo == 'none' && window.opera) {
      document.getElementById("contenedor").innerHTML = "<span style='color:red;padding:3px'> Opera no soporta la posibilidad de subir imágenes directamente. <br /><span style='color:green'>&nbsp;Firefox sí, apoya una web libre! <a href='https://affiliates.mozilla.org/link/banner/12520/3/18'><img src='http://affiliates-cdn.mozilla.org/media/uploads/banners/download-small-blue-ES.png' class='cursor' /></a></span></span>";
      document.getElementById("contenedor").style.display = "block";
    } else if (estilo == 'none') {
      document.getElementById("contenedor").style.display = "block";
    } else {
      document.getElementById("contenedor").style.display = "none";
    }
  }
  function armaCodigo(tag, cubo) {
    obj = document.getElementsByName(cubo)[0];
    var scroll = obj.scrollTop;
    var inicio = obj.selectionStart;
    var fin = obj.selectionEnd;
    obj.value = obj.value.substr(0, inicio) + '[' + tag + ']' + obj.value.substr(inicio, fin - inicio) + '[/' + tag + ']' + obj.value.substr(fin, obj.value.length);
    obj.scrollTop = scroll;
  }
  function addImagen(caja) {
    var imagen = prompt('Ingrese URL/link de la imagen');
    var intentos = 0;
    var preUrl = '[image url=';
    var posUrl = ']';
    var rtdo = '';
    var obj = document.getElementsByName(caja)[0];
    var scroll = obj.scrollTop;
    var inicio = obj.selectionStart;
    var fin = obj.selectionEnd;
    if (imagen != '') {
      img = new Image();
      img.src = imagen;
      if ((img.height == 0) || (img.width == 0)) {
        while (!((img.height == 0) || (img.width == 0)) && intentos < 5) {
          for (pausa = 0; pausa < 100; pausa++) {
          }
          img.src = imagen;
        }
      }
      if ((img.height == 0) || (img.width == 0)) {
        alert('El link/URL: ' + imagen + ' no es una imagen, y no será convertido.');
      } else {
        rtdo += preUrl + imagen + posUrl;
        obj.value = obj.value.substr(0, inicio) + rtdo + obj.value.substr(fin, obj.value.length);
      }
    }
    obj.scrollTop = scroll;
  }
  function posteaIcono(url, area) {
    var obj = document.getElementsByName(area)[0];
    var scroll = obj.scrollTop;
    var inicio = obj.selectionStart;
    var fin = obj.selectionEnd;
    obj.value = obj.value.substr(0, inicio) + '[image url=' + url + ']' + obj.value.substr(fin, obj.value.length);
    obj.scrollTop = scroll;
  }
  function posteaTabla(area) {
    var dato = prompt('Ingrese el usuario para la liga oficial o el ID de la liga amistosa');
    var obj = document.getElementsByName(area)[0];
    var scroll = obj.scrollTop;
    var inicio = obj.selectionStart;
    var fin = obj.selectionEnd;
    if (dato == '') {
      alert('No ha ingresado correctamente el usuario/id. Vuelva a intentarlo, por favor.');
    } else if (dato == null) {
      return false;
    } else if (isNaN(dato) == true) {
      obj.value = obj.value.substr(0, inicio) + '[image url=http://www.mzplus.info/imgdin_liga?user=' + dato + ']' + obj.value.substr(fin, obj.value.length);
    } else {
      obj.value = obj.value.substr(0, inicio) + '[image url=http://www.mzplus.info/imgdin_liga?user=&idla=' + dato + ']' + obj.value.substr(fin, obj.value.length);
    }
    obj.scrollTop = scroll;
  }
  function mostrarTabla(which) {
    var tabla = document.getElementById("divTabla");
    if (tabla) {
      collapseExpand("divTabla");
      return false;
    }
    var tablaDeTorneo = $(".nice_table tbody > tr");
    var controlDiv = document.getElementById("divCountryC");
    var header;
    if (controlDiv)
      header = "<i>[table][th][/th][th]Equipo[/th][th]Div - País[/th][th]PJ[/th][th]PG [/th][th]PE[/th][th]PP[/th][th]GF[/th][th]GC [/th][th]=[/th][th]Pts[/th]";
    else
      header = "<i>[table][th][/th][th]Equipo[/th][th]PJ[/th][th]PG [/th][th]PE[/th][th]PP[/th][th]GF[/th][th]GC [/th][th]=[/th][th]Pts[/th]";
    var armarLineas = "<div style='font-weight:normal'><b>Tabla - copiar todo el texto</b> <img src='http://i.imgur.com/BzYADnz.png' id='cerrar' style='float:right' class='cursor' title='Cerrar' /><br /> <br />" + header;
    var tablaDeTorneoL = tablaDeTorneo.length;
    for (var line = 0; line < tablaDeTorneoL; line++) {
      var trs = tablaDeTorneo[line];
      if (trs.cells[0].childNodes[0].tagName != "IMG") {
        armarLineas += "[tr][td]" + trs.cells[0].textContent + "[/td][td]" + trs.cells[1].textContent + "[/td][td]" + trs.cells[2].textContent + "[/td][td]";
        armarLineas += trs.cells[3].textContent + "[/td][td]" + trs.cells[4].textContent + "[/td][td]" + trs.cells[5].textContent + "[/td][td]";
        armarLineas += trs.cells[6].textContent + "[/td][td]" + trs.cells[7].textContent + "[/td][td]" + trs.cells[8].textContent + "[/td][td]";
        armarLineas += trs.cells[9].textContent + "[/td]";
        if (controlDiv)
          armarLineas += "[td]" + trs.cells[10].textContent + "[/td]";
        armarLineas += "[/tr]";
      }
    }
    armarLineas += "[/table]</i></div>";
    var divContenedora = document.createElement('div');
    divContenedora.setAttribute('id', 'divTabla');
    divContenedora.setAttribute('style', 'z-index:10; position:absolute; background-color:#000; color:#FFF; width:450px; height: auto; padding:10px;');
    divContenedora.setAttribute('class', 'divVisible');
    divContenedora.innerHTML = armarLineas;
    if (which == 'copa') {
      posTabla = document.evaluate('//*[@id="mostrarTabla"]', document, null, XPathResult.ANY_TYPE, null);
    } else if (which == 'privada') {
      posTabla = document.evaluate('//*[@id="mostrarTabla3"]', document, null, XPathResult.ANY_TYPE, null);
    } else {
      posTabla = document.evaluate('//*[@id="mostrarTabla2"]', document, null, XPathResult.ANY_TYPE, null);
    }
    ins = posTabla.iterateNext();
    ins.parentNode.insertBefore(divContenedora, ins);
  }
  var flagR = false;
  function verResultados() {
    try {
      if (flagR) {
        alert("No hay nada para cargar. Gracias, vuelva prontos!")
        return;
      }
      flagR = true;
      $("#fixtures-results-list > dd").each(function (idx, elm) {
        var elem = $(elm);
        var elemBtns = elem.find('dl.action-panel a');
        console.log('elemBtns', elemBtns);
        var enJuego = elemBtns.length;
        console.log('elemBtns length', elemBtns.length);
        if (idx > 0 && typeof (elemBtns[0]) === "undefined")
          return false;
        if (enJuego > 2) {
          var idMatch = elemBtns[0].href.split('&')[3].split('=')[1];
          xmlhttp = new XMLHttpRequest();
          xmlhttp.open("GET", "/xml/match_info.php?sport_id=1&match_id=" + idMatch.toString(), false);
          xmlhttp.send();
          xmlDoc = xmlhttp.responseXML;
          var gol1 = xmlDoc.getElementsByTagName("Team")[0].getAttribute('goals');
          var gol2 = xmlDoc.getElementsByTagName("Team")[1].getAttribute('goals');
          var res = document.createElement('div');
          res.setAttribute('style', 'float:right; font-weight: bold;padding-left: 3px');
          res.setAttribute('id', 'visible');
          res.innerHTML = gol1;
          var res2 = document.createElement('div');
          res2.setAttribute('style', 'float:left; font-weight: bold;padding-right: 3px');
          res2.innerHTML = gol2;
          elem.find('dd.home-team-column > a.clippable').before(res);
          elem.find('dd.away-team-column img').before(res2);
        }
      });
    } catch (e) {
      console.log(e);
    }
  }
  var url = window.location.href.split('&');
  if (url[1] == "sub=scheduled") {
    var container = document.getElementById('matchListForm').childNodes[1];
    var btnRes = document.createElement('div');
    btnRes.setAttribute('style', 'float:right;cursor:pointer;border:2px solid #2A4CB0;width:20px;height:20px;padding:4px 0 0 4px;margin:2px 165px 0 0');
    btnRes.setAttribute('id', 'btnRes');
    btnRes.innerHTML = "<img src='http://i.imgur.com/WL38HPq.png' title='Ver resultados' />";
    container.appendChild(btnRes);
    document.getElementById("btnRes").addEventListener("click", verResultados, false);
  }
  function saveCu() {
    var radioButtons = document.getElementsByName("moneda");
    for (var i = 0; i < radioButtons.length; i++) {
      if (radioButtons[i].checked) {
        var moneda = radioButtons[i].value;
        if (moneda != null) {
          localStorage.setItem('moneda', moneda);
          switch (moneda) {
            case "4":
              localStorage.setItem('sigla', 'UYU');
              break;
            case "13":
              localStorage.setItem('sigla', 'MXN');
              break;
            case "15":
              localStorage.setItem('sigla', 'BOB');
              break;
          }
          alert("Opción Moneda guardada");
          collapseExpand("divTabla");
          return false;
        }
      }
    }
    alert("No ha seleccionado ninguna opción");
  }
  function saveTact() {
    var radioButtons = document.getElementsByName("tactica");
    for (var i = 0; i < radioButtons.length; i++) {
      if (radioButtons[i].checked) {
        var tactica = radioButtons[i].value;
        if (tactica != null) {
          localStorage.setItem('tactica', tactica);
          alert("Opción Táctica guardada");
          collapseExpand("divTabla");
          return false;
        }
      }
    }
    alert("No ha seleccionado ninguna opción");
  }
  function resetCu() {
    localStorage.removeItem("moneda");
    localStorage.removeItem("sigla");
    alert("Moneda reseteada a USD");
    collapseExpand("divTabla");
    return false;
  }
  function setearMoneda() {
    var tabla = document.getElementById("divTabla");
    if (tabla) {
      collapseExpand("divTabla");
      return false;
    }
    var divContenedora = document.createElement('div');
    divContenedora.setAttribute('id', 'divTabla');
    divContenedora.setAttribute('style', 'z-index:10;position:absolute;background-color:#000;color:#FFF;width:165px;height:auto;padding:10px;border:2px solid red');
    divContenedora.setAttribute('class', 'divVisible');
    divContenedora.innerHTML = "<img src='http://i.imgur.com/BzYADnz.png' id='cerrar' style='float:right' class='cursor' title='Cerrar' /><table align='center'><tr><td class='tdStyle' colspan='2' style='font-size:13px'>Moneda local</td></tr><tr><td class='tdStyle tJug'>MXN </td><td><input type='radio' value='13' name='moneda' class='cInput' /></td><tr><td class='tdStyle tJug'>UYU </td><td> <input type='radio' value='4' name='moneda' class='cInput' /></td></tr><tr><td class='tdStyle tJug'>BOB  </td><td><input type='radio' value='15' name='moneda' class='cInput' /></td></tr><tr><td style='padding-top:10px' colspan='2'><button id='saveCu' class='mzbtn button_account mzs'>Guardar</button>&nbsp;<button id='resetCu' class='mzbtn button_account mzs'>Reset</button></td></tr></table>";
    divContenedora.innerHTML += "<br /> <table align='center'><tr><td colspan='2' class='tdStyle' style='font-size:13px'>Mostrar táctica</td></tr><tr><td class='tdStyle tJug'>Vertical  </td><td><input type='radio' name='tactica' value='1'  class='cInput' /></td></tr><tr><td class='tdStyle tJug'>Horizontal </td><td><input type='radio' name='tactica' value='0' class='cInput' /></td></tr><tr><td colspan='2' style='padding-top:10px'><button id='saveTact' class='mzbtn button_account mzs'>Guardar</button></td></tr></table><span style='font-style:italic;font-size:11px;float:right'>MZScript ©</span>";
    var ins = document.getElementById("contentDiv");
    ins.parentNode.insertBefore(divContenedora, ins);
    document.getElementById("saveCu").addEventListener("click", saveCu, false);
    document.getElementById("resetCu").addEventListener("click", resetCu, false);
    document.getElementById("saveTact").addEventListener("click", saveTact, false);
  }
  var url = window.location.href.split('&');
  if (url[1] == "sub=played" && typeof url[2] == "undefined" || url[1] == "sub=played" && url[2] == "hidescore=1") {
    var container = document.getElementById('matchListForm').childNodes[1];
    var btnMon = document.createElement('div');
    btnMon.setAttribute('style', 'float:right;cursor:pointer;border:2px solid #2A4CB0;width:20px;height:20px;padding:4px 0 0 4px;margin:2px 165px 0 0');
    btnMon.setAttribute('id', 'btnMon');
    btnMon.innerHTML = "<img src='http://i.imgur.com/wU57xHb.png' title='Setear moneda y táctica' />";
    container.appendChild(btnMon);
    document.getElementById("btnMon").addEventListener("click", setearMoneda, false);
  }
  function convertir(valorP, origen) {
    var alsek = new Array(7.4234, 9.1775, 1, 1, 0.256963, 2.62589, 13.35247, 1.23522, 1.07245, 5.86737, 5.70899, 5.66999, 1.6953, 0.68576, 2.64445, 0.939, 0.001309, 0.26313, 1.95278, 0.10433, 4.70738, 1.23733, 7.4234, 0.17079, 0.03896, 0.24946, 0.06, 0.17, 1);
    var valor_origen = valorP;
    var enseks = 1 / alsek[origen];
    var cMoneda = localStorage.getItem('moneda');
    if (cMoneda) {
      v = Math.round(1 / alsek[cMoneda] * valor_origen / enseks);
    } else {
      v = Math.round(1 / alsek[0] * valor_origen / enseks);
    }
    return v;
  }
  function getValues(idUno, idDos) {
    var cont = 0, pos, teamId, sport, index;
    while (cont < 2) {
      var titular = 1;
      if (cont == 0) {
        pos = 1;
        teamId = idUno;
        index = 0;
      } else {
        pos = 2;
        teamId = idDos;
        index = 1;
      }
      if (ajaxSport == 'soccer')
        sport = 1;
      else
        return;
      try {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", "/xml/team_playerlist.php?sport_id=" + sport + "&team_id=" + teamId.toString(), false);
        xmlhttp.send();
        var xmlDoc = xmlhttp.responseXML;
        var tablaDeEquipoHeader = $("#match-statistics .hitlist_wrapper_background table thead")[index];
        if (tablaDeEquipoHeader == null) {
          cont = 2;
          return false;
        }
        var nombre = document.createElement('td');
        nombre.setAttribute('style', 'font-weight: bold;');
        nombre.innerHTML = "Valor MZ";
        var trName = tablaDeEquipoHeader.parentNode.rows[0].cells[0];
        trName.parentNode.insertBefore(nombre, trName);
        var tablaDeEquipoBody = $("#match-statistics .hitlist_wrapper_background table tbody")[index];
        var jugador, total = 0, tablaDeEquipoL = tablaDeEquipoBody.rows.length;
        for (jugador = 1; jugador < tablaDeEquipoL; jugador++) {
          try {
            var celdaControl = tablaDeEquipoBody.rows[jugador].cells[0].childNodes[0].tagName;
            if (celdaControl == 'IMG') {
              tablaDeEquipoBody.rows[jugador].cells[0].colSpan = "13";
            } else if (celdaControl != 'IMG' || typeof celdaControl != "undefined") {
              var celda = tablaDeEquipoBody.rows[jugador].cells[1];
              var idPlayer = celda.childNodes[1].childNodes[1].href.split('&')[1].split('=')[1];
              var totalXml = xmlDoc.getElementsByTagName("Player").length;
              for (var p = 0; p < totalXml; p++) {
                var idP = xmlDoc.getElementsByTagName("Player")[p].getAttribute('id');
                if (idPlayer == idP) {
                  var valorP = xmlDoc.getElementsByTagName("Player")[p].getAttribute('value');
                  var currency = xmlDoc.getElementsByTagName("TeamPlayers")[0].getAttribute('teamCurrency');
                  var cMoneda = localStorage.getItem('moneda');
                  var cSigla = localStorage.getItem('sigla');
                  if ((cMoneda && currency != cSigla) || (!cMoneda && currency != "USD")) {
                    switch (currency) {
                      case "USD":
                        valorP = convertir(valorP, 0);
                        break;
                      case "EUR":
                        valorP = convertir(valorP, 1);
                        break;
                      case "SEK":
                        valorP = convertir(valorP, 2);
                        break;
                      case "MM":
                        valorP = convertir(valorP, 3);
                        break;
                      case "UYU":
                        valorP = convertir(valorP, 4);
                        break;
                      case "R$":
                        valorP = convertir(valorP, 5);
                        break;
                      case "GBP":
                        valorP = convertir(valorP, 6);
                        break;
                      case "DKK":
                        valorP = convertir(valorP, 7);
                        break;
                      case "NOK":
                        valorP = convertir(valorP, 8);
                        break;
                      case "CHF":
                        valorP = convertir(valorP, 9);
                        break;
                      case "CAD":
                        valorP = convertir(valorP, 10);
                        break;
                      case "AUD":
                        valorP = convertir(valorP, 11);
                        break;
                      case "ILS":
                        valorP = convertir(valorP, 12);
                        break;
                      case "MXN":
                        valorP = convertir(valorP, 13);
                        break;
                      case "ARS":
                        valorP = convertir(valorP, 14);
                        break;
                      case "BOB":
                        valorP = convertir(valorP, 15);
                        break;
                      case "PYG":
                        valorP = convertir(valorP, 16);
                        break;
                      case "RUB":
                        valorP = convertir(valorP, 17);
                        break;
                      case "PLN":
                        valorP = convertir(valorP, 18);
                        break;
                      case "ISK":
                        valorP = convertir(valorP, 19);
                        break;
                      case "BGL":
                      case "BGN":
                        valorP = convertir(valorP, 20);
                        break;
                      case "ZAR":
                        valorP = convertir(valorP, 21);
                        break;
                      case "US$":
                        valorP = convertir(valorP, 22);
                        break;
                      case "THB":
                        valorP = convertir(valorP, 23);
                        break;
                      case "SIT":
                        valorP = convertir(valorP, 24);
                        break;
                      case "SKK":
                        valorP = convertir(valorP, 25);
                        break;
                      case "JPY":
                        valorP = convertir(valorP, 26);
                        break;
                      case "INR":
                        valorP = convertir(valorP, 27);
                        break;
                      case "MZ":
                        valorP = convertir(valorP, 28);
                        break;
                    }
                  }
                  var valorCont = document.createElement('td');
                  valorCont.setAttribute('style', 'width:62px;text-align:right;padding-right:15px');
                  valorCont.innerHTML = puntosMiles(valorP);
                  var ins = tablaDeEquipoBody.rows[jugador].cells[0];
                  ins.parentNode.insertBefore(valorCont, ins);
                  if (titular <= 11) {
                    total = total + parseInt(valorP);
                  }
                  titular++;
                  p = xmlDoc.getElementsByTagName("Player").length;
                }
                if (p == (totalXml - 1)) {
                  var valorCont = document.createElement('td');
                  valorCont.setAttribute('style', 'width:62px;text-align:right;padding-right:15px');
                  valorCont.innerHTML = " -";
                  var ins = tablaDeEquipoBody.rows[jugador].cells[0];
                  ins.parentNode.insertBefore(valorCont, ins);
                }
              }
            }
          } catch (e) {
            console.log(e);
          }
        }
        if (typeof idP != "undefined") {
          var trFinal = tablaDeEquipoBody.parentNode.childNodes[5].rows[1].cells[0];
          var empty = document.createElement('div');
          empty.setAttribute('style', 'font-weight:bold;width:65px;text-align:right');
          empty.innerHTML = puntosMiles(total);
          ;
          trFinal.parentNode.insertBefore(empty, trFinal);
          tablaDeEquipoBody.parentNode.childNodes[5].rows[3].cells[0].colSpan = "13";
        }
        cont++;
      } catch (e) {
        console.log(e);
      }
    }
  }
  function puntosMiles(number) {
    number = number.toString();
    var result = "";
    while (number.length > 3) {
      result = "." + number.substr(number.length - 3) + result;
      number = number.substring(0, number.length - 3);
    }
    result = number + result;
    return result;
  }
  var url = window.location.href.split('&');
  if (url[1] == "sub=stats" || url[1] == "sub=result") {
    var teams = $(".team-table").find('a:first');
    var teamOid = teams[0].href.split('&')[1].split('=')[1];
    var teamTid = teams[1].href.split('&')[1].split('=')[1];
    getValues(teamOid, teamTid);
    var tactValue = localStorage.getItem('tactica');
    if (tactValue == 1) {
      var css = "#tactic-board > img {margin-bottom: 0px;margin-top: 0px;transform: none;}";
      var heads = document.getElementsByTagName("head");
      if (heads.length > 0) {
        var node = document.createElement("style");
        node.type = "text/css";
        node.appendChild(document.createTextNode(css));
        heads[0].appendChild(node);
      }
      var refPoints = "<div style='width:80px;margin-left:25px'><p style='float:left;-webkit-margin-before:10px;-webkit-margin-after:0'><span class='mPoint amar'>&nbsp;</span> Local</p> <p style='clear:both'></p> <p style='float:left;margin-top:-5px!important;-webkit-margin-before:0;-webkit-margin-after:10px'><span class='mPoint black'>&nbsp;</span> Visitante</p></div>";
      $(refPoints).insertBefore('img.shadow');
    }
  }
  function comparar_por_partido(filas) {
    try {
      var jugados = (location.href.indexOf('played') != -1) ? 1 : 0;
      var miEquipoSched = Boolean(!(filas[0].getElementsByTagName('a')[0]));
      var inicio = (!jugados && miEquipoSched) ? 1 : 0;
      var filasL = filas.length;
      for (var i = inicio; i < filasL; i++) {
        if (filas[i].className == 'group')
          continue;
        var ad2 = document.createElement('a');
        ad2.innerHTML = '<img src=\"http://i.imgur.com/FCw8KRW.png\" title=\"Mirar rival en MZPlus\" border=\"0\" width=\"22\" width=\"13\" />';
        var vtm = filas[i].childNodes[3].childNodes[7].childNodes[1].childNodes[1].childNodes[1].href;
        if (vtm.indexOf('&tid') == -1) vtm = filas[i].childNodes[3].childNodes[7].childNodes[1].childNodes[5].childNodes[2].href;
        vtm = vtm.substring(vtm.indexOf('&tid'));
        vtm = vtm.replace('&tid=', '');
        ad2.setAttribute('href', 'http://www.mzplus.info/i?eq=' + vtm.toString());
        ad2.setAttribute('target', '_blank');
        ad2.setAttribute('style', 'margin-left:2px');
        filas[i].childNodes[3].childNodes[5].appendChild(ad2);
      }
    } catch (e) {
      console.log(e);
    }
  }
  if (location.href.indexOf('scheduled') != -1 || location.href.indexOf('played') != -1) {
    var filas = $("#fixtures-results-list > dd");
    comparar_por_partido(filas);
  }
  function mzs() {
    try {
      $("#top_item_help_sub .subpage_nav").append('<li><a href="https://greasyfork.org/scripts/1752-mzscript-por-ccc-vader-serbini-ini" target="_blank">MZ Script</a></li>');
    } catch (e) {
      console.log(e);
    }
  }
  mzs();
  function insertarSelect(elementID) {
    var divImg = document.createElement('div')
    divImg.setAttribute('id', 'contenedor');
    divImg.setAttribute('style', 'border: 5px solid green;font-weight:bold;display:none;width:380px;padding:5px; margin: 0 auto');
    divImg.innerHTML = 'Arrastre su imagen a este espacio <button id="btnUpImg">O clickee acá para elegirla</button> <input style="visibility: collapse; width: 0px;" id="subidor" type="file"><p id="error" style="font-weight:bold;color:red">Error. El archivo seleccionado no es una imagen.</p><p id="pe">Cargando imagen <img src="http://managerzone.se/img/loading.gif"> &nbsp;espere por favor.</p><a id="link"></a>';
    var ins = document.getElementById(elementID);
    ins.parentNode.insertBefore(divImg, ins);
    document.getElementById("btnUpImg").addEventListener("click", function () {
      return document.getElementById('subidor').click()
    }, false);
    document.getElementById("subidor").addEventListener("change", function () {
      return upload(this.files[0])
    }, false);
    document.getElementById("btnUpImg").addEventListener("click", preventDef, false);
    document.getElementById("contenedor").addEventListener("dragover", preventDef, false);
    document.getElementById("contenedor").addEventListener("drop", preventDef, false);
    document.getElementById("contenedor").addEventListener("drop", uploadImage, false);
  }
  function generarImagen(url, idImg, elementID, height) {
    var bimg;
    if (idImg == 'btnTabla2' || idImg == 'btnTabla2c') {
      bimg = document.createElement('div');
      bimg.setAttribute('class', 'mzbtn buttondiv button_account');
      bimg.setAttribute('title', 'Insertar Tabla LA-liga');
      bimg.setAttribute('style', 'margin-bottom:5px');
      bimg.innerHTML = "<span class='buttonClassMiddle'><span style='white-space: nowrap' id='" + idImg + "'>Tabla LA/liga</span></span><span class='buttonClassRight'>&nbsp;</span>&nbsp;";
    } else if (idImg == 'upImg' || idImg == 'upImgc') {
      bimg = document.createElement('div');
      bimg.setAttribute('class', 'mzbtn buttondiv button_account');
      bimg.setAttribute('title', 'Subir imágenes a ImgUr');
      bimg.innerHTML = "<span class='buttonClassMiddle'><span style='white-space: nowrap' id='" + idImg + "'>ImgUr</span></span><span class='buttonClassRight'>&nbsp;</span>&nbsp;";
    } else {
      bimg = document.createElement('img');
      bimg.setAttribute('src', url);
      bimg.setAttribute('id', idImg);
    }
    if (height != '')
      bimg.setAttribute('height', height + 'px');
    var ins = document.getElementById(elementID);
    ins.parentNode.insertBefore(bimg, ins);
  }
  function insBR(elementID) {
    var brr = document.createElement('br');
    var ins = document.getElementById(elementID);
    ins.parentNode.insertBefore(brr, ins);
  }
  function armaPanel(elementID) {
    var groupContainer = $("#" + elementID);
    if (typeof groupContainer !== 'undefined') {
      clearInterval(setterBC);
      var height = '';
      generarImagen('http://i.imgur.com/juiRdYs.gif', 'btnTabla2', elementID, height);
      generarImagen('http://i.imgur.com/HGa7jFa.gif', 'upImg', elementID, height);
      generarImagen('http://i.imgur.com/WOpvhpS.gif', 'aIcono0', elementID, height);
      generarImagen('http://i.imgur.com/CcuKTNz.gif', 'aIcono1', elementID, height);
      generarImagen('http://i.imgur.com/NPyAJM5.gif', 'aIcono2', elementID, height);
      generarImagen('http://i.imgur.com/1ncAraF.gif', 'aIcono3', elementID, height);
      generarImagen('http://i.imgur.com/xp6xUJJ.gif', 'aIcono4', elementID, height);
      generarImagen('http://i.imgur.com/qOigaWi.png', 'aIcono5', elementID, height);
      generarImagen('http://i.imgur.com/rSqmTPO.gif', 'aIcono6', elementID, height);
      generarImagen('http://i.imgur.com/uLyJYhu.png', 'aIcono7', elementID, height);
      generarImagen('http://i.imgur.com/RUQN2Hy.gif', 'aIcono8', elementID, height);
      generarImagen('http://i.imgur.com/QuXS7fE.gif', 'aIcono9', elementID, height);
      generarImagen('http://i.imgur.com/Bf8NC56.png', 'aIcono10', elementID, height);
      generarImagen('http://i.imgur.com/2L3i1f4.png', 'aIcono11', elementID, height);
      generarImagen('http://i.imgur.com/OOsLDaW.gif', 'aIcono12', elementID, height);
      generarImagen('http://i.imgur.com/HEAlBlA.png', 'aIcono13', elementID, height);
      generarImagen('http://i.imgur.com/O2GDd6I.png', 'aIcono14', elementID, height);
      insBR(elementID);
      generarImagen('http://i.imgur.com/zpY2A6I.gif', 'aIcono26', elementID, height);
      height = 15;
      generarImagen('http://i.imgur.com/RzjaSKr.gif', 'aIcono17', elementID, height);
      generarImagen('http://i.imgur.com/XEHiXuO.gif', 'aIcono18', elementID, height);
      generarImagen('http://i.imgur.com/1t7YpCo.gif', 'aIcono19', elementID, height);
      generarImagen('http://i.imgur.com/BzPDfzF.gif', 'aIcono20', elementID, height);
      generarImagen('http://i.imgur.com/UR5t0o6.gif', 'aIcono21', elementID, height);
      generarImagen('http://i.imgur.com/aaPvRo4.gif', 'aIcono23', elementID, height);
      generarImagen('http://i.imgur.com/KKx3thu.gif', 'aIcono25', elementID, height);
      generarImagen('http://i.imgur.com/KnhAURP.gif', 'aIcono27', elementID, height);
      generarImagen('http://i.imgur.com/NA84WqF.gif', 'aIcono28', elementID, height);
      generarImagen('http://i.imgur.com/N2cdFNy.gif', 'aIcono29', elementID, height);
      generarImagen('http://i.imgur.com/oQYWBTO.gif', 'aIcono30', elementID, height);
      generarImagen('http://i.imgur.com/YWe8hno.gif', 'aIcono31', elementID, height);
      generarImagen('http://i.imgur.com/8t9ZJse.gif', 'aIcono22', elementID, height);
      generarImagen('http://i.imgur.com/av8bxvU.gif', 'aIcono32', elementID, height);
      generarImagen('http://i.imgur.com/Q3B4Dqz.gif', 'aIcono15', elementID, height);
      generarImagen('http://i.imgur.com/vWFv3Gt.gif', 'aIcono16', elementID, height);
      insertarSelect(elementID);
    }
  }
  function atajoExtInt(urlImagen, urlPagina, titleImg, created) {
    if (!created) {
      var divC = document.createElement('div');
      divC.setAttribute('class', 'externalSc');
      divC.setAttribute('id', 'externalSc');
      var ins = document.getElementById('contentDiv');
      ins.parentNode.insertBefore(divC, ins);
      created = 1;
    }
    var ad = document.createElement('a');
    ad.setAttribute('href', urlPagina);
    ad.setAttribute('style', 'text-decoration:none; margin-bottom:0;margin-left:4px');
    ad.innerHTML = '<img src=\"' + urlImagen + '\" title=\"' + titleImg + '\" border=\"0\" class="atajoExtInt">\n';
    $('#externalSc').append(ad);
  }
  function atajoForo(urlPagina, text, titleImg, created) {
    if (!created) {
      var divC = document.createElement('div');
      divC.setAttribute('class', 'fbtn');
      divC.setAttribute('id', 'fbtn');
      document.getElementById('notifications-wrapper').appendChild(divC);
      created = 1;
    }
    var html = '<a class="quicklink" href="?' + urlPagina + '" title="' + titleImg + '" target="_blank">' + text + '</a>';
    $('#fbtn').append(html);
  }
  var url = window.location.href.split('=');
  var setterBC;
  if (url[1] == "guestbook&uid" || url[1] == "guestbook" || url[1] == "friendlyseries&sub") {
    if (url[1] != "friendlyseries&sub") {
      armaPanel('writeform');
    } else {
      $("#ui-id-5").click(function () {
        setterBC = setInterval(function () {
          armaPanel('writeform');
        }, 1000);
      });
    }
  }
  function transformar(dato) {
    switch (dato) {
      case '0':
        pelota = "http://static.managerzone.com/nocache-76/img/soccer/wlevel_0.gif";
        break;
      case '1':
        pelota = "http://static.managerzone.com/nocache-76/img/soccer/wlevel_1.gif";
        break;
      case '2':
        pelota = "http://static.managerzone.com/nocache-76/img/soccer/wlevel_2.gif";
        break;
      case '3':
        pelota = "http://static.managerzone.com/nocache-76/img/soccer/wlevel_3.gif";
        break;
      case '4':
        pelota = "http://static.managerzone.com/nocache-76/img/soccer/wlevel_4.gif";
        break;
      case '5':
        pelota = "http://static.managerzone.com/nocache-76/img/soccer/wlevel_5.gif";
        break;
      case '6':
        pelota = "http://static.managerzone.com/nocache-76/img/soccer/wlevel_6.gif";
        break;
      case '7':
        pelota = "http://static.managerzone.com/nocache-76/img/soccer/wlevel_7.gif";
        break;
      case '8':
        pelota = "http://static.managerzone.com/nocache-76/img/soccer/wlevel_8.gif";
        break;
      case '9':
        pelota = "http://static.managerzone.com/nocache-76/img/soccer/wlevel_9.gif";
        break;
      case '10':
        pelota = "http://static.managerzone.com/nocache-76/img/soccer/wlevel_10.gif";
        break;
    }
    return pelota;
  }
  var url = window.location.href.split('&');
  var control = window.location.href.split('=');
  var configAlt = localStorage.getItem("configAlt");
  if (url[1] == "sub=alt" && control[2] == "alt") {
    try {
      $(document).ready(function () {
        var flag = 0;
        $(".leftnav").parent().after("<div style='color:#FFF;width:158px;height: 20px;border: 1px solid white; margin-top:10px; padding: 6px 0 0 5px;font-weight:bold' class='cursor' id='configBox'><span style='line-height:16px'>Configuración</span> <img src='http://i.imgur.com/pQqMK52.png' style='vertical-align: middle;float:right;padding-right:3px' /></div>");
        $("#configBox").after("<div style='color:#FFF; text-align:center; margin-top: 10px;font-weight:bold' class='divHidden' id='configBoxFull'>Mostrar skiller <br /> Sí <input type='radio' value='1' name='configOpt' /> No <input type='radio' value='0' name='configOpt' /><br /><div class='mzbtn buttondiv button_account' style='margin-top:8px;box-shadow:none!important'><span class='buttonClassMiddle'><span id='saveConfig' style='white-space: nowrap'>Guardar</span></span><span class='buttonClassRight'>&nbsp;</span></div><br /><span style='font-style:italic;font-size:11px;float:right;font-weight:normal;margin-top:5px'>MZScript ©</span></div>");
        $("#configBox").bind("click", function () {
          collapseExpand("configBoxFull");
          if (!flag) {
            $("#configBox img").attr('src', 'http://i.imgur.com/j07tHtg.png');
            flag = 1;
          } else {
            $("#configBox img").attr('src', 'http://i.imgur.com/pQqMK52.png');
            flag = 0;
          }
        });
        $("#saveConfig").click(saveConfig);
        function saveConfig() {
          var option = $("input[type='radio']:checked").val();
          if (typeof option != "undefined") {
            localStorage.setItem('configAlt', option);
            alert("La configuración ha sido guardada");
          }
        }
      });
    } catch (e) {
    }
    if (configAlt == 1 || configAlt == null) {
      var nocm = document.getElementById("skyscraper");
      var htmlCountPost, tablaDeJugadores;
      if (nocm) {
        htmlCountPost = document.evaluate('/html/body/div[3]/div[4]/div[5]/div[2]/div[2]/div/div[2]/div[3]/div[2]/table/tbody', document, null, XPathResult.ANY_TYPE, null);
        tablaDeJugadores = htmlCountPost.iterateNext();
      } else {
        htmlCountPost = document.evaluate('/html/body/div[3]/div[4]/div[5]/div[2]/div[2]/div/div[2]/div[3]/div[2]/table/tbody', document, null, XPathResult.ANY_TYPE, null);
        tablaDeJugadores = htmlCountPost.iterateNext();
      }
      var tdjP = tablaDeJugadores.rows.length;
      for (jugador = 0; jugador < tdjP; jugador++) {
        var celda = tablaDeJugadores.rows[jugador].cells[0].innerHTML;
        var numJug = tablaDeJugadores.rows[jugador].cells[0].innerHTML;
        var nombreJug = tablaDeJugadores.rows[jugador].cells[1].childNodes[0].text;
        var valorJug = tablaDeJugadores.rows[jugador].cells[2].childNodes[0].innerHTML;
        var sueldoJug = tablaDeJugadores.rows[jugador].cells[3].childNodes[0].innerHTML;
        var edadJug = tablaDeJugadores.rows[jugador].cells[4].innerHTML;
        var season = tablaDeJugadores.rows[jugador].cells[5].innerHTML;
        var vel = tablaDeJugadores.rows[jugador].cells[6].innerHTML;
        var res = tablaDeJugadores.rows[jugador].cells[7].innerHTML;
        var intel = tablaDeJugadores.rows[jugador].cells[8].innerHTML;
        var pases = tablaDeJugadores.rows[jugador].cells[9].innerHTML;
        var rem = tablaDeJugadores.rows[jugador].cells[10].innerHTML;
        var cab = tablaDeJugadores.rows[jugador].cells[11].innerHTML;
        var atajar = tablaDeJugadores.rows[jugador].cells[12].innerHTML;
        var ctrl = tablaDeJugadores.rows[jugador].cells[13].innerHTML;
        var ent = tablaDeJugadores.rows[jugador].cells[14].innerHTML;
        var cruces = tablaDeJugadores.rows[jugador].cells[15].innerHTML;
        var bp = tablaDeJugadores.rows[jugador].cells[16].innerHTML;
        var expp = tablaDeJugadores.rows[jugador].cells[17].innerHTML;
        var edof = tablaDeJugadores.rows[jugador].cells[18].innerHTML;
        var nuevo = "&nbsp;<a class='ctooltip'><img src='http://i.imgur.com/xrFgj2d.png' style='cursor:pointer'><span><table cellpadding='0' cellspacing='0' style='width:300px' class='playerTableC'><tr><td width='290' colspan='2' style='font-weight: bold;color:#000060'>(" + numJug + ") " + nombreJug + "</td></tr><tr><td width='120'><b>Valor: </b>" + valorJug + "</td><td width='170'><b>Sueldo: </b>" + sueldoJug + "</td></tr><tr><td><b>Edad: </b>" + edadJug + "</td><td><b>Nacido Temp.: </b>" + season + "</td></tr><tr><td align='right' colspan='2'><i style='margin-right:8px'>MZScript ©</i></td></tr><tr><td width='170'><b>Velocidad </b></td><td><img src='" + transformar(vel) + "'> (" + vel + ")</td></tr><tr><td><b>Resistencia </b></td><td><img src='" + transformar(res) + "'> (" + res + ")</td></tr><tr><td><b>Inteligencia </b></td><td><img src='" + transformar(intel) + "'> (" + intel + ")</td></tr><tr><td><b>Pases </b></td><td><img src='" + transformar(pases) + "'> (" + pases + ")</td></tr><tr><td><b>Remates </b></td><td><img src='" + transformar(rem) + "'> (" + rem + ")</td></tr><tr><td><b>Cabeza </b></td><td><img src='" + transformar(cab) + "'> (" + cab + ")</td></tr><tr><td><b>Atajar </b></td><td><img src='" + transformar(atajar) + "'> (" + atajar + ")</td></tr><tr><td><b>Control </b></td><td><img src='" + transformar(ctrl) + "'> (" + ctrl + ")</td></tr><tr><td><b>Entradas </b></td><td><img src='" + transformar(ent) + "'> (" + ent + ")</td></tr><tr><td><b>Pases largos </b></td><td><img src='" + transformar(cruces) + "'> (" + cruces + ")</td></tr><tr><td><b>Balon parado </b></td><td><img src='" + transformar(bp) + "'> (" + bp + ")</td></tr><tr><td><b>Experiencia </b></td><td><img src='" + transformar(expp) + "'> (" + expp + ")</td></tr><tr><td><b>Edo. fisico </b></td><td><img src='" + transformar(edof) + "'> (" + edof + ")</td></tr></table></span></a>";
        tablaDeJugadores.rows[jugador].cells[0].innerHTML = celda + nuevo;
      }
    }
  }
  function calculando35(nrodecaso) {
    if (nrodecaso == '1') {
      $("#cuadro1, #cuadro2, #cuadro5, #cuadro8").css('display', 'none');
      $("#cuadro3, #cuadro4, #cuadro6, #cuadro7, #cuadro10,#cuadro11").css('display', 'block');
    } else if (nrodecaso == '2') {
      $("#cuadro3, #cuadro5").css('display', 'none');
      $("#cuadro1, #cuadro2, #cuadro6, #cuadro7,#cuadro10,#cuadro4, #cuadro8,#cuadro11").css('display', 'block');
    } else if (nrodecaso == '3') {
      $("#cuadro1, #cuadro2, #cuadro8").css('display', 'none');
      $("#cuadro6, #cuadro7,#cuadro10,#cuadro5,#cuadro3,#cuadro4,#cuadro11").css('display', 'block');
    }
  }
  function calculando3(obj) {
    var f = document.forms[obj]
    var valorVenta = f.elements["vventa"].value.replace(/[^0-9]/g, "");
    var valorMz = f.elements["vMz"].value.replace(/[^0-9]/g, "");
    var impuesto, porcentaje;
    var ganancia = valorVenta - valorMz;
    var chequeado1 = document.getElementById('cel1').checked;
    var chequeado2 = document.getElementById('cel2').checked;
    var chequeado3 = document.getElementById('cel3').checked;
    if (!chequeado1 && !chequeado2 && !chequeado3) {
      alert("Error. Elija una opción.");
      return false;
    }
    function fechaDif(diaVenta, mesVenta, anioVenta, diaCompra, mesCompra, anioCompra) {
      mesVenta = mesVenta - 1;
      mesCompra = mesCompra - 1;
      var msecPerDay = 86400000;
      var fechaVenta = new Date(anioVenta, mesVenta, diaVenta);
      var fechaCompra = new Date(anioCompra, mesCompra, diaCompra);
      fechaCompra = fechaCompra.getTime() / msecPerDay;
      fechaVenta = fechaVenta.getTime() / msecPerDay;
      var tot = fechaVenta - fechaCompra;
      if (tot < 0) {
        alert("Error con las fechas");
        return -1;
      }
      return tot;
    }
    var cSigla = localStorage.getItem('sigla');
    if (!cSigla)
      cSigla = "USD";
    if (chequeado1) {
      if (valorVenta == null || valorVenta == "" || valorMz == null || valorMz == "") {
        alert("Error. Debe completar todos los campos.");
        return false;
      }
      if (ganancia > 0) {
        porcentaje = "15%";
        impuesto = Math.round((ganancia * 15) / 100);
        rganancia = Math.round(valorVenta - impuesto);
        rganancia = puntosMiles(rganancia) + " " + cSigla;
      } else {
        porcentaje = "-";
        impuesto = "-";
        rganancia = "No hay ganancia con esta venta, por lo que no aplica impuestos.";
      }
    } else if (chequeado2) {
      var fechaCompra = f.elements["fcompra"].value;
      var fechaVenta = f.elements["fventa"].value;
      var valorCompra = f.elements["vcompra"].value.replace(/[^0-9]/g, "");

      var partida = fechaCompra.split('-');
      var diaCompra = partida[0];
      var mesCompra = partida[1];
      var anioCompra = partida[2];
      var partida2 = fechaVenta.split('-');
      var diaVenta = partida2[0];
      var mesVenta = partida2[1];
      var anioVenta = partida2[2];

      if (valorVenta == null || valorVenta == "" || valorCompra == null || valorCompra == "" || fechaCompra == null || fechaCompra == "" || fechaVenta == null || fechaVenta == "") {
        alert("Error. Debe completar todos los campos.");
        return false;
      }
      var diferencia = fechaDif(diaVenta, mesVenta, anioVenta, diaCompra, mesCompra, anioCompra);
      if (diferencia < 0)
        return false;
      ganancia = valorVenta - valorCompra;
      if (ganancia > 0 && diferencia >= 71) {
        porcentaje = "15%";
        impuesto = Math.round((ganancia * 15) / 100);
        rganancia = Math.round(valorVenta - impuesto);
        rganancia = puntosMiles(rganancia) + " " + cSigla;
      } else if (ganancia > 0 && diferencia >= 28 && diferencia <= 70) {
        porcentaje = "50%";
        impuesto = Math.round((ganancia * 50) / 100);
        rganancia = Math.round(valorVenta - impuesto);
        rganancia = puntosMiles(rganancia) + " " + cSigla;
      } else if (ganancia > 0 && diferencia >= 0 && diferencia <= 27) {
        porcentaje = "95%";
        impuesto = Math.round((ganancia * 95) / 100);
        rganancia = Math.round(parseInt(valorVenta - impuesto));
        rganancia = puntosMiles(rganancia) + " " + cSigla;
      } else if (ganancia <= 0) {
        porcentaje = "-";
        impuesto = "-";
        rganancia = "No hay ganancia con esta venta, por lo que no aplica impuestos.";
      }
    } else if (chequeado3) {
      var edad = f.elements["jEdad"].value;
      if (valorVenta == null || valorVenta == "" || valorMz == null || valorMz == "" || edad == null || edad == "") {
        alert("Error. Debe completar todos los campos.");
        return false;
      }
      if (ganancia > 0 && edad == 19) {
        porcentaje = "25%";
        impuesto = Math.round((ganancia * 25) / 100);
        rganancia = Math.round(valorVenta - impuesto);
        rganancia = puntosMiles(rganancia) + " " + cSigla;
      } else if (ganancia > 0 && edad == 20) {
        porcentaje = "20%";
        impuesto = Math.round((ganancia * 20) / 100);
        rganancia = Math.round(valorVenta - impuesto);
        rganancia = puntosMiles(rganancia) + " " + cSigla;
      } else if (ganancia > 0 && edad >= 21) {
        porcentaje = "15%";
        impuesto = Math.round((ganancia * 15) / 100);
        rganancia = Math.round(valorVenta - impuesto);
        rganancia = puntosMiles(rganancia) + " " + cSigla;
      } else if (edad <= 18) {
        porcentaje = "-";
        impuesto = "-";
        rganancia = "No se puede vender, es juvenil";
      } else {
        porcentaje = "-";
        impuesto = "-";
        rganancia = "No hay ganancia con esta venta, por lo que no aplica impuestos.";
      }
    }
    f.elements["cimpuestos"].value = puntosMiles(impuesto) + " " + cSigla;
    f.elements["cimpuestosP"].value = porcentaje;
    document.getElementById("cganancia").innerHTML = rganancia;
    $("#cuadro9, #cganancia").css('display', 'block');
    return true;
  }
  function soloNumeros(valor) {
    valor.value = valor.value.replace(/[^0-9]/g, "");
  }
  function resetImpuestos() {
    document.getElementById("fimpuestos").reset();
    $("#cuadro9, #cganancia").css('display', 'none');
  }
  function mostrando() {
    var exist = document.getElementById("contImpuestos");
    if (exist) {
      collapseExpand("contImpuestos");
      return false;
    }
    var div = document.createElement('div')
    div.setAttribute("id", "contImpuestos");
    div.setAttribute("class", "divVisible");
    div.setAttribute("style", "background-color:#000");
    var contenido = '<div style="color:#FFF;font-weight:bold;padding: 15px 0 10px 0;text-align: center;font-size: 13px;width:100%">Calcular Impuestos</div>';
    contenido += '<form name="fimpuestos" id="fimpuestos">';
    contenido += '<table class="impTabla" style="width:100%;margin: 0 0 5px -5px"><tr><td>Jugador del club</td><td> <input type="radio" name="taxes" value="1" id="cel1"></td></tr> ';
    contenido += '<tr><td>Jugador comprado </td><td><input type="radio" name="taxes" value="2" id="cel2"> </td></tr> ';
    contenido += '<tr><td>Ex-juvenil </td><td><input type="radio" name="taxes" value="3" id="cel3"> </td></tr></table>';
    contenido += '<div id="cuadro1" class="cuadros">Valor Compra<br /> ';
    contenido += '<input id="vcompra" type="text" value="" name="vcompra"></div>';
    contenido += '<div id="cuadro3" class="cuadros">Valor MZ<br /> ';
    contenido += '<input id="vMz" type="text" value="" name="vMz" ></div>';
    contenido += '<div id="cuadro4" class="cuadros">Valor Venta<br /> ';
    contenido += '<input id="vventa" type="text" value="" name="vventa"></div>';
    contenido += '<div id="cuadro2" class="cuadros">Fecha Compra<br /> ';
    contenido += '<input type="text" placeholder="dd-mm-aaaa" value="" name="fcompra"></div>';
    contenido += '<div id="cuadro8" class="cuadros">Fecha Venta<br />';
    contenido += '<input type="text" placeholder="dd-mm-aaaa" value="" name="fventa"></div>';
    contenido += '<div id="cuadro5" class="cuadros">Edad<br /> ';
    contenido += '<input id="jEdad" type="text" name="jEdad"></div>';
    contenido += '<div id="cuadro10" class="cuadros">Impuestos <i>(%)</i><br />';
    contenido += '<input name="cimpuestosP" type="text" disabled=""></div>';
    contenido += '<div id="cuadro6" class="cuadros">Impuestos <i>($)</i><br /> ';
    contenido += '<input name="cimpuestos" disabled=""></div>';
    contenido += '<div id="cuadro9" class="cuadros" style="display:none;font-weight:bold">Ingreso final</div> ';
    contenido += '<div id="cganancia" style="color: #000;background-color: #FFF;margin:8px 8px 0;width:132px;padding:5px;text-align:center;font-weight:bold;display:none"></div></div>';
    contenido += "<div style='padding:0 12px'><div id='cuadro7' style='display:none;text-align:center;float:left'><div class='mzbtn buttondiv button_account' style='margin-top:8px;box-shadow:none!important'><span class='buttonClassMiddle'><span id='cBoton' style='white-space: nowrap'>Calcular</span></span><span class='buttonClassRight'>&nbsp;</span></div></div></form>";
    contenido += "<div id='cuadro11' style='display:none;text-align:center'><div class='mzbtn buttondiv button_account' style='margin-top:8px;box-shadow:none!important'><span class='buttonClassMiddle'><span id='resetBtn' style='white-space: nowrap'>Reset</span></span><span class='buttonClassRight'>&nbsp;</span></div></div></div></form>";
    contenido += "<span style='font-style:italic;font-size:11px;float:right;color:#FFF;clear:both;background-color:#000'>MZScript ©</span>";
    div.innerHTML = contenido;
    $("#leftnav-wrapper").after(div);
    var aniadoId1 = document.getElementById("cel1");
    aniadoId1.addEventListener("click", function () {
      calculando35(1)
    }, false);
    var aniadoId2 = document.getElementById("cel2");
    aniadoId2.addEventListener("click", function () {
      calculando35(2)
    }, false);
    var aniadoId4 = document.getElementById("cel3");
    aniadoId4.addEventListener("click", function () {
      calculando35(3)
    }, false);
    var aniadoId3 = document.getElementById("resetBtn");
    aniadoId3.addEventListener("click", function () {
      resetImpuestos()
    }, false);
    var aniadoId8 = document.getElementById("cBoton");
    aniadoId8.addEventListener("click", function () {
      calculando3("fimpuestos")
    }, false);
    var aniadoId5 = document.getElementById("vcompra");
    aniadoId5.addEventListener("keyup", function () {
      soloNumeros(this)
    }, false);
    var aniadoId6 = document.getElementById("vventa");
    aniadoId6.addEventListener("keyup", function () {
      soloNumeros(this)
    }, false);
    var aniadoId7 = document.getElementById("vMz");
    aniadoId7.addEventListener("keyup", function () {
      soloNumeros(this)
    }, false);
  }
  var url = window.location.href.split('=');
  if (url[1] == "players&pid") {
    var contenedor = document.getElementById("thePlayers_0").childNodes[1].childNodes[1].childNodes[1].childNodes[5];
    var btnImpuestos = document.createElement('a');
    btnImpuestos.setAttribute("class", "mzbtn buttondiv button_blue");
    btnImpuestos.innerHTML = '<span class="buttonClassMiddle"><span style="white-space: nowrap; cursor:pointer" id="imagenRed">Impuestos</span></span><span class="buttonClassRight">&nbsp;</span>';
    contenedor.appendChild(btnImpuestos);
  }
  function botones(filaNueva) {
    //var botones = '<td>CC-Bar</td><td>';
    var botones = "<div class='mzbtn buttondiv button_account' title='Insertar Tabla LA-liga'><span class='buttonClassMiddle'><span style='white-space: nowrap' id='btnTabla'>Tabla LA/liga</span></span><span class='buttonClassRight'>&nbsp;</span></div>&nbsp;";
    botones += "<div class='mzbtn buttondiv button_account' title='Subir imágenes a ImgUr'><span class='buttonClassMiddle'><span style='white-space: nowrap' id='upImg'>ImgUr</span></span><span class='buttonClassRight'>&nbsp;</span></div>&nbsp;&nbsp;";
    botones += "<img src='http://i.imgur.com/3YitWv3.gif' alt='>' id='icono25'/>&nbsp;";
    botones += "<img src='http://i.imgur.com/Q3B4Dqz.gif' title='(y)' alt='(y)' id='icono31'/>&nbsp;";
    botones += "<img src='http://i.imgur.com/vWFv3Gt.gif' title='(n)' alt='(n)' id='icono32'/>&nbsp;";
    botones += "<img src='http://i.imgur.com/jaT1cb4.gif' height='20px' title='wtf' alt='wtf' id='icono51'/>&nbsp;";
    botones += "<img src='http://i.imgur.com/VfbyDHO.gif' height='20px' title='fail' alt='fail' id='icono44'/>&nbsp;";
    botones += "<img src='http://i.imgur.com/cheJFuk.gif' height='20px' title='repost' alt='repost' id='icono45'/>&nbsp;";
    botones += "<img src='http://i.imgur.com/jDjyKTf.gif' title='cri' alt='cri' id='icono52'/>&nbsp;";
    botones += "<img src='http://i.imgur.com/6PopX5q.gif' title='ha-ha' alt='ha-ha' id='icono7'/>";
    botones += "<img src='http://i.imgur.com/nRp5BpE.gif' title=':)' alt=':)' id='icono1'/>&nbsp;";
    botones += "<img src='http://i.imgur.com/CcuKTNz.gif' title=':D' alt=':D' id='icono2'/>&nbsp;";
    botones += "<img src='http://i.imgur.com/Dfl5ZGS.gif' title='D' alt='D' id='icono53'/>&nbsp;";
    botones += "<img src='http://i.imgur.com/8t9ZJse.gif' title='xD' alt='xD' id='icono4'/>&nbsp;";
    botones += "<img src='http://i.imgur.com/1kJhHCs.gif' title=':/' alt=':/' id='icono46'/>&nbsp;";
    botones += "<img src='http://i.imgur.com/1ncAraF.gif' title=':(' alt=':(' id='icono5'/>&nbsp;";
    botones += "<img src='http://i.imgur.com/xp6xUJJ.gif' title=':*(' alt=':*(' id='icono6'/>&nbsp;";
    botones += "<img src='http://i.imgur.com/qOigaWi.png' title=':S' alt=':S' id='icono8'/>&nbsp;";
    botones += "<img src='http://i.imgur.com/nITjZn5.gif' title='erm' alt='erm' id='icono9'/>&nbsp;";
    botones += "<img src='http://i.imgur.com/rSqmTPO.gif' title='8-)' alt='8-)' id='icono10'/>&nbsp;";
    botones += "<img src='http://i.imgur.com/qP1rAQ5.png' title='¬¬' alt='¬¬' id='icono11'/>&nbsp;";
    botones += "<img src='http://i.imgur.com/HdNdWN0.png' title='porfi' alt='porfi' id='icono14'/>&nbsp;";
    botones += "<img src='http://i.imgur.com/QuXS7fE.gif' title='O.O' alt='O.O' id='icono13'/>&nbsp;";
    botones += "<img src='http://i.imgur.com/RUQN2Hy.gif' title='_hm' alt='_hm' id='icono50'/>&nbsp;<br>";
    botones += "<img src='http://i.imgur.com/QLCdFIE.gif' title='>:(' alt='>:(' id='icono15'/>&nbsp;";
    botones += "<img src='http://i.imgur.com/55sAO1r.gif' title='>:)' alt='>:)' id='icono16'/>&nbsp;";
    botones += "<img src='http://i.imgur.com/KbQOSgw.gif' title='flirt' alt='flirt' id='icono17'/>&nbsp;";
    botones += "<img src='http://i.imgur.com/t5dALqK.gif' title=':P' alt=':P' id='icono18'/>&nbsp;";
    botones += "<img src='http://i.imgur.com/zpY2A6I.gif' title='|-(' alt='|-(' id='icono19'/>&nbsp;";
    botones += "<img src='http://i.imgur.com/yPtUjin.gif' title=';)' alt=';)' id='icono20'/>&nbsp;";
    botones += "<img src='http://i.imgur.com/OOsLDaW.gif' title='(h)' alt='(h)' id='icono21'/>&nbsp;";
    botones += "<img src='http://i.imgur.com/LdCQyai.png' title='u.u' alt='u.u' id='icono22'/>&nbsp;";
    botones += "<img src='http://i.imgur.com/KnhAURP.gif' title='shh' alt='shh' id='icono26'/>&nbsp;";
    botones += "<img src='http://i.imgur.com/BzPDfzF.gif' title='nana' alt='nana' id='icono28'/>";
    botones += "<img src='http://i.imgur.com/XEHiXuO.gif' height='23px' title='rock' alt='rock' id='icono33'/>";
    botones += "<img src='http://i.imgur.com/CsCrOnE.gif' title='grr' alt='grr' id='icono36'/>&nbsp;";
    botones += "<img src='http://i.imgur.com/K2d1Mbv.gif' height='23px' title='jaja' alt='jaja' id='icono37'/>";
    botones += "<img src='http://i.imgur.com/SMcjsnf.gif' title='eah' alt='eah' id='icono29'/>";
    botones += "<img src='http://i.imgur.com/aaPvRo4.gif' title='clap' alt='clap' id='icono30'/>";
    botones += "<img src='http://i.imgur.com/av8bxvU.gif' title='bla' alt='bla' id='icono38'/>";
    botones += "<img src='http://i.imgur.com/oQYWBTO.gif' title='l' alt='l' id='icono39'/>&nbsp;";
    botones += "<img src='http://i.imgur.com/z64hDgz.gif' title='grr' alt='grr' id='icono35'/>&nbsp;";
    botones += "<img src='http://i.imgur.com/NA84WqF.gif' title='angel' alt='angel' id='icono40'/>&nbsp;";
    botones += "<img src='http://i.imgur.com/N2cdFNy.gif' title='diablo' alt='diablo' id='icono41'/>&nbsp;";
    botones += "<img src='http://i.imgur.com/YWe8hno.gif' title='baba' alt='baba' id='icono42'/>";
    botones += "<img src='http://i.imgur.com/1t7YpCo.gif' height='23px' title='x)' alt='x)' id='icono43'/>&nbsp;";
    botones += "<img src='http://i.imgur.com/UR5t0o6.gif' title='plz' alt='plz' id='icono3'/>&nbsp;";
    botones += "<img src='http://i.imgur.com/KKx3thu.gif' title='umm' alt='umm' id='icono27'/>";
    botones += "<img src='http://i.imgur.com/sC8Mgmi.gif' title='facepalm' alt='facepalm' id='icono54'/>&nbsp;";
    botones += "<img src='http://i.imgur.com/gJw92DZ.gif' title='zzz' alt='zzz' id='icono48'/>";
    botones += "<img src='http://i.imgur.com/RzjaSKr.gif' title='om' alt='om' id='icono34'/>";
    botones += "<img src='http://i.imgur.com/7iCxtYD.gif' title='uh' alt='uh' id='icono47'/><br />";
    botones += '<div id="contenedor" style="border: 5px solid green;font-weight:bold;display:none;width:430px; padding:5px;margin:auto">Arrastre su imagen a este espacio <button id="btnUpImg">O clickee acá para elegirla</button> <input style="visibility: collapse; width: 0px;" id="subidor" type="file">';
    botones += '<p id="error" style="font-weight:bold;color:red">Error. El archivo seleccionado no es una imagen.</p><p id="pe">Cargando imagen <img src="http://managerzone.se/img/loading.gif"> &nbsp;espere por favor.</p><p id="link"></p></div>';
    filaNueva.innerHTML = botones;
  }
  function addevents() {
    document.getElementById("btnUpImg").addEventListener("click", preventDef, false);
    document.getElementById("contenedor").addEventListener("dragover", preventDef, false);
    document.getElementById("contenedor").addEventListener("drop", preventDef, false);
    document.getElementById("contenedor").addEventListener("drop", uploadImage, false);
    document.getElementById("btnUpImg").addEventListener("click", function () {
      return document.getElementById('subidor').click()
    }, false);
    document.getElementById("subidor").addEventListener("change", function () {
      return upload(this.files[0])
    }, false);
  }
  var setter;
  function addCCbar() {
    var bbcodeContainer = $('.bbcode');
    if (typeof bbcodeContainer !== 'undefined') {
      clearInterval(setter);
      var btnContainer = document.createElement("div");
      botones(btnContainer);
      $('.bbcode').before(btnContainer);
      addevents();
    }
    return false;
  }
  function setCCbar() {
    setter = setInterval(function () {
      addCCbar();
    }, 1000);
  }
  var url = window.location.href.split('&');
  if (url[1] == "sub=topics") {
    setCCbar();
    var mostrarsi = localStorage.getItem('mostrar');
    if (mostrarsi == 'true') {
      document.getElementById('mostrarY').click();
      var btnSend = document.getElementById("send_btn").childNodes[1];
      btnSend.addEventListener("click", function () {
        firmaFija()
      }, false);
    }
  }
  var url = window.location.href.split('&');
  if (url[1] == "sub=topics") {
    var link;
    $("#topics-list dl.clearfix > dd").each(function (idx, elm) {
      if (elm.className == 'topics-col-title') {
        link = $(elm).find('a').attr('href');
      }
      if (elm.className == 'topics-col-counter') {
        var counter = $(elm)[0];
        $(counter).find("span").remove();
        var cant_posts = $(counter).text();
        var split = cant_posts.split('/');
        var total_posts = parseInt(split[1]);
        if ($.isNumeric(total_posts)) {
          var cantidadDePaginas = Math.floor(parseInt(total_posts) / 50);
          var nuevo = "";
          if (cantidadDePaginas > 0 && total_posts != 50)
            nuevo += "<a title='Ir a la página 2' href='" + link + "&offset=50'>2</a>&#160;"
          if (cantidadDePaginas > 1 && total_posts != 100)
            nuevo += "<a title='Ir a la página 3' href='" + link + "&offset=100'>3</a>&#160;"
          if (cantidadDePaginas > 2 && total_posts != 150)
            nuevo += "<a title='Ir a la página 4' href='" + link + "&offset=150'>4</a>&#160;"
          if (cantidadDePaginas > 3) {
            var offset;
            if (total_posts % 50 == 0)
              offset = total_posts - 50;
            else
              offset = cantidadDePaginas * 50;
            nuevo += "<a title='Ir a la última página' href='" + link + "&offset=" + offset + "'>&#187;</a>"
          }
          if (cantidadDePaginas > 0 && total_posts != 50)
            nuevo = "&#160;[" + nuevo + "]";
          counter.innerHTML = counter.innerHTML + nuevo;
        }
      }
    });
  } else if (url[1] == "sub=topic") {
    setCCbar();
    $(".forum_content dl.hitlist_dl.forum_body").each(function (idx, elm) {
      var $elm = $(elm);
      var author = $elm.find('.post-author');
      var $author = $(author);
      var p_link_container = $author.find('a');
      var id = p_link_container.attr('href').split("&")[1].replace("uid=", "");
      var nombre = p_link_container.text();
      var foro = url[3].replace("forum_id=", "");
      var badge = $elm.find('.forum-post-badges');
      var equipo = $(badge).find('img').attr('src').split("=")[1].replace("&sport", "");
      var shortc = "&nbsp;<a title='GB de " + nombre + "' href='/?p=guestbook&uid=" + id + "' style='color:black;text-decoration:none;border:1px solid;'><b>&nbsp;GB&nbsp;</b></a>&nbsp;" +
        "&nbsp;<a title='MSG de " + nombre + "' id='c" + idx + "' style='color:black;text-decoration:none;border:1px solid;cursor:pointer;'><b>&nbsp;MSG&nbsp;</b></a>&nbsp;" +
        "&nbsp;<a title='Ver posts últimos 7 días de " + nombre + "' href='/index.php?p=forum&sub=search&search_keywords=&search_keyword_type=any&search_author=" + nombre + "&search_forum=" + foro + "&search_range=7&search_sort_by=post_date&search_sort_order=desc' style='color:black;text-decoration:none;border:1px solid;'><b>&nbsp;POST&nbsp;</b></a>&nbsp;" +
        "&nbsp;<a title='Enviar amistosos a " + nombre + "' href='/?p=team&sub=challenge&tid=" + equipo + "' style='color:black;text-decoration:none;border:1px solid;'><b>&nbsp;AMI&nbsp;</b></a>";
      $author.append(shortc);
      $('#c' + idx).click(function () {
        mz.messenger.dialog(id);
      });
    });
  }
  document.addEventListener("click", function (event) {
    switch (event.target.id) {
      case "mostrarTabla":
        mostrarTabla('copa');
        break;
      case "mostrarTabla2":
        mostrarTabla('nocopa');
        break;
      case "mostrarTabla3":
        mostrarTabla('privada');
        break;
      case "cerrar":
        collapseExpand("divTabla");
        break;
      case "btnTabla":
        posteaTabla('message');
        break;
      case "btnTabla2":
        posteaTabla('msg');
        break;
      case "icono1":
        posteaIcono('http://i.imgur.com/nRp5BpE.gif', 'message');
        break;
      case "icono2":
        posteaIcono('http://i.imgur.com/CcuKTNz.gif', 'message');
        break;
      case "icono3":
        posteaIcono('http://i.imgur.com/UR5t0o6.gif', 'message');
        break;
      case "icono4":
        posteaIcono('http://i.imgur.com/8t9ZJse.gif', 'message');
        break;
      case "icono5":
        posteaIcono('http://i.imgur.com/1ncAraF.gif', 'message');
        break;
      case "icono6":
        posteaIcono('http://i.imgur.com/xp6xUJJ.gif', 'message');
        break;
      case "icono7":
        posteaIcono('http://i.imgur.com/6PopX5q.gif', 'message');
        break;
      case "icono8":
        posteaIcono('http://i.imgur.com/qOigaWi.png', 'message');
        break;
      case "icono9":
        posteaIcono('http://i.imgur.com/nITjZn5.gif', 'message');
        break;
      case "icono10":
        posteaIcono('http://i.imgur.com/rSqmTPO.gif', 'message');
        break;
      case "icono11":
        posteaIcono('http://i.imgur.com/qP1rAQ5.png', 'message');
        break;
      case "icono12":
        posteaIcono('http://i.imgur.com/j79wNCf.gif', 'message');
        break;
      case "icono13":
        posteaIcono('http://i.imgur.com/QuXS7fE.gif', 'message');
        break;
      case "icono14":
        posteaIcono('http://i.imgur.com/HdNdWN0.png', 'message');
        break;
      case "icono15":
        posteaIcono('http://i.imgur.com/lbQHCKk.gif', 'message');
        break;
      case "icono16":
        posteaIcono('http://i.imgur.com/55sAO1r.gif', 'message');
        break;
      case "icono17":
        posteaIcono('http://i.imgur.com/KbQOSgw.gif', 'message');
        break;
      case "icono18":
        posteaIcono('http://i.imgur.com/t5dALqK.gif', 'message');
        break;
      case "icono19":
        posteaIcono('http://i.imgur.com/zpY2A6I.gif', 'message');
        break;
      case "icono20":
        posteaIcono('http://i.imgur.com/yPtUjin.gif', 'message');
        break;
      case "icono21":
        posteaIcono('http://i.imgur.com/OOsLDaW.gif', 'message');
        break;
      case "icono22":
        posteaIcono('http://i.imgur.com/LdCQyai.png', 'message');
        break;
      case "icono25":
        posteaIcono('http://i.imgur.com/3YitWv3.gif', 'message');
        break;
      case "icono26":
        posteaIcono('http://i.imgur.com/KnhAURP.gif', 'message');
        break;
      case "icono27":
        posteaIcono('http://i.imgur.com/KKx3thu.gif', 'message');
        break;
      case "icono28":
        posteaIcono('http://i.imgur.com/BzPDfzF.gif', 'message');
        break;
      case "icono29":
        posteaIcono('http://i.imgur.com/SMcjsnf.gif', 'message');
        break;
      case "icono30":
        posteaIcono('http://i.imgur.com/aaPvRo4.gif', 'message');
        break;
      case "icono31":
        posteaIcono('http://i.imgur.com/Q3B4Dqz.gif', 'message');
        break;
      case "icono32":
        posteaIcono('http://i.imgur.com/vWFv3Gt.gif', 'message');
        break;
      case "icono33":
        posteaIcono('http://i.imgur.com/XEHiXuO.gif', 'message');
        break;
      case "icono34":
        posteaIcono('http://i.imgur.com/RzjaSKr.gif', 'message');
        break;
      case "icono35":
        posteaIcono('http://i.imgur.com/z64hDgz.gif', 'message');
        break;
      case "icono36":
        posteaIcono('http://i.imgur.com/CsCrOnE.gif', 'message');
        break;
      case "icono37":
        posteaIcono('http://i.imgur.com/K2d1Mbv.gif', 'message');
        break;
      case "icono38":
        posteaIcono('http://i.imgur.com/av8bxvU.gif', 'message');
        break;
      case "icono39":
        posteaIcono('http://i.imgur.com/oQYWBTO.gif', 'message');
        break;
      case "icono40":
        posteaIcono('http://i.imgur.com/NA84WqF.gif', 'message');
        break;
      case "icono41":
        posteaIcono('http://i.imgur.com/N2cdFNy.gif', 'message');
        break;
      case "icono42":
        posteaIcono('http://i.imgur.com/YWe8hno.gif', 'message');
        break;
      case "icono43":
        posteaIcono('http://i.imgur.com/1t7YpCo.gif', 'message');
        break;
      case "icono44":
        posteaIcono('http://i.imgur.com/VfbyDHO.gif', 'message');
        break;
      case "icono45":
        posteaIcono('http://i.imgur.com/cheJFuk.gif', 'message');
        break;
      case "icono46":
        posteaIcono('http://i.imgur.com/1kJhHCs.gif', 'message');
        break;
      case "icono47":
        posteaIcono('http://i.imgur.com/7iCxtYD.gif', 'message');
        break;
      case "icono48":
        posteaIcono('http://i.imgur.com/gJw92DZ.gif', 'message');
        break;
      case "icono49":
        posteaIcono('http://i.imgur.com/92QYUDu.gif', 'message');
        break;
      case "icono50":
        posteaIcono('http://i.imgur.com/RUQN2Hy.gif', 'message');
        break;
      case "icono51":
        posteaIcono('http://i.imgur.com/jaT1cb4.gif', 'message');
        break;
      case "icono52":
        posteaIcono('http://i.imgur.com/jDjyKTf.gif', 'message');
        break;
      case "icono53":
        posteaIcono('http://i.imgur.com/Dfl5ZGS.gif', 'message');
        break;
      case "icono54":
        posteaIcono('http://i.imgur.com/sC8Mgmi.gif', 'message');
        break;
      case "aIcono0":
        posteaIcono('http://i.imgur.com/nRp5BpE.gif', 'msg');
        break;
      case "aIcono1":
        posteaIcono('http://i.imgur.com/CcuKTNz.gif', 'msg');
        break;
      case "aIcono2":
        posteaIcono('http://i.imgur.com/NPyAJM5.gif', 'msg');
        break;
      case "aIcono3":
        posteaIcono('http://i.imgur.com/1ncAraF.gif', 'msg');
        break;
      case "aIcono4":
        posteaIcono('http://i.imgur.com/xp6xUJJ.gif', 'msg');
        break;
      case "aIcono5":
        posteaIcono('http://i.imgur.com/qOigaWi.png', 'msg');
        break;
      case "aIcono6":
        posteaIcono('http://i.imgur.com/rSqmTPO.gif', 'msg');
        break;
      case "aIcono7":
        posteaIcono('http://i.imgur.com/qP1rAQ5.png', 'msg');
        break;
      case "aIcono8":
        posteaIcono('http://i.imgur.com/RUQN2Hy.gif', 'msg');
        break;
      case "aIcono9":
        posteaIcono('http://i.imgur.com/QuXS7fE.gif', 'msg');
        break;
      case "aIcono10":
        posteaIcono('http://i.imgur.com/Bf8NC56.png', 'msg');
        break;
      case "aIcono11":
        posteaIcono('http://i.imgur.com/CZT1Eec.gif', 'msg');
        break;
      case "aIcono12":
        posteaIcono('http://i.imgur.com/OOsLDaW.gif', 'msg');
        break;
      case "aIcono13":
        posteaIcono('http://i.imgur.com/yPtUjin.gif', 'msg');
        break;
      case "aIcono14":
        posteaIcono('http://i.imgur.com/LdCQyai.png', 'msg');
        break;
      case "aIcono15":
        posteaIcono('http://i.imgur.com/Q3B4Dqz.gif', 'msg');
        break;
      case "aIcono16":
        posteaIcono('http://i.imgur.com/vWFv3Gt.gif', 'msg');
        break;
      case "aIcono17":
        posteaIcono('http://i.imgur.com/RzjaSKr.gif', 'msg');
        break;
      case "aIcono18":
        posteaIcono('http://i.imgur.com/XEHiXuO.gif', 'msg');
        break;
      case "aIcono19":
        posteaIcono('http://i.imgur.com/1t7YpCo.gif', 'msg');
        break;
      case "aIcono20":
        posteaIcono('http://i.imgur.com/BzPDfzF.gif', 'msg');
        break;
      case "aIcono21":
        posteaIcono('http://i.imgur.com/UR5t0o6.gif', 'msg');
        break;
      case "aIcono22":
        posteaIcono('http://i.imgur.com/8t9ZJse.gif', 'msg');
        break;
      case "aIcono23":
        posteaIcono('http://i.imgur.com/aaPvRo4.gif', 'msg');
        break;
      case "aIcono24":
        posteaIcono('http://i.imgur.com/XdfJFFs.gif', 'msg');
        break;
      case "aIcono25":
        posteaIcono('http://i.imgur.com/KKx3thu.gif', 'msg');
        break;
      case "aIcono26":
        posteaIcono('http://i.imgur.com/zpY2A6I.gif', 'msg');
        break;
      case "aIcono27":
        posteaIcono('http://i.imgur.com/KnhAURP.gif', 'msg');
        break;
      case "aIcono28":
        posteaIcono('http://i.imgur.com/NA84WqF.gif', 'msg');
        break;
      case "aIcono29":
        posteaIcono('http://i.imgur.com/N2cdFNy.gif', 'msg');
        break;
      case "aIcono30":
        posteaIcono('http://i.imgur.com/oQYWBTO.gif', 'msg');
        break;
      case "aIcono31":
        posteaIcono('http://i.imgur.com/YWe8hno.gif', 'msg');
        break;
      case "aIcono32":
        posteaIcono('http://i.imgur.com/av8bxvU.gif', 'msg');
        break;
      case "imagenRed":
        mostrando();
        break;
      case "imagenCer":
        collapseExpand("contImpuestos");
        break;
      case "boton2":
        collapseExpand("divColor");
        break;
      case "btnFirma":
        crearFirma();
        break;
      case "btnMostrar":
        mostrarFirma();
        break;
      case "boton3":
        collapseExpand("divFirma");
        break;
      case "btni":
        addImagen('areaFirma');
        break;
      case "btnn":
        armaCodigo('b', 'areaFirma');
        break;
      case "btnc":
        armaCodigo('i', 'areaFirma');
        break;
      case "btns":
        armaCodigo('u', 'areaFirma');
        break;
      case "mostrarY":
        firmaSiempre();
        break;
      case "upImg":
        subirImagen();
        break;
    }
  }, true);
}