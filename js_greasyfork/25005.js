// ==UserScript==
// @name         Better Peka2.TV
// @namespace    http://tampermonkey.net/
// @version      50
// @description  The script adds emote functions in the chat.
// @author       SeregPie
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @match        http://peka2.tv/*
// @downloadURL https://update.greasyfork.org/scripts/25005/Better%20Peka2TV.user.js
// @updateURL https://update.greasyfork.org/scripts/25005/Better%20Peka2TV.meta.js
// ==/UserScript==

(function() {
	'use strict';

	!function(a){var b=a.extend(!0,function(a){this._parentEdge=a,this._childNodes=new Map,this._handleObjects=[]},{prototype:{signal:function(b){b=null===b?[null]:a.makeArray(b);var c=[];this._collectCallables(c,b,0),c.forEach(function(a){try{a()}catch(a){}})},_collectCallables:function(b,c,d){if(this._handleObjects.forEach(function(d){var e=a.Event("signal",d);b.push(function(){e.handler.apply(e.target,[e].concat(c))})}),c.length>d){var e=this._childNodes.get(c[d]);if(e){var f=c.slice();f.splice(d,1),e._collectCallables(b,f,d)}if(e=this._childNodes.get(a)){var g=d+1;e._collectCallables(b,c,g)}}},addHandleObject:function(b){var c=b.data;return c=null===c?[null]:a.makeArray(c),this._addHandleObject(b,c)},_addHandleObject:function(c,d){if(d.length){var e=d[0],f=this._childNodes.get(e);return f||this._childNodes.set(e,f=new b([this,e])),f._addHandleObject(c,d.slice(1))}return this._handleObjects.push(c),{dispose:a.proxy(function(){var b=a.inArray(c,this._handleObjects);b>=0&&(this._handleObjects.splice(b,1),this._removeIfEmpty())},this)}},_removeChildNode:function(a){this._childNodes.delete(a),this._removeIfEmpty()},_removeIfEmpty:function(){this.isEmpty()&&this._parentEdge&&this._parentEdge[0]._removeChildNode(this._parentEdge[1])},isEmpty:function(){return!this._handleObjects.length&&!this._childNodes.size}}}),c=new b;a.signal=function(){return c.signal(arguments)},a.event.special.signal={noBubble:!0,add:function(a){a.data=c.addHandleObject({currentTarget:this,data:a.data,handler:a.handler,namespace:a.namespace,target:this})},remove:function(a){a.data.dispose()}}}(jQuery);

	const ns = {};

	ns.peka2tv = $.extend(true, function(storage_key) {
		this.storage_event_listener = ns.peka2tv._storage_event_listener.bind(this);
		this._storage_key = storage_key;
		this._emotes = {};
		this._source_emotes_hidden = {};
		this._chat_message_gap_decrease = 1;
		this._stretch_emote_list = true;
		this._load();
	}, {
		_storage_event_listener(event) {
			if (event.originalEvent.key === this._storage_key) {
				this._reload();
			}
		},

		_emote_sources: {
			'twitch.tv': {
				purify_emote(emote) {
					return emote.toLowerCase().replace(/(^\s*(:(tw-)?)?)|((:)?\s*$)/g, '');
				},

				get_code(emote) {
					return ':tw-'+emote+':';
				},

				get_image_url(emote, value) {
					return 'https://static-cdn.jtvnw.net/emoticons/v1/'+value+'/1.0';
				},

				get_value(emote, callback) {
					this.get_values(values => {
						let value = values[emote];
						if (value) {
							callback(value);
						}
					});
				},

				_values: null,

				get_values(callback) {
					if (this._values === null) {
						let deferred = $.Deferred();
						Promise.all([
							new Promise(resolve => {
								let attempt = () => {
									$.get('https://twitchemotes.com/api_cache/v2/global.json')
										.done(resolve)
										.fail(() => setTimeout(attempt, 5 * 1000));
								};
								attempt();
							}),
							new Promise(resolve => {
								let attempt = () => {
									$.get('https://twitchemotes.com/api_cache/v2/subscriber.json')
										.done(resolve)
										.fail(() => setTimeout(attempt, 5 * 1000));
								};
								attempt();
							}),
						])
							.then(([global_emotes, subscriber_emotes]) => {
								let values = {};
								$.each(subscriber_emotes.unknown_emotes.emotes, (i, obj) => {
									let emote = obj.code.toLowerCase();
									let value = obj.image_id;
									values[emote] = value;
								});
								$.each(subscriber_emotes.channels, (channel, obj) => {
									$.each(obj.emotes, (i, obj) => {
										let emote = obj.code.toLowerCase();
										let value = obj.image_id;
										values[emote] = value;
									});
								});
								$.each(global_emotes.emotes, (code, obj) => {
									let emote = code.toLowerCase();
									let value = obj.image_id;
									values[emote] = value;
								});
								deferred.resolve(values);
							});
						this._values = deferred.promise();
					}
					$.when(this._values).done(values => callback(JSON.parse(JSON.stringify(values))));
				},
			},

			'goodgame.ru': {
				purify_emote(emote) {
					return emote.toLowerCase().replace(/(^\s*(:(gg-)?)?)|((:)?\s*$)/g, '');
				},

				get_code(emote) {
					return ':gg-'+emote+':';
				},

				_image_base_url: 'https://goodgame.ru/images/',

				get_image_url(emote, value) {
					return this._image_base_url+value;
				},

				get_value(emote, callback) {
					this.get_values(values => {
						let value = values[emote];
						if (value) {
							callback(value);
						}
					});
				},

				_values: null,

				get_values(callback) {
					if (this._values === null) {
						let values = {};
						let deferred = $.Deferred();
						let collect_values = (page) => {
							return new Promise(resolve => {
								let attempt = () => {
									let proxy = 'https://cors-anywhere.herokuapp.com/';
									$.get(proxy+'http://api2.goodgame.ru/v2/smiles?page='+page)
										.done(json => {
											console.log(json);
											$.each(json._embedded.smiles, (i, obj) => {
												let emote = obj.key.toLowerCase();
												let value = obj.urls.big.substr(this._image_base_url.length).replace(/\?\d+$/, '');
												values[emote] = value;
											});
											resolve(json);
										})
										.fail(() => setTimeout(attempt, 5 * 1000));
								};
								attempt();
							});
						};
						collect_values(1).then(json => {
							let promises = [];
							for (let page = 2, pages = json.page_count; page <= pages; page++) {
								promises.push(collect_values(page));
							}
							Promise.all(promises).then(() => deferred.resolve(values));
						});
						this._values = deferred.promise();
					}
					$.when(this._values).done(values => callback(JSON.parse(JSON.stringify(values))));
				},
			},
		},

		get_emote_sources() {
			return Object.keys(this._emote_sources);
		},

		prototype: {
			import(data) {
				try {
					this._put_data(data);
					this._save_data(data);
				} catch (err) {}
			},

			export() {
				return this._get_data();
			},

			_load() {
				try {
					this._reload();
				} catch (err) {}
			},

			_reload() {
				try {
					let data = this._load_data();
					this._put_data(data);
				} catch (err) {}
			},

			_save() {
				try {
					let data = this._get_data();
					this._save_data(data);
				} catch (err) {}
			},

			_load_data() {
				return JSON.parse(localStorage.getItem(this._storage_key));
			},

			_save_data(data) {
				localStorage.setItem(this._storage_key, JSON.stringify(data));
			},

			_get_data() {
				let data = {
					emotes: this._emotes,
					source_emotes_hidden: this._source_emotes_hidden,
					chat_message_gap_decrease: this._chat_message_gap_decrease,
					stretch_emote_list: this._stretch_emote_list,
				};
				return data;
			},

			_put_data(data) {
				$.each(data.emotes, (source, emotes) => {
					this._set_emotes(source, emotes);
				});
				$.each(data.source_emotes_hidden, (source, emotes_hidden) => {
					this._set_source_emotes_hidden(source, emotes_hidden);
				});
				if (data.chat_message_gap_decrease !== undefined) {
					this._set_chat_message_gap_decrease(data.chat_message_gap_decrease);
				}
				if (data.stretch_emote_list !== undefined) {
					this._set_stretch_emote_list(data.stretch_emote_list);
				}
			},

			get_emotes(source) {
				return Object.keys(this._emotes[source] || {});
			},

			get_emote_code(source, emote) {
				emote = ns.peka2tv._emote_sources[source].purify_emote(emote);
				let value = (this._emotes[source] || {})[emote];
				if (value === undefined) return '';
				return ns.peka2tv._emote_sources[source].get_code(emote, value);
			},

			get_emote_image_url(source, emote) {
				emote = ns.peka2tv._emote_sources[source].purify_emote(emote);
				let value = (this._emotes[source] || {})[emote];
				if (value === undefined) return '';
				return ns.peka2tv._emote_sources[source].get_image_url(emote, value);
			},

			add_emote(source, emote, callback) {
				emote = ns.peka2tv._emote_sources[source].purify_emote(emote);
				callback = callback || $.noop;
				ns.peka2tv._emote_sources[source].get_value(emote, value => {
					if (this._add_emote(source, emote, value)) {
						this._save();
						callback();
					}
				});
			},

			add_random_emotes(source, count, callback) {
				callback = callback || $.noop;
				ns.peka2tv._emote_sources[source].get_values(values => {
					let emotes = this.get_emotes(source);
					emotes.forEach(emote => delete values[emote]);
					emotes = Object.keys(values);
					count = Math.min(count, emotes.length);
					while (count-- > 0) {
						let emote = emotes.splice(Math.floor(Math.random() * emotes.length), 1)[0];
						let value = values[emote];
						this._add_emote(source, emote, value);
					}
					callback();
				});
			},

			_add_emote(source, emote, value) {
				if (!(this._emotes[source] || {}).hasOwnProperty(emote)) {
					this._emotes[source] = this._emotes[source] || {};
					this._emotes[source][emote] = value;
					$.signal(this, 'add_emote', source, emote);
					return true;
				}
				return false;
			},

			pop_emote(source, emote) {
				emote = ns.peka2tv._emote_sources[source].purify_emote(emote);
				if (this._pop_emote(source, emote)) {
					this._save();
				}
			},

			_pop_emote(source, emote) {
				if ((this._emotes[source] || {}).hasOwnProperty(emote)) {
					delete this._emotes[source][emote];
					if ($.isEmptyObject(this._emotes[source])) {
						delete this._emotes[source];
					}
					$.signal(this, 'pop_emote', source, emote);
					return true;
				}
				return false;
			},

			_set_emotes(source, emotes) {
				let emotes_2pop = {};
				this.get_emotes(source).forEach(emote => emotes_2pop[emote] = true);
				$.each(emotes, (emote, value) => {
					this._add_emote(source, emote, value);
					delete emotes_2pop[emote];
				});
				$.each(emotes_2pop, emote => {
					this._pop_emote(source, emote);
				});
			},

			get_source_emotes_hidden(source) {
				return !!this._source_emotes_hidden[source];
			},

			set_source_emotes_hidden(source, emotes_hidden) {
				if (this._set_source_emotes_hidden(source, emotes_hidden)) {
					this._save();
				}
			},

			_set_source_emotes_hidden(source, emotes_hidden) {
				if (!!this._source_emotes_hidden[source] !== emotes_hidden) {
					if (emotes_hidden) {
						this._source_emotes_hidden[source] = true;
					} else {
						delete this._source_emotes_hidden[source];
					}
					$.signal(this, 'set_source_emotes_hidden', source, emotes_hidden);
					return true;
				}
				return false;
			},

			get_chat_message_gap_decrease() {
				return this._chat_message_gap_decrease;
			},

			set_chat_message_gap_decrease(chat_message_gap_decrease) {
				if (this._set_chat_message_gap_decrease(chat_message_gap_decrease)) {
					this._save();
				}
			},

			_set_chat_message_gap_decrease(chat_message_gap_decrease) {
				if (this._chat_message_gap_decrease !== chat_message_gap_decrease) {
					this._chat_message_gap_decrease = chat_message_gap_decrease;
					$.signal(this, 'set_chat_message_gap_decrease', chat_message_gap_decrease);
					return true;
				}
				return false;
			},

			get_stretch_emote_list() {
				return this._stretch_emote_list;
			},

			set_stretch_emote_list(stretch_emote_list) {
				if (this._set_stretch_emote_list(stretch_emote_list)) {
					this._save();
				}
			},

			_set_stretch_emote_list(stretch_emote_list) {
				if (this._stretch_emote_list !== stretch_emote_list) {
					this._stretch_emote_list = stretch_emote_list;
					$.signal(this, 'set_stretch_emote_list', stretch_emote_list);
					return true;
				}
				return false;
			},
		}
	});

	const unique_key = 'x7tcckanh13l8FyiRt7bXB12NpBz9Djn';
	const peka2tv = new ns.peka2tv(unique_key);
	$(window).on('storage', peka2tv.storage_event_listener);

	$(function() {

		setInterval(() => {
			$('.chat-emote-list').each(function() {
				if ($(this).data(unique_key)) return;
				$(this).data(unique_key, true);

				$(this)
					.closest('chat-instance')
						.find('chat-text textarea')
							.on('change keypress', function() {
								$(this).closest('chat-instance').find('chat-smile-list > .chat-emote-list-wrapper').addClass('ng-hide').prop('hidden', true);
							})
						.end()
					.end();

				ns.peka2tv.get_emote_sources().forEach(source => {
					$('<div>', {
						on: {
							contextmenu: function() {
								return false;
							},
						},
					})
						.append(
							$('<div>', {
								class: 'chat-emote-group',
							})
								.on('signal.add_emote', [peka2tv, 'add_emote', source], function(e, emote) {
									let image_url = peka2tv.get_emote_image_url(source, emote);
									let code = peka2tv.get_emote_code(source, emote);
									$('<div>', {
										class: 'chat-emote-list__item',
										attr: {
											'title': code,
										},
										on: {
											click: function() {
												$(this).closest('chat-instance').find('chat-text textarea')
													.val((i, val) => val + code)
													.focus();
												return false;
											},

											contextmenu: function() {
												peka2tv.pop_emote(source, emote);
												return false;
											},
										},
									})
										.on('signal.pop_emote', [peka2tv, 'pop_emote', source, emote], function() {
											$(this).remove();
										})
										.append($('<img>', {src: image_url}))
										.appendTo($(this).find('.emotes'));
									return false;
								})
								.on('signal.set_source_emotes_hidden', [peka2tv, 'set_source_emotes_hidden', source], function(e, source_emotes_hidden) {
									$(this)
										.find('.hiddenable')
											.css('display', source_emotes_hidden ? 'none' :'')
										.end()
										.find('.source_emotes_hidden')
											.text(source_emotes_hidden ? '➖' : '➕')
										.end();
									return false;
								})
								.append(
									$('<div>', {
										class: 'chat-emote-group__title',
										css: {
											'display': 'flex',
										},
									})
										.append(
											$('<div>', {
												text: '➕',
												class: 'source_emotes_hidden',
												css: {
													'display': 'flex',
													'flex-direction': 'column',
													'justify-content': 'center',
													'border': '1px solid Gray',
													'cursor': 'pointer',
													'font-size': 6+'px',
												},
												on: {
													click: function() {
														peka2tv.set_source_emotes_hidden(source, !peka2tv.get_source_emotes_hidden(source));
													},
												},
											}),
											$('<div>', {css: {'width': '5px'}}),
											$('<div>', {text: source})
										),
									$('<div>', {class: 'hiddenable'})
										.append(
											$('<div>', {
												css: {
													'display': 'flex',
												},
											})
												.append(
													$('<input>', {
														type: 'text',
														placeholder: 'добавь смайлик',
														css: {
															'min-width': 0,
															'flex-grow': 1,
														},
														on: {
															keypress: function(event) {
																if (event.which === 13) {
																	let emote = $(this).val();
																	if (emote.length) {
																		$(this).val('');
																		peka2tv.add_emote(source, emote);
																	}
																	return false;
																}
															},
														}
													}),
													$('<button>', {
														type: 'button',
														text: '?',
														title: 'мне повезёт',
														on: {
															click: function(event) {
																peka2tv.add_random_emotes(source, 1);
																return false;
															},
														}
													})
												),
											$('<div>', {class: 'emotes'})
										)
								)
								.each(function() {
									$(this).triggerHandler('signal.set_source_emotes_hidden', [peka2tv.get_source_emotes_hidden(source)]);
									peka2tv.get_emotes(source).forEach(emote => {
										$(this).triggerHandler('signal.add_emote', [emote]);
									});
								})
						)
						.prependTo(this);
				});
			});
		}, 100);

	});

	$(function() {

		let interval_id = setInterval(() => {
			$('.header-item-more-list__item[href="http://forum.peka2.tv"]').each(function() {
				clearInterval(interval_id);
				$(this).attr({'href': 'http://forum.peka2.tv/search.php?do=getnew'});
			});
		}, 100);

	});

	$(function() {

		$('<style>')
			.on('signal.set_chat_message_gap_decrease', [peka2tv, 'set_chat_message_gap_decrease'], function(e, chat_message_gap_decrease) {
				let value = {'1': '.46', '2': '.27'}[chat_message_gap_decrease];
				if (value) {
					$(this)
						.html(`
							.chat-msg {
								padding: ${value}rem 0 !important;
							}
						`)
						.prependTo('body');
				} else {
					$(this).detach();
				}
			})
			.each(function() {
				$(this).triggerHandler('signal.set_chat_message_gap_decrease', [peka2tv.get_chat_message_gap_decrease()]);
			});

	});

	$(function() {

		$(
			`<style>
				chat-common chat-instance .chat-emote-list-wrapper {
					left: 0 !important;
					right: 0 !important;
					top: 1.75rem !important;
					bottom: 3.375rem !important;
					width: auto !important;
					height: auto !important;
					max-width: none !important;
					max-height: none !important;
				}

				chat-common chat-instance .chat-emote-list-wrapper > chat-emote-list {
					width: 100% !important;
					height: 100% !important;
				}
			</style>`
		)
			.on('signal.set_stretch_emote_list', [peka2tv, 'set_stretch_emote_list'], function(e, stretch_emote_list) {
				if (stretch_emote_list) {
					$(this).prependTo('body');
				} else {
					$(this).detach();
				}
			})
			.each(function() {
				$(this).triggerHandler('signal.set_stretch_emote_list', [peka2tv.get_stretch_emote_list()]);
			});

	});

	$(function() {

		let el_menu = $(`
			<div class="_settings" style="
				position: fixed;
				z-index: 9002;
				top: 80px;
				left: 0;
				right: 0;
				max-width: 600px;
				margin: 0 auto;
				padding: 20px;
				border: 2px solid black;
				border-radius: 10px;
				background-color: white;
			">
				<label>
					<span>уменьшить расстояние между сообщениями в чате</span>
					<select class="_chat_message_gap_decrease">
						<option value="0">нет</option>
						<option value="1">немного</option>
						<option value="2">сильно</option>
					</select>
				</label>
				<div style="
					height: 10px;
				"></div>
				<label>
					<span>растянуть список смайлов на весь чат</span>
					<input type="checkbox" class="_stretch_emote_list"/>
				</label>
				<div style="
					height: 10px;
				"></div>
				<textarea class="_data" rows="5" style="
					resize: none;
					width: 100%;
				"></textarea>
				<button type="button" class="_export">экспортировать настройки</button>
				<button type="button" class="_import">импортировать настройки</button>
				<div style="
					height: 50px;
				"></div>
				<button class="_close">закрыть</button>
			</div>
		`)
			.find('._close')
				.on('click', function() {
					$(this).closest('._settings').detach();
				})
			.end()
			.find('._chat_message_gap_decrease')
				.on('signal.set_chat_message_gap_decrease', [peka2tv, 'set_chat_message_gap_decrease'], function(e, chat_message_gap_decrease) {
					$(this).val(chat_message_gap_decrease);
				})
				.each(function() { $(this).triggerHandler('signal.set_chat_message_gap_decrease', [peka2tv.get_chat_message_gap_decrease()]); })
				.on('change', function() {
					let chat_message_gap_decrease = parseInt($(this).val());
					peka2tv.set_chat_message_gap_decrease(chat_message_gap_decrease);
				})
			.end()
			.find('._stretch_emote_list')
				.on('signal.set_stretch_emote_list', [peka2tv, 'set_stretch_emote_list'], function(e, stretch_emote_list) {
					$(this).prop('checked', stretch_emote_list);
				})
				.each(function() { $(this).triggerHandler('signal.set_stretch_emote_list', [peka2tv.get_stretch_emote_list()]); })
				.on('change', function() {
					let stretch_emote_list = $(this).is(':checked');
					peka2tv.set_stretch_emote_list(stretch_emote_list);
				})
			.end()
			.find('._export')
				.on('click', function() {
					try {
						let data = peka2tv.export();
						data = JSON.stringify(data);
						$(this).closest('._settings').find('._data').val(data);
					} catch (err) {}
				})
			.end()
			.find('._import')
				.on('click', function() {
					try {
						let data = $(this).closest('._settings').find('._data').val();
						data = JSON.parse(data);
						peka2tv.import(data);
					} catch (err) {}
				})
			.end()
			.get(0);

		setInterval(() => {
			$('.chat-settings-menu').each(function() {
				if ($(this).data(unique_key)) return;
				$(this).data(unique_key, true);

				$('<div>', {
					class: 'context-menu__item',
					text: 'Настройки (Better Peka2.TV)',
					click: function() {
						$(el_menu).appendTo('body');
					},
					appendTo: this,
				});
			});
		}, 100);

	});

})();