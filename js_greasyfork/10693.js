// ==UserScript==
// @name        Nyaa.si Batch downloader
// @namespace   Autodownload
// @author      Victorique
// @description Batch download torrents from nyaa.si
// @include     *://nyaa.si/user/*?q=*
// @include     *://nyaa.si/user/*?f=*&c=*&q=*
// @version     7.1.7
// @icon        https://i.imgur.com/nx5ejHb.png
// @license     MIT
// @run-at      document-idle
// @grant       none
// @require     https://greasyfork.org/scripts/19117-jsutils/code/JsUtils.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/10693/Nyaasi%20Batch%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/10693/Nyaasi%20Batch%20downloader.meta.js
// ==/UserScript==
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AbstractEps = function () {
    function AbstractEps() {
        _classCallCheck(this, AbstractEps);
    }

    _createClass(AbstractEps, null, [{
        key: 'abstractGetEps',
        value: function abstractGetEps(skipSeedLimit) {
            var minSeeds = Number.parseInt(Localstore.getMinSeedsFromStore());
            if (minSeeds > -1 && skipSeedLimit === false) {
                var arrayOfEps = [];
                for (var i = 0, len = AbstractEps.eps.length; i < len; i++) {
                    var currentEp = AbstractEps.eps[i];
                    if (currentEp.seeds < minSeeds) {
                        continue;
                    }
                    arrayOfEps.push(currentEp);
                }
                return arrayOfEps;
            } else {
                return AbstractEps.eps;
            }
        }
    }, {
        key: 'addEp',
        value: function addEp(ep) {
            if (Anime.isValidRes(ep.res) === false) {
                throw new TypeError('The Episode supplied does not have a valid resolution');
            }
            for (var i = 0, len = AbstractEps.eps.length; i < len; i++) {
                var epi = AbstractEps.eps[i];
                if (epi.equals(ep)) {
                    console.warn('The episode supplied already exsists, this episode has been ignored');
                    return;
                }
            }
            AbstractEps.eps.push(ep);
        }
    }, {
        key: 'removeEpisodeFromAnime',
        value: function removeEpisodeFromAnime(obj) {
            var arr = AbstractEps.eps;
            var i = arr.length;
            while (i--) {
                if (arr[i] === obj) {
                    arr.splice(i, 1);
                }
            }
        }
    }]);

    return AbstractEps;
}();

