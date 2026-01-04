// ==UserScript==
// @name         导出QQ歌单
// @namespace    https://www.柴门.wooddoor/
// @version      0.3
// @description  导出完整的QQ歌单信息以作它用
// @author       柴门
// @match        https://y.qq.com/musicmac/v6/playlist/detail.html?id=*
// @match        https://y.qq.com/n/yqq/playlist/*
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/415836/%E5%AF%BC%E5%87%BAQQ%E6%AD%8C%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/415836/%E5%AF%BC%E5%87%BAQQ%E6%AD%8C%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    setTimeout(function () {////定时5秒后运行一次
      var qqSongListUrl1 = "https://y.qq.com/n/yqq/playlist/";
      var qqSongListUrl2 = "https://y.qq.com/musicmac/v6/playlist/";
      var currUrl = decodeURIComponent(location.href.split('#')[0]);
      var currUrl_pre = currUrl.substr(0,currUrl.lastIndexOf("/")+1);//substr(start [，length]) 第一个字符的索引是0，start必选 length可选
      console.log(currUrl_pre);
      if(currUrl_pre == qqSongListUrl2) {
        $("#songlist_box").before(`<div style="display:inline;z-index:999;"><textarea style="height:100px;width:100%;" id="songlist__input" readonly="readonly" /><button  id="save">尝试保存</button></div>`);
        $("#songlist__input").val("mid\t歌曲名\t歌手名\tsingermid\tsingerid\talbummid\trid\talbum_name\tsonglist__time\n");
        //console.log($('.songlist__li').length);
        $(".songlist__li").each(function(index,domEle){
          //console.log($(this).text());
          //alert($(this).text())；
          var mid = $(this).find(".songlist__item").attr("mid");//不知啥，先记录保存下来再说
          
          var title = $(this).find(".mod_songname__name").attr("title");//歌曲名
          $(this).find(".mod_songname__menu").append('<a class="mod_songname_menu__item js_download" style="color: rgba(255,0,0,.9);font-weight:bold;font-size: 16px;" target="_blank" href="https://www.at38.cn/?name=' + title + '&type=netease;" title="搜歌曲">搜歌曲</a>');//添加一个搜索歌曲的链接
          
          var singer_name = $(this).find(".singer_name").attr("title");//歌手名，或：$(".singer_name").text();
          var singermid = $(this).find(".singer_name").attr("data-singermid");//不知啥，先记录保存下来再说
          var singerid = $(this).find(".singer_name").attr("data-singerid");//不知啥，先记录保存下来再说
          
          var albummid = $(this).find(".songlist__album").attr("data-albummid");//不知啥，先记录保存下来再说
          var rid = $(this).find(".songlist__album").attr("data-rid");//不知啥，先记录保存下来再说
          var album_name = $(this).find(".songlist__album").text();//专辑名
          
          var songlist__time = $(this).find(".songlist__time").text();//歌曲时长
          
          $("#songlist__input").val($("#songlist__input").val() + mid + "\t" + title + "\t" + singer_name + "\t" + singermid + "\t" + singerid + "\t" + albummid + "\t" + rid + "\t" + album_name + "\t" + songlist__time + "\n");
          //$("#songlist__input").val( $("#songlist__input").val() + "{0}\t{1}\t{2}\t{3}\t{4}\t{5}\t{6}\t{7}\t{8}\n".format(mid, title, singer_name, singermid, singerid, albummid, rid, album_name, songlist__time) );
        });
      } else if(currUrl_pre == qqSongListUrl1){
        //https://post.smzdm.com/p/alpz4vgp/
        //https://www.cnblogs.com/q1ang/p/11927228.html
            /*var script = document.createElement("SCRIPT");
            script.src = 'https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js';
            script.type = 'text/javascript';
            document.getElementsByTagName("head")[0].appendChild(script);*/
        
        		var songListID = currUrl.substring(currUrl.lastIndexOf("/")+1, currUrl.lastIndexOf("."));//substring(start [, end]) 第一个字符的索引是0，start必选 end可选
        		//$(".data_tag_box").append(`<div style="display:inline;z-index:999;"><button class="mod_btn_green" id="save">保存歌单</button></div>`);
        		$(".songlist__header").before(`<div style="display:inline;z-index:999;"><textarea style="height:100px;width:100%;" id="songlist__input" readonly="readonly" /><button class="mod_btn_green" id="save">保存歌单</button></div>`);
        		//console.log(songListID);return;

            var checkReady = function (callback) {
                if (window.jQuery) {
                    callback(jQuery);
                } else {
                    window.setTimeout(function () { checkReady(callback); }, 100);
                }
            };

            checkReady(function ($) {
                var text="歌曲ID\t歌曲名\t歌手名\t专辑\n";
                $.ajax({
                    url: "https://c.y.qq.com/v8/fcg-bin/fcg_v8_playlist_cp.fcg?id=" + songListID + "&cv=60102&ct=19&newsong=1&tpl=wk&g_tk=5381&loginUin=0&hostUin=0&format=json&inCharset=GB2312&outCharset=utf-8&notice=0&platform=jqspaframe.json&needNewCode=0",
                    async:false,
                    dataType:"json",
                    success:function(data){
                        var songlist = data.data.cdlist[0].songlist;
                        for(var i=0;i < songlist.length; i++){
                            var tmp = songlist[i];
                            text += tmp.mid + "\t" + tmp.name +"\t" + tmp.singer[0].name +"\t" + tmp.album.name + "\n";
                        }
                    }
                });

                //$('body').empty();
                //$('body').append("<div>"+text+"</div>");
              	$("#songlist__input").val(text);
            });
      }
      
      //============javascript – 将HTML5 textarea内容保存到文件：https://www.jb51.cc/js/159069.html============//
          function saveTextAsFile() {
      			var textToWrite = $("#songlist__input").val();//document.getElementById('songlist__input').innerHTML;
      			var textFileAsBlob = new Blob([ textToWrite ],{ type: 'text/plain' });
      			var fileNameToSaveAs = "songlist.xls";
     
      			var downloadLink = document.createElement("a");
      			downloadLink.download = fileNameToSaveAs;
      			downloadLink.innerHTML = "Download File";
      			if (window.webkitURL != null) {
        			// Chrome allows the link to be clicked without actually adding it to the DOM.
        			downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
      			} else {
        			// Firefox requires the link to be added to the DOM before it can be clicked.
        			downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        			downloadLink.onclick = destroyClickedElement;
        			downloadLink.style.display = "none";
        			document.body.appendChild(downloadLink);
      			}
     
      			downloadLink.click();
    			}
     
    			var button = document.getElementById('save');
    			button.addEventListener('click',saveTextAsFile);
     
    			function destroyClickedElement(event) {
      			// remove the link from the DOM
      			document.body.removeChild(event.target);
    			}
     //============javascript – 将HTML5 textarea内容保存到文件：https://www.jb51.cc/js/159069.html============//

    }, 5000)
})();