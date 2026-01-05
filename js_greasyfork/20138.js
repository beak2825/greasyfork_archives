// ==UserScript==
// @name         MrPiracy Player
// @author       MrPiracy
// @namespace    http://mrpiracy.club/
// @homepage     https://mrpiracy.site/
// @description  Necessário para a reprodução de alguns servidores
// @icon         https://mrpiracy.site/images/apple-touch-icon-120x120.png
// @icon64       https://mrpiracy.site/images/apple-touch-icon-57x57.png
// @version      15
// @match        https://*.mrpiracy.xyz/*
// @match        http://*.mrpiracy.xyz/*
// @match        https://*.mrpiracy.top/*
// @match        http://*.mrpiracy.top/*
// @grant        GM_xmlhttpRequest
// @connect      drive.google.com
// @connect      vd5.mycdn.me
// @connect      www.ok.ru
// @connect      cloud.mail.ru
// @connect      uptostream.com
// @connect      userscloud.com
// @connect      uptobox.com
// @connect      mrpiracy.win
// @connect      *
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/20138/MrPiracy%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/20138/MrPiracy%20Player.meta.js
// ==/UserScript==

function exec(fn) {
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = '(' + fn + ')();';
    document.body.appendChild(script);
    document.body.removeChild(script);
}

function getVideo() {

    var dados = document.getElementById("videoValues15");
    if(dados === null) {
        return;
    }

    var dadosConteudo = JSON.parse(dados.innerHTML);

    var headers = '';
    if(dadosConteudo.headers !== '') {
        headers = JSON.parse(decodeURIComponent(atob(decodeURIComponent(dadosConteudo.headers))));
    }

    var data = '';
    if(dadosConteudo.data !== '') {
        data = dadosConteudo.data;
    }


    if(dadosConteudo.provider == 1){
      GM_xmlhttpRequest({
          method: dadosConteudo.metodo,
          url: dadosConteudo.link,
          headers: headers,
          data: data,
          onload: function(response) {
              var tag = document.createElement('div');
              tag.setAttribute('id', 'forceScript1');
              tag.setAttribute('hidden', 'true');
              tag.innerHTML = response.responseText;
              document.body.appendChild(tag);
              var enviar = $('#vid').html();

              document.body.removeChild(tag);
              postApi(dadosConteudo.provider, dadosConteudo.acesso, dadosConteudo.legenda, dadosConteudo.imdb, dadosConteudo.v1, dadosConteudo.v2, dadosConteudo.v3, enviar, "nada");

          }
      });
    }else if (dadosConteudo.provider == 2) {

        postApi(dadosConteudo.provider, dadosConteudo.acesso, dadosConteudo.legenda, dadosConteudo.imdb, dadosConteudo.v1, dadosConteudo.v2, dadosConteudo.v3, dadosConteudo.link, "nada");
    }else if(dadosConteudo.provider == 3){
      GM_xmlhttpRequest({
        method: dadosConteudo.metodo,
        url: 'http://ok.ru/dk?cmd=videoPlayerMetadata&mid='+dadosConteudo.link,
        headers: headers,
        data: data,
        onload: function(response){
          postApi(dadosConteudo.provider, dadosConteudo.acesso, dadosConteudo.legenda, dadosConteudo.imdb, dadosConteudo.v1, dadosConteudo.v2, dadosConteudo.v3, response.responseText, "nada");
        }
      });
    }else if(dadosConteudo.provider == 4){
      GM_xmlhttpRequest({
        method: dadosConteudo.metodo,
        url: dadosConteudo.link,
        headers: headers,
        data: data,
        onload: function(response){
          postApi(dadosConteudo.provider, dadosConteudo.acesso, dadosConteudo.legenda, dadosConteudo.imdb, dadosConteudo.v1, dadosConteudo.v2, dadosConteudo.v3, response.responseText, "nada");
        }
      });
    }else if(dadosConteudo.provider == 6){
      GM_xmlhttpRequest({
        method: dadosConteudo.metodo,
        url: dadosConteudo.link,
        headers: headers,
        data: data,
        onload: function(response){

          let xaq; const ergiopjkge = /(https\:\/\/[a-zA-Z0-9\-\.]+cloud.+\.[a-zA-Z]{2,3}(\/\S*)?\/G)"/;  const wgijowe = /(https\:\/\/[a-zA-Z0-9\-\.]+cloud.+\.[a-zA-Z]{2,3}(\/\S*)?\/weblink\/view\/)/;  let m; while ((m = ergiopjkge.exec(response.responseText)) !== null) { if (m.index === ergiopjkge.lastIndex) { ergiopjkge.lastIndex++; } break; }  let l; while ((l = wgijowe.exec(response.responseText)) !== null) { if (l.index === wgijowe.lastIndex) { wgijowe.lastIndex++; } break; }  const asdasdqwq = /(?:\/\/|\.)(cloud.mail\.ru)\/public\/([0-9A-Za-z]+\/[0-9A-Za-z]+)/; let n; while ((n = asdasdqwq.exec(response.responseText)) !== null) {if (n.index === asdasdqwq.lastIndex) {asdasdqwq.lastIndex++;}break;}const trhrsf3 = /\"tokens\"\s*:\s*{\s*\"csrf\"\s*:\s*\"([^\"]+)/; let x; while ((x = trhrsf3.exec(response.responseText)) !== null) { if (x.index === trhrsf3.lastIndex) { trhrsf3.lastIndex++;} break;  } if (m){ xaq=m[1]+'/'+n[2]; } else if (l) { xaq=l[1]+'/'+n[2]; }

          postApi(dadosConteudo.provider, dadosConteudo.acesso, dadosConteudo.legenda, dadosConteudo.imdb, dadosConteudo.v1, dadosConteudo.v2, dadosConteudo.v3, response.responseText, dadosConteudo.link, xaq);
        }
      });
    }


    dados.parentNode.removeChild(dados);
}

function postApi(provider, link, legenda, imdb, v1, v2, v3, dataPost, media_id, xaq) {
    GM_xmlhttpRequest({
        method: "POST",
        url: link,
        data: "media_id="+encodeURIComponent(btoa(encodeURIComponent(media_id)))+"&provider="+encodeURIComponent(btoa(encodeURIComponent(provider)))+"&v1="+encodeURIComponent(btoa(encodeURIComponent(v1)))+"&v2="+encodeURIComponent(btoa(encodeURIComponent(v2)))+"&v3="+encodeURIComponent(btoa(encodeURIComponent(v3)))+"&imdb="+encodeURIComponent(btoa(encodeURIComponent(imdb)))+"&legenda="+encodeURIComponent(btoa(encodeURIComponent(legenda)))+"&conteudo="+encodeURIComponent(btoa(encodeURIComponent(dataPost)))+"&xaq="+encodeURIComponent(btoa(encodeURIComponent(xaq))),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        onload: function(response) {
            var playerText = document.createElement('div');
            playerText.setAttribute('id', 'coiso');
            playerText.setAttribute('hidden', 'true');
            playerText.innerHTML = response.responseText;
            document.body.appendChild(playerText);
            exec(function() {
                userscriptCallback();
            });
        }
    });
}
function injectTest() {
    var tag = document.createElement('div');
    tag.setAttribute('id', 'versao15');
     tag.setAttribute('hidden', 'true');
    document.body.appendChild(tag);
}
injectTest();
setInterval(getVideo, 100);