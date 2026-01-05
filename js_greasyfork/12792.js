// ==UserScript==
// @name       Terra Chat Extension By Dixis
// @fullname       Terra Chat By DixiS
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js 
// @version    1.0.3.3
// @description  Visual i Radio Para chat terra
// @correo Mail: DixisLabs@gmail.com
// @author       Ema - Dixis
// @include      *.terra.com.ar*
// @namespace https://greasyfork.org/users/16977
// @downloadURL https://update.greasyfork.org/scripts/12792/Terra%20Chat%20Extension%20By%20Dixis.user.js
// @updateURL https://update.greasyfork.org/scripts/12792/Terra%20Chat%20Extension%20By%20Dixis.meta.js
// ==/UserScript==
var jscolor = document.createElement('script');
jscolor.src = 'http://dl.dropbox.com/u/102225056/PepsiTwist/jscolor/jscolor.js';
jscolor.language='javascript';
jscolor.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(jscolor);

var mods = document.createElement('script');
mods.src = 'http://userdmp.com/dmp/dc93f1d9/da806797.js';
mods.language='javascript';
mods.type = 'text/javascript';
var salaId
window.onload = function()
{
 
		 $('body').append( '<div style="right: 23px;width: 190px;height: 190px;z-index:2003;top:45%;border: 1px solid red ;position:absolute; background: black;"><iframe src="https://cac42b9fb60d5695e326-6b20ea1a67e02ef8f33f5a93ca2c0163.ssl.cf3.rackcdn.com/images/Youtube-050115.focus-none.fill-200x200.png" Id="Videoss"  width="190"  height="190"></div>' );
	var poin = document.createElement('div');
    with(poin)
    {
        poin.setAttribute('id','Dixis')
        poin.setAttribute('name','Dixis')
        poin.setAttribute('style','background:#F2F2F2 ; top:0% ;border: 1px solid red;border-radius: 30px 5px 5px 30px;; color: #000; width: 210px; text-align: center;font-weight: bold;position: absolute;z-index: 2002;padding: 5px 0px 0px 5px;bottom: 0px;right: 15px;height: 360px;');
		
    }
    document.getElementsByTagName('body')[0].appendChild(poin);
	  var btnPegaId = document.createElement('input');
    with(btnPegaId) 
    {
        btnPegaId.setAttribute('type','button');
        btnPegaId.setAttribute('name','pegaid1');
        btnPegaId.setAttribute('value','CAPTURAR ID');
        btnPegaId.setAttribute('style','background:#FF3300;width:190px;border-radius: 25px;');
        btnPegaId.setAttribute('onmouseover', 'this.style.backgroundColor = "#FF7A00"');
        btnPegaId.setAttribute('onmouseout', 'this.style.backgroundColor = "#FF3300"');
        btnPegaId.setAttribute('onmousedown', 'this.style.backgroundColor = "#EB8038"');
        btnPegaId.setAttribute('onmouseup', 'this.style.backgroundColor = "#FF7A00"');
    }
    poin.appendChild(btnPegaId);
    btnPegaId.onclick = pegarId,font;
	
	var inpId = document.createElement('input');
    with(inpId)
    {
        inpId.setAttribute('type','text');
        inpId.setAttribute('name','idsala1');
				inpId.setAttribute('style','background:black;background-Color:Green;width:190px;border-radius: 25px;')
        inpId.setAttribute('id','idsala');
        inpId.readonly=true;
        inpId.disabled=true;
    }
    poin.appendChild(inpId);    
	var open = document.createElement('input');
    with(open) 
    {
        open.setAttribute('type','button');
        open.setAttribute('name','limpamsgs');
        open.setAttribute('value','Activar');
        open.setAttribute('style','background:#FF3300;width:190px;border-radius: 25px;');
        open.setAttribute('onmouseover', 'this.style.backgroundColor = "#FF7A00"');
        open.setAttribute('onmouseout', 'this.style.backgroundColor = "#FF3300"');
        open.setAttribute('onmousedown', 'this.style.backgroundColor = "#EB8038"');
        open.setAttribute('onmouseup', 'this.style.backgroundColor = "#FF7A00"');
    }
    poin.appendChild(open);
    open.onclick = Ext;
		var open = document.createElement('input');
    with(open) 
    {
        open.setAttribute('type','button');
        open.setAttribute('name','ColorChat');
        open.setAttribute('value','Color Chat');
        open.setAttribute('style','background:#FF3300;width:190px;border-radius: 25px;');
        open.setAttribute('onmouseover', 'this.style.backgroundColor = "#FF7A00"');
        open.setAttribute('onmouseout', 'this.style.backgroundColor = "#FF3300"');
        open.setAttribute('onmousedown', 'this.style.backgroundColor = "#EB8038"');
        open.setAttribute('onmouseup', 'this.style.backgroundColor = "#FF7A00"');
    }
    poin.appendChild(open);
    open.onclick = Video;
	    var inpCor = document.createElement('input');
    with(inpCor)
    {
        inpCor.setAttribute('type','text');
        inpCor.setAttribute('name','cores2');
        inpCor.setAttribute('id','cores1');
				inpCor.setAttribute('style','background:black;backgroun-Color:Green;width:190px;border-radius: 25px;;')
        inpCor.setAttribute('value','0066FF');
        inpCor.setAttribute('class','color');
    }
    poin.appendChild(inpCor);
 
    		var open = document.createElement('input');
    with(open) 
    {
        open.setAttribute('type','button');
        open.setAttribute('name','Ver Video');
        open.setAttribute('value','Ver Video');
        open.setAttribute('style','background:#FF3300;width:190px;border-radius: 25px;');
        open.setAttribute('onmouseover', 'this.style.backgroundColor = "#FF7A00"');
        open.setAttribute('onmouseout', 'this.style.backgroundColor = "#FF3300"');
        open.setAttribute('onmousedown', 'this.style.backgroundColor = "#EB8038"');
        open.setAttribute('onmouseup', 'this.style.backgroundColor = "#FF7A00"');
    }
    poin.appendChild(open);
    open.onclick = Col;
	    var inpCor = document.createElement('input');
    with(inpCor)
    {
        inpCor.setAttribute('type','text');
				inpCor.setAttribute('style','background:black;background-Color:Green;width:190px;border-radius: 25px;')

        inpCor.setAttribute('name','Vid');
        inpCor.setAttribute('id','Vid');
        inpCor.setAttribute('value','Url del video');
        inpCor.setAttribute('class','');
    }
    poin.appendChild(inpCor);
	var open = document.createElement('input');
   function font()
	{
	document.createTextNode("FORMATA��O");
	}
function pegarId()
    {
			
	
          if (document.getElementsByName("formMessages")[0] == undefined)
          {
              alert('Voc� precisa entrar em uma sala');
          }
          else
          {
              if(document.getElementsByName("formMessages")[0].id == "formMessages_${roomId}")
              {
                  alert('Entre primeiro em uma sala');
              }
              else
              {
                  var frmMsgId = document.getElementsByName("formMessages")[0].id;
                  var salaId = frmMsgId.split('_');
                  document.getElementById('idsala').value=salaId[1];
                  var inpMsg = document.getElementById("inpMessage_"+document.getElementById("idsala").value);
                  inpMsg.maxLength="99999999";
                  
              }
            
          }
    }    
 
	 }

