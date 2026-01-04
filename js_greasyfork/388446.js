// ==UserScript==
// @name 	ウマ娘攻略まとめ速報用スクリプト
// @description URLの補正とリンク作成、及びリンク先(画像・WEBサイト)のプレビューを表示します
// @author 	Aga Khan XVIII
// @match 	*://xn--o9j0bk9l4k169rk1cxv4aci7a739c.com/*
// @icon 	data:image/jpeg;base64,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
// @require 	http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @require 	https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js
// @run-at      document-Start
// @version 0.0.2.20200525.01
// @namespace https://greasyfork.org/users/325429
// @downloadURL https://update.greasyfork.org/scripts/388446/%E3%82%A6%E3%83%9E%E5%A8%98%E6%94%BB%E7%95%A5%E3%81%BE%E3%81%A8%E3%82%81%E9%80%9F%E5%A0%B1%E7%94%A8%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/388446/%E3%82%A6%E3%83%9E%E5%A8%98%E6%94%BB%E7%95%A5%E3%81%BE%E3%81%A8%E3%82%81%E9%80%9F%E5%A0%B1%E7%94%A8%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.meta.js
// ==/UserScript==
$(function () {

    // 謝辞 _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

    //このスクリプトはGinoaAI氏作"5ch&BBSViewser"をもとに改変を加えたものです。
    //とげとげ氏作"2ch(5ch)サムネイル表示"、os0x氏作"Text URL Linker"の記述も包括的に引用しています。

    // _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/ 謝辞


    // 設定
    var urlLinker = 1; //ttpsをhttpsに補正するか 1:する 0:しない
    var imgThumbnail = 1; //リンク先が画像の場合サムネイルを表示するか 1:する 0:しない
    var pageThumbnail = 1; //リンク先がwebページの場合サムネイルを表示するか 1:する 0:しない
    var treeCollapse = 0; //コメントツリー折りたたみ機能を使うか 1:使う 0:使わない


    // Text URL Linker os0x様 https://goo.gl/i29D46 _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_
    (function () {

        function TextURLLinker(config) {
            if (TextURLLinker.isInit || urlLinker == 0) return;
            TextURLLinker.isInit = true;
            var newtab = config.open_in_newtab;
            var noref = config.noreferrer;
            var style = escapeTags(config.link_style);
            var TEXT = 'descendant::text()[contains(self::text(),"ttp") and not(ancestor::' +
                ['a', 'textarea', 'script', 'style', 'head'].join(' or ancestor::') + ')]';
            linker(document.body);

            function linker(doc) {
                return $X(TEXT, doc).filter(function (txt) {
                    return linkfy(txt, 'h?ttp(s?://.*)', '[ 　\\)\\]\'\"\n]|$', 'http');
                });
            }

            function linkfy(node, start, end, prefix) {
                var linked = false;
                if (node.nodeValue.search(start) >= 0) {
                    var text = node.nodeValue, index;
                    var parent = node.parentNode;
                    while (text && (index = text.search(start)) >= 0) {
                        var _txt = node.splitText(index);
                        var _end = _txt.nodeValue.search(end);
                        var __txt = _txt.splitText(_end);
                        var a = document.createElement('a');
                        a.href = prefix + _txt.nodeValue.match(start)[1];
                        newtab && a.setAttribute('target', '_blank');
                        noref && a.setAttribute('rel', 'noreferrer');
                        style && a.setAttribute('style', style);
                        if (noref && typeof GM_openInTab !== 'undefined' && !window.getMatchedCSSRules) {
                            a.addEventListener('click', function (e) {
                                e.preventDefault();
                                GM_openInTab(a.href);
                            }, false);
                        }
                        a.appendChild(_txt);
                        parent.insertBefore(a, __txt);
                        text = __txt.nodeValue;
                        node = __txt;
                        linked = true;
                    }
                }
                return linked;
            }
            function escapeTags(str) {
                return str.replace(/["&<>]/g, function ($) {
                    return '&' + { '"': 'quot', '&': 'amp', '<': 'lt', '>': 'gt' }[$] + ';';
                });
            }
            var wait = true;
            document.addEventListener('DOMNodeInserted', function (e) {
                if (wait) {
                    setTimeout(function () {
                        linker(document.body);
                        wait = true;
                    }, 1500);
                    wait = false;
                }
            }, true);
        }
        var TextURLLinkerID = 'aegfbpchoheaflicfmggkmlmcccpjpgd';
        if (this.chrome && chrome.extension &&
            /aegfbpchoheaflicfmggkmlmcccpjpgd/.test(chrome.extension.getURL('manifest.json'))) {
            chrome.extension.sendRequest(TextURLLinkerID, 'init', TextURLLinker);
        } else if (this.safari) {
            safari.self.tab.dispatchMessage('config', '');
            safari.self.addEventListener('message', function (evt) {
                TextURLLinker(evt.message);
            }, false);
        } else {
            TextURLLinker({
                open_in_newtab: true,
                noreferrer: true,
                link_style: 'cursor:help;display:inline !important;'
            });
        }
        function addDefaultPrefix(xpath, prefix) {
            var tokenPattern = /([A-Za-z_\u00c0-\ufffd][\w\-.\u00b7-\ufffd]*|\*)\s*(::?|\()?|(".*?"|'.*?'|\d+(?:\.\d*)?|\.(?:\.|\d+)?|[\)\]])|(\/\/?|!=|[<>]=?|[\(\[|,=+-])|([@$])/g;
            var TERM = 1, OPERATOR = 2, MODIFIER = 3;
            var tokenType = OPERATOR;
            prefix += ':';
            function replacer(token, identifier, suffix, term, operator, modifier) {
                if (suffix) {
                    tokenType =
                        (suffix == ':' || (suffix == '::' && (identifier == 'attribute' || identifier == 'namespace')))
                        ? MODIFIER : OPERATOR;
                } else if (identifier) {
                    if (tokenType == OPERATOR && identifier != '*')
                        token = prefix + token;
                    tokenType = (tokenType == TERM) ? OPERATOR : TERM;
                } else {
                    tokenType = term ? TERM : operator ? OPERATOR : MODIFIER;
                }
                return token;
            }
            return xpath.replace(tokenPattern, replacer);
        }
        function $X(exp, context) {
            context || (context = document);
            var _document = context.ownerDocument || document,
                documentElement = _document.documentElement;
            var isXHTML = documentElement.tagName !== 'HTML' && _document.createElement('p').tagName === 'p';
            var defaultPrefix = null;
            if (isXHTML) {
                defaultPrefix = '__default__';
                exp = addDefaultPrefix(exp, defaultPrefix);
            }
            function resolver(prefix) {
                return context.lookupNamespaceURI(prefix === defaultPrefix ? null : prefix) ||
                    documentElement.namespaceURI || '';
            }

            var result = _document.evaluate(exp, context, resolver, XPathResult.ANY_TYPE, null);
            switch (result.resultType) {
                case XPathResult.STRING_TYPE: return result.stringValue;
                case XPathResult.NUMBER_TYPE: return result.numberValue;
                case XPathResult.BOOLEAN_TYPE: return result.booleanValue;
                case XPathResult.UNORDERED_NODE_ITERATOR_TYPE:
                    var ret = [], i = null;
                    while (i = result.iterateNext()) ret.push(i);
                    return ret;
            }
            return null;
        }

    })();
    // _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_ Text URL Linker os0x様 https://goo.gl/i29D46




    // リンクの補正 _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_
    $(function () {
        function traverse(elem) {
            var kids = elem.childNodes;

            var kid;
            for (var a = 0; a < kids.length; a++) {
                kid = kids.item(a);
                if (kid.nodeType == 3) {
                    kid.nodeValue = kid.nodeValue
                        .replace(/ttps:/g, "https:")
                        .replace(/hhttps:/g, "https:")
                        .replace(/ttp:/g, "http:")
                        .replace(/hhttp:/g, "http:")
                    ;
                } else {
                    if (kid.childNodes.length > 0) {
                        traverse(kid);
                    }
                }
            }
        }

        traverse(document.body);
    });
    // _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_ リンクの補正




    // 2chサムネイル表示 とげとげ様 https://goo.gl/vGtvCy 改変_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_
    $(function () {
        $('.commets-list p>a[class!="comment_view"]').each(function () {
            var addres = $(this).text();
            var end = addres.substr(addres.length - 3);
            if ((end == "jpg" || end == "peg" || end == "png" || end == "gif" || end == "bmp" || end == "rge" || end == "rig") && imgThumbnail == 1) {
                //リンク先が画像の場合はコメ欄に合うサイズでプレビュー表示
                $(this).after($('<a href=' + addres + ' target="_blank"><img src=' + addres + ' style="max-width:100%;display:block" /></a>'));
            } else { //リンク先が画像でない場合はwordpress.comに作ってもらったサムネイルを表示
                if (addres.length > 0 && pageThumbnail == 1) {
                    $(this).after($('<a href=' + addres + ' target="_blank"><img src=https://s.wordpress.com/mshots/v1/' + encodeURIComponent(addres) + '?w=500 style="display:block"></a>'));
                }
            }
        });
    });
    // _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_ 2chサムネイル表示 とげとげ様 https://goo.gl/vGtvCy 改変



    // コメント折りたたみ_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_
    if(treeCollapse == 1){
        $(function () {
            //CookieObject取得
            var ckObj;

            //ひとまず全閉じ
            $(".depth-1>.children").css("display","none");

            //開閉ボタン設置
            $(".depth-1>.children").after('<div class="su-button-center toggle-switch" style="display:-webkit-flex;display:flex;-webkit-justify-content:center;justify-content:center;-webkit-align-items:stretch;align-items:stretch;"><span href="#" class="su-button su-button-style-3d su-button-wide" style="width:50%;cursor:pointer;color:#000;background-color:#b3de81;border-color:#265c00;border-radius:7px;-moz-border-radius:7px;-webkit-border-radius:7px" target="_self"><span style="color:#000;padding:7px 20px;font-size:16px;line-height:24px;border-color:#68a225;border-radius:7px;-moz-border-radius:7px;-webkit-border-radius:7px;text-shadow:none;-moz-text-shadow:none;-webkit-text-shadow:none"><i class="fa fa-mail-forward" style="font-size:16px;color:#000"></i><span class="btn_text" style="display:inline !important;border:none;">開く</span></span></span></div>');
            //開閉ボタン機能実装
            $(".depth-1>.toggle-switch").on("click", function() {
                $(this).prev().slideToggle("normal","swing",function(){
                    //.childrenのdisplay:blockなら1を書き込み noneならレコードごと消す(上のfor回数を減らすため)
                    if($(this).css("display")=="block"){//開いている
                        Cookies.set($(this).prev().prop("id"),1,{expires: 1});
                        $(this).next().find(".btn_text").text('閉じる');
                    }else{//閉じている
                        Cookies.remove($(this).prev().prop("id"));
                        $(this).next().find(".btn_text").text('開く');
                    }
                });
            });

            //Cookieに合わせて開ける
            ckObj = Cookies.get();
            for (let [key, value] of Object.entries(ckObj)) {
                if(value == 1){
                    $("#"+key).siblings(".children").css("display","block");
                    $("#"+key).siblings(".children").next().find(".btn_text").text('閉じる');
                }
            }

            //最新コメント欄のリンクを変更してツリーへのリンクにする
            $(".recent-comment-title>a").each(function () {
                var comurl = $(this).prop("href").split('#');
                if(comurl[0] == location.href.split('#')[0]){
                    var newhash = $("#"+comurl[1]).closest(".depth-1").prop("id");
                    //alert(comurl[1]+" => "+newhash);
                    $(this).prop("href",comurl[0]+"#"+newhash);
                }
            });

            //全開閉ボタン設置
            //スマホ用
            $(".sidebtnlink").prepend('<a style="visibility:hidden"><i class="dashicons dashicons-arrow-up-alt"></i><p>空白</p></a>');
            $(".sidebtnlink").prepend('<a style="cursor:pointer"><i class="dashicons dashicons-hidden"></i><p>全て閉じる</p></a>');
            $(".sidebtnlink").prepend('<a style="cursor:pointer"><i class="dashicons dashicons-visibility"></i><p>全て開く</p></a>');
            //PC用
            $("#move-page-top").before($('<div id="tree-con" class="tree-controller" style="display:flex;flex-directionrow;"><a style="cursor:pointer;flex:auto;margin:0.5em;background-color:#000;flex:1;font-size:14px"><i class="dashicons dashicons-hidden"></i><p>全て<br>閉じる</p></a><a style="cursor:pointer;flex:auto;margin:0.5em;background-color:#000;flex:1;font-size:14px"><i class="dashicons dashicons-visibility"></i><p>全て<br>開く</p></a></div>'))

            //全開閉ボタン実装
            //スマホ用
            $(".dashicons-hidden" ).closest("a").on("click", function() {
                $(".depth-1>.children").css("display","none");
                $(".depth-1>.children").next().find(".btn_text").text('開く');
                ckObj = Cookies.get();
                for (let [key, value] of Object.entries(ckObj)) {
                    //alert(key);
                    if(value == 1){
                        Cookies.remove(key);
                    }
                }
            });
            $(".dashicons-visibility" ).closest("a").on("click", function() {
                $(".depth-1>.children").css("display","block");
                $(".depth-1>.children").next().find(".btn_text").text('閉じる');
            });
            //PC用

        });
    }
    // _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_ コメント折りたたみ_




});