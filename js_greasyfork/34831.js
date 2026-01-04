// ==UserScript==
// @author	      anthony <bakayarou@gmail.com>
// @name          RevoEnhancement Suite
// @description   a set of UX tweaks for revolutiontt
// @compatible firefox >=8/
// @include		  https://revolutiontt.me/browse.php*
// @include		  https://revolutiontt.me/tvbrowse.php*
// @include		  https://revolutiontt.me/bookmarks.php
// @require       https://cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/js/bootstrap.min.js 
// @require       https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.min.js

// @grant         none
// @version 0.0.1.20171105083514
// @namespace https://greasyfork.org/users/158198
// @downloadURL https://update.greasyfork.org/scripts/34831/RevoEnhancement%20Suite.user.js
// @updateURL https://update.greasyfork.org/scripts/34831/RevoEnhancement%20Suite.meta.js
// ==/UserScript==

var modules = {};

theMovieDb.common.base_uri = "https://api.themoviedb.org/3/";
theMovieDb.common.images_uri = "https://image.tmdb.org/t/p/";
theMovieDb.common.api_key = '8b86a8d90f66b8fb523f30f6b43a65ad';

modules['getDetails'] = (function() {
    const getImdb = {
        'getByImdb': function(imdb, then, fail) {
            this.getById({ 'id': imdb, 'external_source': 'imdb_id' }, then, fail);
        }
    };
    _.assign(theMovieDb.movies, getImdb);
    _.assign(theMovieDb.tvEpisodes, getImdb);

	var showToolTip = function(data, element) {
		let options = {			
            placement: 'right',
            title: function() {
                if (_.isObject(data) && _.has(data, 'overview')) {
                    return data.overview;
                }

                if (_.isString(data)) {
                    let model = _.attempt(() => JSON.parse(data));
                    return _.isError(model) ? data : _.get(model, 'overview', 'No summary available');
                }

                return 'No summary available';
            },
            trigger: 'hover focus'
		};

		$(element).tooltip(options).tooltip('show');
	};
	
	var showPlot = function(options) {
		let opt = {
			id: options.id,
			external_source: options.source
		};
		
		if (_.has(options, 'show')) {
			opt.season_number = options.show.season;
			opt.episode_number = options.show.episode;
		}
		
		let succeeded = _.partial(showToolTip, _, options.element);
		let failed = _.partial(showToolTip, null, options.element); 
		
		theMovieDb.find.getById(opt, function(data) {
			let results = $.parseJSON(data);
			
			switch(options.type) {
				case 'movie': {
					if (results.movie_results.length > 0) {
						opt.id = results.movie_results[0].id;
						theMovieDb.movies.getById(opt, succeeded, failed);
					}
				}
				case 'tv': {
					if (results.tv_results.length > 0) {
						opt.id = results.tv_results[0].id;
						theMovieDb.tvEpisodes.getById(opt, succeeded, failed);
					}
				}
			}
		}, failed);
	};
	
	return {
		go: function() {
			//silence the default tooltip
			$('a[alt="Go to IMDB"]').attr('title', null);
			
			$('table#torrents-top10-table,table#torrents-table')
                .find('a[href^="redir.php"]')
                .each(function(index, anchor) {
                    const success = function(data) {
                        let results = JSON.parse(data);
                        if (results.movie_results.length > 0) {
                            $(anchor)
                                .addClass('has-synopsis')
                                .attr('title', results.movie_results[0].overview);
                        }
                    };

                    let imdb = _.attempt(function() {
                        return {
                            'id': anchor.href.match(/(tt[0-9]+)$/)[1],
                            'external_source': 'imdb_id'
                        };
                    });
                    if (!_.isError(imdb)) {
                        theMovieDb.find.getById(imdb, success, _.noop);
                    }
                });

			$('table#torrents-top10-table a[href^="details.php"]').each(function() {
                    let show = _.attempt(() => {
                        let title = $(this).attr('title');
                        let pattern = /S(\d{2})E(\d{2})/g;
                        let result = pattern.exec(title);

                        return {
                            'title':
                                _.chain(title.slice(0, result.index))
                                 .words(/(?:[A-Z].){3,}|[^.]+/g)
                                 .map(_.trim)
                                 .join(' ')
                                 .value(),
                            'season': result[1],
                            'episode': result[2]
                        };
                    });

                    if (_.isError(show)) {
                        return;
                    }

                    let url =
                    `https://indigent.tech:21976/synopsis/${show.title}/${show.season}/${show.episode}`;
                    let request = new Request(url, { 'method': 'GET' });

                    fetch(request)
                        .then(resp => resp.text())
                        .then(overview => $(this).attr('title', overview).addClass('has-synopsis'))
                        .catch(err => {
                            $(this).attr('title', 'None available').addClass('has-synopsis');
                            console.log(err);
                        })
                });

			$('table#torrents-table > tbody > tr:first').css('line-height', '0');
			$('<th class="colhead"><p><font style="color:#CCCCCC">Info</font></p></th>')
				.insertBefore('table#torrents-table th.colhead:eq(3)');
			
			$('table#torrents-table tr:has(img[alt^="TV"])').each(function() {
				let $row = $(this);
				let $target = $row.find('b').first();

				let infoBtn = document.createElement('a');
				let icon = $('<i class="fa fa-2x fa-info-circle"></i>');
				
				infoBtn.appendChild(icon.get(0));
				infoBtn.href = 'javascript:void(0);';
				infoBtn.onclick = function() {
					let opt = {};
					let show = (function() {
						let t = /(.+?)S(\d{2})E(\d{2})/.exec($target.text());
						return {
							'title': _.trim(t[1]),
							'season': t[2],
							'episode': t[3]
						};
					}());
                    
                    let url = `https://indigent.tech:21976/synopsis/${show.title}/${show.season}/${show.episode}`;
                    let request = new Request(url, { 'method': 'GET' });
                    fetch(request)
                        .then(response => response.text())
                        .then(overview => showToolTip(overview, $target));
				};
				
				$('<td align="center"></td>')
					.insertBefore($row.children('td:eq(4)'))
					.append(infoBtn);
			});
			
			$('table#torrents-table tr:has(img[alt^="Movies"])').each(function() {
				let $row = $(this);
				let $target = $row.children('td.br_right');
				let infoBtn = document.createElement('a');
				let icon = $('<i class="fa fa-2x fa-info-circle"></i>');
				
				infoBtn.appendChild(icon.get(0));
				infoBtn.href = 'javascript:void(0);';
				infoBtn.onclick = function() {
                    let imdb =
                    $row.find('a[title^="Rating"]')
                        .first()
                        .map((idx, el) => /(?:tt[0-9]+)$/.exec(el.href)[0])
                        .get(0);

                    if (imdb) {
                        let target = $target.find('span').get(0);
                        theMovieDb.movies.getByImdb(
                            imdb, _.partial(showToolTip, _, target), _.noop
                        );
                        return;
                    }

                    const movie = _.attempt(() => {
                       let torrent = $target.find('b').text().replace(/^\[REQ\]/, '');
                       let re = /\d{4}/.exec(torrent);
                       return {
                           'title': torrent.slice(0, re.index),
                           'year': parseInt(re[0])
                       };
                    });

                    if (!_.isError(movie)) {
                        const test = result => {
                            movie.title === result.original_title &&
                            movie.year === parseInt(result.release_date.slice(0, 4))
                        };
                        let params = {
                            'query': encodeURI(movie.title),
                            'year': movie.year
                        };
                        let target = $row.find('a').get(0);

                        theMovieDb.search.getMovie(
                            params, data => showToolTip(_.find(data.results, test), target), _.noop
                        );
                    }
				};
				
				$('<td align="center"></td>')
					.insertBefore($row.children('td:eq(4)'))
					.append(infoBtn);
			});
		 }
	};
}());

