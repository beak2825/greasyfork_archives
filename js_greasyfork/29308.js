// ==UserScript==
// @name         Better E-Hentai
// @namespace    pikashi@gmail.com
// @version      0.6.1
// @description  在EHT首页，搜索页显示打包下载链接
// @author       pks
// @match        https://exhentai.org/*
// @match        https://e-hentai.org/*
// @match        https://g.e-hentai.org/*
// @grant        none
// @icon        https://exhentai.org/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/29308/Better%20E-Hentai.user.js
// @updateURL https://update.greasyfork.org/scripts/29308/Better%20E-Hentai.meta.js
// ==/UserScript==

var loadJQ, main;

loadJQ = function(callback) {
    var e;

    e = document.createElement('script');
    e.setAttribute('src', '//cdn.bootcss.com/jquery/1.12.4/jquery.min.js');
    e.addEventListener('load', function() {
        var script;

        script = document.createElement('script');
        script.textContent = "(" + callback.toString() + ")();";
        document.body.appendChild(script);
    });
    document.body.appendChild(e);
};

main = function() {
    if($('.itg .id1').length > 0)
    $('<a id="ardown" href="javascript:;" style="position:fixed;display:block;bottom:45px;right:20px;z-index:999;color:red"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAADCklEQVR42jWSa0yTZxTH3xh1M6OojNZhESk2tC8F21phSFFhwxszeBl4wQvglRgiFyGiw0SiLjMkJjI3r9sXp4vGG9GEuWiWzEU/TP2whcRIouKghdIWBUpFlN/O27En+X84ec7v/M85z6MoijJeNFE0SRSlGBN3zHU6btfmzfd+vWzBQE1edk+G0353XEJSpdzHimJEkyO5/4MT4+JUo5ry8NG21XBwI3yzFprWwxGJvyriz60FmFJS28YbDG7J14umKBFHvd6cNtv+moNl8MNuOFcP927C/Vb44xac3gPNpVJkDel2+/CkGEOWcAYNjjJYUv6mYZOANbB/OfzyE9oZHuG/c+cy1OTA8RKoW8kMNbVDuHhFiUsqvrx2sbhVSYtSfV8+tJ5naBiCwSBvtAK3f4bqBeIsIxwr5nzhQpRPTLVKvGq7Q73M1rwTGmXWujxoOUtI4EAgQPitwLd+hN2ZUL8CDn1Jf+VSzLIfZWm6q4tDm2VBMm9DIVTNg6snInCv3xfp4N31U/TtTIM9i8S9QIrkk5/h6FVWu9PDHBbH/cvgyncMdjwn0N5Gr7j6fD34A0F6JR548Yyw3L+tSIe9SyjKcoaV7DlODweKxFXgEzURx9dh8HZ14O324ul8QXBoNDL74LfVvBM4VP0ZOa40v6JLst59Vi5gk7hXyFzf1+IPvafT30fnPy/p8vl5NQT9J/fSUabCgUU8KMtCb7Y8ViYkzCqpyM2Ao2uk9QL6yx2ELjXTF4JOT3ekC/+1M7SXmhmszBY4l/JcBx8aTQ3aO8dOSLQ8ubFOnqJJFlb7Ob7tafT81sLoKHge/MrzMivBXS75eblcKJxLtEn1CmfT4KlT9NOd0SbLwMUiqdz4hSxENr5vMUP3WhjRdlGVKnEO51a5MJhtI1NjY5cLl6zB0Zp7zDRj5gczLX8Vux20bnDTvsVFe4mFtlI719Z/SrHbjs5kfar7eNoKybeKTBr80dgn1/5qvC5+Vp1uZvLvqqp6MlOtgzabrXtyovV+VIK5cazV5DHQ+C8MPO7MdCCW4AAAAABJRU5ErkJggg==" class="tn" style="margin-left: -2px;" alt="Archive" title="显示打包下载链接"</a>').appendTo('body');
    $('#ardown').click(function(){
        if ($('.archive').length === 0) {
            $('.id44 div[style^="float"]').each(function(index,element){
                $('<span class="archive"></span>').appendTo(element);
                var url = $(element).closest('.id1').find('.id2 a')[0].href;
                $(element).find('.archive').load(url + ' #gd5>.g2.gsp>a[onclick^="return popUp"]',function(){
                    $(element).find('.archive>a').html('<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAADCklEQVR42jWSa0yTZxTH3xh1M6OojNZhESk2tC8F21phSFFhwxszeBl4wQvglRgiFyGiw0SiLjMkJjI3r9sXp4vGG9GEuWiWzEU/TP2whcRIouKghdIWBUpFlN/O27En+X84ec7v/M85z6MoijJeNFE0SRSlGBN3zHU6btfmzfd+vWzBQE1edk+G0353XEJSpdzHimJEkyO5/4MT4+JUo5ry8NG21XBwI3yzFprWwxGJvyriz60FmFJS28YbDG7J14umKBFHvd6cNtv+moNl8MNuOFcP927C/Vb44xac3gPNpVJkDel2+/CkGEOWcAYNjjJYUv6mYZOANbB/OfzyE9oZHuG/c+cy1OTA8RKoW8kMNbVDuHhFiUsqvrx2sbhVSYtSfV8+tJ5naBiCwSBvtAK3f4bqBeIsIxwr5nzhQpRPTLVKvGq7Q73M1rwTGmXWujxoOUtI4EAgQPitwLd+hN2ZUL8CDn1Jf+VSzLIfZWm6q4tDm2VBMm9DIVTNg6snInCv3xfp4N31U/TtTIM9i8S9QIrkk5/h6FVWu9PDHBbH/cvgyncMdjwn0N5Gr7j6fD34A0F6JR548Yyw3L+tSIe9SyjKcoaV7DlODweKxFXgEzURx9dh8HZ14O324ul8QXBoNDL74LfVvBM4VP0ZOa40v6JLst59Vi5gk7hXyFzf1+IPvafT30fnPy/p8vl5NQT9J/fSUabCgUU8KMtCb7Y8ViYkzCqpyM2Ao2uk9QL6yx2ELjXTF4JOT3ekC/+1M7SXmhmszBY4l/JcBx8aTQ3aO8dOSLQ8ubFOnqJJFlb7Ob7tafT81sLoKHge/MrzMivBXS75eblcKJxLtEn1CmfT4KlT9NOd0SbLwMUiqdz4hSxENr5vMUP3WhjRdlGVKnEO51a5MJhtI1NjY5cLl6zB0Zp7zDRj5gczLX8Vux20bnDTvsVFe4mFtlI719Z/SrHbjs5kfar7eNoKybeKTBr80dgn1/5qvC5+Vp1uZvLvqqp6MlOtgzabrXtyovV+VIK5cazV5DHQ+C8MPO7MdCCW4AAAAABJRU5ErkJggg==" class="tn" style="margin-left: -2px;" alt="Archive" title="Archive download">');
                });
            });
        }
    });
};

loadJQ(main);

