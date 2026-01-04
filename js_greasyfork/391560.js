// ==UserScript==
// @name         Better Movie-blog 3
// @namespace    hoehleg.userscripts.private.movie-blog
// @version      0.0.7
// @description  Browse trough the articles with left and right cursor keys
// @author       Gerrit Höhle
//
// @match         http://www.movie-blog.org/
// @match         http://www.movie-blog.org/page/*
// @match         http://www.movie-blog.org/category/*
// @match        https://www.movie-blog.org/
// @match        https://www.movie-blog.org/page/*
// @match        https://www.movie-blog.org/category/*
// @match         http://movie-blog.to/
// @match         http://movie-blog.to/page/*
// @match         http://movie-blog.to/category/*
// @match        https://movie-blog.to/
// @match        https://movie-blog.to/page/*
// @match        https://movie-blog.to/category/*
//
// @require      https://greasyfork.org/scripts/390752-comparator/code/Comparator.js?version=745016
// @require      https://greasyfork.org/scripts/391854-enum/code/Enum.js?version=746956
// @require      https://greasyfork.org/scripts/391608-privateproperty/code/PrivateProperty.js?version=744693
// @require      https://greasyfork.org/scripts/391549-htmlid/code/HtmlId.js?version=744142
// @require      https://greasyfork.org/scripts/391551-htmlclass/code/HtmlClass.js?version=743803
// @require      https://greasyfork.org/scripts/391979-parseutil/code/ParseUtil.js?version=746751
//
// @require      https://greasyfork.org/scripts/391978-beitrag/code/Beitrag.js?version=746962
//
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
//
// @require      https://greasyfork.org/scripts/391970-data-table-column/code/DATA_TABLE_COLUMN.js?version=746961
// @require      https://cdn.jsdelivr.net/npm/datatables.net@1.10.20/js/jquery.dataTables.min.js
// @resource     dt_css                https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.19/css/jquery.dataTables.min.css
// @resource     dt_sort_both          https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.19/images/sort_both.png
// @resource     dt_sort_asc           https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.19/images/sort_asc.png
// @resource     dt_sort_desc          https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.19/images/sort_desc.png
// @resource     dt_sort_asc_disabled  https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.19/images/sort_asc_disabled.png
// @resource     dt_sort_desc_disabled https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.19/images/sort_desc_disabled.png
//
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/391560/Better%20Movie-blog%203.user.js
// @updateURL https://update.greasyfork.org/scripts/391560/Better%20Movie-blog%203.meta.js
// ==/UserScript==

