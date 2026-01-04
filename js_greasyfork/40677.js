// ==UserScript==
// @name         轻文整卷阅读
// @namespace    https://www.iqing.com/
// @version      0.2
// @description  在详情页加载整卷小说
// @author       summer
// @match        https://www.iqing.com/book/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40677/%E8%BD%BB%E6%96%87%E6%95%B4%E5%8D%B7%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/40677/%E8%BD%BB%E6%96%87%E6%95%B4%E5%8D%B7%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function volume_chapters_id(dom_volume) {
        var dom_chapter = dom_volume.getElementsByClassName('chapter');
        var reg_chapter_id = /\/(\d+)/;
        var chapters = [];

        for (var ii = 0; ii < dom_chapter.length; ii++) {
            var href_chapter = dom_chapter[ii].getElementsByTagName('a')[0].href;
            chapters.push(reg_chapter_id.exec(href_chapter)[1]);
        }

        return chapters;
    }

    function _btn_volume() {
        var btn = document.createElement('button');
        btn.innerText = '阅读整卷';
        btn.className = 'btn btn-info';
        btn.style.position = 'absolute';
        btn.style.top = '8px';
        btn.style.right = '0px';
        btn.style.zIndex = 1;

        return btn;
    }

    function _wrap_progress(progress) {
        var wrap_progress = document.getElementById('wrap-progress-reader');

        if (null === wrap_progress) {
            wrap_progress = document.createElement('div');
            wrap_progress.style.textAlign = 'center';
            wrap_progress.id = 'wrap-progress-reader';

            var reader = document.getElementById('content').getElementsByClassName('container')[0];
            reader.innerHTML = '';
            reader.appendChild(wrap_progress);
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        }

        wrap_progress.innerHTML = progress + '<br><br>';

        return wrap_progress;
    }

    function btn_volume_get(cb) {
        var volumes = document.getElementsByClassName('volume');

        for (var i = 0; i < volumes.length; i++) {
            var dom_btn = _btn_volume();

            dom_btn.addEventListener('click', function(){
                if ('function' === typeof(cb)) {
                    cb(volume_chapters_id(this.parentNode));
                }
            });

            volumes[i].appendChild(dom_btn);
        }
    }

    function display_volume(data_text) {
        var data = JSON.parse(data_text);
        var content = data.results;
        var title = document.createElement('div');
        var wrap_reader = document.getElementById('content').getElementsByClassName('container')[0];

        title.innerHTML = data.chapter_title + '<br><br>';
        title.style.fontSize = '20px';
        wrap_reader.appendChild(title);

        for (var i = 0; i < content.length; i++) {
            if (0 == content[i].type) {
                _reader_add_text(wrap_reader, content[i].value);
            } else if (1 == content[i].type) {
                _reader_add_img(wrap_reader, content[i].value);
            } else {
                alert('出错了...');
            }
        }

        wrap_reader.innerHTML += '<br><br><br><br>';
    }

	function _reader_add_text(reader, text) {
        var lines = text.replace(/\r\n/g, "\n").split("\n");
        var copyright = /^\s*轻文.+侵权必究。?\s*$/;

        for (var i = 0; i < lines.length; i++) {
            if (true === copyright.test(lines[i])){
                continue;
            }
            var wrap = document.createElement('div');
            wrap.style.wordBreak = 'break-word';
            wrap.style.textIndent = '2em';
            wrap.style.color = '#333';
            wrap.style.padding = '.4em 0';
            wrap.style.margin = '0';
            wrap.style.lineHeight = '1.7';
            wrap.style.fontSize = '16px';
            wrap.innerText = lines[i];
            reader.appendChild(wrap);
        }
    }

	function _reader_add_img(reader, src) {
        var img = document.createElement('img');
        img.style.width = '100%';
        img.style.padding = '12px';
        img.style.backgroundColor = '#fff';
        img.style.border = '1px solid #e3e3e3';
        img.src = src;

        var wrap = document.createElement('div');
        wrap.style.textAlign = 'center';
        wrap.appendChild(img);

        reader.appendChild(wrap);
	}

    function get_show_volume(chapters_id, cb) {
        if (0 === chapters_id.length){
            _wrap_progress('获取完毕');

            if ('function' === typeof(cb)) {
                cb();
            }

            return ;
        }

        var url_pre = 'https://poi.iqing.com/content/';
        var url_suf = '/chapter/';
        var chapter_id = chapters_id.shift();

        _wrap_progress('获取中...  剩余' + chapters_id.length + '章');

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.onreadystatechange = function() {
            if (4 == xhr.readyState && 200 == xhr.status) {
                get_show_volume(chapters_id);
                display_volume(xhr.responseText);
            }
        };
        xhr.open('get', url_pre + chapter_id + url_suf, true);
        xhr.send();
    }

    btn_volume_get(get_show_volume);
})();