// ==UserScript==
// @name         Ex隱藏搜尋
// @namespace    https://sleazyfork.org/en/users/285675-hauffen
// @version      1.21.25
// @description  Resurrect E/Ex gallery listings
// @author       Hauffen
// @license      MIT
// @runat        document-start
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @include      /https?:\/\/(e-|ex)hentai\.org\/.*/
// @downloadURL https://update.greasyfork.org/scripts/518220/Ex%E9%9A%B1%E8%97%8F%E6%90%9C%E5%B0%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/518220/Ex%E9%9A%B1%E8%97%8F%E6%90%9C%E5%B0%8B.meta.js
// ==/UserScript==

(function() {
    let $ = window.jQuery;
    var spl = document.URL.split('/');
	var dead, claim, language, translated;
    const category = {doujinshi: 'ct2', manga: 'ct3', artistcg: 'ct4', gamecg: 'ct5', western: 'cta', nonh: 'ct9', imageset: 'ct6', cosplay: 'ct7', asianporn: 'ct8', misc: 'ct1'};
    const fileSizeLabels = [ "B", "KB", "MB", "GB" ];
    const defaultNamespace = "misc";
    const tags = {};

    if (spl[3] != 'g') return;

    function gotonext() {};
        // Override the default function to prevent redirect

   addJS_Node (gotonext); // Inject the override function before doing anything to avoid the timeout redirect

    function addJS_Node(text, s_URL, funcToRun, runOnLoad) {
        var scriptNode = document.createElement('script');
        if (runOnLoad) {
            scriptNode.addEventListener("load", runOnLoad, false);
        }
        scriptNode.type = "text/javascript";
        if (text) scriptNode.textContent = text;
        if (s_URL) scriptNode.src = s_URL;
        if (funcToRun) scriptNode.textContent = '(' + funcToRun.toString() + ')()';

        var targ = document.getElementsByTagName('head')[0] || document.body || document.documentElement;
        targ.appendChild(scriptNode);
    }

    // There's a better critera for this probably
    if ($('.d').length && !spl[3].match('upload')) {
        dead = true;
        if ($('.d').text().indexOf("copyright") > 0) claim = $('.d').text().split('by')[1].split('.')[0].trim();
        $('.d').remove(); // Leave us with an entirely blank page to build up
    }
    generateRequest();

    /**
     * Generate the JSON request for the E-H API
     */
    function generateRequest() {
        var reqList = [[spl[4], spl[5]]]; // We use an array for our gidlist, since the API can handle up to 25 galleries per request
        var request = {"method": "gdata", "gidlist": reqList, "namespace": 1};

        var req = new XMLHttpRequest();
        req.onreadystatechange = e => {
            if (req.readyState == 4) {
				if (req.status == 200) {
					var apirsp = JSON.parse(req.responseText);
					for (var i = 0; i < apirsp.gmetadata.length; i++) {
                        if (dead) generateListing(apirsp.gmetadata[i]);
                        else generateLiveListing(apirsp.gmetadata[i]);
                    }
				} else {
					console.error();
				}
			}
        }
        req.open("POST", document.location.origin + "/api.php", true); // Due to CORS, we need to use the API on the same domain as the script
        req.send(JSON.stringify(request));
    }

    function generateListing(glisting) {
        var d = new Date(glisting.posted * 1000);
        document.title = glisting.title;
        generateTags(glisting);
        // There's a better way to do this, but I suck
        var listing = $(`
        <div id="nb" class="nose1">
            <div><a href="` + document.location.origin + `">Front<span class="nbw1"> Page</span></a></div>
            <div><a href="` + document.location.origin + `/watched">Watched</a></div>
            <div><a href="` + document.location.origin + `/popular">Popular</a></div>
            <div><a href="` + document.location.origin + `/torrents.php">Torrents</a></div>
            <div><a href="` + document.location.origin + `/favorites.php">Fav<span class="nbw1">orite</span>s</a></div>
            <div><a href="` + document.location.origin + `/uconfig.php">Settings</a></div>
            <div><a href="` + document.location.origin + `/upload/manage.php"><span class="nbw2">My </span>Uploads</a></div>
            <div><a href="` + document.location.origin + `/mytags">My Tags</a></div>
        </div>
        <div class="gm">
            <div id="gleft">
                <div id="gd1">
                    <div style="width:250px; height:300px; background:transparent url(` + glisting.thumb + `) 0 0 no-repeat"></div>
                </div>
            </div>
            <div id="gd2">
                <h1 id="gn">` + glisting.title + `</h1>
                <h1 id="gj">` + glisting.title_jpn + `</h1>
            </div>
            <div id="gmid">
                <div id="gd3">
                    <div id="gdc">
                        <div class="cs ` + category[glisting.category.toLowerCase().replace(/ /g, '').replace(/-/g, '')] + `" onclick="document.location='` + document.location.origin + '/' + glisting.category.toLowerCase().replace(/ /g, '') + `'">` + glisting.category + `</div>
                    </div>
                    <div id="gdn">
                        <a href="` + document.location.origin + '/uploader/' + glisting.uploader + '">' + glisting.uploader + `</a>
                    </div>
                    <div id="gdd">
                        <table>
                            <tbody>
                                <tr><td class="gdt1">Posted:</td><td class="gdt2">` + d.getUTCFullYear().toString() + '-' + (d.getUTCMonth() + 1).toString().padStart(2, '0') + '-' + d.getUTCDate().toString().padStart(2, '0') + ' ' + d.getUTCHours().toString().padStart(2, '0') + ':' + d.getUTCMinutes().toString().padStart(2, '0') + `</td></tr>
                                <tr><td class="gdt1">Visible:</td><td class="gdt2">` + (glisting.expunged ? 'No' : 'Yes') + `</td></tr>
                                <tr><td class="gdt1">Language:</td><td class="gdt2">` + (translated ? language + `&nbsp <span class="halp" title="This gallery has been translated from the original language text.">TR</span>` : language) + `</td></tr>
                                <tr><td class="gdt1">File Size:</td><td class="gdt2">` + getPrettyFileSize(glisting.filesize) + `</td></tr>
                                <tr><td class="gdt1">Length:</td><td class="gdt2">` + glisting.filecount + ` pages</td></tr>
                                <tr><td class="gdt1">Removal:</td><td class="gdt2">` + claim + `</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div id="gdr">
                        <table>
                            <tbody>
                                <tr>
                                    <td class="grt1">Rating:</td>
                                    <td class="grt2">
                                        <div id="rating_image" class="ir" style="background-position:` + getStarNumber(glisting.rating, true) + `"></div>
                                    </td>
                                </tr>
                                <tr><td id="rating_label" colspan="2">Average: ` + glisting.rating + `</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div id="gdf">
                        <div style="float:left; cursor:pointer;" id="fav"></div>
                        &nbsp;
                        <a id="favoritelink" href="#" onclick="window.open('` + document.location.origin + '/gallerypopups.php?gid=' + glisting.gid + '&t=' + glisting.token + `&act=addfav','Add to Favorites','width=675,height=415')">
                            <img src="` + (window.location.hostname.indexOf("exhentai") >= 0 ? "https://exhentai.org/img/mr.gif" : "https://ehgt.org/g/mr.gif") + `" />
                            Add to Favorites
                        </a>
                    </div>
                </div>
                <div id="gd4">
                    <div id="taglist">
                    </div>
                </div>
                <div id="gd5">
                    <p class="g3 gsp">
                        <img src="` + (window.location.hostname.indexOf("exhentai") >= 0 ? "https://exhentai.org/img/mr.gif" : "https://ehgt.org/g/mr.gif") + `" />
                        <a href="">Gallery Unavailable</a>
                    </p>
                    <p class="g2 gsp">
                        <img src="` + (window.location.hostname.indexOf("exhentai") >= 0 ? "https://exhentai.org/img/mr.gif" : "https://ehgt.org/g/mr.gif") + `" />
                        <a id="dl_eze" href="#">EZE JSON</a>
                    </p>
                    <p class="g2">
                        <img src="` + (window.location.hostname.indexOf("exhentai") >= 0 ? "https://exhentai.org/img/mr.gif" : "https://ehgt.org/g/mr.gif") + `" />
                        <a id="dl_ehdl">E-HDL JSON</a>
                    </p>
                    <p class="g2">
                        <img src="` + (window.location.hostname.indexOf("exhentai") >= 0 ? "https://exhentai.org/img/mr.gif" : "https://ehgt.org/g/mr.gif") + `" />
                        <a id="dl_gdl">Gallery-DL JSON</a>
                    </p>
                </div>
                <div class="c"></div>
            </div>
            <div class="c"></div>
        </div>
        `);
        $('body').append(listing);
        // Generate taglist table
        var taglist = "<table><tbody>";
        for (const namespace in tags) {
            taglist += `<tr><td class="tc">${namespace}:</td><td>`;
            for (var i = 0; i < tags[namespace].length; i++) {
                taglist += `<div id="td_${namespace}:${tags[namespace][i]}" class="gt" style="opacity:1.0"><a id="ta_${namespace}:${tags[namespace][i]}" href="${document.location.origin}/tag/${namespace}:${tags[namespace][i]}">${tags[namespace][i]}</a></div>`;
            }
            taglist += "</td></tr>";
        }
        taglist += "</tbody></table>";
        $('#taglist').append(taglist);
        // I want to make these smaller, but the 'this' call prevents me from doing so
        $('#dl_eze').on('click', function() {
            var json = JSON.stringify(toEze(glisting), null, "  "),
                blob = new Blob([json], {type: "octet/stream"}),
                url = window.URL.createObjectURL(blob);
            this.href = url;
            this.target = '_blank';
            this.download = 'info.json';
        });
        $('#dl_ehdl').on('click', function() {
            var blob = new Blob([toEhDl(glisting)], {type: "text/plain"}),
                url = window.URL.createObjectURL(blob);
            this.href = url;
            this.target = '_blank';
            this.download = 'info.json';
        });
        $('#dl_gdl').on('click', function() {
            var json = JSON.stringify(toGalleryDl(glisting), null, "  "),
                blob = new Blob([json], {type: "octet/stream"}),
                url = window.URL.createObjectURL(blob);
            this.href = url;
            this.target = '_blank';
            this.download = 'info.json';
        });
        // Try to generate torrent links
        if (glisting.torrentcount > 0) {
            $(`<div id="torrents" style="border-top:1px solid #000; padding: 10px 10px 5px 10px;"><p><span class="halp" title="If the torrent link doesn't work, try the magnet link">Possible Torrents:</span></p></div>`).appendTo('.gm');
            for (var j = 0; j < glisting.torrentcount; j++) {
                $(`<div><img src="` + (window.location.hostname.indexOf("exhentai") >= 0 ? "https://exhentai.org/img/mr.gif" : "https://ehgt.org/g/mr.gif") + `" /><a style="padding-left:3px;margin-right:1.5px;" href="` + generateTorrentLink(glisting, j) + `">` + glisting.torrents[j].name + `</a>&#9;` + getPrettyFileSize(glisting.torrents[j].fsize) + `<span style="float:right">Added ` + getTimestampDateString(glisting.torrents[j].added * 1000) + `</span><p style="margin-left:8px"><a href="magnet:?xt=urn:btih:` + glisting.torrents[j].hash + `">Magnet Link</a></p>`).appendTo('#torrents');
            }
        }
        generateSearchLink(glisting);
    }

    function generateLiveListing(glisting) {
        generateTags(glisting);
        var listing = $(`
            <p class="g2">
                <img src="` + (window.location.hostname.indexOf("exhentai") >= 0 ? "https://exhentai.org/img/mr.gif" : "https://ehgt.org/g/mr.gif") + `" />
                <a id="dl_eze" href="#">EZE</a> / <a id="dl_ehdl" href="#">E-HDL</a> / <a id="dl_gdl" href="#">G-DL</a>
            </p>`);
        $('#gd5').append(listing);
        $('#gmid').css('height', 'unset');
        $('#dl_eze').on('click', function() {
            var json = JSON.stringify(toEze(glisting), null, "  "),
                blob = new Blob([json], {type: "octet/stream"}),
                url = window.URL.createObjectURL(blob);
            this.href = url;
            this.target = '_blank';
            this.download = 'info.json';
        });
        $('#dl_ehdl').on('click', function() {
            var blob = new Blob([toEhDl(glisting)], {type: "text/plain"}),
                url = window.URL.createObjectURL(blob);
            this.href = url;
            this.target = '_blank';
            this.download = 'info.json';
        });
        $('#dl_gdl').on('click', function() {
            var json = JSON.stringify(toGalleryDl(glisting), null, "  "),
                blob = new Blob([json], {type: "octet/stream"}),
                url = window.URL.createObjectURL(blob);
            this.href = url;
            this.target = '_blank';
            this.download = 'info.json';
        });
        generateSearchLink(glisting);
    }

    function generateSearchLink(glisting) {
        var menu = $(`
        <div id="menu">
            <button class="menuControl">自訂搜尋</button>
            <div class="menuContent">
                <a href='/?f_cats=0&f_sname=1&f_search="` + encodeURIComponent(getShortTitle(glisting.title)) + `"' rel="noreferrer" target="_blank">按名稱搜尋</a>
                <a href='/?f_cats=0&f_sname=1&f_search="` + encodeURIComponent(glisting.title) + `"' rel="noreferrer" target="_blank">自訂搜尋</a>
                <a href='https://nhentai.net/search/?q="` + encodeURIComponent(getShortTitle(glisting.title)) + `"' rel="noreferrer" target="_blank">按名稱搜尋 (nhentai.net)</a>
                <a href='https://nhentai.net/search/?q="` + encodeURIComponent(glisting.title) + `"' rel="noreferrer" target="_blank">自訂搜尋 (nhentai.net)</a>
                <a href="https://hitomi.la/search.html?` + encodeURIComponent(getShortTitle(glisting.title)) + `" rel="noreferrer" target="_blank">按名稱搜尋 (hitomi.la)</a>
                <a href="https://panda.chaika.moe/search/?qsearch=` + encodeURIComponent(getShortTitle(glisting.title)) + `" rel="noreferrer" target="_blank">按名稱搜尋 (chaika)</a>
                <a href="https://panda.chaika.moe/search/?qsearch=` + encodeURIComponent(glisting.title) + `" rel="noreferrer" target="_blank">自訂搜尋 (chaika)</a>
                <a href="https://panda.chaika.moe/search/?qsearch=` + encodeURIComponent(getGalleryUrl(glisting)) + `" rel="noreferrer" target="_blank">搜尋 URL (chaika)</a>
                <a href="https://www.dlsite.com/maniax/fsr/=/language/jp/sex_category%5B0%5D/male/keyword/` + encodeURIComponent(getShortTitle(glisting.title_jpn)) + `" rel="noreferrer" target="_blank">按 JP 頭銜搜尋 (DLsite)</a>
            </div>
        </div>`);
        $('.gm').first().append(menu);
        $(document).click(e => {
			if (e.target.className != 'menuControl') {
                $('div.menuContent').css("display", "none");
            }
		});
        $('.menuControl').click(e => {
            $('div.menuContent').css("display", "flex");
        });
    }

    function generateTorrentLink(glisting, index) {
        if (window.location.hostname.indexOf("exhentai") > 0) return window.location.origin + "/torrent/" + glisting.gid + "/" + glisting.torrents[index].hash + ".torrent";
        else return "https://ehtracker.org/get/" + glisting.gid + "/" + glisting.torrents[index].hash + ".torrent";
    }

	function generateTags(glisting) {
		if (Array.isArray(glisting.tags)) {
		    for (const jsonTag of glisting.tags) {
			    const stringTag = getJsonString(jsonTag);
			    if (stringTag === null) { continue; }

			    const {tag, namespace} = getTagAndNamespace(stringTag);

			    let namespaceTags;
			    if (tags.hasOwnProperty(namespace)) {
				    namespaceTags = tags[namespace];
			    } else {
				    namespaceTags = [];
				    tags[namespace] = namespaceTags;
			    }

			    namespaceTags.push(tag);
		    }
	    }

	    // Tag-based info
	    if (tags.hasOwnProperty("language")) {
		    const languageTags = tags.language;
		    const translatedIndex = languageTags.indexOf("translated");
		    translated = (translatedIndex >= 0);
		    if (translatedIndex !== 0) {
			    language = toProperCase(languageTags[0]);
		    }
	    } else {
		    language = "Japanese";
		    translated = false;
	    }
	}

    function toEhDl(info) { // EH-DL
        var d = new Date(info.posted * 1000);
        var d2 = new Date();
        var output = info.title + "\r\n" + info.title_jpn + "\r\n" + document.URL + "\r\n\r\nCategory: " + info.category + "\r\nUploader: " + info.uploader + "\r\nPosted: " + d.getUTCFullYear().toString() + '-' + (d.getUTCMonth() + 1).toString().padStart(2, '0') + '-' + d.getUTCDate().toString().padStart(2, '0') + ' ' + d.getUTCHours().toString().padStart(2, '0') + ':' + d.getUTCMinutes().toString().padStart(2, '0') +
            "\r\nParent: " + (spl[3] == 'g' ? $('.gdt2 > a').text() : "None" ) + "\r\nVisible: " + (info.expunged ? 'No' : 'Yes') + "\r\nLanguage: " + language + "\r\nFile Size: " + getPrettyFileSize(info.filesize) + "\r\nLength: " + info.filecount + " pages\r\nFavorited: " + (spl[3] == 'g' ? $('#rating_count').text() : "Null" ) + "\r\nRating: " + info.rating + "\r\n\r\nTags:\r\n";
        for (const namespace in tags) {
            output += `> ${namespace}: `;
            for (var i = 0; i < tags[namespace].length; i++) {
                output += `${tags[namespace][i]}`;
                if (i < tags[namespace].length - 1) output += ", ";
            }
            output += "\r\n";
        }
        output += `\r\n\r\n\r\nDownloaded on ${d2.toUTCString()}`;
        return output;
    }

    function toEze(info) { // EZE
	    const date = new Date(toNumberOrDefault(info.posted * 1000, 0));
	    return {
			gallery_info: {
				title: toStringOrDefault(info.title, ""),
				title_original: toStringOrDefault(info.title_jpn, ""),
				uploader: toStringOrDefault(info.uploader, ""),
				filecount: toNumberOrDefault(info.filecount, 0),
				category: toStringOrDefault(info.category, ""),
				tags: tagsToCommonJson(tags),

				language: toStringOrDefault(language, ""),
				translated: !!translated,

				upload_date: [
					date.getUTCFullYear(),
					date.getUTCMonth() + 1,
					date.getUTCDate(),
					date.getUTCHours(),
					date.getUTCMinutes(),
					date.getUTCSeconds()
				],

				source: {
					site: toStringOrDefault(document.location.host.substr(0, document.location.host.length - 4), ""),
					gid: (info.identifier !== null ? toNumberOrDefault(info.gid, 0) : 0),
					token: (info.identifier !== null ? toStringOrDefault(info.token, 0) : 0),
					parent_gallery: toParentOrDefault(),
					newer_version: []
				}
            }
	    };
    }

    function toGalleryDl(info) { // Gallery-DL
	    const date = new Date(toNumberOrDefault(info.posted * 1000, 0));
	    return {
            category: toStringOrDefault(document.location.host.substr(0, document.location.host.length - 4), ""),
            cost: null,
            count: info.filecount,
		    date: toStringOrDefault(getTimestampDateString(date), ""),
            extension: null,
            filename: null,
		    gallery_id: toNumberOrDefault(info.gid, 0),
            gallery_size: toNumberOrDefault(info.filesize, 0),
            gallery_token: toStringOrDefault(info.token, 0),
            height: null,
            image_token: null,
            lang: null,
            language: toStringOrDefault(language, ""),
            num: 1,
            parent: toParentOrDefault(),
            size: toNumberOrDefault(info.filesize, 0),
		    subcategory: 'gallery',
		    tags: info.tags,
            title: toStringOrDefault(info.title, ""),
		    title_jp: toStringOrDefault(info.title_jpn, ""),
            uploader: toStringOrDefault(info.uploader, ""),
		    visible: info.expunged ? 'No' : 'Yes',
            width: null
	    };
    }

	/**
     * Convert the star count of a specified element to a double
	 * @param {Object} el - A specific element within the DOM, or a double
     * @param {Boolean} transpose - Whether we're converting background position to double, or double to background position
	 */
    function getStarNumber(el, transpose) {
		var starCount = {5: '0px -1px', 4.5: '0px -21px', 4: '-16px -1px', 3.5: '-16px -21px', 3: '-32px -1px', 2.5: '-32px -21px', 2: '-48px -1px', 1.5: '-48px -21px', 1: '-64px -1px', 0.5: '-64px -21px'};
		if (!transpose) {
			var stars = $(el).find('.ir').css('background-position');
			return Object.keys(starCount).find(key => starCount[key] === stars);
		} else return starCount[(Math.round(el * 2) / 2).toFixed(1)]; // Ratings are given in x.xx numbers, but we need either whole integers, or half integers
    }

    /** ------ Helper functions cannibalized from the dnsev's script ------ */
    function getTagAndNamespace(tag) {
	const pattern = /^(?:([^:]*):)?([\w\W]*)$/;
	const match = pattern.exec(tag);
	return (match !== null) ?
		({ tag: match[2], namespace: match[1] || defaultNamespace }) :
		({ tag: tag, namespace: defaultNamespace });
    }

    function getJsonString(value) {
	    if (typeof(value) === "string") { return value; }
	    if (typeof(value) === "undefined" || value === null) { return value; }
	    return `${value}`;
    }

    function toProperCase(text) {
	    return text.replace(/(^|\W)(\w)/g, (m0, m1, m2) => `${m1}${m2.toUpperCase()}`);
    }

    function getPrettyFileSize(bytes) {
	    const ii = fileSizeLabels.length - 1;
	    let i = 0;
	    while (i < ii && bytes >= 1024) {
		    bytes /= 1024;
		    ++i;
	    }
	    return `${bytes.toFixed(i === 0 ? 0 : 2)} ${fileSizeLabels[i]}`;
    }

    function getTimestampDateString(timestamp) {
	    const date = new Date(timestamp);
	    const year = date.getUTCFullYear().toString();
	    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
	    const day = date.getUTCDate().toString().padStart(2, "0");
	    const hour = date.getUTCHours().toString().padStart(2, "0");
	    const minute = date.getUTCMinutes().toString().padStart(2, "0");
        const seconds = date.getUTCSeconds().toString().padStart(2, "0");
	    return `${year}-${month}-${day} ${hour}:${minute}:${seconds}`;
    }

    function toStringOrDefault(value, defaultValue) {
	    return typeof(value) === "string" ? value : defaultValue;
    }

    function toNumberOrDefault(value, defaultValue) {
	    return Number.isNaN(value) ? defaultValue : value;
    }

	function toParentOrDefault() {
		if (dead) return null;
		if ($('.gdt2 > a').length) return {gid: $('.gdt2 > a').attr('href').split('/')[4], token: $('.gdt2 > a').attr('href').split('/')[5]};
    else return null
	}

    function tagsToCommonJson(tags) {
	    const result = {};
		    for (const namespace in tags) {
			    if (!Object.prototype.hasOwnProperty.call(tags, namespace)) { continue; }
			    const tagList = tags[namespace];
			    result[namespace] = [...tagList];
		    }
	    return result;
    }

    function getShortTitle(title) {
	    const prefixTags = /^\s*(\(([^\)]*?)\)|\[([^\]]*?)\]|\{([^\}]*?)\})\s*/i;
	    const suffixTags = /\s*(\(([^\)]*?)(?:\)|$)|\[([^\]]*?)(?:\]|$)|\{([^\}]*?)(?:\}|$))\s*$/i;

	    let m;
	    while ((m = prefixTags.exec(title))) {
		    title = title.substr(m.index + m[0].length);
	    }
	    while ((m = suffixTags.exec(title))) {
		    title = title.substr(0, m.index);
	    }
	    return title;
    }

    function getGalleryUrl(id) {
	    const loc = window.location;
	    return `${loc.protocol}//${loc.host}/g/${id.gid}/${id.token}/`;
    }
	/** ------------ */

    $(`<style data-jqstyle="exressurect">
    #menu {
        font-size: 10pt;
        padding: 0.5em 0 0 0;
        margin: 3px 5px 5px 0px;
        position: relative;
        display: inline-block;
        width: 100%;
        border-top: 1px solid #000;
        z-index: 1000;
    }
    .menuControl {
        border: none;
        background: rgba(0,0,0,0);
        cursor: pointer;
        color: #DDD;
    }
    .menuControl:hover {
        color: #EEE;
    }
    .menuContent {
        display: none;
        flex-direction: column;
        position: absolute;
        font-size: 10pt;
        border: 1px solid #000;
        text-align: left;
        overflow: auto;
        z-index: 999;
        background: rgb(79, 83, 91);
    }
    .menuContent a {
        padding: .25em 1em;
        line-height: 1.375em;
        text-decoration: none;
    }
    .menuContent a:hover {
        background: rgba(0,0,0,0.4);
    }
    </style>`).appendTo('head');
})();