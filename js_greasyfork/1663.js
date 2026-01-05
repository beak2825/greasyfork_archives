// ==UserScript==
// @name        wiki-reference
// @namespace   torvin
// @include     https://www.ncbi.nlm.nih.gov/pubmed/*
// @include     http://www.ncbi.nlm.nih.gov/pubmed/*
// @include     http://adsabs.harvard.edu/abs/*
// @include     http://adsabs.harvard.edu/doi/*
// @include     http://ufn.ru/ru/articles/*
// @include     http://books.google.*/books*
// @include     https://books.google.*/books*
// @include     http://www.sciencedirect.com/science/article/*
// @include     http://gen.lib.rus.ec/scimag/*
// @include     http://onlinelibrary.wiley.com/doi/*
// @include     http://www.jstor.org/stable/*
// @include     http://www.jstor.org/discover/*
// @include     http://projecteuclid.org/euclid.*
// @include     https://projecteuclid.org/euclid.*
// @include     http://link.springer.com/*
// @include     http://www.mathnet.ru/php/archive.phtml*wshow=paper*
// @include     http://elibrary.ru/item.asp*
// @require     https://code.jquery.com/jquery-2.1.1.min.js
// @version     1.8.8
// @description Позволяет генерировать ссылки в формате {{статья}} и {{книга}} для ру-вики
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/1663/wiki-reference.user.js
// @updateURL https://update.greasyfork.org/scripts/1663/wiki-reference.meta.js
// ==/UserScript==

const templates = {
	article: 'статья',
	book: 'книга',
};

const templateAdditionalArgs = {
	'статья': [ 'ref', 'archiveurl', 'archivedate' ],
	'книга': [ 'ref' ],
};

const refTemplateParamOrder = [ 
	'автор', 'часть', 'ссылка часть', 'заглавие', 'ссылка', 'ответственный', 
	'издание', 'издательство', 'год', 'серия', 'том', 'номер', 'страницы', 'страниц', 
	'язык', 'doi', 'bibcode', 'arxiv', 'isbn', 'archiveurl', 'archivedate', 'ref' 
];

var Template = function(name) {
	var attrs = [];

	this.add = function(name, value) {
		attrs.push({
			name: name, 
			value: value
		});
		return this;
	};

	this.get = function(name) {
		return attrs.filter(a => a.name === name).map(a => a.value)[0];
	}

	this.getParamNames = function() {
		return attrs.map(a => a.name);
	}

	this.getName = function() {
		return name;
	}

	var getAttr = function(x) { 
		return "|" + x.name + (x.value === undefined ? "" : " = " + x.value);
	};

	this.toWiki = function() {
		if (attrs.length == 1)
			return "{{" + name + getAttr(attrs[0]) + "}}";
		else
			return "{{" + name + "\n" + attrs.map(a => " " + getAttr(a)).join("\n") + "\n}}";
	};
};

var getText = function(node) {
	return node instanceof Element ? node.textContent : node;
};

var clone = function(obj) {
	var target = {};
	for (var i in obj) {
		var value = obj[i];
		if (value instanceof Function)
			;
		else if (typeof value == 'string')
			;
		else
			value = clone(value);
		target[i] = value;
	}
	return target;
}

var getWpFromXml = function(name, rules, xml) {
	var article = new Template(name);

	for(var name in rules) {
		var rule = rules[name];
		article.add(name, rule.const ||
			Array.slice(xml.querySelectorAll(rule.selector)).map(function(node) {
				if (rule.map)
					node = rule.map(node);
				return Array.isArray(node) ? node.map(getText) : getText(node);
			}).map(function(item) {
				return rule.mapText ? rule.mapText(item) : item;
			}).join(rule.separator || ', ')
		);
	}

	return getRef(article);
};

