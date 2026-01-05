// ==UserScript==
// @name        Saiko Animes Download Helper (SADH)
// @namespace   sadh
// @include     /^https?://my\.pcloud\.com/publink/show\?code=.*/
// @include     /^https?://saikoanimes\.net/.*/
// @version     1.3.3
// @description Captura os links de download automaticamente do site Saiko Animes.
// @copyright   2016 Foca.
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/23734/Saiko%20Animes%20Download%20Helper%20%28SADH%29.user.js
// @updateURL https://update.greasyfork.org/scripts/23734/Saiko%20Animes%20Download%20Helper%20%28SADH%29.meta.js
// ==/UserScript==

// Função retirada do StackOverflow.
// Link: http://stackoverflow.com/a/33486055
var MD5 = function(s){function L(k,d){return(k<<d)|(k>>>(32-d))}function K(G,k){var I,d,F,H,x;F=(G&2147483648);H=(k&2147483648);I=(G&1073741824);d=(k&1073741824);x=(G&1073741823)+(k&1073741823);if(I&d){return(x^2147483648^F^H)}if(I|d){if(x&1073741824){return(x^3221225472^F^H)}else{return(x^1073741824^F^H)}}else{return(x^F^H)}}function r(d,F,k){return(d&F)|((~d)&k)}function q(d,F,k){return(d&k)|(F&(~k))}function p(d,F,k){return(d^F^k)}function n(d,F,k){return(F^(d|(~k)))}function u(G,F,aa,Z,k,H,I){G=K(G,K(K(r(F,aa,Z),k),I));return K(L(G,H),F)}function f(G,F,aa,Z,k,H,I){G=K(G,K(K(q(F,aa,Z),k),I));return K(L(G,H),F)}function D(G,F,aa,Z,k,H,I){G=K(G,K(K(p(F,aa,Z),k),I));return K(L(G,H),F)}function t(G,F,aa,Z,k,H,I){G=K(G,K(K(n(F,aa,Z),k),I));return K(L(G,H),F)}function e(G){var Z;var F=G.length;var x=F+8;var k=(x-(x%64))/64;var I=(k+1)*16;var aa=Array(I-1);var d=0;var H=0;while(H<F){Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=(aa[Z]| (G.charCodeAt(H)<<d));H++}Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=aa[Z]|(128<<d);aa[I-2]=F<<3;aa[I-1]=F>>>29;return aa}function B(x){var k="",F="",G,d;for(d=0;d<=3;d++){G=(x>>>(d*8))&255;F="0"+G.toString(16);k=k+F.substr(F.length-2,2)}return k}function J(k){k=k.replace(/rn/g,"n");var d="";for(var F=0;F<k.length;F++){var x=k.charCodeAt(F);if(x<128){d+=String.fromCharCode(x)}else{if((x>127)&&(x<2048)){d+=String.fromCharCode((x>>6)|192);d+=String.fromCharCode((x&63)|128)}else{d+=String.fromCharCode((x>>12)|224);d+=String.fromCharCode(((x>>6)&63)|128);d+=String.fromCharCode((x&63)|128)}}}return d}var C=Array();var P,h,E,v,g,Y,X,W,V;var S=7,Q=12,N=17,M=22;var A=5,z=9,y=14,w=20;var o=4,m=11,l=16,j=23;var U=6,T=10,R=15,O=21;s=J(s);C=e(s);Y=1732584193;X=4023233417;W=2562383102;V=271733878;for(P=0;P<C.length;P+=16){h=Y;E=X;v=W;g=V;Y=u(Y,X,W,V,C[P+0],S,3614090360);V=u(V,Y,X,W,C[P+1],Q,3905402710);W=u(W,V,Y,X,C[P+2],N,606105819);X=u(X,W,V,Y,C[P+3],M,3250441966);Y=u(Y,X,W,V,C[P+4],S,4118548399);V=u(V,Y,X,W,C[P+5],Q,1200080426);W=u(W,V,Y,X,C[P+6],N,2821735955);X=u(X,W,V,Y,C[P+7],M,4249261313);Y=u(Y,X,W,V,C[P+8],S,1770035416);V=u(V,Y,X,W,C[P+9],Q,2336552879);W=u(W,V,Y,X,C[P+10],N,4294925233);X=u(X,W,V,Y,C[P+11],M,2304563134);Y=u(Y,X,W,V,C[P+12],S,1804603682);V=u(V,Y,X,W,C[P+13],Q,4254626195);W=u(W,V,Y,X,C[P+14],N,2792965006);X=u(X,W,V,Y,C[P+15],M,1236535329);Y=f(Y,X,W,V,C[P+1],A,4129170786);V=f(V,Y,X,W,C[P+6],z,3225465664);W=f(W,V,Y,X,C[P+11],y,643717713);X=f(X,W,V,Y,C[P+0],w,3921069994);Y=f(Y,X,W,V,C[P+5],A,3593408605);V=f(V,Y,X,W,C[P+10],z,38016083);W=f(W,V,Y,X,C[P+15],y,3634488961);X=f(X,W,V,Y,C[P+4],w,3889429448);Y=f(Y,X,W,V,C[P+9],A,568446438);V=f(V,Y,X,W,C[P+14],z,3275163606);W=f(W,V,Y,X,C[P+3],y,4107603335);X=f(X,W,V,Y,C[P+8],w,1163531501);Y=f(Y,X,W,V,C[P+13],A,2850285829);V=f(V,Y,X,W,C[P+2],z,4243563512);W=f(W,V,Y,X,C[P+7],y,1735328473);X=f(X,W,V,Y,C[P+12],w,2368359562);Y=D(Y,X,W,V,C[P+5],o,4294588738);V=D(V,Y,X,W,C[P+8],m,2272392833);W=D(W,V,Y,X,C[P+11],l,1839030562);X=D(X,W,V,Y,C[P+14],j,4259657740);Y=D(Y,X,W,V,C[P+1],o,2763975236);V=D(V,Y,X,W,C[P+4],m,1272893353);W=D(W,V,Y,X,C[P+7],l,4139469664);X=D(X,W,V,Y,C[P+10],j,3200236656);Y=D(Y,X,W,V,C[P+13],o,681279174);V=D(V,Y,X,W,C[P+0],m,3936430074);W=D(W,V,Y,X,C[P+3],l,3572445317);X=D(X,W,V,Y,C[P+6],j,76029189);Y=D(Y,X,W,V,C[P+9],o,3654602809);V=D(V,Y,X,W,C[P+12],m,3873151461);W=D(W,V,Y,X,C[P+15],l,530742520);X=D(X,W,V,Y,C[P+2],j,3299628645);Y=t(Y,X,W,V,C[P+0],U,4096336452);V=t(V,Y,X,W,C[P+7],T,1126891415);W=t(W,V,Y,X,C[P+14],R,2878612391);X=t(X,W,V,Y,C[P+5],O,4237533241);Y=t(Y,X,W,V,C[P+12],U,1700485571);V=t(V,Y,X,W,C[P+3],T,2399980690);W=t(W,V,Y,X,C[P+10],R,4293915773);X=t(X,W,V,Y,C[P+1],O,2240044497);Y=t(Y,X,W,V,C[P+8],U,1873313359);V=t(V,Y,X,W,C[P+15],T,4264355552);W=t(W,V,Y,X,C[P+6],R,2734768916);X=t(X,W,V,Y,C[P+13],O,1309151649);Y=t(Y,X,W,V,C[P+4],U,4149444226);V=t(V,Y,X,W,C[P+11],T,3174756917);W=t(W,V,Y,X,C[P+2],R,718787259);X=t(X,W,V,Y,C[P+9],O,3951481745);Y=K(Y,h);X=K(X,E);W=K(W,v);V=K(V,g)}var i=B(Y)+B(X)+B(W)+B(V);return i.toLowerCase()};

