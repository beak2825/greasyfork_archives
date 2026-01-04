// ==UserScript==
// @name         猫咪
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  猫咪VIP视频播放，去除不必要的广告

// @author       third_e
// @license      MIT

// @include      /^https:\/\/www\.bc68c.*\.(com)*/
// @match        https://*/*

// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATgAAABECAMAAAAiNtlWAAAApVBMVEVHcEz///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+IJwP4AAAAN3RSTlMAQgMMOJG3ESfYWnT/3SxQ8DxV84IijLP7Bhu8F+ThMsj2YKvAlqTDbYdpSZ4JzR5leNLpD326cpJzUQAAB1JJREFUeAHk1oWCqtwCxfEltq5RDHBjEQ6OHjvf/9EuYbFFkHO/9mcH9SfxJ8sp+C35Aj5bsVTGb6hUa/hsdX41kFlTZQufrU12ashG6ZLU8NkK9OgKMij3SAoDn61P32CItzW+6BnhwymCvrGJN9U69Fn4dF8M2A7eoegMTfDpvnnhGkg1HPBCx6eb8uqnjxTmmFczfLo5b0YtJHJs3jTx6X7xTvzCa4bLByY+3YIetcrQcoUX+j8Mrekr479A0UxTM/BbGvQ11gytN/CtzOa2vqtvmxUDgdaIoWmbHhtvMcIZ+1vla8u9SnFYT3/18ai/swQ9Yt3V8MIq153sD4JUq6X5YoUHR/qa+QF9h10ZSm5uCV4Ja94CsCl26CtiTk8VN0dnWlVpH6ylM8QjrbsW4Rh2fTwqaxFlyDaO+/3VIcVoPa1X8IaNKRkiZOxU3ohSC1dlXfBGTIeIYS47fNSZmrhT6dFhTMjq1kB/PqZs3B0C5dOBPAE/9JxxkZ93eCMmJq6GS8Eb4ZZx5zJijojV1mJEtX5EwDlLarj6oaSAQGXPC+lYtDgwQs1BpvX4bNLHVTBqC1C6bQUb12YcuzgEVjMHWNn0LBEyvxghdAOBWocRo8Kb4WojPlFnCjwNSga42FBiIdA4ULbvw7MTlIgmorYdxlEXuAi6ihU8yq7DVzp1Bb4WfScEch3Kfsrw6JTZuXfClXuMdQ7G+s0oUUZoR0kbvv6Iz6pH+f8hUcAjnS+I7eNi2BUAG4tJwgvkNn0OfA2Vz6wVUOQztZIeTqvyheoQQI2SGkJ7Ro0V+AaMM0Wbcb7yuCvyJbG4r62eBmChMtkhB09rTzJ4Z+wZR8eMcdZKWjh5C5HXh3Fg1ASBBiUn+BzGq3UYq4ubLRMchvDVOGoHr4JpRA0epd5hJUweSzQFY81Swq32TOACmDNKNYCYr+0yPMqY8QTjdfK4qNhMMoWvUMxLjdPKYdMzABzVjDM2MpLD6UxUADRKFvCNYxoDbWY1w8WZiUQDN03Bd4gFbmbMykkM1xBMdAZwjkvUoqQB34RZ7RHKMYWLq4bN93QquLKY1SAxXI8pKkCTUeNwfHGTOdrMbINAiSlUA6F8le/arxDSmJk4JoSrME0XUEaMMgHlwKgmfAtm58A3FEzTQsjl+3SEHGa3SAg3Z5o1gC6jTs+FvhT4TsyuiDcP9zsETEFZ+pGxyOxOCeH2TCPywEY8xZzGH+KnzK4EX4+plgj8MIszAgNmN30dTmM6M2apNqtO/EVFSfp66aqMsmp1O+7sMGJUtejKX33D1+Izq97alDe5ncVnhbgtRHVdWy7c7gpG9F6HazNK9P7Xzl1ot4oFUBjecasQh1SYXqMrRgze/83GrsJPiJ/DyF6eoF/geDv66KIjxRdz2uPrJj4NbhWn2DakDuHUSD+GnrRbZgnX+cj6+h6fbZoxGk9f+2zTVFnjSaOj4SKW8HpE2c1mbTxOgQ8z4WKKfJbUpIdCVuZSCRui2MBU4Sr9vRsSbs6riHC+/XD4MM4qbaai8BsfasJ9PcmOBXx4GO7++/wzNlyn3bpKZpaW6xDunV3GNkuBXDieQlPAHWwslNDMvBAukFjwbXgGTmCx5REQbnoFOI57tAmHHgFv/Ws214V7xYY7FzUt8gXtAntw+R2ilSE4VlP9ZzHhG94He3DK6eZsF+bgOqjNEdzWu1W4Tm6vzBjcnI00psuafGsNrrG3++6GBuHi5JtaVlY8FwCOLbic3tRHGYQL0JFGUK4EduG6OWOd5uA2aHgi4N1YggMKJgWvD+fEcVw7DPdJDBt7y5vDbeI4LhEuf/C5fSU4JDj8qraUnVfw3gAODoTLqx5ePBYuN4Qbs23LPKMQtgqneRZcxJ/6lnA1driYFe7VLpx/x7w1zMJNeW9MHeM7duG05OZzmYWrokpH8AP71uFW3Nw3DFd2UnU6m8CL1O/rlCW5VuEqWMbwSYbhNOY0FgdH2EC/swrH7R8Nw6GViZV+5RoXUdmHe8CkoHE4PvUfn/UzzzHnsa3DcWquI+Nw4jU70Xe6ycDhtK2sw2FYut+wABe63NQNRtPVe+23rK/CQsAtnPxhxJebw/GiGVyjfTjVMCmYiHMluLjX65X2wDW2J7htGybgpr1eL8yHa2Ltwk3gPmcPK7G8YOBhAC7MHVbCIoyZBbgTV6jMVRi4Nu7DPFylderyuJ19OG+LSUHjcFzwnZ2XiazD8U9GnYU9OD1sj3EbqkhwQxedRPNwGt4fdGsNZR+Oo11uaBMOfSum3lDB4B4xKWgDTuXIzWFzO1LR4Mov++fQ38zBSc3961PjpooHp8H+qeA7k3DSLMhk+1SSigg3cb+O458LN7lPpL4fLuCGqVRrTrqTVfMlK3CP94m0hYy/TwoijUQWkrxeIk1lZ9FLxNfRKXej8evX4s5tjaNu+YgL8/6y7CUSSmr0Eunqr/i9RB6yPlwc/b8YIhUr3uTBb048FTzl1rPOyf95UHb+AKcHzg2wl999AAAAAElFTkSuQmCC
// @grant        none
// @run-at       document-start

// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @require      https://update.greasyfork.org/scripts/484741/1311035/ajax-hook-thirde-V2.js
// @downloadURL https://update.greasyfork.org/scripts/473549/%E7%8C%AB%E5%92%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/473549/%E7%8C%AB%E5%92%AA.meta.js
// ==/UserScript==

(function() {
    'use strict';


    var base64decoder = function (Context) {
        let tmp = CryptoJS.enc.Base64.parse(Context); // encryptedWord via Base64.parse()
        return CryptoJS.enc.Utf8.stringify(tmp);
    };
    var encrypt = function (data, suffix) {
        var key = "SWRUSnEwSGtscHVJNm11OGlCJU9PQCF2ZF40SyZ1WFc=";
        var iv = "JDB2QGtySDdWMg==";
        var sign_key = "JkI2OG1AJXpnMzJfJXUqdkhVbEU0V2tTJjFKNiUleG1VQGZO";
        let new_key = base64decoder(key);
        let new_iv = base64decoder(iv);
        new_iv = CryptoJS.enc.Utf8.parse(new_iv + suffix);
        new_key = CryptoJS.enc.Utf8.parse(new_key);
        let encrypted = CryptoJS.AES.encrypt(data, new_key,
            {
                iv: new_iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
                formatter: CryptoJS.format.OpenSSL
            });
        return encrypted.toString();
    };
    var decrypt = function (data, suffix) {
        var key = "SWRUSnEwSGtscHVJNm11OGlCJU9PQCF2ZF40SyZ1WFc=";
        var iv = "JDB2QGtySDdWMg==";
        var sign_key = "JkI2OG1AJXpnMzJfJXUqdkhVbEU0V2tTJjFKNiUleG1VQGZO";
        let new_key = base64decoder(key);
        let new_iv = base64decoder(iv);
        new_iv = CryptoJS.enc.Utf8.parse(new_iv + suffix);
        new_key = CryptoJS.enc.Utf8.parse(new_key);
        let decrypted = CryptoJS.AES.decrypt(data, new_key, {
            iv: new_iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
            formatter: CryptoJS.format.OpenSSL
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    };

    // 请求监听
    const { unHook, originXhr } = ah.proxy({
        onRequest: (config, handler) => {
            if (config.url === 'https://mj.pki.net.cn/build2//images/user-center/info/vip-card-bg.png'||
               config.url === 'https://mj.pki.net.cn/build2//images/header/dwn.gif'
               ) {
                handler.resolve({
                    config: config,
                    status: 200,
                    headers: {'content-type': 'text/text'},
                    response: ''
                })
            } else {
                handler.next(config);
            }
        },

        onResponse: (response, handler) => {
            if(response.headers["content-type"] != "video/mp2t"){
                console.log("====",response)
            }
            // 账号信息修改
            if (response.config.url.indexOf("api/user/loginByUsername") != -1 ) {
                console.log("====",response)
                // 转换成json对象
                var modifyResponse = modifyResponse = JSON.parse(response.response)
                modifyResponse.code = 0
                // 获取加密数据
                var data = modifyResponse.data;
                var suffix = modifyResponse.suffix;


                //console.log(self)
                // 解密
                var tmp = decrypt(data,suffix)
                console.log('解密数据：',tmp)
                var data_jiemi = JSON.parse(tmp)

                // VIP
                data_jiemi.data.vip_level = 2;
                data_jiemi.data.val_time = 1805152389411;
                data_jiemi.data.is_vip =2;

                data_jiemi = JSON.stringify(data_jiemi)
                data_jiemi = encrypt(data_jiemi, suffix);
                modifyResponse.data = data_jiemi
                response.response = JSON.stringify(modifyResponse)
            }
            if (response.config.url.indexOf("api/message/unseenCount") != -1
                || response.config.url.indexOf("api/user/getTopics") != -1
               || response.config.url.indexOf("data/topic/detail-52.js") != -1) {
                console.log("====",response)
                // 转换成json对象
                var modifyResponse_v = modifyResponse_v = JSON.parse(response.response)
                modifyResponse_v.code = 0
                // 获取加密数据
                var data_v = modifyResponse_v.data;
                var suffix_v = modifyResponse_v.suffix;


                // 解密
                var tmp_v = decrypt(data_v,suffix_v)
                console.log('解密数据：',tmp_v)
                var data_jiemi2 = JSON.parse(tmp_v)

                data_jiemi2.unseen_count = 10

                data_jiemi2 = JSON.stringify(data_jiemi2)
                data_jiemi2 = encrypt(data_jiemi2, suffix_v);
                modifyResponse_v.data = data_jiemi2
                response.response = JSON.stringify(modifyResponse_v)
            }

            if ( response.config.url.indexOf("data/topic/detail-") != -1) {
                console.log("====",response)
                // 转换成json对象
                var modifyResponse_detail = modifyResponse_detail = JSON.parse(response.response)
                modifyResponse_detail.code = 0
                // 获取加密数据
                var data_detail = modifyResponse_detail.data;
                var suffix_detail = modifyResponse_detail.suffix;


                // 解密
                var tmp_detail = decrypt(data_detail,suffix_detail)
                console.log('解密数据：',tmp_detail)
                var data_jiemi_detail = JSON.parse(tmp_detail)

                //data_jiemi_detail.list.free_list=[]
                //data_jiemi_detail.list.free_videos_id=""
                data_jiemi_detail.list.free_list = data_jiemi_detail.list.list
                data_jiemi_detail.list.videos_id=""

                data_jiemi_detail = JSON.stringify(data_jiemi_detail)
                data_jiemi_detail = encrypt(data_jiemi_detail, suffix_detail);
                modifyResponse_detail.data = data_jiemi_detail
                response.response = JSON.stringify(modifyResponse_detail)
            }

            handler.next(response)
        }
    })
    // Your code here...
})();