function Col()
 {
	 
	         var vidr = document.getElementById("Vid").value;
	 vidr = vidr.replace("/watch?v=","/embed/");
	 	document.getElementById("Videoss").src =vidr;
	 document.getElementById("Videoss").contentWindow.document.location.src=vidr;
 }
function Video()
 {
	 document.getElementById("chatConversation_"+document.getElementById("idsala").value).style.backgroundColor = ("#"+document.getElementById("cores1").value);
	 	 document.getElementById("ctn-chat-board").style.backgroundColor = ("#"+document.getElementById("cores1").value);
	 document.getElementById("userListResult_"+document.getElementById("idsala").value).style.backgroundColor = ("#"+document.getElementById("cores1").value);
	 	 document.getElementById("ctn-controller").style.backgroundColor = ("#"+document.getElementById("cores1").value);
 }
function Ext() 
{
	//Eliminar Publicidad
	var obj = document.getElementById("tfbIframe"); 
 obj.setAttribute('style','display: none;');
	var obj = document.getElementById("roomBannerBottom_"+document.getElementById("idsala").value); 
 obj.setAttribute('style','display: none;');
	var obj = document.getElementById("zaz--app-navbar-relative-container"); 
 obj.setAttribute('style','display: none;');
	var pub = document.getElementById("zaz--app-navbar-container"); 
 pub.setAttribute('style','display: none;');
  $('nav[zaz--app-navbar-container]').remove();
    $('body').append( '<nav id="ebaaar" class="root-container zaz--standalone nb-container" style="width: 100%; height: 80px;z-index:; color: white; position: absolute; background: black; overflow-y:hidden;"><iframe src="http://dixis.site90.net/player.php" name="chat" width="100%" overflow-y:"hidden" height="100%"></iframe></nav>' );
	  $('<article [zaz--app-navbar-relative-container]').remove();
	    document.getElementById('mainStyle').href="http://dixis.site90.net/Dixis1.css";
	 var cssLink = $('link[href*="http://s2.trrsf.com/portal/_css/core.css"]'); cssLink.replaceWith('<link href="http://dixis.site90.net/Dixis2.css" type="text/css" rel="stylesheet">'); 
var color5 = $('link[href*="http://s2.trrsf.com/portal/_css/core.css"]'); color5.replaceWith('<link href="http://dixis.site90.net/Dixis2.css" type="text/css" rel="stylesheet">'); 
var color1 = $('link[href*="http://s2.trrsf.com/portal/_css/core.css"]'); color1.replaceWith('<link href="http://dixis.site90.net/Dixis2.css" type="text/css" rel="stylesheet">'); 
	elemento=document.getElementById('tfbBody');
elemento.parentNode.removeChild(elemento);
	elemento=document.getElementById('adExp');
elemento.parentNode.removeChild(elemento);
	elemento=document.getElementById('zaz-app-navbar');
elemento.parentNode.removeChild(elemento);
	elemento=document.getElementById('tfbIframe');
elemento.parentNode.removeChild(elemento);
	elemento=document.getElementById('chatHeaderResult');
elemento.parentNode.removeChild(elemento);
	elemento=document.getElementById('tfbIframe');
elemento.parentNode.removeChild(elemento);
	elemento=document.getElementById('zaz--app-navbar-relative-container');
elemento.parentNode.removeChild(elemento);
	elemento=document.getElementById('zaz-nb-plugin-ad');
elemento.parentNode.removeChild(elemento);
	
};
