// ==UserScript==
// @name         QuickSearch
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  快速搜索关键词，半批量!
// @author       AOQ
// @match        https://*.findic.com/*
// @match        http://*.findic.com/*
// @match        https://*.szlcsc.com/*
// @match        http://*.szlcsc.com/*
// @match        https://*.ickey.cn/*
// @match        http://*.ickey.cn/*
// @match        https://*.ichunt.com/*
// @match        http://*.ichunt.com/*
// @match        https://*.hqchip.com/*
// @match        http://*.hqchip.com/*
// @match        https://*.hqbuy.com/*
// @match        http://*.hqbuy.com/*
// @match        https://*.hqew.com/*
// @match        http://*.hqew.com/*
// @match        https://*.icbase.com/*
// @match        http://*.icbase.com/*
// @match        https://*.rightic.cn/*
// @match        http://*.rightic.cn/*
// @match        https://*.ichub.com/*
// @match        http://*.ichub.com/*
// @match        https://*.findchips.com/*
// @match        http://*.findchips.com/*
// @match        https://*.infinigo.com/*
// @match        http://*.infinigo.com/*
// @match        https://*.allchips.com/*
// @match        http://*.allchips.com/*
// @match        https://*.elecfans.com/*
// @match        http://*.elecfans.com/*
// @match        https://*.mouser.cn/*
// @match        http://*.mouser.cn/*
// @match        https://*.arrow.cn/*
// @match        http://*.arrow.cn/*
// @match        https://*.ti.com/*
// @match        http://*.ti.com/*
// @match        https://*.iceasy.com/*
// @match        http://*.iceasy.com/*
// @match        https://*.ttic.cc/*
// @match        http://*.ttic.cc/*
// @match        https://*.114ic.cn/*
// @match        http://*.114ic.cn/*
// @match        https://*.icdeal.com/*
// @match        http://*.icdeal.com/*
// @match        https://*.b2b.baidu.com/*
// @match        http://*.b2b.baidu.com/*
// @match        https://*b1b.com/*
// @match        http://*b1b.com/*
// @icon         https://static.ickimg.com/assets/release3.001/img/icon/favicon_front.ico
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license      MPL License
// @downloadURL https://update.greasyfork.org/scripts/465895/QuickSearch.user.js
// @updateURL https://update.greasyfork.org/scripts/465895/QuickSearch.meta.js
// ==/UserScript==

