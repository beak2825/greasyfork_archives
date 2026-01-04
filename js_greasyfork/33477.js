// ==UserScript==
// @name        ComentParaShenL♂ng
// @namespace   maxrbr@gmail.com
// @description Esta extensión permite compartir contenido no admitido en taringa(no se quebran las normas del sitio,ya que todo es guardado en un servidor externo).
// @include     *://*.taringa.net/posts/*
// @include     *://*.taringa.net/*/mi/*
// @version     1.3
// @noframes
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/33477/ComentParaShenL%E2%99%82ng.user.js
// @updateURL https://update.greasyfork.org/scripts/33477/ComentParaShenL%E2%99%82ng.meta.js
// ==/UserScript==


function no_commetns(){
		var randomSL=Math.random();
		if(randomSL>0.75){
			return 'https://es.pornhub.com/embed/ph59972bc61458d';
		}else if(randomSL>0.50){
			return 'https://es.pornhub.com/embed/ph5984b629a205f';
		}else if(randomSL>0.25){
			return 'https://es.pornhub.com/embed/ph5747d7b14429c';
		}else{
			return 'https://es.pornhub.com/embed/ph5852203ad9328';
		}
	}


var a='<article class="comment-replies-container"><div class="comment clearfix    div_cmnt_1641143" data-id="1641143" data-reply-count="0" data-reply-page="1" data-owner="22761191" data-signature="7d08cb05fc32e3b148531d17daef2fa5"><div class="comment-data"><a href="/herni" class="min-avatar"><img class="lazy avatar-48" orig="https://a06.t26.net/taringa/avatares/5/8/8/F/7/9/Maxrbr/48x48_FD2.jpg" src="https://a06.t26.net/taringa/avatares/5/8/8/F/7/9/Maxrbr/48x48_FD2.jpg" style="display: inline;"></a></div><div class="comment-text"><div class="comment-author clearfix"><span style="display:block; float:left;"><a href="/herni" class="hovercard" data-uid="22761191">maxrbr</a></span></div><div class="comment-content">No hay comentarios, asi que toma, papu.No puedes negar mi bonda <iframe class="iframeSL" src="'+no_commetns()+'"></iframe></div></div></div></article>';
console.log('f');
    var cajaComent =  document.getElementsByClassName('shout-item')[0] || document.getElementsByTagName('footer')[0];
    cajaComent.innerHTML += '<style>.noMarginLeft { margin-left: 0px !important; }#abrirCerrarBTN{width: 100%; margin-left: 0px; margin-right: 0px;} #abrirCerrar{ display: block; transition: all 2s; overflow: hidden;} .flex{display: flex; background: rgba(0,0,0,0.7); justify-content: space-between; align-items: center;} .flex>button{ margin-right: 1px;} #textSL{ width: 100%; max-width:100%; min-width:100%; min-height:70px; box-sizing: border-box;} #lector{margin-right: 10px; color:rgba(0,0,0,0.5); background: #f0f0f0; border-radius: 50%; padding: 5.65px 2px; font-size: 14px;} #comentarSL{ margin-left: 0px; margin-right: 0px;}  #abrirCerrar iframe{ max-width:100%; width:1000px; height: 500px; padding:5px; box-sizing: border-box; border-color: transparent;}</style><div class="comments-primary noMarginLeft"><div class="comments-box"><h3 class="icon-comments">Comentarios De ShenLong</h3></div><div id="abrirCerrar">'+a+'</div><button id="abrirCerrarBTN" class="btn--blue">Abrir Comentarios</button><div id="alerts"></div><div class="flex"><div><button id="imgSL">imagen</button><button id="ifraSL">iframe(videos)</button></div><div id="lector">150</div></div><textarea id="textSL" placeholder="Añade tu comentario"></textarea><button id="comentarSL" class="btn--blue">Comentar</button></div>';

    if(document.getElementsByClassName('user-picture')[0] != undefined){
       var foto=document.getElementsByClassName('user-picture')[0].getAttribute("src");
    }else{
       var foto='https://a06.t26.net/taringa/avatares/5/8/8/F/7/9/Maxrbr/48x48_FD2.jpg';
    }
  
    if(document.getElementsByClassName('user-name')[0] != undefined){
       var nick=document.getElementsByClassName('user-name')[0].innerHTML;
    }else{
       var nick='Anonimo';
    }

    var abrirCerrarBTN=document.getElementById('abrirCerrarBTN');
    var abrirCerrar=document.getElementById('abrirCerrar');
    var num=0;
    var alertsBOX=document.getElementById('alerts');
    var imgSL=document.getElementById('imgSL');
    var ifraSL=document.getElementById('ifraSL');
    var videoSL=document.getElementById('videoSL');
    var comentarSL=document.getElementById('comentarSL');
    var lector= document.getElementById('lector');
    var textSL= document.getElementById('textSL');

    abrirCerrar.style.height='0px';
    lector.style.padding='5.65px 2px';


    function cambiarLector(){
      if(textSL.value.length<150){
        ultimoValueText= textSL.value;
        lector.innerHTML=150-textSL.value.length;
        lector.style.background='#f0f0f0';
       if(lector.innerHTML<10){
         lector.style.padding='2px 6.5px';
       }else if(lector.innerHTML<100){
         lector.style.padding='2px';
       }else{
         lector.style.padding='5.65px 2px';
       }
      }else{
        textSL.value=textSL.value.substr(0,150);
        lector.innerHTML=0;
        lector.style.padding='2px 6.5px';
        lector.style.background='#f00';
      }
    }

    function toComment(datos){
      var myjson = JSON.parse(datos);
      abrirCerrar.innerHTML='';
      num = myjson.length;
      
      if(abrirCerrar.style.height=='0px'){
        abrirCerrarBTN.innerHTML='Abrir Comentarios '+num;
      }else{
        abrirCerrarBTN.innerHTML='Cerrar Comentarios '+num;
      }
      
      myjson.forEach(function(data){
         abrirCerrar.innerHTML+='<article class="comment-replies-container"><div class="comment clearfix    div_cmnt_1641143" data-id="1641143" data-reply-count="0" data-reply-page="1" data-owner="22761191" data-signature="7d08cb05fc32e3b148531d17daef2fa5"><div class="comment-data"><a href="/'+data.nick+'" class="min-avatar"><img class="lazy avatar-48" orig="'+data.foto+'" src="'+data.foto+'" style="display: inline;"></a></div><div class="comment-text"><div class="comment-author clearfix"><span style="display:block; float:left;"><a href="/'+data.nick+'" class="hovercard" data-uid="22761191">'+data.nick+'</a></span></div><div class="comment-content">'+data.contenidod+'</div></div></div></article>';
      });
    }

    abrirCerrarBTN.addEventListener('click',function(){
      if(abrirCerrar.style.height=='0px'){
        abrirCerrar.style.height='auto';
        abrirCerrarBTN.innerHTML='Cerrar Comentarios '+num;
      }else{
        abrirCerrar.style.height='0px';
        abrirCerrarBTN.innerHTML='Abrir Comentarios '+num;
      }
    });

    imgSL.addEventListener('click',function(){
      var valorSL=prompt('Introduzca la url de la imagen(debe ser de pornhub(phncdn.com))', 'www.links.es/pajeroBanda/lasImagenesDeSheLong/morirConLaManoEnLaNutria.png');
      if(valorSL != null){
        console.log(valorSL);
        textSL.value+='[img='+valorSL+']';
      }
      cambiarLector();
    });


    ifraSL.addEventListener('click',function(){
      var valorSL=prompt('introduzca la url del iframe(solo se aceptan los dominios -> pornhub,xvideos)', 'https://es.pornhub.com/embed/ph58d6a091b8fbe');
      if(valorSL != null){
        console.log(valorSL);
        textSL.value+='[iframe='+valorSL+']';
      }
      cambiarLector();
    });

    comentarSL.addEventListener('click',function(){
      if(textSL.value != ''){
      var enviarAjax = new XMLHttpRequest();
       enviarAjax.onreadystatechange = function() {
         if (this.readyState == 4 && this.status == 200){
            abrirCerrar.innerHTML+='<article class="comment-replies-container"><div class="comment clearfix    div_cmnt_1641143" data-id="1641143" data-reply-count="0" data-reply-page="1" data-owner="22761191" data-signature="7d08cb05fc32e3b148531d17daef2fa5"><div class="comment-data"><a href="/'+nick+'" class="min-avatar"><img class="lazy avatar-48" orig="'+foto+'" src="'+foto+'" style="display: inline;"></a></div><div class="comment-text"><div class="comment-author clearfix"><span style="display:block; float:left;"><a href="/'+nick+'" class="hovercard" data-uid="22761191">'+nick+'</a></span></div><div class="comment-content">'+this.responseText+'</div></div></div></article>';
            if(abrirCerrar.style.height=='0px'){alert('Hecho, capo.Revisa los comments');}
         }
       };
       enviarAjax.open('POST', 'https://betinga.000webhostapp.com/json/escribir_json.php', true);
       enviarAjax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
       enviarAjax.send('foto='+foto+'&nick='+nick+'&contenidod='+textSL.value+'&ruta='+window.location.pathname);
      }else{
        alert('El formulario esta vacio, genio de la vida.');
      }
    });

    textSL.addEventListener('input',function(){
      cambiarLector();
    });

	var leerAjax = new XMLHttpRequest();
  leerAjax.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200){
      toComment(this.responseText);
    }
  };
  leerAjax.open("POST", "https://betinga.000webhostapp.com/json/leer_json.php", true);
  leerAjax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  leerAjax.send("ruta="+window.location.pathname);
console.log('fs');