var Parser = function(sourceText, index, tokens) {
	var _match;
	var _isEof;

	//var _tokenRegex = /(\s*)(\{|\}|,|=|\\\W|\\[\w]+|[^\{\},\\=\s])/g;
	var _tokenRegex = new RegExp("(\\s*)(" + tokens.map(function(x) { return x.source || x }).join('|') + ")", 'g');
	_tokenRegex.lastIndex = index;

	var getToken = function() {
		if (_isEof)
			throw new Error("EOF");

		var index = _tokenRegex.lastIndex;

		var res = _tokenRegex.exec(sourceText);
		if (!res) {
			_isEof = true;
			return null;
		}
		_match = {
			match: res[0],
			token: res[2],
			space: res[1].replace(/\s+/g, ' '),
			index: index,
		}
	}

	this.matchAny = function() {
		var res = _match;
		getToken();
		return res;
	}

	this.match = function(str) {
		if (_match.token !== str)
			throw new Error("Parser error at pos " + _tokenRegex.lastIndex + ". Expected '" + str + "', found '" + _match.token + "'.");
		return this.matchAny();
	}

	this.matchIgnoreCase = function(str) {
		if (_match.token.toUpperCase() !== str.toUpperCase())
			throw new Error("Parser error at pos " + _tokenRegex.lastIndex + ". Expected '" + str + "', found '" + _match.token + "'.");
		return this.matchAny();
	}

	this.matchAnyIgnoreCase = function(strs) {
		if (strs.every(function(str) { return _match.token.toUpperCase() !== str.toUpperCase(); }))
			throw new Error("Parser error at pos " + _tokenRegex.lastIndex + ". Expected any of: '" + strs.join("', '") + "', found '" + _match.token + "'.");
		return this.matchAny();
	}

	this.matchNot = function(strs) {
		if (strs.indexOf(_match.token) != -1)
			throw new Error("Parser error at pos " + _tokenRegex.lastIndex + ". Unexpected '" + _match.token + "'.");
		return this.matchAny();
	}

	this.index = function() {
		return _match.index;
	}

	this.isEof = () => _isEof;

	Object.defineProperty(this, "token", { get: function() { return _match.token; }});

	getToken();
}