AbstractEps.eps = [];
var Anime = function (_AbstractEps) {
    _inherits(Anime, _AbstractEps);

    function Anime() {
        _classCallCheck(this, Anime);

        return _possibleConstructorReturn(this, (Anime.__proto__ || Object.getPrototypeOf(Anime)).call(this));
    }

    _createClass(Anime, null, [{
        key: 'addSupportedRes',
        value: function addSupportedRes(res) {
            Anime._supportedRes.push(res);
        }
    }, {
        key: 'addAvailableResolutions',
        value: function addAvailableResolutions(res, fullRes) {
            if (Anime._resExists(res)) {
                return;
            }
            Anime._availableRes.push({ 'res': res, 'fullRes': fullRes });
        }
    }, {
        key: 'removeAvailableResolutions',
        value: function removeAvailableResolutions(resToRemove) {
            for (var i = 0; i < Anime._availableRes.length; i++) {
                var currentRes = Anime._availableRes[i];
                if (currentRes.res === resToRemove || currentRes.fullRes === resToRemove) {
                    Anime._availableRes.splice(i, 1);
                }
            }
        }
    }, {
        key: '_resExists',
        value: function _resExists(_res) {
            for (var i = 0; i < Anime._availableRes.length; i++) {
                var currentRes = Anime._availableRes[i];
                if (currentRes.res === _res || currentRes.fullRes === _res) {
                    return true;
                }
            }
            return false;
        }
    }, {
        key: 'getTdFromTable',
        value: function getTdFromTable(table, index) {
            return table.find('td:nth-child(' + index + ')');
        }
    }, {
        key: 'avgSeedsForRes',
        value: function avgSeedsForRes(res, skipSeedLimit) {
            var seedCount = 0;
            var epCount = Anime.getAmountOfEpsFromRes(res, skipSeedLimit);
            if (epCount === 0) {
                return 0;
            }
            var eps = _get(Anime.__proto__ || Object.getPrototypeOf(Anime), 'abstractGetEps', this).call(this, skipSeedLimit);
            for (var i = 0, len = eps.length; i < len; i++) {
                var currentEp = eps[i];
                if (currentEp.res === res) {
                    seedCount += currentEp.seeds;
                }
            }
            return Math.round(seedCount / epCount);
        }
    }, {
        key: 'avgPeersForRes',
        value: function avgPeersForRes(res, skipSeedLimit) {
            var leechCount = 0;
            var epCount = Anime.getAmountOfEpsFromRes(res, skipSeedLimit);
            if (epCount === 0) {
                return 0;
            }
            var eps = _get(Anime.__proto__ || Object.getPrototypeOf(Anime), 'abstractGetEps', this).call(this, skipSeedLimit);
            for (var i = 0, len = eps.length; i < len; i++) {
                var currentEp = eps[i];
                if (currentEp.res === res) {
                    leechCount += currentEp.leechers;
                }
            }
            return Math.round(leechCount / epCount);
        }
    }, {
        key: 'getTotalSizeForRes',
        value: function getTotalSizeForRes(res, skipSeedLimit) {
            var decimals = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3;

            var eps = Anime.getEpsForRes(res, skipSeedLimit);
            return Utils.getHumanReadableSize(eps, decimals);
        }
    }, {
        key: 'getAmountOfEpsFromRes',
        value: function getAmountOfEpsFromRes(res, skipSeedLimit) {
            return Anime.getEpsForRes(res, skipSeedLimit).length;
        }
    }, {
        key: 'getEpsForRes',
        value: function getEpsForRes(res, skipSeedLimit) {
            var arrayOfEps = [];
            var eps = _get(Anime.__proto__ || Object.getPrototypeOf(Anime), 'abstractGetEps', this).call(this, skipSeedLimit);
            for (var i = 0, len = eps.length; i < len; i++) {
                var currentEp = eps[i];
                if (currentEp.res === res) {
                    arrayOfEps.push(currentEp);
                }
            }
            return arrayOfEps;
        }
    }, {
        key: 'isValidRes',
        value: function isValidRes(res) {
            return Anime._resExists(res);
        }
    }, {
        key: 'addAllEps',
        value: function addAllEps(eps) {
            for (var i = 0; i < eps.length; i++) {
                _get(Anime.__proto__ || Object.getPrototypeOf(Anime), 'addEp', this).call(this, eps[i]);
            }
        }
    }, {
        key: 'getUidFromJqueryObject',
        value: function getUidFromJqueryObject(obj) {
            if (obj.is('tr')) {
                return function () {
                    var currectTd = Anime.getNameTr(obj);
                    var tableRows = currectTd.find('a:not(a.comments)');
                    if (tableRows.length > 1) {
                        throw 'Object must be unique';
                    }
                    return Anime._getUidFromAnchor(tableRows.get(0));
                }();
            }
            return null;
        }
    }, {
        key: 'getNameTr',
        value: function getNameTr(obj) {
            return obj.find('td:nth-child(2)');
        }
    }, {
        key: 'getEpisodeFromAnchor',
        value: function getEpisodeFromAnchor(anchor) {
            var link = function () {
                if (Utils.isjQueryObject(anchor)) {
                    return anchor.get(0);
                }
                return anchor;
            }();
            var uid = Anime._getUidFromAnchor(link);
            return Anime.getEpisodeFromUid(uid, true);
        }
    }, {
        key: 'getEpisodeFromUid',
        value: function getEpisodeFromUid(uid, skipSeedLimit) {
            var eps = _get(Anime.__proto__ || Object.getPrototypeOf(Anime), 'abstractGetEps', this).call(this, skipSeedLimit);
            for (var i = 0, len = eps.length; i < len; i++) {
                var currentEp = eps[i];
                if (currentEp.uid === uid) {
                    return currentEp;
                }
            }
            return null;
        }
    }, {
        key: '_getUidFromAnchor',
        value: function _getUidFromAnchor(anchor) {
            if (typeof anchor === 'string') {
                if (anchor.indexOf(".torrent") > -1) {
                    return anchor.replace(".torrent", "").split("/").pop();
                }
                return anchor.split("/").pop();
            }
            return anchor.href.split("/").pop();
        }
    }, {
        key: 'getEpisodesFromResidence',
        value: function getEpisodesFromResidence(resides, exclude, skipSeedLimit) {
            var arrayOfEps = [];
            var eps = _get(Anime.__proto__ || Object.getPrototypeOf(Anime), 'abstractGetEps', this).call(this, skipSeedLimit);
            for (var i = 0, len = eps.length; i < len; i++) {
                var currentEp = eps[i];
                if (exclude === true) {
                    if (currentEp.resides !== resides) {
                        arrayOfEps.push(currentEp);
                    }
                } else {
                    if (currentEp.resides === resides) {
                        arrayOfEps.push(currentEp);
                    }
                }
            }
            return arrayOfEps;
        }
    }, {
        key: 'getPageUrls',
        value: function getPageUrls() {
            function range(start, end) {
                return Array(end - start + 1).fill().map(function (_, idx) {
                    return start + idx;
                });
            }
            var pages = $(".center > ul.pagination a");
            if (pages.length === 0) {
                return [];
            }
            var firstPage = Utils.getElementFromJqueryArray(pages, 1);
            var lastPage = Utils.getElementFromJqueryArray(pages, pages.length - 2);
            var firstPageNumber = Number.parseInt(firstPage.text());
            var lastPageNumber = Number.parseInt(lastPage.text());
            var rangeBetween = range(firstPageNumber, lastPageNumber);
            var baseUrl = window.location.href;
            var urls = [];
            var currentPage = QueryString.p === undefined ? 1 : QueryString.p;
            for (var i = 0; i < rangeBetween.length; i++) {
                var num = String(rangeBetween[i]);
                if (num == currentPage) {
                    continue;
                }
                var newUrl = Utils.addParameter(baseUrl, "p", num.toString());
                urls.push(newUrl);
            }
            return urls;
        }
    }, {
        key: 'removeEpisodesFromUid',
        value: function removeEpisodesFromUid(uid) {
            var episode = Anime.getEpisodeFromUid(uid, true);
            _get(Anime.__proto__ || Object.getPrototypeOf(Anime), 'removeEpisodeFromAnime', this).call(this, episode);
        }
    }, {
        key: 'removeEpisodesFromResidence',
        value: function removeEpisodesFromResidence(resides, exclude) {
            var eps = Anime.getEpisodesFromResidence(resides, exclude, true);
            for (var i = 0, len = eps.length; i < len; i++) {
                var currentEp = eps[i];
                this.removeEpisodeFromAnime(currentEp);
            }
        }
    }, {
        key: 'getAmountOfEps',
        value: function getAmountOfEps() {
            return _get(Anime.__proto__ || Object.getPrototypeOf(Anime), 'abstractGetEps', this).call(this, true).length;
        }
    }, {
        key: 'getEpisodeFromUrl',
        value: function getEpisodeFromUrl(url) {
            var eps = _get(Anime.__proto__ || Object.getPrototypeOf(Anime), 'abstractGetEps', this).call(this, true);
            for (var i = 0, len = eps.length; i < len; i++) {
                var ep = eps[i];
                if (ep.downloadLink === url) {
                    return ep;
                }
            }
            return null;
        }
    }, {
        key: 'currentAnime',
        get: function get() {
            return Anime._currentAnime;
        },
        set: function set(value) {
            Anime._currentAnime = value;
        }
    }, {
        key: 'currentSubber',
        get: function get() {
            return Anime._currentSubber;
        },
        set: function set(value) {
            Anime._currentSubber = value;
        }
    }, {
        key: 'supportedRes',
        get: function get() {
            return Anime._supportedRes;
        }
    }, {
        key: 'availableRes',
        get: function get() {
            return Anime._availableRes;
        }
    }]);

    return Anime;
}(AbstractEps);

Anime._availableRes = [];
Anime._supportedRes = [{ "res": 1080, "fullRes": "1920x1080" }, {
    "res": 720,
    "fullRes": "1280x720"
}, { "res": 480, "fullRes": "640x480" }, { "res": 360, "fullRes": "640x360" }];