modules['uploadToSeedBox'] = {
	go: function() {
		$('a[href^="download.php"]').on('click', function(event) {
			event.preventDefault();

            let url = 'https://indigent.tech:21976/upload';
			let request = new Request(url, {
				'method': 'POST',
				'body': encodeURIComponent(event.currentTarget.href)
			});

            fetch(request).then(() => {
                $(event.currentTarget)
                    .children()
                    .first()
                    .replaceWith(
                        '<i class="fa fa-2x fa-cloud-upload"></i>'
                    );
            });
		});
	}
};

modules['easyNav'] = {
	go: function() {
		$(document).on('keyup', function(event) {
			switch(event.which) {
				case 37: {
					var prev = $('a:contains("Prev")').first().attr('href');
					$('table.mainouter').load(prev + ' table.mainouter > tbody');
					break;
				}
				case 39: {
					var next = $('a:contains("Next")').first().attr('href');
					$('table.mainouter').load(next + ' table.mainouter > tbody');
					break;
				}
				default:
				break;
			}
		});
	}
};

modules['noNukes'] = {
	go: function() {
		$('img[src="/pic/radioact.png"]').closest('tr').remove();
	}
};

modules['imdbMods'] = {
    go: function() {
        $('table#torrents-table').on('click', 'a', function(event) {
            let imdb = $(event.currentTarget).attr('href').match(/(tt[0-9]+)$/);

            if (imdb && imdb.length) {
                event.preventDefault();
                const success = function(data) {
                    let results = JSON.parse(data);
                    if (results.movie_results.length) {
                        $(event.currentTarget)
                            .attr('title', results.movie_results[0].overview)
                            .addClass('has-synopsis')
                            .trigger('mouseenter');
                    }
                };

                let opt = {
                    'id': imdb[1],
                    'external_source': 'imdb_id'
                };
                theMovieDb.find.getById(opt, success, _.noop);
            }
        });

        $('a[title="Sort by iMDB rating"]')
            .click(function(event) {
                event.preventDefault();
                let torrents = $('table#torrents-table');

                let unsorted = torrents
                    .find('tr')
                    .slice(1)
                    .map(function(index, row) {
                        let rating = _.attempt(() => {
                            let link = $(row).find('a[title*="Rating"]');
                            if (link.length > 0) {
                                let title = link.first().attr('title');
                                return parseFloat(title.match(/Rating (\d\.\d)/)[1]);
                            }
                            return 0.0;
                        });

                        return {
                            'rating': rating,
                            'row': row
                        };
                    })
                    .get();
                let sorted = _.sortByOrder(unsorted, 'rating', ['desc']);

                torrents
                    .find('tr')
                    .slice(1)
                    .detach();
                torrents
                    .find('tbody')
                    .append(_.map(sorted, 'row')); 
            });
    }
};

