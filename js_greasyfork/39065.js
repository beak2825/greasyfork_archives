// ==UserScript==
// @name        Google+(Baidu Bing 360 Sogou Weibo Twitter)
// @namespace   https://github.com/guyigenius/Google-Baidu-Bing-360-Sogou-Weibo-Twitter
// @version     1.6.0
// @description Show results from Baidu, Bing, 360, Sogou, Weibo and Twitter in Google web search. | 在Google网页搜索显示百度、必应、360、搜狗、微博和Twitter的搜索结果。
// @include     /^https:\/\/www\.google\..*?q=.*?$/
// @license     MPL
// @connect     www.baidu.com
// @connect     www.bing.com
// @connect     www.so.com
// @connect     www.sogou.com
// @connect     www.google.com.hk
// @connect     weibo.com
// @connect     twitter.com
// @grant       GM_log
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/39065/Google%2B%28Baidu%20Bing%20360%20Sogou%20Weibo%20Twitter%29.user.js
// @updateURL https://update.greasyfork.org/scripts/39065/Google%2B%28Baidu%20Bing%20360%20Sogou%20Weibo%20Twitter%29.meta.js
// ==/UserScript==

(function () {

    // only shown in normal search page
    if (document.location.href.indexOf('&tbs=') != -1 || document.location.href.indexOf('&tbm=') != -1) return;

    //  ===Config START | 设置开始===

    // Show external results only on the first page? 0-no, 1-yes | 设置是否只在第一页显示？0-否，1-是
    var onlyPageOne = 1;

    // **The following two lines are not for config, do not modify. | **以下两行并非设置项，请勿修改！
    var _q = document.location.search || document.location.href.substring(document.location.href.indexOf('&') - 1);
    if (onlyPageOne && _q.indexOf('&start=') >= 0 && _q.indexOf('&start=0') < 0) return;

    // Show how many top results | 设置显示头几个搜索结果。
    var resultNumber = 3;

    // Wait for how many minisecond to obtain results | 设置获取搜索结果超时时间（毫秒）。
    var resultTimeout = 30000;

    // Select which engines' results will be obtained from | 设置外部搜索引擎。
    // Structure: Al_xSearch[x] = [[0],[1],[2],[3],[4],[5]];
    // Rules: Al_xSearch[x][0] - the name of the engine | 搜索引擎的名字。
    //        Al_xSearch[x][1] - switch, 1-on, 0-off. | 开关，1－启用，0－禁用。
    //        Al_xSearch[x][2] - the id of the box to contain results | 结果框的 ID。
    //        Al_xSearch[x][3] - the query Url of the engine | 搜索引擎的搜索 Url。
    //        Al_xSearch[x][4] - the xpath to find a result | 搜索结果的 xpath。
    //        Al_xSearch[x][5] - the highlight pattern (selector) | 高亮部分的格式（选择器）。
    //        x - the displaying order. | 显示顺序。
    var Al_xSearch = [];
    Al_xSearch.push(['Baidu', 1, 'baiduResult', 'https://www.baidu.com/s?wd=--keyword--', '//*[@id="--i--"]', 'em']);
    Al_xSearch.push(['Bing', 1, 'bingResult', 'https://www.bing.com/search?q=--keyword--', '//li[@class="b_algo"][--i--]', 'strong']);
    Al_xSearch.push(['360', 1, '360Result', 'https://www.so.com/s?q=--keyword--', '//li[@class="res-list"][--i--]', 'em']);
    Al_xSearch.push(['Sogou', 1, 'sogouResult', 'https://www.sogou.com/web?query=--keyword--', '//div[@class="results"]/div[--i--]', 'em']);
    Al_xSearch.push(['GoogleCN', 1, 'gcnResult', 'https://www.google.com.hk/search?q=--keyword--', '//div[@class="g"][--i--]', 'em']);
    Al_xSearch.push(['Weibo', 1, 'weiboResult', 'https://s.weibo.com/weibo/--keyword--', '//div[@class="WB_cardwrap S_bg2 clearfix"][--i--]', 'em']);
    Al_xSearch.push(['Twitter', 1, 'twitterResult', 'https://twitter.com/search?q=--keyword--', '//li[@class="js-stream-item stream-item stream-item "][--i--]', 'strong']);

    //  ===Config END | 设置结束===
    var isHash = !!document.location.hash;

    setTimeout(go, 1000);

    function go() {

        // rebuild array
        var A_xSearch = [];
        for (let l = 0, m = 0; l < Al_xSearch.length; l++) { //log('53:'+l+','+m);
            if (!Al_xSearch[l][1]) continue;
            A_xSearch[m] = [Al_xSearch[l][0], Al_xSearch[l][1], Al_xSearch[l][2], Al_xSearch[l][3], Al_xSearch[l][4], Al_xSearch[l][5]];  //log('59:'+Al_xSearch[l][3]+','+A_xSearch[m][3]);
            m += 1;
        }
        var A_xSearch_l = A_xSearch.length; //log('61:'+A_xSearch_l);

        var _ID = 'resultPlus';
        var _xID = '#' + _ID;

        var b;
        _q = document.location.search || document.location.href.substring(Math.max(document.location.href.indexOf('#'), document.location.href.indexOf('&')) - 1);
        //log('69:'+_q);
        // Prepare frame 0
        var gcnt = document.evaluate('//div[@id="cnt"]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
        if (!gcnt) { setTimeout(go, 300); return; }
        var googlecol = document.evaluate('//div[@id="center_col"]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
        var gdivs = document.evaluate('//div[@class="s"]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
        contentwidth = (!!gdivs) ? gdivs.offsetWidth : 500;  //log(contentwidth);
        var b_width = Math.min(600, gcnt.offsetWidth - (googlecol.offsetLeft + contentwidth + 32 + 30));
        // googlecol.setAttribute('style', 'margin-right:' + (b_width + 15) + 'px !important;');

        // Style sheets
        var bstyle = 'position:relative;background:white;z-index:10;width:' + b_width + 'px;';
        var cstyle = 'border-top:1px solid #7799cc;background:#aaccff;';
        var close_style = _xID + ' .close{float:right;padding:0 10px;}' +
            _xID + ' .close:hover{outline:1px solid #731616;outline-offset:-1px;background-color:#F28E8E!important;color:#731616!important;}';
        var glo_style = _xID + ' p, ' + _xID + ' ul{margin:0; padding:0;}' +
            _xID + ' a{color:#2626A8;}' + _xID + ' li{list-style:none outside none;}' +
            _xID + '{line-height:130%;border-bottom:1px solid #AACCFF;border-left:1px dotted #C9D7F1;}' +
            // _xID + ' div._result *{position:relative!important;}' +
            _xID + ' div._result, .GoogleSpecial>div{max-height:125px;margin-bottom:5px;background:white;overflow:hidden;transition:max-height 0.2s ease 0.3s;}' +
            _xID + ' ._resultMore{max-height:none!important;}' +
            _xID + ' div._result h3, ' + _xID + ' div._result h2{font-size:13pt!important; border-bottom:1px solid white; margin-bottom:2px;}' +
            _xID + ' div._result:hover, .GoogleSpecial>div:hover{max-height:100000px; margin-bottom:0px; padding-bottom:5px; background:#F0F7F9; transition:max-height 0.2s ease 0s;}' +
            _xID + ' div._result:hover h3, ' + _xID + ' div._result:hover h2{border-bottom:1px solid #a7cDd6;}' +
            _xID + '>div>*{height:auto!important;}._hilire{background:#ffd!important;background:-moz-linear-gradient(top, #ffd, white)!important;background:-webkit-gradient(linear, 0 0, 0 100%, from(#ffd), to(white))!important;}' +
            _xID + ' ._re_hide>div,' + _xID + ' ._no_result{display:none;}' +
            _xID + ' ._re_more{display:block;height:20px;width:100%;text-align:center;background:#ddd;cursor:pointer;}' +
            _xID + ' ._re_more:hover{background:#F0F7F9!important;}' +
            _xID + ' ._re_hide ._re_more{background:white;}' +
            _xID + ' div._result+div._result,' + _xID + ' ._resultMore{border-top:1px solid #aaccff;}' +
            _xID + ' .GoogleSpecial a{margin-left:0px;}';// + _xID + ':hover{width:400px !important;border-left:2px solid #7799cc;}';
        var ex_style = '._external{color:black!important;} ._external:after{content:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAMAAAC67D+PAAAAFVBMVEVmmcwzmcyZzP8AZswAZv////////9E6giVAAAAB3RSTlP///////8AGksDRgAAADhJREFUGFcly0ESAEAEA0Ei6/9P3sEcVB8kmrwFyni0bOeyyDpy9JTLEaOhQq7Ongf5FeMhHS/4AVnsAZubxDVmAAAAAElFTkSuQmCC");}';
        var tablestyle = _xID + ' td{padding:5px 0 5px 13px !important;color:#000!important;}' +
            _xID + ' tr+tr>td{padding:0px 0 8px 13px !important;}' + _xID + ' td>h3{margin-left:-8px;line-height:1.3em;}';
        var li_style = _xID + ' div._result>li{padding:5px 0 8px 13px !important;background-image:none;}' +
            _xID + ' li h3>a:first-child,' + _xID + ' li h3>em{font-size:13pt !important;margin-left:-8px;}' +
            _xID + ' li>div, ' + _xID + ' li>p{font-size:small;}';
        var mat_style = _xID + ' div._match{background:#eee; background:-moz-linear-gradient(top, #eee, white); background:-webkit-gradient(linear, 0 0, 0 100%, from(#eee), to(white)); max-height:1.1em;}' + _xID + ' div._match:hover{max-height:1000px;}';
        var gs_style = /*Google Special*/'.GoogleSpecial div.newsimg>a>div{position:relative!important;} .GoogleSpecial div[id="imagebox_bigimages"]{margin:0px !important;} .GoogleSpecial g-section-with-header{margin:0px;}';
        var bd_style = /*Baidu style*/'div[id^="baiduResult_"]>div{padding:5px 0 8px 13px !important;} div[id^="baiduResult_"] h3{margin-left:-8px;line-height:1.3em;} div[id^="baiduResult_"] .favurl{background-position:left center;background-repeat:no-repeat; padding-left:16px;} div[id^="baiduResult_"] div.c-row a.c-span6{float: left;margin-right: 17px;} div[id^="baiduResult_"] div.c-row .g{margin-bottom: 0;}' + 
            /*Baidu web cache*/'div[id^="baiduResult_"] .f13 .c-tools{display: inline;}';
        var bg_style = /*Bing style*/'div[id^="bingResult_"] .crch, div[id^="bingResult"] .sb_tsuf{display:none!important;} h2{margin:5px 0; font-size:13pt !important; font-weight:400 !important;}';
        var sz_style = /*360 style*/'div[id^="360Result_"]{width:calc(540px + 13px);}; div[id^="360Result_"] .res-list{line-height:20px;} div[id^="360Result_"] .res-rich .res-comm-img{float:left; width:120px;} div[id^="360Result_"] .res-rich .res-comm-con{float:right; overflow:hidden; width:408px;} div[id^="360Result_"] div[id="mohe-biu_caipu_food2"] .res-title{overflow:visible !important;}';
        var sg_style = /*Sogou style*/'div[id^="sogouResult_"]>div{padding:5px 0 8px 13px !important;background-image:none;} div[id^="sogouResult_"]>div>h3{margin-left:-8px;} div[id^="sogouResult_"] .tit-ico{background-position:left 1px;background-repeat:no-repeat;padding-left:20px;}';
        var gc_style = /*GoogleCN style*/'div[id^="gcnResult_"]>div{padding:5px 0 8px 13px !important; margin:0;}';

        // Get keyword
        var googlekeyword;
        _q = _q.slice(1).replace('#', '&');
        if (_q.length > 0) {
            var qspairs = _q.split('&');
            for (let k = 0; k < qspairs.length; k++) {
                if (qspairs[k].indexOf('q=') == 0) { googlekeyword = qspairs[k].substring(2); break; }
            }
        }  //log('115:'+googlekeyword);

        // Prepare frame 1
        var googleframe = document.evaluate('//div[@id="rcnt"]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
        googleframe.style.position = 'relative';
        var googlestyle = '#res>h2+div,#res>div.e,div#navcnt,div.clr{max-width:840px !important;}#res{max-width:1400px!important;}#iur{height:auto!important;}span.bl{display:none!important;}span.gl{white-space:normal!important;}#nyc{z-index:11!important;}.ds{z-index:9!important;}.mw{max-width:95%;}';

        var A_hili_s = [];
        var A_xS_box = [];

        for (let a = 0; a < A_xSearch_l; a++) {
            A_xS_box[a] = [];
            A_xSearch[a][3] = A_xSearch[a][3].replace('--keyword--', googlekeyword);
            A_hili_s[a] = _xID + ' ' + A_xSearch[a][5];
        }

        //highlight keyword style
        var hili_style = A_hili_s.join(',') + '{color:#CC0033 !important;}';

        //fix google onebox result
        // var gm_style = /*Google Onebox right-sided result*/ `div#rhscol{min-width:0px!important;}
        //     div#rhs{position:absolute!important; top:0px; margin-left:0px!important; max-width:500px!important; width:auto!important; transition:transform 0.2s ease 0.3s; transform:scale(0.35); transform-origin:0 0; -webkit-transition:transform 0.2s ease 0.3s; -webkit-transform:scale(0.35); -webkit-transform-origin:0 0; z-index:30000;}
        //     #rhs .rhsvw{max-width:420px!important; margin-top:0!important; border-bottom:1px solid #d7d7d7!important;}
        //     #rhs #rhs_block{width:auto!important;}
        //     #rhs #rhs_block>ol>li>div{margin-bottom:0!important;background:white;}
        //     div#lu_pinned_rhs{overflow:visible!important;}
        //     #rhs div#lu_pinned_rhs .rhsvw{width:366px!important; padding:0!important;}
        //     #rhs div#lu_pinned_rhs .rhsvw>div{margin:0!important;}
        //     div#rhs:hover{height:auto!important; transition:transform 0.2s ease 0s; transform:scale(1); transform-origin:0 0; -webkit-transition:transform 0.2s ease 0s; -webkit-transform:scale(1); -webkit-transform-origin:0 0;}
        //     #rhs_block{width:auto!important; height:auto!important;}
        //     ._T2{padding-bottom:0px!important;}
        //     div#rhs .kp-blk, .rhsvw{background-color:white;}`;
        var gm_style = ``;

        // Insert CSS
        var headID = document.getElementsByTagName('head')[0];
        var cssNode = creaElemIn('style', headID);
        cssNode.type = 'text/css';
        cssNode.innerHTML = close_style + glo_style + ex_style + tablestyle + li_style + hili_style + googlestyle + mat_style + gs_style + bd_style + bg_style + sz_style + sg_style + gm_style + gc_style;

        // Prepare links
        var lis = document.evaluate('//li[@class="g"]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        var gooRes = [], gooRelnkh = [], gooResNo = 0;
        var speIDs = /imagebox_bigimages|imagebox|newsbox|videobox|blogbox/;
        for (let h = 0; h < lis.snapshotLength; h++) {
            if (speIDs.test(lis.snapshotItem(h).id)) continue;
            gooRes.push(lis.snapshotItem(h));
            gooResNo++;
            lis.snapshotItem(h).title = '第 ' + gooResNo + ' 结果';
            var lnks = lis.snapshotItem(h).getElementsByTagName('a');
            gooRelnkh.push((lnks[0].href) ? lnks[0].href.toLowerCase() : lnks[1].href.toLowerCase()); //deal with my Google Link Preview [hzhbest mod]
        }

        // Prepare frame 2
        resultbox(googleframe, A_xSearch_l);
        // 保持Google越来越多情况各异的汇总结果，不再特殊处理。
        // moveGoogleSpecialResult();

        // Add results
        for (let l = 0; l < A_xSearch_l; l++) {
            addresult(A_xSearch[l], A_xS_box[l]);
        }

        // Refresh as keyword change in Instant Search mode
        if (isHash) window.addEventListener('hashchange', function (e) {
            command_close();
            go();
        }, false);

        // FUNCTIONS
        // Send a request
        function addresult(A_x, A_elem) { //log('187:'+A_x[3]);
            var timeout = function () { for (let i = 0; i < resultNumber; i++) { set(A_elem[i], (i == 0) ? '-Timeout!-' : ''); } };
            var errortimer = setTimeout(timeout, resultTimeout);
            var option = {
                method: 'GET',
                url: A_x[3],
                onload: function (_h) {
                    clearTimeout(errortimer);
                    var _Node = document.createElement('div');
                    _Node.innerHTML = _h.responseText;
                    initresult(A_x[4], _Node, A_elem, A_x[0]);
                }
            };
            GM_xmlhttpRequest(option);
        }

        // Initialize results
        function initresult(_xpath, _Node, A_elem, sname) {
            var _result = [], _resultLink, _resultLinkHref;
            for (let i = 0; i < 10; i++) { _result[i] = (i == 0) ? '-No-Result-</br>请点击上方链接进入网站搜索' : ''; }

            for (let i = 0, j = 0; i < 12; i++) { //i for actual results, j for accepted results that go to containers
                var i_xpath = _xpath.replace('--i--', (i + 1));
                var _h_re = document.evaluate(i_xpath, _Node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
                //log(sname+' i '+i);
                if (_h_re == null) { //log(sname+' j '+j);
                    if (j <= resultNumber && resultNumber != 10) A_elem[resultNumber].parentNode.className = '_no_result';
                    break;
                } else {  //log(sname+' j '+j);
                    //Baidu result filter
                    //if (sname == 'Baidu' && _h_re.className == 'result-op') continue;
                    if (sname == 'Baidu' && _h_re.getAttribute('mu') && _h_re.getAttribute('mu').indexOf('app.baidu.com/') != -1) continue;

                    //Baidu Tieba img width fix
                    if(sname == 'Baidu' && _h_re.getAttribute('mu') && _h_re.getAttribute('mu').indexOf('tieba.baidu.com/') != -1) {
                        let Imgs = _h_re.getElementsByClassName('c-img4');
                        if (Imgs.length !== 0) {
                            Imgs[0].setAttribute('width', '75px');
                        }
                    }

                    //Bing img url fix
                    if (sname == 'Bing') {
                        fixbmg(_h_re);
                        if (!_h_re.firstChild || (!_h_re.firstChild.firstChild && !_h_re.firstChild.nextSibling) || (_h_re.firstChild.localName == 'script' && !_h_re.firstChild.nextSibling)) continue;
                    }

                    //360 img url fix
                    if (sname == '360') fix360(_h_re);
                    
                    //GoogleCN result filter
                    if (sname == 'GoogleCN' && _h_re.getAttribute('id') && _h_re.getAttribute('id') === 'imagebox_bigimages') continue;

                    _result[j] = getoutterHTML(_h_re);

                    // check link
                    _resultLinks = _h_re.getElementsByTagName('a');
                    if (!_resultLinks[0]) continue;
                    _resultLink = (_resultLinks[0].href) ? _resultLinks[0] : _resultLinks[1]; //deal with my Google Link Preview [hzhbest mod]
                    if (_resultLink) {
                        _resultLinkHref = _resultLink.href.toLowerCase();
                        for (let p in gooRelnkh) {
                            if (_resultLinkHref == gooRelnkh[p] || (sname == 'Bing' && _resultLinkHref + '/' == gooRelnkh[p])) {  //deal with bing's result url
                                A_elem[j].className = '_match';
                                // A_elem[i].title = 'Google Result #' + (Number(p)+1);
                                _result[j] = '同 Google 第 <b>' + (Number(p) + 1) + '</b> 结果' + _result[j];
                                if (gooRes[p].className.indexOf('_hilire') == -1) {
                                    gooRes[p].className += ' _hilire';
                                    gooRes[p].title += '；同时为 ' + sname + ' 第 ' + (j + 1) + ' 结果';
                                } else {
                                    gooRes[p].title += '及 ' + sname + ' 第 ' + (j + 1) + ' 结果';
                                }
                            }
                        }
                    }
                    j++;
                    //if (j == resultNumber) break;
                    if (j == 10) break;
                }

            }
            for (let i = 0; i < 10; i++) {
                set(A_elem[i], _result[i]);
                if (_result[i]) A_elem[i].className += ' _result';
            }
        }

        // Construct result boxes
        function resultbox(dest, _l) {
            //main frame
            if (_l != 0) {
                // 针对Google搜索的特殊处理，多站点搜索结果展示样式，显示在右侧Google汇总信息（id="rhs"）后。
                // 如果id="rcnt"的googleframe内存在id="rhs"，则直接附加到该节点的子节点列表的末尾处。否则按原始逻辑处理。
                var rhsFrame = dest.querySelector('#rhs');
                if (rhsFrame) {
                    b = creaElemIn('div', rhsFrame);
                    b.id = _ID;
                    b.setAttribute('style', bstyle + 'margin-left:-21px;');
                } else {
                    b = creaElemIn('div', dest);
                    b.id = _ID;
                    b.setAttribute('style', bstyle);
                }
            }
            //engine frame
            var c_first = true;
            for (let j = 0; j < _l; j++) {
                //name frame
                c = creaElemIn('div', b);
                c.setAttribute('style', cstyle);
                c.id = A_xSearch[j][2];
                d = creaElemIn('a', c);
                addtext(d, A_xSearch[j][0] + ' ');
                d.href = A_xSearch[j][3];
                d.className = '_external';
                if (c_first) { //close button on first engine name frame
                    close_button = creaElemIn('a', c);
                    close_button.href = '#';
                    close_button.className = 'close';
                    close_button.addEventListener('click', command_close, false);
                    close_button.innerHTML = 'X';
                    close_button.title = '关闭';
                    c_first = false;
                }
                //result frame
                for (let k = 0; k < resultNumber; k++) {
                    A_xS_box[j][k] = creaElemIn('div', b);
                    A_xS_box[j][k].id = A_xSearch[j][2] + '_' + (k + 1);
                    A_xS_box[j][k].innerHTML = (k == 0) ? 'Loading...' : '...';
                }
                //result more frame
                if (resultNumber == 10) continue;
                e = creaElemIn('div', b);
                e.className = '_resultMore _re_hide';
                e.id = A_xSearch[j][2] + 'More';
                for (let k = resultNumber; k < 10; k++) {
                    A_xS_box[j][k] = creaElemIn('div', e);
                    A_xS_box[j][k].id = A_xSearch[j][2] + '_' + (k + 1);
                }
                //result expand button
                f = creaElemIn('a', e);
                f.className = '_re_more';
                f.innerHTML = '↓展开↓';
                f.title = '展开更多结果';
                f.href = '#' + A_xSearch[j][2];
                f.addEventListener('click', function (ev) {
                    if (isHash) ev.preventDefault();
                    s = (this.parentNode.className == '_resultMore _re_hide') ? true : false;
                    this.parentNode.className = (s) ? '_resultMore ' : '_resultMore _re_hide';
                    this.innerHTML = (s) ? '↑收起↑' : '↓展开↓';
                    this.title = (s) ? '收起更多结果' : '展开更多结果';
                    if (isHash) move(this.parentNode.previousSibling.previousSibling.previousSibling);
                }, false);
            }
        }

        // Close result boxes
        function command_close() {
            headID.removeChild(cssNode);
            googleframe.removeChild(b);
        }

        // Set content
        function set(elem, htmlNode) {
            elem.innerHTML = htmlNode;
        }

        // Get full HTML nodes in string
        function getoutterHTML(elem) {
            var a = elem.attributes, str = '<' + elem.tagName;
            for (let i = 0; i < a.length; i++)
                if (a[i].specified)
                    str += ' ' + a[i].name + '="' + a[i].value + '"';
            if (!canHaveChildren(elem))
                return str + '/>';
            return str + '>' + elem.innerHTML + '</' + elem.tagName + '>';
        }
        function canHaveChildren(elem) {
            return !/^(area|base|basefont|col|frame|hr|img|br|input|isindex|link|meta|param)$/.test(elem.tagName.toLowerCase());
        }

        // Add text node
        function addtext(obj, text) {
            var content = document.createTextNode(text);
            obj.appendChild(content);
        }

        // 修复Bing图片地址
        function fixbmg(_resultcontent) {
            var Imgs = _resultcontent.getElementsByTagName('img');
            if (!Imgs[0]) return;
            for (let _i = 0; _i < Imgs.length; _i++) {
                if (Imgs[_i].src && Imgs[_i].src.indexOf('http://') != 0) {
                    Imgs[_i].src = 'http://www.bing.com' + Imgs[_i].src;
                }
            }
        }

        // 修复360图片地址
        function fix360(_resultcontent) {
            var Imgs = _resultcontent.getElementsByTagName('img');
            if (!Imgs[0]) return;
            for (let _i = 0; _i < Imgs.length; _i++) {
                if (Imgs[_i].src === '') {
                    Imgs[_i].src = Imgs[_i].getAttribute('data-isrc');
                }
            }
        }

        // Move Google special results right
        // function moveGoogleSpecialResult() {
        //     var sb = b.insertBefore(document.createElement('div'), b.firstChild);
        //     sb.className = 'GoogleSpecial';
        //     var spReIDs = ['imagebox_bigimages', 'imagebox', 'newsbox', 'videobox', 'blogbox']; //lclbox,
        //     for (let i = 0; i < spReIDs.length; i++) {
        //         var sr = document.getElementById(spReIDs[i]);
        //         if (sr) {
        //             if (!!sr.previousSibling && sr.previousSibling.className == 'head') sr.insertBefore(sr.previousSibling, sr.firstChild);
        //             if (sr.id == 'imagebox_bigimages') {
        //                 var ire = document.evaluate('//div[@id="iur"]/div', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
        //                 ire.style.height = 'auto';
        //                 // var bots = document.getElementById('botstuff');
        //                 // sr.appendChild(bots);
        //             }
        //             if (sr.id == 'videobox') {
        //                 var vre = document.evaluate('//div[@class="vresult"]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        //                 for (let j = 0; j < vre.snapshotLength; j++) {
        //                     sr.appendChild(vre.snapshotItem(j));
        //                 }
        //             }
        //             var sri = creaElemIn('div', sb);
        //             sri.appendChild(sr);
        //         }
        //     }
        // }

        // Create and insert an element
        function creaElemIn(tagname, destin) {
            var theElem = destin.appendChild(document.createElement(tagname));
            return theElem;
        }

        // scroll node into view
        function move(node) {
            if (!node) return;
            if (node.getBoundingClientRect) {
                var pos = node.getBoundingClientRect();
                /*var pos_h = node.offsetHeight;*/
                document.documentElement.scrollTop = document.body.scrollTop = pos.top + window.pageYOffset - window.innerHeight / 10;
            } else {
                node.scrollIntoView();
            }
        }
    }

    function log(message) {
        // if (typeof console == 'object') {
        // console.log(message);
        // }
        // else {
        GM_log(message);
        // }
    }
})();