var Episode = function () {
    function Episode(res, downloadLink, seeds, leechers, uid, resides, title, size) {
        _classCallCheck(this, Episode);

        this._res = res;
        this._downloadLink = downloadLink;
        this._seeds = seeds;
        this._leechers = leechers;
        this._uid = uid;
        this._resides = resides;
        this._title = title;
        this._size = size;
    }

    _createClass(Episode, [{
        key: 'equals',
        value: function equals(ep) {
            return this.uid === ep.uid;
        }
    }, {
        key: 'res',
        get: function get() {
            return this._res;
        }
    }, {
        key: 'downloadLink',
        get: function get() {
            return this._downloadLink;
        }
    }, {
        key: 'seeds',
        get: function get() {
            return this._seeds;
        }
    }, {
        key: 'leechers',
        get: function get() {
            return this._leechers;
        }
    }, {
        key: 'uid',
        get: function get() {
            return this._uid;
        }
    }, {
        key: 'resides',
        get: function get() {
            return this._resides;
        }
    }, {
        key: 'title',
        get: function get() {
            return this._title;
        }
    }, {
        key: 'size',
        get: function get() {
            return this._size;
        }
    }]);

    return Episode;
}();

var QueryString = function () {
    if (typeof window == "undefined") {
        return {};
    }
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = pair[1];
        } else if (typeof query_string[pair[0]] === "string") {
            query_string[pair[0]] = [query_string[pair[0]], pair[1]];
        } else {
            query_string[pair[0]].push(pair[1]);
        }
    }
    return query_string;
}();

