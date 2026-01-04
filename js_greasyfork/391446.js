// ==UserScript==
// @name           Profile Image Downloader
// @namespace      http://userscripts.org/users/mizuho
// @description    Keyakizaka46 and Hinatazaka46 profile image download
// @copyright      2019 by Mizuho (Mio)
// @match http://*/*
// @match https://*/*
// @version 0.0.1.20201108115531
// @downloadURL https://update.greasyfork.org/scripts/391446/Profile%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/391446/Profile%20Image%20Downloader.meta.js
// ==/UserScript==

(function() {
////////////////////// Common //////////////////////
    BypassCdnImg = function(link) {
        var part = /^([^\/]+\/\/)(cdn\.)?(.+?)(?:\/[0-9_]+)?(\.jpg|\.png)/.exec(link);
        if(part === null) return link;
        if(part[2] === undefined)
            return part[1] + part[3] + part[4];
        else
            return part[1] + 'www.' + part[3] + part[4];
    };

    GetRealLink = function(link) {
        return link.replace(/(https?:\/\/.+)?(https?:\/\/.+)/, '$2');
    };

    GetGroup = function() {
        var reallink = GetRealLink(document.location.href);
        var group = /https?:\/\/(www\.)?([^\.]+)\.([^\.]{4}|[^\.]{3}|(co|or|pe|ac)\.[^\.]{2}|[^\.]{2})/.exec(reallink);
        if(group === undefined) return "";
        return group[2];
    };

    function deferredAddZip(url, filename, zip) {
        var deferred = $.Deferred();

        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        if ("responseType" in xhr) {
            xhr.responseType = "arraybuffer";
        }
        xhr.onload = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                //console.log(xhr.responseText);
                var file = xhr.response;
                zip.file(filename, file, {
                    binary: true
                });
                deferred.resolve(file);
            }
        };
        xhr.send(null);

        return deferred;
    }

////////////////////// Profile //////////////////////
    var GetIndex = [];
    var GetName = [];
    var GetKana = [];
    var GetList = [];

    // Keyakizaka
    GetIndex['keyakizaka46'] = function(obj) {
        return obj.getAttribute('data-member');
    };
    GetName['keyakizaka46'] = 'name';
    GetKana['keyakizaka46'] = 'furigana';
    GetList['keyakizaka46'] = 'sort-syllabary';

    // Sakurazaka
    GetIndex['sakurazaka46'] = function(obj) {
        return obj.getAttribute('data-member');
    };
    GetName['sakurazaka46'] = 'name';
    GetKana['sakurazaka46'] = 'kana';
    GetList['sakurazaka46'] = 'elem fx';

    // Hinatazaka
    GetIndex['hinatazaka46'] = function(obj) {
        var link = obj.getElementsByTagName('a');
        if(link === undefined) return "";
        var index = /artist\/(\d+)\?/.exec(link[0].href);
        if(index === null) return "";
        return index[1];
    };
    GetName['hinatazaka46'] = 'c-member__name';
    GetKana['hinatazaka46'] = 'c-member__kana';
    GetList['hinatazaka46'] = 'sort-syllabary';

    GetText = function(obj, cls) {
        var name = obj.getElementsByClassName(cls);
        if(name === undefined) return "";
        return name[0].innerText.trim();
    };

    GetImage = function(obj) {
        var img = obj.getElementsByTagName('img');
        if(img === undefined) return "";
        img = GetRealLink(img[0].src);
        return BypassCdnImg(img);
    };

    ProfileDownload = function() {
        var IsArchive = false;
        var g = GetGroup();
        //resetMessage();

        var zip = new JSZip();
        var deferreds = [];

        var group = document.getElementsByClassName(GetList[g]);
        if(group.length === 0) {
            group = document.getElementsByClassName('l-main');
            IsArchive = true;
        }

        for(var classs of group) {
            var memberlist = (IsArchive ? classs.getElementsByClassName('p-member__item') : classs.getElementsByTagName('li'));
            if(memberlist.__proto__[Symbol.iterator] === undefined)
                memberlist.__proto__[Symbol.iterator] = Array.prototype[Symbol.iterator];

            for(var member of memberlist) {
                var index = GetIndex[g](member);
                var name = GetText(member, GetName[g]);
                var kana = GetText(member, GetKana[g]);
                var img = GetImage(member);
                var filename = index + '_' + name + '(' + kana + ').' + img.replace(/^.+\.(jpg|png)$/, '$1');

                deferreds.push(deferredAddZip(img, filename, zip));
            }
        }

        // when everything has been downloaded, we can trigger the dl
        //console.log(deferreds);
        $.when.apply($, deferreds).done(function () {
            //console.log(zip);
            zip.generateAsync({ type: "blob" })
            .then(function (blob) {
                // use content
                var today = new Date();
                //var dd = today.getDate();
                var mm = today.getMonth() + 1; //January is 0!
                var yyyy = today.getFullYear();
                //if(dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;
                today = yyyy + '' + mm + '_';

                saveAs(blob, today + g + "_profile_image.zip");
            });

            console.log("done !");
        }).fail(function(err) {
            console.log(err);
        });
        return false;
    };

