// ==UserScript==
// @name         Free Yun Keys
// @name:zh      免密百度网盘
// @namespace    http://zszen.github.io/
// @version      6.2
// @description  免掉百度网盘写密码的麻烦，包括解析短网址和跳转链接，多链接支持
// @author       Zszen John
// @grant GM.getValue
// @grant GM.setValue
// @grant GM.deleteValue
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_xmlhttpRequest
// @match        https://www.lookae.com/*
// @match        https://www.soft5566.com/*
// @match        https://pan.baidu.com/*
// @include     https://*
// @include     http://*
// @note        2021.03-07 v6.0 优化了解析，准确解析lookae和ali213，其他的网站暂时使用父级搜索
// @note        2020.07-26 v5.0 添加回对二次跳转的非百度云链接进行解析
// @note        2020.07-24 v4.0 支持自动下载，可按钮切换
// @note        2020.07-23 v3.0 修复错误， 去掉jquery
// @note        2020.07-21 v1.0 初步支持自动跳转，自动解析链接
// @downloadURL https://update.greasyfork.org/scripts/407200/Free%20Yun%20Keys.user.js
// @updateURL https://update.greasyfork.org/scripts/407200/Free%20Yun%20Keys.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var label = 'Zszen '
    var isAutoDownload = true;
    var regexp_codeback = /#([a-zA-Z0-9]{4})/
    //var regexp_code = /(码|问)[\s|:|：]*([a-zA-Z0-9]{4})/
    var regexp_code = /(提取码|密码)[\s|:|：]*([a-zA-Z0-9]{4})/
    var regexp_url = /(https:\/\/pan.baidu.com\/.*?\/(\d|\w|-)+)/
    var url = window.location.href;
    var res = /\/\/(.+?\..*?)(\/|\?)/.exec(url);
    var site = res[1];
    if(site=="pan.baidu.com"){//parse
        var pss = regexp_codeback.exec(url);
        var inputs = ELs('input');
        var as = ELs('a', el=>el.textContent.indexOf('提取文件')>=0);
        if(pss!=null && pss.length>1 && inputs.length>0 && as.length>0){
            console.log(label,'pan get');
            inputs[0].value = pss[1];
            as[0].click()
        }else{
            console.log(label,'pan download');
            //<a class="g-button" data-button-id="b7" data-button-index="4" href="javascript:;" title="举报"><span class="g-button-right"><span class="text" style="width: auto;">举报</span></span></a>
            //ELs('a',el=>{return el.title=='举报'}, el=>el.style.display = 'none');
            var check_simbols = ['x','v']
            ELs('a',el=>{return el.title.indexOf('保存到手机')>=0}, el=>{
                var bl = GM_getValue("auto_download")
                var a = document.createElement('a');
                a.className = 'g-button autodownload'
                a.href="javascript:;"
                a.title="["+check_simbols[bl?1:0]+"]自动下载";
                var span = document.createElement('span')
                span.className = 'g-button-right'
                a.appendChild(span)
                var span2 = document.createElement('span')
                span2.className = 'text'
                span2.style.width = 'auto'
                span.appendChild(span2);
                span2.textContent = a.title
                el.parentElement.insertBefore(a, el.nextElementSibling)
                //
                a.addEventListener('click',()=>{
                    var bl = GM_getValue("auto_download")
                    if(bl==null)bl=false;
                    bl = !bl;
                    GM_setValue("auto_download", bl)
                    a.title="["+check_simbols[bl?1:0]+"]自动下载";
                    span2.textContent = a.title
                });
            })
            setTimeout(()=>{
                var bl = GM_getValue("auto_download")
                if(bl!=true){

                    return;
                }
                var ads = ELs('a', el=>{return el.title=='下载'});
                if(ads.length>0){
                    var sels = ELs('span', el=>el.className == 'EOGexf');
                    for(var i=0; i<sels.length; i++){
                        sels[i].click();
                    }
                    ads[0].click();
                }else{
                    ELs('a', el=>{return el.title.indexOf('下载')>=0})[0].click();
                }
            }, 1000);
        }
    }else{//deal
        console.log(label,'pan find');
        ELs('a',
            (el)=>{
            var res = regexp_url.test(el.href);
            if(res)return res;
            res = regexp_code.test(el.parentElement.textContent)
            if(res)return res;
            res = regexp_code.test(el.textContent)
            if(res)return res;
            if(el.nextSibling!=null){
                res = regexp_code.test(el.nextSibling.textContent)
                if(res)return res;
            }
            return false;
        },
            el=>{
            //var ps = regexp_code.exec(el.parentElement.textContent)
            var ps = [];
            if(site=="www.lookae.com"){//parse
                ps = regexp_code.exec(el.nextSibling.textContent)
            }else if(site=="www.soft5566.com"){//parse ali213
                ps = regexp_code.exec(el.textContent)
            }else{
                ps = regexp_code.exec(el.textContent);
                if((ps==null || ps.length<3) && el.nextSibling!=null) {
                    ps = regexp_code.exec(el.nextSibling.textContent);
                }
                if(ps==null || ps.length<3){
                    ps = RECURSION_EXP(el, regexp_code, 4);
                    console.log(":::",ps);
                }
            }
            if(ps!=null && ps.length>=3){
                if(regexp_url.test(el.href)){
                    el.href=el.href+'#'+ps[2]
                }else{
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: el.href,
                        onload: (res)=>{
                            //console.log(res.responseText);
                            var urls = regexp_url.exec(res.responseText);
                            if(urls && urls.length>1){
                                el.href=urls[1]+'#'+ps[2];
                            }
                        }
                    });
                }
            }
        });
    }

    function RECURSION_EXP(el, exp, level){
        //console.log("::::",el)
        if(level>0){
            var ps = exp.exec(el.parentNode.textContent);
            if(ps==null || ps.length<3){
                return RECURSION_EXP(el.parentNode,exp,level-1);
            }else{
                return ps;
            }
        }
        return [];
    }

    //
    function ELs(tagName, conditionFun, dealFun, parent){
        if(parent==null) parent = document;
        var tags = [...parent.getElementsByTagName(tagName)];
        if(conditionFun){
            tags = tags.filter(conditionFun);
        }
        if(dealFun){
            tags.forEach(dealFun);
        }
        return tags;
    }

    //DivMaker('<a class="aaa" href="123">asdfasdf <h1></a>', 'height:100px', 'a.aaa { color: green; }')
    function DivMaker(innerHtml, styleString, cssString){
        var divNode = document.createElement("div");
        divNode.innerHTML = innerHtml;
        document.body.appendChild(divNode);
        if(styleString){
            divNode.style = styleString;
        }
        if(cssString){
            var style = document.createElement('style');
            style.appendChild(document.createTextNode(cssString));
            divNode.appendChild(style);
        }
    }

})();