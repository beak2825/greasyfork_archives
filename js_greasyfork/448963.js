// ==UserScript==
// @name           [Trello] Advanced Comments
// @name:tr        [Trello] Gelişmiş Yorumlar
// @description    It makes comment groups for repliying comments on Trello.
// @description:tr Trello'da birbirine cevap olarak yazılmış yorumları gruplar.
// @author         nht.ctn
// @namespace      https://github.com/nhtctn
// @license        MIT
// @version        1.0

// @icon           data:image/png;base64,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

// @match          https://trello.com/*
// @grant          GM_addStyle
// @run-at         document-end

// @require	 https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/448963/%5BTrello%5D%20Advanced%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/448963/%5BTrello%5D%20Advanced%20Comments.meta.js
// ==/UserScript==
/* global $ */
/*jshint esversion: 6 */

(function() {
    'use strict';

	// Bu betiğe özgü fonksiyonlar
	const c = (x) => console.log(x);
	const link = (x) => $(x).closest('.phenom').find('.phenom-date > a.date, .phenom-meta > a.date').attr('href');
	const date = (x) => new Date( $(x).closest('.phenom').find('.phenom-date > a.date, .phenom-meta > a.date').attr('dt') ).getTime();
	const type = (x) => ($(x).closest('.phenom').is('.mod-comment-type')) ? "com" : "attach";
	const getLang = () => $('html').attr("lang");
	const getItem = (x) => {
		if ($.type(x) == "string")       return $('.card-detail-window a.date[href*="' + x + '"]').closest('.phenom');
		else if ($.type(x) == "object")  return $(x).closest('.phenom');
		else                             return c( 'id fonksiyonunda belirsiz tip: ' + $.type(x) );
	};
	const id = (x) => {
		if ($.type(x) == "string")       return x.replace(/.+\#((comment|action)-.+)/, "$1");
		else if ($.type(x) == "object")  return $(x).closest('.phenom').find('a.date').attr('href').replace(/.+\#((comment|action)-.+)/, "$1");
		else                             return c( 'id fonksiyonunda belirsiz tip: ' + $.type(x) );
	};
	const key = (x) => {
		if ($.type(x) == "string")       return x.replace(/(.+)?(comment|action|group|replies|)-(.+)/, "$3");
		else if ($.type(x) == "object")  return $(x).closest('.phenom').find('a.date').attr('href').replace(/.+\#(comment|action)-(.+)/, "$2");
		else                             return c( 'key fonksiyonunda belirsiz tip: ' + $.type(x) );
	};

	let removeSlctr = `p > a:first-child[href*="trello.com"][href*="#comment-"], p > a:first-child[href*="trello.com"][href*="#action-"],
	p > span.atMention:nth-child(2), span.atMention:nth-child(3),
	p > br:nth-child(2), p > br:nth-child(3), p > br:nth-child(4),
	.phenom-reactions .js-attach-link`;

	// Yorum grubu oluştur.
	function groupDiv(target, comfor, link) {
		getItem(target).before('<div id="group-' + key(comfor) + '"><div id="replies-' + key(comfor) + '"></div></div>');
		getItem(comfor).prependTo( '.card-detail-window #group-' + key(comfor) );
		getItem(link).prependTo( '.card-detail-window #replies-' + key(comfor) );
		let dummyCom = $('.card-detail-window .window-module > .new-comment.js-new-comment').clone().removeClass("js-new-comment is-focused is-show-controls").addClass("new-group-comment");
		dummyCom.find('.js-new-comment-input').removeClass('js-new-comment-input').css("height", "20.0348px").val("");
		dummyCom.appendTo('.card-detail-window #group-' + key(comfor)).wrap('<div class="group-comment-div"></div>');
		$('.card-detail-window #group-' + key(comfor) + ' .new-group-comment').click(function(){ textAreaShifter(this); });
	}

	// Bir kart ilk açıldığındaki işlemler
	let cardUrl = '';
	waitForKeyElements('.card-detail-window p.u-bottom a.show-more.js-show-all-actions', cardWindow);
	function cardWindow () {
		things = [];
		cardUrl = window.location.href.replace(/(.+trello\.com\/c\/.+\/\d+).+/, "$1");
		let intCount = 0;
		// Yeterince bekleyip tüm etkinlikleri göstere tıkla
		let myTimeOut = setInterval(function () {
			let moreButton = $('.card-detail-window p.u-bottom a.show-more.js-show-all-actions').removeAttr("href").css("cursor", "pointer");
			moreButton[0].click();
			if ( $('.card-detail-window .js-show-all-actions').is(":hidden")) clearInterval(myTimeOut);
			else if (intCount++ > 40) clearInterval(myTimeOut);
		}, 500);

		GM_addStyle(`
		.window-overlay > .window {width: 868px;}
		.card-detail-window > .window-main-col {width: 652px;}
		.card-detail-window > .window-sidebar {width: calc(100% - 700px);}
		.mod-card-back > [id^="group-"] {padding: 8px 0 2px 0;}
		[id^="group-"] [id^="group-"] {padding: 0 0 6px 0;}
		[id^="group-"] > [id^="replies-"] {padding-left: 6%;}
		[id^="group-"] .mod-comment-type:not(.mod-highlighted) {padding: 0 0 6px 0}
		[id^="group-"] .mod-comment-type.mod-highlighted {padding: 0 0 6px 48px}
		.group-comment-div {padding-left: 6%; padding-top: 4px}
		.artificialReply {text-decoration: none;}
		.artificialReply:hover {text-decoration: underline;}
		`);
	}

	// Yeni bir etkinlik saptandığındaki işlemler
	let things = [];
	waitForKeyElements('.card-detail-window .mod-card-back .phenom a.date', function(newElement){ addUnseen(newElement); });
	function addUnseen(el) {
		// Yeniyse kaydet.
		let isUnseen = true;
        for (let x = 0; x < things.length; x++) {
            isUnseen = (things[x].link == link(el)) ? false : true;
            if(!isUnseen) break;
        }
        if (isUnseen) {
            let newThings = [];
            $('.card-detail-window .mod-card-back .phenom a.date').each(function(){
                newThings.push({
                    link:   link( $(this) ),
                    id:     id( $(this) ),
                    date:   date( $(this) ),
                    type:   type( $(this) ),
                    comFor: findReply( $(this) ),
                });
                things = uniqArray(newThings);
                arraySorter(things, "object", "date");
            });
            //console.log(things);
			newThing();
        }
	}

	function findReply(this_) { // Buraya başka kartın yorum linki olmasın diye koşul koyulacak.
		if (type(this_) == "com") {
			let firstNd = $(this_.closest('.mod-comment-type').find('.current-comment p')[0].firstChild);
			if (firstNd.is("a") && firstNd.attr("href").search(/trello\.com\/.+\#(comment|action)-/) > 0 ) return id( firstNd.attr("href") );
			else return null;
		}
		else return null;
	}

	// Bir tepkiye ilk raslandığındaki işlemler
	waitForKeyElements('.card-detail-window .mod-comment-type > .phenom-reactions .reactions-add-icon', function(elem) {moveReactions(elem);});
    function moveReactions(this_) {
		// Tepkilerin yerini değiştir
        let react = this_.closest('.phenom-reactions');
		let com = this_.closest('.mod-comment-type');
		com.attr("id", id(this_));
		com.find('.phenom-meta').css("display", "contents");
		if (com.find('.rightOfDate').length <= 0) {
			com.find('.phenom-date').after('<div class="rightOfDate" style="display: contents;"></div>');
			react.css("display", "inline-flex").css("float", "right").css("margin-right", "8px").appendTo('#' + id(this_) + ' .rightOfDate');
		}
		// Yanıtla butonuyla link ekle
		let cardUrl = window.location.href.replace(/(.+trello\.com\/c\/.+\/\d+).+/, "$1");
		react.find('.js-reply-to-action, .js-reply-to-all-action').click(function(){
			$('.js-new-comment textarea.comment-box-input').val( cardUrl + '#' + id(this_) );
		});
        // Silme işleminde yeniden sırala
        react.find(".js-confirm-delete-action").click(function(){
            waitForKeyElements('.js-confirm.nch-button--danger', function(){
                $('.js-confirm.nch-button--danger').one("click", function(){
                setTimeout( function() {newThing();}, 200);
                });
            }, true);
        });
    }

    // Başkası yorum silip sayfa bozulduysa diye arada kontrol et.
    setInterval(function(){
        if($('[id^="group-"]'). length > 0 && $('[id^="group-"] > [id^="replies-"]:first-child'). length > 0) {
            newThing();
        }
    }, 5000);

	function putReply(el) {
		// Actionlara yanıtla butonu ekle.
		if (el.type == "attach" && $('#' + el.id + ' .artificialReply').length <= 0) {
			let reply = ($('html').attr("lang") == "tr") ? "Yanıtla" : "Reply";
			$('#' + el.id + ' a.date').after(' - <a class="js-reply-to-all-action artificialReply" href="#">' + reply + '</a>');
			$('#' + el.id + ' .artificialReply').click(function(){
				let mentions = replyMentions(getItem(this));
				let val = (cardUrl + '#' + id(this) + ' ' + mentions + ' ');
				$('.js-new-comment textarea.comment-box-input').val(val);
				$('.js-new-comment textarea.comment-box-input').focus();
			});
		}
	}

	// Yeni bir eylem saptandığındaki işlemler
	function newThing() {
        if ($('[id^="group-"]').length > 0) clearResiduals();
		for (let x = 0; x < things.length; x++) {
			// Her bir eyleme id ekle.
			let th = things[x];
			if (getItem(th.id).attr("id") == undefined) getItem(th.id).attr("id", th.id);
			// Eylem yorumsa
			let isComForExist = (th.comFor != null && getItem(th.comFor).length > 0);
			if (isComForExist) {
				let isComForNonThreaded = getItem(th.comFor).closest('[id^="group-"]').length <= 0;
				let isComForRegular = getItem(th.comFor).is('[id^="group-"] .mod-comment-type:first-child, [id^="replies-"] .mod-comment-type:last-child');
				if (isComForNonThreaded) {
					// Yorumun atası herhangi bir grupta değil. Yeni grup aç.
					groupDiv(th.id, th.comFor, th.id);
				}
				else {
					// Yorumun atası bir grupta. Toptan grubu yorumun olduğu yere taşı.
					let repliesId = getItem(th.comFor).closest('[id^="group-"]').find('[id^="replies-"]').attr("id");
					if (repliesId != getItem(th.id).closest('[id^="group-"]').find('[id^="replies-"]').attr("id")) { //Birbirini hedef gösteren yorumlarda buga girmesin diye.
						$('#' + repliesId).closest('.mod-card-back > [id^="group-"]').insertBefore(getItem(th.id));
						if (isComForRegular) {
							getItem(th.id).appendTo( '#' + repliesId ); // Ata grubun atası ya son mesajıysa yorumu grubun altına taşı.
						}
						else {
							groupDiv(th.comFor, th.comFor, th.id); // Ata grubun ortasındaysa yeni alt grup aç.
						}
					}
				}
                // Cevap olarak yazılmış bir yorum ise linki, alıntıları, satır atlamayı, bağlantı olarak ekle seçeneğini gizle.
                getItem(th.id).find(removeSlctr).hide();
				// c(comItem(th.id).find(removeSlctr)[0].getAttribute("style"));
                let attachLinks = getItem(th.id).find('.phenom-reactions .js-attach-link');
                let afterAttach = $(attachLinks[0].nextSibling);
                if (!(afterAttach.is('a, span'))) afterAttach.remove();
			}
			else {
				putReply(th);
			}
		}
        // Çift grup kontrol.
        if ($('[id^="group-"] [id^="group-"]').length > 0) doubleGroup();
	}

	function clearResiduals() {
		//c("residual clean");
		$('.group-comment-div, #newCommentWatcher').remove();
		$('[id^="replies-"]').children(':first-child').unwrap('[id^="replies-"]');
		$('[id^="group-"]').children(':first-child').unwrap('[id^="group-"]');
		let residual = $('[id^="group-"], [id^="replies-"], .group-comment-div');
		for (let x = 0; x < residual.length; x++) {
			if ( $(residual[x]).children('.mod-comment-type').length <= 0 ) {
				$(residual[x]).remove();
			}
		}
	}

	// Grup içindeki grupları denetle, gerekliyse dışarı at
	function doubleGroup() {
		//c("doubleGroup");
		$('[id^="group-"] [id^="group-"] > .mod-comment-type .current-comment p').each(function(){
			let firstNd = $(this.firstChild);
			let realGroup = $(this).closest('[id^="group-"] [id^="group-"]');
			if (firstNd.is("a") && firstNd.attr("href").search(/trello\.com\/+c\/.+\/.+\#comment-/) > 0 ) {
				// Burayı henüz test edemedim.
				let href = id( $(firstNd).attr("href") );
				let isRelated = realGroup.closest('.js-list-actions.mod-card-back > [id^="group-"]').find('a.date[href*="' + href + '"]').length > 0;
				if (!isRelated) realGroup.insertBefore( realGroup.closest('.js-list-actions.mod-card-back > [id^="group-"]') );
			}
			else {
                c("doubleGroup problemi çözüldü");
				realGroup.insertBefore( realGroup.closest('.js-list-actions.mod-card-back > [id^="group-"]') );
			}
		});
	}

	// Grupların altındaki klon yorum alanlarına tıklandığında
	function textAreaShifter(dum) {
		let val = '';
		if ( $(dum).closest('[id^="group-"]').length > 0 ) {
			// Klon grubun altındaysa içine yazdırılacak yazıyı oluştur.
			let lastGroupCom = $(dum).closest('[id^="group-"]').children('[id^="replies-"]').children('.mod-comment-type:last-of-type');
			let pageUrl = window.location.href.replace(/(.+trello\.com\/c\/.+\/\d+).+/, "$1");
			let mentions = replyMentions(lastGroupCom);
			val = (pageUrl + '#' + id( link(lastGroupCom) ) + ' ' + mentions + ' ');
			// Grubun altında işi kalmayıp aktifliğini kaybettiyse geri yolla ki yanıtla tuşu kullanıldığında yerinde olsun.
			let groupComTimeOut = setInterval(function () {
				let pasiveGroupCom = $('.card-detail-window .js-new-comment:not(.is-focused, .card-detail-window .is-show-controls)');
				if (pasiveGroupCom.length > 0) {
					swaper($('.card-detail-window .js-new-comment'), $('.card-detail-window .window-module > .new-group-comment'));
					$('.card-detail-window .js-new-comment .js-new-comment-input').val("");
					clearInterval(groupComTimeOut);
				}
			}, 100);
		}
		// Klonla orijinal text editor'ü yer değiştir. Klon grup altına da gidebilir, orijinal yorum alanına da.
		swaper($('.card-detail-window .js-new-comment'), $(dum).closest('.new-group-comment'));
		$('.card-detail-window .js-new-comment .js-new-comment-input').val(val).click().focus();
	}
	// Yanıtlanacak cevap için atıfları ayarla
	function replyMentions(el) {
		if (id(el).search(/action-/) >= 0) return $(el).find('.phenom-creator .member-avatar').attr("title").replace(/(.+) \((.+)\)/, "\@$2");
		let myName = $('.card-detail-window .new-comment .member-avatar').attr("title").replace(/(.+) \((.+)\)/, "\@$2");
		let ment = [];
		el.find('.atMention').each(function(){ment.push($(this).text());});
		ment.push( el.find('.phenom-creator .member-avatar').attr("title").replace(/(.+) \((.+)\)/, "\@$2") );
		ment = arrayRemover(ment, myName);
		return ment.toString().replace(/\,/g, " ");
	}

	// Hazır fonsiyonlar
    function uniqArray(array) {
		if ($.type(array[0]) == "object") {
            let objs = [];
            return array.filter(function(item) {
                return JSON.stringify(objs).search(JSON.stringify(item)) >= 0 ? false : objs.push(item);
            });
        }
        else {
            var seen = {};
            return array.filter(function(item) {
                return seen.hasOwnProperty(item) ? false : (seen[item] = true);
            });
        }
    }
	function arrayRemover(array, removeThis, objectType) {
		let resultArray = [];
		if ($.type(array[0]) == "object") {
			if ($.type(removeThis) == "array") {
				for(let o = 0; o < array.length; o++){
					for (let i = 0; i < removeThis.length; i++) {
						if ( array[o][objectType] == removeThis[i][objectType] )  break;
						else if (i+1 == removeThis.length)                        resultArray.push(array[o]);
					}
				}
			}
			else {
				resultArray = $.grep(array, function(value) {
					return value[objectType] != removeThis;
				});
			}
		}
		else {
			if ($.type(removeThis) == "array") {
				for(let o = 0; o < array.length; o++){
					let newArray = [];
					for (let i = 0; i < removeThis.length; i++) {
						if ( array[o] == removeThis[i] )    break;
						else if (i+1 == removeThis.length)  resultArray.push(array[o]);
					}
				}
			}
			else {
				resultArray = $.grep(array, function(value) {
					return value != removeThis;
				});
			}
		}
		return resultArray;
	}
	function swaper(el1, el2) {
		$(el1).before('<div id="dummyDiv1"></div>');
		$(el2).before('<div id="dummyDiv2"></div>');
		$(el1).appendTo('#dummyDiv2').unwrap('#dummyDiv2');
		$(el2).appendTo('#dummyDiv1').unwrap('#dummyDiv1');
	}
    function arraySorter(array, objectOrNot, objectType) {
        if (objectOrNot == "object") {
            array.sort(function(a, b) {
              var x = ( isFinite(a[objectType]) ) ? Number(a[objectType]) : a[objectType].toString().toLowerCase();
              var y = ( isFinite(b[objectType]) ) ? Number(b[objectType]) : b[objectType].toString().toLowerCase();
              if (x < y) {return -1;}
              if (x > y) {return 1;}
              return 0;
            });
        }
        else if (objectOrNot == "nonObject") {
            array.sort();
        }
    }
    function waitForKeyElements (
        selectorTxt,    /* Required: The jQuery selector string that specifies the desired element(s). */
        actionFunction, /* Required: The code to run when elements are found. It is passed a jNode to the matched element. */
        bWaitOnce,      /* Optional: If false, will continue to scan for new elements even after the first match is found. */
        iframeSelector  /* Optional: If set, identifies the iframe to search. */
    ) {
        var targetNodes, btargetsFound;

        if (typeof iframeSelector == "undefined")
            targetNodes = $(selectorTxt);
        else
            targetNodes = $(iframeSelector).contents().find(selectorTxt);

        if (targetNodes && targetNodes.length > 0) {
            btargetsFound = true;
            /*--- Found target node(s).  Go through each and act if they are new. */
            targetNodes.each(function() {
                var jThis        = $(this);
                var alreadyFound = jThis.data('alreadyFound') || false;

                if (!alreadyFound) {
                    //--- Call the payload function.
                    var cancelFound = actionFunction(jThis);
                    if (cancelFound)
                        btargetsFound = false;
                    else
                        jThis.data('alreadyFound', true);
                }
            });
        }
        else {
            btargetsFound = false;
        }

        //--- Get the timer-control variable for this selector.
        var controlObj  = waitForKeyElements.controlObj  ||  {};
        var controlKey  = selectorTxt.replace(/[^\w]/g, "_");
        var timeControl = controlObj[controlKey];

        //--- Now set or clear the timer as appropriate.
        if (btargetsFound && bWaitOnce && timeControl) {
            //--- The only condition where we need to clear the timer.
            clearInterval(timeControl);
            delete controlObj[controlKey];
        }
        else {
            //--- Set a timer, if needed.
            if (!timeControl) {
                timeControl = setInterval(function() {
                        waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector);
                    },
                    300
                );
                controlObj [controlKey] = timeControl;
            }
        }
        waitForKeyElements.controlObj = controlObj;
    }
})();