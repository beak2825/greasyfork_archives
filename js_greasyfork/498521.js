// ==UserScript==
// @name         temple爬虫
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  爬虫
// @author       You
// @match        *://*.fjdh.cn/ffzt/fjhy/sydhhy*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=realme.com
// @grant      https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498521/temple%E7%88%AC%E8%99%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/498521/temple%E7%88%AC%E8%99%AB.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var country = '中国';
    var province = '江苏省';
    var paragraphs = $('.zwzw').find('p');
    //var paragraphs = $('.zwzw').find("div:eq(2)").find('div');
    let h1 = $('#zwnr').find('h1').text()
    let h1_index = h1.indexOf('佛教寺庙地址及电话')
    if(h1_index!== -1){
        province = h1.slice(0, h1_index);
    }

    //var targetString = '-------------------------------------------------------------------------------------';
    //var targetString = '－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－';
    var targetString = '----------------------------------------------------------------------';
    let temples = new Map();
    let this_cidy = []
    let city = ''
    let is_star = 0
    let pcdata = []
    if(1){
    paragraphs.each(function(index, element) {
        // console.log('Paragraph ' + (index + 1) + ': ' + $(element).find('strong').text());
        let text = $(element).text();
        if(text.trim().length === 0) {
            // 空白字符串
            if(paragraphs.length=== (index + 1) ){
                // 最后加入数组
                //temples.push(this_cidy)
            }
            return;
        }
        if (text.indexOf('寺院名称') !== -1) {
            return;
        }
        console.log('Paragraph ' , text)
        if (text.indexOf(targetString) !== -1) {
            // 县分割线
            if(is_star==1){
                //temples.push(this_cidy)
            }
            console.log(this_cidy[0], this_cidy.length -1)
            this_cidy = [];
            is_star = 1
        }else{
            this_cidy.push(text)
        }

        let name = $(element).find('strong').text()
        let url = $(element).find('a').attr('href')
        if(!name){
        //console.log('strong', text)
            if(text.indexOf('注：')!==-1){
                return false;
            }
            let matchsi = text.match(/^(.*?)(寺)/);
            if (matchsi) {
                name = matchsi[1] + '寺';
                console.log(name);
            }
        }
        if(text.indexOf('衢州') !== -1){
            city = '衢州'
        }else if(text.indexOf('台州市') !== -1){
            city = '台州市'
        }else
        if(this_cidy.length=== 1 ){
            // 城市过滤
            city = text.trim()
        }
        else if(name){
            // 寺庙
            let this_temple = {
                'country':country,
                'province':province,
                'city':city,
                'name' : name,
                'url' : url,
                'address' : '',
                'contacts' : '',
                'postal' : '',
                'phone' : '',
            }
            if(!url){
                this_temple.url='';
            }
            let tempDiv = $('<div>').html($(element).html());
            tempDiv.find('strong').remove();
            let text2 = tempDiv.text()
            text2 = text2.replace(/:/g, "：");
            text2 = text2.replace('—', "-");
            let text2_arr = text2.split(/[\s\t]+/)
            for (let item of text2_arr) {
                if(item){
                    if(item.indexOf('地址：')!== -1){
                        this_temple.address = item.substring(3);
                    }
                    if(item.indexOf('联系人：')!== -1){
                        this_temple.contacts = item.substring(4);
                    }
                    if(item.indexOf('电话：')!== -1){
                        this_temple.phone = item.substring(3);
                    }else if(item.indexOf('手机：')!== -1){
                        this_temple.phone = item.substring(3);
                    }
                    if(item.indexOf('邮编：')!== -1){
                        this_temple.postal = item.substring(3);
                    }
                }
            }
            //if(name=='宁乡县香山古寺') console.log(this_temple)
            let city_temp = temples.get(city)
            if (!city_temp) {
                city_temp = []
            }
            city_temp.push(this_temple)
            temples.set(city, city_temp)

            //console.log(temples)
            return ;
            if(0){
                text = text.replace(name, "");
                text = text + ' '
                // 使用正则表达式匹配地址、联系人和电话

                // const addressMatch = text.match(/地址：(.+?)\p{Zs}+/u);
                const addressMatch = text.match(/\s*地址：(.+?)\s+/);
                const contactMatch = text.match(/联系人：(.+?)\s+/);
                const phoneMatch = text.match(/电话：(\d+)/);
                const ybMatch = text.match(/邮编：(\d+)/);

                if (addressMatch) {
                    this_temple.address = addressMatch[1]; // 第一个括号内的内容即为匹配到的地址
                }
                if (contactMatch) {
                    this_temple.contacts = contactMatch[1]; // 同上，匹配到的联系人
                }
                if (ybMatch) {
                    this_temple.postal = ybMatch[1]; // 匹配到的电话号码
                }
                if (phoneMatch) {
                    if(text.indexOf('-') !== -1){
                        // 包含区号-的电话
                        let phoneMatch2 = text.match(/\b\d{3,5}-\d+\b/);
                        this_temple.phone = phoneMatch2[0]
                        //console.log('phoneMatch2', phoneMatch2)
                    }else{
                        this_temple.phone = phoneMatch[1]; // 匹配到的电话号码
                    }
                }
                //console.log('寺庙:', this_temple )
            }
            if(0){
                if (text.indexOf('地址：') !== -1 ) {
                    let splitResult = text.split("地址：").map(item => item.trim()); // 分割并去除两边的空白字符
                    if(splitResult[0]){
                        this_temple.name = splitResult[0]
                        text = splitResult[1]
                    }
                }else if( text.indexOf('地址:') !== -1) {
                    let splitResult = text.split("地址:").map(item => item.trim()); // 分割并去除两边的空白字符
                    if(splitResult[0]){
                        this_temple.name = splitResult[0]
                        text = splitResult[1]
                    }
                }
                console.log('地址:', text)
                if (text.indexOf('电话：') !== -1 ) {
                    let splitResult = text.split("电话：").map(item => item.trim()); // 分割并去除两边的空白字符
                    if(splitResult[0]){
                        this_temple.address = splitResult[0]
                        text = splitResult[1]
                    }
                }else if( text.indexOf('电话:') !== -1) {
                    let splitResult = text.split("电话:").map(item => item.trim()); // 分割并去除两边的空白字符
                    if(splitResult[0]){
                        this_temple.address = splitResult[0]
                        text = splitResult[1]
                    }
                }
            }
        }
        if(paragraphs.length=== (index + 1) ){
            // 最后加入数组
            //temples.push(this_temple)
        }
    });
    }
    if(0){
        let divp = $('.zwzw').find("p:eq(5)")
        var content = divp.html().replace(/<br\s*\/?>/g, '\n');

        // 将内容按行分割为数组
        var lines = content.split('\n');

        // 遍历数组并输出每一行的数据
        for (var i = 0; i< lines.length; i++) {
            console.log(lines[i]);
        }
    }
    console.log(country, province, temples)
    let pdata = []
    for (let item of temples) {
        pdata.push(item[1]);
    }
    //pcpage({data:JSON.stringify(pdata), province:province})

    function asfadf(params){
        let url="https://w.mingxingshangyejiazhi.com/star/pc/pc_temples"
        // let queryString = new URLSearchParams(params).toString();
        let pdata = []
        for (let item of params) {
            //pdata[item[0], item[1])
            pdata.push(item[1]);
        }
        console.log(pdata)
        return false;

        // 现在你可以将这个查询字符串作为POST请求的一部分发送
        // 例如，使用 fetch API：
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: queryString
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch((error) => {
            console.error('Error:', error);
        });
    }
    function pcpage(pcdata){
      $.ajax({
          url:"https://w.mingxingshangyejiazhi.com/star/pc/pc_temples",
          type: 'post',
          dataType: 'json',
          data:pcdata,
          success:function(e){
              console.log(e)
          },
          error:function(e){
              console.log(e)
          }
      });
    }
})();