HTMLElement.prototype.click = function () {
    var evt = this.ownerDocument.createEvent('MouseEvents');
    evt.initMouseEvent('click', true, true, this.ownerDocument.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
    this.dispatchEvent(evt);
};

var Main = function () {
    function Main() {
        _classCallCheck(this, Main);
    }

    _createClass(Main, null, [{
        key: 'main',
        value: function main() {
            Main.setAnimeObj();
            Main.buildUi();
            Main.bindListeners();
        }
    }, {
        key: 'setAnimeObj',
        value: function setAnimeObj() {
            if (QueryString.q !== '') {
                Anime.currentAnime = decodeURIComponent(QueryString.q).split('+').join(' ');
            } else {
                Anime.currentAnime = "unknown";
            }
            var paths = window.location.pathname.split("/");
            Anime.currentSubber = paths[2];
            var instance = new DataParser(Utils.getTable());
            var eps = instance.parseTable(Utils.getCurrentPageOffset());
            Anime.addAllEps(eps);
        }
    }, {
        key: 'buildUi',
        value: function buildUi() {
            makeStyles();
            buildPanel();
            afterBuild();
            function makeStyles() {
                var styles = '';
                styles += '.collapsem{cursor: pointer; position: absolute; right: 4px; top: 2px;}';
                styles += '.panel-success > .panel-heading {position: relative;}';
                styles += '.avgSeeds{floar:left; padding-right:10px; color:#3c763d;}';
                styles += '.checkboxes{left:1px; margin:0; padding:0; position: relative; top: 1px; z-index: 1;}';
                styles += '#topbar{z-index: 2 !important;}';
                styles += 'label[for=\'MinSeeds\']{ display: block; margin-top: 10px;}';
                styles += '.filterLabel{margin-right: 10px;}';
                styles += '.alert {position:relative;}';
                styles += '#alertUser, #parseErrors{margin-top: 15px;}';
                styles += ".downloadButton {position:absolute; bottom:5px;}";
                styles += '#alertButton{right:78px;}';
                styles += '#alertButtonCancel{right: 5px;}';
                styles += '#downloadZip{right: 140px;}';
                styles += '#errorClose{position:absolute; bottom:5px; right: 11px;}';
                styles += '#animeSelection{width: 100%;}';
                styles += '#clearResOptions{margin-left: 10px; margin-right: 10px ;cursor: pointer;}';
                styles += '#selectAllFromControl{cursor: pointer;}';
                styles += '#downloadCustomButton{float:right;}';
                styles += '#findEp{float: right; position: relative; bottom: 20px; width: 180px;}';
                styles += "#loadingContainer{margin-top: 15px; margin-bottom: 45px;}";
                Utils.injectCss(styles);
            }
            function buildPanel() {
                var html = '';
                html += '<div class="panel panel-success">';
                html += '<div class="panel-heading">';
                html += '<h3 id="panel-title" class="panel-title"></h3>';
                html += '<i class="glyphicon glyphicon-minus collapsem" id="collapseToggle" title="Hide"></i>';
                html += '</div>';
                html += '<div class="panel-body" id="pannelContent"></div>';
                html += '</div>';
                $('.container > .row > h3').after(html);
                buildPanelContent();
                function buildPanelContent() {
                    var html = '';
                    html += '<div>';
                    $('#panel-title').html('<span> Download "' + Anime.currentAnime + ' (' + Anime.currentSubber + ')"</span>');
                    if (Anime.getAmountOfEps() === 0) {
                        html += '<span> No translated anime found or error occured</span>';
                        html += '</div>';
                        $('#pannelContent').html(html);
                        return;
                    }
                    html += '<span>Pick a resolution: </span>';
                    html += '<span id=\'selectDownload\'>';
                    html += UI.buildDropdownSelections();
                    html += '</span>';
                    html += '<button class="btn btn-default" type="button" data-type=\'downloadAll\' id="downloadAll">Download all</button>';
                    html += '<button class="btn btn-default" type=\'button\' id=\'downloadCustomButton\' data-type=\'downloadSelected\' >download your selected items</button>';
                    html += '</div>';
                    html += '<div id=\'options\'>';
                    html += '<div class="checkbox">';
                    html += "<label>";
                    html += '<input type=\'checkbox\' id=\'crossPage\' /> ';
                    html += "include Cross pages";
                    html += "</label>";
                    html += "</div>";
                    html += '<div class="input-group">';
                    html += '<input placeholder="Minimum seeders" class="form-control" type=\'number\' min=\'0\' id=\'MinSeeds\' title=\'Any episode that is below this limit will be excluded from the download.\'/>';
                    html += '<span class="input-group-btn">';
                    html += '<button class="btn btn-default" type=\'button\' id=\'SaveMinSeeds\'>Save</button>';
                    html += "</span>";
                    html += "</div>";
                    html += '<div id=\'tableInfo\'>';
                    html += UI.buildTable();
                    html += '</div>';
                    html += '<div id=\'alertUser\' class=\'hide\'></div>';
                    html += '<div class=\'selectAnime\' id=\'selectAnime\'>';
                    html += UI.buildSelect();
                    html += '</div>';
                    html += '<input class="form-control" type=\'text\' id=\'findEp\' placeholder=\'Search Select (or use regex) \' />';
                    html += '<button class="btn btn-default" disabled id=\'acceptSelect\' data-type=\'downloadSelects\'>Select for download</button>';
                    html += '<div id=\'parseErrors\' class =\'hide\'></div>';
                    $('#pannelContent').html(html);
                }
            }
            function afterBuild() {
                makeCheckBoxes();
                sortLists();
                function makeCheckBoxes() {
                    $('.tlistdownload > a').after('<input class=\'checkboxes\' type=\'checkbox\'/>');
                }
                function sortLists() {
                    Utils.sortAllControls();
                }
            }
        }
    }, {
        key: 'bindListeners',
        value: function bindListeners() {
            Utils.reBindSelectFilters();
            $('#downloadAll').on('click', function (e) {
                Utils.doDownloads(e);
            });
            $('.checkboxes').on('click', function (e) {
                if (Utils.checkBoxValid($('.checkboxes'))) {
                    Utils.enableButton($('#downloadCustomButton'));
                } else {
                    Utils.disableButton($('#downloadCustomButton'));
                }
            });
            $('#crossPage').on('click', function (e) {
                preformParsing(Anime.getPageUrls());
                function preformParsing(urls) {
                    if (urls.length === 0) {
                        return;
                    }
                    if (Utils.checkBoxValid($('#crossPage'))) {
                        (function () {
                            $('#tableInfo').html('<p>Please wait while we parse each page...</p>');
                            $('#selectAnime').html('');
                            $('#acceptSelect').hide();
                            $('#crossPage, #downloadAll').prop('disabled', true);
                            $('#parseErrors').slideUp('fast', function () {
                                $(this).html('');
                            });
                            var AjaxInfo = {
                                error: {
                                    pageAtError: null
                                },
                                currentPage: null
                            };
                            var ajaxPromiseMap = new Map();
                            var arrayd = [];
                            for (var i = 0; i < urls.length; i++) {
                                var d = $.Deferred();
                                ajaxPromiseMap.set(urls[i], d);
                                arrayd.push(d);
                            }
                            $.when.apply($, arrayd).done(function () {
                                if (AjaxInfo.error.pageAtError !== null) {
                                    UI.showAjaxErrorAlert(AjaxInfo);
                                }
                                $('#tableInfo').html(UI.buildTable());
                                $('#downloadRes').html(UI.buildDropdownSelections());
                                $('#selectAnime').html(UI.buildSelect());
                                Utils.sortAllControls();
                                $('#acceptSelect').show();
                                Utils.reBindSelectFilters();
                                $('#crossPage, #downloadAll').prop('disabled', false);
                            });
                            var timeOut = 0;

                            var _loop = function _loop(cur, deferr) {
                                var currentPage = 0;
                                var queryObjet = Utils.getQueryFromUrl(cur);
                                if (queryObjet.p) {
                                    currentPage = queryObjet.p;
                                } else {
                                    currentPage = 1;
                                }
                                setTimeout(function () {
                                    var ajax = $.ajax(cur);
                                    ajax.done(function (data) {
                                        AjaxInfo.currentPage = currentPage;
                                        var table = $(data).find("table");
                                        var parser = new DataParser(table);
                                        $('#tableInfo').append('<div>Page ' + currentPage + ' Done </div>');
                                        Anime.addAllEps(parser.parseTable(currentPage));
                                    }).fail(function () {
                                        AjaxInfo.error.pageAtError = Number.parseInt(cur.split('=').pop());
                                        $('#tableInfo').append('<div>Page ' + currentPage + ' Done </div>');
                                    }).always(function () {
                                        deferr.resolve();
                                    });
                                }, timeOut);
                                timeOut += 350;
                            };

                            var _iteratorNormalCompletion = true;
                            var _didIteratorError = false;
                            var _iteratorError = undefined;

                            try {
                                for (var _iterator = ajaxPromiseMap[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                    var _ref = _step.value;

                                    var _ref2 = _slicedToArray(_ref, 2);

                                    var cur = _ref2[0];
                                    var deferr = _ref2[1];

                                    _loop(cur, deferr);
                                }
                            } catch (err) {
                                _didIteratorError = true;
                                _iteratorError = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion && _iterator.return) {
                                        _iterator.return();
                                    }
                                } finally {
                                    if (_didIteratorError) {
                                        throw _iteratorError;
                                    }
                                }
                            }
                        })();
                    } else {
                        var tableInfoElm = $('#tableInfo');
                        tableInfoElm.html('<p>Please wait while we re-calculate the Episodes</p>');
                        var _currentPage = Utils.getCurrentPageOffset();
                        Anime.removeEpisodesFromResidence(_currentPage, true);
                        Utils.cleanAvailableResolutions();
                        $('#downloadRes').html(UI.buildDropdownSelections());
                        tableInfoElm.html(UI.buildTable());
                        $('#selectAnime').html(UI.buildSelect());
                        Utils.reBindSelectFilters();
                        Utils.sortAllControls();
                    }
                }
            });
            $('#SaveMinSeeds').on('click', function (e) {
                if (parseInt($('#MinSeeds').val()) < 0) {
                    alert('number cannot be negative');
                    return;
                }
                var value = void 0;
                value = $('#MinSeeds').val() === '' ? parseInt("-1") : parseInt($('#MinSeeds').val());
                Localstore.setMinSeedsFromStore(value);
                if (value === -1) {
                    alert('Minimum seeds have been cleared');
                } else {
                    alert('Minimum seeds now set to: ' + value);
                }
                $('#selectAnime').html(UI.buildSelect());
                Utils.sortAllControls();
                Utils.reBindSelectFilters();
            });
            $('#collapseToggle').on('click', function () {
                $('#pannelContent').stop(true, true).slideToggle('slow', function () {
                    var elm = $('#collapseToggle');
                    if ($(this).is(':hidden')) {
                        elm.removeClass('glyphicon-minus').addClass('glyphicon-plus');
                        elm.attr('title', 'Show');
                    } else {
                        elm.addClass('glyphicon-minus').removeClass('glyphicon-plus');
                        elm.attr('title', 'Hide');
                    }
                });
            });
            $('#acceptSelect').on('click', function (e) {
                Utils.doDownloads(e);
            });
            $('#findEp').on('keyup', function () {
                UI.applySearch($(this).val());
            });
        }
    }]);

    return Main;
}();

