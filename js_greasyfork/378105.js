// ==UserScript==
// @name         查号-电信
// @namespace    mscststs
// @version      0.1
// @description  try to take over the world!
// @author       You
// @require      https://cdn.bootcss.com/axios/0.17.1/axios.js
// @match        http://service.micard.10046.mi.com/ctmiphone/cardSelling_form*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378105/%E6%9F%A5%E5%8F%B7-%E7%94%B5%E4%BF%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/378105/%E6%9F%A5%E5%8F%B7-%E7%94%B5%E4%BF%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.result = [];
    window.getDData = async function getDData(key){
        window.result = []; //重置
        let cities = await fetch("http://service.micard.10046.mi.com/ctmiphone/get_location", {"credentials":"include","headers":{"accept":"application/x-www-form-urlencoded, application/json;q=0.8, text/plain;q=0.5, */*;q=0.2","accept-language":"zh-CN,zh;q=0.9,en-GB;q=0.8,en;q=0.7","content-type":"application/x-www-form-urlencoded","x-requested-with":"rest.js"},"referrer":"http://service.micard.10046.mi.com/ctmiphone/cardSelling_form?channel_code=1004","referrerPolicy":"no-referrer-when-downgrade","body":"place_flag=0&place_code=","method":"POST","mode":"cors"}).then(r=>r.json());
        //console.log(cities);
        for(let city of cities.data){
            let locations = await fetch("http://service.micard.10046.mi.com/ctmiphone/get_location", {"credentials":"include","headers":{"accept":"application/x-www-form-urlencoded, application/json;q=0.8, text/plain;q=0.5, */*;q=0.2","accept-language":"zh-CN,zh;q=0.9,en-GB;q=0.8,en;q=0.7","content-type":"application/x-www-form-urlencoded","x-requested-with":"rest.js"},"referrer":"http://service.micard.10046.mi.com/ctmiphone/cardSelling_form?channel_code=1004","referrerPolicy":"no-referrer-when-downgrade","body":"place_flag=1&place_code="+city.location_code,"method":"POST","mode":"cors"}).then(r=>r.json());
            //console.log(locations);
            for(let location of locations.data){
                let citycode = city.location_code;
                let loccode = location.location_code;
                let res = await fetch("http://service.micard.10046.mi.com/ctmiphone/get_numbers",
                                      {"credentials":"include","headers":{"accept":"application/x-www-form-urlencoded, application/json;q=0.8, text/plain;q=0.5, */*;q=0.2","accept-language":"zh-CN,zh;q=0.9,en-GB;q=0.8,en;q=0.7","content-type":"application/x-www-form-urlencoded","x-requested-with":"rest.js"},"referrer":"http://service.micard.10046.mi.com/ctmiphone/cardSelling_form?channel_code=1004","referrerPolicy":"no-referrer-when-downgrade",
                                       "body":`province_code=${citycode}&city_code=${loccode}&page_index=1&limit=100&condition=${key}`,"method":"POST","mode":"cors"}).then(r=>r.json());
                result.push(...res.data.phone_number_list.map(phone=>{
                    return {
                    province:city.location_name,
                    target_city :location.location_name,
                    code:phone.phone_number,
                    }
                }))
            }
        }
        console.table(result)

    }

    // Your code here...
})();