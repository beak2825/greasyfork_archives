// ==UserScript==
// @name         TJUPT Music JSON Uploady
// @namespace    http://tjupt.org/
// @version      0.1.2
// @description  import json from red/ops/dic
// @author       Colder
// @match        https://*.tjupt.org/upload.php
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/he@1.2.0/he.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492159/TJUPT%20Music%20JSON%20Uploady.user.js
// @updateURL https://update.greasyfork.org/scripts/492159/TJUPT%20Music%20JSON%20Uploady.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //this is not robust: 'wikiBody to BBCode' for DIC
    function wiki2bb(wiki) {
        //br
        wiki = wiki.replace(/<br \/>/g, '');
        //quote
        wiki = wiki.replace(/<blockquote>([\s\S]*?)<\/blockquote>/g,'[quote]$1[/quote]');
        //hide
        wiki = wiki.replace(/<strong>(.*?)<\/strong>: <strong>\u9690\u85cf\u5185\u5bb9<\/strong>: <a href="javascript:void\(0\);" onclick="BBCode\.spoiler\(this\);">(.*?)<\/a><blockquote class="hidden spoiler">([\s\S]*)<\/blockquote>/g, '[hide=$1]$3[/hide]');
        //b
        wiki = wiki.replace(/<strong>([\s\S]*?)<\/strong>/g, '[b]$1[/b]');
        //quote=xxx
        wiki = wiki.replace(/<strong class="quoteheader">(.*?)<\/strong> wrote: <blockquote>(.*?)<\/blockquote>/g, '[quote=$1]$2[/quote]');
        //url=xxx
        wiki = wiki.replace(/<a rel="noreferrer" target="_blank" href="(.*?)">(.*?)<\/a>/g, function(match, p1, p2) {
            const url = p1.replace(/\\\//g, '/');
            return "[url=" + url + "]" + p2 + "[/url]";
        });
        //center, then clear unsupported align
        wiki = wiki.replace(/<div style="text-align: center;">([\s\S]*?)<\/div>/g, "[center]$1[/center]");
        wiki = wiki.replace(/<div style="text-align: (.*?);">([\s\S]*?)<\/div>/g, "$2");
        //img
        wiki = wiki.replace(/<img class="scale_image" onclick="lightbox\.init\(this, \$\(this\).width\(\)\);" alt="(.*?)" src="(.*?)" \/>/g, function(match, p1, p2) {
            const url = p2.replace(/\\\//g, '/');
            return '[img]' + url + '[/img]';
        });
        //artist
        wiki = wiki.replace(/<a href="artist\.php\?artistname=(.*?)">(.*?)<\/a>/g, '$2');
        //size
        wiki = wiki.replace(/<span class="size(.?)">([\s\S]*?)<\/span>/g, '[size=$1]$2[/size]');
        //italic, then clear other span style
        wiki = wiki.replace(/<span style="font-style: italic;">([\s\S]*?)<\/span>/g, '[i]$1[/i]');
        wiki = wiki.replace(/<span style=(.*?)>/g, '').replace(/<\/span>/g, '');
        //<li>
        wiki = wiki.replace(/<li>(.*?)<\/li>/g, '· $1\n');
        //<ul>
        wiki = wiki.replace(/<ul(.*?)>([\s\S]*?)<\/ul>/g,'$2');
        //<pre>
        wiki = wiki.replace(/<pre>([\s\S]*?)<\/pre>/g,'$1');

        return wiki;
    }

    function replaceUnsupportedBBCode(BB) {
        BB = BB.replace(/\[artist\](.*?)\[\/artist\]/g, '$1');
        BB = BB.replace(/\[plain\](.*?)\[\/plain\]/g, '$1');
        BB = BB.replace(/\[align=center\](.*?)\[\/align\]/g, '[center]$1[/center]');
        BB = BB.replace(/\[align(.*?)\]/g, '').replace(/\[\/align\]/g, '');
        BB = BB.replace(/\[pad(.*?)\]/g, '').replace(/\[\/pad\]/g, '');

        return BB;
    }

    function unicodeConvert(string) {
        string = string.replace(/\\u([\d\w]{4})/gi, (match, grp) => String.fromCharCode(parseInt(grp, 16)));
        string = string.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
        return string;
    }

    function insertButtons() {
        const uploadButton = document.createElement('input');
        uploadButton.type = 'file';
        uploadButton.id = 'jsonFileUploader';
        uploadButton.accept = 'application/json';
        uploadButton.addEventListener('change', () => selectMusicCategory());

        const goButton = document.createElement('button');
        goButton.textContent = 'Go';
        goButton.type = 'button';
        goButton.addEventListener('click', processJsonFile);

        const targetLocation = document.evaluate('/html/body/table[2]/tbody/tr[2]/td/form/table/tbody/tr[1]/td', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (targetLocation) {
            targetLocation.appendChild(uploadButton);
            targetLocation.appendChild(goButton);
        }
    }

    function processJsonFile() {
        const fileInput = document.getElementById('jsonFileUploader');
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    fillForm(data);
                } catch(error) {
                    console.error('Error processing JSON file:', error);
                }
            };
            reader.readAsText(file);
        }
    }

    function fillForm(data) {
        const albumTitle = unicodeConvert(String(data.response?.group?.name || ''));
        const remasterYear = String(data.response?.torrent?.remasterYear || '');
        let artistNames = '';
        if (data.response?.group?.musicInfo?.artists && data.response.group.musicInfo.artists.length >= 3) { artistNames = 'Various Artists';}
        else {
            artistNames = data.response?.group?.musicInfo?.artists?.map(artist => unicodeConvert(artist.name)).join(' & ') || '';
        }
        const media = unicodeConvert(data.response?.torrent?.media || '');
        const format = data.response?.torrent?.format || '';
        //encoding
        let encoding = unicodeConvert(data.response?.torrent?.encoding || '');
        if(encoding === "24bit Lossless") {
            encoding = "Hi-Res";
        } else if(encoding === "Lossless") {
            encoding = "无损";
        }
        //subHeading
        let subHeadingArray = [
            unicodeConvert(data.response?.torrent?.remasterRecordLabel),
            unicodeConvert(data.response?.torrent?.remasterCatalogueNumber),
            unicodeConvert(data.response?.torrent?.remasterTitle)
        ];
        if (data.response?.torrent?.hasLog && data.response?.torrent?.logScore) {
            subHeadingArray.push(`log (${data.response.torrent.logScore}%)`);
        }
        if (data.response?.torrent?.hasCue) {
            subHeadingArray.push("Cue");
        }
        if (data.response?.torrent?.scene) {
            subHeadingArray.push("Scene");
        }
        if (data.response?.torrent?.lossyWebApproved) {
            subHeadingArray.push("Lossy WEB");
        }
        if (data.response?.torrent?.lossyMasterApproved) {
            subHeadingArray.push("Lossy Master");
        }
        const subHeading = subHeadingArray.filter(info => info).join(' / ');
        //description
        let descr = String('[img]'+(data.response?.group?.wikiImage || '').replace(/\\\//g, '/')+'[/img]\n');
        //add torrent description
        const torrent_desc = replaceUnsupportedBBCode(he.decode(unicodeConvert(data.response?.torrent?.description || '').replace(/\\\//g, '/')));
        if(torrent_desc !== "") {descr = descr + "\n[quote]" +torrent_desc + "[/quote]\n";}
        //torrent group description
        const bbBody = replaceUnsupportedBBCode(he.decode(unicodeConvert(data.response?.group?.bbBody || '')));
        const wikiBBcode = replaceUnsupportedBBCode(he.decode(unicodeConvert(data.response?.group?.wikiBBcode || '')));
        if (bbBody) {descr += bbBody;}
        else if (wikiBBcode) {descr += wikiBBcode;}
        else { //parse wikiBody for DIC
            const bb4dic = wiki2bb(he.decode(unicodeConvert(data.response?.group?.wikiBody || '')));
            descr += bb4dic;
        }


        document.getElementById('hqname').value = albumTitle;
        document.getElementById('issuedate').value = remasterYear;
        document.getElementById('artist').value = artistNames;
        document.getElementById('specificcat').value = media;
        document.getElementById('format').value = format;
        document.getElementById('hqtone').value = encoding;
        const smallDescr = document.querySelector('input[type="text"][name="small_descr"]');
        if(smallDescr) {
            smallDescr.value = subHeading;
        }
        const currentDesc = document.getElementById('descr');
        if(currentDesc && currentDesc.value == ""){
            document.getElementById('descr').value = descr;
        }
    }

    function selectMusicCategory() {
        const categorySelect = document.getElementById('browsecat');
        if (categorySelect && categorySelect.value !== "406") {
            categorySelect.value = "406";
            categorySelect.dispatchEvent(new Event('change'));
        }
    }

    insertButtons();
})();
