// ==UserScript==
// @name         Busca Moviles
// @version      0.1
// @description  Localiza moviles y otros...!
// @author       Zed Warck
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_addStyle
// @grant          GM_xmlhttpRequest
// @include        http*://s*.ikariam.gameforge.com/*
// @require        http://code.jquery.com/jquery-2.2.0.min.js
// @namespace https://greasyfork.org/users/30749
// @downloadURL https://update.greasyfork.org/scripts/17153/Busca%20Moviles.user.js
// @updateURL https://update.greasyfork.org/scripts/17153/Busca%20Moviles.meta.js
// ==/UserScript==


// Your code here...

function file_get_contents(url, flags, context, offset, maxLen) {
  var tmp, headers = [],
    newTmp = [],
    k = 0,
    i = 0,
    href = '',
    pathPos = -1,
    flagNames = 0,
    content = null,
    http_stream = false;
  var func = function(value) {
    return value.substring(1) !== '';
  };

  this.php_js = this.php_js || {};
  this.php_js.ini = this.php_js.ini || {};
  var ini = this.php_js.ini;
  context = context || this.php_js.default_streams_context || null;

  if (!flags) {
    flags = 0;
  }
  var OPTS = {
    FILE_USE_INCLUDE_PATH : 1,
    FILE_TEXT             : 32,
    FILE_BINARY           : 64
  };
  if (typeof flags === 'number') {
    flagNames = flags;
  } else {
    flags = [].concat(flags);
    for (i = 0; i < flags.length; i++) {
      if (OPTS[flags[i]]) {
        flagNames = flagNames | OPTS[flags[i]];
      }
    }
  }

  if (flagNames & OPTS.FILE_BINARY && (flagNames & OPTS.FILE_TEXT)) {
    throw 'You cannot pass both FILE_BINARY and FILE_TEXT to file_get_contents()';
  }

  if ((flagNames & OPTS.FILE_USE_INCLUDE_PATH) && ini.include_path && ini.include_path.local_value) {
    var slash = ini.include_path.local_value.indexOf('/') !== -1 ? '/' : '\\';
    url = ini.include_path.local_value + slash + url;
  } else if (!/^(https?|file):/.test(url)) {
    href = this.window.location.href;
    pathPos = url.indexOf('/') === 0 ? href.indexOf('/', 8) - 1 : href.lastIndexOf('/');
    url = href.slice(0, pathPos + 1) + url;
  }

  var http_options;
  if (context) {
    http_options = context.stream_options && context.stream_options.http;
    http_stream = !!http_options;
  }

  if (!context || !context.stream_options || http_stream) {
    var req = this.window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest();
    if (!req) {
      throw new Error('XMLHttpRequest not supported');
    }

    var method = http_stream ? http_options.method : 'GET';
    var async = !!(context && context.stream_params && context.stream_params['phpjs.async']);

    if (ini['phpjs.ajaxBypassCache'] && ini['phpjs.ajaxBypassCache'].local_value) {
      url += (url.match(/\?/) === null ? '?' : '&') + (new Date())
        .getTime();
    }

    req.open(method, url, async);
    if (async) {
      var notification = context.stream_params.notification;
      if (typeof notification === 'function') {
        if (0 && req.addEventListener) {
        } else {
          req.onreadystatechange = function(aEvt) {
            var objContext = {
              responseText : req.responseText,
              responseXML  : req.responseXML,
              status       : req.status,
              statusText   : req.statusText,
              readyState   : req.readyState,
              evt          : aEvt
            };
            var bytes_transferred;
            switch (req.readyState) {
            case 0:
              notification.call(objContext, 0, 0, '', 0, 0, 0);
              break;
            case 1:
              notification.call(objContext, 0, 0, '', 0, 0, 0);
              break;
            case 2:
              notification.call(objContext, 0, 0, '', 0, 0, 0);
              break;
            case 3:
              bytes_transferred = req.responseText.length * 2;
              notification.call(objContext, 7, 0, '', 0, bytes_transferred, 0);
              break;
            case 4:
              if (req.status >= 200 && req.status < 400) {
                bytes_transferred = req.responseText.length * 2;
                notification.call(objContext, 8, 0, '', req.status, bytes_transferred, 0);
              } else if (req.status === 403) {
                notification.call(objContext, 10, 2, '', req.status, 0, 0);
              } else {
                notification.call(objContext, 9, 2, '', req.status, 0, 0);
              }
              break;
            default:
              throw 'Unrecognized ready state for file_get_contents()';
            }
          };
        }
      }
    }

    if (http_stream) {
      var sendHeaders = (http_options.header && http_options.header.split(/\r?\n/)) || [];
      var userAgentSent = false;
      for (i = 0; i < sendHeaders.length; i++) {
        var sendHeader = sendHeaders[i];
        var breakPos = sendHeader.search(/:\s*/);
        var sendHeaderName = sendHeader.substring(0, breakPos);
        req.setRequestHeader(sendHeaderName, sendHeader.substring(breakPos + 1));
        if (sendHeaderName === 'User-Agent') {
          userAgentSent = true;
        }
      }
      if (!userAgentSent) {
        var user_agent = http_options.user_agent || (ini.user_agent && ini.user_agent.local_value);
        if (user_agent) {
          req.setRequestHeader('User-Agent', user_agent);
        }
      }
      content = http_options.content || null;
    }

    if (flagNames & OPTS.FILE_TEXT) {
      var content_type = 'text/html';
      if (http_options && http_options['phpjs.override']) {
        content_type = http_options['phpjs.override'];
      } else {
        var encoding = (ini['unicode.stream_encoding'] && ini['unicode.stream_encoding'].local_value) ||
          'UTF-8';
        if (http_options && http_options.header && (/^content-type:/im)
          .test(http_options.header)) {
          content_type = http_options.header.match(/^content-type:\s*(.*)$/im)[1];
        }
        if (!(/;\s*charset=/)
          .test(content_type)) {
          content_type += '; charset=' + encoding;
        }
      }
      req.overrideMimeType(content_type);
    }
    else if (flagNames & OPTS.FILE_BINARY) {
      req.overrideMimeType('text/plain; charset=x-user-defined');
    }

    try {
      if (http_options && http_options['phpjs.sendAsBinary']) {
        req.sendAsBinary(content);
      } else {
        req.send(content);
      }
    } catch (e) {
      return false;
    }

    tmp = req.getAllResponseHeaders();
    if (tmp) {
      tmp = tmp.split('\n');
      for (k = 0; k < tmp.length; k++) {
        if (func(tmp[k])) {
          newTmp.push(tmp[k]);
        }
      }
      tmp = newTmp;
      for (i = 0; i < tmp.length; i++) {
        headers[i] = tmp[i];
      }
      this.$http_response_header = headers;
    }

    if (offset || maxLen) {
      if (maxLen) {
        return req.responseText.substr(offset || 0, maxLen);
      }
      return req.responseText.substr(offset);
    }
    return req.responseText;
  }
  return false;
}
//********************************************************************************************************


