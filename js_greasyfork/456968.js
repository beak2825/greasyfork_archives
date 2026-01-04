// ==UserScript==
// @name           Kindle Manga Downloader
// @namespace      https://greasyfork.org/users/3920
// @description    Download a Manga in Kindle Cloud Reader
// @copyright      2022 by Mocho
// @match http://*/*
// @match https://*/*
// @version 0.0.1.20221221154806
// @downloadURL https://update.greasyfork.org/scripts/456968/Kindle%20Manga%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/456968/Kindle%20Manga%20Downloader.meta.js
// ==/UserScript==
 
(function()
{
    function deferredAddZip(url, filename, zip) {
        var deferred = $.Deferred();
        JSZipUtils.getBinaryContent(url, function(err, data) {
            if (err) {
                //adderror(url, filename);
                SetResult("error getFileUrl", "", "right", "msg");
                deferred.reject(err);
            } else {
                zip.file(filename, data, {
                    binary: true
                });
                deferred.resolve(data);
            }
        });
        return deferred;
    }

    function BookDownload(title, lists) {
        var zip = new JSZip();
        var deferreds = [];
        var bFailed = false;
        title = title.replace(/\*/g, "＊").replace(/"/g, "＂").replace(/\|/g, "｜").replace(/\\/g, "＼").replace(/\//g, "／").replace(/!/g, "！").replace(/\?/g, "？").replace(/&/g, "＆").replace(/\^/g, "＾").replace(/:/g, "：").replace(/%/g, "％");
 
        SetResult("Downloading...", "", "right", "msg");
 
        // find every checked item
        for(let file of lists) {
          deferreds.push(deferredAddZip(file.url, file.name, zip));
        }
 
        // when everything has been downloaded, we can trigger the dl
        $.when.apply($, deferreds).done(function () {
            zip.generateAsync({ type: "blob" })
            .then(function (blob) {
                // use content
                saveAs(blob, title + ".zip");
            });
 
            if(bFailed) {
                SetResult("error getFileUrl", "", "right", "msg");
            }
            else {
                console.log("done !");
                SetResult("Done!!", "", "right", "msg");
            }
        }).fail(function(err) {
            console.log(err);
            SetResult("error save zip", "", "right", "msg");
        });
        return false;
    };

  GetJson = function(url) {
      return fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return data;
      });
  };

  async function DownloadAmazonKindle(url) {
    SetResult("Processing...", "", "right", "msg");
 
    let asin = (url.match(/manga\/([^?]+)/) ? RegExp.$1 : '');
    if ('' === asin) return;

    let api = `https://read.amazon.co.jp/api/manga/open-next-book/${asin}`;
    let lists = [];
    let data = await GetJson(api);
    let title = data.title;
    let manifest = JSON.parse(data.manifest);
    for(let k in manifest.manifest.assetToUrlMap) {
      //console.log(`k:${k}, v:${manifest.manifest.assetToUrlMap[k]}`);
      lists.push({name:k, url:manifest.manifest.assetToUrlMap[k]});
    }
    lists.push({name:`${asin}.json`, url:api});
///////////////////////////////////////////////////////////////////////////////////////////////////////////
    BookDownload(title, lists);
  }
 
	function start() {
	    let bWait = false;
	    if (typeof(jQuery) == 'undefined') {
            let jquery = document.createElement('script');
            jquery.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js';
            document.body.appendChild(jquery);
            bWait = true;
        }
        
	    if(typeof(JSZip) == 'undefined') {
	        let jscript = document.createElement('script');
	        jscript.src = 'https://stuk.github.io/jszip/dist/jszip.js';
	        document.body.appendChild(jscript);
	        bWait = true;
	    }

        if (typeof(JSZipUtils) == 'undefined') {
            let jscript = document.createElement('script');
            jscript.src = 'https://stuk.github.io/jszip-utils/dist/jszip-utils.js';
            document.body.appendChild(jscript);
            bWait = true;
        }

	    if(typeof(saveAs) == 'undefined') {
	        let jscript = document.createElement('script');
	        jscript.src = 'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.js';
	        document.body.appendChild(jscript);
	        bWait = true;
	    }
 
	    if(bWait) {
	        setTimeout(start, 100);
	        return;
	    }
 
		let domain = window.location.host;
		let url = document.location.href;
		let extractFunc = null;
		if (/read\.amazon\.co\.jp\/manga/gi.test(url))
		    extractFunc = DownloadAmazonKindle;
                if (null !== extractFunc)
		    extractFunc(url);
	}
 
	function CreateTable(col, row, color = "") {
	    if (color === "")
	        color = "white";
 
	    var row_dom = document.createElement('div');
	    row_dom.setAttribute('id', row);
	    row_dom.setAttribute('style', 'color:' + color + ';font:12px Meiryo;');
 
	    var col_dom = document.getElementById(col);
	    if(col_dom === null) {
	        col_dom = document.createElement('div');
	        col_dom.setAttribute('id', col);
	        col_dom.setAttribute('style', 'display:table-cell;padding:0px 10px 0px 10px; vertical-align:middle;');
 
	        var table_dom = document.getElementById('resulttable');
	        if(table_dom === null)
	            CreateLayout();
	        table_dom = document.getElementById('resulttable');
	        if(table_dom !== null)
	            table_dom.appendChild(col_dom);
	    }
 
	    col_dom.appendChild(row_dom);
	}
 
	function CreateLayout(color) {
	    var trends_dom = document.getElementById('extractresult');
	    if (trends_dom !== null)
	        trends_dom.outerHTML = "";
	    trends_dom = document.createElement('div');
	    trends_dom.setAttribute('id', 'extractresult');
	    var title_dom = document.createElement('strong');
	    title_dom.innerHTML = [
            '<div style="display: block; text-align:center; width: 100%; padding: 0px; margin: auto; vertical-align: middle; border-spacing: 0px"><div id="resulttable" style="display: inline-table;">',
            '</div></div>'
	    ].join(' ');
 
	    trends_dom.appendChild(title_dom);
	    trends_dom.style.cssText = [
            'background: rgba(55, 55, 55, 0.5);',
            'color: #fff;',
            'padding: 0px;',
            'position: fixed;',
            'z-index:102400;',
            'width:100%;',
            'font: 12px Meiryo;',
            'vertical-align: middle;',
	    ].join(' ');
	    document.body.style.cssText = 'position: relative; margin-top: 0px';
	    document.body.insertBefore(trends_dom, document.body.firstElementChild);
	}
 
	function SetResult(name, value, col_id, row_id, color = "") {
	    var elem = document.getElementById(row_id);
	    if (elem === null)
	        CreateTable(col_id, row_id, color);
 
	    elem = document.getElementById(row_id);
	    if (elem !== null) {
	        elem.setAttribute('value', value);
	        elem.innerHTML = name;
	    }
	}
 
	start();
})();