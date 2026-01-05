// ==UserScript==
// @name        douban fm fav export
// @namespace   douban-BO-script
// @description douban fm fav exporter, 豆瓣电台红心歌单导出
// @include     *douban.fm*
// @version     1.2
// @grant       GM_wait
// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @grant       GM_setClipboard
// @icon        https://img3.doubanio.com/f/fm/55cc7ebd1777d5101a82d7d6ce47ffc5e114131d/pics/fm/san_favicon.ico
// @require     https://greasyfork.org/scripts/18532-filesaver/code/FileSaver.js?version=127839
// @downloadURL https://update.greasyfork.org/scripts/27087/douban%20fm%20fav%20export.user.js
// @updateURL https://update.greasyfork.org/scripts/27087/douban%20fm%20fav%20export.meta.js
// ==/UserScript==

//非常简单的脚本，在豆瓣电台歌词和分享按钮条下增加一个导出歌单的链接
//导出前需要你自己选中并显示所有红心歌曲，这个脚本只是帮你抓出来存在本地文本中

	function addGlobalStyle(css) {
		var head, style;
		head = document.getElementsByTagName('head')[0];
		if (!head) { return; }
		style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = css;
		head.appendChild(style);
	}

	function export_mine(){
		var firstWrap = document.getElementsByClassName("songlist-song");
		var out_text = ""
		
		for(var i = 0 ; i < firstWrap.length; ++i){
			
			var out_num = "\""  + firstWrap[i].children[0].children[0].textContent + "\"";
			var out_name = "\""  + firstWrap[i].children[0].children[2].children[0].textContent + "\"";
			var out_art = "\""  + firstWrap[i].children[0].children[2].children[1].children[0].children[0].text + "\"";
			var out_abm = "\""  + firstWrap[i].children[0].children[2].children[1].children[2].textContent + "\"";
			
			out_text = out_text  + out_num  + "," + out_name  + "," + out_art  + "," + out_abm + "\r\n";
		}
		
		
		
		alert(out_text);
		
		var blob = new Blob([out_text], {type: "text/plain;charset=utf-8"});
		saveAs(blob, "mine.csv");
		
	}


	function add_but(){
            var a = document.createElement('a');
            a.id = "netease";
            a.target="_blank";
            a.innerText = "导出红心歌单";
            a.addEventListener("click",function(e){
                console.log('a click');
                export_mine();
            }, true);
            return a;
  };

	function p_addchild(ele){
  	ele.appendChild(add_but());
	}


var insert_queryname = '.sub-buttons-wrapper';
var div = document.createElement('div');
var p = document.createElement('p');
div.appendChild(p);

window.addEventListener('load', function(e){
    var content = document.querySelector(insert_queryname);
    var again = function(){
        var content = document.querySelector(insert_queryname);
        if(content){
            content.appendChild(div);
            p_addchild(p);
        }else{
            setTimeout(again, 700);
        }
    };
    console.log('load!!!', content);
    if(content){
        setTimeout(again, 700);
    }else{
        again();
    }
}, false);

addGlobalStyle('#netease{color:#888;z-index:9999;}#netease:hover{background:0;color:#5b9;}');