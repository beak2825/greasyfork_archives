// ==UserScript==
// @name         hacg script
// @namespace    http://your.homepage/
// @version      0.2.1
// @description  enter something useful
// @author       You
// @require      https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.5.8/clipboard.min.js
// @include      *://*.hacg.*/*
// @include      *://hacg.*/*
// @downloadURL https://update.greasyfork.org/scripts/34111/hacg%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/34111/hacg%20script.meta.js
// ==/UserScript==

/* jshint esnext: true */

// Your code here...
(function () {
    // body...
    var $ = jQuery;

    var tool = $('<div class="cbj-hacg-tool"></div>');
    $('body').append(tool);

    tool.css({
        backgroundImage: "url('/favicon.ico')",
        backgroundSize: '100% 100%',
        cursor: 'pointer',
        position: 'fixed',
        right: '20px',
        bottom: '20px',
        width: '20px',
        height: '20px',
        backgroundColor: 'white'
    });

    var content = $('article').html() + $('#comments .commentList').html();
    content = content.replace('本站不提供下载', '');
    var clipboard;
    tool.click(function () {
        var links = match(content, /[A-Za-z0-9]{40}/g).map(m => `magnet:?xt=urn:btih:${m}`);
        var specialLinks = match(content, /[A-Z2-9]{32}/g).map(m => `magnet:?xt=urn:btih:${decodeBase32(m)}`);
        var baiduReg = /(\/s\/\w+) (\w+)/g;
        var result, baiduLinks = [];
        while ((result = baiduReg.exec(content)) !== null) {
            result = baiduReg.exec(content);
            baiduLinks.push(`<a href="http://pan.baidu.com${result[1]}">${result[1]}</a> ${result[2]}`);
        }

        if ($('.cbj-abstract').length === 0) {
            buildAbstract(links.concat(baiduLinks), specialLinks);
        } else {
            clipboard.destroy();
            $('.cbj-abstract').remove();
        }
    });

    function match(content, reg) {
        var result = content.match(reg);
        return result || [];
    }

    function buildAbstract(links, specialLinks) {
        links = [...new Set(links)];
        var icon = 'https://cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/svgs/fi-page-copy.svg';
        var list = links.map((m, i) => `<li><span>${m}</span><button class="copy"><img src="${icon}" alt="Copy to clipboard"></button></li>`).join('');
        var specialList = specialLinks.map((m, i) => `<li><span style='color: red'>${m}</span><button class="copy"><img src="${icon}" alt="Copy to clipboard"></button></li>`).join('');
        var div = $(`<div class="cbj-abstract"><ul>${list}${specialList}</ul></div>`);
        $('.entry-content').prepend(div);

        var buttonStyle = {
            position: 'relative',
            display: 'inline-block',
            margin: '4px 8px',
            height: '22px',
            padding: '0',
            fontSize: '13px',
            fontWeight: 'bold',
            lineHeight: '20px',
            color: '#333',
            whiteSpace: 'nowrap',
            verticalAlign: 'middle',
            cursor: 'pointer',
            backgroundColor: '#eee',
            backgroundImage: 'linear-gradient(#fcfcfc, #eee)',
            border: '1px solid #d5d5d5',
            borderRadius: '3px'
        };
        $('button.copy').css(buttonStyle);
        $('button.copy img').css({
            width: '20px',
            height: '20px'
        });
        div.find('li').css('background-color', 'rgb(50,50,50)');
        clipboard = new Clipboard('button.copy', {
            target: button => button.previousSibling
        });
    }

    function decodeBase32(text) {
        var base32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567".split("");
        var result = "";
        for (var i = 0; i < text.length; i++) {
            var t = base32.indexOf(text[i]);
            var e1, e2, e3, e4, e5;
            var temp;
            switch (i % 4) {
                case 0:
                    e1 = t >> 1;
                    temp = (t & 0b1) << 3;
                    break;
                case 1:
                    e2 = temp | t >> 2;
                    temp = (t & 0b11) << 2;
                    break;
                case 2:
                    e3 = temp | t >> 3;
                    temp = (t & 0b111) << 1;
                    break;
                case 3:
                    e4 = temp | t >> 4;
                    e5 = t & 0b1111;
                    result = result + [e1, e2, e3, e4, e5].map(x => x.toString(16)).join("");
                    break;
            }
        }
        return result;
    }

})();