var UI = function () {
    function UI() {
        _classCallCheck(this, UI);
    }

    _createClass(UI, null, [{
        key: 'buildTable',
        value: function buildTable() {
            var html = '';
            html += '<table class="table table-bordered table-hover table-striped torrent-list" style=\'width: 100%\' id=\'info\'>';
            html += '<caption>Download infomation</caption>';
            html += '<thead>';
            html += '<tr>';
            html += '<th>resolution</th>';
            html += '<th>Episode count</th>';
            html += '<th>Average seeds</th>';
            html += '<th>Average leechers</th>';
            html += '<th>Total size</th>';
            html += '</tr>';
            html += '</thead>';
            html += '<tbody>';
            var allRes = Anime.availableRes;
            for (var i = 0; i < allRes.length; i++) {
                var currRes = allRes[i];
                var localRes = currRes.res;
                html += '<tr>';
                html += '<td>' + (localRes === -1 ? 'Others' : localRes + 'p') + '</td>';
                html += '<td>' + Anime.getAmountOfEpsFromRes(localRes, true) + '</td>';
                html += '<td>' + Anime.avgSeedsForRes(localRes, true) + '</td>';
                html += '<td>' + Anime.avgPeersForRes(localRes, true) + '</td>';
                html += '<td>' + Anime.getTotalSizeForRes(localRes, true) + ' (aprox)</td>';
                html += '</tr>';
            }
            html += '</tbody>';
            html += '</table>';
            return html;
        }
    }, {
        key: 'stateChangeAcceptSelect',
        value: function stateChangeAcceptSelect(state) {
            $("#acceptSelect").enableButton(state);
        }
    }, {
        key: 'autoEnableAcceptSelect',
        value: function autoEnableAcceptSelect() {
            var selection = $("#animeSelection option:selected");
            UI.stateChangeAcceptSelect(selection.length > 0);
        }
    }, {
        key: 'buildDropdownSelections',
        value: function buildDropdownSelections() {
            var html = '';
            html += '<select class="form-control" style="margin-right:5px;display: inline;width: auto;" id="downloadRes">';
            var allRes = Anime.availableRes;
            for (var i = 0; i < allRes.length; i++) {
                var currRes = allRes[i];
                var localRes = currRes.res;
                html += '<option value=' + localRes + '>' + (localRes === -1 ? 'Others' : localRes + 'p') + '</option>';
            }
            html += '</select>';
            return html;
        }
    }, {
        key: 'builDownloadAlert',
        value: function builDownloadAlert(type) {
            var amountOfAnime = 0;
            var selectedRes = Number.parseInt($('#downloadRes').val());
            var res = null;
            var totalSize = null;
            if (type === 'downloadSelected') {
                amountOfAnime = $('.checkboxes:checked').length;
                res = 'custom';
            } else if (type === 'downloadSelects') {
                amountOfAnime = $('#animeSelection option:selected').length;
                totalSize = Utils.getHumanReadableSize(function () {
                    var localSize = 0;
                    $('#animeSelection option:selected').each(function () {
                        var url = this.dataset.url;
                        localSize += Anime.getEpisodeFromAnchor(url).size;
                    });
                    return localSize;
                }());
                res = 'custom';
            } else {
                amountOfAnime = Anime.getAmountOfEpsFromRes(selectedRes, false);
                res = selectedRes === -1 ? 'Others' : selectedRes + 'p';
                totalSize = Anime.getTotalSizeForRes(parseInt(res), false);
            }
            var seedLimit = Localstore.getMinSeedsFromStore();
            if (seedLimit === "-1") {
                seedLimit = "none";
            }
            var html = '';
            html += '<div class=\'alert alert-success\'>';
            html += '<div><strong>Download: ' + res + '</strong></div> <br />';
            html += '<div><strong>Seed Limit: ' + seedLimit + '</strong></div>';
            if (totalSize !== null) {
                html += '<br /><div><strong>Total size: ' + totalSize + ' (aprox)</strong></div>';
            }
            html += '<p>You are about to download ' + amountOfAnime + ' ep(s)</p>';
            html += '<p>This will cause ' + amountOfAnime + ' download pop-up(s) Are you sure you want to continue?</p>';
            html += '<p>If there are a lot of eps, your browser might stop responding for a while. This is normal. If you are on Google Chrome, it will ask you to allow multiple-downloads</p>';
            html += '<button type="button" class="btn btn-warning downloadButton" id=\'alertButtonCancel\'>Cancel</button>';
            html += '<button type="button" class="btn btn-success downloadButton" id=\'alertButton\'>Okay</button>';
            html += '<button type="button" class="btn btn-success downloadButton" id=\'downloadZip\'>Download as zip</button>';
            html += "<div class='hidden' id='loadingContainer'>";
            html += "<hr />";
            html += "<div class=\"progress\">";
            html += "<div id='progressBarForZip' class=\"progress-bar progress-bar-striped active\" role=\"progressbar\" aria-valuenow=\"45\" aria-valuemin=\"0\" aria-valuemax=\"100\" style='width: 100%;'>Current status: <span id='progressStatus'></span></div>";
            html += "</div>";
            html += "</div>";
            html += '</div>';
            return html;
        }
    }, {
        key: 'showAjaxErrorAlert',
        value: function showAjaxErrorAlert(ajaxInfo) {
            var parseError = $('#parseErrors');
            if (!parseError.is(':hidden')) {
                return null;
            }
            parseError.html('');
            var html = '';
            html += '<div class=\'alert alert-danger\'>';
            html += '<p>There was an error in getting the information from page: \'' + ajaxInfo.error.pageAtError + '\'</p>';
            html += '<button id=\'errorClose\' class="btn btn-primary"> close </button>';
            html += '</div>';
            parseError.show();
            parseError.html(html);
            $('#errorClose').off('click').on('click', function () {
                $('#parseErrors').slideUp('slow', function () {
                    $(this).html('');
                });
            });
        }
    }, {
        key: 'buildSelect',
        value: function buildSelect() {
            var resTOFilter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "none";

            var html = '';
            UI.epsInSelect = [];
            var minSeeds = Number.parseInt(Localstore.getMinSeedsFromStore());
            html += '<div id=\'selectWrapper\'>';
            html += '<div id=\'selectContainer\'>';
            html += '<p>Or you can select episodes here:</p>';
            html += '<p>Seed limit: ' + (minSeeds === -1 ? 'None' : minSeeds) + '</p>';
            html += '<select class="form-control" id=\'animeSelection\' multiple size=\'20\'>';
            var allRes = Anime.availableRes;
            for (var i = 0; i < allRes.length; i++) {
                var currRes = allRes[i];
                var localRes = currRes.res;
                var eps = Anime.getEpsForRes(localRes, false);
                for (var j = 0, len = eps.length; j < len; j++) {
                    var currentEp = eps[j];
                    if (resTOFilter == 'none' || currentEp.res == resTOFilter) {
                        html += '<option data-url=\'' + currentEp.downloadLink + '\'>';
                        html += currentEp.title + ' - Seeders: ' + currentEp.seeds;
                        UI.epsInSelect.push(currentEp);
                        html += '</option>';
                    } else {
                        break;
                    }
                }
            }
            html += '</select>';
            html += '<span>Filter select control: </span>';
            var checked = false;
            for (var _i = 0; _i < allRes.length; _i++) {
                if (resTOFilter == allRes[_i].res) {
                    checked = true;
                }
                html += '<input type=\'radio\' ' + (checked ? 'checked' : '') + ' data-set= \'' + allRes[_i].res + '\' name=\'filterSelect\'/>' + '<label class="filterLabel">' + (allRes[_i].res === -1 ? 'Others' : allRes[_i].res + 'p') + '</label>';
                checked = false;
            }
            html += '<a id=\'clearResOptions\' data-set=\'none\' >clear resolution filter</a>';
            html += '<a id=\'selectAllFromControl\'>Select all</a>';
            html += '</div>';
            html += '</div>';

            $("#acceptSelect").enableButton(false);
            return html;
        }
    }, {
        key: 'applySearch',
        value: function applySearch(textToFilter) {
            var opts = UI.epsInSelect;
            var rxp = new RegExp(textToFilter);
            var optlist = $('#animeSelection').empty();
            for (var i = 0, len = opts.length; i < len; i++) {
                var ep = opts[i];
                if (rxp.test(ep.title)) {
                    optlist.append('<option data-url=\'' + ep.downloadLink + '\'>' + ep.title + ' - Seeders: ' + ep.seeds + '</option>');
                }
            }
            UI.searchApplied = textToFilter;
            Utils.sortSelect(document.getElementById("animeSelection"));
            UI.autoEnableAcceptSelect();
        }
    }, {
        key: 'getAppliedSearch',
        value: function getAppliedSearch() {
            return UI.searchApplied;
        }
    }, {
        key: 'getEpsInSelect',
        value: function getEpsInSelect() {
            return UI.epsInSelect;
        }
    }]);

    return UI;
}();