modules['autowatch'] = {
	go: function() {
		let tv_torrents = $('table#torrents-table').find(
            'tr:has(td.br_type > a > img[alt^="TV"])'
        );
		let recorded = $('<i class="fa fa-2x fa-eye"></i>');
		
		$('input[name="tv_del"]').click(function() {
			this.value = 'on';
			$.post('taketv.php?return=tvwatch', $(this).parent().serialize());
			$(this).closest('tr').remove();
		});
		
		tv_torrents.each(function() {
			let row = $(this);
			let bookmark = row.find('a.js-bookmark').attr({ 'href': null, 'class': null });
			
			bookmark.click(function(event) {
				event.preventDefault();
				event.stopPropagation();
				
				let url = row.find('a[href^="details.php"]:eq(0)').attr('href');
				let self = $(event.currentTarget);
				
				$.get(url, function(data) {
				   let form = $(data).find('form[action="taketv.php"]');
				   form.children('input[name="tv_proper"]').attr({
					   'value': 'on', 'checked': true
				   });
				   form.children('select[name="tv_type"]').prop('value', 'hdx264');
				   
				   $.post('taketv.php', form.serialize(), function() {
						self.children('img').replaceWith(recorded);
				   });
				});
			});
		});
	}
};

modules['init'] = function() {
    let bootstrap =
        '//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/css/bootstrap.min.css';
    let fontawesome =
        '//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css';

    $('head').append(`<link href="${bootstrap}" rel="stylesheet" type="text/css" />`);
    $('head').append(`<link href="${fontawesome}" rel="stylesheet" type="text/css" />`);
    $('body').css('background-color', 'black');

    const runAll = () => {
        _.forOwn(modules, m => (m['go'] || _.noop).apply());
    };
	
	$('table.mainouter').on('DOMNodeInserted', function(event) {
		if ($(event.target).is('tbody')) {
            runAll();
		} else {
			event.stopPropagation();
		}
	});

    $('body').tooltip({
        placement: 'right',
        selector: '.has-synopsis'
    });
	runAll();
};

modules.init();
