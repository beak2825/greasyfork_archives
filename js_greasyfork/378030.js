// ==UserScript==
// @name         QQ轻聊版位置信息链接地址修复
// @namespace    mscststs
// @version      0.2
// @description  修复轻聊版QQ的地址跳转
// @author       mscststs
// @require      https://cdn.bootcss.com/axios/0.17.1/axios.js
// @match        http://apis.map.qq.com/uri/1/geocoder*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378030/QQ%E8%BD%BB%E8%81%8A%E7%89%88%E4%BD%8D%E7%BD%AE%E4%BF%A1%E6%81%AF%E9%93%BE%E6%8E%A5%E5%9C%B0%E5%9D%80%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/378030/QQ%E8%BD%BB%E8%81%8A%E7%89%88%E4%BD%8D%E7%BD%AE%E4%BF%A1%E6%81%AF%E9%93%BE%E6%8E%A5%E5%9C%B0%E5%9D%80%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let url = window.location.href;
    if(url.indexOf("apis.map.qq.com/uri/1/geocoder")>=0){
        let target = url.replace("http://apis.map.qq.com/uri/1/geocoder?latlng=","https://apis.map.qq.com/ws/geocoder/v1/?key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&get_poi=1&location=");
        getApi(target);
    }
    async function getApi(url){
        try{
            let api = await axios({
				url,
				method:"get",
				data: {},
				withCredentials: true,
                json:true,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).then(function (res) {
				return res.data;
			});

            if(api.status != 0){
                //反向地址解析出错
                throw new Error(api.message);
            }

            let params = [];
            params.push("type=marker");
            params.push("isopeninfowin=1");
            params.push("markertype=1");
            params.push(`name=${api.result.ad_info.name}`);
            params.push(`addr=${api.result.formatted_addresses.recommend}`);
            params.push(`pointy=${api.result.location.lat.toString().padEnd(9,"0")}`);
            params.push(`pointx=${api.result.location.lng}`);
            params.push(`coord=${api.result.location.lat.toString().padEnd(9,"0")},${api.result.location.lng}`);
            params.push(`ref=macqq`);

            window.location.href = "https://map.qq.com/?"+encodeURI(params.join("&"));


        }catch(e){
            console.log(e);
        }
    }
    // Your code here...
})();