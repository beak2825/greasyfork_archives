// ==UserScript==
// @name        Hentailx Downloader Akino
// @namespace   https://github.com/akino0910/Userscript
// @version     0.1
// @description Userscipt download manga on hentailx.com
// @author      Akino
// @license     MIT
// @include      /^https?:\/\/(www\.)?hentailx\.com\/[^\.]+\.html$/
// @exclude      /^https?:\/\/(www\.)?hentailx\.com\/dang-ky-thanh-vien\.html$/
// @icon        https://raw.githubusercontent.com/akino0910/Userscript/master/hentailx_downloader/icon.png?token=AT701f3diknyXGD0FkKxSwSinN3-4mEQks5bYdCIwA%3D%3D

// @require      https://unpkg.com/jszip@3.1.5/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@1.3.8/FileSaver.min.js
// @require      https://code.jquery.com/jquery-3.3.1.min.js

// @grant        GM_xmlhttpRequest

// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/370602/Hentailx%20Downloader%20Akino.user.js
// @updateURL https://update.greasyfork.org/scripts/370602/Hentailx%20Downloader%20Akino.meta.js
// ==/UserScript==

jQuery(function($) {
	"use strict";

	function deferredAddZip(url, filename, current, total, zip, $download) {
		var deferred = $.Deferred();

		GM_xmlhttpRequest({
			method: "GET",
			url: url,
			responseType: "arraybuffer",
			onload: function(response) {
				zip.file(filename, response.response);
				$download.text(counter[current] + "/" + total);
				++counter[current];
				deferred.resolve(response);
			},
			onerror: function(err) {
				console.error(err);
				deferred.reject(err);
			},
		});

		return deferred;
	}

	function getChaper(obj) {
		var $this = $(obj.download),
			zip = new JSZip(),
			deferreds = [],
			images = [];

		$this.text("Waiting...");

		if (obj.contentChap.children("img").length !== 0) {
			const plain_Images = Array.from(obj.contentChap.children("img"));
			images = plain_Images.map(element =>
				element.src.replace("?imgmax=1200", "")
			);
		} else if (
			obj.contentChap.children("div").children("img").length !== 0
		) {
			const plain_Images = Array.from(
				obj.contentChap.children("div").children("img")
			);
			images = plain_Images.map(element =>
				element.src.replace("?imgmax=1200", "")
			);
		} else {
			console.log("New Method");
			const container = document.getElementById("content_chap");
			const plain_Images = Array.from(
				container.getElementsByTagName("img")
			);
			images = plain_Images.map(element =>
				element.src.replace("?imgmax=1200", "")
			);
		}

		$.each(images, function(i, v) {
			var filename = v.replace(/.*\//g, "");

			deferreds.push(
				deferredAddZip(
					images[i],
					filename,
					obj.current,
					images.length,
					zip,
					$this
				)
			);
		});

		$.when
			.apply($, deferreds)
			.done(function() {
				zip.generateAsync({
					type: "blob",
				}).then(
					function(blob) {
						var zipName = obj.nameChap.replace(/\s/g, "_") + ".zip";

						$this
							.text("Complete")
							.css("color", "green")
							.attr({
								href: window.URL.createObjectURL(blob),
								download: zipName,
							})
							.off("click");

						saveAs(blob, zipName);

						doc.title =
							"[⇓ " + ++complete + "/" + progress + "] " + tit;
					},
					function(reason) {
						console.error(reason);
					}
				);
			})
			.fail(function(err) {
				$this.text("Fail").css("color", "red");
				console.error(err);
			})
			.always(function() {
				if (--alertUnload <= 0) {
					$(window).off("beforeunload");
				}
			});
	}

	var $download = $("<a>", {
			class: "chapter-download",
			href: "#download",
			text: "Download",
		}),
		counter = [],
		current = 0,
		alertUnload = 0,
		complete = 0,
		progress = 0,
		doc = document,
		tit = doc.title;

	window.URL = window.URL || window.webkitURL;

	if (!location.pathname.indexOf("/doc-truyen/")) {
		$(".chapter-info")
			.find("ul")
			.append('<span class="glyphicon glyphicon-save"></span> ')
			.append($download);

		$download.one("click", function(e) {
			e.preventDefault();

			++progress;

			$download.attr("href", "#download");

			$(window).on("beforeunload", function() {
				return "Progress is running...";
			});
			++alertUnload;

			counter[current] = 1;
			getChaper({
				download: this,
				contentChap: $("#content_chap"),
				nameChap:
					$(".link_truyen")
						.eq(0)
						.text() +
					" " +
					$(".link_truyen")
						.eq(1)
						.text(),
				current: current,
			});
		});
	} else {
		$(".chapter-name-label").attr(
			"class",
			"chapter-name-label col-xs-6 col-sm-6 col-md-6"
		);
		$(".chap-link").attr("class", "chap-link col-xs-6 col-sm-6 col-md-6");
		$(".list-group-item")
			.eq(2)
			.append(
				'<div class="col-xs-3 col-sm-3 col-md-3 text-right chapter-view-download">Download</div>'
			);
		$(".item_chap:not(:last)").append(
			$("<span>", {
				class:
					"col-xs-3 col-sm-3 col-md-3 text-right chapter-view-download",
			}).append($download)
		);

		$(".chapter-download").each(function() {
			$(this).one("click", function(e) {
				e.preventDefault();

				++progress;

				var _this = this,
					$chapLink = $(_this)
						.closest(".item_chap")
						.find(".chap-link");

				$(_this).attr("href", "#download");

				if (alertUnload <= 0) {
					$(window).on("beforeunload", function() {
						return "Progress is running...";
					});
				}
				++alertUnload;

				GM_xmlhttpRequest({
					method: "GET",
					url: $chapLink.attr("href"),
					responseType: "text",
					onload: function(response) {
						var $data = $(response.responseText);

						counter[current] = 1;
						getChaper({
							download: _this,
							contentChap: $data.filter("#content_chap"),
							nameChap:
								$(".breadcrumb")
									.find(".active")
									.text() +
								" " +
								$chapLink.text(),
							current: current,
						});
						++current;
					},
					onerror: function(err) {
						console.error(err);
					},
				});
			});
		});
	}
});
