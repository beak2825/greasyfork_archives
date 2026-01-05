// ==UserScript==
// @name         Para pruebas
// @namespace    Pruebas
// @match        *://www.taringa.net/*
// @version      0.1
// @description  Caza tools
// @icon         https://a.fsdn.com/allura/p/taringaapp/icon
// @copyright    Varios
// @downloadURL https://update.greasyfork.org/scripts/17640/Para%20pruebas.user.js
// @updateURL https://update.greasyfork.org/scripts/17640/Para%20pruebas.meta.js
// ==/UserScript==
'use stric';
$('.facebook-box').hide();
(function() {
        var aux = 0;
        var htmlToBBCode = function(html) {

  html = html.replace(/<pre(.*?)>(.*?)<\/pre>/gmi, "[code]$2[/code]");

    html = html.replace(/<h[1-7](.*?)>(.*?)<\/h[1-7]>/, "\n[b]$2[/b]\n");

    //paragraph handling:
    //- if a paragraph opens on the same line as another one closes, insert an extra blank line
    //- opening tag becomes two line breaks
    //- closing tags are just removed
    // html += html.replace(/<\/p><p/<\/p>\n<p/gi;
    // html += html.replace(/<p[^>]*>/\n\n/gi;
    // html += html.replace(/<\/p>//gi;

    html = html.replace(/<br(.*?)>/gi, "\n");
    html = html.replace(/<textarea(.*?)>(.*?)<\/textarea>/gmi, "\[code]$2\[\/code]");
    html = html.replace(/<b>/gi, "[b]");
    html = html.replace(/<i>/gi, "[i]");
    html = html.replace(/<u>/gi, "[u]");
    html = html.replace(/<\/b>/gi, "[/b]");
    html = html.replace(/<\/i>/gi, "[/i]");
    html = html.replace(/<\/u>/gi, "[/u]");
    html = html.replace(/<em>/gi, "[b]");
    html = html.replace(/<\/em>/gi, "[/b]");
    html = html.replace(/<strong>/gi, "[b]");
    html = html.replace(/<\/strong>/gi, "[/b]");
    html = html.replace(/<cite>/gi, "[i]");
    html = html.replace(/<\/cite>/gi, "[/i]");
    html = html.replace(/<font color="(.*?)">(.*?)<\/font>/gmi, "[color=$1]$2[/color]");
    html = html.replace(/<font color=(.*?)>(.*?)<\/font>/gmi, "[color=$1]$2[/color]");
    html = html.replace(/<link(.*?)>/gi, "");
    html = html.replace(/<li(.*?)>(.*?)<\/li>/gi, "[*]$2");
    html = html.replace(/<ul(.*?)>/gi, "[list]");
    html = html.replace(/<\/ul>/gi, "[/list]");
    html = html.replace(/<div>/gi, "\n");
    html = html.replace(/<\/div>/gi, "\n");
    html = html.replace(/<td(.*?)>/gi, " ");
    html = html.replace(/<tr(.*?)>/gi, "\n");

    html = html.replace(/<img(.*?)src="(.*?)"(.*?)>/gi, "[img]$2[/img]");
    html = html.replace(/<a(.*?)href="(.*?)"(.*?)>(.*?)<\/a>/gi, "[url=$2]$4[/url]");
    
    html = html.replace(/<head>(.*?)<\/head>/gmi, "");
    html = html.replace(/<object>(.*?)<\/object>/gmi, "");
    html = html.replace(/<script(.*?)>(.*?)<\/script>/gmi, "");
    html = html.replace(/<style(.*?)>(.*?)<\/style>/gmi, "");
    html = html.replace(/<title>(.*?)<\/title>/gmi, "");
    html = html.replace(/<!--(.*?)-->/gmi, "\n");

    html = html.replace(/\/\//gi, "/");
    html = html.replace(/http:\//gi, "http://");

    html = html.replace(/<(?:[^>'"]*|(['"]).*?\1)*>/gmi, "");
    html = html.replace(/\r\r/gi, ""); 
    html = html.replace(/\[img]\//gi, "[img]");
    html = html.replace(/\[url=\//gi, "[url=");

    html = html.replace(/(\S)\n/gi, "$1 ");

    return html;
};     
	var successCount    = 0,
		total           = 0,
		totalCount      = 0,
		IS_POST_SECTION = false,
		POST_TIMEOUT    = 45000,
        SHOUTS_TIMEOUT    = 200000,
		SHOUT_TIMEOUT   = 5000,
		COMMENTS        = [
			'',
			'',
			'',
		],
		IMAGES          = [
			'',
			'',
			'',
		],
		SHOUTS          = [
			'Discupen las molestias :)',
			'Discupen las molestias :)',
			'Discupen las molestias :)',
			'Discupen las molestias :)',
		];
         
    function getRnd(arr) {
             return arr[Math.floor(Math.random() * arr.length)];
   }
    var api = 'https://query.yahooapis.com/v1/public/yql?q=select%20description%20from%20rss%20where%20url%3D%27http%3A%2F%2Fwww.1000chistes.com%2Ffeed.php%27&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
         $.getJSON( api, function(json) {
         var array =  json.query.results.item;
         Array.prototype.aleatorio = function(){
  return this[Math.floor(Math.random()*this.length)];
};
    var random = array.aleatorio();
    var listo = random.description;
    
    function shout() { 
         aux=2;
        
    $.ajax({
			type     : 'POST',
			dataType : 'json',
			url      : '/ajax/shout/add',
			data     : {
				key             : global_data.user_key,
				body            : htmlToBBCode(listo),
				privacy         : 0,
				attachment_type : 1,
				attachment      : getRnd(IMAGES)
			},
        });
        setInterval(shout,SHOUTS_TIMEOUT);
    }
         
    
    function newComment(options) {
		return new Promise(function(resolve, reject) {
			if ( IS_POST_SECTION ) {
				$.getJSON('' + options.userId, function(data) {
					$.ajax({
						type : 'POST',
						url  : '/ajax/comments/add',
						data : 'comment='      + encodeURIComponent(ok) +
							   '&key='         + global_data.user_key +
							   '&objectId='    + options.postId +
							   '&objectOwner=' + data.id +
							   '&objectType='  + 'post'  +
							   '&show='        + false,
						error: function() {
							totalCount++;
							ui();
							setTimeout(resolve, POST_TIMEOUT);
						},
						success: function() {
							successCount++;
							totalCount++;
							ui();
							setTimeout(resolve, POST_TIMEOUT);
						}
					});
				});
			}
			else {
				$.ajax({
					type     : 'POST',
					dataType : 'json',
					url      : '/serv/comment/add/' + options.shoutId,
					data     : {
						object_type : 'shout',
						body        : ok,
					},
					error: function() {
						totalCount++;
						ui();
						setTimeout(reject, SHOUT_TIMEOUT);
					},
					success: function() {
						successCount++;
						totalCount++;
						ui();
						setTimeout(resolve, SHOUT_TIMEOUT);
					}
				});
			}
		});
	}

         
    function walk() {
		var previous;

		if ( IS_POST_SECTION ) {
			$('div.list-l ul li').each(function() {
				var $postNode = $(this),
					options   = {
						postId : $postNode.data('post-id'),
						userId : $postNode.find('a.usuario').attr('title')
					};

				if ( !previous ) {
					previous = newComment(options);
				}
				else {
					previous = previous.then(function() {
						return newComment(options);
					});
				}

				total++;
			});
		}
		else {
			$('article.shout-item').each(function() {
				var $shoutNode = $(this),
					options    = {
						shoutId : $shoutNode.data('fetchid')
					};

				if ( !previous ) {
					previous = newComment(options);
				}
				else {
					previous = previous.then(function() {
						return newComment(options);
					});
				}

				total++;
			});
		}
	}
    function like(){
	aux=1;
	$('.Feed-load.active').click();
	$(".require-login.button-action-s.action-vote.hastipsy.pointer").click();
	$(window).scrollTop(0,0);
	setTimeout(like, SHOUT_TIMEOUT);
}
            

	IS_POST_SECTION = !!$('div.list-l ul li').length;

	ui();
    function ui() {
		var exists = !!$('#ui-caza-tool').length;

		if ( !exists ) {
             $('body').append('<div id="ui-caza-tool" style="background-image: url(https://k61.kn3.net/E/F/1/7/7/1/191.gif); border-radius: 10px 10px 10px 10px; -moz-border-radius: 10px 10px 10px 10px; -webkit-border-radius: 10px 10px 10px 10px; border: 0px solid; position: fixed; text-align: center; width: 50px; bottom: 30px; leftt: 20px;  padding: 20px;">' +
				'<center><div style="color:#ffffff">' +
                    '<button data-tooltip="Dar likes automáticos, solo en el Mi." id="ui-caza-tool-like" style="margin: 1px;"><i class="icon-pulgararriba"></i></button>' +
					'<button data-tooltip="Comentar shouts a partir de una lista, solo en sección Shouts." id="ui-caza-tool-comment" style="margin: 1px;"><i class="icon-comments"></i></button>' +
					'<button data-tooltip="Crear shouts random." id="ui-caza-tool-shouts" style="margin: 1px;"><i class="icon-shouts"></i></button>' +
                    '<button data-tooltip="Compartir la Url de donde estes." id="ui-caza-tool-compartir" style="margin: 1px;"><i class="icon-share"></i></button>' +
                                  '<br>' +
				'</div>' +
			'</div></center>' +
          '<style type="text/css">' +
'[data-tooltip] {' +
'  position: relative;' +
'  z-index: 10;' +
'  cursor: default;}' +

'[data-tooltip]:before,' +
'[data-tooltip]:after {' +
 ' visibility: hidden;' +
 ' -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";' +
 ' filter: progid: DXImageTransform.Microsoft.Alpha(Opacity=0);' +
 ' opacity: 0;' +
'  pointer-events: none;}' +

'[data-tooltip]:before {' +
 ' position: absolute;' +
 ' bottom: 100%;' +
 ' left: 50%;' +
 ' margin-bottom: 10px;' +
'  margin-left: 30px;' +
 ' padding: 50px;' +
'  width: 50px;' +
  '-webkit-border-radius: 10px;' +
 ' -moz-border-radius: 10px;' +
 ' border-radius: 10px;' +
 ' background-color: #000;' +
 ' background-color: hsla(0, 0%, 20%, 0.9);' +
'  color: #fff;' +
 ' content: attr(data-tooltip);' +
 ' text-align: center;' +
 ' font-size: 12px;' +
 ' line-height: 1.2;}' +

'[data-tooltip]:after {' +
 ' position: absolute;' +
 ' bottom: 150%;' +
 ' left: 150%;' +
 ' margin-left: 0px;' +
 ' width: 0;' +
 ' border-top: 5px solid #000;' +
  'border-top: 5px solid hsla(0, 0%, 20%, 0.9);' +
 ' border-right: 30px solid transparent;' +
'  border-left: 5px solid transparent;' +
 ' content: " ";' +
'  font-size: 0;' +
 ' line-height: 0;}' +
'[data-tooltip]:hover:before,' +
'[data-tooltip]:hover:after {' +
  'visibility: visible;' +
  '-ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";' +
  'filter: progid: DXImageTransform.Microsoft.Alpha(Opacity=100);' +
 ' opacity: 2;}' +
  '</style>');

			$('#ui-caza-tool-comment').click(function() {
                $("#ui-caza-tool-comment").css("background","#e79f14");
				$('#ui-caza-tool-comment').attr('disabled', true);
				walk();
			});
            
            $('#ui-caza-tool-like').click(function() {
	if(aux===0){
		$("#ui-caza-tool-like").css("background","#ff7575");
		like();
	}else{
		alert("Autolike desactivado, por favor espere un momento...");
		location.reload();
	}
            });
                           

			$('#ui-caza-tool-shouts').click(function() {
                if(aux===2){
            $("#ui-caza-tool-shouts").css("background","#2cce68");
                    shout();
                }else{
		alert("Shouts detenido, un momento por favor...");
		location.reload();
				total++;
                    }
            });
		}
        $('#ui-caza-tool-compartir').click(function() {
            var cont = '';
            var link = ''+document.URL+'';
            $("#ui-caza-tool-compartir").css("background","#36BBCE");
            $.ajax({
                    type    : 'POST',
                    dataType: 'json',
                    url     : '/ajax/shout/attach',
                    data    : {
                    url : link
                    },
            success: function(data){
            $.ajax({
            type     : 'POST',
            dataType : 'json',
            url      : '/ajax/shout/add',
            data     : {
                key             : global_data.user_key,
                body            : cont,
                privacy         : 0,
                attachment_type : 3,
                attachment      : data.data.id
		    } 
          });
        }
     });
  });
    }
             });
})();