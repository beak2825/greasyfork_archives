// ==UserScript==
// @name        VLC Station
// @namespace   VLCStation
// @description Makes play buttons in Video Station generate VLC playlists rather than playing videos in the browser.
// @include     /^https?://[^/]*/.*[?&]launchApp=SYNO.SDS.VideoStation.AppInstance(?=[&#]|$).*$/
// @version     7
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/36455/VLC%20Station.user.js
// @updateURL https://update.greasyfork.org/scripts/36455/VLC%20Station.meta.js
// ==/UserScript==

(function()
{
	'use strict';

	var DSRequest;
	var FileServer;
	var Playlist;
	var Problem;
	var Thumbnail;
	var VLCStation;
	var Platform;

	Platform = 
	{
		LINUX: navigator.platform.startsWith("Linux ")
	};

	Problem =
	{
		MESSAGE__HEADING:                    "VLC Station Error",
		MESSAGE_INVALID_REQUEST:             "An invalid request was made.",
		MESSAGE_NO_CONTACT:                  "Unable to contact the DiskStation.",
		MESSAGE_UNEXPECTED_RESPONSE_FORMAT:  "Unexpected response structure.",
		MESSAGE_UNKNOWN_THUMBNAIL_TYPE:      "Unknown thumbnail type.",
		MESSAGE_UNKNOWN_ITEM_FORMAT:         "Unknown item format.",

		EXTRA_STATUS_CODE:                   "Status code",
		EXTRA_ERROR_CODE:                    "Error code",
		EXTRA_FIELD:                         "Field",
		EXTRA_PATH_ELEMENT:                  "Path element",
		EXTRA_INDEX:                         "Index",
		EXTRA_TYPE:                          "Type",

		PREFIX_EXTRA_SYNOLOGY:               "Synology ",

		SEPARATOR_EXTRA:                     "\n",
		SEPARATOR_EXTRA_ITEM:                ": ",
		SEPARATOR_SECTION:                   "\n\n",

		report: function(message, extra)
		{
			var index;
			var buffer;

			buffer = [];
			if(extra)
				for(index in extra)
					buffer.push(index + Problem.SEPARATOR_EXTRA_ITEM + extra[index]);
			alert([Problem.MESSAGE__HEADING, message, buffer.join(Problem.SEPARATOR_EXTRA)].join(Problem.SEPARATOR_SECTION) + Problem.SEPARATOR_SECTION);

			return;
		}
	};


	(Thumbnail = function(element)
	{
		this._element = element;

		return;
	}).prototype =
	{
		_element: null,
		_thread: null,
		onload: null,
		id: null,
		token: null,
		type: null,

		_getImageURL: function()
		{
			return(this._element.style.backgroundImage || this._element.getAttribute(Thumbnail.ATTRIBUTE_URL));
		},

		_poll: function()
		{
			var url;

			url = this._getImageURL();
			if(!this._element.classList.contains(Thumbnail.CLASS_LOADING) && url)
			{
				clearInterval(this._thread);
				this._parse(url);
			}

			return;
		},

		_parse: function(url)
		{
			var index;
			var item;

			if(url.endsWith(Thumbnail.SUFFIX_CSS))
				url = url.substr(0, url.length - Thumbnail.SUFFIX_CSS.length);
			if(url.indexOf(Thumbnail.SEPARATOR_PARAMETER_LIST) !== -1)
			{
				url = url.substr(url.indexOf(Thumbnail.SEPARATOR_PARAMETER_LIST) + Thumbnail.SEPARATOR_PARAMETER_LIST.length).split(Thumbnail.SEPARATOR_PARAMETER);
				index = url.length;
				while(index--)
				{
					item = url[index].split(Thumbnail.SEPARATOR_VALUE);
					this[Thumbnail.PARAMETER[item[0]] || Thumbnail.PARAMETER_DEFAULT] = item[1];
				}
			}
			else
				Problem.report(Problem.MESSAGE_UNKNOWN_ITEM_FORMAT);
			if(this.onload)
				this.onload(this);

			return;
		},

		load: function()
		{
			var url;

			url = this._getImageURL();
			if(!url)
				this._thread = setInterval(this._poll.bind(this), Thumbnail.RATE_POLL);
			else
				this._parse(url);

			return;
		}
	};

	Thumbnail.PARAMETER =
	{
		id: "id",
		SynoToken: "token",
		type: "type"
	};

	Thumbnail.TYPE =
	{
		tvshow_episode:
		{
			api: "SYNO.VideoStation2.TVShowEpisode",
			infoContainer: "episode",
			preferredTitle: "tagline",
			episodic: true
		},
		movie:
		{
			api: "SYNO.VideoStation2.Movie",
			infoContainer: "movie"
		},
		home_video:
		{
			api: "SYNO.VideoStation2.HomeVideo",
			infoContainer: "video"
		}
	};

	Thumbnail.SEPARATOR_PARAMETER_LIST  = "?";
	Thumbnail.SEPARATOR_PARAMETER       = "&";
	Thumbnail.SEPARATOR_VALUE           = "=";

	Thumbnail.SUFFIX_CSS                = "\")";

	Thumbnail.PARAMETER_DEFAULT         = "last";

	Thumbnail.ATTRIBUTE_URL             = "url";

	Thumbnail.CLASS_LOADING             = "loading";

	Thumbnail.RATE_POLL                 = 50;


	(DSRequest = function(token)
	{
		this._request = new XMLHttpRequest();
		this._request.onreadystatechange = this._handleStateChange.bind(this);
		this._request.open(DSRequest.TYPE_POST, location.origin + DSRequest.URL_ENTRY_POINT);
		this._request.setRequestHeader(DSRequest.HEADER_TOKEN, token);
		this._parameter = {};

		return;
	}).prototype =
	{
		_request: null,
		_parameter: null,
		onsuccess: null,
		response: null,

		_handleStateChange: function()
		{
			var extra;
			var index;

			if(this._request.readyState === XMLHttpRequest.DONE)
			{
				if(this._request.status === DSRequest.STATUS_OK)
				{
					this.response = JSON.parse(this._request.responseText);
					if(this.response.success)
					{
						if(this.onsuccess)
							this.onsuccess(this);
					}
					else
					{
						extra = this.response.error.errors;
						for(index in extra)
						{
							extra[Problem.PREFIX_EXTRA_SYNOLOGY + index] = extra[index];
							delete extra[index];
						}
						extra[Problem.EXTRA_ERROR_CODE] = this.response.error.code;
						Problem.report(Problem.MESSAGE_INVALID_REQUEST, extra);
					}
				}
				else
				{
					extra = {};
					extra[Problem.EXTRA_STATUS_CODE] = this._request.status;
					Problem.report(Problem.MESSAGE_NO_CONTACT, extra);
				}
			}

			return;
		},

		setParameter: function(name, value)
		{
			this._parameter[name] = value;

			return;
		},

		send: function()
		{
			var index;
			var buffer;

			buffer = [];
			for(index in this._parameter)
				buffer.push(encodeURIComponent(index) + DSRequest.SEPARATOR_VALUE + encodeURIComponent(this._parameter[index]));
			this._request.send(buffer.join(DSRequest.SEPARATOR_PARAMETER));

			return;
		}
	};

	DSRequest.HEADER_TOKEN          = "X-SYNO-TOKEN";

	DSRequest.URL_ENTRY_POINT       = "/webapi/entry.cgi";

	DSRequest.TYPE_POST             = "POST";

	DSRequest.SEPARATOR_VALUE       = "=";
	DSRequest.SEPARATOR_PARAMETER   = "&";

	DSRequest.PARAMETER_ID          = "id";
	DSRequest.PARAMETER_ADDITIONAL  = "additional";
	DSRequest.PARAMETER_API         = "api";
	DSRequest.PARAMETER_METHOD      = "method";
	DSRequest.PARAMETER_VERSION     = "version";

	DSRequest.METHOD_GET_INFO       = "getinfo";

	DSRequest.ADDITION_FILE         = "file";

	DSRequest.STATUS_OK             = 200;

	DSRequest.VERSION_API           = "1";


	(Playlist = function()
	{
		this.list = [];

		return;
	}).prototype =
	{
		list: null,

		add: function(filename, title)
		{
			this.list.push({filename: filename, title: title});

			return;
		},

		addVideoEntry: function(entry, type)
		{
			var index;
			var list;
			var listLength;

			list = entry.additional.file.concat();
			list.sort(Playlist._compareSharepath);
			listLength = list.length;
			if(listLength > 1)
				for(index = 0; index < listLength; index++)
					this.add(Playlist._getVideoEntryFilename(list[index]), Playlist._getVideoEntryTitle(entry, type) + Playlist.PREFIX_TITLE_PART + (index + 1) + Playlist.SEPARATOR_TITLE_PART + listLength + Playlist.SUFFIX_TITLE_PART);
			else
				this.add(Playlist._getVideoEntryFilename(list[0]), Playlist._getVideoEntryTitle(entry, type));

			return;
		},

		addVideoEntryList: function(list, type)
		{
			var index;
			var listLength;

			listLength = list.length;
			for(index = 0; index < listLength; index++)
				this.addVideoEntry(list[index], type);

			return;
		},

		getPLSText: function()
		{
			var result;
			var listLength;
			var index;

			listLength = this.list.length;
			result = [Playlist.HEADER_PLS, Playlist._getPLSRecord(Playlist.FIELD_PLS_ENTRY_COUNT, listLength)];
			for(index = 0; index < listLength; index++)
			{
				result.push(Playlist._getPLSRecord(Playlist.PREIFX_PLS_FIELD_TITLE + (index + 1), this.list[index].title));
				result.push(Playlist._getPLSRecord(Playlist.PREIFX_PLS_FIELD_FILE + (index + 1), this.list[index].filename));
			}

			return(result.join(Playlist.SEPARATOR_PLS_RECORD) + Playlist.SEPARATOR_PLS_RECORD);
		}
	};

	Playlist._compareSharepath = function(alpha, beta)
	{
		alpha = alpha.sharepath.toUpperCase();
		beta = beta.sharepath.toUpperCase();

		return(alpha < beta ? -1 : (alpha > beta ? 1 : 0));
	};

	Playlist._getPLSRecord = function(name, value)
	{
		return(name + Playlist.SEPARATOR_PLS_VALUE + value);
	};

	Playlist._getVideoEntryTitle = function(entry, type)
	{
		var title;

		if(type.preferredTitle && entry[type.preferredTitle])
			title = entry[type.preferredTitle];
		else
			if(type.episodic)
				title = Playlist.PREFIX_TITLE_EPISODE + entry.episode;
			else
				title = entry.title;

		return(title);
	};

	Playlist._getVideoEntryFilename = Platform.LINUX
		?
			function(file)
			{
				return(Playlist.PREFIX_PATH_LINUX + location.hostname + file.sharepath);
			}
		:
			function(file)
			{
				return(Playlist.PREFIX_PATH_WINDOWS + (location.hostname + file.sharepath).replace(Playlist.PATTERN_PATH_SEPARATOR, Playlist.SEPARATOR_PATH));
			};

	Playlist.HEADER_PLS              = "[playlist]";

	Playlist.FIELD_PLS_ENTRY_COUNT   = "NumberOfEntries";

	Playlist.PREFIX_TITLE_PART       = " (";
	Playlist.PREFIX_TITLE_EPISODE    = "Episode ";
	Playlist.PREFIX_PATH_WINDOWS     = "\\\\";
	Playlist.PREFIX_PATH_LINUX       = "smb://";
	Playlist.PREIFX_PLS_FIELD_TITLE  = "Title";
	Playlist.PREIFX_PLS_FIELD_FILE   = "File";

	Playlist.SEPARATOR_TITLE_PART    = " of ";
	Playlist.SEPARATOR_PATH          = "\\";
	Playlist.SEPARATOR_PLS_RECORD    = "\n";
	Playlist.SEPARATOR_PLS_VALUE     = "=";

	Playlist.SUFFIX_TITLE_PART       = ")";

	Playlist.PATTERN_PATH_SEPARATOR  = new RegExp("/", "g");


	FileServer =
	{
		FILENAME_DEFAULT:    {},

		ELEMENT_ANCHOR:      "a",
		ELEMENT_IFRAME:      "iframe",

		ATTRIBUTE_DOWNLOAD:  "download",
		ATTRIBUTE_HREF:      "href",
		ATTRIBUTE_SRC:       "src",

		STYLE_VALUE_NONE:    "none",

		DELAY_SAFE_REMOVAL:  1000,

		PROTOCOL_DATA:       "data:",

		SEPARATOR_MIME:      ";",
		SEPARATOR_PRAGMA:    ",",

		PRAGMA_UTF8:         "charset=utf-8",
		PRAGMA_BASE64:       "base64",

		CONTENT_COMPANION:   "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",

		MIME_PLAYLIST:       "application/videolan",
		MIME_EXECUTABLE:     "application/octet-stream",

		FILENAME_COMPANION:  "vlc-full.exe",

		serve: function(filename, content, pragma, mime)
		{
			var element;
			var url;

			if(window.chrome || filename)
			{
				element = document.createElement(FileServer.ELEMENT_ANCHOR);
				element.style.display = FileServer.STYLE_VALUE_NONE;
				element.setAttribute(FileServer.ATTRIBUTE_HREF, FileServer._getDataURL(content, pragma, mime));
				element.setAttribute(FileServer.ATTRIBUTE_DOWNLOAD, filename || FileServer.FILENAME_DEFAULT[mime]);
				document.body.appendChild(element);
				element.click();
				document.body.removeChild(element);
			}
			else
			{
				filename = FileServer.FILENAME_DEFAULT[mime];
				element = document.createElement(FileServer.ELEMENT_IFRAME);
				element.style.display = FileServer.STYLE_VALUE_NONE;
				document.body.appendChild(element);
				if(filename && window.File && window.URL)
				{
					url = URL.createObjectURL(new File([content], filename, {type: mime}));
					element.setAttribute(FileServer.ATTRIBUTE_SRC, url);
				}
				else
					element.setAttribute(FileServer.ATTRIBUTE_SRC, FileServer._getDataURL(content, pragma, mime));
				setTimeout(this._cleanUpDownload.bind(this, element, url), FileServer.DELAY_SAFE_REMOVAL);
			}

			return;
		},

		serveText: function(filename, text, mime)
		{
			this.serve(filename, text, FileServer.PRAGMA_UTF8, mime);

			return;
		},

		serveCompanion: function()
		{
			this.serve(FileServer.FILENAME_COMPANION, FileServer.CONTENT_COMPANION, FileServer.PRAGMA_BASE64, FileServer.MIME_EXECUTABLE);

			return;
		}
	};

	FileServer._cleanUpDownload = function(element, url)
	{
		document.body.removeChild(element);
		if(url)
			URL.revokeObjectURL(url);

		return;
	};

	FileServer._getDataURL = function(content, pragma, mime)
	{
		return(FileServer.PROTOCOL_DATA + mime + FileServer.SEPARATOR_MIME + pragma + FileServer.SEPARATOR_PRAGMA + (pragma === FileServer.PRAGMA_BASE64 ? content : encodeURIComponent(content)));
	};

	FileServer.FILENAME_DEFAULT[FileServer.MIME_PLAYLIST] = "playlist.vlc";


	VLCStation =
	{
		start: function()
		{
			document.body.addEventListener(VLCStation.EVENT_CLICK, this, true);
			if(typeof(GM_registerMenuCommand) !== VLCStation.TYPE_UNDEFINED)
				GM_registerMenuCommand(VLCStation.MENU_ITEM_DOWNLOAD_COMPANION, FileServer.serveCompanion.bind(FileServer), VLCStation.MENU_ACCESS_DOWNLOAD_COMPANION);

			return;
		},

		handleEvent: function(event)
		{
			var button;

			switch(event.type)
			{
				case VLCStation.EVENT_CLICK:
					button = event.target;
					if(!this.play(event, button))
					{
						button = button.parentNode;
						if(button)
						{
							button = button.parentNode;
							if(button)
								this.play(event, button);
						}
					}
					break;
			}

			return;
		},

		play: function(event, button)
		{
			var source;
			var valid;

			valid = button.classList.contains(VLCStation.CLASS_PLAY_BUTTON);
			if(valid)
			{
				source = new Thumbnail(button.parentNode);
				source.onload = this.requestPlaylist.bind(this);
				source.load();
				event.stopPropagation();
			}

			return(valid);
		},

		requestPlaylist: function(thumbnail)
		{
			var playlist;
			var request;
			var type;

			type = Thumbnail.TYPE[thumbnail.type];
			if(type)
			{
				request = new DSRequest(thumbnail.token);
				request.onsuccess = function(request)
				{
					var element;
					var extra;
					var field;
					var index;
					var pathLength;
					var response;
					var test;

					response = request.response;
					field = type.infoContainer;
					test = response;
					pathLength = VLCStation.PATH_TEST_PLAYLIST.length;
					for(index = 0; index < pathLength; index++)
					{
						element = VLCStation.PATH_TEST_PLAYLIST[index];
						if(element === null)
							element = field;
						test = test[element];
						if(!test)
						{
							extra = {};
							extra[Problem.EXTRA_FIELD] = field;
							extra[Problem.EXTRA_PATH_ELEMENT] = VLCStation.PATH_TEST_PLAYLIST[index];
							extra[Problem.EXTRA_INDEX] = index;
							Problem.report(Problem.MESSAGE_UNEXPECTED_RESPONSE_FORMAT, extra);
							break;
						}
					}
					if(index === pathLength)
					{
						playlist = new Playlist();
						playlist.addVideoEntryList(response.data[field], type);
						FileServer.serveText(null, playlist.getPLSText(), FileServer.MIME_PLAYLIST);
					}

					return;
				};
				request.setParameter(DSRequest.PARAMETER_ID, JSON.stringify([+thumbnail.id]));
				request.setParameter(DSRequest.PARAMETER_ADDITIONAL, JSON.stringify([DSRequest.ADDITION_FILE]));
				request.setParameter(DSRequest.PARAMETER_API, type.api);
				request.setParameter(DSRequest.PARAMETER_METHOD, DSRequest.METHOD_GET_INFO);
				request.setParameter(DSRequest.PARAMETER_VERSION, DSRequest.VERSION_API);
				request.send();
			}
			else
			{
				extra = {};
				extra[Problem.EXTRA_TYPE] = thumbnail.type;
				Problem.report(Problem.MESSAGE_UNKNOWN_THUMBNAIL_TYPE, extra);
			}

			return;
		}
	};

	VLCStation.PATH_TEST_PLAYLIST              = ["data", null, 0, "additional", "file", 0];

	VLCStation.MENU_ACCESS_DOWNLOAD_COMPANION  = "D";
	VLCStation.MENU_ITEM_DOWNLOAD_COMPANION    = "Download VLC Full Screen Launcher (Windows)";

	VLCStation.CLASS_PLAY_BUTTON               = "play";

	VLCStation.EVENT_CLICK                     = "click";

	VLCStation.TYPE_UNDEFINED                  = "undefined";


	VLCStation.start();

	return;
})();
