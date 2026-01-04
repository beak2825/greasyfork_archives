// ==UserScript==
// @name         Gmail date formater
// @namespace    https://monkeyr.com/
// @version      0.2
// @description  display full dates on gmail
// @author       mhume
// @match        https://mail.google.com/mail/u/0/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370289/Gmail%20date%20formater.user.js
// @updateURL https://update.greasyfork.org/scripts/370289/Gmail%20date%20formater.meta.js
// ==/UserScript==

(function () {
	'use strict';

	var GmailDates = {

		init : function () {
			// add the custom methods to our custom observer
			this.customObserver.prototype = {
				connect : function () {
					this.ob.observe(this.target, this.config);
				},
				disconnect : function () {
					this.ob.disconnect();
				}
			};
			// make reference within GmailDates to the custom observer so it can be paused when we mutate the dom
			this.ob = new this.customObserver(document, false, this.main_mutation_callback.bind(this));
			this.ob.connect();
		},

		main_mutation_callback : function (mutations) {
			var _this = this;
			mutations.forEach(function (mutation) {
				var added = mutation.addedNodes;
				for ( var node, i = added.length; (node = added[--i]); ) {
					var j, tab, colgrp, span, tds, td, cols, col,
						txtNode = (node.nodeName === '#text');
					// console.log(node.nodeName, txtNode, node);
					if(txtNode){
						node = mutation.target;
					}
					switch(node.nodeName){
						case 'DIV':
							// finds the div/table that contains the initial list of emails
							if ( node.hasAttribute('class') === false && (tab = _this.get_first_child(node)) && tab.nodeName === 'TABLE' ) {
								var width;
								tds = node.querySelectorAll('.xW.xY,.apm');// .apm for dates in classic vertical split
                                // console.log(tds)
								for ( j = tds.length; (td = tds[--j]); ) {
									if( !width ){
										width = td.classList.contains('apm') ? '16ex' : '14ex'; //classic vertical split needs a slightly different width
									}
                                    // console.log(td)
									_this.handle_dates_in_list(td); // change the date formats on the email list
								}
								if ( (colgrp = _this.get_first_child(tab)) && colgrp.nodeName === 'COLGROUP' ) {
									cols = colgrp.querySelectorAll('.xX');
									for ( j = cols.length; (col = cols[--j]); ) {
										col.style.width = width; // sets date width on classic gmail
									}
								}

							} else
							// the datetime on individual email views
							if ( node.getAttribute('role') === 'listitem' && (span = _this.get_first_child_by_class(node, '.g3')) ) {
								_this.handle_date_on_email(span);
							}
                            // remove the upgrade button from bottom left
                            if( node.textContent == 'Upgrade'){
                                node.remove();
                            }
                            // make the settings gear icon go straight to the settings
                            if( node.getAttribute('data-tooltip') === 'Settings' ){
                                node.addEventListener('click', ()=>{
                                    window.location.href = '#settings/general/';
                                });
                            }
							break;

						case 'TD':
							// handles individual email date times in split view
							if ( node.getAttribute('class') === 'Bu' && (span = _this.get_first_child_by_class(node, '.g3')) ) {
								_this.handle_date_on_email(span);
							} else
							// handles individual row updates in a list. This happens when emails slip from today to yesterday without a page refresh
							if ( node.classList.contains('xW') && node.classList.contains('xY') ) {
								_this.handle_dates_in_list(node);
							}
							break;

						case 'SPAN':
							// the datetime on individual email views as the minutes then hours grow
							if ( node.classList.contains('g3') ) {
								_this.handle_date_on_email(node);
							} else
							// the datetime on New gmail, split screen lists after selection
							if ( node.attributes.length == 0 ) {
								_this.child_handle_dates_in_list(node);
							} else
							// the datetime on Classic gmail, horizontal split screen lists after selection
							if ( node.hasAttribute('aria-label') ) {
								_this.child_handle_dates_in_list(node);
							} else
							// the datetime on New gmail when an unread idem is selected in horizontal split
							if ( node.classList.contains('bq3') ) {
								_this.child_handle_dates_in_list(node);
							}
							//console.log('#text update', txtNode, node);
							break;

						case 'B':
							// the datetime on Classic gmail, horizontal split screen lists after selection
							if ( node.attributes.length == 0 ) {
								_this.child_handle_dates_in_list(node);
							}
							break;
					}
				}
			});
		},

		get_first_child_by_class : function(cont, cls){
			var eles = cont.querySelectorAll(cls);
			return eles.length ? eles[0] : false;
		},

		child_handle_dates_in_list : function(child){
			var node;
			if ( (node = child.closest('tr')) && (node = this.get_first_child_by_class(node, '.xW.xY')) ) {
				this.handle_dates_in_list(node);
			}
		},

		handle_dates_in_list : function (cont) {
			cont.style.maxWidth = '100px';
			//console.log(cont);
			var span1 = this.get_first_child(cont),
				span2 = this.get_first_child(span1),
				datetime = span1.getAttribute('aria-label').replace(/ at /, ' '), // classic gmail has the following format, 11 July 2018 at 11:56
				dat = new Date(datetime);
			this.ob.disconnect(); //disable before we mutate the dom
			// span2 doesn't exist in classic gmail
            // console.log(span2, span1, dat);
			(span2 || span1).innerText = this.format_date(dat);
			this.ob.connect(); //enable again
		},

		handle_date_on_email : function (span) {
			//console.log(span);
			var match = span.innerHTML.match(/.*( \([\da-zA-Z ]+\))/),
				datetime = span.getAttribute('alt').replace(/ at /, ' '), // classic gmail has the following format, 11 July 2018 at 11:56
				dat = new Date(datetime)
				;
			//console.log('match', span.innerHTML, match);
			if ( match ) {
				this.ob.disconnect(); //disable before we mutate the dom
				span.innerText = this.format_date(dat) + match[1];
				this.ob.connect(); //enable again
			}
		},

		format_date : function (dat) {
			return dat.toISOString().substring(0, 10) + ' ' + dat.getHours().pad() + ':' + dat.getMinutes().pad();
		},

		get_first_child : function (el) {
			var first = el.firstChild;
			while ( first != null && first.nodeType == 3 ) { // skip TextNodes
				first = first.nextSibling;
			}
			return first;
		},

		customObserver : function (target, config, callback) {
			this.target = target || document;
			this.config = config || {childList : true, subtree : true};
			var _this = this;
			this.ob = new MutationObserver(function (mutations) {
				callback.call(_this, mutations);
			});
		}

	};

	// allow padding of numbers
	Number.prototype.pad = function (size) {
		var s = String(this);
		while ( s.length < (size || 2) ) {
			s = "0" + s;
		}
		return s;
	};


	GmailDates.init();


})();