UI.epsInSelect = [];
UI.searchApplied = '';

var Utils = function () {
    function Utils() {
        _classCallCheck(this, Utils);
    }

    _createClass(Utils, null, [{
        key: 'downloadViaJavaScript',
        value: function downloadViaJavaScript(url, data, callBack) {
            var _type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "POST";

            var fileName = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

            var xhr = new XMLHttpRequest();
            xhr.open(_type, url, true);
            xhr.responseType = "blob";
            xhr.withCredentials = true;
            if (_type == "POST") {
                xhr.setRequestHeader("Content-type", "application/json");
            }
            var hasError = false;
            var mediaType = null;
            xhr.onreadystatechange = function () {
                var error = null;
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (hasError) {
                        if (xhr.response != null && xhr.response.length > 0) {
                            error = xhr.response;
                        } else {
                            error = "internal server error";
                        }
                    }
                    var contentDispositionHeader = xhr.getResponseHeader("Content-Disposition");
                    if (fileName == null && contentDispositionHeader != null && contentDispositionHeader.indexOf("filename") > -1) {
                        fileName = contentDispositionHeader.split("filename").pop();
                        fileName = fileName.replace("=", "");
                        fileName = fileName.trim();
                        fileName = fileName.replace(/"/g, "");
                    }
                    var mediaTypeHeader = xhr.getResponseHeader("Content-Type");
                    if (mediaTypeHeader != null) {
                        mediaType = mediaTypeHeader;
                    } else {
                        mediaType = "application/octet-stream";
                    }
                    var blob = xhr.response;

                    var saveAsFunc = saveAs.bind(this, blob, fileName, true);
                    callBack.call(this, blob, fileName, hasError, error, saveAsFunc);
                } else if (xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
                    if (xhr.status !== 200) {
                        xhr.responseType = "text";
                        hasError = true;
                    }
                }
            };
            if (_type === "POST") {
                xhr.send(JSON.stringify(data));
            } else {
                xhr.send();
            }
        }
    }, {
        key: 'sortSelect',
        value: function sortSelect(selElem) {
            var tmpAry = [];
            for (var i = 0, length = selElem.options.length; i < length; i++) {
                tmpAry[i] = [];
                tmpAry[i][0] = selElem.options[i].text;
                tmpAry[i][1] = selElem.options[i].dataset.url;
            }
            tmpAry.sort(function (a, b) {
                return a[0].toUpperCase().localeCompare(b[0].toUpperCase());
            });
            selElem.innerHTML = "";
            for (var _i2 = 0, len = tmpAry.length; _i2 < len; _i2++) {
                var op = new Option(tmpAry[_i2][0]);
                op.dataset.url = tmpAry[_i2][1];
                selElem.options[_i2] = op;
            }
        }
    }, {
        key: 'injectCss',
        value: function injectCss(css) {
            function _isUrl(url) {
                var matcher = new RegExp(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/);
                return matcher.test(url);
            }
            if (_isUrl(css)) {
                $("<link>").prop({
                    "type": "text/css",
                    "rel": "stylesheet"
                }).attr("href", css).appendTo("head");
            } else {
                $("<style>").prop("type", "text/css").html(css).appendTo("head");
            }
        }
    }, {
        key: 'addParameter',
        value: function addParameter(url, parameterName, parameterValue) {
            var atStart = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

            var replaceDuplicates = true;
            var urlhash = void 0;
            var cl = void 0;
            if (url.indexOf('#') > 0) {
                cl = url.indexOf('#');
                urlhash = url.substring(url.indexOf('#'), url.length);
            } else {
                urlhash = '';
                cl = url.length;
            }
            var sourceUrl = url.substring(0, cl);
            var urlParts = sourceUrl.split("?");
            var newQueryString = "";
            if (urlParts.length > 1) {
                var parameters = urlParts[1].split("&");
                for (var i = 0; i < parameters.length; i++) {
                    var parameterParts = parameters[i].split("=");
                    if (!(replaceDuplicates && parameterParts[0] == parameterName)) {
                        if (newQueryString == "") {
                            newQueryString = "?";
                        } else {
                            newQueryString += "&";
                        }
                        newQueryString += parameterParts[0] + "=" + (parameterParts[1] ? parameterParts[1] : '');
                    }
                }
            }
            if (newQueryString == "") {
                newQueryString = "?";
            }
            if (atStart) {
                newQueryString = '?' + parameterName + "=" + parameterValue + (newQueryString.length > 1 ? '&' + newQueryString.substring(1) : '');
            } else {
                if (newQueryString !== "" && newQueryString != '?') newQueryString += "&";
                newQueryString += parameterName + "=" + (parameterValue ? parameterValue : '');
            }
            return urlParts[0] + newQueryString + urlhash;
        }
    }, {
        key: 'getElementFromJqueryArray',
        value: function getElementFromJqueryArray(elm, index) {
            return elm.filter(function (i) {
                return i === index;
            });
        }
    }, {
        key: 'getTable',
        value: function getTable() {
            return $('table');
        }
    }, {
        key: 'getQueryFromUrl',
        value: function getQueryFromUrl(url) {
            return url.split("&").reduce(function (prev, curr, i, arr) {
                var p = curr.split("=");
                prev[decodeURIComponent(p[0])] = decodeURIComponent(p[1]);
                return prev;
            }, {});
        }
    }, {
        key: 'isjQueryObject',
        value: function isjQueryObject(obj) {
            return obj instanceof jQuery || 'jquery' in Object(obj);
        }
    }, {
        key: 'disableButton',
        value: function disableButton(button) {
            button.prop('disabled', true);
        }
    }, {
        key: 'enableButton',
        value: function enableButton(button) {
            button.prop('disabled', false);
        }
    }, {
        key: 'doDownloads',
        value: function doDownloads(event) {
            $('#crossPage').prop('disabled', true);
            var type = $(event.target).data('type');
            var html = UI.builDownloadAlert(type);
            var urlsToDownload = [];
            $('#alertUser').html(html).slideDown("slow").show();
            if (type === 'downloadSelected') {
                $.each($('.checkboxes:checked').prev('a'), function () {
                    var ep = Anime.getEpisodeFromAnchor(this);
                    urlsToDownload.push(ep.downloadLink);
                });
            } else if (type === 'downloadSelects') {
                $.each($('#animeSelection option:selected'), function () {
                    var url = this.dataset.url;
                    urlsToDownload.push(url);
                });
            } else {
                var eps = Anime.getEpsForRes(parseInt($('#downloadRes').val()), false);
                for (var i = 0, len = eps.length; i < len; i++) {
                    urlsToDownload.push(eps[i].downloadLink);
                }
            }
            bindAlertControls();
            function bindAlertControls() {
                $('#alertButtonCancel').on('click', function () {
                    $('#alertUser').slideUp('slow');
                    $('#crossPage').prop('disabled', false);
                });
                $('#alertButton').on('click', function () {
                    doIt(urlsToDownload, false);
                });
                $("#downloadZip").on("click", function () {
                    doIt(urlsToDownload, true);
                });
            }
            function doIt(urls, asZip) {
                var ajaxPromiseMap = new Map();
                var arrayd = [];
                for (var _i3 = 0; _i3 < urls.length; _i3++) {
                    var d = $.Deferred();
                    ajaxPromiseMap.set(urls[_i3], d);
                    arrayd.push(d);
                }
                $.when.apply($, arrayd).done(function () {
                    if (!asZip) {
                        return;
                    }

                    var zip = new JSZip();
                    var errors = [];
                    if (arrayd.length === 1) {
                        var blob = arguments[0];
                        var fileName = arguments[1];
                        var error = arguments[2];
                        if (error !== null) {
                            errors.push(fileName);
                        } else {
                            zip.file(fileName, blob);
                        }
                    } else {
                        for (var _i4 = 0; _i4 < arguments.length; _i4++) {
                            var arg = arguments[_i4];
                            var _blob = arg[0];
                            var _fileName = arg[1];
                            var _error = arg[2];
                            if (_error !== null) {
                                errors.push(_fileName);
                            } else {
                                zip.file(_fileName, _blob);
                            }
                        }
                    }
                    if (errors.length > 0) {
                        var errorMessage = "Unable to download the following files: \n" + errors.join("\n") + "\n Please download these files manually";
                        alert(errorMessage);
                    }
                    $("#progressStatus").text("Generating zip file...");
                    zip.generateAsync({ type: "blob" }).then(function (blob) {
                        saveAs(blob, Anime.currentAnime + ".zip");
                        $("#loadingContainer").hide();
                        $("#progressStatus").text(null);
                        $("#progressBarForZip").width(0);
                        $('#alertUser').slideUp('slow');
                    }, function (err) {
                        alert(err);
                    });
                });
                var timerOffset = 0;
                if (asZip) {
                    $("#loadingContainer").show();
                }
                var count = 0;

                var _loop2 = function _loop2(currentUrl, deferr) {
                    var ep = Anime.getEpisodeFromUrl(currentUrl);
                    var fileName = ep.title.replace(/ /g, "_") + ".torrent";
                    setTimeout(function () {
                        count++;
                        Utils.downloadViaJavaScript(currentUrl, undefined, function (blob, fileName, hasError, error, saveFunc) {
                            if (!asZip) {
                                saveFunc();
                            } else {
                                var percent = Math.floor(100 * count / ajaxPromiseMap.size);
                                var doneAsString = percent + "%";
                                $("#progressStatus").text("Downloading torrents: " + doneAsString);
                                $("#progressBarForZip").width(doneAsString);
                            }
                            if (hasError) {
                                deferr.resolve(blob, fileName, error);
                            } else {
                                deferr.resolve(blob, fileName, null);
                            }
                        }, "GET", fileName);
                    }, timerOffset);
                    timerOffset += 450;
                };

                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = ajaxPromiseMap[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var _ref3 = _step2.value;

                        var _ref4 = _slicedToArray(_ref3, 2);

                        var currentUrl = _ref4[0];
                        var deferr = _ref4[1];

                        _loop2(currentUrl, deferr);
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }

                if (!asZip) {
                    $('#alertUser').slideUp('slow');
                }
                $('#crossPage').prop('disabled', false);
            }
        }
    }, {
        key: 'checkBoxValid',
        value: function checkBoxValid(checkbox) {
            return checkbox.is(':checked');
        }
    }, {
        key: '_minSeedsSet',
        value: function _minSeedsSet() {
            var seeds = Localstore.getMinSeedsFromStore();
            if (seeds !== null && seeds.length > 0) {
                return Number.parseInt(seeds) !== 1;
            }
            return false;
        }
    }, {
        key: 'getCurrentPageOffset',
        value: function getCurrentPageOffset() {
            return parseInt(typeof QueryString.p === 'undefined' ? 1 : QueryString.p);
        }
    }, {
        key: 'arrayCopy',
        value: function arrayCopy(array) {
            var deep = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            return $.extend(deep, [], array);
        }
    }, {
        key: 'cleanAvailableResolutions',
        value: function cleanAvailableResolutions() {
            var avRes = Utils.arrayCopy(Anime.availableRes, true);
            for (var i = 0, len = avRes.length; i < len; i++) {
                var currentRes = avRes[i].res;
                if (Anime.getAmountOfEpsFromRes(currentRes, true) === 0) {
                    Anime.removeAvailableResolutions(currentRes);
                }
            }
        }
    }, {
        key: 'sortAllControls',
        value: function sortAllControls() {
            Utils.sortSelect(document.getElementById('animeSelection'));
            Utils.sortSelect(document.getElementById('downloadRes'));

            $('#info').sortTable(0);
        }
    }, {
        key: 'reBindSelectFilters',
        value: function reBindSelectFilters() {
            $('input[name=\'filterSelect\']').offOn('change', handleSelect);

            $('#clearResOptions').offOn('click', handleSelect);

            $("#animeSelection").offOn("click", function () {
                UI.autoEnableAcceptSelect();
            });

            $("#selectAllFromControl").offOn("click", function () {
                var allSelected = $("#animeSelection option:selected").length === $("#animeSelection option").length;
                if (allSelected) {
                    $(this).text("Select all");
                    $("#animeSelection option").prop("selected", false);
                } else {
                    $(this).text("deselect all");
                    $("#animeSelection option").prop("selected", true);
                }
                UI.autoEnableAcceptSelect();
            });
            function handleSelect(event) {
                var resTOFilter = $(event.target).data('set');
                $('#selectAnime').html(UI.buildSelect(resTOFilter));
                Utils.sortAllControls();
                var searchApplied = UI.getAppliedSearch();
                if (searchApplied !== '') {
                    UI.applySearch(searchApplied);
                }
                Utils.reBindSelectFilters();
            }
        }
    }, {
        key: 'getHumanReadableSize',
        value: function getHumanReadableSize(from) {
            var decimals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;

            var bits = 0;
            if (Array.isArray(from)) {
                for (var i = 0; i < from.length; i++) {
                    var ep = from[i];
                    bits += ep.size;
                }
            } else if (typeof from === 'number') {
                bits = from;
            } else {
                bits += from.size;
            }
            function formatBytes(bytes, decimals) {
                if (bytes == 0) {
                    return '0 Byte';
                }
                var k = 1024;
                var dm = decimals + 1 || 3;
                var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
                var i = Math.floor(Math.log(bytes) / Math.log(k));
                return (bytes / Math.pow(k, i)).toPrecision(dm) + ' ' + sizes[i];
            }
            return formatBytes(bits, decimals);
        }
    }]);

    return Utils;
}();