/* jshint esnext: true */
/* globals Comparator, Enum, PrivateProperty, HtmlId, HtmlClass, ParseUtil, Beitrag, DATA_TABLE_COLUMN, $, jQuery */
(function() {
    'use strict';
    const CONFIG = {
        // number of pages to load Beitraege to one page
        PAGES_LOAD_COUNT: 1,

        // unit for row "Groesse" in beitraege table
        TABLE_BEITRAEGE_SIZE_DEFAULT_UNIT: "GB",

        // position of sidebar (below image)
        SIDEBAR_POSITION_TOP_PX: 670,

        // minim wait time between two page get-requests
        TIMEOUT_PAGELOAD_MS: 500
    };

    const CONST = (() => {
        const URL_PATH = document.location.pathname.split("/").filter(str => str.length);

        const TABLE_BEITRAEGE_COLUMNS = DATA_TABLE_COLUMN.init({
            RATING: "IMDb",
            JAHR: "Jahr",
            LINK: "Link",
            DURATION: "Dauer",
            SIZE: "Größe",
            DATE: "Datum",
            TYPE: "Typ",
            GROUP: "group"
        });

        TABLE_BEITRAEGE_COLUMNS.RATING.renderFunctions = {
            any: beitrag => {
                return beitrag.imdbRating;
            },
            display: beitrag => {
                if (!beitrag.imdbId) {
                    return beitrag.imdbRatingAsText;
                }
                return $("<DIV>").append($("<A>", {
                    target: "_blank",
                    href: `https://www.imdb.com/title/${beitrag.imdbId}/`,
                    text: beitrag.imdbRatingAsText,
                })).html();
            }
        };

        TABLE_BEITRAEGE_COLUMNS.JAHR.data = "releasedYear";

        TABLE_BEITRAEGE_COLUMNS.LINK.renderFunctions = {
            any: beitrag => beitrag.linkText,
            display: beitrag => {
                if (!beitrag.link) {
                    return "";
                }
                return $("<DIV>").append($("<A>", {
                    target: beitrag.link.target,
                    href: beitrag.link.href,
                    text: beitrag.linkText
                })).html();

            },
        };
        TABLE_BEITRAEGE_COLUMNS.LINK.className = "col-link";

        TABLE_BEITRAEGE_COLUMNS.DURATION.renderFunctions = {
            any: beitrag => beitrag.dauer,
            display: beitrag => beitrag.dauerAsText,
            filter: beitrag => beitrag.dauerAsText
        };

        TABLE_BEITRAEGE_COLUMNS.SIZE.renderFunctions = {
            any: beitrag => beitrag.getGroesseInUnit(CONFIG.TABLE_BEITRAEGE_SIZE_DEFAULT_UNIT),
            display: beitrag => beitrag.getGroesseAsText(CONFIG.TABLE_BEITRAEGE_SIZE_DEFAULT_UNIT, 1)
        };

        TABLE_BEITRAEGE_COLUMNS.DATE.data = "datum";
        TABLE_BEITRAEGE_COLUMNS.DATE.renderFunctions = {
            display: datum => datum ? datum.toLocaleDateString(undefined, { dateStyle: "short", timeStyle: "short" }) : "",
            sort: datum => new Date(datum || 0)
        };

        TABLE_BEITRAEGE_COLUMNS.TYPE.data = "typ";

        TABLE_BEITRAEGE_COLUMNS.GROUP.renderFunctions = {
            any: beitrag => {
                let dateVal = new Date().setHours(0, 0, 0, 0);
                let typVal = Beitrag.TYPEN.length;
                if (beitrag) {
                    dateVal -= beitrag.datum ? beitrag.datum.setHours(0, 0, 0, 0) : 0;
                    typVal = beitrag.typ.ordinal;
                }

                return dateVal + typVal;
            },
            display: beitrag => {
                let tag = "", typ = "";
                if (beitrag) {
                    tag = beitrag.datumTag.toLocaleDateString(undefined, { dateStyle: "short" });
                    typ = beitrag.typ;
                }
                return [ tag, typ ].filter(txt => txt && String(txt)).join(" - ");
            }
        };

        const HTML_IDS = Object.fromEntries(Object.entries({
            SHOW_CONTAINER: "show-container",
            BEITRAG_INFO: "beitrag-info",
            PAGE_NUMBER: "page-number",
            BEITRAG_NUMBER: "beitrag-number",
            BEITRAG_COUNT: "beitrag-count",
            FILM_DATA_IMDB_RATING: "film-data-imdb-rating",
            FILM_DATA_GROESSE: "film-data-groesse",
            FILM_DATA_DAUER: "film-data-dauer",
            BUTTON_PAGE_PREV: "btn-page-prev",
            BUTTON_PAGE_NEXT: "btn-page-next",
            BUTTON_BEITRAG_PREV: "btn-beitrag-prev",
            BUTTON_BEITRAG_NEXT: "btn-beitrag-next",
            CONTAINER_LISTE_BEITRAEGE: "container-liste-beitraege",
            LISTE_BEITRAEGE: "liste-beitraege",
            HEAD: "head",
            PAGE: "page",
            FOOTER: "footer",
            CONTENT: "content",
            TABLE_TR_NUM: "tr-num",
            SIDEBAR: "sidebar",
            CUR_BEITRAG_IMG: "cur-beitrag-img"
        }).map(([k, v]) => [ k, new HtmlId(v) ]));

        const HTML_CLASSES = Object.fromEntries(Object.entries({
            BEITRAG: "beitrag4"
        }).map(([k, v]) => [ k, new HtmlClass(v) ]));

        if (URL_PATH && URL_PATH[0] === "category") {
            Object.assign(HTML_IDS, {
                CONTENT: new HtmlId("archiv")
            });

            Object.assign(HTML_CLASSES, {
                BEITRAG: new HtmlClass("beitrag2")
            });
        }

        // Container
        let CSS = `
            #${HTML_IDS.PAGE} {
                width: 100%;
                height: auto;
                margin: 0;
                padding: 0;
            }
            #${HTML_IDS.CONTENT} {
                margin: 20px 0 0 0;
                padding: 0 2%;
                width: auto;
                height: auto;
            }
            #${HTML_IDS.SHOW_CONTAINER} {
                position: relative;
            }
            #${HTML_IDS.CONTAINER_LISTE_BEITRAEGE} {
                position: relative;
                width: 100%;
                white-space: nowrap;
            }
            ${[ HTML_IDS.PAGE, HTML_IDS.CONTENT, HTML_IDS.FOOTER ].map( id => id.selector).join()} {
                background: white;
            }
            #${HTML_IDS.SIDEBAR} {
                position: absolute;
                top: ${CONFIG.SIDEBAR_POSITION_TOP_PX}px;
                right: 0px;
            }`;

        // Beitrag
        //         CSS += `
        //             #${HTML_IDS.CUR_BEITRAG_IMG} {
        //                 position: fixed;
        //                 top: 2px;
        //                 left: 72%;
        //                 max-width: 400px;
        //                 z-index: 1;
        //             }
        //             #${HTML_IDS.BEITRAG_INFO} {
        //                 position: fixed;
        //                 top: 2px;
        //                 left: 80px;
        //             }
        //             .${HTML_CLASSES.BEITRAG} {
        //                 position: relative;
        //                 width: 100%;
        //                 margin: 1.3em 0 0 0;
        //             }
        //             .${HTML_CLASSES.PREVIOUS}, .${HTML_CLASSES.NEXT} {
        //                 display: inline-block;
        //                 padding: 20;
        //                 margin: 0;
        //                 text-decoration: none;
        //                 text-align: center;
        //                 font-weight: bold;
        //             }
        //              input[type="number"] {
        //                 -webkit-appearance: textfield;
        //                 -moz-appearance: textfield;
        //                 appearance: textfield;
        //             }
        //             input[type=number]::-webkit-inner-spin-button,
        //             input[type=number]::-webkit-outer-spin-button {
        //                 -webkit-appearance: none;
        //             }
        //        `;


        // dataTable
        CSS += GM_getResourceText("dt_css").replace(/["']\.\.\/images\/(\w+)\.\w+["']/g, (m, p) => GM_getResourceURL(`dt_${p}`) || m);

        return { URL_PATH, TABLE_BEITRAEGE_COLUMNS, HTML_CLASSES, HTML_IDS, CSS };
    })();

    const Beitraege = (() => {
        // default-sort for Beitraege
        const beitragCompareFunction = new Comparator(beitrag => beitrag.datum, beitrag => beitrag.link ? beitrag.link.href : "").reverse().compareFnc;

        const _pageNumbersLoading = new PrivateProperty();
        const _waitLoadingTill = new PrivateProperty();

        /**
         * Loads specific page and returns articles via callback-function.
         * @param {Beitraege} thisObj   - relevant instance
         * @param {Number} pageNumber   - number of the page to request
         * @param {Function} onResponse - callback function ({Array<Beitrag>} beitraege, {Number} pageNumber)
         */
        const loadAsync = (thisObj, pageNumber, onResponse) => {
            if (_pageNumbersLoading.getOrCompute(thisObj, () => new Set()).has(pageNumber)) {
                return;
            }

            const urlPath = `${document.location.href.replace('page/', '').replace('#','')}page/${pageNumber}`;

            const onSuccess = (response) => {
                const beitraege = [];
                for (let element of response.html.querySelectorAll(`DIV.${CONST.HTML_CLASSES.BEITRAG}`)) {
                    beitraege.push(new Beitrag(element));
                }

                _pageNumbersLoading.get(thisObj).delete(pageNumber);
                onResponse(beitraege, pageNumber);
            };

            const onError = onSuccess;

            _pageNumbersLoading.get(thisObj).add(pageNumber);

            const now = new Date();
            const waitTill = _waitLoadingTill.getOrCompute(thisObj, () => now);
            const timeOutMs = waitTill - now;

            window.setTimeout(() => ParseUtil.getPageAsync(urlPath, onSuccess, onError), timeOutMs);
            _waitLoadingTill.set(thisObj, new Date(waitTill.valueOf() + CONFIG.TIMEOUT_PAGELOAD_MS));

        };

        const findIndexOf = (beitraege, beitrag, fromIndex = 0, toIndex = beitraege.length - 1) => {
            if (beitraege.length === 0) {
                return { index: -1 };
            }
            if (fromIndex === toIndex) { // one element left to compare
                const compareResult = beitragCompareFunction(beitrag, beitraege[fromIndex]);
                return { index: fromIndex, compareResult: compareResult };
            }

            const midIndex = (fromIndex + toIndex) >>> 1;
            const compareResult = beitragCompareFunction(beitrag, beitraege[midIndex]);

            if (compareResult < 0) { // smaller
                return findIndexOf(beitraege, beitrag, fromIndex, midIndex - 1);
            }
            if (compareResult > 0) { // greater
                return findIndexOf(beitraege, beitrag, midIndex + 1, toIndex);
            }
            if (compareResult === 0) { // found
                return { index: midIndex, compareResult: 0 };
            }
        };

        const insertBeitraege = (beitraege, newBeitraege = []) => {
            const inserted = [];

            for (let b of newBeitraege) {
                const findResult = findIndexOf(beitraege, b);

                if (findResult.compareResult !== 0) {
                    const insertIndex = findResult.compareResult > 0 ? findResult.index + 1 : findResult.index;
                    beitraege.splice(insertIndex, 0, b);
                    inserted.push(b);
                }
            }

            return inserted;
        };

        const createOnLoadFunction = (thisObj, callbackFunction) => {
            return (typeof callbackFunction === "function") ? (result, pageNumber) => callbackFunction(result, pageNumber, thisObj) : () => {};
        };

        const _beitraege = new PrivateProperty();
        const _loadedPageNumMax = new PrivateProperty();
        const _onLoad = new PrivateProperty();

        return class Beitraege {

            constructor(onLoad) {
                _beitraege.init(this, []);
                _loadedPageNumMax.init(this, 0);
                this.onLoad = onLoad;
                this[Symbol.iterator] = () => _beitraege.get(this)[Symbol.iterator]();
            }

            get length() {
                return _beitraege.get(this).length;
            }

            get onLoad() {
                return _onLoad.get(this);
            }

            set onLoad(value) {
                _onLoad.set(this, createOnLoadFunction(this, value));
            }

            get(index) {
                return _beitraege.get(this)[index];
            }

            loadBegin(callback) {
                loadAsync(this, 0, (newBeitraege, pageNumber) => {
                    newBeitraege = insertBeitraege(_beitraege.get(this), newBeitraege);
                    this.onLoad(newBeitraege, pageNumber);
                    if (typeof callback === "function") {
                        callback(newBeitraege, pageNumber);
                    }
                });
            }

            loadMore(callback) {
                loadAsync(this, _loadedPageNumMax.get(this) + 1, (newBeitraege, pageNumber) => {
                    _loadedPageNumMax.set(this, Math.max(_loadedPageNumMax.get(this), pageNumber));
                    newBeitraege = insertBeitraege(_beitraege.get(this), newBeitraege);
                    this.onLoad(newBeitraege, pageNumber);
                    if (typeof callback === "function") {
                        callback(newBeitraege, pageNumber);
                    }
                });
            }
        };
    })();

    GM_addStyle(CONST.CSS);
    $(document).find("script").remove();
    CONST.HTML_IDS.HEAD.$.remove();

    CONST.HTML_IDS.CONTENT.$.empty().append(
        $("<DIV>").prop("id", CONST.HTML_IDS.SHOW_CONTAINER).append(
            $("<DIV>").prop("id", CONST.HTML_IDS.CONTAINER_LISTE_BEITRAEGE).append(
                $("<TABLE>").prop("id", CONST.HTML_IDS.LISTE_BEITRAEGE)
            ),
            $("<DIV>").prop("id", CONST.HTML_IDS.BEITRAG_INFO)
        ));

    const defaultOrder = [
        [ CONST.TABLE_BEITRAEGE_COLUMNS.GROUP.ordinal, "asc" ],
        [ CONST.TABLE_BEITRAEGE_COLUMNS.RATING.ordinal, "desc" ]
    ];

    CONST.HTML_IDS.LISTE_BEITRAEGE.$.DataTable({
        paging: true,
        ordering: true,
        info: true,
        displayLength: 10,
        order: defaultOrder,
        columnDefs: [
            { targets: CONST.TABLE_BEITRAEGE_COLUMNS.GROUP.ordinal, visible: false },
            { targets: CONST.TABLE_BEITRAEGE_COLUMNS.TYPE.ordinal, visible: false }
        ],
        drawCallback: function (settings) {
            const api = this.api();
            const rows = api.rows({ page: 'current' }).nodes();
            const col = api.column(CONST.TABLE_BEITRAEGE_COLUMNS.GROUP.ordinal, { page: 'current' });

            let lastValue = null;
            col.data().each((data, rowIndex) => {
                const value = CONST.TABLE_BEITRAEGE_COLUMNS.GROUP.render(data, "display");

                if (Comparator.compare(value, lastValue) !== 0) {
                    $(rows).eq(rowIndex).before(
                        $("<tr>").addClass("group").append(
                            $("<td>").prop("colspan", 6).text(value)
                        )
                    );
                    lastValue = value;
                }
            });
        },
        data: [],
        columns: [ ...CONST.TABLE_BEITRAEGE_COLUMNS ]
    });

    CONST.HTML_IDS.LISTE_BEITRAEGE.$.addClass("display compact");

    // order by the grouping column
    CONST.HTML_IDS.LISTE_BEITRAEGE.$.on("click", "tr.group", () => {
        const currentOrder = CONST.HTML_IDS.LISTE_BEITRAEGE.$.DataTable().order();
        const groupColumnPos = CONST.TABLE_BEITRAEGE_COLUMNS.GROUP.ordinal;

        const newOrder = [ ...defaultOrder ];
        if (newOrder[0][0] !== groupColumnPos) {
            newOrder.unshift([ groupColumnPos, "asc" ]);
        } else {
            newOrder[0][1] = currentOrder[0][1] === 'desc' ? 'asc' : 'desc';
        }
        CONST.HTML_IDS.LISTE_BEITRAEGE.$.DataTable().order(newOrder).draw();
    });

    // single select
    CONST.HTML_IDS.LISTE_BEITRAEGE.$.on('mouseover', 'tr', function() {
        const curTR = $(this);
        if (curTR.parent().is("TBODY") && curTR.attr("role") === "row" && !curTR.hasClass("group")) {
            CONST.HTML_IDS.LISTE_BEITRAEGE.$.find("tr.selected").removeClass('selected');
            curTR.addClass('selected');
        }
    });

    const beitraege = new Beitraege(newBeitraege => {
        CONST.HTML_IDS.LISTE_BEITRAEGE.$.DataTable().rows.add(newBeitraege).draw(false);
    });
    beitraege.loadMore();
})();