var Bibtex = function(sourceText, index) {
	var _plainText = /[^\{\},\\=\s"\$]+/;
	const _tokens = [
		/\{/,
		/\}/,
		/"/,
		/,/,
		/=/,
		/@/,
		/\$/,
		/\\\W/,
		/\\[\w]+/,
		_plainText,
	];

	var _parser = new Parser(sourceText, index || 0, _tokens);

	var entry = function() {
		_parser.match("{");
		var id = fieldValue();
		_parser.match(",");
		var f = fields();
		_parser.match("}");

		f.bibcode = id;
		return f;
	}

	var comment = function() {
		_parser.match("{");
		var text = fieldValue();
		_parser.match("}");
		return { comment: text };
	}

	var type = function(entryTypes) {
		_parser.match('@');
		var token = _parser.token;
		if (entryTypes.length)
			_parser.matchAnyIgnoreCase(entryTypes);
		else
			_parser.matchAny();
		return token;
	}

	var fields = function() {
		var res = {};
		for(;;) {
			var f = field();
			res[f.name] = f.value;
			if (_parser.token !== ",") break;
			_parser.match(",");
			if (_parser.token === "}") break;
		}
		return res;
	}

	var quoted = function() {
		return _parser.match("{").space + quotedValue() + _parser.match("}").space;
	}

	var diacritics = {
		'`': '\u0300',
		'\'': '\u0301',
		'^': '\u0302',
		'~': '\u0303',
		'=': '\u0304',
		'u': '\u0306',
		'.': '\u0307',
		'"': '\u0308',
		'r': '\u030a',
		'H': '\u030b',
		'v': '\u030c',
		'c': '\u0327',
		'k': '\u0328',
		'd': '\u0323',
		'b': '\u0331',
		't': '\u0361',
	};

	var ligatures = {
		'L': '\u0141',
		'l': '\u0142',
		'AA': '\u00c5',
		'aa': '\u00e5',
		'AE': '\u00c6',
		'ae': '\u00e6',
		'O': '\u00d8',
		'o': '\u00f8',
		'OE': '\u0152',
		'oe': '\u0153',
		'i': '\u0131',
		'j': '\u0237',
		'ss': '\u00df',
	};

	var entity = function() {
		if (_parser.token[0] != '\\')
			throw new Error("Expected entity, found " + _parser.token);

		var cmd = _parser.matchAny().token.substr(1);

		var value = ligatures[cmd];
		if (value)
			return value;

		value = diacritics[cmd];
		if (value)
			return fieldValue() + value;

		return cmd;
	}

	var quotedValue = function() {
		var res = "";
		for(;;) {
			if (_parser.token === "{")
				res += quoted();
			else if (_parser.token === "}")
				break;
			else if (_parser.token[0] === '\\')
				res += entity();
			else
				res += plainText();
		}
		return res;
	}

	var plainText = function() {
		return _parser.matchAny().match.replace(/---?/g, '—').replace(/~/g, ' ');
	}

	var fieldValue = function() {
		var res = "";
		for(;;) {
			if (_parser.token == "{")
				res += quoted();
			else if (_parser.token == '"')
				res += doubleQuoted();
			else if (_parser.token[0] === '\\')
				res += entity();
			else if (_parser.token === '$')
				res += math();
			else if (_plainText.test(_parser.token))
				res += plainText();
			else
				break;
		}
		return res.trim();
	}

	var amsFieldValue = function() {
		var res = "";
		for(;;) {
			if (_parser.isEof())
				break;
			else if (_parser.token == "{")
				res += quoted();
			else if (_parser.token == '"')
				res += doubleQuoted();
			else if (_parser.token[0] === '\\')
				res += entity();
			else if (_parser.token === '$')
				res += math();
			else
				res += plainText();
		}
		return res.trim();
	}

	var math = function() {
		var before = _parser.match('$').space;
		var res = '';
		for(;;) {
			if (_parser.token === '$')
				break;
			else
				res += _parser.matchAny().match;
		}
		return before + '<math>' + res + '</math>' + _parser.match('$').space;
	}

	var doubleQuoted = function() {
		return _parser.match('"').space + doubleQuotedValue() + _parser.match('"').space;
	}

	var doubleQuotedValue = function() {
		var res = "";
		for(;;) {
			if (_parser.isEof())
				throw new Error("Unexpected EOF.");
			else if (_parser.token == "{")
				res += quoted();
			else if (_parser.token == '"')
				break;
			else if (_parser.token[0] === '\\')
				res += entity();
			else if (_parser.token === '$')
				res += math();
			else
				res += plainText();
		}
		return res;
	}

	var field = function() {
		var name = fieldValue();
		_parser.match("=");
		var value = fieldValue();

		return {
			name: name,
			value: value
		}
	}

	this.index = function() {
		return _parser.index();
	}

	this.parse = function(entryTypes) {
		if (!entryTypes)
			entryTypes = []
		else if (typeof entryTypes == 'string' || entryTypes instanceof String)
			entryTypes = [ entryTypes ];
		var realType = type(entryTypes);

		if (realType.toLowerCase() == 'comment')
			var result = comment();
		else
			var result = entry();

		result.type = realType;
		return result;
	}

	this.parseAmsFieldValue = function() {
		return amsFieldValue();
	}
}

var bibtexBase = {
	'автор': {
		selector: 'author',
		map: (text) => authorsToWiki(getAuthors(text)),
	},
	'заглавие': {
		selector: 'title',
		map: function(text) {
			return text.replace(/^"|"$/g, '')
		}
	},
	'издание': { 
		selector: 'journal',
		map: function(text) {
			return {
				aj: 'Astronomical Journal',
				actaa: 'Acta Astronomica',
				araa: 'Annual Review of Astron and Astrophys',
				apj: 'Astrophysical Journal',
				apjl: 'Astrophysical Journal, Letters',
				apjs: 'Astrophysical Journal, Supplement',
				ao: 'Applied Optics',
				apss: 'Astrophysics and Space Science',
				aap: 'Astronomy and Astrophysics',
				aapr: 'Astronomy and Astrophysics Reviews',
				aaps: 'Astronomy and Astrophysics, Supplement',
				azh: 'Astronomicheskii Zhurnal',
				baas: 'Bulletin of the AAS',
				caa: 'Chinese Astronomy and Astrophysics',
				cjaa: 'Chinese Journal of Astronomy and Astrophysics',
				icarus: 'Icarus',
				jcap: 'Journal of Cosmology and Astroparticle Physics',
				jrasc: 'Journal of the RAS of Canada',
				memras: 'Memoirs of the RAS',
				mnras: 'Monthly Notices of the RAS',
				na: 'New Astronomy',
				nar: 'New Astronomy Review',
				pra: 'Physical Review A: General Physics',
				prb: 'Physical Review B: Solid State',
				prc: 'Physical Review C',
				prd: 'Physical Review D',
				pre: 'Physical Review E',
				prl: 'Physical Review Letters',
				pasa: 'Publications of the Astron. Soc. of Australia',
				pasp: 'Publications of the ASP',
				pasj: 'Publications of the ASJ',
				rmxaa: 'Revista Mexicana de Astronomia y Astrofisica',
				qjras: 'Quarterly Journal of the RAS',
				skytel: 'Sky and Telescope',
				solphys: 'Solar Physics',
				sovast: 'Soviet Astronomy',
				ssr: 'Space Science Reviews',
				zap: 'Zeitschrift fuer Astrophysik',
				nat: 'Nature',
				iaucirc: 'IAU Cirulars',
				aplett: 'Astrophysics Letters',
				apspr: 'Astrophysics Space Physics Research',
				bain: 'Bulletin Astronomical Institute of the Netherlands',
				fcp: 'Fundamental Cosmic Physics',
				gca: 'Geochimica Cosmochimica Acta',
				grl: 'Geophysics Research Letters',
				jcp: 'Journal of Chemical Physics',
				jgr: 'Journal of Geophysics Research',
				jqsrt: 'Journal of Quantitiative Spectroscopy and Radiative Transfer',
				memsai: 'Mem. Societa Astronomica Italiana',
				nphysa: 'Nuclear Physics A',
				physrep: 'Physics Reports',
				physscr: 'Physica Scripta',
				planss: 'Planetary Space Science',
				procspie: 'Proceedings of the SPIE',
			}[text] || text;
		},
	},
	'год': {
		selector: 'year',
	},
	'номер': {
		selector: 'number',
	},
	'том': {
		selector: 'volume',
	},
	'страницы': {
		selector: 'pages',
	},
	'издательство': { 
		selector: 'publisher',
	},
	'issn': {
		selector: 'issn',
	},
	'doi': {
		selector: 'doi',
	},
	'arxiv': {
		selector: 'eprint',
		map: function(text) {
			const prefix = 'arXiv:';
			if (text.indexOf(prefix) == 0)
				text = text.substr(prefix.length);
			return text;
		}
	},
	'ссылка': { const: "" },
	'язык': { const: "en" },
};

var getAuthors = function(text) {
	return text.split(' and ').map(function(name) {
		return name.replace(',', '');
	});
};

var authorsToWiki = function(authors) {
	return authors.map(function(name) {
		return new Template('nobr').add(name).toWiki() 
	}).join(', ');
};

var switchAuthorNameParts = function(name) {
	var match = /^(.+) (\S+)$/.exec(name);
	if (!match) return name;
	return match[2] + ' ' + match[1];
}

var getWpFromObj = function(name, rules, obj) {
	var article = new Template(name);

	for(var name in rules) {
		var rule = rules[name];

		var value;
		if (rule.const !== undefined)
			value = rule.const
		else {
			if (typeof rule.selector === "function")
				value = rule.selector(obj);
			else
				value = obj[rule.selector];
			if (!value)continue;
		}

		if (rule.map)
			value = rule.map(value, obj);

		article.add(name, value);
	}

	return getRef(article);
}

var getRef = function(template) {
	// adding additional args
	for(var a of templateAdditionalArgs[template.getName()] || []) {
		if (template.get(a) === undefined)
			template.add(a, '');
	}

	// ordering
	var orderedTemplate = new Template(template.getName());
	var names = template.getParamNames();
	
	var getOrder = x => {
		var i = refTemplateParamOrder.indexOf(x.toLowerCase());
		return i === -1 ? 99999 : i;
	}
	names.sort((x, y) => getOrder(x) - getOrder(y));

	for(var name of names)
		orderedTemplate.add(name, template.get(name));

	return orderedTemplate.toWiki();
}

var testUrl = function(regex) {
	return regex.exec(window.location.href)
}

var createWpButton = function(getResult, tag, param) {
	tag = tag || 'a';
	return $('<' + tag + '>')
		.attr('href', '#')
		.text('WP')
		.click(function(e) {
			e.preventDefault();

			var promise = $.Deferred();

			promise.done(function(result) {
				showResult(result);
			}).fail(function(result) {
				alert(result);
			});

			getResult({
				resolve: function(result) {
					promise.resolve(result)
				},
				reject: function(result) {
					promise.reject(result)
				},
			}, param);
		})
		.get(0);
}

var showResult = function(text) {
	var button;

	var dialog = $('<div>').css({
		'position': 'fixed',
		'top': 0,
		'left': 0,
		'width': '100%',
		'height': '100%',
		'z-index': 9999999,
	}).appendTo(document.body).append(
		// dimmer
		$('<div>').css({
			'width': '100%',
			'height': '100%',
			'background-color': 'black',
			'opacity': 0.6,
		})
	).append(
		// dialog container
		$('<div>').css({
			'display': 'table',
			'position': 'absolute',
			'top': 0,
			'left': 0,
			'width': '100%',
			'height': '100%',
			'font': '12px sans-serif',
		}).append(
			$('<div>').css({
				'text-align': 'center',
				'display': 'table-cell',
				'vertical-align': 'middle',
			}).append(
				// dialog
				$('<div>').css({
					'padding': 10,
					'background-color': 'white',
					'display': 'inline-block',
					'max-width': '80%',
				}).append(
					// text
					$('<div>').css({
						'padding': 5,
						'white-space': 'pre-wrap',
						'text-align': 'left',
					}).text(text)
				).append(
					// buttons
					$('<div>').css({
						'text-align': 'right',
						'margin-top': 10,
					}).append(
						button = $('<button>').text('Copy & close').click(function() {
							GM_setClipboard(text);
							dialog.remove();
						}).focus()
					).append(
						$('<button>').text('Cancel').click(function() {
							dialog.remove();
						})
					)
				)
			)
		)
	);

	button.focus();
};

var getFormData = function(data) {
	if (data && typeof(data) !== 'string') {
		var params = [];
		for(var k in data) {
			params.push(encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
		}
		data = params.join('&');
	}
	return data;
}

var ajaxGet = function(url, process) {
	var data;
	if (!(typeof url === 'string' || url instanceof String)) {
		var { url, data } = url;
	}

	if (data)
		url = url + '?' + getFormData(data);

	return ajax({
		method: 'GET',
		url: url,
	}, process);
};

var ajaxPost = function({ url, data }, process) {
	return ajax({
		method: 'POST',
		url: url,
		data: getFormData(data),
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
	}, process);
};

var ajax = function(params, process) {
	var promise = $.Deferred();

	params.onload = function(response) {
		try {
			promise.resolve(process(response.responseText));
		} catch(e) {
			promise.reject(e + '\n\n' + e.stack);
		}
	}
	setTimeout(function() {
		GM_xmlhttpRequest(params)
	}, 0);

	return promise.promise();
};

var getBibtex = function(params) {
	return function(text) {
		var bibtex = (params.parse || (t => new Bibtex(t).parse()))(text);
		var template = (params.getTemplate && params.getTemplate(bibtex)) || (params.templates || templates)[bibtex.type.toLowerCase()];
		if (!template) {
			throw new Error('unknown type: ' + bibtex.type);
		}
		return getWpFromObj(template, params.getRules(bibtex.type), bibtex);
	}
};

var getXml = function(params) {
	return function(text) {
		var xml = params.parse(text);
		var template = params.getTemplate(xml);
		if (!template) {
			throw new Error('unknown type: ' + bibtex.type);
		}
		return getWpFromXml(template, params.getRules(xml), xml);
	}
};

var proecssPage = function(page, res) {
	var onButton = function(promise, param) {
		try {
			$.when(page.act(res, param)).then(promise.resolve, promise.reject);
		} catch(e) {
			promise.reject(e + '\n\n' + e.stack);
		}
	};

	page.attach(createWpButton.bind(null, onButton));
};

(function(pages) {
	try {
		for(var page of pages) {
			var res = page.test();
			if (res) {
				proecssPage(page, res);
				break;
			}
		};
	} catch(e) {
		alert(e + '\n\n' + e.stack);
	}
})([
	// pubmed
	{
		test: function() {
			return testUrl(/\/pubmed\/(\d+)\/?$/);
		},
		attach: function(createButton) {
			$('#messagearea').after(
				$('<div>').append(createButton())
			);
		},
		act: ([,id]) => ajaxGet({
			url: id,
			data: { dopt: 'Abstract', report: 'xml', format: 'text' },
		}, getXml({
			parse: function(text) {
				var html = new DOMParser().parseFromString(text, "text/html");
				return new DOMParser().parseFromString(html.body.textContent, "text/xml");
			},
			getTemplate: () => templates.article,
			getRules: () => ({
				'автор': {
					selector: 'Article > AuthorList > Author',
					map: function(node) {
						var name = getText(node.querySelector('CollectiveName'));
						if (name) return name;
						name = [ node.querySelector('LastName'), node.querySelector('Initials') ].map(getText);
						return new Template('nobr').add(name[0] + ' ' + name[1].replace(/(.)/g, "$1. ").trim()).toWiki()
					},
				},
				'заглавие': {
					selector: 'Article > ArticleTitle',
					mapText: function(text) { return text.replace(/^(.*?)\.?$/, "$1") },
				},
				'издание': { 
					selector: 'Article > Journal > Title',
				},
				'год': {
					selector: 'Article > Journal > JournalIssue > PubDate',
					mapText: function(text) { return /^\s*(\d{4})/.exec(text)[1] },
				},
				'номер': {
					selector: 'Article > Journal > JournalIssue > Issue',
				},
				'том': {
					selector: 'Article > Journal > JournalIssue > Volume',
				},
				'страницы': {
					selector: 'Article > Pagination > MedlinePgn',
					mapText: text => text.replace('-', '—'),
				},
				'issn': {
					selector: 'Article > Journal > ISSN[IssnType=Electronic]',
				},
				'doi': {
					selector: 'ArticleIdList > ArticleId[IdType=doi]',
				},
				'pmid': {
					selector: 'ArticleIdList > ArticleId[IdType=pubmed]',
				},
				'язык': { const: "en" },
				'ссылка': { const: "" },
			}),
		})),
	},
	// adsabs
	{
		test: function() {
			return testUrl(/adsabs\.harvard\.edu\/(?:abs|doi)\/(.*)$/);
		},
		attach: function(createButton) {
			$('h3').eq(0)
				.append(document.createTextNode(' '))
				.append(createButton());
		},
		act: ([,id]) => ajaxGet({
			url: '/cgi-bin/nph-bib_query',
			data: { data_type: 'BIBTEX', bibcode: decodeURIComponent(id) },
		}, getBibtex({
			parse: function(text) {
				var index = text.search(/@\w+{/);
				if (index == -1)
					throw new Error('bibtex not found');
				return new Bibtex(text, index).parse([ 'article', 'book', 'inproceedings' ]);
			},
			getRules: function() {
				var bibtex = clone(bibtexBase);
				bibtex.bibcode = { selector: 'bibcode' };
				bibtex.издание = {
					selector: obj => obj['journal'] || obj['booktitle'],
					map: bibtex.издание.map,
				}
				return bibtex;
			},
			templates: Object.assign({ 'inproceedings': templates.article }, templates),
		})),
	},
	// ufn
	{
		test: function() {
			return testUrl(/\/ufn\.ru\/ru\/articles\/(\d+\/\d+\/\w+)\//);
		},
		attach: function(createButton) {
			$('#print > table tr > td').next().append(
				$('<td>').append(createButton())
			);
		},
		act: ([, id]) => ajaxGet('/ru/articles/' + id + '/citation/ru/bibtex.html', getBibtex({
			parse: function(text) {
				var html = new DOMParser().parseFromString(text, "text/html");
				var node = html.body.querySelector('.cit_code > pre');
				if (!node)
					throw new Error('bibtex not found');
				return new Bibtex(node.textContent).parse('article');
			},
			getRules: function() {
				var bibtex = clone(bibtexBase);

				var nameRegex = /^(.+) (\S+)$/;
				bibtex.автор.map = function(text) {
					return authorsToWiki(getAuthors(text).map(switchAuthorNameParts));
				}
				delete bibtex.издательство;
				bibtex.страницы.map = t => t.replace('-', '—');
				bibtex.ссылка = { const: 'http://ufn.ru/ru/articles/' + id + '/' };
				bibtex.язык = { const: "ru" };

				return bibtex;
			}
		})),
	},
	// google books
	{
		test: function() {
			return window.self == window.top && testUrl(/https?:\/\/books\.google\..+\/books.*[?&]id=([^&$]+)/);
		},
		attach: function(createButton) {
			var button = $(createButton()).addClass('gb-button').css('margin-left', '4px');
			$('.metadata_value > .gb-button:last-child, #gb-get-book-container > *:first-child')
			 	.parent()
			 	.append(button);
		},
		act: ([, id]) => ajaxGet({
			url: 'http://books.google.us/books/download/',
			data: { id: id, output: 'bibtex' },
		}, getBibtex({
			parse: t => new Bibtex(t).parse('book'),
			getRules: function() {
				var bibtex = clone(bibtexBase);
				bibtex.серия = { 'selector': 'series' };
				bibtex.страниц = { const: "" };
				bibtex.isbn = { 'selector': 'isbn' };
				bibtex.ссылка = { const: 'http://books.google.com/books?id=' + id };
				return bibtex;
			}
		})),
	},
	// sciencedirect
	{
		test: function() {
			return testUrl(/sciencedirect\.com\/science\/article\//);
		},
		attach: function(createButton) {
			$('#articleNav > ul').prepend($('<li />').append(
				$(createButton()).attr('type', 'button').val('WP').css({
					'vertical-align': 'middle',
					'line-height': '40px',
				})
			));
		},
		act: function() {
			var params = {
				'citation-type': 'BIBTEX'
			};
			$('form[name=exportCite] input[type=hidden]').each(function(i, hidden) {
				params[$(hidden).attr('name')] = $(hidden).val();
			});
			return ajaxPost({
				url: $('form[name=exportCite]').attr('action'),
				data: params,
			}, getBibtex({
				parse: t => new Bibtex(t).parse('article'),
				getRules: function() {
					var bibtex = clone(bibtexBase);
					bibtex.ссылка = { selector: 'url' };
					bibtex.doi.map = function(text) {
						var res = /http:\/\/dx\.doi\.org\/(.*)$/.exec(text) || [];
						return res[1] || text;
					}
					bibtex.страницы.map = function(text) {
						return text.replace(' - ', '—')
					}
					return bibtex;
				}
			}))
		},
	},
	// Library Genesis
	{
		test: function() {
			return testUrl(/gen\.lib\.rus\.ec\/scimag\//);
		},
		attach: function(createButton) {
			$('a[href^="bibtex.php?"]').each((i, e) => {
				var button = createButton('a', $(e).attr('href'));
				button.style.fontWeight = 'bold';
				$(e).after('<br />', button);
			});
		},
		act: (_, url) => ajaxGet({
			url: url,
		}, getBibtex({
			parse: text => {
				var html = new DOMParser().parseFromString(text, "text/html");
				return new Bibtex(html.querySelector('textarea#bibtext').value).parse('article');
			},
			getRules: function() {
				var bibtex = clone(bibtexBase);
				bibtex.номер = { selector: 'issue' };
				bibtex.страницы = { selector: 'page' };
				bibtex.язык = { const: '' };
				return bibtex;
			},
		})),
	},
	// wiley
	{
		test: function() {
			return testUrl(/onlinelibrary\.wiley\.com\/doi\//)
		},
		attach: function(createButton) {
			$('#promosAndTools .titleTools').append($('<li>').append(createButton()));
		},
		act: function() {
			var [, doi] = /^DOI:\s+(.+)$/.exec($('#doi').text().trim());
			if (!doi) throw new Error('doi not found');

			return ajaxPost({
				url: '/documentcitationdownloadformsubmit',
				data: { doi: doi, fileFormat: 'BIBTEX', hasAbstract: 'CITATION' },
			}, getBibtex({
				getRules: function() {
					var bibtex = clone(bibtexBase);
					bibtex.ссылка = { selector: 'url' };
					return bibtex;
				}
			}))
		},
	},
	// jstor
	{
		test: function() {
			return testUrl(/www\.jstor\.org\/[^\/]+\/(.*?)($|\?)/)
		},
		attach: function(createButton) {
			$('.action-buttons').append($('<li>').append($(createButton()).addClass('button button-jstor')));
		},
		act: ([, id]) => ajaxGet('/citation/text/' + id, getBibtex({
			getRules: function() {
				var bibtex = clone(bibtexBase);
				bibtex.ссылка = { selector: 'URL' };
				bibtex.номер.selector = function(obj) {
					return obj['number'] || obj['jstor_issuetitle'];
				}
				bibtex.страницы.map = function(text) {
					return text.replace(/^p?p\. /, "").replace('-', '—');
				};
				return bibtex;
			},
		})),
	},
	// projecteuclid
	{
		test: function() {
			return testUrl(/projecteuclid.org\/(euclid\..*?\/\d+)/);
		},
		attach: function(createButton) {
			$('#export-form').append($(createButton()).addClass('btn export-link-special'))
		},
		act: ([, id]) => ajaxPost({
			url: '/export_citations',
			data: { format: "bibtex", delivery: "browser", address: '', h: id },
		}, getBibtex({
			templates: { 
				'article': templates.article,
				'inbook': templates.book,
			},
			getRules: function(type) {
				var bibtex = clone(bibtexBase);
				bibtex.издание = { selector: 'fjournal' };

				if (type.toLowerCase() == 'inbook') {
					bibtex.место = { selector: 'address' };
					bibtex.часть = bibtex.заглавие;
					bibtex.заглавие = { selector: 'booktitle' };
					bibtex['ссылка часть'] = { selector: 'url' };
					delete bibtex.ссылка;
				} else {
					bibtex.ссылка = { selector: 'url' };
				}

				return bibtex;
			}
		})),
	},
	// springer
	{
		test: () => testUrl(/\/link\.springer\.com\/([^#]+)/),
		attach: function(createButton) {
			if ($('#export-citation').length)
				$('.other-actions > ul').append($('<li>').append(createButton()));
		},
		act: ([, id]) => ajaxGet('http://link.springer.com/export-citation/' + id + '.bib', getBibtex({
			parse: text => new Bibtex(text.replace(/^@.*?{/, '$&x,')).parse(),
			templates: {
				'article': templates.article,
				'incollection': templates.book,
			},
			getRules: function(type) {
				var bibtex = clone(bibtexBase);
				bibtex.страницы.map = t => t.replace('-', '—');
				bibtex.ссылка = { const: 'http://link.springer.com/' + id };
				if (type == 'incollection') {
					bibtex.ответственный = { 
						selector: 'editor',
						map: text => 'Ed. by ' + authorsToWiki(getAuthors(text)),
					};
					bibtex.серия = { 'selector': 'series' };
					bibtex.часть = bibtex.заглавие;
					bibtex.заглавие = { selector: 'booktitle' };
					bibtex['ссылка часть'] = bibtex.ссылка;
					bibtex.ссылка = { const: $('#about-link').attr('href') };
					bibtex.isbn = { 'selector': 'isbn' };
				} else if (type == 'article') {
					delete bibtex.издательство;
				}
				return bibtex;
			}
		})),
	},
	// mathnet
	{
		test: () => testUrl(/\/www\.mathnet\.ru\//),
		attach: function(createButton) {
			$('#citPaperAMSBIBID').before(createButton());
		},
		act: () => getBibtex({
			parse: t => {
				var transl = false;
				var res = {};
				for(var line of t.split('\n')) {
					if (!line) continue;
					var [, key, value] = /^\\(\w+)\s*(.*)$/.exec(line);
					if (key === 'transl' || key === 'rtransl') {
						transl = true;
						continue;
					}
					if (transl)
						key = 'transl_' + key;
					if (key == 'by') 
						value = value.replace(/([^\\]), /g, '$1 and ');
					res[key] = new Bibtex(value).parseAmsFieldValue();
				}
				return res;
			},
			getTemplate: () => templates.article,
			getRules: () => ({
				'автор': { 
					selector: 'by',
					map: text => authorsToWiki(getAuthors(text).map(switchAuthorNameParts)),
				},
				'заглавие': { selector: 'paper' },
				'издание': { selector: b => b.journalname || b.jour || b.serial },
				'год': { selector: 'yr' },
				'номер': { selector: 'issue' },
				'том': { selector: 'vol' },
				'страницы': { selector: 'pages' },
				'издательство': { selector: 'publ' },
				'ссылка': { selector: 'mathnet' },
				'язык': { const: 'ru' },
				'bibcode': {
					selector: 'adsnasa',
					map: url => /bib_query\?(.*)$/.exec(url)[1],
				}
			}),
		})($('#citPaperAMSBIBID pre').text())
	},
	// elibrary
	{
		test: () => testUrl(/elibrary\.ru\/item.asp/),
		attach: function(createButton) {
			var space = $('.left-panel').eq(0).parents('tr').eq(0).next('tr');
			$('<tr>').append(
				$('<td>').append(
					$('<div>').addClass('left-panel').append(
						$(createButton()).css({
							fontWeight: 'bold',
							color: '#F26C4F',
						})
					)
				)
			).insertAfter(space).after(space.clone());
		},
		act: () => {
			var data = {};
			const mapping = {
				'язык': {
					value: v => ({
						'русский': 'ru',
						'английский': 'en',
					}[v] || '')
				},
				'страницы': {
					key: 'pages',
					value: v => v.replace('-', '—'),
				},
				'том': {
					key: 'volume'
				},
				'номер': {
					key: 'number'
				},
				'год': {
					key: 'year'
				},
				'журнал': {
					key: 'journal'
				},
			};

			var add = function(key, value) {
				var m = mapping[key];
				if (!m) {
					data[key] = value;
				} else {
					data[m.key || key] = (m.value && m.value(value)) || value;
				}
			}

			var processRecords = function(e) {
				if (e.nodeType == 3) {
					var text = $(e).text().trim();
					if (text && text[text.length - 1] == ':')
						processRecords.key = text.substr(0, text.length - 1).toLowerCase();
				} else if ($(e).is('font,a') && processRecords.key !== undefined) {
					var value = $(e).text().trim();
					add(processRecords.key, value);
					processRecords.key = undefined;
				}
			}

			var title = $('tr[valign=middle][align=center] .bigtext').eq(0).parents('table').eq(0);
			var tables = title.nextAll('table');

			data.title = title.text().trim();
			data.author = authorsToWiki(tables.eq(0).find('span b').get().map(e => $(e).text()));

			tables.eq(1).find('table td').contents().each((i, e) => processRecords(e));

			processRecords(tables.eq(2).find('tr font').contents()[0]);
			tables.eq(2).find('tr').eq(1).find('td').eq(1).contents().each((i, e) => processRecords(e));

			var bibtex = clone(bibtexBase);
			bibtex.автор = { selector: 'author' };
			bibtex.язык = { selector: 'язык' };
			bibtex.ссылка = { const: location.href };

			return getWpFromObj(templates.article, bibtex, data);
		},
	},
]);