var DataParser = function () {
    function DataParser(table) {
        _classCallCheck(this, DataParser);

        this.table = null;
        this.table = table;
    }

    _createClass(DataParser, [{
        key: 'parseTable',
        value: function parseTable(currentPage) {
            var trRow = this.table.find('img[src*=\'/static/img/icons/nyaa/1_2.png\']').closest('tr');
            var eps = [];
            $.each($(trRow), function () {
                var resInfo = parseRes(this);
                if (resInfo == null) {
                    Anime.addAvailableResolutions(-1, null);
                } else {
                    Anime.addAvailableResolutions(resInfo.res, resInfo.fullRes);
                }
                var info = getEpisodeInfo(this);
                if(resInfo == null){
                   eps.push(new Episode( -1 , info.currentDownloadLink, info.seeds, info.leech, info.uid, currentPage, info.title, info.size));
                }else{
                  eps.push(new Episode(typeof resInfo.res === 'undefined' ? -1 : resInfo.res, info.currentDownloadLink, info.seeds, info.leech, info.uid, currentPage, info.title, info.size));
                }
            });
            return eps;
            function parseRes(eventContent) {
                var supportedRes = Anime.supportedRes;
                for (var i = 0; i < supportedRes.length; i++) {
                    var currRes = supportedRes[i].res;
                    var currFullRes = supportedRes[i].fullRes;
                    if ($(eventContent).children('td:nth-child(2)').text().indexOf(currRes + 'p') > -1 || $(eventContent).children('td:nth-child(2)').text().indexOf(currFullRes) > -1) {
                        return supportedRes[i];
                    }
                }
            }
            function getEpisodeInfo(eventContent) {
                var _eventContent = $(eventContent);
                var currentDownloadLink = Anime.getTdFromTable(_eventContent, 3).find("a")[0].href;
                function getTextContent(idx) {
                    return isNaN(parseInt(Anime.getTdFromTable(_eventContent, idx).text())) ? 0 : parseInt(Anime.getTdFromTable(_eventContent, idx).text());
                }
                function convertToString(ev) {
                    var sizeValue = Anime.getTdFromTable(ev, 4).text();
                    var sizeText = $.trim(sizeValue.split(' ').pop());
                    var intValue = parseInt(sizeValue);
                    switch (sizeText) {
                        case "MiB":
                            return Math.pow(2, 20) * intValue;
                        case "GiB":
                            return intValue * 1073741824;
                        default:
                            return 0;
                    }
                }
                var seeds = getTextContent(6);
                var leech = getTextContent(7);
                var title = Anime.getTdFromTable(_eventContent, 2).text().trim().substring(1).trim();
                var uid = Anime.getUidFromJqueryObject(_eventContent);
                var size = convertToString(_eventContent);
                return {
                    'currentDownloadLink': currentDownloadLink,
                    'seeds': seeds,
                    'leech': leech,
                    'title': title,
                    'uid': uid,
                    "size": size
                };
            }
        }
    }]);

    return DataParser;
}();

var Localstore = function () {
    function Localstore() {
        _classCallCheck(this, Localstore);
    }

    _createClass(Localstore, null, [{
        key: 'getMinSeedsFromStore',
        value: function getMinSeedsFromStore() {
            var lo = localStorage.getItem('minSeeds');
            return lo === null ? "-1" : lo;
        }
    }, {
        key: 'setMinSeedsFromStore',
        value: function setMinSeedsFromStore(seeds) {
            localStorage.setItem('minSeeds', seeds.toString());
        }
    }, {
        key: 'removeMinSeedsFromStore',
        value: function removeMinSeedsFromStore() {
            localStorage.removeItem('minSeeds');
        }
    }]);

    return Localstore;
}();

Main.main();
