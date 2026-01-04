// ==UserScript==
// @name         智能划词翻译，可替换原文版
// @namespace    https://greasyfork.org/zh-CN/scripts/382768
// @version      4.0.1
// @description  划词翻译，翻译后可以替换原来的文字，可朗读翻译结果，适应移动端
// @grant        unsafeWindow
// @require      http://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @require      https://cdn.bootcss.com/rangy/1.3.0/rangy-core.min.js
// @author       辣条要甜点
// @match        http://*/*
// @include      https://*/*
// @run-at document-end
// @connect      dict.youdao.com
// @connect      translate.google.cn
// @grant        GM_xmlhttpRequest
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/382768/%E6%99%BA%E8%83%BD%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91%EF%BC%8C%E5%8F%AF%E6%9B%BF%E6%8D%A2%E5%8E%9F%E6%96%87%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/382768/%E6%99%BA%E8%83%BD%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91%EF%BC%8C%E5%8F%AF%E6%9B%BF%E6%8D%A2%E5%8E%9F%E6%96%87%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';
    rangy.init();
    var lang = $('html').attr('lang');
    var isCnWeb = Boolean(lang) && lang.trim().toLowerCase() == 'zh-cn';
    console.log(isCnWeb);
    var audioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
    var youdaoUrl = 'http://dict.youdao.com/jsonapi?xmlVersion=5.1&jsonversion=2&q=';
    var googleUrl = 'https://translate.google.cn/translate_a/single?client=gtx&dt=t&dt=bd&dj=1&source=input&hl=zh-CN&sl=auto&tl=';
    var iconSize = 24;
    var translationTestSize = 16;
    var icon = document.createElement('div');
    var style = '' +
        'width:24px!important;' +
        'height:24px!important;' +
        'margin:4px!important;' +
        'position:absolute!important;';
    var iconStyle = '' +
    'width:32px!important;' +
    'height:32px!important;' +
    'display:none!important;' +
    'background:#fff!important;' +
    'border-radius:16px!important;' +
    'box-shadow:4px 4px 8px #888!important;' +
    'position:absolute!important;' +
    'z-index:2147483647!important;' +
    '';
    icon.innerHTML = '' +
        '<svg href="javascript:void(0)" style="' + style + '" "width="24" height="24" viewBox="0 0 768 768">' +
        '<path d="M672 640.5v-417c0-18-13.5-31.5-31.5-31.5h-282l37.5 129h61.5v-33h34.5v33h115.5v33h-40.5c-10.5 40.5-33 79.5-61.5 112.5l87 85.5-22.5 24-87-85.5-28.5 28.5 25.5 88.5-64.5 64.5h225c18 0 31.5-13.5 31.5-31.5zM447 388.5c7.5 15 19.5 34.5 36 54 39-46.5 49.5-88.5 49.5-88.5h-127.5l10.5 34.5h31.5zM423 412.5l19.5 70.5 18-16.5c-15-16.5-27-34.5-37.5-54zM355.5 339c0-7.381-0.211-16.921-3-22.5h-126v49.5h70.5c-4.5 19.5-24 48-67.5 48-42 0-76.5-36-76.5-78s34.5-78 76.5-78c24 0 39 10.5 48 19.5l3 1.5 39-37.5-3-1.5c-24-22.5-54-34.5-87-34.5-72 0-130.5 58.5-130.5 130.5s58.5 130.5 130.5 130.5c73.5 0 126-52.5 126-127.5zM640.5 160.5c34.5 0 63 28.5 63 63v417c0 34.5-28.5 63-63 63h-256.5l-31.5-96h-225c-34.5 0-63-28.5-63-63v-417c0-34.5 28.5-63 63-63h192l28.5 96h292.5z" style="fill:#3e84f4;"></svg>' +
        '';
    icon.setAttribute('style', iconStyle);

    var container = document.createElement('div');
    container.setAttribute('style', '' +
        'display:none!important;' +
        'position:absolute!important;' +
        'font-size:13px!important;' +
        'overflow:auto!important;' +
        'background:#fff!important;' +
        'font-family:sans-serif,Arial!important;' +
        'font-weight:normal!important;' +
        'text-align:left!important;' +
        'color:#000!important;' +
        'padding:0.5em 1em!important;' +
        'line-height:1.5em!important;' +
        'border-radius:5px!important;' +
        'border:1px solid #ccc!important;' +
        'box-shadow:4px 4px 8px #888!important;' +
        'max-width:350px!important;' +
        'min-width:134px!important;' +
        'max-height:216px!important;' +
        'z-index:2147483647!important;' +
        '');

    var selectText,fyDom,range,isL,isR,_t,selectText2='',isCn,isPlay=false,wavs,_e;

    // 添加翻译图标和面板到 DOM
    document.documentElement.appendChild(icon);
    var containerBox = document.createElement('div');
    containerBox.setAttribute('style','position:relative;');
    containerBox.appendChild(container);
    document.documentElement.appendChild(containerBox);

    // 鼠标事件：防止选中的文本消失
    icon.addEventListener('mousedown', function (e) {
        e.preventDefault();
    });

    // 鼠标事件and触摸：防止选中的文本消失；显示、隐藏翻译图标
    icon.addEventListener('mouseup', function (e) {
        e.stopPropagation();
    });
    container.addEventListener('mouseup', function (e) {
        e.stopPropagation();
    });
    container.addEventListener('touchend', function (e) {
        e.stopPropagation();
    });
    document.addEventListener('touchend', function (e) {
        if (container.style.display != 'none') {
            container.style.display = 'none';
        }
    });
    $(document).keydown(function (event){
        if (event.ctrlKey && event.shiftKey && event.keyCode == 81) {
            GM_setValue('isKey', !GM_getValue('isKey', false));
            return;
        }
        if(event.ctrlKey && event.keyCode == 81 && GM_getValue('isKey', false)){
            showContainer(_e);
            return;
        }
    });
    document.addEventListener('mouseup', function (e) {
        if (container.style.display != 'none') {
            container.style.display = 'none';
        }
        _e = e;
        range = getFirstRange();
        selectText = range ? rangy.getSelection().toString().trim() : '';
        // console.log(selectText,icon.style.display);
        if(selectText == '' || selectText == selectText2){
            selectText2 = '';
            icon.style.display = 'none';
            container.style.display = 'none';
            return;
        }
        if(GM_getValue('isKey', false))return;
        icon.style.top = (e.pageY + 12) + 'px';
        icon.style.left = e.pageX + 'px';
        icon.style.display = 'block';
        selectText2 = selectText;
    });
    // 选中变化事件：当点击已经选中的文本的时候，隐藏翻译图标（此时浏览器动作是：选中的文本已经取消选中了）
    document.addEventListener("selectionchange", function () {
        if (container.style.display != 'none') {
            icon.style.display = 'none';
        }
    });
    //如果是手机,点击复制触发翻译
    if (isMobile()) {
        document.oncopy = function (e) {
            container.style.top = ($(e.target).offset().top + $(e.target).height()) + 'px';
            container.style.left = 0;
            container.style.right = 0;
            container.style.margin = 'auto';
            container.style.minWidth = (e.target.clientWidth - 8) + 'px';
            container.style.maxWidth = (document.body.clientWidth - 8) + 'px';
            container.style.width = (e.target.clientWidth - 8) + 'px';
            range = getFirstRange();
            selectText = range ? rangy.getSelection().toString() : '';
            icon.click();
        };
    }
    //点击了朗读按钮
    $(container).on('click', '#_fy_play', function (e) {
        playSound(selectText, 'en');
        e.stopPropagation();
    });
    //点击了替换图标
    $(container).on('click', '#_fy_th', function (e) {
        if (range) {
            //删除选中的节点
            range.deleteContents();
            var startNode, endNode, i=0;
            while (fyDom.childNodes.length !== 0) {
                i++;
                var _node = fyDom.childNodes[fyDom.childNodes.length - 1];
                //插入翻译的节点
                range.insertNode(_node);
                if (i === 1) endNode = _node;
                if (fyDom.childNodes.length === 0) startNode = _node;
            }
            rangy.getSelection().setSingleRange(range);
            //处理重复的node,必须在添加完所有node后处理,不然节点位置会乱
            if (startNode) disposeRepeatDom(startNode, true);
            if (endNode) disposeRepeatDom(endNode, false);
        }
        icon.style.display = 'none';
        container.style.display = 'none';
    });
    // 翻译图标点击事件
    icon.addEventListener('click', function (e) {
        showContainer(e);
    });
    function showContainer(e){
        if (range) {
            wavs = [];
            var html = rangy.getSelection().toHtml();
            console.log();
            fyDom = document.createElement("div");
            fyDom.innerHTML = html;

            //自定义翻译的文本格式,谷歌翻译不会把|翻译,所以找到所有文本节点的text,组成"选择的dom下标-选择的dom下标>>text||||"
            _t = '';
            getDomText(fyDom, '');
            isL = (html.substr(0, 1) == "<");
            isR = (html.substr(-1) == ">");

            icon.style.display = 'none';
            container.style.display = 'none';
            container.innerHTML = '';
            if (!isMobile()) {
                container.style.bottom = (document.body.clientHeight-e.pageY) + 'px';
                if (e.pageX + 350 <= document.body.clientWidth) {// container 面板css最大宽度为250px
                    container.style.left = e.pageX + 'px';
                } else {
                    container.style.left = document.body.clientWidth - 350 + 'px';
                }
            }
            console.log(isChina(selectText),isCnWeb);
            if(isChina(selectText) || isCnWeb) {
                ajax(googleUrl + 'en&q=', encodeURIComponent(selectText), 1, container);
            } else {
                if(countOfWord(selectText) == 1) {
                    ajax(youdaoUrl, selectText, 0, container);
                }else {
                    ajax(googleUrl + 'zh-CN&q=', encodeURIComponent(_t), 1, container);
                }
            }
        }
    }
    function countOfWord(str) {
        var value = String(str);

        value = value.replace(/^\s+|\s+$/gi, ""); // 前后空格不计算为单词数

        value = value.replace(/\s+/gi, " ");// 多个空格替换成一个空格

        var length = 0; // 更新计数
        var match = value.match(/\s/g);//没有匹配到则返回null
        if (match) {
            length = match.length + 1;
        } else if (value) {
            length = 1;
        }
        return length;
    }

    function isChina(str){
        var reg = /[\u4E00-\u9FA5]/g
        var cnStr = str.match(reg);
        return Boolean(cnStr) && cnStr.length >= (str.length-cnStr.length);
    }
    // ajax 跨域访问公共方法
    function ajax(url, text, target, element, method, data, headers) {
        if (!!!method)
            method = 'GET';
        // >>>因为Tampermonkey跨域访问(a.com)时会自动携带对应域名(a.com)的对应cookie
        // 不会携带当前域名的cookie
        // 所以，GM_xmlhttpRequest【不存在】cookie跨域访问安全性问题
        // 以下设置默认headers不起作用<<<
        url += text;
        if (!!!headers)
            headers = { 'cookie': '' };
        GM_xmlhttpRequest({
            method: method,
            url: url,
            headers: headers,
            data: data,
            onload: function (res) {
                if(target == 0){
                    youdao(res.responseText, text, element);
                }else{
                    google(res.responseText, element);
                }
            },
            onerror: function (res) {
                displaycontainer("连接失败",element);
            }
        });
    }

    // 有道翻译
    function youdao(rst, text, element) {
        var ec = JSON.parse(rst).ec;
        if (!!ec) {
            var word = JSON.parse(rst).ec.word[0], html = '', tr = '';

            var trs = word.trs, ukphone = word.ukphone, usphone = word.usphone, phone = word.phone;
            var phoneStyle = '' +
            'color:#9E9E9E!important;' +
            '';
            if (!!ukphone && ukphone.length != 0) {
                html += '<span style="' + phoneStyle + '">英[' + ukphone + '] </span>';
            }
            if (!!usphone && usphone.length != 0) {
                html += '<span style="' + phoneStyle + '">美[' + usphone + '] </span>';
            }
            html+='<buttom id="_fy_play" style="' + phoneStyle + '"><svg class="icon" style="width: 22px;height: 22px;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1000 1000" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4458"><path d="M845.815 750.614h0.059v-0.364l-0.059 0.364z m0 0M726.589 196.598c-4.46-2.846-8.894-5.169-14.3-5.169-13.207 0-23.856 11.371-23.856 25.385 0 10.12 5.641 18.221 13.61 22.82 87.68 54.344 146.638 155.215 146.638 270.816 0 115.511-58.905 216.346-146.466 270.694-7.683 4.464-14.299 12.839-14.299 23.201 0 14.029 10.704 25.4 23.882 25.4 5.295 0 9.493-2.169 14.098-4.983 101.749-63.087 170.177-180.157 170.177-314.312 0.003-133.85-68.138-250.687-169.484-313.852z m0 0M754.268 510.466c0-78.664-40.138-147.299-99.848-184.237-2.705-1.5-9.061-4.449-13.525-4.449-13.264 0-23.998 11.402-23.998 25.476 0 9.459 4.72 17.881 11.915 22.298C674.968 397.4 706.1 450.05 706.1 510.465c0 61.451-32.228 114.913-79.706 142.391-6.907 4.464-11.479 12.594-11.479 21.827 0 14.089 10.73 25.519 23.968 25.519 5.641 0.032 12.343-3.482 12.343-3.482 61.465-36.434 103.042-106.157 103.042-186.254z m0 0M512 127.99L320.062 319.684v0.313H127.304v383.888H319.04L512 895.639h64.112V127.99H512zM319.041 639.965H192.037V383.79h128.025v0.313L512 191.883v639.739L319.041 639.965z" p-id="4459"></path></svg></buttom>'
            if (html.length != 0) {
                html += '<br />';
            } else if (!!phone && phone.length != 0) {
                html += '<span style="' + phoneStyle + '">[' + phone + '] </span><br />';
            }
            trs.forEach(element => {
                tr += element.tr[0].l.i[0] + '<br />';
            });
            html += tr;
            displaycontainer(html, element);
        }else {
            ajax(googleUrl +'zh-CN&q=', text, 1, element);
        }
    }

    // 谷歌翻译
    function google(rst, element) {
        var json = JSON.parse(rst), html = '';
        for (var i = 0; i < json.sentences.length; i++) {
            html += json.sentences[i].trans.trim();
        }
        if (!isCn) {
            //解析格式
            var arr = html.split("\\");
            if(html.charAt(html.length - 1) == "\\")arr.pop();
            for (var i in arr){
                if(!arr.hasOwnProperty(i))continue;
                var _arr = arr[i].split('>');
                var j = 'fyDom';
                var c = '';
                if (_arr.length == 1) {
                  j += '.childNodes["0"]';
                  c = TextEnCode(_arr[0]);
                } else {
                  for (var x in _arr) {
                      if(!_arr.hasOwnProperty(x))continue;
                      _arr[x] = _arr[x].replace(/\{\/\}/g, '\\');
                      //第一个是dom数组的下标
                      if (x == 0) {
                          var __arr = _arr[x].split('/');
                          for (var _x in __arr){
                              if(!__arr.hasOwnProperty(_x))continue;
                              j += '.childNodes["'+parseInt(__arr[_x])+'"]';
                          }
                      } else if (x == 1) {
                          c += TextEnCode(_arr[x]);
                      } else {
                          c += '>'+TextEnCode(_arr[x]);
                      }
                  }
                }
                j += '.nodeValue="'+c+'"';
                // console.log(j);
                //为了方便直接组成js代码,执行
                eval(j);
            }
            html = '<div style="word-wrap: break-word;word-break: normal;">' + htmlEncode($(fyDom).text()) + '</div><div style="height: 25px;position: relative;"><div id="_fy_play" style="text-align: center;border-style: solid;height: 25px;line-height:25px;right: 54px;width: 50px;display: block;position: absolute;bottom: 1px;background: #1E90FF;font-family: Microsoft YaHei;color: white;outline: none;cursor: pointer;border-radius: 3px;border-width: 0px;">朗读</div><div id="_fy_th" style="text-align: center;border-style: solid;height: 25px;line-height:25px;right: 1px;width: 50px;display: block;position: absolute;bottom: 1px;background: #1E90FF;font-family: Microsoft YaHei;color: white;outline: none;cursor: pointer;border-radius: 3px;border-width: 0px;">替换</div></div>';
        } else {
            selectText = html;
            html = '<div style="word-wrap: break-word;word-break: normal;">' + htmlEncode(html) + '</div><div style="height: 25px;position: relative;"><div id="_fy_play" style="text-align: center;border-style: solid;height: 25px;line-height:25px;right: 1px;width: 50px;display: block;position: absolute;bottom: 1px;background: #1E90FF;font-family: Microsoft YaHei;color: white;outline: none;cursor: pointer;border-radius: 3px;border-width: 0px;">朗读</div></div>';
        }
        displaycontainer(html, element);
    }

    function displaycontainer(html, element) {
        $(element).html(html).show();
    }

    //获取range
    function getFirstRange() {
        var sel = rangy.getSelection();
        return sel.rangeCount ? (sel.getRangeAt(0)).cloneRange() : null;
    }
    //处理重复的dom
    function disposeRepeatDom(node, direction) {
        var _node = node.cloneNode(true);
        _node.innerText = '';
        var brotherNode = direction ? node.previousElementSibling : node.nextElementSibling;
        if (brotherNode) {
            if (brotherNode.innerText.trim() == '') {
                node.parentNode.removeChild(brotherNode);
                return;
            }
            var _brotherNode = brotherNode.cloneNode(true);
            _brotherNode.innerText = '';
            if (_node.innerHTML == _brotherNode.innerHTML) {
                //找到textNode后设置翻译的文字+原dom文字
                setTextNode(node, brotherNode, direction);
                node.childNodes.length > brotherNode.childNodes.length ? node.parentNode.removeChild(brotherNode) : node.parentNode.removeChild(node);
            }
        }
    }
    function setTextNode(dom, brotherDom, direction) {
        if (dom.hasChildNodes() && brotherDom.hasChildNodes()) {
            for (var i in dom.childNodes) {
                var _dom = dom.childNodes[direction?i:dom.childNodes.length-1-i];
                var _brotherDom = brotherDom.childNodes[i];
                if(_dom.nodeType == 3){
                    _dom.nodeValue = _brotherDom.nodeValue = (direction ? (_brotherDom.nodeValue + _dom.nodeValue) : (_dom.nodeValue + _brotherDom.nodeValue));
                    return true;
                }else{
                    if (setTextNode(_dom, _brotherDom, direction)) return true;
                }
            }
        }
        return false;
    }
    //获取所有文本节点的内容数据
    function getDomText(dom, index) {
        if (dom.hasChildNodes()) {
            for (var i = 0, len = dom.childNodes.length; i < len; i++){
                var node = dom.childNodes[i];
                if (node.nodeType == 3) {
                    if (node.nodeValue.replace(/\s*/g,'')) {
                        _t += index+i+'>'+node.nodeValue.replace(/\\/g, "{/}")+'\\';
                    }
                } else {
                    getDomText(node,index+i+'/');
                }
            }
        }
    }
    //转实体字符
    function TextEnCode(text) {
        var str = "";
        text = text.trim();
        for (var i = 0,len = text.length; i < len; i++) {
            var temp = text.charCodeAt(i).toString(16);
            str += "\\u" + new Array(5 - String(temp).length).join("0") + temp;
        }
        return str;
    }
    function htmlEncode(str) {
        var s = "";
        if (str.length === 0) {
          return "";
        }
        s = str.replace(/&/g, "&amp;");
        s = s.replace(/</g, "&lt;");
        s = s.replace(/>/g, "&gt;");
        s = s.replace(/ /g, "&nbsp;");
        s = s.replace(/\'/g, "&#39;");//IE下不支持实体名称
        s = s.replace(/\"/g, "&quot;");
        return s;
      }
    //朗读文字
    function playSound(text, tl) {
        if (isPlay) return;
        var context = new audioContext();
        if (wavs.length <= 0) {
            var texts = text.split(/\n|\r|\n\r|(\.^0-9)|\,/g);
            for (var i in texts) {
                if (!texts[i] || !texts[i].replace(/\s+/g, "")) continue;
                var url = 'https://translate.google.cn/translate_tts?ie=UTF-8&q=' + encodeURIComponent(texts[i]) + '&tl=' + tl + '&client=gtx&.wav';
                wavs.push(new Promise(function (resolve, reject) {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: url,
                        responseType: 'arraybuffer',
                        onload: function (res) {
                            try {
                                resolve(res.response);
                            } catch (e) {
                                reject(e);
                            }
                        }
                    });
                }));
            }
        }
        Promise.all(wavs).then(play, e => console.log(e));
        function play(bufferList) {
            isPlay = true;
            var reader = new FileReader();
            var blob = new Blob(bufferList, {type: 'application/octet-binary'});
            reader.addEventListener("loadend", function() {
              var buffer = reader.result;
                context.decodeAudioData(buffer, function (buffer) {
                    var source = context.createBufferSource();
                    source.buffer = buffer;
                    source.connect(context.destination);
                    source.start(0);
              })
            });
            reader.readAsArrayBuffer(blob);
            isPlay = false;
        }
    }
    function isMobile() {
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone",
           "SymbianOS", "Windows Phone",
           "iPad", "iPod"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
           if (userAgentInfo.indexOf(Agents[v]) > 0) {
              flag = false;
              break;
           }
        }
        return !flag;
    }
    function getElementToPageTop(el) {
        var h = 0, pT = -1;
        $(el).parents().map(function () {
            if (this.offsetTop == pT) return;
            h += this.offsetTop;
            pT = h;
        });
        return h;
    }
  })();