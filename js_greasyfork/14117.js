// ==UserScript==
// @name        antiwomen
// @namespace   antiwomen
// @include     *antiwomen.ru/ff/*
// @version     0.9.2
// @grant       none
// @description	userscript для АБФ
// @description:ru	userscript для АБФ
// @downloadURL https://update.greasyfork.org/scripts/14117/antiwomen.user.js
// @updateURL https://update.greasyfork.org/scripts/14117/antiwomen.meta.js
// ==/UserScript==
document.querySelectorAll('td.bodyline table:first-child td:first-child')[0].style.display = 'none';
document.querySelectorAll('td.bodyline table:first-child .gen')[0].style.display = 'none';

function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

function main() {
	var data = new CreateData(JSON.parse(localStorage.getItem('USAWData'))),
		settings = new SettingsHendler();

	initUI();

	function initUI(){
		
		//Тема
		if (/\/viewtopic\.php/.test(location.href)){
			jQ('table.forumline tbody > tr').each(function(){
				var $spanName = jQ(this).find('td:first > span.name'),
					b = $spanName.children('b:first');
				
				if (b.size()){
                    
                    b.css({
                        'cursor' : 'pointer',
                        'color' : typeof data.userColors[b.text()] == 'undefined' ? 'inherit' : data.userColors[b.text()]
                    }).click(function(){
                        var setColor = prompt('Укажите цвет в HEX формате. Если сомневаетесь, оставьте поле как есть (будет красный).', data.userColors[b.text()] ? data.userColors[b.text()] : '#FF0000');
                        
                        if (setColor == null || !/^#(?:[0-9a-f]{3}){1,2}$/i.test(setColor)){
                            jQ('table.forumline tbody > tr').each(function(){
                                var $b = jQ(this).find('td:first > span.name').children('b:first');
                                if ($b.size() && $b.text() == b.text())
                                    $b.css('color', 'inherit');
                            });
                            data.userColors[b.text()] = undefined;
                        } else {
                            jQ('table.forumline tbody > tr').each(function(){
                                var $b = jQ(this).find('td:first > span.name').children('b:first');
                                if ($b.size() && $b.text() == b.text())
                                    $b.css('color', setColor);
                            });
                            data.userColors[b.text()] = setColor;
                        }
                        
                        SaveDate()
                    })
                    
					$spanName.prepend('<a href="javascript:void(0);" style="font-size:14px; text-decoration:none" onclick="USAWAuthorHide(this)" title="Скрыть сообщения">&#9746;</a> <a href="javascript:void(0)" class="usaw-add-favorite" onclick="addFavorites(\''+b.text()+'\')" style="font-size:14px; text-decoration:none" title="Выделять сообщения пользователя">&#9734;</a> ');
				
					if (data.authorHiddens.indexOf(b.text())+1)
						hiddenMessage(jQ(this), b.text(), jQ(this).children('td:first').attr('class'));
						
					if (typeof data.favorites[b.text()] != 'undefined')
						allocatePostsFavorites(jQ(this), data.favorites[b.text()])
				}
			});
            
			if (settings.get('show-popup-hidden')){
				jQ(document).on('mouseenter', 'td.usaw-hidden-user-post', function(){
					var $this = jQ(this);
					if ($this.find('.postbody').size() == 0){
						var postbody = $this.prev().find('.postbody:first').parent(),
							$popup = jQ('<div class="usaw-popup-post">'+postbody.html()+'</div>');
					
						$popup.css({
							position : 'absolute',
							background : '#EFEFEF',
							padding: '12px',
							border : '#585858 1px solid',
							textAlign : 'left',
							marginTop : '7px',
							width : '80%',
							zIndex : 1000,
							boxShadow : '3px 3px 2px #000'
						})
						
						$popup.mouseenter(function(){
							jQ(this).remove()
						})
						
						$this.append($popup)
					}
				});
				
				jQ(document).on('mouseleave', 'td.usaw-hidden-user-post', function(){
					jQ(this).find('.usaw-popup-post').remove()
				});
			}
            
			if (settings.get('font-big')){
				jQ('td.quote').css('font-size','14px');
				jQ('span.postbody').css('font-size','14px');
			}
			jQ('span.postbody br').css('margin-bottom','7px');
		} else
		//Главная
		if (/(ff\/|index\.php)$/.test(location.href)){
			jQ('td.rowpic').each(function(){
				var $td = jQ(this);
				if (data.hideForums[$td.closest('tr').index()]){
					hideForums($td)
				} else {
					showForums($td)
				}
			});
		} else
		//Ответ
		if (/\/posting\.php\?mode=quote/.test(location.href)){
			if (settings.get('delete-double-quotation'))
				deleteDoubleQuotation();
		}
		
		//Редактирование заголовка
		jQ('span.maintitle:first').css('cursor','pointer').click(function(){
			var newTitle = prompt('Укажите новый заголовок', data.title ? data.title : jQ(this).text());
			if (newTitle == null)
				return;
				
			setTitle(newTitle);
			data.title = newTitle;
			SaveDate()
		});
		
		if (data.title)
			setTitle(data.title);
	}

	window.USAWHideForums = function(divClick){
		var $td = jQ(divClick).closest('td');
		hideForums($td);
		data.hideForums[$td.closest('tr').index()] = true;
		SaveDate();
	}
	
	window.USAWShowForums = function(divClick){
		var $td = jQ(divClick).closest('td');
		showForums($td);
		data.hideForums[$td.closest('tr').index()] = false;
		SaveDate();
	}
	
	function hideForums($td){
		$td.html('<div onclick="USAWShowForums(this)" style="float: right;width: 20px;text-align: center;border: 1px solid black; cursor:pointer">&#43;</div>');
		var $tr = $td.closest('tr'),
			$next = $tr.next();
			
		while($next.size() && ($next.children('td:first').hasClass('row1') || $next.children('td:first').hasClass('row2'))){
			$next.hide();
			$next = $next.next();
		}
	}
	
	function showForums($td){
		$td.html('<div onclick="USAWHideForums(this)" style="float: right;width: 20px;text-align: center;border: 1px solid black;cursor:pointer">&#45;</div>');
		var $tr = $td.closest('tr'),
			$next = $tr.next();
			
		while($next.size() && ($next.children('td:first').hasClass('row1') || $next.children('td:first').hasClass('row2'))){
			$next.show();
			$next = $next.next();
		}
	}
	
	window.USAWAuthorHide = function(link){
		var name = jQ(link).closest('span').find('b:first').text();
		
		if (data.authorHiddens.indexOf(name)+1 == 0){
			data.authorHiddens.push(name);
			data.authorHiddensReasons[name] = prompt('Укажите причину скрытия сообщений данного пользователя', typeof data.authorHiddensReasons[name] != 'undefined' ? data.authorHiddensReasons[name] : '');
		}
		
		jQ('table.forumline tr td span.name b').each(function(){
			if (jQ(this).text() == name)
				hiddenMessage(jQ(this).closest('tr'), name, jQ(link).closest('tr').children('td:first').attr('class'));
		});
		
		SaveDate();
		return false;
	}

	window.USAWAuthorShow = function(link, name){
		var newHiddensData = [];
		data.authorHiddens.forEach(function(oName){
			if (oName == name) return;
			newHiddensData.push(oName);
		});
		data.authorHiddens = newHiddensData;
		SaveDate();
		jQ('table.forumline tr td span.name b').each(function(){
			if (jQ(this).text() == name){
				jQ(this).closest('tr').children('td').show();
				jQ(this).closest('tr').next().children('td').show();
				jQ(this).closest('tr').children('td:last').remove()
			}     
		});
	}

	window.addFavorites = function(userName){
		if (typeof data.favorites[userName] == 'undefined'){
			data.favorites[userName] = prompt('Укажите цвет в HEX формате. Если сомневаетесь, оставьте поле как есть.', '#FFFAF0');
			jQ('table.forumline tr td span.name b').each(function(){
				if (jQ(this).text() == userName){
					allocatePostsFavorites(jQ(this).closest('tr'), data.favorites[userName]);
				}
			});
		} else {
			data.favorites[userName] = undefined;
			jQ('table.forumline tr td span.name b').each(function(){
				if (jQ(this).text() == userName){
					deallocatePostsFavorites(jQ(this).closest('tr'));
				}
			});
		}
		SaveDate()
	}

	function allocatePostsFavorites($tr, color){
		$tr.children('td').css('background-color', /^#(?:[0-9a-f]{3}){1,2}$/i.test(color) ? color : $tr.children('td:first').hasClass('row1') ? '#FFFAF0' : '#FAEBD7');
		$tr.find('a.usaw-add-favorite').html('&#9733;')
	}
    
	function deallocatePostsFavorites($tr){
		$tr.children('td').css('background-color', '')
		$tr.find('a.usaw-add-favorite').html('&#9734;')
	}

	function hiddenMessage($tr, userName, setRowClass){
		$tr.children('td').hide();
		$tr.next().children('td').hide();
		$tr.append('<td class="'+setRowClass+' usaw-hidden-user-post" colspan="2" style="font-size:11px; text-align:right"><b class="name" style="color:#ccc">'+userName+'</b> <i style="color:#ccc">'+data.authorHiddensReasons[userName]+'</i> <a style="color:#ccc" href="javascript:void(0);" onclick="USAWAuthorShow(this, \''+userName+'\')">Отображать сообщения</a></td>');   
	}

	function setTitle(title){
		jQ('head title').text(jQ('head title').text().replace(/[^:]*(.*)/i,title + ' $1'));
		jQ('span.maintitle:first').text(title);
	}
	
	function SaveDate(){
		localStorage.setItem('USAWData', JSON.stringify(data))
	}

	function CreateData(json){
		return {
			authorHiddens : json === null ? [] : json.authorHiddens,
			authorHiddensReasons : json === null ? {} : json.authorHiddensReasons ? json.authorHiddensReasons : {},
			favorites : json === null ? {} : json.favorites ? json.favorites : {},
			userColors : json === null ? {} : json.userColors ? json.userColors : {},
			hideForums : json === null ? {} : json.hideForums ? json.hideForums : {},
			title : json === null ? false : json.title
		}
	}
	
	function deleteDoubleQuotation(){
		var $textarea = jQ('textarea.post'),
			clearText = $textarea.val(),
			startM = clearText.match(/^(\[quote="[\wа-яё\.\s]+?"\])/i),
			i = 0;
			
		clearText = clearText.replace(startM[1], '');
		
		while(/(?:\[quote(?:="[\wа-яё\.\s]+?")?\])(?!(?:\[quote))(?:[\s\S]*?)\[\/quote\]/gi.test(clearText)){
			clearText = clearText.replace(/(?:\[quote(?:="[\wа-яё\.\s]+?")?\])(?!(?:\[quote))(?:[\s\S]*?)\[\/quote\]/gi,'')
			//Защита от багованой регулярки
			if (i > 10)
				break;
			i++;
		}
		
		$textarea.val(startM[1] + clearText)
	}
	
	function SettingsHendler(){
		var methods = {},
			$button = jQ('<div style="position: absolute;right: 15px;font-size: 28px;"><a style="text-decoration: none;" href="#">&#9881;</a></div>'),
			$settings;
		
		methods.showButton = function(){
			jQ('body:first').prepend($button)
		}
		
		methods.showSettings = function(){
			if (jQ.type($settings) == 'undefined'){
				$settings = jQ('<div style="position: absolute;right: 10px;background: white;padding: 5px;border: 1px solid black;z-index: 10;width: 370px;"><b>Настройки UserScript АБФ</b><a href="#" style="text-decoration: none;text-decoration: none;float: right;border: 3px outset;width: 22px;text-align: center;" class="usa-close">&#10060;</a>'+
					'<div><label><input type="checkbox" name="show-popup-hidden" '+(methods.get('show-popup-hidden') ? 'checked' : '')+'/> Отображать содержимое постов скрытых авторов при наведение.</label></div>'+
					'<div><label><input type="checkbox" name="font-big"'+(methods.get('font-big') ? 'checked' : '')+'/> Увеличить шрифт.</label></div>'+
					'<div><label><input type="checkbox" name="delete-double-quotation"'+(methods.get('delete-double-quotation') ? 'checked' : '')+'/> Удалять двойное цитирование при ответе.</label></div>'+
				'</div>');
				jQ('body:first').prepend($settings);
				
				jQ('a.usa-close',$settings).click(function(){$settings.hide();return false;})
				jQ('input[type="checkbox"]',$settings).change(function(){
					var $this = jQ(this);
					methods.set($this.attr('name'),$this.is(":checked"));
				})
			}
			
			$settings.show();
		}
		
		methods.get = function(key){
			var result = localStorage.getItem('USAWS-'+key);
			return (result && result == '1' || jQ.type(result) === 'null') ? true : false;
		}
		
		methods.set = function(key, value){
			localStorage.setItem('USAWS-'+key, value ? '1' : '0');
		}
		
		methods.showButton();
		
		jQ('a', $button).click(function(){
			methods.showSettings();
			return false;
		});
		
		return methods;
	}
}

addJQuery(main);