function busca_moviles(reintentos, id_origen){
    var accion = 3;
    $.ajax({
        url : 'http://www.elvuelodelfenix.es/ikariam/datos.php',
        data : {accion:accion},
        type : 'POST',
        dataType : 'json',
        success : function(response) {
            //alert(response['respuesta']);
        },
        error : function() {
            alert('Disculpe, existió un problema');
        }
    });
    var continua = 0;
    accion = 2;
    for(i=id_origen+1; continua<reintentos; i++){
        //alert(i);
        var a = file_get_contents('http://s19-es.ikariam.gameforge.com/?view=island&cityId='+i);
        var existe = 0;
        if(a.search('avatarId:')>-1){
            var index_usuario = a.indexOf('avatarId:');
            var usuario_sinsplit = a.substring(index_usuario, index_usuario+20);
            var usuarios = usuario_sinsplit.split('\'');
            var usuario = usuarios[1];
        }
        if(a.search('\"id\":\"'+i+'\"')>-1){
            //alert("Encontrada: "+i);
            var index_elemento = a.indexOf('\"id\":\"'+i+'\"');
            var elemento_sinsplit = a.substring(index_elemento-50, index_elemento+300);
            var elementos = elemento_sinsplit.split('{');
            var elemento = elementos[1];
            
            var index_level = elemento.indexOf('level');
            var level_sinsplit = elemento.substring(index_level+6, index_level+12);
            var levels = level_sinsplit.split('\"');
            var level = levels[1];
            
            var index_nick = elemento.indexOf('ownerName');
            var nick_sinsplit = elemento.substring(index_nick+10, index_nick+30);
            var nicks = nick_sinsplit.split('\"');
            var nick = nicks[1];
            
            var id = i
            
            var index_idali = elemento.indexOf('ownerAllyId');
            var idali_sinsplit = elemento.substring(index_idali+12, index_idali+18);
            var idalis = idali_sinsplit.split('\"');
            var idali = idalis[1];            
            
            if(parseInt(idali)!=0){
                var index_tag = elemento.indexOf('ownerAllyTag');
                var tag_sinsplit = elemento.substring(index_tag+13, index_tag+23);
                var tags = tag_sinsplit.split('\"');
                var tag = tags[1];           
            }
            else{
                var tag = "-";
            }

            var coord1 = a.indexOf('js_islandBreadCoords');
            var str_coord = a.substring(coord1+18, coord1+30);
            var arr_coord = str_coord.split('>');
            existe = 1;
        }
       
        if (existe == 1){
            continua=0;
            $.ajax({
                url : 'http://www.elvuelodelfenix.es/ikariam/datos.php',
                data : {coordenadas:arr_coord[1], nick:nick, id:id, ali:tag, nivel:level, accion:accion, usuario:usuario},
                type : 'POST',
                dataType : 'json',
                success : function(response) {
                    //alert(response['respuesta']);
                },
                error : function() {
                    alert('Disculpe, existió un problema');
                }
            });
            ini=1;
        }
        else{
            continua++;
        }
    }
}

function ultima_movil(){
    var accion = 1;
    var ultima = 0;
    $.ajax({
        url : 'http://www.elvuelodelfenix.es/ikariam/datos.php',
        data : {accion:accion},
        type : 'POST',
        async: false,
        dataType : 'json',
        success : function(response) {
            if(response['accion']!=0){
                 ultima = response['accion'];
            }
        },
        error : function() {
            alert('Disculpe, existió un problema');
        }
    });    
    return ultima;
}
/*
var ultima;
setInterval(function(){
    ultima = ultima_movil();
    busca_moviles(10, parseInt(ultima));   
},1000*60*1);
*/

setInterval(function(){
    var accion = -1;
    $.ajax({
        url : 'http://www.elvuelodelfenix.es/ikariam/datos.php',
        data : {accion:accion},
        type : 'POST',
        dataType : 'json',
        success : function(response) {
            if(response['accion']==0){
                ultima = ultima_movil();
                busca_moviles(10, parseInt(ultima)); 
            }
        },
        error : function() {
            alert('Disculpe, existió un problema');
        }
    });
},1000*10);






//*00






