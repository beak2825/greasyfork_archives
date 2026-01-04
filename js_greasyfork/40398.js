// ==UserScript==
// @name            EugeneLiu
// @icon            https://d32kak7w9u5ewj.cloudfront.net/media/image/2017/10/382f873c678a418c9f8f3ce8a2485378.jpg
// @version         2.1.2
// @include         *
// @copyright       2018, AC
// @description     自动推荐智能的标签
// @author          刘一辰，黄嘉晟
// @note            2018.4.7-00:17-V1.1 第一版本
// @grant           none
// @require         http://code.jquery.com/jquery-1.11.0.min.js
// @namespace http://www.eugeneliu.xyz
// @downloadURL https://update.greasyfork.org/scripts/40398/EugeneLiu.user.js
// @updateURL https://update.greasyfork.org/scripts/40398/EugeneLiu.meta.js
// ==/UserScript==
(function () {
    document.body.innerHTML += "<input type='text' style='position: fixed;margin: 0 40%;top: 50px;text-align: center;color: red' id='EugeneInput'></input>";
    $("a").hover(function () {
            document.getElementById('EugeneInput').value = '';
            console.log("开始请求数据");
            $.ajax(
                {
                    //url: "http://localhost/requestTag",
                    url: "https://www.eugeneliu.top/server/requestTag",
                    type: "POST",
                    data: {"requestUrl": $(this).attr('href')},
                    success: function (result) {
                        console.log('result->' + result);
                        result = JSON.parse(result);
                        var recommendedTag = result.tag;
                        console.log("originalTag->" + recommendedTag);
                        recommendedTag = decodeURIComponent(recommendedTag);
                        console.log('decodedRecommendedTag->' + recommendedTag);
                        document.getElementById('EugeneInput').value = recommendedTag;
                    },
                    error: function (result) {
                        console.log(result);
                    }
                });
        }, function () {
            console.log('mouse out');
        }
    );
    $("a").click(function () {
        var linkHref = $(this).attr('href');
        if (linkHref.indexOf("javascript") > 0) {

        } else {
            if (linkHref.indexOf("https") === 0 || linkHref.indexOf("http") === 0) {

            }else if(linkHref.indexOf("/")==0){
                linkHref = "http:"+linkHref;
            }
            else {
                var url = window.location.href;
                var baseUrl = url.substring(url.indexOf(0, url.lastIndexOf("/")));
                var completeUrl = baseUrl + linkHref;
            }
            window.location.href = linkHref;
        }
    });
})();