(function () {
    if (typeof ($) == 'undefined' && document.head) {
        var jqueryScript = document.createElement('script');
        jqueryScript.src = 'https://cdn.bootcdn.net/ajax/libs/jquery/3.6.1/jquery.min.js';
        document.head.appendChild(jqueryScript);

    }
    addStyle();

    unsafeWindow.qs_icSites = ["findic.com",
        "szlcsc.com",
        "ickey.cn",
        "ichunt.com",
        "hqchip.com",
        "hqbuy.com",
        "hqew.com",
        "icbase.com",
        "rightic.cn",
        "ichub.com",
        "findchips.com",
        "infinigo.com",
        "allchips.com",
        "elecfans.com",
        "mouser.cn",
        "arrow.cn",
        "ti.com",
        "iceasy.com",
        "ttic.cc",
        "114ic.cn",
        "icdeal.com",
        "b2b.baidu.com",
        "b1b.com"
    ];
    unsafeWindow.qs_icSearchUrls = ["https://www.findic.com/search?page=1&key=",
        "https://so.szlcsc.com/global.html?k=",
        "https://search.ickey.cn/?keyword=",
        "https://www.ichunt.com/s/?k=",
        "https://www.hqchip.com/search/{0}.html",
        "https://www.hqbuy.com/search/",
        "https://s.hqew.com/{0}.html",
        "http://www.icbase.com/ProResult.aspx?w=",
        "http://rightic.cn/search#/part=",
        "https://www.ichub.com/portal/qa_line?keyword=",
        "https://www.findchips.com/search/",
        "https://www.infinigo.com/s?wd={0}&search_type=all",
        "https://www.allchips.com/search?key={0}&type=1&sp=1",
        "https://s.elecfans.com/s?type=0&keyword=",
        "https://www.mouser.cn/c/?q=",
        "https://www.arrow.cn/arrow_product/product/search?keyword=",
        "https://www.ti.com/sitesearch/en-us/docs/universalsearch.tsp?langPref=en-US&searchTerm=#q={0}&numberOfResults=25",
        "https://www.iceasy.com/supply/search-list?keyword=",
        "https://www.ttic.cc/icpdf/{0}.html",
        "https://www.114ic.cn/{1}/{0}.html",
        "https://www.icdeal.com/s/{0}/",
        "https://b2b.baidu.com/s?q=",
        "https://www.b1b.com/Search/{0}/"
    ];


    unsafeWindow._thehost = location.host.toLowerCase();
    unsafeWindow.icQSWeb = {
        init: function () {

            let _icQSHtml = `<i class="qs_ic_sqhl">↑收↑</i><div id='icQS' style="position:fixed;right:0px; top:0px; height:100%; width:250px; line-height:24px; background-color:#eee; z-index: 99999999;">
            <h3 style="text-align: center;background-color: #30403c;color: #fff; font-size: 16px;">快速便捷查询型号</h3>

			<div id="j_inputmodels"><textarea type="text" id="i_model" placeholder="粘贴型号一行一个&#10;(可从excel复制)&#10;输入后点击下面型号自动跳转&#10;自动缓存" style="width:98%;font-size: 12px;min-height:100px;border: solid 2px green;"></textarea>
			</div>
			<div id="j_models" style="overflow: auto;height: 88%;padding-left: 3px;padding-bottom: 200px;">
				<p><a href="" target="if_findic"></a></p>
			</div>
<div class="qs_ic_cy"><h4>常用IC站：</h4><a href="https://www.findic.com/search?page=1&key={0}" target="_blank">findic</a><a href="https://search.ickey.cn/?keyword={0}" target="_blank">云汉</a><a href="https://so.szlcsc.com/global.html?k={0}" target="_blank">立创</a><a href="https://s.hqew.com/{0}.html" target="_blank">华强</a><a href="https://www.ichunt.com/s/?k={0}" target="_blank">猎芯</a><a href="https://b2b.baidu.com/s?q={0}" target="_blank">爱采购</a><a href="" target="_blank">ICEasy</a><a href="https://www.infinigo.com/s?wd={0}&search_type=all" target="_blank">道合顺</a><a href="https://www.allchips.com/search?key={0}&type=1&sp=1" target="_blank">硬之城</a><a href="https://www.b1b.com/Search/{0}/" target="_blank">比一比</a><a href="https://www.mouser.cn/c/?q={0}" target="_blank">贸泽</a><a href="https://www.arrow.cn/arrow_product/product/search?keyword={0}" target="_blank">艾睿</a><a href="https://www.ti.com/sitesearch/en-us/docs/universalsearch.tsp?langPref=en-US&searchTerm=#q={0}&numberOfResults=25" target="_blank">TI</a></div>
		</div>`;
            $("body").append(_icQSHtml);
            $("#i_model").keyup(function (e) {
                GM_setValue("_icQSKey", $(this).val().trim());
                icQSWeb.ShowModelInfo();
            });
            let defaultIsShow = GM_getValue("_icQSIsShow", true);
            if (!defaultIsShow) {
                $("#icQS").hide();
                $(".qs_ic_sqhl").text("↓搜↓");
            }
            $(".qs_ic_sqhl").click(function () {
                if ($("#icQS").css("display") == "none") {
                    $("#icQS").show();
                    $(".qs_ic_sqhl").text("↑收↑");
                    GM_setValue("_icQSIsShow", true);
                } else {
                    $("#icQS").hide();
                    $(".qs_ic_sqhl").text("↓搜↓");
                    GM_setValue("_icQSIsShow", false);
                }
            });
            let defaultTxt = GM_getValue("_icQSKey", "");
            if (defaultTxt) {
                $("#i_model").val(defaultTxt);
                icQSWeb.ShowModelInfo(true);
                //删除缓存
                //GM_deleteValue("hello")
            }
            let defaultNowTxt = GM_getValue("_icNowSKey", "");
            if (defaultNowTxt) {
                $(".qs_ic_cy a").each(function () {
                    var _tempUrl = $(this).attr("href");
                    if (_tempUrl.indexOf("{0}") > 0) {
                        _tempUrl = _tempUrl.replace(/\{0\}/g, encodeURIComponent(defaultNowTxt));
                        $(this).attr("href", _tempUrl);
                    }
                });
            }
        },
        ShowModelInfo: function (_toscroll) {
            var vTxt = $("#i_model").val();
            var vArray = vTxt.split("\n");
            var vHtml = "";
            if (vArray.length == 1) {
                vArray = vTxt.split(" ");
            }
            var _nowKeyIndex = 0;
            $.each(vArray, function (i) {
                if (this) {
                    var _tourl = qs_nowUrl;
                    if (_tourl.indexOf("{0}") > 0) { _tourl = _tourl.replace(/\{0\}/g, encodeURIComponent(this)); }
                    else {
                        _tourl = _tourl + encodeURIComponent(this);
                    }
                    if (_tourl.indexOf("{1}") > 0) { _tourl = _tourl.replace(/\{1\}/g, this.substr(0, 1)); }

                    var _theStyle = GM_getValue("_icNowSKey", "") == this ? " color:#069b7e; font-weight: bold;" : "";
                    if (GM_getValue("_icNowSKey", "") == this) { _nowKeyIndex = i; }
                    vHtml += '<p><a style="' + _theStyle + '" onclick="icQSWeb.toICSearch(\'' + _tourl + '\',\'' + encodeURIComponent(this) + '\');" href="javascript:void(0)" >' + this + '</a></p>';
                }
            });
            $("#j_models").html(vHtml);
            if (_toscroll && _nowKeyIndex > 0 && $("#j_models p").eq(_nowKeyIndex)) {
                $("#j_models p").eq(_nowKeyIndex)[0].scrollIntoView(true);
            }

        },
        toICSearch: function (_ptourl, _pnowkey) {
            GM_setValue("_icNowSKey", decodeURIComponent(_pnowkey));
            location.href = _ptourl;
        }
    }

    setTimeout(function () {

        if (typeof ($) == 'undefined' && jQuery) {
            $ = jQuery;
        }
        var _isIc = false;
        $.each(qs_icSites, function (i) {
            if (_thehost.indexOf(this) >= 0) {
                unsafeWindow.qs_nowUrl = qs_icSearchUrls[i];
                unsafeWindow.qs_nowHost = this;
                _isIc = true;
                return false;
            }
        });
        if (_isIc) {
            icQSWeb.init(); 
        } 

    }, 1000);
})();

// 添加 css 样式
function addStyle() {
    let css = `
    .wrap{
        padding: 5px
    }
    
    .h1{
        font-size: 16px;
        color: green;
    }
    
    .des{
        font-size: 10px;
    }
#icQS h3,#icQS h4{
padding:0px;margin:0px;
}
#j_models p{
padding:2px;margin:1px;
}
    .qs_ic_sqhl{ 
position: fixed;
right: 2px;
top: 0px;
width: 30px;
height: 25px;
line-height: 24px; 
z-index: 999999999;
text-align: center;
background-color: #30403c;
color: #fff;
cursor: pointer;
}
#j_models a:hover{
    text-decoration: underline !important;
}
    .qs_ic_cy{
    position: absolute;bottom: 1px;background-color: #ccc;color: green;
}
    .qs_ic_cy h3{ 
}
    .qs_ic_cy a{ 
display: inline-block;min-width: 50px;padding: 3px;text-align: center;
}
    `;

    GM_addStyle(css)
}