////////////////////// Greeting //////////////////////
    var GetGreetingUrl = [];
    var GetGreetingName = [];
    var GetCardUrl = [];
    var GetChekiUrl = [];

    GetGreetingUrl['keyakizaka46'] = 'https://www.keyakizaka46.com/s/k46o/api/list/greeting';
    GetGreetingUrl['sakurazaka46'] = 'https://sakurazaka46.com/s/s46/api/list/greeting';
    GetGreetingUrl['hinatazaka46'] = 'https://www.hinatazaka46.com/s/official/api/list/greeting_fc?ima=0000';

    GetGreetingName['keyakizaka46'] = function(obj) {
        return obj.name.kanji + '(' + obj.name.furi + ')';
    };

    GetGreetingName['sakurazaka46'] = function(obj) {
        return obj.name.kanji + '(' + obj.name.furi + ')';
    };

    GetGreetingName['hinatazaka46'] = function(obj) {
        return obj.name + '(' + obj.name_furi + ')';
    };

    GetCardUrl['keyakizaka46'] = function(obj) {
        return BypassCdnImg(obj.card);
    };

    GetCardUrl['sakurazaka46'] = function(obj) {
        return BypassCdnImg(obj.card);
    };

    GetCardUrl['hinatazaka46'] = function(obj) {
        return BypassCdnImg(obj.greetnig_card_src);
    };

    GetChekiUrl['keyakizaka46'] = function(obj) {
        return BypassCdnImg(obj.cheki);
    };

    GetChekiUrl['sakurazaka46'] = function(obj) {
        return BypassCdnImg(obj.cheki);
    };

    GetChekiUrl['hinatazaka46'] = function(obj) {
        return '';
    };

    GreetingDownload = function(greeting) {
        var IsArchive = false;
        var g = GetGroup();

        var zip = new JSZip();
        var deferreds = [];


        for(var member of greeting) {
            var index = member.id;
            var name = GetGreetingName[g](member);
            var img = GetCardUrl[g](member);
            if(img !== '') {
                var filename = index + '_' + name + '_card.' + img.replace(/^.+\.(jpg|png)$/, '$1');
                deferreds.push(deferredAddZip(img, filename, zip));
            }

            img = GetChekiUrl[g](member);
            if(img !== '') {
                var filename = index + '_' + name + '_cheki.' + img.replace(/^.+\.(jpg|png)$/, '$1');
                deferreds.push(deferredAddZip(img, filename, zip));
            }
        }

        // backup json
        var greetingUrl = GetGreetingUrl[GetGroup()];
        var jsonname = /\/([^\/\?]+)(?:\?|$)/.exec(greetingUrl);
        if(jsonname !== null) jsonname = jsonname[1];
        else jsonname = 'greeting';
        deferreds.push(deferredAddZip(GetGreetingUrl[GetGroup()], jsonname + '.json', zip));

        // when everything has been downloaded, we can trigger the dl
        //console.log(deferreds);
        $.when.apply($, deferreds).done(function () {
            //console.log(zip);
            zip.generateAsync({ type: "blob" })
            .then(function (blob) {
                // use content
                var today = new Date();
                //var dd = today.getDate();
                var mm = today.getMonth() + 1; //January is 0!
                var yyyy = today.getFullYear();
                //if(dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;
                today = yyyy + '' + mm + '_';

                saveAs(blob, today + g + "_greeting_image.zip");
            });

            console.log("done !");
        }).fail(function(err) {
            console.log(err);
        });

        return false;
    };

////////////////////// Main //////////////////////
    function start() {
        var bWait = false;
        if(typeof(jQuery) == 'undefined') {
            var jquery = document.createElement('script');
            jquery.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js';
            document.body.appendChild(jquery);
            bWait = true;
        }

        if(typeof(JSZip) == 'undefined') {
            var jscript = document.createElement('script');
            jscript.src = 'https://stuk.github.io/jszip/dist/jszip.js';
            document.body.appendChild(jscript);
            bWait = true;
        }

        if(typeof(saveAs) == 'undefined') {
            var jscript = document.createElement('script');
            jscript.src = 'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.js';
            document.body.appendChild(jscript);
            bWait = true;
        }

        if(bWait) {
            setTimeout(start, 100);
            return;
        }

        var type = prompt('Greeting : 1    Profile : 2','');
        if(type == '1') {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", GetGreetingUrl[GetGroup()], true);
            xhr.onload = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var json = JSON.parse(xhr.responseText);
                    GreetingDownload(json.greeting);
                }
            };
            xhr.send(null);
        } else if(type == '2'){
            ProfileDownload();
        }
    }

    start();
})();