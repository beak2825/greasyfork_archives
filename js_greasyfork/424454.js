/*! 
// ==UserScript==
// @name         hitomi.la helper
// @namespace    Violentmonkey Scripts
// @version      1.1.1
// @description  hitomi.laの日本語化・日本語登録を可能にする
// @author       riko
// @match        https://hitomi.la/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/424454/hitomila%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/424454/hitomila%20helper.meta.js
// ==/UserScript==
 */
(() => {
    "use strict";
    var __webpack_modules__ = {
        165: (__unused_webpack_module, exports) => {
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.insertApiUrl = exports.translateApiUrl = void 0, exports.translateApiUrl = "", 
            exports.insertApiUrl = "", exports.translateApiUrl = "https://cf-translate-api.n-0fa.workers.dev/api/v1/", 
            exports.insertApiUrl = "https://cf-translate-api.n-0fa.workers.dev/api/v1/";
        },
        156: function(__unused_webpack_module, exports, __webpack_require__) {
            var __importDefault = this && this.__importDefault || function(mod) {
                return mod && mod.__esModule ? mod : {
                    default: mod
                };
            };
            Object.defineProperty(exports, "__esModule", {
                value: !0
            });
            const ListAllPage_1 = __importDefault(__webpack_require__(704)), ListJaPage_1 = __importDefault(__webpack_require__(728)), SearchPage_1 = __importDefault(__webpack_require__(173)), RecentlyAddedPage_1 = __importDefault(__webpack_require__(501)), IndexPage_1 = __importDefault(__webpack_require__(647)), DetailPage_1 = __importDefault(__webpack_require__(772)), url = location.href, parseDetailPage = url => {
                const page = new DetailPage_1.default(url);
                page.translateMainContents(), page.translateRelatedGallery(), page.addRegistrationForm();
            };
            if (url.match(ListAllPage_1.default.urlRegExp)) {
                new ListAllPage_1.default(url).redirectToJapanesePage();
            } else if (url.match(ListJaPage_1.default.urlRegExp)) {
                new ListJaPage_1.default(url).translateRelatedGallery();
            } else if (url.match(SearchPage_1.default.urlRegExp)) {
                new SearchPage_1.default(url).translateRelatedGallery();
            } else if (url.match(IndexPage_1.default.urlRegExp)) {
                new IndexPage_1.default(url).translateIndex();
            } else if (url.match(DetailPage_1.default.urlRegExp)) setTimeout(parseDetailPage, 1e3, url); else if (url.match(RecentlyAddedPage_1.default.urlRegExp)) {
                new RecentlyAddedPage_1.default(url).translateRelatedGallery();
            }
        },
        311: (__unused_webpack_module, exports) => {
            Object.defineProperty(exports, "__esModule", {
                value: !0
            });
            exports.default = class {
                constructor(divContent, hideEnglishIfJapanese = !0) {
                    this.divContent = divContent, this.hideEnglishIfJapanese = hideEnglishIfJapanese, 
                    this.divContent = divContent, this.artistsDictPromise = Promise.resolve(""), this.groupDictPromise = Promise.resolve(""), 
                    this.seriesDictPromise = Promise.resolve("");
                }
                translateTag(tag, dict) {
                    if (!tag || 0 === Object.keys(dict).length) return;
                    const wordEn = tag.textContent;
                    if (!wordEn) throw "cannot get english name";
                    const wordJa = dict[wordEn];
                    wordJa && (tag.textContent = this.hideEnglishIfJapanese ? wordJa : `${wordJa} (${wordEn})`);
                }
                translateTags(tags, dictPromise) {
                    dictPromise.then((dictResult => {
                        const dict = JSON.parse(dictResult);
                        0 !== Object.keys(dict).length && Array.from(tags).forEach((tag => {
                            this.translateTag(tag, dict);
                        }));
                    }));
                }
                replaceInvalidChars(filename) {
                    return filename.replace(/[\/:*?\"<>|]/g, "_");
                }
            };
        },
        839: function(__unused_webpack_module, exports, __webpack_require__) {
            var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
                return new (P || (P = Promise))((function(resolve, reject) {
                    function fulfilled(value) {
                        try {
                            step(generator.next(value));
                        } catch (e) {
                            reject(e);
                        }
                    }
                    function rejected(value) {
                        try {
                            step(generator.throw(value));
                        } catch (e) {
                            reject(e);
                        }
                    }
                    function step(result) {
                        var value;
                        result.done ? resolve(result.value) : (value = result.value, value instanceof P ? value : new P((function(resolve) {
                            resolve(value);
                        }))).then(fulfilled, rejected);
                    }
                    step((generator = generator.apply(thisArg, _arguments || [])).next());
                }));
            }, __importDefault = this && this.__importDefault || function(mod) {
                return mod && mod.__esModule ? mod : {
                    default: mod
                };
            };
            Object.defineProperty(exports, "__esModule", {
                value: !0
            });
            const BaseContentBox_1 = __importDefault(__webpack_require__(311)), dataTranslation_1 = __webpack_require__(741), dictRegistration_1 = __webpack_require__(245);
            class MainContentBox extends BaseContentBox_1.default {
                constructor(divContent) {
                    super(divContent), this.titleTag = this.divContent.querySelector("div.gallery > h1 a"), 
                    this.artistsTags = this.divContent.querySelectorAll("div.gallery > h2 a"), this.groupTags = Array.from(this.divContent.querySelectorAll("div.gallery > div.gallery-info > table tr")).filter((tr => {
                        var _a;
                        return "Group" === (null === (_a = tr.querySelector("td")) || void 0 === _a ? void 0 : _a.textContent);
                    }))[0].querySelectorAll("a"), this.seriesTags = Array.from(this.divContent.querySelectorAll("div.gallery > div.gallery-info > table tr")).filter((tr => {
                        var _a;
                        return "Series" === (null === (_a = tr.querySelector("td")) || void 0 === _a ? void 0 : _a.textContent);
                    }))[0].querySelectorAll("a"), this.artistsDictPromise = (0, dataTranslation_1.fetchTranslatedDataByWords)("artists", Array.from(this.artistsTags).map((tag => tag.textContent))), 
                    this.groupDictPromise = (0, dataTranslation_1.fetchTranslatedDataByWords)("groups", Array.from(this.groupTags).map((tag => tag.textContent))), 
                    this.seriesDictPromise = (0, dataTranslation_1.fetchTranslatedDataByWords)("series", Array.from(this.seriesTags).map((tag => tag.textContent)));
                }
                generateFilename() {
                    var _a, _b, _c, _d;
                    return __awaiter(this, void 0, void 0, (function*() {
                        const [artistsDict, groupDict, seriesDict] = yield Promise.all([ this.artistsDictPromise, this.groupDictPromise, this.seriesDictPromise ]), artistName = null === (_a = this.artistsTags[0]) || void 0 === _a ? void 0 : _a.textContent, artistJa = artistName && JSON.parse(artistsDict)[artistName], groupName = null === (_b = this.groupTags[0]) || void 0 === _b ? void 0 : _b.textContent, groupJa = groupName && JSON.parse(groupDict)[groupName], seriesName = null === (_c = this.seriesTags[0]) || void 0 === _c ? void 0 : _c.textContent, seriesJa = seriesName && JSON.parse(seriesDict)[seriesName];
                        console.log(artistJa);
                        let filenameArtist = "";
                        artistJa && groupJa ? filenameArtist = `[${artistJa} (${groupJa})] ` : artistJa ? filenameArtist = `[${artistJa}] ` : groupJa && (filenameArtist = `[${groupJa}] `);
                        const filenameSeries = seriesJa ? ` (${seriesJa})` : "";
                        return this.replaceInvalidChars(`${filenameArtist}${null === (_d = this.titleTag) || void 0 === _d ? void 0 : _d.textContent}${filenameSeries}`);
                    }));
                }
                buildFilenameElement() {
                    return __awaiter(this, void 0, void 0, (function*() {
                        const galleryInfoTbody = this.divContent.querySelector("div.gallery > div.gallery-info > table > tbody");
                        if (!galleryInfoTbody) return "";
                        console.log(galleryInfoTbody);
                        const filenameTr = document.createElement("tr"), filenameTd1 = document.createElement("td");
                        filenameTd1.textContent = "Filename";
                        const filenameTd2 = document.createElement("td"), filename = yield this.generateFilename();
                        return filenameTd2.textContent = filename, filenameTr.appendChild(filenameTd1), 
                        filenameTr.appendChild(filenameTd2), galleryInfoTbody.appendChild(filenameTr), filename;
                    }));
                }
                setFilenameToDownloadLink(filename) {
                    console.log(filename), console.log(galleryinfo), galleryinfo && (galleryinfo.title = filename, 
                    galleryinfo.japanese_title = filename);
                }
                translateContents() {
                    this.buildFilenameElement().then((filename => {
                        this.translateTags(Array.from(this.artistsTags), this.artistsDictPromise), this.translateTags(Array.from(this.groupTags), this.groupDictPromise), 
                        this.translateTags(Array.from(this.seriesTags), this.seriesDictPromise), this.setFilenameToDownloadLink(filename);
                    }));
                }
                addRegistrationForm() {
                    const artistsParentTags = this.divContent.querySelectorAll("div.gallery > h2 li");
                    (0, dictRegistration_1.addRegistrationForms)(artistsParentTags, this.artistsDictPromise, "artists");
                    const seriesParentTags = Array.from(this.divContent.querySelectorAll("div.gallery > div.gallery-info > table tr")).filter((tr => {
                        var _a;
                        return "Series" === (null === (_a = tr.querySelector("td")) || void 0 === _a ? void 0 : _a.textContent);
                    }))[0].querySelectorAll("li");
                    (0, dictRegistration_1.addRegistrationForms)(seriesParentTags, this.seriesDictPromise, "series");
                    const groupsParentTags = Array.from(this.divContent.querySelectorAll("div.gallery > div.gallery-info > table tr")).filter((tr => {
                        var _a;
                        return "Group" === (null === (_a = tr.querySelector("td")) || void 0 === _a ? void 0 : _a.textContent);
                    }))[0].querySelectorAll("li");
                    (0, dictRegistration_1.addRegistrationForms)(groupsParentTags, this.groupDictPromise, "groups");
                }
            }
            exports.default = MainContentBox;
        },
        229: function(__unused_webpack_module, exports, __webpack_require__) {
            var __importDefault = this && this.__importDefault || function(mod) {
                return mod && mod.__esModule ? mod : {
                    default: mod
                };
            };
            Object.defineProperty(exports, "__esModule", {
                value: !0
            });
            const BaseContentBox_1 = __importDefault(__webpack_require__(311)), dataTranslation_1 = __webpack_require__(741);
            class RelatedGalleriesContentBox extends BaseContentBox_1.default {
                constructor(divContent, hideEnglishIfJapanese = !0) {
                    super(divContent, hideEnglishIfJapanese), this.divContent = divContent, this.hideEnglishIfJapanese = hideEnglishIfJapanese, 
                    this.relatedGalleryChildren = Array.from(this.divContent.querySelectorAll(":scope > div")).map((galleryContent => new RelatedGalleryContentBox(galleryContent))), 
                    this.artistsDictPromise = this.buildArtistsDictPromise(), this.seriesDictPromise = this.buildSeriesDictPromise();
                }
                buildArtistsDictPromise() {
                    const artistsList = this.relatedGalleryChildren.map((relatedGalleryChild => Array.from(relatedGalleryChild.artistsTags).map((artistTag => artistTag.textContent)))), artists = Array.from(new Set([].concat(...artistsList).filter((v => null !== v))));
                    return (0, dataTranslation_1.fetchTranslatedDataByWords)("artists", artists);
                }
                buildSeriesDictPromise() {
                    const seriesList = this.relatedGalleryChildren.map((relatedGalleryChild => Array.from(relatedGalleryChild.seriesTags).map((artistTag => artistTag.textContent)))), serieses = Array.from(new Set([].concat(...seriesList).filter((v => null !== v))));
                    return (0, dataTranslation_1.fetchTranslatedDataByWords)("series", serieses);
                }
                translateRelatedGalleries() {
                    this.relatedGalleryChildren.forEach((relatedGalleryChild => {
                        const artistsTagNodeList = this.relatedGalleryChildren.map((relatedGalleryChild => Array.from(relatedGalleryChild.artistsTags))), artistsTags = [].concat(...artistsTagNodeList);
                        relatedGalleryChild.translateTags(artistsTags, this.artistsDictPromise);
                        const seriesTagNodeList = this.relatedGalleryChildren.map((relatedGalleryChild => Array.from(relatedGalleryChild.seriesTags))), seriesTags = [].concat(...seriesTagNodeList);
                        relatedGalleryChild.translateTags(seriesTags, this.seriesDictPromise);
                    }));
                }
                hideGalleriesWithNgTag() {
                    const ngTags = GM_getValue("ngtags", {
                        ngtags: [ "scat", "guro", "yaoi" ]
                    }).ngtags, ngTagsWithSex = [].concat(...ngTags.map((ngTag => [ ngTag, `${ngTag} ♀`, `${ngTag} ♂` ])));
                    console.log(ngTagsWithSex), this.relatedGalleryChildren.forEach((relatedGallery => {
                        const relatedTags = Array.from(relatedGallery.relatedTags).map((a => a.textContent)).filter((v => null != v));
                        console.log(relatedTags), relatedTags.forEach((relatedTag => {
                            ngTagsWithSex.includes(relatedTag.toLowerCase()) && (console.log(relatedGallery.divBox), 
                            relatedGallery.divBox.style.cssText = "\n          display: none;\n          ");
                        }));
                    }));
                }
            }
            class RelatedGalleryContentBox extends BaseContentBox_1.default {
                constructor(divContent, hideEnglishIfJapanese = !0) {
                    super(divContent, hideEnglishIfJapanese), this.divContent = divContent, this.hideEnglishIfJapanese = hideEnglishIfJapanese, 
                    this.divBox = divContent, this.titleTag = this.divContent.querySelector("h1.lillie > a"), 
                    this.artistsTags = this.divContent.querySelectorAll("div.artist-list a"), this.seriesTags = Array.from(this.divContent.querySelectorAll("div.dj-content > table.dj-desc tr")).filter((tr => {
                        var _a;
                        return "Series" === (null === (_a = tr.querySelector("td")) || void 0 === _a ? void 0 : _a.textContent);
                    }))[0].querySelectorAll("a"), this.relatedTags = Array.from(this.divContent.querySelectorAll("div.dj-content > table.dj-desc tr")).filter((tr => {
                        var _a;
                        return "Tags" === (null === (_a = tr.querySelector("td")) || void 0 === _a ? void 0 : _a.textContent);
                    }))[0].querySelectorAll("a");
                }
            }
            exports.default = RelatedGalleriesContentBox;
        },
        776: (__unused_webpack_module, exports) => {
            Object.defineProperty(exports, "__esModule", {
                value: !0
            });
            exports.default = class {
                constructor(url) {
                    this.url = url;
                }
            };
        },
        772: function(__unused_webpack_module, exports, __webpack_require__) {
            var __importDefault = this && this.__importDefault || function(mod) {
                return mod && mod.__esModule ? mod : {
                    default: mod
                };
            };
            Object.defineProperty(exports, "__esModule", {
                value: !0
            });
            const BasePage_1 = __importDefault(__webpack_require__(776)), MainContentBox_1 = __importDefault(__webpack_require__(839)), RelatedGalleriesContentBox_1 = __importDefault(__webpack_require__(229));
            class DetailPage extends BasePage_1.default {
                constructor(url, hideEnglishIfJapanese = !0) {
                    super(url), this.url = url, this.hideEnglishIfJapanese = hideEnglishIfJapanese;
                    const divContent = document.querySelector("div.content");
                    if (!divContent) throw "div.content not found";
                    this.content = new MainContentBox_1.default(divContent), this.hideEnglishIfJapanese = hideEnglishIfJapanese;
                }
                translateRelatedGallery() {
                    const intervalId = setInterval((() => {
                        const galleryContent = document.querySelector("div.gallery-content");
                        if (!galleryContent || 0 === galleryContent.childElementCount) return;
                        clearInterval(intervalId);
                        new RelatedGalleriesContentBox_1.default(galleryContent).translateRelatedGalleries();
                    }), 100);
                }
                translateMainContents() {
                    this.content.translateContents();
                }
                addRegistrationForm() {
                    this.content.addRegistrationForm();
                }
            }
            DetailPage.pageTypes = [ "cg", "manga", "doujinshi" ], DetailPage.urlRegExp = new RegExp(`^https://hitomi.la/(${DetailPage.pageTypes.join("|")})/.+.html`), 
            exports.default = DetailPage;
        },
        647: function(__unused_webpack_module, exports, __webpack_require__) {
            var __importDefault = this && this.__importDefault || function(mod) {
                return mod && mod.__esModule ? mod : {
                    default: mod
                };
            };
            Object.defineProperty(exports, "__esModule", {
                value: !0
            });
            const BasePage_1 = __importDefault(__webpack_require__(776)), dataTranslation_1 = __webpack_require__(741);
            class IndexPage extends BasePage_1.default {
                constructor(url, hideEnglishIfJapanese = !0, delay = 1e3) {
                    super(url), this.url = url, this.hideEnglishIfJapanese = hideEnglishIfJapanese, 
                    this.delay = delay;
                    const urlMatch = this.url.match(IndexPage.urlRegExp);
                    if (!urlMatch) throw "url regexp not match (IndexPage)";
                    this.type = urlMatch[1], this.initial = urlMatch[2], this.hideEnglishIfJapanese = hideEnglishIfJapanese;
                }
                translateIndex() {
                    const intervalId = setInterval((() => {
                        const items = document.querySelectorAll("div.content > ul.posts li a");
                        if (!items) return;
                        clearInterval(intervalId);
                        const initial = "123" === this.initial ? "0" : this.initial;
                        (0, dataTranslation_1.fetchTranslatedDataByInitial)(`${this.type}`, initial).then((translateDict => {
                            translateDict && Array.prototype.forEach.call(items, (item => {
                                const itemEn = item.textContent.toLowerCase(), itemJa = JSON.parse(translateDict)[itemEn];
                                if (itemJa) {
                                    const newItem = this.hideEnglishIfJapanese ? itemJa : `${itemJa} (${itemEn})`;
                                    item.textContent = newItem;
                                }
                            }));
                        }));
                    }), 100);
                }
            }
            IndexPage.urlRegExp = new RegExp("^https://hitomi.la/all(artists|series|groups)-(.+).html"), 
            exports.default = IndexPage;
        },
        704: function(__unused_webpack_module, exports, __webpack_require__) {
            var __importDefault = this && this.__importDefault || function(mod) {
                return mod && mod.__esModule ? mod : {
                    default: mod
                };
            };
            Object.defineProperty(exports, "__esModule", {
                value: !0
            });
            const BasePage_1 = __importDefault(__webpack_require__(776));
            class ListAllPage extends BasePage_1.default {
                constructor(url) {
                    super(url), this.url = url;
                }
                redirectToJapanesePage() {
                    if (this.url.match(/-japanese.html$/)) return;
                    const japaneseUrl = this.url.replace("-all.html", "-japanese.html");
                    location.href = japaneseUrl;
                }
            }
            ListAllPage.pageTypes = [ "series", "artist", "character", "group", "type", "tag" ], 
            ListAllPage.urlRegExp = new RegExp(`^https://hitomi.la/(${ListAllPage.pageTypes.join("|")})/.+-all.html`), 
            exports.default = ListAllPage;
        },
        728: function(__unused_webpack_module, exports, __webpack_require__) {
            var __importDefault = this && this.__importDefault || function(mod) {
                return mod && mod.__esModule ? mod : {
                    default: mod
                };
            };
            Object.defineProperty(exports, "__esModule", {
                value: !0
            });
            const BasePage_1 = __importDefault(__webpack_require__(776)), RelatedGalleriesContentBox_1 = __importDefault(__webpack_require__(229));
            class ListJaPage extends BasePage_1.default {
                constructor(url, hideEnglishIfJapanese = !0) {
                    super(url), this.url = url, this.hideEnglishIfJapanese = hideEnglishIfJapanese;
                    const urlMatch = this.url.match(ListJaPage.urlRegExp);
                    if (!urlMatch) throw "url not match (ListJaPage)";
                    this.type = urlMatch[1], this.initial = urlMatch[2], this.hideEnglishIfJapanese = hideEnglishIfJapanese;
                }
                translateRelatedGallery() {
                    const intervalId = setInterval((() => {
                        const galleryContent = document.querySelector("div.gallery-content");
                        if (!galleryContent || 0 === galleryContent.childElementCount) return;
                        clearInterval(intervalId);
                        const related = new RelatedGalleriesContentBox_1.default(galleryContent);
                        related.translateRelatedGalleries(), related.hideGalleriesWithNgTag();
                    }), 100);
                }
            }
            ListJaPage.pageTypes = [ "series", "artist", "character", "group", "type", "tag" ], 
            ListJaPage.urlRegExp = new RegExp(`^https://hitomi.la/(${ListJaPage.pageTypes.join("|")})/.+-japanese.html`), 
            exports.default = ListJaPage;
        },
        501: function(__unused_webpack_module, exports, __webpack_require__) {
            var __importDefault = this && this.__importDefault || function(mod) {
                return mod && mod.__esModule ? mod : {
                    default: mod
                };
            };
            Object.defineProperty(exports, "__esModule", {
                value: !0
            });
            const BasePage_1 = __importDefault(__webpack_require__(776)), RelatedGalleriesContentBox_1 = __importDefault(__webpack_require__(229));
            class RecentlyAddedPage extends BasePage_1.default {
                constructor(url, hideEnglishIfJapanese = !0) {
                    super(url), this.url = url, this.hideEnglishIfJapanese = hideEnglishIfJapanese;
                    const urlMatch = this.url.match(RecentlyAddedPage.urlRegExp);
                    if (!urlMatch) throw "url not match (RecentlyAddedPage)";
                    this.type = urlMatch[1], this.initial = urlMatch[2], this.hideEnglishIfJapanese = hideEnglishIfJapanese;
                }
                translateRelatedGallery() {
                    const intervalId = setInterval((() => {
                        const galleryContent = document.querySelector("div.gallery-content");
                        if (!galleryContent || 0 === galleryContent.childElementCount) return;
                        clearInterval(intervalId);
                        const related = new RelatedGalleriesContentBox_1.default(galleryContent);
                        related.translateRelatedGalleries(), related.hideGalleriesWithNgTag();
                    }), 100);
                }
            }
            RecentlyAddedPage.urlRegExp = new RegExp("^https://hitomi.la(/$|/\\?page=\\d$|/index-japanese.html)"), 
            exports.default = RecentlyAddedPage;
        },
        173: function(__unused_webpack_module, exports, __webpack_require__) {
            var __importDefault = this && this.__importDefault || function(mod) {
                return mod && mod.__esModule ? mod : {
                    default: mod
                };
            };
            Object.defineProperty(exports, "__esModule", {
                value: !0
            });
            const BasePage_1 = __importDefault(__webpack_require__(776)), RelatedGalleriesContentBox_1 = __importDefault(__webpack_require__(229));
            class SearchPage extends BasePage_1.default {
                constructor(url, hideEnglishIfJapanese = !0) {
                    super(url), this.url = url, this.hideEnglishIfJapanese = hideEnglishIfJapanese;
                    const urlMatch = this.url.match(SearchPage.urlRegExp);
                    if (!urlMatch) throw "url not match (SearchPage)";
                    this.type = urlMatch[1], this.initial = urlMatch[2], this.hideEnglishIfJapanese = hideEnglishIfJapanese;
                }
                translateRelatedGallery() {
                    const intervalId = setInterval((() => {
                        const galleryContent = document.querySelector("div.gallery-content");
                        if (!galleryContent || 0 === galleryContent.childElementCount) return;
                        clearInterval(intervalId);
                        const related = new RelatedGalleriesContentBox_1.default(galleryContent);
                        related.translateRelatedGalleries(), related.hideGalleriesWithNgTag();
                    }), 100);
                }
            }
            SearchPage.urlRegExp = new RegExp("^https://hitomi.la/search.html?"), exports.default = SearchPage;
        },
        741: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.fetchTranslatedDataByWords = exports.fetchTranslatedDataByInitial = void 0;
            const config_1 = __webpack_require__(165), fetchTranslatedData = data => {
                if (!data) return Promise.resolve("{}");
                if (data.table_name && data.initial) {
                    const cache_key = `${data.table_name}_${data.initial}`;
                    if (sessionStorage.getItem(cache_key)) {
                        const responseText = sessionStorage.getItem(cache_key);
                        if (!responseText) throw "responseText is null";
                        return console.log(`get session storage: ${cache_key}`), Promise.resolve(responseText);
                    }
                }
                return console.log(JSON.stringify(data.words)), console.log(`${config_1.translateApiUrl}${data.table_name}/batch/fetch`), 
                new Promise(((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: `${config_1.translateApiUrl}${data.table_name}/batch/fetch`,
                        data: JSON.stringify(data.words),
                        headers: {
                            "Content-Type": "application/json"
                        },
                        onload: function(response) {
                            if (data.initial) {
                                const cache_key = `${data.table_name}_${data.initial}`;
                                console.log(`set session storage: ${cache_key}`), sessionStorage.setItem(cache_key, response.responseText);
                            }
                            resolve(response.responseText);
                        }
                    });
                }));
            };
            exports.fetchTranslatedDataByInitial = (table, initial) => {
                if (!initial) return Promise.resolve("{}");
                return fetchTranslatedData({
                    table_name: table,
                    initial
                });
            };
            exports.fetchTranslatedDataByWords = (table, words) => {
                if (!words) return Promise.resolve("{}");
                const filteredWords = words.filter((v => null !== v));
                if (0 === filteredWords.length) return Promise.resolve("{}");
                return fetchTranslatedData({
                    table_name: table,
                    words: filteredWords
                });
            };
        },
        245: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.addRegistrationForms = void 0;
            const config_1 = __webpack_require__(165), tableTypeI18n = {
                artists: "作家名",
                series: "作品名",
                groups: "サークル名"
            }, excludedList = [ "original" ];
            exports.addRegistrationForms = (parentTags, dictPromise, tableType) => {
                dictPromise.then((dictString => {
                    const translatedKeyValues = JSON.parse(dictString);
                    Array.from(parentTags).forEach((parentTag => {
                        const aTag = parentTag.querySelector("a"), englishName = null == aTag ? void 0 : aTag.innerText.toLocaleLowerCase();
                        if (englishName && !excludedList.includes(englishName)) {
                            const japaneseName = translatedKeyValues[englishName];
                            addRegistrationButton(parentTag), createModalWindow(parentTag, tableType, englishName, japaneseName);
                        }
                    }));
                }));
            };
            const registerNewDict = e => {
                var _a, _b, _c;
                if (!e) return;
                const dictForm = e.target.form, tableType = null === (_a = null == dictForm ? void 0 : dictForm.querySelector("input.table-type")) || void 0 === _a ? void 0 : _a.value, englishName = null === (_b = null == dictForm ? void 0 : dictForm.querySelector("input.english-name")) || void 0 === _b ? void 0 : _b.value, japaneseName = null === (_c = null == dictForm ? void 0 : dictForm.querySelector("input.japanese-name")) || void 0 === _c ? void 0 : _c.value;
                if (console.log(tableType), console.log(englishName), console.log(japaneseName), 
                !tableType || !englishName || !japaneseName) return;
                const submitButton = null == dictForm ? void 0 : dictForm.querySelector("input.register-button");
                submitButton.disabled = !0, submitButton.value = "辞書登録中です";
                const data = {
                    englishName,
                    japaneseName
                };
                console.log(data), GM_xmlhttpRequest({
                    method: "POST",
                    url: `${config_1.insertApiUrl}${tableType}`,
                    data: JSON.stringify(data),
                    headers: {
                        "Content-Type": "application/json"
                    },
                    onload: response => {
                        location.reload();
                    }
                });
            }, addRegistrationButton = parentTag => {
                const openModalTag = document.createElement("a");
                openModalTag.setAttribute("href", "#"), openModalTag.addEventListener("click", openModalWindow), 
                openModalTag.innerText = "[辞書登録]", openModalTag.style.cssText = "\n  font-size: small;\n  margin-left: 0.25em;\n  ", 
                parentTag.appendChild(openModalTag);
            }, createModalWindow = (parentTag, tableType, englishName, japaneseName) => {
                const modalDiv = document.createElement("div");
                modalDiv.setAttribute("class", "modal"), modalDiv.addEventListener("click", closeModalWindow), 
                modalDiv.style.cssText = "\n  display: none;\n  position: fixed;\n  z-index: 1;\n  left: 0;\n  top: 0;\n  height: 100%;\n  width: 100%;\n  overflow: auto;\n  background-color: rgba(0,0,0,0.5);\n  text-align: center;\n  ";
                const modalContentDiv = document.createElement("div");
                modalContentDiv.setAttribute("class", "modal-content"), modalContentDiv.style.cssText = "\n  background-color: white;\n  position: fixed;\n  top: 50%;\n  border-radius: 10px;\n  max-width: 600px;\n  transform: translate(-50%, -50%);\n  left: 50%;\n  padding: 20px 30px;\n  ";
                const modalBodyDiv = document.createElement("div");
                modalBodyDiv.setAttribute("class", "modal-body");
                const header = document.createElement("div"), tableTypeJa = tableTypeI18n[tableType], englishNameAnchor = document.createElement("a"), englishNameForSearch = englishName.replace(/\s+/g, "+");
                englishNameAnchor.setAttribute("href", `https://www.google.com/search?q=${englishNameForSearch}`), 
                englishNameAnchor.setAttribute("target", "_blank"), englishNameAnchor.setAttribute("rel", "noopener norefferer"), 
                englishNameAnchor.innerText = englishName, console.log(englishNameAnchor), header.innerHTML = `${tableTypeJa}「${englishNameAnchor.outerHTML}」を辞書登録する`, 
                header.style.cssText = "\n  font-size: medium;\n  ";
                const formTag = document.createElement("form"), hiddenTableType = document.createElement("input");
                hiddenTableType.setAttribute("type", "hidden"), hiddenTableType.setAttribute("class", "table-type"), 
                hiddenTableType.setAttribute("value", tableType);
                const hiddenEnglishName = document.createElement("input");
                hiddenEnglishName.setAttribute("type", "hidden"), hiddenEnglishName.setAttribute("class", "english-name"), 
                hiddenEnglishName.setAttribute("value", englishName);
                const japaneseNameInput = document.createElement("input");
                japaneseNameInput.setAttribute("type", "text"), japaneseNameInput.setAttribute("class", "japanese-name"), 
                japaneseNameInput.setAttribute("value", japaneseName || ""), japaneseNameInput.style.cssText = "\n  width: 100%;\n  padding: 12px 8px;\n  margin: 10px 0;\n  box-sizing: border-box;\n  ";
                const submitButton = document.createElement("input");
                submitButton.setAttribute("type", "button"), submitButton.setAttribute("class", "register-button"), 
                submitButton.addEventListener("click", registerNewDict), submitButton.setAttribute("value", "辞書登録"), 
                formTag.appendChild(hiddenTableType), formTag.appendChild(hiddenEnglishName), formTag.appendChild(japaneseNameInput), 
                formTag.appendChild(submitButton), modalBodyDiv.appendChild(header), modalBodyDiv.appendChild(formTag), 
                modalContentDiv.appendChild(modalBodyDiv), modalDiv.appendChild(modalContentDiv), 
                parentTag.appendChild(modalDiv);
            }, openModalWindow = e => {
                const modal = e.target.nextElementSibling;
                modal && (modal.style.display = "block");
            }, closeModalWindow = e => {
                const target = e.target;
                if ("modal" === target.className || "clear-button" === target.className) {
                    const modal = target.closest(".modal");
                    modal && (modal.style.display = "none");
                }
            };
        }
    }, __webpack_module_cache__ = {};
    (function __webpack_require__(moduleId) {
        var cachedModule = __webpack_module_cache__[moduleId];
        if (void 0 !== cachedModule) return cachedModule.exports;
        var module = __webpack_module_cache__[moduleId] = {
            exports: {}
        };
        return __webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__), 
        module.exports;
    })(156);
})();