// Função retirada do MDN (Mozilla Developer Network)
// Link: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Função retirada do StackOverflow.
// Link: http://stackoverflow.com/a/1349426
function makeId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	var len = getRandomInt(4, 8);

    for (var i = 0; i < len; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

var SADH = {
	domain: document.domain,
	working: false,
	currentTab: null,
	linkElements: null,
	totalLinks: 0,
	retrievedLinks: 0,
	statusBox: null,
	
	init: function() {
		switch (this.domain) {
			case "my.pcloud.com":
				this.setupPCloud();
				break;
				
			case "saikoanimes.net":
				this.setupSaiko();
				break;
		}
	},
	
	setupPCloud: function() {
		var fileName = $('.filename').text();
	
		if (typeof fileName === 'undefined')
			return;
		
		if (fileName.match(/(Saiko\-Anime[s]|Saiko_Anime[s])/)) {
			window.addEventListener('message', function(event) {
				if (typeof event.data.cmd === 'undefined')
					return;
				
				if (event.data.cmd == "getVideoLink") {
					var videoUrl = typeof publinkData !== 'undefined' ? publinkData.downloadlink : '';
					
					if (videoUrl == '')
						videoUrl = $('video').attr('src');
					
					event.source.postMessage({cmd:'retVideoLink', link:videoUrl, id:event.data.id}, "*");
				}
			});
		}
	},
		
	setupSaiko: function() {
		$('.omsc-tab-pcloud').find('a[href]').each(function() {
			var idx = $(this).attr('href').indexOf('protetor.php?url=');
			if (idx > 0) {
				var newUrl = $(this).attr('href').substr(idx).replace('protetor.php?url=', '');
				$(this).attr('href', newUrl);
			}
		});
		
		var self = this;
		self.saikoGUI.create();
		
		window.addEventListener('message', function(event) {
			if (typeof event.data.cmd === 'undefined')				
				return;
			
			if (event.data.cmd == "retVideoLink") {
				var btn = $('a[data-ident=' + event.data.id + ']');
				
				btn.removeClass(self.saikoGUI._masks['downloading']);
				btn.addClass(self.saikoGUI._masks['downloaded']);
				btn.attr('href', event.data.link);
				btn.removeAttr('data-ident');
				
				SADH.saikoGUI.updateStatus();
				
				$('iframe[data-ident=' + event.data.id + ']').remove();
			}
		});
	},
	
	retrieveLinks: function() {
		var self = this;
		var links = $(SADH.linkElements);
		
		this.totalLinks = links.length;
		this.retrievedLinks = 0;
		
		this.saikoGUI.zeroStatus();
		
		var sequence = Promise.resolve();
			
		links.each(function() {
			var href = $(this).attr('href');

			if (href.indexOf('my.pcloud.com/publink/show?code=') < 0) {
				console.warn('INVALID LINK!');
				SADH.saikoGUI.updateStatus();
				return;
			}
			
			var ident = MD5(href);
			$(this).attr('data-ident', ident);
			$(this).addClass(self.saikoGUI._getMasks('sadh-status idle'));
			
			sequence = sequence.then(function() {
				var makeIframe = function(src, id) {
					var btn = $('a[data-ident=' + ident + ']');
					
					btn.removeClass(self.saikoGUI._masks['idle']);
					btn.addClass(self.saikoGUI._masks['downloading']);
					
					var def = $.Deferred();
					var el = $('<iframe style="display: none;"></iframe>').attr({
						'data-ident': id,
						'src': src
					});
					
					el.load(def.resolve);
					el.appendTo('body');
					
					def.done(function() {
						var iframe = $('iframe[data-ident=' + ident + ']')[0];
						iframe.contentWindow.postMessage({cmd:'getVideoLink', id:ident}, '*');
					});
					
					return def.promise();
				};
				
				return makeIframe(href, ident);
			});
		});
	},
	
	saikoGUI: {
		_masks: {
			// Classes.
			'sadh-box': '',
			'fw': '',
			'sadh-pb-container': '',
			'sadh-pb-text': '',
			'sadh-pb-bar': '',
			'sadh-button': '',
			'red': '',
			'green': '',
			'sadh-social': '',
			'sadh-title': '',
			'sadh-content': '',
			'sadh-item-content': '',
			'sadh-item': '',
			'expandButton': '',
			'single': '',
			'inv': '',
			'sadh-info': '',
			'sadh-footer': '',
			'sadh-status': '',
			'idle': '',
			'downloading': '',
			'downloaded': '',
			'pbBox': '',
			'selected': '',
			'content-1': '',
			'content-2': '',
			'itemLoadSelection': '',
			
			// Icons.
			'fa-arrow-circle-o-down': '',
			'fa-twitter': '',
			'fa-facebook-official': '',
			'fa-question': '',
			'fa-warning': '',
			'fa-link': '',
			'fa-tasks': '',
			'faicb': '',
			
			// Roles.
			'loadAll': '',
			'loadSelection': '',
			'loadOk': '',
			'loadCancel': '',
			'EpSelect': '',
			'expButton': '',
			'txtLinks': ''
		},
		
		_initMasks: function() {
			var self = this;
			
			Object.getOwnPropertyNames(this._masks).forEach(function(key) {
				self._masks[key] = makeId();
			});
		},
		
		_fixStyle: function(text) {
			var self = this;
			
			Object.getOwnPropertyNames(this._masks).forEach(function(key) {
				text = text.replace(new RegExp(key, 'g'), self._masks[key]);
			});
			
			return text;
		},
		
		_getMasks: function(classes) {
			var self = this;
			var cls = '';
			
			classes.split(' ').forEach(function(key) {
				cls += self._masks[key] + ' ';
			});
			
			return cls.trim();
		},
		
		create: function() {
			this._initMasks();
			this._loadStyle();
			
			var boxHtml = `
				<div class="sadh-box">
					<div class="sadh-social">
						<a href="https://twitter.com/shitcodebr" target="blank"><i class="faicb fa-twitter"></i></a>&nbsp;
						<a href="https://www.facebook.com/shitcodebr" target="blank"><i class="faicb fa-facebook-official"></i></a>&nbsp;
						<a href="http://shitcodebr.com/2016/10/05/saiko-animes-download-helper-sadh/" target="blank"><i class="faicb fa-question"></i></a>
					</div>
					
					<span class="sadh-title">Saiko Animes Download Helper (SADH)</span>
					
					<div class="sadh-content">
						<div class="sadh-item single">
							<h4><i class="faicb fa-warning"></i> Aviso!</h4>
							<div class="sadh-item-content" style="display: block">
								Lembre-se: vários animes presentes neste site não são encontrados vias "oficiais" (Crunchyroll, por exemplo), portanto, não deixe de apoiar
								o trabalho da Equipe Saiko. Se você não pode pagar o VIP, ao menos desabilite seu AdBlock.
							</div>
						</div>
					
						<div class="sadh-item">
							<div class="sadh-button fw" role="loadAll">Carregar Todos</div>
							<div class="sadh-info">
								Com esta opção será carregado o link de todos os episódios, portanto, poderá levar vários minutos dependendo da sua
								conexão e da quantidade de episódios.
							</div>
						</div>
						
						<div class="sadh-item itemLoadSelection">
							<div class="content-1">
								<div class="sadh-button fw" role="loadSelection">Selecionar Episódios</div>
								<div class="sadh-info">
									Com esta opção será carregado apenas os links que você selecionar.
								</div>
							</div>
							
							<div class="content-2" style="display: none;">
								<div class="sadh-button red" role="loadCancel"><i class="faicb fa-times"></i></div>
								<div class="sadh-button green" role="loadOk" style="float: right;"><i class="faicb fa-check"></i></div>
								<div class="sadh-info">
									Agora, clique nos links que você deseja baixar. Quando terminar, clique no botão verde acima para iniciar. Clique no vermelho
									para cancelar.
								</div>
							</div>
						</div>
						
						<div class="sadh-item inv"></div>
						<div class="sadh-item inv"></div>
						<div class="sadh-item inv"></div>
						
						<div class="sadh-item single pbBox" style="display: none;">
							<h4><i class="faicb fa-tasks"></i> Status</h4>
							
							<div class="sadh-pb-container">
								<div class="sadh-pb-text">0 de 0 (0%)</div>
								<div class="sadh-pb-bar"></div>
							</div>
						</div>
						
						<div class="sadh-item single">
							<div class="expandButton" role="expButton"><i class="faicb fa-arrow-circle-o-down"></i></div>
							<h4><i class="faicb fa-link"></i> Links</h4>
							
							<div class="sadh-item-content">
								<textarea role="txtLinks" readonly></textarea>
							</div>
						</div>
					</div>
					
					<div class="sadh-footer">
					Saiko Animes Download Helper (SADH) foi desenvolvido por Foca. Meu blog: <a href="http://shitcodebr.com" target="blank">shitcodebr.com</a>.
					</div>
				</div>
			`;
			
			var box = $(this._fixStyle(boxHtml));

			$('.omsc-tab-pcloud').prepend(box);

			this._applyEvents();
		},
		
		zeroStatus: function() {
			SADH.statusBox.find('.' + this._masks['sadh-pb-text']).text('0 de ' + SADH.totalLinks + ' (0%)');
			SADH.statusBox.find('.' + this._masks['sadh-pb-bar']).css('width', '0%');
		},
		
		updateStatus: function() {
			SADH.retrievedLinks += 1;
			
			var percent = (SADH.retrievedLinks * 100) / SADH.totalLinks;
			
			SADH.statusBox.find('.' + this._masks['sadh-pb-text']).text(SADH.retrievedLinks + ' de ' + SADH.totalLinks + ' (' + percent.toFixed() + '%)');
			SADH.statusBox.find('.' + this._masks['sadh-pb-bar']).css('width', percent.toFixed(2) + '%');
			
			if (SADH.retrievedLinks >= SADH.totalLinks) {
				SADH.currentTab.find('[role=' + this._masks['txtLinks'] + ']').val(SADH.linkElements.join("\n"));
				SADH.working = false;
				
				var expBtn = SADH.currentTab.find('[role=' + this._masks['expButton'] + ']');
				
				if (expBtn.data('expanded') == 'false')
					expBtn.click();
			}
		},
		
		_applyEvents: function() {
			var self = this;
			
			$('[role=' + self._masks['expButton'] + ']').data('expanded', 'false');
			
			$('.' + self._masks['sadh-box']).find('a').each(function() {
				var href = $(this).attr('href');
				
				$(this).attr('href', '#');
				$(this).removeAttr('target');
				
				$(this).click(function(e) {
					window.open(href, 'blank');
					
					e.preventDefault();
				});
			});

			$('[role=' + self._masks['loadAll'] + ']').click(function() {
				if (SADH.working)
					return;
				
				SADH.currentTab = $(this).parents('.omsc-tab-pcloud');
				SADH.statusBox = SADH.currentTab.find('.' + self._masks['pbBox']);
				
				if (SADH.statusBox.css('display') == 'none')
					SADH.statusBox.slideToggle(400);
				
				SADH.working = true;
				SADH.linkElements = SADH.currentTab.children('a').get();
				SADH.retrieveLinks();
			});
			
			$('[role=' + self._masks['loadSelection'] + ']').click(function() {
				if (SADH.working)
					return;
				
				SADH.currentTab = $(this).parents('.omsc-tab-pcloud');
				SADH.statusBox = SADH.currentTab.find('.' + self._masks['pbBox']);
				
				if (SADH.statusBox.css('display') == 'none')
					SADH.statusBox.slideToggle(400);
				
				SADH.currentTab.children('a').attr('role', self._masks['EpSelect']);
				
				$(this).parent().fadeOut(50, function() {
					$(this).siblings('.' + self._masks['content-2']).fadeIn(50);
				});
			});
			
			$('[role=' + self._masks['loadOk'] + ']').click(function() {
				var links = SADH.currentTab.children('a.' + self._masks['sadh-status'] + '.' + self._masks['idle']);
				
				if (links.length <= 0) {
					alert('Nenhum episódio selecionado!');
					return;
				}
				
				SADH.currentTab.children('a').each(function() {
					$(this).removeAttr('role');
					
					if (!$(this).hasClass(self._masks['selected']))
						$(this).removeClass(self._getMasks('sadh-status idle'));
				});
				
				$(this).parent().fadeOut(50, function() {
					$(this).siblings('.' + self._masks['content-1']).fadeIn(50);
				});
				
				SADH.linkElements = links.get();
				SADH.working = true;
				SADH.retrieveLinks();
			});
			
			$('[role=' + self._masks['loadCancel'] + ']').click(function() {
				$('[role=' + self._masks['EpSelect'] + ']').removeAttr('role').removeClass(self._getMasks('sadh-status idle'));
				
				$(this).parent().fadeOut(50, function() {
					$(this).siblings('.' + self._masks['content-1']).fadeIn(50);
				});
			});
			
			$('[role=' + self._masks['expButton'] + ']').click(function() {
				$(this).siblings('.' + self._masks['sadh-item-content']).slideToggle(450);
				
				var exp = $(this).data('expanded');
				var icon = $(this).children('i');
				
				$(this).data('expanded', exp == 'true' ? 'false' : 'true');
				exp = exp == 'true' ? 'false' : 'true';
				
				if (exp == 'true') {
					icon.removeClass(self._getMasks('faicb fa-arrow-circle-o-down'));
					icon.addClass(self._getMasks('faicb fa-arrow-circle-o-up'));
				} else {
					icon.removeClass(self._getMasks('faicb fa-arrow-circle-o-up'));
					icon.addClass(self._getMasks('faicb fa-arrow-circle-o-down'));
				}
			});
			
			$('body').on('click', '[role=' + self._masks['EpSelect'] + ']', function(e) {
				$(this).toggleClass(self._getMasks('sadh-status idle selected'));
				
				e.preventDefault();
			});
		},
		
		_loadStyle: function() {
			var style = `
				[role=txtLinks] {
					width: 100%;
					height: 200px;
					resize: none;
					margin-bottom: 0;
					word-wrap: normal;
					word-break: keep-all;
				}
			
				.fw {
					width: 100%;
				}
				
				.sadh-pb-container {
					position: relative;
					display: block;
					width: 100%;
					height: 30px;
					background: #adadad;
					color: #fff !important;
				}
				
				.sadh-pb-text {
					position: absolute;
					width: 100%;
					height: 100%;
					font-size: 13px;
					line-height: 28px;
					text-align: center;
					z-index: 10;
				}
				
				.sadh-pb-bar {
					position: absolute;
					width: 0%;
					height: 100%;
					background: #0090ff;
					left: 0;
					top: 0;
				}
				
				.sadh-button {
					display: inline-block;
					font-size: 14px;
					font-family: 'Open Sans';
					padding: 12px 0;
					color: #fff;
					background: rgba(0, 0, 0, 0.55);
					text-align: center;
					cursor: pointer;
					min-width: 74px;
				}
				
				.sadh-button:hover {
					background: rgba(0, 0, 0, 0.4);
				}
				
				.sadh-button.red {
					background: #da4453;
				}
				
				.sadh-button.red:hover {
					background: #ed5565;
				}
				
				.sadh-button.green {
					background: #8cc152;
				}
				
				.sadh-button.green:hover {
					background: #a0d468;
				}
				
				.sadh-box {
					display: block;
					position: relative;
					width: calc(100% - 2px);
					box-sizing: border-box;
					border: 1px solid #c5c5c5;
					padding: 10px;
					margin-bottom: 10px;
				}
				
				.sadh-box .sadh-social {
					position: absolute;
					padding: 5px;
					right: 0;
					top: 0;
				}

				.sadh-box .sadh-title {
					display: block;
					width: 100%;
					padding: 0 0 15px 0;
					font-family: 'Open Sans';
					font-size: 18px;
					color: #434a54;
					text-align: center;
				}
				
				.sadh-box .sadh-content {
					display: flex;
					flex-flow: row wrap;
					justify-content: space-around;
				}
				
				.sadh-content .sadh-item {
					display: block;
					position: relative;
					box-sizing: border-box;
					width: 180px;
					border: 1px solid #c5c5c5;
					padding: 10px;
					margin-bottom: 10px;
					color: #111;
				}
				
				.sadh-item-content {
					display: none;
					margin-top: 10px;
				}
				
				.sadh-item .expandButton {
					position: absolute;
					top: 14px;
					right: 10px;
					font-size: 14px;
					cursor: pointer;
				}
				
				.sadh-item h4 {
					margin-top: 0;
					margin-bottom: 0;
					font-size: 18px;
					font-weight: bold;
				}
				
				.sadh-item.single {
					width: calc(100% - 7px);
				}
				
				.sadh-item.inv {
					height: 0;
					opacity: 0;
					margin-bottom: 0;
					padding: 0 10px;
				}
				
				.sadh-item .sadh-info {
					width: 100%;
					padding-top: 18px;
					line-height: 14px;
					font-family: 'Open Sans';
					font-size: 12px;
					color: #777;
				}
				
				.sadh-box .sadh-footer {
					width: 100%;
					margin-top: 32px;
					font-family: 'Open Sans';
					font-size: 12px;
					font-style: italic;
					color: #444;
				}
				
				.sadh-footer:after {
					position: absolute;
					right: 10px;
					content: '1.3.3';
					color: #f00000;
					font-style: normal;
				}
				
				.sadh-footer a {
					text-decoration: underline;
				}
				
				.sadh-status:before {
					position: absolute;
					content: '';
					width: 100%;
					height: 4px;
					left: 0;
					top: 0;
				}
				
				.sadh-status.idle:before {
					background: #000;
				}
				
				.sadh-status.downloading:before {
					background: #ff7200;
				}
				
				.sadh-status.downloaded:before {
					background: #0090ff;
				}
				
				.faicb {
					display: inline-block;
					font: normal normal normal 14px/1 FontAwesome;
					font-size: inherit;
					text-rendering: auto;
					-webkit-font-smoothing: antialiased;
					-moz-osx-font-smoothing: grayscale;
				}
				
				.fa-arrow-circle-o-down:before {
					content: '\\f01a';
				}

				.fa-twitter:before {
					content: '\\f099';
				}
				
				.fa-facebook-official:before {
					content: '\\f230';
				}
				
				.fa-question:before {
					content: '\\f128';
				}
				
				.fa-warning:before {
					content: '\\f071';
				}
				
				.fa-link:before {
					content: '\\f0c1';
				}
				
				.fa-tasks:before {
					content: '\\f0ae';
				}
			`;
			
			$(document.head).append('<style type="text/css">' + this._fixStyle(style) + '</style>');
		}
	}
}

$(document).ready(function() {
	SADH.init();
});