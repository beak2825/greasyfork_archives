// ==UserScript==
// @name        z0r.de index search
// @namespace   SearchingZ0r
// @author      Victorique
// @description Search through the index of z0r.de via multiple argumants
// @include     http://index.z0r.de/search2.php
// @version     1.0
// @license     MIT
// @run-at      document-idle
// @require     https://code.jquery.com/jquery-3.1.0.min.js
// @require     https://greasyfork.org/scripts/19117-jsutils/code/JsUtils.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22350/z0rde%20index%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/22350/z0rde%20index%20search.meta.js
// ==/UserScript==

let FlashObject = (function () {

    function FlashObject(link, id, interpreter = null, songTitle = null, imageSource = null, tag = null) {
        if (id === undefined) {
            throw new TypeError("Id must be set");
        }

        if (link === undefined) {
            throw new TypeError("link must be set");
        }

        let _link = link;
        let _id = id;
        let _interpreter = interpreter;
        let _songTitle = songTitle;
        let _imageSource = imageSource;
        let _tag = tag;

        this.getLink = function getLink() {
            return _link;
        };

        this.getId = function getId() {
            return _id;
        };

        this.getInterpreter = function getInterpreter() {
            return _interpreter;
        };

        this.getSongTitle = function getSongTitle() {
            return _songTitle;
        };

        this.getImageSource = function getImageSource() {
            return _imageSource;
        };

        this.getTag = function getTag() {
            return _tag;
        };
        Object.defineProperty(this, "guid", {
            value: ObjectUtil.guid()
        });
    }
    FlashObject.prototype = {
        constructor: FlashObject
    };

    return FlashObject;
}());

let Site = (function () {
    let flashes = [];

    var addFlashes = function addFlashes(flashObject) {
        if (!(flashObject instanceof FlashObject)) {
            throw new TypeError("object must be a FlashObject");
        }
        flashes.push(flashObject);
    };

    var getFlashes = function getFlashes() {
        return flashes;
    };

    var getTableUrls = function getTableUrls() {
        let allUrls = [];
        $("#menu").find("a").each((k, v) => {
            var href = $(v).attr("href");
            if (href.indexOf("Seite") === -1) {
                return true;
            }
            allUrls.push(href);
        });
        return allUrls;
    };

    return {
        addFlashes: addFlashes,
        getTableUrls: getTableUrls,
        getFlashes: getFlashes
    };
}());

let DataParser = (function () {

    var parseTable = function (table) {
        function getValue(th) {
            if (th.length === 0) {
                return null;
            }

            return th.text();
        }
        if (table === null) {
            throw 'no table to parse on, table is null';
        }
        var trRow = table.find('tr');
        var flashes = [];
        $.each(trRow, (k, v) => {

            var th = $(v).find("th");
            var anchor = ObjectUtil.getElementFromJqueryArray(th, 0).find("a");
            if (anchor.length === 0) {
                return;
            }
            let id = anchor.text();
            let link = anchor.attr("href");
            let interpreterTh = ObjectUtil.getElementFromJqueryArray(th, 1);
            let songTitleTh = ObjectUtil.getElementFromJqueryArray(th, 2);
            let imageSourceTh = ObjectUtil.getElementFromJqueryArray(th, 3);
            let tagTh = ObjectUtil.getElementFromJqueryArray(th, 4);

            let cleanObj = {
                link: link,
                id: id,
                interpreter: getValue(interpreterTh),
                songTitle: getValue(songTitleTh),
                imageSource: getValue(imageSourceTh),
                tag: getValue(tagTh)
            };
            flashes.push(new FlashObject(cleanObj.link, cleanObj.id, cleanObj.interpreter, cleanObj.songTitle, cleanObj.imageSource, cleanObj.tag));
        });
        return flashes;
    };

    return {
        parseTable: parseTable
    };
}());
let Utils = (function () {}()); // for use later
let UI = (function () {
    var buildTable = function buildTable(flashObjects) {
        function isEven(x) {
            return (x & 1);
        }
        if (!ArrayUtils.validArray(flashObjects)) {
            return null;
        }
        var html = "<table id='resultTable'  cellpadding='3' cellspacing='1' width='100%'>";
        html += '<thead id="content-head">\
              <tr>\
                 <th width="3%">ID</th>\
                 <th width="23%">Interpreter</th>\
                 <th width="42%">Song Title</th>\
                 <th width="30%">Image Source</th>\
                 <th width="2%">Tag</th>\
              </tr>\
        </thead>'
        html += "<tbody>"
        for (let i = 0, len = flashObjects.length; i < len; i++) {
            let flashObject = flashObjects[i];
            var useAltClass = isEven(i);
            var clazz = "";
            if (useAltClass) {
                clazz = "class = 'alt'";
            }
            html += '<tr ' + clazz + '>\
                <td align="center"><a href="' + flashObject.getLink() + '">' + flashObject.getId() + '</a></td>\
                <td align="left">' + flashObject.getInterpreter() + '</td>\
                <td align="left">' + flashObject.getSongTitle() + '</td>\
                <td align="left">' + flashObject.getImageSource() + '</td>\
                <td align="center">' + flashObject.getTag() + '</td>\
            </tr>'
        }
        html += "</tbody>"
        html += "</table>";

        return html;
    };

    return {
        buildTable: buildTable
    };
}());
let AjaxParser = (function () {
    var preformParsing = function (callBackWhenDone) {
        var urls = Site.getTableUrls();
        var promises = [];
        var tables = [];
        for (var i = 0; i < urls.length; i++) {
            var url = urls[i];

            var jqxhr = $.ajax(url);
            jqxhr.done(function (data, textStatus, jqXHR) {
                var table = $(data).find("#zebra");
                tables.push(table);
            });
            promises.push(jqxhr);
        }

        $.when.apply(null, promises).done(function () {
            callBackWhenDone(tables);
        });
    };
    return {
        preformParsing: preformParsing
    };
}());
preInit();

function preInit() {
    let initDeff = $.Deferred();

    function setUpSiteObject() {
        AjaxParser.preformParsing(tables => {
            for (var i = 0; i < tables.length; i++) {
                var table = tables[i];
                var flashObjs = DataParser.parseTable(table);
                for (var j = 0; j < flashObjs.length; j++) {
                    var flashObj = flashObjs[j];
                    Site.addFlashes(flashObj);
                }
            }
            initDeff.resolve();
        });
        return initDeff.promise();
    }
    $.when(setUpSiteObject()).done(init);
}

function init() {
    buildUI();
    bindListen();

    function buildUI() {
        makeStyles();

        function makeStyles() {
            let styles = '';
            styles += '#content-head th{padding-left: 10px;}';
            styles += 'tr.alt td{font-weight: normal; background-color: #141414; padding: 6px 6px; color: #ffffff; letter-spacing: 1px;}';
            styles += 'td{font-weight: normal; background-color: #212121; padding: 6px 6px; color: #ffffff; letter-spacing: 1px;}';
            styles += '#resultTable tbody{position: relative;top: 16px;}';

            DomUtil.injectCss(styles);
        }

        $("#search").empty();
        let html = "<div id='wrapper'>"
        html += "<div id='list'>";
        html += UI.buildTable(Site.getFlashes());
        html += "</div>";
        html += "</div>"


        $("#search").html(html);
    }

    function bindListen() {

    }
}
