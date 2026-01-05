// ==UserScript==
// @name         Seriesfeed Import Time Wasted
// @namespace    https://www.seriesfeed.com
// @version      0.2.3
// @description  Allows you to import your time wasted from Bierdopje.com.
// @match        https://*.seriesfeed.com/*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      www.bierdopje.com
// @domain       www.bierdopje.com
// @require      http://code.jquery.com/jquery-1.12.2.min.js
// @author       Tom
// @copyright    2016+, Tom
// @downloadURL https://update.greasyfork.org/scripts/23764/Seriesfeed%20Import%20Time%20Wasted.user.js
// @updateURL https://update.greasyfork.org/scripts/23764/Seriesfeed%20Import%20Time%20Wasted.meta.js
// ==/UserScript==
/* jshint -W097 */
/*global $, GM_xmlhttpRequest, Promise, console */
'use strict';

$(function() {
    // Add menu item to navigator.
    $('<li><a href="/series/import/bierdopje/time-wasted">TW Importeren</a></li>').insertAfter($('li > a[href="/series/search"]').parent());

	if (window.location.href === "https://www.seriesfeed.com/series/import/bierdopje/time-wasted") {
        var col         = $('<div class="wrapper dashboard bg"><div class="container content"></div></div>');
		$('.contentWrapper > div.container').replaceWith(col);
        var head        = $('<h1></h1>');
		var cardHolder  = $('<div></div>').addClass("col-md-6");
		var card        = $('<div></div>').addClass("blog-left cardStyle cardTable");
        var content     = $('<div></div>').addClass("blog-content");
		var stepTitle   = $('<h3></h3>');
		var stepcontent = $('<p></p>');

		const css = '<style>'
		        + '    .import-selected {'
		        + '        border-bottom: 3px solid #447C6F;'
		        + '    }'
		        + '    input[type="checkbox"] + label span {'
		        + '        position: initial !important'
				+ '    }'
		        + '    '
		        + '    .progress {'
		        + '        width: 90%;'
                + '        margin: 0 auto;'
		        + '    }'
		        + '    '
		        + '    .progress-bar {'
                + '        background: #447C6F;'
		        + '    }'
		        + '    '
		        + '    @media only screen and (max-width: 992px)'
		        + '    .favourites i.fa.fa-times:hover:after {'
                + '        position: fixed;'
                + '        top: 50px;'
                + '        left: 10px;'
                + '        right: 10px;'
		        + '    }'
		        + '    '
		        + '    .favourites i.fa.fa-times:hover:after {'
                + '        content: "Deze serie staat nog niet op Seriesfeed. Vraag \'m aan via menu-item Series -> Serie voorstellen.";'
                + '        background: #ffffff;'
                + '        position: absolute;'
                + '        min-width: 250px;'
                + '        padding: 20px;'
                + '        font-family: "Lato", sans-serif;'
                + '        border: 1px solid #eaeaea;'
                + '        border-radius: 3px;'
                + '        box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.15);'
                + '        line-height: 18px;'
		        + '    }'
                + '    '
		        + '    tr.row-error {'
		        + '        background-color: rgba(255, 0, 0, 0.15);'
		        + '    }'
                + '    '
		        + '    tr.row-warning {'
		        + '        background-color: rgba(255, 231, 150, 0.43);'
		        + '    }'
                + '    '
		        + '    tr.row-info {'
		        + '        background-color: rgba(240, 248, 255, 1.00);'
		        + '    }'
		        + '</style>';
		$('body').append(css);

		cardHolder.css({
			'margin': '0 auto',
			'float': 'none'
		});

		content.css({
			'min-height': '425px'
		});

		const steps = stepFactory(3);

		const headText = 'Importeren - Time Wasted - Bierdopje.com';
		head.html(headText);

		col.html(head);
		head.after(steps);
		col.after(cardHolder);
		cardHolder.html(card);
		card.html(content);

		stepOne();
	}

	function stepOne() {
		selectStep(1);

		var titleCardText = 'Account verifiëren';
		var innerCardText = 'Om je Time Wasted succesvol te importeren dien je te verifiëren '
		+ 'of het onderstaande account waarop je nu bent ingelogd op '
		+ '<a href="http://www.bierdopje.com/">www.bierdopje.com</a> het '
		+ 'account is waarvan je wilt importeren.';
		var userProfile   = userFactory("Laden...", "https://www.seriesfeed.com/static/avatars/3d02f5f37e466f1a295a6bca5c0e3f542e43394a.png");

		stepTitle.html(titleCardText);
		stepcontent.html(innerCardText);
		content.html(stepTitle);
		stepTitle.after(stepcontent);
		stepcontent.after(userProfile);

		getCurrentBierdopjeUsername().then(function(username) {
			localStorage.setItem("sftw.username", username);

			getBierdopjeAvatarUrlByUsername(username).then(function(avatarUrl) {
				var login = '<a href="http://www.bierdopje.com/" target="_blank">Inloggen</a>';
				if (!avatarUrl) {
					avatarUrl = 'https://seriesfeed.com/static/avatars/3d02f5f37e466f1a295a6bca5c0e3f542e43394a.png';
				}

				if (!username) {
					username = login;
				}

				var profile = userFactory(username, avatarUrl);
				userProfile.html(profile);

				if (userProfile.find(".user-name").html() !== login) {
					var nextStep = nextStepFactory("Doorgaan", "step-2");
					userProfile.after(nextStep);

					$("#step-2").on('click', function() {
						stepTwo();
					});
				}
			}, function(error) {
				console.log("Could not connect to Bierdopje to get the avatar of " + username + ".");
			});
		}, function(error) {
			console.log("Could not connect to Bierdopje to get current username.");
		});
	}

	function stepTwo() {
		selectStep(2);

		var username = localStorage.getItem("sftw.username");

		var titleCardText = 'Favorieten selecteren';
		var innerCardText = 'Je Time Wasted is gebaseerd op de series die je afgevinkt hebt als "gezien". Zowel de "gezien" als de "verkregen" status zal worden geïmporteerd. Vink de series aan waarvan je deze statussen wilt importeren.';

		var seriesTable   = $('<table class="table table-hover responsiveTable favourites stacktable large-only" style="margin-bottom: 20px;" id="series">');
		var checkboxAll   = $('<fieldset><input type="checkbox" name="select-all" id="select-all" class="hideCheckbox"><label for="select-all"><span class="check"></span></label></fieldset>');
		var tableHeader   = $('<tr><th style="padding-left: 30px;">' + checkboxAll[0].outerHTML + '</th><th>Serie</th><th>Status</th></tr>');

		var loadingData   = $('<div><h4 style="margin-bottom: 15px;">Beschikbaarheid series controleren...</h4></div>');
		var outerProgress = $('<div class="progress"></div>');
		var progressBar   = $('<div class="progress-bar progress-bar-striped active"></div>');
		outerProgress.css({
			'margin-top': '10px',
			'margin-bottom': '0px'
		});
		outerProgress.append(progressBar);
		loadingData.append(outerProgress);

		stepTitle.html(titleCardText);
		stepcontent.html(innerCardText);
		content.html(stepTitle);
		stepTitle.after(stepcontent);

		stepcontent.after(loadingData);
		seriesTable.append(tableHeader);

		getBierdopjeTimeWastedByUsername(username).then(function(bdTimeWasted) {
			var timeWastedLength = bdTimeWasted.length;
			var seriesList = [];

			function getBierdopjeTimeWastedItem(index) {
				return new Promise(function(resolve) {
					var bdTimeWastedRow = bdTimeWasted[index];

					var bdShowName = $(bdTimeWastedRow).find('td a').html();
					var bdShowSlug = $(bdTimeWastedRow).find('td a').attr('href');

					getTVDBIdByBierdopjeShowSlug(bdShowSlug).then(function(tvdbId) {
							getSeriesfeedShowDataByTVDBId(tvdbId).success(function (sfShowData) {
								var sfSeriesId   = sfShowData.id;
								var sfSeriesName = sfShowData.name;
								var sfSeriesSlug = sfShowData.slug;
								var sfSeriesUrl  = 'https://www.seriesfeed.com/series/';
								var seriesUrl    = "https://www.seriesfeed.com/series/" + sfSeriesSlug;
								var status       = true;

								if (!sfSeriesName) {
									sfSeriesId   = bdShowName;
									sfSeriesName = bdShowName;
									sfSeriesSlug = bdShowSlug;
									seriesUrl    = "http://www.bierdopje.com" + bdShowSlug;
									status       = false;
								}

								var checkbox   = '<fieldset style="min-height: 25px;">&nbsp;</fieldset>';

								if (!status) {
									status     = 'fa-times';
								} else {
									status     = 'fa-check';
									checkbox   = '<fieldset><input type="checkbox" name="series_' + sfSeriesId + '" id="series_' + sfSeriesId + '" class="hideCheckbox"><label for="series_' + sfSeriesId + '"><span class="check" data-series-id="' + sfSeriesId + '" data-series-name="' + sfSeriesName + '" data-show-slug="' + bdShowSlug + '" data-series-url="' + seriesUrl + '"></span></label></fieldset>';
								}

								var item = [sfSeriesName, seriesUrl, status, checkbox];
								seriesList.push(item);

								var progress = (index/(timeWastedLength - 2)) * 100;
								progressBar.css('width', Math.round(progress) + "%");

								resolve();
							}).error(function(error) {
								console.log("Could not connect to Seriesfeed to convert TVDB id " + tvdbId + ".");

								var progress = (index/(timeWastedLength - 2)) * 100;
								progressBar.css('width', Math.round(progress) + "%");

								resolve();
							});
					}, function(error) {
						console.log("Could not connect to Bierdopje to get the TVDB of " + bdShowName + ".");

						resolve();
					});
				});
			}

			var MAX_ASYNC_CALLS = 2;
			var current_async_calls = 0;
			var totalTimeWasted = (timeWastedLength - 1);

			Promise.resolve(1).then(function loop(i) {
				if (current_async_calls < MAX_ASYNC_CALLS) {
					if (i < totalTimeWasted) {
						current_async_calls += 1;
						getBierdopjeTimeWastedItem(i).then(function() {
							current_async_calls -= 1;
						});
						return loop(i + 1);
					}
				} else {
					return new Promise(function(resolve) {
						setTimeout(function() {
							resolve(loop(i));
						}, 80);
					});
				}
			}).then(function() {
				function checkActiveCalls() {
					if(current_async_calls === 0) {
						showResults(seriesList);
					} else {
						setTimeout(checkActiveCalls, 80);
					}
				}

				checkActiveCalls();
			}).catch(function(error) {
				console.log("Unknown error: ", error);
			});
		}, function(error) {
			console.log("Could not connect to Bierdopje to the Time Wasted of " + username + ".");
		});

		function showResults(seriesList) {
			seriesList.sort();
			seriesList.reverse();

			for (var i = 0; i < seriesList.length; i++) {
				var sfSeriesName = seriesList[i][0];
				var sfSeriesUrl  = seriesList[i][1];
				var status       = seriesList[i][2];
				var checkbox     = seriesList[i][3];

				var item = '<tr><td>' + checkbox + '</td><td><a href="' + sfSeriesUrl + '" target="_blank">' + sfSeriesName + '</a></td><td><i class="fa ' + status + '"></i></td></tr>';
				tableHeader.after(item);
			}

			loadingData.html(seriesTable);

			var nextStep = nextStepFactory("Doorgaan", "step-3");
			seriesTable.after(nextStep);

			$('#select-all').on('click', function() {
				toggleAllCheckboxes();
			});

			$('.check').on('click', function() {
				if ($(this).hasClass("checked")) {
					$(this).removeClass("checked");
				} else {
					$(this).addClass("checked");
				}
			});

			$("#step-3").on('click', function() {
				var selectedSeries = [];

				$('.checked').each(function () {
					var seriesId   = $(this).data("series-id");
					var seriesName = $(this).data("series-name");
					var bdShowSlug = $(this).data("show-slug");
					var seriesUrl  = $(this).data("series-url");

					var seriesItem = [seriesName, bdShowSlug, seriesUrl, seriesId];

					selectedSeries.push(seriesItem);
				});

				localStorage.setItem("sftw.selectedSeries", JSON.stringify(selectedSeries));

				stepThree();
			});
		}
	}

	function stepThree() {
		selectStep(3);

		var selectedSeriesParsed = localStorage.getItem("sftw.selectedSeries");
        var selectedSeries = JSON.parse(selectedSeriesParsed);

		content.css('min-height', '');

		var titleCardText = 'Importeren starten';
		var innerCardText = 'Alles staat klaar om te beginnen. Klik op de knop "Importeren" om te starten.';

		var submitInput   = $('<div><input type="button" id="start-import" class="btn btn-success btn-block" value="Importeren" /></div>');
		var bottomPane    = $('<div class="blog-left cardStyle"></div>');
		var detailsTable  = $('<table class="table table-hover responsiveTable favourites stacktable large-only cardStyle" id="details">');
		var detailsHeader = $('<tr><th style="padding-left: 30px;">Serie</th><th>Seizoen</th><th>Aflevering</th></tr>');
		var showDetails   = $('<div class="blog-content" id="details-content"><input type="button" id="show-details" class="btn btn-block" value="Details" /></div>');

		var outerProgress = $('<div class="progress"></div>');
		var progressBar   = $('<div class="progress-bar progress-bar-striped active"></div>');
		outerProgress.css({
			'width': '100%',
			'margin-top': '10px',
			'margin-bottom': '0px'
		});
		outerProgress.append(progressBar);

		submitInput.css('padding', '10px');

		stepTitle.html(titleCardText);
		stepcontent.html(innerCardText);
		content.html(stepTitle);
		stepTitle.after(stepcontent);
		stepcontent.after(submitInput);

		detailsTable.append(detailsHeader);
		bottomPane.append(showDetails);
		showDetails.append(detailsTable);

		$("#start-import").click(function() {
			var favImportBtn = $(this);
			favImportBtn.prop('disabled', true);
			favImportBtn.attr('value', "Bezig met importeren...");
			submitInput.append(outerProgress);
			cardHolder.after(bottomPane);

			var details = $('#details');

			$("#show-details").click(function() {
				detailsTable.toggle();
			});

			var detailsTable = $('#details');

			var seriesLength = selectedSeries.length;

			function setTimeWasted(index) {
				return new Promise(function(resolve) {
					var sfSeriesId  = selectedSeries[index][3];
					var showName    = selectedSeries[index][0];
					var bdShowSlug  = selectedSeries[index][1];
					var sfSeriesUrl = selectedSeries[index][2];

					var tableItem = '<tr><td><a href="' + sfSeriesUrl + '" target="_blank">' + showName + '</a></td><td id="show_' + sfSeriesId + 'seasons"></td><td id="show_' + sfSeriesId + 'episodes"></td></tr>';
					details.append(tableItem);

					getBierdopjeShowSeasonsByShowSlug(bdShowSlug).then(function(bdShowSeasons) {
						var seasonsLength = bdShowSeasons.length;
						var tableSeasons = $('#show_' + sfSeriesId + 'seasons');
						tableSeasons.html("1 van " + seasonsLength);

						function setTimeWastedSeason(si) {
							return new Promise(function(resolve) {
								var bdSeasonUrl = $(bdShowSeasons[si]).val();

								getBierdopjeShowSeasonEpisodesBySeasonUrl(bdSeasonUrl).then(function(bdShowEpisodes) {
									var episodeList = [];
									var tableEpisodes = $('#show_' + sfSeriesId + 'episodes');
									var bdShowEpisodesLength = bdShowEpisodes.length;

									tableEpisodes.html("1 van " + (bdShowEpisodesLength - 1));

									function setTimeWastedSeasonEpisode(ei) {
										return new Promise(function(resolve) {
											var episodeTag = $(bdShowEpisodes[ei]).find('td:eq(1)').html();

											getEpisodeId(sfSeriesId, episodeTag).success(function (result) {
												var episodeId = result.id;
												var aquired    = $(bdShowEpisodes[ei]).find('.AquiredItem').attr('src');
												var seen       = $(bdShowEpisodes[ei]).find('.SeenItem').attr('src');
												var hasAquired = false;
												var hasSeen    = false;

												if (aquired === "http://cdn.bierdopje.eu/g/if/blob-green.png") {
													hasAquired = true;
												}
												if (seen === "http://cdn.bierdopje.eu/g/if/blob-green.png") {
													hasSeen    = true;
												}

												var episodeItem = [sfSeriesId, episodeId, hasAquired, hasSeen];
												episodeList.push(episodeItem);

												if (bdShowEpisodes.length - 1 === episodeList.length) {
													var aquiredList = [];
													var seenList    = [];
													var allAquired  = false;
													var allSeen     = false;

													var seasonUrlParts = bdSeasonUrl.split('/');
													var seasonId = seasonUrlParts[seasonUrlParts.length - 1];

													// check if all episodes in this season were watched or obtained.
													for (var eli = 0; eli < episodeList.length; eli++) {
														var hasAquired = episodeList[eli][2];
														var hasSeen    = episodeList[eli][3];

														if (hasAquired) {
															aquiredList.push(hasAquired);
														}
														if (hasSeen) {
															seenList.push(hasSeen);
														}
													}

													// All episodes seen?
													if (bdShowEpisodes.length - 1 === seenList.length) {
														allSeen = true;
														var type   = "seen";
														var check  = true;
														addSeasonStatus(sfSeriesId, seasonId, type, check);
													}
													// All episodes aquired?
													if (bdShowEpisodes.length - 1 === aquiredList.length) {
														allAquired = true;
														var type   = "obtain";
														var check  = true;
														addSeasonStatus(sfSeriesId, seasonId, type, check);
													}

													// Check loose episodes.
													if (!allAquired || !allSeen) {
														for (var eli = 0; eli < episodeList.length; eli++) {
															var seriesId   = episodeList[eli][0];
															var episodeId  = episodeList[eli][1];
															var hasAquired = episodeList[eli][2];
															var hasSeen    = episodeList[eli][3];

															if (hasSeen && !allSeen) {
																addEpisodeStatus(episodeId, "seen");
															} else if (hasAquired && !allAquired) {
																addEpisodeStatus(episodeId, "obtain");
															}
														}
													}
												}
												tableEpisodes.html(ei + " van " + (bdShowEpisodesLength - 1));
											});

											var progress = (index/seriesLength) * 100;
											progressBar.css('width', Math.round(progress) + "%");

											resolve();
										});
									}

									var MAX_ASYNC_CALLS = 1;
									var current_async_calls = 0;

									Promise.resolve(1).then(function loop(i) {
										if (current_async_calls < MAX_ASYNC_CALLS) {
											if (i < bdShowEpisodesLength) {
												current_async_calls += 1;
												setTimeWastedSeasonEpisode(i).then(function() {
													current_async_calls -= 1;
												});
												return loop(i + 1);
											}
										} else {
											return new Promise(function(resolve) {
												setTimeout(function() {
													resolve(loop(i));
												}, 80);
											});
										}
									}).then(function() {
										function checkActiveCalls() {
											if(current_async_calls === 0) {
												showSeasonEpisodeResults();
											} else {
												setTimeout(checkActiveCalls, 80);
											}
										}
										checkActiveCalls();
									}).catch(function(error) {
										console.log("Unknown error: ", error);
									});

									function showSeasonEpisodeResults() {
										resolve();
									}

									tableSeasons.html(si + " van " + (seasonsLength - 1));
								}, function(error) {
									console.log("Could not connect to Bierdopje to get seasons of url http://www.bierdopje.com/shows" + bdShowSlug + ".");
								});
							});
						}

						var MAX_ASYNC_CALLS = 1;
						var current_async_calls = 0;

						Promise.resolve(0).then(function loop(i) {
							if (current_async_calls < MAX_ASYNC_CALLS) {
								if (i < seasonsLength) {
									current_async_calls += 1;
									setTimeWastedSeason(i).then(function() {
										current_async_calls -= 1;
									});
									return loop(i + 1);
								}
							} else {
								return new Promise(function(resolve) {
									setTimeout(function() {
										resolve(loop(i));
									}, 80);
								});
							}
						}).then(function() {
							function checkActiveCalls() {
								if(current_async_calls === 0) {
									showSeasonResults();
								} else {
									setTimeout(checkActiveCalls, 80);
								}
							}
							checkActiveCalls();
						}).catch(function(error) {
							console.log("Unknown error: ", error);
						});

						function showSeasonResults() {
							resolve();
						}

					}, function(error) {
						console.log("Could not connect to Bierdopje to get seasons of url http://www.bierdopje.com/shows" + bdShowSlug + ".");
					});
				});
			}

			var MAX_ASYNC_CALLS = 1;
			var current_async_calls = 0;

			Promise.resolve(0).then(function loop(i) {
				if (current_async_calls < MAX_ASYNC_CALLS) {
					if (i < seriesLength) {
						current_async_calls += 1;
						setTimeWasted(i).then(function() {
							current_async_calls -= 1;
						});
						return loop(i + 1);
					}
				} else {
					return new Promise(function(resolve) {
						setTimeout(function() {
							resolve(loop(i));
						}, 80);
					});
				}
			}).then(function() {
				function checkActiveCalls() {
					if(current_async_calls === 0) {
						showResults();
					} else {
						setTimeout(checkActiveCalls, 80);
					}
				}
				checkActiveCalls();
			}).catch(function(error) {
				console.log("Unknown error: ", error);
			});

			function showResults() {
				favImportBtn.prop('disabled', false);
				favImportBtn.attr('value', "Favorieten Importeren");
				outerProgress.removeClass('progress');
				progressBar.replaceWith("Importeren voltooid.");
			}
		});
	}

	function stepFactory(steps) {
		var stepList = $('<div></div>');
		stepList.addClass("import-steps");

		for (var i = 1; i <= steps; i++) {
			var div  = $('<div></div>');
			var a    = $('<a></a>');
			var h3   = $('<h3></h3>');

			div.addClass("import-step");
			div.css({
				'text-align': 'center',
                'display': 'inline-block',
				'width'  : '175px',
				'padding': '10px',
				'margin' : '15px'
			});

			a.css({
				'text-align': 'center',
				'text-decoration': 'none'
			});

			div.append(a);
			a.append(h3);
			h3.append("Stap " + i);

			stepList.append(div);
		}

		return stepList;
	}

	function selectStep(step) {
		$(".import-step").each(function(i, current) {
			var selected = "import-selected";
			var current = $(current);

			if (current.hasClass(selected)) {
				current.removeClass(selected);
			}

			if ((i+1) === step) {
				current.addClass(selected);
			}
		});
	}

	function userFactory(user, avatarUrl) {
		var div = $('<div></div>');
		var img = $('<img></img>');
		var h3  = $('<h3></h3>');

		div.addClass("col-md-12 user-img-container");
		img.addClass("user-img");
		h3.addClass("user-name");

		img.attr('src', avatarUrl);
		h3.append(user);

		div.append(img);
		div.append(h3);

		return div;
	}

	function nextStepFactory(text, id) {
		var a = $('<a></a>');

		a.addClass("readMore");
		a.attr('id', id);

		a.css({
			'position': 'absolute',
			'bottom'  : '20px',
			'right'   : '40px',
			'cursor'  : 'pointer'
		});

		a.append(text);

		return a;
	}

	function toggleAllCheckboxes() {
		$('.check').each(function () {
            $(this).click();
		});
	}

	function getCurrentBierdopjeUsername() {
		return new Promise(function(resolve, reject) {
			GM_xmlhttpRequest({
				method: "GET",
				url: "http://www.bierdopje.com/stats",
				onload: function(bdStatsPageData) {
					var bdStatsData  = $('<div></div>').html(bdStatsPageData.responseText);
					var username = bdStatsData.find('#userbox_loggedin').find('h4').html();
					resolve(username);
				},
				onerror: function(error) {
				    reject(error);
				}
			});
		});
	}

	function getBierdopjeAvatarUrlByUsername(username) {
		return new Promise(function(resolve, reject) {
			GM_xmlhttpRequest({
				method: "GET",
				url: "http://www.bierdopje.com/user/" + username + "/profile",
				onload: function(bdProfilePageData) {
					var bdProfileData = $('<div></div>').html(bdProfilePageData.responseText);
					var avatarUrl = bdProfileData.find('.avatar').attr('src');
                    resolve(avatarUrl);
				},
				onerror: function(error) {
				    reject(error);
				}
		    });
		});
	}

	function getBierdopjeTimeWastedByUsername(username) {
		return new Promise(function(resolve, reject) {
			GM_xmlhttpRequest({
				method: "GET",
				url: "http://www.bierdopje.com/user/" + username + "/timewasted",
				onload: function(bdTimeWastedPageData) {
					var bdTimeWastedData = $('<div></div>').html(bdTimeWastedPageData.responseText);
					var bdTimeWasted = bdTimeWastedData.find('table tr');
					resolve(bdTimeWasted);
				},
				onerror: function(error) {
				    reject(error);
				}
			});
		});
	}

	function getTVDBIdByBierdopjeShowSlug(showSlug) {
		return new Promise(function(resolve, reject) {
			GM_xmlhttpRequest({
				method: "GET",
				url: "http://www.bierdopje.com" + showSlug,
				onload: function(bdFavouritePageData) {
					var bdFavouriteData = $('<div></div>').html(bdFavouritePageData.responseText);
					var tvdbId = bdFavouriteData.find('a[href^="http://www.thetvdb.com"]').html();
                    resolve(tvdbId);
				},
				onerror: function(error) {
				    reject(error);
				}
			});
		});
	}

	function getBierdopjeShowSeasonsByShowSlug(showSlug) {
		return new Promise(function(resolve, reject) {
			GM_xmlhttpRequest({
				method: "GET",
				url: "http://www.bierdopje.com" + showSlug + "/episodes/season/",
				onload: function(bdShowSeasonPageData) {
					var bdShowSeasonData = $('<div></div>').html(bdShowSeasonPageData.responseText);
					var seasons = bdShowSeasonData.find('.content').find('.rightfloat').find('p').find('select').find('option');
					resolve(seasons);
				},
				onerror: function(error) {
					reject(error);
				}
			});
		});
	}

	function getBierdopjeShowSeasonEpisodesBySeasonUrl(seasonUrl) {
		return new Promise(function(resolve, reject) {
			GM_xmlhttpRequest({
				method: "GET",
				url: "http://www.bierdopje.com" + seasonUrl,
				onload: function(response) {
					var div = $('<div></div>');
					div.html(response.responseText);
					var episodes = div.find('.content').find('.listing').find('tr');
					resolve(episodes);
				},
				onerror: function(error) {
					reject(error);
				}
			});
		});
	}

	function getSeriesfeedShowDataByTVDBId(tvdbId){
		return $.ajax({
			type: "POST",
			url: "/ajax/serie/find-by", // we should use SeriesFeed.ajaxEndPoints.getEndPoint('ajax.serie.find.by'); instead if available
			data: {
				type: 'tvdb_id',
				data: tvdbId
			},
			dataType: "json"
		});
	}

	function getEpisodeId(seriesId, episodeTag) {
		return $.ajax({
			type: "POST",
			url: "/ajax/serie/episode/find-by", // we should use SeriesFeed.ajaxEndPoints.getEndPoint('ajax.serie.episode.find.by'); instead if available
			data: {
				type: 'series_season_episode',
				serie: seriesId,
				data: episodeTag
			},
			dataType: "json"
		});
	}

	function addSeasonStatus(seriesId, seasonId, type, check) {
		return $.ajax({
			type: "POST",
			url: "/ajax/serie/episode/mark/all", // we should use SeriesFeed.ajaxEndPoints.getEndPoint('ajax.serie.episode.mark.all'); instead if available
			data: {
				series: seriesId,
				season: seasonId,
				seen: check,
				type: type
			},
			dataType: "json"
		});
	}

	function addEpisodeStatus(episodeId, type) {
		return $.ajax({
			type: "POST",
			url: "/ajax/serie/episode/mark/", // we should use SeriesFeed.ajaxEndPoints.getEndPoint('ajax.serie.episode.mark'); instead if available
			data: {
				episode: episodeId,
				type: type,
				status: 'no'
			},
			dataType: "json"
		});
	}

	function getCurrentSeriesfeedUser() {
		var user = $('.nav .dropdown .dropdown-menu:eq(1) li a').attr('href').replace("/user/", "");
		user = user.replace("/", "");

		return user;
	}
});