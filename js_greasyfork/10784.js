// ==UserScript==
// @name N1d666m3l
// @namespace qixinglu.com
// @description 96160320dl
// @require https://greasyfork.org/scripts/10783-md5/code/md5.js
// @include http://music.163.com/*
// @grant none
// @version 0.0.1.20150704160315
// @downloadURL https://update.greasyfork.org/scripts/10784/N1d666m3l.user.js
// @updateURL https://update.greasyfork.org/scripts/10784/N1d666m3l.meta.js
// ==/UserScript==
var api = {
detailUrl: function(songIds) {
var tpl = 'http://music.163.com/api/song/detail?ids=[${songIds}]';
return tpl.replace('${songIds}', songIds.join(','));
},
detail: function(songIds, callback) {
var req = new XMLHttpRequest();
req.open('GET', this.detailUrl(songIds), true);
req.onload = function() {
callback(JSON.parse(this.responseText));
};
req.send();
},
mediaUrl: function(songId) {
return 'http://music.163.com/api/song/media?id=' + songId;
},
media: function(songId, callback) {
var req = new XMLHttpRequest();
req.open('GET', this.mediaUrl(songId), true);
req.onload = function() {
callback(JSON.parse(this.responseText));
};
req.send();
},
makeHash: function(dfsid) {
var char2code = function(c) { return c.charCodeAt(0) };
var code2char = function(c) { return String.fromCharCode(c) };
var hex2bin = function(hex) {
var bin = [];
var i;
for(i = 0; i < hex.length - 1; i += 2) {
bin.push(parseInt(hex.substr(i, 2), 16));
}
return String.fromCharCode.apply(String, bin);
}
var key = '3go8&$8*3*3h0k(2)2';
var keyCodes = key.split('').map(char2code);
var fidCodes = String(dfsid).split('').map(char2code);
var hashCodes = [];
var i, hashCode;
for (i = 0; i < fidCodes.length; i += 1) {
hashCode = (fidCodes[i] ^ keyCodes[i % key.length]) & 0xFF;
hashCodes.push(hashCode);
}
var string = hashCodes.map(code2char).join('');
var md5Digest = String(CryptoJS.MD5(string));
var base64Encoded = btoa(hex2bin(md5Digest));
var unescapeSymbol = base64Encoded.replace(/\+/g, '-')
.replace(/\//g, '_');
return unescapeSymbol;
},
mp3Url: function(dfsid) {
var url = 'http://m2.music.126.net/' +
this.makeHash(dfsid) + '/' + dfsid + '.mp3';
return url;
}
};
var innerFrame = document.querySelector('iframe');
var pages = [
{
url: 'http://music.163.com/#/song?id=',
handler: function() {
var songId = location.href.match(/id=([0-9]+)/)[1];
var downloadLine = this.createDownloadLine(songId);
var metaLine = this.createMetaLine(songId);
var innerFrameDoc = innerFrame.contentWindow.document;
var albumNode = innerFrameDoc.querySelectorAll('p.des.s-fc4')[1];
var parentNode = albumNode.parentNode;
parentNode.insertBefore(downloadLine, albumNode.nextElementSibling);
parentNode.insertBefore(metaLine, downloadLine.nextElementSibling);
},
createDownloadLine: function(songId) {
var disableStyle = function(link) {
link.text += '(无)';
link.style.color = 'gray';
link.style.textDecoration = 'none';
link.style.cursor = 'auto';
};
var bitrateLabel = function(bitrate) {
return '(' + bitrate / 1000 + 'kbp/s)';
}
var lowQualityLink = this.createLink('低音质');
var mediumQualityLink = this.createLink('中等音质');
var highQualityLink = this.createLink('高音质');
var lyricLink = this.createLink('歌词');
api.detail([songId], function(result) {
var song = result.songs[0];
lowQualityLink.href = api.mp3Url(song.lMusic.dfsId);
lowQualityLink.innerHTML += bitrateLabel(song.lMusic.bitrate);
if (song.mMusic) {
mediumQualityLink.href = api.mp3Url(song.mMusic.dfsId);
mediumQualityLink.innerHTML += bitrateLabel(song.mMusic.bitrate);
} else {
disableStyle(mediumQualityLink);
}
if (song.hMusic) {
highQualityLink.href = api.mp3Url(song.hMusic.dfsId);
highQualityLink.text += bitrateLabel(song.hMusic.bitrate);
} else {
disableStyle(highQualityLink);
}
});
api.media(songId, function(result) {
if (result.lyric) {
lyricLink.href = 'data:text/plain,' +
encodeURIComponent(result.lyric);
} else {
disableStyle(lyricLink);
}
});
var container = this.createLineContainer('下载');
container.appendChild(lowQualityLink);
container.appendChild(mediumQualityLink);
container.appendChild(highQualityLink);
container.appendChild(lyricLink);
return container;
},
createMetaLine: function(songId) {
var detailLink = this.createLink('歌曲');
var mediaLink = this.createLink('媒体');
detailLink.href = api.detailUrl([songId]);
mediaLink.href = api.mediaUrl([songId]);
var container = this.createLineContainer('元数据');
container.appendChild(detailLink);
container.appendChild(mediaLink);
return container;
},
createLink: function(label) {
var link = document.createElement('a');
link.innerHTML = label;
link.className = 's-fc7';
link.style.marginRight = '10px';
link.href = 'javascript:void(0);';
return link;
},
createLineContainer: function(label) {
var container = document.createElement('p');
container.className = 'desc s-fc4';
container.innerHTML = label + '：';
container.style.margin = '10px 0';
return container;
},
},
]
if (innerFrame) {
    innerFrame.addEventListener('load', function() {
        var i, page;
        for (i = 0; i < pages.length; i += 1) {
            page = pages[i];
            if (location.href.indexOf(page.url) === 0) {
                page.handler();
            }
        }
    });
}